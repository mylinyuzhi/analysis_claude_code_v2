# Memory File Loading via @include System

## Overview

Memory files can be loaded through multiple paths in Claude Code. This document analyzes the `xD1` function which provides memory file loading with support for frontmatter paths, HTML comment stripping, and automatic truncation.

**Key insight**: The @include system provides a richer loading mechanism than the simple `buildMemoryPrompt` function, with support for path filtering and content transformation.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `loadMemoryFileWithIncludeSupport` (`xD1`) - Main file loading function (chunks.84.mjs:495)
- `stripHtmlComments` (`o14`) - HTML comment removal (chunks.84.mjs:469)
- `extractFrontmatterPaths` (`dv9`) - Frontmatter path extraction (chunks.84.mjs:449)
- `MEMORY_MAX_LINES` (`uj`) - 200-line truncation limit

---

## 1. Loading Paths

Memory files can be loaded via:

### 1.1 Direct Loading (Primary Path)

Through `buildMemoryPrompt` (`Q14`) - simple file read with truncation:

```
getAutoMemory() → buildMemoryPrompt() → fs.readFileSync()
```

### 1.2 @include Loading (Secondary Path)

Through `xD1` with additional processing:

```
CLAUDE.md @include → xD1() → Enhanced file loading
```

**When @include is used:**
- MEMORY.md referenced via @include in CLAUDE.md
- Memory files referenced via @-mentions
- AutoMem/TeamMem type memory loading

---

## 2. xD1 Function Analysis

### 2.1 Complete Implementation

// ============================================
// loadMemoryFileWithIncludeSupport - Memory file loading with @include features
// Location: chunks.84.mjs:495-534
// ============================================

// ORIGINAL (for source lookup):
function xD1(A, q) {
    try {
        let Y = $1().readFileSync(A, {
                encoding: "utf-8"
            }),
            z = pv9(A).toLowerCase();
        if (z && !Uv9.has(z)) return k(`Skipping non-text file in @include: ${A}`), null;
        let {
                content: _,
                paths: w
            } = dv9(Y), {
                content: O
            } = o14(_), $ = O;
        if (q === "AutoMem" || q === "TeamMem") {
            let j = O.trimEnd().split(`
`);
            if (j.length > uj) $ = j.slice(0, uj).join(`
`) + `

> WARNING: MEMORY.md is ${j.length} lines (limit: ${uj}). Only the first ${uj} lines were loaded. Move detailed content into separate topic files and keep MEMORY.md as a concise index.`
        }
        let H = $ !== Y;
        return {
            path: A,
            type: q,
            content: $,
            globs: w,
            contentDiffersFromDisk: H,
            rawContent: H ? Y : void 0
        }
    } catch (K) {
        let Y = K.code;
        if (Y === "ENOENT" || Y === "EISDIR") return null;
        if (Y === "EACCES") d("tengu_claude_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(c8()) ? 1 : 0
        })
    }
    return null
}

// READABLE (for understanding):
function loadMemoryFileWithIncludeSupport(filePath, fileType) {
    try {
        // Step 1: Read file content
        const fs = getFileSystem();
        const rawContent = fs.readFileSync(filePath, { encoding: "utf-8" });

        // Step 2: Check file extension
        const extension = getFileExtension(filePath).toLowerCase();
        if (extension && !ALLOWED_TEXT_EXTENSIONS.has(extension)) {
            logDebug(`Skipping non-text file in @include: ${filePath}`);
            return null;
        }

        // Step 3: Extract frontmatter paths (for conditional loading)
        const { content: contentWithoutFrontmatter, paths } = extractFrontmatterPaths(rawContent);

        // Step 4: Strip HTML comments
        const { content: strippedContent } = stripHtmlComments(contentWithoutFrontmatter);

        // Step 5: Apply truncation for memory types
        let finalContent = strippedContent;
        if (fileType === "AutoMem" || fileType === "TeamMem") {
            const lines = strippedContent.trimEnd().split("\n");
            if (lines.length > 200) {
                finalContent = lines.slice(0, 200).join("\n") +
                    "\n\n> WARNING: MEMORY.md is " + lines.length +
                    " lines (limit: 200). Only the first 200 lines were loaded...";
            }
        }

        // Step 6: Check if content was modified
        const wasModified = finalContent !== rawContent;

        return {
            path: filePath,
            type: fileType,
            content: finalContent,
            globs: paths,
            contentDiffersFromDisk: wasModified,
            rawContent: wasModified ? rawContent : undefined
        };
    } catch (error) {
        const errorCode = error.code;
        if (errorCode === "ENOENT" || errorCode === "EISDIR") return null;
        if (errorCode === "EACCES") {
            recordTelemetry("tengu_claude_md_permission_error", {
                is_access_error: 1,
                has_home_dir: filePath.includes(getHomeDir()) ? 1 : 0
            });
        }
    }
    return null;
}

