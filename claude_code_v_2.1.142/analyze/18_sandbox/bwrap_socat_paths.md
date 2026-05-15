# `sandbox.bwrapPath` / `sandbox.socatPath` — Custom bwrap/socat Binary Locations

> **Landing:** v2.1.133 — *"Added `sandbox.bwrapPath` and `sandbox.socatPath` managed settings (Linux/WSL) to specify custom bubblewrap and socat binary locations."*

This document covers the two new admin-only managed settings that override `$PATH`-based lookup for the two Linux/WSL sandbox helper binaries. Both fields are gated on absolute-path validation in the schema and consulted through the policy-tier chain at runtime.

---

## The Operator Pain Point

The Linux sandbox stack depends on two external binaries:

| Binary | Role | Default lookup |
|--------|------|----------------|
| `bwrap` (bubblewrap) | Runs the sandboxed shell inside a PID/mount/network namespace | `which bwrap` |
| `socat` | Bridges the in-process HTTP/SOCKS proxy out to UNIX sockets that the sandboxed namespace can reach | `which socat` |

Until 2.1.133, both came from `$PATH`. That's fine for a personal dev box where `apt install bubblewrap socat` puts them in `/usr/bin`. It breaks in three enterprise scenarios:

1. **Corporate base image without bubblewrap in `/usr/bin`.** Some hardened images ship bwrap under `/opt/redhat/...` or `/usr/libexec/...` with a deliberately empty `$PATH` entry. The sandbox check fails even though bwrap exists.
2. **Multiple bwrap versions on the same host.** A developer-installed bwrap shadows the admin-installed one. If the developer's copy is older or differently-configured, the sandbox behaves inconsistently.
3. **WSL with windows-side bubblewrap.** WSL distros sometimes inherit a stale `$PATH` that includes Windows binaries; bwrap might resolve to a stub `.exe` that just errors out.

Both settings let an admin pin the binary path explicitly via managed settings, bypassing `$PATH` discovery entirely.

---

## Schema (Absolute-Path-Only Preprocess)

```javascript
// ============================================
// SandboxSettingsSchema (excerpt) - bwrapPath/socatPath fields
// Location: cli_inner_pretty.js:48374-48390 (yMq schema)
// ============================================

// ORIGINAL (for source lookup):
bwrapPath: y
  .preprocess((H) => (typeof H === "string" && hu8.isAbsolute(H) ? H : void 0), y.string())
  .optional()
  .catch(void 0)
  .describe(
    "Linux/WSL only: Absolute path to the bwrap (bubblewrap) binary. Overrides auto-detection via PATH. Only honored from admin-controlled managed settings.",
  ),
socatPath: y
  .preprocess((H) => (typeof H === "string" && hu8.isAbsolute(H) ? H : void 0), y.string())
  .optional()
  .catch(void 0)
  .describe(
    "Linux/WSL only: Absolute path to the socat binary used for the sandbox network proxy. Overrides auto-detection via PATH. Only honored from admin-controlled managed settings.",
  ),

// READABLE (for understanding):
const absolutePathPreprocess = (value) =>
  typeof value === "string" && path.isAbsolute(value) ? value : undefined;

const SandboxSettingsSchemaExcerpt = {
  bwrapPath: z
    .preprocess(absolutePathPreprocess, z.string())
    .optional()
    .catch(undefined)
    .describe(
      "Linux/WSL only: Absolute path to the bwrap (bubblewrap) binary. " +
      "Overrides auto-detection via PATH. " +
      "Only honored from admin-controlled managed settings."
    ),
  socatPath: z
    .preprocess(absolutePathPreprocess, z.string())
    .optional()
    .catch(undefined)
    .describe(
      "Linux/WSL only: Absolute path to the socat binary used for the sandbox network proxy. " +
      "Overrides auto-detection via PATH. " +
      "Only honored from admin-controlled managed settings."
    ),
};

// Mapping: y→z, hu8.isAbsolute→path.isAbsolute, H→value
```

