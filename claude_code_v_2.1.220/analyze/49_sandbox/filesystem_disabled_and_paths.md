# `sandbox.filesystem.disabled` and the path-containment layer (v2.1.216 + v2.1.205/.210/.214)

> **Verdict: DELTA, not an introduction.** `.216`'s bullet reads *"Added `sandbox.filesystem.disabled`
> setting to skip filesystem isolation while keeping network egress control"*. `grep -c 'filesystem.disabled'`
> is **220=7 / 193=6**: six of the seven sites are byte-for-byte carryover, and the one new site is not an
> enforcement branch at all. The real delta is a **new settings resolver** (`xVg`, `:204669-204677`) plus a
> **platform veto** inside `getEffectiveFilesystemPolicy` (`ult`, `:204678-204686`) — neither of which
> mentions the literal `filesystem.disabled` in a way the naive grep attributes to the bullet.
>
> This doc also covers the window's *path-containment* work, which is where the substance is: late `.claude/*`
> symlink reconciliation (`.210`), a new bounded symlink resolver with a fail-closed branch in the Linux
> bwrap deny loop, worktree/junction/UNC escapes (`.205`, `.210`, `.214`, `.216`), the Windows argv budget,
> and the `E2BIG` worktree diagnostic (`.205`).
>
> TARGET bundle: `.../2.1.220/extract/cli_inner_pretty.js` (`build_sha 4073f595`). Bare
> `cli_inner_pretty.js:<line>` = a **220** line I read. Baseline lines tagged **(193)**.
> **Platform caveat:** this extract is the **Linux target build** — `kH()` (`:192732-192742`) is emitted as
> `switch ("linux")`. Windows/macOS branches are live source text but statically unreachable here.

---

## 1. Which of the seven `filesystem.disabled` sites is new

| 220 site | What it is | 193 counterpart | Verdict |
|---|---|---|---|
| `:195430` | `getSandboxFsReadConfig` early-out → `{ denyOnly: [], allowWithinDeny: [] }` | `:211676 (193)` | carryover |
| `:195452` | `getSandboxFsWriteConfig` early-out → `{ allowOnly: ["/"], denyWithinAllow: [] }` | `:211698 (193)` | carryover |
| **`:195477`** | **`snapshotWindowsFileAccessSet` field** | **none** | **NEW** |
| `:195572` | `buildSandboxArgv` skips the whole FS-plan block | `:211782 (193)` | carryover |
| `:195845` | `getLinuxGlobPatternWarnings` returns `[]` | `:211991 (193)` | carryover |
| `:205758` | facade `getFsReadConfig` override | `:219869 (193)` | carryover |
| `:205764` | facade `getFsWriteConfig` override | `:219875 (193)` | carryover |

⚠ **Correction to [`_scope_v215_220.md`](../00_overview/_scope_v215_220.md) note on `.216` bullet 1**, which
says `:195845` "gates the Linux seccomp path". It does not. Reading it:

```javascript
function WWg() {                                                        // :195844-195853
  if (kH() !== "linux" || !Hl || Hl.filesystem.disabled) return [];
  let e = [], t = [...Hl.filesystem.allowWrite, ...Hl.filesystem.denyWrite];
  for (let r of t) { let n = xie(r); if (OW(n)) e.push(r); }
  return e;
}
```

`WWg` = `getLinuxGlobPatternWarnings` — it collects the glob patterns that Linux/WSL will silently drop
(bubblewrap binds paths, not patterns) so the UI can warn. Returning `[]` when FS isolation is off is
correct-and-uninteresting. The seccomp monitor is started elsewhere, at `:195281-195288`, and is **not**
gated on `filesystem.disabled` — which is precisely the bullet's promise that network/seccomp isolation
survives.

### 1.1 The one new site is a Windows *change-detection* snapshot, not enforcement

```javascript
// ============================================
// snapshotWindowsFileAccessSet - the file-access set whose change invalidates the session-wide ACL stamp
// Location: cli_inner_pretty.js:195475-195502
// ============================================

// ORIGINAL (for source lookup):
function wSu(e) {
  return {
    disabled: e.filesystem.disabled ?? !1,
    denyRead: [...e.filesystem.denyRead],
    denyWrite: [...e.filesystem.denyWrite],
    allowRead: [...(e.filesystem.allowRead ?? [])],
    allowWrite: [...e.filesystem.allowWrite],
    credFiles: Alo(e.credentials),
  };
}
function uKr(e, t) {
  if (e.length !== t.length) return !1;
  let r = new Set(e);
  return t.every((n) => r.has(n));
}
function xWg(e, t) {
  return (
    e.disabled === t.disabled &&
    uKr(e.denyRead, t.denyRead) && uKr(e.denyWrite, t.denyWrite) &&
    uKr(e.allowRead, t.allowRead) && uKr(e.allowWrite, t.allowWrite) &&
    uKr(e.credFiles, t.credFiles)
  );
}
function kWg(e) {
  return Slo !== void 0 && xWg(Slo, wSu(e));
}

// READABLE (for understanding):
function snapshotWindowsFileAccessSet(config) {
  return {
    disabled: config.filesystem.disabled ?? false,
    denyRead:  [...config.filesystem.denyRead],
    denyWrite: [...config.filesystem.denyWrite],
    allowRead: [...(config.filesystem.allowRead ?? [])],
    allowWrite:[...config.filesystem.allowWrite],
    credFiles: denyModeCredentialPaths(config.credentials),
  };
}
function sameStringSet(a, b) { if (a.length !== b.length) return false; let s = new Set(a); return b.every((x) => s.has(x)); }
function fileAccessSetsEqual(a, b) { return a.disabled === b.disabled && sameStringSet(a.denyRead, b.denyRead) && ... ; }
function windowsFileAccessSetUnchanged(config) {
  return appliedWindowsFileAccessSet !== undefined && fileAccessSetsEqual(appliedWindowsFileAccessSet, snapshotWindowsFileAccessSet(config));
}

// Mapping: wSu→snapshotWindowsFileAccessSet, uKr→sameStringSet, xWg→fileAccessSetsEqual,
//          kWg→windowsFileAccessSetUnchanged, Slo→appliedWindowsFileAccessSet, Alo→denyModeCredentialPaths (:195422)
```

`credFiles` is **220=2 / 193=0**, so the whole snapshot trio is new. It is written once, at `:195341`
(`Slo = wSu(e)`, right after the Windows ACL grant/deny is applied), and read once, at `:195715`:

```javascript
function NWg(e) {                                                       // :195714-195727 updateSandboxConfig
  if (kH() === "windows" && Hl && !kWg(e))
    _o("[Sandbox Windows] updateConfig: the resolved file-access set (filesystem.* ∪ credentials.files) " +
       "changed but the ACL stamp/grant is session-wide — call reset() then initialize() to apply. " +
       "The previously-applied set stays in effect.", { level: "warn" });
  ...
}
```

**What it does:** warns when a mid-session settings change would require re-ACLing files that were already
granted to the sandbox user.

**How it works:**
1. On Windows the sandbox runs the command as a **separate low-privilege user** (`sandboxUser`, `:205216`,
   the name constant `kco = "ClaudeCodeSandbox"` at `:204092`), and access is granted by *stamping ACLs on the
   real files* (`cSu`/`lSu` at `:195333`/`:195335`, driven by `srt-win acl grant`/`acl stamp` with
   `--holder-pid` + `--sandbox-user-sid`, `:194943-194999`). **This whole model is net-new in this window** —
   `sandboxUser` is 220=12 / **193=0**, `sandboxUserSid` 220=9 / **193=0**, and 2.1.193's Windows backend used
   a *group* instead (`srt-win group status`, `:211319 (193)`) with no ACL subcommands at all. There is no
   changelog bullet for it; see [windows_user_sandbox.md](windows_user_sandbox.md).
