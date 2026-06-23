// ============================================================================
// Reconstructed READABLE-SOURCE — Claude Code v2.1.183
// File: src/constants/prompts.ts  (identity, main-loop builders, env block,
//       default-agent prompt, scratchpad, dynamic boundary, prependBullets)
// ----------------------------------------------------------------------------
// 2.1.183 regions covered (all anchors are 2.1.183-native cli_inner_pretty.js):
//   - Identity strings + selector ........ l_n @149945 ; gNr/OAi/NAi @149953-149955 ;
//                                          FJu/a_n identity-set @149958-149960
//   - CYBER_RISK_INSTRUCTION .............. Jko @580615-580616
//   - prependBullets ..................... pV  @580709-580711
//   - FULL intro builder ................. y_f @580712-580718  (asset 02_builder_y_f.txt, len 935)
//   - LEAN intro + # Harness builder ..... w_f @580861-580881  (asset 02_builder_w_f.txt, len 1078)
//   - ownership-frame predicate .......... t0o @581260-581265
//   - env block (<env> uname form) ....... L_f @580976-581005  (asset 03_env_template_0_L_f.txt)
//   - env block (# Environment bulleted) . D_f @581006-581039
//   - env block (# Environment static) ... P_f @581041-581053
//   - env block (# Environment excluded) . M_f @581056-581073
//   - per-model knowledge cutoff ......... r0o @581075-581087
//   - shell-info line .................... o0o @581088-581098
//   - OS version (uname -sr analog) ...... s0o @581099-581102  (== getUnameSR)
//   - model id map ....................... wPe @581254-581259
//   - DEFAULT_AGENT_PROMPT family ........ $vp @384820-384835 ; const NBa @581198-581199
//   - scratchpad instructions ............ HUn @581135-581155
//   - dynamic boundary marker ............ hoe @53897 ; re-export @555558
//   - lean gate (consumed by assembler) .. Dg  @134268-134273
//   - top assembler (consumer of above) .. KL  @580888-580940
// ----------------------------------------------------------------------------
// 2.1.88 convention mirror: /lyz/codespace/3rd/claude-code/src/constants/prompts.ts
// 2.1.156 scaffold doc:    .../claude_code_v_2.1.156/analyze/44_lean_prompt/README.md
// Cross-validation: the machine (identity l_n, lean gate Dg, builders, env block,
//   scratchpad, dynamic boundary) is carryover from 2.1.156; the 2.1.183 deltas are
//   the Fable-5 model-list env line (D_f/P_f @581032/581047), the ownership-frame
//   team-intro variants in w_f (@580864-580869) — confirmed NEW by 0-count grep of
//   these strings in the 2.1.156 bundle (anchor dossier §13).
// ============================================================================

// biome-ignore-all assist/source/organizeImports: ANT-ONLY import markers must not be reordered
import { type as osType, version as osVersion, release as osRelease } from 'os'
import { env } from '../utils/env.js'
import { getIsGit } from '../utils/git.js'
import { getCwd } from '../utils/cwd.js'
import { getCurrentWorktreeSession } from '../utils/worktree.js'
import {
  getMarketingNameForModel,
  getCanonicalName,
} from '../utils/model/model.js'
import {
  isScratchpadEnabled,
  getScratchpadDir,
} from '../utils/permissions/filesystem.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'
import { logForDebugging } from '../utils/debug.js'
// Su = isPosixShell() @221433 (bash/POSIX shell reachable); JO = isPowerShellToolEnabled()
// @221425 (CLAUDE_CODE_USE_POWERSHELL_TOOL + tengu_cobalt_ridge). These are the actual
// o0o (getShellInfoLine) Windows-branch predicates — NOT isWindows()/hasBashTool().
import { isPosixShell, isPowerShellToolEnabled } from '../utils/platform.js'
import type { OutputStyleConfig } from './outputStyles.js'
// CYBER_RISK_INSTRUCTION (Jko @580615-580616) is co-located in constants/system.ts in this
// reconstruction (see system.ts header — the 2.1.88 cyberRiskInstruction.ts split is folded
// into system.ts here). Import from the canonical home, not a non-existent cyberRiskInstruction.ts.
import { CYBER_RISK_INSTRUCTION } from './system.js'

