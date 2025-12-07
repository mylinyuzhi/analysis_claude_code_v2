# Tree-sitter Bash AST 解析系统

## 概述

Tree-sitter 在 Claude Code 中**仅用于 Bash 命令解析**，主要服务于权限检查系统。它通过 WASM 运行时解析 shell 命令的语法结构，提取管道、重定向、环境变量等信息。

**关键信息：**
- **唯一用途**: Bash 命令权限分析
- **WASM 文件**: `tree-sitter.wasm` + `tree-sitter-bash.wasm`
- **无其他语言**: 不支持 JS/TS/Python 等语法分析
- **缓存策略**: Parser 单例，命令级无缓存

> **注意**: 文件路径补全功能由 [FileIndex](./file_path_index.md) 系统提供，与 Tree-sitter 无关。

---

## 目录

- [1. 触发条件](#1-触发条件)
- [2. 解析流程](#2-解析流程)
- [3. AST 节点类型](#3-ast-节点类型)
- [4. 缓存策略](#4-缓存策略)
- [5. WASM 类实现](#5-wasm-类实现)
- [6. 函数参考](#6-函数参考)

---

## 1. 触发条件

### 何时触发 Tree-sitter 解析

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tree-sitter 触发条件                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  触发场景:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Bash 工具执行任何命令                                  │  │
│  │    → 权限检查时分析命令结构                               │  │
│  │                                                           │  │
│  │ 2. 命令包含管道符 |                                       │  │
│  │    → 分割管道段，逐段检查权限                             │  │
│  │    → 例: ls | grep foo | head                            │  │
│  │                                                           │  │
│  │ 3. 命令包含重定向 > 或 >>                                 │  │
│  │    → 检测输出目标文件                                     │  │
│  │    → 例: echo "data" > output.txt                        │  │
│  │                                                           │  │
│  │ 4. 命令包含环境变量赋值                                   │  │
│  │    → 提取 VAR=value 前缀                                  │  │
│  │    → 例: NODE_ENV=prod npm start                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  跳过解析:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ × 命令超过 10000 字符                                     │  │
│  │ × Parser 未初始化                                         │  │
│  │ × 解析出错时降级到字符串分析                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 触发条件表

| 条件 | 触发解析? | 原因 |
|------|----------|------|
| 命令包含 `\|` | ✓ YES | 需提取管道段 |
| 命令包含 `>` | ✓ YES | 需检测重定向 |
| 命令包含 `VAR=` | ✓ YES | 需提取环境变量 |
| 命令 > 10000 字符 | ✗ NO | 安全限制 |
| 首次解析 | ✓ YES | 懒加载 WASM |
| Parser 未初始化 | ✗ NO | 返回 null |

---

## 2. 解析流程

### 完整调用链

```
┌────────────────────────────────────────────────────────────────┐
│                    Bash 工具执行                                │
│                   (command string)                              │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              权限检查入口 (checkBashPermission)                 │
│                    no1(A, Q, B)                                 │
│                 chunks.90.mjs:1935                              │
└──────────────────────────┬─────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │ 命令包含管道符 | ?              │
           └───────────────┬───────────────┘
                           │ YES
                           ▼
┌────────────────────────────────────────────────────────────────┐
│         管道分析 (analyzeCommandWithPipes)                      │
│                    yA2(A, Q)                                    │
│                 chunks.90.mjs:804-829                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  1. 检查危险 shell 操作符 (&&, ||, ;)                    │ │
│  │  2. 调用 N01.parse() 解析命令                            │ │
│  │  3. 提取管道段 getPipeSegments()                         │ │
│  │  4. 逐段检查权限                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              Shell 解析器门面 (shellParserFacade)               │
│                    N01.parse(command)                           │
│                 chunks.90.mjs:724-737                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  async parse(command) {                                  │ │
│  │    let ParserClass = await createTreeSitterParser();     │ │
│  │    if (ParserClass) {                                    │ │
│  │      let parsed = await parseCommand(command);           │ │
│  │      return new ParserClass(command, parsed.rootNode);   │ │
│  │    }                                                     │ │
│  │    // Tree-sitter 失败时降级                             │ │
│  │    return new FallbackCommandParser(command);            │ │
│  │  }                                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│          懒加载初始化 (ensureTreeSitterLoaded)                  │
│                    jA2()                                        │
│                 chunks.90.mjs:500-503                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  async function ensureTreeSitterLoaded() {               │ │
│  │    if (!initPromise)                                     │ │
│  │      initPromise = loadTreeSitterWasm();                 │ │
│  │    await initPromise;                                    │ │
│  │  }                                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────────────┘
                           │ (仅首次调用)
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              WASM 加载 (loadTreeSitterWasm)                     │
│                    Q05()                                        │
│                 chunks.90.mjs:465-498                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  1. 尝试嵌入式 WASM (Bun.embeddedFiles)                  │ │
│  │  2. 降级: 从磁盘加载 (~/.claude/dependencies/)           │ │
│  │  3. 初始化 tree-sitter 运行时                            │ │
│  │  4. 创建 Parser 实例                                     │ │
│  │  5. 加载 Bash 语法                                       │ │
│  │  6. 发送遥测                                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│              核心解析 (parseCommand)                            │
│                    B05(command)                                 │
│                 chunks.90.mjs:505-523                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  async function parseCommand(command) {                  │ │
│  │    await ensureTreeSitterLoaded();                       │ │
│  │                                                          │ │
│  │    // 安全检查                                           │ │
│  │    if (!command || command.length > 10000 ||             │ │
│  │        !parser || !language) return null;                │ │
│  │                                                          │ │
│  │    // 执行解析                                           │ │
│  │    let tree = parser.parse(command);                     │ │
│  │    let rootNode = tree?.rootNode;                        │ │
│  │    let commandNode = findCommandNode(rootNode);          │ │
│  │    let envVars = extractEnvVars(commandNode);            │ │
│  │                                                          │ │
│  │    return { tree, rootNode, envVars, commandNode };      │ │
│  │  }                                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### 解析结果结构

```javascript
// parseCommand (B05) 返回值
{
  tree: Tree,              // 完整 AST 树
  rootNode: Node,          // 根节点
  envVars: string[],       // 环境变量 ["VAR=value", ...]
  commandNode: Node,       // 命令节点
  originalCommand: string  // 原始命令字符串
}

// getPipeSegments() 返回值
["ls -la", "grep foo", "head -n 10"]  // 按管道分割

// getOutputRedirections() 返回值
[{
  startIndex: 10,
  endIndex: 20,
  target: "output.txt",
  operator: ">"  // 或 ">>"
}]
```

---

## 3. AST 节点类型

### Bash 语法节点类型

Tree-sitter Bash 语法定义的节点类型：

```
┌─────────────────────────────────────────────────────────────────┐
│                    Bash AST 节点类型                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  命令节点:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ command              - 普通命令 (ls -la)                  │  │
│  │ declaration_command  - 声明命令 (export, declare)         │  │
│  │ command_name         - 命令名称 (ls)                      │  │
│  │ word                 - 单词/参数 (-la)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  组合节点:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ pipeline             - 管道 (cmd1 | cmd2)                 │  │
│  │ redirected_statement - 重定向语句                         │  │
│  │ compound_statement   - 复合语句                           │  │
│  │ subshell             - 子 shell (...)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  变量节点:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ variable_assignment  - 变量赋值 (VAR=value)               │  │
│  │ variable_name        - 变量名                             │  │
│  │ expansion            - 变量展开 ($VAR)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  重定向节点:                                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ file_redirect        - 文件重定向 (> file)                │  │
│  │ heredoc_redirect     - Here 文档 (<<EOF)                  │  │
│  │ herestring_redirect  - Here 字符串 (<<<)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  替换节点:                                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ command_substitution - 命令替换 $(cmd)                    │  │
│  │ process_substitution - 进程替换 <(cmd)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  字面量节点:                                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ string               - 双引号字符串 "..."                 │  │
│  │ raw_string           - 单引号字符串 '...'                 │  │
│  │ number               - 数字                               │  │
│  │ concatenation        - 字符串连接                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 代码中使用的节点类型集合

```javascript
// Location: chunks.90.mjs:597

// 声明命令 (r15)
const declarationCommands = new Set([
  "export", "declare", "typeset",
  "readonly", "local", "unset", "unsetenv"
]);

// 参数节点类型 (o15)
const argumentNodeTypes = new Set([
  "word", "string", "raw_string", "number"
]);

// 替换类型 - 解析时中断 (t15)
const substitutionTypes = new Set([
  "command_substitution", "process_substitution"
]);

// 有效命令节点类型 (To1)
const commandNodeTypes = new Set([
  "command", "declaration_command"
]);
```

### AST 遍历函数

```javascript
// ============================================
// findCommandNode (SA2)
// Location: chunks.90.mjs:525-539
// ============================================

function findCommandNode(node) {
  let { type, children, parent } = node;

  // 如果是命令节点直接返回
  if (commandNodeTypes.has(type)) return node;

  // 处理变量赋值后跟命令的情况
  if (type === "variable_assignment" && parent) {
    return parent.children.find(child =>
      child && commandNodeTypes.has(child.type) &&
      child.startIndex > node.startIndex
    ) ?? null;
  }

  // 处理管道和重定向
  if (type === "pipeline" || type === "redirected_statement") {
    return children.find(child =>
      child && commandNodeTypes.has(child.type)
    ) ?? null;
  }

  // 递归查找
  for (let child of children) {
    let result = child && findCommandNode(child);
    if (result) return result;
  }

  return null;
}

// ============================================
// extractEnvVars (G05)
// Location: chunks.90.mjs:541-550
// ============================================

function extractEnvVars(commandNode) {
  if (!commandNode || commandNode.type !== "command") return [];

  let envVars = [];
  for (let child of commandNode.children) {
    if (!child) continue;
    if (child.type === "variable_assignment") {
      envVars.push(child.text);
    } else if (child.type === "command_name" || child.type === "word") {
      break;  // 遇到命令名停止
    }
  }
  return envVars;
}

// ============================================
// extractCommandArgs (Z05)
// Location: chunks.90.mjs:552-569
// ============================================

function extractCommandArgs(node) {
  if (node.type === "declaration_command") {
    let firstChild = node.children[0];
    return firstChild && declarationCommands.has(firstChild.text)
      ? [firstChild.text]
      : [];
  }

  let args = [];
  let foundCommand = false;

  for (let child of node.children) {
    if (!child || child.type === "variable_assignment") continue;

    if (child.type === "command_name" || (!foundCommand && child.type === "word")) {
      foundCommand = true;
      args.push(child.text);
      continue;
    }

    if (argumentNodeTypes.has(child.type)) {
      args.push(stripQuotes(child.text));
    } else if (substitutionTypes.has(child.type)) {
      break;  // 遇到替换停止
    }
  }

  return args;
}
```

---

## 4. 缓存策略

### 缓存层次

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tree-sitter 缓存策略                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layer 1: Parser 单例 (会话级)                           │   │
│  │                                                          │   │
│  │  变量: q01 (Parser)                                     │   │
│  │  生命周期: 整个会话                                      │   │
│  │  初始化: 首次解析时                                      │   │
│  │  失效: 从不 (除非进程退出)                               │   │
│  │  Location: chunks.90.mjs:585                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layer 2: Language 单例 (会话级)                         │   │
│  │                                                          │   │
│  │  变量: jo1 (Language)                                   │   │
│  │  内容: Bash 语法定义                                     │   │
│  │  生命周期: 整个会话                                      │   │
│  │  Location: chunks.90.mjs:587                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layer 3: Init Promise (防重复加载)                      │   │
│  │                                                          │   │
│  │  变量: Po1 (Promise)                                    │   │
│  │  作用: 防止并发初始化                                    │   │
│  │  Location: chunks.90.mjs:589                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layer 4: 命令 AST (无缓存!)                            │   │
│  │                                                          │   │
│  │  每次命令都创建新的 Tree 对象                           │   │
│  │  解析结果不在命令间共享                                  │   │
│  │  原因: 命令各不相同，缓存命中率低                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 全局变量

```javascript
// Location: chunks.90.mjs:575-589

const MAX_COMMAND_LENGTH = 10000;  // s15 - 最大命令长度

let parser = null;      // q01 - Parser 单例
let language = null;    // jo1 - Bash Language 单例
let initPromise = null; // Po1 - 初始化 Promise
```

### 懒加载实现

```javascript
// ============================================
// ensureTreeSitterLoaded (jA2)
// Location: chunks.90.mjs:500-503
// ============================================

async function ensureTreeSitterLoaded() {
  if (!initPromise) {
    initPromise = loadTreeSitterWasm();
  }
  await initPromise;
}

// ============================================
// loadTreeSitterWasm (Q05)
// Location: chunks.90.mjs:465-498
// ============================================

async function loadTreeSitterWasm() {
  let fs = getFileSystem();
  let treeSitterWasm = null;
  let bashWasm = null;
  let source = null;

  // 尝试嵌入式 WASM (Bun)
  if (isBundled()) {
    treeSitterWasm = await getEmbeddedFile("tree-sitter.wasm");
    bashWasm = await getEmbeddedFile("tree-sitter-bash.wasm");
    if (treeSitterWasm && bashWasm) source = "embedded";
  }

  // 降级: 从磁盘加载
  if (!treeSitterWasm || !bashWasm) {
    let cacheDir = getCacheDirectory();
    let treeSitterPath = join(cacheDir, "tree-sitter.wasm");
    let bashPath = join(cacheDir, "tree-sitter-bash.wasm");

    if (!fs.existsSync(treeSitterPath) || !fs.existsSync(bashPath)) {
      log("tree-sitter: WASM files not found");
      sendTelemetry("tengu_tree_sitter_load", { success: false });
      return;
    }

    treeSitterWasm = fs.readFileBytesSync(treeSitterPath);
    bashWasm = fs.readFileBytesSync(bashPath);
    source = "disk";
  }

  // 初始化
  await Parser.init({ wasmBinary: treeSitterWasm });
  parser = new Parser();
  language = await Language.load(bashWasm);
  parser.setLanguage(language);

  log(`tree-sitter: loaded from ${source}`);
  sendTelemetry("tengu_tree_sitter_load", {
    success: true,
    from_embedded: source === "embedded"
  });
}
```

---

## 5. WASM 类实现

### Parser 类

```javascript
// ============================================
// Parser - Tree-sitter WASM 解析器
// Location: chunks.89.mjs:2144-2226
// ============================================

class Parser {
  [0] = 0;              // WASM 指针
  language = null;      // 当前语言

  constructor() {
    if (!wasmModule)
      throw Error("cannot construct a Parser before calling `init()`");
    this[0] = wasmModule._ts_parser_new_wasm();
  }

  static async init(options) {
    // 初始化 WASM 模块
    // options.wasmBinary: Uint8Array
  }

  setLanguage(language) {
    if (language?.constructor === Language) {
      wasmModule._ts_parser_set_language(this[0], language[0]);
      this.language = language;
    } else if (language) {
      throw Error("Argument must be a Language");
    } else {
      wasmModule._ts_parser_set_language(this[0], 0);
      this.language = null;
    }
    return this;
  }

  parse(source, oldTree, options) {
    if (!this.language)
      throw Error("Parser must have a language to parse");

    let treePointer = wasmModule._ts_parser_parse_wasm(
      this[0],
      oldTree?.[0] || 0
    );

    return new Tree(INTERNAL, treePointer, this.language, this.textCallback);
  }

  delete() {
    wasmModule._ts_parser_delete(this[0]);
    this[0] = 0;
  }

  setTimeoutMicros(timeout) {
    wasmModule._ts_parser_set_timeout_micros(this[0], timeout);
  }

  reset() {
    wasmModule._ts_parser_reset(this[0]);
  }
}
```

### Tree 类

```javascript
// ============================================
// Tree - 语法树
// Location: chunks.89.mjs:50-103
// ============================================

class Tree {
  [0] = 0;              // WASM 树指针
  textCallback;
  language;

  constructor(internal, pointer, language, textCallback) {
    assertInternal(internal);
    this[0] = pointer;
    this.language = language;
    this.textCallback = textCallback;
  }

  copy() {
    let newPointer = wasmModule._ts_tree_copy(this[0]);
    return new Tree(INTERNAL, newPointer, this.language, this.textCallback);
  }

  delete() {
    wasmModule._ts_tree_delete(this[0]);
    this[0] = 0;
  }

  get rootNode() {
    wasmModule._ts_tree_root_node_wasm(this[0]);
    return unmarshalNode(this);
  }

  edit(editInfo) {
    marshalEdit(editInfo);
    wasmModule._ts_tree_edit_wasm(this[0]);
  }

  walk() {
    return this.rootNode.walk();
  }

  getChangedRanges(otherTree) {
    if (!(otherTree instanceof Tree))
      throw TypeError("Argument must be a Tree");

    wasmModule._ts_tree_get_changed_ranges_wasm(this[0], otherTree[0]);
    return ranges;
  }
}
```

### Node 类

```javascript
// ============================================
// Node - AST 节点
// Location: chunks.89.mjs:219-467
// ============================================

class Node {
  [0] = 0;              // WASM 节点数据
  _children;
  _namedChildren;
  id;
  startIndex;
  startPosition;
  tree;

  get type() {
    return this.tree.language.types[this.typeId] || "ERROR";
  }

  get typeId() {
    marshalNode(this);
    return wasmModule._ts_node_symbol_wasm(this.tree[0]);
  }

  get text() {
    return getText(this.tree, this.startIndex, this.endIndex, this.startPosition);
  }

  get isNamed() {
    marshalNode(this);
    return wasmModule._ts_node_is_named_wasm(this.tree[0]) === 1;
  }

  get isError() {
    marshalNode(this);
    return wasmModule._ts_node_is_error_wasm(this.tree[0]) === 1;
  }

  get children() {
    if (!this._children) {
      // 懒加载子节点
      marshalNode(this);
      // ... populate from WASM
    }
    return this._children;
  }

  child(index) {
    marshalNode(this);
    wasmModule._ts_node_child_wasm(this.tree[0], index);
    return unmarshalNode(this.tree);
  }

  walk() {
    marshalNode(this);
    wasmModule._ts_tree_cursor_new_wasm(this.tree[0]);
    return new TreeCursor(INTERNAL, this.tree);
  }
}
```

### Language 类

```javascript
// ============================================
// Language - 语言语法
// Location: chunks.89.mjs:736-859
// ============================================

class Language {
  [0] = 0;        // WASM 语言指针
  types;          // 节点类型名数组
  fields;         // 字段名数组

  constructor(internal, languagePointer) {
    assertInternal(internal);
    this[0] = languagePointer;

    // 从 WASM 加载节点类型
    this.types = Array(wasmModule._ts_language_symbol_count(this[0]));
    for (let i = 0; i < this.types.length; i++) {
      if (wasmModule._ts_language_symbol_type(this[0], i) < 2) {
        this.types[i] = wasmModule.UTF8ToString(
          wasmModule._ts_language_symbol_name(this[0], i)
        );
      }
    }

    // 从 WASM 加载字段名
    this.fields = Array(wasmModule._ts_language_field_count(this[0]) + 1);
    for (let i = 0; i < this.fields.length; i++) {
      let namePtr = wasmModule._ts_language_field_name_for_id(this[0], i);
      this.fields[i] = namePtr ? wasmModule.UTF8ToString(namePtr) : null;
    }
  }

  get name() {
    let ptr = wasmModule._ts_language_name(this[0]);
    return ptr ? wasmModule.UTF8ToString(ptr) : null;
  }

  static async load(wasmSource) {
    let wasmBytes;

    if (wasmSource instanceof Uint8Array) {
      wasmBytes = Promise.resolve(wasmSource);
    } else if (globalThis.process?.versions.node) {
      wasmBytes = (await import("fs/promises")).readFile(wasmSource);
    } else {
      wasmBytes = fetch(wasmSource).then(r => r.arrayBuffer())
        .then(b => new Uint8Array(b));
    }

    let wasmModule = await loadWebAssemblyModule(await wasmBytes);

    let exports = Object.keys(wasmModule);
    let langFn = exports.find(n =>
      /^tree_sitter_\w+$/.test(n) && !n.includes("external_scanner_")
    );

    if (!langFn) throw Error("No language function found in WASM");

    return new Language(INTERNAL, wasmModule[langFn]());
  }
}
```

---

## 6. 函数参考

### 核心函数

| 混淆名 | 可读名 | 位置 | 描述 |
|--------|--------|------|------|
| `Q05` | loadTreeSitterWasm | chunks.90.mjs:465 | 加载 WASM 文件 |
| `jA2` | ensureTreeSitterLoaded | chunks.90.mjs:500 | 懒加载保护 |
| `B05` | parseCommand | chunks.90.mjs:505 | 核心解析函数 |
| `SA2` | findCommandNode | chunks.90.mjs:525 | 查找命令节点 |
| `G05` | extractEnvVars | chunks.90.mjs:541 | 提取环境变量 |
| `Z05` | extractCommandArgs | chunks.90.mjs:552 | 提取命令参数 |
| `I05` | stripQuotes | chunks.90.mjs:571 | 去除引号 |
| `yA2` | analyzeCommandWithPipes | chunks.90.mjs:804 | 管道分析 |
| `N01` | shellParserFacade | chunks.90.mjs:724 | 解析器门面 |
| `_A2` | FallbackCommandParser | chunks.90.mjs:600 | 降级解析器 |
| `Y05` | createTreeSitterCommandParser | chunks.90.mjs:646 | 创建 Tree-sitter 解析器 |

### 全局变量

| 混淆名 | 可读名 | 类型 | 描述 |
|--------|--------|------|------|
| `q01` | parser | Parser | Parser 单例 |
| `jo1` | language | Language | Bash 语法 |
| `Po1` | initPromise | Promise | 初始化 Promise |
| `s15` | MAX_COMMAND_LENGTH | number | 10000 |
| `No1` | ParserClass | class | Parser 类引用 |
| `qo1` | LanguageClass | class | Language 类引用 |
| `r15` | declarationCommands | Set | 声明命令集 |
| `o15` | argumentNodeTypes | Set | 参数节点类型集 |
| `t15` | substitutionTypes | Set | 替换类型集 |
| `To1` | commandNodeTypes | Set | 命令节点类型集 |

---

## 总结

### Tree-sitter 在 Claude Code 中的角色

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tree-sitter 使用总结                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ 用途: Bash 命令 AST 解析                                     │
│  ✓ 目的: 权限检查、管道分析、重定向检测                         │
│  ✓ 语言: 仅 Bash (无 JS/TS/Python)                              │
│  ✓ 实现: WASM 运行时                                            │
│                                                                  │
│  缓存策略:                                                      │
│  • Parser/Language: 会话级单例                                  │
│  • 命令 AST: 无缓存 (每次重新解析)                              │
│                                                                  │
│  触发条件:                                                      │
│  • Bash 工具执行                                                │
│  • 命令包含 | 或 >                                              │
│  • 命令长度 ≤ 10000 字符                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 相关文档

- [FileIndex 文件路径补全](./file_path_index.md) - @ mention 系统
- [符号索引](../00_overview/symbol_index.md) - 完整符号映射表
