import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Select } from './Select.js';
import { TextInput } from './TextInput.js';

export type PermissionResponse = 
  | { type: 'allow' }
  | { type: 'allow-with-feedback', feedback: string }
  | { type: 'allow-always' }
  | { type: 'allow-always-with-feedback', feedback: string }
  | { type: 'deny' }
  | { type: 'deny-with-feedback', feedback: string };

export interface PermissionPromptProps {
  tool: string;
  input: any;
  onRespond: (response: PermissionResponse) => void;
}

export const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  tool,
  input,
  onRespond,
}) => {
  const [isProvidingFeedback, setIsProvidingFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [focusedOption, setFocusedOption] = useState<'yes' | 'yes-always' | 'no' | 'no-feedback'>('yes');
  const [feedbackTarget, setFeedbackTarget] = useState<'yes' | 'yes-always' | 'no'>('yes');

  // Esc cancels; Tab jumps into feedback mode (source-aligned hint)
  useInput((_, key) => {
    if (key.escape) {
      onRespond({ type: 'deny' });
      return;
    }
    if (key.tab) {
      // Tab 作为“输入模式”开关
      if (isProvidingFeedback) {
        setIsProvidingFeedback(false);
        return;
      }

      // 只有在当前高亮的选项支持“额外指令”时才进入输入模式
      if (focusedOption === 'yes' || focusedOption === 'yes-always') {
        setFeedbackTarget(focusedOption);
        setIsProvidingFeedback(true);
      } else if (focusedOption === 'no') {
        setFeedbackTarget('no');
        setIsProvidingFeedback(true);
      }
    }
  });

  // Keep feedback input cleared when leaving feedback mode
  useEffect(() => {
    if (!isProvidingFeedback) setFeedback('');
  }, [isProvidingFeedback]);

  let message = `Claude wants to use tool: ${tool}`;
  let details = '';
  let riskMessage = '';
  let riskColor = 'yellow';

  // Customize message based on tool
  if (tool === 'Bash') {
    message = 'Claude wants to execute a command:';
    details = input?.command || JSON.stringify(input);
    riskMessage = 'Executing shell commands can modify your system.';
    riskColor = 'red';
  } else if (tool === 'Read') {
    message = 'Claude wants to read a file:';
    details = input?.file_path || JSON.stringify(input);
  } else if (tool === 'Write') {
    message = 'Claude wants to write to a file:';
    details = input?.file_path || JSON.stringify(input);
    riskMessage = 'This will modify files on your disk.';
  } else if (tool === 'Edit') {
    message = 'Claude wants to edit a file:';
    details = input?.file_path || JSON.stringify(input);
    riskMessage = 'This will modify files on your disk.';
  } else if (tool === 'Glob') {
    message = 'Claude wants to search for files:';
    details = `Pattern: ${input?.pattern}`;
  } else if (tool === 'Grep') {
    message = 'Claude wants to search in files:';
    details = `Pattern: ${input?.pattern} in ${input?.path || '.'}`;
  } else if (tool === 'LS') {
    message = 'Claude wants to list files in:';
    details = input?.path || '.';
  }

  const options = useMemo(
    () => [
      { label: 'Yes', value: 'yes' },
      { label: "Yes, and don't ask again for this tool", value: 'yes-always' },
      { label: 'No', value: 'no' },
      { label: 'No, with feedback', value: 'no-feedback' },
    ],
    []
  );

  if (isProvidingFeedback) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginY={1}>
        <Box marginBottom={1}>
          <Text bold color="yellow">Permission Request - Additional Instructions</Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            {feedbackTarget === 'no'
              ? 'Tell Claude what to do differently:'
              : 'Tell Claude what to do next:'}
          </Text>
        </Box>
        <TextInput 
          value={feedback}
          onChange={setFeedback}
          onSubmit={(value) => {
            if (feedbackTarget === 'no') {
              onRespond({ type: 'deny-with-feedback', feedback: value });
              return;
            }
            if (feedbackTarget === 'yes-always') {
              onRespond({ type: 'allow-always-with-feedback', feedback: value });
              return;
            }
            onRespond({ type: 'allow-with-feedback', feedback: value });
          }}
          placeholder={feedbackTarget === 'no' ? 'and tell Claude what to do differently' : 'and tell Claude what to do next'}
        />
        <Box marginTop={1}>
          <Text dimColor>Esc to cancel</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginY={1}>
      <Box marginBottom={1}>
        <Text bold color="yellow">Permission Request</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>{message}</Text>
      </Box>
      <Box marginBottom={1} paddingLeft={2}>
        <Text color="cyan">{details}</Text>
      </Box>
      {riskMessage && (
        <Box marginBottom={1}>
          <Text color={riskColor}>Warning: {riskMessage}</Text>
        </Box>
      )}
      <Box>
        <Select
          items={options}
          onSelect={(item) => {
            if (item.value === 'yes') {
              onRespond({ type: 'allow' });
            } else if (item.value === 'yes-always') {
              onRespond({ type: 'allow-always' });
            } else if (item.value === 'no-feedback') {
              setFeedbackTarget('no');
              setIsProvidingFeedback(true);
            } else {
              onRespond({ type: 'deny' });
            }
          }}
          onFocus={(item) => {
            // 记录当前高亮项，用于决定 Tab 是否可进入“额外指令”输入模式
            if (
              item.value === 'yes' ||
              item.value === 'yes-always' ||
              item.value === 'no' ||
              item.value === 'no-feedback'
            ) {
              setFocusedOption(item.value);
            }
          }}
        />
      </Box>
      <Box marginTop={1}>
        <Text dimColor>
          {'Esc to cancel'}
          {(focusedOption === 'yes' || focusedOption === 'yes-always' || focusedOption === 'no')
            ? ' · Tab to add additional instructions'
            : ''}
        </Text>
      </Box>
    </Box>
  );
};
