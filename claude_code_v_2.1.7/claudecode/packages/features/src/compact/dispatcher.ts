/**
 * @claudecode/features - Compact Dispatcher
 *
 * Main entry point for automatic compaction.
 * Original: ys2 (autoCompactDispatcher) in chunks.132.mjs:1511-1535
 */

import { parseBoolean } from '@claudecode/shared';
import type { ConversationMessage } from '@claudecode/core';
import { getProjectDir, getProjectRoot, getSessionId } from '@claudecode/shared';
import { FileSystemWrapper, joinPath, analyticsEvent } from '@claudecode/platform';
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
  setThresholdComputationContext,
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
// Session Memory Compact State
// ============================================

/**
 * Last summarized message ID.
 * Original: Xs2 / oEA in chunks.132.mjs:1395, 1525
 */
let lastSummarizedId: string | undefined;

/**
 * Pending session-memory update marker.
 * Original: lF1 / Is2 / Ds2 in chunks.132.mjs:1394
 */
let pendingSessionMemoryUpdateStartedAt: number | undefined;

const SESSION_MEMORY_WAIT_TIMEOUT_MS = 15000; // q97 in chunks.132.mjs:1394
const SESSION_MEMORY_STALE_UPDATE_MS = 60000; // N97 in chunks.132.mjs:1394

// Default session-memory template (w97 in chunks.132.mjs:1394)
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

// Session-memory compact range config (oF1 / gL0 / h97 in chunks.132.mjs:1394)
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

// ============================================
// Helper Functions
// ============================================

/**
 * Set last summarized message ID.
 * Original: oEA in chunks.132.mjs:1525
 */
export function setLastSummarizedId(id: string | undefined): void {
  lastSummarizedId = id;
}

/**
 * Get last summarized message ID.
 * Original: Xs2 in chunks.132.mjs:1395
 */
export function getLastSummarizedId(): string | undefined {
  return lastSummarizedId;
}

export function markSessionMemoryUpdateStart(): void {
  pendingSessionMemoryUpdateStartedAt = Date.now();
}

export function markSessionMemoryUpdateEnd(): void {
  pendingSessionMemoryUpdateStartedAt = undefined;
}

/**
 * Wait for pending session memory update.
 * Original: Ws2 in chunks.132.mjs:1394
 */
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
 * Original: rF1 in chunks.132.mjs:1393
 */
export function isSessionMemoryCompactEnabled(): boolean {
  if (parseBoolean(process.env.DISABLE_COMPACT)) return false;
  // Source checks "tengu_session_memory" AND "tengu_sm_compact" feature flags
  return (
    parseBoolean(process.env.CLAUDE_CODE_ENABLE_SESSION_MEMORY ?? '') &&
    parseBoolean(process.env.CLAUDE_CODE_ENABLE_SM_COMPACT ?? '')
  );
}

function getSessionMemoryDir(): string {
  return joinPath(getProjectDir(getProjectRoot()), getSessionId(), 'session-memory');
}

function getSessionMemorySummaryPath(): string {
  return joinPath(getSessionMemoryDir(), 'summary.md');
}

