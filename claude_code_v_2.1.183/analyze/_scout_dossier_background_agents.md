# Scout Dossier — Background Agents (nested subagents, `/bg`, daemon fleet), v2.1.156 → v2.1.183

> Feature: **Background Agents** subsystem — the `/bg` (`/background`) slash command, the on-demand daemon fleet (retire/respawn lifecycle, worker env isolation), `claude agents --json`, and the NEW cross-cutting **nested-subagent depth limit**.
> Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
> Baseline docs diffed against: `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/36_background_agents/`.
>
> **Every obfuscated name below was re-derived in v2.1.183 by reading the declaration at the cited line.** The v2.1.156 obfuscated names (`zh8`, `Ah8`, `Fwz`, `gwz`, `Eq9`, `Y7q`, `bBz`, `SF`, …) are RE-MANGLED in v2.1.183 and DO NOT apply — verify by line.

---

## 1. Executive summary

The headline architecture delta is **nested subagents with a 5-level depth limit shared by foreground and background subagents** (changelog 2.1.172 + 2.1.181). In v2.1.156 a subagent could spawn the Agent/Task tool only when team mode was on (the `uE6` async-tool filter let the `Agent` tool through only inside `R7() && mG()`); there was **no notion of depth at all** — no `agentDepth`/`spawnDepth` anywhere in the v2.1.156 bundle. v2.1.183 introduces a `depth` field on every `agentContext` (`Gz` reads it, returns `0` for `main`), increments it `+1` on every spawn/fork/resume/workflow path, threads it as `spawnDepth` into the task registry, and gates the Agent tool in the universal tool filter: `cio`/`bte` now drop the `Agent` tool unless `agentDepth < v1i` where **`v1i = 5`** (`cli_inner_pretty.js:221800`, `371194`). Because the same `bte(...Gz(agentContext))` filter builds the toolset for both async (background) and synchronous (foreground) subagents, the limit is genuinely shared — which is exactly the 2.1.181 fix ("foreground subagents now respect the same 5-level depth limit as background subagents").

The **`/bg` command surface is structurally carried over** (def → call → seed → confirm-UI → fork-over-`ol`) but every symbol is re-mangled and the export module `OH9` → `JMl`. The exported triple is unchanged in shape: `{ spawnBackgroundFork: sKn, deriveBackgroundSeed: iKn, call: lgf }` (@566833). The confirm UI is now `ugf` (was `gwz`), the call handler `lgf` (was `Fwz`), the command def `hgf`/`ygf` (was `owz`/`awz`), `/stop` is `Egf`/`Hgf` (was `Yh8`).

The **daemon worker env-isolation fix (2.1.181 ANTHROPIC_* provider-env leak)** is real and located: v2.1.156's worker-env builder `Eq9` (@559877) scrubbed only ONE list `Y7q` — purely terminal/SSH/session vars, containing NO provider auth. v2.1.183's builder `_Fl` (@595802) adds two more scrub passes plus host-auth handling: `GLo` (Bedrock/Vertex/Foundry auth + `ANTHROPIC_CUSTOM_HEADERS`/`ANTHROPIC_UNIX_SOCKET`), the `JLt` prefix scrub (`VERTEX_REGION_CLAUDE_`), and a `WLo(env)`/`XLt` host-auth branch that deletes auth tokens (`ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`, `AWS_BEARER_TOKEN_BEDROCK`, `ANTHROPIC_FOUNDRY_API_KEY`, …) so a backgrounded worker no longer silently inherits the dispatching session's provider credentials.

**`claude agents --json` was substantially reworked (2.1.169/2.1.162)**: v2.1.156's `bBz` printed only *live processes* with `pid/cwd/kind/startedAt/sessionId/name/status`. v2.1.183's `aGf` (@691275) merges three sources (live procs + on-disk job states + shorts), so just-dispatched/blocked bg jobs that have no live process now appear; and it adds `id`, `state` (`working`/`blocked`/`done`/`failed`/`stopped` via `lGf`), `waitingFor`, and a NEW `--all` flag (@695321) to include completed sessions.

