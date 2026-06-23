/**
 * PlanModeTools — readable-source reconstruction of the plan-mode tool pair
 * (EnterPlanMode + ExitPlanMode) as it ships in Claude Code v2.1.183.
 *
 * These two deferred tools form the "Plan → Approve → Implement" handshake:
 *   - EnterPlanMode flips the session into the `"plan"` permission mode (a
 *     read-only exploration phase) by pushing a `setMode → plan` permission-
 *     context update; it cannot be called from a subagent (plan mode must
 *     never become an unexitable trap), and re-injects a 6-step read-only
 *     workflow reminder into its tool_result.
 *   - ExitPlanMode is the approval handshake. The plan is read FROM DISK (never
 *     a tool parameter); it rejects calls made outside plan mode, asks the user
 *     "Exit plan mode?", forks a required-plan-mode teammate's plan to the
 *     team-lead mailbox, runs an auto-mode circuit-breaker fallback, and
 *     restores the saved prePlanMode atomically. Its tool_result has four
 *     verbatim content branches.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   :221314            A7 = "EnterPlanMode" (name const)
 *   :152252-152253     yx / WM = "ExitPlanMode" (two aliases)
 *   :392179-392191     jwp() — EnterPlanMode "What Happens" prompt fragment (shell-alias branch)
 *   :392192-392272     Gwp()/BUa() — EnterPlanMode prompt body
 *   :392327-392392     a2n — EnterPlanMode tool object (schema/call/mapToolResult)
 *   :392394-392402     nco — PlanPreconditionError class
 *   :392403-392426     VUa — ExitPlanMode prompt text
 *   :392570-392607     eCp/ZUa/jcy/tCp — ExitPlanMode in/out schemas
 *   :392608-392807     Ij — ExitPlanMode tool object (validate/permissions/call/mapToolResult)
 *
 * 2.1.88 convention mirror: src/tools/EnterPlanModeTool/EnterPlanModeTool.ts,
 *                           src/tools/ExitPlanModeTool/ExitPlanModeV2Tool.ts
 * 2.1.156 scaffold: 12_plan_mode/README.md (+ enter_plan_mode_tool.md / exit_plan_mode_tool.md)
 *
 * Cross-validation note: every quoted string below (prompts, the 6-step
 * reminder, the validateInput error, "Exit plan mode?", the four ExitPlanMode
 * result branches) was read verbatim from the 2.1.183 bundle and matches the
 * extracted assets/tools/{EnterPlanMode,ExitPlanMode}.md. NOTE vs the 2.1.88
 * mirror: the 2.1.183 isEnabled gate dropped the KAIROS feature() predicate for
 * a pure `channels active && non-interactive` capability gate; the teammate
 * detection moved from `isTeammate()` to the `em()` agent/team auto-approve
 * predicate; the validateInput error wording was rewritten; and the default
 * result-branch team-hint now suggests the **Agent** tool (vs = "Agent",
 * @149939) for spawning named teammates, NOT TeamCreate (removed in 2.1.178).
 */

import { z } from 'zod/v4'
import {
  buildTool,
  toolMatchesName,
  type Tool,
  type ToolDef,
} from '../Tool.js'
import { lazySchema } from '../../utils/lazySchema.js'

// ---------------------------------------------------------------------------
// Name constants
// ---------------------------------------------------------------------------

// 2.1.183: ENTER_PLAN_MODE_TOOL_NAME = A7 @cli_inner_pretty.js:221314
export const ENTER_PLAN_MODE_TOOL_NAME = 'EnterPlanMode'

// 2.1.183: EXIT_PLAN_MODE_TOOL_NAME = yx / WM @cli_inner_pretty.js:152252-152253
// Two aliases for the same string: `yx` is referenced inside EnterPlanMode's
// reminder ("use ExitPlanMode to present your plan"); `WM` is the tool's `name`.
export const EXIT_PLAN_MODE_TOOL_NAME = 'ExitPlanMode'

// Referenced by name from the prompts/reminders below:
//   AskUserQuestion (Ff = "AskUserQuestion", @221315)
//   Agent           (vs = "Agent", @149939) — used in the team-hint
import { ASK_USER_QUESTION_TOOL_NAME } from '../AskUserQuestionTool/constants.js'
import { AGENT_TOOL_NAME } from '../AgentTool/constants.js'

// ---------------------------------------------------------------------------
// Cross-module helpers (summarized; obf names anchored to the 2.1.183 bundle).
// These live outside the tool files but are load-bearing for plan-mode coupling.
// ---------------------------------------------------------------------------

