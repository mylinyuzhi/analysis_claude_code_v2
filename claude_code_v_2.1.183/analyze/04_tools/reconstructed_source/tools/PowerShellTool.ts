/**
 * PowerShellTool — Windows PowerShell command execution tool (contract-level reconstruction).
 *
 * Logic-equivalent to v2.1.156 PowerShell tool; obf ids RE-DERIVED for v2.1.183 by string-anchoring
 * the name const (`Xs="PowerShell"`), the description `"Run PowerShell command"`, and the input-schema
 * thunk `V1p`/`J7a` onto the single `Mdo = pi({...})` tool object.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - name const            `Xs`                       @221424
 *   - input schema          `J7a` (base) / `V1p`       @443050-443062 / @443063
 *   - output schema         `z1p`                      @443064-443087
 *   - allowlisted exes      `K1p`                      @443088-443111
 *   - tool object           `Mdo = pi({...})`          @443112-443398 (call @443244)
 *   - prompt builder        `N7a`                      @442562-442665
 *     edition branch        `N1p`                      @442555-442561
 *     background note       `$1p`                      @442547-442550
 *     sleep-policy note     `O1p`                      @442551-442554
 *   - sleep guard           `Q7a`                      @442792-442807
 *   - unavailable policy    `X7a` / `Y7a` (message)    @442808-442815 / @442982
 *   - permission resolver   `$7a`                      @442124-442290+
 *   - isReadOnly helpers    `g7a` (mutating?) / `k4n`  @439748-439759 / @439760-439797
 *   - search/read classify  `j1p`                      @442763-442785
 *
 * 2.1.88 convention mirror: src/tools/PowerShellTool/{PowerShellTool.tsx,prompt.ts,toolName.ts,
 *   powershellPermissions.ts,readOnlyValidation.ts,commandSemantics.ts,commonParameters.ts}
 * 2.1.156 scaffold: 04_tools/README.md (Bash/PowerShell exec-tool family)
 *
 * Cross-validation note: re-read the bundle tool object @443112; confirmed `isEnabled() { return !0 }`
 * is explicit on this tool (@443177), the `Y7a` enterprise-policy block message verbatim @442983, and the
 * `Q7a` PowerShell sleep guard "Blocked: …Monitor runs bash" family @443187. Prompt text confirmed
 * against assets/tools/PowerShell.md and re-read from `N7a`/`N1p` in the bundle.
 */

import { z } from "zod";
import type {
  Tool,
  ToolUseContext,
  ValidationResult,
  PermissionResult,
} from "../Tool";

// ───────────────────────────────────────────────────────────────────────────
// Identity
// ───────────────────────────────────────────────────────────────────────────

// 2.1.183: TOOL_NAME = Xs @cli_inner_pretty.js:221424
export const POWERSHELL_TOOL_NAME = "PowerShell";

// 2.1.183: BACKGROUND_TASKS_DISABLED = Ddt @cli_inner_pretty.js:443049
//   reads env CLAUDE_CODE_DISABLE_BACKGROUND_TASKS; when set, the schema omits run_in_background.
const BACKGROUND_TASKS_DISABLED = Boolean(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS);

// 2.1.183: ENTERPRISE_POLICY_BLOCKED_MESSAGE = Y7a @cli_inner_pretty.js:442982
// @442982 — verbatim message returned by validateInput when X7a() (PowerShell blocked by policy) is true.
const ENTERPRISE_POLICY_BLOCKED_MESSAGE =
  "Enterprise policy requires sandboxing, but sandboxing is not available on native Windows. Shell command execution is blocked on this platform by policy.";

// 2.1.183: SLEEP_COMMAND_NAMES = W1p @cli_inner_pretty.js:443048 — ["start-sleep","sleep"]
// 2.1.183: ALLOWLISTED_EXECUTABLES = K1p @cli_inner_pretty.js:443088-443111
//   command-name allowlist used by the auto-classifier input (`Q3t` @442816): npm, yarn, pnpm, node,
//   python, python3, go, cargo, make, docker, terraform, webpack, vite, jest, pytest, curl,
//   Invoke-WebRequest, build, test, serve, watch, dev.

// ───────────────────────────────────────────────────────────────────────────
// Input / output schema
// ───────────────────────────────────────────────────────────────────────────

