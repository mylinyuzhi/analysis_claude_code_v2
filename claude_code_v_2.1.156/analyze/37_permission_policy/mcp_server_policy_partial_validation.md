# Managed MCP Policy - Per-Entry Validation of allowed/deniedMcpServers with doctor Warnings (2.1.156)

## Related Symbols

> Symbol mappings:
> - [`symbol_index_core_execution.md`](../00_overview/symbol_index_core_execution.md) — Core execution
> - [`symbol_index_core_features.md`](../00_overview/symbol_index_core_features.md) — Core features
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Platform infra (permissions, MCP policy, settings)
> - [`symbol_index_infra_integration.md`](../00_overview/symbol_index_infra_integration.md) — Integrations

Key functions/symbols in this document:
- `validateMcpServerPolicyEntries` (`V71`) — the NEW per-entry validator that filters invalid `allowedMcpServers`/`deniedMcpServers` entries before whole-settings schema validation (cli_inner_pretty.js:52367-52402)
- `mcpServerPolicyKeys` (`T71`) — the `[{key, schema}]` table driving `V71`: `allowedMcpServers→fo8`, `deniedMcpServers→Oo8` (cli_inner_pretty.js:52417-52420)
- `collectSettingsWarnings` (`kb`) — the aggregator that concatenates the permission, hooks, and MCP sanitizer warnings (cli_inner_pretty.js:52403-52405)
- `filterInvalidPermissionRules` (`W71`) — the permission allow/deny/ask sanitizer (precursor pattern, exists since 2.1.88) (cli_inner_pretty.js:52284-52315)
- `filterInvalidHooks` (`G71`) — the hooks sanitizer (added in the 2.1.142 window) (cli_inner_pretty.js:52316-52366)
- `describeJsonType` (`kBH`) — `null`/`undefined`/`array`/`typeof` describer used in the non-array warning message (cli_inner_pretty.js:52211-52216)
- `mcpAllowEntrySchema` (`fo8`) — lazily-built Zod schema for one `allowedMcpServers` entry (exactly one of serverName/serverCommand/serverUrl) (cli_inner_pretty.js:52016-52042)
- `mcpDenyEntrySchema` (`Oo8`) — lazily-built Zod schema for one `deniedMcpServers` entry (cli_inner_pretty.js:52043-52069)
- `validateRemoteManagedSettings` (`KS7`) — runs `kb` against remote managed settings, the `claude doctor` path (cli_inner_pretty.js:53445-53449)
- `loadManagedSettingsString` (`Lo8`) — runs `kb` then whole-settings `safeParse` over an MDM/registry settings string (cli_inner_pretty.js:52501-52511)
- `loadRemoteManagedSettings` (`t_$`) — `kb` + `safeParse` over remote managed settings, returns `{settings, errors}` (cli_inner_pretty.js:52983-52991)
- `loadParentManagedSettings` (`e_$`) — `kb` + `safeParse` over SDK parent managed settings (cli_inner_pretty.js:52992-52999)
- `getSettingsWithErrors` (`GB`) — top-level settings loader whose `errors` array carries the warnings to the UI (cli_inner_pretty.js:53394-53400)
- `getPolicySettingsLoadErrors` (`aF$`) — aggregates load errors across policy tiers for diagnostics (cli_inner_pretty.js:53449-53451)
- `isNonWarningSeverity` (`cuz`) — `severity !== "warning"` predicate that decides Settings *Error* vs Settings *Warning* in the dialog (cli_inner_pretty.js:634318-634320)
- `InvalidSettingsDialog` (`duz`) — the startup dialog that surfaces these warnings (continue / fix / exit) (cli_inner_pretty.js:634254-634294)
- `isMcpServerDenied` (`NN7`) — denylist matcher; consulted first so deny precedes allow (cli_inner_pretty.js:275185-275200)
- `isMcpServerAllowed` (`wJH`) — allowlist matcher; returns false up-front if denied (cli_inner_pretty.js:275201-275234)

Precursors (cross-validation, separate builds):
- `filterInvalidPermissionRules` (2.1.88 `src/utils/settings/validation.ts:224-265`) — the only "filter-before-schema" sanitizer in 2.1.88; **no** hooks or MCP equivalent existed.
- 2.1.142 bundle: permission sanitizer (`Non-string value in … array was removed` at 2.1.142 cli_inner_pretty.js:51314) and hooks sanitizer (`This field was ignored` at 2.1.142 cli_inner_pretty.js:51343) exist, but there is **no** `Invalid entry was ignored` string and **no** per-entry MCP validator — `allowedMcpServers`/`deniedMcpServers` were validated whole by the top-level `SettingsSchema().safeParse`.

