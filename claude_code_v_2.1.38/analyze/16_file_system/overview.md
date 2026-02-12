# File System Operations Overview

Claude Code provides a suite of file operation tools (Read, Write, Edit, Glob, Grep, NotebookEdit) that enable the agent to interact with the local filesystem. These tools share a common security infrastructure built around path resolution, permission checking, and file state tracking.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Sandbox, Permissions)

Key functions in this document:
- `FileReadTool` (i5) - Read file tool definition object
- `FileWriteTool` (vj) - Write file tool definition object
- `GrepTool` (tS) - Grep tool definition object
- `GlobTool` (WB) - Glob tool definition object
- `resolvePath` (g4) - Resolves and normalizes file paths
- `checkPathDenyRule` (Gj) - Matches paths against permission deny/allow rules
- `checkReadPermissions` (ro) - Read tool permission checker
- `checkEditPermissions` (N51) - Write/Edit tool permission checker
- `getFilePathForTool` (Oa4) - Extracts file_path from tool input for any file tool

---

## 1. File Operation Tools

### Tool Inventory

| Tool Object | User-Facing Name | Read-Only | Concurrency-Safe | Primary Source |
|---|---|---|---|---|
| `FileReadTool` (i5) | "Read" | Yes | Yes | chunks.146.mjs:1754 |
| `FileWriteTool` (vj) | "Write" / "Updated plan" | No | No | chunks.146.mjs:436 |
| `EditTool` (referenced via `bq`) | "Edit" | No | No | chunks.146.mjs (referenced via Qw6 schema) |
| `GlobTool` (WB) | "Glob" | Yes | Yes | chunks.76.mjs:1495 |
| `GrepTool` (tS) | "Grep" | Yes | Yes | chunks.76.mjs:1129 |
| `NotebookEditTool` | "NotebookEdit" | No | No | chunks.146.mjs (referenced) |

### FileReadTool Architecture

The Read tool is the most complex file tool, supporting multiple file types:

- **Text files**: Returns `cat -n` formatted output with line numbers
- **Image files** (PNG, JPG, etc.): Returns base64-encoded image data for multimodal processing
- **PDF files**: Extracts pages as images with page range support
- **Jupyter notebooks** (.ipynb): Parses cell structure and returns formatted content

```javascript
// ============================================
// FileReadTool - Main read tool definition
// Location: chunks.146.mjs:1754-1950
// ============================================

// ORIGINAL (for source lookup):
i5 = {
    name: Jq,
    maxResultSizeChars: 1e5,
    strict: !0,
    input_examples: [{ file_path: "/Users/username/project/src/index.ts" }, { file_path: "/Users/username/project/README.md", limit: 100, offset: 50 }],
    async description() { return pe8 },
    isReadOnly() { return !0 },
    isConcurrencySafe() { return !0 },
    getPath({ file_path: A }) { return A || h6() },
    async checkPermissions(A, q) {
        let K = await q.getAppState();
        return ro(i5, A, K.toolPermissionContext)
    },
    async validateInput({ file_path: A, offset: q, limit: K, pages: Y }, z) {
        // ... validation checks ...
    },
    async call({ file_path: A, offset: q = 1, limit: K = void 0, pages: Y }, z) {
        // ... file reading logic ...
    }
}

// READABLE (for understanding):
FileReadTool = {
    name: READ_TOOL_NAME,
    maxResultSizeChars: 100000,
    strict: true,
    input_examples: [{ file_path: "/Users/username/project/src/index.ts" }, { file_path: "/Users/username/project/README.md", limit: 100, offset: 50 }],
    async description() { return FILE_READ_DESCRIPTION },
    isReadOnly() { return true },
    isConcurrencySafe() { return true },
    getPath({ file_path }) { return file_path || getCwd() },
    async checkPermissions(input, context) {
        let appState = await context.getAppState();
        return checkReadPermissions(FileReadTool, input, appState.toolPermissionContext)
    },
    async validateInput({ file_path, offset, limit, pages }, context) {
        // ... validation checks ...
    },
    async call({ file_path, offset = 1, limit = undefined, pages }, context) {
        // ... file reading logic ...
    }
}

// Mapping: i5->FileReadTool, Jq->READ_TOOL_NAME, pe8->FILE_READ_DESCRIPTION, h6->getCwd, ro->checkReadPermissions
```

