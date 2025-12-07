# FileIndex - 文件路径补全系统

## 概述

FileIndex 是 Claude Code 的文件路径自动补全系统，用于 `@` mention 和工具参数中的路径补全。它使用 **Rust 原生模块** 作为主引擎，**Fuse.js** 作为降级方案。

**核心特点：**
- 基于 ripgrep 的文件发现
- 60 秒 TTL 缓存
- 模糊搜索匹配
- 按需构建索引（非启动时）

---

## 目录

- [1. 系统架构](#1-系统架构)
- [2. 触发条件](#2-触发条件)
- [3. 索引构建流程](#3-索引构建流程)
- [4. 缓存机制](#4-缓存机制)
- [5. 搜索算法](#5-搜索算法)
- [6. 函数参考](#6-函数参考)

---

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    FileIndex 系统架构                            │
│                     chunks.138.mjs                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     入口函数                              │   │
│  │                  autocompleteFiles (x09)                  │   │
│  │                  chunks.138.mjs:2102                      │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│              ┌────────────┴────────────┐                        │
│              │   缓存是否过期? (60s)    │                        │
│              └────────────┬────────────┘                        │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                   │
│         │ 是              │                 │ 否                │
│         ▼                 ▼                 ▼                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ 后台刷新     │  │ 首次调用     │  │ 使用缓存     │          │
│  │ refreshIndex │  │ 等待初始化   │  │ searchIndex  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   索引构建 (NO3)                          │   │
│  │                                                          │   │
│  │  1. ripgrep --files 发现文件                             │   │
│  │  2. 提取目录前缀                                         │   │
│  │  3. 加载到 FileIndex                                     │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│              ┌────────────┴────────────┐                        │
│              │    Rust 模块可用?        │                        │
│              └────────────┬────────────┘                        │
│                           │                                      │
│         ┌─────────────────┼─────────────────┐                   │
│         │ 是              │                 │ 否                │
│         ▼                 │                 ▼                   │
│  ┌──────────────────┐     │    ┌──────────────────────┐        │
│  │ Rust FileIndex   │     │    │   Fuse.js 降级       │        │
│  │ (file-index.node)│     │    │   (内存搜索)         │        │
│  │ 高性能原生搜索   │     │    │   模糊匹配           │        │
│  └──────────────────┘     │    └──────────────────────┘        │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
                    返回补全结果
```

---

## 2. 触发条件

### 何时触发文件路径补全

| 场景 | 触发方式 | 示例 |
|------|---------|------|
| **@ mention** | 用户输入 `@` 后跟路径 | `@src/comp` → 补全为 `src/components/` |
| **工具参数** | Read/Edit/Glob 等工具的 file_path | `file_path: "./sr"` |
| **Bash 命令** | 命令行路径参数 | `cat ./src/` |

### 补全触发流程

```javascript
// 用户输入触发 autocompleteFiles
// Location: chunks.138.mjs:2102

async function autocompleteFiles(query, forceRefresh = false) {
  // query 示例: "src/comp", "./utils/", "@package"

  // 空查询特殊处理
  if (query === "" || query === "." || query === "./") {
    return listCurrentDirectory();  // 返回当前目录内容
  }

  // 检查缓存有效性
  let isStale = Date.now() - lastRefreshTimestamp > 60000;  // 60秒

  // 首次调用或缓存过期时刷新
  if (!cachedFileIndex && cachedFileList.length === 0) {
    refreshIndexCache();
    await refreshPromise;  // 首次需等待
  } else if (isStale) {
    refreshIndexCache();   // 后台刷新，不阻塞
  }

  // 执行搜索
  return searchFileIndex(cachedFileIndex, cachedFileList, normalizedQuery);
}
```

---

## 3. 索引构建流程

### ripgrep 文件发现

```
┌─────────────────────────────────────────────────────────────────┐
│                    索引构建流程 (NO3)                            │
│                  chunks.138.mjs:1976-1998                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: 运行 ripgrep 发现文件                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  $ rg --files --follow --hidden --glob '!.git/'           │  │
│  │                                                           │  │
│  │  参数说明:                                                │  │
│  │    --files      : 仅列出文件名（不搜索内容）              │  │
│  │    --follow     : 跟随符号链接                            │  │
│  │    --hidden     : 包含隐藏文件                            │  │
│  │    --glob '!.git/' : 排除 .git 目录                       │  │
│  │    --no-ignore-vcs : 可选，忽略 .gitignore                │  │
│  │                                                           │  │
│  │  超时: 10 秒                                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  Step 2: 收集额外目录文件                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  getAdditionalFiles() - qO3                               │  │
│  │  合并来自 --add-dir 参数的额外目录                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  Step 3: 提取目录前缀                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  extractDirectoryPrefixes(files) - wO3                    │  │
│  │                                                           │  │
│  │  输入: ["src/components/Button.tsx",                      │  │
│  │         "src/utils/helpers.ts"]                           │  │
│  │                                                           │  │
│  │  输出: ["src/", "src/components/", "src/utils/"]          │  │
│  │                                                           │  │
│  │  目的: 支持目录级别的补全                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  Step 4: 加载到索引引擎                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  if (rustIndex) {                                         │  │
│  │    rustIndex.loadFromFileList(allPaths);                  │  │
│  │  } else {                                                 │  │
│  │    fuseJsFallbackList = allPaths;  // 降级                │  │
│  │  }                                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 构建函数实现

```javascript
// ============================================
// buildFileIndex (NO3)
// Location: chunks.138.mjs:1976-1998
// ============================================

async function buildFileIndex() {
  let abortController = createAbortController();
  let timeoutId = setTimeout(() => abortController.abort(), 10000);

  try {
    let respectGitignore = getConfig().respectGitignore ?? true;

    // ripgrep 参数
    let rgArgs = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!respectGitignore) rgArgs.push("--no-ignore-vcs");

    // 并行获取文件列表
    let [rgFiles, additionalFiles] = await Promise.all([
      runRipgrep(rgArgs, ".", abortController.signal)
        .then(files => files.map(f => path.relative(getCwd(), f))),
      getAdditionalFiles()
    ]);

    // 合并所有文件
    let allFiles = [...rgFiles, ...additionalFiles];

    // 添加目录前缀
    let allPaths = [...extractDirectoryPrefixes(allFiles), ...allFiles];

    // 尝试加载 Rust 索引
    let rustIndex = await getFileIndex();
    let fuseJsFallback = [];

    if (rustIndex) {
      try {
        rustIndex.loadFromFileList(allPaths);
      } catch (error) {
        log(`[FileIndex] Rust index failed, using Fuse.js fallback`);
        fuseJsFallback = allPaths;
      }
    } else {
      fuseJsFallback = allPaths;
    }

    return { fileIndex: rustIndex, fileList: fuseJsFallback };
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

## 4. 缓存机制

### 缓存变量

```javascript
// Location: chunks.138.mjs:2131-2143

let fileIndexInstance = null;    // PZ1 - Rust FileIndex 单例
let useFuseJsFallback = false;   // PJ0 - 是否使用 Fuse.js
let cachedFileIndex = null;      // SJ0 - 缓存的索引实例
let cachedFileList = [];         // _J0 - 缓存的文件列表
let refreshPromise = null;       // fXA - 正在进行的刷新 Promise
let lastRefreshTimestamp = 0;    // k09 - 上次刷新时间戳

// 配置常量
const cacheTTL = 60000;          // $O3 - 60 秒 TTL
const maxResults = 15;           // sPA - 最大返回结果数
```

### 缓存刷新逻辑

```javascript
// ============================================
// refreshIndexCache (jJ0)
// Location: chunks.138.mjs:2077-2086
// ============================================

function refreshIndexCache() {
  // 防止并发刷新（Promise 去重）
  if (!refreshPromise) {
    refreshPromise = buildFileIndex()
      .then((result) => {
        cachedFileIndex = result.fileIndex;
        cachedFileList = result.fileList;
        lastRefreshTimestamp = Date.now();
        refreshPromise = null;
        return result;
      })
      .catch((error) => {
        log(`[FileIndex] Cache refresh failed: ${error.message}`);
        refreshPromise = null;
        return { fileIndex: null, fileList: [] };
      });
  }
  // 返回现有 Promise 或 undefined（后台刷新）
}
```

### 缓存策略图

```
┌─────────────────────────────────────────────────────────────────┐
│                      缓存策略                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  时间线:                                                        │
│  ─────────────────────────────────────────────────────────────  │
│  │ 首次调用 │    60秒内    │   60秒后   │                      │
│  ─────────────────────────────────────────────────────────────  │
│  │ 同步等待 │  使用缓存    │ 后台刷新  │                       │
│  │ 构建索引 │  立即返回    │ 使用旧缓存 │                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  特点:                                                          │
│  ✓ 首次调用阻塞等待（确保有数据）                               │
│  ✓ 60秒内直接使用缓存（快速响应）                               │
│  ✓ 60秒后后台刷新（不阻塞用户）                                 │
│  ✓ Promise 去重（防止并发构建）                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 搜索算法

### Rust FileIndex 搜索

```javascript
// Rust 原生模块提供的接口
// file-index.node

class FileIndex {
  // 从文件列表加载索引
  loadFromFileList(paths: string[]): void;

  // 搜索文件路径
  search(query: string, maxResults: number): SearchResult[];
}

interface SearchResult {
  path: string;   // 匹配的文件路径
  score: number;  // 相关性分数
}
```

### Fuse.js 降级搜索

```javascript
// ============================================
// searchFileIndex (MO3)
// Location: chunks.138.mjs:2028-2075
// ============================================

async function searchFileIndex(rustIndex, fallbackList, query) {
  // 优先尝试 Rust 索引
  if (rustIndex) {
    try {
      return rustIndex.search(query, maxResults)
        .map(result => createFileResult(result.path, result.score));
    } catch (error) {
      log(`[FileIndex] Rust search failed, falling back to Fuse.js`);
    }
  }

  // Fuse.js 降级搜索
  log("[FileIndex] Using Fuse.js fallback for search");

  let uniqueFiles = [...new Set(fallbackList)];

  // 空查询: 返回顶级目录
  if (!query) {
    let topLevelDirs = new Set();
    for (let file of uniqueFiles) {
      let topDir = file.split(path.sep)[0];
      if (topDir && topLevelDirs.size < maxResults) {
        topLevelDirs.add(topDir);
      }
    }
    return [...topLevelDirs].sort().map(createFileResult);
  }

  // 构建搜索文档
  let documents = uniqueFiles.map(filePath => ({
    path: filePath,
    filename: path.basename(filePath),
    testPenalty: filePath.includes("test") ? 1 : 0  // 降低测试文件优先级
  }));

  // 路径前缀过滤（优化搜索范围）
  let lastSepIndex = query.lastIndexOf(path.sep);
  if (lastSepIndex > 2) {
    documents = documents.filter(doc =>
      doc.path.substring(0, lastSepIndex)
        .startsWith(query.substring(0, lastSepIndex))
    );
  }

  // Fuse.js 模糊搜索
  let fuse = new Fuse(documents, {
    includeScore: true,
    threshold: 0.5,
    keys: [
      { name: "path", weight: 1 },
      { name: "filename", weight: 2 }  // 文件名匹配权重更高
    ]
  });

  let results = fuse.search(query, { limit: maxResults });

  // 排序: 分数优先，测试文件降级
  results.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
    return a.item.testPenalty - b.item.testPenalty;
  });

  return results.map(r => r.item.path).slice(0, maxResults).map(createFileResult);
}
```

### 搜索结果格式

```javascript
// createFileResult (jZ1)
function createFileResult(path, score) {
  return {
    id: `file-${path}`,
    displayText: path,
    metadata: score !== undefined ? { score } : undefined
  };
}
```

---

## 6. 函数参考

### 核心函数

| 混淆名 | 可读名 | 位置 | 描述 |
|--------|--------|------|------|
| `x09` | autocompleteFiles | chunks.138.mjs:2102 | 主入口函数 |
| `NO3` | buildFileIndex | chunks.138.mjs:1976 | 构建文件索引 |
| `MO3` | searchFileIndex | chunks.138.mjs:2028 | 搜索索引 |
| `jJ0` | refreshIndexCache | chunks.138.mjs:2077 | 刷新缓存 |
| `UO3` | getFileIndex | chunks.138.mjs:1954 | 获取 Rust 索引实例 |
| `wO3` | extractDirectoryPrefixes | chunks.138.mjs:1964 | 提取目录前缀 |
| `qO3` | getAdditionalFiles | chunks.138.mjs:1972 | 获取额外目录文件 |
| `LO3` | commonPrefix | chunks.138.mjs:2000 | 计算公共前缀 |
| `jZ1` | createFileResult | chunks.138.mjs:2018 | 创建结果对象 |

### 全局变量

| 混淆名 | 可读名 | 类型 | 描述 |
|--------|--------|------|------|
| `PZ1` | fileIndexInstance | FileIndex | Rust 索引单例 |
| `PJ0` | useFuseJsFallback | boolean | 降级标志 |
| `SJ0` | cachedFileIndex | FileIndex | 缓存的索引 |
| `_J0` | cachedFileList | string[] | 缓存的文件列表 |
| `fXA` | refreshPromise | Promise | 刷新 Promise |
| `k09` | lastRefreshTimestamp | number | 刷新时间戳 |
| `$O3` | cacheTTL | number | 60000 (60秒) |
| `sPA` | maxResults | number | 15 |

---

## 总结

### FileIndex vs Tree-sitter 对比

| 特性 | FileIndex | Tree-sitter |
|------|-----------|-------------|
| **用途** | 文件路径补全 | Bash 命令 AST 解析 |
| **触发** | @ mention / 路径输入 | Bash 工具执行 |
| **数据** | 文件路径字符串 | 语法树节点 |
| **缓存** | 60秒 TTL | Parser 单例 |
| **实现** | Rust + Fuse.js | WASM |

### 关键特点

1. **按需构建** - 首次调用时才构建索引，非启动时
2. **后台刷新** - 60秒后后台更新，不阻塞用户
3. **双引擎** - Rust 高性能 + Fuse.js 降级保障
4. **智能排序** - 文件名权重高，测试文件降级

---

## 相关文档

- [Tree-sitter Bash 解析](./tree_sitter.md) - AST 解析系统
- [符号索引](../00_overview/symbol_index.md) - 完整符号映射表
