import React from 'react';
import { Box, Text, useInput } from 'ink';

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = ''
}) => {
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
      {value.length === 0 && placeholder && <Text color="gray">{placeholder}</Text>}
      <Text inverse> </Text>
    </Box>
  );
};
