# PowerShell Tool — v2.1.142

## Overview

`PowerShellTool` (`dy6` in cli_inner_pretty.js:405745) is the Windows shell executor — equivalent to BashTool but targeting `pwsh.exe` (PowerShell 7+) or `powershell.exe` (Windows PowerShell 5.1). It is enabled via `Su()` (`isPowerShellToolEnabled`), which checks `CLAUDE_CODE_USE_POWERSHELL_TOOL` env var, the Git Bash availability on Windows, and a `tengu_cobalt_ridge` GB feature flag. The tool detects which PowerShell edition is in use and adapts the prompt accordingly (different branches for 5.1, 7+, and "unknown"). On Linux/macOS, the tool is opt-in via env var only.

## Rollout flags

```javascript
// ============================================
// isPowerShellToolEnabled — gate function for PowerShellTool registration
// Location: cli_inner_pretty.js:141659-141666
// ============================================

// ORIGINAL (for source lookup):
function Su() {
  let H = process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL;
  if (c$() !== "windows") return bH(H);
  if (E4(H)) return !1;
  if (bH(H)) return !0;
  if (P6H() === null) return !0;
  return Z$("tengu_cobalt_ridge", !1);
}

// READABLE (for understanding):
function isPowerShellToolEnabled() {
  const envVar = process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL;
  // On non-Windows: only enabled when env var is truthy (manual opt-in)
  if (getPlatform() !== 'windows') return isEnvTruthy(envVar);
  // On Windows with explicit env opt-out: disabled
  if (isEnvFalsy(envVar)) return false;
  // On Windows with explicit env opt-in: enabled
  if (isEnvTruthy(envVar)) return true;
  // On Windows without Git Bash: enabled (PowerShell is the only shell)
  if (findGitBashOnWindows() === null) return true;
  // On Windows with Git Bash: GB feature-flag rollout
  return getFeatureValue_CACHED_MAY_BE_STALE('tengu_cobalt_ridge', false);
}

// Mapping: Su→isPowerShellToolEnabled, c$→getPlatform, bH→isEnvTruthy, E4→isEnvFalsy,
//          P6H→findGitBashOnWindows, Z$→getFeatureValue_CACHED_MAY_BE_STALE
```

```javascript
// ============================================
// isBashAvailableOnHost — companion gate (drives default shell selection)
// Location: cli_inner_pretty.js:141667-141670
// ============================================

// ORIGINAL (for source lookup):
function Y9() {
  if (c$() !== "windows") return !0;
  return P6H() !== null;
}
function PZH() { return Y9() ? "bash" : "powershell"; }

// READABLE (for understanding):
function isBashAvailableOnHost() {
  if (getPlatform() !== 'windows') return true;
  return findGitBashOnWindows() !== null;
}
function getDefaultShellName() {
  return isBashAvailableOnHost() ? 'bash' : 'powershell';
}

// Mapping: Y9→isBashAvailableOnHost, PZH→getDefaultShellName
```

The exposed shell tools list `QW = [Sq, EK]` at line 141680 — `Sq` is BASH_TOOL_NAME, `EK` is POWERSHELL_TOOL_NAME. Both tools are registered when both are enabled; the host's shell preference drives which one the model sees in its tool list.

### Decision rationale: why two tools instead of a polymorphic shell tool?

Each shell has materially different syntax (`&&`/`||` parser-error on PS 5.1, `Out-File` vs `>` redirection, etc.). The model's prompt for the Bash tool reflects bash semantics; the PowerShell tool's prompt has its own ~3-branch syntax guidance (per edition). A single "shell" tool would need a "shellType" parameter and twice the prompt — separating them keeps each tool's prompt focused.

## Schema (Zod)

