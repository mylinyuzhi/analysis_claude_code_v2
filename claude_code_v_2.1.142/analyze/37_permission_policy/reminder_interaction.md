# Permission Policy ↔ Reminder/Tools Interaction (v2.1.142)

**Theme:** The permission decision is computed by `tD`/`UA5` (see [`architecture.md`](./architecture.md)). But the model only *sees* a permission decision through the **next user turn's content** — as a `tool_result`, a `<system-reminder>`, or a `hook_blocking_error` attachment. This document maps the **outbound side** of the permission pipeline: from "verdict = deny" or "verdict = ask after the user clicked No" to "the model receives this text".

The five channels:

1. **`tool_result` with `is_error: true`** — the standard deny envelope.
2. **`<system-reminder>` injection** — for plan-mode warnings, mode transitions, scoped notes.
3. **`hook_blocking_error` attachment** — when a hook returned `behavior: deny` with explanatory text.
4. **`permission_request` envelope** — for the SDK control protocol and `permissionPromptTool`.
5. **`PermissionDenied` retry-hook reminder** — when the post-denial hook says "retry might work".

Plus the matching system reminders the **model emits to itself** about mode (plan-mode floor block, auto-mode denial notifications).

---

## 1. Channel A — `tool_result` with `is_error: true`

When the permission verdict is `deny` or the user clicked "No" on a prompt, the agent loop converts that into a `tool_result` block fed back to the model. The conversion happens at the end of the tool dispatch — the model sees this as its **next user message**.

```javascript
// ============================================
// denialToToolResult - Convert deny verdict to tool_result with is_error
// Location: cli_inner_pretty.js:388188-388211
// ============================================

// ORIGINAL (for source lookup):
let HH = S.message;
if (W && !HH) HH = `Execution stopped by PreToolUse hook${G ? `: ${G}` : ""}`;
let qH = [{ type: "tool_result", content: HH, is_error: !0, tool_use_id: $ }],
  a = S.behavior === "ask" ? S.contentBlocks : void 0;
if (a?.length) qH.push(...a);
// ... image-paste tracking
X.push({
  message: w8({ content: qH, imagePasteIds: t, toolUseResult: `Error: ${HH}`, sourceToolAssistantUUID: A.uuid }),
});
if (S.decisionReason?.type === "classifier" && S.decisionReason.classifier === "auto-mode") {
  /* PermissionDenied hook chain - see Channel E */
}

// READABLE (for understanding):
let denialMessage = verdict.message;
if (isPreToolUseHook && !denialMessage) {
  denialMessage = `Execution stopped by PreToolUse hook${hookExtraMsg ? `: ${hookExtraMsg}` : ""}`;
}
const denialContent = [
  { type: "tool_result", content: denialMessage, is_error: true, tool_use_id: toolUseId }
];
// If verdict is "ask" with additional contentBlocks (rare - SDK can return them), append
const askContentBlocks = verdict.behavior === "ask" ? verdict.contentBlocks : undefined;
if (askContentBlocks?.length) denialContent.push(...askContentBlocks);

// Build the user message that wraps this denial back to the model
nextMessages.push({
  message: makeUserMessage({
    content: denialContent,
    imagePasteIds: imagePasteIds,
    toolUseResult: `Error: ${denialMessage}`,
    sourceToolAssistantUUID: parentAssistantMsg.uuid,
  }),
});

// Mapping: S→verdict, HH→denialMessage, W→isPreToolUseHook, G→hookExtraMsg, $→toolUseId,
//          a→askContentBlocks, qH→denialContent, t→imagePasteIds, X→nextMessages,
//          A→parentAssistantMsg, w8→makeUserMessage
```

### What the model sees