// helper: Br @460389 — getAppState()/toolPermissionContext accessor (context → state)
import { getAppState } from '../../bootstrap/state.js'
// helper: Ode @3489 — handlePlanModeTransition(prevMode, nextMode): toggles
//   Ot.needsPlanModeExitAttachment when crossing into/out of "plan".
import { handlePlanModeTransition } from '../../bootstrap/state.js'
// helper: aut @586696 — prepareContextForPlanMode(ctx): snapshots current mode
//   into prePlanMode (+ auto-mode classifier prep) BEFORE setMode runs.
import { prepareContextForPlanMode } from '../../utils/permissions/permissionSetup.js'
// helper: Yh @233366 — applyPermissionUpdate(ctx, update)
import { applyPermissionUpdate } from '../../utils/permissions/PermissionUpdate.js'
// helper: xP @574059 — getPlanFilePath(agentId): `<slug>.md` or `<slug>-agent-<id>.md`
// helper: kP @574064 — getPlan(agentId): readFileSync of the plan file (or undefined)
// helper: l2n @574158 — persistFileSnapshotIfRemote(): re-snapshots plan for CCR/remote
import {
  getPlanFilePath,
  getPlan,
  persistFileSnapshotIfRemote,
} from '../../utils/plans.js'
// helper: qb @3665 — getAllowedChannels(): the `--channels` allow-list
// helper: xr @3151 — isNonInteractive(): !Ot.isInteractive
import { getAllowedChannels, isNonInteractive } from '../../bootstrap/state.js'
// helper: em @103466 — agent/team auto-approve predicate:
//   `if (Pk()) return true; return !!(currentTeammate?.agentId && currentTeammate?.teamName)`
//   (Pk @103394 = active in-process teammate context). Used to bypass the
//   approval UI for teammates.
import { isAutoApprovedTeammateContext } from '../../utils/teammate.js'
// helper: gwt @103519 — isPlanModeRequired(): planModeRequired for the current
//   teammate / CLAUDE_CODE_PLAN_MODE_REQUIRED env.
import { isPlanModeRequired } from '../../utils/teammate.js'
// helper: ih @103455 getAgentName, zp @103460 getTeamName,
//         bQ @103172 formatAgentId, TYe @103183 generateRequestId
import {
  getAgentName,
  getTeamName,
  formatAgentId,
  generateRequestId,
} from '../../utils/agentId.js'
// helper: $A @<writeToMailbox> — writeToMailbox(target, message, teamName)
import { writeToMailbox } from '../../utils/teammateMailbox.js'
// helper: BBa @387597 findInProcessTeammateTaskId, ilo @387601 setAwaitingPlanApproval
import {
  findInProcessTeammateTaskId,
  setAwaitingPlanApproval,
} from '../../utils/inProcessTeammateHelpers.js'
// helper: k6 @3480 setHasExitedPlanMode, kre @3486 setNeedsPlanModeExitAttachment,
//         fU @3496 setNeedsAutoModeExitAttachment, ryt @3477 hasExitedPlanModeInSession
import {
  setHasExitedPlanMode,
  setNeedsPlanModeExitAttachment,
  setNeedsAutoModeExitAttachment,
  hasExitedPlanModeInSession,
} from '../../bootstrap/state.js'
// helper: EAe @193935 — logPermissionModeChanged({from,to,trigger}) telemetry
import { logPermissionModeChanged } from '../../utils/permissions/transition.js'
// helper: Sl @293831 isAgentSwarmsEnabled; Rc @149965 toolMatchesName (re-exported above)
import { isAgentSwarmsEnabled } from '../../utils/agentSwarmsEnabled.js'
// Lazy module (transcript-classifier / auto-mode gate) loaded inside call():
//   wce  (Fte)  → autoModeState  : isAutoModeActive / setAutoModeActive
//   c2n  (l_)   → permissionSetup: isAutoModeGateEnabled / getAutoModeUnavailableReason /
//                getAutoModeUnavailableNotification / stripDangerousPermissionsForAutoMode /
//                restoreDangerousPermissions
// helper: ci @<fs writer> file-system write; Ne @140 normalize-for-analytics;
//         G @<logEvent>; aLe/xt/Ib plan-path roots.

// ===========================================================================
// EnterPlanMode
// ===========================================================================

