# Linux `apply-seccomp` Helper — 2.1.142 Cross-Link

> **Cross-link doc.** The `apply-seccomp` helper landed in v2.1.92 (bundling the binary in both npm and native builds to restore unix-socket blocking inside the seccomp sandbox). This doc documents the **2.1.142 form** of the lookup helper and its integration with the bwrap network bridge. For the underlying threat model and 2.1.92 fix history, see the 2.1.112 baseline doc's *Seccomp & apply-seccomp Helper* section: [subprocess_pid_namespace.md (v2.1.112)](../../../claude_code_v_2.1.112/analyze/18_sandbox/subprocess_pid_namespace.md).

---

## What the Helper Does

`apply-seccomp` is a small native binary shipped under `vendor/seccomp/<arch>/apply-seccomp` (npm install) or `<global-prefix>/vendor/seccomp/<arch>/apply-seccomp` (native install). Its job:

1. Load a BPF (Berkeley Packet Filter) program that blocks `socket(AF_UNIX, ...)` syscalls.
2. `execve()` the target command.

The BPF filter survives the `execve`, so any subprocess of the bwrap-launched shell inherits the block. Unix-socket creation is denied, but unix-socket *connect* to bind-mounted bridge sockets (the proxy bridges set up by `socat`) is still allowed because connect() goes through a different code path that the BPF doesn't filter.

The narrow goal: prevent the sandboxed shell from creating its own unix sockets to bypass the network proxy. The legitimate unix-socket use (connecting to the proxy bridge) survives because it's a connect-to-existing not a create-new.

---

## 2.1.142 Architecture Lookup

```javascript
// ============================================
// detectArchitecture - Determine seccomp BPF arch suffix
// Location: cli_inner_pretty.js:195335-195355 (XFK function)
// ============================================

// ORIGINAL (for source lookup):
function XFK() {
  switch ("x64") {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      return (
        e6(
          "[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.",
          { level: "error" },
        ),
        null
      );
    default:
      return (e6("[SeccompFilter] Unsupported architecture: x64. Only x64 and arm64 are supported."), null);
  }
}

// READABLE (for understanding):
function detectArchitecture() {
  // NOTE: process.arch is evaluated at build-time and substituted as literal "x64" by the bundler.
  //       The switch is preserved for source clarity; only the matched case actually runs.
  switch (process.arch) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      log(
        "[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. " +
        "The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.",
        { level: "error" }
      );
      return null;
    default:
      log(`[SeccompFilter] Unsupported architecture: ${process.arch}. Only x64 and arm64 are supported.`);
      return null;
  }
}

// Mapping: XFK→detectArchitecture, e6→log
```

### Why 32-bit x86 is Unsupported

The log message is unusually verbose for a stub function — it tells the operator **why** ia32 is rejected, not just *that* it's rejected:

- The seccomp filter blocks `socket(AF_UNIX, ...)` — a glibc wrapper around the `socket` syscall.
- On 64-bit Linux, `socket` is a real syscall and the BPF rule matches.
- On 32-bit x86 Linux, `socket` is implemented via the `socketcall` multiplexer syscall — `socketcall(SYS_SOCKET, [AF_UNIX, ...])` — which the BPF rule does **not** match.
- An attacker on ia32 could call `socketcall(SYS_SOCKET, ...)` directly and bypass the filter.

Rather than ship a broken filter on ia32 (which gives a false sense of security), the helper returns `null` and the bwrap wrapper silently disables seccomp on that arch. The log entry explains the gap to the operator. **Refusing protection is better than fake protection** — the operator's threat model can then decide whether to accept the gap or refuse to run on ia32.

---

## Search Path Strategy

```javascript
// ============================================
// listBundleSearchPaths - npm install path candidates
// Location: cli_inner_pretty.js:195356-195366 (Na1 function)
// ============================================

// ORIGINAL (for source lookup):
function Na1(H) {
  let $ = XFK();
  if (!$) return [];
  let q = OC.dirname(
      DFK.fileURLToPath(
        "file:///home/runner/work/claude-cli-internal/claude-cli-internal/node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/generate-seccomp-filter.js",
      ),
    ),
    K = OC.join("vendor", "seccomp", $, H);
  return [OC.join(q, K), OC.join(q, "..", "..", K), OC.join(q, "..", K)];
}

// READABLE (for understanding):
function listBundleSearchPaths(binaryName) {
  const arch = detectArchitecture();
  if (!arch) return [];

  // The build-time file:// URL embeds the original build location. The bundler
  // substitutes import.meta.url with a string literal, so this works after
  // bundling because we extract dirname of the substituted URL — which gives
  // the runtime location of the bundled module.
  const moduleDir = path.dirname(
    url.fileURLToPath(
      "file:///home/runner/work/claude-cli-internal/claude-cli-internal/node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/generate-seccomp-filter.js",
    )
  );

  const subPath = path.join("vendor", "seccomp", arch, binaryName);
  // Three candidates: module dir, module dir + ../.., module dir + ..
  // These cover npm flat install, hoisted dependency, and global pnpm structures.
  return [
    path.join(moduleDir, subPath),       // ./vendor/seccomp/<arch>/apply-seccomp
    path.join(moduleDir, "..", "..", subPath), // ../../vendor/seccomp/<arch>/apply-seccomp
    path.join(moduleDir, "..", subPath),  // ../vendor/seccomp/<arch>/apply-seccomp
  ];
}

// Mapping: Na1→listBundleSearchPaths, OC→path module, DFK→url module, H→binaryName,
//          XFK→detectArchitecture, $→arch, q→moduleDir, K→subPath
```

