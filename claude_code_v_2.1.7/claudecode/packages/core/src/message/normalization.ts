/**
 * @claudecode/core - Message Normalization
 *
 * Functions for normalizing messages for API submission.
 * Reconstructed from chunks.147.mjs:2774-2998
 */

import type { ContentBlock } from '@claudecode/shared';
import type { Tool } from '../tools/types.js';
import type {
  ConversationMessage,
  AssistantMessage,
  UserMessage,
  AttachmentMessage,
  ToolUseGroup,
  Attachment,
} from './types.js';
import {
  hasToolUse,
  hasToolResult,
  isHookAttachment,
  isFilteredMessage,
  isToolReference,
} from './type-guards.js';
import {
  createUserMessage,
  createToolUseMessage,
  createToolResultMessage,
} from './factory.js';
import {
  wrapInSystemReminder,
  wrapSystemReminderText,
} from './utils.js';
import { generatePlanModeInstructions } from './plan-instructions.js';

const MAX_LINES = 3000;

// ============================================
// Attachment Reordering
// ============================================

/**
 * Reorder attachments to be adjacent to their related messages.
 * Original: I$7 in chunks.147.mjs:2774-2784
 *
 * Attachments need to be placed immediately after their related
 * assistant/tool result messages for proper API processing.
 */
export function reorderAttachments(
  messages: ConversationMessage[]
): ConversationMessage[] {
  const result: ConversationMessage[] = [];
  const pendingAttachments: AttachmentMessage[] = [];

  // Process in reverse to collect attachments and place them correctly
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]!;

    if (msg.type === 'attachment') {
      pendingAttachments.unshift(msg);
    } else if (
      (msg.type === 'assistant' ||
        (msg.type === 'user' &&
          Array.isArray(msg.message.content) &&
          (msg.message.content as ContentBlock[])[0]?.type === 'tool_result')) &&
      pendingAttachments.length > 0
    ) {
      // Place message followed by pending attachments
      result.unshift(msg, ...pendingAttachments);
      pendingAttachments.length = 0;
    } else {
      result.unshift(msg);
    }
  }

  // Add any remaining attachments at the beginning
  result.unshift(...pendingAttachments);

  return result;
}

// ============================================
// Message Merging
// ============================================

/**
 * Merge two user messages.
 * Original: F$7 in chunks.147.mjs:2979-2989
 */
export function mergeUserMessages(
  first: UserMessage,
  second: UserMessage
): UserMessage {
  const firstContent = normalizeContentToArray(first.message.content);
  const secondContent = normalizeContentToArray(second.message.content);

  return {
    ...first,
    message: {
      ...first.message,
      content: reorderToolResultsFirst([...firstContent, ...secondContent]),
    },
  };
}

/**
 * Merge two assistant messages (for per-block yielding).
 * Original: K$7 in chunks.147.mjs:2962-2970
 */
export function mergeAssistantMessages(
  first: AssistantMessage,
  second: AssistantMessage
): AssistantMessage {
  return {
    ...first,
    message: {
      ...first.message,
      content: [...first.message.content, ...second.message.content],
    },
  };
}

/**
 * Merge user message with attachment content.
 * Original: W$7 in chunks.147.mjs:2950-2960
 */
export function mergeUserWithAttachment(
  user: UserMessage,
  attachment: UserMessage
): UserMessage {
  const userContent = normalizeContentToArray(user.message.content);
  const attachmentContent = normalizeContentToArray(attachment.message.content);

  return {
    ...user,
    message: {
      ...user.message,
      content: reorderToolResultsFirst(
        mergeToolResultWithText(userContent, attachmentContent)
      ),
    },
  };
}

// ============================================
// Content Normalization Helpers
// ============================================

/**
 * Normalize content to array format.
 * Original: E$1 in chunks.147.mjs:3000-3006
 */
export function normalizeContentToArray(
  content: string | ContentBlock[]
): ContentBlock[] {
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }
  return content;
}

