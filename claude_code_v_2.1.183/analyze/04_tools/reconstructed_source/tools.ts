/**
 * tools.ts — Built-in tool REGISTRY + ASSEMBLY pipeline (readable-source restoration, v2.1.183)
 *
 * This is the registry/assembly layer of the tools subsystem: the single exhaustive
 * `getAllBaseTools` array, the preset machinery, and the deny / REPL / isEnabled / MCP-merge
 * pipeline that turns that array into the live tool menu the model sees.
 *
 * ── 2.1.183 source regions covered (PRIMARY bundle cli_inner_pretty.js, 699,346 lines) ──
 *   parseToolPreset            xfo @436507-436511
 *   getToolsForDefaultPreset   kfo @436512-436516
 *   getAllBaseTools            LW  @436517-436577   (the exhaustive built-in array)
 *   filterToolsByDenyRules     Fce @436578-436580
 *   assembleToolPool           YY  @436581-436588
 *   conditional-slot decls     @436589-436621  (var w$p,C$p,Zza,…,Edt,Ifo,L$p)
 *   TOOL_PRESETS               L$p @436621 decl / @436713 assign (= ["default"])
 *   getTools                   zR  @436622-436652  (arrow var)
 *   slot population + publish   @436700-436714  (initializeBundledTools tail of thunk zL; jAi(LW))
 *   getMergedTools             iqe @539937-539945
 *   useMergedTools (hook)      m6n @539962-539973
 *   gate predicates: Su @221433, _H @299032, udt @431046, Ifo @436617, fR @221224,
 *                    Qw @291885, Pw @148784, jot @291890, Lx @272589, N3t @585524
 *   special-name const Em "StructuredOutput" @221489
 *
 * ── 2.1.88 convention mirror ── /lyz/codespace/3rd/claude-code/src/tools.ts
 *     (getAllBaseTools / getToolsForDefaultPreset / filterToolsByDenyRules / getTools /
 *      assembleToolPool / getMergedTools / TOOL_PRESETS / parseToolPreset)
 * ── 2.1.156 scaffold ── 04_tools/workflow_tool_registration.md (registration pipeline,
 *     readable names ra/Jk/zl inherited as getAllBaseTools/getTools/assembleToolPool)
 *
 * ── Cross-validation (re-read in the 183 bundle this session) ──
 *   • LW array text @436518-436576 read verbatim; every conditional spread + named slot confirmed.
 *   • Su/_H/udt/Ifo/Qw/Pw/jot/Lx bodies read directly; gate polarities confirmed.
 *   • TeamCreate/TeamDelete: 0 matches for "TeamCreate"/"TeamDelete" in 2.1.183 — REMOVED (2.1.178).
 *     The 2.1.156 "agent-team" spread is superseded by `_H()?[Task* tools]` and
 *     `udt()?[EnterWorktree,ExitWorktree]`. No Team* tools are reconstructed here.
 *   • NEW in 2.1.183 vs 2.1.156: DesignSyncTool slot (k$p) and Projects slot (iKa, CLAUDE_PROJECT_TOOL).
 *
 * NOTE: This mirrors the genuine source layout. The huge per-tool imports of 2.1.88 are, in the
 * 2.1.183 bundle, lazy module slots populated once in the registry init thunk (`initializeBundledTools`).
 * We keep that shape (slots + `...(slot ? [slot] : [])` spreads) because it is load-bearing for
 * prompt-cache stability and null-safety.
 */

import uniqBy from 'lodash-es/uniqBy.js'
import {
  toolMatchesName,
  getEmptyToolPermissionContext,
  type Tool,
  type Tools,
  type ToolPermissionContext,
} from './Tool.js'

