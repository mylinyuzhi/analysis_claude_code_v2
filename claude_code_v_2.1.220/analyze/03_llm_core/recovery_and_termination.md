# Recovery transitions, Stop hooks, and terminal reasons

The no-tool half of `runQueryTurns` (`xud`) is a recovery controller. It withholds selected errors,
tries bounded repairs, and only then either invokes Stop hooks or returns a typed terminal reason. The
tool half has a separate early-termination protocol for tool/MCP results that explicitly end the turn.

## 1. Context-overflow recovery ownership

### Reactive compaction handoff

**What it does:** When an attempt emitted no executable tool block and ended with a prompt-too-long or
request-media error, it swaps in an available precomputed compact result or launches reactive
compaction before exposing the error (`cli_inner_pretty.js:338687-338834`).

```javascript
// ============================================
// continueAfterReactiveCompaction - Replace history and retry the same model turn
// Location: cli_inner_pretty.js:338793-338818
// ============================================

// ORIGINAL (for source lookup):
        if (wi) {
          if (e.taskBudget) {
            let ku = qHs(Le);
            _ = Math.max(0, (_ ?? e.taskBudget.total) - ku);
          }
          if (YNe() === "padded-countdown") w7r(V.agentId ?? "main", H9(Le));
          for (let ku of WHs(wi)) yield ku;
          let sl = Yze(wi);
          ((Ce = Gds(f.uuid(), yo)),
            (g = {
              messages: sl,
              toolUseContext: V,
              compactTracking: Ce,
              maxOutputTokensRecoveryCount: re,
              hasAttemptedReactiveCompact: go === void 0,
              thinkingOnlyNudged: ce,
              maxOutputTokensOverride: void 0,
              resumeIncompleteThinking: Te,
              pendingToolUseSummary: void 0,
              stopHookActive: te,
              stopHookBlockingCount: 0,
              turnCount: ae,
              transition: { reason: go ? "precomputed_compact_swap" : "reactive_compact_retry" },
            }));
          continue;
        }

// READABLE (for understanding):
        if (compactionResult) {
          if (params.taskBudget) {
            const tokensAtCompact = finalContextTokensFromLastResponse(messagesForQuery);
            taskBudgetRemaining = Math.max(
              0,
              (taskBudgetRemaining ?? params.taskBudget.total) - tokensAtCompact,
            );
          }
          if (getTotalTokensReminderMode() === "padded-countdown") {
            addTotalTokensReminderUsage(
              toolUseContext.agentId ?? "main",
              tokenCountFromLastAPIResponse(messagesForQuery),
            );
          }
          yield* buildCompactionEmittedMessages(compactionResult);
          const compactedMessages = buildPostCompactMessages(compactionResult);
          compactTracking = makeCompactedTurnState(deps.uuid(), consecutiveRapidRefills);
          state = {
            messages: compactedMessages,
            toolUseContext,
            compactTracking,
            maxOutputTokensRecoveryCount,
            hasAttemptedReactiveCompact: precomputedSwap === undefined,
            thinkingOnlyNudged,
            maxOutputTokensOverride: undefined,
            resumeIncompleteThinking,
            pendingToolUseSummary: undefined,
            stopHookActive,
            stopHookBlockingCount: 0,
            turnCount,
            transition: {
              reason: precomputedSwap
                ? "precomputed_compact_swap"
                : "reactive_compact_retry",
            },
          };
          continue;
        }

// Mapping: wi→compactionResult, e→params, ku→tokensAtCompact/message, qHs→finalContextTokensFromLastResponse, Le→messagesForQuery, _→taskBudgetRemaining, YNe→getTotalTokensReminderMode, w7r→addTotalTokensReminderUsage, H9→tokenCountFromLastAPIResponse, WHs→buildCompactionEmittedMessages, Yze→buildPostCompactMessages, sl→compactedMessages, Gds→makeCompactedTurnState, f→deps, Ce→compactTracking, g→state, V→toolUseContext, re→maxOutputTokensRecoveryCount, go→precomputedSwap, ce→thinkingOnlyNudged, Te→resumeIncompleteThinking, te→stopHookActive, ae→turnCount
```

**How it works:**

1. This path is reachable only under `!turnAccumulator.needsFollowUp`, so compaction never races a
   valid tool trajectory (`:338687`).
