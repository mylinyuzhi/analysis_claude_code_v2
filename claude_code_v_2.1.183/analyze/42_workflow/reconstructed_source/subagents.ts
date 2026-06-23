/**
 * Workflow subagents — readable-source restoration (Claude Code v2.1.183)
 *
 * Subsystem: the `workflow-subagent` definitions, their system prompts, and the per-agent
 * spawn closure that the Workflow VM's `agent()` DSL drives. Covers:
 *   - the four prompt strings: a plain body + plain tail, and a StructuredOutput body + tail
 *   - the two built-in agent defs (plain / StructuredOutput-forcing) and their selection
 *   - the agent-cap / budget error classes and the cap message
 *   - the per-agent spawn closure: named-agent resolution + prompt-tail append, the per-call
 *     `effort` opt merge (the 2.1.183 delta), the `agentContext` attribution object (the
 *     2.1.174 fix), worktree isolation (system-prompt note + `worktreePath` threading, the
 *     2.1.161 bg-edit fix), and the `wj({…})` subagent-query call with its `override`.
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here (read line-for-line this pass):
 *     - per-agent spawn closure   U(z,Y,X,ee,te,ne,re,oe,ce,ue)  @417088-417368
 *         · named-agent resolve + disallowed/tools merge + tail select  @417091-417115
 *         · structured-tool compile (Ftt)                               @417116-417121
 *         · baseDef + effort merge (the 183 delta)                      @417122-417124
 *         · permission mode / availableTools assembly                   @417125-417132
 *         · worktree isolation: create + system-prompt note             @417133-417143
 *         · spawnWorkflowAgent (Tt) + agentContext Dt                   @417149-417160
 *         · wj({…}) query call: transcriptSubdir/spawnedByWorkflowRunId/override/worktreePath
 *                                                                       @417238-417253
 *     - cap message / errors      J0p @417781, bWa @417785, SWa @417791
 *     - prompt strings            Q0p @417723 (plain body), Z0p @417730 (plain tail),
 *                                 eLp @417799 (structured tail), tLp @417804 (structured body)
 *     - agent defs                ddo @417811 (plain), nLp @417820 (structured)
 *     - constants/helpers         _Wa @417718 (=1000), rLp @417739 (=180000), AWa @417722 (=400),
 *                                 Em @221489 ("StructuredOutput"), KO @221278 ("SendUserMessage"),
 *                                 vs @149939 ("Agent"), zk @221550 ("Workflow"),
 *                                 rB @148923 (normalizeEffort), K0p @416892 (concurrency),
 *                                 ay @472399 (isBuiltIn), jz @103149 (isRoot), Gz @103152 (depth),
 *                                 a4 @103436 (currentSessionId), Rq @103143 (runInAgentContext),
 *                                 Lxe @298970 (querySource), Lx @272589 (isMcpTool)
 *
 * CONVENTION mirror — v2.1.88 named-TS tree (/lyz/codespace/3rd/claude-code/src)
 *   Workflow is gated-out there (`feature('WORKFLOW_SCRIPTS')`), so only the *shape* is borrowed:
 *     - the agent-def object shape and `BuiltInAgentDefinition` field set
 *       (tools/AgentTool/built-in/generalPurposeAgent.ts: agentType/whenToUse/tools/source/
 *        baseDir/getSystemPrompt; `disallowedTools` optional)
 *     - tool-name constants live beside the tool (tools/AgentTool/constants.ts: AGENT_TOOL_NAME)
 *     - ESM `.js` import specifiers on `.ts` files
 *   There is NO workflow-subagent implementation to copy — the prompts/defs are NEW-post-2.1.88.
 *
 * SCAFFOLD — v2.1.156 baseline analysis
 *   42_workflow/workflow_runtime_and_subagents.md §F (F.1 prompt strings, F.2 def selection,
 *   F.3 StructuredOutput forcing). Readable names inherited from there; EVERY claim re-verified
 *   against the 183 bundle (lines + obf names re-mangled this build).
 *
 * ── Cross-validation note ────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle (NOT trusted from the 156 scaffold):
 *   1. disallowedTools is now THREE tools `[KO, vs, zk]` = ["SendUserMessage","Agent","Workflow"]
 *      (@417815). The 156 scaffold had only TWO `[cd, sq]` = ["SendUserMessage","Agent"]; the
 *      `Workflow` (zk) entry is a real 156→183 addition — a workflow subagent can no longer
 *      recursively launch another workflow.
 *   2. The per-call `effort` opt (`le = rB(re?.effort); pe = le!==undefined ? {...se, effort:le} : se`)
 *      at @417122-417124 is the 2.1.183 delta — absent in 2.1.156.
 *   3. agentContext `Dt` (@417152) carries the full 2.1.174 attribution set
 *      {agentId, parentAgentId(is-root guard via jz), depth(Gz+1), parentSessionId, agentType,
 *      subagentName, isBuiltIn} — 2.1.156 passed only `override:{agentId}`.
 *   4. `worktreePath: Ce` (@417253) threads the created worktree into the subagent query (the
 *      2.1.161 bg-edit fix); paired with the worktree system-prompt note (@417137-417143).
 *   5. Both prompt strings transcribed verbatim from @417723 (plain) and @417804 (structured);
 *      tails from @417730 (plain) and @417799 (structured). `${Em}` interpolation confirmed.
 *   6. Confirmed constants: _Wa=1000 (@417718), rLp=180000 (@417739), AWa=400 (@417722).
 */