// ----------------------------------------------------------------------------
// Docs map URL — convention carryover from 2.1.88 (unchanged literal).
// ----------------------------------------------------------------------------
export const CLAUDE_CODE_DOCS_MAP_URL =
  'https://code.claude.com/docs/en/claude_code_docs_map.md'

// ============================================================================
// 1. Dynamic boundary marker
// ============================================================================

/**
 * Boundary marker separating static (cross-org cacheable) content from dynamic
 * content. Everything BEFORE this marker in the system-prompt array can use the
 * 'org'/'global' cache scope; everything AFTER it is session-specific.
 *
 * The assembler appends this marker (gated by Xve() — first-party / anthropicAws
 * only) right after the behavioral head and before the resolved dynamic sections;
 * the cache-scope splitter (a0o @581376) finds it with findIndex(=== hoe) and
 * splits the cached prefix from the dynamic suffix.
 *
 * WARNING: Do not remove or reorder this marker without updating the cache logic
 * in the prompt-splitter (a0o/QOl) and the API claude.ts block builder.
 */
// 2.1.183: SYSTEM_PROMPT_DYNAMIC_BOUNDARY = hoe @cli_inner_pretty.js:53897 (re-export @555558)
export const SYSTEM_PROMPT_DYNAMIC_BOUNDARY =
  '__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'

// ============================================================================
// 2. Model id map (the latest-tier ids interpolated into the env model-list line)
// ============================================================================

// @[MODEL LAUNCH]: Update the model family IDs below to the latest in each tier.
// 2.1.183: FRONTIER_MODEL_IDS = wPe @cli_inner_pretty.js:581254-581259
const FRONTIER_MODEL_IDS = {
  fable: 'claude-fable-5', // @581255
  opus: 'claude-opus-4-8', // @581256
  sonnet: 'claude-sonnet-4-6', // @581257
  haiku: 'claude-haiku-4-5-20251001', // @581258
}

// ============================================================================
// 3. Identity strings + selector — RE-EXPORTED from utils/systemPromptType.ts
// ============================================================================
//
// Three canonical identity lines + the selector + the org-cache identity set.
// SINGLE-DEFINITION: the canonical home for these is utils/systemPromptType.ts
// (the dedicated identity + SystemPrompt-brand module, co-located with the
// API-normalization path). This file previously DUPLICATED the definitions
// under different readable names (IDENTITY_CLI / IDENTITY_SDK_CLI /
// IDENTITY_SDK_AGENT); those are reconciled here to the canonical
// BASE_IDENTITY / SDK_CLI_IDENTITY / SDK_AGENT_IDENTITY and re-exported so the
// §3 region documented in this file still resolves without a second definition.
//
// The selector decides which line opens the system prompt for the *live API
// path*; the interactive/SDK-agent intro line ("You are an interactive agent…")
// is NOT one of these constants — it is emitted inline by w_f / y_f (§5/§6).
// The identity set (FJu/a_n) is consumed by the cache-scope splitter to org-cache
// the identity prefix (shared across sessions in the same org).

// 2.1.183: BASE_IDENTITY = gNr @149953 ; SDK_CLI_IDENTITY = OAi @149954 ;
//          SDK_AGENT_IDENTITY = NAi @149955 ; IDENTITY_STRINGS = a_n @149958-149960 ;
//          getIdentityString = l_n @149945-149952
export {
  BASE_IDENTITY,
  SDK_CLI_IDENTITY,
  SDK_AGENT_IDENTITY,
  IDENTITY_STRINGS,
  getIdentityString,
} from '../utils/systemPromptType.js'

// ============================================================================
// 4. prependBullets — the bullet renderer used by every "# Section" builder
// ============================================================================
//
// Flattens an item list into ` - item` bullets; a nested string[] becomes
// `  - subitem` indented sub-bullets. Convention carryover from 2.1.88.

// 2.1.183: prependBullets = pV @cli_inner_pretty.js:580709-580711
export function prependBullets(items: Array<string | string[]>): string[] {
  return items.flatMap(item =>
    Array.isArray(item)
      ? item.map(subitem => `  - ${subitem}`) // @580710 nested → "  - "
      : [` - ${item}`],
  )
}

// ============================================================================
// 4a. buildHooksClause — the "# System" hooks bullet (consumed by system.ts/__f)
// ============================================================================
//
// The hooks-configuration clause. Emitted as one ` - ` bullet of the full-mode
// "# System" section (buildSystemSection / __f @580725). Defined here, alongside
// prependBullets, matching the 2.1.88 convention (getHooksSection lived in
// constants/prompts.ts); imported by constants/system.ts.

