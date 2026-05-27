# `/skills` Dialog — UI & Persistence (v2.1.88 → v2.1.142)

> Companion to [skill_frontmatter.md](./skill_frontmatter.md) (skill author-side definition + runtime gate chain), [skill_overrides.md](./skill_overrides.md) (operator-tier state semantics), and [filter_search.md](./filter_search.md) (the filter input). This document covers the dialog as a whole: how it evolved from a read-only viewer to an interactive editor, where its edits land on disk, and the full keystroke and render model.
>
> **Quick note on `name-only`:** despite the name, this state does **not** require a user trigger. The model can invoke a `name-only` skill directly via the Skill tool. The state only collapses the description in the listing sent to the model. See [skill_frontmatter.md](./skill_frontmatter.md) for the corrected truth table.

---

## TL;DR — answers to the four questions

| Question | Answer (v2.1.142) |
|----------|-------------------|
| Is a per-skill on/off state introduced? | **Yes.** v2.1.129 added the `skillOverrides` settings key with four values: `"on"` / `"name-only"` / `"user-invocable-only"` / `"off"`. v2.1.142 ships the matured editor. |
| Where is the user's choice saved? | `.claude/settings.local.json` under `skillOverrides` (the `localSettings` tier, gitignored). |
| Is it persisted? | **Yes** — written by `B6("localSettings", { skillOverrides: ... })` (`cli_inner_pretty.js:477008`). Survives restarts. Read by `m6().skillOverrides` on every Skill-tool invocation and on every render of the model-facing skill listing. |
| How does the UI interact? | Rich Ink dialog (`uJ4`): per-row state glyph, **Space** cycles 4-state ladder, **Enter** saves and closes, **`/`** focuses filter, **`t`** toggles sort, **Esc** cancels. Plugin-source / policy-locked / flag-locked / author-locked rows render `🔒 <label>` and refuse to cycle. |

---

## Evolution: v2.1.88 baseline → v2.1.142 interactive editor

| Aspect | v2.1.88 (`SkillsMenu.tsx`) | v2.1.142 (`uJ4` in `cli_inner_pretty.js:476909`) |
|--------|---------------------------|---------------------------------------------------|
| Mode | Read-only dialog | Read-write editor |
| Layout | Skills **grouped by source** (project / user / policy / plugin / mcp), each group titled with `Capitalized` source label + filesystem path subtitle | Single **flat list** of all skills, each row labels its own source inline |
| Per-skill data | `name · pluginName · ~tokens description tokens` | Glyph + state label + `name · sourceLabel · tokens · locked by X` |
| State editing | None — values are not tracked | Each row carries a state from the 4-state ladder; cycled in-memory until saved |
| Search | None | `/` enters filter mode, narrows by name/description/source (covered in [filter_search.md](./filter_search.md)) |
| Sort | Hard-coded by source then `localeCompare(name)` | Default: by source then `localeCompare(name)`. `t` toggles to **by-descending-token-cost** |
| Empty state | "No skills found" + `Esc to close` | "No skills found" + "Create skills in .claude/skills/ or ~/.claude/skills/" + `Esc` hint |
| Persistence | N/A | Diff-against-baseline save into `.claude/settings.local.json` |
| Plugin policy | Plugin skills appear under their own group | Plugin skills appear in the flat list AND a footer reminds: *"Plugin skills are managed via /plugin"* |
| Slash-command shape | `local-jsx`, `name: "skills"`, `description: "List available skills"`, `immediate: true` | Identical metadata (`eT5` / `UJ4` at `cli_inner_pretty.js:477231-477240`). Only the rendered component changed. |

The slash-command **registration shape stayed identical** — `type: "local-jsx"`, `immediate: true` — but the rendered React component swapped from the read-only `SkillsMenu` to the editor `uJ4`. The model never saw a change to the command surface; only the operator-facing UI changed.

---

## Component map (v2.1.142)

