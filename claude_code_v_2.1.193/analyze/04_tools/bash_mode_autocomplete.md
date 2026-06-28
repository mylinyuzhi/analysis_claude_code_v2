# Bash-mode live file-path autocomplete (the `!` input dropdown)

> **Type/version:** NET-NEW *wiring* in **v2.1.193** (the path-scan/fuzzy machinery it drives is CARRYOVER from the `@`-mention feature). Window: v2.1.183 → v2.1.193.
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

---

## TL;DR

When you type a `!` bash command in the prompt input, v2.1.193 now shows a **live, inline file-path dropdown** as you type a path-like token — the same drop-down that `@`-mentions have always used for directory navigation. The headline fact for a delta reviewer is that **almost nothing here is a new engine**: the path predicate (`isPathLikeToken`), the cached directory scanner (`scanDirectoryForCompletion`), and the fuzzy completer (`getPathCompletions`) are all **byte-identical carryover** from v2.1.183's `@`-mention path navigation. The genuine 193 delta is a **single new branch** in the debounced live-suggestion callback that detects bash mode, runs the carryover completer on the token under the cursor, and tags the resulting dropdown with the **net-new marker `"bash-path"`** (`grep -c '"bash-path"'` → 193=**5**, 183=**0**). Five sites total: one to open it, one to clear it, two to accept it (file vs directory), one to dismiss it when the mode flips away from bash.

This is a clean case of *feature reuse*: the at-mention path scanner was generalised to a second trigger surface with ~20 lines of wiring.

---

## 0. Before-picture (183): path completion was `@`-only, gated `i !== "bash"`

In v2.1.183 the live-suggestion callback's path-completion branch was **explicitly excluded from bash mode**. The only caller of the fuzzy path scanner `Xki` (183 `getPathCompletions`) was the `@`-mention branch, guarded by `Dt && i !== "bash"`:

```javascript
// ============================================
// (183) at-mention path branch — the ONLY path-completion caller, excludes bash
// Location (183): cli_inner_pretty.js:615555-615573
// ============================================

// ORIGINAL (183, for source lookup):
if (Dt && i !== "bash") {
  let Lt = J_e(Ue, Ht, !0);
  if (Lt && Lt.token.startsWith("@")) {
    let Zt = jPo(Lt);
    if (Yki(Zt)) {                              // Yki = isPathLikeToken (183)
      ee.current = Zt;
      let yn = await Xki(Zt, { maxResults: 10 });  // Xki = getPathCompletions (183)
      if (ee.current !== Zt) return;
      if (yn.length > 0) {
        (l((On) => ({ suggestions: yn, selectedSuggestion: ede(...), commandArgumentHint: void 0 })),
          (te.current = "at-path"),               // ← only "at-path", never "bash-path"
          S("directory"));
        return;
      }
    }
    ...
  }
}

// Mapping (183): Yki→isPathLikeToken, Xki→getPathCompletions, te.current→suggestionKind, S→setSuggestionType
```

So in 183, a path token typed after `!` got **no** live dropdown — it fell straight through to the bash history ghost-text suggester. Confirmation by grep: `"bash-path"` 183=0; `"at-path"` 183=2 / 193=2 (the at-mention surface is unchanged).

**Crucially, `Yki` (183 `isPathLikeToken`) and `Xki` (183 `getPathCompletions`) already existed** — they are the same functions the 193 bash branch reuses (see §2). The dossier initially classed the 193 predicate `dKr` as net-new; that is **wrong** — it is byte-identical carryover (§2, drift note).

---

## 1. The 193 delta: the new `mode === "bash"` branch in the live-suggestion callback

**What it does.** Inside the debounced live-suggestion callback `liveSuggestionCallback` (obfuscated: `se`, a `useCallback`), v2.1.193 adds a branch that fires *first* when the input is in bash mode and non-empty. It isolates the whitespace-delimited token ending at the cursor, and if that token looks like a path (or simply contains a `/`), it runs the carryover fuzzy completer and renders a directory-style dropdown tagged `"bash-path"`.

**How it works (step-by-step).**