// 2.1.183: buildHooksClause = f_f @cli_inner_pretty.js:580670-580672
export function buildHooksClause(): string {
  // @580671 (verbatim)
  return "Users may configure 'hooks', shell commands that execute in response to events like tool calls, in settings. Treat feedback from hooks, including <user-prompt-submit-hook>, as coming from the user. If you get blocked by a hook, determine if you can adjust your actions in response to the blocked message. If not, ask the user to check their hooks configuration."
}

// ============================================================================
// 5. Main-loop intro builders — y_f (FULL) and w_f (LEAN)
// ============================================================================
//
// Both take the resolved output-style (or null) and switch their opening line on
// it (`outputStyleConfig !== null` = output-style injection). The lean gate Dg(model)
// in the assembler decides WHICH builder runs: full models → y_f (one of six full
// sections), lean models → w_f (a single collapsed intro + "# Harness").

/**
 * FULL-mode intro section (asset 02_builder_y_f.txt, length 935).
 *
 * Opens with the interactive-agent line, switching to the output-style framing
 * when an output style is configured (@580714), then injects the cyber-risk
 * clause (@580716) and the URL-guessing prohibition (@580717).
 */
// 2.1.183: getFullIntroSection = y_f @cli_inner_pretty.js:580712-580718
export function getFullIntroSection(
  outputStyleConfig: OutputStyleConfig | null,
): string {
  // eslint-disable-next-line custom-rules/prompt-spacing
  return `
You are an interactive agent that helps users ${
    // @580714 output-style branch (e !== null)
    outputStyleConfig !== null
      ? 'according to your "Output Style" below, which describes how you should respond to user queries.'
      : 'with software engineering tasks.'
  } Use the instructions below and the tools available to you to assist the user.

${CYBER_RISK_INSTRUCTION}
IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident that the URLs are for helping the user with programming. You may use URLs provided by the user in their messages or local files.`
  // @580716 ${CYBER_RISK_INSTRUCTION} (Jko) injected here
  // @580717 URL-guessing prohibition (verbatim)
}

/**
 * Ownership-frame ("team") predicate — when armed, the lean intro reframes Claude
 * as a collaborator that *owns the outcome* rather than a helper. Memoized; armed
 * by the CLAUDE_CODE_OWNERSHIP_FRAME env var OR the tengu_walnut_prism growthbook
 * flag. NEW in 2.1.183 (the team-intro variants below are 0-count in 2.1.156).
 */
// 2.1.183: isOwnershipFrameEnabled = t0o @cli_inner_pretty.js:581260-581265
export function isOwnershipFrameEnabled(): boolean {
  const envValue = env.CLAUDE_CODE_OWNERSHIP_FRAME // @581261
  const armed = envValue || getFeatureValue_CACHED_MAY_BE_STALE('tengu_walnut_prism', false) // @581262
  if (armed)
    logForDebugging(
      `ownership_frame_arm_active source=${envValue ? 'env' : 'growthbook'}`,
    ) // @581263
  return Boolean(armed)
}

/**
 * LEAN-mode intro + "# Harness" section (asset 02_builder_w_f.txt, length 1078).
 *
 * Collapses the six full sections to one. The opening line has four variants on
 * two axes — (ownership-frame on/off) × (output-style on/off) — emitted at
 * @580864-580869. Then the cyber-risk clause (@580873) and a 5-bullet "# Harness"
 * block (@580876-580880) that compresses the full # System/# Tone guidance.
 */
