# The Unified Background Dispatcher `ol` and `ywz` — Source Kinds, Launch Modes, Exec Respawn

> Module: `36_background_agents` · Build under analysis: Claude Code **v2.1.156**
> (`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`)
> Companion docs (same module): [shell_exec_sessions.md](./shell_exec_sessions.md), [worker_retire_respawn_2156.md](./worker_retire_respawn_2156.md)
> 2.1.142 foundation (prior tree): [dispatch_flags.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/dispatch_flags.md), [worker_state_machine.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent/state)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform (permissions gate)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (CLI/UI)

Key functions in this document:
- `unifiedBgDispatch` (`ol`) — the single seam every bg dispatch flows through; allocates session id / job dir, runs the gate, delegates to the worker (cli_inner_pretty.js:541769-541788)
- `dispatchWorker` (`ywz`) — the dispatch worker: parses argv, picks launch mode, seeds job state, sends the dispatch, runs the rescue path (cli_inner_pretty.js:541789-541955)
- `bgDispatchGate` (`Bwz`) — pre-dispatch permission gate (bypass / auto opt-in) (cli_inner_pretty.js:542514-542529)
- `stripSessionIdArgs` (`mwz`) — strips `--session-id` from the prompt-mode argv tail (cli_inner_pretty.js:542497-542513)
- `firstPositionalAsIntent` (`Uwz`) — derives the intent from the first non-flag positional (cli_inner_pretty.js:542530-542541)
- `collectRespawnFlags` (`zH9`) — keep-list flag collector for respawn replay (cli_inner_pretty.js:542542-542560)
- `stripLaunchFlags` (`uwz`) — drops resume/fork/session-id flags for resume-mode flagArgs (cli_inner_pretty.js:542476-542496)
- `extractResumeSessionId` (`_H9`) — pulls the resume target session id from argv (cli_inner_pretty.js:542463-542475)
- `shellLaunchSpec` (`Ewz`) — builds the `$SHELL -c <cmd>` (or cmd.exe / /bin/sh) launch (cli_inner_pretty.js:541727-541736)
- `execTemplate` (`Xwz`) — the `{ name:"exec", description:"" }` template constant (cli_inner_pretty.js:541292)
- `isExecSession` (`ujH`) — `template==="exec" && respawnFlags.length===0` predicate (cli_inner_pretty.js:184286-184288)
- `respawnJob` (`C6$`) — the explicit-respawn path that contains the exec-respawn special case (cli_inner_pretty.js:541152-541261)
- `respawnIfIdleStale` (`SF.respawnIfIdleStale`) — supervisor upgrade respawn, excludes exec sessions (cli_inner_pretty.js:560029-560061)
- `isSettledState` (`_J`) — settled-and-not-active job-record predicate (`isTerminalState(state) && tempo!=="active"`) (cli_inner_pretty.js:184283-184285)
- `isTerminalState` (`Nv`) / `terminalStateToOutcome` (`evH`) — terminal job-state predicate / outcome mapper (cli_inner_pretty.js:184274-184282)
- `bgFlagExecHandler` (`hwz`) — `claude --bg --exec` CLI handler (cli_inner_pretty.js:541956-542006)
- `fleetDispatchExec` (`pe4`) — fleet-UI bang-command dispatch (cli_inner_pretty.js:541031-541059)
- `parseFleetDispatchInput` (`q5q`) — agents-view input parser (`!cmd` → exec) (cli_inner_pretty.js:614290-614318)
- `sendDispatch` (`Tqq`) — daemon dispatch send (shell→`my$`, else→`EF`) (cli_inner_pretty.js:541571-...)
- `seedBgState` (`Nqq`) — standalone bg seed-state writer (cli_inner_pretty.js:541737-541768)
- `idlePlaceholderDetail` (`kqq`) — `"(idle — send a prompt to start)"` constant (cli_inner_pretty.js:542585/542623)
- `idleNeedsHint` (`x6$`) — `"send a prompt to start"` constant (cli_inner_pretty.js:542584)
- `writeJobState` (`qA`) — job-state file writer (cli_inner_pretty.js:183931)
- `buildJobRecord` (`O$H`) — job-record builder used by seeds (cli_inner_pretty.js, called at 541834/541746/541123)

---

## TL;DR

In v2.1.156 **every** background-agent dispatch — `claude --bg`, `claude --bg --exec <cmd>`, the `!<cmd>` bang typed in the `claude agents` view, the `/bg` REPL handoff, daemon-side fleet respawn, and pre-warmed spare claim — funnels through a single async function, `unifiedBgDispatch` (`ol`, cli_inner_pretty.js:541769). `ol` is a thin shell: it runs the permission gate, allocates a session id and on-disk job directory, and delegates the real work to `dispatchWorker` (`ywz`, cli_inner_pretty.js:541789).

`ywz` does five things in order:

1. **Discriminate the source** via a single `source` parameter (`"shell"` | `"fleet"` | `"repl"` | `"spare"`), defaulting to `"shell"`.
2. **Choose a launch mode** — `exec` (run a shell command), `resume` (fork or continue an existing session), or `prompt` (seed an interactive bg session with a one-shot prompt).
3. **Seed the on-disk job state** with a template named `"exec"` or `"bg"` (or the agent type), idle placeholders, intent, and `respawnFlags` for later replay.
4. **Send the dispatch** to the daemon and **rescue** the common "ack-timeout but the worker is actually live" race.
5. **Return** `{ ok, short, sessionId, idle, name }` (or a typed error).

The flagship 2.1.156 addition is the **exec source/launch**: a background *shell* session. Its single most important property is that an exec session **persists its command** (in `intent`) so it can be re-run on explicit respawn, but **excludes itself from version-upgrade respawn** — you never want a one-shot shell command silently re-executed because the daemon upgraded. This doc documents the new exec branches in `ol`/`ywz`, the gate `Bwz`, the launch-mode selectors, and the two respawn special-cases (`C6$` exec branch at 541210, `SF.respawnIfIdleStale` exclusion at 560030).

