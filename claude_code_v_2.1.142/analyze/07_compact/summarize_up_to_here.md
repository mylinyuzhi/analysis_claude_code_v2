# Rewind Menu — "Summarize up to here" (v2.1.141)

## Changelog Anchor

> Rewind menu: added "Summarize up to here" to compress earlier context while keeping recent turns intact

## What Changed

The Rewind menu (`Hc6` — the `MessageSelector` UI) previously offered three actions:

- **Restore conversation** — fork at the selected message, drop the rest of the timeline
- **Restore code** — rewind file edits to the snapshot at the selected point
- **Summarize from here** — keep messages before the selected point, summarize the messages *after* it

v2.1.141 adds a fourth:

- **Summarize up to here** *(NEW)* — keep messages *after* the selected point, summarize the messages *before* it

The underlying `_H4` (partialCompact) function already supported both directions internally — see [../../../claude_code_v_2.1.112/analyze/07_compact/partial_compaction.md](../../../claude_code_v_2.1.112/analyze/07_compact/partial_compaction.md). The v2.1.141 work was UI plumbing: the option in the selector, the description text, and the onSummarize handler dispatch.

## The Two Directions Side-By-Side

```
Conversation timeline:
  M0 ─→ M1 ─→ M2 ─→ M3 ─→ M4 ─→ M5 ─→ M6 ─→ M7
                       ↑
                  user clicks here (M3)

"Summarize from here":          "Summarize up to here":
  M0 → M1 → M2 → [SUMMARY of      [SUMMARY of M0..M2] → M3 → M4 → M5 → M6 → M7
   M3..M7]                       (kept verbatim)
   (boundary at M3)
                                Cursor stays at end (M7).
                                Old context compressed to free room
                                for new work.
```

| Scenario | Use "Summarize from here" | Use "Summarize up to here" |
|----------|---------------------------|----------------------------|
| User explored a dead end and wants to retry from M3 | ✓ | |
| User has lots of early setup/exploration that no longer matters | | ✓ |
| Long session approaching context limit; user wants to keep working forward | | ✓ |
| User wants to redo something earlier with summarized future context | ✓ | |

## Selector Code — Where the Option Lives

```javascript
// ============================================
// renderRestoreOptions - Builds the action list for the rewind menu
// Location: cli_inner_pretty.js:539887-539909
// ============================================

// ORIGINAL (for source lookup):
function r(DH) {
  let OH = DH
      ? [
          { value: "both", label: "Restore code and conversation" },
          { value: "conversation", label: "Restore conversation" },
          { value: "code", label: "Restore code" },
        ]
      : [{ value: "conversation", label: "Restore conversation" }],
    GH = {
      type: "input",
      placeholder: "add context (optional)",
      initialValue: "",
      allowEmptySubmitToCancel: !0,
      showLabelWithValue: !0,
      labelValueSeparator: ": ",
    };
  return (
    OH.push({ value: "summarize", label: "Summarize from here", ...GH, onChange: Q }),
    OH.push({ value: "summarize_up_to", label: "Summarize up to here", ...GH, onChange: l }),    // ← NEW v2.1.141
    OH.push({ value: "nevermind", label: "Never mind" }),
    OH
  );
}

// READABLE (for understanding):
function renderRestoreOptions(canRestoreCode) {
  const baseOptions = canRestoreCode
    ? [
        { value: "both",         label: "Restore code and conversation" },
        { value: "conversation", label: "Restore conversation" },
        { value: "code",         label: "Restore code" },
      ]
    : [{ value: "conversation", label: "Restore conversation" }];

  const inputConfig = {
    type: "input",
    placeholder: "add context (optional)",
    initialValue: "",
    allowEmptySubmitToCancel: true,
    showLabelWithValue: true,
    labelValueSeparator: ": ",
  };

  baseOptions.push({ value: "summarize",       label: "Summarize from here", ...inputConfig, onChange: setForwardContext });
  baseOptions.push({ value: "summarize_up_to", label: "Summarize up to here", ...inputConfig, onChange: setBackwardContext });  // ← NEW v2.1.141
  baseOptions.push({ value: "nevermind",       label: "Never mind" });
  return baseOptions;
}

// Mapping: r→renderRestoreOptions, DH→canRestoreCode, OH→baseOptions, GH→inputConfig,
//          Q→setForwardContext (existing g state), l→setBackwardContext (new c state)
```

## Direction Plumbing — Selector → Handler

