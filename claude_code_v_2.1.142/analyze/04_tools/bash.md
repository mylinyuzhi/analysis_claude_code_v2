# Bash Tool — v2.1.142

## Overview

`BashTool` (`L4` in cli_inner_pretty.js:419457) is the workhorse shell executor. It runs a single `/bin/sh -c <command>` subprocess inside the project sandbox, captures interleaved stdout/stderr, supports timeouts, run-in-background, simulated sed edits, and a rich set of permission/sandbox/auto-mode integrations. It is the most complex tool in the toolset: a typical `call()` traverses compound-command parsing, env-var prefix handling, sandbox decision, `gh`/`git` semantic interpretation, sed→Edit redirection, output truncation/persistence, and image content detection.

## Schema (Zod)

```javascript
// ============================================
// bashInputSchema — BashTool input parameters
// Location: cli_inner_pretty.js:227-247 / z64() at runtime
// ============================================

// ORIGINAL (for source lookup):
// z64() returns z.strictObject({ command, timeout, description, run_in_background, dangerouslyDisableSandbox, _simulatedSedEdit })

// READABLE (for understanding):
const bashInputSchema = z.strictObject({
  command: z.string().describe('The command to execute'),
  timeout: semanticNumber(z.number().optional()).describe(`Optional timeout in milliseconds (max ${getMaxTimeoutMs()})`),
  description: z.string().optional().describe('Clear, concise description of what this command does in active voice'),
  run_in_background: semanticBoolean(z.boolean().optional()).describe('Set to true to run this command in the background'),
  dangerouslyDisableSandbox: semanticBoolean(z.boolean().optional()).describe('Set this to true to dangerously override sandbox mode'),
  _simulatedSedEdit: z.object({ filePath: z.string(), newContent: z.string() }).optional()
    .describe('Internal: pre-computed sed edit result from preview')
});
// `_simulatedSedEdit` is omitted from the model-facing schema (set internally by the permission dialog)
// `run_in_background` is omitted when CLAUDE_CODE_DISABLE_BACKGROUND_TASKS is set

// Mapping: z64→bashInputSchema (lazy via yH/lazySchema)
```

Output schema (`F55()`) carries `stdout`, `stderr`, `interrupted`, `isImage`, `backgroundTaskId`, `backgroundedByUser`, `assistantAutoBackgrounded`, `returnCodeInterpretation`, `noOutputExpected`, `structuredContent`, `persistedOutputPath`, `persistedOutputSize`.

`maxResultSizeChars` is **30,000** (`maxResultSizeChars: 30000` in line 419460) — anything larger spills to a `<persisted-output>` file under the tool-results dir; the inline preview is generated via `generatePreview` and the model gets `buildLargeToolResultMessage` chrome (`KOH(...)`).

## validateInput

```javascript
// ============================================
// validateInput — sleep-pattern guard
// Location: cli_inner_pretty.js:419519-419530
// ============================================

// ORIGINAL (for source lookup):
async function validateInput(H) {
  if (qg() && !eP$ && !H.run_in_background) {
    let $ = Q55(H.command);
    if ($ !== null)
      return { result: !1, message: `Blocked: ${$}. To wait for a condition, use Monitor with an until-loop ...`, errorCode: 10 };
  }
  return { result: !0 };
}

// READABLE (for understanding):
async function validateInput(input) {
  if (isMonitorFeatureEnabled() && !isBackgroundTasksDisabled && !input.run_in_background) {
    const sleepPattern = detectBlockedSleepPattern(input.command);
    if (sleepPattern !== null) {
      return {
        result: false,
        message: `Blocked: ${sleepPattern}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\`). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
        errorCode: 10
      };
    }
  }
  return { result: true };
}

// Mapping: qg→isMonitorFeatureEnabled, eP$→isBackgroundTasksDisabled, Q55→detectBlockedSleepPattern
```

`detectBlockedSleepPattern` (`Q55`) only matches **bare leading** `sleep N` where N is an integer ≥ 2. Float (`sleep 0.5`), sub-2s (`sleep 1`), and pipeline/subshell uses are all allowed. Triggers refer the model to either Monitor (for "wait until condition") or `run_in_background: true` (for "wait for a thing I started").

## checkPermissions