```javascript
// ============================================
// powerShellInputSchema — PowerShellTool input parameters
// Location: cli_inner_pretty.js / O45() at runtime
// ============================================

// ORIGINAL (for source lookup):
// O45() returns z.strictObject({ command, description, timeout, run_in_background, dangerouslyDisableSandbox })

// READABLE (for understanding):
const powerShellInputSchema = z.strictObject({
  command: z.string().describe('The PowerShell command to execute'),
  description: z.string().optional().describe('Clear, concise description of what this command does in active voice.'),
  timeout: semanticNumber(z.number().optional()).describe(`Optional timeout in milliseconds (max ${getMaxTimeoutMs()})`),
  run_in_background: semanticBoolean(z.boolean().optional()).describe('Set to true to run this command in the background'),
  dangerouslyDisableSandbox: semanticBoolean(z.boolean().optional()).describe('Set this to true to dangerously override sandbox mode'),
});

// Mapping: O45→powerShellInputSchema
```

Output schema (`M45()`) mirrors BashTool's: `stdout`, `stderr`, `interrupted`, `backgroundTaskId`, `backgroundedByUser`, `assistantAutoBackgrounded`, `returnCodeInterpretation`, `persistedOutputPath`, `persistedOutputSize`.

`maxResultSizeChars` is **30,000** (same as Bash).

## validateInput

```javascript
// ============================================
// validateInput — platform check + sleep guard
// Location: cli_inner_pretty.js:405812-405830
// ============================================

// ORIGINAL (for source lookup):
// async validateInput(H) {
//   if (Te7()) return { result: !1, message: Ge7, errorCode: 11 };
//   if (qg() && Y9() && !VrH && !H.run_in_background) {
//     let $ = ve7(H.command);
//     if ($ !== null) return { result: !1, message: `Blocked: ${$}. ...`, errorCode: 10 };
//   }
//   return { result: !0 };
// }

// READABLE (for understanding):
async function validateInput(input) {
  // (1) Platform availability check
  if (isWindowsRequired()) {
    return { result: false, message: POWERSHELL_PLATFORM_ERROR, errorCode: 11 };
  }
  // (2) Sleep-pattern guard (Monitor beta + bash-also-available + flag off + foreground only)
  if (isMonitorFeatureEnabled() && isBashAvailableOnHost() && !isMonitorBetaForPS && !input.run_in_background) {
    const sleepPattern = detectBlockedPowerShellSleep(input.command);
    if (sleepPattern !== null) {
      return {
        result: false,
        message: `Blocked: ${sleepPattern}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\` — Monitor runs bash). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
        errorCode: 10
      };
    }
  }
  return { result: true };
}

// Mapping: Te7→isWindowsRequired, Ge7→POWERSHELL_PLATFORM_ERROR, qg→isMonitorFeatureEnabled,
//          Y9→isBashAvailableOnHost, VrH→isMonitorBetaForPS, ve7→detectBlockedPowerShellSleep
```

The platform check (`isWindowsRequired`) is more nuanced than just "is Windows": it also disallows the tool on hosts where PowerShell wasn't found. On Linux without `pwsh` installed, the tool can't run — return a clear "no powershell on this host" error rather than letting the subprocess spawn fail with a confusing ENOENT.

The sleep guard mirrors Bash's but the user message references **Monitor runs bash** — because the Monitor tool itself uses bash on Linux/macOS. On Windows-only hosts (no bash), the guard is skipped entirely (`isBashAvailableOnHost() && !isMonitorBetaForPS` short-circuits false).

## checkPermissions

PowerShellTool uses the same dangerous-sandbox override pattern as BashTool:
```javascript
async function checkPermissions(input, context) {
  const decision = await psToolHasPermission(input, context);
  if (input.dangerouslyDisableSandbox && decision.behavior !== 'deny' && decision.behavior !== 'ask'
      && !isExplicitAutoMode(decision.decisionReason)
      && !shouldUseSandbox(input) && shouldUseSandbox({ ...input, dangerouslyDisableSandbox: false })) {
    return { behavior: 'ask', message: 'Sandbox override requested', ruleSuggestions: [...] };
  }
  return decision;
}
```

