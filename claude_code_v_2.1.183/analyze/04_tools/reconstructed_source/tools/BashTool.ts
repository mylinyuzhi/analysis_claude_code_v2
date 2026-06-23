/**
 * BashTool — execute a shell command (with sandbox decision, sleep guard,
 * destructive-command tagging, sed-edit interception, read-only classification).
 *
 * READABLE-SOURCE RECONSTRUCTION for Claude Code v2.1.183.
 *
 * 2.1.183 regions covered (all line numbers @ extract/cli_inner_pretty.js, 699,346 lines):
 *   - name const            ns="Bash"                         @145275
 *   - prompt builder         uJa                              @450077-…   (multi-branch)
 *   - input schema           mJa (base) @450554, AJa (wrap) @450579
 *   - allowlisted names      FFp                              @450582
 *   - output schema          UFp                              @450606
 *   - lint/format regex      qFp                              @450646
 *   - tool object            Cl = pi({...})                   @450669-…
 *   - sleep detector         GFp                              @450238
 *   - simulated-sed apply    WFp                              @450249
 *   - read-only decision     wLn                              @296432
 *   - cwd-mutation detect    V3t @452530 / xxe @452526
 *   - exact rule lookup      gGn                              @452546
 *   - full perm decision     Yjt                              @452209
 *   - sandbox predicate      WR                               @585257
 *   - excluded-command excl  Rbf                              @585215
 *   - destructive table      E9d @297648 / Vaa @297636 / KOt @297643
 *   - shared bash prompt     (asset assets/tools/Bash.md — description="Run shell command")
 *
 * 2.1.88 convention mirror: src/tools/BashTool/{BashTool.tsx, shouldUseSandbox.ts,
 *   sedEditParser.ts, destructiveCommandWarning.ts, commandSemantics.ts, prompt.ts}
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md (tool registry spine)
 * Anchor dossier: 04_tools/reconstructed_source/_anchors_tools_file_exec.md §7
 *
 * Cross-validation note: re-read the Bash tool object (@450669-451009), schema (@450554-450605),
 * checkPermissions/sandbox-override (@450754-450770), WR predicate (@585257-585264), GFp sleep
 * detector (@450238-450248), destructive table E9d (@297648-…), wLn read-only decision (@296432-…),
 * and Yjt permission decision (@452209-…) directly in the 2.1.183 bundle. The Bash.md asset
 * description ("Run shell command") matches the inline `description()` at @450676; the rich
 * guidance lives in the `prompt()` builder uJa (quoted below, branch by branch).
 *
 * Deep sub-helpers (AST parse iPt/dPt, classifier PCn, spawn pipeline zFp, render helpers) are
 * SUMMARIZED with `// helper: <obf> @line`. Load-bearing cores reconstructed: the sandbox
 * decision (WR), destructive/sed guards, and read-only validation (wLn).
 *
 * NO symbol-mapping tables here (per _conventions.md) — inline anchors only.
 */

import { z } from 'zod'

// ============================================================================
// Identity
// ============================================================================

// 2.1.183: BASH_TOOL_NAME = ns @cli_inner_pretty.js:145275
export const BASH_TOOL_NAME = 'Bash'

// ============================================================================
// Input schema
// ============================================================================

// 2.1.183: bashInputSchemaBase = mJa @cli_inner_pretty.js:450554-450577
// Lazy `we(() => …)` thunk; `H` is the Zod-v4 namespace, `GB`/`n0` wrap optional fields.
const bashInputSchemaBase = z.strictObject({
  // @450556
  command: z.string().describe('The command to execute'),
  // @450557 — `qdt()` is the runtime max-timeout (ms) value
  timeout: z
    .number()
    .optional()
    .describe('Optional timeout in milliseconds (max ${MAX_TIMEOUT_MS})'),
  // @450558-450569 — verbatim describe string (the model is told how to phrase descriptions)
  description: z
    .string()
    .optional()
    .describe(
      'Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.\n' +
        '\n' +
        'For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):\n' +
        '- ls → "List files in current directory"\n' +
        '- git status → "Show working tree status"\n' +
        '- npm install → "Install package dependencies"\n' +
        '\n' +
        'For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:\n' +
        '- find . -name "*.tmp" -exec rm {} \\; → "Find and delete all .tmp files recursively"\n' +
        '- git reset --hard origin/main → "Discard all local changes and match remote main"\n' +
        "- curl -s url | jq '.data[]' → \"Fetch JSON from URL and extract data array elements\"",
    ),
  // @450570
  run_in_background: z
    .boolean()
    .optional()
    .describe('Set to true to run this command in the background.'),
  // @450571-450573
  dangerouslyDisableSandbox: z
    .boolean()
    .optional()
    .describe(
      'Set this to true to dangerously override sandbox mode and run commands without sandboxing.',
    ),
  // @450574-450576 — internal only: a pre-computed sed-edit result routed from the file-edit preview
  _simulatedSedEdit: z
    .object({ filePath: z.string(), newContent: z.string() })
    .optional()
    .describe('Internal: pre-computed sed edit result from preview'),
})

/**
 * The MODEL-FACING schema. `_simulatedSedEdit` is always stripped (it is host-internal);
 * `run_in_background` is additionally stripped when background execution is unavailable (`p4t`).
 *
 * 2.1.183: bashInputSchema = AJa @cli_inner_pretty.js:450579-450580
 */
