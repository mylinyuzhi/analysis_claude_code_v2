# Tool UI Rendering — Ink Components & Message Pipeline

> Every tool call manifests in the terminal UI through five render hooks (`renderToolUseMessage`, `renderToolResultMessage`, `renderToolUseProgressMessage`, `renderToolUseQueuedMessage`, `renderToolUseTag`) plus two rejection/error counterparts (`renderToolUseRejectedMessage`, `renderToolUseErrorMessage`). This document explains how Ink consumes these hooks, when each fires, and how the dispatcher's `set_in_progress_tool_use_ids` events drive spinner/loader state.

> Cross-validation: the obfuscated bundle (`cli_inner_pretty.js`) keeps the same render-hook names as the v2.1.88 TypeScript reference (`/lyz/codespace/3rd/claude-code/src/components/messages/`). Component file paths in the TS source map 1:1 to the rendering functions called from the bundle.

## High-level pipeline

```
                    ┌──────────────────────────────────┐
                    │ Streaming model output            │
                    │ → ToolUseBlock arrives            │
                    └──────────────┬───────────────────┘
                                   │
                                   ▼
              ┌──────────────────────────────────────────┐
              │ Dispatcher: set_in_progress_tool_use_ids  │
              │   op: { action:"add", ids:[$] }           │
              └──────────────┬───────────────────────────┘
                             │ (UI subscribes to this)
        ┌────────────────────┼────────────────────────────────┐
        │                    │                                 │
        ▼                    ▼                                 ▼
┌──────────────────┐ ┌──────────────────┐         ┌────────────────────┐
│ AssistantToolUse-│ │ AssistantText-   │         │ ToolUseLoader      │
│ Message          │ │ Message (any     │         │ (spinner, error    │
│  (tool chrome,   │ │  prose around    │         │  state, animation) │
│  loader, header) │ │  the call)       │         │                    │
└────────┬─────────┘ └──────────────────┘         └────────────────────┘
         │
         │ Calls render hooks on the tool object:
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│ tool.renderToolUseMessage(input, {theme, verbose, commands})         │
│ tool.renderToolUseProgressMessage(progressEvents, {tools, verbose…}) │
│ tool.renderToolUseQueuedMessage?.()                                   │
│ tool.renderToolUseTag?.(input)                                        │
│ tool.userFacingName(input)  // the bold tool label                    │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
              ┌──────────────────────────────────────────┐
              │ Tool finishes — dispatcher yields tool-   │
              │ result Message + set_in_progress remove   │
              └──────────────┬───────────────────────────┘
                             │
              ┌──────────────┴───────────────┐
              ▼                              ▼
┌────────────────────────┐    ┌───────────────────────────────┐
│ UserToolSuccessMessage │    │ UserToolErrorMessage          │
│   .renderToolResult-   │    │   .renderToolUseErrorMessage  │
│   Message(data, …)     │    │   OR FallbackToolUseError-    │
│                        │    │   Message                     │
└────────────────────────┘    └───────────────────────────────┘
                                       │
                                       ▼
                              (If user rejected:)
                              ┌───────────────────────────────┐
                              │ UserToolRejectMessage         │
                              │   .renderToolUseRejected-     │
                              │   Message(input, …)            │
                              │   OR FallbackToolUseRejected- │
                              │   Message                     │
                              └───────────────────────────────┘
```

The three end-state components (`UserToolSuccessMessage`, `UserToolErrorMessage`, `UserToolRejectMessage`) are dispatched by the parent transcript renderer based on the tool_result's shape:
- `is_error: false` → success path
- `is_error: true` & content starts with `INTERRUPT_MESSAGE_FOR_TOOL_USE` → reject path
- `is_error: true` & content starts with `PLAN_REJECTION_PREFIX` → plan-specific reject path
- `is_error: true` & content starts with `REJECT_MESSAGE_WITH_REASON_PREFIX` → user-with-reason reject path
- `is_error: true` otherwise → error path

## The five render hooks on the Tool interface

The Tool TypeScript contract (cross-validated at `/lyz/codespace/3rd/claude-code/src/Tool.ts`) defines:

| Hook | Required | Receives | Returns | When invoked |
|------|---|---|---|---|
| `renderToolUseMessage` | Required | `(input, {theme, verbose, commands})` | `string \| ReactNode` | While the call is in flight or queued. Used as the "Reading src/foo.ts" descriptor next to the bold tool name. |
| `renderToolResultMessage` | Optional (default: render nothing) | `(data, progressMessages, {style, theme, tools, verbose, isTranscriptMode, isBriefOnly, input})` | `ReactNode \| null` | After the call succeeds and the user-message envelope hits the transcript. |
| `renderToolUseProgressMessage` | Optional | `(progressEvents[], {tools, verbose, terminalSize, inProgressToolCallCount, isTranscriptMode})` | `ReactNode \| null` | During the call as progress events stream in. |
| `renderToolUseQueuedMessage` | Optional | `()` | `ReactNode \| null` | When the call is waiting for a non-concurrent predecessor to finish. |
| `renderToolUseRejectedMessage` | Optional (default: `<FallbackToolUseRejectedMessage>`) | `(input, {columns, messages, tools, verbose, progressMessagesForMessage, style, theme, isTranscriptMode})` | `ReactNode` | When the user denied the permission dialog. |
| `renderToolUseErrorMessage` | Optional (default: `<FallbackToolUseErrorMessage>`) | `(errorContent, {progressMessagesForMessage, tools, verbose, isTranscriptMode})` | `ReactNode` | When the call threw (not when permission denied). |
| `renderToolUseTag` | Optional | `(input)` | `ReactNode \| null` | Adjacent to the tool name in the chrome bar — small annotations like a timeout label, model id, or worktree path. |

**Why so many hooks (and not just `renderToolResult`):** Each render moment has different inputs and different surface area. While the call is in flight, the input is fully known but the output is not — `renderToolUseMessage` describes "what we're doing". When it finishes, the output is known but the input may be too verbose to redraw — `renderToolResultMessage` describes "what we did". When it's queued behind a sibling, the user wants to know *why nothing's happening* — `renderToolUseQueuedMessage` says "waiting for Bash". The split mirrors how humans want progress information.

**Key insight:** Tools that return `''` (empty string) from `userFacingName(undefined)` opt out of the chrome bar entirely. `SyntheticOutput` does this — the tool delivers content that becomes assistant text directly, with no "Tool name (input)" header. The check is in `AssistantToolUseMessage`:

```javascript
// Location: src/components/messages/AssistantToolUseMessage.tsx:158-160 (cross-validated)
if (userFacingToolName === "") {
  return null;
}
```

Similarly `UserToolSuccessMessage` (`src/components/messages/UserToolResultMessage/UserToolSuccessMessage.tsx:84`) checks `rendersAsAssistantText = tool.userFacingName(undefined) === ""` and removes the width constraint so markdown tables don't get re-wrapped.

## How the bundle wires the hooks into the React tree

### Top-level dispatch — AssistantToolUseMessage

Cross-validated source: `src/components/messages/AssistantToolUseMessage.tsx:35-294`

This component:
1. Looks up the tool by name (`findToolByName`)
2. Parses input via `tool.inputSchema.safeParse`
3. Computes `userFacingToolName = tool.userFacingName(parsedInput.data)` (the bold-text header)
4. Computes `isResolved = lookups.resolvedToolUseIDs.has(param.id)` (have we received its result yet?)
5. Computes `isQueued = !inProgressToolUseIDs.has(param.id) && !isResolved` (not yet started)
6. Computes `isWaitingForPermission = pendingWorkerRequest?.toolUseId === param.id` (paused in permission dialog)
7. Renders one of:
   - The transparent-wrapper branch (REPL — delegates to inner tool calls)
   - The normal branch: chrome bar + status indicators + progress UI

The chrome bar is built from:
- A loader/circle (`ToolUseLoader` or `BLACK_CIRCLE` if queued)
- The bold `userFacingToolName`
- The rendered `renderToolUseMessage(input)` in parentheses
- The optional `renderToolUseTag(input)` annotation

