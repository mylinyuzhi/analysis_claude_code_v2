# `sandbox.network.deniedDomains` — Universal-Priority Domain Block List

> **Landing:** v2.1.113 — *"Added `sandbox.network.deniedDomains` setting to block specific domains even when a broader `allowedDomains` wildcard would otherwise permit them."*

This document covers the schema addition, the merge behavior across the settings tier chain, and the runtime filter that consults the denied list **before** any allow list. The deniedDomains list is unique among sandbox network configs in that it is **always merged from every settings source**, regardless of `allowManagedDomainsOnly`.

---

## The Threat Model

Before 2.1.113, an admin who wanted to allow `*.example.com` traffic but block `evil.example.com` (e.g., a known-bad subdomain, a deprecated host, or a leaky telemetry endpoint owned by the same org) had two options, both bad:

1. **Drop the wildcard.** Replace `*.example.com` with an explicit list of every subdomain. Brittle: every new subdomain requires a policy push.
2. **Layer a network proxy.** Front Claude's network through an admin-controlled HTTP proxy that returns 403 for the bad host. Heavy: separate infra, separate observability, separate breakage modes.

`deniedDomains` is the lightweight third option: a list of patterns checked **before** `allowedDomains`, with wildcard syntax identical to `allowedDomains`. A host matched by `deniedDomains` is blocked even if `allowedDomains` would otherwise admit it.

---

## Schema Addition

```javascript
// ============================================
// SandboxNetworkConfigSchema - Sandbox network settings (v2.1.142 with deniedDomains)
// Location: cli_inner_pretty.js:48253-48306 (Xh9 schema)
// ============================================

// ORIGINAL (for source lookup):
(Xh9 = yH(() =>
  y
    .object({
      allowedDomains: y.array(y.string()).optional(),
      deniedDomains: y
        .array(y.string())
        .optional()
        .describe(
          "Domains that are always blocked, even if matched by allowedDomains. Supports the same wildcard syntax as allowedDomains. Merged from all settings sources regardless of allowManagedDomainsOnly.",
        ),
      allowManagedDomainsOnly: y
        .boolean()
        .optional()
        .describe(/* ... */),
      // ...
    })
    .optional(),
))

// READABLE (for understanding):
const SandboxNetworkConfigSchema = lazySchema(() =>
  z
    .object({
      allowedDomains: z.array(z.string()).optional(),
      deniedDomains: z
        .array(z.string())
        .optional()
        .describe(
          "Domains that are always blocked, even if matched by allowedDomains. " +
          "Supports the same wildcard syntax as allowedDomains. " +
          "Merged from all settings sources regardless of allowManagedDomainsOnly.",
        ),
      allowManagedDomainsOnly: z.boolean().optional().describe(/* ... */),
      // ...
    })
    .optional(),
);

// Mapping: Xh9→SandboxNetworkConfigSchema, yH→lazySchema, y→z
```

The schema describes itself explicitly: **"Merged from all settings sources regardless of allowManagedDomainsOnly."** That phrase is the load-bearing contract — every consumer must honor it.

---

## Policy-Tier Merge Behavior

The settings merger (`Tm8`) explicitly omits `deniedDomains` from the `allowManagedDomainsOnly` gating:

```javascript
// ============================================
// policyTierProjection - Projects parent-tier sandbox slice onto admin slice
// Location: cli_inner_pretty.js:52046-52088 (Tm8 function)
// ============================================

// ORIGINAL (for source lookup):
function Tm8(H, $) {
  let q = {};
  // ... non-sandbox keys ...
  if (H.sandbox) {
    let { network: _, filesystem: A } = H.sandbox,
      z = {};
    if (H.sandbox.enabled === !0) z.enabled = !0;
    // ...
    if (_) {
      let Y = aR$(_, ["deniedDomains"]);
      if (_.allowManagedDomainsOnly === !0) Y.allowManagedDomainsOnly = !0;
      if ($.sandbox?.network?.allowManagedDomainsOnly !== !0 && _.allowedDomains) Y.allowedDomains = _.allowedDomains;
      if (Object.keys(Y).length > 0) z.network = Y;
    }
    // ...
  }
  return q;
}

// READABLE (for understanding):
function policyTierProjection(parentTier, mergedAdminFlags) {
  const projected = {};
  // ... non-sandbox keys ...
  if (parentTier.sandbox) {
    const { network: parentNet, filesystem: parentFs } = parentTier.sandbox;
    const sandboxProjection = {};
    if (parentTier.sandbox.enabled === true) sandboxProjection.enabled = true;
    // ...
    if (parentNet) {
      // pickKeys → take ONLY deniedDomains from this tier's network block.
      // deniedDomains always survives regardless of admin's allowManagedDomainsOnly.
      const networkProjection = pickKeys(parentNet, ["deniedDomains"]);
      // The flag itself escalates if ANY parent tier says true.
      if (parentNet.allowManagedDomainsOnly === true) {
        networkProjection.allowManagedDomainsOnly = true;
      }
      // allowedDomains: only propagate if admin tier did NOT lock to managed-only.
      if (mergedAdminFlags.sandbox?.network?.allowManagedDomainsOnly !== true && parentNet.allowedDomains) {
        networkProjection.allowedDomains = parentNet.allowedDomains;
      }
      if (Object.keys(networkProjection).length > 0) sandboxProjection.network = networkProjection;
    }
    // ...
  }
  return projected;
}

// Mapping: Tm8→policyTierProjection, H→parentTier, $→mergedAdminFlags, aR$→pickKeys, _→parentNet, A→parentFs
```

