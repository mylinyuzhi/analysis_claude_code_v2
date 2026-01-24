/**
 * @claudecode/features - Attachment Conversion
 *
 * Utilities for converting attachments to API message format.
 * Reconstructed from chunks.148.mjs:3-371
 *
 * Key symbols:
 * - q$7 -> convertAttachmentToMessages
 * - MuA -> createToolUseSummary
 * - OuA -> createToolResultSummary
 */

import {
  createMetaBlock,
  wrapInSystemReminder,
  wrapSystemReminderText,
  buildPlanModeSystemReminder as buildPlanModeSteering,
} from '@claudecode/core/steering';
import type { MessageWrapper, ContentBlock } from '@claudecode/core/steering';
import type {
  Attachment,
} from './types.js';

// ============================================
// Tool Summary Helpers
// ============================================

/**
 * Create a summary message for a tool call.
 * Original: MuA in chunks.148.mjs:392-397
 */
function createToolUseSummary(toolName: string, input: unknown): MessageWrapper {
  return createMetaBlock({
    content: [
      {
        type: 'tool_use',
        id: `toolu_${Math.random().toString(36).substring(7)}`,
        name: toolName,
        input,
      }
    ],
    isMeta: true,
  });
}

/**
 * Create a summary message for a tool result.
 * Original: OuA in chunks.148.mjs:373-390
 */
function createToolResultSummary(toolName: string, result: any): MessageWrapper {
  let content: string | ContentBlock[];
  
  if (result && typeof result === 'object' && 'content' in result && Array.isArray(result.content)) {
    content = result.content;
  } else {
    content = typeof result === 'string' ? result : JSON.stringify(result);
  }

  return createMetaBlock({
    content: [
      {
        type: 'tool_result',
        tool_use_id: `toolu_${Math.random().toString(36).substring(7)}`,
        content,
      }
    ],
    isMeta: true,
  });
}

// ============================================
// Attachment to Message Conversion
// ============================================

/**
 * Convert an attachment to a sequence of steering messages.
 * Original: q$7 in chunks.148.mjs:3-371
 */
