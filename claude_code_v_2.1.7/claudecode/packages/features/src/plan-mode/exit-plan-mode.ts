/**
 * @claudecode/features - ExitPlanMode Tool
 *
 * Tool to exit plan mode after user approval.
 * Reconstructed from chunks.119.mjs:2494-2605
 */

import type {
  ExitPlanModeInput,
  ExitPlanModeOutput,
  AllowedPrompt,
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
 * Detailed description for ExitPlanMode.
 * Original: Xg2 in chunks.119.mjs
 */
export const EXIT_PLAN_MODE_DESCRIPTION = `
Use this tool when you are in plan mode and have finished writing your plan to the plan file and are ready for user approval.

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
- Scope permissions narrowly, like a security-conscious human would:
  - Prefer "run read-only database queries" over "run database queries"
  - Prefer "run tests in the project" over "run code"
  - Add constraints like "read-only", "local", "non-destructive" whenever possible

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
`;

// ============================================
// Tool Result Message
// ============================================

/**
 * Generate result message for agent context.
 */
function getAgentResultMessage(): string {
  return 'User has approved the plan. Please respond with "ok"';
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
function getPlanApprovedResultMessage(plan: string, filePath: string): string {
  return `User has approved your plan. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}

## Approved Plan:
${plan}`;
}

// ============================================
// Tool Implementation
// ============================================

/**
 * ExitPlanMode tool definition.
 * Original: V$ in chunks.119.mjs
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

  // Input schema with optional allowedPrompts
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
        description: 'Prompt-based permissions needed to implement the plan.',
      },
    },
    required: [] as string[],
  },

  // Output schema
  outputSchema: {
    type: 'object' as const,
    properties: {
      plan: { type: 'string' },
      isAgent: { type: 'boolean' },
      filePath: { type: 'string' },
      awaitingLeaderApproval: { type: 'boolean' },
    },
  },

  isEnabled(): boolean {
    // Disabled in remote mode
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
          state: { toolPermissionContext: { mode: PermissionMode } }
        ) => { toolPermissionContext: { mode: PermissionMode } }
      ) => void;
    }
  ): Promise<{ data: ExitPlanModeOutput }> {
    const isAgent = !!toolUseContext.agentId;
    const planFilePath = getPlanFilePath(toolUseContext.agentId);
    const planContent = readPlanFile(toolUseContext.agentId);

    toolUseContext.setAppState((state) => {
      if (state.toolPermissionContext.mode !== 'plan') {
        return state;
      }

      // Set flags for re-entry detection
      setHasExitedPlanMode(true);
      setNeedsPlanModeExitAttachment(true);

      return {
        ...state,
        toolPermissionContext: {
          ...state.toolPermissionContext,
          mode: 'default' as PermissionMode,
        },
      };
    });

    return {
      data: {
        plan: planContent || undefined,
        isAgent,
        filePath: planFilePath,
      },
    };
  },

  mapToolResultToToolResultBlockParam(
    { isAgent, plan, filePath }: ExitPlanModeOutput,
    toolUseId: string
  ): { type: 'tool_result'; content: string; tool_use_id: string } {
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
      content: getPlanApprovedResultMessage(plan, filePath || ''),
      tool_use_id: toolUseId,
    };
  },
};

// ============================================
// Export
// ============================================

export {
  EXIT_PLAN_MODE_NAME,
  EXIT_PLAN_MODE_DESCRIPTION,
  ExitPlanModeTool,
};
