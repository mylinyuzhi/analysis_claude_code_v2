# Settings Tier Hierarchy (v2.1.142)

**Theme:** Permission rules, sandbox config, hooks, and feature toggles flow from settings.json files at multiple **tiers**. The precedence order is fixed and well-documented; the *merging algorithm* between tiers has nuances — especially the v2.1.133 introduction of `parentSettingsBehavior` (which controls whether SDK-provided settings (`parent tier`) layer under the locally-configured admin tier).

This document maps:
1. The six tiers in precedence order
2. What flows where (allow/deny/ask, hooks, sandbox, autoMode)
3. The `parentSettingsBehavior` algorithm (v2.1.133)
4. `--setting-sources` flag (controls which tiers load)
5. `cleanupPeriodDays` and `additionalDirectories` propagation
6. The "restrictive-only filter" for admin tiers

---

## 1. The Six Tiers

```
Highest precedence
        ┌──────────────────────────────────────────┐
        │ managed (helper)                         │ ← `apiKeyHelper`-style scripts
        ├──────────────────────────────────────────┤
        │ managed (remote)                         │ ← API-fetched policy
        ├──────────────────────────────────────────┤
        │ managed (OS policy / MDM / registry)     │ ← admin tier
        ├──────────────────────────────────────────┤
        │ parent (SDK-provided)                    │ ← `Options.managedSettings`
        ├──────────────────────────────────────────┤
        │ flagSettings (CLI --settings)            │
        ├──────────────────────────────────────────┤
        │ projectSettings (.claude/settings.json)  │
        ├──────────────────────────────────────────┤
        │ localSettings (.claude/settings.local.json)  ← gitignored
        ├──────────────────────────────────────────┤
        │ userSettings (~/.claude/settings.json)   │
        └──────────────────────────────────────────┘
Lowest precedence
```

In the 2.1.88 TypeScript baseline (`src/utils/settings/constants.ts`), the order is enumerated as:

```javascript
// 2.1.88 src/utils/settings/constants.ts:7-22
export const SETTING_SOURCES = [
  'userSettings',      // global
  'projectSettings',   // shared per-directory
  'localSettings',     // gitignored
  'flagSettings',      // from --settings flag
  'policySettings',    // managed-settings.json or remote settings from API
];
// Order matters - later sources override earlier ones
```

The bundle uses a parallel set with `OR` (the array of editable sources) and adds three more tier-types under `policySettings`:

- **helper**: `apiKeyHelper` or other scripts that emit a JSON payload on demand
- **remote**: server-fetched policy
- **OS policy**: macOS `/Library/Application Support/Claude/managed-settings.json`, Linux `/etc/claude-code/managed-settings.json`, Windows HKLM registry
- **parent**: SDK-provided settings from `Options.managedSettings`

### Precedence semantics

When a key is present at multiple tiers, the **higher-precedence tier wins** outright (last-write-wins for scalars). For *arrays* like `permissions.allow`, the merge is **union**: all tiers' arrays are concatenated when the merger walks the chain (see `WAH` for autoMode rules and `mNH`/`r9H`/`BNH` for permission rules — each iterates all source tiers and combines).

