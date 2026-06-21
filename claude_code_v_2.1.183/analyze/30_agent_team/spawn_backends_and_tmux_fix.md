# Spawn Backends + the tmux Teammate-Spawn Fix (v2.1.156 → v2.1.183)

## TL;DR

The agent-team subsystem (internally "swarm") still has the **same two-mode execution split** it had in v2.1.156: a teammate either runs **in-process** (an async task in the leader's own Node process, isolated by `AsyncLocalStorage`) or **cross-process** (a brand-new `claude` OS process living in a **tmux pane** or an **iTerm2 split**). That whole abstraction — the `BackendRegistry` singleton, the `isInProcessEnabled` decision, the backend-detection logic, the 500 ms in-process poll, the `PaneBackendExecutor` adapter — is **carried over essentially unchanged** from v2.1.156. We recap it briefly and **link the baseline** rather than re-deriving it.

What *did* change, and what this doc analyses in depth, is the **mechanic by which the cross-process tmux backend injects the relaunch command into a freshly-created pane**.

- **v2.1.156** created a pane that ran the user's **default interactive login shell**, slept **200 ms** (`PANE_SHELL_INIT_DELAY_MS`, `G94`) to give that shell time to finish loading rc-files, and then **typed** the relaunch line into it: `tmux send-keys -t <pane> "cd … && env … claude --agent-id …" Enter` (`sendCommandToPane` `cli_inner_pretty.js:380566`, v2.1.156).
- **v2.1.183** creates the pane running a **benign holding process** — `cat` (`Gke`, `cli_inner_pretty.js:362642`) — with `tmux split-window -d … -- cat`, and then **replaces that process directly** with the real command via `tmux respawn-pane -k -t <pane> -- "cd … && env … claude …"` (`a3n`, `cli_inner_pretty.js:421874`). There is **no shell, no typed keystrokes, and no init-delay sleep** anywhere in the new pane-creation path.

This is a **structural** fix for two distinct bugs that the typed-into-a-shell approach was prone to: (1) a **slow-rc-init race** — the typed line could land before (or interleaved with) a still-initialising interactive shell, so the keystrokes were swallowed or mangled; (2) a **keystroke-leak** — because the pane was a real interactive shell, characters the user typed in the leader (or that arrived at the pane) during the spawn window could land on the same shell line, corrupting the command. `respawn-pane` `exec`s the command as the pane's process image directly; there is no shell prompt to race and no readline buffer to leak into. A defense-in-depth `Slt` control-character guard (`cli_inner_pretty.js:362755`) was added on top.

> **Scope.** This doc covers the **tmux** cross-process spawn mechanic. The iTerm2 backend (which uses `it2 session run`, not `send-keys`) is a sibling backend; it is out of scope here except where it shares the detection path. In-process mode and the mailbox IPC are carryover — see the links below.

---

## 1. Carryover recap: the two-mode split (link the baseline, don't re-derive)

The v2.1.156 baseline documented this in three deep-dives that **remain accurate for v2.1.183** at the *architecture* level (only obfuscated names were re-mangled, and only the tmux spawn mechanic changed):

- **Execution-mode selection & BackendRegistry** — `execution_modes_and_backend_registry.md` (v2.1.156). The registry singleton, `getTeammateExecutor`, `isInProcessEnabled`, the auto/tmux/in-process resolution, and backend detection.
- **In-process mode** — `in_process_mode.md` (v2.1.156). The `AsyncLocalStorage`-scoped teammate identity, the per-turn async loop, the 500 ms mailbox poll.
- **Cross-process mode (pane backends)** — `cross_process_mode.md` (v2.1.156). The `PaneBackendExecutor` adapter, the CLI/env reconstruction builders, `TmuxBackend`, `ITermBackend`. **This is the doc the present delta diffs against** (its §4.3 `sendCommandToPane` is the function we are replacing).

> Baseline links (cross-tree, three `../`):
> - [../../../claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md](../../../claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md)
> - [../../../claude_code_v_2.1.156/analyze/30_agent_team/in_process_mode.md](../../../claude_code_v_2.1.156/analyze/30_agent_team/in_process_mode.md)
> - [../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_process_mode.md](../../../claude_code_v_2.1.156/analyze/30_agent_team/cross_process_mode.md)

### 1.1 What is unchanged in v2.1.183 (verified at source)

Reading the v2.1.183 bundle confirms the abstraction is byte-for-byte the same shape as v2.1.156, only re-mangled:

- **BackendRegistry singleton** — `_F` (`cli_inner_pretty.js:422467`), constructed by `J5a()` at module init (`:422478`). v2.1.156 `NS`.
- **`isInProcessEnabled`** — `rWe` (`cli_inner_pretty.js:422425`). Same decision tree: non-interactive (`xr()`) ⇒ always in-process; explicit `getTeammateMode()` of `"in-process"`/`"tmux"` short-circuits; otherwise auto-detect (`!insideTmux && !inITerm2 ⇒ in-process`), with a **sticky fallback bit** `inProcessFallbackActive` consulted when a pane backend turned out to be unavailable. v2.1.156 `ma`.
- **Sticky fallback marker** — `markInProcessFallbackActive` `Wdo` (`cli_inner_pretty.js:422419`) sets `e.inProcessFallbackActive = !0` so once a pane backend has failed, the session stays in-process.
- **Backend detection** — `eLe` (`cli_inner_pretty.js:422314`): inside-tmux ⇒ tmux backend; iTerm2 ⇒ iterm backend; emits `swarm_backend_detect` telemetry. v2.1.156 `jLH`.
- **Backend resolver** — `Vdo` (`cli_inner_pretty.js:422480`) returns `(await eLe()).backend`; `hDp` (`:422451`) lazily wraps it in a `PaneBackendExecutor` (`j5a`). The pane-spawn helpers `tqa`/`nqa`/`rqa` (`:422487-422494`) are thin delegates onto `Vdo()`.
- **In-process runner** — `sDp` (`cli_inner_pretty.js:421006`), fired-and-forgotten by `qut` (`:421374`); 500 ms poll interval `ZLp` (`:421380`). v2.1.156 `JT_` / `fT_=500`.
- **`getTeammateMode` snapshot** — `Aje` (`cli_inner_pretty.js:293813`), default `"in-process"` (`UOt`).

None of those are re-analysed here; the baseline deep-dives stand. The **only** structural change inside this abstraction is in `TmuxBackend`'s pane-creation + command-injection methods, which we turn to now.

---

## 2. The change at a glance: send-keys → respawn-pane

The v2.1.156 cross-process spawn was a deliberate **two-phase** design (baseline `cross_process_mode.md` §1): phase 1 *created an empty pane running a shell prompt*; phase 2 *typed the relaunch command into that shell and pressed Enter*. The new `claude` was only born when the keystrokes reached the shell. That second phase is exactly what changed.

```
v2.1.156 (TYPE-INTO-SHELL)                  v2.1.183 (REPLACE-PANE-PROCESS)
──────────────────────────                  ───────────────────────────────
split-window -t L -h -l 70%                 split-window -d -t L -h -l 70% -- cat
   (pane runs the user's login shell)          (pane runs `cat`, focus stays on leader)
        │                                            │
await G94()  ── sleep 200ms ──┐              (no sleep; cat is instantly "ready")
        │   (let rc-files load)│                     │
        ▼                      ▼                     ▼
send-keys -t <pane>           RACE:           set-option -p remain-on-exit failed
  "cd … && env … claude …"    typed line              │
  Enter                       can land in       respawn-pane -k -t <pane> -- "cd … && env … claude …"
        │                     a half-init             │   (exec replaces `cat` with the command)
        ▼                     shell or            ▼
  shell parses & runs         interleave with   tmux exec()s the command as the pane's
  the line; claude boots      stray keystrokes  process image; claude boots — no shell,
                              (keystroke-leak)   no typed keys, nothing to race
```

The two-phase split itself is preserved (create-then-inject), but **phase 1 now starts a known-quiescent process** (`cat`, which blocks on stdin and does nothing) instead of a configurable interactive shell, and **phase 2 replaces that process** instead of feeding it keystrokes.

---

## 3. Deep dive: `sendCommandToPane` (v2.1.156) vs `a3n` (v2.1.183)

### 3.1 The before-picture — v2.1.156 `TmuxBackend.sendCommandToPane`

**What it does:** Types the fully-assembled relaunch command into the pane's interactive shell and presses Enter, on whichever tmux endpoint (user session via `-S` socket, or external swarm session via `-L` label) the `useExternalSession` flag selects.

```javascript
// ============================================
// TmuxBackend.sendCommandToPane (v2.1.156) - type the relaunch command via send-keys
// Location: cli_inner_pretty.js:380566-380569 (v2.1.156 before-picture)
// ============================================

// ORIGINAL (for source lookup):
async sendCommandToPane(H, $, q = !1) {
  let _ = await (q ? BE : kS)(["send-keys", "-t", H, $, "Enter"]);
  if (_.code !== 0) throw Error(`Failed to send command to pane ${H}: ${_.stderr}`);
}

// READABLE (for understanding):
async sendCommandToPane(paneId, command, useExternalSession = false) {
  // `send-keys … "<command>" Enter` is literally a human typing the whole
  // `cd … && env … claude …` line at the pane's shell prompt and hitting Return.
  const result = await (useExternalSession ? runTmuxInSwarmLabel : runTmuxInSwarmSocket)(
    ["send-keys", "-t", paneId, command, "Enter"]
  );
  if (result.code !== 0) throw new Error(`Failed to send command to pane ${paneId}: ${result.stderr}`);
}

// Mapping (v2.1.156): H→paneId, $→command, q→useExternalSession,
//          BE→runTmuxInSwarmLabel (-L label), kS→runTmuxInSwarmSocket (-S socket), _→result
```

And the matching pane-creation in v2.1.156 (`createTeammatePaneWithLeader`, `cli_inner_pretty.js:380688-380721`) created a **default-shell** pane and then **slept 200 ms** before returning:

```javascript
// ============================================
// TmuxBackend.createTeammatePaneWithLeader (v2.1.156) - shell pane + 200ms init delay
// Location: cli_inner_pretty.js:380696, 380719 (v2.1.156 before-picture)
// ============================================

// ORIGINAL (for source lookup):
if (z) A = await kS(["split-window", "-t", q, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]);
// …
await this.rebalancePanesWithLeader(K),
await G94(),                         // G94() === g8(WT_) === sleep(200ms); WT_=200 @380786
{ paneId: Y, isFirstTeammate: z }

// READABLE (for understanding):
if (isFirstTeammate)
  result = await runTmuxInSwarmSocket(
    // NO `--` ⇒ the pane runs the user's DEFAULT interactive login shell;
    // NO `-d` ⇒ tmux switches focus to the new pane.
    ["split-window", "-t", leaderPane, "-h", "-l", "70%", "-P", "-F", "#{pane_id}"]
  );
// …
await this.rebalancePanesWithLeader(windowTarget);
await sleepPaneShellInit();          // 200ms — hope the shell finished loading rc-files before we type
return { paneId, isFirstTeammate };

// Mapping (v2.1.156): G94→sleepPaneShellInit, WT_→PANE_SHELL_INIT_DELAY_MS (=200)
```

**Why this was fragile (the two bugs):**

1. **Slow-rc-init race.** `send-keys` writes characters into the pane's pty. If the pane's shell (`zsh`/`bash`/`fish`) is still sourcing `.zshrc`/`.bashrc`/Powerlevel10k/etc. when those characters arrive, they may be discarded, echoed before the prompt is drawn, or interleaved with the shell's own startup output. The `200 ms` `G94()` delay was a **heuristic mitigation** — a fixed sleep that *assumed* any shell finishes initialising within 200 ms. On a machine with a heavy shell profile (NVM, conda, slow corporate dotfiles), 200 ms is not enough and the teammate silently fails to launch.

2. **Keystroke-leak.** Because the pane hosts a real interactive shell with a readline/zle line editor, **any** characters that reach that pane during the spawn window get buffered into the same command line. A stray keystroke (focus accidentally on the pane, a bracketed-paste fragment, terminal noise) lands *inside* the `cd … && env … claude …` line, producing a mangled command that either errors or — worse — runs something unintended.

The root cause of both is the same: **the relaunch command was being delivered as terminal input to an interactive shell**, and interactive shells are stateful, slow to initialise, and accept input from anywhere.

### 3.2 The after-picture — v2.1.183 `a3n` (respawn-pane)

**What it does:** Replaces the pane's current process (the `cat` holder) with the real relaunch command, executing it directly as the pane's process image — no shell, no typing. It first arms `remain-on-exit failed` so the pane survives (showing the error) if the command exits non-zero.

```javascript
// ============================================
// sendCommandViaRespawn (a3n) - inject the command by replacing the pane's process
// Location: cli_inner_pretty.js:421874-421878
// ============================================

// ORIGINAL (for source lookup):
async function a3n(e, t, n) {
  await Fn(B8, [...e, "set-option", "-p", "-t", t, "remain-on-exit", "failed"]);
  let r = await Fn(B8, [...e, "respawn-pane", "-k", "-t", t, "--", n]);
  if (r.code !== 0) throw new sF(`Failed to send command to pane ${t}: ${r.stderr}`);
}

// READABLE (for understanding):
async function sendCommandViaRespawn(socketArgs, paneId, command) {
  // 1) Keep the pane visible if the command fails, so the user can read the error
  //    instead of the pane vanishing the instant claude exits non-zero.
  await runTmux(TMUX_COMMAND, [...socketArgs, "set-option", "-p", "-t", paneId, "remain-on-exit", "failed"]);
  // 2) `respawn-pane -k` KILLS the pane's current process (the `cat` holder) and
  //    starts <command> in its place. `--` ends option parsing so the command and its
  //    args are taken literally; tmux exec()s it directly — there is NO interactive shell.
  const result = await runTmux(TMUX_COMMAND, [...socketArgs, "respawn-pane", "-k", "-t", paneId, "--", command]);
  if (result.code !== 0)
    throw new SwarmPaneError(`Failed to send command to pane ${paneId}: ${result.stderr}`);
}

// Mapping: a3n→sendCommandViaRespawn, e→socketArgs, t→paneId, n→command,
//          Fn→runTmux, B8→TMUX_COMMAND ("tmux"), sF→SwarmPaneError
```

**How it works (step-by-step):**

1. `set-option -p -t <pane> remain-on-exit failed` — arm the pane to **stay open if its process exits with a non-zero status**. Before this, if the relaunched `claude` died immediately (bad flag, missing binary), the pane would close instantly and the failure would be invisible. With `remain-on-exit failed`, a crashed teammate leaves a dead-but-visible pane the user can inspect. (`-p` scopes the option to this pane only.)
2. `respawn-pane -k -t <pane> -- <command>` — this is the heart of the fix. `respawn-pane` restarts the pane with a new command; `-k` **kills the existing process first** (here, the `cat` holder); `--` terminates tmux's own option parsing so everything after it is the command + args, taken verbatim. Critically, the command passed to `respawn-pane` is **`exec`'d by tmux as the pane's process image** — it is *not* fed to an interactive shell. (The command string itself is `sh -c`-shaped: `cd <cwd> && env <env> <claude> <flags>`, so the **`&&`/`cd`/`env`** are run by a shell that `respawn-pane` spawns to host that one-liner — but it is a *fresh non-interactive* shell exec'd for exactly this command, with no rc-file sourcing, no prompt, and no readline line editor accepting outside input.)
3. On non-zero exit code, throw a typed `SwarmPaneError` (`sF`).

