# Type-to-Filter in `/skills` Dialog (v2.1.121)

## What it does

The `/skills` dialog (used to view and edit per-skill `skillOverrides` - see [skill_overrides.md](./skill_overrides.md)) previously required arrow-key scrolling through every skill. For users with many bundled, project, user, plugin, and MCP skills (often 30+ entries), finding a specific skill was slow.

v2.1.121 adds an inline filter box at the top of the dialog. Pressing `/` enters filter mode; typing narrows the list to skills whose **name**, **description**, or **source label** contains the entered substring (case-insensitive). Pressing `Esc` clears the filter and returns to the full list; pressing `Enter` or `↓` exits filter mode but keeps the filter active for selection.

---

## How it works

### 1. Filter state and the filtered list

The dialog component (`uJ4` at `cli_inner_pretty.js:476909`) holds two pieces of filter state:

- `P` (`filterQuery`) - the current filter substring
- `J` (`isFilterFocused`) - whether the input box is currently capturing keystrokes

The filtered list is computed via `By.useMemo` based on `A` (the full skill list) and `P`:

```javascript
// ============================================
// SkillsDialog - filtered list computation
// Location: cli_inner_pretty.js:476969-476978
// ============================================

// ORIGINAL (for source lookup):
let v = By.useMemo(() => {
    if (!P) return A;
    let c = P.toLowerCase();
    return A.filter(
      (l) =>
        l.name.toLowerCase().includes(c) ||
        (l.description ?? "").toLowerCase().includes(c) ||
        xJ4(l.source).toLowerCase().includes(c),
    );
  }, [A, P]);

// READABLE (for understanding):
const filteredSkills = useMemo(() => {
  if (!filterQuery) return allSkills;
  const needle = filterQuery.toLowerCase();
  return allSkills.filter((skill) =>
    skill.name.toLowerCase().includes(needle) ||
    (skill.description ?? "").toLowerCase().includes(needle) ||
    formatSkillSource(skill.source).toLowerCase().includes(needle),
  );
}, [allSkills, filterQuery]);

// Mapping: P -> filterQuery, A -> allSkills, v -> filteredSkills,
//          xJ4 -> formatSkillSource, c -> needle, l -> skill
```

`formatSkillSource` (`xJ4`) converts internal source identifiers (`"plugin"`, `"mcp"`, `"bundled"`, `"builtin"`) into display labels (`"plugin"`, `"mcp"`, `"built-in"`). Searching against the display label means "type 'built-in' to see only the built-in skills" works correctly.

### 2. The input handler

The key handler distinguishes between filter-mode and selection-mode keystrokes:

```javascript
// ============================================
// SkillsDialog - keystroke dispatcher
// Location: cli_inner_pretty.js:477029-477047
// ============================================

// ORIGINAL (for source lookup):
let x = By.useCallback(
    (c) => {
      if (L.current) {
        G(c);
        return;
      }
      if (c.ctrl || c.meta) return;
      if (c.name === "backspace") {
        if (P) (c.preventDefault(), (L.current = !0), X(!0), Z(P.slice(0, -1)));
        return;
      }
      if (c.name.length > 1 && c.name !== "number") return;
      if (c.key.length >= 1 && c.key !== " ") {
        (c.preventDefault(), (L.current = !0), X(!0));
        let l = c.key.startsWith("/") ? c.key.slice(1) : c.key;
        Z(P + l);
      }
    },
    [G, Z, P],
  );

// READABLE (for understanding):
const handleKeyDown = useCallback((key) => {
  // If filter mode already has focus, hand off the keystroke to the input controller
  if (isFilterActiveRef.current) {
    forwardToFilterInput(key);
    return;
  }
  // Skip modifier-only shortcuts (Ctrl/Cmd)
  if (key.ctrl || key.meta) return;
  // Backspace shrinks the filter and reactivates filter focus
  if (key.name === "backspace") {
    if (filterQuery) {
      key.preventDefault();
      isFilterActiveRef.current = true;
      setFilterFocused(true);
      setFilterQuery(filterQuery.slice(0, -1));
    }
    return;
  }
  // Non-printable keys (arrows, function keys) propagate up to the list controller
  if (key.name.length > 1 && key.name !== "number") return;
  // Printable character: enter filter mode, strip a leading "/" if present (the
  // "/" is the keystroke that activates filter mode in the first place)
  if (key.key.length >= 1 && key.key !== " ") {
    key.preventDefault();
    isFilterActiveRef.current = true;
    setFilterFocused(true);
    const ch = key.key.startsWith("/") ? key.key.slice(1) : key.key;
    setFilterQuery(filterQuery + ch);
  }
}, [forwardToFilterInput, setFilterQuery, filterQuery]);

// Mapping:
//   x   -> handleKeyDown,           L   -> isFilterActiveRef,
//   G   -> forwardToFilterInput,    Z   -> setFilterQuery,
//   X   -> setFilterFocused,        c   -> key,
//   P   -> filterQuery
```

The `"/"` slash-strip is the clever bit: when the dialog is in select-mode and the user types `/`, the keystroke activates filter mode **and** the literal `/` is consumed (not appended to the query). Typing `/foo` therefore filters to entries containing `foo`, not entries containing `/foo`.

