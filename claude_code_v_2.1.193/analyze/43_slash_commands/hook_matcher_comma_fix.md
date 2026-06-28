# Hooks: comma-separated matchers now fire (v2.1.183 → v2.1.193)

> **Type / version:** FIX (changelog **2.1.191**) — "hooks with comma-separated matchers (e.g. `Bash,PowerShell`) were silently never firing".
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION 2.1.193, build a1938d2a). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged *(183)*.

---

## TL;DR

A hook can declare a `matcher` like `"Bash,PowerShell"` to fire on either tool. In v2.1.183 the matcher tester `qyf` (`cli_inner_pretty.js:577890`, *183*) accepted only **pipe**-separated names — its validation regex `/^[a-zA-Z0-9_|]+$/` **rejected the comma**, so `"Bash,PowerShell"` fell through to the *regex* branch and was compiled as `new RegExp("Bash,PowerShell")`, which never matches the tool name `"Bash"`. Result: the hook **silently never fired**, with no error.

v2.1.193 rewrites the tester as `hookMatcherMatches` (`s3f`, `cli_inner_pretty.js:589634`) with a new fourth parameter `allowComma`. When the hook event is a known event (`HOOK_EVENT_NAMES.has(hook_event_name)`, `cli_inner_pretty.js:589831`), the tester (a) widens the validation regex to allow commas and spaces (`/^[a-zA-Z0-9_|, ]+$/`) and (b) **splits on both pipe and comma** (`/[|,]/`). `grep -c "split(n ? /[|,]/"` = **0 in 183 → 1 in 193**. **FIX, confidence: high.**

---

## 1. The bug, precisely (183 before-picture)

```javascript
// ============================================
// hookMatcherMatches (183 before-picture) - pipe-only; comma falls through to a never-matching regex
// Location (183): cli_inner_pretty.js:577890-577907
// ============================================

// ORIGINAL (183, for source lookup):
function qyf(e, t, n) {
  if (!t || t === "*") return !0;
  if (/^[a-zA-Z0-9_|]+$/.test(t)) {            // <-- comma NOT allowed
    if (t.includes("|"))
      return t.split("|").flatMap((o) => wHt(eL(o.trim()), n)).includes(e);
    return wHt(eL(t), n).includes(e);
  }
  try {
    let r = new RegExp(t);                      // "Bash,PowerShell" lands here → /Bash,PowerShell/
    if (r.test(e)) return !0;                   // never true for e === "Bash"
    for (let o of Snn(e)) if (r.test(o)) return !0;
    for (let o of Enn(e, n)) if (r.test(o)) return !0;
    return !1;
  } catch { return (T(`Invalid regex pattern in hook matcher: ${t}`), !1); }
}

// READABLE (for understanding):
function hookMatcherMatches183(toolName, matcher, aliases) {
  if (!matcher || matcher === "*") return true;
  if (/^[a-zA-Z0-9_|]+$/.test(matcher)) {       // accepts letters/digits/_/| — but NOT comma
    if (matcher.includes("|"))
      return matcher.split("|").flatMap(s => resolveAliases(canonicalToolName(s.trim()), aliases)).includes(toolName);
    return resolveAliases(canonicalToolName(matcher), aliases).includes(toolName);
  }
  try {
    let re = new RegExp(matcher);               // "Bash,PowerShell" → never matches "Bash"
    /* ...regex + expanded-form fallbacks... */
  } catch { log(`Invalid regex pattern in hook matcher: ${matcher}`); return false; }
}

// Mapping(183): qyf→hookMatcherMatches183, e→toolName, t→matcher, n→aliases, wHt→resolveAliases, eL→canonicalToolName
```

The failure is *silent* because `new RegExp("Bash,PowerShell")` is a **valid** regex — it just never matches the literal tool name. There is no thrown error, no warning, no log line. The user writes a perfectly reasonable `"Bash,PowerShell"` matcher and the hook simply does nothing.

---

## 2. The fix: `hookMatcherMatches` (`s3f`) — comma-aware

**What it does.** Tests whether a tool name matches a hook matcher, now treating a comma as an alternation separator (equivalent to `|`) when the event allows it.

**How it works.**