import {
  AGENT_TOOL_NAME,           // 2.1.183: vs = "Agent"               @149939
  STRUCTURED_OUTPUT_TOOL_NAME, // 2.1.183: Em = "StructuredOutput"  @221489
  SEND_USER_MESSAGE_TOOL_NAME, // 2.1.183: KO = "SendUserMessage"   @221278
  WORKFLOW_TOOL_NAME,        // 2.1.183: zk = "Workflow"            @221550
} from './toolNames.js'
import { normalizeEffort } from '../../utils/effort.js'        // 2.1.183: rB @148923
import {
  isBuiltInAgentDef,         // 2.1.183: ay @472399  (source === "built-in")
  type AgentDefinition,
  type BuiltInAgentDefinition,
} from '../AgentTool/loadAgentsDir.js'
import {
  currentSessionId,          // 2.1.183: a4  @103436
  isRootContext,             // 2.1.183: jz  @103149  (agentType === "main")
  contextDepth,              // 2.1.183: Gz  @103152  (main → 0, else depth ?? 0)
  runInAgentContext,         // 2.1.183: Rq  @103143  (pwt.run(ctx, fn))
  newAgentId,                // 2.1.183: dM  @2060
  type AgentContext,
} from '../../agents/agentContext.js'
import { querySubagent } from '../AgentTool/runAgent.js'       // 2.1.183: wj  (async generator)
import { querySourceForAgent } from '../AgentTool/querySource.js' // 2.1.183: Lxe @298970

// ─────────────────────────────────────────────────────────────────────────────────────
// Constants & cap/budget errors  (single source of truth: ./constants.js — the leaf module)
// ─────────────────────────────────────────────────────────────────────────────────────
//
// WORKFLOW_AGENT_CAP (_Wa @417718), WORKFLOW_STALL_MS_DEFAULT (rLp @417739), the agent preview
// truncation cap (AGENT_PREVIEW_MAX, AWa @417722), the cap message (J0p @417781), and the two
// cap/budget error classes (WorkflowAgentCapError bWa @417785, WorkflowBudgetExceededError SWa
// @417791) all live in ./constants.js so there is exactly one declaration tree-wide. They are
// imported (and re-exported) here because the spawn pipeline below documents the throw sites.
import {
  WORKFLOW_AGENT_CAP,
  WORKFLOW_STALL_MS_DEFAULT,
  WorkflowAgentCapError,
  WorkflowBudgetExceededError,
} from './constants.js'
export { WORKFLOW_AGENT_CAP, WORKFLOW_STALL_MS_DEFAULT, WorkflowAgentCapError, WorkflowBudgetExceededError }

// ─────────────────────────────────────────────────────────────────────────────────────
// System prompts (transcribed verbatim from the 183 bundle)
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Plain workflow-subagent system prompt. The load-bearing line is "Your final text response
 * is returned **verbatim** as a string to the calling script — it is your return value, not a
 * message to a human", which is exactly what makes `const x = await agent("…")` behave like a
 * function call inside the script.
 */
// 2.1.183: WORKFLOW_SUBAGENT_PROMPT = Q0p @417723   (v2.1.156 iG_)
export const WORKFLOW_SUBAGENT_PROMPT = `You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.

CRITICAL: Your final text response is returned **verbatim** as a string to the calling script — it is your return value, not a message to a human.
- Output the literal result (data, JSON, text). Do NOT output confirmations like "Done." or "Sent."
- If asked for JSON, return ONLY the raw JSON — no code fences, no prose, no markdown.
- Do NOT use SendUserMessage to deliver your answer. Put your answer in your final text response.
- Be concise. The script will parse your output.`

/**
 * Plain prompt *tail*. Appended to a *named* agent's own system prompt (so the named agent
 * keeps its specialization but learns the workflow return-value contract) when that agent was
 * selected without a `schema`.
 */
