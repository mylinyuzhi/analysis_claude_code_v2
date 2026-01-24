import React, { useState, useEffect, type ReactNode } from 'react';
import { Box, Text, useInput } from 'ink';

export interface SelectOption {
  label: ReactNode;
  value: string;
}

type SelectPropsNewApi = {
  /** New API used by CLI reconstruction */
  options: SelectOption[];
  onChange: (value: string) => void;
  initialIndex?: number;
  onFocus?: (item: SelectOption) => void;
};

type SelectPropsLegacyApi = {
  /** Legacy API kept for internal callers */
  items: SelectOption[];
  onSelect: (item: SelectOption) => void;
  initialIndex?: number;
  onFocus?: (item: SelectOption) => void;
};

export type SelectProps = SelectPropsNewApi | SelectPropsLegacyApi;

export const Select: React.FC<SelectProps> = (props) => {
  const items = 'options' in props ? props.options : props.items;
  const initialIndex = props.initialIndex ?? 0;
  const onFocus = props.onFocus;

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
      if (!item) return;

      if ('onChange' in props) {
        props.onChange(item.value);
      } else {
        props.onSelect(item);
      }
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
