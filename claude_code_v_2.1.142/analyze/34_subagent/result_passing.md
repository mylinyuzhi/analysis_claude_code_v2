# Subagent Result Passing & Progress Summarization (v2.1.142)

## TL;DR

The Agent tool returns one of:
- **Foreground**: the subagent's final assistant text becomes the `tool_result` after the subagent finishes.
- **Background**: a "task started" placeholder is the immediate `tool_result`; the parent receives `<task-notification>` updates (progress + summary) as user-turn attachments while the subagent runs.

Three v2.1.x fixes form the result-passing story:

| Version | Fix |
|---------|-----|
| **v2.1.101** | Subagent errors now produce a partial-progress payload (`extractPartialResult`) rather than discarding all transcript |
| **v2.1.128** | Sub-agent progress summaries now share the parent's prompt cache, ~3× reduction in `cache_creation` tokens |
| **v2.1.128** | Idle sub-agents (transcript hasn't changed) skip summarization, capping worst-case token cost via `tengu_agent_summary_skipped: "unchanged"` |

The summarization mechanism is the 30-second `startAgentSummarization` (`CM$`) timer loop: every 30s while the subagent is alive, fork a summary query over the subagent's transcript and write the result back as a one-line progress description.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Background Agents, Compact)

Key functions in this document:
- `startAgentSummarization` (`CM$`) - per-subagent 30s timer loop (cli_inner_pretty.js:271869-271941)
- `summaryPromptTemplate` (`zP_`) - the "3-5 words present tense" template (cli_inner_pretty.js:271850-271867)
- `recordAgentSummary` (`lO7`) - write summary into progress state (cli_inner_pretty.js, called from 271922)
- `filterUnresolvedToolUses` (`cJ6`) - input filter for summary forks (cli_inner_pretty.js:393435-393451)
- `SUMMARY_INTERVAL_MS` (`AP_`) - 30000 (cli_inner_pretty.js:271942)
- `tengu_agent_summary_skipped` - telemetry for idle skip

## Foreground Result Passing

For an Agent tool call with `run_in_background: false` (default):

1. Parent's main loop dispatches the Agent tool.
2. `runAgent` (`Vb`) is invoked with the subagent's messages and definition.
3. The streaming generator yields messages; the parent's loop iterates until completion.
4. When the subagent's last assistant message arrives (containing a `text` block with the final answer), it's extracted as the `tool_result` text.
5. The parent's next turn includes `{ type: "tool_result", tool_use_id: ..., content: [{ type: "text", text: subagent_final_text }] }`.

The model then synthesizes across the subagent's result and its own context for the next assistant turn.

### What Happens on Subagent Error?

Pre-v2.1.101, if a subagent threw mid-stream (API error, max-turns, abort), the parent received a `tool_result` with `is_error: true` and an error message — but **no partial progress**. The hours of intermediate work were dropped from the result.

v2.1.101 added partial-progress reporting: even on subagent errors, the parent gets `is_error: true` AND a text block showing what the subagent completed before the error. The `extractPartialResult` utility (in `agentToolUtils.ts`) walks the persisted transcript and pulls out:

- The last successful assistant message (if any).
- The last few tool_use/tool_result pairs (showing what tools the subagent ran).
- A summary line: "subagent failed after N turns; last action: <description>".

This lets the parent meaningfully continue: it knows what was tried, it knows what failed, and it can decide whether to retry, ask the user, or pursue an alternate path.

## Background Result Passing: `<task-notification>` Envelopes

For an Agent tool call with `run_in_background: true` (or an agent with `background: true` in frontmatter):

1. Parent's main loop dispatches the Agent tool.
2. `runAgent` is wrapped by `runSubagentLifecycle` (`slH`), which registers it as an async background task via `registerAsyncAgent` (in `tasks/LocalAgentTask/LocalAgentTask.ts`).
3. The Agent tool returns *immediately* with a "started" `tool_result` containing the task ID. The parent's turn completes without waiting.
4. The subagent continues running in the background.
5. While running, `startAgentSummarization` (`CM$`) produces 30-second-interval progress summaries.
6. When the subagent finishes (or fails), the parent receives a `<task-notification>` attachment on the *next* user turn:
   ```xml
   <task-notification>
     Agent code-reviewer (task abc123) completed.
     Result: <summary or final text>
   </task-notification>
   ```
7. If the subagent failed: the notification includes the error and the partial-progress payload.

The parent sees a deferred, asynchronous result rather than blocking on the subagent.

### Why a Notification Attachment Rather Than a Direct Tool Result?

A `tool_result` block must follow a `tool_use` block in the same conversation turn. After the parent has already responded (and the conversation has moved on), the subagent's completion can't retroactively become a `tool_result`. Instead, the notification is injected as a user-turn attachment, so the model sees it on its next turn as context: "a background task you started has finished, here's what it did."

This pattern is consistent with how `BackgroundShell` reports completed background shell commands.

## The Summarization Loop: `startAgentSummarization` (`CM$`)

```javascript
// ============================================
// startAgentSummarization - Per-subagent 30s timer that produces progress summaries
// Location: cli_inner_pretty.js:271869-271941
// ============================================

// ORIGINAL (for source lookup):
function CM$(H, $, q, K, _, A = {}) {
  let z = A.intervalMs ?? AP_,
    { forkContextMessages: Y, ...f } = q,
    O = null, M = null, w = !1, D = null, j = null, J = !1;
  async function X() {
    if (w) return;
    log(`[AgentSummary] Timer fired for agent ${$}`);
    try {
      let Z = K();
      if (Z.length < 3) { log(`[AgentSummary] Skipping summary for ${H}: not enough messages (${Z.length})`); return; }
      let W = cJ6(Z), G = `${W.length}:${W.at(-1)?.uuid ?? ""}`;
      if (G === j) {
        if ((log(`[AgentSummary] Skipping summary for ${H}: transcript unchanged (${W.length} messages)`), !J))
          (d("tengu_agent_summary_skipped", { reason: "unchanged" }), (J = !0));
        return;
      }
      ((J = !1), (j = G));
      let V = { ...f, forkContextMessages: W };
      (log(`[AgentSummary] Forking for summary, ${W.length} messages in context`), (O = new AbortController()));
      let v = async () => ({ behavior: "deny", message: "No tools needed for summary", decisionReason: { type: "other", reason: "summary only" } }),
        E = await JV({
          promptMessages: [w8({ content: zP_(D) })],
          cacheSafeParams: V,
          canUseTool: v,
          querySource: "agent_summary",
          forkLabel: "agent_summary",
          overrides: { abortController: O },
          skipTranscript: !0,
          skipCacheWrite: !0,
        });
      if (w) return;
      for (let I of E.messages) {
        if (I.type !== "assistant") continue;
        if (I.isApiErrorMessage) { log(`[AgentSummary] Skipping API error message for ${H}`); continue; }
        let h = I.message.content.find((C) => C.type === "text");
        if (h?.type === "text" && h.text.trim()) {
          let C = h.text.trim();
          (log(`[AgentSummary] Summary result for ${H}: ${C}`), (D = C), lO7(H, C, _));
          break;
        }
      }
    } catch (Z) { if (!w && Z instanceof Error) recordError(Z); }
    finally { if ((O = null, !w)) L(); }
  }
  function L() { if (w) return; M = setTimeout(X, z); }
  function P() {
    if ((log(`[AgentSummary] Stopping summarization for ${H}`), (w = !0), M)) (clearTimeout(M), (M = null));
    if (O) (O.abort(), (O = null));
  }
  return (L(), { stop: P });
}

// READABLE (for understanding):
function startAgentSummarization(agentId, agentTaskId, cacheSafeParams, getMessagesFn, contextForSummary, options = {}) {
  const intervalMs = options.intervalMs ?? SUMMARY_INTERVAL_MS; // 30000
  const { forkContextMessages, ...restCacheSafe } = cacheSafeParams;
  let activeAbortController = null;
  let timer = null;
  let stopped = false;
  let lastSummaryText = null;
  let lastTranscriptSignature = null;
  let unchangedAlreadyReported = false;

  async function fireSummaryTurn() {
    if (stopped) return;
    log(`[AgentSummary] Timer fired for agent ${agentTaskId}`);
    try {
      // 1. Snapshot the subagent's current transcript
      const messages = getMessagesFn();
      if (messages.length < 3) {
        log(`[AgentSummary] Skipping summary for ${agentId}: not enough messages`);
        return;
      }

      // 2. Filter out unresolved tool_uses (prevents partial-tool-use API errors)
      const usableMessages = filterUnresolvedToolUses(messages);

      // 3. Compute a signature; skip if transcript hasn't changed since last summary
      const signature = `${usableMessages.length}:${usableMessages.at(-1)?.uuid ?? ""}`;
      if (signature === lastTranscriptSignature) {
        log(`[AgentSummary] Skipping summary for ${agentId}: transcript unchanged`);
        // v2.1.128: only emit the "skipped: unchanged" telemetry ONCE per idle streak
        if (!unchangedAlreadyReported) {
          tlm("tengu_agent_summary_skipped", { reason: "unchanged" });
          unchangedAlreadyReported = true;
        }
        return;
      }
      unchangedAlreadyReported = false;
      lastTranscriptSignature = signature;

      // 4. Fork a query that re-uses the subagent's full transcript as context
      //    The "fork" here shares the prompt cache with the subagent's main API calls,
      //    so the only fresh tokens are the summary prompt itself + the model's answer.
      const cacheSafeParamsForSummary = { ...restCacheSafe, forkContextMessages: usableMessages };
      log(`[AgentSummary] Forking for summary, ${usableMessages.length} messages in context`);
      activeAbortController = new AbortController();

      // The deny-all tool gate is critical: the summary fork must not call tools
      const denyAllTools = async () => ({
        behavior: "deny",
        message: "No tools needed for summary",
        decisionReason: { type: "other", reason: "summary only" },
      });

      const result = await runForkedQueryForSummary({
        promptMessages: [makeUserMessage({ content: summaryPromptTemplate(lastSummaryText) })],
        cacheSafeParams: cacheSafeParamsForSummary,
        canUseTool: denyAllTools,
        querySource: "agent_summary",
        forkLabel: "agent_summary",
        overrides: { abortController: activeAbortController },
        skipTranscript: true,        // Don't persist the summary turn to disk
        skipCacheWrite: true,        // Don't write a new cache entry; just read the existing prefix
      });

      if (stopped) return;

      // 5. Pull the first non-error text block from the summary turn's output
      for (const m of result.messages) {
        if (m.type !== "assistant") continue;
        if (m.isApiErrorMessage) continue;
        const textBlock = m.message.content.find((b) => b.type === "text");
        if (textBlock?.type === "text" && textBlock.text.trim()) {
          const summaryText = textBlock.text.trim();
          log(`[AgentSummary] Summary result for ${agentId}: ${summaryText}`);
          lastSummaryText = summaryText;
          recordAgentSummary(agentId, summaryText, contextForSummary);
          break;
        }
      }
    } catch (err) {
      if (!stopped && err instanceof Error) recordError(err);
    } finally {
      activeAbortController = null;
      if (!stopped) scheduleNext();
    }
  }

  function scheduleNext() {
    if (stopped) return;
    timer = setTimeout(fireSummaryTurn, intervalMs);
  }

  function stop() {
    log(`[AgentSummary] Stopping summarization for ${agentId}`);
    stopped = true;
    if (timer) { clearTimeout(timer); timer = null; }
    if (activeAbortController) { activeAbortController.abort(); activeAbortController = null; }
  }

  scheduleNext();
  return { stop };
}

// Mapping: CM$→startAgentSummarization, H→agentId, $→agentTaskId, q→cacheSafeParams,
//          K→getMessagesFn, _→contextForSummary, A→options, X→fireSummaryTurn,
//          L→scheduleNext, P→stop, Z→messages, W→usableMessages, G→signature,
//          j→lastTranscriptSignature, J→unchangedAlreadyReported, D→lastSummaryText,
//          V→cacheSafeParamsForSummary, O→activeAbortController, M→timer, w→stopped,
//          E→result, I→m, h→textBlock, C→summaryText,
//          cJ6→filterUnresolvedToolUses, zP_→summaryPromptTemplate,
//          lO7→recordAgentSummary, JV→runForkedQueryForSummary,
//          AP_→SUMMARY_INTERVAL_MS (30000)
```

### The Prompt Template

```javascript
function zP_(H) {
  return `Describe your most recent action in 3-5 words using present tense (-ing). Name the file or function, not the branch. Do not use tools.
${H ? `\nPrevious: "${H}" — say something NEW.\n` : ""}
Good: "Reading runAgent.ts"
Good: "Fixing null check in validate.ts"
Good: "Running auth module tests"
Good: "Adding retry logic to fetchUser"

Bad (past tense): "Analyzed the branch diff"
Bad (too vague): "Investigating the issue"
Bad (too long): "Reviewing full branch diff and AgentTool.tsx integration"
Bad (branch name): "Analyzed adam/background-summary branch diff"`;
}
```

The "Previous: 'X' — say something NEW" anti-repetition guidance helps in long-running tasks where the surface activity hasn't changed but the actual progress has.

## v2.1.128 Cache Fix: ~3× `cache_creation` Reduction

### The Pre-Fix Bug

Pre-v2.1.128, every summary turn was a *fresh* query with the subagent's transcript as context. The forked query had:
- A fresh cache entry created for the subagent's transcript prefix.
- A small fresh delta (the summary prompt + the model's brief answer).

Result: every 30 seconds, the subagent paid for re-creating the cache prefix, even though the parent's main API calls already had a cache entry for nearly-identical content. Three roughly-identical caches existed simultaneously: the parent's, the subagent's main loop, and the summary fork's. Each summary turn paid `cache_creation` token cost for fresh writes.

The token cost was meaningful: for a 50K-message subagent transcript, each 30-second summary added ~25K `cache_creation` tokens. Across a 10-minute subagent run, that was 500K cache_creation tokens just for summaries.

### The Fix

The fix routed the summary turn to **share the subagent's prompt cache** by using `cacheSafeParams` and explicitly setting `skipCacheWrite: true`. The summary fork now:
- *Reads* the existing cache entry (subagent's prefix).
- Sends only the small summary prompt + receives the model's brief answer as fresh tokens.
- Does NOT create a new cache entry.

Effect: ~3× reduction in `cache_creation` tokens for summary turns. The summary fork is essentially free compared to the subagent's main API calls.

The implementation passes `cacheSafeParams` (a snapshot of the parent's cache-relevant API options) into the summary turn so the API request hashes to the same cache key as the subagent's main request.

## v2.1.128 Idle Cap: `tengu_agent_summary_skipped: "unchanged"`

### The Problem

A subagent waiting on a long-running tool call (e.g. `Bash("npm test")` that takes 5 minutes) has a static transcript. The summarization timer fires every 30s with the same messages, producing the same summary. Each summary is paid for in tokens, despite producing no new information.

### The Fix

A signature check: the `lastTranscriptSignature` is `messageCount:lastUuid`. If it hasn't changed since the last summary, skip the summary turn entirely and just log + record telemetry.

The telemetry emit (`tengu_agent_summary_skipped: { reason: "unchanged" }`) fires *only once per idle streak* via the `unchangedAlreadyReported` flag. So a 10-minute idle bash command yields one telemetry event, not 20 (every 30s).

### Why The Once-Per-Streak Flag

Without the flag, every 30-second idle tick would emit telemetry, swamping the metrics with "subagent idle" signals. The flag flips back to `false` when the transcript next changes, so a transition from idle → active is immediately observable in metrics.

## `filterUnresolvedToolUses` (`cJ6`)

Before summarization, the messages are filtered to drop any assistant message with `tool_use` blocks that lack matching `tool_result` blocks. This avoids API errors of the form "tool_use_id was found without a tool_result".

```javascript
function cJ6(H) {
  let $ = new Set();
  for (let q of H)
    if (q?.type === "user") {
      let _ = q.message.content;
      if (Array.isArray(_)) {
        for (let A of _) if (A.type === "tool_result" && A.tool_use_id) $.add(A.tool_use_id);
      }
    }
  return H.filter((q) => {
    if (q?.type === "assistant") {
      let _ = q.message.content;
      if (Array.isArray(_)) return !_.some((z) => z.type === "tool_use" && z.id && !$.has(z.id));
    }
    return !0;
  });
}

// READABLE:
function filterUnresolvedToolUses(messages) {
  // 1. Build a set of all tool_use_ids that have a matching tool_result
  const resolvedIds = new Set();
  for (const m of messages) {
    if (m?.type !== "user") continue;
    const content = m.message.content;
    if (!Array.isArray(content)) continue;
    for (const b of content) {
      if (b.type === "tool_result" && b.tool_use_id) resolvedIds.add(b.tool_use_id);
    }
  }
  // 2. Drop assistant messages where ANY tool_use is unresolved
  return messages.filter((m) => {
    if (m?.type !== "assistant") return true;
    const content = m.message.content;
    if (!Array.isArray(content)) return true;
    return !content.some((b) => b.type === "tool_use" && b.id && !resolvedIds.has(b.id));
  });
}
```

This is critical because the subagent's transcript at any point may include an assistant message with a `tool_use` whose `tool_result` hasn't arrived yet (the tool is still running). Passing that mid-flight pair to the summary fork would 400 on the API. The filter drops the incomplete pair.

## Recording the Summary: `recordAgentSummary`

The actual write-back happens through `recordAgentSummary` (`lO7`):

```javascript
// recordAgentSummary - Update the subagent's progress description so parent sees it
```

This call updates the `taskRegistry` entry for the subagent, setting its `progressDescription` to the new summary text. The parent's UI / task notification system reads from this registry to render the progress label.

Importantly, this write is **in-memory** — it doesn't persist the summary to the JSONL. The summary is *ephemeral progress state*, not part of the conversation history. (If the subagent crashes and is resumed, the previous summary is lost; a new one is computed on the resumed transcript.)

## v2.1.101 Partial-Progress Reporting on Errors

When a background subagent fails, the `<task-notification>` envelope it sends to the parent's next turn includes partial progress. The logic is in `extractPartialResult` (in `agentToolUtils.ts`):

```typescript
function extractPartialResult(persistedMessages, error) {
  // Pull the last assistant message that had text content (not error)
  const lastNonErrorAssistant = findLast(
    persistedMessages,
    m => m.type === "assistant" && !m.isApiErrorMessage,
  );
  const lastText = lastNonErrorAssistant
    ?.message.content.find(b => b.type === "text")?.text;

  // Pull the last few tool_use/tool_result pairs for context
  const recentToolPairs = getRecentToolPairs(persistedMessages, /* n */ 3);

  return {
    summary: lastText ?? "(no progress)",
    recentTools: recentToolPairs,
    errorMessage: error.message,
    isError: true,
  };
}
```

This produces something like:

```
<task-notification>
  Agent code-reviewer (task abc123) failed: API rate limit exceeded.
  Last action: Reviewing file src/auth.ts line 42-89.
  Recent tools: Read(src/auth.ts), Grep("validate", src/), Bash("git diff main")
</task-notification>
```

The parent can act on this:
- "Last action" tells the user what was attempted.
- "Recent tools" tells the model what state the workspace might be in.
- "Failed: API rate limit exceeded" tells what error type — informs retry strategy.

Pre-v2.1.101, the notification was just `"Agent code-reviewer (task abc123) failed: API rate limit exceeded."` — useless for continuation.

## Foreground vs Background: Which Mode?

The decision matrix:

| Scenario | Mode |
|----------|------|
| Quick subagent (< 30s, finishes within parent's turn) | Foreground |
| Slow subagent (minutes, parent can do other things) | Background |
| Multiple parallel subagents (parent batches them) | Background or Fork |
| Subagent with `background: true` in frontmatter | Background (frontmatter forces it) |
| Subagent isolation `worktree` | Either; isolation is orthogonal |

The Agent tool's `run_in_background: boolean` parameter is the explicit knob. The model is encouraged to set it `true` when the task is open-ended ("research this", "review this PR", "draft a doc"). For quick, deterministic queries ("read this file and summarize"), it's left `false`.

## Idle Sub-Agent Summary Cap

In addition to the per-tick skip, there's an aggregate "idle cap" mechanism. From the changelog:

> Fixed sub-agent summaries firing repeatedly while a sub-agent's transcript is static, capping worst-case token cost on idle sub-agents

The cap interacts with the `tengu_agent_summary_skipped: "unchanged"` once-per-streak flag: every idle tick after the first re-uses the cached `lastSummaryText` and does *zero* API calls. The worst-case token cost for an idle subagent is one summary turn's tokens. Active subagents (transcript changes every 30s) pay one summary turn per tick.

## Key Decision: Why 30 Seconds?

**What it does:** `SUMMARY_INTERVAL_MS = 30000` — summaries fire every 30 seconds.

**Why this approach:**
1. **User perception** — 30s is the threshold where users start wondering "is this thing still running?". A summary every 30s confirms liveness without being noisy.
2. **API quota** — each summary is a small API call (~500 tokens fresh + cache-shared prefix). Once per 30s is sustainable; once per 5s would burn quota.
3. **Bash tool timeouts** — many long-running commands have their own progress reporting (e.g. `npm test` prints progress every few seconds). A 30s summary cadence aligns naturally.

**Alternative considered:** Adaptive interval (e.g. 10s after a transcript change, exponential backoff if idle).

This would reduce idle telemetry further and produce snappier summaries early in a turn. But the implementation complexity isn't justified: the once-per-streak idle telemetry flag already minimizes telemetry, and 30s is fast enough for user comfort.

**Key insight:** The summarization loop is **a watchdog, not a progress tracker**. Its job is to confirm "the subagent is still alive and doing X". Higher-resolution progress comes from the subagent's actual transcript (tool calls, file edits) — read directly by the parent if it wants.

## Lifecycle Wire-up: When Does Summarization Start?

Inside `runAgent`'s setup (cli_inner_pretty.js:393187+) and `slH`'s wrapper, summarization is started conditionally:

```javascript
enableSummarization: i3H() || W0() || Ko(),    // cli_inner_pretty.js:386759
```

The flag-set is: `i3H()` (master kill — currently false), `W0()` (fork-subagent enabled), `Ko()` (some other gate). Summarization is enabled when at least one is true.

When enabled, `slH` calls `startAgentSummarization` after the subagent task is registered and stores the returned `{ stop }` handle. The handle is invoked in the subagent's cleanup chain.

## Cross-References

- **`<task-notification>` schema** — The wire format for parent-side notifications. Defined in `tasks/LocalAgentTask/LocalAgentTask.ts`.
- **`registerAsyncAgent`** — Registers a subagent in the task registry; returns the agent task ID for the parent to track.
- **`taskRegistry.update(taskId, { progressDescription })`** — How summaries reach the UI / notification system.
- **Foreground vs SDK** — In SDK / `--print` mode, the parent doesn't have a turn loop to receive `<task-notification>` attachments; the SDK streams them as separate events.

## Key Insight

The summary loop is a **fork-shared-cache trick** that exploits a property of the Anthropic API's prompt cache: two API requests with the same prefix can share a cache entry, paying full token cost only on the divergent suffix. By making the summary fork's prefix *identical* to the subagent's main API prefix (same `cacheSafeParams`, same messages list filtered identically), the summary turn pays effectively zero `cache_creation` cost.

The v2.1.128 fix was the realization that this trick was available and the implementation that wired it up. Pre-v2.1.128, the summary fork was treated as an independent query and paid full cache-creation cost; post-v2.1.128, it's free-riding on the subagent's cache.

This is an excellent case of **API-level micro-optimization** producing meaningful user-visible savings: 3× reduction in cache_creation tokens for a feature that fires every 30s while every background subagent is alive translates to substantial $/session reduction for users with heavy background subagent use.

The companion idle-cap optimization (v2.1.128 "Fixed sub-agent summaries firing repeatedly while transcript is static") closes the worst-case scenario where summaries would run forever on a stuck subagent. Together they make background subagent costs **bounded and predictable**.
