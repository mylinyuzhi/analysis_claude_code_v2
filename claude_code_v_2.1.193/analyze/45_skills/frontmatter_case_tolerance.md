# Skill Frontmatter Multi-Case Key Tolerance (v2.1.183 → v2.1.193)

> Type/Version: REFINEMENT (schema-recognition additions, net-new) **+** a vestigial-normalizer
> finding (dead code, carryover). Changelog 2.1.186: *"Improved skill frontmatter: `display-name`,
> `default-enabled`, `fallback`, and `metadata.*` keys now accept kebab-case, snake_case, and
> camelCase."* TARGET: `cli_inner_pretty.js` @ build `a1938d2a`. Before-picture tagged `(183)`.

## TL;DR — the changelog is realized at the schema layer, not at a live read-time rewrite

This is the marquee Skills bullet of the window, and it is the one most worth reading carefully,
because the clean feature the changelog implies (write `display-name:` and it is read as `displayName`)
is **not demonstrably live in this build**. What *is* provable and net-new:

1. The skill shadow-schema `skillFrontmatterSchema` (`tVr`, `:149302`) gained the keys `defaultEnabled`
   (`:149335`) and `displayName` (`:149339`) — so these no longer trip the `.strict()` shadow-telemetry
   "unknown key" path.
2. The canonical-key list `CANONICAL_FRONTMATTER_KEYS` (`zEd`, `:149406`) gained
   `displayName`/`defaultEnabled`/`fallback`/`evals`.

What is **NOT** present (the honest gotcha):

3. A generic kebab→camel *read-time rewrite*. The normalizer `KEd` (`:149400`) and its lookup map
   `uIh` (`:149465`) are **built but never read**; the parser `Gm` (`:149511`) **ignores** the
   `{ normalizeKeys: true }` option every caller passes; and the skill field reader `UCo` (`:451524`)
   reads camelCase/kebab *literals* directly. `display-name`/`default-enabled` (kebab) have **zero**
   grep hits in 193. So the runtime mechanism that would make all three cases interchangeable is dead.

The result: the changelog's "now accept" is true at the **recognition** layer (a key spelled
`displayName`/`defaultEnabled` is now a known schema/canonical key), but a user literally typing
`display-name:` would still be read by the camelCase accessor `e.name`/manifest `.displayName` — the
rewrite that would bridge the spelling never runs.

---

## 0. The frontmatter pipeline, end to end (so the change has a frame)

Skills, slash-commands, agents, and output-styles all share **one** frontmatter pipeline. Three
functions matter:

- **`parseMarkdownFrontmatter`** (`Gm`, `:149511`) — splits `---\nYAML\n---\nbody` into
  `{ frontmatter, content }`. Pure structure: it does **not** normalize keys.
- **`shadowValidateFrontmatter`** (`ije`, `:149238`) — runs the parsed frontmatter through a
  per-kind Zod `.strict()` schema **purely to emit telemetry** about unrecognized/mismatched keys. It
  does not gate loading; it is a passive observer.
- **`parseSkillFrontmatterFields`** (`UCo`, `:451524`) — the *actual* reader. It pulls each field off
  the raw parsed object with literal accessors (`e["allowed-tools"]`, `e.when_to_use`, `e.name`, …) and
  produces the typed skill record the loader stores.

The 2.1.186 bullet touches the **schema** (`tVr`) and the **canonical list** (`zEd`) — i.e. the inputs
to the shadow validator and to the (dead) normalizer. It does **not** touch `UCo`'s accessors. Holding
that distinction is the whole analysis.

### v2.1.88 lineage — the named ancestor proves this is post-88 recognition plumbing

The v2.1.88 named TypeScript tree has the same broad loader shape but lacks the 193 recognition layer:

- `src/utils/frontmatterParser.ts:10-58` defines `FrontmatterData` with explicit keys such as
  `allowed-tools`, `description`, `argument-hint`, `when_to_use`, `user-invocable`, `context`,
  `agent`, `paths`, and `shell`, plus an open `[key: string]: unknown` escape hatch. It does **not**
  declare `displayName`, `defaultEnabled`, `fallback`, or `metadata` as frontmatter fields.
- `src/utils/frontmatterParser.ts:61-64` defines `ParsedMarkdown` as only `{ frontmatter, content }`.
  There is no `parseError` return slot; the parser either fills `frontmatter` or leaves it `{}` and
  still returns the body.