Confidence: **high** for the bundle-level behavior (all line-cited and read). The whole `ol`/`ywz` surface, shell exec sessions, launch modes, and `respawnFlags` are **NEW after v2.1.88** — see [Cross-Validation](#cross-validation-with-v2188).

---

## Where `ol` Sits — The Single Seam

```
   CLI:  claude --bg --exec "npm test"        Agents view:  user types "!npm test"
                  │                                          │
                  ▼                                          ▼
        bgFlagExecHandler (hwz)                    parseFleetDispatchInput (q5q)
        541956                                     614290  → {template:exec, exec:"npm test"}
                  │                                          │
                  │   ol([], undef, "shell",                 ▼
                  │      {intent, exec, name})       fleetDispatchExec (pe4)  541031
                  │                                          │  ol([], id, "fleet", cwd,
   CLI: claude --bg "fix bug"                                │     {intent, exec})
                  │                                          │
        bgFlagExecHandler (hwz) 541990 ──┐      /bg in REPL  │         daemon respawn
                  │   ol(argv)         │              │       │              │
                  │                    │     ol(..., "repl",..)│      respawnJob (C6$) 541234
                  ▼                    ▼              │       │      ol(L,M,"fleet",...)
        ┌───────────────────────────────────────────┴───────┴──────────────┐
        │           unifiedBgDispatch (ol)   541769                          │
        │   1. gate = Bwz(argv)            → blocked? return gate_blocked    │
        │   2. sessionId = $ ?? randomUUID();  short = first 8 chars         │
        │   3. mkdir <jobDir>/tmp                                            │
        │   4. return await dispatchWorker(ywz, …)                           │
        └───────────────────────────────┬──────────────────────────────────┘
                                         ▼
        ┌──────────────────────────────────────────────────────────────────┐
        │              dispatchWorker (ywz)   541789                         │
        │   parse argv → launch-mode select → seed job state →               │
        │   sendDispatch (Tqq) → rescue path → typed result                 │
        └──────────────────────────────────────────────────────────────────┘
```

The pre-warmed **spare** path (`Fe4`, cli_inner_pretty.js:541102) is the one caller that does **not** route through `ol` for the happy path — it claims an already-spawned worker and only falls back to a cold dispatch (`ty8`) on a claim miss. But `"spare"` is still one of the four `source` discriminator values that `ol`/`ywz` understand (it appears in the `source` mapping at 541875 and the cleanup guard at 541781), because a spare that is *created* (pre-warmed) is dispatched through `ol` with `source:"fleet"`-style seeding excluded.

---

## `unifiedBgDispatch` (`ol`) — The Thin Shell

### What it does

Allocate identity (session id + 8-char `short` + job dir), run the gate, create the job temp dir, and delegate. On failure it cleans up the job dir for the *non-daemon-managed* sources only.

```javascript
// ============================================
// unifiedBgDispatch - allocate identity, run gate, delegate to worker
// Location: cli_inner_pretty.js:541769-541788
// ============================================

// ORIGINAL (for source lookup):
async function ol(H, $, q = "shell", K, _, z, A) {
  let Y = Bwz(H);
  if (Y) return { ok: !1, error: Y, reason: "gate_blocked" };
  let f = $ ?? HH9.randomUUID(),
    O = A ?? f.slice(0, 8),
    M = m9(O);
  try {
    return (
      await KKH.mkdir(vqq.join(M, "tmp"), { recursive: !0 }),
      await ywz(H, q, K, _, z, { sessionId: f, short: O, jobDir: M, freshDir: $ === void 0 })
    );
  } catch (j) {
    if (q !== "fleet" && q !== "spare") await KKH.rm(M, { recursive: !0, force: !0 }).catch(() => {});
    return {
      ok: !1,
      error: `Couldn't start the session — ${TH(j)}`,
      reason: `spawn_failed_${CY(j) ?? "unknown"}`,
    };
  }
}

// READABLE (for understanding):
async function unifiedBgDispatch(argv, providedSessionId, source = "shell", cwd, sessionConfig, reattachEnv, providedShort) {
  let gateError = bgDispatchGate(argv);
  if (gateError) return { ok: false, error: gateError, reason: "gate_blocked" };

  let sessionId = providedSessionId ?? crypto.randomUUID();
  let short     = providedShort ?? sessionId.slice(0, 8);   // 8-char display id
  let jobDir    = jobDirFor(short);

  try {
    await fsp.mkdir(path.join(jobDir, "tmp"), { recursive: true });
    return await dispatchWorker(argv, source, cwd, sessionConfig, reattachEnv, {
      sessionId, short, jobDir, freshDir: providedSessionId === undefined,
    });
  } catch (err) {
    // For shell/repl, the caller owns the dir → clean up on failure.
    // For fleet/spare, the daemon owns the dir → leave it (respawn / pre-warm reuse).
    if (source !== "fleet" && source !== "spare")
      await fsp.rm(jobDir, { recursive: true, force: true }).catch(() => {});
    return {
      ok: false,
      error: `Couldn't start the session — ${describeError(err)}`,
      reason: `spawn_failed_${errnoOf(err) ?? "unknown"}`,
    };
  }
}

