# `teammateMode: "iterm2"` — the explicit iTerm2 pane pin

> **Type / version:** NET-NEW capability (2.1.186) — a fourth, user-settable `teammateMode` enum value that *forces* the iTerm2 pane backend, plus two actionable warning strings and an auto-mode fallback hint.
> **Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` below is a **193** line unless tagged `(183)` or `(88)`.
> **Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.

---

## TL;DR

Before 2.1.186 the iTerm2 split-pane backend could only be selected **implicitly**, by auto-detection: if `teammateMode` was `"auto"` and you happened to be inside iTerm2 with the `it2` CLI installed, the BackendRegistry would pick iTerm2 on its own. You could not *pin* it. 2.1.186 adds the explicit enum value `"iterm2"` to `teammateMode` across the whole surface — the settings schema, the settings-UI dropdown, the `--teammate-mode` CLI flag (help text + `.choices()` + the parser) — and adds a dedicated short-circuit branch at the top of the backend-detection function that **forces** the iTerm2 backend and throws one of two new, actionable errors when the environment cannot satisfy it (not in iTerm2 / `it2` CLI unreachable). The iTerm2 backend class, the BackendRegistry, and the auto-detection path itself are all **carryover** that pre-date 183; the *explicit pin* (the new enum value + the new branch + the two warnings + the auto-mode fallback hint) is the 193-window delta.

---

## 1. The enum value `"iterm2"` is new across every surface

**What it does.** `teammateMode` is the user-facing setting that decides *how* a spawned teammate process is hosted: `"in-process"` (an AsyncLocalStorage runner inside the leader), `"tmux"` (a tmux split-pane running the child binary), `"iterm2"` (an iTerm2 split-pane via the `it2` Python-API CLI), or `"auto"` (detect the best available). The literal `"iterm2"` is a **new admissible value** of that enum in 2.1.186.

**How it works.** A single module-level constant holds the canonical list, and every consumer (schema, UI options, CLI choices, CLI parser) reads or mirrors it:

```javascript
// ============================================
// EXEC_MODE_ENUM - the teammateMode value list (gains "iterm2")
// Location: cli_inner_pretty.js:54136
// ============================================

// ORIGINAL (for source lookup):
(uhs = ["auto", "tmux", "iterm2", "in-process"]),

// READABLE (for understanding):
EXEC_MODE_ENUM = ["auto", "tmux", "iterm2", "in-process"], // 183: ["auto","tmux","in-process"] (no iterm2)

// Mapping: uhs→EXEC_MODE_ENUM
```

The settings schema reads `uhs` directly and updates its human-readable `describe()`:

```javascript
// ============================================
// teammateMode settings schema - enum(uhs) + updated describe()
// Location: cli_inner_pretty.js:56919-56922
// ============================================

// ORIGINAL (for source lookup):
teammateMode: A.enum(uhs)
  .optional()
  .catch(void 0)
  .describe("How spawned teammates execute (tmux, iterm2, in-process, auto)"),

// READABLE (for understanding):
teammateMode: zod.enum(EXEC_MODE_ENUM)
  .optional()
  .catch(undefined)                                                   // unknown value → undefined (forward-compat)
  .describe("How spawned teammates execute (tmux, iterm2, in-process, auto)"), // 183 omitted "iterm2"

// Mapping: A→zod, uhs→EXEC_MODE_ENUM
```

The same `"iterm2"` literal also lands in the settings-UI dropdown (`options: ["auto", "tmux", "iterm2", "in-process"]`, `cli_inner_pretty.js:488457`), the `--teammate-mode` flag help and choices, and the CLI parser:

```javascript
// ============================================
// --teammate-mode CLI flag - help + choices + parse normalization (all add "iterm2")
// Location: cli_inner_pretty.js:714421 (help), 714422 (choices), 714758 (parse)
// ============================================