- `src/utils/frontmatterParser.ts:130-133` has the old two-argument signature
  `parseFrontmatter(markdown, sourcePath?)`; `rg normalizeKeys` in that file returns 0. This is a
  useful named ancestor for the 193 vestigial-normalizer finding: 88 had no generic normalization API,
  183/193 have a `{ normalizeKeys: true }` call convention, but 193's parser still ignores it.
- `src/utils/frontmatterParser.ts:153-168` retries YAML after quoting problematic values and then
  logs `Failed to parse YAML frontmatter...` on failure; `src/utils/frontmatterParser.ts:171-174`
  still returns `{ frontmatter, content }`. So 88 already had the "keep the markdown body even when
  YAML is broken" behavior, but not the 193 `parseError` plumbing.
- `src/skills/loadSkillsDir.ts:185-207` returns the parsed skill field shape without `fallback`,
  `declaredFields`, or `parseError`; the live field reader uses `frontmatter.name` for `displayName`
  (`:237-240`), `frontmatter["allowed-tools"]` for tools (`:242-244`), and `frontmatter.when_to_use`
  for activation guidance (`:252`). That matches the 193 conclusion: field consumption is literal,
  not a generic key rewrite.
- `src/skills/loadSkillsDir.ts:447-450` destructures only `{ frontmatter, content: markdownContent }`
  from `parseFrontmatter`, with no `parseError` branch; `rg skill_load_yaml_failed` in the 88 tree
  returns 0.

**What it does:** The 88 lineage bounds the change precisely: 193 did not invent body-preserving YAML
failure handling, and it did not make a long-standing normalizer suddenly live. It added recognition
metadata (`displayName`/`defaultEnabled` in the schema + canonical list) and a diagnostic `parseError`
path on top of the older parser/loader shape.

**Why this matters:** Without the 88 check, the 193 `parseError` and normalizer findings could be
over-attributed. The named ancestor shows the stable baseline: frontmatter was always permissive at
the object level because of `[key: string]: unknown`, but only literal readers consumed values. The
new 193 proof is therefore the schema/telemetry and diagnostics wiring, not a universal spelling
normalization behavior.

---

## 1. The provable net-new: schema recognizes `defaultEnabled`/`displayName`

### What it does

The skill shadow-schema `skillFrontmatterSchema` (obfuscated: `tVr`) is the `.strict()` Zod object the
shadow validator uses to decide which keys are "known" for a skill. In 193 it extends the base command
schema with eight new `@internal` keys, two of which — `defaultEnabled` and `displayName` — are the
camelCase spellings the changelog names.

### How it works