### FileWriteTool Architecture

The Write tool creates or overwrites files, with built-in safety checks to prevent data loss:

```javascript
// ============================================
// FileWriteTool - Main write tool definition
// Location: chunks.146.mjs:436-652
// ============================================

// ORIGINAL (for source lookup):
vj = {
    name: f5,
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "Write a file to the local filesystem." },
    isReadOnly() { return !1 },
    isConcurrencySafe() { return !1 },
    getPath(A) { return A.file_path },
    async checkPermissions(A, q) {
        let K = await q.getAppState();
        return N51(vj, A, K.toolPermissionContext)
    },
    async validateInput({ file_path: A }, q) {
        let K = g4(A), Y = await q.getAppState();
        if (Gj(K, Y.toolPermissionContext, "edit", "deny") !== null) return { result: !1, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
        // ... more validation ...
    },
    async call({ file_path: A, content: q }, { readFileState: K, updateFileHistoryState: Y, dynamicSkillDirTriggers: z }, w, H) {
        // ... write logic ...
    }
}

// READABLE (for understanding):
FileWriteTool = {
    name: WRITE_TOOL_NAME,
    maxResultSizeChars: 100000,
    strict: true,
    async description() { return "Write a file to the local filesystem." },
    isReadOnly() { return false },
    isConcurrencySafe() { return false },
    getPath(input) { return input.file_path },
    async checkPermissions(input, context) {
        let appState = await context.getAppState();
        return checkEditPermissions(FileWriteTool, input, appState.toolPermissionContext)
    },
    async validateInput({ file_path }, context) {
        let resolvedPath = resolvePath(file_path);
        let appState = await context.getAppState();
        if (checkPathDenyRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
            return { result: false, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
        }
        // ... more validation ...
    },
    async call({ file_path, content }, { readFileState, updateFileHistoryState, dynamicSkillDirTriggers }, toolContext, toolUse) {
        // ... write logic ...
    }
}

// Mapping: vj->FileWriteTool, f5->WRITE_TOOL_NAME, g4->resolvePath, Gj->checkPathDenyRule, N51->checkEditPermissions
```

---

## 2. Path Security: resolvePath (g4)

### resolvePath - Path Resolution and Normalization

**What it does:** Converts any user-provided path string into an absolute, normalized, NFC-encoded path. This is the first line of defense against path-based attacks.

**How it works:**
1. Validates that the input is a string and contains no null bytes (null byte injection prevention)
2. Trims whitespace from the path
3. Handles tilde expansion: `~` resolves to home directory, `~/...` resolves relative to home
4. On Windows, detects and converts POSIX-style drive paths (`/c/...` to `C:\...`)
5. If the path is already absolute, normalizes it (removes `.`, `..`, extra separators)
6. If relative, joins it with the current working directory, then normalizes
7. Applies Unicode NFC normalization to prevent homoglyph attacks

**Why this approach:**
- Null byte checking prevents path truncation attacks where `path\x00/etc/passwd` would be interpreted as just `path` by some APIs
- NFC normalization ensures that visually identical Unicode strings resolve to the same path, preventing bypasses via combining characters
- Tilde expansion provides user-friendly path support while maintaining security
- The function does NOT follow symlinks, which is a deliberate choice -- symlink resolution happens separately in sandbox contexts

**Key insight:** Every file tool passes its path through `g4()` before any filesystem operation, making it the single funnel point for path normalization. This ensures consistent behavior regardless of which tool is used.

