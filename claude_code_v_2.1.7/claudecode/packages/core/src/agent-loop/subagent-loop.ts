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

import { generateUUID } from '@claudecode/shared';
import { createUserMessage } from '../message/factory.js';
import type { ConversationMessage } from '../message/types.js';
import type { ToolDefinition, ToolUseContext } from '../tools/types.js';
import { coreMessageLoop } from './core-message-loop.js';
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
  // Check agent definition model
  if (agentModel) {
    return agentModel;
  }

  // Check main loop model
  if (mainLoopModel) {
    return mainLoopModel;
  }

  // Check override
  if (modelOverride) {
    return modelOverride;
  }

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
    tools = tools.filter((t) => allowedTools.has(t.name));
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
    getAppState: () => Promise<unknown>;
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
  // Inherit parent MCP clients
  const clients = [...parentMcpClients];
  const tools: ToolDefinition[] = [];

  // Add agent-specific MCP clients if defined
  if (agentDefinition.mcpServers) {
    // Would connect to additional MCP servers here
    logDebug(`Agent has ${agentDefinition.mcpServers.length} MCP servers defined`);
  }

  const cleanup = async () => {
    // Would cleanup agent-specific MCP connections
  };

  return { clients, tools, cleanup };
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

  if (skills.length === 0) {
    return skillMessages;
  }

  // Would integrate with skill loading system
  for (const skillName of skills) {
    logDebug(`Loading skill '${skillName}' for agent '${agentDefinition.agentType}'`);

    // Placeholder - would load skill and get prompt
    const skillMessage = createUserMessage({
      content: [
        {
          type: 'text',
          text: `<skill name="${skillName}">\nSkill loaded (placeholder)\n</skill>`,
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
  hooks: unknown[],
  source: string,
  isSession: boolean
): void {
  logDebug(`Registering ${hooks.length} hooks for ${source}`);
  // Would integrate with hook registration system
}

/**
 * Unregister agent hooks.
 * Original: wVA in chunks.112.mjs
 */
export function unregisterAgentHooks(setAppState: unknown, agentId: string): void {
  logDebug(`Unregistering hooks for agent ${agentId}`);
  // Would integrate with hook unregistration system
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
  // Placeholder - would write to transcript file
  if (process.env.DEBUG_TRANSCRIPT) {
    console.log(`[Transcript] Recording ${messages.length} messages for agent ${agentId}`);
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
  // Would load user context from various sources
  return '';
}

/**
 * Get system context for agent.
 * Original: OF in chunks.112.mjs
 */
async function getSystemContext(): Promise<string> {
  // Would load system context
  return '';
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
  // Placeholder - would execute SubagentStart hooks
  // These hooks can add additional context to the agent
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
    maxThinkingTokens: toolUseContext.options.maxThinkingTokens,
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
    getAppState,
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
      systemPrompt: Array.isArray(systemPrompt) ? systemPrompt.join('\n') : systemPrompt,
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
            `Agent '${agentDefinition.agentType}' reached max turns limit (${(attachment as { maxTurns: number }).maxTurns})`
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

export {
  runSubagentLoop,
  isYieldableMessage,
  filterForkContextMessages,
  resolveAgentModel,
  resolveAgentTools,
  getAgentSystemPrompt,
  createChildToolUseContext,
  setupMcpClients,
  loadAgentSkills,
  registerAgentHooks,
  unregisterAgentHooks,
};