// Mapping: ol→unifiedBgDispatch, Bwz→bgDispatchGate, ywz→dispatchWorker, m9→jobDirFor,
//   HH9→crypto, KKH→fsp, vqq→path, H→argv, $→providedSessionId, q→source, K→cwd,
//   _→sessionConfig, z→reattachEnv, A→providedShort, f→sessionId, O→short, M→jobDir
```

### How it works (step by step)

1. **Gate first** (541770). `bgDispatchGate` (`Bwz`) scans the pre-`--` argv for dangerous permission modes and returns a human-readable refusal string, or `null`. A non-null gate value short-circuits with `reason:"gate_blocked"` — no job dir is created, no daemon contacted.
2. **Identity** (541772-541774). If the caller passed a session id (resume/respawn paths do), reuse it; otherwise mint a v4 UUID. `short` is the first 8 hex chars (the user-facing job id shown in `claude agents`). `freshDir` records whether this is a brand-new session (`providedSessionId === undefined`), used downstream to decide whether to read pre-existing state.
3. **Make the temp dir** (541777). `<jobDir>/tmp` is created recursively, which also creates `<jobDir>` — the per-job state directory under the bg root (`m9` = `join(bgRoot(), short)`, cli_inner_pretty.js:183892).
4. **Delegate** (541778) to `dispatchWorker` (`ywz`), which does everything substantive.
5. **Failure cleanup discriminated by source** (541781). Only `shell` and `repl` sessions get their job dir removed on failure. `fleet` and `spare` are **daemon-owned**: a fleet respawn or a pre-warmed spare must keep its dir so the daemon can retry or reuse it.

### Why a thin shell + heavy worker split

`ol` owns the two cross-cutting concerns that every dispatch needs regardless of source — **the gate** and **identity/dir allocation** — and wraps the worker in a `try/catch` so any throw from argv parsing, state writes, or the daemon send becomes a typed `{ ok:false, reason }` instead of an unhandled rejection. Splitting parsing/launch/seed/send into `ywz` keeps `ol` small enough to be the obvious "one true entry point" that all six call sites can target, which is exactly the architectural goal: a single seam means the gate can never be bypassed and identity allocation is never duplicated.

---

## The Source Discriminator

`ywz`'s second parameter, `source` (`$`), is a 4-value string union that selects subtly different behavior at five points. It is the spine of the whole function.

| `source` | Set by | Origin |
|----------|--------|--------|
| `"shell"` (default) | `hwz` (CLI `--bg`/`--exec`), 541974/541992 | Command line |
| `"fleet"` | `pe4` (bang in agents view), `C6$` respawn 541234, spare-create | The `claude agents` UI / daemon |
| `"repl"` | `/bg` handoff (mapped to `"slash"` in the record) | Interactive REPL session |
| `"spare"` | pre-warm worker creation | Daemon pre-warming |

Where `source` changes behavior in `ywz`:

1. **Session-id warning** (541818): only `"shell"` warns about an ignored `--session-id`.
2. **No-agent-named warning** (541823): only `"shell"` warns when `--agent X` names an unknown agent.
3. **Seed-state write** (541831): skipped entirely for `"fleet"` and `"spare"` — those callers seed their own state (`pe4` writes via `qA(... O$H({template: Xwz ...}))` at 541038; spare seeds via its claim record). Only `shell`/`repl` seed inside `ywz`.
4. **Bg isolation** (541810): `"repl"` forces `bgIsolation:"none"` (the REPL handoff inherits the foreground session's environment, not an isolated worktree).
5. **Record `source` field** (541875): `"repl"` is rewritten to `"slash"` in the persisted record; the other three pass through.

The cleanup guard in `ol` (541781) consults the same discriminator: daemon-owned (`fleet`/`spare`) dirs survive failures, caller-owned (`shell`/`repl`) dirs are removed.

---

## Pre-Dispatch Gate `bgDispatchGate` (`Bwz`)

### What it does

Refuse a bg dispatch that would silently run with elevated permissions the user has never opted into. Two cases: `bypassPermissions`/`--dangerously-skip-permissions` without a prior accepted disclaimer, and `auto` mode without a prior opt-in.

```javascript
// ============================================
// bgDispatchGate - block bypass/auto bg dispatch unless previously opted in
// Location: cli_inner_pretty.js:542514-542529
// ============================================

// ORIGINAL (for source lookup):
function Bwz(H) {
  let $ = H.indexOf("--"),
    q = $ >= 0 ? H.slice(0, $) : H,
    K = al("--permission-mode", q);
  if (
    (K === "bypassPermissions" ||
      q.includes("--dangerously-skip-permissions") ||
      q.includes("--allow-dangerously-skip-permissions")) &&
    !TB() &&
    !b$().bypassPermissionsModeAccepted
  )
    return "--bg with bypassPermissions requires accepting the disclaimer first. Run `claude --dangerously-skip-permissions` once interactively.";
  if (K === "auto" && !lQ())
    return "--bg with auto mode requires opting in first. Run `claude --permission-mode auto` once interactively.";
  return null;
}

// READABLE (for understanding):
function bgDispatchGate(argv) {
  let dashDash = argv.indexOf("--");
  let preArgs = dashDash >= 0 ? argv.slice(0, dashDash) : argv;   // ignore everything after "--"
  let permMode = findFlagValue("--permission-mode", preArgs);

  let wantsBypass =
    permMode === "bypassPermissions" ||
    preArgs.includes("--dangerously-skip-permissions") ||
    preArgs.includes("--allow-dangerously-skip-permissions");
  if (wantsBypass && !isManagedBypassEnv() && !readConfig().bypassPermissionsModeAccepted)
    return "--bg with bypassPermissions requires accepting the disclaimer first. " +
           "Run `claude --dangerously-skip-permissions` once interactively.";

  if (permMode === "auto" && !autoModeOptedIn())
    return "--bg with auto mode requires opting in first. " +
           "Run `claude --permission-mode auto` once interactively.";

  return null;   // pass
}

// Mapping: Bwz→bgDispatchGate, al→findFlagValue, TB→isManagedBypassEnv,
//   b$→readConfig, lQ→autoModeOptedIn, H→argv, q→preArgs, K→permMode
```

### Why this approach

A background agent runs **detached**, with no interactive terminal to show the bypass disclaimer or the auto-mode consent prompt. If `--bg --dangerously-skip-permissions` were allowed cold, a user could grant unattended, unconfirmed, irreversible permissions to a fire-and-forget worker. The gate makes the elevated mode require a **prior interactive acceptance** (`bypassPermissionsModeAccepted` in config, or `autoModeOptedIn()`), with an actionable error telling the user the exact one-time interactive command to run. The managed-environment escape hatch (`TB()`) lets enterprise-managed installs that have already accepted bypass at the policy level skip the per-user disclaimer.

**Key insight:** the gate parses *only the pre-`--` argv* (542515). Everything after `--` is the prompt/command payload, which must never be interpreted as flags — a prompt that happens to contain the literal string `--dangerously-skip-permissions` does not trip the gate. This `--` split is repeated in every argv helper in this module (`mwz`, `Uwz`, `_H9`, `uwz`, `hwz`, `ywz`).

The 2.1.142 precursor of this gate was `coerceDispatchDefaults` (`gg4`, see [dispatch_flags.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/dispatch_flags.md)), which validated the same two modes in the *agents-view defaults* path. In 2.1.156 the check moved up into `ol`'s prologue so it applies uniformly to **all** sources, including the new shell/exec path.

---

## Launch-Mode Selection — `exec` vs `resume` vs `prompt`

The heart of `ywz` is the `launch` object it builds (cli_inner_pretty.js:541877-541886). The daemon reads `launch.mode` to decide what process to spawn. There are three modes, chosen by a strict priority cascade.

```javascript
// ============================================
// dispatchWorker.launch - three-way launch-mode selection
// Location: cli_inner_pretty.js:541877-541887
// ============================================

// ORIGINAL (for source lookup):
launch: K?.exec
  ? { mode: "exec", ...Ewz(K.exec) }
  : Z && L !== void 0
    ? {
        mode: "resume",
        sessionId: L,
        fork: !I && (W || C.length > 0),
        flagArgs: [...G, ...(M >= 0 ? H.slice(M) : [])],
      }
    : { mode: "prompt", args: [...b, ...mwz(H)] },
respawnFlags: G,

