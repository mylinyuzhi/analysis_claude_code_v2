import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Text, useInput, Static, useApp } from 'ink';
import {
  Spinner,
  PermissionPrompt,
  ToolUseDisplay,
  streamEventProcessor,
  type PermissionResponse,
  type UIStreamingStatus,
  type ToolInputPreview,
  type ThinkingState,
} from '@claudecode/ui';
import { coreMessageLoop } from '@claudecode/core/agent-loop';
import { createUserMessage } from '@claudecode/core/message';
import type { ConversationMessage } from '@claudecode/core/message';
import type { LoopEvent } from '@claudecode/core/agent-loop';
import type { ToolDefinition } from '@claudecode/core/tools';

// Simple TextInput component
const TextInput = ({ value, onChange, onSubmit }: { value: string, onChange: (v: string) => void, onSubmit: (v: string) => void }) => {
  useInput((input: string, key: any) => {
    if (key.return) {
      onSubmit(value);
    } else if (key.backspace || key.delete) {
      onChange(value.slice(0, -1));
    } else if (!key.ctrl && !key.meta) {
      onChange(value + input);
    }
  });

  return (
    <Box>
      <Text color="green">❯ </Text>
      <Text>{value}</Text>
      <Text inverse> </Text>
    </Box>
  );
};

export interface InteractiveSessionProps {
  initialMessages: ConversationMessage[];
  tools: any;
  systemPrompt: string;
  userContext: any;
  getAppState: () => Promise<any>;
  setAppState: (updater: (state: any) => any) => void;
  readFileState: Map<string, any>;
  abortController: AbortController;
  mcpClients: any;
  agentDefinitions: any;
  model: string;
}

