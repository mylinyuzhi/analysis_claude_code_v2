# Semantic Memory Search System

## Overview

The Semantic Memory Search system enables intelligent retrieval of relevant memory files using LLM-based semantic matching. Instead of simple keyword search, the system uses a fast language model to understand the context of the user's query and select the most relevant memory files.

**Key insight**: By using an LLM for memory selection, the system can understand semantic relationships between queries and memory content, going beyond simple text matching.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `searchMemoryFiles` (`a4q`) - Main search entry point (chunks.146.mjs:2773)
- `listAndRankMemoryFiles` (`AuY`) - File discovery and ranking (chunks.146.mjs:2784)
- `selectMemoriesWithLLM` (`quY`) - LLM-based selection (chunks.146.mjs:2821)
- `extractAgentReferences` (`wqq`) - Parse agent references (chunks.147.mjs:743)
- `getAgentMemoryPath` (`GW6`) - Agent memory path (chunks.90.mjs:860)
- `readFileWithLimit` (`h36`) - Limited file reading (chunks.89.mjs:684)
- `RELEVANT_MEMORIES_MAX_LINES` (`hE1`) - 200 (chunks.147.mjs:1164)

Key constants:
- `MAX_FILES_TO_CONSIDER` (`sxY`) - 200 (chunks.146.mjs:2870)
- `PREVIEW_LINES` (`txY`) - 30 (chunks.146.mjs:2872)
- `MEMORY_SELECTION_PROMPT` (`exY`) - LLM system prompt (chunks.146.mjs:2874)

---

## 1. Architecture Overview

### 1.1 Search Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SEMANTIC MEMORY SEARCH FLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Message                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ "How did we fix the authentication bug?"                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ getRelevantMemoriesTrigger (zqq)                             │  │
│  │ - Check feature flag: tengu_moth_copse                       │  │
│  │ - Extract last user message                                  │  │
│  │ - Validate message has multiple words                        │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ produceRelevantMemories (buY)                                │  │
│  │ - 5-second timeout                                           │  │
│  │ - Determine search directories                               │  │
│  │ - Call searchMemoryFiles for each directory                  │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ searchMemoryFiles (a4q)                                      │  │
│  │ 1. listAndRankMemoryFiles - Get all memory files             │  │
│  │ 2. selectMemoriesWithLLM - LLM semantic selection            │  │
│  │ 3. Return top candidates with mtime                          │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ LLM Selection (quY)                                          │  │
│  │ - Build file list with descriptions                          │  │
│  │ - Call fast model with structured output                     │  │
│  │ - Parse JSON response                                        │  │
│  │ - Return selected filenames                                  │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ File Reading & Staleness                                     │  │
│  │ - Read selected files (max 5)                                │  │
│  │ - Apply 200-line truncation                                  │  │
│  │ - Add staleness warnings                                     │  │
│  │ - Return relevant_memories attachment                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Main Entry Point: searchMemoryFiles (a4q)

### 2.1 Implementation

// ============================================
// searchMemoryFiles - Semantic memory file search
// Location: chunks.146.mjs:2773-2782
// ============================================

// ORIGINAL (for source lookup):
async function a4q(A, q, K, Y = []) {
    let z = await AuY(q, K);
    if (z.length === 0) return [];
    let _ = await quY(A, z, K, Y),
        w = new Map(z.map((O) => [O.filename, O]));
    return _.map((O) => w.get(O)).filter((O) => O !== void 0).map((O) => ({
        path: O.filePath,
        mtimeMs: O.mtimeMs
    }))
}

// READABLE (for understanding):
async function searchMemoryFiles(searchText, memoryDir, abortSignal, toolContext = []) {
    // Phase 1: List and rank all memory files
    const memoryFiles = await listAndRankMemoryFiles(memoryDir, abortSignal);
    if (memoryFiles.length === 0) return [];

    // Phase 2: LLM-based semantic selection
    const selectedFilenames = await selectMemoriesWithLLM(
        searchText,
        memoryFiles,
        abortSignal,
        toolContext
    );

    // Phase 3: Map back to file objects
    const fileMap = new Map(memoryFiles.map((f) => [f.filename, f]));

    return selectedFilenames
        .map((filename) => fileMap.get(filename))
        .filter((file) => file !== undefined)
        .map((file) => ({
            path: file.filePath,
            mtimeMs: file.mtimeMs
        }));
}

