# Changelog Analysis — Claude Code v2.1.156 → v2.1.183 (Five-Feature Delta)

This document is the **long-form architectural narrative** for the v2.1.157 → v2.1.183 window, read **through the lens of the five features this tree was scoped to**:

1. **Agent Team** — the v2.1.178 implicit-team redesign (`TeamCreate`/`TeamDelete` removed; the Agent tool becomes the spawner)
2. **Dynamic Workflows** — the `Workflow`/ultracode subsystem and its keyword/UX/correctness deltas
3. **Background Agents** — the nested-subagent depth limit, worker env-isolation, `agents --json`, and `/bg` lifecycle
4. **Compaction** — `--fallback-model` honoring, the 1M-credits clamp-back, and the six-source window resolver
5. **Auto Memory** — team memory stores (`CLAUDE_MEMORY_STORES`) recall and the status-line render

> **Scope honesty.** This is a **focused delta analysis**, not a comprehensive every-module tree. Many other subsystems changed in this same window — Fable 5 (the new flagship model), plan mode, permissions (`Tool(param:value)` rules, auto-mode git/IaC safety), MCP, model-allowlist enforcement, and a very large body of UI/Windows/terminal fixes. Those are **intentionally out of scope** and are named honestly in §8 so a reader knows what this tree does *not* cover.

It complements:

- The five per-module delta trees under `../` — [`30_agent_team/`](../30_agent_team/), [`42_workflow/`](../42_workflow/), [`36_background_agents/`](../36_background_agents/), [`07_compact/`](../07_compact/), [`31_auto_memory/`](../31_auto_memory/)
- The four `symbol_index_*.md` files — [core execution](symbol_index_core_execution.md), [core features](symbol_index_core_features.md), [platform infra](symbol_index_infra_platform.md), [integration infra](symbol_index_infra_integration.md)
- The five per-feature additions tables — `symbol_additions_v2_1_183_*.md` — and the five `cross_validation_report_*.md` logs
- The prior window's narrative — [`../../../claude_code_v_2.1.156/analyze/00_overview/changelog_analysis.md`](../../../claude_code_v_2.1.156/analyze/00_overview/changelog_analysis.md) (v2.1.143 → v2.1.156)

Every factual claim is cited as `cli_inner_pretty.js:<line>`, verified by reading that line in the **v2.1.183** bundle at `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines; build SHA `9d251abd…`, build_time 2026-06-18, bun 1.4.0). Lines tagged `(v2.1.156)` or `(v2.1.88)` are deliberate **before-pictures** read in the prior bundle. Obfuscated names are re-mangled between builds — every v2.1.183 name here was re-derived in the 2.1.183 bundle and **never** carried over by assumption from v2.1.156.

---

## 1. The Window Shape

The window spans **27 version numbers** (2.1.157 … 2.1.183) but **22 published releases**. Five numbers were never published — **.164, .171, .177, .180, .182** are absent from the changelog entirely. The cadence is the same roughly-bi-weekly rhythm as the prior window, but the *shape* is different. Where the v2.1.143→156 window was bimodal ("stabilize the runway, then land the plane 2.1.154"), this window is a **sequence of mid-sized inflection points punctuated by long reliability tails** — each big change ships, then two or three patch releases harden it.

| Version | Items | Theme (focus-feature lens in **bold**) |
|---------|------:|----------------------------------------|
| 2.1.157 | ~35 | `.claude/skills` plugin auto-load, **`workflowKeywordTriggerEnabled` /config setting** introduced, worktree/`claude agents` polish |
| 2.1.158 | 1 | Auto mode on Bedrock/Vertex/Foundry for Opus 4.7/4.8 (opt-in) |
| 2.1.159 | 0 | Internal infrastructure only |
| 2.1.160 | ~25 | **ultracode rename** (`workflow`→`ultracode` keyword + violet shimmer), `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` removed, ultracode hidden on non-xhigh models |
| 2.1.161 | ~25 | OTEL resource attributes, parallel-tool independence, **Workflow `isolation:"worktree"` bg-edit fix**, secret redaction in `mcp` printing |
| 2.1.162 | ~30 | **`agents --json` gains `waitingFor`**, `/effort` persist confirm, slash-command click-to-fill, MCP timeout floor fix |
| 2.1.163 | ~20 | Stop/SubagentStop `additionalContext`, stdio MCP `CLAUDE_CODE_SESSION_ID` on resume, `$TMPDIR`-only-sandboxed regression fix |
| 2.1.165 | 0 | Bug fixes / reliability |
| 2.1.166 | ~25 | **`fallbackModel` setting (up to three) + `--fallback-model` for interactive**, deny-rule glob position, cross-session `SendMessage` deauthorization, default-thinking disable controls |
| 2.1.167/168 | 0 | Bug fixes / reliability |
| 2.1.169 | ~30 | **`agents --json` `--all` + `id`/`state`**, `/cd`, `--safe-mode`, `disableBundledSkills`, **`/workflows` opens immediately**, managed-MCP enforcement fixes |
| 2.1.170 | 2 | **Claude Fable 5** (the new Mythos-class flagship) ships; VS Code transcript-save fix |
| 2.1.172 | ~30 | **Nested subagents (5 levels deep)**, **1M-without-credits auto-compact-back**, **team memory recall in remote sessions**, AST-walk workflow determinism, Bedrock region precedence |
| 2.1.173 | 2 | Fable 5 `[1m]`-suffix normalization, Windows sandbox warning fix |
| 2.1.174 | ~15 | **Workflow `agent()` per-agent attribution**, `/model` picker family rows, bg-session provider-env inheritance fix, VS Code usage attribution |
| 2.1.175 | 1 | `enforceAvailableModels` managed setting |
| 2.1.176 | ~20 | Session titles in conversation language, `availableModels` alias-redirect hardening, **Fable-5-without-Opus-4.8 auto-mode fallback**, bg-respawn robustness |
| 2.1.178 | ~25 | **THE AGENT-TEAM REDESIGN** (`TeamCreate`/`TeamDelete` removed, implicit session team, Agent-tool spawn), **`Tool(param:value)` permission rules**, **compaction honors `--fallback-model`**, **explicit-phrase workflow keyword**, subagent transcript/backgrounding fixes |
| 2.1.179 | ~9 | Mid-stream connection-drop preservation, WSL2 scroll, sandbox glob description-size fix |
| 2.1.181 | ~40 | **Foreground subagents share the 5-level depth limit**, **worker provider-env isolation (4-pass scrub)**, **`Improved N memories` no longer lists files outside verbose**, `/config key=value`, Bun 1.4, `CLAUDE_CLIENT_PRESENCE_FILE`, many startup/TUI reliability fixes |
| 2.1.183 | ~17 | Auto-mode destructive-git/IaC safety, deprecated-model warning, scheduled-task-vs-keyboard classification, **teammate background-task survival**, **tmux teammate slow-rc/keystroke-leak fix**, thinking-disabled 400 fix |

**The big inflection points, in order:**

- **2.1.160 — the ultracode rename.** The Dynamic Workflows trigger keyword changes from `workflow(s)` to `ultracode`, gains a dedicated violet shimmer, and is gated behind the new `workflowKeywordTriggerEnabled` /config setting. The single-word keyword changes; the underlying VM/gate/journal does not.
- **2.1.170 — Fable 5.** A new Mythos-class flagship model. Out of this tree's scope (it is a model launch, not one of the five features), but it is the *cause* of several in-scope fixes — the 2.1.176 auto-mode-falls-back-to-Opus and the compaction fallback-chain both exist because a session can now run a model that an org may not have enabled.
- **2.1.172 — the reliability watershed.** Three of this tree's headline fixes land in one release: nested subagents (with the depth-limit machinery), the 1M-context-without-credits auto-compact-back, and team-memory recall in remote sessions. This is the densest in-scope release in the window.
- **2.1.178 — the agent-team redesign + the second wave.** The implicit-team rewrite removes two tools and re-routes teammate spawning onto the Agent tool. The same release makes compaction honor `--fallback-model` and re-frames the workflow keyword to explicit phrases.
- **2.1.181 / 2.1.183 — reliability hardening.** 2.1.181 extends the nested-subagent depth limit to foreground subagents (parity), rebuilds the worker env-isolation scrub into four passes, and trims the memory status line. 2.1.183 closes the teammate background-task-survival and tmux-spawn races.

The through-line is **maturation under load**: every one of the five features was *introduced* in or before 2.1.156, and this window is about making each one trustworthy enough to lean on. Nested subagents needed a depth cap before they could ship; team memory needed remote-session recall; compaction needed a fallback chain once Fable 5 made model unavailability common; the agent-team prototype needed to shed its two setup tools and its tmux keystroke races.

---

## 2. Agent Team — The v2.1.178 Implicit-Team Redesign

**What changed:** In v2.1.156, an agent team was an *explicit* construct. The model called `TeamCreate` to write a team file and seat a leader, then spawned teammates by passing a resolved `team_name` to the Agent tool, and called `TeamDelete` to tear it down. In v2.1.178 the team becomes **implicit and session-scoped** — created automatically at startup, with the Agent tool's `name` parameter as the sole spawn surface. The two lifecycle tools are gone.

### 2.1 The removal is real and total

`grep -c "TeamCreate"` and `grep -c "TeamDelete"` both return **0** over the whole v2.1.183 bundle; the asset tools directory has no `TeamCreate.md`/`TeamDelete.md`; and the telemetry events `tengu_team_created`/`tengu_team_deleted` are likewise absent (all three present in v2.1.156). In v2.1.156 these were the tools `rd`/`Oo` with defs `Th_`/`vh_` — `TeamCreate.call` wrote the team file, task dir, and leader membership; `TeamDelete.call` refused while teammates were active.

### 2.2 The implicit team, created at startup

**What it does:** Every session that has agent-swarms enabled now boots with a one-member team named after the session id, so a teammate spawn never has to set one up first.

**How it works:**

The CLI bootstrap gates the call (`cli_inner_pretty.js:693472`):

```javascript
if (Sl() && !xr() && !a.agentId)
  try {
    let { initializeSessionTeam: Jn } = await Promise.resolve().then(...);
    c = await Jn();
  } catch (Jn) { De(Jn); }
