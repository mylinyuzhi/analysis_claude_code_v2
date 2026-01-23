/**
 * @claudecode/features - ExitPlanMode Tool
 *
 * Tool to exit plan mode after user approval.
 * Reconstructed from chunks.119.mjs:2494-2605
 */

import type {
  ExitPlanModeInput,
  ExitPlanModeOutput,
  PermissionMode,
} from './types.js';
import { getPlanFilePath, readPlanFile } from './plan-file.js';
import { setHasExitedPlanMode, setNeedsPlanModeExitAttachment } from './state.js';

// ============================================
// Tool Name
// ============================================

/**
 * ExitPlanMode tool name.
 * Original: vd in chunks.119.mjs
 */
export const EXIT_PLAN_MODE_NAME = 'ExitPlanMode';

// ============================================
// Tool Description
// ============================================

/**
 * Guideline for scoping permissions.
 * Original: Jg2 in chunks.119.mjs:2303-2310
 */
const PERMISSION_SCOPING_GUIDELINES = `- Scope permissions narrowly, like a security-conscious human would:
  - **Never combine multiple actions into one permission** - split them into separate, specific permissions (e.g. "list pods in namespace X", "view logs in namespace X")
  - Prefer "run read-only database queries" over "run database queries"
  - Prefer "run tests in the project" over "run code"
  - Add constraints like "read-only", "local", "non-destructive" whenever possible. If you only need read-only access, you must only request read-only access.
  - Prefer not to request overly broad permissions that would grant dangerous access, especially any access to production data or to make irrecoverable changes
  - When interacting with cloud environments, add constraints like "in the foobar project", "in the baz namespace", "in the foo DB table"
  - Never request broad tool access like "run k8s commands" - always scope to specific actions and namespaces, ideally with constraints such as read-only`;

/**
 * Detailed description for ExitPlanMode.
 * Original: Xg2 in chunks.119.mjs:2332-2383
 */
export const EXIT_PLAN_MODE_DESCRIPTION = `Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

## How This Tool Works
- You should have already written your plan to the plan file specified in the plan mode system message
- This tool does NOT take the plan content as a parameter - it will read the plan from the file you wrote
- This tool simply signals that you're done planning and ready for the user to review and approve
- The user will see the contents of your plan file when they review it

## Requesting Permissions (allowedPrompts)
When calling this tool, you can request prompt-based permissions for bash commands your plan will need. These are semantic descriptions of actions, not literal commands.

**How to use:**
\`\`\`json
{
  "allowedPrompts": [
    { "tool": "Bash", "prompt": "run tests" },
    { "tool": "Bash", "prompt": "install dependencies" },
    { "tool": "Bash", "prompt": "build the project" }
  ]
}
\`\`\`

**Guidelines for prompts:**
- Use semantic descriptions that capture the action's purpose, not specific commands
- "run tests" matches: npm test, pytest, go test, bun test, etc.
- "install dependencies" matches: npm install, pip install, cargo build, etc.
- "build the project" matches: npm run build, make, cargo build, etc.
- Keep descriptions concise but descriptive
- Only request permissions you actually need for the plan
${PERMISSION_SCOPING_GUIDELINES}

**Benefits:**
- Commands matching approved prompts won't require additional permission prompts
- The user sees the requested permissions when approving the plan
- Permissions are session-scoped and cleared when the session ends

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
`;

// ============================================
// Tool Result Messages
// ============================================

/**
 * Generate result message for leader approval.
 */
function getLeaderApprovalResultMessage(filePath: string, requestId?: string): string {
  return `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${requestId || 'unknown'}`;
}

/**
 * Generate result message for agent context.
 */
function getAgentResultMessage(): string {
  return 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"';
}

/**
 * Generate result message for empty plan.
 */
function getEmptyPlanResultMessage(): string {
  return 'User has approved exiting plan mode. You can now proceed.';
}

/**
 * Generate result message with plan.
 */
function getPlanApprovedResultMessage(filePath: string): string {
  return `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.`;
}

// ============================================
// Tool Implementation
// ============================================

/**
 * ExitPlanMode tool definition.
 * Original: V$ in chunks.119.mjs:2494-2605
 */