// READABLE (for understanding):
launch: sessionConfig?.exec
  // 1) EXEC: caller passed an exec command → run it under the shell.
  ? { mode: "exec", ...shellLaunchSpec(sessionConfig.exec) }       // {cmd, args:["-c", command]}
  // 2) RESUME: argv has -c/--continue/-r/--resume AND a resolvable target id.
  : hasResumeFlag && resumeSessionId !== undefined
    ? {
        mode: "resume",
        sessionId: resumeSessionId,
        fork: !sameSession && (hasForkSession || forkInjected.length > 0),
        flagArgs: [...respawnFlags, ...(dashDash >= 0 ? argv.slice(dashDash) : [])],
      }
    // 3) PROMPT: default — seed a fresh bg session, replay --session-id-stripped argv.
    : { mode: "prompt", args: [...sessionIdArgs, ...stripSessionIdArgs(argv)] },
respawnFlags,

// Mapping: K.exec→sessionConfig.exec, Ewz→shellLaunchSpec, Z→hasResumeFlag,
//   L→resumeSessionId, I→sameSession, W→hasForkSession, C→forkInjected,
//   G→respawnFlags, M→dashDash, b→sessionIdArgs, mwz→stripSessionIdArgs, H→argv
```

### Priority cascade walkthrough

The local variables this depends on are computed at 541790-541817:

- `dashDash` (`M`) = `argv.indexOf("--")` (541791) — the prompt/command boundary.
- `argvHead` (`j`) = pre-`--` argv (541792) — flags only.
- `agent` (`w`) = value of `--agent` in head (541793).
- `nameArg` (`J`) = `--name`/`-n` value; `name` (`X`) = nameArg or `sessionConfig.name` (541795-541796).
- `resumeSessionId` (`L`) = `extractResumeSessionId(argvHead)` (`_H9`, 541797).
- `prompt` (`P`) = post-`--` joined, else `firstPositionalAsIntent(argv, resumeSessionId)` (`Uwz`) (541798).
- `hasResumeFlag` (`Z`) = head contains `-c`/`--continue`/`-r`/`--resume`/`--resume=`/`-r=` (541799-541807).
- `hasForkSession` (`W`) = head contains `--fork-session` (541808).
- `respawnFlags` (`G`) = `collectRespawnFlags(argvHead)` (`zH9`, 541809).
- `sameSession` (`I`) = `resumeSessionId !== undefined && resumeSessionId === sessionId` (541815) — resuming *this very* session.
- `forkInjected` (`C`) = `hasResumeFlag && !hasForkSession ? ["--fork-session"] : []` (541816).
- `sessionIdArgs` (`b`) = `sameSession ? [] : ["--session-id", sessionId, ...forkInjected]` (541817).

**1. exec wins outright.** If `sessionConfig.exec` is set (the only way that happens is the exec source — `hwz`/`pe4`/`q5q` pass `{intent, exec}`), the launch is `{mode:"exec", cmd, args}` from `shellLaunchSpec`. The argv is `[]` in all exec call sites (`hwz` calls `ol([], …)`; `pe4` calls `ol([], …)`), so resume/prompt branches are unreachable for exec.

**2. resume.** When the user passed a resume/continue flag *and* a target id resolves, the daemon resumes that session. `fork` is true when we are **not** resuming our own id and a fork was requested (explicit `--fork-session`) or injected (`forkInjected`). The injection logic (541816) is subtle: a bare `--continue`/`--resume` from a foreground REPL **forces a fork** so the bg worker doesn't fight the foreground session for the same conversation file — *except* when resuming this exact session id (`sameSession`), where no fork flag is added (`forkInjected` is then irrelevant because `sessionIdArgs` is empty too).

**3. prompt (default).** A fresh interactive bg session that receives a one-shot prompt. The argv replayed to the worker is `[...sessionIdArgs, ...stripSessionIdArgs(argv)]` — the worker gets the canonical `--session-id <id>` (so the daemon controls identity) followed by the user's argv with any *user-supplied* `--session-id` stripped out.

### `stripSessionIdArgs` (`mwz`) — why strip then re-add

```javascript
// ============================================
// stripSessionIdArgs - drop user --session-id from prompt-mode argv tail
// Location: cli_inner_pretty.js:542497-542513
// ============================================

// ORIGINAL (for source lookup):
function mwz(H) {
  let $ = [];
  for (let q = 0; q < H.length; q++) {
    let K = H[q];
    if (K === "--") { $.push(...H.slice(q)); break; }
    if (K.startsWith("--session-id=")) continue;
    if (K === "--session-id") {
      if (H[q + 1] !== void 0 && !H[q + 1].startsWith("-")) q++;
      continue;
    }
    $.push(K);
  }
  return $;
}

// READABLE (for understanding):
function stripSessionIdArgs(argv) {
  let out = [];
  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === "--") { out.push(...argv.slice(i)); break; }       // pass prompt through verbatim
    if (arg.startsWith("--session-id=")) continue;                 // drop "--session-id=X"
    if (arg === "--session-id") {                                  // drop "--session-id X"
      if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("-")) i++;  // skip its value too
      continue;
    }
    out.push(arg);
  }
  return out;
}

// Mapping: mwz→stripSessionIdArgs, H→argv, $→out, K→arg
```

The daemon is the source of truth for the bg session id (it minted it in `ol`). A user who typed `claude --bg --session-id myid "do X"` should not have *their* id win — `mwz` removes it, and `ywz` re-prepends the daemon's canonical `["--session-id", <minted>]` (`sessionIdArgs`). This is the argv-level counterpart to the human-facing warning at 541818. Note `mwz` copies the entire post-`--` tail untouched, so a prompt containing `--session-id` literally is preserved.

### `firstPositionalAsIntent` (`Uwz`) and `extractResumeSessionId` (`_H9`)

When there is no `--` boundary, `Uwz` (542530) derives the human-readable `intent` from the **last** non-flag positional that isn't the resume id, skipping value-bearing flags via the `hqq` keep-set (542624). `_H9` (542463) extracts the resume target from `--resume`/`-r`/`--resume=`/`-r=` (stopping at `--`). Together they let `claude --bg --resume abc123 "tweak the parser"` produce `resumeSessionId="abc123"` and `intent="tweak the parser"`.

---

## Shell Launch `shellLaunchSpec` (`Ewz`) and the Exec Template

```javascript
// ============================================
// shellLaunchSpec - build the $SHELL -c <command> launch (cross-platform)
// Location: cli_inner_pretty.js:541727-541736
// ============================================

// ORIGINAL (for source lookup):
function Ewz(H) {
  return (
    PU$(),
    process.env.SHELL
      ? { cmd: process.env.SHELL, args: ["-c", H] }
      : n$() === "windows"
        ? { cmd: process.env.COMSPEC || "cmd.exe", args: ["/d", "/s", "/c", H] }
        : { cmd: "/bin/sh", args: ["-c", H] }
  );
}

