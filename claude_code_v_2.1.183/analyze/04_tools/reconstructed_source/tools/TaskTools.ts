/**
 * Task* tool family — the six task-list tools (TaskCreate, TaskGet, TaskList,
 * TaskOutput, TaskStop, TaskUpdate) reconstructed for Claude Code v2.1.183.
 *
 * These six tools share a single on-disk task store (one JSON file per task under
 * `<projectDir>/tasks/<listId>/<id>.json`) and a common enable gate. They are the
 * "Todo V2" replacement for the legacy TodoWrite checklist — `TaskCreate/Get/List/
 * Update` are enabled only when `taskToolsEnabled()` (`_H`) is true, and TodoWrite is
 * its exact inverse (`!_H()`), so the two families are mutually exclusive in a session.
 * `TaskOutput` and `TaskStop` are background-task lifecycle tools (read output / kill);
 * they are always enabled and carry legacy aliases (AgentOutput/BashOutput, KillShell/
 * KillBash) so old tool-call names keep resolving.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - name consts:            :220833-220835 (TaskList/TaskStop+JOi), :221313 (TaskOutput),
 *                             :221451-221453 (TaskCreate/Get/Update)
 *   - status enum vje:        :299290
 *   - enable gate _H:         :299032-299035
 *   - team gate Sl:           :293831-293835
 *   - task-store runtime:     :299065-299196 (WB/Nla/Bee/Xge/OLn/cj/BXr)
 *   - TaskCreate prompt sVa:  :430405-430450 ; desc oVa :430451 ; coerce tVa :430342-430373 ;
 *                             steer nVa :430374-430382 ; tool aVa :430455-430537
 *   - TaskGet  uVa/cVa:       :430539-430561 ; tool dVa :430562-430646
 *   - TaskUpdate mVa/fVa:     :430647-430722 ; coerce t1t :298989-299005 ; tool AVa :430723-430911
 *   - TaskList prompt yVa:    :430913-430954 ; desc hVa :430955 ; tool bVa :430959-431043
 *   - TaskOutput tool q3n:    :428163-...    (schema sMp :428163-428169)
 *   - TaskStop tool edt:      :424853-424920 (schema WDp :424853, output qDp :424859)
 *
 * 2.1.88 convention mirror: src/tools/{TaskCreateTool,TaskGetTool,TaskListTool,
 *   TaskOutputTool,TaskStopTool,TaskUpdateTool}/*.{ts,tsx} (one dir per tool; this file
 *   collapses the family into one module since they share schema/runtime).
 * 2.1.156 scaffold: 04_tools/README.md (Task tool registration + gates).
 * Cross-validation: re-read every Zod `.describe(...)`, prompt builder, and error string
 *   against the 183 bundle lines above; the asset files (assets/tools/Task*.md) had
 *   injection corruption in TaskCreate.md / TaskList.md (a leaked deep-link error string)
 *   — the verbatim prompt text below comes from the BUNDLE builders `sVa`/`yVa`, not the
 *   corrupted assets. `${e}`/`${t}`/`${n}` interpolation points are the team-mode (`Sl`)
 *   insertions.
 */

import { z } from 'zod/v4'
import { buildTool, type ToolDef, type ToolUseContext } from '../Tool.js'

// ---------------------------------------------------------------------------
// Tool name constants
// ---------------------------------------------------------------------------

// 2.1.183: TASK_CREATE_TOOL_NAME = Vw @cli_inner_pretty.js:221451
export const TASK_CREATE_TOOL_NAME = 'TaskCreate'
// 2.1.183: TASK_GET_TOOL_NAME = g7 @cli_inner_pretty.js:221452
export const TASK_GET_TOOL_NAME = 'TaskGet'
// 2.1.183: TASK_UPDATE_TOOL_NAME = dP @cli_inner_pretty.js:221453
export const TASK_UPDATE_TOOL_NAME = 'TaskUpdate'
// 2.1.183: TASK_LIST_TOOL_NAME = IL @cli_inner_pretty.js:220833
export const TASK_LIST_TOOL_NAME = 'TaskList'
// 2.1.183: TASK_STOP_TOOL_NAME = uP @cli_inner_pretty.js:220834
export const TASK_STOP_TOOL_NAME = 'TaskStop'
// 2.1.183: TASK_OUTPUT_TOOL_NAME = W9 @cli_inner_pretty.js:221313
export const TASK_OUTPUT_TOOL_NAME = 'TaskOutput'

// ---------------------------------------------------------------------------
// Shared gates / status enum
// ---------------------------------------------------------------------------

/**
 * Task-tools enable gate. Returns false ONLY when CLAUDE_CODE_ENABLE_TASKS is
 * explicitly set to a falsey value (`yl` = "env var is set and parses to false");
 * otherwise true. TaskCreate/Get/List/Update gate on this; TodoWrite gates on `!`.
 */
// 2.1.183: taskToolsEnabled = _H @cli_inner_pretty.js:299032-299035
export function taskToolsEnabled(): boolean {
  // @299033: yl(env) = env var present AND coerces to false → tasks disabled
  if (parseFalseyEnv(process.env.CLAUDE_CODE_ENABLE_TASKS)) return false
  return true
}
// helper: yl @ — "env var present and parses to a falsey value" predicate
declare function parseFalseyEnv(v: string | undefined): boolean // 2.1.183: yl

/**
 * Agent-teams / teammate-mode gate. True only when teams are turned on
 * (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS truthy OR `yqd()`) AND the feature flag
 * `tengu_amber_flint` is on. Drives the team-aware prose branches and the
 * TaskUpdate auto-claim / assignment-mailbox behavior below.
 */
