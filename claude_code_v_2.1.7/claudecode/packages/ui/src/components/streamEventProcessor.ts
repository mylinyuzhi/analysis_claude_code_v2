/**
 * streamEventProcessor - Stream event to UI state router
 * Original: $K1 in chunks.147.mjs
 *
 * NOTE: This is a minimal, dependency-light port that relies on runtime shape
 * checks (duck typing) instead of importing core types.
 */

export type UIStreamingStatus = 'requesting' | 'thinking' | 'responding' | 'tool-input' | 'tool-use';

export type ToolInputPreview = {
  index: number;
  contentBlock: unknown;
  unparsedToolInput: string;
};

export type ThinkingState = {
  thinking: string;
  isStreaming: boolean;
  streamingEndedAt?: number;
};

export function streamEventProcessor(
  event: any,
  addMessage: (msg: any) => void,
  updateDelta: (delta: string) => void,
  setStatus: (status: UIStreamingStatus) => void,
  setToolInputs: (updater: (prev: ToolInputPreview[]) => ToolInputPreview[]) => void,
  setTombstone?: (msg: any) => void,
  setThinkingState?: (updater: (prev: ThinkingState | null) => ThinkingState | null) => void
): void {
  // Non-stream events
  if (event?.type !== 'stream_event' && event?.type !== 'stream_request_start') {
    if (event?.type === 'tombstone') {
      setTombstone?.(event.message);
      return;
    }

    if (event?.type === 'assistant') {
      const blocks = event?.message?.content;
      if (Array.isArray(blocks)) {
        const thinkingBlock = blocks.find((c: any) => c?.type === 'thinking');
        if (thinkingBlock?.type === 'thinking') {
          setThinkingState?.(() => ({
            thinking: String(thinkingBlock.thinking ?? ''),
            isStreaming: false,
            streamingEndedAt: Date.now(),
          }));
        }
      }
    }

    addMessage(event);
    return;
  }

  if (event?.type === 'stream_request_start') {
    setStatus('requesting');
    return;
  }

  const ev = event?.event;
  if (!ev || typeof ev !== 'object') return;

  if (ev.type === 'message_stop') {
    setStatus('tool-use');
    setToolInputs(() => []);
    return;
  }

  switch (ev.type) {
    case 'content_block_start': {
      const block = ev.content_block;
      const blockType = block?.type;
      if (blockType === 'thinking' || blockType === 'redacted_thinking') {
        setStatus('thinking');
        return;
      }
      if (blockType === 'text') {
        setStatus('responding');
        return;
      }
      if (blockType === 'tool_use') {
        setStatus('tool-input');
        const idx = Number(ev.index ?? 0);
        setToolInputs((prev) => [...prev, { index: idx, contentBlock: block, unparsedToolInput: '' }]);
        return;
      }
      
      const toolInputTypes = [
        'server_tool_use',
        'web_search_tool_result',
        'code_execution_tool_result',
        'mcp_tool_use',
        'mcp_tool_result',
        'container_upload',
        'web_fetch_tool_result',
        'bash_code_execution_tool_result',
        'text_editor_code_execution_tool_result'
      ];

      if (toolInputTypes.includes(blockType)) {
        setStatus('tool-input');
        return;
      }
      return;
    }

    case 'content_block_delta': {
      const delta = ev.delta;
      if (!delta) return;
      switch (delta.type) {
        case 'text_delta':
          updateDelta(String(delta.text ?? ''));
          return;
        case 'input_json_delta': {
          const partial = String(delta.partial_json ?? '');
          const idx = Number(ev.index ?? 0);
          updateDelta(partial);
          setToolInputs((prev) => {
            const existing = prev.find((t) => t.index === idx);
            if (!existing) return prev;
            return [
              ...prev.filter((t) => t !== existing),
              { ...existing, unparsedToolInput: existing.unparsedToolInput + partial },
            ];
          });
          return;
        }
        case 'thinking_delta':
          updateDelta(String(delta.thinking ?? ''));
          return;
        case 'signature_delta':
          updateDelta(String(delta.signature ?? ''));
          return;
        default:
          return;
      }
    }

    case 'content_block_stop':
      return;

    case 'message_delta':
      setStatus('responding');
      return;

    default:
      setStatus('responding');
      return;
  }
}