// READABLE (for understanding):
function shellLaunchSpec(command) {
  ensureShellInitialized();                                  // PU$()
  if (process.env.SHELL)
    return { cmd: process.env.SHELL, args: ["-c", command] };          // user's login shell
  if (currentPlatform() === "windows")
    return { cmd: process.env.COMSPEC || "cmd.exe", args: ["/d", "/s", "/c", command] };
  return { cmd: "/bin/sh", args: ["-c", command] };          // POSIX fallback
}

// Mapping: Ewz→shellLaunchSpec, PU$→ensureShellInitialized, n$→currentPlatform, H→command
```

`shellLaunchSpec` is the entire reason exec sessions exist: instead of spawning a Claude agent process, the bg worker spawns a **plain shell** running the command. The launch spec prefers the user's `$SHELL` (so aliases / rc behavior match the user's terminal), falls back to `cmd.exe /d /s /c` on Windows and `/bin/sh -c` on POSIX.

The exec **template constant** is `execTemplate` (`Xwz` = `{ name: "exec", description: "" }`, cli_inner_pretty.js:541292). It is the marker that distinguishes a shell session in the persisted job record. `parseFleetDispatchInput` (`q5q`) and `fleetDispatchExec` (`pe4`) write it directly; `ywz` derives it from `sessionConfig.exec` (see next section).

---

## Seed-State Write — Template `exec` vs `bg`

For `shell`/`repl` sources, `ywz` writes the initial job state to disk *before* dispatching, so the agents view shows the new session immediately even if the daemon is slow.

```javascript
// ============================================
// dispatchWorker.seed - write initial job state for shell/repl sources
// Location: cli_inner_pretty.js:541831-541869
// ============================================

// ORIGINAL (for source lookup):
if ($ !== "fleet" && $ !== "spare") {
  let r = O ? null : await a7(f);
  if (r === null)
    g = qA(
      f,
      O$H({
        template: {
          name: K?.exec ? "exec" : (w ?? void 0 ?? "bg"),
          description: B?.whenToUse ?? R?.description ?? "",
          initialPrompt: B?.initialPrompt,
          color: B?.color,
        },
        routine: void 0,
        respawnFlags: h,
        intent: x,
        name: X,
        nameSource: J ? "user" : K?.nameSource,
        detail: K?.detail ?? (U ? (R ? `(idle — waiting for ${ie4(R.triggers)})` : kqq) : void 0),
        tempo: U ? (R ? "idle" : "blocked") : void 0,
        needs: U && !R ? x6$ : void 0,
        sessionId: A,
        cwd: q ?? C$(),
        /* …worktree / isolation / providerEnv / permission fields… */
      }),
    ).then(() => { Q = !0; })
     .catch((a) => N(`bg seed state write failed: ${TH(a)}`, { level: "warn" }));
  else if (h.length > 0 && r.respawnFlags.length === 0)
    g = qA(f, { ...r, respawnFlags: h }).catch((a) => N(`bg respawnFlags patch failed: ${TH(a)}`, { level: "warn" }));
}

// READABLE (for understanding):
if (source !== "fleet" && source !== "spare") {
  let existing = freshDir ? null : await readJobState(jobDir);
  if (existing === null) {
    // First write for this job dir → full seed.
    seedPromise = writeJobState(jobDir, buildJobRecord({
      template: {
        name: sessionConfig?.exec ? "exec" : (agent ?? "bg"),   // exec marker, else agent, else "bg"
        description: agentDef?.whenToUse ?? routine?.description ?? "",
        initialPrompt: agentDef?.initialPrompt,
        color: agentDef?.color,
      },
      respawnFlags: collectedRespawnFlags,                       // h (= exec? G : zH9(G))
      intent,                                                    // x = sessionConfig.intent ?? prompt ?? ""
      name,
      nameSource: nameArg ? "user" : sessionConfig?.nameSource,
      detail: sessionConfig?.detail ?? (isIdle
        ? (routine ? `(idle — waiting for ${formatTriggers(routine.triggers)})` : idlePlaceholderDetail)
        : undefined),
      tempo: isIdle ? (routine ? "idle" : "blocked") : undefined,
      needs: isIdle && !routine ? idleNeedsHint : undefined,
      sessionId, cwd: cwd ?? processCwd(),
      /* …worktree / isolation / providerEnv / permission fields… */
    })).then(() => { wroteFreshSeed = true; })
       .catch((e) => log(`bg seed state write failed: ${describeError(e)}`, { level: "warn" }));
  } else if (collectedRespawnFlags.length > 0 && existing.respawnFlags.length === 0) {
    // Re-dispatch over an existing dir that has no respawnFlags yet → patch them in.
    seedPromise = writeJobState(jobDir, { ...existing, respawnFlags: collectedRespawnFlags })
      .catch((e) => log(`bg respawnFlags patch failed: ${describeError(e)}`, { level: "warn" }));
  }
}