### Three layers of input rejection

The `.preprocess().optional().catch(void 0)` chain encodes three forms of "no":

1. **Not a string** → preprocess returns `undefined` → `optional()` accepts → final value is `undefined`.
2. **String but relative** (e.g., `"bin/bwrap"`, `"./bwrap"`) → preprocess returns `undefined` → same as above.
3. **Validation throws** for any other reason (e.g., the preprocess output fails inner `z.string()`) → `catch(void 0)` swallows it and yields `undefined`.

The combined effect: **anything other than an absolute string path becomes `undefined`**. A user can't sneak a relative path through that would be resolved at startup against an unpredictable working directory.

**Why absolute-only?** Two reasons:

1. **Security.** A relative path resolves against `process.cwd()`, which is user-controllable. A managed setting "Only honored from admin-controlled managed settings" must not depend on a runtime cwd that an attacker could influence (e.g., by symlinking `.claude/settings.json` or running Claude from a controlled directory).
2. **Reload-safety.** If cwd changes between sessions (e.g., user `cd`s into a different repo), a relative bwrap path would resolve differently each time. Absolute paths are reload-stable.

### The "admin-controlled" claim

The schema description says "Only honored from admin-controlled managed settings." That claim is enforced **not by the schema** (the field is in the same shared schema as user settings) **but by the resolver**: `tz$()` reads from `WPH()`, which by definition only returns the **policy tier chain** (helper, remote, plist/HKLM, file — never user/project/local settings). See [managed_domains_only_fix.md](./managed_domains_only_fix.md) for the tier merge details.

A user who writes `sandbox.bwrapPath` into `~/.claude/settings.json` will see the field accepted by the schema but ignored at runtime — because `tz$()` doesn't look in user settings.

---

## Resolver Functions

```javascript
// ============================================
// getBwrapPath - Reads sandbox.bwrapPath from policy tier chain
// Location: cli_inner_pretty.js:197238-197242 (tz$ function)
// ============================================

// ORIGINAL (for source lookup):
function tz$() {
  return WPH()
    .map((H) => H.sandbox?.bwrapPath)
    .find((H) => H != null);
}

// READABLE (for understanding):
function getBwrapPath() {
  return getAllPolicyTierSettings()
    .map((tier) => tier.sandbox?.bwrapPath)
    .find((path) => path != null);
}

// Mapping: tz$→getBwrapPath, WPH→getAllPolicyTierSettings
```

```javascript
// ============================================
// getSocatPath - Reads sandbox.socatPath from policy tier chain
// Location: cli_inner_pretty.js:197243-197247 (MgK function)
// ============================================

// ORIGINAL (for source lookup):
function MgK() {
  return WPH()
    .map((H) => H.sandbox?.socatPath)
    .find((H) => H != null);
}

// READABLE (for understanding):
function getSocatPath() {
  return getAllPolicyTierSettings()
    .map((tier) => tier.sandbox?.socatPath)
    .find((path) => path != null);
}

// Mapping: MgK→getSocatPath, WPH→getAllPolicyTierSettings
```

### Algorithm

**What it does:** Walks the policy tier chain (helper → remote → plist/HKLM → file) and returns the first non-null bwrap/socat path it finds.

**How it works:**

1. `WPH()` returns the ordered array of policy-tier settings objects. Each tier may have a `sandbox` block with a `bwrapPath` field.
2. `.map(...)` projects each tier to either the path string or `undefined`.
3. `.find((path) => path != null)` returns the first defined value, or `undefined` if no tier sets it.

**Why this approach:**

- **First-match wins** matches the tier priority: an MDM-pushed helper config takes precedence over an HKLM key takes precedence over a managed-settings file.
- **No deep merge needed.** Unlike `allowedDomains` (which is a list that gets concatenated across tiers) or `deniedDomains` (always-merged), a bwrap path is a single value. First-match-wins is the right merge for singletons.
- **Null-coalescing semantics.** Both `null` and `undefined` are treated as "tier did not set this field" — the next tier gets a chance. This is critical because the schema preprocesses bad inputs to `undefined`, so a misconfigured `bwrapPath` in a high-priority tier falls through to the next tier instead of locking out the sandbox.

