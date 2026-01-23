/**
 * @claudecode/features - Micro-Compact
 *
 * Tool-result micro-compaction (no LLM calls).
 * Original: lc in chunks.132.mjs:1111-1224
 */

import { type ConversationMessage } from '@claudecode/core';
import { parseBoolean, type ContentBlock } from '@claudecode/shared';
import { analyticsEvent, joinPath, getTempDir, FileSystemWrapper } from '@claudecode/platform';
import type { MicroCompactResult } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import { calculateThresholds, estimateMessageTokens } from './thresholds.js';

// ============================================
// Constants
// ============================================

/**
 * Marker for cleared tool results.
 * Original: pX0 in chunks.89.mjs:2530
 */
export const CLEARED_MARKER = '[Old tool result content cleared]';

/**
 * Start tag for persisted output.
 * Original: GZ1 in chunks.89.mjs:2447
 */
export const PERSISTED_OUTPUT_START = '<persisted-output>';

/**
 * End tag for persisted output.
 * Original: cX0 in chunks.89.mjs:2455
 */
export const PERSISTED_OUTPUT_END = '</persisted-output>';

// Tools whose results are eligible for micro-compaction.
// Original: x97 = new Set([z3, X9, DI, lI, aR, cI, I8, BY])
const COMPACTABLE_TOOLS = new Set([
  'Read',      // z3
  'Bash',      // X9
  'Grep',      // DI
  'Glob',      // lI
  'WebSearch', // aR
  'WebFetch',  // cI
  'Edit',      // I8
  'Write',     // BY
]);

// Persistent micro-compact state (module-level)
const compactedToolIds = new Set<string>();
const toolResultTokenCache = new Map<string, number>();
const clearedMemoryUuids = new Set<string>(); // fL0 in source
let microCompactOccurred = false; // nF1 in source
const microCompactListeners: Array<() => void> = []; // iF1 in source

export function didMicroCompactOccur(): boolean {
  return microCompactOccurred;
}

/**
 * Add listener for micro-compact events.
 * Original: v97 in chunks.132.mjs:1101
 */
export function addMicroCompactListener(listener: () => void): () => void {
  microCompactListeners.push(listener);
  return () => {
    const idx = microCompactListeners.indexOf(listener);
    if (idx >= 0) microCompactListeners.splice(idx, 1);
  };
}

/**
 * Notify all micro-compact listeners.
 * Original: k97 in chunks.132.mjs:1107
 */
function notifyMicroCompactListeners(): void {
  for (const l of microCompactListeners) {
    try {
      l();
    } catch {
      // Ignore listener errors
    }
  }
}

// ============================================
// Tool Result Analysis
// ============================================

/**
 * Estimate token savings from clearing a tool result.
 * Original: js2 in chunks.132.mjs:1071
 */
function countMessageTokensForToolResult(block: ContentBlock): number {
  const content = (block as any).content;

  if (!content) return 0;
  if (typeof content === 'string') {
    // Original: l7(A.content)
    return Math.ceil(content.length / 4);
  }

  if (Array.isArray(content)) {
    return content.reduce((acc: number, item: any) => {
      if (item.type === 'text' && typeof item.text === 'string') {
        return acc + Math.ceil(item.text.length / 4);
      } else if (item.type === 'image') {
        return acc + COMPACT_CONSTANTS.TOKENS_PER_IMAGE; // _s2 = 2000
      }
      return acc;
    }, 0);
  }

  return 0;
}

/** 
 * Cache token counts for tool results.
 * Original: y97 in chunks.132.mjs:1081
 */
function getCachedToolResultTokens(toolUseId: string, block: ContentBlock): number {
  const cached = toolResultTokenCache.get(toolUseId);
  if (cached !== undefined) return cached;
  const computed = countMessageTokensForToolResult(block);
  toolResultTokenCache.set(toolUseId, computed);
  return computed;
}

/**
 * Check if content is already persisted or cleared.
 * Original: j97 in chunks.132.mjs:1067
 */
function isAlreadyCompacted(content: any): boolean {
  return typeof content === 'string' && (content === CLEARED_MARKER || content.includes(PERSISTED_OUTPUT_START));
}

// ============================================
// Tool Result Persistence
// ============================================

/**
 * Get tool results directory.
 * Original: ZZ1 in chunks.89.mjs:2413
 */
function getToolResultsDir(): string {
  return joinPath(getTempDir(), 'tool-results');
}

/**
 * Ensure tool results directory exists.
 * Original: K85 in chunks.89.mjs:2411
 */
