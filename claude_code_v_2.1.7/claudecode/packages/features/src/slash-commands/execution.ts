/**
 * @claudecode/features - Slash Command Execution
 *
 * Command execution and dispatch system.
 * Reconstructed from chunks.112.mjs
 */

import type {
  SlashCommand,
  LocalCommand,
  LocalJSXCommand,
  PromptCommand,
  CommandExecutionResult,
  CommandExecutionContext,
  CommandMessage,
  SkillUsage,
} from './types.js';
import {
  extractCommandParts,
  isValidCommandName,
  isFilePath,
  commandExists,
  findCommand,
  createUserMessage,
  formatCommandMetadata,
  formatSkillMetadata,
} from './parser.js';
import { getCommandRegistry } from './registry.js';
import { runSubagentLoop, isYieldableMessage } from '@claudecode/core/agent-loop';
import { generateTaskId, generateUUID } from '@claudecode/shared';

// Placeholder for telemetry if not available in imports
// In source: l("tengu_input_slash_missing", {})
const telemetry = (event: string, properties?: any) => {
  // Implementation would go here
  // console.log(`Telemetry: ${event}`, properties);
};

// Placeholder for missing functions that were in source
// TD1: prepareForkContext
async function prepareForkContext(command: PromptCommand, args: string, context: CommandExecutionContext) {
  // Mock implementation based on source analysis
  return {
    skillContent: await command.getPromptForCommand(args, context),
    modifiedGetAppState: context.getAppState, // simplified
    baseAgent: { agentType: command.name },
    promptMessages: []
  };
}

// yz0: recordSidechainTranscript
async function recordSidechainTranscript(messages: any[], agentId: string, parentId?: string | null) {
  // Mock implementation
}

// a7: normalizeMessages (simplified)
function normalizeMessages(messages: any[]) {
  return messages;
}

// WHA: renderToolUse (simplified)
function renderToolUse(messages: any[], options: any) {
  return null;
}

// g51: getResponseLength (simplified)
function getResponseLength(message: any) {
  return 0;
}

// PD1: formatSkillResult (simplified)
function formatSkillResult(messages: any[], defaultText: string) {
  return defaultText;
}

// ============================================
// Skill Usage Tracking
// ============================================

/**
 * Track skill usage for analytics.
 * Original: MD1 (trackSkillUsage) in chunks.112.mjs:2362-2376
 */
export function trackSkillUsage(
  skillName: string,
  getAppState: () => { skillUsage?: Record<string, SkillUsage> },
  setAppState: (updater: (state: any) => any) => void
): void {
  const appState = getAppState();
  const skillData = appState.skillUsage?.[skillName];
  const now = Date.now();
  const newUsageCount = (skillData?.usageCount ?? 0) + 1;

  if (!skillData || skillData.usageCount !== newUsageCount || skillData.lastUsedAt !== now) {
    setAppState((prevState: any) => ({
      ...prevState,
      skillUsage: {
        ...prevState.skillUsage,
        [skillName]: {
          usageCount: newUsageCount,
          lastUsedAt: now,
        },
      },
    }));
  }
}

/**
 * Get decayed skill usage count.
 * Original: RD1 (getDecayedUsage) in chunks.112.mjs:2378-2384
 */
export function getDecayedUsage(
  skillName: string,
  getAppState: () => { skillUsage?: Record<string, SkillUsage> }
): number {
  const skillData = getAppState().skillUsage?.[skillName];
  if (!skillData) return 0;
  
  const daysSinceLastUse = (Date.now() - skillData.lastUsedAt) / 86400000;
  // Source: Math.pow(0.5, G / 7) where G is days
  const decayFactor = Math.pow(0.5, daysSinceLastUse / 7);
  
  // Source: B.usageCount * Math.max(Z, 0.1)
  return skillData.usageCount * Math.max(decayFactor, 0.1);
}

// ============================================
// Main Entry Point
// ============================================

/**
 * Parse and execute slash command input.
 * Original: OP2 (parseSlashCommandInput) in chunks.112.mjs:2482-2570
 */
