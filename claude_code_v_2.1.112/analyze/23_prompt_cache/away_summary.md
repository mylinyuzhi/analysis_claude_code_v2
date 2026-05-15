# `generateAwaySummary` — Session Recap Generator (Deep Deobfuscation)

**v2.1.88 source:** `claude-code-kim/src/services/awaySummary.ts:29-74`
**v2.1.112 source:** `chunks.116.mjs:898-942`
**Renamed conceptually in changelog:** `generateSessionRecap` — refers to the same function

## What it does

Produces the 1-2 sentence "while you were away" summary used by:
- The auto-recap on terminal blur (`useAwaySummaryEffect`)
- The manual `/recap` slash command (`runRecapCommand`)

It runs a **separate, isolated LLM call** using the small-fast model (Haiku) with a tightly constrained prompt, **no tools**, **no caching writes**, and **at most one turn**.

## v2.1.88 implementation

```typescript
// v2.1.88 — claude-code-kim/src/services/awaySummary.ts:1-74
import { APIUserAbortError } from '@anthropic-ai/sdk'
import { getEmptyToolPermissionContext } from '../Tool.js'
import type { Message } from '../types/message.js'
import { logForDebugging } from '../utils/debug.js'
import {
  createUserMessage,
  getAssistantMessageText,
} from '../utils/messages.js'
import { getSmallFastModel } from '../utils/model/model.js'
import { asSystemPrompt } from '../utils/systemPromptType.js'
import { queryModelWithoutStreaming } from './api/claude.js'
import { getSessionMemoryContent } from './SessionMemory/sessionMemoryUtils.js'

// Recap only needs recent context — truncate to avoid "prompt too long" on
// large sessions. 30 messages ≈ ~15 exchanges, plenty for "where we left off."
const RECENT_MESSAGE_WINDOW = 30

function buildAwaySummaryPrompt(memory: string | null): string {
  const memoryBlock = memory
    ? `Session memory (broader context):\n${memory}\n\n`
    : ''
  return `${memoryBlock}The user stepped away and is coming back. Write exactly 1-3 short sentences. Start by stating the high-level task — what they are building or debugging, not implementation details. Next: the concrete next step. Skip status reports and commit recaps.`
}

/**
 * Generates a short session recap for the "while you were away" card.
 * Returns null on abort, empty transcript, or error.
 */
export async function generateAwaySummary(
  messages: readonly Message[],
  signal: AbortSignal,
): Promise<string | null> {
  if (messages.length === 0) {
    return null
  }

  try {
    const memory = await getSessionMemoryContent()
    const recent = messages.slice(-RECENT_MESSAGE_WINDOW)
    recent.push(createUserMessage({ content: buildAwaySummaryPrompt(memory) }))
    const response = await queryModelWithoutStreaming({
      messages: recent,
      systemPrompt: asSystemPrompt([]),
      thinkingConfig: { type: 'disabled' },
      tools: [],
      signal,
      options: {
        getToolPermissionContext: async () => getEmptyToolPermissionContext(),
        model: getSmallFastModel(),
        toolChoice: undefined,
        isNonInteractiveSession: false,
        hasAppendSystemPrompt: false,
        agents: [],
        querySource: 'away_summary',
        mcpTools: [],
        skipCacheWrite: true,
      },
    })

    if (response.isApiErrorMessage) {
      logForDebugging(
        `[awaySummary] API error: ${getAssistantMessageText(response)}`,
      )
      return null
    }
    return getAssistantMessageText(response)
  } catch (err) {
    if (err instanceof APIUserAbortError || signal.aborted) {
      return null
    }
    logForDebugging(`[awaySummary] generation failed: ${err}`)
    return null
  }
}
```

## v2.1.112 implementation