2. Those ACL edits are **session-wide and stateful** — unlike bubblewrap binds (Linux) or a seatbelt profile
   (macOS), which are re-derived per exec.
3. Therefore a settings-watcher-driven `updateConfig` (subscribed at `:205550-205554`, inside `initializeSandbox` `e0u` `:205534-205565`) cannot silently take
   effect on Windows. The snapshot detects that case and says so.
4. `sameStringSet` compares as an unordered set, so a mere reordering of `denyWrite` does not trigger the
   warning — the deny lists are built by concatenating settings sources, so ordering is unstable by nature.

**Why `disabled` belongs in the snapshot:** because `buildWindowsFileAclPlan` (`CWg`, `:195467-195474`)
returns *all four lists empty* when `disabled` is set. Flipping `disabled` therefore changes the resolved
file-access set as radically as any path edit — and in the direction that matters, since on Windows an empty
plan means **no grants at all**, not "no restrictions".

**Key insight:** this is the code that proves the schema's Windows caveat is not hand-waving. On Windows,
"skip the filesystem rules" would mean "grant the sandbox user nothing", i.e. total lockout rather than
freedom. That is why the platform veto in §2 exists.

---

## 2. The real `.216` delta: a resolver plus a platform veto

### 2.1 `resolveFilesystemDisabledSetting` (`xVg`, `:204669-204677`) — net-new

```javascript
// ============================================
// resolveFilesystemDisabledSetting - reads sandbox.filesystem.disabled with a managed-settings pin
// Location: cli_inner_pretty.js:204669-204677
// ============================================

// ORIGINAL (for source lookup):
function xVg() {
  let e = GQ(),
    t = e.map((n) => n.sandbox?.filesystem?.disabled).find((n) => n !== void 0);
  if (t !== void 0) return t;
  if (e.some((n) => n.sandbox?.filesystem !== void 0 || (n.sandbox?.credentials?.files?.length ?? 0) > 0)) return;
  return YLt()
    .map((n) => n?.sandbox?.filesystem?.disabled)
    .find((n) => n !== void 0);
}

// READABLE (for understanding):
function resolveFilesystemDisabledSetting() {
  let managedTiers = getManagedSettingsTiers();
  // 1. an explicit managed value is authoritative, either way
  let managed = managedTiers.map((s) => s.sandbox?.filesystem?.disabled).find((v) => v !== undefined);
  if (managed !== undefined) return managed;
  // 2. PIN: if managed settings configure sandbox.filesystem at all, or list any credentials.files entry,
  //    no lower scope may turn filesystem isolation off. Returning undefined = "unset" = isolation stays on.
  if (managedTiers.some((s) => s.sandbox?.filesystem !== undefined || (s.sandbox?.credentials?.files?.length ?? 0) > 0))
    return undefined;
  // 3. otherwise the first trusted scope that states a value wins (flagSettings, then active userSettings)
  return getTrustedSettingsSources().map((s) => s?.sandbox?.filesystem?.disabled).find((v) => v !== undefined);
}

// Mapping: xVg→resolveFilesystemDisabledSetting, GQ→getManagedSettingsTiers, YLt→getTrustedSettingsSources
```

Proof of net-newness: the pin predicate `credentials?.files?.length ?? 0) > 0` is **220=1 / 193=0**, and
`grep -c 'skip filesystem isolation'` is **220=1 / 193=0**.

**How it works — three tiers, in this order and for these reasons:**
1. **Managed value first, in *both* directions.** `.find(v => v !== undefined)` accepts `false` as well as
   `true`. An admin can therefore *mandate* isolation-off (egress-control-only deployments) as well as
   isolation-on. Compare `strictAllowlist`, which admins can only turn on.
2. **The pin.** If managed settings touched `sandbox.filesystem` *at all* — even just `denyWrite: [...]` — or
   listed a single `sandbox.credentials.files` entry, step 3 is skipped and the answer is `undefined`
   (= isolation on). The describe string at `:49737-49738` states the rationale verbatim: *"an admin who
   deployed filesystem restrictions must not have them switched off by a user-writable file."*
3. **Then the trusted scopes** (`flagSettings`, active `userSettings`), first-defined-wins.

**Why the pin is scoped the way it is.** Two exclusions are load-bearing:
- `sandbox.credentials.files` **does** pin, because those denies are *enforced by the filesystem layer* —
  turning it off drops them (see §3).
- `sandbox.credentials.envVars` **does not** pin, and the describe string says so explicitly at `:49738`:
  *"(sandbox.credentials.envVars does not pin it — env scrubbing is independent of the filesystem layer and
  survives this setting.)"* Env unset/mask happens in the argv/env builder (`:205531` adds every `deny`-mode
  var to `unsetEnv`), never through the FS layer. Over-pinning here would have made a common,
  filesystem-irrelevant admin config block a legitimate user choice.

**Failure mode.** All three tiers are `.find(v => v !== undefined)` over data that zod already coerced to
`boolean | undefined`; a malformed value never reaches here because the field is `v.boolean().optional()`
(`:49729-49731`) and the loader reports a schema error instead. If *no* scope states a value the result is
`undefined`, which §2.2 maps to `"strict"` — unset means isolation on, as the describe string's last sentence
promises.

**Key insight:** the pin makes the setting's *authority* depend on what an admin happened to configure, not
just on whether the admin configured this key. That is unusual (`allowManagedReadPathsOnly` and
`allowManagedDomainsOnly` are explicit opt-in clamps) and it is why the describe string is the longest in the
whole settings schema.

### 2.2 `getEffectiveFilesystemPolicy` (`ult`, `:204678-204686`) — the veto and the precedence

```javascript
// ============================================
// getEffectiveFilesystemPolicy - "strict" | "relaxed" for the sandbox filesystem layer
// Location: cli_inner_pretty.js:204678-204686   (193 counterpart :219220-219225)
// ============================================

// ORIGINAL (for source lookup):
function ult() {
  if (GP()) return "strict";
  if (Mt() === "windows") return "strict";
  let e = xVg();
  if (e !== void 0) return e ? "relaxed" : "strict";
  let t = clt().filesystemPolicy ?? "strict";
  if (t === "relaxedIfForced") return kVg() ? "strict" : "relaxed";
  return t;
}

// READABLE (for understanding):
function getEffectiveFilesystemPolicy() {
  if (isSubprocessEnvScrubMode()) return "strict";                 // 1. hosted/agent runner: never relax
  if (getPlatform() === "windows") return "strict";                // 2. platform veto (NEW in 220)
  let fromSettings = resolveFilesystemDisabledSetting();           // 3. settings (NEW in 220)
  if (fromSettings !== undefined) return fromSettings ? "relaxed" : "strict";
  let fromGate = getSandboxGrowthbookConfig().filesystemPolicy ?? "strict";   // 4. remote gate
  if (fromGate === "relaxedIfForced") return anySourceForcesSandboxEnabled() ? "strict" : "relaxed";
  return fromGate;
}

// Mapping: ult→getEffectiveFilesystemPolicy, GP→isSubprocessEnvScrubMode (:166682),
//          Mt→getPlatform (:25076), xVg→resolveFilesystemDisabledSetting,
//          clt→getSandboxGrowthbookConfig (:205709), kVg→anySourceForcesSandboxEnabled (:204687-204695)
```

The 193 version, for contrast (`:219220-219225 (193)`) — **no platform veto, no settings input at all**:

```javascript
function m3e() {
  if (NC()) return "strict";
  let e = Mke().filesystemPolicy ?? "strict";
  if (e === "relaxedIfForced") return yWd() ? "strict" : "relaxed";
  return e;
}
```

