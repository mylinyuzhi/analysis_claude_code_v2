# Relevant Memories Attachment - Detailed Analysis

## Overview

The `relevant_memories` attachment type is a **NEW feature in v2.1.76** that automatically loads relevant memory files based on the user's current message. Unlike `nested_memory` which loads files from explicit triggers, `relevant_memories` uses semantic search to find memory files that might be relevant to the current conversation context.

**Key insight**: This attachment type bridges the gap between the 200-line MEMORY.md limit and the need for contextual memory retrieval, allowing the agent to access relevant topic files without explicit mentions.

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions:
- `produceRelevantMemories` (`buY`) - Main producer for relevant memories (chunks.147.mjs:552)
- `getRelevantMemoriesTrigger` (`zqq`) - Entry point trigger function (chunks.147.mjs:592)
- `buildStalenessWarning` (`Cz8`) - Staleness warning builder (chunks.50.mjs:2487)
- `formatRelativeTime` (`cJ7`) - Relative time formatter (chunks.50.mjs:2480)
- `isAutoMemoryEnabled` (`Z3`) - Feature check (chunks.50.mjs:2401)
- `getAutoMemoryDirectory` (`uH`) - Memory directory path (chunks.50.mjs:2468)

---

## 1. Architecture Overview

### 1.1 Integration with System Reminder Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│              RELEVANT MEMORIES ATTACHMENT FLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Message (Turn N)                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ "What was the debugging approach for the API issue?"         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ zqq (getRelevantMemoriesTrigger)                              │  │
│  │ - Check: isAutoMemoryEnabled()?                               │  │
│  │ - Check: tengu_moth_copse feature flag?                       │  │
│  │ - Extract last user message                                   │  │
│  │ - Parse for search terms                                      │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ buY (produceRelevantMemories)                                 │  │
│  │ - Timeout: 5 seconds                                          │  │
│  │ - Search memory directories                                   │  │
│  │ - Rank and filter results (max 5)                             │  │
│  │ - Read file contents with truncation                          │  │
│  │ - Attach staleness metadata                                   │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Attachment Type: relevant_memories                            │  │
│  │ {                                                             │  │
│  │   type: "relevant_memories",                                  │  │
│  │   memories: [                                                 │  │
│  │     { path: "...", content: "...", mtimeMs: 1234567890 },    │  │
│  │     ...                                                       │  │
│  │   ]                                                           │  │
│  │ }                                                             │  │
│  └───────────────┬──────────────────────────────────────────────┘  │
│                  │                                                  │
│                  ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Normalization (chunks.174.mjs:172-184)                        │  │
│  │ - For each memory:                                            │  │
│  │   - Check staleness (Cz8)                                     │  │
│  │   - Format header with timestamp                              │  │
│  │   - Wrap in system-reminder tags                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Producer Implementation

### 2.1 Entry Point Trigger

// ============================================
// getRelevantMemoriesTrigger - Entry point for relevant memories
// Location: chunks.147.mjs:592-601
// ============================================

// ORIGINAL (for source lookup):
function zqq(A, q) {
    if (!Z3() || !w8("tengu_moth_copse", !1)) return;
    let K = A.findLast((z) => z.type === "user" && !z.isMeta);
    if (!K) return;
    let Y = Fg(K);
    if (!Y || !/\s/.test(Y.trim())) return;
    return buY(Y, q.options.agentDefinitions.activeAgents, q.readFileState, uuY(A, K)).catch((z) => {
        return _6(z), []
    })
}

// READABLE (for understanding):
async function getRelevantMemoriesTrigger(messages, context) {
    // Prerequisite checks
    if (!isAutoMemoryEnabled()) return undefined;
    if (!getFeatureFlag("tengu_moth_copse", false)) return undefined;

    // Find last non-meta user message
    const lastUserMessage = messages.findLast(
        (msg) => msg.type === "user" && !msg.isMeta
    );
    if (!lastUserMessage) return undefined;

    // Extract text content
    const textContent = extractTextContent(lastUserMessage);
    if (!textContent || !/\s/.test(textContent.trim())) return undefined;

    // Produce relevant memories
    return produceRelevantMemories(
        textContent,
        context.options.agentDefinitions.activeAgents,
        context.readFileState,
        getRecentToolContext(messages, lastUserMessage)
    ).catch((error) => {
        logError(error);
        return [];
    });
}