```javascript
// ============================================
// generateAwaySummary - Run isolated LLM call for "while you were away" summary
// Location: chunks.116.mjs:898-936
// ============================================

// ORIGINAL (for source lookup):
async function Vu8(q) {
    let K = XJ6();
    if (!K) return E("[awaySummary] no CacheSafeParams saved, skipping"), null;
    let _ = new AbortController;
    q.addEventListener("abort", () => _.abort(), {
        once: !0
    });
    try {
        let {
            messages: z
        } = await rP({
            promptMessages: [t8({
                content: OEz
            })],
            cacheSafeParams: K,
            overrides: {
                abortController: _
            },
            canUseTool: async () => ({
                behavior: "deny",
                message: "Away summary cannot use tools",
                decisionReason: {
                    type: "other",
                    reason: "away_summary"
                }
            }),
            querySource: "away_summary",
            forkLabel: "away_summary",
            maxTurns: 1,
            skipCacheWrite: !0,
            skipTranscript: !0
        });
        if (q.aborted) return null;
        return wEz(z) || null
    } catch (z) {
        if (q.aborted) return null;
        return E(`[awaySummary] generation failed: ${z}`), null
    }
}

// READABLE (for understanding):
async function generateAwaySummary(abortSignal) {
  // Step 1: Pull the saved cache-safe params (system prompt, tool schemas, recent messages)
  const cacheSafeParams = getSavedCacheSafeParams();
  if (!cacheSafeParams) {
    log("[awaySummary] no CacheSafeParams saved, skipping");
    return null;
  }

  // Step 2: Wire the external abort signal to an internal AbortController
  // (so we can also abort the LLM call if the recap is cancelled mid-call)
  const internalAbort = new AbortController();
  abortSignal.addEventListener("abort", () => internalAbort.abort(), { once: true });

  try {
    // Step 3: Fork the query through the standard query pipeline (rP) with constraints:
    // - One synthetic user message containing AWAY_SUMMARY_PROMPT
    // - canUseTool returns deny for everything (no tool use possible)
    // - querySource="away_summary" (used by allowlist + telemetry)
    // - forkLabel="away_summary" (used by per-fork session resource accounting)
    // - maxTurns=1 (single assistant turn — no loops)
    // - skipCacheWrite=true (this query doesn't write its own cache entries)
    // - skipTranscript=true (recap doesn't pollute the session transcript)
    const { messages: resultMessages } = await runForkQuery({
      promptMessages: [createUserMessage({ content: AWAY_SUMMARY_PROMPT })],
      cacheSafeParams,
      overrides: { abortController: internalAbort },
      canUseTool: async () => ({
        behavior: "deny",
        message: "Away summary cannot use tools",
        decisionReason: { type: "other", reason: "away_summary" }
      }),
      querySource: "away_summary",
      forkLabel: "away_summary",
      maxTurns: 1,
      skipCacheWrite: true,
      skipTranscript: true
    });

    if (abortSignal.aborted) return null;
    return extractAssistantText(resultMessages) || null;
  } catch (err) {
    if (abortSignal.aborted) return null;
    log(`[awaySummary] generation failed: ${err}`);
    return null;
  }
}

// Mapping: Vu8→generateAwaySummary, q→abortSignal, K→cacheSafeParams,
//          _→internalAbort, z→resultMessages, XJ6→getSavedCacheSafeParams,
//          rP→runForkQuery, t8→createUserMessage, OEz→AWAY_SUMMARY_PROMPT,
//          wEz→extractAssistantText, E→log
```

## The Recap Prompt

```javascript
// ============================================
// AWAY_SUMMARY_PROMPT - The string used to instruct the model
// Location: chunks.116.mjs:942
// ============================================

OEz = "The user stepped away and is coming back. Recap in under 40 words, 1-2 plain sentences, no markdown. Lead with the overall goal and current task, then the one next action. Skip root-cause narrative, fix internals, secondary to-dos, and em-dash tangents."
```

### Prompt evolution

| Version | Prompt | Key changes |
|---------|--------|-------------|
| v2.1.88 (`awaySummary.ts:22`) | "Write exactly 1-3 short sentences. Start by stating the high-level task — what they are building or debugging, not implementation details. Next: the concrete next step. Skip status reports and commit recaps." | First version |
| v2.1.112 (`OEz`) | "Recap in under 40 words, 1-2 plain sentences, no markdown. Lead with the overall goal and current task, then the one next action. Skip root-cause narrative, fix internals, secondary to-dos, and em-dash tangents." | Tighter word budget (1-2 sentences not 1-3, <40 words), forbid markdown explicitly, ban "em-dash tangents" |

**Why "em-dash tangents" is banned:** Models (especially Sonnet) tend to use em-dashes for parenthetical asides. In a 40-word budget, an em-dash subclause displaces the actual content. Banning the construct forces the model into a leaner declarative form.

**Why "no markdown":** The recap renders as inline text in the terminal. Markdown (`**bold**`, `_italic_`) would render literally as those characters — distracting.

## The Extractor

```javascript
// ============================================
// extractAssistantText - Flatten assistant messages to a single trimmed string
// Location: chunks.116.mjs:938-940
// ============================================

// ORIGINAL (for source lookup):
function wEz(q) {
    return q.flatMap((K) => K.type === "assistant" && !K.isApiErrorMessage ? K.message.content : []).filter((K) => K.type === "text").map((K) => ("text" in K) ? K.text : "").join("").trim()
}

// READABLE (for understanding):
function extractAssistantText(messages) {
  return messages
    .flatMap(msg =>
      // Only successful assistant messages contribute
      msg.type === "assistant" && !msg.isApiErrorMessage
        ? msg.message.content
        : []
    )
    .filter(block => block.type === "text")
    // Defensive: not every text block is guaranteed to have a "text" field
    .map(block => ("text" in block) ? block.text : "")
    .join("")
    .trim();
}

// Mapping: wEz→extractAssistantText, q→messages, K→msg/block
```

## Key Algorithm: Fork Without Cache Pollution

