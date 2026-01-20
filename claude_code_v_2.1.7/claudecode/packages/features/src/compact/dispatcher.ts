/**
 * @claudecode/features - Compact Dispatcher
 *
 * Main entry point for automatic compaction.
 * Reconstructed from chunks.132.mjs:1511-1535
 */

import { parseBoolean } from '@claudecode/shared';
import type { ConversationMessage } from '@claudecode/core';
import { getProjectDir, getProjectRoot, getSessionId } from '@claudecode/shared';
import { FileSystemWrapper, joinPath } from '@claudecode/platform';
import { homedir } from 'os';
import type {
  AutoCompactResult,
  CompactSessionContext,
  SessionMemoryCompactResult,
  FullCompactResult,
  SessionMemoryType,
} from './types.js';
import {
  shouldTriggerAutoCompact,
  getAutoCompactTarget,
  isAutoCompactEnabled,
  estimateTokensWithSafetyMargin,
  estimateMessageTokens,
} from './thresholds.js';
import { fullCompact } from './full-compact.js';
import {
  createBoundaryMarker,
  createPlanFileReferenceAttachment,
  formatSummaryContent,
  generateConversationId,
} from './context-restore.js';
import { createUserMessage } from '@claudecode/core';
import { executePluginHooksForEvent } from '../hooks/triggers.js';

// ============================================
// Session Memory Compact
// ============================================

/**
 * Session memory compact state
 */
let lastSummarizedId: string | undefined;

/**
 * Pending session-memory update marker.
 * Mirrors lF1 / Is2 / Ds2 in chunks.132.mjs
 */
let pendingSessionMemoryUpdateStartedAt: number | undefined;

const SESSION_MEMORY_WAIT_TIMEOUT_MS = 15000; // q97
const SESSION_MEMORY_STALE_UPDATE_MS = 60000; // N97

/**
 * Default session-memory template (w97 in chunks.132.mjs).
 * Used when custom template is not present.
 */
const DEFAULT_SESSION_MEMORY_TEMPLATE = `
# Session Title
_A short and distinctive 5-10 word descriptive title for the session. Super info dense, no filler_

# Current State
_What is actively being worked on right now? Pending tasks not yet completed. Immediate next steps._

# Task specification
_What did the user ask to build? Any design decisions or other explanatory context_

# Files and Functions
_What are the important files? In short, what do they contain and why are they relevant?_

# Workflow
_What bash commands are usually run and in what order? How to interpret their output if not obvious?_

# Errors & Corrections
_Errors encountered and how they were fixed. What did the user correct? What approaches failed and should not be tried again?_

# Codebase and System Documentation
_What are the important system components? How do they work/fit together?_

# Learnings
_What has worked well? What has not? What to avoid? Do not duplicate items from other sections_

# Key results
_If the user asked a specific output such as an answer to a question, a table, or other document, repeat the exact result here_

# Worklog
_Step by step, what was attempted, done? Very terse summary for each step_
`;

// Session-memory compact range config (oF1 / gL0 / h97 in chunks.132.mjs)
type SessionMemoryCompactRangeConfig = {
  minTokens: number;
  minTextBlockMessages: number;
  maxTokens: number;
};

const DEFAULT_SM_COMPACT_RANGE: SessionMemoryCompactRangeConfig = {
  minTokens: 10000,
  minTextBlockMessages: 5,
  maxTokens: 40000,
};

let smCompactRangeConfig: SessionMemoryCompactRangeConfig = { ...DEFAULT_SM_COMPACT_RANGE };
let smCompactRangeLoaded = false;

/**
 * Set last summarized message ID.
 * Original: oEA() in chunks.132.mjs
 */
export function setLastSummarizedId(id: string | undefined): void {
  lastSummarizedId = id;
}

/**
 * Get last summarized message ID.
 * Original: Xs2() in chunks.132.mjs
 */
export function getLastSummarizedId(): string | undefined {
  return lastSummarizedId;
}

function markSessionMemoryUpdateStart(): void {
  pendingSessionMemoryUpdateStartedAt = Date.now();
}

function markSessionMemoryUpdateEnd(): void {
  pendingSessionMemoryUpdateStartedAt = undefined;
}