**How it works, and why this order:**
1. **`GP()` first** (`isSubprocessEnvScrubMode`, `:166682-166685`, driven by
   `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`). This is the hosted/cloud-runner mode. It is checked before *anything*
   settable so that no settings file in a cloned repo — nor even a managed one — can relax the filesystem
   layer inside Anthropic-hosted execution.
2. **Windows veto second**, before the settings read. Checking it *before* `xVg()` rather than after is
   deliberate: it means the setting is not merely ignored, it is never even resolved, so no telemetry or
   warning path can leak "someone tried". It also makes the schema sentence at `:49733-49734` literally true
   — *"Ignored on native Windows."*
3. **Settings third**, ahead of the remote gate. So a shipped GrowthBook default cannot override an explicit
   admin or user choice. `"relaxedIfForced"` (`:204684`) is the gate's escape hatch: relax by default, but
   snap back to strict the moment any settings source explicitly sets `sandbox.enabled: true` — i.e. "if you
   asked for a sandbox on purpose, you get the real one."
4. `kVg()` (`:204687-204695`) checks managed tiers + `flagSettings` + *trusted-only* user/project/local
   (`pg(...) ? Pr(...) : null`) for `sandbox.enabled === true`.

The single consumer that turns this into runtime state is `:205200`, inside `buildEffectiveSandboxConfig`:

```javascript
let V = {                                                            // :205195-205201
  denyRead: To(d), allowRead: To(p), allowWrite: To(a), denyWrite: To(c),
  ...(ult() === "relaxed" && { disabled: !0 }),
};
```

That spread is **carryover** (`:219492 (193)` is the same line with `m3e()`), which is exactly why the naive
`filesystem.disabled` grep under-reports the change: the *sink* did not move, the *source* did.

**Key insight:** the delta is a **new input edge** into an existing 2-state policy function, plus a platform
veto placed upstream of it. Nothing about how "relaxed" is enforced changed at all.

---

## 3. What `disabled` actually turns off — and the three things it does not

### 3.1 Turned off: the sandbox's own FS plan, on all three backends

| Backend | Function | Behaviour when `disabled` |
|---|---|---|
| read plan | `getSandboxFsReadConfig` (`wWg`, `:195429-195449`) | `{ denyOnly: [], allowWithinDeny: [] }` at `:195430` |
| write plan | `getSandboxFsWriteConfig` (`TWg`, `:195450-195466`) | `{ allowOnly: ["/"], denyWithinAllow: [] }` at `:195452` |
| Windows ACLs | `buildWindowsFileAclPlan` (`CWg`, `:195467-195474`) | all four lists empty at `:195469` |
| argv builder | `buildSandboxArgv` (`LSu`, `:195570-…`) | whole `if (!i)` FS block skipped, `:195572`/`:195576` |

Note `allowOnly: ["/"]` rather than "no restriction": on Linux the bwrap builder still runs and binds `/`
read-write (`:193887`/`:193961`), so the process is still in a mount+PID namespace with `--unshare-user
--cap-drop ALL` (`:194106`) — it just has no path restrictions. **"Filesystem isolation off" does not mean
"unsandboxed."**

### 3.2 Also dropped, as the describe string admits: `denyRead` **and** `credentials.files`

`getSandboxFsReadConfig` merges both before it early-outs:

```javascript
let e = ASu(Hl.filesystem.denyRead, Sos(Hl.credentials, Hl.network.allowedDomains)),   // :195431
```

`Sos` (`:195404-195421`) returns `denyReadPaths` = `deny`-mode credential file paths (`Alo`, `:195422-195425`)
∪ masked files that degraded to deny. Both live on the read-deny side, so `:195430`'s early return drops them
together. The describe string states this at `:49735`: *"Drops the read protection from filesystem.denyRead
and credentials.files for sandboxed commands, since both are enforced by the filesystem layer this turns
off."* Verified.

### 3.3 NOT dropped (i): env scrubbing and masking

`buildSandboxArgvAndEnv` (`WVg`, `:205517-205533`) computes `unsetEnv` unconditionally:

```javascript
let l = kE.getConfig()?.credentials;                                  // :205530-205531
for (let c of l?.envVars ?? []) if (c.mode === "deny") a.add(c.name);
```

No `disabled` check anywhere in that path. Matches the describe string's *"credentials.envVars deny/mask is
unaffected"* (`:49735`).

### 3.4 NOT dropped (ii): the harness's own file tools

The facade overrides at `:205756-205767` are the reason:

```javascript
getFsReadConfig: () => {                                             // :205756-205761
  let e = kE.getConfig();
  if (e?.filesystem.disabled)
    return { denyOnly: e.filesystem.denyRead.map(xie), allowWithinDeny: (e.filesystem.allowRead ?? []).map(xie) };
  return kE.getFsReadConfig();
},
```

When `disabled` is set, the *runtime* returns empty lists (§3.1) but the facade substitutes the **configured**
lists back. Consumers of the facade are therefore unaffected by the setting:
- `isPathWritableUnderSandbox` (`cas`, `:214068-214078`) — the in-process Read/Edit/Write permission decision.
- the model-facing sandbox description `buildSandboxPromptSection` (`rMd`, `:437150-437220`), which prints
  `Filesystem: {read:{denyOnly:…}, write:{allowOnly:…}}` into the system prompt.
- the worktree deny-write merge at `:314242`.
- the `/sandbox` status UI at `:723744-723745`.

**Why keep telling the model about deny paths that are not enforced?** Because `filesystem.disabled` is aimed
at *"deployments whose goal is egress control rather than filesystem containment"* (`:49735`) — the operator
still wants the agent to *behave* as if `~/.ssh` is off-limits, and the in-process Read/Edit tools still
refuse it. Only a sandboxed subprocess escapes. This is the sharpest edge of the whole setting and the
changelog bullet does not hint at it.

### 3.5 NOT dropped (iii): `autoAllowBashIfSandboxed`

The describe string at `:49735` warns: *"Does not change Bash prompting: sandbox.autoAllowBashIfSandboxed is
independent and still defaults to true, so set it to false to keep prompting for sandboxed commands."*
`isAutoAllowBashIfSandboxedEnabled` (`PVg`, `:205327-205330`) reads
`us()?.sandbox?.autoAllowBashIfSandboxed ?? !0` with no
reference to `disabled`. So the naive combination `sandbox.enabled: true` + `filesystem.disabled: true` is
**strictly weaker than no sandbox at all for the prompting question**: commands still auto-allow because
they are "sandboxed", while the filesystem layer is off. Documenting that trap inside the schema string is
good practice; it is also a strong hint that someone hit it.

---

## 4. Path containment: the deny-path resolution pipeline

Deny paths are collected in `buildEffectiveSandboxConfig` (`znr`, `:204847-…`) from settings, permission
rules, worktrees and well-known `.claude/*` locations. Two collectors wrap every path:

```javascript
// ============================================
// resolveDenyPathThroughSymlink / resolveDenyPathKeepingBoth - deny-path collectors with symlink bookkeeping
// Location: cli_inner_pretty.js:204726-204773
// ============================================

// ORIGINAL (for source lookup):
function lk(e) {
  let t;
  try { t = _p.readlinkSync(e); } catch { return (llt.push(e), e); }
  let r;
  try { return ((r = _p.realpathSync(e)), XKr.push({ literal: e, resolved: r }), r); }
  catch {
    let n = Gs.resolve(Gs.dirname(e), t);
    for (let o = 0; o < 8; o++) { let i; try { i = _p.readlinkSync(n); } catch { break; } n = Gs.resolve(Gs.dirname(n), i); }
    return (XKr.push({ literal: e, resolved: n }), n);
  }
}
function IVg(e) { /* same, but: */ return [r, e]; }

// READABLE (for understanding):
function resolveDenyPathThroughSymlink(p) {
  let linkTarget;
  try { linkTarget = fs.readlinkSync(p); }
  catch { nonSymlinkDenyPaths.push(p); return p; }               // NOT a symlink today -> remember for reconcile
  try { let real = fs.realpathSync(p); symlinkedDenyPaths.push({ literal: p, resolved: real }); return real; }
  catch {                                                        // dangling link: hand-walk up to 8 hops
    let hop = path.resolve(path.dirname(p), linkTarget);
    for (let i = 0; i < 8; i++) { let next; try { next = fs.readlinkSync(hop); } catch { break; }
                                  hop = path.resolve(path.dirname(hop), next); }
    symlinkedDenyPaths.push({ literal: p, resolved: hop }); return hop;
  }
}
function resolveDenyPathKeepingBoth(p) { /* identical, but returns [resolved, literal] */ }

// Mapping: lk→resolveDenyPathThroughSymlink, IVg→resolveDenyPathKeepingBoth,
//          llt→nonSymlinkDenyPaths, XKr→symlinkedDenyPaths, _p→fs, Gs→path
```

