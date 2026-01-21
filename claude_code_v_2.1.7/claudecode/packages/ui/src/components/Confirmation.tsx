import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

export interface ConfirmationProps {
  message: string;
  defaultChoice?: 'yes' | 'no';
  onConfirm: () => void;
  onDeny: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  message,
  defaultChoice = 'yes',
  onConfirm,
  onDeny,
}) => {
  const [isYes, setIsYes] = useState(defaultChoice === 'yes');

  useInput((input, key) => {
    if (input === 'y' || input === 'Y') {
      setIsYes(true);
      // Wait a tick to show selection before confirming? 
      // Or confirm immediately? Immediate is usually better for CLI.
      onConfirm();
    } else if (input === 'n' || input === 'N') {
      setIsYes(false);
      onDeny();
    } else if (key.return) {
      if (isYes) {
        onConfirm();
      } else {
        onDeny();
      }
    } else if (key.leftArrow || key.rightArrow) {
      setIsYes(!isYes);
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{message}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="gray">Allow? </Text>
        <Text color={isYes ? 'green' : 'gray'} bold={isYes}>
          [Y]es
        </Text>
        <Text color="gray"> / </Text>
        <Text color={!isYes ? 'red' : 'gray'} bold={!isYes}>
          [N]o
        </Text>
      </Box>
    </Box>
  );
};
