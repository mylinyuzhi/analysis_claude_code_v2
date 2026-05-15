# Named Custom Themes + Plugin Themes (v2.1.118)

## What changed

Pre-v2.1.118 the user could pick from a fixed catalog of themes
(default, light, dark, etc.) plus tweak custom color overrides. The
overrides were stored as a flat map on the user's settings.json.

v2.1.118 introduces:

- **Named custom themes**: themes are stored as
  `~/.claude/themes/<slug>.json` with a user-editable `name`. Each
  theme has a `slug` (the file name) and a list of `overrides`.
- **Multiple custom themes**: users can create as many as they want
  and switch between them.
- **Plugin themes**: plugins can ship their own themes by writing
  files into the plugin's theme directory; the loader surfaces them
  in the theme picker as `source: "plugin"`.
- **Editor dialog**: opening a custom theme drops into an editing UI
  (`ThemeEditorDialog`) that lets the user rename, change base, and
  edit overrides — with live preview.

The user-facing flow:
1. `/theme` → list of themes with a "Create custom theme" option.
2. Selecting "Create custom theme" → name + base picker, then color
   override editing.
3. Existing custom themes (`source: "user"`) are editable; plugin
   themes (`source: "plugin"`) are read-only.

## Source: theme context + reload hook

```javascript
// ============================================
// CustomThemeContext - provides themes + reload + preview to the tree
// Location: cli_inner_pretty.js:146732, :146765-146770, :146798
// ============================================

const CustomThemeContext = createContext({
  customThemes:        [],            // Array of { slug, name, base, overrides, source }
  activeCustomTheme:   undefined,     // The slug currently active
  reloadCustomThemes:  async () => {}, // Re-scan ~/.claude/themes/*.json + plugin dirs
  setPreviewOverrides: (overrides) => {}, // Live preview for the editor dialog
});

function useCustomThemes() {
  const { customThemes, activeCustomTheme, reloadCustomThemes, setPreviewOverrides } =
    useContext(CustomThemeContext);
  // Wrap in a memo so the consumer's destructure is stable.
  return useMemo(
    () => ({ customThemes, activeCustomTheme, reloadCustomThemes, setPreviewOverrides }),
    [customThemes, activeCustomTheme, reloadCustomThemes, setPreviewOverrides]
  );
}

// Mapping: IBH→CustomThemeContext, HfH→useCustomThemes
```

The context provides four things:

- `customThemes`: array of theme metadata loaded from disk.
- `activeCustomTheme`: which theme is currently applied.
- `reloadCustomThemes`: trigger a re-scan (call after writing files).
- `setPreviewOverrides`: push transient overrides into the renderer
  for the editor's live preview.

## Source: the editor dialog

```javascript
// ============================================
// ThemeEditorDialog - rename, base, overrides editor with live preview
// Location: cli_inner_pretty.js:481434-481605
// ============================================

function ThemeEditorDialog({ initial, defaultBase, onDone, onCancel }) {
  const setAppState = useSetAppState();
  const { customThemes, reloadCustomThemes, setPreviewOverrides } = useCustomThemes();

  // 1) Branch based on whether the initial theme is owned by user or plugin.
  //    Plugin-sourced themes are read-only — the dialog starts at "name" step
  //    so the user can fork it under a new slug.
  const isReadOnlySource = initial !== undefined && initial.source !== "user";

  // 2) Multi-step state machine: "name" → "colors" → done
  const [step, setStep] = useState(initial && !isReadOnlySource ? "colors" : "name");
  const [themeName, setThemeName] = useState(initial?.name ?? "");
  const [themeNameCursor, setThemeNameCursor] = useState(themeName.length);
  const [themeSlug, setThemeSlug] = useState(isReadOnlySource ? "" : (initial?.slug ?? ""));

  // 3) The "base" theme (whose palette we override). Locked at dialog open;
  //    can't change base after starting overrides without losing them.
  const [baseTheme] = useState(() => initial?.base ?? defaultBase);
  const basePalette = useMemo(() => loadThemePalette(baseTheme), [baseTheme]);

  // 4) Overrides — the deltas we save.
  const [overrides, setOverrides] = useState(initial?.overrides ?? {});

  // 5) UI state for color editing:
  const [searchFilter, setSearchFilter] = useState("");
  const [editingColorName, setEditingColorName] = useState(null);
  const [editingColorValue, setEditingColorValue] = useState("");
  const [editingCursor, setEditingCursor] = useState(0);

  // Effective slug: explicit value or derived from name.
  const effectiveSlug = themeSlug || suggestThemeSlug(themeName, customThemes);

  // 6) Resolve a color name to its current value (override first, base second).
  const resolveColor = (colorName) => overrides[colorName] ?? basePalette[colorName];

  // 7) Save handler: write the override map to themes/<slug>.json.
  //    Failure logs but doesn't undo the live preview — user keeps editing.
  const saveOverrides = useCallback((slug, newOverrides) => {
    setOverrides(newOverrides);
    setPreviewOverrides(newOverrides);
    saveCustomTheme({ slug, name: themeName.trim(), base: baseTheme, overrides: newOverrides, source: "user" })
      .catch((err) => warnLog(`[theme] save ${slug} failed: ${err}`, { level: "warn" }));
  }, [baseTheme, themeName, setPreviewOverrides]);

  // 8) Color edit lifecycle:
  //    a. select color → enter edit mode
  //    b. type new value → preview updates
  //    c. Enter → commit (save to disk)
  //    d. Esc → revert preview

  // Always cleanup preview on unmount.
  useEffect(() => () => setPreviewOverrides(null), [setPreviewOverrides]);

  // …key handling and rendering…
}

// Mapping: qL4→ThemeEditorDialog, IZH→isValidHexColor,
//          lV5→suggestThemeSlug, jF→loadThemePalette,
//          rK6→saveCustomTheme, KB→removeObjectKey
```

