# Plan Mode - Compact Integration (Claude Code 2.1.38)

> Analysis of how plan mode state survives conversation compaction, ensuring planning context is preserved across context window management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `jZ6` (chunks.146.mjs:2699) - `collectPlanToKeep` - Plan preservation during compaction
- `pD` (chunks.88.mjs:126) - `getPlanFileContent` - Read plan file contents
- `uW` (chunks.88.mjs:120) - `getPlanFilePath` - Get plan file path
- `kq` (chunks.142.mjs:2615) - `createAttachmentMessage` - Create attachment wrapper

---

## 1. Overview: Plan Survival Through Compaction

When a conversation is compacted (due to context window limits), important state must be preserved. The plan file is one of the critical pieces of context that survives compaction.

```
┌─────────────────────────────────────────────────────────────────┐
│                 Plan Preservation During Compaction              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Compaction Trigger                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Token count exceeds threshold                               ││
│  │ → Auto-compact OR manual /compact command                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ State Collection Phase (performFullCompaction)              ││
│  │                                                             ││
│  │ 1. Ua4() - collect files to keep                           ││
│  │ 2. ca4() - collect tasks to keep                           ││
│  │ 3. pa4() - collect todos to keep                           ││
│  │ 4. jZ6() - collect plan to keep ← PLAN PRESERVATION        ││
│  │ 5. da4() - collect skills to keep                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Post-Compact State                                          ││
│  │                                                             ││
│  │ • Plan file survives as attachment                         ││
│  │ • type: "plan_file_reference"                              ││
│  │ • Contains: planFilePath, planContent                      ││
│  │ • LLM can reference the plan immediately                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Plan Collection Function (`jZ6`)

The `jZ6` function is called during compaction to preserve the plan file:

```javascript
// ============================================
// jZ6 - collectPlanToKeep
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
    // Step 1: Get plan file content
    let planContent = getPlanFileContent(agentId);
    if (!planContent) {
        // No plan exists, nothing to preserve
        return null;
    }

    // Step 2: Get plan file path
    let planFilePath = getPlanFilePath(agentId);

    // Step 3: Create attachment that will survive compaction
    return createAttachmentMessage({
        type: "plan_file_reference",
        planFilePath: planFilePath,
        planContent: planContent
    });
}

// Mapping: jZ6→collectPlanToKeep, A→agentId, q→planContent, K→planFilePath
//          pD→getPlanFileContent, uW→getPlanFilePath, kq→createAttachmentMessage
```

### Key Decision: Why Return an Attachment?

**What it does:** Returns an attachment message rather than the raw content.

**Why this approach:**
1. **Consistency**: All preserved state uses the same attachment mechanism
2. **Metadata**: Attachment includes type identifier for downstream processing
3. **UUID/timestamp**: Attachment gets unique identifier for tracking
4. **Separation**: Distinguishes preserved content from new messages

**Key insight:** The attachment wrapper allows the plan to be processed uniformly with other preserved artifacts (files, tasks, todos, skills).

---

## 3. Helper Functions

### `pD` - Get Plan File Content

```javascript
// ============================================
// pD - getPlanFileContent
// Location: chunks.88.mjs:126-134
// ============================================

// ORIGINAL (for source lookup):
function pD(A) {
    let q = uW(A);
    if (!b1().existsSync(q)) return null;
    try {
        return b1().readFileSync(q, {
            encoding: "utf-8"
        })
    } catch {
        return null
    }
}

// READABLE (for understanding):
function getPlanFileContent(agentId) {
    let planFilePath = getPlanFilePath(agentId);

    // Check if plan file exists
    if (!fs().existsSync(planFilePath)) {
        return null;
    }

    // Read and return content
    try {
        return fs().readFileSync(planFilePath, { encoding: "utf-8" });
    } catch {
        return null;
    }
}

// Mapping: pD→getPlanFileContent, A→agentId, q→planFilePath, b1→fs
```

### `uW` - Get Plan File Path

```javascript
// ============================================
// uW - getPlanFilePath
// Location: chunks.88.mjs:120-124
// ============================================