---

## TL;DR

In 2.1.156, a single malformed entry in a managed-settings `allowedMcpServers` or `deniedMcpServers` array no longer poisons the **entire managed-settings policy**.

Before the fix, those two arrays were validated only as part of the whole-settings Zod `safeParse`. Zod's array schema is all-or-nothing: if `allowedMcpServers[3]` failed validation (e.g. an admin typo'd `serverNme` instead of `serverName`, or put two of `serverName`/`serverCommand`/`serverUrl` on one entry), the `safeParse` of the whole settings object rejected — and the loader returned `{settings: {}, …}` (or `null`). That meant **all** managed policy in that file — allowlist, denylist, permission rules, hooks, sandbox config — was silently discarded. For an enterprise admin this is a worst-case failure mode: a one-character typo turns "lock everything down" into "no policy at all."

The fix adds a dedicated per-entry pre-validator, `validateMcpServerPolicyEntries` (`V71`, cli_inner_pretty.js:52367), that runs **before** the whole-settings `safeParse`. For each key in `mcpServerPolicyKeys` (`T71`, cli_inner_pretty.js:52417 — `allowedMcpServers→fo8`, `deniedMcpServers→Oo8`) it iterates the array, `safeParse`s **each entry** with that entry's schema, keeps the valid ones, and emits a per-entry **warning** (`severity:"warning"`, path `key[index]`, message `Invalid entry was ignored: …`) for each invalid one. It writes the filtered array back in place (cli_inner_pretty.js:52399), so the subsequent whole-settings `safeParse` sees only valid entries and the rest of the policy survives. The warning rides the `errors` array up to the UI and is surfaced via `claude doctor` / the startup `InvalidSettingsDialog` as a *Settings Warning* (non-blocking), not a *Settings Error*.

Upstream changelog (2.1.156):
> Fixed a single invalid `allowedMcpServers`/`deniedMcpServers` entry in managed settings discarding all managed-settings policy; the bad entry is now dropped with a `claude doctor` warning.

Confidence: **high.** The per-entry `safeParse` (cli_inner_pretty.js:52388), the keep-valid push (52389), the per-entry warning with the literal string `Invalid entry was ignored` (52394), and the write-back (52399) are all explicit in the 2.1.156 bundle. The 2.1.142 bundle has no such validator (verified by grep — no `Invalid entry was ignored`, no `{key:"allowedMcpServers", schema:…}` table), and 2.1.88's `validation.ts` exports only the permission-rule sanitizer.

---

## 1. The two managed-MCP policy lists

`allowedMcpServers` and `deniedMcpServers` are enterprise policy fields read from managed settings (`managed-settings.json`, the `managed-settings.d/` drop-ins, the Windows HKLM/HKCU registry, the SDK parent tier, and the remote managed-settings endpoint). Their schema declarations sit in the settings object at cli_inner_pretty.js:51419-51430:

```javascript
// ============================================
// allowedMcpServers / deniedMcpServers schema fields - enterprise MCP allow/deny lists
// Location: cli_inner_pretty.js:51419-51430
// ============================================

// ORIGINAL (for source lookup):
allowedMcpServers: y
  .array(fo8())
  .optional()
  .describe(
    "Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied.",
  ),
deniedMcpServers: y
  .array(Oo8())
  .optional()
  .describe(
    "Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied.",
  ),

// READABLE (for understanding):
allowedMcpServers: zod
  .array(mcpAllowEntrySchema())     // fo8: one of serverName/serverCommand/serverUrl
  .optional()
  .describe("Enterprise allowlist… If undefined → all allowed; [] → none allowed; denylist wins."),
deniedMcpServers: zod
  .array(mcpDenyEntrySchema())      // Oo8: one of serverName/serverCommand/serverUrl
  .optional()
  .describe("Enterprise denylist… denylist takes precedence over allowlist."),

// Mapping: y→zod, fo8→mcpAllowEntrySchema, Oo8→mcpDenyEntrySchema
```

The semantics encoded in those descriptions matter for understanding why the old failure was so bad:

- `undefined` allowlist ⇒ **all** servers allowed.
- `[]` (empty array) allowlist ⇒ **no** servers allowed (hard lockdown).
- denylist always takes precedence over allowlist.

So the two endpoints of the spectrum — "no restrictions" (`undefined`) and "deny everything" (`[]`) — are encoded by the *shape* of the value. When the old whole-array parse failed and the loader dropped the entire settings object, `allowedMcpServers` reverted from whatever the admin wrote to **`undefined`** — i.e. from a restrictive allowlist back to **"all servers allowed."** A typo didn't just lose one entry; it flipped the policy from closed to open.