// ── Built-in tool objects, name constants, gates (re-derived obf names noted inline) ──
import { AgentTool } from './tools/AgentTool/AgentTool.js' // 2.1.183: AgentTool = f3n (name "Agent" vs @149939)
import { TaskOutputTool } from './tools/TaskOutputTool/TaskOutputTool.js' // q3n (name "TaskOutput" W9 @221313)
import { BashTool } from './tools/BashTool/BashTool.js' // Cl (name "Bash" ns @145275)
import { GlobTool } from './tools/GlobTool/GlobTool.js' // hj
import { GrepTool } from './tools/GrepTool/GrepTool.js' // OR
import { ExitPlanModeTool } from './tools/ExitPlanModeTool/ExitPlanModeTool.js' // Ij (name "ExitPlanMode" WM @152253)
import { FileReadTool } from './tools/FileReadTool/FileReadTool.js' // hg (name "Read" Ws @152217)
import { FileEditTool } from './tools/FileEditTool/FileEditTool.js' // kH (name "Edit" Fa @152083)
import { FileWriteTool } from './tools/FileWriteTool/FileWriteTool.js' // yE (name "Write" Kc @193030)
import { NotebookEditTool } from './tools/NotebookEditTool/NotebookEditTool.js' // wW (name "NotebookEdit" xL @221448)
import { WebFetchTool } from './tools/WebFetchTool/WebFetchTool.js' // gF (name "WebFetch" nE @210992)
import { TodoWriteTool } from './tools/TodoWriteTool/TodoWriteTool.js' // Dxe (name "TodoWrite" mR @221398)
import { WebSearchTool } from './tools/WebSearchTool/WebSearchTool.js' // V3n (name "WebSearch" rG @221393)
import { TaskStopTool } from './tools/TaskStopTool/TaskStopTool.js' // edt (name "TaskStop" uP @220834)
import { AskUserQuestionTool } from './tools/AskUserQuestionTool/AskUserQuestionTool.js' // sut (name "AskUserQuestion" Ff @221315)
import { SkillTool } from './tools/SkillTool/SkillTool.js' // lut (name "Skill" mH @221449)
import { EnterPlanModeTool } from './tools/EnterPlanModeTool/EnterPlanModeTool.js' // a2n (name "EnterPlanMode" A7 @221314)
import { ListMcpResourcesTool } from './tools/ListMcpResourcesTool/ListMcpResourcesTool.js' // _G
import { ReadMcpResourceTool } from './tools/ReadMcpResourceTool/ReadMcpResourceTool.js' // kG
import { ToolSearchTool } from './tools/ToolSearchTool/ToolSearchTool.js' // IMt (name "ToolSearch" DA @221267)
import { WaitForMcpServersTool } from './tools/WaitForMcpServersTool/WaitForMcpServersTool.js' // sla (name "WaitForMcpServers" kCe @221698)
import { REPLTool } from './tools/REPLTool/REPLTool.js' // wpo (name "REPL" PA @221566)
import {
  ScheduleWakeupTool, // Y9a (name "ScheduleWakeup" $g @220800)
} from './tools/ScheduleWakeupTool/ScheduleWakeupTool.js'

// Task* family — gated by _H() (CLAUDE_CODE_ENABLE_TASKS). aVa/dVa/AVa/bVa.
import { TaskCreateTool } from './tools/TaskCreateTool/TaskCreateTool.js' // aVa (name "TaskCreate" Vw @221451)
import { TaskGetTool } from './tools/TaskGetTool/TaskGetTool.js' // dVa (name "TaskGet" g7 @221452)
import { TaskUpdateTool } from './tools/TaskUpdateTool/TaskUpdateTool.js' // AVa (name "TaskUpdate" dP @221453)
import { TaskListTool } from './tools/TaskListTool/TaskListTool.js' // bVa (name "TaskList" IL @220833)

// Worktree pair — gated by udt() (returns true in this build). G8a/Z8a.
import { EnterWorktreeTool } from './tools/EnterWorktreeTool/EnterWorktreeTool.js' // G8a (name "EnterWorktree" WAe @221266)
import { ExitWorktreeTool } from './tools/ExitWorktreeTool/ExitWorktreeTool.js' // Z8a (name "ExitWorktree" ZTn @221547)

import { ShowOnboardingRolePickerTool } from './tools/ShowOnboardingRolePickerTool/ShowOnboardingRolePickerTool.js' // Eqa (name "ShowOnboardingRolePicker" A3n @424336)
import { SendUserMessageTool } from './tools/SendUserMessageTool/SendUserMessageTool.js' // o9a (name "SendUserMessage" KO @221278)