// Mapping: qA→writeJobState, O$H→buildJobRecord, a7→readJobState, K.exec→sessionConfig.exec,
//   w→agent, B→agentDef, R→routine, h→collectedRespawnFlags, x→intent, X→name,
//   J→nameArg, U→isIdle, kqq→idlePlaceholderDetail, x6$→idleNeedsHint, ie4→formatTriggers,
//   A→sessionId, O→freshDir, Q→wroteFreshSeed, f→jobDir
```

### Template name decision (541838)

`name: K?.exec ? "exec" : (w ?? void 0 ?? "bg")` — the ternary cascade:

1. If `sessionConfig.exec` is set → template name is `"exec"` (shell session).
2. Else if `--agent X` was given → template name is the agent type.
3. Else → `"bg"` (a plain background Claude session).

This is the on-disk discriminator the supervisor's respawn logic keys off (`isExecSession` checks `template === "exec"`).

### `respawnFlags` collection — `h` (541814)

`respawnFlags` (`h`) = `dashDash >= 0 ? collectRespawnFlags(...) : collectRespawnFlags(...)` — actually `h = M >= 0 ? G : zH9(G)` (541814). When there is a `--` boundary the already-collected `G` is reused; otherwise `collectRespawnFlags` is applied again to normalize. `collectRespawnFlags` (`zH9`, 542542) keeps only flags worth replaying on respawn: value-bearing flags from the keep-set `hqq` (542624 — `--model`, `--agent`, `--effort`, `--add-dir`, `--mcp-config`, `--settings`, etc., with their values) and boolean flags from `pwz` (542669 — `--dangerously-skip-permissions`, `--strict-mcp-config`, `--reply-on-resume`, …). Positionals and unknown value-bearing flags are dropped. These are the flags the daemon will replay if it has to respawn the worker (e.g. after a crash or an upgrade) — see [worker_state_machine.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md).

### The respawnFlags back-patch (541867)

If the job dir already exists (a re-dispatch over an existing session) and has empty `respawnFlags`, but this dispatch *does* carry flags, `ywz` patches them in. This repairs older job records that were seeded before any flags were known.

---

## Idle-Placeholder Logic (`isIdle`, `kqq`, `x6$`)

A bg session with no agent, no intent, and no detail is "idle waiting for a first prompt." `ywz` detects this at 541828:

```
isIdle (U) = !agent && intent === "" && !sessionConfig.detail        // 541828
```

When idle, the seed record gets cosmetic placeholders so the agents view shows a helpful "needs input" state instead of a blank row:

- `detail` → `idlePlaceholderDetail` (`kqq` = `"(idle — send a prompt to start)"`, cli_inner_pretty.js:542585/542623) for a non-routine idle session, or `"(idle — waiting for <triggers>)"` for a routine.
- `tempo` → `"blocked"` (non-routine) or `"idle"` (routine) (541849).
- `needs` → `idleNeedsHint` (`x6$` = `"send a prompt to start"`, cli_inner_pretty.js:542584) when idle and not a routine (541850).

The two strings are defined together in the module init (542584-542623): `x6$` is the short "needs" hint, and `kqq` is built from it: `` kqq = `(idle — ${x6$})` ``. An exec session is **never** idle in this sense — `sessionConfig.exec` makes `intent = exec` non-empty (541827: `x = K?.intent ?? P ?? ""`, and exec callers set `intent`), so `isIdle` is false and no placeholder is written. The standalone seed writer `seedBgState` (`Nqq`, 541737) uses the same `kqq`/`x6$` placeholders for the non-`ywz` seed path (e.g. the daemon-side fork seed).

---

## Dispatch Send + Rescue Path (`tengu_bg_dispatch_rescued`)

After seeding, `ywz` builds the dispatch payload `l` (541870-541902) and sends it via `sendDispatch` (`Tqq`, 541571) concurrently with the seed write:

```
let [, c] = await Promise.all([seedPromise ?? Promise.resolve(), Tqq(dispatchPayload)]);   // 541903
```

Notice `Tqq` itself discriminates on `source`: `H.source === "shell" ? my$() : EF({forceTransient:true})` (541574) — shell sessions ensure the *persistent* daemon is up (`my$`), other sources may use a transient daemon. If the send is `ok`, `ywz` returns success (541904).

The interesting part is the **rescue path** for three transient failure reasons.

```javascript
// ============================================
// dispatchWorker.rescue - recover ack-timeout / enoconn / estarting when worker is actually live
// Location: cli_inner_pretty.js:541905-541935
// ============================================

// ORIGINAL (for source lookup):
if (c.reason === "ack-timeout" || c.reason === "enoconn" || c.reason === "estarting") {
  let r = await bO({ proto: k5, op: "list" });
  if (r.ok && r.op === "list" && r.jobs.some((a) => a.short === Y && a.nonce === c.nonce && !a.outcome))
    return (
      N(`bg: daemon dispatch ${c.reason} but worker is live`, { level: "warn" }),
      await fQ("tengu_bg_dispatch_rescued", {
        reason_ack_timeout: c.reason === "ack-timeout",
        reason_enoconn: c.reason === "enoconn",
        reason_estarting: c.reason === "estarting",
      }),
      { ok: !0, short: Y, sessionId: A, idle: U, name: X, rescued: !0 }
    );
  if (c.reason === "ack-timeout" && r.ok && r.op === "list" && !r.jobs.some((a) => a.short === Y)) {
    let a = await bO(
      { proto: k5, op: "dispatch", d: { ...l, nonce: c.nonce }, timeoutMs: 5000 },
      { timeoutMs: 6000 },
    );
    if (a.ok && a.op === "dispatch")
      return (
        N(`bg: ack-timeout recovered via redispatch (${Y})`, { level: "warn" }),
        await fQ("tengu_bg_dispatch_rescued", { reason_ack_timeout: !0, reason_enoconn: !1, reason_estarting: !1, via_redispatch: !0 }),
        { ok: !0, short: Y, sessionId: A, idle: U, name: X, rescued: !0 }
      );
  }
}

// READABLE (for understanding):
if (sendResult.reason === "ack-timeout" || sendResult.reason === "enoconn" || sendResult.reason === "estarting") {
  let listing = await daemonCall({ proto: PROTO, op: "list" });
  // CASE A: the worker with our short + our nonce exists and hasn't settled → it really launched.
  if (listing.ok && listing.op === "list" &&
      listing.jobs.some((j) => j.short === short && j.nonce === sendResult.nonce && !j.outcome)) {
    log(`bg: daemon dispatch ${sendResult.reason} but worker is live`, { level: "warn" });
    await emitTelemetry("tengu_bg_dispatch_rescued", {
      reason_ack_timeout: sendResult.reason === "ack-timeout",
      reason_enoconn:     sendResult.reason === "enoconn",
      reason_estarting:   sendResult.reason === "estarting",
    });
    return { ok: true, short, sessionId, idle: isIdle, name, rescued: true };
  }
  // CASE B: ack-timeout AND our short is absent from the listing → the dispatch was lost; redispatch once.
  if (sendResult.reason === "ack-timeout" && listing.ok && listing.op === "list" &&
      !listing.jobs.some((j) => j.short === short)) {
    let redo = await daemonCall(
      { proto: PROTO, op: "dispatch", d: { ...dispatchPayload, nonce: sendResult.nonce }, timeoutMs: 5000 },
      { timeoutMs: 6000 });
    if (redo.ok && redo.op === "dispatch") {
      log(`bg: ack-timeout recovered via redispatch (${short})`, { level: "warn" });
      await emitTelemetry("tengu_bg_dispatch_rescued", { reason_ack_timeout: true, reason_enoconn: false, reason_estarting: false, via_redispatch: true });
      return { ok: true, short, sessionId, idle: isIdle, name, rescued: true };
    }
  }
}