The dialog is a multi-step component:

1. **Name step** (initial state for new themes or plugin forks):
   - Prompt for `themeName`.
   - Auto-derive `themeSlug` from name (slugified, deduplicated against
     existing slugs).
   - User can override the slug if they want.

2. **Colors step**:
   - Search box filters the color list (palette typically has 100+
     entries).
   - Select a color → enter edit mode, type a hex value.
   - Live preview: `setPreviewOverrides` immediately reflects the new
     value in the surrounding UI.
   - Enter commits (writes to disk).
   - Esc reverts the preview.

## Source: theme persistence

The dialog writes to disk via `rK6` (`saveCustomTheme`). The file
layout is:

```
~/.claude/themes/
  my-theme.json
  ocean.json
  …
```

Each `<slug>.json`:

```json
{
  "name": "My Custom Theme",
  "base": "dark",
  "overrides": {
    "warning": "#ffaa00",
    "permission": "#7c5cff",
    …
  },
  "source": "user"
}
```

Plugin themes live in the plugin's theme directory; the loader
discovers them on plugin enable and merges into the `customThemes`
array with `source: "plugin"`.

## Source: theme picker

```javascript
// ============================================
// Theme picker - integrates custom themes
// Location: cli_inner_pretty.js:433546 (excerpt)
// ============================================

function ThemePicker(props) {
  const { customThemes } = useCustomThemes();
  // The picker merges:
  //   - The fixed built-in themes (default, light, dark, etc.)
  //   - Custom themes from disk (user-created)
  //   - Plugin-shipped themes
  //   - "Create custom theme" entry at the bottom
  const themeOptions = [
    ...BUILT_IN_THEMES.map(t => ({ ...t, source: "built-in" })),
    ...customThemes,  // already typed with source: "user"|"plugin"
    { slug: "__create__", name: "Create custom theme", source: "action" },
  ];
  // …render with selection/edit affordances…
}
```

## Why this approach

### Why slug-keyed files rather than a single JSON map?

**What:** Each custom theme is a separate file
`<slug>.json` rather than entries in `settings.json[customThemes]`.

**Why:**

- Per-file storage scales gracefully. With 50+ themes (some users
  collect many), a single map in settings.json bloats the file and
  triggers re-parse on every settings change.
- Files are easier to share. A user can email/zip a theme file and
  someone else can drop it into `~/.claude/themes/` — no need to
  surgically edit a shared settings.json.
- File-modtime-based incremental reload is trivial.
- Plugin themes follow the same pattern, so the user-vs-plugin
  distinction is purely a `source` flag.

### Why a separate `name` and `slug`?

**What:** `name` is human-readable ("My Custom Theme"), `slug` is the
filename and stable id ("my-custom-theme").

**Why:**

- `name` should accept Unicode, spaces, emoji — the user wants to
  identify the theme in the picker.