### Algorithm

**What it does:** When merging tiers in the managed-settings chain, projects the parent tier's `sandbox` block down to only the fields that are policy-controlled (admin gates + universal denies).

**How it works:**

1. **Always extract `deniedDomains`.** `pickKeys(parentNet, ["deniedDomains"])` grabs that field unconditionally — no `allowManagedDomainsOnly` check.
2. **Escalate the lock flag.** `allowManagedDomainsOnly: true` on any tier escalates. Once a higher-priority tier says "lock to managed", lower tiers can never widen the allowlist.
3. **Conditionally extract `allowedDomains`.** If the admin slice (highest priority tier) has `allowManagedDomainsOnly: true`, this tier's `allowedDomains` are dropped — the admin has chosen to ignore non-admin allow lists. Otherwise propagate them.

**Why this approach:**

- **Defense-in-depth.** A denied host MUST stay denied. Letting `allowManagedDomainsOnly` mask a deny would create a config foot-gun: an admin who flips `allowManagedDomainsOnly: true` would silently lose user-tier denies, possibly re-enabling traffic to a host their own user tried to block.
- **Asymmetric trust direction.** Allowing more network access is privilege expansion; denying is privilege contraction. The merge always tilts toward the safer direction.

**Key insight:** `deniedDomains` is the *only* sandbox network field that gets pickKey'd out of a parent tier unconditionally — every other field is gated. The schema description "Merged from all settings sources regardless of allowManagedDomainsOnly" is enforced exactly here, on this one line: `let Y = aR$(_, ["deniedDomains"]);`.

---

## Final-Stage Domain List Assembly

After tier merge, the runtime sandbox config builder concatenates denied lists from every tier in the chain plus the deny-rule mirror from `permissions.deny: WebFetch(domain:...)`:

```javascript
// ============================================
// sandboxConfigBuilder - Assembles network.allowed/deniedDomains
// Location: cli_unpack_pretty/decls/functions/KY$.js (full body)
// ============================================

// ORIGINAL (for source lookup):
function KY$(H) {
  let $ = H.permissions || {},
    q = WPH(),
    K = q.some((I) => I.sandbox?.network?.allowManagedDomainsOnly === !0),
    _ = q.some((I) => I.sandbox?.filesystem?.allowManagedReadPathsOnly === !0),
    A = [],   // allowed
    z = [];   // denied
  if (K) {
    for (let I of q) {
      for (let h of I.sandbox?.network?.allowedDomains || []) A.push(h);
      for (let h of I.permissions?.allow || []) {
        let C = vUH(h);
        if (C.toolName === FD && C.ruleContent?.startsWith("domain:")) A.push(C.ruleContent.substring(7));
      }
    }
  } else {
    for (let I of H.sandbox?.network?.allowedDomains || []) A.push(I);
    for (let I of $.allow || []) {
      let h = vUH(I);
      if (h.toolName === FD && h.ruleContent?.startsWith("domain:")) A.push(h.ruleContent.substring(7));
    }
  }
  // deniedDomains: always merged from effective config (post-tier-merge)
  // PLUS permissions.deny WebFetch(domain:...) rules from ALL sources.
  for (let I of H.sandbox?.network?.deniedDomains || []) z.push(I);
  for (let I of $.deny || []) {
    let h = vUH(I);
    if (h.toolName === FD && h.ruleContent?.startsWith("domain:")) z.push(h.ruleContent.substring(7));
  }
  // ... filesystem, ripgrep, etc ...
  return {
    network: /* ... */ {
      allowedDomains: A,
      deniedDomains: z,
      // ...
    },
    // ...
  };
}

// READABLE (for understanding):
function buildSandboxConfig(effectiveSettings) {
  const permissions = effectiveSettings.permissions || {};
  const policyTiers = getAllPolicyTierSettings();
  const lockToManagedDomains = policyTiers.some(
    (tier) => tier.sandbox?.network?.allowManagedDomainsOnly === true
  );
  const lockToManagedReadPaths = policyTiers.some(
    (tier) => tier.sandbox?.filesystem?.allowManagedReadPathsOnly === true
  );
  const allowed = [];
  const denied = [];

  // Allowed: gated by lock flag.
  if (lockToManagedDomains) {
    // Only managed tiers contribute.
    for (const tier of policyTiers) {
      for (const dom of tier.sandbox?.network?.allowedDomains || []) allowed.push(dom);
      for (const allowRule of tier.permissions?.allow || []) {
        const parsed = parsePermissionRule(allowRule);
        if (parsed.toolName === WEB_FETCH && parsed.ruleContent?.startsWith("domain:")) {
          allowed.push(parsed.ruleContent.substring(7));
        }
      }
    }
  } else {
    // Effective merged settings contribute.
    for (const dom of effectiveSettings.sandbox?.network?.allowedDomains || []) allowed.push(dom);
    for (const allowRule of permissions.allow || []) {
      const parsed = parsePermissionRule(allowRule);
      if (parsed.toolName === WEB_FETCH && parsed.ruleContent?.startsWith("domain:")) {
        allowed.push(parsed.ruleContent.substring(7));
      }
    }
  }

  // Denied: ALWAYS from effective settings + ALL deny rules (no lock-flag gating).
  for (const dom of effectiveSettings.sandbox?.network?.deniedDomains || []) denied.push(dom);
  for (const denyRule of permissions.deny || []) {
    const parsed = parsePermissionRule(denyRule);
    if (parsed.toolName === WEB_FETCH && parsed.ruleContent?.startsWith("domain:")) {
      denied.push(parsed.ruleContent.substring(7));
    }
  }

  return {
    network: { allowedDomains: allowed, deniedDomains: denied, /* ... */ },
    // ...
  };
}

// Mapping: KY$→buildSandboxConfig, H→effectiveSettings, q→policyTiers, K→lockToManagedDomains,
//          _→lockToManagedReadPaths, A→allowed, z→denied, WPH→getAllPolicyTierSettings,
//          vUH→parsePermissionRule, FD→WEB_FETCH constant
```

### Why two paths for allowed but one path for denied?

**Allowed (gated):**
```
if (lockToManagedDomains)
  iterate policyTiers   ← admin-only sources
else
  use effectiveSettings ← merged from all sources
```

**Denied (unconditional):**
```
use effectiveSettings   ← always merged from all sources
```

The asymmetry mirrors the security policy: an admin can *narrow* allowed traffic to admin-only sources, but **cannot** narrow denied traffic. A user can always add to the deny list. This means:

- An admin setting `allowManagedDomainsOnly: true` cannot accidentally re-enable user-blocked hosts.
- A user setting `deniedDomains: ["leak-tracker.example.com"]` always wins, even if an admin globally allowed `*.example.com`.

This is the same direction as "additionalDirectories": users can add deny rules / extra denies, but the lock flag is about taking away allow rights, not about gagging users.

---

## Runtime Domain Filter

