# `sandbox.credentials` — block sandboxed commands from reading credential files / secret env

> **Type/version:** NET-NEW in window (changelog **2.1.187**; no 187 bundle exists, so attribution rests on `grep` 183=0 / 193>0). Confidence HIGH.
> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (build `a1938d2a`). `<line>` is **193** unless tagged **(183)**.

> **Disambiguation:** the seed anchors at `:4790`/`:8438` (`credentials_path`, client `credentials`) are the **Anthropic-SDK** auth option — *unrelated* to this feature. The real feature is the `sandbox.credentials` settings sub-object below.

---

## TL;DR

A new settings sub-object `sandbox.credentials` lets an admin name (a) credential **files/directories** and (b) secret **environment variables** that must be hidden from sandboxed Bash commands. At enforcement time:

- each `files[].path` with `mode:"deny"` is folded into the sandbox **filesystem deny-read** set, so a sandboxed command **physically cannot read** e.g. `~/.aws/credentials`;
- each `envVars[].name` with `mode:"deny"` is **unset** from the sandboxed command's environment.

The public schema only permits `mode:"deny"`, but the enforcer also implements a **staged `mode:"mask"`** branch (per-host secret injection via a sentinel registry) that is *not* exposed in the schema yet — a committed-but-hidden capability.

---

## 1. The schema — `kwr` / `Rwr` / `IEu`, wired into the sandbox root via `Lwr`

**What it does.** Defines two entry schemas (one per protected resource type) and the `credentials` object that holds arrays of each, then wires that object into the sandbox settings root.

```javascript
// ============================================
// sandbox.credentials schema - file entry, env entry, and the credentials object
// Location: cli_inner_pretty.js:54048-54077 (entries+object), 54096 (wired into Lwr)
// ============================================

// ORIGINAL (for source lookup):
kwr = Ce(() => A.object({
  path: A.string().min(1).describe("Path to a credential file or directory. Same resolution as sandbox.filesystem.* paths…"),
  mode: A.literal("deny").describe("Access mode for this path. Only `deny` is supported."),
}));
Rwr = Ce(() => A.object({
  name: A.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "Environment variable name must start with a letter or underscore…").describe("Environment variable name."),
  mode: A.literal("deny").describe("Access mode for this environment variable. Only `deny` is supported."),
}));
IEu = Ce(() => A.object({
  files: A.array(kwr()).optional().describe("Credential files or directories to protect. `deny` blocks reads inside the sandbox."),
  envVars: A.array(Rwr()).optional().describe("Environment variables to protect. `deny` unsets the variable for sandboxed commands."),
}).optional());
// ... in the sandbox root schema Lwr:
//   network: wEu(), filesystem: CEu(), credentials: IEu(),     // :54096

// READABLE (for understanding):
credentialFileEntry = lazy(() => zod.object({
  path: zod.string().min(1).describe("credential file/dir; resolved like sandbox.filesystem paths"),
  mode: zod.literal("deny"),                              // ← only "deny" is public
}));
secretEnvEntry = lazy(() => zod.object({
  name: zod.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/),   // valid POSIX env-var name
  mode: zod.literal("deny"),
}));
sandboxCredentials = lazy(() => zod.object({
  files: zod.array(credentialFileEntry()).optional(),     // protect these paths
  envVars: zod.array(secretEnvEntry()).optional(),        // unset these env vars
}).optional());
// sandbox root: { …, network, filesystem, credentials: sandboxCredentials(), … }

// Mapping: kwr→credentialFileEntry, Rwr→secretEnvEntry, IEu→sandboxCredentials, Lwr→sandboxRootSchema,
//          Ce→lazy, A→zod
```

**Why `mode` is a single-value `A.literal("deny")` (not an enum).** Declaring `mode` as a literal with describe "Only `deny` is supported" pins the public contract to exactly one behavior while leaving the field *shaped* for future modes. The enforcer (§3) already branches on `mode === "mask"`, so the literal is a deliberate forward-compatible stub: the schema is the *public* surface, narrower than the *implemented* surface. The env-var `name` regex `/^[A-Za-z_][A-Za-z0-9_]*$/` is a standard POSIX identifier guard so an invalid name cannot slip into the unset list and silently no-op.

---

## 2. Config assembly — merge `credentials` across all settings sources

**What it does.** Walks every settings source, collects each source's `sandbox.credentials.files` (path-resolved relative to that source) and `envVars`, and produces a single merged `{ files, envVars }` (or `undefined` if no source defines any).