// 2.1.183: EnterPlanMode inputSchema = Wwp @cli_inner_pretty.js:392327
// Parameterless: pure side-effect tool (no input).
const enterInputSchema = lazySchema(() => z.strictObject({})) // @392327
type EnterInputSchema = ReturnType<typeof enterInputSchema>

// 2.1.183: EnterPlanMode outputSchema = qwp @cli_inner_pretty.js:392328
const enterOutputSchema = lazySchema(() =>
  z.object({
    message: z
      .string()
      .describe('Confirmation that plan mode was entered'), // @392328
  }),
)
type EnterOutputSchema = ReturnType<typeof enterOutputSchema>
export type EnterOutput = z.infer<EnterOutputSchema>

/**
 * 2.1.183: getEnterPlanModeToolPrompt = Gwp/BUa @cli_inner_pretty.js:392192-392272
 *
 * The "What Happens in Plan Mode" section is spliced in via `jwp()` (@392179)
 * whose step 1 has a shell-alias branch: interactive bash sessions
 * (`Qw() && Su()`) see "using `find`/Glob, `grep`/Grep, and Read"; otherwise
 * just "Glob, Grep, and Read".
 */
function getWhatHappensInPlanMode(interactiveBash: boolean): string {
  // 2.1.183: jwp @cli_inner_pretty.js:392179-392191
  const exploreTools = interactiveBash
    ? '`find`/Glob, `grep`/Grep, and Read' // @392183 (Qw() && Su() branch)
    : 'Glob, Grep, and Read' // @392183 (else branch)
  return `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using ${exploreTools}
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${ASK_USER_QUESTION_TOOL_NAME} if you need to clarify approaches
6. Exit plan mode with ${EXIT_PLAN_MODE_TOOL_NAME} when ready to implement

`
}

function getEnterPlanModeToolPrompt(interactiveBash: boolean): string {
  // @392193 — head verbatim
  return `Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

## When to Use This Tool

**Prefer using EnterPlanMode** for implementation tasks unless they're simple. Use it when ANY of these conditions apply:

1. **New Feature Implementation**: Adding meaningful new functionality
   - Example: "Add a logout button" - where should it go? What should happen on click?
   - Example: "Add form validation" - what rules? What error messages?

2. **Multiple Valid Approaches**: The task can be solved in several different ways
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

3. **Code Modifications**: Changes that affect existing behavior or structure
   - Example: "Update the login flow" - what exactly should change?
   - Example: "Refactor this component" - what's the target architecture?

4. **Architectural Decisions**: The task requires choosing between patterns or technologies
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

5. **Multi-File Changes**: The task will likely touch more than 2-3 files
   - Example: "Refactor the authentication system"
   - Example: "Add a new API endpoint with tests"

6. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

7. **User Preferences Matter**: The implementation could reasonably go multiple ways
   - If you would use ${ASK_USER_QUESTION_TOOL_NAME} to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Agent tool with explore agent instead)

${getWhatHappensInPlanMode(interactiveBash)}## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- Requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

User: "Add a delete button to the user profile"
- Seems simple but involves: where to place it, confirmation dialog, API call, error handling, state updates

User: "Update the error handling in the API"
- Affects multiple files, user should approve the approach

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- If unsure whether to use it, err on the side of planning - it's better to get alignment upfront than to redo work
- Users appreciate being consulted before significant changes are made to their codebase
`
}