async function ensureToolResultsDir(): Promise<void> {
  try {
    const dir = getToolResultsDir();
    if (!FileSystemWrapper.existsSync(dir)) {
      FileSystemWrapper.mkdirSync(dir, { recursive: true });
    }
  } catch {}
}

/**
 * Create preview of content.
 * Original: H85 in chunks.89.mjs:2485
 */
function createPreview(content: string, limit: number): { preview: string; hasMore: boolean } {
  if (content.length <= limit) {
    return { preview: content, hasMore: false };
  }
  
  const lastNewline = content.slice(0, limit).lastIndexOf('\n');
  const cutoff = lastNewline > limit * 0.5 ? lastNewline : limit;
  
  return {
    preview: content.slice(0, cutoff),
    hasMore: true
  };
}

/**
 * Format bytes to readable string.
 * Original: xD in chunks.132.mjs (internal)
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const k = bytes / 1024;
  if (k < 1024) return `${k.toFixed(1)} KB`;
  return `${(k / 1024).toFixed(1)} MB`;
}

/**
 * Persist large tool result to disk.
 * Original: Z4A in chunks.89.mjs:2412-2443
 */
async function persistLargeToolResult(content: string | unknown[], toolUseId: string): Promise<{
  filepath: string;
  originalSize: number;
  isJson: boolean;
  preview: string;
  hasMore: boolean;
  error?: string;
}> {
  await ensureToolResultsDir();
  
  const isJson = Array.isArray(content);
  const ext = isJson ? 'json' : 'txt';
  const filepath = joinPath(getToolResultsDir(), `${toolUseId}.${ext}`);
  
  const contentString = isJson 
    ? JSON.stringify(content, null, 2) 
    : String(content);
    
  let written = false;
  
  try {
    if (FileSystemWrapper.existsSync(filepath)) {
      written = true;
    }
  } catch {}
  
  if (!written) {
    try {
      FileSystemWrapper.writeFileSync(filepath, contentString, { encoding: 'utf-8' });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return {
        filepath,
        originalSize: contentString.length,
        isJson,
        preview: '',
        hasMore: false,
        error: error.message
      };
    }
  }
  
  const { preview, hasMore } = createPreview(contentString, 2000); // q42 = 2000
  
  return {
    filepath,
    originalSize: contentString.length,
    isJson,
    preview,
    hasMore
  };
}

// ============================================
// Micro-Compact Implementation
// ============================================

/**
 * Perform micro-compaction on messages.
 * Original: lc in chunks.132.mjs:1111-1224
 */