```javascript
// ============================================
// credentials assembly - merge files/envVars across all settings sources
// Location: cli_inner_pretty.js:219470-219477
// ============================================

// ORIGINAL (for source lookup):
let C = [], x = [], I = !1;
for (let $ of jT) {
  let W = _n($)?.sandbox?.credentials;
  if (!W) continue;
  ((I = !0), C.push(...(W.files ?? []).map((G) => ({ ...G, path: p3e(G.path, $) }))), x.push(...(W.envVars ?? [])));
}
let k = I ? { files: C, envVars: x } : void 0,

// READABLE (for understanding):
let mergedFiles = [], mergedEnvVars = [], anyDefined = false;
for (let source of SETTINGS_SOURCES) {                          // jT
  let creds = readSettings(source)?.sandbox?.credentials;      // _n
  if (!creds) continue;
  anyDefined = true;
  mergedFiles.push(...(creds.files ?? []).map((f) => ({ ...f, path: resolvePath(f.path, source) }))); // p3e
  mergedEnvVars.push(...(creds.envVars ?? []));
}
let credentials = anyDefined ? { files: mergedFiles, envVars: mergedEnvVars } : undefined;

// Mapping: jT→SETTINGS_SOURCES, _n→readSettings, p3e→resolvePath (per-source path resolution),
//          C→mergedFiles, x→mergedEnvVars, I→anyDefined, k→credentials
```

**Why per-source path resolution (`p3e(path, source)`).** A credential path written in *project* settings should resolve relative to the project root; the same syntax in *user* settings resolves relative to `~/.claude`. By resolving each `files[].path` against the source it came from (the same `p3e` used for `sandbox.filesystem.*` paths), `~/.aws/credentials` in user settings and `./secrets/token` in project settings both land on absolute paths in one merged list. Merging (union) rather than override means **every** source's protections apply — a stricter project policy cannot be silently dropped by a laxer user setting.

---

## 3. Enforcement — `resolveCredentialProtection` (`Rqi`) → `Yjd`

**What it does.** `Rqi` turns the merged credentials object into `{ denyReadPaths, unsetEnvVars, setEnvVars }`. `Yjd` folds `denyReadPaths` into the sandbox filesystem deny-read set so they are physically unreadable.

```javascript
// ============================================
// resolveCredentialProtection - credential files → deny-read; secret env → unset (or staged mask)
// Location: cli_inner_pretty.js:211660-211672
// ============================================

// ORIGINAL (for source lookup):
function Rqi(e, t) {
  if (!e) return { denyReadPaths: [], unsetEnvVars: [], setEnvVars: {} };
  let r = (e.files ?? []).filter((i) => i.mode === "deny").map((i) => i.path), o = [], s = {};
  for (let i of e.envVars ?? [])
    if (i.mode === "deny") o.push(i.name);
    else if (i.mode === "mask") {
      let a = process.env[i.name];
      if (a === void 0) continue;
      let l = i.injectHosts ?? t ?? [];
      s[i.name] = FRn.register(i.name, a, l);
    }
  return { denyReadPaths: [...new Set(r)], unsetEnvVars: [...new Set(o)], setEnvVars: s };
}

// READABLE (for understanding):
function resolveCredentialProtection(credentials, defaultInjectHosts) {
  if (!credentials) return { denyReadPaths: [], unsetEnvVars: [], setEnvVars: {} };
  let denyFiles = (credentials.files ?? []).filter((f) => f.mode === "deny").map((f) => f.path),
    unset = [], masked = {};
  for (let ev of credentials.envVars ?? [])
    if (ev.mode === "deny") unset.push(ev.name);                       // public path: unset the secret
    else if (ev.mode === "mask") {                                     // STAGED (not in public schema)
      let realValue = process.env[ev.name];
      if (realValue === undefined) continue;
      let injectHosts = ev.injectHosts ?? defaultInjectHosts ?? [];
      masked[ev.name] = secretInjectionRegistry.register(ev.name, realValue, injectHosts); // sentinel placeholder
    }
  return { denyReadPaths: [...new Set(denyFiles)], unsetEnvVars: [...new Set(unset)], setEnvVars: masked };
}

// Mapping: Rqi→resolveCredentialProtection, t→defaultInjectHosts, FRn→secretInjectionRegistry,
//          r→denyFiles, o→unset, s→masked
```

```javascript
// ============================================
// Yjd - fold credential denyReadPaths into the sandbox filesystem deny-read set
// Location: cli_inner_pretty.js:211677-211687
// ============================================

// ORIGINAL (for source lookup):
function Yjd() {
  if (!Ya || Ya.filesystem.disabled) return { denyOnly: [], allowWithinDeny: [] };
  let e = [...new Set([...Ya.filesystem.denyRead, ...Rqi(Ya.credentials, Ya.network.allowedDomains).denyReadPaths])], t = [];
  for (let r of e) { let o = VG(r);
    if (bM() === "linux" && SM(o)) { let s = _Nt(r); (Bo(`[Sandbox] Expanded glob pattern "${r}" to ${s.length} paths on Linux`), t.push(...s)); }
    else t.push(o); }
  ...
}

// READABLE (for understanding):
function buildSandboxFsDenyRead() {
  if (!sandboxConfig || sandboxConfig.filesystem.disabled) return { denyOnly: [], allowWithinDeny: [] };
  let denySet = [...new Set([
    ...sandboxConfig.filesystem.denyRead,                                                   // explicit deny-read
    ...resolveCredentialProtection(sandboxConfig.credentials, sandboxConfig.network.allowedDomains).denyReadPaths, // ← credential files
  ])];
  // …glob-expand on Linux, normalize each path…
}

// Mapping: Yjd→buildSandboxFsDenyRead, Ya→sandboxConfig, Rqi→resolveCredentialProtection, VG→normalizePath
```

