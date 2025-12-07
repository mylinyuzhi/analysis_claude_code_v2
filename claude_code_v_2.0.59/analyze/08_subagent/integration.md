# Subagent System Integration

## Overview

This document covers how the subagent system integrates with other Claude Code features: compact (context summarization), plan mode, and TodoWrite.

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

Key findings:
- **Compact**: YES, subagents DO execute compact
- **Plan Mode**: BLOCKED for subagents (explicit check)
- **TodoWrite**: Agent-specific (in disallowedTools for some)

---

## Compact Integration

### Key Finding: Subagents DO Execute Compact

**Important**: Subagents run their own compact process independently.

```javascript
// ============================================
// autoCompactDispatcher - Auto-compact entry point (called by O$)
// Location: chunks.107.mjs:1708-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) {
  if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  let G = mH5(A),
    Z = SY2(G, Q),
    I = TH5();
  if (Z < I) return { wasCompacted: !1 };
  return await rH5(A, Q, B)
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, sessionMemoryType) {
  // Check if compact is disabled via env var
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Count tokens in current messages
  const tokenCount = countMessagesTokens(messages);
  const adjustedCount = applyContextMultiplier(tokenCount, sessionContext);
  const threshold = getCompactThreshold();

  // If under threshold, no compaction needed
  if (adjustedCount < threshold) {
    return { wasCompacted: false };
  }

  // Execute compaction - NO isSubAgent check here!
  // Both main agent and subagents can trigger compaction
  return await executeCompaction(messages, sessionContext, sessionMemoryType);
}

// Mapping: sI2→autoCompactDispatcher, A→messages, Q→sessionContext, B→sessionMemoryType,
//          Y0→parseBoolean, mH5→countMessagesTokens, SY2→applyContextMultiplier,
//          TH5→getCompactThreshold, rH5→executeCompaction
```

**Key Insight:** The `autoCompactDispatcher` function has NO special handling for subagents. It treats all contexts equally, meaning subagents will compact their own message history when threshold is exceeded.

**Evidence:**
1. O$ (mainAgentLoop) is called by XY1 (executeAgent)
2. O$ calls sI2 (autoCompactDispatcher)
3. sI2 has NO `isSubAgent` check to skip compaction
4. Subagents have their own `agentId` for compact tracking

### Compact Flow in Subagents

```
Subagent executes via XY1 (executeAgent)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ XY1 creates subagent context (BSA)                              │
│   - agentId: unique ID                                          │
│   - isSubAgent: true                                            │
│   - messages: own message array                                 │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ XY1 calls O$ (mainAgentLoop) with subagent context              │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ O$ checks token count during execution                          │
│   - If threshold exceeded, calls sI2 (autoCompactDispatcher)    │
│   - Subagent's messages are compacted                           │
│   - Summary generated for subagent's context                    │
└─────────────────────────────────────────────────────────────────┘
```

### Implications

| Aspect | Behavior |
|--------|----------|
| Token counting | Per-subagent (subagent has own messages) |
| Compact trigger | Same threshold as main agent |
| Summary generation | Independent - summarizes subagent's work |
| Session log | Subagent compact tracked under its agentId |

**Practical Impact:**
- Long-running subagents may compact their own context
- Subagent summaries are independent of main agent's summaries
- Compact boundaries appear in subagent transcript

---

## Plan Mode Integration

### Key Finding: EnterPlanMode is BLOCKED for Subagents

```javascript
// ============================================
// EnterPlanMode Block for Subagents
// Location: chunks.130.mjs:2372
// ============================================

// ORIGINAL:
async call(A, Q) {
  let B = e1();  // Get session ID
  if (Q.agentId !== B) throw Error("EnterPlanMode tool cannot be used in agent contexts");
  return { data: { message: "Entered plan mode..." } }
}

// READABLE:
async call(input, toolUseContext) {
  const mainSessionId = getSessionId();

  // EXPLICIT CHECK: Only main agent can enter plan mode
  if (toolUseContext.agentId !== mainSessionId) {
    throw new Error("EnterPlanMode tool cannot be used in agent contexts");
  }

  return {
    data: {
      message: "Entered plan mode. You should now focus on exploring the codebase..."
    }
  };
}
```

**Why Blocked:**
- Plan mode is a main conversation feature
- Subagent's job is to complete assigned task, not enter new modes
- Plan file is tied to main session, not subagent

### System Prompt Differences

Subagents use a different system prompt function for plan mode:

```javascript
// ============================================
// Main vs Subagent System Prompt for Plan Mode
// Location: chunks.153.mjs:2890-2977
// ============================================

// Main agent: Sb3 (generateMainAgentPlanMode)
// - Full plan mode instructions
// - ExitPlanMode tool guidance
// - Plan file path handling

// Subagent: _b3 (generateSubAgentPlanMode)
// - Simplified instructions
// - No ExitPlanMode tool (blocked in CTA)
// - Focus on task completion

// ORIGINAL for subagent:
function _b3(A) {
  return `## Plan Mode Instructions
You are operating in plan mode as a sub-agent...
${A}
`
}
```

### Plan Mode Tool Access

| Tool | Main Agent | Subagent |
|------|------------|----------|
| EnterPlanMode | ✅ Available | ❌ Blocked (CTA) + explicit check |
| ExitPlanMode | ✅ Available | ❌ Blocked (CTA) |
| Read | ✅ | ✅ |
| Glob | ✅ | ✅ |
| Other tools | ✅ | Per-agent restrictions |