**Why this structurally fixes both bugs:**

- **No rc-init race ⇒ the 200 ms sleep is deleted.** There is no interactive shell that must "finish loading" before we deliver the command. The pane was holding `cat` (which is instantly quiescent), and `respawn-pane` deterministically replaces it. Reading the v2.1.183 pane-creation path (`cli_inner_pretty.js:421890-422122`) confirms there is **no** `g8`/`sleep`/`200`/`WT_` anywhere — the heuristic delay is gone entirely. The fix replaced a *timing guess* with a *causal guarantee*: the pane's process is whatever `respawn-pane` exec'd, full stop.
- **No keystroke-leak ⇒ no readline buffer to corrupt.** The command is never delivered as terminal *input*; it is the pane's *process argument*. There is no shell line editor sitting in the pane accumulating characters, so stray keystrokes during the spawn window cannot end up inside the command. The command string is exactly what tmux exec'd, atomically.

**Key insight:** the v2.1.156 design used the pane's shell **as an API** ("type a line, press Enter"), which inherited every fragility of interactive shells (startup latency, statefulness, accepting input from anywhere). The v2.1.183 design treats the pane purely as a **process container**: create it with a quiescent placeholder, then `exec` the real process into it. This is the same shift as going from "automate a GUI by sending synthetic keystrokes" to "call the API directly" — slower-but-fragile UI driving replaced by a direct, atomic operation.

