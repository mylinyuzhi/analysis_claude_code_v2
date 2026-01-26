/**
 * @claudecode/sdk - SDK Agent Loop
 *
 * Core agent loop for SDK mode.
 *
 * The SDK loop is a transport/orchestration layer. The core per-prompt execution
 * is implemented as an async generator that mirrors `v19` in `chunks.135.mjs`.
 */

import { AsyncMessageQueue } from './transport/queue.js';
import { 
  canUseToolResponseSchema, 
  hookCallbackResponseSchema 
} from './protocol/messages.js';
import { z } from 'zod';
import { userInfo, homedir, hostname, platform as osPlatform, release as osRelease, type as osType } from 'os';

import { coreMessageLoop } from '@claudecode/core/agent-loop';
import { createUserMessage as createCoreUserMessage } from '@claudecode/core/message';
import {
  getSessionId,
  setCwd,
  isSessionPersistenceDisabled,
  getTotalCostUSD,
  getTotalAPIDuration,
  getModelUsage,
  mergeUsage,
  aggregateUsage,
} from '@claudecode/shared';

type PermissionDenial = {
  tool_name: string;
  tool_use_id: string;
  tool_input: Record<string, unknown>;
};

type PermissionResultLike = {
  behavior: 'allow' | 'deny' | 'ask' | string;
  message?: string;
  updated_input?: Record<string, unknown>;
};