Three bookkeeping arrays come out of this (all reset at `:204885` / `:205576-205578`, declared `:205711`):

| Array | Populated when | Consumed by | Purpose |
|---|---|---|---|
| `llt` (`nonSymlinkDenyPaths`) | `readlink` fails → not a symlink **now** | `DVg` (`:205249-205281`) | **late** symlink reconciliation (`.210`) |
| `XKr` (`symlinkedDenyPaths`) | path *is* a symlink; only its target was denied | `LVg` (`:205231-205248`) | post-command scrub if the link was **replaced** |
| `Vnr` | `lstat` threw during collection (path absent) | `RVg` (`:205223-205230`) | post-command scrub of **planted** bare-repo files |

`lk` returns only the resolved target; `IVg` returns `[resolved, literal]`. The choice is made per call site at
`:204879-204881` (`u = (K, Y) => { if (Y) c.push(lk(K)); else c.push(...IVg(K)); }`) — some deny paths must
have *both* spellings denied (so the link node itself cannot be rewritten), others only the target.

### 4.1 `.210` — late `.claude/*` symlink reconciliation (`DVg`, `:205249-205281`)

```javascript
// ============================================
// reconcileLateSymlinkedDenyPaths - re-resolves deny paths that became symlinks after config build
// Location: cli_inner_pretty.js:205249-205281
// ============================================

// ORIGINAL (for source lookup):
function DVg() {
  let e = kE.getConfig();
  if (!e) return;
  let t = new Map();
  for (let r of llt) {
    if (t.has(r)) continue;
    let n;
    try { n = _p.readlinkSync(r); } catch { continue; }
    let o;
    try { o = _p.realpathSync(r); }
    catch {
      o = Gs.resolve(Gs.dirname(r), n);
      for (let i = 0; i < 8; i++) { let s; try { s = _p.readlinkSync(o); } catch { break; } o = Gs.resolve(Gs.dirname(o), s); }
    }
    t.set(r, o);
  }
  if (t.size === 0) return;
  for (let r = llt.length - 1; r >= 0; r--) if (t.has(llt[r])) llt.splice(r, 1);
  kE.updateConfig({ ...e, filesystem: { ...e.filesystem, denyWrite: To([...t.values(), ...e.filesystem.denyWrite]) } });
}

// READABLE (for understanding):
function reconcileLateSymlinkedDenyPaths() {
  let config = sandboxRuntime.getConfig();
  if (!config) return;
  let newlyLinked = new Map();                                   // literal -> resolved target
  for (let p of nonSymlinkDenyPaths) {
    if (newlyLinked.has(p)) continue;
    let target; try { target = fs.readlinkSync(p); } catch { continue; }   // still not a symlink -> skip
    let resolved;
    try { resolved = fs.realpathSync(p); }
    catch { resolved = path.resolve(path.dirname(p), target);              // dangling: hand-walk 8 hops
            for (let i = 0; i < 8; i++) { let n; try { n = fs.readlinkSync(resolved); } catch { break; }
                                          resolved = path.resolve(path.dirname(resolved), n); } }
    newlyLinked.set(p, resolved);
  }
  if (newlyLinked.size === 0) return;                            // fast path: nothing changed
  for (let i = nonSymlinkDenyPaths.length - 1; i >= 0; i--)      // reverse splice: stable indices
    if (newlyLinked.has(nonSymlinkDenyPaths[i])) nonSymlinkDenyPaths.splice(i, 1);
  sandboxRuntime.updateConfig({ ...config,
    filesystem: { ...config.filesystem, denyWrite: dedupe([...newlyLinked.values(), ...config.filesystem.denyWrite]) } });
}

// Mapping: DVg→reconcileLateSymlinkedDenyPaths, kE→sandboxRuntime, llt→nonSymlinkDenyPaths, To→dedupe
```

**When it runs:** from `ensureSandboxInitialized` (`QTu`, `:205471-205489`), line `:205487`
`(mss(), DVg())` — i.e. **before every sandboxed command**, not once at startup.

**How it works:**
1. Walk `llt`, the paths that were *plain files/dirs/absent* when the config was built.
2. `readlinkSync` succeeding now means the path **became a symlink since then** — the attack the bullet
   describes: the model (or a build script) plants `.claude/settings.local.json → /etc/somewhere` after the
   sandbox profile was computed, so the deny entry points at a node that now redirects.
3. Resolve it, with the same dangling-link 8-hop fallback as `lk`.
4. Remove the reconciled literals from `llt` (reverse iteration so `splice` does not shift unvisited
   indices) — one reconcile per path per session; if it is *re-*pointed later, `LVg`'s replacement scrub
   (§4.3) is the second line of defence.
5. `updateConfig` with the resolved targets **prepended** to `denyWrite`, deduped.

**Why prepend rather than replace:** the original literal stays denied (it was already in `denyWrite`), so
after reconciliation *both* the link node and its target are denied. Replacing would create a window where
deleting the link re-opens the literal path.

**Why 8 hops here and 40 in the bwrap resolver (§4.2):** these are different jobs. `lk`/`DVg` only need to
follow a *dangling* chain far enough to name a target for a deny entry — a short bound keeps a hostile
symlink farm from turning config build into a syscall storm, and the failure mode is benign (you deny the
8th-hop name, and the target is unreachable anyway since it does not exist). The bwrap builder must agree
with the *kernel's* resolution or it will bind the wrong node, so it uses the kernel's own limit.

**Evidence it is new:** the sibling log `[Sandbox] scrubbed replaced symlinked-deny path:` (`:205245`) is
**220=1 / 193=1** (`:219535 (193)`) — the *replacement* scrub pre-existed. `[Sandbox Linux] Resolved
symlinked deny path` (`:193923`) is **220=1 / 193=0**.

### 4.2 `.210`'s Linux half: a 40-hop partial resolver with a fail-closed branch

The bwrap argv builder `oWg` (`:193881-193961`) rewrote its deny loop. Two of its log literals are
**220=1 / 193=0** (`Resolved symlinked deny path`, `Deny path could not be resolved through symlinks, failing
closed`), and eight neighbouring literals in the same function are 1/1 — a textbook "mature mechanism plus one
new step".

**2.1.193 deny loop** (`:210574-210583 (193)`) deduped on the *literal* and never resolved symlinks:

```javascript
for (let b of h) {
  let _ = rF(b);
  if (y.has(_)) continue;
  if ((y.add(_), _.startsWith("/dev/"))) continue;
  let S = Ajd(_, a);
  if (S) { (l.push("--ro-bind", "/dev/null", S), Bo(`… Mounted /dev/null at symlink ${S} …`)); continue; }
  ...
}
```

**2.1.220** (`:193913-193932`):