```
                  SLASH-COMMAND ENTRY
                  cli_inner_pretty.js:477231-477240
                  ┌──────────────────────────────────┐
                  │ eT5 = {                          │
                  │   type: "local-jsx",             │
                  │   name: "skills",                │
                  │   description: "List available   │
                  │                 skills",         │
                  │   immediate: true,               │
                  │   load: () => Promise.resolve()  │
                  │     .then(() => (pJ4(), BJ4)),   │
                  │ }                                │
                  └────────────┬─────────────────────┘
                               │
                               v
                  call(onExit, ctx)  ────────────────  tT5  @477218
                  ┌─────────────────────────────────────┐
                  │ <uJ4                                │
                  │   onExit={...}                      │
                  │   commands={ctx.options.commands}   │
                  │   bytesPerToken={                   │
                  │     sG(ctx.options.mainLoopModel)   │
                  │   }                                 │
                  │ />                                  │
                  └────────────┬────────────────────────┘
                               │
                               v
              ┌──────────────────────────────────────────────┐
              │              uJ4 (SkillsDialog)              │
              │              @476909                          │
              │                                              │
              │  filtered list ────► <SkillRow>  (sT5 @477137)│
              │       │                  │                   │
              │       │ Space            │ Glyph + Label     │
              │       v                  │ Name · Source     │
              │  cycle 4-state          │ Tokens · Lock     │
              │       │                                       │
              │       v                                       │
              │  Enter ─► C()  ─► B6("localSettings",        │
              │                       { skillOverrides: r }) │
              │             │                                 │
              │             └─► O4H()  (invalidate caches)    │
              └──────────────────────────────────────────────┘
```

---

## Keystroke map

| Key | Action (selection mode) | Action (filter mode) |
|-----|------------------------|----------------------|
| `Space` | Cycle the focused skill's state through `on → name-only → user-invocable-only → off → on` (no-op if locked) | typed into filter (Space is the only printable char the filter rejects) |
| `Enter` | Save diff to `.claude/settings.local.json`, invalidate caches, exit dialog | leave filter mode, keep query |
| `Esc` | Cancel — discard pending state changes, exit | clear query, return to selection mode |
| `/` | Enter filter mode (literal `/` is stripped, not appended) | typed into filter |
| `t` | Toggle sort: source/name ↔ descending token cost | typed into filter |
| any printable char | Enter filter mode, append char | typed into filter |
| `↓` / `↑` / list keys | Move focus | propagated to list controller |
| `Backspace` | Re-enter filter mode and pop one char (only if a query already exists) | typed into filter |

Bindings are not hard-coded — they read from the configurable shortcut system: `w1("select:accept", "Settings", "space")`, `w1("settings:close", "Settings", "enter")`, `w1("confirm:no", "Settings", "esc")`, `w1("settings:sortByTokens", "Settings", "t")` (`cli_inner_pretty.js:477017-477020`). Anywhere this doc says "Space"/"Enter"/"Esc"/"t", read as "the configured binding for that action."

The dispatcher only routes the four selection-mode actions when the filter input is NOT focused: `o6({ "select:accept": h, "settings:close": C, "settings:sortByTokens": () => _((c) => !c) }, { context: "Settings", isActive: !J && v.length > 0 })` (`cli_inner_pretty.js:477021-477023`). When the filter is focused, all printable input goes to the filter and only `Esc`/`Enter` toggle out.

---

## Per-row rendering (`sT5` at `cli_inner_pretty.js:477137`)

```
   ✓ on        | my-skill · project · 42 tok
   • name-only | other     · user    · 18 tok
   ○ user-only | sensitive · project · 95 tok          (warning color)
   ✗ off       | noisy     · user    · 210 tok         (error color)
   🔒 on       | claude-api · built-in · 30 tok · locked by author
```

| Element | Source |
|---------|--------|
| Glyph + colored label | `rT5[state]` — `sH.tick`/`bullet`/`circle`/`cross` (cli_inner_pretty.js:477209-477214) |
| `🔒 <label>` (replaces glyph+label when locked) | `K ? <Text dimColor>"🔒 " + label</Text> : <Text color>glyph + label</Text>` (cli_inner_pretty.js:477148-477150) |
| Skill name | `q.name` — colored `"suggestion"` when the row is focused (cli_inner_pretty.js:477162-477163) |
| Source label | `xJ4(source)` — `"plugin"` / `"mcp"` / `"built-in"` / `Bo(source)` (cli_inner_pretty.js:476897-476907) |
| Token count | `tXH(ZP$(skill, bytesPerToken)) + " tok"` — memoised on `(skill, bytesPerToken)` |
| `· locked by <source>` suffix | Appears only when the row carries a lock; `<source>` is one of `policy` / `flag` / `author` / `plugin` |