**Why three candidates?**

The npm ecosystem has multiple install layouts:
- **Flat install (default npm)**: each package gets its own `node_modules/` subtree, so `@anthropic-ai/sandbox-runtime/vendor/` is reachable from the package's own `dist/`.
- **Hoisted dependency (yarn, pnpm `--shamefully-hoist`)**: the vendor directory may be promoted up two levels, near `node_modules/.bin/`.
- **Global install with native bundling**: vendor lives sibling to the dist directory.

Probing three paths covers ~95% of real installs. If none hit, the lookup falls through to the global-prefix search (next section).

---

## Cached Lookup

```javascript
// ============================================
// findSeccompBinary - Memoized lookup with explicit-path override
// Location: cli_inner_pretty.js:195367-195388 (vA6 / Ea1 functions)
// ============================================

// ORIGINAL (for source lookup):
function vA6(H) {
  let $ = H ?? "";
  if (TA6.has($)) return TA6.get($);
  let q = Ea1(H);
  return (TA6.set($, q), q);
}
function Ea1(H) {
  if (H) {
    if (bt$.existsSync(H)) return (e6(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${H}`), H);
    e6(`[SeccompFilter] Explicit path provided but file not found: ${H}`);
  }
  let $ = XFK();
  if (!$) return (e6("[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture x64"), null);
  e6(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${$}`);
  for (let q of Na1("apply-seccomp"))
    if (bt$.existsSync(q)) return (e6(`[SeccompFilter] Found apply-seccomp binary: ${q} (${$})`), q);
  for (let q of ka1()) {
    let K = OC.join(q, "vendor", "seccomp", $, "apply-seccomp");
    if (bt$.existsSync(K)) return (e6(`[SeccompFilter] Found apply-seccomp binary in global install: ${K} (${$})`), K);
  }
  return (e6(`[SeccompFilter] apply-seccomp binary not found in any expected location (${$})`), null);
}

// READABLE (for understanding):
const seccompBinaryCache = new Map();

function findSeccompBinary(explicitPath) {
  const cacheKey = explicitPath ?? "";
  if (seccompBinaryCache.has(cacheKey)) return seccompBinaryCache.get(cacheKey);
  const result = findSeccompBinaryImpl(explicitPath);
  seccompBinaryCache.set(cacheKey, result);
  return result;
}

function findSeccompBinaryImpl(explicitPath) {
  // (1) Explicit path wins (e.g., custom build).
  if (explicitPath) {
    if (fs.existsSync(explicitPath)) {
      log(`[SeccompFilter] Using apply-seccomp binary from explicit path: ${explicitPath}`);
      return explicitPath;
    }
    log(`[SeccompFilter] Explicit path provided but file not found: ${explicitPath}`);
    // Fall through to default search — explicit path may have been a misconfiguration.
  }

  // (2) Determine architecture suffix.
  const arch = detectArchitecture();
  if (!arch) {
    log(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`);
    return null;
  }
  log(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${arch}`);

  // (3) Search bundled paths (npm install).
  for (const candidate of listBundleSearchPaths("apply-seccomp")) {
    if (fs.existsSync(candidate)) {
      log(`[SeccompFilter] Found apply-seccomp binary: ${candidate} (${arch})`);
      return candidate;
    }
  }

  // (4) Search global install fallback (native build).
  for (const globalDir of listGlobalInstallDirs()) {
    const candidate = path.join(globalDir, "vendor", "seccomp", arch, "apply-seccomp");
    if (fs.existsSync(candidate)) {
      log(`[SeccompFilter] Found apply-seccomp binary in global install: ${candidate} (${arch})`);
      return candidate;
    }
  }

  // (5) Nothing found.
  log(`[SeccompFilter] apply-seccomp binary not found in any expected location (${arch})`);
  return null;
}

// Mapping: vA6→findSeccompBinary, Ea1→findSeccompBinaryImpl, TA6→seccompBinaryCache,
//          XFK→detectArchitecture, Na1→listBundleSearchPaths, ka1→listGlobalInstallDirs,
//          OC→path module, bt$→fs module, H→explicitPath
```

### Algorithm

**What it does:** Locates the `apply-seccomp` binary for the current architecture, with an explicit-path override option. Memoizes the result.

**How it works:**

1. **Cache check.** If we've already resolved for this `explicitPath` (or default `""`), return cached.
2. **Explicit path override.** If caller passed a path, check it. If it exists, use it. If not, log a warning and *fall through to default search* — the explicit path was a hint, not a hard constraint.
3. **Architecture detect.** Returns null on unsupported arch (with an informative log).
4. **Bundled paths.** Try the three npm-install candidates from `listBundleSearchPaths`.
5. **Global install fallback.** For each known global-prefix dir (`/usr/lib/node_modules`, etc.), try `<dir>/vendor/seccomp/<arch>/apply-seccomp`.
6. **Final null.** No matches → seccomp filter is silently disabled in the bwrap wrapper (with a warning at the call site, not here).

**Why this approach:**

- **Memoization.** This function is called from `vFK` (the bwrap wrapper) for every sandboxed Bash invocation. Filesystem `existsSync` is cheap but not free at high call rates; the cache makes it free after the first lookup.
- **Explicit-path fallthrough**, not hard-fail. If an admin sets `sandbox.seccomp.applyPath` to a wrong location, we still try the default search rather than refusing seccomp entirely. The log warning gives them diagnostic info; the search keeps the sandbox functional.
- **Two-stage search** (bundle paths → global install) covers both common deployment models without requiring the user to choose.

**Key insight:** The cache key is the *explicit path*, not just the architecture. This means:

- Cache miss for `findSeccompBinary()` (default) → search and cache.
- Cache miss for `findSeccompBinary("/opt/custom/apply-seccomp")` → independent search and cache.

Both can coexist without interference. The cache is module-level (lives for the process lifetime), so no LRU eviction concerns.

---

## Multicall (argv0-Mode) Variant — 2.1.142 New

In 2.1.142, the seccomp config supports a **multicall** mode where `apply-seccomp` is the same binary as `bwrap` (or some other launcher), dispatched via `ARGV0`:

```javascript
// From bgK function:
function bgK() {
  if (!RgK()) return;
  return { applyPath: `/proc/self/fd/${gA6}`, argv0: "apply-seccomp" };
}
```

The `applyPath: /proc/self/fd/<N>` form uses an open file descriptor inherited by the bwrap-child process — a self-referential bundle that contains the seccomp binary's bytes. The `argv0: "apply-seccomp"` tells the multicall dispatcher to run as `apply-seccomp` (vs. as `bwrap` or `socat`).

This pattern (a single multi-call binary that dispatches on ARGV0) is widely used by busybox and Alpine's `mkimage`. Here it lets the sandbox-runtime ship a single statically-linked binary that contains all three helpers, reducing the install footprint and simplifying the search path (one binary to find, not three).

The `Ra1` function builds the bwrap argv prefix that invokes the multicall:

```javascript
// ============================================
// buildSeccompArgvPrefix - bwrap argv prefix for apply-seccomp invocation
// Location: cli_inner_pretty.js:195604-195611 (Ra1 function)
// ============================================

// ORIGINAL (for source lookup):
function Ra1(H, $) {
  if ($) {
    if (!H) throw Error("seccompConfig.argv0 requires seccompConfig.applyPath");
    return `ARGV0=${al.default.quote([$])} ${al.default.quote([H])} `;
  }
  let q = vA6(H);
  return q ? `${al.default.quote([q])} ` : void 0;
}

// READABLE (for understanding):
function buildSeccompArgvPrefix(applyPath, argv0Name) {
  if (argv0Name) {
    // Multicall mode: ARGV0=apply-seccomp <multicall-binary>
    if (!applyPath) throw new Error("seccompConfig.argv0 requires seccompConfig.applyPath");
    return `ARGV0=${shellQuote(argv0Name)} ${shellQuote(applyPath)} `;
  }
  // Direct mode: <apply-seccomp> (locate via search if applyPath null)
  const resolved = findSeccompBinary(applyPath);
  return resolved ? `${shellQuote(resolved)} ` : undefined;
}

// Mapping: Ra1→buildSeccompArgvPrefix, H→applyPath, $→argv0Name,
//          al.default.quote→shellQuote, vA6→findSeccompBinary
```

### Why Multicall?

The multicall pattern matters in two scenarios:

1. **Bundled deployment via `/proc/self/fd/N`.** When Claude is shipped as a single binary (the bun-compiled native build), the seccomp helper lives inside the same executable. Using `/proc/self/fd/N` references a memfd that contains the helper's bytes. The bwrap-child inherits the fd and can exec from it.
2. **Custom enterprise builds.** An admin building a vendored sandbox-runtime can ship one binary instead of three (bwrap, socat, apply-seccomp), and use ARGV0 dispatching to pick the right "mode" inside bwrap.

The 2.1.142 form supports both modes via the single `seccompConfig` shape — `{ applyPath, argv0? }`. If `argv0` is set, the binary is treated as a multicall dispatcher and invoked with `ARGV0=apply-seccomp`. If `argv0` is absent, the binary is the plain helper found via `findSeccompBinary`.

---

## Integration with bwrap

The seccomp prefix is wired into the bwrap invocation in `vFK`:

```javascript
// From vFK function (cli_inner_pretty.js:195744-195830):
async function vFK(H) {
  let { /*...*/, seccompConfig: L, bwrapPath: P, socatPath: Z, /*...*/ } = H;
  // ...
  let E;
  if (!w)
    if (((E = Ra1(L?.applyPath, L?.argv0)), !E))
      e6("[Sandbox Linux] apply-seccomp binary not available - unix socket blocking disabled. " +
         "Install @anthropic-ai/sandbox-runtime globally for full protection.",
         { level: "warn" });
    else e6("[Sandbox Linux] Applying seccomp filter for Unix socket blocking");
  else e6("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
  // ... build bwrap argv ...
  // E (if non-null) is prepended to the inner shell command:
  if (q && K && _) {
    let u = Ca1(K, _, $, E, C, Z);    // network bridge case
    v.push(u);
  } else if (E) {
    let u = E + al.default.quote([C, "-c", $]);  // seccomp-only case
    v.push(u);
  } else v.push($);                   // no seccomp case
  // ...
}
```

The seccomp prefix (`apply-seccomp <args>` or `ARGV0=apply-seccomp <multicall>`) becomes the **last layer** of command invocation inside bwrap:

```
bwrap --new-session --die-with-parent ... -- bash -c "apply-seccomp bash -c <user-command>"
                                                       ↑
                                                       seccomp prefix (E)
```

The inner `bash -c <user-command>` executes the actual user command. The `apply-seccomp` wrapper applies the BPF filter before exec'ing the inner bash, so the filter is in place when the user command runs.

### `allowAllUnixSockets` Bypass

When `sandbox.network.allowAllUnixSockets: true`, the seccomp filter is **deliberately skipped**:

```javascript
if (!w)  // w = allowAllUnixSockets
  // ... apply seccomp filter ...
else e6("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
```

The reasoning: if the operator explicitly allows all unix sockets (e.g., to support Docker, X11, or some local IPC daemon), the filter would block legitimate sockets they need. The opt-in flag disables the filter as a matched concession.

---

## What's NEW vs. 2.1.112

The 2.1.92 fix (bundling apply-seccomp in npm builds) is the **baseline**. v2.1.142 adds:

1. **Multicall (`argv0`) variant** — described above. Supports `/proc/self/fd/N` self-reference.
2. **Renames** — `Hl_` → `Ea1`/`vA6` (split into impl + memoized wrapper). The split is for cleaner caching.
3. **Improved ia32 log message** — the 2.1.112 version had a generic "unsupported architecture" log; 2.1.142 explains the socketcall bypass.

The actual BPF program embedded in `apply-seccomp` is unchanged: it still blocks `socket(AF_UNIX, ...)` on x86_64 and arm64.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_sandbox.md](../00_overview/symbol_additions_v2_1_142_sandbox.md)