2. It distinguishes `isPromptTooLongApiMessage` (`ZNe`) from
   `isAssistantRequestTooLargeMessage` (`rwo`) and uses a fresh abort-controller wrapper for the
   recovery work (`:338700-338703`).
3. Before spending on compaction, it applies the rapid-refill breaker and detects the case where a
   single indivisible message group makes compaction impossible (`:338705-338749`).
4. It consults precomputed compaction state, then calls the reactive compactor with the same prompts,
   context, and sticky betas as the failed request (`:338751-338792`).
5. Success emits boundary/summary messages, replaces history, preserves task-budget accounting, and
   continues. Failure finally yields the withheld API message and returns `prompt_too_long` or
   `image_error` (`:338793-338833`).

**Why this approach:**

- Withholding prevents SDK consumers from terminating on an error the loop may repair.
- Recovery is after a real API rejection because server token/media accounting is more authoritative
  than a local estimate.
- A one-attempt guard prevents repeated **reactive** compaction. A precomputed swap deliberately does
  not consume that guard, so a still-rejected swapped history retains one reactive repair attempt.
  The rapid-refill breaker separately catches histories that refill soon after successful compaction.
- The trade-off is latency: the user waits for a compaction model call before seeing the original
  error. That cost is paid only for errors judged recoverable.

**Key insight:** the compactor owns message reduction, while the query loop owns error visibility and
retry state. Neither layer can implement the recovery safely in isolation.

## 2. Output-token recovery

### Bounded max-output continuation

**What it does:** Suppresses a `max_output_tokens` API message and asks the model to resume, up to three
times, with a special path that preserves an incomplete signed thinking block (`:338835-338872`).

```javascript
// ============================================
// recoverFromMaxOutputTokens - Resume a truncated response with a bounded retry count
// Location: cli_inner_pretty.js:338835-338872
// ============================================

// ORIGINAL (for source lookup):
      if ((Aud(He, mt), Cud(rt))) {
        if (re < t$y) {
          let Fi = r$y(He, Pt([...Le, ...He.filter((Kt) => !Kt.isApiErrorMessage)]));
          if (Te && !Fi && He.some((Kt) => !Kt.isApiErrorMessage))
            be("query_thinking_block_resumption", { attempt: re });
          g = {
            messages: Fi
              ? [...Le, ...He.filter((Kt) => !Kt.isApiErrorMessage)]
              : [
                  ...Le,
                  ...He,
                  zr({
                    content:
                      "Output token limit hit. Resume directly \u2014 no apology, no recap of what you were doing. " +
                      "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
                    isMeta: !0,
                    now: f.now,
                    uuidFn: f.uuid,
                  }),
                ],
            resumeIncompleteThinking: Fi || void 0,
            toolUseContext: V,
            compactTracking: Ce,
            maxOutputTokensRecoveryCount: re + 1,
            hasAttemptedReactiveCompact: oe,
            thinkingOnlyNudged: ce,
            maxOutputTokensOverride: void 0,
            pendingToolUseSummary: void 0,
            stopHookActive: te,
            stopHookBlockingCount: 0,
            turnCount: ae,
            transition: { reason: "max_output_tokens_recovery", attempt: re + 1 },
          };
          continue;
        }
        if (Te) pe("query_thinking_block_resumption", "exhausted");
        yield rt;
      }

// READABLE (for understanding):
      logFabricatedTurnCandidates(assistantMessages, currentModel);
      if (isWithheldMaxOutputTokens(lastMessage)) {
        if (recoveryCount < MAX_OUTPUT_TOKENS_RECOVERY_LIMIT) {
          const assistantMessagesWithoutApiErrors = assistantMessages
            .filter(message => !message.isApiErrorMessage);
          const canResumeThinking = canResumeIncompleteThinking(
            assistantMessages,
            selectModelForHistory([
              ...messagesForQuery,
              ...assistantMessagesWithoutApiErrors,
            ]),
          );
          state = {
            messages: canResumeThinking
              ? [...messagesForQuery, ...assistantMessagesWithoutApiErrors]
              : [
                  ...messagesForQuery,
                  ...assistantMessages,
                  createUserMessage({
                    content:
                      "Output token limit hit. Resume directly — no apology, no recap of what you were doing. " +
                      "Pick up mid-thought if that is where the cut happened. Break remaining work into smaller pieces.",
                    isMeta: true,
                    now: deps.now,
                    uuidFn: deps.uuid,
                  }),
                ],
            resumeIncompleteThinking: canResumeThinking || undefined,
            toolUseContext,
            compactTracking,
            maxOutputTokensRecoveryCount: recoveryCount + 1,
            hasAttemptedReactiveCompact,
            thinkingOnlyNudged,
            maxOutputTokensOverride: undefined,
            pendingToolUseSummary: undefined,
            stopHookActive,
            stopHookBlockingCount: 0,
            turnCount,
            transition: {
              reason: "max_output_tokens_recovery",
              attempt: recoveryCount + 1,
            },
          };
          continue;
        }
        yield lastMessage;
      }

// Mapping: Aud→logFabricatedTurnCandidates, He→assistantMessages, mt→currentModel, Cud→isWithheldMaxOutputTokens, rt→lastMessage, re→recoveryCount, t$y→MAX_OUTPUT_TOKENS_RECOVERY_LIMIT, Kt→message, r$y→canResumeIncompleteThinking, Fi→canResumeThinking, Pt→selectModelForHistory, Le→messagesForQuery, zr→createUserMessage, f→deps, g→state, V→toolUseContext, Ce→compactTracking, oe→hasAttemptedReactiveCompact, ce→thinkingOnlyNudged, te→stopHookActive, ae→turnCount
```

