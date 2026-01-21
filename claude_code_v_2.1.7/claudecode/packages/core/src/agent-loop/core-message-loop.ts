/**
 * @claudecode/core - Core Message Loop
 *
 * Main message processing loop for agent execution.
 * Reconstructed from chunks.134.mjs:99-410
 *
 * Key symbols:
 * - aN → coreMessageLoop (main function)
 * - _H1 → StreamingToolExecutor
 * - lc → microCompact
 * - ys2 → autoCompactDispatcher
 * - _x → normalizeMessages
 * - oHA → streamApiResponse
 * - HQA → resolveModelWithPermissions
 * - fA9 → mergeSystemPromptWithContext
 * - _3A → addUserContextToMessages
 * - KM0 → executeToolsSequentially
 * - FHA → formatCompactionMessages
 * - FI → normalizeToolResults
 */

import { generateUUID } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ContentBlock } from '@claudecode/shared';
import type { ConversationMessage } from '../message/types.js';
import type { ToolUseContext } from '../tools/types.js';
import { StreamingToolExecutor } from './streaming-tool-executor.js';
import { streamApiCall, type StreamApiCallOptions } from '../llm-api/streaming.js';
import { normalizeMessagesToAPI } from '../message/normalization.js';
import { executeSingleTool } from '../tools/execution.js';
import {
  autoCompactDispatcher as autoCompactDispatcherFeature,
  microCompact as microCompactFeature,
  attachments as attachmentsModule,
  executeHooksInREPL,
  type REPLHookYield,
} from '@claudecode/features';
import type {
  CoreMessageLoopOptions,
  LoopEvent,
  AutoCompactTracking,
  ToolUseBlock,
  QueryTracking,
  ToolExecutionYield,
} from './types.js';
import { AGENT_LOOP_CONSTANTS } from './types.js';

// ============================================
// Performance Markers
// ============================================

/**
 * Performance marker storage.
 */
const performanceMarkers = new Map<string, number>();

/**
 * Record a performance marker.
 * Original: h6 in chunks.134.mjs
 */
export function recordMarker(name: string): void {
  performanceMarkers.set(name, Date.now());
}

/**
 * Log telemetry event.
 * Original: l in chunks (telemetry)
 */
function logTelemetry(event: string, data: Record<string, unknown>): void {
  if (process.env.DEBUG_TELEMETRY) {
    console.log(`[Telemetry] ${event}:`, data);
  }
}

/**
 * Log error to error tracking.
 * Original: e in chunks
 */
function logError(error: Error): void {
  if (process.env.DEBUG_ERRORS) {
    console.error('[Error]', error);
  }
}

/**
 * Log exception with context.
 * Original: xM in chunks
 */
function logException(context: string, error: unknown): void {
  if (process.env.DEBUG_ERRORS) {
    console.error(`[Exception] ${context}:`, error);
  }
}

// ============================================
// Feature Flags
// ============================================

/**
 * Check if feature is enabled.
 * Original: f8 in chunks
 */
export function isFeatureEnabled(feature: string): boolean {
  // Check environment variable override
  const envVar = `FEATURE_${feature.toUpperCase().replace(/-/g, '_')}`;
  if (process.env[envVar]) {
    return process.env[envVar] === 'true';
  }

  // Default feature states
  const defaultFeatures: Record<string, boolean> = {
    tengu_streaming_tool_execution2: true,
  };

  return defaultFeatures[feature] ?? false;
}

// ============================================
// Message Processing
// ============================================

/**
 * Normalize messages for API submission.
 * Original: _x in chunks.134.mjs
 */
export function normalizeMessages(
  messages: ConversationMessage[],
  tools: unknown[] = []
): ConversationMessage[] {
  // In the original implementation, this step normalizes ordering/merging and filters non-API messages.
  // The closest reconstructed equivalent is normalizeMessagesToAPI (FI in chunks.147.mjs).
  return normalizeMessagesToAPI(messages, tools as any);
}

/**
 * Add user context to messages.
 * Original: _3A in chunks.134.mjs
 */
function normalizeContextRecord(value: unknown): Record<string, string> {
  if (!value) return {};
  if (typeof value === 'string') {
    // Allow JSON object string, otherwise treat as single blob.
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [k, String(v)])
        );
      }
    } catch {
      // ignore
    }
    return { UserContext: value };
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, String(v)])
    );
  }
  return { UserContext: String(value) };
}

