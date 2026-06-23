/**
 * WorkflowTool.tsx — the Dynamic-Workflow tool object (`Workflow` / `RunWorkflow`).
 *
 * Readable-source restoration of Claude Code v2.1.183. This is the tool registration
 * object built by the `buildTool` factory: name/aliases, lazy schemas, the long
 * description prompt, `validateInput` (the 7-code error ladder), `checkPermissions`
 * (ask-by-default + name-scoped allow suggestion), and `call` (the fire-and-forget
 * background launch). Source/parse/determinism/gate live in sibling files.
 *
 * ── Evidence tiers ─────────────────────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle:
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions read & verified for THIS file:
 *     - workflowTool object `DLp = pi({...})`                       @419420-419846
 *       · name/aliases/searchHint/isEnabled/prompt/description       @419421-419431
 *       · lazy getters inputSchema/outputSchema                      @419432-419437
 *       · toAutoClassifierInput                                      @419438-419440
 *       · validateInput (errorCodes 7,5,6,1,2,4,3)                   @419441-419477
 *       · checkPermissions (Vte lookup + ask-default + suggest)      @419479-419523
 *       · userFacingName / getToolUseSummary                         @419524-419540
 *       · call (resolve → parse → compile → launch → telemetry)      @419541-419788
 *       · render* delegates / mapToolResultToToolResultBlockParam    @419789-419845
 *     - input schema  `CLp = we(() => …strictObject…refine)`        @419334-419371
 *     - output schema `ILp = we(() => …object…)`                    @419372-419408
 *     - `WorkflowInputError` class `Vjn`                            @419409-419414
 *     - `serverFallbackRetraction` `r5a` (errorCode 7 literal)      @419415-419419
 *   Cross-referenced declarations (read, used by-name as imports):
 *     - tool factory `pi` (buildTool)                              @149995-149997
 *     - tool-name const `zk = "Workflow"` / `Utt = "code-review"`  @221550-221551
 *     - `WORKFLOW_DESCRIPTION` gdo                                  @418170
 *     - `resolveWorkflowSource` n5a                                @419272-419289
 *     - `parseWorkflowMeta` m0                                     @416466
 *     - `isNonDeterministic` rWa                                   @416439
 *     - `readWorkflowScriptFile` r0t                               @152126
 *     - `resolveNamedWorkflow` jjt(name, cwd)                      @418000-418002
 *     - `isWorkflowsEnabled` Pw / `isWorkflowsManagedDisabled` Kyn @148784 / @148777
 *     - `lookupPermissionRules` Vte(ctx, tool, behavior)→Map       @585562-585580
 *     - `getToolPermissionContext` Br                              @460389
 *     - `isRetractedByServerFallback` zCe                          @227026-227028
 *     - `cwd` Pt                                                   @46264
 *     - `TaskStop` tool-name const uP                              @220834
 *
 * 2.1.88 convention mirror (shape only — feature is `feature('WORKFLOW_SCRIPTS')`-gated
 *   out of the named tree, so nothing to copy, only the layout/idioms):
 *     /lyz/codespace/3rd/claude-code/src/Tool.ts            — Tool / ToolDef / ValidationResult /
 *                                                             PermissionResult / ToolUseContext / buildTool
 *     /lyz/codespace/3rd/claude-code/src/tools/AgentTool/AgentTool.tsx — buildTool({...}) tool-file layout,
 *                                                             ESM `.js` import specifiers, render* delegates
 *
 * 2.1.156 scaffold (readable logic + established names, RE-VERIFIED here):
 *     /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *       workflow_tool_definition.md  §1 (factory), §3 (schemas), §6 (validateInput), §7 (checkPermissions), §9 (call)
 *
 * Cross-validation note: re-read the entire `DLp` object in the 183 bundle line-by-line.
 *   Confirmed vs the 156 scaffold: SAME 4-of-the-old error codes (5,6,1,2,4,3) plus a
 *   NEW errorCode 7 server-fallback retraction pre-check (`zCe`→`r5a`) at the very top AND
 *   re-checked after source resolution (@419442, @419457). The determinism check moved to
 *   `rWa` (AST walk, the 2.1.172 fix) but is still applied only to inline `e.script`
 *   (@419461). checkPermissions is byte-for-byte the 156 shape with `Vte`/`Br`. The output
 *   schema gained `taskType` + `workflowName` (@419376-419385). Names re-mangled vs 156
 *   (mx→zk, n0_→DLp, Q0_→CLp, g0_→ILp, b44→n5a, FZ→m0, d6H→Vte, yK→pi); re-derived above.
 *   `aliases:["RunWorkflow"]` and `searchHint` confirmed verbatim @419422-419423.
 */

