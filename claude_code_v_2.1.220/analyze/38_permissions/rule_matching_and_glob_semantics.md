# Rule matching: `dir/**` semantics, matcher caching, and where rules are stored

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline lines are tagged `(193)`.

Path-scoped permission rules (`Edit(src/**)`, `Read(~/notes/**)`, `deny: Edit(.env)`) are matched with
the **gitignore engine**, not with a bespoke glob matcher. That single implementation choice is the source
of the `.214` bug, the `.208` performance bug, and the `.207` malformed-pattern bug — three bullets,
one root cause. This document works through the matcher, then the two storage-location changes
(`.211` worktree roots) and the pattern-hygiene layer (`.207`).

---

## 1. `.214`: single-segment `dir/**` was matching at any depth

Two bullets, one six-line function:

> `.214`: *"Fixed single-segment `dir/**` allow rules like `Edit(src/**)` auto-approving writes to nested
> `dir/` directories anywhere in the tree instead of only `<cwd>/dir`"*
>
> `.214`: *"Changed single-segment `dir/**` hook `if:` conditions to match only `<cwd>/dir`; write
> `**/dir/**` for any-depth matching. `deny`/`ask` permission rules keep their any-depth match."*

**Verdict: NET_NEW.** `r.includes("/") || !t` is 220=1 (`:528459`) / 193=0.

### The bug

A permission rule's path pattern is fed to the `ignore` package, which implements **gitignore
semantics**. The relevant gitignore rule is:

> A pattern containing no `/` (other than a trailing one) matches at any depth.
> A pattern containing a `/` is anchored to the directory holding the `.gitignore`.

2.1.193 normalised `dir/**` by stripping the trailing `/**`:

```javascript
// 2.1.193 — inline in fv() at :586267-586274, and duplicated in $Se() at :586294-586297
let y = h;
if (y.endsWith("/**")) {
  let b = y.slice(0, -3);
  y = /[^/]/.test(b) ? b : "/**";
}
```

`Edit(src/**)` therefore became the pattern `src`. No slash ⇒ any-depth ⇒ the rule matched
`vendor/foo/src/anything`. For an **allow** rule that is a privilege escalation: a rule intended to permit
edits under `./src` permitted edits under any directory named `src` anywhere in the tree, including inside
a dependency checkout or an added directory.

### The fix

```javascript
// ============================================
// normalizeDirGlobForIgnoreEngine - the whole dir/** anchoring fix
// Location: cli_inner_pretty.js:528456-528462
// ============================================

// ORIGINAL (for source lookup):
function yap(e, t) {
  if (e.endsWith("/**")) {
    let r = e.slice(0, -3);
    return /[^/]/.test(r) ? (r.includes("/") || !t || /^[!#]/.test(r) ? r : "/" + r) : "/**";
  }
  return e;
}

// READABLE (for understanding):
function normalizeDirGlobForIgnoreEngine(pattern, anchorAtRoot) {
  if (pattern.endsWith("/**")) {
    let stem = pattern.slice(0, -3);                       // "src/**"  ->  "src"
    if (!/[^/]/.test(stem)) return "/**";                   // pattern was only slashes: match everything
    if (stem.includes("/")) return stem;                    // already multi-segment: gitignore anchors it
    if (!anchorAtRoot) return stem;                         // deny/ask: keep legacy any-depth match
    if (/^[!#]/.test(stem)) return stem;                    // '!'/'#' are gitignore sigils; a leading
                                                            // '/' would move them off position 0
    return "/" + stem;                                      // allow / hook if: anchor to <root>/src
  }
  return pattern;
}

// Mapping: yap→normalizeDirGlobForIgnoreEngine, e→pattern, t→anchorAtRoot, r→stem
```

### The asymmetry, and why it is deliberate

`yap`'s second argument is supplied differently at each of its two call sites:

| call site | second argument | effect |
|---|---|---|
| `:528493` — inside `s9s`'s lazy matcher builder | `r === "allow"` | **allow** rules anchor; **deny**/**ask** rules keep any-depth |
| `:528541` — inside `Cze`, the hook `if:` evaluator | `!0` (always) | hook `if:` conditions always anchor |

That is exactly the changelog's promise, and the reasoning is a **fail-safe direction argument**:

- An over-broad **allow** rule grants privilege the user did not intend ⇒ narrowing it is safe, widening
  it is not. Anchor it, and accept that some users' existing rules stop matching (a visible, recoverable
  failure: a prompt appears).
- An over-broad **deny**/**ask** rule *withholds* privilege ⇒ narrowing it would silently remove a
  protection the user believes they have. Leaving `deny: Edit(secrets/**)` matching at any depth is
  strictly the safer error, so the legacy behaviour is preserved and the changelog documents the
  workaround (`**/dir/**`) for the other direction.
- Hook `if:` conditions are **not a permission grant** — they select which hook fires. There is no
  fail-safe direction, so the more predictable semantics (anchored, like a normal path) wins outright.

The `/^[!#]/` guard is the sort of detail that only shows up in a real implementation. In gitignore, a
leading `!` negates and a leading `#` comments; both are **positional**. Rewriting `!tmp` to `/!tmp`
would turn a negation into a literal path named `!tmp`. So single-segment patterns starting with those
characters keep their any-depth semantics rather than being silently re-meaninged. Note the companion
sanitiser `gap` (§4) escapes a *BOM*-prefixed `!`/`#` for the same reason.

### The lookup side had to change too

`yap` rewrites the pattern *given to the engine*, but the engine reports back the pattern that matched —
now `"/src"`, while the rule map is keyed on the original `"src/**"`. `B0` (`:528512-528535`) handles the
round trip:

```javascript
// ============================================
// findMatchingPathRule - resolves an engine match back to the rule that produced it
// Location: cli_inner_pretty.js:528519-528535
// ============================================

// ORIGINAL (for source lookup):
  for (let [c, { patternMap: u, getIg: d }] of i.entries()) {
    let p = c ?? Ht(),
      f = v2t(s ? Ny(p) : p, l);
    if (!f || !jfn.default.isPathValid(f)) continue;
    let m = d().test(f);
    if (m.ignored && m.rule) {
      let g = m.rule.pattern,
        y = g + "/**";
      if (u.has(y) && (g.includes("/") || n !== "allow")) return u.get(y) ?? null;
      if (g.startsWith("/")) {
        let _ = g.slice(1) + "/**";
        if (u.has(_)) return u.get(_) ?? null;
      }
      return u.get(g) ?? null;
    }
  }
  return null;

// READABLE (for understanding):
  for (let [root, { patternMap, getIg }] of matchersByRoot.entries()) {
    let base = root ?? getSessionCwd(),
      relative = posixRelative(caseFold ? lower(base) : base, target);
    if (!relative || !ignore.isPathValid(relative)) continue;      // NEW: library-provided validity check
    let result = getIg().test(relative);
    if (result.ignored && result.rule) {
      let matched = result.rule.pattern,                            // e.g. "/src"  or  "src"
        withGlob = matched + "/**";
      if (patternMap.has(withGlob) && (matched.includes("/") || behavior !== "allow"))
        return patternMap.get(withGlob) ?? null;                    // legacy any-depth key
      if (matched.startsWith("/")) {                                // NEW: anchored form
        let unanchored = matched.slice(1) + "/**";                  // "/src" -> "src/**"
        if (patternMap.has(unanchored)) return patternMap.get(unanchored) ?? null;
      }
      return patternMap.get(matched) ?? null;
    }
  }
  return null;

// Mapping: B0→findMatchingPathRule, v2t→posixRelative, Ny→lower, Ht→getSessionCwd,
//          jfn→ignore, u→patternMap, d→getIg, n→behavior
```

Two changes relative to 2.1.193's `fv` (`:586266-586287 (193)`):

1. **The `g.startsWith("/")` fallback (`:528528-528531`) is new** and is mandatory: without it, an
   anchored allow rule would match the path and then fail to resolve back to a rule object, returning
   `null` — i.e. the fix would have *silently disabled* every single-segment allow rule instead of
   narrowing it.
2. **`(g.includes("/") || n !== "allow")` was added to the first lookup.** 193 read
   `if (u.has(y)) return u.get(y) ?? null;`. The extra conjunct stops an *unanchored* match from
   resolving to an allow rule — belt-and-braces against a pattern that reached the engine unanchored for
   any reason.
3. **Path validity moved from string tests to the library.** 193 used
   `if (!m || m === ".." || m.startsWith("../")) continue;`; 220 uses
   `if (!f || !jfn.default.isPathValid(f)) continue;`. `isPathValid` is 220=4 / 193=1 — in 193 the export
   existed (`:151396 (193)`) but was never called from the permission matcher. Delegating removes a
   hand-rolled traversal check that only covered `..` at the start.

---

## 2. `.208`: matcher compilation is now cached

> `.208`: *"Fixed multi-second per-turn slowdowns in sessions with many permission deny/ask rules — rule
> matchers are now compiled once and cached."*

**Verdict: NET_NEW.** Two independent caches were added, and the changelog bullet describes only one of
them. Both are visible as 220=1 / 193=0 anchors.

### 2a. The compiled-matcher cache (`r9s`, `s9s`)

```javascript
// ============================================
// buildPathRuleMatchers - LRU-cached, root-partitioned matcher compilation
// Location: cli_inner_pretty.js:528463-528510
// ============================================

// ORIGINAL (for source lookup):
function s9s(e, t, r) {
  let n = r === "deny" ? e.alwaysDenyRules : r === "ask" ? e.alwaysAskRules : null,
    o = n !== null ? { rules: n, key: [t, r, Mt(), abr.homedir(), fn(), Ttt() ?? "", gn()].join("\x00") } : null;
  if (o !== null) {
    let l = r9s.get(o.rules),
      c = l?.get(o.key);
    if (c !== void 0 && l !== void 0) return (l.delete(o.key), l.set(o.key, c), c);
  }
  let i = (() => { switch (t) { case "edit": return fl; case "read": return zi; } })(),
    s = $fe(e, i, r),
    a = new Map();
  for (let [l, c] of s.entries()) {
    let { relativePattern: u, root: d } = Gfn(l, c.source),
      p = gap(u),
      f = a.get(d);
    if (f === void 0) {
      let m = new Map(), g, y = 0;
      ((f = {
        patternMap: m,
        getIg: () => {
          if (g === void 0 || ++y > E2_) ((y = 1), (g = jfn.default().add(Array.from(m.keys(), (_) => yap(_, r === "allow")))));
          return g;
        },
      }), a.set(d, f));
    }
    f.patternMap.set(p, c);
  }
  if (o !== null) {
    let l = r9s.get(o.rules);
    if (l === void 0) ((l = new Map()), r9s.set(o.rules, l));
    if (l.size >= 16) { let c = l.keys().next().value; if (c !== void 0) l.delete(c); }
    l.set(o.key, a);
  }
  return a;
}

// READABLE (for understanding):
function buildPathRuleMatchers(permCtx, toolKind, behavior) {
  let cacheableRuleSet =                                     // only deny/ask are cacheable
        behavior === "deny" ? permCtx.alwaysDenyRules
      : behavior === "ask"  ? permCtx.alwaysAskRules
      : null,
    cacheSlot = cacheableRuleSet !== null
      ? { rules: cacheableRuleSet,
          key: [toolKind, behavior, platform(), os.homedir(), claudeConfigDir(),
                flagSettingsPath() ?? "", originalCwd()].join("\0") }
      : null;

  if (cacheSlot !== null) {                                  // ---- read path, with LRU touch
    let byKey = MATCHER_CACHE.get(cacheSlot.rules),
      hit = byKey?.get(cacheSlot.key);
    if (hit !== undefined && byKey !== undefined)
      return (byKey.delete(cacheSlot.key), byKey.set(cacheSlot.key, hit), hit);   // re-insert = MRU
  }

  let toolName = toolKind === "edit" ? EDIT_TOOL_NAME : READ_TOOL_NAME,
    rulesByContent = collectPathRules(permCtx, toolName, behavior),
    byRoot = new Map();

  for (let [rawPattern, rule] of rulesByContent.entries()) {
    let { relativePattern, root } = resolvePatternRoot(rawPattern, rule.source),
      normalized = sanitizePattern(relativePattern),
      bucket = byRoot.get(root);
    if (bucket === undefined) {
      let patternMap = new Map(), compiled, testCount = 0;
      bucket = {
        patternMap,
        getIg: () => {                                       // lazy + periodically rebuilt
          if (compiled === undefined || ++testCount > IGNORE_REUSE_BUDGET) {
            testCount = 1;
            compiled = ignore().add(Array.from(patternMap.keys(),
                                     (p) => normalizeDirGlobForIgnoreEngine(p, behavior === "allow")));
          }
          return compiled;
        },
      };
      byRoot.set(root, bucket);
    }
    bucket.patternMap.set(normalized, rule);
  }

  if (cacheSlot !== null) {                                  // ---- write path, bounded at 16
    let byKey = MATCHER_CACHE.get(cacheSlot.rules);
    if (byKey === undefined) { byKey = new Map(); MATCHER_CACHE.set(cacheSlot.rules, byKey); }
    if (byKey.size >= 16) {                                  // evict LRU (insertion-ordered Map)
      let oldest = byKey.keys().next().value;
      if (oldest !== undefined) byKey.delete(oldest);
    }
    byKey.set(cacheSlot.key, byRoot);
  }
  return byRoot;
}

// Mapping: s9s→buildPathRuleMatchers, r9s→MATCHER_CACHE, $fe→collectPathRules, Gfn→resolvePatternRoot,
//          gap→sanitizePattern, yap→normalizeDirGlobForIgnoreEngine, E2_→IGNORE_REUSE_BUDGET,
//          jfn→ignore, Mt→platform, fn→claudeConfigDir, Ttt→flagSettingsPath, gn→originalCwd
```

Five design decisions, each with a reason:

**(1) Two-level cache: `WeakMap<rulesArray, Map<compositeKey, result>>`** (`r9s = new WeakMap()`,
`:529043`). Keying the outer level on the **rules array identity** means the cache invalidates itself: the
permission context is treated as immutable, so adding an "always allow" rule produces a new array and the
old entry becomes garbage. No explicit invalidation call exists anywhere, and none is needed. That is
strictly better than a version counter, which someone eventually forgets to bump.

**(2) The composite key names every hidden input.**
`[toolKind, behavior, platform(), homedir(), claudeConfigDir(), flagSettingsPath() ?? "", originalCwd()]`
joined with `\0`. `Gfn`/`hap` (`:528426`, `:528453`) resolve a rule's pattern against a *root* that depends
on `~` expansion (homedir), the config dir, the `--settings` file's directory (`Ttt()`, `:3397`), and the
session cwd (`gn()`, `:2731`). Each is therefore part of the key. Omitting any one would produce a stale
matcher after a `cd` or a `--settings` change — a correctness bug disguised as a cache. `\0` is chosen as
the joiner because it cannot appear in a path.

**(3) LRU capped at 16** (`:528504-528507`). Insertion-ordered `Map` gives LRU for free: `keys().next()`
is the oldest, and a hit re-inserts (`:528469`) to move it to the end. Why 16? The key varies mostly by
`toolKind × behavior` = 4 combinations, times a handful of cwds in a session with added directories. 16
covers the realistic fan-out with margin while bounding memory to a small constant.

**(4) Only `deny` and `ask` are cached.** `cacheableRuleSet` is `null` for `allow` (`:528464`), so allow
rules recompile every call. The reason is churn: `alwaysAllowRules` grows every time the user clicks
"always allow", so a WeakMap keyed on its identity would miss on the very next call, and every miss would
also cost a cache *write*. Deny/ask rule sets come from settings files and are stable for a session. This
also matches the bullet's wording exactly ("many permission deny/ask rules"), which is a useful signal
that the wording was written from the diff.

**(5) `getIg` is lazy AND periodically rebuilt.** `E2_ = 1e4` (`:528889`). The compiled matcher is built
on first `test()` and then **discarded and rebuilt every 10,000 tests**. The `ignore` package memoises
per-path results internally; in a long session with thousands of file paths that cache grows without
bound. Rebuilding every 10k tests bounds it. The counter resets to `1` rather than `0` on rebuild
(`:528493`) because the rebuild itself services the current call. Laziness matters independently: a root
bucket that is created but never tested (because no target path is under that root) never pays the
compilation cost at all.

### 2b. The precomputed deny-rule array (`mM` hoisting)

The second, separately-anchored half. `(r ?? mM(e))` is 220=1 (`:513296`) / 193=0.

`mM(ctx)` (`:513237-513239`) is `N_r(ctx.alwaysDenyRules, "deny")`, and `N_r` (`:513228-513236`) **rebuilds
a flat array** by walking the source-scope order `nfn` and pushing `{source, ruleBehavior, ruleValue}`
objects. It is not memoised.

| | 2.1.193 | 2.1.220 |
|---|---|---|
| deny matcher | `M9t(ctx, tool)` `:597563-597565 (193)` — `i6(e).find(…)`, rebuilds every call | `WB(ctx, tool, pre)` `:513293-513299` — `(r ?? mM(e)).find(…)` |
| tool-pool filter | `e.filter((n) => !M9t(t, n) && …)` `:444186 (193)` | `let r = mM(t); return e.filter((n) => !WB(t, n, r) && …)` `:425005-425006` |

In 2.1.193 the filter was `O(tools × rules)` **allocations** per call, because `i6(e)` built a fresh array
inside every `.filter` callback. With 60+ tools (65 in the 2.1.220 index) and a large deny list, that is
thousands of array builds per turn, and the tool pool is recomputed on every tool call. Hoisting one
`let r = mM(t)` out of the callback fixes it.

The second consumer at `:514682` uses the nullish-assignment idiom so the array is built at most once and
only if the loop body is reached at all:

```javascript
if (((o ??= mM(r)), WB(r, c, o))) continue;
```

A third at `:528621` shows why the parameter is a *parameter* rather than an internal memo:

```javascript
WB(t, DIe, mM(t).filter((n) => !w2_.has(n.source)))
```

— this caller needs a **filtered** rule set (excluding certain sources). A memo inside `mM` would have
forced this caller to filter after the fact or bypass the cache. Passing the array in keeps one code path.

**Key insight:** the two halves fix the same symptom at different layers. `s9s` caches the *compiled glob
matcher* (expensive per rule-set); `mM` hoisting removes *redundant array construction* (expensive per
tool). The bullet mentions only the former; the scoping pass found only the latter. Both are real.

---

## 3. `.211`: rules persist at the repository root

> `.211`: *"Changed "always allow" permission rules to save at the repository root, so approvals granted in
> a git worktree persist across sessions and worktrees."*

**Verdict: NET_NEW.** `canonicalGitRoot` is 220=3 / 193=0; `canonical repo root` 220=1 / 193=0.

"Always allow" writes land in `localSettings` = `.claude/settings.local.json` (`UQ`, `:62361-62368`). The
change is *where that file is looked up*.

```javascript
// ============================================
// resolveLocalSettingsDirectory - repo-root canonicalization with an ownership gate
// Location: cli_inner_pretty.js:62295-62309
// ============================================

// ORIGINAL (for source lookup):
function YWe(e, t) {
  let r = t?.(e);
  if (!r) return Kx.resolve(e);
  let n = Kx.resolve(r),
    o = Kx.resolve(e);
  if (n === o) return n;
  let i;
  try { i = _Ih(); } catch { return o; }
  if (n === i) return o;
  if (!yIh(n)) return o;
  return n;
}

// READABLE (for understanding):
function resolveLocalSettingsDirectory(cwd, canonicalGitRootFn) {
  let repoRoot = canonicalGitRootFn?.(cwd);
  if (!repoRoot) return path.resolve(cwd);                  // not a git repo: per-cwd, as before
  let root = path.resolve(repoRoot),
    here = path.resolve(cwd);
  if (root === here) return root;                            // already at the root: nothing to do
  let home;
  try { home = realHomeDir(); } catch { return here; }       // cannot resolve $HOME: stay per-cwd
  if (root === home) return here;                            // repo root IS $HOME: refuse
  if (!isRootOwnedByCurrentUser(root)) return here;           // POSIX ownership gate
  return root;                                               // canonicalize
}

// Mapping: YWe→resolveLocalSettingsDirectory, _Ih→realHomeDir, yIh→isRootOwnedByCurrentUser,
//          Kx→path, t→canonicalGitRootFn
```

Wired in at `:62290`: the `localSettings` arm of the scope→directory resolver `y3r`
(`:62282-62293`) is the only scope that calls it. `userSettings` uses `fn()`, `projectSettings` and
`policySettings` use `t.cwd`, `flagSettings` uses the flag path's dirname. The `canonicalGitRoot` function
itself is injected at `:63116` as `canonicalGitRoot: gu`, where `gu = Ekh()` (`:56190`) and
`Ekh` (`:55537-55543`) wraps a memoised git-root lookup and re-exposes its `.cache`.

### The two refusals — the part the changelog omits

**Refusal 1: the repo root is `$HOME`.** `_Ih` (`:62657-62661`) is a memoised
`realpath(os.homedir())` that *throws* if the realpath is unavailable. If the git root equals it, the
function returns the session cwd. Without this, a user who has run `git init` in their home directory
would have every project's "always allow" grants written into `~/.claude/settings.local.json` — one
shared, ever-growing grant list spanning unrelated projects.

**Refusal 2: ownership.** `yIh` (`:62311-62341`) verifies that the repo root, its `.git` entry, and its
`.claude` entry (if present) are **all owned by the current effective uid**:

```javascript
let { rootUid: r, gitEntryUid: n, claudeEntryUid: o } = gIh(e);
if (r === t && n === t && (o === null || o === t)) return !0;
```

`gIh` (`:62647-62656`) is memoised and uses `lstat` for `.claude` and `.git` (so a symlinked `.claude`
reports the *link's* uid, not the target's) and `stat` for the root. Every failure path logs a specific
diagnostic and returns `false`, which means "stay at the session cwd". Three distinct messages exist:

- **no uid semantics** — `this platform has no uid semantics to verify directory ownership with, so the
  store stays at the session cwd (canonicalization is POSIX-only)`. This fires when neither
  `process.getuid` nor `process.geteuid` is a function, i.e. **on Windows**. So the `.211` behaviour change
  is **POSIX-only**; Windows keeps per-cwd storage. The changelog does not say this.
- **wrong owner** — names the three uids and the current uid, and tells the user to `chown` the repo
  including `.git` and `.claude`.
- **unverifiable** — any thrown error from `gIh`.

**Why gate on ownership at all?** Canonicalizing means *writing a security-relevant file into a directory
chosen by the git configuration*. If the repo root is not yours, another user can pre-create
`.claude/settings.local.json` (or make `.claude` a symlink) and your approvals land in a file they
control — and, worse, are *read back* from it on the next session. Requiring uid ownership of the root,
`.git`, and `.claude` closes that. Checking `.git` matters because the root's canonical location is
*derived from* `.git`.

### The consequence for worktrees: do not copy the file

`:224974-224999` (`rZg`) is the worktree-creation path, and it now refuses to copy `settings.local.json`
into a new worktree when canonicalization is in effect:

```javascript
if (YWe(t, gu) !== Ha.resolve(t)) {
  w(`Skipping settings.local.json copy into ${t}: it resolves localSettings to the canonical repo root, so a copy would become a stale, revocation-resurrecting legacy overlay`);
  return;
}
```

The phrase **"revocation-resurrecting legacy overlay"** (220=1 / 193=0) is the whole argument in three
words. If both the repo root *and* the worktree held a `settings.local.json`, and the settings loader
merges them, then a rule the user **revoked** at the root would come back from the worktree copy. Since
the root file is now authoritative, copying it creates a snapshot that can only diverge, and diverge in the
unsafe direction (old grants reappearing). The only safe answer is not to copy.

The complementary helper `w7t` (`:62369-62372`) returns the per-cwd path *only when canonicalization did
not happen* — the migration hook for the legacy location:

```javascript
function w7t(e) {
  if (YWe(e.cwd, e.canonicalGitRoot) === Kx.resolve(e.cwd)) return;
  return Kx.join(Kx.resolve(e.cwd), UQ("localSettings"));
}
```

Same-directory symlink and escape checks are also enforced on the copy path: `lstat` + `isSymbolicLink`
(`:224984`) and `Bdo(dest, realRoot)` (`:224989`). `destination escapes worktree via committed symlink`
is 220=3 / 193=3 — carryover; only the canonicalization pre-check is new. Same split as
`.212`'s `A repository-committed symlink at .claude…` (`:224564`), which belongs to
[`../53_subagent_limits/`](../53_subagent_limits/).

---

## 4. `.207`: malformed bracket globs no longer break file reads

> `.207`: *"Fixed malformed bracket patterns in rules globs, skill paths, `.ignore`, and
> `.worktreeinclude` breaking file reads, file suggestions, and worktree creation."*

**Verdict: NET_NEW.** `tengu_uncompilable_ignore_pattern` 220=1 (`:224144`) / 193=0.

An unbalanced `[` makes the underlying matcher throw. Previously that exception propagated and took out
whichever feature was compiling the pattern. 2.1.220 installs a **shared failure handler** with four
named call sites:

```javascript
(WQg = {
  claudemd_rule_globs:      Ee("claudemd_rule_globs"),
  skill_paths:              Ee("skill_paths"),
  file_suggestions_ignore:  Ee("file_suggestions_ignore"),
  worktreeinclude:          Ee("worktreeinclude"),
}),
(qQg = Vr(
  (e, t) => {
    (w(`[${e}] gitignore-style pattern failed to compile (${hRu(t)}); treating it as matching nothing: ${t}`, { level: "warn" }),
      O("tengu_uncompilable_ignore_pattern", { site: WQg[e] }));
  },
  (e, t) => `${e}\x00${t}`,
));
```

(`:224133-224147`; the four `site` values are pre-redacted through `Ee` at declaration time.)

Three decisions:

1. **`treating it as matching nothing`** — the fail-safe direction. A pattern that cannot compile matches
   no path. For an *ignore* list that is the permissive direction (nothing excluded); for a *rule* glob it
   is the restrictive direction (nothing granted). Both are the safe error for their respective use.
2. **`Vr` memoisation (`qQg`, `:224139`) keyed on `` `${site}\0${pattern}` ``** — the same bad pattern in the same site warns
   exactly once, no matter how many paths are tested against it. Without this, a `.gitignore` with one
   malformed line would emit a warning per file scanned.
3. **A `site` enum rather than a stack trace** — the telemetry answers "which subsystem's patterns are
   users getting wrong?" `claudemd_rule_globs` and `skill_paths` are author-facing;
   `file_suggestions_ignore` and `worktreeinclude` are user-facing. That distinction is actionable.

The pattern sanitiser used by the rule matcher, `gap` (`:528448-528452`), is the prevention side of the
same problem:

```javascript
function gap(e) {
  let t = e.replace(/\/{2,}/g, "/");
  if (/^\s*(?:\/\*\*)?$/.test(t)) return t;
  return t.replace(/^﻿([!#]?)/, (r, n) => (n ? "\\" + n : "")).replace(/^﻿/, "[﻿]");
}
```

1. Collapse repeated slashes (`src//**` → `src/**`).
2. Leave the empty and `/**`-only patterns untouched — they are the "everything" sentinels that `yap`
   also special-cases.
3. Handle a **leading byte-order mark**. A BOM before `!` or `#` is invisible in an editor but moves the
   sigil off position 0, so gitignore stops treating it as negation/comment. `gap` strips the BOM and
   *escapes* the sigil (`\!`, `\#`) so the pattern means the literal it visually appears to mean. A BOM
   with no sigil becomes the character class `[﻿]`, which matches the BOM literally rather than being
   silently dropped.

This is a *confusable-input* defence, in the same family as the bidi/zero-width stripping in
`.211`'s chat-relay bullet and the invisible-Unicode work in `.216`.

---

## 5. `.210`: the `Write(path)` / `NotebookEdit(path)` / `Glob(path)` warning — UNANCHORED

> `.210`: *"Added a startup warning for `Write(path)`, `NotebookEdit(path)`, and `Glob(path)` permission
> rules — use `Edit(path)` or `Read(path)` instead."*

**Verdict: UNANCHORED. I could not find this warning in the 2.1.220 bundle.**

The bullet is well-motivated by the matcher above: `$fe` (`:513346-513363`) collects path rules by
`ruleValue.toolName === t`, where `t` is only ever `fl` (the Edit tool name) or `zi` (the Read tool name),
chosen at `:528472-528478`. So a rule written as `Write(src/**)` is collected by **nothing** — it is
inert. A warning is exactly the right response.

But the strings are not there. Probes run against both bundles:

| probe | 220 | 193 |
|---|---|---|
| `NotebookEdit(` | 0 | 0 |
| `Glob(` | 5 | 5 |
| `has no effect` | 6 | 5 |
| `does not accept a path` | 0 | 0 |
| `ignores the path` | 0 | 0 |
| `use Edit(` | 0 | 0 |
| `tengu_permission_rule_warning` | 0 | 0 |
| `ruleValueWarning` | 0 | 0 |
| `overlyBroadBashPermissions` | 4 | 4 |
| `dangerousPermissions` | 3 | 3 |

All six `has no effect` hits in 2.1.220 were read and none is about permission rules: an MCP tab-group
parameter (`:35073`), a WSL managed-settings flag (`:60750`), the unknown-settings-field message
(`:587349`), `/logout` in a background session (`:701778`), the screen-reader renderer note (`:732423`),
and a spend-enforcement `admin:` note (`:861452`).

The startup-warning channel exists and is carryover: the rule loader returns
`{ toolPermissionContext, warnings, dangerousPermissions, overlyBroadBashPermissions }` (`:529594`), with
`overlyBroadBashPermissions` and `dangerousPermissions` at identical counts in both builds. So `.210` #2
would have been a fourth member of that return shape, and it is not present. Recorded UNANCHORED rather
than guessed.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md).

Key functions in this document:
- `normalizeDirGlobForIgnoreEngine` (`yap`, `:528456`) - the `dir/**` anchoring fix; `anchorAtRoot` decides
- `sanitizePattern` (`gap`, `:528448`) - slash collapsing + BOM/sigil handling
- `resolvePatternRoot` (`Gfn`, `:528453`) / `hap` (`:528426`) / `b2_` (`:528366`) - pattern → `{relativePattern, root}`
- `buildPathRuleMatchers` (`s9s`, `:528463`) - LRU-cached, root-partitioned matcher compilation
- `MATCHER_CACHE` (`r9s`, `:529043`) - `WeakMap<rulesArray, Map<key, byRoot>>`
- `IGNORE_REUSE_BUDGET` (`E2_`, `:528889`) - `1e4` tests before rebuilding a compiled matcher
- `findMatchingPathRule` (`B0`, `:528512`) - engine match → rule object, with the anchored fallback
- `evaluateHookIfCondition` (`Cze`, `:528537`) - hook `if:` matcher; calls `yap(gap(n), !0)`
- `collectPathRules` (`$fe`, `:513346`) - only `Edit`/`Read` tool names are path-scoped
- `getDenyRules` (`mM`, `:513237`) / `getAskRules` (`Bfe`, `:513240`) / `flattenRules` (`N_r`, `:513228`)
- `findMatchingDenyRule` (`WB`, `:513293`) - accepts a precomputed array (`.208`)
- `filterDeniedTools` (`nve`, `:425004`) - hoists `mM(t)` out of the `.filter` callback
- `posixRelative` (`v2t`, `:528077`) - platform-folded relative path
- `resolveLocalSettingsDirectory` (`YWe`, `:62295`) - repo-root canonicalization with two refusals
- `legacyLocalSettingsPath` (`w7t`, `:62369`) - per-cwd path when canonicalization did not apply
- `settingsScopeDirectory` (`y3r`, `:62282`) - scope → directory; `localSettings` is the only canonicalized one
- `settingsScopeRelativePath` (`UQ`, `:62361`) - `.claude/settings.json` / `.claude/settings.local.json`
- `realHomeDir` (`_Ih`, `:62657`) - memoised `realpath(homedir())`; throws when unavailable
- `isRootOwnedByCurrentUser` (`yIh`, `:62311`) - POSIX-only uid gate with three diagnostics
- `statRepoRootOwnership` (`gIh`, `:62647`) - memoised `{rootUid, gitEntryUid, claudeEntryUid}`
- `canonicalGitRootLookup` (`gu`/`Ekh`, `:56190`/`:55537`) - memoised git-root resolver, injected at `:63116`
- `copyLocalSettingsIntoWorktree` (`rZg`, `:224974`) - the "revocation-resurrecting overlay" refusal
- `reportUncompilablePattern` (`qQg`, `:224139`) - memoised warn + `tengu_uncompilable_ignore_pattern`
- `UNCOMPILABLE_PATTERN_SITES` (`WQg`, `:224133`) - four pre-redacted site names