**How it works:**

1. `isWithheldMaxOutputTokens` (`Cud`) recognizes only assistant API-error messages whose `apiError` is
   `max_output_tokens` (`:337249-337250`).
2. `canResumeIncompleteThinking` (`r$y`) accepts only one non-error assistant message after excluding
   unsigned-thinking-only records. That message must contain exactly one verified thinking block, stop
   at `max_tokens` on the expected model, and pass the resumption gate (`:337252-337265`).
3. That narrow case removes API-error messages and sets `resumeIncompleteThinking`; the generic case
   retains the partial assistant output and adds an invisible resume instruction (`:338839-338854`).
4. Each retry increments `maxOutputTokensRecoveryCount` and records the attempt in the transition
   (`:338855-338868`). `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT` is `3` (`:339330`).
5. After exhaustion, the previously withheld error is finally yielded (`:338870-338871`).

**Why this approach:**

- A generic “continue” prompt is appropriate for visible text but can invalidate the signed thinking
  trajectory. The strict predicate protects the special resume protocol.
- Three attempts bound cost and prevent a model that repeatedly fills the output window from looping
  forever.
- Keeping partial output gives the continuation context; the trade-off is a longer next request and a
  chance of stylistic seams.

**Key insight:** the loop has two continuation protocols—message-level nudging and wire-level thinking
resumption—and chooses the latter only when the response shape proves it is safe.

## 3. Malformed and contentless responses

### Malformed tool-use retry

**What it does:** Repairs the contradiction “final stop reason says tool use, but no tool block was
parsed,” then fails terminally if the contradiction repeats (`:338873-338909`).

**How it works:**

1. The guard requires `stop_reason === "tool_use"`, an empty `toolUseBlocks` array, and no API-error
   message (`:338873`).
2. It retries only when the preceding transition was not already `malformed_tool_use_retry`
   (`:338874`).
3. A clean-retry setting can tombstone the malformed assistant messages and retry from the prior
   history plus a corrective meta message. Otherwise the malformed output remains in context before
   the correction (`:338875-338902`).
4. A repeated contradiction produces a user-visible error and returns
   `malformed_tool_use_exhausted` (`:338903-338909`).

**Why this approach:**

- One retry handles transient stream/parser disagreement without hiding a persistent model failure.
- Clean retry avoids teaching the model from its malformed output, but tombstoning removes potentially
  useful partial text. The gated choice exposes that quality-versus-continuity trade-off.
- The terminal reason is specific, allowing telemetry to distinguish protocol shape failure from a
  transport or ordinary API error.

**Key insight:** this branch exists because content blocks, not stop metadata, are the loop's execution
authority.

### Thinking-only nudge

**What it does:** Gives one extra attempt when an apparently successful response contains no
user-visible text (`:338911-338942`).

**How it works:**

