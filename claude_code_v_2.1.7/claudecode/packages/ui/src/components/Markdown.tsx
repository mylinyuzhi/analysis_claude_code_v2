import React from 'react';
import { Box, Text } from 'ink';
import { renderMarkdown } from '../markdown/renderer.js';
import type { MarkdownToken, MarkdownRendererOptions } from '../markdown/types.js';

export interface MarkdownProps {
  tokens: MarkdownToken[];
  options?: MarkdownRendererOptions;
}

/**
 * Markdown component for Ink.
 * Renders parsed markdown tokens using StyledText from renderer.ts.
 */
export const Markdown: React.FC<MarkdownProps> = ({ tokens, options }) => {
  const { lines } = renderMarkdown(tokens, options);

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Box key={i} flexDirection="row">
          {line.map((segment, j) => {
            const { text, style } = segment;
            return (
              <Text
                key={j}
                bold={style?.bold}
                italic={style?.italic}
                underline={style?.underline}
                strikethrough={style?.strikethrough}
                color={style?.color}
                backgroundColor={style?.bgColor}
                dimColor={style?.dimColor}
                inverse={style?.inverse}
              >
                {text}
              </Text>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
