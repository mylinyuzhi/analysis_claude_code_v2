# simplify cleanup-only and code-review ultra cloud bridge

> Module 45 — `/code-review` and `/simplify` slash commands plus the **ultra** cloud multi-agent bridge in Claude Code **v2.1.156**.
> Source under analysis: `cli_inner_pretty.js` (single pretty-printed bundle).
> Cross-validation: `/lyz/codespace/3rd/claude-code/src/` (v2.1.88 readable TS).

## Related Symbols

> Symbol mappings live in the central index, not here:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent/Task tool `sq`/`Sp`)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (this module: code-review / simplify)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (teleport/remote session, gates)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (slash commands, skills, GitHub MCP)

Key symbols in this document (list format, never a table):

- `registerSimplify` (`vO9`) — registers the `/simplify` cleanup-only slash command (cli_inner_pretty.js:601350-601373).
- `SIMPLIFY_PROMPT` (`Ehz`) — the `/simplify` body: 4 cleanup agents in parallel + apply fixes (cli_inner_pretty.js:601378-601407).
- `simplifyPromptInit` (`kO9`) — module init that assigns `Ehz` (cli_inner_pretty.js:601375-601408).
- `gatherDiffPhase` (`dq$`) — "Phase 0 — Gather the diff" shared block (cli_inner_pretty.js:600275-600276).
- `reuseAngleBody` (`BI8`) — Reuse cleanup angle body (cli_inner_pretty.js:600277-600280).
- `simplificationAngle` (`cq$`) — Simplification cleanup angle (cli_inner_pretty.js:600281-600286).
- `efficiencyAngle` (`lq$`) — Efficiency cleanup angle (cli_inner_pretty.js:600287-600292).
- `altitudeAngle` (`nq$`) — Altitude cleanup angle (cli_inner_pretty.js:600293-600299).
- `registerCodeReview` (`zO9`) — registers the `/code-review` slash command (cli_inner_pretty.js:600612-600623).
- `CODE_REVIEW_NAME` (`Y18`) — `"code-review"` command-name constant (cli_inner_pretty.js:211646).
- `parseCodeReviewArgs` (`_O9`) — parses effort token / `ultra` / `--fix` / `--comment` / target (cli_inner_pretty.js:600530-600557).
- `buildCodeReviewPrompt` (`$hz`) — `getPromptForCommand` for `/code-review` (cli_inner_pretty.js:600564-600577).
- `buildEffortFallbackPreamble` (`qhz`) — composes the "ultra unavailable / can't self-launch" notice (cli_inner_pretty.js:600578-600611).
- `effortPromptMap` (`oyz`) — `{low,medium,high,xhigh,max}` → effort prompt body (cli_inner_pretty.js:600659).
- `EFFORT_LEVELS_LOCAL` (`pI8` = `EFFORT_LEVELS`/`dN`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:600660, 185009).
- `EFFORT_PREFIX_RE` (`tyz`) — matches `low*|med*|hig*|xhi*|max*` for "did you mean an effort?" detection (cli_inner_pretty.js:600661).
- `normalizeEffortToken` (`_kH`) — alias-resolve + validate effort token (cli_inner_pretty.js:184865-184869).
- `isEffortLevel` (`KkH`) — membership test against `dN` (cli_inner_pretty.js:184859-184861).
- `lowEffortPrompt` (`sf9`) — low review body (cli_inner_pretty.js:600360-600386).
- `mediumEffortPrompt` (`tf9`) — medium review body (cli_inner_pretty.js:600478-600501).
- `highEffortPrompt` (`ef9`) — high review body (cli_inner_pretty.js:600502-600526).
- `buildHighRecallEffortPrompt` (`HO9`) — xhigh/max review body factory (cli_inner_pretty.js:600389-600416).
- `COMMENT_SUFFIX_BLOCK` (`ayz`) — `--comment` posting instructions (cli_inner_pretty.js:600626-600637).
- `FIX_SUFFIX_BLOCK` (`syz`) — `--fix` apply instructions (cli_inner_pretty.js:600638-600649).
- `isCloudReviewAvailable` (`WF`) — ultra gate: config enabled + CCR bridge + not-remote (cli_inner_pretty.js:502747-502749).
- `getReviewBughunterConfig` (`x8$`) — reads `tengu_review_bughunter_config` (cli_inner_pretty.js:502732-502734).
- `getUltraCostNote` (`gIH`) / `getUltraDurationNote` (`Vs`) / `getUltraModel` (`LU4`) — config-driven labels (cli_inner_pretty.js:502735-502746).
- `isCloudCodeRunnerBridgeReady` (`dtH`) — `tengu_ccr_bridge` predicate (cli_inner_pretty.js:372224-372226).
- `isRemoteWorkspace` (`d6`) — workspace === "remote" (cli_inner_pretty.js:3190-3192).
- `fetchUltrareviewPreflight` (`WU4`) — `/v1/ultrareview/preflight` HTTP probe (cli_inner_pretty.js:502758-502792).
- `resolveUltraScope` (`re6`) — git-repo / PR / branch precondition resolver (cli_inner_pretty.js:502833-502895).
- `evaluateUltraPreflight` (`oe6`) — proceed / blocked / needs-confirm decision (cli_inner_pretty.js:502896-502915).
- `launchUltrareview` (`ae6`) — the cloud launcher: bundles diff, spawns teleport session (cli_inner_pretty.js:502916-503045).
- `runUltrareview` (`pN8`) — orchestrates gate → scope → preflight → launch (cli_inner_pretty.js:503046-503073+).
- `isInsideGitWorkTree` (`nP8`) — inside-git-work-tree check (cli_inner_pretty.js:372570-372575).
- `ULTRAREVIEW_ENV_ID` (`Y`, inline) — `"env_011111111111111111111113"` cloud environment id (cli_inner_pretty.js:502936).
- `AGENT_TOOL_NAME` (`sq`) — `"Agent"` tool-name constant referenced by all review prompts (cli_inner_pretty.js:185637).
- `SKILL_TOOL` (`ZX`) — `"Skill"` tool-name constant (cli_inner_pretty.js:216282).
- `registerBundledPromptCommand` (`bA`) — generic bundled prompt-command registrar (cli_inner_pretty.js:524187).
- `semverSimplifyRange` (`Tn1`, exported as `simplifyRange`) — **unrelated** semver helper (cli_inner_pretty.js:117204).

---

## TL;DR

Claude Code v2.1.156 ships **two related-but-distinct review commands** and one **cloud escalation path**:

1. **`/simplify`** — *cleanup-only*. Launches **4 review agents in parallel** (Reuse, Simplification, Efficiency, Altitude), dedups, then **applies the fixes**. It explicitly does **not** hunt correctness bugs (`vO9`/`Ehz`, cli_inner_pretty.js:601350-601407).
2. **`/code-review [low|medium|high|xhigh|max|ultra] [--fix] [--comment] [<target>]`** — *bug-hunting*. The local levels run a finder→verify→sweep pipeline tuned for precision (low/medium) or recall (high/xhigh/max). `--comment` posts inline PR comments, `--fix` applies findings (`zO9`/`_O9`/`$hz`, cli_inner_pretty.js:600530-600623).
3. **`/code-review ultra`** (deprecated alias **`/ultrareview`**) — a **deep multi-agent review that runs in the cloud** ("bughunter" fleet) via the teleport/remote-session bridge. The local CLI only resolves the scope, runs a billing/eligibility preflight, and launches a remote session; the actual fleet executes server-side (`WF`/`re6`/`oe6`/`ae6`/`pN8`, cli_inner_pretty.js:502747-503073).

Important scoping facts proven below:
- **`code-reviewer` is NOT a built-in agent** in 2.1.156. The string `"code-reviewer"` appears only inside the Agent/Task-tool prompt **examples** (`subagent_type: "code-reviewer"`, cli_inner_pretty.js:240554/240561/240585) and in the workflow `agent()` doc (cli_inner_pretty.js:376122). There is no built-in registration; the built-in agent registry guards (cli_inner_pretty.js:516778/516790/516814) treat `"built-in"` as a source kind but `code-reviewer` is never registered there.
- **`simplifyRange` (cli_inner_pretty.js:117204) is unrelated** — it is a re-export of the bundled **semver** library's `Tn1`, nothing to do with `/simplify`.

```
                 ┌──────────────────────── /code-review args ───────────────────────┐
                 │  rawFirstToken == "ultra" ?                                       │
   user types ───┤  yes → ultraFallback path        no → parse effort token (_kH)    │
                 └──────────┬───────────────────────────────┬───────────────────────┘
                            │                                │
            ultra requested │                  local level  │  low / medium / high / xhigh / max
                            ▼                                ▼
                 WF() ultra gate?                  EFFORT_PROMPT_MAP[level] (oyz)
              enabled && CCR && !remote        sf9 / tf9 / ef9 / $O9 / qO9  +  --fix/--comment bodies
                  /            \                              │
              true              false                        ▼  (runs in THIS session via Agent tool fan-out)
                │                  \
        runUltrareview (pN8)        qhz() notice → fall back to local <level>-effort review
   re6 scope → oe6 preflight → ae6 launch (teleport remote session, bughunter fleet)
```

---

## 1. `/simplify` — cleanup-only (the 2.1.154 rewrite)

### 1.1 Command registration

`/simplify` is registered through the generic bundled prompt-command registrar `registerBundledPromptCommand` (`bA`, cli_inner_pretty.js:524187). The factory `registerSimplify` (`vO9`) supplies the metadata and the prompt builder.

```javascript
// ============================================
// registerSimplify - registers the /simplify cleanup-only command
// Location: cli_inner_pretty.js:601350-601373
// ============================================

// ORIGINAL (for source lookup):
function vO9() {
  bA({
    name: "simplify",
    description:
      "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: !0,
    async getPromptForCommand(H) {
      let $ = H.trim();
      return [
        { type: "text", text: `${$ ? `Review target: \`${$}\`\n\n` : ""}${Ehz}` },
      ];
    },
  });
}

// READABLE (for understanding):
function registerSimplify() {
  registerBundledPromptCommand({
    name: "simplify",
    description:
      "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: true,
    async getPromptForCommand(rawArg) {
      let target = rawArg.trim();
      return [
        { type: "text", text: `${target ? `Review target: \`${target}\`\n\n` : ""}${SIMPLIFY_PROMPT}` },
      ];
    },
  });
}

// Mapping: vO9→registerSimplify, bA→registerBundledPromptCommand, H→rawArg, $→target, Ehz→SIMPLIFY_PROMPT
```

The prompt body string `SIMPLIFY_PROMPT` (`Ehz`) is declared as a `var` at cli_inner_pretty.js:601374 and **assigned lazily** in the module-init thunk `kO9` (cli_inner_pretty.js:601375-601408). This lazy assignment matters because the body interpolates `${sq}` (the Agent tool name, cli_inner_pretty.js:185637) and the four shared cleanup-angle fragments (`dq$`, `BI8`, `cq$`, `lq$`, `nq$`) — all of which live in a different module that must be initialized first (`Ff()` is called at the top of `kO9`, cli_inner_pretty.js:601376).

### 1.2 The `/simplify` body

```javascript
// ============================================
// SIMPLIFY_PROMPT - cleanup-only 4-agent body (assigned in module init kO9)
// Location: cli_inner_pretty.js:601378-601407
// ============================================

// ORIGINAL (for source lookup):
Ehz = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\`

You are improving the quality of the changed code, not hunting for bugs. Review
it for reuse, simplification, efficiency, and altitude issues, then fix what you
find. Do not look for correctness bugs — that is what \`/code-review\` is for.

${dq$}
## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent review agents** via the ${sq} tool, all in a
single message so they run concurrently. ...

### Reuse

${BI8}
${cq$}
${lq$}
${nq$}
## Phase 2 — Apply the fixes

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and fix each remaining one directly. Skip any finding whose
fix would change intended behavior, ... Finish with a brief summary ...`;

// READABLE (for understanding):
SIMPLIFY_PROMPT = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\`

You are improving the quality of the changed code, not hunting for bugs...

${DIFF_GATHER_PREAMBLE}            // Phase 0 — git diff @{upstream}...HEAD, etc.
## Phase 1 — Review (4 cleanup agents in parallel)
Launch 4 independent review agents via the Agent tool, in a single message...

### Reuse
${reuseAngle}                      // BI8
${simplificationAngle}            // cq$  (### Simplification)
${efficiencyAngle}                // lq$  (### Efficiency)
${altitudeAngle}                  // nq$  (### Altitude)
## Phase 2 — Apply the fixes
Wait for all four, dedup by line/mechanism, fix directly, skip behavior-changing fixes...`;

