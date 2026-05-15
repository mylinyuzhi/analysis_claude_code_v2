# `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` Cross-Tier Fix

> **Landing:** v2.1.126 — *"Security: Fixed `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` being ignored when a higher-priority managed-settings source lacked a `sandbox` block"*

This document covers the v2.1.126 security fix that introduces a **parent-slice projection** during managed-settings tier merging. Before the fix, an admin could set `allowManagedDomainsOnly: true` in a lower-priority managed tier and have it silently dropped because a higher-priority tier (without `sandbox`) won the merge.

---

## The Bug

The managed-settings system has multiple tiers, ordered by priority:

| Priority | Tier | Source |
|----------|------|--------|
| 1 (highest) | helper | A vendored binary that resolves managed settings on-demand (corp MDM) |
| 2 | remote | Periodically-pulled URL (HTTP-based MDM) |
| 3 | plist / HKLM | OS-managed policy (macOS plist, Windows HKLM registry) |
| 4 (lowest of managed) | file | `/etc/claude-code/managed-settings.json` (or `managed-settings.d/`) |

When merging, the higher-priority tier wins on conflict. Until 2.1.126, the merge was a straight key-wise overlay: `merged = { ...lower, ...higher }`. That meant **a tier setting `allowManagedDomainsOnly: true` would be silently lost** if a higher-priority tier had any other policy keys but no `sandbox` block.

### Reproducer

Suppose an admin configures:

**Tier 1 (HKLM)** — `HKLM\SOFTWARE\Policies\ClaudeCode\Settings`:
```json
{
  "permissions": {
    "deny": ["WebFetch(domain:malware.example.com)"]
  }
}
```

**Tier 2 (file)** — `/etc/claude-code/managed-settings.json`:
```json
{
  "sandbox": {
    "network": {
      "allowManagedDomainsOnly": true,
      "allowedDomains": ["*.corp.example.com"]
    }
  }
}
```

The admin's intent: HKLM contributes a global deny; the file tier contributes the corporate-only allowlist with `allowManagedDomainsOnly` enforcing that only managed allowlists count.

**Pre-2.1.126 behavior:** `{ ...lower, ...higher }` produces:
```json
{
  "permissions": {
    "deny": ["WebFetch(domain:malware.example.com)"]
  }
  // sandbox block from tier 2 was overwritten by tier 1's (absent) sandbox key
}
```

Wait — that's not quite right. JavaScript's spread doesn't overwrite-with-undefined. The actual bug was subtler: the merger took the **first tier with `sandbox` defined** as the admin slice, and only that tier's `sandbox.network.allowManagedDomainsOnly` was honored. The lower-priority tier's flag was discarded — even if it was `true`.

**Post-2.1.126 behavior:** The new `parentSlice` projection extracts policy-only flags from **every** tier and merges them up. The result:
```json
{
  "permissions": {
    "deny": ["WebFetch(domain:malware.example.com)"]
  },
  "sandbox": {
    "network": {
      "allowManagedDomainsOnly": true,      // ← propagated from tier 2
      "allowedDomains": ["*.corp.example.com"]
    }
  }
}
```

The fix: `allowManagedDomainsOnly: true` set on **any** tier propagates to the merged result.

---

## The Tier-Chain Merger