**Key insight:** Compare this to the consumer-side: `vFK` reads `bwrapPath` from the sandbox config and uses `?? "bwrap"` as the default. The combined effect is:

```
admin_tier.bwrapPath?  → use that absolute path
                       → else fall back to "bwrap" (resolved by execve via $PATH)
```

The resolver chain is "find admin-pinned path", and the consumer falls back to `$PATH` only if no admin pinned anything.

---

## Bubblewrap Discovery Wrapper

```javascript
// ============================================
// resolveBubblewrap - Combined bwrap path resolution
// Location: cli_inner_pretty.js:197248-197252 (Qt$ function)
// ============================================

// ORIGINAL (for source lookup):
function Qt$() {
  let H = tz$();
  if (H) return Fx(H);
  return Fx("bwrap");
}

// READABLE (for understanding):
function resolveBubblewrap() {
  const adminPinned = getBwrapPath();
  // Fx → which() — verifies executability AND returns the resolved absolute path.
  // If adminPinned is set, Fx still verifies it (won't return a non-executable path).
  if (adminPinned) return whichExecutable(adminPinned);
  return whichExecutable("bwrap");
}

// Mapping: Qt$→resolveBubblewrap, tz$→getBwrapPath, Fx→whichExecutable, H→adminPinned
```

This combines the admin-path resolver with `$PATH` lookup: try the admin-pinned path first, fall back to `which bwrap`. Both go through the same executable-check (`Fx`), so a path that the resolver accepts but the OS won't execute (e.g., wrong arch, missing setuid, restrictive ACL) still returns `null` and triggers the same downstream error path.

---

## Consumer Integration: Linux Sandbox Wrapper

```javascript
// ============================================
// linuxBwrapWrapper (excerpt) - Uses bwrapPath/socatPath from sandbox config
// Location: cli_inner_pretty.js:195744-195831 (vFK function)
// ============================================

// ORIGINAL (for source lookup):
async function vFK(H) {
  let {
      command: $,
      // ...
      bwrapPath: P,
      socatPath: Z,
      abortSignal: W,
    } = H,
    // ...
  // ... bwrap argv construction ...
  let R = al.default.quote([P ?? "bwrap", ...v]),
    B = [];
  if (q) B.push("network");
  if (G || V) B.push("filesystem");
  if (E) B.push("seccomp(unix-block)");
  return (e6(`[Sandbox Linux] Wrapped command with bwrap (${B.join(", ")} restrictions)`), R);
}

// READABLE (for understanding, focused on the bwrap-path use):
async function linuxBwrapWrapper(opts) {
  const {
    command,
    needsNetworkRestriction,
    // ...
    bwrapPath,    // ← from sandbox config (via getBwrapPath chain)
    socatPath,    // ← from sandbox config (via getSocatPath chain)
    abortSignal,
  } = opts;
  // ... build bwrap argv (v) ...
  // Quote the final command, using admin-pinned path or fallback to "bwrap" (resolved via PATH).
  const finalCommand = shellEscape([bwrapPath ?? "bwrap", ...bwrapArgv]);
  const restrictionTags = [];
  if (needsNetworkRestriction) restrictionTags.push("network");
  if (hasFilesystemRestrictions) restrictionTags.push("filesystem");
  if (seccompArgvPrefix) restrictionTags.push("seccomp(unix-block)");
  log(`[Sandbox Linux] Wrapped command with bwrap (${restrictionTags.join(", ")} restrictions)`);
  return finalCommand;
}

// Mapping: vFK→linuxBwrapWrapper, al→shellEscape module, P→bwrapPath, Z→socatPath,
//          q→needsNetworkRestriction, E→seccompArgvPrefix
```

