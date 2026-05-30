# code-review command parsing effort fix comment

> Module 45 — `/code-review` and `/simplify` slash commands plus the cloud `ultra` bridge in Claude Code v2.1.156.
> Covers the argument parser, the five-level effort ladder, the `ultra` → `ultrareview` cloud sub-command, and the
> `--comment` / `--fix` post-processing blocks.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this document:
- `CODE_REVIEW_NAME` (`Y18`) — `"code-review"` command-name constant (cli_inner_pretty.js:211646)
- `registerBundledPromptCommand` (`bA`) — generic bundled prompt-command registrar; pushes onto `Ji4` (cli_inner_pretty.js:524187)
- `registerCodeReview` (`zO9`) — code-review registration call site, wires `subcommands: { ultra: "ultrareview" }` (cli_inner_pretty.js:600612)
- `parseCodeReviewArgs` (`_O9`) — argument parser: first-token effort, `ultra` fallback, `--comment`/`--fix`, target (cli_inner_pretty.js:600530)
- `tokenizeFlags` (`BN8`) — strips named `--flags` and returns `{rawFirstToken, flags, rest}` (cli_inner_pretty.js:502812)
- `normalizeEffortToken` (`_kH`) — lowercases + alias-maps a token, returns a valid effort or `void 0` (cli_inner_pretty.js:184865)
- `isEffortLevel` (`KkH`) — membership test against `dN` (cli_inner_pretty.js:184859)
- `clampEffortLevel` (`E1H`) — coerce arbitrary value to a valid effort, default `"high"` (cli_inner_pretty.js:184960)
- `EFFORT_LEVELS` (`dN` / `pI8`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `EFFORT_ALIASES` (`s$7`) — `{ med: "medium" }` (cli_inner_pretty.js:185010)
- `buildCodeReviewPrompt` (`$hz`) — prompt builder; resolves effort, assembles body + suffix blocks (cli_inner_pretty.js:600564)
- `buildEffortFallbackPreamble` (`qhz`) — emits the cloud-fallback / unrecognized-level preamble (cli_inner_pretty.js:600578)
- `effortPromptMap` (`oyz`) — `{ low, medium, high, xhigh, max }` → effort-specific prompt body (cli_inner_pretty.js:600659)
- `buildHighRecallEffortPrompt` (`HO9`) — factory for the `xhigh`/`max` 9-angle prompt body (cli_inner_pretty.js:600389)
- `COMMENT_SUFFIX_BLOCK` (`ayz`) — the `## Posting to GitHub (--comment)` block (cli_inner_pretty.js:600626)
- `FIX_SUFFIX_BLOCK` (`syz`) — the `## Applying fixes (--fix)` block (cli_inner_pretty.js:600638)
- `isCloudReviewAvailable` (`WF`) — gate for `ultra`/cloud review availability (cli_inner_pretty.js:502747)
- `registerSimplify` (`vO9`) — `/simplify` registration, cleanup-only (cli_inner_pretty.js:601350)
- `resolveEffortForModel` (`or`) — clamps requested effort against the active model's ceiling (cli_inner_pretty.js:184909)
- `getEffortFromState` (`k3`) — reads the session's effort value through permission layers (cli_inner_pretty.js:453183)
- `isCommandEnabled` (`jk`) — `isEnabled?.() ?? true` for a registered command (cli_inner_pretty.js:395641)

---

## TL;DR

`/code-review` is a **bundled prompt slash command** (no JSX, no React) registered through the generic
`registerBundledPromptCommand` (`bA`, cli_inner_pretty.js:524187) helper; the registration call site is
`registerCodeReview` (`zO9`, cli_inner_pretty.js:600612). Its entire behavior is *string
assembly*: parse the argument line, pick one of five effort levels, splice the matching effort-specific prompt
body, and tack on optional `--comment` / `--fix` instruction blocks. The model then does the actual reviewing by
spawning Task sub-agents — the command itself runs zero tools.

The argument parser `parseCodeReviewArgs` (`_O9`, cli_inner_pretty.js:600530) is a small state machine over the
argument line:

```
/code-review [low|medium|high|xhigh|max|ultra] [--fix] [--comment] [<target>]
```

The single special case is the literal first token `ultra`: it is **not** an effort level. Instead it is a
sub-command alias that maps to the cloud `/ultrareview` flow (`subcommands: { ultra: "ultrareview" }`,
cli_inner_pretty.js:600615). When the cloud path is unavailable, `ultra` *falls back* to a local `max`-effort
review, with a preamble explaining what happened.

Two changelog events bracket this module:
- **2.1.147** renamed `/simplify` → `/code-review`, added effort levels and `--comment` inline-PR-comment posting,
  and removed the old cleanup-and-fix behavior (CHANGELOG.md:169).
- **2.1.152** made `/code-review --fix` apply findings to the working tree, and pointed `/simplify` at
  `/code-review --fix` (CHANGELOG.md:95). **2.1.154** then re-split them: `/simplify` became a cleanup-only review
  (no bug hunting) with its own 4-agent prompt (CHANGELOG.md:14).

---

## 1. Where it lives and how it registers

### The command-name constant

`/code-review` shares a constant block with `/verify`, `/commit`, and `/commit-push-pr`:

```javascript
// ============================================
// CODE_REVIEW_NAME - the "code-review" command-name constant
// Location: cli_inner_pretty.js:211646-211649
// ============================================

// ORIGINAL (for source lookup):
var Y18 = "code-review",
  T97 = "verify",
  e26 = "commit",
  HZ6 = "commit-push-pr";

// READABLE (for understanding):
const CODE_REVIEW_NAME = "code-review";
const VERIFY_NAME = "verify";
const COMMIT_NAME = "commit";
const COMMIT_PUSH_PR_NAME = "commit-push-pr";

// Mapping: Y18→CODE_REVIEW_NAME, T97→VERIFY_NAME, e26→COMMIT_NAME, HZ6→COMMIT_PUSH_PR_NAME
```

### The registration call

`registerCodeReview` (`zO9`, cli_inner_pretty.js:600612) is the single declarative spec for the command. It hands
a config object to the generic registrar `registerBundledPromptCommand` (`bA`).

```javascript
// ============================================
// registerCodeReview - declares the /code-review bundled command
// Location: cli_inner_pretty.js:600612-600624
// ============================================

// ORIGINAL (for source lookup):
function zO9() {
  bA({
    name: Y18,
    subcommands: { ultra: "ultrareview" },
    description: eyz,
    argumentHint: Hhz,
    userInvocable: !0,
    getEffort(H) {
      return _O9(H).explicit;
    },
    getPromptForCommand: $hz,
  });
}

// READABLE (for understanding):
function registerCodeReview() {
  registerBundledPromptCommand({
    name: CODE_REVIEW_NAME,                  // "code-review"
    subcommands: { ultra: "ultrareview" },   // `ultra` aliases the cloud /ultrareview flow
    description: getCodeReviewDescription,    // dynamic getter (eyz)
    argumentHint: getCodeReviewArgumentHint,  // dynamic getter (Hhz)
    userInvocable: true,
    getEffort(argLine) {                      // tells the harness which effort the user chose
      return parseCodeReviewArgs(argLine).explicit;
    },
    getPromptForCommand: buildCodeReviewPrompt,
  });
}

// Mapping: zO9→registerCodeReview, bA→registerBundledPromptCommand, Y18→CODE_REVIEW_NAME,
//          eyz→getCodeReviewDescription, Hhz→getCodeReviewArgumentHint, _O9→parseCodeReviewArgs, $hz→buildCodeReviewPrompt
```

Two fields deserve attention:

- **`subcommands: { ultra: "ultrareview" }`** — this is a declarative hint to the slash-command resolver that the
  literal first token `ultra` is a recognized sub-command, and that it semantically maps to the `ultrareview`
  command. The *enforcement* of the alias happens inside the parser (`_O9`), but registering it here lets the REPL
  autocomplete / help surfaces show `code-review ultra` as a valid invocation.
- **`getEffort(H)`** — a dedicated extractor the harness calls to learn the chosen effort *without* building the
  whole prompt. It returns only `parseCodeReviewArgs(H).explicit`, i.e. `undefined` unless the user typed an
  explicit effort token. This lets the UI render the effort the command will run at (and lets the model-effort
  ceiling logic clamp it) before the prompt is assembled.

### The generic registrar `registerBundledPromptCommand` (`bA`)

`bA` (cli_inner_pretty.js:524187) is shared by every bundled prompt command (`/code-review`, `/simplify`,
`/debug`, etc.). It normalizes the spec into the internal command record and pushes it onto the bundled-command
registry array `Ji4` (initialized to `[]` at cli_inner_pretty.js:524295).

```javascript
// ============================================
// registerBundledPromptCommand - normalizes a spec and registers it
// Location: cli_inner_pretty.js:524187-524234
// ============================================

// ORIGINAL (for source lookup):
function bA(H) {
  let { files: $ } = H, q, K = H.getPromptForCommand;
  if ($ && Object.keys($).length > 0) {
    q = Li4(H.name);
    let z, A = H.getPromptForCommand;
    K = async (Y, f) => {
      z ??= RAz(H.name, $);
      let O = await z, M = await A(Y, f);
      if (O === null) return M;
      return mAz(M, O);
    };
  }
  let _ = {
    type: "prompt", name: H.name,
    description: typeof H.description === "function" ? "" : H.description,
    aliases: H.aliases, subcommands: H.subcommands,
    hasUserSpecifiedDescription: !0,
    allowedTools: H.allowedTools ?? [], disallowedTools: H.disallowedTools ?? [],
    argumentHint: typeof H.argumentHint === "function" ? void 0 : H.argumentHint,
    whenToUse: typeof H.whenToUse === "function" ? void 0 : H.whenToUse,
    model: H.model, disableModelInvocation: H.disableModelInvocation ?? !1,
    userInvocable: H.userInvocable ?? !0,
    contentLength: 0, source: "bundled", loadedFrom: "bundled",
    hooks: H.hooks, skillRoot: q, context: H.context, agent: H.agent,
    isEnabled: H.isEnabled, isHidden: !(H.userInvocable ?? !0),
    progressMessage: "running",
    getPromptForCommand: K, getEffort: H.getEffort,
  };
  (nwH(_, "description", H.description), nwH(_, "argumentHint", H.argumentHint),
    nwH(_, "whenToUse", H.whenToUse), Ji4.push(_));
}

// READABLE (for understanding):
function registerBundledPromptCommand(spec) {
  let { files: extraFiles } = spec, skillRoot, getPrompt = spec.getPromptForCommand;
  // If the command bundles companion files (markdown), wrap getPrompt to splice them in.
  if (extraFiles && Object.keys(extraFiles).length > 0) {
    skillRoot = bundledSkillRoot(spec.name);
    let cache, baseGetPrompt = spec.getPromptForCommand;
    getPrompt = async (args, ctx) => {
      cache ??= materializeBundledFiles(spec.name, extraFiles);
      let files = await cache, base = await baseGetPrompt(args, ctx);
      return files === null ? base : appendFilesToPrompt(base, files);
    };
  }
  const record = {
    type: "prompt", name: spec.name,
    // Function-valued description/argumentHint/whenToUse are resolved lazily via getters (nwH below)
    description: typeof spec.description === "function" ? "" : spec.description,
    aliases: spec.aliases, subcommands: spec.subcommands,
    hasUserSpecifiedDescription: true,
    allowedTools: spec.allowedTools ?? [], disallowedTools: spec.disallowedTools ?? [],
    argumentHint: typeof spec.argumentHint === "function" ? undefined : spec.argumentHint,
    whenToUse: typeof spec.whenToUse === "function" ? undefined : spec.whenToUse,
    model: spec.model, disableModelInvocation: spec.disableModelInvocation ?? false,
    userInvocable: spec.userInvocable ?? true,
    contentLength: 0, source: "bundled", loadedFrom: "bundled",
    hooks: spec.hooks, skillRoot, context: spec.context, agent: spec.agent,
    isEnabled: spec.isEnabled, isHidden: !(spec.userInvocable ?? true),
    progressMessage: "running",
    getPromptForCommand: getPrompt, getEffort: spec.getEffort,
  };
  // Install lazy getters for the function-valued fields, then register.
  defineLazyGetter(record, "description", spec.description);
  defineLazyGetter(record, "argumentHint", spec.argumentHint);
  defineLazyGetter(record, "whenToUse", spec.whenToUse);
  BUNDLED_COMMANDS.push(record);
}

// Mapping: bA→registerBundledPromptCommand, Li4→bundledSkillRoot, RAz→materializeBundledFiles,
//          mAz→appendFilesToPrompt, nwH→defineLazyGetter, Ji4→BUNDLED_COMMANDS, $hz/K→getPrompt
```

**Key insight:** `description`, `argumentHint`, and `whenToUse` may be *functions* (lazy getters). `/code-review`
uses this: `description` = `getCodeReviewDescription` (`eyz`) and `argumentHint` = `getCodeReviewArgumentHint`
(`Hhz`). Both must be functions because their text **changes at runtime** depending on whether the cloud `ultra`
path is available (`isCloudReviewAvailable()`). A static string baked at module load could not reflect that. The
`typeof … === "function" ? void 0 : …` guards plus `defineLazyGetter` (`nwH`) implement exactly this lazy
resolution.

The dynamic description (cli_inner_pretty.js:600558-600560):

```javascript
// ============================================
// getCodeReviewDescription - description that hides the "ultra" clause when cloud is unavailable
// Location: cli_inner_pretty.js:600558-600560
// ============================================

// ORIGINAL (for source lookup):
function eyz() {
  return `Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings${WF() ? "; ultra: deep multi-agent review in the cloud" : ""}). Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.`;
}

// READABLE (for understanding):
function getCodeReviewDescription() {
  const ultraClause = isCloudReviewAvailable()
    ? "; ultra: deep multi-agent review in the cloud" : "";
  return `Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups ` +
    `at the given effort level (low/medium: fewer, high-confidence findings; ` +
    `high→max: broader coverage, may include uncertain findings${ultraClause}). ` +
    `Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.`;
}

// Mapping: eyz→getCodeReviewDescription, WF→isCloudReviewAvailable
```

