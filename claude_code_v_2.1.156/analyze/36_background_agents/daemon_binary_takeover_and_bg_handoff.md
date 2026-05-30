# Daemon Binary-Takeover, Stale-Daemon Fallback (2.1.144/145/153) and bg-While-Responding Handoff

## TL;DR

This document covers two daemon-lifecycle deltas added across v2.1.143–156 plus the live-turn handoff that backgrounds an active session:

1. **Stale-exec fallback (2.1.144/145).** When a *service-installed* daemon exists but its launch binary was deleted out from under it (`claude daemon install` left a dangling exec path, e.g. after a package manager reshuffle), `ensureDaemonRunning` (`EF`, cli_inner_pretty.js:540124-540208) detects the dangling exec via `We4()`+`Gv8()`, emits `tengu_bg_daemon_service_stale_exec` (cli_inner_pretty.js:540130) and falls back to spawning a **transient** daemon instead of crash-looping on the dead service path.

2. **Binary-takeover (2.1.153).** A long-lived *transient* daemon started on an old binary stays alive after the user upgrades, so fresh `claude agents` / `claude --bg` sessions get attached to a daemon that predates binary-takeover support and never self-restarts. The fix is `takeoverStaleDaemon` (`Mwz`, cli_inner_pretty.js:540233-540291): gated by `tengu_bg_binary_takeover` (cli_inner_pretty.js:540247), it uses the comparator `isDaemonStaleVsClient` (`Owz`, cli_inner_pretty.js:540220-540232) — *transient-origin* **and** (client-version-greater **or** client-binary-mtime-newer) — to recognize a stale daemon, `SIGKILL`s it, and emits `tengu_bg_daemon_binary_takeover` (cli_inner_pretty.js:540288). The next dispatch then spawns a fresh daemon on the current binary.

3. **`/bg` while responding.** `backgroundCurrentSession` (`zh8`, cli_inner_pretty.js:542680-542731) hands the live turn off to a background worker by resuming the current session in a bg worker via the unified dispatcher `ol` with `--resume <id> --fork-session`, optionally `--reply-on-resume` (cli_inner_pretty.js:542698) when invoked mid-turn, and performs a **worktree handoff** when the foreground session owns a worktree. It prints the `(worktree handed off)` banner (cli_inner_pretty.js:542811) and emits `tengu_background_fork` (cli_inner_pretty.js:542800-542807) plus `tengu_background` (cli_inner_pretty.js:542723).

These complement two pre-existing self-restart paths already documented for v2.1.142: yield-takeover (`tengu_daemon_yield_takeover`, cli_inner_pretty.js:648590) and binary self-restart (`tengu_daemon_self_restart_on_upgrade`, cli_inner_pretty.js:648783). Confidence is **high** for takeover/handoff (all verified in the bundle); **low-to-medium** for the exact 2.1.154 `/logout` and `←←` arrow-view gate sites, which are covered at the changelog level only.

## Related Symbols

