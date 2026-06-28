# Malformed `SKILL.md` YAML: load body, empty metadata, surface a `parseError` (v2.1.183 → v2.1.193)

> Type/Version: REFINEMENT (net-new diagnostics plumbing; the empty-metadata behavior is carryover).
> Changelog 2.1.186: *"Improved malformed `SKILL.md` YAML frontmatter handling: loads the skill body
> with empty metadata instead of failing silently."* TARGET: `cli_inner_pretty.js` @ build `a1938d2a`.
> Before-picture tagged `(183)`.

## TL;DR — the skill was never dropped; what's new is that the error is now loud

Read literally, the changelog implies a behavior change ("loads the body … instead of failing"). The
code says something more precise: **both** 183 and 193 *already* loaded the body with empty metadata on
bad YAML — a malformed-frontmatter skill was never silently dropped. The actual 193 delta is the
**surfacing** of the parse error:

- The parser `parseMarkdownFrontmatter` (`Gm`, `:149511`) now returns a `parseError` field on the
  result object (`:149531`) — `grep -c 'parseError:'` = **0 in 183**.
- The per-directory skill loader `loadSkillsFromDir` (`uyt`, `:451677`) destructures it (`:451753`)
  and, when present, logs `[skills] YAML frontmatter in ${path} failed to parse and was ignored:
  ${err}` at `level:"error"` and emits `Ct("skill_load_dir", "skill_load_yaml_failed")`
  (`:451755-451756`).

"Failing silently" referred to the *swallowed* error, not a dropped skill. 193 makes it loud (per-skill
error log) and counted (telemetry). Classify as **REFINEMENT with net-new plumbing**; the user-visible
delta is diagnostics, not load-success.

---

## 1. The parser: empty-metadata fallback (carryover) + the new `parseError` return

### What it does

`Gm` splits a markdown file into `{ frontmatter, content }`. On a YAML parse failure it tries a
tab→space retry; if *that* also fails, it leaves `frontmatter = {}` and still returns the body. The
193 addition is the conditional `parseError` field on the return.

### How it works (step-by-step, with the 183 contrast inline)

```javascript
// ============================================
// parseMarkdownFrontmatter - double-parse with empty fallback; 193 adds the parseError return
// Location: cli_inner_pretty.js:149511-149532   (183: CA @148675-148694)
// ============================================

// ORIGINAL (193):
function Gm(e, t, n) {
  let r = e.match(eye);
  if (!r) return { frontmatter: {}, content: e };
  let o = r[1] || "", s = e.slice(r[0].length), i = (c) => c, a = {}, l;   // l = error holder (NEW)
  try { a = i(Xxi(Zhe(o))); }                                             // pass 1: raw YAML
  catch {
    try { let c = XEd(o).replace(/^\t+/gm, (u) => "  ".repeat(u.length)); // pass 2: quote-special + tabs→spaces
          a = i(Xxi(Zhe(c))); }
    catch (c) {
      l = c instanceof Error ? c.message : String(c);                     // NEW: capture the message
      let u = t ? ` in ${t}` : "";
      T(`Failed to parse YAML frontmatter${u}: ${l}`, { level: "warn" });  // pre-existing internal warn
    }
  }
  return { frontmatter: a, content: s, ...(l !== void 0 && { parseError: l }) };  // NEW: parseError field

  // ── 183 `CA` had NO `l`; the inner catch only did the warn; and returned: ──
  //    return { frontmatter: a, content: s };
}

// READABLE (193):
function parseMarkdownFrontmatter(rawMarkdown, filePathForLog, _normalizeOpts /* ignored, see frontmatter_case_tolerance.md */) {
  let m = rawMarkdown.match(FRONTMATTER_REGEX);
  if (!m) return { frontmatter: {}, content: rawMarkdown };           // no fence → all body, no metadata
  let yamlText = m[1] || "", body = rawMarkdown.slice(m[0].length);
  let identity = (x) => x, frontmatter = {}, parseErrorMsg;
  try {
    frontmatter = identity(asPlainObject(parseYaml(yamlText)));        // pass 1
  } catch {
    try {
      let retried = quoteSpecialYaml(yamlText).replace(/^\t+/gm, (t) => "  ".repeat(t.length));
      frontmatter = identity(asPlainObject(parseYaml(retried)));       // pass 2 (tabs are illegal YAML indent)
    } catch (err) {
      parseErrorMsg = err instanceof Error ? err.message : String(err); // ← capture for the loader
      logWarn(`Failed to parse YAML frontmatter${filePathForLog ? ` in ${filePathForLog}` : ""}: ${parseErrorMsg}`);
    }
  }
  // metadata stays {} on double failure; body is ALWAYS returned (carryover). parseError only on failure.
  return { frontmatter, content: body, ...(parseErrorMsg !== undefined && { parseError: parseErrorMsg }) };
}

// Mapping: Gm→parseMarkdownFrontmatter, eye→FRONTMATTER_REGEX, Zhe→parseYaml, Xxi→asPlainObject,
//          XEd→quoteSpecialYaml, T→logWarn, l→parseErrorMsg, a→frontmatter, s→body
```