The model receives, as part of its next user message:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_abc123",
  "is_error": true,
  "content": "Bash command blocked by permission rule 'Bash(rm:*)' from userSettings"
}
```

The `is_error: true` flag is **read by the model**: Anthropic's training teaches the model that `is_error: true` means the tool call failed and it should either retry differently or report failure. This is the same envelope shape used for tool exceptions, syntax errors, file-not-found — so denial appears in the same channel as any other tool failure.

### How the message text gets built — `N5` (`buildPermissionMessage`)

The `HH` in the snippet above is `verdict.message`, which is set by `N5` (`buildPermissionMessage`, cli_inner_pretty.js:421519). For different `decisionReason.type` values it produces:

```javascript
// cli_inner_pretty.js:421519-421558 (excerpt)
function N5(toolName, decisionReason) {
  if (!decisionReason) return /* generic */;
  if (decisionReason.type === "classifier")
    return `Classifier '${decisionReason.classifier}' requires approval for this ${toolName} command: ${decisionReason.reason}`;
  switch (decisionReason.type) {
    case "hook":
      return decisionReason.reason
        ? `Hook '${decisionReason.hookName}' blocked this action: ${decisionReason.reason}`
        : `Hook '${decisionReason.hookName}' requires approval for this ${toolName} command`;
    case "rule": {
      const ruleStr = formatRule(decisionReason.rule.ruleValue);
      const sourceStr = formatSource(decisionReason.rule.source);
      return `Permission rule '${ruleStr}' from ${sourceStr} requires approval for this ${toolName} command`;
    }
    case "mode":
      return `Current permission mode (${modeName(decisionReason.mode)}) requires approval for this ${toolName} command`;
    case "permissionPromptTool":
      return `Tool '${decisionReason.permissionPromptToolName}' requires approval for this ${toolName} command`;
    // ... etc.
  }
}
```

Different reason types produce different model-visible text. The model can read the text and decide whether to:
- Retry with different inputs (e.g., a path that's not denied)
- Report the denial to the user and stop
- Switch strategies (e.g., use a different tool)

The structured `decisionReason` is NOT shown to the model directly — only the formatted `message` string. The reason structure is for telemetry and UI.

### Special case — PreToolUse hook denial

When a `PreToolUse` hook returns `behavior: deny`, the message can be either the hook's own `message` or the fallback:

```
Execution stopped by PreToolUse hook
Execution stopped by PreToolUse hook: <hook's extra explanation>
```

The fallback exists for hooks that just return `{behavior: "deny"}` with no message — without the fallback, the model would see an empty error content and have no idea why.

---

## 2. Channel B — `<system-reminder>` Injection

Some permission outcomes are conveyed not via `tool_result` but via **system-reminder text** prepended to the next user message. This pattern is used for state changes that aren't tied to a specific tool call.

### The wrapping pattern

```javascript
// cli_inner_pretty.js:217459 (general system-reminder template)
`<system-reminder>${reminderText}</system-reminder>`
```

The system-reminder is a tagged text segment the model recognizes as ambient runtime state. The renderer at cli_inner_pretty.js:423283 walks an incoming user message and identifies `<system-reminder>` prefixes; the parser at cli_inner_pretty.js:241478 extracts the content for processing.

### Permission-related system reminders

| Reminder | When | Visible text (approximate) |
|---|---|---|
| Plan mode block | A write tool was called in `plan` mode | `<system-reminder>You are in plan mode. ExitPlanMode before writing.</system-reminder>` (varies) |
| Auto mode denial | Classifier blocked a tool | (Routed via `recordAutoModeDenial` → notification; not always a system-reminder) |
| Permission mode changed | User cycled mode mid-session | (Notification, not always reminder) |
| Mode-change auto-dismiss | Prompt auto-closed because new mode allows the action | (UI-only, not sent to model) |

The plan-mode reminder is the canonical example: when the user enters plan mode, every subsequent assistant turn sees an injected reminder that constrains the model's behavior.

### Why a reminder, not a `tool_result`?

Three reasons:

1. **No specific tool call to attach to.** A mode change happens between turns; there's no `tool_use_id` to wrap a `tool_result` around.
2. **Cache stability.** Reminders go in the messages array; modifying the system prompt to mention mode would bust the prompt cache.
3. **Anti-staleness.** Reminders re-inject each turn while the condition holds, fighting attention dilution. A one-shot tool_result wouldn't.

---

## 3. Channel C — `hook_blocking_error` Attachment

When a `PreToolUse` (or `PermissionRequest`) hook denies a tool call with explanatory text, that explanation is attached as a structured `hook_blocking_error` envelope. This is **separate from** the `tool_result` — the tool_result has the model-readable error message; the attachment carries the full hook context for rendering in the parent's REPL.

### Construction

```javascript
// cli_inner_pretty.js:520779 (within hook-execution path)
fK({
  type: "hook_blocking_error",
  hookName: q,                    // e.g. "PermissionRequest"
  toolUseID: K,
  hookEvent: _,                   // e.g. "PreToolUse"
  blockingError: M.blockingError,
});
```

`fK` is `createAttachmentMessage` — same builder used for hook_additional_context (see [`../34_subagent/reminder_interaction.md`](../34_subagent/reminder_interaction.md)).

### Renderer

```javascript
// cli_inner_pretty.js:347034-347042 (case "hook_blocking_error" in the attachment renderer)
case "hook_blocking_error": {
  if (H.hookEvent === "Stop" || H.hookEvent === "SubagentStop") return null;
  let A = H.blockingError.blockingError.trim();
  return gq.default.createElement(
    gq.default.Fragment,
    null,
    gq.default.createElement(TX, { color: "error" }, H.hookName, " hook returned blocking error"),
    A ? gq.default.createElement(TX, { color: "error" }, A) : null,
  );
}
```

This renders in the **parent's REPL** (the user sees it in their terminal):

```
PermissionRequest hook returned blocking error
  ↳ This tool call is blocked by org policy section 4.2
