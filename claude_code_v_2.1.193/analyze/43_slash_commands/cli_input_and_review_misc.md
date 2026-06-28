# CLI input, `/review`, and retry-cap miscellany (v2.1.183 → v2.1.193)

> **Type / version:** four independently-anchored deltas — `/add-dir` already-a-working-dir message (REFINEMENT, **2.1.193**); `/btw` ←/→ answer navigation (NET-NEW, **2.1.187**); `/review <pr>` → code-review medium engine (NEW, **2.1.186**); `CLAUDE_CODE_MAX_RETRIES` cap 15 + `CLAUDE_CODE_RETRY_WATCHDOG` redirect (FIX/upgrade-gotcha, **2.1.186**).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION 2.1.193, build a1938d2a). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged *(183)*. Each section is a self-contained before/after; they share no machinery beyond living in the CLI/slash surface.

---

## 1. `/add-dir`: tailored "already a working directory" message (2.1.193) — REFINEMENT

**What it does.** When you `/add-dir` a path that is *already* in scope, v2.1.193 replies with one of **three** tailored messages instead of one generic line, driven by two net-new result flags.

**How it works.** The add-dir resolver tags its `alreadyInWorkingDirectory` result with `isExactMatch` (the path resolves to an existing working dir exactly) and `isOriginalCwd` (that working dir is the session's original cwd). The formatter `formatAddDirResult` (`jot`, `cli_inner_pretty.js:177994`) branches on them:

```javascript
// ============================================
// formatAddDirResult (excerpt) - three-message alreadyInWorkingDirectory branch
// Location: cli_inner_pretty.js:177989 (flags) ; 178003-178011 (messages)
// ============================================

// ORIGINAL (for source lookup):
// resolver result:
//   resultType: "alreadyInWorkingDirectory", directoryPath: e, workingDir: s,
//   isExactMatch: jOt.resolve(s) === n, isOriginalCwd: s === o
case "alreadyInWorkingDirectory": {
  let t = Et.bold(e.directoryPath);
  if (e.isExactMatch)
    return e.isOriginalCwd
      ? `${t} is already the current working directory.`
      : `${t} is already added as a working directory.`;
  let n = e.isOriginalCwd ? "the current working directory" : "the additional working directory";
  return `${t} is already accessible within ${n} ${Et.bold(e.workingDir)}.`;
}

// READABLE (for understanding):
case "alreadyInWorkingDirectory": {
  let path = bold(result.directoryPath);
  if (result.isExactMatch)
    return result.isOriginalCwd
      ? `${path} is already the current working directory.`      // exact + cwd
      : `${path} is already added as a working directory.`;      // exact + an added dir
  let scope = result.isOriginalCwd ? "the current working directory" : "the additional working directory";
  return `${path} is already accessible within ${scope} ${bold(result.workingDir)}.`;  // path is a subdir of a working dir
}

// Mapping: jot→formatAddDirResult, e→result, isExactMatch/isOriginalCwd are the two NET-NEW flags
```

**183 before-picture.** The formatter `VZe` (`cli_inner_pretty.js:176903`, *183*) had a **single** line for this case: `"${path} is already accessible within the existing working directory ${workingDir}."` (183 `:176914`). The resolver produced only `{ resultType, directoryPath, workingDir }` — `grep -c isExactMatch` = **0 in 183 → 2 in 193**, `grep -c isOriginalCwd` = **0 → 3**.

**Why three messages.** The generic 183 line conflated three genuinely-different situations: re-adding your own cwd, re-adding a dir you already added, and adding a *subdirectory* of an existing working dir. The first two are no-ops the user should just be told "it's already there"; the third is the more surprising case (you asked to add `/proj/src` but `/proj` is already a working dir, so `/proj/src` is *accessible* but not *separately added*). Distinguishing them with `isExactMatch`/`isOriginalCwd` turns a confusing "why didn't it add?" into a precise explanation. **REFINEMENT, confidence: high.**

---

## 2. `/btw`: ←/→ navigation through earlier answers (2.1.187) — NET-NEW

**What it does.** The `/btw` side-question panel now lets you step **left/right** through earlier `/btw` answers with the arrow keys, selecting one to view; the `/btw` feature itself (ask a side question without interrupting Claude) is carryover.

**How it works.** The panel keeps a selected-index ref `_.current` (`null` = newest/live). The key handler clamps a step of `-1` (left) / `+1` (right) within the visible window `[lowerBound, total]`:

```javascript
// ============================================
// /btw key handler - ←/→ step through earlier answers
// Location: cli_inner_pretty.js:482757-482767
// ============================================

// ORIGINAL (for source lookup):
if (G.key === "left" || G.key === "right") {
  G.preventDefault();
  let J = g.current.length;
  if (J === 0) return;
  let q = Math.max(0, J - tTl),
    K = _.current ?? J,
    X = Math.max(q, Math.min(J, K + (G.key === "left" ? -1 : 1)));
  if (X === K) return;
  ((_.current = X === J ? null : X), H(_.current), v.current?.scrollTo(0));
  return;
}

// READABLE (for understanding):
if (key.name === "left" || key.name === "right") {
  key.preventDefault();
  let total = answers.current.length;
  if (total === 0) return;
  let lowerBound = Math.max(0, total - MAX_BTW_WINDOW);          // tTl = how many answers are reachable
  let cur = selectedIndex.current ?? total;                     // null → treat as "newest" (= total)
  let next = Math.max(lowerBound, Math.min(total, cur + (key.name === "left" ? -1 : 1)));  // ← -1, → +1
  if (next === cur) return;                                     // already at the edge
  selectedIndex.current = next === total ? null : next;         // back at newest → reset to live
  setSelected(selectedIndex.current);
  scrollRef.current?.scrollTo(0);                               // re-anchor the view
  return;
}

// Mapping: g→answers, _→selectedIndex, tTl→MAX_BTW_WINDOW, J→total, q→lowerBound, K→cur, X→next, H→setSelected, v→scrollRef
```

The render uses the selected index to dim the non-selected answers and bold the selected one (`dimColor: S !== J, bold: S === J`) and shows the `(+M earlier /btw)` overflow indicator (`cli_inner_pretty.js:482874`). The command regex is `BTW_COMMAND_REGEX` (`xpf = /^\/btw\b/gi`, `cli_inner_pretty.js:482363`).

**183 before-picture.** `/btw` exists in 183 — the regex `pWp = /^\/btw\b/gi` (183 `:473560`), the command def `name: "btw"` (183 `:474213`), and the `(+L earlier /btw)` indicator (183 `:474035`) are all present. But the answer list there renders **every** entry with `dimColor: !0` (183 `:474036`) — there is **no selected-index branch** and **no left/right handler**: `grep -c 'key === "left" ? -1 : 1'` = **0 in 183 → 1 in 193**, `grep -c 'dimColor: S !== J'` = **0 → 1**.

**Why a clamped ref with `null` = newest.** Modeling "no selection" as `null` (rather than `total`) lets the handler treat the live/newest answer specially: stepping right off the newest resets to `null` (`X === J ? null : X`), so the panel snaps back to following live output instead of pinning a stale index. The window lower bound `total - MAX_BTW_WINDOW` caps how far back you can scroll, bounding the retained answer history. **NET-NEW (the navigation), confidence: high.**

---

## 3. `/review <pr>`: same engine as `/code-review medium` (2.1.186) — NEW

**What it does.** The builtin `/review` command is now PR-scoped: given a PR number it fetches the PR via `gh`, runs the multi-phase review pipeline pinned to `effort: "medium"` (the same tier as `/code-review medium`), and presents a readable review.

**How it works.** The command `reviewCommand` (`oRf`, `cli_inner_pretty.js:538534`) gained `effort: "medium"`, an `argumentHint: "[pr number]"`, a sharper description, and a prompt builder that targets a PR:

```javascript
// ============================================
// reviewCommand - PR-scoped /review pinned to code-review medium effort
// Location: cli_inner_pretty.js:538534-538548 (def) ; 538509-538510 (prompt + fallback)
// ============================================

// ORIGINAL (for source lookup):
oRf = {
  type: "prompt", name: "review",
  description: "Review a GitHub pull request; for your working diff use /code-review",
  argumentHint: "[pr number]", effort: "medium", progressMessage: "reviewing pull request",
  contentLength: 0, source: "builtin",
  async getPromptForCommand(e) {
    let [t = "", ...n] = e.trim().split(/\s+/), r = t.replaceAll("`", "").replace(/^#/, "");
    return [{ type: "text", text: r ? rRf(r, n.join(" ")) : nRf }];
  },
};
// nRf = "Run `gh pr list` to show the open pull requests, then ask the user which one to review (`/review <number>`)."
// rRf = (pr, extra) => `Review target: GitHub pull request \`${pr}\`. ... gh pr view ${pr} --json ... ; gh pr diff ${pr} ... ${Hzn} ...`