```

`isAgentSwarmsEnabled` (`Sl`, `cli_inner_pretty.js:293832`) is the byte-identical master gate from v2.1.156 (only the obfuscated name changed from `R7`): `(CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env || --agent-teams flag) && tengu_amber_flint growthbook`. The three-part bootstrap predicate is the design: `Sl()` (swarms on), `!xr()` (not a background worker), and `!a.agentId` (this process is the *main* session, not itself a spawned teammate). Only a real interactive leader initializes a team.

`initializeSessionTeam` (`j3f`, `cli_inner_pretty.js:682765`) derives the team name as `session-<sessionId[:8]>` via `sessionTeamName` (`xic`, `cli_inner_pretty.js:682752`: `` return `${B3f}-${e.slice(0, 8)}` `` with `B3f = "session"`), writes a team file whose only member is `team-lead` (`np`, `cli_inner_pretty.js:362636`) with `tmuxPaneId:"leader"` and `backendType:"in-process"`, and returns a `teamContext` carrying that roster.

**Why this approach:** The explicit-team model had a discoverability and friction problem — the model had to *know* to call `TeamCreate`, invent a team name, and remember to delete it. Making the team implicit means a single Agent-tool call with a `name` is the *entire* teammate API: zero setup, zero teardown, one team per session by construction. The deterministic `session-<id[:8]>` name removes the only remaining decision (what to call the team). The trade-off is that you can no longer have *multiple* named teams in one session — but the changelog's framing ("the session has a single implicit team") shows that was an accepted simplification, not a regression: the multi-team capability was a complexity the product decided it did not need.

### 2.3 The Agent tool becomes the spawner — routing rewrite

The routing *key* changed. In v2.1.156 the Agent tool routed to the teammate-spawn path when a `team_name` parameter resolved to a real team (`if (G && z)`, where `G = oN_({team_name: A}, L)`). In v2.1.183 it routes on the session's implicit `teamContext` existing (`cli_inner_pretty.js:423547`+):

```javascript
let _ = Sl() ? A.teamContext : void 0,
    b = !!c.teammateContext;
