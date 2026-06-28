# Plugin marketplace `renames` auto-follow + `/plugin` housekeeping (v2.1.183 → v2.1.193)

> **Type / version:** NET-NEW subsystem (changelog **2.1.193** — marketplace `renames` auto-follow); plus **2.1.187** `/plugin` surfaces unused plugins (CARRYOVER machinery) and **2.1.186** `/plugin` "more above" indicator (CARRYOVER).
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION 2.1.193, build a1938d2a). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged *(183)*.

---

## TL;DR

This is the richest item in the window. A marketplace manifest can now carry an **append-only `renames` map** (old plugin name → current name, or `null` when removed). When a configured plugin id is no longer found, the loader **follows** that map automatically, validates the resolved id, rewrites the live plugin id, and **migrates the user's settings** (`enabledPlugins` / `pluginConfigs`) to the new name — all behind a cycle-safe resolver capped at 16 hops. Five symbols make it up:

1. the **schema** `renames` (`cli_inner_pretty.js:55667`),
2. the **resolver** `resolvePluginRename` (`s_t`, `:478428`) — cycle/removed/chain-too-deep classification,
3. the **loader follow** in `loadPluginsWithRenameFollow` (`p0o`, `:479482`),
4. the **settings migrator** `migrateRenamedPluginsInSettings` (`NHl`, `:478443`),
5. the **telemetry** `emitPluginRenamedTelemetry` (`k0n`, `:195349`) → `tengu_plugin_renamed`.

Every `renames`-feature string is **absent in 183** (`grep -c "Append-only map of old plugin"` = 0 → 1; `tengu_plugin_renamed` = 0; `plugin_rename_migration` = 0 → 4; `chain-too-deep` = 0 → 1). **NET-NEW, confidence: high.**

The two `/plugin` housekeeping bullets (2.1.187 unused-plugin surfacing, 2.1.186 "more above") are **carryover** — the machinery is present byte-for-byte in 183; only thresholds were inlined and a `renames` exclusion was bolted onto the orphan detector. Documented as such (§4) to prevent false-delta inflation.

---

## 1. The schema: `renames`

**What it does.** Adds an optional, fault-tolerant map field to the marketplace manifest schema describing how plugin names have evolved.

```javascript
// ============================================
// renames - marketplace manifest schema field (append-only old→current name map)
// Location: cli_inner_pretty.js:55667-55672
// ============================================

// ORIGINAL (for source lookup):
renames: A.record(A.string(), A.string().nullable())
  .optional()
  .catch(void 0)
  .describe(
    "Append-only map of old plugin name → current name (or null when removed). The loader follows this on plugin-not-found and migrates user settings to the new name.",
  ),

// READABLE (for understanding):
renames: zod.record(zod.string(), zod.string().nullable())   // { [oldName]: newName | null }
  .optional()
  .catch(undefined)        // malformed renames → undefined, never a parse failure
  .describe("Append-only map of old plugin name → current name (or null when removed). ..."),

// Mapping: A→zod; record key = old name, value = new name (string) or null (removed)
```

**Why `.catch(void 0)`.** A marketplace is third-party data. Making `renames` *fault-tolerant* (a malformed map degrades to `undefined`, never a hard parse error) means a broken `renames` block can never brick plugin loading for the whole marketplace — the worst case is "renames are ignored", which falls through to the existing plugin-not-found path. This is the same defensive posture as the rest of the marketplace schema.

The resolved rename target is validated against the canonical plugin-id schema `PLUGIN_ID_SCHEMA` (`jBe`, `cli_inner_pretty.js:55675`), the `plugin@marketplace` regex `/^[A-Za-z0-9][-A-Za-z0-9._]*@[A-Za-z0-9][-A-Za-z0-9._]*$/`.

---

## 2. The resolver: `resolvePluginRename` (`s_t`) — cycle-safe chain walk

