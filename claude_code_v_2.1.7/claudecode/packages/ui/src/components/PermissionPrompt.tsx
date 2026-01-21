import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { Select } from './Select.js';
import { TextInput } from './TextInput.js';

export type PermissionResponse = 
  | { type: 'allow' }
  | { type: 'allow-always' }
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

  const options = [
    { label: 'Yes', value: 'yes' },
    { label: 'Yes, and don\'t ask again for this tool', value: 'yes-always' },
    { label: 'No', value: 'no' },
    { label: 'No, with feedback', value: 'no-feedback' },
  ];

  if (isProvidingFeedback) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginY={1}>
        <Box marginBottom={1}>
          <Text bold color="yellow">Permission Request - Feedback</Text>
        </Box>
        <Box marginBottom={1}>
           <Text>Please provide feedback for why this tool use is being denied:</Text>
        </Box>
        <TextInput 
          value={feedback}
          onChange={setFeedback}
          onSubmit={(value) => onRespond({ type: 'deny-with-feedback', feedback: value })}
          placeholder="Type your reason..."
        />
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
              setIsProvidingFeedback(true);
            } else {
              onRespond({ type: 'deny' });
            }
          }}
        />
      </Box>
    </Box>
  );
};
