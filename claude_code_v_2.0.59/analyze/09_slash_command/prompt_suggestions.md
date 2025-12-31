# Prompt Suggestions System

> Context-aware autocomplete suggestions for the Claude Code input prompt.

## Implementation Approach

**关键点：不使用 LLM 推理，完全是客户端本地逻辑。**

### 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| 模糊搜索 | Fuse.js | 命令、Agent、MCP 资源匹配 |
| 文件索引 | Rust 原生模块 | O(log n) 文件路径搜索 |
| 文件索引降级 | Fuse.js | Rust 不可用时的备选方案 |
| Shell 补全 | compgen (bash) / zsh 内置 | 变量、命令、文件补全 |
| 目录读取 | Node.js readdirSync | 目录列表缓存 |

### 为什么不用 LLM？

1. **延迟要求** - 补全需要 <100ms 响应，LLM 推理太慢（通常 1-3 秒）
2. **确定性需求** - 文件路径、命令名需要精确匹配，不需要语义"理解"
3. **成本控制** - 每次按键都调用 LLM 成本过高
4. **离线可用** - 本地逻辑无需网络连接

### 性能优化

- **200ms 防抖** - 避免频繁触发搜索
- **LRU 缓存** - 目录内容缓存 (500 条, 5 分钟 TTL)
- **文件索引缓存** - 60 秒刷新间隔
- **AbortController** - 取消过期的 Shell 补全请求

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Prompt Suggestions module

---

## 1. Overview

The Prompt suggestions system provides real-time autocomplete functionality as users type in the input field. It supports multiple suggestion types based on context and input mode.

### Suggestion Types

| Type | Trigger | Description |
|------|---------|-------------|
| Command | `/` prefix | Slash command suggestions with fuzzy search |
| File Reference | `@` prefix | File, agent, MCP resource suggestions |
| Shell Completion | bash mode | Variable, file, command completions via compgen/zsh |
| Directory | `/add-dir` args | Directory autocomplete for add-dir command |
| Resume Session | `/resume` args | Previous session title suggestions |
| MCP Server | `@` prefix | Toggle MCP servers on/off |

### Input Mode Integration

- **Prompt mode**: Commands (`/`), file references (`@`), thinking toggle (Tab)
- **Bash mode**: Shell completions (variable, file, command)

---

## 2. Architecture

### Core Hook Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    usePromptSuggestions (e09)                    │
│                  chunks.138.mjs:2819-3172                        │
├─────────────────────────────────────────────────────────────────┤
│  Input: commands, input, cursorOffset, mode, agents             │
│  Output: suggestions, selectedSuggestion, suggestionType        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Input Change │───▶│ Context      │───▶│ Suggestion   │      │
│  │ Handler      │    │ Detection    │    │ Generator    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Debounce     │    │ Type Router  │    │ Fuzzy Search │      │
│  │ (200ms)      │    │ (6 types)    │    │ (Fuse.js)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

```javascript
// Suggestions State Structure
{
  suggestions: Suggestion[],      // Current suggestion list
  selectedSuggestion: number,     // Selected index (-1 = none)
  commandArgumentHint: string     // Hint for command arguments
}

// Suggestion Type Enum (internal state H/C)
type SuggestionType =
  | "none"         // No active suggestions
  | "command"      // Slash command suggestions
  | "file"         // File/agent/MCP resource suggestions
  | "shell"        // Bash/zsh completions
  | "directory"    // Directory suggestions (add-dir)
  | "custom-title" // Resume session titles
```

### Suppression Conditions

The `suppressSuggestions` flag disables all suggestions when:
1. `isSearchingHistory` - User is in Ctrl+R history search mode
2. `historyIndex > 0` - User is navigating history with up/down arrows

```javascript
// chunks.142.mjs:2127
suppressSuggestions: e || k0 > 0
// e = isSearchingHistory, k0 = historyIndex
```

---

## 3. Configuration

### AppState Integration

