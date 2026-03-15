# Plan Mode - Compact Integration (Claude Code 2.1.76)

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
    let planContent = getPlanFileContent(agentId);
    if (!planContent) return null;

    let planFilePath = getPlanFilePath(agentId);

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
        return b1().readFileSync(q, { encoding: "utf-8" })
    } catch { return null }
}

// READABLE (for understanding):
function getPlanFileContent(agentId) {
    let planFilePath = getPlanFilePath(agentId);
    if (!fs().existsSync(planFilePath)) return null;
    try {
        return fs().readFileSync(planFilePath, { encoding: "utf-8" });
    } catch { return null; }
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
    let planFileSlug = getPlanFileSlug(getCurrentAgentId());
    if (!agentId) return path.join(getSessionsDirectory(), `${planFileSlug}.md`);
    return path.join(getSessionsDirectory(), `${planFileSlug}-agent-${agentId}.md`);
}

// Mapping: uW→getPlanFilePath, A→agentId, q→planFileSlug
//          Rj1→getPlanFileSlug, U6→getCurrentAgentId, da→path.join, UM→getSessionsDirectory
```

---

## 4. Compaction Integration Point

Plan collection happens in `performFullCompaction` (`AW1`):

```javascript
// ============================================
// AW1 - performFullCompaction (excerpt)
// Location: chunks.146.mjs:2383-2390
// ============================================

// READABLE (for understanding):
async function performFullCompaction(context) {
    let preservedFiles = await collectFilesToKeep(fileState, context, MAX_FILES_TO_KEEP);
    let preservedTasks = await collectTasksToKeep(context);

    let attachments = [...preservedFiles, ...preservedTasks];

    let todoAttachment = collectTodosToKeep(context.agentId ?? getCurrentAgentId());
    if (todoAttachment) attachments.push(todoAttachment);

    let planAttachment = collectPlanToKeep(context.agentId);  // ← PLAN PRESERVATION
    if (planAttachment) attachments.push(planAttachment);

    let skillsAttachment = collectSkillsToKeep();
    if (skillsAttachment) attachments.push(skillsAttachment);

    // ... rest of compaction logic ...
}
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
interface PlanFileReferenceAttachment {
    type: "plan_file_reference";
    planFilePath: string;    // Absolute path to plan file
    planContent: string;     // Full content of plan file
}

interface AttachmentMessage {
    attachment: PlanFileReferenceAttachment;
    type: "attachment";
    uuid: string;            // Unique identifier
    timestamp: string;       // ISO timestamp
}
```

---

## 6. State NOT Preserved by Compaction

| State Variable | Preserved? | Reason |
|----------------|------------|--------|
| `hasExitedPlanMode` | No | Session runtime state, not conversation context |
| `needsPlanModeExitAttachment` | No | Session runtime state |
| `mode` | Yes | Stored in `toolPermissionContext` in appState |
| `prePlanMode` | Yes | Stored in `toolPermissionContext` |

---

## 7. Comparison with Other Preserved State

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