const bashInputSchema = isBackgroundUnavailable() // p4t @450580
  ? bashInputSchemaBase.omit({ run_in_background: true, _simulatedSedEdit: true })
  : bashInputSchemaBase.omit({ _simulatedSedEdit: true })

export type BashInput = z.infer<typeof bashInputSchemaBase>

// 2.1.183: BACKGROUND_ALLOWLIST_COMMAND_NAMES = FFp @cli_inner_pretty.js:450582-450605
// Command base-names that get a background-run nudge in the UI (not a security list).
const BACKGROUND_ALLOWLIST_COMMAND_NAMES = [
  'npm', 'yarn', 'pnpm', 'node', 'python', 'python3', 'go', 'cargo', 'make',
  'docker', 'terraform', 'webpack', 'vite', 'jest', 'pytest', 'curl', 'wget',
  'build', 'test', 'serve', 'watch', 'dev',
]

// 2.1.183: bashOutputSchema = UFp @cli_inner_pretty.js:450606-450645
// stdout/stderr + interrupted, plus optional flags surfaced to the model and to clients.
const bashOutputSchema = z.object({
  stdout: z.string().describe('The standard output of the command'),
  stderr: z.string().describe('The standard error output of the command'),
  rawOutputPath: z.string().optional().describe('Path to raw output file for large MCP tool outputs'),
  interrupted: z.boolean().describe('Whether the command was interrupted'),
  isImage: z.boolean().optional().describe('Flag to indicate if stdout contains image data'),
  backgroundTaskId: z.string().optional().describe('ID of the background task if command is running in background'),
  backgroundedByUser: z.boolean().optional()
    .describe('True if the user manually backgrounded the command with Ctrl+B'),
  dangerouslyDisableSandbox: z.boolean().optional().describe('Flag to indicate if sandbox mode was overridden'),
  returnCodeInterpretation: z.string().optional()
    .describe('Semantic interpretation for non-error exit codes with special meaning'),
  noOutputExpected: z.boolean().optional()
    .describe('Whether the command is expected to produce no output on success'),
  structuredContent: z.array(z.any()).optional().describe('Structured content blocks'),
  persistedOutputPath: z.string().optional()
    .describe('Path to the persisted full output in tool-results dir (set when output is too large for inline)'),
  persistedOutputSize: z.number().optional()
    .describe('Total size of the output in bytes (set when output is too large for inline)'),
  // @450631-450635 — note that bumps when WRITE_COMMAND_MARKERS matches a read file's mtime
  staleReadFileStateHint: z.string().optional()
    .describe('Model-facing note listing readFileState entries whose mtime bumped during this command (set when WRITE_COMMAND_MARKERS matches)'),
  ghRateLimitHint: z.string().optional()
    .describe('Model-facing system-reminder appended when a gh command reports a GitHub API rate-limit error'),
  // @450639-450643 — client-facing git/gh classification, NOT shown to the model
  gitOperation: z.any().optional()
    .describe('@internal Structured classification of git/gh operations detected in this command (commit/push/merge/rebase/PR). Client-facing — lets clients render git activity without re-parsing stdout; not surfaced to the model.'),
})

// 2.1.183: LINT_FORMAT_WRITE_REGEX = qFp @cli_inner_pretty.js:450646-450668
// Used to detect formatter/linter commands that may rewrite files (affects staleReadFileStateHint).
const LINT_FORMAT_WRITE_REGEX = new RegExp(
  [
    '--write', '--fix', '--in-place', '--auto-correct',
    '\\brun\\s+format\\b', '\\brun\\s+fix\\b', '\\b(yarn|pnpm)\\s+format\\b',
    '\\blint:file\\b', '\\blint:fix\\b', '\\bblack\\b', '\\bisort\\b',
    '\\bruff\\s+format\\b', '\\bcargo\\s+(fmt|fix)\\b', '\\brustfmt\\b',
    '\\bgo\\s+fmt\\b', '\\bterraform\\s+fmt\\b', '\\bdprint\\s+fmt\\b',
    '\\bswiftformat\\b', '\\bphpcbf\\b',
  ].join('|'),
)

// ============================================================================
// Sleep guard (validateInput) — GFp
// ============================================================================

const SLEEP_BLOCK_THRESHOLD_SECONDS = 0 // FUn — the leading-sleep block threshold (runtime const)

/**
 * Detects a *leading* `sleep N` command whose duration is at/above the block threshold,
 * so the model can't burn the user's time with a blocking pre-sleep when sandboxing is on.
 *
 * Tokenizes the command line (`Zh`), inspects only the FIRST sub-command. Returns a short
 * human description of what was blocked, or null if the first command is not a long-enough
 * standalone `sleep`. The actual block message is composed in validateInput (below).
 *
 * 2.1.183: detectLeadingSleep = GFp @cli_inner_pretty.js:450238-450248
 */
function detectLeadingSleep(command: string): string | null {
  const segments = splitIntoSubcommands(command) // Zh @450239
  if (segments.length === 0) return null

  const first = segments[0]?.trim() ?? ''
  // @450242 — only a *bare* `sleep <number>` (no flags/redirs) qualifies
  const m = /^sleep\s+(\d+(?:\.\d*)?)\s*$/.exec(first)
  if (!m) return null

  const seconds = parseFloat(m[1]!)
  if (seconds < SLEEP_BLOCK_THRESHOLD_SECONDS) return null // @450245

  const rest = segments.slice(1).join(' ').trim()
  return rest ? `sleep ${seconds} followed by: ${rest}` : `standalone sleep ${seconds}` // @450247
}