// ORIGINAL (for source lookup):
new _c("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "iterm2", "in-process", or "auto"')
  .choices(["auto", "tmux", "iterm2", "in-process"])
// ... later, normalizing a passed value n:
teammateMode: n === "auto" || n === "tmux" || n === "iterm2" || n === "in-process" ? n : void 0,

// READABLE (for understanding):
new CliOption("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "iterm2", "in-process", or "auto"')
  .choices(["auto", "tmux", "iterm2", "in-process"])                   // 183: choices lacked "iterm2"
// parse: only accept a known value, else drop to undefined
teammateMode: ["auto","tmux","iterm2","in-process"].includes(n) ? n : undefined, // 183 rejected "iterm2"

// Mapping: _c→CliOption, n→passedModeString
```

**Why this matters (the carryover boundary).** In 183 the parser (`(183) cli_inner_pretty.js:695523`) read `n === "auto" || n === "tmux" || n === "in-process"` — so even if a user *wrote* `teammateMode: "iterm2"` into settings, it was **rejected** (normalized to `undefined`) and the schema enum (`(183) Its`, `cli_inner_pretty.js:53727 = ["auto","tmux","in-process"]`) did not list it. The value was genuinely unrepresentable. The 88 ancestor confirms this was never a thing even at baseline: `(88) utils/swarm/backends/registry.ts` `getTeammateMode(): 'auto' | 'tmux' | 'in-process'` — no `iterm2`. The enum widening is therefore a true 2.1.186 net-new, not a re-mangle.

---

## 2. The explicit-iterm2 detection branch (the heart of the delta)

**What it does.** `detectAndGetBackend` (`kPe`, `cli_inner_pretty.js:429186`) is the BackendRegistry's "pick a teammate executor" routine. 2.1.186 inserts a new branch at the very top — right after the cached-result short-circuit and the `"Starting backend detection..."` log — that fires **only** when the snapshot teammate mode is exactly `"iterm2"`. In that branch the function does not run the usual auto-detection heuristics at all: it *forces* the iTerm2 backend, or throws.

**How it works (step by step).**

```javascript
// ============================================
// detectAndGetBackend - explicit teammateMode==="iterm2" branch (NEW in 2.1.186)
// Location: cli_inner_pretty.js:429192-429213
// ============================================

// ORIGINAL (for source lookup):
if ((T("[BackendRegistry] Starting backend detection..."), zRe() === "iterm2")) {
  if (!R8())
    throw (
      Re("swarm_backend_detect", "iterm2_explicit_not_in_iterm2"),
      Error(
        'teammateMode is set to "iterm2" but this session is not running inside iTerm2. Launch Claude from iTerm2, or change teammateMode in settings.',
      )
    );
  if (!(await Rft()))
    throw (
      Re("swarm_backend_detect", "iterm2_explicit_no_it2"),
      Error(
        'teammateMode is set to "iterm2" but the it2 CLI is not reachable. Install it with `pip install it2` and enable the Python API in iTerm2 (Preferences > General > Magic > Enable Python API).',
      )
    );
  T("[BackendRegistry] Selected: iterm2 (explicit teammateMode)");
  let o = svo(e);
  return (
    (e.cachedBackend = o),
    (e.cachedDetectionResult = { backend: o, isNative: !0, needsIt2Setup: !1 }),
    Ie("swarm_backend_detect"),
    e.cachedDetectionResult
  );
}

// READABLE (for understanding):
if ((log("[BackendRegistry] Starting backend detection..."), getTeammateModeFromSnapshot() === "iterm2")) {
  // 1. Guard: must actually be running inside iTerm2 (env check, no it2 needed).
  if (!isInsideITerm2())
    throw (recordSwarmOpFailure("swarm_backend_detect", "iterm2_explicit_not_in_iterm2"),
      Error('teammateMode is set to "iterm2" but this session is not running inside iTerm2. ...'));
  // 2. Guard: the it2 Python-API CLI must be reachable (spawns `it2 session list`).
  if (!(await isIt2CliReachable()))
    throw (recordSwarmOpFailure("swarm_backend_detect", "iterm2_explicit_no_it2"),
      Error('teammateMode is set to "iterm2" but the it2 CLI is not reachable. Install it with `pip install it2` ...'));
  // 3. Force the iTerm2 backend, bypassing all auto-detect heuristics; cache & return.
  let backend = createITermBackend(registry);
  recordSwarmOpSuccess("swarm_backend_detect");
  return (registry.cachedBackend = backend,
          registry.cachedDetectionResult = { backend, isNative: true, needsIt2Setup: false });
}

// Mapping: kPe→detectAndGetBackend, zRe→getTeammateModeFromSnapshot, R8→isInsideITerm2, Rft→isIt2CliReachable,
//          svo→createITermBackend, Re→recordSwarmOpFailure, Ie→recordSwarmOpSuccess, e→registry, o→backend
```

1. **`zRe() === "iterm2"`** — `getTeammateModeFromSnapshot` reads the captured teammate mode (default `$jt = "in-process"`, `cli_inner_pretty.js:302920`). Only an explicit `"iterm2"` setting enters this branch; `"auto"` falls through to the (carryover) heuristic detector below.
2. **`!R8()` → throw warning A.** `isInsideITerm2` (`cli_inner_pretty.js:363523`) is a cached env probe: `TERM_PROGRAM === "iTerm.app" || !!ITERM_SESSION_ID || terminal === "iTerm.app"`. If you pinned iTerm2 but are not actually in iTerm2, you get a *specific* error telling you to launch from iTerm2 or change the setting — not a silent fallback.
3. **`!(await Rft())` → throw warning B.** `isIt2CliReachable` (`cli_inner_pretty.js:363533`) runs `command -v it2` in the login shell, then `it2 session list`; it returns `false` (with a Python-API-disabled hint logged) if the API isn't enabled. The binary name is the constant `xft = "it2"` (`cli_inner_pretty.js:363571`). Warning B tells you exactly how to fix it (`pip install it2` + enable the Python API).
4. **Force + cache.** `svo(e)` (`createITermBackend`, `cli_inner_pretty.js:429181`) instantiates the registered `ITermBackend` class (`rvo`, `cli_inner_pretty.js:429024`; `type="iterm2"`, `displayName="iTerm2"`), the result is cached as `{ backend, isNative: true, needsIt2Setup: false }`, and detection short-circuits.

**Why a hard-throw branch instead of "pin, but fall back to auto on failure".** The whole point of an *explicit* pin is determinism. The two design choices that matter:

- **Throw, don't degrade.** If a user has deliberately set `teammateMode: "iterm2"`, silently dropping to in-process (the way `"auto"` would) would hide a misconfiguration — they'd think teammates were running in iTerm2 panes when they weren't. Throwing an actionable error surfaces the exact missing prerequisite (not in iTerm2 vs `it2` missing) so the user can fix the *cause*. This is the inverse of the `"auto"` philosophy (which *must* degrade gracefully because the user expressed no preference).
- **Two distinct error reasons, both telemetered.** The branch splits the failure into `iterm2_explicit_not_in_iterm2` and `iterm2_explicit_no_it2` (the `Re("swarm_backend_detect", …)` tags) rather than one generic "iTerm2 unavailable". This makes the two remedies (relaunch vs install) separable both for the user (different message) and for analytics (different telemetry status), at the cost of one extra branch.

**Key insight.** The branch is placed **above** the auto-detect heuristics, and it is the *only* code path that can select iTerm2 *without consulting `isAvailable()`*. Auto-mode still reaches iTerm2 the old way (carryover), but only the explicit branch can produce a *hard error* — auto-mode never throws, it falls back (see §3). So the new enum value doesn't just add an option; it adds a fundamentally different *failure contract* (fatal vs fallback) keyed entirely on whether the user pinned the mode.

---

## 3. The auto-mode fallback hint (`emitPaneFallbackHint`, `iXp`)

**What it does.** Distinct from the explicit branch: when `teammateMode` is `"auto"` (or otherwise pane-eligible) and opening a pane *fails*, the runner degrades to in-process and emits a one-time hint telling the user how to *force* panes next time. 2.1.186 adds the iTerm2 arm of that hint.

**How it works.**

```javascript
// ============================================
// emitPaneFallbackHint - one-shot "how to force panes" notification (iterm2 arm is NEW)
// Location: cli_inner_pretty.js:429964-429972
// ============================================

// ORIGINAL (for source lookup):
function iXp(e) {
  if (Dil) return;
  Dil = !0;
  let t = R8()
    ? 'To force iTerm2 panes, set teammateMode: "iterm2" in settings and enable the iTerm2 Python API (Preferences > General > Magic).'
    : 'To use terminal panes, set teammateMode: "tmux" in settings.';
  e?.({ type: "notification", notification: { /* ... */ } });
}

// READABLE (for understanding):
function emitPaneFallbackHint(emit) {
  if (paneFallbackHintShown) return;                 // one-shot: only nag once per session
  paneFallbackHintShown = true;
  let hint = isInsideITerm2()                         // R8: are we in iTerm2 right now?
    ? 'To force iTerm2 panes, set teammateMode: "iterm2" in settings and enable the iTerm2 Python API (Preferences > General > Magic).'
    : 'To use terminal panes, set teammateMode: "tmux" in settings.';
  emit?.({ type: "notification", notification: { /* hint text */ } });
}

// Mapping: iXp→emitPaneFallbackHint, Dil→paneFallbackHintShown, R8→isInsideITerm2, e→emit
```

**Why branch the hint on `R8()`.** The hint is *context-aware*: if pane-spawn failed but you *are* in iTerm2, the most useful advice is "pin iterm2 + enable the Python API" (because that's now a real, supported option) — that arm of the hint did not exist in 183 because the `"iterm2"` setting itself did not exist. If you are *not* in iTerm2, the only pane backend available is tmux, so it points you there instead. The `Dil` one-shot guard keeps it from nagging on every spawn. This is the user-discovery counterpart to §2: the explicit pin is only useful if users learn it exists, and the auto-mode fallback is exactly the moment a user is most receptive to "here's how to make panes work."

---

## 4. Evidence: NET-NEW vs CARRYOVER (183 grep-diff)

| Signal | 183 | 193 | Verdict |
|---|---:|---:|---|
| enum `["auto","tmux","iterm2","in-process"]` (schema/UI/choices) | 0 | 3 | NET-NEW |
| `'teammateMode is set to "iterm2"'` (two distinct messages) | 0 | 2 | NET-NEW |
| `'it2 CLI is not reachable'` | 0 | 1 | NET-NEW |
| `'To force iTerm2 panes'` (iterm2 arm of fallback hint) | 0 | 1 | NET-NEW |
| `"iterm2"` literal (whole bundle) | 9 | 20 | widened |
| `ITermBackend` class / iTerm2 backend subsystem | present | present | CARRYOVER |
| auto-detect error `"iTerm2 detected but it2 CLI not installed…"` | 1 | 1 | CARRYOVER |

Re-verified in the live 193 bundle: `uhs`@54136, schema enum@56919 + describe@56922, UI options@488457, flag help@714421, choices@714422, parser@714758, `kPe`@429186, the explicit branch + two warnings@429192-429213, `R8`@363523, `Rft`@363533, `xft`@363571, `svo`@429181, `rvo`@429024, `zRe`@302915 (`$jt="in-process"`@302920), `iXp`@429964. 183 counts confirmed against the 183 bundle (`Its`@53727, parser@695523, all four NET-NEW strings = 0 in 183).

**Carryover precision.** The iTerm2 backend class, the BackendRegistry singleton, the `createTeammatePaneInSwarmView` method, and the *auto-detection* path (the heuristic detector that `"auto"` still uses) are all carryover that pre-date 183 — the auto-detect error `"iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2"` is byte-identical in both bundles. Do **not** attribute the iTerm2 backend itself to 2.1.186; only the *explicit pin* (enum value + the `kPe` branch + the two warnings + the iterm2 arm of `iXp`) is the delta. The 183 detection function (`(183) eLe`, `cli_inner_pretty.js:422316`) is the same shape as 193 `kPe` **minus** the new top branch.

---

## Cross-links

- Sibling 193 docs: [`effort_inheritance.md`](./effort_inheritance.md) (the pane-spawn command builders `pil`/`Mil` that this backend drives also gained `--effort`), [`stop_attribution.md`](./stop_attribution.md), [`README.md`](./README.md).
- v2.1.183 baseline for the backend abstraction (unchanged carryover): [`../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/spawn_backends_and_tmux_fix.md) and the BackendRegistry two-mode split in [`../../../claude_code_v_2.1.183/analyze/30_agent_team/README.md`](../../../claude_code_v_2.1.183/analyze/30_agent_team/README.md).

---

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Agent/Tools/State)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Agent Team / swarm** is the home module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (CLI flags, settings UI)
> - [../00_overview/symbol_additions_v2_1_193_agent_team.md](../00_overview/symbol_additions_v2_1_193_agent_team.md) — the granular 193 additions for this module