The **daemon retire/respawn lifecycle (`retireIfSettled`/`respawnIfIdleStale`) is mostly carryover** from the v2.1.156 `worker_retire_respawn_2156.md` design (pinned guard, broadened settled predicate, bridge grace, exec exclusion, low-mem pinned-shed `tengu_bg_retire_pinned_low_mem`). The refinements in v2.1.183 are a cliVersion-equality "stale" check for upgrade respawn, plus new inflight guards for `session_cron` and `r.routine` (cron/routine integration), and a `prewarm` respawn trigger.

**Confidence: high** for the depth limit, env-isolation, `/bg` re-derivation, and `agents --json`. **Medium** for attributing the "Working forever" (2.1.178) and `--bg -cn` name-seeding (2.1.176) micro-fixes to specific lines — those did not surface as distinct strings and are noted as open questions.

---

## 2. Verified anchor table

| Readable name | v2.1.183 obf | v2.1.183 line | v2.1.156 obf | One-line evidence (read at the cited line) |
|---|---|---|---|---|
| **`SUBAGENT_DEPTH_LIMIT` (= 5)** | `v1i` | 221800 | (none — concept absent) | `v1i = 5,` declared alongside `LCe, T5r, UPt, …, T1i, w5r` |
| `getAgentDepth` | `Gz` | 103152 | (none) | `function Gz(e){ if(e.agentType==="main") return 0; return e.depth ?? 0; }` |
| subagent tool filter (depth gate) | `cio` | 371188 | `uE6` (@278956) | `if (Rc(i, vs)) return s < v1i;` where `s = agentDepth` |
| resolved-tools builder (passes depth) | `bte` | 371230 | `no` (@278972) | `bte(e,t,n=!1,r=!1,o=!1,s=0)` → `cio({…agentDepth:s})`; called `bte(…, Gz(c?.agentContext ?? n.agentContext))` @387154 |
| Agent tool name const | `vs` | 149939 | `sq` (@185637) | `var vs = "Agent", c9 = "Task"` |
| tool-name matcher | `Rc` | 149965 | `h1` | `e.name === t \|\| (e.aliases?.includes(t) ?? !1)` |
| Agent tool def | `f3n` | 423505 | — | `pi({ … name: vs, … async call({…, name:s, mode:i, isolation:a, cwd:l},…){ … let z = Gz(c.agentContext)+1; … }})` |
| spawn-depth compute (Agent call) | (local `z`) | 423722 | — | `z = Gz(c.agentContext) + 1` (then set as `agentDepth:z` @423825 and `depth:z` @423933/423990) |
| local-agent task registrar | `Xut` | 446073 | — | `{ …, spawnDepth: r, … keepaliveReasons: new Set() }` — persists spawnDepth into task record |
| async-task spawn-depth read | (local `y`) | 434085 | — | `y = (od(g) ? g.spawnDepth : void 0) ?? Gz(o.agentContext) + 1` (resume path) |
| **`spawnBackgroundFork`** (`/bg` fork) | `sKn` | 566834 | `zh8` | `gt(JMl,{spawnBackgroundFork:()=>sKn,…})`; builds `--resume <id> --fork-session [--reply-on-resume] …` then `PX(...,"repl",...)` |
| **`deriveBackgroundSeed`** | `iKn` | 566927 | `Ah8` | reverse-scan transcript → `{intent,name,nameSource,detail}` |
| `/bg` confirm UI (`BackgroundForkPrompt`) | `ugf` | 566957 | `gwz` | auto-confirm-when-idle (`m.count===0`), once-only fork effect (`h.current`), `tengu_background_fork` |
| **`/bg` call handler** | `lgf` | 567091 | `Fwz` | guards: already-bg (`yi()`→`tengu_background_already_bg`), persistence-off (`dV()`), empty-seed; renders `ugf` |
| `/bg` command def (`local-jsx`) | `hgf` / `ygf` | 567140 | `owz`/`awz` | `{ type:"local-jsx", name:"background", aliases:["bg"], immediate:(e)=>!e.trim(), … }` |
| `/bg` export module | `JMl` | 566834 | `OH9` | `gt(JMl,{ spawnBackgroundFork, deriveBackgroundSeed, call })` |
| `/stop` (self bg stop) | `Egf`/`Hgf`; impl `aKn` | 567208 / 567155 | `Yh8` | `aKn` writes `state:"stopped"` + `tengu_bg_agent_action{action:"stop"}` |
| daemon worker env builder | `_Fl` | 594705 (body 595802-595858) | `Eq9` (@559877) | `let i={...process.env, …}; for(let a of jLo)…; for(let a of GLo)…; for(let a of …)if(JLt.some(l=>a.startsWith(l)))…; if(WLo(s)){for(XLt)delete}` |
| env scrub — terminal/session (old list) | `jLo` | 595797 | `Y7q` (@560861) | terminal/SSH/session vars; v2.1.183 adds `CLAUDE_BG_RV_AUTH`,`CLAUDE_BG_PTY_AUTH`,`CLAUDE_BG_SOCKET_TOKENS_PATH`,`CLAUDE_CODE_CHILD_SESSION`,`CLAUDE_AX_SCREEN_READER`,`ANTHROPIC_MODEL`,`SSH_CLIENT` |
| env scrub — **provider auth (NEW)** | `GLo` | 595849 | (none) | `GLo = [...k3r, ...YLt, ...C3r, ...I3r, "ANTHROPIC_CUSTOM_HEADERS","ANTHROPIC_UNIX_SOCKET","CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST","CLAUDE_CODE_HOST_AUTH_ENV_VAR"]` |
| env scrub — host-auth token set | `XLt` | 191672 | (none) | `["ANTHROPIC_API_KEY","ANTHROPIC_AUTH_TOKEN","CLAUDE_CODE_OAUTH_TOKEN","AWS_BEARER_TOKEN_BEDROCK","ANTHROPIC_FOUNDRY_API_KEY","ANTHROPIC_AWS_API_KEY","ANTHROPIC_BEDROCK_MANTLE_API_KEY"]` |
| env scrub — vertex-region prefix | `JLt` | 191730 | (none) | `JLt = ["VERTEX_REGION_CLAUDE_"]` |
| `printAgentsJson` | `aGf` | 691275 | `bBz` (@642728) | merges `m4e()`+`QK()`+`zzn()`; emits `id`,`state`,`waitingFor`; `--all` gate @691294 |
| agents-json state mapper | `lGf` | 691342 | (none) | `→ "working"/"blocked"/"done"/"failed"/"stopped"` from state+status |
| `agentsCommandHandler` | `cGf` | 691363 | (inline action @646307) | `await t(e.cwd, e.all === !0)` — wires `--all` |
| `agents` CLI command def | (commander chain) | 695283 | (chain @646279) | `.option("--all","With --json: include completed sessions (the full agent view list)")` @695321 |
| worker handle `respawnIfIdleStale` | (class method) | 594895 | (on `SF`/`aB`) | exec-excluded; cliVersion-equality stale check; inflight guards (`session_cron`,`routine`) |
| worker handle `retireIfSettled` | (class method) | 594936 | (on `SF` @560062) | pinned guard `t?.has`; empty-idle-grace; bridge grace; `routine`/`session_cron` guards |
| low-mem pinned-shed escalation | (supervisor tick) | 697251 | (tick @647839) | `G("tengu_bg_retire_pinned_low_mem", {})` last-resort pinned retire |
| `--reply-on-resume` flag | (string) | 192022 / 566852 | (same) | `...(c?.replyOnResume ? ["--reply-on-resume"] : [])` |
| `tengu_background` (fork telemetry) | (event) | 566916 / 699201 | (same) | `G("tengu_background", { via_flag:!1, via: Ne(a) })` |

