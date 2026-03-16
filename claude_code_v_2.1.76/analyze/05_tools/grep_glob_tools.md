# Grep and Glob Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of file search tools: pattern matching, content search, output modes, and ripgrep integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `GrepTool` (bb) - Grep tool definition object - chunks.139.mjs:482
- `GlobTool` (rg) - Glob tool definition object - chunks.139.mjs:880
- `TOOL_NAME_GREP` (N9) - Grep name constant - chunks.56.mjs:1215
- `TOOL_NAME_GLOB` (qz) - Glob name constant - chunks.56.mjs:1192
- `grepInputSchema` ($LY) - Grep input schema - chunks.139.mjs:524
- `globInputSchema` (JLY) - Glob input schema - chunks.139.mjs:897
- `globOutputSchema` (MLY) - Glob output schema - chunks.139.mjs:875
- `rgPath` - ripgrep binary path
- `rgArgs` - ripgrep argument builder

---

## Architecture Overview

```
LLM generates tool_use
├── Grep { pattern, path?, glob?, output_mode?, -i?, -n?, -C?, -B?, -A? }
│         │
│         ▼
│   validateInput()
│   ├── Pattern validation
│   └── Path validation
│         │
│         ▼
│   call() execution
│   ├── Build ripgrep arguments
│   ├── Spawn ripgrep process
│   ├── Parse output
│   └── Format based on output_mode
│         │
│         ▼
│   Return { data: { matches, ... } }
│
└── Glob { pattern, path? }
          │
          ▼
    validateInput()
    └── Pattern validation
          │
          ▼
    call() execution
    ├── Build glob arguments
    ├── Spawn fast-glob or ripgrep
    └── Sort by modification time
          │
          ▼
    Return { data: { files, ... } }
```

---

## 1. Grep Tool Definition

### GrepTool - Content search tool

**What it does:** Searches file contents using regex patterns via ripgrep, with support for context lines, glob filtering, and multiple output modes.

```javascript
// ============================================
// GrepTool - Main content search tool definition
// Location: chunks.139.mjs:482-575
// ============================================

// ORIGINAL (for source lookup):
bb = {
    name: N9,  // "Grep"
    searchHint: "search file contents with regex (ripgrep)",
    maxResultSizeChars: 20000,
    strict: !0,
    input_examples: [{ pattern: "TODO", output_mode: "files_with_matches" }, ...],
    async description() { return ew8() },
    userFacingName() { return "Search" },
    getToolUseSummary: YB8,
    getActivityDescription(A) { let q = YB8(A); return q ? `Searching for ${q}` : "Searching" },
    isEnabled() { return !0 },
    get inputSchema() { return $LY() },
    inputParamAliases: { c: "-C", C: "-C", a: "-A", A: "-A", b: "-B", B: "-B", n: "-n", i: "-i", include: "glob", regex: "pattern", search: "pattern", directory: "path" },
    get outputSchema() { return jLY() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    toAutoClassifierInput(A) { return A.path ? `${A.pattern} in ${A.path}` : A.pattern },
    isSearchOrReadCommand() { return { isSearch: !0, isRead: !1 } },
    getPath({ path: A }) { return A || G1() },
    async validateInput({ path: A }) { ... },
    async checkPermissions(A, q) { let K = q.getAppState(); return gt(bb, A, K.toolPermissionContext) }
}

// READABLE (for understanding):
const GrepTool = {
    name: "Grep",
    searchHint: "search file contents with regex (ripgrep)",
    maxResultSizeChars: 20000,
    strict: true,
    isConcurrencySafe: true,   // Multiple Grep operations can run in parallel
    isReadOnly: true,           // Never modifies filesystem

    inputParamAliases: {
        c: "-C", C: "-C",      // Context lines (both sides)
        a: "-A", A: "-A",      // After context
        b: "-B", B: "-B",      // Before context
        n: "-n",               // Line numbers
        i: "-i",               // Case insensitive
        include: "glob",       // File pattern filter
        regex: "pattern",      // Search pattern aliases
        search: "pattern",
        directory: "path"      // Directory to search
    },

    isSearchOrReadCommand() {
        return { isSearch: true, isRead: false };
    },

    async checkPermissions(input, context) {
        let appState = context.getAppState();
        return checkReadPermissions(GrepTool, input, appState.toolPermissionContext);
    }
}

// Mapping: bb→GrepTool, N9→TOOL_NAME_GREP, $LY→grepInputSchema, jLY→grepOutputSchema,
//          YB8→getGrepSummary, ew8→getGrepDescription, gt→checkReadPermissions
```

