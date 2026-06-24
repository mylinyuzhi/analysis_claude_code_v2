/**
 * AgentTool — the Agent tool def, now an Agent-tool-as-spawner (v2.1.183).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - Agent base input schema       (CDp) @423431-423444
 *   - Agent full input schema       (IDp) @423446-423477  (name / team_name / mode + isolation + cwd)
 *   - Served schema                 (zao) @423478-423481  (= IDp.omit({cwd}), drops run_in_background when restricted)
 *   - Agent output schema           (xDp) @423482-423504
 *   - Agent tool def                (f3n) @423505-424224   (prompt/name/inputSchema/outputSchema/call)
 *   - call() teammate-spawn routing       @423542-423591  (THE centerpiece of the v2.1.178 redesign)
 *   - second in-process background guard  @423653-423659  (selectedAgent.background === true)
 *   - agent-type-not-found selection      @423592-423651  (condensed — owned by subagent-execution unit)
 *   - filterAgentsByPermission      (gqa) @423337-423342
 *   - permission-mode enum          (zts/wM) @53815/53866
 *   - name regex (pDa) @362645 ; RESERVED "main" (LY) @362512 ; FORK type (_7="fork") @222272
 *   - tool factory (pi) @149995 ; tool names vs="Agent"/c9="Task" @149939-149940
 *
 * 2.1.88 ancestor mirrored: tools/AgentTool/AgentTool.tsx (schema layout, call() shape,
 *   `spawnTeammate` import from ../shared/spawnMultiAgent.js, `setAgentColor` from ./agentColorManager.js,
 *   buildTool/lazySchema/Zod idioms). The teammate ROUTING diverges — see below.
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md (§2 routing rewrite, §2.2 schema,
 *   §2.5 guards, §2.6 description suppression); _scout_dossier_agent_team.md §2.
 *
 * cross-val (re-read in the 183 bundle):
 *   - schema verbatim strings @423446-423477 (team_name = "Deprecated; ignored. The session has a
 *     single implicit team."; name describe + regex message + `"main" is reserved …` refinement).
 *   - call() routing locals @423542-423553: `_ = Sl() ? A.teamContext : void 0`, `b = !!c.teammateContext`,
 *     nested-teammate guard `(b || !!l1e()) && s`, background guard `b && o === !0`.
 *   - `x = t !== void 0 && Yut(t) === _7`, `L = x && I`, the decision `if (_ && s && !L)` @423573,
 *     spawn call shape @423574-423590 (NO team_name passed), result `{status:"teammate_spawned",...}`.
 *   - second bg guard @423653 `if (b && P.background === !0)`.
 *   - error CLASS names: oWe = AgentPreconditionError @423424, r3t = AgentTypeError @423412 (NOTE: the
 *     scaffold called oWe "TeammateSpawnError" — the live bundle's class name is AgentPreconditionError).
 *   - `l1e` is `getDynamicTeamContext` per the bundle's own export map @103428 (body @103447,
 *     returns module-var `$q`), NOT "getInProcessTeammateContext" as the scaffold guessed.
 *   - `UN` is isInProcessTeammate (body @103400: `GCr.getStore() !== void 0`); the scaffold §2.6
 *     guess "isWorkflowOrRestrictedContext" is WRONG — confirmed via the bundle export map @103420.
 */

import * as React from 'react'
import { z } from 'zod/v4'

