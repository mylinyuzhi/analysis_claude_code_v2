# `parentSettingsBehavior` — Admin/Parent Tier Merge Control — v2.1.133

**Theme:** Managed settings flow through a tier system: **admin tier** (managed via policy/MDM/registry) overrides **user tier** which overrides **local tier** etc. When the SDK is invoked with its own settings (`Options.managedSettings` or `--managed-settings`), the SDK provides a **parent tier** that should layer somewhere into the stack.

Pre-v2.1.133, the parent tier was *dropped* when an admin tier existed — the admin's settings won outright, the parent was ignored. v2.1.133 introduces `parentSettingsBehavior: "first-wins" | "merge"` to control this:

- `"first-wins"` (default) — admin tier wins, parent dropped
- `"merge"` — parent's restrictive-only-filtered settings layer **under** the admin tier

This is paired with a fix for `allowManagedDomainsOnly` and `allowManagedReadPathsOnly` being silently ignored in the parent-tier path — the v2.1.133 work covers both the new key and the bug where existing managed flags weren't being honored.

---

## 1. The Settings Tier Stack

```
                  ┌────────────────────┐
                  │ Admin Tier         │ ← MDM/policy/registry (highest)
                  │ (managedSettings)  │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │ User Tier          │ ← ~/.claude/settings.json
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │ Project Tier       │ ← .claude/settings.json (checked in)
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │ Local Tier         │ ← .claude/settings.local.json
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │ CLI Flag Tier      │ ← --flag values
                  └────────────────────┘
```

The **parent tier** is a special sixth tier that comes from the SDK caller. When `Options.managedSettings` is passed to the SDK's `Query` API, those settings are presented as a tier that should layer under whatever admin tier exists locally. The semantic question: where does the parent slot in?

Pre-v2.1.133, the parent **always** layered as part of the admin tier — *replacing* the local admin tier if one existed. This meant SDK consumers could *override* enterprise admin settings, which is exactly the opposite of what enterprises want.

---

## 2. The Schema — `parentSettingsBehavior`

```javascript
// ============================================
// parentSettingsBehaviorSchema - admin tier policy for parent-tier merge
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
parentSettingsBehavior: zodEnum(["first-wins", "merge"]).optional().describe(
  /* Controls whether the SDK parent tier (Options.managedSettings or --managed-settings)
   * layers under this admin tier:
   *
   * - "first-wins" (default): parent is dropped when an admin tier exists.
   *   Admin tiers are the only policy source. SDK settings are ignored.
   *
   * - "merge": parent's restrictive-only-filtered settings union under
   *   the admin winner. Admin's directives take precedence, but the
   *   parent's *restrictive-only* directives (deny rules, allowManagedX
   *   flags) are unioned in.
   *
   * Has no effect when no admin tier exists — parent applies as the sole
   * policy tier, still filtered restrictive-only.
   */
),

// Mapping: y→zodEnum, .enum()→zodEnum.values, .optional()→optional()
```

### The two values explained

**`"first-wins"`** (default, also implicit pre-v2.1.133):
- If admin tier exists → admin wins, parent dropped
- If no admin tier → parent becomes the sole admin tier (filtered restrictive-only)

**`"merge"`**:
- If admin tier exists → admin wins, BUT parent's restrictive-only directives layer in under admin
- If no admin tier → same as first-wins (parent becomes sole tier)

### Why "restrictive-only-filtered"

The parent tier is **only ever allowed to make things stricter, not looser**. Specifically:
- `permissions.deny` from parent: honored
- `permissions.ask` from parent: honored
- `permissions.allow` from parent: **dropped** unless explicitly enabled (see `allowManagedPermissionRulesOnly`)
- `allowManagedHooksOnly`/`allowManagedMcpServersOnly`/`allowManagedPermissionRulesOnly`: honored (these are restrictive flags)
- `sandbox.network.allowManagedDomainsOnly`: honored (restrictive)
- `sandbox.filesystem.allowManagedReadPathsOnly`: honored (restrictive)

The filter is `Tm8` (chunks `_top_*`, line 52046-52088).

---

## 3. The Filter — `applyParentSlice` (`Tm8`)