// READABLE (for understanding):
reviewCommand = {
  type: "prompt", name: "review",
  description: "Review a GitHub pull request; for your working diff use /code-review",
  argumentHint: "[pr number]",
  effort: "medium",                          // <-- NEW: pins to the /code-review medium tier
  progressMessage: "reviewing pull request", contentLength: 0, source: "builtin",
  async getPromptForCommand(input) {
    let [first = "", ...rest] = input.trim().split(/\s+/);
    let pr = first.replaceAll("`", "").replace(/^#/, "");          // tolerate `#123` / `123`
    return [{ type: "text",
      text: pr ? buildPrReviewPrompt(pr, rest.join(" ")) : PR_REVIEW_FALLBACK_HINT }];  // rRf / nRf
  },
};

// Mapping: oRf→reviewCommand, rRf→buildPrReviewPrompt, nRf→PR_REVIEW_FALLBACK_HINT, Hzn→review pipeline body
```

`buildPrReviewPrompt` (`rRf`, `cli_inner_pretty.js:538510`) instructs the model to gather scope with `gh pr view <pr> --json title,body,author,baseRefName,headRefName,state,additions,deletions,changedFiles,labels` and `gh pr diff <pr>` (explicitly *instead of* any local `git diff`), scopes the review to the PR diff (local working-tree changes out of scope), folds in optional user instructions (the `extra` arg), then appends the shared multi-phase review pipeline `Hzn` and a "Present the review" section (overview + findings most-severe-first as `file:line — summary (failure scenario)`). With no PR given, `PR_REVIEW_FALLBACK_HINT` (`nRf`, `cli_inner_pretty.js:538509`) tells the model to `gh pr list` and ask which PR to review.

**183 before-picture.** The 183 command `Zrf` (`cli_inner_pretty.js:527336`, *183*) was `{ name: "review", description: "Review a pull request", … }` — **no `effort`, no `argumentHint`, no gh-pr prompt builder**. `grep -c 'effort: "medium"'` (review command) = **0 in 183 → 1 in 193**.

**Why pin `effort: "medium"`.** Routing `/review <pr>` through the existing `/code-review` engine at a fixed medium effort means PR review and working-diff review share one verified pipeline (`Hzn`) instead of a bespoke prompt, and the description now actively redirects working-diff use to `/code-review` so the two commands have a clean division of labor (PR vs working tree). **NEW capability, confidence: high.**

---

## 4. `CLAUDE_CODE_MAX_RETRIES` capped at 15; `CLAUDE_CODE_RETRY_WATCHDOG` for unattended (2.1.186) — FIX / upgrade-gotcha

**What it does.** Reading `CLAUDE_CODE_MAX_RETRIES` now **clamps** the value to 15 (with a one-time warning) and steers long-unattended-run users toward the retry watchdog instead of an unbounded retry count.

**How it works.** `getMaxRetries` (`O5f`, `cli_inner_pretty.js:603209`) parses the env var and, if it exceeds `MAX_RETRIES_CAP` (`Ujo = 15`), warns once and returns the cap:

```javascript
// ============================================
// getMaxRetries - clamp CLAUDE_CODE_MAX_RETRIES to 15 with a one-time warning
// Location: cli_inner_pretty.js:603209-603220   (Ujo=15 @603244, _5f=10 @603243, pZl @603261)
// ============================================

// ORIGINAL (for source lookup):
function O5f() {
  if (process.env.CLAUDE_CODE_MAX_RETRIES) {
    let e = parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
    if (Number.isFinite(e) && e >= 0) {
      if (e > Ujo) {
        if (!pZl) ((pZl = !0), T(`CLAUDE_CODE_MAX_RETRIES=${e} clamped to ${Ujo}`, { level: "warn" }));
        return Ujo;
      }
      return e;
    }
  }
  return _5f;
}

// READABLE (for understanding):
function getMaxRetries() {
  if (process.env.CLAUDE_CODE_MAX_RETRIES) {
    let requested = parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
    if (Number.isFinite(requested) && requested >= 0) {
      if (requested > MAX_RETRIES_CAP /*15*/) {
        if (!maxRetriesWarnedOnce) {                               // pZl — warn at most once per process
          maxRetriesWarnedOnce = true;
          warn(`CLAUDE_CODE_MAX_RETRIES=${requested} clamped to ${MAX_RETRIES_CAP}`);
        }
        return MAX_RETRIES_CAP;                                    // hard ceiling
      }
      return requested;
    }
  }
  return DEFAULT_MAX_RETRIES /*10*/;
}

// Mapping: O5f→getMaxRetries, Ujo→MAX_RETRIES_CAP(15), _5f→DEFAULT_MAX_RETRIES(10), pZl→maxRetriesWarnedOnce
```

**183 before-picture.** `vEf` (`cli_inner_pretty.js:591059`, *183*) had **no cap**: `if (Number.isFinite(e) && e >= 0) return e;` — it returned whatever the user set, verbatim. `grep -c "clamped to"` = **2 in 183 → 3 in 193** (the +1 is this warning; the 183 hits are unrelated).

**The watchdog is the redirect (CARRYOVER).** `CLAUDE_CODE_RETRY_WATCHDOG` is present in both bundles (`grep -c` = 2 in both). Its reader `isRetryWatchdogEnabled` (`jHe`, `cli_inner_pretty.js:602803`) = `parseBool(process.env.CLAUDE_CODE_RETRY_WATCHDOG)` gates the "retry-after too long" abort: `else if (((x = AX(g, C)), !jHe() && x > T5f)) throw …` (`cli_inner_pretty.js:603017`). With the watchdog **on**, `!jHe()` is false, so the `x > T5f` backoff-too-long abort is skipped — arbitrarily long backoffs are tolerated for genuinely unattended runs.

**Why cap retries but offer a watchdog.** A high `CLAUDE_CODE_MAX_RETRIES` (people set it to 100+ for overnight runs) interacts badly with exponential backoff: it can pin a session in a multi-hour retry storm with no human watching. The cap of 15 bounds the worst case, and the watchdog is the *intended replacement* for "I want this to keep trying forever" — it tolerates long backoffs while still being a deliberate, named opt-in. **Upgrade-gotcha:** anyone who set `CLAUDE_CODE_MAX_RETRIES > 15` will silently get 15 after upgrading (with one warning) and should switch to `CLAUDE_CODE_RETRY_WATCHDOG`. **FIX/refinement, confidence: high.**

---

## Evidence note (per item)

| Item | Token | 183 | 193 | Verdict |
|------|-------|-----|-----|---------|
| /add-dir message | `isExactMatch` / `isOriginalCwd` | 0 / 0 | 2 / 3 | REFINEMENT (3 messages) |
| /btw nav | `key === "left" ? -1 : 1` | 0 | 1 | NET-NEW (nav); /btw feature carryover |
| /review medium | `effort: "medium"` (review cmd) | 0 | 1 | NEW (PR-scoped, code-review engine) |
| MAX_RETRIES cap | `clamped to` | 2 | 3 | FIX (`Ujo=15` clamp + warning) |
| RETRY_WATCHDOG | `CLAUDE_CODE_RETRY_WATCHDOG` | 2 | 2 | CARRYOVER |

All 193 lines re-read in the live bundle. Drift fixed vs the scout dossier: the `/btw` step expression `key === "left" ? -1 : 1` is at **482763** (handler block opens **482757**; dossier said 482762); the watchdog backoff-abort guard is at **603017** (dossier said 603019).

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md), [rewind_before_clear.md](./rewind_before_clear.md), [plugin_auto_rename.md](./plugin_auto_rename.md), [hook_matcher_comma_fix.md](./hook_matcher_comma_fix.md).
- `/code-review` engine and effort tiers, and the LLM-API retry/backoff path, are documented in the v2.1.183 trees referenced from [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) (retries) and [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) (slash commands).

---

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (LLM-API retry path)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (CLI, `/btw`)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (retries, watchdog env)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (**Slash Commands** — `/add-dir`, `/review`)
> - per-feature additions: [symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md)

Key functions/constants in this document:

- `formatAddDirResult` (obf `jot`, `cli_inner_pretty.js:177994`) — three-message `alreadyInWorkingDirectory` branch via `isExactMatch`/`isOriginalCwd` (`:177989`); 183 `VZe` `:176903`.
- `/btw` key handler (`cli_inner_pretty.js:482757`) — ←/→ stepping `key === "left" ? -1 : 1` (`:482763`); `BTW_COMMAND_REGEX` (obf `xpf`, `:482363`); 183 `pWp` `:473560` (no selection).
- `reviewCommand` (obf `oRf`, `cli_inner_pretty.js:538534`) — `effort:"medium"`, `argumentHint:"[pr number]"`; 183 `Zrf` `:527336`.
- `buildPrReviewPrompt` (obf `rRf`, `cli_inner_pretty.js:538510`) / `PR_REVIEW_FALLBACK_HINT` (obf `nRf`, `:538509`) — gh-pr-diff prompt + no-PR fallback; pipeline `Hzn`.
- `getMaxRetries` (obf `O5f`, `cli_inner_pretty.js:603209`) — clamps `CLAUDE_CODE_MAX_RETRIES` to `MAX_RETRIES_CAP` (obf `Ujo`, `:603244`) = 15; default `_5f` = 10 (`:603243`); warn flag `pZl` (`:603261`); 183 `vEf` `:591059` (no cap).
- `isRetryWatchdogEnabled` (obf `jHe`, `cli_inner_pretty.js:602803`) — `CLAUDE_CODE_RETRY_WATCHDOG`; gate `!jHe() && x > T5f` (`:603017`); CARRYOVER.