// 2.1.183: agentTeamsEnabled = Sl @cli_inner_pretty.js:293831-293835
export function agentTeamsEnabled(): boolean {
  if (!parseTruthyEnv(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !isTeammateSessionActive())
    return false // @293832
  if (!isFeatureEnabled('tengu_amber_flint', true)) return false // @293833
  return true
}
// helper: st @ — truthy-env predicate; yqd @ — teammate-session active; ct @ — feature gate
declare function parseTruthyEnv(v: string | undefined): boolean // 2.1.183: st
declare function isTeammateSessionActive(): boolean // 2.1.183: yqd
declare function isFeatureEnabled(flag: string, dflt: boolean): boolean // 2.1.183: ct

// 2.1.183: taskStatusEnum = vje @cli_inner_pretty.js:299290
export const taskStatusEnum = () => z.enum(['pending', 'in_progress', 'completed'])
export type TaskStatus = z.infer<ReturnType<typeof taskStatusEnum>>

// ---------------------------------------------------------------------------
// Task-store runtime (shared by all six tools)
// ---------------------------------------------------------------------------
//
// One JSON file per task at `<projectTasksDir>/<dst(listId)>/<dst(id)>.json`;
// ids are monotonically increasing decimal strings derived from the highest
// existing file index + a tombstone counter. All writes take a per-file lock
// (`$h`) and emit a change event (`n1t`) so the UI re-renders. Summarized here —
// these live in the tasks-store module, not the tool files.
//
// helper: WB     @299065 — getTaskListId(): env override → team name → session id
// helper: Nla    @299106 — createTask(listId, fields) → new id string (locked write)
// helper: Bee    @299120 — getTask(listId, id) → Task | null (schema-validated read)
// helper: Xge    @299141 — updateTask(listId, id, patch) → merged Task | null (locked)
// helper: OLn    @299151 — deleteTask(listId, id): also strips this id from every
//                           other task's blocks/blockedBy; returns boolean success
// helper: cj     @299177 — listTasks(listId) → Task[] sorted by numeric id
// helper: BXr    @299190 — addBlockEdge(listId, blockerId, blockedId): wires a
//                           blocks↔blockedBy dependency edge between two tasks
// helper: ih @ — getAgentName() (self); zp @ — getTeamName(); fT @ — agent color

interface StoredTask {
  id: string
  subject: string
  description: string
  activeForm?: string
  status: TaskStatus
  owner?: string
  blocks: string[]
  blockedBy: string[]
  metadata?: Record<string, unknown>
}

declare function getTaskListId(): string // 2.1.183: WB
declare function createTask(listId: string, fields: Omit<StoredTask, 'id'>): Promise<string> // Nla
declare function getTask(listId: string, id: string): Promise<StoredTask | null> // Bee
declare function updateTask(listId: string, id: string, patch: Partial<StoredTask>): Promise<StoredTask | null> // Xge
declare function deleteTask(listId: string, id: string): Promise<boolean> // OLn
declare function listTasks(listId: string): Promise<StoredTask[]> // cj
declare function addBlockEdge(listId: string, blockerId: string, blockedId: string): Promise<boolean> // BXr
declare function getAgentName(): string | undefined // ih
declare function getTeamName(): string | undefined // zp

// ===========================================================================
// 1. TaskCreate
// ===========================================================================

// 2.1.183: taskCreateDescription = oVa @cli_inner_pretty.js:430451
const TASK_CREATE_DESCRIPTION = 'Create a new task in the task list'

/**
 * TaskCreate prompt. Two interpolation points (`${teammateContext}`, `${teammateTips}`)
 * fire only in team mode (`agentTeamsEnabled`). Quoted verbatim from the bundle builder
 * `sVa` @430405-430450 (the assets/tools/TaskCreate.md copy is corrupted by an injected
 * deep-link error string — do NOT use it).
 */
// 2.1.183: getTaskCreatePrompt = sVa @cli_inner_pretty.js:430405-430450
function getTaskCreatePrompt(): string {
  const teammateContext = agentTeamsEnabled() ? ' and potentially assigned to teammates' : '' // @430406
  const teammateTips = agentTeamsEnabled() // @430407-430409
    ? "- Include enough detail in the description for another agent to understand and complete the task\n- New tasks are created with status 'pending' and no owner - use TaskUpdate with the `owner` parameter to assign them\n"
    : ''

  // @430410-430449 (verbatim):
  return `Use this tool to create a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool

Use this tool proactively in these scenarios:

- Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
- Non-trivial and complex tasks - Tasks that require careful planning or multiple operations${teammateContext}
- Plan mode - When using plan mode, create a task list to track the work
- User explicitly requests todo list - When the user directly asks you to use the todo list
- User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
- After receiving new instructions - Immediately capture user requirements as tasks
- When you start working on a task - Mark it as in_progress BEFORE beginning work
- After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
- There is only a single, straightforward task
- The task is trivial and tracking it provides no organizational benefit
- The task can be completed in less than 3 trivial steps
- The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Task Fields

- **subject**: A brief, actionable title in imperative form (e.g., "Fix authentication bug in login flow")
- **description**: What needs to be done
- **activeForm** (optional): Present continuous form shown in the spinner when the task is in_progress (e.g., "Fixing authentication bug"). If omitted, the spinner shows the subject instead.

All tasks are created with status \`pending\`.

## Tips

- Create tasks with clear, specific subjects that describe the outcome
- After creating tasks, use TaskUpdate to set up dependencies (blocks/blockedBy) if needed
${teammateTips}- Check TaskList first to avoid creating duplicate tasks
`
}

// 2.1.183: taskCreateInputSchema = UMp @cli_inner_pretty.js:430464-430473
const taskCreateInputSchema = () =>
  z.strictObject({
    subject: z.string().describe('A brief title for the task'), // @430466
    description: z.string().describe('What needs to be done'), // @430467
    activeForm: z
      .string()
      .optional()
      .describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'), // @430468-430470
    metadata: z
      .record(z.string(), z.unknown())
      .optional()
      .describe('Arbitrary metadata to attach to the task'), // @430471
  })
type TaskCreateInput = z.infer<ReturnType<typeof taskCreateInputSchema>>

// 2.1.183: taskCreateOutputSchema = jMp @cli_inner_pretty.js:430474
const taskCreateOutputSchema = () => z.object({ task: z.object({ id: z.string(), subject: z.string() }) })
type TaskCreateOutput = z.infer<ReturnType<typeof taskCreateOutputSchema>>

/**
 * Best-effort coercion of malformed TaskCreate inputs into the strict schema
 * (the model often passes batched/aliased shapes). Unwraps a `{task: ...}`
 * wrapper, maps aliases (title/name→subject, content→description,
 * active_form→activeForm), backfills a missing subject/description from the
 * other, and strips foreign keys. Returns null (no coercion) when the input is
 * already valid, is a batch (`tasks`/`todos`), or looks like an Agent-tool call.
 */
// 2.1.183: coerceTaskCreateInput = tVa @cli_inner_pretty.js:430342-430373
const coerceTaskCreateInput = (raw: unknown): { input: unknown; shapeClass: string } | null => {
  // helper: S3t @ isPlainObject; J3n @ looksLikeBatch (tasks/todos); Q3n @ looksLikeAgentCall;
  //         ZY @ isNonEmptyString; $Mp/OMp/NMp @430387-430389 alias key lists;
  //         RMp/BMp @430386,430390 allow/known key sets; FMp @ deriveSubjectFromDescription
  return coerceTaskCreateInputImpl(raw)
}
declare function coerceTaskCreateInputImpl(raw: unknown): { input: unknown; shapeClass: string } | null

/**
 * Validation-error steer: when a TaskCreate call fails schema validation, returns
 * a corrective hint for the model (verbatim @430378 / @430380), or null.
 */
// 2.1.183: taskCreateValidationErrorSteer = nVa @cli_inner_pretty.js:430374-430382
const taskCreateValidationErrorSteer = (raw: unknown): string | null => {
  // @430377-430378: batched-tasks shape
  if (looksLikeBatchedTasks(raw))
    return 'TaskCreate creates ONE task per call and has no `tasks` or `todos` parameter. Call TaskCreate once per task, passing `subject` (a brief title) and `description` (what needs to be done) as top-level string parameters.'
  // @430379-430380: Agent-tool-shaped (prompt/subagent_type)
  if (looksLikeAgentCall(raw))
    return 'This call used Agent-tool parameters (`prompt`/`subagent_type`). TaskCreate adds an item to the task list and takes `subject` and `description` string parameters. To delegate work to a subagent, use the Agent tool instead.'
  return null
}
declare function looksLikeBatchedTasks(raw: unknown): boolean // J3n
declare function looksLikeAgentCall(raw: unknown): boolean // Q3n

// 2.1.183: TaskCreateTool = aVa @cli_inner_pretty.js:430475-430537
export const TaskCreateTool = buildTool({
  name: TASK_CREATE_TOOL_NAME,
  searchHint: 'create a task in the task list', // @430477
  maxResultSizeChars: 100_000,
  async description() {
    return TASK_CREATE_DESCRIPTION
  },
  async prompt() {
    return getTaskCreatePrompt()
  },
  get inputSchema() {
    return taskCreateInputSchema()
  },
  get outputSchema() {
    return taskCreateOutputSchema()
  },
  userFacingName() {
    return 'TaskCreate'
  },
  shouldDefer: true,
  coerceInput: coerceTaskCreateInput,
  validationErrorSteer: taskCreateValidationErrorSteer,
  isEnabled() {
    return taskToolsEnabled()
  },
  isConcurrencySafe() {
    return false // @430501 — creation mutates the shared list / assigns the next id
  },
  toAutoClassifierInput(input: TaskCreateInput) {
    return input.subject
  },
  renderToolUseMessage() {
    return null
  },
  // call @430509-430531:
  //   1. createTask(getTaskListId(), {subject, description, activeForm, status:'pending',
  //      owner:undefined, blocks:[], blockedBy:[], metadata}) → new id.
  //   2. Run the TaskCreated hooks generator E3t(id, subject, description, getAgentName(),
  //      getTeamName(), …, signal, …, ctx); collect each result.blockingError via jpo(...).
  //   3. If any blocking error: deleteTask(listId, id) (roll back) then throw Error(joined).
  //   4. Side-effect: emit {type:'set_expanded_view', expandedView:'tasks'} so the task
  //      panel auto-expands.
  //   5. Return { data: { task: { id, subject } } }.
  async call(
    { subject, description, activeForm, metadata }: TaskCreateInput,
    context: ToolUseContext,
    _toolUseID?: unknown,
    _extra?: unknown,
    setExpandedView?: (e: { type: 'set_expanded_view'; expandedView: 'tasks' }) => void,
  ) {
    const listId = getTaskListId()
    const id = await createTask(listId, {
      subject,
      description,
      activeForm,
      status: 'pending',
      owner: undefined,
      blocks: [],
      blockedBy: [],
      metadata,
    })

    const blockingErrors: string[] = []
    const hooks = runTaskCreatedHooks(
      id,
      subject,
      description,
      getAgentName(),
      getTeamName(),
      undefined,
      context?.abortController?.signal,
      undefined,
      context,
    )
    for await (const result of hooks) {
      if (result.blockingError) blockingErrors.push(getTaskCreatedHookMessage(result.blockingError))
    }
    if (blockingErrors.length > 0) {
      await deleteTask(listId, id) // @430525 — roll back the just-created task
      throw new Error(blockingErrors.join('\n')) // @430526-430529
    }

    setExpandedView?.({ type: 'set_expanded_view', expandedView: 'tasks' }) // @430531
    return { data: { task: { id, subject } } }
  },
  // mapToolResult @430533-430536:
  mapToolResultToToolResultBlockParam(content: TaskCreateOutput, toolUseID: string) {
    const { task } = content
    return {
      tool_use_id: toolUseID,
      type: 'tool_result' as const,
      content: `Task #${task.id} created successfully: ${task.subject}`, // @430535
    }
  },
} satisfies ToolDef<ReturnType<typeof taskCreateInputSchema>, TaskCreateOutput>)
// helper: E3t @ runTaskCreatedHooks; jpo @ getTaskCreatedHookMessage
declare function runTaskCreatedHooks(...args: unknown[]): AsyncGenerator<{ blockingError?: unknown }>
declare function getTaskCreatedHookMessage(err: unknown): string

// ===========================================================================
// 2. TaskGet
// ===========================================================================

// 2.1.183: taskGetDescription = cVa @cli_inner_pretty.js:430539
const TASK_GET_DESCRIPTION = 'Get a task by ID from the task list'

// 2.1.183: taskGetPrompt = uVa @cli_inner_pretty.js:430540-430561 (verbatim)
const TASK_GET_PROMPT = `Use this tool to retrieve a task by its ID from the task list.

## When to Use This Tool

- When you need the full description and context before starting work on a task
- To understand task dependencies (what it blocks, what blocks it)
- After being assigned a task, to get complete requirements

## Output

Returns full task details:
- **subject**: Task title
- **description**: Detailed requirements and context
- **status**: 'pending', 'in_progress', or 'completed'
- **blocks**: Tasks waiting on this one to complete
- **blockedBy**: Tasks that must complete before this one can start

## Tips

- After fetching a task, verify its blockedBy list is empty before beginning work.
- Use TaskList to see all tasks in summary form.
`

// 2.1.183: taskGetInputSchema = GMp @cli_inner_pretty.js:430567
const taskGetInputSchema = () =>
  z.strictObject({ taskId: z.string().describe('The ID of the task to retrieve') })
type TaskGetInput = z.infer<ReturnType<typeof taskGetInputSchema>>

// 2.1.183: taskGetOutputSchema = WMp @cli_inner_pretty.js:430568-430579
const taskGetOutputSchema = () =>
  z.object({
    task: z
      .object({
        id: z.string(),
        subject: z.string(),
        description: z.string(),
        status: taskStatusEnum(),
        blocks: z.array(z.string()),
        blockedBy: z.array(z.string()),
      })
      .nullable(),
  })
type TaskGetOutput = z.infer<ReturnType<typeof taskGetOutputSchema>>

// 2.1.183: TaskGetTool = dVa @cli_inner_pretty.js:430580-430645
export const TaskGetTool = buildTool({
  name: TASK_GET_TOOL_NAME,
  searchHint: 'retrieve a task by ID', // @430582
  maxResultSizeChars: 100_000,
  async description() {
    return TASK_GET_DESCRIPTION
  },
  async prompt() {
    return TASK_GET_PROMPT
  },
  get inputSchema() {
    return taskGetInputSchema()
  },
  get outputSchema() {
    return taskGetOutputSchema()
  },
  userFacingName() {
    return 'TaskGet'
  },
  shouldDefer: true,
  isEnabled() {
    return taskToolsEnabled()
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true
  },
  toAutoClassifierInput(input: TaskGetInput) {
    return input.taskId
  },
  renderToolUseMessage() {
    return null
  },
  // call @430615-430631: getTask(getTaskListId(), taskId); null → {task:null};
  //   else project to {id, subject, description, status, blocks, blockedBy}.
  async call({ taskId }: TaskGetInput) {
    const task = await getTask(getTaskListId(), taskId)
    if (!task) return { data: { task: null } }
    return {
      data: {
        task: {
          id: task.id,
          subject: task.subject,
          description: task.description,
          status: task.status,
          blocks: task.blocks,
          blockedBy: task.blockedBy,
        },
      },
    }
  },
  // mapToolResult @430632-430644: "Task not found" | multi-line block.
  mapToolResultToToolResultBlockParam(content: TaskGetOutput, toolUseID: string) {
    const { task } = content
    if (!task) return { tool_use_id: toolUseID, type: 'tool_result' as const, content: 'Task not found' } // @430634
    const lines = [`Task #${task.id}: ${task.subject}`, `Status: ${task.status}`, `Description: ${task.description}`] // @430635
    if (task.blockedBy.length > 0) lines.push(`Blocked by: ${task.blockedBy.map(id => `#${id}`).join(', ')}`) // @430636
    if (task.blocks.length > 0) lines.push(`Blocks: ${task.blocks.map(id => `#${id}`).join(', ')}`) // @430637
    return { tool_use_id: toolUseID, type: 'tool_result' as const, content: lines.join('\n') }
  },
} satisfies ToolDef<ReturnType<typeof taskGetInputSchema>, TaskGetOutput>)

// ===========================================================================
// 3. TaskList
// ===========================================================================

// 2.1.183: taskListDescription = hVa @cli_inner_pretty.js:430955
const TASK_LIST_DESCRIPTION = 'List all tasks in the task list'

/**
 * TaskList prompt. Team-aware (`agentTeamsEnabled`) at three interpolation points:
 * an extra "before assigning tasks to teammates" bullet (`${availabilityBullet}`),
 * the id-field line (`${idFieldLine}`, identical in both branches here), and a whole
 * "## Teammate Workflow" trailer (`${teammateWorkflow}`). Verbatim from bundle builder
 * `yVa` @430913-430953 (the assets/tools/TaskList.md copy is corrupted — use the bundle).
 */
// 2.1.183: getTaskListPrompt = yVa @cli_inner_pretty.js:430913-430954
function getTaskListPrompt(): string {
  const availabilityBullet = agentTeamsEnabled() // @430914-430917
    ? "- Before assigning tasks to teammates, to see what's available\n"
    : ''
  // @430918-430920 — both branches are the same line in 183; kept as in source.
  const idFieldLine = agentTeamsEnabled()
    ? '- **id**: Task identifier (use with TaskGet, TaskUpdate)'
    : '- **id**: Task identifier (use with TaskGet, TaskUpdate)'
  const teammateWorkflow = agentTeamsEnabled() // @430921-430932
    ? `
## Teammate Workflow

When working as a teammate:
1. After completing your current task, call TaskList to find available work
2. Look for tasks with status 'pending', no owner, and empty blockedBy
3. **Prefer tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones
4. Claim an available task using TaskUpdate (set \`owner\` to your name), or wait for leader assignment
5. If blocked, focus on unblocking tasks or notify the team lead
`
    : ''

  // @430933-430953 (verbatim):
  return `Use this tool to list all tasks in the task list.

## When to Use This Tool

- To see what tasks are available to work on (status: 'pending', no owner, not blocked)
- To check overall progress on the project
- To find tasks that are blocked and need dependencies resolved
${availabilityBullet}- After completing a task, to check for newly unblocked work or claim the next available task
- **Prefer working on tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones

## Output

Returns a summary of each task:
${idFieldLine}
- **subject**: Brief description of the task
- **status**: 'pending', 'in_progress', or 'completed'
- **owner**: Agent ID if assigned, empty if available
- **blockedBy**: List of open task IDs that must be resolved first (tasks with blockedBy cannot be claimed until dependencies resolve)

Use TaskGet with a specific task ID to view full details including description and comments.
${teammateWorkflow}`
}

// 2.1.183: taskListInputSchema = zMp @cli_inner_pretty.js:430965 (no params)
const taskListInputSchema = () => z.strictObject({})
type TaskListInput = z.infer<ReturnType<typeof taskListInputSchema>>

// 2.1.183: taskListOutputSchema = KMp @cli_inner_pretty.js:430966-430978
const taskListOutputSchema = () =>
  z.object({
    tasks: z.array(
      z.object({
        id: z.string(),
        subject: z.string(),
        status: taskStatusEnum(),
        owner: z.string().optional(),
        blockedBy: z.array(z.string()),
      }),
    ),
  })
type TaskListOutput = z.infer<ReturnType<typeof taskListOutputSchema>>

// 2.1.183: TaskListTool = bVa @cli_inner_pretty.js:430979-431042
export const TaskListTool = buildTool({
  name: TASK_LIST_TOOL_NAME,
  searchHint: 'list all tasks', // @430981
  maxResultSizeChars: 100_000,
  async description() {
    return TASK_LIST_DESCRIPTION
  },
  async prompt() {
    return getTaskListPrompt()
  },
  get inputSchema() {
    return taskListInputSchema()
  },
  get outputSchema() {
    return taskListOutputSchema()
  },
  userFacingName() {
    return 'TaskList'
  },
  shouldDefer: true,
  isEnabled() {
    return taskToolsEnabled()
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true
  },
  renderToolUseMessage() {
    return null
  },
  // call @431011-431026: listTasks(getTaskListId()); drop internal tasks
  //   (metadata._internal); recompute blockedBy as the open-task subset (an edge to
  //   an already-completed task no longer counts as blocking).
  async call() {
    const listId = getTaskListId()
    const tasks = (await listTasks(listId)).filter(t => !t.metadata?._internal) // @431013
    const completedIds = new Set(tasks.filter(t => t.status === 'completed').map(t => t.id)) // @431014
    return {
      data: {
        tasks: tasks.map(t => ({
          id: t.id,
          subject: t.subject,
          status: t.status,
          owner: t.owner,
          blockedBy: t.blockedBy.filter(b => !completedIds.has(b)), // @431022
        })),
      },
    }
  },
  // mapToolResult @431027-431041: "No tasks found" | one line per task
  //   `#<id> [<status>] <subject><owner?><blockedBy?>`.
  mapToolResultToToolResultBlockParam(content: TaskListOutput, toolUseID: string) {
    const { tasks } = content
    if (tasks.length === 0) return { tool_use_id: toolUseID, type: 'tool_result' as const, content: 'No tasks found' } // @431029
    const lines = tasks.map(t => {
      const owner = t.owner ? ` (${t.owner})` : '' // @431031
      const blocked = t.blockedBy.length > 0 ? ` [blocked by ${t.blockedBy.map(b => `#${b}`).join(', ')}]` : '' // @431032
      return `#${t.id} [${t.status}] ${t.subject}${owner}${blocked}` // @431033
    })
    return { tool_use_id: toolUseID, type: 'tool_result' as const, content: lines.join('\n') }
  },
} satisfies ToolDef<ReturnType<typeof taskListInputSchema>, TaskListOutput>)

// ===========================================================================
// 4. TaskUpdate
// ===========================================================================

// 2.1.183: taskUpdateDescription = fVa @cli_inner_pretty.js:430647
const TASK_UPDATE_DESCRIPTION = 'Update a task in the task list'

// 2.1.183: taskUpdatePrompt = mVa @cli_inner_pretty.js:430648-430722 (verbatim)
const TASK_UPDATE_PROMPT = `Use this tool to update a task in the task list.

## When to Use This Tool

**Mark tasks as resolved:**
- When you have completed the work described in a task
- When a task is no longer needed or has been superseded
- IMPORTANT: Always mark your assigned tasks as resolved when you finish them
- After resolving, call TaskList to find your next task

- ONLY mark a task as completed when you have FULLY accomplished it
- If you encounter errors, blockers, or cannot finish, keep the task as in_progress
- When blocked, create a new task describing what needs to be resolved
- Never mark a task as completed if:
  - Tests are failing
  - Implementation is partial
  - You encountered unresolved errors
  - You couldn't find necessary files or dependencies

**Delete tasks:**
- When a task is no longer relevant or was created in error
- Setting status to \`deleted\` permanently removes the task

**Update task details:**
- When requirements change or become clearer
- When establishing dependencies between tasks

## Fields You Can Update

- **status**: The task status (see Status Workflow below)
- **subject**: Change the task title (imperative form, e.g., "Run tests")
- **description**: Change the task description
- **activeForm**: Present continuous form shown in spinner when in_progress (e.g., "Running tests")
- **owner**: Change the task owner (agent name)
- **metadata**: Merge metadata keys into the task (set a key to null to delete it)
- **addBlocks**: Mark tasks that cannot start until this one completes
- **addBlockedBy**: Mark tasks that must complete before this one can start

## Status Workflow

Status progresses: \`pending\` → \`in_progress\` → \`completed\`

Use \`deleted\` to permanently remove a task.

## Staleness

Make sure to read a task's latest state using \`TaskGet\` before updating it.

## Examples

Mark task as in progress when starting work:
\`\`\`json
{"taskId": "1", "status": "in_progress"}
\`\`\`

Mark task as completed after finishing work:
\`\`\`json
{"taskId": "1", "status": "completed"}
\`\`\`

Delete a task:
\`\`\`json
{"taskId": "1", "status": "deleted"}
\`\`\`

Claim a task by setting owner:
\`\`\`json
{"taskId": "1", "owner": "my-name"}
\`\`\`

Set up task dependencies:
\`\`\`json
{"taskId": "2", "addBlockedBy": ["1"]}
\`\`\`
`

// 2.1.183: taskUpdateInputSchema = qMp @cli_inner_pretty.js:430734-430751
const taskUpdateInputSchema = () => {
  const statusOrDeleted = taskStatusEnum().or(z.literal('deleted')) // @430735
  return z.strictObject({
    taskId: z.string().describe('The ID of the task to update'), // @430737
    subject: z.string().optional().describe('New subject for the task'), // @430738
    description: z.string().optional().describe('New description for the task'), // @430739
    activeForm: z
      .string()
      .optional()
      .describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'), // @430740-430742
    status: statusOrDeleted.optional().describe('New status for the task'), // @430743
    addBlocks: z.array(z.string()).optional().describe('Task IDs that this task blocks'), // @430744
    addBlockedBy: z.array(z.string()).optional().describe('Task IDs that block this task'), // @430745
    owner: z.string().optional().describe('New owner for the task'), // @430746
    metadata: z
      .record(z.string(), z.unknown())
      .optional()
      .describe('Metadata keys to merge into the task. Set a key to null to delete it.'), // @430747-430749
  })
}
type TaskUpdateInput = z.infer<ReturnType<typeof taskUpdateInputSchema>>

// 2.1.183: taskUpdateOutputSchema = VMp @cli_inner_pretty.js:430752-430760
const taskUpdateOutputSchema = () =>
  z.object({
    success: z.boolean(),
    taskId: z.string(),
    updatedFields: z.array(z.string()),
    error: z.string().optional(),
    statusChange: z.object({ from: z.string(), to: z.string() }).optional(),
  })
type TaskUpdateOutput = z.infer<ReturnType<typeof taskUpdateOutputSchema>>

/**
 * TaskUpdate input coercion: maps id/task_id → taskId and active_form → activeForm.
 * Returns null when nothing was rewritten.
 */
// 2.1.183: coerceTaskUpdateInput = t1t @cli_inner_pretty.js:298989-299005
const coerceTaskUpdateInput = (raw: unknown): { input: unknown; shapeClass: string } | null => {
  // helper: y8d @ isPlainObject; g8d @299004 ["id","task_id"]; h8d @299004 ["active_form"];
  //         _8d @ isNonEmptyString
  return coerceTaskUpdateInputImpl(raw)
}
declare function coerceTaskUpdateInputImpl(raw: unknown): { input: unknown; shapeClass: string } | null

// 2.1.183: TaskUpdateTool = AVa @cli_inner_pretty.js:430761-430911
export const TaskUpdateTool = buildTool({
  name: TASK_UPDATE_TOOL_NAME,
  searchHint: 'update a task', // @430763
  maxResultSizeChars: 100_000,
  async description() {
    return TASK_UPDATE_DESCRIPTION
  },
  async prompt() {
    return TASK_UPDATE_PROMPT
  },
  get inputSchema() {
    return taskUpdateInputSchema()
  },
  get outputSchema() {
    return taskUpdateOutputSchema()
  },
  userFacingName() {
    return 'TaskUpdate'
  },
  coerceInput: coerceTaskUpdateInput,
  shouldDefer: true,
  isEnabled() {
    return taskToolsEnabled()
  },
  isConcurrencySafe() {
    return true
  },
  // toAutoClassifierInput @430788-430793: coerce → "<taskId> [status] [subject]".
  toAutoClassifierInput(input: TaskUpdateInput) {
    const coerced = (coerceTaskUpdateInput(input)?.input ?? input) as TaskUpdateInput
    const parts = [coerced.taskId]
    if (coerced.status) parts.push(coerced.status)
    if (coerced.subject) parts.push(coerced.subject)
    return parts.join(' ')
  },
  renderToolUseMessage() {
    return null
  },
  /**
   * call @430798-430900 — the load-bearing update algorithm:
   *   0. Auto-expand the task panel; load the existing task (getTask). Missing →
   *      {success:false, error:"Task not found"} @430818.
   *   1. Diff subject/description/activeForm/owner into `patch`, recording field names.
   *   2. Team auto-claim @430825-430828: in team mode, if status→in_progress with no
   *      explicit owner and no existing owner, claim it for self (getAgentName()).
   *   3. Metadata merge @430829-430835: shallow-merge; a value of null DELETES that key.
   *   4. Status handling @430836-430867:
   *        - "deleted" → deleteTask(...), return statusChange {from, to:"deleted"}.
   *        - "completed" (and actually changing) → run the completion-validation hooks
   *          generator uWe(...); if any blockingError, ABORT with {success:false, error}.
   *        - otherwise set the new status.
   *   5. Persist the patch (updateTask) when non-empty.
   *   6. Team assignment mailbox @430869-430881: if owner changed in team mode, mail a
   *      `task_assignment` frame to the new owner via deliverToTeammate($A).
   *   7. Block edges @430882-430891: addBlocks → addBlockEdge(self, other);
   *      addBlockedBy → addBlockEdge(other, self) (only for not-already-present ids).
   *   8. Return {success:true, updatedFields, statusChange?}.
   */
  async call(
    {
      taskId,
      subject,
      description,
      activeForm,
      status,
      owner,
      addBlocks,
      addBlockedBy,
      metadata,
    }: TaskUpdateInput,
    context: ToolUseContext,
    _toolUseID?: unknown,
    _extra?: unknown,
    setExpandedView?: (e: { type: 'set_expanded_view'; expandedView: 'tasks' }) => void,
  ) {
    const listId = getTaskListId()
    setExpandedView?.({ type: 'set_expanded_view', expandedView: 'tasks' }) // @430816

    const existing = await getTask(listId, taskId)
    if (!existing)
      return { data: { success: false, taskId, updatedFields: [], error: 'Task not found' } } // @430818

    const updatedFields: string[] = []
    const patch: Partial<StoredTask> = {}

    if (subject !== undefined && subject !== existing.subject) ((patch.subject = subject), updatedFields.push('subject')) // @430821
    if (description !== undefined && description !== existing.description) ((patch.description = description), updatedFields.push('description')) // @430822
    if (activeForm !== undefined && activeForm !== existing.activeForm) ((patch.activeForm = activeForm), updatedFields.push('activeForm')) // @430823
    if (owner !== undefined && owner !== existing.owner) ((patch.owner = owner), updatedFields.push('owner')) // @430824

    // Team auto-claim @430825-430828
    if (agentTeamsEnabled() && status === 'in_progress' && owner === undefined && !existing.owner) {
      const self = getAgentName()
      if (self) ((patch.owner = self), updatedFields.push('owner'))
    }

    // Metadata merge (null deletes key) @430829-430835
    if (metadata !== undefined) {
      const merged: Record<string, unknown> = { ...(existing.metadata ?? {}) }
      for (const [k, v] of Object.entries(metadata)) {
        if (v === null) delete merged[k]
        else merged[k] = v
      }
      ;(patch.metadata = merged), updatedFields.push('metadata')
    }

    // Status handling @430836-430867
    if (status !== undefined) {
      if (status === 'deleted') {
        const ok = await deleteTask(listId, taskId) // @430838
        return {
          data: {
            success: ok,
            taskId,
            updatedFields: ok ? ['deleted'] : [],
            error: ok ? undefined : 'Failed to delete task',
            statusChange: ok ? { from: existing.status, to: 'deleted' } : undefined,
          },
        }
      }
      if (status !== existing.status) {
        if (status === 'completed') {
          // Completion-validation hooks @430850-430864 — abort the update on a blocker.
          const blockingErrors: string[] = []
          const hooks = runTaskCompletedHooks(
            taskId,
            existing.subject,
            existing.description,
            getAgentName(),
            getTeamName(),
            undefined,
            context?.abortController?.signal,
            undefined,
            context,
          )
          for await (const result of hooks) {
            if (result.blockingError) blockingErrors.push(getTaskCompletedHookMessage(result.blockingError))
          }
          if (blockingErrors.length > 0)
            return { data: { success: false, taskId, updatedFields: [], error: blockingErrors.join('\n') } }
        }
        ;(patch.status = status), updatedFields.push('status')
      }
    }

    if (Object.keys(patch).length > 0) await updateTask(listId, taskId, patch) // @430868

    // Team assignment mailbox @430869-430881
    if (patch.owner && agentTeamsEnabled()) {
      const assignedBy = getAgentName() || 'team-lead'
      const color = getAgentColor()
      const frame = serialize({
        type: 'task_assignment',
        taskId,
        subject: existing.subject,
        description: existing.description,
        assignedBy,
        timestamp: new Date().toISOString(),
      })
      await deliverToTeammate(
        patch.owner,
        { from: assignedBy, text: frame, timestamp: new Date().toISOString(), color },
        listId,
      )
    }

    // Block edges @430882-430891
    if (addBlocks && addBlocks.length > 0) {
      const fresh = addBlocks.filter(id => !existing.blocks.includes(id))
      for (const id of fresh) await addBlockEdge(listId, taskId, id)
      if (fresh.length > 0) updatedFields.push('blocks')
    }
    if (addBlockedBy && addBlockedBy.length > 0) {
      const fresh = addBlockedBy.filter(id => !existing.blockedBy.includes(id))
      for (const id of fresh) await addBlockEdge(listId, id, taskId)
      if (fresh.length > 0) updatedFields.push('blockedBy')
    }

    return {
      data: {
        success: true,
        taskId,
        updatedFields,
        statusChange: patch.status !== undefined ? { from: existing.status, to: patch.status } : undefined,
      },
    }
  },
  // mapToolResult @430901-430909:
  //   fail → error || `Task #<id> not found`; success → `Updated task #<id> <fields>`;
  //   when status→completed AND (getCurrentAgentId() != null, i.e. we ARE a spawned
  //   agent/teammate) AND agentTeamsEnabled() append the "Task completed. Call TaskList
  //   now …" nudge so the worker agent immediately picks up its next task.
  //   NOTE: VD() returns the current agentId (truthy when running as a subagent/teammate),
  //   it is NOT an "isMainConversation" predicate.
  mapToolResultToToolResultBlockParam(content: TaskUpdateOutput, toolUseID: string) {
    const { success, taskId, updatedFields, error, statusChange } = content
    if (!success)
      return { tool_use_id: toolUseID, type: 'tool_result' as const, content: error || `Task #${taskId} not found` } // @430903
    let text = `Updated task #${taskId} ${updatedFields.join(', ')}` // @430904
    if (statusChange?.to === 'completed' && getCurrentAgentId() != null && agentTeamsEnabled()) // @430905
      text += '\n\nTask completed. Call TaskList now to find your next available task or see if your work unblocked others.' // @430906-430908
    return { tool_use_id: toolUseID, type: 'tool_result' as const, content: text }
  },
} satisfies ToolDef<ReturnType<typeof taskUpdateInputSchema>, TaskUpdateOutput>)
// helper: uWe @ runTaskCompletedHooks; H3t @ getTaskCompletedHookMessage; $A @ deliverToTeammate;
//         fT @ getAgentColor; Re @ serialize (JSON);
//         VD @103450 getCurrentAgentId — returns the current agentId from the async-local
//         store (GCr.getStore()) or $q fallback; truthy ⇒ we are a spawned agent/teammate.
declare function runTaskCompletedHooks(...args: unknown[]): AsyncGenerator<{ blockingError?: unknown }>
declare function getTaskCompletedHookMessage(err: unknown): string
declare function deliverToTeammate(to: string, frame: unknown, listId: string): Promise<unknown>
declare function getAgentColor(): unknown
declare function serialize(value: unknown): string
declare function getCurrentAgentId(): string | undefined

// ===========================================================================
// 5. TaskOutput  (DEPRECATED — prefer Read on the output file path)
// ===========================================================================

// 2.1.183: taskOutputInputSchema = sMp @cli_inner_pretty.js:428163-428169
const taskOutputInputSchema = () =>
  z.strictObject({
    task_id: z.string().describe('The task ID to get output from'), // @428165
    block: coercedBoolean(z.boolean().default(true)).describe('Whether to wait for completion'), // @428166
    timeout: z.number().min(0).max(600_000).default(30_000).describe('Max wait time in ms'), // @428167
  })
type TaskOutputInput = z.infer<ReturnType<typeof taskOutputInputSchema>>
// helper: n0 @ coercedBoolean — string/number → boolean wrapper (canonical name; was coerceBoolean)
declare function coercedBoolean<T extends z.ZodTypeAny>(schema: T): T

// 2.1.183: TaskOutputTool = q3n @cli_inner_pretty.js:428170-... (call @428216)
export const TaskOutputTool = buildTool({
  name: TASK_OUTPUT_TOOL_NAME,
  searchHint: 'read output/logs from a background task', // @428172
  maxResultSizeChars: 100_000,
  shouldDefer: true,
  // Legacy aliases so old tool-call names still resolve to this tool. @428175
  aliases: ['AgentOutputTool', 'BashOutputTool', 'AgentOutput', 'BashOutput'],
  userFacingName() {
    return 'Task Output'
  },
  get inputSchema() {
    return taskOutputInputSchema()
  },
  async description() {
    // @428183 (verbatim, em-dash U+2014):
    return '[Deprecated] — for bash and remote_agent tasks, prefer Read on the output file path; for local_agent tasks, use the Agent tool result directly'
  },
  isConcurrencySafe(input?: TaskOutputInput) {
    return this.isReadOnly?.(input) ?? false // @428186
  },
  isEnabled() {
    return true // @428189 — always available (background lifecycle, not gated by _H)
  },
  isReadOnly() {
    return true
  },
  toAutoClassifierInput(input: TaskOutputInput) {
    return input.task_id
  },
  // prompt @428197-428209 (verbatim, em-dashes U+2014):
  async prompt() {
    return `DEPRECATED: Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes.
- For bash tasks: prefer using the Read tool on that output file path — it contains stdout/stderr.
- For local_agent tasks: use the Agent tool result directly. Do NOT Read the .output file — it is a symlink to the full subagent conversation transcript (JSONL) and will overflow your context window.
- For remote_agent tasks: prefer using the Read tool on the output file path — it contains the streamed remote session output (same as bash).

- Retrieves output from a running or completed task (background shell, agent, or remote session)
- Takes a task_id parameter identifying the task
- Returns the task output along with status information
- Use block=true (default) to wait for task completion
- Use block=false for non-blocking check of current status
- Task IDs can be found using the /tasks command
- Works with all task types: background shells, async agents, and remote sessions`
  },
  // validateInput @428211-428214: id required + task must exist in appState.tasks.
  async validateInput({ task_id }: TaskOutputInput, context: { getAppState: () => { tasks?: Record<string, unknown> } }) {
    if (!task_id) return { result: false, message: 'Task ID is required', errorCode: 1 } // @428212
    if (!context.getAppState().tasks?.[task_id])
      return { result: false, message: `No task found with ID: ${task_id}`, errorCode: 2 } // @428213
    return { result: true }
  },
  /**
   * call @428216-428242 — read a background task's output:
   *   - Look up the task in appState.tasks; missing → throw `No task found with ID: <id>`.
   *   - block=false (non-blocking): if the task is terminal (not running/pending), mark it
   *     notified and return {retrieval_status:"success", task}; else {retrieval_status:
   *     "not_ready", task}.
   *   - block=true (default): emit a "waiting_for_task" progress event, then poll via the
   *     task-output waiter (iMp) up to `timeout` ms. Null → {retrieval_status:"timeout",
   *     task:null}; still running/pending → {"timeout", task}; otherwise mark notified and
   *     return {"success", task}. Tasks are serialized through W3n(...) for the wire.
   */
  async call(
    input: TaskOutputInput,
    context: ToolUseContext & { getAppState: () => { tasks?: Record<string, BackgroundTask> }; taskRegistry: TaskRegistry },
    _n?: unknown,
    _r?: unknown,
    onProgress?: (e: unknown) => void,
  ) {
    const { task_id, block, timeout } = input
    const task = context.getAppState().tasks?.[task_id]
    if (!task) throw new Error(`No task found with ID: ${task_id}`) // @428219

    if (!block) {
      if (task.status !== 'running' && task.status !== 'pending') {
        context.taskRegistry.update(task_id, t => ({ ...t, notified: true }))
        return { data: { retrieval_status: 'success', task: await serializeTaskOutput(task) } }
      }
      return { data: { retrieval_status: 'not_ready', task: await serializeTaskOutput(task) } }
    }

    onProgress?.({
      type: 'progress',
      toolUseID: `task-output-waiting-${Date.now()}`,
      data: { type: 'waiting_for_task', taskDescription: task.description, taskType: task.type },
    })
    const finished = await waitForTaskOutput(task_id, context.getAppState, timeout, context.abortController) // @428234 (iMp)
    if (!finished) return { data: { retrieval_status: 'timeout', task: null } }
    if (finished.status === 'running' || finished.status === 'pending')
      return { data: { retrieval_status: 'timeout', task: await serializeTaskOutput(finished) } }
    context.taskRegistry.update(task_id, t => ({ ...t, notified: true }))
    return { data: { retrieval_status: 'success', task: await serializeTaskOutput(finished) } }
  },
  // mapToolResult @428243-428268: XML-tagged block — <retrieval_status>, then if task:
  //   <task_id>/<task_type>/<status>/<exit_code?>/<output?>/<error?> (output truncated by J9a).
  mapToolResultToToolResultBlockParam(content: TaskOutputResult, toolUseID: string) {
    const parts: string[] = [`<retrieval_status>${content.retrieval_status}</retrieval_status>`]
    if (content.task) {
      const t = content.task
      parts.push(`<task_id>${t.task_id}</task_id>`)
      parts.push(`<task_type>${t.task_type}</task_type>`)
      parts.push(`<status>${t.status}</status>`)
      if (t.exitCode !== undefined && t.exitCode !== null) parts.push(`<exit_code>${t.exitCode}</exit_code>`)
      if (t.output?.trim()) {
        const { content: truncated } = truncateTaskOutput(t.output, t.task_id) // J9a @428254
        parts.push(`<output>\n${truncated.trimEnd()}\n</output>`)
      }
      if (t.error) parts.push(`<error>${t.error}</error>`)
    }
    return { tool_use_id: toolUseID, type: 'tool_result' as const, content: parts.join('\n\n') }
  },
  // renderToolUseMessage @428269-428272 ("non-blocking" | ""), renderToolUseTag,
  // renderToolUseProgressMessage, renderToolResultMessage, renderToolUseRejectedMessage,
  // renderToolUseErrorMessage — UI only; omitted.
} satisfies ToolDef<ReturnType<typeof taskOutputInputSchema>, TaskOutputResult>)
// helper: W3n @ serializeTaskOutput; iMp @ waitForTaskOutput; J9a @ truncateTaskOutput
interface BackgroundTask {
  status: string
  description?: string
  type?: string
}
interface TaskRegistry {
  get(id: string): BackgroundTask | undefined
  update(id: string, fn: (t: BackgroundTask) => BackgroundTask): void
}
interface TaskOutputResult {
  retrieval_status: 'success' | 'not_ready' | 'timeout'
  task: {
    task_id: string
    task_type: string
    status: string
    exitCode?: number | null
    output?: string
    error?: string
  } | null
}
declare function serializeTaskOutput(task: BackgroundTask): Promise<TaskOutputResult['task']>
declare function waitForTaskOutput(id: string, getAppState: unknown, timeout: number, abort: unknown): Promise<BackgroundTask | null>
declare function truncateTaskOutput(output: string, taskId: string): { content: string }

// ===========================================================================
// 6. TaskStop  (kill a running background task)
// ===========================================================================

// 2.1.183: taskStopPrompt = JOi @cli_inner_pretty.js:220835-220840 (verbatim; leading newline)
const TASK_STOP_PROMPT = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`

// 2.1.183: taskStopInputSchema = WDp @cli_inner_pretty.js:424853-424857
const taskStopInputSchema = () =>
  z.strictObject({
    task_id: z.string().optional().describe('The ID of the background task to stop'), // @424855
    shell_id: z.string().optional().describe('Deprecated: use task_id instead'), // @424856
  })
type TaskStopInput = z.infer<ReturnType<typeof taskStopInputSchema>>

// 2.1.183: taskStopOutputSchema = qDp @cli_inner_pretty.js:424859-424865
const taskStopOutputSchema = () =>
  z.object({
    message: z.string().describe('Status message about the operation'),
    task_id: z.string().describe('The ID of the task that was stopped'),
    task_type: z.string().describe('The type of the task that was stopped'),
    command: z.string().optional().describe('The command or description of the stopped task'),
  })
type TaskStopOutput = z.infer<ReturnType<typeof taskStopOutputSchema>>

// 2.1.183: TaskStopTool = edt @cli_inner_pretty.js:424867-424920
export const TaskStopTool = buildTool({
  name: TASK_STOP_TOOL_NAME,
  searchHint: 'kill a running background task', // @424869
  aliases: ['KillShell', 'KillBash'], // @424870 — legacy compat
  maxResultSizeChars: 100_000,
  userFacingName: () => 'Stop Task',
  get inputSchema() {
    return taskStopInputSchema()
  },
  get outputSchema() {
    return taskStopOutputSchema()
  },
  shouldDefer: true,
  isConcurrencySafe() {
    return true
  },
  toAutoClassifierInput(input: TaskStopInput) {
    return input.task_id ?? input.shell_id ?? ''
  },
  // validateInput @424886-424893: id (task_id||shell_id) required, task must exist, and
  //   must currently be running (else error).
  async validateInput({ task_id, shell_id }: TaskStopInput, context: { taskRegistry: TaskRegistry }) {
    const id = task_id ?? shell_id
    if (!id) return { result: false, message: 'Missing required parameter: task_id', errorCode: 1 } // @424888
    const task = context.taskRegistry.get(id)
    if (!task) return { result: false, message: `No task found with ID: ${id}`, errorCode: 1 } // @424890
    if (task.status !== 'running')
      return { result: false, message: `Task ${id} is not running (status: ${task.status})`, errorCode: 3 } // @424892
    return { result: true }
  },
  async description() {
    return 'Stop a running background task by ID' // @424896
  },
  async prompt() {
    return TASK_STOP_PROMPT
  },
  // mapToolResult @424901-424903: JSON-serialize the result object.
  mapToolResultToToolResultBlockParam(content: TaskStopOutput, toolUseID: string) {
    return { tool_use_id: toolUseID, type: 'tool_result' as const, content: serialize(content) }
  },
  // call @424906-424919: resolve id (task_id||shell_id); stopBackgroundTask(id, …) →
  //   {taskId, taskType, command}; return the success message.
  async call({ task_id, shell_id }: TaskStopInput, context: ToolUseContext & { taskRegistry: TaskRegistry; setAppState: unknown }) {
    const id = task_id ?? shell_id
    if (!id) throw new Error('Missing required parameter: task_id') // @424909
    const stopped = await stopBackgroundTask(id, {
      taskRegistry: context.taskRegistry,
      setAppState: context.setAppState,
      callerAgentId: getCallerAgentId(context), // Kjn @424910
    })
    return {
      data: {
        message: `Successfully stopped task: ${stopped.taskId} (${stopped.command})`, // @424913
        task_id: stopped.taskId,
        task_type: stopped.taskType,
        command: stopped.command,
      },
    }
  },
  // renderToolUseMessage: Uqa @424904, renderToolResultMessage: jqa @424905 — UI only; omitted.
} satisfies ToolDef<ReturnType<typeof taskStopInputSchema>, TaskStopOutput>)
// helper: a3t @ stopBackgroundTask; Kjn @ getCallerAgentId
declare function stopBackgroundTask(
  id: string,
  ctx: { taskRegistry: TaskRegistry; setAppState: unknown; callerAgentId: unknown },
): Promise<{ taskId: string; taskType: string; command?: string }>
declare function getCallerAgentId(context: unknown): unknown

// ---------------------------------------------------------------------------
// Family export — registered into getAllBaseTools alongside the Agent/Skill tools.
// ---------------------------------------------------------------------------
export const TASK_TOOLS = [
  TaskCreateTool,
  TaskGetTool,
  TaskListTool,
  TaskUpdateTool,
  TaskOutputTool,
  TaskStopTool,
] as const
