# `deep-research` — the bundled deep-research harness, line by line

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines, `build_sha 4073f595`). Every line number below was read in **this** build.
**Baseline:** `…/versions/2.1.193/extract/cli_inner_pretty.js`, cited as `(193)`.
**Third point:** `/lyz/codespace/3rd/claude-code/src/` (named v2.1.88 TypeScript).

Companion document: [`deep_research_runtime_contract.md`](deep_research_runtime_contract.md) covers the
layer *underneath* this script — registration, the slash-command projection, the VM realm, the
`agent()`/`parallel()`/`pipeline()` host objects, the subagent tool pool, and the caps. This document
covers the **script itself**: what it computes, why each constant has the value it has, and what
changed between 2.1.193 and 2.1.220.

---

## TL;DR

| Fact | Evidence |
|------|----------|
| `deep-research` is **not a command implementation**. It is a ~440-line JavaScript **string literal** compiled into `registerDeepResearchWorkflow` (`mRd`) and pushed into the bundled-workflow registry at module-init time | `:424449-424881`; registry push `:385327-385335` |
| It is the **only user-visible bundled workflow** in this build. The other one (`code-review`) registers with `{ hidden: !0 }` and never becomes a slash command | `:424406-424407` vs `:424878-424880`; filter `:506561` |
| The pipeline is `Scope → (Search → URL-dedup → Fetch+Extract) → Verify(3-vote) → Synthesize`, declared *twice*: once as prose in `meta.phases` and once structurally by the `phase()`/`{phase:}` calls | `:424892-424898`; `:424541`, `:424657`, `:424704`, `:424746`, `:424808` |
| Five tuning constants: `VOTES_PER_CLAIM=3`, `REFUTATIONS_REQUIRED=2`, `MAX_FETCH=15`, `MAX_VERIFY_CLAIMS=25` | `:424462-424465` |
| Cost is **not** bounded by `MAX_FETCH`. High-relevance results bypass the fetch budget, so the fetch fan-out can reach `angles × 6` (up to 36) | `:424672` — the `relRank[r.relevance] >= 1` conjunct |
| Worst-case agent count = **1 + 6 + 36 + 75 + 1 = 119** (typical ≈ 97) — 6–8× the `medium` workflow-size guideline the same build ships | `:424875`; guideline [`workflow_size_guideline.md`](workflow_size_guideline.md) |
| **Three** script-level deltas vs 2.1.193, one per changelog bullet: `.196` three-way verdict, `.207` URL/label identity layer, `.218` `disableModelInvocation` | §11 |
| The `.207` delta is the largest: **8 lines became 57** (`:424565-424604` + `:424696-424701` and their comments), 38 of them comment, all defending a **terminal progress label** against web-controlled text | `:424565-424604`, `:424685-424701` vs `:443852-443857 (193)`, `:443938-443939 (193)` |
| No trace of this harness exists in v2.1.88 — the whole `WorkflowTool/bundled/` tree postdates it | `grep -rn 'deep-research' /lyz/codespace/3rd/claude-code/src` → 0 hits |

---

## 0. Provenance — how to find this in the bundle

```bash
T=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js
grep -n 'Deep research harness' $T          # :424884 — the description constant
grep -n 'function mRd' $T                   # :424449 — the registrar; the script literal follows
sed -n '424449,424881p' $T                  # the whole script as embedded
```

The extractor also dropped the script into
`extract/assets/prompts/023_export-const-meta-name-description.txt` — it is the only asset file that
contains the literal `deep-research`. That file is a convenience copy; all citations here are to the
bundle.

The registrar body spans `:424450-424880`; the trailing metadata constants are `:424882-424888`; the
lazy module initialiser that fills `fRd` (the phase list) is `:424889-424899`.

---

## 1. Three artefacts, one feature

`/deep-research` is assembled from three separate things, and conflating them causes most of the
confusion in earlier scoping notes:

1. **The script** — a string. Never parsed at build time, never type-checked, never linted. It is
   compiled by Acorn only when the workflow actually runs (`:389499`, `:389505`).
2. **The registry row** — `{ source: "built-in", name, description, whenToUse, phases, script,
   hidden, disableModelInvocation }`, pushed by `registerBundledWorkflow` (`kxo`) `:385327-385335`.
3. **The generated slash command** — `createWorkflowCommand` (`Lep`) `:506513-506557` projects the
   registry row into a `type: "prompt"` command whose body tells the model to call
   `Workflow({ name: "deep-research", args: … })`.

That third step is why the changelog can say "`/deep-research` starts only when invoked manually"
without touching the script: the restraint lives on the *command projection*, not in the research
logic. See [`deep_research_runtime_contract.md`](deep_research_runtime_contract.md) §3–§4.

```javascript
// ============================================
// registerDeepResearchWorkflow - Pushes the deep-research script + metadata into the bundled registry
// Location: cli_inner_pretty.js:424449-424881 (registration tail :424877-424880)
// ============================================

// ORIGINAL (for source lookup):
function mRd() {
  kxo(
    `export const meta = {
  name: '${uRd}',
  description: '${dRd}',
  whenToUse: '${pRd}',
  phases: ${JSON.stringify(fRd)},
}
...
}`,
    { name: uRd, description: dRd, whenToUse: pRd, phases: fRd },
    { disableModelInvocation: MJy },
  );
}

// READABLE (for understanding):
function registerDeepResearchWorkflow() {
  registerBundledWorkflow(
    `export const meta = {
  name: '${DEEP_RESEARCH_WORKFLOW_NAME}',
  description: '${DEEP_RESEARCH_WORKFLOW_DESCRIPTION}',
  whenToUse: '${DEEP_RESEARCH_WORKFLOW_WHEN_TO_USE}',
  phases: ${JSON.stringify(DEEP_RESEARCH_PHASES)},
}
... 440 lines of harness ...`,
    { name: …, description: …, whenToUse: …, phases: … },   // registry metadata
    { disableModelInvocation: isDeepResearchModelInvocationDisabled },  // .218 restraint
  );
}

// Mapping: mRd→registerDeepResearchWorkflow, kxo→registerBundledWorkflow, uRd→DEEP_RESEARCH_WORKFLOW_NAME,
//          dRd→…_DESCRIPTION, pRd→…_WHEN_TO_USE, fRd→DEEP_RESEARCH_PHASES, MJy→isDeepResearchModelInvocationDisabled
```

### Why the metadata is interpolated into the script *and* passed as an argument

`meta` appears twice: textually inside the script (so the compiled script's own `export const meta`
is well-formed and self-describing) and again as the second argument to the registrar (so the registry
does not have to parse the script to know the name). The interpolation is a plain template
substitution with **no escaping** — `${pRd}` lands inside a single-quoted JS string literal, and
`pRd` (`:424885-424886`) contains the apostrophe-free but quote-bearing text
`(e.g., "what car to buy" without budget/use-case/region)`. Double quotes are safe inside single
quotes; a single quote in any of these three constants would produce a syntax error at *run* time,
not build time. The constants are hard-coded, so this is safe by construction — but it is a
build-time-unverified invariant, and worth knowing when reading the other bundled workflow.

**Key insight:** the script is data. Nothing in the release pipeline can tell you it parses. The
first proof that the harness is syntactically valid is a user running it, at which point a parse
failure returns `status: "async_launched"` carrying `error` (`:389506-389520`) rather than crashing.

---

## 2. The four tuning constants

```javascript
// ============================================
// Deep-research tuning constants - the whole cost/quality envelope of the harness
// Location: cli_inner_pretty.js:424462-424465
// ============================================

// ORIGINAL (for source lookup):
const VOTES_PER_CLAIM = 3
const REFUTATIONS_REQUIRED = 2
const MAX_FETCH = 15
const MAX_VERIFY_CLAIMS = 25

// READABLE (for understanding):
const VOTES_PER_CLAIM = 3        // adversarial verifiers spawned per surviving claim
const REFUTATIONS_REQUIRED = 2   // refutations needed to kill a claim (and the quorum floor)
const MAX_FETCH = 15             // soft budget on distinct URLs fetched (see §6.3 — high relevance bypasses it)
const MAX_VERIFY_CLAIMS = 25     // hard cap on claims entering the verify phase

// Mapping: (no obfuscation — these are inside the script literal, verbatim)
```