// 2.1.183: getLeanHarnessIntroSection = w_f @cli_inner_pretty.js:580861-580881
export function getLeanHarnessIntroSection(
  outputStyleConfig: OutputStyleConfig | null,
): string {
  const ownershipFrame = isOwnershipFrameEnabled() // @580862 t = t0o()

  // @580863-580864 default (no output style)
  let intro = ownershipFrame
    ? 'You work alongside the user on software engineering tasks and own the outcome of what you take on.'
    : 'You are an interactive agent that helps users with software engineering tasks.'

  if (outputStyleConfig !== null) {
    // @580866-580869 output-style branch (e !== null)
    intro = ownershipFrame
      ? 'You work alongside the user and own the outcome of what you take on; your "Output Style" below describes how you should respond to queries.'
      : 'You are an interactive agent that helps users according to your "Output Style" below, which describes how you should respond to user queries.'
  }

  // eslint-disable-next-line custom-rules/prompt-spacing
  return `
${intro}

${CYBER_RISK_INSTRUCTION}

# Harness
 - Text you output outside of tool use is displayed to the user as Github-flavored markdown in a terminal.
 - Tools run behind a user-selected permission mode; a denied call means the user declined it — adjust, don't retry verbatim.
 - \`<system-reminder>\` tags in messages and tool results are injected by the harness, not the user. Hooks may intercept tool calls; treat hook output as user feedback.
 - Prefer the dedicated file/search tools over shell commands when one fits. Independent tool calls can run in parallel in one response.
 - Reference code as \`file_path:line_number\` — it's clickable.`
  // @580873 ${CYBER_RISK_INSTRUCTION} (Jko)
  // @580876-580880 the five "# Harness" bullets (verbatim)
}

// ============================================================================
// 6. Environment block
// ============================================================================
//
// Four env builders share the same model-line / cutoff / model-list helpers but
// differ in shape and which dynamic fields they carry:
//   - getEnvBlockUname (L_f)    — the classic <env> uname-style block (subagent trailer).
//   - getEnvBlockSimple (D_f)   — the live-session "# Environment" bulleted block.
//   - getEnvBlockStatic (P_f)   — "# Environment" static (excludeDynamicSections mode):
//                                 model + model-list + CLI-availability only.
//   - getEnvBlockExcluded (M_f) — "# Environment" carrying ONLY the excluded dynamic
//                                 fields (cwd/git/dirs/platform/shell/os).
//
// Cache-busting of cwd/date is delegated to the out-of-band date_change attachment
// and the uncached billing header (anchor dossier §7a) — there is no per-field
// DANGEROUS_uncached split inside the env block in 2.1.183.

/**
 * `uname -sr` analog. os.type()/os.release() wrap uname(3) on POSIX, byte-identical
 * to `uname -sr` ("Darwin 25.3.0", "Linux 6.6.4"); Windows has no uname(3), so use
 * os.version() (the friendlier "Windows 11 Pro") + os.release(). Feeds the
 * "OS Version:" line of the env block.
 */
// 2.1.183: getUnameSR = s0o @cli_inner_pretty.js:581099-581102
export function getUnameSR(): string {
  if (env.platform === 'win32') {
    return `${osVersion()} ${osRelease()}` // @581100
  }
  return `${osType()} ${osRelease()}` // @581101
}

/**
 * Shell-info line. zsh/bash detected from $SHELL; on Windows, distinguishes
 * PowerShell-only from PowerShell+Bash (when a POSIX Bash tool is also available).
 *
 * NOTE (cross-validated 2.1.183): the two Windows-branch predicates are
 *   Su() = isPosixShell()  — true when a bash/POSIX shell is reachable
 *          (Su @221433: `Kt()!=="windows" || Cpe()!==null`), NOT "isWindows".
 *   JO() = isPowerShellToolEnabled() — true when the PowerShell tool is on
 *          (JO @221425: CLAUDE_CODE_USE_POWERSHELL_TOOL + tengu_cobalt_ridge),
 *          NOT a generic "hasBashTool". Branch order/strings are byte-exact;
 *          only the helper names were corrected here.
 */
// 2.1.183: getShellInfoLine = o0o @cli_inner_pretty.js:581088-581098
function getShellInfoLine(): string {
  const shell = process.env.SHELL || 'unknown' // @581089
  const shellName = shell.includes('zsh')
    ? 'zsh'
    : shell.includes('bash')
      ? 'bash'
      : shell // @581090
  if (env.platform === 'win32') {
    // @581091
    if (!isPosixShell()) return 'Shell: PowerShell' // @581092 (!Su() — no bash/POSIX shell)
    if (isPowerShellToolEnabled())
      // @581093 (JO() — PowerShell tool armed)
      return 'Shell: PowerShell (primary); Bash tool also available for POSIX scripts — each takes its own syntax.'
    return `Shell: ${shellName}` // @581095
  }
  return `Shell: ${shellName}` // @581097
}

/**
 * Per-model knowledge-cutoff date. Fable-5 / Mythos-5 / Opus 4.8 / Opus 4.7 →
 * "January 2026"; older tiers map back through 2025.
 */
