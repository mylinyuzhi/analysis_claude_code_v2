import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Text, useInput, useStdin, Transform } from 'ink';
import type { Key } from 'ink';
import { AnimatedChar, useShimmerAnimation, getRainbowColor } from './animations.js';
import { useTerminalFocus } from './status.js';

// ============================================
// Types
// ============================================

export interface Highlight {
  start: number;
  end: number;
  style: {
    type: 'rainbow' | 'shimmer' | 'solid';
    color?: string;
    baseColor?: string;
    shimmerColor?: string;
  };
}

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  placeholderElement?: React.ReactNode;
  focus?: boolean;
  showCursor?: boolean;
  cursorOffset?: number;
  highlights?: Highlight[];
  argumentHint?: string;
  dimColor?: boolean;
  onPaste?: (text: string) => void;
  onImagePaste?: (base64: string, mediaType: string, filename?: string, dimensions?: any, path?: string) => void;
  onIsPastingChange?: (isPasting: boolean) => void;
}

// ============================================
// Hooks
// ============================================

/**
 * usePasteDetection - Detects terminal paste operations using Bracketed Paste Mode
 * Original: s19 in chunks.135.mjs
 */
function usePasteDetection({
  onPaste,
  onInput,
  onImagePaste,
}: {
  onPaste?: (text: string) => void;
  onInput: (char: string, key: Key) => void;
  onImagePaste?: (base64: string, mediaType: string, filename?: string, dimensions?: any, path?: string) => void;
}) {
  const { stdin } = useStdin();
  const [isPasting, setIsPasting] = useState(false);
  const isPastingRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleData = useCallback((data: Buffer) => {
    const str = data.toString();
    
    // Bracketed Paste Mode sequences
    if (str.includes('\x1B[200~')) {
      setIsPasting(true);
      isPastingRef.current = true;
    }

    if (str.includes('\x1B[201~')) {
      isPastingRef.current = false;
      if (isMounted.current) {
        setIsPasting(false);
        // Process collected chunks
        const pastedText = chunksRef.current.join('')
          .replace(/\x1B\[200~/g, '')
          .replace(/\x1B\[201~/g, '')
          .replace(/\x1B\[I/g, '')
          .replace(/\x1B\[O/g, '');
        
        if (onPaste && pastedText.length > 0) {
          onPaste(pastedText);
        }
        chunksRef.current = [];
      }
    }
  }, [onPaste]);

  useEffect(() => {
    if (!stdin) return;
    stdin.on('data', handleData);
    return () => {
      stdin.off('data', handleData);
    };
  }, [stdin, handleData]);

  const wrappedOnInput = useCallback((char: string, key: Key) => {
    if (isPastingRef.current) {
      chunksRef.current.push(char);
      return;
    }
    onInput(char, key);
  }, [onInput]);

  return { wrappedOnInput, isPasting };
}

/**
 * usePlaceholder - Manages placeholder rendering logic
 * Original: e19 in chunks.135.mjs
 */
function usePlaceholder({
  placeholder,
  value,
  showCursor,
  focus,
  terminalFocus = true,
}: {
  placeholder?: string;
  value: string;
  showCursor?: boolean;
  focus?: boolean;
  terminalFocus?: boolean;
}) {
  const renderedPlaceholder = useMemo(() => {
    if (!placeholder) return undefined;
    
    // In source, it uses I1.dim and I1.inverse
    if (showCursor && focus && terminalFocus) {
      if (placeholder.length > 0) {
        return (
          <Text>
            <Text inverse>{placeholder[0]}</Text>
            <Text dimColor>{placeholder.slice(1)}</Text>
          </Text>
        );
      }
      return <Text inverse> </Text>;
    }
    return <Text dimColor>{placeholder}</Text>;
  }, [placeholder, showCursor, focus, terminalFocus]);

  const showPlaceholder = value.length === 0 && Boolean(placeholder);

  return { renderedPlaceholder, showPlaceholder };
}

// ============================================
// Components
// ============================================

/**
 * HighlightedText - Renders text with highlight segments
 * Original: dH1 in chunks.135.mjs
 */
const HighlightedText: React.FC<{ text: string; highlights: Highlight[] }> = ({ text, highlights }) => {
  const glimmerIndex = useShimmerAnimation('requesting', text);

  // Simple segmentation logic for now
  // In source this is B09(text, highlights)
  const segments = useMemo(() => {
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const result: Array<{ text: string; start: number; end: number; highlight?: Highlight }> = [];
    let lastIndex = 0;

    for (const h of sorted) {
      if (h.start > lastIndex) {
        result.push({ text: text.substring(lastIndex, h.start), start: lastIndex, end: h.start });
      }
      result.push({ text: text.substring(h.start, h.end), start: h.start, end: h.end, highlight: h });
      lastIndex = h.end;
    }

    if (lastIndex < text.length) {
      result.push({ text: text.substring(lastIndex), start: lastIndex, end: text.length });
    }

    return result;
  }, [text, highlights]);

  return (
    <>
      {segments.map((s, i) => {
        if (!s.highlight) return <Text key={i}>{s.text}</Text>;
        
        const { style } = s.highlight;
        if (style.type === 'rainbow') {
          return s.text.split('').map((char, charIdx) => (
            <AnimatedChar
              key={`${i}-${charIdx}`}
              char={char}
              index={s.start + charIdx}
              glimmerIndex={glimmerIndex}
              messageColor={getRainbowColor(charIdx, false)}
              shimmerColor={getRainbowColor(charIdx, true)}
            />
          ));
        } else if (style.type === 'shimmer') {
          return s.text.split('').map((char, charIdx) => (
            <AnimatedChar
              key={`${i}-${charIdx}`}
              char={char}
              index={s.start + charIdx}
              glimmerIndex={glimmerIndex}
              messageColor={style.baseColor}
              shimmerColor={style.shimmerColor}
            />
          ));
        } else if (style.type === 'solid') {
          return <Text key={i} color={style.color}>{s.text}</Text>;
        }
        return <Text key={i}>{s.text}</Text>;
      })}
    </>
  );
};

/**
 * TextInput - Main input component
 * Aligning with cH1 in chunks.135.mjs
 */
export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  placeholderElement,
  focus = true,
  showCursor = true,
  cursorOffset = 0,
  highlights = [],
  argumentHint,
  dimColor,
  onPaste,
  onImagePaste,
  onIsPastingChange,
  ...props
}) => {
  // Hook: Detect paste operations
  const { wrappedOnInput, isPasting } = usePasteDetection({
    onPaste,
    onInput: (char, key) => {
      // Basic input handling
      if (key.return) {
        onSubmit(value);
        return;
      }
      if (key.backspace || key.delete) {
        onChange(value.slice(0, -1));
        return;
      }
      if (!key.ctrl && !key.meta) {
        onChange(value + char);
      }
    },
    onImagePaste,
  });

  useEffect(() => {
    if (onIsPastingChange) onIsPastingChange(isPasting);
  }, [isPasting, onIsPastingChange]);

  const terminalFocus = useTerminalFocus();

  // Hook: Manage placeholder display
  const { showPlaceholder, renderedPlaceholder } = usePlaceholder({
    placeholder,
    value,
    showCursor,
    focus,
    terminalFocus,
  });

  // Register input handler
  useInput(wrappedOnInput, { isActive: focus });

  // Argument hint logic
  const hasTrailingSpace = value.trim().indexOf(' ') === -1 || value.endsWith(' ');
  const shouldShowArgumentHint = Boolean(argumentHint && value && hasTrailingSpace && value.startsWith('/'));

  // Filter highlights that conflict with cursor position
  const filteredHighlights = (showCursor && highlights)
    ? highlights.filter(h => cursorOffset < h.start || cursorOffset >= h.end)
    : highlights;
  const hasHighlights = filteredHighlights && filteredHighlights.length > 0;

  return (
    <Box>
      <Text wrap="truncate-end" dimColor={dimColor}>
        {showPlaceholder && placeholderElement
          ? placeholderElement
          : showPlaceholder && renderedPlaceholder
            ? renderedPlaceholder
            : hasHighlights
              ? <HighlightedText text={value} highlights={filteredHighlights} />
              : <Transform>{value}</Transform>}
        {shouldShowArgumentHint && (
          <Text dimColor={true}>
            {value.endsWith(' ') ? '' : ' '}
            {argumentHint}
          </Text>
        )}
      </Text>
    </Box>
  );
};