### 3.3 The new `sendCommandToPane` wrapper + the `Slt` control-char guard

`a3n` is reached through `TmuxBackend.sendCommandToPane`, which is still the method the executor calls (its signature `(paneId, command, useExternalSession)` is unchanged), but its body now (a) **validates the command for control characters** and (b) routes to `a3n` instead of `send-keys`:

```javascript
// ============================================
// TmuxBackend.sendCommandToPane (v2.1.183) - control-char guard, then respawn-pane
// Location: cli_inner_pretty.js:421900-421909
// ============================================

// ORIGINAL (for source lookup):
async sendCommandToPane(e, t, n = !1) {
  try {
    Slt(t);
  } catch (s) {
    throw (Me("swarm_pane_spawn", "swarm_pane_command_control_chars"), s);
  }
  let r = lBn(),
    o = n ? ["-L", VFt()] : r ? ["-S", r] : [];
  await a3n(o, e, t);
}

// READABLE (for understanding):
async sendCommandToPane(paneId, command, useExternalSession = false) {
  // Defense-in-depth: reject any command containing a Unicode control character
  // before it ever reaches a terminal. Emits a telemetry error and rethrows.
  try {
    assertNoControlChars(command);                       // Slt
  } catch (err) {
    logTelemetryError("swarm_pane_spawn", "swarm_pane_command_control_chars");
    throw err;
  }
  // Pick the tmux endpoint: external swarm session (-L <claude-swarm-<pid>>) when not
  // inside the user's tmux; else the user's session (-S <socket>) if a socket override
  // is set; else the default tmux server (no socket args).
  const socketPath = getSwarmSocketPath();               // lBn
  const socketArgs = useExternalSession ? ["-L", getSwarmSocketName()]    // VFt → claude-swarm-<pid>
                   : socketPath ? ["-S", socketPath]
                   : [];
  await sendCommandViaRespawn(socketArgs, paneId, command);   // a3n
}

// Mapping: e→paneId, t→command, n→useExternalSession, Slt→assertNoControlChars,
//          Me→logTelemetryError, lBn→getSwarmSocketPath, VFt→getSwarmSocketName,
//          a3n→sendCommandViaRespawn
```