// Mapping:
// zqq → getRelevantMemoriesTrigger
// Z3 → isAutoMemoryEnabled
// w8 → getFeatureFlag
// Fg → extractTextContent
// buY → produceRelevantMemories
// uuY → getRecentToolContext
// _6 → logError

**Prerequisites**:
1. Auto memory must be enabled (`Z3()` returns true)
2. Feature flag `tengu_moth_copse` must be set
3. Last user message must exist and contain whitespace (multi-word)

---

### 2.2 Main Producer Function

// ============================================
// produceRelevantMemories - Search and load relevant memory files
// Location: chunks.147.mjs:552-590
// ============================================

// ORIGINAL (for source lookup):
async function buY(A, q, K, Y) {
    let z = AbortSignal.timeout(5000),
        _ = wqq(A).flatMap((j) => {
            let J = j.replace("agent-", ""),
                M = q.find((D) => D.agentType === J);
            return M?.memory ? [GW6(J, M.memory)] : []
        }),
        w = _.length > 0 ? _ : [uH()],
        $ = (await Promise.all(w.map((j) => a4q(A, j, z, Y).catch(() => [])))).flat().filter((j) => !K.has(j.path)).slice(0, 5),
        H = (await Promise.all($.map(async ({
            path: j,
            mtimeMs: J
        }) => {
            try {
                let M = await h36(j, 0, hE1, void 0, z),
                    D = M.totalLines > hE1,
                    X = D ? M.content + `

> This memory file was truncated to the first ${hE1} lines. Use the ${s7} tool to view the complete file at: ${j}` : M.content;
                return K.set(j, {
                    content: X,
                    timestamp: Date.now(),
                    offset: void 0,
                    limit: D ? hE1 : void 0
                }), {
                    path: j,
                    content: X,
                    mtimeMs: J
                }
            } catch {
                return null
            }
        }))).filter((j) => j !== null);
    if (H.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: H
    }]
}

// READABLE (for understanding):
async function produceRelevantMemories(searchText, activeAgents, readFileState, toolContext) {
    // 5-second timeout for the entire operation
    const timeoutSignal = AbortSignal.timeout(5000);

    // Step 1: Determine memory directories to search
    // Extract agent types from search terms (e.g., @"architect (agent)" → "architect")
    // Note: wqq returns agent names directly (e.g., "architect"), not "agent-architect"
    const agentMemoryDirs = extractAgentReferences(searchText).flatMap((agentName) => {
        // The replace("agent-", "") is for backward compatibility but typically a no-op
        // since wqq already returns just the agent name
        const agentType = agentName.replace("agent-", "");
        const agent = activeAgents.find((a) => a.agentType === agentType);
        return agent?.memory ? [getAgentMemoryPath(agentType, agent.memory)] : [];
    });

    // Use agent directories if found, otherwise use default memory directory
    const searchDirs = agentMemoryDirs.length > 0
        ? agentMemoryDirs
        : [getAutoMemoryDirectory()];

    // Step 2: Search for relevant files (parallel, with timeout)
    const searchResults = (await Promise.all(
        searchDirs.map((dir) =>
            searchMemoryFiles(searchText, dir, timeoutSignal, toolContext)
                .catch(() => [])
        )
    )).flat();

    // Step 3: Filter out already-read files and limit to 5 results
    const uniqueResults = searchResults
        .filter((result) => !readFileState.has(result.path))
        .slice(0, 5);

    // Step 4: Read file contents (parallel, with truncation)
    const memories = (await Promise.all(
        uniqueResults.map(async ({ path, mtimeMs }) => {
            try {
                const fileContent = await readFileWithLimit(
                    path,
                    0,
                    MAX_LINES,
                    undefined,
                    timeoutSignal
                );

                const wasTruncated = fileContent.totalLines > MAX_LINES;
                const content = wasTruncated
                    ? fileContent.content + `\n\n> This memory file was truncated to the first ${MAX_LINES} lines. Use the ListTool to view the complete file at: ${path}`
                    : fileContent.content;

                // Update readFileState for deduplication
                readFileState.set(path, {
                    content: content,
                    timestamp: Date.now(),
                    offset: undefined,
                    limit: wasTruncated ? MAX_LINES : undefined
                });

                return { path, content, mtimeMs };
            } catch {
                return null;
            }
        })
    )).filter((result) => result !== null);

    // Step 5: Return attachment if memories found
    if (memories.length === 0) return [];
    return [{
        type: "relevant_memories",
        memories: memories
    }];
}