// Mapping:
// xD1 → loadMemoryFileWithIncludeSupport
// $1 → getFileSystem
// pv9 → getFileExtension
// Uv9 → ALLOWED_TEXT_EXTENSIONS
// dv9 → extractFrontmatterPaths
// o14 → stripHtmlComments
// uj → 200
// k → logDebug
// d → recordTelemetry
// c8 → getHomeDir

---

## 3. Processing Pipeline

### 3.1 Pipeline Flow

```
Raw File Content
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Extension Check                                      │
│ - Check if file extension is in ALLOWED_TEXT_EXTENSIONS      │
│ - Skip binary files                                          │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Frontmatter Extraction (dv9)                         │
│ - Parse YAML frontmatter                                     │
│ - Extract `paths:` field for conditional loading             │
│ - Return content without frontmatter                         │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: HTML Comment Stripping (o14)                         │
│ - Parse markdown tokens                                      │
│ - Remove <!-- --> comments                                   │
│ - Preserve other HTML elements                                │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Truncation (if AutoMem/TeamMem)                      │
│ - Split into lines                                           │
│ - If > 200 lines, truncate and add warning                   │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
Final Content Object
```

---

## 4. Frontmatter Path Extraction (dv9)

### 4.1 Purpose

Memory files can include a `paths:` field in frontmatter to specify which directories the memory applies to:

```markdown
---
paths:
  - ./src/**
  - ./lib/**
---

# Memory for Source Code

This memory applies only to src/ and lib/ directories.
```

### 4.2 Implementation

// ============================================
// extractFrontmatterPaths - Extract paths from frontmatter
// Location: chunks.84.mjs:449-467
// ============================================

// ORIGINAL (for source lookup):
function dv9(A) {
    let { frontmatter: q, content: K } = BH(A);
    if (!q.paths) return { content: K };
    let Y = sz1(q.paths).map((z) => {
        return z.endsWith("/**") ? z.slice(0, -3) : z
    }).filter((z) => z.length > 0);
    if (Y.length === 0 || Y.every((z) => z === "**")) return { content: K };
    return { content: K, paths: Y }
}

// READABLE (for understanding):
function extractFrontmatterPaths(content) {
    const { frontmatter, content: bodyContent } = parseFrontmatter(content);

    if (!frontmatter.paths) {
        return { content: bodyContent };
    }

    // Process paths
    const processedPaths = ensureArray(frontmatter.paths)
        .map((path) => {
            // Strip /** suffix
            return path.endsWith("/**") ? path.slice(0, -3) : path;
        })
        .filter((path) => path.length > 0);

    // Handle catch-all patterns
    if (processedPaths.length === 0 || processedPaths.every((p) => p === "**")) {
        return { content: bodyContent };
    }

    return { content: bodyContent, paths: processedPaths };
}

// Mapping: dv9 → extractFrontmatterPaths, BH → parseFrontmatter, sz1 → ensureArray

### 4.3 Path Processing Rules

| Input Path | Processed Path | Notes |
|------------|----------------|-------|
| `./src/**` | `./src` | `/**` suffix stripped |
| `./lib` | `./lib` | No suffix to strip |
| `**` | (ignored) | Catch-all pattern |
| Empty string | (filtered out) | Empty paths removed |

---

## 5. HTML Comment Stripping (o14)

### 5.1 Purpose

HTML comments allow memory authors to leave private notes that won't be shown to the LLM:

```markdown
# Project Patterns

<!-- This is a private note for the author -->
<!-- TODO: Update this section -->

Actual content here...
```

### 5.2 Implementation

// ============================================
// stripHtmlComments - Remove HTML comments from markdown
// Location: chunks.84.mjs:469-493
// ============================================

// ORIGINAL (for source lookup):
function o14(A) {
    if (!A.includes("<!--")) return { content: A, stripped: !1 };
    let q = new tW().lex(A), K = "", Y = !1, z = /<!--[\s\S]*?-->/g;
    for (let _ of q) {
        if (_.type === "html") {
            let w = _.raw.trimStart();
            if (w.startsWith("<!--") && w.includes("-->")) {
                let O = _.raw.replace(z, "");
                if (Y = !0, O.trim().length > 0) K += O;
                continue
            }
        }
        K += _.raw
    }
    return { content: K, stripped: Y }
}