import * as crypto from 'crypto'

import {
  buildTool,
  type PermissionResult,
  type Tool,
  type ToolUseContext,
  type ValidationResult,
} from './Tool.js'
import { TASK_STOP_TOOL_NAME } from './constants.js' // uP @220834 = "TaskStop"
import { getToolPermissionContext } from '../../utils/permissions/permissionContext.js' // Br @460389
import { lookupPermissionRules } from '../../utils/permissions/permissions.js' // Vte @585562
import { getCwd } from '../../utils/cwd.js' // Pt @46264

// ── sibling files (this subsystem) ─────────────────────────────────────────────
import { WORKFLOW_TOOL_NAME, CODE_REVIEW_WORKFLOW_NAME } from './toolName.js' // zk/Utt @221550-221551
import {
  workflowInputSchema, // CLp @419334
  workflowOutputSchema, // ILp @419372
  WorkflowInputError, // Vjn @419409 — defined in schemas.ts (single source of truth)
  serverFallbackRetraction, // r5a @419415 — the errorCode 7 result, defined in schemas.ts
  abortedByServerFallback, // zCe @227026 — alias isRetractedByServerFallback
  type WorkflowInput, // z.infer of CLp
  type WorkflowOutput, // z.infer of ILp
} from './schemas.js'
import { WORKFLOW_DESCRIPTION } from './prompt.js' // gdo @418170
import {
  resolveWorkflowSource, // n5a @419272
  readWorkflowScriptFile, // r0t @152126
} from './source.js'
import { parseWorkflowMeta, isNonDeterministic } from './meta.js' // m0 @416466, rWa @416439 (static AST determinism check — owned by meta.ts)
import { resolveNamedWorkflow } from './workflowRegistry.js' // jjt @418000 (named-workflow registry — the module source.ts/runtime.ts also use)
import {
  isWorkflowsEnabled, // Pw @148784
  isWorkflowsManagedDisabled, // Kyn @148777
} from './gate_and_effort.js'
import { launchWorkflowRun } from './launch.js' // call()'s background launcher (deep dive: launch.tsx)
import {
  renderToolUseMessage, // JWa @419789
  renderToolUseProgressMessage, // QWa @419790
  renderToolResultMessage, // ZWa @419791
  renderToolUseRejectedMessage, // e5a @419792
} from './UI.js'

/**
 * The Workflow tool.
 *
 * `buildTool` (2.1.88 convention) overlays the supplied definition on TOOL_DEFAULTS,
 * preserving the `get inputSchema()` / `get outputSchema()` getters as getters (so the
 * Zod schemas stay lazily built). The 183 bundle uses the equivalent factory `pi`
 * (@149995), which does the same `Object.defineProperties({...defaults, userFacingName},
 * getOwnPropertyDescriptors(def))`.
 *
 * 2.1.183: workflowTool = DLp = pi({...}) @419420-419846
 * 2.1.88 convention: tools/WorkflowTool/WorkflowTool.tsx via buildTool (gated out externally)
 */