**Why two enforcement primitives (deny-read for files, unset for env).** A credential **file** is protected by the filesystem layer the sandbox already owns — adding the path to `denyRead` means the kernel-level sandbox denies the read, so even a command that knows the path gets EACCES. A secret **env var** has no filesystem presence; the only way to hide it from a child process is to **remove it from the spawned environment**. So the feature reuses the sandbox's two existing isolation primitives (fs deny-read, env scrub), one per resource class, rather than inventing new machinery. The `[...new Set(...)]` dedupes so the same path/var named by two settings sources is enforced once.

---

## 4. The STAGED `mode:"mask"` injection path (not in the public schema)

The `else if (i.mode === "mask")` branch in `Rqi` implements a *third* mode the schema does **not** expose. Instead of unsetting the secret, it:

1. reads the real value from `process.env`,
2. registers it in `secretInjectionRegistry` (`FRn`, `:209633`) which returns a **sentinel** placeholder string bound to a list of `injectHosts`,
3. sets the env var to the *sentinel* (`setEnvVars`), not the real value.

The companion machinery (`FRn.register` at `:209633`, `FRn.substituteInHeaders` at `:211518`, and the gate `Ya?.credentials?.allowPlaintextInject` at `:211560`) substitutes the real secret back into outbound request **headers only for whitelisted hosts**, so the secret never appears in the child's environment in plaintext yet still reaches the intended API. This is a **credential-injection** capability — the sandboxed command sees a sentinel, and only traffic to approved hosts gets the real token.

**Why staged (schema-hidden).** The public schema's `mode: A.literal("deny")` deliberately excludes `"mask"`, so no user config can reach this branch today. The enforcer carries the implementation so the feature can be activated by widening the schema literal to an enum — the same dark-launch pattern seen elsewhere in 193 (cf. the `toolDenialKind` taxonomy). Reported as a **staged capability**, not part of the 2.1.187 changelog bullet, flagged for follow-up.

---

## Evidence note (NET-NEW vs carryover)

| Item | 193 anchor | 183 status | grep diff |
|------|-----------|------------|-----------|
| File entry schema `kwr` | `:54048` | absent | net-new |
| Env entry schema `Rwr` | `:54059` | absent | net-new |
| `sandbox.credentials` object `IEu` | `:54069` | absent | net-new |
| Wired into root `Lwr` | `:54096` | absent | net-new |
| Describe strings | `:54072`,`:54075` | absent | `grep -c` 183=**0**, 193=**2** |
| Config assembly | `:219470` | absent | net-new |
| Enforcement `Rqi` | `:211660` | absent | net-new |
| Deny-read merge `Yjd` | `:211677` | n/a | net-new merge clause |
| `denyReadPaths`/`unsetEnvVars` symbols | 4+6 hits | absent | `grep -c denyReadPaths` 183=**0**, 193=**4**; `unsetEnvVars` 193=**6** |
| Staged `mode:"mask"` + `FRn` | `:211667`,`:209633` | absent | net-new (not in schema) |

Every load-bearing symbol is absent in 183 (`grep -c denyReadPaths` 183=0). Since no 2.1.187 bundle exists, attribution to 2.1.187 rests on the changelog plus the clean 183=0 / 193>0 split.

---

## Cross-links

- Sibling 193 docs: [recent_denied_overlay.md](./recent_denied_overlay.md) (the `ko` sandbox controller surface + session-allowed-hosts that share the sandbox config rebuild path), [README.md](./README.md).
- The sandbox filesystem/network isolation engine (`sandboxConfig` / `Ya`) is the broader host for `denyRead`; the credential paths join its existing deny-read set.

---

## Related Symbols

> Symbol mappings live in the symbol index files, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Sandbox (home for `sandbox.credentials`)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
> - per-feature additions: [symbol_additions_v2_1_193_permissions.md](../00_overview/symbol_additions_v2_1_193_permissions.md)

Key functions in this document:

- `credentialFileEntry` (obf: `kwr`, `:54048`) — `{ path: string.min(1), mode: literal("deny") }`.
- `secretEnvEntry` (obf: `Rwr`, `:54059`) — `{ name: /^[A-Za-z_]\w*$/, mode: literal("deny") }`.
- `sandboxCredentials` (obf: `IEu`, `:54069`) — `{ files?, envVars? }`; wired into root `Lwr` at `:54096`.
- credentials assembly (loop over `jT` at `:219470`) — per-source path-resolved merge via `p3e`.
- `resolveCredentialProtection` (obf: `Rqi`, `:211660`) — `{denyReadPaths, unsetEnvVars, setEnvVars}`; deny/mask branches.
- `buildSandboxFsDenyRead` (obf: `Yjd`, `:211677`) — folds `denyReadPaths` into `filesystem.denyRead`.
- `secretInjectionRegistry` (obf: `FRn`, `:209633`) — sentinel registry for the staged `mode:"mask"` injection; `allowPlaintextInject` gate at `:211560`.