export function convertAttachmentToMessages(attachment: Attachment): MessageWrapper[] {
  switch (attachment.type) {
    case 'directory':
      return wrapInSystemReminder([
        createToolUseSummary('Bash', {
          command: `ls ${attachment.path}`,
          description: `Lists files in ${attachment.path}`,
        }),
        createToolResultSummary('Bash', {
          stdout: attachment.content,
          stderr: '',
          interrupted: false,
        }),
      ]);

    case 'edited_text_file':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `Note: ${attachment.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):\n${attachment.snippet}`,
          isMeta: true,
        }),
      ]);

    case 'file': {
      const toolName = 'Read';
      const content = attachment.content;
      const messages: MessageWrapper[] = [];

      switch (content.type) {
        case 'image':
          messages.push(createToolUseSummary(toolName, { file_path: attachment.filename }));
          messages.push(createToolResultSummary(toolName, content));
          break;
        case 'text':
          messages.push(createToolUseSummary(toolName, { file_path: attachment.filename }));
          messages.push(createToolResultSummary(toolName, content));
          if (attachment.truncated) {
            messages.push(
              createMetaBlock({
                content: `Note: The file ${attachment.filename} was too large and has been truncated. Don't tell the user about this truncation. Use ${toolName} to read more of the file if you need.`,
                isMeta: true,
              })
            );
          }
          break;
        case 'notebook':
        case 'pdf':
          messages.push(createToolUseSummary(toolName, { file_path: attachment.filename }));
          messages.push(createToolResultSummary(toolName, content));
          break;
      }
      return wrapInSystemReminder(messages);
    }

    case 'compact_file_reference':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `Note: ${attachment.filename} was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.`,
          isMeta: true,
        }),
      ]);

    case 'selected_lines_in_ide': {
      const contentStr =
        attachment.content.length > 2000
          ? attachment.content.substring(0, 2000) + '\n... (truncated)'
          : attachment.content;
      return wrapInSystemReminder([
        createMetaBlock({
          content: `The user selected the lines ${attachment.lineStart} to ${attachment.lineEnd} from ${attachment.filename}:\n${contentStr}\n\nThis may or may not be related to the current task.`,
          isMeta: true,
        }),
      ]);
    }

    case 'opened_file_in_ide':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `The user opened the file ${attachment.filename} in the IDE. This may or may not be related to the current task.`,
          isMeta: true,
        }),
      ]);

    case 'todo':
      if (attachment.itemCount === 0) {
        return wrapInSystemReminder([
          createMetaBlock({
            content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
            isMeta: true,
          }),
        ]);
      } else {
        return wrapInSystemReminder([
          createMetaBlock({
            content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:\n\n${JSON.stringify(attachment.content)}. Continue on with the tasks at hand if applicable.`,
            isMeta: true,
          }),
        ]);
      }

    case 'plan_file_reference':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `A plan file exists from plan mode at: ${attachment.planFilePath}\n\nPlan contents:\n\n${attachment.planContent}\n\nIf this plan is relevant to the current work and not already complete, continue working on it.`,
          isMeta: true,
        }),
      ]);

    case 'invoked_skills': {
      if (attachment.skills.length === 0) return [];
      const skillsStr = attachment.skills
        .map((s) => `### Skill: ${s.name}\nPath: ${s.path}\n\n${s.content}`)
        .join('\n\n---\n\n');
      return wrapInSystemReminder([
        createMetaBlock({
          content: `The following skills were invoked in this session. Continue to follow these guidelines:\n\n${skillsStr}`,
          isMeta: true,
        }),
      ]);
    }

    case 'todo_reminder': {
      const todoItemsStr = attachment.content
        .map((item, i) => `${i + 1}. [${item.status}] ${item.content}`)
        .join('\n');
      let content = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user\n`;
      if (todoItemsStr.length > 0) {
        content += `\nHere are the existing contents of your todo list:\n\n[${todoItemsStr}]`;
      }
      return wrapInSystemReminder([
        createMetaBlock({
          content,
          isMeta: true,
        }),
      ]);
    }

    case 'nested_memory':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `Contents of ${attachment.path}:\n\n${attachment.content.content}`,
          isMeta: true,
        }),
      ]);

    case 'queued_command': {
      if (Array.isArray(attachment.prompt)) {
        const textStr = attachment.prompt
          .filter((p) => p.type === 'text')
          .map((p) => (p as any).text)
          .join('\n');
        const images = attachment.prompt.filter((p) => p.type === 'image');
        const content = [
          {
            type: 'text',
            text: `The user sent the following message:\n${textStr}\n\nPlease address this message and continue with your tasks.`,
          },
          ...images,
        ];
        return wrapInSystemReminder([
          createMetaBlock({
            content: content as any,
            isMeta: true,
          }),
        ]);
      }
      return wrapInSystemReminder([
        createMetaBlock({
          content: `The user sent the following message:\n${attachment.prompt}\n\nPlease address this message and continue with your tasks.`,
          isMeta: true,
        }),
      ]);
    }

    case 'ultramemory':
      return wrapInSystemReminder([
        createMetaBlock({
          content: attachment.content,
          isMeta: true,
        }),
      ]);

    case 'output_style':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `${attachment.style} output style is active. Remember to follow the specific guidelines for this style.`,
          isMeta: true,
        }),
      ]);

    case 'diagnostics': {
      if (attachment.files.length === 0) return [];
      const diagStr = JSON.stringify(attachment.files);
      return wrapInSystemReminder([
        createMetaBlock({
          content: `<new-diagnostics>The following new diagnostic issues were detected:\n\n${diagStr}</new-diagnostics>`,
          isMeta: true,
        }),
      ]);
    }

    case 'plan_mode':
      return buildPlanModeSteering(attachment as any);

    case 'plan_mode_reentry': {
      const content = `## Re-entering Plan Mode\n\nYou are returning to plan mode after having previously exited it. A plan file exists at ${attachment.planFilePath} from your previous planning session.\n\n**Before proceeding with any new planning, you should:**\n1. Read the existing plan file to understand what was previously planned\n2. Evaluate the user's current request against that plan\n3. Decide how to proceed:\n   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan\n   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections\n4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode\n\nTreat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
      return wrapInSystemReminder([
        createMetaBlock({
          content,
          isMeta: true,
        }),
      ]);
    }

    case 'plan_mode_exit': {
      const content = `## Exited Plan Mode\n\nYou have exited plan mode. You can now make edits, run tools, and take actions.${attachment.planExists ? ` The plan file is located at ${attachment.planFilePath} if you need to reference it.` : ''}`;
      return wrapInSystemReminder([
        createMetaBlock({
          content,
          isMeta: true,
        }),
      ]);
    }

    case 'delegate_mode_exit':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `## Exited Delegate Mode\n\nYou have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
          isMeta: true,
        }),
      ]);

    case 'critical_system_reminder':
      return wrapInSystemReminder([
        createMetaBlock({
          content: attachment.content,
          isMeta: true,
        }),
      ]);

    case 'mcp_resource': {
      if (!attachment.content || !attachment.content.contents || attachment.content.contents.length === 0) {
        return wrapInSystemReminder([
          createMetaBlock({
            content: `<mcp-resource server="${attachment.server}" uri="${attachment.uri}">(No content)</mcp-resource>`,
            isMeta: true,
          }),
        ]);
      }
      const contents: any[] = [];
      for (const c of attachment.content.contents) {
        if ('text' in c) {
          contents.push(
            { type: 'text', text: 'Full contents of resource:' },
            { type: 'text', text: c.text },
            { type: 'text', text: 'Do NOT read this resource again unless you think it may have changed, since you already have the full contents.' }
          );
        } else if ('blob' in c) {
          const mime = (c as any).mimeType || 'application/octet-stream';
          contents.push({ type: 'text', text: `[Binary content: ${mime}]` });
        }
      }
      return wrapInSystemReminder([
        createMetaBlock({
          content: contents as any,
          isMeta: true,
        }),
      ]);
    }

    case 'agent_mention':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `The user has expressed a desire to invoke the agent "${attachment.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
          isMeta: true,
        }),
      ]);

    case 'task_status': {
      const parts = [`Task ${attachment.taskId}`, `(type: ${attachment.taskType})`, `(status: ${attachment.status})`, `(description: ${attachment.description})`];
      if (attachment.deltaSummary) parts.push(`Delta: ${attachment.deltaSummary}`);
      parts.push('You can check its output using the TaskOutput tool.');
      return [
        createMetaBlock({
          content: wrapSystemReminderText(parts.join(' ')),
          isMeta: true,
        }),
      ];
    }

    case 'task_progress':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(attachment.message),
          isMeta: true,
        }),
      ];

    case 'async_hook_response': {
      const messages: MessageWrapper[] = [];
      if (attachment.response.systemMessage) {
        messages.push(createMetaBlock({ content: attachment.response.systemMessage, isMeta: true }));
      }
      if (attachment.response.hookSpecificOutput?.additionalContext) {
        messages.push(createMetaBlock({ content: attachment.response.hookSpecificOutput.additionalContext, isMeta: true }));
      }
      return wrapInSystemReminder(messages);
    }

    case 'memory': {
      const memsStr = attachment.memories
        .map((m) => {
          const dateStr = new Date(m.lastModified).toLocaleDateString();
          const moreLines = m.remainingLines > 0 ? ` (${m.remainingLines} more lines in full file)` : '';
          return `## Previous Session (${dateStr})\nFull session notes: ${m.fullPath}${moreLines}\n\n${m.content}`;
        })
        .join('\n\n---\n\n');
      return wrapInSystemReminder([
        createMetaBlock({
          content: `<session-memory>\nThese session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.\n\n${memsStr}\n</session-memory>`,
          isMeta: true,
        }),
      ]);
    }

    case 'token_usage':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
          isMeta: true,
        }),
      ];

    case 'budget_usd':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`USD budget: $${attachment.used}/$${attachment.total}; $${attachment.remaining} remaining`),
          isMeta: true,
        }),
      ];

    case 'hook_blocking_error':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`Hook blocking error from command: "${attachment.blockingError.command}": ${attachment.blockingError.blockingError}`),
          isMeta: true,
        }),
      ];

    case 'hook_success':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`Hook success: ${attachment.content}`),
          isMeta: true,
        }),
      ];

    case 'hook_additional_context':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`Hook additional context: ${attachment.content.join('\n')}`),
          isMeta: true,
        }),
      ];

    case 'hook_stopped_continuation':
      return [
        createMetaBlock({
          content: wrapSystemReminderText(`Hook stopped continuation: ${attachment.message}`),
          isMeta: true,
        }),
      ];

    case 'collab_notification': {
      const total = attachment.chats.reduce((sum, c) => sum + c.unreadCount, 0);
      const details = attachment.chats
        .map((c) => (c.handle === 'self' ? `self (${c.unreadCount} new)` : `@${c.handle} (${c.unreadCount} new)`))
        .join(', ');
      return wrapInSystemReminder([
        createMetaBlock({
          content: `You have ${total} unread collab message${total !== 1 ? 's' : ''} from: ${details}. Use the CollabRead tool to read these messages.`,
          isMeta: true,
        }),
      ]);
    }

    case 'verify_plan_reminder':
      return wrapInSystemReminder([
        createMetaBlock({
          content: `You have completed implementing the plan. Please call the verify tool directly to verify that all plan items were completed correctly.`,
          isMeta: true,
        }),
      ]);

    default:
      return [];
  }
}

/**
 * Filter out meta messages for user display.
 */
export function filterMetaMessages(messages: MessageWrapper[]): MessageWrapper[] {
  return messages.filter((msg) => !msg.isMeta);
}

/**
 * Get only meta messages.
 */
export function getMetaMessages(messages: MessageWrapper[]): MessageWrapper[] {
  return messages.filter((msg) => msg.isMeta);
}