```javascript
// ============================================
// usePromptSuggestionDisplay - AppState hook for suggestion display
// Location: chunks.142.mjs:1869-1897
// ============================================

// ORIGINAL (for source lookup):
function A69({
  inputValue: A,
  isAssistantResponding: Q
}) {
  let [B, G] = OQ(),
      I = Q || A.length > 0 ? null : B.promptSuggestion.text,
      Y = gW0.useCallback(() => { /* clearSuggestion */ }, [G]),
      J = gW0.useCallback(() => { /* acceptSuggestion */ }, [B.promptSuggestion, Y]);
  return { suggestion: I, acceptSuggestion: J, clearSuggestion: Y }
}

// READABLE (for understanding):
function usePromptSuggestionDisplay({
  inputValue: inputValue,
  isAssistantResponding: isAssistantResponding
}) {
  let [appState, setAppState] = useAppState();
  // Only show suggestion when: not responding AND input is empty
  let suggestion = isAssistantResponding || inputValue.length > 0
    ? null
    : appState.promptSuggestion.text;

  let clearSuggestion = useCallback(() => {
    setAppState(state => ({
      ...state,
      promptSuggestion: { text: null, shownAt: 0 }
    }));
  }, [setAppState]);

  let acceptSuggestion = useCallback(() => {
    let text = appState.promptSuggestion.text;
    if (text) {
      let shownAt = appState.promptSuggestion.shownAt;
      // Track analytics
      trackEvent("tengu_prompt_suggestion_accepted", {
        timeToAcceptMs: shownAt > 0 ? Date.now() - shownAt : 0
      });
      clearSuggestion();
      return text;
    }
    return null;
  }, [appState.promptSuggestion, clearSuggestion]);

  return { suggestion, acceptSuggestion, clearSuggestion };
}

// Mapping: A69→usePromptSuggestionDisplay, A→inputValue, Q→isAssistantResponding
```

### AppState Properties

| Property | Type | Purpose |
|----------|------|---------|
| `promptSuggestion.text` | `string \| null` | Current suggestion text to display |
| `promptSuggestion.shownAt` | `number` | Timestamp when suggestion was shown (for analytics) |

---

## 4. Suggestion Types (Deep Analysis)

### 4.1 Command Suggestions (`/` prefix)

**Trigger**: Input starts with `/` and cursor is after the slash

**Algorithm**: `T09` (getCommandSuggestions)

```javascript
// ============================================
// getCommandSuggestions - Slash command fuzzy search
// Location: chunks.138.mjs:1795-1845
// ============================================

// ORIGINAL (for source lookup):
function T09(A, Q) {
  if (!bXA(A)) return [];
  if (IO3(A)) return [];
  let B = A.slice(1).toLowerCase().trim();
  if (B === "") {
    let Y = Q.filter((K) => !K.isHidden),
        J = [], W = [], X = [], V = [];
    Y.forEach((K) => {
      if (K.type === "prompt" && K.source === "localSettings") J.push(K);
      else if (K.type === "prompt" && K.source === "projectSettings") W.push(K);
      else if (K.type === "prompt" && K.source === "policySettings") X.push(K);
      else V.push(K)
    });
    let F = (K, D) => K.userFacingName().localeCompare(D.userFacingName());
    return J.sort(F), W.sort(F), X.sort(F), V.sort(F),
           [...J, ...W, ...X, ...V].map(R09)
  }
  let G = Q.filter((Y) => !Y.isHidden).map((Y) => {
    let J = Y.userFacingName(),
        W = J.split(ZO3).filter(Boolean);
    return {
      nameKey: J,
      descriptionKey: Y.description.split(" ").map((X) => JO3(X)).filter(Boolean),
      partKey: W.length > 1 ? W : void 0,
      commandName: J,
      command: Y,
      aliasKey: Y.aliases
    }
  });
  return new yO(G, {
    includeScore: !0,
    threshold: 0.3,
    location: 0,
    distance: 100,
    keys: [
      { name: "commandName", weight: 3 },
      { name: "partKey", weight: 2 },
      { name: "aliasKey", weight: 2 },
      { name: "descriptionKey", weight: 0.5 }
    ]
  }).search(B).map((Y) => R09(Y.item.command))
}

// READABLE (for understanding):
function getCommandSuggestions(input, commands) {
  // Guard: must start with /
  if (!isSlashCommand(input)) return [];
  // Guard: skip if already has arguments (contains space but not ending with space)
  if (hasCommandArguments(input)) return [];

  let query = input.slice(1).toLowerCase().trim();

  // Empty query: return categorized list by source
  if (query === "") {
    let visible = commands.filter(cmd => !cmd.isHidden);
    let localSettings = [];    // User's custom prompts
    let projectSettings = [];  // Project-level prompts
    let policySettings = [];   // Policy-level prompts
    let builtins = [];         // Built-in commands

    visible.forEach(cmd => {
      if (cmd.type === "prompt" && cmd.source === "localSettings")
        localSettings.push(cmd);
      else if (cmd.type === "prompt" && cmd.source === "projectSettings")
        projectSettings.push(cmd);
      else if (cmd.type === "prompt" && cmd.source === "policySettings")
        policySettings.push(cmd);
      else builtins.push(cmd);
    });

    // Sort each category alphabetically
    let sortFn = (a, b) => a.userFacingName().localeCompare(b.userFacingName());
    localSettings.sort(sortFn);
    projectSettings.sort(sortFn);
    policySettings.sort(sortFn);
    builtins.sort(sortFn);

    // Priority order: local → project → policy → builtin
    return [...localSettings, ...projectSettings, ...policySettings, ...builtins]
      .map(formatCommandSuggestion);
  }

  // Non-empty query: use Fuse.js fuzzy search
  let searchItems = commands.filter(cmd => !cmd.isHidden).map(cmd => {
    let name = cmd.userFacingName();
    let parts = name.split(HYPHEN_UNDERSCORE_COLON_REGEX).filter(Boolean);
    return {
      nameKey: name,
      descriptionKey: cmd.description.split(" ").map(normalizeWord).filter(Boolean),
      partKey: parts.length > 1 ? parts : undefined,  // e.g., ["add", "dir"]
      commandName: name,
      command: cmd,
      aliasKey: cmd.aliases
    };
  });

  return new Fuse(searchItems, {
    includeScore: true,
    threshold: 0.3,      // 30% fuzzy tolerance
    location: 0,
    distance: 100,
    keys: [
      { name: "commandName", weight: 3 },    // Highest: exact name match
      { name: "partKey", weight: 2 },        // High: match hyphenated parts
      { name: "aliasKey", weight: 2 },       // High: match aliases
      { name: "descriptionKey", weight: 0.5 } // Low: match in description
    ]
  }).search(query).map(result => formatCommandSuggestion(result.item.command));
}

// Mapping: T09→getCommandSuggestions, A→input, Q→commands, B→query, yO→Fuse
```

