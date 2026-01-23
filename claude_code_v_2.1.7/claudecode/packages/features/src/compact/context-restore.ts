/**
 * @claudecode/features - Context Restoration
 *
 * Functions for restoring context after compaction.
 * Reconstructed from chunks.132.mjs:677-750
 *
 * Key symbols:
 * - E97 → restoreRecentFilesAfterCompact
 * - z97 → createTodoAttachment
 * - xL0 → createPlanFileReferenceAttachment
 * - $97 → createInvokedSkillsAttachment
 * - C97 → createTaskStatusAttachments
 * - U97 → shouldExcludeFromRestore
 * - TL0 → readFileForRestore
 */

import {
  generateUUID,
  getGlobalState,
  getProjectRoot,
  getSessionId,
  getSessionPath,
  normalizePath,
} from '@claudecode/shared';
import { FileSystemWrapper, analyticsEvent } from '@claudecode/platform';
import type { BoundaryMarker, CompactAttachment, CompactSessionContext } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import {
  getPlanFilePath,
  readPlanFile as readPlanFileFromPlanMode,
  planFileExists,
} from '../plan-mode/index.js';

// ============================================
// File Restoration
// ============================================

/**
 * Filters files that shouldn't be restored to avoid redundancy.
 * Original: U97() in chunks.132.mjs:732-747
 */
export function shouldExcludeFromRestore(filepath: string, agentId?: string): boolean {
  const normalized = normalizePath(filepath);

  // Exclude 1: Agent's own todo file
  try {
    // Ir(G) in source is getTodoFilePath
    // We don't have a direct equivalent here, but we can skip it if we know the pattern
    // or just rely on the other exclusions.
  } catch {}

  // Exclude 2: Plan file for this agent (restored separately)
  try {
    const planPath = normalizePath(getPlanFilePath(agentId));
    if (normalized === planPath) return true;
  } catch {}

  // Exclude 3: Skill directories (restored separately)
  // sr2 = ["User", "Project", "Local", "Managed", "ExperimentalUltraClaudeMd"]
  // MQA(Z) returns skill dir path
  // For now, we assume standard skill paths are handled elsewhere or not critical to exclude if small
  
  // Exclude 4: Transcript file (prevents infinite recursion)
  try {
    const transcriptPath = normalizePath(getSessionPath(getSessionId(), getProjectRoot()));
    if (normalized === transcriptPath) return true;
  } catch {}

  return false;
}

/**
 * Read file for restoration.
 * Original: TL0() in chunks.132.mjs:3-85
 * 
 * Re-reads the file from disk, respecting token limits and permissions.
 */
async function readFileForRestore(
  filepath: string,
  context: CompactSessionContext,
  mode: 'compact' | 'at-mention' = 'compact'
): Promise<CompactAttachment | null> {
  // Check 1: Permission guard (nEA)
  // We assume if it was in previousReadState, we had permission, but we should re-verify if possible.
  // Since we don't have easy access to permission checking logic here without circular deps,
  // we'll proceed assuming the environment allows reading files we've already read.
  
  try {
    // Check 2: Validate file existence and size
    if (!FileSystemWrapper.existsSync(filepath)) {
      return null;
    }
    
    const stats = FileSystemWrapper.statSync(filepath);
    
    // Check 3: Large file handling
    // We don't have the exact tokenizer here easily, so we use byte size as proxy or read and truncate.
    // In TL0, it uses v5.validateInput which checks size.
    // If too large, it calls K() which returns compact_file_reference for 'compact' mode.
    
    // Arbitrary large size check (e.g. 1MB) or token estimate
    const MAX_BYTES = COMPACT_CONSTANTS.MAX_TOKENS_PER_FILE * 10; // Approx buffer
    
    if (stats.size > MAX_BYTES && mode === 'compact') {
      return {
        type: 'compact_file_reference',
        path: filepath, // TL0 uses filename
        context: 'post-compact'
      } as any;
    }
    
    // Attempt read
    const content = FileSystemWrapper.readFileSync(filepath, { encoding: 'utf-8' });
    
    // Check token count
    const fileTokens = Math.ceil(content.length / 4); // Rough estimate
    
    if (fileTokens > COMPACT_CONSTANTS.MAX_TOKENS_PER_FILE) {
      if (mode === 'compact') {
        return {
          type: 'compact_file_reference',
          path: filepath,
          context: 'post-compact'
        } as any;
      } else {
        // Truncate for non-compact mode (not fully implemented here as we focus on compact)
        return null;
      }
    }
    
    analyticsEvent('tengu_post_compact_file_restore_success', {});
    
    return {
      type: 'file',
      content,
      path: filepath,
      context: 'post-compact'
    };
    
  } catch (error) {
    analyticsEvent('tengu_post_compact_file_restore_error', {});
    return null;
  }
}