// READABLE (for understanding):
function stripHtmlComments(content) {
    // Quick check - no comments
    if (!content.includes("<!--")) {
        return { content: content, stripped: false };
    }

    // Parse markdown and process tokens
    const lexer = new MarkdownLexer();
    const tokens = lexer.lex(content);
    let result = "";
    let wasStripped = false;
    const commentPattern = /<!--[\s\S]*?-->/g;

    for (const token of tokens) {
        if (token.type === "html") {
            const trimmed = token.raw.trimStart();
            // Check if this is a comment block
            if (trimmed.startsWith("<!--") && trimmed.includes("-->")) {
                // Remove comments but keep any remaining content
                const withoutComments = token.raw.replace(commentPattern, "");
                wasStripped = true;
                if (withoutComments.trim().length > 0) {
                    result += withoutComments;
                }
                continue;
            }
        }
        // Keep non-comment tokens unchanged
        result += token.raw;
    }

    return { content: result, stripped: wasStripped };
}

// Mapping: o14 → stripHtmlComments, tW → MarkdownLexer

### 5.3 Edge Cases

| Scenario | Behavior |
|----------|----------|
| No comments | Returns original content, `stripped: false` |
| Comment only | Content removed, returns empty string |
| Mixed HTML | Non-comment HTML preserved |
| Nested comments | Not supported - standard regex behavior |

---

## 6. Return Object Structure

### 6.1 Full Return Object

```typescript
interface MemoryFileResult {
    path: string;           // File path
    type: string;           // "AutoMem" or "TeamMem"
    content: string;        // Processed content
    globs?: string[];       // Path patterns from frontmatter
    contentDiffersFromDisk: boolean;  // True if content was modified
    rawContent?: string;    // Original content if modified
}
```

### 6.2 Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Absolute file path |
| `type` | string | Memory type identifier |
| `content` | string | Final processed content |
| `globs` | string[] | Path patterns for conditional loading |
| `contentDiffersFromDisk` | boolean | True if truncation or stripping occurred |
| `rawContent` | string | Original unmodified content (only if modified) |

---

## 7. Error Handling

### 7.1 Error Codes

| Code | Meaning | Behavior |
|------|---------|----------|
| `ENOENT` | File not found | Return null (silent) |
| `EISDIR` | Path is a directory | Return null (silent) |
| `EACCES` | Permission denied | Log telemetry, return null |
| Other | Unknown error | Return null |

### 7.2 Telemetry on Permission Errors

```javascript
if (errorCode === "EACCES") {
    recordTelemetry("tengu_claude_md_permission_error", {
        is_access_error: 1,
        has_home_dir: filePath.includes(getHomeDir()) ? 1 : 0
    });
}
```

---

## 8. Usage Examples

### 8.1 Basic Memory Loading

```javascript
const result = loadMemoryFileWithIncludeSupport(
    "/path/to/memory/MEMORY.md",
    "AutoMem"
);

// result.content contains processed content
// result.globs contains path patterns (if any)
```

### 8.2 Memory with Paths

```markdown
<!-- memory.md -->
---
paths:
  - ./src/**
  - ./tests/**
---

# Development Notes

Test patterns and conventions...
```

```javascript
const result = loadMemoryFileWithIncludeSupport("./memory.md", "AutoMem");
// result.globs = ["./src", "./tests"]
// result.content = "# Development Notes\n\nTest patterns and conventions..."
```

### 8.3 Memory with Comments

```markdown
<!-- memory.md -->
# Project Conventions

<!-- Remember to update this when API changes -->
<!-- Last reviewed: 2024-01-15 -->

Use TypeScript for all new files.
```

```javascript
const result = loadMemoryFileWithIncludeSupport("./memory.md", "AutoMem");
// result.content = "# Project Conventions\n\nUse TypeScript for all new files."
// result.stripped = true
```

---

## 9. Comparison with buildMemoryPrompt

| Feature | buildMemoryPrompt (Q14) | xD1 |
|---------|-------------------------|-----|
| **File reading** | Direct readFileSync | ReadFileSync with extension check |
| **Frontmatter** | Not processed | Paths extracted |
| **Comment stripping** | No | Yes |
| **Return type** | String | Object with metadata |
| **Truncation** | Yes (200 lines) | Yes (AutoMem/TeamMem only) |
| **Use case** | Primary memory loading | @include references |

---

## Summary

The `xD1` function provides enhanced memory file loading with:

1. **Extension validation** - Skip non-text files
2. **Frontmatter path extraction** - Support conditional memory loading
3. **HTML comment stripping** - Remove private notes
4. **Automatic truncation** - 200-line limit with warning
5. **Rich metadata** - Return object with processing details
6. **Graceful error handling** - Silent failures with telemetry

**Key insight**: This function bridges the gap between simple file reading and the full @include system, providing memory-specific processing while maintaining compatibility with the broader CLAUDE.md loading infrastructure.