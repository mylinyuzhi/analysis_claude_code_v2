/**
 * TodoWriteTool — the per-session task checklist.
 *
 * Readable-source reconstruction of the v2.1.183 obfuscated tool object `Dxe`
 * (the `pi({...})`-built TodoWrite tool). The notable v2.1.183 detail is the
 * TWO-VARIANT prompt: a short "working plan" form (`C8d`, used when the lean/simple
 * system-prompt predicate `Dg(model)` is true) and the long classic form (`I8d`,
 * default). Both are quoted verbatim from the bundle. TodoWrite is mutually
 * exclusive with the Task* tool family: it is enabled only when Task* is disabled.
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - item schema T8d/w8d/mst @299307-299317
 *   - prompt selector Ula @299319-299321; short prompt C8d @299322-299323
 *   - description jla @299325-299326; long prompt I8d @299330-299508
 *   - input/output schemas x8d/k8d @299518-299524
 *   - tool object Dxe = pi({...}) @299525-299576
 *   - name const mR = "TodoWrite" @221398
 *   - enable gate _H() @299032-299035 (TodoWrite uses !_H())
 *   - lean predicate Dg = wn(...) @134268-134273
 * 2.1.88 convention mirror: src/tools/TodoWriteTool/{TodoWriteTool.ts,prompt.ts,constants.ts}
 * 2.1.156 scaffold: 04_tools/README.md (tool-assembly spine; readable names inherited)
 * Cross-validation: re-read 299305-299576 in the 2.1.183 bundle; confirmed I8d is
 *   byte-identical to the 2.1.88 PROMPT constant (the `${Fa}` interpolation in the
 *   "add a comment" example is the Edit tool name — `var Fa = "Edit"` @152083, value
 *   "Edit", NOT "FileEdit"), confirmed the short C8d variant and the `Dg`-gated
 *   selector, and the post-call result nudge string verbatim.
 */

import { z } from 'zod/v4'
import { buildTool, type Tool, type ToolDef } from '../Tool.js'
import type { ToolResult } from '../Tool.js'
import { lazySchema } from 'src/utils/lazySchema.js' // we() — lazy memoized schema thunk
import { EDIT_TOOL_NAME } from '../EditTool/constants.js' // Fa = "Edit" @152083

// 2.1.183: TODO_WRITE_TOOL_NAME = mR @221398
export const TODO_WRITE_TOOL_NAME = 'TodoWrite'

/**
 * Task-tools enable gate. Returns false when CLAUDE_CODE_ENABLE_TASKS is explicitly
 * set falsey; TodoWrite is the *inverse* — it is enabled only when the Task* family
 * is disabled (the two are mutually exclusive task-tracking surfaces).
 * 2.1.183: taskToolsEnabled = _H @299032-299035
 */
declare function taskToolsEnabled(): boolean // _H()

/**
 * Lean / simple-system-prompt predicate. Env override CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT
 * forces it; otherwise it is a model-family check. Selects the short TodoWrite prompt
 * variant when true.
 * 2.1.183: isLeanSystemPrompt = Dg = wn((model) => {...}) @134268-134273
 */
declare function isLeanSystemPrompt(model: string): boolean // Dg(e)

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

// 2.1.183: todoStatus = T8d = we(() => H.enum([...])) @299309
const todoStatus = lazySchema(() => z.enum(['pending', 'in_progress', 'completed']))

// 2.1.183: todoItem = w8d = we(() => H.object({...})) @299310-299315
const todoItem = lazySchema(() =>
  z.object({
    content: z.string().min(1, 'Content cannot be empty'), // @299312
    status: todoStatus(), // @299313
    activeForm: z.string().min(1, 'Active form cannot be empty'), // @299314
  }),
)

// 2.1.183: todoList = mst = we(() => H.array(w8d())) @299317
const todoList = lazySchema(() => z.array(todoItem()))