// Mapping:
// a4q → searchMemoryFiles
// AuY → listAndRankMemoryFiles
// quY → selectMemoriesWithLLM

**Parameters**:
- `searchText`: User's message text
- `memoryDir`: Memory directory path
- `abortSignal`: 5-second timeout signal
- `toolContext`: Recently used tool names (for context)

**Return value**: Array of `{ path: string, mtimeMs: number }` for selected files

---

## 3. File Discovery: listAndRankMemoryFiles (AuY)

### 3.1 Implementation

// ============================================
// listAndRankMemoryFiles - Discover and rank memory files
// Location: chunks.146.mjs:2784-2819
// ============================================

// ORIGINAL (for source lookup):
async function AuY(A, q) {
    try {
        let Y = (await nxY(A, {
                recursive: !0
            })).filter((O) => O.endsWith(".md") && axY(O) !== "MEMORY.md"),
            _ = (await Promise.allSettled(Y.map(async (O) => {
                let $ = oxY(A, O),
                    H = await rxY($);
                return {
                    relativePath: O,
                    filePath: $,
                    mtimeMs: H.mtimeMs
                }
            }))).filter((O) => O.status === "fulfilled").map((O) => O.value).sort((O, $) => $.mtimeMs - O.mtimeMs).slice(0, sxY);
        return (await Promise.allSettled(_.map(async ({
            relativePath: O,
            filePath: $,
            mtimeMs: H
        }) => {
            let {
                content: j
            } = await h36($, 0, txY, void 0, q), {
                frontmatter: J
            } = BH(j, $);
            return {
                filename: O,
                filePath: $,
                mtimeMs: H,
                description: J.description || null,
                type: S14(J.type)
            }
        }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function listAndRankMemoryFiles(memoryDir, abortSignal) {
    try {
        // Step 1: Recursively list all .md files
        const allFiles = await recursiveReaddir(memoryDir, { recursive: true });

        // Step 2: Filter to .md files, excluding MEMORY.md
        const mdFiles = allFiles.filter(
            (file) => file.endsWith(".md") && path.basename(file) !== "MEMORY.md"
        );

        // Step 3: Get file stats in parallel
        const fileStats = await Promise.allSettled(
            mdFiles.map(async (file) => {
                const fullPath = path.join(memoryDir, file);
                const stat = await fs.stat(fullPath);
                return {
                    relativePath: file,
                    filePath: fullPath,
                    mtimeMs: stat.mtimeMs
                };
            })
        );

        // Step 4: Sort by modification time (newest first) and limit
        const sortedFiles = fileStats
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value)
            .sort((a, b) => b.mtimeMs - a.mtimeMs)
            .slice(0, MAX_FILES_TO_CONSIDER);  // sxY constant

        // Step 5: Extract metadata from each file
        const filesWithMetadata = await Promise.allSettled(
            sortedFiles.map(async (file) => {
                // Read first N lines for frontmatter
                const { content } = await readFileWithLimit(
                    file.filePath, 0, PREVIEW_LINES, undefined, abortSignal
                );

                // Parse frontmatter
                const { frontmatter } = parseFrontmatter(content, file.filePath);

                return {
                    filename: file.relativePath,
                    filePath: file.filePath,
                    mtimeMs: file.mtimeMs,
                    description: frontmatter.description || null,
                    type: parseMemoryType(frontmatter.type)
                };
            })
        );

        return filesWithMetadata
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);
    } catch {
        return [];
    }
}

// Mapping:
// AuY → listAndRankMemoryFiles
// nxY → recursiveReaddir
// axY → path.basename
// oxY → path.join
// rxY → fs.stat
// h36 → readFileWithLimit
// BH → parseFrontmatter
// S14 → parseMemoryType
// txY → PREVIEW_LINES
// sxY → MAX_FILES_TO_CONSIDER

### 3.2 Algorithm Details

**Phase 1 - File Discovery:**
- Recursive scan of memory directory
- Include only `.md` files
- Exclude `MEMORY.md` (already loaded)

**Phase 2 - Sorting:**
- Sort by modification time (newest first)
- Limit to `sxY` files to prevent LLM overload

**Phase 3 - Metadata Extraction:**
- Read first `txY` lines of each file
- Parse frontmatter for `description` and `type`
- Store metadata for LLM selection

**Key Constants:**
- `sxY` - Maximum files to consider (prevents overload)
- `txY` - Lines to read for frontmatter preview

---

## 4. LLM Selection: selectMemoriesWithLLM (quY)

### 4.1 Implementation

// ============================================
// selectMemoriesWithLLM - Use LLM for semantic selection
// Location: chunks.146.mjs:2821-2868
// ============================================

// ORIGINAL (for source lookup):
async function quY(A, q, K, Y) {
    let z = new Set(q.map((O) => O.filename)),
        _ = q.map((O) => {
            let $ = O.type ? `[${O.type}] ` : "",
                H = new Date(O.mtimeMs).toISOString();
            return O.description ? `- ${$}${O.filename} (${H}): ${O.description}` : `- ${$}${O.filename} (${H})`
        }).join(`
`),
        w = Y.length > 0 ? `

Recently used tools: ${Y.join(", ")}` : "";
    try {
        let $ = (await _h({
            model: Ef(),
            system: exY,
            skipSystemPromptPrefix: !0,
            messages: [{
                role: "user",
                content: `Query: ${A}

Available memories:
${_}${w}`
            }],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        selected_memories: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    },
                    required: ["selected_memories"],
                    additionalProperties: !1
                }
            },
            signal: K
        })).content.find((j) => j.type === "text");
        if (!$ || $.type !== "text") return [];
        return i1($.text).selected_memories.filter((j) => z.has(j))
    } catch {
        return []
    }
}