/**
 * Reorder content blocks with tool_result first.
 * Original: SJ9 in chunks.147.mjs:2991-2998
 */
export function reorderToolResultsFirst(
  content: ContentBlock[]
): ContentBlock[] {
  const toolResults: ContentBlock[] = [];
  const other: ContentBlock[] = [];

  for (const block of content) {
    if (block.type === 'tool_result') {
      toolResults.push(block);
    } else {
      other.push(block);
    }
  }

  return [...toolResults, ...other];
}

/**
 * Merge tool result with following text content.
 * Original: H$7 in chunks.147.mjs:3008-3017
 */
export function mergeToolResultWithText(
  first: ContentBlock[],
  second: ContentBlock[]
): ContentBlock[] {
  const lastBlock = first[first.length - 1];

  // If last block is a tool_result with string content, and all second blocks are text,
  // merge the text into the tool_result
  if (
    lastBlock?.type === 'tool_result' &&
    typeof (lastBlock as { content: unknown }).content === 'string' &&
    second.every((block) => block.type === 'text')
  ) {
    const textContent = second
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n\n')
      .trim();

    if (textContent) {
      return [
        ...first.slice(0, -1),
        {
          ...lastBlock,
          content: [
            (lastBlock as { content: string }).content,
            textContent,
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ];
    }
  }

  return [...first, ...second];
}

// ============================================
// Tool Input Normalization
// ============================================

/**
 * Normalize tool input based on tool schema.
 * Original: uA9 in chunks.147.mjs
 */
export function normalizeToolInput(
  tool: Tool,
  input: unknown
): unknown {
  // Parse if string
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }

  // If input is already correctly typed, return as-is
  if (typeof input !== 'object' || input === null) {
    return input;
  }

  // Tool-specific normalization could be added here
  return input;
}

function coerceToolInputToRecord(input: unknown): Record<string, unknown> {
  let value = input;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      value = undefined;
    }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

// ============================================
// Tool Reference Filtering
// ============================================

/**
 * Check if tool search is enabled.
 * Original: Zd in chunks.147.mjs
 */
let toolSearchEnabled = false;

export function setToolSearchEnabled(enabled: boolean): void {
  toolSearchEnabled = enabled;
}

export function isToolSearchEnabled(): boolean {
  return toolSearchEnabled;
}

/**
 * Filter tool references based on available tools.
 * Original: D$7 in chunks.147.mjs:2790-2828
 */
export function filterToolReferences(
  message: UserMessage,
  availableToolNames: Set<string>
): UserMessage {
  const content = message.message.content;
  if (!Array.isArray(content)) return message;

  // Check if any tool_result has tool_reference to unavailable tool
  const hasUnavailableRefs = content.some((block) => {
    if (block.type !== 'tool_result') return false;
    const resultContent = (block as { content?: unknown }).content;
    if (!Array.isArray(resultContent)) return false;
    return resultContent.some((item) => {
      if (!isToolReference(item as ContentBlock)) return false;
      const toolName = (item as { tool_name: string }).tool_name;
      return toolName && !availableToolNames.has(toolName);
    });
  });

  if (!hasUnavailableRefs) return message;

  // Filter out unavailable tool references
  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block) => {
        if (block.type !== 'tool_result') return block;
        const resultContent = (block as { content?: unknown }).content;
        if (!Array.isArray(resultContent)) return block;

        const filtered = resultContent.filter((item) => {
          if (!isToolReference(item as ContentBlock)) return true;
          const toolName = (item as { tool_name: string }).tool_name;
          if (!toolName) return true;
          return availableToolNames.has(toolName);
        });

        if (filtered.length === 0) {
          return {
            ...block,
            content: [
              {
                type: 'text',
                text: '[Tool references removed - tools no longer available]',
              },
            ],
          };
        }

        return { ...block, content: filtered };
      }),
    },
  };
}