// Mapping:
// buY → produceRelevantMemories
// wqq → extractAgentReferences
// GW6 → getAgentMemoryPath
// uH → getAutoMemoryDirectory
// a4q → searchMemoryFiles
// h36 → readFileWithLimit
// hE1 → MAX_LINES (constant)
// s7 → ListTool (tool name)
// K → readFileState

**Key parameters**:
- `searchText`: The user's message text to search against
- `activeAgents`: List of active agent definitions (for agent-specific memory)
- `readFileState`: Map of already-read files (for deduplication)
- `toolContext`: Recent tool usage context (for relevance ranking)

**Timeout**: 5 seconds for the entire operation

**Limit**: Maximum 5 memory files returned

---

## 3. Normalization

### 3.1 Message Formatting

// ============================================
// normalizeAttachmentForAPI - relevant_memories case
// Location: chunks.174.mjs:172-184
// ============================================

// ORIGINAL (for source lookup):
case "relevant_memories":
    return b5(A.memories.map((K) => {
        let Y = Cz8(K.mtimeMs),
            z = Y ? `${Y}

Memory: ${K.path}:` : `Memory (saved ${cJ7(K.mtimeMs)}): ${K.path}:`;
        return p1({
            content: `${z}

${K.content}`,
            isMeta: !0
        })
    }));

// READABLE (for understanding):
case "relevant_memories":
    return wrapWithSystemReminderTags(
        attachment.memories.map((memory) => {
            // Check staleness
            const stalenessWarning = buildStalenessWarning(memory.mtimeMs);  // Cz8

            // Format header
            const header = stalenessWarning
                ? `${stalenessWarning}\n\nMemory: ${memory.path}:`
                : `Memory (saved ${formatRelativeTime(memory.mtimeMs)}): ${memory.path}:`;

            return createUserMessage({
                content: `${header}\n\n${memory.content}`,
                isMeta: true
            });
        })
    );

// Mapping:
// b5 → wrapWithSystemReminderTags
// Cz8 → buildStalenessWarning
// cJ7 → formatRelativeTime
// p1 → createUserMessage
// A → attachment
// K → memory

---

## 4. Output Format

### 4.1 Fresh Memory (< 1 day old)

```markdown
<system-reminder>
Memory (saved today): /path/to/debugging.md:

# Debugging Notes

- Always check logs first
- Use verbose mode for stack traces
...
</system-reminder>
```

### 4.2 Stale Memory (> 1 day old)

```markdown
<system-reminder>
This memory is 5 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.

Memory: /path/to/patterns.md:

# Project Patterns

- Use TypeScript for all new files
...
</system-reminder>
```

---

## 5. Feature Flag Control

### 5.1 `tengu_moth_copse` Flag

**Purpose**: Enable/disable the relevant memories feature

**Check location**: chunks.147.mjs:593

```javascript
if (!getFeatureFlag("tengu_moth_copse", false)) return undefined;
```

**Behavior when disabled**:
- No relevant memories attachment produced
- Agent must rely solely on MEMORY.md content
- Topic files only accessible via explicit Read tool

---

## 6. Integration with Other Systems

### 6.1 Deduplication with readFileState

The producer uses the `readFileState` Map to prevent showing the same file twice:

```javascript
// Filter out already-read files
const uniqueResults = searchResults
    .filter((result) => !readFileState.has(result.path))
    .slice(0, 5);
```

**Benefit**: Avoids redundant context if the agent has already read a file via the Read tool.

### 6.2 Staleness Detection Integration

Uses the same staleness functions as the main memory system:
- `Cz8` (buildStalenessWarning) - Generate warning for old memories
- `cJ7` (formatRelativeTime) - Format "today", "yesterday", "N days ago"

**Cross-reference**: See [memory_logic.md](./memory_logic.md) for staleness algorithm details.

### 6.3 Multi-Agent Memory Support

When agent references are found in the search text (e.g., "ask agent-architect"), the producer searches agent-specific memory directories:

```javascript
const agentMemoryDirs = extractAgentReferences(searchText).flatMap((ref) => {
    const agentType = ref.replace("agent-", "");
    const agent = activeAgents.find((a) => a.agentType === agentType);
    return agent?.memory ? [getAgentMemoryPath(agentType, agent.memory)] : [];
});
```

---

## 7. Performance Characteristics

### 7.1 Timing

| Operation | Timeout | Notes |
|-----------|---------|-------|
| Total operation | 5 seconds | AbortSignal.timeout(5000) |
| File read | Inherited | Uses same timeout signal |
| Search | Inherited | Parallel across directories |

### 7.2 Limits

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Max memories | 5 | Prevents context bloat |
| Max lines per file | `hE1` | Truncation limit |
| Timeout | 5s | Ensures fast response |

---

## 8. Error Handling

### 8.1 Graceful Degradation

```javascript
return produceRelevantMemories(...).catch((error) => {
    logError(error);
    return [];  // Return empty array on failure
});
```

**Behavior on error**:
- Silent failure - no user notification
- Empty attachment array returned
- Conversation continues normally

### 8.2 File Read Failures

```javascript
try {
    const fileContent = await readFileWithLimit(...);
    // ...
} catch {
    return null;  // Skip this file, continue with others
}
```

**Causes of read failures**:
- File deleted between search and read
- Permission changes
- I/O errors

---

## 9. Helper Functions Deep-Dive

### 9.1 extractAgentReferences (wqq)

**What it does**: Parses search text to find agent references in the format `@"agent-name (agent)"`.

**Location**: chunks.147.mjs:743 (VERIFIED against source code)

// ============================================
// extractAgentReferences - Parse agent references from text
// Location: chunks.147.mjs:743-752
// ============================================

// ORIGINAL (for source lookup):
function wqq(A) {
    let q = [], K = /(^|\s)@"([\w:.@-]+) \(agent\)"/g, Y;
    while ((Y = K.exec(A)) !== null)
        if (Y[2]) q.push(Y[2]);
    let z = /(^|\s)@(agent-[\w:.@-]+)/g,
        _ = A.match(z) || [];
    for (let w of _) q.push(w.slice(w.indexOf("@") + 1));
    return [...new Set(q)]
}

// READABLE (for understanding):
function extractAgentReferences(searchText) {
    const results = [];

    // Pattern 1: Matches @"agent-name (agent)" format
    // - (^|\s) - Start of string or whitespace
    // - @" - Literal @" prefix
    // - ([\w:.@-]+) - Capture group for agent name
    // -  \(agent\)" - Literal " (agent)" suffix
    const pattern1 = /(^|\s)@"([\w:.@-]+) \(agent\)"/g;

    let match;
    while ((match = pattern1.exec(searchText)) !== null) {
        if (match[2]) {
            results.push(match[2]);  // Just the agent name, without "agent-" prefix
        }
    }

    // Pattern 2: Matches @agent-name format
    // - (^|\s) - Start of string or whitespace
    // - @ - Literal @ prefix
    // - (agent-[\w:.@-]+) - Capture group for "agent-" prefixed names
    const pattern2 = /(^|\s)@(agent-[\w:.@-]+)/g;
    const matches2 = searchText.match(pattern2) || [];

    for (const m of matches2) {
        results.push(m.slice(m.indexOf("@") + 1));  // Extract name after @
    }

    // Return unique set of agent names
    return [...new Set(results)];
}

// Mapping: wqq → extractAgentReferences

**Pattern Explanation**:
The function uses TWO regex patterns:

**Pattern 1**: `/(^|\s)@"([\w:.@-]+) \(agent\)"/g`
Matches quoted format with " (agent)" suffix:
- `@"architect (agent)"` → extracts `"architect"`
- `@"debugger (agent)"` → extracts `"debugger"`

**Pattern 2**: `/(^|\s)@(agent-[\w:.@-]+)/g`
Matches simple @-mention format:
- `@agent-architect` → extracts `"agent-architect"`
- `@agent-debugger` → extracts `"agent-debugger"`

**Character classes allowed in agent names**:
- `\w` - Word characters (a-z, A-Z, 0-9, _)
- `:` - Colon
- `.` - Dot
- `@` - At sign
- `-` - Dash