// READABLE (for understanding):
async function selectMemoriesWithLLM(searchText, memoryFiles, abortSignal, toolContext) {
    // Build set of valid filenames for validation
    const validFilenames = new Set(memoryFiles.map((f) => f.filename));

    // Build file list with metadata
    const fileList = memoryFiles.map((file) => {
        const typePrefix = file.type ? `[${file.type}] ` : "";
        const timestamp = new Date(file.mtimeMs).toISOString();

        return file.description
            ? `- ${typePrefix}${file.filename} (${timestamp}): ${file.description}`
            : `- ${typePrefix}${file.filename} (${timestamp})`;
    }).join("\n");

    // Add tool context if available
    const toolContextNote = toolContext.length > 0
        ? `\n\nRecently used tools: ${toolContext.join(", ")}`
        : "";

    try {
        // Call fast model with structured output
        const response = await callLLM({
            model: getFastModel(),           // Ef() - likely Haiku
            system: MEMORY_SELECTION_PROMPT,  // exY constant
            skipSystemPromptPrefix: true,
            messages: [{
                role: "user",
                content: `Query: ${searchText}

Available memories:
${fileList}${toolContextNote}`
            }],
            max_tokens: 256,
            output_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        selected_memories: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["selected_memories"],
                    additionalProperties: false
                }
            },
            signal: abortSignal
        });

        // Extract text content
        const textContent = response.content.find((c) => c.type === "text");
        if (!textContent || textContent.type !== "text") return [];

        // Parse JSON and validate
        const parsed = parseJSON(textContent.text);
        return parsed.selected_memories.filter(
            (filename) => validFilenames.has(filename)
        );
    } catch {
        return [];
    }
}

// Mapping:
// quY → selectMemoriesWithLLM
// _h → callLLM
// Ef → getFastModel
// exY → MEMORY_SELECTION_PROMPT
// i1 → parseJSON

### 4.2 LLM Input Format

**System Prompt** (`exY`):
The system prompt instructs the LLM to select relevant memories based on semantic understanding.