```javascript
// ============================================
// resolvePath - Absolute path resolution with security checks
// Location: chunks.10.mjs:1159-1176
// ============================================

// ORIGINAL (for source lookup):
function g4(A, q) {
    let K = q ?? h6() ?? b1().cwd();
    if (typeof A !== "string") throw TypeError(`Path must be a string, received ${typeof A}`);
    if (typeof K !== "string") throw TypeError(`Base directory must be a string, received ${typeof K}`);
    if (A.includes("\x00") || K.includes("\x00")) throw Error("Path contains null bytes");
    let Y = A.trim();
    if (!Y) return qx6(K).normalize("NFC");
    if (Y === "~") return xY8().normalize("NFC");
    if (Y.startsWith("~/")) return ozK(xY8(), Y.slice(2)).normalize("NFC");
    let z = Y;
    if (eA() === "windows" && Y.match(/^\/[a-z]\//i)) try { z = IY8(Y) } catch { z = Y }
    if (rzK(z)) return qx6(z).normalize("NFC");
    return azK(K, z).normalize("NFC")
}

// READABLE (for understanding):
function resolvePath(inputPath, baseDir) {
    let effectiveBase = baseDir ?? getCwd() ?? fs().cwd();
    if (typeof inputPath !== "string") throw TypeError(`Path must be a string, received ${typeof inputPath}`);
    if (typeof effectiveBase !== "string") throw TypeError(`Base directory must be a string, received ${typeof effectiveBase}`);
    if (inputPath.includes("\x00") || effectiveBase.includes("\x00")) throw Error("Path contains null bytes");
    let trimmed = inputPath.trim();
    if (!trimmed) return normalize(effectiveBase).normalize("NFC");
    if (trimmed === "~") return homeDir().normalize("NFC");
    if (trimmed.startsWith("~/")) return join(homeDir(), trimmed.slice(2)).normalize("NFC");
    let resolved = trimmed;
    if (getPlatform() === "windows" && trimmed.match(/^\/[a-z]\//i)) {
        try { resolved = toWindowsPath(trimmed) } catch { resolved = trimmed }
    }
    if (isAbsolute(resolved)) return normalize(resolved).normalize("NFC");
    return resolve(effectiveBase, resolved).normalize("NFC")
}

// Mapping: g4->resolvePath, A->inputPath, q->baseDir, K->effectiveBase, h6->getCwd, b1->fs, qx6->normalize, xY8->homeDir, ozK->join, eA->getPlatform, IY8->toWindowsPath, rzK->isAbsolute, azK->resolve
```

### hasParentTraversal (p61) - Directory Traversal Detection

A helper function checks for `..` path components:

```javascript
// ============================================
// hasParentTraversal - Checks for parent directory traversal
// Location: chunks.10.mjs:1187-1189
// ============================================

// ORIGINAL (for source lookup):
function p61(A) { return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(A) }

// READABLE (for understanding):
function hasParentTraversal(path) { return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(path) }

// Mapping: p61->hasParentTraversal, A->path
```

---

## 3. Permission Checking via toolPermissionContext

### checkPathDenyRule (Gj) - Rule-Based Path Permission Matching

**What it does:** Given a file path and the current permission context, checks whether the path matches any deny/allow/ask rules for a given operation type (read or edit).

**How it works:**
1. Resolves the path to absolute form via `g4()`
2. On Windows, normalizes backslashes to forward slashes
3. Iterates over permission rule sets from `toolPermissionContext`, organized by base directory
4. For each rule set, converts glob patterns to a format compatible with the `ignore` library
5. Computes the relative path from the base directory to the target file
6. Tests the relative path against the glob rules using `ignore().add(patterns).test()`
7. If a match is found, returns the matching rule; otherwise returns null

**Why this approach:**
- Using the `ignore` library (same as `.gitignore` parsing) provides familiar glob semantics that users already understand
- Rules are organized by base directory, allowing different permission scopes (project-level vs user-level)
- The function supports both `deny` and `allow` rule types, with the caller specifying which to check
- This layered approach allows the permission system to be composable: check deny first, then allow, with ask as fallback