/**
 * Base input schema.
 * 2.1.183: J7a = we(() => H.strictObject({...})) @cli_inner_pretty.js:443050-443062
 * `J3t()` is the max-timeout (ms) provider; `GB`/`n0` are the optional-with-coercion wrappers.
 */
const baseInputSchema = z.strictObject({
  // @443051
  command: z.string().describe("The PowerShell command to execute"),
  // @443052 — `${J3t()}` is the runtime max-timeout in ms.
  timeout: z
    .number()
    .optional()
    .describe(`Optional timeout in milliseconds (max ${getMaxTimeoutMs()})`),
  // @443053-443055
  description: z
    .string()
    .optional()
    .describe("Clear, concise description of what this command does in active voice."),
  // @443056
  run_in_background: z
    .boolean()
    .optional()
    .describe("Set to true to run this command in the background."),
  // @443057-443059
  dangerouslyDisableSandbox: z
    .boolean()
    .optional()
    .describe(
      "Set this to true to dangerously override sandbox mode and run commands without sandboxing.",
    ),
});

/**
 * Effective input schema — drops `run_in_background` when background tasks are disabled.
 * 2.1.183: V1p = we(() => Ddt ? J7a().omit({run_in_background:!0}) : J7a()) @cli_inner_pretty.js:443063
 */
function getInputSchema() {
  return BACKGROUND_TASKS_DISABLED
    ? baseInputSchema.omit({ run_in_background: true })
    : baseInputSchema;
}

type PowerShellInput = z.infer<typeof baseInputSchema>;

/**
 * Output schema.
 * 2.1.183: z1p = we(() => H.object({...})) @cli_inner_pretty.js:443064-443087
 */
const outputSchema = z.object({
  stdout: z.string().describe("The standard output of the command"),
  stderr: z.string().describe("The standard error output of the command"),
  interrupted: z.boolean().describe("Whether the command was interrupted"),
  returnCodeInterpretation: z
    .string()
    .optional()
    .describe("Semantic interpretation for non-error exit codes with special meaning"),
  isImage: z.boolean().optional().describe("Flag to indicate if stdout contains image data"),
  persistedOutputPath: z
    .string()
    .optional()
    .describe("Path to persisted full output when too large for inline"),
  persistedOutputSize: z
    .number()
    .optional()
    .describe("Total output size in bytes when persisted"),
  backgroundTaskId: z
    .string()
    .optional()
    .describe("ID of the background task if command is running in background"),
  backgroundedByUser: z
    .boolean()
    .optional()
    .describe("True if the user manually backgrounded the command with Ctrl+B"),
  // @443085-443088 — `@internal` git/gh classification, client-facing, not surfaced to the model.
  gitOperation: gitOperationSchema()
    .optional()
    .describe(
      "@internal Structured classification of git/gh operations detected in this command " +
        "(commit/push/merge/rebase/PR). Client-facing — lets clients render git activity without " +
        "re-parsing stdout; not surfaced to the model.",
    ),
});

// ───────────────────────────────────────────────────────────────────────────
// Prompt
// ───────────────────────────────────────────────────────────────────────────

/**
 * PowerShell-edition guidance block.
 * 2.1.183: N1p = function(edition) @cli_inner_pretty.js:442555-442561
 * The active edition ("desktop" = Windows PowerShell 5.1, "core" = PowerShell 7+, else unknown) is
 * resolved via `await wOt()` inside the prompt builder.
 */