**What it does.** Follows the `renames` map from an old name to its current name, classifying the outcome as `renamed` / `removed` / `unresolved` (with a reason). It is the algorithmic core of the feature.

**How it works (step-by-step).**

```javascript
// ============================================
// resolvePluginRename - follow the renames map; cycle-safe; capped at 16 hops
// Location: cli_inner_pretty.js:478428-478440   (Gdf=16 @478477)
// ============================================

// ORIGINAL (for source lookup):
function s_t(e, t, n) {
  if (!Object.hasOwn(t, e)) return null;
  let r = new Set(), o = e;
  for (let s = 0; s < Gdf; s++) {
    if (r.has(o)) return { kind: "unresolved", reason: "cycle" };
    r.add(o);
    let i = Object.hasOwn(t, o) ? t[o] : void 0;
    if (i === void 0)
      return n.has(o) ? { kind: "renamed", to: o, chainDepth: s } : { kind: "unresolved", reason: "target-missing" };
    if (i === null) return { kind: "removed", chainDepth: s + 1 };
    o = i;
  }
  return { kind: "unresolved", reason: "chain-too-deep" };
}

// READABLE (for understanding):
function resolvePluginRename(oldName, renamesMap, presentPluginNames) {
  if (!Object.hasOwn(renamesMap, oldName)) return null;     // no rename entry at all → not our concern
  let visited = new Set(), cur = oldName;
  for (let depth = 0; depth < MAX_RENAME_CHAIN /*16*/; depth++) {
    if (visited.has(cur)) return { kind: "unresolved", reason: "cycle" };       // A→B→A loop
    visited.add(cur);
    let next = Object.hasOwn(renamesMap, cur) ? renamesMap[cur] : undefined;
    if (next === undefined)                                  // chain ended at a name with no further mapping
      return presentPluginNames.has(cur)
        ? { kind: "renamed", to: cur, chainDepth: depth }    // ...and that name exists now → success
        : { kind: "unresolved", reason: "target-missing" };  // ...but it isn't present → dead end
    if (next === null) return { kind: "removed", chainDepth: depth + 1 };       // explicitly tombstoned
    cur = next;                                              // keep following
  }
  return { kind: "unresolved", reason: "chain-too-deep" };   // ran past 16 hops
}

// Mapping: s_t→resolvePluginRename, Gdf→MAX_RENAME_CHAIN(16), e→oldName, t→renamesMap, n→presentPluginNames
```