The control-char validator:

```javascript
// ============================================
// assertNoControlChars (Slt) - reject control chars before sending to a terminal
// Location: cli_inner_pretty.js:362755-362763 (regex fDa @362775)
// ============================================

// ORIGINAL (for source lookup):
function Slt(e) {
  let t = fDa.exec(e);
  if (t) {
    let n = t[0].codePointAt(0);
    throw new sF(
      `Refusing to send command containing control character U+${n.toString(16).padStart(4, "0").toUpperCase()} to terminal pane`,
    );
  }
}
// fDa = /\p{Cc}/u;   // any Unicode "Control" category code point

// READABLE (for understanding):
function assertNoControlChars(command) {
  const match = CONTROL_CHAR_RE.exec(command);           // /\p{Cc}/u
  if (match) {
    const codePoint = match[0].codePointAt(0);
    throw new SwarmPaneError(
      `Refusing to send command containing control character U+${codePoint
        .toString(16).padStart(4, "0").toUpperCase()} to terminal pane`,
    );
  }
}

// Mapping: Slt→assertNoControlChars, fDa→CONTROL_CHAR_RE (/\p{Cc}/u), sF→SwarmPaneError
```

**Why add a control-char guard if `respawn-pane` already avoids the shell?** Two reasons. First, **defense-in-depth**: even though the command is now exec'd rather than typed, a control character embedded in a name/cwd/model value (e.g. via a crafted `--agent-type` or a path with an embedded `\x1b`) could still produce a terminal-escape injection when the command line is *displayed* in the pane title/border, or could break tmux's own option parsing in unexpected ways. Rejecting `\p{Cc}` (the entire Unicode "Control" category — C0/C1 controls including `\n`, `\r`, `\t`, ESC) closes that surface. Second, it gives a **clear, attributable error** (`swarm_pane_command_control_chars` telemetry + a precise `U+XXXX` message) instead of a silent mangle — which is exactly the class of failure the old `send-keys` path produced opaquely.