**User Message Format**:
```
Query: How did we fix the authentication bug?

Available memories:
- [pattern] debugging.md (2024-01-15T10:30:00Z): Common debugging patterns
- [preference] user-style.md (2024-01-10T14:20:00Z): User's preferred coding style
- [insight] auth-fixes.md (2024-01-14T09:15:00Z): Authentication bug solutions

Recently used tools: Read, Grep, Edit
```

**LLM Response Format**:
```json
{
    "selected_memories": ["debugging.md", "auth-fixes.md"]
}
```

### 4.3 Design Decisions

**Why use LLM for selection?**
1. **Semantic understanding** - Understands context, not just keywords
2. **Cross-topic relevance** - Can identify related topics
3. **Tool context** - Uses recent tool usage as hint
4. **Description-aware** - Uses frontmatter descriptions effectively

**Why structured output?**
1. **Deterministic parsing** - JSON schema ensures valid response
2. **Validation** - Can verify filenames against actual files
3. **Efficiency** - Small token budget (256 tokens)

**Why fast model?**
1. **Latency** - Must complete within 5-second timeout
2. **Cost** - Called on every user message
3. **Adequate capability** - Selection task doesn't require Claude 4

---

## 5. Memory File Format for Search

### 5.1 Recommended Frontmatter

```markdown
---
name: debugging-patterns
description: Common debugging patterns and solutions for this project
type: pattern
---

# Debugging Patterns

Content here...
```

### 5.2 Frontmatter Fields Used

| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Identifier | `debugging-patterns` |
| `description` | LLM selection hint | `Common debugging patterns` |
| `type` | Category for context | `pattern`, `preference`, `insight` |

### 5.3 Description Best Practices

**Good descriptions:**
- "Authentication bug solutions and JWT handling"
- "User's preferred testing framework and coverage targets"
- "API rate limiting implementation and retry strategies"

**Poor descriptions:**
- "Notes" (too vague)
- "Debugging" (missing context)
- "Stuff about the project" (no actionable information)

---

## 6. Performance Characteristics

### 6.1 Timing Budget

| Operation | Timeout | Notes |
|-----------|---------|-------|
| Total search | 5 seconds | AbortSignal.timeout(5000) |
| File listing | ~100ms | Parallel stat calls |
| LLM call | ~1-2s | Fast model, 256 tokens |
| File reading | ~500ms | Parallel reads, max 5 files |

### 6.2 Limits

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Max memories returned | 5 | Prevents context bloat |
| Max files to consider | `sxY` | Prevents LLM overload |
| Preview lines | `txY` | Frontmatter extraction |
| Max lines per file | 200 | Truncation limit |

---

## 7. Integration with produceRelevantMemories

### 7.1 Call Chain

```
produceRelevantMemories (buY)
    │
    ├── extractAgentReferences (wqq)
    │   └── Parse @agent-X mentions
    │
    ├── Determine search directories
    │   ├── Agent directories (if agent mentioned)
    │   └── Default memory directory
    │
    ├── searchMemoryFiles (a4q)
    │   ├── listAndRankMemoryFiles (AuY)
    │   └── selectMemoriesWithLLM (quY)
    │
    ├── readFileWithLimit (h36)
    │   └── Read selected files with truncation
    │
    └── Build relevant_memories attachment
        └── { type: "relevant_memories", memories: [...] }
```

### 7.2 Deduplication

Files already in `readFileState` are filtered out:

```javascript
const uniqueResults = searchResults
    .filter((result) => !readFileState.has(result.path))
    .slice(0, 5);
```

This prevents showing content the agent has already read via the Read tool.

---

## 8. Error Handling

### 8.1 Graceful Degradation

All errors result in empty arrays:

```javascript
// File listing failed
catch { return []; }

// LLM call failed
catch { return []; }

// File read failed
catch { return null; }  // Individual file, continue with others
```

### 8.2 Timeout Handling

```javascript
const abortSignal = AbortSignal.timeout(5000);

// Pass to all async operations
await searchMemoryFiles(..., abortSignal, ...);
await readFileWithLimit(..., abortSignal);
```

If 5 seconds elapse, all pending operations are cancelled.

---

## 9. Deep Algorithm Analysis