// ORIGINAL (for source lookup):
function uW(A) {
    let q = Rj1(U6());
    if (!A) return da(UM(), `${q}.md`);
    return da(UM(), `${q}-agent-${A}.md`)
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
    // Rj1: Get plan file slug from session ID
    // U6: Get current agent ID (for session context)
    let planFileSlug = getPlanFileSlug(getCurrentAgentId());

    if (!agentId) {
        // Main agent plan file
        return path.join(getSessionsDirectory(), `${planFileSlug}.md`);
    }

    // Subagent plan file (includes agent ID in filename)
    return path.join(getSessionsDirectory(), `${planFileSlug}-agent-${agentId}.md`);
}

// Mapping: uW→getPlanFilePath, A→agentId, q→planFileSlug
//          Rj1→getPlanFileSlug, U6→getCurrentAgentId, da→path.join, UM→getSessionsDirectory
```

### `kq` - Create Attachment Message

```javascript
// ============================================
// kq - createAttachmentMessage
// Location: chunks.142.mjs:2615-2621
// ============================================

// ORIGINAL (for source lookup):
function kq(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: FhY(),
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function createAttachmentMessage(attachmentData) {
    return {
        attachment: attachmentData,    // The actual attachment payload
        type: "attachment",            // Message type identifier
        uuid: generateUUID(),          // Unique identifier (FhY)
        timestamp: new Date().toISOString()  // Creation timestamp
    };
}

// Mapping: kq→createAttachmentMessage, A→attachmentData, FhY→generateUUID
```

---

## 4. Compaction Integration Point

Plan collection happens in `performFullCompaction` (`AW1`):

```javascript
// ============================================
// AW1 - performFullCompaction (excerpt)
// Location: chunks.146.mjs:2383-2390
// ============================================

// ORIGINAL (for source lookup):
let G = wjA(q.readFileState);
q.readFileState.clear(), rd();
let [f, Z] = await Promise.all([Ua4(G, q, Ba4), ca4(q)]), N = [...f, ...Z], T = pa4(q.agentId ?? U6());
if (T) N.push(T);
let k = jZ6(q.agentId);
if (k) N.push(k);
let y = da4();
if (y) N.push(y);

// READABLE (for understanding):
async function performFullCompaction(context) {
    // ... earlier compaction logic ...

    // Collect all state to preserve
    let preservedFiles = await collectFilesToKeep(fileState, context, MAX_FILES_TO_KEEP);
    let preservedTasks = await collectTasksToKeep(context);

    // Combine into attachments array
    let attachments = [...preservedFiles, ...preservedTasks];

    // Add todos if present
    let todoAttachment = collectTodosToKeep(context.agentId ?? getCurrentAgentId());
    if (todoAttachment) {
        attachments.push(todoAttachment);
    }

    // Add plan file if present ← PLAN PRESERVATION
    let planAttachment = collectPlanToKeep(context.agentId);
    if (planAttachment) {
        attachments.push(planAttachment);
    }

    // Add invoked skills if present
    let skillsAttachment = collectSkillsToKeep();
    if (skillsAttachment) {
        attachments.push(skillsAttachment);
    }

    // ... rest of compaction logic ...
}

// Mapping: AW1→performFullCompaction, G→preservedFiles, Z→preservedTasks
//          Ua4→collectFilesToKeep, ca4→collectTasksToKeep, pa4→collectTodosToKeep
//          jZ6→collectPlanToKeep, da4→collectSkillsToKeep
```

### State Collection Order

| Order | Function | Attachment Type | Purpose |
|-------|----------|-----------------|---------|
| 1 | `Ua4` | Various file types | Preserve read file content |
| 2 | `ca4` | `task_status` | Preserve background agent status |
| 3 | `pa4` | `todo` | Preserve todo list state |
| 4 | `jZ6` | `plan_file_reference` | Preserve plan file |
| 5 | `da4` | `invoked_skills` | Preserve loaded skill content |

**Key insight:** The plan is collected AFTER todos but BEFORE skills. This ordering reflects dependency: todos may be part of the plan, and skills may be referenced by the plan.

---

## 5. Plan File Reference Attachment Schema

```typescript
// TypeScript representation of the plan_file_reference attachment
interface PlanFileReferenceAttachment {
    type: "plan_file_reference";
    planFilePath: string;    // Absolute path to plan file
    planContent: string;     // Full content of plan file
}

// Full attachment message structure
interface AttachmentMessage {
    attachment: PlanFileReferenceAttachment;
    type: "attachment";
    uuid: string;            // Unique identifier
    timestamp: string;       // ISO timestamp
}
```

---

## 6. Plan Survival Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   Compaction Triggered                           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Check: Does plan file exist?                                    │
│                                                                 │
│ pD(agentId) → null?                                             │
│   YES → Skip plan preservation, return null                     │
│   NO → Continue                                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Get Plan Info:                                                  │
│                                                                 │
│ planContent = pD(agentId)  // Read file content                 │
│ planFilePath = uW(agentId) // Get file path                     │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Create Attachment:                                              │
│                                                                 │
│ kq({                                                           │
│     type: "plan_file_reference",                               │
│     planFilePath: "/path/to/.claude/sessions/xyz/plan.md",     │
│     planContent: "# Plan\n\n## Overview\n..."                  │
│ })                                                              │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Add to Post-Compact Attachments:                               │
│                                                                 │
│ attachments = [                                                │
│     ...files,                                                  │
│     ...tasks,                                                  │
│     todoAttachment,                                            │
│     planAttachment,  ← Added here                              │
│     skillsAttachment                                           │
│ ]                                                               │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ LLM Receives Compact Summary + Attachments                     │
│                                                                 │
│ • Plan content immediately available                           │
│ • LLM can reference plan without re-reading file               │
│ • Plan context preserved across context window reset           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Interaction with Plan Mode State

### State NOT Preserved by Compaction

| State Variable | Preserved? | Reason |
|----------------|------------|--------|
| `hasExitedPlanMode` | No | Session runtime state, not conversation context |
| `needsPlanModeExitAttachment` | No | Session runtime state |
| `mode` | Yes | Stored in `toolPermissionContext` in appState |
| `prePlanMode` | Yes | Stored in `toolPermissionContext` |

### State Preserved by Compaction

| Content | Mechanism | Preservation |
|---------|-----------|--------------|
| Plan file content | `jZ6()` attachment | Full content preserved |
| Plan file path | In attachment metadata | Path preserved |
| Active tasks | `ca4()` attachment | Task status preserved |
| Todo list | `pa4()` attachment | Todos preserved |

---

## 8. Edge Cases

### Edge Case 1: Plan File Too Large

If the plan file is extremely large, it is still preserved in full. There is no size limit on the plan attachment.

**Implication:** A very long plan could consume significant context window space after compaction.

### Edge Case 2: Multiple Plan Files (Subagents)

When `agentId` is provided (for subagents), a separate plan file is used:

```
Main agent:    .claude/sessions/<session-id>/plan.md
Subagent ABC:  .claude/sessions/<session-id>/plan-agent-ABC.md
```

Each agent's compaction preserves only its own plan file.

### Edge Case 3: Plan Deleted During Compaction

If the plan file is deleted between the compaction trigger and `jZ6()` call:

1. `pD()` returns `null` (file not found)
2. `jZ6()` returns `null`
3. No plan attachment is added
4. Plan context is lost

This is a rare race condition but possible with external file manipulation.

---

## 9. Comparison with Other Preserved State

| Artifact | Collection Function | Attachment Type | Size Limit |
|----------|---------------------|-----------------|------------|
| Read files | `Ua4()` | Various | 5 files, 50KB total |
| Tasks | `ca4()` | `task_status` | No limit (completed/failed/killed only) |
| Todos | `pa4()` | `todo` | No limit |
| **Plan** | `jZ6()` | `plan_file_reference` | **No limit** |
| Skills | `da4()` | `invoked_skills` | No limit |

**Key insight:** The plan file has no size limit because it is the primary planning artifact and should never be truncated.

---

## Summary: Plan Preservation During Compaction

| Aspect | Implementation |
|--------|----------------|
| **Trigger** | `performFullCompaction()` calls `jZ6()` |
| **Collection** | `jZ6()` reads plan via `pD()` and `uW()` |
| **Storage** | `plan_file_reference` attachment |
| **Content** | Full plan file content and path |
| **Limit** | No size limit |
| **Subagents** | Separate plan files per agent |