...
let L = x && I;                  // L = is-fork
if (_ && s && !L) {              // swarm on + name given + not a fork ⇒ TEAMMATE
  let ye = await cqa({ name: s, prompt: e, description: n, use_splitpane: !0, ... }, c);
  return (Le("subagent_launch"), { data: { status: "teammate_spawned", ... } });
}
```

The `team_name` parameter survives in the schema (`IDp`, `cli_inner_pretty.js:423446`) but is documented **"Deprecated; ignored. The session has a single implicit team."** The `name` parameter gains a refine that rejects the reserved name `"main"` (`LY`, `cli_inner_pretty.js:362512`) — because `SendMessage({to:"main"})` now routes to the main conversation for background subagents. New flat-roster guards throw `"Teammates cannot spawn other teammates"` (`b = !!c.teammateContext`) and `"In-process teammates cannot spawn background agents."`

**Key insight:** The spawn *backend* did not change — the BackendRegistry two-mode split (in-process AsyncLocalStorage runner vs cross-process tmux/iTerm2 pane), the file mailbox algorithm (`writeToMailbox` `$A`, `cli_inner_pretty.js:365950`, byte-identical to v2.1.156 `aA`), the teammate system-prompt addendum (`Rdo`, `cli_inner_pretty.js:420705`, verbatim), and the permission bridge (`eDp`, `cli_inner_pretty.js:420713`) are all carryover. The redesign is *purely* at the control surface: what makes a team exist (startup, not a tool call) and how a spawn is triggered (`teamContext` presence, not a `team_name` argument). This is the "compose, don't build" discipline — the entire mature spawn/mailbox/permission machinery was kept; only the two entry tools were deleted and the gate condition flipped.

### 2.4 The tmux spawn fix — `send-keys` → `respawn-pane`

**What it does:** Fixes two real bugs at once — teammate panes failing to launch under a slow rc-file shell, and keystrokes typed during spawn leaking into the new pane.

**How it works:** In v2.1.156, `TmuxBackend.sendCommandToPane` launched a teammate by *typing* the command into the pane's interactive shell and pressing Enter (`send-keys -t <pane> <cmd> Enter`, `cli_inner_pretty.js:380567` v2.1.156). v2.1.183 creates the pane running a benign holding process `cat` (`Gke`, `cli_inner_pretty.js:362642`) via `split-window … -- cat`, then **replaces** that process with the real command using `respawn-pane` (`a3n`, `cli_inner_pretty.js:421874`):

```javascript
async function a3n(e, t, n) {
  await Fn(B8, [...e, "set-option", "-p", "-t", t, "remain-on-exit", "failed"]);
  let r = await Fn(B8, [...e, "respawn-pane", "-k", "-t", t, "--", n]);  // exec, not typing
  if (r.code !== 0) throw new sF(`Failed to send command to pane ${t}: ${r.stderr}`);
}
```

**Why this approach:** Typing into an interactive shell has two structural hazards. First, the typed line *races shell readiness* — if `.zshrc`/`.bashrc` is still initializing, the keystrokes are dropped or mangled (the slow-rc-init bug). Second, the pane's shell is a *shared input target*, so any keystroke the user happens to type during spawn lands on the same line (the keystroke-leak bug). `respawn-pane … -- <cmd>` makes the command the pane's *process* directly — there is no interactive shell line to race or to capture stray input. The `cat` holding process exists only so the pane is alive and respawnable before the real command is ready; `remain-on-exit failed` keeps a crashed teammate pane visible for diagnosis. Replacing a typed-command convention with a process-exec is the same "narrow to a provably-correct mechanism" instinct that runs through the whole codebase.

### 2.5 Background-task survival when a teammate finishes its turn

The 2.1.183 fix "background tasks started by a teammate being killed when the teammate finishes a turn" wires the children's keepalive into the teammate's rest decision. The task-notification builder `G4e` (`cli_inner_pretty.js:445827`+) now gates re-rest on the owner still being alive (`(od(m) && YR(m) && !xr()) || (od(m) && m.status === "running")`) and adds an explicit `<note>`: *"A task-notification fires each time this agent comes to rest with no live background children of its own."* The keepalive predicate `YR` (`cli_inner_pretty.js:445754`) keeps a *completed* teammate task "parked" while `keepaliveReasons` (`Lye`, `cli_inner_pretty.js:445750`) is non-empty — i.e. while it still owns live background children. The keepalive infrastructure pre-existed v2.1.156; the delta is that a teammate's turn-end now consults child keepalive before tearing down, and the in-process runner (`sDp`) clears only the *per-turn* abort controller, not the children. (The exact one-line behavior diff was hard to isolate from the surrounding refactor; this is the strongest fingerprint — see the cross-validation report's open-question note.)

Coordinator mode is **live and expanded** (`getCoordinatorSystemPrompt` `bvd`, `cli_inner_pretty.js:221940`, gated by `CLAUDE_CODE_COORDINATOR_MODE` via `oI`/`z9`): cross-session peers via `bridge:`/`uds:` socket addresses, and a `StopAgent`-style worker-stop tool `uP` now appear in its prompt — a substantial expansion over the v2.1.156 re-introduction.

Cross-link: [`../30_agent_team/`](../30_agent_team/) (README + `implicit_team_and_agent_tool_spawn.md` for the centerpiece, `spawn_backends_and_tmux_fix.md` for the tmux fix, `mailbox_lifecycle_and_sendmessage_delta.md`, `coordinator_and_background_survival.md`). The unchanged mailbox/backend/permission foundation is in [`../../../claude_code_v_2.1.156/analyze/30_agent_team/`](../../../claude_code_v_2.1.156/analyze/30_agent_team/).

---

## 3. Dynamic Workflows — Keyword UX and Correctness Deltas

**What changed:** The Workflow subsystem is **structurally unchanged** v2.1.156 → v2.1.183 — same four-layer enablement gate, same VM runtime, same caps (1000 agents, 180s stall, `min(16, cores-2)` concurrency), same SHA-256 resume journal, same `meta` AST parser, same fire-and-forget launch, same subagent prompts. The deltas are concentrated in **the keyword-trigger UX** and a handful of **correctness fixes**. This is the one feature where the headline is "almost nothing changed in the engine" — which is itself worth stating plainly so a reader does not go hunting for a rewrite that isn't there.

### 3.1 The `workflow` → `ultracode` keyword rename (2.1.160)

**What it does:** The single-word trigger keyword that opts a turn into multi-agent orchestration changes from `workflow(s)` to `ultracode`.

**How it works:** The runtime matcher `findUltracodeKeyword` (`yho`, `cli_inner_pretty.js:464261`) is `hho(e, "ultracode")`, where the generic masking matcher `hho` (`cli_inner_pretty.js:464214`) is byte-for-byte the v2.1.156 `Bg6` logic (it masks code-spans/quotes before a `\b<kw>\b` scan). Before: v2.1.156 `pg6` matched `"workflows?"`. The system-reminder text, the tool-description opt-in form, and the footer hint all switched from `"workflow"`/`"workflows"` to `"ultracode"`. The telemetry event name (`tengu_workflow_keyword`) and the reminder *type* string (`workflow_keyword_request`) are unchanged — only the human-facing keyword moved.

**Why this approach:** The changelog frames 2.1.160 as "the word *workflow* no longer triggers a run." The mechanism behind that framing is simple and clever: the runtime keyword is now `ultracode`, **a word nobody types incidentally**. The old `workflow` keyword false-triggered whenever a user merely *mentioned* workflows; switching to a coined term means incidental mentions stop firing the reminder, while users who deliberately want orchestration type the new keyword. This is cheaper and more robust than trying to build a phrase classifier (see the framing trap in §3.2).

### 3.2 Framing trap — the 2.1.178 "explicit phrases" change is description-only

The 2.1.178 changelog says the keyword "triggers only on explicit phrases like *run a workflow* or *workflow:*". **There is no runtime regex** that matches those phrases. `grep -nF "run a workflow"` returns only hits inside the tool description (`gdo`, `cli_inner_pretty.js:418177`). The runtime detector is still the single-word `hho(e, "ultracode")`. What 2.1.178 actually changed is the *model-facing description* — it added `"use a workflow"` to the natural-language opt-in list the model is taught to recognize. The reason "any mention of workflow" no longer triggers is entirely §3.1's keyword rename, not a new phrase detector. A reader should not go looking for phrase-matching code; it does not exist.

Similarly, the 2.1.160 "ultracode not offered on models that can't run xhigh" behavior is **not** a delta — `isUltracodeOption-allowed` (`T4`, `cli_inner_pretty.js:148898`: `Pw() && (e === void 0 || hTe(e))`) is functionally identical to v2.1.156 `Vx`. That guard already shipped in 2.1.156.

### 3.3 The violet shimmer and the new /config gate (2.1.157/2.1.160)

The keyword highlight changed from the shared rainbow shimmer (used by ultrathink/ultraplan) to a dedicated **violet** highlight: `color:"autoAccept"` (rgb 135,0,255, `cli_inner_pretty.js:154110`) + `shimmerColor:"autoAcceptShimmer"` (rgb 208,180,255, `cli_inner_pretty.js:154111`). Both surfaces — the model-facing reminder and the input highlight — are now gated by a **new setting**, `workflowKeywordTriggerEnabled` (default `true`), read by `Jyn` (`cli_inner_pretty.js:148797`: `return mk()?.settings.workflowKeywordTriggerEnabled ?? !0`). The reminder injection adds `&& Jyn()` and the highlight memo `ji` becomes `Pw() && Jyn() ? yho(Tf) : []`. In v2.1.156 this setting did not exist (`grep -c workflowKeywordTriggerEnabled` = 0). The /config toggle is labeled "Ultracode keyword trigger."

### 3.4 Correctness fixes

- **Determinism check rewritten regex → AST walk (2.1.172).** The `Date.now()`/`Math.random()`/`new Date()` ban in `validateInput` was a raw regex over the script body in v2.1.156, which false-rejected scripts that merely *mentioned* those calls inside a string literal or comment. v2.1.183 `determinismCheck` (`rWa`, `cli_inner_pretty.js:416439`) parses with Acorn and walks `MemberExpression`/`NewExpression` nodes, so only a *real* `Date.now()` call trips errorCode 4 — a mention in a prompt string is fine. This matters because workflow scripts routinely contain prose prompts that talk about randomness or timestamps.
- **Per-agent attribution context (2.1.174).** Workflow subagents now spawn with `override:{agentId, agentContext: Dt}` (`cli_inner_pretty.js:417152`+), where `Dt` carries `parentAgentId`, `depth: Gz(parent)+1`, `parentSessionId`, and `subagentName`. v2.1.156 passed only `override:{agentId}`, so subagents lacked the per-agent attribution headers the changelog restored.
- **`/workflows` opens immediately (2.1.169).** The slash command (`jmf`, `cli_inner_pretty.js:562632`) gained `immediate:!0` so it opens without waiting for the in-progress turn to settle.
- **Tool-definition hardening.** New `errorCode 7` (server-fallback retraction, `r5a`, `cli_inner_pretty.js:419415`) returned when the dispatch is retracted by a server fallback and the input may be truncated; two new output fields `taskType` (`local_workflow`/`remote_agent`) and `workflowName`; and a per-agent `effort` opt in the `agent()` DSL signature.

Cross-link: [`../42_workflow/`](../42_workflow/) (README + `ultracode_keyword_trigger_delta.md`, `tool_definition_fixes_delta.md`, `runtime_fixes_delta.md`). The unchanged engine (gate, VM, caps, journal, `meta` parser, subagent prompts) is documented in [`../../../claude_code_v_2.1.156/analyze/42_workflow/`](../../../claude_code_v_2.1.156/analyze/42_workflow/).

---

## 4. Background Agents — Nested Subagents, Env Isolation, and Lifecycle

**What changed:** The headline is **nested subagents with a 5-level depth limit shared by foreground and background subagents** (2.1.172 + 2.1.181). The supporting deltas are a four-pass worker env-isolation scrub (2.1.181), a substantially reworked `agents --json` (2.1.162/2.1.169), and lifecycle refinements to the `/bg` surface and daemon retire/respawn.

### 4.1 The 5-level depth limit

**What it does:** Lets any subagent spawn its own subagents up to five levels deep, with foreground and background subagents enforcing one shared cap.

**How it works:**

The constant is `SUBAGENT_DEPTH_LIMIT` (`v1i = 5`, `cli_inner_pretty.js:221800`). Every agent context carries a `depth` field, read by `getAgentDepth` (`Gz`, `cli_inner_pretty.js:103152`):

```javascript
function Gz(e) {
  if (e.agentType === "main") return 0;
  return e.depth ?? 0;
}
```

The gate lives in the universal tool filter `cio` (`cli_inner_pretty.js:371188`+):

```javascript
function cio({ tools: e, isBuiltIn: t, isAsync: n = !1, isTeammate: r = !1, permissionMode: o, agentDepth: s = 0 }) {
  return e.filter((i) => {
    ...
    if (Rc(i, vs)) return s < v1i;          // ← Agent tool only when depth < 5
    if (n && !UPt.has(i.name)) { ... return !1; }
    return !0;
  });
}
```

The depth is threaded by the resolved-tools builder `bte` (`cli_inner_pretty.js:371230`) and called by the subagent runner with the parent's depth: `bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext))` (`cli_inner_pretty.js:387154`). At every spawn surface — regular Agent-tool spawn (`z = Gz(c.agentContext)+1`, `cli_inner_pretty.js:423722`), resume, built-in fork, and workflow agent (`depth: Gz(ue)+1`, `cli_inner_pretty.js:417155`) — the child's depth is `parent+1`, and the value is persisted into the task registry as `spawnDepth` (`Xut`, `cli_inner_pretty.js:446073`).

**Why this approach (and why it is enforced by tool-removal):** The crucial design decision is that the `Agent`-tool line *precedes* the `if (n && …)` async block in `cio`. That ordering makes the depth gate **independent of async/background/team** — it applies identically whether the subagent is foreground or background. Because the *same* `bte(...Gz(ctx))` chokepoint builds the toolset for both, the limit is genuinely shared, which is exactly the 2.1.181 fix ("foreground subagents now respect the same 5-level depth limit as background subagents"). And the limit is enforced by **removing the Agent tool** from the deepest agent's toolset rather than by a runtime refusal — there is no "max depth" error string, because a level-5 agent simply never *sees* the Agent tool. This is cleaner than a runtime check: the model cannot attempt-and-fail a spawn it was never offered, so there is no error to handle, log, or retry.

**Before-picture (v2.1.156):** `grep -c agentDepth` and `grep -c spawnDepth` both = 0 — the concept did not exist. The v2.1.156 filter `uE6` (`cli_inner_pretty.js:278956` v2.1.156) had no `agentDepth` parameter and let an *async* subagent keep the Agent tool **only inside team mode** (`if (R7() && mG())`). So before this window, ordinary subagents could not recursively spawn at all, and there was no depth concept to cap.

### 4.2 Worker env-isolation — the four-pass provider-auth scrub (2.1.181)

**What it does:** Stops a backgrounded daemon worker from silently inheriting the dispatching session's provider credentials and config.

**How it works:** The worker-env builder `_Fl` (`cli_inner_pretty.js:594705`; scrub body 595802-595858) now runs *four* scrub passes where v2.1.156's `Eq9` ran one:

1. `jLo` — terminal/SSH/session vars (the old `Y7q` list, extended)
2. `GLo` (`cli_inner_pretty.js:595849`) — **provider auth** (Bedrock/Vertex/Foundry auth sets + `ANTHROPIC_CUSTOM_HEADERS`/`ANTHROPIC_UNIX_SOCKET`/`CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`)
3. `JLt` prefix scrub (`VERTEX_REGION_CLAUDE_*`)
4. a `WLo(env)` host-auth branch that deletes the token set `XLt` (`ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, `AWS_BEARER_TOKEN_BEDROCK`, `ANTHROPIC_FOUNDRY_API_KEY`, …)