// SendMessageTool reached via a lazy getter (not a slot) to break a circular import.
// 2.1.183: getSendMessageTool = Cfo @436602  ( () => requireLazy(mod).SendMessageTool )
import { getSendMessageTool } from './tools/SendMessageTool/SendMessageTool.js'

// Tool-name constants / gate predicates (re-derived in the 183 bundle)
import { REPL_TOOL_NAME, REPL_ONLY_TOOLS, isReplModeEnabled } from './tools/REPLTool/constants.js' // PA / jtt / nI
import { SYNTHETIC_OUTPUT_TOOL_NAME } from './tools/SyntheticOutputTool/SyntheticOutputTool.js' // Em = "StructuredOutput" @221489
import { getDenyRuleForTool } from './utils/permissions/permissions.js' // N3t @585524 (isToolDenied)
import { isToolSearchEnabledOptimistic } from './utils/toolSearch.js' // fR @221224
import { isToolSearchActive } from './utils/toolSearch.js' // Qw @291885
import { areEmbeddedSearchToolsActive } from './utils/embeddedTools.js' // jot @291890 → suppressed-name Set
import { isTasksEnabled } from './utils/tasks.js' // _H @299032 (CLAUDE_CODE_ENABLE_TASKS)
import { isWorktreeModeEnabled } from './utils/worktreeModeEnabled.js' // udt @431046
import { isBashToolAvailable } from './utils/shell/shellToolUtils.js' // Su @221433
import { getPowerShellTool } from './utils/shell/shellToolUtils.js' // Ifo @436617
import { isWorkflowsEnabled } from './tools/WorkflowTool/gates.js' // Pw @148784

// Lazy module slots, populated once by initializeBundledTools (see bottom of file).
// All are `null`/`undefined` until the registry init thunk runs.
import {
  cronToolsSlot, // w$p  = [CronCreate, CronDelete, CronList]
  emptySlotA, // C$p   = []  (reserved)
  remoteTriggerSlot, // Zza
  monitorSlot, // rKa
  sendUserFileSlot, // x$p  (SendUserFile)
  pushNotificationSlot, // oKa
  designSyncSlot, // k$p  (DesignSync) — NEW in 2.1.183
  projectsToolSlot, // iKa  (Projects) — NEW in 2.1.183, CLAUDE_PROJECT_TOOL
  artifactSlot, // dKa  (Artifact)
  shareOnboardingSlot, // _Ka  (ShareOnboardingGuide)
  workflowToolSlot, // Edt  (Workflow) — IIFE-populated after initBundledWorkflows()
  lspToolSlot, // Opo  (name "LSP" Vlt @368922; isLsp:true, shouldDefer:true) — env-gated, st("true")
  coordinatorModeModule, // AKa  — requireLazy(coordinatorMod); has .isCoordinatorMode()
  // ── reserved/empty slots kept for array-position stability (all null in this build) ──
  reservedSlot_mKa,
  reservedSlot_pKa,
  reservedSlot_fKa,
  reservedSlot_lKa,
  reservedSlot_cKa,
  reservedSlot_uKa,
  reservedSlot_yKa,
  reservedSlot_aKa,
  reservedSlot_eKa,
  reservedSlot_tKa,
  reservedSlot_nKa,
  reservedSlot_sKa,
  reservedSlot_gKa,
  reservedSlot_hKa, // hKa is a thunk: spread as `...(hKa ? [hKa()] : [])`
  emptySlotB, // I$p = []
} from './registry/toolSlots.js'

import { partitionByMcp, isMcpTool, filterCoordinatorTools } from './registry/mcpMerge.js' // d$e / Lx / lwl

/* ────────────────────────────────────────────────────────────────────────────
 * Presets
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Predefined tool presets usable with the `--tools` flag.
 * 2.1.183: assigned `["default"]` at cli_inner_pretty.js:436713 (the only valid preset).
 */
