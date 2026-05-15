# Hook Terminal Isolation — `detached: true` (v2.1.139)

## Overview

v2.1.139 makes hooks spawn in a process group **without a controlling terminal** on POSIX systems. The changelog:

> Fixed a bug where a hook writing to the terminal could corrupt an on-screen interactive prompt; hooks now run without terminal access

The fix is small but consequential: the `spawn` call gains `detached: !X` (where `X` is the Windows flag). On Unix-like systems this means `setsid()` is called by Node's child_process, putting the hook in its own session — no controlling TTY, no SIGHUP propagation, no inherit-stdin-from-Claude-Code.

The trade-off was the v2.1.141 follow-up: hooks that wanted to emit notifications/title-bar updates lost their TTY, so a [`terminalSequence` JSON output field](./terminal_sequence.md) was added to delegate that emission back through Claude Code.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_additions_v2_1_142_hooks.md](../00_overview/symbol_additions_v2_1_142_hooks.md) - New symbols

Key function in this document:

- `bashCommandHook` (`vW8`) — Command hook executor; `detached` arg flipped

## v2.1.142 Spawn Code

```javascript
// ============================================
// bashCommandHook - Detached spawning to release controlling terminal
// Location: cli_inner_pretty.js:520881-520902
// ============================================

// ORIGINAL (for source lookup):
let u = I$(),
  S = (await H_(u)) ? u : $6();
if (S !== u) N(`Hooks: cwd ${u} not found, falling back to original cwd`, { level: "warn" });
let x = !X,                    // ← v2.1.139: detached on non-Windows
  F;
if (E) F = GW8.spawn(E[0], E[1], { env: R, cwd: S, detached: x, windowsHide: !0 });
else if (L === "powershell") {
  let YH = await zB();
  if (!YH) throw Error(`Hook "${H.command}" has shell: 'powershell' but no PowerShell ... was found on PATH.`);
  F = GW8.spawn(YH, EX$(h), { env: R, cwd: S, detached: x, windowsHide: !0 });
} else {
  let YH = X ? P6H() : null;
  if (X && !YH) throw Error(`Hook "${H.command}" requires bash but Git Bash was not found.`);
  F = GW8.spawn(h, [], { env: R, cwd: S, shell: X ? YH : !0, detached: x, windowsHide: !0 });
}

// READABLE (for understanding):
const requestedCwd = getCwd();
// Fall back to the original cwd if the current one was deleted (e.g., worktree removed).
// Async-local-storage may carry a deleted-path cwd from a removed agent worktree.
const safeCwd = (await pathExists(requestedCwd)) ? requestedCwd : getOriginalCwd();
if (safeCwd !== requestedCwd) {
  logForDebugging(`Hooks: cwd ${requestedCwd} not found, falling back to original cwd`, { level: "warn" });
}

// v2.1.139: detached: true on non-Windows. Causes Node to call setsid(),
// placing the hook in a new session with no controlling terminal.
// On Windows, detached has different semantics (separates console group)
// and would orphan the process — keep it off there.
const detachFromTty = !isWindows;
let child;
if (execSpec) {                                  // exec form (v2.1.139)
  child = child_process.spawn(execSpec[0], execSpec[1], {
    env: envVars,
    cwd: safeCwd,
    detached: detachFromTty,
    windowsHide: true,                            // suppresses visible console window on Windows
  });
} else if (shellChoice === "powershell") {
  const pwshPath = await getCachedPowerShellPath();
  if (!pwshPath) throw Error(`Hook "${hook.command}" has shell: 'powershell' but no PowerShell executable was found on PATH.`);
  child = child_process.spawn(pwshPath, buildPowerShellArgs(commandWithEffort), {
    env: envVars,
    cwd: safeCwd,
    detached: detachFromTty,
    windowsHide: true,
  });
} else {
  const gitBash = isWindows ? findGitBashPath() : null;
  if (isWindows && !gitBash) throw Error(`Hook "${hook.command}" requires bash but Git Bash was not found.`);
  child = child_process.spawn(commandWithEffort, [], {
    env: envVars,
    cwd: safeCwd,
    shell: isWindows ? gitBash : true,
    detached: detachFromTty,
    windowsHide: true,
  });
}

// Mapping:
//   u→requestedCwd, S→safeCwd, x→detachFromTty, X→isWindows,
//   E→execSpec, L→shellChoice, P→isPowerShell, F→child, h→commandWithEffort, R→envVars,
//   GW8→child_process, I$→getCwd, H_→pathExists, $6→getOriginalCwd, zB→getCachedPowerShellPath,
//   EX$→buildPowerShellArgs, P6H→findGitBashPath
```

## What `detached: true` Means on Node + POSIX

When `detached` is `true` in Node's `spawn` options, on Unix-like systems:

1. The child process becomes a new **session leader** via `setsid(2)`.
2. The new session has **no controlling terminal**.
3. The process group ID equals the child's PID — so the child is in its own pgid.