```javascript
// ============================================
// mergeManagedPolicy - Produces tiers + admin + parentSlice
// Location: cli_inner_pretty.js:52104-52131 (MDq function)
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
    D = {
      allowManagedPermissionRulesOnly: M.some((J) => J.allowManagedPermissionRulesOnly === !0) || void 0,
      forceLoginOrgUUID: M.find((J) => J.forceLoginOrgUUID !== void 0)?.forceLoginOrgUUID,
      allowedMcpServers: M.find((J) => J.allowedMcpServers !== void 0)?.allowedMcpServers,
      sandbox: {
        network: {
          allowManagedDomainsOnly: M.some((J) => J.sandbox?.network?.allowManagedDomainsOnly === !0) || void 0,
        },
        filesystem: {
          allowManagedReadPathsOnly: M.some((J) => J.sandbox?.filesystem?.allowManagedReadPathsOnly === !0) || void 0,
        },
      },
    },
    j = f && Gm8(w) ? Tm8(f, D) : null;
  return { tiers: M, admin: w, parentSlice: j, errors: $ };
}

// READABLE (for understanding):
function mergeManagedPolicy(loaderFns) {
  const errors = [];

  // Load each tier in priority order.
  const { settings: helperTier, errors: helperErrors } = loadHelperTier(loaderFns);
  errors.push(...helperErrors);
  const { settings: remoteTier, errors: remoteErrors } = loadRemoteTier(loaderFns);
  errors.push(...remoteErrors);
  const { settings: osTier, errors: osErrors } = loaderFns.file?.() ?? loadOsPolicyTier(loaderFns);
  errors.push(...osErrors);
  const { settings: parentChainTier, errors: parentErrors } = loadParentChainTier(loaderFns);
  errors.push(...parentErrors);

  // Managed tiers (helper → remote → os, in priority order). Filter null.
  const managedTiers = [helperTier, remoteTier, osTier].filter((t) => t !== null);
  const adminTier = managedTiers[0] ?? null;

  // Build the "merged admin flags" view used for downstream gating decisions.
  const mergedAdminFlags = {
    // OR-merge boolean policy flags: TRUE if ANY managed tier sets them true.
    allowManagedPermissionRulesOnly:
      managedTiers.some((t) => t.allowManagedPermissionRulesOnly === true) || undefined,
    // First-defined-wins for singletons.
    forceLoginOrgUUID:
      managedTiers.find((t) => t.forceLoginOrgUUID !== undefined)?.forceLoginOrgUUID,
    allowedMcpServers:
      managedTiers.find((t) => t.allowedMcpServers !== undefined)?.allowedMcpServers,
    sandbox: {
      network: {
        allowManagedDomainsOnly:
          managedTiers.some((t) => t.sandbox?.network?.allowManagedDomainsOnly === true) || undefined,
      },
      filesystem: {
        allowManagedReadPathsOnly:
          managedTiers.some((t) => t.sandbox?.filesystem?.allowManagedReadPathsOnly === true) || undefined,
      },
    },
  };

  // Parent-chain tier becomes a "slice" merged with admin gating context, but
  // only when the parent-chain settings consent to be merged (parentSettingsBehavior !== "replace").
  const parentSlice =
    parentChainTier && shouldMergeParentChain(adminTier)
      ? policyTierProjection(parentChainTier, mergedAdminFlags)
      : null;

  return { tiers: managedTiers, admin: adminTier, parentSlice, errors };
}

// Mapping: MDq→mergeManagedPolicy, YK$→loadHelperTier, YDq→loadRemoteTier,
//          AK$→loadOsPolicyTier, fK$→loadParentChainTier, Gm8→shouldMergeParentChain,
//          Tm8→policyTierProjection, M→managedTiers, w→adminTier, D→mergedAdminFlags,
//          j→parentSlice
```

### Algorithm

**What it does:** Loads all four managed-settings tiers (helper, remote, OS-policy, parent-chain), determines which is the "admin slice" (highest non-null), computes a merged-flags view for cross-tier policy gates, and produces a `parentSlice` projection.

**How it works:**

1. **Load four tiers sequentially.** Each loader returns `{ settings, errors }`. Errors accumulate (e.g., "schema error in file X line Y") but don't abort.
2. **Filter non-null managed tiers.** `managedTiers` is the subset of [helper, remote, osPolicy] that have at least some content.
3. **Pick the admin slice.** `adminTier = managedTiers[0]` — the highest-priority non-null managed source.
4. **Compute `mergedAdminFlags`.** Cross-tier projections:
   - **OR-merge booleans** (`allowManagedPermissionRulesOnly`, `allowManagedDomainsOnly`, `allowManagedReadPathsOnly`): If **any** tier says true, the merged view says true.
   - **First-defined wins** for singletons (`forceLoginOrgUUID`, `allowedMcpServers`).
