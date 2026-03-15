# Grep and Glob Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of file search tools: pattern matching, content search, output modes, and ripgrep integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `GrepTool` (tS) - Grep tool definition object - chunks.76.mjs:1129
- `GlobTool` (WB) - Glob tool definition object - chunks.76.mjs:1495
- `TOOL_NAME_GREP` (s9) - Grep name constant - chunks.76.mjs
- `TOOL_NAME_GLOB` (Jz) - Glob name constant - chunks.76.mjs
- `grepInputSchema` (Z99) - Grep input schema - chunks.76.mjs:1104
- `globInputSchema` (N99) - Glob input schema - chunks.76.mjs:1487
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
// Location: chunks.76.mjs:1129-1300
// ============================================

// ORIGINAL (for source lookup):
tS = {
    name: s9,  // "Grep"
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "Search for patterns in file contents" },
    async prompt() { return getGrepToolPrompt() },
    userFacingName: getGrepUserFacingName,
    getToolUseSummary: getGrepSummary,
    getActivityDescription(A) {
        let q = getGrepSummary(A);
        return q ? `Searching for ${q}` : "Searching"
    },
    isEnabled() { return !0 },
    get inputSchema() { return Z99() },  // grepInputSchema
    get outputSchema() { return getGrepOutputSchema() },
    isConcurrencySafe() { return !0 },  // Read-only search
    isReadOnly() { return !0 },
    getPath(A) { return A.path },
    async checkPermissions(A, q) { /* auto-allowed for read-only */ },
    renderToolUseMessage: renderGrepUseMessage,
    renderToolResultMessage: renderGrepResult,
    // ... other methods
}

// READABLE (for understanding):
const GrepTool = {
    name: "Grep",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: true,   // Multiple searches can run in parallel
    isReadOnly: true,           // Never modifies files

    async call({ pattern, path, glob, output_mode, "-i": caseInsensitive, "-n": lineNumbers, "-C": context, "-B": beforeContext, "-A": afterContext }, context) {
        let args = buildRipgrepArgs(pattern, path, glob, output_mode, {
            caseInsensitive, lineNumbers, context, beforeContext, afterContext
        });
        let result = await executeRipgrep(args);
        return formatGrepResult(result, output_mode);
    }
}

// Mapping: tS→GrepTool, s9→TOOL_NAME_GREP, Z99→grepInputSchema
```

---

## 2. Grep Input Schema

### grepInputSchema (Z99) - Complete parameter definition

```javascript
// ============================================
// grepInputSchema - Zod input schema for Grep
// Location: chunks.76.mjs:1104
// ============================================

// READABLE (for understanding):
const grepInputSchema = z.strictObject({
    pattern: z.string()
        .describe("The regular expression pattern to search for"),

    path: z.string().optional()
        .describe("File or directory to search in. Defaults to current working directory."),

    glob: z.string().optional()
        .describe("Glob pattern to filter files (e.g., \"*.ts\", \"**/*.js\")"),

    output_mode: z.enum(["content", "files_with_matches", "count"]).default("content")
        .describe("Output format: content (show matches), files_with_matches (file list), count (match counts)"),

    // ripgrep-style flags
    "-i": z.boolean().optional()
        .describe("Case insensitive search"),

    "-n": z.boolean().optional()
        .describe("Show line numbers (default true for content mode)"),

    "-C": z.number().int().positive().optional()
        .describe("Number of context lines to show before and after matches"),

    "-B": z.number().int().positive().optional()
        .describe("Number of lines to show before matches"),

    "-A": z.number().int().positive().optional()
        .describe("Number of lines to show after matches")
});

// Mapping: Z99→grepInputSchema
```

**Why ripgrep-style flags:**
- Familiar to developers who use `grep` or `rg`
- Clear and concise parameter names
- Direct mapping to ripgrep command-line arguments

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

## 5. Glob Tool Definition

### GlobTool - File pattern matching

**What it does:** Finds files by glob pattern, sorted by modification time (most recent first).

```javascript
// ============================================
// GlobTool - Main file pattern matching tool
// Location: chunks.76.mjs:1495-1650
// ============================================

// ORIGINAL (for source lookup):
WB = {
    name: Jz,  // "Glob"
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() { return "Find files matching a pattern" },
    async prompt() { return getGlobToolPrompt() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    // ... other methods
}

// READABLE (for understanding):
const GlobTool = {
    name: "Glob",
    maxResultSizeChars: 100000,
    strict: true,
    isConcurrencySafe: true,
    isReadOnly: true,

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

// Mapping: WB→GlobTool, Jz→TOOL_NAME_GLOB, N99→globInputSchema
```

---

## 6. Glob Input Schema

### globInputSchema (N99) - Simple pattern matching

```javascript
// ============================================
// globInputSchema - Zod input schema for Glob
// Location: chunks.76.mjs:1487
// ============================================

// READABLE (for understanding):
const globInputSchema = z.strictObject({
    pattern: z.string()
        .describe("The glob pattern to match files against (e.g., \"**/*.ts\", \"src/**/*.js\")"),

    path: z.string().optional()
        .describe("The directory to search in. Defaults to current working directory.")
});

// Mapping: N99→globInputSchema
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