// @[MODEL LAUNCH]: Add a knowledge cutoff date for the new model.
// 2.1.183: getKnowledgeCutoff = r0o @cli_inner_pretty.js:581075-581087
function getKnowledgeCutoff(modelId: string): string | null {
  const canonical = getCanonicalName(modelId) // @581076 Bo(e)
  if (canonical === 'claude-fable-5' || canonical === 'claude-mythos-5')
    return 'January 2026' // @581077
  if (canonical === 'claude-opus-4-8') return 'January 2026' // @581078
  if (canonical === 'claude-opus-4-7') return 'January 2026' // @581079
  if (canonical === 'claude-sonnet-4-6') return 'August 2025' // @581080
  if (canonical === 'claude-opus-4-6') return 'May 2025' // @581081
  if (canonical === 'claude-opus-4-5') return 'May 2025' // @581082
  if (canonical === 'claude-haiku-4-5') return 'February 2025' // @581083
  if (
    canonical === 'claude-opus-4-0' ||
    canonical === 'claude-opus-4-1' ||
    canonical === 'claude-sonnet-4-0' ||
    canonical === 'claude-sonnet-4-5'
  )
    return 'January 2025' // @581084-581085
  return null // @581086
}

/** The model-description line shared by every env builder. */
function getModelDescriptionLine(modelId: string): string {
  const marketingName = getMarketingNameForModel(modelId) // ZA(e)
  return marketingName
    ? `You are powered by the model named ${marketingName}. The exact model ID is ${modelId}.`
    : `You are powered by the model ${modelId}.`
}

/** The "most recent Claude models …" model-list line (NEW Fable-5 framing in 2.1.183). */
function getModelListLine(): string {
  // @581032 / @581047 (verbatim)
  return `The most recent Claude models are Fable 5 and the Claude 4.X family. Model IDs — Fable 5: '${FRONTIER_MODEL_IDS.fable}', Opus 4.8: '${FRONTIER_MODEL_IDS.opus}', Sonnet 4.6: '${FRONTIER_MODEL_IDS.sonnet}', Haiku 4.5: '${FRONTIER_MODEL_IDS.haiku}'. When building AI applications, default to the latest and most capable Claude models.`
}

const CLI_AVAILABILITY_LINE =
  'Claude Code is available as a CLI in the terminal, desktop app (Mac/Windows), web app (claude.ai/code), and IDE extensions (VS Code, JetBrains).'

/**
 * Classic `<env>` uname-style block (asset 03_env_template_0_L_f.txt).
 * Used by the subagent trailer (k2t). The model line + knowledge cutoff are
 * appended after the closing </env> tag.
 */
// 2.1.183: getEnvBlockUname = L_f @cli_inner_pretty.js:580976-581005
export async function getEnvBlockUname(
  modelId: string,
  additionalWorkingDirectories?: string[],
): Promise<string> {
  const [isGit, unameSR] = await Promise.all([getIsGit(), getUnameSR()]) // @580977 — [T_(), s0o()]

  const modelDescription = getModelDescriptionLine(modelId) // @580980-580983
  const additionalDirsInfo =
    additionalWorkingDirectories && additionalWorkingDirectories.length > 0
      ? `Additional working directories: ${additionalWorkingDirectories.join(', ')}\n`
      : '' // @580984-580987
  const cutoff = getKnowledgeCutoff(modelId) // @580991 — r0o(e)
  const knowledgeCutoffMessage = cutoff
    ? `\n\nAssistant knowledge cutoff is ${cutoff}.`
    : '' // @580991-580995

  return `Here is useful information about the environment you are running in:
<env>
Working directory: ${getCwd()}
Is directory a git repo: ${isGit ? 'Yes' : 'No'}
${additionalDirsInfo}Platform: ${env.platform}
${getShellInfoLine()}
OS Version: ${unameSR}
</env>
${modelDescription}${knowledgeCutoffMessage}`
  // @580998 cwd Pt() ; @581000 Ge.platform ; @581001 o0o() ; @581002 OS version r
}

/**
 * Default live-session "# Environment" bulleted block (D_f). Carries cwd, worktree
 * note, git status, additional dirs, platform, shell, os, model, cutoff, the NEW
 * Fable-5 model-list line, CLI-availability, and (when not a teammate) a fast-mode note.
 */