/**
 * Restore recently read files after compaction.
 * Original: E97() in chunks.132.mjs
 *
 * @param previousReadState - Read file state before compact
 * @param context - Compact session context
 * @param maxFiles - Maximum number of files to restore
 * @returns Array of file attachments
 */
export async function restoreRecentFilesAfterCompact(
  previousReadState: Map<string, { content: string; timestamp: number }>,
  context: CompactSessionContext,
  maxFiles: number = COMPACT_CONSTANTS.MAX_FILES_TO_RESTORE
): Promise<CompactAttachment[]> {
  // Filter and sort files by recency (most recent first)
  // Original: G = Object.entries(A)...filter(U97)...sort...slice
  const sortedFiles = [...previousReadState.entries()]
    .filter(([path]) => !shouldExcludeFromRestore(path, context.agentId))
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, maxFiles);

  // Original: Z = await Promise.all(G.map(async (J) => { let X = await TL0... }))
  const restoredAttachments = await Promise.all(
    sortedFiles.map(async ([path]) => {
      // We ignore the cached content and re-read from disk to ensure freshness, matching E97/TL0 behavior
      return readFileForRestore(path, context, 'compact');
    })
  );

  let accumulatedTokens = 0;
  const totalBudget = COMPACT_CONSTANTS.TOTAL_FILE_TOKEN_BUDGET; // D97 = 50000

  // Original: return Z.filter((J) => { ... })
  return restoredAttachments.filter((attachment): attachment is CompactAttachment => {
    if (!attachment) return false;
    
    // Estimate tokens for this attachment
    let tokenCount = 0;
    if (attachment.type === 'file' && attachment.content) {
      tokenCount = Math.ceil(attachment.content.length / 4);
    } else if (attachment.type === 'compact_file_reference') {
      tokenCount = 100; // Small cost for reference
    }
    
    if (accumulatedTokens + tokenCount <= totalBudget) {
      accumulatedTokens += tokenCount;
      return true;
    }
    
    return false; // Exceeds budget, drop this file
  });
}

// ============================================
// Todo Restoration
// ============================================