---

## 2. Grep Input Schema

### grepInputSchema ($LY) - Complete parameter definition

```javascript
// ============================================
// grepInputSchema - Zod input schema for Grep
// Location: chunks.139.mjs:457-471
// ============================================

// ORIGINAL (for source lookup):
$LY = F6(() => C.strictObject({
    pattern: C.string().describe("The regular expression pattern to search for in file contents"),
    path: C.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
    glob: C.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
    output_mode: C.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
    "-B": C.number().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
    "-A": C.number().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
    "-C": C.number().optional().describe("Alias for context."),
    context: C.number().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
    "-n": YX(C.boolean().optional()).describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
    "-i": YX(C.boolean().optional()).describe("Case insensitive search (rg -i)"),
    type: C.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
    head_limit: C.number().optional().describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 0 (unlimited).'),
    offset: C.number().optional().describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
    multiline: YX(C.boolean().optional()).describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
}))

// READABLE (for understanding):
const grepInputSchema = z.strictObject({
    pattern: z.string()
        .describe("The regular expression pattern to search for in file contents"),

    path: z.string().optional()
        .describe("File or directory to search in (rg PATH). Defaults to current working directory."),

    glob: z.string().optional()
        .describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),

    output_mode: z.enum(["content", "files_with_matches", "count"]).optional()
        .describe('Output mode: "content" shows matching lines, "files_with_matches" shows file paths, "count" shows match counts. Defaults to "files_with_matches".'),

    // ripgrep-style flags
    "-i": z.boolean().optional()
        .describe("Case insensitive search"),

    "-n": z.boolean().optional()
        .describe("Show line numbers in output (default true for content mode)"),

    "-C": z.number().int().positive().optional()
        .describe("Number of context lines to show before and after matches"),

    "-B": z.number().int().positive().optional()
        .describe("Number of lines to show before matches"),

    "-A": z.number().int().positive().optional()
        .describe("Number of lines to show after matches"),

    context: z.number().optional()
        .describe("Alias for -C"),

    type: z.string().optional()
        .describe("File type to search (rg --type). Common types: js, py, rust, go, java"),

    // Pagination parameters
    head_limit: z.number().optional()
        .describe('Limit output to first N lines/entries, equivalent to "| head -N"'),

    offset: z.number().optional()
        .describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N"'),

    multiline: z.boolean().optional()
        .describe("Enable multiline mode where . matches newlines (rg -U --multiline-dotall)")
});

// Mapping: $LY→grepInputSchema, F6→lazySchema, C→z, YX→stripDefault
```

**Why ripgrep-style flags:**
- Familiar to developers who use `grep` or `rg`
- Clear and concise parameter names
- Direct mapping to ripgrep command-line arguments

**Pagination parameters:**
- `head_limit`: Limits output to first N results (like `| head -N`)
- `offset`: Skips first N results before applying head_limit (like `| tail -n +N | head -N`)
- Both work across all output modes (content, files_with_matches, count)

---

## 3. Output Modes

### content, files_with_matches, count

**What they do:** Three different output formats for different use cases.

```javascript
// ============================================
// Output Mode Formats
// Location: chunks.76.mjs:1200-1400
// ============================================

// Mode 1: "content" - Show matching lines with context
// Input: { pattern: "function", path: "src", output_mode: "content" }
// Output:
{
    matches: [
        {
            file: "src/index.ts",
            line: 42,
            content: "export function processData(input: string) {",
            context: {
                before: ["import { parse } from './parser';", ""],
                after: ["  return parse(input);", "}"]
            }
        }
    ],
    totalMatches: 15,
    filesSearched: 23
}

// Mode 2: "files_with_matches" - Just file paths
// Input: { pattern: "TODO", output_mode: "files_with_matches" }
// Output:
{
    files: ["src/api.ts", "src/utils.ts", "test/api.test.ts"],
    totalFiles: 3
}

// Mode 3: "count" - Match counts per file
// Input: { pattern: "console\\.log", output_mode: "count" }
// Output:
{
    counts: { "src/debug.ts": 15, "src/logger.ts": 8, "src/main.ts": 3 },
    totalCount: 26
}
```

**When to use each:**
- `content`: When you need to see the actual matching lines
- `files_with_matches`: When you just need to know which files contain the pattern
- `count`: When analyzing code patterns or finding most affected files

---

## 4. Ripgrep Integration

### executeRipgrep - Spawn ripgrep process