This means:
- `permissions.allow` arrays from user + project + local + flag + policy are **all combined**
- `permissions.deny` arrays are **all combined** (you can't relax a higher-tier deny)
- Scalars like `model` follow last-write-wins (admin > user > project > local)

---

## 2. What Flows Where

Each settings tier can supply different categories of data:

| Category | userSettings | projectSettings | localSettings | flagSettings | policySettings |
|---|:---:|:---:|:---:|:---:|:---:|
| `permissions.allow/deny/ask` | yes | yes | yes | yes | yes |
| `permissions.additionalDirectories` | yes | yes | yes | yes | yes |
| `permissions.defaultMode` | yes | yes | yes | yes | yes |
| `permissions.disableBypassPermissionsMode` | yes | yes | yes | yes | yes |
| `permissions.allowManagedPermissionRulesOnly` | no | no | no | no | yes |
| `autoMode.{allow,soft_deny,hard_deny,environment}` | yes | yes | yes | yes | yes |
| `autoMode.defaultMode = "auto"` | yes | no¹ | no¹ | yes | yes |
| `skipAutoPermissionPrompt` | yes | no | yes | yes | yes |
| `sandbox.network.deniedDomains` | yes | yes | yes | yes | yes |
| `sandbox.network.allowManagedDomainsOnly` | no | no | no | no | yes |
| `sandbox.filesystem.allowManagedReadPathsOnly` | no | no | no | no | yes |
| `hooks.*` | yes | yes² | yes² | yes | yes |
| `allowManagedHooksOnly` | no | no | no | no | yes |
| `parentSettingsBehavior` | no | no | no | no | yes |
| `cleanupPeriodDays` | yes | yes | yes | yes | yes |
| `forceLoginMethod`/`forceLoginOrgUUID` | no | no | no | no | yes |
| `strictPluginOnlyCustomization` | no | no | no | no | yes |

¹ `autoMode.defaultMode = "auto"` from `projectSettings`/`localSettings` is **ignored** (line 199020) — only policy/user/flag may grant auto mode, because project/local settings are repo-controllable (an attacker who controls the repo would otherwise auto-grant auto mode).

² `hooks.*` from `projectSettings`/`localSettings` is gated by `allowManagedHooksOnly` (line 240924) — when set true in policy, project/local hooks are dropped.

### The `allowManaged*Only` family

A family of policy-only settings that flip the merge from "union" to "policy-only":

- `permissions.allowManagedPermissionRulesOnly` — only policy-tier `allow`/`additionalDirectories` apply; user/project/local arrays are dropped (deny/ask still union)
- `sandbox.network.allowManagedDomainsOnly` — only policy `allowedDomains` and `WebFetch(domain:...)` allow rules apply
- `sandbox.filesystem.allowManagedReadPathsOnly` — only policy `allowRead` paths apply
- `allowManagedHooksOnly` — only policy hooks apply
- `allowManagedMcpServersOnly` — only policy MCP servers apply

**Important security fix (v2.1.126):** `allowManagedDomainsOnly` and `allowManagedReadPathsOnly` were silently ignored when a higher-priority managed-settings source lacked a `sandbox` block. The fix collects the flag across **all** managed tiers (not just the winning one). See [`parent_settings_behavior.md`](./parent_settings_behavior.md).

---

## 3. The `parentSettingsBehavior` Algorithm (v2.1.133)

**The problem:** When an SDK caller passes `Options.managedSettings`, those settings become a **parent tier**. Pre-v2.1.133, the parent tier was always *dropped* when a local admin tier existed — the admin tier's policy was the sole policy source. This was opposite of what some enterprises wanted: they wanted the SDK to *add additional restrictions* on top of the locally-deployed admin policy.

### Schema

```javascript
// ============================================
// parentSettingsBehaviorSchema - Admin-tier policy for SDK parent-tier merge
// Location: cli_inner_pretty.js:50659-50666
// ============================================

// ORIGINAL (for source lookup):
parentSettingsBehavior: y
  .enum(["first-wins", "merge"])
  .optional()
  .describe(
    'Controls whether the SDK parent tier (Options.managedSettings / --managed-settings) layers under this admin tier. "first-wins" ' +
      "(default): parent is dropped — admin tiers are the only policy " +
      `source. "merge": parent's restrictive-only-filtered settings union under the admin winner. Has no effect when no admin tier exists (parent applies as the sole policy tier, still filtered restrictive-only).`,
  ),

// READABLE (for understanding):
parentSettingsBehavior: zodEnum(["first-wins", "merge"]).optional().describe(`
  Controls whether the SDK parent tier (Options.managedSettings or --managed-settings)
  layers under this admin tier:

  - "first-wins" (default): parent is dropped when an admin tier exists.
    Admin tiers are the only policy source. SDK settings are ignored.

  - "merge": parent's restrictive-only-filtered settings union under
    the admin winner. Admin's directives take precedence, but the
    parent's *restrictive-only* directives (deny rules, allowManagedX
    flags) are unioned in.

  Has no effect when no admin tier exists — parent applies as the sole
  policy tier, still filtered restrictive-only.
`),

