# PID Namespace + Env Scrub Isolation — 2.1.142 Cross-Link

> **Cross-link doc.** The PID namespace + env scrub primitive landed in v2.1.98 (gated by `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`). This doc focuses on what's **new in 2.1.142**: the bwrap-path error message now mentions the `sandbox.bwrapPath` managed setting as an alternative remediation. For the underlying primitive, see the 2.1.112 baseline doc: [subprocess_pid_namespace.md (v2.1.112)](../../../claude_code_v_2.1.112/analyze/18_sandbox/subprocess_pid_namespace.md).

---

## What Changed for 2.1.142

The subprocess sandbox initialization (`assertScrubSandboxAvailable`, formerly `wp1`, now renamed to `mA6` in v2.1.142) has the **same** algorithm as in v2.1.112: it requires `bwrap` to be installed on Linux when `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` is set, else it throws.

The **diff** in 2.1.142:

1. The error message branches on whether `sandbox.bwrapPath` is admin-configured.
2. Both branches advertise the managed-settings alternative.
3. The function name was renamed `wp1` → `mA6` due to upstream bundle reshuffling.

The semantic change is purely the **error messaging** — it tells an admin in a corporate env "you can fix this via managed settings" rather than just "install bubblewrap (which you can't do in a locked-down image)."

```javascript
// ============================================
// assertScrubSandboxAvailable - 2.1.142 with bwrapPath-aware error message
// Location: cli_inner_pretty.js:197374-197404 (mA6 function)
// ============================================

// ORIGINAL (for source lookup):
async function mA6() {
  if (!aW()) return;
  let H = uA6.homedir(),
    $ = $6(),
    q = process.env.GITHUB_ENV ? Mt.dirname(process.env.GITHUB_ENV) : void 0,
    K = process.env.GITHUB_WORKSPACE;
  if (
    ((ct$ = Qt$() !== null),
    (ou = {
      home: H, originalCwd: $,
      claudeConfigDir: process.env.CLAUDE_CONFIG_DIR,
      runnerFileCommandsDir: q, workspace: K,
      GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH,
      GITHUB_EVENT_PATH: process.env.GITHUB_EVENT_PATH,
    }),
    (ou.pathDirs = (process.env.PATH ?? "")
      .split(":")
      .map((f) => (f ? Mt.posix.normalize(f).replace(/\/+$/, "") : f))
      .filter((f) => f && JgK.some((O) => f.startsWith(`${O}/`)))),
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
  // ... continue with pinned-file pre-creation (.gitconfig, .bashrc, etc.) ...
}

// READABLE (for understanding):
async function assertScrubSandboxAvailable() {
  if (!isSubprocessEnvScrubEnabled()) return;

  const home = os.homedir();
  const originalCwd = getOriginalCwd();
  const runnerFileCommandsDir = process.env.GITHUB_ENV ? path.dirname(process.env.GITHUB_ENV) : undefined;
  const workspace = process.env.GITHUB_WORKSPACE;

  cachedBwrapAvail = resolveBubblewrap() !== null;

  sandboxContext = {
    home, originalCwd,
    claudeConfigDir: process.env.CLAUDE_CONFIG_DIR,
    runnerFileCommandsDir, workspace,
    GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH,
    GITHUB_EVENT_PATH: process.env.GITHUB_EVENT_PATH,
  };

  // Filter $PATH to only directories under safe roots (/home /root /tmp /var /opt /run /mnt).
  // System bins (/usr/bin, /bin) are already auto-allowed by bwrap; this keeps only
  // additional dirs that the user might write into.
  sandboxContext.pathDirs = (process.env.PATH ?? "")
    .split(":")
    .map((p) => (p ? path.posix.normalize(p).replace(/\/+$/, "") : p))
    .filter((p) => p && SAFE_PATH_PREFIXES.some((prefix) => p.startsWith(`${prefix}/`)));

  parseScriptCapsConfig();

  // Hard requirement: bwrap must resolve.
  if (resolveBubblewrap() === null) {
    const pinnedBwrapPath = getBwrapPath();
    throw new Error(
      pinnedBwrapPath
        // Branch A: admin set bwrapPath but it doesn't resolve.
        ? `sandbox.bwrapPath is set to ${pinnedBwrapPath} but it is not an executable file. ` +
          `Fix the path in managed settings, or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation).`
        // Branch B: no bwrapPath set and which(bwrap) failed.
        : "bubblewrap is required for subprocess env scrubbing and isolation. " +
          "Install with: sudo apt-get install -y bubblewrap, " +
          "set sandbox.bwrapPath in managed settings, " +
          "or set CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0 to disable (loses subprocess isolation)."
    );
  }

  // ... continue with pinned-file pre-creation (.gitconfig, .bashrc, etc.) ...
}

// Mapping: mA6→assertScrubSandboxAvailable, aW→isSubprocessEnvScrubEnabled,
//          uA6→os module, Mt→path module, $6→getOriginalCwd,
//          Qt$→resolveBubblewrap, ct$→cachedBwrapAvail, ou→sandboxContext,
//          XgK→parseScriptCapsConfig, JgK→SAFE_PATH_PREFIXES, tz$→getBwrapPath
```

### Why the Error Message Change Matters

Pre-2.1.133, the only remediation for "bwrap not found" was `apt install bubblewrap`. In corporate environments where:

- Users can't install packages (no `sudo`, hardened base image, network-restricted package repos).
- But admins **can** push managed settings via HKLM/plist/MDM.

...the only escape valve was `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=0`, which **disables hardening entirely**. That's a regression: a user opted into hardening, the hardening failed to set up, and the only way forward is to opt back out.

The 2.1.142 error message change makes the managed-settings alternative discoverable. An admin who sees this error in a help ticket can respond "set `sandbox.bwrapPath` in your managed settings file to `/opt/our-bwrap/bin/bwrap`" instead of "we can't fix this without disabling hardening."

The change is **only an error message**, but its operational impact is real: hardening becomes feasible in environments where the previous default-discovery approach failed.

---

## Related 2.1.142 Touchpoints

The 2.1.142 sandbox stack has several other small touchpoints that intersect with `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`:

| Touchpoint | What changed | Why it matters |
|------------|--------------|----------------|
| Bubblewrap resolution (`Qt$`) | Reads `tz$()` (`getBwrapPath`) before `which("bwrap")` | Managed bwrap is found before system bwrap |
| Sandbox dependency check (`TFK`) | Distinguishes "wrong managed path" from "not installed" | Better error in `/doctor` |
| Network bridge (`VFK`) | Reads `socatPath` from sandbox config | Managed socat is found before system socat |
| Init pre-creation list | Unchanged from 2.1.112 | Same `.gitconfig`/`.bashrc`/`.npmrc` pinned files |

The list of 25 scrubbed env vars (`Yn_` → `SUBPROCESS_SCRUB_LIST`) and the gate function (`xP` → `isSubprocessEnvScrubEnabled`, but renamed `aW` in 2.1.142) remain unchanged. Refer to the v2.1.112 baseline for full coverage.

### Function-Name Mapping Across Versions

For cross-reference convenience:

| Concept | v2.1.112 obfuscated | v2.1.142 obfuscated |
|---------|---------------------|---------------------|
| Cached env-scrub gate | `xP` | `aW` |
| Subprocess env builder | `Dk` | `XI` |
| Subprocess sandbox init | `wp1` | `mA6` |
| Bubblewrap availability check | `vL8` | `ct$` |
| Resolve bubblewrap | (not split out) | `Qt$` |
| Get bwrapPath managed | (n/a — new) | `tz$` |
| `which`-style lookup | `rN` | `q7H` (binary) / `Fx` (executable) |
| Find seccomp binary | `Hl_` | `Ea1` |
| MCP-side scrub gate | `Kn_` | `Ws1` |
| Sandbox context cache | `kR` | `ou` |
| Scrub-list | `Yn_` | `Z3H` |

The renames are due to upstream bundler reshuffling (the obfuscated name pool reset). The semantics are unchanged for all functions in the table; the v2.1.142 docs use the new names. For symbol-index lookups, see [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md).

---

## Where the Network Proxy Fits

The PID namespace sandbox (when `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`) is a separate stack from the `sandbox.enabled` settings-driven sandbox. Both can be active simultaneously:

```
┌─ Setting-driven sandbox (sandbox.enabled: true)             ─┐
│   • Builds Apple Sandbox profile (macOS) or bwrap argv (Linux) │
│   • Network filter via in-process proxy (deniedDomains etc.)   │
│   • Filesystem filter via bind/tmpfs mounts                    │
│   • Uses sandbox.bwrapPath / sandbox.socatPath (Linux)         │
└────────────────────────────────────────────────────────────────┘
            ▲
            │ same bwrap binary
            ▼
┌─ Env-scrub sandbox (CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1)      ─┐
│   • Scrubs 25 secret-bearing env vars                          │
│   • Wraps with bwrap PID namespace + seccomp filter            │
│   • Forces permission mode to "default"                        │
│   • Pre-creates pinned files for git/npm/etc.                  │
│   • Reads sandbox.bwrapPath as resolution hint                 │
└────────────────────────────────────────────────────────────────┘
```

Both consult `tz$()` for the bwrap path. The 2.1.133 addition of `sandbox.bwrapPath` was deliberately shared between these two stacks — an admin only needs to pin the path once, and both consumers honor it.

The 2.1.142 error message change in `mA6` is specifically for the env-scrub stack's "missing bwrap" error; the sandbox-enabled stack has its own error path through `TFK` (`checkSandboxDependencies`), which got the same "tailored message" treatment in 2.1.133.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `assertScrubSandboxAvailable` (mA6, 2.1.142; was wp1 in 2.1.112) — subprocess sandbox init, branches error on managed bwrap path
- `isSubprocessEnvScrubEnabled` (aW, 2.1.142; was xP) — cached env-scrub gate
- `resolveBubblewrap` (Qt$) — admin-path-first lookup
- `getBwrapPath` (tz$) — managed-settings bwrap path
- `parseScriptCapsConfig` (XgK) — script-caps init (unchanged from 2.1.112)
- `sandboxContext` (ou) — per-process cache of home/cwd/workspace/PATH dirs

Cross-references:
- [bwrap_socat_paths.md](./bwrap_socat_paths.md) — full coverage of `sandbox.bwrapPath` resolver chain
- [v2.1.112 subprocess_pid_namespace.md](../../../claude_code_v_2.1.112/analyze/18_sandbox/subprocess_pid_namespace.md) — baseline for the 25-var scrub list, pinned-file pre-creation, bare-repo scrub, forced permission mode