- `slug` must be filesystem-safe and stable. Changing the name
  shouldn't break the file location.
- Two users on the same machine could each have a theme named "Mine"
  if they use different slugs (`mine` vs `mine-bob`). The slug
  provides the identity.

### Why suggest the slug from the name automatically?

**What:** `suggestThemeSlug(themeName, customThemes)` produces a
slugified version of the name, deduplicated against existing slugs.

**Why:**

- Most users will name and forget about the slug; auto-suggestion
  reduces friction.
- Deduplication (appending `-2`, `-3` etc.) prevents accidental
  overwrite of an existing theme on save.
- Users who care about the slug (e.g. for sharing or scripting) can
  override.

### Why a separate "name" step rather than always entering at colors?

**What:** New themes (and plugin forks) start at the "name" step;
editing an existing user theme starts at "colors."

**Why:**

- Plugin forks must be renamed — the user shouldn't accidentally
  overwrite the plugin's theme.
- New themes need a name before they can be persisted (the slug is
  derived from it).
- Existing user themes already have a name and slug; jumping to the
  edit-content step matches the user's intent ("I want to tweak this
  theme's colors").

### Why a live preview via `setPreviewOverrides`?

**What:** While editing a color, the surrounding UI immediately
re-renders with the new value.

**Why:**

- Hex values are hard to evaluate by themselves. Seeing a color in
  context (on a syntax-highlighted snippet, on a button, on the
  prompt) is the only way to judge it.
- Without live preview, the user would have to save → exit dialog →
  observe → re-enter dialog → adjust → repeat. With preview, each
  digit they type re-renders.
- The preview is *transient* — `setPreviewOverrides(null)` on
  dialog unmount cleans up. If they cancel, no save happens.

### Why save eagerly (on every Enter) rather than at "Save" button?

**What:** Each commit (Enter on a color edit) immediately writes to
disk.

**Why:**

- Eliminates "lost work" — closing the terminal mid-edit doesn't lose
  changes.
- The mental model is "this is the live theme" — the file IS the
  state. Every commit updates the state.
- For the editor dialog flow, "discard changes" doesn't really mean
  much — you've been previewing them anyway. The Esc key reverts the
  *current* edit (the one in progress), not all committed edits.

### Why log + continue on save failure rather than block?

**What:** `saveCustomTheme(…).catch(err => warnLog(…))` — the save
error is logged but the dialog continues.

**Why:**

- The preview is already applied — blocking the dialog would leave
  the user unable to continue.
- Filesystem errors are rare; the user can usually fix them
  out-of-band (chmod, disk space) without losing their session.
- The log lets the user investigate later if needed.

### Why is the base theme locked after dialog open?

**What:** `const [baseTheme] = useState(() => initial?.base ?? defaultBase)`
— no setter exposed.

**Why:**

- Changing base would invalidate all overrides — they refer to color
  names relative to the base palette.
- Letting the user change base mid-edit would be a frustrating
  silent-data-loss UX. The team chose to lock it instead, forcing
  users to create a new theme if they want a different base.
- If a user does want a different base, the workflow is: cancel,
  create new theme with chosen base, redo overrides.

## Cross-validation: pre-2.1.118 vs 2.1.118

| Aspect | Pre-2.1.118 | v2.1.118+ |
|--------|-------------|-----------|
| Theme storage | Single map in settings.json | Per-slug JSON file in `~/.claude/themes/` |
| Multiple custom themes | No (one custom theme) | Yes (unlimited) |
| Theme name | Implicit ("Custom") | User-editable |
| Plugin themes | Not supported | Discovered from plugin dirs |
| Live preview | No | Yes, via `setPreviewOverrides` |
| Editor dialog | Inline list edit | Multi-step (name → colors) |
| Theme picker | Built-in only | Built-in + user + plugin + "Create" action |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `ThemeEditorDialog` (`qL4`) — multi-step editor; cli_inner_pretty.js:481434-481605
- `CustomThemeContext` (`IBH`) — context provider; cli_inner_pretty.js:146732-146798
- `useCustomThemes` (`HfH`) — context consumer; cli_inner_pretty.js:146765-146770
- `suggestThemeSlug` (`lV5`) — slugifier + dedup
- `isValidHexColor` (`IZH`) — validates override values
- `saveCustomTheme` (`rK6`) — writes `<slug>.json`
- `removeObjectKey` (`KB`) — immutable `delete key` helper