**Why this approach:**
- **Empty query categorization**: Users can discover commands organized by source (local prompts first for quick access)
- **Part-based matching**: Allows "dir" to match "add-dir" via the `partKey` field
- **Low description weight (0.5)**: Prevents irrelevant matches where query appears in description text
- **30% threshold**: Balances typo tolerance with precision

**Key insight:** The `partKey` field splits hyphenated commands (e.g., `add-dir` → `["add", "dir"]`) enabling partial matching, which is crucial for discoverability of compound commands.

---

### 4.2 File Reference Suggestions (`@` prefix)

**Trigger**: Input contains `@` followed by optional path characters

**Algorithm**: `vJ0` (getAtMentionSuggestions)

```javascript
// ============================================
// getAtMentionSuggestions - Unified @ mention aggregation
// Location: chunks.138.mjs:2361-2417
// ============================================

// ORIGINAL (for source lookup):
async function vJ0(A, Q, B, G = !1, Z = []) {
  if (!A && !G) return [];
  let [I, Y, J] = await Promise.all([
    x09(A, G),
    Promise.resolve(vO3(B, A, G)),
    Promise.resolve(bO3(Z, A, G))
  ]);
  let W = I.map((K) => ({ type: "file", /* ... */ }));
  let X = Object.values(Q).flat().map((K) => ({ type: "mcp_resource", /* ... */ }));

  if (!A) return [...J, ...W, ...X, ...Y].slice(0, xJ0).map(u09);

  let V = [...J, ...X, ...Y], F = [];
  for (let K of W) F.push({ source: K, score: K.score ?? 0.5 });

  if (V.length > 0) {
    let D = new yO(V, {
      includeScore: !0,
      threshold: 0.6,
      keys: [
        { name: "displayText", weight: 2 },
        { name: "name", weight: 3 },
        { name: "server", weight: 1 },
        { name: "description", weight: 1 },
        { name: "agentType", weight: 3 },
        { name: "serverName", weight: 3 }
      ]
    }).search(A, { limit: xJ0 });
    for (let H of D) F.push({ source: H.item, score: H.score ?? 0.5 });
  }

  return F.sort((K, D) => K.score - D.score).slice(0, xJ0).map((K) => K.source).map(u09);
}

// READABLE (for understanding):
async function getAtMentionSuggestions(query, mcpResources, agents, forceShow = false, mcpClients = []) {
  // Guard: need query or forceShow flag
  if (!query && !forceShow) return [];

  // Parallel fetch from all sources
  let [files, agentSuggestions, serverSuggestions] = await Promise.all([
    searchFiles(query, forceShow),
    Promise.resolve(getAgentSuggestions(agents, query, forceShow)),
    Promise.resolve(getMcpServerSuggestions(mcpClients, query, forceShow))
  ]);

  // Transform files to unified format
  let fileSuggestions = files.map(file => ({
    type: "file",
    displayText: file.displayText,
    description: file.description,
    path: file.displayText,
    filename: path.basename(file.displayText),
    score: file.metadata?.score
  }));

  // Transform MCP resources to unified format
  let mcpResourceSuggestions = Object.values(mcpResources).flat().map(resource => ({
    type: "mcp_resource",
    displayText: `${resource.server}:${resource.uri}`,
    description: resource.name + (resource.description ? ` - ${resource.description}` : ""),
    server: resource.server,
    uri: resource.uri,
    name: resource.name || resource.uri
  }));

  // Empty query: return concatenated list (servers first for quick toggle)
  if (!query) {
    return [...serverSuggestions, ...fileSuggestions, ...mcpResourceSuggestions, ...agentSuggestions]
      .slice(0, MAX_UNIFIED_SUGGESTIONS)
      .map(formatUnifiedSuggestion);
  }

  // Non-empty query: score-based ranking
  let nonFileSources = [...serverSuggestions, ...mcpResourceSuggestions, ...agentSuggestions];
  let scoredResults = [];

  // Files already have scores from FileIndex
  for (let file of fileSuggestions) {
    scoredResults.push({ source: file, score: file.score ?? 0.5 });
  }

  // Fuzzy search other sources
  if (nonFileSources.length > 0) {
    let fuseResults = new Fuse(nonFileSources, {
      includeScore: true,
      threshold: 0.6,
      keys: [
        { name: "displayText", weight: 2 },
        { name: "name", weight: 3 },
        { name: "server", weight: 1 },
        { name: "description", weight: 1 },
        { name: "agentType", weight: 3 },
        { name: "serverName", weight: 3 }
      ]
    }).search(query, { limit: MAX_UNIFIED_SUGGESTIONS });

    for (let result of fuseResults) {
      scoredResults.push({ source: result.item, score: result.score ?? 0.5 });
    }
  }

  // Sort by score (lower is better in Fuse.js) and return top results
  return scoredResults
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_UNIFIED_SUGGESTIONS)
    .map(item => item.source)
    .map(formatUnifiedSuggestion);
}

// Mapping: vJ0→getAtMentionSuggestions, A→query, Q→mcpResources, B→agents,
//          G→forceShow, Z→mcpClients, xJ0→MAX_UNIFIED_SUGGESTIONS (15)
```