import { buildTool, type ToolDef } from '../../Tool.js'
import { isCoordinatorMode } from '../../coordinator/coordinatorMode.js'
import { getToolPermissionContext } from '../../utils/permissions/toolPermissionContext.js'
import { permissionModeSchema } from '../../utils/permissions/PermissionMode.js'
import { lazySchema } from '../../utils/lazySchema.js'
import { logFeatureBad, logFeatureOk } from '../../services/analytics/index.js'
import { isAgentSwarmsEnabled } from '../../utils/agentSwarmsEnabled.js'
// 88 ancestor AgentTool.tsx imports these from their real homes:
//   import { getParentSessionId, isTeammate } from '../../utils/teammate.js';
//   import { isInProcessTeammate } from '../../utils/teammateContext.js';
// Bundle merges utils/teammate.ts + utils/teammateContext.ts into one obfuscated namespace
// (export map @cli_inner_pretty.js:103410-103435): getDynamicTeamContext=l1e (88 home teammate.ts),
// isInProcessTeammate=UN (88 home teammateContext.ts), isTeammate=em (88 home teammate.ts).
// getDynamicTeamContext (l1e, returns module-var $q) is NOT reconstructed in this tree — it lives
// in the bundle's teammate.ts identity cluster (export map @103428); kept EXTERNAL at its 88 home.
import { getDynamicTeamContext } from '../../utils/teammate.js'
// isInProcessTeammate (UN) was reconstructed into utils/agentContext.ts in this tree (88 split it
// into utils/teammateContext.ts; the bundle co-locates it with the TeammateContext factory @103400).
import { isInProcessTeammate } from '../../utils/agentContext.js'
// UNVERIFIED home module: the error classes oWe/r3t (AgentPreconditionError/AgentTypeError)
// are defined in the bundle right next to the Agent tool def (@cli_inner_pretty.js:423412-423429),
// and AGENT_NAME_RE (pDa @362645) / FORK_AGENT_TYPE (_7 @222272) / normalizeAgentType (Yut @472614)
// each live in separate obfuscated chunks. The original .ts module that re-exports them cannot be
// recovered from the bundle; grouping them under ./forkSubagent.js is a reconstruction guess
// (88 forkSubagent.ts exported FORK_SUBAGENT_TYPE='fork' + isForkSubagentEnabled, not these).
import {
  AGENT_NAME_RE,
  AgentPreconditionError,
  AgentTypeError,
  FORK_AGENT_TYPE,
  normalizeAgentType,
} from './forkSubagent.js'
// MAIN_RESERVED_NAME (LY="main" @cli_inner_pretty.js:362512) is a v2.1.178+ addition (not in the 88
// ancestor). In the bundle LY sits in the agent-message/XML-tag chunk (immediately after the
// <agent-message> wrapper Nen @362507-362511), NOT in the swarm-constants block (np..._lt @362636).
// SSOT in this tree: it is the reserved-name sibling of TEAM_LEAD_NAME, homed in utils/agentId.ts
// (matching SendMessageTool's import of MAIN_RESERVED_NAME from utils/agentId.js). (isTeammateSession=em
// is NOT used by f3n's call(), which branches on `!!ctx.teammateContext` + getDynamicTeamContext() —
// so it is not imported here.)
import { MAIN_RESERVED_NAME } from '../../utils/agentId.js'
import { resolveAgentModel } from '../../utils/model/agent.js'
import { setAgentColor } from './agentColorManager.js'
import { filterAgentsByPermission } from '../../utils/permissions/permissions.js'
// spawnTeammate (cqa) was reconstructed in this tree at utils/swarm/spawnTeammate.ts. (The genuine
// 88 layout defines it in tools/shared/spawnMultiAgent.ts; this tree relocated the spawner under
// utils/swarm/, so the specifier is repointed to the reconstructed home.)
import { spawnTeammate } from '../../utils/swarm/spawnTeammate.js'
import { buildAgentToolDescription } from './prompt.js'
import { AGENT_TOOL_NAME, LEGACY_AGENT_TOOL_NAME } from './constants.js'

// =====================================================================================
// SCHEMAS
// =====================================================================================

// 2.1.183: baseAgentSchema = CDp @cli_inner_pretty.js:423431
/**
 * Base Agent input (no multi-agent params). The `model` enum gained "fable" in 2.1.183
 * and the describe() now notes forks always inherit the parent model.
 */
const baseAgentSchema = lazySchema(() =>
  z.object({
    description: z.string().describe('A short (3-5 word) description of the task'), // @423433
    prompt: z.string().describe('The task for the agent to perform'), // @423434
    subagent_type: z
      .string()
      .optional()
      .describe('The type of specialized agent to use for this task'), // @423435
    model: z
      .enum(['sonnet', 'opus', 'haiku', 'fable']) // @423436 (note: "fable" added in 183)
      .optional()
      .describe(
        // verbatim @423439
        `Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent. Ignored for subagent_type: "fork" — forks always inherit the parent model.`,
      ),
    run_in_background: z
      .boolean()
      .optional()
      .describe(
        'Set to true to run this agent in the background. You will be notified when it completes.',
      ), // @423443
  }),
)