```javascript
// ============================================
// checkPermissions — bashToolHasPermission + sandbox override gate
// Location: cli_inner_pretty.js:419531-419570
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions(H, $) {
  let q = await XL$(H, $);
  if (H.dangerouslyDisableSandbox && q.behavior !== "deny" && q.behavior !== "ask"
      && !f64(q.decisionReason) && !bV(H) && bV({ ...H, dangerouslyDisableSandbox: !1 }))
    return { behavior: "ask", message: "Sandbox override requested", ruleSuggestions: [...] };
  return q;
}

// READABLE (for understanding):
async function checkPermissions(input, context) {
  const decision = await bashToolHasPermission(input, context);
  // Force an "ask" if the user asked to disable the sandbox but the same command would
  // otherwise run sandboxed — auto-mode classifier output is preserved.
  if (
    input.dangerouslyDisableSandbox &&
    decision.behavior !== 'deny' &&
    decision.behavior !== 'ask' &&
    !isExplicitAutoMode(decision.decisionReason) &&
    !shouldUseSandbox(input) &&
    shouldUseSandbox({ ...input, dangerouslyDisableSandbox: false })
  ) {
    return { behavior: 'ask', message: 'Sandbox override requested', ruleSuggestions: [...] };
  }
  return decision;
}

// Mapping: XL$→bashToolHasPermission, f64→isExplicitAutoMode, bV→shouldUseSandbox
```

This closes a hole from 2.1.113 (`Fixed Bash dangerouslyDisableSandbox running commands outside the sandbox without a permission prompt`). The `bV` cross-check ensures that even if `bashToolHasPermission` was content to auto-approve under another rule, **flipping the sandbox off forces an ask** unless the auto-mode classifier explicitly green-lit the unsandboxed form.

`bashToolHasPermission` itself walks the permission rule tree: per-subcommand prefix extraction via `O64`, wildcard match via `bNH`, AST-based subcommand splitting via `FUH` (`parseForSecurity`). Compound commands (`a && b`) must match **per-subcommand**: a `Bash(git *)` allow rule does not cover `ls && git push` unless the `ls` half also matches. Env-var prefix stripping (`FOO=bar git push`) is normalised before matching.

## call

The execution body (cli_inner_pretty.js:419572-419800, mirrors TS at `BashTool.tsx:624-880`) is structured as:

```javascript
// ============================================
// BashTool.call — main execution path
// Location: cli_inner_pretty.js:419572-419800 (mirrors src/tools/BashTool/BashTool.tsx:624-880)
// ============================================

// ORIGINAL (for source lookup):
// async call(H, $, q, K, _) {
//   if (H._simulatedSedEdit) return zW8(H._simulatedSedEdit, $, K);
//   const { abortController, getAppState, setAppState, setToolJSX } = $;
//   const M = D45({ input: H, abortController, ... });
//   for await (const w of M) { /* emit progress */ }
//   const D = M.return_value; /* { stdout, stderr, code, interrupted, ... } */
//   RK8(H.command, D.code, D.stdout); /* trackGitOperations */
//   const interpretation = vt7(H.command, D.code, D.stdout, ""); /* interpretCommandResult */
//   if (interpretation.isError && !isInterrupt && D.code !== 0)
//     accumulator.append(`Exit code ${D.code}`);
//   ...
// }

// READABLE (for understanding):
async function call(input, toolUseContext, _canUseTool, parentMessage, onProgress) {
  // (1) If permission dialog pre-computed a sed-edit, apply it directly (skip the shell)
  if (input._simulatedSedEdit) {
    return applySedEdit(input._simulatedSedEdit, toolUseContext, parentMessage);
  }

  const { abortController, getAppState, setAppState, setToolJSX } = toolUseContext;
  const stdoutAccumulator = new EndTruncatingAccumulator();
  const isMainThread = !toolUseContext.agentId;
  const preventCwdChanges = !isMainThread;

  // (2) Spawn under sandbox, emit progress events
  const commandGenerator = runShellCommand({
    input,
    abortController,
    setAppState: toolUseContext.setAppStateForTasks ?? setAppState,
    setToolJSX,
    preventCwdChanges,
    isMainThread,
    toolUseId: toolUseContext.toolUseId,
    agentId: toolUseContext.agentId,
  });
  let result;
  for await (const progress of commandGenerator) {
    if (onProgress) onProgress({ toolUseID: `bash-progress-${i++}`, data: { type: 'bash_progress', ...progress } });
  }
  result = commandGenerator.returnValue;

  // (3) Track git ops for telemetry (PR count, commit count, etc.)
  trackGitOperations(input.command, result.code, result.stdout);

  // (4) Semantic interpretation: e.g. `grep` exit 1 = "no match" not error
  const interpretation = interpretCommandResult(input.command, result.code, result.stdout, '');

  // (5) Append "Exit code N" only if interpretation says it's a real error
  stdoutAccumulator.append((result.stdout || '').trimEnd() + '\n');
  if (interpretation.isError && !isInterrupt && result.code !== 0) {
    stdoutAccumulator.append(`Exit code ${result.code}`);
  }

  // (6) Reset cwd if the command moved us outside the project root
  if (!preventCwdChanges) {
    const appState = getAppState();
    if (resetCwdIfOutsideProject(appState.toolPermissionContext)) {
      stderrForShellReset = stdErrAppendShellResetMessage('');
    }
  }

  // (7) Detect image output (PNG/JPEG header on stdout)
  const isImage = isImageOutput(result.stdout);

  // (8) Build the result object — backgrounded tasks short-circuit out earlier
  return { data: { stdout, stderr, interrupted, isImage, returnCodeInterpretation, ... } };
}

// Mapping: D45→runShellCommand, RK8→trackGitOperations, vt7→interpretCommandResult,
//          Af8→resetCwdIfOutsideProject, _f8→stdErrAppendShellResetMessage,
//          isImageOutput→isImageOutput (utils.ts), zW8→applySedEdit
```