**Note (consistency):** the same `Slt`-then-`a3n` pattern appears in the iTerm-adjacent / non-splitpane spawn paths too (`Slt` is called at `cli_inner_pretty.js:422219` and `422816`), so the control-char guard is uniform across the pane-spawn surface, not tmux-specific.

---

## 4. The pane now runs `cat`: `createTeammatePaneWithLeader` / `createTeammatePaneExternal`

For `respawn-pane -k` to be the *only* thing that ever puts a real process in the pane, the pane must be created running a **placeholder** that does nothing and never exits on its own. v2.1.183 uses `cat` for exactly this:

```javascript
// ============================================
// Pane holder + tmux constants
// Location: cli_inner_pretty.js:362640-362643
// ============================================

// ORIGINAL (for source lookup):
var np = "team-lead",
  pDa,
  N8 = "claude-swarm",
  ylt = "swarm-view",
  B8 = "tmux",
  Qoo = "claude-hidden",
  Gke = "cat",
  _lt = "CLAUDE_CODE_TEAMMATE_COMMAND";

// READABLE (for understanding):
const TEAM_LEAD_NAME       = "team-lead";   // np
const AGENT_NAME_RE        = pDa;           // /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/ (set in oF init)
const SWARM_SESSION_NAME   = "claude-swarm"; // N8 — external standalone swarm session
const SWARM_WINDOW_NAME    = "swarm-view";   // ylt
const TMUX_COMMAND         = "tmux";         // B8
const HIDDEN_SESSION_NAME  = "claude-hidden"; // Qoo — for hidePane (break-pane target)
const PANE_HOLD_COMMAND    = "cat";          // Gke — benign placeholder process per pane
const TEAMMATE_COMMAND_ENV = "CLAUDE_CODE_TEAMMATE_COMMAND"; // _lt — exec-path override

// Mapping: np→TEAM_LEAD_NAME, N8→SWARM_SESSION_NAME, ylt→SWARM_WINDOW_NAME,
//          B8→TMUX_COMMAND, Qoo→HIDDEN_SESSION_NAME, Gke→PANE_HOLD_COMMAND, _lt→TEAMMATE_COMMAND_ENV
```