**Edge cases:**
- *No frontmatter fence* → `{ frontmatter: {}, content: rawMarkdown }` (early return; no `parseError`).
  This is the "plain markdown skill" path — empty metadata, full body — and predates this change.
- *Valid YAML* → `parseError` is absent (the spread `...(l !== void 0 && {…})` contributes nothing).
- *Malformed YAML* (both passes throw) → `frontmatter = {}`, `content = body`, **and** `parseError =
  message`. The skill still loads with empty metadata; the error rides along for the loader to act on.

### Why a two-pass parse, then empty fallback (carryover design)

**What it does:** maximizes the chance of recovering metadata before giving up. **How it works:** pass
1 parses the raw YAML; pass 2 applies `quoteSpecialYaml` and converts leading tabs to two-space units
(tabs are not legal YAML indentation, a very common authoring mistake). Only a *double* failure falls
through to empty metadata. **Why empty-then-body rather than abort:** a SKILL.md is primarily a body of
instructions; the frontmatter is optional configuration. Dropping the whole skill because its optional
config has a typo would be a worse failure than loading it with defaults. The design choice — "degrade
the metadata to `{}`, keep the body" — is the same in both builds; 193 does not change it.

---

## 2. The loader: consume `parseError`, log per-skill, count it

### What it does

`loadSkillsFromDir` (obfuscated: `uyt`, `:451677`) walks a skill directory, reads each SKILL.md, parses
it via `Gm`, and builds the skill record. 193 reads the new `parseError` and, when set, emits a
per-skill error log + the `skill_load_yaml_failed` counter — *before* it goes on to shadow-validate and
field-read the (empty) frontmatter.

### How it works

```javascript
// ============================================
// loadSkillsFromDir (excerpt) - 193 consumes parseError → error log + skill_load_yaml_failed telemetry
// Location: cli_inner_pretty.js:451748-451760
// ============================================

// ORIGINAL (193):
let { frontmatter: p, content: f, parseError: m } = Gm(d, c, { normalizeKeys: !0 });   // m = parseError (NEW)
if (m)
  (T(`[skills] YAML frontmatter in ${c} failed to parse and was ignored: ${m}`, { level: "error" }),  // NEW log
    Ct("skill_load_dir", "skill_load_yaml_failed"));                                                   // NEW telemetry
let g = HEe(c, f), h = a.name;
ije("skill", p);                                                                       // shadow-validate (the empty {})
let y = UCo(p, g, h), b = prf(p);
return { skill: Q9t({ ...y, skillName: h, markdownContent: g, /* …contentHash/source/baseDir… */ }) };

// READABLE (193):
let { frontmatter, content, parseError } = parseMarkdownFrontmatter(rawFile, skillFilePath, { normalizeKeys: true });
if (parseError) {
  logError(`[skills] YAML frontmatter in ${skillFilePath} failed to parse and was ignored: ${parseError}`);
  incrementCounter("skill_load_dir", "skill_load_yaml_failed");      // Ct — per-skill YAML-failure counter
}
let markdownBody = stripFrontmatterTrailer(skillFilePath, content);  // HEe
let skillName = entry.name;
shadowValidateFrontmatter("skill", frontmatter);                     // ije — still runs (on the empty object)
let fields = parseSkillFrontmatterFields(frontmatter, markdownBody, skillName);  // UCo
return { skill: buildSkillRecord({ ...fields, skillName, markdownContent: markdownBody, /* … */ }) };

// Mapping: uyt→loadSkillsFromDir, Gm→parseMarkdownFrontmatter, m→parseError, T→logError, Ct→incrementCounter,
//          HEe→stripFrontmatterTrailer, ije→shadowValidateFrontmatter, UCo→parseSkillFrontmatterFields, Q9t→buildSkillRecord
```