1. It requires `end_turn` or `stop_sequence`, no API error, a non-compact/non-auxiliary source, no
   non-whitespace text, and no recent successful terminal-MCP or structured-output tool path. Those
   tool paths can legitimately end without ordinary assistant text (`:338688-338699`,
   `:338911-338920`; terminal-MCP detector `:319736-319756`).
2. On the first occurrence it appends a meta nudge, sets `thinkingOnlyNudged`, and continues with
   transition `thinking_only_retry` (`:338921-338939`).
3. On the second occurrence it records exhaustion but does not manufacture another retry; normal Stop
   hooks and completion proceed (`:338940-338950`).

**Why this approach:**

- A thinking-only response is structurally valid but useless to the user, so it merits a softer repair
  than a malformed-tool terminal.
- One retry avoids an infinite loop while giving the model a chance to render its conclusion.
- Treating exhaustion as completion rather than API failure reflects that the server returned a valid
  end-turn response.

**Key insight:** protocol validity and product usefulness are different. This branch repairs the latter
without misclassifying the former.

## 4. Stop-hook reinvocation

### Blocking Stop-hook loop with two caps

**What it does:** Lets a Stop hook feed blocking feedback back to the model, while bounding repeated
blocks by both `maxTurns` and a dedicated consecutive-block cap (`:338950-339007`).

```javascript
// ============================================
// handleBlockingStopHook - Reinvoke the model or override a repeatedly blocking hook
// Location: cli_inner_pretty.js:338958-339004
// ============================================

// ORIGINAL (for source lookup):
      if (Un.preventContinuation) return { reason: "stop_hook_prevented" };
      if (Un.blockingErrors.length > 0) {
        let Fi = ae + 1,
          yo = de + 1;
        if (c && Fi > c)
          return (
            O("tengu_stop_hook_block_count", {
              count: yo,
              is_subagent: Boolean(V.agentId),
              hit_max_turns: !0,
              hit_cap: !1,
            }),
            yield Va({ type: "max_turns_reached", maxTurns: c, turnCount: Fi }, f),
            { reason: "max_turns", turnCount: Fi }
          );
        let Kt = wue(process.env.CLAUDE_CODE_STOP_HOOK_BLOCK_CAP, 8);
        if (Kt > 0 && yo > Kt)
          return (
            O("tengu_stop_hook_block_count", {
              count: yo,
              is_subagent: Boolean(V.agentId),
              hit_max_turns: !1,
              hit_cap: !0,
            }),
            yield ml(
              `A hook blocked the turn from ending ${yo} consecutive times \u2014 overriding and ending turn. ` +
                "For Stop/SubagentStop hooks, check stop_hook_active in the input and return success while it's true. Set CLAUDE_CODE_STOP_HOOK_BLOCK_CAP to raise this limit.",
              "warning",
            ),
            { reason: "completed" }
          );
        g = {
          messages: [...Le, ...He, ...Un.blockingErrors],
          toolUseContext: V,
          compactTracking: Ce,
          maxOutputTokensRecoveryCount: 0,
          hasAttemptedReactiveCompact: oe,
          maxOutputTokensOverride: void 0,
          pendingToolUseSummary: void 0,
          stopHookActive: !0,
          thinkingOnlyNudged: ce,
          stopHookBlockingCount: yo,
          turnCount: Fi,
          transition: { reason: "stop_hook_blocking" },
        };
        continue;
      }

// READABLE (for understanding):
      if (stopHookResult.preventContinuation) {
        return { reason: "stop_hook_prevented" };
      }
      if (stopHookResult.blockingErrors.length > 0) {
        const nextTurnCount = turnCount + 1;
        const nextBlockCount = stopHookBlockingCount + 1;
        if (maxTurns && nextTurnCount > maxTurns) {
          yield createMaxTurnsMessage(maxTurns, nextTurnCount);
          return { reason: "max_turns", turnCount: nextTurnCount };
        }
        const cap = readNumericEnvOrDefault("CLAUDE_CODE_STOP_HOOK_BLOCK_CAP", 8);
        if (cap > 0 && nextBlockCount > cap) {
          yield warning("Stop hook block cap exceeded; ending the turn");
          return { reason: "completed" };
        }
        state = {
          messages: [
            ...messagesForQuery,
            ...assistantMessages,
            ...stopHookResult.blockingErrors,
          ],
          toolUseContext,
          compactTracking,
          maxOutputTokensRecoveryCount: 0,
          hasAttemptedReactiveCompact,
          maxOutputTokensOverride: undefined,
          pendingToolUseSummary: undefined,
          stopHookActive: true,
          thinkingOnlyNudged,
          stopHookBlockingCount: nextBlockCount,
          turnCount: nextTurnCount,
          transition: { reason: "stop_hook_blocking" },
        };
        continue;
      }

// Mapping: Un→stopHookResult, Fi→nextTurnCount, yo→nextBlockCount, ae→turnCount, de→stopHookBlockingCount, c→maxTurns, Kt→cap, wue→readNumericEnvOrDefault, g→state, Le→messagesForQuery, He→assistantMessages, V→toolUseContext, Ce→compactTracking, oe→hasAttemptedReactiveCompact, ce→thinkingOnlyNudged
```