// Mapping: parentSettingsBehavior→parentSettingsBehaviorSchema, y→zod (z), 1:1
```

### The merger — `MDq` + `Tm8` + `Gm8`

The merger lives at `cli_inner_pretty.js:52043-52131`:

```javascript
// ============================================
// shouldMergeParentChain - Gate that decides if parent layers under admin
// Location: cli_inner_pretty.js:52043-52045
// ============================================

// ORIGINAL (for source lookup):
function Gm8(H) {
  return !H || H.parentSettingsBehavior === "merge";
}

// READABLE (for understanding):
function shouldMergeParentChain(adminWinningTier) {
  // True when:
  // - no admin tier (parent stands alone, no merger question)
  // - admin tier exists and explicitly sets parentSettingsBehavior: "merge"
  // False (default first-wins) when admin tier exists without the flag.
  return !adminWinningTier || adminWinningTier.parentSettingsBehavior === "merge";
}

// Mapping: Gm8→shouldMergeParentChain, H→adminWinningTier
```

### The restrictive-only filter — `Tm8`

When parent is merged, its settings pass through `Tm8` (line 52046-52088) which **strips non-restrictive keys**:

```javascript
// ============================================
// applyParentRestrictiveOnlyFilter - Keep only "additive restriction" keys from parent
// Location: cli_inner_pretty.js:52046-52088
// ============================================

// ORIGINAL (for source lookup):
function Tm8(H, $) {
  let q = {};
  if (H.allowManagedHooksOnly === !0) q.allowManagedHooksOnly = !0;
  if (H.allowManagedMcpServersOnly === !0) q.allowManagedMcpServersOnly = !0;
  if (H.allowManagedPermissionRulesOnly === !0) q.allowManagedPermissionRulesOnly = !0;
  let K = H.strictPluginOnlyCustomization;
  if (K === !0 || (Array.isArray(K) && K.length > 0)) q.strictPluginOnlyCustomization = K;
  if (H.deniedMcpServers) q.deniedMcpServers = H.deniedMcpServers;
  if ($.forceLoginOrgUUID === void 0 && H.forceLoginOrgUUID) q.forceLoginOrgUUID = H.forceLoginOrgUUID;
  if ($.allowedMcpServers === void 0 && H.allowedMcpServers) q.allowedMcpServers = H.allowedMcpServers;
  if (H.permissions) {
    let _ = aR$(H.permissions, ["deny", "ask"]);
    if (H.permissions.disableBypassPermissionsMode === "disable") _.disableBypassPermissionsMode = "disable";
    if ($.allowManagedPermissionRulesOnly !== !0) {
      let { allow: A, additionalDirectories: z } = H.permissions;
      if (A && $.sandbox?.network?.allowManagedDomainsOnly !== !0) _.allow = A;
      if (z) _.additionalDirectories = z;
    }
    if (Object.keys(_).length > 0) q.permissions = _;
  }
  if (H.sandbox) {
    /* keep deniedDomains, deny paths, allowManagedDomainsOnly, allowManagedReadPathsOnly */
  }
  return q;
}

