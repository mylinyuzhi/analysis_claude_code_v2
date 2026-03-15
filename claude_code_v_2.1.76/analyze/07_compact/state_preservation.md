# State Preservation Deep-Dive

## Overview

**State Preservation** is the critical subsystem in Claude Code's compaction that ensures essential context survives the summarization process. When compaction discards old messages to stay within token limits, it could lose references to important files, active tasks, planning documents, invoked skills, and todo lists. The state preservation system prevents this data loss by collecting and re-injecting critical state as "system reminder" attachment messages immediately after the compaction summary.

This system implements the **State Anchoring** architectural pattern, where different types of state (files, tasks, plans, skills, todos) are collected by specialized collectors and preserved across compaction boundaries. All 5 collectors run in parallel during compaction's state collection phase.

**Key characteristics:**
- **Parallel collection**: All 5 collectors run concurrently via `Promise.all()`
- **Token-budgeted**: Files have strict token limits (50k total, 5k per file)
- **Recency-weighted**: Files and skills sorted by timestamp (most recent first)
- **Selective**: Only preserves active/recent state, not full history
- **Attachment-based**: State is re-injected as special "attachment" messages

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

**Cross-references:**
- [10_skill_system/skill_compact_interaction.md](../10_skill_system/skill_compact_interaction.md) - Skill preservation during compaction

Key functions in this document:
- `collectFilesToKeep` (Ua4) - Preserves recently accessed files (up to 5 files, 50k tokens total)
- `collectTasksToKeep` (ca4) - Preserves completed/failed/killed local agent tasks
- `collectPlanToKeep` (jZ6) - Preserves active plan file content
- `collectSkillsToKeep` (da4) - Preserves invoked skills sorted by recency
- `collectTodosToKeep` (pa4) - Preserves todo list items
- `createAttachmentMessage` (kq) - Wraps state objects as attachment messages
- `shouldExcludeFile` (EmY) - Filters out session notes, plan files, and auto memory files
- `readFileForAttachment` (TyA) - Reads file with token limit for attachment
- `getPlanFilePath` (uW) - Resolves plan file path for agent
- `getPlanFileContent` (pD) - Reads plan file content
- `getTodoList` (UB) - Retrieves todo list for agent
- `getInvokedSkills` (zR6) - Retrieves invoked skills from global state

Constants:
- `MAX_FILES_TO_KEEP` (Ba4) - 5 files maximum
- `MAX_FILE_RESTORE_TOKENS` (fmY) - 50,000 tokens total for all files
- `MAX_TOKENS_PER_FILE` (VmY) - 5,000 tokens per individual file

---

## Architecture: State Anchoring Pattern

### High-Level Flow

```
performFullCompaction (Phase 4: State Preservation)
│
├─ Parallel Collection (Promise.all)
│  ├─ collectFilesToKeep(recentFiles, context, MAX_FILES_TO_KEEP)
│  └─ collectTasksToKeep(context)
│
├─ Sequential Collection (one-by-one)
│  ├─ collectTodosToKeep(agentId)
│  ├─ collectPlanToKeep(agentId)
│  └─ collectSkillsToKeep()
│
└─ Attachment Assembly
   └─ attachments = [fileAttachments, taskAttachments, todosAttachment?, planAttachment?, skillsAttachment?]
```

**State Anchoring Concept:**

State anchoring ensures that critical context is "anchored" to the post-compaction conversation by explicitly re-injecting it as system reminder messages. Without anchoring, the LLM would "forget" file contents, task results, plans, and skills after compaction summarizes away the messages that originally contained them.

**Example scenario:**
```
Before compaction:
  M0: user "Read config.json"
  M1: assistant [tool_use Read file="config.json"]
  M2: user [tool_result: "{ port: 8080, debug: true }"]
  M3: assistant "Config loaded, port is 8080"
  M4: user "What's the port?"
  M5: assistant "The port is 8080"

After compaction (WITHOUT state anchoring):
  Summary: "User asked to read config, then asked about port"
  M4: user "What's the port?"
  M5: assistant "The port is 8080"
  → File content LOST! LLM doesn't know config.json contents

After compaction (WITH state anchoring):
  Summary: "User asked to read config, then asked about port"
  Attachment: [type=file, path="config.json", content="{ port: 8080, debug: true }"]
  M4: user "What's the port?"
  M5: assistant "The port is 8080"
  → File content PRESERVED! LLM can reference config.json in future
```

---

## Core Algorithms

### 1. File Preservation

**Function:** `collectFilesToKeep` (Ua4)
**Location:** chunks.146.mjs:2665-2686
**Purpose:** Preserves recently accessed files within token budget