```javascript
// ============================================
// skillFrontmatterSchema - the .strict() shadow schema for SKILL.md; +8 @internal keys in 193
// Location: cli_inner_pretty.js:149302-149345
// ============================================

// ORIGINAL (for source lookup):
tVr = Ce(() =>
  GEd().extend({
    when_to_use: Sx().optional().describe("Guidance for when the model should reach for this skill. ..."),
    paths: RIe().optional().describe("Glob patterns this skill applies to. ..."),
    hooks: A.unknown().optional().describe("Hooks registered while this skill is active. ..."),
    context: A.enum(["inline", "fork"]).nullable().optional().describe("Where the skill runs: ..."),
    agent: Sx().optional().describe("Agent type to spawn when `context: fork`."),
    fallback: urt().optional().describe("@internal — interim defense-in-depth for thin-pointer skill stubs. ..."),
    created_by: Sx().optional().describe("@internal — provenance marker (e.g. dream-proposal)"),
    improved_by: Sx().optional().describe("@internal — provenance marker (e.g. dream-proposal)"),
    mcpServers: A.unknown().optional().describe("@internal"),
    lspServers: A.unknown().optional().describe("@internal"),
    agents: A.unknown().optional().describe("@internal"),
    outputStyles: A.unknown().optional().describe("@internal"),
    themes: A.unknown().optional().describe("@internal"),
    workflows: A.unknown().optional().describe("@internal"),
    channels: A.unknown().optional().describe("@internal"),
    monitors: A.unknown().optional().describe("@internal"),
    settings: A.unknown().optional().describe("@internal"),
    userConfig: A.unknown().optional().describe("@internal"),       // NEW in 193
    defaultEnabled: A.unknown().optional().describe("@internal"),   // NEW in 193  (:149335)
    experimental: A.unknown().optional().describe("@internal"),
    dependencies: A.unknown().optional().describe("@internal"),
    metadata: A.unknown().optional().describe("@internal"),         // carryover (already in 183)
    displayName: A.unknown().optional().describe("@internal"),      // NEW in 193  (:149339)
    author: A.unknown().optional().describe("@internal"),           // NEW in 193
    homepage: A.unknown().optional().describe("@internal"),         // NEW in 193
    repository: A.unknown().optional().describe("@internal"),       // NEW in 193
    license: A.unknown().optional().describe("@internal"),          // NEW in 193
    keywords: A.unknown().optional().describe("@internal"),         // NEW in 193
  }),
);

// READABLE (for understanding):
skillFrontmatterSchema = lazy(() =>
  baseCommandFrontmatterSchema().extend({          // GEd: name/description/model/allowed-tools/...
    when_to_use: optionalScalar(),
    paths: optionalScalarOrStringArray(),
    hooks: anyOptional(),
    context: enumNullableOptional(["inline", "fork"]),
    agent: optionalScalar(),
    fallback: optionalBool(),                       // already present in 183 — carryover
    created_by: optionalScalar(),
    improved_by: optionalScalar(),
    // …the @internal "manifest passthrough" block…
    userConfig: anyOptional(),                      // ← 193
    defaultEnabled: anyOptional(),                  // ← 193 — the changelog's `default-enabled`, camelCase
    experimental: anyOptional(),
    dependencies: anyOptional(),
    metadata: anyOptional(),                        // carryover — the changelog's `metadata.*`
    displayName: anyOptional(),                     // ← 193 — the changelog's `display-name`, camelCase
    author: anyOptional(), homepage: anyOptional(),
    repository: anyOptional(), license: anyOptional(), keywords: anyOptional(),  // ← 193
  }),
);

// Mapping: tVr→skillFrontmatterSchema, GEd→baseCommandFrontmatterSchema, Ce→lazy, A→zodNamespace,
//          Sx/urt→optionalScalar/optionalBool, RIe→optionalScalarOrStringArray
```

### Why this is the realized mechanism (and why only the camelCase spelling)

**What it does:** these schema entries decide whether a key is reported as "unknown" by the shadow
validator `ije`. **How it works:** `ije` parses with `qEd[kind]().strict()` (`:149393` =
`{ skill: tVr().strict(), agent: WEd().strict(), "output-style": VEd().strict() }`) and, for each
`unrecognized_keys` issue, emits `tengu_frontmatter_shadow_unknown_key`. By **adding** `defaultEnabled`
/`displayName` to the schema, a SKILL.md carrying those camelCase keys stops generating that telemetry
— i.e. the schema now *recognizes* them.

```javascript
// ============================================
// shadowValidateFrontmatter - .strict() telemetry-only validator over the parsed frontmatter
// Location: cli_inner_pretty.js:149238-149254
// ============================================

// ORIGINAL (for source lookup):
function ije(e, t) {
  try {
    let n = qEd[e]().safeParse(t);
    if (n.success) return;
    for (let r of n.error.issues)
      if (r.code === "unrecognized_keys") for (let o of r.keys) Yxi("tengu_frontmatter_shadow_unknown_key", e, o);
      else {
        let o = String(r.path[0] ?? "");
        Yxi("tengu_frontmatter_shadow_mismatch", e, `${o}:${r.code}`);
      }
  } catch {}
}

// READABLE (for understanding):
function shadowValidateFrontmatter(kind, parsedFrontmatter) {
  try {
    let result = frontmatterShadowSchemasByKind[kind]().safeParse(parsedFrontmatter);  // qEd
    if (result.success) return;                                  // recognized → no telemetry
    for (let issue of result.error.issues)
      if (issue.code === "unrecognized_keys")
        for (let key of issue.keys)
          recordShadowTelemetryOnce("tengu_frontmatter_shadow_unknown_key", kind, key);   // Yxi
      else
        recordShadowTelemetryOnce("tengu_frontmatter_shadow_mismatch", kind, `${String(issue.path[0] ?? "")}:${issue.code}`);
  } catch {}                                                     // shadow path never throws into the loader
}

// Mapping: ije→shadowValidateFrontmatter, qEd→frontmatterShadowSchemasByKind, Yxi→recordShadowTelemetryOnce,
//          e→kind, t→parsedFrontmatter
```

