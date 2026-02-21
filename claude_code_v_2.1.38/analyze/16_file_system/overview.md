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

---

## 9. EditTool — String Replacement Tool

### Architecture

The `EditTool` (`sW`, chunks.134.mjs:2124) performs surgical string replacements within existing files, unlike `FileWriteTool` which overwrites entire file content.

> Full analysis: [../05_tools/edit_tool.md](../05_tools/edit_tool.md)

### Key Differences from FileWriteTool

| Property | FileWriteTool | EditTool |
|----------|--------------|----------|
| Operation | Overwrite entire file | Replace specific substring |
| New files | Can create new files | Cannot create (unless old_string="") |
| Input required | file_path + content | file_path + old_string + new_string |
| Notebook support | Cannot write .ipynb | Redirects to NotebookEdit |
| replace_all | N/A | Optional: replace all occurrences |

### Input Schema

```typescript
{
    file_path: string,     // Absolute path to file
    old_string: string,    // Text to find and replace (empty = create new file)
    new_string: string,    // Replacement text
    replace_all?: boolean  // Replace all occurrences (default: false)
}
```

### Output Schema

```typescript
{
    data: {
        filePath: string,
        oldString: string,        // Actual match found (may differ from old_string due to fuzzy matching)
        newString: string,
        originalFile: string,     // Full original content (for diff display)
        structuredPatch: UnifiedDiff[], // Array of diff hunks
        userModified: boolean,    // Whether user modified input during approval
        replaceAll: boolean,
        gitDiff?: string          // Only in remote mode with tengu_quartz_lantern feature
    }
}
```

### 9-Step Validation (in order)

| Step | Error Code | Condition | Message |
|------|-----------|-----------|---------|
| 1 | errorCode 1 | `old_string === new_string` | "No changes to make" |
| 2 | errorCode 2 | Permission deny rule matched | "File is in a denied directory" |
| 3 | - | UNC/network path | Pass through |
| 4 | errorCode 4 | File doesn't exist | "File does not exist. Did you mean X?" |
| 5 | errorCode 5 | `.ipynb` extension | "Use NotebookEdit tool" |
| 6 | errorCode 6 | `readFileState` has no entry | "File has not been read yet" |
| 7 | errorCode 7 | mtime > readFileState.timestamp | "File modified since read" |
| 8 | errorCode 8 | `old_string` not found in file | "String to replace not found" |
| 9 | errorCode 9 | Multiple matches + `replace_all=false` | "Found N matches, set replace_all=true" |

### Fuzzy String Matching (PK1)

