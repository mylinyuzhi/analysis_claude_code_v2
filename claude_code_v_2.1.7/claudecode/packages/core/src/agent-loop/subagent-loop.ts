/**
 * @claudecode/core - Sub-Agent Loop
 *
 * Main agent loop generator that sets up execution context and delegates to core message loop.
 * Reconstructed from chunks.112.mjs:2913-3057
 *
 * Key symbols:
 * - $f → runSubagentLoop
 * - tb5 → isYieldableMessage
 * - vz0 → filterForkContextMessages
 * - eb5 → getAgentSystemPrompt
 * - lkA → createChildToolUseContext
 * - sb5 → setupMcpClients
 * - ur → resolveAgentTools
 * - YA1 → resolveAgentModel
 */

import { appendJsonlEntry, generateUUID, getProjectDir, getSessionId, type SessionLogEntry } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ConversationMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext } from '../tools/types.js';
import { coreMessageLoop } from './core-message-loop.js';
import {
  getSkillsCached as getSkillsCachedFromFeatures,
  injectArguments as injectSkillArguments,
  addSessionHook,
  clearSessionHooks,
  executeSubagentStartHooks as executeSubagentStartHooksFromFeatures,
  parseHookOutput,
  shouldSuppressOutput,
  extractTextFromOutput,
  type HookEventType,
  HOOK_EVENT_TYPES,
} from '@claudecode/features';
import { userInfo, homedir, hostname, platform as osPlatform, release as osRelease, type as osType } from 'os';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type {
  SubagentLoopOptions,
  AgentDefinition,
  CanUseTool,
  LoopEvent,
} from './types.js';

// ============================================
// Telemetry
// ============================================

function trackFeatureUsage(feature: string): void {
  if (process.env.DEBUG_TELEMETRY) {
    console.log(`[Telemetry] Feature used: ${feature}`);
  }
}

function logDebug(message: string): void {
  if (process.env.CLAUDE_DEBUG) {
    console.log(`[SubagentLoop] ${message}`);
  }
}

// ============================================
// Thinking Tokens
// ============================================

const ULTRATHINK_TOKENS = 31_999;
const ULTRATHINK_REGEX = /\bultrathink\b/i;

function getUserMessageTextContent(message: ConversationMessage): string {
  if (message.type !== 'user') return '';

  const content = (message as { message?: { content?: unknown } }).message?.content;
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((b) => ((b as { type?: string; text?: unknown }).type === 'text' ? String((b as any).text ?? '') : ''))
    .join('');
}

function extractThinkingTokensFromUserMessage(message: ConversationMessage): number {
  if (message.type !== 'user') return 0;
  if ((message as { isMeta?: boolean }).isMeta) return 0;

  const thinkingMetadata = (message as { thinkingMetadata?: unknown }).thinkingMetadata as
    | { level?: unknown; disabled?: unknown }
    | undefined;

  // Prefer explicit thinking metadata (matches source qz8)
  if (thinkingMetadata && typeof thinkingMetadata === 'object') {
    if (thinkingMetadata.disabled === true) return 0;
    if (thinkingMetadata.level === 'high') return ULTRATHINK_TOKENS;
    return 0;
  }

  // Fallback to keyword detection in message text content
  const text = getUserMessageTextContent(message);
  return ULTRATHINK_REGEX.test(text) ? ULTRATHINK_TOKENS : 0;
}

function calculateMaxThinkingTokensFromConversation(
  messages: ConversationMessage[],
  defaultTokens?: number
): number {
  const env = process.env.MAX_THINKING_TOKENS;
  if (env) {
    const budget = parseInt(env, 10);
    // Source: if NaN, Math.max(...) path would have been taken; here we just return NaN -> 0.
    if (Number.isFinite(budget)) return budget;
  }

  const userTokens: number[] = [];
  for (const m of messages) {
    if (m.type !== 'user') continue;
    if ((m as { isMeta?: boolean }).isMeta) continue;
    userTokens.push(extractThinkingTokensFromUserMessage(m));
  }

  const fallback = defaultTokens ?? 0;
  return userTokens.length > 0 ? Math.max(...userTokens, fallback) : fallback;
}

// ============================================
// Message Filtering
// ============================================

/**
 * Check if message should be yielded from subagent.
 * Original: tb5 in chunks.112.mjs
 */