### 1.1 Per-entry schema shape (`fo8` / `Oo8`)

Each entry in either list is one of three mutually-exclusive match forms — by server name, by exact stdio command array, or by URL pattern. The allow-entry schema is `mcpAllowEntrySchema` (`fo8`, cli_inner_pretty.js:52016):

```javascript
// ============================================
// mcpAllowEntrySchema - schema for one allowedMcpServers entry (exactly one matcher)
// Location: cli_inner_pretty.js:52016-52042
// ============================================

// ORIGINAL (for source lookup):
(fo8 = yH(() =>
  y
    .object({
      serverName: y.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
      serverCommand: y.array(y.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers"),
      serverUrl: y.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for allowed remote MCP servers'),
    })
    .refine(
      (H) => { return H6([H.serverName !== void 0, H.serverCommand !== void 0, H.serverUrl !== void 0], Boolean) === 1; },
      { message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"' },
    ),
));

// READABLE (for understanding):
mcpAllowEntrySchema = lazySchema(() =>
  zod.object({
    serverName:    zod.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional(),
    serverCommand: zod.array(zod.string()).min(1, "Server command must have at least one element (the command)").optional(),
    serverUrl:     zod.string().optional(),  // "https://*.example.com/*"
  }).refine(
    (entry) => countTruthy([entry.serverName !== undefined, entry.serverCommand !== undefined, entry.serverUrl !== undefined]) === 1,
    { message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"' },
  ));

// Mapping: fo8→mcpAllowEntrySchema, yH→lazySchema, y→zod, H6(…,Boolean)→countTruthy, H→entry
```

`mcpDenyEntrySchema` (`Oo8`, cli_inner_pretty.js:52043-52069) is byte-for-byte the same shape, only the `.describe()` strings change from "allowed" to "blocked." Both are wrapped in `yH(() => …)` (`lazySchema`) — a deferred/lazy Zod builder — because the settings schema is large and these refinements only need to be constructed when actually validating.