```

The user gets immediate feedback that a hook blocked the call AND why. The model gets the `tool_result` envelope with `is_error: true` and the same message — so both the user and the model know.

### Why this dual-path?

- The user wants to see *that a hook fired* — it's a security-relevant event.
- The model just needs the *error text* to decide what to do next.
- The structured attachment carries hook identity (which hook, which event) for audit; the model doesn't need that level of detail.

---

## 4. Channel D — `permission_request` Envelope (SDK Bridge)

When Claude Code is hosting an SDK consumer (e.g. claude.ai mobile or a custom integration), permission prompts don't appear in a local TUI — they're forwarded to the SDK process as a structured `permission_request` message.

```javascript
// ============================================
// buildPermissionRequest - SDK envelope for permission prompts
// Location: cli_inner_pretty.js:239298-239309
// ============================================

// ORIGINAL (for source lookup):
function PD6(H) {
  return {
    type: "permission_request",
    request_id: H.request_id,
    agent_id: H.agent_id,
    tool_name: H.tool_name,
    tool_use_id: H.tool_use_id,
    description: H.description,
    input: H.input,
    permission_suggestions: H.permission_suggestions || [],
  };
}

// READABLE (for understanding):
function buildPermissionRequest({ request_id, agent_id, tool_name, tool_use_id, description, input, permission_suggestions }) {
  return {
    type: "permission_request",
    request_id: request_id,
    agent_id: agent_id,                              // which subagent (or main) is asking
    tool_name: tool_name,                            // e.g. "Bash"
    tool_use_id: tool_use_id,
    description: description,                         // human-readable summary
    input: input,                                     // the raw tool input
    permission_suggestions: permission_suggestions || [],   // suggested allow rules
  };
}

// Mapping: PD6→buildPermissionRequest, H→{request_id, agent_id, tool_name, ...}
// (Note: PD6 uses snake_case field names — it's a wire-protocol envelope, not a JS-only object.)
```

The SDK's host process receives this envelope and is expected to respond with:

```typescript
type PermissionResponse =
  | { decision: "allow", updatedInput?: object }
  | { decision: "deny", message?: string }
  | { decision: "ask" /* shouldn't happen in SDK */ };