Key functions in this document:
- `findSeccompBinary` (vA6) — memoized wrapper
- `findSeccompBinaryImpl` (Ea1) — actual search (explicit → bundle → global → null)
- `detectArchitecture` (XFK) — arch suffix (x64 / arm64 / null)
- `listBundleSearchPaths` (Na1) — npm-install candidate paths
- `listGlobalInstallDirs` (ka1) — global install candidate dirs
- `buildSeccompArgvPrefix` (Ra1) — bwrap argv prefix (multicall-aware)
- `getSeccompConfig` (bgK) — produces `{ applyPath: /proc/self/fd/N, argv0: "apply-seccomp" }` for bundled binary
- `checkSeccompAvailable` (RgK) — gates `bgK` on bundled-binary mode
- `linuxBwrapWrapper` (vFK) — consumer (prepends seccomp prefix to inner bash invocation)

Cross-references:
- [bwrap_socat_paths.md](./bwrap_socat_paths.md) — bwrap/socat path resolution (sibling to seccomp lookup)
- [pid_namespace_isolation.md](./pid_namespace_isolation.md) — env-scrub + PID namespace stack (uses same bwrap wrapper)
- [v2.1.112 subprocess_pid_namespace.md](../../../claude_code_v_2.1.112/analyze/18_sandbox/subprocess_pid_namespace.md) — 2.1.92 fix baseline + threat model