// Mapping: bO→daemonCall, k5→PROTO, fQ→emitTelemetry, Y→short, A→sessionId,
//   U→isIdle, X→name, c→sendResult, l→dispatchPayload, r→listing
```

### The race this fixes

The daemon dispatch protocol is request/ack. Under load (or a daemon that's still starting — `estarting`), the **ack can be lost or arrive late** even though the worker process actually spawned. Without the rescue, `ywz` would report a spawn failure and the user would see an error for a worker that is happily running. The rescue distinguishes two sub-cases using the **nonce** (a per-dispatch random 4-byte hex token, minted in `Tqq` at 541590):

- **Case A — phantom failure.** List the daemon's jobs; if our `short` + `nonce` is present and unsettled, the worker is live — return success with `rescued:true`.
- **Case B — genuinely lost dispatch** (ack-timeout only). If our `short` is *absent* from the listing, the dispatch was lost in flight; **redispatch once** with the same nonce (so the daemon can dedupe if it secretly succeeded). If the redispatch acks, return success.

Both cases emit `tengu_bg_dispatch_rescued` with reason flags so the reliability of the dispatch path can be measured. The CLI handler `hwz` also logs `pn8("cli_bg_dispatch", "rescued")` when `z.rescued` is set (542000).

**Key insight:** the nonce is what makes the redispatch *safe*. If the original dispatch actually reached the daemon but only the ack was lost, the daemon sees the same nonce on redispatch and treats it as idempotent rather than spawning a duplicate worker.

---

## The Exec-Respawn Special Case

Exec (shell) sessions get two special treatments in the respawn machinery, both keyed on the predicate `isExecSession` (`ujH`):

```javascript
// ============================================
// isExecSession - exec template with no respawn flags
// Location: cli_inner_pretty.js:184286-184288
// ============================================

// ORIGINAL (for source lookup):
function ujH(H) { return H.template === "exec" && H.respawnFlags.length === 0; }

// READABLE (for understanding):
function isExecSession(state) {
  return state.template === "exec" && state.respawnFlags.length === 0;
}

// Mapping: ujH→isExecSession, H→state
```

### Special case 1 — explicit respawn re-runs the command (`respawnJob` / `C6$`)

When a user explicitly respawns a settled exec session (e.g. "run again" in the agents view), `respawnJob` (`C6$`, 541152) must re-execute the original shell command, **not** replay flags as if it were a Claude session.

```javascript
// ============================================
// respawnJob.execBranch - re-run the command, never replay flags
// Location: cli_inner_pretty.js:541210-541234
// ============================================

// ORIGINAL (for source lookup):
let D = K.template === "exec" && K.respawnFlags.length === 0 ? K.intent : void 0,
  J = D
    ? []
    : A.respawnFlags.length > 0
      ? A.respawnFlags
      : K.routine ? ["--routine", K.routine]
        : K.template !== "bg" ? ["--agent", K.template] : [],
  X = D ? void 0 : ($?.initialPrompt ?? (w ? void 0 : K.intent)),
  L = [...(w && !D ? ["--resume", M] : []), ...J, ...(X ? ["--", X] : [])],
  /* … */
  W = D || K.bgIsolation === "none" || /* … */ ? { ...(D && { intent: D, exec: D }), /* … */ } : void 0,
  G = await ol(L, M, "fleet", K.cwd, W, P, H);

// READABLE (for understanding):
let execCommand = isExecSession(state) ? state.intent : undefined;   // the persisted shell command

let flagArgs = execCommand
  ? []                                                  // EXEC: never replay any flags
  : prior.respawnFlags.length > 0 ? prior.respawnFlags
    : state.routine ? ["--routine", state.routine]
      : state.template !== "bg" ? ["--agent", state.template] : [];

let promptArg = execCommand
  ? undefined                                           // EXEC: no prompt; the command IS the work
  : (agentDef?.initialPrompt ?? (hasResumeJsonl ? undefined : state.intent));

let argv = [
  ...(hasResumeJsonl && !execCommand ? ["--resume", resumeId] : []),
  ...flagArgs,
  ...(promptArg ? ["--", promptArg] : []),
];

let sessionConfig =
  execCommand || state.bgIsolation === "none" || /* providerEnv/perm/memory */ ? {
    ...(execCommand && { intent: execCommand, exec: execCommand }),   // re-arm exec launch
    /* …isolation / providerEnv / permission / memory carried forward… */
  } : undefined;

let result = await unifiedBgDispatch(argv, resumeId, "fleet", state.cwd, sessionConfig, bridge, jobId);

// Mapping: D→execCommand, K→state, A→prior, J→flagArgs, X→promptArg, w→hasResumeJsonl,
//   M→resumeId, L→argv, W→sessionConfig, G→result, ol→unifiedBgDispatch
```

The decision is driven entirely by `execCommand = isExecSession(state) ? state.intent : undefined` (541210). When it's set:

- `flagArgs = []` — **no flags are ever replayed**. A shell command is just a command; replaying `--model`/`--agent` etc. would be meaningless or harmful.
- `promptArg = undefined` — there is no prompt; the command is the entire job.
- `argv` reduces to `[]` (no resume, no flags, no prompt) — and `sessionConfig` carries `{intent: execCommand, exec: execCommand}` so `ol`→`ywz` rebuilds the exec launch via `shellLaunchSpec`.
- The re-dispatch goes through `ol(L, M, "fleet", ...)` (541234) — same single seam.

The "no replay flags" rule is precisely why `isExecSession` requires `respawnFlags.length === 0`: an exec session seeded by `hwz`/`pe4` has empty `respawnFlags` (exec callers pass `argv = []`, so `collectRespawnFlags([])` is `[]`). If somehow an exec record acquired respawn flags, it would no longer match `isExecSession` and would fall through to the normal Claude-session respawn — a deliberate fail-safe.

The re-armed record's state is reset to `starting` (541249-541252: `E = ... || !!D` forces a starting/idle reset for exec) so the agents view shows the re-run from scratch.

### Special case 2 — exec sessions are excluded from version-upgrade respawn (`SF.respawnIfIdleStale`)

```javascript
// ============================================
// SF.respawnIfIdleStale.execExclusion - never auto-respawn exec sessions on upgrade
// Location: cli_inner_pretty.js:560029-560030
// ============================================

// ORIGINAL (for source lookup):
async respawnIfIdleStale(H) {
  if (this.dispatch.launch.mode === "exec") return { respawned: !1, reason: "not-stale" };
  /* … version comparison, idle/attached/settled checks … */
}

// READABLE (for understanding):
async respawnIfIdleStale(pinnedSet) {
  if (this.dispatch.launch.mode === "exec")
    return { respawned: false, reason: "not-stale" };   // exec sessions opt OUT of upgrade respawn
  /* … */
}