**Why this approach:**
- **Parallel fetch**: `Promise.all` fetches files, agents, and MCP servers simultaneously
- **Server-first ordering**: Empty query shows MCP servers first for quick toggle access
- **Score unification**: Different sources have different scoring, normalized to 0-1 range
- **60% threshold**: Higher tolerance for non-file sources (names may be abbreviated)

**Key insight:** MCP servers are prioritized in empty-query results because users frequently toggle servers via the `@` menu, making quick access essential.

---

### 4.3 File Index Search (Rust + Fuse.js hybrid)

**Algorithm**: `MO3` (searchFileIndex)

```javascript
// ============================================
// searchFileIndex - Hybrid Rust/Fuse.js file search
// Location: chunks.138.mjs:2028-2075
// ============================================

// ORIGINAL (for source lookup):
async function MO3(A, Q, B) {
  if (A) try {
    return A.search(B, sPA).map((X) => jZ1(X.path, X.score))
  } catch (W) {
    g(`[FileIndex] Rust search failed, falling back to Fuse.js: ${W}`), AA(W)
  }

  g("[FileIndex] Using Fuse.js fallback for search");
  let G = [...new Set(Q)];

  if (!B) {
    let W = new Set;
    for (let X of G) {
      let V = X.split($K.sep)[0];
      if (V) { if (W.add(V), W.size >= sPA) break }
    }
    return [...W].sort().map(jZ1)
  }

  let Z = G.map((W) => ({
    path: W,
    filename: $K.basename(W),
    testPenalty: W.includes("test") ? 1 : 0
  }));

  let I = B.lastIndexOf($K.sep);
  if (I > 2) Z = Z.filter((W) => W.path.substring(0, I).startsWith(B.substring(0, I)));

  let J = new yO(Z, {
    includeScore: !0,
    threshold: 0.5,
    keys: [{ name: "path", weight: 1 }, { name: "filename", weight: 2 }]
  }).search(B, { limit: sPA });

  return J = J.sort((W, X) => {
    if (W.score === void 0 || X.score === void 0) return 0;
    if (Math.abs(W.score - X.score) > 0.05) return W.score - X.score;
    return W.item.testPenalty - X.item.testPenalty
  }), J.map((W) => W.item.path).slice(0, sPA).map(jZ1)
}

// READABLE (for understanding):
async function searchFileIndex(rustIndex, fileList, query) {
  // Primary: try Rust native search (O(log n) performance)
  if (rustIndex) {
    try {
      return rustIndex.search(query, MAX_FILE_SUGGESTIONS)
        .map(result => createFileSuggestion(result.path, result.score));
    } catch (error) {
      log(`[FileIndex] Rust search failed, falling back to Fuse.js: ${error}`);
      logError(error);
    }
  }

  log("[FileIndex] Using Fuse.js fallback for search");
  let uniqueFiles = [...new Set(fileList)];

  // Empty query: return top-level directories only
  if (!query) {
    let topDirs = new Set();
    for (let filePath of uniqueFiles) {
      let topDir = filePath.split(path.sep)[0];
      if (topDir) {
        topDirs.add(topDir);
        if (topDirs.size >= MAX_FILE_SUGGESTIONS) break;
      }
    }
    return [...topDirs].sort().map(createFileSuggestion);
  }

  // Build search items with test penalty
  let searchItems = uniqueFiles.map(filePath => ({
    path: filePath,
    filename: path.basename(filePath),
    testPenalty: filePath.includes("test") ? 1 : 0  // Deprioritize test files
  }));

  // Pre-filter by directory prefix if query contains path separator
  let lastSepIndex = query.lastIndexOf(path.sep);
  if (lastSepIndex > 2) {
    searchItems = searchItems.filter(item =>
      item.path.substring(0, lastSepIndex).startsWith(query.substring(0, lastSepIndex))
    );
  }

  // Fuse.js search with filename bias
  let results = new Fuse(searchItems, {
    includeScore: true,
    threshold: 0.5,
    keys: [
      { name: "path", weight: 1 },      // Full path match
      { name: "filename", weight: 2 }   // Filename match (2x priority)
    ]
  }).search(query, { limit: MAX_FILE_SUGGESTIONS });

  // Secondary sort: apply test penalty when scores are close
  results.sort((a, b) => {
    if (a.score === undefined || b.score === undefined) return 0;
    // If scores differ by more than 0.05, use score order
    if (Math.abs(a.score - b.score) > 0.05) return a.score - b.score;
    // Otherwise, deprioritize test files
    return a.item.testPenalty - b.item.testPenalty;
  });

  return results.map(r => r.item.path).slice(0, MAX_FILE_SUGGESTIONS).map(createFileSuggestion);
}

// Mapping: MO3→searchFileIndex, A→rustIndex, Q→fileList, B→query,
//          sPA→MAX_FILE_SUGGESTIONS (15), jZ1→createFileSuggestion
```

