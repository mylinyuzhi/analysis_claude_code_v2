# Auto Memory — Runtime Extraction (`executeExtractMemories` / `b85` namespace)

## What it does

`/memory` and the `memdir/` module describe *where memories live* and *what their prompt looks like*. This document covers the third leg: **how new memories get written**. That happens through a background subagent that runs at turn end, inspects the conversation, and writes Markdown files into the memory directory. The user never invokes it — it fires automatically when:

1. The feature flag `tengu_passport_quail` is on (default false in v2.1.142 — gated rollout).
2. Auto-memory is enabled (`x9()` / `isAutoMemoryEnabled`).
3. The current turn is the **main agent**, not a subagent (`!toolUseContext.agentId`).
4. The session is not running in remote-CLI mode (`!I6()`).
5. We're not already in the middle of another extraction (otherwise, the new call is *coalesced* into the trailing-run slot).

This subsystem ships in v2.1.142 with the same code shape as v2.1.88 (`src/services/extractMemories/extractMemories.ts`) — closure-scoped state, runForkedAgent under a strict tool-allow-list, fire-and-forget invocation from the Stop-hook chain. Both versions are functionally identical at this level; the v2.1.142 additions are limited to the tiny-memory tool restrictions and the unified prompt builder.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│  Co7 (Stop-hook chain orchestrator) — runs after each assistant    │
│  turn finishes.                                                    │
│  Location: cli_inner_pretty.js:391666                              │
│                                                                    │
│  if (!agentId && Wi$()) b85.executeExtractMemories(M, append)     │
└────────────────────────┬───────────────────────────────────────────┘
                         │ fire-and-forget — Co7 does not await
                         │
                         v
┌────────────────────────────────────────────────────────────────────┐
│  w$5 (executeExtractMemories) → mr7 (extractor closure)            │
│  → Y (executeExtractMemoriesImpl, line 389314):                    │
│    - Reject if subagent                                            │
│    - Reject if tengu_passport_quail off (one-shot log)             │
│    - Reject if !x9()                                               │
│    - Reject if I6() (remote)                                       │
│    - If in-progress: stash context for trailing run, return        │
│    - Otherwise: await runExtraction(...)                           │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         v
┌────────────────────────────────────────────────────────────────────┐
│  z (runExtraction, line 389223):                                   │
│    1. Skip if main agent already wrote to memory paths (A$5)       │
│    2. Skip if no user prose since last cursor (z$5)                │
│    3. Throttle by tengu_bramble_lintel (default 1 turn)            │
│    4. inProgress = true                                            │
│    5. Build memoryDir manifest (existing files + frontmatter)      │
│    6. Build extraction prompt via hr7(newMessageCount, manifest,   │
│       teamMemoryEnabled)                                           │
│    7. JV() (runForkedAgent) with:                                  │
│       - canUseTool = DO8(memoryDir) (strict allow-list)            │
│       - maxTurns = 5                                               │
│       - skipTranscript = true (no recording to main transcript)    │
│       - forkLabel = "extract_memories"                             │
│       - cacheSafeParams (so the fork shares prompt cache)          │
│    8. Advance cursor to last message                               │
│    9. extractWrittenPaths(result.messages) → unique file paths     │
│   10. If non-MEMORY.md paths exist:                                │
│       - JO8(paths) → {type:"system", subtype:"memory_saved", ...}  │
│       - appendSystemMessage(msg) — pushed to main transcript       │
│   11. Telemetry: tengu_extract_memories_extraction (with tokens)   │
│   12. finally: inProgress = false; if pendingContext, trailing run │
└────────────────────────────────────────────────────────────────────┘
                         │
                         │ writes flow as system messages back to
                         │ the main UI
                         v
┌────────────────────────────────────────────────────────────────────┐
│  mx7 attachment dispatcher (cli_inner_pretty.js:348838)            │
│    case "memory_saved" → Oc_(message, verbose)                     │
│      ↓                                                             │
│    Renders: "Saved {N memories [· M team memories]} \n {file list}"│
│      (in verbose mode shows all; non-verbose collapses overflow)   │
└────────────────────────────────────────────────────────────────────┘
```

---

## How it works

### 1. The trigger gate — `Wi$()`

```javascript
// ============================================
// isExtractModeActive - the gate that lets Co7 fire extraction
// Location: cli_inner_pretty.js:139769-139772
// ============================================

// ORIGINAL (for source lookup):
function Wi$() {
  if (!Z$("tengu_passport_quail", !1)) return !1;
  return !T6() || Z$("tengu_slate_thimble", !1);
}

// READABLE (for understanding):
function isExtractModeActive() {
  // The master feature flag — extraction is OFF by default in v2.1.142.
  // Set to true via Growthbook to enable for a cohort.
  if (!getFeatureFlag("tengu_passport_quail", false)) return false;
  // Once the master flag is on, only run in interactive mode UNLESS
  // the non-interactive override flag is also on. T6 = isNonInteractive
  // (not isTrustedWorkspace as some older docs suggest).
  return !isNonInteractive() || getFeatureFlag("tengu_slate_thimble", false);
}

// Mapping:
//   Wi$ -> isExtractModeActive,
//   Z$  -> getFeatureFlag,
//   T6  -> isNonInteractive (= !U$.isInteractive)
```

This gate is read **per-turn** by `Co7` (the Stop-hook chain orchestrator). It returns a boolean — if false, the extraction call is never made. Note that `T6` is `isNonInteractive`, not `isTrustedWorkspace` (see [the goal_hooks_interaction.md correction](../39_goal/goal_hooks_interaction.md#1a-correction-t6-is-isnoninteractive-_5-is-istrustgranted) for the verified semantics). The default policy is: **extraction runs only in interactive REPL sessions**, and `-p`/SDK/bg callers must opt in via `tengu_slate_thimble`.

### 2. The trigger call site — `Co7`

```javascript
// ============================================
// Co7 — extraction invocation
// Location: cli_inner_pretty.js:391664-391667
// ============================================