// 2.1.183: TOOL_PRESETS = L$p @436621 (decl) / @436713 (assign)
export const TOOL_PRESETS = ['default'] as const

export type ToolPreset = (typeof TOOL_PRESETS)[number]

// 2.1.183: parseToolPreset = xfo @436507-436511
export function parseToolPreset(preset: string): ToolPreset | null {
  const presetString = preset.toLowerCase() // @436508
  if (!TOOL_PRESETS.includes(presetString as ToolPreset)) {
    return null // @436509 — not a known preset
  }
  return presetString as ToolPreset
}

/**
 * Enabled-only NAME list for `--tools default`.
 * Mask-then-filter: `isEnabled()` is evaluated exactly once per tool into an array, then used as the
 * filter — avoids re-invoking side-effecting gates mid-iteration (same trick as getTools).
 */
// 2.1.183: getToolsForDefaultPreset = kfo @436512-436516
export function getToolsForDefaultPreset(): string[] {
  const tools = getAllBaseTools()
  const isEnabled = tools.map(tool => tool.isEnabled()) // @436514 — single isEnabled() call each
  return tools.filter((_, i) => isEnabled[i]).map(tool => tool.name) // @436515
}

/* ────────────────────────────────────────────────────────────────────────────
 * getAllBaseTools — the exhaustive, hand-ordered built-in tool array
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The complete exhaustive list of every tool that COULD be available in the current environment
 * (respecting env flags + gates). Source of truth for everything the model could ever see.
 *
 * Order is hand-tuned and MUST stay stable: the server-side `claude_code_global_system_caching`
 * dynamic config places the system-prompt cache breakpoint after the last built-in, so every
 * conditional tool is spread as `...(slot ? [slot] : [])` — contributing exactly one element at a
 * fixed position or zero (no `undefined` holes, no reshuffle). See the 2.1.88 mirror's caching note.
 *
 * Gate polarities (verified in the 183 bundle):
 *   Su()   @221433  — Bash slot present unless Windows-without-GitBash.  `Kt()!=="windows" || Cpe()!==null`
 *   jot()  @291890  — embedded-search suppression Set (find/grep aliased to embedded bfs/ugrep) → drops Glob/Grep
 *   _H()   @299032  — Task* tools present unless CLAUDE_CODE_ENABLE_TASKS is falsy (inverted via yl). Default ON.
 *   st("true")       — env-gated experimental slot (experimentalOpoSlot).
 *   udt()  @431046  — worktree pair present (returns true in this build).
 *   Ifo()  @436617  — PowerShell tool lazily required only when JO() (PowerShell available).
 *   fR()   @221224  — ToolSearch optimistic gate (mode/host/Vertex checks).
 */