```javascript
// ============================================
// networkPermissionFilter - Per-request domain check
// Location: cli_inner_pretty.js:196344-196358 (pFK function)
// ============================================

// ORIGINAL (for source lookup):
async function pFK(H, $, q) {
  if (!e9) return (e6("No config available, denying network request"), !1);
  if (!nz$($)) return (e6(`Denying malformed host: ${JSON.stringify($)}:${H}`, { level: "error" }), !1);
  let K = NUK($) ?? $;
  for (let _ of e9.network.deniedDomains) if (hA6(K, _)) return (e6(`Denied by config rule: ${$}:${H}`), !1);
  for (let _ of e9.network.allowedDomains) if (hA6(K, _)) return (e6(`Allowed by config rule: ${$}:${H}`), !0);
  if (!q) return (e6(`No matching config rule, denying: ${$}:${H}`), !1);
  e6(`No matching config rule, asking user: ${$}:${H}`);
  try {
    if (await q({ host: $, port: H })) return (e6(`User allowed: ${$}:${H}`), !0);
    else return (e6(`User denied: ${$}:${H}`), !1);
  } catch (_) {
    return (e6(`Error in permission callback: ${_}`, { level: "error" }), !1);
  }
}

// READABLE (for understanding):
async function networkPermissionFilter(port, host, userPromptCallback) {
  if (!sandboxConfig) {
    log("No config available, denying network request");
    return false;
  }
  if (!isValidHost(host)) {
    log(`Denying malformed host: ${JSON.stringify(host)}:${port}`, { level: "error" });
    return false;
  }
  // Canonicalize: strip port, lowercase, unwrap IDN, etc.
  const canonical = canonicalizeHost(host) ?? host;

  // (1) Denied list wins. Always checked first.
  for (const pattern of sandboxConfig.network.deniedDomains) {
    if (matchesHostPattern(canonical, pattern)) {
      log(`Denied by config rule: ${host}:${port}`);
      return false;
    }
  }

  // (2) Allowed list. Match → allow.
  for (const pattern of sandboxConfig.network.allowedDomains) {
    if (matchesHostPattern(canonical, pattern)) {
      log(`Allowed by config rule: ${host}:${port}`);
      return true;
    }
  }

  // (3) Fallthrough: prompt the user, or deny if no prompt available.
  if (!userPromptCallback) {
    log(`No matching config rule, denying: ${host}:${port}`);
    return false;
  }
  log(`No matching config rule, asking user: ${host}:${port}`);
  try {
    return await userPromptCallback({ host, port })
      ? (log(`User allowed: ${host}:${port}`), true)
      : (log(`User denied: ${host}:${port}`), false);
  } catch (err) {
    log(`Error in permission callback: ${err}`, { level: "error" });
    return false;
  }
}

// Mapping: pFK→networkPermissionFilter, H→port, $→host, q→userPromptCallback,
//          e9→sandboxConfig, nz$→isValidHost, NUK→canonicalizeHost, hA6→matchesHostPattern
```

### Algorithm

**What it does:** Decides whether a single outbound network request (host:port) is permitted under the current sandbox configuration. Called by both the HTTP proxy (`bUK`) and SOCKS proxy (`gUK`) for every connection.

**How it works:**

1. **Empty-config short-circuit.** Without a loaded sandbox config, deny everything. This prevents a race during startup from accidentally allowing traffic before config is applied.
2. **Malformed-host short-circuit.** A host that fails validation (empty, contains shell metacharacters, etc.) is denied with an *error* log level — these are usually bugs or attacks, not legitimate hosts.
3. **Canonicalize.** Strip wrapper characters from IPv6 brackets, lowercase, unwrap punycode. The `hA6` pattern matcher works on canonical form.
4. **Denied list wins.** Iterate `deniedDomains` first. A single match returns false immediately — no further checks.
5. **Allowed list.** Iterate `allowedDomains`. A single match returns true.
6. **User prompt fallthrough.** If a UI callback is provided (CLI session), prompt the user. The user's answer is logged with `User allowed/denied`.
7. **No-callback fallthrough.** Background / non-interactive sessions deny by default.

**Why this order:**

- **Denied first** is the security invariant. If both lists somehow overlap (e.g., `allowedDomains: ["*.example.com"]` + `deniedDomains: ["evil.example.com"]`), the deny must win. Putting the deny check first encodes that directly.
- **Allow then prompt** keeps the prompt rate low for known-good hosts. A user who allow-listed `github.com` doesn't get prompted on every git fetch.
- **Default-deny on fallthrough** mirrors firewall best practice: an unknown host is a potentially-malicious host until the user (or admin) opts in.

**Key insight:** The denied list has **no escape valve** at this layer — even a user-prompt callback can't override a config-level deny. The only way to remove a host from the deny list is to remove it from settings and reload. This is by design: an admin who blocks a host must trust that a session prompt cannot accidentally undo their policy.

---

## `getNetworkPermissionConfig` Snapshot (for `/doctor`)

For the doctor / status display, the sandbox config is exposed via a snapshot:

```javascript
// ============================================
// getNetworkPermissionConfig - Snapshot for doctor display
// Location: cli_inner_pretty.js:196505-196510 (ia1 function)
// ============================================

// ORIGINAL (for source lookup):
function ia1() {
  if (!e9) return {};
  let H = e9.network.allowedDomains,
    $ = e9.network.deniedDomains;
  return { ...(H.length > 0 && { allowedHosts: H }), ...($.length > 0 && { deniedHosts: $ }) };
}

// READABLE (for understanding):
function getNetworkPermissionConfig() {
  if (!sandboxConfig) return {};
  const allowed = sandboxConfig.network.allowedDomains;
  const denied = sandboxConfig.network.deniedDomains;
  return {
    ...(allowed.length > 0 && { allowedHosts: allowed }),
    ...(denied.length > 0 && { deniedHosts: denied }),
  };
}

// Mapping: ia1→getNetworkPermissionConfig, e9→sandboxConfig
```