export async function parseSlashCommandInput(
  input: string,
  precedingInputBlocks: any[],
  setCommandJSX: (jsx: any) => void,
  context: CommandExecutionContext,
  attachments: any[], // Z in source
  setProcessing: (processing: boolean) => void, // Y in source (boolean callback)
  messages: CommandMessage[], // J
  uuid: string, // X
  outputWriter: any, // I
  abortController: any // D
): Promise<CommandExecutionResult> {
  const extractedParts = extractCommandParts(input); // wP2
  
  if (!extractedParts) {
    telemetry("tengu_input_slash_missing", {});
    const usageTip = 'Commands are in the form `/command [args]`';
    return {
      messages: [
        ...messages, 
        createUserMessage({ content: usageTip }) // simplified IU call
      ],
      shouldQuery: false,
      resultText: usageTip
    };
  }

  const { commandName, args, isMcp } = extractedParts;
  const telemetryCommandName = isMcp ? 'mcp' : !getCommandRegistry().getBuiltinNameSet().has(commandName) ? 'custom' : commandName;

  if (!commandExists(commandName, context.options.commands)) { // Cc
    const isPath = isFilePath(`/${commandName}`); // vA().existsSync(...)
    
    if (isValidCommandName(commandName) && !isPath) { // nb5
      telemetry("tengu_input_slash_invalid", { input: commandName });
      const unknownSkillMessage = `Unknown skill: ${commandName}`;
      return {
        messages: [
          ...messages,
          createUserMessage({ content: unknownSkillMessage })
        ],
        shouldQuery: false,
        resultText: unknownSkillMessage
      };
    }
    
    telemetry("tengu_input_prompt", {});
    // LF("user_prompt", ...)
    
    return {
      messages: [
        createUserMessage({
          content: input, // IU({ inputString: A, precedingInputBlocks: Q })
          uuid: uuid
        }),
        ...messages
      ],
      shouldQuery: true,
    };
  }

  setProcessing(true);
  // T9("slash-commands");
  
  const result = await executeSlashCommand(
    commandName, 
    args, 
    setCommandJSX, 
    context, 
    precedingInputBlocks, 
    attachments, 
    messages, 
    outputWriter
  );
  
  const { messages: resultMessages, shouldQuery, allowedTools, maxThinkingTokens, model, command, resultText } = result;

  if (resultMessages.length === 0) {
    const telemetryData: any = { input: telemetryCommandName };
    if (command?.type === 'prompt' && command.pluginInfo) {
      const { pluginManifest, repository } = command.pluginInfo;
      telemetryData.plugin_repository = repository;
      telemetryData.plugin_name = pluginManifest.name;
      if (pluginManifest.version) telemetryData.plugin_version = pluginManifest.version;
    }
    telemetry("tengu_input_command", telemetryData);
    
    return {
      messages: [],
      shouldQuery: false,
      maxThinkingTokens,
      model,
    };
  }
  
  // Handle unknown command error format from ab5
  // Source checks: E.length === 2 && E[1].type === "user" && ... startsWith("Unknown command:")
  if (resultMessages.length === 2 && 
      resultMessages[1]?.role === 'user' && 
      typeof resultMessages[1]?.content === 'string' && 
      resultMessages[1]?.content.startsWith('Unknown command:')) {
      
    if (!(input.startsWith("/var") || input.startsWith("/tmp") || input.startsWith("/private"))) {
      telemetry("tengu_input_slash_invalid", { input: commandName });
    }
    
    return {
      messages: [...messages, ...resultMessages],
      shouldQuery,
      allowedTools,
      maxThinkingTokens,
      model
    };
  }

  const telemetryData: any = { input: telemetryCommandName };
  if (command?.type === 'prompt' && command.pluginInfo) {
    const { pluginManifest, repository } = command.pluginInfo;
    telemetryData.plugin_repository = repository;
    telemetryData.plugin_name = pluginManifest.name;
    if (pluginManifest.version) telemetryData.plugin_version = pluginManifest.version;
  }
  telemetry("tengu_input_command", telemetryData);

  // qc(E[0]) check?
  
  return {
    messages: shouldQuery ? resultMessages : [...messages, ...resultMessages],
    shouldQuery,
    allowedTools,
    maxThinkingTokens,
    model,
    resultText
  };
}

/**
 * Execute a slash command.
 * Original: ab5 (executeSlashCommand) in chunks.112.mjs:2597-2747
 */