```

### Sandbox variant

```javascript
// cli_inner_pretty.js:239339-239362 (ZD6 = buildSandboxPermissionRequest)
function ZD6(H) {
  return {
    type: "sandbox_permission_request",
    /* ... sandbox-specific fields: blocked_path, blocked_operation, etc. ... */
  };
}
```

Sandbox blocks (network, filesystem) get their own envelope because the SDK might handle them differently — e.g., approve filesystem access only for specific paths.

### Relationship to `tD`/`UA5`

The SDK path **layers on top of** the local policy chain:

1. Internal `tD` runs first, computes a verdict.
2. If verdict is `ask`, the agent loop sends `permission_request` to the SDK.
3. SDK responds with `allow` or `deny`.
4. The agent loop wraps the response back through `tD`'s ask-handling logic.

The SDK can't bypass deny rules — those are decided locally at step 1. The SDK only sees prompts that would have shown to a local user.

See [`canUseTool_flow.md`](./canUseTool_flow.md) for the full bridge mechanism.

---

## 5. Channel E — `PermissionDenied` Retry-Hook Reminder

When auto-mode denies a tool (classifier said no), there's an optional `PermissionDenied` hook that can suggest a retry. The hook receives the denial info and can output `{retry: true}` — if so, a system-reminder is appended telling the model it may retry.

```javascript
// ============================================
// permissionDeniedHookRetryReminder - Append retry hint after PermissionDenied hook
// Location: cli_inner_pretty.js:388206-388222
// ============================================

// ORIGINAL (for source lookup):
if (S.decisionReason?.type === "classifier" && S.decisionReason.classifier === "auto-mode") {
  let MH = !1;
  for await (let wH of kL$(H.name, $, L, S.decisionReason.reason ?? "Permission denied", K, R, K.abortController.signal))
    if (wH.retry) MH = !0;
  if (MH)
    X.push({
      message: w8({ content: "The PermissionDenied hook indicated you may retry this tool call.", isMeta: !0 }),
    });
}

// READABLE (for understanding):
// Only auto-mode denials trigger the PermissionDenied hook (other denials are final).
if (verdict.decisionReason?.type === "classifier" && verdict.decisionReason.classifier === "auto-mode") {
  let retryHinted = false;
  for await (const hookResult of runPermissionDeniedHooks(
      toolName, toolUseId, parsedInput, verdict.decisionReason.reason ?? "Permission denied",
      toolUseContext, toolDefinition, abortSignal)) {
    if (hookResult.retry) retryHinted = true;
  }
  if (retryHinted) {
    nextMessages.push({
      message: makeUserMessage({
        content: "The PermissionDenied hook indicated you may retry this tool call.",
        isMeta: true,
      }),
    });
  }
}