`preparePermissionMatcher` is PowerShell-aware: it parses the command via `bDH` (`parsePowerShellForSecurity`), extracts subcommands via `qW` (`extractPowerShellSubcommands`), and produces match candidates with both the canonical name and the **alias-resolved** form (e.g., `ls` resolves to `Get-ChildItem` via `Vz` / `toPowerShellAlias`). Both forms are tried against the permission rule so the model can write `PowerShell(ls *)` and have it match `Get-ChildItem` invocations too.

## call

```javascript
// ============================================
// PowerShellTool.call — runPowerShellCommand + git tracking + interpretation + output persistence
// Location: cli_inner_pretty.js:405879-406100 (mirrors BashTool.call closely; key diffs in shell wrapper + edition detection)
// ============================================

// ORIGINAL (for source lookup):
// async call(H, $, q, K, _) {
//   if (Te7()) throw Error(Ge7);
//   const { abortController: A, setToolJSX: z, emitToolProgress: Y } = $;
//   const f = !$.agentId; const O = 0;
//   const M = D45({ input: H, abortController: A, taskRegistry, abortSpeculation, setToolJSX, emitToolProgress, preventCwdChanges: !f, isMainThread: f, toolUseId, agentId, sessionEnvVars });
//   for await of M.next() { /* emit ps-progress events */ }
//   const D = M.returnValue;
//   /* trackGitOperations, cwd reset, background task short-circuit, hint extraction,
//      semantic interpretation (vt7), error class extraction, telemetry,
//      output persistence (file backed) above 64 MiB, return data */
// }

// READABLE (for understanding):
async function call(input, context, _toolMap, _parentMessage, onProgress) {
  if (isWindowsRequired()) throw new Error(POWERSHELL_PLATFORM_ERROR);

  const { abortController, setToolJSX, emitToolProgress } = context;
  const isMainThread = !context.agentId;
  let progressCounter = 0;
  const generator = runPowerShellCommand({
    input,
    abortController,
    taskRegistry: context.taskRegistry,
    abortSpeculation: context.abortSpeculation,
    setToolJSX,
    emitToolProgress,
    preventCwdChanges: !isMainThread,
    isMainThread,
    toolUseId: context.toolUseId,
    agentId: context.agentId,
    sessionEnvVars: context.sessionEnvVars,
  });

  // (1) Stream progress events
  let step;
  do {
    step = await generator.next();
    if (!step.done && onProgress) {
      const v = step.value;
      onProgress({ type: 'progress', toolUseID: `ps-progress-${progressCounter++}`, data: { type: 'powershell_progress', output: v.output, fullOutput: v.fullOutput, elapsedTimeSeconds: v.elapsedTimeSeconds, totalLines: v.totalLines, totalBytes: v.totalBytes, timeoutMs: v.timeoutMs, taskId: v.taskId } });
    }
  } while (!step.done);
  const result = step.value;

  // (2) Track git operations (only when there's real output or non-success exit)
  if (!(result.code === 0 && !result.stdout && result.stderr && !result.backgroundTaskId)) {
    trackGitOperations(input.command, result.code, result.stdout);
  }

  // (3) Cwd reset on main thread
  let stderrForShellReset = '';
  if (isMainThread) {
    const appState = context.getAppState();
    if (resetCwdIfOutsideProject(appState.toolPermissionContext)) stderrForShellReset = stdErrAppendShellResetMessage('');
  }

  // (4) Background task short-circuit
  if (result.backgroundTaskId) {
    const hints = extractPowerShellHints(result.stdout || '', input.command);
    if (isMainThread && hints.hints.length > 0) for (const h of hints.hints) maybeRecordPluginHint(h);
    return { data: { stdout: hints.stripped, stderr: [result.stderr || '', stderrForShellReset].filter(Boolean).join('\n'), interrupted: false, backgroundTaskId: result.backgroundTaskId, backgroundedByUser: result.backgroundedByUser, assistantAutoBackgrounded: result.assistantAutoBackgrounded } };
  }

  // (5) Build output (truncating accumulator) + interpret semantically
  const accumulator = new EndTruncatingAccumulator();
  const trimmedStdout = (result.stdout || '').trimEnd();
  accumulator.append(trimmedStdout + EOL_CONSTANT);
  const interpretation = interpretPowerShellResult(input.command, result.code, trimmedStdout, result.stderr || '');

  // (6) Extract plugin hints (and strip hint markers from displayed output)
  let displayStdout = stripAnsiCodes(accumulator.toString());
  const hints = extractPowerShellHints(displayStdout, input.command);
  displayStdout = hints.stripped;
  if (isMainThread && hints.hints.length > 0) for (const h of hints.hints) maybeRecordPluginHint(h);

  // (7) Pre-spawn errors are fatal
  if (result.preSpawnError) throw new Error(result.preSpawnError);

  // (8) Real error path: classify the error + log + throw
  const isInterrupt = result.interrupted && abortController.signal.reason === 'interrupt';
  if (interpretation.isError && !isInterrupt) {
    const sample = trimmedStdout.length <= 8192 ? trimmedStdout : trimmedStdout.slice(0, 4096) + trimmedStdout.slice(-4096);
    const errorClass = classifyPowerShellError(sample);
    const edition = (await detectPowerShellEdition()) ?? 'unknown';
    logEvent('tengu_powershell_tool_command_failed', { command_type: getCommandTypeForLogging(input.command), exit_code: result.code, stdout_length: trimmedStdout.length, error_class: errorClass, not_recognized_kind: errorClass === 'not_recognized' || errorClass === 'command_not_found' ? extractNotRecognizedKind(sample) ?? 'unextracted' : undefined, powershell_edition: edition });
    throw new ShellError(displayStdout, result.stderr || '', result.code, /* userCancel */ result.interrupted && (abortController.signal.reason === 'interrupt' || abortController.signal.reason === 'user-cancel' || abortController.signal.reason === 'remote-cancel'));
  }

  // (9) Output persistence: link the on-disk output file to tool-results if it's beyond 64 MiB
  const SIXTY_FOUR_MIB = 67108864;
  let persistedOutputPath, persistedOutputSize;
  if (result.outputFilePath && result.outputTaskId) {
    try {
      const stat = await fs.stat(result.outputFilePath);
      persistedOutputSize = stat.size;
      await ensureToolResultsDir();
      const destPath = getToolResultPath(result.outputTaskId, false);
      if (stat.size > SIXTY_FOUR_MIB) await fs.truncate(result.outputFilePath, SIXTY_FOUR_MIB);
      try { await fs.link(result.outputFilePath, destPath); }
      catch { await fs.copyFile(result.outputFilePath, destPath); }
      persistedOutputPath = destPath;
    } catch {}
  }

  // (10) Output truncation for inline display (separate from persistence)
  let isResultTruncated = isOutputLineTruncated(displayStdout);
  let displayOutput = displayStdout;
  if (isResultTruncated) {
    const truncated = await truncatePowerShellOutput(displayStdout, result.outputFilePath, persistedOutputSize, getMainLoopModel(context.options.mainLoopModel));
    if (truncated) displayOutput = truncated; else isResultTruncated = false;
  }

  const stderrCombined = [result.stderr || '', stderrForShellReset].filter(Boolean).join('\n');
  return { data: { stdout: displayOutput, stderr: stderrCombined, interrupted: result.interrupted, returnCodeInterpretation: interpretation.message, ...(persistedOutputPath && { persistedOutputPath, persistedOutputSize }) } };
}

// Mapping: D45→runPowerShellCommand, RK8→trackGitOperations, Af8→resetCwdIfOutsideProject,
//          _f8→stdErrAppendShellResetMessage, mf$→extractPowerShellHints,
//          OP$→maybeRecordPluginHint, vt7→interpretPowerShellResult, $f8→stripAnsiCodes,
//          DT→ShellError, NX$→detectPowerShellEdition, We7→EOL_CONSTANT, Y$$→EndTruncatingAccumulator
```