### Key algorithm: compound command parsing

**What it does:** Decide whether `cmd1 && cmd2 | cmd3` should be treated as read-only, which UI summary to show, and whether to collapse it.

**How it works:**
1. `splitCommandWithOperators(command)` returns an array of subcommands interleaved with operators (`&&`, `||`, `|`, `;`, `>`, `>>`, `>&`).
2. Walk the array. Skip the **target** of any redirect operator (a `> file` is the redirect, not a command). Skip pipe operators themselves.
3. For each command part, extract the base command (`part.trim().split(/\s+/)[0]`).
4. If the base command is **semantic-neutral** (`echo`, `printf`, `true`, `false`, `:`), skip it — these don't change the read/search character of the pipeline.
5. If a non-neutral, non-search-non-read-non-list command appears, return `{ isSearch: false, isRead: false, isList: false }` immediately.
6. Otherwise, OR-accumulate `hasSearch | hasRead | hasList` flags and return at the end.

**Why this approach:** Pure positional matching ("first command wins") would mis-classify pipelines like `ls -la | head` (which is a directory listing followed by a read). The "all parts must be read/search" semantics ensures any non-read subcommand in a pipeline disqualifies it from the collapsible-UI path. Semantic-neutral commands are skipped so that `ls dir && echo "---" && ls dir2` is still recognised as a list operation.

**Key insight:** The `BASH_SEMANTIC_NEUTRAL_COMMANDS` set (`echo`, `printf`, `true`, `false`, `:`) was added specifically so that the model's habit of inserting `echo` separators between subcommands doesn't break collapse detection.

### Key algorithm: env-var prefix handling

**What it does:** Normalise `FOO=bar BAZ=qux git push` so a `Bash(git *)` permission rule matches it.

**How it works:** `parseForSecurity` (uses `shell-quote` semantics) returns a structured parse where each command has `argv` separated from leading var assignments. The permission matcher operates on `argv.join(' ')` (the post-prefix command line).

**Why this approach:** Pre-2.1.113, an attacker could bypass `Bash(git *)` deny rules by writing `FOO=bar git push` because the rule matcher used naive substring detection. Now the AST-derived argv is canonical.

**Key insight:** This is also how `xargs <cmd>` and other exec wrappers (`env`, `sudo`, `watch`, `ionice`, `setsid`) are stripped at rule-match time — see the `q.some((A) => { ... A === \`xargs ${_}\`...})` short-circuit at line 419485.

### Key algorithm: sandbox decision (`shouldUseSandbox`)

**What it does:** Decide whether to spawn the command inside the bubblewrap/sandbox-exec sandbox.

**How it works (high level — full detail in sandbox unit):**
1. Read sandbox mode from the active permission context (`appState.toolPermissionContext.sandboxMode`).
2. Apply per-command exclusions via `RA5` (`isCommandExcludedFromSandbox`) — e.g., `sleep`, `cd`, certain git read-only ops can bypass sandbox even in sandboxed mode.
3. Apply config-based command/substring exclusions (`tengu_sandbox_disabled_commands`).
4. Apply user-configured `sandbox.excludedCommands` patterns.

**Why this approach:** Some commands either don't benefit from sandboxing (`cd`) or break inside it (`git config` needs to read `~/.gitconfig`). Excluding them avoids friction while keeping the sandbox in place for anything net-touching.

