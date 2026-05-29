# Built-in Agents — v2.1.142 Catalog

## What This Document Covers

Built-in agents are `AgentDefinition` objects baked into the CLI binary itself, registered in `activeAgents` at startup *before* any user/project/plugin agents are loaded. They have `source: "built-in"`, which gives them an admin-trust pass for hook/MCP gating (see [hook_inheritance.md](./hook_inheritance.md) and [mcpserver_inheritance.md](./mcpserver_inheritance.md)) and routes them through `isBuiltInAgent` (`rj`, cli_inner_pretty.js:231961-231963) for telemetry filtering.

In v2.1.142 there are **six** built-ins. v2.1.88's TS source ships a seventh file (`verificationAgent.ts`), but its registration in `getBuiltInAgents` is **doubly gated** by `feature('VERIFICATION_AGENT')` (build-time bundle pragma) AND `getFeatureValue_CACHED_MAY_BE_STALE('tengu_hive_evidence', false)` (GrowthBook, default off). So even in v2.1.88, most external builds shipped without it. In v2.1.142's minified bundle, there is **no** `agentType: "verification"` reference anywhere — the agent was either dead-code-eliminated (the `feature()` pragma is consumed by Bun's bundler) or removed entirely. Functionally for v2.1.142 users, the agent does not exist.

This document walks each one with: identity, model/tools, prompt strategy, lifecycle gates, cross-validation against v2.1.88, and the design decision it embodies.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills, Plan)

Key symbols in this document:
- `isBuiltInAgent` (`rj`) - source-equality predicate (cli_inner_pretty.js:231961-231963)
- `getActiveAgentsFromList` (`bC`) - precedence sort (cli_inner_pretty.js:231970-231981) — built-in beats plugin beats user beats project beats flag beats policy
- `xgH` - the built-in agent assembly function (cli_inner_pretty.js:231898-231913) — gated by `CLAUDE_CODE_ENTRYPOINT` and `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`
- `at` (`GENERAL_PURPOSE_AGENT`) - the catch-all when `subagent_type` is omitted and fork is disabled (cli_inner_pretty.js:231625-231633)
- `ot` (`EXPLORE_AGENT`) - read-only search (cli_inner_pretty.js:231595-231605)
- `d88` (`PLAN_AGENT`) - read-only planner (cli_inner_pretty.js:231700-231711)
- `q67` (`STATUSLINE_SETUP_AGENT`) - settings helper (cli_inner_pretty.js:231715-231860)
- `H67` (`CLAUDE_CODE_GUIDE_AGENT`) - docs-fetching guide (cli_inner_pretty.js:231470-231538)
- `FM6` (`CLAUDE_FLEETVIEW_AGENT`) - FleetView background catch-all (cli_inner_pretty.js:231865-231893)
- `vI` (`FORK_AGENT`) - synthetic, NOT registered in `activeAgents` (cli_inner_pretty.js:211810-211819) — see [fork_lifecycle.md](./fork_lifecycle.md)

## Registration Order and Conditional Inclusion

```javascript
// ============================================
// assembleBuiltInAgents - The registration order and gates
// Location: cli_inner_pretty.js:231898-231913
// ============================================

// ORIGINAL (for source lookup):
function xgH() {
  if (bH(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && T6()) return [];
  let H = [at, q67];
  if (!rmH()) {
    let { CLAUDE_AGENT: q } = (gM6(), s6(_67));
    H.push(q);
  }
  if (o3$()) H.push(ot, d88);
  if (
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py" &&
    process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli"
  )
    H.push(H67);
  return H;
}

// READABLE (for understanding):
function getBuiltInAgents() {
  // Hard kill: SDK explicitly disabling built-ins AND the session is non-interactive
  // (SDK / headless / -p). T6 is `!isInteractive`, NOT a coordinator check.
  if (parseEnvTruthy(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && getIsNonInteractiveSession()) {
    return [];
  }
  // Always include: general-purpose + statusline-setup
  const agents = [GENERAL_PURPOSE_AGENT, STATUSLINE_SETUP_AGENT];
  // Conditional: the `claude` FleetView agent — only when the agent-view/daemon
  // feature is enabled (`!isAgentViewDisabled()`). Disabled via
  // CLAUDE_CODE_DISABLE_AGENT_VIEW or settings.disableAgentView (3P/opt-out).
  if (!isAgentViewDisabled()) {
    const { CLAUDE_AGENT } = require("./claudeAgent");
    agents.push(CLAUDE_AGENT);
  }
  // Always: Explore + Plan. `o3$` is hardcoded `return true` in v2.1.142 —
  // v2.1.88's `tengu_amber_stoat` / `BUILTIN_EXPLORE_PLAN_AGENTS` gate is gone.
  if (areExplorePlanAgentsEnabled()) {
    agents.push(EXPLORE_AGENT, PLAN_AGENT);
  }
  // SDK entrypoints don't get claude-code-guide (it'd be misleading in non-CLI hosts)
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts"
      && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py"
      && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli") {
    agents.push(CLAUDE_CODE_GUIDE_AGENT);
  }
  return agents;
  // NOTE: v2.1.142 has NO coordinator branch. v2.1.88's getBuiltInAgents short-
  // circuited to getCoordinatorAgents() under feature('COORDINATOR_MODE') +
  // CLAUDE_CODE_COORDINATOR_MODE; that whole path is stripped from this build.
}

// Mapping: xgH→getBuiltInAgents, bH→parseEnvTruthy, T6→getIsNonInteractiveSession (!isInteractive, line 2677-2679),
//          rmH→isAgentViewDisabled (line 139859-139861), o3$→areExplorePlanAgentsEnabled (hardcoded true, line 231895-231897),
//          at→GENERAL_PURPOSE_AGENT, q67→STATUSLINE_SETUP_AGENT,
//          ot→EXPLORE_AGENT, d88→PLAN_AGENT, H67→CLAUDE_CODE_GUIDE_AGENT,
//          FM6→CLAUDE_AGENT (the "claude" FleetView agent)
```

