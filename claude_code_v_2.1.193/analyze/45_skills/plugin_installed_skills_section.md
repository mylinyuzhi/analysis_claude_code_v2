# A "Skills" Section in the `/plugin` Installed Tab (v2.1.183 → v2.1.193)

> Type/Version: NET-NEW (UI capability built on partly-carryover data). Changelog 2.1.186: *"Added a
> 'Skills' section to the `/plugin` Installed tab."* TARGET: `cli_inner_pretty.js` @ build `a1938d2a`.
> Before-picture tagged `(183)`.

## TL;DR — a genuinely new UI surface, sharply isolable by one switch case

This is the cleanest of the three Skills bullets. The `/plugin` Installed tab groups installed items by
*scope* (project / local / user / enterprise / managed / built-in). 193 adds a new `"skills"` scope:

- The scope→header label function `pluginScopeSectionLabel` (`OAf`, `:519209`) gains `case "skills":
  return "Skills"` (`:519226`). 183's equivalent `GYp` (`:508267`) has **no** skills case.
- The Installed-tab list-builder gains a full per-skill row collector `In` (`:519545`) that emits
  `{ type:"skill", scope:"skills", override, lockSource, usage, … }` rows.
- The rows are grouped via `Cr.set("skills", In)` (`:519627`) when non-empty and sorted last via
  `skills: 7` (`:519598`).

183 has `Cr.set("skills"` = 0 and `scope: "skills"` = 0 — none of this exists. The override-lock and
usage-badge data (`skillOverrides`/`skillUsage`) **partly pre-existed** (surfaced elsewhere), but the
`/plugin` Installed-tab Skills section is a new render. **High confidence.**

---

## 1. The decisive proof: the scope-label switch gains a `skills` case

### What it does

`pluginScopeSectionLabel` maps an internal scope id to the human header shown above each group in the
Installed tab. Adding a `"skills"` case is the minimal, unambiguous signal that a new section exists.

```javascript
// ============================================
// pluginScopeSectionLabel - scope id → Installed-tab section header; 193 adds the "Skills" case
// Location: cli_inner_pretty.js:519209-519230   (183: GYp @508267-508287)
// ============================================

// ORIGINAL (193):
function OAf(e) {
  switch (e) {
    case "flagged": return "Flagged";
    case "project": return "Project";
    case "local": return "Local";
    case "user": return "User";
    case "enterprise": return "Enterprise";
    case "managed": return "Managed";
    case "builtin":
    case "dynamic": return "Built-in";
    case "skills": return "Skills";        // ← NET-NEW in 193  (:519226)
    default: return e;
  }
}

// READABLE (193):
function pluginScopeSectionLabel(scope) {
  switch (scope) {
    case "flagged":    return "Flagged";
    case "project":    return "Project";
    case "local":      return "Local";
    case "user":       return "User";
    case "enterprise": return "Enterprise";
    case "managed":    return "Managed";
    case "builtin":
    case "dynamic":    return "Built-in";
    case "skills":     return "Skills";    // ← new group header
    default:           return scope;
  }
}

// Mapping: OAf→pluginScopeSectionLabel, e→scope
// 183 GYp @508267: identical switch MINUS the `case "skills"` branch (builtin/dynamic → default)
```

`pluginScopeSectionLabel` is invoked at the section-header render site `OAf(dt.scope)` (`:520939`),
inside the list row that draws a group's title with left padding — so the scope `"skills"` produces a
"Skills" header in the Installed tab exactly like "Project"/"User" do for plugins.

**Why a label switch is the load-bearing diff:** the Installed tab is data-driven — it renders whatever
scope-groups the list-builder produces. A new section requires (a) the builder to emit rows in a new
scope and (b) the label function to know that scope's header. The 183→193 diff on `OAf`/`GYp` is a
single net-new `case`, which is the most compact possible proof that the section is new and not a rename.

---

## 2. The list-builder: a per-skill row collector with override-lock and usage-badge

### What it does

Inside the Installed-tab `useMemo`, 193 adds a block that scans every loaded skill prompt and pushes a
row describing it: its name, description, the *override state* (who, if anyone, has force-disabled it),
and a *usage badge* (how many times / how recently it was used).