export async function executeSlashCommand(
  commandName: string,
  args: string,
  setCommandJSX: (jsx: any) => void,
  context: CommandExecutionContext,
  precedingInputBlocks: any[],
  attachments: any[],
  messages: CommandMessage[],
  outputWriter: any
): Promise<CommandExecutionResult> {
  let command = findCommand(commandName, context.options.commands); // eS
  
  // Track usage for prompt commands
  if (command.type === 'prompt' && command.userInvocable !== false) {
    trackSkillUsage(commandName, context.getAppState!, context.setAppState!); // MD1
  }
  
  if (command.userInvocable === false) {
    return {
      messages: [
        createUserMessage({ content: `/${commandName}` }),
        createUserMessage({
          content: `This skill can only be invoked by Claude, not directly by users. Ask Claude to use the "${commandName}" skill for you.`,
        }),
      ],
      shouldQuery: false,
      command: command,
    };
  }
  
  try {
    switch (command.type) {
      case 'local-jsx':
        return new Promise((resolve) => {
          (command as LocalJSXCommand).call(
            (jsxContent, options) => {
              if (options?.display === 'skip') {
                resolve({ messages: [], shouldQuery: false, command: command });
                return;
              }
              
              const metadata = formatCommandMetadata(command, args); // ckA
              
              resolve({
                messages:
                  options?.display === 'system'
                    ? [
                        { role: 'system', content: metadata }, // Sz0
                        { role: 'system', content: `<local-command-stdout>${jsxContent}</local-command-stdout>` }
                      ] as any
                    : [
                        createUserMessage({ content: metadata }),
                        jsxContent
                          ? createUserMessage({ content: `<local-command-stdout>${jsxContent}</local-command-stdout>` })
                          : createUserMessage({ content: `<local-command-stdout>(no content)</local-command-stdout>` }), // JO
                      ],
                shouldQuery: options?.shouldQuery ?? false,
                command: command,
              });
            },
            context,
            args
          ).then((jsxResult) => {
            if (context.options.isNonInteractiveSession) {
              resolve({ messages: [], shouldQuery: false, command: command });
              return;
            }
            setCommandJSX({
              jsx: jsxResult,
              shouldHidePromptInput: true,
              showSpinner: false,
              isLocalJSXCommand: true,
            });
          });
        });
        
      case 'local': {
        const metadata = formatCommandMetadata(command, args);
        let metadataMessage = createUserMessage({ content: metadata });
        
        try {
          // NE() ?
          let result = await (command as LocalCommand).call(args, context);
          
          if (result.type === 'skip') {
            return { messages: [], shouldQuery: false, command: command };
          }
          
          if (result.type === 'compact') {
            // Source: K.type === "compact" logic
            let compactMessages = [
              // NE(), 
              metadataMessage, 
              ...((result as any).displayText ? [createUserMessage({ 
                content: `<local-command-stdout>${(result as any).displayText}</local-command-stdout>`,
                // timestamp: ...
              })] : [])
            ];
            
            // FHA(F) logic
            return {
              messages: [...((result as any).compactionResult.messagesToKeep ?? []), ...compactMessages] as any,
              shouldQuery: false,
              command: command,
            };
          }
          
          return {
            messages: [
              metadataMessage, 
              createUserMessage({ content: `<local-command-stdout>${result.value}</local-command-stdout>` })
            ],
            shouldQuery: false,
            command: command,
          };
        } catch (error) {
          return {
            messages: [
              metadataMessage, 
              createUserMessage({ content: `<local-command-stderr>${String(error)}</local-command-stderr>` })
            ],
            shouldQuery: false,
            command: command,
          };
        }
      }
      
      case 'prompt':
        try {
          if (command.context === 'fork') {
            return await executeForkedSlashCommand(
              command as PromptCommand, 
              args, 
              context, 
              precedingInputBlocks, 
              setCommandJSX, 
              (context as any).canUseTool
            );
          }
          return await processPromptSlashCommand(command as PromptCommand, args, context, precedingInputBlocks, attachments);
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') { // aG
            return {
              messages: [
                createUserMessage({ content: formatCommandMetadata(command, args) }), 
                createUserMessage({ content: '[Request interrupted by user]' }) // Ss
              ],
              shouldQuery: false,
              command: command,
            };
          }
          return {
            messages: [
              createUserMessage({ content: formatCommandMetadata(command, args) }), 
              createUserMessage({ content: `<local-command-stderr>${String(error)}</local-command-stderr>` })
            ],
            shouldQuery: false,
            command: command,
          };
        }
    }
  } catch (error: any) {
    // ny error check
    if (error.message?.startsWith('Unknown command:')) {
       return {
        messages: [createUserMessage({ content: error.message })],
        shouldQuery: false,
        command: command,
      };
    }
    throw error;
  }
  
  return { messages: [], shouldQuery: false };
}

/**
 * Process prompt-type slash command.
 * Original: RP2 (processPromptSlashCommand) in chunks.112.mjs:2778-2818
 */