Every `split-window` / `new-window` / `new-session` that creates a teammate pane now ends in `… -- Gke` (i.e. `-- cat`) and adds `-d` (don't switch active pane to the new one). The inside-the-user's-tmux path:

```javascript
// ============================================
// TmuxBackend.createTeammatePaneWithLeader (v2.1.183) - pane runs `cat`, focus stays on leader
// Location: cli_inner_pretty.js:422028-422061 (split-window calls @422036, 422050)
// ============================================

// ORIGINAL (for source lookup):
if (s) i = await kj(["split-window", "-d", "-t", n, "-h", "-l", "70%", "-P", "-F", "#{pane_id}", "--", Gke]);
else {
  // … pick target pane m, alternate -v/-h …
  i = await kj(["split-window", "-d", "-t", m, p ? "-v" : "-h", "-P", "-F", "#{pane_id}", "--", Gke]);
}
// …
await this.rebalancePanesWithLeader(r),
{ paneId: a, isFirstTeammate: s }        // ← NOTE: no G94()/sleep before return

// READABLE (for understanding):
if (isFirstTeammate)
  result = await runTmuxInSwarmSocket([
    "split-window",
    "-d",                  // NEW: do NOT switch focus to the teammate pane (avoids stealing the leader's input)
    "-t", leaderPane,
    "-h", "-l", "70%",     // leader kept at 30%, teammate at 70% (horizontal split)
    "-P", "-F", "#{pane_id}",
    "--", PANE_HOLD_COMMAND,  // NEW: run `cat` instead of the user's interactive login shell
  ]);
else
  result = await runTmuxInSwarmSocket([
    "split-window", "-d", "-t", targetPane,
    isOdd ? "-v" : "-h",
    "-P", "-F", "#{pane_id}",
    "--", PANE_HOLD_COMMAND,   // NEW
  ]);
// …
await this.rebalancePanesWithLeader(windowTarget);
return { paneId, isFirstTeammate };       // NO 200ms sleep — `cat` is instantly ready for respawn-pane

// Mapping: kj→runTmuxInSwarmSocket, Gke→PANE_HOLD_COMMAND ("cat"), n→leaderPane,
//          m→targetPane, s→isFirstTeammate, a→paneId
```

The external standalone-swarm path matches: `createExternalSwarmSession` (`cli_inner_pretty.js:421995-422026`) creates the swarm session/window with `new-session -d -s claude-swarm -n swarm-view … -- cat` (`:421997`) and `new-window … -- cat` (`:422024`), and `createTeammatePaneExternal` (`:422062-422095`) splits with `… -- Gke` (`:422085`). All run `cat`, all use `-d`.

**Why `cat` specifically?** `cat` with no arguments reads stdin and writes it to stdout, blocking forever on a TTY with nothing typed. It (a) **never exits on its own** (so the pane stays alive and respawnable — a shell could exit on EOF, a `sleep N` would eventually finish), (b) **does nothing observable** (no prompt, no output, no rc-files), and (c) is **universally present** on every POSIX system. It is the minimal "keep the pane open and quiet until we replace its process" primitive. The pane is therefore a clean, inert container from creation until `respawn-pane` injects the teammate.

**Why `-d` (don't switch focus)?** With the old shell-pane approach the new pane could become the active pane; combined with `send-keys`, focus management mattered. With `-d`, the leader keeps input focus throughout the spawn — reinforcing the keystroke-leak fix at the layout level: the user's keystrokes stay on the leader pane, and the teammate pane is never the active input target while it is being set up.

**Why the 200 ms sleep could simply be deleted.** In v2.1.156 the sleep existed *because* the next step typed into a shell that needed time to be ready. In v2.1.183 the next step is `respawn-pane`, which is a tmux server operation that targets the pane by id and does not care whether anything is "ready" — `cat` is replaced regardless. So the delay had no remaining purpose and was removed; confirmed by the absence of any sleep in `cli_inner_pretty.js:421890-422122`.

---

## 5. End-to-end: how the command reaches `respawn-pane`

The split-pane spawner `SDp` (`cli_inner_pretty.js:422644`, the v2.1.183 cross-process spawn) is where the relaunch command is assembled and handed to the (now respawn-based) injection. The relevant tail:

```javascript
// ============================================
// SDp (split-pane spawn) - assemble command, write mailbox seed, inject via sendCommandToPane
// Location: cli_inner_pretty.js:422684-422704 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
let T = iqa(),
  C = [
    `--agent-id ${Ja([m])}`, `--agent-name ${Ja([f])}`, `--team-name ${Ja([d])}`,
    `--agent-color ${Ja([A])}`, `--parent-session-id ${Ja([xt()])}`,
    l ? "--plan-mode-required" : "", i ? `--agent-type ${Ja([i])}` : "",
  ].filter(Boolean).join(" "),
  x = aqa({ planModeRequired: l, permissionMode: u.toolPermissionContext.mode, skipModel: !!c });
if (c) x = x ? `${x} --model ${Ja([c])}` : `--model ${Ja([c])}`;
let I = x ? ` ${x}` : "",
  k = Qjt(),
  L = `cd ${Ja([p])} && env ${k} ${Ja([T])} ${C}${I}`;
(await lUt(f, d),
  await $A(f, { from: np, text: s, timestamp: new Date().toISOString() }, d),
  await rqa(b, L, !_),                      // ← rqa → backend.sendCommandToPane(paneId, command, !insideTmux)
  g());

// READABLE (for understanding):
const execPath = resolveTeammateExecPath();                              // iqa
const identityFlags = [
  `--agent-id ${shellQuote([teammateId])}`,
  `--agent-name ${shellQuote([sanitizedName])}`,
  `--team-name ${shellQuote([teamName])}`,
  `--agent-color ${shellQuote([teammateColor])}`,
  `--parent-session-id ${shellQuote([getSessionId()])}`,
  planModeRequired ? "--plan-mode-required" : "",
  agentType ? `--agent-type ${shellQuote([agentType])}` : "",
].filter(Boolean).join(" ");
let inheritedFlags = buildTeammateCliFlags({ planModeRequired, permissionMode: leaderMode, skipModel: !!model });
if (model) inheritedFlags = inheritedFlags ? `${inheritedFlags} --model ${shellQuote([model])}`
                                           : `--model ${shellQuote([model])}`;
const envStr = buildTeammateEnvString();                                 // Qjt
const command = `cd ${shellQuote([cwd])} && env ${envStr} ${shellQuote([execPath])} ${identityFlags}${flagsSuffix}`;

await ensureInboxDir(sanitizedName, teamName);                           // lUt
await writeToMailbox(sanitizedName, { from: TEAM_LEAD_NAME, text: prompt, timestamp: new Date().toISOString() }, teamName); // $A
await injectCommandIntoPane(paneId, command, !insideTmux);              // rqa → sendCommandToPane → a3n
markPaneInjectionDone();                                                 // g()

// Mapping: iqa→resolveTeammateExecPath, Ja→shellQuote, Qjt→buildTeammateEnvString,
//          aqa→buildTeammateCliFlags, lUt→ensureInboxDir, $A→writeToMailbox,
//          rqa→injectCommandIntoPane (delegates to backend.sendCommandToPane), np→TEAM_LEAD_NAME,
//          m→teammateId, f→sanitizedName, d→teamName, A→teammateColor, b→paneId, _→insideTmux, L→command
```

The **command string itself is structurally identical** to v2.1.156 (`cd <cwd> && env <env> <execPath> <identity flags> <inherited flags>` — the CLI/env reconstruction builders are carryover, baseline `cross_process_mode.md` §3). What changed is purely the **delivery**: `rqa` (`:422493`) → `TmuxBackend.sendCommandToPane` (`:421900`) → `Slt` guard → `a3n` `respawn-pane` (`:421874`), instead of v2.1.156's `send-keys`. The mailbox seed write (`$A`, the teammate's first task) is unchanged and still happens immediately before injection, so the freshly-respawned `claude` finds its initial prompt waiting in the mailbox on its first poll.

---

## 6. Confidence & caveats

- **High confidence** on the core delta: `send-keys` (v2.1.156 `cli_inner_pretty.js:380566`) → `respawn-pane -k -- <cmd>` (v2.1.183 `a3n` `cli_inner_pretty.js:421874`), the `cat` holding process (`Gke` `:362642`, used in every `split-window`/`new-window`/`new-session` create path), the deletion of the 200 ms `G94`/`WT_` shell-init delay (verified absent in `:421890-422122`), and the `Slt` control-char guard (`:362755`). Every code block above was copied from the cited bundle lines and the v2.1.156 before-picture lines were read directly.
- The **`remain-on-exit failed`** line in `a3n` is a related robustness improvement (a crashed teammate now leaves a visible dead pane rather than vanishing). It is part of the same fix; I have not located a separate changelog line for it, so I attribute it to the respawn rewrite rather than overclaiming it as an independent feature.
- The mechanism described — "respawn-pane exec's the command directly, no interactive shell to race or leak into" — is the **structural reason** the changelog's slow-rc-init + keystroke-leak symptoms are fixed. I have not run the binary; the claim rests on tmux semantics (`respawn-pane` replaces the pane's process; `send-keys` writes to its pty) plus the verified code change. This matches the dossier's **high** confidence rating for §3.4.
- The iTerm2 backend's command injection (`it2 session run`) was **not** part of this fix and is unchanged in spirit (it never used `send-keys`); it is out of scope here. The `Slt` guard is, however, applied uniformly across the pane-spawn surface (calls at `:421902`, `:422219`, `:422816`).

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team / swarm lives here)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model, Sandbox)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-feature additions: [../00_overview/symbol_additions_v2_1_183_agent_team.md](../00_overview/symbol_additions_v2_1_183_agent_team.md)