function powershellEditionBlock(edition: "desktop" | "core" | string): string {
  if (edition === "desktop")
    // @442556
    return (
      "PowerShell edition: Windows PowerShell 5.1 (powershell.exe)\n" +
      "   - Pipeline chain operators `&&` and `||` are NOT available — they cause a parser error. To run B only if A succeeds: `A; if ($?) { B }`. To chain unconditionally: `A; B`.\n" +
      "   - Ternary (`?:`), null-coalescing (`??`), and null-conditional (`?.`) operators are NOT available. Use `if/else` and explicit `$null -eq` checks instead.\n" +
      "   - Avoid `2>&1` on native executables. In 5.1, redirecting a native command's stderr inside PowerShell wraps each line in an ErrorRecord (NativeCommandError) and sets `$?` to `$false` even when the exe returned exit code 0. stderr is already captured for you — don't redirect it.\n" +
      "   - Default file encoding is UTF-16 LE (with BOM). When writing files other tools will read, pass `-Encoding utf8` to `Out-File`/`Set-Content`.\n" +
      "   - `ConvertFrom-Json` returns a PSCustomObject, not a hashtable. `-AsHashtable` is not available."
    );
  if (edition === "core")
    // @442558
    return (
      "PowerShell edition: PowerShell 7+ (pwsh)\n" +
      "   - Pipeline chain operators `&&` and `||` ARE available and work like bash. Prefer `cmd1 && cmd2` over `cmd1; cmd2` when cmd2 should only run if cmd1 succeeds.\n" +
      "   - Ternary (`$cond ? $a : $b`), null-coalescing (`??`), and null-conditional (`?.`) operators are available.\n" +
      "   - Default file encoding is UTF-8 without BOM."
    );
  // @442560
  return (
    "PowerShell edition: unknown — assume Windows PowerShell 5.1 for compatibility\n" +
    "   - Do NOT use `&&`, `||`, ternary `?:`, null-coalescing `??`, or null-conditional `?.`. These are PowerShell 7+ only and parser-error on 5.1.\n" +
    "   - To chain commands conditionally: `A; if ($?) { B }`. Unconditionally: `A; B`."
  );
}

/**
 * Background-task usage note (omitted when background tasks are disabled).
 * 2.1.183: $1p @cli_inner_pretty.js:442547-442550
 */
function backgroundUsageNote(): string | null {
  if (BACKGROUND_TASKS_DISABLED) return null;
  return "  - You can use the `run_in_background` parameter to run the command in the background. Only use this if you don't need the result immediately and are OK being notified when the command completes later. You do not need to check the output right away - you'll be notified when it finishes.";
}

/**
 * Anti-`Start-Sleep` git-section preamble (omitted when background tasks are disabled).
 * 2.1.183: O1p @cli_inner_pretty.js:442551-442554
 */
function antiSleepNote(): string | null {
  if (BACKGROUND_TASKS_DISABLED) return null;
  return (
    "  - Avoid unnecessary `Start-Sleep` commands:\n" +
    "    - Do not sleep between commands that can run immediately — just run them.\n" +
    "    - If your command is long running and you would like to be notified when it finishes — simply run your command using `run_in_background`. There is no need to sleep in this case.\n" +
    "    - Do not retry failing commands in a sleep loop — diagnose the root cause or consider an alternative approach.\n" +
    "    - If waiting for a background task you started with `run_in_background`, you will be notified when it completes — do not poll.\n" +
    "    - If you must poll an external process, use a check command rather than sleeping first.\n" +
    "    - If you must sleep, keep the duration short to avoid blocking the user."
  );
}

/**
 * Full PowerShell tool prompt.
 * 2.1.183: N7a = async function() @cli_inner_pretty.js:442562-442665
 *   - `$1p()` (background note), `O1p()` (anti-sleep note), `await wOt()` (active edition) are spliced in.
 *   - `${J3t()}`/`${O4n()}` are max/default timeout (ms); `${Not()}` is the output-truncation char cap.
 *   - Tool name interpolations: `${_u}`=Glob, `${Uc}`=Grep, `${Ws}`=Read, `${Fa}`=Edit, `${Kc}`=Write,
 *     `${Xs}`=PowerShell.
 * Confirmed verbatim against assets/tools/PowerShell.md (## Prompt + branches 1/2/3).
 */
