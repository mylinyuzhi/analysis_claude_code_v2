/**
 * @claudecode/sdk - SDK Agent Loop
 *
 * Core agent loop for SDK mode.
 * Reconstructed from chunks.155.mjs (LR7)
 */

import { AsyncMessageQueue } from './transport/queue.js';
import { 
  canUseToolResponseSchema, 
  hookCallbackResponseSchema 
} from './protocol/messages.js';
import { z } from 'zod';

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
      // $32 is getNextQueuedCommand
      const getNextQueuedCommand = (global as any).getNextQueuedCommand;
      let command;
      while (command = await getNextQueuedCommand?.(getAppState, setAppState)) {
        if (command.mode !== "prompt" && command.mode !== "orphaned-permission" && command.mode !== "task-notification") {
          throw new Error("Only prompt commands are supported in streaming mode");
        }

        abortController = new AbortController();
        
        // v19 is coreMessageLoop (async generator)
        const coreMessageLoop = (global as any).coreMessageLoop;
        if (!coreMessageLoop) throw new Error("coreMessageLoop not found");

        for await (const message of coreMessageLoop({
          commands,
          prompt: command.value,
          promptUuid: command.uuid,
          cwd: process.cwd(),
          tools: allTools,
          verbose: options.verbose,
          mcpClients: allMcpClients,
          maxThinkingTokens: options.maxThinkingTokens,
          maxTurns: options.maxTurns,
          maxBudgetUsd: options.maxBudgetUsd,
          canUseTool,
          userSpecifiedModel: userSpecifiedModel,
          fallbackModel: options.fallbackModel,
          jsonSchema: jsonSchema,
          mutableMessages: messageHistory,
          customSystemPrompt: options.systemPrompt,
          appendSystemPrompt: options.appendSystemPrompt,
          getAppState,
          setAppState,
          abortController,
          replayUserMessages: options.replayUserMessages,
          includePartialMessages: options.includePartialMessages,
          agents,
          orphanedPermission: command.orphanedPermission,
          setSDKStatus: (status: string) => {
            outputQueue.enqueue({
              type: "system",
              subtype: "status",
              status: status,
              session_id: (getAppState() as any).sessionId,
              uuid: crypto.randomUUID()
            });
          }
        })) {
          const isToolRelated = (message.type === "assistant" || message.type === "user") && message.parent_tool_use_id;
          const isReplay = message.type === "user" && (message as any).isReplay;
          
          if (!isToolRelated && !isReplay && message.type !== "stream_event") {
            messageHistory.push(message);
          }
          outputQueue.enqueue(message);
        }
        
        // Finalize turn
        // AM0, eO0 are cleanup/finalize functions
        (global as any).finalizeTurn?.();
        (global as any).clearTransientState?.();
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
          usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
          modelUsage: {},
          permission_denials: [],
          uuid: crypto.randomUUID(),
          errors: [
            error instanceof Error ? error.message : String(error),
            ...((global as any).getGlobalErrors?.() || []).map((e: any) => e.error)
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