**Why only camelCase:** the schema lists *literal* spellings — a mix of kebab (`allowed-tools`,
`argument-hint`, `disable-model-invocation`), snake (`when_to_use`, `created_by`), and camel
(`mcpServers`, `userConfig`, `defaultEnabled`, `displayName`). `.strict()` would flag any key not
matching one of those *exact* strings. So the schema additions recognize `defaultEnabled` and
`displayName` **in camelCase**; they do **not** make `default-enabled` or `display-name` (kebab)
recognized — those would still be reported as `unrecognized_keys` unless a normalizer rewrote them
first. That normalizer (§3) is dead. This is the precise seam between "recognition added" (real) and
"all three cases accepted at runtime" (not realized).

**Key insight:** the schema is a *shadow* — it runs in parallel with the real reader purely to feed
telemetry (the `try/catch` swallows everything; `ije` returns `void`). Adding fields to it changes
*what Anthropic measures as an unknown key*, not what the loader does with the value. That is why this
bullet is a **REFINEMENT** at the recognition layer, not a behavior change in the reader.

---

## 2. The canonical-key list also gained the four keys

### What it does

`CANONICAL_FRONTMATTER_KEYS` (obfuscated: `zEd`, `:149406`) is the master list of every canonical
frontmatter key across all kinds. It is the *source* the normalizer map (§3) is built from.

```javascript
// ============================================
// CANONICAL_FRONTMATTER_KEYS - master canonical key list; +displayName/defaultEnabled/fallback/evals
// Location: cli_inner_pretty.js:149406-149464
// ============================================

// ORIGINAL (for source lookup):
zEd = [
  "name","description","model","allowed-tools","argument-hint","arguments","disable-model-invocation",
  "user-invocable","effort","shell","version","when_to_use","paths","hooks","context","agent",
  "created_by","improved_by","mcpServers","lspServers","agents","outputStyles","themes","workflows",
  "channels","monitors","settings","experimental","commands","skills","dependencies","userConfig",
  "metadata","displayName","defaultEnabled","fallback","evals","author","homepage","repository",
  "license","keywords","compatibility","tools","disallowedTools","color","permissionMode","maxTurns",
  "initialPrompt","memory","background","isolation","keep-coding-instructions","force-for-plugin",
  "type","originSessionId","hide-from-slash-command-tool",
];
//                                          ^^^^^^^^^^^ ^^^^^^^^^^^^^^ ^^^^^^^^ ^^^^^  ← the four 2.1.186 additions

// READABLE (for understanding):
CANONICAL_FRONTMATTER_KEYS = [ /* …existing keys… */
  "displayName",     // ← 193 (the `display-name` changelog key, canonical = camelCase)
  "defaultEnabled",  // ← 193 (the `default-enabled` changelog key)
  "fallback",        // ← 193
  "evals",           // ← 193
  /* …existing keys… */
];

// Mapping: zEd→CANONICAL_FRONTMATTER_KEYS
```

### Evidence (NET-NEW vs 183)

| Signature | 183 | 193 |
|-----------|----:|----:|
| `grep -c '"defaultEnabled"'` (canonical-list entry) | 0 | 1 |
| `grep -c 'defaultEnabled: A.unknown'` (schema entry) | 0 | 1 |
| `grep -c 'displayName: A.unknown'` (schema entry) | 0 | 1 |

The 183 canonical list `yJu` (decl `:148571`, list assignment `:148574-148628`) contains none of
`displayName`/`defaultEnabled`/`fallback`/`evals`. So both the schema and the canonical list grew by the
four named keys in 193.

---

## 3. The gotcha: the case-normalizer is built but never read

### What it does (nothing, at runtime)

`CANONICAL_FRONTMATTER_KEYS` exists so a *normalizer* can map any case-variant of a key onto its
canonical spelling. The normalizer collapses `-`/`_` and lowercases; the map keys each canonical name
by its normalized form. **In both 183 and 193 this map is built once and never consulted.**