async function buildPowerShellPrompt(): Promise<string> {
  const backgroundNote = backgroundUsageNote(); // $1p()
  const gitSleepNote = antiSleepNote(); // O1p()
  const edition = await getActivePowerShellEdition(); // await wOt()
  // The full body is assembled as a single template literal in N7a (@442564-442665); the load-bearing,
  // user-visible portions are quoted verbatim below. Tool-name placeholders are interpolated.
  return [
    "Executes a given PowerShell command with optional timeout. Working directory persists between commands; shell state (variables, functions) does not.",
    "",
    "IMPORTANT: This tool is for terminal operations via PowerShell: git, npm, docker, and PS cmdlets. DO NOT use it for file operations (reading, writing, editing, searching, finding files) - use the specialized tools for this instead.",
    "",
    powershellEditionBlock(edition), // ${N1p(n)} @442568
    "",
    "Before executing the command, please follow these steps:",
    "",
    "1. Directory Verification:",
    "   - If the command will create new directories or files, first use `Get-ChildItem` (or `ls`) to verify the parent directory exists and is the correct location",
    "",
    "2. Command Execution:",
    "   - Always quote file paths that contain spaces with double quotes",
    "   - Capture the output of the command.",
    "",
    "PowerShell Syntax Notes:",
    "   - Variables use $ prefix: $myVar = \"value\"",
    "   - Escape character is backtick (`), not backslash",
    "   - Use Verb-Noun cmdlet naming: Get-ChildItem, Set-Location, New-Item, Remove-Item",
    "   - Common aliases: ls (Get-ChildItem), cd (Set-Location), cat (Get-Content), rm (Remove-Item)",
    "   - Pipe operator | works similarly to bash but passes objects, not text",
    "   - Use Select-Object, Where-Object, ForEach-Object for filtering and transformation",
    "   - String interpolation: \"Hello $name\" or \"Hello $($obj.Property)\"",
    "   - Registry access uses PSDrive prefixes: `HKLM:\\SOFTWARE\\...`, `HKCU:\\...` — NOT raw `HKEY_LOCAL_MACHINE\\...`",
    "   - Environment variables: read with `$env:NAME`, set with `$env:NAME = \"value\"` (NOT `Set-Variable` or bash `export`)",
    "   - Call native exe with spaces in path via call operator: `& \"C:\\Program Files\\App\\app.exe\" arg1 arg2`",
    "",
    "Unix commands that DO NOT exist in PowerShell — use the equivalent instead:",
    "   - head / tail → `Get-Content file -TotalCount N` / `-Tail N`; piped: `| Select-Object -First N` / `-Last N`",
    "   - which → `(Get-Command name).Source`",
    "   - touch → `if (-not (Test-Path path)) { New-Item -ItemType File path }` (NEVER use `New-Item -Force` on a file — it truncates existing content)",
    "   - wc -l → `(Get-Content file | Measure-Object -Line).Lines`",
    "   - mkdir -p → `New-Item -ItemType Directory -Force path` (`-p` is not a PowerShell flag)",
    "   - rm -rf → `Remove-Item -Recurse -Force path`",
    "   - ln -s → `New-Item -ItemType SymbolicLink -Path link -Target target`",
    "   - chmod / chown → not applicable on Windows; use `icacls` only if ACL changes are required",
    "   - 2>/dev/null → `2>$null` (but stderr is captured for you — usually unnecessary)",
    "   - VAR=x cmd → `$env:VAR = 'x'; cmd` (PowerShell has no inline env-var prefix)",
    "   - Bash control flow (`if [ -f x ]`, `for x in *`, backtick ``cmd`` substitution) is a parser error — use `if (Test-Path x)`, `foreach ($x in ...)`, `$(cmd)`",
    "",
    "Exit-code note: `-ErrorAction SilentlyContinue` suppresses error OUTPUT but the cmdlet failure still causes this tool to report exit 1. To make a cmdlet failure truly non-fatal, promote it to terminating and swallow it: `try { Cmdlet ... -ErrorAction Stop } catch {}` (without `-ErrorAction Stop`, non-terminating errors skip the `catch` and still exit 1).",
    "",
    "Interactive and blocking commands (will hang — this tool runs with -NonInteractive):",
    "   - NEVER use `Read-Host`, `Get-Credential`, `Out-GridView`, `$Host.UI.PromptForChoice`, or `pause`",
    "   - Destructive cmdlets (`Remove-Item`, `Stop-Process`, `Clear-Content`, etc.) may prompt for confirmation. Add `-Confirm:$false` when you intend the action to proceed. Use `-Force` for read-only/hidden items.",
    "   - Never use `git rebase -i`, `git add -i`, or other commands that open an interactive editor",
    "",
    "Passing multiline strings (commit messages, file content) to native executables:",
    "   - Use a single-quoted here-string so PowerShell does not expand `$` or backticks inside. The closing `'@` MUST be at column 0 (no leading whitespace) on its own line — indenting it is a parse error:",
    "<example>",
    "git commit -m @'",
    "Commit message here.",
    "Second line with $literal dollar signs.",
    "'@",
    "</example>",
    "   - Use `@'...'@` (single-quoted, literal) not `@\"...\"@` (double-quoted, interpolated) unless you need variable expansion",
    "   - For arguments containing `-`, `@`, or other characters PowerShell parses as operators, use the stop-parsing token: `git log --% --format=%H`",
    "",
    "Usage notes:",
    "  - The command argument is required.",
    // @442630 — `${J3t()}`/`${O4n()}` interpolated for ms + minutes; `${Not()}` for output char cap.
    `  - You can specify an optional timeout in milliseconds (up to ${getMaxTimeoutMs()}ms / ${getMaxTimeoutMs() / 60000} minutes). If not specified, commands will timeout after ${getDefaultTimeoutMs()}ms (${getDefaultTimeoutMs() / 60000} minutes).`,
    "  - It is very helpful if you write a clear, concise description of what this command does.",
    `  - If the output exceeds ${getOutputCharCap()} characters, output will be truncated before being returned to you.`,
    // @442634 — $1p() background note spliced in here (with trailing newline) when present.
    backgroundNote ? backgroundNote + "\n" : "",
    "  - Avoid using PowerShell to run commands that have dedicated tools, unless explicitly instructed:",
    "    - File search: Use Glob (NOT Get-ChildItem -Recurse)",
    "    - Content search: Use Grep (NOT Select-String)",
    "    - Read files: Use Read (NOT Get-Content)",
    "    - Edit files: Use Edit",
    "    - Write files: Use Write (NOT Set-Content/Out-File)",
    "    - Communication: Output text directly (NOT Write-Output/Write-Host)",
    "  - When issuing multiple commands:",
    "    - If the commands are independent and can run in parallel, make multiple PowerShell tool calls in a single message.",
    "    - If the commands depend on each other and must run sequentially, chain them in a single PowerShell call (see edition-specific chaining syntax above).",
    "    - Use `;` only when you need to run commands sequentially but don't care if earlier commands fail.",
    "    - DO NOT use newlines to separate commands (newlines are ok in quoted strings and here-strings)",
    "  - Do NOT prefix commands with `cd` or `Set-Location` -- the working directory is already set to the correct project directory automatically.",
    // @442652 — O1p() anti-sleep note spliced in here (with trailing newline) when present.
    gitSleepNote ? gitSleepNote + "\n" : "",
    "  - For git commands:",
    "    - Prefer to create a new commit rather than amending an existing commit.",
    "    - Before running destructive operations (e.g., git reset --hard, git push --force, git checkout --), consider whether there is a safer alternative that achieves the same goal. Only use destructive operations when they are truly the best approach.",
    "    - Never skip hooks (--no-verify) or bypass signing (--no-gpg-sign, -c commit.gpgsign=false) unless the user has explicitly asked for it. If a hook fails, investigate and fix the underlying issue.",
  ].join("\n");
}