**Key insight:** The permission check is a cascade -- `checkReadPermissions` (ro) and `checkEditPermissions` (N51) both call `Gj` multiple times with different rule types, implementing a deny-first, allow-second, ask-fallback pattern.

```javascript
// ============================================
// checkPathDenyRule - Match a file path against permission rules
// Location: chunks.174.mjs:692-721
// ============================================

// ORIGINAL (for source lookup):
function Gj(A, q, K, Y) {
    let z = g4(A);
    if (eA() === "windows" && z.includes("\\")) z = px(z);
    let w = BJq(q, K, Y);
    for (let [H, $] of w.entries()) {
        let O = Array.from($.keys()).map((D) => {
                let j = D;
                if (H === Jf && D.startsWith(Jf)) j = D.slice(1);
                if (j.endsWith("/**")) j = j.slice(0, -3);
                return j
            }),
            _ = SJq.default().add(O),
            J = hJq(H ?? h6(), z ?? h6());
        if (J.startsWith(`..${Jf}`)) continue;
        if (!J) continue;
        let X = _.test(J);
        if (X.ignored && X.rule) {
            let D = X.rule.pattern, j = D + "/**";
            if ($.has(j)) return $.get(j) ?? null;
            if (H === Jf && !D.startsWith(Jf)) { D = Jf + D; let M = D + "/**"; if ($.has(M)) return $.get(M) ?? null }
            return $.get(D) ?? null
        }
    }
    return null
}

// READABLE (for understanding):
function checkPathDenyRule(path, permissionContext, operationType, ruleBehavior) {
    let resolvedPath = resolvePath(path);
    if (getPlatform() === "windows" && resolvedPath.includes("\\")) resolvedPath = toForwardSlash(resolvedPath);
    let ruleMap = getPermissionRules(permissionContext, operationType, ruleBehavior);
    for (let [baseDir, ruleSet] of ruleMap.entries()) {
        let patterns = Array.from(ruleSet.keys()).map((pattern) => {
                let adjusted = pattern;
                if (baseDir === PATH_SEP && pattern.startsWith(PATH_SEP)) adjusted = pattern.slice(1);
                if (adjusted.endsWith("/**")) adjusted = adjusted.slice(0, -3);
                return adjusted
            }),
            ignoreFilter = ignore().add(patterns),
            relativePath = getRelativePath(baseDir ?? getCwd(), resolvedPath ?? getCwd());
        if (relativePath.startsWith(`..${PATH_SEP}`)) continue;
        if (!relativePath) continue;
        let result = ignoreFilter.test(relativePath);
        if (result.ignored && result.rule) {
            // Return the matching rule
            return matchedRule ?? null;
        }
    }
    return null
}

// Mapping: Gj->checkPathDenyRule, A->path, q->permissionContext, K->operationType, Y->ruleBehavior, BJq->getPermissionRules, SJq->ignore, hJq->getRelativePath, Jf->PATH_SEP
```

### checkReadPermissions (ro) - Full Read Permission Pipeline

**What it does:** Determines whether a Read tool invocation should be allowed, denied, or require user approval.

**How it works (cascade order):**
1. **UNC path check**: If the path starts with `\\` or `//`, always ask (network resource defense)
2. **Suspicious Windows path check**: Detects alternate data streams, short names, long path prefixes
3. **Deny rules**: Checks for explicit deny rules -- if matched, returns `behavior: "deny"`
4. **Ask rules**: Checks for explicit ask rules -- if matched, returns `behavior: "ask"`
5. **Edit permissions check (N51)**: Falls through to edit permission logic for allow rules
6. **Default working directory check (EI)**: If the path is within the working directory, auto-allow
7. **Suspicious path check (vmA)**: Additional defense-in-depth path validation
8. **Allow rules**: Checks for explicit allow rules -- if matched, returns `behavior: "allow"`
9. **Fallback**: Returns `behavior: "ask"` with permission suggestions

