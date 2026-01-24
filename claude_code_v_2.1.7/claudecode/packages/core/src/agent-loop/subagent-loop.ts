/**
 * @claudecode/core - Sub-Agent Loop
 *
 * Main agent loop generator that sets up execution context and delegates to core message loop.
 * Reconstructed from chunks.112.mjs:2913-3057.
 *
 * Key symbols:
 * - $f → runSubagentLoop (chunks.112.mjs:2913)
 * - tb5 → isYieldableMessage (chunks.112.mjs:283)
 * - vz0 → filterForkContextMessages (chunks.112.mjs:251)
 * - eb5 → getAgentSystemPrompt (chunks.112.mjs:352)
 * - lkA → createChildToolUseContext (chunks.112.mjs:267)
 * - sb5 → setupMcpClients (chunks.112.mjs:263)
 * - ur → resolveAgentTools (chunks.92.mjs:3188)
 * - YA1 → resolveAgentModel (chunks.46.mjs:2513)
 */

import { appendJsonlEntry, generateUUID, getProjectDir, getSessionId, generateTaskId, type SessionLogEntry } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import { analyticsEvent } from '@claudecode/platform';
import type { ConversationMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext } from '../tools/types.js';
import { coreMessageLoop, resolveModelWithPermissions } from './core-message-loop.js';
import {
  getSkillsCached as getSkillsCachedFromFeatures,
  addSessionHook,
  clearSessionHooks,
  executeSubagentStartHooks as executeSubagentStartHooksFromFeatures,
  parseHookOutput,
  shouldSuppressOutput,
  extractTextFromOutput,
  type HookEventType,
  HOOK_EVENT_TYPES,
  calculateMaxThinkingTokens,
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
// Message Filtering
// ============================================

/**
 * Check if message should be yielded from subagent.
 * Original: tb5 in chunks.112.mjs:283
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
 * Original: vz0 in chunks.112.mjs:251
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
 * Resolve model ID from alias.
 * Original: FX in chunks.46.mjs:2483
 */
export function resolveModelId(model: string): string {
  const m = model.trim().toLowerCase();
  const is1m = m.endsWith('[1m]');
  const base = is1m ? m.replace(/\[1m\]$/i, '').trim() : m;

  // Source maps sonnet, haiku, opus, opusplan
  switch (base) {
    case 'opusplan':
      // Simplified: return actual model ID
      return 'claude-3-7-sonnet-20250219' + (is1m ? '[1m]' : '');
    case 'sonnet':
      return 'claude-3-7-sonnet-20250219' + (is1m ? '[1m]' : '');
    case 'haiku':
      return 'claude-3-5-haiku-20241022' + (is1m ? '[1m]' : '');
    case 'opus':
      return 'claude-3-opus-20240229';
    default:
      return model;
  }
}

/**
 * Get region from model ID (for Bedrock).
 * Original: jp1 in chunks.46.mjs:1414
 */
function getRegion(modelId: string): string | undefined {
  const regions = ['us', 'eu', 'apac', 'global'];
  for (const r of regions) {
    if (modelId.startsWith(`${r}.anthropic.`)) return r;
  }
  return undefined;
}

/**
 * Resolve Bedrock model ID with region.
 * Original: itQ in chunks.46.mjs:1420
 */
function resolveBedrockModelId(modelId: string, region: string): string {
  const currentRegion = getRegion(modelId);
  if (currentRegion) return modelId.replace(`${currentRegion}.`, `${region}.`);
  if (modelId.startsWith('anthropic.')) return `${region}.${modelId}`;
  return modelId;
}

/**
 * Resolve agent model based on priority chain.
 * Original: YA1 in chunks.46.mjs:2513-2529
 *
 * Priority: agentModel → mainLoopModel → modelOverride → default for permission mode
 */
export function resolveAgentModel(
  agentModel: string | undefined,
  mainLoopModel: string | undefined,
  modelOverride: string | undefined,
  permissionMode: string
): string {
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return process.env.CLAUDE_CODE_SUBAGENT_MODEL;

  const region = mainLoopModel ? getRegion(mainLoopModel) : undefined;
  const isBedrock = process.env.CLAUDE_CODE_USE_BEDROCK === 'true';

  const wrapModel = (m: string) => {
    const resolved = resolveModelId(m);
    if (region && isBedrock) return resolveBedrockModelId(resolved, region);
    return resolved;
  };

  if (modelOverride) return wrapModel(modelOverride);

  const model = agentModel ?? 'inherit';
  if (model === 'inherit') {
    return resolveModelWithPermissions({
      permissionMode: permissionMode || 'default',
      mainLoopModel: mainLoopModel || 'claude-3-7-sonnet-20250219',
    });
  }

  return wrapModel(model);
}

// ============================================
// Tool Resolution
// ============================================

/**
 * Resolve tools for agent.
 * Original: ur in chunks.92.mjs:3188-3233
 */
export function resolveAgentTools(
  agentDefinition: AgentDefinition,
  parentTools: ToolDefinition[],
  isAsync: boolean
): { resolvedTools: ToolDefinition[] } {
  const { tools: allowedToolNames, disallowedTools, source } = agentDefinition;

  // Filter based on system restrictions (VD0)
  let tools = parentTools.filter((t) => {
    if (t.name.startsWith('mcp__')) return true;
    
    // NYA: ALWAYS_EXCLUDED_TOOLS
    const NYA = new Set(['ExitPlanMode', 'EnterPlanMode', 'Task', 'AskUserQuestion']);
    if (NYA.has(t.name)) return false;

    // D52: FORBIDDEN_FOR_NON_BUILTIN
    if (source !== 'built-in' && NYA.has(t.name)) return false;

    // W52: ASYNC_SAFE_TOOLS
    if (isAsync) {
      const W52 = new Set([
        'Read', 'Edit', 'Write', 'TodoWrite', 'Grep', 'WebSearch', 
        'Glob', 'Bash', 'Skill', 'SlashCommand', 'WebFetch', 'KillShell', 'TaskOutput'
      ]);
      if (!W52.has(t.name)) return false;
    }

    return true;
  });

  // Apply agent-specific disallowedTools
  if (disallowedTools && disallowedTools.length > 0) {
    const denied = new Set(disallowedTools);
    tools = tools.filter((t) => !denied.has(t.name));
  }

  // Filter based on allowedTools list
  if (allowedToolNames === undefined || (allowedToolNames.length === 1 && allowedToolNames[0] === '*')) {
    return { resolvedTools: tools };
  }

  const toolMap = new Map(tools.map(t => [t.name, t]));
  const resolved: ToolDefinition[] = [];
  
  for (const name of allowedToolNames) {
    const tool = toolMap.get(name);
    if (tool) {
      if (!resolved.includes(tool)) resolved.push(tool);
    }
  }

  return { resolvedTools: resolved };
}

// ============================================
// System Prompt
// ============================================

/**
 * Get system prompt for agent.
 * Original: eb5 in chunks.112.mjs:352
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
 * Original: lkA in chunks.112.mjs:267
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
 * Original: sb5 in chunks.112.mjs:263
 */
export async function setupMcpClients(
  agentDefinition: AgentDefinition,
  parentMcpClients: unknown[]
): Promise<{
  clients: unknown[];
  tools: ToolDefinition[];
  cleanup: () => Promise<void>;
}> {
  // NOTE: In this reconstructed version, MCP connection/discovery is mainly managed upstream (main loop / integration layer)
  // and injected into toolUseContext.options.
  // Here we do two things:
  // 1) Inherit parent MCP clients
  // 2) If agentDefinition.mcpServers provides "connected client / server bundle", merge it and provide optional cleanup

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
        // If it looks like a client, append it directly
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

  // Use @claudecode/features/skills loader to avoid duplicating scan/parse logic in core.
  // This loader aggregates managed/user/project/plugin/bundled sources.
  const cwd = process.cwd();
  const { skillDirCommands, pluginSkills, bundledSkills } = await getSkillsCachedFromFeatures(
    { cwd },
    // enabledPlugins is usually injected by the plugin system; keep undefined here.
    undefined
  );

  const allPromptCommands = [...skillDirCommands, ...pluginSkills, ...bundledSkills].filter(
    (c) => Boolean(c && (c as any).type === 'prompt' && typeof (c as any).getPromptForCommand === 'function')
  ) as any[];

  const findByName = (name: string) => allPromptCommands.find((s: any) => s?.name === name) as any;

  for (const rawSkillRef of skills) {
    const ref = String(rawSkillRef ?? '').trim();
    if (!ref) continue;

    // Allow "skillName arg1 arg2" format, injecting the rest as $ARGUMENTS.
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

    // Build the prompt text via the prompt-command entrypoint.
    // NOTE: our reconstructed skill prompt commands only need a minimal context.
    const promptBlocks = await (skill as any).getPromptForCommand(args ?? '', {
      options: {
        commands: [],
        isNonInteractiveSession: true,
        tools: [],
        model: undefined,
      },
      messages: [],
      abortController: new AbortController(),
      cwd,
    });

    const injected = Array.isArray(promptBlocks)
      ? promptBlocks
          .filter((b: any) => b && b.type === 'text')
          .map((b: any) => String(b.text ?? ''))
          .join('\n')
      : '';
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
 * Original: j52 in chunks.93.mjs:859-875
 */
export function registerAgentHooks(
  setAppState: unknown,
  agentId: string,
  hooks: unknown,
  source: string,
  isSession: boolean
): void {
  if (!setAppState || typeof setAppState !== 'function') return;

  // Support EventHooksConfig shape (features/hooks/types.ts), relied upon by tools/execution.ts engine.
  // If hooks is AgentHooks (onStart/onEnd/onError), ignore it.
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

      let finalEventType = eventType;
      if (isSession && eventType === 'Stop') {
        finalEventType = 'SubagentStop' as HookEventType;
        logDebug(`Converting Stop hook to SubagentStop for ${source} (subagents trigger SubagentStop)`);
      }

      for (const hookDef of hookList) {
        try {
          addSessionHook(setAppState as any, agentId, finalEventType, matcherStr, hookDef as any);
          registered.push({ eventType: finalEventType, matcher: matcherStr, hook: hookDef });
        } catch (err) {
          logDebug(`Failed to register hook for ${finalEventType} (${source}): ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  }

  logDebug(`Registering ${registered.length} hooks for ${source}`);
}

/**
 * Unregister agent hooks.
 * Original: wVA in chunks.112.mjs:428
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
 * Original: yz0 in chunks.112.mjs:397, 417
 */
async function recordSidechainTranscript(
  messages: ConversationMessage[],
  agentId: string,
  afterUUID?: string | null
): Promise<void> {
  const cwd = process.cwd();
  const projectDir = getProjectDir(cwd);
  const sessionId = getSessionId();
  const transcriptPath = join(projectDir, sessionId, 'subagents', `agent-${agentId}.jsonl`);

  // Initialize transcript (write metadata to first line)
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

  // afterUUID filtering:
  // - If messages contains afterUUID: only append messages after it
  // - If messages has only one item and uuid === afterUUID: skip
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
      // Keep original structure for restore/telemetry alignment
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
    // Return as JSON string serialized Record, for core-message-loop to inject as <system-reminder>
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
 * Original: kz0 in chunks.112.mjs:356
 */
async function* executeSubagentStartHooks(
  agentId: string,
  agentType: string,
  signal: AbortSignal
): AsyncGenerator<{ additionalContexts?: string[] }> {
  // Directly reuse SubagentStart trigger from @claudecode/features/hooks.
  // This trigger runs matching hooks and returns injectable contexts via stdout / JSON(systemMessage).
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
      // If valid JSON but no extractable fields, keep original output
      yield { additionalContexts: [raw.trim()] };
      continue;
    }

    // Plain text output
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

  // T9("subagents");
  trackFeatureUsage('subagents');

  // Get app state and permission mode
  const appState = (await toolUseContext.getAppState()) as {
    toolPermissionContext: {
      mode: string;
      additionalWorkingDirectories: Map<string, unknown>;
    };
  };
  const permissionMode = appState.toolPermissionContext.mode;

  // Resolve model (YA1)
  const resolvedModel = resolveAgentModel(
    agentDefinition.model,
    toolUseContext.options.mainLoopModel,
    modelOverride,
    permissionMode
  );

  // Generate agent ID (LS)
  const agentId = override?.agentId ?? generateTaskId('local_agent');

  // Build initial messages (vz0)
  const messages: ConversationMessage[] = [
    ...(forkContextMessages ? filterForkContextMessages(forkContextMessages) : []),
    ...promptMessages,
  ];

  // Clone read file state (m9A / Id(u9A))
  const readFileState =
    forkContextMessages !== undefined
      ? new Map(toolUseContext.readFileState)
      : new Map();

  // Get user and system context (ZV, OF)
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

  // Resolve tools for agent (ur)
  const { resolvedTools } = resolveAgentTools(
    agentDefinition,
    toolUseContext.options.tools,
    isAsync
  );

  // Get additional working directories
  const additionalWorkingDirs = Array.from(
    appState.toolPermissionContext.additionalWorkingDirectories.keys()
  );

  // Get system prompt (eb5)
  const systemPrompt = override?.systemPrompt
    ?? await getAgentSystemPrompt(agentDefinition, toolUseContext, resolvedModel, additionalWorkingDirs);

  // Create abort controller
  const abortController = override?.abortController
    ?? (isAsync ? new AbortController() : toolUseContext.abortController);

  // Execute SubagentStart hooks (kz0)
  const additionalContexts: string[] = [];
  for await (const hookResult of executeSubagentStartHooks(agentId, agentDefinition.agentType, abortController!.signal)) {
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
      additionalContexts.push(...hookResult.additionalContexts);
    }
  }

  // Add hook contexts to messages (X4)
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

  // Register agent hooks (j52)
  if (agentDefinition.hooks) {
    registerAgentHooks(
      toolUseContext.setAppState,
      agentId,
      agentDefinition.hooks,
      `agent '${agentDefinition.agentType}'`,
      true
    );
  }

  // Load skills (Skill loading in chunks.112.mjs:2963-3001)
  const skillMessages = await loadAgentSkills(agentDefinition, toolUseContext);
  messages.push(...skillMessages);

  // Setup MCP clients (sb5)
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
    // Match source: maxThinkingTokens: Hm(E)
    maxThinkingTokens: calculateMaxThinkingTokens(messages as any, undefined, process.env.MAX_THINKING_TOKENS, undefined, analyticsEvent as any),
    mcpClients,
    mcpResources: toolUseContext.options.mcpResources,
    agentDefinitions: toolUseContext.options.agentDefinitions,
  };

  // Create child tool use context (lkA)
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

  // Record initial transcript (yz0)
  await recordSidechainTranscript(messages, agentId).catch((err) =>
    logDebug(`Failed to record sidechain transcript: ${err}`)
  );

  // Track last message UUID for transcript continuity
  let lastUUID: string | null = messages.length > 0 ? (messages[messages.length - 1] as { uuid: string }).uuid : null;

  try {
    // Run core message loop (aN)
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

      // Yield yieldable messages (tb5)
      if (isYieldableMessage(event as ConversationMessage)) {
        // Record to transcript (yz0)
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

    // Execute callback if agent has one (p_(A))
    if (agentDefinition.callback) {
      agentDefinition.callback();
    }
  } finally {
    // Cleanup MCP connections
    await cleanup();

    // Unregister agent hooks (wVA)
    if (agentDefinition.hooks) {
      unregisterAgentHooks(toolUseContext.setAppState, agentId);
    }
  }
}
