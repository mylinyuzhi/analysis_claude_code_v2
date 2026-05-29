# Built-in Agents in the Team/Fleet Runtime — v2.1.142

## TL;DR

The agent-team subsystem doesn't invent its own roster of workers. It reuses
the same **six** built-in `AgentDefinition` objects that the `Agent` tool
dispatches as subagents (catalogued field-by-field in
[34_subagent/builtin_agents.md](../34_subagent/builtin_agents.md)). What this
document adds is the **team/fleet view**: which built-ins can play which
*role*, how the `claude` FleetView agent (the one built-in that exists
*purely* for the team subsystem) is assembled and dispatched, and how model /
tool / permission / reminder plumbing resolves when a built-in runs as a
background-fleet worker or an in-process teammate rather than a one-shot
subagent.

Three facts frame everything below:

1. **One definition, three runtimes.** A built-in like `general-purpose` or
   `Explore` is the *same data* whether it runs as (a) a synchronous subagent
   from an `Agent` tool call, (b) a daemon-supervised background-fleet worker
   (`claude agents`), or (c) — for the `claude` agent only — the **main
   session** of a spawned job. The runtime (`runAgent`/`Vb`, the daemon, the
   teammate loop) interprets the definition; the definition doesn't know which
   runtime it's in. See [task_taxonomy.md](./task_taxonomy.md) for the task
   records each runtime produces.

2. **The `claude` agent is the team's own built-in.** Five of the six
   built-ins (`general-purpose`, `Explore`, `Plan`, `statusline-setup`,
   `claude-code-guide`) are subagent helpers that happen to be reachable from
   a team too. The sixth — `claude` (`FM6`) — has no subagent purpose at all:
   it is the *default worker template* for FleetView background jobs, with
   `isolation: "worktree"`, `permissionMode: "auto"`, and the unique
   `appendSystemPrompt: true`. It is registered **only when the agent-view
   feature is enabled**.