```javascript
// ============================================
// hookMatcherMatches - comma-aware matcher test; FIX for "Bash,PowerShell" never firing
// Location: cli_inner_pretty.js:589634-589652
// ============================================

// ORIGINAL (for source lookup):
function s3f(e, t, n, r) {
  if (!t || t === "*") return !0;
  if ((n ? /^[a-zA-Z0-9_|, ]+$/ : /^[a-zA-Z0-9_|]+$/).test(t))
    return t.split(n ? /[|,]/ : "|").map((i) => i.trim()).filter(Boolean).flatMap((i) => Kcn(KL(i), r)).includes(e);
  try {
    let s = new RegExp(t);
    if (s.test(e)) return !0;
    for (let i of zcn(e)) if (s.test(i)) return !0;
    for (let i of Ycn(e, r)) if (s.test(i)) return !0;
    return !1;
  } catch { return (T(`Invalid regex pattern in hook matcher: ${t}`), !1); }
}

// READABLE (for understanding):
function hookMatcherMatches(toolName, matcher, allowComma, aliases) {
  if (!matcher || matcher === "*") return true;                          // empty/"*" matches everything
  if ((allowComma ? /^[a-zA-Z0-9_|, ]+$/ : /^[a-zA-Z0-9_|]+$/).test(matcher))  // (a) comma+space allowed when allowComma
    return matcher
      .split(allowComma ? /[|,]/ : "|")                                  // (b) FIX: split on pipe OR comma
      .map(s => s.trim())
      .filter(Boolean)                                                   // tolerate "Bash, PowerShell" (trailing space)
      .flatMap(s => resolveAliases(canonicalToolName(s), aliases))       // expand aliases per segment
      .includes(toolName);
  try {                                                                  // non-name-list → treat as regex (unchanged)
    let re = new RegExp(matcher);
    if (re.test(toolName)) return true;
    for (let form of toolNameVariants(toolName)) if (re.test(form)) return true;     // zcn
    for (let form of aliasVariants(toolName, aliases)) if (re.test(form)) return true; // Ycn
    return false;
  } catch { log(`Invalid regex pattern in hook matcher: ${matcher}`); return false; }
}

// Mapping: s3f→hookMatcherMatches, e→toolName, t→matcher, n→allowComma, r→aliases,
//          KL→canonicalToolName, Kcn→resolveAliases, zcn→toolNameVariants, Ycn→aliasVariants
```

Two changes versus 183, both keyed on the new `allowComma` flag:
1. **Validation regex widened** — `/^[a-zA-Z0-9_|, ]+$/` now admits commas *and* spaces, so `"Bash, PowerShell"` (with a tidy space) passes the name-list test instead of falling to the regex branch.
2. **Split on `/[|,]/`** — both pipe and comma become alternation separators, so `"Bash,PowerShell"` splits into `["Bash", "PowerShell"]`, each trimmed, alias-expanded, and checked for `includes(toolName)`.

A structural simplification rides along: 183 had a special-case `if (t.includes("|"))` plus a no-split fallback; 193 **always** goes through `.split(...).map(trim).filter(Boolean).flatMap(...)`, so a single-name matcher and a multi-name matcher take the same path. `.filter(Boolean)` is what makes `"Bash, "` (trailing separator) harmless.

---

## 3. Where `allowComma` comes from: the hook-event set `HOOK_EVENT_NAMES` (`o3f`)

The fourth argument is **not** a global toggle — it is computed per hook-lookup from whether the dispatched `hook_event_name` is a recognized event:

```javascript
// ============================================
// allowComma source - true when the dispatched event is a known hook event
// Location: cli_inner_pretty.js:589831 (the .has call) ; 591335 (the set)
// ============================================

// ORIGINAL (for source lookup):
let a = o3f.has(r.hook_event_name);
// ...
let u = (i ? s.filter((x) => !x.matcher || s3f(i, x.matcher, a, l)) : s).flatMap(...);
// o3f = new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionDenied", ...])

// READABLE (for understanding):
let allowComma = HOOK_EVENT_NAMES.has(payload.hook_event_name);     // o3f.has(...)
let toolAliases = ctx?.toolPermissionContext.toolAliases;           // l
let matched = (query
  ? matchers.filter(m => !m.matcher || hookMatcherMatches(query, m.matcher, allowComma, toolAliases))
  : matchers).flatMap(...);

// Mapping: o3f→HOOK_EVENT_NAMES, r→payload, s→matchers, i→query, l→toolAliases, s3f→hookMatcherMatches
```

