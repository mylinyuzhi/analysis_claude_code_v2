# REPL Tool — v2.1.142

## Overview

`REPLTool` (`rN6` in cli_inner_pretty.js:380386) is a JavaScript execution sandbox with programmatic access to Claude Code's other tools. Instead of the model issuing a separate tool call for each Read/Grep/Bash, it submits a single JavaScript script that orchestrates multiple tool calls and returns a structured result. The VM context persists across calls (variables, registered tools), making REPL a stateful programming interface. The tool is concurrency-**unsafe** (mutates the shared VM context), read-**unsafe** (can write files via inner Edit/Write), and enabled via `WL()` (feature gate).

Key shorthands available inside the script: `sh()`, `cat()`, `rg()`, `rgf()`, `gl()`, `put()`, `gh()`, `chdir()`, `haiku()`, `registerTool()`. The script ends with a bare `o` (a pre-declared `{}`) to return an object whose thenable values are auto-awaited.

## Schema (Zod)

```javascript
// ============================================
// replInputSchema — REPLTool input parameters
// Location: cli_inner_pretty.js (lazy schema jt_)
// ============================================

// ORIGINAL (for source lookup):
// jt_() returns z.strictObject({ code, description?, timeout? })

// READABLE (for understanding):
const replInputSchema = z.strictObject({
  code: z.string().describe('The JavaScript code to execute'),
  description: z.string().optional().describe('Brief description of what this REPL call does (used as a UI label).'),
  timeout: semanticNumber(z.number().optional()).describe('Optional timeout in milliseconds. Hard cap at REPL_HARD_TIMEOUT_MS.'),
});

// Mapping: jt_→replInputSchema
```

Output schema (`Jt_()`):
- `code: string` — the code that was run
- `result: unknown` — return value from the code execution
- `stdout: string` — captured `console.log` output
- `stderr: string` — captured `console.error` output
- `error?: string` — error message if execution failed
- `registeredTools?: string[]` — names of tools registered during this execution
- `images?: { base64, mediaType }[]` — images returned by inner Read calls
- `documents?: { base64 }[]` — PDFs returned by inner Read calls

`maxResultSizeChars` is **dynamic** via `Sc7()` (`getReplMaxResultSize`) — the cap is computed at access time, typically matching the surrounding context's budget. The tool has `isConcurrencySafe: false`, `isReadOnly: false`.

Reserved keys (`Lt_` at line 380385): `["stdout", "stderr", "error", "result"]` — these shadow output-shape keys and the helper avoids overwriting them.

## validateInput

No explicit `validateInput`. The script is checked at the start of `call()` via `Nt_(code)` (`validateReplScript`), which is a pre-flight syntax check / forbidden-pattern detector.

## checkPermissions

```javascript
async function checkPermissions() {
  return { behavior: 'allow' };
}
```

Always allow. The script's inner tool calls go through their **own** permission checks (REPL doesn't bypass anything — when the script calls `put('/some/path', 'content')`, the underlying FileWriteTool runs its `checkPermissions`). The outer REPL call needs no permission because its semantics are "ask the user about each sub-tool" rather than "the REPL itself does something dangerous".

## call