Concrete consequences for a hook:

- **`process.stdin` inherits the parent's TTY only if explicitly set.** Node's default `stdio: 'pipe'` creates pipes anyway, so this is consistent with the existing behavior — but combined with `setsid`, even an explicit `stdio: 'inherit'` would have no effect for terminal-bound side effects.
- **The hook can't read keyboard input** that goes to the parent's TTY.
- **The hook can't write to the parent's TTY** without explicit access (none granted here).
- **A hook calling `tput`, `stty`, or `tcsetattr`** gets ENOTTY or no-effect.
- **The hook is not affected by `SIGHUP`** when the parent's terminal closes.
- **A hook running `ps`/`tput cols`** sees its own session, not the parent's terminal info.

## Why the Windows Branch is Different

On Windows, `detached: true` has a different effect — it creates a new console group, which **detaches the child's console from the parent's**. For a hook running synchronously and being awaited, this would orphan the process: the parent can no longer wait on it cleanly, and (paradoxically) it gets its own visible console window unless `windowsHide` is also set.

The combined flags `{ detached: true, windowsHide: true }` would suppress the window but introduce subtle wait/parent-tracking issues. The simpler choice is `detached: false` on Windows + `windowsHide: true` to suppress any console window. The hook stays attached to the parent (same console handle), and `windowsHide` keeps its output from popping up a visible console.

## Key Decisions/Algorithms

### `!isWindows` as the gate

**What it does:** `const detachFromTty = !isWindows;` — POSIX gets `true`, Windows gets `false`.

**How it works:** `isWindows` was already computed (`c$() === "windows"`) at the top of `bashCommandHook`. The new variable reuses it.

**Why this approach:**
- POSIX `detached: true` provides the security/UX win (no terminal corruption, no signal pollution).
- Windows `detached: true` is the wrong knob for the same goal (console isolation, not session detachment). Different mechanism: `windowsHide` covers the visible-window concern.

**Key insight:** **Same intent, two implementations.** The named flag does opposite things across platforms, so the runtime applies it selectively. Reading the diff as "hooks are now detached" is platform-specific shorthand for "hooks no longer corrupt the parent terminal."

### Original cwd fallback

**What it does:** If `getCwd()` returns a deleted path, fall back to `getOriginalCwd()`.

**How it works:**
```javascript
const requestedCwd = getCwd();
const safeCwd = (await pathExists(requestedCwd)) ? requestedCwd : getOriginalCwd();
```

**Why this approach:**
- Async-local-storage can carry a worktree-derived cwd that was deleted between hook registration and execution.
- `spawn(cmd, [], { cwd: nonexistent })` doesn't throw synchronously — it emits an async `error` event after spawn that gets reported as a generic failure. Falling back avoids the cryptic error.

**Key insight:** This was added together with the detach change because the agent-worktree feature (separate cwd per agent) makes deleted-cwd scenarios more common. The fallback prevents the new isolation from amplifying a different bug.

### `stdio` not explicitly set

**What it does:** Node defaults to `stdio: 'pipe'` when not specified, which is what the runtime relies on (it reads stdout to detect async hooks).

**Why this approach:**
- Explicit `stdio: ['pipe', 'pipe', 'pipe']` would be functionally identical but more verbose.
- The async-hook detection code (`F.stdout.on("data", ...)`, `cli_inner_pretty.js:520940-520975`) needs piped stdout/stderr.

**Key insight:** The hook **does** still receive its input through `child.stdin.write(jsonInput + '\n')` (`cli_inner_pretty.js:520908,520984`). Detach affects controlling-terminal access, not pipe-based IO between Node and the child. The hook can still read its JSON input on stdin — it just can't read terminal keystrokes.

## Diff vs v2.1.112

In v2.1.112 (and the matching v2.1.88 TS source at `src/utils/hooks.ts:957-983`), the spawn options did not include `detached`. The child inherited the parent's controlling terminal, which let:

- A hook printing OSC 1337 (Set Working Directory) to confuse the parent's prompt.
- A hook calling `tput cup` to reposition the cursor mid-Claude-output.
- A hook accidentally writing to stderr a control sequence that flips the parent's character set.

The v2.1.139 patch adds:
1. `detachFromTty = !isWindows` variable.
2. `detached: detachFromTty` field added to all three `child_process.spawn` calls (exec form, PowerShell, bash).
3. `windowsHide: true` field added consistently (it was already in some paths; now uniformly present).

The TS source in `/lyz/codespace/3rd/claude-code/src/utils/hooks.ts:957-983` predates this — it's the v2.1.88 baseline before the fix.

## Related Reading

- [terminal_sequence.md](./terminal_sequence.md) — the v2.1.141 companion that gives hooks back a way to emit allowlisted OSCs.
- The exec form ([args_exec_form.md](./args_exec_form.md)) is a separate v2.1.139 change but lands in the same `bashCommandHook` function — the two diffs interlock.
