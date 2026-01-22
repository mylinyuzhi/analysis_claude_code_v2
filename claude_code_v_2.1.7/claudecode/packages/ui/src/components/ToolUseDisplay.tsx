import React from 'react';
import { Box, Text } from 'ink';
import type { ToolUseDisplayProps } from './types.js';
import { StatusIndicator } from './status.js';

const BULLET_CHAR = process.platform === 'darwin' ? '⏺' : '●';

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function bestEffortParseJson(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const s = value.trim();
  if (s === '') return value;
  try {
    return JSON.parse(s);
  } catch {
    return value;
  }
}

/**
 * Best-effort tool use message renderer.
 * Source has per-tool renderers; reconstruction keeps a compact fallback.
 */
export function renderToolUseMessage(toolName: string, toolInput: unknown): string {
  const normalized = bestEffortParseJson(toolInput);
  const input = normalized as any;
  switch (toolName) {
    case 'Bash':
      return String(input?.command ?? '');
    case 'Read':
      return String(input?.file_path ?? '');
    case 'LS':
      return String(input?.path ?? '');
    case 'Glob':
      return String(input?.pattern ?? '');
    case 'Grep':
      return `${String(input?.pattern ?? '')}${input?.path ? ` @ ${String(input.path)}` : ''}`;
    default:
      return typeof normalized === 'string' ? normalized : safeJson(normalized);
  }
}

/**
 * Best-effort progress renderer (shows last progress line if present).
 */
export function renderToolUseProgress(progressMessagesForMessage?: unknown[]): string {
  if (!Array.isArray(progressMessagesForMessage) || progressMessagesForMessage.length === 0) return '';

  const last = progressMessagesForMessage[progressMessagesForMessage.length - 1] as any;
  const data = last?.data;
  if (!data) return '';
  if (typeof data?.content === 'string') return data.content;
  if (typeof last?.message === 'string') return last.message;
  return '';
}

/**
 * ToolUseDisplay - renders a single tool_use block with status dot.
 * Original: VZ2 in chunks.97.mjs
 */
export const ToolUseDisplay: React.FC<ToolUseDisplayProps> = ({
  param,
  tools,
  erroredToolUseIDs,
  inProgressToolUseIDs,
  resolvedToolUseIDs,
  progressMessagesForMessage,
  shouldAnimate = true,
  shouldShowDot = true,
}) => {
  const toolName = param?.name;
  const toolUseId = param?.id;
  if (!toolName || !toolUseId) return null;

  const toolDef = (Array.isArray(tools) ? tools : []).find((t: any) => t?.name === toolName) as any;
  if (!toolDef) return null;

  const isResolved = resolvedToolUseIDs?.has(toolUseId) ?? false;
  const isInProgress = inProgressToolUseIDs?.has(toolUseId) ?? false;
  const isErrored = erroredToolUseIDs?.has(toolUseId) ?? false;
  const isAborted = !isInProgress && !isResolved;

  // safeParse tool input if schema exists
  let parsedInput: any = param.input;
  let parseOk = true;
  const schema = toolDef?.inputSchema;
  if (schema && typeof schema.safeParse === 'function') {
    const r = schema.safeParse(param.input);
    parseOk = Boolean(r?.success);
    parsedInput = r?.success ? r.data : param.input;
  }

  const displayNameFn = toolDef?.userFacingName;
  const displayName = typeof displayNameFn === 'function' ? String(displayNameFn(parseOk ? parsedInput : undefined)) : String(toolName);
  if (displayName === '') return null;

  const bgFn = toolDef?.userFacingNameBackgroundColor;
  const backgroundColor = typeof bgFn === 'function' ? bgFn(parsedInput) : undefined;

  const message = renderToolUseMessage(toolName, parsedInput);
  const progress = renderToolUseProgress(progressMessagesForMessage);

  const tag = parseOk && typeof toolDef?.renderToolUseTag === 'function' ? toolDef.renderToolUseTag(parsedInput) : null;

  return (
    <Box flexDirection="row" justifyContent="space-between" width="100%">
      <Box flexDirection="column">
        <Box flexDirection="row" flexWrap="nowrap">
          {shouldShowDot && (
            isAborted ? (
              <Box minWidth={2}>
                <Text dimColor>{BULLET_CHAR}</Text>
              </Box>
            ) : (
              <StatusIndicator shouldAnimate={shouldAnimate} isUnresolved={!isResolved} isError={isErrored} />
            )
          )}

          <Box flexShrink={0}>
            <Text bold wrap="truncate-end" backgroundColor={backgroundColor}>
              {displayName}
            </Text>
          </Box>

          {message !== '' && (
            <Box flexWrap="nowrap">
              <Text>({message})</Text>
            </Box>
          )}

          {tag}
        </Box>

        {!isResolved && !isAborted && progress !== '' && (
          <Box paddingLeft={2}>
            <Text dimColor>{progress}</Text>
          </Box>
        )}

        {!isResolved && isAborted && (
          <Box paddingLeft={2}>
            <Text dimColor>Aborted</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