### 9.1 LLM Selection Algorithm Deep-Dive

The `selectMemoriesWithLLM` (quY) function implements a sophisticated semantic matching algorithm:

**Step 1 - Build Filename Validation Set**:
```javascript
const validFilenames = new Set(memoryFiles.map((f) => f.filename));
```
This enables O(1) validation of LLM responses to prevent hallucinated filenames.

**Step 2 - Build File List with Metadata**:
```javascript
const fileList = memoryFiles.map((file) => {
    const typePrefix = file.type ? `[${file.type}] ` : "";
    const timestamp = new Date(file.mtimeMs).toISOString();

    return file.description
        ? `- ${typePrefix}${file.filename} (${timestamp}): ${file.description}`
        : `- ${typePrefix}${file.filename} (${timestamp})`;
}).join("\n");
```

**Format breakdown**:
- `[type]` - Memory type from frontmatter (pattern, preference, insight, etc.)
- `filename` - Relative path from memory directory
- `(timestamp)` - ISO 8601 format for last modification time
- `description` - Optional description from frontmatter

**Step 3 - Add Tool Context**:
```javascript
const toolContextNote = toolContext.length > 0
    ? `\n\nRecently used tools: ${toolContext.join(", ")}`
    : "";
```
Tool context provides hints about what the agent was doing, improving relevance matching.

**Step 4 - Call Fast Model with Structured Output**:
```javascript
const response = await callLLM({
    model: getFastModel(),           // Likely Haiku - fast, cheap
    system: MEMORY_SELECTION_PROMPT,  // exY constant
    skipSystemPromptPrefix: true,     // Use raw system prompt
    messages: [{
        role: "user",
        content: `Query: ${searchText}

Available memories:
${fileList}${toolContextNote}`
    }],
    max_tokens: 256,                  // Small budget for JSON response
    output_format: {
        type: "json_schema",
        schema: {
            type: "object",
            properties: {
                selected_memories: {
                    type: "array",
                    items: { type: "string" }
                }
            },
            required: ["selected_memories"],
            additionalProperties: false  // Strict validation
        }
    },
    signal: abortSignal               // 5-second timeout
});
```

**Key parameters**:
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `model` | `getFastModel()` | Balance speed vs. capability |
| `max_tokens` | 256 | JSON response is small |
| `skipSystemPromptPrefix` | true | Use raw prompt without prefixes |
| `additionalProperties` | false | Prevent extra fields in response |

**Step 5 - Parse and Validate Response**:
```javascript
const textContent = response.content.find((c) => c.type === "text");
if (!textContent || textContent.type !== "text") return [];

return parseJSON(textContent.text).selected_memories.filter(
    (filename) => validFilenames.has(filename)  // Validate against known files
);
```

**Validation ensures**:
1. Response contains text content
2. JSON parsing succeeds
3. Selected filenames actually exist in the file list

### 9.2 Constants

**Discovered from source**:

| Constant | Value | Location | Purpose |
|----------|-------|----------|---------|
| `sxY` | 200 | chunks.146.mjs:2870 | Maximum files to consider for LLM selection |
| `txY` | 30 | chunks.146.mjs:2872 | Lines to read for frontmatter preview |
| `hE1` | 200 | chunks.147.mjs:1164 | Max lines per relevant memory file |
| `exY` | (see below) | chunks.146.mjs:2874 | LLM system prompt for memory selection |

### 9.3 LLM Selection System Prompt (exY)

**Location**: chunks.146.mjs:2874

```javascript
// ============================================
// exY - System prompt for LLM memory selection
// Location: chunks.146.mjs:2874
// ============================================

// ORIGINAL (for source lookup):
exY = `You are selecting memories that will be useful to Claude Code as it processes a user's query. You will be given the user's query and a list of available memory files with their filenames and descriptions.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- If a list of recently-used tools is provided, do not select memories that are usage reference or API documentation for those tools (Claude Code is already exercising them). DO still select memories containing warnings, gotchas, or known issues about those tools — active use is exactly when those matter.
`
```