**Key insight:** The cascade implements defense-in-depth: deny is checked before allow, ensuring that a deny rule always wins over a conflicting allow rule. The working directory auto-allow means files within the project are readable by default, matching user expectations.

---

## 4. FileWriteTool Validation: Read-Before-Write Safety

### Write Validation Algorithm

**What it does:** Prevents accidental data loss by ensuring the agent has read a file before overwriting it, and that the file has not been modified since the last read.

**How it works:**
1. Resolve the path and check deny rules (same as read)
2. Handle UNC paths (allow without further checks for remote paths)
3. Check if the file exists -- if not, allow (new file creation)
4. Retrieve the `readFileState` entry for this file:
   - If no entry exists: reject with "File has not been read yet" (errorCode 2)
   - If entry exists but file modification timestamp is newer than the read timestamp: reject with "File has been modified since read" (errorCode 3)
5. If all checks pass, allow the write

**Why this approach:**
- The read-before-write requirement ensures the agent has context about what it's overwriting
- The timestamp check catches external modifications (user edits, linter auto-fixes, other tools)
- This prevents a class of bugs where the agent writes based on stale knowledge
- Error code 2 (not read) tells the agent to read first; error code 3 (modified) tells it to re-read

```javascript
// ============================================
// FileWriteTool.validateInput - Read-before-write safety check
// Location: chunks.146.mjs:483-514
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ file_path: A }, q) {
    let K = g4(A), Y = await q.getAppState();
    if (Gj(K, Y.toolPermissionContext, "edit", "deny") !== null) return { result: !1, message: "File is in a directory that is denied by your permission settings.", errorCode: 1 };
    if (K.startsWith("\\\\") || K.startsWith("//")) return { result: !0 };
    if (!b1().existsSync(K)) return { result: !0 };
    let H = q.readFileState.get(K);
    if (!H) return { result: !1, message: "File has not been read yet. Read it first before writing to it.", errorCode: 2 };
    if (H) { if (aW(K) > H.timestamp) return { result: !1, message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.", errorCode: 3 } }
    return { result: !0 }
}

// READABLE (for understanding):
async validateInput({ file_path }, context) {
    let resolvedPath = resolvePath(file_path);
    let appState = await context.getAppState();
    if (checkPathDenyRule(resolvedPath, appState.toolPermissionContext, "edit", "deny") !== null) {
        return { result: false, message: "File is in a directory that is denied.", errorCode: 1 };
    }
    if (resolvedPath.startsWith("\\\\") || resolvedPath.startsWith("//")) return { result: true };
    if (!fs().existsSync(resolvedPath)) return { result: true };  // New file, OK
    let readState = context.readFileState.get(resolvedPath);
    if (!readState) return { result: false, message: "File has not been read yet.", errorCode: 2 };
    if (readState) {
        if (getModTime(resolvedPath) > readState.timestamp) {
            return { result: false, message: "File has been modified since read.", errorCode: 3 };
        }
    }
    return { result: true }
}

// Mapping: g4->resolvePath, Gj->checkPathDenyRule, b1->fs, aW->getModTime
```

---

## 5. File History and State Tracking

### readFileState: In-Memory Read Tracking

The `readFileState` is a `Map<string, ReadFileEntry>` maintained on the tool context. Each entry records:
- `content`: The full text content returned to the agent
- `timestamp`: The file's modification time at the moment of reading
- `offset` / `limit`: If a partial read was performed, the range parameters

This state serves two purposes:
1. **Write validation**: Enables the read-before-write check (see above)
2. **Duplicate read detection**: The `Ia4` function (chunks.146.mjs:2147) computes token statistics and detects when the same file is read multiple times, tracking wasted tokens

### updateFileHistoryState: Persistent Undo Support

When `z2()` (a feature flag check) is enabled, the Write tool calls `Xt(updateFileHistoryState, path, uuid)` before writing. This saves the previous version of the file to enable undo operations. The history is keyed by file path and tool use UUID.