// 2.1.183: buildAgentInputSchema = IDp @cli_inner_pretty.js:423446
/**
 * Full Agent input = base + the multi-agent teammate fields (name / team_name / mode) + isolation + cwd.
 *
 * The three teammate fields are the heart of the v2.1.178 redesign:
 *   - `name`      : addressable teammate name. Regex-bounded, and refined to reject "main"
 *                   (which SendMessage now routes to the main conversation). A non-empty `name`
 *                   is the model's ONLY lever to request a teammate vs an ordinary subagent.
 *   - `team_name` : DEPRECATED & IGNORED. Kept in the schema purely so older prompts / cached
 *                   tool-uses that still pass it don't hard-fail Zod validation; the routing
 *                   (call(), below) never reads it. There is exactly one implicit session team.
 *   - `mode`      : permission mode for the spawned teammate (e.g. "plan" → plan_mode_required).
 *                   NOT new in 183 (it existed in 156); only its describe() wording is new.
 */
const buildAgentInputSchema = lazySchema(() => {
  const teammateFields = z.object({
    name: z
      .string()
      .regex(AGENT_NAME_RE, {
        // verbatim @423449
        message:
          'name must start with a letter or digit and contain only letters, digits, underscores, or hyphens (max 64 chars)',
      })
      // verbatim @423454: `"main" is reserved — SendMessage routes it to the main conversation`
      .refine(value => value !== MAIN_RESERVED_NAME, {
        message: `"${MAIN_RESERVED_NAME}" is reserved — SendMessage routes it to the main conversation`,
      })
      .optional()
      .describe(
        'Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running.',
      ), // @423457
    // DEPRECATED — verbatim @423458
    team_name: z
      .string()
      .optional()
      .describe('Deprecated; ignored. The session has a single implicit team.'),
    mode: permissionModeSchema() // zts() @423459 — z.enum(wM)
      .optional()
      .describe(
        'Permission mode for spawned teammate (e.g., "plan" to require plan approval).',
      ),
  })

  return baseAgentSchema()
    .merge(teammateFields)
    .extend({
      isolation: z
        .enum(['worktree', 'remote']) // @423466
        .optional()
        .describe(
          // verbatim @423468
          'Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo. "remote" launches the agent in a remote cloud environment (always runs in background; availability is gated).',
        ),
      cwd: z
        .string()
        .optional()
        .describe(
          // verbatim @423473
          'Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".',
        ),
    })
})

// 2.1.183: servedAgentSchema = zao @cli_inner_pretty.js:423478
/**
 * The schema actually served to the model: full schema minus `cwd`, and minus
 * `run_in_background` when background tasks are disabled (o3t = env
 * CLAUDE_CODE_DISABLE_BACKGROUND_TASKS) OR the fork-subagent feature is on (y7()).
 */
export const inputSchema = lazySchema(() => {
  const schema = buildAgentInputSchema().omit({ cwd: true }) // @423479
  const disableBackground =
    process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS != null &&
    process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS !== ''
  return disableBackground || isForkSubagentEnabled()
    ? schema.omit({ run_in_background: true })
    : schema
}) // o3t || y7() @423480

// `y7` — fork-subagent feature gate. Imported from forkSubagent for the schema/desc; declared
// here only as the local name used above. The real gate body lives in forkSubagent.ts.
import { isForkSubagentEnabled } from './forkSubagent.js'

// 2.1.183: outputSchema = xDp @cli_inner_pretty.js:423482
/**
 * Output union: completed (sync) | async_launched | remote_launched. The private
 * `teammate_spawned` shape is NOT in this exported union (dead-code-elimination keeps
 * the swarm status string out of non-swarm builds); call() returns it ad hoc.
 */
