/**
 * SkillTool — invoke a slash-command skill from inside the agent loop.
 *
 * Readable-source reconstruction of the v2.1.183 obfuscated tool object `lut`
 * (the `pi({...})`-built Skill tool). This is the *contract-level* restoration:
 * identity, input/output Zod schema, prompt builder, isEnabled gate,
 * validateInput (all error codes), checkPermissions (deny/allow/auto/ask), and a
 * faithful `call` behavior summary. Deep forked-skill / remote-skill telemetry
 * plumbing is summarized with `// helper:` anchors rather than reproduced.
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - schemas iCp/aCp @393128-393150
 *   - tool object lut = pi({...}) @393151-393367 (call extends past 393367)
 *   - prompt builder FTn = wn(...) @220168-220189
 *   - name const mH = "Skill" @221449; tag const LU = "command-name" @45647
 *   - gate pU() = Ot.disableSlashCommands @3409-3411
 * 2.1.88 convention mirror: src/tools/SkillTool/{SkillTool.ts,prompt.ts,constants.ts}
 * 2.1.156 scaffold: 04_tools/README.md (tool-assembly spine; readable names inherited)
 * Cross-validation: re-read 393128-393357 + 220168-220189 in the 2.1.183 bundle;
 *   confirmed the 183 validateInput is RICHER than 2.1.88 (adds not-materialized=10,
 *   fork-recursion=9, not-allowlisted=8, bundled/override-disabled=7, UI/CLI=5 with
 *   the "Ask the user to run /x themselves" wording). Verified every quoted string.
 */

import { z } from 'zod/v4'
import { buildTool, type Tool, type ToolDef } from '../Tool.js'
import type {
  ValidationResult,
  ToolResult,
  ToolUseContext,
} from '../Tool.js'
import type { PermissionDecision } from 'src/utils/permissions/PermissionResult.js'
import { lazySchema } from 'src/utils/lazySchema.js' // we() — lazy memoized schema thunk
import { memoizeAsync } from 'src/utils/cache.js' // wn() — memoized async builder
import { logEvent } from 'src/services/analytics/index.js' // G(...)
import { recordSkillInvokeError } from 'src/services/telemetry/toolErrors.js' // Me("skill_invoke", reason)

// 2.1.183: SKILL_TOOL_NAME = mH @221449
export const SKILL_TOOL_NAME = 'Skill'

// The skill system-reminder tag — when a `<command-name>` tag is already present
// in the conversation, the skill body has been loaded and must not be re-invoked.
// 2.1.183: SKILL_REMINDER_TAG = LU = "command-name" @45647
const SKILL_REMINDER_TAG = 'command-name'

/**
 * Slash-commands-disabled gate. SkillTool is hidden entirely when the harness has
 * `disableSlashCommands` set (e.g. certain non-interactive / restricted modes).
 * 2.1.183: slashCommandsDisabled = pU @3409-3411 → return Ot.disableSlashCommands
 */
declare function slashCommandsDisabled(): boolean // pU()

// ---------------------------------------------------------------------------
// Input / Output schemas
// ---------------------------------------------------------------------------

