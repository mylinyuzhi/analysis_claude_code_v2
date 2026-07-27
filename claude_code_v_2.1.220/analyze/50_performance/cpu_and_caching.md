# CPU cost and caching (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`. Every bare `cli_inner_pretty.js:<line>` is a **220** line I read.

This document covers the *compute* side of the window: per-turn and per-frame work that grew with
conversation length, tool count or rule count. It also records — with evidence — the four bullets in
this group that I could **not** anchor, and which candidate mechanisms I positively eliminated for each.

**Boundary with [`48_accessibility_ui/`](../48_accessibility_ui/):** this module owns *measured cost
and resource bounds*; `48` owns *visible behaviour*. Where a render bullet has both halves (the
200-row markdown table cap, screen-reader row re-rendering) the cost analysis is here and the
user-visible presentation is theirs.

---

## 1. The `.208` permission-rule and tool-pool bullets are ONE change

> `.208`: *"Fixed multi-second per-turn slowdowns in sessions with many permission deny/ask rules —
> rule matchers are now compiled once and cached."*
> `.208`: *"Reduced per-tool-call CPU overhead in print/SDK sessions with many MCP tools by caching
> tool-pool assembly (up to 7x faster tool rounds at high tool counts)."*

**Verdict: NET_NEW — and they are the same three-line edit.** `let r = mM(t);` 220=1 (`:425005`) /
193=0; `(r ?? mM(e))` 220=1 (`:513296`) / 193=0.

**The changelog word "compiled" is wrong** and I will say so up front: nothing is compiled and nothing
is memoised across calls. The fix is **loop hoisting**. The glob matcher is still built fresh on every
single comparison — see §1.4.

### 1.1 The cost model

Three functions form the hot path:

```javascript
// ============================================
// collectRulesFromSources / getDenyRules - materialise the deny-rule list from all rule sources
// Location: cli_inner_pretty.js:513228-513242
// ============================================

// ORIGINAL (for source lookup):
function N_r(e, t) {
  let r = [];
  for (let n of nfn) {
    let o = e[n];
    if (o === void 0) continue;
    for (let i of o) r.push({ source: n, ruleBehavior: t, ruleValue: fg(i) });
  }
  return r;
}
function mM(e) {
  return N_r(e.alwaysDenyRules, "deny");
}
function Bfe(e) {
  return N_r(e.alwaysAskRules, "ask");
}

// READABLE (for understanding):
function collectRulesFromSources(rulesBySource, behavior) {
  let out = [];
  for (let source of PERMISSION_RULE_SOURCES) {           // 10 sources, fixed order
    let rules = rulesBySource[source];
    if (rules === undefined) continue;
    for (let raw of rules)
      out.push({ source, ruleBehavior: behavior, ruleValue: parsePermissionRule(raw) });  // ALLOCATES
  }
  return out;
}
function getDenyRules(ctx) { return collectRulesFromSources(ctx.alwaysDenyRules, "deny"); }
function getAskRules(ctx)  { return collectRulesFromSources(ctx.alwaysAskRules,  "ask"); }

// Mapping: N_r→collectRulesFromSources, mM→getDenyRules, Bfe→getAskRules,
//          nfn→PERMISSION_RULE_SOURCES (:514067), fg→parsePermissionRule (:60333)
```

`PERMISSION_RULE_SOURCES` (`:514067`) is
`["userSettings","projectSettings","localSettings","flagSettings","policySettings","cliArg","command","session","toolsNarrowing","mcpServerPolicy"]`.

`parsePermissionRule` (`fg`, `:60333-60345`) is not free: for each rule string it scans for a
top-level `(`, scans backwards for the matching `)`, validates that the `)` is the final character,
substrings twice, and runs `QHh` — three chained `replaceAll`s — on the argument. Then a fresh
`{source, ruleBehavior, ruleValue}` object and a fresh `{toolName, ruleContent}` object are allocated.
So `getDenyRules(ctx)` is roughly **2R allocations + 3R string scans** for R deny rules, on every call.

### 1.2 What 2.1.193 did