// 2.1.183: WORKFLOW_SUBAGENT_TAIL = Z0p @417730   (v2.1.156 rG_)
export const WORKFLOW_SUBAGENT_TAIL = `

---

NOTE: You are running inside a workflow script. Your final text response is returned verbatim as a string to the calling script — it is your return value, not a message to a human. Output the literal result; do not output confirmations like "Done." Be concise — the script will parse your output.`

/**
 * StructuredOutput-forcing workflow-subagent system prompt. Used when `agent({schema})` is
 * called: the contract switches from "your text is the return value" to "you MUST call the
 * StructuredOutput tool exactly once — the script reads ONLY that tool call."
 */
// 2.1.183: WORKFLOW_STRUCTURED_PROMPT = tLp @417804   (v2.1.156 aG_)
export const WORKFLOW_STRUCTURED_PROMPT = `You are a subagent spawned by a workflow orchestration script. Use the tools available to complete the task.

CRITICAL: You MUST call the ${STRUCTURED_OUTPUT_TOOL_NAME} tool exactly once to return your final answer. The tool's input schema defines the required shape.
- Do your work (Read files, run commands, etc.), then call ${STRUCTURED_OUTPUT_TOOL_NAME} with your answer.
- Do NOT put your answer in a text response. The script reads ONLY the ${STRUCTURED_OUTPUT_TOOL_NAME} tool call.
- If the schema validation fails, read the error and call ${STRUCTURED_OUTPUT_TOOL_NAME} again with a corrected shape.
- After calling ${STRUCTURED_OUTPUT_TOOL_NAME} successfully, end your turn. No acknowledgment needed.`

/**
 * StructuredOutput prompt *tail*. Appended to a *named* agent's own prompt when that agent was
 * selected together with a `schema`.
 */
// 2.1.183: WORKFLOW_STRUCTURED_TAIL = eLp @417799   (v2.1.156 oG_)
export const WORKFLOW_STRUCTURED_TAIL = `

---

NOTE: You are running inside a workflow script. You MUST return your final answer by calling the ${STRUCTURED_OUTPUT_TOOL_NAME} tool exactly once — the tool's input schema defines the required shape. Do your work, then call ${STRUCTURED_OUTPUT_TOOL_NAME}; do NOT put your answer in a text response (the script reads ONLY the tool call). If validation fails, read the error and call ${STRUCTURED_OUTPUT_TOOL_NAME} again with a corrected shape.`

// ─────────────────────────────────────────────────────────────────────────────────────
// Built-in workflow-subagent definitions
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * The built-in `workflow-subagent` def used when `agent()` is called WITHOUT an explicit
 * `agentType`. It grants `tools: ["*"]` (every tool) but denies three:
 *   - SendUserMessage — there is no human in the loop; the script parses the return value
 *     (which is also why the prompt body says "Do NOT use SendUserMessage").
 *   - Agent — a workflow subagent must not spawn its own arbitrary subagents; fan-out stays
 *     under the script's control.
 *   - Workflow — a workflow subagent must not recursively launch another workflow.
 *     (This third entry is the 156→183 addition; 2.1.156 denied only the first two.)
 */
// 2.1.183: WORKFLOW_SUBAGENT_DEF = ddo @417811   (v2.1.156 mp6)
export const WORKFLOW_SUBAGENT_DEF: BuiltInAgentDefinition = {
  agentType: 'workflow-subagent',
  whenToUse: 'Internal subagent for workflow script orchestration.',
  tools: ['*'],
  // @417815: disallowedTools: [KO, vs, zk]
  disallowedTools: [
    SEND_USER_MESSAGE_TOOL_NAME, // KO
    AGENT_TOOL_NAME,             // vs
    WORKFLOW_TOOL_NAME,          // zk  (NEW in 183 vs 156)
  ],
  source: 'built-in',
  baseDir: 'built-in',
  getSystemPrompt: () => WORKFLOW_SUBAGENT_PROMPT,
}

/**
 * Same as `WORKFLOW_SUBAGENT_DEF` but with the StructuredOutput-forcing body. Selected when
 * `agent()` was called WITHOUT an explicit `agentType` but WITH a `schema`.
 */