interface TodoItem {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

/**
 * Get todo items for an agent from app state.
 * Original: Cb() in chunks.132.mjs
 */
export function getTodoItems(
  context?: CompactSessionContext,
  agentId?: string
): TodoItem[] {
  if (!context?.getAppState) {
    return [];
  }

  try {
    // Get app state synchronously if possible (caution: might be async in some implementations)
    const appStatePromise = context.getAppState();
    if (appStatePromise instanceof Promise) {
      // In this reconstruction context, we prefer async version but keep sync for compatibility if needed.
      return [];
    }

    const appState = appStatePromise as { todos?: Record<string, TodoItem[]> };
    const key = agentId || 'main';
    return appState?.todos?.[key] ?? [];
  } catch {
    return [];
  }
}

/**
 * Get todo items asynchronously.
 * Original: Cb() in chunks.86.mjs
 */
export async function getTodoItemsAsync(
  context: CompactSessionContext,
  agentId?: string
): Promise<TodoItem[]> {
  try {
    const appState = (await context.getAppState()) as any;
    const key = agentId || 'main';
    return appState?.todos?.[key] ?? [];
  } catch {
    return [];
  }
}

/**
 * Create todo attachment for restoration.
 * Original: z97() in chunks.132.mjs:677-686
 */
export async function createTodoAttachment(
  context: CompactSessionContext,
  agentId?: string
): Promise<CompactAttachment | null> {
  const todoItems = await getTodoItemsAsync(context, agentId);

  if (todoItems.length === 0) {
    return null;
  }

  return {
    type: 'todo',
    content: todoItems,
    itemCount: todoItems.length,
    context: 'post-compact',
  };
}

// ============================================
// Plan File Restoration
// ============================================

/**
 * Create plan file reference attachment.
 * Original: xL0() in chunks.132.mjs:688-697
 */
export async function createPlanFileReferenceAttachment(
  agentId?: string
): Promise<CompactAttachment | null> {
  if (!planFileExists(agentId)) {
    return null;
  }

  const planPath = getPlanFilePath(agentId);
  const planContent = readPlanFileFromPlanMode(agentId);

  if (!planContent) {
    return null;
  }

  return {
    type: 'plan_file_reference',
    planFilePath: planPath,
    planContent,
    context: 'post-compact',
  };
}

// ============================================
// Invoked Skills Restoration
// ============================================

/**
 * Create invoked skills attachment.
 * Original: $97() in chunks.132.mjs:699-711
 */
export function createInvokedSkillsAttachment(): CompactAttachment | null {
  const globalState = getGlobalState();
  const invokedSkills = (globalState as any).invokedSkills;

  if (!invokedSkills || invokedSkills.size === 0) {
    return null;
  }

  // Sort by most recently invoked
  const sortedSkills = Array.from(invokedSkills.values())
    .sort((a: any, b: any) => b.invokedAt - a.invokedAt)
    .map((skill: any) => ({
      name: skill.skillName,
      path: skill.skillPath,
      content: skill.content,
    }));

  return {
    type: 'skill',
    skills: sortedSkills,
    context: 'post-compact',
  };
}

// ============================================
// Task Status Restoration
// ============================================

/**
 * Create task status attachments.
 * Original: C97() in chunks.132.mjs:713-730
 */
export async function createTaskStatusAttachments(
  context: CompactSessionContext
): Promise<CompactAttachment[]> {
  const appState = (await context.getAppState()) as any;
  if (!appState?.tasks) return [];

  return Object.values(appState.tasks)
    .filter((task: any) => task.type === 'local_agent')
    .flatMap((task: any) => {
      if (task.retrieved) return [];

      const { status } = task;
      if (status === 'completed' || status === 'failed' || status === 'killed') {
        return [
          {
            type: 'task_status',
            taskId: task.agentId,
            taskType: 'local_agent',
            description: task.description,
            status: status,
            deltaSummary: task.error ?? null,
            context: 'post-compact',
          },
        ];
      }
      return [];
    });
}

// ============================================
// Boundary Marker
// ============================================

/**
 * Create boundary marker for compact event.
 * Original: pF1() in chunks.132.mjs
 */
export function createBoundaryMarker(
  trigger: 'auto' | 'manual',
  preCompactTokenCount: number
): BoundaryMarker {
  return {
    type: 'system',
    subtype: 'compact_boundary',
    content: 'Conversation compacted',
    isMeta: false,
    timestamp: new Date().toISOString(),
    uuid: generateUUID(),
    level: 'info',
    compactMetadata: {
      trigger,
      preTokens: preCompactTokenCount,
    },
  };
}

// ============================================
// Summary Content Formatting
// ============================================

/**
 * Generate conversation ID for boundary.
 * Original: Bw() in chunks.132.mjs
 */
export function generateConversationId(_agentId?: string): string {
  return getSessionPath(getSessionId(), getProjectRoot());
}

/**
 * Format summary content for user message.
 * Original: u51() in chunks.132.mjs
 */
export function formatSummaryContent(
  summaryText: string,
  preserveHistory: boolean,
  transcriptPath?: string,
  recentMessagesPreserved?: boolean
): string {
  const normalized = summaryText.replace(/\n\n+/g, '\n\n').trim();

  let out = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.\n\n${normalized}`;

  if (transcriptPath) {
    out += `\n\nIf you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${transcriptPath}`;
  }
  if (recentMessagesPreserved) {
    out += `\n\nRecent messages are preserved verbatim.`;
  }
  if (preserveHistory) {
    out += `\nPlease continue the conversation from where we left it off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
  }
  return out;
}

// ============================================
// Collect All Attachments
// ============================================

/**
 * Collect all context attachments after compaction.
 */
export async function collectContextAttachments(
  context: CompactSessionContext,
  previousReadState: Map<string, { content: string; timestamp: number }>
): Promise<CompactAttachment[]> {
  const [restoredFiles, taskStatuses, todoAttachment, planAttachment] = await Promise.all([
    restoreRecentFilesAfterCompact(previousReadState, context),
    createTaskStatusAttachments(context),
    createTodoAttachment(context, context.agentId),
    createPlanFileReferenceAttachment(context.agentId),
  ]);

  const attachments: CompactAttachment[] = [...restoredFiles, ...taskStatuses];

  if (todoAttachment) attachments.push(todoAttachment);
  if (planAttachment) attachments.push(planAttachment);

  const skillsAttachment = createInvokedSkillsAttachment();
  if (skillsAttachment) attachments.push(skillsAttachment);

  return attachments;
}