```javascript
// ============================================
// liveSuggestionCallback — NET-NEW bash-mode path-autocomplete branch
// Location: cli_inner_pretty.js:629382-629401
// ============================================

// ORIGINAL (for source lookup):
if (i === "bash" && ze.trim()) {
  let Pt = ze.slice(0, tt).lastIndexOf(" ") + 1,
    Ft = ze.slice(Pt, tt);
  if (Ft && (dKr(Ft) || Ft.includes("/"))) {
    Z.current = Ft;
    let wn = await pKr(Ft, { maxResults: 10 });
    if (Z.current !== Ft) return;
    if (wn.length > 0) {
      (W(void 0),
        l((rn) => ({
          suggestions: wn,
          selectedSuggestion: Poe(rn.suggestions, rn.selectedSuggestion, wn),
          commandArgumentHint: void 0,
        })),
        (te.current = "bash-path"),
        H("directory"));
      return;
    }
  }
  if (S === "directory" && te.current === "bash-path") le();
  // … falls through to history ghost-text (Zic) …
}

// READABLE (for understanding):
if (mode === "bash" && input.trim()) {
  // token = the whitespace-delimited word ending at the cursor
  let tokenStart = input.slice(0, cursor).lastIndexOf(" ") + 1;
  let token = input.slice(tokenStart, cursor);
  if (token && (isPathLikeToken(token) || token.includes("/"))) {     // path-ish trigger
    lastPathQuery.current = token;                                    // stale-guard key
    let results = await getPathCompletions(token, { maxResults: 10 }); // carryover scanner
    if (lastPathQuery.current !== token) return;                      // a newer keystroke won — drop stale results
    if (results.length > 0) {
      clearGhostText(undefined);                                      // W(void 0): hide the inline ghost text
      setSuggestionState(prev => ({
        suggestions: results,
        selectedSuggestion: keepSelection(prev.suggestions, prev.selectedSuggestion, results),
        commandArgumentHint: undefined,
      }));
      suggestionKind.current = "bash-path";                          // ← NET-NEW marker
      setSuggestionType("directory");                                // render the directory-style dropdown
      return;
    }
  }
  // no path results: if a stale bash-path dropdown is showing, dismiss it
  if (suggestionType === "directory" && suggestionKind.current === "bash-path") dismiss();
  // … then the carryover bash-history ghost-text path (Zic) …
}

// Mapping: i→mode, ze→input, tt→cursor, dKr→isPathLikeToken, pKr→getPathCompletions,
//   Z.current→lastPathQuery, Poe→keepSelection, W→clearGhostText, te.current→suggestionKind,
//   H→setSuggestionType, S→suggestionType, le→dismiss, "bash-path"→bashPathMarker
```

**Why this approach.**

- **Token-by-cursor isolation, not a parser.** The branch finds the path token with `input.slice(0, cursor).lastIndexOf(" ") + 1` — i.e. "everything since the last space up to the cursor." For bash file arguments this is good enough and avoids invoking the full shell tokenizer on every keystroke. The cost is that it does not understand quoting/escapes inside a token, but a live *suggestion* is best-effort and the user can always ignore a bad guess.
- **The `|| token.includes("/")` widening.** `isPathLikeToken` only matches tokens that *begin* with a path sigil (`~/`, `/`, `./`, `../`, `~`, `.`, `..`). The extra `token.includes("/")` clause means a token like `src/comp` (no leading sigil, but clearly a relative sub-path being typed) *also* triggers completion. This is the one-line generalisation that makes the dropdown useful for ordinary relative paths, not just `./`-prefixed ones.
- **The stale guard is mandatory because the scan is async.** `lastPathQuery.current = token` before the `await`, then `if (lastPathQuery.current !== token) return` after it. Between issuing the `readdir` and its resolution the user may have typed more characters; without this guard a slow scan of `/u` could clobber the fresher dropdown for `/usr/l`. The ref-compare is the standard "last write wins" debounce-correctness pattern.

**Key insight.** The entire feature is *one early-return branch* placed **before** the bash history ghost-text fallback. Placement matters: a successful path dropdown `return`s, so history ghost-text only runs when there is no path completion to show — the two never fight over the same render slot. The `"bash-path"` tag is what lets the *accept* and *dismiss* handlers (below) tell a path dropdown apart from an at-mention dropdown or a slash-command dropdown.

---

## 2. The reused machinery (CARRYOVER — proven byte-identical to 183)

All three functions the branch calls predate 193. This is the adversarial core of the delta: do **not** count them as new.

### `isPathLikeToken` (`dKr`, :188582) — CARRYOVER (drift fix)

```javascript
// ============================================
// isPathLikeToken — does this token start with a path sigil?
// Location: cli_inner_pretty.js:188582-188591   (183: Yki @187417, byte-identical)
// ============================================

// ORIGINAL (for source lookup):
function dKr(e) {
  return (
    e.startsWith("~/") || e.startsWith("/") || e.startsWith("./") ||
    e.startsWith("../") || e === "~" || e === "." || e === ".."
  );
}

// READABLE (for understanding):
function isPathLikeToken(token) {
  return (
    token.startsWith("~/") || token.startsWith("/") || token.startsWith("./") ||
    token.startsWith("../") || token === "~" || token === "." || token === ".."
  );
}

// Mapping: dKr→isPathLikeToken, e→token
```