// 2.1.183: getEnvBlockSimple = D_f @cli_inner_pretty.js:581006-581039
export async function getEnvBlockSimple(
  modelId: string,
  isTeammate: boolean,
  additionalWorkingDirectories?: string[],
): Promise<string> {
  const [isGit, unameSR] = await Promise.all([getIsGit(), getUnameSR()]) // @581007

  const modelDescription = getModelDescriptionLine(modelId) // @581009-581012
  const cutoff = getKnowledgeCutoff(modelId) // @581014
  const knowledgeCutoffMessage = cutoff
    ? `Assistant knowledge cutoff is ${cutoff}.`
    : null // @581014-581015
  const cwd = getCwd() // @581016 Pt()
  const isWorktree = getCurrentWorktreeSession() !== null // @581017 aA() !== null

  const envItems = [
    `Primary working directory: ${cwd}`, // @581020
    isWorktree
      ? 'This is a git worktree — an isolated copy of the repository. Run all commands from this directory. Do NOT `cd` to the original repository root.'
      : null, // @581021-581022
    `Is a git repository: ${isGit}`, // @581024
    additionalWorkingDirectories && additionalWorkingDirectories.length > 0
      ? 'Additional working directories:'
      : null, // @581025
    additionalWorkingDirectories && additionalWorkingDirectories.length > 0
      ? additionalWorkingDirectories
      : null, // @581026 (nested → indented sub-bullets)
    `Platform: ${env.platform}`, // @581027
    getShellInfoLine(), // @581028
    `OS Version: ${unameSR}`, // @581029
    modelDescription, // @581030
    knowledgeCutoffMessage, // @581031
    getModelListLine(), // @581032 NEW Fable-5 model-list line
    CLI_AVAILABILITY_LINE, // @581033
    isTeammate
      ? null
      : 'Fast mode for Claude Code uses Claude Opus with faster output (it does not downgrade to a smaller model). It can be toggled with /fast and is available on Opus 4.8/4.7/4.6.', // @581034-581036
  ].filter((item): item is string | string[] => item !== null)

  return [
    '# Environment',
    'You have been invoked in the following environment: ',
    ...prependBullets(envItems),
  ].join('\n') // @581038
}

/**
 * Static "# Environment" block for excludeDynamicSections mode (P_f). Model + cutoff
 * + the NEW model-list line + CLI-availability + fast-mode note ONLY — the cwd/git
 * fields move to the excluded-content path (getEnvBlockExcluded).
 */
// 2.1.183: getEnvBlockStatic = P_f @cli_inner_pretty.js:581041-581053
export function getEnvBlockStatic(modelId: string, isTeammate: boolean): string {
  const modelDescription = getModelDescriptionLine(modelId) // @581042
  const cutoff = getKnowledgeCutoff(modelId) // @581043
  const items = [
    modelDescription, // @581045
    cutoff ? `Assistant knowledge cutoff is ${cutoff}.` : null, // @581046
    getModelListLine(), // @581047 NEW Fable-5 model-list line
    CLI_AVAILABILITY_LINE, // @581048
    isTeammate
      ? null
      : 'Fast mode for Claude Code uses Claude Opus with faster output (it does not downgrade to a smaller model). It can be toggled with /fast and is available on Opus 4.8/4.7/4.6.', // @581049-581051
  ].filter((item): item is string => item !== null)
  return ['# Environment', ...prependBullets(items)].join('\n') // @581052
}

/**
 * Excluded-content "# Environment" block (M_f). Carries ONLY the dynamic fields
 * that were stripped out of the cached static prefix (cwd, worktree, git, dirs,
 * platform, shell, os) so the dynamic-section harvester can re-emit them post-boundary.
 */
// 2.1.183: getEnvBlockExcluded = M_f @cli_inner_pretty.js:581056-581073
export async function getEnvBlockExcluded(
  additionalWorkingDirectories?: string[],
): Promise<string> {
  const [isGit, unameSR] = await Promise.all([getIsGit(), getUnameSR()]) // @581057
  const cwd = getCwd() // @581058
  const isWorktree = getCurrentWorktreeSession() !== null // @581059
  const items = [
    `Primary working directory: ${cwd}`, // @581061
    isWorktree
      ? 'This is a git worktree — an isolated copy of the repository. Run all commands from this directory. Do NOT `cd` to the original repository root.'
      : null, // @581062-581063
    `Is a git repository: ${isGit}`, // @581065
    additionalWorkingDirectories && additionalWorkingDirectories.length > 0
      ? 'Additional working directories:'
      : null, // @581066
    additionalWorkingDirectories && additionalWorkingDirectories.length > 0
      ? additionalWorkingDirectories
      : null, // @581067
    `Platform: ${env.platform}`, // @581068
    getShellInfoLine(), // @581069
    `OS Version: ${unameSR}`, // @581070
  ].filter((item): item is string | string[] => item !== null)
  return [
    '# Environment',
    'You have been invoked in the following environment: ',
    ...prependBullets(items),
  ].join('\n') // @581072
}