The argument hint follows the same pattern (cli_inner_pretty.js:600561-600563): the `ultra` token is only listed
when the cloud path exists.

```javascript
// ============================================
// getCodeReviewArgumentHint - argument hint, "ultra" appended only when cloud is available
// Location: cli_inner_pretty.js:600561-600563
// ============================================

// ORIGINAL (for source lookup):
function Hhz() {
  return `[${WF() ? `${pI8.join("|")}|ultra` : pI8.join("|")}] [--fix] [--comment] [<target>]`;
}

// READABLE (for understanding):
function getCodeReviewArgumentHint() {
  const levels = EFFORT_LEVELS.join("|");                   // "low|medium|high|xhigh|max"
  const choices = isCloudReviewAvailable() ? `${levels}|ultra` : levels;
  return `[${choices}] [--fix] [--comment] [<target>]`;
}

// Mapping: Hhz→getCodeReviewArgumentHint, WF→isCloudReviewAvailable, pI8→EFFORT_LEVELS
```

---

## 2. The argument parser (`parseCodeReviewArgs`, `_O9`)

This is the heart of the module. It is a 2-stage parse: first **strip the flags** (`--comment`, `--fix`) with a
generic tokenizer, then **classify the first remaining token** as `ultra`, an effort level, an unrecognized
effort-ish word, or part of the target.