```javascript
// ============================================
// applyParentSlice - Filter parent-tier settings to restrictive-only directives
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
    let _ = aR$(H.permissions, ["deny", "ask"]);            // keep deny, ask from parent
    if (H.permissions.disableBypassPermissionsMode === "disable") _.disableBypassPermissionsMode = "disable";
    if ($.allowManagedPermissionRulesOnly !== !0) {
      let { allow: A, additionalDirectories: z } = H.permissions;
      if (A && $.sandbox?.network?.allowManagedDomainsOnly !== !0) _.allow = A;  // ← v2.1.126 fix
      if (z) _.additionalDirectories = z;
    }
    if (Object.keys(_).length > 0) q.permissions = _;
  }
  if (H.sandbox) {
    let { network: _, filesystem: A } = H.sandbox,
      z = {};
    if (H.sandbox.enabled === !0) z.enabled = !0;
    if (H.sandbox.failIfUnavailable === !0) z.failIfUnavailable = !0;
    if (H.sandbox.allowUnsandboxedCommands === !1) z.allowUnsandboxedCommands = !1;
    if (H.sandbox.autoAllowBashIfSandboxed === !1) z.autoAllowBashIfSandboxed = !1;
    if (_) {
      let Y = aR$(_, ["deniedDomains"]);
      if (_.allowManagedDomainsOnly === !0) Y.allowManagedDomainsOnly = !0;
      if ($.sandbox?.network?.allowManagedDomainsOnly !== !0 && _.allowedDomains) Y.allowedDomains = _.allowedDomains;
      if (Object.keys(Y).length > 0) z.network = Y;
    }
    if (A) {
      let Y = aR$(A, ["denyRead", "denyWrite"]);
      if (A.allowManagedReadPathsOnly === !0) Y.allowManagedReadPathsOnly = !0;
      if ($.sandbox?.filesystem?.allowManagedReadPathsOnly !== !0 && A.allowRead) Y.allowRead = A.allowRead;
      if (Object.keys(Y).length > 0) z.filesystem = Y;
    }
    if (Object.keys(z).length > 0) q.sandbox = z;
  }
  return q;
}

// READABLE (for understanding):
function applyParentSlice(parentSettings, adminCombinedFlags) {
  const filtered = {};

  // Restrictive flags — always honored from parent
  if (parentSettings.allowManagedHooksOnly === true)         filtered.allowManagedHooksOnly = true;
  if (parentSettings.allowManagedMcpServersOnly === true)    filtered.allowManagedMcpServersOnly = true;
  if (parentSettings.allowManagedPermissionRulesOnly === true) filtered.allowManagedPermissionRulesOnly = true;

  // Strict plugin customization (restrictive variant)
  const strictPlugin = parentSettings.strictPluginOnlyCustomization;
  if (strictPlugin === true || (Array.isArray(strictPlugin) && strictPlugin.length > 0)) {
    filtered.strictPluginOnlyCustomization = strictPlugin;
  }

  // Denied MCP servers — restrictive, always honored
  if (parentSettings.deniedMcpServers) filtered.deniedMcpServers = parentSettings.deniedMcpServers;

  // Fall-through fields: only used if admin didn't already provide them
  if (adminCombinedFlags.forceLoginOrgUUID === undefined && parentSettings.forceLoginOrgUUID) {
    filtered.forceLoginOrgUUID = parentSettings.forceLoginOrgUUID;
  }
  if (adminCombinedFlags.allowedMcpServers === undefined && parentSettings.allowedMcpServers) {
    filtered.allowedMcpServers = parentSettings.allowedMcpServers;
  }

  // permissions: keep deny + ask, conditionally keep allow + additionalDirectories
  if (parentSettings.permissions) {
    const slice = pickKeys(parentSettings.permissions, ["deny", "ask"]);
    if (parentSettings.permissions.disableBypassPermissionsMode === "disable") {
      slice.disableBypassPermissionsMode = "disable";
    }

    // Allow/additionalDirectories only if admin allows non-managed rules
    if (adminCombinedFlags.allowManagedPermissionRulesOnly !== true) {
      const { allow, additionalDirectories } = parentSettings.permissions;
      // v2.1.126 fix: was previously dropping `allow` even when domains-only was unset
      if (allow && adminCombinedFlags.sandbox?.network?.allowManagedDomainsOnly !== true) {
        slice.allow = allow;
      }
      if (additionalDirectories) slice.additionalDirectories = additionalDirectories;
    }

    if (Object.keys(slice).length > 0) filtered.permissions = slice;
  }

  // sandbox: similar restrictive-only filter
  if (parentSettings.sandbox) {
    const sandboxSlice = {};
    if (parentSettings.sandbox.enabled === true)             sandboxSlice.enabled = true;
    if (parentSettings.sandbox.failIfUnavailable === true)   sandboxSlice.failIfUnavailable = true;
    if (parentSettings.sandbox.allowUnsandboxedCommands === false) sandboxSlice.allowUnsandboxedCommands = false;
    if (parentSettings.sandbox.autoAllowBashIfSandboxed === false) sandboxSlice.autoAllowBashIfSandboxed = false;

    // network slice
    if (parentSettings.sandbox.network) {
      const network = pickKeys(parentSettings.sandbox.network, ["deniedDomains"]);
      if (parentSettings.sandbox.network.allowManagedDomainsOnly === true) {
        network.allowManagedDomainsOnly = true;
      }
      if (adminCombinedFlags.sandbox?.network?.allowManagedDomainsOnly !== true
          && parentSettings.sandbox.network.allowedDomains) {
        network.allowedDomains = parentSettings.sandbox.network.allowedDomains;
      }
      if (Object.keys(network).length > 0) sandboxSlice.network = network;
    }

    // filesystem slice
    if (parentSettings.sandbox.filesystem) {
      const filesystem = pickKeys(parentSettings.sandbox.filesystem, ["denyRead", "denyWrite"]);
      if (parentSettings.sandbox.filesystem.allowManagedReadPathsOnly === true) {
        filesystem.allowManagedReadPathsOnly = true;
      }
      if (adminCombinedFlags.sandbox?.filesystem?.allowManagedReadPathsOnly !== true
          && parentSettings.sandbox.filesystem.allowRead) {
        filesystem.allowRead = parentSettings.sandbox.filesystem.allowRead;
      }
      if (Object.keys(filesystem).length > 0) sandboxSlice.filesystem = filesystem;
    }

    if (Object.keys(sandboxSlice).length > 0) filtered.sandbox = sandboxSlice;
  }

  return filtered;
}

// Mapping: Tm8→applyParentSlice, H→parentSettings, $→adminCombinedFlags, aR$→pickKeys,
//   q→filtered, _→slice/network/filesystem, K→strictPlugin
```