// 2.1.183: WORKFLOW_STRUCTURED_DEF = nLp @417820   (v2.1.156 sG_)
export const WORKFLOW_STRUCTURED_DEF: BuiltInAgentDefinition = {
  ...WORKFLOW_SUBAGENT_DEF,
  getSystemPrompt: () => WORKFLOW_STRUCTURED_PROMPT,
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Cap / budget errors
// ─────────────────────────────────────────────────────────────────────────────────────

// The cap message (WORKFLOW_AGENT_CAP_MESSAGE, J0p @417781) and the two cap/budget error classes
// (WorkflowAgentCapError bWa @417785, WorkflowBudgetExceededError SWa @417791) are declared once in
// ./constants.js and imported/re-exported at the top of this file. The throw sites are in
// runtime.ts (enforceAgentCap S @416933 / enforceTokenBudget T @416938); see the spawn flow below.

// ─────────────────────────────────────────────────────────────────────────────────────
// Per-agent spawn: agent-def resolution
// ─────────────────────────────────────────────────────────────────────────────────────

/** The subset of `agent()` opts that affect def/prompt/effort selection and isolation. */
export interface AgentSpawnOptions {
  /** Named agent type to resolve from the active agent set; absent → built-in workflow-subagent. */
  agentType?: string
  /** A JSON Schema for `agent({schema})`; presence forces the StructuredOutput contract. */
  schema?: unknown
  /** Per-call effort override (the 2.1.183 delta), normalized via {@link normalizeEffort}. */
  effort?: unknown
  /** Per-call model override. */
  model?: string
  /** "worktree" runs the subagent in an isolated git worktree. ("remote" is rejected in this build.) */
  isolation?: 'worktree' | 'remote'
  /** Permission mode for the subagent's tool use; defaults to "acceptEdits". */
  permissionMode?: string
}

/**
 * Resolve a *named* agent def for a workflow `agent({agentType})` call and decorate it with the
 * workflow contract. Throws with a helpful "available agents" / permission-denied message when
 * the requested type is unknown or denied.
 *
 * The named def's own `getSystemPrompt` is preserved but its output gets the workflow *tail*
 * appended (structured tail when a `schema` was supplied, plain tail otherwise); its
 * `disallowedTools` are unioned with the built-in workflow denials; and when a `schema` is
 * present the StructuredOutput tool is appended to its `tools` (unless it already grants `*`).
 *
 * 2.1.183 region: cli_inner_pretty.js:417091-417115
 * 2.1.88 convention: AgentTool/loadAgentsDir.ts (AgentDefinition shape); permission helpers
 *   QGe/But live beside the permission engine.
 */
// 2.1.183: resolveNamedWorkflowAgent ≈ inline branch in U @417091-417115
function resolveNamedWorkflowAgent(
  agentType: string,
  hasSchema: boolean,
  ctx: WorkflowToolContext,
): AgentDefinition {
  const type = String(agentType)
  const activeAgents = ctx.options.agentDefinitions.activeAgents
  const permissionContext = getPermissionContext(ctx) // Br(k) @417095

  // QGe filters out agent types denied by an `Agent(<type>)` permission rule. @417096
  const allowed = filterAgentsByPermission(activeAgents, permissionContext, AGENT_TOOL_NAME)
  const named = allowed.find((a) => a.agentType === type)

  if (!named) {
    // @417099: distinguish "denied by a rule" from "no such agent" for a better error.
    if (activeAgents.some((a) => a.agentType === type)) {
      const rule = findDenyRule(permissionContext, AGENT_TOOL_NAME, type) // But @417100
      throw new Error(
        `agent({agentType}): '${type}' is denied by permission rule '${AGENT_TOOL_NAME}(${type})' from ${rule?.source ?? 'settings'}.`,
      )
    }
    throw new Error(
      `agent({agentType}): agent type '${type}' not found. Available agents: ${allowed
        .map((a) => a.agentType)
        .join(', ')}`,
    )
  }

  // @417109: union the named def's denials with the built-in workflow denials.
  const disallowedTools = [
    ...(named.disallowedTools ?? []),
    ...(WORKFLOW_SUBAGENT_DEF.disallowedTools ?? []),
  ]
  // @417110: structured tail vs plain tail.
  const tail = hasSchema ? WORKFLOW_STRUCTURED_TAIL : WORKFLOW_SUBAGENT_TAIL
  // @417111: with a schema, ensure the StructuredOutput tool is available (unless tools already has "*").
  const tools =
    hasSchema && !grantsAllTools(named.tools)
      ? [...(named.tools ?? []), STRUCTURED_OUTPUT_TOOL_NAME]
      : named.tools

  // @417112-417114: append the tail to the named def's own prompt. Built-in defs receive the
  // toolUseContext arg; user defs take none.
  return isBuiltInAgentDef(named)
    ? {
        ...named,
        disallowedTools,
        tools,
        getSystemPrompt: (toolUseContext) => named.getSystemPrompt(toolUseContext) + tail,
      }
    : {
        ...named,
        disallowedTools,
        tools,
        getSystemPrompt: () => named.getSystemPrompt() + tail,
      }
}

/**
 * Pick and finalize the agent def for one `agent()` call, applying the per-call `effort` opt.
 *
 * Selection: an explicit `agentType` → the decorated named def (see {@link resolveNamedWorkflowAgent});
 * otherwise a `schema` selects {@link WORKFLOW_STRUCTURED_DEF}; the default is
 * {@link WORKFLOW_SUBAGENT_DEF}.
 *
 * Effort (the 2.1.183 delta): the per-call `opts.effort` is normalized; if it resolves to a
 * value, it is merged onto a SHALLOW COPY of the base def (so the shared built-in def objects are
 * never mutated). If it resolves to `undefined` (unknown/absent), the base def is used unchanged.
 *
 * 2.1.183 region: cli_inner_pretty.js:417116-417124
 */
// 2.1.183: selectWorkflowAgentDef ≈ inline @417116-417124 (se / le / pe)
function selectWorkflowAgentDef(
  namedDef: AgentDefinition | undefined, // ae
  opts: AgentSpawnOptions | undefined,   // re
  structuredOutputTool: unknown,         // ge — compiled when re.schema present (Ftt @417118)
): AgentDefinition {
  // @417122: namedDef ?? (hasStructuredOutputTool ? structuredDef : plainDef)
  const baseDef = namedDef ?? (structuredOutputTool ? WORKFLOW_STRUCTURED_DEF : WORKFLOW_SUBAGENT_DEF)
  // @417123: normalizeEffort(opts.effort) — undefined for unknown/absent values.
  const effort = normalizeEffort(opts?.effort)
  // @417124: merge onto a copy only when a real effort value was provided.
  return effort !== undefined ? { ...baseDef, effort } : baseDef
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Per-agent spawn: worktree isolation message
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the subagent's system prompt for a worktree-isolated run by appending an isolation note
 * to the base prompt. The note tells the agent it is in a separate working copy whose changes do
 * not affect the main working directory or other agents, and that the worktree is cleaned up if
 * untouched or preserved for review if modified.
 *
 * 2.1.183 region: cli_inner_pretty.js:417137-417143
 */
// 2.1.183: worktree note ≈ inline ($e) @417138-417143
function withWorktreeIsolationNote(basePrompt: string, worktreePath: string, mainCwd: string): string {
  return `${basePrompt}

---
You are running in an isolated git worktree at ${worktreePath} (a separate working copy of the repo). Changes you make here do NOT affect the main working directory (${mainCwd}) or other agents. Work normally — the worktree will be cleaned up automatically if you made no changes, or preserved for review if you did.`
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Per-agent spawn: the agentContext (attribution) builder
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the per-agent attribution context attached to one spawned workflow subagent. This is the
 * 2.1.174 fix: before it, the workflow spawn passed only `override:{ agentId }`, so a workflow
 * subagent's telemetry/headers were not attributed to its parent. Now the full context is built
 * and (a) installed via the `runInAgentContext` ALS wrapper around the query and (b) passed as
 * `override.agentContext`.
 *
 * Fields:
 *   - agentId        — a fresh id for this spawned agent (newAgentId).
 *   - parentAgentId  — the parent's agentId, unless the parent is the root ("main"), where it is
 *                      left undefined (the is-root guard).
 *   - depth          — parent depth + 1 (main counts as depth 0).
 *   - parentSessionId — the current session id.
 *   - agentType      — always "subagent" for these spawns.
 *   - subagentName   — the resolved agent type (named def's type or "workflow-subagent").
 *   - isBuiltIn      — whether the chosen def is a built-in def.
 *
 * 2.1.183 region: cli_inner_pretty.js:417150-417160
 */
// 2.1.183: buildAgentContext = Dt @417152
function buildAgentContext(
  agentId: string,           // dt
  parentContext: AgentContext, // ue
  agentDef: AgentDefinition, // pe (the effort-merged def)
): AgentContext {
  return {
    agentId,
    // @417154: omit parentAgentId when the parent is the root context.
    parentAgentId: isRootContext(parentContext) ? undefined : parentContext?.agentId,
    depth: contextDepth(parentContext) + 1, // @417155
    parentSessionId: currentSessionId(),    // @417156
    agentType: 'subagent',                  // @417157
    subagentName: agentDef.agentType,       // @417158
    isBuiltIn: isBuiltInAgentDef(agentDef), // @417159
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Per-agent spawn: assembling and issuing the subagent query
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Drive a single workflow subagent to completion and return its result.
 *
 * This is the spawn closure the Workflow VM's `agent()` DSL invokes once per call (after the
 * concurrency semaphore and journal de-dup decided it should actually run). It:
 *   1. resolves the named/plain/structured def and applies the per-call effort opt,
 *   2. assembles the subagent's available tools (MCP + skill tools, minus the StructuredOutput
 *      tool when a schema injects its own; permission mode defaults to "acceptEdits"),
 *   3. optionally creates a git worktree and rewrites the system prompt with the isolation note,
 *   4. builds the per-agent `agentContext`, registers the StructuredOutput SubagentStop nudge
 *      when a schema is present, installs the stall watchdog, and
 *   5. issues the `querySubagent` (wj) async-generator call wrapped in `runInAgentContext`,
 *      threading `transcriptSubdir` / `spawnedByWorkflowRunId` / `override.agentContext` /
 *      `worktreePath`, then folds the streamed events into a result.
 *
 * Only the def-selection / agentContext / isolation / query-threading slice is reconstructed in
 * full here — see runtime.ts for the surrounding stall/retry/progress/journal machinery. The
 * streamed-event reduction (assistant/user/structured_output handling, stall and skip handling)
 * is at cli_inner_pretty.js:417255-417368 and is summarized, not transcribed.
 *
 * 2.1.183 region: cli_inner_pretty.js:417088-417368 (def select @417091-417124, isolation
 *   @417133-417143, agentContext @417150-417160, query @417238-417253).
 * 2.1.88 convention: AgentTool/runAgent.ts (querySubagent generator + per-agent override shape),
 *   AgentTool/forkSubagent.ts (worktree threading idiom).
 */
// 2.1.183: spawnWorkflowAgent ≈ U(...)+Tt(...)  @417088 / @417149
export async function spawnWorkflowAgent(args: {
  index: number                 // z
  basePrompt: string            // Y (the workflow-subagent system prompt before isolation note)
  label: string                 // X
  phaseTitle: string            // ee
  phaseIndex: number            // te
  stallMs: number               // ne (default WORKFLOW_STALL_MS_DEFAULT)
  opts: AgentSpawnOptions | undefined // re
  onSpawn: ((agentId: string) => void) | undefined // oe (journal "started" hook)
  queuedAt: number              // ce
  parentContext: AgentContext   // ue
  ctx: WorkflowToolContext      // k (the workflow tool context)
  promptText: string            // the actual prompt/message handed to the agent (Ue)
  workflowRunId?: string        // r — present for resumable/journaled runs
}): Promise<WorkflowAgentResult> {
  const { ctx, opts, basePrompt, workflowRunId, index } = args

  // @417089: a mid-flight abort short-circuits the whole run.
  if (ctx.abortController?.signal.aborted) throw new Error('Workflow aborted')

  // @417090: budget gate (T()). Throws WorkflowBudgetExceededError once the run's spent output
  // tokens reach the token budget (T = @416938: if (budget.total > 0 && getTurnSpent() >= total)
  // throw new SWa(spent, total)). In-flight agents finish; only new agent() calls are stopped.
  enforceWorkflowTokenBudget(ctx)

  // @417061: remote isolation is advertised in the DSL but rejected at runtime in this build.
  // (Source: this guard lives in the outer agent() dispatcher that invokes U; shown here for the
  // full per-call sequence.)
  if (opts?.isolation === 'remote') {
    throw new Error("agent({isolation:'remote'}) is not available in this build")
  }

  // (1) Resolve named def (if any) with the workflow tail, then pick base def + apply effort.
  // @417091-417115:
  const namedDef =
    opts?.agentType != null
      ? resolveNamedWorkflowAgent(String(opts.agentType), Boolean(opts?.schema), ctx)
      : undefined

  // @417116-417121: compile the StructuredOutput tool from the user schema (Ajv-validated).
  let structuredOutputTool: unknown
  if (opts?.schema) {
    const compiled = compileStructuredOutputTool(opts.schema) // Ftt @417118
    if ('error' in compiled) {
      throw new TypeError(`agent({schema}) received an invalid JSON Schema: ${compiled.error}`)
    }
    structuredOutputTool = compiled.tool
  }

  // @417122-417124: base def selection + per-call effort merge (the 2.1.183 delta).
  const agentDef = selectWorkflowAgentDef(namedDef, opts, structuredOutputTool)

  // (2) Assemble the subagent's available tools. @417125-417132
  const appState = ctx.getAppState()
  const permissionContext = getPermissionContext(ctx) // Br(k) @417126
  const localTools = ctx.options.tools.filter(isMcpTool) // me @417127 (Lx)
  const effectivePermissions = {
    ...permissionContext,
    mode: agentDef.permissionMode ?? 'acceptEdits', // @417128
  }
  // @417129: filter the combined MCP + skill tools through the permission/skill gate.
  const baseTools = filterAvailableTools(
    effectivePermissions,
    dedupeToolList(appState.mcp.tools.concat(localTools)),
    { skipReplFilter: true, skillTools: appState.skillTools },
  )
  // @417130: when a schema injected a StructuredOutput tool, drop any pre-existing one and add it.
  const availableTools = structuredOutputTool
    ? [...baseTools.filter((t) => !isStructuredOutputTool(t)), structuredOutputTool]
    : baseTools

  // @417131: resolve the model the subagent will use (per-call override > def > main loop).
  const model = resolveSubagentModel(agentDef, ctx.options.mainLoopModel, opts?.model, effectivePermissions.mode)

  // (3) Optional worktree isolation. @417133-417143
  let worktree: { worktreePath: string } | null = null
  if (opts?.isolation === 'worktree') {
    // @417134: worktree name = `<runId>-<index>` when journaled, else `wf-<index>`.
    const worktreeName = workflowRunId ? `${workflowRunId}-${index}` : `wf-${index}`
    worktree = await createWorktree(worktreeName)
  }
  const worktreePath = worktree?.worktreePath // Ce @417137
  const systemPrompt = worktree
    ? withWorktreeIsolationNote(basePrompt, worktree.worktreePath, getCwd()) // @417138-417143
    : basePrompt

  // The per-attempt runner (Tt @417149). One AbortController per attempt, stall watchdog, the
  // SubagentStop nudge for schema runs, and the streamed-event reduction live here; only the
  // attribution + query-threading slice is reconstructed.
  async function runAttempt(promptText: string): Promise<WorkflowAgentResult> {
    const agentId = newAgentId() // dt @417150
    args.onSpawn?.(agentId)      // oe(dt) @417151 — journal "started"

    // (4) Build the per-agent attribution context (the 2.1.174 fix). @417152-417160
    const agentContext = buildAgentContext(agentId, args.parentContext, agentDef)

    // … progress emitter, AbortController, stall watchdog, and (when structuredOutputTool) the
    //   SubagentStop nudge that blocks stop until StructuredOutput is called (@417213-417228)
    //   are set up here; see runtime.ts. …

    let lastAssistant: unknown
    let structuredOutput: unknown

    try {
      // (5) Install the agentContext via the ALS wrapper and stream the subagent query.
      // @417238: runInAgentContext(agentContext, () => for await (… wj({…})))
      await runInAgentContext(agentContext, async () => {
        for await (const event of querySubagent({
          agentDefinition: agentDef,                                   // @417240
          promptMessages: [makeUserMessage({ content: promptText })],  // @417241
          toolUseContext: { ...ctx, abortController: /* per-attempt */ ctx.abortController }, // mt @417242
          canUseTool: args.ctx.canUseTool,                             // @417243
          isAsync: false,                                              // @417244
          querySource: querySourceForAgent(agentDef.agentType, isBuiltInAgentDef(agentDef)), // @417245
          spawnedBySkill: ctx.options.spawnedBySkill ?? ctx.options.activeSkill, // @417246
          availableTools,                                              // @417247
          // @417248: journal subagent transcripts under workflows/<runId> when journaled.
          transcriptSubdir: workflowRunId ? `workflows/${workflowRunId}` : undefined,
          spawnedByWorkflowRunId: workflowRunId,                       // @417249
          // @417250: the 2.1.174 attribution override — agentId + the full agentContext.
          override: { agentId, agentContext },
          model: opts?.model,                                          // @417251
          onQueryProgress: /* progress watchdog tick */ undefined,     // We @417252
          // @417253: the 2.1.161 bg-edit fix — thread the worktree so edits land in it.
          worktreePath,
        })) {
          // Streamed-event reduction (structured_output attachment, in-progress tool-use id
          // tracking, user tool_result, assistant usage/tool-calls). @417255-417285
          if (isStructuredOutputAttachment(event)) {
            structuredOutput = event.attachment.data
            continue
          }
          if (isAssistantEvent(event)) {
            lastAssistant = event
            // … token/tool-call accounting and StructuredOutput-call detection …
          }
          // … other event kinds handled in runtime.ts …
        }
      })
    } catch (error) {
      // Stall / user-retry / user-skip / API-error classification @417288-417364.
      throw error
    } finally {
      // @417366: clear the watchdog, detach abort listeners, clear the SubagentStop nudge.
    }

    // Fold the last assistant message + usage into the result @417368-… (see runtime.ts).
    return foldAgentResult({ lastAssistant, structuredOutput })
  }

  return runAttempt(args.promptText)
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Result type (shape consumed by the VM's `agent()` binding)
// ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Result of a single spawned workflow subagent. The VM exposes `.structured` (for `schema`
 * calls) or `.text` (for plain calls) to the script as the `agent()` return value; the rest
 * is progress/telemetry the runtime records.
 *
 * Shape transcribed from the return objects at cli_inner_pretty.js:417294-417354 and 417382-….
 */
export interface WorkflowAgentResult {
  structured: unknown | undefined
  text: string
  tokens: number
  toolCalls: number
  stalled: boolean
  stalledReason?: string
  skipped: boolean
  durationMs: number
  stopReason: string | undefined
  outputTokens: number | undefined
  structuredOutputAttempts: number
  lastStructuredOutputInput: unknown
}

// ─────────────────────────────────────────────────────────────────────────────────────
// Imported helpers (declared elsewhere — referenced for type/intent only)
// ─────────────────────────────────────────────────────────────────────────────────────
//
// These are generic execution-plumbing symbols the workflow spawn consumes. Their canonical
// home is the broader runtime (symbol_index_core_execution / infra_platform); they are NOT
// redeclared here, only referenced. Listed with their 183 obf names for re-verification:
//
//   getPermissionContext        Br   @460389  — build the permission context from the tool ctx (k)
//   filterAgentsByPermission    QGe  @585553  — drop agent types denied by an Agent(<type>) rule
//   findDenyRule                But  @585550  — find the matching deny rule (for the error message)
//   compileStructuredOutputTool Ftt  @221457  — Ajv-validate a JSON Schema → StructuredOutput tool
//   grantsAllTools              lio  @371170  — tools list includes "*"
//   isMcpTool                   Lx   @272589  — name startsWith "mcp__" || isMcp === true
//   filterAvailableTools        YY   (@417129 callsite) — permission/skill tool gate
//   dedupeToolList              glt  (@417129 callsite)
//   isStructuredOutputTool      Rc(_, Em) (@417130) — predicate: tool is the StructuredOutput tool
//   resolveSubagentModel        pte  (@417131 callsite)
//   createWorktree              y    (@417135 callsite) — create a git worktree, returns {worktreePath}
//   makeUserMessage             Rn   @587504
//   compileStructuredOutputTool / querySubagent (wj) / runInAgentContext (Rq) — see imports
//   getCwd                      Pt   @46264  — main working directory for the isolation note
//
// UNVERIFIED (not load-bearing to this file; summarized from surrounding lines but not
// transcribed): the exact streamed-event reduction at 417255-417368 and the result-folding at
// 417368-… are documented in runtime.ts; the helper signatures above are referenced by callsite
// only (their bodies were not all read this pass — see the listed callsite/line for each).

import { getCwd } from '../../utils/cwd.js'              // 2.1.183: Pt @46264
import type { WorkflowToolContext } from './runtime.js'  // the tool ctx `k`
declare function getPermissionContext(ctx: WorkflowToolContext): unknown // Br
declare function filterAgentsByPermission(
  agents: AgentDefinition[],
  permissionContext: unknown,
  toolName: string,
): AgentDefinition[] // QGe
declare function findDenyRule(
  permissionContext: unknown,
  toolName: string,
  ruleContent: string,
): { source?: string } | null // But
declare function compileStructuredOutputTool(
  schema: unknown,
): { tool: unknown } | { error: string } // Ftt
declare function grantsAllTools(tools: string[] | undefined): boolean // lio
declare function isMcpTool(tool: unknown): boolean // Lx
declare function filterAvailableTools(
  permissions: unknown,
  tools: unknown[],
  opts: { skipReplFilter: boolean; skillTools: unknown },
): unknown[] // YY
declare function dedupeToolList(tools: unknown[]): unknown[] // glt
declare function isStructuredOutputTool(tool: unknown): boolean // Rc(_, Em)
declare function resolveSubagentModel(
  agentDef: AgentDefinition,
  mainLoopModel: string,
  modelOverride: string | undefined,
  mode: string,
): string // pte
declare function createWorktree(name: string): Promise<{ worktreePath: string }> // y
declare function makeUserMessage(args: { content: string }): unknown // Rn
// T @416938 — budget gate run before each agent() call; throws WorkflowBudgetExceededError (SWa)
// when getTurnSpent() >= budget.total. Lives on the run controller closure (captures the budget).
declare function enforceWorkflowTokenBudget(ctx: WorkflowToolContext): void // T
declare function isStructuredOutputAttachment(event: unknown): event is {
  attachment: { type: 'structured_output'; data: unknown }
} // @417255
declare function isAssistantEvent(event: unknown): event is { message: { content: unknown[]; usage: unknown } } // @417274
declare function foldAgentResult(args: {
  lastAssistant: unknown
  structuredOutput: unknown
}): WorkflowAgentResult
