# Transcript Navigation Shortcuts (v2.1.139)

## What changed

The transcript view (entered via `Ctrl+O` or `/tui transcript`) gains
four new keyboard shortcuts:

- `?` — toggle a help overlay listing every key.
- `{` — jump to the previous user prompt.
- `}` — jump to the next user prompt.
- `v` — open the transcript text in `$VISUAL`/`$EDITOR` (defaults to
  the system editor if neither is set).

Existing scroll keys (`j`/`k`/`Ctrl+U`/`Ctrl+D`/`Ctrl+B`/`Ctrl+F`/
`g`/`G`/space/b) are unchanged.

The footer bar now reflects context: when virtual scroll is active,
shows `↑↓ scroll · v to open in editor · ? for shortcuts`. When in
search mode, shows `n/N to navigate`. Default footer remains the
`ctrl+e to show all` toggle from earlier releases.

## Source: keybinding registration

```javascript
// ============================================
// Transcript context keybindings (v2.1.139 additions)
// Location: cli_inner_pretty.js:167523-167551
// ============================================

// READABLE (the registry shape is direct in the bundle):
const TRANSCRIPT_KEYBINDINGS = {
  context: "Transcript",
  bindings: {
    "ctrl+e":  "transcript:toggleShowAll",
    "ctrl+c":  "transcript:exit",
    escape:    "transcript:exit",
    q:         "transcript:exit",
    "ctrl+u":  "scroll:halfPageUp",
    "ctrl+d":  "scroll:halfPageDown",
    "ctrl+b":  "scroll:fullPageUp",
    "ctrl+f":  "scroll:fullPageDown",
    "ctrl+n":  "scroll:lineDown",
    "ctrl+p":  "scroll:lineUp",
    g:         "scroll:top",
    "shift+g": "scroll:bottom",
    j:         "scroll:lineDown",
    k:         "scroll:lineUp",
    space:     "scroll:fullPageDown",
    b:         "scroll:fullPageUp",
    up:        "scroll:lineUp",
    down:      "scroll:lineDown",
    home:      "scroll:top",
    end:       "scroll:bottom",
    // ↓ v2.1.139 — registered in the Transcript context but consumed by the
    //   help overlay / search component / editor-open hook (not in this table
    //   directly because they trigger non-scroll behaviors).
  },
};

// The `?`/`{`/`}`/`v` keys are handled in the help overlay + transcript
// component event handlers, not in the keybinding registry table —
// they're navigation actions specific to the transcript composition,
// not generic scroll commands.
```

`?` is handled by the transcript component itself (toggles a local
state flag). `{`/`}` invoke `jumpRef.current?.jumpToUserPrompt(±1)`
on the transcript scroller. `v` runs `openInEditor(transcriptText)`.

## Source: the help overlay