// ============================================================================
// Read-only classification — wLn / V3t / xxe
// ============================================================================

/**
 * Is the first token of a single sub-command a cwd-changing builtin?
 * 2.1.183: changesCwd = xxe @cli_inner_pretty.js:452526-452529
 */
function changesCwd(command: string): boolean {
  const head = tokenize(stripWrappers(command))[0] // lE(jG(e))[0]
  return head === 'cd' || head === 'pushd' || head === 'popd' || head === 'chdir'
}

/**
 * Does ANY sub-command in the (possibly compound) command change the working directory?
 * Passed into the read-only decision so compound `cd … && git …` is treated specially.
 *
 * 2.1.183: commandChangesCwd = V3t @cli_inner_pretty.js:452530-452532
 */
function commandChangesCwd(command: string): boolean {
  return splitIntoSubcommands(command).some((c) => changesCwd(c.trim()))
}

type ReadOnlyDecision =
  | { behavior: 'allow'; updatedInput?: BashInput; decisionReason?: unknown }
  | { behavior: 'ask'; message: string }
  | { behavior: 'passthrough'; message: string }

/**
 * Decide whether a command is *read-only* (no side effects, safe to run concurrently /
 * auto-approve). This is the engine behind `isReadOnly`/`isConcurrencySafe`: a command is
 * read-only iff this returns `behavior: "allow"`.
 *
 * Reconstructed core (the first, load-bearing branches @296432-296461 — later branches
 * classify each parsed sub-command against a read-only command table and are summarized):
 *
 * 2.1.183: classifyReadOnly = wLn @cli_inner_pretty.js:296432-…
 */
function classifyReadOnly(input: BashInput, changesCwdHint: boolean): ReadOnlyDecision {
  const { command } = input
  const ast = parseShellAst(command) // TB().parse(n) @296434
  const parsed = ast
    ? analyzeSubcommands(command, ast) // dPt @296435
    : { kind: 'simple' as const, commands: [], bareAssignmentNames: [] }

  // @296436 — gave up parsing → cannot prove read-only
  if (parsed.kind === 'too-complex')
    return { behavior: 'passthrough', message: `Not a simple read-only command: ${parsed.reason}` }

  // @296438 — a subshell can hide side effects from this analysis
  if (ast && containsSubshell(ast)) // Waa
    return { behavior: 'passthrough', message: 'Not a simple read-only command: contains a subshell' }

  // @296439-296443 — `&` (background) defers execution past approval-time checks
  if (ast && containsBackgroundAmp(ast)) // qaa
    return {
      behavior: 'passthrough',
      message: 'Not a simple read-only command: `&` defers execution past approval-time checks',
    }

  // @296444-296449 — a bare `FOO=bar` to a non-allowlisted env var can change later commands' behavior
  const allowlistedEnv = allowlistedEnvVarSet() // UMt()
  if (
    parsed.bareAssignmentNames.some(
      (name) => !isHarmlessEnvVar(name) && (allowlistedEnv === null || allowlistedEnv.has(name)),
    )
  )
    return {
      behavior: 'passthrough',
      message:
        'Bare assignment to a non-allowlisted environment variable can alter behavior of subsequent commands',
    }

  // @296450-296451 — unquoted `$VAR` expansion could expand to anything
  const expansionKind = classifyExpansion(command) // bXr(n)
  if (expansionKind === 'variable')
    return { behavior: 'passthrough', message: 'Command contains unquoted variable expansion' }

  // @296452-296453 — Windows UNC path (WebDAV) → ask, never silently allow
  if (containsUncPath(command)) // qk
    return {
      behavior: 'ask',
      message: 'Command contains Windows UNC path that could be vulnerable to WebDAV attacks',
    }

  // @296454-296459 — `cd … && git …` style compounds must go through permission checks
  const hasGit = parsed.commands.some((c) => isGitCommand(c.text)) // zOt
  if ((changesCwdHint || parsed.commands.some((c) => changesCwd(c.text))) && hasGit)
    return {
      behavior: 'passthrough',
      message: 'Compound commands with cd and git require permission checks for enhanced security',
    }

  // …remaining branches (@296460-…) classify each sub-command against the read-only command
  // table; if every sub-command is recognized as read-only, returns { behavior: "allow", … }.
  // helper: (tail of wLn) @296460-… — per-command read-only table match
  return classifyReadOnlyTail(input, parsed, hasGit)
}

// ============================================================================
// Destructive-command tagging — Vaa / KOt / E9d
// ============================================================================

type DestructivePattern = { pattern: RegExp; category: string; warning: string }

/**
 * Destructive-command pattern table. Purely informational: drives the permission-dialog
 * warning string and the `destructive_category` telemetry tag — it does NOT gate execution.
 *
 * 2.1.183: DESTRUCTIVE_PATTERNS = E9d @cli_inner_pretty.js:297648-… (verbatim regexes + warnings)
 */