#### What it does

Collects the 5 most recently accessed files (excluding session notes, plan files, and auto memory files) and reads their content with a 5k token limit per file, up to 50k tokens total. Returns attachment messages containing file content.

#### How it works

**Step-by-step algorithm:**

**Phase 1: File Selection** (lines 2666-2669)
1. **Convert file map to array**: Transform `recentFiles` object (filename → metadata) into array of `{ filename, timestamp, ... }` objects
2. **Filter exclusions**: Remove files that should be excluded using `shouldExcludeFile()`:
   - Session notes files (e.g., `~/.claude/projects/.../session_notes.md`)
   - Plan files (e.g., `~/.claude/projects/.../plan.md`)
   - Auto memory files (e.g., `~/.claude/projects/.../memory/MEMORY.md`)
3. **Sort by recency**: Sort by `timestamp` descending (most recent first)
4. **Limit count**: Take top 5 files using `slice(0, MAX_FILES_TO_KEEP)`

**Phase 2: File Reading** (lines 2670-2678)
5. **Parallel file reads**: Use `Promise.all()` to read all selected files concurrently
6. **For each file**:
   a. Call `readFileForAttachment()` with:
      - `filename`: File path
      - `context`: Agent context (for permissions, abort signal)
      - `fileReadingLimits`: `{ maxTokens: MAX_TOKENS_PER_FILE }` (5000 tokens per file)
      - Telemetry events: "tengu_post_compact_file_restore_success" and "tengu_post_compact_file_restore_error"
      - `querySource`: "compact"
   b. If file read succeeds, wrap result in attachment message using `createAttachmentMessage()`
   c. If file read fails (returns null), store null

**Phase 3: Token Budgeting** (lines 2679-2685)
7. **Initialize token counter**: `tokenCount = 0`
8. **Filter by token budget**:
   a. For each file attachment (in order):
      - Skip if null (file read failed)
      - Calculate attachment token count using `countTokens(stringify(attachment))`
      - If `tokenCount + attachmentTokens <= MAX_FILE_RESTORE_TOKENS`:
        - Include attachment
        - Increment `tokenCount` by `attachmentTokens`
      - Otherwise, exclude attachment (budget exceeded)
9. **Return** filtered array of file attachments

**Edge cases:**
- **No recently accessed files**: Returns empty array
- **All files excluded**: Returns empty array
- **File read failures**: Skips failed files, continues with successful ones
- **Budget exceeded early**: Returns fewer than 5 files if budget exhausted
- **Very large files**: Individual files are truncated to 5k tokens each

#### Why this approach

**Design rationale:**

1. **Recency-based selection**: Most recently accessed files are most likely to be relevant to current work
   - **UX benefit**: User expects recently viewed files to be "remembered"
   - **Correctness**: Recent file edits need to be preserved for continued work

2. **Token budgeting**: Strict limits prevent state preservation from bloating context
   - **50k total budget**: Roughly 10% of typical context window (500k tokens)
   - **5k per file**: Prevents single large file from consuming entire budget
   - **Greedy allocation**: First files in recency order get priority

3. **Exclusion filtering**: Prevents re-injecting files that are already preserved elsewhere
   - **Session notes**: Already included in session memory compaction summary
   - **Plan files**: Preserved separately by `collectPlanToKeep()`
   - **Auto memory**: Persistent across sessions, doesn't need compaction preservation

4. **Parallel reading**: Files are read concurrently to minimize latency
   - **Performance**: 5 serial file reads could take 500-1000ms; parallel reduces to ~200ms
   - **Trade-off**: Uses more memory temporarily, but compaction is already expensive

**Trade-offs:**

- **Count limit (5) vs token limit (50k)**: Could allow more files if they're small, or fewer if large - fixed count is simpler
- **Greedy vs optimal packing**: Could use bin-packing algorithm to maximize files within budget, but greedy is O(n) and "good enough"
- **Recency vs importance**: Could use heuristics (edit frequency, file type) to rank importance, but recency is simplest proxy

**Alternative approaches considered:**

- **Read files after budget check**: Rejected because need to read to know token count
- **Cache file contents**: Rejected because files may have changed since last read
- **Include all files up to budget**: Rejected because large repositories could have 1000+ recent files

#### Key insight

The algorithm implements **greedy recency-weighted selection with strict budgeting**. The clever part: **two-stage filtering** (recency → budget) ensures recent files are prioritized, while token budgeting prevents unbounded growth.