// 2.1.183: EnterPlanModeTool = a2n @cli_inner_pretty.js:392329-392392
export const EnterPlanModeTool: Tool<EnterInputSchema, EnterOutput> = buildTool({
  name: ENTER_PLAN_MODE_TOOL_NAME, // @392330
  searchHint: 'switch to plan mode to design an approach before coding', // @392331
  maxResultSizeChars: 100_000, // @392332 (1e5)

  async description() {
    // @392334
    return 'Requests permission to enter plan mode for complex tasks requiring exploration and design'
  },
  async prompt() {
    // @392337 → BUa() → Gwp(). `interactiveBash` is resolved at prompt-build
    // time from the live bash/shell state (Qw() && Su() @392183).
    return getEnterPlanModeToolPrompt(/* interactiveBash */ resolveInteractiveBash())
  },

  get inputSchema() {
    return enterInputSchema()
  },
  get outputSchema() {
    return enterOutputSchema()
  },

  userFacingName() {
    return '' // @392346
  },
  shouldDefer: true, // @392348 — deferred (ToolSearch-loaded)

  // 2.1.183: @392349-392352 — pure capability gate (KAIROS feature() predicate
  // dropped vs 2.1.88). Disabled only when there ARE agent channels AND the
  // session is non-interactive — i.e. no terminal to host the exit dialog, so
  // entry must be blocked too (plan mode is never a trap). isEnabled is kept in
  // lockstep with ExitPlanMode below.
  isEnabled() {
    if (getAllowedChannels().length > 0 && isNonInteractive()) return false // @392350
    return true // @392351
  },
  isConcurrencySafe() {
    return true // @392353
  },
  isReadOnly() {
    return true // @392356
  },

  // render helpers: renderToolUseMessage UUa (@392281 → null),
  //   renderToolResultMessage jUa (@392284, "Entered plan mode"),
  //   renderToolUseRejectedMessage GUa (@392301, "User declined to enter plan mode")
  renderToolUseMessage: () => null,
  renderToolResultMessage,
  renderToolUseRejectedMessage,

  // 2.1.183: call = a2n.call @cli_inner_pretty.js:392362-392374
  async call(_input, context) {
    // @392363 — subagents cannot enter plan mode: the only exit (ExitPlanMode's
    // approval dialog) needs a human at a terminal; a headless subagent would
    // be trapped.
    if (context.agentId) {
      throw new Error('EnterPlanMode tool cannot be used in agent contexts')
    }

    // @392365 — record prior mode so exit can clear/raise the exit-attachment flag.
    handlePlanModeTransition(getAppState(context).toolPermissionContext.mode, 'plan')

    // @392366 — PLAN-MODE COUPLING: push a `setMode → plan` permission-context
    // update (session scope). prepareContextForPlanMode runs FIRST (snapshots
    // prePlanMode + auto-mode prep) so it sees the pre-plan mode; if setMode ran
    // first, the snapshot guard would short-circuit and restore-on-exit would break.
    context.setToolPermissionContext(prev =>
      applyPermissionUpdate(prepareContextForPlanMode(prev), {
        type: 'setMode',
        mode: 'plan',
        destination: 'session',
      }),
    )

    // @392369-392370
    return {
      data: {
        message:
          'Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.',
      },
    }
  },

  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:392375-392391
  // Appends the verbatim 6-step read-only workflow reminder. `${Ff}` = the
  // AskUserQuestion name (step 4), `${yx}` = the ExitPlanMode name (step 6).
  mapToolResultToToolResultBlockParam({ message }, toolUseId) {
    return {
      type: 'tool_result',
      content: `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use ${ASK_USER_QUESTION_TOOL_NAME} if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ${EXIT_PLAN_MODE_TOOL_NAME} to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`, // @392378-392388
      tool_use_id: toolUseId,
    }
  },
} satisfies ToolDef<EnterInputSchema, EnterOutput>)

// ===========================================================================
// ExitPlanMode
// ===========================================================================

/**
 * 2.1.183: PlanPreconditionError = nco @cli_inner_pretty.js:392394-392402
 * Thrown by the team-lead approval branch when a required-plan-mode teammate
 * calls ExitPlanMode with no plan written to disk.
 */
export class PlanPreconditionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlanPreconditionError' // @392399
  }
}

/**
 * 2.1.183: allowedPromptSchema = eCp @cli_inner_pretty.js:392570-392574
 * Prompt-based permission element (shipped-but-off in this build — the
 * addRules push is gated by an isPromptBasedPermissionsEnabled() that returns
 * false, so `allowedPrompts` is currently a no-op).
 */
const allowedPromptSchema = lazySchema(() =>
  z.object({
    tool: z.enum(['Bash']).describe('The tool this prompt applies to'), // @392572
    prompt: z
      .string()
      .describe(
        'Semantic description of the action, e.g. "run tests", "install dependencies"',
      ), // @392573
  }),
)
export type AllowedPrompt = z.infer<ReturnType<typeof allowedPromptSchema>>

// 2.1.183: ExitPlanMode inputSchema = ZUa @cli_inner_pretty.js:392576-392583
// `.passthrough()` so the runtime-injected `plan`/`planFilePath` fields survive.
const exitInputSchema = lazySchema(() =>
  z
    .strictObject({
      allowedPrompts: z
        .array(allowedPromptSchema())
        .optional()
        .describe(
          'Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.',
        ), // @392580-392582
    })
    .passthrough(),
)
type ExitInputSchema = ReturnType<typeof exitInputSchema>