```javascript
// Cross-validated: src/components/messages/AssistantToolUseMessage.tsx:227-244
// Chrome layout (simplified)
<Box flexDirection="row" flexWrap="nowrap" minWidth={width}>
  {shouldShowDot && (isQueued ? <BlackCircle /> : <ToolUseLoader ... />)}
  <Box flexShrink={0}>
    <Text bold backgroundColor={userFacingToolNameBackgroundColor} color={inverseTextIfBg}>
      {userFacingToolName}
    </Text>
  </Box>
  {renderedToolUseMessage !== "" && <Box flexWrap="nowrap"><Text>({renderedToolUseMessage})</Text></Box>}
  {tool.renderToolUseTag && tool.renderToolUseTag(input)}
</Box>
// Below the chrome, conditionally:
{!isResolved && !isQueued && (
  isClassifierChecking ? "Auto classifier checking…"
  : isWaitingForPermission ? "Waiting for permission…"
  : renderToolUseProgressMessage(tool, tools, lookups, id, progressMessages, opts, terminalSize)
)}
{!isResolved && isQueued && renderToolUseQueuedMessage(tool)}
```

**Why three distinct sub-statuses below the chrome:** Each is a different reason the user is waiting:
- *Classifier checking* — the permission classifier is still deciding (auto mode)
- *Waiting for permission* — the dialog is visible and the user hasn't answered
- *Streaming progress* — the call is running and emitting progress events

The user can act on each differently. Classifier-checking is unavoidable; waiting-for-permission means *they* have to act; progress means the tool itself is busy.

### Helper: renderToolUseMessage (bundle vs. TS)

```javascript
// ============================================
// renderToolUseMessage helper — wraps tool.renderToolUseMessage with safe parsing
// Location: cli_inner_pretty.js:344781-344787
// Cross-validated: src/components/messages/AssistantToolUseMessage.tsx:304-327
// ============================================

// ORIGINAL (for source lookup):
function kQ_(H, $, { theme: q, verbose: K, commands: _ }) {
  try {
    return H.renderToolUseMessage($, { theme: q, verbose: K, commands: _ });
  } catch (A) {
    return (EH(Error(`Error rendering tool use message for ${H.name}: ${A}`)), "");
  }
}

// READABLE (for understanding):
function renderToolUseMessageSafe(tool, input, { theme, verbose, commands }) {
  try {
    return tool.renderToolUseMessage(input, { theme, verbose, commands });
  } catch (error) {
    reportError(new Error(`Error rendering tool use message for ${tool.name}: ${error}`));
    return "";                                              // Fall back to empty string — no crash propagates to the transcript
  }
}

// Mapping: kQ_→renderToolUseMessageSafe, H→tool, $→input, q→theme, K→verbose, _→commands, EH→reportError
```

**Why try/catch with empty-string fallback:** Render functions sometimes throw on resumed transcripts (input shape changed across versions, JSON.parse delivered a partial object). Throwing in a render path would unmount the entire transcript subtree. Catching at the helper level isolates the failure to one tool call's chrome.

### Progress rendering — renderToolUseProgressMessage