### Stage 1 — flag tokenizer (`tokenizeFlags`, `BN8`)

```javascript
// ============================================
// tokenizeFlags - strip named --flags out of an argument line
// Location: cli_inner_pretty.js:502812-502822
// ============================================

// ORIGINAL (for source lookup):
function BN8(H, $) {
  let q = H.trim(),
    K = q.split(/\s+/, 1)[0] ?? "",
    _ = new Set(),
    z = q;
  for (let A of $) {
    let Y = z.replace(new RegExp(`(?:^|\\s)--${vR(A)}(?=\\s|$)`, "g"), "");
    if (Y !== z) (_.add(A), (z = Y.trim()));
  }
  return { rawFirstToken: K, flags: _, rest: z };
}

// READABLE (for understanding):
function tokenizeFlags(line, flagNames) {
  const trimmed = line.trim();
  const rawFirstToken = trimmed.split(/\s+/, 1)[0] ?? "";   // captured BEFORE flag removal
  const flags = new Set();
  let rest = trimmed;
  for (const name of flagNames) {
    // Match "--name" only as a whole token (preceded by start/space, followed by space/end)
    const stripped = rest.replace(new RegExp(`(?:^|\\s)--${escapeRegex(name)}(?=\\s|$)`, "g"), "");
    if (stripped !== rest) {
      flags.add(name);
      rest = stripped.trim();
    }
  }
  return { rawFirstToken, flags, rest };
}

// Mapping: BN8→tokenizeFlags, vR→escapeRegex, $→flagNames, K→rawFirstToken, _→flags, z→rest
```

**Why capture `rawFirstToken` before flag removal:** the first token of the raw line is needed to detect the
literal `ultra` sub-command (see below). Flags can appear *before* the effort token (`/code-review --fix ultra`),
so the parser preserves the genuinely-first token separately from `rest` (which has flags spliced out). The
`(?:^|\s)…(?=\s|$)` word-boundary regex ensures `--fix` strips cleanly whether it's at the start, middle, or end
of the line, and never matches a substring like `--fixture`.

`escapeRegex` (`vR`) escapes regex metacharacters in the flag name so the dynamically-built `RegExp` is safe.

The same tokenizer is reused for the cloud-review scope parser at cli_inner_pretty.js:502829-502832
(`TU4` → `{ scopeArgs, applyFixes }`), which is what `/ultrareview` and `claude ultrareview` use — a small but
deliberate code-reuse that keeps `--fix` parsing identical across the local and cloud paths.

### Stage 2 — classification (`parseCodeReviewArgs`, `_O9`)

```javascript
// ============================================
// parseCodeReviewArgs - classify first token; resolve ultra / effort / target
// Location: cli_inner_pretty.js:600530-600557
// ============================================

// ORIGINAL (for source lookup):
function _O9(H) {
  let { rawFirstToken: $, flags: q, rest: K } = BN8(H, ["comment", "fix"]),
    _ = q.has("comment"),
    z = q.has("fix"),
    A = K.split(/\s+/).filter(Boolean),
    Y = A[0] ?? "";
  if ($.toLowerCase() === "ultra")
    return { explicit: void 0, target: A.slice(1).join(" "), comment: _, fix: z,
             unrecognizedLevel: void 0, ultraFallback: !0 };
  let f = Y.toLowerCase() === "ultra" ? void 0 : _kH(Y);
  if (f !== void 0)
    return { explicit: f, target: A.slice(1).join(" "), comment: _, fix: z,
             unrecognizedLevel: void 0, ultraFallback: !1 };
  let O = tyz.test(Y);
  return { explicit: void 0, target: K, comment: _, fix: z,
           unrecognizedLevel: O ? Y : void 0, ultraFallback: !1 };
}

// READABLE (for understanding):
function parseCodeReviewArgs(line) {
  const { rawFirstToken, flags, rest } = tokenizeFlags(line, ["comment", "fix"]);
  const comment = flags.has("comment");
  const fix     = flags.has("fix");
  const words   = rest.split(/\s+/).filter(Boolean);
  const first   = words[0] ?? "";

  // Case 1: literal "ultra" as the genuine first token → cloud sub-command, fall back to local max.
  if (rawFirstToken.toLowerCase() === "ultra") {
    return { explicit: undefined, target: words.slice(1).join(" "),
             comment, fix, unrecognizedLevel: undefined, ultraFallback: true };
  }

  // Case 2: explicit effort level (low/medium/high/xhigh/max, or "med" alias). "ultra" here is NOT a level.
  const effort = first.toLowerCase() === "ultra" ? undefined : normalizeEffortToken(first);
  if (effort !== undefined) {
    return { explicit: effort, target: words.slice(1).join(" "),
             comment, fix, unrecognizedLevel: undefined, ultraFallback: false };
  }

  // Case 3: first token looks effort-ish (matches /^(low|med|hig|xhi|max)[a-z]*$/i) but isn't valid.
  const looksLikeEffort = EFFORT_PREFIX_RE.test(first);
  return { explicit: undefined, target: rest,        // whole rest is the target
           comment, fix, unrecognizedLevel: looksLikeEffort ? first : undefined, ultraFallback: false };
}

// Mapping: _O9→parseCodeReviewArgs, BN8→tokenizeFlags, _kH→normalizeEffortToken,
//          tyz→EFFORT_PREFIX_RE, $→rawFirstToken, K→rest, A→words, Y→first, f→effort, O→looksLikeEffort
```