```javascript
// ============================================
// normalizeFrontmatterKey + normalizedKeyToCanonical - the (dead) case-folding machinery
// Location: cli_inner_pretty.js:149400 (KEd), 149465 (uIh)
// ============================================

// ORIGINAL (for source lookup):
function KEd(e) {
  return e.replace(/[-_]/g, "").toLowerCase();
}
// ...
uIh = new Map(zEd.map((e) => [KEd(e), e]));

// READABLE (for understanding):
function normalizeFrontmatterKey(key) {
  return key.replace(/[-_]/g, "").toLowerCase();   // "display-name" → "displayname", "displayName" → "displayname"
}
// normalizedKeyToCanonical: "displayname" → "displayName", "defaultenabled" → "defaultEnabled", ...
let normalizedKeyToCanonical = new Map(
  CANONICAL_FRONTMATTER_KEYS.map((canonical) => [normalizeFrontmatterKey(canonical), canonical]),
);

// Mapping: KEd→normalizeFrontmatterKey, uIh→normalizedKeyToCanonical, zEd→CANONICAL_FRONTMATTER_KEYS
```

**The map is exactly the data structure that *would* make all three cases interchangeable.** If parse
output were run through it — for each raw key `k`, look up `normalizedKeyToCanonical.get(KEd(k))` and
rename to the canonical — then `display-name`, `display_name`, and `displayName` would all collapse to
`"displayname"` → resolve to `"displayName"`. That is the changelog's described behavior. But:

```
grep -cn 'uIh' cli_inner_pretty.js   → 2     (line 149403 declaration + line 149465 the build)
grep -n  'KEd' cli_inner_pretty.js   → 149400 (def) and 149465 (the build) only*
```

(*the `257055 "KEdgeConnectedComponents"` hits are an unrelated string literal, not the symbol `KEd`.)

So `KEd` is called **only** to build `uIh`, and `uIh` is **never** `.get()`-ed or iterated. The map is
inert. The same is true in 183: `kYA` (`:148629`) has exactly 2 refs and `_Ju` (`:148568`) only builds
it. The normalizer has been vestigial through both builds.

### And the parser ignores `normalizeKeys`

Every skill/plugin caller passes the option `{ normalizeKeys: true }` into `Gm`, which *looks* like it
would trigger the rewrite — but `Gm`'s body never references its 3rd parameter:

```javascript
// ============================================
// parseMarkdownFrontmatter - takes a normalizeKeys arg it never reads; transform is identity
// Location: cli_inner_pretty.js:149511-149532
// ============================================

// ORIGINAL (for source lookup):
function Gm(e, t, n) {                         // n = the { normalizeKeys } options object — UNUSED
  let r = e.match(eye);
  if (!r) return { frontmatter: {}, content: e };
  let o = r[1] || "", s = e.slice(r[0].length), i = (c) => c, a = {}, l;   // i = identity transform
  try { a = i(Xxi(Zhe(o))); }
  catch {
    try { let c = XEd(o).replace(/^\t+/gm, (u) => "  ".repeat(u.length)); a = i(Xxi(Zhe(c))); }
    catch (c) { l = c instanceof Error ? c.message : String(c);
      let u = t ? ` in ${t}` : ""; T(`Failed to parse YAML frontmatter${u}: ${l}`, { level: "warn" }); }
  }
  return { frontmatter: a, content: s, ...(l !== void 0 && { parseError: l }) };
}

// READABLE (for understanding):
function parseMarkdownFrontmatter(rawMarkdown, filePathForLog, _normalizeOptions /* IGNORED */) {
  let m = rawMarkdown.match(FRONTMATTER_REGEX);
  if (!m) return { frontmatter: {}, content: rawMarkdown };
  let yamlText = m[1] || "", body = rawMarkdown.slice(m[0].length);
  let identity = (x) => x;                      // ← would be where a key-rewrite hooks in; it is identity
  let frontmatter = {}, parseErrorMsg;
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
//          XEd→quoteSpecialYaml, T→logWarn, n→_normalizeOptions (UNUSED), i→identity
```

`Gm`'s `i = (c) => c` is the hook point a real implementation would replace with a key-rewriter keyed
off `n.normalizeKeys` and `uIh`. It is the identity function. 183's `CA` is byte-identical here
(`i = (l) => l`). The 11 `{ normalizeKeys: true }` call sites (`:288139`, `:451753`, `:474827`,
`:474990`, `:475023`, `:475105`, `:475291`, `:480453`, `:518252`, `:599002`, `:475155`) all pass an
option that goes nowhere.

### And the reader reads literals (camelCase from `e.name`)

The decisive end-of-line proof is the field reader `UCo` (`:451524`): it never reads `e.displayName`
or `e["display-name"]` — it derives the output `displayName` from `e.name`, and reads `e.fallback`
(camelCase) directly. There is no normalization upstream of it.