// 2.1.183: getAllBaseTools = LW @436517-436577
export function getAllBaseTools(): Tools {
  return [
    AgentTool, // f3n
    TaskOutputTool, // q3n
    ...(isBashToolAvailable() ? [BashTool] : []), // Su() ? [Cl] : []  @436521
    // Embedded-search builds alias find/grep to bundled bfs/ugrep, so drop the dedicated Glob/Grep
    // when their names are in the suppression Set jot().
    ...[GlobTool, GrepTool].filter(t => !areEmbeddedSearchToolsActive().has(t.name)), // @436522
    ExitPlanModeTool, // Ij
    FileReadTool, // hg
    FileEditTool, // kH
    FileWriteTool, // yE
    NotebookEditTool, // wW
    WebFetchTool, // gF
    TodoWriteTool, // Dxe
    WebSearchTool, // V3n
    TaskStopTool, // edt
    AskUserQuestionTool, // sut
    SkillTool, // lut
    EnterPlanModeTool, // a2n
    ...[], // reserved empty splice @436535
    designSyncSlot, // k$p — DesignSync (NEW in 2.1.183; always present once init runs)  @436536
    ...(projectsToolSlot ? [projectsToolSlot] : []), // iKa — Projects (NEW; CLAUDE_PROJECT_TOOL)  @436537
    ...(reservedSlot_mKa ? [reservedSlot_mKa] : []),
    ...(isTasksEnabled() ? [TaskCreateTool, TaskGetTool, TaskUpdateTool, TaskListTool] : []), // _H() ? [aVa,dVa,AVa,bVa]  @436539
    ...(artifactSlot ? [artifactSlot] : []), // dKa
    ...(reservedSlot_pKa ? [reservedSlot_pKa] : []),
    ...(reservedSlot_fKa ? [reservedSlot_fKa] : []),
    ...(isEnvTruthyExperimental() ? [lspToolSlot] : []), // st("true") ? [Opo] : []  @436543 — LSP tool (Opo @429593, name "LSP" Vlt @368922; isLsp/shouldDefer), env-gated
    ...(reservedSlot_lKa ? [reservedSlot_lKa] : []),
    ...(reservedSlot_cKa ? [reservedSlot_cKa] : []),
    ...(reservedSlot_uKa ? [reservedSlot_uKa] : []),
    ...(isWorktreeModeEnabled() ? [EnterWorktreeTool, ExitWorktreeTool] : []), // udt() ? [G8a,Z8a]  @436547
    getSendMessageTool(), // Cfo() — lazy getter  @436548
    ...(reservedSlot_yKa ? [reservedSlot_yKa] : []),
    ...(shareOnboardingSlot ? [shareOnboardingSlot] : []), // _Ka
    ...(reservedSlot_aKa ? [reservedSlot_aKa] : []),
    REPLTool, // wpo  @436552
    ...(workflowToolSlot ? [workflowToolSlot] : []), // Edt — Workflow slot, present once initBundledWorkflows() ran  @436553
    ...cronToolsSlot, // w$p — [CronCreate, CronDelete, CronList]  @436554
    ...emptySlotA, // C$p — []  @436555
    ScheduleWakeupTool, // Y9a  @436556
    ...(remoteTriggerSlot ? [remoteTriggerSlot] : []), // Zza
    ...(reservedSlot_eKa ? [reservedSlot_eKa] : []),
    ...(reservedSlot_tKa ? [reservedSlot_tKa] : []),
    ShowOnboardingRolePickerTool, // Eqa  @436560
    ...(reservedSlot_nKa ? [reservedSlot_nKa] : []),
    ...emptySlotB, // I$p — []  @436562
    ...(monitorSlot ? [monitorSlot] : []), // rKa  @436563
    SendUserMessageTool, // o9a  @436564
    sendUserFileSlot, // x$p — SendUserFile (always present once init runs)  @436565
    ...(pushNotificationSlot ? [pushNotificationSlot] : []), // oKa
    ...(reservedSlot_sKa ? [reservedSlot_sKa] : []),
    ...(getPowerShellTool() ? [getPowerShellTool()!] : []), // Ifo() ? [Ifo()] : []  @436568 — PowerShell, lazily required
    ...(reservedSlot_gKa ? [reservedSlot_gKa] : []),
    ...(reservedSlot_hKa ? [reservedSlot_hKa()] : []), // hKa is a thunk → call it  @436570
    ...[], // reserved empty splice @436571
    ListMcpResourcesTool, // _G  @436572
    ReadMcpResourceTool, // kG  @436573
    ...(isToolSearchEnabledOptimistic() ? [ToolSearchTool] : []), // fR() ? [IMt] : []  @436574 — ToolSearch (optimistic; real defer at request time)
    WaitForMcpServersTool, // sla  @436575
  ]
}

// st("true") — truthy-string env parse (st @163) used as the LSP-tool slot gate (and by Qw/tool-search). @436543
// helper: st @<env-parse> — parses an env value as the literal string "true"
function isEnvTruthyExperimental(): boolean {
  return parseEnvTrue('true') // placeholder for the st("true") call; see registry/envUtils
}

/* ────────────────────────────────────────────────────────────────────────────
 * Deny-rule filter
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Strip tools blanket-denied by the permission context, and tools whose MCP server is blocked.
 * Uses the same matcher as the runtime permission check (step 1a), so MCP server-prefix rules
 * (`mcp__server`) strip every tool from that server before the model sees it.
 */