const DESTRUCTIVE_PATTERNS: DestructivePattern[] = [
  // @297650-297653
  { pattern: /\bgit\s+reset\s+--hard\b/, category: 'git_reset_hard', warning: 'Note: may discard uncommitted changes' },
  // @297655-297657
  { pattern: /\bgit\s+push\b[^;&|\n]*[ \t](--force|--force-with-lease|-f)\b/, category: 'git_force_push', warning: 'Note: may overwrite remote history' },
  // @297660-297662
  { pattern: /\bgit\s+clean\b(?![^;&|\n]*(?:-[a-zA-Z]*n|--dry-run))[^;&|\n]*-[a-zA-Z]*f/, category: 'git_clean_force', warning: 'Note: may permanently delete untracked files' },
  // @297665-297667
  { pattern: /\bgit\s+checkout\s+(--\s+)?\.[ \t]*($|[;&|\n])/, category: 'git_checkout_dot', warning: 'Note: may discard all working tree changes' },
  // @297670-297672
  { pattern: /\bgit\s+restore\s+(--\s+)?\.[ \t]*($|[;&|\n])/, category: 'git_restore_dot', warning: 'Note: may discard all working tree changes' },
  // @297675-297677
  { pattern: /\bgit\s+stash[ \t]+(drop|clear)\b/, category: 'git_stash_drop', warning: 'Note: may permanently remove stashed changes' },
  // @297680-297682
  { pattern: /\bgit\s+branch\s+(-D[ \t]|--delete\s+--force|--force\s+--delete)\b/, category: 'git_branch_force_delete', warning: 'Note: may force-delete a branch' },
  // @297685-297687
  { pattern: /\bgit\s+(commit|push|merge)\b[^;&|\n]*--no-verify\b/, category: 'git_no_verify', warning: 'Note: may skip safety hooks' },
  // …continues past @297688 with commit --amend, rm -rf, DROP/TRUNCATE/DELETE, kubectl delete,
  //   terraform destroy (mirrors 2.1.88 src/tools/BashTool/destructiveCommandWarning.ts).
]

/** 2.1.183: matchDestructivePattern = Vaa @cli_inner_pretty.js:297636-297639 */
function matchDestructivePattern(command: string): DestructivePattern | null {
  for (const entry of DESTRUCTIVE_PATTERNS) if (entry.pattern.test(command)) return entry
  return null
}

/** 2.1.183: getDestructiveWarning = zaa @cli_inner_pretty.js:297640-297642 */
export function getDestructiveWarning(command: string): string | null {
  return matchDestructivePattern(command)?.warning ?? null
}

/** 2.1.183: getDestructiveCategory = KOt @cli_inner_pretty.js:297643-297645 (telemetry tag) */
export function getDestructiveCategory(command: string): string | null {
  return matchDestructivePattern(command)?.category ?? null
}

// ============================================================================
// Sandbox decision — WR / Rbf
// ============================================================================

/**
 * Core sandbox predicate: should this Bash invocation run inside the sandbox?
 *
 * Order of checks (short-circuit):
 *   1. Forced sandbox (enterprise/policy): if forcing is on (`hx()`) and applicable (`Xse()`),
 *      always sandbox — even an explicit override cannot escape it. @585258
 *   2. If sandboxing isn't enabled at all → don't sandbox. @585259
 *   3. If the model passed `dangerouslyDisableSandbox` AND policy allows unsandboxed commands
 *      → don't sandbox (the override is honored). @585260
 *   4. No command → nothing to sandbox. @585261
 *   5. User-configured `sandbox.excludedCommands` match → don't sandbox (convenience, NOT a
 *      security boundary — see Rbf). @585262
 *   6. Otherwise → sandbox. @585263
 *
 * 2.1.183: shouldUseSandbox = WR @cli_inner_pretty.js:585257-585264
 * 2.1.88 mirror: src/tools/BashTool/shouldUseSandbox.ts shouldUseSandbox
 */
export function shouldUseSandbox(input: Partial<BashInput>): boolean {
  if (isSandboxForced() && isSandboxForceApplicable()) return true // hx() && Xse() @585258
  if (!SandboxManager.isSandboxingEnabled()) return false // @585259
  if (input.dangerouslyDisableSandbox && SandboxManager.areUnsandboxedCommandsAllowed())
    return false // @585260
  if (!input.command) return false // @585261
  if (containsExcludedCommand(input.command)) return false // Rbf @585262
  return true // @585263
}

/**
 * Does the command match a user-configured `sandbox.excludedCommands` pattern?
 * NOT a security boundary — it's a convenience opt-out; the permission prompt is the real
 * control. Splits compound commands and, for each sub-command, iteratively strips leading
 * env-var assignments (`xAo` with the binary-hijack var set Mbf) and safe wrappers (`jG`)
 * to a fixed point, then matches each candidate against each prefix/exact/wildcard rule.
 *
 * 2.1.183: containsExcludedCommand = Rbf @cli_inner_pretty.js:585215-585256
 * 2.1.88 mirror: src/tools/BashTool/shouldUseSandbox.ts containsExcludedCommand
 */