3. **Coordinator mode is gone.** v2.1.88 had a whole alternate roster
   (`getCoordinatorAgents()`) that *replaced* the built-ins when
   `CLAUDE_CODE_COORDINATOR_MODE` was set. v2.1.142 strips coordinator mode
   entirely — the assembly function `xgH` has no coordinator branch, and the
   feature's symbols are absent from the bundle. See
   [§ Coordinator mode (removed in v2.1.142)](#coordinator-mode-removed-in-v21142).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Agent Team, Background Agents
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agents, Subagent, Tools
> - [symbol_additions_v2_1_142_agent_team_arch.md](../00_overview/symbol_additions_v2_1_142_agent_team_arch.md) — v2.1.142 agent-team additions

Key functions and constants in this document:
- `getBuiltInAgents` (`xgH`) — assembles the built-in roster with team-mode gates (cli_inner_pretty.js:231898-231913)
- `CLAUDE_AGENT` (`FM6`) — the `claude` FleetView worker definition (cli_inner_pretty.js:231865-231893)
- `areExplorePlanAgentsEnabled` (`o3$`) — hardcoded `return true` in v2.1.142 (cli_inner_pretty.js:231895-231897)
- `getIsNonInteractiveSession` (`T6`) — `!isInteractive`; SDK-blank-slate gate (cli_inner_pretty.js:2677-2679)
- `isAgentViewDisabled` (`rmH`) — gates the `claude` agent *and* the daemon (cli_inner_pretty.js:139859-139861)
- `mainThreadSystemPromptBuilder` (`jb`) — implements `appendSystemPrompt` append-vs-replace (cli_inner_pretty.js:336064-336078)
- `wrapAgentAsDispatchTemplate` (`zN4`) — `AgentDefinition` → `{name, description, initialPrompt}` (cli_inner_pretty.js:509722-509724)
- `coldDispatchBackgroundJob` (`yP8`) — spawns a fleet job via `--agent <name>` (cli_inner_pretty.js:509781-509835)
- `dispatchDefaultsToCliFlags` (`qg6`) — `{model,effort,permissionMode}` → CLI flags (cli_inner_pretty.js:509773-509780)
- `getDefaultSubagentModel` (`u06`) — returns the literal `"inherit"` (cli_inner_pretty.js:335993-335995)
- `getAgentModel` (`kwH`) — resolves `"inherit"`/aliases against the parent model (cli_inner_pretty.js:335996-336022)
- `resolveAgentTools` (`Li`) — applies `["*"]` / `disallowedTools` (cli_inner_pretty.js:339476-339541)
- `deadCoordinatorGate` (`i3H`) — `return false` stub; remnant of v2.1.88's `isCoordinatorMode` (cli_inner_pretty.js:211707-211709)

---

## The roster, from the team's point of view

`getBuiltInAgents` (`xgH`) builds one ordered list at session start. The same
list feeds `activeAgents` (after precedence-merge with user/project/plugin
agents via `bC`), and `activeAgents` is what every spawn path resolves
`subagent_type` / `--agent <name>` / the FleetView default against.

```javascript
// ============================================
// getBuiltInAgents - Assemble the built-in roster (with team-mode gates)
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
  // 1. SDK blank-slate: env opt-out AND non-interactive (headless/-p/pure-SDK).
  //    T6 = !isInteractive, NOT a coordinator check.
  if (parseEnvTruthy(process.env.CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS) && getIsNonInteractiveSession())
    return [];

  // 2. Always: general-purpose + statusline-setup.
  const agents = [GENERAL_PURPOSE_AGENT, STATUSLINE_SETUP_AGENT];

  // 3. The team's own built-in: the `claude` FleetView worker, lazily required,
  //    added only when the agent-view/daemon feature is enabled.
  if (!isAgentViewDisabled()) {
    const { CLAUDE_AGENT } = require("./claudeAgent");   // lazy: avoids init cycle
    agents.push(CLAUDE_AGENT);
  }

  // 4. Explore + Plan. o3$ is hardcoded `return true` — v2.1.88's tengu_amber_stoat
  //    / BUILTIN_EXPLORE_PLAN_AGENTS gate is gone.
  if (areExplorePlanAgentsEnabled()) agents.push(EXPLORE_AGENT, PLAN_AGENT);

  // 5. claude-code-guide for non-SDK hosts.
  if (process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-ts"
   && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-py"
   && process.env.CLAUDE_CODE_ENTRYPOINT !== "sdk-cli")
    agents.push(CLAUDE_CODE_GUIDE_AGENT);

  return agents;
  // No coordinator branch. v2.1.88 returned getCoordinatorAgents() here under
  // feature('COORDINATOR_MODE') + CLAUDE_CODE_COORDINATOR_MODE. Stripped in v2.1.142.
}

// Mapping: xgH→getBuiltInAgents, bH→parseEnvTruthy, T6→getIsNonInteractiveSession,
//          rmH→isAgentViewDisabled, o3$→areExplorePlanAgentsEnabled, gM6/s6/_67→lazy CLAUDE_AGENT import,
//          at→GENERAL_PURPOSE_AGENT, q67→STATUSLINE_SETUP_AGENT, ot→EXPLORE_AGENT,
//          d88→PLAN_AGENT, H67→CLAUDE_CODE_GUIDE_AGENT
```

### The two gates, decoded

Both gates were mis-mapped in earlier analysis passes; they are re-verified
here against the v2.1.142 bundle.

**Gate 1 — `getIsNonInteractiveSession` (`T6`, line 2677-2679):**

```javascript
function T6() { return !U$.isInteractive; }   // its complement Xv() = U$.isInteractive
```

The blank-slate return (`[]`) fires only for `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS`
**in a non-interactive session**. The intent: an SDK/headless integrator that
declares "I'll register my own agents" gets a clean slate; an *interactive*
SDK user who sets the env var still keeps the built-ins (they remain useful
for ad-hoc work). `T6` is **not** `isCoordinatorMode` — coordinator mode does
not exist in this build.

**Gate 2 — `isAgentViewDisabled` (`rmH`, line 139859-139861):**

```javascript
function rmH() {
  return bH(process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW) || dS()?.settings.disableAgentView === true;
}
```

This is the single load-bearing predicate for the *team's own built-in*. When
agent view is disabled — `CLAUDE_CODE_DISABLE_AGENT_VIEW=1`,
`settings.disableAgentView`, or a 3P (Bedrock/Vertex) opt-out build — the
`claude` agent is **not registered**, and the same `rmH()` makes
`claude daemon` exit immediately (cli_inner_pretty.js:610651, log
`"claude daemon: background agents disabled (3P/opt-out)"`). The two are
coupled on purpose: the `claude` agent is the *worker for fleet jobs*; with no
fleet/daemon there is nothing to dispatch it into, so registering it would be
misleading. `rmH` is **not** `isRemoteMcpOnlyMode`.

### Role matrix

The same definition, projected onto the three runtimes a team can use:

| Built-in | Subagent (`Agent` tool) | BG-fleet worker (`claude agents` / `--agent`) | In-process teammate | Main session (`--agent`) |
|----------|:-----------------------:|:---------------------------------------------:|:-------------------:|:------------------------:|
| `general-purpose` | ✅ default catch-all | ✅ (`--agent general-purpose`) | ✅ (generic worker) | ✅ |
| `Explore` | ✅ read-only search | ✅ | ⚠️ rarely (read-only) | ✅ |
| `Plan` | ✅ read-only architect | ✅ | ⚠️ rarely | ✅ |
| `statusline-setup` | ✅ settings helper | ⚠️ unusual | ✗ | ✅ |
| `claude-code-guide` | ✅ docs fetcher | ⚠️ unusual | ✗ | ⚠️ |
| **`claude`** | ✗ (not a subagent) | ✅ **the default fleet worker** | ✗ | ✅ (runs *as* main session) |

"Teammate" here is the `in_process_teammate` task (a peer spawned via
`SpawnTeammate` / `Agent` with `name`+`team_name`); any agent *definition* can
seed one, but in practice teams use custom agents or `general-purpose`. The
key asymmetry: **only `claude` is purpose-built for the fleet**, and it is the
only built-in whose system prompt is *appended* to (not substituted for) the
default Claude Code prompt — because a fleet job runs as a full session, not a
scoped helper.

---

## The `claude` FleetView agent (`FM6`) — the team's worker

This is the one built-in that belongs to `30_agent_team` rather than
`34_subagent`. It is **new in v2.1.142** (absent from the v2.1.88 `built-in/`
directory) and was added alongside the FleetView dashboard.

```javascript
// ============================================
// CLAUDE_AGENT - The default worker template for FleetView background jobs
// Location: cli_inner_pretty.js:231865-231893
// ============================================

// ORIGINAL (for source lookup):
FM6 = {
  agentType: "claude",
  whenToUse: "Catch-all for any task that doesn't fit a more specific agent. FleetView's default when no agent name is typed.",
  tools: ["*"],
  source: "built-in",
  baseDir: "built-in",
  appendSystemPrompt: !0,
  ...{ permissionMode: "auto" },
  isolation: "worktree",
  getSystemPrompt: () => `This session is a background job. ...`,
};

// READABLE (for understanding):
const CLAUDE_AGENT = {
  agentType: "claude",
  whenToUse: "Catch-all ... FleetView's default when no agent name is typed.",
  tools: ["*"],                 // full pool (resolveAgentTools wildcard branch)
  source: "built-in",
  baseDir: "built-in",
  appendSystemPrompt: true,     // ← append rubric to the default prompt (NOT replace)
  permissionMode: "auto",       // ← unattended: hooks/policies decide, no interactive prompt
  isolation: "worktree",        // ← always spawn in a fresh git worktree
  getSystemPrompt: () => BACKGROUND_JOB_RUBRIC,
};

// Mapping: FM6→CLAUDE_AGENT
```

Four fields make it a fleet worker rather than a subagent:

### `appendSystemPrompt: true` — the only built-in that augments rather than replaces

Every other built-in's `getSystemPrompt` *replaces* the default system prompt
(an `Explore` subagent is told it is a search specialist, full stop). The
`claude` agent instead runs as a **main session** and its rubric is appended
*after* the standard Claude Code system prompt. This is implemented in the
main-thread prompt builder:

```javascript
// ============================================
// mainThreadSystemPromptBuilder - append-vs-replace for the dispatched main-session agent
// Location: cli_inner_pretty.js:336064-336078
// ============================================

// ORIGINAL (for source lookup):
function jb({ mainThreadAgentDefinition: H, toolUseContext: $, customSystemPrompt: q,
             defaultSystemPrompt: K, appendSystemPrompt: _, overrideSystemPrompt: A }) {
  if (A) return r4([A]);
  let z = H ? (rj(H) ? H.getSystemPrompt({ toolUseContext: { options: $.options } }) : H.getSystemPrompt()) : void 0;
  if (H?.memory) d("tengu_agent_memory_loaded", { ...!1, scope: H.memory, source: "main-thread" });
  if (z && H?.appendSystemPrompt)
    return r4([...(typeof q === "string" ? [q] : Array.isArray(q) ? q : K), z, ...(_ ? [_] : [])]);
  return r4([...(z ? [z] : typeof q === "string" ? [q] : Array.isArray(q) ? q : K), ...(_ ? [_] : [])]);
}

// READABLE (for understanding):
function mainThreadSystemPromptBuilder({ mainThreadAgentDefinition, toolUseContext,
                                         customSystemPrompt, defaultSystemPrompt,
                                         appendSystemPrompt, overrideSystemPrompt }) {
  if (overrideSystemPrompt) return joinPrompt([overrideSystemPrompt]);

  // The dispatched agent's own prompt (e.g. the `claude` agent's background rubric).
  const agentPrompt = mainThreadAgentDefinition
    ? (isBuiltInAgent(mainThreadAgentDefinition)
        ? mainThreadAgentDefinition.getSystemPrompt({ toolUseContext: { options: toolUseContext.options } })
        : mainThreadAgentDefinition.getSystemPrompt())
    : undefined;

  if (mainThreadAgentDefinition?.memory)
    emitTelemetry("tengu_agent_memory_loaded", { scope: mainThreadAgentDefinition.memory, source: "main-thread" });

  // APPEND mode (claude agent): default/custom prompt FIRST, then the agent rubric.
  if (agentPrompt && mainThreadAgentDefinition?.appendSystemPrompt)
    return joinPrompt([...(customOrDefault(customSystemPrompt, defaultSystemPrompt)), agentPrompt, ...append(appendSystemPrompt)]);

  // REPLACE mode (every other --agent): agent prompt substitutes for the default.
  return joinPrompt([...(agentPrompt ? [agentPrompt] : customOrDefault(customSystemPrompt, defaultSystemPrompt)), ...append(appendSystemPrompt)]);
}

// Mapping: jb→mainThreadSystemPromptBuilder, H→mainThreadAgentDefinition, z→agentPrompt,
//          rj→isBuiltInAgent, r4→joinPrompt, q→customSystemPrompt, K→defaultSystemPrompt
```

**Why this design:** a fleet job is a *full Claude Code session that happens to
be unattended* — it still needs every standard capability (file editing,
testing, the whole tool-use rubric, CLAUDE.md, output style). Replacing the
system prompt the way a scoped subagent does would strip all that. So the
`claude` agent's rubric is purely *additive*: "you are still full Claude Code,
**and also** you're a background job, so narrate/restate/emit `result:`." The
`appendSystemPrompt` field on the agent-definition schema is the v2.1.142
addition that makes this expressible; no v2.1.88 agent definition has it.

### The background-job rubric is a classifier protocol, not just advice

The full prompt (cli_inner_pretty.js:231877-231892):

```
This session is a background job. The user may be live or away — respond naturally
either way. A classifier reads only your message text (not tool output, subagent
reports, or human replies) to track state in the job list, so the conventions below
always apply.

**Narrate.** One line on your approach before acting. After each chunk: what
happened, what's next.

**Restate.** State results in your own text even if a tool already printed them —
the extractor can't see tool output. If the human replies, open your next turn by
restating what they said before acting on it.

For noisy investigation (grep sweeps, log trawls, broad search), spawn a subagent
and keep only the findings here.

**Completed.** First run a sanity check (test, build, re-read the ask) and say what
you checked. Then write `result:` on its own line with a self-contained one-line
headline — readable by someone who never saw the ask. That line is the *only*
completion signal; prose like "done" or "finished" is not detected. `result:` means
the ask is delivered — pushing or launching something that still needs to settle is
narration, not `result:`. Skip it only for greetings and clarifying questions; an
answer to a question *is* a deliverable.

**Needs input.** Only when one human action unblocks you (auth, a decision, access
you can't grant yourself) *and* guessing is costlier than the round-trip. If a
reasonable guess exists: make it, note the assumption, keep working. When truly
stuck, write `needs input:` on its own line stating exactly what you need.

**Failed.** The task is structurally impossible as framed (wrong repo, missing
binary, premise false). Write `failed:` on its own line with the reason.

Everything else: keep working.
```

**Key insight — the prompt is an API between the agent and the FleetView UI.**
The three markers `result:` / `needs input:` / `failed:` are **machine-parsed
state transitions**, not stylistic suggestions. A classifier scans *only the
agent's outgoing message text* (deliberately ignoring tool output, subagent
reports, and human replies, which would be noisy or attacker-influenced) and
maps:

- `result:` → job row flips to ✓ *done* (and `· unread` until the user reads it)
- `needs input:` → job row flips to ⏸ *blocked / needs you* (this is what
  arms the footer-pill CTA and the diamond glyph — see
  [fleet_view_ui.md](./fleet_view_ui.md) and
  [task_taxonomy.md](./task_taxonomy.md))
- `failed:` → job row flips to ✗ *failed*

This is why the prompt is so insistent that the agent *restate results in its
own words* even when a tool already printed them: the classifier never sees
tool output, so an agent that finishes by letting `pytest` print "5 passed"
and saying nothing would leave its job stuck in *working* forever. The prompt
is compensating for the deliberately narrow input channel of the state
classifier. It is, in effect, the team subsystem's equivalent of a structured
`<task-notification>` — but expressed as a prose convention the model can
satisfy naturally rather than a tool call.

### `permissionMode: "auto"` and `isolation: "worktree"`

- **`auto`** — fleet jobs are unattended; there is no human at the keyboard to
  answer a permission prompt. `auto` mode resolves each tool call via
  hooks/policy (allow or deny) without ever blocking on interactive input.
  See [permission_inheritance.md](./permission_inheritance.md) for how this
  mode propagates and what it allows.
- **`worktree`** — every fleet job runs in a fresh git worktree so N parallel
  `claude` jobs ("fix this lint across 5 files") don't stomp each other or the
  user's working tree. The isolation field is read at dispatch time, **not**
  at definition time:

  ```javascript
  // cli_inner_pretty.js:351528 (in the agent/job runner)
  if (isolation === "worktree") worktreePath = await enterWorktree(makeWorktreeSlug(agentName));
  ```

  See [worktree_isolation.md](./worktree_isolation.md) for the
  `EnterWorktree` mechanics and the v2.1.142 pre-existing-worktree fix.