// ORIGINAL (for source lookup):
if (!y1()) {
  if (!E4(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) Jw7(M, f?.lastResult);
  if (!A.agentId && Wi$()) b85.executeExtractMemories(M, A.appendSystemMessage);
  if (!A.agentId) nr7(M, A.appendSystemMessage);
}

// READABLE (for understanding):
if (!isInBriefMode()) {
  // Run prompt-suggestion harvester unless explicitly disabled
  if (!parseBoolean(process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION)) {
    runPromptSuggestionHarvest(turnContext, lastResult);
  }
  // Fire-and-forget memory extraction for the MAIN agent only
  if (!toolUseContext.agentId && isExtractModeActive()) {
    autoMemNamespace.executeExtractMemories(turnContext, toolUseContext.appendSystemMessage);
  }
  // Fire-and-forget auto-dream check — see auto_dream_runtime.md
  // (nr7 is the wrapped auto-dream entry, NOT prompt-coaching as an earlier draft incorrectly labeled it)
  if (!toolUseContext.agentId) {
    runAutoDreamCheck(turnContext, toolUseContext.appendSystemMessage);
  }
}
```

`Co7` does not await — the extraction runs in the background while the main loop continues. The only mechanism by which the result reaches the user is the `appendSystemMessage` callback, which the extraction calls with a `memory_saved` system message after it writes files.

**Why fire-and-forget:** the extraction subagent can take several seconds (it makes its own LLM calls). Blocking the main loop on it would visibly stall the UI after every turn. Running it concurrently means the user sees their assistant response immediately and the "Saved X memories" notification appears a few seconds later as a separate transcript entry.

### 3. The `b85` namespace exports

```javascript
// ============================================
// jO8 (b85 alias) — auto-memory extraction module exports
// Location: cli_inner_pretty.js:389043-389049
// ============================================

// ORIGINAL (for source lookup):
var jO8 = {};
J$(jO8, {
  initExtractMemories: () => M$5,
  executeExtractMemories: () => w$5,
  drainPendingExtraction: () => D$5,
  createAutoMemCanUseTool: () => DO8,
});

// READABLE (for understanding):
const autoMemExtractionModule = {};
exportNamed(autoMemExtractionModule, {
  initExtractMemories: () => initExtractMemories,        // M$5 — closure factory, call once at startup
  executeExtractMemories: () => executeExtractMemories,  // w$5 — invoked per-turn by Co7
  drainPendingExtraction: () => drainPendingExtraction,  // D$5 — invoked before graceful shutdown (-p mode)
  createAutoMemCanUseTool: () => createAutoMemCanUseTool,// DO8 — strict tool-allow-list factory
});

// Mapping:
//   jO8 -> autoMemExtractionModule (referenced as b85 elsewhere),
//   M$5 -> initExtractMemories, w$5 -> executeExtractMemories,
//   D$5 -> drainPendingExtraction, DO8 -> createAutoMemCanUseTool
```

The export shape matches the v2.1.88 TypeScript module verbatim (`src/services/extractMemories/extractMemories.ts:589-603`). The obfuscator just renamed functions and merged the file with sibling modules.

### 4. The closure-scoped state and entry point — `M$5` / `Y`

```javascript
// ============================================
// initExtractMemories closure body — public entry executeExtractMemoriesImpl
// Location: cli_inner_pretty.js:389314-389325
// ============================================

// ORIGINAL (for source lookup):
async function Y(f, O) {
  if (f.toolUseContext.agentId) return;
  if (!Z$("tengu_passport_quail", !1)) return;
  if (!x9()) return;
  if (I6()) return;
  if (K) {
    (N("[extractMemories] extraction in progress — stashing for trailing run"),
      d("tengu_extract_memories_coalesced", {}),
      (A = { context: f, appendSystemMessage: O }));
    return;
  }
  await z({ context: f, appendSystemMessage: O });
}

// READABLE (for understanding):
async function executeExtractMemoriesImpl(replHookContext, appendSystemMessage) {
  // Subagents must never run extraction (would recurse / duplicate writes)
  if (replHookContext.toolUseContext.agentId) return;
  // Master feature flag
  if (!getFeatureFlag("tengu_passport_quail", false)) return;
  // Auto-memory subsystem itself must be enabled (settings + CCR sentinel + env, see paths.md)
  if (!isAutoMemoryEnabled()) return;
  // Remote/bridge contexts skip extraction (the bridge handles its own memory protocol)
  if (isRemoteWorkspace()) return;
  // Coalescing: if extraction is already running, stash this context as the trailing run.
  // The next call to executeExtractMemoriesImpl during this in-progress window will overwrite
  // pendingContext — we only care about the most recent context (it has the most messages).
  if (inProgress) {
    debugLog("[extractMemories] extraction in progress — stashing for trailing run");
    recordInternalEvent("tengu_extract_memories_coalesced", {});
    pendingContext = { context: replHookContext, appendSystemMessage };
    return;
  }
  await runExtraction({ context: replHookContext, appendSystemMessage });
}

// Mapping:
//   Y   -> executeExtractMemoriesImpl,
//   K   -> inProgress (closure-scoped flag),
//   A   -> pendingContext (closure-scoped trailing-run slot),
//   z   -> runExtraction,
//   x9  -> isAutoMemoryEnabled,    I6 -> isRemoteWorkspace
```

The closure state captured by `M$5` (`initExtractMemories`):

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `H` | `inFlightExtractions` (Set) | Tracks promises still in flight for `drainPendingExtraction` |
| `$` | `lastMemoryMessageUuid` | Cursor — extractions only consider messages after this UUID |
| `q` | `hasLoggedGateFailure` | One-shot flag for ant-only gate-disabled telemetry |
| `K` | `inProgress` | True while `runExtraction` is executing — coalescing flag |
| `_` | `turnsSinceLastExtraction` | Throttle counter — resets after each run |
| `A` | `pendingContext` | Stashed trailing-run context — overwritten on each coalesce |

`initExtractMemories` is called once at startup alongside the other subsystem initializers. After init, `mr7` (the extractor) and `Br7` (the drainer) hold references to the closure-scoped functions. The closure pattern is the same as v2.1.88; tests re-init the closure to get fresh state.

### 5. The cursor / message-since logic — `_$5` and `z$5`

```javascript
// ============================================
// countModelVisibleMessagesSince - how many user/assistant messages since cursor
// Location: cli_inner_pretty.js:389053-389066
// ============================================

// ORIGINAL (for source lookup):
function _$5(H, $) {
  if ($ === null || $ === void 0) return H6(H, cE6);
  let q = !1, K = 0;
  for (let _ of H) {
    if (!q) { if (_.uuid === $) q = !0; continue; }
    if (cE6(_)) K++;
  }
  if (!q) return H6(H, cE6);   // ← fallback: cursor was compacted away
  return K;
}

// READABLE (for understanding):
function countModelVisibleMessagesSince(messages, sinceUuid) {
  if (sinceUuid === null || sinceUuid === undefined) {
    return count(messages, isModelVisibleMessage);
  }
  let foundStart = false;
  let n = 0;
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) foundStart = true;
      continue;
    }
    if (isModelVisibleMessage(message)) n++;
  }
  // Fallback: if the cursor UUID was removed by /compact, count ALL model-visible
  // messages rather than returning 0 (which would permanently disable extraction
  // for the rest of the session).
  if (!foundStart) return count(messages, isModelVisibleMessage);
  return n;
}
```

```javascript
// ============================================
// hasUserProseSince - did the user send substantive prose since cursor?
// Location: cli_inner_pretty.js:389094-389105
// ============================================

