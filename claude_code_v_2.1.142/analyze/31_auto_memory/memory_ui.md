# Auto Memory — UI Surfaces

## What this covers

Six user-facing surfaces are produced by the auto-memory subsystem in v2.1.142. They sit in three distinct layers:

| Layer | Surface | Trigger | Where rendered |
|-------|---------|---------|----------------|
| Slash commands | `/memory` (`sj5` / `aj5`) | User types `/memory` | Modal Dialog with `MemoryFileSelector` |
| Slash commands | `/toggle-memory` (`ej5` / `tj5`) | User types `/toggle-memory` (when enabled) | Inline text result |
| Modal Dialog | `MemoryFileSelector` (`R54`) | Inside the `/memory` Dialog | Modal — list of memory files + toggles |
| Inline transcript | `MemoryUpdateNotification` (`Oc_`) | `appendSystemMessage(memory_saved)` after extraction | Inline in the conversation history |
| Inline transcript | `UserMemoryInputMessage` (`Pb7`) | Renderer sees `<user-memory-input>` tag in message | Inline `# <text>` with random ack |
| Status warnings | "Memory files using X tokens" (`cw5`), "Large MEMORY.md" (`GG5`) | Suggestion engine runs on context | Status-bar suggestion section |

This document covers each. The runtime path that *creates* the `memory_saved` message lives in [extract_memories_runtime.md](./extract_memories_runtime.md); this doc covers only the rendering and the modal flow.

---

## 1. The `/memory` slash command

```javascript
// ============================================
// sj5 — /memory slash command registration
// Location: cli_inner_pretty.js:446024-446031
// ============================================

// ORIGINAL (for source lookup):
sj5 = {
  type: "local-jsx",
  name: "memory",
  description: "Edit Claude memory files",
  load: () => Promise.resolve().then(() => (F54(), U54)),
};

// READABLE (for understanding):
const memoryCommand = {
  type: "local-jsx",
  name: "memory",
  description: "Edit Claude memory files",
  load: () => Promise.resolve().then(() => (initMemoryUIModule(), memoryCallExports)),
};

// Mapping: sj5 -> memoryCommand, F54 -> initMemoryUIModule, U54 -> memoryCallExports
```

The command is `local-jsx` — it renders a React component. The `call` function is `aj5`:

```javascript
// ============================================
// aj5 — the /memory command's call() function
// Location: cli_inner_pretty.js:446006-446008
// ============================================

// ORIGINAL (for source lookup):
aj5 = async (H) => {
  return (G0(), await IL(), JN.createElement(oj5, { onDone: H }));
};

// READABLE (for understanding):
const memoryCommandCall = async (onDone) => {
  clearMemoryFileCaches();     // G0() — invalidate any cached file list
  await primeMemoryFiles();    // IL() — load file list before render so Suspense doesn't flash fallback
  return React.createElement(MemoryCommandDialog, { onDone });
};

// Mapping: aj5 -> memoryCommandCall, G0 -> clearMemoryFileCaches, IL -> primeMemoryFiles, oj5 -> MemoryCommandDialog
```

Two pre-render preparation steps:

1. **`clearMemoryFileCaches()`** — invalidates any in-memory cache of "which memory files exist". Forces a fresh read so a memory file created earlier in this session shows up.
2. **`await primeMemoryFiles()`** — loads the file list synchronously before returning the React element. Without this, `MemoryFileSelector` would `useState`+`useEffect` to fetch the list and the Dialog would show a "Loading memory files…" fallback for a frame. Awaiting here means the user never sees the loading state on first open.

### The Dialog wrapper — `oj5` (`MemoryCommandDialog`)