### Parse decision tree

```
parseCodeReviewArgs("<arg line>")
   │
   ▼  tokenizeFlags(line, ["comment","fix"])
   │     → rawFirstToken (pre-strip), flags{comment,fix}, rest (flags removed)
   │
   ├─ rawFirstToken == "ultra"  ─────────────► { ultraFallback:true,  explicit:undefined,
   │                                             target = rest words after #0 }
   │      (cloud sub-command; if cloud unavailable → local "max")
   │
   ├─ normalizeEffortToken(first) is valid ──► { explicit:<level>, ultraFallback:false,
   │   (low|medium|high|xhigh|max, "med")      target = rest words after #0 }
   │
   └─ else ──────────────────────────────────► { explicit:undefined, ultraFallback:false,
          EFFORT_PREFIX_RE.test(first)?          target = full rest,
            unrecognizedLevel = first            unrecognizedLevel = first|undefined }
          : no level word → entire rest is target
```

**Why two `ultra` checks (`rawFirstToken` vs `first`)?** The parser checks `rawFirstToken.toLowerCase() === "ultra"`
first (Case 1) to catch `/code-review ultra` and `/code-review --fix ultra` (flags before the keyword). The second
guard — `first.toLowerCase() === "ultra" ? undefined : normalizeEffortToken(first)` (Case 2) — is a *defensive
exclusion*: even though `ultra` is not in `EFFORT_LEVELS` (so `normalizeEffortToken("ultra")` already returns
`undefined`), the explicit `=== "ultra" ? undefined` makes the intent unambiguous and prevents any future alias
map from accidentally turning `ultra` into an effort. The net effect: `ultra` is *only ever* a sub-command, never
an effort.

**Why `unrecognizedLevel` instead of silently treating a typo as a target?** If a user types
`/code-review hihg` (typo of `high`), naively treating `hihg` as the *review target* (a file/branch named
`hihg`) would silently run a review against a nonsense target. Instead `EFFORT_PREFIX_RE` (`tyz`) catches words
that *look* like an effort level by 3-letter prefix (built from `EFFORT_LEVELS.map(s => s.slice(0,3))`,
cli_inner_pretty.js:600661 → `/^(low|med|hig|xhi|max)[a-z]*$/i`). When matched, the parser surfaces it via
`unrecognizedLevel`, and the prompt builder emits a corrective preamble (Section 4) before running at the default
level.

---

## 3. The effort ladder

### The levels and alias map

```javascript
// ============================================
// EFFORT_LEVELS / EFFORT_ALIASES - the five-rung effort ladder + "med" alias
// Location: cli_inner_pretty.js:185009-185010
// ============================================

// ORIGINAL (for source lookup):
dN = ["low", "medium", "high", "xhigh", "max"];
s$7 = { med: "medium" };

// READABLE (for understanding):
const EFFORT_LEVELS  = ["low", "medium", "high", "xhigh", "max"];
const EFFORT_ALIASES = { med: "medium" };

// Mapping: dN→EFFORT_LEVELS (also exported as pI8 in the code-review module), s$7→EFFORT_ALIASES
```

`pI8` is the same array re-bound for the code-review module's local use (`pI8 = dN`,
cli_inner_pretty.js:600660), so `EFFORT_LEVELS` and `pI8` are one and the same list.

### Token normalization (`normalizeEffortToken`, `_kH`)

```javascript
// ============================================
// normalizeEffortToken - lowercase + alias-map a token to a valid effort or undefined
// Location: cli_inner_pretty.js:184859-184869
// ============================================

// ORIGINAL (for source lookup):
function KkH(H) {
  return dN.includes(H);
}
function _kH(H) {
  let $ = H.trim().toLowerCase(),
    q = s$7[$] ?? $;
  return KkH(q) ? q : void 0;
}

// READABLE (for understanding):
function isEffortLevel(value) {
  return EFFORT_LEVELS.includes(value);
}
function normalizeEffortToken(token) {
  const lower   = token.trim().toLowerCase();
  const aliased = EFFORT_ALIASES[lower] ?? lower;   // "med" → "medium"
  return isEffortLevel(aliased) ? aliased : undefined;
}

// Mapping: KkH→isEffortLevel, _kH→normalizeEffortToken, dN→EFFORT_LEVELS, s$7→EFFORT_ALIASES
```

This is the single normalization path: trim → lowercase → alias-map → membership check. Because it returns
`undefined` for anything not in the ladder, the parser can use a strict `!== undefined` test to distinguish
"user named an effort" from "user named a target".

### Resolving the effective effort (`clampEffortLevel`, `E1H`, and `resolveEffortForModel`, `or`)

When no explicit effort is given, the builder resolves one from the session / model. Two helpers cooperate.

`clampEffortLevel` (`E1H`, cli_inner_pretty.js:184960-184963) coerces any value to a valid effort, defaulting to
`"high"`:

```javascript
// ============================================
// clampEffortLevel - coerce arbitrary value to a valid effort, default "high"
// Location: cli_inner_pretty.js:184960-184963
// ============================================

// ORIGINAL (for source lookup):
function E1H(H) {
  if (typeof H === "string") return KkH(H) ? H : "high";
  return "high";
}

// READABLE (for understanding):
function clampEffortLevel(value) {
  if (typeof value === "string") return isEffortLevel(value) ? value : "high";
  return "high";
}

// Mapping: E1H→clampEffortLevel, KkH→isEffortLevel
```

`resolveEffortForModel` (`or`, cli_inner_pretty.js:184909-184919) clamps a requested effort against the active
model's ceiling — `max` and `xhigh` are downgraded to `high` on models that don't support them:

```javascript
// ============================================
// resolveEffortForModel - clamp requested effort against the model's supported ceiling
// Location: cli_inner_pretty.js:184909-184919
// ============================================

// ORIGINAL (for source lookup):
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}

// READABLE (for understanding):
function resolveEffortForModel(model, fallback) {
  if (!modelSupportsEffort(model)) return undefined;
  const pinned       = modelHasPinnedLaunchEffort(model);   // AkH
  const modelDefault = getDefaultEffortForModel(model);     // q48 → "high" for opus-4-8, "xhigh" for 4-7
  const requested    = readPinnedEffortOverride();          // zkH
  if (requested === null) return pinned ? modelDefault : undefined;
  let effort = requested ?? (pinned ? modelDefault : undefined) ?? fallback ?? modelDefault;
  if (effort === "max"   && !modelSupportsMax(model))   return "high";   // ow$
  if (effort === "xhigh" && !modelSupportsXhigh(model)) return "high";   // ycH
  return effort;
}

// Mapping: or→resolveEffortForModel, A2→modelSupportsEffort, AkH→modelHasPinnedLaunchEffort,
//          q48→getDefaultEffortForModel, zkH→readPinnedEffortOverride, ow$→modelSupportsMax, ycH→modelSupportsXhigh
```

`getDefaultEffortForModel` (`q48`, cli_inner_pretty.js:184987-184991) returns `"high"` for `claude-opus-4-8`,
`"xhigh"` for `claude-opus-4-7`, else `"high"` — this is the same default-effort logic that makes Opus 4.8
"default to high effort" (CHANGELOG.md:7), shared with the rest of the effort subsystem.

`getEffortFromState` (`k3`, cli_inner_pretty.js:453183-453189) reads the session's current effort value, then
lets any `effort`-kind permission layer override it — this is how a skill/agent `effort:` frontmatter or a
`--permission-mode` layer can pin the review's effort.

---

## 4. Building the prompt (`buildCodeReviewPrompt`, `$hz`)

The builder ties everything together: parse args → resolve effort → assemble `[preamble][target line][effort
body][comment block?][fix block?]` into one text content block.

```javascript
// ============================================
// buildCodeReviewPrompt - assemble the full review prompt text
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
    D = K
      ? `Review target: \`${K}\`

`
      : "";
  return [{ type: "text", text: `${w}${D}${oyz[j]}${_ ? ayz : ""}${z ? syz : ""}` }];
}

// READABLE (for understanding):
async function buildCodeReviewPrompt(argLine, ctx) {
  const { explicit, target, comment, fix, unrecognizedLevel, ultraFallback } = parseCodeReviewArgs(argLine);

  // ultra → run the *strongest* local effort (max) as the fallback body.
  const requested = ultraFallback ? "max" : explicit;

  // Resolve against the active model, then the session default (k3), then default "medium".
  const model = ctx.options?.mainLoopModel;
  const resolved = model
    ? (resolveEffortForModel(model, requested ?? getEffortFromState(ctx)) ?? requested)
    : (requested ?? getEffortFromState(ctx));
  const level = resolved === undefined ? "medium" : clampEffortLevel(resolved);

  // Preamble: cloud-fallback note OR unrecognized-effort note (or empty).
  const preamble = buildEffortFallbackPreamble({ ultraFallback, fix, unrecognizedLevel, level, context: ctx });

  const targetLine = target ? `Review target: \`${target}\`\n\n` : "";

  return [{
    type: "text",
    text: `${preamble}${targetLine}${effortPromptMap[level]}${comment ? COMMENT_SUFFIX_BLOCK : ""}${fix ? FIX_SUFFIX_BLOCK : ""}`,
  }];
}

// Mapping: $hz→buildCodeReviewPrompt, _O9→parseCodeReviewArgs, or→resolveEffortForModel, k3→getEffortFromState,
//          E1H→clampEffortLevel, qhz→buildEffortFallbackPreamble, oyz→effortPromptMap, ayz→COMMENT_SUFFIX_BLOCK,
//          syz→FIX_SUFFIX_BLOCK, q→explicit, K→target, _→comment, z→fix, A→unrecognizedLevel, Y→ultraFallback, j→level
```

### Effort resolution precedence

The `level` is decided by this precedence (highest wins):

```
1. ultraFallback           → "max"          (user typed `ultra`, cloud unavailable)
2. explicit                → user's token   (low/medium/high/xhigh/max)
3. resolveEffortForModel   → model ceiling clamp of (requested || session default)
4. getEffortFromState (k3) → session/permission-layer effort
5. default                 → "medium"       (when nothing resolves)
                            then clampEffortLevel(...) guarantees a valid rung
```

**Why `ultra` falls back to `max` locally:** the `ultra` sub-command is a *cloud* multi-agent review (the
`/ultrareview` flow). When the cloud is unavailable (`isCloudReviewAvailable()` false) or Claude itself triggers
the command, the command degrades gracefully to the strongest *local* review (`max`, the 9-angle prompt) rather
than failing outright. The preamble explains the degradation so the user is not surprised.

### The effort prompt map (`effortPromptMap`, `oyz`)

```javascript
// ============================================
// effortPromptMap - level → effort-specific review prompt body
// Location: cli_inner_pretty.js:600659
// ============================================

// ORIGINAL (for source lookup):
oyz = { low: sf9, medium: tf9, high: ef9, xhigh: $O9, max: qO9 };

// READABLE (for understanding):
const effortPromptMap = {
  low:    LOW_EFFORT_PROMPT,     // 1 diff pass, no verify, ≤4 findings
  medium: MEDIUM_EFFORT_PROMPT,  // 7 angles × 6 candidates, 1-vote verify, ≤8 findings (precision)
  high:   HIGH_EFFORT_PROMPT,    // 7 angles × 6, 1-vote recall-biased verify, ≤10 findings (recall)
  xhigh:  XHIGH_EFFORT_PROMPT,   // buildHighRecallEffortPrompt("xhigh") — 9 angles × 8, verify + sweep, ≤15
  max:    MAX_EFFORT_PROMPT,     // buildHighRecallEffortPrompt("max")  — same shape, "maximum" framing
};

// Mapping: oyz→effortPromptMap, sf9→LOW_EFFORT_PROMPT, tf9→MEDIUM_EFFORT_PROMPT, ef9→HIGH_EFFORT_PROMPT,
//          $O9→XHIGH_EFFORT_PROMPT, qO9→MAX_EFFORT_PROMPT
```

The five bodies form a deliberate precision↔recall gradient (cli_inner_pretty.js:600360, 600478, 600502, 600389):

| Level | Phases | Angles × candidates | Verify | Bias | Findings cap |
|---|---|---|---|---|---|
| `low` | 1 (read+scan) | 1 diff pass | none | n/a | ≤4 |
| `medium` | 2 | 7 × 6 | 1-vote 3-state | **precision** | ≤8 |
| `high` | 2 | 7 × 6 | 1-vote recall-biased | **recall** | ≤10 |
| `xhigh` | 3 (+ sweep) | 9 × 8 | 1-vote + sweep | recall | ≤15 |
| `max` | 3 (+ sweep) | 9 × 8 | 1-vote + sweep | recall | ≤15 |

`xhigh` and `max` share one factory, `buildHighRecallEffortPrompt` (`HO9`, cli_inner_pretty.js:600389-600416),
because their structure is identical — only the wording ("extra-high" vs "maximum") differs:

```javascript
// ============================================
// buildHighRecallEffortPrompt - factory for the xhigh/max 9-angle review body
// Location: cli_inner_pretty.js:600389-600416
// ============================================