```javascript
// ============================================
// renderToolUseProgressMessage — wraps tool.renderToolUseProgressMessage + injects hook progress
// Location: cli_inner_pretty.js:344788-344818
// Cross-validated: src/components/messages/AssistantToolUseMessage.tsx:328-360+
// ============================================

// ORIGINAL (for source lookup):
function EC7(H, $, q, K, _, { verbose: A, inProgressToolCallCount: z, isTranscriptMode: Y }, f) {
  let O = _.filter((M) => M.data.type !== "hook_progress");
  try {
    let M = H.renderToolUseProgressMessage?.(O, { tools: $, verbose: A, terminalSize: f, inProgressToolCallCount: z ?? 1, isTranscriptMode: Y }) ?? null;
    return oP.default.createElement(oP.default.Fragment, null,
      oP.default.createElement(KkH, null,
        oP.default.createElement(xz8, { hookEvent: "PreToolUse", lookups: q, toolUseID: K, verbose: A, isTranscriptMode: Y })),
      M);
  } catch (M) {
    return (EH(Error(`Error rendering tool use progress message for ${H.name}: ${M}`)), null);
  }
}

// READABLE (for understanding):
function renderToolUseProgressMessage(tool, tools, lookups, toolUseID, progressMessages, { verbose, inProgressToolCallCount, isTranscriptMode }, terminalSize) {
  // Split tool-specific progress from hook-specific progress.
  // Hook progress is rendered separately (so PreToolUse hook progress shows alongside the tool's own progress).
  const toolProgressMessages = progressMessages.filter((m) => m.data.type !== "hook_progress");
  try {
    const toolNode = tool.renderToolUseProgressMessage?.(toolProgressMessages, {
      tools,
      verbose,
      terminalSize,
      inProgressToolCallCount: inProgressToolCallCount ?? 1,
      isTranscriptMode,
    }) ?? null;
    return (
      <>
        <MessageResponse height={1}>
          <HookProgressMessage hookEvent="PreToolUse" lookups={lookups} toolUseID={toolUseID} verbose={verbose} isTranscriptMode={isTranscriptMode} />
        </MessageResponse>
        {toolNode}
      </>
    );
  } catch (error) {
    reportError(new Error(`Error rendering tool use progress message for ${tool.name}: ${error}`));
    return null;
  }
}

// Mapping: EC7→renderToolUseProgressMessage, H→tool, $→tools, q→lookups, K→toolUseID, _→progressMessages,
//          A→verbose, z→inProgressToolCallCount, Y→isTranscriptMode, f→terminalSize, M→toolNode,
//          KkH→MessageResponse, xz8→HookProgressMessage, oP→React
```

**Why split tool progress from hook progress:** Both can stream simultaneously. A Bash call may report "running command (5s)" via its own progress events, while a PreToolUse hook might report "classifier deciding…". The UI shows them stacked: hook progress *above* tool progress. This makes the two sources distinguishable, and lets the user see that *something* is happening even if the tool itself is silent (e.g., during the permission-classifier wait).

**Key insight:** `progressMessagesForMessage` is the *cumulative* list of all progress events ever emitted for this tool call — not a sliding window. The tool's render function may choose to show only the latest N (Bash shows the last 200 lines of stdout; WebSearch shows the last search status). The framework just passes the whole list.

### Tool tags — renderToolUseTag

Tools can append a small annotation next to the chrome:

```javascript
// Example: Bash tool — shows the configured timeout
renderToolUseTag(input) {
  if (input.timeout) return <Text dimColor>(timeout: {input.timeout}s)</Text>;
  return null;
}
```

Used by:
- **Bash** — timeout label
- **WebFetch** / **WebSearch** — sometimes the host
- **Agent** — agent type
- **EnterWorktree** — worktree name

**Why a separate hook rather than embedding in `renderToolUseMessage`:** Tags are visually distinct (often dim/right-aligned) and may be omitted in compact modes. Separating them lets the chrome layout decide whether to include them based on terminal width or verbosity setting.

## Tool-result render — UserToolSuccessMessage

After the tool finishes and the user-message envelope hits the transcript, the success path renders:

```javascript
// Cross-validated: src/components/messages/UserToolResultMessage/UserToolSuccessMessage.tsx:25-103

export function UserToolSuccessMessage({
  message, lookups, toolUseID, progressMessagesForMessage, style, tool, tools, verbose, width, isTranscriptMode
}) {
  // 1. Validate the toolUseResult against the tool's outputSchema (if any).
  //    Resumed transcripts may have stale shapes — this prevents render crashes.
  const parsedOutput = tool.outputSchema?.safeParse(message.toolUseResult);
  if (parsedOutput && !parsedOutput.success) return null;
  const toolResult = parsedOutput?.data ?? message.toolUseResult;

  // 2. Call the tool's renderer
  const renderedMessage = tool.renderToolResultMessage?.(toolResult, filterToolProgressMessages(progressMessagesForMessage), {
    style, theme, tools, verbose, isTranscriptMode, isBriefOnly,
    input: lookups.toolUseByToolUseID.get(toolUseID)?.input    // The original input the tool was called with
  }) ?? null;
  if (renderedMessage === null) return null;

  // 3. Layout: respect the tool's "render as assistant text" opt-out
  const rendersAsAssistantText = tool.userFacingName(undefined) === "";
  return (
    <Box flexDirection="column">
      <Box flexDirection="column" width={rendersAsAssistantText ? undefined : width}>
        {renderedMessage}
        {/* feature-flagged: classifier approval indicator, auto-mode classifier indicator */}
      </Box>
      <SentryErrorBoundary>
        <HookProgressMessage hookEvent="PostToolUse" lookups={lookups} toolUseID={toolUseID} verbose={verbose} isTranscriptMode={isTranscriptMode} />
      </SentryErrorBoundary>
    </Box>
  );
}
```