export function isYieldableMessage(message: ConversationMessage): boolean {
  if (message.type === 'assistant' || message.type === 'user' || message.type === 'progress') {
    return true;
  }
  if (
    message.type === 'system' &&
    (message as { subtype?: string }).subtype === 'compact_boundary'
  ) {
    return true;
  }
  return false;
}

/**
 * Filter fork context messages to remove orphaned tool uses.
 * Original: vz0 in chunks.112.mjs
 *
 * Filters out assistant messages that have tool_use blocks without corresponding
 * tool_result blocks in the context.
 */
export function filterForkContextMessages(
  messages: ConversationMessage[]
): ConversationMessage[] {
  // Collect all tool_result IDs
  const toolResultIds = new Set<string>();

  for (const msg of messages) {
    if (msg.type === 'user') {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (
            (block as { type: string }).type === 'tool_result' &&
            (block as { tool_use_id?: string }).tool_use_id
          ) {
            toolResultIds.add((block as { tool_use_id: string }).tool_use_id);
          }
        }
      }
    }
  }

  // Filter out assistant messages with orphaned tool_use blocks
  return messages.filter((msg) => {
    if (msg.type === 'assistant') {
      const content = (msg as { message?: { content?: unknown[] } }).message?.content;
      if (Array.isArray(content)) {
        const hasOrphanedToolUse = content.some(
          (block) =>
            (block as { type: string }).type === 'tool_use' &&
            (block as { id?: string }).id &&
            !toolResultIds.has((block as { id: string }).id)
        );
        return !hasOrphanedToolUse;
      }
    }
    return true;
  });
}

// ============================================
// Model Resolution
// ============================================

/**
 * Resolve agent model based on priority chain.
 * Original: YA1 in chunks.112.mjs
 *
 * Priority: agentModel → mainLoopModel → modelOverride → default for permission mode
 */
export function resolveAgentModel(
  agentModel: string | undefined,
  mainLoopModel: string | undefined,
  modelOverride: string | undefined,
  permissionMode: string
): string {
  // NOTE: bundled runtime supports `model: "inherit"` for some agents.
  // Treat it as "use parent/main loop model".
  if (agentModel && agentModel !== 'inherit') {
    return agentModel;
  }

  // Priority: main loop model → override
  if (mainLoopModel) return mainLoopModel;
  if (modelOverride) return modelOverride;

  // Default based on permission mode
  if (permissionMode === 'plan') {
    return 'claude-sonnet-4-20250514';
  }

  return 'claude-sonnet-4-20250514';
}

// ============================================
// Tool Resolution
// ============================================

/**
 * Resolve tools for agent.
 * Original: ur in chunks.112.mjs
 */
export function resolveAgentTools(
  agentDefinition: AgentDefinition,
  parentTools: ToolDefinition[],
  isAsync: boolean
): { resolvedTools: ToolDefinition[] } {
  // Start with parent tools
  let tools = [...parentTools];

  // Filter based on agent definition
  if (agentDefinition.tools) {
    const allowedTools = new Set(agentDefinition.tools);
    // "*" means allow all tools (subject to disallowed tools below)
    if (!allowedTools.has('*')) {
      tools = tools.filter((t) => allowedTools.has(t.name));
    }
  }

  // Apply disallowed tools
  if (agentDefinition.disallowedTools && agentDefinition.disallowedTools.length > 0) {
    const disallowed = new Set(agentDefinition.disallowedTools);
    tools = tools.filter((t) => !disallowed.has(t.name));
  }

  // Filter out certain tools in async mode
  if (isAsync) {
    tools = tools.filter((t) => t.name !== 'AskUserQuestion');
  }

  return { resolvedTools: tools };
}

// ============================================
// System Prompt
// ============================================

/**
 * Get system prompt for agent.
 * Original: eb5 in chunks.112.mjs
 */
export async function getAgentSystemPrompt(
  agentDefinition: AgentDefinition,
  toolUseContext: ToolUseContext,
  model: string,
  additionalWorkingDirs: string[]
): Promise<string[]> {
  try {
    if (agentDefinition.getSystemPrompt) {
      const prompt = agentDefinition.getSystemPrompt({ toolUseContext });
      return Array.isArray(prompt) ? prompt : [prompt];
    }
  } catch {
    // Fall through to default
  }

  // Default prompt
  return [
    'You are a helpful AI assistant. Follow the user\'s instructions carefully.',
  ];
}

