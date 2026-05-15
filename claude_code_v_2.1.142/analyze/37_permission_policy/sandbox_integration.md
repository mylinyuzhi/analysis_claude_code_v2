# Permission ↔ Sandbox Integration (v2.1.142)

**Theme:** The permission policy chain and the sandbox isolation layer are **two complementary defenses**: permissions decide whether a tool *call* fires; sandbox isolates what that tool *can do* if it does fire. They share configuration (the same `permissions.{allow,deny}` arrays feed both layers) but operate at different layers — permissions at the agent loop, sandbox at the process boundary (bubblewrap on Linux, sandbox-exec on macOS).

This document maps:
1. How permission decisions gate into sandbox-isolated tool execution
2. The PID namespace + seccomp + bwrap interaction on Linux
3. The bubblewrap / socat paths (`bwrapPath`, `socatPath` — v2.1.133)
4. `sandbox.network.deniedDomains` (v2.1.113)
5. The `allowManagedDomainsOnly` security fix (v2.1.126)
6. The shared rule normalizer that turns `Edit(...)` / `Bash(...)` / `WebFetch(...)` rules into sandbox-readable allow/deny lists

---

## 1. The Two-Layer Defense

```
                                Agent loop emits tool_use
                                          │
                                          ▼
                         ┌──────────────────────────────┐
                         │  Layer 1: Permission Policy  │
                         │  - tD / UA5 / classifier     │
                         │  - allow|ask|deny verdict    │
                         └─────────────┬────────────────┘
                                       │ allow
                                       ▼
                         ┌──────────────────────────────┐
                         │  Layer 2: Sandbox Isolation  │
                         │  Linux:  bwrap + seccomp     │
                         │  macOS:  sandbox-exec        │
                         │  Network: HTTP/SOCKS proxy   │
                         │           (egress filter)    │
                         └─────────────┬────────────────┘
                                       │ run
                                       ▼
                                  Tool process
                                  (write to allow paths only;
                                  network filtered by proxy;
                                  syscalls filtered by seccomp)
```

### Why two layers?

Permission policy is **logical** — it interprets the structured tool call (`Bash("rm -rf /")` is a string that matches `Bash(rm:*)` deny). But policy can be wrong:
- A classifier hallucination might auto-allow something dangerous
- A user's loose allow rule might cover too much
- The model might pass an unexpected argument

Sandbox is **physical** — even if the policy says allow, the process can't write outside `allowWrite` paths, can't connect to non-`allowedDomains` hosts, can't make blocked syscalls. The two layers are **AND-gated**: policy must allow AND sandbox must permit. A failure at either layer blocks the action.

---

## 2. Shared Rule Normalizer — `buildSandboxConfig` (`KY$`)

The function `KY$` (cli_inner_pretty.js:198104) takes the user's merged settings and produces a `SandboxConfig` that the sandbox runtime consumes. It **reads the same permission rules** and translates them:

```javascript
// ============================================
// buildSandboxConfig - Translate permissions.{allow,deny} into sandbox config
// Location: cli_inner_pretty.js:198104-198218
// ============================================

// ORIGINAL (for source lookup):
function KY$(H) {
  let $ = H.permissions || {},
    q = WPH(),
    K = q.some((I) => I.sandbox?.network?.allowManagedDomainsOnly === !0),
    _ = q.some((I) => I.sandbox?.filesystem?.allowManagedReadPathsOnly === !0),
    A = [], z = [];
  /* network allowed/denied domains */
  if (K) for (let I of q) { /* only managed allowed domains + WebFetch rules */ }
  else { /* all-tier allowed domains + WebFetch rules */ }
  for (let I of H.sandbox?.network?.deniedDomains || []) z.push(I);
  for (let I of $.deny || []) {
    let h = vUH(I);
    if (h.toolName === FD && h.ruleContent?.startsWith("domain:")) z.push(h.ruleContent.substring(7));
  }
  /* filesystem allow/deny write/read */
  let Y = [".", wC()], f = [], O = [], M = [];
  /* walk Edit() allow → allowWrite, Edit() deny → denyWrite, Read() deny → denyRead, etc. */
  return {
    network: { allowedDomains: A, deniedDomains: z, ... },
    filesystem: { denyRead: O, allowRead: M, allowWrite: Y, denyWrite: f },
    ignoreViolations: H.sandbox?.ignoreViolations,
    /* ... */
    seccomp: bgK(),
    bwrapPath: tz$(),
    socatPath: MgK(),
  };
}

// READABLE (for understanding):
function buildSandboxConfig(settings) {
  const perms = settings.permissions || {};
  const managedTiers = getAllPolicyTierSettings();
  const allowManagedDomainsOnly = managedTiers.some(t => t.sandbox?.network?.allowManagedDomainsOnly === true);
  const allowManagedReadPathsOnly = managedTiers.some(t => t.sandbox?.filesystem?.allowManagedReadPathsOnly === true);

  // === Network: build allowed + denied domain lists ===
  const allowedDomains = [];
  const deniedDomains = [];

  if (allowManagedDomainsOnly) {
    // Only managed tiers contribute allowed domains and WebFetch rules
    for (const tier of managedTiers) {
      for (const domain of tier.sandbox?.network?.allowedDomains || []) {
        allowedDomains.push(domain);
      }
      for (const ruleString of tier.permissions?.allow || []) {
        const parsed = parsePermissionRule(ruleString);
        if (parsed.toolName === WEB_FETCH_TOOL_NAME && parsed.ruleContent?.startsWith("domain:")) {
          allowedDomains.push(parsed.ruleContent.substring(7));
        }
      }
    }
  } else {
    // All tiers contribute
    for (const domain of settings.sandbox?.network?.allowedDomains || []) {
      allowedDomains.push(domain);
    }
    for (const ruleString of perms.allow || []) {
      const parsed = parsePermissionRule(ruleString);
      if (parsed.toolName === WEB_FETCH_TOOL_NAME && parsed.ruleContent?.startsWith("domain:")) {
        allowedDomains.push(parsed.ruleContent.substring(7));
      }
    }
  }

  // Denied domains: ALWAYS merged across all tiers, regardless of allowManagedDomainsOnly
  for (const domain of settings.sandbox?.network?.deniedDomains || []) {
    deniedDomains.push(domain);
  }
  for (const ruleString of perms.deny || []) {
    const parsed = parsePermissionRule(ruleString);
    if (parsed.toolName === WEB_FETCH_TOOL_NAME && parsed.ruleContent?.startsWith("domain:")) {
      deniedDomains.push(parsed.ruleContent.substring(7));
    }
  }

  // === Filesystem: walk Edit/Read deny rules into sandbox paths ===
  // (similar pattern — allow paths come from Edit() allow rules, deny paths from Edit() deny)

  return {
    network: { allowedDomains, deniedDomains, ... },
    filesystem: { ... },
    seccomp: getSeccompConfig(),
    bwrapPath: getBwrapPath(),
    socatPath: getSocatPath(),
  };
}

// Mapping: KY$→buildSandboxConfig, WPH→getAllPolicyTierSettings, vUH→parsePermissionRule,
//          FD→WEB_FETCH_TOOL_NAME, G7→EDIT_TOOL_NAME, Bq→READ_TOOL_NAME, tz$→getBwrapPath,
//          MgK→getSocatPath, bgK→getSeccompConfig
```

### Key insight — same rules feed both layers

Notice the loop body for allowed domains:

```javascript
for (let I of $.allow || []) {
  let h = vUH(I);
  if (h.toolName === FD && h.ruleContent?.startsWith("domain:"))
    A.push(h.ruleContent.substring(7));
}
```

The `WebFetch(domain:example.com)` permission rule contributes to **both**:
- The permission policy chain (Layer 1 — gates whether `WebFetch` tool calls succeed)
- The sandbox network filter (Layer 2 — the egress proxy allows `example.com`)

Similarly, `Edit(./src/**)` allow rules contribute to:
- The Edit tool's permission verdict (Layer 1)
- The sandbox `allowWrite` paths (Layer 2 — the bwrap mount is read-write under `./src`)

**This is unified by design** — the user writes their permission rule once; both layers honor it. The shared schema keeps the two layers from drifting.

---

## 3. Network Filter — `pFK`

The runtime network filter (cli_inner_pretty.js:196344):