// Mapping: kL$→runPermissionDeniedHooks, MH→retryHinted, X→nextMessages, w8→makeUserMessage
```

### Why only auto-mode?

The `PermissionDenied` hook fires only when the *classifier* (not a static rule, not a tool callback) was the reason for denial. Rationale:

- **Static rule denials are policy** — a user wrote `Bash(rm:*)` deny; allowing retry would defeat the policy.
- **Tool callback denials are safety** — Bash's dangerous-rm check denying `rm -rf /`; retry is dangerous.
- **Classifier denials are model-decided** — the model might have phrased the action ambiguously; rewording could legitimately work.

The hook lets sophisticated deployments add a "ask the user to clarify, then maybe retry" step — without weakening the deterministic policy chain.

### The reminder shape

```
The PermissionDenied hook indicated you may retry this tool call.
```

This is a **meta user message** (`isMeta: true`), which means it's content not from the actual user but from runtime infrastructure. The model treats it as ambient guidance.

The original `tool_result` with `is_error: true` is still in the message stream — the retry hint just adds context.

---

## 6. The Tool Side — Per-Tool Denial Messages

Each tool's `checkPermissions` callback constructs its own denial messages. Examples:

### Bash

```
Bash command 'rm -rf /tmp/cache' blocked by classifier 'auto-mode': Possible accidental data loss
```

(from cli_inner_pretty.js:419531-onwards, the Bash `checkPermissions`)

### Edit/Write

```
File path /etc/passwd is outside the allowed working directories (cwd /home/user, additionalDirectories: /tmp)
```

(from `VkH` at cli_inner_pretty.js:518202)

### Skill

The Skill tool's own short `message` (line 353624):

```
Skill execution blocked by permission rules
```

The richer text the prompt UI shows is built by `N5` from the `decisionReason`:

```
Permission rule 'Skill(deploy)' from projectSettings requires approval for this Skill command
```

(short message from `SnH.checkPermissions` at cli_inner_pretty.js:353604; richer string built by `N5` at cli_inner_pretty.js:421519)

### WebFetch

```
WebFetch to evil.com blocked by permission rule 'WebFetch(domain:evil.com)' from userSettings
```

(from `FD.checkPermissions` at cli_inner_pretty.js:377370)

Each tool's message includes the **rule string** and **source tier**, so the user and the model can both trace the denial to its origin. This is critical for debugging "why did this fail?" without needing to inspect logs.

---

## 7. The "Auto Mode Denied" Notification

When auto-mode classifier blocks a tool, the user gets a TUI notification (separate from the model's `tool_result`):

```javascript
// v2.1.88 src/hooks/useCanUseTool.tsx around line 90 (also wired in v2.1.142 bundle)
if (feature("TRANSCRIPT_CLASSIFIER") && result.decisionReason?.type === "classifier"
    && result.decisionReason.classifier === "auto-mode") {
  recordAutoModeDenial({
    toolName: tool.name,
    display: description,
    reason: result.decisionReason.reason ?? "",
    timestamp: Date.now(),
  });
  toolUseContext.addNotification?.({
    key: "auto-mode-denied",
    priority: "immediate",
    jsx: <><Text color="error">{tool.userFacingName(input).toLowerCase()} denied by auto mode</Text><Text dimColor> · /permissions</Text></>,
  });
}
```

What the user sees in the terminal:

```
bash denied by auto mode · /permissions
```

The `/permissions` hint tells the user how to review/edit their auto-mode rules. The notification is **per-denial** (not per-classifier-run), so a single chain of related denials produces multiple notifications — the user gets a feel for what's being blocked.

The model sees only the `tool_result` envelope — the notification is purely UI feedback.

---

## 8. Plan Mode Reminder Floor

Plan mode is a special case: it's not just denial — the model is supposed to *plan* without writing. The reminder system ensures the model knows this:

### How the reminder is constructed

When in plan mode, every assistant turn starts with a system reminder injected:

```
<system-reminder>
You are in plan mode. Do not edit files, run shell commands with side effects, or otherwise change state. When you have a plan, call ExitPlanMode to propose it to the user.
</system-reminder>
```

(Exact text varies; see plan-mode setup at cli_inner_pretty.js around 423919.)

### Why a reminder, not a system-prompt addition?

Same reasoning as auto-mode reminders:
- System prompt is cached; changing it busts cache for every plan-mode session.
- Reminder is in the messages array; mode-on entries and mode-off entries are stream-deltas.
- Re-injection per turn fights attention dilution over long planning conversations.

### Interaction with Edit/Write `checkPermissions`

Even with `Edit(./**)` in allow rules, calling Edit in plan mode triggers:

1. `tD`/`UA5` runs.
2. Edit's `checkPermissions` (VkH) returns `{behavior: "ask", decisionReason: {type: "mode", mode: "plan"}}` — the plan-mode floor.
3. `UA5` step 11 (allow rule check) is skipped because `cbResult.behavior === "ask"` with mode reason.
4. The verdict is `ask` with the plan-mode message.
5. Default mode behavior: prompt user. User sees: "Edit blocked in plan mode. ExitPlanMode first?"

So the reminder tells the model "don't try"; the per-tool check tells the user (and the model) why the attempt failed if they try anyway.

---

## 9. Dontask Mode — Silent Denial

In `dontAsk` mode, an `ask` verdict is converted to `deny`. The model still sees the denial via `tool_result is_error: true`, but **no UI prompt fires**:

```javascript
// cli_inner_pretty.js (within tD - hasPermissionsToUseTool)
if (appState.toolPermissionContext.mode === "dontAsk") {
  return denyDueToDontAskMode(tool.name);  // i64 builds the message
}
```

The message construction (`i64` at cli_inner_pretty.js:421519):

```
Don't-ask mode is active. The user must switch to a different permission mode to allow Claude to use the <toolName> tool. The session was started with --permission-mode dontAsk.
```

### Why a specific message?

If the model just saw "Permission denied" with no context, it might assume something's wrong and retry endlessly. Telling it about dontAsk mode lets it recognize "the user wants me to stop attempting this" and report back to the user instead of looping.

### When dontAsk applies

`dontAsk` is most useful for **SDK-driven scripted runs** where the model should run only the tools the SDK explicitly allowed via `--allowed-tools`. Anything else gets silently denied; the SDK consumer doesn't want interactive prompts.

---

## 10. Permission Decision → Telemetry → Model Flow

The full path from "tool call requested" to "model sees outcome" through the reminder/tool surface:

```
   model emits tool_use ───►  tD/UA5 runs
                                 │
                                 ▼
                       verdict = allow|ask|deny
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
            allow             ask              deny
                │                │                │
                ▼                ▼                │
        tool runs       prompt fires          (skip tool)
                │           │       │            │
                │      user OK?  user No        │
                │         │       │              │
                │         ▼       ▼              │
                │    tool runs  deny             │
                │                  │             │
                └──────────────────┴─────────────┘
                                 │
                                 ▼
                       PreToolUse hook (if registered)
                                 │
                       ┌─────────┴──────────┐
                       ▼                    ▼
                       allow              deny/error
                       │                    │
                       ▼                    ▼
                  tool runs           hook_blocking_error attachment
                       │                    + tool_result is_error
                       ▼                    │
            tool_result (success)           │
                       │                    │
                       ▼                    ▼
                  PostToolUse hook    PermissionDenied hook
                       │                    │
                       │                    ▼
                       │                    retry hint reminder (if hook says retry:true)
                       │                    │
                       └────────┬───────────┘
                                ▼
                       model's next turn sees:
                       - tool_result is_error (if deny)
                       - tool_result success (if allow + tool ran)
                       - hook_blocking_error attachment (if hook denied)
                       - retry hint meta-message (if PermissionDenied hook flagged)
                       - <system-reminder> for mode-state (plan mode, etc.)
                       - notification in TUI (if auto-mode denied)
```

The model has **one channel** to learn about denials: the `tool_result` envelope. But the user has **multiple channels**: REPL notifications, hook_blocking_error attachments, /permissions output. The split is intentional — the model needs to know "the tool failed, here's why" in a uniform format; the user needs richer feedback for debugging and policy decisions.

---

## 11. Cross-Validation with v2.1.88

The `tool_result is_error: true` denial pattern is identical in v2.1.88 (`src/query.ts` and `src/hooks/useCanUseTool.tsx`). The `is_error` flag is part of Anthropic's tool-use protocol and predates Claude Code.

The `hook_blocking_error` attachment type was present in v2.1.88 (`src/utils/attachments.ts` defines it). The renderer also predates v2.1.142.

The `permission_request` SDK envelope (`PD6`) is in v2.1.88 (`src/utils/sdkEventQueue.ts` and related). The shape matches.

The `PermissionDenied` retry hook chain is **post-v2.1.88** — added alongside the auto-mode classifier rollout (~v2.1.100+). The hook event name and the retry-reminder pattern are v2.1.142.

The auto-mode denial notification (`recordAutoModeDenial`) is present in v2.1.88 (`src/utils/autoModeDenials.ts`). The notification format is the same: `${tool} denied by auto mode · /permissions`.

The dontAsk mode message is present in v2.1.88 (`src/utils/permissions/permissions.ts:i64` equivalent). The text is identical (or close to it).

---

## 12. Why This Architecture?

Three design rationales:

### 12.1 Model uniformity, user richness

The model's view of denial is **just** `tool_result is_error: true` with a text message. No structured fields, no decisionReason metadata, no rule traces. This is intentional:

- Models trained on Anthropic's tool-use protocol expect `tool_result` as the response envelope. Adding new metadata would require retraining.
- A model trying to reason about "which rule blocked me?" would have to parse the message string. Better to keep the message human-readable and let the model decide based on that.
- Different rule sources (classifier vs static vs hook) produce different message *prefixes* — the model can pattern-match.

The user, by contrast, gets:
- The `tool_result` message
- TUI notifications (`recordAutoModeDenial`)
- Hook attachments (`hook_blocking_error`)
- /permissions output for review
- Color-coded denial reasons in the REPL

This asymmetry serves both audiences correctly.

### 12.2 Reminders as ambient state, results as event

A `tool_result` is an *event* — it's specific to a tool call. A `<system-reminder>` is *state* — it describes the runtime condition that affects all calls.

Plan-mode is state; the reminder re-injects each turn. A specific Bash denial is an event; the tool_result fires once and stays in the transcript.

Conflating them (e.g., putting "you're in plan mode" inside the tool_result) would tie state to events and confuse the model when state changes.

### 12.3 The PermissionDenied retry hook is opt-in escalation

Most denials should be final — a user wrote a deny rule, the system honors it. But auto-mode denials are an **algorithmic decision**, not a user policy. The `PermissionDenied` hook lets sophisticated deployments add a "did the model phrase this ambiguously? could a clarification fix it?" layer.

The opt-in part is critical: by default, no retry hint fires. A deployment that wants the retry behavior must register the hook. This avoids defaulting to a behavior that might mask real policy issues.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md)
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md)

Key functions in this document:
- `buildPermissionMessage` (`N5`) — Format denial message from decisionReason (cli_inner_pretty.js:421519-421558)
- `buildPermissionRequest` (`PD6`) — SDK permission_request envelope (cli_inner_pretty.js:239298-239309)
- `buildSandboxPermissionRequest` (`ZD6`) — sandbox variant (cli_inner_pretty.js:239339-239362)
- `runPermissionDeniedHooks` (`kL$`) — Async-generator retry-hook chain; defined at cli_inner_pretty.js:520217; called from cli_inner_pretty.js:388207
- `recordAutoModeDenial` — UI notification + audit log (v2.1.88: src/utils/autoModeDenials.ts)
- `createAttachmentMessage` (`fK`) — Attachment builder (used at 520779 for hook_blocking_error)
- `formatRule` (`wz`) — Render rule object as string (cli_inner_pretty.js:50119)
- `formatSource` (`arH`) — Render source tier as string (cli_inner_pretty.js:421511)
- `denyDueToDontAskMode` (`i64`) — Build dontAsk denial message
- `applyHookPermissionDecision` — Hook output → permissionBehavior (cli_inner_pretty.js around 520649)
- `recheckPermission` — Re-evaluate open prompts after mode change (called from `eJH` permission-update callback at cli_inner_pretty.js:580720)
- `makeUserMessage` (`w8`) — User message constructor (used throughout reminder paths)
- Attachment types: `hook_blocking_error`, `hook_non_blocking_error`, `permission_request`, `sandbox_permission_request`
- Reminder texts: "Don't-ask mode is active...", "The PermissionDenied hook indicated you may retry...", "Execution stopped by PreToolUse hook..."