/**
 * 2.1.183: _sdkInputSchema = jcy @cli_inner_pretty.js:392585-392589
 * The SDK/hooks see the NORMALIZED input — `plan`/`planFilePath` are injected
 * by normalizeToolInput FROM DISK before the tool runs. The internal
 * `exitInputSchema` omits them (the plan is never a true tool parameter).
 */
export const _sdkInputSchema = lazySchema(() =>
  exitInputSchema().extend({
    plan: z
      .string()
      .optional()
      .describe('The plan content (injected by normalizeToolInput from disk)'), // @392587
    planFilePath: z
      .string()
      .optional()
      .describe('The plan file path (injected by normalizeToolInput)'), // @392588
  }),
)

// 2.1.183: ExitPlanMode outputSchema = tCp @cli_inner_pretty.js:392591-392606
const exitOutputSchema = lazySchema(() =>
  z.object({
    plan: z.string().nullable().describe('The plan that was presented to the user'), // @392593
    isAgent: z.boolean(), // @392594
    filePath: z.string().optional().describe('The file path where the plan was saved'), // @392595
    hasTaskTool: z
      .boolean()
      .optional()
      .describe('Whether the Agent tool is available in the current context'), // @392596
    planWasEdited: z
      .boolean()
      .optional()
      .describe(
        'True when the user edited the plan (CCR web UI or Ctrl+G); determines whether the plan is echoed back in tool_result',
      ), // @392597-392601
    awaitingLeaderApproval: z
      .boolean()
      .optional()
      .describe('When true, the teammate has sent a plan approval request to the team leader'), // @392602-392604
    requestId: z
      .string()
      .optional()
      .describe('Unique identifier for the plan approval request'), // @392605
  }),
)
type ExitOutputSchema = ReturnType<typeof exitOutputSchema>
export type ExitOutput = z.infer<ExitOutputSchema>

// 2.1.183: ExitPlanMode prompt text = VUa @cli_inner_pretty.js:392403-392426
const EXIT_PLAN_MODE_TOOL_PROMPT = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## When to Use This Tool
IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.

## Before Using This Tool
Ensure your plan is complete and unambiguous:
- If you have unresolved questions about requirements or approach, use AskUserQuestion first (in earlier phases)
- Once your plan is finalized, use THIS tool to request approval

**Important:** Do NOT use AskUserQuestion to ask "Is this plan okay?" or "Should I proceed?" - that's exactly what THIS tool does. ExitPlanMode inherently requests user approval of your plan.

## Examples