---

## TodoWrite Integration

### Key Finding: Agent-Specific Access

TodoWrite is NOT in CTA (always blocked), but IS in some agents' `disallowedTools`:

```javascript
// ============================================
// TodoWrite Tool Access
// Location: chunks.125.mjs (agent definitions)
// ============================================

// CTA (ALWAYS_BLOCKED_TOOLS) - chunks.146.mjs:949
CTA = new Set([gq.name, A71, A6, pJ, DY1])
// Includes: ExitPlanMode, EnterPlanMode, Task, AskUserQuestion, KillShell
// Does NOT include: TodoWrite (BY.name)

// Explore agent - chunks.125.mjs:1407
disallowedTools: [QV, lD, kP, D9, BY]
// Includes: Write, Edit, NotebookEdit, Bash, TodoWrite

// Plan agent - chunks.125.mjs:1478
disallowedTools: [BY]
// Includes: TodoWrite
```

### TodoWrite Access Matrix

| Agent | TodoWrite Access | Reason |
|-------|-----------------|--------|
| general-purpose | ✅ Allowed | Full capabilities |
| Explore | ❌ Blocked | Read-only agent |
| Plan | ❌ Blocked | Focus on planning, not task tracking |
| statusline-setup | ❌ Blocked | Limited tools (Read, Edit only) |
| claude-code-guide | ❌ Blocked | Limited tools (Glob, Grep, Read, WebFetch, WebSearch) |

### Why Block TodoWrite for Some Agents?

1. **Explore Agent**: Read-only by design - shouldn't modify anything
2. **Plan Agent**: Task is to plan, not track todos
3. **Specialized Agents**: Focused tool sets for specific purposes

### What If Subagent Creates Todos?

For agents that CAN use TodoWrite (e.g., general-purpose):
- Todos are written to the session's todo file
- Same file as main agent uses
- Main agent can see subagent's todos
- Subagent should be careful not to duplicate main agent's tracking

**Best Practice:**
- Main agent should handle todo management
- Subagents should report findings, let main agent organize

---

## Feature Comparison Table

| Feature | Main Agent | Subagent |
|---------|------------|----------|
| **Compact** | ✅ Yes | ✅ Yes (independent) |
| **EnterPlanMode** | ✅ Available | ❌ Blocked (CTA + check) |
| **ExitPlanMode** | ✅ Available | ❌ Blocked (CTA) |
| **TodoWrite** | ✅ Available | Agent-specific |
| **Task (spawn subagent)** | ✅ Available | ❌ Blocked (CTA) |
| **AskUserQuestion** | ✅ Available | ❌ Blocked (CTA) |

---

## Integration Flow Diagram

```
Main Agent Context
    │
    │ (Task tool call)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Subagent Context Created (BSA)                                  │
│   - isSubAgent: true                                            │
│   - Own agentId                                                 │
│   - Tool restrictions applied                                   │
│   - No EnterPlanMode/ExitPlanMode                               │
│   - TodoWrite: per-agent                                        │
└─────────────────────────────────────────────────────────────────┘
    │
    │ (Subagent executes via O$)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ During Execution                                                │
│   - Compact: ✅ Runs if tokens exceed threshold                 │
│   - Plan tools: ❌ Blocked                                      │
│   - Other tools: Per-agent restrictions                         │
└─────────────────────────────────────────────────────────────────┘
    │
    │ (Subagent completes)
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Result Returned to Main Agent                                   │
│   - Final report only                                           │
│   - Compact summaries in subagent transcript                    │
│   - Todos (if created) in shared session file                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Code Snippets

### isSubAgent Flag Usage

```javascript
// ============================================
// isSubAgent Flag in Context
// Location: chunks.145.mjs:951
// ============================================

// In createSubAgentContext (BSA):
return {
  // ...
  isSubAgent: !0,  // true - marks this as subagent context
  // ...
}

// Used for:
// 1. Tool filtering (CTA, Qf2, Bf2 sets)
// 2. Permission handling (shouldAvoidPermissionPrompts: true)
// 3. UI callback disabling
```

### Session ID Check Pattern

```javascript
// ============================================
// Session ID Check for Plan Mode
// Location: chunks.130.mjs:2371-2372
// ============================================

// Main session ID comes from e1() function
let B = e1();  // Get main session ID

// Subagent context has different agentId
// Q.agentId !== B means this is a subagent
if (Q.agentId !== B) throw Error("EnterPlanMode tool cannot be used in agent contexts");
```

---

## Summary

### Compact
- ✅ **Subagents DO run compact**
- Independent tracking per agentId
- Same threshold and logic as main agent
- Compact summaries saved to subagent transcript

### Plan Mode
- ❌ **EnterPlanMode is BLOCKED** for subagents
- Explicit check: `agentId !== mainSessionId`
- Also blocked via CTA set
- Subagents use simplified plan mode system prompt

### TodoWrite
- **Agent-specific** - not universally blocked
- ❌ Blocked for: Explore, Plan, statusline-setup, claude-code-guide
- ✅ Allowed for: general-purpose
- Writes to shared session todo file

### Design Philosophy
- Subagents complete **specific tasks**, not manage sessions
- Plan mode is **main agent's responsibility**
- Todo management should be **main agent's job**
- Compact runs independently to manage **subagent's own context**