Note the loader has a *sibling* failure tag for read errors: a `catch` higher up sets
`o = "skill_load_read_failed"` and logs `[skills] failed to read ${path}` (`:451750`). The new
`skill_load_yaml_failed` slots into that same `skill_load_dir` failure-mode family — so the telemetry
now distinguishes "couldn't read the file" from "read it but its YAML was malformed."

### Why surface it in the loader, not the parser

**What it does:** keeps the parser generic and pushes the *policy* (how loudly to complain, which
telemetry channel) to the caller. **Why:** `Gm` is shared by skills, slash-commands, agents, and
output-styles — a parser-level `error`-log + skill-specific counter would be wrong for the other three
kinds. By returning `parseError` as data and letting each loader decide, 193 lets the **skill** loader
escalate to `level:"error"` and tag `skill_load_yaml_failed`, while other callers (which still just
destructure `{frontmatter, content}` and ignore `parseError`) keep the quieter internal `warn`. The
parser's own `T(…, {level:"warn"})` (carryover) remains as a baseline; the loader's `level:"error"` is
the new, louder, skill-scoped surfacing.

**Key insight:** "instead of failing silently" is a *diagnostics* promise, not a *load-behavior* one.
The body always loaded; the silence was the swallowed YAML error. 193 turns the swallow into a returned
value the loader amplifies into an error log + a counted failure mode. The load outcome is unchanged.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | Verdict | Proof |
|------|---------|-------|
| `Gm` returns `parseError` | **NET-NEW** | `:149531` spread `...(l!==void 0 && {parseError:l})`; `grep -c 'parseError:'` = **0 in 183** |
| `[skills] … failed to parse and was ignored` log | **NET-NEW** | `:451755`; `grep -c 'failed to parse and was ignored'` = **0 in 183, 1 in 193** |
| `skill_load_yaml_failed` telemetry | **NET-NEW** | `:451756`; `grep -c 'skill_load_yaml_failed'` = **0 in 183, 1 in 193** |
| Empty-metadata-and-body-loads behavior | **CARRYOVER** | `a={}` + `content:s` in both `Gm`@149517/:149531 and `CA`@148679/:148691 |
| Internal `warn` on parse failure | **CARRYOVER** | both parsers warn; 193 only *adds* the loader-level error |
| 183 loader destructures `{frontmatter, content}` only | **before-picture** | `:443795` — no `parseError`, no skill-specific log |

---

## Cross-links

- Sibling 193 docs: [`frontmatter_case_tolerance.md`](./frontmatter_case_tolerance.md) (the same `Gm`
  parser and why its `normalizeKeys` arg is ignored), [`README.md`](./README.md).
- 183 tree (unchanged Skill tool / loader context):
  [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts).
- The `skill_load_yaml_failed` tag joins the telemetry family tracked in the 193 telemetry module
  [`../44_telemetry/`](../44_telemetry/).

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc
> uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Skill loader)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Core features: Skills** (this doc's home)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Telemetry counters)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_skills.md](../00_overview/symbol_additions_v2_1_193_skills.md) — granular v2.1.193 additions

Key functions/constants in this document:

- `parseMarkdownFrontmatter` (obfuscated: `Gm`, `cli_inner_pretty.js:149511`) — double-parse + empty
  fallback; **returns `parseError` as of 193** (`:149531`). (183 `CA`@148675, no `parseError`.)
- `loadSkillsFromDir` (obfuscated: `uyt`, `cli_inner_pretty.js:451677`) — per-dir skill loader;
  consumes `parseError` (`:451753`) → `[skills] … failed to parse and was ignored` log (`:451755`) +
  `Ct("skill_load_dir", "skill_load_yaml_failed")` (`:451756`). (183 loader @443795.)
- `parseYaml` (obfuscated: `Zhe`, `cli_inner_pretty.js:149467`) / `asPlainObject` (obfuscated: `Xxi`,
  `cli_inner_pretty.js:149533`) / `quoteSpecialYaml` (obfuscated: `XEd`, `cli_inner_pretty.js:149477`)
  / `FRONTMATTER_REGEX` (obfuscated: `eye`, `cli_inner_pretty.js:149612`) — parser internals.
- `shadowValidateFrontmatter` (obfuscated: `ije`, `cli_inner_pretty.js:149238`) /
  `parseSkillFrontmatterFields` (obfuscated: `UCo`, `cli_inner_pretty.js:451524`) — the loader's
  downstream validate + read steps (run on the empty `{}` after a YAML failure).