**Why `outputSchema.safeParse` before render:** The bundle deserialises `toolUseResult` via raw `JSON.parse` (no validation) when resuming transcripts (per the TS comment at `UserToolSuccessMessage.tsx:56-59`, this fixed `anthropics/claude-code#39817`). A partial or corrupt result that's missing a required field would crash on first property access inside `renderToolResultMessage`. The schema check is the cheap-and-correct guard.

**Key insight:** `lookups.toolUseByToolUseID.get(toolUseID)?.input` lets the result renderer see the original input. Many tools need this — Edit needs the file_path to render the diff label, Bash needs the command for the result heading. Storing it on a per-id lookup map avoids parent-prop drilling.

### renderToolResultMessage examples

- **Read** — returns nothing in transcript mode; in verbose mode, a brief "Read N lines from path" summary.
- **Edit** — returns a syntax-highlighted diff with `+`/`-` gutters.
- **Bash** — returns a code block of stdout with stderr below.
- **TodoWrite** — returns nothing (todos rendered in a separate side panel — see `CtrlOToExpand.tsx`).
- **WebSearch** — returns a numbered list of result titles with URLs.
- **Agent** — returns a tree of nested tool uses run by the subagent.

The pattern: tools whose output the human can read directly return rich nodes; tools whose output is for the model only (TodoWrite, ScheduleWakeup, PushNotification) return `null` or empty fragments.

## Tool-result render — UserToolErrorMessage

When `param.is_error === true` and the content doesn't match a special prefix, the error path renders:

```javascript
// Cross-validated: src/components/messages/UserToolResultMessage/UserToolErrorMessage.tsx:23-102

export function UserToolErrorMessage({ progressMessagesForMessage, tool, tools, param, verbose, isTranscriptMode }) {
  // 1. Special-case: user interrupted
  if (typeof param.content === "string" && param.content.includes(INTERRUPT_MESSAGE_FOR_TOOL_USE)) {
    return <MessageResponse height={1}><InterruptedByUser /></MessageResponse>;
  }

  // 2. Special-case: plan-mode rejection (ExitPlanMode user rejected the plan)
  if (typeof param.content === "string" && param.content.startsWith(PLAN_REJECTION_PREFIX)) {
    const planContent = param.content.substring(PLAN_REJECTION_PREFIX.length);
    return <RejectedPlanMessage plan={planContent} />;
  }

  // 3. Special-case: user gave a rejection reason
  if (typeof param.content === "string" && param.content.startsWith(REJECT_MESSAGE_WITH_REASON_PREFIX)) {
    return <RejectedToolUseMessage />;
  }

  // 4. Special-case: auto-mode classifier denial (transcript classifier feature)
  if (feature("TRANSCRIPT_CLASSIFIER") && typeof param.content === "string" && isClassifierDenial(param.content)) {
    return <MessageResponse height={1}><Text dimColor>Denied by auto mode classifier · /feedback if incorrect</Text></MessageResponse>;
  }

  // 5. Default: tool's renderToolUseErrorMessage, or generic fallback
  return tool?.renderToolUseErrorMessage?.(param.content, {
    progressMessagesForMessage: filterToolProgressMessages(progressMessagesForMessage),
    tools, verbose, isTranscriptMode
  }) ?? <FallbackToolUseErrorMessage result={param.content} verbose={verbose} />;
}
```

**Why four special-cases before the tool-specific render:** Each represents a *system-level* error that should render uniformly across tools:
- Interruption is independent of which tool was running
- Plan-rejection shows the rejected plan content (not a tool-specific message)
- User-with-reason renders a generic "User rejected" line
- Classifier-denial is a security-policy outcome, not a tool failure