export const workflowTool = buildTool({
  name: WORKFLOW_TOOL_NAME, // "Workflow"                                      // @419421 zk
  aliases: ['RunWorkflow'], //                                                // @419422
  searchHint: 'orchestrate subagents with deterministic JavaScript workflow', // @419423
  maxResultSizeChars: 1e5, //                                                 // @419424

  // 2.1.183: isEnabled = () => Pw() @419425
  isEnabled: () => isWorkflowsEnabled(),

  // prompt() and description() return the same long opt-in policy + DSL reference.
  // 2.1.183: both return gdo (WORKFLOW_DESCRIPTION) @419426-419431
  async prompt() {
    return WORKFLOW_DESCRIPTION
  },
  async description() {
    return WORKFLOW_DESCRIPTION
  },

  // Lazy schema getters — Object.getOwnPropertyDescriptors preserves them as getters,
  // so the Zod objects are built once on first access, not at module load.
  // 2.1.183: get inputSchema = CLp() @419432-419434 ; get outputSchema = ILp() @419435-419437
  get inputSchema() {
    return workflowInputSchema()
  },
  get outputSchema() {
    return workflowOutputSchema()
  },

  // Auto-mode security classifier input: the script (the program being run) if present,
  // else the workflow name. 2.1.183 @419438-419440 (`e.script ?? e.name ?? ""`).
  toAutoClassifierInput(input) {
    return input.script ?? input.name ?? ''
  },

  // ───────────────────────────────────────────────────────────────────────────
  // validateInput — pre-flight gate run after the schema passes. Returns
  // {result:false, message, errorCode} on failure or {result:true}. The errorCode
  // enum lets the UI/telemetry distinguish failure classes.
  //
  // Order (exactly as in the bundle): 7 abort-retraction pre-check → 5 managed-off →
  // 6 not-enabled → resolve source → re-check 7 → 1 source error → 2 parse error →
  // 4 nondeterminism (inline script only) → 3 resume-conflict → ok.
  //
  // 2.1.183: validateInput @419441-419477
  // 2.1.156 scaffold: workflow_tool_definition.md §6 (the codes 5/6/1/2/4/3 carry over;
  //                   7 + the AST determinism check are 183-era additions)
  // ───────────────────────────────────────────────────────────────────────────
  async validateInput(
    input: WorkflowInput,
    context: ToolUseContext,
  ): Promise<ValidationResult> {
    // errorCode 7 — the dispatch was retracted by a server fallback; input may be
    // truncated. Checked BEFORE anything else so we never parse a half-streamed script.
    if (abortedByServerFallback(context.abortController.signal)) {
      return serverFallbackRetraction // @419442
    }

    // errorCode 5 — managed kill switch (`disableWorkflows`). Static refusal.
    if (isWorkflowsManagedDisabled()) {
      // @419443-419448
      return {
        result: false,
        message:
          'Dynamic workflows are disabled by managed settings (`disableWorkflows`).',
        errorCode: 5,
      }
    }

    // errorCode 6 — not enabled for this session. Re-checks isEnabled defensively (the
    // model was offered the tool, but session state may have changed mid-conversation);
    // distinct from 5 so the message is actionable.
    if (!isWorkflowsEnabled()) {
      // @419449-419455
      return {
        result: false,
        message:
          'Dynamic workflows are not enabled for this session (org policy, launch gate, or the "Dynamic workflows" setting in /config).',
        errorCode: 6,
      }
    }

    // Resolve scriptPath | name | inline script → script text (precedence scriptPath > name).
    const resolved = await resolveWorkflowSource(input) // @419456

    // Re-check the abort-retraction AFTER the (possibly async file/registry) resolution,
    // since a fallback could have landed while we were reading. @419457
    if (abortedByServerFallback(context.abortController.signal)) {
      return serverFallbackRetraction
    }

    // errorCode 1 — source resolution failed (unknown name, unreadable scriptPath, none given).
    if ('error' in resolved) {
      // @419458
      return { result: false, message: resolved.error, errorCode: 1 }
    }

    // errorCode 2 — `meta` parse failed (not a leading pure `export const meta` literal,
    // TS syntax, etc). The parser's own reason is wrapped.
    const parsed = parseWorkflowMeta(resolved.script) // @419459
    if ('error' in parsed) {
      // @419460
      return {
        result: false,
        message: `Invalid workflow script: ${parsed.error}`,
        errorCode: 2,
      }
    }

    // errorCode 4 — determinism violation. Only enforced on the INLINE `input.script`
    // path: named / scriptPath workflows are assumed already-vetted, and re-checking on
    // every resume would be wasted work. `isNonDeterministic` is the 2.1.172 AST walk
    // (Date.now / Math.random / argless `new Date()`), applied to the script BODY.
    // Nondeterminism breaks resume: cached agent() results are keyed on (prompt, opts),
    // so wall-clock/random control flow would diverge from the original run.
    if (input.script && isNonDeterministic(parsed.scriptBody)) {
      // @419461
      return {
        result: false,
        message:
          'Workflow scripts must be deterministic: Date.now()/Math.random()/new Date() are unavailable (breaks resume). Stamp results after the workflow returns, or pass timestamps via args.',
        errorCode: 4,
      }
    }

    // errorCode 3 — resume conflict: the named run is still `running`. The model must
    // stop it first with TaskStop before resuming. @419468-419475
    if (input.resumeFromRunId) {
      for (const [taskId, task] of Object.entries(context.taskRegistry.all())) {
        if (
          task.type === 'local_workflow' &&
          task.status === 'running' &&
          task.workflowRunId === input.resumeFromRunId
        ) {
          return {
            result: false,
            message: `Workflow ${input.resumeFromRunId} is still running (task ${taskId}). Stop it first with ${TASK_STOP_TOOL_NAME}({taskId: "${taskId}"}) before resuming.`,
            errorCode: 3,
          }
        }
      }
    }

    return { result: true } // @419477
  },

  // ───────────────────────────────────────────────────────────────────────────
  // checkPermissions — decides allow/deny/ask. Because a workflow runs arbitrary code,
  // the DEFAULT is `ask`; only an explicit allow rule short-circuits the prompt.
  //
  // Rules are keyed by workflow *name*: an inline `script` or ad-hoc `scriptPath` has no
  // stable identity, so its rule key is undefined and no name rule can match → always ask.
  // Before prompting, the actual script is resolved into `updatedInput` so the approval
  // UI shows what will run, not just a path/name.
  //
  // 2.1.183: checkPermissions @419479-419523
  // 2.1.156 scaffold: workflow_tool_definition.md §7 (logic unchanged; d6H→Vte rename)
  // ───────────────────────────────────────────────────────────────────────────
  async checkPermissions(
    input: WorkflowInput,
    context: ToolUseContext,
  ): Promise<PermissionResult> {
    const permissionContext = getToolPermissionContext(context) // @419480  Br(t)
    // Rule key: only a named workflow has a stable identity. scriptPath → undefined. @419481
    const ruleKey = input.scriptPath ? undefined : input.name
    // O(1) name lookup into the rule map for a given behavior. @419482
    const lookupRule = (behavior: 'deny' | 'ask' | 'allow') =>
      ruleKey
        ? lookupPermissionRules(permissionContext, WORKFLOW_TOOL_NAME, behavior).get(ruleKey)
        : undefined

    // Deny first. @419483-419489
    const denyRule = lookupRule('deny')
    if (denyRule) {
      return {
        behavior: 'deny',
        message: `Workflow ${ruleKey} blocked by permission rules`,
        decisionReason: { type: 'rule', rule: denyRule },
      }
    }

    // Resolve the script into updatedInput so the human reviews the real script.
    // scriptPath → read the file; name → resolve from the registry. @419490-419497
    let updatedInput: WorkflowInput = input
    if (input.scriptPath) {
      const file = await readWorkflowScriptFile(input.scriptPath)
      if (!('error' in file)) {
        updatedInput = { ...input, script: file.script }
      }
    } else if (input.name) {
      const named = await resolveNamedWorkflow(input.name, getCwd())
      updatedInput = { ...input, script: named?.script }
    }

    // Ask rule. @419498-419505
    const askRule = lookupRule('ask')
    if (askRule) {
      return {
        behavior: 'ask',
        message: 'Review dynamic workflow before running',
        updatedInput,
        decisionReason: { type: 'rule', rule: askRule },
      }
    }

    // Allow rule. @419506-419507
    const allowRule = lookupRule('allow')
    if (allowRule) {
      return {
        behavior: 'allow',
        updatedInput,
        decisionReason: { type: 'rule', rule: allowRule },
      }
    }

    // Default → ask, with a name-scoped "always allow this workflow" suggestion (only
    // when a stable name exists). @419508-419522
    return {
      behavior: 'ask',
      message: 'Review dynamic workflow before running',
      updatedInput,
      ...(ruleKey && {
        suggestions: [
          {
            type: 'addRules',
            rules: [{ toolName: WORKFLOW_TOOL_NAME, ruleContent: ruleKey }],
            behavior: 'allow',
            destination: 'localSettings',
          },
        ],
      }),
    }
  },

  // 2.1.183: userFacingName @419524-419526
  userFacingName() {
    return 'Workflow'
  },

  // Short summary for compact views: prefer the explicit name, else the parsed
  // meta.description, else the first non-empty line of the script (truncated to 50).
  // 2.1.183: getToolUseSummary @419527-419540
  getToolUseSummary(input) {
    if (input?.name) return `dynamic workflow: ${input.name}` // @419528
    if (!input?.script) return null // @419529
    const parsed = parseWorkflowMeta(input.script) // @419530
    if (!('error' in parsed)) return parsed.meta.description // @419531
    // Parse failed → fall back to the first non-blank line of the raw script. @419532-419538
    const firstLine =
      input.script.split('\n').find((line) => line.trim()) ?? ''
    return firstLine.length > 50 ? firstLine.slice(0, 49) + '…' : firstLine // @419539
  },

  // ───────────────────────────────────────────────────────────────────────────
  // call — the actual launcher. Resolves + parses again (belt-and-suspenders vs
  // validateInput), compiles the body to a VM script, mints/reuses a run id, persists
  // the script, emits `tengu_workflow_launched`, and spawns the VM in a background IIFE.
  // Returns the `async_launched` result IMMEDIATELY (fire-and-forget); the IIFE keeps
  // running and feeds the /workflows progress display, then emits `tengu_workflow_completed`
  // (+ per-phase rollups) and writes the final task state.
  //
  // The full background machinery (progress batching, agent-controller registry, token
  // budget, journal, phase rollups, completion/failure persistence) is reconstructed in
  // the launch sibling file; here `call` is the thin synchronous entry that:
  //   1. resolves source (throws WorkflowInputError on error)            @419542-419543
  //   2. parses meta (throws on error)                                   @419545-419546
  //   3. mints runId = resumeFromRunId ?? `wf_${uuid12}`                 @419547
  //   4. on compile failure: returns async_launched + error (no throw)   @419552-419567
  //   5. delegates the launch + background IIFE                          @419568-419787
  //
  // 2.1.183: call @419541-419788
  // 2.1.156 scaffold: workflow_tool_definition.md §9
  // ───────────────────────────────────────────────────────────────────────────
  async call(input, context, canUseTool, parentMessage, onProgress) {
    // @419542-419543 — resolve again; a resolution error here is a hard throw.
    const resolved = await resolveWorkflowSource(input)
    if ('error' in resolved) throw new WorkflowInputError(resolved.error)

    const { script, source, resolvedScriptPath } = resolved // @419544

    // @419545-419546 — parse again; a parse error here is a hard throw.
    const parsed = parseWorkflowMeta(script)
    if ('error' in parsed) {
      throw new WorkflowInputError(`Invalid workflow script: ${parsed.error}`)
    }

    // @419547 — reuse the resume run id, or mint a fresh `wf_<12-hex>` (matches the
    // resumeFromRunId regex `^wf_[a-z0-9-]{6,}$`).
    const runId =
      input.resumeFromRunId ?? `wf_${crypto.randomUUID().slice(0, 12)}`

    // Everything past here — compile (returns {status:'async_launched', error} WITHOUT
    // throwing on compile failure @419552-419567), persist, launch telemetry, the
    // background IIFE with progress batching / journal / phase rollups, and the final
    // async_launched result @419775-419786 — is in the launch sibling. It needs all of
    // call's args plus the resolved/parsed values and the run id.
    return launchWorkflowRun({
      input,
      context,
      canUseTool,
      parentMessage,
      onProgress,
      script,
      source,
      resolvedScriptPath,
      meta: parsed.meta,
      scriptBody: parsed.scriptBody,
      runId,
    })
  },

  // Render delegates live in the UI sibling (AgentTool-style separation).
  // 2.1.183: renderToolUseMessage=JWa, renderToolUseProgressMessage=QWa,
  //          renderToolResultMessage=ZWa, renderToolUseRejectedMessage=e5a @419789-419792
  renderToolUseMessage,
  renderToolUseProgressMessage,
  renderToolResultMessage,
  renderToolUseRejectedMessage,

  // ───────────────────────────────────────────────────────────────────────────
  // mapToolResultToToolResultBlockParam — turn the tool result into the model-facing
  // tool_result block. Three shapes: compile-error, remote (CCR) launch, and the normal
  // local background launch (Task ID + summary + transcript dir + iterate/resume hints).
  // 2.1.183: @419793-419845
  // ───────────────────────────────────────────────────────────────────────────
  mapToolResultToToolResultBlockParam(output: WorkflowOutput, toolUseId: string) {
    // Syntax/compile error → is_error result. @419794-419801
    if (output.error) {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result' as const,
        content: `Workflow script has a syntax error and was not launched:\n${output.error}`,
        is_error: true,
      }
    }

    // Remote (CCR cloud) launch. @419802-419821
    if (output.status === 'remote_launched') {
      return {
        tool_use_id: toolUseId,
        type: 'tool_result' as const,
        content:
          `Workflow launched in a remote CCR session. Task ID: ${output.taskId}\n` +
          `Session: ${output.sessionUrl}\n` +
          (output.summary ? `Summary: ${output.summary}\n` : '') +
          (output.warning ? `Warning: ${output.warning}\n` : '') +
          `\nThe workflow runs against a fresh clone of the pushed branch; phase progress is visible at the session URL, not in /workflows. You will be notified when it completes.`,
        is_error: false,
      }
    }

    // Normal local background launch. @419822-419844
    const summaryLine = output.summary ? `\nSummary: ${output.summary}` : ''
    const transcriptLine = output.transcriptDir
      ? `\nTranscript dir: ${output.transcriptDir}`
      : ''
    const scriptLine = output.scriptPath
      ? `\nScript file: ${output.scriptPath}\n(Edit this file with Write/Edit and re-invoke Workflow with {scriptPath: "${output.scriptPath}"} to iterate without resending the script.)`
      : ''
    const resumeLine =
      output.scriptPath && output.runId
        ? `\nRun ID: ${output.runId}\nTo resume after editing the script: Workflow({scriptPath: "${output.scriptPath}", resumeFromRunId: "${output.runId}"}) — completed agents return cached results.`
        : ''

    const content = `Workflow launched in background. Task ID: ${output.taskId}${summaryLine}${transcriptLine}${scriptLine}${resumeLine}\n\nYou will be notified when it completes. Use /workflows to watch live progress.`
    return { tool_use_id: toolUseId, type: 'tool_result' as const, content, is_error: false }
  },
}) satisfies Tool