Key functions/constants in this doc:

- `EXEC_MODE_ENUM` (obfuscated: `uhs`, `cli_inner_pretty.js:54136`) — `["auto","tmux","iterm2","in-process"]`; 183 `Its` lacked `"iterm2"`.
- `detectAndGetBackend` (obfuscated: `kPe`, `cli_inner_pretty.js:429186`) — BackendRegistry detector; new explicit-iterm2 branch @429192-429213. 183 predecessor `eLe` (`(183) :422316`).
- `getTeammateModeFromSnapshot` (obfuscated: `zRe`, `cli_inner_pretty.js:302915`) — default `$jt="in-process"` (`:302920`).
- `isInsideITerm2` (obfuscated: `R8`, `cli_inner_pretty.js:363523`) — env probe (`TERM_PROGRAM`/`ITERM_SESSION_ID`/`terminal`).
- `isIt2CliReachable` (obfuscated: `Rft`, `cli_inner_pretty.js:363533`) — `command -v it2` + `it2 session list`; binary const `IT2_BIN` (`xft`, `:363571`).
- `createITermBackend` (obfuscated: `svo`, `cli_inner_pretty.js:429181`) / `ITermBackend` class (obfuscated: `rvo`, `cli_inner_pretty.js:429024`).
- `emitPaneFallbackHint` (obfuscated: `iXp`, `cli_inner_pretty.js:429964`) — one-shot auto-mode fallback hint; iterm2 arm new.
