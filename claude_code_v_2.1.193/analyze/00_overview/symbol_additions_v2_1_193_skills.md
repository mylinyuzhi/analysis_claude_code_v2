# Symbol Additions — v2.1.193 — Skills (NEW MODULE)

> Consolidated obfuscated→readable symbol manifest for the **Skills** subsystem **as it exists in
> v2.1.193** (build `a1938d2a`) — the three v2.1.186 changelog bullets analysed in
> [`../45_skills/`](../45_skills/README.md): (1) skill-frontmatter multi-case key tolerance
> (`display-name`/`default-enabled`/`fallback`/`metadata.*`), (2) malformed `SKILL.md` YAML now loads
> the body with empty metadata **and surfaces a `parseError`** instead of failing silently, and (3) a
> "Skills" section in the `/plugin` Installed tab.
>
> **Routing — these rows fold into [`symbol_index_core_features.md`](./symbol_index_core_features.md),
> "## Module: Skills".** The frontmatter parser/schema/shadow-validator symbols are shared by skills,
> slash-commands, agents, and output-styles (one parsing pipeline), but their primary home for this
> delta is the Skills feature index. The `/plugin` Installed-tab render (`OAf`) also touches the
> plugin-UI surface tracked in `symbol_index_infra_integration.md`; it is recorded here as part of the
> Skills delta because the net-new branch is the `case "skills"` section.
>
> **All line numbers are v2.1.193** (`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`).
> Where a v2.1.183 obfuscated ancestor exists it is given in the Description column as `(183 <obf>@<line>)`.
> **The v2.1.183 names DO NOT apply in v2.1.193 — the bundler re-mangles every build.** Every row was
> re-read in the live 193 bundle during this pass.

## Module: Skills — frontmatter pipeline (Bullet #1 + #2)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Gm` | `parseMarkdownFrontmatter` | cli_inner_pretty.js:149511 | function |
| `eye` | `FRONTMATTER_REGEX` (`/^---\s*\n([\s\S]*?)---\s*\n?/`) | cli_inner_pretty.js:149612 | constant |
| `Zhe` | `parseYaml` (`Bun.YAML.parse`) | cli_inner_pretty.js:149467 | function |
| `Xxi` | `asPlainObject` | cli_inner_pretty.js:149533 | function |
| `XEd` | `quoteSpecialYaml` (retry-pass pre-processor) | cli_inner_pretty.js:149477 | function |
| `KEd` | `normalizeFrontmatterKey` (`replace(/[-_]/g,"").toLowerCase()`) | cli_inner_pretty.js:149400 | function |
| `zEd` | `CANONICAL_FRONTMATTER_KEYS` | cli_inner_pretty.js:149406 | constant |
| `uIh` | `normalizedKeyToCanonical` (Map; **VESTIGIAL — built, never read**) | cli_inner_pretty.js:149465 | variable |
| `GEd` | `baseCommandFrontmatterSchema` | cli_inner_pretty.js:149265 | object |
| `tVr` | `skillFrontmatterSchema` (`GEd().extend(...)`) | cli_inner_pretty.js:149302 | object |
| `WEd` | `agentFrontmatterSchema` | cli_inner_pretty.js:149347 | object |
| `VEd` | `outputStyleFrontmatterSchema` | cli_inner_pretty.js:149377 | object |
| `qEd` | `frontmatterShadowSchemasByKind` ({skill,agent,output-style}; `.strict()`) | cli_inner_pretty.js:149393 | object |
| `ije` | `shadowValidateFrontmatter` (telemetry-only `.strict()` check) | cli_inner_pretty.js:149238 | function |
| `Yxi` | `recordShadowTelemetryOnce` (dedups per surface/key) | cli_inner_pretty.js:149233 | function |
| `UCo` | `parseSkillFrontmatterFields` (manual camelCase/kebab reader) | cli_inner_pretty.js:451524 | function |
| `Ewn` | `collectDeclaredFields` (keys + `metadata.*` + `experimental.*`) | cli_inner_pretty.js:149585 | function |
| `aje` | `parseFallbackFlag` (true/"true"/false/"false"→bool, else undefined) | cli_inner_pretty.js:149592 | function |
| `drt` | `parseBooleanFlag` (`e===true \|\| e==="true"`) | cli_inner_pretty.js:149589 | function |
| `uyt` | `loadSkillsFromDir` (consumes `parseError` → `skill_load_yaml_failed`) | cli_inner_pretty.js:451677 | function |

## Module: Skills — `/plugin` Installed-tab section (Bullet #3)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `OAf` | `pluginScopeSectionLabel` (adds `case "skills": return "Skills"` @519226) | cli_inner_pretty.js:519209 | function |

## v2.1.183 ancestors (before-picture — DO NOT use these names in 193)

| 183 Obfuscated | Maps to 193 | 183 File:Line | Note |
|----------------|-------------|---------------|------|
| `CA` | `Gm` | cli_inner_pretty.js:148675 | returns only `{frontmatter,content}` — no `parseError` |
| `_Ju` | `KEd` | cli_inner_pretty.js:148568 | byte-identical normalizer |
| `yJu` | `zEd` | cli_inner_pretty.js:148571 | lacks `displayName`/`defaultEnabled`/`fallback`/`evals` |
| `kYA` | `uIh` | cli_inner_pretty.js:148629 | also VESTIGIAL in 183 (2 refs) |
| `Q1r` | `tVr` | cli_inner_pretty.js:148478 | lacks `userConfig`/`defaultEnabled`/`displayName`/`author`/`homepage`/`repository`/`license`/`keywords` |
| `GYp` | `OAf` | cli_inner_pretty.js:508267 | scope-label switch with NO `case "skills"` |

> Note: `tengu_frontmatter_shadow_unknown_key` / `tengu_frontmatter_shadow_mismatch` (the shadow
> telemetry tags emitted by `ije`/`Yxi`) and `skill_load_yaml_failed` (the new per-skill YAML-failure
> counter tag emitted by `uyt`) are event names, not symbols; they live in the telemetry index.