### File Operation Tracking (eS)

Every successful file read/write calls `eS()` to record the operation. This tracking function logs:
- `operation`: "read" or "write"
- `tool`: "FileReadTool" or "FileWriteTool"
- `filePath`: The resolved path
- `content`: The content read or written (for reads) or type info (for writes)

This data feeds into the telemetry and token analysis systems.

### Duplicate Read Analysis

The `Ia4` function (chunks.146.mjs:2147) analyzes message history to detect duplicate file reads:

```javascript
// ============================================
// analyzeMessageTokens - Detects duplicate reads and computes token statistics
// Location: chunks.146.mjs:2147-2185
// ============================================

// ORIGINAL (for source lookup):
function Ia4(A) {
    let q = { toolRequests: new Map, toolResults: new Map, humanMessages: 0, assistantMessages: 0,
              localCommandOutputs: 0, other: 0, attachments: new Map, duplicateFileReads: new Map, total: 0 };
    // ... processes all messages, tracking Read tool usage ...
    // For each Read tool_use, records file_path in z map
    // For each tool_result matching a Read, increments count and totalTokens
    // At end: any file with count > 1 gets (count-1) * avgTokens added to duplicateFileReads
    return q
}

// READABLE (for understanding):
function analyzeMessageTokens(messages) {
    let stats = { toolRequests: new Map, toolResults: new Map, humanMessages: 0, assistantMessages: 0,
                  localCommandOutputs: 0, other: 0, attachments: new Map, duplicateFileReads: new Map, total: 0 };
    // Processes all messages, tracking Read tool usage
    // For duplicate reads: estimates wasted tokens as (readCount - 1) * averageTokensPerRead
    return stats
}

// Mapping: Ia4->analyzeMessageTokens, A->messages, q->stats
```

**Key insight:** The duplicate read tracker is used for telemetry reporting, not for preventing reads. It helps Anthropic understand agent efficiency and optimize the system prompt guidance around file reading patterns.

---

## 6. FileReadTool Validation Details

### Read Validation Algorithm

**What it does:** Validates read tool input before executing the file read.

**How it works (in order):**
1. **PDF page validation**: If `pages` parameter is provided, validates the format (e.g., "1-5", "3") and enforces maximum pages per request (`wD1`)
2. **Deny rule check**: Uses `Gj` to check if the path is in a denied directory
3. **UNC path passthrough**: Network paths (`\\...`, `//...`) are allowed without further checks
4. **File existence check**: If the file doesn't exist, returns error with "Did you mean?" suggestion via `mP6()`
5. **Binary file check**: Rejects known binary extensions that cannot be meaningfully displayed as text
6. **Empty image check**: Rejects empty image files
7. **File size check**: For non-image, non-notebook, non-PDF files without offset/limit, rejects files exceeding `OU1` bytes with a message suggesting offset/limit or GrepTool

**Key insight:** The validation is lenient for image and notebook files (handled by dedicated code paths in `call()`) but strict for text files, enforcing size limits to prevent context window bloat. The "Did you mean?" suggestion (`mP6`) helps the agent self-correct typos.

---

## 7. LSP Integration on File Write

When a file is written, the Write tool notifies the LSP server (if connected) via two calls:
1. `changeFile(path, content)` - Notifies the language server of the content change
2. `saveFile(path)` - Triggers save-related actions (formatting, linting)

Additionally, the `KI` class (chunks.146.mjs:3, a diagnostics manager) captures pre-edit diagnostics via `beforeFileEdited()` and compares them post-edit via `getNewDiagnostics()` to surface new issues introduced by the write.

---

## 8. Skill Directory Triggers

Both Read and Write tools check if the accessed file is within a "skill trigger directory" via `TW1([path], cwd)`. If so, the path is added to `dynamicSkillDirTriggers` and `vW1()` is called to potentially reload skills. This enables the system to dynamically discover new skills when files are created in or read from skill directories.