// 2.1.183: inputSchema = x8d = we(() => H.strictObject({...})) @299518
export const inputSchema = lazySchema(() =>
  z.strictObject({
    todos: todoList().describe('The updated todo list'), // @299518
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// 2.1.183: outputSchema = k8d = we(() => H.object({...})) @299519-299524
export const outputSchema = lazySchema(() =>
  z.object({
    oldTodos: todoList().describe('The todo list before the update'), // @299521
    newTodos: todoList().describe('The todo list after the update'), // @299522
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.input<OutputSchema>

// ---------------------------------------------------------------------------
// Description + prompt variants (verbatim from bundle)
// ---------------------------------------------------------------------------

// 2.1.183: DESCRIPTION = jla @299325-299326 — verbatim.
export const DESCRIPTION =
  'Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task.'

// 2.1.183: SHORT_PROMPT = C8d @299322-299323 — the lean "working plan" variant,
// used when isLeanSystemPrompt(model) is true. Verbatim.
export const SHORT_PROMPT = `Create and update a task list for the current session. The list is rendered to the user as your working plan.

- Each todo has \`content\`, \`status\` ("pending" | "in_progress" | "completed"), and \`activeForm\` (present-tense label shown while in progress).
- Send the full list each call; it replaces the previous one.
- Keep one item \`in_progress\` at a time and mark it \`completed\` when done.`

// 2.1.183: LONG_PROMPT = I8d @299330-299508 — the classic default variant. Verbatim;
// the only interpolation is the FileEdit tool name in the "add a comment" example.
export const LONG_PROMPT = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: *Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: *Uses grep or search tools to locate all instances of getCwd in the codebase*
I've found 15 instances of 'getCwd' across 8 different files.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>


<example>
User: I need to implement these features for my e-commerce site: user registration, product catalog, shopping cart, and checkout flow.
Assistant: *Creates a todo list breaking down each feature into specific tasks based on the project architecture*
Let's start with user registration. This will involve creating database models, API endpoints, and frontend forms that integrate with your existing authentication system.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple complex features to implement in a comma separated list
2. The todo list helps organize these large features into manageable tasks
3. This approach allows for tracking progress across the entire implementation
</reasoning>
</example>

<example>
User: Can you help optimize my React application? It's rendering slowly and has performance issues.
Assistant: *Reviews component structure, render patterns, state management, and data fetching*
After analyzing your codebase, I've identified several performance issues.
*Creates todo list with items like: 1) Implementing memoization for expensive calculations in ProductList, 2) Adding virtualization for long lists in Dashboard, 3) Optimizing image loading in Gallery component, 4) Fixing state update loops in ShoppingCart, 5) Reviewing bundle size and implementing code splitting*
Let's start by implementing memoization for the expensive calculations in your ProductList component.

<reasoning>
The assistant used the todo list because:
1. First, the assistant examined the codebase to identify specific performance issues
2. Based on this analysis, it identified multiple optimization opportunities
3. Performance optimization is a non-trivial task requiring multiple steps
4. The todo list helps methodically track improvements across different components
5. This systematic approach ensures all performance bottlenecks are addressed
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

python
print("Hello World")

This will output the text "Hello World" to the console when executed.

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What does the git status command do?
Assistant: The git status command shows the current state of your working directory and staging area. It displays which changes have been staged, which haven't, and which files aren't being tracked by Git. This is a fundamental command for understanding the current state of your repository before making commits.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual coding task to complete. The user is simply asking for an explanation, not for the assistant to perform multiple steps or tasks.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the ${EDIT_TOOL_NAME} tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location in the code. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.

*Executes: npm install*

The command completed successfully. Here's the output:
[Output of npm install command]

All dependencies have been installed according to your package.json file.

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward task.
</reasoning>
</example>

## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`

/**
 * Prompt selector — lean sessions get the compact "working plan"; everyone else
 * gets the long classic guidance.
 * 2.1.183: getTodoPrompt = Ula(model) @299319-299321 → Dg(e) ? C8d : I8d
 */
export function getTodoPrompt(model: string): string {
  return isLeanSystemPrompt(model) ? SHORT_PROMPT : LONG_PROMPT
}

// ---------------------------------------------------------------------------
// Tool object
// ---------------------------------------------------------------------------

// 2.1.183: TodoWriteTool = Dxe = pi({...}) @299525-299576
export const TodoWriteTool: Tool<InputSchema, Output> = buildTool({
  name: TODO_WRITE_TOOL_NAME, // @299526
  searchHint: 'manage the session task checklist', // @299527
  maxResultSizeChars: 100_000, // @299528 — 1e5
  strict: true, // @299529

  async description() {
    return DESCRIPTION // @299530-299532
  },
  async prompt({ model }) {
    return getTodoPrompt(model) // @299533-299535 — Ula(e)
  },

  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },

  // @299542-299544 — intentionally blank: TodoWrite renders no tool header in the UI.
  userFacingName() {
    return ''
  },
  shouldDefer: true, // @299545

  // @299546-299548 — enabled only when the Task* family is disabled (mutually exclusive).
  isEnabled(): boolean {
    return !taskToolsEnabled()
  },

  // @299549-299551 — backseat classifier just needs the item count.
  toAutoClassifierInput(input) {
    return `${input.todos.length} items`
  },

  // @299552-299554 — always allowed; no permission prompt.
  async checkPermissions(input) {
    return { behavior: 'allow', updatedInput: input }
  },

  // @299555-299557 — no inline tool-use message; the list is rendered separately.
  renderToolUseMessage() {
    return null
  },

  /**
   * call — @299558-299567. Per-agent todo store keyed by the calling agent id
   * (falling back to the current root agent id when unset). When EVERY item is
   * completed, the stored list is cleared to `[]` (a finished checklist disappears);
   * otherwise the full provided list replaces the previous one. Returns the before
   * (`oldTodos`) and after (`newTodos`) snapshots — note `newTodos` is the *provided*
   * list, even when the store was cleared.
   */
  async call({ todos }, context): Promise<ToolResult<Output>> {
    const appState = context.getAppState()
    const agentId = context.agentId ?? getCurrentRootAgentId() // xt()
    const oldTodos = appState.todos[agentId] ?? []
    const stored = todos.every(t => t.status === 'completed') ? [] : todos
    context.setAppState(s => ({ ...s, todos: { ...s.todos, [agentId]: stored } }))
    return { data: { oldTodos, newTodos: todos } }
  },

  /**
   * mapToolResultToToolResultBlockParam — @299568-299575. The post-call nudge that
   * keeps the model using the checklist. Verbatim.
   */
  mapToolResultToToolResultBlockParam(_result, toolUseID) {
    return {
      tool_use_id: toolUseID,
      type: 'tool_result' as const,
      content:
        'Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable',
    }
  },
} satisfies ToolDef<InputSchema, Output>)

// helper: getCurrentRootAgentId — xt() @299560 — resolves the current root agent id
// used to key the per-agent todo store when context.agentId is undefined.
declare function getCurrentRootAgentId(): string // xt()
