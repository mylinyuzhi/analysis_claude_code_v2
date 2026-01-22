/**
 * @claudecode/core - Plan Mode Instructions
 *
 * Instruction templates and router for plan mode.
 * Reconstructed from chunks.147.mjs:3247-3351
 */

import type { Attachment, UserMessage } from './types.js';
import { wrapInSystemReminder } from './utils.js';
import { createUserMessage } from './factory.js';

// Default values for agent counts
const DEFAULT_MAX_EXPLORE_AGENTS = 3;
const DEFAULT_MAX_PLAN_AGENTS = 1;

/**
 * Plan Mode Router.
 * Original: z$7 in chunks.147.mjs:3247-3251
 */
export function generatePlanModeInstructions(attachment: Attachment): UserMessage[] {
  if (attachment.isSubAgent) {
    return generateSubAgentPlanModeInstructions(attachment);
  }
  if (attachment.reminderType === 'sparse') {
    return generateSparsePlanModeInstructions(attachment);
  }
  return generateFullPlanModeInstructions(attachment);
}

/**
 * Full Plan Mode Instructions.
 * Original: $$7 in chunks.147.mjs:3253-3330
 */
export function generateFullPlanModeInstructions(attachment: Attachment): UserMessage[] {
  const maxPlanAgents = DEFAULT_MAX_PLAN_AGENTS;
  const maxExploreAgents = DEFAULT_MAX_EXPLORE_AGENTS;

  const content = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${
  attachment.planExists
    ? `A plan file already exists at ${attachment.planFilePath}. You can read it and make incremental edits using the Edit tool.`
    : `No plan file exists yet. You should create your plan at ${attachment.planFilePath} using the Write tool.`
}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the Explore subagent type.

1. Focus on understanding the user's request and the code associated with their request

2. **Launch up to ${maxExploreAgents} Explore agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - ${maxExploreAgents} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigates testing patterns

3. After exploring the code, use the AskUserQuestion tool to clarify ambiguities in the user request up front.

### Phase 2: Design
Goal: Design an implementation approach.

Launch Plan agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${maxPlanAgents} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
${
  maxPlanAgents > 1
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
    : ''
}
In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use AskUserQuestion to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### Phase 5: Call ExitPlanMode
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ExitPlanMode to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the AskUserQuestion tool OR calling ExitPlanMode. Do not stop unless it's for these 2 reasons

**Important:** Use AskUserQuestion ONLY to clarify requirements or choose between approaches. Use ExitPlanMode to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ExitPlanMode.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the AskUserQuestion tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;

  return wrapInSystemReminder([
    createUserMessage({
      content,
      isMeta: true,
    }),
  ]);
}

/**
 * Sparse Plan Mode Instructions.
 * Original: C$7 in chunks.147.mjs:3332-3338
 */
export function generateSparsePlanModeInstructions(attachment: Attachment): UserMessage[] {
  const content = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${attachment.planFilePath}). Follow 5-phase workflow. End turns with AskUserQuestion (for clarifications) or ExitPlanMode (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
  
  return wrapInSystemReminder([
    createUserMessage({
      content,
      isMeta: true,
    }),
  ]);
}

/**
 * Sub-Agent Plan Mode Instructions.
 * Original: U$7 in chunks.147.mjs:3340-3351
 */
export function generateSubAgentPlanModeInstructions(attachment: Attachment): UserMessage[] {
  const content = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${
  attachment.planExists
    ? `A plan file already exists at ${attachment.planFilePath}. You can read it and make incremental edits using the Edit tool if you need to.`
    : `No plan file exists yet. You should create your plan at ${attachment.planFilePath} using the Write tool if you need to.`
}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the AskUserQuestion tool if you need to ask the user clarifying questions. If you do use the AskUserQuestion, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;

  return wrapInSystemReminder([
    createUserMessage({
      content,
      isMeta: true,
    }),
  ]);
}