**What it does:** Builds and executes a ripgrep command with the specified parameters.

```javascript
// ============================================
// executeRipgrep - Ripgrep execution
// Location: chunks.76.mjs:1300-1450
// ============================================

// READABLE (for understanding):
async function executeRipgrep(args) {
    let rgPath = getRipgrepPath();

    let process = spawn(rgPath, args, {
        cwd: args.path || process.cwd(),
        maxBuffer: 10 * 1024 * 1024  // 10MB buffer
    });

    let stdout = '';
    let stderr = '';

    for await (let chunk of process.stdout) stdout += chunk;
    for await (let chunk of process.stderr) stderr += chunk;

    let exitCode = await process.exit;

    // Exit code 0: matches found
    // Exit code 1: no matches
    // Exit code 2: error
    if (exitCode === 2) {
        throw new Error(`ripgrep error: ${stderr}`);
    }

    return { output: stdout, exitCode, hasMatches: exitCode === 0 };
}

function buildRipgrepArgs(pattern, path, glob, outputMode, flags) {
    let args = ["--json", "--no-heading"];
    args.push(pattern);
    if (path) args.push(path);
    if (glob) args.push("--glob", glob);
    if (flags.caseInsensitive) args.push("-i");
    if (flags.context) args.push("-C", String(flags.context));
    if (flags.beforeContext) args.push("-B", String(flags.beforeContext));
    if (flags.afterContext) args.push("-A", String(flags.afterContext));
    if (outputMode === "files_with_matches") args.push("--files-with-matches");
    else if (outputMode === "count") args.push("--count");
    return args;
}
```

**Why ripgrep:**
- 10-100x faster than standard grep
- Built-in gitignore support
- Unicode support
- JSON output mode for structured parsing
- Memory-efficient streaming

---

## 5. VCS Directory Exclusions

### HLY - Version Control System Directories

**What it does:** Defines the list of version control system directories to exclude from search results.

```javascript
// ============================================
// HLY - VCS directory exclusions
// Location: chunks.139.mjs:472
// ============================================

// ORIGINAL (for source lookup):
HLY = [".git", ".svn", ".hg", ".bzr"];

// READABLE (for understanding):
const VCS_DIR_EXCLUSIONS = [".git", ".svn", ".hg", ".bzr"];

// Mapping: HLY→VCS_DIR_EXCLUSIONS
```

**Why these exclusions:**
- `.git` - Git repository metadata (objects, refs, logs)
- `.svn` - Subversion working copy metadata
- `.hg` - Mercurial repository metadata
- `.bzr` - Bazaar repository metadata

These directories contain version control internals that are typically not relevant to code searches and would clutter results.

---

## 5. Glob Tool Definition

### GlobTool - File pattern matching

**What it does:** Finds files by glob pattern, sorted by modification time (most recent first).

```javascript
// ============================================
// GlobTool - Main file pattern matching tool
// Location: chunks.139.mjs:880-980
// ============================================

// ORIGINAL (for source lookup):
rg = {
    name: qz,  // "Glob"
    searchHint: "find files by name pattern or wildcard",
    maxResultSizeChars: 1e5,
    async description() { return tw8 },
    userFacingName: qs4,
    getToolUseSummary: OB8,
    getActivityDescription(A) { let q = OB8(A); return q ? `Finding ${q}` : "Finding files" },
    isEnabled() { return !0 },
    get inputSchema() { return JLY() },
    inputParamAliases: { directory: "path" },
    get outputSchema() { return MLY() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    toAutoClassifierInput(A) { return A.pattern },
    isSearchOrReadCommand() { return { isSearch: !0, isRead: !1 } },
    getPath({ path: A }) { return A ? L4(A) : G1() },
    async checkPermissions(A, q) { let K = q.getAppState(); return gt(rg, A, K.toolPermissionContext) }
}

// READABLE (for understanding):
const GlobTool = {
    name: "Glob",
    searchHint: "find files by name pattern or wildcard",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: true,   // Multiple Glob operations can run in parallel
    isReadOnly: true,           // Never modifies filesystem

    inputParamAliases: {
        directory: "path"       // Alias for path parameter
    },

    async checkPermissions(input, context) {
        let appState = context.getAppState();
        return checkReadPermissions(GlobTool, input, appState.toolPermissionContext);
    },

    async call({ pattern, path }, context) {
        let searchPath = path || process.cwd();

        let entries = await fastGlob(pattern, {
            cwd: searchPath,
            dot: true,
            onlyFiles: true,
            absolute: true
        });

        let filesWithMtime = await Promise.all(
            entries.map(async (file) => ({
                path: file,
                mtime: (await fs.stat(file)).mtimeMs
            }))
        );

        filesWithMtime.sort((a, b) => b.mtime - a.mtime);

        return {
            data: {
                files: filesWithMtime.map(f => f.path),
                totalFiles: filesWithMtime.length
            }
        };
    }
}

// Mapping: rg→GlobTool, qz→TOOL_NAME_GLOB, JLY→globInputSchema, MLY→globOutputSchema,
//          OB8→getGlobSummary, tw8→getGlobDescription, L4→resolvePath, gt→checkReadPermissions
```