// 2.1.183: filterToolsByDenyRules = Fce @436578-436580
export function filterToolsByDenyRules<
  T extends { name: string; mcpInfo?: { effectiveMaxPermission?: string } },
>(tools: readonly T[], permissionContext: ToolPermissionContext): T[] {
  return tools.filter(
    tool =>
      !getDenyRuleForTool(permissionContext, tool) && // N3t: deny-rule match
      tool.mcpInfo?.effectiveMaxPermission !== 'blocked', // MCP server blocked  @436579
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * getTools — the production built-in pool (deny / REPL / isEnabled mask)
 * ──────────────────────────────────────────────────────────────────────────── */

interface GetToolsOptions {
  /** When true, the REPL-mode primitive-hiding step is skipped (e.g. for subagent assembly). */
  skipReplFilter?: boolean
}

/**
 * The built-in pool after the CLAUDE_CODE_SIMPLE fast-path, deny-rule filter, REPL-mode filter, and
 * isEnabled() mask. This is what feeds assembleToolPool / getMergedTools.
 *
 * Three special tools are dropped here because they are added conditionally elsewhere:
 *   ListMcpResources (_G.name), ReadMcpResource (kG.name), StructuredOutput (Em = "StructuredOutput" @221489).
 */
// 2.1.183: getTools = zR @436622-436652 (declared as an arrow var among the slot decls)
export const getTools = (
  permissionContext: ToolPermissionContext,
  options?: GetToolsOptions,
): Tools => {
  // ── CLAUDE_CODE_SIMPLE minimal-tools fast path ──  @436623
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    // --bare + REPL: REPL wraps the primitives inside the VM, so expose REPL not the raw tools.
    if (isReplModeEnabled() && !options?.skipReplFilter) {
      const minimal: Tool[] = [REPLTool, FileEditTool, FileWriteTool] // [wpo, kH, yE]  @436625
      if (coordinatorModeModule?.isCoordinatorMode()) {
        // Inline AND of slot truthiness with the runtime Workflow gate Pw() — the only place
        // the workflow slot truthiness is combined with a gate inline.  @436626
        minimal.push(
          AgentTool,
          TaskStopTool, // edt
          getSendMessageTool(),
          ...(workflowToolSlot && isWorkflowsEnabled() ? [workflowToolSlot] : []),
        )
      }
      return filterToolsByDenyRules(minimal, permissionContext)
    }
    const powerShell = getPowerShellTool() // Ifo()  @436629
    const minimal: Tool[] = [
      ...(isBashToolAvailable() ? [BashTool] : []),
      ...(powerShell ? [powerShell] : []),
      FileReadTool, // hg
      FileEditTool, // kH
    ]
    if (coordinatorModeModule?.isCoordinatorMode()) {
      minimal.push(
        AgentTool,
        TaskStopTool,
        getSendMessageTool(),
        ...(workflowToolSlot && isWorkflowsEnabled() ? [workflowToolSlot] : []), // @436631
      )
    }
    return filterToolsByDenyRules(minimal, permissionContext)
  }

  // ── normal path ──
  // 1. drop the 3 "special" tools handled conditionally elsewhere.  @436634
  const specialTools = new Set([
    ListMcpResourcesTool.name, // _G.name
    ReadMcpResourceTool.name, // kG.name
    SYNTHETIC_OUTPUT_TOOL_NAME, // Em = "StructuredOutput"
  ])
  let allowedTools = filterToolsByDenyRules(
    getAllBaseTools().filter(tool => !specialTools.has(tool.name)),
    permissionContext,
  )

  // Remember whether Bash survived — used by the tool-search fallback re-add below.  @436637
  const bashPresent =
    allowedTools.some(tool => toolMatchesName(tool, BashTool.name)) && BashTool.isEnabled()
  let replFiltered = false

  // 2. REPL-mode filter: when the REPL tool is present and not skipped, hide REPL-only primitives.
  if (isReplModeEnabled() && !options?.skipReplFilter) {
    if (allowedTools.some(tool => toolMatchesName(tool, REPL_TOOL_NAME))) {
      // PA === "REPL"
      allowedTools = allowedTools.filter(tool => !REPL_ONLY_TOOLS.has(tool.name)) // jtt set  @436640
      replFiltered = true
    }
  }

  // 3. isEnabled() mask-then-filter.  @436642
  const isEnabled = allowedTools.map(tool => tool.isEnabled())
  let enabled = allowedTools.filter((_, i) => isEnabled[i])

  // 4. tool-search fallback: if tool-search is active but Bash is gone AND no REPL filtering
  //    happened, re-add Glob/Grep so search-mode sessions retain file search.  @436644
  if (isToolSearchActive() && !bashPresent && !replFiltered) {
    // Qw()
    const reAdded = filterToolsByDenyRules(
      [GlobTool, GrepTool].filter(tool => !enabled.includes(tool)),
      permissionContext,
    )
    enabled = [...enabled, ...reAdded]
  }
  return enabled
}

/* ────────────────────────────────────────────────────────────────────────────
 * assembleToolPool — built-ins + MCP/skill tools, deduped
 * ──────────────────────────────────────────────────────────────────────────── */

interface AssembleOptions extends GetToolsOptions {
  /** Skill tools to merge in after deny-filtering (from frontmatter / loaded skills). */
  skillTools?: Tools
}

/**
 * Single source of truth for combining built-in tools with MCP + skill tools.
 *
 * Strategy: built-ins are sorted by name as a CONTIGUOUS PREFIX, then the MCP/skill tail. uniqBy
 * keeps the first occurrence, so a built-in wins a name conflict against an MCP tool. The contiguous
 * built-in prefix keeps the system-prompt cache breakpoint stable — toggling a built-in only
 * invalidates the suffix, never interleaving MCP tools into the cached built-in block.
 */
// 2.1.183: assembleToolPool = YY @436581-436588
export function assembleToolPool(
  permissionContext: ToolPermissionContext,
  mcpTools: Tools,
  options?: AssembleOptions,
): Tools {
  const builtInTools = getTools(permissionContext, options) // includes Workflow iff enabled  @436582
  const allowedMcpTools = filterToolsByDenyRules(mcpTools, permissionContext) // @436583
  const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name)
  const skillTools = options?.skillTools ?? [] // @436585
  // Skill tools, when present, join the MCP tail (deny-filtered) and are sorted together with it.
  const tail =
    skillTools.length > 0
      ? allowedMcpTools.concat(filterToolsByDenyRules(skillTools, permissionContext)).sort(byName)
      : allowedMcpTools.sort(byName)
  // builtInTools is readonly → copy-then-sort (avoid Array.toSorted for Node 18 support).
  return uniqBy([...builtInTools].sort(byName).concat(tail), 'name') // @436587
}