export const outputSchema = lazySchema(() => {
  const completed = agentToolResultSchema()
    .extend({ status: z.literal('completed'), prompt: z.string() }) // @423483
  const asyncLaunched = z.object({
    status: z.literal('async_launched'),
    agentId: z.string().describe('The ID of the async agent'),
    description: z.string().describe('The description of the task'),
    resolvedModel: z
      .string()
      .optional()
      .describe('Model the spawn resolved (may differ from the requested one)'),
    prompt: z.string().describe('The prompt for the agent'),
    outputFile: z.string().describe('Path to the output file for checking agent progress'),
    canReadOutputFile: z
      .boolean()
      .optional()
      .describe('Whether the calling agent has Read/Bash tools to check progress'),
  }) // @423484-423494
  const remoteLaunched = z.object({
    status: z.literal('remote_launched'),
    taskId: z.string().describe('The ID of the remote agent task'),
    sessionUrl: z.string().describe('The URL of the cloud session'),
    description: z.string().describe('The description of the task'),
    prompt: z.string().describe('The prompt for the agent'),
    outputFile: z.string().describe('Path to the output file for checking agent progress'),
  }) // @423495-423502
  return z.union([completed, asyncLaunched, remoteLaunched]) // @423503
})

// agentToolResultSchema is pRa() @423483 — owned by the subagent-execution unit (agentToolUtils).
import { agentToolResultSchema } from './agentToolUtils.js'

// =====================================================================================
// TOOL DEF
// =====================================================================================

// 2.1.183: agentTool = f3n @cli_inner_pretty.js:423505 (built via pi = buildTool @149995)
/**
 * The Agent tool. In 2.1.183 it doubles as the teammate SPAWNER: when an implicit session
 * team exists and the model supplies a `name` (and it isn't a fork), call() routes into
 * spawnTeammate() instead of running an ordinary subagent.
 */
