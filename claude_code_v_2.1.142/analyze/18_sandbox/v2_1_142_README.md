# 18_sandbox Module Deltas — v2.1.113 → v2.1.142

> Five landings in the sandbox subsystem between v2.1.113 and v2.1.142 close gaps in the per-tier managed-settings story (deniedDomains, managed-only enforcement, custom bwrap/socat paths) and tighten the auto-allow path against `rm`/`rmdir` on critical directories. Baseline reference: [v2.1.112 18_sandbox docs](../../../claude_code_v_2.1.112/analyze/18_sandbox/README.md).

---

## Why a separate sandbox unit for 2.1.142?

The 2.1.112 18_sandbox module was organized around **subprocess hardening primitives** (PowerShell, env scrub, PID namespace, glob whitelist, Perforce). The 2.1.113→2.1.142 window does not introduce new primitives; instead it consolidates the **managed-settings policy plane** for the existing sandbox stack:

1. **Domain filter completeness** (2.1.113): `allowedDomains` accepted wildcards but had no escape valve to **subtract** a host from a broad allow rule. Operators wanting to allow `*.example.com` but block `evil.example.com` had to refuse the wildcard entirely. `deniedDomains` adds the subtraction primitive and gives it priority over every allow source.
2. **Linux/WSL bwrap discovery** (2.1.133): bwrap/socat resolution went through `which`, which fails when admins ship a custom binary outside `$PATH` (corporate jails frequently install vendored binaries under `/opt/...`). The new `sandbox.bwrapPath`/`sandbox.socatPath` managed settings let admins point at an absolute path; the resolver consults the policy tier chain first and falls back to `which`.
3. **Policy-tier merge correctness** (2.1.126): Until 2.1.126, `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` were silently ignored when set in a higher-priority managed source whose `sandbox` block was empty. The fix introduces a `parentSlice` projection: every tier's policy-only flags get propagated even when the rest of its block is absent.
4. **Auto-allow guardrail** (2.1.116): `autoAllowBashIfSandboxed` blanket-approved any safe-looking shell command. The dangerous-path safety check makes `rm -rf /` (and analogues against `$HOME`, `/etc/...`, `/usr/...`) escape auto-allow and require explicit human approval.
5. **macOS Mach service allowlist** (2.1.97, baseline): `allowMachLookup` (already present in 2.1.112 baseline) is referenced here for cross-link, as it interacts with `enableWeakerNetworkIsolation` in 2.1.142.

The unit treats each landing as an independent slice of the same policy stack.

---

## Documents in this unit

| Document | Landing | Purpose |
|----------|---------|---------|
| [denied_domains.md](./denied_domains.md) | v2.1.113 | `sandbox.network.deniedDomains` — universal-priority block list, schema + merge + runtime filter |
| [bwrap_socat_paths.md](./bwrap_socat_paths.md) | v2.1.133 | `sandbox.bwrapPath` / `sandbox.socatPath` — absolute-path overrides for bwrap/socat (admin-only) |
| [managed_domains_only_fix.md](./managed_domains_only_fix.md) | v2.1.126 | Parent-slice projection so `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` survive empty `sandbox` blocks in higher tiers |
| [dangerous_rm_safety.md](./dangerous_rm_safety.md) | v2.1.116 | rm/rmdir target-path check inside `autoAllowBashIfSandboxed` |
| [pid_namespace_isolation.md](./pid_namespace_isolation.md) | v2.1.98 (baseline cross-link) | Updated `apply-seccomp` lookup helper and bwrap-path error message in 2.1.142 |
| [apply_seccomp_helper.md](./apply_seccomp_helper.md) | v2.1.92 (baseline cross-link) | Architecture-aware `apply-seccomp` binary lookup; cross-link to network bridge integration |