export const ExitPlanModeTool = {
  name: EXIT_PLAN_MODE_NAME,
  maxResultSizeChars: 100000,

  async description(): Promise<string> {
    return 'Prompts the user to exit plan mode and start coding';
  },

  async prompt(): Promise<string> {
    return EXIT_PLAN_MODE_DESCRIPTION;
  },

  // Input schema (Yl5)
  inputSchema: {
    type: 'object' as const,
    properties: {
      allowedPrompts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            tool: { type: 'string', enum: ['Bash'] },
            prompt: { type: 'string' },
          },
          required: ['tool', 'prompt'],
        },
        description: 'Prompt-based permissions needed to implement the plan. These describe categories of actions rather than specific commands.',
      },
    },
    required: [] as string[],
  },

  // Output schema (Jl5)
  outputSchema: {
    type: 'object' as const,
    properties: {
      plan: { 
        type: 'string', 
        nullable: true,
        description: 'The plan that was presented to the user'
      },
      isAgent: { type: 'boolean' },
      filePath: { 
        type: 'string',
        description: 'The file path where the plan was saved'
      },
      awaitingLeaderApproval: { type: 'boolean' },
      requestId: { type: 'string' },
    },
    required: ['isAgent'],
  },

  userFacingName(): string {
    return '';
  },

  isEnabled(): boolean {
    if (process.env.CLAUDE_CODE_REMOTE === 'true') return false;
    return true;
  },

  isConcurrencySafe(): boolean {
    return true;
  },

  isReadOnly(): boolean {
    return false; // Modifies state
  },

  requiresUserInteraction(): boolean {
    return true; // Needs user approval
  },

  async checkPermissions(
    input: ExitPlanModeInput
  ): Promise<{ behavior: 'ask'; message: string; updatedInput: ExitPlanModeInput }> {
    return { behavior: 'ask', message: 'Exit plan mode?', updatedInput: input };
  },

  async call(
    _input: ExitPlanModeInput,
    toolUseContext: {
      agentId?: string;
      getAppState: () => Promise<{ toolPermissionContext: { mode: PermissionMode } }>;
      setAppState: (
        updater: (
          state: any
        ) => any
      ) => void;
    }
  ): Promise<{ data: ExitPlanModeOutput }> {
    const isAgent = !!toolUseContext.agentId;
    const planFilePath = getPlanFilePath(toolUseContext.agentId);
    const planContent = readPlanFile(toolUseContext.agentId);

    toolUseContext.setAppState((state: any) => {
      if (state.toolPermissionContext.mode !== 'plan') {
        return state;
      }

      // Set flags for re-entry detection (Iq, lw)
      setHasExitedPlanMode(true);
      setNeedsPlanModeExitAttachment(true);

      return {
        ...state,
        toolPermissionContext: {
          ...state.toolPermissionContext,
          mode: 'default' as PermissionMode,
          // In Source, UJ(X.toolPermissionContext, { type: "setMode", mode: "default", destination: "session" })
        },
      };
    });

    return {
      data: {
        plan: planContent,
        isAgent,
        filePath: planFilePath,
      },
    };
  },

  mapToolResultToToolResultBlockParam(
    { isAgent, plan, filePath, awaitingLeaderApproval, requestId }: ExitPlanModeOutput,
    toolUseId: string
  ): { type: 'tool_result'; content: string; tool_use_id: string } {
    if (awaitingLeaderApproval) {
      return {
        type: 'tool_result',
        content: getLeaderApprovalResultMessage(filePath || 'unknown', requestId),
        tool_use_id: toolUseId,
      };
    }

    if (isAgent) {
      return {
        type: 'tool_result',
        content: getAgentResultMessage(),
        tool_use_id: toolUseId,
      };
    }

    if (!plan || plan.trim() === '') {
      return {
        type: 'tool_result',
        content: getEmptyPlanResultMessage(),
        tool_use_id: toolUseId,
      };
    }

    return {
      type: 'tool_result',
      content: getPlanApprovedResultMessage(filePath || ''),
      tool_use_id: toolUseId,
    };
  },
};
