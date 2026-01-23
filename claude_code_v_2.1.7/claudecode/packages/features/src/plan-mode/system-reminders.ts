/**
 * @claudecode/features - Plan Mode System Reminders
 *
 * Generate system reminders for plan mode context.
 * Reconstructed from chunks.147.mjs:3247-3351
 */

import type { PlanReminderType } from './types.js';
import { PLAN_MODE_CONSTANTS } from './types.js';

// ============================================
// Tool Name References
// ============================================

const WRITE_TOOL_NAME = 'Write';
const EDIT_TOOL_NAME = 'Edit';
const EXIT_PLAN_MODE_NAME = 'ExitPlanMode';
const ASK_USER_QUESTION_NAME = 'AskUserQuestion';

// ============================================
// Agent Configurations
// ============================================

/**
 * Explore agent configuration.
 * Original: MS in chunks.93.mjs
 */
export const ExploreAgentConfig = {
  agentType: 'Explore',
  description: 'Fast agent specialized for exploring codebases',
};

/**
 * Plan agent configuration.
 * Original: UY1 in chunks.93.mjs
 */
export const PlanAgentConfig = {
  agentType: 'Plan',
  description: 'Software architect agent for designing implementation plans',
};

// ============================================
// Agent Count Limits
// ============================================

/**
 * Get maximum plan agents from environment.
 * Original: LJ9 in chunks.147.mjs:2289-2298
 */
export function getMaxPlanAgents(): number {
  const envValue = process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      return parsed;
    }
  }
  return PLAN_MODE_CONSTANTS.DEFAULT_PLAN_AGENT_COUNT;
}

/**
 * Get maximum explore agents from environment.
 * Original: OJ9 in chunks.147.mjs:2301-2306
 */
export function getMaxExploreAgents(): number {
  const envValue = process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      return parsed;
    }
  }
  return PLAN_MODE_CONSTANTS.DEFAULT_EXPLORE_AGENT_COUNT;
}

// ============================================
// System Reminder Context
// ============================================

/**
 * Context for building plan mode reminders.
 */
export interface PlanModeReminderContext {
  /** Whether this is a subagent context */
  isSubAgent: boolean;
  /** Reminder type: full, sparse, or subagent */
  reminderType: PlanReminderType;
  /** Whether plan file exists */
  planExists: boolean;
  /** Path to plan file */
  planFilePath: string;
}

// ============================================
// System Reminder Builders
// ============================================

/**
 * Build plan mode system reminder (router).
 * Original: z$7 in chunks.147.mjs:3247-3251
 *
 * @param context - Plan mode reminder context
 * @returns System reminder content
 */
export function buildPlanModeSystemReminder(
  context: PlanModeReminderContext
): string {
  if (context.isSubAgent) {
    return buildSubAgentPlanReminder(context);
  }
  if (context.reminderType === 'sparse') {
    return buildSparsePlanReminder(context);
  }
  return buildFullPlanReminder(context);
}

/**
 * Build full plan mode reminder with 5-phase workflow.
 * Original: $$7 in chunks.147.mjs:3253-3330
 *
 * @param context - Plan mode reminder context
 * @returns Full system reminder content
 */
export function buildFullPlanReminder(
  context: PlanModeReminderContext
): string {
  if (context.isSubAgent) {
    return '';
  }

  const maxPlanAgents = getMaxPlanAgents();
  const maxExploreAgents = getMaxExploreAgents();

  const planFileInfo = context.planExists
    ? `A plan file already exists at ${context.planFilePath}. You can read it and make incremental edits using the ${EDIT_TOOL_NAME} tool.`
    : `No plan file exists yet. You should create your plan at ${context.planFilePath} using the ${WRITE_TOOL_NAME} tool.`;

  const multiAgentGuidelines = maxPlanAgents > 1
    ? `- **Multiple agents**: Use up to ${maxPlanAgents} agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture
`
    : '';

  return `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${planFileInfo}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the ${ExploreAgentConfig.agentType} subagent type.

1. Focus on understanding the user's request and the code associated with their request

2. **Launch up to ${maxExploreAgents} ${ExploreAgentConfig.agentType} agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - ${maxExploreAgents} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigating testing patterns


### Phase 2: Design
Goal: Design an implementation approach.

Launch ${PlanAgentConfig.agentType} agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${maxPlanAgents} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
${multiAgentGuidelines}
In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use ${ASK_USER_QUESTION_NAME} to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### Phase 5: Call ${EXIT_PLAN_MODE_NAME}
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${EXIT_PLAN_MODE_NAME} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${ASK_USER_QUESTION_NAME} tool OR calling ${EXIT_PLAN_MODE_NAME}. Do not stop unless it's for these 2 reasons

**Important:** Use ${ASK_USER_QUESTION_NAME} ONLY to clarify requirements or choose between approaches. Use ${EXIT_PLAN_MODE_NAME} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${EXIT_PLAN_MODE_NAME}.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the ${ASK_USER_QUESTION_NAME} tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;
}

/**
 * Build sparse plan mode reminder.
 * Original: C$7 in chunks.147.mjs:3332-3338
 *
 * @param context - Plan mode reminder context
 * @returns Sparse system reminder content
 */
export function buildSparsePlanReminder(
  context: PlanModeReminderContext
): string {
  return `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${context.planFilePath}). Follow 5-phase workflow. End turns with ${ASK_USER_QUESTION_NAME} (for clarifications) or ${EXIT_PLAN_MODE_NAME} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
}

/**
 * Build subagent plan mode reminder.
 * Original: U$7 in chunks.147.mjs:3340-3351
 *
 * @param context - Plan mode reminder context
 * @returns Subagent system reminder content
 */
export function buildSubAgentPlanReminder(
  context: PlanModeReminderContext
): string {
  const planFileInfo = context.planExists
    ? `A plan file already exists at ${context.planFilePath}. You can read it and make incremental edits using the ${EDIT_TOOL_NAME} tool if you need to.`
    : `No plan file exists yet. You should create your plan at ${context.planFilePath} using the ${WRITE_TOOL_NAME} tool if you need to.`;

  return `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${planFileInfo}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${ASK_USER_QUESTION_NAME} tool if you need to ask the user clarifying questions. If you do use the ${ASK_USER_QUESTION_NAME}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
}

// ============================================
// Attachment Counting
// ============================================

/**
 * Determine reminder type based on attachment count.
 * Original: Part of z$7 logic
 */
export function getReminderType(
  attachmentCount: number
): PlanReminderType {
  const interval = PLAN_MODE_CONSTANTS.FULL_REMINDER_EVERY_N_ATTACHMENTS;
  if (attachmentCount === 0 || attachmentCount % interval === 0) {
    return 'full';
  }
  return 'sparse';
}