async function waitForPendingSessionMemoryUpdate(): Promise<void> {
  const start = Date.now();
  while (pendingSessionMemoryUpdateStartedAt) {
    if (Date.now() - pendingSessionMemoryUpdateStartedAt > SESSION_MEMORY_STALE_UPDATE_MS) return;
    if (Date.now() - start > SESSION_MEMORY_WAIT_TIMEOUT_MS) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

/**
 * Check if session memory compact is enabled.
 * Original: rF1() in chunks.132.mjs
 */
export function isSessionMemoryCompactEnabled(): boolean {
  // Feature-gated in source via flags: tengu_session_memory + tengu_sm_compact
  // We mirror this with env toggles.
  if (parseBoolean(process.env.DISABLE_COMPACT)) return false;
  return (
    parseBoolean(process.env.CLAUDE_CODE_ENABLE_SESSION_MEMORY ?? '') ||
    parseBoolean(process.env.CLAUDE_CODE_ENABLE_SM_COMPACT ?? '')
  );
}

function getSessionMemoryDir(): string {
  // Mirrors chunks.148.mjs: lz1() = join(getProjectDir(getProjectRoot()), getSessionId(), 'session-memory')
  return joinPath(getProjectDir(getProjectRoot()), getSessionId(), 'session-memory');
}

function getSessionMemorySummaryPath(): string {
  // Mirrors chunks.148.mjs: VhA() = join(lz1(), 'summary.md')
  return joinPath(getSessionMemoryDir(), 'summary.md');
}

function getSessionMemoryConfigPath(fileName: 'template.md' | 'prompt.md'): string {
  // Mirrors chunks.132.mjs: ws2(zQ(), 'session-memory', 'config', <file>)
  return joinPath(homedir(), '.claude', 'session-memory', 'config', fileName);
}

function loadSessionMemoryTemplate(): string {
  const p = getSessionMemoryConfigPath('template.md');
  if (FileSystemWrapper.existsSync(p)) {
    try {
      return FileSystemWrapper.readFileSync(p, { encoding: 'utf-8' });
    } catch {
      // Fall back to default template
    }
  }
  return DEFAULT_SESSION_MEMORY_TEMPLATE;
}

function readSessionMemoryFile(): string | null {
  const p = getSessionMemorySummaryPath();
  if (!FileSystemWrapper.existsSync(p)) return null;
  return FileSystemWrapper.readFileSync(p, { encoding: 'utf-8' });
}

async function isTemplateEmpty(summaryContent: string): Promise<boolean> {
  // Mirrors chunks.132.mjs: Os2(summary) compares against the template.
  const template = loadSessionMemoryTemplate();
  return summaryContent.trim() === template.trim();
}

async function ensureSmCompactRangeLoaded(): Promise<void> {
  // Mirrors chunks.132.mjs: h97() loads remote overrides once.
  if (smCompactRangeLoaded) return;
  smCompactRangeLoaded = true;
  // No remote config available in this reconstruction; keep defaults.
}

function hasTextContent(msg: ConversationMessage): boolean {
  if (msg.type === 'assistant') {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    return Array.isArray(content) && content.some((b) => (b as { type?: string }).type === 'text');
  }
  if (msg.type === 'user') {
    const content = (msg as { message?: { content?: unknown } }).message?.content;
    if (typeof content === 'string') return content.length > 0;
    if (Array.isArray(content)) return content.some((b) => (b as { type?: string }).type === 'text');
    return false;
  }
  return false;
}

function getToolResultIdsFromUserMessage(msg: ConversationMessage): string[] {
  if (msg.type !== 'user') return [];
  const content = (msg as { message?: { content?: unknown } }).message?.content;
  if (!Array.isArray(content)) return [];
  const ids: string[] = [];
  for (const block of content) {
    const b = block as { type?: string; tool_use_id?: string };
    if (b.type === 'tool_result' && b.tool_use_id) ids.push(b.tool_use_id);
  }
  return ids;
}

function assistantHasToolUseForIds(msg: ConversationMessage, ids: Set<string>): boolean {
  if (msg.type !== 'assistant') return false;
  const content = (msg as { message?: { content?: unknown[] } }).message?.content;
  if (!Array.isArray(content)) return false;
  return content.some((block) => {
    const b = block as { type?: string; id?: string };
    return b.type === 'tool_use' && typeof b.id === 'string' && ids.has(b.id);
  });
}

function adjustStartIndexToIncludeToolUses(
  messages: ConversationMessage[],
  startIndex: number
): number {
  // Mirrors chunks.132.mjs: hL0(A, G)
  if (startIndex <= 0 || startIndex >= messages.length) return startIndex;

  let idx = startIndex;
  const startMsg = messages[idx];
  if (!startMsg) return idx;
  const toolResultIds = getToolResultIdsFromUserMessage(startMsg);
  if (toolResultIds.length === 0) return idx;

  const pending = new Set(toolResultIds);
  for (let j = idx - 1; j >= 0 && pending.size > 0; j--) {
    const m = messages[j];
    if (!m) continue;
    if (assistantHasToolUseForIds(m, pending)) {
      idx = j;
      const content = (m as { message?: { content?: unknown[] } }).message?.content;
      if (m.type === 'assistant' && Array.isArray(content)) {
        for (const block of content) {
          const b = block as { type?: string; id?: string };
          if (b.type === 'tool_use' && b.id && pending.has(b.id)) pending.delete(b.id);
        }
      }
    }
  }

  return idx;
}

function computeSessionMemoryKeepStartIndex(
  messages: ConversationMessage[],
  summarizedMessageIndex: number
): number {
  // Mirrors chunks.132.mjs: m97(A, Y)
  if (messages.length === 0) return 0;

  const cfg = { ...smCompactRangeConfig };
  let start = summarizedMessageIndex >= 0 ? summarizedMessageIndex + 1 : messages.length;

  let tokenTotal = 0;
  let textBlockMessages = 0;

  for (let j = start; j < messages.length; j++) {
    const m = messages[j];
    if (!m) continue;
    tokenTotal += estimateTokensWithSafetyMargin([m]);
    if (hasTextContent(m)) textBlockMessages++;
  }

  if (tokenTotal >= cfg.maxTokens) return adjustStartIndexToIncludeToolUses(messages, start);
  if (tokenTotal >= cfg.minTokens && textBlockMessages >= cfg.minTextBlockMessages) {
    return adjustStartIndexToIncludeToolUses(messages, start);
  }

  for (let j = start - 1; j >= 0; j--) {
    const m = messages[j];
    if (!m) continue;
    tokenTotal += estimateTokensWithSafetyMargin([m]);
    if (hasTextContent(m)) textBlockMessages++;
    start = j;
    if (tokenTotal >= cfg.maxTokens) break;
    if (tokenTotal >= cfg.minTokens && textBlockMessages >= cfg.minTextBlockMessages) break;
  }

  return adjustStartIndexToIncludeToolUses(messages, start);
}

function flattenCompactionMessages(result: {
  boundaryMarker: unknown;
  summaryMessages: ConversationMessage[];
  messagesToKeep?: ConversationMessage[];
  attachments: unknown[];
  hookResults: unknown[];
}): unknown[] {
  // Mirrors chunks.132.mjs: FHA(A)
  return [
    result.boundaryMarker,
    ...result.summaryMessages,
    ...(result.messagesToKeep ?? []),
    ...result.attachments,
    ...result.hookResults,
  ].filter(Boolean);
}

function buildSessionMemoryCompactResult(params: {
  messages: ConversationMessage[];
  cachedSummary: string;
  messagesToKeep: ConversationMessage[];
  hookResults: unknown[];
  agentId?: string;
  transcriptPath: string;
  planAttachment: unknown | null;
}): Omit<SessionMemoryCompactResult, 'postCompactTokenCount'> {
  const preCompactTokenCount = estimateMessageTokens(params.messages);
  const boundaryMarker = createBoundaryMarker('auto', preCompactTokenCount);

  const summaryMessages: ConversationMessage[] = [
    createUserMessage({
      content: formatSummaryContent(params.cachedSummary, true, params.transcriptPath, true),
      isCompactSummary: true,
      isVisibleInTranscriptOnly: true,
    }) as any,
  ];

  return {
    fromSessionMemory: true,
    boundaryMarker,
    summaryMessages,
    messagesToKeep: params.messagesToKeep,
    attachments: params.planAttachment ? ([params.planAttachment] as any) : [],
    hookResults: params.hookResults,
    preCompactTokenCount,
  } as any;
}

/**
 * Session memory compact.
 * Original: sF1() in chunks.132.mjs:1392-1422
 *
 * Uses cached session summary for fast compaction without LLM call.
 *
 * @param messages - Conversation messages
 * @param agentId - Agent ID
 * @param autoCompactThreshold - Token threshold
 * @returns Session memory compact result or null if not available
 */
export async function sessionMemoryCompact(
  messages: ConversationMessage[],
  agentId: string | undefined,
  autoCompactThreshold?: number
): Promise<SessionMemoryCompactResult | null> {
  // Check if session memory compact feature is enabled
  if (!isSessionMemoryCompactEnabled()) {
    return null;
  }

  // Mirrors chunks.132.mjs: await h97(), await Ws2();
  await ensureSmCompactRangeLoaded();
  await waitForPendingSessionMemoryUpdate();

  // Get last summarized message ID and read cached summary
  const lastId = getLastSummarizedId();
  const cachedSummary = readSessionMemoryFile();
  if (!cachedSummary) return null;

  if (await isTemplateEmpty(cachedSummary)) {
    return null;
  }

  try {
    let summarizedIndex: number;
    if (lastId) {
      summarizedIndex = messages.findIndex((m) => (m as any).uuid === lastId);
      if (summarizedIndex === -1) return null;
    } else {
      summarizedIndex = messages.length - 1;
    }

    const keepStartIndex = computeSessionMemoryKeepStartIndex(messages, summarizedIndex);
    const messagesToKeep = messages.slice(keepStartIndex);

    const hookResults = await executePluginHooksForEvent('compact');
    const transcriptPath = generateConversationId(agentId);
    const planAttachment = await createPlanFileReferenceAttachment(agentId);

    const compactResultBase = buildSessionMemoryCompactResult({
      messages,
      cachedSummary,
      messagesToKeep,
      hookResults,
      agentId,
      transcriptPath,
      planAttachment,
    });

    const flattened = flattenCompactionMessages(compactResultBase as any);
    const postCompactTokenCount = estimateTokensWithSafetyMargin(flattened);

    if (autoCompactThreshold !== undefined && postCompactTokenCount >= autoCompactThreshold) {
      return null;
    }

    return {
      ...(compactResultBase as any),
      postCompactTokenCount,
    } as SessionMemoryCompactResult;
  } catch {
    return null;
  }
}

// ============================================
// Error Handling
// ============================================

/**
 * API abort error identifier.
 * Original: vkA in chunks.132.mjs
 */
const API_ABORT_ERROR = 'API_ABORT';

/**
 * Check if error is an expected abort error.
 * Original: sUA() in chunks.132.mjs
 */
function isExpectedError(error: unknown, errorType: string): boolean {
  if (error instanceof Error) {
    return error.message.includes(errorType) || error.name === errorType;
  }
  return false;
}

/**
 * Log error.
 * Original: e() in chunks.132.mjs
 */
function logError(error: Error): void {
  console.error('[Compact Error]', error.message);
}

// ============================================
// Auto-Compact Dispatcher
// ============================================

/**
 * Auto-compact dispatcher.
 * Original: ys2() in chunks.132.mjs:1511-1535
 *
 * Main entry point for automatic compaction. Tries session memory first,
 * then falls back to full LLM-based compaction.
 *
 * @param messages - Conversation messages
 * @param context - Compact session context
 * @param sessionMemoryType - Type of session memory
 * @returns Auto-compact result
 */
export async function autoCompactDispatcher(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  sessionMemoryType?: SessionMemoryType
): Promise<AutoCompactResult> {
  // Check if compaction is completely disabled
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if we should trigger auto-compact (threshold + feature checks)
  if (!(await shouldTriggerAutoCompact(messages, sessionMemoryType))) {
    return { wasCompacted: false };
  }

  // TIER 1: Try Session Memory Compact first (fastest, uses cached summary)
  const sessionMemoryResult = await sessionMemoryCompact(
    messages,
    context.agentId,
    getAutoCompactTarget()
  );

  if (sessionMemoryResult) {
    return {
      wasCompacted: true,
      compactionResult: sessionMemoryResult,
    };
  }

  // TIER 2: Fall back to Full Compact (slow, requires LLM call)
  try {
    const fullCompactResult = await fullCompact(
      messages,
      context,
      true,
      undefined,
      true // isAuto
    );

    // Clear the last summarized message ID after full compact
    setLastSummarizedId(undefined);

    return {
      wasCompacted: true,
      compactionResult: fullCompactResult,
    };
  } catch (error) {
    // Suppress expected "API aborted" errors, log others
    if (!isExpectedError(error, API_ABORT_ERROR)) {
      logError(error instanceof Error ? error : new Error(String(error)));
    }
    return { wasCompacted: false };
  }
}

/**
 * Manual compact dispatcher.
 *
 * Triggers compaction manually with optional custom instructions.
 *
 * @param messages - Conversation messages
 * @param context - Compact session context
 * @param customInstructions - Custom instructions for summary
 * @returns Full compact result
 */
export async function manualCompact(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  customInstructions?: string
): Promise<FullCompactResult> {
  return fullCompact(
    messages,
    context,
    true,
    customInstructions,
    false // isAuto
  );
}

/**
 * Check if auto-compact is available.
 */
export function isAutoCompactAvailable(): boolean {
  return isAutoCompactEnabled() && !parseBoolean(process.env.DISABLE_COMPACT);
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