export async function microCompact(
  messages: ConversationMessage[],
  threshold?: number,
  context?: { readFileState?: Map<string, any> }
): Promise<MicroCompactResult> {
  microCompactOccurred = false;

  if (parseBoolean(process.env.DISABLE_MICROCOMPACT)) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  const hasExplicitThreshold = threshold !== undefined;
  const targetThreshold = hasExplicitThreshold
    ? threshold!
    : COMPACT_CONSTANTS.MICRO_COMPACT_THRESHOLD; // P97 = 40000

  // Phase 1: collect compactable tool_use ids and tool_result token counts
  const toolUseIds: string[] = [];
  const toolResultTokens = new Map<string, number>();

  for (const msg of messages) {
    if ((msg.type !== 'assistant' && msg.type !== 'user') || !Array.isArray(msg.message?.content)) continue;

    for (const block of msg.message.content) {
      if (block.type === 'tool_use') {
        if (!block.id || !block.name) continue;
        if (!COMPACTABLE_TOOLS.has(block.name)) continue;
        if (compactedToolIds.has(block.id)) continue;
        toolUseIds.push(block.id);
      } else if (block.type === 'tool_result') {
        if (!block.tool_use_id) continue;
        if (!toolUseIds.includes(block.tool_use_id)) continue;
        const tokens = getCachedToolResultTokens(block.tool_use_id, block);
        toolResultTokens.set(block.tool_use_id, tokens);
      }
    }
  }

  if (toolUseIds.length === 0) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  // Phase 2: determine which tool results to compact
  const KEEP_RECENT = COMPACT_CONSTANTS.RECENT_TOOL_RESULTS_TO_KEEP; // S97 = 3
  const toolsToKeep = new Set(toolUseIds.slice(-KEEP_RECENT));
  const totalUncompactedTokens = [...toolResultTokens.values()].reduce((a, b) => a + b, 0);

  let tokensToSave = 0;
  const toolsToCompact = new Set<string>();
  for (const id of toolUseIds) {
    if (toolsToKeep.has(id)) continue;
    if (totalUncompactedTokens - tokensToSave > targetThreshold) {
      toolsToCompact.add(id);
      tokensToSave += toolResultTokens.get(id) ?? 0;
    }
  }

  // Phase 3: auto-trigger gating (warning threshold + minimum savings)
  if (!hasExplicitThreshold) {
    // In source: sH(A) counts tokens
    const currentTokens = estimateMessageTokens(messages);
    const thresholds = calculateThresholds(currentTokens);
    if (!thresholds.isAboveWarningThreshold || tokensToSave < COMPACT_CONSTANTS.MICRO_COMPACT_MIN_SAVINGS) {
      toolsToCompact.clear();
      tokensToSave = 0;
    }
  }

  if (toolsToCompact.size === 0) {
    return { messages, resultsCleared: 0, tokensSaved: 0 };
  }

  // Phase 4: memory attachment clearing (fL0 in source)
  if (toolsToCompact.size > 0) {
    messages.forEach(msg => {
      if (msg && msg.type === 'attachment' && (msg as any).attachment?.type === 'memory' && !clearedMemoryUuids.has((msg as any).uuid)) {
        clearedMemoryUuids.add((msg as any).uuid);
      }
    });
  }

  // Phase 5: replace tool_result content with persistence reference
  const newMessages: ConversationMessage[] = [];
  
  for (const msg of messages) {
    // Skip if memory attachment cleared
    if (msg.type === 'attachment' && clearedMemoryUuids.has((msg as any).uuid)) continue;

    if ((msg.type !== 'assistant' && msg.type !== 'user') || !Array.isArray(msg.message?.content)) {
      newMessages.push(msg);
      continue;
    }
    
    if (msg.type === 'user') {
      const updatedContent: any[] = [];
      let toolUseResult = msg.toolUseResult;
      let changed = false;
      
      for (const block of msg.message.content) {
        if (block.type === 'tool_result' && 
            block.tool_use_id && 
            (compactedToolIds.has(block.tool_use_id) || toolsToCompact.has(block.tool_use_id)) && 
            block.content && 
            !isAlreadyCompacted(block.content)) {
            
          changed = true;
          let replacementContent = CLEARED_MARKER;
          
          // Persist content to disk
          const persistenceResult = await persistLargeToolResult(block.content as any, block.tool_use_id);
          
          if (!persistenceResult.error) {
            // Original: V85() formatting
            replacementContent = `${PERSISTED_OUTPUT_START}
Output too large (${formatBytes(persistenceResult.originalSize)}). Full output saved to: ${persistenceResult.filepath}

Preview (first 2000):
${persistenceResult.preview}${persistenceResult.hasMore ? '\n...' : ''}
${PERSISTED_OUTPUT_END}

Use Read to view`;
            
            // Clear toolUseResult if we persisted successfully
            toolUseResult = undefined;
          }
          
          updatedContent.push({ ...block, content: replacementContent });
        } else {
          updatedContent.push(block);
        }
      }
      
      newMessages.push(changed ? {
        ...msg,
        message: { ...msg.message, content: updatedContent },
        toolUseResult
      } : msg);
    } else {
      // Assistant messages just copied
      newMessages.push({
        ...msg,
        message: {
          ...msg.message,
          content: [...(msg.message?.content as any[] || [])]
        }
      });
    }
  }

  // Phase 6: readFileState cleanup (only for Read tool)
  // Original: chunks.132.mjs:1197-1211
  if (context?.readFileState && toolsToCompact.size > 0) {
    const compactedFilepaths = new Map<string, string>();
    const keptFilepaths = new Set<string>();

    for (const msg of messages) {
      if ((msg.type !== 'assistant' && msg.type !== 'user') || !Array.isArray(msg.message?.content)) continue;
      for (const block of msg.message.content) {
        if (block.type !== 'tool_use') continue;
        if (block.name !== 'Read' || !block.id) continue;
        const fp = (block.input as any)?.file_path;
        if (typeof fp !== 'string') continue;

        if (toolsToCompact.has(block.id)) compactedFilepaths.set(fp, block.id);
        else keptFilepaths.add(fp);
      }
    }

    for (const [fp] of compactedFilepaths) {
      if (!keptFilepaths.has(fp)) {
        context.readFileState.delete(fp);
      }
    }
  }

  // Phase 7: update state & return
  for (const id of toolsToCompact) compactedToolIds.add(id);

  if (toolsToCompact.size > 0) {
    analyticsEvent('tengu_microcompact', {
      toolsCompacted: toolsToCompact.size,
      tokensSaved: tokensToSave,
      triggerType: hasExplicitThreshold ? 'manual' : 'auto',
    });
    microCompactOccurred = true;
    notifyMicroCompactListeners();
  }

  return {
    messages: newMessages,
    resultsCleared: toolsToCompact.size,
    tokensSaved: tokensToSave,
  };
}