// ORIGINAL (for source lookup):
HO9 = (H) => `\`${H} effort → 5+4 angles \xD7 8 candidates → 1-vote verify → sweep → ≤15 findings\`
...
You are reviewing for **recall** at ${H === "max" ? "maximum" : "extra-high"} effort: catch every real bug. ...
Run **9 independent finder angles** via the ${sq} tool. ...`;
// then: ($O9 = HO9("xhigh")), (qO9 = HO9("max"));

// READABLE (for understanding):
const buildHighRecallEffortPrompt = (level) =>
  `\`${level} effort → 5+4 angles × 8 candidates → 1-vote verify → sweep → ≤15 findings\`
...
You are reviewing for **recall** at ${level === "max" ? "maximum" : "extra-high"} effort: catch every real bug. ...
Run **9 independent finder angles** via the ${TASK_TOOL_NAME} tool. ...`;
const XHIGH_EFFORT_PROMPT = buildHighRecallEffortPrompt("xhigh");
const MAX_EFFORT_PROMPT   = buildHighRecallEffortPrompt("max");

// Mapping: HO9→buildHighRecallEffortPrompt, sq→TASK_TOOL_NAME, $O9→XHIGH_EFFORT_PROMPT, qO9→MAX_EFFORT_PROMPT
```

All five bodies share three building blocks: `dq$` (Phase 0 — "Gather the diff", cli_inner_pretty.js:600275),
`Q1q(n)` (the JSON `## Output` schema capping at `n` findings, cli_inner_pretty.js:600342), and the cleanup
angles `BI8`/`cq$`/`lq$`/`nq$` (Reuse / Simplification / Efficiency / Altitude, cli_inner_pretty.js:600277-600299).
The model executes the review by spawning Task sub-agents (`sq`) — the slash command itself runs no tools.

### The fallback preamble (`buildEffortFallbackPreamble`, `qhz`)

```javascript
// ============================================
// buildEffortFallbackPreamble - cloud-fallback / unrecognized-effort note before the body
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
    if ($)
      return z
        ? `(Claude can't launch the cloud review directly — type \`/code-review ultra --fix\` to review in the cloud and apply the findings locally when it completes. Running a local ${K}-effort review and applying its findings for now.)\n\n`
        : `(Running a local ${K}-effort review and applying its findings.)\n\n`;
    return z
      ? `(Claude can't launch the cloud review directly — type \`/code-review ultra\` to run it. Falling back to a local ${K}-effort review for now.)\n\n`
      : `(Claude can't launch the cloud review directly — the user can run \`claude ultrareview\` from a terminal to start it. Falling back to a local ${K}-effort review for now.)\n\n`;
  }
  if (q !== void 0)
    return `(Ignoring unrecognized effort "${q}"; valid: ${pI8.join(", ")}. Using ${K}.)\n\n`;
  return "";
}

// READABLE (for understanding):
function buildEffortFallbackPreamble({ ultraFallback, fix, unrecognizedLevel, level, context }) {
  if (ultraFallback) {
    // User typed `ultra` but we are doing a LOCAL review (this prompt only ever runs locally).
    if (!isCloudReviewAvailable()) {
      if (fix) return `(Running a local ${level}-effort review and applying its findings.)\n\n`;
      return `(ultra (cloud review) isn't available in this environment — see https://code.claude.com/docs/en/ultrareview. Falling back to a local ${level}-effort review.)\n\n`;
    }
    // Cloud IS available, but the model cannot self-launch it — tell the user how to.
    const ultrareviewUsable = context.options?.commands?.some(c => c.name === "ultrareview" && isCommandEnabled(c)) ?? false;
    if (fix)
      return ultrareviewUsable
        ? `(Claude can't launch the cloud review directly — type \`/code-review ultra --fix\` to review in the cloud and apply the findings locally when it completes. Running a local ${level}-effort review and applying its findings for now.)\n\n`
        : `(Running a local ${level}-effort review and applying its findings.)\n\n`;
    return ultrareviewUsable
      ? `(Claude can't launch the cloud review directly — type \`/code-review ultra\` to run it. Falling back to a local ${level}-effort review for now.)\n\n`
      : `(Claude can't launch the cloud review directly — the user can run \`claude ultrareview\` from a terminal to start it. Falling back to a local ${level}-effort review for now.)\n\n`;
  }
  if (unrecognizedLevel !== undefined)
    return `(Ignoring unrecognized effort "${unrecognizedLevel}"; valid: ${EFFORT_LEVELS.join(", ")}. Using ${level}.)\n\n`;
  return "";
}

// Mapping: qhz→buildEffortFallbackPreamble, WF→isCloudReviewAvailable, jk→isCommandEnabled, pI8→EFFORT_LEVELS,
//          H→ultraFallback, $→fix, q→unrecognizedLevel, K→level, _→context
```

**Key insight — the preamble exists because this is a *prompt*, not code.** A normal CLI would just call the
cloud API or print an error. But `/code-review ultra` only ever produces *text injected into the model's turn* —
the model itself decides what to do next. So when `ultra` cannot reach the cloud, the prompt must (a) tell the
model to run a local review at `max` instead, and (b) tell the model how to *explain to the user* what just
happened — including the exact command to type (`/code-review ultra` or `claude ultrareview`) to get the real
cloud review. The branch that checks `commands.some(c => c.name === "ultrareview" && isCommandEnabled(c))`
distinguishes "cloud reachable, suggest the slash command" from "no in-session ultrareview, suggest the terminal
binary." This is the "model can't self-launch billed remote work" guardrail (the same principle the v2.1.142
ultrareview doc describes) expressed entirely as prompt text.

---

## 5. The `--comment` and `--fix` suffix blocks

These are static markdown strings appended to the prompt when the corresponding flag is set.

```javascript
// ============================================
// COMMENT_SUFFIX_BLOCK / FIX_SUFFIX_BLOCK - post-review instruction blocks
// Location: cli_inner_pretty.js:600626-600649
// ============================================