### The "restrictive-only" principle

The filter accepts from the parent tier:
- **Always**: `*Only` flags (true means restrict), `deniedMcpServers`, `strictPluginOnlyCustomization`, `permissions.deny`, `permissions.ask`, `disableBypassPermissionsMode === "disable"`, `sandbox.enabled === true`, `failIfUnavailable === true`, `allowUnsandboxedCommands === false`, `autoAllowBashIfSandboxed === false`, `network.deniedDomains`, `filesystem.denyRead`, `filesystem.denyWrite`
- **Conditionally** (admin allows): `permissions.allow`, `permissions.additionalDirectories`, `network.allowedDomains`, `filesystem.allowRead`

Each "conditionally" gate is the admin's `*Only` flag — if admin says "only my rules allowed," parent's allowing rules are dropped.

### The v2.1.126 fix — `allowManagedDomainsOnly` was being ignored

Pre-v2.1.126, the check `if (A && $.sandbox?.network?.allowManagedDomainsOnly !== !0)` on the `permissions.allow` line wasn't there — parent allow rules were always merged regardless of the admin's domains-only flag. This was a bug: an admin who set `allowManagedDomainsOnly: true` to lock down to managed domains wasn't blocking parent allows.

The fix threads the check correctly. Note this is a *cross-key dependency*: the sandbox.network flag controls the permissions.allow merge. Why? Because allow rules can include `WebFetch(domain:*)` rules that bypass domain restrictions. So the domains-only flag must also gate the permission-allow merge.

The same pattern exists for `allowManagedReadPathsOnly` (filesystem flag) and the read-permission paths.

---

## 4. The Gate — `isMergeEnabled` (`Gm8`)

```javascript
// ============================================
// isParentMergeEnabled - Check if parent tier should merge with admin
// Location: cli_inner_pretty.js:52043-52045
// ============================================

// ORIGINAL (for source lookup):
function Gm8(H) {
  return !H || H.parentSettingsBehavior === "merge";
}

// READABLE (for understanding):
function isParentMergeEnabled(adminSettings) {
  // If there's no admin tier → merge applies (parent is the sole policy)
  // If admin tier exists → only merge when admin opts in via parentSettingsBehavior
  return !adminSettings || adminSettings.parentSettingsBehavior === "merge";
}

// Mapping: Gm8→isParentMergeEnabled, H→adminSettings
```

### Key insight — defaults to drop, opts in to merge

The default (no `parentSettingsBehavior` key, or set to `"first-wins"`) drops the parent when admin exists. The admin must **explicitly** set `parentSettingsBehavior: "merge"` to honor parent. This is *fail-secure* — silent presence of the parent tier doesn't add it; the admin has to consent.

The asymmetry: when **no admin exists**, the parent applies as a sole policy tier. This is what makes the SDK usable without an admin tier — the parent can still set deny rules, sandbox config, etc.

---

## 5. The Caller — `mergeAdminAndParentTiers` (`MDq`, `uI9`)

```javascript
// In MDq (chunks `_top_*`, line 52104-52131)
let M = [q, _, z].filter((J) => J !== null),    // [policyHelper, fileSettings, parentSettings]
  w = M[0] ?? null,                              // adminWinner — highest-precedence
  D = {                                          // combined restrictive flags across all tiers
    allowManagedPermissionRulesOnly: M.some(...) || void 0,
    forceLoginOrgUUID: M.find(...),
    allowedMcpServers: M.find(...),
    sandbox: {
      network: { allowManagedDomainsOnly: M.some((J) => J.sandbox?.network?.allowManagedDomainsOnly === !0) || void 0 },
      filesystem: { allowManagedReadPathsOnly: M.some((J) => J.sandbox?.filesystem?.allowManagedReadPathsOnly === !0) || void 0 },
    },
  },
  j = f && Gm8(w) ? Tm8(f, D) : null;            // ← parent slice ONLY when merge enabled
return { tiers: M, admin: w, parentSlice: j, errors: $ };
```