The `findExactString` function (`PK1`) performs whitespace-normalized matching:
- Normalizes tabs/spaces in both file content and `old_string`
- Returns the exact match from the file (not the LLM's version)
- The returned match is used for replacement, preserving file formatting

**Why critical:** LLMs often introduce subtle whitespace differences when generating `old_string`. Without fuzzy matching, edit operations would fail frequently.

### Encoding and Line Ending Preservation

```javascript
// Detect existing encoding and line endings before writing
let lineEnding = fs.existsSync(absolutePath) ? detectLineEnding(absolutePath) : "LF";
// Qd: analyzes first 8KB of file for \r\n vs \n
let encoding = fs.existsSync(absolutePath) ? detectEncoding(absolutePath) : "utf8";
// AX: reads BOM bytes and heuristics for UTF-8, UTF-16LE, UTF-16BE, Latin-1

// Write with preserved format
writeFileWithEncoding(absolutePath, updatedFile, encoding, lineEnding);
```

**Effect:** A Windows file (CRLF) edited on Linux remains CRLF. UTF-16 files stay UTF-16. This prevents spurious diffs in version control caused by format conversion.

### UI Rendering

```
✓ Edit (src/app.ts)           ← renderToolUseMessage (IF4)
- const x = 1                 ← renderToolResultMessage (bF4 → DiffViewer SP6)
+ const x = 2
```

For plan files (CLAUDE.md), message shows "" (hidden) and result shows "/plan to preview" hint.

---

## 10. GrepTool — Content Search

### Architecture

The `GrepTool` (`tS`, chunks.76.mjs:1129) wraps the `ripgrep` (`rg`) binary to provide fast, `.gitignore`-aware content search across files.

### Input Schema

```typescript
{
    pattern: string,          // Regex pattern to search
    path?: string,            // Search root directory (default: cwd)
    glob?: string,            // File filter glob (e.g., "*.ts", "**/*.tsx")
    output_mode?: "content" | "files_with_matches" | "count",  // Default: "files_with_matches"
    "-B"?: number,            // Context lines before match
    "-A"?: number,            // Context lines after match
    "-C"?: number,            // Context lines before and after
    context?: number,         // Alias for -C
    "-n"?: boolean,           // Show line numbers
    "-i"?: boolean,           // Case insensitive
    type?: string,            // ripgrep file type (js, py, rust, etc.)
    head_limit?: number,      // Limit output to first N entries
    offset?: number,          // Skip first N entries
    multiline?: boolean       // Enable multiline pattern matching
}
```

### Output Schema

```typescript
{
    mode: "content" | "files_with_matches" | "count",
    numFiles: number,        // Number of files matched
    filenames: string[],     // List of matching file paths
    content?: string,        // Match content (when mode="content")
    numLines?: number,       // Number of matching lines
    numMatches?: number,     // Total match count
    appliedLimit?: number,   // Effective head_limit applied
    appliedOffset?: number   // Effective offset applied
}
```

### Execution Flow

```javascript
// ============================================
// GrepTool.call - ripgrep execution
// Location: chunks.76.mjs:1200-1350
// ============================================

// READABLE (for understanding):
async call({ pattern, path, glob, output_mode, ...flags }, context) {
    let searchRoot = path ? resolvePath(path) : getCwd();

    // Build ripgrep command with flags
    let args = ["--json"];  // JSON output for reliable parsing

    if (flags["-i"]) args.push("--ignore-case");
    if (flags["-n"]) args.push("--line-number");
    if (glob) args.push("--glob", glob);
    if (flags.type) args.push("--type", flags.type);
    if (flags["-B"]) args.push("--before-context", String(flags["-B"]));
    if (flags["-A"]) args.push("--after-context", String(flags["-A"]));
    if (flags["-C"] || flags.context) args.push("--context", String(flags["-C"] ?? flags.context));
    if (flags.multiline) args.push("--multiline", "--multiline-dotall");

    switch (output_mode) {
        case "count": args.push("--count"); break;
        case "files_with_matches": args.push("--files-with-matches"); break;
        // "content" is default ripgrep behavior
    }

    args.push(pattern, searchRoot);

    // Execute ripgrep subprocess
    let result = await spawnRipgrep(args);

    // Apply pagination
    let lines = result.split("\n");
    if (flags.offset) lines = lines.slice(flags.offset);
    if (flags.head_limit) lines = lines.slice(0, flags.head_limit);

    return formatGrepResult(lines, output_mode);
}
```

### Permission Checking

Uses `checkReadPermissions` (ro) — same cascade as FileReadTool:
1. UNC path check
2. Deny rules
3. Ask rules
4. Working directory auto-allow
5. Explicit allow rules

### Why ripgrep Backend

- **Performance**: Parallel search using all CPU cores
- **gitignore awareness**: Automatically respects `.gitignore` patterns
- **Encoding**: Handles binary files gracefully (skips them)
- **Regex engine**: Rust regex engine is faster than PCRE for most patterns
- **Safety**: Does not follow symlinks by default

### Output Mode Selection

| Mode | Use Case | LLM Use |
|------|----------|---------|
| `files_with_matches` (default) | Find which files contain pattern | Quick codebase mapping |
| `content` | See exact match context | Understanding code usage |
| `count` | Count occurrences | Statistics and metrics |

### UI Rendering

```
✓ Grep (pattern: "useEffect", path: src/)   ← renderToolUseMessage
src/App.tsx                                   ← renderToolResultMessage
src/components/Header.tsx
src/hooks/useData.ts
```

In `content` mode:
```
✓ Grep (useEffect)
src/App.tsx:12:  useEffect(() => {
src/App.tsx:15:  }, [data]);
```

---

## 11. GlobTool — File Pattern Matching

### Architecture

The `GlobTool` (`WB`, chunks.76.mjs:1495) finds files matching glob patterns, returning results sorted by modification time (most recently modified first).

### Input Schema

```typescript
{
    pattern: string,  // Glob pattern (e.g., "**/*.ts", "src/**/*.{js,jsx}")
    path?: string     // Search root (default: cwd)
}
```

### Output Schema

```typescript
{
    durationMs: number,  // Search duration
    numFiles: number,    // Number of files found
    filenames: string[], // Matching file paths
    truncated: boolean   // Whether results were truncated at 100
}
```

### Key Implementation Details

```javascript
// ============================================
// GlobTool.call - File pattern matching
// Location: chunks.76.mjs:1560-1606
// ============================================

// READABLE (for understanding):
async call({ pattern, path }, context) {
    let searchRoot = path ? resolvePath(path) : getCwd();

    let start = Date.now();

    // Check directory exists
    if (!fs.existsSync(searchRoot) || !fs.statSync(searchRoot).isDirectory()) {
        throw new Error(`Path is not a directory: ${searchRoot}`);
    }

    // Execute glob with modification time sorting
    let files = await globWithStats(pattern, {
        cwd: searchRoot,
        dot: false,       // Exclude hidden files by default
        absolute: true,   // Return absolute paths
        nodir: true       // Files only, not directories
    });

    // Sort by modification time (newest first)
    files.sort((a, b) => b.mtime - a.mtime);

    // Truncate to prevent overwhelming results
    let FILE_LIMIT = 100;
    let truncated = files.length > FILE_LIMIT;
    if (truncated) files = files.slice(0, FILE_LIMIT);

    return {
        durationMs: Date.now() - start,
        numFiles: files.length,
        filenames: files.map(f => f.path),
        truncated
    }
}
```

### Sort Strategy — Modification Time

**Why sort by mtime descending:** Most recently modified files are most relevant to the current task. When searching for recently edited files or finding the "latest version" of something, mtime ordering surfaces the right results first.

**Trade-off:** Alphabetical ordering (which users might expect) is sacrificed for relevance. The `truncated: true` flag warns when more results exist.

### Result Limit (100 files)

**Why 100:** Large glob patterns (like `**/*.ts`) in big repositories can match thousands of files. Returning all of them would:
1. Overflow the context window
2. Slow down the LLM parsing the result
3. Usually not be necessary (the agent can refine its pattern)

### UI Rendering

```
✓ Glob (**/*.ts, src/)          ← renderToolUseMessage
src/app.ts (modified 2min ago)  ← renderToolResultMessage
src/server.ts (modified 1hr ago)
src/types.ts (modified 2hr ago)
[... 97 more files matching pattern]
```

---

## 12. NotebookEdit Tool — Jupyter Cell Editor

### Architecture

The `NotebookEditTool` (`gd`, chunks.134.mjs:2615) provides Jupyter notebook-aware cell editing, handling the JSON structure of `.ipynb` files correctly.

> See also: [../05_tools/edit_tool.md](../05_tools/edit_tool.md) for why EditTool redirects to NotebookEdit

### Why a Separate Notebook Tool

Jupyter notebooks are JSON files with a specific structure:
```json
{
    "nbformat": 4,
    "nbformat_minor": 5,
    "metadata": { "language_info": { "name": "python" } },
    "cells": [
        {
            "cell_type": "code",
            "id": "abc123",
            "source": "print('hello')",
            "outputs": [],
            "execution_count": null
        }
    ]
}
```

Using `EditTool` to edit notebooks would:
1. Risk corrupting the JSON structure
2. Miss cell metadata updates (cell type, outputs clearing)
3. Generate incorrect cell IDs for nbformat >= 4.5

### Input Schema

```typescript
{
    notebook_path: string,              // Absolute path to .ipynb file
    cell_id?: string,                   // Cell ID to target
    new_source: string,                 // New cell content
    cell_type?: "code" | "markdown",    // Required for insert mode
    edit_mode?: "replace" | "insert" | "delete"  // Default: "replace"
}
```

### Edit Modes

```
replace:  Update existing cell's source (preserves type, outputs cleared)
insert:   Insert new cell after cell_id (or at beginning if no cell_id)
delete:   Remove cell from notebook
```

### Validation (6 checks)

| Check | Condition | Error |
|-------|-----------|-------|
| 1 | File doesn't exist | "Notebook file does not exist" |
| 2 | Not a `.ipynb` file | "File must be a Jupyter notebook" |
| 4 | Invalid edit_mode | "Edit mode must be replace, insert, or delete" |
| 5 | insert mode + no cell_type | "Cell type required for insert" |
| 6 | Not valid JSON | "Notebook is not valid JSON" |
| 7/8 | Cell ID not found | "Cell with ID X not found" |

### Cell ID Handling

```javascript
// ============================================
// NotebookEdit call - Cell ID management
// Location: chunks.134.mjs:2756-2800
// ============================================

// READABLE (for understanding):
// For nbformat >= 4.5: generate random cell IDs
if (notebook.nbformat > 4 || (notebook.nbformat === 4 && notebook.nbformat_minor >= 5)) {
    if (editMode === "insert") {
        cellId = Math.random().toString(36).substring(2, 15);  // Random base-36 ID
    } else if (cellId !== null) {
        cellId = targetCellId;  // Preserve existing ID
    }
}

// Edge case: replace at end of notebook → convert to insert
if (editMode === "replace" && cellIndex === notebook.cells.length) {
    editMode = "insert";
    if (!cellType) cellType = "code";  // Default new cells to code
}
```

**Why random IDs:** nbformat 4.5+ requires unique cell IDs. Random base-36 strings (13 chars) provide sufficient uniqueness without needing a UUID library.

### Numeric Cell Index Fallback

The LLM may specify a cell by index instead of ID (e.g., `cell_id: "0"` for first cell). The tool handles this:
```javascript
let cellIndex = notebook.cells.findIndex(cell => cell.id === cell_id);
if (cellIndex === -1) {
    // Try parsing as numeric index
    let asNumber = parseInt(cell_id, 10);
    if (!isNaN(asNumber)) cellIndex = asNumber;
}
```

### UI Rendering

```
✓ NotebookEdit (data_analysis.ipynb)    ← renderToolUseMessage
Cell 3: def analyze_data(df):            ← renderToolResultMessage
    return df.describe()
```

---

## 13. FileReadTool — Multi-format Reading

### Image File Reading Path

```javascript
// ============================================
// FileReadTool.call - Image reading path
// Location: chunks.146.mjs:1800-1850
// ============================================

// READABLE (for understanding):
async call({ file_path, offset, limit, pages }, context) {
    let absolutePath = resolvePath(file_path);
    let ext = getExtension(absolutePath).toLowerCase();

    // === IMAGE PATH ===
    if (IMAGE_EXTENSIONS.includes(ext)) {
        let imageBuffer = fs.readFileSync(absolutePath);

        // Resize if too large for context
        let resized = await resizeImageIfNeeded(imageBuffer, ext, {
            maxWidth: 1568,    // Anthropic's image size limit
            maxHeight: 1568,
            quality: 0.85      // JPEG quality for resized images
        });

        return {
            type: "image",
            data: resized.toString("base64"),
            mediaType: getMediaType(ext),   // "image/png", "image/jpeg", etc.
            width: resized.width,
            height: resized.height,
            wasResized: resized.wasResized
        }
    }

    // === PDF PATH ===
    if (ext === ".pdf") {
        if (!pages) {
            // Return metadata first
            return { type: "pdf_metadata", pageCount: getPdfPageCount(absolutePath) }
        }
        // Parse page range: "1-5" → [1, 2, 3, 4, 5]
        let pageNumbers = parsePageRange(pages);
        let pdfImages = await renderPdfPages(absolutePath, pageNumbers);
        return {
            type: "pdf",
            pages: pdfImages.map((img, i) => ({
                pageNumber: pageNumbers[i],
                data: img.toString("base64"),
                mediaType: "image/png"
            }))
        }
    }

    // === NOTEBOOK PATH ===
    if (ext === ".ipynb") {
        let content = fs.readFileSync(absolutePath, { encoding: "utf8" });
        let notebook = JSON.parse(content);
        return {
            type: "notebook",
            cells: notebook.cells.map((cell, i) => ({
                cellNumber: i + 1,
                cellId: cell.id,
                cellType: cell.cell_type,
                source: Array.isArray(cell.source) ? cell.source.join("") : cell.source,
                outputs: formatCellOutputs(cell.outputs ?? []),
                executionCount: cell.execution_count
            }))
        }
    }

    // === TEXT PATH ===
    // ... pagination with offset/limit
}
```

### Image Size Limits

Images are resized to fit within Anthropic API constraints:
- Maximum dimensions: 1568×1568 pixels
- Resizing preserves aspect ratio
- JPEG compression at 85% quality for PNG→JPEG conversion
- GIF/WebP → PNG conversion for compatibility

### PDF Rendering

PDF files are rendered page-by-page as PNG images via a native PDF renderer:
- Maximum 20 pages per request (`wD1`)
- Page range format: `"1-5"`, `"3"`, `"10-20"`
- Each page is base64-encoded PNG
- Used for multimodal vision analysis of PDF documents

### Notebook Formatting

Notebooks are parsed and returned as structured cell data:
- Source is joined from array form (`["line1\n", "line2"]` → `"line1\nline2"`)
- Outputs include stdout, stderr, display_data, execute_result
- Execution count preserved for context

### Binary File Detection

Before reading text files, the tool checks for binary extensions:
```javascript
let BINARY_EXTENSIONS = [
    ".exe", ".dll", ".so", ".dylib",  // Executables
    ".zip", ".tar", ".gz", ".7z",     // Archives
    ".mp3", ".mp4", ".wav", ".avi",   // Media
    ".db", ".sqlite", ".mdb",         // Databases
    // ... and many more
];

if (BINARY_EXTENSIONS.includes(ext)) {
    return { result: false, message: `Cannot read binary file ${ext}. Use appropriate binary tools.` }
}
```

### File Size Limits

For text files without offset/limit:
- Max size: `OU1` bytes (configurable, defaults to ~100KB)
- Exceeded → error with suggestion to use `offset`/`limit` or GrepTool
- Images: No size limit (resize handles large images)
- Notebooks: No size limit (cell-by-cell structure)
- PDFs: Limited by page count (20 pages max)

### UI Rendering per File Type

```
Text file:
✓ Read (src/app.ts)
     1  import React from 'react'
     2
     3  function App() {

Image file:
✓ Read (screenshot.png)
[image rendered inline in terminal - 1024×768]

PDF file:
✓ Read (document.pdf, pages 1-3)
[Page 1 image]
[Page 2 image]
[Page 3 image]

Notebook file:
✓ Read (analysis.ipynb)
Cell 1 [code]: import pandas as pd
Cell 2 [markdown]: ## Data Analysis
Cell 3 [code]: df = pd.read_csv('data.csv')
  Output: DataFrame with 1000 rows
```

---

## 14. UI Rendering Summary — All File System Tools

| Tool | Use Header | Result Display | Error Display |
|------|-----------|----------------|---------------|
| **Read** | `File path breadcrumb` | Line-numbered text / inline image / PDF pages / notebook cells | "File not found", binary rejection |
| **Write** | `File path breadcrumb` | Unified diff or full content | "File not read", permission denied |
| **Edit** | `File path breadcrumb` | Unified diff (DiffViewer SP6) | "File must be read first" (dimmed) |
| **Glob** | `Pattern + path` | File list with mtime | "Directory not found" |
| **Grep** | `Pattern + path` | Match list or content | "Path not found" |
| **NotebookEdit** | `Notebook path` | Cell content | "Cell not found", "Invalid .ipynb" |

### Common Rendering Patterns

**File path breadcrumb** (AE component):
- Non-verbose: just filename (`app.ts`)
- Verbose: full absolute path (`/Users/user/project/src/app.ts`)
- Plan files: hidden (empty string for CLAUDE.md)

**Diff display** (SP6 DiffViewer):
- Shows unified diff with `- removed` / `+ added` color coding
- Includes file header with path
- Shows context lines around changes

**Error handling in renders:**
- Non-verbose: brief user-friendly message
- Verbose: full error details with JSON
- Most errors are categorized to show actionable guidance (e.g., "read the file first")