```javascript
// ============================================
// oj5 — MemoryCommandDialog (the wrapper around MemoryFileSelector)
// Location: cli_inner_pretty.js:~445980 (function body precedes the listing)
// ============================================

// READABLE (the source uses createElement; equivalent JSX):
function MemoryCommandDialog({ onDone }) {
  const handleSelectMemoryFile = async (memoryPath) => {
    // 1. Ensure ~/.claude exists if this is a CLAUDE.md under it
    if (memoryPath.includes(getClaudeConfigHomeDir())) {
      await fsPromises.mkdir(getClaudeConfigHomeDir(), { recursive: true });
    }
    // 2. Touch the file (wx = fail-if-exists; we catch EEXIST to preserve content)
    try {
      await fsPromises.writeFile(memoryPath, "", { encoding: "utf8", flag: "wx" });
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
    }
    // 3. Spawn $VISUAL/$EDITOR (or fall back to detected editor) on the file
    await editFileInEditor(memoryPath);
    // 4. Emit a system message back to the transcript with the relative path + editor hint
    const editorHint = $VISUAL or $EDITOR explanation;
    onDone(
      `Opened memory file at ${getRelativeMemoryPath(memoryPath)}\n\n${editorHint}`,
      { display: "system" }
    );
  };

  return (
    <Dialog title="Memory" onCancel={handleCancel} color="remember">
      <Box flexDirection="column" gap={1}>
        <Suspense fallback={<n1 message="Loading memory files…" dimColor />}>
          <MemoryFileSelector onSelect={handleSelectMemoryFile} onCancel={handleCancel} />
        </Suspense>
        <Link url="https://code.claude.com/docs/en/memory" />
      </Box>
    </Dialog>
  );
}
```

The flow: pick a file → ensure it exists → spawn editor → return a result string. The editor call (`AS` / `editFileInEditor`) detects whether the user's `$VISUAL`/`$EDITOR` is a terminal-mode editor (vim, nano, …) or a GUI editor (code, cursor, subl, …); for terminal-mode, it pauses Ink and runs the editor synchronously; for GUI, it spawns detached and continues. See `Lj8` at `cli_inner_pretty.js:445773` for the editor launch logic.

### The `/toggle-memory` slash command

```javascript
// ============================================
// ej5 — /toggle-memory command registration
// Location: cli_inner_pretty.js:446058-446071 (var decl at 446058; assignment body at 446061)
// ============================================

// ORIGINAL (for source lookup):
ej5 = {
  type: "local",
  name: "toggle-memory",
  description: "Toggle automemory off/on for this session",
  isEnabled: () => !1,                                    // hidden by default in v2.1.142
  isHidden: !1,
  supportsNonInteractive: !1,
  thinClientDispatch: "post-text",
  load: () => Promise.resolve().then(() => (c54(), d54)),
  userFacingName() { return "toggle-memory"; },
};

// READABLE (for understanding):
const toggleMemoryCommand = {
  type: "local",
  name: "toggle-memory",
  description: "Toggle automemory off/on for this session",
  isEnabled: () => false,                                  // gated rollout — typically false unless an internal user
  isHidden: false,                                          // when enabled, shows in slash-command list
  supportsNonInteractive: false,
  thinClientDispatch: "post-text",
  load: () => Promise.resolve().then(() => (initToggleMemoryModule(), toggleMemoryExports)),
  userFacingName() { return "toggle-memory"; },
};
```

```javascript
// ============================================
// tj5 — /toggle-memory call handler
// Location: cli_inner_pretty.js:446035-446048
// ============================================

// ORIGINAL (for source lookup):
tj5 = async () => {
  let H = !Rd();
  return (
    Kv8(H),
    d("tengu_memory_toggled", { toggled_off: H }),
    {
      type: "text",
      value: H
        ? `Automemory disabled for this session · this conversation will not write or read new memories, and previously-loaded memory content should not be referenced.\n\nRun /toggle-memory again to re-enable.`
        : "Automemory re-enabled · memory content may be referenced and new memories can be saved.",
    }
  );
};

// READABLE (for understanding):
const toggleMemoryCall = async () => {
  const newToggledOff = !isMemoryToggledOff();      // flip the bit
  setMemoryToggledOff(newToggledOff);                // U$.memoryToggledOff = newToggledOff
  recordInternalEvent("tengu_memory_toggled", { toggled_off: newToggledOff });
  return {
    type: "text",
    value: newToggledOff
      ? "Automemory disabled for this session · this conversation will not write or read new memories, and previously-loaded memory content should not be referenced.\n\nRun /toggle-memory again to re-enable."
      : "Automemory re-enabled · memory content may be referenced and new memories can be saved.",
  };
};

// Mapping:
//   tj5 -> toggleMemoryCall, Rd -> isMemoryToggledOff, Kv8 -> setMemoryToggledOff
//   d   -> recordInternalEvent
```

The toggle flips a single in-memory bit (`U$.memoryToggledOff`). The bit's effects:

- The extraction validator (`DO8` / `createAutoMemCanUseTool`) checks `Rd()` first and denies every tool call if the toggle is off. See [extract_memories_runtime.md § 8](./extract_memories_runtime.md#8-the-tool-restriction-validator--do8).
- (As of v2.1.142, the toggle does NOT affect the system-prompt injection at `loadMemoryPrompt` / `c5$` — only the write path. So existing memory content stays loaded into the prompt; only new writes are blocked. The user-facing message says "previously-loaded memory content should not be referenced" as guidance, but it's an instruction to the *model*, not a system-prompt change.)

The toggle is session-scoped (the field is on `U$`, the in-process session object) — restarting Claude Code restores the default behavior.

---

## 2. The MemoryFileSelector — `R54`

The actual list-picker inside the `/memory` Dialog. Renders three sections in a single SelectList:

1. **Memory files** — `User memory` (`~/.claude/CLAUDE.md`), `Project memory` (`./CLAUDE.md`), and any @-imported nested memories.
2. **Auto-memory folders** — "Open auto-memory folder", "Open team memory folder", "Open <agent> agent memory" (when applicable). These use a `__open_folder__` sentinel value to distinguish "open the directory" from "open this file".
3. **Toggles row** — "Auto-memory: on/off" (toggle) and "Auto-dream: on/off" (when auto-memory is enabled).

```javascript
// ============================================
// R54 — MemoryFileSelector, the picker component
// Location: cli_inner_pretty.js:445399-445685
// ============================================

// READABLE (condensed — the full ~286-line component handles many edge cases):
function MemoryFileSelector({ onSelect, onCancel }) {
  // 1. Resolve the memory file list (uses Suspense via uB.use(IL()))
  const memoryFiles = React.use(primeMemoryFiles());
  const userPath = path.join(homedir() + "/.claude", "CLAUDE.md");
  const projectPath = path.join(getCwd(), "CLAUDE.md");
  const allFiles = [
    ...memoryFiles.filter(f => f.type !== "AutoMem" && !isAutoMemPathInternal(f.path)).map(addExistsFlag),
    ...(hasUser ? [] : [{ path: userPath, type: "User", content: "", exists: false }]),
    ...(hasProject ? [] : [{ path: projectPath, type: "Project", content: "", exists: false }]),
  ];

  // 2. Build the {label, value, description} option list
  const fileOptions = allFiles.map(f => {
    const depth = f.parent ? (depthMap.get(f.parent) ?? 0) + 1 : 0;
    const indent = depth > 0 ? "  ".repeat(depth - 1) : "";
    const newSuffix = f.exists ? "" : " (new)";
    let label;
    if (f.type === "User" && !f.isNested && f.path === userPath) label = "User memory";
    else if (f.type === "Project" && !f.isNested && f.path === projectPath) label = "Project memory";
    else if (depth > 0) label = `${indent}L ${basename(f.path)}${newSuffix}`;   // tree-indent for nested
    else label = basename(f.path);
    const isGitTracked = hasGitRoot(getCwd());
    let description;
    if (f.type === "User" && !f.isNested) description = "Saved in ~/.claude/CLAUDE.md";
    else if (f.type === "Project" && !f.isNested && f.path === projectPath) description = `${isGitTracked ? "Checked in at" : "Saved in"} ./CLAUDE.md`;
    else if (f.parent) description = "@-imported";
    else if (f.isNested) description = "dynamically loaded";
    else description = "";
    return { label, value: f.path, description };
  });

  // 3. Append auto-memory folder shortcuts
  const folderOptions = [];
  if (isAutoMemoryEnabled()) {
    folderOptions.push({ label: "Open auto-memory folder", value: `__open_folder__${getAutoMemPath()}`, description: "" });
    if (isTeamMemoryEnabled()) {
      folderOptions.push({ label: "Open team memory folder", value: `__open_folder__${getTeamMemPath()}`, description: "" });
    }
    for (const agent of activeAgents) {
      if (agent.memory) {
        folderOptions.push({
          label: `Open ${bold(agent.agentType)} agent memory`,
          value: `__open_folder__${resolveAgentMemoryPath(agent.agentType, agent.memory)}`,
          description: `${agent.memory} scope`,
        });
      }
    }
  }
  fileOptions.push(...folderOptions);

  // 4. Toggle rows above the list
  const [autoMemoryOn, setAutoMemoryOn] = useState(isAutoMemoryEnabled);
  const [autoDreamOn, setAutoDreamOn] = useState(isAutoDreamEnabled);
  const [ccrDisabled, setCcrDisabled] = useState(isCcrSentinelDisabled);
  // ... toggle handlers update userSettings via B6(...) and emit tengu_auto_memory_toggled / tengu_auto_dream_toggled

  // 5. onChange wrapper — handle the __open_folder__ sentinel separately
  const onChange = (selectedValue) => {
    if (selectedValue.startsWith("__open_folder__")) {
      const folderPath = selectedValue.slice("__open_folder__".length);
      fsPromises.mkdir(folderPath, { recursive: true }).then(() => openPath(folderPath)).catch(noop);
      return;
    }
    lastSelectedPath = selectedValue;       // remember for next open
    onSelect(selectedValue);
  };

  // 6. Render
  return (
    <Column width="100%">
      <Column marginBottom={1}>
        <FocusableRow isFocused={selectedRowIndex === 0}>
          <Text>Auto-memory: {ccrUnavailable ? <Text dimColor>unavailable for current model</Text> : autoMemoryOn ? "on" : "off"}</Text>
        </FocusableRow>
        {autoMemoryAndDreamEnabled && (
          <FocusableRow isFocused={selectedRowIndex === 1} styled={false}>
            <Text color={selectedRowIndex === 1 ? "suggestion" : undefined}>
              Auto-dream: {autoDreamOn ? "on" : "off"}
              {dreamStatus && <Text dimColor> · {dreamStatus}</Text>}
              {!isDreamRunning && autoDreamOn && <Text dimColor> · /dream to run</Text>}
            </Text>
          </FocusableRow>
        )}
      </Column>
      <SelectList
        defaultFocusValue={lastSelectedPath || fileOptions[0]?.value}
        options={fileOptions}
        onChange={onChange}
        onCancel={onCancel}
        isDisabled={anyToggleRowFocused}
      />
    </Column>
  );
}

// Mapping:
//   R54 -> MemoryFileSelector, IL -> primeMemoryFiles, sW$ -> "__open_folder__"
//   x9 -> isAutoMemoryEnabled, hL$ -> isAutoDreamEnabled, Pi$ -> isCcrSentinelDisabled,
//   OO8 -> isAutoDreamFeatureEnabled, B6 -> setUserSetting,
//   h54.isTeamMemoryEnabled / h54.getTeamMemPath -> team memory access,
//   bj5 -> agentDefinitionsSelector, rMH -> openPath
```

**The `__open_folder__` sentinel pattern** is a clever bit of value-channel reuse: the SelectList's value type is `string`, but some entries need to mean "open a directory" rather than "open this file". Encoding the sentinel as a path prefix lets the same `onChange` handler dispatch by `startsWith` without changing the option's type.

**Toggle rows** are part of the same focus group as the list — the user can up-arrow off the top of the list to reach the toggle row. The visual distinction is that toggles use a different `FocusableRow` styling. The "Auto-memory: unavailable for current model" string shows when `Pi$()` (CCR sentinel disabled) is true — see [paths.md](./paths.md#cohort-control-via-pi).

**`lastSelectedPath`** (`jj8`) is a module-level variable that persists across selector re-opens. Picking `~/.claude/CLAUDE.md` once means the next `/memory` opens with that row focused by default. Resets on process exit.

**Auto-dream toggle wiring** is independent of auto-memory but appears in the same selector for UX cohesion (they're conceptually related — auto-memory writes, auto-dream consolidates). Auto-dream is gated separately on `OO8()` (`isAutoDreamFeatureEnabled`). See `hL$()` (`isAutoDreamEnabled`) at line 388970 and the `tengu_auto_dream_toggled` telemetry at line 445545.

---

## 3. The MemoryUpdateNotification — `Oc_`

The post-extraction inline notification. Triggered when the extraction subsystem emits `appendSystemMessage(createMemorySavedMessage(memoryPaths))`. The dispatcher `mx7` at line 348838 routes `subtype: "memory_saved"` to `Oc_`:

```javascript
// ============================================
// mx7 — system-message dispatcher (relevant case)
// Location: cli_inner_pretty.js:348848-348859
// ============================================

if (q.subtype === "memory_saved") {
  let D = _ || !!A,      // verbose = (host verbose mode) OR (transcript mode)
    j;
  if ($[3] !== K || $[4] !== q || $[5] !== D)
    ((j = C6.createElement(Oc_, { message: q, addMargin: K, verbose: D })),
      ...);
  else j = $[6];
  return j;
}
```

```javascript
// ============================================
// Oc_ — MemoryUpdateNotification, the inline saved-files block
// Location: cli_inner_pretty.js:349234-349287
// ============================================

// READABLE (condensed):
function MemoryUpdateNotification({ message, addMargin, verbose }) {
  const { writtenPaths } = message;
  // Compute "X team memories" extra segment if team count is set
  const teamSegment = teamMemSavedPart(message);  // {segment: "2 team memories", count: 2} | null
  const privateCount = writtenPaths.length - (teamSegment?.count ?? 0);
  const privateLabel = privateCount > 0 ? `${privateCount} ${privateCount === 1 ? "memory" : "memories"}` : null;
  const stats = [privateLabel, teamSegment?.segment].filter(Boolean);
  // Slice the file list to the first MAX_INLINE_FILES (fc_) when not verbose
  const visibleFiles = verbose ? writtenPaths : writtenPaths.slice(0, MAX_INLINE_FILES);
  const overflowCount = writtenPaths.length - visibleFiles.length;
  const verb = message.verb ?? "Saved";       // customizable; default "Saved"
  return (
    <Column marginTop={addMargin ? 1 : 0}>
      <Row>
        <Column minWidth={2}><Text dimColor>{glyph}</Text></Column>
        <Text>{verb} {stats.join(" · ")}</Text>
      </Row>
      {visibleFiles.map(path => <MemoryFileLink key={path} path={path} />)}
      {overflowCount > 0 && (
        <RowIndent>
          <CollapsibleSummary count={overflowCount} unit="file" expandable />
        </RowIndent>
      )}
    </Column>
  );
}

// Mapping:
//   Oc_ -> MemoryUpdateNotification, Hc_ -> teamMemSavedPart (uses xx7 namespace),
//   Mc_ -> MemoryFileLinkWrapper, wc_ -> MemoryFileLink (clickable filename),
//   nj  -> CollapsibleSummary,     g9 -> glyph (subtle prefix),
//   fc_ -> MAX_INLINE_FILES (the cap before collapsing into "+X more")
```

**Output formats:**

| Scenario | Output |
|----------|--------|
| 1 private memory saved | `· Saved 1 memory` <br> `· user.md` |
| 3 private memories saved | `· Saved 3 memories` <br> `· user.md` <br> `· feedback_testing.md` <br> `· project_deadline.md` |
| 2 private + 1 team memory, verbose off, 5 max inline | `· Saved 2 memories · 1 team memory` <br> `· user.md` <br> `· feedback_testing.md` <br> `· project_deadline.md` <br> *(no overflow — all 3 fit)* |
| 8 memories saved, verbose off, 5 max inline | `· Saved 8 memories` <br> *(5 file lines)* <br> `· +3 more (▸ expand)` |
| 8 memories saved, verbose on (or transcript-mode) | `· Saved 8 memories` <br> *(all 8 file lines)* |

The `verb` field defaults to `"Saved"` but other callers can pass `verb: "Updated"` or `verb: "Removed"`. As of v2.1.142, only the extraction path sets this message and uses the default.

**MemoryFileLink (`wc_`)** is a hoverable filename row. The path is displayed as the basename, and clicking it (in supported terminals via `rMH`) opens the file in the user's editor. Hover state toggles a brief highlight.

---

## 4. The `# direct-save` UI — `Pb7`

When the user types a message starting with `#`, the conversation flow eventually produces an inline block in the transcript with the message text rendered specially:

```javascript
// ============================================
// Pb7 — UserMemoryInputMessage, the "# remembered" UI
// Location: cli_inner_pretty.js:346068-346108
// ============================================

// READABLE (condensed):
function UserMemoryInputMessage({ text, addMargin }) {
  // Extract content from <user-memory-input>...</user-memory-input> wrapper
  const innerText = extractTag(text, "user-memory-input");
  // Pick a random acknowledgment ("Got it." / "Good to know." / "Noted.")
  const ack = oQ_();
  if (!innerText) return null;
  return (
    <Column marginTop={addMargin ? 1 : 0}>
      <Row>
        <Text color="remember" backgroundColor="memoryBackgroundColor">#</Text>
        <Text backgroundColor="memoryBackgroundColor" color="text"> {innerText} </Text>
      </Row>
      <RowFixedHeight height={1}>
        <Text dimColor>{ack}</Text>
      </RowFixedHeight>
    </Column>
  );
}

function oQ_() {
  return pickRandom(["Got it.", "Good to know.", "Noted."]);
}

// Mapping:
//   Pb7 -> UserMemoryInputMessage, V4 -> extractTag, oQ_ -> randomAckMessage
```

**Visual output:** a single-line `# <user's text>` with white-on-blue background (the `memoryBackgroundColor` palette entry), followed by a dimmed acknowledgment line. The visual treatment matches the `/memory` Dialog's `color="remember"` and the entire memory subsystem's blue-tinted styling.

The `<user-memory-input>` wrapper is detected by the renderer dispatcher (`cli_inner_pretty.js:346707`):

```javascript
if (K.text.includes("<user-memory-input>")) {
  // ... render <Pb7 text={K.text} ...>
}
```

**Note on the wrapping origin:** the `<user-memory-input>` tag is not constructed by an obvious helper in cli_inner_pretty.js. The tag-creation path is opaque to this analysis — it appears to be either (a) injected by the system prompt as a model output convention, (b) constructed by an upstream input parser not yet located, or (c) emitted by the extraction subagent as part of its response. The renderer accepts the wrapper from any source and renders the `#` UI regardless. The `le$` function at `cli_inner_pretty.js:207683` is a related parser for `#`-prefixed text but is used for Bash command display hints, not user input.

---

## 5. Status-bar warnings — `cw5` and `GG5`

Two passive UI surfaces inform the user when memory state crosses thresholds:

### Memory token-budget suggestion (`cw5`)

```javascript
// ============================================
// cw5 — "Memory files using X tokens" suggestion
// Location: cli_inner_pretty.js:440856-440874
// ============================================

// ORIGINAL (for source lookup):
function cw5(H, $) {
  let q = H.memoryFiles.reduce((_, A) => _ + A.tokens, 0),
    K = (q / H.rawMaxTokens) * 100;
  if (K >= pw5 && q >= Uw5) {
    let _ = [...H.memoryFiles]
      .sort((A, z) => z.tokens - A.tokens)
      .slice(0, 3)
      .map((A) => `${I1(A.path)} (${r9(A.tokens)})`)
      .join(", ");
    $.push({
      severity: "info",
      title: `Memory files using ${r9(q)} tokens (${K.toFixed(0)}%)`,
      detail: `Largest: ${_}. Use /memory to review and prune stale entries.`,
      savingsTokens: Math.floor(q * 0.3),
    });
  }
}

// READABLE (for understanding):
function pushMemoryTokenSuggestion(context, suggestions) {
  const totalTokens = context.memoryFiles.reduce((sum, f) => sum + f.tokens, 0);
  const percentage = (totalTokens / context.rawMaxTokens) * 100;
  // Threshold: at least 5% of context AND at least 5000 tokens
  if (percentage >= MIN_MEMORY_PCT_THRESHOLD && totalTokens >= MIN_MEMORY_TOKEN_THRESHOLD) {
    const top3 = [...context.memoryFiles]
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 3)
      .map(f => `${displayPath(f.path)} (${formatThousands(f.tokens)})`)
      .join(", ");
    suggestions.push({
      severity: "info",
      title: `Memory files using ${formatThousands(totalTokens)} tokens (${percentage.toFixed(0)}%)`,
      detail: `Largest: ${top3}. Use /memory to review and prune stale entries.`,
      savingsTokens: Math.floor(totalTokens * 0.3),     // optimistic 30% pruning estimate
    });
  }
}

// Constants at lines 440884-440889:
//   pw5 = 5             — MIN_MEMORY_PCT_THRESHOLD (%)
//   Uw5 = 5000          — MIN_MEMORY_TOKEN_THRESHOLD (tokens)
```

Triggers when memory files consume both ≥5% of context AND ≥5000 absolute tokens. Suggests `/memory` to prune. The "savings" estimate (30% of current memory tokens) is a rule-of-thumb to drive the action urgency in the suggestion list.

### Large MEMORY.md warning (`GG5`)

```javascript
// ============================================
// GG5 — "Large memory file will impact performance" warning
// Location: cli_inner_pretty.js:469962-469989
// ============================================

// ORIGINAL (for source lookup):
GG5 = {
  id: "large-memory-files",
  type: "warning",
  isActive: (H) => t3H(H.memoryFiles).length > 0,
  render: (H) => {
    let $ = t3H(H.memoryFiles);
    return o1.createElement(
      o1.Fragment, null,
      $.map((q) => {
        let K = q.path.startsWith(I$()) ? PD4.relative(I$(), q.path) : q.path;
        return o1.createElement(
          $r, { key: q.path, status: "warning" },
          "Large ", o1.createElement(k, { bold: !0 }, K),
          " will impact performance (", B4(q.content.length), " chars >",
          " ", B4(ut), ")", o1.createElement(k, { dimColor: !0 }, " · /memory to edit"),
        );
      }),
    );
  },
};

// READABLE (for understanding):
const largeMemoryFilesWarning = {
  id: "large-memory-files",
  type: "warning",
  isActive: (context) => findLargeMemoryFiles(context.memoryFiles).length > 0,
  render: (context) => {
    const largeFiles = findLargeMemoryFiles(context.memoryFiles);
    return (
      <>
        {largeFiles.map(file => {
          const displayPath = file.path.startsWith(getCwd()) ? path.relative(getCwd(), file.path) : file.path;
          return (
            <WarningRow key={file.path} status="warning">
              Large <Text bold>{displayPath}</Text>
              {" will impact performance ("}
              {formatBytes(file.content.length)} chars &gt; {formatBytes(LARGE_MEMORY_THRESHOLD)})
              <Text dimColor> · /memory to edit</Text>
            </WarningRow>
          );
        })}
      </>
    );
  },
};

// t3H is the threshold filter — files with .content.length > ut are flagged.
// ut is the byte-size cap (separate from the 25KB truncation cap — this is the warning threshold).
```

This is a per-file warning (the suggestion above is aggregate). Fires for individual memory files (including CLAUDE.md and topic .md files) larger than the threshold. The cap-and-warn split is intentional: the 25KB truncation cap (`MAX_ENTRYPOINT_BYTES`) limits what gets put in the prompt, but the warning surfaces unhealthy file sizes regardless of truncation.

---

## 6. End-to-end UI lifecycle

For a complete picture, here's the lifecycle of memory-related UI state through one extraction cycle:

```
User types: "I prefer Postgres over MySQL because of jsonb support"

t=0     Main agent responds (e.g., "Got it, I'll keep that in mind.")
        │
t=0+    Co7 (Stop-hook orchestrator) at 391666 invokes
        │   b85.executeExtractMemories(M, appendSystemMessage)
        │   (fire-and-forget)
        │
t=0+    Main loop displays assistant response, user can type next message
        │
        │  --- background extraction running ---
        │
t=2     Forked subagent reads MEMORY.md, decides to save user.md with
        │  the Postgres preference
        │
t=3     extractWrittenPaths picks up the Write tool call's file_path
        │   → memoryPaths = ["/Users/x/.claude/projects/.../memory/user.md"]
        │
t=3+    runExtraction calls:
        │   appendSystemMessage(createMemorySavedMessage(memoryPaths))
        │   which produces:
        │   {type:"system", subtype:"memory_saved", writtenPaths:[...]}
        │
t=3+    Main UI's transcript receives the system message
        │   mx7 dispatcher routes by subtype
        │   "memory_saved" → Oc_ component renders inline
        │
t=3+    User sees in transcript:
        │   "· Saved 1 memory
        │    · user.md"
        │
t=4     User opens /memory, sees user.md in the list, clicks to edit,
        │  $EDITOR opens. User modifies and saves.
        │
t=4+    /memory's onDone fires:
        │   "Opened memory file at ~/.claude/projects/.../memory/user.md
        │    > Using $EDITOR=\"vim\". To change editor, set $EDITOR or $VISUAL..."
        │
        │  Future turns continue with the new memory content loaded
        │  into the system prompt on the next system-prompt rebuild.
```

The user-facing surface is minimal — one inline notification, one modal Dialog, one optional status-bar warning. The runtime complexity (forked agent, prompt cache sharing, cursor tracking, throttling, coalescing, allow-list validation) is entirely invisible. This is by design: the user's mental model is just "Claude remembers things", with `/memory` as the escape hatch for direct intervention.

---

## Why this approach

**Why a Dialog with file selector rather than a /list + /edit pair?** Because the most common action is "edit a specific file" and the user often doesn't know the file paths. A list with descriptions ("User memory", "Project memory", "Open auto-memory folder") makes the choice visible. Splitting into `/list` + `/edit <path>` would require the user to remember paths between commands.

**Why an inline notification rather than a toast?** Because the transcript is the persistent record of session state. A toast would disappear, leaving no trace; an inline notification is searchable in the conversation history, exportable to logs, and visible in `--resume`d sessions. The trade-off is more vertical space per save, mitigated by the collapse-after-N-files pattern.

**Why the `__open_folder__` sentinel rather than two list types?** Because the SelectList component is generic over string values. Encoding "this is a folder open, not a file select" as a value prefix keeps the SelectList implementation simple. The cost is a one-line `startsWith` check in the onChange handler; the benefit is no need to extend SelectList's API.

**Why expose toggle rows inside the file selector rather than as `/auto-memory-on` / `/auto-memory-off` commands?** Because the toggles are session-scoped *settings*, not actions. Settings belong with the rest of the user-modifiable state, not in the command catalog. Burying them in `/memory` also makes them discoverable to the user who's already in "I'm managing my memory" mode.

**Why no token-cost UI for extractions?** Because the user already pays attention to total tokens via the status bar. Adding "extraction used 250 tokens" per save would be noise — the cost is amortized over many turns and is much smaller than the LLM call that triggered the turn. The internal telemetry (`tengu_extract_memories_extraction`) captures the data for analytics dashboards.

**Why does `/toggle-memory` only affect writes, not reads?** Because reading is cheap (just text in the system prompt) and the memory is presumably accurate. Disabling writes is the meaningful "stop changing my memories" knob. If the user wants to *remove* memory from the prompt entirely, they need to clear `autoMemoryEnabled` in settings (a more drastic action).

**Why a random ack for `# direct-save`?** Because a fixed string ("Saved.") would feel mechanical; three alternates ("Got it.", "Good to know.", "Noted.") give a friendlier, less-templated feel. The exact strings are chosen to be: brief (so they don't dominate the screen), action-confirming (so the user knows it worked), and non-presumptuous (the "noted" / "good to know" pair acknowledges without implying judgment).

---

## Key insight

The UI for auto-memory is **deliberately understated**. The user types `#xyz` and sees `# xyz · Noted.`; the user makes a few turns and sees `· Saved 1 memory · user.md`; the user can type `/memory` and edit any of them. That's the entire user-visible surface. The forked subagent, the strict canUseTool allow-list, the prompt cache sharing, the cursor logic — all invisible. The few status-bar warnings only surface when memory becomes problematic (too large, too token-hungry); they're not in the user's face when things are working.

This minimalism is the right design choice for a *background* feature. Auto-memory's job is to make Claude smarter over time without the user having to do anything. Putting it front-and-center would make it feel like another tax on the user's attention. Burying it makes it feel like an emergent property of using the tool.

---

## Cross-references

- [extract_memories_runtime.md](./extract_memories_runtime.md) — the runtime that produces the `memory_saved` message this UI consumes
- [memdir_core.md](./memdir_core.md) — where the memory files live and how they're built into the prompt
- [paths.md](./paths.md) — `x9()` / `isAutoMemoryEnabled` (gates the selector's toggle row default), `Pi$()` (drives the "unavailable for current model" message)
- [memory_save_survey.md](./memory_save_survey.md) — the post-save survey capture/reject UI that complements the notification
- Dialog component (`N8`) and SelectList (`U8`) — `21_terminal_renderer` or wherever the design-system primitives are documented
- The status-bar suggestion engine that consumes `cw5` and `GG5` — `21_terminal_renderer`
- `Lj8` / `AS` (editor launcher) — `28_cli_commands` or wherever the editor integration is documented
