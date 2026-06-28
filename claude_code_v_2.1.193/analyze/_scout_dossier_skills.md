# Scout Dossier — Skills (frontmatter tolerance, malformed YAML, `/plugin` section)

**Window:** v2.1.183 → v2.1.193 (changelog attributes all three to **2.1.186**)
**Target bundle (prove-here):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build a1938d2a)
**Before-picture:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**88 named ancestor:** `/lyz/codespace/3rd/claude-code/src/utils/frontmatterParser.ts`

Changelog lines verified in `claude_code_v_2.1.193/CHANGELOG.md`:
- L76: *"Added a "Skills" section to the `/plugin` Installed tab"*
- L102: *"Improved skill frontmatter: `display-name`, `default-enabled`, `fallback`, and `metadata.*` keys now accept kebab-case, snake_case, and camelCase"*
- L103: *"Improved malformed `SKILL.md` YAML frontmatter handling: loads the skill body with empty metadata instead of failing silently"*

---

## TL;DR verdicts

| Bullet | Verdict | Confidence | Net-new? |
|--------|---------|-----------|----------|
| #1 Multi-case frontmatter keys | **REFINEMENT** — provable code deltas are schema-field + canonical-list additions; the *generic normalize-map is vestigial (built-but-unused) in BOTH builds*, so an end-to-end kebab→camel **read-time** rewrite is NOT isolable | **med** (schema/list additions: high; live runtime rewrite: low) | net-new schema/list entries |
| #2 Malformed YAML → body + empty metadata | **REFINEMENT w/ net-new plumbing** — parser now returns `parseError`; skill loader logs + emits telemetry. The "empty metadata, body still loads" behavior itself is **carryover**. | **high** | net-new `parseError` plumbing |
| #3 "Skills" section in `/plugin` Installed tab | **NEW capability** — section label, scope, list-builder entries all net-new | **high** | net-new |

---

## Bullet #1 — Multi-case frontmatter key tolerance

### Anchor table

