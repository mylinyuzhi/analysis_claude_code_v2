import React, { useState, useRef, useMemo } from 'react';
import { Text } from 'ink';
import { useInterval } from '../hooks/useInterval.js';

// ============================================
// Constants & Utilities
// ============================================

export const RAINBOW_COLORS = [
  'rainbow_red',
  'rainbow_orange',
  'rainbow_yellow',
  'rainbow_green',
  'rainbow_blue',
  'rainbow_indigo',
  'rainbow_violet',
];

export const RAINBOW_SHIMMER_COLORS = [
  'rainbow_red_shimmer',
  'rainbow_orange_shimmer',
  'rainbow_yellow_shimmer',
  'rainbow_green_shimmer',
  'rainbow_blue_shimmer',
  'rainbow_indigo_shimmer',
  'rainbow_violet_shimmer',
];

/**
 * Get rainbow color based on index.
 * Original: $jA in chunks.68.mjs
 */
export function getRainbowColor(index: number, isShimmer: boolean): string {
  const colors = isShimmer ? RAINBOW_SHIMMER_COLORS : RAINBOW_COLORS;
  return colors[index % colors.length]!;
}

// ============================================
// Hooks
// ============================================

/**
 * useShimmerAnimation - Hook for traveling highlight effect
 * Original: $6A in chunks.107.mjs
 */
export function useShimmerAnimation(
  status: 'requesting' | string,
  text: string,
  enabled = true,
  paused = false,
  initialIndex?: number
) {
  const startTime = useRef(Date.now());
  const [glimmerIndex, setGlimmerIndex] = useState(
    initialIndex ?? (status === 'requesting' ? -1 : 10)
  );

  const interval = useMemo(() => {
    return status === 'requesting' ? 50 : 200;
  }, [status]);

  useInterval(() => {
    if (!enabled || paused) return;

    const elapsed = Date.now() - startTime.current;
    const tickCount = Math.floor(elapsed / interval);
    const textLength = text.length;
    const cycleLength = textLength + 20;

    if (status === 'requesting') {
      // Forward direction
      setGlimmerIndex((tickCount % cycleLength) - 10);
    } else {
      // Backward direction
      setGlimmerIndex(textLength + 10 - (tickCount % cycleLength));
    }
  }, interval);

  return glimmerIndex;
}

// ============================================
// Components
// ============================================

/**
 * AnimatedChar - Single character with shimmer highlight
 * Original: ws in chunks.107.mjs
 */
export const AnimatedChar: React.FC<{
  char: string;
  index: number;
  glimmerIndex: number;
  messageColor?: string;
  shimmerColor?: string;
}> = ({ char, index, glimmerIndex, messageColor, shimmerColor }) => {
  const isCenter = index === glimmerIndex;
  const isAdjacent = Math.abs(index - glimmerIndex) === 1;
  const color = isCenter || isAdjacent ? shimmerColor : messageColor;

  return <Text color={color}>{char}</Text>;
};

/**
 * AnimatedMessage - Renders a message with shimmer effects
 * Original: XE0 in chunks.107.mjs
 */
export const AnimatedMessage: React.FC<{
  message: string;
  mode: string;
  isConnected?: boolean;
  messageColor?: string;
  shimmerColor?: string;
  glimmerIndex: number;
}> = ({
  message,
  mode,
  isConnected = true,
  messageColor,
  shimmerColor,
  glimmerIndex,
}) => {
  if (!message) return null;
  if (!isConnected) return <Text color={messageColor}>{message} </Text>;

  return (
    <>
      {message.split('').map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          glimmerIndex={glimmerIndex}
          messageColor={messageColor}
          shimmerColor={shimmerColor}
        />
      ))}
      <Text> </Text>
    </>
  );
};