function containsExcludedCommand(command: string): boolean {
  const excluded = getSettings().sandbox?.excludedCommands ?? [] // ts() @585216
  if (excluded.length === 0) return false

  let subcommands: string[]
  try {
    subcommands = splitIntoSubcommands(command) // Zh @585220
  } catch {
    subcommands = [command]
  }

  for (const sub of subcommands) {
    // Fixed-point candidate expansion: strip env vars / wrappers until no new candidate. @585225-585238
    const candidates = [sub.trim()]
    const seen = new Set(candidates)
    let start = 0
    while (start < candidates.length) {
      const end = candidates.length
      for (let i = start; i < end; i++) {
        const cand = candidates[i]!
        const envStripped = stripLeadingEnvVars(cand, BINARY_HIJACK_VARS) // xAo(d, Mbf)
        if (!seen.has(envStripped)) (candidates.push(envStripped), seen.add(envStripped))
        const wrapperStripped = stripWrappers(cand) // jG(d)
        if (!seen.has(wrapperStripped)) (candidates.push(wrapperStripped), seen.add(wrapperStripped))
      }
      start = end
    }

    for (const pattern of excluded) {
      const rule = parseBashRule(pattern) // IAo(c) @585240
      for (const cand of candidates)
        switch (rule.type) {
          case 'prefix':
            if (cand === rule.prefix || cand.startsWith(rule.prefix + ' ')) return true
            break
          case 'exact':
            if (cand === rule.command) return true
            break
          case 'wildcard':
            if (matchWildcard(rule.pattern, cand)) return true // $We @585250
            break
        }
    }
  }
  return false
}

// ============================================================================
// Full permission decision (checkPermissions backend) — Yjt / gGn
// ============================================================================

/**
 * Exact rule lookup over the bash permission rules (deny/ask/allow). Used as the first
 * concrete decision after the command parses cleanly.
 *
 * 2.1.183: lookupExactBashRule = gGn @cli_inner_pretty.js:452546-452559
 */
function lookupExactBashRule(input: BashInput, ctx: PermissionContext): PermissionDecision {
  const command = input.command.trim()
  const { matchingDenyRules, matchingAskRules, matchingAllowRules } = matchBashRules(input, ctx, 'exact') // vLe
  if (matchingDenyRules[0] !== undefined)
    return {
      behavior: 'deny',
      // @452552
      message: `Permission to use ${BASH_TOOL_NAME} with command ${command} has been denied.`,
      decisionReason: { type: 'rule', rule: matchingDenyRules[0] },
    }
  if (matchingAskRules[0] !== undefined)
    return { behavior: 'ask', message: askMessage(BASH_TOOL_NAME), decisionReason: { type: 'rule', rule: matchingAskRules[0] } }
  if (matchingAllowRules[0] !== undefined)
    return { behavior: 'allow', updatedInput: input, decisionReason: { type: 'rule', rule: matchingAllowRules[0] } }
  // No rule matched → defer to the higher-level passthrough handling, with command-prefix suggestions.
  const reason = { type: 'other', reason: 'This command requires approval', bashMissKind: 'no-rule-match' } as const
  return { behavior: 'passthrough', message: askMessage(BASH_TOOL_NAME, reason), decisionReason: reason, suggestions: suggestPrefixes(command) }
}

/**
 * Full permission resolution for a Bash command. Summarized core (reconstructed key branches
 * @452209-452280; the rest delegates to rule/classifier helpers):
 *
 *   1. Parse the command AST (`iPt` async + `dPt`). @452212
 *   2. If parsing is `too-complex` → try the too-complex recovery handlers, else emit
 *      `tengu_bash_ast_too_complex` and `ask`. @452214-452223
 *   3. Validate sub-command semantics (`gOi`); on failure (e.g. `newline-hash`) → `ask`. @452226-452235
 *   4. Exact-rule lookup `gGn`; a deny short-circuits immediately. @452241-452242
 *   5. CLASSIFIER SAFETY CHECK (only when `cIe()` is on and mode !== "auto"): runs the deny
 *      classifier `PCn` against high-confidence deny-rules and ask-rules @452243-… :
 *        - high-confidence deny match → `behavior: "deny"`, message `${PERMISSION_DENIED}: "<desc>"`. @452256-452265
 *        - high-confidence ask match → `behavior: "ask"`. @452266-…
 *
 * 2.1.183: resolveBashPermission = Yjt @cli_inner_pretty.js:452209-…
 * helper: iPt/dPt (AST parse) — bash command parsing
 * helper: PCn @… — async deny/ask command classifier
 */
declare function resolveBashPermission(
  input: BashInput,
  ctx: ToolUseContext,
): Promise<PermissionDecision>

// ============================================================================
// sed-edit interception — kGe (parser) / WFp (apply)
// ============================================================================

/**
 * Recognize a single in-place `sed -i 's/pat/rep/flags' file` command and extract
 * `{ filePath, pattern, replacement, flags, extendedRegex }`, so it can be routed through
 * the file-edit/permission path (and rendered as an Edit) instead of executed as a shell
 * command. Returns null for anything it can't safely model: multiple expressions, multiple
 * files, glob args, non-`s/` scripts, unknown flags, remote paths, etc.
 *
 * helper: kGe @cli_inner_pretty.js:389533-… — sed in-place edit parser
 * 2.1.88 mirror: src/tools/BashTool/sedEditParser.ts parseSedEditCommand/isSedInPlaceEdit
 *
 * The Bash `call` checks `_simulatedSedEdit` first (@450829) and applies the precomputed edit
 * via `applySimulatedSedEdit` (WFp @450249-…); `userFacingName` re-labels such a Bash call as
 * an Edit (@450727-450728).
 */
