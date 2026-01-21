import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Text, useInput, Static, useApp } from 'ink';
import { Spinner, PermissionPrompt, type PermissionResponse } from '@claudecode/ui';
import { coreMessageLoop } from '@claudecode/core';
import { createUserMessage } from '@claudecode/core/message';
import type { ConversationMessage } from '@claudecode/core/message';
import type { ToolDefinition } from '@claudecode/core/tools';

// Simple TextInput component
const TextInput = ({ value, onChange, onSubmit }: { value: string, onChange: (v: string) => void, onSubmit: (v: string) => void }) => {
  useInput((input, key) => {
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
  
  // Ref for permission resolution
  const permissionResolveRef = useRef<((response: PermissionResponse) => void) | null>(null);

  // Permission check callback
  const canUseTool = useCallback(async (tool: ToolDefinition, input: any) => {
    return new Promise<boolean | any>((resolve) => {
      setPermissionReq({ tool: tool.name, input });
      permissionResolveRef.current = (response: PermissionResponse) => {
        if (response.type === 'allow') {
          resolve(true);
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

    const userMsg = createUserMessage(text);
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
      const updatedMessages = [...newMessages];

      for await (const ev of resultStream) {
        if (ev && typeof ev === 'object' && 'type' in ev) {
           if (ev.type === 'assistant') {
             // We could stream output here if we want to be fancy
             // For now just collect it
             updatedMessages.push(ev as ConversationMessage);
             // Extract text for history display
             const content = (ev as ConversationMessage).content;
             if (Array.isArray(content)) {
                const text = content.filter(c => c.type === 'text').map(c => c.text).join('');
                fullResponse += text;
                // Update history in real-time? Maybe too much re-rendering.
             }
           } else if (ev.type === 'user') {
             updatedMessages.push(ev as ConversationMessage);
           }
        }
      }
      
      setMessages(updatedMessages);
      
      // Add assistant response to history
      if (fullResponse) {
        setHistory(prev => [...prev, { id: Date.now().toString(), text: fullResponse }]);
      } else {
        // If there were tool uses but no text, maybe show something?
        // For simplicity, we assume text or tool results will appear.
        setHistory(prev => [...prev, { id: Date.now().toString(), text: '(Command executed)' }]);
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
