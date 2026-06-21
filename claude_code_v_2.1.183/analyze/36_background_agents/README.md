# 36 — Background Agents (v2.1.183): the nested-subagent depth limit, worker env-isolation, and `agents --json` rework

> Delta module: `36_background_agents/` documents the **v2.1.156 → v2.1.183** change to the background-agents subsystem (the on-demand daemon fleet, the `/bg` (`/background`) slash command, `claude agents`, and — new this round — the cross-cutting nested-subagent depth limit).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Every `cli_inner_pretty.js:<line>` citation below is a **v2.1.183** line unless explicitly tagged as a *(v2.1.156 before-picture)* or *(v2.1.88)*.
> BASELINE (read this for everything unchanged): [`../../../claude_code_v_2.1.156/analyze/36_background_agents/`](../../../claude_code_v_2.1.156/analyze/36_background_agents/README.md).
> Obfuscated names were **re-derived** for v2.1.183 — the bundler re-mangles every build, so a v2.1.156 obf name (`zh8`, `Fwz`, `Eq9`, `Y7q`, `bBz`, `SF`, `uE6`, …) is **never** reused here. Use the anchor list in [§ Related Symbols](#related-symbols) (and the per-feature additions file) as the canonical v2.1.183 map.

---

## TL;DR — one new headline, three reworks, the rest is re-mangled carryover

The background-agents machine documented in the v2.1.156 baseline — the unified dispatcher seam, shell-exec sessions, the four-state classifier engine, the pty-host orphan watchdog, the daemon retire/respawn lifecycle and binary-takeover — is **structurally the same** in v2.1.183. Most of this round's diff is the bundler re-mangling every symbol. There are **four genuine deltas**, in descending order of architectural weight:

1. **NEW: nested subagents with a shared 5-level depth limit** (changelog 2.1.172 + 2.1.181). This is the headline. v2.1.156 had **no notion of agent depth at all** (`grep -c agentDepth` / `grep -c spawnDepth` over the v2.1.156 bundle both = `0`). v2.1.183 introduces a `depth` field on every `agentContext`, increments it `+1` at every spawn surface, threads it as `spawnDepth` into the task registry, and gates the **Agent tool** in the *universal* tool filter: a subagent only keeps the Agent tool when `agentDepth < 5`. Because the same filter chokepoint builds the toolset for foreground *and* background subagents, the limit is genuinely shared — exactly the 2.1.181 fix ("foreground subagents now respect the same 5-level depth limit as background subagents"). Full deep-dive: [`nested_subagent_depth_limit.md`](./nested_subagent_depth_limit.md) (companion doc).

2. **REWORKED: daemon worker env-isolation** (the 2.1.181 `ANTHROPIC_*` provider-env leak fix). The v2.1.156 env builder scrubbed exactly **one** list — pure terminal/SSH/session vars, **no provider auth**. v2.1.183's builder adds two more scrub passes plus a host-auth branch that deletes `ANTHROPIC_API_KEY`/`ANTHROPIC_AUTH_TOKEN`/`CLAUDE_CODE_OAUTH_TOKEN`/Bedrock/Vertex/Foundry tokens, so a backgrounded worker no longer silently inherits the dispatching session's provider credentials. Full deep-dive: [`worker_env_isolation_2181.md`](./worker_env_isolation_2181.md) (companion doc).

3. **REWORKED: `claude agents --json`** (2.1.169 / 2.1.162). v2.1.156 printed only *live processes*. v2.1.183 merges three sources (live procs + on-disk job states + shorts), so just-dispatched/blocked bg jobs with no live process now appear; it adds `id`, `state` (`working`/`blocked`/`done`/`failed`/`stopped`), `waitingFor`, and a new `--all` flag to include completed sessions. Full deep-dive: [`agents_json_surface_2169.md`](./agents_json_surface_2169.md) (companion doc).

4. **RE-MANGLED (shape unchanged): the `/bg` (`/background`) command surface.** Every symbol moved (`zh8`→`sKn`, `Ah8`→`iKn`, `Fwz`→`lgf`, `gwz`→`ugf`, `owz`/`awz`→`hgf`/`ygf`, `Yh8`→`Egf`/`Hgf`, export module `OH9`→`JMl`), but the def → call → seed → confirm-UI → fork-over-the-dispatcher flow is identical. The baseline [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md) remains the authoritative flow analysis; this README re-bases its symbol citations onto v2.1.183 names (see §4 below).

**Confidence:** high for all four deltas (each proved with a before/after read in this doc). Medium-high for the daemon retire/respawn refinements (§5) — they are mostly carryover, with three small additions: the `respawnIfIdleStale` `trigger` parameter (which *also* adds a new `session_cron`-inflight check), the `gFl` "detritus" inflight allowlist + `detritusOnly` carve-out on `retireIfSettled`, and a `prewarm` respawn trigger. (The cliVersion-equality "not-stale" short-circuit and the `retireIfSettled` `session_cron`/`routine` *retire* guards are **carryover**, not additions — see §B.0; the scout dossier mis-listed them as new.) Two micro-fixes from the changelog ("Working forever" 2.1.178; `--bg -cn` name-seeding 2.1.176) **could not be pinned to a single line** and are carried honestly as open questions (§7).

---

## What changed at a glance

| # | Delta | Kind | v2.1.183 anchor | v2.1.156 before | Confidence |
|---|-------|------|-----------------|-----------------|:----------:|
| D1 | Nested subagents + shared **5-level depth limit** (`agentDepth < 5`) | **NEW** (architecture) | `v1i=5` :221800; `Gz` :103152; `cio`/`bte` :371188/:371230 | concept absent (grep=0) | high |
| D2 | Worker **env-isolation**: provider-auth scrub passes + host-auth branch | reworked (security) | `_Fl` :594705 (scrub :594725-594747) | `Eq9` single-pass @559877 | high |
| D3 | `agents --json`: 3-source merge + `id`/`state`/`waitingFor` + `--all` | reworked | `aGf` :691275; `--all` :695321 | `bBz` live-only @642728 | high |
| D4 | `/bg` (`/background`) command surface | re-mangled (shape unchanged) | `sKn`/`iKn`/`lgf`/`ugf`/`hgf` :566834+ | `OH9` export @542679 | high |
| D5 | Daemon retire/respawn: `trigger` param (+`session_cron`-inflight check) + `gFl`/`detritusOnly` allowlist + prewarm loop (cliVersion-equality & cron/routine *retire* guards = carryover, per §B.0) | carryover + small adds | `respawnIfIdleStale` :594895; `retireIfSettled` :594936 | `SF` methods @560029/@560062 | medium-high |

Plus a new env/GrowthBook gate **`CLAUDE_CODE_FORK_SUBAGENT`** (`getForkSubagentSource` `L1i` / gate `y7` `vvd`, `cli_inner_pretty.js:222208-222227`) that turns the fork-subagent feature on; this is *distinct* from the depth limit (which is always enforced by the filter) and governs the fork-message/worktree-notice machinery — see §1 caveat.

---

## 1. D1 — Nested subagents + shared 5-level depth limit (HEADLINE)

This README states the mechanism in summary; the full step-by-step deep-dive (every spawn surface, the team-only before-picture, the tool-removal-vs-refusal design) lives in the companion [`nested_subagent_depth_limit.md`](./nested_subagent_depth_limit.md). The load-bearing facts:

**The constant and the depth reader.** The limit is the literal `5`, declared inline in a var block alongside the tool-name sets used by the filter (`cli_inner_pretty.js:221800`: `v1i = 5,`). The depth reader returns `0` for the main agent and the context's `depth` field (default `0`) otherwise:

```javascript
// ============================================
// getAgentDepth - read the current agent's nesting depth (0 for main)
// Location: cli_inner_pretty.js:103152-103155
// ============================================

// ORIGINAL (for source lookup):
function Gz(e) {
  if (e.agentType === "main") return 0;
  return e.depth ?? 0;
}

// READABLE (for understanding):
function getAgentDepth(agentContext) {
  if (agentContext.agentType === "main") return 0; // main loop is the root, depth 0
  return agentContext.depth ?? 0;                   // child contexts carry their own depth
}

// Mapping: Gz->getAgentDepth, e->agentContext
```

**The enforcement point — the universal tool filter.** The Agent tool is dropped from a subagent's toolset once its depth reaches the cap. Crucially, the gate line **precedes** the async/team block, so it is independent of whether the subagent is async (background) or a teammate:

```javascript
// ============================================
// subagentToolFilter - universal tool filter; Agent tool gated by depth < 5
// Location: cli_inner_pretty.js:371188-371202
// ============================================

// ORIGINAL (for source lookup):
function cio({ tools: e, isBuiltIn: t, isAsync: n = !1, isTeammate: r = !1, permissionMode: o, agentDepth: s = 0 }) {
  return e.filter((i) => {
    if (Lx(i)) return !0;
    if (Rc(i, WM) && o === "plan") return !0;
    if (LCe.has(i.name)) return !1;
    if (!t && T5r.has(i.name)) return !1;
    if (Rc(i, vs)) return s < v1i;          // ← Agent tool only when depth < 5
    if (n && !UPt.has(i.name)) {
      if (Sl() && r && T1i.has(i.name)) return !0;
      return !1;
    }
    return !0;
  });
}

// READABLE (for understanding):
function subagentToolFilter({ tools, isBuiltIn, isAsync = false, isTeammate = false, permissionMode, agentDepth = 0 }) {
  return tools.filter((tool) => {
    if (isAlwaysAllowed(tool)) return true;                              // Lx
    if (matchesToolName(tool, EXIT_PLAN_TOOL) && permissionMode === "plan") return true; // WM
    if (HARD_DENY_SET.has(tool.name)) return false;                     // LCe
    if (!isBuiltIn && BUILTIN_ONLY_SET.has(tool.name)) return false;    // T5r
    if (matchesToolName(tool, AGENT_TOOL_NAME)) return agentDepth < SUBAGENT_DEPTH_LIMIT; // vs < v1i(=5)
    if (isAsync && !ASYNC_ALLOWED_SET.has(tool.name)) {                 // UPt
      if (isAgentSwarmsEnabled() && isTeammate && TEAMMATE_ASYNC_SET.has(tool.name)) return true; // Sl/T1i
      return false;
    }
    return true;
  });
}

// Mapping: cio->subagentToolFilter, vs->AGENT_TOOL_NAME, v1i->SUBAGENT_DEPTH_LIMIT, Rc->matchesToolName,
//          LCe->HARD_DENY_SET, T5r->BUILTIN_ONLY_SET, UPt->ASYNC_ALLOWED_SET, Sl->isAgentSwarmsEnabled,
//          T1i->TEAMMATE_ASYNC_SET, s->agentDepth, n->isAsync, r->isTeammate
```

`AGENT_TOOL_NAME` (obfuscated: `vs`, `cli_inner_pretty.js:149939`) is `"Agent"`; `matchesToolName` (obfuscated: `Rc`, `cli_inner_pretty.js:149965`) is `e.name === t || (e.aliases?.includes(t) ?? !1)`.

**The depth is threaded by the resolved-tools builder.** `bte` (`cli_inner_pretty.js:371230`) takes a trailing `agentDepth` param (`s = 0`) and forwards it into the filter; the subagent runner calls it with the parent's depth via `Gz(parent)` (`cli_inner_pretty.js:387154`): `Ae = y ? f : bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext)).resolvedTools`. So the same `bte(...Gz(ctx))` chokepoint builds the toolset for both async and synchronous subagents — that single seam is **why fg and bg now share one limit**.

**The depth is incremented and stamped at every spawn surface** (all `Gz(parent) + 1`, persisted as `depth` on the child `agentContext` and as `spawnDepth` on the task registry record):

- Regular Agent-tool spawn: `z = Gz(c.agentContext) + 1` (`cli_inner_pretty.js:423722`); stamped `agentDepth: z` (@423825) and `depth: z` on the child context for both the async (@423933) and sync (@423990) branches; telemetry `agent_depth: z` (@423733).
- Resume path: `y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1` (`cli_inner_pretty.js:434085`) — prefers a persisted `spawnDepth` from the saved task, else the parent's depth + 1; stamped `depth: y` (@434205).
- Workflow agent: `depth: Gz(ue) + 1` (`cli_inner_pretty.js:417154`) — the same `agentContext` object the workflow module documents as B6 (see [`../42_workflow/README.md`](../42_workflow/README.md) §B6).
- Fork (built-in) path: `d = Gz(t.agentContext)` (`cli_inner_pretty.js:473587`) — **note: no `+1` here** (a fork inherits the parent's depth, it is not a child level). Stamped `spawnDepth: d` (@473592) and `depth: d` (@473612). This asymmetry is intentional: a *fork* is a sibling continuation, not a nested child, so it does not consume a depth level.

**The task registry persists it.** `registerLocalAgentTask` (obfuscated: `Xut`, `cli_inner_pretty.js:446073`) writes `spawnDepth: r` into the `local_agent` task record (alongside `keepaliveReasons: new Set()`), so a backgrounded subagent's depth survives into resume.

```javascript
// ============================================
// registerLocalAgentTask - persist a local (bg) subagent task, carrying spawnDepth
// Location: cli_inner_pretty.js:446073-446111
// ============================================

// ORIGINAL (for source lookup):
function Xut({ agentId: e, ownerAgentId: t, parentAgentId: n, spawnDepth: r, description: o, prompt: s, selectedAgent: i, taskRegistry: a, parentAbortController: l, toolUseId: c, cwd: u }) {
  AWe(e, mP(If(e)));
  let d = l ? ZO(l) : Xl(),
    p = { ...c0(e, "local_agent", o, c), type: "local_agent", status: "running", agentId: e, ownerAgentId: t, parentAgentId: n, spawnDepth: r, prompt: s, cwd: u, selectedAgent: i, agentType: i.agentType ?? "general-purpose", abortController: d, retrieved: !1, lastReportedToolCount: 0, lastReportedTokenCount: 0, isBackgrounded: !0, isIdle: !1, pendingMessages: [], retain: !1, diskLoaded: !1, keepaliveReasons: new Set() };
  return (a.register(p), p);
}

// READABLE (for understanding):
function registerLocalAgentTask({ agentId, ownerAgentId, parentAgentId, spawnDepth, description, prompt, selectedAgent, taskRegistry, parentAbortController, toolUseId, cwd }) {
  registerAgentTranscript(agentId, /* ... */);                 // AWe
  let abortController = parentAbortController ? linkAbort(parentAbortController) : newAbort();
  let task = {
    ...baseTaskFields(agentId, "local_agent", description, toolUseId), // c0
    type: "local_agent", status: "running",
    agentId, ownerAgentId, parentAgentId,
    spawnDepth,                                                 // ← the persisted nesting depth
    prompt, cwd, selectedAgent,
    agentType: selectedAgent.agentType ?? "general-purpose",
    abortController, retrieved: false,
    lastReportedToolCount: 0, lastReportedTokenCount: 0,
    isBackgrounded: true, isIdle: false,
    pendingMessages: [], retain: false, diskLoaded: false,
    keepaliveReasons: new Set(),
  };
  return (taskRegistry.register(task), task);
}

// Mapping: Xut->registerLocalAgentTask, r->spawnDepth, a->taskRegistry, i->selectedAgent
```

**Before-picture (v2.1.156).** There was no depth concept. The equivalent universal filter `uE6` (`cli_inner_pretty.js:278956`, *v2.1.156 before-picture*) had signature `{ tools, isBuiltIn, isAsync, permissionMode }` — **no `agentDepth`** — and let the Agent tool (`sq`) through to an async subagent **only inside team mode**:

```javascript
// (v2.1.156 before-picture) cli_inner_pretty.js:278956-278971
function uE6({ tools: H, isBuiltIn: $, isAsync: q = !1, permissionMode: K }) {
  return H.filter((_) => {
    if (eP(_)) return !0;
    if (h1(_, wv) && K === "plan") return !0;
    if (xwH.has(_.name)) return !1;
    if (!$ && wG6.has(_.name)) return !1;
    if (q && !xJ$.has(_.name)) {     // q = isAsync
      if (R7() && mG()) {            // R7 = isAgentTeamsEnabled, mG = team active
        if (h1(_, sq)) return !0;    // Agent tool allowed ONLY in team mode
        if (U57.has(_.name)) return !0;
      }
      return !1;
    }
    return !0;
  });
}
```

So in v2.1.156, an ordinary (non-team) async subagent **could not** spawn its own subagents — the only path that kept the Agent tool was team mode, and there was **no cap**. The v2.1.183 change moves the gate from a *team-only boolean* to a *universal `depth < 5`*: any subagent (fg or bg) can now spawn its own subagents up to 5 levels deep.

**Why this approach (summary; full analysis in the companion doc).** Enforcing the limit by **tool removal** (the deepest agent simply does not receive the Agent tool) rather than a runtime refusal means there is no "too deep" error string anywhere on the Agent path — `grep` for "too deep"/"maximum depth" over the spawn path returns nothing. This is structurally clean: a tool the model never sees cannot be called, so depth is enforced *before* the model gets a turn, not after a failed attempt. The single `bte(...Gz(ctx))` chokepoint guarantees fg and bg share the constant; the 2.1.181 changelog line is literally "foreground now flows through the same filter."

> **Caveat (carried honestly).** The depth-gate constant `v1i = 5` is always enforced by the filter regardless of any env var. The separate env/GrowthBook gate `CLAUDE_CODE_FORK_SUBAGENT` (`getForkSubagentSource` `L1i`, `vvd` @222208) toggles the *fork-subagent* feature surface (the `buildForkedMessages`/`buildWorktreeNotice`/`FORK_SUBAGENT_TYPE` machinery exported @222200-222227), not the depth cap itself. The interaction between "is fork-subagent enabled" and "is depth < 5" was not exhaustively traced; treat the depth cap as the always-on invariant and `CLAUDE_CODE_FORK_SUBAGENT` as the fork-feature rollout switch. (medium confidence on the exact division of labour.)

---

## 2. D2 — Worker env-isolation: the provider-auth leak fix (2.1.181)

Summary here; full deep-dive (every scrub list, the host-auth predicate, the exec-mode carryover) in the companion [`worker_env_isolation_2181.md`](./worker_env_isolation_2181.md). The decisive contrast is **one scrub pass → four**.

**v2.1.183 — the builder `_Fl`** (`cli_inner_pretty.js:594705`) constructs the worker env, then runs *four* scrub passes plus a host-auth branch:

```javascript
// ============================================
// buildWorkerEnv - assemble + scrub the backgrounded worker's environment
// Location: cli_inner_pretty.js:594705-594748
// ============================================

// ORIGINAL (for source lookup):
function _Fl(e, t, n, r, o) {
  let s = { ...process.env },
    i = { ...s, ...(n && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: n }), ...(Kt() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }), ...e.env,
      CLAUDE_CODE_SESSION_KIND: "bg", CLAUDE_BG_BACKEND: "daemon", CLAUDE_ENABLE_STREAM_WATCHDOG: "1",
      CLAUDE_BG_SOURCE: e.source, CLAUDE_JOB_DIR: t,
      CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short,
      CLAUDE_BG_RENDEZVOUS_SOCK: r, FORCE_COLOR: "3", COLORTERM: "truecolor", BROWSER: "true" };
  if (process.env.CLAUDE_CONFIG_DIR) i.CLAUDE_CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR;
  if (e.isolation === "worktree") i.CLAUDE_BG_ISOLATION = "worktree";
  for (let a of jLo) if (!e.env?.[a]) delete i[a];                                                  // (1) terminal/session
  for (let a of GLo) if (!e.env?.[a]) delete i[a];                                                  // (2) NEW: provider auth/config
  for (let a of Object.keys(i)) if (JLt.some((l) => a.startsWith(l)) && !e.env?.[a]) delete i[a];   // (3) NEW: VERTEX_REGION_CLAUDE_*
  if (WLo(s)) { for (let l of XLt) delete i[l]; let a = s.CLAUDE_CODE_HOST_AUTH_ENV_VAR; if (a) delete i[a]; } // (4) NEW: host-auth tokens
  else if (s.ANTHROPIC_BASE_URL) delete i.ANTHROPIC_AUTH_TOKEN;
  if (o) ((i.CLAUDE_BG_RV_AUTH = o.rvAuth), (i.CLAUDE_BG_PTY_AUTH = o.ptyAuth));
  if (n) delete i.CLAUDE_CODE_OAUTH_TOKEN;
  if (e.launch.mode === "exec") { /* exec-mode CLAUDE_*/OTEL_* purge — carried over from v2.1.156 */ }
  return i;
}

// READABLE (for understanding):
function buildWorkerEnv(dispatch, jobDir, authSnapshotPath, rendezvousSock, socketTokens) {
  let hostEnv = { ...process.env };
  let env = { ...hostEnv, /* ...bg session markers..., */ ...dispatch.env /* explicit re-passes win */ };
  // ...
  for (let k of TERMINAL_SESSION_SCRUB) if (!dispatch.env?.[k]) delete env[k];     // (1) jLo
  for (let k of PROVIDER_AUTH_SCRUB)   if (!dispatch.env?.[k]) delete env[k];     // (2) GLo  — the leak fix
  for (let k of Object.keys(env))                                                 // (3) JLt prefix scrub
    if (VERTEX_REGION_PREFIXES.some((p) => k.startsWith(p)) && !dispatch.env?.[k]) delete env[k];
  if (isHostManagedAuth(hostEnv)) {                                               // (4) WLo
    for (let k of HOST_AUTH_TOKEN_SET) delete env[k];                            // XLt
    let custom = hostEnv.CLAUDE_CODE_HOST_AUTH_ENV_VAR; if (custom) delete env[custom];
  } else if (hostEnv.ANTHROPIC_BASE_URL) delete env.ANTHROPIC_AUTH_TOKEN;
  // ...rv/pty auth re-key, oauth scrub, exec-mode purge (carryover)...
  return env;
}

// Mapping: _Fl->buildWorkerEnv, jLo->TERMINAL_SESSION_SCRUB, GLo->PROVIDER_AUTH_SCRUB,
//          JLt->VERTEX_REGION_PREFIXES, WLo->isHostManagedAuth, XLt->HOST_AUTH_TOKEN_SET,
//          e->dispatch, s->hostEnv, i->env
```

The scrub lists:
- `PROVIDER_AUTH_SCRUB` (obfuscated: `GLo`, `cli_inner_pretty.js:595849`) = `[...k3r, ...YLt, ...C3r, ...I3r, "ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_UNIX_SOCKET", "CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST", "CLAUDE_CODE_HOST_AUTH_ENV_VAR"]` — the union of the provider auth/config var lists.
- `HOST_AUTH_TOKEN_SET` (obfuscated: `XLt`, `cli_inner_pretty.js:191672`) = `["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN", "AWS_BEARER_TOKEN_BEDROCK", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_AWS_API_KEY", "ANTHROPIC_BEDROCK_MANTLE_API_KEY"]`.
- `VERTEX_REGION_PREFIXES` (obfuscated: `JLt`, `cli_inner_pretty.js:191730`) = `["VERTEX_REGION_CLAUDE_"]`.
- `isHostManagedAuth` (obfuscated: `WLo`, `cli_inner_pretty.js:594777`) = `!!e.ANTHROPIC_UNIX_SOCKET || st(e.CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST) || !!e.CLAUDE_CODE_HOST_AUTH_ENV_VAR` — true when the *host* (e.g. an IDE/SDK harness) injects auth, in which case the worker must not carry the resolved tokens.

**Before-picture (v2.1.156) — `Eq9`** (`cli_inner_pretty.js:559877`, *v2.1.156 before-picture*) had **one** scrub loop and no provider auth at all:

```javascript
// (v2.1.156 before-picture) cli_inner_pretty.js:559895-559896
for (let z of Y7q) if (!H.env?.[z]) delete _[z];   // single pass — terminal/session only
if (q) delete _.CLAUDE_CODE_OAUTH_TOKEN;
```

`Y7q` (`cli_inner_pretty.js:560861`, *v2.1.156 before-picture*) is a pure terminal/SSH/session list (`TERM_PROGRAM`, `SSH_TTY`, `TMUX`, `ITERM_SESSION_ID`, …) — **no `ANTHROPIC_*`, Bedrock, Vertex, or Foundry vars**. So a v2.1.156 bg worker inherited the dispatching session's full provider env — the exact leak the 2.1.181 changelog calls out. The terminal/session list itself was also broadened in v2.1.183 (`jLo` adds `CLAUDE_BG_RV_AUTH`, `CLAUDE_BG_PTY_AUTH`, `CLAUDE_BG_SOCKET_TOKENS_PATH`, `CLAUDE_CODE_CHILD_SESSION`, `CLAUDE_AX_SCREEN_READER`, `ANTHROPIC_MODEL`, `SSH_CLIENT`), but the headline is pass (2): the new `GLo` provider-auth scrub.

**Why this approach.** Worker env is built by **deny-by-scrub with an explicit re-pass escape hatch** (`if (!dispatch.env?.[k]) delete …`): every dangerous var is deleted *unless* the dispatch explicitly re-supplied it via `e.env`. That inverts the trust model — instead of trying to enumerate what is safe to forward, the builder forwards `process.env` wholesale and then deletes the known-sensitive classes, so a newly-added provider var only needs to be appended to one of `GLo`/`XLt`/`JLt` to be covered everywhere. The host-auth branch (`WLo`) is the subtle part: when the provider is *host-managed* (Unix-socket broker, or a host-named auth env var), the resolved token in `process.env` is a transient secret the worker should re-fetch from the host, not carry — so it is deleted unconditionally. The exec-mode `CLAUDE_*`/`OTEL_*` purge below it is **byte-identical** to v2.1.156 and is **not a delta** (it is the shell-exec session's belt-and-braces purge; link [`shell_exec_sessions.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md)).

---

## 3. D3 — `claude agents --json`: 3-source merge + `id`/`state`/`waitingFor` + `--all` (2.1.169 / 2.1.162)

Summary here; full deep-dive in the companion [`agents_json_surface_2169.md`](./agents_json_surface_2169.md). The builder went from "iterate live processes" to "merge three views of the fleet."

**v2.1.183 — `printAgentsJson` `aGf`** (`cli_inner_pretty.js:691275`) merges live procs (`m4e()`), on-disk job states (`QK()`), and shorts (`zzn()`), iterates the disk states, and for each emits the new `id`/`state`/`waitingFor` fields:

```javascript
// ============================================
// printAgentsJson - merge live procs + disk job states + shorts into the JSON view
// Location: cli_inner_pretty.js:691275-691333
// ============================================

// ORIGINAL (for source lookup):
async function aGf(e, t) {
  let n = e ? await UE(Lgt.resolve(e)) : void 0;
  function r(d) { if (!n) return !0; let p = Lgt.relative(n, d); return p.split(/[/\\]/, 1)[0] !== ".." && !Lgt.isAbsolute(p); }
  let [o, s, i] = await Promise.all([m4e(), QK(), zzn()]),
    a = new Map();
  for (let d of o) if (d.kind === "bg" && d.jobId) a.set(d.jobId, d);
  let l = new Set(i.shorts);
  for (let d of a.keys()) l.add(d);
  let c = [], u = new Set();
  for (let d of rDt(s, l)) {
    let p = a.get(d.id);
    if (p) u.add(p.pid);
    if (!r(Uwe(d.state))) continue;
    let f = lGf(d.state, p?.status);
    if (!t && !p && f !== "working" && f !== "blocked") continue;   // ← --all gate
    let m = vcc(p?.name ?? d.state.name ?? zc(d.state.intent));
    c.push({ ...(p && { pid: p.pid }), id: d.id, cwd: p?.cwd ?? d.state.cwd, kind: "background",
      startedAt: p?.startedAt ?? Date.parse(d.state.createdAt), sessionId: p?.sessionId ?? d.state.sessionId,
      ...(m && { name: m }), ...(p?.status && { status: Tcc(p.status) }),
      ...(p?.status === "waiting" && p.waitingFor && { waitingFor: p.waitingFor }), state: f });
  }
  for (let d of o) { /* …append live interactive/bg procs not already covered… */ }
  (c.sort((d, p) => d.startedAt - p.startedAt), await APe(Re(c, null, 2) + "\n"), Le("cli_agents_json"));
}

// READABLE (for understanding):
async function printAgentsJson(cwdFilter, includeAll) {
  let scopeRoot = cwdFilter ? await realpath(resolve(cwdFilter)) : undefined;
  let inScope = (dir) => !scopeRoot || isInside(scopeRoot, dir);
  let [liveProcs, diskStates, shorts] = await Promise.all([listLiveProcs(), listJobStates(), listShorts()]);
  let liveByJobId = new Map();
  for (let p of liveProcs) if (p.kind === "bg" && p.jobId) liveByJobId.set(p.jobId, p);
  let knownShorts = new Set(shorts.shorts);
  for (let id of liveByJobId.keys()) knownShorts.add(id);
  let out = [], coveredPids = new Set();
  for (let job of joinStatesWithShorts(diskStates, knownShorts)) {      // rDt
    let proc = liveByJobId.get(job.id);
    if (proc) coveredPids.add(proc.pid);
    if (!inScope(jobCwd(job.state))) continue;
    let state = jobToViewState(job.state, proc?.status);               // lGf
    // Without --all: hide finished/idle jobs (only show working/blocked).
    if (!includeAll && !proc && state !== "working" && state !== "blocked") continue;
    let name = sanitizeName(proc?.name ?? job.state.name ?? deriveIntentName(job.state.intent));
    out.push({ ...(proc && { pid: proc.pid }), id: job.id, /* …cwd/startedAt/sessionId/name/status… */
      ...(proc?.status === "waiting" && proc.waitingFor && { waitingFor: proc.waitingFor }), state });
  }
  // …append any live procs (interactive or bg) not already covered by a disk job…
  out.sort((a, b) => a.startedAt - b.startedAt);
  await writeStdout(JSON.stringify(out, null, 2) + "\n");
}

// Mapping: aGf->printAgentsJson, t->includeAll, m4e->listLiveProcs, QK->listJobStates, zzn->listShorts,
//          rDt->joinStatesWithShorts, lGf->jobToViewState, vcc->sanitizeName, Tcc->normalizeStatus
```

The state mapper folds `(jobState, liveStatus)` into one of five terminal-aware values:

```javascript
// ============================================
// jobToViewState - derive the agents-json `state` from disk state + live status
// Location: cli_inner_pretty.js:691342-691348
// ============================================

// ORIGINAL (for source lookup):
function lGf(e, t) {
  if (t === "busy") return "working";
  let n = Bie(e.state);
  if (ph(e) && !(n === "success" && jFe(e))) return n === "success" ? "done" : n === "failure" ? "failed" : "stopped";
  if (e.tempo === "blocked" || t === "waiting") return "blocked";
  return "working";
}

// READABLE (for understanding):
function jobToViewState(jobState, liveStatus) {
  if (liveStatus === "busy") return "working";              // a live, busy proc is always "working"
  let phase = classifyPhase(jobState.state);                // Bie -> success/failure/...
  if (isTerminal(jobState) && !(phase === "success" && stillRunning(jobState)))  // ph / jFe
    return phase === "success" ? "done" : phase === "failure" ? "failed" : "stopped";
  if (jobState.tempo === "blocked" || liveStatus === "waiting") return "blocked";
  return "working";
}

// Mapping: lGf->jobToViewState, e->jobState, t->liveStatus, Bie->classifyPhase, ph->isTerminal, jFe->stillRunning
```

The `--all` flag is wired in the command handler `agentsCommandHandler` (obfuscated: `cGf`, `cli_inner_pretty.js:691363`): `await t(e.cwd, e.all === !0)`, and declared on the commander chain (`cli_inner_pretty.js:695321`): `.option("--all", "With --json: include completed sessions (the full agent view list)")`.

**Before-picture (v2.1.156) — `bBz`** (`cli_inner_pretty.js:642728`, *v2.1.156 before-picture*) iterated **only** the live-process list `qSH()` and emitted `{ pid, cwd, kind, startedAt, sessionId, name, status }` where `status ∈ {idle, waiting, busy}` — **no `id`, no `state`, no `waitingFor`, no `--all`**. A just-dispatched or blocked bg job with no live process was *invisible* (the 2.1.169 bug). The v2.1.156 command def (`cli_inner_pretty.js:646306`, *before-picture*) declared only `--json` ("Print **live** sessions"), with no `--all`.

**Why this approach.** The bug was a category error: the JSON view treated "agent" as "OS process," but a bg job has a *lifecycle on disk* (dispatched → working → blocked → done) that outlives any single worker process. Merging the three sources (live procs keyed by `jobId`, the on-disk `state`, the `shorts` registry) makes the JSON reflect the *job*, not the *process*; the `coveredPids` set dedupes so a job with a live worker is emitted once (from the disk side, enriched with the live pid/status). The `--all` default-hide of finished/idle jobs keeps the common scripting case (`agents --json | jq '.[] | select(.state=="blocked")'`) terse, while `--all` exposes the full audit list. The five-state mapper exists so a scripting consumer can branch on a *stable* vocabulary instead of the internal `(state, tempo, status)` triple.

---

## 4. D4 — `/bg` (`/background`) command surface — full re-derivation (carryover shape, re-mangled)

The `/background` (`/bg`) flow is **structurally identical** to v2.1.156 — this is a re-mangle, not a redesign. The authoritative end-to-end analysis (the def → call → seed → confirm-UI → fork flow, the three call-guards, the reverse-scan seed deriver, the auto-confirm-when-idle UI, the full `tengu_background*` telemetry family, and the 2.1.88 cross-validation) remains the baseline [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md). This section **re-bases its symbol citations onto v2.1.183 names** so the baseline doc stays usable, and shows the two snippets that prove the shape is unchanged.

**The export module and command def.** v2.1.156's `OH9` export (`X$(OH9, { spawnBackgroundFork: () => zh8, deriveBackgroundSeed: () => Ah8, call: () => Fwz })`, *before-picture* @542679) is now `JMl` with the same triple:

```javascript
// ============================================
// /background command surface - export triple + local-jsx command def
// Location: cli_inner_pretty.js:566833 (export), 567140 (def)
// ============================================

// ORIGINAL (for source lookup):
gt(JMl, { spawnBackgroundFork: () => sKn, deriveBackgroundSeed: () => iKn, call: () => lgf });
// ...
hgf = {
  type: "local-jsx", name: "background", aliases: ["bg"],
  description: "Send this session to the background and free the terminal",
  argumentHint: "[prompt]", immediate: (e) => !e.trim(), isEnabled: () => !0,
  load: () => Promise.resolve().then(() => (Cxo(), JMl)),
};
ygf = hgf;

// READABLE (for understanding):
exportModule(backgroundModule, { spawnBackgroundFork: () => spawnBackgroundFork, deriveBackgroundSeed: () => deriveBackgroundSeed, call: () => backgroundCall });
// ...
backgroundCommandDef = {
  type: "local-jsx", name: "background", aliases: ["bg"],
  description: "Send this session to the background and free the terminal",
  argumentHint: "[prompt]",
  immediate: (input) => !input.trim(),   // run immediately only when no prompt arg was typed
  isEnabled: () => true,
  load: () => lazyLoadBackgroundModule(),
};

// Mapping: JMl->backgroundModule, sKn->spawnBackgroundFork, iKn->deriveBackgroundSeed, lgf->backgroundCall,
//          hgf/ygf->backgroundCommandDef
// v2.1.156 before-picture @542679/@542943: OH9 export; owz/awz def (same shape)
```

**The call handler and its three guards.** v2.1.156's `Fwz` is now `lgf` (`cli_inner_pretty.js:567091`), with byte-equivalent guards (already-bg → `tengu_background_already_bg`; persistence-off; empty-seed) before rendering the confirm UI:

```javascript
// ============================================
// backgroundCall - the /bg call handler: 3 guards, then render the confirm UI
// Location: cli_inner_pretty.js:567091-567107
// ============================================

// ORIGINAL (for source lookup):
lgf = async (e, t, n) => {
  if (yi()) return (G("tengu_background_already_bg", {}), e(), Gye(), null);
  if (dV()) return (e("Cannot background — session persistence is disabled, so the forked job would have nothing to resume."), null);
  let r = (n ?? "").trim(),
    o = iKn(t.messages, r);
  if (o === null) return (e("Nothing to background yet — send a message first."), null);
  return R_e.createElement(ugf, { onDone: e, prompt: r, seed: o, messages: t.messages, isMidTurn: t.isMidTurn ?? !1 });
};

// READABLE (for understanding):
backgroundCall = async (onDone, ctx, promptArg) => {
  if (isBackgroundSession()) { emit("tengu_background_already_bg"); onDone(); showAlreadyBgHint(); return null; } // yi/Gye
  if (isPersistenceDisabled())                                                                                    // dV
    return (onDone("Cannot background — session persistence is disabled, so the forked job would have nothing to resume."), null);
  let prompt = (promptArg ?? "").trim();
  let seed = deriveBackgroundSeed(ctx.messages, prompt);                                                          // iKn
  if (seed === null) return (onDone("Nothing to background yet — send a message first."), null);
  return createElement(BackgroundForkPrompt, { onDone, prompt, seed, messages: ctx.messages, isMidTurn: ctx.isMidTurn ?? false }); // ugf
};

// Mapping: lgf->backgroundCall, yi->isBackgroundSession, dV->isPersistenceDisabled, iKn->deriveBackgroundSeed,
//          ugf->BackgroundForkPrompt, Gye->showAlreadyBgHint, e->onDone, t->ctx, n->promptArg
// v2.1.156 before-picture @542895: Fwz with the same three guards
```

**The fork itself (`spawnBackgroundFork` `sKn`, `cli_inner_pretty.js:566834`)** still builds the `--resume <id> --fork-session [--reply-on-resume] …` argv and dispatches through the unified dispatcher (now `PX`, the re-mangled `ol`), with the identical on-failure-with-`left_arrow` `state:"failed"` "press Enter to retry" placeholder, the `tengu_background_spawn_failed`/`tengu_background` telemetry, and the async auto-naming via `Nwe(…,"auto")`. The argv head is verbatim-equivalent: `[...(b !== null ? ["--resume", b, "--fork-session"] : []), ...(c?.replyOnResume ? ["--reply-on-resume"] : []), …]` then `PX(S, c?.providedSessionId, "repl", y?.worktreePath ?? Ar(), {…worktree handoff…}, c?.extraEnv)` (`cli_inner_pretty.js:566849-566877`). Because the structure is unchanged, the dual-version `spawnBackgroundFork` walk in the baseline doc still applies — only the names move.

**Re-based symbol map for the baseline `background_slash_command.md`** (use these when reading the v2.1.156 doc against the v2.1.183 bundle):

- `spawnBackgroundFork`: `zh8` → `sKn` (`cli_inner_pretty.js:566834`)
- `deriveBackgroundSeed`: `Ah8` → `iKn` (`cli_inner_pretty.js:566927`) — reverse transcript scan → `{intent, name, nameSource, detail}` (verified @566927-566956)
- `BackgroundForkPrompt` (confirm UI): `gwz` → `ugf` (`cli_inner_pretty.js:566957`) — auto-confirm when idle; once-only fork effect; `tengu_background_fork`
- `call` handler: `Fwz` → `lgf` (`cli_inner_pretty.js:567091`)
- command def (`local-jsx`): `owz`/`awz` → `hgf`/`ygf` (`cli_inner_pretty.js:567140`)
- export module: `OH9` → `JMl` (`cli_inner_pretty.js:566833`)
- `/stop` (self bg stop): `Yh8` → command defs `Egf`/`Hgf` (`cli_inner_pretty.js:567204+`), impl `aKn` (`cli_inner_pretty.js:567155`) writes `state:"stopped"` + `tengu_bg_agent_action{action:"stop"}` (verified @567155-567175)

The `/stop` impl, re-derived (it writes a terminal `stopped` state to the bg job on disk and exits the session):

```javascript
// ============================================
// stopSelfSession - the /stop command's worker: write state:"stopped", emit telemetry, exit
// Location: cli_inner_pretty.js:567155-567176
// ============================================

// ORIGINAL (for source lookup):
async function aKn(e) {
  G("tengu_bg_agent_action", { action: Qe("stop"), source: Ne(e), jobSessionId: Nr(xt()) });
  let t = _gf();
  if (yi() && t) {
    let n = new Date().toISOString(), r = await fa(t);
    if (r && !ph(r))
      await Rp(t, { ...r, state: "stopped", detail: "stopped from session", tempo: "idle", needs: void 0, block: void 0, inFlight: void 0, updatedAt: n, firstTerminalAt: r.firstTerminalAt ?? n }).catch(xA);
    if (edn()) process.stdout.write(oue("Session stopped."));
  }
  return (Le("job_stop_self"), $i(0, "prompt_input_exit", { suppressResumeHint: !0 }));
}

// READABLE (for understanding):
async function stopSelfSession(source) {
  emit("tengu_bg_agent_action", { action: "stop", source, jobSessionId: redact(getSessionId()) });
  let jobDir = getJobDir();                                       // _gf = process.env.CLAUDE_JOB_DIR
  if (isBackgroundSession() && jobDir) {                          // yi
    let now = new Date().toISOString();
    let state = await readJobState(jobDir);                       // fa
    if (state && !isTerminal(state))                              // ph
      await writeJobState(jobDir, { ...state, state: "stopped", detail: "stopped from session",
        tempo: "idle", needs: undefined, block: undefined, inFlight: undefined,
        updatedAt: now, firstTerminalAt: state.firstTerminalAt ?? now }).catch(logErr);
    if (shouldPrintStopHint()) process.stdout.write(formatStopped("Session stopped."));
  }
  return (markComplete("job_stop_self"), exitProcess(0, "prompt_input_exit", { suppressResumeHint: true }));
}

// Mapping: aKn->stopSelfSession, _gf->getJobDir, yi->isBackgroundSession, fa->readJobState, ph->isTerminal,
//          Rp->writeJobState, $i->exitProcess, e->source
```

**Why nothing here is re-documented beyond re-basing.** The flow's *design* (auto-confirm only when idle, fork-over-the-dispatcher with conditional worktree handoff, reverse-scan seed derivation) was fully analysed at the baseline; re-deriving it would duplicate ~100 KB of proven analysis for zero new insight. The only thing a reader needs to use the baseline against v2.1.183 is the name map above.

---

## 5. D5 — Daemon retire/respawn lifecycle: trigger param + detritus allowlist + prewarm

Mostly carryover from the v2.1.156 [`worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md) design (pinned guard, broadened settled predicate, bridge grace, exec exclusion, low-mem pinned-shed `tengu_bg_retire_pinned_low_mem`). The v2.1.183 worker-handle methods `respawnIfIdleStale` (`cli_inner_pretty.js:594895`) and `retireIfSettled` (`cli_inner_pretty.js:594936`) keep that shape.

> **Dossier correction (verified body-for-body — see [`bg_command_surface_and_retire_delta.md`](./bg_command_surface_and_retire_delta.md) §B.0).** Two things the scout dossier and an earlier draft of this README listed as v2.1.183 additions are actually **CARRYOVER**, present identically in v2.1.156: (1) the **cliVersion-equality "not-stale" short-circuit** in `respawnIfIdleStale` (v2.1.156 `cli_inner_pretty.js:560035-560047`; only the constant-folded `VERSION` literal moved with the build), and (2) the **`session_cron`/`routine` inflight guards in `retireIfSettled`** (v2.1.156 `cli_inner_pretty.js:560119-560120`). They are NOT deltas. The genuine deltas are the three below.

**The genuine deltas — three additions:**

**(a) `respawnIfIdleStale` gains a `trigger` parameter and *also* checks `session_cron` inflight.** The new `trigger = "sweep"` argument tags whether the respawn came from the sweep or the prewarm loop. New here (vs v2.1.156) is that `respawnIfIdleStale` *also* treats `o.includes("session_cron")` as inflight (`cli_inner_pretty.js:594922`), so a worker with a pending cron fire is not respawned out from under it. (The **cliVersion-equality** short-circuit shown below is **carryover**, not a delta — it is reproduced here only to show the unchanged guard the new `session_cron` check sits beside; the guard *skips* respawn — `return { respawned:!1, reason:"not-stale" }` — when the version is absent OR **equal** to the current `2.1.183`:)

```javascript
// ============================================
// respawnIfIdleStale (excerpt) - version-equality "not-stale" short-circuit
// Location: cli_inner_pretty.js:594900-594913
// ============================================

// ORIGINAL (for source lookup):
if (!this.record.cliVersion ||
    this.record.cliVersion === { /* build-info object */ VERSION: "2.1.183", /* ... */ }.VERSION)
  return { respawned: !1, reason: "not-stale" };

// READABLE (for understanding):
// Only an UPGRADE makes a worker "stale": skip respawn when the worker's recorded
// CLI version is missing OR already equals the daemon's current version (2.1.183).
if (!this.record.cliVersion || this.record.cliVersion === CURRENT_VERSION)
  return { respawned: false, reason: "not-stale" };

// Mapping: this.record.cliVersion->recorded worker version; the inlined {...}.VERSION->CURRENT_VERSION ("2.1.183")
```

The same equality short-circuit appears in the prewarm sweep (`cli_inner_pretty.js:697266-697278`), which `continue`s past any worker whose version matches. **Net effect:** respawn fires only on a real binary upgrade (version mismatch), never as a no-op self-respawn. This cliVersion-equality guard is **carryover** (identical in v2.1.156 `cli_inner_pretty.js:560035-560047` — see the §B.0 correction above); only the constant-folded `VERSION` literal moved with the build. (The inlined build-info object confirms the bundle is `2.1.183`, build `9d251ab…`, time `2026-06-18T23:04:10Z`.) What is genuinely new at this site is the added `session_cron`-inflight check (a) above.

**(b) A `gFl` "detritus" inflight allowlist + `detritusOnly` carve-out on `retireIfSettled`.** `retireIfSettled` adds a `detritusOnly` branch driven by the `gFl` allowlist so that workers whose only remaining inflight work is "detritus" (cleanup) become eviction-eligible. The `session_cron`/`routine` *retire* guards it sits next to (`if (s.includes("session_cron")) return { retired:!1, reason:"session-cron" }` / `if (r.routine) return { retired:!1, reason:"routine" }`, `cli_inner_pretty.js:594996-594997`) are **carryover** — present identically in v2.1.156 (`cli_inner_pretty.js:560119-560120`); they are NOT a v2.1.183 addition.

**(c) A `prewarm` respawn trigger + `tengu_bg_attach_upgrade` gate.** The supervisor tick (`cli_inner_pretty.js:697255-697282`) adds a prewarm loop that respawns up to `tengu_bg_prewarm_per_sweep` (default 3) non-pinned, version-mismatched, idle workers with `respawnIfIdleStale(void 0, "prewarm")` — keeping the warm-spare pool on the current binary. The low-mem last-resort pinned-shed (`tengu_bg_retire_pinned_low_mem`, `cli_inner_pretty.js:697251`) and the rest of the tick are carryover.

**Before-picture (v2.1.156).** The `SF` handle's `retireIfSettled` (@560062) / `respawnIfIdleStale` (@560029) and the supervisor tick (@647839) had the same pinned/settled/bridge/low-mem design — **and already had** the cliVersion-equality stale check and the `session_cron`/`routine` *retire* guards (both carryover, per §B.0). The v2.1.183 deltas are the `trigger` parameter (with its new `respawnIfIdleStale` `session_cron`-inflight check), the `gFl` detritus allowlist + `detritusOnly` carve-out, and the prewarm loop. **Document only these three deltas; link the baseline for everything else.**

---

## What CARRIES OVER UNCHANGED (link the v2.1.156 baseline — do NOT re-derive)

The subsystem's spine is the same algorithm with re-mangled names. To avoid re-deriving proven material, this tree **links** the v2.1.156 baseline for:

- **The unified dispatcher seam** (v2.1.156 `ol`/`ywz`, now the `PX`/`_Fl` region) — launch-mode cascade (`exec`/`resume`/`prompt`), `bgDispatchGate`, ack-timeout dispatch rescue (`tengu_bg_dispatch_rescued` still present @565968 / @592978). Structure unchanged → [`unified_dispatcher_ol.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/unified_dispatcher_ol.md).
- **Shell-exec background sessions** (`--bg --exec`, `! <cmd>`, `resolveShellLaunch`) — the exec-mode env purge inside `_Fl` (`cli_inner_pretty.js:594735-594747`) is byte-identical logic to v2.1.156 `Eq9` → [`shell_exec_sessions.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md).
- **The four-state classifier engine** (working/blocked/done/failed) + phone push — the classification *engine* is carried over; only its `--json` surfacing changed (§3). → [`bg_session_classifier.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md).
- **The `/bg` flow shape** (def→call→seed→confirm→fork) — re-mangled only (§4). → [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md); re-base symbol names per §4.
- **The pty-host orphan watchdog** (`--bg-pty-host`), the **worktree-isolation guard**, the **daemon binary-takeover / stale-exec fallback / live-turn handoff** — no architecture change found. → [`worktree_isolation_and_pty_orphan.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worktree_isolation_and_pty_orphan.md) and [`daemon_binary_takeover_and_bg_handoff.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/daemon_binary_takeover_and_bg_handoff.md). (The `version skew` pty-auth re-key message @594357 is a worded refinement of the existing DATA-auth handling, not a new mechanism.)
- **The empty-idle-grace retire, low-mem pinned-shed, bridge grace, pinned guard** — all carried from [`worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md); only the three §5 deltas are new.
- **The pre-2.1.142 foundation** (agent-view dashboard UI, rv-socket protocol, daemon adopt/idle-exit, worker phase machine) → the v2.1.142 module linked from the v2.1.156 baseline README.

---

## Files in this module

```
36_background_agents/   (v2.1.183 — DELTA tree)
├── README.md                          ← you are here (index + headline framing + at-a-glance table + carryover links)
│
├── nested_subagent_depth_limit.md     ← THE CENTERPIECE. The v2.1.172/2.1.181 delta in depth:
│                                          v1i=5, Gz depth reader, the cio/bte filter gate, depth threading across
│                                          spawn/fork/resume/workflow (agentContext.depth = Gz(parent)+1 → spawnDepth),
│                                          the fg/bg-shared-limit mechanism (tool-removal, not refusal),
│                                          and the v2.1.156 uE6 team-only before-picture.
│
├── worker_env_isolation_2181.md       ← the _Fl env-builder rework: the four scrub passes (jLo/GLo/JLt) +
│                                          WLo/XLt host-auth branch; the v2.1.156 Eq9/Y7q single-pass before-picture;
│                                          why provider-env (ANTHROPIC_*/Bedrock/Vertex/Foundry) now scrubs unless re-passed.
│
└── agents_json_surface_2169.md        ← the aGf three-source merge, id/state/waitingFor fields, lGf state mapper,
                                           and the --all flag; the v2.1.156 bBz live-only before-picture.
```

> **Note:** the three per-topic files listed above are authored alongside this README in the same writing round; this README is the index + summary, and each delta's full What/How/Why/Key-insight analysis lives in its companion file. If a companion file is not yet present in this directory, its content is fully specified by the anchors here and in the scout dossier ([`../_scout_dossier_background_agents.md`](../_scout_dossier_background_agents.md)). The `/bg` (D4) flow is **not** given a fresh per-topic file — it is re-mangled carryover, so §4 here re-bases the symbols onto the baseline [`background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md).

## Reading order

1. **This README** — the delta index. Internalize the four deltas (depth limit / env-isolation / `agents --json` / `/bg` re-mangle) and which subsystems carry over.
2. **`nested_subagent_depth_limit.md`** — read first of the companions. The depth limit is the headline and the only *architecture* change; everything downstream (which subagents keep the Agent tool, how fg/bg share the cap) depends on understanding the `bte(...Gz(ctx))` chokepoint.
3. **`worker_env_isolation_2181.md`** — second. A security-shaped rework of the worker env builder; read after the depth limit since both touch the spawn path.
4. **`agents_json_surface_2169.md`** — third. An observability rework, orthogonal to the spawn path; read when investigating the `agents --json` output or the bg job-state vocabulary.
5. For the `/bg` command (§4), the **`/stop`**, and the daemon retire/respawn refinements (§5), read this README's sections, then jump to the linked **v2.1.156 baseline** docs for the unchanged flow.

For unchanged mechanics (the unified dispatcher, shell-exec sessions, the classifier engine, the pty-host, the binary-takeover), read the **v2.1.156 baseline** linked in "What carries over unchanged" — this tree deliberately does not re-derive them.

## Cross-tree links (v2.1.156 baseline — unchanged carryover)

- Unified dispatcher / launch-mode cascade / ack-timeout rescue: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/unified_dispatcher_ol.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/unified_dispatcher_ol.md)
- Shell-exec background sessions (`--bg --exec`, `! <cmd>`): [`../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/shell_exec_sessions.md)
- Four-state classifier engine + phone push: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/bg_session_classifier.md)
- The `/bg` (`/background`) full flow (re-base symbols per §4): [`../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/background_slash_command.md)
- Worker retire/respawn (pinned/settled/bridge/low-mem): [`../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worker_retire_respawn_2156.md)
- Worktree isolation + pty-host orphan watchdog: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/worktree_isolation_and_pty_orphan.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/worktree_isolation_and_pty_orphan.md)
- Daemon binary-takeover + `/bg` live-turn handoff: [`../../../claude_code_v_2.1.156/analyze/36_background_agents/daemon_binary_takeover_and_bg_handoff.md`](../../../claude_code_v_2.1.156/analyze/36_background_agents/daemon_binary_takeover_and_bg_handoff.md)

## Open questions / low-medium-confidence (carried from the dossier)

1. **"Working forever" fix (2.1.178) — low confidence on exact site.** No distinct string isolates this. Two plausible loci: (a) the `agents --json` state mapper `lGf` (`cli_inner_pretty.js:691342`) now derives a terminal `done`/`failed`/`stopped` via `ph(state)` so a finished session no longer reports `working`; (b) the empty-idle-grace retire (`cli_inner_pretty.js:594961+`) reaps a stuck `state:"working" tempo:"blocked"` placeholder. Could not pin to a single patch line.
2. **`--bg -cn <name>` name-not-seeding fix (2.1.176) — not isolated.** No `-cn`/`--session-name` literal was found near the bg dispatch path; the session name is seeded via `CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short` in `_Fl` (`cli_inner_pretty.js:594718`). The micro-fix likely lives in the CLI `--bg` arg parsing region, not in the dispatcher.
3. **Pre-warmed worker project-settings leak (2.1.172) / "Could not resolve authentication after idle" (2.1.174) — medium-low confidence on attribution.** Plausibly subsumed by the §2 env-isolation rework (the prewarm respawn re-runs `_Fl`), but no dedicated prewarm-settings-scrub line was isolated.
4. **`CLAUDE_CODE_FORK_SUBAGENT` ↔ depth-cap interaction — medium confidence.** The depth cap (`v1i=5`) is always enforced by the filter; the env/GrowthBook gate `CLAUDE_CODE_FORK_SUBAGENT` (`vvd`/`L1i` @222208) toggles the fork-subagent *feature surface*. The exact division of labour (does the gate-off state also remove the Agent tool from subagents, or only the fork machinery?) was not exhaustively traced.
5. **`nS$` goal-snapshot / cron-goal-loss** — inherited gap from the v2.1.156 `bg_session_classifier.md` §6.3; not re-investigated this round.

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (the depth-limit / subagent execution path: `v1i`, `Gz`, `cio`, `bte`, `Xut`)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Background Agents** is the home module: dispatcher, classifier, worker, `/bg`)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (env-isolation scrub lists, auth predicates, telemetry helpers)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (the agents-view CLI, commander chain)
> - [../00_overview/symbol_additions_v2_1_183_background_agents.md](../00_overview/symbol_additions_v2_1_183_background_agents.md) — the granular v2.1.183 additions for this module (add new rows there)

Key functions/constants in this delta doc (re-derived v2.1.183 names):

- `SUBAGENT_DEPTH_LIMIT` (obfuscated: `v1i`, `cli_inner_pretty.js:221800`) — the literal `5`; concept absent in v2.1.156.
- `getAgentDepth` (obfuscated: `Gz`, `cli_inner_pretty.js:103152`) — `0` for `main`, else `agentContext.depth ?? 0`.
- `subagentToolFilter` (obfuscated: `cio`, `cli_inner_pretty.js:371188`) — universal tool filter; gates the Agent tool on `agentDepth < v1i`. Replaces v2.1.156 team-only `uE6` (@278956).
- `resolveSubagentTools` (obfuscated: `bte`, `cli_inner_pretty.js:371230`) — threads `agentDepth` into the filter; called `bte(…, Gz(ctx))` @387154. (v2.1.156 `no` @278972.)
- `AGENT_TOOL_NAME` (obfuscated: `vs`, `cli_inner_pretty.js:149939`) — `"Agent"`; tool def `f3n` @423505.
- `matchesToolName` (obfuscated: `Rc`, `cli_inner_pretty.js:149965`) — `name === t || aliases?.includes(t)`.
- `registerLocalAgentTask` (obfuscated: `Xut`, `cli_inner_pretty.js:446073`) — persists `spawnDepth` into the `local_agent` task record.
- `buildWorkerEnv` (obfuscated: `_Fl`, `cli_inner_pretty.js:594705`) — bg worker env builder; four scrub passes (scrub loops @594725-594747). Replaces v2.1.156 `Eq9` @559877.
- `PROVIDER_AUTH_SCRUB` (obfuscated: `GLo`, `cli_inner_pretty.js:595849`) — NEW provider-auth/config scrub list.
- `HOST_AUTH_TOKEN_SET` (obfuscated: `XLt`, `cli_inner_pretty.js:191672`) — host-managed auth tokens deleted from the worker env.
- `VERTEX_REGION_PREFIXES` (obfuscated: `JLt`, `cli_inner_pretty.js:191730`) — `["VERTEX_REGION_CLAUDE_"]` prefix scrub.
- `isHostManagedAuth` (obfuscated: `WLo`, `cli_inner_pretty.js:594777`) — true when auth is host-brokered (Unix socket / managed / host-named var).
- `TERMINAL_SESSION_SCRUB` (obfuscated: `jLo`, `cli_inner_pretty.js:595797`) — terminal/SSH/session scrub list (broadened from v2.1.156 `Y7q` @560861).
- `printAgentsJson` (obfuscated: `aGf`, `cli_inner_pretty.js:691275`) — three-source merge; emits `id`/`state`/`waitingFor`. Replaces v2.1.156 `bBz` @642728.
- `jobToViewState` (obfuscated: `lGf`, `cli_inner_pretty.js:691342`) — maps `(jobState, liveStatus)` → `working`/`blocked`/`done`/`failed`/`stopped`.
- `agentsCommandHandler` (obfuscated: `cGf`, `cli_inner_pretty.js:691363`) — wires `--all` (`await t(e.cwd, e.all === !0)`); flag def @695321.
- `spawnBackgroundFork` (obfuscated: `sKn`, `cli_inner_pretty.js:566834`) — `/bg` argv builder + fork over `PX`. (v2.1.156 `zh8`.)
- `deriveBackgroundSeed` (obfuscated: `iKn`, `cli_inner_pretty.js:566927`) — reverse transcript scan → `{intent, name, nameSource, detail}`. (v2.1.156 `Ah8`.)
- `BackgroundForkPrompt` (obfuscated: `ugf`, `cli_inner_pretty.js:566957`) — `/bg` confirm UI; auto-confirm when idle. (v2.1.156 `gwz`.)
- `backgroundCall` (obfuscated: `lgf`, `cli_inner_pretty.js:567091`) — `/bg` call handler; three guards. (v2.1.156 `Fwz`.)
- `backgroundCommandDef` (obfuscated: `hgf`/`ygf`, `cli_inner_pretty.js:567140`) — the `local-jsx` def; `aliases:["bg"]`, `immediate:(e)=>!e.trim()`. (v2.1.156 `owz`/`awz`.)
- `backgroundModule` export (obfuscated: `JMl`, `cli_inner_pretty.js:566833`) — `{ spawnBackgroundFork, deriveBackgroundSeed, call }`. (v2.1.156 `OH9`.)
- `stopSelfSession` (obfuscated: `aKn`, `cli_inner_pretty.js:567155`) — `/stop` impl; writes `state:"stopped"` + `tengu_bg_agent_action`. Command defs `Egf`/`Hgf` @567204+. (v2.1.156 `Yh8`.)
- `getForkSubagentSource` (obfuscated: `L1i`, `cli_inner_pretty.js:222216`) / fork-subagent gate (obfuscated: `vvd`, `cli_inner_pretty.js:222208`) — env/GrowthBook gate for the fork-subagent feature (`CLAUDE_CODE_FORK_SUBAGENT`); distinct from the always-on depth cap.
- worker handle `respawnIfIdleStale` (obfuscated method, `cli_inner_pretty.js:594895`) / `retireIfSettled` (`cli_inner_pretty.js:594936`) — daemon lifecycle; cliVersion-equality + `session_cron`/`routine` guards + prewarm. (v2.1.156 on `SF`.)
