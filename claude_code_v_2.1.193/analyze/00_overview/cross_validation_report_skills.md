# Cross-Validation Report — Module 45_skills (v2.1.193 delta)

- **Module:** 45_skills (Skills subsystem delta, v2.1.183 → v2.1.193; changelog attributes all three to 2.1.186)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/45_skills/`
- **Docs audited:** `README.md`, `frontmatter_case_tolerance.md`, `malformed_yaml_handling.md`, `plugin_installed_skills_section.md` (all 4) + the additions file
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.193/analyze/00_overview/symbol_additions_v2_1_193_skills.md`
- **TARGET bundle (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (718,679 lines, build `a1938d2a`)
- **BEFORE-PICTURE (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **EARLIER BASELINE (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`
- **In-scope 193 deltas:** (1) skill-frontmatter multi-case key recognition (`display-name`/`default-enabled`/`fallback`/`metadata.*`), (2) malformed `SKILL.md` YAML → loads body with empty metadata + surfaces `parseError`, (3) "Skills" section in the `/plugin` Installed tab.

**Sample:** ~45 distinct 193 anchors re-read in the TARGET bundle · ~15 before-pictures re-read across the 183 + 156 bundles (183 ancestor decls + 156 baseline greps) · 8 v2.1.88 named-TS lineage anchors re-read · ~18 grep-count diffs re-run in BOTH 183 and 156.

**Verdict (one line):** PASS WITH FIXES. Every load-bearing 193 declaration, signature, schema body, switch-case, row-builder field, sort slot, and group-insert matched the docs at the cited lines, and every NET-NEW signature reproduced as `0 in 183 AND 0 in 156` → genuine 193 deltas (not 156/183 carryover). The honest "vestigial normalizer" gotcha in `frontmatter_case_tolerance.md` is exactly correct (`uIh`/`kYA` = 2 refs each, both dead; `Gm`/`CA` use identity transform; `display-name`/`default-enabled` = 0 in both builds). Three small line-cite drifts (±2 lines) were fixed in place; one defensible residual is noted.

---

## A — 193 TARGET citation spot-check (PASS/FAIL per load-bearing anchor)

Each line opened at the exact cited line in the v2.1.193 bundle; declaration / body / field confirmed against the doc.

### Frontmatter pipeline (149233–149612)

| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `Yxi` | `recordShadowTelemetryOnce` | 149233 | `function Yxi(e, t, n) {` + `Kxi.has(r)` dedup + `V(e,{surface:$e(t),detail:n})` | PASS |
| `ije` | `shadowValidateFrontmatter` | 149238 | `function ije(e, t) {` + `qEd[e]().safeParse(t)` + `tengu_frontmatter_shadow_unknown_key`/`_mismatch` | PASS |
| `GEd` | `baseCommandFrontmatterSchema` | 149265 | `(GEd = Ce(() => A.object({ name…description…model…allowed-tools… }))` | PASS |
| `tVr` | `skillFrontmatterSchema` | 149302 | `(tVr = Ce(() => GEd().extend({…}))` | PASS |
| — | `defaultEnabled: A.unknown().optional()` | 149335 | exact string present | PASS |
| — | `displayName: A.unknown().optional()` | 149339 | exact string present | PASS |
| `WEd` | `agentFrontmatterSchema` | 149347 | `(WEd = Ce(() =>` | PASS |
| `VEd` | `outputStyleFrontmatterSchema` | 149377 | `(VEd = Ce(() =>` | PASS |
| `qEd` | `frontmatterShadowSchemasByKind` | 149393 | `{skill: tVr().strict(), agent: WEd().strict(), "output-style": VEd().strict()}` | PASS |
| `KEd` | `normalizeFrontmatterKey` | 149400 | `function KEd(e){ return e.replace(/[-_]/g,"").toLowerCase(); }` | PASS |
| `zEd` | `CANONICAL_FRONTMATTER_KEYS` | 149406 | array incl. `displayName`/`defaultEnabled`/`fallback`/`evals` (all four present) | PASS |
| `uIh` | `normalizedKeyToCanonical` (VESTIGIAL) | 149465 | `uIh = new Map(zEd.map((e)=>[KEd(e),e]))`; refs = 2 (149403 var-decl + 149465 build) | PASS |
| `Zhe` | `parseYaml` (`Bun.YAML.parse`) | 149467 | `function Zhe(e){ return Bun.YAML.parse(e); }` | PASS |
| `XEd` | `quoteSpecialYaml` | 149477 | `function XEd(e){…}` retry-pass quoter | PASS |
| `Gm` | `parseMarkdownFrontmatter` | 149511 | `function Gm(e, t, n){…}`; `i=(c)=>c` identity; `n` (3rd arg) never read; `a={}`@149517; return spread `...(l!==void 0 && {parseError:l})`@149531 | PASS |
| `Xxi` | `asPlainObject` | 149533 | `function Xxi(e){ if(e&&typeof e==="object"&&!Array.isArray(e)) return e; return {}; }` | PASS |
| `Ewn` | `collectDeclaredFields` | 149585 | `es([...Object.keys(e),...t(e.metadata),...t(e.experimental)])` | PASS |
| `drt` | `parseBooleanFlag` | 149589 | `e===!0 || e==="true"` | PASS |
| `aje` | `parseFallbackFlag` | 149592 | true/"true"→true, false/"false"→false, else undefined | PASS |
| `eye` | `FRONTMATTER_REGEX` | 149612 | `/^---\s*\n([\s\S]*?)---\s*\n?/` | PASS |

### Skill loader (451524–451756)

| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `UCo` | `parseSkillFrontmatterFields` | 451524 | `function UCo(e,t,n,r="Skill")`; `displayName: e.name…`, `allowedTools: xJ(e["allowed-tools"])`, `disallowedTools: xJ(e["disallowed-tools"] ?? e.disallowedTools)`, `whenToUse: e.when_to_use…`, `disableModelInvocation: drt(e["disable-model-invocation"])`, `declaredFields: Ewn(e)`, `fallback: aje(e.fallback)` | PASS |
| `uyt` | `loadSkillsFromDir` | 451677 | `async function uyt(e, t) {` | PASS |
| — | `parseError` destructure | 451753 | `let { frontmatter: p, content: f, parseError: m } = Gm(d, c, { normalizeKeys: !0 });` | PASS |
| — | `[skills] … failed to parse and was ignored` log @`level:"error"` | 451755 | exact template literal present | PASS |
| — | `Ct("skill_load_dir","skill_load_yaml_failed")` | 451756 | exact call present | PASS |
| — | sibling `skill_load_read_failed` | 451750 | `[skills] failed to read ${c}` + `o = "skill_load_read_failed"` | PASS |

### `/plugin` Installed-tab Skills section (519209–520939)

| Obf | Readable | 193 line | Verified | Result |
|-----|----------|----------|----------|--------|
| `OAf` | `pluginScopeSectionLabel` | 519209 | `function OAf(e){ switch(e){…} }` — flagged/project/local/user/enterprise/managed/builtin+dynamic/**skills**/default | PASS |
| — | `case "skills": return "Skills"` | 519226–519227 | `case "skills":`@519226 → `return "Skills";`@519227 | PASS (cite at case label) |
| `In` | Installed-tab skill-row collector | 519545 | `let In = [];` + `if (a){…}` | PASS |
| — | `skillUsage` read | 519548 | `Mo = Lt().skillUsage ?? {}` | PASS (was 519547 — **fixed**) |
| — | `skillOverrides` reads (user/policy/flag) | 519550–519552 | `jn`/`ir`/`Ht` = `dt`/`policySettings`/`flagSettings` `.skillOverrides` | PASS (was 519548-519550 — **fixed**) |
| — | `In.push({type:"skill",scope:"skills",override,lockSource,usage,tokenEstimate,whenToUse,skillRoot,allowedTools})` | 519566 | every field present; precedence policy>flag>author>user | PASS |
| `vt` | `skills: 7` sort slot | 519598 | `{flagged:-1,project:0,local:1,user:2,enterprise:3,managed:4,dynamic:5,builtin:6,skills:7}` | PASS |
| `Cr` | `Cr.set("skills", In)` group (gated non-empty) | 519627 | `if (In.length > 0) Cr.set("skills", In);` | PASS |
| — | render site `OAf(dt.scope)` (scope-header) | 520939 | `paddingLeft:4 … children: OAf(dt.scope)` in `case "scope-header"` | PASS |
| — | `skill-detail` nav (3 sites) | 519427 / 520044 / 520655 | all three `type==="skill-detail"` / `{type:"skill-detail",skill}` present | PASS |
| — | `.defaultEnabled` camelCase consumers | 194604,477822,478030,480087,480180,516386 | all six real manifest-layer reads | PASS |
| — | 11 `{ normalizeKeys: true }` call sites | 288139,451753,474827,474990,475023,475105,475155,475291,480453,518252,599002 | grep -n = exactly those 11; grep -c = 11 | PASS |

---

## B — Before-picture (183 / 156) anchor checks

| Obf (183) | Maps to (193) | 183 line | Verified | Result |
|-----------|---------------|----------|----------|--------|
| `Q1r` | `tVr` | 148478 | `(Q1r = we(() => mJu().extend({…}))`; has `fallback`@148494 + `metadata`@148512; **lacks** userConfig/defaultEnabled/displayName/author/homepage/repository/license/keywords | PASS |
| `_Ju` | `KEd` | 148568 | `function _Ju(e){…}` byte-identical normalizer | PASS |
| `yJu` | `zEd` | 148571 / 148574-148628 | `var yJu, kYA;`@148571; list assignment `yJu = [`@148574 through `]`@148628 contains **none** of displayName/defaultEnabled/fallback/evals | PASS |
| `kYA` | `uIh` | 148629 | `kYA = new Map(yJu.map((e)=>[_Ju(e),e]))`; refs = 2 (148571 + 148629) → VESTIGIAL in 183 too | PASS |
| `CA` | `Gm` | 148675 | `function CA(e,t,n){…}`; `i=(l)=>l` identity; inner catch only `v(…warn…)`; `a={}`@148681; `return { frontmatter:a, content:s };`@148693 — **no** `l`, **no** `parseError` | PASS |
| `GYp` | `OAf` | 508267 | `function GYp(e){ switch… }` — flagged/project/local/user/enterprise/managed/builtin+dynamic/default — **no** `case "skills"` | PASS |
| — (loader) | `uyt` | 443795 | `let { frontmatter: p, content: f } = CA(d, c, { normalizeKeys: !0 })` — destructures **only** `{frontmatter,content}`; sibling `skill_load_read_failed`@443792; **no** parseError/yaml-failed branch | PASS |

---

## C — False-delta hunt (grep-count diffs re-run in BOTH 183 AND 156)

Every NET-NEW/REFINEMENT signature was grepped in all three bundles. A genuine 193 delta must be `0 in 183 AND 0 in 156`.

| Signature | 193 | 183 | 156 | Doc claim | Verdict |
|-----------|----:|----:|----:|-----------|---------|
| `parseError:` | 2 | 0 | 0 | "0 in 183, 1+ in 193" | CONFIRMED NET-NEW (2 = `Gm` return + `uyt` destructure) |
| `failed to parse and was ignored` | 1 | 0 | 0 | "0 in 183, 1 in 193" | CONFIRMED NET-NEW |
| `skill_load_yaml_failed` | 1 | 0 | 0 | "0 in 183, 1 in 193" | CONFIRMED NET-NEW |
| `defaultEnabled: A.unknown` | 1 | 0 | 0 | "0→1" | CONFIRMED NET-NEW |
| `displayName: A.unknown` | 1 | 0 | 0 | "0→1" | CONFIRMED NET-NEW |
| `"defaultEnabled"` (canonical list) | 1 | 0 | 0 | "0→1" | CONFIRMED NET-NEW |
| `scope: "skills"` | 1 | 0 | 0 | "0 in 183, present in 193" | CONFIRMED NET-NEW |
| `set("skills"` | 1 | 0 | 0 | "0 in 183" | CONFIRMED NET-NEW |
| `display-name` (kebab) | 0 | 0 | 0 | "0 in both 183 and 193" | CONFIRMED ABSENT (doc accurate) |
| `default-enabled` (kebab) | 0 | 0 | 1* | "0 in both 183 and 193" | CONFIRMED ABSENT in 183/193; *156=1 is the unrelated `claude-in-chrome-default-enabled` key @156:622384 — outside the doc's 183/193 claim scope |
| `skillOverrides` (line-match) | 17 | 11 | 8 | "11→17" | CONFIRMED CARRYOVER (re-used+expanded) |
| `skillUsage` (line-match) | 5 | 3 | 3 | "3→5" | CONFIRMED CARRYOVER |
| `skillOverrides` (occurrences) | 20 | 13 | — | "occ 13→20" (drift-fix note) | CONFIRMED |
| `skillUsage` (occurrences) | 7 | 4 | — | "occ 4→7" (drift-fix note) | CONFIRMED |
| `uIh` refs | 2 | — | — | "2 (dead)" | CONFIRMED VESTIGIAL |
| `kYA` refs (183) | — | 2 | — | "2 (dead in 183)" | CONFIRMED VESTIGIAL |
| `normalizeKeys` | 11 | — | — | "11 call sites" | CONFIRMED |
| `.defaultEnabled` | 10 | — | — | "consumed via camelCase manifest reads" | CONFIRMED (6 cited lines all real) |

**Conclusion of the hunt:** Every claimed 193 delta is independently `0 in 183 AND 0 in 156` — none is a mislabeled 156/183 carryover. Every claimed carryover (`fallback`/`metadata` in the skill schema; the empty-metadata-then-body parser behavior; the `skillOverrides`/`skillUsage` registries; the dead normalizer) is independently present in 183 (and the registries already in 156). The drift-fix note already inside `plugin_installed_skills_section.md` (correcting the scout dossier's inflated `skillOverrides 11→22` / `skillUsage 3→22` to the real `11→17` / `3→5`, occ `13→20` / `4→7`) is itself accurate.

---

## C2 — v2.1.88 named-TS lineage spot-check

The 88 tree is not used as a delta baseline for obfuscated line numbers, but it is useful for checking whether the
193 claims align with the older named source architecture.

- `src/utils/frontmatterParser.ts:10-58` defines `FrontmatterData` with literal keys
  `allowed-tools`, `description`, `argument-hint`, `when_to_use`, `user-invocable`, `context`,
  `agent`, `paths`, and `shell`, plus `[key: string]: unknown`; it does **not** explicitly define
  `displayName`, `defaultEnabled`, `fallback`, or `metadata`. This supports the doc's "literal readers, permissive
  object" framing.
- `src/utils/frontmatterParser.ts:61-64` defines `ParsedMarkdown` as only `{ frontmatter, content }`.
  There is no `parseError` slot in the 88 parser return type.
- `src/utils/frontmatterParser.ts:130-133` exposes `parseFrontmatter(markdown, sourcePath?)`; focused
  `rg normalizeKeys /lyz/codespace/3rd/claude-code/src/utils/frontmatterParser.ts` returns 0. The generic
  normalization option is therefore post-88, and the 193 report correctly treats it as vestigial because `Gm`
  still ignores its third argument.
- `src/utils/frontmatterParser.ts:153-168` shows the 88 YAML-failure path: retry after
  `quoteProblematicValues`, then log `Failed to parse YAML frontmatter...`; `:171-174` still returns
  `{ frontmatter, content }`. This confirms that "keep the body despite malformed YAML" predates 193; the
  193 delta is the new `parseError` propagation and `skill_load_yaml_failed` event.
- `src/skills/loadSkillsDir.ts:185-207` returns the parsed skill field shape with no `fallback`,
  `declaredFields`, or `parseError`. The actual field readers are literal: `frontmatter.name` for
  `displayName` at `:237-240`, `frontmatter["allowed-tools"]` at `:242-244`, and `frontmatter.when_to_use`
  at `:252`.
- `src/skills/loadSkillsDir.ts:447-450` destructures only `{ frontmatter, content: markdownContent }`
  from `parseFrontmatter`; focused `rg skill_load_yaml_failed /lyz/codespace/3rd/claude-code/src` returns 0.

**C2 result:** PASS. No 88 ancestor contradicts the 193 conclusions. The old named tree already had the permissive
body-preserving parser and literal skill-field accessors; 193 adds schema/canonical-key recognition plus YAML
diagnostic surfacing, not a universal key-normalization runtime.

---

## D — Defects fixed in place

| # | File | What was wrong | Fix |
|---|------|----------------|-----|
| 1 | `45_skills/plugin_installed_skills_section.md` (Related Symbols) | `skillUsage` read cited `:519547` (actually the `pluginSkillNames`/`Gn` line); `skillOverrides` read cited `:519548-519550` (started on the `skillUsage` line, ended on the first of three override reads) | Corrected to `skillUsage` `:519548` and `skillOverrides` `:519550-519552` (the exact three `dt`/`policySettings`/`flagSettings` `.skillOverrides` reads) |
| 2 | `45_skills/README.md` (S2b row) | 183 `CA` empty-metadata/body cites `:148679/:148691` (148679 = the `s = e.slice(…)` line; 148691 = inside the inner catch) | Corrected to `:148681/:148693` (`a={}`@148681, `return {frontmatter:a, content:s}`@148693) |
| 3 | `45_skills/malformed_yaml_handling.md` (evidence note) | Same 183 `CA` cite `@148679/:148691` | Corrected to `@148681/:148693` |

No content/mapping errors were found: every obf→readable mapping (schema, parser, loader, label-switch, row-builder) verified against the decl body in 193; no fabricated lines; no false deltas; no forbidden mapping tables introduced; the cross-version ancestor table (`CA`/`_Ju`/`yJu`/`kYA`/`Q1r`/`GYp` → 193) is a permitted re-mangle table, not an obf→readable mapping table.

---

## E — Verdict, confidence, residuals

**Verdict:** PASS WITH FIXES.
**Confidence:** HIGH. All three deltas are corroborated by `0-in-183 AND 0-in-156` signatures; the parser/schema/loader/label-switch/row-builder bodies were read in full at the cited lines; the v2.1.88 named-TS lineage matches the older parser/loader shape; the honest "vestigial normalizer / schema-recognition-only" framing of Bullet #1 is exactly what the code shows.

**Residuals (honest):**
1. No Skills-specific residual remains for `yJu`: the published docs now cite both the 183 declaration (`:148571`) and the actual canonical-list assignment range (`:148574-148628`). The parallel 193 cite remains `zEd@149406`, the list assignment line.
2. `parseError:` greps `2` in 193 (not 1): the second hit is the `uyt` destructure `parseError: m`@451753, which is expected and consistent with the docs ("1+ in 193"). Not a defect.
3. The malformed-YAML location header in `malformed_yaml_handling.md` ("…(183: CA @148675-148694)") uses the closing-brace line 148694 for the CA range end — correct (CA's `}` is at 148694); the body's last logical line is the 148693 return now cited in the evidence note.