`HOOK_EVENT_NAMES` (`o3f`, `cli_inner_pretty.js:591335`) is the Set of all hook events: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, … `InstructionsLoaded`.

**Why gate comma-splitting on the event being a known hook event.** Comma-as-alternation only makes sense for **tool-name** matchers — and tool-name matchers are exactly what the named hook events (`PreToolUse`, `PostToolUse`, …) carry. For other matcher domains (e.g. a `FileChanged` path matcher, handled in the same dispatcher at `cli_inner_pretty.js:589825`), a comma could be a *literal* character in a path/regex, so widening the split there would be wrong. Deriving `allowComma` from `HOOK_EVENT_NAMES.has(hook_event_name)` scopes the new behavior to precisely the tool-name matcher case where a comma list is the intended meaning, and preserves the legacy pipe-only semantics everywhere else.

**Key insight.** The fix is two characters of regex (`, ` added to the character class) plus one character in the split (`,` added to `/[|,]/`), but the *correctness* hinges on the `allowComma` plumbing: the change is opt-in per event, so it cannot accidentally reinterpret a comma in a non-tool-name matcher. The alias threading (`resolveAliases(canonicalToolName(segment), aliases)`) is unchanged in intent from 183 — only the obfuscated helper names moved (`wHt`→`Kcn`, `eL`→`KL`).

---

## Evidence note (FIX vs CARRYOVER)

| Token | 183 | 193 | Verdict |
|-------|-----|-----|---------|
| `split(n ? /[|,]/ : "|")` | 0 | 1 | NET-NEW (the comma split) |
| matcher tester signature | `qyf(e,t,n)` 3-arg, `:577890` | `s3f(e,t,n,r)` 4-arg, `:589634` | FIX (added `allowComma`) |
| validation regex | `/^[a-zA-Z0-9_|]+$/` only | `allowComma ? /^[a-zA-Z0-9_|, ]+$/ : …` | FIX (comma+space admitted) |
| `o3f.has(hook_event_name)` allowComma source | n/a | `:589831` | NET-NEW plumbing |
| alias expansion in matcher path | `wHt(eL(...))` | `Kcn(KL(...))` | CARRYOVER (re-mangled) |

Beware false-deltas: `x.matcher.split("|")` at `cli_inner_pretty.js:240472` is the **`FileChanged` watch-path** splitter, a *different* feature — not the tool-name hook matcher. All 193 lines re-read in the live bundle for this doc; anchors confirmed exactly as in the scout dossier.

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md), [rewind_before_clear.md](./rewind_before_clear.md), [plugin_auto_rename.md](./plugin_auto_rename.md), [cli_input_and_review_misc.md](./cli_input_and_review_misc.md).
- Hooks subsystem baseline (event dispatch, settings hook config, alias resolution): see the v2.1.183 hooks/permissions trees referenced from [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) and [../38_permissions/](../38_permissions/).

---

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (**Hooks**)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (hook dispatch / matchers)
> - per-feature additions: [symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md)

Key functions/constants in this document:

- `hookMatcherMatches` (obf `s3f`, `cli_inner_pretty.js:589634`) — comma-aware matcher test; 4th param `allowComma`; splits on `/[|,]/`.
- `HOOK_EVENT_NAMES` (obf `o3f`, `cli_inner_pretty.js:591335`) — Set of all hook events; source of `allowComma` via `.has(hook_event_name)` (`:589831`).
- `resolveAliases` (obf `Kcn`) / `canonicalToolName` (obf `KL`) (`cli_inner_pretty.js:589640`) — per-segment tool-alias expansion (183 `wHt`/`eL`).
- 183 predecessor `qyf` (`cli_inner_pretty.js:577890`, *183*) — 3-arg, pipe-only `/^[a-zA-Z0-9_|]+$/`, split on `"|"` only.
