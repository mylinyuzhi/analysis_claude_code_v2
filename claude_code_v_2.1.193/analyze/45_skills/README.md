# 45 — Skills (v2.1.193): frontmatter case-tolerance, malformed-YAML handling, the `/plugin` Skills section

> NEW MODULE. Documents the **v2.1.183 → v2.1.193** change to the Skills subsystem. The changelog
> attributes all three deltas to **2.1.186** (the big release of the window).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
> (718,679 lines, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` citation below is a **v2.1.193**
> line unless explicitly tagged `(183)` for the before-picture.
> BEFORE-PICTURE: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines). 88 named ancestor: `/lyz/codespace/3rd/claude-code/src/utils/frontmatterParser.ts`.
> Obfuscated names were **re-derived** for v2.1.193 — a 183 obf name (`CA`, `_Ju`, `yJu`, `Q1r`, `GYp`,
> …) is **never** reused here; use the [§ Related Symbols](#related-symbols) list (and
> [`../00_overview/symbol_additions_v2_1_193_skills.md`](../00_overview/symbol_additions_v2_1_193_skills.md))
> as the canonical 193 map.

---

## TL;DR — three 2.1.186 skill bullets, two of them smaller than the changelog implies

The Skills subsystem's spine — the SKILL.md loader, the shared frontmatter parser, the manual field
reader, the Skill tool, the cost/override registries — is **structurally the same** in v2.1.193. The
2.1.186 changelog lists three Skills bullets; reading the code, their real weights are uneven:

1. **REFINEMENT (with a dead-code gotcha): multi-case frontmatter keys.** The provable 193 deltas are
   *schema-recognition* additions — the skill shadow-schema `tVr` (`cli_inner_pretty.js:149302`) gained
   `defaultEnabled`/`displayName` (+ 6 more `@internal` fields), and the canonical-key list `zEd`
   (`:149406`) gained `displayName`/`defaultEnabled`/`fallback`/`evals`. But the **generic kebab→camel
   read-time rewrite is NOT wired up in this build**: the normalizer `KEd` (`:149400`) and its map
   `uIh` (`:149465`) are *built but never read*, and the parser `Gm` (`:149511`) **ignores** its
   `{ normalizeKeys: true }` argument. The kebab spellings `display-name`/`default-enabled` produce
   **zero** grep hits anywhere in 193 (or 183). So the changelog's "now accept kebab/snake/camel" is
   realized at the schema/canonical-list layer, while the runtime normalizer that would do the rewrite
   remains vestigial. Full analysis (this is the honest centerpiece):
   [`frontmatter_case_tolerance.md`](./frontmatter_case_tolerance.md).

2. **REFINEMENT (net-new diagnostics plumbing): malformed `SKILL.md` YAML.** The "loads the body with
   empty metadata" behavior is **carryover** — both 183 (`CA`) and 193 (`Gm`) leave `metadata = {}`
   and still return the markdown body on a double parse failure; a bad-YAML skill was never *dropped*.
   What is **net-new** is the *surfacing*: `Gm` now returns a `parseError` field (`:149531`) and the
   per-directory skill loader `uyt` (`:451677`) reads it to emit a per-skill error log
   (`[skills] YAML frontmatter in … failed to parse and was ignored`) + the `skill_load_yaml_failed`
   telemetry tag. "Instead of failing silently" is precisely this diagnostics delta.
   Full analysis: [`malformed_yaml_handling.md`](./malformed_yaml_handling.md).

3. **NET-NEW capability: "Skills" section in the `/plugin` Installed tab.** Conclusively isolable. The
   scope-label switch `OAf` (`:519209`) adds `case "skills": return "Skills"` (`:519226`), the
   Installed-tab list-builder gains an entire per-skill row collector `In` (`:519545`) that emits
   `type:"skill"`/`scope:"skills"` rows with an override lock and a usage badge, a `Cr.set("skills",…)`
   group (`:519627`), and a `skills: 7` sort slot (`:519598`) — none of which exist in 183's
   `GYp`/list-memo. Full analysis: [`plugin_installed_skills_section.md`](./plugin_installed_skills_section.md).

**Confidence:** high for #2 and #3 (every signature is 0-in-183); split for #1 (schema/list additions:
high and net-new; a *live* runtime kebab→camel rewrite: low — the mechanism is dead code, stated
front-and-center in the deep doc).

---

## What changed at a glance

| # | Delta | Kind | v2.1.193 anchor | v2.1.183 before | Confidence |
|---|-------|------|-----------------|-----------------|:----------:|
| S1 | Skill schema `tVr` + canonical list `zEd` recognize `displayName`/`defaultEnabled`/`fallback`/`evals` | **REFINEMENT** (schema) | `tVr` :149302 (`defaultEnabled` :149335, `displayName` :149339); `zEd` :149406 | `Q1r` :148478 / `yJu` :148571 lack them | high |
| S1b | Generic case-normalizer (`KEd`/`uIh`/`Gm` `normalizeKeys`) | **CARRYOVER + VESTIGIAL** (built, never read) | `KEd` :149400, `uIh` :149465, `Gm` ignores arg | `_Ju` :148568 / `kYA` :148629 identical, also dead | high (it's dead in both) |
| S2 | Malformed YAML → `parseError` propagated + logged + counted | **REFINEMENT** (net-new plumbing) | `Gm` returns `parseError` :149531; `uyt` consumes :451753; `skill_load_yaml_failed` :451756 | `CA` :148675 returns no `parseError`; loader :443795 no log | high |
| S2b | Malformed YAML → loads body with empty metadata (skill not dropped) | **CARRYOVER** | `Gm` `a={}` + `content:s` :149517/:149531 | identical in `CA` :148681/:148693 | high |
| S3 | "Skills" section in `/plugin` Installed tab | **NET-NEW** (UI capability) | `OAf` `case "skills"` :519226; `In` builder :519545; `Cr.set("skills")` :519627; sort `skills:7` :519598 | `GYp` :508267 has no skills case; `set("skills")`/`scope:"skills"` = 0 | high |

---

## 1. S1 — multi-case frontmatter keys (the honest centerpiece)

Summary here; the full What/How/Why/Key-insight lives in
[`frontmatter_case_tolerance.md`](./frontmatter_case_tolerance.md). The load-bearing facts:

- The skill shadow-schema `skillFrontmatterSchema` (obfuscated: `tVr`, `:149302`) is a Zod-shaped
  object built as `baseCommandFrontmatterSchema().extend({...})` (`GEd` @`:149265`). In 193 it gained
  eight `@internal` keys including `defaultEnabled` (`:149335`) and `displayName` (`:149339`).
  Grep-diff: `grep -c 'defaultEnabled: A.unknown'` = **0 in 183, 1 in 193**; same for
  `'displayName: A.unknown'`. (`fallback` and `metadata` were already in the 183 schema `Q1r` — those
  two are carryover; verified `Q1r` @`:148478` already has them.)
- The canonical-key list `CANONICAL_FRONTMATTER_KEYS` (obfuscated: `zEd`, `:149406`) gained
  `displayName`/`defaultEnabled`/`fallback`/`evals`. `grep -c '"defaultEnabled"'` = **0 in 183, 1 in
  193**; the 183 list `yJu` (`:148571`) contains none of the four.
- **The dead-normalizer gotcha.** The only `replace(/[-_]/g,"")` key-normalizer `KEd` (`:149400`) is
  called *exactly once* — to build the map `uIh` (`:149465`), which is itself referenced *exactly
  twice* (declaration + that build). `grep -cn 'uIh'` = **2**. Nothing reads the map. And the parser
  `Gm` (`:149511`), although every skill/plugin caller passes `{ normalizeKeys: true }` (11 call sites:
  `:288139`, `:451753`, `:474827`, `:474990`, `:475023`, `:475105`, `:475291`, `:480453`, `:518252`,
  `:599002`, plus a standalone `:475155`), **never references its 3rd parameter** — its transform is
  `i = (c) => c` (identity). The 183 parser `CA` is byte-identical here. The actual skill field reader
  `UCo` (`:451524`) reads camelCase/kebab *literals* directly (e.g. `displayName` is derived from
  `e.name`, `fallback: aje(e.fallback)`), with no normalization step. The kebab forms
  `display-name`/`default-enabled` have **zero** grep hits in 193.

So the 193 change is at the **schema/canonical-list recognition** layer (high confidence, net-new):
these keys no longer trip the `tengu_frontmatter_shadow_unknown_key` shadow-telemetry path in `ije`.
A *demonstrable live kebab→camel rewrite at read time* is NOT present — the data structure that would
perform it (`uIh`) is dead code, and `Gm` ignores the option. This is the key finding; the deep doc
states it front-and-center.

---

## 2. S2 — malformed `SKILL.md` YAML: parseError plumbing

Summary here; full analysis in [`malformed_yaml_handling.md`](./malformed_yaml_handling.md). The
parser `parseMarkdownFrontmatter` (obfuscated: `Gm`, `:149511`) does a two-stage YAML parse (raw, then
a tab→space retry); on *double* failure it leaves `frontmatter = {}` and still returns the body
`content`. That body-loads-with-empty-metadata behavior is **identical in 183** (`CA`, `:148675`) — it
is **carryover**; a bad-YAML skill was never dropped.

What is **net-new in 193**: `Gm` now captures the error message and appends it to the return as
`...(l !== void 0 && { parseError: l })` (`:149531`) — `grep -c 'parseError:'` = **0 in 183, 1+ in
193**. The per-directory skill loader `loadSkillsFromDir` (obfuscated: `uyt`, `:451677`) destructures
that field (`:451753`) and, when set, logs `[skills] YAML frontmatter in ${path} failed to parse and
was ignored: ${err}` at `level:"error"` and fires `Ct("skill_load_dir", "skill_load_yaml_failed")`
(`:451755-451756`). Both signatures are **0 in 183**. The 183 loader (`:443795`) destructured only
`{frontmatter, content}` — the error was swallowed by an internal `warn` inside `CA`. This is the
"instead of failing silently" delta: diagnostics, not load-success.

---

## 3. S3 — "Skills" section in the `/plugin` Installed tab

Summary here; full analysis in [`plugin_installed_skills_section.md`](./plugin_installed_skills_section.md).
The decisive proof is the scope-label switch `pluginScopeSectionLabel` (obfuscated: `OAf`, `:519209`):
183's `GYp` (`:508267`) lists exactly `flagged/project/local/user/enterprise/managed/builtin,dynamic`
with **no** skills branch; 193's `OAf` adds `case "skills": return "Skills"` (`:519226`). The
Installed-tab list-builder gains a whole per-skill row collector `In` (`:519545`) that, for each
loaded skill prompt, pushes a row `{ type:"skill", scope:"skills", override, lockSource, usage,
tokenEstimate, whenToUse, skillRoot, allowedTools, … }` (`In.push` @`:519566`), inserts a
`Cr.set("skills", In)` group (`:519627`) when non-empty, and sorts it last via `skills: 7`
(`:519598`). The override lock (policy/flag/author) and the usage badge (count + daysSinceUse) reuse
the **partly pre-existing** `skillOverrides`/`skillUsage` registries — surfaced here in a **new UI
surface**. 183 has `Cr.set("skills"` = 0 and `scope: "skills"` = 0.

> Disambiguation: the other `"Skills"` headers in 193 are unrelated surfaces — the `/context` view,
> the `/usage` cost-attribution, the `/cost` tree. Only `OAf`@`:519226` (rendered at `OAf(dt.scope)`
> @`:520939`) is the `/plugin` Installed-tab section. Do not conflate.

---

## What CARRIES OVER UNCHANGED (do NOT re-derive)

- **The SKILL.md → Skill tool path** (skill discovery, the inline/fork execution context, the Skill
  tool description) — structurally the same; only the frontmatter-recognition edges changed. See the
  183 reconstruction [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts).
- **The shared frontmatter parser shape** (`Gm`/`CA`: regex match → YAML parse → tab-retry → empty
  fallback) — unchanged except the new `parseError` return (S2). The same parser serves slash-commands,
  agents, and output-styles (`qEd` = {skill, agent, output-style}).
- **The manual field reader `UCo`** — its field-by-field accessors (`allowed-tools`, `when_to_use`,
  `disable-model-invocation`, …) are carryover; it gained no normalization step in 193.
- **The `skillOverrides`/`skillUsage` registries** — the data model pre-existed in 183 (surfaced in
  `/skills` and cost attribution); 193 *re-uses* it to populate the new `/plugin` section (S3), it did
  not invent it.

---

## Files in this module

```
45_skills/   (v2.1.193 — NEW MODULE)
├── README.md                          ← you are here (index + at-a-glance + carryover links)
├── frontmatter_case_tolerance.md      ← S1. The honest centerpiece: schema/canonical-list additions
│                                          (tVr/zEd) ARE net-new, but KEd/uIh/Gm-normalizeKeys are
│                                          VESTIGIAL — no live kebab→camel rewrite. The shadow-validator
│                                          ije/qEd recognition path is the real surface of the change.
├── malformed_yaml_handling.md         ← S2. The parseError plumbing: Gm returns parseError → loader
│                                          uyt logs + skill_load_yaml_failed; empty-metadata = carryover.
└── plugin_installed_skills_section.md ← S3. The OAf "Skills" label + In row builder + Cr.set/skills:7;
                                           diff vs 183 GYp; override-lock + usage-badge.
```

## Reading order

1. **This README** — internalize the three deltas and their uneven weights.
2. **`plugin_installed_skills_section.md`** — the cleanest net-new capability; read first if you want
   a sharp 183/193 diff.
3. **`malformed_yaml_handling.md`** — small, fully provable parseError plumbing.
4. **`frontmatter_case_tolerance.md`** — read last and carefully; it is the marquee bullet but carries
   the dead-code gotcha, so its honest depth is "schema/list additions + a vestigial-normalizer finding."

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc
> uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools — the Skill tool / loader path)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Core features: Skills is the home module** (frontmatter pipeline, loader, plugin section)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Prompt/Telemetry — shadow-telemetry tags)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (Plugin UI — the `/plugin` Installed tab)
> - [../00_overview/symbol_additions_v2_1_193_skills.md](../00_overview/symbol_additions_v2_1_193_skills.md) — the granular v2.1.193 additions for this module

Key functions/constants in this module (re-derived v2.1.193 names):

- `parseMarkdownFrontmatter` (obfuscated: `Gm`, `cli_inner_pretty.js:149511`) — shared frontmatter
  parser; ignores its `{normalizeKeys}` arg; returns `parseError` as of 193. (183 `CA` @148675.)
- `normalizeFrontmatterKey` (obfuscated: `KEd`, `cli_inner_pretty.js:149400`) — `replace(/[-_]/g,"").toLowerCase()`; only builds the dead map. (183 `_Ju` @148568.)
- `CANONICAL_FRONTMATTER_KEYS` (obfuscated: `zEd`, `cli_inner_pretty.js:149406`) — +`displayName`/`defaultEnabled`/`fallback`/`evals`. (183 `yJu` @148571.)
- `normalizedKeyToCanonical` (obfuscated: `uIh`, `cli_inner_pretty.js:149465`) — Map; **VESTIGIAL** (2 refs). (183 `kYA` @148629.)
- `skillFrontmatterSchema` (obfuscated: `tVr`, `cli_inner_pretty.js:149302`) — +`defaultEnabled`@149335/`displayName`@149339 + 6 `@internal`. (183 `Q1r` @148478.)
- `frontmatterShadowSchemasByKind` (obfuscated: `qEd`, `cli_inner_pretty.js:149393`) — `{skill,agent,output-style}` `.strict()`.
- `shadowValidateFrontmatter` (obfuscated: `ije`, `cli_inner_pretty.js:149238`) — telemetry-only `.strict()` check; fires `tengu_frontmatter_shadow_unknown_key`/`tengu_frontmatter_shadow_mismatch`.
- `parseSkillFrontmatterFields` (obfuscated: `UCo`, `cli_inner_pretty.js:451524`) — manual reader; `displayName: e.name`, `fallback: aje(e.fallback)`.
- `loadSkillsFromDir` (obfuscated: `uyt`, `cli_inner_pretty.js:451677`) — consumes `parseError` → `[skills] … failed to parse and was ignored` + `skill_load_yaml_failed`.
- `pluginScopeSectionLabel` (obfuscated: `OAf`, `cli_inner_pretty.js:519209`) — +`case "skills": return "Skills"` @519226. (183 `GYp` @508267.)