The `.refine(... === 1)` is the most common source of a "single bad entry": an admin who writes both a `serverName` and a `serverUrl` on one object (thinking it's an AND) produces an entry that fails the refinement. Under the old whole-array parse, that one over-specified entry killed the entire managed policy.

### 1.2 `allowManagedMcpServersOnly` merge note

The allowlist has special merge semantics, documented on the `allowManagedMcpServersOnly` field (cli_inner_pretty.js:51526):

```javascript
// ORIGINAL (for source lookup):  cli_inner_pretty.js:51522-51527
allowManagedMcpServersOnly: y.boolean().optional().describe(
  "When true (and set in managed settings), allowedMcpServers is only read from managed settings. deniedMcpServers still merges from all sources, so users can deny servers for themselves. Users can still add their own MCP servers, but only the admin-defined allowlist applies.",
),
```

The merge itself is in the managed-settings combiner: `allowedMcpServers` is taken from the **first** tier that defines it (`M.find((J) => J.allowedMcpServers !== void 0)?.allowedMcpServers`, cli_inner_pretty.js:53150) — i.e. allowlist is *replace*, not concat — whereas `deniedMcpServers` is copied through whenever present (`if (H.deniedMcpServers) q.deniedMcpServers = H.deniedMcpServers`, cli_inner_pretty.js:53084). This asymmetry is why the description says the allowlist is admin-exclusive while the denylist merges across sources: a user can always *add* denials for themselves, but only the admin's allowlist is authoritative.

This is exactly why per-entry resilience matters for the *allowlist* in particular: because allowlist is "first tier that defines it," a single broken entry in the admin tier doesn't just lose that entry — under the old code it lost the entire admin allowlist, and the field reverted to `undefined` = "all allowed," defeating the lockdown.

---

## 2. The fix — `validateMcpServerPolicyEntries` (`V71`)

### 2.1 The key/schema table (`T71`)

`V71` is data-driven by a small table that pairs each policy key with the schema used to validate one of its entries (cli_inner_pretty.js:52417-52420):

```javascript
// ============================================
// mcpServerPolicyKeys - drives V71: which keys to per-entry-validate and with what schema
// Location: cli_inner_pretty.js:52417-52420
// ============================================

// ORIGINAL (for source lookup):
T71 = [
  { key: "allowedMcpServers", schema: fo8 },
  { key: "deniedMcpServers", schema: Oo8 },
];

// READABLE (for understanding):
mcpServerPolicyKeys = [
  { key: "allowedMcpServers", schema: mcpAllowEntrySchema },
  { key: "deniedMcpServers",  schema: mcpDenyEntrySchema },
];

// Mapping: T71→mcpServerPolicyKeys, fo8→mcpAllowEntrySchema, Oo8→mcpDenyEntrySchema
```

Note that `schema` here is the *lazy builder function* (`fo8`/`Oo8`), not the built schema — `V71` calls `z()` to materialize it (see below). Driving the loop from a table makes adding a third per-entry-validated list a one-line change.

### 2.2 The validator body

```javascript
// ============================================
// validateMcpServerPolicyEntries - per-entry pre-validation of allowed/deniedMcpServers, in-place filter
// Location: cli_inner_pretty.js:52367-52402
// ============================================

// ORIGINAL (for source lookup):
function V71(H, $) {
  if (!H || typeof H !== "object") return [];
  let q = H, K = [];
  for (let { key: _, schema: z } of T71) {
    if (!(_ in q)) continue;
    if (!Array.isArray(q[_])) {
      let f = q[_];
      (delete q[_],
        K.push({ file: $, path: _, message: `"${_}" must be an array; received ${kBH(f)}. This field was ignored.`, severity: "warning", invalidValue: f }));
      continue;
    }
    let A = q[_], Y = [];
    for (let f = 0; f < A.length; f++) {
      let O = z().safeParse(A[f]);
      if (O.success) Y.push(A[f]);
      else
        K.push({ file: $, path: `${_}[${f}]`, message: `Invalid entry was ignored: ${O.error.issues[0]?.message ?? "failed validation"}`, severity: "warning", invalidValue: A[f] });
    }
    if (Y.length < A.length) q[_] = Y;
  }
  return K;
}

// READABLE (for understanding):
function validateMcpServerPolicyEntries(rawSettings, filePath) {
  if (!rawSettings || typeof rawSettings !== "object") return [];
  let settings = rawSettings, warnings = [];
  for (let { key, schema: lazyEntrySchema } of mcpServerPolicyKeys) {
    if (!(key in settings)) continue;

    // Guard: the field exists but isn't an array → drop it whole with a typed warning.
    if (!Array.isArray(settings[key])) {
      let badValue = settings[key];
      delete settings[key];
      warnings.push({
        file: filePath,
        path: key,
        message: `"${key}" must be an array; received ${describeJsonType(badValue)}. This field was ignored.`,
        severity: "warning",
        invalidValue: badValue,
      });
      continue;
    }

    // Per-entry validation: keep the valid ones, warn on each invalid one.
    let arr = settings[key], kept = [];
    for (let i = 0; i < arr.length; i++) {
      let result = lazyEntrySchema().safeParse(arr[i]);   // materialize schema, validate THIS entry
      if (result.success) kept.push(arr[i]);
      else
        warnings.push({
          file: filePath,
          path: `${key}[${i}]`,
          message: `Invalid entry was ignored: ${result.error.issues[0]?.message ?? "failed validation"}`,
          severity: "warning",
          invalidValue: arr[i],
        });
    }

    // Write back ONLY if something was dropped (avoids needless mutation/identity churn).
    if (kept.length < arr.length) settings[key] = kept;
  }
  return warnings;
}

// Mapping: V71→validateMcpServerPolicyEntries, H→rawSettings, $→filePath, q→settings, K→warnings,
//          _→key, z→lazyEntrySchema, A→arr, Y→kept, O→result, kBH→describeJsonType
```

### 2.3 Step-by-step

**What it does:** Sanitizes the two MCP policy arrays *in place* before the whole-settings schema sees them, collecting a warning per dropped value, so that one bad entry never costs more than itself.

**How it works:**

1. **Object guard (cli_inner_pretty.js:52368).** If the raw settings aren't an object, return no warnings — nothing to sanitize. (The caller's whole-settings `safeParse` will produce the real error.)

2. **Iterate the policy table (52371).** For each `{key, schema}` in `T71`, skip the key entirely if it isn't present (`if (!(_ in q)) continue`, 52372) — absence is legal (means "no restriction").

3. **Non-array guard (52373-52383).** If the field exists but is *not* an array (e.g. an admin wrote `"allowedMcpServers": "server-a"` as a bare string), `delete` the key outright and push one warning whose message names the actual JSON type via `describeJsonType` (`kBH`) — e.g. `"allowedMcpServers" must be an array; received string. This field was ignored.` Then `continue` to the next key. Deleting (rather than nulling) is important: it means the subsequent whole-settings `safeParse` sees the field as *absent* (= "all allowed" / "no denial"), which `.optional()` accepts, rather than a wrong-typed value that would still fail.