The recap call uses **two** flags that distinguish it from a normal turn:

### `skipCacheWrite: true`

Recall the cache marker placement logic (chunks.194.mjs:3078-3089):

```javascript
// For fire-and-forget forks (skipCacheWrite) we shift the marker to the
// second-to-last message: that's the last shared-prefix point, so the write
// is a no-op merge on mycro (entry already exists) and the fork doesn't
// leave its own tail in the KVCC.
const markerIndex = skipCacheWrite ? messages.length - 2 : messages.length - 1
```

**Why this matters:**

The server's KV cache (`KVCC`) groups blocks at cache markers. The "tail" — anything after the last marker — is a fresh write that gets cached on this request. If a normal turn placed its marker at the last message, the request would:
1. Read the cached prefix (good — hit ratio high)
2. Write a new cache entry for the new tail (cost = ~20K tokens worth of cache write)

For a normal turn, that's desirable: the next turn will hit the new cached tail.

For a **recap fork**, no future turn will use this cached tail (the recap is fire-and-forget). The cache write is pure waste. By shifting the marker one message back (to the second-to-last position), the new cache entry exists at a position **already in the cache** — the write becomes a "no-op merge" on the server.

### `skipTranscript: true`

The recap's user-message-with-prompt and its assistant response would otherwise be appended to the session transcript. If they were, they'd:
- Persist across `--resume`
- Be visible in `/cost` accounting
- Pollute the next turn's `last user message` (the recap prompt would be the model's apparent last turn target)

`skipTranscript: true` ensures the recap is invisible to the main conversation thread. The user only sees the resulting recap text rendered as a system message — not the prompt that generated it.

## Why this approach

**Decision:** Fork the existing conversation rather than build a fresh one.

**Alternatives considered:**

| Alternative | Why rejected |
|-------------|-------------|
| Build a fresh `messages` array with just the last 30 messages and call API | Loses cache hit on the system prompt + tool schemas (~20K tokens) every time |
| Use a different model (e.g. Sonnet) for higher-quality recaps | Higher cost, slower, and the recap quality with Haiku is good enough |
| Cache the recap text itself, regenerate only when conversation grows | Cache invalidation is hard — when does the recap become "stale"? Each recap captures a specific moment |
| Use a deterministic non-LLM extractor (e.g. pull todo names) | Misses the "what they're doing right now" context that an LLM picks up from recent messages |

**Chosen approach** is a **fork-without-write** through the standard query pipeline. The cache-safe params guarantee the recap's request is byte-identical to a normal turn's prefix — so cache hit ratio is maximal.

## Edge Cases

| Edge case | Handling |
|-----------|----------|
| Empty conversation (no turns yet) | Returns null (`getSavedCacheSafeParams` returns null OR `resultMessages` is empty) — `/recap` shows "No recap available — needs at least one completed turn" |
| Mid-call abort (user starts a new turn) | Wired through internal AbortController → cancels the LLM call cleanly → returns null |
| Model error (rate-limited, server 5xx) | Caught in try/catch → logged → returns null → user sees the "needs at least one completed turn, or generation failed" message |
| Model returns empty text | `extractAssistantText` returns `""`; the OR coalesces to null |
| Model produces tool-use instead of text | `extractAssistantText` filters to text-only blocks → returns "" → null. The `canUseTool` deny would also have aborted the tool, so this path is unreachable in practice |
| Long conversation (>100 messages) | The cache-safe params already limit the message window; the v2.1.112 implementation relies on the same fork-truncation that the standard query uses |

## Key Insight

The recap is a **read-only fork** of the conversation that happens to use an LLM. It deliberately:

1. **Reuses the cache** — by going through the same query pipeline with `cacheSafeParams`
2. **Doesn't pollute the cache** — by setting `skipCacheWrite: true` (shift marker back)
3. **Doesn't pollute the transcript** — by setting `skipTranscript: true`
4. **Can't side-effect** — by setting `canUseTool` to a universal deny

Without these four guards, a recap would mutate session state in subtle ways: extra cache entries, an extra assistant message visible to the next turn, possibly an extra tool call. The careful flag combination makes the recap **observably invisible** to the conversation — it's pure observation.

## Related symbols

- `generateAwaySummary` (`Vu8`) at chunks.116.mjs:898
- `extractAssistantText` (`wEz`) at chunks.116.mjs:938
- `AWAY_SUMMARY_PROMPT` (`OEz`) at chunks.116.mjs:942
- `getSavedCacheSafeParams` (`XJ6`) - Returns the session's saved CacheSafeParams (for forking)
- `runForkQuery` (`rP`) - Standard fork-query entry point used by recap, compact, microcompact
- `createUserMessage` (`t8`) - Builds a synthetic user message
- `log` (`E`) - Debug logger (writes to `~/.claude/debug.log`)

See [recap_feature.md](./recap_feature.md) for the consuming `/recap` command and `useAwaySummaryEffect` hook.