The remaining (truly tool-specific) errors flow to the tool's own renderer.

### renderToolUseErrorMessage examples

- **Read** — "File not found. Did you mean `<closest match>`?" with suggestions
- **Edit** — shows the failing match attempt and surrounding context lines
- **Bash** — shows the command's exit code, stderr, and any sandbox annotations
- **WebFetch** — shows the host, status code, and a snippet of the response body

Tools without custom error rendering fall back to `<FallbackToolUseErrorMessage result={content} verbose={verbose} />`, which prints the raw error text.

## Tool-result render — UserToolRejectMessage

When the user denies the permission dialog (and the tool_use_id is in the rejected set), the reject path renders:

```javascript
// Cross-validated: src/components/messages/UserToolResultMessage/UserToolRejectMessage.tsx:21-94

export function UserToolRejectMessage({ input, progressMessagesForMessage, style, tool, tools, verbose, isTranscriptMode }) {
  const { columns } = useTerminalSize();
  const [theme] = useTheme();
  // 1. No tool found OR tool doesn't implement renderToolUseRejectedMessage → fallback
  if (!tool || !tool.renderToolUseRejectedMessage) return <FallbackToolUseRejectedMessage />;
  // 2. Try to parse input — if Zod fails, fallback
  const parsedInput = tool.inputSchema.safeParse(input);
  if (!parsedInput.success) return <FallbackToolUseRejectedMessage />;
  // 3. Call the tool's renderer
  return tool.renderToolUseRejectedMessage(parsedInput.data, {
    columns, messages: [], tools, verbose,
    progressMessagesForMessage: filterToolProgressMessages(progressMessagesForMessage),
    style, theme, isTranscriptMode,
  }) ?? <FallbackToolUseRejectedMessage />;
}
```

`<FallbackToolUseRejectedMessage>` is just `<MessageResponse height={1}><InterruptedByUser /></MessageResponse>` (`src/components/FallbackToolUseRejectedMessage.tsx:5-15`).

### renderToolUseRejectedMessage examples

- **Edit / Write** — shows the rejected diff so the user remembers what they prevented
- **Bash** — shows the rejected command + any sandbox-related annotations
- **Agent** — shows the rejected agent invocation (agent type + prompt summary)
- **AskUserQuestion** — shows the questions and options that were never asked
- **EnterPlanMode** — fixed text "Plan-mode entry rejected"
- **Most others** — `FallbackToolUseRejectedMessage` is fine

**Why some tools need custom rejection UI:** The user explicitly *prevented* this action, so the UI should show what they prevented. For dangerous tools (Edit/Write/Bash), this is the most informative moment — the rejected diff/command is exactly what the user wanted to inspect. Generic "User rejected" doesn't help them remember the context two messages later.

## Spinner / loader state — `set_in_progress_tool_use_ids` events

The dispatcher emits two events around each call:

```javascript
// Add — just before tool.call:
M({ type: "set_in_progress_tool_use_ids", op: { action: "add", ids: [$] } });

// Remove — after results have been yielded by getCompletedResults:
yield { type: "set_in_progress_tool_use_ids", op: { action: "remove", ids: [tool.id] } };
```

The UI maintains an `inProgressToolUseIDs: Set<string>` in app state, updated in response to these events. `AssistantToolUseMessage` uses this set to compute three Booleans per call:

```javascript
const isResolved   = lookups.resolvedToolUseIDs.has(param.id);          // The tool_result has arrived
const isQueued     = !inProgressToolUseIDs.has(param.id) && !isResolved;// Not started yet
const isWaitingForPermission = pendingWorkerRequest?.toolUseId === param.id;
```

These three values drive the chrome's loader/circle indicator (`ToolUseLoader` vs. `BLACK_CIRCLE`) and the sub-status row beneath the chrome.

```javascript
// Cross-validated layout (AssistantToolUseMessage.tsx:186-244):
shouldShowDot && (
  isQueued
    ? <Box minWidth={2}><Text dimColor>{BLACK_CIRCLE}</Text></Box>           // Dim filled circle for queued
    : <ToolUseLoader shouldAnimate={shouldAnimate} isUnresolved={!isResolved} isError={lookups.erroredToolUseIDs.has(param.id)} />  // Animated spinner for in-progress
)
```