**How it works:**

1. `handleStopHooks` (`Ycd`) first performs end-of-turn bookkeeping and optional enforcement, then
   executes Stop/SubagentStop hooks and returns `{blockingErrors, preventContinuation}`
   (`:336419-336684`).
2. `preventContinuation` terminates immediately; blocking errors are different because they are
   appended as meta user input and the model is reinvoked (`:338958-339003`).
3. `maxTurns` wins when the reinvocation would exceed the caller's overall bound (`:338960-338972`).
4. Otherwise `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` defaults to 8; a positive cap ends the turn once the
   next consecutive count exceeds it (`:338973-338988`). A non-positive resolved value disables this
   dedicated cap, leaving `maxTurns` as the remaining bound.
5. A non-blocking completion after earlier blocks resets the telemetry count and returns `completed`
   (`:338951-338958`, `:339005`).

**Why this approach:**

- Blocking hook output is actionable feedback, so another model call is more useful than simply
  rejecting termination.
- `stopHookActive: true` tells hooks they are running in a reinvocation, allowing well-behaved hooks to
  stop blocking after the model responds.
- Two caps serve different authorities: `maxTurns` is the caller's global budget; the default-8 cap is
  a safety valve specifically for misconfigured hooks.
- Overriding the hook after the cap sacrifices strict enforcement to stop runaway API spending.

**Key insight:** a Stop-hook block is modeled as another conversational turn, not as an exception.

## 5. Tool- and MCP-requested end-turn

### Terminal tool-result protocol

**What it does:** Allows a successful tool result to end the turn without another model call, while
still running post-tool and terminal cleanup (`:331713-331732`, `:337178-337251`, `:339086-339107`).

**How it works:**

1. `getToolEndTurnSource` (`dld`) inspects user messages. It returns `"tool"` for `toolEndsTurn` or
   `"mcp_meta"` for `_meta["claude/endTurn"]`, but refuses to end the turn when any contained
   `tool_result` is an error (`:331713-331725`).
2. The per-attempt observer stores the first end-turn source while tool messages are drained
   (`:337401-337407`).
3. After all tools finish, `finalizeToolEndedTurn` (`e$y`) runs `PostToolBatch`, emits cancellation UI if
   required, then calls `handleTerminalStopHooks` (`$Hs`) and returns `completed`
   (`:337178-337251`, `:339086-339107`).
4. On this terminal path, blocking results from PostToolBatch or Stop hooks are logged and discarded
   because there will be no model reinvocation to act on them (`:336335-336372`, `:337210-337215`).

**Why this approach:**

- A tool explicitly marked end-turn may already be the user-facing response; another model call would
  add latency and could duplicate or contradict it.
- Error results never get this privilege because the model may need to recover from them.
- Cleanup still runs so telemetry, memory, and hooks observe a consistent turn boundary.
- Discarding blocks is a deliberate limitation: respecting them would contradict the no-reinvoke
  contract. Logging makes the lost enforcement diagnosable.

**Key insight:** “end turn” is metadata on a successful result, not a special API stop reason.

## 6. Unexpected-error transcript repair

### Missing tool-result synthesis

**What it does:** Before returning an unexpected model-loop error, emits synthetic error results for
assistant tool calls that do not already have a result (`:337148-337160`, `:338615-338635`).

**How it works:**

1. The catch path builds a set of every `tool_use_id` already present in accumulated user tool results
   (`:338626-338632`).