declare function parseSedEditCommand(command: string): {
  filePath: string
  pattern: string
  replacement: string
  flags: string
  extendedRegex: boolean
} | null

// ============================================================================
// prompt() builder — uJa
// ============================================================================

/**
 * Build the Bash tool prompt. Two top-level shapes:
 *   - COMPACT mode (`Dg(e)`): a slim variant `kFp(t)`. @450078
 *   - FULL mode: a long ordered guidance block (reconstructed verbatim quotes below).
 *
 * The full block is gated on several runtime predicates:
 *   - `Qw()` (search-tools available) toggles "Use Glob/Grep instead of find/grep" lines and the
 *     forbidden-binary list (with vs. without `find`/`grep`). @450079-450089
 *   - `tengu_relay_chain_v1` toggles the multi-command chaining guidance. @450090-450100
 *   - `nG()` (sandbox active) injects the Monitor/until-loop sleep guidance. @450108-450123
 *   - `t` (sandbox examples, threaded from the tool object's `prompt()` when the `mH` sandbox
 *     MCP tool is present) appends sandbox usage examples. @450680
 *
 * Verbatim FULL-mode strings (selected, all @450081-450136):
 *   - `Read files: Use ${Ws} (NOT cat/head/tail)`
 *   - `Edit files: Use ${Fa} (NOT sed/awk)`
 *   - `Write files: Use ${Kc} (NOT echo >/cat <<EOF)`
 *   - "Communication: Output text directly (NOT echo/printf)"
 *   - "Before running destructive operations (e.g., git reset --hard, git push --force,
 *      git checkout --), consider whether there is a safer alternative that achieves the same
 *      goal. Only use destructive operations when they are truly the best approach."
 *   - "Never skip hooks (--no-verify) or bypass signing (--no-gpg-sign, -c commit.gpgsign=false)
 *      unless the user has explicitly asked for it. If a hook fails, investigate and fix the
 *      underlying issue."
 *   - "Do not sleep between commands that can run immediately — just run them."
 *   - sandbox-on: "Long leading `sleep` commands are blocked. To poll until a condition is met,
 *      use Monitor with an until-loop (e.g. `until <check>; do sleep 2; done`) — you get a
 *      notification when the loop exits. Do not chain shorter sleeps to work around the block."
 *   - 'Try to maintain your current working directory throughout the session by using absolute
 *      paths and avoiding usage of `cd`. … In particular, never prepend `cd <current-directory>`
 *      to a `git` command — `git` already operates on the current working tree, and the compound
 *      triggers a permission prompt.'
 *
 * 2.1.183: buildBashPrompt = uJa @cli_inner_pretty.js:450077-…
 * 2.1.88 mirror: src/tools/BashTool/prompt.ts
 */
declare function buildBashPrompt(model: unknown, sandboxExamples: unknown): string

// ============================================================================
// Tool object — Cl = pi({...})
// ============================================================================

/**
 * The Bash tool definition. Built through the shared `buildTool` (pi) factory.
 *
 * 2.1.183: BashTool = Cl = pi({...}) @cli_inner_pretty.js:450669-451009
 * 2.1.88 mirror: src/tools/BashTool/BashTool.tsx
 */