4. **Per-entry loop (52387-52398).** For an array, walk it index by index. For each element, materialize the lazy schema with `z()` and `safeParse(A[f])` the **single** element (52388):
   - On success, push the element into `kept` (`Y.push(A[f])`, 52389).
   - On failure, push a warning into `K` (52391-52397) with:
     - `path: \`${_}[${f}]\`` — e.g. `allowedMcpServers[3]`, pinpointing the offender by index.
     - `message: \`Invalid entry was ignored: ${O.error.issues[0]?.message ?? "failed validation"}\`` — surfaces Zod's first issue message (e.g. the refinement's `Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"`), falling back to a generic string if Zod gave no issue.
     - `severity: "warning"` — the load-bearing field that keeps this non-fatal (see §4).
     - `invalidValue: A[f]` — the raw bad entry, for display.

5. **Conditional write-back (52399).** `if (Y.length < A.length) q[_] = Y` — only replace the array when at least one entry was dropped. If everything was valid, the original array object is left untouched (no identity change, no wasted allocation). This in-place mutation is the mechanism by which the *later* whole-settings `safeParse` sees only valid entries.

6. **Return the warnings (52401).** The collected warnings flow up to the aggregator.

**Edge cases handled:**
- Empty array `[]` ⇒ loop runs zero times, `kept` is empty, `kept.length (0) < arr.length (0)` is false, so no write-back and no warning — `[]` (= "deny all") is preserved exactly.
- All-invalid array ⇒ `kept` is empty, write-back sets `q[key] = []`. Note this **changes the meaning** for the allowlist: an allowlist where *every* entry was malformed collapses to `[]` = "no servers allowed" (fail-closed), not `undefined` = "all allowed." That is the safe direction.
- Mixed valid/invalid ⇒ valid entries kept, invalid ones dropped + warned.

---

## 3. Aggregation and the load path

`V71` is the third sanitizer in the warning aggregator `collectSettingsWarnings` (`kb`, cli_inner_pretty.js:52403):

```javascript
// ============================================
// collectSettingsWarnings - runs all three pre-schema sanitizers and concatenates their warnings
// Location: cli_inner_pretty.js:52403-52405
// ============================================

// ORIGINAL (for source lookup):
function kb(H, $) {
  return [...W71(H, $), ...G71(H, $), ...V71(H, $)];
}

// READABLE (for understanding):
function collectSettingsWarnings(rawSettings, filePath) {
  return [
    ...filterInvalidPermissionRules(rawSettings, filePath), // W71: permissions allow/deny/ask
    ...filterInvalidHooks(rawSettings, filePath),           // G71: hooks object
    ...validateMcpServerPolicyEntries(rawSettings, filePath), // V71: NEW in 2.1.156
  ];
}

// Mapping: kb→collectSettingsWarnings, W71→filterInvalidPermissionRules, G71→filterInvalidHooks, V71→validateMcpServerPolicyEntries
```

All three sanitizers share the same contract — *mutate `rawSettings` in place to remove the offending sub-values, return a warning list* — so the order does not matter and each one independently makes the object "more valid." `V71` was simply slotted in as the third member when MCP-list resilience was added.

### 3.1 Why `kb` runs *before* `safeParse`

Every settings loader follows the same two-step shape: run `kb` to scrub the raw object, *then* `safeParse` the scrubbed object. The remote-managed loader makes this explicit (cli_inner_pretty.js:52983-52991):

```javascript
// ============================================
// loadRemoteManagedSettings - kb (scrub) THEN safeParse (validate), errors carry the warnings
// Location: cli_inner_pretty.js:52983-52991
// ============================================

// ORIGINAL (for source lookup):
function t_$(H) {
  let $ = H?.remote ? H.remote() : qfH();
  if (!$ || Object.keys($).length === 0) return { settings: null, errors: [] };
  let q = AP($),
    K = kb(q, "remote managed settings"),
    _ = lW().safeParse(q);
  if (!_.success) return { settings: null, errors: [...K, ...s3H(_.error, "remote managed settings")] };
  return { settings: Object.keys(_.data).length > 0 ? _.data : null, errors: K };
}

// READABLE (for understanding):
function loadRemoteManagedSettings(ctx) {
  let raw = ctx?.remote ? ctx.remote() : readRemoteManagedSettingsRaw();
  if (!raw || Object.keys(raw).length === 0) return { settings: null, errors: [] };
  let scrubbed = deepClone(raw);
  let warnings = collectSettingsWarnings(scrubbed, "remote managed settings"); // mutates `scrubbed` in place
  let parsed = settingsSchema().safeParse(scrubbed);                            // now sees only valid MCP entries
  if (!parsed.success)
    return { settings: null, errors: [...warnings, ...formatZodIssues(parsed.error, "remote managed settings")] };
  return { settings: Object.keys(parsed.data).length > 0 ? parsed.data : null, errors: warnings };
}

// Mapping: t_$→loadRemoteManagedSettings, AP→deepClone, kb→collectSettingsWarnings, lW→settingsSchema, _→parsed, s3H→formatZodIssues
```