export const InteractiveSession: React.FC<InteractiveSessionProps> = ({
  initialMessages,
  tools,
  systemPrompt,
  userContext,
  getAppState,
  setAppState,
  readFileState,
  abortController,
  mcpClients,
  agentDefinitions,
  model
}) => {
  const { exit } = useApp();
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [permissionReq, setPermissionReq] = useState<{tool: string, input: any} | null>(null);
  const [history, setHistory] = useState<{id: string, text: string}[]>([]);

  // Streaming UI state
  const [uiStatus, setUiStatus] = useState<UIStreamingStatus>('requesting');
  const uiStatusRef = useRef<UIStreamingStatus>('requesting');
  const [streamingDelta, setStreamingDelta] = useState('');
  const [toolInputs, setToolInputs] = useState<ToolInputPreview[]>([]);
  const [thinkingState, setThinkingState] = useState<ThinkingState | null>(null);
  const erroredToolUseIDsRef = useRef<Set<string>>(new Set());
  const inProgressToolUseIDsRef = useRef<Set<string>>(new Set());
  const resolvedToolUseIDsRef = useRef<Set<string>>(new Set());
  
  // Ref for permission resolution
  const permissionResolveRef = useRef<((response: PermissionResponse) => void) | null>(null);

  // When permission prompt is active, suppress streaming previews and tool input previews.
  // This matches the UX of focusing the user on an explicit confirmation step.
  useEffect(() => {
    if (!permissionReq) return;
    setStreamingDelta('');
    setToolInputs(() => []);
    setUiStatus('tool-use');
  }, [permissionReq]);

  // Permission check callback
  const canUseTool = useCallback(async (tool: ToolDefinition, input: any) => {
    return new Promise<boolean | any>((resolve) => {
      setPermissionReq({ tool: tool.name, input });
      permissionResolveRef.current = (response: PermissionResponse) => {
        if (response.type === 'allow') {
          resolve(true);
        } else if (response.type === 'allow-with-feedback') {
          resolve({ result: true, acceptFeedback: response.feedback });
        } else if (response.type === 'allow-always') {
          // Add rule to local settings
          import('../settings/permissions.js').then(({ addPermissionRule }) => {
            const rule: any = { // Using any for simplicity here as we bridge modules
              type: 'addRules',
              rules: [{
                toolName: tool.name,
                // For bash, we could be more specific, but for now allow tool-wide
                ruleContent: undefined 
              }],
              behavior: 'allow',
              destination: 'localSettings'
            };
            addPermissionRule(rule);
          });
          resolve(true);
        } else if (response.type === 'allow-always-with-feedback') {
          import('../settings/permissions.js').then(({ addPermissionRule }) => {
            const rule: any = {
              type: 'addRules',
              rules: [{
                toolName: tool.name,
                ruleContent: undefined
              }],
              behavior: 'allow',
              destination: 'localSettings'
            };
            addPermissionRule(rule);
          });
          resolve({ result: true, acceptFeedback: response.feedback });
        } else if (response.type === 'deny-with-feedback') {
          resolve({
            result: false,
            message: response.feedback,
            behavior: 'deny'
          });
        } else {
          resolve(false);
        }
      };
    });
  }, []);

  const handlePermission = (response: PermissionResponse) => {
    setPermissionReq(null);
    if (permissionResolveRef.current) {
      permissionResolveRef.current(response);
      permissionResolveRef.current = null;
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setHistory(prev => [...prev, { id: Date.now().toString(), text: `> ${text}` }]);
    setInputValue('');
    setIsThinking(true);

    const userMsg = createUserMessage({ content: text });
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      // Run core message loop
      const resultStream = coreMessageLoop({
        messages: newMessages,
        systemPrompt,
        userContext,
        canUseTool,
        toolUseContext: {
          getAppState,
          setAppState,
          readFileState,
          abortController,
          messages: newMessages,
          options: {
            tools,
            mainLoopModel: model,
            agentDefinitions,
            mcpClients,
          },
        },
        querySource: 'cli',
      });

      let fullResponse = '';

      // reset streaming state for this turn
      setStreamingDelta('');
      setToolInputs([]);
      setThinkingState(null);
      erroredToolUseIDsRef.current = new Set();
      inProgressToolUseIDsRef.current = new Set();
      resolvedToolUseIDsRef.current = new Set();

      const addMessage = (msg: any) => {
        const t = msg?.type;

        // LoopEvent-only signals
        if (t === 'retry') {
          setHistory((prev) => [
            ...prev,
            { id: Date.now().toString(), text: `Retrying... (${msg.attempt}/${msg.maxAttempts}, ${msg.delayMs}ms)` },
          ]);
          return;
        }
        if (t === 'api_error') {
          const m = msg?.error?.message ? String(msg.error.message) : 'API error';
          setHistory((prev) => [...prev, { id: Date.now().toString(), text: `API Error: ${m}` }]);
          return;
        }

        // Conversation messages
        if (t === 'assistant' || t === 'user' || t === 'attachment' || t === 'progress' || t === 'system') {
          setMessages((prev) => [...prev, msg as ConversationMessage]);

          // Track tool use lifecycle (best-effort)
          if (t === 'assistant') {
            const blocks = msg?.message?.content;
            if (Array.isArray(blocks)) {
              for (const b of blocks) {
                if (b && typeof b === 'object' && (b as any).type === 'tool_use') {
                  inProgressToolUseIDsRef.current.add(String((b as any).id));
                }
              }
            }
          }
          if (t === 'user') {
            const blocks = msg?.message?.content;
            if (Array.isArray(blocks)) {
              for (const b of blocks) {
                if (b && typeof b === 'object' && (b as any).type === 'tool_result') {
                  const id = String((b as any).tool_use_id);
                  resolvedToolUseIDsRef.current.add(id);
                  inProgressToolUseIDsRef.current.delete(id);
                  if ((b as any).is_error) erroredToolUseIDsRef.current.add(id);
                }
              }
            }
          }

          // Extract assistant text for history (when complete blocks arrive)
          if (t === 'assistant') {
            const blocks = msg?.message?.content;
            if (Array.isArray(blocks)) {
              const text = blocks
                .filter((c: any) => c?.type === 'text')
                .map((c: any) => String(c?.text ?? ''))
                .join('');
              fullResponse += text;
            }
          }
        }
      };

      const updateDelta = (delta: string) => {
        // Keep a single delta buffer like source; only render it when status is text/thinking.
        setStreamingDelta((prev) => prev + delta);
      };

      const setStatus = (s: UIStreamingStatus) => {
        uiStatusRef.current = s;
        setUiStatus(s);
      };

      const setTombstone = (msg: any) => {
        const uuid = msg?.uuid;
        if (!uuid) return;
        setMessages((prev) => prev.filter((m: any) => m?.uuid !== uuid));
      };

      for await (const ev of resultStream) {
        streamEventProcessor(
          ev as LoopEvent,
          addMessage,
          updateDelta,
          setStatus,
          setToolInputs,
          setTombstone,
          (updater) => setThinkingState((prev) => updater(prev))
        );
      }

      // Add final assistant response to history
      if (fullResponse) {
        setHistory((prev) => [...prev, { id: Date.now().toString(), text: fullResponse }]);
      }

    } catch (err) {
      setHistory(prev => [...prev, { id: Date.now().toString(), text: `Error: ${err}` }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Box flexDirection="column">
      <Static items={history}>
        {(item) => (
          <Box key={item.id} marginBottom={1}>
            <Text>{item.text}</Text>
          </Box>
        )}
      </Static>

      {/* Streaming preview (best-effort) */}
      {!permissionReq && (uiStatus === 'responding' || uiStatus === 'thinking') && streamingDelta && (
        <Box marginBottom={1}>
          <Text dimColor>{streamingDelta}</Text>
        </Box>
      )}

      {/* Tool input preview while streaming tool_use */}
      {!permissionReq && uiStatus === 'tool-input' && toolInputs.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          {toolInputs
            .slice()
            .sort((a, b) => a.index - b.index)
            .map((t) => {
              const block: any = t.contentBlock as any;
              const id = String(block?.id ?? t.index);

              // Prefer streaming partial JSON when tool input hasn't been finalized yet.
              const toolInput = (t.unparsedToolInput && t.unparsedToolInput.trim() !== '')
                ? t.unparsedToolInput
                : (block?.input ?? {});

              return (
                <ToolUseDisplay
                  key={id}
                  param={{ type: 'tool_use', id: String(block?.id ?? ''), name: String(block?.name ?? ''), input: toolInput }}
                  tools={Array.isArray(tools) ? tools : []}
                  erroredToolUseIDs={erroredToolUseIDsRef.current}
                  inProgressToolUseIDs={inProgressToolUseIDsRef.current}
                  resolvedToolUseIDs={resolvedToolUseIDsRef.current}
                  shouldAnimate={true}
                  shouldShowDot={true}
                />
              );
            })}
        </Box>
      )}

      {permissionReq ? (
        <PermissionPrompt 
          tool={permissionReq.tool} 
          input={permissionReq.input}
          onRespond={handlePermission}
        />
      ) : isThinking ? (
        <Box>
          <Text color="cyan"><Spinner /> Claude is thinking...</Text>
        </Box>
      ) : (
        <TextInput 
          value={inputValue} 
          onChange={setInputValue} 
          onSubmit={handleSubmit} 
        />
      )}
    </Box>
  );
};