**Why 3 and 2, and why the same number twice.** `REFUTATIONS_REQUIRED = 2` is used for two
different jobs: it is the kill threshold (`refuted >= 2`) *and* the quorum floor
(`valid.length >= 2`) at `:424766-424767`. That reuse is not laziness — with `VOTES_PER_CLAIM = 3`,
2 is simultaneously (a) a strict majority of 3 and (b) the smallest number of independent votes from
which a majority can be computed at all. If a third vote errors, the remaining two still decide the
claim; if two error, no majority is derivable and the claim is *unverified* rather than guessed. A
single constant expresses both facts because for `n = 3` they coincide. For `VOTES_PER_CLAIM = 5`
they would not, and the script would need to split them.

**Why 3 and not 1.** The prompt at `:424648-424650` instructs `Default to refuted=true if uncertain`.
A single skeptical verifier with that instruction has a high false-kill rate. Requiring 2 of 3
converts a biased single judgment into a majority vote over three independent biased judgments,
which is the standard variance-reduction argument: the bias survives (that is intentional — the
harness prefers dropping true claims to publishing false ones) but the variance is cut.

**Why 25 verify claims.** Verification is the expensive phase: `claims × 3` agents. At 25 that is 75
agent calls, already 5× the entire rest of the run. Every extra claim costs three subagents, so the
cap is the single most load-bearing number in the file. The claims are not truncated arbitrarily —
they are sorted first (§7), so the cap drops the *least* important, *lowest*-quality claims.

**Why 15 fetches.** Fetch is the second-most expensive phase (one agent per URL, each doing a
WebFetch plus extraction). 15 is roughly `angles × 3`, i.e. it expects to keep about half of the 4–6
results each of the 5 searchers returns. But see §6.3: the cap does not actually bind for
high-relevance results.

---

## 3. The five schemas — and why they are what makes the script total

`:424468-424538` declares `SCOPE_SCHEMA`, `SEARCH_SCHEMA`, `EXTRACT_SCHEMA`, `VERDICT_SCHEMA`,
`REPORT_SCHEMA`. Each is passed to `agent()` as `{schema}`, which the runtime compiles into a
`StructuredOutput` tool the subagent is *forced* to call (`:387453-387457`, `:388196-388200`).

| Schema | Required keys | Bounded arrays | Enums it introduces |
|--------|---------------|----------------|---------------------|
| `SCOPE_SCHEMA` `:424468-424482` | `question`, `angles`, `summary` | `angles` `minItems: 3, maxItems: 6` | — |
| `SEARCH_SCHEMA` `:424483-424496` | `results` (per item: `url`, `title`, `relevance`) | `results` `maxItems: 6` | `relevance: high\|medium\|low` |
| `EXTRACT_SCHEMA` `:424497-424511` | `claims`, `sourceQuality` (per claim: `claim`, `quote`, `importance`) | `claims` `maxItems: 5` | `sourceQuality: primary\|secondary\|blog\|forum\|unreliable`; `importance: central\|supporting\|tangential` |
| `VERDICT_SCHEMA` `:424512-424520` | `refuted`, `evidence`, `confidence` | — | `confidence: high\|medium\|low` |
| `REPORT_SCHEMA` `:424521-424538` | `summary`, `findings`, `caveats` | **none** | `confidence` per finding |

### Why the enums matter more than they look

The script does three rank lookups against plain object literals:

```javascript
// ============================================
// Rank tables - ordinal projections of the three schema enums
// Location: cli_inner_pretty.js:424608 (relevance), :424726-424727 (importance, quality), :424809 (confidence)
// ============================================

// ORIGINAL (for source lookup):
const relRank = { high: 0, medium: 1, low: 2 }
const impRank = { central: 0, supporting: 1, tangential: 2 }
const qualRank = { primary: 0, secondary: 1, blog: 2, forum: 3, unreliable: 4 }
const confRank = { high: 0, medium: 1, low: 2 }

// READABLE (for understanding):
// Each table is a total function from its enum to a sort key ONLY because Ajv validated the enum
// at the tool boundary. An unvalidated string would yield undefined, and (undefined - n) is NaN,
// which makes Array.prototype.sort's comparator inconsistent → implementation-defined ordering.

// Mapping: (verbatim inside the script literal)
```

Every one of those tables is keyed exactly by an enum from the schema table above. If the schema did
not constrain the field, a hallucinated `"very high"` would make `relRank[…]` `undefined`, the
comparator would return `NaN`, and `sort` would silently produce garbage order rather than throw.
So the schemas are not merely documentation for the model — they are what makes the ranking code
**total**. This is the strongest single argument in the file for why every `agent()` call carries a
`schema`.

**`REPORT_SCHEMA` is the exception that proves it.** It has no `maxItems` on `findings` and no
bounded enum that the script indexes. The script only reads `report.findings.length` (`:424872`) and
spreads the object (`:424860`), so an unbounded array is harmless here.

---

## 4. Phase 0 — Scope

```javascript
// ============================================
// Scope phase - args → 3..6 search angles, with the only hard input contract in the harness
// Location: cli_inner_pretty.js:424540-424562
// ============================================

// ORIGINAL (for source lookup):
phase("Scope")
const QUESTION = (typeof args === "string" && args.trim()) || ""
if (!QUESTION) {
  return { error: "No research question provided. Pass it as args: Workflow({name: 'deep-research', args: '<question>'})." }
}
const scope = await agent(
  "Decompose this research question into complementary search angles.\\n\\n" + ...,
  { label: "scope", schema: SCOPE_SCHEMA }
)
if (!scope) {
  return { error: "Scope agent returned no result — cannot decompose the research question." }
}

// READABLE (for understanding):
phase("Scope")
const QUESTION = (typeof args === "string" && args.trim()) || ""     // args is realm-native (JSON round-trip)
if (!QUESTION) return { error: "No research question provided. …" }  // typed args, empty args, or omitted args
const scope = await agent(scopePrompt(QUESTION), { label: "scope", schema: SCOPE_SCHEMA })
if (!scope) return { error: "Scope agent returned no result — cannot decompose the research question." }

// Mapping: (verbatim inside the script literal; `args` is injected at :388408-388413)
```

**How it works:**

1. `typeof args === "string"` rejects the case where a caller passed an object or array as `args`.
   The runtime marshals `args` by `JSON.stringify` on the host side and `JSON.parse` inside the realm
   (`:388407-388413`), so an object arrives as a realm-native object, not a string — and this guard
   turns that into a clean error instead of `args.trim is not a function`.
2. `.trim() || ""` collapses whitespace-only input to the empty string, so `args: "   "` is treated
   as "no question".
3. The `!scope` guard handles the two ways `agent()` yields `null`: the user pressed skip on that
   agent in the `/workflows` view, or the agent died on a terminal API error after the retry ladder
   (`:387296-387460`, `:388010`).

**Why this approach:** every downstream phase reads `scope.angles`, so an unchecked `null` would
throw `Cannot read properties of null` and lose the whole run with a stack trace instead of a
message. The pattern — *check every `agent()` result for `null`, return a structured error* — recurs
at `:424709` (fetch), `:424843` (synthesis) and is the harness's single most consistent defensive
habit.

**The 5-vs-3-vs-6 discrepancy.** The prompt says `Generate 5 distinct web search queries`
(`:424550`); the schema permits `minItems: 3, maxItems: 6` (`:424473`); `meta.phases` advertises
`5 parallel WebSearch agents` (`:424894`). Only the schema is enforced. Every later count that reads
`scope.angles.length` (`:424562`, `:424865`, `:424875`) uses the actual value, so the harness is
correct for 3–6 while the user-facing phase text is correct only for the modal case.

---

## 5. The URL identity layer — the `.207` delta

This is the largest change in the window and the most interesting code in the file. 2.1.193 spent
**8 lines** on URL handling (6 for `normURL` at `:443852-443857 (193)`, 2 for the label at
`:443938-443939 (193)`). 2.1.220 spends **57** — `:424565-424604` plus `:424685-424701` — of which
**38 are comment**. A 3:2 comment-to-code ratio in a bundled script is itself a signal: the authors
expected this code to be re-read and doubted.

### 5.1 What 2.1.193 did

