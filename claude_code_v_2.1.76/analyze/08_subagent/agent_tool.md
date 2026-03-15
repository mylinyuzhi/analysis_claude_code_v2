# Agent Tool - Subagent System (Claude Code 2.1.76)

## Overview

`AgentTool` (rj1) is the "Task" tool that the LLM invokes to spawn subagents. It bridges the LLM's tool-calling interface with the subagent spawning system.

**v2.1.76 changes:**
- `model` parameter added to AgentTool input schema for per-invocation model override

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `AgentTool` (rj1) - The Task tool object - chunks.132.mjs:85
- `oVY` - Base AgentTool input schema - chunks.132.mjs
- `aVY` - Teammate-mode additional schema fields - chunks.132.mjs
- `xu4` - Merged schema for both modes - chunks.132.mjs
- `pEA` - Permission filtering for subagent tools - chunks.132.mjs
- `cEA` - Context derivation for subagent - chunks.132.mjs
- `Iu4` - Teammate dispatch function - chunks.132.mjs
- `iVY` - In-process teammate runner binding - chunks.132.mjs
- `sP1` - loadTranscript for resume - chunks.149.mjs
- `wP6` - writeTranscriptEntry - chunks.149.mjs
- `mQ1` - finalizeTranscript - chunks.149.mjs
- `BQ1` - buildResumeMessages - chunks.149.mjs
- `zd7` - createAsyncTask - chunks.89.mjs:1447
- `p01` - runWithAgentIdentity - chunks.80.mjs:2353

---

## Input Schema

### Base Schema (oVY)

```typescript
interface AgentToolBaseInput {
    description: string;          // Task description for the subagent
    run_in_background?: boolean;  // Whether to run asynchronously
    model?: string;               // v2.1.76: per-invocation model override
}
```

### Teammate Schema (aVY)

Additional fields for teammate mode:

```typescript
interface AgentToolTeammateInput extends AgentToolBaseInput {
    name: string;        // Agent definition name
    team_name: string;   // Team the agent belongs to
}
```

### Merged Schema (xu4)

```javascript
// xu4 merges oVY and aVY into a union schema that handles both modes
const AgentToolInputSchema = z.union([
    baseAgentSchema,      // Standard subagent
    teammateSchema        // Teammate mode
]);
```

---

## Permission Filtering (pEA)

Before assembling the tool set for the subagent, permissions are filtered based on the parent's permission context and the agent definition's constraints.

**How it works:**
1. Get the parent's full tool permission context
2. Apply the agent definition's `disallowedTools` list to remove tools
3. Apply the agent definition's `tools` whitelist (if present) to restrict further
4. Return the filtered permission context for the subagent

---

## Context Derivation (cEA)

`cEA` derives the tool use context for the subagent by:
1. Cloning mutable state (readFileState, options)
2. Sharing immutable state (appState getter, setAppState)
3. Applying model override from per-invocation parameter (v2.1.76)
4. Setting up the subagent's abort controller

---

## Teammate Dispatch (Iu4)

For teammate mode (when `name` and `team_name` are provided):

```
Iu4() → spawnTeammateDispatcher()
    │
    ├── Non-interactive session → iVY() (inProcessAgentRunner binding)
    ├── iTerm2 available → iTerm2PaneBackend
    └── Fallback → TmuxBackend
```

---

## Resume Pipeline

When a task has a prior transcript (due to interruption or restart):

```
sP1(transcriptPath) → loadTranscript
    │
    └── Returns list of prior messages
         │
         └── BQ1(priorMessages) → buildResumeMessages
                 │
                 └── Prepend prior messages to new conversation
```

The resume pipeline ensures subagents can continue from where they left off without losing prior context.

---

## Output Schema

```typescript
interface AgentToolOutput {
    status: "completed" | "async_launched" | "failed";
    content?: string;          // Agent's final output (for completed)
    tokens?: TokenUsage;       // Token usage (for completed)
    agentId?: string;          // Agent ID (for async_launched)
    outputFile?: string;       // Output file path (for async_launched)
    outputFilePath?: string;   // v2.1.76: also in completion notification
    error?: string;            // Error message (for failed)
}
```

---

## Design Rationale

### Why Separate oVY and aVY Schemas?

Standard and teammate modes have different required fields. Using a union schema allows strict validation: standard mode doesn't need `name`/`team_name`, and teammate mode doesn't make sense without them. This prevents misuse and provides clear error messages.

### Why Per-Invocation model Override? (v2.1.76)

Different tasks within the same session may benefit from different models. A simple file search can use a faster, cheaper model, while complex reasoning benefits from a more capable one. Per-invocation override avoids needing separate sessions or agent definitions for each model variant.