```javascript
// ============================================
// REPLTool.call — VM-context creation + hydration + script execution + result collection
// Location: cli_inner_pretty.js:380419-380550 (mirrors src/tools/REPLTool/... — REPL is heavily refactored, doesn't have a 1:1 TS source)
// ============================================

// ORIGINAL (for source lookup):
// async call(H, $, q, K, _) {
//   const A = $.agentId ?? LZH;
//   const z = $.getReplContexts()[A];   // existing VM context for this agent
//   const { code, timeout: f } = H;
//   Nt_(code);                            // pre-flight validate
//   const O = Math.min(f ?? Xt_, iN6);   // soft timeout, capped at hard timeout
//   const M = nE($.abortController);     // child abort controller
//   const w = { ...$, abortController: M };
//   /* (1) reuse-or-create VM context, (2) hydrate from prior calls/messages,
//      (3) wrap user code (P38), (4) compile via new Cc7.Script, (5) runInContext with timeout,
//      (6) race against j.promise (manual timer + abort), (7) collect stdout/stderr/result/images/docs,
//      (8) record in replayLog */
// }

// READABLE (for understanding):
async function call(input, context, _toolMap, parentMessage, onProgress) {
  const agentKey = context.agentId ?? DEFAULT_REPL_AGENT_ID;
  const existingContext = context.getReplContexts()[agentKey];
  const { code, timeout } = input;

  // (1) Pre-flight validation
  validateReplScript(code);

  // (2) Timeouts: soft (user-requested or default), capped at hard limit
  const softTimeout = Math.min(timeout ?? REPL_DEFAULT_TIMEOUT_MS, REPL_HARD_TIMEOUT_MS);
  const childAbort = makeChildAbortController(context.abortController);
  const childContext = { ...context, abortController: childAbort };

  // (3) Tool-call tracker for inner calls (Read/Write/Edit/etc. from inside the script)
  const innerToolCalls = new Map();
  const deferredResult = newReplPromise();
  const watchdog = newReplWatchdog(softTimeout, () =>
    deferredResult.reject(Error(`REPL execution timed out after ${softTimeout}ms of script time (inner tool calls excluded). Script may still be running — avoid unbounded awaits.`))
  );

  // (4) Wrap inner tool progress so the watchdog pauses during inner calls
  const onInnerProgress = (event) => {
    if (event.type !== 'progress') return onProgress?.(event);
    const data = event.data;
    recordReplToolCall(innerToolCalls, data);
    if (data.phase === 'start') watchdog.onToolStart();
    else watchdog.onToolEnd();
    onProgress?.(data.result === void 0 ? event : { ...event, data: { ...data, result: void 0 } });
  };

  // (5) Reuse-or-create VM context (boundary uuid = first message uuid in this turn)
  let vmContext;
  const firstMsg = context.messages[0];
  const boundaryUuid = (firstMsg !== undefined && isUserMessage(firstMsg)) ? firstMsg.uuid : null;
  if (existingContext && existingContext.boundaryUuid === boundaryUuid) {
    // Same turn boundary — reuse and refresh
    vmContext = existingContext;
    vmContext.console.clear();
    vmContext.clearAllTimers();
    refreshReplContext(vmContext, filterToolsForRepl(context.options.tools, context.getToolPermissionContext()), childContext, _toolMap, parentMessage, onInnerProgress);
  } else {
    // Different turn — discard old context, create fresh
    existingContext?.clearAllTimers();
    existingContext?.console.clear();
    const filteredTools = filterToolsForRepl(context.options.tools, context.getToolPermissionContext());
    vmContext = createReplContext(filteredTools, childContext, _toolMap, parentMessage, onInnerProgress);
    vmContext.boundaryUuid = boundaryUuid;
    vmContext.helperState.repo = await getCurrentGithubRepo().catch(() => null);
    // (6) Hydrate from prior calls (resume) or fork branch
    try {
      const hydration = context.replHydration ?? { kind: 'fresh' };
      const replayLog = hydration.kind === 'fork' ? hydration.log
                      : hydration.kind === 'resume' ? extractReplHistoryFromMessages(context.messages)
                      : [];
      if (replayLog.length > 0) {
        const t0 = performance.now();
        const replayResult = await replayReplCalls(vmContext, replayLog);
        const ms = Math.round(performance.now() - t0);
        const { summary } = summarizeReplCalls(replayResult);
        logForDebugging(`REPL state hydrated from ${hydration.kind} in ${ms}ms: ${summary}`);
        if (hydration.kind === 'resume') vmContext.replayLog = [...replayLog];
      }
    } catch (e) {
      logForDebugging(`REPL state hydration failed: ${e.message}`, { level: 'warn' });
    }
    vmContext.clearAllTimers();
    context.setReplContext(agentKey, vmContext);
  }

  const { vmContext: ctx, registeredTools, console: cons } = vmContext;
  const pre = new Set(registeredTools.keys());
  preloadReplPrimitives(vmContext);

  // (7) Wrap user code (rewrites bare `o` → `return o`, etc.) and execute
  try {
    const wrappedCode = wrapReplCode(code);
    const script = new nodeVmModule.Script(wrappedCode, { filename: 'repl-tool-code.js' });
    const scriptThenable = script.runInContext(ctx, { timeout: softTimeout });

    // Race: script result vs deferred (timeout or abort)
    const signal = context.abortController.signal;
    const onAbort = () => deferredResult.reject(Error('REPL execution interrupted'));
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: !0 });
    watchdog.start();

    // Hard wall-clock timer (separate from soft script-time timeout)
    const hardTimer = setTimeout((fn) => fn(Error(`REPL execution exceeded hard wall-clock limit of ${REPL_HARD_TIMEOUT_MS}ms. An inner tool call may be hung — try a shorter timeout on the tool itself, or split the work.`)), REPL_HARD_TIMEOUT_MS, deferredResult.reject);
    hardTimer.unref?.();

    const result = await Promise.race([
      Promise.resolve(scriptThenable).then(v => resolveReplObject(vmContext, postProcessReplResult(v))),
      deferredResult.promise,
    ]).finally(() => {
      clearTimeout(hardTimer);
      signal.removeEventListener('abort', onAbort);
    });

    // (8) Collect outputs
    const newTools = [...registeredTools.keys()].filter(k => !pre.has(k));
    const images = extractReplImages(innerToolCalls);
    const documents = extractReplDocuments(innerToolCalls);
    const data = {
      code,
      result,
      stdout: cons.getStdout(),
      stderr: cons.getStderr(),
      ...(newTools.length > 0 && { registeredTools: newTools }),
      ...(images.length > 0 && { images }),
      ...(documents.length > 0 && { documents }),
    };
    const exportedTools = newTools.length > 0 ? exportReplNewTools(registeredTools) : undefined;

    vmContext.replayLog.push({ code, calls: exportReplCallLog(innerToolCalls), threw: !1 });
    return { data, newMessages: collectReplNewMessages(innerToolCalls), ...(exportedTools && { newTools: exportedTools }) };
  } catch (error) {
    /* error path — record in replayLog with threw: !0, build error message */
  }
}

// Mapping: rN6→REPLTool, jt_→replInputSchema, Sc7→getReplMaxResultSize,
//          LZH→DEFAULT_REPL_AGENT_ID, Xt_→REPL_DEFAULT_TIMEOUT_MS, iN6→REPL_HARD_TIMEOUT_MS,
//          Nt_→validateReplScript, vt_→newReplPromise, kt_→newReplWatchdog,
//          Wt_→recordReplToolCall, Xc7→createReplContext, Lc7→refreshReplContext,
//          yc7→filterToolsForRepl, Cc7→nodeVmModule, fPH→getCurrentGithubRepo,
//          I38→extractReplHistoryFromMessages, Gc7→replayReplCalls, Tc7→summarizeReplCalls,
//          y38→preloadReplPrimitives, P38→wrapReplCode, W38→postProcessReplResult,
//          h38→resolveReplObject, Zt_→extractReplImages, Tt_→extractReplDocuments,
//          ed7→exportReplNewTools, Ic7→collectReplNewMessages, lN6→exportReplCallLog,
//          nE→makeChildAbortController, xL→isUserMessage
```