---

## How a built-in becomes a running fleet job

The dispatch chain turns an `AgentDefinition` into a spawned daemon process.
The `claude` agent is the default template, but any agent name (`--agent
code-reviewer`) flows through the same path.

```
   AgentDefinition (FM6)                 user picks "claude" / types nothing
          │                                        in FleetView
          ▼                                            │
   wrapAgentAsDispatchTemplate (zN4)  ◄────────────────┘
   { name:"claude", description:<whenToUse>, initialPrompt:undefined }
          │   c1H = zN4(FM6)   (cli_inner_pretty.js:510037 — the default template)
          ▼
   coldDispatchBackgroundJob (yP8)   cli_inner_pretty.js:509781-509835
     args = [...baseDispatchFlags(OG$), "--agent", "claude", ...dispatchDefaultsToCliFlags(defaults)]
     write job state (aKH) → spawnDaemonJob (I$H, source:"fleet")
          │
          ▼
   daemon child: claude --agent claude [--model … --effort … --permission-mode …] -- "<intent>"
     re-parses --agent (iC5 @ 510512) → re-resolves FM6 from activeAgents
          │
          ▼
   runs as MAIN SESSION:
     jb() appends FM6.getSystemPrompt() to the default prompt   (appendSystemPrompt)
     isolation:"worktree" → enterWorktree()                     (351528)
     permissionMode:"auto" → unattended permission resolution
```