**Why this approach:** v2.1.156's single scrub list (`Y7q`) contained *only* terminal/SSH/session vars — **no provider auth at all**. A bg worker therefore inherited the full `ANTHROPIC_*`/Bedrock/Vertex/Foundry environment of whatever shell launched the daemon, which is exactly the "401 Invalid bearer token" / "background sessions inheriting another session's provider env" cluster the changelog (2.1.174/2.1.178/2.1.181) tracks. The fix is to scrub provider auth *by default* and only re-pass it when explicitly present in `e.env` — the same "deny then explicitly allow" discipline the permission system uses. A worker should start from a clean credential slate and be handed exactly the auth its dispatch specifies, never ambient-inherit it.

### 4.3 `agents --json` rework and `/bg` lifecycle

`printAgentsJson` (`aGf`, `cli_inner_pretty.js:691275`) now **merges three sources** — live processes, on-disk job states, and shorts — so just-dispatched and blocked bg jobs with no live process appear (the 2.1.169 fix). It adds `id`, `state` (`working`/`blocked`/`done`/`failed`/`stopped` via `lGf`), `waitingFor` (2.1.162), and a `--all` flag (`cli_inner_pretty.js:695321`) to include completed sessions. v2.1.156's `bBz` printed only live processes with no `id`/`state`/`waitingFor`.