**Why this approach:**
- **Rust primary**: Native Rust module provides O(log n) search performance for large codebases
- **JS fallback**: Fuse.js ensures functionality when Rust module unavailable
- **Test penalty**: Source files are usually more relevant than test files for most operations
- **Directory pre-filter**: When query contains path separator, filter to matching directories first

**Key insight:** The test penalty (`testPenalty: filePath.includes("test") ? 1 : 0`) is only applied when scores are within 0.05 of each other. This subtle UX optimization means test files won't dominate results but won't be completely hidden either.

---

### 4.4 Shell Completion Type Detection

**Algorithm**: `SO3` (detectCompletionType)

```javascript
// ============================================
// detectCompletionType - Bash/zsh completion type inference
// Location: chunks.138.mjs:2187-2226
// ============================================

// ORIGINAL (for source lookup):
function SO3(A, Q) {
  let B = A.slice(0, Q),
      G = B.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (G) return { prefix: G[0], completionType: "variable" };

  let Z = JW(B);
  if (!Z.success) {
    let W = B.split(/\s+/),
        X = W[W.length - 1] || "",
        F = W.length === 1 && !B.includes(" ") ? "command" : b09(X);
    return { prefix: X, completionType: F }
  }

  let I = PO3(Z.tokens);
  if (!I) {
    let W = Z.tokens[Z.tokens.length - 1];
    return { prefix: "", completionType: W && f09(W) ? "command" : "command" }
  }

  if (B.endsWith(" ")) return { prefix: "", completionType: "file" };

  let Y = b09(I.token);
  if (Y === "variable" || Y === "file") return { prefix: I.token, completionType: Y };

  let J = jO3(Z.tokens, I.index) ? "command" : "file";
  return { prefix: I.token, completionType: J }
}

// READABLE (for understanding):
function detectCompletionType(input, cursorOffset) {
  let textBeforeCursor = input.slice(0, cursorOffset);

  // Check for $variable pattern first
  let varMatch = textBeforeCursor.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (varMatch) {
    return { prefix: varMatch[0], completionType: "variable" };
  }

  // Try to parse with shell tokenizer
  let parseResult = shellTokenize(textBeforeCursor);

  // Parsing failed: use heuristics
  if (!parseResult.success) {
    let words = textBeforeCursor.split(/\s+/);
    let lastWord = words[words.length - 1] || "";
    // First word without space = command, otherwise infer from content
    let type = words.length === 1 && !textBeforeCursor.includes(" ")
      ? "command"
      : inferTypeFromToken(lastWord);
    return { prefix: lastWord, completionType: type };
  }

  // Find last string token in parsed result
  let lastToken = findLastStringToken(parseResult.tokens);

  // No string token found
  if (!lastToken) {
    let lastElement = parseResult.tokens[parseResult.tokens.length - 1];
    // After pipe/operator = command position
    return { prefix: "", completionType: lastElement && isPipeOperator(lastElement) ? "command" : "command" };
  }

  // Input ends with space = argument position (file completion)
  if (textBeforeCursor.endsWith(" ")) {
    return { prefix: "", completionType: "file" };
  }

  // Infer type from token content
  let inferredType = inferTypeFromToken(lastToken.token);
  if (inferredType === "variable" || inferredType === "file") {
    return { prefix: lastToken.token, completionType: inferredType };
  }

  // Check if at command position (first token or after pipe operator)
  let isCommandPosition = isAtCommandPosition(parseResult.tokens, lastToken.index);
  return {
    prefix: lastToken.token,
    completionType: isCommandPosition ? "command" : "file"
  };
}

// Helper: inferTypeFromToken (b09)
function inferTypeFromToken(token) {
  if (token.startsWith("$")) return "variable";
  if (token.includes("/") || token.startsWith("~") || token.startsWith(".")) return "file";
  return "command";
}

// Mapping: SO3→detectCompletionType, A→input, Q→cursorOffset, JW→shellTokenize,
//          b09→inferTypeFromToken, PO3→findLastStringToken, jO3→isAtCommandPosition
```