// ORIGINAL (for source lookup):
ayz = `

## Posting to GitHub (--comment)

The \`--comment\` flag was passed. After producing the findings list, if the
review target is a GitHub PR, post each finding as an inline PR comment via
\`mcp__github_inline_comment__create_inline_comment\` (one call per finding;
include a suggestion block only when it fully fixes the issue). If that tool
is not available in this session, fall back to \`gh api\` (repos/{owner}/{repo}/pulls/{pr}/comments)
or print the findings instead. If the target is not a PR, print the findings
to the terminal and note that \`--comment\` was ignored.
`,
syz = `

## Applying fixes (--fix)

The \`--fix\` flag was passed. After producing the findings list, apply the
findings to the working tree instead of stopping at the report: fix each one
directly — correctness bugs and reuse/simplification/efficiency cleanups alike.
Skip any finding whose fix would change intended behavior, require changes well
outside the reviewed diff, or that you judge to be a false positive — note the
skip rather than arguing with it. Finish with a brief summary of what was fixed
and what was skipped.
`;

// READABLE (for understanding):
const COMMENT_SUFFIX_BLOCK = `...Posting to GitHub (--comment): post each finding via
  mcp__github_inline_comment__create_inline_comment; fall back to gh api, else print;
  if target is not a PR, print and note --comment ignored.`;
const FIX_SUFFIX_BLOCK = `...Applying fixes (--fix): after the findings list, apply each to the
  working tree; skip behavior-changing / out-of-diff / false-positive findings (note the skip);
  finish with a summary of fixed vs skipped.`;

// Mapping: ayz→COMMENT_SUFFIX_BLOCK, syz→FIX_SUFFIX_BLOCK
```

**`--comment` design:** primary path is the GitHub MCP tool `mcp__github_inline_comment__create_inline_comment`
(one call per finding). It degrades to `gh api .../pulls/{pr}/comments`, then to plain stdout. Critically, it
instructs the model to *only* include a GitHub suggestion block when the suggestion **fully** fixes the issue —
partial suggestions that don't apply cleanly create noise on PRs. If the target is not a PR, `--comment` is a
no-op with an explicit note (you can't post inline comments to a local branch diff).

**`--fix` design:** the model applies findings to the working tree but with three explicit skip conditions —
(1) the fix would change *intended* behavior, (2) it needs changes well outside the reviewed diff, or (3) it's a
judged false positive. The "note the skip rather than arguing with it" instruction is a deliberate guard against
the model burning turns debating its own findings. Both blocks come *after* the findings list, so the review's
analysis is complete before any side effects (comments/edits) happen.

---

## 6. `/simplify` — the cleanup-only sibling

`/simplify` (`registerSimplify`, `vO9`, cli_inner_pretty.js:601350-601372) is a separate, much simpler command:
no effort levels, no `--comment`/`--fix`, no `ultra`. It launches 4 cleanup agents in parallel and applies the
fixes, and explicitly **does not** hunt for correctness bugs.

```javascript
// ============================================
// registerSimplify - the cleanup-only /simplify command
// Location: cli_inner_pretty.js:601350-601372
// ============================================