### 3. Empty-state and the subtitle hint

When the filter narrows to zero matches the dialog shows a "No skills match" placeholder instead of an empty list:

```javascript
// ============================================
// SkillsDialog - subtitle hint and empty state
// Location: cli_inner_pretty.js:477078-477104
// ============================================

// ORIGINAL (for source lookup):
let g = P ? `${v.length}/${A.length} ${S8(A.length, "skill")}` : `${A.length} ${S8(A.length, "skill")}`,
  Q = J
    ? "type to filter \xB7 ↓/enter to select \xB7 esc to clear"
    : v.length === 0
      ? `/ to search, ${u} to cancel`
      : `${R} to cycle, ${B} to save, / to search, ${S} to sort, ${u} to cancel`;
// ... in the render tree:
v.length === 0
  ? $z.createElement(p, { marginTop: 1 }, $z.createElement(b4, null, `No skills match "${P}"`))
  : $z.createElement(...)

// READABLE (for understanding):
const subtitleCount = filterQuery
  ? `${filteredSkills.length}/${allSkills.length} ${pluralize(allSkills.length, "skill")}`
  : `${allSkills.length} ${pluralize(allSkills.length, "skill")}`;
const subtitleHint = isFilterFocused
  ? "type to filter · ↓/enter to select · esc to clear"
  : filteredSkills.length === 0
    ? `/ to search, ${escapeKey} to cancel`
    : `${spaceKey} to cycle, ${enterKey} to save, / to search, ${sortKey} to sort, ${escapeKey} to cancel`;
// In the render tree:
filteredSkills.length === 0
  ? <Box marginTop={1}><Subtle>{`No skills match "${filterQuery}"`}</Subtle></Box>
  : <SelectList>{...filteredSkills}</SelectList>

// Mapping: P -> filterQuery, v -> filteredSkills, A -> allSkills, J -> isFilterFocused,
//          S8 -> pluralize, R -> spaceKey, B -> enterKey, S -> sortKey, u -> escapeKey
```

### 4. The query input component

The query input is the `DN` component at line 477096:

```javascript
// ============================================
// SkillsDialog - filter input element
// Location: cli_inner_pretty.js:477096-477102
// ============================================

// ORIGINAL (for source lookup):
$z.createElement(DN, {
  query: P,
  isFocused: J,
  isTerminalFocused: j,
  cursorOffset: W,
  placeholder: "Search skills…",
}),

// READABLE (for understanding):
<FilterTextInput
  query={filterQuery}
  isFocused={isFilterFocused}
  isTerminalFocused={isTerminalFocused}
  cursorOffset={cursorOffset}
  placeholder="Search skills…"
/>

// Mapping: DN -> FilterTextInput, P -> filterQuery, J -> isFilterFocused,
//          j -> isTerminalFocused, W -> cursorOffset
```

`AG` (`useFilterInputController`) on line 476961 wires up the cursor, paste, and keystroke handling for filter mode.

---

## Why this approach

**Why filter, not sort?** The dialog already has a sort toggle (`t` to sort by token cost; press `S` in the new `sortKey` binding above). Filtering is the right pattern for the question "where is the skill I want?", whereas sorting is the right pattern for "what is the most expensive skill?". The dialog keeps both.

**Why search name + description + source?** Three signals all map to user intent:
- Name search: the user remembers the slash command name
- Description search: the user remembers what the skill *does* but not its name
- Source search: the user wants to scope ("only show my plugin skills" via `plugin`, or "only show built-ins" via `built-in`)

Including all three matches the muscle memory from similar fuzzy-find dialogs in `/agents`, `/model`, `/mcp`, etc.

**Why a separate `isFilterFocused` state for input mode?** The dialog has two distinct keystroke domains: selection (space to cycle, enter to save, t to sort) and input (everything else types into the filter). Without an explicit mode, every keystroke would have to decide whether to mutate filter state or trigger an action - a recipe for collisions when a user wants to type a literal `t` in the filter.

The slash-prefix activation (`/`) and Esc-deactivation form the same edit/select toggle pattern used in vim's command line.

**Why include "/" as the trigger but strip it?** Symmetry with the rest of the CLI - the user is already typing `/skill-name` in the main prompt and intuitively reaches for `/` to start a search. Stripping the literal `/` is a small ergonomic win - users do not have to backspace after entering filter mode.

**Key insight:** The filter does **not** affect which skills are listed for the model. It is a pure UI affordance for navigating the dialog. The model-facing skill list comes from a different code path (`HG(R9())` -> filter for `XG$` predicate -> render in system prompt). The dialog and the model both consume the same `allSkills` list but apply different filters; the dialog's filter is local state, never persisted, never sent to the model.

---

## Cross-references

- `skillOverrides` setting and the per-skill row component `sT5` - [skill_overrides.md](./skill_overrides.md)
- `formatSkillSource` (`xJ4`) - the v2.1.142 version unifies `bundled`/`builtin` into `built-in`; see [skill_overrides.md#5-the-skills-dialog](./skill_overrides.md)
- The v2.1.105 listing budget (`formatCommandsWithinBudget`) is unrelated - it computes how much description text the **model** sees, not what the **dialog** shows.