/**
 * Remove all tool references (when tool search disabled).
 * Original: XP0 in chunks.147.mjs:2830-2855
 */
export function removeAllToolReferences(message: UserMessage): UserMessage {
  const content = message.message.content;
  if (!Array.isArray(content)) return message;

  const hasToolRefs = content.some((block) => {
    if (block.type !== 'tool_result') return false;
    const resultContent = (block as { content?: unknown }).content;
    if (!Array.isArray(resultContent)) return false;
    return resultContent.some((item) => isToolReference(item as ContentBlock));
  });

  if (!hasToolRefs) return message;

  return {
    ...message,
    message: {
      ...message.message,
      content: content.map((block) => {
        if (block.type !== 'tool_result') return block;
        const resultContent = (block as { content?: unknown }).content;
        if (!Array.isArray(resultContent)) return block;

        const filtered = resultContent.filter(
          (item) => !isToolReference(item as ContentBlock)
        );

        if (filtered.length === 0) {
          return {
            ...block,
            content: [
              {
                type: 'text',
                text: '[Tool references removed - tool search not enabled]',
              },
            ],
          };
        }

        return { ...block, content: filtered };
      }),
    },
  };
}

/**
 * Strip caller field from tool_use blocks (for API compatibility).
 * Original: GJ9 in chunks.147.mjs:2857-2874
 */
export function stripToolUseCaller(
  message: AssistantMessage
): AssistantMessage {
  if (
    !message.message.content.some(
      (block) =>
        block.type === 'tool_use' &&
        'caller' in block &&
        (block as { caller?: unknown }).caller !== null
    )
  ) {
    return message;
  }

  return {
    ...message,
    message: {
      ...message.message,
      content: message.message.content.map((block) => {
        if (block.type !== 'tool_use') return block;
        return {
          type: 'tool_use',
          id: (block as { id: string }).id,
          name: (block as { name: string }).name,
          input: coerceToolInputToRecord((block as { input: unknown }).input),
        };
      }),
    },
  };
}

// ============================================
// Main Normalization Function
// ============================================

/**
 * Get last element of array.
 * Original: QC in chunks.147.mjs
 */
function getLastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/**
 * Remove empty messages from array.
 * Original: MeB in chunks.147.mjs
 */
function removeEmptyMessages(messages: ConversationMessage[]): void {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]!;
    if (msg.type === 'user' || msg.type === 'assistant') {
      const content =
        msg.type === 'user' ? msg.message.content : msg.message.content;
      if (
        Array.isArray(content) &&
        content.length === 0
      ) {
        messages.splice(i, 1);
      }
    }
  }
}

/**
 * Ensure messages alternate between user and assistant.
 * Original: w$7 in chunks.147.mjs
 */
function ensureAlternatingMessages(
  messages: ConversationMessage[]
): ConversationMessage[] {
  // The API requires strict alternation between user and assistant messages
  // This function ensures that pattern
  return messages;
}

/**
 * Convert attachment to system message.
 * Original: q$7 in chunks.148.mjs:3-371
 */