1. Initial task: "Search for and understand the implementation of vim mode in the codebase" - Do not use the exit plan mode tool because you are not planning the implementation steps of a task.
2. Initial task: "Help me implement yank mode for vim" - Use the exit plan mode tool after you have finished planning the implementation steps of the task.
3. Initial task: "Add a new feature to handle user authentication" - If unsure about auth method (OAuth, JWT, etc.), use AskUserQuestion first, then use exit plan mode tool after clarifying the approach.
`

// 2.1.183: ExitPlanModeTool = Ij @cli_inner_pretty.js:392608-392807
export const ExitPlanModeTool: Tool<ExitInputSchema, ExitOutput> = buildTool({
  name: EXIT_PLAN_MODE_TOOL_NAME, // @392609 (WM)
  searchHint: 'present plan for approval and start coding (plan mode only)', // @392610
  maxResultSizeChars: 100_000, // @392611

  async description() {
    return 'Prompts the user to exit plan mode and start coding' // @392613
  },
  async prompt() {
    return EXIT_PLAN_MODE_TOOL_PROMPT // @392616
  },

  get inputSchema() {
    return exitInputSchema()
  },
  get outputSchema() {
    return exitOutputSchema()
  },

  userFacingName() {
    return '' // @392625
  },
  shouldDefer: true, // @392627
  isConcurrencySafe() {
    return true // @392632
  },
  isReadOnly() {
    return false // @392635 — NOT read-only: it can write the (edited) plan to disk.
  },

  // 2.1.183: @392628-392631 — same capability gate as EnterPlanMode (lockstep).
  isEnabled() {
    if (getAllowedChannels().length > 0 && isNonInteractive()) return false // @392629
    return true // @392630
  },

  // 2.1.183: @392638-392641 — teammates need no LOCAL interaction (the lead
  // approves via mailbox, or voluntary plan mode exits locally without a dialog).
  requiresUserInteraction() {
    if (isAutoApprovedTeammateContext()) return false // @392639 (em())
    return true // @392640
  },

  // 2.1.183: validateInput @cli_inner_pretty.js:392642-392659
  // The deferred-tool list announces ExitPlanMode regardless of mode, so the
  // model can call it after approval. Reject BEFORE checkPermissions (no dialog)
  // when not actually in plan mode. Teammates bypass (their AppState may show
  // the leader's mode; em() is the real source).
  async validateInput(_input, context) {
    const { options } = context
    if (isAutoApprovedTeammateContext()) return { result: true } // @392644
    const mode = getAppState(context).toolPermissionContext.mode // @392645 (Br(t).mode)
    if (mode !== 'plan') {
      // @392648 — telemetry. Ne(mode) normalizes the mode for analytics.
      logEvent('tengu_exit_plan_mode_called_outside_plan', {
        model: options.mainLoopModel,
        mode: normalizeForAnalytics(mode),
        hasExitedPlanModeInSession: hasExitedPlanModeInSession(),
      })
      return {
        result: false,
        // @392655 — names EnterPlanMode (${A7}) in the recovery message.
        message: `You are not in plan mode. To enter plan mode, call the ${ENTER_PLAN_MODE_TOOL_NAME} tool first. If your plan was already approved, continue with implementation.`,
        errorCode: 1,
      }
    }
    return { result: true } // @392659
  },

  // 2.1.183: checkPermissions @cli_inner_pretty.js:392661-392664
  // Teammates auto-allow (no permission_request sent — call() handles routing).
  // Everyone else gets the "Exit plan mode?" approval dialog.
  async checkPermissions(input) {
    if (isAutoApprovedTeammateContext()) {
      return { behavior: 'allow', updatedInput: input } // @392662
    }
    return { behavior: 'ask', message: 'Exit plan mode?', updatedInput: input } // @392663
  },

  // render helpers: renderToolUseMessage zUa (@392427 → null),
  //   renderToolResultMessage KUa (@392430), renderToolUseRejectedMessage YUa (@392488)
  renderToolUseMessage: () => null,
  renderToolResultMessage: renderExitToolResultMessage,
  renderToolUseRejectedMessage: renderExitToolUseRejectedMessage,

  // 2.1.183: call = Ij.call @cli_inner_pretty.js:392668-392755 — the heart of plan exit.
  async call(input, context) {
    // @392671-392674 — lazily import the auto-mode modules (transcript-classifier
    // gate). autoModeState (wce/Fte): isAutoModeActive/setAutoModeActive.
    // permissionSetup (c2n/l_): isAutoModeGateEnabled / getAutoModeUnavailable* /
    // strip|restoreDangerousPermissions.
    const [autoModeState, permissionSetup] = await Promise.all([
      import('../../utils/permissions/autoModeState.js'),
      import('../../utils/permissions/permissionSetup.js'),
    ])

    const isAgent = !!context.agentId // @392675
    const filePath = getPlanFilePath(context.agentId) // @392676 (xP)
    // @392677 — CCR web UI may send an edited plan via updatedInput.plan; queryHelpers
    // full-replaces finalInput, so an empty {} means "no edit" → fall back to disk.
    const inputPlan =
      'plan' in input && typeof input.plan === 'string' ? input.plan : undefined
    const plan = inputPlan ?? getPlan(context.agentId) // @392678 (kP)

    // @392679-392685 — sync the edited plan to disk and re-snapshot (the api.ts
    // snapshot ran in normalizeToolInput, pre-permission, and captured the OLD plan).
    if (inputPlan !== undefined && filePath) {
      await getPlanFileSystem()
        .write(filePath, inputPlan)
        .catch(e =>
          logForDebugging(
            `Failed to persist plan to ${filePath}: ${
              e instanceof Error ? e.message : String(e)
            }`,
            { level: 'error' },
          ),
        )
      void persistFileSnapshotIfRemote() // @392685 (l2n)
    }

    // ---- TEAM-LEAD APPROVAL BRANCH -------------------------------------------
    // @392686-392707 — a required-plan-mode teammate does NOT exit locally; it
    // routes its plan to the team lead through a crash-safe mailbox file.
    if (isAutoApprovedTeammateContext() && isPlanModeRequired()) {
      if (!plan) {
        // @392688-392690
        throw new PlanPreconditionError(
          `No plan file found at ${filePath}. Please write your plan to this file before calling ExitPlanMode.`,
        )
      }
      const agentName = getAgentName() || 'unknown' // @392691 (ih)
      const teamName = getTeamName() // @392692 (zp)
      const requestId = generateRequestId(
        'plan_approval',
        formatAgentId(agentName, teamName || 'default'),
      ) // @392693 (TYe / bQ)
      const approvalRequest = {
        type: 'plan_approval_request',
        from: agentName,
        timestamp: new Date().toISOString(),
        planFilePath: filePath,
        planContent: plan,
        requestId,
      } // @392694-392701
      // @392702 — post to the "team-lead" mailbox ($A).
      await writeToMailbox(
        'team-lead',
        { from: agentName, text: jsonStringify(approvalRequest), timestamp: new Date().toISOString() },
        teamName,
      )
      // @392703-392705 — mark the in-process teammate's task as awaiting approval.
      const appState = context.getAppState()
      const taskId = findInProcessTeammateTaskId(agentName, appState)
      if (taskId) setAwaitingPlanApproval(taskId, context.taskRegistry, true)

      // @392706
      return {
        data: { plan, isAgent: true, filePath, awaitingLeaderApproval: true, requestId },
      }
    }

    // ---- AUTO-MODE CIRCUIT-BREAKER FALLBACK ----------------------------------
    // @392708-392730 — compute the fallback notification BEFORE mutating state.
    // If prePlanMode was "auto" but the auto-mode gate is now OFF (circuit
    // breaker / settings disable), restoring auto would launder away a tripped
    // breaker — so fall back to "default" and warn the user.
    let gateFallbackNotification: string | null = null
    {
      const prePlanRaw = getAppState(context).toolPermissionContext.prePlanMode ?? 'default' // @392710
      if (prePlanRaw === 'auto' && !(permissionSetup.isAutoModeGateEnabled() ?? false)) {
        const reason = permissionSetup.getAutoModeUnavailableReason() ?? 'circuit-breaker' // @392712
        gateFallbackNotification =
          permissionSetup.getAutoModeUnavailableNotification(reason) ?? 'auto mode unavailable' // @392713
        logForDebugging(
          `[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${prePlanRaw} but gate is off (reason=${reason}) — falling back to default on plan exit`,
          { level: 'warn' },
        ) // @392714-392717
      }
    }
    if (gateFallbackNotification) {
      // @392720-392730 — surfaced via the call's notification sink (`o` param).
      context.emitEvent?.({
        type: 'notification',
        notification: {
          key: 'auto-mode-gate-plan-exit-fallback',
          text: `plan exit → default · ${gateFallbackNotification}`, // @392725
          priority: 'immediate',
          color: 'warning',
          timeoutMs: 10_000,
        },
      })
    }

    // ---- MODE RESTORE --------------------------------------------------------
    // @392731-392750 — only act if still in plan mode (the permission flow may
    // already have set the mode). Restore prePlanMode atomically, reconcile the
    // dangerous-permission rules (strip when restoring to auto, restore otherwise).
    const ctx = getAppState(context).toolPermissionContext // @392731 (Br(t))
    if (ctx.mode === 'plan') {
      setHasExitedPlanMode(true) // @392733 (k6)
      setNeedsPlanModeExitAttachment(true) // @392733 (kre)

      let restoreMode = ctx.prePlanMode ?? 'default' // @392734
      // @392736 — gate-off → default (mirror of the fallback above).
      if (restoreMode === 'auto' && !(permissionSetup.isAutoModeGateEnabled() ?? false)) {
        restoreMode = 'default'
      }
      // @392737-392739 — isAutoModeActive() is the authoritative pre-restore signal.
      const finalRestoringAuto = restoreMode === 'auto'
      const autoWasUsedDuringPlan = autoModeState.isAutoModeActive() ?? false
      autoModeState.setAutoModeActive(finalRestoringAuto)
      if (autoWasUsedDuringPlan && !finalRestoringAuto) {
        setNeedsAutoModeExitAttachment(true) // @392739 (fU)
      }

      // @392741 — telemetry: permission_mode_changed (plan → restoreMode).
      logPermissionModeChanged({ from: 'plan', to: restoreMode, trigger: 'exit_plan_mode' })

      const restoringToAuto = restoreMode === 'auto' // @392742
      const hadStrippedDangerousRules = ctx.strippedDangerousRules // @392743
      // @392744-392749 — atomic context update: strip dangerous perms if
      // (re-)entering auto, restore them if leaving auto with stripped rules.
      context.setToolPermissionContext(prev => {
        let base = prev
        if (restoringToAuto) {
          base = permissionSetup.stripDangerousPermissionsForAutoMode(base) ?? base
        } else if (hadStrippedDangerousRules) {
          base = permissionSetup.restoreDangerousPermissions(base) ?? base
        }
        return { ...base, mode: restoreMode, prePlanMode: undefined }
      })
    }

    // @392751 — does the current tool pool include the Agent tool? (vs = "Agent").
    // Gated by isAgentSwarmsEnabled() (Sl). Drives the team-hint in the result.
    const hasTaskTool =
      isAgentSwarmsEnabled() &&
      context.options.tools.some(t => toolMatchesName(t, AGENT_TOOL_NAME))

    // @392752-392753
    return {
      data: {
        plan,
        isAgent,
        filePath,
        hasTaskTool: hasTaskTool || undefined,
        planWasEdited: inputPlan !== undefined || undefined,
      },
    }
  },

  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:392756-392806
  // FOUR verbatim content branches.
  mapToolResultToToolResultBlockParam(
    { isAgent, plan, filePath, hasTaskTool, planWasEdited, awaitingLeaderApproval, requestId },
    toolUseId,
  ) {
    // (1) Teammate awaiting leader approval — @392760-392777
    if (awaitingLeaderApproval) {
      return {
        type: 'tool_result',
        content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${requestId}`,
        tool_use_id: toolUseId,
      }
    }

    // (2) Agent/subagent approval — @392778-392783
    if (isAgent) {
      return {
        type: 'tool_result',
        content:
          'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: toolUseId,
      }
    }

    // (3) Empty plan — @392784-392789
    if (!plan || plan.trim() === '') {
      return {
        type: 'tool_result',
        content: 'User has approved exiting plan mode. You can now proceed.',
        tool_use_id: toolUseId,
      }
    }

    // (4) Default: approved plan echoed back under a `## Approved Plan:` heading
    // (the machine-parseable contract that the remote Ultraplan consumer
    // extractApprovedPlan string-matches). The team-hint (@392790-392794)
    // suggests spawning named teammates with the **Agent** tool (vs = "Agent")
    // when hasTaskTool is set.
    const teamHint = hasTaskTool
      ? `

If this plan can be broken down into multiple independent tasks, consider spawning named teammates with the ${AGENT_TOOL_NAME} tool (pass a \`name\`) to parallelize the work.`
      : ''
    return {
      type: 'tool_result',
      content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${teamHint}

## ${planWasEdited ? 'Approved Plan (edited by user)' : 'Approved Plan'}:
${plan}`, // @392797-392803
      tool_use_id: toolUseId,
    }
  },
} satisfies ToolDef<ExitInputSchema, ExitOutput>)

// ---------------------------------------------------------------------------
// Local glue referenced above (anchored to the bundle; kept as thin imports
// here so the tool bodies read like the original source).
// ---------------------------------------------------------------------------

// helper: Ne @140 — normalizeForAnalytics(value)
import { normalizeForAnalytics } from '../../services/analytics/metadata.js'
// helper: G @<logEvent> — analytics logEvent(name, metadata)
import { logEvent } from '../../services/analytics/index.js'
// helper: v @<logForDebugging>
import { logForDebugging } from '../../utils/debug.js'
// helper: Re @<jsonStringify>
import { jsonStringify } from '../../utils/slowOperations.js'
// helper: ci @<plan file-system writer>; getPlanFileSystem wraps it.
import { getPlanFileSystem } from '../../utils/plans.js'

// UI render helpers (UI.tsx in the 2.1.88 layout):
//   EnterPlanMode: jUa "Entered plan mode" (@392284), GUa "User declined to enter plan mode" (@392301)
//   ExitPlanMode:  KUa (@392430) "Exited plan mode" / "Plan submitted for team lead approval" /
//                  "User approved Claude's plan"; YUa (@392488) rejection
import {
  renderToolResultMessage,
  renderToolUseRejectedMessage,
} from '../EnterPlanModeTool/UI.js'
import {
  renderExitToolResultMessage,
  renderExitToolUseRejectedMessage,
} from '../ExitPlanModeTool/UI.js'

// helper: resolveInteractiveBash — Qw() && Su() (@392183): true only for
// interactive bash sessions, surfacing the `find`/`grep` shell aliases in the
// EnterPlanMode "What Happens" prompt.
import { resolveInteractiveBash } from '../../utils/shellAliases.js'