The `/bg` (`/background`) command surface is **structurally carryover** but fully re-mangled: the export module `OH9`→`JMl` (`cli_inner_pretty.js:566833`), the same `{spawnBackgroundFork: sKn, deriveBackgroundSeed: iKn, call: lgf}` triple, the same def→call→seed→confirm-UI→fork-over-dispatcher flow. The daemon retire/respawn lifecycle is likewise mostly carryover; the genuine v2.1.183 deltas are the `respawnIfIdleStale` `trigger` parameter (with its added `session_cron`-inflight check), the `gFl` "detritus" inflight allowlist + `detritusOnly` carve-out on `retireIfSettled`, and the `prewarm` respawn loop (`tengu_bg_prewarm_per_sweep`). (The background docs **corrected the scout dossier** here: the `cliVersion`-equality "not-stale" short-circuit and the `session_cron`/`routine` *retire* guards were independently re-verified as **carryover**, present identically in v2.1.156 — NOT new-in-window mechanisms.)

Cross-link: [`../36_background_agents/`](../36_background_agents/) (`nested_subagent_depth_limit.md`, `worker_env_isolation_2181.md`, `agents_json_surface_2169.md`, `bg_command_surface_and_retire_delta.md`).

---

## 5. Compaction — Fallback Model, 1M Clamp, and the Six-Source Resolver

**What changed:** The compaction subsystem keeps the same five-strategy / threshold-ladder design, but four real deltas land in this window. (Note: the entire threshold ladder shifted from ~line 423864 in v2.1.156 to ~line 226818 in v2.1.183, and the dispatcher from ~423130 to ~460676 — a massive line-shift that makes every citation here independently re-derived.)

### 5.1 Compaction honors `--fallback-model` (2.1.178, headline)

**What it does:** The summarize call that compaction makes — previously hardcoded to the main-loop model with a single pass — now walks the configured fallback-model chain on overload or model-availability errors.

**How it works:** The summarize function `del` (`cli_inner_pretty.js:461088`) wraps its stream in a `while(!0)` fallback loop:

```javascript
let h = ICn(A, r.options.fallbackModel),     // build chain from --fallback-model / settings.fallbackModel
    y = [A, ...h.filter((b) => b !== A)],     // [primary, ...fallbacks]
    _ = 0;
while (!0) {
  let b = y[_];
  ... model: b, fallbackModel: y[_ + 1] ...   // next link threaded into the request
  catch (C) {
    if (C instanceof vF && y[_ + 1] !== void 0) {
      G("tengu_model_fallback_triggered", { ..., query_source: Qe("compact") });
      _++; continue;                           // advance and retry
    }
    ...
  }
}
```

`ICn` (`cli_inner_pretty.js:461078`) normalizes the `fallbackModel` setting (string or array) into a deduped chain; `vF` is the model-fallback error class. The cache-prefix fork is also fallback-aware now (`cli_inner_pretty.js:461118`).

**Why this approach:** Before this window, the compaction summarize call (`_X4`, v2.1.156) was a *single* streaming call with `model: mainLoopModel` hardcoded and a bare `throw Error(...)` on failure — `grep -F "fallbackModel"` over its body returns 0. So when the primary model was overloaded or (post-Fable-5) unavailable to an org, compaction would *fail outright*, and a session that needed to compact could get permanently stuck. The 2.1.170 Fable 5 launch made model-unavailability a real, common case (an org might run Fable 5 as default but not have Opus 4.8 enabled). Threading the existing `--fallback-model` chain (added for interactive sessions in 2.1.166) into the compaction path means a stuck-and-overloaded session can compact on a fallback model rather than wedging. The `query_source:"compact"` telemetry tag lets the team distinguish compaction fallbacks from interactive ones. This is a clean example of a feature added for one path (2.1.166 interactive fallback) being reused to close a gap in another (2.1.178 compaction).