```javascript
for (let C of b) {
  let I = ZU(C);
  if (I.startsWith("/dev/")) continue;
  let R = Q5g(I);                                                        // NEW: resolve through symlinks
  if (R === null) {                                                      // NEW: fail closed
    let P = Hbu(I, c);
    if (P && !T.has(P)) (T.add(P), u.push("--ro-bind", "/dev/null", P), d.set(P, I));
    _o(`[Sandbox Linux] Deny path could not be resolved through symlinks, failing closed: ${I}`);
    continue;
  }
  if (R !== I) _o(`[Sandbox Linux] Resolved symlinked deny path: ${I} -> ${R}`);   // NEW
  if (R.startsWith("/dev/")) continue;                                   // NEW: re-check after resolution
  if (T.has(R)) continue;                                                // dedupe on the RESOLVED path
  T.add(R);
  let H = Hbu(R, c);
  if (H) { if (!T.has(H)) (T.add(H), u.push("--ro-bind", "/dev/null", H), d.set(H, I));
           _o(`… Mounted /dev/null at symlink ${H} to prevent symlink replacement attack`); continue; }
  ...
}
```

Four semantic changes: resolution, a fail-closed branch, a **second** `/dev/` check on the resolved path
(resolution can land in `/dev`, where a `--ro-bind` would be wrong), and dedupe keyed on the resolved path so
two spellings of one file produce one bind.

```javascript
// ============================================
// resolveDenyPathThroughSymlinks - bounded partial realpath; null means "give up, fail closed"
// Location: cli_inner_pretty.js:193612-193638 (bound J5g = 40 at :194136)
// ============================================

// ORIGINAL (for source lookup):
function Q5g(e) {
  let t = e;
  for (let r = 0; r < J5g; r++) {
    try { return f_.realpathSync(t); } catch {}
    let n = t, o = [], i = null;
    while (i === null) {
      let l = OT.default.dirname(n);
      if (l === n) return null;
      (o.unshift(OT.default.basename(n)), (n = l));
      try { i = f_.realpathSync(n); } catch {}
    }
    let s = OT.default.join(i, o[0]), a = null;
    try { a = f_.readlinkSync(s); } catch {}
    if (a === null) return OT.default.join(i, ...o);
    t = OT.default.join(OT.default.resolve(OT.default.dirname(s), a), ...o.slice(1));
  }
  return null;
}

// READABLE (for understanding):
function resolveDenyPathThroughSymlinks(p) {
  let candidate = p;
  for (let hop = 0; hop < MAX_SYMLINK_HOPS /* 40 */; hop++) {
    try { return fs.realpathSync(candidate); } catch {}        // whole path exists: done
    // walk up to the deepest ANCESTOR that exists, collecting the missing tail
    let cursor = candidate, missingTail = [], existingAncestor = null;
    while (existingAncestor === null) {
      let parent = path.dirname(cursor);
      if (parent === cursor) return null;                      // reached "/" with nothing resolvable
      missingTail.unshift(path.basename(cursor));
      cursor = parent;
      try { existingAncestor = fs.realpathSync(cursor); } catch {}
    }
    let firstMissing = path.join(existingAncestor, missingTail[0]), link = null;
    try { link = fs.readlinkSync(firstMissing); } catch {}
    if (link === null) return path.join(existingAncestor, ...missingTail);   // genuinely absent: canonical prefix + tail
    candidate = path.join(path.resolve(path.dirname(firstMissing), link), ...missingTail.slice(1));  // expand and retry
  }
  return null;                                                 // hop budget exhausted -> caller fails closed
}

// Mapping: Q5g→resolveDenyPathThroughSymlinks, J5g→MAX_SYMLINK_HOPS, f_→fs, OT.default→path
```

**Why 40.** Linux's `MAXSYMLINKS` is **40**; the kernel returns `ELOOP` on the 41st hop. Matching it exactly
gives an equivalence the sandbox depends on: *any path the kernel would resolve, this resolves identically;
any path the kernel would refuse, this returns `null`* — and `null` means fail closed. A smaller bound would
create paths the kernel follows but the sandbox does not plan for (a hole); a larger bound would waste
syscalls on chains the kernel will reject anyway.

**Why a *partial* resolver instead of `realpathSync`.** Deny paths routinely do not exist yet — you deny
`~/.aws/credentials` on a machine that has no `~/.aws`. `realpathSync` throws for those, which is why 193
simply skipped resolution. The two-phase walk (deepest existing ancestor, then the missing tail) yields a
*canonical prefix + literal tail*, which is exactly what the "block creation of a not-yet-existing deny path"
machinery downstream (`:193933-193956`) needs.

**Failure mode, and why it is safe.** `null` from an exhausted budget or from hitting `/` sends control to
`:193917-193921`, which mounts `/dev/null` over the nearest **symlink ancestor inside an allowed write root**
(`Hbu`, `:193595-193611`) if one exists, logs, and continues. So an unresolvable deny path degrades to
"neutralise the closest thing we can name", never to "silently allow".

**Key insight:** the pairing of a kernel-matched hop budget with an explicit fail-closed branch is what turns
a best-effort deny list into a sound one. `Hbu`'s job — *deny the first symlink ancestor that lies inside an
allowed write root* — is the anti-replacement primitive: even if the attacker later re-points the link, the
node itself is `/dev/null`.

### 4.3 Post-command scrubs (`:205787-205789`)

`cleanupAfterCommand` runs `kE.cleanupAfterCommand(), RVg(), LVg()`:

- `RVg` (`:205223-205230`) deletes anything in `Vnr` — deny paths that were **absent** at config time and may
  have been *planted* since. The recursion guard `recursive: t !== "HEAD" && t !== ".git"` (`:205227`) refuses
  to recursively delete a node literally named `HEAD` or `.git`, which is the shape of a planted bare repo
  (the log says `scrubbed planted bare-repo file`). Carryover (1/1).
- `LVg` (`:205231-205248`) walks `XKr` and deletes any entry that is **no longer the symlink we resolved**:
  either not a symlink anymore, or a symlink whose `realpath` differs from the recorded target
  (`:205240-205243`). `ENOENT` is skipped (`:205237`). Carryover (1/1).

Together with `DVg` these are three complementary handles on the same class of TOCTOU: *became* a symlink
(`DVg`, reconcile), *changed* symlink (`LVg`, delete), *appeared at all* (`RVg`, delete).

### 4.4 The staging-dir invariant (`mss`, `:204800-204846`)

`mss` runs alongside `DVg` before every sandboxed command. For each of the well-known atomic-write staging
dirs (`GTu`, `:204777-204783` — `.claude/<Uye>` under cwd, original cwd, repo root, config dir, and the
`localSettings` directory) it:

1. Refuses to touch a path whose **parent** is itself a symlink — `Lco` (`:204787-204799`) opens the parent
   with `O_DIRECTORY | O_NOFOLLOW` and treats `ELOOP`/`ENOTDIR` as "skip".
2. If the node exists but is not a directory, unlinks and recreates it with `mode: 448` (`0o700`,
   `lss`, `:204784-204786`).
3. Re-opens with `O_NOFOLLOW` and records `(dev, ino)` via `s3l` (`:204830`) so later writes can verify they
   are hitting the same inode.
4. Once per process, appends `.claude/<Uye>/` to the global gitignore (`:204840-204845`).

That `O_NOFOLLOW`-then-record-identity pattern is the same defence as §4.2, applied to a directory the
harness writes rather than to a path it denies.

---

## 5. Worktree, junction and UNC escapes (`.205`, `.210`, `.214`, `.216`)

`tengu_agent_worktree_cwd_escape_blocked` is **220=4 / 193=0**, fired from four distinct guards inside the
shell-exec entry point, all under `if (p)` where `p` = `agentWorktree`:

| Reason | Line | Trigger |
|---|---|---|
| `context_lost` | `:314164` | `agentWorktree` set but the cwd-override `AsyncLocalStorage` store is gone (`!Urt()`) — the command would run in the parent session's directory |
| `worktree_gone` | `:314192` | cwd no longer exists **and** the only surviving recovery target is `gn()` (the shared checkout, index 0 of `[repoRoot, homedir, tmpdir]`) |
| `shared_checkout` | `:314210` | `ied(cwd, worktree)` says the resolved cwd is inside the protected checkout |
| `command_redirect` | `:314220` | the parsed command redirects git out of the worktree (`fed`) |

Each returns a **model-facing refusal string**, not a silent block, and each tells the model whether to retry:
`context_lost` says *"Retry the command"*; `worktree_gone` says *"Report this instead of retrying."* That
distinction is the interesting design choice — a transient loss of the cwd store is retryable, a removed
worktree is not, and telling the model which is which prevents a retry loop.

### 5.1 The path-shape refusals (`ied`, `:312384-312396`)

```javascript
function ied(e, t) {
  {
    let r = sed(e, t);
    if (r.escaped) {
      if (fBe(r.dir))
        return `This command was blocked because its working directory is spelled in a form that cannot be safely resolved (for example through a symlink storing a raw dot segment, a network-share or device-namespace shape, or an unreadable ancestor directory). If the directory is inside the worktree ${t}, re-run the command from its direct symlink-free path.`;
      if (r.dir.skipped && !r.roots.some((n) => n.skipped || fBe(n)))
        return `This command was blocked because its working directory is network-shaped (a UNC share or /net automount spelling) while the protected checkout is local. If the directory is genuinely inside the worktree ${t}, re-run the command from its local, plainly-spelled path.`;
      return `This agent is isolated in the worktree ${t}, but this command's working directory resolved to the shared checkout (${e}). …`;
    }
  }
  return null;
}
```

`network-shaped` is **220=3 / 193=0** and `device-namespace` **220=4 / 193=0**, so these two refusals are new;
`fBe` (`:307773`) is `canonical === null && !skipped` — *we could not canonicalise and we did not deliberately
skip*, i.e. unresolvable rather than out-of-scope. The three-way split matters: **unresolvable → refuse**,
**network-shaped while the protected root is local → refuse** (you cannot compare a UNC path to a local one
soundly), **resolved and inside the shared checkout → refuse with the concrete path**.

The path-shape predicates behind it (`:312556-312569`):

```javascript
function aed(e) {                                          // /proc/self, /proc/<pid>, /dev/fd, /dev/std*
  let t = e.replace(/[\\/]\.(?=[\\/]|$)/g, "");
  return ((t = t.replace(/[\\/]{2,}/g, "/")), Pky.test(t) || Mky.test(t));
}
function led(e) {                                          // macOS firmlinks, cygwin, parent-relative, UNC, "~"
  if (/^[\\/]System[\\/]Volumes[\\/]/i.test(e)) return !0;
  if (/^[\\/]Volumes[\\/]/i.test(e)) return !0;
  if (/(^|[\\/])proc[\\/]cygdrive([\\/]|$)/i.test(e)) return !0;
  if (/^[\\/]\.\.[\\/]/.test(e)) return !0;
  if (/^[\\/]{2}/.test(e)) return !0;                      // //server/share
  if (e.includes("~")) return !0;
  return !1;
}
```

`aed` normalises away `/./` and collapsed slashes **before** testing, so `/proc/./self/cwd` and `/proc//self`
are caught — the classic evasion. `Pky`/`Mky` (`:312766-312767`) are the `/proc/(self|thread-self|\d+)/` and
`/dev/(fd|stdin|stdout|stderr)/` shapes, i.e. the two families that let a path alias an arbitrary open
descriptor.

### 5.2 The git-redirect scrub set (`:312756-312777`)

```javascript
aTs = new Set(["GIT_DIR","GIT_WORK_TREE","GIT_COMMON_DIR","GIT_OBJECT_DIRECTORY","GIT_INDEX_FILE","GIT_SHALLOW_FILE"]);
Lky = new Set(["--namespace","--attr-source","--shallow-file"]);
Dky = ["--git-dir","--work-tree"];
```

plus `Uky` (`:312569-312572`) which additionally treats any `GIT_CONFIG*`, `HOME`, `CDPATH` and
`XDG_CONFIG_HOME` as redirect-capable, and `Yky` (`:312738-312740`) which flags the `core.worktree`,
`core.bare`, `include.*` and `includeif.*` config keys. That is a complete-looking enumeration of *"ways to
tell git to operate on a different tree"*, which is exactly what a worktree-isolated subagent must not be able
to do. `GIT_WORK_TREE` is **220=2 / 193=0**.

> Deep coverage of the worktree isolation state machine belongs to
> [`53_subagent_limits/`](../53_subagent_limits/); this section documents it only as the *path-containment*
> layer of the sandbox story. `.205`'s Windows NTFS-junction bullet (`junction` 220=16 / 193=14, `reparse`
> 220=9 / 193=4) is worktree-removal code, not sandbox code — see `:314048`
> (`shell cwd read-back resolves through a network symlink/junction; ignoring`) and `:428286`
> (`new Set(["symboliclink","junction","hardlink"])`) for the two anchors, and treat the bullet as owned by
> the worktree/tools modules.

---

## 6. Two exec-budget mechanisms worth documenting (`.205`, `.214`)

### 6.1 The Windows sandbox argv budget (`uSu`, `:195025-195050`)

```javascript
// ============================================
// buildWindowsSandboxArgv - assembles the srt-win exec argv and enforces a CreateProcessW budget
// Location: cli_inner_pretty.js:195025-195050 (budget check :195043-195047)
// ============================================

// ORIGINAL (for source lookup):
let i = [t, ...r, "exec"];
if (e.quiet !== !1) i.push("--quiet");
for (let u of e.denyRead ?? []) i.push("--deny-read", u);
for (let u of e.denyWrite ?? []) i.push("--deny-write", u);
let s = { PATH: process.env.PATH, PATHEXT: process.env.PATHEXT, ...(e.setEnvVars ?? {}), ...n, ...o };
for (let [u, d] of Object.entries(s)) if (d !== void 0) i.push("--env", `${u}=${d}`);
i.push("--");
let a = e.binShell ?? fos(void 0);
i.push(a.exe, ...a.args, e.command);
let l = i.reduce((u, d) => u + d.length + 3, 0);
if (l > 30000)
  throw Error(
    `Windows sandbox argv is ~${l} chars (CreateProcessW limit is 32 767). Shorten the command, or move broad globs to session-level filesystem.denyRead.`,
  );

// READABLE (for understanding):
let argv = [srtWinExe, ...prependArgs, "exec"];
if (opts.quiet !== false) argv.push("--quiet");
for (let p of opts.denyRead ?? []) argv.push("--deny-read", p);       // one flag PAIR per deny path
for (let p of opts.denyWrite ?? []) argv.push("--deny-write", p);
let env = { PATH: process.env.PATH, PATHEXT: process.env.PATHEXT, ...(opts.setEnvVars ?? {}), ...proxyEnv, ...gitConfigEnv };
for (let [k, v] of Object.entries(env)) if (v !== undefined) argv.push("--env", `${k}=${v}`);
argv.push("--", shell.exe, ...shell.args, opts.command);
let estimatedChars = argv.reduce((sum, a) => sum + a.length + 3, 0);  // +3 = separator space + two quotes
if (estimatedChars > 30000) throw Error(`Windows sandbox argv is ~${estimatedChars} chars (CreateProcessW limit is 32 767). …`);

// Mapping: uSu→buildWindowsSandboxArgv, i→argv, l→estimatedChars, e→opts, n→proxyEnv, o→gitConfigEnv
```