// READABLE (for understanding):
function applyParentRestrictiveOnlyFilter(parentSettings, computedAdminFacts) {
  const filtered = {};

  // Strict "only managed X" gates pass through as-is
  if (parentSettings.allowManagedHooksOnly === true) filtered.allowManagedHooksOnly = true;
  if (parentSettings.allowManagedMcpServersOnly === true) filtered.allowManagedMcpServersOnly = true;
  if (parentSettings.allowManagedPermissionRulesOnly === true) filtered.allowManagedPermissionRulesOnly = true;

  // Plugin/MCP/login restrictions pass through
  const strictPluginOnly = parentSettings.strictPluginOnlyCustomization;
  if (strictPluginOnly === true || (Array.isArray(strictPluginOnly) && strictPluginOnly.length > 0)) {
    filtered.strictPluginOnlyCustomization = strictPluginOnly;
  }
  if (parentSettings.deniedMcpServers) filtered.deniedMcpServers = parentSettings.deniedMcpServers;
  if (computedAdminFacts.forceLoginOrgUUID === undefined && parentSettings.forceLoginOrgUUID) {
    filtered.forceLoginOrgUUID = parentSettings.forceLoginOrgUUID;
  }
  if (computedAdminFacts.allowedMcpServers === undefined && parentSettings.allowedMcpServers) {
    filtered.allowedMcpServers = parentSettings.allowedMcpServers;
  }

  // Permissions: keep deny+ask always (restrictive). Allow only if admin doesn't gate it.
  if (parentSettings.permissions) {
    const perms = pickKeys(parentSettings.permissions, ["deny", "ask"]);
    if (parentSettings.permissions.disableBypassPermissionsMode === "disable") {
      perms.disableBypassPermissionsMode = "disable";
    }
    // Allow rules only pass through if neither admin nor permission-rules-only gates them
    if (computedAdminFacts.allowManagedPermissionRulesOnly !== true) {
      const { allow, additionalDirectories } = parentSettings.permissions;
      if (allow && computedAdminFacts.sandbox?.network?.allowManagedDomainsOnly !== true) {
        perms.allow = allow;
      }
      if (additionalDirectories) perms.additionalDirectories = additionalDirectories;
    }
    if (Object.keys(perms).length > 0) filtered.permissions = perms;
  }

  // Sandbox: similar — denyRead/denyWrite always pass; allowRead/allowedDomains gated
  if (parentSettings.sandbox) {
    /* ... gated by allowManagedDomainsOnly / allowManagedReadPathsOnly ... */
  }

  return filtered;
}

// Mapping: Tm8→applyParentRestrictiveOnlyFilter, aR$→pickKeys, H→parentSettings, $→computedAdminFacts
```

### The full merger entry — `MDq`

```javascript
// ============================================
// mergeManagedPolicyTiers - Walk all 4 admin tier sources + parent slice
// Location: cli_inner_pretty.js:52104-52131
// ============================================

// ORIGINAL (for source lookup):
function MDq(H) {
  let $ = [],
    { settings: q, errors: K } = YK$(H);
  $.push(...K);
  let { settings: _, errors: A } = YDq(H);
  $.push(...A);
  let { settings: z, errors: Y } = H.file?.() ?? AK$(H);
  $.push(...Y);
  let { settings: f, errors: O } = fK$(H);
  $.push(...O);
  let M = [q, _, z].filter((J) => J !== null),
    w = M[0] ?? null,
    D = { /* computed admin facts: allowManagedPermissionRulesOnly, sandbox.*.allowManagedX, ... */ },
    j = f && Gm8(w) ? Tm8(f, D) : null;
  return { tiers: M, admin: w, parentSlice: j, errors: $ };
}

// READABLE (for understanding):
function mergeManagedPolicyTiers(adapter) {
  const allErrors = [];

  // Load each admin-tier source (helper, remote, OS policy/MDM, parent)
  const { settings: helperSettings, errors: helperErrors } = loadHelperTier(adapter);
  allErrors.push(...helperErrors);
  const { settings: remoteSettings, errors: remoteErrors } = loadRemoteTier(adapter);
  allErrors.push(...remoteErrors);
  const { settings: osPolicySettings, errors: osPolicyErrors } = adapter.file?.() ?? loadOsPolicyTier(adapter);
  allErrors.push(...osPolicyErrors);
  const { settings: parentSettings, errors: parentErrors } = loadParentChainTier(adapter);
  allErrors.push(...parentErrors);

  // Admin tiers = helper + remote + osPolicy (in precedence order)
  const adminTiers = [helperSettings, remoteSettings, osPolicySettings].filter((s) => s !== null);
  const winningAdminTier = adminTiers[0] ?? null;

  // Compute admin facts that gate parent merging
  const computedAdminFacts = {
    allowManagedPermissionRulesOnly: adminTiers.some((t) => t.allowManagedPermissionRulesOnly === true) || undefined,
    forceLoginOrgUUID: adminTiers.find((t) => t.forceLoginOrgUUID !== undefined)?.forceLoginOrgUUID,
    allowedMcpServers: adminTiers.find((t) => t.allowedMcpServers !== undefined)?.allowedMcpServers,
    sandbox: {
      network: { allowManagedDomainsOnly: adminTiers.some((t) => t.sandbox?.network?.allowManagedDomainsOnly === true) || undefined },
      filesystem: { allowManagedReadPathsOnly: adminTiers.some((t) => t.sandbox?.filesystem?.allowManagedReadPathsOnly === true) || undefined },
    },
  };

  // Parent tier: merged only if no admin OR admin says "merge"
  const parentSlice = parentSettings && shouldMergeParentChain(winningAdminTier)
    ? applyParentRestrictiveOnlyFilter(parentSettings, computedAdminFacts)
    : null;

  return { tiers: adminTiers, admin: winningAdminTier, parentSlice, errors: allErrors };
}