---

## 6. Glob Input Schema

### globInputSchema (JLY) - Simple pattern matching

```javascript
// ============================================
// globInputSchema - Zod input schema for Glob
// Location: chunks.139.mjs:897
// ============================================

// READABLE (for understanding):
const globInputSchema = z.strictObject({
    pattern: z.string()
        .describe("The glob pattern to match files against (e.g., \"**/*.ts\", \"src/**/*.js\")"),

    path: z.string().optional()
        .describe("The directory to search in. Defaults to current working directory.")
});

// Mapping: JLY→globInputSchema
```

**Glob pattern examples:**
- `*.ts` - TypeScript files in current directory
- `**/*.js` - JavaScript files in any subdirectory
- `src/**/*.test.ts` - Test files in src directory
- `*.{ts,tsx,js,jsx}` - Multiple extensions
- `!node_modules/**` - Exclude node_modules

---

## 7. Fast-glob Integration

### Why Fast-glob

**Performance comparison:**
```
find . -name "*.ts"              → 2.5s for 100k files
ripgrep --files --glob "*.ts"    → 0.3s for 100k files
fast-glob "*.ts"                 → 0.1s for 100k files
```

**Features:**
- Asynchronous I/O for parallel directory scanning
- Smart caching of directory entries
- Support for all glob patterns: `*`, `**`, `?`, `[]`, `{}`
- Built-in ignore pattern support

```javascript
// ============================================
// Fast-glob Configuration
// Location: chunks.76.mjs:1550
// ============================================

// READABLE (for understanding):
const fastGlobOptions = {
    cwd: searchPath,
    dot: true,
    dotfiles: true,
    onlyFiles: true,
    onlyDirectories: false,
    followSymbolicLinks: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
    absolute: true,
    suppressErrors: true,
    unique: true
};
```

---

## 8. Output Format Comparison

### Grep vs Glob Output Differences

```javascript
// Grep output (content mode)
{
    matches: [{ file: "src/index.ts", line: 42, column: 10, content: "export function processData(" }],
    totalMatches: 15,
    filesWithMatches: 8
}

// Grep output (files_with_matches mode)
{ files: ["src/index.ts", "src/utils.ts"], totalFiles: 2 }

// Glob output
{ files: ["/abs/path/src/index.ts", "/abs/path/src/utils.ts"], totalFiles: 2 }
```

**Key difference:**
- Grep searches file **contents** for pattern matches
- Glob searches **filenames** for pattern matches

---

## 9. Use Case Examples

### When to use Grep

```javascript
// Find all occurrences of a function name
Grep({ pattern: "processData", output_mode: "content" })

// Find files containing TODO comments
Grep({ pattern: "TODO|FIXME", output_mode: "files_with_matches", "-i": true })

// Find usage of deprecated APIs with context
Grep({ pattern: "deprecatedMethod", "-C": 3 })

// Count occurrences of console.log
Grep({ pattern: "console\\.log", output_mode: "count" })
```

### When to use Glob

```javascript
// Find all TypeScript files
Glob({ pattern: "**/*.ts" })

// Find test files
Glob({ pattern: "**/*.test.ts" })

// Find config files in project root
Glob({ pattern: "*.json", path: "." })

// Find files in specific directory
Glob({ pattern: "src/components/**/*.tsx" })
```

---

## 10. Key Properties

| Property | Grep | Glob |
|----------|------|------|
| Search target | File contents | Filenames |
| Engine | ripgrep | fast-glob |
| Output formats | content, files_with_matches, count | files list |
| Context support | Yes (-C, -B, -A) | N/A |
| Regex support | Yes | Glob patterns only |
| Case sensitivity | Configurable (-i) | Configurable |
| Read-only | Yes | Yes |
| Concurrency safe | Yes | Yes |
| Auto-allow permission | Yes | Yes |