Then `uI9` (line 52132-52137) returns the tier list including the parent slice:

```javascript
function uI9(H) {
  let $ = H.helper?.();
  if ($) return [$];
  let { tiers: q, parentSlice: K } = MDq(H);
  return K ? [...q, K] : q;
}
```

The parent slice is **appended** to the end — making it the **lowest-precedence** tier. The admin winner takes precedence; the parent slice provides restrictive rules that admin didn't explicitly block.

---

## 6. The Companion Fix — `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` Now Honored (v2.1.126)

The v2.1.126 changelog note: "`allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored fix".

Pre-v2.1.126, these two flags (sandbox.network and sandbox.filesystem) were *defined* in the schema and *parsed* into settings, but **not threaded into the tier-merge logic**. So an admin who set them got the schema validation but no actual restriction.

The fix is in `MDq` — the `D` (combined flags) object now includes these flags, and `Tm8` consults them when deciding whether parent's `allowedDomains`/`allowRead` can layer in. The fix is *correct existing intent* — the flags were always supposed to work this way, but the wiring was missing.

---

## 7. Why This Is Important for Enterprises

Enterprise IT teams use Claude Code via:

1. **Managed settings** (admin tier) — pushed via MDM/policy/registry, sets enterprise-wide restrictions
2. **SDK with `Options.managedSettings`** — used by internal tools that need stricter rules

Pre-fix, an internal tool's restrictions could be *overridden* by the local admin tier (the global enterprise policy). This was the wrong precedence — the SDK consumer should typically be **stricter** than the global policy.

`parentSettingsBehavior: "merge"` lets the admin opt-in: "for some SDK consumers, layer their restrictions in." This is the default for any internal tool that needs to enforce additional rules beyond global policy.

Example: an enterprise has a global `denyManagedDomains: ["api.bad-site.com"]`. An internal CI tool with `parentSettingsBehavior: "merge"` (set in admin) adds `denyManagedDomains: ["api.internal-prod-db.com"]` via its `Options.managedSettings`. The result: both domains are denied. Without merge, only the global one was denied; the CI's extra restriction was silently dropped.

---

## 8. The Telemetry / Visibility Story

The merge happens silently — no log message about "merging parent tier" because it's the **expected** behavior under `merge` mode. The only feedback is *behavioral*: an admin can see their restrictions are enforced by trying actions that should be denied.

If the admin sees their `parentSettingsBehavior: "merge"` setting isn't taking effect, the troubleshooting path is:
1. `claude /doctor` or similar diagnostic showing the loaded settings
2. Inspect `getSettings('policySettings')` and `getSettings('parent')` to see the tiers
3. Confirm the `*Only` flags are correctly set

There's no telemetry **of** the merge itself because the team treats it as table-stakes correctness, not a feature switch.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission.md`](../00_overview/symbol_additions_v2_1_142_permission.md) — Symbols introduced/changed in this module
> - [`symbol_index_infra_platform.md`](../../../claude_code_v_2.1.112/analyze/00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions and constants in this document:
- `isParentMergeEnabled` (`Gm8`) — Returns true when admin allows parent-merge (or no admin exists)
- `applyParentSlice` (`Tm8`) — Filters parent tier to restrictive-only directives, respecting admin's `*Only` flags
- `mergeAdminAndParentTiers` (`MDq`) — Top-level multi-tier collector that produces `{ tiers, admin, parentSlice }`
- `collectAllTiers` (`uI9`) — Returns full tier list (admin + parent slice if merged)
- `getEffectiveSettings` (`wDq`) — Walks tiers, applies precedence, returns merged settings object
- `pickKeys` (`aR$`) — Helper to subset an object to a key allowlist
- `parentSettingsBehavior` settings key — `"first-wins" | "merge"`, admin-tier only
- `allowManagedPermissionRulesOnly` flag — Drops parent `permissions.allow` when admin set true
- `sandbox.network.allowManagedDomainsOnly` flag — v2.1.126 wiring fix; drops parent `allowedDomains`
- `sandbox.filesystem.allowManagedReadPathsOnly` flag — v2.1.126 wiring fix; drops parent `allowRead`
- `strictPluginOnlyCustomization` flag — Parent-honored restrictive option
- `deniedMcpServers` — Parent-honored deny list
- `disableBypassPermissionsMode === "disable"` — Parent-honored disabler