---

## 3. Confirmed deltas

### 3.1 NESTED SUBAGENTS + 5-LEVEL DEPTH LIMIT (headline, 2.1.172 / 2.1.181) — **high confidence**

**v2.1.183 evidence.**
- Constant: `cli_inner_pretty.js:221800` — `v1i = 5,`
- Depth reader: `cli_inner_pretty.js:103152-103155`
  ```js
  function Gz(e) {
    if (e.agentType === "main") return 0;
    return e.depth ?? 0;
  }
  ```
- Enforcement in the universal tool filter `cio` (`cli_inner_pretty.js:371188-371200`):
  ```js
  function cio({ tools: e, isBuiltIn: t, isAsync: n = !1, isTeammate: r = !1, permissionMode: o, agentDepth: s = 0 }) {
    return e.filter((i) => {
      if (Lx(i)) return !0;
      if (Rc(i, WM) && o === "plan") return !0;
      if (LCe.has(i.name)) return !1;
      if (!t && T5r.has(i.name)) return !1;
      if (Rc(i, vs)) return s < v1i;          // ← Agent tool only when depth < 5
      if (n && !UPt.has(i.name)) { … return !1; }
      return !0;
    });
  }
  ```
  Note the `Agent`-tool line **precedes** the `if (n && …)` async block, so the depth gate is independent of async/team — a deliberate change from the v2.1.156 team-only gate.