This ordering is the entire mechanism of the fix. Because `kb` mutated `scrubbed` (dropping `allowedMcpServers[3]`), the `safeParse` at line 52988 succeeds and returns the rest of the policy in `parsed.data`. The MCP warning is carried out in `errors` regardless. If the *settings* still fail to parse for some *other* reason, the MCP warnings are concatenated ahead of the schema errors.

The same pre-scrub pattern appears at every tier:
- MDM / registry string: `loadManagedSettingsString` (`Lo8`) — `kb(q,$)` at cli_inner_pretty.js:52504, then `lW().safeParse(q)` at 52505.
- WSL Windows-policy presence check: `kb($, H)` at cli_inner_pretty.js:52569.
- policyHelper subprocess output: `kb(M, "policyHelper")` at cli_inner_pretty.js:52731, with each warning also logged at level `warn` (52732).
- parent (SDK) managed settings: `loadParentManagedSettings` (`e_$`) — `kb(q, "parent managed settings")` at cli_inner_pretty.js:52996.
- SDK inline settings: `kb(q, "SDK inline settings")` at cli_inner_pretty.js:53005.
- generic per-source file loader: `kb(K, H)` at cli_inner_pretty.js:53020.

### 3.2 The `claude doctor` / remote path

The doc-cited remote managed-settings entry point runs `kb` and discards its return value at that site (cli_inner_pretty.js:53445-53449):

```javascript
// ============================================
// validateRemoteManagedSettings - the claude doctor remote path: scrub-in-place then return scrubbed object
// Location: cli_inner_pretty.js:53445-53449
// ============================================

// ORIGINAL (for source lookup):
function KS7(H) {
  if (!H) return H;
  let $ = AP(H);
  return (kb($, "remote managed settings"), $);
}

// READABLE (for understanding):
function validateRemoteManagedSettings(raw) {
  if (!raw) return raw;
  let scrubbed = deepClone(raw);
  collectSettingsWarnings(scrubbed, "remote managed settings"); // in-place scrub; warnings logged/surfaced elsewhere
  return scrubbed;
}

// Mapping: KS7→validateRemoteManagedSettings, AP→deepClone, kb→collectSettingsWarnings
```

Here `kb`'s value isn't captured because the caller only wants the *scrubbed object* — the warnings themselves reach the user through the `errors` arrays produced by the `{settings, errors}` loaders (`t_$`, `e_$`, `Lo8`, …), which feed `getPolicySettingsLoadErrors` (`aF$`, cli_inner_pretty.js:53449-53451) and `getSettingsWithErrors` (`GB`, cli_inner_pretty.js:53394). The `claude doctor` flow and the startup sequence read those errors and render them.

---

## 4. Surfacing — why it's a *warning*, not a fatal *error*

The `severity:"warning"` field set by `V71` (cli_inner_pretty.js:52395) is what makes the dropped MCP entry non-blocking. At startup, the bootstrap reads the loaded settings' `errors`, filters out the per-server MCP connection errors (those have `mcpErrorMetadata`), and if any remain, shows the `InvalidSettingsDialog` (cli_inner_pretty.js:645362-645365):

```javascript
// ORIGINAL (for source lookup):  cli_inner_pretty.js:645362-645365
let { errors: D8 } = GB(),
  fq = D8.filter((kK) => !kK.mcpErrorMetadata);
if (fq.length > 0) {
  if ((await RZ9(r4, { settingsErrors: fq, onExit: () => R9(1) })) === "fix") { … }
```

Inside the dialog, the title and the default action are chosen by whether **any** error has a non-warning severity, via `isNonWarningSeverity` (`cuz`, cli_inner_pretty.js:634318-634320 — `H.severity !== "warning"`):