// ORIGINAL (for source lookup):
function vO9() {
  bA({
    name: "simplify",
    description: "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: !0,
    async getPromptForCommand(H) {
      let $ = H.trim();
      return [{ type: "text", text: `${$ ? `Review target: \`${$}\`\n\n` : ""}${Ehz}` }];
    },
  });
}

// READABLE (for understanding):
function registerSimplify() {
  registerBundledPromptCommand({
    name: "simplify",
    description: "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: true,
    async getPromptForCommand(argLine) {
      const target = argLine.trim();
      const targetLine = target ? `Review target: \`${target}\`\n\n` : "";
      return [{ type: "text", text: `${targetLine}${SIMPLIFY_PROMPT}` }];
    },
  });
}

// Mapping: vO9→registerSimplify, bA→registerBundledPromptCommand, Ehz→SIMPLIFY_PROMPT
```

The `/simplify` body (`Ehz`, cli_inner_pretty.js:601378) is: "`/simplify → 4 cleanup agents in parallel → apply
the fixes` … You are improving the *quality* of the changed code, **not hunting for bugs** … that is what
`/code-review` is for." It reuses the same four cleanup-angle strings as `/code-review` (`BI8`/`cq$`/`lq$`/`nq$`)
but with no correctness angles and no verify phase.

---

## 7. The cloud `ultra` bridge

The `ultra` token bridges `/code-review` to the `/ultrareview` cloud flow. The connection is the availability gate
`isCloudReviewAvailable` (`WF`):

```javascript
// ============================================
// isCloudReviewAvailable - gate for the ultra / cloud review path
// Location: cli_inner_pretty.js:502747-502749
// ============================================

// ORIGINAL (for source lookup):
function WF() {
  return x8$()?.enabled === !0 && dtH() && !d6();
}

// READABLE (for understanding):
function isCloudReviewAvailable() {
  return getReviewBughunterConfig()?.enabled === true   // GrowthBook tengu_review_bughunter_config.enabled
      && isCloudCodeRunnerBridgeReady()                 // CCR bridge reachable / OAuth'd
      && !isInRemoteWorkspace();                        // don't recurse inside a CCR worker
}

// Mapping: WF→isCloudReviewAvailable, x8$→getReviewBughunterConfig, dtH→isCloudCodeRunnerBridgeReady, d6→isInRemoteWorkspace
```

This is the **same three-condition composite gate** documented for v2.1.142's `V1H` ultrareview gate (GrowthBook
`enabled === true` ∧ bridge ready ∧ not-in-remote) — confidence **high**. The `/ultrareview` slash command itself
now advertises as an *alias*: `"Alias of /code-review ultra · …"` and gates on `WF()`
(cli_inner_pretty.js:504288-504293):

```javascript
// ============================================
// ultrareviewSlashCommand - now described as "Alias of /code-review ultra"
// Location: cli_inner_pretty.js:504286-504294
// ============================================

// ORIGINAL (for source lookup):
QU4 = {
  type: "local-jsx",
  name: "ultrareview",
  get description() {
    return `Alias of /code-review ultra \xB7 ${Vs()} \xB7 Est. cost ${gIH()} USD \xB7 Finds and verifies bugs in your branch. Runs in Claude Code on the web. See ${J9z}`;
  },
  isEnabled: () => WF(),
  load: () => Promise.resolve().then(() => (FU4(), UU4)),
};

// READABLE (for understanding):
const ultrareviewSlashCommand = {
  type: "local-jsx",
  name: "ultrareview",
  get description() {
    return `Alias of /code-review ultra · ${getDurationNote()} · Est. cost ${getCostNote()} USD · Finds and verifies bugs in your branch. Runs in Claude Code on the web. See ${CCR_TERMS_URL}`;
  },
  isEnabled: () => isCloudReviewAvailable(),
  load: () => loadUltrareviewCommandLazy(),
};

// Mapping: QU4→ultrareviewSlashCommand, WF→isCloudReviewAvailable, Vs→getDurationNote, gIH→getCostNote, J9z→CCR_TERMS_URL
```

So in v2.1.156 the relationship has inverted relative to v2.1.142: **`/code-review ultra` is the canonical entry
to cloud review, and `/ultrareview` is the deprecated alias.** Both gate on `WF()` and both reach the same cloud
launch path. (The cloud launcher and polling — `re6`, the remote precondition checks at cli_inner_pretty.js:502833
onward, and the `claude ultrareview` CLI subcommand — are out of scope here; see Module 40's
`10_promoted_ultrareview.md` for the launch/poll machinery.)

---

## 8. End-to-end flow

```
User types: /code-review high --comment 12345
                 │
                 ▼  slash resolver → registered "code-review" record (Ji4)
                 │   getEffort(line) = parseCodeReviewArgs(line).explicit = "high"   (UI shows effort)
                 ▼
   buildCodeReviewPrompt("high --comment 12345", ctx)   [$hz, 600564]
                 │
                 ├─ parseCodeReviewArgs                  [_O9, 600530]
                 │    tokenizeFlags(line,["comment","fix"])  → {rawFirstToken:"high",
                 │                                              flags:{comment}, rest:"high 12345"}
                 │    first="high" → normalizeEffortToken → "high"
                 │    ⇒ {explicit:"high", target:"12345", comment:true, fix:false,
                 │       unrecognizedLevel:undefined, ultraFallback:false}
                 │
                 ├─ requested = "high"  (not ultra)
                 ├─ resolveEffortForModel(model, "high") → clamp to model ceiling → "high"  [or, 184909]
                 ├─ level = clampEffortLevel("high") = "high"                                [E1H, 184960]
                 ├─ preamble = buildEffortFallbackPreamble(...) = ""  (no fallback, no typo)  [qhz, 600578]
                 ├─ targetLine = "Review target: `12345`\n\n"
                 ▼
   text = preamble + targetLine + effortPromptMap["high"] + COMMENT_SUFFIX_BLOCK + ""
                 │     (ef9: 7 angles × 6, recall-biased verify, ≤10 findings)  [oyz, 600659]
                 ▼
   [{ type:"text", text }]  ──►  injected into the model turn
                 │
                 ▼  model runs the review by spawning Task sub-agents (sq), then —
                    because --comment — posts each finding via mcp__github_inline_comment__create_inline_comment.
```

For `/code-review ultra` with cloud available: `ultraFallback:true` → builder picks `max` body but the preamble
tells the model it can't self-launch the cloud review and instructs the user to type `/code-review ultra` or run
`claude ultrareview`. The actual cloud launch is the `/ultrareview` flow (gated on `WF()`), not this prompt.

---

## 9. Cross-validation against v2.1.88

The v2.1.88 precursor is a *bundled skill*, not a prompt command: `registerSimplifySkill` in
`src/skills/bundled/simplify.ts`. It registered a command literally named `simplify` (not `code-review`), with:

- a single static prompt (`SIMPLIFY_PROMPT`) — no effort levels at all;
- **3** parallel review agents (Reuse / Quality / Efficiency), launched via `AGENT_TOOL_NAME`;
- always "review and fix" (it both reviewed *and* applied fixes) — there was no `--fix`/`--comment` toggle;
- no `ultra` / cloud bridge, no `unrecognizedLevel` handling, no per-level findings cap;
- `getPromptForCommand(args)` simply appended `## Additional Focus\n\n${args}` — `args` was *freeform extra
  focus text*, never parsed for effort or flags.

So the v2.1.156 `/code-review` is a **substantial post-2.1.88 redesign** (confidence **high** that this is new):

| Aspect | v2.1.88 `simplify.ts` | v2.1.156 `/code-review` + `/simplify` |
|---|---|---|
| Command name | `simplify` (skill) | `code-review` (prompt cmd) + separate `simplify` |
| Argument parsing | append-as-focus only | `parseCodeReviewArgs` state machine (`_O9`) |
| Effort levels | none | `["low","medium","high","xhigh","max"]` + `med` alias |
| Effort resolution | n/a | model-ceiling clamp (`or`) + session default (`k3`) + `clampEffortLevel` |
| Bug hunting | quality only | correctness + cleanup (code-review); cleanup-only (simplify) |
| Review agents | 3 fixed | 1–9 angles by effort, verify + sweep phases |
| `--comment` | none | inline PR comments via GitHub MCP |
| `--fix` | always applied | opt-in working-tree apply with skip rules |
| Cloud `ultra` | none | `ultra` → `/ultrareview` bridge with local-max fallback |

The cloud gate `isCloudReviewAvailable` (`WF`) maps 1:1 to v2.1.142's `isUltrareviewEnabled` (`V1H`) three-clause
composite — **confidence high**. The 4-angle `/simplify` cleanup body is the lineal descendant of the 3-agent
`SIMPLIFY_PROMPT` (Reuse/Quality/Efficiency → Reuse/Simplification/Efficiency/Altitude) — **confidence high**.

---

## 10. Changelog timeline

- **2.1.147** (CHANGELOG.md:169): *"Renamed `/simplify` to `/code-review`. It now reports correctness bugs at a
  chosen effort level (e.g., `/code-review high`); pass `--comment` to post findings as inline GitHub PR comments.
  The old cleanup-and-fix behavior has been removed."* — introduces the effort ladder, `parseCodeReviewArgs`, and
  `--comment`.
- **2.1.152** (CHANGELOG.md:95): *"`/code-review --fix` now applies review findings to your working tree after the
  review … `/simplify` now invokes `/code-review --fix`."* — adds `FIX_SUFFIX_BLOCK` semantics; `/simplify` is a
  thin wrapper at this point.
- **2.1.154** (CHANGELOG.md:14): *"`/simplify` now runs a cleanup-only review (reuse, simplification, efficiency,
  altitude) and applies the fixes, instead of running the full `/code-review --fix` bug-hunting review."* —
  `/simplify` regains its own dedicated 4-agent cleanup prompt (`vO9` / `Ehz`), splitting it back out from
  `/code-review`. This is the state captured in the v2.1.156 bundle.
- **2.1.156** (CHANGELOG.md:3): the only 2.1.156 change is the Opus 4.8 thinking-block hotfix — **no** code-review
  change in 2.1.156 itself; this module is the *cumulative* 147→154 state as it ships in the 2.1.156 build.

---

## 11. Cross-references

- `40_ant_promoted/10_promoted_ultrareview.md` (v2.1.142) — the cloud launch/poll machinery and `claude
  ultrareview` CLI subcommand behind the `ultra` bridge.
- `43_model_opus48/` — `getDefaultEffortForModel` (`q48`) and the shared effort ladder (`dN`, `or`) that
  `/code-review` reuses for model-aware effort clamping.
- `04_tools/` — the Task/Agent tool (`sq`) the review prompts instruct the model to spawn finder/verifier agents
  through.
- `10_skill_system/` — the `/simplify` precursor lived as a *bundled skill* in v2.1.88; both are now bundled
  prompt commands registered via `registerBundledPromptCommand` (`bA`).