### How it works (step-by-step)

```javascript
// ============================================
// Installed-tab skill rows - build per-skill entries with override-lock + usage-badge
// Location: cli_inner_pretty.js:519545-519590
// ============================================

// ORIGINAL (193):
let In = [];
if (a) {
  let Gn = new Set(G.filter((Sr) => Sr.marketplace === wE).map((Sr) => Sr.plugin.name)),
    Mo = Lt().skillUsage ?? {},                                  // usage registry
    so = Date.now(),
    jn = dt.skillOverrides ?? {},                                // user overrides
    ir = _n("policySettings")?.skillOverrides ?? {},             // policy (admin) overrides
    Ht = _n("flagSettings")?.skillOverrides ?? {};               // flag overrides
  for (let Sr of a) {
    if (Sr.type !== "prompt" || (Sr.loadedFrom !== "skills" && Sr.loadedFrom !== "commands_DEPRECATED")) continue;
    let Br = ku(Sr);
    if (Gn.has(Sr.name) || Gn.has(Br)) continue;                 // skip plugin-provided skills (shown elsewhere)
    let pn = ir[Sr.name], Pr = Ht[Sr.name],
      Mn = jn[Sr.name] ?? (Sr.unqualifiedName != null ? jn[Sr.unqualifiedName] : void 0),
      Zn, Fr;
    if (pn) ((Zn = "policy"), (Fr = pn));                        // precedence: policy > flag > author > user
    else if (Pr) ((Zn = "flag"), (Fr = Pr));
    else if (Sr.disableModelInvocation) ((Zn = "author"), (Fr = Mn === "off" ? "off" : "user-invocable-only"));
    else Fr = Mn ?? "on";
    In.push({
      type: "skill", id: `skill:${Sr.source}:${Sr.name}`, cmdName: Sr.name, name: Br,
      description: Sr.description, scope: "skills", source: k3(Sr.source),
      override: Fr, whenToUse: Sr.whenToUse, skillRoot: Sr.skillRoot, allowedTools: Sr.allowedTools,
      lockSource: Zn,                                            // policy | flag | author | undefined
      tokenEstimate: Sf([Sr.name, Sr.description, Sr.whenToUse].filter(Boolean).join(" ")),
      usage: (() => {
        let Xo = Mo[Sr.name] ?? (Sr.unqualifiedName ? Mo[Sr.unqualifiedName] : void 0);
        return Xo ? { count: Xo.usageCount, daysSinceUse: Math.max(0, Math.floor((so - Xo.lastUsedAt) / 86400000)) } : void 0;
      })(),
    });
  }
}

// READABLE (193):
let skillRows = [];
if (loadedPrompts) {
  let pluginSkillNames = new Set(installedPlugins.filter(p => p.marketplace === thisMarketplace).map(p => p.plugin.name));
  let usageByName = getConfig().skillUsage ?? {};
  let now = Date.now();
  let userOverrides   = settings.skillOverrides ?? {};
  let policyOverrides = readSettings("policySettings")?.skillOverrides ?? {};
  let flagOverrides   = readSettings("flagSettings")?.skillOverrides ?? {};
  for (let prompt of loadedPrompts) {
    if (prompt.type !== "prompt" || (prompt.loadedFrom !== "skills" && prompt.loadedFrom !== "commands_DEPRECATED")) continue;
    let qualifiedName = qualifiedSkillName(prompt);
    if (pluginSkillNames.has(prompt.name) || pluginSkillNames.has(qualifiedName)) continue;  // plugin skills live in plugin groups
    // resolve the override + who locked it (precedence: policy > flag > author-default > user)
    let policyVal = policyOverrides[prompt.name], flagVal = flagOverrides[prompt.name];
    let userVal = userOverrides[prompt.name] ?? (prompt.unqualifiedName != null ? userOverrides[prompt.unqualifiedName] : undefined);
    let lockSource, override;
    if (policyVal)                       (lockSource = "policy", override = policyVal);
    else if (flagVal)                    (lockSource = "flag",   override = flagVal);
    else if (prompt.disableModelInvocation) (lockSource = "author", override = userVal === "off" ? "off" : "user-invocable-only");
    else                                 override = userVal ?? "on";
    skillRows.push({
      type: "skill", id: `skill:${prompt.source}:${prompt.name}`, cmdName: prompt.name, name: qualifiedName,
      description: prompt.description, scope: "skills", source: prettifySource(prompt.source),
      override, whenToUse: prompt.whenToUse, skillRoot: prompt.skillRoot, allowedTools: prompt.allowedTools,
      lockSource,
      tokenEstimate: estimateTokens([prompt.name, prompt.description, prompt.whenToUse].filter(Boolean).join(" ")),
      usage: (() => {
        let u = usageByName[prompt.name] ?? (prompt.unqualifiedName ? usageByName[prompt.unqualifiedName] : undefined);
        return u ? { count: u.usageCount, daysSinceUse: Math.max(0, Math.floor((now - u.lastUsedAt) / 86400000)) } : undefined;
      })(),
    });
  }
}

// Mapping: In→skillRows, Lt→getConfig, dt→settings, _n→readSettings, k3→prettifySource, Sf→estimateTokens,
//          ku→qualifiedSkillName, Sr→prompt, Gn→pluginSkillNames, Mo→usageByName, jn/ir/Ht→user/policy/flag overrides,
//          Zn→lockSource, Fr→override
```