Plus shared symbol additions: [../00_overview/symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

---

## Landings Timeline (2.1.113 → 2.1.142)

| Version | Landing | Impact | Surface |
|---------|---------|--------|---------|
| **2.1.113** | `sandbox.network.deniedDomains` | Universal-priority host block list | Settings schema + runtime filter (`pFK`) |
| **2.1.116** | rm/rmdir dangerous-path safety in auto-allow | `rm -rf /`/`rm -rf $HOME` cannot auto-allow even under `autoAllowBashIfSandboxed` | Bash permission path (`v64`) |
| **2.1.126** | Managed-only flag parent-slice projection | `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` now reliably enforced across tiers | Settings merge (`MDq`, `Tm8`) |
| **2.1.133** | `sandbox.bwrapPath` / `sandbox.socatPath` | Linux/WSL admins point at vendored bwrap/socat outside `$PATH` | Settings schema + resolver (`tz$`, `MgK`) |

---

## Architecture: The Managed-Settings Sandbox Stack (post-2.1.142)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Settings Tier Chain (highest priority first)                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │ helper       │ → │ remote       │ → │ plist/HKLM   │ → │ file         │     │
│  │ (mdm helper) │   │ (admin pull) │   │ (OS policy)  │   │ (managed-…json)│   │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘     │
│                                                                                │
│  Each tier may contain (Tm8 projection — v2.1.126 fix):                        │
│    • allowManagedHooksOnly / allowManagedMcpServersOnly / *PermissionRulesOnly │
│    • sandbox.network.{deniedDomains, allowedDomains, allowManagedDomainsOnly}  │
│    • sandbox.filesystem.{allowRead, denyRead, allowManagedReadPathsOnly}       │
│    • sandbox.bwrapPath / sandbox.socatPath (Linux/WSL)                         │
└────────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│ Sandbox Runtime (per-process e9 config)                                        │
│                                                                                │
│  • network.deniedDomains  ──►  pFK filter (highest priority, always-respected) │
│  • network.allowedDomains ──►  pFK filter (gated by allowManagedDomainsOnly)   │
│  • allowMachLookup        ──►  pa1 (macOS sandbox profile builder)             │
│  • bwrapPath / socatPath  ──►  vFK (Linux bwrap wrapper) / VFK (bridge socat)  │
│  • seccomp.applyPath      ──►  vA6 lookup → bwrap argv prefix                  │
└────────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│ Permission / Auto-Allow Path                                                   │
│                                                                                │
│  Bash tool input  ──► bV (sandbox gating check)                                │
│                   ──► autoAllowBashIfSandboxed → WA5 (single-cmd auto-allow)   │
│                   ──► autoAllowBashIfSandboxed → v64 (AST auto-allow)          │
│                                                  │                              │
│                                                  ▼                              │
│                              IX6 — dangerous rm/rmdir path check (v2.1.116)    │
│                              ↑                                                  │
│                              └── nUH — critical path detector                  │
│                                  • "/" or windows drive root                   │
│                                  • $HOME                                       │
│                                  • dirname == "/" (single-segment system dirs) │
│                                  • C:\foo (windows top-level)                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Why the Managed-Settings Plane Matters

The 2.1.88 baseline shipped sandbox primitives but left orchestration to env vars. By 2.1.113, several enterprise rollouts hit the same friction:

- **NVIDIA**: wants `autoAllowBashIfSandboxed: true` but only on macOS until Linux/WSL is "battle-tested". Solution: `enabledPlatforms: ["macos"]` (already in 2.1.112). But also wants their MITM proxy CA injected — needed `allowMachLookup` and `enableWeakerNetworkIsolation`.
- **A bank**: wants `*.bank.example.com` allowed broadly but a specific subdomain blocked (legacy hosts that should never receive Claude traffic). Needed `deniedDomains`.
- **A cloud-managed deployment**: ships its own hardened bwrap binary outside `$PATH` (so user-installed bubblewrap can't shadow it). Needed `bwrapPath`.
- **A monorepo with policy tiers**: discovered `allowManagedDomainsOnly` set in tier A is ignored if tier B (higher priority) has a `sandbox` block at all but no `network` sub-block. Needed the merge fix in 2.1.126.

Each is a small managed-settings hook; cumulatively they make the sandbox usable in policy-constrained environments without env-var negotiation.

---

## Cross-Module Integration

| Module | Integration Point |
|--------|-------------------|
| Permissions (10_permissions) | `allowManagedDomainsOnly` interacts with `permissions.allow` containing `WebFetch(domain:...)` rules — managed-only mode strips user-tier domain allow rules but never strips domain denies |
| Subprocess hardening (`subprocess_pid_namespace.md`) | `bwrapPath` resolution feeds into `Qt$()` (the bubblewrap discovery used by `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`) — same managed-settings tier chain |
| MCP (mcp) | `deniedDomains` and `allowedDomains` reach MCP HTTP/SSE server URLs through the same `pFK` filter |
| Bash auto-allow | `IX6` (dangerous-rm check) is the **only** safety gate inside the auto-allow flow that the user can't override with a `permissions.allow` rule — it's a hard policy floor |
| Doctor (`/doctor`) | `checkDependencies` (`TFK`) consults `bwrapPath`/`socatPath`/`seccompConfig` when reporting "sandbox enabled" or "sandbox disabled (missing bwrap)" |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md) — this unit's additions
> - [v2.1.112 18_sandbox/README.md](../../../claude_code_v_2.1.112/analyze/18_sandbox/README.md) — baseline

Key functions added/changed in this unit:
- `getAllPolicyTierSettings` (WPH) — accessor for the merged policy tier chain (consumes parentSlice)
- `getBwrapPath` (tz$) — `sandbox.bwrapPath` resolver (admin-only)
- `getSocatPath` (MgK) — `sandbox.socatPath` resolver (admin-only)
- `resolveBubblewrap` (Qt$) — bwrap discovery (managed-path first, then `which`)
- `policyTierProjection` (Tm8) — extracts the parent-tier slice during merge (v2.1.126 fix)
- `mergeManagedPolicy` (MDq) — produces `tiers`, `admin`, `parentSlice` for `wDq` consumption
- `criticalPathTest` (nUH) — predicate for v2.1.116 rm/rmdir guardrail
- `checkRmTargets` (IX6) — per-rm-target dangerous-path check
- `autoAllowAstChecker` (v64) — AST-based auto-allow that invokes `IX6` (v2.1.116 wiring)
- `networkPermissionFilter` (pFK) — runtime sandbox network filter (deniedDomains has priority)