// Mapping: Ehz→SIMPLIFY_PROMPT, dq$→DIFF_GATHER_PREAMBLE, sq→"Agent", BI8→reuseAngle, cq$→simplificationAngle, lq$→efficiencyAngle, nq$→altitudeAngle
```

### 1.3 The four cleanup angles (shared with `/code-review`)

The four angle fragments are defined once and **reused by both `/simplify` and the cleanup portion of `/code-review`** (cli_inner_pretty.js:600275-600299):

- `dq$` — **Phase 0 / Gather the diff**: `git diff @{upstream}...HEAD` (or `main...HEAD` / `HEAD~1`), plus `git diff HEAD` for uncommitted work; honors a PR number/branch/path argument as the review target (cli_inner_pretty.js:600275-600276).
- `BI8` — **Reuse**: "Flag new code that re-implements something the codebase already has — Grep shared/utility modules … name the existing helper to call instead." (cli_inner_pretty.js:600277-600280).
- `cq$` — **Simplification**: redundant/derivable state, copy-paste with variation, deep nesting, dead code (cli_inner_pretty.js:600281-600286).
- `lq$` — **Efficiency**: redundant computation/IO, sequential independent ops, startup/hot-path blocking work (cli_inner_pretty.js:600287-600292).
- `nq$` — **Altitude**: "each change is implemented at the right depth, not as a fragile bandaid … prefer generalizing the underlying mechanism over adding special cases." (cli_inner_pretty.js:600293-600299).

**Key insight — single source of truth for cleanup angles.** Because `/simplify` and `/code-review`'s cleanup pass both interpolate the *same* `BI8`/`cq$`/`lq$`/`nq$` strings, the two commands give *identical* cleanup guidance. The only difference is that `/simplify` runs **only** those four angles, while `/code-review` runs them *alongside* its correctness-finder angles. This is the structural expression of the 2.1.154 product split: "simplify = quality only, code-review = bugs (+ optional cleanup)".

### 1.4 Cross-validation against v2.1.88 (confidence: HIGH that this is a rewrite)

In v2.1.88 `/simplify` was a **bundled skill** (`src/skills/bundled/simplify.ts`) titled *"Simplify: Code Review and Cleanup"*. It launched **three** agents — *Code Reuse*, *Code Quality*, *Efficiency* — and the body said "Review all changed files for reuse, quality, and efficiency. Fix any issues found." There was **no Altitude angle**, **no explicit "do not hunt for bugs" disclaimer**, and it used `${AGENT_TOOL_NAME}` rather than the spawn-Agent tool name.

The 2.1.156 evolution is therefore:

| Aspect | v2.1.88 `/simplify` skill | v2.1.156 `/simplify` command |
|--------|---------------------------|------------------------------|
| Agents | 3 (Reuse, Quality, Efficiency) | 4 (Reuse, Simplification, Efficiency, **Altitude**) |
| Scope | "reuse, quality, efficiency" | cleanup-only; **explicitly excludes correctness bugs** |
| Relationship | standalone | delegated companion to `/code-review` |
| Diff gathering | `git diff` / `git diff HEAD` | shared `dq$` Phase-0 (upstream merge-base aware) |

(The above table compares two *source builds*, not symbol mappings, so it is allowed under the "no symbol tables" rule.)

The changelog history confirms the churn: 2.1.147 renamed the *old* `/simplify` into `/code-review` (adding bug-hunting + effort levels + `--comment`); 2.1.152 made `/code-review --fix` apply findings; 2.1.154 reintroduced `/simplify` as the **cleanup-only** command documented here. So the *name* `/simplify` is old but the *current cleanup-only semantics* are **NEW post-2.1.88**.

---

## 2. `/code-review` — local bug-hunting with effort levels

### 2.1 Registration and the `Y18` name constant

`/code-review` is registered by `registerCodeReview` (`zO9`, cli_inner_pretty.js:600612-600623) using the name constant `Y18 = "code-review"` (cli_inner_pretty.js:211646). Crucially, the registration declares a **subcommand alias**: `subcommands: { ultra: "ultrareview" }` (cli_inner_pretty.js:600615) — this is how `/code-review ultra` is wired to the `/ultrareview` machinery.

```javascript
// ============================================
// registerCodeReview - registers /code-review with ultra subcommand
// Location: cli_inner_pretty.js:600612-600623
// ============================================

// ORIGINAL (for source lookup):
function zO9() {
  bA({
    name: Y18,
    subcommands: { ultra: "ultrareview" },
    description: eyz,
    argumentHint: Hhz,
    userInvocable: !0,
    getEffort(H) { return _O9(H).explicit; },
    getPromptForCommand: $hz,
  });
}

// READABLE (for understanding):
function registerCodeReview() {
  registerBundledPromptCommand({
    name: CODE_REVIEW_NAME,                       // "code-review"
    subcommands: { ultra: "ultrareview" },        // /code-review ultra → /ultrareview
    description: codeReviewDescription,           // eyz()
    argumentHint: codeReviewArgHint,              // Hhz()
    userInvocable: true,
    getEffort(args) { return parseCodeReviewArgs(args).explicit; },
    getPromptForCommand: buildCodeReviewPrompt,   // $hz
  });
}

// Mapping: zO9→registerCodeReview, bA→registerBundledPromptCommand, Y18→CODE_REVIEW_NAME, eyz→codeReviewDescription, Hhz→codeReviewArgHint, _O9→parseCodeReviewArgs, $hz→buildCodeReviewPrompt
```

The description and arg-hint are **dynamic** and gate on ultra availability `WF()`:
- `codeReviewDescription` (`eyz`, cli_inner_pretty.js:600558-600560) appends `"; ultra: deep multi-agent review in the cloud"` only when `WF()` is true.
- `codeReviewArgHint` (`Hhz`, cli_inner_pretty.js:600561-600563) appends `|ultra` to the level list only when `WF()` is true: `[low|medium|high|xhigh|max|ultra] [--fix] [--comment] [<target>]`.

### 2.2 Argument parsing — `parseCodeReviewArgs` (`_O9`)

```javascript
// ============================================
// parseCodeReviewArgs - splits ultra / effort token / --fix / --comment / target
// Location: cli_inner_pretty.js:600530-600557
// ============================================

// ORIGINAL (for source lookup):
function _O9(H) {
  let { rawFirstToken: $, flags: q, rest: K } = BN8(H, ["comment", "fix"]),
    _ = q.has("comment"), z = q.has("fix"),
    A = K.split(/\s+/).filter(Boolean), Y = A[0] ?? "";
  if ($.toLowerCase() === "ultra")
    return { explicit: void 0, target: A.slice(1).join(" "), comment: _, fix: z, unrecognizedLevel: void 0, ultraFallback: !0 };
  let f = Y.toLowerCase() === "ultra" ? void 0 : _kH(Y);
  if (f !== void 0)
    return { explicit: f, target: A.slice(1).join(" "), comment: _, fix: z, unrecognizedLevel: void 0, ultraFallback: !1 };
  let O = tyz.test(Y);
  return { explicit: void 0, target: K, comment: _, fix: z, unrecognizedLevel: O ? Y : void 0, ultraFallback: !1 };
}

// READABLE (for understanding):
function parseCodeReviewArgs(rawArgs) {
  let { rawFirstToken, flags, rest } = stripFlags(rawArgs, ["comment", "fix"]);  // BN8
  let comment = flags.has("comment"), fix = flags.has("fix");
  let words = rest.split(/\s+/).filter(Boolean), first = words[0] ?? "";

  // Case 1: literal "ultra" as the first token → cloud fallback path
  if (rawFirstToken.toLowerCase() === "ultra")
    return { explicit: undefined, target: words.slice(1).join(" "), comment, fix,
             unrecognizedLevel: undefined, ultraFallback: true };

  // Case 2: a recognized effort level (low/medium/high/xhigh/max) → local review
  let level = first.toLowerCase() === "ultra" ? undefined : parseEffortLevel(first);  // _kH
  if (level !== undefined)
    return { explicit: level, target: words.slice(1).join(" "), comment, fix,
             unrecognizedLevel: undefined, ultraFallback: false };

  // Case 3: first token *looks* like an effort word but isn't valid → record for a hint
  let looksLikeEffort = unrecognizedEffortRegex.test(first);  // tyz
  return { explicit: undefined, target: rest, comment, fix,
           unrecognizedLevel: looksLikeEffort ? first : undefined, ultraFallback: false };
}