```javascript
// ============================================
// parseSkillFrontmatterFields - the REAL reader; literal accessors, no case-folding
// Location: cli_inner_pretty.js:451524-451558 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
function UCo(e, t, n, r = "Skill") {
  // ...
  return {
    displayName: e.name != null ? String(e.name) : void 0,           // ← from e.name, NOT e.displayName
    description: s,
    allowedTools: xJ(e["allowed-tools"]),                            // ← literal kebab
    disallowedTools: xJ(e["disallowed-tools"] ?? e.disallowedTools), // ← kebab OR camel, both literal
    argumentHint: e["argument-hint"] != null ? String(e["argument-hint"]) : void 0,
    whenToUse: e.when_to_use != null ? String(e.when_to_use) : void 0, // ← literal snake
    version: e.version != null ? String(e.version) : void 0,
    disableModelInvocation: drt(e["disable-model-invocation"]),
    declaredFields: Ewn(e),
    fallback: aje(e.fallback),                                       // ← literal camel/word
  };
}

// READABLE (for understanding):
function parseSkillFrontmatterFields(fm, markdownBody, skillName, kindLabel = "Skill") {
  return {
    displayName: fm.name != null ? String(fm.name) : undefined,     // the skill's display name comes from `name`
    allowedTools: parseToolList(fm["allowed-tools"]),
    disallowedTools: parseToolList(fm["disallowed-tools"] ?? fm.disallowedTools),
    whenToUse: fm.when_to_use != null ? String(fm.when_to_use) : undefined,
    disableModelInvocation: parseBooleanFlag(fm["disable-model-invocation"]),
    declaredFields: collectDeclaredFields(fm),                      // Ewn — for the shadow/diagnostics path
    fallback: parseFallbackFlag(fm.fallback),                       // aje
    // …model/effort/shell/agent/context/userInvocable…
  };
}

// Mapping: UCo→parseSkillFrontmatterFields, drt→parseBooleanFlag, aje→parseFallbackFlag,
//          Ewn→collectDeclaredFields, xJ→parseToolList
```

Where *are* `displayName`/`defaultEnabled` consumed? Via camelCase accessors at the **plugin-manifest**
layer (`.defaultEnabled` at `:194604`, `:477822`, `:478030`, `:480087`, `:480180`, `:516386`, …) and
the skill `displayName`-from-`e.name` derivation above — never via the kebab spelling. `grep -c
'display-name'` and `grep -c 'default-enabled'` are **0 in both 183 and 193**.

### Key insight

The 2.1.186 "now accept kebab/snake/camel" is **scaffolded, not switched on**: the canonical list and
the per-canonical normalization map exist (and grew by the four keys), the schema recognizes the
camelCase spellings, and every caller opts in via `normalizeKeys: true`. The single missing wire is the
two-line change in `Gm` that would replace `i = (c) => c` with a `uIh`-driven key-rewriter. Until that
wire exists, the *observable* delta is: (a) the camelCase keys stop tripping shadow telemetry, and
(b) the canonical/map data is ready for a future build to turn on the rewrite. Reporting this honestly
— rather than claiming a live kebab→camel rewrite — is the correct read of this bullet.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | Verdict | Proof |
|------|---------|-------|
| `tVr` gains `defaultEnabled`/`displayName` (+6 `@internal`) | **NET-NEW** | `grep -c 'defaultEnabled: A.unknown'` 0→1, `'displayName: A.unknown'` 0→1; 183 `Q1r`@148478 lacks them |
| `zEd` gains `displayName`/`defaultEnabled`/`fallback`/`evals` | **NET-NEW** | `grep -c '"defaultEnabled"'` 0→1; 183 `yJu` list `:148574-148628` scan shows none |
| `fallback`/`metadata` in skill schema | **CARRYOVER** | already in 183 `Q1r` (`fallback`@148494-ish, `metadata`@148512-ish) |
| `KEd` normalizer | **CARRYOVER + VESTIGIAL** | byte-identical to 183 `_Ju`@148568; only builds the dead map |
| `uIh`/`kYA` normalize-map | **CARRYOVER + VESTIGIAL** | `grep -cn 'uIh'`=2 (193), `'kYA'`=2 (183); never read in either |
| `Gm` ignores `normalizeKeys` | **CARRYOVER** | `i=(c)=>c` identity in both `Gm`@149511 and `CA`@148675 |
| Live kebab→camel read-time rewrite | **ABSENT** | `grep -c 'display-name'`/`'default-enabled'` = 0 in BOTH builds |