// Mapping: MDq→mergeManagedPolicyTiers, Gm8→shouldMergeParentChain, Tm8→applyParentRestrictiveOnlyFilter,
//          YK$→loadHelperTier, YDq→loadRemoteTier, AK$→loadOsPolicyTier, fK$→loadParentChainTier,
//          H→adapter, M→adminTiers, w→winningAdminTier, D→computedAdminFacts, j→parentSlice
```

### Why this design?

**What it does:** Merges multiple managed-settings sources (helper script, remote API, OS policy, SDK parent) into a single resolved policy.

**How it works:**
1. Load each admin tier source. Each can fail (return errors) independently.
2. Combine helper + remote + OS-policy into an "admin tier list". Helper wins for value lookups; remote second; OS policy third.
3. Compute "admin facts" — flags that determine what parent can override (`allowManagedPermissionRulesOnly`, `sandbox.*.allowManagedX`, `forceLoginOrgUUID`).
4. Decide whether to merge parent. If `winningAdminTier.parentSettingsBehavior === "merge"`, run parent through the restrictive-only filter.
5. Return `{tiers, admin: winning, parentSlice}` for downstream merging.

**Why this approach:**
- **Two-layer admin tier**: Some enterprises have one source of truth (OS policy), but newer deployments use remote managed settings + apiKeyHelper. The two-layer design lets all coexist.
- **Restrictive-only filter for parent**: Prevents SDK callers from *loosening* the admin policy. SDK can add `deny` rules but not add `allow` rules that the admin didn't grant.
- **Default first-wins**: Preserves backward compat — pre-v2.1.133 SDK callers expecting parent to drop continue to work.

**Key insight:** The merger isn't a flat `Object.assign` over all tiers. It's structural — different keys flow at different layers (admin allows broad config; parent only adds restrictions). This lets enterprises layer compliance policies (e.g., "this team adds an extra deny for `Bash(npx publish)`") on top of organization-wide admin settings.

---

## 4. The `--setting-sources` Flag

`--setting-sources user,project` (or any comma-separated subset of `user`, `project`, `local`) restricts which **non-policy** tiers load. Useful when:

- Running in CI where you don't want local-only overrides
- Testing how the agent behaves with just the user tier
- Running SDK callers with their own settings layered on a clean base

```javascript
// 2.1.88 src/utils/settings/constants.ts:128 (parseSettingSourcesFlag)
export function parseSettingSourcesFlag(flag: string): SettingSource[] {
  if (flag === '') return []
  const names = flag.split(',').map(s => s.trim())
  const result: SettingSource[] = []
  for (const name of names) {
    switch (name) {
      case 'user': result.push('userSettings'); break
      case 'project': result.push('projectSettings'); break
      case 'local': result.push('localSettings'); break
      default:
        throw new Error(`Invalid setting source: ${name}. Valid options are: user, project, local`)
    }
  }
  return result
}
```

**Important:** `policySettings` and `flagSettings` **always load**, regardless of `--setting-sources`:

```javascript
// 2.1.88 src/utils/settings/constants.ts:159 (getEnabledSettingSources)
export function getEnabledSettingSources(): SettingSource[] {
  const allowed = getAllowedSettingSources()
  // Always include policy and flag settings
  const result = new Set<SettingSource>(allowed)
  result.add('policySettings')
  result.add('flagSettings')
  return Array.from(result)
}
```

So `--setting-sources user` doesn't skip the admin policy or the `--settings <file>` value — those are always honored.

### Effect on retention cleanup (v2.1.142)

When `--setting-sources` excludes `user` and no other enabled source provides `cleanupPeriodDays`, the retention cleanup is skipped with a warning (`cli_inner_pretty.js:555230`):

> Skipping retention cleanup: userSettings source is disabled (--setting-sources) and no enabled source provides cleanupPeriodDays.

This is a graceful fallback — the absence of a cleanup setting doesn't crash startup, just disables the sweep.

---

## 5. `cleanupPeriodDays` Propagation

`cleanupPeriodDays` controls retention of `~/.claude/transcripts/`, `~/.claude/tasks/`, `~/.claude/shell-snapshots/`, and `~/.claude/backups/` (per v2.1.117 expansion).

The setting flows through the normal tier hierarchy: any tier can set it; admin wins.

```javascript
// Bundle schema (cli_inner_pretty.js:50403-50410):
cleanupPeriodDays: y
  .number()
  .int()
  .positive()
  .optional()
  .describe(
    "Number of days to retain chat transcripts before automatic cleanup (default: 30). Minimum 1. Use a large value for long retention; use --no-session-persistence to disable transcript writes entirely.",
  ),