// 2.1.183: inputSchema = iCp = we(() => H.object({...})) @393128-393133
export const inputSchema = lazySchema(() =>
  z.object({
    skill: z
      .string()
      // @393130 — verbatim
      .describe(
        'The name of a skill from the available-skills list. Do not guess names.',
      ),
    args: z
      .string()
      .optional()
      // @393131 — verbatim
      .describe('Optional arguments for the skill'),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: outputSchema = aCp = we(() => H.union([inline, forked])) @393134-393150
export const outputSchema = lazySchema(() => {
  // Inline (default) skill result.
  const inlineOutputSchema = z.object({
    success: z.boolean().describe('Whether the skill is valid'), // @393136
    commandName: z.string().describe('The name of the skill'), // @393137
    allowedTools: z
      .array(z.string())
      .optional()
      .describe('Tools allowed by this skill'), // @393138
    model: z.string().optional().describe('Model override if specified'), // @393139
    status: z.literal('inline').optional().describe('Execution status'), // @393140
  })
  // Forked sub-agent skill result.
  const forkedOutputSchema = z.object({
    success: z.boolean().describe('Whether the skill completed successfully'), // @393143
    commandName: z.string().describe('The name of the skill'), // @393144
    status: z.literal('forked').describe('Execution status'), // @393145
    agentId: z
      .string()
      .describe('The ID of the sub-agent that executed the skill'), // @393146
    result: z.string().describe('The result from the forked skill execution'), // @393147
  })
  return z.union([inlineOutputSchema, forkedOutputSchema])
})
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.input<OutputSchema>

// ---------------------------------------------------------------------------
// Prompt builder (FTn) — verbatim text from bundle @220169-220188
// ---------------------------------------------------------------------------

/**
 * 2.1.183: getSkillPrompt = FTn = wn(async (cwd) => `...`) @220168-220189.
 * Memoized async builder; the only interpolation is the `<${SKILL_REMINDER_TAG}>`
 * tag name. Quoted verbatim from the 2.1.183 bundle (NOT the 2.1.88 wording — the
 * 183 head dropped the "(e.g. /commit, /review-pr)" examples and added the
 * "exact name / no leading slash / plugin:skill / directory-scoped" guidance).
 */
export const getSkillPrompt = memoizeAsync(
  async (_cwd: string): Promise<string> =>
    `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>", they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Set \`skill\` to the exact name of an available skill (no leading slash). For plugin-namespaced skills use the fully qualified \`plugin:skill\` form.
- Set \`args\` to pass optional arguments.
- Some skills are scoped to a directory: their name is prefixed with the directory (e.g. \`apps/web:deploy\`) and their description says which directory they apply to. When a skill name has both a scoped and an unscoped variant, pick by the files you are working on: if the files are under a variant's directory, invoke that variant (most specific directory wins); otherwise invoke the unscoped one.

Important:
- Available skills are listed in system-reminder messages in the conversation
- Only invoke a skill that appears in that list, or one the user explicitly typed as \`/<name>\` in their message. Never guess or invent a skill name from training data; otherwise do not call this tool
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <${SKILL_REMINDER_TAG}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`,
)

// ---------------------------------------------------------------------------
// Tool object
// ---------------------------------------------------------------------------

// 2.1.183: SkillTool = lut = pi({...}) @393151-393367
export const SkillTool: Tool<InputSchema, Output> = buildTool({
  name: SKILL_TOOL_NAME, // @393152
  searchHint: 'invoke a slash-command skill', // @393153
  maxResultSizeChars: 100_000, // @393158 — 1e5

  // @393154-393157 — hidden when slash commands are disabled.
  isEnabled(): boolean {
    if (slashCommandsDisabled()) return false
    return true
  },

  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },

  // @393165 — `Execute skill: <name>` (used as the short tool-call label).
  description: async ({ skill }) => `Execute skill: ${skill}`,

  // @393166 — FTn(Sc()); Sc() resolves the project root cwd.
  prompt: async () => getSkillPrompt(getProjectRoot()),

  // @393167 — backseat classifier sees the skill name (downstream tool calls from
  // the expanded prompt are classified separately, so the name alone suffices).
  toAutoClassifierInput: ({ skill }) => skill ?? '',

  /**
   * validateInput — @393168-393248. Strips a leading slash, then runs a cascade of
   * guards, each emitting `Me("skill_invoke", <reason>)` telemetry before returning
   * a `{ result:false, message, errorCode }`. Error strings are quoted verbatim.
   * (`o` below is the normalized command name; `mH` is the literal "Skill".)
   */
  async validateInput({ skill }, context): Promise<ValidationResult> {
    const trimmed = skill.trim()
    // @393170-393174 — empty name.
    if (!trimmed) {
      recordSkillInvokeError('skill_invoke_empty_name')
      return { result: false, message: `Invalid skill format: ${skill}`, errorCode: 1 }
    }

    const hasLeadingSlash = trimmed.startsWith('/')
    if (hasLeadingSlash) logEvent('tengu_skill_tool_slash_prefix', {}) // @393176
    const name = hasLeadingSlash ? trimmed.substring(1) : trimmed

    // @393179-393182 — if remote skill search is on (N0e()), pre-fetch/materialize
    // and remember any download failure reason for the not-materialized branch.
    let materializeFailureReason: string | undefined
    if (isRemoteSkillSearchEnabled()) {
      const result = await ensureSkillMaterialized(name) // p2n(o)
      if (!result.ok) materializeFailureReason = result.reason
    }

    // @393183-393185 — allowlist (only when not already inside an agent), and the
    // resolved command object from the full command set.
    const allowlist = context.agentId === undefined ? getSkillAllowlist() : undefined // D6()
    const commands = await getAllSkillCommands(context) // oco(t)
    const command = findSkillCommand(name, commands) // gE(o, a)

    // @393186-393190 — skill not materialized (download failed) AND it isn't a
    // usable local fallback. errorCode 10.
    if (materializeFailureReason !== undefined && (!command || isRemotePlaceholder(command))) {
      recordSkillInvokeError('skill_invoke_not_materialized')
      return {
        result: false,
        message: `Skill ${name} could not be downloaded (${materializeFailureReason}). Proceed without it.`,
        errorCode: 10,
      }
    }

    // @393191-393201 — unknown skill. Suggest a near match via edit-distance <= 2.
    if (!command) {
      const suggestion = nearestSkillName(name, commands, { maxEditDistance: 2 }) // Dct(...)
      recordSkillInvokeError('skill_invoke_not_found')
      return {
        result: false,
        message: suggestion
          ? `Unknown skill: ${name}. Did you mean ${suggestion}?`
          : `Unknown skill: ${name}`,
        errorCode: 2,
      }
    }

    // @393202-393211 — recursion guard: a fork-context skill cannot re-invoke
    // itself from inside the very fork it spawned. errorCode 9.
    if (
      command.type === 'prompt' &&
      command.context === 'fork' &&
      context.options.spawnedBySkill === skillForkKey(command)
    ) {
      recordSkillInvokeError('skill_invoke_fork_recursion')
      logEvent('tengu_skill_tool_fork_recursion_blocked', {})
      return {
        result: false,
        message: `Skill ${name} is already executing in this forked context — you are the subagent running it. Execute the instructions in the skill body directly instead of re-invoking the ${SKILL_TOOL_NAME} tool.`,
        errorCode: 9,
      }
    }

    // @393212-393220 — skill opted out of model invocation. errorCode 4.
    if (command.disableModelInvocation && !isSkillExplicitlyAllowed(name, context)) {
      recordSkillInvokeError('skill_invoke_model_disabled')
      return {
        result: false,
        message: `Skill ${name} cannot be used with ${SKILL_TOOL_NAME} tool due to disable-model-invocation`,
        errorCode: 4,
      }
    }

    // @393221-393225 — session allowlist enforcement. errorCode 8.
    if (allowlist !== undefined && filterSkillsByAllowlist([command], allowlist).length === 0) {
      recordSkillInvokeError('skill_invoke_not_allowlisted')
      return {
        result: false,
        message: `Skill ${name} is not in this session's skills allowlist`,
        errorCode: 8,
      }
    }

    // @393226-393236 — bundled/overrides disabled for model invocation. errorCode 7.
    // The trailing message clause names the exact mechanism that disabled it.
    const invocability = skillModelInvocability(command) // BAe(l)
    if (invocability === 'off' || (invocability === 'user-invocable-only' && !isSkillExplicitlyAllowed(name, context))) {
      const config = getGlobalConfig()
      const isBundled = isBundledSkill(command, config) // u2n(l, u)
      const override = config.skillOverrides?.[command.name]
      const hasExplicitOverride = override === 'user-invocable-only' || override === 'off'
      recordSkillInvokeError(
        isBundled && !hasExplicitOverride
          ? 'skill_invoke_bundled_skills_disabled'
          : 'skill_invoke_override_disabled',
      )
      const bundledClause =
        'by the disableBundledSkills setting or CLAUDE_CODE_DISABLE_BUNDLED_SKILLS env var'
      const mechanism = isBundled
        ? hasExplicitOverride
          ? `${bundledClause}, and by an explicit skillOverrides entry`
          : bundledClause
        : 'in skillOverrides settings'
      return {
        result: false,
        message: `Skill ${name} is disabled for model invocation ${mechanism}`,
        errorCode: 7,
      }
    }

    // @393237-393247 — wrong command kind: a UI (local-jsx) or built-in CLI command
    // can't be model-invoked through the Skill tool. errorCode 5.
    if (command.type !== 'prompt') {
      const kindLabel = command.type === 'local-jsx' ? 'UI' : 'built-in CLI'
      recordSkillInvokeError('skill_invoke_not_prompt_type')
      return {
        result: false,
        message: `${name} is a ${kindLabel} command, not a skill. Ask the user to run /${name} themselves — it cannot be invoked via the ${SKILL_TOOL_NAME} tool.`,
        errorCode: 5,
      }
    }

    return { result: true } // @393248
  },

  /**
   * checkPermissions — @393250-393304. Normalizes the name, then evaluates rules:
   * deny first, then allow, then an auto-allow for "safe" prompt skills, else ask
   * (with addRules suggestions for both the exact name and the `name:*` prefix).
   * `ruleMatches` supports `:*` and ` *` wildcard suffixes.
   */
  async checkPermissions({ skill, args }, context): Promise<PermissionDecision> {
    const trimmed = skill.trim()
    const name = trimmed.startsWith('/') ? trimmed.substring(1) : trimmed
    const permissionContext = getToolPermissionContext(context) // Br(n)
    const commands = await getAllSkillCommands(context)
    const command = findSkillCommand(name, commands)

    // @393256-393264 — a rule matches if equal to the normalized name, or its
    // wildcard prefix (`prefix:*` / `prefix *`) is a prefix of the name.
    const ruleMatches = (rawRule: string): boolean => {
      const rule = rawRule.startsWith('/') ? rawRule.substring(1) : rawRule
      if (rule === name) return true
      if (rule.endsWith(':*') || rule.endsWith(' *')) {
        return name.startsWith(rule.slice(0, -2))
      }
      return false
    }

    // @393265-393272 — deny rules win.
    for (const [ruleContent, rule] of getRuleByContentsForTool(permissionContext, SkillTool, 'deny')) {
      if (ruleMatches(ruleContent)) {
        return {
          behavior: 'deny',
          message: 'Skill execution blocked by permission rules',
          decisionReason: { type: 'rule', rule },
        }
      }
    }

    // @393273-393280 — allow rules.
    for (const [ruleContent, rule] of getRuleByContentsForTool(permissionContext, SkillTool, 'allow')) {
      if (ruleMatches(ruleContent)) {
        return {
          behavior: 'allow',
          updatedInput: { skill, args },
          decisionReason: { type: 'rule', rule },
        }
      }
    }

    // @393281-393282 — auto-allow a prompt skill that exposes only safe properties.
    if (command?.type === 'prompt' && skillHasOnlySafeProperties(command)) {
      return { behavior: 'allow', updatedInput: { skill, args }, decisionReason: undefined }
    }

    // @393283-393304 — default: ask, offering exact + prefix allow-rule suggestions.
    const suggestions = [
      {
        type: 'addRules' as const,
        rules: [{ toolName: SKILL_TOOL_NAME, ruleContent: name }],
        behavior: 'allow' as const,
        destination: 'localSettings' as const,
      },
      {
        type: 'addRules' as const,
        rules: [{ toolName: SKILL_TOOL_NAME, ruleContent: `${name}:*` }],
        behavior: 'allow' as const,
        destination: 'localSettings' as const,
      },
    ]
    return {
      behavior: 'ask',
      message: `Execute skill: ${name}`,
      decisionReason: undefined,
      suggestions,
      updatedInput: { skill, args },
      metadata: command ? { command } : undefined,
    }
  },

  /**
   * call — @393306-393367+. Behavior summary (source-anchored):
   *   1. @393309-393313 — record the active skill in `context.options.activeSkill`
   *      (the fork key once resolved), so nested invocations can detect recursion.
   *   2. @393314 — register plugin attribution for plugin-sourced skills ($9(repo)).
   *   3. @393315-393320 — FORK skills (`type:"prompt" && context:"fork"`) run in an
   *      isolated sub-agent via `sCp(...)`, restoring activeSkill in `finally`; the
   *      ToolResult is `{ success, commandName, status:"forked", agentId, result }`.
   *   4. @393321-393324 — otherwise expand the skill via the dynamically-imported
   *      `processPromptSlashCommand(name, args ?? "", commands, context)`; if it
   *      reports `!shouldQuery`, emit `Me("skill_invoke","skill_invoke_process_failed")`
   *      and throw `new Error("Command processing failed")`.
   *   5. @393325-393365 — emit `tengu_skill_tool_invocation` telemetry
   *      (command_name, _PROTO_skill_name, execution_context:"inline",
   *      invocation_trigger: depth>0 ? "nested-skill" : "claude-proactive",
   *      query_depth, parent_agent_id, plugin/source fields).
   *   6. The inline ToolResult is `{ success:true, commandName, allowedTools?, model }`
   *      plus tagged `newMessages` (the expanded prompt) and a `contextModifier` that
   *      folds in allowedTools / model override / effort. (See 2.1.88 SkillTool.ts
   *      call() for the contextModifier shape — unchanged in spirit.)
   *
   * helper: sCp @393317 — forked-skill runner (returns status:"forked").
   * helper: processPromptSlashCommand (dynamic import @393321) — slash-command expansion.
   * helper: jet @393331 — sanitized-name/hash builder for telemetry.
   */
  async call({ skill, args }, context, canUseTool, parentMessage, onProgress?): Promise<ToolResult<Output>> {
    // Summarized — see the behavior contract above. The load-bearing branch is the
    // fork-vs-inline split; both paths are reconstructed at contract level in the
    // 2.1.88 mirror (executeForkedSkill / processPromptSlashCommand) and re-verified
    // against @393306-393367 of the 2.1.183 bundle.
    throw new Error('reconstructed contract — see call() behavior summary above')
  },

  // mapToolResultToToolResultBlockParam + renderers follow (Skill.md property keys):
  // renderToolResultMessage, renderToolUseMessage, renderToolUseProgressMessage,
  // renderToolUseRejectedMessage, renderToolUseErrorMessage.
} satisfies ToolDef<InputSchema, Output>)

// ---------------------------------------------------------------------------
// Helper declarations (summarized — bundle-anchored, not reconstructed here)
// ---------------------------------------------------------------------------

declare function getProjectRoot(): string // Sc()
declare function getAllSkillCommands(context: ToolUseContext): Promise<unknown[]> // oco(t)
declare function findSkillCommand(name: string, commands: unknown[]): any // gE(o, a)
declare function getSkillAllowlist(): unknown // D6()
declare function isRemoteSkillSearchEnabled(): boolean // N0e()
declare function ensureSkillMaterialized(name: string): Promise<{ ok: boolean; reason?: string }> // p2n(o)
declare function isRemotePlaceholder(command: unknown): boolean // r2a(l)
declare function nearestSkillName(name: string, commands: unknown[], opts: { maxEditDistance: number }): string | undefined // Dct(...)
declare function skillForkKey(command: unknown): unknown // _0e(l)
declare function isSkillExplicitlyAllowed(name: string, context: ToolUseContext): boolean // f2a(o, t)
declare function filterSkillsByAllowlist(commands: unknown[], allowlist: unknown): unknown[] // uae([l], i)
declare function skillModelInvocability(command: unknown): 'off' | 'user-invocable-only' | string // BAe(l)
declare function isBundledSkill(command: unknown, config: unknown): boolean // u2n(l, u)
declare function getGlobalConfig(): any // jr()
declare function skillHasOnlySafeProperties(command: unknown): boolean // cCp(a)
declare function getToolPermissionContext(context: ToolUseContext): unknown // Br(n)
declare function getRuleByContentsForTool(ctx: unknown, tool: unknown, behavior: 'deny' | 'allow'): Map<string, unknown> // jY(s, lut, ...)