```javascript
// ============================================
// TranscriptHelpMenu - the `?` overlay
// Location: cli_inner_pretty.js:579501-579607
// ============================================

function TranscriptHelpMenu() {
  const toggleTranscriptChord = useChord("app:toggleTranscript", "Global", "ctrl+o");
  const exitTranscriptChord   = useChord("transcript:exit",      "Transcript", "q");
  const editorName            = getDefaultEditorDisplayName();   // e.g. "vim", "vscode"

  // Each row is a "padded keychord + description" — see useChord for the
  // platform-aware mapping (cmd+o on macOS, ctrl+o on others).
  const scrollColumn = (
    <Box flexDirection="column">
      <Text dimColor>{`↑↓ j/k`.padEnd(9)}scroll</Text>
      <Text dimColor>{`ctrl+u/d`.padEnd(9)}half page</Text>
      <Text dimColor>{`space b`.padEnd(9)}page</Text>
      <Text dimColor>{`g/G`.padEnd(9)}top/bottom</Text>
      <Text dimColor>{`{/}`.padEnd(9)}prev/next prompt</Text>
    </Box>
  );

  const findOpenColumn = (
    <Box flexDirection="column">
      <Text dimColor>{`/`.padEnd(5)}search</Text>
      <Text dimColor>{`n/N`.padEnd(5)}next/prev match</Text>
      <Text dimColor>{`[`.padEnd(5)}print to scrollback</Text>
      <Text dimColor>{`v`.padEnd(5)}{`open in ${editorName ?? "editor"}`}</Text>
    </Box>
  );

  const sessionColumn = (
    <Box flexDirection="column">
      <Text dimColor>{toggleTranscriptChord.padEnd(7)}toggle transcript</Text>
      <Text dimColor>{exitTranscriptChord.padEnd(7)}exit</Text>
      <Text dimColor>{`?`.padEnd(7)}close help</Text>
    </Box>
  );

  return (
    <Box
      noSelect
      borderTopDimColor
      borderBottom={false} borderLeft={false} borderRight={false}
      borderStyle="single"
      marginTop={1} paddingLeft={2}
      width="100%"
      flexDirection="row" gap={4}
    >
      {scrollColumn}
      {findOpenColumn}
      {sessionColumn}
    </Box>
  );
}
```

The overlay is a flex-row of three columns. Each column groups related
keys. The padding (`padEnd`) ensures column alignment regardless of key
text width.

## Source: the footer bar (context-aware hints)

```javascript
// ============================================
// TranscriptFooterBar - bottom hint bar
// Location: cli_inner_pretty.js:579410-579475
// ============================================

function TranscriptFooterBar({
  showAllInTranscript,
  virtualScroll,
  searchBadge,
  suppressShowAll,
  status,
}) {
  const toggleChord       = useChord("app:toggleTranscript",    "Global",      "ctrl+o");
  const toggleShowAllChord = useChord("transcript:toggleShowAll", "Transcript", "ctrl+e");
  const editorName         = getDefaultEditorDisplayName();
  const editorVerb         = editorName ? `open in ${editorName}` : "open in editor";

  // Three "shown details" tag — when verbose, prefix the hint with this.
  const showAllTag = <>Showing detailed transcript</>;
  const toggleTip  = <>{toggleChord} to toggle</>;

  // Pick the right hint based on state:
  //   - searchBadge present → emphasize n/N navigation
  //   - virtualScroll on    → emphasize v to open in editor + ? for shortcuts
  //   - suppressShowAll     → just "v to open in editor"
  //   - default             → "ctrl+e to {collapse|show all}"
  const hint = searchBadge
    ? "n/N to navigate"
    : virtualScroll
    ? `↑↓ scroll · v to ${editorVerb} · ? for shortcuts`
    : suppressShowAll
    ? `v to ${editorVerb}`
    : `${toggleShowAllChord} to ${showAllInTranscript ? "collapse" : "show all"}`;

  return (
    <Box
      noSelect
      alignItems="center" alignSelf="center"
      borderTopDimColor
      borderBottom={false} borderLeft={false} borderRight={false}
      borderStyle="single"
      marginTop={1} paddingLeft={2}
      width="100%"
    >
      <Text dimColor>
        <Fragment>
          {showAllTag}
          {toggleTip}
          {hint}
        </Fragment>
      </Text>
      <Box flexGrow={1} />
      <TranscriptStatusOrSearchBadge status={status} searchBadge={searchBadge} />
    </Box>
  );
}
```

The hint string is a `·`-separated chord/action list. The status badge
on the right shows either a generic "verbose" indicator, the current
match count when searching, or a custom status text passed in.

## Source: search bar (paired with `/` + `n`/`N`)

```javascript
// ============================================
// TranscriptSearchBar - / prefix search + n/N navigation
// Location: cli_inner_pretty.js:579608-579675
// ============================================

function TranscriptSearchBar({ jumpRef, count, current, onClose, onCancel, setHighlight, initialQuery }) {
  const { query, cursorOffset, handleKeyDown, handlePaste } = useStdinInput({
    isActive: true,
    initialQuery,
    onExit: () => onClose(query),
    onCancel,
  });
  const setTimeoutHandle = useTimer();
  const [buildState, setBuildState] = useState("building");

  useEffect(() => {
    let active = true;
    const warmIndex = jumpRef.current?.warmSearchIndex;
    if (!warmIndex) { setBuildState(null); return; }
    setBuildState("building");
    warmIndex().then((ms) => {
      if (!active) return;
      // < 20ms warm = "instant" — skip the badge.
      if (ms < 20) setBuildState(null);
      else {
        setBuildState({ ms });
        setTimeoutHandle.setTimeout(() => active && setBuildState(null), 2000);
      }
    });
    return () => { active = false; };
  }, []);

  const ready = buildState !== "building";

  // Forward query to the underlying transcript scroller.
  useEffect(() => {
    if (!ready) return;
    jumpRef.current?.setSearchQuery(query);
    setHighlight(query);
  }, [query, ready]);

  const cursor = cursorOffset;
  const cursorChar = cursor < query.length ? query[cursor] : " ";
  return (
    <Box
      borderTopDimColor
      borderBottom={false} borderLeft={false} borderRight={false}
      borderStyle="single"
      marginTop={1} paddingLeft={2}
      tabIndex={0} autoFocus
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      width="100%"
      noSelect
    >
      <Text>/</Text>
      <Text>{query.slice(0, cursor)}</Text>
      <Text inverse>{cursorChar}</Text>
      {cursor < query.length && <Text>{query.slice(cursor + 1)}</Text>}
      <Box flexGrow={1} />
      {buildState === "building"
        ? <Text dimColor>indexing… </Text>
        : buildState
          ? <Text dimColor>indexed in {buildState.ms}ms </Text>
          : count === 0 && query
            ? <Text color="error">no matches </Text>
            : count > 0
              ? <Text dimColor>{current}/{count}  </Text>
              : null}
    </Box>
  );
}
```

The search bar emerges when the user presses `/` in the transcript
view. It builds a search index lazily (`warmSearchIndex`) and surfaces
the indexing time as a transient hint. While building, the bar shows
`indexing…`; under 20ms warms get no badge; longer warms show the
millisecond count for 2 seconds before clearing.

## Why this approach

### Why a `?` overlay rather than always showing all keys?

**What:** The 11 keys are hidden in an overlay; only the footer's
2-3 keys are visible by default.

**Why:**

- 11 keys in the footer would be visual noise and crowd out the
  status content.
- Transcript view's most common interaction is scrolling, which is
  obvious from `↑↓` indicators. The exotic shortcuts (`{`/`}`/`/`) are
  power-user features that benefit from being discoverable but hidden.
- `?` is the conventional "help" key from vim, less, man, etc. — users
  arriving from those tools intuitively try it.
- An always-visible mode (Ctrl+H + Ctrl+? toggles) wasn't chosen
  because the persistent overlay would defeat the purpose of full
  transcript visibility.

### Why three columns rather than one long list?

**What:** Help overlay has three columns: scroll, find/open, session.

**Why:**

- Three columns fit on a single screen row at typical 80-column
  terminals (each ~25 chars wide).
- The grouping reflects user intent:
  - **Scroll** (column 1): "move through content"
  - **Find/Open** (column 2): "operate on content"
  - **Session** (column 3): "exit/toggle"
- Sequential reading top-down within a column matches the visual
  scanning pattern of a help reference.

### Why `{`/`}` for prompt jump?

**What:** The vim-style `{`/`}` keys (paragraph motion) are reused
for "previous/next user prompt."

**Why:**

- In vim, `{`/`}` jump between paragraphs separated by blank lines.
  In chat transcripts, the analogous "paragraph" is the user prompt
  block (which separates assistant turns).
- The mapping is mnemonic for vim users without retraining.
- The keys are unbound in default transcript scroll context, so the
  reuse doesn't conflict.

### Why `v` for "open in editor" rather than `e` or `E`?

**What:** `v` is "open in $EDITOR" / "open in $VISUAL".

**Why:**

- `v` mirrors `$VISUAL` (the env var the action consults), making the
  binding memorable.
- `e` could be confused with `Ctrl+E` (toggle show all).
- vim users also use `v` to enter visual mode — and the transcript
  view's "open" action is *spiritually* a "let me edit this" gesture.

### Why a fallback to `editor` when neither env var is set?

**What:** The footer hint says `open in editor` (lowercase, generic)
when `$EDITOR`/`$VISUAL` are unset.

**Why:**

- The action still has to open *something*. The fallback uses the
  system editor selection (`vim` on POSIX, `notepad` on Windows, etc.).
- Showing "open in vim" would be misleading if the user expects a
  GUI editor — the fallback `editor` is honest about the uncertainty.
- After v2.1.141, the daemon explicitly reads `$EDITOR`/`$VISUAL` from
  the shell environment rather than using a daemon-default — so the
  fallback case is rare.

### Why a separate search bar component rather than reusing the input box?

**What:** `TranscriptSearchBar` is a dedicated component, not the
chat input box repurposed.

**Why:**

- The search bar has different lifecycle: it appears/disappears with
  `/` and `Esc`, and consumes its own keypresses.
- The search index is warmed async (`warmSearchIndex`); a dedicated
  component lets us surface the indexing state separately.
- The chat input box has paste handling, history search, etc., that
  would clutter the simple search path.

### Why surface the indexing time?

**What:** When `warmSearchIndex` takes > 20ms, the bar briefly shows
`indexed in 47ms` for 2 seconds.

**Why:**

- Transparency: long sessions (with 1000s of messages) can take 100ms+
  to index. Without the badge, users seeing a delayed first search
  result would wonder why.
- The < 20ms gate suppresses the badge for normal cases — keeps the
  UI clean for the common path.
- The 2-second display is long enough to be readable but short enough
  to clear before the user finishes typing their query.

## Cross-validation: pre-2.1.139 vs 2.1.139

| Aspect | Pre-2.1.139 | v2.1.139+ |
|--------|-------------|-----------|
| `?` help overlay | Not present | Toggle on/off |
| `{`/`}` prev/next prompt | Not bound | Jump cursor in transcript |
| `v` open in editor | Not bound | Spawns `$VISUAL`/`$EDITOR` |
| Footer hint when scrollable | "ctrl+e to show all" | "↑↓ scroll · v to open · ? for shortcuts" |
| Search (`/` + `n`/`N`) | Available | Available, with indexing time hint |
| `[` print-to-scrollback | Available | Same |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key components/objects in this document:
- `TranscriptHelpMenu` (`si4`) — `?` overlay; cli_inner_pretty.js:579501-579607
- `TranscriptFooterBar` (`ri4`) — context-aware footer; cli_inner_pretty.js:579410-579475
- `TranscriptStatusOrSearchBadge` (`HHA`) — right-side status; cli_inner_pretty.js:579476-579500
- `TranscriptSearchBar` (`$HA`) — `/` query input; cli_inner_pretty.js:579608-579675
- `transcript:toggleShowAll` — action — Ctrl+E
- `transcript:exit` — action — q / Esc / Ctrl+C
- Scroll family: `scroll:halfPageUp`, `:halfPageDown`, `:fullPageUp`, `:fullPageDown`, `:lineUp`, `:lineDown`, `:top`, `:bottom`