- Depth threaded by `bte` (`cli_inner_pretty.js:371230-371234`) and called by the subagent runner with the parent's depth (`cli_inner_pretty.js:387154`):
  ```js
  Ae = y ? f : bte(e, f, o, !1, D, Gz(c?.agentContext ?? n.agentContext)).resolvedTools,
  ```
- Depth incremented & stamped on the child agentContext at every spawn surface, all `Gz(parent)+1`:
  - regular Agent-tool spawn: `z = Gz(c.agentContext) + 1` (@423722), set `depth: z` async @423933 and sync @423990
  - resume path: `y = … ?? Gz(o.agentContext) + 1` (@434085), `depth: y` @434205
  - fork (built-in): `d = Gz(t.agentContext)` (@473587), `spawnDepth: d` @473592, `depth: d` @473612
  - workflow agent: `depth: Gz(ue) + 1` (@417155)
- Persisted into the task registry record: `Xut({ …, spawnDepth: r, … })` (`cli_inner_pretty.js:446073-446111`); telemetry emits `agent_depth: z` (@423733) and `agent_depth: r.agentDepth` (@371803).

**Before-picture (v2.1.156).**
- `grep -c agentDepth` = 0 and `grep -c spawnDepth` = 0 in `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` — the concept did not exist.
- The v2.1.156 equivalent filter `uE6` (`cli_inner_pretty.js:278956-278971`) had signature `{ tools, isBuiltIn, isAsync, permissionMode }` (no `agentDepth`) and let the `Agent` tool (`sq`) through to an **async** subagent ONLY inside team mode:
  ```js
  if (q && !xJ$.has(_.name)) {        // q = isAsync
    if (R7() && mG()) {               // R7 = isAgentTeamsEnabled
      if (h1(_, sq)) return !0;       // Agent tool allowed only in team mode
      if (U57.has(_.name)) return !0;
    }
    return !1;
  }
  ```
  So in v2.1.156 there was effectively **no recursive subagent spawning for ordinary subagents** and **no depth concept** — the only way an async subagent kept the Agent tool was team mode, and there was no cap.

