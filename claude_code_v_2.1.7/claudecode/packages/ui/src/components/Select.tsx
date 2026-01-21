import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  items: SelectOption[];
  onSelect: (item: SelectOption) => void;
  initialIndex?: number;
}

export const Select: React.FC<SelectProps> = ({
  items,
  onSelect,
  initialIndex = 0,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
    } else if (key.return) {
      onSelect(items[selectedIndex]);
    }
  });

  return (
    <Box flexDirection="column">
      {items.map((item, index) => (
        <Box key={item.value}>
          <Text color={index === selectedIndex ? 'cyan' : 'white'}>
            {index === selectedIndex ? '❯ ' : '  '}
            {item.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