### Key algorithm: PowerShell 7+ detection (v2.1.126)

**What it does:** Find a PowerShell binary on the host, preferring `pwsh` (PowerShell 7+) over `powershell` (5.1).

**How it works (cli_inner_pretty.js:360968-360996):**
1. `which pwsh` first.
2. On Linux, if the `pwsh` binary is under `/snap/` (snap-packaged), check `/opt/microsoft/powershell/7/pwsh` and `/usr/bin/pwsh` as fallbacks. Snap-packaged `pwsh` can't reach the host filesystem freely.
3. On Windows, if `which pwsh` failed, check:
   - `%ProgramFiles%/PowerShell/7/pwsh.exe` (MSI installer location)
   - `%LOCALAPPDATA%/Microsoft/WindowsApps/pwsh.exe` (Microsoft Store install — uses `lstat` because it's a reparse point)
   - `%USERPROFILE%/.dotnet/tools/pwsh.exe` (`dotnet tool install` location)
4. Fall back to `which powershell` (5.1).

**Why this approach:** The 2.1.126 release notes call out: "Windows: PowerShell 7 installed via the Microsoft Store, MSI without PATH, or `.NET global tool` is now detected". Pre-2.1.126, only `where.exe pwsh` was checked, which missed all three of these install paths.

**Key insight:** The Microsoft Store path uses `Ji_` (`testFileExists` via `lstat`) instead of `iY8` (`stat().isFile()`). Store apps install via reparse points / symlinks that `stat` won't follow correctly — `lstat` checks the link existence directly.

### Key algorithm: edition adaptation (`detectPowerShellEdition`)

```javascript
async function detectPowerShellEdition() {
  const binary = await getPowerShellBinaryCached();
  if (!binary) return null;
  return binary.split(/[/\\]/).pop().toLowerCase().replace(/\.exe$/, '') === 'pwsh' ? 'core' : 'desktop';
}
```

**What it does:** Detect whether the active PowerShell is "core" (7+) or "desktop" (5.1) based on binary name.

**Used by:** The prompt builder (`Oe7` → three-branch prompt) and the failure telemetry (`logEvent('tengu_powershell_tool_command_failed', { powershell_edition })`).

### Key algorithm: prompt edition branches

The PowerShell prompt has three top-level branches (see [Bundle Source](#related-symbols) — `Oe7`):

1. **Branch 1: Windows PowerShell 5.1 (`powershell.exe`)** — explains that `&&`/`||` parser-error, `2>&1` wraps native stderr in ErrorRecord objects, default file encoding is UTF-16 LE BOM (must pass `-Encoding utf8`), `ConvertFrom-Json` returns PSCustomObject, etc.

2. **Branch 2: PowerShell 7+ (`pwsh`)** — explains that `&&`/`||` work normally, ternary/null-coalescing/null-conditional operators are available, default encoding is UTF-8 (no BOM).

3. **Branch 3: Unknown — assume 5.1 for compatibility** — defensive guidance.

**Why:** The model needs to know which features it can use. PS 5.1 has materially worse syntax (no `&&`); using `&&` in 5.1 is a parser error before any command runs. Branching the prompt at the edition lets the model write idiomatic code for whichever PowerShell is in use.

### Key algorithm: `git diff -- file` parsing fix (v2.1.126)

> PowerShell tool: bare `--` (e.g. `git diff -- file`) is no longer mis-flagged as the `--%` stop-parsing token

PowerShell has a special token `--%` ("stop parsing") that tells PS to pass remaining arguments verbatim to the called program. The PS AST parser (`bDH` / `parsePowerShellForSecurity`) used to misclassify bare `--` (a common pattern in `git diff -- file.txt`, `git log -- path`, etc.) as the start of `--%`. The fix:
1. Tighten the regex: `--%` must be the exact 3-character token, not a prefix.
2. Treat bare `--` as a normal argument so subcommand splitting works.

Pre-2.1.126, `git diff -- file.txt` would fail the security parser and (under strict configs) be blocked. Now it parses cleanly.

### Key algorithm: PowerShell exit-code semantics

PowerShell has *two* concepts that map to "did this fail?":
1. `$LASTEXITCODE` — set by **native** executables (git, npm, etc.).
2. `$?` — set by **cmdlets** to `$true` on success.

The wrapper in `zU7` (the shell adapter at line 361027-) does:
```powershell
; $_ec = if ($null -ne $LASTEXITCODE) { $LASTEXITCODE } elseif ($?) { 0 } else { 1 }
; exit $_ec
```

**What it does:** Resolve the final exit code to *either* the native exit code (if a native exe was the last invocation) *or* 0/1 based on cmdlet success (if a cmdlet was the last invocation).

**Why this approach:** Without this, a cmdlet failure would silently exit 0 (because `$LASTEXITCODE` from a prior native call still hangs around). The model would think the command succeeded. The wrapper makes the semantics: "if a native exe ran, use its code; otherwise use the cmdlet result".

**Key insight:** `-ErrorAction SilentlyContinue` suppresses error *output* but doesn't change the exit code. The prompt explicitly tells the model: "promote it to terminating and swallow: `try { Cmdlet ... -ErrorAction Stop } catch {}`".

### Key algorithm: working-directory persistence

PowerShell subprocesses don't inherit cwd changes back to the parent. The wrapper writes the final `(Get-Location).Path` to a temp file:
```powershell
(Get-Location).Path | Out-File -FilePath '<tmpfile>' -Encoding utf8 -NoNewline
```

Claude reads this file after the command exits and uses it as the next command's cwd. This is how `cd ~/projects; ls` followed by `git status` runs from `~/projects` even though the two `runPowerShellCommand` calls are separate subprocess invocations.

The temp file path is `claude-pwd-ps-${task.id}` — task-specific so parallel runs don't clobber each other.

## Render methods

PowerShellTool's render functions mirror Bash's: `renderToolUseMessage`, `renderToolUseProgressMessage`, `renderToolUseQueuedMessage`, `renderToolResultMessage`, `renderToolUseErrorMessage`. The result message uses the same `<OutputLine>` UI primitive with the same end-truncating display.

## Key insights

1. **`userFacingName()` always returns `'PowerShell'`** — there's no `SandboxedPowerShell` variant because PowerShell on Windows doesn't run inside the bubblewrap sandbox. The macOS/Linux sandbox is for Bash; PS on those platforms is for advanced opt-in users only.

2. **`getDefaultShellName()` (`PZH`)** picks `'bash'` when bash is available, `'powershell'` otherwise. This is what the **other** tools use to format example commands in their prompts — so on a Windows-without-Git-Bash host, prompts saying "use `ls` to check the dir" become "use `Get-ChildItem`".

3. **`Sq` and `EK` are siblings in `QW`.** The shell-tool array `QW = [Sq, EK]` (line 141680) is used by the tool registry to know which tools represent "shells" — for the `--shell` flag, the auto-classifier shell-section grouping, and other places that need a generic "what shell do we have?" answer.

4. **Output persistence at 64 MiB.** Bash uses the same 64 MiB threshold for hard-linking the output file into the tool-results dir. The `link` → `copyFile` fallback handles cases where the source and destination are on different filesystems (link returns EXDEV).

5. **`detectPowerShellEdition` is cached.** The first call shells out to find the binary (`Xi_`). Subsequent calls reuse `xv6` (the module-level cache) so the failure-telemetry edition field doesn't add per-failure overhead.

6. **`isPowerShellReadOnly` (`PM8`) excludes dangerous cmdlets first.** `Remove-Item`, `Set-Content`, `Out-File`, `Stop-Process`, `Stop-Service`, etc. are not read-only. A command passing the dangerous-cmdlet check then goes through the standard read-only verb-noun heuristic.

7. **Permission auto-approval (v2.1.119).** `PowerShell` tool commands can now be auto-approved in permission mode, matching Bash behavior — they go through the same `--dangerously-skip-permissions` and `auto.allow` paths.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.112 | Rollout of PowerShell tool via `CLAUDE_CODE_USE_POWERSHELL_TOOL` env var and `tengu_cobalt_ridge` feature flag | `isPowerShellToolEnabled` (Su) |
| 2.1.119 | PowerShell tool commands can now be auto-approved in permission mode, matching Bash behavior | permission path |
| 2.1.120 | Windows: Git for Windows (Git Bash) no longer required — Claude Code uses PowerShell as the shell tool when absent | `isPowerShellToolEnabled` no-bash branch |
| 2.1.126 | PowerShell 7 installed via Microsoft Store, MSI without PATH, or `.NET global tool` is now detected | `findPowerShellBinary` (Xi_) — added Store/MSI/.NET tool paths |
| 2.1.126 | When the PowerShell tool is enabled, Claude treats PowerShell as the primary shell instead of defaulting to Bash | `getDefaultShellName` selection |
| 2.1.126 | Bare `--` (e.g. `git diff -- file`) no longer mis-flagged as `--%` stop-parsing token | `parsePowerShellForSecurity` (bDH) — regex fix |
| 2.1.126 | Windows: clipboard writes no longer expose copied content in process command-line arguments visible to EDR/SIEM telemetry; also fixes >22KB selections | clipboard backend; tangential to PS tool |
| 2.1.139 | Recurring event-loop stall on Windows when a missing executable (e.g. `gh`) triggered synchronous `where.exe` re-spawns on every check — fixed | `findPowerShellBinary` caching + `findGitBashOnWindows` |
| 2.1.142 | (no PowerShell-specific functional changes; tool inherits the Monitor sleep guard via `validateInput`) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `PowerShellTool` (dy6) — top-level tool object built by `XK`
- `isPowerShellToolEnabled` (Su) — rollout gate
- `isBashAvailableOnHost` (Y9) — Git Bash detection helper
- `getDefaultShellName` (PZH) — bash/powershell selector
- `findGitBashOnWindows` (P6H) — looks up `bash.exe` in well-known Windows locations
- `findPowerShellBinary` (Xi_) — locates pwsh / powershell with MSI/Store/.NET/snap workarounds
- `getPowerShellBinaryCached` (zB) — memoized `findPowerShellBinary`
- `detectPowerShellEdition` (NX$) — returns `"core"` (pwsh) or `"desktop"` (powershell)
- `parsePowerShellForSecurity` (bDH) — AST parser; v2.1.126 fix for `--` token
- `extractPowerShellSubcommands` (qW) — yields per-subcommand argv
- `toPowerShellAlias` (Vz) — `ls → Get-ChildItem` resolver
- `isPowerShellReadOnly` (PM8) — read-only verb-noun classifier
- `hasDangerousPowerShellCmdlet` (gt7) — destructive cmdlet detector
- `runPowerShellCommand` (D45) — async generator that spawns + streams pwsh
- `interpretPowerShellResult` (vt7) — semantic exit-code interpretation
- `extractPowerShellHints` (mf$) — plugin-hint extractor
- `detectBlockedPowerShellSleep` (ve7) — sleep-pattern guard
- `getPowerShellPrompt` (Oe7) — three-branch prompt builder
- `POWERSHELL_PLATFORM_ERROR` (Ge7) — error string for unsupported platforms
- `POWERSHELL_TOOL_NAME` (EK) — `"PowerShell"`
- `EOL_CONSTANT` (We7) — newline character
- `POWERSHELL_BLOCKING_BUDGET_MS` (z45) — assistant-mode budget (15s, same as Bash)
- `EndTruncatingAccumulator` (Y$$) — output accumulator (shared with Bash)
- `ShellError` (DT) — thrown when interpretation indicates a real error