```javascript
// ============================================
// dispatchDefaultsToCliFlags - {model,effort,permissionMode} → CLI flags for a fleet dispatch
// Location: cli_inner_pretty.js:509773-509780
// ============================================

// ORIGINAL (for source lookup):
function qg6(H) {
  if (!H) return [];
  return [
    ...(H.model ? ["--model", H.model] : []),
    ...(H.effort ? ["--effort", H.effort] : []),
    ...(H.permissionMode && H.permissionMode !== "default" ? ["--permission-mode", H.permissionMode] : []),
  ];
}

// READABLE (for understanding):
function dispatchDefaultsToCliFlags(defaults) {
  if (!defaults) return [];
  return [
    ...(defaults.model ? ["--model", defaults.model] : []),
    ...(defaults.effort ? ["--effort", defaults.effort] : []),
    ...(defaults.permissionMode && defaults.permissionMode !== "default"
        ? ["--permission-mode", defaults.permissionMode] : []),
  ];
}

// Mapping: qg6→dispatchDefaultsToCliFlags, H→defaults
```

The dispatch carries the FleetView **dispatch-defaults chips** (`--model`,
`--effort`, `--permission-mode`) the user set on the `claude agents` command
line, *plus* a persistent set of base flags (`OG$`, set from
`dispatchExtraArgs` when FleetView mounts — `MN4(...)` at line 569080). The
`claude` agent's own `permissionMode: "auto"` is its *definition* default;
a `--permission-mode` flag on the dispatch overrides it. See
[v2_1_142_dispatch_flags.md](./v2_1_142_dispatch_flags.md) for the full flag
set and [coordinator_process_model.md](./coordinator_process_model.md) for the
daemon side of `spawnDaemonJob`.