**Why this approach:**
- **Variable detection first**: `$VAR` pattern is unambiguous, check early
- **Full parsing with fallback**: Shell tokenizer handles complex cases, heuristics handle invalid input
- **Position awareness**: Distinguishes command position (after `|`, `&&`, `;`) from argument position
- **Graceful degradation**: Partial/invalid input still gets reasonable completions

**Key insight:** The dual-path strategy (tokenizer + heuristics) ensures suggestions work even for incomplete or syntactically invalid shell commands, which is crucial for real-time completion.

---

### 4.5 Token Extraction (parseFilePath)

**Algorithm**: `oPA` (parseFilePath)

```javascript
// ============================================
// parseFilePath - Extract token at cursor position
// Location: chunks.138.mjs:2778-2798
// ============================================

// ORIGINAL (for source lookup):
function oPA(A, Q, B = !1) {
  if (!A) return null;
  let G = A.substring(0, Q);
  if (B) {
    let Y = /@"([^"]*)"?$/,
        J = G.match(Y);
    if (J && J.index !== void 0) return { token: J[0], startPos: J.index, isQuoted: !0 }
  }
  let Z = B ? /(@[a-zA-Z0-9_\-./\\()[\]~]*|[a-zA-Z0-9_\-./\\()[\]~]+)$/ : /[a-zA-Z0-9_\-./\\()[\]~]+$/,
      I = G.match(Z);
  if (!I || I.index === void 0) return null;
  return { token: I[0], startPos: I.index, isQuoted: !1 }
}

// READABLE (for understanding):
function parseFilePath(input, cursorOffset, hasAtPrefix = false) {
  if (!input) return null;

  let textBeforeCursor = input.substring(0, cursorOffset);

  // Phase 1: Check for quoted pattern @"path with spaces"
  if (hasAtPrefix) {
    let quotedPattern = /@"([^"]*)"?$/;
    let quotedMatch = textBeforeCursor.match(quotedPattern);
    if (quotedMatch && quotedMatch.index !== undefined) {
      return {
        token: quotedMatch[0],      // e.g., '@"src/my file.ts"'
        startPos: quotedMatch.index,
        isQuoted: true
      };
    }
  }

  // Phase 2: Match word boundary pattern
  let wordPattern = hasAtPrefix
    ? /(@[a-zA-Z0-9_\-./\\()[\]~]*|[a-zA-Z0-9_\-./\\()[\]~]+)$/  // With @ or without
    : /[a-zA-Z0-9_\-./\\()[\]~]+$/;  // Bash mode: no @ prefix

  let wordMatch = textBeforeCursor.match(wordPattern);
  if (!wordMatch || wordMatch.index === undefined) return null;

  return {
    token: wordMatch[0],          // e.g., '@src/utils' or 'src/utils'
    startPos: wordMatch.index,
    isQuoted: false
  };
}

// Mapping: oPA→parseFilePath, A→input, Q→cursorOffset, B→hasAtPrefix
```