/* ────────────────────────────────────────────────────────────────────────────
 * getMergedTools — final dedup + mcp-last partition + coordinator subtraction
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Merge two tool lists into the final pool the model sees: dedup by name, partition so non-MCP
 * tools come first and MCP tools last (each partition sorted by name), then — in coordinator mode —
 * narrow to the coordinator allow-set.
 */
// 2.1.183: getMergedTools = iqe @539937-539945
export function getMergedTools(toolsA: Tools, toolsB: Tools, mode?: string): Tools {
  // dedup by name, then partition into [mcpTools, nonMcpTools]
  const [mcp, nonMcp] = partitionByMcp(uniqBy([...toolsA, ...toolsB], 'name'), isMcpTool) // d$e / Lx  @539938
  const byName = (a: Tool, b: Tool) => a.name.localeCompare(b.name)
  const merged = [...nonMcp.sort(byName), ...mcp.sort(byName)] // non-mcp first, mcp last  @539940
  if (coordinatorModeModule && coordinatorModeModule.isCoordinatorMode()) {
    return filterCoordinatorTools(merged) // lwl — coordinator allow-set  @539942
  }
  return merged
}

/* ────────────────────────────────────────────────────────────────────────────
 * useMergedTools — React hook wiring assembleToolPool → getMergedTools (memoized)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Live wiring used by the REPL UI: assembles the built-in+MCP+skill pool, then merges it with the
 * extra tool list, memoized on context / mcp / skill inputs. Also toggles REPL-bridge state.
 */