export function addUserContextToMessages(
  messages: ConversationMessage[],
  userContext?: unknown
): ConversationMessage[] {
  const ctx = normalizeContextRecord(userContext);
  if (Object.keys(ctx).length === 0) return messages;

  // Mirror chunks.133.mjs:_3A (injectUserContext): prepend a meta user message containing a <system-reminder> block.
  const reminder = `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(ctx)
  .map(([k, v]) => `# ${k}\n${v}`)
  .join('\n')}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`;

  return [
    createUserMessage({
      content: reminder,
      isMeta: true,
    }) as ConversationMessage,
    ...messages,
  ];
}

/**
 * Merge system prompt with context.
 * Original: fA9 in chunks.134.mjs
 */
export function mergeSystemPromptWithContext(
  systemPrompt: string | string[],
  systemContext?: unknown
): string {
  const promptParts = Array.isArray(systemPrompt) ? systemPrompt : [systemPrompt].filter(Boolean);
  const ctx = normalizeContextRecord(systemContext);
  const ctxLines = Object.entries(ctx)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  const merged = [...promptParts, ctxLines].filter((s) => Boolean(s && String(s).trim()));
  return merged.join('\n\n');
}

/**
 * Resolve model with permissions.
 * Original: HQA in chunks.134.mjs
 */
export function resolveModelWithPermissions(options: {
  permissionMode: string;
  mainLoopModel?: string;
  exceeds200kTokens?: boolean;
}): string {
  const { permissionMode, mainLoopModel, exceeds200kTokens } = options;

  // If in plan mode with large context, may need different model
  if (permissionMode === 'plan' && exceeds200kTokens) {
    // Use extended context model
    return 'claude-sonnet-4-20250514';
  }

  return mainLoopModel || 'claude-sonnet-4-20250514';
}

/**
 * Check if at blocking token limit.
 * Original: ic in chunks.134.mjs
 */
function checkTokenLimit(tokenCount: number): { isAtBlockingLimit: boolean } {
  const maxTokens = parseInt(process.env.CLAUDE_CODE_MAX_TOKENS || '200000', 10);
  return {
    isAtBlockingLimit: tokenCount > maxTokens,
  };
}

/**
 * Estimate token count for messages.
 * Original: HKA in chunks
 */
function estimateTokenCount(messages: ConversationMessage[]): number {
  let count = 0;
  for (const msg of messages) {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if ((block as { type: string }).type === 'text') {
          // Rough estimate: 4 characters per token
          count += Math.ceil(((block as { text: string }).text || '').length / 4);
        } else if ((block as { type: string }).type === 'tool_result') {
          const resultContent = (block as { content?: string }).content || '';
          count += Math.ceil(resultContent.length / 4);
        }
      }
    }
  }
  return count;
}

/**
 * Check if messages exceed 200k tokens.
 * Original: h51 in chunks.134.mjs
 */
function exceeds200kTokens(messages: ConversationMessage[]): boolean {
  return estimateTokenCount(messages) > 200000;
}

// ============================================
// Message Factories
// ============================================

/**
 * Create error attachment message.
 * Original: DZ in chunks.134.mjs
 */
export function createErrorAttachment(options: {
  content: string;
  error?: string;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: 'error',
      content: options.content,
      error: options.error,
    },
  } as ConversationMessage;
}

/**
 * Create interrupted attachment message.
 * Original: fhA in chunks.134.mjs
 */
export function createInterruptedAttachment(options: {
  toolUse: boolean;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: 'interrupted',
      toolUse: options.toolUse,
    },
  } as ConversationMessage;
}

/**
 * Create max turns attachment message.
 * Original: X4 in chunks.134.mjs
 */
export function createMaxTurnsAttachment(options: {
  type: string;
  maxTurns: number;
  turnCount: number;
}): ConversationMessage {
  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: options.type,
      maxTurns: options.maxTurns,
      turnCount: options.turnCount,
    },
  } as ConversationMessage;
}

/**
 * Create system message.
 * Original: hO in chunks.134.mjs
 */
export function createSystemMessage(
  content: string,
  level: 'info' | 'warning' | 'error'
): ConversationMessage {
  return {
    type: 'system',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    content,
    level,
  } as ConversationMessage;
}

/**
 * Create tool result messages for error case.
 * Original: DM0 in chunks.134.mjs:83-97
 */
export function* createToolErrorResults(
  assistantMessages: ConversationMessage[],
  errorMessage: string
): Generator<ConversationMessage> {
  for (const msg of assistantMessages) {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (!Array.isArray(content)) continue;

    const toolUses = content.filter(
      (block): block is ToolUseBlock => (block as { type: string }).type === 'tool_use'
    );

    for (const toolUse of toolUses) {
      yield createUserMessage({
        content: [
          {
            type: 'tool_result',
            content: errorMessage,
            is_error: true,
            tool_use_id: toolUse.id,
          },
        ],
        sourceToolAssistantUUID: (msg as { uuid: string }).uuid,
      }) as ConversationMessage;
    }
  }
}

/**
 * Create stop hook summary (V19 restoration).
 */
function createStopHookSummary(
  count: number,
  commands: Array<{ command: string; promptText?: string }>,
  errors: string[],
  preventContinuation: boolean,
  stopReason: string,
  hasError: boolean,
  type: string,
  toolUseID: string
): ConversationMessage {
  const content = [
    `Stop hooks executed: ${count}`,
    ...(commands.length > 0 ? [`Commands: ${commands.map((c) => c.command).join(', ')}`] : []),
    ...(errors.length > 0 ? [`Errors: ${errors.join('; ')}`] : []),
    ...(preventContinuation ? [`Prevented continuation: ${stopReason}`] : []),
  ].join('\n');

  return {
    type: 'attachment',
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    attachment: {
      type: 'hook_stopped_continuation',
      message: content,
      hookName: 'Stop',
      toolUseID,
      hookEvent: 'Stop',
    },
  } as ConversationMessage;
}

// ============================================
// Compaction (Placeholders)
// ============================================

/**
 * Micro-compact messages.
 * Original: lc in chunks.134.mjs
 */
async function microCompact(
  messages: ConversationMessage[],
  _options: unknown,
  _context: ToolUseContext
): Promise<{
  messages: ConversationMessage[];
  compactionInfo?: { systemMessage?: ConversationMessage };
}> {
  const result = (await microCompactFeature(messages as any, _options as any, _context as any)) as any;
  if (result?.resultsCleared > 0) {
    return {
      messages: result.messages as any,
      compactionInfo: {
        systemMessage: createUserMessage({
          content: `<system-reminder>Micro-compact cleared ${result.resultsCleared} tool result(s) to reduce context size.</system-reminder>`,
          isMeta: true,
        }) as ConversationMessage,
      },
    };
  }
  return { messages: result.messages as any };
}

/**
 * Auto-compact dispatcher.
 * Original: ys2 in chunks.134.mjs
 */
async function autoCompactDispatcher(
  messages: ConversationMessage[],
  context: ToolUseContext,
  sessionMemoryType?: unknown
): Promise<{
  compactionResult?: {
    boundaryMarker: ConversationMessage;
    summaryMessages: ConversationMessage[];
    attachments: ConversationMessage[];
    hookResults: ConversationMessage[];
    preCompactTokenCount: number;
    postCompactTokenCount: number;
    compactionUsage?: {
      input_tokens: number;
      output_tokens: number;
      cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number;
    };
  };
}> {
  // Adapt ToolUseContext to CompactSessionContext (features/compact expects a superset)
  const compactContext = {
    agentId: context.agentId,
    getAppState: context.getAppState as any,
    setAppState: context.setAppState as any,
    abortController: context.abortController ?? new AbortController(),
    readFileState: context.readFileState as any,
    options: context.options as any,
  };

  const result = await autoCompactDispatcherFeature(messages as any, compactContext as any, sessionMemoryType as any);
  return {
    compactionResult: (result as any).compactionResult,
  };
}

/**
 * Format compaction messages.
 * Original: FHA in chunks.134.mjs
 */
function formatCompactionMessages(
  compactionResult: NonNullable<Awaited<ReturnType<typeof autoCompactDispatcher>>['compactionResult']>
): ConversationMessage[] {
  return [
    compactionResult.boundaryMarker as any,
    ...compactionResult.summaryMessages,
    ...((compactionResult as { messagesToKeep?: ConversationMessage[] }).messagesToKeep ?? []),
    ...(compactionResult.attachments as any),
    ...(compactionResult.hookResults as any),
  ];
}

// ============================================
// Tool Execution
// ============================================

/**
 * Normalize tool results to messages.
 * Original: FI in chunks.134.mjs
 */
function normalizeToolResults(
  messages: ConversationMessage[],
  tools: unknown[]
): ConversationMessage[] {
  return normalizeMessagesToAPI(messages, tools as any);
}

/**
 * Group tool calls by concurrency safety.
 * Original: S77 in chunks.134.mjs
 */
function groupToolsByConcurrency(
  toolCalls: ToolUseBlock[],
  context: ToolUseContext
): Array<{ isConcurrencySafe: boolean; blocks: ToolUseBlock[] }> {
  return toolCalls.reduce(
    (groups, block) => {
      const tool = context.options.tools.find((t) => t.name === block.name);
      let isSafe = false;

      // Check concurrency safety (validation + tool property)
      if (tool) {
        const parsed = tool.inputSchema.safeParse(block.input);
        if (parsed.success) {
          isSafe = Boolean(tool.isConcurrencySafe(parsed.data));
        }
      }

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.isConcurrencySafe === isSafe && isSafe) {
        // Coalesce safe blocks
        lastGroup.blocks.push(block);
      } else {
        // Start new group
        groups.push({
          isConcurrencySafe: isSafe,
          blocks: [block],
        });
      }
      return groups;
    },
    [] as Array<{ isConcurrencySafe: boolean; blocks: ToolUseBlock[] }>
  );
}

/**
 * Execute tools in parallel.
 * Original: y77 in chunks.134.mjs
 */
async function* executeParallelBlock(
  blocks: ToolUseBlock[],
  assistantMessages: ConversationMessage[],
  canUseTool: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  context: ToolUseContext
): AsyncGenerator<{ message?: ConversationMessage; newContext?: ToolUseContext }> {
  // Use Promise.all via a streaming generator wrapper (SVA in source) to execute in parallel
  // Here we reconstruct the parallel execution logic manually
  const promises = blocks.map(async (block) => {
    const sourceMessage = assistantMessages.find((msg) => {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (!Array.isArray(content)) return false;
      return content.some(
        (b) => (b as { type: string; id?: string }).type === 'tool_use' && (b as { id: string }).id === block.id
      );
    });

    if (!sourceMessage) return [];

    context.setInProgressToolUseIDs?.((prev) => new Set([...prev, block.id]));
    const results: Array<{ message?: ConversationMessage; newContext?: ToolUseContext }> = [];

    try {
      for await (const result of executeSingleTool(
        block,
        sourceMessage,
        canUseTool as any,
        context
      )) {
        if (result.message) {
          results.push({ message: result.message as ConversationMessage });
        }
        if (result.contextModifier) {
          results.push({
            newContext: {
              ...context, // Note: Parallel context modification is tricky, source handles via reduction later
              ...result.contextModifier.modifyContext(context),
            } as ToolUseContext,
          });
        }
      }
    } finally {
      context.setInProgressToolUseIDs?.((prev) => {
        const next = new Set(prev);
        next.delete(block.id);
        return next;
      });
    }
    return results;
  });

  const allResults = await Promise.all(promises);
  for (const results of allResults) {
    for (const result of results) {
      yield result;
    }
  }
}

/**
 * Execute tools sequentially (internal helper).
 * Original: x77 in chunks.134.mjs
 */
async function* executeSequentialBlock(
  blocks: ToolUseBlock[],
  assistantMessages: ConversationMessage[],
  canUseTool: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  context: ToolUseContext
): AsyncGenerator<{ message?: ConversationMessage; newContext?: ToolUseContext }> {
  let currentContext = context;
  for (const block of blocks) {
    const sourceMessage = assistantMessages.find((msg) => {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (!Array.isArray(content)) return false;
      return content.some(
        (b) => (b as { type: string; id?: string }).type === 'tool_use' && (b as { id: string }).id === block.id
      );
    });

    if (!sourceMessage) continue;

    currentContext.setInProgressToolUseIDs?.((prev) => new Set([...prev, block.id]));
    try {
      for await (const result of executeSingleTool(
        block,
        sourceMessage,
        canUseTool as any,
        currentContext
      )) {
        if (result.message) {
          yield { message: result.message as ConversationMessage };
        }
        if (result.contextModifier) {
          currentContext = result.contextModifier.modifyContext(currentContext);
          yield { newContext: currentContext };
        }
      }
    } finally {
      currentContext.setInProgressToolUseIDs?.((prev) => {
        const next = new Set(prev);
        next.delete(block.id);
        return next;
      });
    }
  }
}

/**
 * Execute tools with concurrency support.
 * Replaces executeToolsSequentially.
 * Original: KM0 in chunks.134.mjs
 */
async function* executeToolQueue(
  toolCalls: ToolUseBlock[],
  assistantMessages: ConversationMessage[],
  canUseTool: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  toolUseContext: ToolUseContext
): AsyncGenerator<{
  message?: ConversationMessage;
  newContext?: ToolUseContext;
}> {
  let currentContext = toolUseContext;
  const groups = groupToolsByConcurrency(toolCalls, currentContext);

  for (const group of groups) {
    if (group.isConcurrencySafe) {
      // Execute in parallel
      const contextModifiers: Array<(ctx: ToolUseContext) => ToolUseContext> = [];
      const toolIdToModifiers: Record<string, typeof contextModifiers> = {};

      for await (const result of executeParallelBlock(
        group.blocks,
        assistantMessages,
        canUseTool,
        currentContext
      )) {
        if (result.newContext) {
          // In source (y77), context modifiers are collected and applied after block
          // But here we yield them as they come. For strict source alignment, we should buffer.
          // Since executeParallelBlock above simulates parallel exec but yields sequentially,
          // we can just yield the message and update context at end of block.
          // But wait, executeParallelBlock implementation above is simplified.
          // Let's stick to yielding messages.
        }
        yield { message: result.message, newContext: result.newContext };
        if (result.newContext) currentContext = result.newContext;
      }
    } else {
      // Execute sequentially
      for await (const result of executeSequentialBlock(
        group.blocks,
        assistantMessages,
        canUseTool,
        currentContext
      )) {
        yield result;
        if (result.newContext) currentContext = result.newContext;
      }
    }
  }
}

// ============================================
// API Streaming
// ============================================

/**
 * Model fallback error.
 * Original: y51 in chunks.134.mjs
 */
export class ModelFallbackError extends Error {
  constructor(
    public originalModel: string,
    public fallbackModel: string
  ) {
    super(`Model fallback from ${originalModel} to ${fallbackModel}`);
    this.name = 'ModelFallbackError';
  }
}

/**
 * Invalid request error.
 */
class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequestError';
  }
}

/**
 * Server error.
 */
class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

/**
 * Stream API response.
 * Original: oHA in chunks.134.mjs
 *
 * Integrates with the LLM API streaming module to get responses from Claude.
 */
async function* streamApiResponse(options: {
  messages: ConversationMessage[];
  systemPrompt: string;
  maxThinkingTokens?: number;
  tools: unknown[];
  signal?: AbortSignal;
  options: {
    getToolPermissionContext: () => Promise<unknown>;
    model: string;
    toolChoice?: unknown;
    isNonInteractiveSession?: boolean;
    fallbackModel?: string;
    onStreamingFallback?: () => void;
    querySource?: string;
    agents?: unknown[];
    hasAppendSystemPrompt?: boolean;
    maxOutputTokensOverride?: number;
    fetchOverride?: unknown;
    mcpTools?: unknown[];
    queryTracking: QueryTracking;
    taskIntensityOverride?: unknown;
    agentId?: string;
  };
}): AsyncGenerator<ConversationMessage> {
  // In the bundled runtime, tools are provided to the API as JSON-schema tool definitions.
  // The reconstruction keeps internal ToolDefinitions in `options.tools`, so we convert them here.
  function zodToJsonSchema(schema: any): { type: 'object'; properties: Record<string, unknown>; required?: string[] } {
    // Best-effort conversion (covers common Zod constructs used by tool inputs).
    const fallback = { type: 'object' as const, properties: {} as Record<string, unknown> };
    if (!schema || typeof schema !== 'object') return fallback;

    const def = (schema as any)._def;
    const typeName = def?.typeName;

    // Unwrap optional/nullable/default/effects
    const unwrap = (s: any): { schema: any; optional: boolean } => {
      let cur = s;
      let optional = false;
      while (cur && cur._def) {
        const tn = cur._def.typeName;
        if (tn === 'ZodOptional' || tn === 'ZodNullable' || tn === 'ZodDefault') {
          optional = true;
          cur = cur._def.innerType;
          continue;
        }
        if (tn === 'ZodEffects') {
          cur = cur._def.schema;
          continue;
        }
        break;
      }
      return { schema: cur, optional };
    };

    const toSchema = (s: any): any => {
      const unwrapped = unwrap(s);
      const cur = unwrapped.schema;
      const d = cur?._def;
      const tn = d?.typeName;

      switch (tn) {
        case 'ZodString':
          return { type: 'string' };
        case 'ZodNumber':
          return { type: 'number' };
        case 'ZodBoolean':
          return { type: 'boolean' };
        case 'ZodEnum':
          return { type: 'string', enum: d?.values ?? [] };
        case 'ZodLiteral':
          return { const: d?.value };
        case 'ZodArray':
          return { type: 'array', items: toSchema(d?.type) };
        case 'ZodUnion':
          return { anyOf: (d?.options ?? []).map((o: any) => toSchema(o)) };
        case 'ZodObject': {
          const shape = typeof d?.shape === 'function' ? d.shape() : d?.shape;
          const properties: Record<string, unknown> = {};
          const required: string[] = [];
          if (shape && typeof shape === 'object') {
            for (const [k, v] of Object.entries(shape)) {
              const inner = unwrap(v);
              properties[k] = toSchema(inner.schema);
              if (!inner.optional) required.push(k);
            }
          }
          const out: any = { type: 'object', properties };
          if (required.length > 0) out.required = required;
          return out;
        }
        default:
          return {};
      }
    };

    const base = toSchema(schema);
    // Ensure object root for Anthropic tool schema
    if (base && base.type === 'object') return base;
    return fallback;
  }

  const apiTools = (await Promise.all(
    (options.tools as any[]).map(async (t) => {
      const name = String(t?.name ?? 'unknown');
      const description = typeof t?.description === 'function' ? await t.description() : String(t?.description ?? '');
      const input_schema = t?.inputSchema ? zodToJsonSchema(t.inputSchema) : ({ type: 'object', properties: {} } as const);
      return { name, description, input_schema };
    })
  )) as any;

  // Build request payload for the API
  const request = {
    model: options.options.model,
    messages: options.messages.map((msg) => {
      // Convert to API message format
      if (msg.type === 'user') {
        return {
          role: 'user' as const,
          content: (msg as { message?: { content?: unknown } }).message?.content || '',
        };
      } else if (msg.type === 'assistant') {
        return {
          role: 'assistant' as const,
          content: (msg as { message?: { content?: unknown[] } }).message?.content || [],
        };
      }
      return null;
    }).filter(Boolean) as Array<{ role: 'user' | 'assistant'; content: unknown }>,
    system: options.systemPrompt,
    max_tokens: options.options.maxOutputTokensOverride || 8192,
    tools: apiTools,
    thinking: options.maxThinkingTokens
      ? { type: 'enabled', budget_tokens: options.maxThinkingTokens }
      : undefined,
  } as any;

  // Inject cache control (Prompt Caching)
  // 1. Cache Tools (last tool)
  if (request.tools && request.tools.length > 0) {
    request.tools[request.tools.length - 1].cache_control = { type: 'ephemeral' };
  }

  // 2. Cache Messages (last user message)
  // Find last user message
  for (let i = request.messages.length - 1; i >= 0; i--) {
    if (request.messages[i].role === 'user') {
      const msg = request.messages[i];
      if (typeof msg.content === 'string') {
        msg.content = [
          { type: 'text', text: msg.content, cache_control: { type: 'ephemeral' } }
        ];
      } else if (Array.isArray(msg.content) && msg.content.length > 0) {
        // Add cache_control to the last block of the user message
        const lastBlock = msg.content[msg.content.length - 1];
        if (typeof lastBlock === 'object') {
          (lastBlock as any).cache_control = { type: 'ephemeral' };
        }
      }
      break; // Only cache the last user message
    }
  }

  // Stream options
  const streamOptions: StreamApiCallOptions = {
    model: options.options.model,
    fallbackModel: options.options.fallbackModel,
    maxThinkingTokens: options.maxThinkingTokens,
    tools: apiTools as any,
    agentId: options.options.agentId,
    signal: options.signal,
    onStreamingFallback: options.options.onStreamingFallback,
    fetchOverride: options.options.fetchOverride as typeof fetch | undefined,
  };

  try {
    // Use the real streaming API
    for await (const result of streamApiCall(request as any, streamOptions)) {
      if (result.type === 'assistant') {
        // Convert streaming result to ConversationMessage format
        const message: ConversationMessage = {
          type: 'assistant',
          uuid: result.message.uuid || generateUUID(),
          timestamp: new Date().toISOString(),
          message: {
            role: 'assistant',
            content: result.message.content,
          },
        } as ConversationMessage;

        yield message;
      } else if (result.type === 'stream_event') {
        // Could yield stream events for UI if needed
        // For now, we only yield complete assistant messages
      } else if (result.type === 'api_error') {
        // Handle API errors
        const errorMessage: ConversationMessage = {
          type: 'attachment',
          uuid: generateUUID(),
          timestamp: new Date().toISOString(),
          attachment: {
            type: 'error',
            content: result.error.message,
            apiError: result.error.type,
          },
        } as ConversationMessage;

        yield errorMessage;
      } else if (result.type === 'retry') {
        // Log retry attempts
        logTelemetry('tengu_api_retry', {
          attempt: result.attempt,
          maxAttempts: result.maxAttempts,
          delayMs: result.delayMs,
        });
      }
    }
  } catch (error) {
    // Convert errors to appropriate types
    if (error instanceof Error) {
      if (error.message.includes('fallback')) {
        throw new ModelFallbackError(options.options.model, options.options.fallbackModel || '');
      }
      if (error.message.includes('invalid_request')) {
        throw new InvalidRequestError(error.message);
      }
      if (error.message.includes('server')) {
        throw new ServerError(error.message);
      }
    }
    throw error;
  }
}

// ============================================
// Attachments Processing
// ============================================

/**
 * Process pending attachments.
 * Original: VHA in chunks.134.mjs
 */
async function* processPendingAttachments(
  _hookResult: unknown,
  _context: ToolUseContext,
  _subAgentResult: unknown,
  _queuedCommands: unknown[],
  _messages: ConversationMessage[],
  _querySource?: string,
  _turnIndex: number = 0
): AsyncGenerator<ConversationMessage> {
  // Source alignment: generateAllAttachments() runs once per turn and yields
  // a stream of attachment messages (todo, plan mode, task status, etc.).
  // The reconstructed attachments module is best-effort but keeps the same surface.
  const ctx = _context;

  const getAttachmentAppState = async () => {
    const s: any = await ctx.getAppState();
    const mode = s?.toolPermissionContext?.mode;

    // Attachment generators expect `tasks` as a Map (see `@claudecode/features/attachments`).
    // Core app state stores tasks as a plain object keyed by taskId.
    const rawTasks = s?.tasks;
    let tasks: Map<string, unknown> | undefined;
    if (rawTasks instanceof Map) {
      tasks = rawTasks;
    } else if (rawTasks && typeof rawTasks === 'object' && !Array.isArray(rawTasks)) {
      tasks = new Map(Object.entries(rawTasks));
    }

    return {
      toolPermissionContext: {
        mode: mode === 'plan' || mode === 'delegate' ? mode : 'normal',
      },
      teamContext: s?.teamContext,
      todos: s?.todos ?? {},
      tasks,
    };
  };

  const attachmentCtx: any = {
    agentId: ctx.agentId,
    readFileState: ctx.readFileState ?? new Map(),
    abortController: ctx.abortController,
    getAppState: getAttachmentAppState,
    options: {
      agentDefinitions: ctx.options?.agentDefinitions
        ? {
            activeAgents: (ctx.options.agentDefinitions.activeAgents ?? []).map((a: any) => ({
              type: a.agentType ?? a.type ?? 'unknown',
              name: a.agentType ?? a.name ?? 'unknown',
            })),
          }
        : undefined,
      maxBudgetUsd: (ctx.options as any)?.maxBudgetUsd,
      outputStyle: (ctx.options as any)?.outputStyle,
      criticalSystemReminder_EXPERIMENTAL: (ctx as any)?.criticalSystemReminder_EXPERIMENTAL,
    },
  };

  for await (const a of attachmentsModule.generateAttachmentsStreaming(attachmentCtx, _turnIndex)) {
    yield a as ConversationMessage;
  }
}

/**
 * Check if message is a file change attachment.
 * Original: uF1 in chunks.134.mjs
 */
function isFileChangeAttachment(message: ConversationMessage): boolean {
  if (message.type === 'attachment') {
    const attachment = (message as { attachment?: { type?: string } }).attachment;
    return attachment?.type === 'edited_text_file';
  }
  return false;
}

/**
 * Update queued commands.
 * Original: U32 in chunks.134.mjs
 */
function updateQueuedCommands(
  _commands: unknown[],
  _setAppState: (update: (state: unknown) => unknown) => void
): void {
  if (typeof _setAppState !== 'function') return;
  if (!Array.isArray(_commands) || _commands.length === 0) return;
  const toRemove = new Set(_commands);
  _setAppState((state: any) => {
    const current = state?.queuedCommands;
    if (!Array.isArray(current)) return state;
    return {
      ...state,
      queuedCommands: current.filter((c: any) => !toRemove.has(c)),
    };
  });
}

// ============================================
// Response Analysis
// ============================================

/**
 * Check for overly agreeable response.
 * Original: lA9 in chunks.134.mjs
 */
function isOverlyAgreeable(text: string): boolean {
  const agreeablePatterns = [
    /you're absolutely right/i,
    /you're completely correct/i,
    /that's exactly right/i,
  ];
  return agreeablePatterns.some((pattern) => pattern.test(text));
}

/**
 * Record API call info.
 * Original: aA9 in chunks.134.mjs
 */
function recordApiCallInfo(
  _messages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _context?: ToolUseContext,
  _querySource?: string
): void {
  if (!process.env.DEBUG_API_CALL_INFO) return;
  try {
    const last = _messages[_messages.length - 1];
    const lastType = (last as any)?.type;
    console.log('[API_CALL_INFO]', {
      querySource: _querySource,
      lastType,
      messageCount: _messages.length,
      systemPromptSize: _systemPrompt?.length ?? 0,
      hasUserContext: Boolean(_userContext),
      hasSystemContext: Boolean(_systemContext),
      agentId: _context?.agentId,
    });
  } catch {
    // ignore
  }
}

/**
 * Get task intensity override.
 * Original: w3A in chunks.134.mjs
 */
function getTaskIntensityOverride(): unknown {
  const raw = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  if (!raw) return undefined;
  if (raw === 'unset') return undefined;
  const asInt = parseInt(raw, 10);
  if (!Number.isNaN(asInt) && Number.isInteger(asInt)) return asInt;
  if (raw === 'low' || raw === 'medium' || raw === 'high') return raw;
  return undefined;
}

// ============================================
// Post-Turn Processing
// ============================================

/**
 * Check for pending tool calls after turn (Hook Processing).
 * Original: P77 in chunks.134.mjs
 *
 * Handles pre-tool hooks and stop hooks that might interrupt the flow.
 */
async function* checkPendingToolCalls(
  _messages: ConversationMessage[],
  _assistantMessages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _canUseTool?: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  _context?: ToolUseContext,
  _querySource?: string,
  _autoCompactTracking?: AutoCompactTracking,
  _fallbackModel?: string,
  _stopHookActive?: boolean,
  _maxTurns?: number,
  _turnCount?: number
): AsyncGenerator<ConversationMessage> {
  const context = _context!;
  const signal = context.abortController?.signal;
  
  // Execute hooks in REPL looking for "Stop" events
  const hookIterator = executeHooksInREPL({
    hookInput: { hook_event_name: 'Stop' } as any, // Only event type needed for Stop hooks
    toolUseID: '', // No specific tool use ID for loop-level hooks
    matchQuery: undefined,
    signal,
    timeoutMs: 60000,
    toolUseContext: context,
    messages: [..._messages, ..._assistantMessages],
  });

  let lastToolUseID = '';
  let commandCount = 0;
  let commands: Array<{ command: string; promptText?: string }> = [];
  let errors: string[] = [];
  let preventContinuation = false;
  let stopReason = '';
  let hasError = false;
  let injectedMessages: ConversationMessage[] = [];

  for await (const hookYield of hookIterator) {
    if (hookYield.type === 'progress' && hookYield.result) {
      // Handle progress if needed
    }

    if (hookYield.result?.output) {
      // Check for stop event logic (simplified based on P77 analysis)
      // Source iterates over hook results and accumulates stop reasons
    }

    if (hookYield.preventContinuation) {
      preventContinuation = true;
      stopReason = hookYield.stopReason || 'Stop hook prevented continuation';
      yield createStopHookSummary(
        1,
        commands,
        errors,
        preventContinuation,
        stopReason,
        hasError,
        'stop',
        lastToolUseID
      );
    }

    if (signal?.aborted) {
      logTelemetry('tengu_pre_stop_hooks_cancelled', {
        queryChainId: context.queryTracking?.chainId,
      });
      yield createInterruptedAttachment({ toolUse: false });
      return;
    }
  }

  if (preventContinuation) return;

  // If injected messages (e.g. from hooks), recurse
  if (injectedMessages.length > 0) {
    yield* coreMessageLoop({
      messages: [..._messages, ..._assistantMessages, ...injectedMessages],
      systemPrompt: _systemPrompt,
      userContext: _userContext,
      systemContext: _systemContext,
      canUseTool: _canUseTool as any,
      toolUseContext: context,
      autoCompactTracking: _autoCompactTracking,
      fallbackModel: _fallbackModel,
      stopHookActive: true,
      querySource: _querySource,
      maxTurns: _maxTurns,
      turnCount: _turnCount,
    });
  }
}

/**
 * Process continuation triggers (Steering Logic).
 * Original: T77 in chunks.134.mjs
 */
async function* processContinuationTriggers(
  _messages: ConversationMessage[],
  _assistantMessages: ConversationMessage[],
  _systemPrompt: string,
  _userContext?: string,
  _systemContext?: string,
  _canUseTool?: (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
  _context?: ToolUseContext,
  _querySource?: string,
  _autoCompactTracking?: AutoCompactTracking,
  _fallbackModel?: string,
  _maxTurns?: number,
  _turnCount?: number
): AsyncGenerator<ConversationMessage> {
  const context = _context!;
  
  if (context.pendingSteeringAttachments && context.pendingSteeringAttachments.length > 0) {
    const steeringMessages: ConversationMessage[] = [];
    
    for (const attachment of context.pendingSteeringAttachments) {
      const att = (attachment as ConversationMessage).attachment as any;
      if (att && att.type === 'queued_command') {
        const metaMsg = createUserMessage({
          content: att.prompt,
          isMeta: true,
        }) as ConversationMessage;
        steeringMessages.push(metaMsg);
      }
    }

    if (steeringMessages.length > 0) {
      // Clear pending attachments for next turn
      const nextContext = {
        ...context,
        pendingSteeringAttachments: undefined,
      };

      logTelemetry('tengu_steering_attachment_resending', {
        queryChainId: context.queryTracking?.chainId,
        queryDepth: context.queryTracking?.depth,
      });

      yield* coreMessageLoop({
        messages: [..._messages, ..._assistantMessages, ...steeringMessages],
        systemPrompt: _systemPrompt,
        userContext: _userContext,
        systemContext: _systemContext,
        canUseTool: _canUseTool as any,
        toolUseContext: nextContext,
        autoCompactTracking: _autoCompactTracking,
        fallbackModel: _fallbackModel,
        querySource: _querySource,
        maxTurns: _maxTurns,
        turnCount: _turnCount,
      });
    }
  }
}

// ============================================
// Core Message Loop
// ============================================

/**
 * Error message for context limit.
 * Original: Ar in chunks.134.mjs
 */
const CONTEXT_LIMIT_ERROR =
  'Your conversation has exceeded the maximum context window. Please start a new conversation or use /compact to summarize.';

/**
 * Max output token recovery limit.
 * Original: j77 in chunks.134.mjs
 */
const MAX_OUTPUT_TOKEN_RECOVERY = AGENT_LOOP_CONSTANTS.MAX_OUTPUT_TOKEN_RECOVERY;

/**
 * Core message loop generator.
 * Original: aN() in chunks.134.mjs:99-410
 *
 * Handles the main execution cycle:
 * 1. Micro-compaction for token optimization
 * 2. Auto-compaction for context window management
 * 3. API streaming with parallel tool execution
 * 4. Error handling and recovery
 * 5. Recursive continuation for tool results
 *
 * @param options - Loop options
 * @yields Conversation messages and events
 */
export async function* coreMessageLoop(
  options: CoreMessageLoopOptions
): AsyncGenerator<LoopEvent> {
  const {
    messages: inputMessages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext,
    autoCompactTracking: inputAutoCompactTracking,
    fallbackModel,
    stopHookActive,
    querySource,
    maxOutputTokensOverride,
    maxOutputTokensRecoveryCount = 0,
    maxTurns,
    turnCount = 1,
  } = options;

  // 1. Signal stream request start
  yield { type: 'stream_request_start' };

  recordMarker('query_fn_entry');

  // Track query start for main agent
  if (!toolUseContext.agentId) {
    logTelemetry('query_started', {});
  }

  // 2. Setup query tracking
  const queryTracking: QueryTracking = toolUseContext.queryTracking
    ? {
        chainId: toolUseContext.queryTracking.chainId,
        depth: toolUseContext.queryTracking.depth + 1,
      }
    : { chainId: generateUUID(), depth: 0 };

  const queryChainId = queryTracking.chainId;

  // Update context with query tracking
  let updatedContext: ToolUseContext = {
    ...toolUseContext,
    queryTracking,
  };

  // 3. Normalize messages
  let processedMessages = normalizeMessages(inputMessages, toolUseContext.options.tools as any);
  let autoCompactTracking = inputAutoCompactTracking;

  // 4. Micro-compaction
  recordMarker('query_microcompact_start');
  const microCompactResult = await microCompact(processedMessages, undefined, updatedContext);
  processedMessages = microCompactResult.messages;
  if (microCompactResult.compactionInfo?.systemMessage) {
    yield microCompactResult.compactionInfo.systemMessage;
  }
  recordMarker('query_microcompact_end');

  // 5. Auto-compaction
  recordMarker('query_autocompact_start');
  const { compactionResult } = await autoCompactDispatcher(processedMessages, updatedContext, querySource);
  recordMarker('query_autocompact_end');

  if (compactionResult) {
    const {
      preCompactTokenCount,
      postCompactTokenCount,
      compactionUsage,
    } = compactionResult;

    logTelemetry('tengu_auto_compact_succeeded', {
      originalMessageCount: inputMessages.length,
      compactedMessageCount:
        1 +
        compactionResult.summaryMessages.length +
        ((compactionResult as { messagesToKeep?: unknown[] }).messagesToKeep?.length ?? 0) +
        compactionResult.attachments.length +
        compactionResult.hookResults.length,
      preCompactTokenCount,
      postCompactTokenCount,
      compactionInputTokens: compactionUsage?.input_tokens,
      compactionOutputTokens: compactionUsage?.output_tokens,
      compactionCacheReadTokens: compactionUsage?.cache_read_input_tokens ?? 0,
      compactionCacheCreationTokens: compactionUsage?.cache_creation_input_tokens ?? 0,
      compactionTotalTokens: compactionUsage
        ? compactionUsage.input_tokens +
          (compactionUsage.cache_creation_input_tokens ?? 0) +
          (compactionUsage.cache_read_input_tokens ?? 0) +
          compactionUsage.output_tokens
        : 0,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    // Update tracking if first compaction this session
    if (!autoCompactTracking?.compacted) {
      autoCompactTracking = {
        compacted: true,
        turnId: generateUUID(),
        turnCounter: 0,
      };
    }

    const compactedMessages = formatCompactionMessages(compactionResult);
    for (const msg of compactedMessages) {
      yield msg;
    }
    processedMessages = compactedMessages;
  }

  // Update context with processed messages
  updatedContext = {
    ...updatedContext,
    messages: processedMessages,
  };

  // 6. Initialize state
  const assistantMessages: ConversationMessage[] = [];
  const toolResultMessages: ConversationMessage[] = [];

  recordMarker('query_setup_start');

  // Initialize streaming tool executor if feature enabled
  const streamingToolExecutor = isFeatureEnabled('tengu_streaming_tool_execution2')
    ? new StreamingToolExecutor(updatedContext.options.tools, canUseTool, updatedContext)
    : null;

  // Get app state for model resolution
  const appState = await updatedContext.getAppState();
  const permissionMode = appState.toolPermissionContext.mode;

  // Resolve model
  let model = resolveModelWithPermissions({
    permissionMode,
    mainLoopModel: updatedContext.options.mainLoopModel,
    exceeds200kTokens: permissionMode === 'plan' && exceeds200kTokens(processedMessages),
  });

  // Merge system prompt with context
  const finalSystemPrompt = mergeSystemPromptWithContext(systemPrompt, systemContext);

  recordMarker('query_setup_end');

  // 7. Check blocking token limit
  let fetchOverride: unknown = undefined;
  const { isAtBlockingLimit } = checkTokenLimit(estimateTokenCount(processedMessages));
  if (isAtBlockingLimit) {
    yield createErrorAttachment({
      content: CONTEXT_LIMIT_ERROR,
      error: 'invalid_request',
    });
    return;
  }

  // 8. Main API streaming loop
  let shouldRetry = true;
  recordMarker('query_api_loop_start');

  try {
    while (shouldRetry) {
      shouldRetry = false;

      try {
        let didFallback = false;

        recordMarker('query_api_streaming_start');

        for await (const message of streamApiResponse({
          messages: addUserContextToMessages(processedMessages, userContext),
          systemPrompt: finalSystemPrompt,
          maxThinkingTokens: updatedContext.options.maxThinkingTokens,
          tools: updatedContext.options.tools,
          signal: updatedContext.abortController?.signal,
          options: {
            async getToolPermissionContext() {
              return (await updatedContext.getAppState()).toolPermissionContext;
            },
            model,
            toolChoice: undefined,
            isNonInteractiveSession: updatedContext.options.isNonInteractiveSession,
            fallbackModel,
            onStreamingFallback: () => {
              didFallback = true;
            },
            querySource,
            agents: updatedContext.options.agentDefinitions?.activeAgents,
            hasAppendSystemPrompt: !!updatedContext.options.appendSystemPrompt,
            maxOutputTokensOverride,
            fetchOverride,
            mcpTools: Array.isArray(appState.mcp?.tools)
              ? (appState.mcp?.tools as unknown[])
              : undefined,
            queryTracking,
            taskIntensityOverride: getTaskIntensityOverride(),
            agentId: updatedContext.agentId,
          },
        })) {
          // Handle fallback: tombstone previous messages
          if (didFallback) {
            for (const msg of assistantMessages) {
              yield { type: 'tombstone', message: msg };
            }

            logTelemetry('tengu_orphaned_messages_tombstoned', {
              orphanedMessageCount: assistantMessages.length,
              queryChainId,
              queryDepth: queryTracking.depth,
            });

            assistantMessages.length = 0;
            toolResultMessages.length = 0;

            if (streamingToolExecutor) {
              streamingToolExecutor.discard();
              // Would recreate streaming executor
            }
          }

          yield message;

          // Track assistant messages
          if (message.type === 'assistant') {
            assistantMessages.push(message);

            // Feed tool uses to streaming executor
            if (streamingToolExecutor) {
              const content = (message as { message?: { content?: unknown[] } }).message?.content;
              if (Array.isArray(content)) {
                const toolUses = content.filter(
                  (block): block is ToolUseBlock =>
                    (block as { type: string }).type === 'tool_use'
                );
                for (const toolUse of toolUses) {
                  streamingToolExecutor.addTool(toolUse, message);
                }
              }
            }
          }

          // Yield completed tool results (parallel execution)
          if (streamingToolExecutor) {
            for (const result of streamingToolExecutor.getCompletedResults()) {
              if (result.message) {
                yield result.message;
                toolResultMessages.push(
                  ...normalizeToolResults([result.message], updatedContext.options.tools).filter(
                    (msg) => msg.type === 'user'
                  )
                );
              }
            }
          }
        }

        recordMarker('query_api_streaming_end');
      } catch (error) {
        // Model fallback on specific errors
        if (error instanceof ModelFallbackError && fallbackModel) {
          model = fallbackModel;
          shouldRetry = true;

          yield* createToolErrorResults(assistantMessages, 'Model fallback triggered');
          assistantMessages.length = 0;

          updatedContext.options.mainLoopModel = fallbackModel;

          logTelemetry('tengu_model_fallback_triggered', {
            original_model: error.originalModel,
            fallback_model: fallbackModel,
            entrypoint: 'cli',
            queryChainId,
            queryDepth: queryTracking.depth,
          });

          yield createSystemMessage(
            `Model fallback triggered: switching from ${error.originalModel} to ${error.fallbackModel}`,
            'info'
          );

          continue;
        }

        throw error;
      }
    }
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)));

    const errorMessage = error instanceof Error ? error.message : String(error);

    logTelemetry('tengu_query_error', {
      assistantMessages: assistantMessages.length,
      toolUses: assistantMessages.flatMap((msg) => {
        const content = (msg as { message?: { content?: unknown[] } }).message?.content;
        if (!Array.isArray(content)) return [];
        return content.filter((block) => (block as { type: string }).type === 'tool_use');
      }).length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    if (error instanceof InvalidRequestError || error instanceof ServerError) {
      yield createErrorAttachment({ content: (error as Error).message });
      return;
    }

    yield* createToolErrorResults(assistantMessages, errorMessage);
    yield createInterruptedAttachment({ toolUse: false });

    logException('Query error', error);
    return;
  }

  // 9. Record API call info
  if (assistantMessages.length > 0) {
    recordApiCallInfo(
      [...processedMessages, ...assistantMessages],
      Array.isArray(systemPrompt) ? systemPrompt.join('\n') : systemPrompt,
      typeof userContext === 'string'
        ? userContext
        : userContext
          ? JSON.stringify(userContext)
          : undefined,
      typeof systemContext === 'string'
        ? systemContext
        : systemContext
          ? JSON.stringify(systemContext)
          : undefined,
      updatedContext,
      querySource
    );
  }

  // Check for overly agreeable responses
  if (
    assistantMessages.some((msg) => {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (!Array.isArray(content)) return false;
      return content.some(
        (block) =>
          (block as { type: string }).type === 'text' &&
          isOverlyAgreeable((block as { text: string }).text)
      );
    })
  ) {
    logTelemetry('tengu_model_response_keyword_detected', {
      is_overly_agreeable: true,
      queryChainId,
      queryDepth: queryTracking.depth,
    });
  }

  // 10. Handle abort
  if (updatedContext.abortController?.signal.aborted) {
    if (streamingToolExecutor) {
      for await (const result of streamingToolExecutor.getRemainingResults()) {
        if (result.message) yield result.message;
      }
    } else {
      yield* createToolErrorResults(assistantMessages, 'Interrupted by user');
    }

    yield createInterruptedAttachment({ toolUse: false });
    return;
  }

  // 11. Check for tool calls
  const toolCalls = assistantMessages.flatMap((msg) => {
    const content = (msg as { message?: { content?: unknown[] } }).message?.content;
    if (!Array.isArray(content)) return [];
    return content.filter(
      (block): block is ToolUseBlock => (block as { type: string }).type === 'tool_use'
    );
  });

  if (!assistantMessages.length || !toolCalls.length) {
    // Check for max_output_tokens recovery
    const lastMessage = assistantMessages[assistantMessages.length - 1];
    if (
      lastMessage &&
      (lastMessage as { apiError?: string }).apiError === 'max_output_tokens' &&
      maxOutputTokensRecoveryCount < MAX_OUTPUT_TOKEN_RECOVERY
    ) {
      const recoveryMessage = createUserMessage({
        content:
          'Your response was cut off because it exceeded the output token limit. Please break your work into smaller pieces. Continue from where you left off.',
        isMeta: true,
      }) as ConversationMessage;

      yield* coreMessageLoop({
        ...options,
        messages: [...processedMessages, ...assistantMessages, recoveryMessage],
        maxOutputTokensRecoveryCount: maxOutputTokensRecoveryCount + 1,
      });
      return;
    }

    // Check for pending tool calls and continuation triggers
    yield* checkPendingToolCalls(
      processedMessages,
      assistantMessages,
      Array.isArray(systemPrompt) ? systemPrompt.join('\n') : systemPrompt,
      typeof userContext === 'string'
        ? userContext
        : userContext
          ? JSON.stringify(userContext)
          : undefined,
      typeof systemContext === 'string'
        ? systemContext
        : systemContext
          ? JSON.stringify(systemContext)
          : undefined,
      canUseTool as any,
      updatedContext,
      querySource,
      autoCompactTracking,
      fallbackModel,
      stopHookActive,
      maxTurns,
      turnCount
    );

    yield* processContinuationTriggers(
      processedMessages,
      assistantMessages,
      Array.isArray(systemPrompt) ? systemPrompt.join('\n') : systemPrompt,
      typeof userContext === 'string'
        ? userContext
        : userContext
          ? JSON.stringify(userContext)
          : undefined,
      typeof systemContext === 'string'
        ? systemContext
        : systemContext
          ? JSON.stringify(systemContext)
          : undefined,
      canUseTool as any,
      updatedContext,
      querySource,
      autoCompactTracking,
      fallbackModel,
      maxTurns,
      turnCount
    );

    return;
  }

  // 12. Execute remaining tools
  let hookStopped = false;
  let contextAfterTools = updatedContext;

  recordMarker('query_tool_execution_start');

  if (streamingToolExecutor) {
    logTelemetry('tengu_streaming_tool_execution_used', {
      tool_count: toolCalls.length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    for await (const result of streamingToolExecutor.getRemainingResults()) {
      const msg = result.message;
      if (!msg) continue;

      yield msg;

      // Check for hook stop
      if (
        msg.type === 'attachment' &&
        (msg as { attachment?: { type?: string } }).attachment?.type === 'hook_stopped_continuation'
      ) {
        hookStopped = true;
      }

      toolResultMessages.push(
        ...normalizeToolResults([msg], updatedContext.options.tools).filter(
          (m) => m.type === 'user'
        )
      );
    }

    contextAfterTools = {
      ...streamingToolExecutor.getUpdatedContext(),
      queryTracking,
    };
  } else {
    logTelemetry('tengu_streaming_tool_execution_not_used', {
      tool_count: toolCalls.length,
      queryChainId,
      queryDepth: queryTracking.depth,
    });

    for await (const result of executeToolQueue(
      toolCalls,
      assistantMessages,
      canUseTool as any,
      updatedContext
    )) {
      if (result.message) {
        yield result.message;

        if (
          result.message.type === 'attachment' &&
          (result.message as { attachment?: { type?: string } }).attachment?.type ===
            'hook_stopped_continuation'
        ) {
          hookStopped = true;
        }

        toolResultMessages.push(
          ...normalizeToolResults([result.message], updatedContext.options.tools).filter(
            (m) => m.type === 'user'
          )
        );
      }

      if (result.newContext) {
        contextAfterTools = {
          ...result.newContext,
          queryTracking,
        };
      }
    }
  }

  recordMarker('query_tool_execution_end');

  // 13. Handle abort after tool execution
  if (updatedContext.abortController?.signal.aborted) {
    yield createInterruptedAttachment({ toolUse: true });

    const nextTurn = turnCount + 1;
    if (maxTurns && nextTurn > maxTurns) {
      yield createMaxTurnsAttachment({
        type: 'max_turns_reached',
        maxTurns,
        turnCount: nextTurn,
      });
    }
    return;
  }

  // 14. Check for hook stop
  if (hookStopped) return;

  // 15. Update auto-compact tracking
  if (autoCompactTracking?.compacted) {
    autoCompactTracking.turnCounter++;

    logTelemetry('tengu_post_autocompact_turn', {
      turnId: autoCompactTracking.turnId,
      turnCounter: autoCompactTracking.turnCounter,
      queryChainId,
      queryDepth: queryTracking.depth,
    });
  }

  // 16. Process queued commands and attachments
  const queuedCommands = [
    ...(((await contextAfterTools.getAppState()).queuedCommands ?? []) as unknown[]),
  ];
  const fileChangeAttachments: ConversationMessage[] = [];
  const steeringAttachments: unknown[] = [];

  logTelemetry('tengu_query_before_attachments', {
    messagesForQueryCount: processedMessages.length,
    assistantMessagesCount: assistantMessages.length,
    toolResultsCount: toolResultMessages.length,
    queryChainId,
    queryDepth: queryTracking.depth,
  });

  for await (const attachment of processPendingAttachments(
    null,
    contextAfterTools,
    null,
    queuedCommands,
    [...processedMessages, ...assistantMessages, ...toolResultMessages],
    querySource,
    turnCount
  )) {
    yield attachment;
    toolResultMessages.push(attachment);

    if (isFileChangeAttachment(attachment)) {
      fileChangeAttachments.push(attachment);
    }
    
    // Collect specific attachments for steering (uF1 in source)
    if (attachment.type === 'attachment' && (attachment.attachment as any)?.type === 'queued_command') {
      steeringAttachments.push(attachment);
    }
  }

  const fileChangeCount = toolResultMessages.filter(
    (msg) => msg.type === 'attachment' && (msg as { attachment?: { type?: string } }).attachment?.type === 'edited_text_file'
  ).length;

  logTelemetry('tengu_query_after_attachments', {
    totalToolResultsCount: toolResultMessages.length,
    fileChangeAttachmentCount: fileChangeCount,
    queryChainId,
    queryDepth: queryTracking.depth,
  });

  // Process prompt commands
  const promptCommands = queuedCommands.filter(
    (cmd) => (cmd as { mode?: string }).mode === 'prompt'
  );
  updateQueuedCommands(promptCommands, contextAfterTools.setAppState as any);

  const nextContext = {
    ...contextAfterTools,
    pendingSteeringAttachments: steeringAttachments.length > 0 ? steeringAttachments : undefined,
    queryTracking,
  };

  // 17. Check max turns limit
  const nextTurn = turnCount + 1;
  if (maxTurns && nextTurn > maxTurns) {
    yield createMaxTurnsAttachment({
      type: 'max_turns_reached',
      maxTurns,
      turnCount: nextTurn,
      });
    return;
  }

  recordMarker('query_recursive_call');

  // 18. Recursive call for next turn
  yield* coreMessageLoop({
    messages: [...processedMessages, ...assistantMessages, ...toolResultMessages],
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext: nextContext,
    autoCompactTracking,
    fallbackModel,
    stopHookActive,
    querySource,
    maxTurns,
    turnCount: nextTurn,
  });
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出。