> **Drift fix (vs scout dossier).** The dossier classed `dKr` as a *net-new helper*, inferring "net-new" from `grep -c 'startsWith("~/")'` showing +1 in 193. That inference is wrong: 183 contains the **identical** function at `cli_inner_pretty.js:187417` (obf `Yki`), same 7-way OR, same body. Verified by reading both. The `startsWith("~/")` count differential (+1) comes from some *other* site, not this predicate — `dKr`/`Yki` is **CARRYOVER**. The only net-new symbol on the predicate side is the `"bash-path"` marker and the branch that calls `dKr`.

### `getPathCompletions` (`pKr`, :188612) and `scanDirectoryForCompletion` (`QOd`, :188593) — CARRYOVER

`getPathCompletions` splits the token into `{directory, prefix}`, calls the cached directory scanner, prefix-filters case-insensitively, caps at `maxResults`, and returns `{ id, displayText, metadata: { type } }` entries (directories get a trailing `/` in `displayText`). The scanner `scanDirectoryForCompletion` does a cached `readdir`, sorts **directories first then alphabetical**, caps at `DIRECTORY_SCAN_CAP` (`m4i` = 5000, :188641), and on failure logs `"Failed to scan directory for path completion"` and returns `[]`.

Proof of carryover (no need to re-quote the bodies):
- `"Failed to scan directory for path completion"` — `grep -c` → 183=1, 193=1.
- `includeHidden`/`includeFiles`/`maxResults: 10` destructure — present at 183:187449 and 193:188614, identical.
- The sole 183 caller of `Xki`/`getPathCompletions` was the at-mention branch (183:615561). In 193, `pKr` has **two** callers — the new bash branch (:629387) and the unchanged at-mention branch (:629620, still guarded `i !== "bash"`). That second-caller diff *is* the feature.

**Why reuse instead of writing a bash-specific completer.** A bash file argument and an `@`-mention path are the same problem: "given a partial path, list matching children." The at-mention scanner already handles `~` expansion, hidden-file filtering, the dirs-first ordering, the 5000-entry cap, and result caching. Writing a parallel implementation would duplicate all of that and risk drift (two completers disagreeing on, say, hidden-file handling). The trade-off accepted is a tiny coupling: a future change to at-mention completion semantics now also changes bash-mode completion — but for path listing that shared behaviour is desirable, not a hazard.

---

## 3. Accepting and dismissing a `bash-path` suggestion

The `"bash-path"` tag is read by the accept/dismiss handlers so a path dropdown behaves differently from a command-arg or at-mention dropdown.

```javascript
// ============================================
// bash-path accept — append "/" for dirs (keep navigating) or " " for files (done)
// Location: cli_inner_pretty.js:629693-629707
// ============================================

// ORIGINAL (for source lookup):
if (te.current === "bash-path") {
  let Rt = o.slice(0, s).lastIndexOf(" ") + 1,
    $t = Wze(tt.metadata) && tt.metadata.type === "directory",
    Pt = tt.displayText + ($t ? "" : " ");
  nt = o.slice(0, Rt) + Pt + o.slice(s);
  let Ft = Rt + Pt.length;
  if ((t(nt), r(Ft), $t)) se(nt, Ft);   // directory → re-run completion to descend
  else le();                            // file → dismiss
}

// READABLE (for understanding):
if (suggestionKind.current === "bash-path") {
  let tokenStart = input.slice(0, cursor).lastIndexOf(" ") + 1;
  let isDir = hasMetadata(entry.metadata) && entry.metadata.type === "directory";
  let inserted = entry.displayText + (isDir ? "" : " ");   // displayText already has trailing "/" for dirs
  let next = input.slice(0, tokenStart) + inserted + input.slice(cursor);
  let newCursor = tokenStart + inserted.length;
  setInput(next); setCursor(newCursor);
  if (isDir) liveSuggestionCallback(next, newCursor);       // descend into the directory
  else dismiss();                                           // file chosen — close dropdown
}

// Mapping: te.current→suggestionKind, o→input, s→cursor, Wze→hasMetadata, tt→entry,
//   $t→isDir, Pt→inserted, se→liveSuggestionCallback, le→dismiss
```

**What it does / why.** Accepting a **directory** inserts its name (whose `displayText` already ends in `/`) and then **re-invokes the live callback** (`se(nt, Ft)`) so the dropdown immediately repopulates with that directory's children — you can walk a tree with repeated Enter/Tab without retyping. Accepting a **file** appends a trailing space (the argument is complete) and dismisses. The same shape appears in the second accept path at `:629874-629882`. The dismiss-on-mode-flip site `:629650` (`S === "directory" && te.current === "bash-path" && i !== "bash"`) tears the dropdown down if the user leaves bash mode while it is open. These three behaviours are *only* reachable because the dropdown carries the `"bash-path"` discriminator — which is exactly why the marker had to be added.