The wrapper just uses `bwrapPath ?? "bwrap"`. Same pattern: admin-pinned wins, else `$PATH`.

The `socatPath` is consumed by `Ca1` (the bridge command builder) and `VFK` (the bridge spawner) for the network proxy:

```javascript
// ============================================
// bridgeSpawner (excerpt) - Uses socatPath for the bridge processes
// Location: cli_inner_pretty.js:195540-195602 (VFK function)
// ============================================

// ORIGINAL (for source lookup):
async function VFK(H, $, q) {
  let K = q ?? "socat",
    _ = GFK.randomBytes(8).toString("hex"),
    A = $X.join(xt$.tmpdir(), `claude-http-${_}.sock`),
    z = $X.join(xt$.tmpdir(), `claude-socks-${_}.sock`),
    Y = [`UNIX-LISTEN:${A},fork,reuseaddr`, `TCP:localhost:${H},keepalive,...`];
  e6(`Starting HTTP bridge: ${K} ${Y.join(" ")}`);
  let f = kA6.spawn(K, Y, { stdio: "ignore" });
  // ... spawns SOCKS bridge same way ...
}

// READABLE (for understanding):
async function spawnNetworkBridges(httpProxyPort, socksProxyPort, socatBinaryPath) {
  // Default to "socat" (resolved via PATH) if admin didn't pin.
  const socatBin = socatBinaryPath ?? "socat";
  const sessionId = crypto.randomBytes(8).toString("hex");
  const httpSockPath = path.join(os.tmpdir(), `claude-http-${sessionId}.sock`);
  const socksSockPath = path.join(os.tmpdir(), `claude-socks-${sessionId}.sock`);
  const httpBridgeArgs = [
    `UNIX-LISTEN:${httpSockPath},fork,reuseaddr`,
    `TCP:localhost:${httpProxyPort},keepalive,...`,
  ];
  log(`Starting HTTP bridge: ${socatBin} ${httpBridgeArgs.join(" ")}`);
  const httpBridge = child_process.spawn(socatBin, httpBridgeArgs, { stdio: "ignore" });
  // ... SOCKS bridge identical ...
}

// Mapping: VFK→spawnNetworkBridges, q→socatBinaryPath, K→socatBin
```

---

## Dependency Check

Both fields participate in the dependency check shown to the user via `/doctor`:

```javascript
// ============================================
// checkSandboxDependencies - Verifies bwrap/socat presence
// Location: cli_inner_pretty.js:195527-195539 (TFK function)
// ============================================

// ORIGINAL (for source lookup):
function TFK(H) {
  let { seccompConfig: $, bwrapPath: q, socatPath: K } = H ?? {},
    _ = [],
    A = [];
  if (q) {
    if (!ZFK(q)) _.push(`bubblewrap (bwrap) not executable at ${q}`);
  } else if (q7H("bwrap") === null) _.push("bubblewrap (bwrap) not installed");
  if (K) {
    if (!ZFK(K)) _.push(`socat not executable at ${K}`);
  } else if (q7H("socat") === null) _.push("socat not installed");
  if (!$?.argv0 && vA6($?.applyPath) === null) A.push("seccomp not available - unix socket access not restricted");
  return { warnings: A, errors: _ };
}

// READABLE (for understanding):
function checkSandboxDependencies(opts) {
  const { seccompConfig, bwrapPath, socatPath } = opts ?? {};
  const errors = [];
  const warnings = [];

  // bwrap check: admin path overrides PATH lookup.
  if (bwrapPath) {
    if (!isExecutable(bwrapPath)) {
      errors.push(`bubblewrap (bwrap) not executable at ${bwrapPath}`);
    }
  } else if (whichBinary("bwrap") === null) {
    errors.push("bubblewrap (bwrap) not installed");
  }

  // socat check: same pattern.
  if (socatPath) {
    if (!isExecutable(socatPath)) {
      errors.push(`socat not executable at ${socatPath}`);
    }
  } else if (whichBinary("socat") === null) {
    errors.push("socat not installed");
  }

  // seccomp check (warning, not error — sandbox still works, just weaker).
  if (!seccompConfig?.argv0 && findSeccompBinary(seccompConfig?.applyPath) === null) {
    warnings.push("seccomp not available - unix socket access not restricted");
  }

  return { warnings, errors };
}

// Mapping: TFK→checkSandboxDependencies, H→opts, $→seccompConfig, q→bwrapPath, K→socatPath,
//          ZFK→isExecutable, q7H→whichBinary, vA6→findSeccompBinary
```