The lock origin (`f.get(c)` in the dialog, `K` in `sT5`) comes from `oT5` (`resolveSkillOverrideLock`) — see [skill_overrides.md](./skill_overrides.md#1-the-two-tier-resolver) for the precedence rules. Locked rows are silently no-op on Space (cli_inner_pretty.js:476984: `if (f.has(c)) return;`).

---

## Sort toggle (`t`)

```javascript
// ============================================
// SkillsDialog - sort comparator
// Location: cli_inner_pretty.js:476911-476925
// ============================================

// ORIGINAL (for source lookup):
A = By.useMemo(() => {
  let c = $.filter((l) =>
    l.type === "prompt" &&
    (l.loadedFrom === "skills" || l.loadedFrom === "commands_DEPRECATED" ||
     l.loadedFrom === "plugin" || l.loadedFrom === "mcp"),
  );
  if (K) {
    let l = new Map(c.map((r) => [r, ZP$(r)]));
    return c.sort((r, KH) => (l.get(KH) ?? 0) - (l.get(r) ?? 0) || m_(r).localeCompare(m_(KH)));
  }
  return c.sort((l, r) => String(l.source).localeCompare(String(r.source)) || m_(l).localeCompare(m_(r)));
}, [$, K]);

// READABLE (for understanding):
const sortedSkills = useMemo(() => {
  const skills = commands.filter((c) =>
    c.type === "prompt" &&
    (c.loadedFrom === "skills" || c.loadedFrom === "commands_DEPRECATED" ||
     c.loadedFrom === "plugin" || c.loadedFrom === "mcp"),
  );
  if (sortByTokens) {
    // Precompute tokens to avoid O(N log N) re-estimation inside the comparator
    const tokens = new Map(skills.map((s) => [s, estimateSkillTokens(s)]));
    return skills.sort((a, b) =>
      (tokens.get(b) ?? 0) - (tokens.get(a) ?? 0)
      || getCommandName(a).localeCompare(getCommandName(b)),
    );
  }
  return skills.sort((a, b) =>
    String(a.source).localeCompare(String(b.source))
    || getCommandName(a).localeCompare(getCommandName(b)),
  );
}, [commands, sortByTokens]);

// Mapping: A -> sortedSkills, K -> sortByTokens, $ -> commands,
//          ZP$ -> estimateSkillTokens, m_ -> getCommandName
```

Sort state (`K` / `sortByTokens`) lives in component state via `useState(false)` (cli_inner_pretty.js:476910). It is local to the dialog instance — **not persisted**. Each `/skills` invocation starts in source/name order.

Default order **groups skills implicitly** by source (`String(source).localeCompare(String(source))` sorts `bundled` < `builtin` < `mcp` < `plugin` < `project` < `user`), then by name within each source. This mimics the v2.1.88 explicit grouping without the visual section headers.

The token-sort mode is a triage tool: `t` quickly surfaces the most expensive skills so the user can toggle the largest offenders to `name-only` or `off` to reclaim context budget.

---

## Save algorithm (`C` at `cli_inner_pretty.js:476991-477016`)

```javascript
// ============================================
// SkillsDialog - the Enter handler that writes localSettings
// Location: cli_inner_pretty.js:476991-477016
// ============================================

// ORIGINAL (for source lookup):
C = () => {
  let c = new Set(Array.from(f.keys(), (qH) => qH.name)),
    l = new Set(c),
    r = {},
    KH = 0,
    HH = 0;
  for (let qH of A) {
    if (l.has(qH.name)) continue;
    l.add(qH.name);
    let a = O[qH.name] ?? "on",
      t = Y.get(qH.name) ?? "on",
      MH = z[qH.name] ?? t,
      wH = a === t ? void 0 : a;
    if (wH !== z[qH.name]) ((r[qH.name] = wH), KH++);
    if (a !== MH) HH++;
  }
  if (KH > 0) {
    let { error: qH } = B6("localSettings", { skillOverrides: r });
    if (qH) {
      H(`Failed to save skill overrides: ${qH.message}`, { display: "system" });
      return;
    }
    O4H();
  }
  H(HH > 0 ? `Updated ${HH} skill ${S8(HH, "override")}` : "No changes", { display: "system" });
};

// READABLE (for understanding):
const handleSave = () => {
  // Locked rows (policy/flag/author/plugin) never write — they are pre-seeded in `f`
  const locked = new Set([...lockedSkillByName.keys()].map((s) => s.name));
  const visited = new Set(locked);

  // `r` collects the diff to write to localSettings:
  //   - key absent  = no change vs current localSettings
  //   - value = override string (overrides project/user)
  //   - value = undefined ⇒ delete from localSettings (revert to project/user baseline)
  const diff = {};
  let changedKeys = 0;        // rows whose write changes localSettings
  let totalEdits = 0;         // rows whose final state differs from current effective state

  for (const skill of allSkills) {
    if (visited.has(skill.name)) continue;
    visited.add(skill.name);

    const inMemoryState   = pendingState[skill.name] ?? "on";
    const projectUserBase = projectOrUserOverride.get(skill.name) ?? "on";
    const currentEffective = localOverride[skill.name] ?? projectUserBase;

    // If the user picked back the project/user baseline, write `undefined`
    // (which downstream B6 deletes the key — `if (Y === void 0 ... delete O[f]`).
    const valueToWrite = inMemoryState === projectUserBase ? undefined : inMemoryState;

    if (valueToWrite !== localOverride[skill.name]) {
      diff[skill.name] = valueToWrite;
      changedKeys++;
    }
    if (inMemoryState !== currentEffective) totalEdits++;
  }

  if (changedKeys > 0) {
    const { error } = mergeIntoSettings("localSettings", { skillOverrides: diff });
    if (error) {
      onExit(`Failed to save skill overrides: ${error.message}`, { display: "system" });
      return;
    }
    invalidateSkillCaches();        // O4H() — clear command-listing memos
  }
  onExit(
    totalEdits > 0
      ? `Updated ${totalEdits} skill ${pluralize(totalEdits, "override")}`
      : "No changes",
    { display: "system" },
  );
};

// Mapping: C -> handleSave, f -> lockedSkillByName, A -> allSkills,
//          O -> pendingState, Y -> projectOrUserOverride, z -> localOverride,
//          r -> diff, B6 -> mergeIntoSettings, O4H -> invalidateSkillCaches,
//          S8 -> pluralize, KH -> changedKeys, HH -> totalEdits, H -> onExit
```

Three insights about this algorithm:

1. **Diff-against-baseline, not diff-against-disk.** The baseline is "what would the value be if the local override were absent" — that's the `projectSettings ?? userSettings` override resolved by `aT5`. If the user picks back the baseline value, the algorithm writes `undefined`, which `B6` (`mergeIntoSettings`, cli_inner_pretty.js:52440-52447) deletes from the JSON. This keeps `settings.local.json` clean: it never accumulates "redundant" entries that just re-state the project setting.

2. **Two counters.** `KH` (`changedKeys`) counts rows that write to disk; `HH` (`totalEdits`) counts rows whose final effective state differs from what was effective before. They diverge when a user picks back the baseline (writes a deletion = `changedKeys++`, but no semantic change relative to either prior or post effective state if previously absent) or toggles past the original and back. The "Updated N skill override(s)" toast reports `totalEdits`, so users see "No changes" when their toggles round-tripped.

3. **Cache invalidation is explicit** (`O4H()` at cli_inner_pretty.js:513823): it clears the four memoised caches `TE4.cache`, `gZ.cache`, `GTH.cache`, plus internal `zx5`/`qx5` clear hooks. The skill-listing functions used inside the system prompt construction (and the slash-command autocomplete) all read through these caches, so without explicit invalidation a freshly-toggled `off` skill would still appear in the model's listing until the cache TTL expired.

---

## Where the change lands on disk

```
.claude/settings.local.json     <-  /skills writes here
{
  "skillOverrides": {
    "noisy-bundled-skill": "off",
    "expensive-mcp-skill": "name-only",
    "internal-tool":       "user-invocable-only"
  }
}
```

Path resolution: `Vh("localSettings")` returns `.claude/settings.local.json` (cli_inner_pretty.js:52033-52034); the directory is `cwd` (cli_inner_pretty.js:52006-52007). The file is **per-project, per-machine, gitignored by convention**. Other tiers can also carry `skillOverrides` but are managed differently:

| Tier | Path | Who writes it | Precedence vs local |
|------|------|---------------|---------------------|
| `policySettings` | platform managed-settings.json (enterprise MDM) | admin | **higher** (overrides local, shown as `🔒 locked by policy`) |
| `flagSettings` | `--settings <path>` CLI flag | invoker of `claude` | **higher** (shown as `🔒 locked by flag`) |
| `localSettings` | `<cwd>/.claude/settings.local.json` | **`/skills` dialog**, manual JSON edit | this tier |
| `projectSettings` | `<cwd>/.claude/settings.json` | manual JSON edit (committed) | lower; dialog shows the value as the pre-fill baseline |
| `userSettings` | `~/.claude/settings.json` | manual JSON edit | lower; fallback baseline |

The dialog **only** writes `localSettings` (cli_inner_pretty.js:477008). To pin a value across machines for a team, edit `projectSettings` JSON directly. To pin across an enterprise, ship `policySettings` via managed config.

The runtime read path (`m6().skillOverrides` at cli_inner_pretty.js:513849) reads from `nx().settings`, which is the **merged** view across all tiers — so the in-memory `skillOverrides` map already reflects the final precedence by the time the Skill tool gates on it. Manual edits to `settings.local.json` take effect on the next `nx()` cache miss (most code paths re-read per turn).

---

## Plugin source — the read-only footer

```javascript
// cli_inner_pretty.js:477128-477133
A.some((c) => c.source === "plugin") &&
  $z.createElement(
    p,
    { marginTop: 1 },
    $z.createElement(k, { dimColor: true }, "Plugin skills are managed via /plugin"),
  ),
```

The footer renders only if at least one plugin skill is present. It is **purely informational** — plugin rows are already locked via `oT5` (`source: "plugin"`, value forced to `"on"`), so the cycle handler refuses to mutate them. The footer just makes the dual gate explicit so users do not waste keystrokes trying to toggle plugin skills off here when the right surface is `/plugin enable/disable`.

---

## Empty-state branch

When `A.length === 0` (no skills found at all) the dialog short-circuits to a minimal `<Dialog title="Skills">` containing:

> No skills found
> Create skills in .claude/skills/ or ~/.claude/skills/

Only the `Esc to close` shortcut is bound (`o6` registers no save/sort/space actions in this branch). This matches the v2.1.88 empty-state UX exactly — only the v2.1.88 wording of *"Create skills in .claude/skills/ or ~/.claude/skills/"* survives unchanged.

---

## Cross-references

- [skill_overrides.md](./skill_overrides.md) — the `skillOverrides` setting semantics, the four-state ladder, the lock-precedence resolver (`oT5` / `aT5`), and the Skill-tool runtime gate (`st` / `VE4` / `iP8`).
- [filter_search.md](./filter_search.md) — the v2.1.121 type-to-filter input, `xJ4` source-label normaliser.
- 2.1.88 baseline: `src/components/skills/SkillsMenu.tsx` (read-only) — kept under `/lyz/codespace/3rd/claude-code/`.
- `B6` / `mergeIntoSettings` (cli_inner_pretty.js:52420) — the generic settings-write helper that handles deep-merge, `undefined`→delete, and JSON-write-with-backup.
- `O4H` / `invalidateSkillCaches` (cli_inner_pretty.js:513823) — clears `TE4`, `gZ`, `GTH` command-listing memos so toggled overrides take effect immediately.
- `m6` / `mergedSettings` (cli_inner_pretty.js:52341-52343) — the merged-across-tiers view used by the Skill tool's runtime gate.
- `Vh` (cli_inner_pretty.js:52029) — the tier-to-relative-path mapper that pins `localSettings` to `.claude/settings.local.json`.