export const BashTool = buildTool({
  name: BASH_TOOL_NAME,
  ruleContentField: 'command', // @450671
  searchHint: 'execute shell commands', // @450672
  maxResultSizeChars: 30000, // @450673
  strict: true, // @450674

  // Description: the per-call `description` field if present, else "Run shell command".
  // Matches assets/tools/Bash.md "## Description". @450675-450677
  async description({ description }: BashInput): Promise<string> {
    return description || 'Run shell command'
  },

  // prompt(): if the toolset includes the sandbox MCP tool (`mH`), thread sandbox examples in.
  // @450678-450681
  async prompt({ model, tools }: { model: unknown; tools: unknown[] }): Promise<string> {
    const hasSandboxMcpTool = tools.some((t) => toolMatchesName(t, SANDBOX_MCP_TOOL)) // Rc(o, mH)
    const sandboxExamples = hasSandboxMcpTool ? await loadSandboxExamples(currentSandboxConfig()) : []
    return buildBashPrompt(model, formatSandboxExamples(sandboxExamples)) // uJa(e, Ymo(r))
  },

  // A command is concurrency-safe iff it is read-only. @450682-450684
  isConcurrencySafe(input: BashInput): boolean {
    return this.isReadOnly?.(input) ?? false
  },

  // READ-ONLY iff the read-only decision resolves to "allow". @450685-450688
  isReadOnly(input: BashInput): boolean {
    const changesCwdHint = commandChangesCwd(input.command) // V3t
    return classifyReadOnly(input, changesCwdHint).behavior === 'allow'
  },

  // Auto-classifier sees just the raw command. @450689-450691
  toAutoClassifierInput(input: BashInput): string {
    return input.command
  },

  // Build a matcher used to test permission rules against this command's sub-commands.
  // helper: preparePermissionMatcher @450692-450711 — simple/differential command-prefix matcher
  // (parses via `_tt`; falls back to `() => true` for differential/unknown node types).
  async preparePermissionMatcher(args: { command: string }): Promise<(rule: string) => boolean> {
    return prepareBashPermissionMatcher(args)
  },

  // Classifies a command as search/read/list (drives UI + lean-prompt). @450712-450716
  isSearchOrReadCommand(input: BashInput) {
    const parsed = bashInputSchema.safeParse(input)
    if (!parsed.success) return { isSearch: false, isRead: false, isList: false }
    return classifySearchReadList(parsed.data.command) // OFp
  },

  get inputSchema() {
    return bashInputSchema // AJa() @450718
  },
  coerceInput: coerceBashInput, // nXa @450720
  get outputSchema() {
    return bashOutputSchema // UFp() @450722
  },

  // User-facing label: relabel a sed-edit Bash call as an Edit; show "SandboxedBash" when the
  // sandbox indicator env flag is set and the command would be sandboxed. @450724-450731
  userFacingName(input?: BashInput): string {
    if (!input) return 'Bash'
    if (input.command) {
      const sed = parseSedEditCommand(input.command) // kGe
      if (sed) return editToolUserFacingName({ file_path: sed.filePath, old_string: 'x' }) // q4n
    }
    return showSandboxIndicator() && shouldUseSandbox(input) ? 'SandboxedBash' : 'Bash'
  },

  // helper: getToolUseSummary @450732-450737 / getActivityDescription @450738-450741
  getToolUseSummary,
  getActivityDescription,

  /**
   * validateInput — SLEEP GUARD. When sandboxing is active (`nG()`), the run isn't in
   * background-mode (`!p4t`), and the call didn't opt into `run_in_background`, block a
   * leading `sleep N` so the model can't burn the user's clock. @450742-450753
   */
  async validateInput(input: BashInput): Promise<ValidationResult> {
    if (isSandboxActive() && !isBackgroundUnavailable() && !input.run_in_background) {
      const blocked = detectLeadingSleep(input.command) // GFp @450744
      if (blocked !== null)
        return {
          result: false,
          // @450748 — verbatim
          message: `Blocked: ${blocked}. To wait for a condition, use Monitor with an until-loop (e.g. \`until <check>; do sleep 2; done\`). To wait for a command you started, use run_in_background: true. Do not chain shorter sleeps to work around this block.`,
          errorCode: 10,
        }
    }
    return { result: true }
  },

  /**
   * checkPermissions — resolve the base decision, then apply the dangerouslyDisableSandbox
   * OVERRIDE GUARD. If the model set `dangerouslyDisableSandbox`, and the base decision is NOT
   * deny/ask, and the decision's reason isn't a sandbox-override already (`hJa`), and the command
   * would NOT be sandboxed as-given but WOULD be sandboxed without the flag — then the model is
   * trying to escape the sandbox, so force an ASK with a clear label instead of silently allowing.
   * @450754-450770
   */
  async checkPermissions(input: BashInput, ctx: ToolUseContext): Promise<PermissionDecision> {
    const base = await resolveBashPermission(input, ctx) // Yjt @450755
    if (
      input.dangerouslyDisableSandbox &&
      base.behavior !== 'deny' &&
      base.behavior !== 'ask' &&
      !isSandboxOverrideReason(base.decisionReason) && // hJa @450760
      !shouldUseSandbox(input) && // would NOT sandbox as-given @450761
      shouldUseSandbox({ ...input, dangerouslyDisableSandbox: false }) // WOULD sandbox without override @450762
    )
      return {
        behavior: 'ask',
        decisionReason: { type: 'sandboxOverride', reason: 'dangerouslyDisableSandbox' }, // @450766
        message: 'Run outside of the sandbox', // @450767
      }
    return base
  },

  // helper: render/extract/map functions @450771-450827 (qKa/VKa/zKa/KKa, extractSearchText,
  //   mapToolResultToToolResultBlockParam — the latter assembles the tool_result content from
  //   stdout/stderr + background-task notice + stale-read/gh-rate-limit hints).

  /**
   * call — execute the command.
   *   - Fast-path: if `_simulatedSedEdit` is present, apply the precomputed sed edit and return
   *     (no shell spawn). @450829
   *   - Otherwise compute the sandbox flag `y = shouldUseSandbox(input)` @450840, then spawn via
   *     the bash pipeline `zFp({ input, abortController, taskRegistry, setToolJSX, emitToolProgress,
   *     preventCwdChanges, isMainThread, toolUseId, agentId, sessionEnvVars, effortLevel })`. @450842-450854
   *   - Streams `bash_progress` events through the optional progress callback. @450856-450874
   *   - If the spawn was intercepted (sed routed), un-set the sandbox flag. @450875
   *   - Interprets the result via command semantics (`rXa` — e.g. grep exit 1 = no matches, not an
   *     error). @450885
   *   - Detects `.git/index.lock` collisions → `tengu_git_index_lock_error`. @450886-450888
   *   - On a real error: emits `tengu_bash_tool_command_failed` (with `sandboxed`,
   *     `destructive_category: getDestructiveCategory(command)`, `permission_mode`) and throws `R$`. @450903-450918
   *   - On pre-spawn error: throws `Bl`, redacting argv (null-byte vs generic). @450898-450902
   *   - Persists oversized output (> 67,108,864 bytes = 64 MiB) to a file, truncating to the cap. @450924-450940
   *   - Emits `tengu_bash_tool_command_executed` with the same tags. @450941-…
   *
   * helper: zFp @… — bash spawn/stream pipeline
   * helper: rXa @… — command-semantics result interpretation (mirrors commandSemantics.ts)
   *
   * NOTE: in 2.1.183 `call` is a plain `async` method (`async call(e, t, n, r, o)` @450828),
   * NOT an async generator. Progress is pushed through the 5th positional callback `o`
   * (emitted as `{ type: "progress", toolUseID: "bash-progress-N", data: { type: "bash_progress", … } }`
   * @450856-450873), and the method returns the final tool-result block — it does not `yield`.
   * 2.1.183: call @cli_inner_pretty.js:450828-…
   */
  async call(
    input: BashInput,
    ctx: ToolUseContext,
    n: unknown,
    r: unknown,
    onProgress?: (e: unknown) => void, // o — progress callback (NOT a generator yield)
  ) {
    // Faithful behavior summarized above; full pipeline is the spawn helper zFp.
    return runBashCall(input, ctx, n, r, onProgress)
  },

  // helper: renderToolUseErrorMessage / isResultTruncated @450952-… (UI)
})