**Two failure modes per binary:**

| Setting | Path resolves? | Result |
|---------|----------------|--------|
| `bwrapPath` set, file exists, executable | yes | OK |
| `bwrapPath` set, file missing or not +x | no | error `bubblewrap (bwrap) not executable at ${path}` |
| `bwrapPath` unset, `which bwrap` succeeds | yes | OK |
| `bwrapPath` unset, `which bwrap` fails | no | error `bubblewrap (bwrap) not installed` |

The admin-path failure message is **deliberately different** from the `$PATH` failure message: an admin who configures a bad path gets a hint that their path is wrong, not a confusing "not installed" message (it might be installed under a different location).

---

## Error Message at Subprocess Sandbox Init

The PID-namespace sandbox init (`mA6`, invoked via `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`) consults `getBwrapPath` to produce a tailored error if bwrap is missing:

```javascript
// ============================================
// assertScrubSandboxAvailable (excerpt) - tailored bwrap error
// Location: cli_inner_pretty.js:197374-197404 (mA6 function)
// ============================================

// ORIGINAL (for source lookup):
async function mA6() {
  if (!aW()) return;
  // ... setup ...
  if (
    ((ct$ = Qt$() !== null),
    // ... ou setup ...
    XgK(),
    Qt$() === null)
  ) {
    let f = tz$();
    throw Error(
      f
        ? `sandbox.bwrapPath is set to ${f} but it is not an executable file. Fix the path in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).`
        : "bubblewrap is required for subprocess env scrubbing and isolation. Install with: sudo apt-get install -y bubblewrap, set sandbox.bwrapPath in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).",
    );
  }
  // ... continue with pinned file creation ...
}

// READABLE (for understanding, error-path only):
async function assertScrubSandboxAvailable() {
  if (!isSubprocessEnvScrubEnabled()) return;
  // ... setup sandboxContext ...
  cachedBwrapAvail = resolveBubblewrap() !== null;
  // ... pre-create pinned files ...
  if (resolveBubblewrap() === null) {
    const pinnedPath = getBwrapPath();
    throw new Error(
      pinnedPath
        ? `sandbox.bwrapPath is set to ${pinnedPath} but it is not an executable file. ` +
          `Fix the path in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).`
        : "bubblewrap is required for subprocess env scrubbing and isolation. " +
          "Install with: sudo apt-get install -y bubblewrap, " +
          "set sandbox.bwrapPath in managed settings, " +
          "or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation)."
    );
  }
}

// Mapping: mA6→assertScrubSandboxAvailable, aW→isSubprocessEnvScrubEnabled,
//          Qt$→resolveBubblewrap, ct$→cachedBwrapAvail, tz$→getBwrapPath
```

### Two different error messages

The error split is deliberate UX engineering:

1. **`bwrapPath` was explicitly set but unusable** → tell the admin which path failed and where to fix it. Don't recommend `apt install` because they already chose a custom binary; the install hint would be misleading.
2. **No `bwrapPath` set and `which bwrap` failed** → tell the user how to install bwrap, *and* mention the managed-setting alternative for environments where they can't install packages.

Both messages end with "or set `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0`" — the explicit opt-out. This matters because a hard error during subprocess sandbox init prevents Claude from running at all if the user opted into env scrubbing without bwrap; the opt-out gives them an exit ramp.