export async function processPromptSlashCommand(
  command: PromptCommand,
  args: string,
  context: CommandExecutionContext,
  precedingBlocks: any[] = [],
  attachments: any[] = []
): Promise<CommandExecutionResult> {
  let promptContent = await command.getPromptForCommand(args, context);
  
  if (command.hooks) {
    // registerSkillHooks(context.setAppState, q0(), command.hooks, command.name)
    // Placeholder for OD1
  }
  
  let metadata = formatSkillMetadata(command, args); // ob5
  
  // k(`Metadata string for ${command.userFacingName()}:`)
  
  let allowedTools = command.allowedTools ?? []; // Uc
  
  let finalContent = attachments.length > 0 || precedingBlocks.length > 0 
    ? [...attachments, ...precedingBlocks, ...promptContent] 
    : promptContent;
    
  // W = Hm(...) -> calculateThinkingTokens
  
  // K = QY1(...) -> getSystemReminders
  const systemReminders: any[] = []; // Placeholder
  
  let messages = [
    createUserMessage({ content: metadata }), // H0
    createUserMessage({ content: finalContent as any, isMeta: true }), // H0 with isMeta
    ...systemReminders,
    // X4({ type: "command_permissions", ... })
    {
      role: 'system',
      content: `command_permissions: ${JSON.stringify({ allowedTools: allowedTools, model: command.model })}`,
    } as any,
  ];
  
  return {
    messages: messages,
    shouldQuery: true,
    allowedTools: allowedTools,
    model: command.model,
    command: command,
  };
}

/**
 * Execute forked slash command in separate agent.
 * Original: ib5 (executeForkedSlashCommand) in chunks.112.mjs:2390-2476
 */
export async function executeForkedSlashCommand(
  command: PromptCommand,
  args: string,
  context: CommandExecutionContext,
  precedingInputBlocks: any[],
  setCommandJSX: (jsx: any) => void,
  canUseTool: any
): Promise<CommandExecutionResult> {
  const agentId = generateTaskId('local_agent'); // LS()
  telemetry("tengu_slash_command_forked", { command_name: command.name });
  
  // TD1
  const { skillContent, modifiedGetAppState, baseAgent, promptMessages } = await prepareForkContext(command, args, context);
  
  const normalizedMessages: any[] = []; // K
  const progressMessages: any[] = []; // V
  const parentToolUseID = `forked-command-${command.name}`; // F
  let toolUseCounter = 0; // H
  
  // E helper
  const createProgressEvent = (message: any) => {
    toolUseCounter++;
    return {
      type: "progress",
      data: {
        message: message,
        normalizedMessages: normalizeMessages(normalizedMessages),
        type: "agent_progress",
        prompt: skillContent,
        agentId: agentId
      },
      parentToolUseID: parentToolUseID,
      toolUseID: `${parentToolUseID}-${toolUseCounter}`,
      timestamp: new Date().toISOString(),
      uuid: generateUUID() // lb5
    };
  };
  
  // z helper
  const updateJSX = () => {
    setCommandJSX({
      jsx: renderToolUse(progressMessages, { tools: context.options.tools, verbose: false }), // WHA
      shouldHidePromptInput: false, // !1 in source? Wait, source says !1 (false)
      shouldContinueAnimation: true,
      showSpinner: true
    });
  };
  
  updateJSX();
  
  try {
    // $f (runAgentLoop)
    const generator = runSubagentLoop({
      agentDefinition: baseAgent as any,
      promptMessages: promptMessages as any[],
      toolUseContext: { ...context, getAppState: modifiedGetAppState },
      canUseTool,
      isAsync: false,
      querySource: 'agent:custom',
      model: command.model
    });

    for await (const event of generator) {
      const message = event as any;
      normalizedMessages.push(message);
      
      if (message.type === 'assistant') {
        const length = getResponseLength(message); // g51
        if (length > 0) context.setResponseLength?.((prev: number) => prev + length);
        
        const normalized = normalizeMessages([message])[0];
        if (normalized && normalized.type === 'assistant') {
          progressMessages.push(createProgressEvent(message));
          updateJSX();
        }
      }
      
      if (message.type === 'user') {
        const normalized = normalizeMessages([message])[0];
        if (normalized && normalized.type === 'user') {
          progressMessages.push(createProgressEvent(message));
          updateJSX();
        }
      }
    }
  } finally {
    setCommandJSX(null);
  }

  const resultText = formatSkillResult(normalizedMessages, "Command completed"); // PD1
  
  return {
    messages: [
      createUserMessage({ 
        content: `/${command.userFacingName()} ${args}`.trim() 
      }),
      createUserMessage({ 
        content: `<local-command-stdout>\n${resultText}\n</local-command-stdout>` 
      })
    ],
    shouldQuery: false,
    command: command,
    resultText: resultText
  };
}