5. **Build parent slice.** The parent-chain tier (a sibling-claude-instance's settings) is merged in only if both:
   - It exists.
   - The admin tier doesn't opt-out via `parentSettingsBehavior: "replace"`.
   The merge calls `policyTierProjection(parentChainTier, mergedAdminFlags)`, which extracts only policy-controlled fields (denies, lock flags) from the parent.
6. **Return both** — the full tier list, the admin slice, the parent slice, and accumulated errors.

**Why this approach:**

- **OR-merge for lock flags** is the security-correct direction. If *any* tier wants to lock the domain allowlist to managed-only, the lock applies. A lower-priority tier saying "lock down" cannot be silently bypassed by a higher tier that simply omits the flag.
- **mergedAdminFlags as a separate object** decouples "what each tier wants" from "what the policy decision should be." The downstream `Tm8` consumes `mergedAdminFlags` to know whether `allowManagedDomainsOnly` is active anywhere, even if it's projecting a single tier's slice.
- **Parent-slice projection vs. parent-chain merge.** The parent-chain tier (used when claude is launched from within another claude session via cowork/subagent) doesn't get full inheritance — only the policy slice. This prevents a "rogue parent" from injecting allow-rules into a child sandbox.

**Key insight:** The pre-2.1.126 code did `mergedFlags = adminTier` — taking only the admin tier's flags. The fix introduces `M.some((t) => t.sandbox?.network?.allowManagedDomainsOnly === !0)` — checking every tier. This is the **literal one-line fix**: changing single-tier lookup to multi-tier OR-merge.

---

## The Tier-Slice Projector

`Tm8` (already covered in [denied_domains.md](./denied_domains.md), reproduced here for the policy-flag context):

```javascript
// ============================================
// policyTierProjection - Projects parent tier's policy-controlled fields
// Location: cli_inner_pretty.js:52046-52088 (Tm8 function)
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
function policyTierProjection(parentTier, mergedAdminFlags) {
  const projected = {};

  // Lock flags: pass through if true (security-positive — locks add constraint).
  if (parentTier.allowManagedHooksOnly === true) projected.allowManagedHooksOnly = true;
  if (parentTier.allowManagedMcpServersOnly === true) projected.allowManagedMcpServersOnly = true;
  if (parentTier.allowManagedPermissionRulesOnly === true)
    projected.allowManagedPermissionRulesOnly = true;

  // Plugin restriction (multi-form).
  const pluginRestriction = parentTier.strictPluginOnlyCustomization;
  if (pluginRestriction === true || (Array.isArray(pluginRestriction) && pluginRestriction.length > 0)) {
    projected.strictPluginOnlyCustomization = pluginRestriction;
  }

  // MCP deny list always propagates.
  if (parentTier.deniedMcpServers) projected.deniedMcpServers = parentTier.deniedMcpServers;

  // Singletons: parent contributes only if admin didn't set it.
  if (mergedAdminFlags.forceLoginOrgUUID === undefined && parentTier.forceLoginOrgUUID) {
    projected.forceLoginOrgUUID = parentTier.forceLoginOrgUUID;
  }
  if (mergedAdminFlags.allowedMcpServers === undefined && parentTier.allowedMcpServers) {
    projected.allowedMcpServers = parentTier.allowedMcpServers;
  }

  // Permissions block: deny/ask always propagate; allow gated by lock flags.
  if (parentTier.permissions) {
    const permProjection = pickKeys(parentTier.permissions, ["deny", "ask"]);
    if (parentTier.permissions.disableBypassPermissionsMode === "disable") {
      permProjection.disableBypassPermissionsMode = "disable";
    }
    if (mergedAdminFlags.allowManagedPermissionRulesOnly !== true) {
      const { allow, additionalDirectories } = parentTier.permissions;
      // allow gated by BOTH the permission-rules lock AND the domains lock.
      if (allow && mergedAdminFlags.sandbox?.network?.allowManagedDomainsOnly !== true) {
        permProjection.allow = allow;
      }
      if (additionalDirectories) permProjection.additionalDirectories = additionalDirectories;
    }
    if (Object.keys(permProjection).length > 0) projected.permissions = permProjection;
  }

  // Sandbox block: same shape — denies/locks propagate, allows gated.
  if (parentTier.sandbox) {
    const { network: parentNet, filesystem: parentFs } = parentTier.sandbox;
    const sandboxProjection = {};
    if (parentTier.sandbox.enabled === true) sandboxProjection.enabled = true;
    if (parentTier.sandbox.failIfUnavailable === true) sandboxProjection.failIfUnavailable = true;
    // Note: allowUnsandboxedCommands and autoAllowBashIfSandboxed only propagate as RESTRICTIVE values (false).
    if (parentTier.sandbox.allowUnsandboxedCommands === false) sandboxProjection.allowUnsandboxedCommands = false;
    if (parentTier.sandbox.autoAllowBashIfSandboxed === false) sandboxProjection.autoAllowBashIfSandboxed = false;
    if (parentNet) {
      const networkProjection = pickKeys(parentNet, ["deniedDomains"]);
      if (parentNet.allowManagedDomainsOnly === true) networkProjection.allowManagedDomainsOnly = true;
      if (mergedAdminFlags.sandbox?.network?.allowManagedDomainsOnly !== true && parentNet.allowedDomains) {
        networkProjection.allowedDomains = parentNet.allowedDomains;
      }
      if (Object.keys(networkProjection).length > 0) sandboxProjection.network = networkProjection;
    }
    if (parentFs) {
      const fsProjection = pickKeys(parentFs, ["denyRead", "denyWrite"]);
      if (parentFs.allowManagedReadPathsOnly === true) fsProjection.allowManagedReadPathsOnly = true;
      if (mergedAdminFlags.sandbox?.filesystem?.allowManagedReadPathsOnly !== true && parentFs.allowRead) {
        fsProjection.allowRead = parentFs.allowRead;
      }
      if (Object.keys(fsProjection).length > 0) sandboxProjection.filesystem = fsProjection;
    }
    if (Object.keys(sandboxProjection).length > 0) projected.sandbox = sandboxProjection;
  }

  return projected;
}

// Mapping: Tm8→policyTierProjection, H→parentTier, $→mergedAdminFlags, aR$→pickKeys
```

### Algorithm Summary

For each policy-controlled field, the projection decides one of three handlings:

| Field type | Examples | Direction |
|------------|----------|-----------|
| **Always-restrictive booleans** | `allowManagedHooksOnly`, `allowManagedDomainsOnly`, `allowManagedPermissionRulesOnly` | Propagate if `true` (locks always escalate) |
| **Always-merge denies** | `deniedDomains`, `denyRead`, `denyWrite`, `deniedMcpServers`, `permissions.deny`, `permissions.ask` | Always propagate (denies always escalate) |
| **Gated allows** | `allowedDomains`, `allowRead`, `permissions.allow`, `additionalDirectories` | Propagate only if no lock flag is active |
| **Singletons (first-wins)** | `forceLoginOrgUUID`, `allowedMcpServers` | Propagate only if admin tier hasn't set them |
| **Restrictive-only-values** | `allowUnsandboxedCommands: false`, `autoAllowBashIfSandboxed: false` | Propagate only the restrictive value (the permissive value is the default) |

**Why this asymmetry?** Security policy composition. Denies and locks **strengthen** the policy; admin-only matters most for **weakening**. The projection preserves the "more restrictive" semantics when combining tiers.

**Key insight:** The fix isn't a single line — it's a coherent policy: **every tier may strengthen the sandbox**, but **only managed tiers may weaken it**. The pre-2.1.126 bug arose because the merger conflated "which tier wins for setting X" with "which tiers' policy flags matter for gating decisions." The fix separates the two concerns: `MDq` produces both a winning tier (`admin`) and a merged-flags view (`mergedAdminFlags`); `Tm8` consumes both.

---

## How `WPH()` Sees It

The consumer side — `getAllPolicyTierSettings` (`WPH`) — receives the unified view:

```javascript
// ============================================
// uI9 - Collects policy tier list for downstream consumers
// Location: cli_inner_pretty.js:52132-52137
// ============================================

// ORIGINAL (for source lookup):
function uI9(H) {
  let $ = H.helper?.();
  if ($) return [$];
  let { tiers: q, parentSlice: K } = MDq(H);
  return K ? [...q, K] : q;
}

// READABLE (for understanding):
function collectPolicyTierList(loaderFns) {
  // If a helper resolves, it's the single source of truth — no other tiers.
  const helperSettings = loaderFns.helper?.();
  if (helperSettings) return [helperSettings];

  // Otherwise: tier list, with parent-slice appended at the end (lowest priority).
  const { tiers, parentSlice } = mergeManagedPolicy(loaderFns);
  return parentSlice ? [...tiers, parentSlice] : tiers;
}

// Mapping: uI9→collectPolicyTierList, MDq→mergeManagedPolicy
```

`WPH()` (the cached accessor that downstream code calls) wraps `uI9` with memoization. Every subsequent consumer — `KY$` (sandbox config builder), `tz$` (bwrap path resolver), `ia1` (doctor snapshot) — iterates this list and applies tier-aware policy.

For `allowManagedDomainsOnly`, the consumer chain is:

```
KY$ (build sandbox config)
  ↓
  K = q.some((I) => I.sandbox?.network?.allowManagedDomainsOnly === !0)
  ↑
  q = WPH() = [...managedTiers, parentSlice?]   ← every tier checked
```

So a `true` on **any** tier (or in the projected parent slice) sets `K`, which then gates whether non-managed allow rules are merged in. The fix's correctness reduces to "WPH returns every tier, not just the admin one" + "the merger projects all relevant flags into `mergedAdminFlags`."

---

## Why "Security" Severity?

The CHANGELOG flags this fix as **Security**. The threat:

1. An enterprise admin enables `allowManagedDomainsOnly: true` in `/etc/claude-code/managed-settings.json` (the file tier).
2. The admin also writes an HKLM key for some other policy (e.g., MCP allowlist), which happens to *not* set `sandbox`.
3. Pre-fix: `allowManagedDomainsOnly` is silently dropped because the higher-priority HKLM tier doesn't have a `sandbox` block.
4. User-tier `allowedDomains: ["*"]` slips through.
5. Claude reaches any host the user listed, bypassing the admin's network policy.

This is a **policy escalation**: the admin's restrictive intent is silently weakened by a higher-priority tier that has nothing to say on the matter. From a Trust-Boundary perspective, the lock flag from a lower tier *should* still be enforced if no higher tier disables it — that's the whole point of layered policy.

The fix prevents this escalation by ensuring the lock applies if **any** tier asserts it, regardless of which tier is the "winner" for other fields.

---

## Edge Case: `parentSettingsBehavior: "replace"`

The merger has one escape hatch: an admin tier can set `parentSettingsBehavior: "replace"` to disable parent-slice merging entirely:

```javascript
// Gm8 (shouldMergeParentChain):
function Gm8(H) {
  return !H || H.parentSettingsBehavior === "merge";
}
// Default: "merge" (parent slice contributes).
// If admin says "replace": parent slice is dropped → only managed tiers count.
```

This lets an admin say "my managed settings completely replace whatever the parent claude session injected." Useful for hardened deployments where the parent-claude context is untrusted (e.g., a cloud orchestrator launching a child claude with its own restricted settings, where the child wants to **ignore** the parent's permissions entirely).

The default is "merge", because most cowork/subagent flows want the parent's restrictions to apply to the child. "Replace" is opt-in.

---

## Test Coverage Concern

This kind of cross-tier merge bug is hard to spot in unit tests because the failure requires:
- Multiple tiers populated simultaneously.
- The "victim" flag in a *lower*-priority tier than the "non-conflicting" tier.
- An empty `sandbox` block in the higher tier (not just a missing block — some configs explicitly write `sandbox: {}` for clarity).

The 2.1.126 fix likely came after a customer hit it in production: their HKLM policy had no `sandbox` key, and the file tier's lock flag silently disappeared. Reproducing required matching exact tier ordering and exact field shapes.

The new architecture (separate `mergedAdminFlags` from `adminTier`) makes future cross-tier bugs less likely: any policy that should "OR-merge across tiers" goes into `mergedAdminFlags` and is computed explicitly. The pattern is straightforward to extend: a future `allowManagedHooksOnly` cross-tier audit just adds another `.some(...)` line.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `mergeManagedPolicy` (MDq) — tier-chain merger, produces `tiers`, `admin`, `parentSlice`
- `policyTierProjection` (Tm8) — projects policy fields from a parent tier given merged admin flags
- `collectPolicyTierList` (uI9) — produces the tier list for WPH consumers
- `getAllPolicyTierSettings` (WPH) — cached tier-list accessor (used by all sandbox config builders)
- `shouldMergeParentChain` (Gm8) — gate for `parentSettingsBehavior: "replace"`
- `pickKeys` (aR$) — `_.pick` analogue used for slice extraction
- `loadHelperTier` (YK$), `loadRemoteTier` (YDq), `loadOsPolicyTier` (AK$), `loadParentChainTier` (fK$) — per-tier loaders
- `buildSandboxConfig` (KY$) — consumer that checks every tier for the lock flag