**Grep-diff summary (193 vs 183):** `defaultEnabled: A.unknown` 1/0 · `displayName: A.unknown` 1/0 ·
`"defaultEnabled"` 1/0 · `uIh`/`kYA` refs 2/2 (both dead) · `display-name`/`default-enabled` 0/0.

---

## Cross-links

- Sibling 193 docs: [`malformed_yaml_handling.md`](./malformed_yaml_handling.md) (the same `Gm` parser,
  the `parseError` it now returns), [`plugin_installed_skills_section.md`](./plugin_installed_skills_section.md)
  (where `displayName`/usage actually render), [`README.md`](./README.md).
- The shared parser also serves slash-commands/agents/output-styles — see the 193 slash-commands module
  [`../43_slash_commands/`](../43_slash_commands/) and the agent/output-style schemas `WEd`/`VEd`
  (`:149347`/`:149377`) that sit beside `tVr`.
- 183 tree (before-picture / unchanged Skill tool): the reconstructed Skill tool
  [`../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts`](../../../claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/SkillTool.ts).

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc
> uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution (Tools / Skill loader)
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Core features: Skills** (this doc's home)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Prompt/Telemetry — shadow-telemetry tags)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (Plugin manifest readers)
> - [../00_overview/symbol_additions_v2_1_193_skills.md](../00_overview/symbol_additions_v2_1_193_skills.md) — granular v2.1.193 additions

Key functions/constants in this document:

- `skillFrontmatterSchema` (obfuscated: `tVr`, `cli_inner_pretty.js:149302`) — `.strict()` shadow schema; +`defaultEnabled`@149335/`displayName`@149339 + 6 `@internal` in 193. (183 `Q1r`@148478.)
- `baseCommandFrontmatterSchema` (obfuscated: `GEd`, `cli_inner_pretty.js:149265`) — the `.extend()` base.
- `frontmatterShadowSchemasByKind` (obfuscated: `qEd`, `cli_inner_pretty.js:149393`) — `{skill,agent,output-style}` `.strict()`.
- `shadowValidateFrontmatter` (obfuscated: `ije`, `cli_inner_pretty.js:149238`) — telemetry-only validator; emits `tengu_frontmatter_shadow_unknown_key`/`_mismatch`.
- `recordShadowTelemetryOnce` (obfuscated: `Yxi`, `cli_inner_pretty.js:149233`) — per-surface/key dedup emitter.
- `CANONICAL_FRONTMATTER_KEYS` (obfuscated: `zEd`, `cli_inner_pretty.js:149406`) — +4 keys in 193. (183 `yJu` decl `:148571`, list `:148574-148628`.)
- `normalizeFrontmatterKey` (obfuscated: `KEd`, `cli_inner_pretty.js:149400`) — `replace(/[-_]/g,"").toLowerCase()`; only builds the dead map. (183 `_Ju`@148568.)
- `normalizedKeyToCanonical` (obfuscated: `uIh`, `cli_inner_pretty.js:149465`) — Map; **VESTIGIAL** (2 refs). (183 `kYA`@148629.)
- `parseMarkdownFrontmatter` (obfuscated: `Gm`, `cli_inner_pretty.js:149511`) — ignores `normalizeKeys`; identity transform. (183 `CA`@148675.)
- `parseSkillFrontmatterFields` (obfuscated: `UCo`, `cli_inner_pretty.js:451524`) — literal-accessor reader; `displayName: e.name`, `fallback: aje(e.fallback)`.
- `collectDeclaredFields` (obfuscated: `Ewn`, `cli_inner_pretty.js:149585`) — keys + `metadata.*` + `experimental.*`.
- `parseFallbackFlag` (obfuscated: `aje`, `cli_inner_pretty.js:149592`) / `parseBooleanFlag` (obfuscated: `drt`, `cli_inner_pretty.js:149589`) — flag coercers.
- `parseYaml` (obfuscated: `Zhe`, `cli_inner_pretty.js:149467`) / `asPlainObject` (obfuscated: `Xxi`, `cli_inner_pretty.js:149533`) / `quoteSpecialYaml` (obfuscated: `XEd`, `cli_inner_pretty.js:149477`) / `FRONTMATTER_REGEX` (obfuscated: `eye`, `cli_inner_pretty.js:149612`) — parser internals.