### Key algorithm: VM-context reuse vs reset

**What it does:** A REPL call from the same conversation turn reuses the prior context (variables persist); a call from a new turn resets.

**How it works:** Each turn has a `boundaryUuid` (the UUID of the user's prompt that started the turn). On REPL call:
1. Look up the existing context for this agent.
2. If `existingContext.boundaryUuid === boundaryUuid` (same turn), reuse and refresh.
3. Otherwise, discard the old context and create a fresh one.

**Why this approach:** Within a turn, the model often issues multiple REPL calls that build on each other: declare a variable in call 1, use it in call 2. Reusing the context preserves the variable. Across turns, variables would leak between unrelated requests — fresh start avoids that.

**Edge case:** `boundaryUuid: null` (no first message, e.g., test context) is its own boundary — two calls with `null` are considered same-turn. This is the test scenario, not user-facing.

**Trade-off:** Variables from prior turns are lost. If the model wants to use a variable from turn N in turn N+1, it has to re-declare. The "fork" hydration mode lets a sub-task inherit the parent's REPL state, which is the explicit "I want to share state" path.

### Key algorithm: dual timeout (soft + hard)

**What it does:** Limit pure script execution time (`softTimeout`) while permitting longer wall-clock for inner tool calls.

**How it works:**
1. **Soft timeout** (`softTimeout = Math.min(input.timeout ?? REPL_DEFAULT_TIMEOUT_MS, REPL_HARD_TIMEOUT_MS)`): only counts time **outside** inner tool calls. The watchdog pauses when an inner tool starts and resumes when it ends.
2. **Hard wall-clock timer** (`REPL_HARD_TIMEOUT_MS`): absolute cap. Always runs. Catches hung inner tool calls that the watchdog can't unstick.

**Why this approach:** A REPL script that calls Read on 10 files should not time out because the script itself takes 50ms — the I/O dominates. But a script that infinite-loops in JS should time out fast. Splitting "script time" from "wall-clock time" gives both.

**Trade-off:** A script that genuinely needs lots of script time can hit the soft cap. The user can pass `timeout: N` to extend it (capped at hard limit).

### Key algorithm: thenable auto-await on `o`

**What it does:** When the script ends with bare `o` (a pre-declared `{}`) and properties of `o` are promises, automatically await them before returning the object.

**How it works:** `resolveReplObject(vmContext, postProcessReplResult(returnValue))`:
1. If the return value is `o` (identity check via VM context binding), iterate its keys.
2. For each property that's thenable, `await` it.
3. Replace the property with the resolved value.
4. Return the resolved object.

**Why this approach:** Common pattern:
```js
o.git = sh('git status')
o.foo = cat('foo.ts')
o
```
Without auto-await, `o.git` would be a Promise object that the model couldn't interpret. With auto-await, the model gets `{ git: "...", foo: "..." }`.

**Edge case (called out in the prompt):** Inline use of a shorthand result needs explicit await: `put(f, cat(f) + s)` would put a Promise, not a string. The model is told `const c = await cat(f); put(f, c+s)` is correct.

### Key algorithm: hydration from message history (resume mode)

**What it does:** Replay a session's prior REPL calls so the resumed session has the same variables/state.

**How it works:**
1. `extractReplHistoryFromMessages(context.messages)` scans the transcript for prior REPL tool calls and extracts their `code` + `calls` from `replayLog` entries.
2. `replayReplCalls(vmContext, replayLog)` runs each prior script's code through the fresh VM context. Inner tool calls are **mocked** with their stored results (so we don't re-run `put()` and trash the file system).
3. After replay, the context has the same variables it had at the end of the prior session.