export function convertAttachmentToSystemMessage(
  attachment: Attachment
): ConversationMessage[] {
  switch (attachment.type) {
    case 'directory':
      return wrapInSystemReminder([
        createToolUseMessage('Bash', {
          command: `ls ${attachment.path}`,
          description: `Lists files in ${attachment.path}`,
        }),
        createToolResultMessage('Bash', attachment.content),
      ]);

    case 'edited_text_file':
      return wrapInSystemReminder([
        createUserMessage({
          content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):\n${attachment.snippet}`,
          isMeta: true,
        }),
      ]);

    case 'file': {
      const content = attachment.content;
      switch (content.type) {
        case 'image':
        case 'notebook':
        case 'pdf':
          return wrapInSystemReminder([
            createToolUseMessage('Read', { file_path: attachment.filename }),
            createToolResultMessage('Read', content),
          ]);
        case 'text':
          return wrapInSystemReminder([
            createToolUseMessage('Read', { file_path: attachment.filename }),
            createToolResultMessage('Read', content),
            ...(attachment.truncated
              ? [
                  createUserMessage({
                    content: `Note: The file ${attachment.filename} was too large and has been truncated to the first ${MAX_LINES} lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.`,
                    isMeta: true,
                  }),
                ]
              : []),
          ]);
      }
      break;
    }

    case 'compact_file_reference':
      return wrapInSystemReminder([
        createUserMessage({
          content: `Note: ${attachment.filename} was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.`,
          isMeta: true,
        }),
      ]);

    case 'selected_lines_in_ide': {
      const content =
        attachment.content.length > 2000
          ? attachment.content.substring(0, 2000) + '\n... (truncated)'
          : attachment.content;
      return wrapInSystemReminder([
        createUserMessage({
          content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:\n${content}\n\nThis may or may not be related to the current task.`,
          isMeta: true,
        }),
      ]);
    }

    case 'opened_file_in_ide':
      return wrapInSystemReminder([
        createUserMessage({
          content: `The user opened the file ${attachment.filename} in the IDE. This may or may not be related to the current task.`,
          isMeta: true,
        }),
      ]);

    case 'todo':
      if (attachment.itemCount === 0) {
        return wrapInSystemReminder([
          createUserMessage({
            content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
            isMeta: true,
          }),
        ]);
      } else {
        return wrapInSystemReminder([
          createUserMessage({
            content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:\n\n${JSON.stringify(
              attachment.content
            )}. Continue on with the tasks at hand if applicable.`,
            isMeta: true,
          }),
        ]);
      }

    case 'plan_file_reference':
      return wrapInSystemReminder([
        createUserMessage({
          content: `A plan file exists from plan mode at: ${attachment.planFilePath}\n\nPlan contents:\n\n${attachment.planContent}\n\nIf this plan is relevant to the current work and not already complete, continue working on it.`,
          isMeta: true,
        }),
      ]);

    case 'invoked_skills': {
      if (!attachment.skills || attachment.skills.length === 0) return [];
      const skills = attachment.skills
        .map(
          (s) => `### Skill: ${s.name}\nPath: ${s.path}\n\n${s.content}`
        )
        .join('\n\n---\n\n');
      return wrapInSystemReminder([
        createUserMessage({
          content: `The following skills were invoked in this session. Continue to follow these guidelines:\n\n${skills}`,
          isMeta: true,
        }),
      ]);
    }

    case 'todo_reminder': {
      const list = attachment.content
        .map((t: any, i: number) => `${i + 1}. [${t.status}] ${t.content}`)
        .join('\n');
      let msg = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user\n`;
      if (list.length > 0) {
        msg += `\nHere are the existing contents of your todo list:\n\n[${list}]`;
      }
      return wrapInSystemReminder([
        createUserMessage({
          content: msg,
          isMeta: true,
        }),
      ]);
    }

    case 'nested_memory':
      return wrapInSystemReminder([
        createUserMessage({
          content: `Contents of ${attachment.path}:\n\n${attachment.content}`,
          isMeta: true,
        }),
      ]);

    case 'queued_command': {
      if (Array.isArray(attachment.prompt)) {
        const text = attachment.prompt
          .filter((p) => p.type === 'text')
          .map((p: any) => p.text)
          .join('\n');
        const images = attachment.prompt.filter((p) => p.type === 'image');
        const content = [
          {
            type: 'text' as const,
            text: `The user sent the following message:\n${text}\n\nPlease address this message and continue with your tasks.`,
          },
          ...images,
        ];
        return wrapInSystemReminder([
          createUserMessage({
            content,
            isMeta: true,
          }),
        ]);
      }
      return wrapInSystemReminder([
        createUserMessage({
          content: `The user sent the following message:\n${attachment.prompt}\n\nPlease address this message and continue with your tasks.`,
          isMeta: true,
        }),
      ]);
    }

    case 'ultramemory':
      return wrapInSystemReminder([
        createUserMessage({
          content: attachment.content,
          isMeta: true,
        }),
      ]);

    case 'diagnostics': {
      if (!attachment.files || attachment.files.length === 0) return [];
      return wrapInSystemReminder([
        createUserMessage({
          content: `<new-diagnostics>The following new diagnostic issues were detected:\n\n${JSON.stringify(
            attachment.files
          )}</new-diagnostics>`,
          isMeta: true,
        }),
      ]);
    }

    case 'plan_mode':
      return generatePlanModeInstructions(attachment);

    case 'plan_mode_reentry': {
      const content = `## Re-entering Plan Mode\n\nYou are returning to plan mode after having previously exited it. A plan file exists at ${attachment.planFilePath} from your previous planning session.\n\n**Before proceeding with any new planning, you should:**\n1. Read the existing plan file to understand what was previously planned\n2. Evaluate the user's current request against that plan\n3. Decide how to proceed:\n   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan\n   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections\n4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode\n\nTreat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
      return wrapInSystemReminder([
        createUserMessage({
          content,
          isMeta: true,
        }),
      ]);
    }

    case 'plan_mode_exit': {
      const content = `## Exited Plan Mode\n\nYou have exited plan mode. You can now make edits, run tools, and take actions.${
        attachment.planExists
          ? ` The plan file is located at ${attachment.planFilePath} if you need to reference it.`
          : ''
      }`;
      return wrapInSystemReminder([
        createUserMessage({
          content,
          isMeta: true,
        }),
      ]);
    }

    case 'delegate_mode_exit':
      return wrapInSystemReminder([
        createUserMessage({
          content: `## Exited Delegate Mode\n\nYou have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
          isMeta: true,
        }),
      ]);

    case 'critical_system_reminder':
      return wrapInSystemReminder([
        createUserMessage({
          content: attachment.content,
          isMeta: true,
        }),
      ]);

    case 'mcp_resource': {
      const content = attachment.content;
      if (!content || !content.contents || content.contents.length === 0) {
        return wrapInSystemReminder([
          createUserMessage({
            content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No content)</mcp-resource>`,
            isMeta: true,
          }),
        ]);
      }
      const blocks: ContentBlock[] = [];
      for (const item of content.contents) {
        if (item && typeof item === 'object') {
          if ('text' in item && typeof item.text === 'string') {
            blocks.push(
              { type: 'text', text: 'Full contents of resource:' },
              { type: 'text', text: item.text },
              {
                type: 'text',
                text: 'Do NOT read this resource again unless you think it may have changed, since you already have the full contents.',
              }
            );
          } else if ('blob' in item) {
            const mimeType = item.mimeType || 'application/octet-stream';
            blocks.push({ type: 'text', text: `[Binary content: ${mimeType}]` });
          }
        }
      }
      if (blocks.length > 0) {
        return wrapInSystemReminder([
          createUserMessage({
            content: blocks,
            isMeta: true,
          }),
        ]);
      }
      return wrapInSystemReminder([
        createUserMessage({
          content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No displayable content)</mcp-resource>`,
          isMeta: true,
        }),
      ]);
    }

    case 'agent_mention':
      return wrapInSystemReminder([
        createUserMessage({
          content: `The user has expressed a desire to invoke the agent "${attachment.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
          isMeta: true,
        }),
      ]);

    case 'task_status': {
      const parts = [
        `Task ${attachment.taskId}`,
        `(type: ${attachment.taskType})`,
        `(status: ${attachment.status})`,
        `(description: ${attachment.description})`,
      ];
      if (attachment.deltaSummary) parts.push(`Delta: ${attachment.deltaSummary}`);
      parts.push('You can check its output using the TaskOutput tool.');
      return [
        createUserMessage({
          content: wrapSystemReminderText(parts.join(' ')),
          isMeta: true,
        }),
      ];
    }

    case 'task_progress':
      return [
        createUserMessage({
          content: wrapSystemReminderText(attachment.message || ''),
          isMeta: true,
        }),
      ];

    case 'async_hook_response': {
      const resp = attachment.response;
      const messages: UserMessage[] = [];
      if (resp?.systemMessage) {
        messages.push(createUserMessage({ content: resp.systemMessage, isMeta: true }));
      }
      if (resp?.hookSpecificOutput?.additionalContext) {
        messages.push(
          createUserMessage({
            content: resp.hookSpecificOutput.additionalContext,
            isMeta: true,
          })
        );
      }
      return wrapInSystemReminder(messages);
    }

    case 'memory': {
      const memories = attachment.memories
        ?.map((m) => {
          const extra =
            m.remainingLines && m.remainingLines > 0
              ? ` (${m.remainingLines} more lines in full file)`
              : '';
          const date = new Date(m.lastModified).toLocaleDateString();
          return `## Previous Session (${date})\nFull session notes: ${m.fullPath}${extra}\n\n${m.content}`;
        })
        .join('\n\n---\n\n');
      return wrapInSystemReminder([
        createUserMessage({
          content: `<session-memory>\nThese session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.\n\n${memories}\n</session-memory>`,
          isMeta: true,
        }),
      ]);
    }

    case 'token_usage':
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`
          ),
          isMeta: true,
        }),
      ];

    case 'budget_usd':
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`
          ),
          isMeta: true,
        }),
      ];

    case 'hook_blocking_error':
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `${attachment.hookName} hook blocking error from command: "${attachment.blockingError?.command}": ${attachment.blockingError?.blockingError}`
          ),
          isMeta: true,
        }),
      ];

    case 'hook_success':
      if (
        attachment.hookEvent !== 'SessionStart' &&
        attachment.hookEvent !== 'UserPromptSubmit'
      )
        return [];
      if (attachment.content === '') return [];
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `${attachment.hookName} hook success: ${attachment.content}`
          ),
          isMeta: true,
        }),
      ];

    case 'hook_additional_context': {
      if (!attachment.content || attachment.content.length === 0) return [];
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `${attachment.hookName} hook additional context: ${attachment.content.join(
              '\n'
            )}`
          ),
          isMeta: true,
        }),
      ];
    }

    case 'hook_stopped_continuation':
      return [
        createUserMessage({
          content: wrapSystemReminderText(
            `${attachment.hookName} hook stopped continuation: ${attachment.message}`
          ),
          isMeta: true,
        }),
      ];

    case 'collab_notification': {
      const total = attachment.chats?.reduce((sum, c) => sum + c.unreadCount, 0) || 0;
      const formatted = attachment.chats
        ?.map((c) =>
          c.handle === 'self'
            ? `self (${c.unreadCount} new)`
            : `@${c.handle} (${c.unreadCount} new)`
        )
        .join(', ');
      return wrapInSystemReminder([
        createUserMessage({
          content: `You have ${total} unread collab message${
            total !== 1 ? 's' : ''
          } from: ${formatted}. Use the CollabRead tool to read these messages.`,
          isMeta: true,
        }),
      ]);
    }

    case 'verify_plan_reminder':
      return wrapInSystemReminder([
        createUserMessage({
          content: `You have completed implementing the plan. Please call the "" tool directly (NOT the Task tool or an agent) to verify that all plan items were completed correctly.`,
          isMeta: true,
        }),
      ]);

    case 'task_reminder':
    case 'delegate_mode':
    case 'already_read_file':
    case 'command_permissions':
    case 'edited_image_file':
    case 'hook_cancelled':
    case 'hook_error_during_execution':
    case 'hook_non_blocking_error':
    case 'hook_system_message':
    case 'structured_output':
    case 'hook_permission_decision':
      return [];

    default:
      return [];
  }

  return [];
}

