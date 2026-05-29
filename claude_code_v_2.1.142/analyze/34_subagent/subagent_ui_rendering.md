# Subagent UI Rendering in the Parent REPL — v2.1.142

## What This Document Covers

How the *parent's* REPL renders subagent activity. Inside `runAgent` ([runtime_execution.md](./runtime_execution.md)) the subagent yields messages back to the parent through a generator. This document tracks each kind of message from yield to the screen pixel:

1. **Color assignment** — how each subagent gets one of the 8 reserved palette colors.
2. **Streaming output** — assistant text streams while the subagent is alive.
3. **`<task-notification>` envelopes** — async-subagent progress reports.
4. **Final tool_result** — the collapsed summary the parent sees when the subagent finishes.
5. **Background summary timer** — the 30-second auto-summary loop (`CM$`).
6. **Error and abort envelopes** — what the parent sees when a subagent crashes.

The high-level model: the parent's main loop sees the subagent as a long-running **`Agent` tool call**. The tool call's "live output" region is fed by the streaming yields; the tool call's "final result" region is the last-assistant text. The parent's `gC` loop is structurally identical here to any other tool call — it just happens to be a tool call that streams.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI components

Key symbols:
- `AGENT_COLOR_PALETTE` (`Nf`) — `["red","blue","green","yellow","purple","orange","pink","cyan"]` (cli_inner_pretty.js:231368)
- `SUBAGENT_THEME_KEYS` (`UP`) — Maps palette names to theme tokens like `red_FOR_SUBAGENTS_ONLY` (cli_inner_pretty.js:231369-231378)
- `startAgentSummarization` (`CM$`) — 30s timer producing `<task-notification>` summaries (cli_inner_pretty.js:271869-271941)
- `dropDanglingToolUses` (`cJ6`) — strips orphan tool_use blocks before summarizing (cli_inner_pretty.js:393435-393451)
- `taskNotification` mode tag (`Oz`, `"task-notification"`) — `cli_inner_pretty.js:41076`
- Theme color values RGB — cli_inner_pretty.js:145287-145294
- Theme color values ANSI fallback — cli_inner_pretty.js:145357-145364

## Color Assignment

Each running subagent is rendered with one of **8 palette colors**. The palette names live in `Nf`:

```javascript
// ============================================
// AGENT_COLOR_PALETTE + theme mapping
// Location: cli_inner_pretty.js:231368-231378
// ============================================

// ORIGINAL:
((Nf = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]),
  (UP = {
    red: "red_FOR_SUBAGENTS_ONLY",
    blue: "blue_FOR_SUBAGENTS_ONLY",
    green: "green_FOR_SUBAGENTS_ONLY",
    yellow: "yellow_FOR_SUBAGENTS_ONLY",
    purple: "purple_FOR_SUBAGENTS_ONLY",
    orange: "orange_FOR_SUBAGENTS_ONLY",
    pink: "pink_FOR_SUBAGENTS_ONLY",
    cyan: "cyan_FOR_SUBAGENTS_ONLY",
  }));

// READABLE:
const AGENT_COLOR_PALETTE = ["red","blue","green","yellow","purple","orange","pink","cyan"] as const;
const SUBAGENT_THEME_KEYS = {
  red:    "red_FOR_SUBAGENTS_ONLY",     // theme token resolved against the active theme
  blue:   "blue_FOR_SUBAGENTS_ONLY",
  green:  "green_FOR_SUBAGENTS_ONLY",
  // ... etc.
} as const;

// Mapping: Nf→AGENT_COLOR_PALETTE, UP→SUBAGENT_THEME_KEYS
```

### Why the `_FOR_SUBAGENTS_ONLY` suffix

The theme system has a single global table (cli_inner_pretty.js:145286-145294) of `red`, `blue`, etc. tokens. Those are claimed by core UI roles — `error`, `success`, etc. — and tuned for readability against the main background, not for visual distinction across multiple parallel agents.

The `_FOR_SUBAGENTS_ONLY` tokens are a **separate palette layered on top** of the theme. They map to:

| Token | Light theme RGB | ANSI fallback (cli_inner_pretty.js:145357-145364) |
|-------|----------|---------------|
| `red_FOR_SUBAGENTS_ONLY` | `rgb(220,38,38)` | `ansi:red` |
| `blue_FOR_SUBAGENTS_ONLY` | `rgb(106,155,204)` | `ansi:blue` |
| `green_FOR_SUBAGENTS_ONLY` | `rgb(22,163,74)` | `ansi:green` |
| `yellow_FOR_SUBAGENTS_ONLY` | `rgb(202,138,4)` | `ansi:yellow` |
| `purple_FOR_SUBAGENTS_ONLY` | `rgb(130,125,189)` | `ansi:magenta` |
| `orange_FOR_SUBAGENTS_ONLY` | `rgb(217,119,87)` | `ansi:redBright` |
| `pink_FOR_SUBAGENTS_ONLY` | `rgb(196,102,134)` | `ansi:magentaBright` |
| `cyan_FOR_SUBAGENTS_ONLY` | `rgb(8,145,178)` | `ansi:cyan` |

The naming literally encodes that **these tokens must never be reused for non-agent UI**. A future contributor cannot inadvertently swap `red` and `red_FOR_SUBAGENTS_ONLY` without violating the visual contract.

### Assignment policy

The color is picked in this priority:
1. **Frontmatter `color: <name>` if explicitly set** (see [definition_schema.md](./definition_schema.md)).
2. **Stable hash of `agentType`** otherwise — so the same agent type gets the same color across runs.
3. **First-spawn round-robin** when multiple agents of the same type run concurrently — to avoid all "Explore" agents being indistinguishable.

The v2.1.140 changelog explicitly mentions this palette being formalized: previously colors were assigned but the `_FOR_SUBAGENTS_ONLY` token segregation didn't exist, and some themes were rendering certain agents in colors that clashed with status icons. The v2.1.140 work split the palette tokens from the role tokens.

In v2.1.88 (`src/tools/AgentTool/agentColorManager.ts:14-23`) the array is named `AGENT_COLORS` and the mapping is `AGENT_COLOR_TO_THEME_COLOR`. The semantics are identical.

## Streaming Output

Inside `Vb`'s LLM loop (see [runtime_execution.md](./runtime_execution.md) §"LLM Loop Phase"), yields are produced for each:
- `stream_event` of type `message_start` / `message_delta` / `message_stop` — token-level streaming
- `assistant` message — a completed assistant turn (with `text` and/or `tool_use` blocks)
- `attachment` — `hook_additional_context`, `max_turns_reached`, `compact_boundary`, etc.
- `progress` — non-causal updates (e.g. spinner ticks from a hook still running)

Each of these flows into the parent through `for await`, then into the parent's render pipeline. The parent's pipeline is the same one used for the main agent loop — it doesn't know it's seeing subagent output until it inspects the message's `agentId` field.

### Render path

```
runAgent yields msg ──► parent's for-await ──► parent's renderer
                                                     │
                                                     ▼
                              ┌──── AgentToolMessage component ────┐
                              │                                     │
                              │  derives:                          │
                              │    color = SUBAGENT_THEME_KEYS[    │
                              │      assignColor(msg.agentType)]   │
                              │    label = msg.agentType           │
                              │    bodyLines = stream content      │
                              │                                     │
                              │  renders:                          │
                              │    ╭ <color>label</color>          │
                              │    │ assistant text streaming      │
                              │    │ ⎿ tool_use → tool_result      │
                              │    │ … (continues)                  │
                              │    ╰ (final result)                 │
                              └─────────────────────────────────────┘
```

The agent's text is **streamed character-by-character** as `stream_event` deltas arrive. Tool calls within the subagent (e.g. `Bash`, `Edit`) appear as nested entries inside the subagent's block, indented one level. The nesting depth equals the number of agents in the spawn stack, capped at one because subagents can't spawn deeper subagents by default (the fork path overrides this guard but doesn't recurse).

### Why streaming, not batched

If `runAgent` were a Promise, the parent's REPL would show an empty `Agent` tool call for the entire subagent's lifetime (potentially minutes), then dump the whole transcript at the end. Streaming is what makes long-running subagents *feel* responsive. The token-level streaming is also what makes the subagent's reasoning visible while it's still thinking — important for plan-mode and code review agents.

## `<task-notification>` Envelopes