Walking the four terminal outcomes:
1. **`renamed`** — the chain ends at a name with no further mapping *and* that name is in `presentPluginNames` (the marketplace's current plugin set). `chainDepth` records how many hops it took.
2. **`removed`** — a hop maps to `null` (an explicit tombstone). The plugin was intentionally deleted; the loader stops following and reports it gone.
3. **`unresolved` / `cycle`** — a name is revisited (`A→B→A`). The visited-set catches it before infinite looping.
4. **`unresolved` / `target-missing`** — the chain ends at a name that has no mapping *and* isn't present (a rename that points nowhere).
5. **`unresolved` / `chain-too-deep`** — more than `MAX_RENAME_CHAIN` (16) hops.

**Why a visited-set AND a hop cap.** They guard different failures. The visited-set catches *true cycles* (`A→B→A`) immediately and reports a precise `cycle` reason. The hop cap (`Gdf = 16`) is the belt-and-braces bound for a *very long but acyclic* chain (16 successive renames is already pathological for an append-only map), returning `chain-too-deep` rather than walking an attacker-supplied 100,000-entry chain. A cycle would be caught by the visited-set first, so the cap is purely the acyclic-but-absurd guard.

**Key insight.** The function returns `null` (not an `unresolved` object) when the old name has *no* rename entry — that is the fast path: a configured plugin that simply isn't in `renames` is not a rename problem at all, and the loader falls straight through to its normal not-found handling without any rewrite. The three "interesting" outcomes (`renamed`/`removed`/`unresolved`) only arise once a `renames` entry actually exists.

---

## 3. The loader follow + settings migration

### 3.1 Loader follow — `loadPluginsWithRenameFollow` (`p0o`)

**What it does.** During plugin loading, for each configured plugin that is **not present** in its marketplace, consults the marketplace's `renames`, resolves via `s_t`, validates the new id against `PLUGIN_ID_SCHEMA`, and rewrites `oldId → newId`. On any unresolved/invalid case it falls through to plugin-not-found with a warning.

```javascript
// ============================================
// loadPluginsWithRenameFollow (excerpt) - resolve + validate + rewrite a renamed plugin id
// Location: cli_inner_pretty.js:479482 (fn), 479507-479540 (the follow loop)
// ============================================

// ORIGINAL (for source lookup):
y = a.flatMap(([S, H]) => {
  let { name: v, marketplace: C } = as(S), x = C ? f.get(C) : null, I = C ? l[C] : void 0;
  if (!v || !C || !x?.renames || H === !1 || (!I && d) || (I && !XH(I.source))) return [[S, H]];
  let k = h.get(C);
  if (!k) ((k = new Set(x.plugins.map((O) => O.name))), h.set(C, k));
  if (k.has(v)) return [[S, H]];                              // still present → nothing to do
  let R = s_t(v, x.renames, k);
  if (R === null) return [[S, H]];
  if (R.kind === "unresolved") {
    if (!t) k0n(v, C, R);
    return (T(`Plugin "${S}" has a renames entry but it does not resolve (${R.reason}); falling through to plugin-not-found`, { level: "warn" }), [[S, H]]);
  }
  let P = R.kind === "renamed" ? `${R.to}@${C}` : null;
  if (P !== null && !jBe().safeParse(P).success) {
    if (!t) k0n(v, C, { kind: "unresolved", reason: "target-missing" });
    return (T(`Plugin "${S}" rename target "${P}" is not a valid PluginIdSchema id; falling through to plugin-not-found`, { level: "warn" }), [[S, H]]);
  }
  if (!t) k0n(v, C, R);
  (m.push({ marketplace: C, oldName: v, oldId: S, newId: P, resolution: R }), /* ...rewrite to [P, H]... */);
});

// READABLE (for understanding):
resolvedEntries = configuredEntries.flatMap(([pluginId, enabled]) => {
  let { name, marketplace } = parsePluginId(pluginId);                          // as()
  let manifest = marketplace ? manifestByMarketplace.get(marketplace) : null;
  // Skip unless this id has a marketplace whose manifest declares renames, and is eligible to follow
  if (!name || !marketplace || !manifest?.renames || enabled === false || /*eligibility*/...) return [[pluginId, enabled]];
  let presentNames = presentNamesByMarketplace.get(marketplace) ?? newSet(manifest.plugins.map(p => p.name));
  if (presentNames.has(name)) return [[pluginId, enabled]];                     // still present → keep as-is
  let resolution = resolvePluginRename(name, manifest.renames, presentNames);   // s_t
  if (resolution === null) return [[pluginId, enabled]];
  if (resolution.kind === "unresolved") {
    if (!preview) emitPluginRenamedTelemetry(name, marketplace, resolution);    // k0n
    warn(`Plugin "${pluginId}" has a renames entry but it does not resolve (${resolution.reason}); falling through to plugin-not-found`);
    return [[pluginId, enabled]];
  }
  let newId = resolution.kind === "renamed" ? `${resolution.to}@${marketplace}` : null;
  if (newId !== null && !PLUGIN_ID_SCHEMA().safeParse(newId).success) {         // jBe — validate before trusting
    if (!preview) emitPluginRenamedTelemetry(name, marketplace, { kind: "unresolved", reason: "target-missing" });
    warn(`Plugin "${pluginId}" rename target "${newId}" is not a valid PluginIdSchema id; falling through to plugin-not-found`);
    return [[pluginId, enabled]];
  }
  if (!preview) emitPluginRenamedTelemetry(name, marketplace, resolution);
  pendingMigrations.push({ marketplace, oldName: name, oldId: pluginId, newId, resolution });   // feeds NHl
  // ...rewrite the live entry to [newId, enabled]...
});

// Mapping: p0o→loadPluginsWithRenameFollow, as→parsePluginId, s_t→resolvePluginRename, k0n→emitPluginRenamedTelemetry,
//          jBe→PLUGIN_ID_SCHEMA, t→preview, S→pluginId, H→enabled, v→name, C→marketplace, m→pendingMigrations
```

**Why validate the resolved id even after `s_t` succeeds.** `s_t` only guarantees the *name* exists in the marketplace's present set; the constructed id `${to}@${marketplace}` must still satisfy the strict `plugin@marketplace` regex (`jBe`). A marketplace name or plugin name containing an illegal character would produce a structurally valid resolution but an *unusable* id. Re-validating with `PLUGIN_ID_SCHEMA` before rewriting is the gate that prevents writing a malformed id into the user's settings — on failure it emits `target-missing` telemetry and falls through cleanly.

### 3.2 Settings migrator — `migrateRenamedPluginsInSettings` (`NHl`)

**What it does.** This is the "updates your settings to the new name" half. Given the `{oldId, newId}` pairs the loader collected, it rewrites the keys of `enabledPlugins` and `pluginConfigs` across every editable settings scope (dropping entries whose `newId` is `null`, i.e. removed), persists, and reports the outcome.

```javascript
// ============================================
// migrateRenamedPluginsInSettings - rewrite enabledPlugins/pluginConfigs keys old→new across scopes
// Location: cli_inner_pretty.js:478443-478474
// ============================================

// ORIGINAL (for source lookup):
function NHl(e) {
  if (e.length === 0) return;
  let t = 0, n = 0, r = new Set(rw());
  for (let o of oO) {
    if (!r.has(o)) continue;
    let s = _n(o), i = s?.enabledPlugins, a = s?.pluginConfigs;
    if (!i && !a) continue;
    let l = {}, c = {};
    for (let { oldId: d, newId: p } of e) {
      if (i && d in i) { if (((l[d] = void 0), p !== null && !(p in i) && !(p in l))) l[p] = i[d]; }
      if (a && d in a) { if (((c[d] = void 0), p !== null && !(p in a) && !(p in c))) c[p] = a[d]; }
    }
    if (Object.keys(l).length === 0 && Object.keys(c).length === 0) continue;
    let { error: u } = co(o, { ...(Object.keys(l).length > 0 && { enabledPlugins: l }), ...(Object.keys(c).length > 0 && { pluginConfigs: c }) });
    if (u) (n++, T(`migrateRenamedPluginsInSettings: failed to update ${o}: ${u.message}`, { level: "warn" }));
    else t++;
  }
  if (t > 0 && n === 0) Ie("plugin_rename_migration");
  else if (t > 0) Ct("plugin_rename_migration", "partial_settings_write");
  else if (n > 0) Re("plugin_rename_migration", "settings_write_failed");
  else Ct("plugin_rename_migration", "no_editable_scope");
}

// READABLE (for understanding):
function migrateRenamedPluginsInSettings(renamePairs) {
  if (renamePairs.length === 0) return;
  let succeeded = 0, failed = 0, editable = new Set(getEditableScopes());     // rw()
  for (let scope of ALL_SETTINGS_SCOPES) {                                    // oO
    if (!editable.has(scope)) continue;
    let settings = readSettings(scope), enabled = settings?.enabledPlugins, configs = settings?.pluginConfigs;
    if (!enabled && !configs) continue;
    let enabledPatch = {}, configsPatch = {};
    for (let { oldId, newId } of renamePairs) {
      if (enabled && oldId in enabled) { enabledPatch[oldId] = undefined;       // drop old key
        if (newId !== null && !(newId in enabled) && !(newId in enabledPatch)) enabledPatch[newId] = enabled[oldId]; }
      if (configs && oldId in configs) { configsPatch[oldId] = undefined;
        if (newId !== null && !(newId in configs) && !(newId in configsPatch)) configsPatch[newId] = configs[oldId]; }
    }
    if (noKeys(enabledPatch) && noKeys(configsPatch)) continue;
    let { error } = writeSettings(scope, { ...(hasKeys(enabledPatch) && { enabledPlugins: enabledPatch }), ...(hasKeys(configsPatch) && { pluginConfigs: configsPatch }) });
    if (error) { failed++; warn(`migrateRenamedPluginsInSettings: failed to update ${scope}: ${error.message}`); }
    else succeeded++;
  }
  if (succeeded > 0 && failed === 0) reportSuccess("plugin_rename_migration");
  else if (succeeded > 0) reportPartial("plugin_rename_migration", "partial_settings_write");
  else if (failed > 0) reportFailure("plugin_rename_migration", "settings_write_failed");
  else reportPartial("plugin_rename_migration", "no_editable_scope");
}

// Mapping: NHl→migrateRenamedPluginsInSettings, rw→getEditableScopes, oO→ALL_SETTINGS_SCOPES, _n→readSettings,
//          co→writeSettings, e→renamePairs, d→oldId, p→newId
```

**Why a per-key patch with `undefined` deletes (not a wholesale rewrite).** The patch carries `oldKey: undefined` to delete the stale key and `newKey: value` to add the migrated one — applied as a merge, so settings the user authored that are *not* renames are untouched. The `newId !== null` guard means a *removed* plugin (`renamed→removed`) drops its config entirely. The `!(newId in enabled)` guard avoids clobbering a new-name entry the user already has (idempotent: re-running the migration is a no-op). The four outcome reports (`success`/`partial_settings_write`/`settings_write_failed`/`no_editable_scope`) give telemetry a precise picture of whether the auto-migration actually landed.

### 3.3 Telemetry — `emitPluginRenamedTelemetry` (`k0n`)

```javascript
// ============================================
// emitPluginRenamedTelemetry - tengu_plugin_renamed {outcome, chain_depth, reason}
// Location: cli_inner_pretty.js:195349-195356
// ============================================

// ORIGINAL (for source lookup):
function k0n(e, t, n) {
  V("tengu_plugin_renamed", {
    outcome: $e(n.kind),
    chain_depth: n.kind === "unresolved" ? void 0 : n.chainDepth,
    reason: n.kind === "unresolved" ? $e(n.reason) : void 0,
    ...T9(e, t),
  });
}

// READABLE (for understanding):
function emitPluginRenamedTelemetry(pluginName, marketplace, resolution) {
  recordEvent("tengu_plugin_renamed", {
    outcome: redact(resolution.kind),                                          // renamed/removed/unresolved
    chain_depth: resolution.kind === "unresolved" ? undefined : resolution.chainDepth,
    reason: resolution.kind === "unresolved" ? redact(resolution.reason) : undefined,  // cycle/target-missing/chain-too-deep
    ...pluginIdentity(pluginName, marketplace),                                // T9
  });
}

// Mapping: k0n→emitPluginRenamedTelemetry, V→recordEvent, $e→redact, T9→pluginIdentity, n→resolution
```

The `outcome`/`chain_depth`/`reason` triple lets the fleet observe how often renames fire, how long the chains are, and how often they fail — exactly the information needed to decide whether an append-only `renames` map is being kept clean by marketplace authors.

---

## 4. `/plugin` housekeeping bullets — CARRYOVER (with grep evidence)

### 4a. `/plugin` surfaces plugins you haven't used recently (2.1.187) — CARRYOVER

The unused-plugin surfacing has two halves, both present in 183:

**Staleness sweep.** `getPluginStaleness` (`G1t`, `cli_inner_pretty.js:195014`) returns `{ sessionsSinceLastUse, daysSinceLastUse }`; the sweep pushes a plugin onto the "unused" list when both exceed thresholds (`cli_inner_pretty.js:518409-518412`). `grep -c daysSinceLastUse` = **8 in both** 183 and 193 — the tracking machinery is byte-identical. The only 193 change is cosmetic: 183 passed the thresholds in via a param object (`if (d >= e.days && u >= e.sessions)`, 183 `:507691`); 193 inlined them as constants `PLUGIN_STALE_DAYS = 14` (`wAf`, `:518436`) and `PLUGIN_STALE_SESSIONS = 10` (`CAf`, `:518437`). **Verdict: CARRYOVER mechanism; thresholds inlined to 14 days / 10 sessions. The 2.1.187 user-facing change is a UI surfacing on top of pre-existing tracking, not isolable as new source here.**

**Orphan detector.** A configured plugin whose id is no longer present in its marketplace is flagged as orphaned by `findOrphanedConfiguredPlugins` (`S9f`, `cli_inner_pretty.js:612532`). This function **already existed in 183** as `lTf` (`:600380`); the bodies are identical except for the single net-new line that excludes a just-renamed plugin from the orphan list:

```javascript
// ============================================
// findOrphanedConfiguredPlugins - configured-but-absent plugin ids; 193 adds the renames exclusion
// Location: cli_inner_pretty.js:612532-612543   (183: lTf @600380, no renames arg)
// ============================================

// ORIGINAL (193, for source lookup):
function S9f(e, t, n) {
  let r = new Set(t.plugins.map((i) => i.name)), o = `@${n}`, s = [];
  for (let i of Object.keys(e.plugins)) {
    if (!i.endsWith(o)) continue;
    let a = i.slice(0, -o.length),
      l = t.renames && s_t(a, t.renames, r)?.kind === "renamed";   // <-- NET-NEW: don't flag a just-renamed plugin
    if (!r.has(a) && !l) s.push(i);
  }
  return s;
}

// READABLE (for understanding):
function findOrphanedConfiguredPlugins(settings, marketplace, marketplaceName) {
  let presentNames = new Set(marketplace.plugins.map(p => p.name)), suffix = `@${marketplaceName}`, orphans = [];
  for (let id of Object.keys(settings.plugins)) {
    if (!id.endsWith(suffix)) continue;
    let name = id.slice(0, -suffix.length);
    let isJustRenamed = marketplace.renames && resolvePluginRename(name, marketplace.renames, presentNames)?.kind === "renamed";
    if (!presentNames.has(name) && !isJustRenamed) orphans.push(id);   // absent AND not just-renamed → orphan
  }
  return orphans;
}

// Mapping: S9f→findOrphanedConfiguredPlugins, s_t→resolvePluginRename, e→settings, t→marketplace, n→marketplaceName
//          183 lTf @600380 is byte-identical MINUS the `l = ... renames ...` line and the `&& !l`
```

So the orphan detector is **CARRYOVER**; the `renames` exclusion is a small REFINEMENT that ties the (carryover) unused-plugin surfacing to the (net-new) rename feature — without it, a plugin that was *renamed* would be mis-reported as orphaned the moment its old id disappeared from the marketplace.

### 4b. `/plugin` Installed "more above" indicator (2.1.186) — CARRYOVER / UI-only

`grep -c "more above"` = **9 in both** 183 and 193. The shared windowed-list helper `computeListWindow` (`tKt`, `cli_inner_pretty.js:517883`) returns `moreAbove: windowStart` (the return is at `:517886`), and the list renders the chevron only when `moreAbove > 0` (`cli_inner_pretty.js:517998`). The same component drives the `/plugin` list, the settings list, and others in both bundles. The 183 render uses the identical `count > 0` guard (e.g. 183 `:484011`, `:500892`). **No isolable 193 code-delta** — the 2.1.186 fix is not separable from the unchanged windowed-list component by grep. **Verdict: CARRYOVER / UI-only, medium confidence.**

---

## Evidence note (NET-NEW vs CARRYOVER)

| Token | 183 | 193 | Verdict |
|-------|-----|-----|---------|
| `"Append-only map of old plugin"` | 0 | 1 | NET-NEW schema |
| `tengu_plugin_renamed` | 0 | 1+ | NET-NEW telemetry |
| `plugin_rename_migration` | 0 | 4 | NET-NEW migrator outcomes |
| `chain-too-deep` | 0 | 1 | NET-NEW resolver |
| `daysSinceLastUse` | 8 | 8 | CARRYOVER (staleness sweep) |
| `"more above"` | 9 | 9 | CARRYOVER (windowed-list) |
| orphan detector body | `lTf` @600380 | `S9f` @612532 | CARRYOVER + `renames` exclusion (REFINEMENT) |

All 193 lines re-read in the live bundle. Drift fixed vs the scout dossier: `migrateRenamedPluginsInSettings` (`NHl`) is at **478443** (dossier said 478442); `getPluginStaleness` (`G1t`) is at **195014** (dossier said 195011); the loader-follow lives inside `loadPluginsWithRenameFollow` (`p0o`) whose function declaration is at **479482** (dossier cited the follow-loop line 479511).

---

## Cross-links

- Sibling 193 docs: [README.md](./README.md), [rewind_before_clear.md](./rewind_before_clear.md), [hook_matcher_comma_fix.md](./hook_matcher_comma_fix.md), [cli_input_and_review_misc.md](./cli_input_and_review_misc.md).
- Plugin system baseline (marketplace schema, plugin loading, `enabledPlugins`/`pluginConfigs`): see the v2.1.183 integration tree and the plugin/marketplace docs referenced from [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md).

---

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (settings persistence, telemetry)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations (**Plugins / Marketplace**)
> - per-feature additions: [symbol_additions_v2_1_193_slash_commands.md](../00_overview/symbol_additions_v2_1_193_slash_commands.md)

Key functions/constants in this document:

- `renames` schema field (`cli_inner_pretty.js:55667`) — append-only old→current name map; `.catch(void 0)` fault-tolerant.
- `resolvePluginRename` (obf `s_t`, `cli_inner_pretty.js:478428`) — cycle-safe chain walk → `renamed`/`removed`/`unresolved`; cap `MAX_RENAME_CHAIN` (obf `Gdf`, `:478477`) = 16.
- `loadPluginsWithRenameFollow` (obf `p0o`, `cli_inner_pretty.js:479482`) — loader follow + validate + rewrite (loop `:479507-479540`).
- `migrateRenamedPluginsInSettings` (obf `NHl`, `cli_inner_pretty.js:478443`) — rewrites `enabledPlugins`/`pluginConfigs` keys across editable scopes.
- `emitPluginRenamedTelemetry` (obf `k0n`, `cli_inner_pretty.js:195349`) — `tengu_plugin_renamed {outcome, chain_depth, reason}`.
- `PLUGIN_ID_SCHEMA` (obf `jBe`, `cli_inner_pretty.js:55675`) — `plugin@marketplace` regex validator.
- `findOrphanedConfiguredPlugins` (obf `S9f`, `cli_inner_pretty.js:612532`; 183 `lTf` `:600380`) — CARRYOVER + `renames` exclusion.
- `getPluginStaleness` (obf `G1t`, `cli_inner_pretty.js:195014`) — CARRYOVER; thresholds `PLUGIN_STALE_DAYS` (`wAf`, `:518436`) = 14, `PLUGIN_STALE_SESSIONS` (`CAf`, `:518437`) = 10.
- `computeListWindow` (obf `tKt`, `cli_inner_pretty.js:517883`) — CARRYOVER windowed-list helper; `moreAbove: windowStart` returned at `:517886`; chevron guard at `:517998`.