```javascript
// ORIGINAL (for source lookup):  cli_inner_pretty.js:634271-634291 (condensed)
if ($[4] !== q) ((f = q.some(cuz)), …);   // f = "any non-warning error present?"
let O = f, …;
// option order depends on O …
let w = O ? "Settings Error" : "Settings Warning";
let D = O ? z : K;   // O ? onExit : onContinue   ← default action
```

So a settings file whose *only* problems are dropped MCP entries (all `severity:"warning"`) renders as a **"Settings Warning"** with **"Continue"** as the default action — the user (or admin) is informed but not blocked. Had `V71` instead let the bad entry fall through to the whole-settings `safeParse`, the resulting Zod error would have **no** `severity:"warning"` (it comes from `formatZodIssues`/`s3H`), `cuz` would return true, and the dialog would become a blocking **"Settings Error"** defaulting to **"Exit and fix manually"** — *and* the entire policy would be gone. The fix therefore changes both the **outcome** (rest of policy kept) and the **UX severity** (warning vs error).

ASCII of the before/after:

```
                       2.1.142 (whole-array parse)              2.1.156 (per-entry pre-validation)
managed-settings.json
  allowedMcpServers:[A, B, BAD, C]
        │                                                              │
        ▼                                                              ▼
  SettingsSchema.safeParse(whole object)                       V71: safeParse(A)✓ safeParse(B)✓
        │                                                            safeParse(BAD)✗→warn "…[2]…"
        ▼                                                            safeParse(C)✓
  array element BAD fails ⇒ WHOLE safeParse fails                    write back [A,B,C]
        │                                                              │
        ▼                                                              ▼
  loader returns {settings:{}}  (ALL policy lost)               SettingsSchema.safeParse([A,B,C]) ✓
        │                                                              │
        ▼                                                              ▼
  allowedMcpServers ⇒ undefined ⇒ "ALL servers allowed"         {settings:{allowedMcpServers:[A,B,C], …all other policy…},
  + Settings ERROR dialog (blocking, "Exit & fix")               errors:[warning allowedMcpServers[2]]}
                                                                       │
                                                                       ▼
                                                                 Settings WARNING dialog (non-blocking, "Continue")
                                                                 + claude doctor lists the dropped entry
```

---

## 5. Enforcement consumers (denylist precedence)

The validated lists are consumed by the MCP gate when deciding whether a server may connect. The crucial ordering — **deny is checked first, and allow short-circuits to false if denied** — is in `isMcpServerAllowed` (`wJH`, cli_inner_pretty.js:275201-275234), which delegates the deny check to `isMcpServerDenied` (`NN7`, cli_inner_pretty.js:275185-275200):

```javascript
// ============================================
// isMcpServerAllowed / isMcpServerDenied - denylist precedence over allowlist
// Location: cli_inner_pretty.js:275185-275234 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
function NN7(H, $) {
  let q = vn5();
  if (!q.deniedMcpServers) return !1;
  for (let K of q.deniedMcpServers) if (vBH(K) && K.serverName === H) return !0;
  if ($) {
    let K = hY8($);
    if (K) { for (let z of q.deniedMcpServers) if (mF$(z) && GN7(z.serverCommand, K)) return !0; }
    let _ = SY8($);
    if (_) { for (let z of q.deniedMcpServers) if (BF$(z) && TP$(_, z.serverUrl)) return !0; }
  }
  return !1;
}
function wJH(H, $) {
  if (NN7(H, $)) return !1;                       // ← denied wins, full stop
  let q = Vn5();
  if (!q.allowedMcpServers) return !0;            // no allowlist ⇒ allow all
  if (q.allowedMcpServers.length === 0) return !1;// empty allowlist ⇒ allow none
  …  // otherwise: match by command / url / name against allowlist
}

// READABLE (for understanding):
function isMcpServerDenied(serverName, serverDef) {
  let policy = getMergedManagedSettings();
  if (!policy.deniedMcpServers) return false;
  for (let entry of policy.deniedMcpServers) if (isNameEntry(entry) && entry.serverName === serverName) return true;
  if (serverDef) {
    let cmd = extractServerCommand(serverDef);
    if (cmd) for (let entry of policy.deniedMcpServers) if (isCommandEntry(entry) && commandMatches(entry.serverCommand, cmd)) return true;
    let url = extractServerUrl(serverDef);
    if (url) for (let entry of policy.deniedMcpServers) if (isUrlEntry(entry) && urlMatches(url, entry.serverUrl)) return true;
  }
  return false;
}
function isMcpServerAllowed(serverName, serverDef) {
  if (isMcpServerDenied(serverName, serverDef)) return false;     // denylist precedence
  let policy = getAllowlistManagedSettings();
  if (!policy.allowedMcpServers) return true;                     // undefined ⇒ all allowed
  if (policy.allowedMcpServers.length === 0) return false;        // [] ⇒ none allowed
  …
}

// Mapping: NN7→isMcpServerDenied, wJH→isMcpServerAllowed, vn5/Vn5→getMergedManagedSettings/getAllowlistManagedSettings,
//          vBH→isNameEntry, mF$→isCommandEntry, BF$→isUrlEntry, hY8→extractServerCommand, SY8→extractServerUrl,
//          GN7→commandMatches, TP$→urlMatches
```