// Mapping: _O9→parseCodeReviewArgs, BN8→stripFlags, _kH→parseEffortLevel, tyz→unrecognizedEffortRegex, $→rawFirstToken, q→flags, K→rest, A→words, Y→first, f→level, O→looksLikeEffort
```

**Decision walkthrough:**
1. `stripFlags` (`BN8`, cli_inner_pretty.js:502812-502821) removes `--comment`/`--fix` anywhere in the arg string (regex-bounded so `--fixup` is not matched) and returns the **first remaining token** plus the residue.
2. If that first token is literally `ultra`, set `ultraFallback: true` and consume the rest as the target. (This is the *same-session* entry; the dedicated `/code-review ultra` subcommand route goes through `pN8`/`ae6` — see §3.)
3. Otherwise parse the first token as an effort level via `parseEffortLevel`.
4. If neither, but the token *resembles* an effort word (regex `tyz`), capture it as `unrecognizedLevel` so the prompt can emit a polite "Ignoring unrecognized effort …; valid: low, medium, …" notice.

### 2.3 Effort levels and the prompt map

The effort vocabulary `EFFORT_LEVELS` is the array `dN = ["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009), aliased as `pI8 = dN` for this module (cli_inner_pretty.js:600660). The parser `parseEffortLevel` (`_kH`, cli_inner_pretty.js:184865-184869) lower-cases, resolves the alias map `s$7 = { med: "medium" }` (cli_inner_pretty.js:185010), then validates via `isValidEffort` (`KkH`, cli_inner_pretty.js:184859-184861, `dN.includes(...)`).

`effortPromptMap` (`oyz`) maps each level to a body (cli_inner_pretty.js:600659):

```javascript
oyz = { low: sf9, medium: tf9, high: ef9, xhigh: $O9, max: qO9 };
```

where `$O9 = HO9("xhigh")` and `qO9 = HO9("max")` (cli_inner_pretty.js:600527-600528) are produced by the recall-prompt factory `HO9`.

Each level encodes a distinct **finder × verify × cap** recipe (the one-line "pipeline tagline" sits at the top of each body):

- **low** (`sf9`, cli_inner_pretty.js:600360): `1 diff pass → no verify → ≤4 findings`. No subagents, no full-file reads, skips test/fixture hunks, hunk-only correctness bugs.
- **medium** (`tf9`, cli_inner_pretty.js:600478): `3+4 angles × 6 candidates → 1-vote verify → ≤8`. Precision-biased ("every finding a maintainer would act on").
- **high** (`ef9`, cli_inner_pretty.js:600502): `3+4 angles × 6 candidates → 1-vote recall-biased verify → ≤10`. Recall-biased.
- **xhigh / max** (`HO9`, cli_inner_pretty.js:600389-600416): `5+4 angles × 8 candidates → 1-vote verify → sweep → ≤15`. "max" reads as "maximum" effort, "xhigh" as "extra-high".

```javascript
// ============================================
// recallEffortPromptFactory - shared body for xhigh + max effort
// Location: cli_inner_pretty.js:600389-600416
// ============================================

// ORIGINAL (for source lookup):
HO9 = (H,) => `\`${H} effort → 5+4 angles \xD7 8 candidates → 1-vote verify → sweep → ≤15 findings\`

You are reviewing for **recall** at ${H === "max" ? "maximum" : "extra-high"} effort: catch every real bug. ...

${dq$}
## Phase 1 — Find candidates (5 correctness angles + 3 cleanup angles + 1 altitude angle, up to 8 each)

Run **9 independent finder angles** via the ${sq} tool. ...
${nyz}${U1q}${cq$}${lq$}${nq$}${F1q}${af9}
This is recall mode — a single non-REFUTED vote carries the finding. ...
${ryz}${Q1q(15)}`;

// READABLE (for understanding):
recallEffortPromptFactory = (level) => `\`${level} effort → 5+4 angles × 8 candidates → 1-vote verify → sweep → ≤15 findings\`

You are reviewing for recall at ${level === "max" ? "maximum" : "extra-high"} effort: catch every real bug...

${DIFF_GATHER_PREAMBLE}                              // dq$
## Phase 1 — Find candidates (5 correctness + 3 cleanup + 1 altitude angle, up to 8 each)
Run 9 independent finder angles via the Agent tool...
${correctnessAnglesA_E}${reuseAngleHdr}${simplificationAngle}${efficiencyAngle}${altitudeAngle}
${cleanupOutputNote}${verifyPhase}
recall mode — a single non-REFUTED vote carries the finding...
${sweepPhase}${outputSchema(15)}`;

// Mapping: HO9→recallEffortPromptFactory, H→level, dq$→DIFF_GATHER_PREAMBLE, sq→"Agent", nyz→correctnessAnglesA_E, U1q→reuseAngleHdr, cq$/lq$/nq$→cleanup angles, F1q→cleanupOutputNote, af9→verifyPhase, ryz→sweepPhase, Q1q→outputSchema
```

**Why a finder→verify→sweep pipeline (and why per-level tuning)?**
- **Finder angles** (Angle A line-by-line, B removed-behavior auditor, C cross-file tracer, D language-pitfall, E wrapper/proxy — `p1q`/`nyz`, cli_inner_pretty.js:600300-600437) are run as *independent* subagents so one angle's pessimism cannot suppress another's hit ("Do NOT let one angle's conclusions suppress another's").
- **Verify phase** (`af9` precision / `iyz` recall-biased, cli_inner_pretty.js:600442-600477) runs a single verifier per surviving candidate returning **CONFIRMED / PLAUSIBLE / REFUTED**. Low effort skips this entirely (speed); medium keeps it strict (precision); high/xhigh/max bias toward PLAUSIBLE (recall).
- **Sweep phase** (`ryz`, cli_inner_pretty.js:600329-600341) is a *fresh* reviewer that only looks for gaps the first pass missed — added only at xhigh/max.

The **trade-off knob** is uniform: more angles × more candidates × stricter-or-looser verify × higher output cap = recall up, latency/cost up. The taglines bake the recipe into the prompt so the model self-regulates.

### 2.4 Building the final prompt — `buildCodeReviewPrompt` (`$hz`)

```javascript
// ============================================
// buildCodeReviewPrompt - assembles notice + target + level body + flag bodies
// Location: cli_inner_pretty.js:600564-600577
// ============================================

// ORIGINAL (for source lookup):
async function $hz(H, $) {
  let { explicit: q, target: K, comment: _, fix: z, unrecognizedLevel: A, ultraFallback: Y } = _O9(H),
    f = Y ? "max" : q,
    O = $.options?.mainLoopModel,
    M = O ? (or(O, f ?? k3($)) ?? f) : (f ?? k3($)),
    j = M === void 0 ? "medium" : E1H(M),
    w = qhz({ ultraFallback: Y, fix: z, unrecognizedLevel: A, level: j, context: $ }),
    D = K ? `Review target: \`${K}\`\n\n` : "";
  return [{ type: "text", text: `${w}${D}${oyz[j]}${_ ? ayz : ""}${z ? syz : ""}` }];
}

// READABLE (for understanding):
async function buildCodeReviewPrompt(rawArgs, context) {
  let { explicit, target, comment, fix, unrecognizedLevel, ultraFallback } = parseCodeReviewArgs(rawArgs);
  let requestedLevel = ultraFallback ? "max" : explicit;          // ultra-fallback maxes out the LOCAL review
  let model = context.options?.mainLoopModel;
  let resolvedLevel = model
        ? (clampEffortToModel(model, requestedLevel ?? defaultEffort(context)) ?? requestedLevel)
        : (requestedLevel ?? defaultEffort(context));
  let level = resolvedLevel === undefined ? "medium" : effortForModel(resolvedLevel);  // E1H
  let notice = ultraFallbackNotice({ ultraFallback, fix, unrecognizedLevel, level, context });  // qhz
  let targetLine = target ? `Review target: \`${target}\`\n\n` : "";
  return [{ type: "text",
    text: `${notice}${targetLine}${EFFORT_PROMPT_MAP[level]}${comment ? commentFlagBody : ""}${fix ? fixFlagBody : ""}` }];
}

// Mapping: $hz→buildCodeReviewPrompt, _O9→parseCodeReviewArgs, qhz→ultraFallbackNotice, oyz→EFFORT_PROMPT_MAP, ayz→commentFlagBody, syz→fixFlagBody, or→clampEffortToModel, k3→defaultEffort, E1H→effortForModel, Y→ultraFallback, q→explicit
```

**Key behaviors:**
- When the user typed `ultra` but ultra runs in *this* session via the prompt path (not the subcommand route), the **local review is maxed out** (`requestedLevel = "max"`) and a notice is prepended explaining the fallback (§2.5).
- The level is **clamped to the model** via `resolveEffortForModel` (`or`) and `clampEffortLevel` (`E1H`). A weaker model cannot be asked for `max`-effort recall it can't deliver; with no model resolved, the default is `"medium"`.
- `--comment` appends `commentFlagBody` (`ayz`, cli_inner_pretty.js:600626-600637): post each finding as an inline PR comment via `mcp__github_inline_comment__create_inline_comment`, falling back to `gh api .../pulls/{pr}/comments`.
- `--fix` appends `fixFlagBody` (`syz`, cli_inner_pretty.js:600638-600649): apply findings to the working tree, skipping any fix that would change intended behavior.

### 2.5 The ultra-unavailable / can't-self-launch notice — `buildEffortFallbackPreamble` (`qhz`)

```javascript
// ============================================
// ultraFallbackNotice - explains why ultra fell back to a local review
// Location: cli_inner_pretty.js:600578-600611
// ============================================

// ORIGINAL (for source lookup):
function qhz({ ultraFallback: H, fix: $, unrecognizedLevel: q, level: K, context: _ }) {
  if (H) {
    if (!WF()) {
      if ($) return `(Running a local ${K}-effort review and applying its findings.)\n\n`;
      return `(ultra (cloud review) isn't available in this environment — see https://code.claude.com/docs/en/ultrareview. Falling back to a local ${K}-effort review.)\n\n`;
    }
    let z = _.options?.commands?.some((A) => A.name === "ultrareview" && jk(A)) ?? !1;
    if ($) return z ? `(Claude can't launch the cloud review directly — type \`/code-review ultra --fix\` ...)\n\n`
                    : `(Running a local ${K}-effort review and applying its findings.)\n\n`;
    return z ? `(Claude can't launch the cloud review directly — type \`/code-review ultra\` to run it. ...)\n\n`
             : `(Claude can't launch the cloud review directly — the user can run \`claude ultrareview\` from a terminal ...)\n\n`;
  }
  if (q !== void 0) return `(Ignoring unrecognized effort "${q}"; valid: ${pI8.join(", ")}. Using ${K}.)\n\n`;
  return "";
}

// READABLE (for understanding):
function ultraFallbackNotice({ ultraFallback, fix, unrecognizedLevel, level, context }) {
  if (ultraFallback) {
    if (!ultraAvailable()) {                                   // WF()
      if (fix) return `(Running a local ${level}-effort review and applying its findings.)\n\n`;
      return `(ultra (cloud review) isn't available in this environment — see https://code.claude.com/docs/en/ultrareview. Falling back to a local ${level}-effort review.)\n\n`;
    }
    // Ultra IS available, but the MODEL can't launch it itself — only the user can trigger billed cloud work.
    let ultraCommandRegistered = context.options?.commands?.some((c) => c.name === "ultrareview" && isCommandEnabled(c)) ?? false;
    if (fix) return ultraCommandRegistered
      ? `(Claude can't launch the cloud review directly — type \`/code-review ultra --fix\` ...)\n\n`
      : `(Running a local ${level}-effort review and applying its findings.)\n\n`;
    return ultraCommandRegistered
      ? `(Claude can't launch the cloud review directly — type \`/code-review ultra\` to run it. ...)\n\n`
      : `(... the user can run \`claude ultrareview\` from a terminal to start it. ...)\n\n`;
  }
  if (unrecognizedLevel !== undefined)
    return `(Ignoring unrecognized effort "${unrecognizedLevel}"; valid: ${EFFORT_LEVELS.join(", ")}. Using ${level}.)\n\n`;
  return "";
}

// Mapping: qhz→ultraFallbackNotice, WF→ultraAvailable, jk→isCommandEnabled, pI8→EFFORT_LEVELS, H→ultraFallback, $→fix, q→unrecognizedLevel, K→level, _→context
```

**Key insight — the model can never silently bill the user.** Even when ultra is *available* (`WF()` true), if the request reached the *prompt path* (the assistant interpolating the slash command rather than the user typing it as a top-level command), `qhz` refuses to launch and instead instructs the **user** to type `/code-review ultra` themselves, then runs a local review as a stopgap. This is consistent with the global guard at cli_inner_pretty.js:555571: *"It is user-triggered and billed; you cannot launch it yourself, so do not attempt to via Bash or otherwise."* The cloud path is gated behind explicit human consent by design.

---

## 3. `/code-review ultra` — the cloud bughunter bridge (NEW shape post-2.1.88)

The dedicated `/ultrareview` (and `/code-review ultra` via the subcommand alias) launches a **remote multi-agent "bughunter" fleet** that runs in Claude Code on the web. The local CLI's job is purely orchestration: gate → scope → preflight → launch a teleport session with the right env vars.

```
 user: /code-review ultra [<PR#>|<branch>] [--fix]
        │
        ▼
 runUltrareview (pN8)
   1. WF() ultra gate ───────────── false → "Ultrareview is currently unavailable."
   2. resolveUltraScope (re6) ───── git repo? PR# has remote? branch exists? diff non-empty?
   3. evaluateUltraPreflight (oe6)  ──► fetchUltrareviewPreflight (WU4) GET /v1/ultrareview/preflight
   4. needs-confirm? ─────────────── show "$10-$20 / ~10-20 min" → wait for $.confirm
   5. launchUltrareview (ae6) ────── _l(...) creates teleport remote session, BUGHUNTER_* env
        │
        ▼
   remote bughunter fleet runs in the cloud → results stream back as a task notification
```

### 3.1 The ultra availability gate — `isCloudReviewAvailable` (`WF`)

```javascript
// ============================================
// ultraAvailable - master gate for the ultra/ultrareview command
// Location: cli_inner_pretty.js:502732-502749
// ============================================

// ORIGINAL (for source lookup):
function x8$() { return V$("tengu_review_bughunter_config", null); }
function gIH() { let H = x8$()?.cost_note; return typeof H === "string" && H.length > 0 ? H : "$10-$20"; }
function Vs()  { let H = x8$()?.duration_note; return typeof H === "string" && H.length > 0 ? H : "~10–20 min"; }
function LU4() { let H = x8$()?.model; return typeof H === "string" && H.length > 0 ? H : void 0; }
function WF()  { return x8$()?.enabled === !0 && dtH() && !d6(); }

// READABLE (for understanding):
function bughunterConfig() { return getFeatureGate("tengu_review_bughunter_config", null); }   // V$
function ultraCostNote()   { return bughunterConfig()?.cost_note     || "$10-$20"; }
function ultraDurationNote(){ return bughunterConfig()?.duration_note || "~10–20 min"; }
function ultraModel()      { return bughunterConfig()?.model || undefined; }
function ultraAvailable() {
  return bughunterConfig()?.enabled === true   // gate flips it on
      && ccrBridgeAvailable()                  // dtH(): PO() && n0$() && tengu_ccr_bridge
      && !isRemoteWorkspace();                 // d6(): can't ultra from inside a remote workspace
}

// Mapping: x8$→bughunterConfig, V$→getFeatureGate, gIH→ultraCostNote, Vs→ultraDurationNote, LU4→ultraModel, WF→ultraAvailable, dtH→ccrBridgeAvailable, d6→isRemoteWorkspace
```

The gate has three conjuncts (cli_inner_pretty.js:502748):
1. `bughunterConfig()?.enabled === true` — the server-side `tengu_review_bughunter_config` feature gate must explicitly enable it (cli_inner_pretty.js:502732-502733). The same config object also carries `cost_note`, `duration_note`, `model`, and the fleet-sizing knobs (`fleet_size`, `max_duration_minutes`, `agent_timeout_seconds`, `total_wallclock_minutes` — consumed in `ae6`, §3.4).
2. `ccrBridgeAvailable()` (`dtH`, cli_inner_pretty.js:372224-372226) = `PO() && n0$() && getFeatureGate("tengu_ccr_bridge", false)` — the Claude-Code-on-the-web / remote-control bridge must be live.
3. `!isRemoteWorkspace()` (`d6`, cli_inner_pretty.js:3190-3192) — you cannot launch a *cloud* review from inside a workspace that is *itself* already remote (no nesting).

### 3.2 Scope resolution — `resolveUltraScope` (`re6`)

`resolveUltraScope` (cli_inner_pretty.js:502833-502895) turns the raw argument into one of two scopes — `{mode:"pr", prNumber, repo}` or `{mode:"branch", headBranch, baseBranch, mergeBaseSha, diffStat}` — or an actionable error. Its precondition chain (each failure emits `tengu_review_remote_precondition_failed`):

1. **Must be in a git repo** — `nP8()` (cli_inner_pretty.js:372570-372575, `git rev-parse --is-inside-work-tree`). If not: "Run `git init`…".
2. **Pure-numeric arg → PR mode** — requires a GitHub remote (`uR()`). If none: "run `gh repo create --source=. --push`…".
3. **Repo-too-large guard** — `y74()` (for the no-PR bundle path): "Push a PR and use `<PR#>` instead."
4. **Named branch arg** — must exist as `origin/<branch>` or `<branch>`, else "not a branch in this repo".
5. **Branch mode** — computes `merge-base` against `origin/<base>` (falling back to local `<base>`), default base `"main"` (cli_inner_pretty.js:502872), head from `pw()` or `"HEAD"`.
6. **Empty-diff guard** — `git diff --shortstat <mergeBase>`; if empty: "no new commits or changes … Stage or commit them first?"

This front-loads all the failure modes locally so the cloud session is never spun up for a request that can't possibly produce a diff.

### 3.3 Billing/eligibility preflight — `evaluateUltraPreflight` (`oe6`) + `fetchUltrareviewPreflight` (`WU4`)

```javascript
// ============================================
// evaluateUltraPreflight - server preflight → proceed / blocked / needs-confirm
// Location: cli_inner_pretty.js:502896-502915
// ============================================

// ORIGINAL (for source lookup):
async function oe6() {
  let H = await WU4();
  if (!H) return { kind: "proceed", billingNote: "" };
  let $ = H.billing_note ?? "";
  switch (H.action) {
    case "proceed": return { kind: "proceed", billingNote: $ };
    case "blocked": return { kind: "blocked", reason: H.blocked?.reason ?? "server",
                             message: H.blocked?.message ?? "Ultrareview is unavailable for your organization.",
                             actionUrl: H.blocked?.action_url ?? null };
    case "confirm": {
      if (GU4) return { kind: "proceed", billingNote: $ };
      return { kind: "needs-confirm", body: `This review bills as usage credits (${gIH()}).`, billingNote: $ };
    }
  }
}

// READABLE (for understanding):
async function evaluateUltraPreflight() {
  let preflight = await fetchUltrareviewPreflight();             // WU4
  if (!preflight) return { kind: "proceed", billingNote: "" };  // probe failed → optimistic proceed
  let billingNote = preflight.billing_note ?? "";
  switch (preflight.action) {
    case "proceed": return { kind: "proceed", billingNote };
    case "blocked": return { kind: "blocked", reason: preflight.blocked?.reason ?? "server",
                             message: preflight.blocked?.message ?? "Ultrareview is unavailable for your organization.",
                             actionUrl: preflight.blocked?.action_url ?? null };
    case "confirm":
      if (ultraConsentRemembered) return { kind: "proceed", billingNote };  // GU4 latched by ie6()
      return { kind: "needs-confirm", body: `This review bills as usage credits (${ultraCostNote()}).`, billingNote };
  }
}

// Mapping: oe6→evaluateUltraPreflight, WU4→fetchUltrareviewPreflight, gIH→ultraCostNote, GU4→ultraConsentRemembered, H→preflight, $→billingNote
```

`fetchUltrareviewPreflight` (`WU4`, cli_inner_pretty.js:502758-502792) calls `GET /v1/ultrareview/preflight` with `auth: "teleport-org"` and a 5s timeout. Before any network call, however, it honors a **test/CI override**: if `CLAUDE_CODE_ULTRAREVIEW_PREFLIGHT_FIXTURE` is set, it Zod-parses that env-var string as the preflight response via `PU4().safeParse(...)` and returns it directly, skipping the HTTP request entirely (cli_inner_pretty.js:502759-502763). This gives deterministic preflight behavior for tests/CI without a `teleport-org` round-trip (an invalid fixture parses to `null`, which `oe6` treats as the optimistic `proceed`). It maps server refusal reasons to user-facing blocks (cli_inner_pretty.js:502766-502780): `essential-traffic-only` → "unavailable when essential-traffic-only mode is active" (reason `zdr`); `data-residency` → "unavailable on third-party providers"; `no-auth` → "requires a Claude.ai account. Run /login". The response is Zod-validated against the schema `PU4` (cli_inner_pretty.js:502800-502810). The consent latch `GU4` is set by `ie6()` (cli_inner_pretty.js:502826-502828) once the user confirms, so subsequent `confirm` actions in the same session auto-proceed.

### 3.4 The launcher — `launchUltrareview` (`ae6`)

```javascript
// ============================================
// launchUltrareview - bundles the diff and spawns a teleport remote session
// Location: cli_inner_pretty.js:502916-503045
// ============================================

// ORIGINAL (for source lookup):
async function ae6(H, $, q, K) {
  let _ = K?.invocation ?? "/code-review ultra",
    z = (V) => ({ launched: !1, blocks: [{ type: "text", text: V }] }),
    A = await ALH({ allowBundle: !0 });
  if (!A.eligible) { /* map errors: not_in_git_repo / no_git_remote → guidance; return z(...) */ }
  let Y = "env_011111111111111111111113", f = x8$(),
    O = (V, v, E) => { /* clamp config number to (0, E], default v */ },
    M = LU4(),
    j = { BUGHUNTER_DRY_RUN: "1",
          BUGHUNTER_FLEET_SIZE: String(O(f?.fleet_size, 5, 20)),
          BUGHUNTER_MAX_DURATION: String(O(f?.max_duration_minutes, 10, 25)),
          BUGHUNTER_AGENT_TIMEOUT: String(O(f?.agent_timeout_seconds, 600, 1800)),
          BUGHUNTER_TOTAL_WALLCLOCK: String(O(f?.total_wallclock_minutes, 22, 27)),
          ...(M && { BUGHUNTER_MODEL: M }),
          ...(process.env.BUGHUNTER_DEV_BUNDLE_B64 && { BUGHUNTER_DEV_BUNDLE_B64: process.env.BUGHUNTER_DEV_BUNDLE_B64 }) };
  // ... mode === "pr": _l({ branchName: refs/pull/<n>/head, env: BUGHUNTER_PR_NUMBER/REPOSITORY, ...j })
  // ... else branch: _l({ useBundle: true, bundleBaseRef: mergeBaseSha, env: BUGHUNTER_BASE_BRANCH, ...j })
  // ... register task OSH({ remoteTaskType: "ultrareview", ... }); emit tengu_review_remote_launched
}

// READABLE (for understanding):
async function launchUltrareview(scope, context, billingNote, opts) {
  let invocation = opts?.invocation ?? "/code-review ultra";
  let fail = (msg) => ({ launched: false, blocks: [{ type: "text", text: msg }] });
  let eligibility = await checkRemoteReviewEligibility({ allowBundle: true });   // ALH
  if (!eligibility.eligible) { /* not_in_git_repo / no_git_remote guidance → return fail(...) */ }

  const ULTRAREVIEW_ENV_ID = "env_011111111111111111111113";
  let config = bughunterConfig();
  let clamp = (val, dflt, max) => (typeof val === "number" && Number.isFinite(val) && Math.floor(val) > 0
                                     ? (Math.floor(val) > max ? dflt : Math.floor(val)) : dflt);
  let bughunterEnv = {
    BUGHUNTER_DRY_RUN: "1",
    BUGHUNTER_FLEET_SIZE:      String(clamp(config?.fleet_size, 5, 20)),
    BUGHUNTER_MAX_DURATION:    String(clamp(config?.max_duration_minutes, 10, 25)),
    BUGHUNTER_AGENT_TIMEOUT:   String(clamp(config?.agent_timeout_seconds, 600, 1800)),
    BUGHUNTER_TOTAL_WALLCLOCK: String(clamp(config?.total_wallclock_minutes, 22, 27)),
    ...(ultraModel() && { BUGHUNTER_MODEL: ultraModel() }),
    ...(process.env.BUGHUNTER_DEV_BUNDLE_B64 && { BUGHUNTER_DEV_BUNDLE_B64: process.env.BUGHUNTER_DEV_BUNDLE_B64 }),
  };
  if (scope.mode === "pr") {
    session = await createTeleportSession({ source: "ultrareview", branchName: `refs/pull/${scope.prNumber}/head`,
      environmentId: ULTRAREVIEW_ENV_ID, tags: ["ultrareview"],
      environmentVariables: { BUGHUNTER_PR_NUMBER: scope.prNumber, BUGHUNTER_REPOSITORY: `${owner}/${name}`, ...bughunterEnv } });
  } else {
    session = await createTeleportSession({ source: "ultrareview", useBundle: true, bundleBaseRef: scope.mergeBaseSha,
      environmentId: ULTRAREVIEW_ENV_ID, tags: ["ultrareview"],
      environmentVariables: { BUGHUNTER_BASE_BRANCH: scope.mergeBaseSha, ...bughunterEnv } });
  }
  if (!opts?.skipTaskRegistration) taskId = registerRemoteTask({ remoteTaskType: "ultrareview", session, ... }).taskId;
  emit("tengu_review_remote_launched", {});
  return { launched: true, sessionId: session.id, sessionUrl: getSessionUrl(session.id), taskId,
           blocks: [{ type: "text", text: `${prefix}Ultrareview launched for ${title} (${ultraDurationNote()}, runs in the cloud). Track: ${url}${scopeLine}` }] };
}

// Mapping: ae6→launchUltrareview, ALH→checkRemoteReviewEligibility, x8$→bughunterConfig, LU4→ultraModel, _l→createTeleportSession, OSH→registerRemoteTask, YLH→getSessionUrl, Vs→ultraDurationNote, H→scope, $→context, q→billingNote, K→opts, O→clamp, j→bughunterEnv, Y→ULTRAREVIEW_ENV_ID
```

**Fleet sizing algorithm.** Each `BUGHUNTER_*` knob comes from `bughunterConfig()` but is **clamped** by the inline helper `clamp(val, default, max)` (cli_inner_pretty.js:502938-502943): a server-supplied value must be a finite positive integer ≤ max, otherwise the default is used. So the fleet defaults to 5 agents (cap 20), 10 min max duration (cap 25), 600s per-agent timeout (cap 1800), 22 min total wall-clock (cap 27). This guards against a misconfigured gate forcing an unbounded/zero fleet.

**Two delivery shapes.** PR mode checks out `refs/pull/<n>/head` directly in the cloud; branch mode **bundles** the local working tree (`useBundle: true`, `bundleBaseRef: mergeBaseSha`) so even un-pushed local branches can be reviewed. Both pin the fixed cloud environment id `"env_011111111111111111111113"` (cli_inner_pretty.js:502936). The remote session is registered as a task of type `"ultrareview"` (`OSH`, cli_inner_pretty.js:503019-503026), and `tengu_review_remote_launched` fires (cli_inner_pretty.js:503027). When the remote run finishes (or fails — `j44`, cli_inner_pretty.js:376731-376741, "Remote review did not produce output … retry /code-review ultra, or use /review for a local review"), results stream back as a task notification.

### 3.5 Orchestration — `runUltrareview` (`pN8`)

`runUltrareview` (cli_inner_pretty.js:503046-503073) is the top of the stack: it short-circuits on `!WF()` ("Ultrareview is currently unavailable."), then chains `resolveUltraScope → evaluateUltraPreflight → (needs-confirm with cost/duration) → launchUltrareview`. The confirm gate appears twice: once from the **server** preflight (`needs-confirm` action) and once **locally** (`!$.confirm`) showing the scope + `~10-20 min · Est. cost $10-$20 USD` (cli_inner_pretty.js:503061-503072). Both must be satisfied before `ae6` runs.

---

## 4. `code-reviewer` is NOT a built-in agent (anchor 240554)

This is a common misread, so it is stated explicitly. The token `code-reviewer` appears in the bundle **only** as:

1. **Prompt examples inside the Agent/Task tool description** (cli_inner_pretty.js:240552-240564 and 240580-240591): the model is *shown* how a user might request `subagent_type: "code-reviewer"` for an independent second opinion. These are few-shot examples, not registrations.
2. **The SDK hook-input schema doc** (cli_inner_pretty.js:336657): `'Agent type name (e.g., "general-purpose", "code-reviewer")'` — illustrative.
3. **The workflow `agent()` runtime doc** (cli_inner_pretty.js:376122): `opts.agentType uses a custom subagent type (e.g. 'Explore', 'code-reviewer')` — explicitly described as a *custom* subagent resolved from the same registry as the Agent tool, i.e. user/project-defined, not built-in.

There is **no `bA`/agent-registry call** that registers a `code-reviewer` agent, and the built-in agent guards (`Cannot save/update/delete built-in agents`, cli_inner_pretty.js:516778/516790/516814) operate on `source === "built-in"` — a `code-reviewer` agent only exists if a user or plugin defines one. (cli_inner_pretty.js:475611 shows the *plugin* `code-review@claude-code-plugins` in a generated GitHub Action, which is a separate plugin distribution, not a built-in agent.)

**Confidence: HIGH** — confirmed by exhaustive grep of `code-reviewer` across the bundle; every occurrence is a string literal in documentation/example text.

## 5. `simplifyRange` is unrelated (anchor 117204)

```javascript
// ============================================
// semverSimplifyRange - semver library export, NOT the /simplify command
// Location: cli_inner_pretty.js:117200-117214
// ============================================

// ORIGINAL (for source lookup):
{ outside: Pn1, gtr: Wn1, ltr: Zn1, intersects: Gn1,
  simplifyRange: Tn1, subset: Vn1, SemVer: Ul1, re: hz6.re, ... }

// READABLE (for understanding):
// This is the exports object of the bundled `semver` package. `simplifyRange`
// here is semver's range-simplification utility (Tn1), alongside SemVer, satisfies,
// intersects, subset, etc. It has nothing to do with the /simplify slash command.

// Mapping: simplifyRange→semver.simplifyRange (Tn1), neighboring keys are semver exports
```

The surrounding keys (`SemVer`, `intersects`, `subset`, `SEMVER_SPEC_VERSION`, `compareIdentifiers`) and the immediately following module that does `vn1.satisfies(process.version, ">=15.7.0")` (cli_inner_pretty.js:117216-117219) make the provenance unambiguous: this is the vendored **semver** library. **Confidence: HIGH** — purely an unrelated naming collision flagged in the scope note.

---

## 6. Why this design (cross-cutting rationale)

**Two commands instead of one flag.** Splitting `/simplify` (cleanup) from `/code-review` (bugs) lets each have a focused, single-purpose prompt. A reviewer told to do "everything" tends to dilute; the `dq$`+four-angle reuse means the *cleanup* guidance is byte-identical across both, while only `/code-review` adds the correctness finders. This is cheaper to maintain than one giant configurable prompt.

**Effort as a discrete dial, model-clamped.** Five named levels (`low…max`) each ship a self-describing tagline (`5+4 angles × 8 candidates → … → ≤15`). The model reads its own budget from the prompt, and `clampEffortToModel` prevents asking a small model for recall it can't deliver. Discrete levels (vs. a free numeric) keep the UX legible and the prompt bodies pre-authored.

**Cloud escalation behind a hard human-consent wall.** The ultra path costs real money ("$10-$20") and time ("~10-20 min"), so it is gated four ways: a server feature gate (`tengu_review_bughunter_config.enabled`), the CCR bridge, a non-remote workspace, and an explicit user confirmation (latched by `ie6`/`GU4`). The model is *structurally* prevented from launching it (`qhz` always defers to the user). Local resolution of all preconditions (`re6`) means no cloud session is ever wasted on a request with an empty diff or a missing remote.

**Key insight:** the whole module is a *graceful-degradation ladder* — `ultra` (cloud, max recall, billed) → falls back to local `max` → which clamps to the model's true ceiling → with a transparent one-line notice (`qhz`) at every step explaining exactly what happened and what the user can do to get the next tier up. The user is never silently downgraded.

---

## Cross-validation summary

| Feature | v2.1.88 precursor | v2.1.156 state | Confidence |
|---------|-------------------|----------------|------------|
| `/simplify` | bundled skill, 3 agents (Reuse/Quality/Efficiency), `src/skills/bundled/simplify.ts` | cleanup-only command, 4 agents (+Altitude), excludes bugs | HIGH (rewrite) |
| `/code-review` | did not exist (was `/simplify` until 2.1.147 rename) | bug-hunting w/ 5 effort levels, `--fix`/`--comment` | HIGH (NEW shape) |
| effort levels | n/a | `["low","medium","high","xhigh","max"]` (`dN`) | HIGH |
| `/ultrareview` | `src/commands/review.ts` exports `ultrareview`; `src/commands/bughunter/` | `WF` gate + `re6`/`oe6`/`ae6` teleport bridge, `tengu_review_bughunter_config` | MEDIUM-HIGH (evolved; teleport plumbing matured) |
| `code-reviewer` agent | example-only in coreSchemas/agentContext | example-only (NOT built-in) | HIGH |
| `simplifyRange` | semver lib | semver lib (unrelated) | HIGH |

(The table above compares *source builds*, not symbol mappings — permitted under the project rules.)