> **Naming caution.** `coldDispatchBackgroundJob` returns a `--routine` arg
> instead of `--agent` when dispatching a saved *routine* (`O = _ ? ["--routine", _] : ["--agent", H.name]`,
> line 509789). For the ordinary fleet case `_` is undefined, so it's
> `--agent claude`.

---

## Model / tool / permission resolution for built-in workers

When a built-in runs (in any runtime), three resolvers turn its declarative
fields into concrete runtime values. These are shared with the subagent path;
this section calls out what matters for fleet/team dispatch and corrects a
conflation from the subagent catalog.

### Model — `"inherit"` is a literal, resolved later

```javascript
// getDefaultSubagentModel (u06, cli_inner_pretty.js:335993-335995) → returns "inherit"
// getAgentModel (kwH, cli_inner_pretty.js:335996-336022) resolves it:
//   CLAUDE_CODE_SUBAGENT_MODEL env  →  tool-specified model  →  (agent.model ?? "inherit")
//   "inherit" → getRuntimeMainLoopModel({ permissionMode, mainLoopModel: parentModel })
```

- `general-purpose` and `claude` **omit** `model` → default `"inherit"` →
  resolves to the parent/fleet session's model (so `opusplan` upgrades to Opus
  in plan mode).
- `Explore` pins `"haiku"` **unconditionally** in v2.1.142 (cli_inner_pretty.js:231602)
  — note this differs from v2.1.88's `USER_TYPE === 'ant' ? 'inherit' : 'haiku'`.
- `Plan` pins `"inherit"`; `statusline-setup` pins `"sonnet"`; `claude-code-guide`
  pins `"haiku"`.

(The subagent catalog previously attributed `getDefaultSubagentModel` to `kwH`
and described it as "picks based on parent model"; precisely, `u06` returns the
literal `"inherit"` and `kwH` does the resolution. Corrected in
[34_subagent/builtin_agents.md](../34_subagent/builtin_agents.md).)

### Tools — `["*"]` vs `disallowedTools`, and what's *always* stripped

`resolveAgentTools` (`Li`, cli_inner_pretty.js:339476-339541):

- `tools: ["*"]` (or omitted) → wildcard: the full parent pool, then minus
  `disallowedTools`. Used by `general-purpose` and `claude`.
- `disallowedTools: [Agent, ExitPlanMode, Edit, Write, NotebookEdit]` →
  Explore/Plan keep everything *except* those five. **`Bash` is not in the
  list** — Explore/Plan retain Bash and are told (prompt-level) to use it
  read-only. (Earlier drafts wrongly listed Bash; the five symbols are
  `D7`=Agent, `kZ`=ExitPlanMode, `G7`=Edit, `o4`=Write, `VP`=NotebookEdit.)
- On top of per-agent rules, `filterToolsForAgent` (`JT6`, 339460-339475)
  subtracts `ALL_AGENT_DISALLOWED_TOOLS` (`n3H`, line 211699) from *every*
  agent: `{ TaskOutput, ExitPlanMode, EnterPlanMode, Agent, AskUserQuestion,
  WaitForMcpServers, ScheduleWakeup }`. So even a `["*"]` worker cannot call
  `EnterPlanMode` or re-dispatch `Agent` unless it's an internal (`ant`) build
  for the `Agent` case.