**Return value**: Array of unique agent name strings (e.g., `["architect", "agent-debugger"]`)

**Note**: The function supports BOTH formats, extracting agent names from either quoted or simple @-mention syntax.

---

### 9.2 getAgentMemoryPath (GW6)

**What it does**: Builds the memory directory path for a specific agent type.

**Location**: chunks.90.mjs:860 (CORRECTED - was incorrectly documented as chunks.147.mjs:557)

// ============================================
// getAgentMemoryPath - Build agent-specific memory path
// Location: chunks.90.mjs:860
// ============================================

// ORIGINAL (for source lookup):
function GW6(A, q) {
    return q?.directory ? joinPath(q.directory, A, "memory") + pathSeparator : void 0
}

// READABLE (for understanding):
function getAgentMemoryPath(agentType, memoryConfig) {
    if (!memoryConfig?.directory) return undefined;
    return joinPath(memoryConfig.directory, agentType, "memory") + "/";
}

// Mapping: GW6 → getAgentMemoryPath

**Parameters**:
- `agentType`: String like "architect", "debugger"
- `memoryConfig`: Memory configuration from agent definition (must have `directory` field)

**Return value**: Full path to agent's memory directory, or undefined if no directory configured

---

### 9.3 searchMemoryFiles (a4q)

**What it does**: Searches memory directory for files matching the search text using LLM-based semantic selection.

**Location**: chunks.146.mjs:2773 (CORRECTED - was incorrectly documented as chunks.147.mjs:560)

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
    // Step 1: List and rank all memory files
    const memoryFiles = await listAndRankMemoryFiles(memoryDir, abortSignal);
    if (memoryFiles.length === 0) return [];

    // Step 2: Use LLM to select relevant files
    const selectedFilenames = await selectMemoriesWithLLM(
        searchText,
        memoryFiles,
        abortSignal,
        toolContext
    );

    // Step 3: Map back to file objects
    const fileMap = new Map(memoryFiles.map((f) => [f.filename, f]));
    return selectedFilenames
        .map((filename) => fileMap.get(filename))
        .filter((f) => f !== undefined)
        .map((f) => ({ path: f.filePath, mtimeMs: f.mtimeMs }));
}

// Mapping:
// a4q → searchMemoryFiles
// AuY → listAndRankMemoryFiles
// quY → selectMemoriesWithLLM

**Parameters**:
- `searchText`: User's message to match against
- `memoryDir`: Directory to search
- `abortSignal`: AbortSignal.timeout(5000) for cancellation
- `toolContext`: Recent tool usage for relevance ranking

**Return value**: Array of `{ path: string, mtimeMs: number }` for selected files

---

### 9.4 listAndRankMemoryFiles (AuY)

**What it does**: Lists all memory files in directory, extracts metadata, sorts by modification time.

**Location**: chunks.146.mjs:2784-2819

// ============================================
// listAndRankMemoryFiles - List memory files with metadata
// Location: chunks.146.mjs:2784-2819
// ============================================