// Mapping: SF.respawnIfIdleStale, this.dispatch.launch.mode → launch mode, H→pinnedSet
```

The supervisor's idle-stale respawn (`SF.respawnIfIdleStale`, 560029) is the **opportunistic upgrade** path: when the daemon's binary changes, idle/unattended Claude workers gracefully shut down and respawn under the new binary (see [worker_state_machine.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md)). The **very first line** short-circuits any worker whose `launch.mode === "exec"` (560030).

### Why exec persists its command but opts out of upgrade respawn

This is the central design tension of the whole feature, and the two special cases resolve it cleanly:

- **An exec session must persist its command** (`intent`) so an *explicit, user-initiated* "run again" can re-execute it. The command is the entire definition of the work, so it lives in the record.
- **An exec session must NOT be silently re-executed by the upgrade path.** A shell command like `npm publish` or `git push` or `rm -rf build/` is a **one-shot side-effecting action**. A Claude bg session is *idempotent-ish* (resuming a conversation is safe); a shell command is not. If the daemon upgraded itself at 3am and "helpfully" re-ran your `npm publish`, that would be a serious bug — exactly the kind of "pinned bg sessions respawning every minute after update" class of issue the 2.1.156 changelog targets.

So the rule is: **respawn an exec session only on explicit user intent (`C6$`), never on automatic upgrade (`SF.respawnIfIdleStale`).** The two predicates that enforce this are deliberately different surfaces — `isExecSession(state)` reads the persisted *record* (used by `C6$`, which works from on-disk state), while `launch.mode === "exec"` reads the live *dispatch object* (used by the supervisor, which holds the in-memory handle). Both resolve to the same concept from the two vantage points that need it.

**Key insight:** `respawnFlags.length === 0` is doing double duty. It's both (a) the marker that this is a *pure* exec session (no Claude flags), and (b) the guard that an exec record that somehow gained flags is treated as a normal session. The supervisor doesn't even need `isExecSession` — `launch.mode` is unambiguous in memory — but `C6$` works from disk where only the template+flags are available, so it uses the predicate.

---

## End-to-End: `claude --bg --exec "npm test"`

```
hwz(argv)  541956
 ├─ find "--exec" / "--exec=" in pre-`--` argv               541957-541958
 ├─ command = inline value (= form) OR everything after --exec  541960-541961
 ├─ empty? → "--exec requires a command." exit 1             541962-541966
 ├─ strip --bg/--background (ee4); read --name/-n            541968-541969
 ├─ warn about any other flag ("--exec ignores X")           541970-541973
 ├─ ol([], undefined, "shell", undefined, {intent, exec, name?})  541974
 │      │
 │      ├─ Bwz([])  → null (no perm flags)                   gate pass
 │      ├─ sessionId = randomUUID(); short = id[0:8]; mkdir  541772-541777
 │      └─ ywz([], "shell", undefined, {intent,exec,name}, …)
 │             ├─ launch = {mode:"exec", ...Ewz("npm test")} 541877-541878
 │             ├─ template name = "exec"  (Xwz marker)       541838
 │             ├─ isIdle = false (intent="npm test")         541828
 │             ├─ respawnFlags = []  (argv [] → zH9 [])      541809/541814
 │             ├─ seed state (qA/O$H, source=shell)          541834
 │             ├─ Tqq(payload)  → daemon (my$ persistent)    541903
 │             └─ rescue ack-timeout/enoconn if live         541905
 ├─ ok?  print  ny$(short, undefined, name||command)         541983-541987
 └─ !ok? Bn8("cli_bg_dispatch_exec", reason); exit 1         541976-541980
```

The agents-view bang path is the same launch, different front door: `q5q("!npm test", …)` (614292) returns `{template: qKH /*exec*/, exec:"npm test"}`, the view calls `pe4("npm test", …)` (541031) which seeds an `exec`-template record (541038) then `ol([], id, "fleet", cwd, {intent, exec})` (541047) — identical `ywz` exec launch, `source:"fleet"` (so `ywz` skips its own seed because `pe4` already wrote it).

---

## Cross-Validation with v2.1.88

Grepping the readable v2.1.88 source (`/lyz/codespace/3rd/claude-code/src`) for the defining symbols of this surface:

- `--exec` / `--bg` / `--background` CLI flags → **no matches** as bg-dispatch flags.
- `respawnFlags`, `nameSource`, `bgIsolation` → **no matches** anywhere.
- A unified dispatcher with `launch.mode` of `exec`/`resume`/`prompt` → **no equivalent**.
- `utils/background/` in 2.1.88 contains the *teammate/swarm* machinery (`spawnInProcess.ts`, `leaderPermissionBridge.ts`, `teammateInit.ts`, …) — a different, in-process model, not the daemon-dispatched single-seam architecture.

**Conclusion (confidence: high):** `ol`/`ywz`, the source discriminator, the three launch modes, the exec/shell session, `respawnFlags`, the seed-state writer, the ack-timeout rescue, and both exec-respawn special cases are **entirely new after v2.1.88**. The 2.1.142 tree already had the daemon dispatcher and the worker phase machine ([worker_state_machine.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/worker_state_machine.md)); v2.1.156's `ol`/`ywz` is the *evolution* of that dispatch surface that adds the first-class shell-exec source and the launch-mode abstraction. The closest 2.1.142 precursors are the agents-view dispatch flags (`Go6`/`hV$`/`gg4`, see [dispatch_flags.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/dispatch_flags.md)) and `coerceDispatchDefaults` (`gg4`) — the latter is the direct ancestor of `bgDispatchGate` (`Bwz`), now hoisted into the single seam.

---

## Summary of the New Exec Branches

| Location | Branch | Behavior |
|----------|--------|----------|
| `ywz` 541877 | `sessionConfig.exec` → `{mode:"exec", ...Ewz}` | Shell launch instead of agent launch |
| `ywz` 541838 | `sessionConfig.exec ? "exec" : agent ?? "bg"` | Template name = `"exec"` marker |
| `ol` 541781 | `source !== "fleet" && source !== "spare"` | Caller-owned dir cleanup on failure |
| `C6$` 541210 | `isExecSession(state) ? state.intent : undefined` | Respawn re-runs the command, **zero flags** |
| `SF.respawnIfIdleStale` 560030 | `launch.mode === "exec"` → `not-stale` | Exec excluded from upgrade respawn |
| `hwz` 541956 | `--exec` / `--exec=` parse + flag warnings | CLI entry for shell sessions |
| `q5q` 614292 | `!cmd` → `{template:exec, exec}` | Agents-view bang entry |
| `pe4` 541031 | seed `Xwz` then `ol([], …, "fleet", {intent, exec})` | Fleet-UI bang dispatch |