See [tool_inheritance.md](./tool_inheritance.md) for the full filter pipeline
(MCP-server requirements, custom-agent extra denials, async-allowed sets) and
how it composes with teammate tool scoping.

### Permission

Built-ins mostly inherit the parent's `permissionMode`; the two exceptions are
team/fleet-relevant: `claude` pins `"auto"` (unattended), and
`claude-code-guide` pins `"dontAsk"` (read-only doc fetches). See
[permission_inheritance.md](./permission_inheritance.md).

---

## Reminder & tool interactions specific to built-in workers

The team/fleet built-ins touch the system-reminder and tool plumbing in a few
ways the generic subagent path
([34_subagent/reminder_interaction.md](../34_subagent/reminder_interaction.md))
covers in full. The fleet-relevant points:

1. **Agent listing.** The roster `xgH` builds is what gets surfaced to a
   parent model — either inside the `Agent` tool's description, or (when
   `CLAUDE_CODE_AGENT_LIST_IN_MESSAGES` / `tengu_agent_list_attach` is on) as
   an `agent_listing_delta` system-reminder. `Explore`'s `whenToUseLean`
   (`j5_`) is the shorter description used in that reminder path, to keep the
   listing budget small when many agents are present. The `claude` agent is
   normally *not* offered as a `subagent_type` to the model — it is the fleet
   default, dispatched by the UI, not chosen by the LLM mid-turn.

2. **`criticalSystemReminder_EXPERIMENTAL`.** This per-turn re-injected
   reminder (the mechanism behind the removed `verification` agent's
   `VERDICT:` discipline) is still wired in v2.1.142's runtime and is
   available to *custom* team agents via frontmatter. No built-in currently
   uses it (the only one that did, `verification`, is absent). The `claude`
   agent achieves a similar "don't drift from the contract" effect through its
   *appended* rubric rather than a re-injected reminder — appropriate, since
   the rubric must hold for the entire long-running session.

3. **Tool-level vs prompt-level enforcement.** Built-ins use a **defense-in-
   depth** split: `disallowedTools`/`filterToolsForAgent` physically remove
   tools (the model cannot emit a denied tool call), while the prompt restates
   the restriction for the *surviving* tools (e.g. "use Bash read-only"). For
   fleet workers this matters because `permissionMode: "auto"` removes the
   human backstop — the only guards left are the tool filter and the prompt.

---

## Coordinator mode (removed in v2.1.142)

v2.1.88 shipped a **coordinator mode**: a system prompt + an alternate agent
roster that turned the main session into an orchestrator of named workers.
Its entry points (from the v2.1.88 TS source):

- `src/coordinator/coordinatorMode.ts` — `isCoordinatorMode()`
  (reads `CLAUDE_CODE_COORDINATOR_MODE`, gated by `feature('COORDINATOR_MODE')`),
  `getCoordinatorSystemPrompt()` ("You are a **coordinator**…"),
  `getCoordinatorUserContext()`.
- `getBuiltInAgents()` short-circuited: `if (feature('COORDINATOR_MODE') &&
  isEnvTruthy(CLAUDE_CODE_COORDINATOR_MODE)) return getCoordinatorAgents()` —
  *replacing* the whole built-in roster with a worker roster from
  `coordinator/workerAgent.js`.
- `COORDINATOR_MODE_ALLOWED_TOOLS = { Agent, TaskStop, SendMessage,
  SyntheticOutput }`.

**v2.1.142 strips all of it.** Zero hits for `CLAUDE_CODE_COORDINATOR_MODE`,
`getCoordinatorAgents`, `COORDINATOR_MODE_ALLOWED_TOOLS`, `isCoordinatorMode`,
or the coordinator system-prompt strings. The only surviving trace *of
coordinator mode* is dead code: `getBuiltInAgents`/`xgH` has no coordinator
branch, and the fork-source resolver's first gate `i3H`
(cli_inner_pretty.js:211707-211709) is now a constant `return false` — the Bun
bundler's fold of what used to be the `isCoordinatorMode()` check.