// READABLE (for understanding):
async function listAndRankMemoryFiles(memoryDir, abortSignal) {
    try {
        // Step 1: List all .md files (excluding MEMORY.md)
        const files = await recursiveReaddir(memoryDir, { recursive: true });
        const mdFiles = files.filter(
            (f) => f.endsWith(".md") && path.basename(f) !== "MEMORY.md"
        );

        // Step 2: Get file stats and sort by mtime (newest first)
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

        const validFiles = fileStats
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value)
            .sort((a, b) => b.mtimeMs - a.mtimeMs)
            .slice(0, MAX_FILES_TO_CONSIDER);  // Limit to prevent LLM overload

        // Step 3: Extract frontmatter for each file
        const filesWithMetadata = await Promise.allSettled(
            validFiles.map(async (file) => {
                const { content } = await readFileWithLimit(
                    file.filePath, 0, PREVIEW_LINES, undefined, abortSignal
                );
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
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);
    } catch {
        return [];
    }
}

**Key algorithm details**:
1. **File discovery**: Recursive scan of memory directory
2. **Exclusion**: MEMORY.md is excluded (it's already loaded)
3. **Sorting**: By modification time (newest first)
4. **Limiting**: Capped at `sxY` constant (prevents LLM overload)
5. **Metadata extraction**: Parses frontmatter for description and type

---

### 9.5 selectMemoriesWithLLM (quY)

**What it does**: Uses an LLM to semantically select relevant memories from a list.

**Location**: chunks.146.mjs:2821-2868

// ============================================
// selectMemoriesWithLLM - LLM-based semantic memory selection
// Location: chunks.146.mjs:2821-2868
// ============================================

// READABLE (for understanding):
async function selectMemoriesWithLLM(searchText, memoryFiles, abortSignal, toolContext) {
    const filenameSet = new Set(memoryFiles.map((f) => f.filename));

    // Build file list with metadata
    const fileList = memoryFiles.map((f) => {
        const typePrefix = f.type ? `[${f.type}] ` : "";
        const timestamp = new Date(f.mtimeMs).toISOString();
        return f.description
            ? `- ${typePrefix}${f.filename} (${timestamp}): ${f.description}`
            : `- ${typePrefix}${f.filename} (${timestamp})`;
    }).join("\n");

    // Add tool context if available
    const toolContextNote = toolContext.length > 0
        ? `\n\nRecently used tools: ${toolContext.join(", ")}`
        : "";

    // Call LLM with structured output
    const response = await callLLM({
        model: getFastModel(),
        system: MEMORY_SELECTION_SYSTEM_PROMPT,  // exY constant
        skipSystemPromptPrefix: true,
        messages: [{
            role: "user",
            content: `Query: ${searchText}\n\nAvailable memories:\n${fileList}${toolContextNote}`
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

    // Parse response
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return [];

    return parseJSON(textContent.text).selected_memories.filter(
        (name) => filenameSet.has(name)
    );
}

**Key insight**: This uses a **fast model** (likely Haiku) to perform semantic matching. The model sees:
1. User's search query
2. List of available memory files with descriptions
3. Recently used tools for context

The model returns a JSON array of selected filenames, which are then validated against the actual file list.

**Performance optimization**: Uses `max_tokens: 256` since we only need a small JSON response.

---

### 9.6 readFileWithLimit (h36)

**What it does**: Reads a file with line limit and truncation support.

**Location**: chunks.89.mjs:684 (CORRECTED - was incorrectly documented as chunks.147.mjs:566)

**Signature**:
```javascript
async function readFileWithLimit(filePath, offset = 0, limit, encoding, abortSignal, options) {
    // Returns { content: string, totalLines: number }
}
```

**Parameters**:
- `filePath`: Full path to memory file
- `offset`: Starting line (usually 0)
- `limit`: Maximum lines to read (`hE1` constant = 200)
- `encoding`: Character encoding (usually undefined = utf-8)
- `abortSignal`: For timeout cancellation
- `options`: Optional additional options

**Return value**:
```javascript
{
    content: string,      // File content (truncated if needed)
    totalLines: number    // Actual total lines in file
}
```

**Used by**: `buY` (produceRelevantMemories) to read memory files with 5-second timeout.

---

### 9.5 RELEVANT_MEMORIES_MAX_LINES (hE1)

**What it does**: Constant defining max lines for relevant memories truncation.

**Location**: chunks.147.mjs:1164 (VERIFIED)

**Value**: 200 (same as `MEMORY_MAX_LINES`)

**Usage**:
```javascript
const fileContent = await readFileWithLimit(path, 0, hE1, undefined, timeoutSignal);
const wasTruncated = fileContent.totalLines > hE1;
```

---

## Summary

The `relevant_memories` attachment type provides:

1. **Semantic memory retrieval** - Automatically finds relevant topic files
2. **Staleness awareness** - Warns when memories may be outdated
3. **Deduplication** - Skips already-read files
4. **Multi-agent support** - Searches agent-specific memory directories
5. **Graceful degradation** - Silent failure on errors
6. **Performance limits** - 5 memories max, 5-second timeout

**Key architectural insight**: This feature extends the memory system beyond the 200-line MEMORY.md limit by automatically surfacing relevant topic files based on conversation context, enabling deeper knowledge retrieval without manual file selection.

---

## Related Documentation

- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration
- [memory_logic.md](./memory_logic.md) - Staleness detection algorithms
- [24_team_memory_system.md](./24_team_memory_system.md) - Team memory architecture
- [../04_system_reminder/types_skills_memory.md](../04_system_reminder/types_skills_memory.md) - System reminder types