**Why three Booleans:** Each maps to a different rendered visual state. A four-state enum would be cleaner but the bundle's React Compiler memoisation prefers Booleans for cache key efficiency (`$[N] !== value` checks). The cost of an extra computed Boolean is much lower than the cost of an enum string allocation per render.

## isTranscriptMode — verbose vs. condensed renders

The `isTranscriptMode` prop is threaded through every render hook. It tells tools whether to render their *full* output (verbose history view, Ctrl-O expanded) or their *condensed* default (collapsed chrome, summary text).

Tools use it to choose between two render paths:

```javascript
// Example: Read tool's render
renderToolResultMessage(data, _progress, { isTranscriptMode, verbose }) {
  if (isTranscriptMode || verbose) {
    // Show the full file contents with line numbers
    return <FullFileBlock content={data.file.content} />;
  }
  // Default: just a brief one-line summary
  return <Text dimColor>Read {data.file.totalLines} lines from {data.file.path}</Text>;
}
```

**Why per-call rather than global mode:** A user may be in normal-density mode but expanded one specific tool result via Ctrl-O. The flag is passed top-down so each component knows whether *it* is the expanded one.

## Special components for grouped renders

### renderGroupedToolUse — parallel batch UI

Tools that frequently run in parallel batches (Read, Glob, Grep) can implement `renderGroupedToolUse(toolUses, opts)` to render N parallel calls as one consolidated block instead of N stacked blocks.

```javascript
// Example: GroupedToolUseContent.tsx uses this
renderGroupedToolUse(toolUses, { tools, verbose, theme, isTranscriptMode }) {
  // Returns a single block like:
  //   Read · 5 files
  //     - src/foo.ts (143 lines)
  //     - src/bar.ts (89 lines)
  //     - …
  return <CollapsedReadSearchContent toolUses={toolUses} ... />;
}
```

The parent transcript decides when to group: contiguous tool_use blocks for the *same tool name* with `isSearchOrReadCommand(input) === {isRead: true, …}` get grouped if there are 3 or more.

**Why group:** A model that emits `[Read(a), Read(b), Read(c), Read(d), Read(e)]` in one batch shouldn't render five identical chrome bars — the visual noise drowns out the actual purpose. Grouping compresses them to a single header with a sub-list of files.

### Transparent wrappers — REPL

REPL's tool has `isTransparentWrapper(): true`. The chrome renders the inner tool calls (made *inside* the REPL VM) instead of REPL itself. The branch in `AssistantToolUseMessage.tsx:123-156`:

```javascript
if (isTransparentWrapper) {
  if (isQueued || isResolved) return null;
  return <Box flexDirection="column" width="100%" backgroundColor={bg}>
    {renderToolUseProgressMessage(tool, tools, lookups, param.id, progressMessages, opts, terminalSize)}
  </Box>;
}
```