**Why this approach:**
- **Two-phase matching**: Quoted paths (`@"path with spaces"`) take priority, then word boundary
- **Cursor-position awareness**: Only matches text before cursor for accurate completion
- **`isQuoted` flag**: Determines how the completion should be inserted (with or without quotes)

**Key insight:** The regex `/@"([^"]*)"?$/` matches partial quotes too (missing closing quote), enabling mid-typing completions for paths with spaces.

---

### 4.6 Common Prefix Calculation

**Algorithm**: `y09` (getCommonPrefix)

```javascript
// ============================================
// getCommonPrefix - Find longest common prefix for Tab completion
// Location: chunks.138.mjs:2007-2016
// ============================================

// ORIGINAL (for source lookup):
function y09(A) {
  if (A.length === 0) return "";
  let Q = A.map((G) => G.displayText),
      B = Q[0];
  for (let G = 1; G < Q.length; G++) {
    let Z = Q[G];
    if (B = LO3(B, Z), B === "") return ""
  }
  return B
}

// READABLE (for understanding):
function getCommonPrefix(suggestions) {
  if (suggestions.length === 0) return "";

  let displayTexts = suggestions.map(s => s.displayText);
  let prefix = displayTexts[0];

  for (let i = 1; i < displayTexts.length; i++) {
    let current = displayTexts[i];
    prefix = findCommonPrefixPair(prefix, current);
    // Early termination: no common prefix found
    if (prefix === "") return "";
  }

  return prefix;
}

// Helper: findCommonPrefixPair (LO3)
function findCommonPrefixPair(str1, str2) {
  let minLength = Math.min(str1.length, str2.length);
  let commonLength = 0;
  while (commonLength < minLength && str1[commonLength] === str2[commonLength]) {
    commonLength++;
  }
  return str1.substring(0, commonLength);
}

// Mapping: y09→getCommonPrefix, LO3→findCommonPrefixPair
```

**Why this approach:**
- **Progressive completion**: Tab fills common prefix first, showing remaining options
- **Early termination**: Returns immediately when no common prefix found
- **Character-by-character comparison**: Simple O(n*m) where n=suggestions, m=avg length

**Key insight:** This enables "progressive completion" UX - pressing Tab multiple times progressively narrows down options, similar to bash tab completion behavior.

---

## 5. Core Hook Implementation

### Main Hook: usePromptSuggestions

```javascript
// ============================================
// usePromptSuggestions - Main prompt suggestions hook
// Location: chunks.138.mjs:2819-3172
// ============================================

// READABLE (simplified pseudocode for understanding):
function usePromptSuggestions({
  commands,           // Available slash commands
  onInputChange,      // Input setter
  onSubmit,           // Submit handler
  setCursorOffset,    // Cursor position setter
  input,              // Current input text
  cursorOffset,       // Current cursor position
  mode,               // "prompt" | "bash"
  agents,             // Available agents
  setSuggestionsState,// State setter
  suggestionsState,   // { suggestions, selectedSuggestion, commandArgumentHint }
  suppressSuggestions // Disable flag
}) {
  // State
  const [suggestionType, setSuggestionType] = useState("none");
  const [maxColumnWidth, setMaxColumnWidth] = useState(undefined);
  const [appState, setAppState] = useAppState();

  // Clear suggestions helper
  const clearSuggestions = useCallback(() => {
    setSuggestionsState({
      commandArgumentHint: undefined,
      suggestions: [],
      selectedSuggestion: -1
    });
    setSuggestionType("none");
    setMaxColumnWidth(undefined);
  }, []);

  // Debounced file search (200ms delay)
  const debouncedFileSearch = useDebouncedCallback(async (query, forceShow) => {
    const results = await getAtMentionSuggestions(query, appState.mcp.resources, agents, forceShow, appState.mcp.clients);
    if (results.length === 0) {
      clearSuggestions();
      return;
    }
    setSuggestionsState(prev => ({
      commandArgumentHint: undefined,
      suggestions: results,
      selectedSuggestion: preserveSelectedIndex(prev.suggestions, prev.selectedSuggestion, results)
    }));
    setSuggestionType(results.length > 0 ? "file" : "none");
  }, 200);

  // Input change handler - determines suggestion type and triggers search
  const handleInputChange = useCallback(async (newInput, newCursorOffset) => {
    // Check suppression
    if (suppressSuggestions) {
      debouncedFileSearch.cancel();
      clearSuggestions();
      return;
    }

    // Route to appropriate suggestion generator based on context
    // ... (see detailed routing logic in section 4)
  }, [suggestionType, commands, mode, suppressSuggestions]);

  // Tab handler - apply suggestion or toggle thinking
  const handleTab = useCallback(async () => {
    if (suggestions.length > 0) {
      // Apply selected suggestion based on type
      // ... (see Tab completion behavior)
    } else if (input.trim() !== "") {
      // Trigger shell completion in bash mode
      // Or file completion in prompt mode
    }
  }, [suggestions, selectedSuggestion, input, mode]);

  // Enter handler - select current suggestion
  const handleEnter = useCallback(() => {
    // Apply suggestion and potentially submit
  }, [suggestions, selectedSuggestion, suggestionType]);

  // Keyboard navigation
  useInput((char, key) => {
    // Tab (non-shift): apply suggestion or toggle thinking
    if (key.tab && !key.shift) {
      if (suggestions.length === 0 && mode !== "bash" && !hasThinkingKeyword) {
        // Toggle thinking mode
        setAppState(s => ({ ...s, thinkingEnabled: !s.thinkingEnabled }));
      } else {
        handleTab();
      }
      return;
    }

    if (suggestions.length === 0) return;

    // Down arrow / Ctrl+N: next suggestion
    if (key.downArrow || (key.ctrl && char === "n")) {
      setSuggestionsState(prev => ({
        ...prev,
        selectedSuggestion: prev.selectedSuggestion >= suggestions.length - 1 ? 0 : prev.selectedSuggestion + 1
      }));
      return;
    }

    // Up arrow / Ctrl+P: previous suggestion
    if (key.upArrow || (key.ctrl && char === "p")) {
      setSuggestionsState(prev => ({
        ...prev,
        selectedSuggestion: prev.selectedSuggestion <= 0 ? suggestions.length - 1 : prev.selectedSuggestion - 1
      }));
      return;
    }

    // Enter: select suggestion
    if (key.return) handleEnter();

    // Escape: dismiss suggestions
    if (key.escape) {
      debouncedFileSearch.cancel();
      clearSuggestions();
    }
  });

  return {
    suggestions,
    selectedSuggestion,
    suggestionType,
    maxColumnWidth,
    commandArgumentHint
  };
}
```