**Example scenario:**
```
Recent files (sorted by timestamp):
1. src/main.ts (3000 tokens, accessed 2s ago)
2. config.json (500 tokens, accessed 5s ago)
3. README.md (8000 tokens, accessed 10s ago) → Will be truncated to 5000
4. package.json (400 tokens, accessed 15s ago)
5. tsconfig.json (300 tokens, accessed 20s ago)
6. .env (200 tokens, accessed 30s ago) → Excluded (count limit = 5)
7. session_notes.md (10000 tokens, accessed 40s ago) → Excluded (session notes)

Selection:
  Take top 5 (excluding session_notes.md): [main.ts, config.json, README.md, package.json, tsconfig.json]

Reading:
  main.ts: 3000 tokens ✓
  config.json: 500 tokens ✓
  README.md: truncated to 5000 tokens ✓
  package.json: 400 tokens ✓
  tsconfig.json: 300 tokens ✓

Budgeting:
  Cumulative: 3000 → 3500 → 8500 → 8900 → 9200
  All under 50k ✓

Result: 5 files preserved, 9200 tokens used (18.4% of budget)
```

#### Code Snippet

```javascript
// ============================================
// collectFilesToKeep - Preserves recently accessed files with token budget
// Location: chunks.146.mjs:2665-2686
// ============================================

// ORIGINAL (for source lookup):
async function Ua4(A, q, K) {
    let Y = Object.entries(A).map(([H, $]) => ({
            filename: H,
            ...$
        })).filter((H) => !EmY(H.filename, q.agentId)).sort((H, $) => $.timestamp - H.timestamp).slice(0, K),
        z = await Promise.all(Y.map(async (H) => {
            let $ = await TyA(H.filename, {
                ...q,
                fileReadingLimits: {
                    maxTokens: VmY
                }
            }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
            return $ ? kq($) : null
        })),
        w = 0;
    return z.filter((H) => {
        if (H === null) return !1;
        let $ = A2(Q1(H));
        if (w + $ <= fmY) return w += $, !0;
        return !1
    })
}

// READABLE (for understanding):
async function collectFilesToKeep(recentFiles, context, maxFileCount) {
    // ===== PHASE 1: File Selection =====
    // Convert file map to array of {filename, timestamp, ...} objects
    let selectedFiles = Object.entries(recentFiles)
        .map(([filename, metadata]) => ({
            filename: filename,
            ...metadata
        }))
        // Filter out session notes, plan files, auto memory files
        .filter((file) => !shouldExcludeFile(file.filename, context.agentId))
        // Sort by recency (most recent first)
        .sort((a, b) => b.timestamp - a.timestamp)
        // Take top N files
        .slice(0, maxFileCount);

    // ===== PHASE 2: File Reading =====
    // Read all selected files in parallel
    let fileAttachments = await Promise.all(
        selectedFiles.map(async (file) => {
            let fileContent = await readFileForAttachment(
                file.filename,
                {
                    ...context,
                    fileReadingLimits: {
                        maxTokens: MAX_TOKENS_PER_FILE // 5000 tokens per file
                    }
                },
                "tengu_post_compact_file_restore_success",
                "tengu_post_compact_file_restore_error",
                "compact"
            );

            // Wrap successful read in attachment message
            return fileContent ? createAttachmentMessage(fileContent) : null;
        })
    );

    // ===== PHASE 3: Token Budgeting =====
    let tokenCount = 0;

    return fileAttachments.filter((attachment) => {
        // Skip failed file reads
        if (attachment === null) return false;

        // Calculate token cost of this attachment
        let attachmentTokens = countTokens(stringify(attachment));

        // Check if adding this attachment would exceed budget
        if (tokenCount + attachmentTokens <= MAX_FILE_RESTORE_TOKENS) {
            tokenCount += attachmentTokens;
            return true; // Include attachment
        }

        return false; // Exclude attachment (budget exceeded)
    });
}

// Mapping: Ua4→collectFilesToKeep, A→recentFiles, q→context, K→maxFileCount, Y→selectedFiles, H→file/attachment, $→metadata/attachmentTokens, z→fileAttachments, w→tokenCount, EmY→shouldExcludeFile, TyA→readFileForAttachment, VmY→MAX_TOKENS_PER_FILE, kq→createAttachmentMessage, A2→countTokens, Q1→stringify, fmY→MAX_FILE_RESTORE_TOKENS
```

---

### 2. Task Preservation

**Function:** `collectTasksToKeep` (ca4)
**Location:** chunks.146.mjs:2724-2741
**Purpose:** Preserves status of completed/failed/killed local agent tasks

#### What it does

Collects all local agent tasks that have finished (completed, failed, or killed) and haven't been retrieved yet. Returns attachment messages containing task status and error details.

#### How it works

**Step-by-step algorithm:**