// ============================================================================
// 7. Scratchpad directory instructions
// ============================================================================

/**
 * Returns the "# Scratchpad Directory" guidance when scratchpad is enabled and
 * this is not a background session. Returns null otherwise. The directory path is
 * the per-session scratchpad dir.
 */
// 2.1.183: getScratchpadInstructions = HUn @cli_inner_pretty.js:581135-581155
export function getScratchpadInstructions(): string | null {
  if (!isScratchpadEnabled()) return null // @581136 — MX()
  if (env.CLAUDE_CODE_SESSION_KIND === 'bg') return null // @581137 (no scratchpad for bg sessions)
  const scratchpadDir = getScratchpadDir() // @581138 B_e()
  if (scratchpadDir === null) return null // @581139

  return `# Scratchpad Directory

IMPORTANT: Always use this scratchpad directory for temporary files instead of \`/tmp\` or other system temp directories:
\`${scratchpadDir}\`

Use this directory for ALL temporary file needs:
- Storing intermediate results or data during multi-step tasks
- Writing temporary scripts or configuration files
- Saving outputs that don't belong in the user's project
- Creating working files during analysis or processing
- Any file that would otherwise go to \`/tmp\`

Only use \`/tmp\` if the user explicitly requests it.

The scratchpad directory is session-specific, isolated from the user's project, and can generally be used without permission prompts.`
}

// ============================================================================
// 8. DEFAULT_AGENT_PROMPT — the general-purpose default-agent system prompt
// ============================================================================
//
// Two surfaces share the same head literal: the const DEFAULT_AGENT_PROMPT (NBa,
// the bare report-contract sentence) and the builder getDefaultAgentPrompt ($vp,
// which appends the "Your strengths:" / "Guidelines:" block). The general-purpose
// built-in agent (agentType "general-purpose") registers $vp as its getSystemPrompt.

// 2.1.183: DEFAULT_AGENT_PROMPT = NBa @cli_inner_pretty.js:581198-581199
export const DEFAULT_AGENT_PROMPT =
  "You are an agent for Claude Code, Anthropic's official CLI for Claude. Given the user's message, you should use the tools available to complete the task. Complete the task fully—don't gold-plate, but don't leave it half-done. When you complete the task, respond with a concise report covering what was done and any key findings — the caller will relay this to the user, so it only needs the essentials."

/**
 * General-purpose default-agent system prompt (asset 04_subagent_3_1288.txt,
 * length 1288). The head is DEFAULT_AGENT_PROMPT verbatim (composed inline in the
 * bundle from the bare-report sentence + the report-contract tail); the tail adds
 * the "Your strengths:" capability list and the "Guidelines:" research rules.
 */
// 2.1.183: getDefaultAgentPrompt = $vp @cli_inner_pretty.js:384820-384835
export function getDefaultAgentPrompt(): string {
  // @384821 head = DEFAULT_AGENT_PROMPT (interactive-agent contract + concise-report tail)
  return `${DEFAULT_AGENT_PROMPT}

Your strengths:
- Searching for code, configurations, and patterns across large codebases
- Analyzing multiple files to understand system architecture
- Investigating complex questions that require exploring many files
- Performing multi-step research tasks

Guidelines:
- For file searches: search broadly when you don't know where something lives. Use Read when you know the specific file path.
- For analysis: Start broad and narrow down. Use multiple search strategies if the first doesn't yield results.
- Be thorough: Check multiple locations, consider different naming conventions, look for related files.
- NEVER create files unless they're absolutely necessary for achieving your goal. ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested.`
  // @384823-384834 strengths + guidelines block (verbatim)
}

// helper: built-in general-purpose agent def = nye @384838 — registers getSystemPrompt: $vp @384845