For **async** subagents (those spawned with `run_in_background: true`), the parent doesn't wait on the generator. Instead, the parent's main loop resumes immediately after seeing the first "started in background" message, and the subagent keeps running. So how does the user see progress?

The answer is the **task-notification envelope**. It's a special user-message-shaped object the parent's main agent loop receives, formatted to look like a system reminder:

```
<task-notification kind="subagent" agentId="abc-123">
  agentType: code-reviewer
  status: working
  summary: Reviewing changes to auth.ts and writing a security checklist
</task-notification>
```

The model treats this as a user-visible event ("the background agent reported X"). The model can:
- Acknowledge it ("the background code review is mid-flight — I'll continue with the docs in the meantime"),
- Wait on it (call the `Agent` tool again with `tool_use_id` to poll),
- Or ignore it.

### Generation: `startAgentSummarization` (`CM$`)

```javascript
// ============================================
// startAgentSummarization — 30s timer producing progress summaries
// Location: cli_inner_pretty.js:271869-271941
// ============================================

// READABLE:
function startAgentSummarization(agentId, label, cacheSafeParams, getMessages, source, options = {}) {
  let intervalMs = options.intervalMs ?? AGENT_SUMMARY_DEFAULT_INTERVAL,    // 30s
    abortController = null, timer = null, stopped = false,
    lastSummary = null,                          // D
    transcriptFingerprint = null,                // j
    unchangedTelemetryEmitted = false;           // J

  async function tick() {
    if (stopped) return;
    let messages = getMessages();
    if (messages.length < 3) return;
    let pruned = dropDanglingToolUses(messages);   // cJ6
    let fingerprint = `${pruned.length}:${pruned.at(-1)?.uuid ?? ""}`;
    if (fingerprint === transcriptFingerprint) {
      if (!unchangedTelemetryEmitted) {
        emit("tengu_agent_summary_skipped", { reason: "unchanged" });
        unchangedTelemetryEmitted = true;
      }
      return;
    }
    unchangedTelemetryEmitted = false;
    transcriptFingerprint = fingerprint;
    abortController = new AbortController();
    let summaryResult = await forkAndQueryOnce({
      promptMessages: [userMessage({ content: SUMMARY_PROMPT(lastSummary) })],
      cacheSafeParams: { ...cacheSafeParams, forkContextMessages: pruned },
      canUseTool: () => ({ behavior: "deny", message: "No tools needed for summary",
                           decisionReason: { type: "other", reason: "summary only" } }),
      querySource: "agent_summary",
      forkLabel: "agent_summary",
      overrides: { abortController },
      skipTranscript: true,                      // don't write summary to sidechain JSONL
      skipCacheWrite: true,                      // don't pollute prompt cache
    });
    for (let m of summaryResult.messages) {
      if (m.type !== "assistant" || m.isApiErrorMessage) continue;
      let textBlock = m.message.content.find(c => c.type === "text");
      if (textBlock?.text.trim()) {
        lastSummary = textBlock.text.trim();
        emitTaskNotification(agentId, lastSummary, source);   // lO7
        break;
      }
    }
    if (!stopped) scheduleNext();
  }
  function scheduleNext() { if (!stopped) timer = setTimeout(tick, intervalMs); }
  function stop() { stopped = true; if (timer) clearTimeout(timer); if (abortController) abortController.abort(); }

  scheduleNext();
  return { stop };
}
```

### Key design choices

**30-second interval (`AP_ = 30000`).** Empirically the sweet spot for code-review/research agents — fast enough that users feel progress, slow enough that summary forks aren't dominating LLM cost.

**Skip if transcript unchanged.** The fingerprint is `messageCount:lastUuid`. If the subagent is doing something slow (e.g. a long `Bash` command), the message list doesn't grow, so re-summarizing would just burn tokens. The `tengu_agent_summary_skipped` telemetry event is emitted **exactly once per unchanged-streak** (the `J` flag) so we don't spam telemetry.

**`dropDanglingToolUses(messages)` before forking.** Without this, a fork that starts during a `tool_use → tool_result` round-trip would have an unmatched `tool_use` at the end, and the LLM API rejects that. The pruning strips assistant messages whose `tool_use` block has no matching `tool_result` in subsequent user messages. v2.1.128 also added a fork-level "cache safe" flag so subsequent summarization forks share the prompt-cache prefix (~3× cache_creation reduction; see [result_passing.md](./result_passing.md)).