**Key instructions in the prompt**:
1. **Selectivity**: "Only include memories that you are certain will be helpful"
2. **Empty list allowed**: "If there are no memories...feel free to return an empty list"
3. **Tool context awareness**: Don't select API docs for already-used tools, but DO select warnings/gotchas
4. **Maximum 5**: The prompt explicitly limits to 5 memories

### 9.4 Error Handling Strategy

The algorithm implements graceful degradation at every step:

```javascript
try {
    const response = await callLLM(...);
    // ... process response
    return selectedFilenames.filter((f) => validFilenames.has(f));
} catch {
    return [];  // Silent failure - no memories selected
}
```

**Failure modes handled**:
1. **LLM API error** → Returns empty array
2. **Timeout exceeded** → AbortSignal triggers catch
3. **Invalid JSON** → parseJSON throws, caught
4. **No text content** → Returns empty array
5. **Invalid filenames** → Filtered out during validation

### 9.4 Performance Budget Analysis

| Operation | Typical Time | Worst Case |
|-----------|--------------|------------|
| Build file list | <5ms | 50 files × 0.1ms = 5ms |
| LLM API call | 500-1500ms | 2000ms (timeout at 5000ms) |
| Parse response | <1ms | 5ms |
| Validation | <1ms | O(n) where n = files |
| **Total** | **~1-2s** | **5s timeout** |

**Optimization insights**:
- LLM call dominates latency (~90% of time)
- Small max_tokens (256) reduces output generation time
- Fast model selection critical for sub-5s completion
- Parallel file reads happen in earlier phase (not shown here)

---

## Summary

The Semantic Memory Search system provides:

1. **LLM-based selection** - Understands query semantics
2. **Context-aware** - Uses tool context and descriptions
3. **Fast execution** - Optimized for sub-5-second completion
4. **Graceful degradation** - Silent failures, empty results
5. **Rich metadata** - Staleness timestamps, descriptions
6. **Agent support** - Searches agent-specific memory directories

**Key architectural insight**: By delegating memory selection to a fast LLM, the system can understand semantic relationships between user queries and memory content, providing more relevant results than keyword-based search while maintaining acceptable latency.

---

## 10. File Ranking Algorithm Deep-Dive (listAndRankMemoryFiles)

### 10.1 Algorithm Overview

The `listAndRankMemoryFiles` (AuY) function implements a two-phase file discovery and ranking algorithm:

```
Phase 1: Discovery & Sorting
    │
    ├── Recursive directory scan
    ├── Filter to .md files (exclude MEMORY.md)
    ├── Get file stats in parallel
    ├── Sort by modification time (newest first)
    └── Limit to sxY (200) files
    │
    ▼
Phase 2: Metadata Extraction
    │
    ├── Read first txY (30) lines of each file
    ├── Parse YAML frontmatter
    └── Extract description and type fields
```

### 10.2 Source Code Analysis

```javascript
// ============================================
// listAndRankMemoryFiles - File discovery and ranking
// Location: chunks.146.mjs:2784-2819
// ============================================

// ORIGINAL (for source lookup):
async function AuY(A, q) {
    try {
        let Y = (await nxY(A, {
                recursive: !0
            })).filter((O) => O.endsWith(".md") && axY(O) !== "MEMORY.md"),
            _ = (await Promise.allSettled(Y.map(async (O) => {
                let $ = oxY(A, O),
                    H = await rxY($);
                return {
                    relativePath: O,
                    filePath: $,
                    mtimeMs: H.mtimeMs
                }
            }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
              .sort((O, $) => $.mtimeMs - O.mtimeMs)
              .slice(0, sxY);
        return (await Promise.allSettled(_.map(async ({
            relativePath: O,
            filePath: $,
            mtimeMs: H
        }) => {
            let {
                content: j
            } = await h36($, 0, txY, void 0, q), {
                frontmatter: J
            } = BH(j, $);
            return {
                filename: O,
                filePath: $,
                mtimeMs: H,
                description: J.description || null,
                type: S14(J.type)
            }
        }))).filter((O) => O.status === "fulfilled").map((O) => O.value)
    } catch {
        return []
    }
}

// Mapping:
// AuY → listAndRankMemoryFiles
// nxY → recursiveReaddir
// axY → path.basename
// oxY → path.join
// rxY → fs.stat
// h36 → readFileWithLimit
// BH → parseFrontmatter
// S14 → parseMemoryType
// sxY → MAX_FILES_TO_CONSIDER (200)
// txY → PREVIEW_LINES (30)
```

