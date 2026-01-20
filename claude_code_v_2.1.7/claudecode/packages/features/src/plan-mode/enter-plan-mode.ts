/**
 * @claudecode/features - EnterPlanMode Tool
 *
 * Tool to enter plan mode for complex tasks.
 * Reconstructed from chunks.120.mjs:519-605
 */

import type { EnterPlanModeInput, EnterPlanModeOutput, PermissionMode } from './types.js';
import { onToolPermissionModeChanged } from './state.js';

// ============================================
// Tool Name
// ============================================

/**
 * EnterPlanMode tool name.
 * Original: VK1 in chunks.120.mjs
 */
export const ENTER_PLAN_MODE_NAME = 'EnterPlanMode';

// ============================================
// Tool Description
// ============================================

/**
 * Detailed description for when to use EnterPlanMode.
 * Original: Au2 in chunks.120.mjs
 */
export const ENTER_PLAN_MODE_DESCRIPTION = `
Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

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
   - If you would use AskUserQuestion to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Task tool with explore agent instead)

## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use AskUserQuestion if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement
`;

// ============================================
// Tool Result Message
// ============================================

/**
 * Generate result message for tool result.
 */
export function getEnterPlanModeResultMessage(message: string): string {
  return `${message}

In plan mode, you should:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Identify similar existing features or patterns to follow
3. Consider multiple implementation approaches
4. Use AskUserQuestion to clarify ambiguities
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to request approval

Remember: DO NOT write or edit any files yet. Focus on understanding and planning.`;
}

// ============================================
// Tool Implementation
// ============================================

/**
 * EnterPlanMode tool definition.
 * Original: gbA in chunks.120.mjs
 */
export const EnterPlanModeTool = {
  name: ENTER_PLAN_MODE_NAME,
  maxResultSizeChars: 100000,

  async description(): Promise<string> {
    return 'Requests permission to enter plan mode for complex tasks requiring exploration and design';
  },

  async prompt(): Promise<string> {
    return ENTER_PLAN_MODE_DESCRIPTION;
  },

  // Empty input schema
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
  },

  // Message output schema
  outputSchema: {
    type: 'object' as const,
    properties: {
      message: { type: 'string' },
    },
    required: ['message'],
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
    return true;
  },

  async checkPermissions(
    input: EnterPlanModeInput
  ): Promise<{ behavior: 'allow'; updatedInput: EnterPlanModeInput }> {
    return { behavior: 'allow', updatedInput: input };
  },

  async call(
    _input: EnterPlanModeInput,
    toolUseContext: {
      agentId?: string;
      getAppState: () => Promise<{ toolPermissionContext: { mode: PermissionMode } }>;
      setAppState: (
        updater: (
          state: { toolPermissionContext: { mode: PermissionMode } }
        ) => { toolPermissionContext: { mode: PermissionMode } }
      ) => void;
    }
  ): Promise<{ data: EnterPlanModeOutput }> {
    // Cannot be used by subagents
    if (toolUseContext.agentId) {
      throw new Error('EnterPlanMode tool cannot be used in agent contexts');
    }

    const appState = await toolUseContext.getAppState();

    // Trigger mode transition handler
    onToolPermissionModeChanged(appState.toolPermissionContext.mode, 'plan');

    // Update app state to plan mode
    toolUseContext.setAppState((state) => ({
      ...state,
      toolPermissionContext: {
        ...state.toolPermissionContext,
        mode: 'plan' as PermissionMode,
      },
    }));

    return {
      data: {
        message: 'Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.',
      },
    };
  },

  mapToolResultToToolResultBlockParam(
    { message }: EnterPlanModeOutput,
    toolUseId: string
  ): { type: 'tool_result'; content: string; tool_use_id: string } {
    return {
      type: 'tool_result',
      content: getEnterPlanModeResultMessage(message),
      tool_use_id: toolUseId,
    };
  },
};

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