The connection filter `Tc` (cli_inner_pretty.js:275238-275247) runs each configured server through `wJH`, keeping allowed ones and collecting `blocked` names; blocked servers are reported with the message `Blocked by enterprise policy (allowedMcpServers/deniedMcpServers)` (cli_inner_pretty.js:641890). This is precisely the policy whose integrity the `V71` fix protects: with per-entry validation, a single bad denylist entry can no longer cause `policy.deniedMcpServers` to vanish (which would silently *un-block* a server the admin intended to ban), and a single bad allowlist entry can no longer revert `allowedMcpServers` to `undefined` ("all allowed").

---

## 6. Cross-validation & confidence

- **2.1.156 (this build):** Every cited line read directly. The per-entry `safeParse` (52388), keep-valid (52389), per-entry warning with literal `Invalid entry was ignored` (52391-52397), and write-back (52399) are explicit. The `T71` table (52417-52420), schemas `fo8`/`Oo8` (52016/52043), aggregator `kb` (52403), and the doctor/remote surfacing (53445-53449, 645362) are all present.
- **2.1.142 bundle:** Grepped — **no** `Invalid entry was ignored` string, **no** `{key:"allowedMcpServers", schema:…}` table, **no** `V71`-shaped function. The MCP schema (`y.array(fI9())`, 2.1.142 cli_inner_pretty.js:50485) was validated whole by the top-level settings `safeParse`. The only pre-schema sanitizers were the permission-rule filter (`Non-string value in … array was removed`, 2.1.142:51314) and the hooks filter (`This field was ignored`, 2.1.142:51343). **Conclusion: the per-entry MCP validator is new in the 2.1.143–156 window.**
- **2.1.88 readable source:** `src/utils/settings/validation.ts` exports only `formatZodError`, `validateSettingsFileContent`, and `filterInvalidPermissionRules` — the latter is the documented precedent ("This prevents one bad rule from poisoning the entire settings file", validation.ts:221). There is **no** hooks filter and **no** MCP filter; `allowedMcpServers`/`deniedMcpServers` (declared in `src/utils/settings/types.ts:417,427`) were parsed whole by `SettingsSchema().safeParse` (settings.ts:219/684). The 2.1.156 `V71` is the natural generalization of the 2.1.88 permission-rule idea, now applied to the two MCP policy arrays.

**Confidence: high.** The 2.1.156 implementation is unambiguous, and both cross-validation builds confirm there was no prior per-entry MCP validation — exactly matching the changelog's "a single invalid entry … discarding all managed-settings policy" description of the old behavior.

---

## 7. Key insight

The whole fix hinges on one design choice already proven by `filterInvalidPermissionRules` in 2.1.88: **scrub the raw object in place *before* the all-or-nothing Zod `safeParse`, and convert "fatal schema rejection" into "drop-the-offender + warning."** Zod arrays are intentionally all-or-nothing — one bad element rejects the whole array, and (because these fields are nested in a much larger settings object) that rejection cascades to the entire settings file. For *user* settings that is merely annoying; for *managed* settings it is dangerous, because the failure direction is *open* — `allowedMcpServers` reverts to `undefined` = "all servers allowed," silently defeating an enterprise lockdown.

`V71` neutralizes that by giving the two MCP policy arrays the same per-entry resilience the permission lists already had: it validates each entry against its own schema (`z().safeParse(A[f])`), keeps the survivors, drops only the offender with an indexed, human-readable `Invalid entry was ignored: …` warning, and — critically — leaves the *rest* of the managed policy fully intact. The `severity:"warning"` tag then ensures the residue surfaces as a non-blocking `claude doctor` / startup *warning* rather than a fatal *error*, so the admin learns about the typo without losing their security posture in the meantime. The clever, almost invisible part is the conditional write-back (`if (Y.length < A.length)`): it makes the validator a no-op (no mutation, no warning) on the overwhelmingly common all-valid case, so the resilience costs nothing when it isn't needed.
