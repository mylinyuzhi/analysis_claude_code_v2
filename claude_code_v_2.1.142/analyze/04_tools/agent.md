# Tool: Agent — Subagent Dispatch

> **Identity:** wire-name `Agent` (legacy alias `Task`), `isReadOnly: true`, `isConcurrencySafe: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:351204-351600` (declaration), `assets/tools/Agent.md` (tool def).
> **TypeScript baseline:** `src/tools/AgentTool/AgentTool.tsx` (v2.1.88).

This document covers the v2.1.142 Agent tool — how a fresh subagent is launched, the `isolation: "worktree"` path, `run_in_background` lifecycle, the `subagent_type` case- and separator-insensitive matching introduced in v2.1.140, and frontmatter `mcpServers`/`hooks` support (v2.1.117).

---

## Overview

The Agent tool dispatches a **subagent**: a fresh inner conversation with its own tool pool, its own permission context, and its own message history. Unlike skill execution (which runs in the parent's context), subagent dispatch isolates the work so its intermediate tool output does not bloat the parent's context window.

The Agent tool has four execution paths, gated by which parameters are set:

1. **Fork path** (`subagent_type` omitted, fork experiment on): the parent forks itself — inherits full conversation context but as a new agent with a shorter task.
2. **General-purpose path** (`subagent_type` omitted, fork experiment off): runs the `general-purpose` built-in agent with zero context.
3. **Named subagent path** (`subagent_type` set): runs a specific agent definition from `.claude/agents/` or `~/.claude/agents/` or a plugin.
4. **Teammate spawn path** (`team_name` + `name` set): spawns a tmux pane teammate via `spawnTeammate()`. Different lifecycle — not a child subagent but a peer.

The result schema is a discriminated union: `status: "completed"` (sync), `status: "async_launched"` (background), or — gated by USER_TYPE='ant' — `status: "remote_launched"` (CCR isolation).

---

## Input Schema (`XV6`)

The schema is composed in three layers via `lazySchema()`:

```javascript
// ============================================
// agentBaseInputSchema - Core agent parameters
// Location: cli_inner_pretty.js:351205-351221 (Cc_)
// ============================================

// ORIGINAL (for source lookup):
Cc_ = yH(() =>
  y.object({
    description: y.string().describe("A short (3-5 word) description of the task"),
    prompt: y.string().describe("The task for the agent to perform"),
    subagent_type: y.string().optional().describe("The type of specialized agent to use for this task"),
    model: y.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override for this agent. ..."),
    run_in_background: y.boolean().optional().describe("Set to true to run this agent in the background. ..."),
  }),
);

// READABLE (for understanding):
agentBaseInputSchema = lazy(() =>
  z.object({
    description: z.string().describe("A short (3-5 word) description of the task"),
    prompt: z.string().describe("The task for the agent to perform"),
    subagent_type: z.string().optional().describe("Specialized agent type"),
    model: z.enum(["sonnet", "opus", "haiku"]).optional().describe("Optional model override"),
    run_in_background: z.boolean().optional().describe("Run in background; notified on completion"),
  }),
);

// Mapping: Cc_→agentBaseInputSchema, yH→lazy, y→z
```

The full schema (`bc_`) extends with multi-agent params and isolation:

```javascript
// ============================================
// agentFullInputSchema - Full schema with multi-agent & isolation
// Location: cli_inner_pretty.js:351222-351249 (bc_)
// ============================================

// ORIGINAL (for source lookup):
bc_ = yH(() => {
  let H = y.object({
    name: y.string().optional().describe("Name for the spawned agent. ..."),
    team_name: y.string().optional().describe("Team name for spawning. ..."),
    mode: cMq().optional().describe("Permission mode for spawned teammate ..."),
  });
  return Cc_().merge(H).extend({
    isolation: y.enum(["worktree"]).optional().describe('Isolation mode. "worktree" creates a temporary git worktree ...'),
    cwd: y.string().optional().describe('Absolute path to run the agent in. ... Mutually exclusive with isolation: "worktree".'),
  });
});

// READABLE (for understanding):
agentFullInputSchema = lazy(() => {
  const multiAgentParams = z.object({
    name: z.string().optional().describe("Name for the spawned agent (addressable via SendMessage)"),
    team_name: z.string().optional().describe("Team name for spawning"),
    mode: permissionModeSchema().optional().describe("Permission mode for spawned teammate"),
  });
  return agentBaseInputSchema().merge(multiAgentParams).extend({
    isolation: z.enum(["worktree"]).optional().describe("Isolation mode (worktree)"),
    cwd: z.string().optional().describe("Absolute path override; mutex with isolation"),
  });
});

// Mapping: bc_→agentFullInputSchema, Cc_→agentBaseInputSchema
```

The exported `XV6` schema strips `cwd` for non-KAIROS builds and strips `run_in_background` when the background-tasks env var is set or the fork experiment is active:

```javascript
// ============================================
// agentExportedInputSchema - Gate-pruned schema visible to the model
// Location: cli_inner_pretty.js:351250-351253 (XV6)
// ============================================

// ORIGINAL (for source lookup):
XV6 = yH(() => {
  let H = bc_().omit({ cwd: !0 });
  return ZnH || W0() ? H.omit({ run_in_background: !0 }) : H;
});

// READABLE (for understanding):
agentExportedInputSchema = lazy(() => {
  const schema = agentFullInputSchema().omit({ cwd: true });
  // Strip run_in_background when disabled by env or when fork experiment is on
  return isBackgroundTasksDisabled || isForkSubagentEnabled()
    ? schema.omit({ run_in_background: true })
    : schema;
});

// Mapping: XV6→agentExportedInputSchema, ZnH→isBackgroundTasksDisabled, W0→isForkSubagentEnabled
```

### Why three layers?

The split is for **dead code elimination** and for the v2.1.140 multi-agent ant-internal split:

- `Cc_` (base): cross-platform fields every Claude Code install supports.
- `bc_` (full): adds `name`/`team_name`/`mode` (ant-only) and `isolation`/`cwd` (gate-controlled). Defined eagerly so the type system can name them.
- `XV6` (exported): runs at first-tool-listing time, omits hidden fields based on env vars and feature gates. The model never sees fields that would no-op.

The `omit().omit()` pattern (rather than conditional spread inside `.extend()`) is required because Zod's type inference collapses unions to `unknown` when fields are conditionally added — see the upstream comment in `AgentTool.tsx:105-110`.

---

## subagent_type Resolution

The `subagent_type` parameter selects which agent definition runs. The matching algorithm has three phases:

```javascript
// ============================================
// resolveSubagentType - Locate agent definition by type with fuzzy fallback
// Location: cli_inner_pretty.js:351357-351413 (in Agent.call)
// ============================================

// ORIGINAL (for source lookup):
let G = $ ?? (W0() ? void 0 : at.agentType),  // G = effectiveType
  V = G === void 0,                            // V = isForkPath
  v;                                            // v = selectedAgent
if (V) {
  if (M.options.querySource === `agent:builtin:${vI.agentType}` || zf6(M.messages))
    throw Error("Fork is not available inside a forked worker. ...");
  v = vI;                                       // FORK_AGENT
} else {
  let o = M.options.agentDefinitions.activeAgents,
    { allowedAgentTypes: $H } = M.options.agentDefinitions,
    zH = GnH($H ? o.filter((YH) => $H.includes(YH.agentType)) : o, L.toolPermissionContext, D7),
    _H = zH.find((YH) => YH.agentType === G);   // Exact match
  if (!_H) {
    let YH = Zu7(G),                            // Normalize "Code Reviewer" → "codereviewer"
      DH = Y5H(YH, 60),
      OH = zH.map((vH) => vH.agentType),
      GH = new Set(OH),
      TH = YH ? o.filter((vH) => Zu7(vH.agentType) === YH) : [];
    if (TH.length > 1) {
      throw Error(`Agent type '${G}' is ambiguous — matches ...`);
    }
    if (TH.length === 1) {
      let vH = TH[0];
      if (GH.has(vH.agentType)) {
        _H = vH;
        d("tengu_subagent_type_normalized", { requestedNormalized: DH, matched: _H.agentType });
      }
    }
    if (!_H) throw Error(`Agent type '${G}' not found. ...`);
  }
  v = _H;
}

// READABLE (for understanding):
let effectiveType = subagent_type ?? (isForkSubagentEnabled() ? undefined : GENERAL_PURPOSE_AGENT.agentType);
const isForkPath = effectiveType === undefined;
let selectedAgent;

if (isForkPath) {
  // Recursive-fork guard: forking inside a fork would loop forever
  if (
    toolUseContext.options.querySource === `agent:builtin:${FORK_AGENT.agentType}` ||
    isInForkChild(toolUseContext.messages)
  ) {
    throw new Error("Fork is not available inside a forked worker.");
  }
  selectedAgent = FORK_AGENT;
} else {
  const allAgents = toolUseContext.options.agentDefinitions.activeAgents;
  const { allowedAgentTypes } = toolUseContext.options.agentDefinitions;
  const permittedAgents = filterDeniedAgents(
    allowedAgentTypes ? allAgents.filter(a => allowedAgentTypes.includes(a.agentType)) : allAgents,
    permissionContext,
    AGENT_TOOL_NAME,
  );

  // Phase 1: Exact match
  let agent = permittedAgents.find(a => a.agentType === effectiveType);

  if (!agent) {
    // Phase 2: NFKC-normalized fuzzy match (v2.1.140)
    //   "Code Reviewer" / "code_reviewer" / "Code-Reviewer" all → "codereviewer"
    const normalizedRequest = normalizeAgentType(effectiveType);
    const candidates = normalizedRequest
      ? allAgents.filter(a => normalizeAgentType(a.agentType) === normalizedRequest)
      : [];
    if (candidates.length > 1) {
      throw new Error(`Agent type '${effectiveType}' is ambiguous — matches ${...}`);
    }
    if (candidates.length === 1 && permittedAgentNames.has(candidates[0].agentType)) {
      agent = candidates[0];
      logEvent("tengu_subagent_type_normalized", { requestedNormalized: ..., matched: agent.agentType });
    }
    if (!agent) throw new Error(`Agent type '${effectiveType}' not found.`);
  }
  selectedAgent = agent;
}

// Mapping: Zu7→normalizeAgentType, GnH→filterDeniedAgents, vI→FORK_AGENT, at→GENERAL_PURPOSE_AGENT,
//          W0→isForkSubagentEnabled, zf6→isInForkChild, GH→permittedAgentNames
```

### The Zu7 Normalizer (v2.1.140 addition)

```javascript
// ============================================
// normalizeAgentType - Case- and separator-insensitive normalization
// Location: cli_inner_pretty.js:351139-351143 (Zu7)
// ============================================

// ORIGINAL (for source lookup):
function Zu7(H) {
  return H.normalize("NFKC")
    .toLowerCase()
    .replace(/[\p{White_Space}\p{Pd}_]+/gu, "");
}

// READABLE (for understanding):
function normalizeAgentType(typeStr) {
  return typeStr
    .normalize("NFKC")                                  // Unicode compatibility composition
    .toLowerCase()                                       // case-insensitive
    .replace(/[\p{White_Space}\p{Pd}_]+/gu, "");        // strip spaces, dashes, underscores
}

// Mapping: Zu7→normalizeAgentType
```

**Why this design (v2.1.140 changelog: "case- and separator-insensitive"):**

The pre-v2.1.140 code did exact-string `===` matching only. If the user typed `"Code Reviewer"` but the agent definition was `"code-reviewer"`, the call would error out with "agent type not found". This was a recurring user error since:
- Agent file names use kebab-case (Unix convention).
- Human-readable descriptions (in docs, in agent definition `description` fields) use Title Case.
- The model frequently echoed back the Title Case form it saw in prompts.

The fix lowercases and strips separators on both sides, so all these resolve to the same normalized key `"codereviewer"`:
- `"code-reviewer"` (canonical)
- `"Code Reviewer"` (Title Case)
- `"code_reviewer"` (snake_case)
- `"Code-Reviewer"` (mixed)

**Key insight:** The normalizer uses `\p{Pd}` (Unicode dash class) rather than just `-`, so en-dash (`–`) and em-dash (`—`) also normalize. NFKC normalizes full-width characters too — useful for non-ASCII input methods.

**Ambiguity handling:** If multiple definitions normalize to the same key (e.g., the user has both `code-reviewer` and `CodeReviewer`), the tool errors with the ambiguous list rather than silently picking one. This is a hard floor — there's no "deterministic tiebreaker" fallback.

---

## Agent Frontmatter Fields (v2.1.117)

Agent definitions are markdown files with YAML frontmatter. The v2.1.117 release added `mcpServers` and `hooks` fields to the schema:

```yaml
---
description: A specialized agent for code review tasks.
model: sonnet
tools: [Read, Grep, Glob, Bash(git diff:*)]
disallowedTools: [Edit, Write]
mcpServers:
  - slack          # Reference existing server by name
  - calendar:
      type: stdio
      command: /path/to/calendar-mcp
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks: [{ type: command, command: ./check-cmd.sh }]
permissionMode: plan
maxTurns: 50
skills: [my-skill]
memory: project
background: true
isolation: worktree
---
```

The schema is in `loadAgentsDir.ts:74-99` (TypeScript baseline). The `mcpServers` field supports both reference-by-name (`"slack"`) and inline definition (`{ "calendar": { type, command, ... } }`).

**Why MCP servers per-agent:** A subagent often needs a different MCP server set than its parent. For example, a `release-manager` agent needs the GitHub MCP, but a `code-reviewer` agent only needs filesystem access. Without per-agent MCP control, the parent would spawn all required servers up front and the subagent would have to ignore irrelevant tools — bloating context for no reason.

**Why hooks per-agent:** A `verification` agent might want PreToolUse hooks that run linters on every file edit it makes, but the parent doesn't want those hooks slowing down its normal workflow. Per-agent hooks let each agent install its own automation.

**Required MCP servers (`requiredMcpServers`):** A separate field that gates whether the agent can be invoked at all. If any required server is still in `pending` state at invocation time, the tool waits up to 30 seconds (polling every 500ms) for it to connect. If still missing after the deadline, throws `subagent_mcp_required_missing`.

---

## isolation: "worktree" — Filesystem Isolation

When `isolation: "worktree"` is set, the Agent tool wraps the subagent in a temporary git worktree. The integration is:

```javascript
// ============================================
// agentWorktreeIsolation - Wraps subagent in a temp git worktree
// Location: cli_inner_pretty.js:351479 (B = f ?? v.isolation)
// ============================================

// ORIGINAL (for source lookup):
let B = f ?? v.isolation,
  ...
  if (B === "worktree") {
    let q9 = await uw6(...);  // createAgentWorktree
    // ... runs the agent with process.chdir to the worktree path ...
    // On completion: if hasWorktreeChanges → preserve, else → removeAgentWorktree
  }

// READABLE (for understanding):
const isolation = isolationParam ?? selectedAgent.isolation;
// ...
if (isolation === "worktree") {
  const worktreeInfo = await createAgentWorktree({
    sessionId: ...,
    agentId: ...,
    branchPrefix: selectedAgent.agentType,
  });
  // Switch cwd to worktree, run agent, restore cwd
  // If agent left changes (files or commits): preserve worktree and report path/branch
  // If agent made no changes: remove worktree silently
}

// Mapping: B→isolation, uw6→createAgentWorktree
```

**Why the auto-cleanup decision:** The cost of a stale worktree is concrete — every `git worktree list` enumeration walks it, every IDE indexer crawls it. The cost of removing a worktree that did useful work is catastrophic — lost commits, lost uncommitted changes.

The cleanup decision is made by `hasWorktreeChanges()` which runs `git status --porcelain` + `git rev-list --count $originalHead..HEAD`. If either returns nonzero, the worktree stays. Otherwise it's removed. This is the same logic that ExitWorktree uses (see [exit_worktree.md](exit_worktree.md)).

**Disabled for parents that already have a cwd override:** A subagent invoked from within a worktree-isolated agent does NOT get its own worktree (the `xRH()` check in `validateInput`). The parent is already isolated; nested isolation would be wasteful and confusing.

---

## run_in_background — Async Lifecycle

When `run_in_background: true` is set, the tool returns immediately with `status: "async_launched"` and the subagent continues running in a background `LocalAgentTask`:

```javascript
// ============================================
// agentAsyncLaunch - Background task registration
// Location: cli_inner_pretty.js:351480 (let h = Z.success && "run_in_background" in Z.data ...)
// ============================================

// ORIGINAL (for source lookup):
let h = Z.success && "run_in_background" in Z.data && Z.data.run_in_background === !0,
  // ... later ...
  if (_ === !0 || v.background === !0) {
    // Register async agent, return outputFile path
    return {
      data: {
        status: "async_launched",
        agentId: ...,
        description: q,
        prompt: H,
        outputFile: ...,
        canReadOutputFile: ...,
      },
    };
  }

// READABLE (for understanding):
const isAsync = (run_in_background === true || selectedAgent.background === true) && !isBackgroundTasksDisabled;
if (isAsync) {
  const agentId = createAgentId();
  const outputFile = getTaskOutputPath(agentId);
  registerAsyncAgent({ agentId, prompt, description, outputFile, ... });
  // Spawn the actual subagent loop in a detached promise
  runAsyncAgentLifecycle({ agentId, ... });
  return {
    data: {
      status: "async_launched",
      agentId,
      description,
      prompt,
      outputFile,
      canReadOutputFile: hasReadOrBashTool(toolUseContext.tools),
    },
  };
}

// Mapping: _→run_in_background, v.background→selectedAgent.background, ZnH→isBackgroundTasksDisabled
```

**Why notify-on-completion rather than poll:** The parent's prompt explicitly tells it: *"do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead."* (cli_inner_pretty.js:235708-235709). The token cost of poll-loops in long-running task contexts is enormous; the LocalAgentTask infrastructure injects a `<task-notification>` message into the parent's input queue when the agent finishes.

**Auto-background gate:** If `CLAUDE_AUTO_BACKGROUND_TASKS` env var or `tengu_auto_background_agents` GrowthBook gate is on, agents running >120s are automatically migrated to background. The parent doesn't choose async-vs-sync; the system does.

**Background-disabled fallback:** When `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`, the `run_in_background` field is stripped from the schema (in `XV6`). The model never sees the parameter, so it can't request it.

---

## checkPermissions

The Agent tool does not implement `checkPermissions` directly — its permission check is layered:

1. **`Agent(<agentType>)` rule matching**: `filterDeniedAgents()` is called at both `prompt()` (advertised tools) and `call()` (actual invocation) phases. If the user has `permissions.deny: ["Agent(code-reviewer)"]`, the rule blocks both showing it in the agent list and running it.

2. **Required MCP server gate**: If `selectedAgent.requiredMcpServers` is non-empty, the call waits up to 30s for those servers to enter `connected` state. This is a startup race protection, not a permission check.

3. **No per-call permission prompt**: Unlike Bash, the Agent tool never triggers an "ask" dialog. The decision is purely rule-based: allow (default) or deny (via `Agent(name)` rule). Otherwise it proceeds without confirmation.

**Why no ask dialog:** Subagent invocations are themselves permission-gated (the subagent's own tool calls trigger their own prompts), and the parent already had to authorize getting this far. Prompting twice for "are you sure you want to dispatch a subagent" would be friction without security value.

---

## call() — High-Level Flow

The `call()` function is the longest in the tool suite. The major decision points:

1. **Teammate spawn check**: `teamName && name` → diverge to `spawnTeammate()`, return `status: "teammate_spawned"`.
2. **Resolve effective subagent_type**: explicit > fork (if gate on) > general-purpose default.
3. **Recursive-fork guard**: If we're already inside a fork child, reject.
4. **Permission filtering**: `filterDeniedAgents()` against the activeAgents pool, considering `allowedAgentTypes` if set by parent's `Agent(x,y)` permission spec.
5. **Fuzzy match**: If exact lookup fails, run `Zu7` normalizer over all agents and pick the one match — or error on ambiguity.
6. **Required MCP servers**: Wait up to 30s for pending servers; check tool-pool inclusion.
7. **Apply isolation**: If `isolation: "worktree"`, create the worktree and `process.chdir()`. If `cwd`, override the working directory for this agent's run.
8. **Async vs sync**: If `run_in_background` or agent has `background: true`, register the LocalAgentTask and return immediately. Else run the subagent loop inline.
9. **Subagent loop** (sync path): build effective system prompt with agent's frontmatter prompt + memory + ENV details, then enter `runAgent()` which is a fresh `nO()` agent loop with the agent's own model and tool pool.
10. **Cleanup**: If worktree isolation and the subagent didn't change anything, remove the worktree. Restore parent's cwd.

---

## Render Methods

The Agent tool renders the use message via `renderToolUseMessage` (showing the description + agent type), the result via `renderToolResultMessage` (the final assistant message from the subagent), and progress via `renderToolUseProgressMessage`. The grouped UI (when multiple agents are launched in one assistant turn) uses `renderGroupedToolUse` which side-by-sides them. The UI module is split into `src/tools/AgentTool/UI.tsx`.

A user-facing background hint appears after `PROGRESS_THRESHOLD_MS` (2 seconds) of waiting, encouraging the user that they can hit Esc to background the agent rather than waiting on it.

---

## Key Insights

- **`Task` is a legacy wire name**: The constant `LEGACY_AGENT_TOOL_NAME = "Task"` is registered as an alias on the tool definition. Sessions resumed from older versions that wrote `Task` tool calls still resolve to the same handler. Permission rules referencing `Task(name)` are aliased to `Agent(name)`.

- **Schema gating happens at first list, not per-call**: `lazySchema()` memoizes the schema after first read. Flipping `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` mid-session does not re-render the tool description — the parent keeps seeing the original schema until process restart.

- **Fork agent vs general-purpose**: The fork agent inherits the parent's full message history (cache-friendly, same model, same tools), while the general-purpose agent starts with zero context. Same wire-level tool, but the inner conversation setup is fundamentally different.

- **One-shot built-in agents skip the trailer**: `ONE_SHOT_BUILTIN_AGENT_TYPES` includes `"Explore"` and `"Plan"`. For these, the tool result omits the agentId/SendMessage/usage trailer (~135 chars). Multiplied by 34M Explore runs/week, this is meaningful token savings (see `constants.ts:8-12`).

- **The `at` constant is the general-purpose default**: `at` in the bundle refers to `GENERAL_PURPOSE_AGENT` from `built-in/generalPurposeAgent.ts`. When fork is off and the model doesn't specify `subagent_type`, this is the agent that runs.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.117 | Added `mcpServers` and `hooks` frontmatter fields to agent definition schema. |
| v2.1.119 | (Indirectly via TaskList) Agents that touch tasks now see ID-sorted results. |
| v2.1.121 | `isolation: "remote"` introduced (ant-only) — launches subagent via CCR. |
| v2.1.129 | `requiredMcpServers` startup race protection: waits up to 30s for pending servers. |
| v2.1.133 | `worktree.baseRef` setting (`fresh`/`head`) controls branch base for agent worktrees. |
| v2.1.136 | `cwd` parameter for KAIROS builds (mutex with `isolation`). |
| v2.1.140 | Subagent_type case- and separator-insensitive matching (`Zu7` normalizer). Ambiguity check throws clear error. New analytics event `tengu_subagent_type_normalized`. |
| v2.1.142 | (Documented here) Schema stable; backing changes are in worktree integration and background-tasks lifecycle. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent, Tools)
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 meta/agent additions

Key functions in this document:
- `agentExportedInputSchema` (XV6) - Gate-pruned input schema
- `agentBaseInputSchema` (Cc_) - Core fields
- `agentFullInputSchema` (bc_) - With multi-agent + isolation
- `agentOutputSchema` (xc_) - Discriminated union result
- `agentTool` (Gu7) - Tool definition
- `normalizeAgentType` (Zu7) - v2.1.140 case-insensitive matcher
- `GENERAL_PURPOSE_AGENT` (at) - Default agent
- `FORK_AGENT` (vI) - Implicit-fork agent
- `isForkSubagentEnabled` (W0) - Fork experiment gate
- `isBackgroundTasksDisabled` (ZnH) - Env-var gate
- `AGENT_TOOL_NAME` (D7) - "Agent"
- `LEGACY_AGENT_TOOL_NAME` (hu) - "Task"