> ⚠️ **Correction (v2.1.142 source re-verification).** Earlier drafts of this
> doc mapped `T6 → isCoordinatorMode` and `rmH → isRemoteMcpOnlyMode`. Both are
> **wrong**. Direct reads of the v2.1.142 bundle show `T6()` = `return !U$.isInteractive`
> (`getIsNonInteractiveSession`, cli_inner_pretty.js:2677-2679) and `rmH()` =
> `parseEnvTruthy(CLAUDE_CODE_DISABLE_AGENT_VIEW) || settings.disableAgentView === true`
> (`isAgentViewDisabled`, cli_inner_pretty.js:139859-139861, also used to gate the
> daemon at 610651). Coordinator mode is entirely absent from v2.1.142 (zero hits
> for `CLAUDE_CODE_COORDINATOR_MODE` / `getCoordinatorAgents`); see
> [30_agent_team/builtin_agents.md](../30_agent_team/builtin_agents.md#coordinator-mode-removed-in-v21142).

### Why this conditional shape

- **`CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS && getIsNonInteractiveSession()`** — both must be true. A standalone *interactive* SDK user who sets the env var still gets the built-ins (they're useful for ad-hoc tasks); only the env-var + **non-interactive** (headless / `-p` / pure-SDK) combo returns the empty roster, because that's the "I want a blank slate, I'll register my own agents" case. `T6` is `!U$.isInteractive`, not a coordinator check.
- **`claude` agent excluded under `isAgentViewDisabled()`** — the FleetView catch-all (`isolation: "worktree"`, `appendSystemPrompt: true`) only makes sense when the agent-view / background-daemon feature is on. The same `rmH()` predicate makes `claude daemon` refuse to start (`cli_inner_pretty.js:610651`, "background agents disabled (3P/opt-out)"). 3P deployments (Bedrock/Vertex) and users who set `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` or `settings.disableAgentView` therefore never register the `claude` agent — there is no fleet to dispatch it into.
- **`claude-code-guide` SDK exclusion** — the agent's whole purpose is to fetch CLI docs and explain CLI features. Inside an SDK app, that's confusing; the user typing "how do I set hooks?" probably wants help with *the SDK*, not the CLI.

### Precedence in `getActiveAgentsFromList` (`bC`)

```javascript
// cli_inner_pretty.js:231970-231981
function bC(H) {
  let $ = H.filter((O) => O.source === "built-in"),
    q = H.filter((O) => O.source === "plugin"),
    K = H.filter((O) => O.source === "userSettings"),
    _ = H.filter((O) => O.source === "projectSettings"),
    A = H.filter((O) => O.source === "policySettings"),
    z = H.filter((O) => O.source === "flagSettings"),
    Y = [$, q, K, _, z, A],
    f = new Map();
  for (let O of Y) for (let M of O) f.set(M.agentType, M);
  return Array.from(f.values()).sort((O, M) => O.agentType.localeCompare(M.agentType));
}
```

Order of *insertion* into the `Map` (which uses last-write-wins): built-in → plugin → userSettings → projectSettings → flagSettings → policySettings.

**This means** policy overrides everything; flag overrides project/user; project overrides user; user overrides plugin; plugin overrides built-in. So a `code-reviewer` agent shipped as a built-in can be customized by the user, then customized further by project settings, then locked down by a policy push.

The intent: built-ins are *defaults*. Custom configurations always win because admins/users have local knowledge the binary can't anticipate.

## 1. `general-purpose` — The Default

```javascript
// Source: cli_inner_pretty.js:231623-231633
at = {
  agentType: "general-purpose",
  whenToUse: "General-purpose agent for researching complex questions, ...",
  tools: ["*"],
  source: "built-in",
  baseDir: "built-in",
  getSystemPrompt: J5_,
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` | `["*"]` | All available tools — this is the catch-all. The `*` is a special pattern that `resolveAgentTools` interprets as "inherit parent's full pool" without filtering. |
| `model` | **(omitted)** | `getDefaultSubagentModel()` (`u06`, cli_inner_pretty.js:335993-335995) returns the literal `"inherit"`; `getAgentModel()` (`kwH`, 335996-336022) then resolves `"inherit"` against the parent's `mainLoopModel` + `permissionMode` via `getRuntimeMainLoopModel` (so plan-mode `opusplan` upgrades to Opus). `CLAUDE_CODE_SUBAGENT_MODEL` env and a tool-specified model both override. |
| `permissionMode` | (omitted) | Inherits parent's mode. |
| `color` | (omitted) | Auto-assigned from `AGENT_COLOR_PALETTE` round-robin. |
| `omitClaudeMd` | (false default) | Sees full CLAUDE.md hierarchy — it's a general agent, may need any project context. |

### When it's used

`general-purpose` is the fallback when the model emits `Agent({...})` *without* `subagent_type`, and `isForkSubagentEnabled()` returns false. From the Agent tool's call handler (cli_inner_pretty.js:351357):

```javascript
let G = $ ?? (W0() ? void 0 : at.agentType),
  V = G === void 0,
  v;
if (V) { /* fork path */ v = vI; }
else { /* normal path */ v = resolveAgentByType(G); }
```

So when fork is **enabled** and `subagent_type` is omitted → fork path. When fork is **disabled** and `subagent_type` is omitted → `general-purpose`. This was the pre-v2.1.117 default for all "omitted `subagent_type`" Agent tool calls.

### System prompt

```
You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's
message, you should use the tools available to complete the task. Complete the task
fully—don't gold-plate, but don't leave it half-done.

When you complete the task, respond with a concise report covering what was done and
any key findings — the caller will relay this to the user, so it only needs the
essentials.

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: search broadly when you don't know where something lives.
  Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the
  first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions,
  look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal.
  ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create
  documentation files if explicitly requested.
```

The prompt is **deliberately generic**. The "your strengths" / "guidelines" sections frame the agent as a *research assistant*, biasing the model toward read-many-files patterns even though `tools: ["*"]` lets it write.

### Cross-validation with v2.1.88

`src/tools/AgentTool/built-in/generalPurposeAgent.ts` is byte-identical (modulo whitespace) to the v2.1.142 minified definition. No semantic changes since pre-v2.1.117. The strict "NEVER create files" guidance dates to v2.1.40-ish (when "agents kept creating throwaway scratch.md files" was a frequent complaint).

## 2. `Explore` — Fast Read-Only Search

```javascript
// Source: cli_inner_pretty.js:231595-231605
ot = {
  agentType: "Explore",
  whenToUse: D5_,        // "Fast read-only search agent..." (more detail in lean variant)
  whenToUseLean: j5_,    // shorter variant for compact listings
  disallowedTools: [D7, kZ, G7, o4, VP],  // Agent, ExitPlanMode, Edit, Write, NotebookEdit
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",        // unconditional in v2.1.142 (see correction below)
  omitClaudeMd: !0,
  getSystemPrompt: () => w5_(),
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` | (omitted, defaulted) | All parent tools minus `disallowedTools`. |
| `disallowedTools` | `[Agent, ExitPlanMode, Edit, Write, NotebookEdit]` | Read-only: can't edit files (`Edit`=`G7`, `Write`=`o4`), can't write notebooks (`NotebookEdit`=`VP`), can't spawn nested agents (`Agent`=`D7`), can't exit plan mode (`ExitPlanMode`=`kZ`). **`Bash` is NOT in this list** — Explore *keeps* Bash and the prompt explicitly tells it to use Bash for read-only ops (`ls`, `git status/log/diff`, `find`/`grep`, `cat`/`head`/`tail`). The write-prevention for Bash is prompt-level, not tool-level. |
| `model` | `haiku` (**unconditional** in v2.1.142) | Earlier drafts said "haiku (external) / inherit (ant)" — that's the **v2.1.88** definition (`process.env.USER_TYPE === 'ant' ? 'inherit' : 'haiku'`). v2.1.142's `ot` hardcodes `model: "haiku"` (cli_inner_pretty.js:231602) with no `USER_TYPE` ternary and no `tengu_explore_agent` flag (zero hits). Every caller — ant or external — gets haiku. |
| `omitClaudeMd` | `true` | Read-only search; doesn't need commit/PR/lint rules. Saves significant tokens at the 34M+ Explore spawns/week scale. |

### Key design

**Two `whenToUse` variants:**

- `whenToUse` (D5_, full): comprehensive description suitable for the `Available agent types and tools` listing — explains thoroughness levels (quick/medium/thorough), and what Explore is NOT good for (review/audit/consistency checks).
- `whenToUseLean` (j5_, lean): a shorter form used in `agent_listing_delta` reminders sent via system-reminder messages, where the listing budget is tighter.

The split was added in v2.1.140 alongside the agent-list-attach experiment (`tengu_agent_list_attach`). When agents are surfaced via a system-reminder rather than the full Agent tool prompt, the description should be shorter — but the full description is still useful when the model needs to decide what tool to use up-front.

### System prompt strategy: CRITICAL READ-ONLY

The Explore system prompt opens with:

```
=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch, or file creation of any kind)
- Modifying existing files (no Edit operations)
- Deleting files (no rm or deletion)
- Moving or copying files (no mv or cp)
- Creating temporary files anywhere, including /tmp
- Using redirect operators (>, >>, |) or heredocs to write to files
- Running ANY commands that change system state
```

Why both `disallowedTools` AND prompt-level prohibitions? **Defense in depth.** The `disallowedTools` filter physically removes the tools from the agent's pool — the model literally cannot call `Edit`. But the model might still try to use `Bash`'s read-only subset (if `Bash` weren't blocked) for `cp`, `rm`, redirect operators. The prompt prohibition catches that without needing per-command bash filtering.

### Cross-validation with v2.1.88

v2.1.88's `src/tools/AgentTool/built-in/exploreAgent.ts` matches v2.1.142's *prompt* and *tool restrictions* precisely, but **diverges on model**: v2.1.88 sets `model: process.env.USER_TYPE === 'ant' ? 'inherit' : 'haiku'` (exploreAgent.ts:78) with a comment that ants additionally consult the `tengu_explore_agent` GrowthBook flag at runtime. v2.1.142 **dropped the ternary and the flag**: `model: "haiku"` is unconditional (cli_inner_pretty.js:231602). v2.1.142 also added `whenToUseLean` (`j5_`) — a shorter description used by the `agent_listing_delta` system-reminder path — which v2.1.88 lacks. The exact v2.1.142 strings: `whenToUse` (`D5_`) explicitly warns "Do NOT use it for code review, design-doc auditing, cross-file consistency checks, or open-ended analysis — it reads excerpts rather than whole files"; `whenToUseLean` (`j5_`) compresses this to one sentence.

## 3. `Plan` — Read-Only Software Architect

```javascript
// Source: cli_inner_pretty.js:231700-231711
d88 = {
  agentType: "Plan",
  whenToUse: "Software architect agent for designing implementation plans...",
  disallowedTools: [D7, kZ, G7, o4, VP],  // same as Explore
  source: "built-in",
  tools: ot.tools,                        // ← REUSES Explore's tools (undefined; default pool)
  baseDir: "built-in",
  model: "inherit",
  omitClaudeMd: !0,
  getSystemPrompt: () => X5_(),
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` | (inherits Explore's; both undefined) | Same default pool, then filtered by `disallowedTools`. |
| `disallowedTools` | `[Agent, ExitPlanMode, Edit, Write, NotebookEdit]` | Same as Explore. |
| `model` | `inherit` | Plan uses the parent's model — planning quality matters more than speed. |
| `omitClaudeMd` | `true` | "Plan is read-only and can Read CLAUDE.md directly if it needs conventions. Dropping it from context saves tokens without blocking access." |

### Key design

The Plan agent is a **subagent meant to be dispatched** — not invoked from plan mode (which has its own different mechanics). It's called when the model decides "this task is large enough to warrant a structured plan", and the Plan agent produces a step-by-step implementation strategy.

System prompt explicitly enumerates the *Process*:
1. Understand requirements
2. Explore thoroughly (with `find`/`grep`/`Read` as appropriate)
3. Design solution
4. Detail the plan
5. End with `### Critical Files for Implementation` listing 3-5 file paths

This **structured-output requirement** lets the calling agent parse the result deterministically: the `Critical Files for Implementation` heading is a known anchor. The calling agent can extract those paths and feed them as the first reads in its implementation phase.

### Cross-validation with v2.1.88

`src/tools/AgentTool/built-in/planAgent.ts` is structurally identical (`tools: EXPLORE_AGENT.tools`, `model: "inherit"`, `omitClaudeMd: true`, same `disallowedTools`). The prompt is **mostly** word-for-word, with one v2.1.142 addition: `getPlanV2SystemPrompt` (`X5_`, cli_inner_pretty.js:231635-231689) now branches on shell kind — `let H = Y9()` selects Unix (`ls, git status/log/diff, find, cat/head/tail` via the `Bash` tool name `Sq`) vs **PowerShell** (`Get-ChildItem, Get-Content, Select-Object -First/-Last`, `New-Item/Remove-Item/Copy-Item/Move-Item` via the PowerShell tool name `EK`). v2.1.88's `planAgent.ts` only branched on `hasEmbeddedSearchTools()` (find/grep vs Glob/Grep) and had no PowerShell awareness. The structured-output contract (`### Critical Files for Implementation`, 3-5 paths) is unchanged.

## 4. `statusline-setup` — Settings Helper

```javascript
// Source: cli_inner_pretty.js:231715-231860
q67 = {
  agentType: "statusline-setup",
  whenToUse: "Use this agent to configure the user's Claude Code status line setting.",
  tools: ["Read", "Edit"],     // ONLY Read and Edit — extremely tight
  source: "built-in",
  baseDir: "built-in",
  model: "sonnet",
  color: "orange",
  getSystemPrompt: () => `You are a status line setup agent for Claude Code. ...`,
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` | `["Read", "Edit"]` | The agent's only job is to read shell config + write `~/.claude/settings.json`. Nothing else needed. |
| `model` | `sonnet` | Setup is fiddly (PS1 parsing, ANSI color handling, JSON edit) but not deep — sonnet over haiku for accuracy, over opus for cost. |
| `color` | `orange` | Pinned in frontmatter. Status line operations are infrequent; pinning ensures the user can recognize the agent across sessions. |

### Key design

This agent's prompt is a **mini DSL spec**: it documents the PS1 escape sequence translations (`\u → $(whoami)`, etc.), and the entire stdin JSON schema that `statusLine` commands receive. The prompt is ~2000 lines long because it embeds:

1. The PS1 conversion table.
2. The exact JSON input the statusLine command will receive (session_id, transcript_path, cwd, model info, workspace info, context_window stats, rate_limits, vim, agent, worktree, etc.).
3. Example `jq` invocations for common fields.
4. The required structure of `~/.claude/settings.json`.

The model essentially writes out the user's `statusLine.command` based on their existing PS1 + understands the runtime schema available. The narrow tool surface (`Read`, `Edit`) is what makes it safe — even if the prompt is misinterpreted, the agent can't break the shell environment.

### Cross-validation with v2.1.88

The v2.1.142 prompt's embedded `statusLine`-stdin JSON schema (cli_inner_pretty.js:231756-231819) is a **superset** of v2.1.88's. New keys in v2.1.142, in addition to `context_window.used_percentage`/`remaining_percentage` (v2.1.115) and `workspace.git_worktree` (v2.1.105):
- `effort: { level: "low"|"medium"|"high"|"xhigh"|"max" }` — only present when the model supports reasoning effort.
- `thinking: { enabled: boolean }` — whether extended thinking is on.
- `vim.mode` extended to include `"VISUAL"` / `"VISUAL LINE"` (v2.1.88 only had INSERT/NORMAL).

These mirror runtime features added between the two versions (the `/effort` command, the thinking toggle). The agent's tools (`["Read","Edit"]`), `model: "sonnet"`, and `color: "orange"` are unchanged.

## 5. `claude-code-guide` — Docs Fetcher

```javascript
// Source: cli_inner_pretty.js:231470-231538
H67 = {
  agentType: BM6,    // "claude-code-guide"
  whenToUse: `Use this agent when the user asks questions ("Can Claude...", ...) about:
              (1) Claude Code (the CLI tool)... (2) Claude Agent SDK...
              (3) Claude API (formerly Anthropic API)... IMPORTANT: Before spawning
              a new agent, check if there is already a running or recently completed
              claude-code-guide agent that you can continue via SendMessage.`,
  get tools() {
    return dM() && Y9() ? [Sq, Bq, FD, VI] : [d1, v9, Bq, FD, VI];
  },
  source: "built-in",
  baseDir: "built-in",
  model: "haiku",
  permissionMode: "dontAsk",   // ← unusual!
  getSystemPrompt({ toolUseContext }) { /* dynamic — sees user config */ }
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` (getter) | Ant: `[Bash, Read, WebFetch, WebSearch]`; External: `[Glob, Grep, Read, WebFetch, WebSearch]` | Ant builds with embedded `bfs`/`ugrep` route file search through `Bash`; external builds use `Glob`/`Grep` tools directly. **The getter form means the resolution happens at agent-load time**, not at code definition — when `hasEmbeddedSearchTools()` flips, the tool set updates. |
| `model` | `haiku` | Fast model for fetching docs and synthesizing answers. |
| `permissionMode` | `dontAsk` | Auto-approves tool use without prompting. **Why safe?** All its tools are read-only (Read/WebFetch/WebSearch). No mutations, no shell. Worst case: it fetches the wrong URL. |
| `getSystemPrompt` | **dynamic** (closure over `toolUseContext`) | Reads the user's custom skills, custom agents, MCP servers, plugin commands, and `settings.json` at spawn time and embeds them into the prompt. |

### The unique dynamic prompt

Most built-ins return a static string from `getSystemPrompt`. `claude-code-guide` is different:

```javascript
getSystemPrompt({ toolUseContext: H }) {
  let $ = H.options.commands,
    q = [],
    K = $.filter((M) => M.type === "prompt");   // custom skills
  if (K.length > 0) q.push(`**Available custom skills in this project:** ...`);
  let _ = H.options.agentDefinitions.activeAgents.filter((M) => M.source !== "built-in");
  if (_.length > 0) q.push(`**Available custom agents configured:** ...`);
  let A = H.options.mcpClients;
  if (A && A.length > 0) q.push(`**Configured MCP servers:** ...`);
  // ... + plugin skills + user's settings.json snapshot
  // ...
  if (q.length > 0)
    return `${basePrompt}\n---\n# User's Current Configuration\n\n...${q.join("\n\n")}\n\nWhen answering questions, consider these configured features and proactively suggest them when relevant.`;
  return basePrompt;
}
```

Why? **Because the guide is helping the user discover their own config**, not just generic docs. A user asking "how do I add a custom skill?" gets a meaningfully better answer if the guide already knows what skills they have, what plugins they've installed, and what their `settings.json` looks like.

The trade-off: the prompt is now non-deterministic across users (each user's prompt embeds their config). This breaks cache sharing across users, but for `claude-code-guide` that's acceptable — it's an interactive helper, not a high-throughput pipeline.

### `permissionMode: "dontAsk"` rationale

The Plan and Explore agents are also read-only but they *inherit* the parent's permission mode. `claude-code-guide` *pins* `dontAsk` because:

1. The agent fetches docs from a public URL — no permission prompt is meaningful.
2. The agent runs in `haiku` and may make many WebFetch calls in one turn (fetching the docs map, then specific pages). Prompting on each would be unworkable.
3. The user's intent is clear: "explain this thing to me" — they don't want to micromanage each web request.

### SDK exclusion

`claude-code-guide` is excluded from SDK entrypoints (`sdk-ts`, `sdk-py`, `sdk-cli`). In an SDK app, the user asking about hooks/skills/MCP probably means *the SDK's* hooks/skills/MCP, not the CLI's. The agent's prompt is CLI-centric and would mislead SDK users.

### Cross-validation with v2.1.88

`src/tools/AgentTool/built-in/claudeCodeGuideAgent.ts` matches structurally. The v2.1.142 build has updated URLs (`https://code.claude.com/docs/...` instead of older subdomain) and adds the SDK-detection branch (added v2.1.130-ish).

## 6. `claude` — FleetView Background Catch-all

```javascript
// Source: cli_inner_pretty.js:231865-231893
FM6 = {
  agentType: "claude",
  whenToUse: "Catch-all for any task that doesn't fit a more specific agent. FleetView's default when no agent name is typed.",
  tools: ["*"],
  source: "built-in",
  baseDir: "built-in",
  appendSystemPrompt: !0,           // ← merge with default system prompt
  ...{ permissionMode: "auto" },    // ← auto-accept mode
  isolation: "worktree",            // ← always in its own worktree
  getSystemPrompt: () => `This session is a background job. ...`,
};
```

| Field | Value | Why |
|-------|-------|-----|
| `tools` | `["*"]` | Full pool. |
| `appendSystemPrompt` | `true` | Unusual: this agent's prompt is **appended** to the default system prompt, not replacing it. The agent gets the standard Claude Code prompt PLUS the background-job rubric. |
| `permissionMode` | `"auto"` | Permissions are auto-resolved (denied or allowed by hooks/policies, no interactive prompts). FleetView agents run unattended. |
| `isolation` | `"worktree"` | Always runs in a fresh git worktree. The parent's working tree is untouched. |

### Why this exists

FleetView is the multi-pane UI where users dispatch many background "claude" jobs at once (e.g. "fix this lint warning across 5 files" → 5 parallel `claude` agents in 5 worktrees). The `claude` agent is the worker for these jobs.

The system prompt is a **conventions doc for autonomous operation**:

```
This session is a background job. The user may be live or away — respond naturally
either way. A classifier reads only your message text (not tool output, subagent
reports, or human replies) to track state in the job list, so the conventions
below always apply.

**Narrate.** One line on your approach before acting. After each chunk: what
happened, what's next.

**Restate.** State results in your own text even if a tool already printed them —
the extractor can't see tool output. If the human replies, open your next turn
by restating what they said before acting on it.

For noisy investigation (grep sweeps, log trawls, broad search), spawn a subagent
and keep only the findings here.

**Completed.** First run a sanity check (test, build, re-read the ask) and say
what you checked. Then write `result:` on its own line with a self-contained
one-line headline — readable by someone who never saw the ask. That line is the
*only* completion signal; ...

**Needs input.** Only when one human action unblocks you ...

**Failed.** The task is structurally impossible as framed ...
```

The `result:` / `needs input:` / `failed:` markers are **machine-parseable completion signals**. FleetView's classifier scans the agent's outgoing text for these prefixes to update the job-list UI (✓ done, ⏸ waiting on user, ✗ failed). The prompt tells the agent: write these markers literally; don't just say "I'm done" — the extractor only sees `result:`.

### When NOT included

The agent isn't included when `isAgentViewDisabled()` (`rmH`) is true — i.e. when `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` or `settings.disableAgentView` is set, or in 3P (Bedrock/Vertex) opt-out builds. The reason is structural, not sandbox-related: the `claude` agent is the *worker for FleetView background jobs*, and the same `rmH()` predicate disables the whole agent-view subsystem (including `claude daemon`, which exits at cli_inner_pretty.js:610651 with "background agents disabled (3P/opt-out)"). With no fleet, there is nothing to dispatch the agent into, so registering it would be misleading. (Note: it is the `claude` *agent* registration that `rmH` gates here — `isolation: "worktree"` itself is handled later at dispatch time, cli_inner_pretty.js:351528.)

### Cross-validation with v2.1.88

No direct match in v2.1.88's `built-in/` directory — FleetView and the `claude` agent are post-v2.1.130 additions. The closest analog in v2.1.88 is the absence of a "background job" pattern; v2.1.88 had `run_in_background` on the Agent tool but no dedicated worker agent definition.

## 7. `verification` — Conditional in v2.1.88, Absent in v2.1.142 Bundle

The v2.1.88 source includes `src/tools/AgentTool/built-in/verificationAgent.ts`, but its registration is **conditional**:

```typescript
// src/tools/AgentTool/builtInAgents.ts:64-69 (v2.1.88)
if (
  feature('VERIFICATION_AGENT') &&
  getFeatureValue_CACHED_MAY_BE_STALE('tengu_hive_evidence', false)
) {
  agents.push(VERIFICATION_AGENT);
}
```

Both gates must pass. `feature('VERIFICATION_AGENT')` is a build-time pragma — only some bundle configurations enable it. The GrowthBook flag defaults to `false`, so even on builds that include the code, the agent doesn't appear unless the rollout activates it.

In v2.1.142's bundle, the assembly function `xgH` has no `VERIFICATION_AGENT` reference at all — not even a dead-code branch. This means either Bun's bundler dead-code-eliminated the gated branch (because `feature('VERIFICATION_AGENT')` was false for the v2.1.142 build), or the code was removed entirely. From a v2.1.142 user's perspective the result is the same: **there is no `verification` agent**.

The original definition:

```typescript
export const VERIFICATION_AGENT: BuiltInAgentDefinition = {
  agentType: 'verification',
  whenToUse: VERIFICATION_WHEN_TO_USE,
  color: 'red',
  background: true,
  disallowedTools: [
    AGENT_TOOL_NAME,
    EXIT_PLAN_MODE_TOOL_NAME,
    FILE_EDIT_TOOL_NAME,
    FILE_WRITE_TOOL_NAME,
    NOTEBOOK_EDIT_TOOL_NAME,
  ],
  source: 'built-in',
  baseDir: 'built-in',
  model: 'inherit',
  getSystemPrompt: () => VERIFICATION_SYSTEM_PROMPT,
  criticalSystemReminder_EXPERIMENTAL:
    'CRITICAL: This is a VERIFICATION-ONLY task. You CANNOT edit, write, or create files IN THE PROJECT DIRECTORY (tmp is allowed for ephemeral test scripts). You MUST end with VERDICT: PASS, VERDICT: FAIL, or VERDICT: PARTIAL.',
}
```

**No matching `agentType: "verification"` exists in the v2.1.142 deobfuscated `cli_inner_pretty.js`.** A grep for the string `VERDICT: PASS` and `verification_AGENT` returns nothing. The agent was either:

1. Moved out of the built-in surface into the `/verify` skill (cli_inner_pretty.js does mention a `/verify` skill — see skill discovery).
2. Removed entirely pending a redesign.

This is a meaningful regression in v2.1.142's built-in coverage relative to v2.1.88's TS source. Users who want "verify my changes" subagent semantics should now use the `/verify` skill (a slash command + skill, not an agent).

### Why this matters

`criticalSystemReminder_EXPERIMENTAL` (the agent's `VERDICT: PASS/FAIL/PARTIAL` re-injection) is one of the few **runtime-active fields** on a built-in agent definition. The reminder is re-injected at *every user turn* of the verification subagent, ensuring the model doesn't drift away from the verification rubric over a long task.

The same field is still wired throughout v2.1.142's runtime (cli_inner_pretty.js:238250, 242698, 393275, 397885 — it's threaded into `createSubagentContext` and rendered as a `critical_system_reminder` attachment via `s65`). User-defined agents can still set `criticalSystemReminder_EXPERIMENTAL` in their frontmatter — it's just that no *built-in* agent currently exercises the feature in v2.1.142.

## The `getSystemPrompt(ctx)` Contract

Every built-in's `getSystemPrompt` matches this signature:

```typescript
getSystemPrompt(ctx?: { toolUseContext?: ToolUseContext }): string
```

`ctx?.toolUseContext` is the parent's toolUseContext, providing access to:
- `options.commands` — current command catalog (skill + slash command list)
- `options.agentDefinitions.activeAgents` — full agent registry
- `options.mcpClients` — connected MCP servers
- `options.mainLoopModel` — parent's resolved model

Most built-ins ignore `ctx` and return a static string. `claude-code-guide` is the only built-in that uses it deeply. The capability is generic — any custom agent author can write a dynamic prompt the same way (the schema accepts `getSystemPrompt: ({ toolUseContext }) => string`).

The fallback when `getSystemPrompt` throws is in `buildSubagentSystemPrompt` (`d85`, cli_inner_pretty.js:393452-393460): a static default prompt is used so an agent author's bug doesn't crash the subagent. This is the same fallback that protects user agents — built-ins don't have a special path.

## Common Patterns Across All Built-ins

### Pattern 1: Tool restriction by intent

| Agent | Intent | Tool Approach |
|-------|--------|---------------|
| `general-purpose` | Anything | `tools: ["*"]` |
| `claude` | Anything (background) | `tools: ["*"]` |
| `Explore` | Read-only search | `disallowedTools: [edit/write tools]` |
| `Plan` | Read-only planning | `disallowedTools: [edit/write tools]` |
| `statusline-setup` | Edit settings | `tools: ["Read", "Edit"]` (allowlist) |
| `claude-code-guide` | Docs lookup | `tools: [Read, WebFetch, WebSearch, +search]` (allowlist) |

The two end points:
- **"`*`"** for catch-all agents (general-purpose, claude) — gives the model maximum freedom.
- **Allowlist** for narrow-purpose agents (statusline, guide) — minimum surface area.
- **Denylist** for read-only agents (Explore, Plan) — easy to specify "all except edits".

The choice between allowlist and denylist is **intent-driven**: if the agent has a small, well-defined toolset, list them. If the agent should have everything except a few things, exclude them.

### Pattern 2: `omitClaudeMd` for tokens

Both read-only built-ins (`Explore` and `Plan`) set `omitClaudeMd: true`. CLAUDE.md hierarchy in the parent's userContext can be 5-50KB for big monorepos. The two agents that don't need it (because they're not writing files) opt out.

The kill switch (`tengu_slim_subagent_claudemd`, default true) lets ant-side flip it off if a regression is found. The comment in v2.1.88 source: *"Dropping claudeMd here saves ~5-15 Gtok/week across 34M+ Explore spawns."*

### Pattern 3: Model selection encodes priority

| Agent | Model | Priority |
|-------|-------|----------|
| `general-purpose` | (none) | Inherits parent's model — match parent's quality. |
| `Explore` | `haiku` (external) | Speed — quick scan over many files. |
| `Plan` | `inherit` | Quality — planning errors compound. |
| `statusline-setup` | `sonnet` | Accuracy — settings parsing isn't deep but is fiddly. |
| `claude-code-guide` | `haiku` | Speed — fast doc lookup. |
| `claude` | (none) | Inherits FleetView's model setting. |

The pattern: read-and-decide agents use Haiku; reason-and-design agents use Inherit or Sonnet; nothing uses Opus as a default because Opus is the parent's choice when it's needed.

### Pattern 4: Source-trust → admin gate

All built-ins have `source: "built-in"`. This routes through `isAgentTypeAdminTrusted` (`B7H`, cli_inner_pretty.js:229389) which returns true for `source ∈ {"built-in", "plugin", "policySettings"}`. The downstream effect:

- Hook registration bypasses `disableAllHooks` when the agent is admin-trusted (cli_inner_pretty.js:393199).
- MCP server connection bypasses `strictPluginOnlyCustomization` (cli_inner_pretty.js:231941, 393232).
- Telemetry counts the spawn as `is_built_in_agent: true`.

This means built-in agents *always* get their hooks/MCP loaded, even in deployments that lock down user-controlled features.

## Why a Catalog, Not Individual Tool Specifications

A reasonable design question: why isn't each built-in agent just a *tool*? E.g. `ExploreTool`, `PlanTool`, etc. — instead of `Agent(subagent_type: "Explore", ...)`.

**Answer: because they share the subagent runtime.** Each one wants:
- A separate transcript (sidechain JSONL).
- Streaming back to parent via `for await`.
- Cleanup on abort.
- Possibly a fresh permission context.
- Per-spawn hooks (SubagentStart/Stop).

Replicating this in `N` separate tools would duplicate the `runAgent` lifecycle code `N` times. The agent-definition format is the abstraction: each built-in is *data*, not code. The runtime (`runAgent`/`Vb`) is one piece of code that interprets any agent definition.

Adding a new built-in is **one file in `built-in/`** plus pushing it into `xgH`'s assembly list. No new tool registration, no new prompt builder, no new lifecycle code.

## Lifecycle Implication: Built-ins in `activeAgents`

`activeAgents` is built once at session start by `getAgentDefinitionsWithOverrides` (`CI`):

```
                  built-in (this doc)
                       │
                       ▼
                 + plugin agents
                       │
                       ▼
            + userSettings flagSettings projectSettings policySettings
                       │
                       ▼
              precedence merge via bC (last-write-wins per agentType)
                       │
                       ▼
                  activeAgents[]
                       │
                       ▼ filterAgentsByMcpRequirements (s3$)
                       │
                       ▼ filterAgentsByPermission (GnH)
                       │
                       ▼ findByType (exact, then normalized)
                       │
                       ▼
                  resolved AgentDefinition
                       │
                       ▼
                  runAgent (Vb)
```

So a built-in is the *fallback*. If a user defines a `~/.claude/agents/Explore.md`, *their* Explore wins (different content, same name). The built-in is still there as a default, but the precedence ordering hides it.

For agents the user definitely cannot override (because their type names are reserved):
- `general-purpose` — could be overridden, but rarely is. The default catch-all matters.
- `Plan` — could be, but no real reason to.
- `claude-code-guide` — overriding it would mean replacing the docs-fetcher with something else (probably not what the user wants).

## Key Insight

The built-in agent catalog encodes **opinionated defaults for common subagent needs**:
- "I need to search and don't care which model" → `Explore` (haiku, read-only).
- "I need a plan, use whichever model is best" → `Plan` (inherit, structured output).
- "I need to set up the status line" → `statusline-setup` (sonnet, tight tools).
- "Help the user with CLI docs" → `claude-code-guide` (haiku, dontAsk, dynamic prompt).
- "Default catch-all from a tool call" → `general-purpose` (parent model, full tools).
- "FleetView background job" → `claude` (auto-permission, worktree-isolated).

The flexibility is in user/plugin/policy agents that can override these — but for the 80% case where a user just wants "give me Claude Code's idea of a code reviewer", the built-ins are the answer.

The v2.1.88 → v2.1.142 evolution:
- **Added**: `claude` (FleetView background catch-all, post-v2.1.130) — supporting the unattended-job UI pattern.
- **Removed from built-ins**: `verification` (still in TS source, dropped from external bundle).
- **Updated**: `claude-code-guide` to detect SDK entrypoints and route URLs to newer documentation hosts.
- **Updated**: `statusline-setup` schema documents to include the v2.1.105 worktree fields and v2.1.115 pre-calculated context fields.
- **Stable**: `general-purpose`, `Plan`, `Explore` essentially unchanged (modulo prompt-text polish).

The stability of the core four (general-purpose / Plan / Explore / statusline-setup) reflects how well the original abstraction held up. New agents (`claude`, `claude-code-guide`) are *additive*, not replacements.