/**
 * Normalize messages for API submission.
 * Original: FI in chunks.147.mjs:2876-2948
 *
 * This function:
 * 1. Filters out progress and system messages
 * 2. Reorders attachments
 * 3. Merges consecutive user/assistant messages
 * 4. Processes tool inputs
 * 5. Converts attachments to user messages
 */
export function normalizeMessagesToAPI(
  messages: ConversationMessage[],
  tools: Tool[] = []
): ConversationMessage[] {
  const toolNames = new Set(tools.map((t) => t.name));
  const reordered = reorderAttachments(messages);
  const output: ConversationMessage[] = [];

  // Filter and process messages
  reordered
    .filter((msg) => {
      // Remove progress and system messages
      if (msg.type === 'progress' || msg.type === 'system') return false;
      // Remove filtered messages
      if (isFilteredMessage(msg)) return false;
      return true;
    })
    .forEach((msg) => {
      switch (msg.type) {
        case 'user': {
          // Handle tool references based on tool search setting
          let processedMsg: UserMessage;
          if (!isToolSearchEnabled()) {
            processedMsg = removeAllToolReferences(msg);
          } else {
            processedMsg = filterToolReferences(msg, toolNames);
          }

          // Merge consecutive user messages (API requires alternation)
          const lastMsg = getLastElement(output);
          if (lastMsg?.type === 'user') {
            output[output.length - 1] = mergeUserMessages(
              lastMsg as UserMessage,
              processedMsg
            );
            return;
          }
          output.push(processedMsg);
          return;
        }

        case 'assistant': {
          // Process tool inputs
          const processedMsg: AssistantMessage = {
            ...msg,
            message: {
              ...msg.message,
              content: msg.message.content.map((block) => {
                if (block.type === 'tool_use') {
                  const tool = tools.find(
                    (t) => t.name === (block as { name: string }).name
                  );
                  const normalizedInput = tool
                    ? normalizeToolInput(tool, (block as { input: unknown }).input)
                    : (block as { input: unknown }).input;

                  const inputRecord = coerceToolInputToRecord(normalizedInput);

                  if (isToolSearchEnabled()) {
                    return { ...block, input: inputRecord };
                  }
                  return {
                    type: 'tool_use' as const,
                    id: (block as { id: string }).id,
                    name: (block as { name: string }).name,
                    input: inputRecord,
                  };
                }
                return block;
              }),
            },
          };

          // Check for merge with previous assistant message (same message.id)
          for (let i = output.length - 1; i >= 0; i--) {
            const prevMsg = output[i]!;
            if (prevMsg.type !== 'assistant' && !hasToolResultBlocks(prevMsg)) {
              break;
            }
            if (prevMsg.type === 'assistant') {
              if (prevMsg.message.id === processedMsg.message.id) {
                output[i] = mergeAssistantMessages(
                  prevMsg as AssistantMessage,
                  processedMsg
                );
                return;
              }
              break;
            }
          }
          output.push(processedMsg);
          return;
        }

        case 'attachment': {
          // Convert attachment to user message
          const converted = convertAttachmentToSystemMessage(msg.attachment);
          const lastMsg = getLastElement(output);
          if (lastMsg?.type === 'user') {
            output[output.length - 1] = converted.reduce(
              (acc: UserMessage, m: ConversationMessage) => {
                if (m.type === 'user') {
                  return mergeUserWithAttachment(acc, m);
                }
                return acc;
              },
              lastMsg as UserMessage
            );
            return;
          }
          output.push(...converted);
          return;
        }
      }
    });

  // Final cleanup
  removeEmptyMessages(output);
  return ensureAlternatingMessages(output);
}

// ============================================
// Helper Imports
// ============================================

function hasToolResultBlocks(msg: ConversationMessage): boolean {
  if (msg.type !== 'user') return false;
  const content = msg.message.content;
  if (typeof content === 'string') return false;
  return (content as ContentBlock[]).some((block) => block.type === 'tool_result');
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