**Why no chrome for transparent wrappers:** REPL is a meta-tool — the user wants to see what the *inner* calls did, not "REPL ran for 3s". The progress message (which streams inner tool calls' chrome blocks) replaces the outer chrome entirely.

## Side-panel renders — non-transcript UI

Some tools deliberately render *nothing* in the transcript but instead update a side panel:

- **TodoWrite** — updates the persistent todo panel (Ctrl-O to expand)
- **TaskCreate / TaskUpdate / TaskList** — updates the background-task panel
- **AskUserQuestion** — pops a dedicated dialog above the prompt input

These tools' `renderToolResultMessage` returns `null` and they use a separate hook into app state to update the panel content. The decoupling lets the panel persist across many message exchanges without re-rendering the transcript message.

**Key insight:** Returning `null` from `renderToolResultMessage` is the supported way to opt out of the transcript. The dispatcher still emits the tool_result to the model; the UI just doesn't draw it. The side panel reads the same underlying state.

## Cross-validation: bundle ↔ TS source

| Component | Obfuscated location | TS source |
|-----------|---|---|
| `renderToolUseMessage` helper (`kQ_`) | `cli_inner_pretty.js:344781-344787` | `AssistantToolUseMessage.tsx:304-327` |
| `renderToolUseProgressMessage` helper (`EC7`) | `cli_inner_pretty.js:344788-344818` | `AssistantToolUseMessage.tsx:328-360+` |
| `renderToolUseQueuedMessage` helper (`NQ_`) | `cli_inner_pretty.js:344819-344825` | `AssistantToolUseMessage.tsx:360-365+` |
| Main `AssistantToolUseMessage` | scattered around `cli_inner_pretty.js:344746-345000` | `AssistantToolUseMessage.tsx:35-294` |
| `UserToolSuccessMessage` | scattered around `cli_inner_pretty.js:340000-340500` (Tools section) | `UserToolResultMessage/UserToolSuccessMessage.tsx:25-103` |
| `UserToolErrorMessage` | similar offset | `UserToolErrorMessage.tsx:23-102` |
| `UserToolRejectMessage` | similar offset | `UserToolRejectMessage.tsx:21-94` |
| `FallbackToolUseRejectedMessage` | helper sub-render | `FallbackToolUseRejectedMessage.tsx:5-15` |

Render-flow logic is identical between versions. Differences:
- 2.1.142 adds `userFacingNameBackgroundColor?` support — tools can highlight their chrome name (used by `SendUserFile` to show "active proactive output")
- 2.1.142 expands `renderToolUseQueuedMessage` to also handle background-agent siblings (previously only direct tools)
- 2.1.142 routes `renderToolUseTag` through the chrome's flex layout so wider terminals can show longer tags

## Performance: React Compiler memoisation

Every render hook is memoised by the React Compiler (`_c(N)`) at component level. The cache array stores previous prop values and previously-computed JSX nodes; if all props are reference-equal across renders, the cached JSX is returned without re-execution.

This matters because:
- The transcript may have hundreds of past tool calls
- Scrolling, resizing, or theme changes trigger re-renders
- Without memoisation, each scroll repaint would re-execute every `renderToolResultMessage` for every visible tool call

The cache keys are intentionally per-prop (`$[0] !== param.input`, `$[1] !== param.name`, …) rather than a single object key, so a single prop change doesn't invalidate unrelated subtrees.

**Why per-prop rather than per-object:** Many props are *derived* from app state. If `lookups.resolvedToolUseIDs` updates (a new tool resolved), every tool's lookup-derived booleans change — but only one tool actually changed status. Per-prop keying lets unaffected subtrees skip rendering even when the parent's `lookups` prop reference changes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (UI components)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI / Ink integrations
> - v2.1.142 additions: [symbol_additions_v2_1_142_tools_arch.md](../00_overview/symbol_additions_v2_1_142_tools_arch.md)

Key functions in this document:
- `renderToolUseMessageSafe` (obfuscated: `kQ_`) - Try/catch wrapper around `tool.renderToolUseMessage`
- `renderToolUseProgressMessage` (obfuscated: `EC7`) - Wrapper that splits hook progress from tool progress
- `renderToolUseQueuedMessage` (obfuscated: `NQ_`) - Try/catch wrapper around `tool.renderToolUseQueuedMessage`
- `AssistantToolUseMessage` - Top-level chrome renderer for in-flight/queued tool calls
- `UserToolSuccessMessage` - Post-success tool-result renderer
- `UserToolErrorMessage` - Post-error tool-result renderer (with special-case prefixes)
- `UserToolRejectMessage` - Post-rejection renderer (user denied permission)
- `FallbackToolUseRejectedMessage` - "Interrupted by user" stock fallback
- `FallbackToolUseErrorMessage` - Stock error renderer for tools without custom UI
- `INTERRUPT_MESSAGE_FOR_TOOL_USE` - Sentinel string for "user interrupted" rendering branch
- `PLAN_REJECTION_PREFIX` / `REJECT_MESSAGE_WITH_REASON_PREFIX` - Sentinel prefixes for plan-mode / with-reason rejections
- `BLACK_CIRCLE` (`figures/figures.ts`) - Queued-state circle glyph
- `ToolUseLoader` - Animated in-progress loader component