// ORIGINAL (for source lookup):
function z$5(H, $) {
  let q = $ === void 0;
  for (let K of H) {
    if (!q) { if (K.uuid === $) q = !0; continue; }
    if (br7(K)) return !0;
  }
  if (!q) return H.some(br7);
  return !1;
}

// READABLE (for understanding):
function hasUserProseSince(messages, sinceUuid) {
  let foundStart = sinceUuid === undefined;
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) foundStart = true;
      continue;
    }
    if (isUserProseMessage(message)) return true;
  }
  // Fallback for compacted-away cursor (same as above)
  if (!foundStart) return messages.some(isUserProseMessage);
  return false;
}

// isUserProseMessage (br7) requires:
//   - type === "user"
//   - !isMeta
//   - content has at least Rr7 = 3 whitespace-separated tokens
```

**Two purposes for these helpers:**

1. **Skip turns that don't add user content.** If the user just typed `y` to confirm a tool, there's no new prose to extract from — skip. The 3-token minimum filters out single-word confirmations.
2. **Cursor advancement.** The cursor (`lastMemoryMessageUuid`) advances after each successful extraction, so the next run only considers messages added since. The fallback for "cursor not found" (because `/compact` deleted that message) preserves correctness — we fall back to "consider everything" rather than silently skipping.

### 6. The main-agent-write detector — `A$5`

```javascript
// ============================================
// hasMemoryWritesSince - did the main agent already write to memory paths?
// Location: cli_inner_pretty.js:389067-389083
// ============================================

// ORIGINAL (for source lookup):
function A$5(H, $) {
  let q = $ === void 0;
  for (let K of H) {
    if (!q) { if (K.uuid === $) q = !0; continue; }
    if (K.type !== "assistant") continue;
    let _ = K.message.content;
    if (!Array.isArray(_)) continue;
    for (let A of _) {
      let z = ur7(A);                            // extract file_path from tool_use block
      if (z !== void 0 && YF(z)) return !0;      // YF = isAutoMemPath
    }
  }
  return !1;
}

// READABLE (for understanding):
function hasMemoryWritesSince(messages, sinceUuid) {
  let foundStart = sinceUuid === undefined;
  for (const message of messages) {
    if (!foundStart) {
      if (message.uuid === sinceUuid) foundStart = true;
      continue;
    }
    if (message.type !== "assistant") continue;
    const content = message.message.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      const filePath = getWrittenFilePath(block);                  // ur7
      if (filePath !== undefined && isAutoMemPath(filePath)) {     // YF
        return true;
      }
    }
  }
  return false;
}
```

**Why this matters — the mutual-exclusion contract.** The main agent's system prompt already includes the "Memory section" with full save guidance ([memdir_core.md](./memdir_core.md)). If the main agent writes a memory itself (e.g., the user asked it to), the forked extraction would be redundant — it would re-read the same conversation and likely write the same or similar memory, wasting tokens. So `runExtraction` skips when this detector fires AND advances the cursor past the main-agent write, so the next extraction only sees messages after the write.

This is the only place the two memory-write paths (main-agent inline saves vs forked-agent extraction) coordinate. They are designed to be mutually exclusive per turn — never both, never racing.

### 7. The extraction prompt builder — `hr7`

```javascript
// ============================================
// buildExtractionPrompt - the prompt sent to the forked subagent
// Location: cli_inner_pretty.js:388989-389034
// ============================================