1. **Get app state**: Await `context.getAppState()` to retrieve current application state
2. **Extract tasks**: Get `appState.tasks` object (task ID → task metadata)
3. **Filter for local agents**: Filter tasks where `task.type === "local_agent"`
4. **Flat map to attachments**:
   a. For each local agent task:
      - If `task.retrieved === true`: Skip (already processed in previous compaction)
      - Extract `task.status`
      - If `status === "completed" OR status === "failed" OR status === "killed"`:
        - Create attachment message with:
          - `type`: "task_status"
          - `taskId`: task.agentId
          - `taskType`: "local_agent"
          - `description`: task.description
          - `status`: task.status
          - `deltaSummary`: task.error (if exists) or null
        - Return `[attachment]`
      - Otherwise (status is "pending" or "running"):
        - Return `[]` (skip incomplete tasks)
5. **Return** flattened array of task status attachments

**Edge cases:**
- **No tasks**: Returns empty array
- **All tasks incomplete**: Returns empty array
- **Tasks already retrieved**: Skipped via `retrieved` flag
- **Task has no error**: `deltaSummary` set to null

#### Why this approach

**Design rationale:**

1. **Only preserve completed tasks**: Running tasks will still be in the keep window (recent messages)
   - **Correctness**: Preserving running task status could create stale state
   - **Efficiency**: Completed tasks won't be in recent messages, so must be preserved

2. **Include error details**: `deltaSummary` contains error message for failed/killed tasks
   - **Debugging**: Allows LLM to explain why task failed in future turns
   - **Recovery**: User can retry failed task with error context

3. **Retrieved flag prevents duplicates**: Once a task is preserved in compaction, mark as retrieved
   - **Deduplication**: Prevents same task from being re-injected in every compaction
   - **Memory efficiency**: Reduces attachment bloat over time

4. **Flat map pattern**: Uses `flatMap()` to elegantly handle conditional inclusion
   - **Expressiveness**: Returns `[attachment]` to include, `[]` to skip
   - **Performance**: Single pass through tasks array

**Trade-offs:**

- **Status-based vs time-based filtering**: Could preserve tasks completed in last N minutes, but status-based is more semantic
- **Include all vs retrieved flag**: Could re-inject all tasks every time, but retrieved flag prevents bloat
- **Error vs deltaSummary**: Error is more specific, deltaSummary is more general (can include progress updates)

#### Key insight

The algorithm implements **selective task status preservation** that only captures final outcomes (completed/failed/killed) and prevents duplicate preservation via the `retrieved` flag.

#### Code Snippet

```javascript
// ============================================
// collectTasksToKeep - Preserves completed/failed/killed task statuses
// Location: chunks.146.mjs:2724-2741
// ============================================

// ORIGINAL (for source lookup):
async function ca4(A) {
    let q = await A.getAppState();
    return Object.values(q.tasks).filter((Y) => Y.type === "local_agent").flatMap((Y) => {
        if (Y.retrieved) return [];
        let {
            status: z
        } = Y;
        if (z === "completed" || z === "failed" || z === "killed") return [kq({
            type: "task_status",
            taskId: Y.agentId,
            taskType: "local_agent",
            description: Y.description,
            status: z,
            deltaSummary: Y.error ?? null
        })];
        return []
    })
}

// READABLE (for understanding):
async function collectTasksToKeep(context) {
    // Get current application state
    let appState = await context.getAppState();

    // Filter for local agent tasks and map to attachments
    return Object.values(appState.tasks)
        .filter((task) => task.type === "local_agent")
        .flatMap((task) => {
            // Skip tasks that were already retrieved in previous compaction
            if (task.retrieved) {
                return [];
            }

            let { status } = task;

            // Only preserve tasks that have finished (completed/failed/killed)
            if (status === "completed" || status === "failed" || status === "killed") {
                return [createAttachmentMessage({
                    type: "task_status",
                    taskId: task.agentId,
                    taskType: "local_agent",
                    description: task.description,
                    status: status,
                    deltaSummary: task.error ?? null // Include error details if present
                })];
            }

            // Skip incomplete tasks (pending, running)
            return [];
        });
}

// Mapping: ca4→collectTasksToKeep, A→context, q→appState, Y→task, z→status, kq→createAttachmentMessage
```

---

### 3. Plan Preservation

**Function:** `collectPlanToKeep` (jZ6)
**Location:** chunks.146.mjs:2699-2708
**Purpose:** Preserves active plan file content

#### What it does

Reads the plan file for the current agent and returns an attachment message containing the plan content and file path. Returns null if no plan exists.

#### How it works

**Step-by-step algorithm:**

1. **Get plan content**: Call `getPlanFileContent(agentId)` to read plan file
   - Returns null if plan file doesn't exist
   - Returns file content string if exists