**The override precedence (a key decision point).** The order is **policy > flag > author-default >
user**: an admin `policySettings` lock wins over a `flagSettings` lock, which wins over the skill
author's own `disableModelInvocation: true` (rendered as `"off"` or `"user-invocable-only"`), which
wins over the user's own setting (default `"on"`). `lockSource` records *which* layer set it, so the UI
can show a lock icon attributing the disable to policy/flag/author rather than letting the user think
they can toggle it freely. **Why this matters:** a skill disabled by enterprise policy must be visibly
non-overridable; surfacing `lockSource` is what lets the Installed tab grey-out the toggle and explain
why.

**The usage badge.** `usage` is `{ count, daysSinceUse }` derived from the `skillUsage` registry —
`usageCount` and `lastUsedAt` per skill, with `daysSinceUse` floored to whole days. This gives the tab
a "used 12 times, last 3 days ago" badge so users can prune skills they never invoke. `undefined` when
the skill has never been used.

**The plugin-skill exclusion.** Skills that come *from an installed plugin* (`pluginSkillNames`) are
skipped here — they appear under their plugin's own scope group, not the standalone "Skills" group. So
the new section lists **user/project/managed standalone skills**, keeping plugin-bundled skills with
their plugin.

---

## 3. Grouping and sort order

The rows are folded into the section map and given a sort slot so the new group renders **last**:

```javascript
// ============================================
// Installed-tab grouping + sort - register the "skills" group and place it last
// Location: cli_inner_pretty.js:519598 (sort slot), 519627 (group insert)
// ============================================

// ORIGINAL (193):
let vt = { flagged: -1, project: 0, local: 1, user: 2, enterprise: 3, managed: 4, dynamic: 5, builtin: 6, skills: 7 };
// ...
if (In.length > 0) Cr.set("skills", In);     // only add the group when there are standalone skills

// READABLE (193):
let scopeSortOrder = { flagged: -1, project: 0, local: 1, user: 2, enterprise: 3, managed: 4, dynamic: 5, builtin: 6, skills: 7 };
// ...
if (skillRows.length > 0) groupsByScope.set("skills", skillRows);   // skills group is conditional on non-empty

// Mapping: vt→scopeSortOrder, Cr→groupsByScope, In→skillRows
```

**Why sort last (`skills: 7`) and gate on non-empty.** Skills are the least "plugin-like" entry in a
*plugin* tab, so they sort after every real plugin scope. Gating `Cr.set("skills", In)` on
`In.length > 0` means the section header only appears when there is at least one standalone skill — no
empty "Skills" group clutters the tab for users with none. The `skill-detail` nav (`:519427`, `:520044`,
`:520655`) lets a row drill into a per-skill detail view (`{ type:"skill-detail", skill }`), mirroring
the plugin-detail navigation.