```javascript
// :597563-597565 (193) — exported as getDenyRuleForTool at :597436 (193)
function M9t(e, t) {
  return i6(e).find((n) => cjo(t, n, { proxyExpansion: djo(n), globMatching: !0, toolAliases: e.toolAliases })) || null;
}

// :444185-444187 (193) — the tool-pool filter
function Rre(e, t) {
  return e.filter((n) => !M9t(t, n) && n.mcpInfo?.effectiveMaxPermission !== "blocked");
}
```

`Rre` filters T candidate tools, and calls `M9t` once per tool. `M9t` calls `i6(e)` — the full
collect-and-parse — **inside the filter callback**. Cost per tool-pool assembly is therefore

```
T × (2R allocations + 3R string scans)   ≈ O(T · R)
```

With an enterprise policy file (R in the hundreds) and a large MCP surface (T in the hundreds — 65
built-in tool entries plus every MCP server's tools), that is tens of thousands of parses **per API
call**. Both bullets describe this from opposite ends: "many deny/ask rules" holds T fixed and grows R;
"many MCP tools" holds R fixed and grows T.

### 1.3 The 2.1.220 fix

```javascript
// ============================================
// filterToolsByDenyRules / getDenyRuleForTool - the loop hoist that fixes both .208 bullets
// Location: cli_inner_pretty.js:425004-425007 and :513293-513299
// ============================================

// ORIGINAL (for source lookup):
function nve(e, t) {
  let r = mM(t);
  return e.filter((n) => !WB(t, n, r) && n.mcpInfo?.effectiveMaxPermission !== "blocked");
}
...
function WB(e, t, r) {
  if (wKe(t)) return null;
  return (
    (r ?? mM(e)).find((n) => ofn(t, n, { proxyExpansion: ifn(n), globMatching: !0, toolAliases: e.toolAliases })) ||
    null
  );
}

// READABLE (for understanding):
function filterToolsByDenyRules(tools, permissionContext) {
  let denyRules = getDenyRules(permissionContext);              // hoisted: ONCE per pool assembly
  return tools.filter(
    (tool) => !getDenyRuleForTool(permissionContext, tool, denyRules)
           && tool.mcpInfo?.effectiveMaxPermission !== "blocked",
  );
}
...
function getDenyRuleForTool(permissionContext, tool, precomputedDenyRules) {
  if (isEndConversationTool(tool)) return null;                 // unrelated .214 carve-out
  return (precomputedDenyRules ?? getDenyRules(permissionContext))   // ?? keeps every old caller working
      .find((rule) => matchesToolRule(tool, rule, {
              proxyExpansion: isProxyExpandableSource(rule),
              globMatching: true,
              toolAliases: permissionContext.toolAliases }))
      || null;
}

// Mapping: nve→filterToolsByDenyRules, WB→getDenyRuleForTool (name confirmed by the 220 export
//          table at :513085 and the 193 one at :597436 (193)), mM→getDenyRules,
//          ofn→matchesToolRule, ifn→isProxyExpandableSource, wKe→isEndConversationTool (:513105)
```

**How it works:**

1. `filterToolsByDenyRules` computes the rule array once, before the filter.
2. `getDenyRuleForTool` gained a **third, optional** parameter. `r ?? mM(e)` is the compatibility
   seam: the other three call sites (`:513303` inside `Zqs`, and the two in the permission engine)
   pass nothing and behave exactly as in 193.
3. Cost drops from `O(T·R)` parses to `O(R)` parses + `O(T·R)` **comparisons**. The comparison
   (`ofn`) is cheap — string equality first, then optional glob — so the saved work is the allocation
   and string-scanning.

**Why the `??` default rather than threading the parameter everywhere:** the alternative is making
`precomputedDenyRules` mandatory and updating every caller, which risks a caller passing a *stale*
array after `setToolPermissionContext` mutates the context mid-turn. The `??` form makes correctness
the default and the optimisation opt-in at exactly the one site where the array's freshness is
provably scoped to a single synchronous filter.

**Where "7x" comes from:** the bullet says *"up to 7x faster tool rounds at high tool counts"*. If
parse-and-allocate dominates and comparison is ~1/6 of it, then removing (T−1)/T of the parse work
leaves roughly 1/7 of the original cost as T grows. The client is not instrumented for this, so the
figure is unverifiable from the bundle — but the shape of the claim (asymptotic in T, "up to") matches
a `O(T·R) → O(R) + O(T·R)_cheap` transformation exactly.

### 1.4 The glob matcher was NOT cached — but the *path-rule* matcher was

> **Correction applied by the orchestrator.** An earlier draft of this section concluded that the
> changelog's "rule matchers are now compiled once and cached" *"describes something that is not in the
> code"*. That conclusion was **wrong**: it generalised from the tool-name glob matcher to all rule
> matching. The caching does exist — on the **path-rule** matcher, not the glob matcher. Both halves are
> documented below, and the corrected verdict for `.208` is **NET_NEW (implemented), not
> changelog-inaccurate**.

**The caching that DID ship** is in the deny/ask path-rule matcher builder `s9s` (`:528463`), consumed by
the filesystem rule matcher `B0` (`:528512`):

```javascript
// ============================================
// buildPathRuleMatchers - memoised deny/ask path-rule matcher construction
// Location: cli_inner_pretty.js:528463-528470 (cache read), :528502-528504 (cache write)
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
  ...
    let l = r9s.get(o.rules);
    if (l === void 0) ((l = new Map()), r9s.set(o.rules, l));
    l.set(o.key, a);
  return a;
}
var r9s = new WeakMap();                                              // :529043

// READABLE (for understanding):
function buildPathRuleMatchers(permissionContext, ruleKind, behavior) {
  let ruleSet = behavior === "deny" ? permissionContext.alwaysDenyRules
              : behavior === "ask"  ? permissionContext.alwaysAskRules : null,
    cacheEntry = ruleSet !== null
      ? { rules: ruleSet,
          key: [ruleKind, behavior, platform(), os.homedir(), cwd(), worktreeRoot() ?? "", ...].join("\0") }
      : null;
  if (cacheEntry !== null) {                                          // LRU-ish: re-insert on hit
    let perRuleSet = MATCHER_CACHE.get(cacheEntry.rules),
      hit = perRuleSet?.get(cacheEntry.key);
    if (hit !== undefined && perRuleSet !== undefined)
      return (perRuleSet.delete(cacheEntry.key), perRuleSet.set(cacheEntry.key, hit), hit);
  }
  ... build the patternMap ...
}
var MATCHER_CACHE = new WeakMap();   // keyed by rule-set identity, so it self-invalidates on rule edits

// Mapping: s9s→buildPathRuleMatchers, r9s→MATCHER_CACHE, Mt→platform, fn→cwd, Ttt→worktreeRoot
```

**Why this is provably new:** `patternMap` — the field name of the built structure — is
**220=4 / 193=0**. 193's only `getIg*` hits are `getIgnoreViolations` (`:212043 (193)`), an unrelated
sandbox-config accessor, so there is no 193 counterpart to memoise. The composite cache key
(`ruleKind + behavior + platform + homedir + cwd + worktreeRoot`) is what makes the memo safe across
`/add-dir` and worktree switches, and keying the outer `WeakMap` on the **rule-set object identity**
means editing permissions naturally invalidates the entry without an explicit bust.

**Key insight:** the cache is keyed on *identity plus environment*, not on a hash of the rules. That is
cheaper and automatically correct — but it also means two structurally identical rule sets loaded from
different files get separate entries, which is the deliberate trade.

### 1.4b What was still NOT cached — the tool-name glob matcher

```javascript
// :60306-60317
function SMi(e, t) {
  return new RegExp(
    `^${e.split("*").map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`,
    "s",
  ).test(t);
}
function EMi(e, t) { return SMi(e, t); }
```

Every glob comparison **constructs and compiles a fresh `RegExp`**, and `EMi` is called from
`Rrp` (`:513251`) and again at `:513260` for the MCP server/tool split. There is no cache keyed on the
pattern, and `SMi` is **byte-identical to 193's `rCr` (`:55957 (193)`)** — same body, same lack of a cache.
So the `.208` caching work covered the path-rule matcher (§1.4) and left the glob path untouched. The
remaining `O(T·R)` regex compilations for glob-shaped rules are the obvious next optimisation and were
not taken in this window.

**Key insight:** the `.208` bullet is accurate but *partial* — "rule matchers" means the **path**
matchers. Reading only `SMi` and concluding the changelog lied is a trap this document originally fell
into: when a perf bullet names a subsystem, enumerate every matcher in it before declaring a claim
unimplemented. The loop hoisting above and the `s9s` memo in §1.4 are complementary, and together they
are what the bullet describes.

---

## 2. Per-frame render work: `hasAbsoluteDescendant` prunes the absolute-rect walk

> `.196`: *"Reduced per-frame rendering work in the terminal UI by skipping no-op subtree walks
> during streaming."*

**Verdict: NET_NEW (three new consumer sites on a pre-existing flag).** `hasAbsoluteDescendant` is
**220=9 / 193=6**. The four *producer* sites are byte-identical
(`:251131`/`:251204`/`:251217`/`:251222` ↔ `:168853`/`:168921`/`:168934`/`:168939 (193)`) and two
consumers are identical (`:254919`/`:254928` ↔ `:172231`/`:172240 (193)`). **The three new hits are
exactly the render-walk short-circuits.**

### The flag

`hasAbsoluteDescendant` is a boolean stamped on every Ink node, maintained by an upward propagation
that stops as soon as it hits an already-marked ancestor:

```javascript
// :251131
  while (t && !t.hasAbsoluteDescendant) ((t.hasAbsoluteDescendant = !0), (t = t.parentNode));
```

It is set when a node with `position: absolute` is appended (`:251217`) or re-parented (`:251222`).
In 2.1.193 the flag existed and was used only by the *layout* pass; the *paint* pass ignored it.

### The 193 walk

```javascript
// :174493-174512 (193)
function uNi(e, t, n, r, o, s, i, a) {
  let l = o + i, c = s + a;
  for (let u of e.childNodes) {
    if (u.nodeName === "#text") continue;
    let d = u;
    if (d.style.position === "absolute") { ...blit if it escapes the clip... }
    uNi(d, t, n, r, o, s, i, a);          // UNCONDITIONAL recursion into every child
  }
}
```

This is a full depth-first traversal of the **entire** node tree, executed per frame, whose only
purpose is to find absolutely-positioned nodes. In a streaming session the transcript subtree is
thousands of nodes deep in total and contains **zero** absolute nodes — every one of those visits is a
no-op. That is the bullet's "no-op subtree walks", literally.

### The 220 walk

```javascript
// ============================================
// blitEscapingAbsoluteRects - absolute-rect repaint pass, now pruned and iterative
// Location: cli_inner_pretty.js:257235-257262
// ============================================

// ORIGINAL (for source lookup):
function buy(e, t, r, n, o, i, s, a) {
  if (!e.hasAbsoluteDescendant) return;
  let l = o + s,
    c = i + a,
    u = [],
    d = (p) => {
      let f = p.childNodes;
      for (let m = f.length - 1; m >= 0; m--) {
        let g = f[m];
        if (g.nodeName !== "#text") u.push(g);
      }
    };
  d(e);
  for (let p = u.pop(); p !== void 0; p = u.pop()) {
    if (p.style.position === "absolute") {
      let f = Ev.get(p);
      if (f) {
        r.absoluteRectsCur.push(f);
        let m = Math.floor(f.x), g = Math.floor(f.y), y = Math.floor(f.width), _ = Math.floor(f.height);
        if (m < o || g < i || m + y > l || g + _ > c) t.blit(n, m, g, y, _);
      }
    }
    if (p.hasAbsoluteDescendant) d(p);
  }
}

// READABLE (for understanding):
function blitEscapingAbsoluteRects(node, screen, frame, prevScreen, clipX, clipY, clipW, clipH) {
  if (!node.hasAbsoluteDescendant) return;                 // (1) prune the whole subtree
  let clipRight = clipX + clipW, clipBottom = clipY + clipH,
    stack = [],
    pushChildren = (n) => {                                // reverse push -> pop yields document order
      let kids = n.childNodes;
      for (let i = kids.length - 1; i >= 0; i--) if (kids[i].nodeName !== "#text") stack.push(kids[i]);
    };
  pushChildren(node);
  for (let cur = stack.pop(); cur !== undefined; cur = stack.pop()) {   // (2) explicit stack, no recursion
    if (cur.style.position === "absolute") {
      let rect = nodeRects.get(cur);
      if (rect) {
        frame.absoluteRectsCur.push(rect);
        if (rect escapes the clip window) screen.blit(prevScreen, ...);
      }
    }
    if (cur.hasAbsoluteDescendant) pushChildren(cur);      // (3) prune per child
  }
}

// Mapping: buy→blitEscapingAbsoluteRects, Ev→nodeRects, d→pushChildren, u→stack,
//          193 twin: uNi (:174493 (193))
```

The sibling predicate got the same treatment:

```javascript
// :257173-257174 — guy (hasAbsolutePositionChanged); 193 twin sRd (:174433 (193)) had no guard
function guy(e, t, r) {
  if (!e.hasAbsoluteDescendant) return !1;
  for (let n of e.childNodes) { ...compare cached rect to current yoga geometry... }
```

**How it works:**

1. **Entry prune** — a subtree with no absolute descendant is skipped in `O(1)`. During streaming the
   transcript is exactly such a subtree, so per-frame cost collapses from "size of the tree" to "size
   of the absolutely-positioned skeleton" (overlays, dialogs, the status line).
2. **Per-child prune** — `if (cur.hasAbsoluteDescendant) pushChildren(cur)` keeps the prune active at
   every level, so a mostly-static tree with one dialog costs one path, not one traversal.
3. **Recursion → explicit stack** — children are pushed in reverse so `pop()` yields document order,
   preserving the paint order of the recursive version exactly.

**Why the flag rather than a dirty-rect list:** Ink already maintains a `dirty` bit per node and a
`nodeRects` map, so a separate absolute-rect index would be a third structure to keep coherent across
re-parents. Reusing `hasAbsoluteDescendant` — already correctly maintained for layout — costs nothing
and cannot drift.

**A second finding in the same function, which I cannot attribute to a release.** The
recursion→stack conversion has no effect on the `.196` cost story (both are `O(visited)`), but it does
remove the only unbounded-depth recursion in the paint pass. `.218` carries an UNANCHORED bullet,
*"Crashes (max call stack) on deeply nested watched-dir deletion and deep UI trees"*, whose *deep UI
trees* half this change would fix. Two builds cannot tell me whether the prune and the
de-recursion shipped together in `.196` or separately in `.218` — I record it as a **candidate anchor,
not a proven one**.

---

## 3. Markdown tables: a 200-row cap plus a per-cell render memo

> `.208`: *"Fixed very large markdown tables stalling rendering or using excessive memory; tables over
> 200 rows show the first 200 with a '… N more rows' notice."*

**Verdict: NET_NEW.** `_Up = 200` 220=1 (`:636511`) / 193=0; `more ${Et(e, "row")} not shown`
220=1 (`:636279`) / 193=0. The cap and the memo are two separate improvements in one function.

### 3.1 Why 193 stalled: quadratic cell rendering

The 193 renderer `tKa` (`:380949-…(193)`) computes column widths like this:

```javascript
// :380953-380973 (193)
  function a(R) { return R?.map((P) => v0(P, o, 0, null, null, t, !1, r)).join("") ?? ""; }
  function l(R) { return Hl(a(R)); }
  function c(R) { ...split l(R) on whitespace, return max word width... }
  function u(R) { return Math.max(tn(l(R)), j5t); }
  let d = e.header.map((R, P) => {
      let O = c(R.tokens);
      for (let D of e.rows) O = Math.max(O, c(D[P]?.tokens));   // renders EVERY cell of column P
      return O;
    }),
    p = e.header.map((R, P) => { ...same loop again with u()... }),
```

`a()` walks the cell's markdown token tree and builds a string. It is **not memoised**, and every cell
is rendered at least three times: once inside `c()` for the minimum width pass, once inside `u()` for
the natural width pass, and once more when the row is actually emitted. For an R×C table that is
`3·R·C` token-tree walks with no cap on R.

### 3.2 The 220 renderer

```javascript
// ============================================
// renderMarkdownTable - row cap + per-cell render memo
// Location: cli_inner_pretty.js:636292-636317
// ============================================

// ORIGINAL (for source lookup):
function EUp(e, t, r, n, o, i) {
  let s = Math.max(0, e.rows.length - _Up),
    a = s > 0 ? e.rows.slice(0, _Up) : e.rows,
    l = new Map();
  function c(D) {
    let U = l.get(D);
    if (U !== void 0) return U;
    let W = _Ar(D?.map((q) => d2(q, r, { listDepth: 0, orderedListNumber: null, parent: null,
                                         highlight: n, glueProse: !1, linkCap: o })).join("") ?? "");
    return (l.set(D, W), W);
  }
  function u(D) { return xi(c(D)); }
  ...

// READABLE (for understanding):
function renderMarkdownTable(table, availableWidth, theme, highlight, linkCap, ansiMode) {
  let hiddenRowCount = Math.max(0, table.rows.length - MAX_TABLE_ROWS /* 200 */),
    visibleRows = hiddenRowCount > 0 ? table.rows.slice(0, MAX_TABLE_ROWS) : table.rows,
    cellRenderCache = new Map();                     // keyed by the token ARRAY identity
  function renderCellTokens(tokens) {
    let hit = cellRenderCache.get(tokens);
    if (hit !== undefined) return hit;
    let rendered = normalizeWhitespace(
      tokens?.map((tok) => renderInlineToken(tok, theme, { listDepth: 0, orderedListNumber: null,
                                                           parent: null, highlight,
                                                           glueProse: false, linkCap })).join("") ?? "");
    cellRenderCache.set(tokens, rendered);
    return rendered;
  }
  ...

// Mapping: EUp→renderMarkdownTable, _Up→MAX_TABLE_ROWS, l→cellRenderCache, c→renderCellTokens,
//          d2→renderInlineToken, bqo (:636278)→buildHiddenRowsNotice
```

**How it works:**

1. `hiddenRowCount` is computed *before* anything renders, and `visibleRows` is a plain `slice` — the
   dropped rows' token trees are never touched. Cost becomes `O(min(R, 200) · C)` regardless of R.
2. `cellRenderCache` is a `Map` keyed by the **token array object identity**, which is stable for the
   lifetime of one parse. That collapses the three-renders-per-cell pattern to one. It is deliberately
   *per call* (declared inside the function), so it cannot serve a stale render after a theme or width
   change — a correctness-over-hit-rate choice that is right here, because the expensive repetition is
   all within a single call.
3. The notice is appended at **three** call sites so no renderer can silently drop rows:
   `:636316` (the ANSI path), `:636438` (the plain path, guarded by `if (s > 0)`), and `:636492`
   (the React-Compiler-memoised path, which caches the notice string itself in slot `hUp[5]/[6]`).

**Why 200 rows:** a 200-row table already exceeds any terminal viewport by an order of magnitude, so
nothing a user could read is lost; and it caps the *worst* case (a model dumping a 50,000-row query
result) at a fixed 200·C render cost. The truncation is at the **head**, not the tail — for a table,
the header plus the first rows carry the schema and the notice tells the reader what is missing.

**Related, and honestly unanchored:** `.207` carries *"Terminal freeze/keystroke lag streaming long
lists, tables, code blocks"*. The table third of that bullet is plainly this mechanism, shipped one
release later; the lists and code-block thirds have no anchor I could find.

---

## 4. UNANCHORED bullets — what I ruled out

Four CPU bullets have no anchor. For each I record the mechanisms I **eliminated**, because a narrowed
search space is a more useful artefact than a plausible-sounding guess.

### 4.1 `.216` message normalization growing quadratically with turns

> *"Fixed a slowdown in long sessions where message normalization cost grew quadratically with the
> number of turns, causing multi-second stalls and slow resumes."*

**Verdict: UNANCHORED.** The `_false_delta_ledger` already establishes that all four `quadratic` hits
are vendor strings. My own probes: `normalizeMessages`, `normalizedMessages`, `normalizeMessagesForApi`,
`normalizedCache`, `normalizeCache`, `lastNormalized`, `memoizedMessages`, `messageCache`, `uuidIndex`,
`chainCache`, `toolUseIdIndex`, `byToolUseId` — **all 0/0 in both bundles**.

**Eliminated by reading both sides:**

| Candidate | 220 | 193 | Result |
|---|---|---|---|
| The normalization entry point | `m1_` `:509336-509368` | `LGf` `:594226-594253 (193)` | Same shape. 220 adds only a `traceSources` branch (`:509339-509340`) and a `preserveTrailingThinking` option object — neither is a cache. |
| The cross-model thinking stripper | `U9s` `:533670-533683` | `YSo` `:602157-602173 (193)` | **Byte-equivalent**, including the `if (!e.some(...)) return e` early-out and the `return r ? n : e` identity preservation. Not the fix. |
| The orphaned-tool-result pass | `Ztp` `:533713-…` | `jJl` `:602202-…(193)` | Same `Set`-based structure, same order of `new Set` allocations. Not the fix. |
| Conversation token estimation | `Y0` `:442572-442576` with `eOd` `:442577-442599` | `:235350`/`:235369 (193)` | `anchorIndex` is **220=3 / 193=3**. The "resume from the last server-reported `usage` and only estimate the tail" optimisation is **carryover**. |
| The telemetry brackets | `tengu_api_before_normalize` `:509462`, `tengu_api_after_normalize` `:509509`, marks `query_message_normalization_start/end` | 2/2 and 2/2 | All carryover — 193 was already instrumented for this cost. |

**Remaining search space** for anyone picking this up: the main normalizer `NN` (`:531420`, 193 twin
`Dx` `:600274 (193)` — note 220's extra fourth parameter), `Lqs`/`Y2o`, and the media-byte-cap pass
`s1_`/`CGf`. The most likely shape, given the bullet's wording, is an `indexOf`/`findLast` over the
message array inside a per-message loop.

### 4.2 `.203` context-usage indicator re-analyzing the whole transcript

> *"Fixed a memory and per-turn CPU regression in interactive sessions: the context-usage indicator no
> longer re-analyzes the entire transcript after every turn."*

**Verdict: UNANCHORED.** `contextUsage`, `tengu_context_usage`, `contextUsagePercent`, `contextLeft`,
`usableContext`, `percentLeft` — all 0/0.

**Eliminated:** the indicator component itself. `hli` (`:742253-742289`) and its 193 twin `fic`
(`:627048-…(193)`) are both React-Compiler memoised with **the same three cache keys**
(`autoCompactWindow`, `model`, `tokenUsage`) and the same nested memo for the percentage
(`:742277-742279` ↔ `:627070-627072 (193)`). The user-visible string
`` `${p}% until auto-compact` `` is identical (`:742282` ↔ `:627074 (193)`). Also eliminated: the
token counter (§4.1, `anchorIndex` carryover).

So the regression and its fix are upstream of both — in whatever produces the `tokenUsage` prop — and
"the regression" was introduced *and* removed inside the `.19x`–`.203` span, i.e. **not observable as a
193↔220 diff at all**. That is the honest conclusion: a bullet that repairs a regression introduced
after the baseline leaves no two-point trace.

### 4.3 `.208` task-list updates re-rendering the whole UI, and `.203` live-preview updates

> `.208`: *"Improved input responsiveness while agent task lists update — task updates no longer
> re-render the entire UI."*
> `.203`: *"Improved responsiveness while long responses stream: live-preview updates no longer
> re-render the whole screen."*

**Verdict: UNANCHORED, both.** `livePreview` is **220=5 / 193=5** — every site is carryover. The
scoping pass's guess (React `memo` / `useSyncExternalStore` scoping) is the right *shape*: both fixes
are almost certainly a store subscription narrowed so that a task-list or preview mutation notifies
only its own subtree. Neither produces a literal, a constant, or a telemetry event.

What *can* be said: the bundle is compiled with the React Compiler (memo-cache slot arrays like
`oGf.c(12)` at `:742254` and `hUp[…]` at `:636492` are its signature), and 220 has more of them than
193 in the renderer region. That is consistent with the bullets but is not evidence for either
specific one — the compiler's slot count changes for unrelated reasons on every build.

### 4.4 `.211` 300 ms delay revealing async content

> *"Fixed a 300ms delay revealing async content (Settings tabs, Stats, diff views, and other loading
> states)."*

**Verdict: UNANCHORED — the constant is not isolable.** `delay: 300`, `loadingDelay`, `showAfter` are
0/0 in both. `delayMs` is 5/5. A bare `300` is far too common to diff. If the fix removed a
`setTimeout(…, 300)` guard around a suspense fallback, the *removal* leaves no literal at all — the
same "a default-on flip removes gating code" pattern `_GROUND_TRUTH` §3 flags for `.196`'s stream
watchdog.

### 4.5 `.211` "Improved terminal layout and rendering performance"

**Verdict: UNANCHORABLE BY CONSTRUCTION.** This is an umbrella bullet with no subject. `writableLength`
6/6, `syncOutput` 3/3. There is nothing to anchor and I decline to attach §2's renderer work to it —
that work is provable, but attributing it to *this* bullet rather than `.196`'s would be invention.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_performance.md](../00_overview/symbol_additions_v2_1_220_performance.md).

Key functions and constants in this document:
- `filterToolsByDenyRules` (`nve`, `:425004`) - holds the hoist `let r = mM(t);` at `:425005`; 193 twin `Rre` (`:444185 (193)`)
- `getDenyRuleForTool` (`WB`, `:513293`) - gained the third `precomputedDenyRules` parameter, `(r ?? mM(e))` at `:513296`; 193 twin `M9t` (`:597563 (193)`)
- `collectRulesFromSources` (`N_r`, `:513228`) - the per-call parse-and-allocate loop
- `getDenyRules` (`mM`, `:513237`) / `getAskRules` (`Bfe`, `:513240`)
- `PERMISSION_RULE_SOURCES` (`nfn`, `:514067`) - 10 sources; base five are `V$` (`:57678`)
- `parsePermissionRule` (`fg`, `:60333`) - the allocation-heavy `Tool(arg)` parser
- `matchToolNameGlob` (`SMi`, `:60306`) - **still** compiles a fresh `RegExp` per comparison; the un-taken optimisation
- `assembleToolPool` (`G7`, `:425008`) - the caller of `filterToolsByDenyRules`; 193 twin `AJ` (`:444188 (193)`)
- `isEndConversationTool` (`wKe`, `:513105`) - the `.214` carve-out newly guarding `getDenyRuleForTool`
- `blitEscapingAbsoluteRects` (`buy`, `:257235`) - pruned + de-recursed absolute-rect pass; 193 twin `uNi` (`:174493 (193)`)
- `hasAbsolutePositionChanged` (`guy`, `:257173`) - gained the same entry prune; 193 twin `sRd` (`:174433 (193)`)
- `paintChildNodes` (`GUu`, `:257189`) - the child walk that gained the `depth` argument; 193 twin `lNi` (`:174448 (193)`)
- `paintNode` (`Iho`, `:256820`) - the per-node paint entry, now takes `depth`
- `nodeRects` (`Ev`) - node→rect map read at `:257180`, `:257250`, written at `:257169`
- `renderMarkdownTable` (`EUp`, `:636292`) - row cap + per-cell memo; 193 twin `tKa` (`:380949 (193)`)
- `MAX_TABLE_ROWS` (`_Up`, `:636511`) - `200`
- `buildHiddenRowsNotice` (`bqo`, `:636278`) - three call sites `:636316`, `:636438`, `:636492`
- `normalizeMessagesForRequest` (`m1_`, `:509336`) - eliminated as the `.216` anchor; 193 twin `LGf` (`:594226 (193)`)
- `stripCrossModelThinking` (`U9s`, `:533670`) - **carryover**, byte-equivalent to `YSo` (`:602157 (193)`)
- `estimateConversationTokens` (`Y0`, `:442572`) with `findLastUsageAnchor` (`eOd`, `:442577`) - **carryover**
- `renderContextUsageIndicator` (`hli`, `:742253`) - **carryover** memo shape; 193 twin `fic` (`:627048 (193)`)