// ───────────────────────────────────────────────────────────────────────────
// Gating / read-only classification
// ───────────────────────────────────────────────────────────────────────────

/**
 * Returns true if the command is unavailable by enterprise policy on native Windows.
 * 2.1.183: X7a @cli_inner_pretty.js:442808-442815
 *   true when: platform is Windows AND sandboxing is enabled in settings AND the platform is in the
 *   enabled list AND unsandboxed commands are NOT allowed — i.e. policy demands a sandbox we can't
 *   provide on native Windows.
 */
function isPowerShellBlockedByPolicy(): boolean {
  return (
    getPlatform() === "windows" &&
    sandbox.isSandboxEnabledInSettings() &&
    sandbox.isPlatformInEnabledList() &&
    !sandbox.areUnsandboxedCommandsAllowed()
  );
}

/**
 * Heuristic: does the command contain PowerShell constructs that make static read-only analysis unsafe?
 * 2.1.183: g7a @cli_inner_pretty.js:439748-439759 — returns true (→ "treat as mutating") on any of:
 *   `$(` subexpression, `@splat`, `.member(` invocation, `$var =`/`+=` assignment, `--%` stop-parse,
 *   `\\`/`//` (UNC / protocol), `::` static-member access.
 */
// helper: g7a @cli_inner_pretty.js:439748 — "command has mutating/dynamic syntax → not read-only"
function hasMutatingSyntax(command: string): boolean {
  const t = command.trim();
  if (!t) return false;
  if (/\$\(/.test(t)) return true; // subexpression
  if (/(?:^|[^\w.])@\w+/.test(t)) return true; // splatting
  if (/\.\w+\s*\(/.test(t)) return true; // member invocation
  if (/\$\w+\s*[+\-*/]?=/.test(t)) return true; // assignment
  if (/--%/.test(t)) return true; // stop-parsing token
  if (/\\\\/.test(t) || /(?<!:)\/\//.test(t)) return true; // UNC / protocol
  if (/::/.test(t)) return true; // static member access
  return false;
}

/**
 * Deep AST-level read-only check (every command in every pipeline is a known read-only cmdlet/exe).
 * 2.1.183: k4n @cli_inner_pretty.js:439760-439797
 *   - Rejects parsed ASTs with script blocks / sub-expressions / expandable strings / splatting /
 *     member invocations / assignments / stop-parsing.
 *   - Rejects pipelines whose redirections write to non-mergeable, non-/dev/null-class targets.
 *   - Requires every pipeline command to pass the per-command read-only predicate `HWe`.
 *   - Rejects multi-command pipelines that include a side-effecting command name (`Y3t`), and any
 *     nested commands.
 */
// helper: k4n @cli_inner_pretty.js:439760 — AST-level "all commands are read-only" predicate
function isReadOnlyByAst(command: string, parsed: ParsedPowerShell | undefined): boolean {
  // (see anchor; deep per-command predicate `HWe` @bundle, side-effecting name set `Y3t`)
  return commandSemantics.allCommandsReadOnly(command, parsed);
}

/**
 * isReadOnly(input): false if the command has mutating syntax (`g7a`); otherwise the AST check (`k4n`).
 * 2.1.183: isReadOnly @cli_inner_pretty.js:443131-443134
 */
function isReadOnly(input: PowerShellInput): boolean {
  if (hasMutatingSyntax(input.command)) return false;
  return isReadOnlyByAst(input.command, commandSemantics.parse(input.command));
}

/**
 * Classifies a command into search/read flags for the auto-classifier and UI.
 * 2.1.183: j1p @cli_inner_pretty.js:442763-442785
 *   Splits on `;`/`|`, ignores no-op output cmdlets (`U1p` = write-output/write-host), and requires
 *   every remaining first-token (canonicalised via `NA`) to be in the search set (`B1p`) or read set
 *   (`F1p`); any unknown command → {isSearch:false,isRead:false}.
 */
// helper: j1p @cli_inner_pretty.js:442763 — search/read command classifier
function classifySearchOrRead(command: string): { isSearch: boolean; isRead: boolean } {
  return commandSemantics.classifySearchOrRead(command);
}

// ───────────────────────────────────────────────────────────────────────────
// validateInput
// ───────────────────────────────────────────────────────────────────────────

/**
 * Blocks a standalone `Start-Sleep N` / `sleep N` (N ≥ threshold) at the head of the command.
 * 2.1.183: Q7a @cli_inner_pretty.js:442792-442807
 *   - First sub-command (split on `[;|&\r\n]`) is matched against
 *     `/^(?:start-sleep|sleep)(?:\s+-s(?:econds)?)?\s+(\d+(?:\.\d*)?)\s*$/i`.
 *   - Blocks only when the seconds value ≥ `FUn` (the sleep threshold).
 *   - Returns `"Start-Sleep N followed by: <rest>"` or `"standalone Start-Sleep N"`; null = allowed.
 */
// helper: Q7a @cli_inner_pretty.js:442792 — PowerShell sleep-guard detector
function detectBlockedSleep(command: string): string | null {
  const head = command.trim().split(/[;|&\r\n]/)[0]?.trim() ?? "";
  const m = /^(?:start-sleep|sleep)(?:\s+-s(?:econds)?)?\s+(\d+(?:\.\d*)?)\s*$/i.exec(head);
  if (!m) return null;
  const seconds = parseFloat(m[1]);
  if (seconds < SLEEP_BLOCK_THRESHOLD_SECONDS) return null; // < FUn → allowed
  const rest = command.trim().slice(head.length).replace(/^[\s;|&]+/, "");
  return rest ? `Start-Sleep ${seconds} followed by: ${rest}` : `standalone Start-Sleep ${seconds}`;
}

/**
 * validateInput.
 * 2.1.183: validateInput @cli_inner_pretty.js:443180-443192
 *   1. Enterprise-policy block (errorCode 11): if `X7a()`, return the verbatim `Y7a` message.
 *   2. Sleep guard (errorCode 10): when sandboxing is active (`nG()`), the OS supports it (`Su()`),
 *      background tasks aren't disabled (`!Ddt`), and this isn't a backgrounded call, run `Q7a` on the
 *      command; on a hit return the "Blocked: …" message (Monitor-runs-bash variant).
 */
// 2.1.183: validateInput = Mdo.validateInput @cli_inner_pretty.js:443180
async function validateInput(input: PowerShellInput): Promise<ValidationResult> {
  // @443181 — enterprise policy block
  if (isPowerShellBlockedByPolicy()) {
    return { result: false, message: ENTERPRISE_POLICY_BLOCKED_MESSAGE, errorCode: 11 };
  }

  // @443182 — sleep guard (sandbox active, OS-supported, not background-disabled, not run_in_background)
  if (isSandboxingActive() && isSandboxSupported() && !BACKGROUND_TASKS_DISABLED && !input.run_in_background) {
    const blocked = detectBlockedSleep(input.command); // Q7a
    if (blocked !== null) {
      return {
        result: false,
        // @443187 — verbatim (note: "Monitor runs bash" — the PowerShell variant of the Bash message)
        message: `Blocked: ${blocked}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\` — Monitor runs bash). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
        errorCode: 10,
      };
    }
  }

  return { result: true };
}

// ───────────────────────────────────────────────────────────────────────────
// checkPermissions
// ───────────────────────────────────────────────────────────────────────────

/**
 * PowerShell permission resolver.
 * 2.1.183: $7a @cli_inner_pretty.js:442124-442290+ (delegated to from Mdo.checkPermissions @443193).
 *
 * Decision pipeline (source-anchored summary):
 *   1. Empty command → allow ({type:"other", reason:"Empty command is safe"}).
 *   2. Parse the command (`hxe`); run the mode/safety pre-check (`R7a`). A "deny" there short-circuits.
 *   3. Rule lookup (`wWe(..., "prefix")`): any matching DENY rule →
 *        deny, message `Permission to use ${Xs} with command ${command} has been denied.`
 *      A matching ASK rule → a pending `ask` ({behavior:"ask", message: Yp(Xs), rule}).
 *   4. UNC-path heuristic (`qk`): `ask` with "Command contains a UNC path that could trigger network requests".
 *   5. If the mode pre-check already allowed, the parse is invalid, no ask is pending, and the head
 *      token is not an "application" → return the allow.
 *   6. Malformed-parse path: tokenize the de-commented command, scan each sub-command; matching deny
 *      rules → deny; a `remove-item` with a real target → `TWe(target)` (destructive-ask); otherwise a
 *      pending ask, else fall back to ask with "Command contains malformed syntax that cannot be
 *      parsed: <error>".
 *   7. Valid-parse path: collect asks from the auto-classifier (`R1p`), the command-class check (`x7a`),
 *      and the `using` / `#Requires` directives (each adds an `ask` with module-loading reasons), then
 *      reduce all collected asks/allows into a single decision.
 *
 * Net behavior: deny on a matched deny-rule or hard policy block; ask on matched ask-rule, UNC path,
 * malformed/complex syntax, destructive cmdlet, or external-code directives; otherwise allow.
 */
// helper: $7a @cli_inner_pretty.js:442124 — full PowerShell permission decision
// helper: R7a @bundle — mode/safety pre-check;  wWe @bundle — prefix rule lookup
// helper: x7a @bundle — command-class ask check;  TWe @bundle — destructive-cmdlet ask result
async function checkPermissions(
  input: PowerShellInput,
  context: ToolUseContext,
): Promise<PermissionResult> {
  return resolvePowerShellPermissions(input, context); // $7a
}

/**
 * preparePermissionMatcher — builds command-prefix matchers from the parsed command.
 * 2.1.183: preparePermissionMatcher @cli_inner_pretty.js:443138-443157
 *   Parses via `hxe`; on parse failure returns a match-everything matcher. Otherwise builds, for each
 *   parsed command, the joined `name args` prefix (and its canonicalised-name variant via `NA`), and
 *   matches an incoming rule by exact/prefix equality (case-insensitive), falling back to glob `t8`.
 */
// helper: preparePermissionMatcher @cli_inner_pretty.js:443138 — prefix matcher builder (hxe/BL/NA/VMt/t8)

// ───────────────────────────────────────────────────────────────────────────
// Tool object
// ───────────────────────────────────────────────────────────────────────────

/**
 * The PowerShell tool.
 * 2.1.183: Mdo = pi({...}) @cli_inner_pretty.js:443112-443398
 *   Header: ruleContentField:"command", searchHint:"execute Windows PowerShell commands",
 *           maxResultSizeChars:30000, strict:true.
 *   isEnabled() is explicitly `true` @443177; isConcurrencySafe() mirrors isReadOnly() @443124-443126.
 *
 * `call` (summarized) @443244+ — spawns the PowerShell process via the shared exec runner (`Y1p`
 *   generator), streams progress, classifies git/gh operations for `gitOperation`, persists oversized
 *   output to a file (`persistedOutputPath`/`persistedOutputSize`), and honours background-task launch
 *   when `run_in_background` is set. Auto-classifier input is the raw command name (`Q3t`, allowlist `K1p`).
 */
// 2.1.183: PowerShellTool = Mdo @cli_inner_pretty.js:443112
export const PowerShellTool: Tool<typeof baseInputSchema, typeof outputSchema> = {
  name: POWERSHELL_TOOL_NAME, // Xs
  ruleContentField: "command",
  searchHint: "execute Windows PowerShell commands",
  maxResultSizeChars: 30000,
  strict: true,

  async description({ description }: PowerShellInput): Promise<string> {
    // @443118 — user-supplied description wins; default "Run PowerShell command".
    return description || "Run PowerShell command";
  },

  async prompt(): Promise<string> {
    return buildPowerShellPrompt(); // N7a
  },

  // @443124 — concurrency-safe iff read-only
  isConcurrencySafe(input: PowerShellInput): boolean {
    return this.isReadOnly?.(input) ?? false;
  },

  isSearchOrReadCommand(input: PowerShellInput): { isSearch: boolean; isRead: boolean } {
    if (!input?.command) return { isSearch: false, isRead: false };
    return classifySearchOrRead(input.command); // j1p
  },

  isReadOnly,

  toAutoClassifierInput(input: PowerShellInput): string {
    return input.command;
  },

  get inputSchema() {
    return getInputSchema(); // V1p
  },
  get outputSchema() {
    return outputSchema; // z1p
  },

  userFacingName(): string {
    return "PowerShell";
  },

  // @443177 — explicitly enabled on this tool.
  isEnabled(): boolean {
    return true;
  },

  validateInput,
  checkPermissions,

  // call: see summary above — Mdo.call @cli_inner_pretty.js:443244+ (exec runner `Y1p`).
  async *call() {
    /* summarized — see anchor block above */
  },
};

// ───────────────────────────────────────────────────────────────────────────
// Externally-provided helpers (defined elsewhere in the bundle)
// ───────────────────────────────────────────────────────────────────────────

// helper: J3t @bundle — max timeout (ms);  O4n @bundle — default timeout (ms);  Not @bundle — output char cap
declare function getMaxTimeoutMs(): number;
declare function getDefaultTimeoutMs(): number;
declare function getOutputCharCap(): number;
// helper: wOt @bundle — resolve active PowerShell edition ("desktop"|"core"|unknown)
declare function getActivePowerShellEdition(): Promise<"desktop" | "core" | string>;
// helper: Kt @bundle — current platform; FUn @bundle — sleep-block threshold (seconds)
declare function getPlatform(): string;
declare const SLEEP_BLOCK_THRESHOLD_SECONDS: number;
// helper: nG @bundle — sandboxing active?;  Su @bundle — OS supports sandbox?
declare function isSandboxingActive(): boolean;
declare function isSandboxSupported(): boolean;
// helper: PLn @bundle — git-operation classification schema
declare function gitOperationSchema(): z.ZodTypeAny;
// helper: zo @bundle — sandbox settings facade
declare const sandbox: {
  isSandboxEnabledInSettings(): boolean;
  isPlatformInEnabledList(): boolean;
  areUnsandboxedCommandsAllowed(): boolean;
};
// helper: commandSemantics — PowerShell parse + read-only/search classification (BG/j0n/HWe/Y3t/B1p/F1p/U1p)
type ParsedPowerShell = unknown;
declare const commandSemantics: {
  parse(command: string): ParsedPowerShell | undefined;
  allCommandsReadOnly(command: string, parsed: ParsedPowerShell | undefined): boolean;
  classifySearchOrRead(command: string): { isSearch: boolean; isRead: boolean };
};
// helper: $7a @cli_inner_pretty.js:442124 — see checkPermissions anchor
declare function resolvePowerShellPermissions(
  input: PowerShellInput,
  context: ToolUseContext,
): Promise<PermissionResult>;