**Why this approach:** Without hydration, `--resume` of a REPL-heavy session would lose all state. The model would get confused that variables from earlier turns are now undefined.

**Edge case:** Replay can fail (e.g., a prior `registerTool` callback no longer exists in this code). Failures are logged as warnings; the context starts in a partial state.

### Key algorithm: inner tool exposure

**What it does:** Expose `Edit`, `NotebookEdit`, MCP tools, and primitive shorthands (`sh`, `cat`, `rg`, `rgf`, `gl`, `put`, `gh`) inside the VM.

**How it works:** `filterToolsForRepl(tools, permissionContext)` selects which tools to expose. Primitives are shorthands wrapped around real tools (`sh = Bash`, `cat = Read`, etc.). The full tool object is also exposed for tools whose protocol is too complex for a shorthand (`Edit`, `NotebookEdit`, MCP tools).

**Why these specific primitives:** They're the high-frequency operations: shell, read, search file, search content, write, gh CLI. The prompt explicitly says "REPL is your **only way** to investigate — shell, file reads, and code search all happen here via the shorthands below."

**Edge case:** The prompt explicitly warns that `import`/`require`/`process`/Node globals are unavailable. The VM context is sealed — only registered helpers and primitive shorthands work.

### registerTool / unregisterTool

The REPL exposes `registerTool(name, desc, schema, handler)` — a way for the model to define its own tool inside a session. The tool persists until `unregisterTool(name)` or the VM context is reset. Registered tools are surfaced back to the orchestrator via `newTools` in the call result, so subsequent turns can use them.

**Why this approach:** Sometimes the model has a recurring operation (e.g., "format this object as a table"). Defining it once as a tool, then invoking by name across turns, is cleaner than copy-pasting the implementation.

## Render methods

The REPL tool exposes minimal render functions in v2.1.142. The render of REPL output is handled by a dedicated `REPLToolResult` component in the UI, similar to BashToolResultMessage. The component shows:
- The `description` (or first line of `code`) as the chrome label.
- `stdout` from `console.log` inline.
- `result` formatted as JSON (with `str` helper to colourize objects).
- Inner tool calls grouped under the REPL call (`renderToolUseTag` style), so the user sees "REPL → Read foo.ts" nested in the transcript.

## Key insights

1. **`isReadOnly: false`, `isConcurrencySafe: false`.** Two REPL calls can't run in parallel because they'd race on the shared VM context. The orchestrator serialises them automatically.

2. **`shouldDefer` is not set explicitly true here.** REPL is enabled via `isEnabled()` returning `WL()`. When REPL mode is on, primitive tools (Read, Write, Edit, Glob, Grep, Bash, NotebookEdit, Agent) are **hidden from direct model use** — the model must go through REPL. This is the `REPL_ONLY_TOOLS` setup mentioned in 2.1.88 src/tools/REPLTool/primitiveTools.ts.