---

## Why Admin-Only?

The "Only honored from admin-controlled managed settings" claim is critical for the security model. Consider what happens if a user could set `bwrapPath` in their personal `~/.claude/settings.json`:

```json
{
  "sandbox": {
    "enabled": true,
    "bwrapPath": "/home/user/.local/bin/fake-bwrap"
  }
}
```

The "fake bwrap" could be a tiny script that exec's the target command directly, bypassing all sandboxing. The user has just disabled the sandbox they (or their admin) configured to enabled.

By restricting bwrapPath to the **policy tier chain** (helper, remote, plist/HKLM, file under `/etc/claude-code` or HKLM):

- A user-tier setting is ignored — the resolver doesn't look there.
- Even if a user includes a `bwrapPath` in their settings, the schema parses it (no error), but `tz$()` returns `undefined` because the user tier isn't in `WPH()`'s tier set.
- An attacker controlling user-writable files (e.g., via prompt injection in a worktree) cannot pivot through bwrapPath.

The contrast with deniedDomains (which **is** honored from all sources) is that `deniedDomains` only *restricts* access — adding a user deny rule is a privilege-contraction, safe to honor from anywhere. `bwrapPath` could *bypass* a restriction — so it must come from the admin tier only.

---

## WSL Detection

Why "Linux/WSL only" in the description? WSL distros report `process.platform === "linux"`, so the same code path runs. The schema description signals that the field is **only meaningful** on Linux platforms — setting it on macOS does nothing because `vFK` is the Linux-specific wrapper (macOS uses `SFK` which builds Apple Sandbox profiles via `sandbox-exec`, no bwrap).

The relevant WSL detection helper:

```javascript
// ============================================
// isWSL - Detects WSL environment (Linux kernel running under Windows)
// Location: cli_inner_pretty.js:48235-48243 (Uq$ function)
// ============================================

// ORIGINAL (for source lookup):
function Uq$() {
  if (process.env.WSL_DISTRO_NAME) return !0;
  try {
    let H = require("fs").readFileSync("/proc/version", "utf8").toLowerCase();
    return H.includes("microsoft") || H.includes("wsl");
  } catch {
    return !1;
  }
}

// READABLE (for understanding):
function isWSL() {
  if (process.env.WSL_DISTRO_NAME) return true;
  try {
    const procVersion = fs.readFileSync("/proc/version", "utf8").toLowerCase();
    return procVersion.includes("microsoft") || procVersion.includes("wsl");
  } catch {
    return false;
  }
}

// Mapping: Uq$→isWSL
```

Detection serves two purposes elsewhere: enabling Windows registry policy reads, and adjusting `$PATH` walking in subprocess sandbox setup. For `bwrapPath`, no detection is needed — the WSL distro's `process.platform === "linux"` already routes through the Linux bwrap wrapper.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `SandboxSettingsSchema` (yMq) — schema with `bwrapPath`/`socatPath` absolute-path preprocess
- `getBwrapPath` (tz$) — `sandbox.bwrapPath` resolver (admin tier chain only)
- `getSocatPath` (MgK) — `sandbox.socatPath` resolver (admin tier chain only)
- `resolveBubblewrap` (Qt$) — admin-path + `$PATH` fallback
- `linuxBwrapWrapper` (vFK) — bwrap argv builder (uses `bwrapPath ?? "bwrap"`)
- `spawnNetworkBridges` (VFK) — socat bridge spawner (uses `socatPath ?? "socat"`)
- `checkSandboxDependencies` (TFK) — dependency-check function (tailored error messages)
- `assertScrubSandboxAvailable` (mA6) — subprocess sandbox init (tailored bwrap error)
- `whichBinary` (q7H) — `$PATH` lookup helper
- `isExecutable` (ZFK) — file +x test
- `isWSL` (Uq$) — WSL detector
- `getAllPolicyTierSettings` (WPH) — admin tier chain accessor