// ============================================================================
// Externally-defined helpers (declared, defined elsewhere in the bundle)
// ============================================================================
// helper: pi @149995 — buildTool factory (see _anchors_framework_registry.md)
// helper: Zh — split a command line into top-level sub-commands
// helper: lE — tokenize a single command into argv
// helper: jG — strip safe wrappers (timeout/env/etc.) from a command
// helper: TB().parse / iPt / dPt — bash AST parse + sub-command analysis
// helper: vLe — match a command against deny/ask/allow bash rules
// helper: nXa (coerceBashInput) — input coercion
// helper: OFp (classifySearchReadList), _tt / prepareBashPermissionMatcher — matcher prep
// helper: q4n (editToolUserFacingName), Yp (askMessage), Yke/OJa (prefix suggestions)
declare function buildTool(def: any): any
declare function tokenize(s: string): string[]
declare function stripWrappers(s: string): string
declare function stripLeadingEnvVars(cmd: string, vars: RegExp): string
declare function splitIntoSubcommands(s: string): string[]
declare function parseShellAst(s: string): unknown
declare function analyzeSubcommands(s: string, ast: unknown): any
declare function containsSubshell(ast: unknown): boolean
declare function containsBackgroundAmp(ast: unknown): boolean
declare function allowlistedEnvVarSet(): Set<string> | null
declare function isHarmlessEnvVar(name: string): boolean
declare function classifyExpansion(s: string): string
declare function containsUncPath(s: string): boolean
declare function isGitCommand(s: string): boolean
declare function classifyReadOnlyTail(input: BashInput, parsed: any, hasGit: boolean): ReadOnlyDecision
declare function getSettings(): any
declare function parseBashRule(pattern: string): { type: 'prefix'; prefix: string } | { type: 'exact'; command: string } | { type: 'wildcard'; pattern: string }
declare function matchWildcard(pattern: string, candidate: string): boolean
declare function matchBashRules(input: BashInput, ctx: PermissionContext, mode: string): { matchingDenyRules: any[]; matchingAskRules: any[]; matchingAllowRules: any[] }
declare function askMessage(name: string, reason?: unknown): string
declare function suggestPrefixes(command: string): unknown[]
declare function classifySearchReadList(command: string): { isSearch: boolean; isRead: boolean; isList: boolean }
declare function prepareBashPermissionMatcher(args: { command: string }): Promise<(rule: string) => boolean>
declare function coerceBashInput(input: unknown): BashInput
declare function editToolUserFacingName(input: { file_path: string; old_string: string }): string
declare function getToolUseSummary(input?: BashInput): string | null
declare function getActivityDescription(input?: BashInput): string
declare function runBashCall(input: BashInput, ctx: ToolUseContext, n: unknown, r: unknown, onProgress?: (e: unknown) => void): Promise<unknown>
declare function toolMatchesName(tool: unknown, name: unknown): boolean
declare function loadSandboxExamples(cfg: unknown): Promise<unknown[]>
declare function currentSandboxConfig(): unknown
declare function formatSandboxExamples(examples: unknown[]): unknown
declare function isSandboxActive(): boolean // nG()
declare function isSandboxForced(): boolean // hx()
declare function isSandboxForceApplicable(): boolean // Xse()
declare function isBackgroundUnavailable(): boolean // p4t — NB: in the bundle p4t is a CONSTANT (p4t = Ge.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS @450553), used bare (`p4t ? …`, `!p4t`); modeled here as an accessor for readability
declare function isSandboxOverrideReason(reason: unknown): boolean // hJa
declare function showSandboxIndicator(): boolean
declare const SandboxManager: { isSandboxingEnabled(): boolean; areUnsandboxedCommandsAllowed(): boolean }
declare const BINARY_HIJACK_VARS: RegExp // Mbf
declare const SANDBOX_MCP_TOOL: unknown // mH

type PermissionContext = unknown
type ToolUseContext = unknown
type ValidationResult = { result: boolean; message?: string; errorCode?: number }
type PermissionDecision = {
  behavior: 'allow' | 'ask' | 'deny' | 'passthrough'
  message?: string
  decisionReason?: unknown
  updatedInput?: BashInput
  suggestions?: unknown[]
}
