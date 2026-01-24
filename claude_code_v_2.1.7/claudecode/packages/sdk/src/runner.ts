/**
 * @claudecode/sdk - Session Runner
 *
 * Main entry point for SDK session execution.
 * Reconstructed from chunks.155.mjs (hw9)
 */

import { runSDKAgentLoop } from './loop.js';
import { loadInitialMessages, createIOHandler } from './session.js';
import { writeToStdout } from './transport/stdio.js';

/**
 * Main entry point for non-interactive SDK mode (--print).
 * Corresponds to obfuscated symbol hw9 in chunks.155.mjs.
 */
export async function runNonInteractiveSession(
  prompt: string | undefined,
  getAppState: () => any,
  setAppState: (update: (state: any) => any) => void,
  commands: any[],
  tools: any[],
  canUseTool: any,
  agents: any[],
  options: any
) {
  // eO0, rVA, Y79 are related to telemetry/update checks
  (global as any).finalizeTurn?.();
  if (await (global as any).shouldCheckUpdates?.()) {
    await (global as any).runUpdateCheck?.();
  }

  // Handle Sandbox
  const Sandbox = (global as any).Sandbox;
  if (Sandbox?.isSandboxingEnabled()) {
    try {
      await Sandbox.initialize();
    } catch (err: any) {
      process.stderr.write(`\n❌ Sandbox Error: ${err.message}\n`);
      process.exit(1);
    }
  }

  // Flag validation
  if (options.resumeSessionAt && !options.resume) {
    process.stderr.write(`Error: --resume-session-at requires --resume\n`);
    process.exit(1);
  }

  if (options.rewindFiles && !options.resume) {
    process.stderr.write(`Error: --rewind-files requires --resume\n`);
    process.exit(1);
  }

  if (options.rewindFiles && prompt) {
    process.stderr.write(`Error: --rewind-files is a standalone operation and cannot be used with a prompt\n`);
    process.exit(1);
  }

  // Load initial session state
  const appState = await getAppState();
  const initialMessages = await loadInitialMessages(setAppState, options);

  // Handle --rewind-files standalone
  if (options.rewindFiles) {
    const targetMessage = initialMessages.find((m: any) => m.uuid === options.rewindFiles);
    if (!targetMessage || targetMessage.type !== "user") {
      process.stderr.write(`Error: --rewind-files requires a user message UUID, but ${options.rewindFiles} is not a user message in this session\n`);
      process.exit(1);
    }

    // gw9 is handleRewindFiles
    const handleRewindFiles = (global as any).handleRewindFiles;
    const result = await handleRewindFiles?.(options.rewindFiles, appState, setAppState, false);
    if (!result?.canRewind) {
      process.stderr.write(`Error: ${result?.error || "Unexpected error"}\n`);
      process.exit(1);
    }
    process.stdout.write(`Files rewound to state at message ${options.rewindFiles}\n`);
    process.exit(0);
  }

  const isResuming = typeof options.resume === "string" && (options.resume.includes("-") || options.resume.endsWith(".jsonl"));
  const isWebSocket = Boolean(options.sdkUrl);

  if (!prompt && !isResuming && !isWebSocket) {
    process.stderr.write(`Error: Input must be provided either through stdin or as a prompt argument when using --print\n`);
    process.exit(1);
  }

  if (options.outputFormat === "stream-json" && !options.verbose) {
    process.stderr.write(`Error: When using --print, --output-format=stream-json requires --verbose\n`);
    process.exit(1);
  }

  // Prepare tools and transport
  // ubA is getMcpTools
  const mcpTools = (global as any).getMcpTools?.(appState.mcp.tools, appState.toolPermissionContext) || [];
  const combinedTools = (global as any).isPluginEnabled?.() ? tools : [...tools, ...mcpTools];
  
  const transport = createIOHandler(prompt || process.stdin, options);
  
  // MR7 is resolvePermissionCallback
  const resolvePermissionCallback = (global as any).resolvePermissionCallback;
  const permissionToolName = options.sdkUrl ? "stdio" : options.permissionPromptToolName;
  const resolvedCanUseTool = resolvePermissionCallback?.(permissionToolName, transport, appState.mcp.tools) || canUseTool;

  if (options.permissionPromptToolName) {
    // Filter out the tool used for permissions from the general tool set
    // to avoid cycles if it's an MCP tool
    // but the original code logic is slightly different: 
    // it filters 'tools' which I've already combined
  }

  // Start Agent Loop
  const outputMessages: any[] = [];
  for await (const message of runSDKAgentLoop(
    transport,
    appState.mcp.clients,
    [...commands, ...appState.mcp.commands],
    combinedTools,
    initialMessages,
    resolvedCanUseTool,
    {}, // sdkMcpConfigs
    getAppState,
    setAppState,
    agents,
    options
  )) {
    if (options.outputFormat === "stream-json" && options.verbose) {
      transport.write(message);
    }
    
    // Filter out control and stream events for final result collection
    const isCoreMessage = !["control_response", "control_request", "control_cancel_request", "stream_event", "keep_alive"].includes(message.type);
    if (isCoreMessage) {
      outputMessages.push(message);
    }
  }

  // Output formatting
  const lastResult = outputMessages.filter(m => m.type === "result").pop();
  
  switch (options.outputFormat) {
    case "json":
      if (!lastResult) throw new Error("No messages returned");
      if (options.verbose) {
        writeToStdout(JSON.stringify(outputMessages) + "\n");
      } else {
        writeToStdout(JSON.stringify(lastResult) + "\n");
      }
      break;

    case "stream-json":
      // Already handled during loop
      break;

    default: // "text"
      if (!lastResult) throw new Error("No messages returned");
      switch (lastResult.subtype) {
        case "success":
          const text = lastResult.result;
          writeToStdout(text.endsWith("\n") ? text : text + "\n");
          break;
        case "error_during_execution":
          writeToStdout("Execution error\n");
          break;
        case "error_max_turns":
          writeToStdout(`Error: Reached max turns (${options.maxTurns})\n`);
          break;
        case "error_max_budget_usd":
          writeToStdout(`Error: Exceeded USD budget (${options.maxBudgetUsd})\n`);
          break;
        case "error_max_structured_output_retries":
          writeToStdout("Error: Failed to provide valid structured output after maximum retries\n");
          break;
      }
  }

  (global as any).finalizeTurn?.();
  process.exit(lastResult?.is_error ? 1 : 0);
}