### 5.2 1M-context-without-credits auto-compact-back (2.1.172)

**What it does:** A session running 1M context but without the usage credits to pay for it is automatically re-windowed to the standard 200k limit and compacted back under it, instead of getting permanently stuck.

**How it works:** A 429 error matching "Usage/Extra credits required for long context" (`Fwn`, `cli_inner_pretty.js:229606`) trips a new session flag `longContext1mCreditsBlocked` (setter `Wtr`, `cli_inner_pretty.js:2968`; getter `N8e`, `cli_inner_pretty.js:2965`) and emits `tengu_1m_credits_clamp_activated`. The model hard-cap `tH` (`cli_inner_pretty.js:134105`) then clamps the window down:

```javascript
function tH(e, t) {
  let n = Ati();
  if (n !== void 0) return n;
  if (ARr(e, t)) return jQ;       // ← NEW: clamp 1M model down to 200k
  return gti(e, t);
}
function ARr(e, t) {              // NEW
  return N8e() && Ati() === void 0 && gti(e, t) > jQ;   // jQ = 200000
}
```

**Why this approach:** v2.1.156's hard-cap (`Ov`) had no `ARr` branch — a 1M model resolved to `1e6` *forever*, so a session that hit the credits wall on 1M would never compact below 1M and would stay wedged (the "permanently stuck" bug). Rather than failing the turn, the fix flips a session flag on the *specific* error and lets the existing threshold ladder do the rest — once `tH` returns 200k, the whole resolver/threshold pipeline naturally compacts the session under the standard limit. The clamp is *reactive* (only after a real 429), gated on the absence of an explicit `MAX_CONTEXT_TOKENS` override, and self-contained in a session flag, so it never penalizes a session that *can* pay for 1M.

### 5.3 The window resolver grew from four sources to six (2.1.172)

The window resolver `z2` (`cli_inner_pretty.js:226875`) inserts two new sources into v2.1.156's `env > settings > experiment > auto` chain: **`clientdata`** (via `ywd`, `cli_inner_pretty.js:226865`, reading a `rowan_thicket` clientdata blob) and **`model-default`** (the 1M→200k clamp for `claude-sonnet-4-6`/`claude-opus-4-6` and any `ARr`-clamped 1M model). The precedence is now `env > settings > clientdata > experiment > model-default > auto`. The clientdata source lets the server push a per-model window without a client deploy (the same monotone-rollout discipline seen across the codebase); the model-default source is what makes the §5.2 clamp flow through the resolver as a first-class window source.

### 5.4 Precompute arm table, remote-reactive gate, prefix-overflow pre-check

Three smaller additions: a richer precompute "arm table" (`tengu_amber_moleskin`, `bqr`, `cli_inner_pretty.js:226920`) with per-window-size repl/sdk fractions (replacing the v2.1.156 scalar-only `tengu_amber_rokovoko`); a remote-reactive gate (`S7`, `cli_inner_pretty.js:226751`) that lets remote sessions run reactive compaction when `tengu_reactive_compact_remote` is on; and a dispatcher prefix-overflow pre-check (`Yjp`, `cli_inner_pretty.js:461484`) that emits `tengu_auto_compact_prefix_overflow` when the fixed cache prefix already exceeds the threshold (compaction physically cannot help). All three are 0-count in v2.1.156. The micro-compact `context-hint-2026-04-09` beta string is **unchanged** (no beta bump).

Cross-link: [`../07_compact/`](../07_compact/) (`fallback_model_in_compaction.md`, `one_million_credits_clamp.md`, `window_resolver_six_sources.md`, `dispatcher_delta.md`). The unchanged threshold formulas, breakers, reactive lane, micro-compact, and partial `/rewind` compactor are in [`../../../claude_code_v_2.1.156/analyze/07_compact/`](../../../claude_code_v_2.1.156/analyze/07_compact/).

---

## 6. Auto Memory — Team Memory Stores Recall

**What changed:** The **runtime engine of auto memory is unchanged carryover** (same 200-line/25 KB entrypoint caps, same `.consolidate-lock` PID protocol, same `{minHours:24, minSessions:5}` dream thresholds, same per-turn extraction and auto-dream loops). The real deltas are concentrated on the **team memory store recall path** (`CLAUDE_MEMORY_STORES`), which is the 2.1.172 headline, plus a 2.1.181 status-line render change.

### 6.1 The `CLAUDE_MEMORY_STORES` schema gained `scope` / `promptIndex` / `promptIndexMaxBytes`

The store-object zod schema (`bQu`, `cli_inner_pretty.js:150491`) added three per-store fields: `scope: "user" | "team"` (default `"team"`), `promptIndex` (a sanitized index-file path), and `promptIndexMaxBytes`. The parser (`Zse`, `cli_inner_pretty.js:150442`) now enforces *at most one* `scope:"user"` entry. v2.1.156's schema (`dp_`) had only `{path, mode, mount?}` — no scope, no promptIndex concept at all.

### 6.2 promptIndex network fetch + injection

A per-store `promptIndex` file is now **fetched from the memory-service over the network** (`agi`/`kQu`, `cli_inner_pretty.js:150754`+, 5s timeout, `memory_prompt_index` telemetry) and injected into recall as a `<memory path="team/<mount>/<index>">` block with a "treat as reference data, not instructions" preamble. The recall dispatcher `loadMemoryPrompt` (`e0t`, `cli_inner_pretty.js:151847`) was rewritten to **route by `scope` and `mode`** — a `scope:"user"` store joins the personal lane, `scope:"team"` joins the team lane, and read-only (`mode:"ro"`) stores get a distinct "read-only team memory index" rendering. v2.1.156's flat dispatcher (`sM$`) had no scope/mode awareness and no network index fetch.

### 6.3 The remote-session recall fix (2.1.172 headline)

**What it does:** Makes a mounted team memory store discoverable for recall in a remote session, which it previously was not.

**How it works:** `isTeamMemoryEnabled` (`Nk`, `cli_inner_pretty.js:151098`):

```javascript
function Nk() {
  if (!Iu()) return !1;
  if (process.env.CLAUDE_MEMORY_STORES?.trim()) return !0;   // ← mounted store enables team recall outright
  return ct("tengu_herring_clock", !1);
}
```