// ORIGINAL (for source lookup):
function hr7(H, $, q) {
  let K = Y9(),  // isPosix vs isWindows
    _ = K ? Sq : EK,
    A = K ? "ls/find/cat/stat/wc/head/tail and similar" : "Get-ChildItem/Get-Content/...",
    z = K ? "rm" : "Remove-Item",
    Y = gM(),    // isTinyMemoryEnabled
    f = Y
      ? `Check this list before writing — if the fact is already covered, skip it; if a memory has gone stale, ${z} it and write a fresh single-fact memory in its place. Never edit memories in-place.`
      : "Check this list before writing — update an existing file rather than creating a duplicate.",
    O = $.length > 0 ? `\n\n## Existing memory files\n\n${$}\n\n${f}` : "",
    M = q ? "scope guidance, " : "",                   // q = teamMemoryEnabled
    w = Y
      ? `Available tools: ${Bq}, ${v9}, ${d1}, read-only ${_} (${A}), ${o4} for paths inside the memory directory only, and ${_} ${z} with paths inside the memory directory only. ${G7} is not permitted — memories are immutable, so delete-and-recreate replaces in-place edits. All other tools — MCP, Agent, write-capable ${_}, etc — will be denied.`
      : `Available tools: ${Bq}, ${v9}, ${d1}, read-only ${_} (${A}), and ${G7}/${o4} for paths inside the memory directory only, and ${_} ${z} with paths inside the memory directory only. All other tools — MCP, Agent, write-capable ${_}, etc — will be denied.`,
    D = Y
      ? `You have a limited turn budget. Issue all ${o4} and ${z} calls in parallel in a single turn — there is no read-then-edit dance, since memories are immutable.`
      : `You have a limited turn budget. ${G7} requires a prior ${Bq} of the same file, so the efficient strategy is: turn 1 — issue all ${Bq} calls in parallel for every file you might update; turn 2 — issue all ${o4}/${G7} calls in parallel. Do not interleave reads and writes across multiple turns.`;
  return [
    `You are now acting as the memory extraction subagent. Analyze the most recent ~${H} messages above and use them to update your persistent memory systems.`,
    "",
    w,
    "",
    D,
    "",
    `You MUST only use content from the last ~${H} messages to update your persistent memories. Do not waste any turns attempting to investigate or verify that content further — no grepping source files, no reading code to confirm a pattern exists, no git commands.` + O,
    "",
    "If nothing is worth saving, output only 'Nothing to save.' Do not explain why.",
    "",
    "If the user explicitly asks you to remember something, save it immediately as whichever type fits best. If they ask you to forget something, find and remove the relevant entry.",
    "",
    `Apply the memory types, ${M}what-not-to-save criteria, and frontmatter format from the Memory section of your system prompt — it is already in your context above.`,
  ].join("\n");
}

// READABLE (for understanding):
// See above — already deobfuscated inline. Key parameters:
//   H (newMessageCount) — recent message budget, embedded in the prompt
//   $ (existingMemories) — markdown manifest of files already on disk
//   q (teamMemoryEnabled) — appends "scope guidance" to the system-prompt-ref line

// Mapping:
//   hr7 -> buildExtractionPrompt,
//   Y9  -> isPosixOS,           Sq -> BashToolName,      EK -> PowershellToolName,
//   gM  -> isTinyMemoryEnabled, Bq -> ReadToolName,      v9 -> GrepToolName,
//   d1  -> GlobToolName,        G7 -> EditToolName,      o4 -> WriteToolName
```

**Three branches in the prompt:**

1. **OS branch** — `Y9()` returns true on macOS/Linux; the prompt names `Bash`/`rm` vs `Powershell`/`Remove-Item` so the agent issues the right commands. Both POSIX `rm` and PowerShell `Remove-Item` are also separately validated by `f$5` and `Y$5` (allow-listed only for `*.md` files inside the memory directory).
2. **Tiny vs full memory branch** — `gM()`/`tengu_billiard_aviary`. In tiny mode, Edit is denied entirely and the prompt instructs "delete-and-recreate" (because tiny memories are *immutable single-fact files* — see [memory_types.md](./memory_types.md)). In full mode, Edit is allowed and the prompt teaches the read-edit-parallel pattern.
3. **Team vs auto-only branch** — `teamMemoryEnabled` from caller; adds "scope guidance" to the references-section line so the agent knows the system prompt has team-specific types.

**Why merge into one function in v2.1.142?** v2.1.88 had two distinct builders (`buildExtractAutoOnlyPrompt` and `buildExtractCombinedPrompt`). v2.1.142 collapsed them into `hr7` with three boolean parameters because the team-vs-auto difference is only a single line. The merged form is shorter and clearer.

**The "Existing memory files" manifest (`$` parameter)** is built from `scanMemoryFiles(memoryDir)` → `formatMemoryManifest(...)`. The agent reads it BEFORE its first tool call so it knows what's already there. This avoids an `ls` turn and gives the agent context for "do I need to update or create?".

### 8. The tool-restriction validator — `DO8`

```javascript
// ============================================
// createAutoMemCanUseTool - strict allow-list for the forked extraction agent
// Location: cli_inner_pretty.js:389161-389193
// ============================================