// 2.1.183: useMergedTools = m6n @539962-539973
export function useMergedTools(
  extraTools: Tools,
  mcpTools: Tools,
  context: { mode?: string },
): Tools {
  const replBridgeEnabled = useAppStateSelector(s => s.replBridgeEnabled) // ft
  const replBridgeOutboundOnly = useAppStateSelector(s => s.replBridgeOutboundOnly)
  const skillTools = useAppStateSelector(s => s.skillTools)
  setReplBridgeActive(replBridgeEnabled && !replBridgeOutboundOnly) // sSe
  return useMemo(() => {
    const assembled = assembleToolPool(context as ToolPermissionContext, mcpTools, { skillTools }) // YY
    return getMergedTools(extraTools, assembled, context.mode) // iqe
  }, [extraTools, mcpTools, skillTools, context, replBridgeEnabled, replBridgeOutboundOnly])
}

/* ────────────────────────────────────────────────────────────────────────────
 * Registry initialization — slot population + provider publish (run-once)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Populate every lazy tool slot from its (lazily required) module, then publish `getAllBaseTools`
 * as the global base-tools provider so other subsystems read the canonical list without importing
 * `getAllBaseTools` directly.
 *
 * Runs exactly once, in the tail of the registry init thunk (`zL`).
 *
 * Workflow-slot wrinkle: `workflowToolSlot` is the ONLY slot assigned by an IIFE, because it must
 * run `initBundledWorkflows()` as a side effect BEFORE reading `.WorkflowTool` — enforced by the
 * comma operator. If the order were reversed, Workflow could be advertised while its bundled scripts
 * were still unregistered.
 */
// 2.1.183: initializeBundledTools = tail of zL thunk @436700-436714 ; jAi(LW) @436714
export function initializeBundledTools(): void {
  setCronToolsSlot([
    requireLazy(cronCreateMod).CronCreateTool,
    requireLazy(cronDeleteMod).CronDeleteTool,
    requireLazy(cronListMod).CronListTool,
  ]) // w$p  @436701
  setEmptySlotA([]) // C$p
  setRemoteTriggerSlot(requireLazy(remoteTriggerMod).RemoteTriggerTool) // Zza
  setEmptySlotB([]) // I$p
  setMonitorSlot(requireLazy(monitorMod).MonitorTool) // rKa
  setSendUserFileSlot(requireLazy(sendUserFileMod).SendUserFileTool) // x$p
  setPushNotificationSlot(requireLazy(pushNotifMod).PushNotificationTool) // oKa
  setDesignSyncSlot(requireLazy(designSyncMod).DesignSyncTool) // k$p — NEW in 2.1.183  @436707
  setProjectsToolSlot(
    process.env.CLAUDE_PROJECT_TOOL ? requireLazy(projectsMod).ProjectsTool : null, // iKa — NEW in 2.1.183  @436708
  )
  setArtifactSlot(requireLazy(artifactMod).ArtifactTool) // dKa
  setCoordinatorModeModule(requireLazy(coordinatorMod)) // AKa
  setShareOnboardingSlot(requireLazy(shareOnboardingMod).ShareOnboardingGuideTool) // _Ka
  setWorkflowToolSlot(
    (() => {
      // side effect FIRST, then read the tool object — order enforced by the IIFE / comma operator.
      requireLazy(bundledWorkflowsMod).initBundledWorkflows() // @436712
      return requireLazy(workflowToolMod).WorkflowTool // == the WorkflowTool object
    })(),
  )
  setToolPresets(['default']) // L$p  @436713

  registerBaseToolsProvider(getAllBaseTools) // jAi(LW)  @436714 — publish as the cached provider
}

/* ────────────────────────────────────────────────────────────────────────────
 * Re-exports (convention parity with 2.1.88 src/tools.ts)
 * ──────────────────────────────────────────────────────────────────────────── */

export { REPL_ONLY_TOOLS, getEmptyToolPermissionContext }
export type { ToolPermissionContext }