`/doctor` displays this as "Allowed hosts: ...  Denied hosts: ..." so an operator can verify their `deniedDomains` made it through the tier merge before troubleshooting blocked traffic.

---

## Wildcard Syntax

The schema description says `deniedDomains` "Supports the same wildcard syntax as allowedDomains." That syntax is implemented by `hA6` (`matchesHostPattern`):

```javascript
// ============================================
// matchesHostPattern - Domain wildcard matcher
// Location: cli_inner_pretty.js:196333-196343 (hA6 function)
// ============================================

// ORIGINAL (for source lookup):
function hA6(H, $) {
  let q = H.toLowerCase();
  if ($.startsWith("*.")) {
    let K = $.slice(2).toLowerCase();
    if (q === K) return !0;
    return q.endsWith("." + K);
  }
  return q === $.toLowerCase();
}

// READABLE (for understanding):
function matchesHostPattern(host, pattern) {
  const hostLower = host.toLowerCase();
  if (pattern.startsWith("*.")) {
    // Wildcard form: "*.example.com" matches "example.com" AND "sub.example.com"
    // but NOT "x.example.com.evil.com" (must be a suffix component).
    const suffix = pattern.slice(2).toLowerCase();
    if (hostLower === suffix) return true;
    return hostLower.endsWith("." + suffix);
  }
  // Exact-match form: case-insensitive equality.
  return hostLower === pattern.toLowerCase();
}

// Mapping: hA6→matchesHostPattern, H→host, $→pattern
```

**Two forms:**

| Pattern | Matches | Does NOT match |
|---------|---------|----------------|
| `evil.example.com` | `evil.example.com` (case-insensitive) | anything else |
| `*.example.com` | `example.com`, `a.example.com`, `b.c.example.com` | `evilexample.com`, `x.example.com.attacker.com` |

The "suffix component" form (`endsWith("." + suffix)`) prevents domain-confusion attacks where an attacker registers `attacker-example.com` to slip past `*.example.com` patterns. The leading dot enforces a label boundary.

---

## Why `deniedDomains` Has Its Own Field (vs. Just Using `permissions.deny`)

The `permissions.deny` list already supports `WebFetch(domain:...)` rules, and (as shown above in `KY$`) those rules are merged into the runtime `deniedDomains` list. So why expose `sandbox.network.deniedDomains` as a separate field?

The answer is **layering clarity**:

1. **`permissions.deny: WebFetch(domain:...)`** is the *permission rule* form. It documents that a tool — WebFetch — is denied for a particular argument shape.
2. **`sandbox.network.deniedDomains`** is the *network primitive* form. It documents that **the sandbox** blocks a host at the proxy layer, irrespective of which tool tries to reach it. MCP HTTP servers, plugin fetches, Bash `curl`/`wget` invocations under bwrap — all hit the same proxy filter.

A `WebFetch` deny only blocks the WebFetch tool. A `deniedDomains` entry blocks **any process** routing through the sandbox network proxy. Admins running a multi-tool sandbox want the second guarantee; the first is too narrow.

In practice both feed the same final list (see `KY$` above), so a user writing only `permissions.deny: WebFetch(domain:evil.com)` gets the same protection as one writing `sandbox.network.deniedDomains: ["evil.com"]`. The dual surface is for ergonomics: pick whichever feels more natural for the policy you're trying to express.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `SandboxNetworkConfigSchema` (Xh9) — settings schema with `deniedDomains` field
- `policyTierProjection` (Tm8) — pickKeys `deniedDomains` from every tier unconditionally
- `buildSandboxConfig` (KY$) — assembles final runtime `network.deniedDomains` list
- `networkPermissionFilter` (pFK) — runtime per-request filter (checks denied list first)
- `getNetworkPermissionConfig` (ia1) — `/doctor` snapshot accessor
- `matchesHostPattern` (hA6) — wildcard pattern matcher
- `canonicalizeHost` (NUK) — host normalizer
- `getAllPolicyTierSettings` (WPH) — tier-chain accessor
- `parsePermissionRule` (vUH) — parses `WebFetch(domain:...)` strings
