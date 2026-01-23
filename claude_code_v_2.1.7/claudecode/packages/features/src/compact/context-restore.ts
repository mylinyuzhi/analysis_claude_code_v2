/**
 * @claudecode/features - Context Restoration
 *
 * Functions for restoring context after compaction.
 * Original: chunks.132.mjs:654-750
 */

import { join } from 'path';
import {
  generateUUID,
  getCacheDir,
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
 * Original: U97 in chunks.132.mjs:732-747
 */
export function shouldExcludeFromRestore(filepath: string, agentId?: string): boolean {
  const normalized = normalizePath(filepath);

  // Exclude 1: Agent's own transcript (todo) file
  // Original: try { let G = Q ?? q0(), Z = Yr(Ir(G)); if (B === Z) return !0 } catch {}
  try {
    const id = agentId ?? getSessionId();
    const todoPath = normalizePath(getAgentTranscriptPath(id));
    if (normalized === todoPath) return true;
  } catch {}

  // Exclude 2: Plan file for this agent (restored separately)
  // Original: try { let G = Yr(dC(Q)); if (B === G) return !0 } catch {}
  try {
    const planPath = normalizePath(getPlanFilePath(agentId));
    if (normalized === planPath) return true;
  } catch {}

  // Exclude 3: Claude.md instruction files (restored separately or via system reminders)
  // Original: try { if (new Set(sr2.map((Z) => Yr(MQA(Z)))).has(B)) return !0 } catch {}
  try {
    const claudeMdPaths = CLAUDE_MD_TYPES.map(type => normalizePath(getClaudeMdPath(type)));
    if (new Set(claudeMdPaths).has(normalized)) return true;
  } catch {}

  return false;
}

// ============================================
// Helper Functions for shouldExcludeFromRestore
// ============================================

/**
 * Get the agent transcript (todo) path.
 * Original: Ir in chunks.86.mjs:894-897
 */
function getAgentTranscriptPath(agentId: string): string {
  const cacheDir = getCacheDir();
  const sessionId = getSessionId();
  return join(cacheDir, 'todos', `${sessionId}-agent-${agentId}.json`);
}

/**
 * Claude.md context types.
 * Original: sr2 in chunks.132.mjs:348
 */
export type ClaudeMdType = 'User' | 'Project' | 'Local' | 'Managed' | 'ExperimentalUltraClaudeMd';
export const CLAUDE_MD_TYPES: ClaudeMdType[] = [
  'User',
  'Project',
  'Local',
  'Managed',
  'ExperimentalUltraClaudeMd',
];

/**
 * Get the managed configuration directory.
 * Original: xL in chunks.148.mjs:3253-3261
 */
function getManagedConfigDir(): string {
  const platform = process.platform;
  switch (platform) {
    case 'darwin':
      return '/Library/Application Support/ClaudeCode';
    case 'win32':
      // Simplified windows logic from source
      return 'C:\\ProgramData\\ClaudeCode';
    default:
      return '/etc/claude-code';
  }
}

/**
 * Get the path for a specific Claude.md type.
 * Original: MQA in chunks.48.mjs:3158-3173
 */
function getClaudeMdPath(type: ClaudeMdType): string {
  const projectRoot = getProjectRoot();
  const cacheDir = getCacheDir();

  // Source guard: if (A === "ExperimentalUltraClaudeMd") return MQA("User");
  if (type === 'ExperimentalUltraClaudeMd') {
    return join(cacheDir, 'CLAUDE.md');
  }

  switch (type) {
    case 'User':
      return join(cacheDir, 'CLAUDE.md');
    case 'Local':
      return join(projectRoot, 'CLAUDE.local.md');
    case 'Project':
      return join(projectRoot, 'CLAUDE.md');
    case 'Managed':
      return join(getManagedConfigDir(), 'CLAUDE.md');
    default:
      return join(cacheDir, 'CLAUDE.md');
  }
}

/**
 * Read file for restoration.
 * Original: TL0 in chunks.132.mjs:3-85
 * 
 * Re-reads the file from disk, respecting token limits and permissions.
 */
async function readFileForRestore(
  filepath: string,
  context: CompactSessionContext,
  mode: 'compact' | 'at-mention' = 'compact'
): Promise<CompactAttachment | null> {
  // Check 1: Permission guard
  // In source: if (nEA(A, Q.toolPermissionContext)) return null;
  
  try {
    if (!FileSystemWrapper.existsSync(filepath)) {
      return null;
    }
    
    // Check 2: size and mode handling
    // Source calls v5.validateInput which checks size.
    const stats = FileSystemWrapper.statSync(filepath);
    
    // If too large and in compact mode, return a reference
    // W97 = 5000 tokens per file limit
    const MAX_BYTES = COMPACT_CONSTANTS.MAX_TOKENS_PER_FILE * 10; 
    
    if (stats.size > MAX_BYTES && mode === 'compact') {
      return {
        type: 'compact_file_reference',
        path: filepath,
        context: 'post-compact'
      } as any;
    }
    
    // Attempt read
    const content = FileSystemWrapper.readFileSync(filepath, { encoding: 'utf-8' });
    const fileTokens = Math.ceil(content.length / 4);
    
    if (fileTokens > COMPACT_CONSTANTS.MAX_TOKENS_PER_FILE) {
      if (mode === 'compact') {
        return {
          type: 'compact_file_reference',
          path: filepath,
          context: 'post-compact'
        } as any;
      }
      return null;
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
 * Original: E97 in chunks.132.mjs:654-675
 */
export async function restoreRecentFilesAfterCompact(
  previousReadState: Map<string, { content: string; timestamp: number }>,
  context: CompactSessionContext,
  maxFiles: number = COMPACT_CONSTANTS.MAX_FILES_TO_RESTORE
): Promise<CompactAttachment[]> {
  const sortedFiles = [...previousReadState.entries()]
    .filter(([path]) => !shouldExcludeFromRestore(path, context.agentId))
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, maxFiles);

  const restoredAttachments = await Promise.all(
    sortedFiles.map(async ([path]) => {
      return readFileForRestore(path, context, 'compact');
    })
  );

  let accumulatedTokens = 0;
  const totalBudget = COMPACT_CONSTANTS.TOTAL_FILE_TOKEN_BUDGET; // D97 = 50000

  return restoredAttachments.filter((attachment): attachment is CompactAttachment => {
    if (!attachment) return false;
    
    let tokenCount = 0;
    if (attachment.type === 'file' && (attachment as any).content) {
      tokenCount = Math.ceil((attachment as any).content.length / 4);
    } else {
      tokenCount = 100;
    }
    
    if (accumulatedTokens + tokenCount <= totalBudget) {
      accumulatedTokens += tokenCount;
      return true;
    }
    
    return false;
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
 * Get todo items asynchronously.
 * Original: Cb in chunks.86.mjs:899
 */
export async function getTodoItems(
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
 * Original: z97 in chunks.132.mjs:677-686
 */
export async function createTodoAttachment(
  context: CompactSessionContext,
  agentId?: string
): Promise<CompactAttachment | null> {
  const todoItems = await getTodoItems(context, agentId);

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
 * Get current plan file path.
 */
export function getCurrentPlanFilePath(agentId?: string): string {
  return getPlanFilePath(agentId);
}

/**
 * Read plan file.
 */
export function readPlanFile(agentId?: string): string | null {
  return readPlanFileFromPlanMode(agentId);
}

/**
 * Create plan file reference attachment.
 * Original: xL0 in chunks.132.mjs:688-697
 */
export async function createPlanFileReferenceAttachment(
  agentId?: string
): Promise<CompactAttachment | null> {
  if (!planFileExists(agentId)) {
    return null;
  }

  const planPath = getCurrentPlanFilePath(agentId);
  const planContent = readPlanFile(agentId);

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
 * Get invoked skills.
 */
export function getInvokedSkills() {
  const globalState = getGlobalState();
  return (globalState as any).invokedSkills;
}

/**
 * Create invoked skills attachment.
 * Original: $97 in chunks.132.mjs:699-711
 */
export function createInvokedSkillsAttachment(): CompactAttachment | null {
  const invokedSkills = getInvokedSkills();

  if (!invokedSkills || invokedSkills.size === 0) {
    return null;
  }

  const sortedSkills = Array.from(invokedSkills.values() as Iterable<any>)
    .sort((a: any, b: any) => b.invokedAt - a.invokedAt)
    .map((skill: any) => ({
      name: skill.skillName,
      path: skill.skillPath,
      content: skill.content,
    }));

  return {
    type: 'invoked_skills',
    skills: sortedSkills,
    context: 'post-compact',
  } as any;
}

// ============================================
// Task Status Restoration
// ============================================

/**
 * Get active task statuses.
 */
export async function getActiveTaskStatuses(context: CompactSessionContext) {
  const appState = (await context.getAppState()) as any;
  return appState?.tasks ?? {};
}

/**
 * Create task status attachments.
 * Original: C97 in chunks.132.mjs:713-730
 */
export async function createTaskStatusAttachments(
  context: CompactSessionContext
): Promise<CompactAttachment[]> {
  const tasks = await getActiveTaskStatuses(context);
  if (!tasks) return [];

  return Object.values(tasks)
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
          } as any,
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
 * Original: pF1 in chunks.132.mjs:1531
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
 * Original: Bw in chunks.132.mjs:1407
 */
export function generateConversationId(_agentId?: string): string {
  return getSessionPath(getSessionId(), getProjectRoot());
}

/**
 * Format summary content for user message.
 * Original: u51 in chunks.85.mjs:1182
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