**Why `+ 3` per element.** Windows does not take an argv vector; `CreateProcessW` takes a single command-line
string, so every element costs its own length plus one separator space plus up to two quote characters when it
contains spaces. `+3` is the pessimistic per-element overhead.

**Why 30,000 against a 32,767 limit.** The `lpCommandLine` cap is 32,767 **wide characters**. The 2,767-char
(8.4%) headroom absorbs quote *escaping* (embedded `"` become `\"`), the `srt-win` prepend args, and any
env-var expansion done by the helper — none of which the `length + 3` estimate models exactly. Throwing at
30,000 turns an opaque OS-level failure into a diagnosable one.

**Why the deny list is what blows the budget.** Each deny path costs `--deny-read` (11) + the path + 6 of
overhead ≈ 60-80 chars, and the list grows with every registered git worktree (§6.2). Hence the remedy in the
message: *"move broad globs to session-level filesystem.denyRead"* — one glob instead of N expanded paths.

The user-facing translation is `jVg` (`:205490-205499`), called from `WVg` (`:205523`):

```javascript
function jVg(e) {
  if (e instanceof Error && /Windows sandbox argv is|CreateProcessW limit/i.test(e.message))
    return (
      pe("sandbox_exec", "windows_argv_too_long"),
      new pss(
        "Command is too long to run in the Windows sandbox: the assembled command line is near the OS limit, and the budget also covers the sandbox arguments, so trimming to just under the limit will not help. On PowerShell the script is base64-encoded first (~2.7x), leaving roughly 10,000 characters of script. Write the script to a file and run that file instead, or split the command up.",
      )
    );
  return e;
}
```

`Windows sandbox argv is` / `CreateProcessW limit` are **220=2 / 193=0**; `windows_argv_too_long` is
**220=1 / 193=0**. The `~2.7x` factor is UTF-16LE→base64: 2 bytes per character × 4/3 ≈ 2.67, so
30,000 / 2.67 ≈ 11,200 minus the sandbox arguments ≈ *"roughly 10,000 characters of script"*, which checks out
arithmetically.

> ⚠ **This is the `10,000 characters` decoy documented in ground truth §6.4.** `.214`'s bullet about Bash
> permission checks *"misjudging very long commands — commands over 10,000 characters now always prompt"* is
> **not** this code. That bullet's real anchor is `AIe = 1e4` (`:512643`) and the one new guard at `:392119`.
> The literal `10,000 characters` at `:205495` is the Windows sandbox argv message and belongs here.
> A grep-only reading conflates them.

By contrast `ZTu` (`:205500-205507`), the Linux socat bridge-death translator, is **carryover**
(`bridge socket does not exist` 3/3, `sandbox_linux_bridge_dead` 1/1) — do not present it as new.

### 6.2 `E2BIG`: naming the worktree deny-path explosion (`Ned`, `:313211-313239`)

`E2BIG` is **220=3 / 193=1**.

```javascript
// ============================================
// buildE2BIGDiagnostic - explains an exec-argument-limit failure and blames worktree deny paths
// Location: cli_inner_pretty.js:313211-313239 (worktree heuristic :313208-313210, :313244-313245)
// ============================================

// ORIGINAL (for source lookup):
function Ned({ binary: e, argv: t, env: r, sandboxDenyPaths: n }) {
  let o = Buffer.byteLength(e) + 1, i = 0;
  for (let p of t) { let f = Buffer.byteLength(p) + 1; if (((o += f), f > i)) i = f; }
  let s = 0, a = 0, l, c = 0;
  for (let [p, f] of Object.entries(r)) {
    if (typeof f !== "string") continue;
    a++;
    let m = Buffer.byteLength(p) + Buffer.byteLength(f) + 2;
    if (((s += m), m > c)) ((c = m), (l = p));
  }
  let u = `Could not start ${e}: the command line plus environment exceed the OS exec argument limit (E2BIG). At spawn: command line ${pl(o)} across ${t.length + 1} args (largest single arg ${pl(i)}); environment ${pl(s)} across ${a} vars${l === void 0 ? "" : ` (largest: ${l} at ${pl(c)})`}.`;
  if (n.length === 0) return u;
  let d = pr(n, hHy);
  return (
    (u += ` The Bash sandbox profile adds ${n.length} filesystem deny paths to every command`),
    (u += d > 0
        ? `, ${d} of them for registered git worktrees, which grow this list without bound. From another terminal, remove worktrees you no longer need (git worktree remove <path>; git worktree prune for already-deleted checkouts), then restart Claude Code so the profile is rebuilt without them — or relax the Bash sandbox for this session with /sandbox.`
        : "."),
    u
  );
}
function hHy(e) { return e.includes(fHy) && mHy.some((t) => e.endsWith(t)); }   // "/worktrees/" + config.worktree|.lock|commondir

// READABLE (for understanding):
function buildE2BIGDiagnostic({ binary, argv, env, sandboxDenyPaths }) {
  let argvBytes = Buffer.byteLength(binary) + 1, largestArg = 0;
  for (let a of argv) { let n = Buffer.byteLength(a) + 1; argvBytes += n; if (n > largestArg) largestArg = n; }
  let envBytes = 0, envCount = 0, largestVarName, largestVarBytes = 0;
  for (let [k, v] of Object.entries(env)) {
    if (typeof v !== "string") continue;
    envCount++;
    let n = Buffer.byteLength(k) + Buffer.byteLength(v) + 2;              // "K=V" + NUL
    envBytes += n; if (n > largestVarBytes) { largestVarBytes = n; largestVarName = k; }
  }
  let msg = `Could not start ${binary}: … command line ${fmt(argvBytes)} across ${argv.length + 1} args …`;
  if (sandboxDenyPaths.length === 0) return msg;
  let worktreeDerived = countWhere(sandboxDenyPaths, isWorktreeMetadataPath);
  return msg + ` The Bash sandbox profile adds ${sandboxDenyPaths.length} filesystem deny paths to every command`
             + (worktreeDerived > 0 ? `, ${worktreeDerived} of them for registered git worktrees, …` : ".");
}

// Mapping: Ned→buildE2BIGDiagnostic, hHy→isWorktreeMetadataPath, fHy→"/worktrees/" (:313244),
//          mHy→["/config.worktree","/config.worktree.lock","/commondir"] (:313245), pl→formatBytes, pr→countWhere
```

**Why measure argv and env separately.** `E2BIG` is raised against the *sum*, but the two halves have
completely different remedies: a huge single arg means "the model pasted a file into the command line", a huge
env means "an inherited variable is enormous" (hence `largest: NAME at N bytes`), and a huge arg *count* means
"the sandbox profile is the problem". Reporting one number would leave the user guessing.

**Why the `/worktrees/` + suffix heuristic.** The sandbox denies each worktree's metadata files
(`config.worktree`, `config.worktree.lock`, `commondir`) so a sandboxed command cannot re-point a worktree.
Three deny entries per registered worktree, forever, because `git worktree remove` is not something Claude
Code observes. Counting them separately lets the message say the true root cause — *"which grow this list
without bound"* — and offer the two real fixes (prune worktrees, or `/sandbox` to relax for the session).

**Key insight:** this is a diagnostic whose entire value is *attribution*. The failing syscall knows nothing
about worktrees; the message reconstructs the causal chain from the deny list's own shape.

---

## 7. `.218` "Improved sandbox command restrictions for IDE interactions" — UNANCHORED

I could not anchor this bullet. Recorded honestly rather than attached to a plausible neighbour.