export const agentTool: ToolDef = buildTool({
  // 2.1.183: prompt callback @423506-423511
  // Builds the tool description; passes (model, isCoordinatorMode(), availableAgentTypes).
  async prompt({ agents, getToolPermissionContext, allowedAgentTypes, model }) {
    const permCtx = await getToolPermissionContext()
    const isCoordinator = isCoordinatorMode() // oI() @423508
    const { available } = filterAgentsByPermission(agents, allowedAgentTypes, {
      toolPermissionContext: permCtx,
    }) // gqa @423509
    return await buildAgentToolDescription(model, isCoordinator, available) // Aqa @423510
  },

  name: AGENT_TOOL_NAME, // vs = "Agent" @423512
  searchHint: 'delegate work to a subagent', // @423513
  aliases: [LEGACY_AGENT_TOOL_NAME], // [c9] = ["Task"] @423514
  maxResultSizeChars: 1e5, // @423515

  // The asset metadata (assets/tools/Agent.md) lists description = "Launch a new agent".
  async description() {
    return 'Launch a new agent' // @423517
  },

  get inputSchema() {
    return inputSchema() // zao() @423520
  },
  get outputSchema() {
    return outputSchema() // xDp() @423523
  },

  // 2.1.183: call @cli_inner_pretty.js:423525-424224
  // Args destructured @423526-423536; ctx params (c,u,d,p) @423537-423541.
  async call(
    { prompt, subagent_type, description, model: requestedModel, run_in_background, name, mode, isolation, cwd },
    ctx,
    _unused,
    invocation,
    _extra,
  ) {
    const startedAt = Date.now() // f @423542
    // Coordinator mode forces the inherited model — a requested override is dropped. z9() @423543
    const modelOverride = isCoordinatorMode() ? undefined : requestedModel // m
    const appState = ctx.getAppState() // A @423544
    const permCtx = getToolPermissionContext(ctx) // g = Br(c) @423545
    const permMode = permCtx.mode // h @423546 (kept for downstream subagent path)
    const { taskRegistry } = ctx // @423547

    // _ : the IMPLICIT session team (seeded by initializeSessionTeam at startup), or undefined.
    //     team_name is NOT consulted — that is the deprecation made concrete. @423548
    const implicitTeam = isAgentSwarmsEnabled() ? appState.teamContext : undefined
    // b : is the CALLER itself a teammate? @423549
    const callerIsTeammate = !!ctx.teammateContext

    // GUARD 1 (nested-teammate, @423550): a teammate — or any session with a dynamic team
    // context (in-process teammate) — may not spawn a NAMED teammate. The roster is flat.
    // `l1e()` = getDynamicTeamContext() (returns module-var $q). The escape hatch is in the message.
    if ((callerIsTeammate || !!getDynamicTeamContext()) && name) {
      logFeatureBad('subagent_launch', 'subagent_nested_teammate') // Me @423552
      throw new AgentPreconditionError(
        'Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.',
      )
    }

    // GUARD 2 (in-process background, @423557): a teammate cannot fork off a background agent.
    if (callerIsTeammate && run_in_background === true) {
      logFeatureBad('subagent_launch', 'subagent_teammate_background_denied')
      throw new AgentPreconditionError(
        'In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.',
      )
    }

    const { activeAgents, allowedAgentTypes } = ctx.options.agentDefinitions // @423564
    // x : is this a fork request? subagent_type normalizes (NFKC/lowercase/strip) to "fork". @423565
    const isForkType = subagent_type !== undefined && normalizeAgentType(subagent_type) === FORK_AGENT_TYPE
    const { available, denyRule } = filterAgentsByPermission(activeAgents, allowedAgentTypes, {
      toolPermissionContext: permCtx,
    }) // gqa @423566
    if (isForkType && denyRule) {
      logFeatureBad('subagent_launch', 'subagent_type_denied') // @423567-423571
      throw new AgentTypeError(
        `Agent type '${FORK_AGENT_TYPE}' has been denied by permission rule '${AGENT_TOOL_NAME}(${FORK_AGENT_TYPE})' from ${denyRule.source}.`,
      )
    }
    // L : a fork is both requested AND available. A fork is mutually exclusive with a teammate. @423572
    const isFork = isForkType && available

    // =========================================================================
    // THE ROUTING DECISION (v2.1.178 redesign) @423573:
    //   implicit team exists  &&  model gave a `name`  &&  NOT a fork  ⇒  spawn a TEAMMATE.
    // Note: NO team_name is passed to spawnTeammate — the leaf spawners read
    // getAppState().teamContext.teamName themselves (the §2.4 "session team not initialized" guard).
    // =========================================================================
    if (implicitTeam && name && !isFork) {
      const def = subagent_type
        ? ctx.options.agentDefinitions.activeAgents.find(a => a.agentType === subagent_type)
        : undefined // de @423574
      if (def?.color) setAgentColor(subagent_type!, def.color) // Pke @423575

      const spawned = await spawnTeammate(
        {
          name,
          prompt,
          description,
          use_splitpane: true, // @423581
          plan_mode_required: mode === 'plan', // @423582
          model: modelOverride ?? (def ? resolveAgentModel(def, ctx.options.mainLoopModel) : undefined), // m ?? zhe(de,…) @423583
          agent_type: subagent_type, // @423584
          invokingRequestId: invocation?.requestId, // d?.requestId @423585
        },
        ctx,
      ) // cqa @423576

      const data: TeammateSpawnedOutput = { status: 'teammate_spawned', prompt, ...spawned.data } // @423589
      logFeatureOk('subagent_launch') // Le @423590
      return { data }
    }

    // -------------------------------------------------------------------------
    // …otherwise: ordinary subagent OR fork. The remaining ~630 lines of call()
    // (agent-type selection, ambiguity resolution, MCP-server wait, fork message
    // assembly, worktree/remote isolation, sync vs async/background execution) are
    // owned by the subagent-execution units, NOT this agent-team unit. We reproduce
    // only the two pieces that are part of the teammate guard surface below.
    // -------------------------------------------------------------------------
    let selectedAgent = await selectAgentDefinition({
      subagent_type,
      isFork,
      activeAgents,
      allowedAgentTypes,
      permCtx,
      isolation,
      ctx,
    }) // @423592-423651 (condensed; fork branch @423593-423606 throws AgentPreconditionError for
       //   remote-isolation-fork @423594 & recursive-fork @423601; non-fork branch throws
       //   AgentTypeError on denied/ambiguous/not-found @423607-423651)

    // SECOND in-process-background guard @423653: catches a background-by-default agent type
    // selected by a teammate even when run_in_background was not passed.
    if (callerIsTeammate && selectedAgent.background === true) {
      logFeatureBad('subagent_launch', 'subagent_teammate_background_denied')
      throw new AgentPreconditionError(
        `In-process teammates cannot spawn background agents. Agent '${selectedAgent.agentType}' has background: true in its definition.`,
      )
    }

    // … MCP-required-server wait (@423659+), then subagent/fork execution and result
    // rendering. Delegated to the subagent-execution unit. See file_index for chunk owners.
    return await runSelectedAgent({
      selectedAgent,
      prompt,
      description,
      modelOverride,
      run_in_background,
      isolation,
      cwd,
      startedAt,
      permMode,
      taskRegistry,
      isFork,
      ctx,
      invocation,
    })
  },

  // Render/permission members (getActivityDescription @424226, toAutoClassifierInput @424228,
  // isConcurrencySafe @424233, checkPermissions @424241, render* …) are UI/permission concerns
  // owned by other units; omitted from this agent-team reconstruction.
} as unknown as ToolDef)