### 10.3 Why Sort by Modification Time?

**Design Rationale**:
1. **Recency bias**: Recently modified files are more likely to be relevant
2. **Simple heuristic**: No need for complex relevance scoring at discovery phase
3. **Performance**: O(n log n) sort is fast for reasonable file counts

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| **mtime sorting** | Simple, fast, recent-first | Ignores content relevance |
| **Content indexing** | Semantic relevance | Slow, complex, storage overhead |
| **Access frequency** | Popularity-based | Requires tracking, privacy concerns |

**Why 200 file limit (sxY)**:
- Prevents LLM overload in selection phase
- Most projects have < 200 memory files
- Balances comprehensiveness vs performance

### 10.4 Frontmatter Metadata Extraction

**Purpose**: Extract structured metadata for LLM selection

```yaml
---
name: debugging-patterns
description: Common debugging patterns and solutions for this project
type: pattern
---

# Debugging Patterns
...
```

**Extracted fields**:
| Field | Usage in Selection | Example |
|-------|-------------------|---------|
| `description` | LLM sees in file list | "Common debugging patterns" |
| `type` | Category prefix in list | `[pattern] debugging.md` |
| `name` | Not used in selection | File title |

**Type categories** (parsed by S14):
- `pattern` - Reusable code patterns
- `preference` - User preferences
- `insight` - Project insights
- `reference` - Reference documentation
- Custom types allowed

### 10.5 Error Handling Patterns

```javascript
// Phase 1: Promise.allSettled for file stats
const results = await Promise.allSettled(
    files.map(async (file) => {
        const stat = await fs.stat(file);
        return { file, mtimeMs: stat.mtimeMs };
    })
);
// Filter to successful results
const valid = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

// Phase 2: Promise.allSettled for metadata
const withMetadata = await Promise.allSettled(
    valid.map(async (file) => {
        const content = await readFileWithLimit(file.filePath, 0, 30, ...);
        const { frontmatter } = parseFrontmatter(content);
        return { ...file, description: frontmatter.description };
    })
);
// Filter to successful results
return withMetadata
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
```

**Why Promise.allSettled**:
- Individual file failures don't break entire operation
- Permission errors, missing files, etc. are gracefully skipped
- Maximum resilience in production

### 10.6 Performance Characteristics

| Operation | Complexity | Parallelism |
|-----------|------------|-------------|
| Directory scan | O(n) | No |
| File stats | O(n) | Yes (Promise.all) |
| Sorting | O(n log n) | No |
| Frontmatter extraction | O(n) | Yes (Promise.all) |

**Typical timing** (100 memory files):
- Directory scan: ~10ms
- File stats: ~50ms (parallel)
- Sort: ~1ms
- Metadata extraction: ~100ms (parallel, 30 lines each)
- **Total**: ~160ms

This leaves ~4.8 seconds for LLM selection within the 5-second budget.

---

## 11. Agent Reference Extraction (wqq)

### 11.1 Purpose

The `extractAgentReferences` (`wqq`) function parses user messages to identify mentions of background agents. This determines which agent-specific memory directories to search.

**Why this matters**: When a user mentions `@agent-debugger`, the semantic search should look in that agent's memory directory, not just the main agent's memory.

### 11.2 Implementation

// ============================================
// extractAgentReferences - Parse agent mentions from text
// Location: chunks.147.mjs:743-752
// ============================================

// ORIGINAL (for source lookup):
function wqq(A) {
    let q = [],
        K = /(^|\s)@"([\w:.@-]+) \(agent\)"/g,
        Y;
    while ((Y = K.exec(A)) !== null)
        if (Y[2]) q.push(Y[2]);
    let z = /(^|\s)@(agent-[\w:.@-]+)/g,
        _ = A.match(z) || [];
    for (let w of _) q.push(w.slice(w.indexOf("@") + 1));
    return [...new Set(q)]
}