```javascript
// ============================================
// URL normalisation and fetch label - the 2.1.193 version, for contrast
// Location: cli_inner_pretty.js:443852-443857 (193), :443938-443939 (193)
// ============================================

// ORIGINAL (for source lookup):
const normURL = u => {
  try {
    const p = new URL(u)
    return (p.hostname.replace(/^www\\./, "") + p.pathname.replace(/\\/$/, "")).toLowerCase()
  } catch { return u.toLowerCase() }
}
...
        let host = "unknown"
        try { host = new URL(source.url).hostname.replace(/^www\\./, "") } catch {}

// READABLE (for understanding):
const normURL = u => {
  try {
    const p = new URL(u)                                  // ← URL is NOT a global in the workflow realm
    return (p.hostname.replace(/^www\./, "") + p.pathname.replace(/\/$/, "")).toLowerCase()
  } catch { return u.toLowerCase() }                      // ← so this catch fired on EVERY url
}
let host = "unknown"
try { host = new URL(source.url).hostname.replace(/^www\./, "") } catch {}   // ← and this one too

// Mapping: (verbatim inside the 2.1.193 script literal)
```

**This is the bug.** The workflow sandbox is `vm.createContext` over a bare object literal
(`:388373-388384`) — it contains ECMAScript intrinsics plus exactly the six host values the runtime
injects (`log`, `phase`, `console`, `budget`, `setTimeout`, `clearTimeout`), then four more
(`agent`, `parallel`, `pipeline`, `workflow`) and `args`. `URL` is a WHATWG global, not an
ECMAScript intrinsic, so it is **absent**. `new URL(...)` therefore threw `ReferenceError` every
single time, in both call sites:

- in `normURL`, the `catch` returned `u.toLowerCase()` — so dedup fell back to comparing raw
  lowercased URLs. Still *correct* (it deduplicates exact repeats) but far weaker: `x.com/a` and
  `x.com/a/` and `www.x.com/a` all became distinct keys, so the same page could be fetched three
  times out of three different angles.
- at the label site, `host` stayed `"unknown"` — which is precisely the reported symptom:
  *"Deep research runs labeling every Fetch-phase agent 'unknown'"*.

Both symptoms have one root cause, and the `.207` fix addresses both.

### 5.2 The replacement parser

```javascript
// ============================================
// URL_HOST_PATTERN / normURL - regex URL parsing built to match WHATWG authority splitting
// Location: cli_inner_pretty.js:424565-424579
// ============================================

// ORIGINAL (for source lookup):
const URL_HOST_PATTERN = /^[a-z][a-z0-9+.-]*:\\/\\/(?:[^/?#\\\\]*@)?(?:www\\.)?([^/:?#@\\\\]+)(?::\\d+)?([^?#]*)/i
const normURL = u => {
  const m = String(u).match(URL_HOST_PATTERN)
  return m ? (m[1] + m[2].replace(/\\/$/, "")).toLowerCase() : String(u).toLowerCase()
}

// READABLE (for understanding):
// (backslashes un-doubled: the source above lives inside a template literal)
const URL_HOST_PATTERN =
  /^[a-z][a-z0-9+.-]*:\/\/     // scheme, RFC-3986 charset
   (?:[^/?#\\]*@)?             // OPTIONAL userinfo — greedy, so it eats every @ up to the last
   (?:www\.)?                  // strip a leading www.
   ([^/:?#@\\]+)               // (1) hostname — no @, no backslash
   (?::\d+)?                   // strip the port
   ([^?#]*)                    // (2) pathname, up to ? or #
  /i
const normalizeUrlForDedup = url => {
  const m = String(url).match(URL_HOST_PATTERN)
  return m ? (m[1] + m[2].replace(/\/$/, "")).toLowerCase()   // host + path, trailing slash dropped
           : String(url).toLowerCase()                        // unparseable → whole string as key
}

// Mapping: (verbatim inside the script literal)
```

**How it works, and why each exclusion is there.** The comment at `:424565-424574` is unusually
explicit, and it is worth reading as a specification rather than a note. Two exclusions carry the
whole security argument:

1. **`\` is excluded from both the userinfo class and the host class.** WHATWG URL treats `\` as a
   path separator for `http(s)` schemes. So in `https://evil.com\@trusted.com/x`, a real fetch goes
   to `evil.com` (the `\` ends the authority), while a regex whose host class admitted `\` would
   capture `trusted.com` from the text after the `@`. The label would then assert a host the fetch
   never contacted. Excluding `\` makes the regex agree with WHATWG.

2. **The userinfo group is greedy (`[^/?#\\]*@`), and the host class excludes `@`.** WHATWG splits
   the authority at the **last** `@` before the host. In `https://x@trusted.com@evil.com/`, the real
   host is `evil.com`. A lazy or first-`@` match would capture `trusted.com`. Greedy matching plus a
   host class that cannot contain `@` forces the split to the last `@` — again agreeing with WHATWG.

**Why this approach.** The alternative — asking the host to parse the URL and pass the parsed pieces
in — is impossible: the script is a string with no import mechanism and no host-provided URL helper.
The realm is deliberately minimal (see the runtime doc §5). The only other option would be to widen
the realm with a `URL` shim, which enlarges the sandbox's attack surface for one workflow's benefit.
A regex in the script keeps the sandbox contract unchanged. The cost is that the regex must now
independently re-derive WHATWG's authority rules, which is exactly what the comment documents.

**Key insight:** the two rejected characters are not chosen for parser hygiene. They are chosen
because they are the two characters whose WHATWG handling *diverges from the naive reading*, and
each divergence is a way to make a displayed hostname disagree with the fetched hostname.

**A residual, stated honestly:** `normURL` deliberately keeps the raw capture with no sanitisation
(`:424590-424592`), because dedup keys are never rendered and stripping characters there could
collide two genuinely different URLs. That is the correct trade for a dedup key. It does mean the
`seen` map can hold keys containing control characters — they simply never reach a terminal.

### 5.3 The label sanitiser

```javascript
// ============================================
// LABEL_STRIP / STRICT_HOST / quotedLabel - rendering web-controlled text into a terminal label
// Location: cli_inner_pretty.js:424593-424604
// ============================================

// ORIGINAL (for source lookup):
const LABEL_CAP = 40
const LABEL_STRIP = /[\\x00-\\x1f\\x7f-\\x9f\\u200b-\\u200f\\u202a-\\u202e\\u2066-\\u2069\\ufeff\\u0022\\u201c-\\u201f\\u2033\\u2036\\u275d\\u275e\\u301d\\u301e\\uff02]/g
const STRICT_HOST = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/
const stripLabelChars = s => String(s).replace(LABEL_STRIP, "")
const quotedLabel = s => {
  const cps = Array.from(stripLabelChars(s))
  return '"' + cps.slice(0, LABEL_CAP).join("").trim() + (cps.length > LABEL_CAP ? "\\u2026" : "") + '"'
}

// READABLE (for understanding):
const LABEL_CAP = 40
// (escape notation kept deliberately — every char in groups 2-4 is invisible when rendered)
const LABEL_STRIP = /[
  \x00-\x1f  \x7f-\x9f     // 1. C0 + C1 controls — includes ESC (the CSI introducer) and the 8-bit C1 forms
  \u200b-\u200f            // 2. ZWSP, ZWNJ, ZWJ, LRM, RLM
  \u202a-\u202e            // 3. bidi embeddings and overrides (LRE RLE PDF LRO RLO)
  \u2066-\u2069            // 4. bidi isolates (LRI RLI FSI PDI)
  \ufeff                   // 5. BOM / zero-width no-break space
  "                   // 6. ASCII double quote
  \u201c-\u201f \u2033 \u2036 \u275d \u275e \u301d \u301e \uff02   // 7. every double-quote lookalike
]/g
const STRICT_HOST = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/
//                  dot-separated LDH labels; no leading/trailing '-', no empty label, ASCII only
const stripLabelChars = s => String(s).replace(LABEL_STRIP, "")
const quotedLabel = s => {
  const cps = Array.from(stripLabelChars(s))          // Array.from → code points, never splits a surrogate pair
  return '"' + cps.slice(0, LABEL_CAP).join("").trim()
             + (cps.length > LABEL_CAP ? "…" : "")    // ellipsis INSIDE the quotes
             + '"'
}

// Mapping: (verbatim inside the script literal)
```

**Three distinct threat classes, three distinct answers:**

| Threat | Mechanism | Answer |
|--------|-----------|--------|
| Terminal control injection | A title containing `ESC[2J` or C1 `\x9b` would be interpreted by the terminal | strip C0 (`\x00-\x1f`) and C1 (`\x7f-\x9f`) |
| Visual reordering / hiding | Bidi overrides and isolates reorder rendered text; zero-width chars hide it | strip `\u200b-\u200f`, `\u202a-\u202e`, `\u2066-\u2069`, `\ufeff` |
| Quote forgery | The fallback is `"…"`-quoted. A `"` inside the value visually closes the quote early, and anything after it reads as un-quoted, trusted label text | strip **every** double-quote lookalike, not just ASCII `"` |

**Why the whole quote family and not just `"`.** The quoted form is the harness's "this value
is untrusted" marker. If a title is `evil" example.com`, stripping only ASCII `"` is enough — but a
title containing `”` (`”`) renders as a closing quote in essentially every terminal font, so
`bad” example.com` would render as `"bad" example.com` and the trailing text would appear to be
outside the quotes. The eight extra code points (`\u201c-\u201f`, `\u2033`, `\u2036`, `\u275d`,
`\u275e`, `\u301d`, `\u301e`, `\uff02`) are exactly the ones that render as a double quote. The
defence is *visual*, so the character class has to be defined visually.

**Why the ellipsis goes inside the quotes.** `"abcdefg…"` is unambiguous: the reader can see the
value was truncated. `"abcdefg"…` would read as a complete quoted value followed by decoration. With
a cap of 40 and hostnames often longer, this matters: a prefix of a long hostname is itself a
plausible-looking hostname.

**Why `Array.from`.** `String.prototype.slice(0, 40)` slices UTF-16 code units and can cut a
surrogate pair in half, emitting a lone surrogate into the terminal. `Array.from` iterates code
points. The cost is O(n) allocation per label, on ≤36 labels per run — irrelevant.

### 5.4 The four-condition trust ladder

```javascript
// ============================================
// Fetch label derivation - decide whether a bare host may be asserted as the fetch target
// Location: cli_inner_pretty.js:424696-424701
// ============================================

// ORIGINAL (for source lookup):
        const capturedHost = String(source.url).match(URL_HOST_PATTERN)?.[1] ?? ""
        const host = capturedHost.toLowerCase()
        const cleanHost = stripLabelChars(host)
        const isCleanBareHost = cleanHost === host && host !== "" && Array.from(host).length <= LABEL_CAP && STRICT_HOST.test(host)
        const hostLabel = cleanHost === "" ? "" : isCleanBareHost ? host : quotedLabel(host)
        const sourceLabel = hostLabel || (stripLabelChars(source.title).trim() && quotedLabel(source.title)) || "unknown"

// READABLE (for understanding):
const capturedHost = String(source.url).match(URL_HOST_PATTERN)?.[1] ?? ""
const host       = capturedHost.toLowerCase()
const cleanHost  = stripLabelChars(host)
const isCleanBareHost =
      cleanHost === host                       // (1) sanitisation changed nothing
   && host !== ""                              // (2) something was captured
   && Array.from(host).length <= LABEL_CAP     // (3) no truncation would be needed
   && STRICT_HOST.test(host)                   // (4) strict ASCII LDH hostname
const hostLabel   = cleanHost === "" ? "" : isCleanBareHost ? host : quotedLabel(host)
const sourceLabel = hostLabel
                 || (stripLabelChars(source.title).trim() && quotedLabel(source.title))
                 || "unknown"
// → agent label becomes  "fetch:example.com"  |  'fetch:"аmazon.com"'  |  'fetch:"Some page title…"'  |  "fetch:unknown"

// Mapping: (verbatim inside the script literal)
```

**The invariant being defended:** a bare `fetch:<host>` label is an *assertion* that the agent is
about to fetch `<host>`. The four conditions are each a way that assertion could be false:

1. **`cleanHost === host`** — if sanitisation deleted anything, the displayed string is not the real
   host. The comment's example is precise: `exa<ctrl>mple.com` sanitises to `example.com`, which is
   a *different, real, trusted-looking* domain. Displaying it bare would be an outright lie.
2. **`host !== ""`** — nothing captured, nothing to assert.
3. **`Array.from(host).length <= LABEL_CAP`** — if the host is longer than 40 code points, the
   display would be a prefix. A prefix of `trusted-bank.com.evil.example` is `trusted-bank.com.evi`
   — the prefix relationship is exactly the attack.
4. **`STRICT_HOST.test(host)`** — rejects non-ASCII. The comment names the reason: an IDN homograph
   such as Cyrillic `аmazon.com` is resolved by WebFetch through punycode, and punycode conversion
   is **unavailable in this realm** (no `URL`, no `punycode`), so the script cannot compute what the
   fetch will actually resolve to. It therefore refuses to assert it.

Anything failing the ladder degrades to `quotedLabel(host)` — same value, but visibly marked as
untrusted. Only if nothing at all was captured does it fall through to the title (also quoted), and
only if the title is empty after stripping does it reach `"unknown"`.

**Key insight:** point 4 is a *capability* argument, not a *policy* argument. The script is not
saying "non-ASCII hosts are suspicious"; it is saying "I cannot compute the punycode form in this
realm, therefore I cannot verify my own label, therefore I must not present it as verified." That is
the correct response to a missing capability, and it is the same reasoning that produced the regex
in §5.2 — both are consequences of the sandbox's minimalism.

**What survived from `.207` unchanged:** the `"unknown"` string. It is still the last fallback
(`:424701`). The bug was never that `"unknown"` existed; it was that it was reached unconditionally.

---

## 6. The Search → dedup → Fetch pipeline

`:424653-424722`. One `pipeline()` call, two stages, **no barrier between them**.

### 6.1 Stage 1 — the searchers

```javascript
// ============================================
// Search stage - one agent per angle, each returning up to 6 ranked results
// Location: cli_inner_pretty.js:424656-424662
// ============================================

// ORIGINAL (for source lookup):
  angle => agent(SEARCH_PROMPT(angle), {
    label: "search:" + angle.label, phase: "Search", schema: SEARCH_SCHEMA
  }).then(r => {
    if (!r) return null
    log(angle.label + ": " + r.results.length + " results")
    return { angle: angle.label, results: r.results }
  }),

// READABLE (for understanding):
angle => agent(searchPrompt(angle), {
  label: `search:${angle.label}`,     // angle labels come from the Scope agent, not from the web
  phase: "Search",                    // explicit phase → no dependence on the global phase() cursor
  schema: SEARCH_SCHEMA,
}).then(result => {
  if (!result) return null            // null here short-circuits stage 2 for THIS angle only
  log(`${angle.label}: ${result.results.length} results`)
  return { angle: angle.label, results: result.results }
})

// Mapping: (verbatim inside the script literal)
```

Two details that are easy to miss:

- **`phase: "Search"` is passed explicitly** even though `phase("Scope")` was the last global call.
  Inside a `pipeline()`, stages for different items run concurrently, so a global `phase()` call
  would race — whichever item happened to run next would capture whatever the cursor said. The
  explicit `phase` opt makes grouping deterministic. `meta.phases` pre-registers all five titles
  before the script starts (`:388670`, `:387218`), so `"Search"` resolves to phase index 2 regardless
  of arrival order. See the runtime doc §10.
- **Returning `null` skips the rest of the chain for that item.** `pipeline`'s per-item loop is
  `for (const stage of stages) { if (prev.v === null) break; prev = await stage(prev.v, item, i) }`
  (`:388083-388089`). So a failed searcher costs its angle, and nothing else.

### 6.2 Stage 2 — dedup, then fan out

```javascript
// ============================================
// Dedup stage - relevance-ordered novelty filter feeding a parallel fetch fan-out
// Location: cli_inner_pretty.js:424664-424721
// ============================================

// ORIGINAL (for source lookup):
  searchResult => {
    const sorted = [...searchResult.results].sort((a, b) => relRank[a.relevance] - relRank[b.relevance])
    const novel = sorted.filter(r => {
      const key = normURL(r.url)
      if (seen.has(key)) {
        dupes.push({ ...r, angle: searchResult.angle, dupOf: seen.get(key) })
        return false
      }
      if (fetchSlots <= 0 && relRank[r.relevance] >= 1) {
        budgetDropped.push({ ...r, angle: searchResult.angle })
        return false
      }
      seen.set(key, { angle: searchResult.angle, title: r.title })
      fetchSlots--
      return true
    })
    ...
    return parallel(novel.map(source => () => { ... }))
  }

// READABLE (for understanding):
searchResult => {
  // 1. Rank within this angle: high first. The sort is applied BEFORE the budget check,
  //    so the best results of each angle claim slots first.
  const sorted = [...searchResult.results].sort((a, b) => relRank[a.relevance] - relRank[b.relevance])
  const novel = sorted.filter(r => {
    const key = normalizeUrlForDedup(r.url)
    if (seen.has(key)) { dupes.push({ …r, angle: searchResult.angle, dupOf: seen.get(key) }); return false }
    if (fetchSlots <= 0 && relRank[r.relevance] >= 1) {          // ← medium/low only
      budgetDropped.push({ …r, angle: searchResult.angle }); return false
    }
    seen.set(key, { angle: searchResult.angle, title: r.title })
    fetchSlots--                                                  // may go negative — see §6.3
    return true
  })
  if (novel.length < searchResult.results.length) log(…)
  return parallel(novel.map(source => () => fetchAgent(source, searchResult.angle)))
}

// Mapping: (verbatim inside the script literal)
```

**Why sort before filtering.** The budget is consumed in iteration order. Sorting by relevance first
means each angle spends its slots on its own best results. Without the sort, an angle whose searcher
happened to list a `low` result first would burn a slot on it.

**Why the mutation of `seen` is safe.** `seen`, `dupes`, `budgetDropped` and `fetchSlots` are
closed-over module-level state mutated from inside a pipeline stage — i.e. from several concurrent
item-chains. This is safe *only* because the stage body is fully synchronous up to the `return
parallel(...)`: JavaScript runs it to completion without an interleaving point, so each angle's
filter pass is atomic with respect to the others. Had the filter contained an `await`, two angles
could interleave and both claim the last slot. The ordering *between* angles is completion order of
stage 1, not the declaration order of `scope.angles` — so which angle wins a contested URL is
non-deterministic, and `dupOf` records the winner for the report.

### 6.3 `MAX_FETCH` is a soft cap — the cost consequence

```javascript
if (fetchSlots <= 0 && relRank[r.relevance] >= 1) { … return false }
```

The budget check has a second conjunct. `relRank[r.relevance] >= 1` is true for `medium` and `low`
and **false for `high`**. So once `fetchSlots` reaches 0:

- `medium`/`low` results are dropped and recorded in `budgetDropped`;
- `high` results are **still admitted**, and `fetchSlots--` drives the counter negative.

**Upper bound:** each of up to 6 angles returns up to 6 results (`SEARCH_SCHEMA` `maxItems: 6`), so
if every result is distinct and rated `high`, the harness fetches **36** sources, not 15. Since
`agentCalls` counts `allSources.length` (`:424866`, `:424875`), the fetch phase alone can be 36
agents.

**Why the escape hatch exists.** The failure it avoids is: five angles each return one genuinely
central source, but the first two angles' medium-relevance noise has already eaten all 15 slots. The
carve-out guarantees a high-relevance source is never dropped for budget. The trade is that the
"top 15 sources" promise in `meta.phases` (`:424895`) is a *typical* figure, not a bound. The run
still reports the truth: `stats.sourcesFetched` is the real count and `stats.budgetDropped` the real
drop count.

**Is it exploitable?** Only by the searcher agents, which assign `relevance` themselves. A
sycophantic searcher that marks everything `high` maximises cost. Nothing in the harness caps this;
the only backstops are the runtime's global agent cap of 1,000 (`:388110`) and the turn token budget
(`:388369`). Given `36 ≪ 1000`, the practical backstop is the token budget alone.

### 6.4 The fetch agent and its two error paths

```javascript
// ============================================
// Fetch agent - extract falsifiable claims, with skip and failure distinguished
// Location: cli_inner_pretty.js:424702-424718
// ============================================

// ORIGINAL (for source lookup):
        return agent(FETCH_PROMPT(source, searchResult.angle), {
          label: "fetch:" + sourceLabel,
          phase: "Fetch",
          schema: EXTRACT_SCHEMA,
        }).then(ext => {
          // User-skip → null; drop it (filtered by searchResults.flat().filter(Boolean))
          // rather than throwing into .catch() and mislabeling it "unreliable".
          if (!ext) return null
          return { url: source.url, title: source.title, angle: searchResult.angle,
                   sourceQuality: ext.sourceQuality, publishDate: ext.publishDate,
                   claims: ext.claims.map(c => ({ ...c, sourceUrl: source.url, sourceQuality: ext.sourceQuality })) }
        }).catch(e => {
          log("fetch failed: " + source.url + " — " + (e.message || e))
          return { url: source.url, title: source.title, angle: searchResult.angle, sourceQuality: "unreliable", claims: [] }
        })

// READABLE (for understanding):
return agent(fetchPrompt(source, angle), { label: `fetch:${sourceLabel}`, phase: "Fetch", schema: EXTRACT_SCHEMA })
  .then(ext => {
    if (!ext) return null                       // skipped/errored agent → NOT a source at all
    return {
      url: source.url, title: source.title, angle,
      sourceQuality: ext.sourceQuality, publishDate: ext.publishDate,
      // denormalise source identity onto every claim — claims travel alone from here on
      claims: ext.claims.map(c => ({ …c, sourceUrl: source.url, sourceQuality: ext.sourceQuality })),
    }
  })
  .catch(e => {                                  // a THROW → a real source that we judged unreliable
    log(`fetch failed: ${source.url} — ${e.message || e}`)
    return { url: source.url, title: source.title, angle, sourceQuality: "unreliable", claims: [] }
  })

// Mapping: (verbatim inside the script literal)
```

**Why `null` and `"unreliable"` are different outcomes** — this distinction is the same idea that
the `.196` verify fix generalised, applied one phase earlier:

- `null` means *we never got a judgment*. The source is removed entirely by
  `searchResults.flat().filter(Boolean)` (`:424724`), so it does not appear in `stats.sourcesFetched`
  or in the `sources` array of the report.
- `"unreliable"` with `claims: []` means *we looked and it was not usable*. It stays in the source
  list, so the report can show that the URL was attempted.

Conflating them would let a user-skipped agent or an API outage masquerade as an editorial judgment
about a website. The comment at `:424707-424708` says exactly this.

**The claim denormalisation** at `:424713` is what makes the rest of the harness simple: after this
point claims are self-contained (`sourceUrl` + `sourceQuality` inline), so ranking, verification and
synthesis never need to walk back to the source object.

---

## 7. Ranking and the deliberate barrier

```javascript
// ============================================
// Claim ranking - importance-major, quality-minor, then hard-capped
// Location: cli_inner_pretty.js:424724-424746
// ============================================

// ORIGINAL (for source lookup):
const allSources = searchResults.flat().filter(Boolean)
const allClaims = allSources.flatMap(s => s.claims)
...
const rankedClaims = [...allClaims]
  .sort((a, b) => (impRank[a.importance] - impRank[b.importance]) || (qualRank[a.sourceQuality] - qualRank[b.sourceQuality]))
  .slice(0, MAX_VERIFY_CLAIMS)
...
// Barrier here is intentional — claim pool must be fully assembled before ranking/verification.
phase("Verify")

// READABLE (for understanding):
const allSources = searchResults.flat().filter(Boolean)   // flat(): stage 2 returned arrays; filter: drop nulls
const allClaims  = allSources.flatMap(s => s.claims)
const rankedClaims = [...allClaims]
  .sort((a, b) =>
       (impRank[a.importance]  - impRank[b.importance])   // central > supporting > tangential
    || (qualRank[a.sourceQuality] - qualRank[b.sourceQuality]))  // tie-break: primary > … > unreliable
  .slice(0, MAX_VERIFY_CLAIMS)                            // 25

// Mapping: (verbatim inside the script literal)
```

**Why importance beats quality.** A `central` claim from a blog is more worth verifying than a
`tangential` claim from a primary source — precisely because verification is the mechanism that
*decides* whether the blog claim survives. Ranking quality-first would spend the verification budget
confirming things that were already credible and never test the claims that actually need testing.
The ordering encodes "spend scrutiny where the answer is in doubt and the stakes are high".

**Why the barrier here is correct.** The Workflow tool's own prose (`rMs` `:388943-389101`) argues
against barriers and enumerates the exceptions — `A barrier is correct ONLY when stage N needs
cross-item context from all of stage N-1` (`:389005`), first bullet
`Dedup/merge across the full result set before expensive downstream work` (`:389006`). A global
top-25 across *all* sources cannot be computed until every source has reported, so this is precisely
the sanctioned case, and the comment at `:424745` states the justification explicitly. The harness
avoids a barrier everywhere else.

**The empty-pool early return** at `:424735-424742` fires when every source produced zero claims. It
returns a fully-formed result (with `dupes` and `budgetDropped` counts) rather than proceeding to a
verify phase over an empty array — which would otherwise produce the confusing
"0 confirmed, 0 refuted" report.

---

## 8. Verify — the 3-vote adversarial panel and the `.196` three-way outcome

### 8.1 The prompt

`VERIFY_PROMPT` (`:424635-424650`) is the harness's sharpest piece of prompt engineering:

- It announces the vote arithmetic **to the voter**: `≥2/3 refutations kill it`. The voter knows its
  vote is one of three, which discourages the "I must decide this alone" over-caution.
- Five numbered checks, each a distinct failure mode: quote-overreach, contradicting evidence,
  source-strength mismatch, staleness, marketing/press-release/cherry-pick.
- An explicitly asymmetric decision rule: `refuted=true` on any of five conditions; `refuted=false`
  **only** if well-supported *and* current *and* source-strength-matched.
- `Default to refuted=true if uncertain.`

**Why the asymmetry is deliberate.** The harness is a *precision* instrument, not a recall
instrument. A false confirmation puts an unsupported statement into a cited report the user will
trust; a false refutation loses a true statement that the user can still find by searching normally.
The bias is chosen to make the first error rare at the cost of making the second common. §2 explains
why 3 voters are then needed to keep that bias from becoming noise.

### 8.2 The tally

```javascript
// ============================================
// Verdict tally - the .196 three-way split (survives / refuted / unverified)
// Location: cli_inner_pretty.js:424757-424771
// ============================================

// ORIGINAL (for source lookup):
    ).then(verdicts => {
      // A vote can be null (user-skip or agent error) — treat as no vote cast.
      // Three outcomes (go/ccissue/69883 — infra failure must not read as "refuted"):
      //   survives  — quorum of valid votes AND fewer than REFUTATIONS_REQUIRED refuting
      //   isRefuted — ≥REFUTATIONS_REQUIRED refute votes (adjudicated against on merit)
      //   otherwise — unverified: too few valid votes to adjudicate (verifier agents errored)
      const valid = verdicts.filter(Boolean)
      const refuted = valid.filter(v => v.refuted).length
      const errored = VOTES_PER_CLAIM - valid.length
      const survives = valid.length >= REFUTATIONS_REQUIRED && refuted < REFUTATIONS_REQUIRED
      const isRefuted = refuted >= REFUTATIONS_REQUIRED
      const mark = survives ? "✓" : isRefuted ? "✗" : "?"
      log(...)
      return { ...claim, verdicts: valid, refutedVotes: refuted, erroredVotes: errored, survives, isRefuted }
    })

// READABLE (for understanding):
.then(verdicts => {
  const valid    = verdicts.filter(Boolean)          // null = user-skip or agent error = no vote cast
  const refuted  = valid.filter(v => v.refuted).length
  const errored  = VOTES_PER_CLAIM - valid.length
  const survives  = valid.length >= 2 && refuted < 2  // quorum AND minority refuting
  const isRefuted = refuted >= 2                      // adjudicated against ON MERIT
  //  neither → unverified: not enough valid votes to adjudicate at all
  const mark = survives ? "✓" : isRefuted ? "✗" : "?"
  log(`"${claim.claim.slice(0,50)}…": ${valid.length - refuted}-${refuted}${errored ? ` (${errored} errored)` : ""} ${mark}`)
  return { …claim, verdicts: valid, refutedVotes: refuted, erroredVotes: errored, survives, isRefuted }
})

// Mapping: (verbatim inside the script literal)
```

**The three predicates are not exhaustive-by-construction; they are exhaustive-by-arithmetic.**
`survives` and `isRefuted` are mutually exclusive (`refuted < 2` vs `refuted >= 2`), and their union
misses exactly one region: `refuted < 2 && valid.length < 2` — i.e. at most one valid vote, and it
did not refute. That region is `unverified` (`:424777`). Enumerating the states for
`(valid, refuted)`:

| valid | refuted | outcome | reading |
|-------|---------|---------|---------|
| 3 | 0,1 | survives | 3-0 or 2-1 |
| 3 | 2,3 | refuted | majority against |
| 2 | 0,1 | survives | quorum met, minority refuting |
| 2 | 2 | refuted | unanimous among the votes cast |
| 1 | 0 | **unverified** | one vote, cannot adjudicate |
| 1 | 1 | refuted | `refuted >= 2` is false → **unverified**, see below |
| 0 | 0 | **unverified** | total verifier failure |

Note the `(1,1)` row: one valid vote that refutes gives `refuted = 1`, so `isRefuted` is false and
`survives` is false (quorum unmet) — it lands in `unverified`. That is the intended reading: a single
refuting voice is not a majority of anything.

### 8.3 What 2.1.193 did, and why it was wrong

```javascript
// ============================================
// The 2.1.193 tally - two-way split, with "abstain" language
// Location: cli_inner_pretty.js:443996-444006 (193), killed at :444012 (193)
// ============================================

// ORIGINAL (for source lookup):
      // A vote can be null (user-skip or agent error) — treat as abstain.
      const valid = verdicts.filter(Boolean)
      const refuted = valid.filter(v => v.refuted).length
      // Survive only if the claim was actually adjudicated: a quorum of
      // valid votes AND fewer than REFUTATIONS_REQUIRED refuting. Too many
      // abstentions = unverified, which must NOT pass into the report
      // (otherwise all-abstain → refuted=0 → false survive).
      const abstained = VOTES_PER_CLAIM - valid.length
      const survives = valid.length >= REFUTATIONS_REQUIRED && refuted < REFUTATIONS_REQUIRED
      ...
const confirmed = voted.filter(c => c.survives)
const killed = voted.filter(c => !c.survives)

// READABLE (for understanding):
// 193 already had the quorum rule — `survives` is byte-identical to 220's.
// The defect was one line downstream: everything that did not survive was `killed`.
const killed = voted.filter(c => !c.survives)   // ← unverified claims silently became "refuted"

// Mapping: (verbatim from the 2.1.193 bundle)
```

The `survives` computation is **unchanged** between the two builds. 2.1.193 already refused to let
an all-abstain claim pass (its comment says so). The bug was purely in the complement: `!survives`
lumps "adjudicated against on merit" together with "we could not adjudicate". Downstream, that
produced the reported symptom — a run where every verifier agent hit a rate limit reported
`All N claims refuted by adversarial verification. Research inconclusive — sources may be
low-quality or claims overstated.` (`:444018 (193)`), i.e. it blamed the sources for an
infrastructure outage. Note that 193's version interpolates `voted.length`, so the sentence even
counted the unadjudicated claims as refuted.

Counts: `claims refuted` **220=2 / 193=1**; the string `Could not verify any claims` **220=1 /
193=0**.

### 8.4 The three-way summary

```javascript
// ============================================
// Zero-confirmed summary - three summaries for three distinct meanings
// Location: cli_inner_pretty.js:424783-424795
// ============================================

// ORIGINAL (for source lookup):
if (confirmed.length === 0) {
  // Distinguish "refuted on merit" from "could not verify (infra error)". A run
  // where every verifier agent failed (rate-limit / API error) is an infra
  // failure, not a research finding — report it as such so the user knows to
  // retry rather than concluding the research found nothing.
  let summary
  if (killed.length === 0 && unverified.length > 0) {
    summary = "Could not verify any claims — all " + unverified.length + " verifier panels failed (likely rate-limiting or API errors). This is an infrastructure failure, not a research finding. Raw extracted claims returned below; retry or verify manually."
  } else if (unverified.length > 0) {
    summary = killed.length + " claims refuted by adversarial verification; " + unverified.length + " could not be verified (verifier agents failed). No claims survived. Research inconclusive."
  } else {
    summary = "All " + killed.length + " claims refuted by adversarial verification. Research inconclusive — sources may be low-quality or claims overstated."
  }

// READABLE (for understanding):
if (confirmed.length === 0) {
  let summary
  if (killed.length === 0 && unverified.length > 0)   // pure infra failure  → tell the user to RETRY
    summary = "Could not verify any claims — all N verifier panels failed (likely rate-limiting or API errors). …"
  else if (unverified.length > 0)                     // mixed               → report both numbers
    summary = "K claims refuted by adversarial verification; U could not be verified … Research inconclusive."
  else                                                // pure merit refusal  → blame the sources
    summary = "All K claims refuted by adversarial verification. Research inconclusive — sources may be low-quality or claims overstated."
}

// Mapping: (verbatim inside the script literal)
```

**Why three summaries and not a single templated one.** Each branch implies a different *user
action*: retry the run; treat the result as partial; go find better sources. A single sentence with
two numbers would leave the user to infer which. The ordering also matters — the pure-infra case is
tested first precisely because it is the one that must never be misread.

**A residual limitation, stated plainly.** The infra branch attributes the failure to
"rate-limiting or API errors". A verifier agent also returns `null` when the *token budget* is
exhausted mid-verify: `parallel()` maps `WorkflowBudgetExceededError` to `null` (`:388038`) and
records `parallel: N slots dropped — token budget exceeded` into the run's `failures` array
(`:388046`). The claim then reads as `unverified` and the summary blames rate limits. The budget
message is still visible in the workflow's `failures`, so the truth is recoverable, but the summary
sentence is a heuristic and can misattribute this one case.

---

## 9. Synthesis and its two salvage paths

`:424807-424876`. The synthesis agent gets a formatted brief, not raw JSON:

- **Confirmed block** (`:424810-424815`): per claim, the vote (`2-1`), the source URL and quality,
  the supporting quote, and the *best* verifier's evidence — where "best" is
  `verdicts.filter(v => !v.refuted).sort(by confidence)[0]`.

  `best` can never be `undefined` here: `survives` requires `valid.length >= 2 && refuted <= 1`, so
  at least one non-refuting verdict exists. This is one of the few places where the code relies on an
  invariant established three sections earlier, and it holds.

- **Refuted block** (`:424817-424820`): included "for transparency". Feeding the killed claims to the
  synthesiser is deliberate — it lets the model avoid re-asserting something the panel rejected, and
  it lets the report acknowledge a widely-repeated claim that did not survive.

- **Unverified block** (`:424822-424826`, `.196`): plus a directive —
  `Mention in caveats that N claim(s) could not be verified due to infrastructure errors.` The
  caveats field of `REPORT_SCHEMA` is `required`, so the instruction lands in a field that must exist.

**Salvage path 1 — synthesis returned null** (`:424843-424856`). Rather than letting
`report.findings` throw, the harness returns the confirmed claims *unmerged*, with
`summary: "Synthesis step was skipped or failed — returning N verified claims unmerged."` and a
`confirmed` array that exists only on this path. The user loses the merge/grouping, not the research.

**Salvage path 2 — zero confirmed** (§8.4). Same philosophy at a different point.

**The success return** (`:424858-424876`) spreads `...report` over `question`, so the model-authored
`summary`, `findings`, `caveats`, `openQuestions` sit beside the harness-computed `refuted`,
`unverified`, `sources` and `stats`. Note the key ordering: `question` first, then the spread — so a
`report.question` (not in the schema, but not forbidden either) would override the harness's copy of
the question. A minor sharp edge; the schema does not declare `question`, so a compliant model does
not emit it.

---

## 10. The stats block and the cost model

```javascript
// ============================================
// agentCalls - the harness's own accounting of what it spent
// Location: cli_inner_pretty.js:424864-424875
// ============================================

// ORIGINAL (for source lookup):
    agentCalls: 1 + scope.angles.length + allSources.length + (voted.length * VOTES_PER_CLAIM) + 1,

// READABLE (for understanding):
agentCalls:
    1                                  // Scope
  + scope.angles.length                // Search   (3..6)
  + allSources.length                  // Fetch    (0..36 — see §6.3)
  + voted.length * VOTES_PER_CLAIM     // Verify   (0..75)
  + 1                                  // Synthesize

// Mapping: (verbatim inside the script literal)
```

| Phase | Typical | Worst case | Driver |
|-------|---------|------------|--------|
| Scope | 1 | 1 | fixed |
| Search | 5 | 6 | `SCOPE_SCHEMA.angles.maxItems` |
| Fetch | ~15 | 36 | `6 angles × 6 results`, all `high` |
| Verify | 75 | 75 | `MAX_VERIFY_CLAIMS × VOTES_PER_CLAIM` |
| Synthesize | 1 | 1 | fixed |
| **Total** | **~97** | **119** | |

**This is a computed number, not a measured one.** `agentCalls` is arithmetic over the script's own
variables. It counts calls the script *made*, including ones that returned `null` — a skipped
verifier still contributes to `voted.length * 3`. It is an intent count, not a billing count.

**Three observations about the size:**

1. **The harness is 6–8× the shipped default workflow-size guideline.** The same build ships
   `workflowSizeGuideline` with `medium` as the default and a documented cap of "under 15 agents"
   (see [`workflow_size_guideline.md`](workflow_size_guideline.md)). The guideline is advisory and is
   injected into the *model's* Workflow tool description to shape workflows the model authors. A
   bundled workflow is authored by Anthropic and simply ignores it. Nothing enforces the guideline
   against `deep-research`, and nothing should — but it is worth knowing that the single largest
   workflow a user can launch is the one that ships in the box.
2. **Verification dominates by design.** 75 of ~97 calls are verifiers. The harness spends ~77% of
   its budget attacking what it already found rather than finding more. That is the whole thesis of
   the "adversarially verify claims" description.
3. **The WebSearch session cap interacts.** `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` (default
   **200**, `:231406`, `:231413`) is a *session-wide* counter held on the task registry
   (`:341737-341744`) and checked inside `WebSearch.call` (`:403661-403675`). Every deep-research
   subagent shares it. Each searcher issues ≥1 search, and `VERIFY_PROMPT` step 2 explicitly tells
   every verifier to `WebSearch for contradicting evidence` — so a single run can plausibly consume
   `5 + 75 = 80` searches, 40% of the session budget. A second and third run in the same session
   will begin hitting the cap, at which point WebSearch returns the refusal text
   `Web search was not performed: this session has used its web search budget …` as a *successful*
   tool result (not an error). The verifier then adjudicates the claim with no counter-evidence
   search, and — per `Default to refuted=true if uncertain` — is more likely to refute. **Two
   deep-research runs in one session can therefore silently degrade the third's precision.** Both
   features are new in this window (the cap is `.212`, `220=4 / 193=0`); nothing connects them.

---

## 11. `.218` — the restraint, and why it is a function

```javascript
// ============================================
// isDeepResearchModelInvocationDisabled - a remotely-reversible restraint switch
// Location: cli_inner_pretty.js:424445-424448, gate constant :424888
// ============================================

// ORIGINAL (for source lookup):
function MJy() {
  if (Ke(PJy, !1)) return !1;
  return !0;
}
...
  PJy = "tengu_sorrel_avocet";

// READABLE (for understanding):
function isDeepResearchModelInvocationDisabled() {
  if (readFeatureGate(DEEP_RESEARCH_MODEL_INVOCATION_GATE, false)) return false; // gate ON  → model MAY invoke
  return true;                                                                   // default  → model may NOT
}
const DEEP_RESEARCH_MODEL_INVOCATION_GATE = "tengu_sorrel_avocet";

// Mapping: MJy→isDeepResearchModelInvocationDisabled, Ke→readFeatureGate, PJy→DEEP_RESEARCH_MODEL_INVOCATION_GATE
```

Note the polarity: the gate's *name* means "allow model invocation", and its default (`!1`) means the
restraint is **on**. `disableModelInvocation` is passed as this **function**, not as `true` — and
`createWorkflowCommand` calls it at command-construction time
(`typeof e.disableModelInvocation === "function" ? e.disableModelInvocation() : …`, `:506526-506527`).
So the decision is re-evaluated every time the command list is rebuilt, and Anthropic can re-enable
model invocation server-side without shipping a client. 2.1.193 registers with **no third argument
at all** (`:444088 (193)`).

Three independent mechanisms enforce the restraint; the details and evidence for each are in
[`deep_research_runtime_contract.md`](deep_research_runtime_contract.md) §4:

1. the command is filtered out of the model-visible skill listing (`oKe` `:441281`-adjacent filter);
2. a runtime refusal if the model calls it anyway without the user having typed it (`:346458`);
3. a system-prompt clause — `Do not use workflows or deep-research unless the user requested it`
   (`:508111-508115`), applied only under the Opus-5 prompt bundle (`:507513`, `:118700-118704`).
   String count **220=1 / 193=0**.

The user typing `/deep-research` still works: the refusal is conditioned on `!userTypedThisTurn`.

---

## 12. Failure-mode matrix

| Failure | Where | Result | Run continues? |
|---------|-------|--------|----------------|
| `args` missing / non-string / whitespace | `:424542-424545` | `{ error: "No research question provided…" }` | no |
| Scope agent null | `:424558-424560` | `{ error: "Scope agent returned no result…" }` | no |
| One searcher null | `:424659` | that angle contributes nothing | **yes**, other angles unaffected |
| Duplicate URL across angles | `:424668-424671` | recorded in `dupes`, not fetched | yes |
| Fetch budget exhausted (medium/low) | `:424672-424675` | recorded in `budgetDropped` | yes |
| Fetch agent null (skip/error) | `:424709` | source dropped entirely | yes |
| Fetch agent throws | `:424715-424718` | source kept as `sourceQuality: "unreliable"`, 0 claims | yes |
| Zero claims from all sources | `:424735-424742` | early return with `dupes`/`budgetDropped` counts | no |
| 1 verifier of 3 fails | `:424763-424767` | remaining 2 decide | yes |
| 2+ verifiers fail | `:424777` | claim → `unverified` | yes |
| All verifier panels fail | `:424789-424790` | explicit infra-failure summary | no (returns early) |
| Some refuted, some unverified, none confirmed | `:424791-424792` | mixed summary | no |
| All refuted on merit | `:424793-424794` | source-quality summary | no |
| Synthesis null | `:424843-424855` | confirmed claims returned unmerged | no |
| Script syntax error | `:389506-389520` | `status: "async_launched"` carrying `error` | n/a |
| Agent cap (1,000) | `:388110`, `:387190-387194` | `WorkflowAgentCapError` | unreachable here (max 119) |
| Token budget exhausted | `:387195-387201`, `:388369` | in-flight agents complete; further calls throw | partial |

---

## 13. The full 193 → 220 delta ledger for this file

| # | Version | Change | Lines (220) | Lines (193) | Evidence |
|---|---------|--------|-------------|-------------|----------|
| 1 | `.196` | Three-way verdict: `unverified` added beside `survives`/`isRefuted`; `killed` narrowed from `!survives` to `isRefuted`; `abstained` renamed `errored`; three-branch zero-confirmed summary; `unverifiedBlock` in the synthesis brief; `toRefuted`/`toUnverified` helpers; `unverified` added to every return and to `stats` | `:424757-424795`, `:424822-424826`, `:424780-424781` | `:443996-444018 (193)` | `claims refuted` 220=2/193=1; `Could not verify any claims` 220=1/193=0; comment cites `go/ccissue/69883` `:424759` |
| 2 | `.207` | URL identity layer: `URL_HOST_PATTERN` regex replaces `new URL`; `LABEL_CAP`/`LABEL_STRIP`/`STRICT_HOST`/`stripLabelChars`/`quotedLabel` added; fetch label rebuilt as a four-condition trust ladder | `:424564-424604`, `:424685-424701` | `:443852-443857 (193)`, `:443938-443939 (193)` | `URL_HOST_PATTERN` 220=3/193=0; `quotedLabel` 220=3/193=0; `stripLabelChars` 220=4/193=0; `isCleanBareHost` 220=2/193=0; the literal `U+200B` occurs **once in the whole bundle**, in this comment (`:424585`), and the escape `\u200b` twice — `:424594` here plus an unrelated numeric-parse guard at `:216406` |
| 3 | `.218` | Registration gains a third argument `{ disableModelInvocation: MJy }`; `MJy` + `PJy` added | `:424879`, `:424445-424448`, `:424888` | `:444088 (193)` — two-argument call | `tengu_sorrel_avocet` 220=1/193=0 |
| — | — | **Everything else is byte-identical** apart from re-mangled identifiers: the constants, all five schemas, all three prompt builders, the pipeline shape, the ranking, the synthesis brief and the stats block | — | — | 270-line unified diff; no other semantic hunk |

**Not a delta:** the header comment
`// deep-research: Scope → pipeline(Search → URL-dedup → Fetch+Extract) → 3-vote Verify → Synthesize`
is **220=1 / 193=1** — it describes the architecture, which did not change. Earlier scoping notes
used it as the `.207` anchor; it cannot serve as one. The real anchors are in row 2 above.

**On the release attribution.** The `.196` / `.207` / `.218` labels come from the CHANGELOG bullets
plus this tree's existing mapping, **not** from the bundles. Two build points 27 releases apart can
prove *that* a change happened in the window and *what* it was; they cannot prove *which* release
carried it. The tree itself disagrees on one of these:
[`../00_overview/_xval_contradictions.md`](../00_overview/_xval_contradictions.md) records the
label bugfix as `.207` in `52_code_review` and `by_version/2.1.207.md` but as `.208` in
`42_workflow/README.md`. This document does not settle that — every code-level claim above stands
independently of which of the two it was.

**Cross-version note (2.1.88):** `grep -rn 'deep-research' /lyz/codespace/3rd/claude-code/src` → 0
hits. The named tree has `src/tools/WorkflowTool/` referenced from `src/tools.ts:129-132`
(`feature('WORKFLOW_SCRIPTS')` → `initBundledWorkflows()` → `WorkflowTool`), so the *registry
mechanism* already existed at 2.1.88 under exactly the names used here — but `deep-research` itself
is not among its bundled workflows. That cross-check is what confirms `initBundledWorkflows`/`OJy`
and the lazy `require`-on-first-use pattern at `:425151` are long-standing infrastructure, not part
of this window's delta.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions and constants in this document:

- `registerDeepResearchWorkflow` (`mRd`) - builds the script string and registers it, `:424449-424881`
- `registerBundledWorkflow` (`kxo`) - pushes a row into the bundled-workflow registry, `:385327-385335`
- `isDeepResearchModelInvocationDisabled` (`MJy`) - the `.218` restraint predicate, `:424445-424448`
- `DEEP_RESEARCH_MODEL_INVOCATION_GATE` (`PJy`) - `"tengu_sorrel_avocet"`, `:424888`
- `DEEP_RESEARCH_WORKFLOW_NAME` (`uRd`) - `"deep-research"`, `:424882`
- `DEEP_RESEARCH_WORKFLOW_DESCRIPTION` (`dRd`) - the harness one-liner, `:424883-424884`
- `DEEP_RESEARCH_WORKFLOW_WHEN_TO_USE` (`pRd`) - the clarifying-questions instruction, `:424885-424886`
- `DEEP_RESEARCH_PHASES` (`fRd`) - the five `{title, detail}` rows, `:424892-424898`
- `deepResearchWorkflowModuleInit` (`hRd`) - lazy initialiser that fills `fRd`, `:424889-424899`
- `initBundledWorkflows` (`OJy`) - calls both registrars, `:424902-424904`
- `BUNDLED_WORKFLOWS` (`SSd`) - the registry array, `:385340`
- `getMaxWebSearchesPerSession` (`yPu`) - session WebSearch cap reader, `:231406`
- `DEFAULT_MAX_WEB_SEARCHES_PER_SESSION` (`_ty`) - `200`, `:231413`
- `AGENT_AND_WORKFLOW_RESTRAINT_CLAUSE` (`Kep`) - the system-prompt clause, `:508111-508115`
- `usesOpus5PromptBundle` (`ZXn`) - gate for that clause, `:118700-118704`

Script-internal identifiers (`VOTES_PER_CLAIM`, `MAX_FETCH`, `URL_HOST_PATTERN`, `quotedLabel`, …)
are **not** obfuscated — they live inside a string literal and are cited by line only.