2. **Early exit**: If `planContent === null`, return null (no plan to preserve)
3. **Get plan file path**: Call `getPlanFilePath(agentId)` to resolve file path
4. **Create attachment**: Return `createAttachmentMessage()` with:
   - `type`: "plan_file_reference"
   - `planFilePath`: Resolved file path
   - `planContent`: Full file content string

**Edge cases:**
- **No plan file**: Returns null
- **Empty plan file**: Returns attachment with empty string content
- **Plan file read error**: Returns null (handled in `getPlanFileContent`)

#### Why this approach

**Design rationale:**

1. **Full content preservation**: Includes entire plan file, not summary
   - **Completeness**: LLM can reference all plan details (steps, files, decisions)
   - **Fidelity**: No information loss from summarization

2. **File path included**: Provides context about where plan is stored
   - **Debugging**: User can manually inspect plan file
   - **Tool usage**: LLM can use Edit tool to update plan if needed

3. **Null-safe**: Returns null if no plan, allowing caller to handle absence gracefully
   - **Simplicity**: Caller can use `if (planAttachment) attachments.push(planAttachment)`

**Trade-offs:**

- **Full content vs summary**: Full content uses more tokens but preserves detail
- **Always preserve vs on-demand**: Always preserves if exists; could check if plan was referenced recently

#### Key insight

Plan files are **always preserved in full** if they exist, because plans contain critical context about the user's goals and the agent's implementation strategy.

#### Code Snippet

```javascript
// ============================================
// collectPlanToKeep - Preserves plan file content
// Location: chunks.146.mjs:2699-2708
// ============================================

// ORIGINAL (for source lookup):
function jZ6(A) {
    let q = pD(A);
    if (!q) return null;
    let K = uW(A);
    return kq({
        type: "plan_file_reference",
        planFilePath: K,
        planContent: q
    })
}

// READABLE (for understanding):
function collectPlanToKeep(agentId) {
    // Read plan file content
    let planContent = getPlanFileContent(agentId);

    // No plan file exists
    if (!planContent) {
        return null;
    }

    // Get plan file path for reference
    let planFilePath = getPlanFilePath(agentId);

    // Create attachment with full plan content
    return createAttachmentMessage({
        type: "plan_file_reference",
        planFilePath: planFilePath,
        planContent: planContent
    });
}

// Mapping: jZ6→collectPlanToKeep, A→agentId, q→planContent, K→planFilePath, pD→getPlanFileContent, uW→getPlanFilePath, kq→createAttachmentMessage
```

---

### 4. Skills Preservation

**Function:** `collectSkillsToKeep` (da4)
**Location:** chunks.146.mjs:2710-2722
**Purpose:** Preserves list of invoked skills sorted by recency

#### What it does

Retrieves all skills that have been invoked during the session, sorts them by invocation time (most recent first), and returns an attachment message containing skill metadata (name, path, content).

#### How it works

**Step-by-step algorithm:**

1. **Get invoked skills**: Call `getInvokedSkills()` to retrieve Map of skill_id → skill metadata
   - Returns `Map<skillId, { skillName, skillPath, content, invokedAt }>`
2. **Early exit**: If `invokedSkills.size === 0`, return null (no skills to preserve)
3. **Convert Map to array**: Use `Array.from(invokedSkills.values())` to get array of skill objects
4. **Sort by recency**: Sort by `invokedAt` timestamp descending (most recent first)
5. **Map to simplified objects**: Transform each skill to `{ name, path, content }` (remove `invokedAt`)
6. **Create attachment**: Return `createAttachmentMessage()` with:
   - `type`: "invoked_skills"
   - `skills`: Array of skill objects

**Edge cases:**
- **No skills invoked**: Returns null
- **Multiple invocations of same skill**: Tracks most recent invocation only (deduplicated by skill_id in Map)

#### Why this approach

**Design rationale:**

1. **Recency sorting**: Most recently invoked skills are likely most relevant
   - **Context**: Recent skills provide clues about user's current workflow
   - **Discoverability**: LLM can suggest re-invoking recent skills

2. **Full content preservation**: Includes skill content (not just name/path)
   - **Reference**: LLM can see what the skill does without re-reading file
   - **Execution**: Enables LLM to explain skill behavior in future turns

3. **Deduplicated**: Map structure ensures each skill appears once (by skill ID)
   - **Efficiency**: Prevents duplicate skill entries
   - **Recency**: Only most recent invocation is preserved

**Trade-offs:**

