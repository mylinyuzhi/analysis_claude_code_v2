/**
 * @claudecode/features - Micro-Compact
 *
 * Tool-result micro-compaction (no LLM calls).
 * Original: lc() / microCompactToolResults in chunks.132.mjs:1111-1224
 *
 * Key symbols:
 * - lc → microCompact
 * - x97 → COMPACTABLE_TOOLS
 * - Z4A → persistLargeToolResult (from chunks.89.mjs)
 */

import { createUserMessage, type ConversationMessage } from '@claudecode/core';
import { parseBoolean, type ContentBlock } from '@claudecode/shared';
import { analyticsEvent, joinPath, getTempDir, FileSystemWrapper } from '@claudecode/platform';
import type { MicroCompactResult } from './types.js';
import { COMPACT_CONSTANTS } from './types.js';
import { calculateThresholds, estimateMessageTokens } from './thresholds.js';

// ============================================
// Constants
// ============================================

export const CLEARED_MARKER = '[Old tool result content cleared]'; // Matches common behavior
export const PERSISTED_OUTPUT_START = '<persisted-output>';
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
let microCompactOccurred = false;
const microCompactListeners: Array<() => void> = [];

export function didMicroCompactOccur(): boolean {
  return microCompactOccurred;
}

export function addMicroCompactListener(listener: () => void): () => void {
  microCompactListeners.push(listener);
  return () => {
    const idx = microCompactListeners.indexOf(listener);
    if (idx >= 0) microCompactListeners.splice(idx, 1);
  };
}

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
 */
function countMessageTokensForToolResult(block: ContentBlock): number {
  const content = (block as any).content;

  if (typeof content === 'string') {
    return Math.ceil(content.length / 4);
  }

  if (Array.isArray(content)) {
    let tokens = 0;
    for (const item of content) {
      if (typeof item === 'string') {
        tokens += Math.ceil(item.length / 4);
      } else if (item?.type === 'image') {
        tokens += COMPACT_CONSTANTS.TOKENS_PER_IMAGE;
      } else if (item?.text) {
        tokens += Math.ceil(item.text.length / 4);
      }
    }
    return tokens;
  }

  return 0;
}

/** Cache token counts for tool results (Original: y97) */
function getCachedToolResultTokens(toolUseId: string, block: ContentBlock): number {
  const cached = toolResultTokenCache.get(toolUseId);
  if (cached !== undefined) return cached;
  const computed = countMessageTokensForToolResult(block);
  toolResultTokenCache.set(toolUseId, computed);
  return computed;
}

// ============================================
// Tool Result Persistence
// ============================================

/**
 * Get tool results directory.
 * Original: ZZ1() in chunks.89.mjs
 */
function getToolResultsDir(): string {
  return joinPath(getTempDir(), 'tool-results');
}

/**
 * Ensure tool results directory exists.
 * Original: K85() in chunks.89.mjs
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
 * Original: H85() in chunks.89.mjs
 */
function createPreview(content: string, limit: number): { preview: string; hasMore: boolean } {
  if (content.length <= limit) {
    return { preview: content, hasMore: false };
  }
  
  // Find last newline in first half of limit to avoid breaking lines if possible
  const lastNewline = content.slice(0, limit).lastIndexOf('\n');
  const cutoff = lastNewline > limit * 0.5 ? lastNewline : limit;
  
  return {
    preview: content.slice(0, cutoff),
    hasMore: true
  };
}

/**
 * Persist large tool result to disk.
 * Original: Z4A() in chunks.89.mjs
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
  
  // Check if already exists
  try {
    if (FileSystemWrapper.existsSync(filepath)) {
      written = true;
    }
  } catch {}
  
  // Write if not exists
  if (!written) {
    try {
      FileSystemWrapper.writeFileSync(filepath, contentString, 'utf-8');
      // k() log call in source: Persisted tool result to...
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      // e() error log call in source
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
 * Original: lc() in chunks.132.mjs:1111-1224
 *
 * Micro-compact replaces old tool_result content with "[cleared]"
 * to reduce token count without an LLM call.
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

  // Phase 4: readFileState cleanup (only for Read tool)
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

  // Phase 5: replace tool_result content with persistence
  const newMessages: ConversationMessage[] = [];
  
  for (const msg of messages) {
    // Skip if not multimodal or filtered
    if ((msg.type !== 'assistant' && msg.type !== 'user') || !Array.isArray(msg.message?.content)) {
      newMessages.push(msg);
      continue;
    }
    
    // Process content blocks
    if (msg.type === 'user') {
      const updatedContent: any[] = [];
      let toolUseResult = msg.toolUseResult;
      
      for (const block of msg.message.content) {
        if (block.type === 'tool_result' && 
            block.tool_use_id && 
            toolsToCompact.has(block.tool_use_id) && 
            block.content && 
            typeof block.content !== 'string') { // Only persist non-string (likely large) or handle string specifically if needed
            
          // In original code j97(z.content) checks if already persisted/cleared
          // We'll skip that check for brevity and rely on the set
          
          let replacementContent = CLEARED_MARKER;
          
          // Persist content to disk
          // Original: Z4A(z.content, z.tool_use_id)
          const persistenceResult = await persistLargeToolResult(block.content, block.tool_use_id);
          
          if (!persistenceResult.error) {
            replacementContent = `${PERSISTED_OUTPUT_START}\nOutput too large (${persistenceResult.originalSize} chars). Full output saved to: ${persistenceResult.filepath}\n\nPreview (first 2000):\n${persistenceResult.preview}${persistenceResult.hasMore ? '\n...' : ''}\n${PERSISTED_OUTPUT_END}`;
            
            // Clear toolUseResult if we persisted successfully (matches E = !0 logic in source)
            toolUseResult = undefined;
          }
          
          updatedContent.push({ ...block, content: replacementContent });
        } else if (block.type === 'tool_result' && 
                   block.tool_use_id && 
                   toolsToCompact.has(block.tool_use_id)) {
          // Already string content or failed to persist
          updatedContent.push({ ...block, content: CLEARED_MARKER });
        } else {
          updatedContent.push(block);
        }
      }
      
      newMessages.push({
        ...msg,
        message: { ...msg.message, content: updatedContent },
        toolUseResult
      });
    } else {
      // Assistant message - just copy content
      newMessages.push(msg);
    }
  }

  // Phase 6: update state & return
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