function normalizeContextRecord(value: unknown): Record<string, string> {
  if (!value) return {};
  if (typeof value === 'string') {
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

function addUserContextToMessagesLocal(messages: any[], userContext?: unknown): any[] {
  const ctx = normalizeContextRecord(userContext);
  if (Object.keys(ctx).length === 0) return messages;

  const reminder = `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(ctx)
  .map(([k, v]) => `# ${k}\n${v}`)
  .join('\n')}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`;

  return [createCoreUserMessage({ content: reminder, isMeta: true }) as any, ...messages];
}

function mergeSystemPromptWithContextLocal(systemPrompt: string | string[], systemContext?: unknown): string[] {
  const parts = Array.isArray(systemPrompt) ? systemPrompt : [systemPrompt].filter(Boolean);
  const ctx = normalizeContextRecord(systemContext);
  const ctxLines = Object.entries(ctx)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return [...parts, ctxLines].filter(Boolean);
}

function toPermissionResultLike(value: unknown): PermissionResultLike {
  if (value === true) return { behavior: 'allow' };
  if (value === false) return { behavior: 'deny' };
  if (value && typeof value === 'object') {
    const v = value as any;
    if (typeof v.behavior === 'string') return v as PermissionResultLike;
  }
  return { behavior: 'deny' };
}

function getLastAssistantText(messages: any[]): { text: string; isApiError: boolean } {
  const last = [...messages].reverse().find((m) => m && typeof m === 'object' && m.type === 'assistant');
  if (!last) return { text: '', isApiError: false };
  const blocks = (last as any).message?.content;
  const text = Array.isArray(blocks)
    ? blocks
        .filter((b: any) => b?.type === 'text')
        .map((b: any) => String(b.text ?? ''))
        .join('')
    : '';
  return { text, isApiError: Boolean((last as any).isApiErrorMessage) };
}

async function getUserContext(): Promise<string> {
  try {
    const u = userInfo();
    return JSON.stringify({
      Username: u.username || '',
      HomeDirectory: homedir(),
    });
  } catch {
    return '';
  }
}

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

async function* runSdkPromptTurn(options: {
  commands: any[];
  prompt: string;
  promptUuid: string;
  cwd: string;
  tools: any[];
  mcpClients: any[];
  verbose: boolean;
  maxThinkingTokens?: number;
  maxTurns?: number;
  maxBudgetUsd?: number;
  canUseTool: any;
  mutableMessages: any[];
  customSystemPrompt?: string;
  appendSystemPrompt?: string;
  userSpecifiedModel?: string;
  fallbackModel?: string;
  jsonSchema?: unknown;
  getAppState: () => Promise<any>;
  setAppState: (update: (state: any) => any) => void;
  abortController: AbortController;
  replayUserMessages: boolean;
  includePartialMessages: boolean;
  agents: any[];
  setSDKStatus?: (status: string) => void;
  orphanedPermission?: unknown;
}): AsyncGenerator<any> {
  // Mirror `DO(G)` + `_y/Ob0` in chunks.135: set runtime cwd and global cwd state.
  if (options.cwd && typeof options.cwd === 'string') {
    setCwd(options.cwd);
    try {
      process.chdir(options.cwd);
    } catch {
      // If cwd is invalid, keep process.cwd() but continue; source effectively assumes cwd is valid.
    }
  }

  const persistEnabled = !isSessionPersistenceDisabled();
  const startMs = Date.now();
  const sessionId = getSessionId();

  const permissionDenials: PermissionDenial[] = [];

  const wrappedCanUseTool = async (
    tool: any,
    input: unknown,
    assistantMessage: any
  ): Promise<PermissionResultLike> => {
    const res = toPermissionResultLike(await options.canUseTool(tool, input, assistantMessage));
    if (res.behavior !== 'allow') {
      permissionDenials.push({
        tool_name: String(tool?.name ?? ''),
        tool_use_id: String((assistantMessage as any)?.toolUseId ?? ''),
        tool_input: (input && typeof input === 'object' ? (input as any) : {}) as Record<string, unknown>,
      });
    }
    return res;
  };

  const appState = await options.getAppState();
  const permissionMode = String(appState?.toolPermissionContext?.mode ?? 'default');

  // System prompt assembly mirrors v19's `MA` composition.
  const systemPromptParts: string[] = [];
  if (typeof options.customSystemPrompt === 'string' && options.customSystemPrompt.length > 0) {
    systemPromptParts.push(options.customSystemPrompt);
  }
  if (typeof options.appendSystemPrompt === 'string' && options.appendSystemPrompt.length > 0) {
    systemPromptParts.push(options.appendSystemPrompt);
  }

  // Push user prompt message into mutableMessages (SDK keeps shared mutable history).
  const userMsg = createCoreUserMessage({ content: options.prompt }) as any;
  options.mutableMessages.push(userMsg);

  // Core tool context used by coreMessageLoop.
  const toolUseContext: any = {
    messages: options.mutableMessages,
    setMessages: () => {},
    options: {
      commands: options.commands,
      tools: options.tools,
      verbose: options.verbose,
      debug: false,
      isNonInteractiveSession: true,
      mainLoopModel: options.userSpecifiedModel,
      maxThinkingTokens: options.maxThinkingTokens ?? 0,
      mcpClients: options.mcpClients,
      mcpResources: {},
      customSystemPrompt: options.customSystemPrompt,
      appendSystemPrompt: options.appendSystemPrompt,
      agentDefinitions: {
        activeAgents: options.agents,
        allAgents: [],
      },
      maxBudgetUsd: options.maxBudgetUsd,
    },
    getAppState: options.getAppState,
    setAppState: options.setAppState,
    abortController: options.abortController,
    readFileState: new Map(),
    setInProgressToolUseIDs: () => {},
    setResponseLength: () => {},
    setSDKStatus: options.setSDKStatus,
  };

  // Merge system prompt with system context and inject user context.
  const [userContext, systemContext] = await Promise.all([getUserContext(), getSystemContext()]);
  const mergedSystemPrompt = mergeSystemPromptWithContextLocal(systemPromptParts, systemContext);
  const messagesWithUserContext = addUserContextToMessagesLocal(options.mutableMessages as any, userContext);
  if (messagesWithUserContext !== options.mutableMessages) {
    // Keep mutableMessages in sync for downstream processing.
    options.mutableMessages.length = 0;
    options.mutableMessages.push(...messagesWithUserContext);
  }

  // Emit init once per turn (SDK protocol).
  yield {
    type: 'system',
    subtype: 'init',
    cwd: options.cwd,
    session_id: sessionId,
    tools: options.tools.map((t) => t.name),
    mcp_servers: options.mcpClients.map((c) => ({ name: c.name, status: c.type })),
    model: options.userSpecifiedModel,
    permissionMode,
    slash_commands: options.commands.map((c) => c.name),
    betas: appState?.sdkBetas,
    uuid: crypto.randomUUID(),
  };

  // Usage aggregation mirrors v19's J1/SA merge.
  let aggregated: any = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    server_tool_use: { web_search_requests: 0, web_fetch_requests: 0 },
  };
  let currentStream: any = aggregated;

  // Run core message loop (aN).
  for await (const ev of coreMessageLoop({
    messages: options.mutableMessages as any,
    systemPrompt: mergedSystemPrompt,
    userContext,
    systemContext,
    canUseTool: wrappedCanUseTool as any,
    toolUseContext,
    fallbackModel: options.fallbackModel,
    querySource: 'sdk',
    maxTurns: options.maxTurns,
  })) {
    const e = ev as any;

    // Track usage from stream events.
    if (e?.type === 'stream_event' && e.event) {
      if (e.event.type === 'message_start') {
        currentStream = mergeUsage(aggregated as any, e.event.message.usage as any);
      }
      if (e.event.type === 'message_delta') {
        currentStream = mergeUsage(currentStream as any, e.event.usage as any);
      }
      if (e.event.type === 'message_stop') {
        aggregated = aggregateUsage(aggregated as any, currentStream as any);
      }
      if (options.includePartialMessages) {
        yield {
          type: 'stream_event',
          event: e.event,
          session_id: sessionId,
          parent_tool_use_id: null,
          uuid: crypto.randomUUID(),
        };
      }
      continue;
    }

    // Propagate core events as SDK messages.
    if (e?.type === 'assistant' || e?.type === 'user') {
      yield {
        type: e.type,
        message: e.message,
        session_id: sessionId,
        parent_tool_use_id: null,
        uuid: e.uuid,
        isReplay: Boolean(e.isReplay),
        error: e.error,
        tool_use_result: e.toolUseResult,
      };
      continue;
    }

    if (e?.type === 'system' && e.subtype === 'compact_boundary') {
      yield {
        type: 'system',
        subtype: 'compact_boundary',
        session_id: sessionId,
        uuid: e.uuid,
        compact_metadata: {
          trigger: e.compactMetadata?.trigger,
          pre_tokens: e.compactMetadata?.preTokens,
        },
      };
      continue;
    }

    if (e?.type === 'attachment') {
      // Surface hook responses via SDK protocol.
      const att = e.attachment;
      if (att?.type === 'hook_response') {
        yield {
          type: 'system',
          subtype: 'hook_response',
          session_id: sessionId,
          uuid: e.uuid,
          hook_name: att.hookName,
          hook_event: att.hookEvent,
          stdout: att.stdout ?? '',
          stderr: att.stderr ?? '',
          exit_code: att.exitCode,
        };
        continue;
      }

      if (att?.type === 'structured_output') {
        // Preserve structured output in the final success result.
        (toolUseContext as any).__structuredOutput = att.data;
        continue;
      }

      if (att?.type === 'max_turns_reached') {
        yield {
          type: 'result',
          subtype: 'error_max_turns',
          duration_ms: Date.now() - startMs,
          duration_api_ms: getTotalAPIDuration(),
          is_error: false,
          num_turns: att.turnCount,
          session_id: sessionId,
          total_cost_usd: getTotalCostUSD(),
          usage: aggregated,
          modelUsage: getModelUsage(),
          permission_denials: permissionDenials,
          uuid: crypto.randomUUID(),
          errors: [],
        };
        return;
      }
    }

    // Ignore other internal event types.
  }

  if (options.maxBudgetUsd !== undefined && getTotalCostUSD() >= options.maxBudgetUsd) {
    yield {
      type: 'result',
      subtype: 'error_max_budget_usd',
      duration_ms: Date.now() - startMs,
      duration_api_ms: getTotalAPIDuration(),
      is_error: false,
      num_turns: options.mutableMessages.length,
      session_id: sessionId,
      total_cost_usd: getTotalCostUSD(),
      usage: aggregated,
      modelUsage: getModelUsage(),
      permission_denials: permissionDenials,
      uuid: crypto.randomUUID(),
      errors: [],
    };
    return;
  }

  const { text: resultText, isApiError } = getLastAssistantText(options.mutableMessages);
  yield {
    type: 'result',
    subtype: 'success',
    is_error: isApiError,
    duration_ms: Date.now() - startMs,
    duration_api_ms: getTotalAPIDuration(),
    num_turns: options.mutableMessages.length,
    result: resultText,
    session_id: sessionId,
    total_cost_usd: getTotalCostUSD(),
    usage: aggregated,
    modelUsage: getModelUsage(),
    permission_denials: permissionDenials,
    structured_output: (toolUseContext as any).__structuredOutput,
    uuid: crypto.randomUUID(),
  };

  // Persisting session transcripts is handled by shared session-persistence hooks.
  // Keep this hook point to match v19's behavior gating on persistence.
  if (persistEnabled) {
    // No-op here: the upstream CLI/SDK runner is responsible for persistence wiring.
  }
}

/**
 * Main loop for SDK agent mode.
 * Corresponds to obfuscated symbol LR7 in chunks.155.mjs.
 */
export function runSDKAgentLoop(
  transport: any,
  mcpClients: any[],
  commands: any[],
  tools: any[],
  initialMessages: any[],
  canUseTool: any,
  sdkMcpConfigs: Record<string, any>,
  getAppState: () => any,
  setAppState: (update: (state: any) => any) => void,
  agents: any[],
  options: any
) {
  let isProcessing = false;
  let isInputClosed = false;
  let abortController: AbortController | undefined;
  const outputQueue = new AsyncMessageQueue<any>();

  // Subscribe to auth status if enabled
  if (options.enableAuthStatus) {
    // Note: lq.getInstance() is AuthStatusEmitter in claudecode/core
    const AuthStatusEmitter = (global as any).AuthStatusEmitter; 
    if (AuthStatusEmitter) {
      AuthStatusEmitter.getInstance().subscribe((status: any) => {
        outputQueue.enqueue({
          type: "auth_status",
          isAuthenticating: status.isAuthenticating,
          output: status.output,
          error: status.error,
          uuid: crypto.randomUUID(),
          session_id: (getAppState() as any).sessionId
        });
      });
    }
  }

  // Normalize initial messages and extract SessionStart hooks
  // $59 is normalizeMessages
  const messageHistory = [...initialMessages];
  const sessionStartResponses = messageHistory.filter(
    m => m.type === "system" && m.subtype === "hook_response" && m.hook_event === "SessionStart"
  );

  let userSpecifiedModel = options.userSpecifiedModel;
  let connectedMcpClients: any[] = [];
  let connectedMcpTools: any[] = [];
  let dynamicMcpState = {
    clients: [] as any[],
    tools: [] as any[],
    configs: {} as Record<string, any>
  };

  /**
   * Refreshes MCP clients based on current configs.
   * Corresponds to obfuscated function 'b' in LR7.
   */
  async function refreshMcpClients() {
    const configKeys = new Set(Object.keys(sdkMcpConfigs));
    const currentClientNames = new Set(connectedMcpClients.map(c => c.name));
    
    const needsRemoval = Array.from(currentClientNames).some(name => !configKeys.has(name));
    const needsAddition = Array.from(configKeys).some(name => !currentClientNames.has(name));
    const hasPending = connectedMcpClients.some(c => c.type === "pending");

    if (needsRemoval || needsAddition || hasPending) {
      // Cleanup removed clients
      for (const client of connectedMcpClients) {
        if (!configKeys.has(client.name)) {
          if (client.type === "connected") await client.cleanup();
        }
      }

      // Reconnect/Connect clients
      // $r2 is connectMcpClients
      const connectMcpClients = (global as any).connectMcpClients;
      if (connectMcpClients) {
        const result = await connectMcpClients(sdkMcpConfigs, (serverName: string, message: any) => 
          transport.sendMcpMessage(serverName, message)
        );
        connectedMcpClients = result.clients;
        connectedMcpTools = result.tools;
      }
    }
  }

  // Initial MCP refresh
  refreshMcpClients();

  // Sw9 is createIdleTimer
  const createIdleTimer = (global as any).createIdleTimer;
  const idleTimer = createIdleTimer?.(() => !isProcessing);

  /**
   * Processes queued commands.
   * Corresponds to obfuscated function 'f' in LR7.
   */
  const processQueuedCommands = async () => {
    if (isProcessing) return;
    
    isProcessing = true;
    idleTimer?.stop();

    // Enqueue session start responses once
    if (sessionStartResponses.length > 0) {
      for (const resp of sessionStartResponses) {
        outputQueue.enqueue(resp);
      }
      sessionStartResponses.length = 0;
    }

    await refreshMcpClients();

    const allMcpClients = [...mcpClients, ...connectedMcpClients, ...dynamicMcpState.clients];
    let allTools = [...tools, ...connectedMcpTools, ...dynamicMcpState.tools];

    // Add structured output tool if needed
    // Xq1 is getJsonSchema, xZ1 is createStructuredOutputTool
    const getJsonSchema = (global as any).getJsonSchema;
    const createStructuredOutputTool = (global as any).createStructuredOutputTool;
    const jsonSchema = getJsonSchema?.() || options.jsonSchema;
    if (jsonSchema && createStructuredOutputTool) {
      const tool = createStructuredOutputTool(jsonSchema);
      if (tool) allTools = [...allTools, tool];
    }

    try {
      const dequeueNextQueuedCommand = async (): Promise<any | undefined> => {
        let next: any | undefined;
        setAppState((state: any) => {
          const q = Array.isArray(state?.queuedCommands) ? state.queuedCommands : [];
          next = q.length > 0 ? q[0] : undefined;
          return { ...state, queuedCommands: q.slice(1) };
        });
        return next;
      };

      let command: any | undefined;
      // Drain queued commands sequentially (matches SDK behavior).
      while ((command = await dequeueNextQueuedCommand())) {
        if (command.mode !== "prompt" && command.mode !== "orphaned-permission" && command.mode !== "task-notification") {
          throw new Error("Only prompt commands are supported in streaming mode");
        }

        abortController = new AbortController();

        for await (const message of runSdkPromptTurn({
          commands,
          prompt: String(command.value ?? ''),
          promptUuid: String(command.uuid ?? crypto.randomUUID()),
          cwd: process.cwd(),
          tools: allTools,
          mcpClients: allMcpClients,
          verbose: Boolean(options.verbose),
          maxThinkingTokens: options.maxThinkingTokens,
          maxTurns: options.maxTurns,
          maxBudgetUsd: options.maxBudgetUsd,
          canUseTool,
          mutableMessages: messageHistory,
          customSystemPrompt: options.systemPrompt,
          appendSystemPrompt: options.appendSystemPrompt,
          userSpecifiedModel,
          fallbackModel: options.fallbackModel,
          jsonSchema,
          getAppState,
          setAppState,
          abortController,
          replayUserMessages: Boolean(options.replayUserMessages),
          includePartialMessages: Boolean(options.includePartialMessages),
          agents,
          orphanedPermission: command.orphanedPermission,
          setSDKStatus: (status: string) => {
            outputQueue.enqueue({
              type: 'system',
              subtype: 'status',
              status,
              session_id: (getAppState() as any).sessionId,
              uuid: crypto.randomUUID(),
            });
          },
        })) {
          const isToolRelated = (message.type === "assistant" || message.type === "user") && message.parent_tool_use_id;
          const isReplay = message.type === "user" && (message as any).isReplay;
          
          if (!isToolRelated && !isReplay && message.type !== "stream_event") {
            messageHistory.push(message);
          }
          outputQueue.enqueue(message);
        }
        
        // Finalize turn
        // The SDK runner (or embedding host) may reset transient state between turns.
      }
    } catch (error) {
      try {
        transport.write({
          type: "result",
          subtype: "error_during_execution",
          duration_ms: 0,
          duration_api_ms: 0,
          is_error: true,
          num_turns: 0,
          session_id: (getAppState() as any).sessionId,
          total_cost_usd: 0,
          usage: { input_tokens: 0, output_tokens: 0 },
          modelUsage: {},
          permission_denials: [],
          uuid: crypto.randomUUID(),
          errors: [
            error instanceof Error ? error.message : String(error),
          ]
        });
      } catch {}
      process.exit(1);
    } finally {
      isProcessing = false;
      idleTimer?.start();
    }

    if (isInputClosed) {
      if (options.loopy && !abortController?.signal.aborted) {
         // Auto-continue logic
         const enqueueCommand = (global as any).enqueueCommand;
         enqueueCommand?.({
           mode: "prompt",
           value: `Continue. Time: ${new Date().toISOString()}`,
           uuid: crypto.randomUUID()
         }, setAppState);
         processQueuedCommands();
      } else {
        outputQueue.done();
      }
    }
  };

  const sendSuccessResponse = (request: any, response?: any) => {
    outputQueue.enqueue({
      type: "control_response",
      response: {
        subtype: "success",
        request_id: request.request_id,
        response
      }
    });
  };

  const sendErrorResponse = (request: any, error: string) => {
    outputQueue.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        request_id: request.request_id,
        error
      }
    });
  };

  // Set unexpected response callback
  transport.setUnexpectedResponseCallback(async (message: any) => {
    // PR7 is handleOrphanedResponse
    const handleOrphanedResponse = (global as any).handleOrphanedResponse;
    if (handleOrphanedResponse) {
      await handleOrphanedResponse({
        message,
        setAppState,
        onEnqueued: () => {
          processQueuedCommands();
        }
      });
    }
  });

  // Main input processing loop
  (async () => {
    let hasReceivedMessage = false;
    for await (const input of transport.structuredInput) {
      if (input.type === "control_request") {
        const { request, request_id } = input;
        switch (request.subtype) {
          case "interrupt":
            if (abortController) abortController.abort();
            sendSuccessResponse(input);
            break;
            
          case "initialize":
            if (request.sdkMcpServers?.length > 0) {
              for (const name of request.sdkMcpServers) {
                sdkMcpConfigs[name] = { type: "sdk", name };
              }
            }
            // RR7 is handleInitializeRequest
            const handleInitializeRequest = (global as any).handleInitializeRequest;
            if (handleInitializeRequest) {
              await handleInitializeRequest(
                request, 
                request_id, 
                hasReceivedMessage, 
                outputQueue, 
                commands, 
                [], // available models
                transport, 
                !!options.enableAuthStatus, 
                options, 
                agents
              );
            }
            hasReceivedMessage = true;
            break;

          case "set_permission_mode":
            // _R7 is handleSetPermissionMode
            setAppState((state: any) => ({
              ...state,
              toolPermissionContext: {
                ...state.toolPermissionContext,
                mode: request.mode
              }
            }));
            sendSuccessResponse(input, { mode: request.mode });
            break;

          case "set_model":
            const model = request.model === "default" ? (global as any).getDefaultModel?.() : request.model;
            userSpecifiedModel = model;
            (global as any).setUserSpecifiedModel?.(model);
            sendSuccessResponse(input);
            break;

          case "set_max_thinking_tokens":
            options.maxThinkingTokens = request.max_thinking_tokens ?? undefined;
            sendSuccessResponse(input);
            break;

          case "mcp_status":
            const mcpServers = [...mcpClients, ...connectedMcpClients, ...dynamicMcpState.clients].map(c => ({
              name: c.name,
              status: c.type,
              serverInfo: c.type === "connected" ? c.serverInfo : undefined,
              error: c.type === "failed" ? c.error : undefined
            }));
            sendSuccessResponse(input, { mcpServers });
            break;

          case "mcp_message":
            const target = connectedMcpClients.find(c => c.name === request.server_name);
            if (target?.type === "connected" && target.client?.transport?.onmessage) {
              target.client.transport.onmessage(request.message);
            }
            sendSuccessResponse(input);
            break;

          case "rewind_files":
            // gw9 is handleRewindFiles
            const handleRewindFiles = (global as any).handleRewindFiles;
            if (handleRewindFiles) {
              const state = getAppState();
              const result = await handleRewindFiles(request.user_message_id, state, setAppState, request.dry_run ?? false);
              if (result.canRewind || request.dry_run) {
                sendSuccessResponse(input, result);
              } else {
                sendErrorResponse(input, result.error || "Unexpected error");
              }
            }
            break;

          case "mcp_set_servers":
            // SR7 is handleSetMcpServers
            const handleSetMcpServers = (global as any).handleSetMcpServers;
            if (handleSetMcpServers) {
              const result = await handleSetMcpServers(request.servers, {
                configs: sdkMcpConfigs,
                clients: connectedMcpClients,
                tools: connectedMcpTools
              }, dynamicMcpState, setAppState);
              
              // Update state
              for (const key of Object.keys(sdkMcpConfigs)) delete sdkMcpConfigs[key];
              Object.assign(sdkMcpConfigs, result.newSdkState.configs);
              connectedMcpClients = result.newSdkState.clients;
              connectedMcpTools = result.newSdkState.tools;
              dynamicMcpState = result.newDynamicState;
              
              sendSuccessResponse(input, result.response);
              if (result.sdkServersChanged) refreshMcpClients();
            }
            break;
        }
        continue;
      }

      if (input.type === "control_response") {
        if (options.replayUserMessages) outputQueue.enqueue(input);
        continue;
      }

      if (input.type === "keep_alive") continue;

      // Handle user messages
      hasReceivedMessage = true;
      if (input.uuid) {
        const sessionId = (getAppState() as any).sessionId;
        // pJ9 is isDuplicateMessage
        const isDuplicateMessage = (global as any).isDuplicateMessage;
        if (await isDuplicateMessage?.(sessionId, input.uuid)) {
          if (options.replayUserMessages) {
            outputQueue.enqueue({
              ...input,
              isReplay: true,
              session_id: sessionId,
              parent_tool_use_id: null
            });
          }
          continue;
        }
      }

      // Queue command for processing
      setAppState((state: any) => ({
        ...state,
        queuedCommands: [...state.queuedCommands, {
          mode: "prompt",
          value: input.message.content,
          uuid: input.uuid
        }]
      }));
      processQueuedCommands();
    }

    isInputClosed = true;
    if (!isProcessing) outputQueue.done();
  })();

  return outputQueue;
}