(A bundle grep for the bare substring `coordinator` still returns ~34 hits, but
none are coordinator *mode*: they're the unrelated agent-teams "coordinator
role" — `kind:"coordinator"` task-origin records, the `coordinatorTaskIndex`
AppState field for the tasks footer — plus Cassandra OTel attribute names. Match
on the full symbols above, not the substring.)

```javascript
function i3H() { return !1; }   // was isCoordinatorMode() in v2.1.88; now a dead stub
```

**Do not confuse "coordinator mode" with the daemon supervisor.** The
`coordinator_process_model.md` doc describes `claude daemon` — the still-present
process that supervises background-fleet workers (worker pool, 60s tick, retire
policy). That is a *different* concept from the removed coordinator *mode*
(an agent-orchestration prompt + roster). The daemon is alive in v2.1.142
(`"daemon"` / `"daemon-worker"` kinds at cli_inner_pretty.js:97902, 98101);
coordinator mode is gone. The strings overlap; the systems do not.

The contemporary replacement for "orchestrate many workers" is the
**agent-teams** subsystem (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, the
`--agent-teams` flag, `spawnTeammate`/`spawnInProcessTeammate`) plus the
**background fleet** (`claude agents` + the `claude` worker agent). Both are
present in v2.1.142; see [team_lifecycle_tools.md](./team_lifecycle_tools.md)
and [teammate_runner_loop.md](./teammate_runner_loop.md).

---

## Cross-validation with v2.1.88

| Aspect | v2.1.88 (TS reference) | v2.1.142 (this build) |
|--------|------------------------|------------------------|
| **Roster size** | 6 (+ `verification`, doubly-gated) | 6 — general-purpose, statusline-setup, **claude**, Explore, Plan, claude-code-guide |
| **`claude` fleet agent** | absent | **new** — `FM6`, `isolation:"worktree"`, `appendSystemPrompt:true`, `permissionMode:"auto"` |
| **`appendSystemPrompt` field** | not on the agent schema | **new** field; only `claude` uses it (`jb`, 336064) |
| **Explore/Plan gate** | `feature('BUILTIN_EXPLORE_PLAN_AGENTS')` + `tengu_amber_stoat` (default true) | `o3$()` hardcoded `return true` |
| **Explore model** | `USER_TYPE==='ant' ? 'inherit' : 'haiku'` | `"haiku"` unconditional |
| **Plan prompt** | branches on `hasEmbeddedSearchTools` only | also branches Unix vs **PowerShell** (`Y9()`) |
| **Coordinator mode** | present (`coordinatorMode.ts`, `getCoordinatorAgents`) | **stripped**; `i3H` is a dead `return false` |
| **`verification` agent** | present in TS, doubly-gated off in external | **absent** from bundle |
| **Blank-slate gate** | `isEnvTruthy(...) && getIsNonInteractiveSession()` | identical (`T6`=`getIsNonInteractiveSession`) |
| **`claude` agent gate** | n/a (agent didn't exist) | `!isAgentViewDisabled()` (`rmH`); also gates the daemon |

The throughline: v2.1.142 **narrowed** the built-in surface (dropped
coordinator mode and the verification agent) while **adding** the one piece the
background-fleet UI needed — the `claude` worker agent and the
`appendSystemPrompt` mechanism that lets a fleet job be "full Claude Code, plus
a job-state contract."

---

## See also

- [34_subagent/builtin_agents.md](../34_subagent/builtin_agents.md) — the
  per-agent field-by-field catalog (prompts, `whenToUse`, model/tool tables)
  for all six built-ins. This doc deliberately does not duplicate that walk.
- [fleet_view_ui.md](./fleet_view_ui.md) — the dashboard that dispatches the
  `claude` worker and renders its `result:`/`needs input:`/`failed:` state.
- [agent_management_ui.md](./agent_management_ui.md) — the `/agents` menu where
  users see built-ins as a non-editable "Built-in" source and create their own.
- [task_taxonomy.md](./task_taxonomy.md) — the task records the runtimes produce.
- [v2_1_142_dispatch_flags.md](./v2_1_142_dispatch_flags.md) — the dispatch
  flags `qg6` emits.
- [permission_inheritance.md](./permission_inheritance.md),
  [tool_inheritance.md](./tool_inheritance.md) — how `auto` / `["*"]` /
  `disallowedTools` propagate.