// =====================================================================================
// TYPES + delegated helpers (signatures only; bodies owned by subagent-execution units)
// =====================================================================================

// 2.1.183: TeammateSpawnedOutput — private union member (status:"teammate_spawned") @423588
// Not part of the exported outputSchema (DCE keeps the swarm status out of non-swarm builds).
type TeammateSpawnedOutput = {
  status: 'teammate_spawned'
  prompt: string
  [k: string]: unknown
}

// Inferred input type widened to always include the optional teammate/isolation fields even
// when zao() .omit()'s some of them for gating. Mirrors the 2.1.88 AgentToolInput pattern.
export type AgentToolInput = z.infer<ReturnType<typeof baseAgentSchema>> & {
  name?: string
  team_name?: string
  mode?: z.infer<ReturnType<typeof permissionModeSchema>>
  isolation?: 'worktree' | 'remote'
  cwd?: string
}

// --- Delegated to the subagent-execution unit (declarations only) ----------------------
// selectAgentDefinition collapses call()'s @423592-423651 agent-type resolution (fork → j2,
// general-purpose default → nye, normalization, ambiguity/denied/not-found AgentTypeError).
declare function selectAgentDefinition(args: {
  subagent_type?: string
  isFork: boolean
  activeAgents: unknown[]
  allowedAgentTypes?: string[]
  permCtx: unknown
  isolation?: 'worktree' | 'remote'
  ctx: unknown
}): Promise<{ agentType: string; background?: boolean; color?: string; model?: string }>

// runSelectedAgent collapses call()'s MCP-wait + sync/async/remote execution tail (@423659-424224).
declare function runSelectedAgent(args: Record<string, unknown>): Promise<{ data: unknown }>

/*
 * Mapping (this file):
 *   agentTool→f3n, buildAgentInputSchema→IDp, baseAgentSchema→CDp, inputSchema→zao,
 *   outputSchema→xDp, buildAgentToolDescription→Aqa, filterAgentsByPermission→gqa,
 *   isAgentSwarmsEnabled→Sl, isCoordinatorMode→z9/oI, getDynamicTeamContext→l1e,
 *   isInProcessTeammate→UN, normalizeAgentType→Yut, FORK_AGENT_TYPE→_7,
 *   resolveAgentModel→zhe, setAgentColor→Pke, spawnTeammate→cqa, getToolPermissionContext→Br,
 *   AgentPreconditionError→oWe, AgentTypeError→r3t, logFeatureBad→Me, logFeatureOk→Le,
 *   permissionModeSchema→zts, MAIN_RESERVED_NAME→LY, AGENT_NAME_RE→pDa, isForkSubagentEnabled→y7,
 *   AGENT_TOOL_NAME→vs, LEGACY_AGENT_TOOL_NAME→c9,
 *   call args: prompt→e, subagent_type→t, description→n, requestedModel→r, run_in_background→o,
 *     name→s, mode→i, isolation→a, cwd→l ; ctx→c, invocation→d ;
 *     locals: startedAt→f, modelOverride→m, appState→A, permCtx→g, permMode→h,
 *     implicitTeam→_, callerIsTeammate→b, isForkType→x, available→I, denyRule→k, isFork→L,
 *     def→de, spawned→ye, data→me, selectedAgent→P.
 */