```javascript
async function pFK(H, $, q) {
  if (!e9) return (e6("No config available, denying network request"), !1);
  if (!nz$($)) return (e6(`Denying malformed host: ${JSON.stringify($)}:${H}`, { level: "error" }), !1);
  let K = NUK($) ?? $;
  for (let _ of e9.network.deniedDomains)
    if (hA6(K, _)) return (e6(`Denied by config rule: ${$}:${H}`), !1);
  for (let _ of e9.network.allowedDomains)
    if (hA6(K, _)) return (e6(`Allowed by config rule: ${$}:${H}`), !0);
  if (!q) return (e6(`No matching config rule, denying: ${$}:${H}`), !1);
  /* fall back to user prompt callback */
}
```

### Order of operations

1. **Malformed host**: deny (security: reject anything that doesn't look like a valid hostname)
2. **Denied domain match**: deny — *first* check is the deny list
3. **Allowed domain match**: allow
4. **No match + no prompt callback**: deny (default-secure)
5. **No match + prompt callback**: ask the user

The pattern mirrors the permission chain: **deny → allow → default**. The "default" depends on whether the runtime has a permission callback (interactive mode does; headless doesn't).

### Why deny is checked first

If a domain is in both `allowedDomains` (broad pattern) and `deniedDomains` (specific block), deny wins. This lets users do:

```json
{
  "sandbox": {
    "network": {
      "allowedDomains": ["*.googleapis.com"],
      "deniedDomains": ["sneaky.googleapis.com"]
    }
  }
}
```

Allow all GCP, except the specific sneaky one. This is the same union-merge-across-tiers (see `settings_tier_hierarchy.md` section 2) and the rules layer cleanly.

### Wildcard / pattern matching — `hA6`

`hA6` (cli_inner_pretty.js:196333) implements pattern matching with `*` wildcards:

- `*.example.com` matches `foo.example.com`, `bar.example.com`, but NOT `example.com` itself
- `example.com` matches `example.com` exactly
- `**` not supported (single segments only, like a DNS label)

---

## 4. `deniedDomains` (v2.1.113)

The `sandbox.network.deniedDomains` setting was **added in v2.1.113** to block specific domains even when a broader `allowedDomains` wildcard would otherwise permit them.

```javascript
// Schema (cli_inner_pretty.js:48259):
deniedDomains: y
  .array(y.string())
  .optional()
  .describe(
    "Domains that are always blocked, even if matched by allowedDomains. Supports the same wildcard syntax as allowedDomains. Merged from all settings sources regardless of allowManagedDomainsOnly.",
  ),
```

**Key phrase: "Merged from all settings sources regardless of allowManagedDomainsOnly."**

This is the symmetry guarantee: the `allowManagedDomainsOnly` flag suppresses non-policy *allow* sources (so a user can't broaden an admin's allow list), but **never** the deny sources. A user adding `deniedDomains: ["evil.com"]` always works, even under `allowManagedDomainsOnly: true`.

This makes the security gradient one-way: admins can only restrict, users can only add restrictions. Neither can loosen what the other denied.

---

## 5. `allowManagedDomainsOnly` Security Fix (v2.1.126)

**Pre-v2.1.126 bug:** `allowManagedDomainsOnly` was checked **only against the winning admin tier**. If a higher-priority managed-settings source (e.g., remote-fetched policy) didn't have a `sandbox` block at all, the flag was silently dropped — even though a lower-priority managed source had set it.

**The vulnerability:** An enterprise that set `allowManagedDomainsOnly: true` in their OS-policy MDM and expected `userSettings`'s allowedDomains to be ignored. But if a remote managed-settings source (perhaps a stale fetch with no sandbox config) came in higher priority, the OS-policy flag was dropped and user allowedDomains were honored.

**The fix:** Check `allowManagedDomainsOnly` across **all** managed tiers (line 198107):

```javascript
let K = q.some((I) => I.sandbox?.network?.allowManagedDomainsOnly === !0),
  _ = q.some((I) => I.sandbox?.filesystem?.allowManagedReadPathsOnly === !0);
```

`q.some(...)` walks every managed tier and returns true if *any* of them sets the flag. The flag is now **sticky across managed tiers** — once set anywhere in policy, it applies.

The same fix applies to `allowManagedReadPathsOnly`.

---

## 6. Linux: bwrap + seccomp Interaction

On Linux, the sandbox uses **bubblewrap** (`bwrap`) to create a user namespace with a constrained mount table, plus **seccomp** to filter syscalls. The two work together:

### bwrap responsibilities

`vFK` (linuxBwrapWrapper, cli_inner_pretty.js:195744) builds the bwrap command line:

```bash
bwrap \
  --unshare-all                    # New PID/network/mount/IPC namespaces
  --share-net                      # ... except keep network (egress filter handles it)
  --ro-bind / /                    # Default read-only mount of host /
  --bind ./project ./project       # Read-write mount of project dir
  --tmpfs /tmp                     # Empty /tmp
  --bind /run/user/$UID /run/user  # Keep user runtime dir
  --proc /proc --dev /dev          # Standard /proc, /dev
  --seccomp 3                      # Pass seccomp fd via fd 3
  --                               # End of bwrap args
  /path/to/apply-seccomp $arch     # Wrapper that applies seccomp BPF before exec
  --                               # End of apply-seccomp args
  <actual command>
```

### seccomp responsibilities

`apply-seccomp` (a separate vendored binary at `vendor/seccomp/<arch>/apply-seccomp`) loads a BPF filter that:

- Blocks `socket(AF_UNIX, ...)` to prevent bypass via Unix domain sockets
- Blocks other dangerous syscalls (`ptrace`, raw socket creation, etc.)
- Allows safe socket families (`AF_INET`, `AF_INET6`) so the proxy still works

The filter is loaded *before* exec'ing the actual command — once exec is done, the filter is locked in and can't be changed by the running process.

### Why both?

- **bwrap** controls *what's visible* in the filesystem (mount namespace) and *what processes can be signaled* (PID namespace).
- **seccomp** controls *which syscalls* the process can make.

A process inside the sandbox could in principle:
- See only the bound paths (bwrap protects this)
- Issue any syscall it has access to (seccomp catches this)

Without seccomp, a process could use `socket(AF_UNIX, ...)` to talk to host services via mounted Unix sockets (e.g., the docker daemon socket if accidentally mounted). Without bwrap, syscalls like `unlink()` could still delete host files even if seccomp lets them through.

### bwrap fallback to no-op

If `bwrap` isn't available (missing binary, unsupported kernel), the sandbox **disables itself with a warning** rather than refusing to run. Unless the user has set `failIfUnavailable: true` (from `cli_inner_pretty.js:48345-48350`):

```javascript
failIfUnavailable: y.boolean().optional().describe(
  "Exit with an error at startup if sandbox.enabled is true but the sandbox cannot start (missing dependencies or unsupported platform). When false (default), a warning is shown and commands run unsandboxed. Intended for managed-settings deployments that require sandboxing as a hard gate.",
),
```

Enterprises that depend on sandbox isolation set `failIfUnavailable: true` so a misconfigured deployment fails loud rather than silently running unsandboxed.

---

## 7. `sandbox.bwrapPath` and `sandbox.socatPath` (v2.1.133)

v2.1.133 added two managed-settings keys:

```javascript
// Schema (cli_inner_pretty.js:48374-48389):
bwrapPath: y
  .string()
  .optional()
  .describe(
    "Linux/WSL only: Absolute path to the bwrap (bubblewrap) binary. Overrides auto-detection via PATH. Only honored from admin-controlled managed settings.",
  ),
socatPath: y
  .string()
  .optional()
  .describe(
    "Linux/WSL only: Absolute path to the socat binary. Overrides auto-detection via PATH.",
  ),
```

### Why?

Enterprises often deploy custom-built or vendored versions of `bwrap` and `socat` (e.g., to enable specific seccomp filters or to use a hardened build). The `PATH`-based auto-detection picks whatever's first in `PATH` — which on shared systems may be the wrong binary.

The setting lets admins **pin** the binary paths. The phrase "Only honored from admin-controlled managed settings" means user/project/local tiers can't set these — they'd be silently dropped. This is enforced by the merger.

### `socat` role

`socat` is used to **bridge** the per-process HTTP/SOCKS proxy into the sandboxed process's network namespace. The Linux bwrap sandbox creates a separate netns but still wants to route traffic through the proxy (for the egress filter). `socat` forwards connections from inside the netns to the host's proxy port.

### Resolution functions

```javascript
// At cli_inner_pretty.js:197238-197247:
function tz$() { return /* managed-settings bwrapPath if set, else 'which bwrap', else built-in vendored path */ }
function MgK() { return /* same for socat */ }
```

The lookup walks: managed-settings path → `which` on PATH → vendored binary path. The fallback to vendored ensures the sandbox works even on minimal-installation systems.

---

## 8. macOS: sandbox-exec Profile

On macOS, the sandbox uses `sandbox-exec` with a SBPL (Sandbox Profile Language) profile generated by `pa1` (cli_inner_pretty.js:195952). The profile is text-based:

```
(version 1)
(deny default)
(allow process-fork)
(allow process-exec
  (literal "/path/to/binary"))
(allow file-read*
  (regex "^/path/to/allowed/.*"))
(allow file-write*
  (regex "^/path/to/project/.*"))
(allow network-outbound
  (remote unix
    (literal "/var/run/com.apple.example")))
...
```

The profile is generated from the same shared config (`KY$`) that drives the Linux bwrap. The translation is:

- `allowWrite` paths → `(allow file-write* (regex ...))`
- `denyWrite` paths → `(deny file-write* (regex ...))`
- `allowedDomains` → not represented in SBPL (network filtering is via the proxy port + sandbox-exec network rules)
- `allowMachLookup` → `(allow mach-lookup (global-name "com.example.*"))`

### macOS-specific keys

macOS adds keys not present on Linux:

- `allowMachLookup` — XPC/Mach service names (needed for iOS Simulator, Playwright, etc.)
- `allowUnixSockets` — Specific Unix socket paths to allow (Linux can't filter by path with seccomp)
- `enableWeakerNestedSandbox` — Some apps need to spawn sub-processes that can't be doubly-sandboxed
- `enableWeakerNetworkIsolation` — Looser network constraints for compat

---

## 9. The Sandbox Auto-Allow Path (`autoAllowBashIfSandboxed`)

The setting `sandbox.autoAllowBashIfSandboxed: true` enables a **fast path** in the permission chain: Bash commands that pass static checks AND would run inside the sandbox skip the permission prompt entirely.

Logic chain (interaction with permissions):

```
User runs Bash("ls -la /etc")
   │
   ▼
UA5 step 3 (ask rule check)
   │
   ▼
Is there an ask rule?
   │ yes
   ▼
Special case: Is autoAllowBashIfSandboxed enabled AND is this Bash AND is shape supported?
   │ yes
   ▼
Skip the ask rule; fall through to tool callback (Bash's checkPermissions)
   │
   ▼
Bash callback returns ask (no allow rule, command needs prompt)
   │
   ▼
UA5 step 11 (allow rule check)
   │
   ▼
No allow rule → step 12 → ASK (prompt user)
```

Without the special case, the ask rule would short-circuit. With it, the path continues so the sandbox fast-path (`v64`, line 420551) can run. v64 then:

1. Checks that the command parses cleanly
2. Strips wrappers (`env`, `sudo`, etc.)
3. For each segment: if it's `rm`/`rmdir`, check dangerous-path safety (`IX6`)
4. If all checks pass: return `allow` (sandbox will contain it)
5. Otherwise: fall back to prompt

### v2.1.116 safety fix

Pre-v2.1.116, v64 didn't run the dangerous-path safety check for `rm`/`rmdir`. A sandbox-allow + `rm -rf /` would auto-approve because:
- The sandbox would contain it (limited blast radius)
- The classifier wasn't invoked (not in auto mode)
- The permission prompt was skipped

But "limited blast radius" doesn't mean *no* blast radius — the sandbox's project mount is writable, and `rm -rf /` within the sandbox destroys the project. v2.1.116 fixed v64 to re-check dangerous-rm safety inside the fast-path. See [`sandbox_auto_allow_safety.md`](./sandbox_auto_allow_safety.md) in the unit 07 worktree.

### v2.1.139 AST relaxation

Pre-v2.1.139, v64 rejected any command with `$VAR` or `$(cmd)`. v2.1.139 added AST-aware analysis: when the parser succeeds AND the env-var prefixes are in the safe list AND no `/dev/tcp` redirects AND `rm`/`rmdir` targets pass safety — accept. See [`auto_allow_shell_expansion.md`](./auto_allow_shell_expansion.md).

---

## 10. `dangerouslyDisableSandbox` (v2.1.113)

Some commands need to run OUTSIDE the sandbox (e.g., commands that need to spawn nested sandboxes). The Bash tool input supports:

```json
{
  "name": "Bash",
  "input": {
    "command": "...",
    "dangerouslyDisableSandbox": true
  }
}
```

When set, Bash bypasses the sandbox wrapper. **v2.1.113 fixed a bug** where this flag was running commands outside the sandbox **without prompting the user**. Pre-fix: the model could opt to escape the sandbox unilaterally. Post-fix: the flag triggers a prompt every time.

This is the permission ↔ sandbox handoff in reverse — sandbox decisions affect the permission chain (the flag forces ask).

---

## 11. The Symmetry — Permission Rules vs Sandbox Rules

Many users only configure permission rules and never explicitly set sandbox config. The shared rule normalizer means they don't have to:

| Permission rule | Sandbox effect |
|---|---|
| `Edit(./src/**)` allow | `allowWrite` includes `./src/**` |
| `Edit(./.env*)` deny | `denyWrite` includes `./.env*` |
| `Read(./node_modules/**)` deny | `denyRead` includes `./node_modules/**` |
| `WebFetch(domain:api.example.com)` allow | `network.allowedDomains` includes `api.example.com` |
| `WebFetch(domain:evil.com)` deny | `network.deniedDomains` includes `evil.com` |
| `Bash(rm:*)` deny | (no direct sandbox effect — Bash isn't sandboxed by path; it runs under bwrap with the project mount writable) |

So a user who never touches `sandbox.*` settings still gets a consistent sandbox config matched to their permission rules. The `sandbox.*` settings are for **additional** restrictions (e.g., `allowRead` re-allowing within a `denyRead` region) or **explicit** ones (e.g., `allowMachLookup` which has no permission-rule equivalent).

---

## 12. Worked Example — Full Flow

User config:

```json
{
  "permissions": {
    "allow": [
      "Edit(./src/**)",
      "WebFetch(domain:api.github.com)"
    ],
    "deny": [
      "Bash(rm:*)",
      "Edit(./.env*)",
      "WebFetch(domain:evil.com)"
    ]
  },
  "sandbox": {
    "enabled": true,
    "network": {
      "deniedDomains": ["telemetry.example.com"]
    }
  }
}
```

Model runs `Bash("curl https://api.github.com/repos/foo")`:

1. **Layer 1 — Permission policy:**
   - `Bash` deny rules: `Bash(rm:*)` — doesn't match `curl`
   - `Bash` callback: parses the AST, classifier sees `curl https://api.github.com/...` — no soft_deny rule against curl per se, but transcript-aware classifier evaluates network destination
   - Allow rule: `Bash(curl *)` not present → ask path
   - User is in `default` mode → prompt fires
2. User approves the prompt.
3. **Layer 2 — Sandbox:**
   - Bash spawns under bwrap (Linux) or sandbox-exec (macOS)
   - `curl` makes outbound HTTP request to `api.github.com`
   - HTTP proxy (the egress filter, `pFK`) checks: is `api.github.com` in `deniedDomains`? No. Is it in `allowedDomains`? Yes (`WebFetch(domain:api.github.com)` contributed). Allow.
4. `curl` completes; sandbox releases.

If instead the model runs `Bash("curl https://evil.com")`:

1. Layer 1 — prompt fires (no allow rule for `Bash(curl *)`).
2. Even if user approves...
3. Layer 2 — `pFK` checks: `evil.com` in `deniedDomains` (from `WebFetch(domain:evil.com)` deny). DENY at the proxy. `curl` gets a connection refused.

The two-layer defense **saved the user** — they trusted the prompt (maybe rushed), but the sandbox still blocked the call.

---

## 13. Network Proxy Server Startup

When the sandbox initializes, two proxy servers start:

```javascript
// At cli_inner_pretty.js:196407 (initializeSandboxNetwork):
async function da1(H, $, q = !1) {
  /* set config */
  /* generate TLS terminator if configured */
  /* start HTTP proxy server (ga1) on 127.0.0.1:0 */
  /* start SOCKS proxy server (Qa1) on 127.0.0.1:0 */
  /* if Linux: spawn socat bridges to expose the proxies to the bwrap netns */
  /* persist port numbers in `rF` for subsequent sandbox-wrapped commands */
}
```

The sandboxed Bash process sees `HTTPS_PROXY=http://127.0.0.1:<port>` set. All HTTPS/HTTP traffic routes through the proxy. The proxy applies the network filter (`pFK`) and either allows or denies.

For **TLS termination** (an experimental v2.1.142 feature, see schema line 48298): a CA cert is generated; the proxy MITMs HTTPS connections to filter request bodies. This is opt-in via `tlsTerminate: { caCertPath, caKeyPath }`.

---

## 14. WSL: `wslInheritsWindowsSettings` (v2.1.118)

WSL on Windows can inherit Windows-side managed settings:

```json
{ "wslInheritsWindowsSettings": true }
```

When set, the Linux-side managed-settings resolver reads from Windows HKLM in addition to (or instead of) `/etc/claude-code/managed-settings.json`. The sandbox config is built from the merged result.

This unifies enterprise policy across WSL and Windows-host Claude Code — admins maintain one MDM policy for both.

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_v2_1_142_permission_arch.md`](../00_overview/symbol_additions_v2_1_142_permission_arch.md) — Symbols introduced/used in this document
> - [`symbol_additions_v2_1_142_sandbox.md`](../00_overview/symbol_additions_v2_1_142_sandbox.md) — Sandbox-specific symbols

Key functions in this document:
- `buildSandboxConfig` (`KY$`) — Translate permissions + sandbox settings into runtime config (cli_inner_pretty.js:198104)
- `networkPermissionFilter` (`pFK`) — Runtime per-request network filter (cli_inner_pretty.js:196344)
- `matchesHostPattern` (`hA6`) — Domain wildcard match (cli_inner_pretty.js:196333)
- `parsePermissionRule` (`vUH`) — Reuse permission rule parser to extract domain from `WebFetch(domain:...)`
- `canonicalizeHost` (`NUK`) — Lowercase + IDN canonicalization
- `isValidHost` (`nz$`) — Reject malformed hosts (defense)
- `WEB_FETCH_TOOL_NAME` (`FD`) — `"WebFetch"` constant
- `EDIT_TOOL_NAME` (`G7`) — `"Edit"` constant
- `READ_TOOL_NAME` (`Bq`) — `"Read"` constant
- `getAllPolicyTierSettings` (`WPH`) — Walk all managed policy tiers (cli_inner_pretty.js:52338)
- `getBwrapPath` (`tz$`) — Resolve bwrap binary (cli_inner_pretty.js:197238)
- `getSocatPath` (`MgK`) — Resolve socat binary (cli_inner_pretty.js:197243)
- `getSeccompConfig` (`bgK`) — Build seccomp config
- `findSeccompBinary` (`vA6`) — Locate `apply-seccomp` vendored binary (cli_inner_pretty.js:195367)
- `linuxBwrapWrapper` (`vFK`) — Build bwrap command line (cli_inner_pretty.js:195744)
- `buildBwrapMountArgs` (`ba1`) — Construct `--bind`/`--ro-bind` args (cli_inner_pretty.js:195631)
- `applyMacOSSandbox` (`SFK`) — sandbox-exec wrapper on macOS
- `buildMacOSSandboxProfile` (`pa1`) — Generate SBPL profile (cli_inner_pretty.js:195952)
- `sandboxAutoAllowAstAware` (`v64`) — AST-aware autoAllowBashIfSandboxed path (cli_inner_pretty.js:420551)
- `checkRmTargets` (`IX6`) — Re-verify rm/rmdir targets aren't dangerous (cli_inner_pretty.js:274835)
- `isCriticalPath` (`nUH`) — Critical path check with macOS `/private/{etc,var,tmp,home}` (cli_inner_pretty.js:207091)
- `initializeSandboxNetwork` (`da1`) — Set config + start proxies (cli_inner_pretty.js:196407)
- `startHttpProxyServer` (`ga1`) — Local HTTP proxy listener (cli_inner_pretty.js:196365)
- `startSocksProxyServer` (`Qa1`) — Local SOCKS proxy listener (cli_inner_pretty.js:196390)
- `spawnNetworkBridges` (`VFK`) — socat bridges into bwrap netns (Linux)
- `getAllowManagedDomainsOnly` (`EUH`) — Check the security flag across all managed tiers (cli_inner_pretty.js:198101)