> Symbol mappings (tables live only in these index files — never in module docs):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (daemon/telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> See also the v2.1.142 reference: [../../../claude_code_v_2.1.142/analyze/36_background_agents/daemon_lifecycle.md](../../../claude_code_v_2.1.142/analyze/36_background_agents/daemon_lifecycle.md)

Key functions and constants in this document:
- `ensureDaemonRunning` (`EF`) — Ensure a daemon is reachable; stale-exec fallback to transient. (cli_inner_pretty.js:540124-540208)
- `waitDaemonReachable` (`fCH`) — Poll `ping` op until reachable or timeout. (cli_inner_pretty.js:540078-540085)
- `nudgeDaemonUntilConverged` (`Ywz`) — `nudge`-loop entry that invokes takeover before declaring "up". (cli_inner_pretty.js:540086-540123)
- `isServiceDaemonInstalled` (`We4`) — True if a service unit is registered (not transient). (cli_inner_pretty.js:540328-540331)
- `isDaemonStaleVsClient` (`Owz`) — Version/mtime comparator for stale-transient detection. (cli_inner_pretty.js:540220-540232)
- `takeoverStaleDaemon` (`Mwz`) — Gated SIGKILL of a stale transient daemon. (cli_inner_pretty.js:540233-540291)
- `realpathMtimeMs` (`Le4`) — Resolve realpath then return mtimeMs (null on ENOENT). (cli_inner_pretty.js:540209-540215)
- `currentLaunchTarget` (`fwz`) — The launcher's own exec path/prefix arg. (cli_inner_pretty.js:540216-540219)
- `daemonLabelForArgs` (`jwz`) — "claude agents" / "claude --bg" / "claude" label for spawn-by. (cli_inner_pretty.js:540332-540337)
- `backgroundCurrentSession` (`zh8`) — Resume the live session in a bg worker; worktree handoff. (cli_inner_pretty.js:542680-542731)
- `deriveBackgroundSeed` (`Ah8`) — Derive intent/name/detail seed from transcript. (cli_inner_pretty.js:542733-542762)
- `BackgroundForkPrompt` (`gwz`) — UI component that confirms then calls `zh8`. (cli_inner_pretty.js:542763-542829)
- `formatBgHints` (`ny$`) — "backgrounded · <short>" hint banner. (cli_inner_pretty.js:542079-542089)
- `bgFlagExecHandler` (`hwz`) — `--bg --exec` CLI handler. (cli_inner_pretty.js:541956-542006)
- `unifiedBgDispatch` (`ol`) — Shared bg-spawn entry (repl/shell/fleet/spare). (cli_inner_pretty.js:541769+)
- `runDaemonSupervisor` (daemon entry) — Yield-takeover + self-restart-on-upgrade events. (cli_inner_pretty.js:648570-648799)
- Telemetry: `tengu_bg_daemon_service_stale_exec` (540130), `tengu_bg_daemon_binary_takeover` (540288), `tengu_background_fork` (542800), `tengu_background` (542723/649882), `tengu_daemon_yield_takeover` (648590), `tengu_daemon_self_restart_on_upgrade` (648783)
- Gate: `tengu_bg_binary_takeover` (cli_inner_pretty.js:540247)

---

## Background: Three Ways a Daemon Becomes Stale

The on-demand daemon is the single-machine supervisor of background `claude` workers (see v2.1.142 `daemon_lifecycle.md`). After a binary upgrade, a daemon running on the *old* binary can become a liability in three distinct ways. Each has its own detection + remediation path, and the three layer on top of each other:

```
 Upgrade event (brew/npm/installer rewrites the claude binary)
   │
   ├── (A) The daemon is the one that NOTICES it is old
   │       → runDaemonSupervisor's 60s binary poll  → exits cleanly
   │         emits tengu_daemon_self_restart_on_upgrade (648783)     [v2.1.142]
   │
   ├── (B) A NEWER daemon starts and an OLD transient is running
   │       → new daemon asks old (transient) to yield via control sock
   │         emits tengu_daemon_yield_takeover (648590)              [pre-2.1.142]
   │
   └── (C) The daemon DOESN'T notice (started before binary-takeover
   │       support, or poll hasn't fired) and a CLIENT must displace it
   │       → ensureDaemonRunning path calls takeoverStaleDaemon (Mwz)
   │         SIGKILLs it, emits tengu_bg_daemon_binary_takeover (540288)  [v2.1.153]
   │
   └── (D) A SERVICE daemon's launch binary was deleted
           → ensureDaemonRunning sees dangling exec, falls back to transient
             emits tengu_bg_daemon_service_stale_exec (540130)       [v2.1.144/145]
```

Paths (A) and (B) are *daemon-side* (the daemon retires itself). Paths (C) and (D) are *client-side* — the launching `claude` process is responsible for cleaning up a daemon that failed to clean up after itself. (C) is precisely the 2.1.153 fix: it covers the case where the running daemon is so old it has no self-restart logic at all, so only the (upgraded) client can act.

---

## Part 1 — `ensureDaemonRunning` and the Stale-Exec Fallback

### The Algorithm

**What it does:** `ensureDaemonRunning` (`EF`, cli_inner_pretty.js:540124-540208) is the universal "make sure a daemon is reachable before I dispatch" entry. Every bg launch path (the `--bg` flag handler, `claude agents`, `--exec`) funnels through it. It returns `{ ok: true }` when a daemon is reachable, or an error / install-prompt descriptor otherwise.

**How it works (step-by-step):**

1. **Fast path.** Call `nudgeDaemonUntilConverged` (`Ywz`, cli_inner_pretty.js:540086) with `forceTransient` defaulted false. If it returns `"up"`, a daemon is already reachable; record `daemon_ensure_running` success and return `{ ok: true }` (cli_inner_pretty.js:540126). Note that `Ywz` is itself where binary-takeover (Part 2) gets a chance to fire — see below.

2. **Service-installed?** `q = await We4()` — is a service unit registered? (cli_inner_pretty.js:540127, 540328-540331). `We4` is false when `CLAUDE_CONFIG_DIR` is set or the platform service layer is unavailable.

3. **Stale-exec check.** `K = q && (await Gv8())` — if a service is installed *and* its launch target binary is gone (`Gv8` checks the dangling exec), set `K` true (cli_inner_pretty.js:540128). In that case:

```javascript
// ============================================
// ensureDaemonRunning - service stale-exec detection and transient fallback
// Location: cli_inner_pretty.js:540127-540135
// ============================================

// ORIGINAL (for source lookup):
let q = await We4(),
  K = q && (await Gv8());
if (K)
  (d("tengu_bg_daemon_service_stale_exec", {}),
    N(
      "daemon service exec path is stale (binary deleted) — falling back to transient spawn. Run 'claude daemon install' to repair.",
      { level: "warn" },
    ));
let _ = !1;

// READABLE (for understanding):
const serviceInstalled = await isServiceDaemonInstalled();
const serviceExecIsStale = serviceInstalled && (await serviceLaunchTargetMissing());
if (serviceExecIsStale) {
  emitTelemetry("tengu_bg_daemon_service_stale_exec", {});
  logWarn(
    "daemon service exec path is stale (binary deleted) — falling back to transient spawn. " +
    "Run 'claude daemon install' to repair.",
  );
}
let triedServiceRevive = false;

// Mapping: EF→ensureDaemonRunning, We4→isServiceDaemonInstalled, Gv8→serviceLaunchTargetMissing,
//          d→emitTelemetry, N→logWarn, q→serviceInstalled, K→serviceExecIsStale, _→triedServiceRevive
```

4. **Service-revive attempt (only when not stale).** `if (q && !K)` (cli_inner_pretty.js:540136): a service is installed and its exec is intact, so try to (re)start it via the service layer (`Zv8`), poll `waitDaemonReachable(5000)` (`fCH`), and emit `tengu_bg_daemon_install { via_service: true }`. If it became reachable, return `{ ok: true }`. If not, log `tengu_bg_daemon_service_poll_fallthrough` and fall through to transient spawn (cli_inner_pretty.js:540140-540159). **The `!K` is the crux**: when the exec is stale, we *skip* the service-revive attempt entirely and go straight to a transient daemon — there is no point asking the OS service manager to start a binary that no longer exists.

5. **Cold-start ask.** If there is no service, we're not forcing transient, the daemon-install policy is `"ask"`, and the user hasn't dismissed the prompt, return `{ ok: false, askInstall: true, … }` (cli_inner_pretty.js:540161-540169) so the caller can offer `claude daemon install`.

6. **Transient spawn.** Otherwise kill any zombie (`Pe4`, cli_inner_pretty.js:540292), then `spawn ["daemon","run","--origin","transient","--spawned-by", <label>]` (cli_inner_pretty.js:540176). The `--spawned-by` label comes from `daemonLabelForArgs` (`jwz`, cli_inner_pretty.js:540332-540337): `"claude agents"`, `"claude --bg"`, or `"claude"`. Poll `waitDaemonReachable(30000)` with a clock-jump re-poll (`f = elapsed > 60000`, cli_inner_pretty.js:540188), emit `tengu_bg_daemon_install { via_service: false }`, and on success call `wwz()` (the Linux `logind KillUserProcesses` warning, cli_inner_pretty.js:540338-540347) and return `{ ok: true }`.

### Why This Approach

- **Dangling-exec is unrecoverable via the service path.** A package upgrade can replace `/opt/homebrew/bin/claude` and prune the old Cellar entry the service unit pointed at. The OS service manager would just `ENOENT` on every restart attempt — an infinite, silent crash-loop. Detecting it up front (`Gv8`) and switching to a transient daemon spawned from the *current* binary keeps `claude agents` working until the user repairs the unit. The warning text explicitly tells them how: `Run 'claude daemon install' to repair.`
- **Transient is the safe lowest-common-denominator.** A transient daemon is spawned from `process.execPath`/the current launcher, which by definition exists and is the current version. It costs a few seconds to come up and idle-exits after 5 s of no clients (see v2.1.142 idle-exit), so the fallback has near-zero residual cost.
- **Telemetry separates the two service failure modes.** `tengu_bg_daemon_service_stale_exec` (binary gone) vs `tengu_bg_daemon_service_poll_fallthrough` (service binary present but didn't come up in 5 s) lets the team tell "broken install" apart from "slow/flaky service manager."

**Key insight:** The single `K = q && (await Gv8())` flag does double duty — it both suppresses the doomed service-revive attempt (`if (q && !K)`) *and* drives the user-facing diagnostic. This is the v2.1.144/145 reliability fix in one line: never thrash the OS service manager on a binary that has been deleted.

**Cross-validation (2.1.88):** `ensureDaemonRunning`, service-vs-transient origins, and the stale-exec detector are **NEW after 2.1.88** — the 2.1.88 tree has only the in-process Ctrl+B backgrounding hook (`src/hooks/useSessionBackgrounding.ts`), no separate daemon process. Confidence **high** that this is new; the daemon subsystem first appears in the 2.1.11x line documented under `claude_code_v_2.1.142`.

---

## Part 2 — Binary-Takeover of a Stale Transient Daemon (2.1.153)

This is the flagship reliability fix in this document. The scenario: a user runs `claude --bg` on v2.1.151, leaving a transient daemon alive; they `npm i -g @anthropic-ai/claude-code` to v2.1.156; then run `claude agents`. The old daemon is still listening on the control socket, still answers `nudge`, and — critically — was built *before* binary-takeover support, so it will never self-restart (Part (A) above doesn't apply). Without intervention, every new session attaches to the stale daemon and runs on the old binary's worker template.

### Where it fires: inside the nudge loop

`takeoverStaleDaemon` (`Mwz`) is called from `nudgeDaemonUntilConverged` (`Ywz`) the moment the daemon answers a `nudge` and reports it is *not* restarting:

```javascript
// ============================================
// nudgeDaemonUntilConverged - invoke binary-takeover before declaring the daemon "up"
// Location: cli_inner_pretty.js:540092-540098
// ============================================

// ORIGINAL (for source lookup):
let z = await bO({ proto: k5, op: "nudge" });
if (z.ok && z.op === "nudge") {
  if (((q = !0), !z.restarting)) {
    if (await Mwz(z.version, H)) return "down";
    if (Date.now() - $ > 200) d("tengu_bg_skew_nudge", { converged: !0, duration_ms: Date.now() - $ });
    return "up";
  }
  ...
}

// READABLE (for understanding):
const reply = await daemonControlRequest({ proto: PROTO, op: "nudge" });
if (reply.ok && reply.op === "nudge") {
  if (((sawAnyDaemon = true), !reply.restarting)) {
    if (await takeoverStaleDaemon(reply.version, forceTransient)) return "down"; // we killed it
    if (Date.now() - startedAt > 200) emitTelemetry("tengu_bg_skew_nudge", { converged: true, duration_ms: ... });
    return "up"; // daemon is current → reachable
  }
  ...
}

// Mapping: Ywz→nudgeDaemonUntilConverged, Mwz→takeoverStaleDaemon, bO→daemonControlRequest,
//          z→reply, q→sawAnyDaemon, H→forceTransient, $→startedAt
```

The key wiring: the daemon's `nudge` reply carries its own `version` string. `Mwz(z.version, …)` compares that against the *launching client's* compiled-in version. If `Mwz` returns `true` (it killed the daemon), `Ywz` returns `"down"` — which sends `ensureDaemonRunning` (Part 1) down the transient-spawn path to bring up a fresh daemon on the current binary.

### The comparator `isDaemonStaleVsClient` (`Owz`)

**What it does:** Decides whether a *running daemon* is older than *this client*, so the client is justified in killing it.

```javascript
// ============================================
// isDaemonStaleVsClient - transient-origin + (version-gt OR mtime-newer) comparator
// Location: cli_inner_pretty.js:540220-540232
// ============================================

// ORIGINAL (for source lookup):
function Owz(H) {
  if (H.daemonOrigin !== "transient") return !1;
  if (H.daemonVersion === H.clientVersion) return !1;
  if (H.daemonTarget === H.clientTarget) return !1;
  if (!H.daemonTarget)
    return (
      uy$.valid(H.clientVersion) !== null &&
      uy$.valid(H.daemonVersion) !== null &&
      uy$.gt(H.clientVersion, H.daemonVersion)
    );
  if (H.clientMtimeMs === null || H.daemonMtimeMs === null) return !1;
  return H.clientMtimeMs > H.daemonMtimeMs;
}

// READABLE (for understanding):
function isDaemonStaleVsClient(info) {
  // Only a TRANSIENT daemon may be displaced — a service daemon is the user's explicit choice.
  if (info.daemonOrigin !== "transient") return false;
  // Same version → not stale.
  if (info.daemonVersion === info.clientVersion) return false;
  // Same launch binary on disk → not stale (avoids killing our own/equivalent binary).
  if (info.daemonTarget === info.clientTarget) return false;

  if (!info.daemonTarget) {
    // Daemon didn't record its launch target (older builds): fall back to SEMVER comparison.
    return (
      semver.valid(info.clientVersion) !== null &&
      semver.valid(info.daemonVersion) !== null &&
      semver.gt(info.clientVersion, info.daemonVersion)
    );
  }
  // Both have launch targets: compare binary mtimes; the client must be the strictly newer build.
  if (info.clientMtimeMs === null || info.daemonMtimeMs === null) return false;
  return info.clientMtimeMs > info.daemonMtimeMs;
}

// Mapping: Owz→isDaemonStaleVsClient, H→info, uy$→semver (semver lib),
//          daemonTarget/clientTarget→daemon/client launch-binary realpath
```

**How it works (decision cascade):**

1. **Origin guard.** `daemonOrigin !== "transient"` → not stale. A *service* daemon is the user's deliberate installation; a client must never SIGKILL it. (This mirrors the yield-takeover rule: "an on-demand daemon never displaces a running one," cli_inner_pretty.js:648603.)
2. **Identical version** → not stale (the common case, fast exit).
3. **Identical launch target on disk** → not stale. Even at different version strings, if both processes point at the same binary file we must not kill it — we'd be killing what is effectively our own binary.
4. **No daemon target recorded** (older daemons that didn't persist their launch path): fall back to a **semver** comparison — client must be a strictly *greater* valid semver than the daemon. Invalid semver on either side → not stale (conservative).
5. **Both have targets:** compare **binary mtimes**. The client is stale-justified only if its binary's mtime is strictly newer (`clientMtimeMs > daemonMtimeMs`). Null mtime on either side → not stale.

**Why version-OR-mtime rather than version alone:** Two upgrade shapes exist. A normal `npm`/`brew` upgrade bumps the version string (caught by step 4's semver path). But a *re-install of the same version with a new build* (CI hotfix, local `bun build`, or the same version reshipped) leaves the version string equal yet the bytes differ. Step 5's mtime comparison catches that — analogous to why v2.1.142's `binaryIdentityChanged` checks both realpath and mtime. The function deliberately requires `daemonVersion !== clientVersion` *before* even reaching the target/mtime branches, so step 5 only matters when versions differ but a launch target is recorded; the mtime acts as the tie-breaker on *which* differing build is newer.

**Key insight:** Every branch defaults to **`false` (do not kill)**. Displacing a daemon is destructive (it can interrupt other terminals' background work), so the comparator is biased toward inaction: only an unambiguously-newer client against an unambiguously-stale *transient* daemon triggers a takeover.

### The takeover itself: `takeoverStaleDaemon` (`Mwz`)

```javascript
// ============================================
// takeoverStaleDaemon - gate, verify staleness, SIGKILL the stale transient daemon, emit telemetry
// Location: cli_inner_pretty.js:540233-540291
// ============================================

// ORIGINAL (for source lookup, abridged version-literals):
async function Mwz(H, $) {
  if (H === { ...VERSION_OBJ }.VERSION) return !1;
  if (!V$("tengu_bg_binary_takeover", !0)) return !1;
  if (await We4()) return !1;
  if (!$ && B88() === "ask" && Ze4() && !b$().daemonInstallPromptDismissed) return !1;
  let q = await VAH.realpath(fwz()).catch(() => null);
  if (!q) return !1;
  let K = await u2().catch(() => null);
  if (!K) return !1;
  let [_, z] = await Promise.all([Le4(q), K.launchTarget ? Le4(K.launchTarget) : Promise.resolve(null)]);
  if (!Owz({
        daemonVersion: K.version, daemonOrigin: K.origin, daemonTarget: K.launchTarget,
        clientVersion: { ...VERSION_OBJ }.VERSION, clientTarget: q,
        daemonMtimeMs: z, clientMtimeMs: _,
      }))
    return !1;
  let A = await p$$(K.pid);
  if (A === "timed-out") {
    try { process.kill(K.pid, "SIGKILL"); } catch {}
    A = await p$$(K.pid);
  }
  if (A !== "exited") return !1;
  return (
    N(`bg: ${gO()} pid ${K.pid} runs ${K.version}; this binary (${VERSION}) is a newer build — retired the stale ${gO()} so new sessions use the current binary`, { level: "warn" }),
    d("tengu_bg_daemon_binary_takeover", { daemon_age_ms: Date.now() - K.startedAt }),
    !0
  );
}

// READABLE (for understanding):
async function takeoverStaleDaemon(daemonVersion, forceTransient) {
  if (daemonVersion === CLIENT_VERSION) return false;                 // 1. same version → no-op
  if (!featureGate("tengu_bg_binary_takeover", /*default*/ true)) return false; // 2. gate
  if (await isServiceDaemonInstalled()) return false;                 // 3. never displace under a service
  if (!forceTransient && installPolicy() === "ask"
      && coldStartAskEligible() && !config().daemonInstallPromptDismissed) return false; // 4. defer to cold-start ask
  const clientTarget = await fsPromises.realpath(currentLaunchTarget()).catch(() => null);
  if (!clientTarget) return false;                                    // 5. can't resolve our own binary
  const lock = await readDaemonLock().catch(() => null);
  if (!lock) return false;                                            // 6. no daemon lock → nothing to take over
  const [clientMtimeMs, daemonMtimeMs] = await Promise.all([
    realpathMtimeMs(clientTarget),
    lock.launchTarget ? realpathMtimeMs(lock.launchTarget) : Promise.resolve(null),
  ]);
  if (!isDaemonStaleVsClient({
        daemonVersion: lock.version, daemonOrigin: lock.origin, daemonTarget: lock.launchTarget,
        clientVersion: CLIENT_VERSION, clientTarget, daemonMtimeMs, clientMtimeMs,
      })) return false;                                               // 7. comparator says not stale
  let exitState = await waitProcessExit(lock.pid);                    // 8. is it already gone?
  if (exitState === "timed-out") {
    try { process.kill(lock.pid, "SIGKILL"); } catch {}              //    9. force-kill the stale daemon
    exitState = await waitProcessExit(lock.pid);
  }
  if (exitState !== "exited") return false;                           // 10. couldn't confirm exit → bail
  logWarn(`bg: ${daemonName()} pid ${lock.pid} runs ${lock.version}; this binary (${CLIENT_VERSION}) ` +
          `is a newer build — retired the stale ${daemonName()} so new sessions use the current binary`);
  emitTelemetry("tengu_bg_daemon_binary_takeover", { daemon_age_ms: Date.now() - lock.startedAt });
  return true;
}

// Mapping: Mwz→takeoverStaleDaemon, H→daemonVersion, $→forceTransient, V$→featureGate, We4→isServiceDaemonInstalled,
//          B88→installPolicy, Ze4→coldStartAskEligible, b$→config, fwz→currentLaunchTarget, VAH→fsPromises,
//          u2→readDaemonLock, Le4→realpathMtimeMs, Owz→isDaemonStaleVsClient, p$$→waitProcessExit,
//          gO→daemonName, d→emitTelemetry, N→logWarn, q→clientTarget, K→lock
```

**How it works (gate cascade):**

1. **Same version short-circuit** (cli_inner_pretty.js:540233-540246). If the daemon's reported version equals the client's compiled-in `VERSION` ("2.1.156"), there is nothing to take over. (The bundle inlines the whole build-metadata object and reads `.VERSION` off it.)
2. **Feature gate** `tengu_bg_binary_takeover` (cli_inner_pretty.js:540247), default **true**. Lets the team kill-switch the behavior remotely if it misfires — a sensible safety valve for a feature that SIGKILLs processes.
3. **Service guard** (cli_inner_pretty.js:540248). If a service is installed, bail — service daemons own themselves; the client never displaces them.
4. **Cold-start-ask deferral** (cli_inner_pretty.js:540249). If install policy is `"ask"` and the user is eligible for the cold-start prompt and hasn't dismissed it, don't silently take over — defer to the interactive install flow.
5. **Resolve our own binary** (cli_inner_pretty.js:540250-540251) via `currentLaunchTarget` (`fwz`, the launcher's exec path) + `realpath`. If it can't be resolved, bail.
6. **Read the daemon lock** (`u2`, cli_inner_pretty.js:540252-540253) to learn the running daemon's pid/version/origin/launchTarget/startedAt.
7. **Compute mtimes and run the comparator** (cli_inner_pretty.js:540254-540274). Both binaries' mtimes are fetched in parallel via `realpathMtimeMs` (`Le4`, cli_inner_pretty.js:540209-540215). If `isDaemonStaleVsClient` returns false, bail.
8. **Check whether it already exited** (`p$$`, cli_inner_pretty.js:540275). `waitProcessExit` returns `"exited"`, `"timed-out"`, or `"eperm"`.
9. **SIGKILL on timeout** (cli_inner_pretty.js:540276-540281). If it didn't exit on its own, `process.kill(pid, "SIGKILL")` and re-check. SIGKILL (not SIGTERM) because a stale daemon predating takeover support may not handle graceful shutdown signals correctly — a hard kill is the only reliable retirement.
10. **Confirm exit** (cli_inner_pretty.js:540282). If still not `"exited"`, return false (we won't claim a takeover we couldn't complete — the caller will treat the daemon as "up" rather than spawn a competing one).
11. **Log + emit** (cli_inner_pretty.js:540283-540290). Warn the user that the stale daemon was retired and emit `tengu_bg_daemon_binary_takeover { daemon_age_ms }`. Returning `true` makes `Ywz` report `"down"` so a fresh daemon is spawned.

**Why kill rather than yield:** Yield-takeover (Part B, `tengu_daemon_yield_takeover`) is a cooperative protocol that requires the *running* daemon to understand the `yield` op and release the lock. A daemon old enough to need binary-takeover may not implement that protocol, or may be wedged. Binary-takeover is the *unilateral* fallback: the upgraded client verifies staleness, kills, and confirms exit. The two are complementary — yield is preferred (graceful, workers survive), kill is the backstop (workers on the killed daemon's pid are orphaned, but a stale-binary daemon's workers were running old code anyway).

**Key insight:** The 2.1.153 bug was specifically *"claude agents / --bg running on a stale daemon started before binary-takeover support, even after upgrading."* The fix can't rely on the daemon noticing its own staleness (it can't — old code), so it moves the responsibility to the *one component guaranteed to be current*: the freshly-launched client. `takeoverStaleDaemon` is that client-side enforcement, fenced behind a feature gate, a service guard, an install-ask guard, and a strictly-newer comparator so it can only ever retire an unambiguously-older transient daemon.

**Cross-validation (2.1.88):** binary-takeover and the daemon lock/`launchTarget` model are **NEW after 2.1.88** (no daemon process existed). Confidence **high**.

---

## Part 3 — `/bg` While Responding: Live-Turn Handoff

### Entry points

There are two ways to background the *current* session:

- **`--bg --exec` (and `claude --bg`)**: `bgFlagExecHandler` (`hwz`, cli_inner_pretty.js:541956-542006) is the CLI handler dispatched at cli_inner_pretty.js:649883 after the top-level launcher emits `tengu_background { via_flag: true, via: "flag" }` (cli_inner_pretty.js:649882). `hwz` parses `--exec`/`--exec=`, builds a shell-intent bg session via `ol([], …, "shell", …, {intent, exec, name})` (cli_inner_pretty.js:541974) and prints the hint banner. (The `--exec` shell-session path is covered in detail in `shell_exec_sessions.md`.)
- **`/bg` mid-turn (in the agents/repl UI)**: the `BackgroundForkPrompt` component (`gwz`, cli_inner_pretty.js:542763) confirms with the user and then calls `backgroundCurrentSession` (`zh8`), which is the focus here.

### `backgroundCurrentSession` (`zh8`)

**What it does:** Takes the *currently running* foreground session — possibly mid-turn, possibly owning a git worktree — and hands it off to a background worker that resumes the same session id in a forked transcript, so the user's terminal is freed while the turn keeps running in the background.

```javascript
// ============================================
// backgroundCurrentSession - resume the live session in a bg worker via --resume --fork-session
// Location: cli_inner_pretty.js:542680-542731
// ============================================

// ORIGINAL (for source lookup, abridged):
async function zh8(H, $, q, K, _, z, A, Y, f, O) {
  let M = ik(),
    j = typeof q === "string" ? q : void 0,
    w = Array.from(_.values()).filter((v) => v.source === "session").map((v) => v.path),
    ...
    Z = sY(),
    W = Boolean(Z && !Z.enteredExisting),   // owns a worktree we entered (not pre-existing) → hand it off
    G = Rqq();                              // current session id (for --resume)
  await n_(R0(), 2000, "flush timeout").catch(() => {});
  let V = await ol(
    [
      ...(G !== null ? ["--resume", G, "--fork-session"] : []),
      ...(O?.replyOnResume ? ["--reply-on-resume"] : []),
      ...G7$(),
      ...w.flatMap((v) => ["--add-dir", v]),
      ...
      "--permission-mode", K,
      ...($ ? ["--", $] : []),
    ],
    O?.providedSessionId, "repl", Z?.worktreePath ?? f6(),
    { ...H,
      worktree: W ? { path: Z.worktreePath, branch: Z.worktreeBranch, hookBased: Z.hookBased ?? !1, originCwd: Z.originalCwd } : void 0,
      sessionPermissionRules: X, memoryToggledOff: XR() || void 0,
    },
    O?.extraEnv,
  ).catch((v) => ({ ok: !1, error: `Couldn't background — ${TH(v)}` }));
  if (!V.ok) return (d("tengu_background_spawn_failed", {}), { ok: !1, error: V.error });
  if ((d("tengu_background", { via_flag: !1, via: Y }), Z)) (BL$(null), iNH());  // detach worktree from foreground
  ...
  return { ok: !0, short: V.short, handedOff: W, hadWorktree: Z !== null };
}

// READABLE (for understanding):
async function backgroundCurrentSession(spawnOpts, promptTail, effort, permMode,
                                        addDirSources, allowRules, disallowRules, via, messages, opts) {
  const model = currentModel();
  const effortArg = typeof effort === "string" ? effort : undefined;
  const addDirs = [...addDirSources.values()].filter(s => s.source === "session").map(s => s.path);
  const worktree = currentWorktree();
  const handOffWorktree = Boolean(worktree && !worktree.enteredExisting);
  const sessionId = currentSessionId();
  await withTimeout(flushTranscript(), 2000, "flush timeout").catch(() => {});
  const result = await unifiedBgDispatch(
    [
      ...(sessionId !== null ? ["--resume", sessionId, "--fork-session"] : []),
      ...(opts?.replyOnResume ? ["--reply-on-resume"] : []),
      ...inheritedFlags(),
      ...addDirs.flatMap(p => ["--add-dir", p]),
      ...allowRules.cliArg.flatMap(t => ["--allowed-tools", t]),
      ...disallowRules.cliArg.flatMap(t => ["--disallowed-tools", t]),
      ...(model ? ["--model", model] : []),
      ...(effortArg ? ["--effort", effortArg] : []),
      "--permission-mode", permMode,
      ...(promptTail ? ["--", promptTail] : []),
    ],
    opts?.providedSessionId, "repl", worktree?.worktreePath ?? cwd(),
    { ...spawnOpts,
      worktree: handOffWorktree
        ? { path: worktree.worktreePath, branch: worktree.worktreeBranch,
            hookBased: worktree.hookBased ?? false, originCwd: worktree.originalCwd }
        : undefined,
      sessionPermissionRules: sessionRules, memoryToggledOff: isMemoryOff() || undefined,
    },
    opts?.extraEnv,
  ).catch(e => ({ ok: false, error: `Couldn't background — ${formatError(e)}` }));
  if (!result.ok) return (emitTelemetry("tengu_background_spawn_failed", {}), { ok: false, error: result.error });
  emitTelemetry("tengu_background", { via_flag: false, via });
  if (worktree) { clearForegroundWorktree(null); refreshWorktreeUi(); } // foreground releases the worktree
  ...
  return { ok: true, short: result.short, handedOff: handOffWorktree, hadWorktree: worktree !== null };
}

// Mapping: zh8→backgroundCurrentSession, ol→unifiedBgDispatch, Rqq→currentSessionId, sY→currentWorktree,
//          ik→currentModel, R0→flushTranscript, O.replyOnResume→opts.replyOnResume, W→handOffWorktree,
//          BL$→clearForegroundWorktree, iNH→refreshWorktreeUi, d→emitTelemetry, Y→via
```

**How it works (step-by-step):**

1. **Snapshot the foreground state.** Model (`ik`), effort, session-scoped `--add-dir` paths, session permission rules, the current worktree (`sY`), and the live session id (`Rqq`).
2. **Decide worktree handoff.** `handOffWorktree = worktree && !worktree.enteredExisting` (cli_inner_pretty.js:542692). The foreground only hands off a worktree it *created* this session — never one the user `cd`'d into themselves (`enteredExisting`), which would yank the rug out from under their shell.
3. **Flush the transcript** with a 2 s timeout (cli_inner_pretty.js:542694) so the forked worker resumes from an up-to-date on-disk transcript. The `--resume <id> --fork-session` pair (cli_inner_pretty.js:542697) makes the worker continue the same logical conversation but in a *new* branch of the session file, so foreground and background don't write over each other.
4. **`--reply-on-resume`** (cli_inner_pretty.js:542698) is added only when `opts.replyOnResume` is set. The caller (`gwz`) sets it to `isMidTurn` — i.e. when backgrounding happens *while the assistant is still responding*, the resumed worker must immediately continue/reply to finish the in-flight turn rather than waiting for new input. (The flag is in the allowed-arg set at cli_inner_pretty.js:542675.)
5. **Dispatch as a `"repl"` worker** via `ol` (cli_inner_pretty.js:542695-542721), cwd = the worktree path (if any) else the current cwd, passing the worktree descriptor `{ path, branch, hookBased, originCwd }` so the worker adopts ownership of that worktree.
6. **On success:** emit `tengu_background { via_flag: false, via }` (cli_inner_pretty.js:542723) and, if there was a worktree, release it from the foreground via `clearForegroundWorktree` + `refreshWorktreeUi` (`BL$(null), iNH()`, cli_inner_pretty.js:542723) — the foreground UI stops claiming the worktree because the bg worker now owns it.
7. **Auto-name (optional).** If no explicit name was given but we got a session id, kick off a best-effort async title derivation (`V8$(nf([...messages]), AbortSignal.timeout(Qwz))`, cli_inner_pretty.js:542724-542729).
8. **Return** `{ ok, short, handedOff, hadWorktree }` (cli_inner_pretty.js:542731). `handedOff` drives the banner suffix.

### The confirm-then-fork UI and `tengu_background_fork`

`BackgroundForkPrompt` (`gwz`, cli_inner_pretty.js:542763) is the React component that gates the call. When confirmed it invokes `zh8` with `via = "command"`, `messages`, and `{ replyOnResume: isMidTurn }`, then on success emits the rich fork-telemetry and exits the prompt with the banner:

```javascript
// ============================================
// BackgroundForkPrompt - confirm, call backgroundCurrentSession, emit fork telemetry, show banner
// Location: cli_inner_pretty.js:542797-542813
// ============================================

// ORIGINAL (for source lookup):
let I = await zh8(_, K, Y, f, O, M, j, "command", z, { replyOnResume: A });
if (I.ok)
  (d("tengu_background_fork", {
    confirmed: J.count > 0,
    inflight_count: J.count,
    mid_turn: A,
    had_prompt: K.length > 0,
    had_worktree: I.hadWorktree,
    worktree_handed_off: I.handedOff,
  }),
    q(),
    await tK(0, "prompt_input_exit", {
      suppressResumeHint: !0,
      finalMessage: ny$(I.short, I.handedOff ? "(worktree handed off)" : void 0),
    }));
else q(I.error);

// READABLE (for understanding):
const result = await backgroundCurrentSession(seed, prompt, effort, permMode, addDirs, allowRules,
                                              disallowRules, "command", messages, { replyOnResume: isMidTurn });
if (result.ok) {
  emitTelemetry("tengu_background_fork", {
    confirmed: inflight.count > 0,
    inflight_count: inflight.count,
    mid_turn: isMidTurn,
    had_prompt: prompt.length > 0,
    had_worktree: result.hadWorktree,
    worktree_handed_off: result.handedOff,
  });
  onDone();
  await exitPromptInput(0, "prompt_input_exit", {
    suppressResumeHint: true,
    finalMessage: formatBgHints(result.short, result.handedOff ? "(worktree handed off)" : undefined),
  });
} else onDone(result.error);

// Mapping: gwz→BackgroundForkPrompt, zh8→backgroundCurrentSession, ny$→formatBgHints, tK→exitPromptInput,
//          A→isMidTurn, J.count→inflight.count, K→prompt, q→onDone, I→result
```

The banner is built by `formatBgHints` (`ny$`, cli_inner_pretty.js:542079-542089): `backgrounded · <short> · (worktree handed off)` followed by the `claude agents` / `attach` / `logs` / `stop` hint lines. The `(worktree handed off)` suffix (assembled at cli_inner_pretty.js:542811) is the user-visible confirmation that their git worktree moved to the background worker.

**`tengu_background_fork` fields** (cli_inner_pretty.js:542800-542807): `mid_turn` (was the assistant still responding), `inflight_count`/`confirmed` (how many tasks were in flight when the user backgrounded), `had_prompt`, `had_worktree`, `worktree_handed_off`. These let the team measure how often `/bg` is used mid-turn vs at rest and how often a worktree handoff accompanies it.

### Why this approach

- **`--resume --fork-session` instead of moving the process.** The foreground `claude` is a TTY-attached React app; you can't just detach it into a daemon worker. Spawning a fresh worker that *resumes the session id into a forked transcript* gives the background worker a clean process while preserving conversation continuity. The fork (not a plain resume) prevents the two processes from racing on the same transcript file.
- **`--reply-on-resume` only mid-turn.** A plain resume waits for user input. If you background *while Claude is talking*, you want it to keep talking — so the mid-turn case opts into `--reply-on-resume` to auto-continue the in-flight turn. At-rest backgrounding omits it (nothing to reply to yet).
- **Worktree handoff is conditional on ownership.** Only a session-created worktree (`!enteredExisting`) is handed off; a user-entered directory is left alone. This is the safety equivalent of the `Owz` "never displace a service daemon" rule — don't touch resources the user manages directly.

**Key insight:** The handoff is a *transactional ownership transfer*: the bg worker is spawned with the worktree descriptor first (cli_inner_pretty.js:542714-542716), and only after the spawn succeeds does the foreground release it (`clearForegroundWorktree`, cli_inner_pretty.js:542723). If the spawn fails (`!result.ok`), the foreground still owns the worktree and reports `tengu_background_spawn_failed` — there is never a window where neither process owns it.

**`--bg` ignores `--session-id`.** Inside the dispatcher, when a shell-intent bg session is launched with an explicit `--session-id`, the launcher warns and drops it (cli_inner_pretty.js:541818-541821): *"warning: --bg manages the session id; ignoring --session-id (use --resume <id> to continue an existing session)."* Background workers must own their own session ids (the daemon registry keys on them); resuming an existing conversation is `--resume`'s job, not `--session-id`'s.

**Cross-validation (2.1.88):** The 2.1.88 tree has `useSessionBackgrounding.ts` — an *in-process* Ctrl+B that flips a task's `isBackgrounded` flag and re-syncs messages into the main view. That is a UI-state toggle, **not** a daemon-worker fork. The `zh8` daemon-worker handoff with `--fork-session`/`--reply-on-resume`/worktree transfer is **NEW post-2.1.88**. Confidence **high** that the fork-to-worker model is new; the Ctrl+B concept is the conceptual ancestor.

---

## The Two Pre-Existing Self-Restart Events (context, from v2.1.142)

For completeness, the two daemon-side restart telemetry events the scope references both live in `runDaemonSupervisor` (cli_inner_pretty.js:648570-648799) and are documented in the v2.1.142 `daemon_lifecycle.md`:

- **`tengu_daemon_yield_takeover`** (cli_inner_pretty.js:648590): emitted by a *newly-starting* daemon when it asks an existing *transient* daemon to yield the lock (a service daemon starting over a transient one). The new daemon sends `op:"yield"`, waits up to 5 s for the lock to release, and reports `{ ok: !lockStillHeld, new_origin }`. This is the **cooperative** counterpart to binary-takeover.
- **`tengu_daemon_self_restart_on_upgrade`** (cli_inner_pretty.js:648783): emitted when the supervisor's own 60 s binary-identity poll detects its binary changed and the supervisor exits cleanly so the next launch spawns a fresh daemon on the new binary.

Binary-takeover (`Mwz`) is the **third, client-side, unilateral** path that covers the gap these two leave: a transient daemon that is too old to self-restart *and* won't be yielded-to because no newer daemon is starting — only a client launch can retire it.

```
       cooperative ◄──────────────────────────────────► unilateral
   yield-takeover            self-restart            binary-takeover
   (new daemon asks)     (daemon notices itself)    (client kills it)
   648590                    648783                      540288
   workers survive        workers re-adopted         workers orphaned
   needs old daemon to    needs poll to have         needs nothing of
   understand "yield"     fired on old daemon        the old daemon
```

---

## 2.1.154 UI-Routing Behaviors (changelog-level; exact gate sites unverified)

Two smaller 2.1.154 behaviors touch the agents-view entry surface. Per the changelog (`claude_code_v_2.1.156/CHANGELOG.md`):

- **`/logout` now signs you out instead of being sent to a background session.** Previously, typing `/logout` in `claude agents` was misrouted into the background dispatch flow. The fix routes it to the actual sign-out. I located the agents-view default-routing predicate around the launcher (`defaultToAgentsView`, cli_inner_pretty.js:649900, with the config key registered at cli_inner_pretty.js:143031) but did **not** pin the exact branch that special-cases `/logout` vs bg-dispatch. **Confidence low-to-medium; exact gate site (unverified).**
- **`←←` (double-left-arrow) to open the agents view now works on Bedrock, Vertex, Foundry, and with telemetry disabled.** Previously this keybinding was gated behind first-party/telemetry-enabled conditions. The config key driving it is `leftArrowOpensAgents` (registered alongside `defaultToAgentsView` at cli_inner_pretty.js:143030), and the provider labels exist in the bundle (Foundry/Bedrock/Vertex at cli_inner_pretty.js:91916-91918). I did **not** pin the exact predicate that previously suppressed the `←←` agents-view entry specifically on those providers/with telemetry off. **Confidence low-to-medium; exact gate site (unverified).**

These are noted here only to round out the 2.1.153/154 background-agents changelog. They belong to the agents-view UI routing rather than the daemon lifecycle, and should be pinned precisely in the agent-view / CLI-routing modules if needed.

---

## Validation

| Claim | Source |
|-------|--------|
| `ensureDaemonRunning` entry | cli_inner_pretty.js:540124 |
| Stale-exec detection `K = q && (await Gv8())` | cli_inner_pretty.js:540128 |
| `tengu_bg_daemon_service_stale_exec` emit + warning | cli_inner_pretty.js:540130-540134 |
| Skip service-revive when stale (`if (q && !K)`) | cli_inner_pretty.js:540136 |
| `tengu_bg_daemon_service_stale_exec` registered in event list | cli_inner_pretty.js:143252 |
| `daemonLabelForArgs` "claude agents"/"claude --bg"/"claude" | cli_inner_pretty.js:540332-540337 |
| `takeoverStaleDaemon` invoked from nudge-loop, returns "down" on kill | cli_inner_pretty.js:540095 |
| `isDaemonStaleVsClient` transient-origin guard | cli_inner_pretty.js:540221 |
| `isDaemonStaleVsClient` semver fallback (no daemonTarget) | cli_inner_pretty.js:540224-540229 |
| `isDaemonStaleVsClient` mtime comparison | cli_inner_pretty.js:540230-540231 |
| `tengu_bg_binary_takeover` gate (default true) | cli_inner_pretty.js:540247 |
| Takeover service guard / cold-start-ask deferral | cli_inner_pretty.js:540248-540249 |
| Takeover SIGKILL on timeout + confirm exit | cli_inner_pretty.js:540276-540282 |
| `tengu_bg_daemon_binary_takeover { daemon_age_ms }` emit | cli_inner_pretty.js:540288 |
| `realpathMtimeMs` (`Le4`) returns mtimeMs / null | cli_inner_pretty.js:540209-540215 |
| `currentLaunchTarget` (`fwz`) | cli_inner_pretty.js:540216-540219 |
| `backgroundCurrentSession` entry | cli_inner_pretty.js:542680 |
| `--resume <id> --fork-session` injection | cli_inner_pretty.js:542697 |
| `--reply-on-resume` only when `opts.replyOnResume` | cli_inner_pretty.js:542698 |
| worktree handoff descriptor passed to `ol` | cli_inner_pretty.js:542714-542716 |
| `tengu_background { via_flag: false, via }` + foreground worktree release | cli_inner_pretty.js:542723 |
| return `{ handedOff, hadWorktree }` | cli_inner_pretty.js:542731 |
| `tengu_background_fork` fields (mid_turn, worktree_handed_off) | cli_inner_pretty.js:542800-542807 |
| `(worktree handed off)` banner via `formatBgHints` | cli_inner_pretty.js:542811 / 542079-542089 |
| `--reply-on-resume` in allowed-arg set | cli_inner_pretty.js:542675 |
| `bgFlagExecHandler` = `hwz`, `--exec` parsing + shell `ol` | cli_inner_pretty.js:541720 / 541956-541974 |
| top-level `--bg` flag emits `tengu_background { via_flag: true, via: "flag" }`, calls `bgFlagExecHandler` | cli_inner_pretty.js:649882-649883 |
| `--bg` ignores `--session-id` warning | cli_inner_pretty.js:541818-541821 |
| `tengu_daemon_yield_takeover { ok, new_origin }` | cli_inner_pretty.js:648590 |
| `tengu_daemon_self_restart_on_upgrade` | cli_inner_pretty.js:648783 |
| Build VERSION literal "2.1.156" | cli_inner_pretty.js:540240, 648575 |
| `leftArrowOpensAgents` / `defaultToAgentsView` config keys | cli_inner_pretty.js:143030-143031 |
| Foundry/Bedrock/Vertex provider labels | cli_inner_pretty.js:91916-91918 |
| `/logout` signs out / `←←` agents view on Bedrock/Vertex/Foundry (changelog) | claude_code_v_2.1.156/CHANGELOG.md:17-18 |