**Key insight:** the entire section is *data assembled from existing registries* (`skillOverrides`,
`skillUsage`, the loaded-prompt list) routed into the tab's generic scope-group machinery via one new
scope id (`"skills"`) and one new label case. The new code is a row-builder + a label case + a sort
slot — the rendering machinery is reused wholesale. That is why it is a clean, low-risk net-new surface.

---

## Evidence note (NET-NEW vs CARRYOVER)

| Item | Verdict | Proof |
|------|---------|-------|
| `OAf` `case "skills": return "Skills"` | **NET-NEW** | `:519226`; 183 `GYp`@508267 switch has no skills case |
| `In` skill-row builder | **NET-NEW** | `:519545`/`In.push`@519566; emits `type:"skill"`/`scope:"skills"` |
| `Cr.set("skills", In)` group | **NET-NEW** | `:519627`; `grep -c 'set("skills"'` = **0 in 183** |
| `skills: 7` sort slot | **NET-NEW** | `:519598`; 183 sort map lacks `skills` |
| `scope: "skills"` rows | **NET-NEW** | `grep -c 'scope: "skills"'` = **0 in 183, present in 193** |
| `skillOverrides` registry | **CARRYOVER (re-used, expanded)** | grep -c 11→17 (occ 13→20); pre-existed in 183, surfaced elsewhere |
| `skillUsage` registry | **CARRYOVER (re-used, expanded)** | grep -c 3→5 (occ 4→7); pre-existed in 183 |

> **Drift fix vs scout dossier.** The dossier stated `skillOverrides` 11→**22** and `skillUsage`
> 3→**22**. Re-verified in the live bundles: the actual line-match counts are `skillOverrides` 11→**17**
> and `skillUsage` 3→**5** (occurrence counts 13→20 and 4→7). The direction (pre-existing data re-used
> and expanded for the new tab) is correct, but the magnitudes the dossier cited were inflated. Corrected
> here and in the symbol-additions doc.

---

## Cross-links

- Sibling 193 docs: [`README.md`](./README.md),
  [`frontmatter_case_tolerance.md`](./frontmatter_case_tolerance.md) (where `displayName` originates —
  note the Installed-tab row's `name` is the qualified skill name, not the schema `displayName`),
  [`malformed_yaml_handling.md`](./malformed_yaml_handling.md).
- Disambiguation: other `"Skills"` headers in 193 are unrelated surfaces (`/context`, `/usage` cost
  attribution, `/cost` tree). Only `OAf`@`:519226` / `OAf(dt.scope)`@`:520939` is the `/plugin`
  Installed-tab section.
- 183 tree (plugin-UI before-picture): the 183 scope-label `GYp`@508267 in the same plugin-list module.

## Related Symbols

> Symbol mappings live ONLY in the central index files and the per-feature additions file (this doc
> uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — **Core features: Skills** (this doc's home)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — **Integrations: Plugin UI** (the `/plugin` Installed tab)
> - [../00_overview/symbol_additions_v2_1_193_skills.md](../00_overview/symbol_additions_v2_1_193_skills.md) — granular v2.1.193 additions

Key functions/constants in this document:

- `pluginScopeSectionLabel` (obfuscated: `OAf`, `cli_inner_pretty.js:519209`) — scope→header; +`case
  "skills": return "Skills"` (`:519226`); rendered at `OAf(dt.scope)` (`:520939`). (183 `GYp`@508267.)
- Installed-tab skill-row builder (obfuscated local `In`, `cli_inner_pretty.js:519545`) — `In.push`
  (`:519566`) emits `{type:"skill", scope:"skills", override, lockSource, usage, tokenEstimate,
  whenToUse, skillRoot, allowedTools}`.
- Section grouping/sort (obfuscated locals `Cr`/`vt`, `cli_inner_pretty.js:519627`/`:519598`) —
  `Cr.set("skills", In)` when non-empty; `skills: 7` sort slot.
- `skillOverrides` (config key) — user/policy/flag override layers, read at `:519550-519552`;
  carryover registry expanded for the new tab.
- `skillUsage` (config key) — per-skill `{usageCount, lastUsedAt}`, read at `:519548`; carryover
  registry surfaced as the new usage badge.