// ============================================
// Context Creation
// ============================================

/**
 * Create child tool use context for subagent.
 * Original: lkA in chunks.112.mjs
 */
export function createChildToolUseContext(
  parentContext: ToolUseContext,
  options: {
    options: Partial<ToolUseContext['options']>;
    agentId: string;
    messages: ConversationMessage[];
    readFileState?: Map<string, unknown>;
    abortController?: AbortController;
    getAppState: ToolUseContext['getAppState'];
    shareSetAppState?: boolean;
    shareSetResponseLength?: boolean;
    criticalSystemReminder_EXPERIMENTAL?: string;
  }
): ToolUseContext {
  return {
    ...parentContext,
    options: {
      ...parentContext.options,
      ...options.options,
    } as ToolUseContext['options'],
    agentId: options.agentId,
    messages: options.messages,
    readFileState: options.readFileState ?? new Map(),
    abortController: options.abortController ?? parentContext.abortController,
    getAppState: options.getAppState,
    criticalSystemReminder_EXPERIMENTAL: options.criticalSystemReminder_EXPERIMENTAL,
  };
}

// ============================================
// MCP Client Setup
// ============================================

/**
 * Setup MCP clients for agent.
 * Original: sb5 in chunks.112.mjs
 */
export async function setupMcpClients(
  agentDefinition: AgentDefinition,
  parentMcpClients: unknown[]
): Promise<{
  clients: unknown[];
  tools: ToolDefinition[];
  cleanup: () => Promise<void>;
}> {
  // NOTE: 在该还原版本中，MCP 连接/发现主要由上层（主循环/集成层）管理并注入到 toolUseContext.options。
  // 这里做两件事：
  // 1) 继承父级 MCP clients
  // 2) 若 agentDefinition.mcpServers 提供了“已连接 client / server bundle”，则合并并提供可选 cleanup

  const clients: unknown[] = [...parentMcpClients];
  const tools: ToolDefinition[] = [];

  const addedClients: unknown[] = [];
  const cleanupFns: Array<() => Promise<void>> = [];

  const dedupeByName = (list: unknown[]) => {
    const seen = new Set<string>();
    const out: unknown[] = [];
    for (const item of list) {
      const name = (item as any)?.name;
      if (typeof name === 'string') {
        if (seen.has(name)) continue;
        seen.add(name);
      }
      out.push(item);
    }
    return out;
  };

  if (Array.isArray(agentDefinition.mcpServers) && agentDefinition.mcpServers.length > 0) {
    logDebug(`Agent has ${agentDefinition.mcpServers.length} MCP servers defined`);

    for (const entry of agentDefinition.mcpServers) {
      // 允许多种形态：
      // - 直接是 client（带 name/type/callTool 等）
      // - bundle: { client, tools, cleanup }
      // - bundle: { clients, tools, cleanup }
      const bundle = entry as any;

      if (bundle?.client) {
        addedClients.push(bundle.client);
      } else if (Array.isArray(bundle?.clients)) {
        addedClients.push(...bundle.clients);
      } else if (bundle && typeof bundle === 'object') {
        // 如果看起来像 client，就直接追加
        if (typeof bundle.name === 'string') {
          addedClients.push(bundle);
        }
      }

      if (Array.isArray(bundle?.tools)) {
        tools.push(...(bundle.tools as ToolDefinition[]));
      }

      if (typeof bundle?.cleanup === 'function') {
        cleanupFns.push(async () => {
          await bundle.cleanup();
        });
      } else if (typeof bundle?.close === 'function') {
        cleanupFns.push(async () => {
          await bundle.close();
        });
      }
    }
  }

  clients.push(...addedClients);

  const cleanup = async () => {
    for (const fn of cleanupFns) {
      try {
        await fn();
      } catch (err) {
        logDebug(`MCP cleanup error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  return { clients: dedupeByName(clients), tools, cleanup };
}

// ============================================
// Skill Loading
// ============================================

/**
 * Load and apply skills for agent.
 * Original: skill loading in chunks.112.mjs:2963-3001
 */
export async function loadAgentSkills(
  agentDefinition: AgentDefinition,
  toolUseContext: ToolUseContext
): Promise<ConversationMessage[]> {
  const skillMessages: ConversationMessage[] = [];
  const skills = agentDefinition.skills ?? [];

  if (!Array.isArray(skills) || skills.length === 0) {
    return skillMessages;
  }

  // 使用 @claudecode/features/skills 的 loader，避免在 core 重复实现扫描/解析逻辑。
  // 该 loader 会聚合 managed/user/project/plugin/bundled 等来源。
  const cwd = process.cwd();
  const { skillDirCommands, pluginSkills, bundledSkills } = await getSkillsCachedFromFeatures(
    { cwd },
    // enabledPlugins 当前还原版本通常由插件系统注入；这里保持 undefined。
    undefined
  );

  const all = [
    ...skillDirCommands,
    ...pluginSkills,
    ...bundledSkills,
  ] as Array<{ name: string; content: string; filePath?: string }>;

  const findByName = (name: string) => all.find((s) => s?.name === name);

  for (const rawSkillRef of skills) {
    const ref = String(rawSkillRef ?? '').trim();
    if (!ref) continue;

    // 允许 "skillName arg1 arg2" 这种形式，将剩余部分作为 $ARGUMENTS 注入。
    const [maybeName, ...rest] = ref.split(/\s+/);
    const skillName = (maybeName ?? '').trim();
    if (!skillName) continue;
    const args = rest.length > 0 ? rest.join(' ') : undefined;

    logDebug(`Loading skill '${skillName}' for agent '${agentDefinition.agentType}'`);

    const skill = findByName(skillName);
    if (!skill) {
      const missing = createUserMessage({
        content: [
          {
            type: 'text',
            text: `<skill name="${skillName}">\n[missing skill]\n</skill>`,
          },
        ],
      });
      skillMessages.push(missing as ConversationMessage);
      continue;
    }

    const injected = injectSkillArguments(skill.content, args);
    const skillMessage = createUserMessage({
      content: [
        {
          type: 'text',
          text: `<skill name="${skillName}">\n${injected}\n</skill>`,
        },
      ],
    });

    skillMessages.push(skillMessage as ConversationMessage);
  }

  return skillMessages;
}

// ============================================
// Hook Management
// ============================================

/**
 * Register agent hooks.
 * Original: j52 in chunks.112.mjs
 */
export function registerAgentHooks(
  setAppState: unknown,
  agentId: string,
  hooks: unknown,
  source: string,
  isSession: boolean
): void {
  if (!setAppState || typeof setAppState !== 'function') return;

  // 支持 EventHooksConfig 形态（features/hooks/types.ts），这是 tools/execution.ts 的执行引擎所依赖的。
  // 若 hooks 是 AgentHooks（onStart/onEnd/onError）之类的结构，则忽略。
  if (!hooks || typeof hooks !== 'object') return;

  const hooksObj = hooks as Record<string, unknown>;
  const hookEventTypes = new Set<string>(HOOK_EVENT_TYPES as readonly string[]);

  const registered: Array<{ eventType: HookEventType; matcher: string; hook: unknown }> = [];

  for (const [eventKey, matchers] of Object.entries(hooksObj)) {
    if (!hookEventTypes.has(eventKey)) continue;
    if (!Array.isArray(matchers)) continue;

    const eventType = eventKey as HookEventType;
    for (const m of matchers) {
      const matcher = (m as any)?.matcher;
      const matcherStr = typeof matcher === 'string' ? matcher : '';
      const hookList = (m as any)?.hooks;
      if (!Array.isArray(hookList)) continue;

      for (const hookDef of hookList) {
        try {
          addSessionHook(setAppState as any, agentId, eventType, matcherStr, hookDef as any);
          registered.push({ eventType, matcher: matcherStr, hook: hookDef });
        } catch (err) {
          logDebug(`Failed to register hook for ${eventType} (${source}): ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  }

  logDebug(`Registering ${registered.length} hooks for ${source}`);
}

/**
 * Unregister agent hooks.
 * Original: wVA in chunks.112.mjs
 */
export function unregisterAgentHooks(setAppState: unknown, agentId: string): void {
  if (!setAppState || typeof setAppState !== 'function') return;
  logDebug(`Unregistering hooks for agent ${agentId}`);
  try {
    clearSessionHooks(setAppState as any, agentId);
  } catch (err) {
    logDebug(`Failed to clear hooks for agent ${agentId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ============================================
// Sidechain Transcript
// ============================================

/**
 * Record sidechain transcript.
 * Original: yz0 in chunks.112.mjs
 */
async function recordSidechainTranscript(
  messages: ConversationMessage[],
  agentId: string,
  afterUUID?: string | null
): Promise<void> {
  const cwd = process.cwd();
  const projectDir = getProjectDir(cwd);
  const transcriptPath = join(projectDir, 'subagents', `agent-${agentId}.jsonl`);

  // 初始化 transcript（首行写入 metadata）
  if (!existsSync(transcriptPath)) {
    mkdirSync(dirname(transcriptPath), { recursive: true });
    const metaEntry: SessionLogEntry = {
      type: 'system',
      sessionId: getSessionId(),
      isSidechain: true,
      agentName: agentId,
      content: {
        metadata: {
          agentId,
          cwd,
          createdAt: Date.now(),
          version: 1,
        },
      },
    };
    writeFileSync(transcriptPath, JSON.stringify(metaEntry) + '\n', 'utf-8');
  }

  // afterUUID 过滤：
  // - 若 messages 内包含 afterUUID：仅追加其后消息
  // - 若 messages 只有一条且 uuid === afterUUID：跳过
  let startIdx = 0;
  if (afterUUID) {
    if (messages.length === 1 && (messages[0] as any)?.uuid === afterUUID) {
      return;
    }
    const idx = messages.findIndex((m) => (m as any)?.uuid === afterUUID);
    if (idx >= 0) startIdx = idx + 1;
  }

  const toWrite = messages.slice(startIdx);
  if (toWrite.length === 0) return;

  for (const m of toWrite) {
    if (!m || typeof m !== 'object') continue;

    const entry: SessionLogEntry = {
      type: (m as any).type,
      uuid: (m as any).uuid,
      parentUuid: afterUUID ?? null,
      sessionId: getSessionId(),
      isSidechain: true,
      agentName: agentId,
      // 保留原始结构，便于后续 restore/telemetry 对齐
      content: m,
    };

    await appendJsonlEntry(transcriptPath, entry);
  }

  if (process.env.DEBUG_TRANSCRIPT) {
    console.log(`[Transcript] Recorded ${toWrite.length} messages for agent ${agentId} -> ${transcriptPath}`);
  }
}

// ============================================
// User/System Context
// ============================================

/**
 * Get user context for agent.
 * Original: ZV in chunks.112.mjs
 */
async function getUserContext(): Promise<string> {
  try {
    const u = userInfo();
    const username = u.username || '';
    // 以 Record 序列化的 JSON 形式返回，便于 core-message-loop 统一注入为 <system-reminder>
    return JSON.stringify({
      Username: username,
      HomeDirectory: homedir(),
    });
  } catch {
    return '';
  }
}

/**
 * Get system context for agent.
 * Original: OF in chunks.112.mjs
 */
async function getSystemContext(): Promise<string> {
  try {
    return JSON.stringify({
      Hostname: hostname(),
      Platform: osPlatform(),
      OS: `${osType()} ${osRelease()}`,
      Node: process.version,
      Cwd: process.cwd(),
    });
  } catch {
    return '';
  }
}

// ============================================
// SubagentStart Hooks
// ============================================

/**
 * Execute SubagentStart hooks.
 * Original: kz0 in chunks.112.mjs
 */
async function* executeSubagentStartHooks(
  agentId: string,
  agentType: string,
  signal: AbortSignal
): AsyncGenerator<{ additionalContexts?: string[] }> {
  // 直接复用 @claudecode/features/hooks 的 SubagentStart 触发器。
  // 该触发器会运行匹配的 hooks，并通过 stdout / JSON(systemMessage) 传回可注入上下文。
  for await (const y of executeSubagentStartHooksFromFeatures(agentId, agentType, signal)) {
    if (y?.preventContinuation) {
      throw new Error(y.stopReason || 'SubagentStart hook prevented continuation');
    }

    const r = y?.result;
    if (!r) continue;

    const raw = (r as any).stdout;
    if (typeof raw !== 'string' || raw.trim().length === 0) continue;

    const parsed = parseHookOutput(raw);
    if (parsed.json) {
      if (shouldSuppressOutput(parsed.json)) continue;
      const extracted = extractTextFromOutput(parsed.json);
      if (extracted && extracted.trim().length > 0) {
        yield { additionalContexts: [extracted.trim()] };
        continue;
      }
      // 如果是合法 JSON 但没有可抽取字段，则保留原始输出
      yield { additionalContexts: [raw.trim()] };
      continue;
    }

    // 纯文本输出
    if (parsed.plainText && parsed.plainText.trim().length > 0) {
      yield { additionalContexts: [parsed.plainText.trim()] };
    }
  }
}

// ============================================
// Main Entry Point
// ============================================

/**
 * Run sub-agent loop.
 * Original: $f in chunks.112.mjs:2913-3057
 *
 * Sets up the execution context for a sub-agent and delegates to the core message loop.
 * Handles:
 * 1. Model resolution
 * 2. Fork context filtering
 * 3. User/system context loading
 * 4. Tool resolution
 * 5. Skill loading
 * 6. MCP client setup
 * 7. Hook registration
 * 8. Core message loop execution
 * 9. Cleanup
 *
 * @param options - Subagent loop options
 * @yields Conversation messages and events
 */
export async function* runSubagentLoop(
  options: SubagentLoopOptions
): AsyncGenerator<LoopEvent | ConversationMessage> {
  const {
    agentDefinition,
    promptMessages,
    toolUseContext,
    canUseTool,
    isAsync = false,
    forkContextMessages,
    querySource,
    override,
    model: modelOverride,
    maxTurns,
  } = options;

  // Track feature usage
  trackFeatureUsage('subagents');

  // Get app state and permission mode
  const appState = (await toolUseContext.getAppState()) as {
    toolPermissionContext: {
      mode: string;
      additionalWorkingDirectories: Map<string, unknown>;
    };
  };
  const permissionMode = appState.toolPermissionContext.mode;

  // Resolve model
  const resolvedModel = resolveAgentModel(
    agentDefinition.model,
    toolUseContext.options.mainLoopModel,
    modelOverride,
    permissionMode
  );

  // Generate agent ID
  const agentId = override?.agentId ?? generateUUID();

  // Build initial messages
  const messages: ConversationMessage[] = [
    ...(forkContextMessages ? filterForkContextMessages(forkContextMessages) : []),
    ...promptMessages,
  ];

  // Clone read file state if forking
  const readFileState =
    forkContextMessages !== undefined
      ? new Map(toolUseContext.readFileState)
      : new Map();

  // Get user and system context
  const [userContext, systemContext] = await Promise.all([
    override?.userContext ?? getUserContext(),
    override?.systemContext ?? getSystemContext(),
  ]);

  // Get permission mode override for agent
  const agentPermissionMode = agentDefinition.permissionMode;
  const getAppState = async () => {
    const currentState = (await toolUseContext.getAppState()) as {
      toolPermissionContext: { mode: string; shouldAvoidPermissionPrompts?: boolean };
      queuedCommands: unknown[];
    };
    let toolPermissionContext = currentState.toolPermissionContext;

    // Override permission mode if specified
    if (agentPermissionMode && currentState.toolPermissionContext.mode !== 'bypassPermissions') {
      toolPermissionContext = {
        ...toolPermissionContext,
        mode: agentPermissionMode,
      };
    }

    // Avoid prompts in async mode
    if (isAsync) {
      toolPermissionContext = {
        ...toolPermissionContext,
        shouldAvoidPermissionPrompts: true,
      };
    }

    return {
      ...currentState,
      toolPermissionContext,
      queuedCommands: [],
    };
  };

  // Resolve tools for agent
  const { resolvedTools } = resolveAgentTools(
    agentDefinition,
    toolUseContext.options.tools,
    isAsync
  );

  // Get additional working directories
  const additionalWorkingDirs = Array.from(
    appState.toolPermissionContext.additionalWorkingDirectories.keys()
  );

  // Get system prompt
  const systemPrompt = override?.systemPrompt
    ?? await getAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs);

  // Create abort controller
  const abortController = override?.abortController
    ?? (isAsync ? new AbortController() : toolUseContext.abortController);

  // Execute SubagentStart hooks and collect additional contexts
  const additionalContexts: string[] = [];
  for await (const hookResult of executeSubagentStartHooks(agentId, agentDefinition.agentType, abortController!.signal)) {
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
      additionalContexts.push(...hookResult.additionalContexts);
    }
  }

  // Add hook contexts to messages
  if (additionalContexts.length > 0) {
    const hookContextMessage = {
      type: 'attachment',
      uuid: generateUUID(),
      timestamp: new Date().toISOString(),
      attachment: {
        type: 'hook_additional_context',
        content: additionalContexts,
        hookName: 'SubagentStart',
        hookEvent: 'SubagentStart',
      },
    } as ConversationMessage;
    messages.push(hookContextMessage);
  }

  // Register agent hooks if defined
  if (agentDefinition.hooks) {
    registerAgentHooks(
      toolUseContext.setAppState,
      agentId,
      agentDefinition.hooks,
      `agent '${agentDefinition.agentType}'`,
      true
    );
  }

  // Load skills
  const skillMessages = await loadAgentSkills(agentDefinition, toolUseContext);
  messages.push(...skillMessages);

  // Setup MCP clients
  const { clients: mcpClients, tools: mcpTools, cleanup } = await setupMcpClients(
    agentDefinition,
    toolUseContext.options.mcpClients || []
  );

  // Combine tools
  const allTools = [...resolvedTools, ...mcpTools];

  // Build options for child context
  const childOptions = {
    isNonInteractiveSession: isAsync ? true : toolUseContext.options.isNonInteractiveSession ?? false,
    appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
    tools: allTools,
    commands: [],
    debug: toolUseContext.options.debug,
    verbose: toolUseContext.options.verbose,
    mainLoopModel: resolvedModel,
    // Match source: maxThinkingTokens: Hm(messages)
    maxThinkingTokens: calculateMaxThinkingTokensFromConversation(messages),
    mcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
  };

  // Create child tool use context
  const childContext = createChildToolUseContext(toolUseContext, {
    options: childOptions,
    agentId,
    messages,
    readFileState,
    abortController: abortController ?? undefined,
    getAppState: getAppState as any,
    shareSetAppState: !isAsync,
    shareSetResponseLength: true,
    criticalSystemReminder_EXPERIMENTAL: agentDefinition.criticalSystemReminder_EXPERIMENTAL,
  });

  // Record initial transcript
  await recordSidechainTranscript(messages, agentId).catch((err) =>
    logDebug(`Failed to record sidechain transcript: ${err}`)
  );

  // Track last message UUID for transcript continuity
  let lastUUID: string | null = messages.length > 0 ? (messages[messages.length - 1] as { uuid: string }).uuid : null;

  // Collected messages for yield
  const collectedMessages: ConversationMessage[] = [];

  try {
    // Run core message loop
    for await (const event of coreMessageLoop({
      messages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool: canUseTool as (tool: unknown, input: unknown, msg: ConversationMessage) => Promise<boolean>,
      toolUseContext: childContext,
      querySource,
      maxTurns,
    })) {
      // Handle attachment events
      if ((event as { type: string }).type === 'attachment') {
        const attachment = (event as { attachment: { type: string } }).attachment;
        if (attachment.type === 'max_turns_reached') {
          logDebug(
            `Agent '${agentDefinition.agentType}' reached max turns limit (${(attachment as unknown as { maxTurns: number }).maxTurns})`
          );
          break;
        }
        yield event as ConversationMessage;
        continue;
      }

      // Yield yieldable messages
      if (isYieldableMessage(event as ConversationMessage)) {
        collectedMessages.push(event as ConversationMessage);

        // Record to transcript
        await recordSidechainTranscript([event as ConversationMessage], agentId, lastUUID).catch(
          (err) => logDebug(`Failed to record sidechain transcript: ${err}`)
        );
        lastUUID = (event as { uuid: string }).uuid;

        yield event as ConversationMessage;
      }
    }

    // Check for abort
    if (abortController?.signal.aborted) {
      throw new Error('Agent execution was aborted');
    }

    // Execute callback if agent has one
    if (agentDefinition.callback) {
      agentDefinition.callback();
    }
  } finally {
    // Cleanup MCP connections
    await cleanup();

    // Unregister agent hooks
    if (agentDefinition.hooks) {
      unregisterAgentHooks(toolUseContext.setAppState, agentId);
    }
  }
}

// ============================================
// Export
// ============================================

// NOTE: 函数已在声明处导出；移除重复聚合导出。