| Item | 193 anchor | obf symbol | readable gloss | 183 diff |
|------|-----------|-----------|----------------|----------|
| Frontmatter parser | `cli_inner_pretty.js:149511` | `Gm(e,t,n)` | `parseMarkdownFrontmatter` | renamed from `CA` (183:148675); body changed (see #2) |
| Key normalizer | `cli_inner_pretty.js:149400` | `KEd(e)` | `normalizeFrontmatterKey` = `e.replace(/[-_]/g,"").toLowerCase()` | byte-identical to 183 `_Ju` (183:148569) — **carryover** |
| Canonical key list | `cli_inner_pretty.js:149406-149464` | `zEd` | `CANONICAL_FRONTMATTER_KEYS` | 183 `yJu` (148571) lacks `displayName`,`defaultEnabled`,`fallback`,`evals` → **193 added these 4** |
| Normalized→canonical map | `cli_inner_pretty.js:149465` | `uIh` | `normalizedKeyToCanonical` (Map) | 183 `kYA` (148629). **VESTIGIAL in both** — only 2 refs each (decl + assign), never read |
| Skill shadow-schema | `cli_inner_pretty.js:149302-149345` | `tVr` | `skillFrontmatterSchema` (`.extend`) | 183 `Q1r` (148478) ends at `metadata`; **193 adds** `userConfig`,`defaultEnabled`,`displayName`,`author`,`homepage`,`repository`,`license`,`keywords` |
| Shadow validator (telemetry only) | `cli_inner_pretty.js:149238` | `ije(e,t)` | `shadowValidateFrontmatter` | carryover shape; fires `tengu_frontmatter_shadow_unknown_key` |
| Skill field reader | `cli_inner_pretty.js:451524` | `UCo(e,t,n,r)` | `parseSkillFrontmatterFields` | reads camelCase; `fallback: aje(e.fallback)` (451558) |
| declaredFields (metadata.*) | `cli_inner_pretty.js:149585` | `Ewn(e)` | `collectDeclaredFields` = keys of `e` + `e.metadata` + `e.experimental` | carryover shape |
| fallback flag | `cli_inner_pretty.js:149592` | `aje(e)` | `parseFallbackFlag` (true/"true"/false/"false") | carryover |

### What is PROVABLE net-new in 193

1. **Skill schema `tVr` (149302) gained `@internal` fields** `defaultEnabled` (149335) and `displayName` (149339) — `grep -c 'defaultEnabled: A.unknown'`/`'displayName: A.unknown'` = **0 in 183, 1 in 193**. `fallback` (149318) and `metadata` (149338) were **already present in 183** (`Q1r`, 148494/148512) — carryover. Effect: these keys no longer trip the `tengu_frontmatter_shadow_unknown_key` shadow-telemetry path in `ije`.
2. **Canonical key list `zEd` (149440-149443) gained** `displayName`,`defaultEnabled`,`fallback`,`evals`. `grep -c '"defaultEnabled"'` = **0 in 183, 1 in 193**; 183 `yJu` (148571-148629) confirmed to contain NONE of the four. The normalizer `KEd` collapses `-`/`_` and lowercases, so canonically these keys would map `display-name`/`display_name`/`displayName` → `displayname` → `displayName`.

### ⚠️ Honest caveat (why confidence is split)

The **generic case-normalization is NOT wired up at read time in this build**:
- `Gm` takes a 3rd arg `n` and every skill/plugin caller passes `{ normalizeKeys: !0 }` (149511, and 11 call-sites: 288139, 451753, 474827, 474990, 475023, 475105, 475291, 480453, 518252, 599002), **but `Gm`'s body never references `n`** — `i = (c) => c` is the identity transform (verified byte-for-byte 149511-149532). 183's `CA` is identical here (`i = (l) => l`, 148679).
- The normalize-map `uIh` (193) / `kYA` (183) is **built but never consumed** — whole-file grep returns exactly 2 hits each (declaration + assignment). `KEd`/`_Ju` (the only `replace(/[-_]/g,"")` key-normalizer) is called **only** to build that dead map.
- The 88 ancestor parser had **no** key normalization at all (`frontmatterParser.ts` returns YAML verbatim); `normalizeKeys`+the map are post-88 additions that have been vestigial through 183 and 193.
- Value readers (`UCo`, `Ewn`, `aje`, and the plugin manifest readers `u.manifest.displayName`/`.defaultEnabled` at 477822/478030/480087/480180) read **camelCase only**. The kebab forms `display-name`/`default-enabled` produce **zero** grep hits anywhere in 193.

So: a user literally writing `display-name:` in SKILL.md frontmatter would still be read by camelCase accessors. The **observable** 193 change is the schema-recognition + canonical-list additions (high confidence, net-new), not a demonstrable live kebab→camel rewrite (low confidence — the mechanism that would do it is dead code). This is itself the key finding: the changelog's "now accept" is realized at the *schema/list* layer, while the runtime normalizer remains unhooked. **Route to a SMALL infra_integration doc with this caveat front-and-center; do not claim a live runtime rewrite.**

---

## Bullet #2 — Malformed `SKILL.md` YAML → load body, empty metadata, no longer silent

### Anchor table

| Item | 193 anchor | obf symbol | readable gloss | 183 diff |
|------|-----------|-----------|----------------|----------|
| Parser returns `parseError` | `cli_inner_pretty.js:149526-149531` | `Gm` inner-catch + return | captures `l = err.message`, returns `...(l!==void 0 && {parseError:l})` | **183 `CA` (148687-148692) does NOT** — returns only `{frontmatter,content}`; `grep -c 'parseError:'`=**0 in 183** |
| Empty-metadata fallback | `cli_inner_pretty.js:149517,149531` | `a = {}` + `content: s` | on parse failure `a` stays `{}`, body `s` still returned | **carryover** — identical in 183 `CA` (148679-148691) |
| Skill loader consumes parseError | `cli_inner_pretty.js:451753-451756` | inside `uyt(e,t)` (451677) | `{frontmatter:p,content:f,parseError:m}=Gm(...)`; if `m` → log + `Ct("skill_load_dir","skill_load_yaml_failed")` | **183 loader (443795) destructures `{frontmatter,content}` only** — no parseError, no log |
| New log string | `cli_inner_pretty.js:451754` | string literal | `[skills] YAML frontmatter in ${c} failed to parse and was ignored: ${m}` | `grep -c 'failed to parse and was ignored'` = **0 in 183, 1 in 193** |
| New telemetry | `cli_inner_pretty.js:451755` | `skill_load_yaml_failed` | skill-load failure-mode tag | `grep -c 'skill_load_yaml_failed'` = **0 in 183, 1 in 193** |

### Analysis

The **"loads body with empty metadata"** behavior is **carryover**: in BOTH 183 (`CA`) and 193 (`Gm`), a double parse failure leaves `a = {}` and still returns `content: s` (the markdown body). The skill is NOT dropped on bad YAML in either version — it loads with empty frontmatter.

What is **net-new in 193** is the **surfacing of the error**: `Gm` now propagates `parseError` (was an internal `warn` only), and the per-directory skill loader `uyt` (451677) reads it to emit a skill-specific error log + the `skill_load_yaml_failed` telemetry tag. So the changelog phrase "instead of failing silently" is precisely this: it never *dropped* the skill, but it used to *swallow* the YAML error; now it's logged loudly and counted. Classify as **REFINEMENT with net-new plumbing**; the user-visible behavior delta is diagnostics, not load-success. **High confidence** (all four signatures are 0-in-183).

```javascript
// ============================================
// parseMarkdownFrontmatter - now surfaces parseError on malformed YAML
// Location: cli_inner_pretty.js:149511-149532  (183: CA @148675-148693)
// ============================================

// ORIGINAL (193):
function Gm(e, t, n) {
  let r = e.match(eye);
  if (!r) return { frontmatter: {}, content: e };
  let o = r[1] || "", s = e.slice(r[0].length), i = (c) => c, a = {}, l;   // l = error holder (NEW)
  try { a = i(Xxi(Zhe(o))); }
  catch {
    try { let c = XEd(o).replace(/^\t+/gm, (u) => "  ".repeat(u.length)); a = i(Xxi(Zhe(c))); }
    catch (c) { l = c instanceof Error ? c.message : String(c); /* NEW capture */
      let u = t ? ` in ${t}` : ""; T(`Failed to parse YAML frontmatter${u}: ${l}`, { level: "warn" }); }
  }
  return { frontmatter: a, content: s, ...(l !== void 0 && { parseError: l }) };  // NEW: parseError
}

// READABLE:
function parseMarkdownFrontmatter(rawMarkdown, filePathForLog, _normalizeOpts /* IGNORED */) {
  let fmMatch = rawMarkdown.match(FRONTMATTER_REGEX);
  if (!fmMatch) return { frontmatter: {}, content: rawMarkdown };
  let yamlText = fmMatch[1] || "", body = rawMarkdown.slice(fmMatch[0].length);
  let identity = (x) => x, frontmatter = {}, parseErrorMsg;
  try { frontmatter = identity(asPlainObject(parseYaml(yamlText))); }
  catch {
    try { let retried = quoteSpecialYaml(yamlText).replace(/^\t+/gm, (t)=>"  ".repeat(t.length));
          frontmatter = identity(asPlainObject(parseYaml(retried))); }
    catch (err) { parseErrorMsg = err instanceof Error ? err.message : String(err);
      logWarn(`Failed to parse YAML frontmatter${filePathForLog?` in ${filePathForLog}`:""}: ${parseErrorMsg}`); }
  }
  return { frontmatter, content: body, ...(parseErrorMsg !== undefined && { parseError: parseErrorMsg }) };
}
// Mapping: Gm→parseMarkdownFrontmatter, eye→FRONTMATTER_REGEX, Zhe→parseYaml, Xxi→asPlainObject,
//          XEd→quoteSpecialYaml, l→parseErrorMsg, T→logWarn
```

---

## Bullet #3 — "Skills" section in the `/plugin` Installed tab

### Anchor table

| Item | 193 anchor | obf symbol | readable gloss | 183 diff |
|------|-----------|-----------|----------------|----------|
| Section-label switch | `cli_inner_pretty.js:519209-519229` | `OAf(e)` | `pluginScopeSectionLabel` — adds `case "skills": return "Skills"` (519226-519227) | 183 `GYp` (508269-508287) has flagged/project/local/user/enterprise/managed/builtin — **NO `skills` case** |
| Installed-tab list builder | `cli_inner_pretty.js:519452-519675` | `He` useMemo | builds rows for the Installed tab | — |
| Skill-entry collection | `cli_inner_pretty.js:519545-519588` | `In` array | per-skill rows: `type:"skill"`, `scope:"skills"`, `override`, `usage`, `lockSource`, `tokenEstimate`, `whenToUse`, `skillRoot`, `allowedTools` | 183: **no `type:"skill"`/`scope:"skills"` rows in the plugin list** |
| Skills group insertion | `cli_inner_pretty.js:519627` | `Cr.set("skills", In)` | adds the "skills" scope group when non-empty | 183: **no `Cr.set("skills")`** |
| Scope sort-order | `cli_inner_pretty.js:519598-519599` | `vt = {…, skills: 7}` | skills section sorts last | 183: order map lacks `skills` key |
| Skill-detail nav | `cli_inner_pretty.js:519427` | `v.type === "skill-detail"` | skill detail view in plugin UI | — |
| Per-skill override source | `cli_inner_pretty.js:519209` (fn `OAf` is shared w/ override helper region) | `skillOverrides`/`skillUsage` | policy/flag/author/user override lock + usage count | `skillOverrides`: 11 refs in 183 → 22 in 193; `skillUsage`: 3 → 22 |

### Analysis

**NET-NEW** and conclusively isolable. The decisive proof is the scope-label switch: 183's `GYp` (508269) lists exactly `flagged/project/local/user/enterprise/managed/builtin,dynamic` with no skills branch, whereas 193's `OAf` (519209) adds `case "skills": return "Skills"`. Reinforced by the entire `In` skill-row builder (519545-519588), the `Cr.set("skills", In)` group (519627), and the sort-order entry `skills: 7` (519598) — none of which exist in 183's plugin-list memo.

The skill **override/usage infrastructure** (`skillOverrides`, `skillUsage`, `skillFrontmatter`) **partly pre-existed** in 183 (11 / 3 / 10 refs) — it was surfaced elsewhere (the `/skills` view / cost attribution), NOT in the `/plugin` Installed tab. 193 ~doubles the `skillOverrides`/`skillUsage` usage (22 each) by re-using that data to populate the new Installed-tab Skills section, including a per-skill override lock (`lockSource`: policy/flag/author) and a usage badge (`count` + `daysSinceUse`). This is a **NEW capability** (new UI surface) built on partly-carryover data plumbing. **High confidence.**

> Note: the other `"Skills"` headers in 193 are unrelated surfaces — `/context` view (499341, `· /skills`), `/usage` cost-attribution (495506, `mJn title:"Skills"`), and the `/cost` tree (514429/514594). Only `OAf`@519226 is the `/plugin` Installed-tab section. Do not conflate.

---

## Proposed module docs

1. **`38_skills/frontmatter_case_tolerance.md`** (or extend an existing skills doc under `infra_integration`) — document the frontmatter pipeline `Gm`→`ije`→`UCo`, the canonical-key-list/`zEd` and shadow-schema/`tVr` additions, AND the central honest finding that the `normalizeKeys`/`uIh` map is vestigial (built-but-unused; `Gm` ignores the option). Frame bullet #1 as a schema-recognition change, flag the dead normalizer explicitly.
2. **`38_skills/malformed_yaml_handling.md`** (small) — the `parseError` plumbing: `Gm` (149511) → loader `uyt` (451677) → `skill_load_yaml_failed` telemetry; clarify the empty-metadata/body-loads behavior is carryover and only the diagnostics are new.
3. **`38_skills/plugin_installed_skills_section.md`** (small, or a section in a `/plugin` UI doc) — the `OAf` label switch + `In`/`Cr` list-builder + override-lock/usage-badge; diff vs 183 `GYp`.

(If a single small doc is preferred, combine into one `38_skills/` overview with three sections; depth is uneven across the three bullets.)

## Depth assessment

- **Bullet #1:** *moderate-but-misleading.* Lots of real source structure (schema, canonical list, normalizer, shadow-validator), but the headline "multi-case accept" is NOT demonstrably live (dead normalizer). The honest depth is "schema/list additions + a vestigial-normalizer finding" — valuable but not the clean feature the changelog implies.
- **Bullet #2:** *moderate.* Clean, well-isolated `parseError` plumbing change across parser + loader + telemetry; small but fully provable.
- **Bullet #3:** *moderate.* Genuine new UI surface with a sharp 183/193 diff (label switch) and a sizeable list-builder; mostly UI but anchored in concrete net-new code.

Overall theme depth: **moderate** (not "rich" — two of three are small refinements; the marquee bullet has a dead-code gotcha).

## New symbols to add to `symbol_index_infra_integration.md` (Skills/Plugin)

- `Gm` (149511) — `parseMarkdownFrontmatter` (183 `CA`; returns `parseError` as of 193) — function
- `KEd` (149400) — `normalizeFrontmatterKey` (`replace(/[-_]/g,"").toLowerCase()`; 183 `_Ju`) — function
- `zEd` (149406) — `CANONICAL_FRONTMATTER_KEYS` (183 `yJu`; +displayName/defaultEnabled/fallback/evals) — constant
- `uIh` (149465) — `normalizedKeyToCanonical` Map [VESTIGIAL] (183 `kYA`) — variable
- `tVr` (149302) — `skillFrontmatterSchema` (183 `Q1r`; +defaultEnabled/displayName/...) — object
- `GEd` (149265) — `baseCommandFrontmatterSchema` (183 `mJu`) — object
- `qEd` (149393) — `frontmatterShadowSchemasByKind` {skill,agent,output-style} (183 `hJu`) — object
- `ije` (149238) — `shadowValidateFrontmatter` (telemetry-only `.strict()` check) — function
- `UCo` (451524) — `parseSkillFrontmatterFields` — function
- `Ewn` (149585) — `collectDeclaredFields` (keys + metadata.* + experimental.*) — function
- `aje` (149592) — `parseFallbackFlag` — function
- `uyt` (451677) — `loadSkillsFromDir` (consumes parseError → `skill_load_yaml_failed`) — function
- `OAf` (519209) — `pluginScopeSectionLabel` (183 `GYp` @508269; +`case "skills"`) — function