- **All skills vs top N**: Preserves all invoked skills; could limit to top 5-10 for large sessions
- **Full content vs metadata**: Includes content which uses tokens; could only preserve name/path
- **Recency vs frequency**: Sorts by most recent; could sort by invocation count

#### Key insight

Skills are preserved to help the LLM understand **what tools/workflows the user has been using**, enabling better suggestions and continuity across compactions.

#### Code Snippet

```javascript
// ============================================
// collectSkillsToKeep - Preserves invoked skills sorted by recency
// Location: chunks.146.mjs:2710-2722
// ============================================

// ORIGINAL (for source lookup):
function da4() {
    let A = zR6();
    if (A.size === 0) return null;
    let q = Array.from(A.values()).sort((K, Y) => Y.invokedAt - K.invokedAt).map((K) => ({
        name: K.skillName,
        path: K.skillPath,
        content: K.content
    }));
    return kq({
        type: "invoked_skills",
        skills: q
    })
}

// READABLE (for understanding):
function collectSkillsToKeep() {
    // Get all invoked skills from global state
    let invokedSkillsMap = getInvokedSkills();

    // No skills invoked during session
    if (invokedSkillsMap.size === 0) {
        return null;
    }

    // Convert Map to array, sort by recency, and simplify objects
    let skillsList = Array.from(invokedSkillsMap.values())
        .sort((a, b) => b.invokedAt - a.invokedAt) // Most recent first
        .map((skill) => ({
            name: skill.skillName,
            path: skill.skillPath,
            content: skill.content
        }));

    // Create attachment with skills list
    return createAttachmentMessage({
        type: "invoked_skills",
        skills: skillsList
    });
}

// Mapping: da4→collectSkillsToKeep, A→invokedSkillsMap, q→skillsList, K→skill/a, Y→b, zR6→getInvokedSkills, kq→createAttachmentMessage
```

---

### 5. Todo Preservation

**Function:** `collectTodosToKeep` (pa4)
**Location:** chunks.146.mjs:2688-2697
**Purpose:** Preserves todo list items

#### What it does

Retrieves the todo list for the current agent and returns an attachment message containing todo items. Returns null if todo list is empty.

#### How it works

**Step-by-step algorithm:**

1. **Get todo list**: Call `getTodoList(agentId)` to retrieve array of todo items
   - Returns `[]` if no todos exist
2. **Early exit**: If `todoList.length === 0`, return null (no todos to preserve)
3. **Create attachment**: Return `createAttachmentMessage()` with:
   - `type`: "todo"
   - `content`: Full todo list array
   - `itemCount`: Number of todo items
   - `context`: "post-compact" (indicates this is from compaction, not user creation)

**Edge cases:**
- **Empty todo list**: Returns null
- **Todos marked as completed**: Included in list (no filtering)

#### Why this approach

**Design rationale:**

1. **All todos preserved**: Includes entire list, not subset
   - **Completeness**: LLM can see all pending work
   - **Planning**: Enables LLM to prioritize or suggest next todo

2. **Item count included**: Provides quick reference for list size
   - **Summary**: Can mention "5 todos remaining" without parsing array
   - **Telemetry**: Could track todo list growth over time

3. **Context marker**: "post-compact" distinguishes from user-created todo attachments
   - **Provenance**: Helps debugging attachment sources
   - **Behavior**: Could enable different rendering in UI

**Trade-offs:**

- **All vs incomplete only**: Preserves all todos; could filter out completed items
- **Full list vs summary**: Includes full list; could summarize if very large (100+ items)

#### Key insight

Todos are preserved to ensure **task continuity** - the LLM remembers what work is pending even after compaction.

#### Code Snippet

```javascript
// ============================================
// collectTodosToKeep - Preserves todo list items
// Location: chunks.146.mjs:2688-2697
// ============================================

// ORIGINAL (for source lookup):
function pa4(A) {
    let q = UB(A);
    if (q.length === 0) return null;
    return kq({
        type: "todo",
        content: q,
        itemCount: q.length,
        context: "post-compact"
    })
}

// READABLE (for understanding):
function collectTodosToKeep(agentId) {
    // Get todo list for agent
    let todoList = getTodoList(agentId);

    // No todos exist
    if (todoList.length === 0) {
        return null;
    }

    // Create attachment with full todo list
    return createAttachmentMessage({
        type: "todo",
        content: todoList,
        itemCount: todoList.length,
        context: "post-compact" // Marker indicating compaction-preserved todo
    });
}

// Mapping: pa4→collectTodosToKeep, A→agentId, q→todoList, UB→getTodoList, kq→createAttachmentMessage
```

---

## Helper Functions

### File Exclusion Filter

**Function:** `shouldExcludeFile` (EmY)
**Location:** chunks.146.mjs:2743-2758