2. `yieldMissingToolResults` (`Q1y`) walks every assistant `tool_use`, skips IDs in that set, and creates
   an error `tool_result` with the same ID and source assistant UUID (`:337148-337160`).
3. Only after repairing those pairs does the loop emit the general query error and return
   `model_error` (`:338633-338635`).

**Why this approach:**

- Transcript consumers and future API calls require every retained `tool_use` to have a corresponding
  result. An exception between streaming and tool completion would otherwise leave invalid history.
- Deduplication avoids creating two results for tools that completed before the invariant failure.
- Synthetic error results preserve protocol validity but cannot undo external side effects from a tool
  that ran and failed to report.

**Key insight:** error handling repairs the message protocol before it reports the programming error.

## 7. Terminal taxonomy

### Separate failure and lifecycle classifiers

**What it does:** Classifies typed query-loop exits for telemetry and queued-command lifecycle without
collapsing them to success/failure (`:336830-336887`, `:337283-337297`).

```javascript
// ============================================
// classifyQueryTerminalReason - Distinguish aborts, failures, and normal control-flow exits
// Location: cli_inner_pretty.js:336830-336866
// ============================================

// ORIGINAL (for source lookup):
function qpt(e) {
  return e === "aborted_streaming" || e === "aborted_tools";
}
function BHs(e) {
  if (e === void 0) return !1;
  switch (e) {
    case "blocking_limit":
    case "rapid_refill_breaker":
    case "prompt_too_long":
    case "image_error":
    case "model_error":
    case "api_error":
    case "malformed_tool_use_exhausted":
    case "budget_exhausted":
    case "structured_output_retry_exhausted":
    case "tool_deferred_unavailable":
    case "turn_setup_failed":
      return !0;
    case "aborted_streaming":
    case "aborted_tools":
    case "stop_hook_prevented":
    case "hook_stopped":
    case "tool_deferred":
    case "max_turns":
    case "background_requested":
    case "completed":
      return !1;
    default:
      return !1;
  }
}
function sud(e) {
  return e.reason === "api_error" ? `api_error_${e.errorKind ?? "unknown"}` : e.reason;
}
function dTo(e) {
  return qpt(e) || BHs(e);
}

// READABLE (for understanding):
function isAbortTerminalReason(reason) {
  return reason === "aborted_streaming" || reason === "aborted_tools";
}
function isFailureTerminalReason(reason) {
  return new Set([
    "blocking_limit", "rapid_refill_breaker", "prompt_too_long", "image_error",
    "model_error", "api_error", "malformed_tool_use_exhausted", "budget_exhausted",
    "structured_output_retry_exhausted", "tool_deferred_unavailable", "turn_setup_failed",
  ]).has(reason);
}
function failureReasonMetric(terminal) {
  return terminal.reason === "api_error"
    ? `api_error_${terminal.errorKind ?? "unknown"}`
    : terminal.reason;
}
function shouldCancelCommandLifecycle(reason) {
  return isAbortTerminalReason(reason) || isFailureTerminalReason(reason);
}

// Mapping: qpt→isAbortTerminalReason, BHs→isFailureTerminalReason, sud→failureReasonMetric, dTo→shouldCancelCommandLifecycle, e→reason/terminal
```

**How it works:**

1. Two reasons are explicit aborts: during streaming and during tool execution (`:336830-336832`).
2. Eleven reasons count as failures, including context limits, API/model/media errors, exhausted repair
   paths, and setup/budget failures (`:336833-336849`).
3. Control-flow terminals—including hook prevention, deferral, max turns, background handoff, and
   completion—do not count as failed turns (`:336850-336859`).
4. API failures refine the metric label with `errorKind` (`:336861-336863`).
5. Queued-command lifecycle is marked cancelled for aborts **or** failures, but completed for the other
   terminal controls (`:336864-336865`, `:337291-337295`).

**Why this approach:**

- A user stopping at `max_turns` is not equivalent to a transport failure, even though neither reached
  ordinary semantic completion.
- Typed reasons support SDK status reporting, metrics, and UI without parsing error text. The complete
  enum is exported into the SDK schema at `:836831`.
- Defaulting unknown values to non-failure is fail-open for telemetry; it avoids declaring a new future
  control-flow reason an outage until explicitly classified. The trade-off is possible under-counting
  when a failure reason is added without updating this switch.

**Key insight:** terminal reason is the durable API; “success” is a consumer-specific projection of it.