```javascript
// ============================================
// handleSummarizeAction - Routes the user's choice to the onSummarize callback
// Location: cli_inner_pretty.js:539941-539965
// ============================================

// ORIGINAL (for source lookup):
async function qH(DH) {
  if ((d("tengu_message_selector_restore_option_selected", { option: DH }), !E)) { ... }
  if (DH === "nevermind") { ... }
  if (ed6(DH)) {                              // ed6 = (H) => H === "summarize" || H === "summarize_up_to"
    ($(), B(!0), S(DH), O(void 0));
    try {
      let TH = DH === "summarize_up_to" ? "up_to" : "from",
        vH = (TH === "up_to" ? c : g).trim() || void 0;
      (await _(E, vH, TH), B(!1), S(null), I(void 0), A());
    } catch (TH) { ... }
    return;
  }
  ... // restore code/conversation path
}

// READABLE (for understanding):
async function handleSummarizeAction(actionValue) {
  telemetry("tengu_message_selector_restore_option_selected", { option: actionValue });
  if (!selectedMessage) { /* show error */ return; }

  if (actionValue === "nevermind") { /* close */ return; }

  if (isSummarizeAction(actionValue)) {  // ed6
    onPreRestore();
    setBusy(true);
    setSummarizeKind(actionValue);
    setError(undefined);
    try {
      const direction = actionValue === "summarize_up_to" ? "up_to" : "from";
      const contextText = (direction === "up_to" ? backwardContext : forwardContext).trim() || undefined;
      // ↑ Each direction has its own optional user-context input — keyed off c (backward) vs g (forward).
      await onSummarize(selectedMessage, contextText, direction);
      setBusy(false);
      setSummarizeKind(null);
      setSelectedMessage(undefined);
      onClose();
    } catch (e) {
      // handle error
    }
    return;
  }
  // ... fall through to restore code/conversation
}

// Mapping: qH→handleSummarizeAction, DH→actionValue, ed6→isSummarizeAction,
//          TH→direction, vH→contextText, c→backwardContext, g→forwardContext,
//          E→selectedMessage, _→onSummarize, $→onPreRestore, B→setBusy
```

## onSummarize Handler — Bridges to `_H4`

```javascript
// ============================================
// rewindOnSummarize - Calls partial compact and splices the result into chat history
// Location: cli_inner_pretty.js:582455-582515
// ============================================

// ORIGINAL (for source lookup):
onSummarize: async (j$, a$, j8 = "from") => {
  let Xq = X3(Z9),
    wK = Xq.indexOf(j$);
  if (wK === -1) { /* "message no longer in context" warning */ return; }
  ...
  let W1 = await _H4(
      Xq, wK, yq,
      { systemPrompt: E_, userContext: c4, systemContext: YO, toolUseContext: yq, forkContextMessages: Xq },
      a$,
      j8,
    ),
    t5 = W1.messagesToKeep,
    NM = j8 === "up_to" ? [...W1.summaryMessages, ...t5] : [...t5, ...W1.summaryMessages],
    _T = [W1.boundaryMarker, ...NM, ...W1.attachments, ...W1.hookResults];
  if (lq() && j8 === "from")
    d4((VJ) => {
      let Q2 = VJ.findIndex((Yx) => Yx.uuid === j$.uuid);
      return [...VJ.slice(0, Q2 === -1 ? 0 : Q2), ..._T];
    });
  else d4(_T);
  if ((q9(QJH.randomUUID()), Bn(yq.options.querySource, yq.setAppState), j8 === "from")) { ... }
  ...
}

// READABLE (for understanding):
const rewindOnSummarize = async (selectedMessage, userContextText, direction = "from") => {
  const visibleHistory = filterDeadFork(messages);  // X3
  const messageIdx = visibleHistory.indexOf(selectedMessage);
  if (messageIdx === -1) {
    setNotifications((prev) => [
      ...prev,
      makeWarning("That message is no longer in the active context. Choose a more recent message."),
    ]);
    return;
  }

  const tools = currentTools;
  const toolUseContext = buildToolUseContext(visibleHistory, [], tools, ...);
  const appState = toolUseContext.getAppState();
  const finalTools = await resolveTools(toolUseContext.options.tools,
    { permissionMode: appState.toolPermissionContext.mode, mainLoopModel: toolUseContext.options.mainLoopModel },
    Array.from(appState.toolPermissionContext.additionalWorkingDirectories.keys()));
  const systemPrompt = buildSystemPrompt({
    mainThreadAgentDefinition: undefined,
    toolUseContext,
    customSystemPrompt: toolUseContext.options.customSystemPrompt,
    defaultSystemPrompt: finalTools,
    appendSystemPrompt: toolUseContext.options.appendSystemPrompt,
  });

  const [claudeMd, gitStatus] = await Promise.all([loadProjectMemory(), loadSystemContext(appState.cacheBreakerPhrase)]);

  const partialResult = await _H4(   // partialCompact — see [../../../claude_code_v_2.1.112/analyze/07_compact/partial_compaction.md]
    visibleHistory,
    messageIdx,
    toolUseContext,
    { systemPrompt, userContext: claudeMd, systemContext: gitStatus, toolUseContext, forkContextMessages: visibleHistory },
    userContextText,
    direction,
  );

  const keepers = partialResult.messagesToKeep;

  // ─── This is the key ordering decision: ────────────────────────────────────
  //   "up_to":  summary FIRST, then preserved tail
  //   "from":   preserved head FIRST, then summary
  // The summary always lands where it replaces what it summarized.
  const orderedBody = direction === "up_to"
    ? [...partialResult.summaryMessages, ...keepers]
    : [...keepers, ...partialResult.summaryMessages];

  const finalMessages = [
    partialResult.boundaryMarker,
    ...orderedBody,
    ...partialResult.attachments,
    ...partialResult.hookResults,
  ];

  if (isInteractive() && direction === "from") {
    // For "from": splice in at the selected uuid (the user's restore point)
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.uuid === selectedMessage.uuid);
      return [...prev.slice(0, idx === -1 ? 0 : idx), ...finalMessages];
    });
  } else {
    // For "up_to" or non-interactive: replace entire history
    setMessages(finalMessages);
  }

  generateNewSessionUUID();
  postCompactCleanup(toolUseContext.options.querySource, toolUseContext.setAppState);  // Bn

  if (direction === "from") {
    // For "from", the rewind point becomes the new prompt — re-prime input box
    const lastUserMessage = extractLastUserText(selectedMessage);
    if (lastUserMessage) { setInputBox(lastUserMessage.text); setVimMode(lastUserMessage.mode); }
  }

  const toggleTranscriptKey = getKeybindingDisplay("app:toggleTranscript", "Global", "ctrl+o");
  showToast({
    key: "summarize-ctrl-o-hint",
    text: `Conversation summarized (${toggleTranscriptKey} for history)`,
    priority: "medium",
    timeoutMs: 8000,
  });
};

// Mapping: j$→selectedMessage, a$→userContextText, j8→direction, Xq→visibleHistory, wK→messageIdx,
//          W1→partialResult, t5→keepers, NM→orderedBody, _T→finalMessages, d4→setMessages,
//          q9→generateNewSessionUUID, Bn→postCompactCleanup
```