// READABLE (for understanding):
function extractAgentReferences(text) {
    const agentNames = [];

    // Pattern 1: Match @"agent-name (agent)" format
    // Example: @"debugger (agent)" → captures "debugger"
    const quotedPattern = /(^|\s)@"([\w:.@-]+) \(agent\)"/g;
    let match;
    while ((match = quotedPattern.exec(text)) !== null) {
        if (match[2]) agentNames.push(match[2]);
    }

    // Pattern 2: Match @agent-name format (must start with "agent-")
    // Example: @agent-debugger → captures "agent-debugger"
    const directPattern = /(^|\s)@(agent-[\w:.@-]+)/g;
    const directMatches = text.match(directPattern) || [];
    for (const m of directMatches) {
        agentNames.push(m.slice(m.indexOf("@") + 1));
    }

    // Deduplicate with Set
    return [...new Set(agentNames)];
}

// Mapping: wqq → extractAgentReferences, A → text, q → agentNames

### 11.3 Regex Pattern Analysis

**Pattern 1: `/(^|\s)@"([\w:.@-]+) \(agent\)"/g`**

| Component | Meaning |
|-----------|---------|
| `(^|\s)` | Match at start of string OR after whitespace |
| `@"` | Literal characters: at-sign + quote |
| `([\w:.@-]+)` | **Capture group 2**: Agent name (letters, digits, `:`, `.`, `@`, `-`) |
| ` \(agent\)"` | Literal: space + "(agent)" + closing quote |
| `/g` | Global flag: find all matches |

**Example matches**:
- `@"debugger (agent)"` → captures `debugger`
- ` @"code-reviewer (agent)"` → captures `code-reviewer`
- `@"agent-123 (agent)"` → captures `agent-123`

**Pattern 2: `/(^|\s)@(agent-[\w:.@-]+)/g`**

| Component | Meaning |
|-----------|---------|
| `(^|\s)` | Match at start of string OR after whitespace |
| `@` | Literal at-sign |
| `(agent-[\w:.@-]+)` | **Capture group 1**: Must start with "agent-" |
| `/g` | Global flag: find all matches |

**Example matches**:
- `@agent-debugger` → captures `agent-debugger`
- ` @agent-review` → captures `agent-review`
- `@agent-test-123` → captures `agent-test-123`

### 11.4 Deduplication Strategy

```javascript
return [...new Set(agentNames)];
```

**Why Set**:
- Prevents duplicate searches if user mentions same agent twice
- O(n) conversion from array to Set
- Spread operator converts back to array

**Example**:
```
Input: "Ask @agent-debugger and @agent-debugger again"
Before Set: ["agent-debugger", "agent-debugger"]
After Set: ["agent-debugger"]
```

### 11.5 Usage in Memory Search

```javascript
// From produceRelevantMemories (buY)
const agentRefs = extractAgentReferences(searchText);

// If agents mentioned, search their memory directories
const memoryDirs = agentRefs.length > 0
    ? getAgentMemoryDirs(agentRefs, activeAgents)  // Agent-specific paths
    : [getAutoMemoryDirectory()];                   // Default memory
```

### 11.6 Edge Cases

| Input | Output | Reason |
|-------|--------|--------|
| `@agent-` | `[]` | Empty name after "agent-" not matched |
| `@Debugger` | `[]` | Must start with "agent-" for direct pattern |
| `@"Debugger"` | `[]` | Missing "(agent)" suffix |
| `@"debugger (agent)"` | `["debugger"]` | Valid quoted pattern |
| `@agent-debugger @agent-debugger` | `["agent-debugger"]` | Deduplicated |
| `email@example.com` | `[]` | No preceding whitespace/start |

### 11.7 Performance Characteristics

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Pattern 1 exec | O(n) | n = text length |
| Pattern 2 match | O(n) | n = text length |
| Set construction | O(m) | m = number of matches |
| **Total** | **O(n)** | Linear in input length |

**Typical timing**: <1ms for most user messages