---

## 4. NOT a delta: compgen/zsh Tab completion in bash mode (false delta)

A reviewer will see a lot of shell-completion code near the bash input and must not mistake it for new. The **compgen-based Tab completion** (distinct from the live inline path dropdown of §1) is **carryover**:

- `getShellCompletions` (`Uic`, :628313), `runShellCompletion` (`oYf`, :628299), `buildBashCompgenCommand` (`nYf`, :628283 — `compgen -f … | head -15 …`), `buildZshCompletionCommand` (`rYf`, :628291), the accept-time dispatcher `requestShellCompletion` (`DYf`, :629143), and the limit `SHELL_COMPLETION_LIMIT` (`MGo` = 15, :628324).
- `compgen -f` grep → 183=1, 193=1; `completionType` grep → 183=7, 193=7. Both unchanged.
- The shell detector `detectUserShell` (`Wpt`, :351210) is byte-identical to 183 `bat` — its 193=4/183=0 grep delta is a **rename artifact**, not a new function.

So bash mode had **Tab-driven** shell completion in 183 already; v2.1.193 adds the **live inline path dropdown** on top of it. Only the latter is the delta.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | 193 anchor | 183 grep-diff | Verdict |
|------|-----------|---------------|---------|
| `"bash-path"` marker | :629396 (+4 sites) | `"bash-path"` 193=5 / 183=0 | **NET-NEW** |
| bash-mode branch in `se` | :629382-629401 | branch absent in 183 (path branch guarded `i !== "bash"`) | **NET-NEW (wiring)** |
| second `pKr` caller | :629387 | 183 has 1 caller (at-mention); 193 has 2 | **NET-NEW (caller)** |
| `isPathLikeToken` (`dKr`) | :188582 | identical to 183 `Yki`@187417 | **CARRYOVER** |
| `getPathCompletions` (`pKr`) | :188612 | `"Failed to scan directory…"` 1=1 | **CARRYOVER** |
| `scanDirectoryForCompletion` (`QOd`) | :188593 | dirs-first scan + 5000 cap, 1=1 | **CARRYOVER** |
| compgen Tab completion | :628283-628324 | `compgen -f` 1=1, `completionType` 7=7 | **CARRYOVER (false delta)** |
| `detectUserShell` (`Wpt`) | :351210 | byte-identical to 183 `bat` | **CARRYOVER (re-mangle)** |

---

## Cross-links

- Sibling 193 docs: [`bash_input_respond.md`](./bash_input_respond.md) (the other bash-mode delta — `!` auto-respond), [`tool_surface_delta_193.md`](./tool_surface_delta_193.md), [`README.md`](./README.md).
- The `@`-mention path-navigation feature that this reuses is the pre-existing surface; no dedicated 193 doc (carryover). Its 183 callers are at `cli_inner_pretty.js:615555` (183).

---

## Related Symbols

> Symbol mappings live in the central index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools — this doc's home)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (CLI/input)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (UI/shell parser)
> - per-feature additions: [symbol_additions_v2_1_193_tools.md](../00_overview/symbol_additions_v2_1_193_tools.md)

Key functions in this document:
- `liveSuggestionCallback` (`se`) — debounced live-suggestion callback; the new `mode==="bash"` path branch is `:629382-629401`.
- `isPathLikeToken` (`dKr`, :188582) — CARRYOVER path-sigil predicate; 183 `Yki`@187417.
- `getPathCompletions` (`pKr`, :188612) — CARRYOVER fuzzy path completer; 183 `Xki`@187447.
- `scanDirectoryForCompletion` (`QOd`, :188593) — CARRYOVER cached dirs-first readdir; 183 `Amd`@187428.
- `bashHistoryGhostText` (`Zic`, :628803) — CARRYOVER history ghost-text fallback after the path branch.
- `getShellCompletions` (`Uic`, :628313) / `runShellCompletion` (`oYf`, :628299) / `buildBashCompgenCommand` (`nYf`, :628283) / `buildZshCompletionCommand` (`rYf`, :628291) / `requestShellCompletion` (`DYf`, :629143) — CARRYOVER compgen/zsh Tab completion.
- `detectUserShell` (`Wpt`, :351210) — CARRYOVER (re-mangled from 183 `bat`).
- `"bash-path"` marker / `DIRECTORY_SCAN_CAP` (`m4i`=5000, :188641) / `SHELL_COMPLETION_LIMIT` (`MGo`=15, :628324).