---

## 6. Keyboard Navigation

### Keybindings

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Apply suggestion / Toggle thinking | When suggestions shown / Empty input |
| `Down` / `Ctrl+N` | Next suggestion | When suggestions shown |
| `Up` / `Ctrl+P` | Previous suggestion | When suggestions shown |
| `Enter` | Select and apply suggestion | When suggestion selected |
| `Escape` | Dismiss suggestions | When suggestions shown |

### Tab Completion Behavior

**Progressive completion**: When multiple suggestions share a common prefix, Tab fills that prefix first.

```
Input: @sr          → Tab → @src/     (common prefix)
                    → Tab → @src/components/  (if all start with components/)
                    → Tab → (select from list if no more common prefix)
```

**Direct completion**: When only one suggestion or common prefix equals full match, completes directly.

```
Input: @src/utils/h  → Tab → @src/utils/helpers.ts  (single match)
```

### Quote Handling

Paths with spaces automatically get quoted:

```
Input: @my f         → Select "my file.ts" → @"my file.ts"
```

---

## 7. Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_FILE_SUGGESTIONS` (sPA) | 15 | Max file/directory suggestions |
| `MAX_UNIFIED_SUGGESTIONS` (xJ0) | 15 | Max @ mention suggestions |
| `MAX_SHELL_COMPLETIONS` (yJ0) | 15 | Max shell completions |
| `SHELL_COMPLETION_TIMEOUT` (RO3) | 1000ms | Timeout for compgen/zsh |
| `FILE_INDEX_CACHE_TTL` ($O3) | 60000ms | File index refresh interval |
| `MAX_AGENT_DESCRIPTION_LEN` (m09) | 60 | Truncate agent descriptions |
| `DEBOUNCE_DELAY` | 200ms | Debounce for file searches |

---

## 8. Related Symbols

> Symbol mappings: [symbol_index_core.md](../00_overview/symbol_index_core.md) - Module: Prompt Suggestions

Key functions:
- `usePromptSuggestions` (e09) - Main hook orchestrating all suggestions
- `usePromptSuggestionDisplay` (A69) - AppState integration for display
- `getCommandSuggestions` (T09) - Slash command fuzzy search
- `parseFilePath` (oPA) - Token extraction at cursor
- `searchFileIndex` (MO3) - Hybrid Rust/Fuse.js file search
- `getAtMentionSuggestions` (vJ0) - Unified @ mention aggregation
- `detectCompletionType` (SO3) - Shell completion type inference
- `getCommonPrefix` (y09) - Progressive Tab completion
- `getShellCompletions` (h09) - Execute bash/zsh compgen
