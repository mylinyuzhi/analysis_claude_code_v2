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
  onFocus?: (item: SelectOption) => void;
}

export const Select: React.FC<SelectProps> = ({
  items,
  onSelect,
  initialIndex = 0,
  onFocus,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    const item = items[selectedIndex];
    if (item) onFocus?.(item);
  }, [items, onFocus, selectedIndex]);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
    } else if (key.return) {
      const item = items[selectedIndex];
      if (item) onSelect(item);
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