## Description Text — Why Direction-Specific Wording Matters

The status text under each option (`lF5`):

```javascript
function lF5(H) {
  switch (H) {
    case "summarize":
      return "Messages after this point will be summarized.";
    case "summarize_up_to":
      return "Preceding messages will be summarized. This and subsequent messages will remain unchanged — you will stay at the end of the conversation.";   // ← NEW v2.1.141
    case "both":
    case "conversation":
      return "The conversation will be forked.";
    case "code":
    case "nevermind":
      return "The conversation will be unchanged.";
  }
}
```

The "you will stay at the end of the conversation" addition is critical UX. Users mentally model "rewind" as "go back". The `"up_to"` action *doesn't move the cursor* — they keep their forward progress. The text makes this explicit so users don't think they're losing their recent work.

## How `_H4` Handles the Two Directions

The internals of `_H4` are documented in [../../../claude_code_v_2.1.112/analyze/07_compact/partial_compaction.md](../../../claude_code_v_2.1.112/analyze/07_compact/partial_compaction.md). The relevant slice is:

```javascript
let M = A === "up_to" ? H.slice(0, $) : H.slice($),         // messages to summarize
    w = A === "up_to"
        ? H.slice($).filter((t) => t.type !== "progress" && !xL(t) && !(t.type === "user" && t.isCompactSummary))
        : H.slice(0, $).filter((t) => t.type !== "progress");                                                        // messages to keep
...
let Z = A === "up_to" ? M : H,                              // what goes into the summarize forkContextMessages
    W = A === "up_to" ? { ...K, forkContextMessages: M } : K;
```

The salient differences:

- `"up_to"`: only feeds `M` (the head) to the summarize call. The tail is excluded entirely because it would defeat the purpose (the user wants the tail kept verbatim, no point including it in the summarize prompt).
- `"from"`: feeds the *entire* `H` (full conversation) to the summarize call so the summarizer can see what came before the to-be-summarized portion for context. This matches the v2.1.112 baseline behavior.

This asymmetry is why `_H4` always existed with a `direction` parameter — the underlying logic was ready, only the UI surface was missing.

## Boundary Marker — anchor_uuid Direction

The boundary marker (`jM$`) embeds a `preservedSegment.anchorUuid`. For `"up_to"`, the anchor is the *first preserved message's* UUID (because preceding it was summarized). For `"from"`, the anchor is the last preserved message's UUID (because everything after was summarized). The loader (`compact_metadata.preservedSegment` reader) uses this to splice the preserved tail/head back into the right spot on `--resume`.

## Telemetry

The `tengu_partial_compact` event carries a `direction` field set to `"from"` or `"up_to"`. The `trigger` is `"message_selector"` to distinguish rewind-driven partial compacts from `/compact <range>` cases.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module (`/rewind` slash command lives here)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - MessageSelector UI
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `messageSelector` (`Hc6`) — `cli_inner_pretty.js:539845-540197` — The Rewind menu component
- `isSummarizeAction` (`ed6`) — `cli_inner_pretty.js:539842-539844` — Returns true for `"summarize"` or `"summarize_up_to"`
- `summarizeOptionDescription` (`lF5`) — `cli_inner_pretty.js:540199-540212` — Status text per action
- `partialCompact` (`_H4`) — `cli_inner_pretty.js:407768-407934` — The direction-aware partial compactor
- `rewindOnSummarize` — inline handler at `cli_inner_pretty.js:582455-582515` — Bridges UI to `_H4`