**Key insight:** `userFacingName` calls `shouldUseSandbox` per-render with a fast-path env guard: `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` must be truthy or the function short-circuits. Without that guard, every transcript render would re-tokenize the command — for ~50 messages this would exceed the shimmer animation tick and trigger an infinite re-render (regression #21605).

### Key algorithm: simulated sed edit

**What it does:** When a `sed -i 's/old/new/' file.txt` command is detected and the user approves it in the permission dialog, **don't actually run sed**. Apply the pre-computed result directly via `writeTextContent`.

**How it works:**
1. `parseSedEditCommand` (`FvH`) detects in-place sed edits and extracts `(filePath, newContent)`.
2. The permission UI shows a diff preview using `newContent`.
3. If the user approves, `_simulatedSedEdit: { filePath, newContent }` is pre-populated on the input.
4. `call()` short-circuits to `applySedEdit` which detects encoding, tracks file history, writes content, updates `readFileState`, notifies VS Code.

**Why this approach:** Running sed for real means the actually-written content depends on the host's sed implementation (GNU vs BSD) and on the precise pattern. The model's preview may not match what sed actually produces. Pre-computing the result deterministically removes that ambiguity.

**Key insight:** `_simulatedSedEdit` is stripped from the model-facing schema (see schema discussion above). If it were exposed, the model could pair `command: "echo hi"` with `_simulatedSedEdit: { filePath: "~/.ssh/authorized_keys", newContent: "..." }` and bypass both the sandbox and any permission system entirely.

### `gh` rate-limit hint

When `gh` commands hit GitHub's API rate limit, `extractClaudeCodeHints` (`mf$` for PS, similar for Bash via `extractPluginHints`) scans the output for the rate-limit signature and emits a structured hint to the model: "Rate limit hit, suggesting backoff". Added in 2.1.116 to stop the agent from spamming retries.

## Render methods

- `renderToolUseMessage` (`Vp_8` / `s_$4`) — line + command preview with descriptor chrome.
- `renderToolUseProgressMessage` — live progress UI: elapsed time, byte count, task id, sandbox indicator.
- `renderToolUseQueuedMessage` — shows "Queued (waiting for X)" when blocked behind a serial gate.
- `renderToolResultMessage` — `BashToolResultMessage` component: `<OutputLine content={stdout}>` + stderr. Truncation at the **end** for the UI; the model-side serialization uses head+tail with a `<persisted-output>` wrapper if needed.
- `renderToolUseRejectedMessage` — appears when the user denies a permission ask.
- `renderToolUseErrorMessage` — shown when `validateInput` rejects (e.g., sleep guard).

`mapToolResultToToolResultBlockParam` constructs the **model-facing** message. The UI never sees persisted-output framing or background-info text — those are appended only to the content sent back to the model.

## Key insights

1. **The UI and the model see different things.** `extractSearchText` returns `stderr ? \`${stdout}\n${stderr}\` : stdout` (for transcript search). `mapToolResultToToolResultBlockParam` builds the model message: persisted-output wrapper for large output, `<error>` tags for interruptions, background-info banner. `renderToolResultMessage` shows the raw stdout to the user. Three render paths, three different formats.

2. **Background detection has three modes:** (a) explicit `run_in_background: true` from the model, (b) user pressing Ctrl+B mid-execution (`backgroundedByUser`), (c) assistant-mode auto-background when a blocking command exceeds `ASSISTANT_BLOCKING_BUDGET_MS` (15s). All three set `backgroundTaskId` but produce different model-facing messages so the agent knows whether to expect output later or accept the trade-off.

3. **`isAutobackgroundingAllowed`** specifically excludes `sleep` from auto-backgrounding. `sleep 30` in the model's command stays foreground because backgrounding a sleep is meaningless — you wanted the wait.

4. **`isImageOutput`** detects PNG/JPEG headers in the stdout buffer and uses `buildImageToolResult` to ship the image as an image content block instead of a string. Common pattern: `cat screenshot.png` or `convert in.png out.png` producing a final image.

5. **The CWD reset trap:** if a Bash command does `cd /tmp && ...` and ends outside the project root, `resetCwdIfOutsideProject` snaps cwd back to the project and `stdErrAppendShellResetMessage` adds a note to stderr explaining why. Only fires on the main thread (`!preventCwdChanges`) — subagent cwd changes are scoped to the subagent.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.113 | Fixed `dangerouslyDisableSandbox` running outside sandbox without a permission prompt (the `bV` cross-check in `checkPermissions`) | cli_inner_pretty.js:419533-419540 |
| 2.1.113 | Multi-line commands whose first line is a comment now show the full command in the transcript (UI-spoofing fix) | `getToolUseSummary` |
| 2.1.113 | `cd <current-directory> && git ...` no longer triggers a permission prompt when the `cd` is a no-op | `commandHasAnyCd` / `rM$` |
| 2.1.113 | `Bash(rm:*)` allow rules: macOS `/private/{etc,var,tmp,home}` now treated as dangerous removal targets | `IX6` / `nUH` |
| 2.1.113 | Bash deny rules now match commands wrapped in `env`/`sudo`/`watch`/`ionice`/`setsid` | `parseForSecurity` |
| 2.1.113 | `Bash(find:*)` allow rules no longer auto-approve `find -exec`/`-delete` | new check in static rule path |
| 2.1.116 | Bash tool surfaces a hint when `gh` hits GitHub API rate limit | `extractClaudeCodeHints` integration |
| 2.1.119 | `autoAllowBashIfSandboxed` fix: shell expansions like `$VAR` and `$(cmd)` now auto-approved when sandbox covers them | `WA5` autoAllowSingleCmdChecker |
| 2.1.120 | False-positive "Dangerous rm operation" prompts in auto mode for multi-line bash commands with both pipe and redirect | dangerous-path classifier |
| 2.1.120 | Reduced peak file descriptor usage during `find` in the Bash tool on large directory trees | child-stream handling |
| 2.1.121 | Bash tool no longer becomes permanently unusable when the directory Claude was started in is deleted/moved mid-session | cwd reset path |
| 2.1.121 | Embedded grep/find/rg shell wrappers fall back to installed tools when the running binary is deleted mid-session | wrapper fallback |
| 2.1.128 | `Bash(mkdir *)`, `Bash(touch *)` allow rules honored for in-project paths | permission matcher |
| 2.1.128 | Parallel shell tool calls: failing read-only command (grep/git diff/ls) no longer cancels sibling calls | parallel scheduler |
| 2.1.128 | Subprocesses no longer inherit `OTEL_*` env vars | `XI` subprocessEnv builder |
| 2.1.132 | Added `CLAUDE_CODE_SESSION_ID` env var to Bash tool subprocess environment | `XI` |
| 2.1.133 | Hooks/Bash receive `$CLAUDE_EFFORT` env var via the effort.level field | `XI` |
| 2.1.136 | Fixed Bash permission prompts showing an internal parser diagnostic instead of a user-readable explanation | bashPermissions message builder |
| 2.1.139 | `autoAllowBashIfSandboxed` now auto-approves commands with shell expansions like `$VAR` and `$(cmd)` | `WA5` |
| 2.1.142 | New `Monitor` tool + sleep guard: `validateInput` blocks bare leading `sleep N` (N≥2 integer) unless `run_in_background: true` | `Q55` / `qg` feature flag |
| 2.1.142 | `Bash` command can read `$CLAUDE_EFFORT` env var | inherited via `XI` |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — base index (older bundle)

Key functions in this document:
- `BashTool` (L4) — top-level tool object built by `XK` (buildTool factory)
- `runShellCommand` (D45) — async generator that spawns + streams the subprocess
- `bashToolHasPermission` (XL$) — permission decision walker
- `parseForSecurity` (FUH) — bash AST parser for compound commands
- `shouldUseSandbox` (bV) — sandbox decision based on permission context + exclusions
- `detectBlockedSleepPattern` (Q55) — sleep-pattern sleep-guard added in 2.1.142
- `applySedEdit` (zW8) — pre-computed sed edit applicator
- `parseSedEditCommand` (FvH) — extract (filePath, newContent) from `sed -i` calls
- `interpretCommandResult` (vt7) — semantic interpretation of exit codes (e.g., grep exit 1 = no match)
- `trackGitOperations` (RK8) — git commit/PR telemetry
- `commandHasAnyCd` (rM$) — detect `cd` in any subcommand
- `checkReadOnlyConstraints` (A78) — gate for `isReadOnly`
- `permissionRuleExtractPrefix` (O64) — extract the wildcard-free prefix of a permission rule
- `matchWildcardPattern` (bNH) — glob-style match against a permission pattern
- `isExplicitAutoMode` (f64) — distinguish auto-mode allow from regular allow
- `fileEditUserFacingName` (Iw8) — rename sed-edit Bash calls in the UI