function getSessionMemoryConfigPath(fileName: 'template.md' | 'prompt.md'): string {
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

/**
 * Read session memory file.
 * Original: Ks2 in chunks.132.mjs:1396
 */
function readSessionMemoryFile(): string | null {
  const p = getSessionMemorySummaryPath();
  if (!FileSystemWrapper.existsSync(p)) return null;
  return FileSystemWrapper.readFileSync(p, { encoding: 'utf-8' });
}

/**
 * Check if template is empty.
 * Original: Os2 in chunks.132.mjs:1398
 */
async function isTemplateEmpty(summaryContent: string): Promise<boolean> {
  const template = loadSessionMemoryTemplate();
  return summaryContent.trim() === template.trim();
}

/**
 * Initialize session memory config.
 * Original: h97 in chunks.132.mjs:1394
 */
async function ensureSmCompactRangeLoaded(): Promise<void> {
  if (smCompactRangeLoaded) return;
  smCompactRangeLoaded = true;
  // h97 in source loads remote config; we use defaults.
  smCompactRangeConfig = {
    minTokens: 10000,
    minTextBlockMessages: 5,
    maxTokens: 40000,
  };
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

/**
 * Adjust start index to include corresponding tool uses.
 * Original: hL0 in chunks.132.mjs:1404
 */
function adjustStartIndexToIncludeToolUses(
  messages: ConversationMessage[],
  startIndex: number
): number {
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

/**
 * Compute start index for messages to keep.
 * Original: m97 in chunks.132.mjs:1404
 */
function computeSessionMemoryKeepStartIndex(
  messages: ConversationMessage[],
  summarizedMessageIndex: number
): number {
  if (messages.length === 0) return 0;

  const cfg = { ...smCompactRangeConfig };
  let start = summarizedMessageIndex >= 0 ? summarizedMessageIndex + 1 : messages.length;

  let tokenTotal = 0;
  let textBlockMessages = 0;

  // Scan forward from summarized message
  for (let j = start; j < messages.length; j++) {
    const m = messages[j];
    if (!m) continue;
    tokenTotal += estimateTokensWithSafetyMargin([m]);
    if (hasTextContent(m)) textBlockMessages++;
  }

  // If already above limit, just adjust tool pairs
  if (tokenTotal >= cfg.maxTokens) return adjustStartIndexToIncludeToolUses(messages, start);
  if (tokenTotal >= cfg.minTokens && textBlockMessages >= cfg.minTextBlockMessages) {
    return adjustStartIndexToIncludeToolUses(messages, start);
  }

  // Otherwise scan backward to reach minimums
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

/**
 * Flatten result for token counting.
 * Original: FHA in chunks.132.mjs:1409
 */
function flattenCompactionMessages(result: {
  boundaryMarker: unknown;
  summaryMessages: ConversationMessage[];
  messagesToKeep?: ConversationMessage[];
  attachments: unknown[];
  hookResults: unknown[];
}): unknown[] {
  return [
    result.boundaryMarker,
    ...result.summaryMessages,
    ...(result.messagesToKeep ?? []),
    ...result.attachments,
    ...result.hookResults,
  ].filter(Boolean);
}

/**
 * Build session memory compact result.
 * Original: d97 in chunks.132.mjs:1408
 */
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

// ============================================
// Session Memory Compact Implementation
// ============================================

/**
 * Session memory compact.
 * Original: sF1() in chunks.132.mjs:1392-1422
 *
 * Uses cached session summary for fast compaction without LLM call.
 */
export async function sessionMemoryCompact(
  messages: ConversationMessage[],
  agentId: string | undefined,
  autoCompactThreshold?: number
): Promise<SessionMemoryCompactResult | null> {
  if (!isSessionMemoryCompactEnabled()) return null;

  await ensureSmCompactRangeLoaded();
  await waitForPendingSessionMemoryUpdate();

  const lastId = getLastSummarizedId();
  const cachedSummary = readSessionMemoryFile();
  if (!cachedSummary) return null;

  if (await isTemplateEmpty(cachedSummary)) {
    analyticsEvent('tengu_sm_compact_empty_template', {});
    return null;
  }

  try {
    let summarizedIndex: number;
    if (lastId) {
      summarizedIndex = messages.findIndex((m) => (m as any).uuid === lastId);
      if (summarizedIndex === -1) {
        analyticsEvent('tengu_sm_compact_summarized_id_not_found', {});
        return null;
      }
    } else {
      summarizedIndex = messages.length - 1;
      analyticsEvent('tengu_sm_compact_resumed_session', {});
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
      analyticsEvent('tengu_sm_compact_threshold_exceeded', {
        postCompactTokenCount,
        autoCompactThreshold,
      });
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
// Auto-Compact Dispatcher
// ============================================

const API_ABORT_ERROR = 'API Error: Request was aborted.'; // vkA

/**
 * Check if error is an expected abort error.
 * Original: sUA in chunks.132.mjs:1530
 */
function isExpectedError(error: unknown, errorType: string): boolean {
  if (error instanceof Error) {
    return error.message.includes(errorType) || error.name === errorType;
  }
  return String(error).includes(errorType);
}

function logError(error: Error): void {
  console.error('[Compact Error]', error.message);
}

/**
 * Auto-compact dispatcher.
 * Original: ys2 (autoCompactDispatcher) in chunks.132.mjs:1511-1535
 */
export async function autoCompactDispatcher(
  messages: ConversationMessage[],
  context: CompactSessionContext,
  sessionMemoryType?: SessionMemoryType
): Promise<AutoCompactResult> {
  // Ensure q3A()/xs2()/ic() match the active request model/betas.
  setThresholdComputationContext({
    model: context.options.mainLoopModel,
    sdkBetas: Array.isArray((context.options as any).sdkBetas)
      ? ((context.options as any).sdkBetas as string[])
      : undefined,
  });

  // Check if compaction is completely disabled (a1 in source)
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Check if we should trigger auto-compact (l97 in source)
  if (!(await shouldTriggerAutoCompact(messages, sessionMemoryType))) {
    return { wasCompacted: false };
  }

  // TIER 1: Try Session Memory Compact first (sF1 in source)
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

  // TIER 2: Fall back to Full Compact (cF1 in source)
  try {
    const fullCompactResult = await fullCompact(
      messages,
      context,
      true,
      undefined,
      true // isAuto
    );

    // Clear the last summarized message ID after full compact
    // Original: oEA(void 0) in chunks.132.mjs:1525
    setLastSummarizedId(undefined);

    return {
      wasCompacted: true,
      compactionResult: fullCompactResult,
    };
  } catch (error) {
    // Suppress expected "API aborted" errors, log others
    // Original: sUA(Y, vkA) check
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