## Cross-validation against 2.1.88 and 2.1.193

| Recovery or terminal path | Cross-check | Classification |
|---|---|---|
| Reactive compaction | The readable loop builds post-compact messages and continues with a replaced `State` at `src/query.ts:1119-1165`. | Algorithm ancestry confirmed; the 2.1.220 precomputed/circuit-breaker integration is newer layering. |
| Generic max-output recovery | 2.1.88 defines `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3` and `isWithheldMaxOutputTokens` at `src/query.ts:164-179`, then appends a continuation message at `:1223-1251`. The `max_output_tokens_recovery` transition also exists in 2.1.193. | Three-attempt recovery is carryover. The exact readable names correct the central symbol index. |
| Signed-thinking resumption | `resumeIncompleteThinking` occurs eight times in 2.1.220 and zero times in 2.1.193. | Net-new in the comparison window; it is not inferred from 2.1.88. |
| Source-only output escalation | The readable tree contains a feature-gated 8k-to-64k retry at `src/query.ts:1189-1221`; its gate, metric, and escalation constant are absent from the analyzed 2.1.220 bundle. | Rejected as production evidence; the report intentionally documents only the generic and signed-thinking paths found in 2.1.220. |
| Malformed tool response | Both bundles contain `tengu_malformed_tool_use_response`, but `malformed_tool_use_exhausted` occurs 3/0 in 2.1.220/2.1.193. The 2.1.193 repeated-failure branch returns `completed` at `:467587-467592`. | Retry is carryover; the typed exhausted failure is a 2.1.220 delta. |
| Thinking-only nudge | `thinking_only_retry` and its event are present in both production bundles. | Carryover by 2.1.193, although absent from the readable 2.1.88 query loop. |
| Stop-hook blocking | `handleStopHooks` returns blocking user messages for reinvocation at `src/query/stopHooks.ts:257-331`. The readable query has no dedicated repeat cap; both production bundles do. | Blocking feedback is old; the default-eight cap is later than 2.1.88 but carryover from 2.1.193. |
| Tool/MCP end-turn | `claude/endTurn` occurs 2/2, and the detector has equivalent logic at 2.1.193 `:444436-444444` and 2.1.220 `:331715-331723`. | Exact carryover, not a 2.1.220 feature. |
| Terminal taxonomy | The 2.1.88 `Terminal` flow is narrower; the 2.1.220 SDK exports typed abort, failure, hook, deferral, budget, setup, and completion reasons. | Later API hardening. In particular, `malformed_tool_use_exhausted` is classified as failure while `max_turns` remains control flow. |

**Cross-validation conclusion:** the report's recovery algorithms match their readable ancestors, but
version claims must be narrower. Signed-thinking resumption and the malformed-response terminal type
are true 2.1.220 deltas; the Stop cap, thinking-only retry, and tool/MCP end-turn path are carryover.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `runQueryTurns` (`xud`, `:337348`) - owner of recovery transitions
- `isPromptTooLongApiMessage` (`ZNe`, `:228072`) - prompt-overflow classifier
- `isAssistantRequestTooLargeMessage` (`rwo`, `:329009`) - media/request-size classifier
- `isWithheldMaxOutputTokens` (`Cud`, `:337249`) - withheld max-output classifier
- `canResumeIncompleteThinking` (`r$y`, `:337252`) - strict thinking-resumption predicate
- `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT` (`t$y`, `:339330`) - retry limit of 3
- `handleStopHooks` (`Ycd`, `:336419`) - normal completion and blocking feedback
- `handleTerminalStopHooks` (`$Hs`, `:336319`) - no-reinvoke cleanup path
- `getToolEndTurnSource` (`dld`, `:331717`) - successful tool/MCP end-turn detector
- `finalizeToolEndedTurn` (`e$y`, `:337178`) - terminal tool-result cleanup
- `yieldMissingToolResults` (`Q1y`, `:337148`) - transcript repair on invariant errors
- `isAbortTerminalReason` (`qpt`, `:336830`) - abort classifier
- `isFailureTerminalReason` (`BHs`, `:336833`) - failed-turn classifier
- `failureReasonMetric` (`sud`, `:336861`) - API-error metric refinement
- `shouldCancelCommandLifecycle` (`dTo`, `:336864`) - queued-command terminal mapping