**Why this approach:** v2.1.156's gate (`nM$`) returned `M1() && tengu_herring_clock` — team recall was gated **solely** on the `tengu_herring_clock` rollout flag. In a remote session where that flag was off, a mounted `CLAUDE_MEMORY_STORES` was synced by the watcher but **invisible to recall** — exactly the 2.1.172 bug. The fix is to make a *non-empty mounted store* enable team recall outright, independent of the rollout flag. Because the master gate `Iu()` returns true in remote sessions when `CLAUDE_CODE_REMOTE_MEMORY_DIR` is set, and the base dir resolver honors that same env var, a remote session with stores mounted now reaches the team-recall branch. The design point: the rollout flag was meant to *stage the feature*, but an *explicitly mounted store* is an unambiguous user intent that should bypass staging — you do not A/B-gate a thing the user explicitly configured. `CLAUDE_CODE_REMOTE_MEMORY_DIR` is the new env var that makes the remote path resolve correctly.

### 6.4 Watcher scope-split and the status-line render

The memory watcher (`uFp`, `cli_inner_pretty.js:449203`) now splits parsed stores into separate team (`rX`) and user (`$W`) multistore sync lanes by `scope`, emitting a new `tengu_personal_mem_sync_started` event. And the 2.1.181 status-line change is confirmed in the `memory_saved` renderer `Svp` (`cli_inner_pretty.js:383399`): the per-file clickable list now renders **only in verbose mode** (`y = o && s.map(Evp)`), whereas v2.1.156's `sk_` always showed a truncated file list plus a "+N more files" expandable count. The "Improved/Saved N memories" summary line itself is unchanged.

Cross-link: [`../31_auto_memory/`](../31_auto_memory/) (`team_memory_stores_recall.md`, `status_line_and_misc_delta.md`). The unchanged memdir runtime, extraction subagent, and auto-dream scheduler are in [`../../../claude_code_v_2.1.156/analyze/31_auto_memory/`](../../../claude_code_v_2.1.156/analyze/31_auto_memory/).

---

## 7. Cross-Cutting Patterns Across the Five Features

Reading the five deltas together, several recurring design instincts emerge — the same ones the prior window showed, now applied to maturation rather than launch.

### 7.1 Delete the setup, keep the machinery
The agent-team redesign removed two tools (`TeamCreate`/`TeamDelete`) and an entire parameter-routing concept (`team_name` resolution) while keeping the *entire* mailbox/backend/permission spine intact (§2). The compaction fallback reused the 2.1.166 interactive fallback chain (§5.1). The remote-memory fix reused the existing master gate and watcher (§6.3). The new infrastructure is almost always a small condition flip on top of mature machinery, not a rewrite.

### 7.2 Enforce by capability removal, not runtime refusal
The 5-level depth limit is enforced by *not giving the deepest agent the Agent tool* (§4.1) — there is no error string. This is structurally cleaner than a runtime check: a capability the model never receives cannot be attempted-and-failed, so there is nothing to log, handle, or retry. The same instinct appears in the tmux fix (§2.4): replace a typed-command convention with a process exec, so there is no shell line to race.

### 7.3 Reactive flags over proactive guards
Both the 1M-credits clamp (§5.2) and the compaction fallback (§5.1) are *reactive* — they trip only after a real API error (a 429, a model-fallback error class), flip a flag, and let the existing pipeline do the rest. Nothing penalizes the common case; the correction kicks in exactly when the failure occurs. This is the same "primary path optimistic, reactive path as safety net" structure as the prior window's thinking-signature strip-and-retry.

### 7.4 Explicit configuration bypasses staged rollout
The remote-memory fix (§6.3) makes an *explicitly mounted store* bypass the `tengu_herring_clock` A/B flag, because explicit user configuration is unambiguous intent that should not be A/B-gated. Conversely, where the team *does* want staged control — the new `clientdata` window source (§5.3), the `tengu_amber_moleskin` arm table (§5.4), the `workflowKeywordTriggerEnabled` setting (§3.3) — they add a server-pushable or user-toggleable gate. The principle is consistent: gate what should be staged, honor what the user explicitly set.

### 7.5 Re-mangling discipline
Every obfuscated name in this window is re-minified from v2.1.156. The compaction ladder moved ~197,000 lines; `R7`→`Sl`, `_X4`→`del`, `Ov`→`tH`, `Xl`→`z2`, `bBz`→`aGf`, `OH9`→`JMl`, `sM$`→`e0t`. This is why this tree re-derived every name in the 2.1.183 bundle and never reused a 2.1.156 obfuscated name — a discipline the per-feature cross-validation reports enforce (17 line-precision fails found and fixed across the five features, all transcription drift, no incorrect claims).

---

## 8. The Broader Window — What This Tree Does NOT Cover

This is a five-feature delta tree. Many other things changed in the v2.1.157 → v2.1.183 window and are **intentionally out of scope**. A reader should know they exist and look elsewhere (the upstream [`../../CHANGELOG.md`](../../CHANGELOG.md)) for them:

- **Fable 5 (2.1.170) — the new flagship model.** A Mythos-class model, plus its plumbing: `[1m]`-suffix normalization (2.1.173), the "consuming usage credits" banner (2.1.174), and auto-mode falling back to the best available Opus when an org lacks Opus 4.8 (2.1.176). This is a model launch, parallel to the prior window's Opus 4.8, and is not one of the five features. (It is, however, the *cause* of several in-scope fixes — see §5.1.)
- **Permissions — `Tool(param:value)` rules (2.1.178).** A new permission-rule syntax matching a tool's input parameters with `*` wildcards (`Agent(model:opus)`), plus deny-rule glob position (2.1.166), `WebFetch(domain:*.example.com)` subdomain matching (2.1.172), and the cross-session `SendMessage` deauthorization (2.1.166). Touches the agent-team and background surfaces tangentially but is a permissions-subsystem change.
- **Auto-mode git/IaC safety (2.1.183).** Blocking destructive git (`git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop`, `git commit --amend` on non-agent commits) and `terraform/pulumi/cdk destroy` unless asked. A permission-classifier change, sibling to the prior window's exfiltration hardening.
- **Model-allowlist enforcement.** `enforceAvailableModels` (2.1.175), alias-redirect hardening (2.1.176), and the many `availableModels` fixes (2.1.172).
- **Plan mode, hooks, skills, MCP.** Stop/SubagentStop `additionalContext` (2.1.163), `disableBundledSkills` (2.1.169), nested `.claude/skills` directory-qualified names (2.1.178), managed-MCP enforcement fixes (2.1.169), headless auth-stub tool exposure fix (2.1.183).
- **The very large UI / terminal / Windows / IDE reliability body.** Mid-stream connection-drop preservation, vim-mode cursor/undo, fullscreen TUI corruption under nested-subagent load, WSL2 scrolling, Ghostty/Kitty keyboard protocol, JetBrains synchronized output, clipboard/paste fixes, startup-latency regressions — dozens of items across nearly every release.