**Probes run (all `grep -c` in both bundles):** `ideSandbox` 0/0 · `IDE interactions` 0/0 · `excludedCommands`
**8/8** · `sandbox.excludedCommands` 0/0 · `mcp__ide__` 6/4 · `jetbrains` 38/**41** (went *down*) ·
`code --wait` 0/0 · `EDITOR` 19/17 · `allowAppleEvents` 8/**9** (down) · `allowMachLookup` 7/7 ·
`appleeventsd` 2/2 · `com.apple.trustd.agent` 2/2 · `enableWeakerNetworkIsolation` 7/**8** (down) ·
`osascript` 12/12 · `coresimulator` 1/1 · `Removes code-execution isolation` 1/1.

The macOS "IDE interaction" enablers (`allowAppleEvents`, `allowMachLookup`, `enableWeakerNetworkIsolation`)
are all carryover or *shrinking*, so the bullet is not about them.

The one structural candidate I found while probing this bullet — the stricter excluded-commands matcher `nDd`
(`:512802-512807`) and its Windows-only caller `ZLd` (`:430750-430759`) — turned out to belong to a
**different** changelog bullet: `.214`'s *"Fixed a permission-check bypass affecting commands run in Windows
PowerShell 5.1 sessions"*. That is now anchored and written up in
[windows_user_sandbox.md](windows_user_sandbox.md) §5, with the `windows_policy_refusal` telemetry
(220=2 / **193=0**) and the extended refusal message as proof. Removing it from consideration here leaves
`.218` with **no candidate at all**.

Verdict: **UNANCHORED**. Most likely a macOS seatbelt-profile or `srt-win` change whose only expression is in
data the bundle does not carry as a distinct literal, or a server-gated rollout of an existing knob.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (home for Sandbox)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-theme additions: [symbol_additions_v2_1_220_sandbox.md](../00_overview/symbol_additions_v2_1_220_sandbox.md)

Key functions in this document:

- `resolveFilesystemDisabledSetting` (`xVg`, `:204669-204677`) - net-new; managed-first, managed-pin, then trusted scopes.
- `getEffectiveFilesystemPolicy` (`ult`, `:204678-204686`) - `"strict" | "relaxed"`; new Windows veto + new settings edge vs `:219220-219225 (193)`.
- `anySourceForcesSandboxEnabled` (`kVg`, `:204687-204695`) - resolves the gate's `relaxedIfForced`.
- `snapshotWindowsFileAccessSet` (`wSu`, `:195475-195484`) - **the one new `filesystem.disabled` site**, `:195477`.
- `fileAccessSetsEqual` (`xWg`, `:195490-195499`) / `sameStringSet` (`uKr`, `:195485-195489`) / `windowsFileAccessSetUnchanged` (`kWg`, `:195500-195502`).
- `updateSandboxConfig` (`NWg`, `:195714-195727`) - emits the Windows ACL-stamp warning at `:195716-195721`.
- `buildWindowsFileAclPlan` (`CWg`, `:195467-195474`) - empty plan when `disabled`; why Windows must veto.
- `getSandboxFsReadConfig` (`wWg`, `:195429-195449`) / `getSandboxFsWriteConfig` (`TWg`, `:195450-195466`) - carryover early-outs.
- `getLinuxGlobPatternWarnings` (`WWg`, `:195844-195853`) - the site the scoping doc mislabelled as seccomp.
- `collectCredentialProtections` (`Sos`, `:195404-195421`) / `denyModeCredentialPaths` (`Alo`, `:195422-195425`) / `mergeDenyReadPaths` (`ASu`, `:195426-195428`).
- `isPathWritableUnderSandbox` (`cas`, `:214068-214078`) - in-process write gate; unaffected by `disabled`.
- `buildSandboxPromptSection` (`rMd`, `:437150-437220`) - model-facing sandbox description.
- `resolveDenyPathThroughSymlink` (`lk`, `:204726-204749`) / `resolveDenyPathKeepingBoth` (`IVg`, `:204750-204773`) - deny-path collectors; populate `llt` / `XKr`.
- `reconcileLateSymlinkedDenyPaths` (`DVg`, `:205249-205281`) - `.210`'s fix; runs per command from `:205487`.
- `scrubReplacedSymlinkedDenyPaths` (`LVg`, `:205231-205248`) / `scrubPlantedBareRepoFiles` (`RVg`, `:205223-205230`) - carryover post-command scrubs.
- `ensureAtomicWriteStagingDirs` (`mss`, `:204800-204846`) / `parentIsNotSymlink` (`Lco`, `:204787-204799`) / `createStagingDir` (`lss`, `:204784-204786`) / `stagingDirCandidates` (`GTu`, `:204777-204783`).
- `resolveDenyPathThroughSymlinks` (`Q5g`, `:193612-193638`) - net-new 40-hop partial resolver; `J5g = 40` at `:194136`.
- `firstSymlinkAncestorInAllowedRoots` (`Hbu`, `:193595-193611`) / `hasFileAncestor` (`Z5g`, `:193639-193654`) - carryover.
- `buildBwrapArgv` (`oWg`, `:193881-193961`) - Linux backend; new deny-loop steps at `:193916-193925`.
- `buildWindowsSandboxArgv` (`uSu`, `:195025-195050`) - argv budget `> 30000` at `:195044`.
- `translateWindowsArgvTooLong` (`jVg`, `:205490-205499`) - the `10,000 characters` decoy string at `:205495`.
- `translateLinuxBridgeDeath` (`ZTu`, `:205500-205507`) - carryover.
- `buildE2BIGDiagnostic` (`Ned`, `:313211-313239`) / `isWorktreeMetadataPath` (`hHy`, `:313208-313210`).
- `worktreeCwdEscapeRefusal` (`ied`, `:312384-312396`) / `classifyCwdVsWorktree` (`sed`, `:312400-312408`) / `isUnresolvablePath` (`fBe`, `:307773`).
- `isDeviceNamespacePath` (`aed`, `:312556-312559`) / `isUnsafePathShape` (`led`, `:312560-312568`) / `isGitRedirectEnvVar` (`Uky`, `:312569-312572`) / `isGitRedirectConfigKey` (`Yky`, `:312738-312740`).
- `ensureSandboxInitialized` (`QTu`, `:205471-205489`) / `wrapWithSandboxArgv` (`WVg`, `:205517-205533`) / `initializeSandbox` (`e0u`, `:205534-205565`).
- `areSandboxSettingsLockedByPolicy` (`JTu`, `:205437-205449`) - checks `flagSettings`/`policySettings` for `sandbox.enabled` / `autoAllowBashIfSandboxed` / `allowUnsandboxedCommands`; notably **does not** consider `filesystem.disabled` or `network.strictAllowlist`, which carry their own scope rules.
- `isSandboxEnabledInSettings` (`dlt`, `:205316`) / `isAutoAllowSupported` (`VTu`, `:205324`) / `isAutoAllowBashIfSandboxedEnabled` (`PVg`, `:205327`) / `areUnsandboxedCommandsAllowed` (`MVg`, `:205331`) / `areUnsandboxedCommandsForbiddenByPolicy` (`OVg`, `:205335`) / `isSandboxRequired` (`yss`, `:205338`) / `isSupportedPlatform` (`_ss`, `:205342`) / `isPlatformInEnabledList` (`ZKr`, `:205346`) / `isSandboxingEnabled` (`Bco`, `:205357`) / `passesCheapSandboxGates` (`KTu`, `:205363`) - policy predicates, all carryover.
- `isHostedAgentRunner` (`Bxe`, `:166698`) - paired with `GP()` to detect the scrubbed cloud-runner mode.
- `recordStagingDirIdentity` (`s3l`, `:51904-51912`) - stores `(dev, ino, fd)` per staging dir.
- `formatBytes` (`pl`, `:33132-33139`) / `countWhere` (`pr`, `:24548-24552`) - helpers used by the `E2BIG` diagnostic.
- `stripTrailingGlobstar` (`xie`, `:193011-193013`) / `containsGlobMetachar` (`OW`, `:192997-192999`) / `expandGlobToPaths` (`RLt`, `:193170`) / `normalizeSandboxPath` (`ZU`, `:193048`).