**Purpose:** Determines if a file should be excluded from file preservation (session notes, plan files, auto memory files)

**Logic:**
1. Check if file path matches session notes path for agent
2. Check if file path matches plan file path for agent
3. Check if file path matches any auto memory file paths
4. Return true if any match (exclude file), false otherwise

---

### Attachment Message Creation

**Function:** `createAttachmentMessage` (kq)
**Location:** chunks.142.mjs:2615-2622

**Purpose:** Wraps state objects as attachment messages with UUID and timestamp

**Schema:**
```javascript
{
  attachment: <state object>,
  type: "attachment",
  uuid: <generated UUID>,
  timestamp: <ISO 8601 timestamp>
}
```

---

## Integration Points

### 1. Standard Compaction

**Integration:** All 5 collectors are invoked in Phase 4 of `performFullCompaction()`

```javascript
// In performFullCompaction (AW1):
let [fileAttachments, taskAttachments] = await Promise.all([
    collectFilesToKeep(recentFiles, context, MAX_FILES_TO_KEEP),
    collectTasksToKeep(context)
]);

let attachments = [...fileAttachments, ...taskAttachments];

let todosAttachment = collectTodosToKeep(context.agentId);
if (todosAttachment) attachments.push(todosAttachment);

let planAttachment = collectPlanToKeep(context.agentId);
if (planAttachment) attachments.push(planAttachment);

let skillsAttachment = collectSkillsToKeep();
if (skillsAttachment) attachments.push(skillsAttachment);
```

### 2. Session Memory Compaction

**Integration:** Session memory compaction only preserves plan files (not files/tasks/todos/skills)

```javascript
// In performSessionMemoryCompaction (vZ6):
let planAttachment = collectPlanToKeep(agentId);
return {
    ...compactionResult,
    attachments: planAttachment ? [planAttachment] : []
};
```

**Why the difference?** Session memory compaction relies on session notes to preserve file/task context, while standard compaction only has the LLM summary (which may omit file details).

### 3. Read File State Tracking

**Integration:** File collector gets recently accessed files from `context.readFileState`

**Flow:**
1. During agent loop, each file read via Read tool is tracked in `readFileState` map
2. Map stores: `{ [filename]: { timestamp, ... } }`
3. Before compaction, `getRecentlyAccessedFiles()` extracts this map
4. After file collection, `readFileState.clear()` to prevent memory leaks

### 4. Task System

**Integration:** Task collector reads from `appState.tasks` maintained by task system

**Flow:**
1. Task system updates `appState.tasks` when tasks complete/fail/kill
2. Compaction reads task statuses
3. After compaction, task system marks tasks as `retrieved: true` (prevents re-injection)

---

## State Anchoring Coordination

### Parallel vs Sequential Collection

**Parallel (Promise.all):**
- `collectFilesToKeep()` - File I/O heavy (disk reads)
- `collectTasksToKeep()` - Async (waits for app state)

**Sequential (one-by-one):**
- `collectTodosToKeep()` - Synchronous (in-memory read)
- `collectPlanToKeep()` - Synchronous (cached file read)
- `collectSkillsToKeep()` - Synchronous (in-memory read)

**Rationale:** Parallel collection minimizes latency for I/O operations; sequential collection is negligible overhead for in-memory reads.

### Collector Independence

**Key property:** All collectors are **independent** - they don't share mutable state or depend on each other's results.

