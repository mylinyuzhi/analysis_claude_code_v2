import React from 'react';
import { Box, Text } from 'ink';

/**
 * Divider component - renders a horizontal line.
 * Original: K8 in chunks.150.mjs
 */
export const Divider: React.FC<{ dividerColor?: string }> = ({ dividerColor = 'gray' }) => {
  return (
    <Box flexDirection="row">
      <Text color={dividerColor}>{'─'.repeat(80)}</Text>
    </Box>
  );
};

export interface IDEDiffSupportProps {
  onChange: (option: any, input: any, feedback?: string) => void;
  options: any[];
  input: any;
  filePath: string;
  ideName: string;
  rejectFeedback: string;
  acceptFeedback: string;
  setFocusedOption: (option: string) => void;
  onInputModeToggle: (id: string) => void;
  focusedOption: string;
  yesInputMode: boolean;
  noInputMode: boolean;
}

/**
 * IDEDiffSupport - Component for IDE-based diff review.
 * Original: AD9 in chunks.150.mjs
 */
export const IDEDiffSupport: React.FC<IDEDiffSupportProps> = ({
  onChange,
  options,
  input,
  filePath,
  ideName,
  rejectFeedback,
  acceptFeedback,
  setFocusedOption,
  onInputModeToggle,
  focusedOption,
  yesInputMode,
  noInputMode,
}) => {
  // Simple path formatter (matches Rq7 intent)
  const formatPath = (path: string) => path;

  return (
    <Box flexDirection="column">
      <Divider dividerColor="yellow" />
      <Box marginX={1} flexDirection="column" gap={1}>
        <Text bold color="yellow">
          Opened changes in {ideName} ⧉
        </Text>
        
        {/* Instruction to save in IDE */}
        <Text dimColor>Save file to continue…</Text>

        <Box flexDirection="column">
          <Text>
            Do you want to make this edit to <Text bold>{formatPath(filePath)}</Text>?
          </Text>
          
          {/* Simple option list since k0 is not fully restored */}
          <Box flexDirection="column" marginTop={1}>
            {options.map((opt) => (
              <Box key={opt.value}>
                <Text color={focusedOption === opt.value ? 'cyan' : 'white'}>
                  {focusedOption === opt.value ? '❯ ' : '  '}
                  {opt.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        <Box marginTop={1}>
          <Text dimColor>
            Esc to cancel
            {((focusedOption === 'yes' && !yesInputMode) || (focusedOption === 'no' && !noInputMode)) &&
              ' · Tab to add additional instructions'}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