Sibling delta docs in this module: [implicit_team_and_agent_tool_spawn.md](implicit_team_and_agent_tool_spawn.md), [README.md](README.md).

Key functions/constants in this document (list format, per CLAUDE.md):

- `sendCommandViaRespawn` (obfuscated: `a3n`, `cli_inner_pretty.js:421874`) — injects the relaunch command via `respawn-pane -k -- <cmd>` after arming `remain-on-exit failed`; the core of the tmux fix.
- `TmuxBackend.sendCommandToPane` (v2.1.183 method, `cli_inner_pretty.js:421900`) — `Slt` control-char guard + endpoint selection, then `a3n`. Replaces the v2.1.156 `send-keys` body at `cli_inner_pretty.js:380566` (v2.1.156).
- `assertNoControlChars` (obfuscated: `Slt`, `cli_inner_pretty.js:362755`; regex `fDa = /\p{Cc}/u` at `:362775`) — rejects commands containing Unicode control characters.
- `PANE_HOLD_COMMAND` (obfuscated: `Gke`, `cli_inner_pretty.js:362642`) — `"cat"`, the benign placeholder process each teammate pane runs until `respawn-pane`.
- `TMUX_COMMAND` (obfuscated: `B8`, `cli_inner_pretty.js:362640`) — `"tmux"`.
- `TEAMMATE_COMMAND_ENV` (obfuscated: `_lt`, `cli_inner_pretty.js:362643`) — `"CLAUDE_CODE_TEAMMATE_COMMAND"`, exec-path override.
- `TmuxBackend` (obfuscated: `Ndo`, `cli_inner_pretty.js:421879`) — the tmux `PaneBackend`; `createTeammatePaneWithLeader` (`:422028`) / `createTeammatePaneExternal` (`:422062`) / `createExternalSwarmSession` (`:421995`) all use `split-window/new-window/new-session -d … -- cat`. v2.1.156 `ZU6`.
- `runTmuxInSwarmSocket` (obfuscated: `kj`, `cli_inner_pretty.js:421866`) / `runTmuxInSwarmLabel` (obfuscated: `yF`, `:421871`) — the `-S` socket vs `-L` label tmux routers.
- `injectCommandIntoPane` (obfuscated: `rqa`, `cli_inner_pretty.js:422493`) / `getCurrentBackend` (obfuscated: `Vdo`, `:422480`) — spawn-side delegate onto the active backend's `sendCommandToPane`.
- `spawnSplitPane` (obfuscated: `SDp`, `cli_inner_pretty.js:422644`) — assembles the `cd … && env … claude …` command and calls `rqa` to inject it.
- BackendRegistry carryover: singleton `_F` (`cli_inner_pretty.js:422467`, v2.1.156 `NS`), `isInProcessEnabled` `rWe` (`:422425`, v2.1.156 `ma`), `markInProcessFallbackActive` `Wdo` (`:422419`), backend detection `eLe` (`:422314`, v2.1.156 `jLH`), `getTeammateMode` `Aje` (`:293813`), in-process runner `sDp` (`:421006`, v2.1.156 `JT_`), poll interval `ZLp` (`:421380`, v2.1.156 `fT_`=500).
- v2.1.156 before-picture: `TmuxBackend.sendCommandToPane` (`send-keys … Enter`, v2.1.156 `cli_inner_pretty.js:380566`), `sleepPaneShellInit` (obfuscated: `G94`, v2.1.156 `:380514`, `WT_=200` at `:380786`), `createTeammatePaneWithLeader` plain `split-window` (v2.1.156 `:380696`).