**`canUseTool: deny`** prevents the summary fork from running tools. It's a pure read of the transcript. The decisionReason explicitly says "summary only" so audit logs are clean.

**`skipTranscript: true`** keeps summary turns out of the sidechain JSONL. The summaries are **ephemeral** — they're rendered as `<task-notification>` envelopes for the parent, then forgotten. If summaries were persisted, every resume of the subagent would re-emit summaries.

**`skipCacheWrite: true`** ensures the summary fork doesn't write a cache entry. The cache prefix is shared with the main agent loop (read-only), but writing would create a competing entry. Without this, the cache would thrash on every 30s tick.

### Cross-validation with v2.1.88

The v2.1.88 implementation lives in `src/tasks/LocalAgentTask/` and uses a similar but less optimized pattern: the summary path didn't have `skipCacheWrite`, and the unchanged-transcript skip was missing. Both were added in v2.1.128. The "unchanged" telemetry edge (`tengu_agent_summary_skipped: "unchanged"`) is a v2.1.128 addition.

## Final `tool_result`

When the LLM loop ends (normal completion, max-turns, abort, or error), the parent's `Agent` tool handler builds the `tool_result` envelope from:

1. The last assistant message's `text` blocks — concatenated to form the agent's "answer."
2. Up to *N* prior assistant messages, if `preserveToolUseResults=true` was set (used for subagents with viewable transcripts).
3. The `progress_summaries` array — the `<task-notification>` payloads collected during async runs.

The envelope shape:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_...",
  "content": [
    { "type": "text", "text": "Reviewed auth.ts. Found 2 issues...\n\n1. ...\n2. ..." }
  ]
}
```

For background-mode agents that haven't finished by the time the parent moves on, the initial `tool_result` is:
```json
{ "type": "tool_result", "tool_use_id": "toolu_...",
  "content": [{ "type": "text",
    "text": "Started \"Reviewing PR\" in background as agent abc-123. Status notifications will arrive as <task-notification> events; use the Agent tool with the same description to wait for completion." }] }
```

The parent's renderer collapses the entire subagent's transcript into a **single Agent-tool block** by default (no folding by default in v2.1.140+); the user can expand it with `⌃z` / Enter on the block. The collapsed view shows:
- Header: agent type (in the agent's color), description, status icon (✓ done, ✗ failed, ⏳ working)
- One-line summary of the final answer (or summary from `<task-notification>`)

Expanded view shows the full streaming history, including nested tool calls.

## Error and Abort Envelopes

| Trigger | What the parent sees |
|---------|----------------------|
| User Ctrl+C during foreground subagent | `tool_result` with `is_error: true`, content: `"Cancelled by user"`. Parent's main loop continues. |
| Subagent throws | `tool_result` with `is_error: true`, content: the error message. The subagent's cleanup still runs (finally block). |
| Subagent hits `max_turns` | `tool_result` with `content: "Subagent reached max turns (200). Partial progress: <last assistant text>"` |
| Async subagent crashes mid-flight | A `<task-notification>` envelope with `kind="subagent_error"` and the error text. The parent's tool result already returned "started in background"; the error arrives later. |

The "partial progress" pattern was added in v2.1.101 — before that, errored subagents returned only the error string, losing all intermediate work. Now the parent gets the last assistant text plus the error. See [result_passing.md](./result_passing.md).

## v2.1.88 Comparison

The v2.1.88 path:
- Has `AGENT_COLORS` palette but **no** `_FOR_SUBAGENTS_ONLY` theme-key segregation (the v2.1.140 split is post-v2.1.88).
- Has summarization but **no** unchanged-transcript skip (v2.1.128).
- Has `<task-notification>` envelopes already — the protocol is older than the v2.1.142 enhancements.
- Renders subagents through `LocalAgentTask` (which v2.1.142 has migrated into the unified runtime).

The most visible v2.1.140+ user-facing changes:
1. Agent colors are now *guaranteed distinct* from system colors (palette segregation).
2. Background summaries skip when the subagent is mid-action (no spurious 30s ticks).
3. Cancelled / errored subagents return partial progress.