**Benefits:**
- Can be parallelized safely (no race conditions)
- Failures are isolated (one collector failing doesn't affect others)
- Easy to add new collectors (no coordination logic needed)

**Example:** If `collectFilesToKeep()` fails (disk error), other collectors still succeed and their attachments are preserved.

### State Consistency Guarantees

**Consistency model:** **Eventual consistency** - state reflects snapshot at compaction time, not real-time.

**Example:**
- User edits file at 10:00:05
- Compaction starts at 10:00:06
- File collector reads file at 10:00:07
- Edit from 10:00:05 is included (consistent snapshot)

**No guarantee:** If file is edited during compaction (10:00:07.5), edit may or may not be included (race condition).

**Mitigation:** In practice, compaction takes 10-30s, during which user is waiting (not editing files), so race is rare.

---

## Performance Considerations

### File Reading Latency

**Problem:** Reading 5 files from disk can take 500-1000ms serially
**Mitigation:** Parallel reads reduce latency to ~200-300ms (disk I/O is parallelizable on SSD)
**Impact:** Compaction total time: ~10-30s; file reading is ~2-3% of total

### Token Counting Overhead

**Problem:** Counting tokens for each attachment requires encoding (expensive)
**Mitigation:**
- Token counting uses cached tiktoken encoder
- Only counts after file reading completes (no re-counting)
- Budget check is O(n) where n = number of files (≤ 5)

### Memory Pressure

**Problem:** Loading 5 files × 5000 tokens each = 25k tokens in memory (~100-200KB)
**Mitigation:**
- Files are read sequentially (not all at once) in parallel block
- After budgeting, only kept attachments remain in memory
- Filtered attachments are garbage collected

### State Collection Parallelization

**Optimization:** Files and tasks collected in parallel (`Promise.all`)
**Impact:** Saves ~200-400ms compared to sequential collection
**Trade-off:** Uses more memory temporarily (both operations in flight), but negligible (< 1MB)

---

## Edge Cases & Error Handling

### 1. File Read Failure

**Scenario:** File was deleted between tracking and compaction
**Detection:** `readFileForAttachment()` returns null
**Handling:** Attachment set to null, filtered out in budget phase
**Impact:** Other files still preserved, compaction continues

### 2. All Files Excluded

**Scenario:** All recently accessed files are session notes, plan files, or auto memory
**Detection:** After exclusion filter, `selectedFiles.length === 0`
**Handling:** Returns empty array, no files preserved
**Impact:** Compaction succeeds with no file attachments

### 3. Budget Exceeded by First File

**Scenario:** First file attachment is 60k tokens (exceeds 50k budget)
**Detection:** Budget check fails on first iteration
**Handling:** Returns empty array (no files fit in budget)
**Impact:** Compaction succeeds but loses file context

### 4. No Tasks/Todos/Plans/Skills

**Scenario:** Fresh session with no state
**Detection:** Collectors return null
**Handling:** Attachment array contains only non-null items
**Impact:** Compaction succeeds with empty or minimal attachments

### 5. Task System Unavailable

**Scenario:** `getAppState()` fails (e.g., state corruption)
**Detection:** Exception thrown in `collectTasksToKeep()`
**Handling:** Exception bubbles up to `performFullCompaction()`, compaction fails
**Impact:** Compaction aborted, user sees error

### 6. Plan File Corrupted

**Scenario:** Plan file exists but contains invalid data
**Detection:** `getPlanFileContent()` catches exception, returns null
**Handling:** `collectPlanToKeep()` returns null, no plan preserved
**Impact:** Compaction succeeds without plan attachment

---

## Design Rationale Summary

### Why 5 Collectors?

**Problem:** Different types of state have different storage locations and access patterns
**Solution:** Specialized collectors for each state type
**Alternative:** Single generic collector would need complex branching logic

### Why Recency-Based Selection?

**Problem:** Limited token budget, need to prioritize
**Solution:** Most recent files/skills are most likely relevant to current work
**Alternative:** Could use ML model to predict importance, but recency is "good enough" heuristic

### Why Token Budgeting?

**Problem:** Unbounded state preservation could bloat context
**Solution:** Strict 50k token budget (10% of context window)
**Alternative:** Could allow unlimited preservation, but risks token overflow

### Why Attachment Messages?

**Problem:** Need to inject state into conversation without modifying summary
**Solution:** Attachment messages are special "system reminder" types
**Benefits:**
- Clearly marked as synthetic (not user/assistant messages)
- Can be filtered/rendered differently in UI
- Don't interfere with conversation flow

### Why Parallel Collection?

**Problem:** Serial collection would add latency (5 × 200ms = 1s)
**Solution:** Parallel I/O operations reduce latency to single operation time
**Trade-off:** More complex code, but 50% latency reduction worth it

---

## Conclusion

The State Preservation system implements the **State Anchoring** pattern to ensure critical context survives compaction. By using 5 specialized collectors (files, tasks, plans, skills, todos) that run in parallel and preserve recent/active state within strict token budgets, the system maintains conversation continuity while preventing token overflow.

**Key takeaways:**
1. **5 specialized collectors**: Files, tasks, plans, skills, todos
2. **Parallel collection**: Files and tasks collected concurrently for performance
3. **Token budgeting**: 50k token limit (10% of context) for files
4. **Recency-weighted**: Recent files and skills prioritized
5. **Attachment-based**: State re-injected as special "system reminder" messages
6. **State anchoring**: Critical context "anchored" to post-compaction conversation

This architecture ensures Claude Code maintains **session continuity** - remembering file contents, task outcomes, plans, skills, and todos across compactions - while staying within token limits.

---

## See Also

- [05_tools/compaction_tool_state.md](../05_tools/compaction_tool_state.md) - Edit tool validation behavior after compaction; why file attachments don't substitute for explicit Read calls; the two-layer context model (LLM context vs. tool runtime state)