// Re-export the code-review workflow name alongside the tool name (the 183 namespace
// object `y1i` exposes both as lazy getters). @221549-221551
export { WORKFLOW_TOOL_NAME, CODE_REVIEW_WORKFLOW_NAME }

/*
 * ── Mapping (this file) ──────────────────────────────────────────────────────
 *   workflowTool                = DLp   @419420
 *   buildTool (factory)         = pi    @149995
 *   WORKFLOW_TOOL_NAME          = zk    @221550   ("Workflow")
 *   CODE_REVIEW_WORKFLOW_NAME   = Utt   @221551   ("code-review")
 *   WorkflowInputError          = Vjn   @419409
 *   serverFallbackRetraction    = r5a   @419415   (errorCode 7)
 *   workflowInputSchema         = CLp   @419334
 *   workflowOutputSchema        = ILp   @419372
 *   WORKFLOW_DESCRIPTION        = gdo   @418170
 *   resolveWorkflowSource       = n5a   @419272
 *   parseWorkflowMeta           = m0    @416466
 *   isNonDeterministic          = rWa   @416439
 *   readWorkflowScriptFile      = r0t   @152126
 *   resolveNamedWorkflow        = jjt   @418000
 *   isWorkflowsEnabled          = Pw    @148784
 *   isWorkflowsManagedDisabled  = Kyn   @148777
 *   lookupPermissionRules       = Vte   @585562
 *   getToolPermissionContext    = Br    @460389
 *   isRetractedByServerFallback = zCe   @227026
 *   getCwd                      = Pt    @46264
 *   TASK_STOP_TOOL_NAME         = uP    @220834   ("TaskStop")
 *   launchWorkflowRun           = (the call() background launcher; deep dive in launch sibling)
 *   render* delegates           = JWa/QWa/ZWa/e5a @419789-419792 (UI sibling)
 *   input  → e ; context → t ; ruleKey → r ; lookupRule → o ; updatedInput → i
 */