// ORIGINAL (for source lookup):
function DO8(H) {
  return async ($, q) => {
    if (Rd()) return wO8($, "Memory is toggled off. Run /toggle-memory to re-enable automemory.");
    if ($.name === m3) return { behavior: "allow", updatedInput: q };
    if ($.name === Bq || $.name === v9 || $.name === d1) return { behavior: "allow", updatedInput: q };
    if ($.name === Sq || $.name === EK) {
      let _ = $.inputSchema.safeParse(q);
      if (_.success) {
        if ($.isReadOnly(_.data)) return { behavior: "allow", updatedInput: q };
        let Y = _.data.command;
        if (typeof Y === "string") {
          if ($.name === Sq ? await f$5(Y) : Y$5(Y)) return { behavior: "allow", updatedInput: q };
        }
      }
      let A = $.name === Sq;
      return wO8($, `Only read-only shell commands and ${A ? "rm" : "Remove-Item"} with all paths inside ${H} are permitted in this context (...)`);
    }
    if (($.name === G7 || $.name === o4) && "file_path" in q) {
      if ($.name === G7 && gM())
        return wO8($, `${G7} is not permitted in tiny memory mode — memories are immutable, so delete via ${Y9() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${o4}.`);
      let _ = q.file_path;
      if (typeof _ === "string" && N5$(_)) return { behavior: "allow", updatedInput: q };
    }
    let K = Y9() ? Sq : EK;
    return wO8($, `only ${Bq}, ${v9}, ${d1}, read-only ${K}, and ${G7}/${o4} within ${H} are allowed`);
  };
}

// READABLE (for understanding):
function createAutoMemCanUseTool(memoryDir) {
  return async (tool, input) => {
    // 1. /toggle-memory off: deny everything immediately
    if (isMemoryToggledOff()) {
      return denyAutoMemTool(tool, "Memory is toggled off. Run /toggle-memory to re-enable automemory.");
    }
    // 2. REPL — allow (REPL wraps primitive tools that re-invoke this validator)
    if (tool.name === REPL_TOOL_NAME) return { behavior: "allow", updatedInput: input };
    // 3. Read/Grep/Glob — allow unrestricted (all read-only)
    if (tool.name === ReadToolName || tool.name === GrepToolName || tool.name === GlobToolName) {
      return { behavior: "allow", updatedInput: input };
    }
    // 4. Bash/Powershell
    if (tool.name === BashToolName || tool.name === PowershellToolName) {
      const parsed = tool.inputSchema.safeParse(input);
      if (parsed.success) {
        // 4a. Read-only commands (ls, find, cat, etc.) — allow
        if (tool.isReadOnly(parsed.data)) return { behavior: "allow", updatedInput: input };
        // 4b. rm / Remove-Item for *.md paths inside memoryDir — allow (delete-and-recreate)
        const cmd = parsed.data.command;
        if (typeof cmd === "string") {
          const isValidDelete = tool.name === BashToolName ? await validatePosixMemoryRm(cmd) : validatePowerShellRemoveItem(cmd);
          if (isValidDelete) return { behavior: "allow", updatedInput: input };
        }
      }
      return denyAutoMemTool(tool, `Only read-only shell commands and ${tool.name === BashToolName ? "rm" : "Remove-Item"} with all paths inside ${memoryDir} are permitted in this context (ls, find, grep, cat, ...)`);
    }
    // 5. Edit/Write
    if ((tool.name === EditToolName || tool.name === WriteToolName) && "file_path" in input) {
      // Tiny mode: Edit is denied — memories are immutable, must delete+rewrite
      if (tool.name === EditToolName && isTinyMemoryEnabled()) {
        return denyAutoMemTool(tool, `${EditToolName} is not permitted in tiny memory mode — memories are immutable, so delete via ${isPosixOS() ? "Bash rm" : "PowerShell Remove-Item"} and rewrite via ${WriteToolName}.`);
      }
      // Path must be inside memory directory (not the entrypoint MEMORY.md? — see N5$)
      if (typeof input.file_path === "string" && isAutoMemPathExceptEntrypoint(input.file_path)) {
        return { behavior: "allow", updatedInput: input };
      }
    }
    // 6. Default deny
    return denyAutoMemTool(tool, `only ${ReadToolName}, ${GrepToolName}, ${GlobToolName}, read-only ${isPosixOS() ? BashToolName : PowershellToolName}, and ${EditToolName}/${WriteToolName} within ${memoryDir} are allowed`);
  };
}