**Why it matters / design.** Moving the gate from "team-only boolean" to "universal `depth < 5`" lets *any* subagent (fg or bg) spawn its own subagents up to 5 levels deep, while the single `bte(...Gz(ctx))` chokepoint guarantees fg and bg share one limit (the 2.1.181 fix is literally "fg now goes through the same filter"). The limit is enforced by **tool removal** (the deepest agent simply doesn't get the Agent tool) rather than a runtime refusal — there is no error string, which is why grep for "too deep"/"maximum depth" over the Agent path returns nothing.

---

### 3.2 BG worker env-isolation — ANTHROPIC_* provider-env leak fix (2.1.181) — **high confidence**

**v2.1.183 evidence (builder `_Fl` declared @`cli_inner_pretty.js:594705`; scrub body @595802-595858):**
```js
function _Fl(e, t, n, r, o) {
  let s = { ...process.env },
    i = { ...s, …, CLAUDE_CODE_SESSION_KIND: "bg", CLAUDE_BG_BACKEND: "daemon", …, ...e.env };
  …
  for (let a of jLo) if (!e.env?.[a]) delete i[a];                                   // terminal/session (old)
  for (let a of GLo) if (!e.env?.[a]) delete i[a];                                   // NEW: provider auth
  for (let a of Object.keys(i)) if (JLt.some((l) => a.startsWith(l)) && !e.env?.[a]) delete i[a];  // NEW: VERTEX_REGION_CLAUDE_*
  if (WLo(s)) { for (let l of XLt) delete i[l]; let a = s.CLAUDE_CODE_HOST_AUTH_ENV_VAR; if (a) delete i[a]; }
  else if (s.ANTHROPIC_BASE_URL) delete i.ANTHROPIC_AUTH_TOKEN;
  …
}
```
`GLo` (@595849) = `[...k3r, ...YLt, ...C3r, ...I3r, "ANTHROPIC_CUSTOM_HEADERS","ANTHROPIC_UNIX_SOCKET","CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST","CLAUDE_CODE_HOST_AUTH_ENV_VAR"]`; `XLt` (@191672) = the auth-token set; `JLt` (@191730) = `["VERTEX_REGION_CLAUDE_"]`.

**Before-picture (v2.1.156, builder `Eq9` @559877-559905):** ONE scrub loop only —
```js
for (let z of Y7q) if (!H.env?.[z]) delete _[z];
if (q) delete _.CLAUDE_CODE_OAUTH_TOKEN;
```
and `Y7q` (@560861) is a pure terminal/SSH/session list (`TERM_PROGRAM`, `SSH_TTY`, `TMUX`, …) with **no `ANTHROPIC_*` / Bedrock / Vertex / Foundry vars**. So a v2.1.156 bg worker inherited the full provider env of whatever session dispatched it — the leak described by the 2.1.181 changelog. The v2.1.183 `GLo`+`JLt`+`WLo/XLt` passes scrub all provider auth/config unless explicitly re-passed via `e.env`.

(Note: the exec-mode `CLAUDE_*`/`OTEL_*` purge loop is carried over verbatim from v2.1.156 — not a delta.)

---

### 3.3 `claude agents --json`: `id`/`state`/`waitingFor` + `--all` + disk-state merge (2.1.169 / 2.1.162) — **high confidence**

**v2.1.183 evidence.**
- Builder `aGf` (`cli_inner_pretty.js:691275-691332`) merges three sources `[o,s,i] = await Promise.all([m4e(), QK(), zzn()])` (live procs, disk job states, shorts), iterates disk states `rDt(s,l)`, and emits per entry:
  ```js
  c.push({ ...(p && { pid: p.pid }), id: d.id, cwd: …, kind: "background",
           startedAt: …, sessionId: …, …name…, …status…,
           ...(p?.status === "waiting" && p.waitingFor && { waitingFor: p.waitingFor }),
           state: f });            // f = lGf(d.state, p?.status)
  ```
- `--all` gate (`cli_inner_pretty.js:691294`): `if (!t && !p && f !== "working" && f !== "blocked") continue;` — without `--all` (`t`), non-running, non-working/blocked entries are skipped; with `--all`, completed sessions are included.
- State mapper `lGf` (@691342) → `"working" | "blocked" | "done" | "failed" | "stopped"`.
- CLI flag (`cli_inner_pretty.js:695321`): `.option("--all", "With --json: include completed sessions (the full agent view list)")`; wired in `cGf` (@691370) `await t(e.cwd, e.all === !0)`.

**Before-picture (v2.1.156, `bBz` @642728-642746):** iterated ONLY the live-process list `qSH()` and emitted `{ pid, cwd, kind, startedAt, sessionId, name, status }` where `status ∈ {idle, waiting, busy}` — **no `id`, no `state`, no `waitingFor`, no `--all`**. Just-dispatched or blocked bg jobs with no live process were invisible (the exact 2.1.169 bug). The v2.1.156 command def (@646306) declared only `--json` ("Print **live** sessions"), with no `--all`.

---

### 3.4 `/bg` (`/background`) command surface — full re-derivation (carryover shape, re-mangled) — **high confidence**

**v2.1.183 evidence.** Export module `JMl` (@566833): `gt(JMl, { spawnBackgroundFork: () => sKn, deriveBackgroundSeed: () => iKn, call: () => lgf })`.
- `sKn` (@566834) `spawnBackgroundFork`: flushes, then builds argv `[...(b!==null?["--resume",b,"--fork-session"]:[]), ...(c?.replyOnResume?["--reply-on-resume"]:[]), ...XMe(), ...--add-dir/--allowed-tools/--disallowed-tools, ...--model, ...--effort, "--permission-mode", r, ...(t?["--",t]:[])]` and dispatches via `PX(S, providedSessionId, "repl", worktreePath ?? cwd, {…worktree handoff…}, c?.extraEnv)`; on failure with `left_arrow` source writes a `state:"failed"` placeholder "press Enter to retry" (@566896) and emits `tengu_background_spawn_failed`; success emits `tengu_background{via_flag:!1, via}` and async auto-names via `Nwe(...,"auto")`.
- `iKn` (@566927) `deriveBackgroundSeed`: reverse transcript scan → `{intent, name, nameSource, detail}`.
- `ugf` (@566957) confirm UI `BackgroundForkPrompt`: auto-confirm when idle (`m.count === 0`), once-only fork effect (`h.current`), `tengu_background_fork{confirmed, inflight_count, mid_turn, had_prompt, had_worktree, worktree_handed_off}` (@566994), decline `tengu_background_declined{inflight_count}` (@567036).
- `lgf` (@567091) `call`: guards already-bg (`yi()` → `tengu_background_already_bg`, @567092), persistence-off (`dV()` → "Cannot background — session persistence is disabled", @567093), empty-seed ("Nothing to background yet", @567100); else renders `ugf`.
- Command def `hgf`/`ygf` (@567140): `{ type:"local-jsx", name:"background", aliases:["bg"], argumentHint:"[prompt]", immediate:(e)=>!e.trim(), isEnabled:()=>!0, load:… }`.
- `/stop` sibling: `Egf`/`Hgf` (@567208), impl `aKn` (@567155) writes `state:"stopped"` + `tengu_bg_agent_action{action:"stop"}`.

**Before-picture (v2.1.156).** `OH9` (@542679): `X$(OH9, { spawnBackgroundFork: () => zh8, deriveBackgroundSeed: () => Ah8, call: () => Fwz })`. Same export *shape*; the docs in `background_slash_command.md` map `zh8`/`Ah8`/`Fwz`/`gwz`/`owz`/`awz`/`Yh8`. **The structure is unchanged** — this is a re-mangle, not a redesign. The writer should re-base the existing `background_slash_command.md` symbol citations onto the v2.1.183 names rather than re-document the flow.

---

### 3.5 Daemon retire/respawn lifecycle — carryover with cron/routine + version-equality refinements — **medium-high confidence**

**v2.1.183 evidence.** `respawnIfIdleStale` (@594895-594935) and `retireIfSettled` (@594936-595013) keep the v2.1.156 shape: exec exclusion (`launch.mode === "exec"` @594896), pinned guard (`t?.has(this.dispatch.short)` @594940), empty-idle-grace (@594971, carried from v2.1.156 @560097), bridge grace (`r.bridgeSessionId ? Math.max(e,n) : e` @594998), spare grace (@594947). Supervisor tick (@697236-697282) keeps pinned-only upgrade respawn, retire-all, low-mem pinned-shed last-resort (`tengu_bg_retire_pinned_low_mem` @697251), and prewarm (`tengu_bg_prewarm_per_sweep`).

**NEW in v2.1.183:** (a) the upgrade-respawn "stale" check is now a `cliVersion === <current VERSION 2.1.183>` equality (@594901-594913, also in the prewarm loop @697266-697278) — only respawn workers whose recorded cliVersion matches the running daemon's; (b) new inflight guards `o.includes("session_cron")` (@594927) and `r.routine` → `reason:"routine"` (@594997) for cron/routine sessions; (c) a `prewarm` respawn trigger (@697279).

**Before-picture (v2.1.156).** `retireIfSettled` (@560062), supervisor tick (@647839-648015) — same pinned/settled/bridge/low-mem design (documented in `worker_retire_respawn_2156.md`), but no `session_cron`/`routine` guards and the stale check did not key on cliVersion equality. **Most of this is carryover** — document only the cron/routine + version-equality deltas.

---

## 4. Unchanged carryover (link to v2.1.156, do NOT re-document)

- The **unified dispatcher** `ol`/`ywz` seam (now `PX`/`_Fl`-region) — launch-mode cascade (`exec`/`resume`/`prompt`), `bgDispatchGate`, ack-timeout rescue (`tengu_bg_dispatch_rescued` still present @565968,592978). Structure unchanged → link `unified_dispatcher_ol.md`.
- **Shell-exec background sessions** (`--bg --exec`, `! <cmd>`, `resolveShellLaunch`) — the exec-mode env purge in `_Fl` (@595838-595847) is byte-identical logic to v2.1.156 `Eq9`. Link `shell_exec_sessions.md`.
- **Four-state classifier** (working/blocked/done/failed) + phone push — the *engine* is carried over; only its `--json` surfacing changed (see §3.3). Link `bg_session_classifier.md`.
- **`/bg` flow shape** (def→call→seed→confirm→fork) — re-mangled only (§3.4). Link `background_slash_command.md`; re-base symbol names.
- **pty-host orphan watchdog** (`--bg-pty-host`), **worktree-isolation guard**, **daemon binary-takeover / stale-exec fallback / live-turn handoff** — no architecture change found; link `worktree_isolation_and_pty_orphan.md` and `daemon_binary_takeover_and_bg_handoff.md`. (The `version skew` pty-auth re-key message @594357 is a worded refinement of the existing DATA-auth handling, not a new mechanism.)
- **empty-idle-grace retire**, **low-mem pinned-shed**, **bridge grace**, **pinned guard** — carried from `worker_retire_respawn_2156.md`.

---

## 5. Open questions / low-confidence items

1. **"Working forever" fix (2.1.178).** No distinct string isolates this. Two plausible loci: (a) the `agents --json` state mapper `lGf` (@691342) now derives terminal `done`/`failed`/`stopped` from `ph(state)` so a finished session no longer reports `working`; (b) the empty-idle-grace retire (@594961-594982) reaps a `state:"working" tempo:"blocked"` placeholder bg session. Could not pin to a single patch line — **low confidence on exact site**.
2. **`--bg -cn <name>` name-not-seeding fix (2.1.176).** No `-cn`/`--session-name` literal found near the bg dispatch path; the session name is seeded via `CLAUDE_CODE_SESSION_NAME: e.seed?.name || e.seed?.intent || e.short` in `_Fl` (@595817). The micro-fix likely lives in the CLI `--bg` arg parsing (`XAf` region @566568/566792) — **not isolated**.
3. **Pre-warmed worker project-settings leak (2.1.172) / "Could not resolve authentication after idle" (2.1.174).** Plausibly subsumed by the §3.2 env-isolation rework (the prewarm respawn re-runs `_Fl`), but no dedicated prewarm-settings-scrub line was isolated. **Medium-low confidence on attribution.**
4. **Windows network-path neutralize-before-respawn (2.1.176) / malformed resume IDs / daemon ReadOnly attribute.** UNC handling exists broadly (@626257, @580073, @219811) but no respawn-specific neutralize site was isolated; `ReadOnly` daemon-attribute string not found in this bundle. **Out of scope unless the writer needs them.**
5. **`nS$` goal-snapshot / cron-goal-loss** — inherited gap from v2.1.156 `bg_session_classifier.md` §6.3; not re-investigated.

---

## 6. Proposed docs (for the writing phase)

| Filename | Purpose |
|---|---|
| `36_background_agents/nested_subagent_depth_limit.md` | **NEW dedicated doc** for the headline 2.1.172/2.1.181 delta: the `v1i=5` constant, `Gz` depth reader, the `cio`/`bte` tool-filter gate, depth threading across spawn/fork/resume/workflow (`agentContext.depth = Gz(parent)+1` → `spawnDepth`), and the fg/bg-shared-limit mechanism (tool-removal, not refusal). Include the v2.1.156 `uE6` team-only before-picture. |
| `36_background_agents/README.md` (delta update) | Add a "What changed 2.1.157→183" section pointing at the depth limit, the env-isolation rework, and the `agents --json` rework; re-base the `/bg` symbol list onto v2.1.183 names (`sKn`/`iKn`/`lgf`/`ugf`/`hgf`). |
| `36_background_agents/worker_env_isolation_2181.md` | The `_Fl` env-builder rework: the three scrub passes (`jLo`/`GLo`/`JLt`) + `WLo`/`XLt` host-auth branch; the v2.1.156 `Eq9`/`Y7q` single-pass before-picture; why provider-env (ANTHROPIC_*/Bedrock/Vertex/Foundry) now scrubs unless explicitly re-passed. |
| `36_background_agents/agents_json_surface_2169.md` | The `aGf` three-source merge, `id`/`state`/`waitingFor` fields, `lGf` state mapper, and the `--all` flag; v2.1.156 `bBz` live-only before-picture. |
| (symbol index update) | Add the new anchors to `symbol_index_core_features.md` (Background Agents) and `symbol_index_core_execution.md` (`v1i`, `Gz`, `cio`, `bte`, `Xut` for the depth-limit/subagent execution path). |

---

## 7. Repro greps (for the writer)

```
# depth limit
grep -nF 'v1i = 5' cli_inner_pretty.js          # 221800
grep -nF 'if (Rc(i, vs)) return s < v1i' cli_inner_pretty.js   # 371194
grep -nF 'function Gz(' cli_inner_pretty.js      # 103152
grep -nc 'agentDepth' /…/2.1.156/…/cli_inner_pretty.js   # 0  (concept absent before)

# env isolation
grep -nF 'function _Fl(' cli_inner_pretty.js     # 594705; scrub body @595802-595858
grep -nF '(JLt = ["VERTEX_REGION_CLAUDE_"])' cli_inner_pretty.js  # 191730

# agents --json
grep -nF 'printAgentsJson' cli_inner_pretty.js   # 691274 (183) / 642727 (156)
grep -nF 'the full agent view list' cli_inner_pretty.js          # 695321

# /bg surface
grep -nF 'spawnBackgroundFork: () => sKn' cli_inner_pretty.js    # 566833
```