3. **`getReplPrimitiveTools()` in TS source.** Lists the eight primitives that are hidden when REPL is on but still accessible inside the REPL VM via shorthands or by full name (e.g., `await Edit({...})`). Display-side code uses this list to classify virtual messages for these tools when rendering.

4. **The watchdog pauses during inner tool calls.** Without this, a REPL script that calls 10 sequential `cat()`s (each taking 100ms) would consume 1000ms of "script time" against the soft timeout. With pausing, only actual JS-CPU time counts.

5. **Hard wall-clock timer uses `.unref?.()`.** Prevents the timer from keeping the Node process alive past its useful work. Defensive — the timer should always fire or be cleared, but if something goes wrong the process can still exit cleanly.

6. **Shorthand error handling: shorthands never throw.** `sh`/`cat`/`rg` return error text on failure; `rgf`/`gl` return `[]`. The model is told permission-denied is a hard no — don't retry, pivot or stop.

7. **`POSIX-only shQuote`** is called out in the prompt: for PowerShell the model must double single quotes manually: `"'"+s.replaceAll("'", "''")+"'"`. The REPL doesn't try to abstract over shell — it's POSIX-flavoured and the model adapts to the host shell when relevant.

8. **`replHydration` parameter** in `ToolUseContext`: this is how subagents inherit REPL state from parents. The kind can be `'fresh'` (no hydration), `'resume'` (replay from transcript), or `'fork'` (replay from explicit log).

9. **The orchestrator post-processes the return:** `data.images` becomes image content blocks in the model-facing message, `data.documents` becomes document content blocks. So a REPL script that does `o.screenshot = cat('foo.png')` produces an image in the model's view, not a base64 string.

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.126 | Deferred tools (WebSearch, WebFetch, etc.) not being available to skills with `context: fork` and other subagents on their first turn — fixed | upstream; REPL `filterToolsForRepl` |
| 2.1.139 | `registerTool` results surfaced via `newTools` so subsequent turns see the registered tool | `exportReplNewTools` (ed7) |
| 2.1.142 | (no REPL-specific functional changes; REPL inherits the new Monitor tool guard via `qg`/`detectBlockedSleepPattern` indirectly through `Bash` shorthand) | — |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `REPLTool` (rN6) — top-level tool object built by `XK`
- `getReplMaxResultSize` (Sc7) — dynamic `maxResultSizeChars`
- `getReplPrompt` (ad7) / `getReplDescription` (sd7) — prompt/description builders
- `isReplEnabled` (WL) — feature gate
- `REPL_DEFAULT_TIMEOUT_MS` (Xt_) — default soft timeout
- `REPL_HARD_TIMEOUT_MS` (iN6) — hard wall-clock cap
- `DEFAULT_REPL_AGENT_ID` (LZH) — main-thread sentinel
- `REPL_RESERVED_KEYS` (Lt_) — `["stdout", "stderr", "error", "result"]`
- `createReplContext` (Xc7) — fresh VM context factory
- `refreshReplContext` (Lc7) — re-bind tools to existing context
- `filterToolsForRepl` (yc7) — pick which tools the VM sees
- `wrapReplCode` (P38) — rewrites bare `o` → `return o`
- `postProcessReplResult` (W38) — return-value coercion
- `resolveReplObject` (h38) — thenable auto-await on `o`
- `extractReplHistoryFromMessages` (I38) — transcript replay log
- `replayReplCalls` (Gc7) — re-execute prior scripts in fresh context
- `summarizeReplCalls` (Tc7) — replay summary for logs
- `validateReplScript` (Nt_) — pre-flight syntax / forbidden-pattern check
- `recordReplToolCall` (Wt_) — track inner tool calls for watchdog + result collection
- `extractReplImages` (Zt_) / `extractReplDocuments` (Tt_) — collect inner Read outputs
- `exportReplNewTools` (ed7) — surface `registerTool` results
- `exportReplCallLog` (lN6) — replay-log builder
- `collectReplNewMessages` (Ic7) — inner-tool message accumulator
- `makeChildAbortController` (nE) — child abort controller for inner calls
- `newReplPromise` (vt_) — deferred promise factory
- `newReplWatchdog` (kt_) — pause-aware script-time watchdog
- `preloadReplPrimitives` (y38) — bind primitive shorthands into VM
- `isUserMessage` (xL) — boundary detection helper
- `nodeVmModule` (Cc7) — `require('vm')` module
- `getCurrentGithubRepo` (fPH) — gh helper for `REPO` constant in VM