// Mapping:
//   DO8 -> createAutoMemCanUseTool,    wO8 -> denyAutoMemTool,
//   m3  -> REPL_TOOL_NAME,             Bq -> ReadToolName,
//   v9  -> GrepToolName,               d1 -> GlobToolName,
//   Sq  -> BashToolName,               EK -> PowershellToolName,
//   G7  -> EditToolName,               o4 -> WriteToolName,
//   f$5 -> validatePosixMemoryRm,      Y$5 -> validatePowerShellRemoveItem,
//   N5$ -> isAutoMemPathExceptEntrypoint,
//   Rd  -> isMemoryToggledOff (session toggle),
//   gM  -> isTinyMemoryEnabled,        Y9 -> isPosixOS
```

**The allow-list in tabular form:**

| Tool | Allowed? | Notes |
|------|----------|-------|
| `Read`, `Grep`, `Glob` | ✓ unrestricted | inherently read-only |
| `REPL` | ✓ unrestricted | re-invokes this validator for inner primitives |
| `Bash` / `Powershell` (read-only commands) | ✓ | `ls`, `find`, `grep`, `cat`, `stat`, `wc`, `head`, `tail`, etc. |
| `Bash` / `Powershell` (`rm`/`Remove-Item`) | ✓ if all paths are `*.md` inside `memoryDir` | validated by `f$5` (POSIX) or `Y$5` (PowerShell) |
| `Edit` (non-tiny mode) | ✓ if `file_path` is inside `memoryDir` | path checked via `N5$` |
| `Edit` (tiny mode) | ✗ DENY | tiny memories are immutable; agent must delete+rewrite |
| `Write` | ✓ if `file_path` is inside `memoryDir` | path checked via `N5$` |
| MCP tools | ✗ | not in allow-list |
| Agent / TaskCreate | ✗ | not in allow-list |
| `/toggle-memory off` active | ✗ ALL DENIED | early-return with toggle-off message |

The first check (`Rd()` / `isMemoryToggledOff`) is the v2.1.142 addition. v2.1.88 did not have a session-level toggle; v2.1.142 added `/toggle-memory` (`tj5`) and the corresponding session flag.

**The PowerShell-specific validator** (`Y$5` at line 389113):

```javascript
function Y$5(H) {
  let $ = H.trim().match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  if ($.length < 2) return !1;
  if (!/^(remove-item|ri|del|erase|rd|rm|rmdir)$/i.test($[0])) return !1;
  // Parse args: skip -Path/-LiteralPath flags, reject other -flags,
  // unquote, reject if shell metachars present, require .md ending,
  // require path inside memoryDir (YF).
  ...
  return q > 0;
}
```

This is a hand-rolled PowerShell command tokenizer that accepts `Remove-Item` and its aliases (`ri`, `del`, `erase`, `rd`, `rm`, `rmdir`), then validates each path argument as `*.md` and inside the memory directory. The POSIX variant (`f$5`) uses the canonical shell parser (`FUH`) for the same job.

### 9. The runExtraction core — `z`

The core extraction loop reads as:

```javascript
// ============================================
// runExtraction core — lines 389223-389312 (condensed)
// ============================================

async function runExtraction({ context, appendSystemMessage, isTrailingRun }) {
  const memoryDir = getAutoMemPath();
  const newMessageCount = countModelVisibleMessagesSince(context.messages, lastMemoryMessageUuid);

  // Skip if main agent already wrote
  if (hasMemoryWritesSince(context.messages, lastMemoryMessageUuid)) {
    const last = context.messages.at(-1);
    if (last?.uuid) lastMemoryMessageUuid = last.uuid;       // advance cursor anyway
    recordInternalEvent("tengu_extract_memories_skipped_direct_write", { message_count: newMessageCount });
    return;
  }

  // Skip if no user prose
  if (!hasUserProseSince(context.messages, lastMemoryMessageUuid)) {
    const last = context.messages.at(-1);
    if (last?.uuid) lastMemoryMessageUuid = last.uuid;       // advance cursor anyway
    recordInternalEvent("tengu_extract_memories_skipped_no_prose", { message_count: newMessageCount });
    return;
  }

  // Throttle (default 1 — every eligible turn)
  const teamMemoryEnabled = teamMemPaths.isTeamMemoryEnabled();
  const throttle = getFeatureFlag("tengu_bramble_lintel", null) ?? 1;
  const canUseTool = createAutoMemCanUseTool(memoryDir);
  const cacheSafeParams = createCacheSafeParams(context);

  if (!isTrailingRun) {
    turnsSinceLastExtraction++;
    if (turnsSinceLastExtraction < throttle) return;
  }
  turnsSinceLastExtraction = 0;
  inProgress = true;
  const startTime = Date.now();

  try {
    // Build directory manifest (so the agent doesn't need to ls)
    const existingMemories = formatMemoryManifest(await scanMemoryFiles(memoryDir, T4().signal));
    // Build the extraction prompt
    const userPrompt = buildExtractionPrompt(newMessageCount, existingMemories, teamMemoryEnabled);
    // Fork an agent
    const result = await runForkedAgent({
      promptMessages: [createUserMessage({ content: userPrompt })],
      cacheSafeParams,                       // shares parent's cache
      canUseTool,                            // strict allow-list
      querySource: "extract_memories",
      forkLabel: "extract_memories",
      skipTranscript: true,                  // don't pollute the main transcript
      maxTurns: 5,                           // hard cap
      skipCacheWrite: giH(),
    });
    // Advance cursor on success
    const last = context.messages.at(-1);
    if (last?.uuid) lastMemoryMessageUuid = last.uuid;

    // Extract written paths from the forked agent's tool calls
    const writtenPaths = extractWrittenPaths(result.messages);
    const turnCount = count(result.messages, m => m.type === "assistant");

    // Filter out MEMORY.md (the index file) — only topic files count as "memories saved"
    const memoryPaths = writtenPaths.filter(p => path.basename(p) !== ENTRYPOINT_NAME);
    const teamCount = count(memoryPaths, isTeamMemPath);

    recordInternalEvent("tengu_extract_memories_extraction", {
      input_tokens: result.totalUsage.input_tokens,
      output_tokens: result.totalUsage.output_tokens,
      cache_read_input_tokens: result.totalUsage.cache_read_input_tokens,
      cache_creation_input_tokens: result.totalUsage.cache_creation_input_tokens,
      message_count: newMessageCount,
      turn_count: turnCount,
      files_written: writtenPaths.length,
      memories_saved: memoryPaths.length,
      team_memories_saved: teamCount,
      duration_ms: Date.now() - startTime,
    });

    // Notify the user via system message — drives MemoryUpdateNotification
    if (memoryPaths.length > 0) {
      const msg = createMemorySavedMessage(memoryPaths);
      msg.teamCount = teamCount;
      appendSystemMessage?.(msg);
    }
    recordSuccess("memory_extract");
  } catch (error) {
    debugLog(`[extractMemories] error: ${error}`);
    recordInternalEvent("tengu_extract_memories_error", { duration_ms: Date.now() - startTime });
    recordFailureMetric("memory_extract", "agent_error");
  } finally {
    inProgress = false;
    // Trailing run for the stashed context — once, no further nesting allowed
    const trailing = pendingContext;
    pendingContext = undefined;
    if (trailing && throttle <= 1) {
      await runExtraction({ context: trailing.context, appendSystemMessage: trailing.appendSystemMessage, isTrailingRun: true });
    }
  }
}
```

**Key decisions inline:**

- **`skipTranscript: true`** — the forked agent's messages are NOT written to the main transcript. Otherwise the user would see the extraction subagent's "Let me read existing memories... I'll save user X memory..." chatter alongside their actual conversation, which is noisy and confusing.
- **`maxTurns: 5`** — a hard cap on the forked agent. Well-behaved extractions finish in 2–4 turns (manifest read, file reads, file writes). A 5-turn cap prevents the agent from getting stuck in a verification loop.
- **`forkLabel: "extract_memories"`** — used for cache-key disambiguation. The fork shares the parent's prompt cache (so the system prompt + conversation are paid for once, cache-read on every subsequent extraction).
- **Cursor advance on skip** — when skipping due to "main agent already wrote", the cursor still advances. This is correct: we've decided those messages are handled, so the next extraction shouldn't reconsider them.
- **Cursor NOT advanced on error** — if the forked agent throws, the cursor stays put, so the next extraction will reconsider the same messages. This trades double-work on the next turn for not silently losing memories on transient errors.
- **Trailing run only fires when `throttle <= 1`** — if throttling is set higher (e.g., `tengu_bramble_lintel = 3`), the trailing run is suppressed since it would defeat throttling.

### 10. The drain path — `D$5`

```javascript
// ============================================
// drainPendingExtraction - awaits in-flight extractions before shutdown
// Location: cli_inner_pretty.js:389336-389346
// ============================================