// Validation refinement (cli_inner_pretty.js:51141-51144):
// `cleanupPeriodDays` must be ≥ 1. Pre-fix, `0` silently disabled cleanup
// (which users setting it to "never clean up" did not expect). Fix:
// reject 0, point users at --no-session-persistence for "disable entirely".
```

### Default behavior

If unset across all tiers, the default is 30 days. Setting `cleanupPeriodDays: 0` is rejected (`too_small` error code) — the fix point user to `--no-session-persistence` for "disable entirely" rather than the surprising `0 = disable` behavior.

---

## 6. `additionalDirectories` Propagation

`permissions.additionalDirectories` is **unioned** across tiers (one of the few array keys where everyone's values combine):

```javascript
// At line 181129, when a hook persists additionalDirectories:
let q = v8(H.destination)?.permissions?.additionalDirectories || [],
  _ = [...new Set([...q, ...H.directories])];
B6(H.destination, { permissions: { additionalDirectories: _ } });
```

The union is computed at write-time (when a permission update is persisted) and at read-time (when computing the effective trusted directory list).

### Interaction with `allowManagedPermissionRulesOnly`

When admin sets `allowManagedPermissionRulesOnly: true`, only the **admin tier's** `additionalDirectories` apply. User/project/local lists are dropped. This prevents an attacker who controls the repo from adding `additionalDirectories: ["/etc"]` to escape the project boundary.

### Network-drive fix (v2.1.133)

Pre-v2.1.133, mapped network drives passed via `--add-dir` (or SDK `additionalDirectories`) were being denied for Read/Write/Edit because the path normalizer was rejecting UNC paths. v2.1.133 fixed this by handling UNC and drive-letter mappings correctly in the path normalizer (`yL`).

---

## 7. Helper / Remote / OS-Policy Sources

Beyond the four "editable" tiers, the bundle recognizes additional sources:

### Helper script (`apiKeyHelper`-style)

A script path can be set in any tier:

```json
{
  "apiKeyHelper": "/opt/corp/get-api-key.sh",
  "headersHelper": "/opt/corp/get-headers.sh"
}
```

The helper script outputs a single line (for `apiKeyHelper`) or a JSON blob (for `headersHelper` and similar). Helpers run on-demand, not at startup.

### Remote (managed-settings server)

When `CLAUDE_CODE_MANAGED_SETTINGS_URL` or an admin-configured endpoint is set, the CLI fetches settings JSON over HTTP. The remote tier sits above OS-policy in precedence. Auth uses OAuth (`user:inference` scope).

Setting `forceRemoteSettingsRefresh: true` in admin (v2.1.121+) blocks startup until the remote fetch completes — useful for compliance-driven deployments.

### OS Policy (MDM)

- macOS: `/Library/Application Support/Claude/managed-settings.json` (and per-user)
- Linux: `/etc/claude-code/managed-settings.json`
- Windows: registry under `HKLM\Software\Anthropic\ClaudeCode` (also `HKCU` for per-user)

This is read by `eX` (cli_inner_pretty.js:48221) which returns the correct path for the current platform.

### WSL: `wslInheritsWindowsSettings` (v2.1.118)

WSL on Windows can opt to **inherit Windows-side managed settings**:

```json
{ "wslInheritsWindowsSettings": true }
```

When set, the Linux-side managed-settings resolver reads from Windows HKLM in addition to (or instead of) `/etc/claude-code/managed-settings.json`. This is for enterprises that maintain a single Windows MDM policy and want it to apply to WSL Claude Code instances.

---

## 8. Putting It Together — Worked Examples

### Example 1: Project allow, user deny

```json
// projectSettings (.claude/settings.json)
{ "permissions": { "allow": ["Bash(npm test)"] } }