These changed in the same window and matter; they are simply not what this tree was scoped to analyze.

---

## 9. Added Settings, Env Vars, and Telemetry (Five Features Only)

This inventory is scoped to the five focus features. It is **not** the full window inventory (see §8). Sources: the verified anchors above, the five `symbol_additions_v2_1_183_*.md` tables, and the asset extracts (`assets/feature_gates.json`, `assets/env_vars.json`).

### New / changed settings keys

| Setting | Version | Feature | Purpose |
|---------|---------|---------|---------|
| `workflowKeywordTriggerEnabled` | 2.1.157 (renamed .160) | Workflow | Gate the ultracode keyword reminder + highlight; default true (`Jyn`, cli_inner_pretty.js:148797) |
| `fallbackModel` (up to three) | 2.1.166 | Compaction | Configure the fallback-model chain compaction now honors (`ICn`, cli_inner_pretty.js:461078) |
| `CLAUDE_MEMORY_STORES` `scope`/`promptIndex`/`promptIndexMaxBytes` fields | ~2.1.172 | Auto Memory | Per-store scope routing + network prompt-index injection (`bQu`, cli_inner_pretty.js:150491) |
| Agent tool `team_name` param | 2.1.178 | Agent Team | Now "Deprecated; ignored" (cli_inner_pretty.js:423458) |
| Agent tool `name` param (reserved `"main"`) | 2.1.178 | Agent Team | Sole teammate-spawn surface; `"main"` reserved for SendMessage routing (cli_inner_pretty.js:362512) |

### New / changed environment variables

| Env Var | Version | Feature | Purpose |
|---------|---------|---------|---------|
| `CLAUDE_CODE_FORK_SUBAGENT` | ~2.1.172 | Background | Subagent fork into the 5-level depth tree |
| `FALLBACK_FOR_ALL_PRIMARY_MODELS` | 2.1.178 | Compaction | Apply the fallback-model chain across all primary models |
| `CLAUDE_CODE_REMOTE_MEMORY_DIR` | 2.1.172 | Auto Memory | Remote-session base dir that makes mounted team stores resolve + recall (the remote-recall fix) |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | (carryover) | Compaction | Highest-precedence (`env`) window source in the six-source resolver |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | (carryover) | Agent Team | Master gate for the implicit-team subsystem (`Sl`, cli_inner_pretty.js:293832) |
| `CLAUDE_CODE_COORDINATOR_MODE` | (carryover, expanded) | Agent Team | Enables the expanded coordinator prompt (cross-session peers, worker-stop tool) |
| `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` | 2.1.178 | Agent Team | One-shot inherited-team-name for a spawned teammate; read then deleted (`F3f`, cli_inner_pretty.js:682756) |
| `CLAUDE_CODE_WORKFLOWS` / `CLAUDE_CODE_DISABLE_WORKFLOWS` | (carryover) | Workflow | Explicit enable/disable in the four-layer gate |

### New telemetry events (by feature)

- **Agent Team:** `tengu_coordinator_mode_switched`, `tengu_coordinator_panel`, `tengu_teammate_mode_changed`, `tengu_teammate_default_model_changed`, `tengu_transcript_input_to_teammate` (master gate: `tengu_amber_flint`). The removed `tengu_team_created`/`tengu_team_deleted` are gone with their tools.
- **Workflow:** keyword events unchanged (`tengu_workflow_keyword`, `_dismissed`, `_restored`); the new /config toggle emits an `ultracodeKeywordTrigger:"on"/"off"` attribute. `tengu_review_workflow_routing` present.
- **Background:** depth threaded into existing `agent_depth` attributes; `tengu_bg_retire_pinned_low_mem`, `tengu_bg_prewarm_per_sweep`, `tengu_bg_dispatch_rescued` (carryover); `tengu_bg_agent_action{action:"stop"}`.
- **Compaction:** `tengu_1m_credits_clamp_activated` (NEW), `tengu_model_fallback_triggered{query_source:"compact"}` (NEW source tag), `tengu_auto_compact_prefix_overflow` (NEW), `tengu_precompute_arm_table_malformed` (NEW), `tengu_reactive_compact_remote` (NEW gate), `tengu_amber_moleskin` (NEW arm table), `tengu_amber_redwood3` (reactive gate). The `context-hint-2026-04-09` beta is unchanged.
- **Auto Memory:** `memory_prompt_index` (NEW, states `unsafe_path`/success/`timeout`/`error`), `tengu_personal_mem_sync_started` (NEW). The team transport events (`tengu_team_mem_multistore_sync`/`_pull`/`_push`/`_config_invalid`), `tengu_marble_lark` (user-store flag), `tengu_herring_clock` (team-recall flag, now bypassed by mounted stores), `tengu_onyx_plover` (dream thresholds) are carryover.

---

## 10. Where to Look for Specifics

- [`../30_agent_team/`](../30_agent_team/) — implicit session team, Agent-tool spawn rewrite, tmux respawn-pane fix, SendMessage delta, coordinator + bg-survival
- [`../42_workflow/`](../42_workflow/) — ultracode keyword/shimmer/setting, AST-walk determinism, errorCode 7, per-agent effort/attribution, `/workflows` immediate
- [`../36_background_agents/`](../36_background_agents/) — 5-level depth limit, 4-pass env-isolation scrub, `agents --json` rework, `/bg` re-mangle + retire/respawn delta
- [`../07_compact/`](../07_compact/) — `--fallback-model` in summarize, 1M-credits clamp-back, six-source window resolver, dispatcher delta
- [`../31_auto_memory/`](../31_auto_memory/) — `CLAUDE_MEMORY_STORES` schema + promptIndex fetch + scope/mode recall routing + remote-recall fix, status-line render
- The four `symbol_index_*.md` files and the five `symbol_additions_v2_1_183_*.md` per-feature tables — obfuscated → readable → location mappings
- The five `cross_validation_report_*.md` files — per-feature adversarial verification logs (agent_team 53P/1F, workflow 47P/2F, background 37P/7F, compact 90P/4F, auto_memory 45P/3F; all fails were line-precision drift, all fixed)
- The scout dossiers (`../_scout_dossier_*.md`) and `../_asset_anchors.md` — verified anchor tables and asset corroboration
- [`../../../claude_code_v_2.1.156/analyze/`](../../../claude_code_v_2.1.156/analyze/) — the prior window; the **unchanged foundations** for all five features (mailbox/backend, workflow VM/journal, bg dispatcher/classifier, compaction ladder, memdir runtime) live there and are linked rather than re-derived here.