// ORIGINAL (for source lookup):
((mr7 = async (f, O) => {
  let M = Y(f, O);
  H.add(M);
  try { await M; }
  finally { H.delete(M); }
 }),
 (Br7 = async (f = 60000) => {
  if (H.size === 0) return;
  await Promise.race([Promise.all(H).catch(() => {}), new Promise((O) => setTimeout(O, f).unref())]);
 }));

// async function w$5(H, $) { await mr7?.(H, $); }
// async function D$5(H) { await Br7(H); }

// READABLE (for understanding):
const extractor = async (replContext, append) => {
  const promise = executeExtractMemoriesImpl(replContext, append);
  inFlightExtractions.add(promise);
  try { await promise; }
  finally { inFlightExtractions.delete(promise); }
};

const drainer = async (timeoutMs = 60_000) => {
  if (inFlightExtractions.size === 0) return;
  await Promise.race([
    Promise.all(inFlightExtractions).catch(() => {}),
    // setTimeout().unref() so the timer doesn't block process exit
    new Promise((resolve) => setTimeout(resolve, timeoutMs).unref()),
  ]);
};

async function executeExtractMemories(replContext, append) { await extractor?.(replContext, append); }
async function drainPendingExtraction(timeoutMs) { await drainer(timeoutMs); }
```

**Why a drainer?** Interactive REPL doesn't need it — the next user turn will fire `executeExtractMemories` again, and the running extraction's fire-and-forget completes whenever. But `-p` / SDK mode exits after one query, so the extraction would be killed mid-LLM-call by graceful shutdown's 5-second failsafe. `drainPendingExtraction` is called from the `-p` print path **after** the response is flushed but **before** `gracefulShutdownSync`, with a 60-second cap. This lets the extraction finish so memories from the `-p` invocation get saved.

The `unref()` on the timeout is critical — without it, the timer would keep the process alive past its natural exit time. With it, the timer just acts as a ceiling; if the extractions all settle, the process exits immediately.

### 11. The user-visible notification — `JO8` + `Oc_`

```javascript
// ============================================
// createMemorySavedMessage - the system message that drives the UI
// Location: cli_inner_pretty.js:425477-425486
// ============================================

// ORIGINAL (for source lookup):
function JO8(H) {
  return {
    type: "system",
    subtype: "memory_saved",
    writtenPaths: H,
    timestamp: new Date().toISOString(),
    uuid: pV.randomUUID(),
    isMeta: !1,
  };
}