// userSettings (~/.claude/settings.json)
{ "permissions": { "deny": ["Bash(npm test)"] } }
```

**Result for `npm test`:** Denied. Both arrays are checked; deny rule fires first (per `UA5`'s order).

### Example 2: Admin restrictive-only

```json
// policySettings
{
  "parentSettingsBehavior": "merge",
  "permissions": { "deny": ["Bash(curl *)"] }
}
// SDK parent (managedSettings)
{ "permissions": { "allow": ["Bash(rm:*)"], "deny": ["Bash(npx publish *)"] } }
```

**Result:**
- Parent's `Bash(rm:*)` allow rule is **dropped** (parent can't loosen — restrictive-only filter strips non-deny/ask allow).
- Parent's `Bash(npx publish *)` deny rule is **kept** (deny is restrictive).
- Final policy: deny `curl *` + deny `npx publish *`. No allow rules from parent.

### Example 3: `allowManagedDomainsOnly`

```json
// policySettings
{ "sandbox": { "network": { "allowedDomains": ["api.corp.com"], "allowManagedDomainsOnly": true } } }
// userSettings
{ "sandbox": { "network": { "allowedDomains": ["personal.example.com"] } } }
```

**Result:** Only `api.corp.com` is allowed. User's `personal.example.com` is dropped because `allowManagedDomainsOnly` is set.

But: `deniedDomains` from user still applies (the rule is **always merged across all sources regardless of allowManagedDomainsOnly** — the schema docstring at line 48263 says so explicitly).

### Example 4: `--setting-sources project`

```bash
claude --setting-sources project -p "review this code"
```

**Loaded tiers:** `projectSettings`, `policySettings`, `flagSettings`. user and local are skipped.

**Effect:** A user with a `~/.claude/settings.json` containing `permissionDecisions` for their local environment doesn't leak into the CI run. Only the repo-controlled project settings plus admin policy applies.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document
> - [`symbol_additions_v2_1_142_sandbox.md`](../00_overview/symbol_additions_v2_1_142_sandbox.md) — Sandbox-tier merger overlaps with this file

Key functions and constants in this document:
- `SETTING_SOURCES` (2.1.88 TS) — Canonical tier list (user, project, local, flag, policy)
- `mergeManagedPolicyTiers` (`MDq`) — Walk admin tiers + parent slice (cli_inner_pretty.js:52104)
- `applyParentRestrictiveOnlyFilter` (`Tm8`) — Restrictive-only filter for parent (cli_inner_pretty.js:52046)
- `shouldMergeParentChain` (`Gm8`) — `parentSettingsBehavior` gate (cli_inner_pretty.js:52043)
- `pickKeys` (`aR$`) — Pull subset of keys from an object
- `collectPolicyTierList` (`uI9`) — Final list of policy tiers (admin + maybe parent slice)
- `resolvePolicySettings` (`wDq`) — Top-level policy resolver (cli_inner_pretty.js:52138)
- `parseSettingSourcesFlag` (`TMq` in bundle / 2.1.88 TS function) — Parse `--setting-sources` CLI flag
- `getEnabledSettingSources` (`seH`) — Enabled tiers (always includes policy + flag)
- `wslInheritsWindowsSettings` — Settings key (v2.1.118)
- `parentSettingsBehavior` — Settings key (v2.1.133, cli_inner_pretty.js:50659)
- `cleanupPeriodDaysSchema` — Settings key with `>= 1` refinement (cli_inner_pretty.js:50403)
- `additionalDirectoriesUnion` — At-write-time union via `v8(destination).permissions.additionalDirectories`