// READABLE (for understanding):
function createMemorySavedMessage(writtenPaths) {
  return {
    type: "system",
    subtype: "memory_saved",
    writtenPaths,
    timestamp: new Date().toISOString(),
    uuid: crypto.randomUUID(),
    isMeta: false,
  };
}
```

The renderer dispatch (`mx7` at `cli_inner_pretty.js:348838`) maps `subtype: "memory_saved"` to the React component `Oc_` (the MemoryUpdateNotification). See [memory_ui.md](./memory_ui.md) for the rendering details.

The runtime extraction's contract with the UI is exactly one method call: `appendSystemMessage(createMemorySavedMessage(memoryPaths))`. Everything else — the icon, the file list, the "+ X more" collapse — happens in the renderer.

---

## Telemetry events

| Event | Fired by | When |
|-------|----------|------|
| `tengu_extract_memories_skipped_direct_write` | `runExtraction` | Main agent already wrote to memory paths in this turn |
| `tengu_extract_memories_skipped_no_prose` | `runExtraction` | User hasn't added 3+ token prose since cursor |
| `tengu_extract_memories_coalesced` | `executeExtractMemoriesImpl` | Another extraction was in flight; this call became the trailing context |
| `tengu_extract_memories_extraction` | `runExtraction` (success) | Includes input/output/cache tokens, file count, turn count, duration |
| `tengu_extract_memories_error` | `runExtraction` (catch) | Includes duration |
| `tengu_extract_memories_gate_disabled` | `executeExtractMemoriesImpl` (ant users only) | Master flag off + first-time-only log |
| `tengu_auto_mem_tool_denied` | `denyAutoMemTool` | One per denial; includes sanitized tool name |
| `tengu_memory_toggled` | `/toggle-memory` handler | When user runs the command |

The success event carries enough to estimate the cost-per-extraction in dashboards. Cache hit rate is computed at log time: `cache_read / (input + cache_create + cache_read)`. Well-behaved extractions hit ~80–95% cache because the system prompt + history are paid once and re-read on every turn.

---

## Why this approach

**Why a forked subagent rather than a regex parser?** Because deciding "what should be saved as a memory" requires understanding context — the same sentence "We use Postgres" might be an offhand mention or a hard project constraint. A regex parser would either over-save (every keyword) or under-save (only explicit "remember X"). A model call with the full conversation context can make judgment calls about salience that no rule can.

**Why a fork rather than calling the main agent?** Three reasons:

1. **Tool restrictions.** The main agent can run *any* tool, including destructive Bash. The forked agent must be sandboxed to the memory directory. `canUseTool` is the chokepoint.
2. **Prompt isolation.** The extraction prompt ("you are now the memory subagent") is incompatible with the main agent's prompt ("you are Claude Code"). A fresh prompt for a fresh task.
3. **Token isolation.** The fork's transcript (and its tool calls / responses) doesn't pollute the main transcript. The user sees "Saved 2 memories", not "Let me read MEMORY.md... I see user.md exists... I should also create feedback.md..."

**Why share the prompt cache?** Because the main system prompt is ~10KB and stable; the conversation is potentially much larger. If the fork built its own cache from scratch, each extraction would pay the full system + history input-token cost. By sharing via `cacheSafeParams`, only the extraction prompt and the manifest are new — typically a few hundred tokens — and cache-read is much cheaper than cache-write. Empirically, extraction runs hit 80%+ cache.

**Why mutual-exclude main-agent writes?** Because the main agent has the same save instructions in its system prompt and can save memories itself. If both ran on the same turn, they'd race: the main agent might write `user.md`, then the forked agent reads the existing memories (including the new `user.md`), decides to update it, and either overwrites the main agent's content or creates `user-1.md`. The detect-and-skip pattern in `hasMemoryWritesSince` ensures at-most-one writer per turn.

**Why throttle by turns rather than by time?** Because turns correspond to user actions — each turn is "user said something new". Time-based throttling would either over-throttle a fast-typing user or under-throttle a long-pause session. Turns directly capture "amount of content to extract from".

**Why the cursor not the conversation length?** Because `/compact` can shorten the conversation. A length-based counter would think "no new content" after a compaction removed half the history. A UUID cursor survives compaction (with the fallback to "consider everything" if the UUID was removed — see the `_$5` analysis above).

**Why the trailing run mechanism?** Because users can fire multiple turns in quick succession. Without coalescing, you'd get N concurrent extractions racing. With coalescing, you get at most 2: the in-flight one, and one trailing run that covers everything accumulated during the in-flight window. This is a classic single-flight + tail-call pattern.

**Why fire-and-forget rather than awaiting?** Because the user just got their assistant response — they don't want to wait an extra 3-5 seconds for the next prompt while the background extraction runs an LLM call. Fire-and-forget means "responsiveness now, persistence eventually". The `memory_saved` system message arrives whenever the extraction finishes and slots into the transcript like any other late-arriving event.

**Why does the main agent ALSO have save instructions in its system prompt?** Because some saves are explicit ("remember that I use Postgres"). The main agent should be able to honor that directly without waiting for the post-turn extraction. The mutual-exclusion contract means the forked agent steps aside whenever the main agent has already acted.

---

## Key insight

The extraction subsystem is **a tiny composition of pre-existing primitives**:

- The Stop-hook chain (Co7) already runs after every turn.
- The forked-agent harness (runForkedAgent) already exists for other features.
- The `canUseTool` pattern already exists for permission gating.
- The system-message append (appendSystemMessage) already exists for telemetry.

`b85.executeExtractMemories` adds ~400 LoC of glue: a closure for state, a prompt builder, an allow-list validator, and a notification packager. There's no novel infrastructure — the feature is a permutation of existing pieces under a master feature flag.

The "magic" is the prompt + the canUseTool sandbox + the cache-sharing fork. Those three together make the extraction *safe* (sandbox), *cheap* (cache), and *competent* (prompt). Take any one away and the feature breaks: no sandbox → the agent could `rm -rf`; no cache → every turn costs 10K+ tokens; no prompt → the agent doesn't know what to save.

---

## Cross-references

- [memdir_core.md](./memdir_core.md) — where the memory directory is and how MEMORY.md is built
- [paths.md](./paths.md) — `x9()` / `isAutoMemoryEnabled` gate (one of the prerequisites for extraction)
- [memory_ui.md](./memory_ui.md) — the renderer side (Oc_ / mx7) that turns the `memory_saved` system message into a UI block
- [memory_save_survey.md](./memory_save_survey.md) — the post-save survey capture/reject hooks (`gY$`)
- Co7 (Stop-hook chain orchestrator) — [`../39_goal/goal_stop_hook_consumer.md`](../39_goal/goal_stop_hook_consumer.md) covers the same function from a different feature's perspective
- runForkedAgent (the JV harness) — `06_state_management` or wherever the fork primitive is documented
- Memory file IO (`writeFile`, `unlink`) — the standard `fs/promises` calls; no special wrapper
- Stop-hook chain (`Co7`) — `27_hooks_subsystem`
