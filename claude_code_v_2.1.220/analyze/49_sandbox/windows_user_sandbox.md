# The Windows sandbox was rebuilt around a provisioned user (UNDOCUMENTED) + the `.214` PowerShell bypass fix

> **No changelog bullet in `.195`–`.220` announces this.** Between 2.1.193 and 2.1.220 the Windows sandbox
> backend changed from a *group* model with no filesystem enforcement to a **provisioned low-privilege user
> with a SID, per-command ACL stamping, a kernel WFP egress fence, and a per-user certificate store**. It is
> the largest structural change in the sandbox subsystem in this window, larger than either of the two
> settings bullets, and it is the reason those two bullets read the way they do.
>
> One bullet *does* land here: `.214`'s *"Fixed a permission-check bypass affecting commands run in Windows
> PowerShell 5.1 sessions"* (§5). It is only comprehensible once you know the Windows sandbox became real.
>
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`). Bare `cli_inner_pretty.js:<line>` = a **220** line I read;
> baseline lines tagged **(193)**.
>
> ⚠ **Platform caveat, and it is a sharp one here.** This extract is the **Linux target build** —
> `kH()` (`:192732-192742`) is emitted as `switch ("linux")`, so *every* line quoted in this document is
> statically unreachable in this artefact. It is nonetheless live source text compiled into the bundle, and
> it is diffable against 2.1.193's live source text, which is what the claims below rest on. Nothing here was
> executed.

---

## TL;DR — the delta, in counts I ran in both bundles

| Anchor | 2.1.220 | 2.1.193 | What it means |
|---|---|---|---|
| `sandboxUser` | **12** | **0** | the sandbox now runs as a named Windows user |
| `sandboxUserSid` | **9** | **0** | …identified by SID, threaded through every ACL call |
| `ClaudeCodeSandbox` | **1** | **0** | the account name, `kco` at `:204092` |
| `srt-win install` | **9** | **0** | a provisioning step with a UAC prompt |
| `acl stamp` / `acl grant` / `acl revoke` | 2 / 2 / 2 | **0 / 0 / 0** | per-session filesystem enforcement |
| `holder-pid` | **4** | **0** | ACL edits are owned by a PID so they can be rolled back |
| `WFP egress fence` | **3** | **0** | kernel-level network fence, verified at startup |
| `trust-ca` | **4** | **0** | per-sandbox-user CA store for TLS termination |
| `user status` (srt-win subcommand) | **2** | **0** | replaces `group status` |
| `hidden_from_logon` / `in_builtin_users` / `real_user_sid` / `marker_version` / `cred_present` | 1 each | **0 each** | the provisioning-state fields |
| `sandbox_windows_install` (telemetry) | **8** | **0** | a `/sandbox install` flow with an outcome taxonomy |
| `/sandbox install` | **11** | **0** | the user-facing entry point |
| `srt-win` (total) | **33** | **11** | the backend roughly tripled |
| `group status` | **0** | **1** (`:211319 (193)`) | the old model, removed |

2.1.193 shipped `srt-win.exe` for **network** filtering only: `wfp status`, `group status`, and an `exec`
that passed a *group* (`:211328 (193)`, `let n = [N7r(), "exec", ...gqi(e.group)]`). There was no filesystem
enforcement on Windows at all — which is why 193's PowerShell guard simply said *"sandboxing is not available
on native Windows"* (`:450935 (193)`).

---

## 1. Why this is the missing context for both settings bullets

Read this table next to [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §2 and the
whole `.216` story stops being arbitrary:

| Backend | How a path restriction is expressed | Lifetime | Re-derived per exec? |
|---|---|---|---|
| Linux (bubblewrap) | `--ro-bind` / `--bind` argv, in a mount namespace | the child process | **yes** |
| macOS (seatbelt) | a generated `sandbox-exec` profile (`/usr/bin/sandbox-exec`, `:194553`) | the child process | **yes** |
| **Windows (srt-win)** | **ACL entries written onto the real files on disk**, keyed to the sandbox user's SID | **the session** | **no** |

Three consequences fall straight out of the third row, and each of them is visible in the code:

1. **`filesystem.disabled` must be vetoed on Windows.** On Linux, "skip the FS plan" means "bind `/` and
   impose no path rules". On Windows it would mean "grant the sandbox user nothing", because the user starts
   with *no* rights to the developer's files — `buildWindowsFileAclPlan` (`CWg`, `:195467-195474`) returns all
   four lists empty when `disabled` is set (`:195469`). Total lockout, not freedom. Hence the veto at
   `:204680` inside `getEffectiveFilesystemPolicy`, placed *before* the settings read.
2. **A mid-session settings change cannot take effect.** ACLs already written stay written. Hence the
   snapshot/compare trio `wSu`/`xWg`/`kWg` (`:195475-195502`) and the warning at `:195716-195721` — which is
   the **only new `filesystem.disabled` literal site** in the entire 220 bundle (`:195477`).
3. **Failures must roll back.** An ACL edit outlives the process that made it, so `--holder-pid` records the
   owner and `acl revoke` / `acl restore` undo it. The initialiser's catch block does exactly that
   (`:195342-195345`) before rethrowing.

**Key insight:** the `.216` bullet's Windows caveat is not a hedge, it is a direct statement about a
*stateful* enforcement mechanism that had just been built. A reader who diffs only the two settings bullets
sees an odd platform exception; a reader who diffs the backend sees the cause.

---

## 2. Provisioning: `srt-win install` and the status probe

### 2.1 `getWindowsSandboxUserStatus` (`aNe`, `:194881-194897`)

```javascript
// ============================================
// getWindowsSandboxUserStatus - reads `srt-win user status` into a typed provisioning report
// Location: cli_inner_pretty.js:194881-194897
// ============================================

// ORIGINAL (for source lookup):
function aNe(e = {}) {
  let t = oSu(["user", "status"], { srtWin: e.srtWin });
  return {
    provisioned: t.user.exists,
    ...(t.user.sid && { sid: t.user.sid }),
    groupExists: t.user.group_exists,
    ...(t.user.group_sid && { groupSid: t.user.group_sid }),
    inBuiltinUsers: t.user.in_builtin_users,
    inSandboxGroup: t.user.in_sandbox_group,
    hiddenFromLogon: t.user.hidden_from_logon,
    credPresent: t.cred_present,
    ...(typeof t.marker_version === "number" && { markerVersion: t.marker_version }),
    realUserSid: t.real_user_sid,
    ...(t.ca_cert_thumb && { caCertThumb: t.ca_cert_thumb }),
    ...(t.ca_cert_pem && { caCertPem: t.ca_cert_pem }),
  };
}

// READABLE (for understanding):
function getWindowsSandboxUserStatus(opts = {}) {
  let raw = runSrtWinJson(["user", "status"], { srtWin: opts.srtWin });
  return {
    provisioned:     raw.user.exists,            // the ClaudeCodeSandbox account exists
    sid:             raw.user.sid,               // its SID — the handle every ACL call needs
    groupExists:     raw.user.group_exists,      // the sandbox group (carried over from the 193 model)
    groupSid:        raw.user.group_sid,
    inBuiltinUsers:  raw.user.in_builtin_users,  // membership of BUILTIN\Users — grants ambient read
    inSandboxGroup:  raw.user.in_sandbox_group,
    hiddenFromLogon: raw.user.hidden_from_logon, // suppressed from the Windows logon screen
    credPresent:     raw.cred_present,           // the stored password is readable by THIS user
    markerVersion:   raw.marker_version,         // provisioning schema version, for upgrades
    realUserSid:     raw.real_user_sid,          // the developer's own SID
    caCertThumb:     raw.ca_cert_thumb,          // CA installed in the sandbox user's Root store
    caCertPem:       raw.ca_cert_pem,
  };
}

// Mapping: aNe→getWindowsSandboxUserStatus, oSu→runSrtWinJson, t→raw
```

Every one of `hidden_from_logon`, `in_builtin_users`, `real_user_sid`, `marker_version`, `cred_present` is
**220=1 / 193=0**.

**What the fields tell you about the threat model, read one at a time:**

- `credPresent` is separate from `provisioned` because the account can exist while its stored credential is
  unreadable — a different Windows user provisioned it, or DPAPI cannot decrypt it in this profile. The
  initialiser checks **both** (`:195293`) and the error prints both values so the failure is diagnosable:
  `Windows sandbox user is not provisioned (user=${i.provisioned}, cred=${i.credPresent})` (`:195297`).
- `realUserSid` is reported so the harness can tell *whose* files the ACL edits will touch, and so a
  provisioning done under a different account can be detected.
- `hiddenFromLogon` and `inBuiltinUsers` are the two properties that decide how much ambient authority the
  sandbox user starts with. `BUILTIN\Users` membership grants read on the machine's public surface (Program
  Files, most of `C:\Windows`) without any explicit grant — which is why the ACL plan only ever has to name
  the *developer's* files.
- `markerVersion` is the upgrade hook: a numeric provisioning-schema stamp, so a newer client can detect that
  an older `srt-win install` left an account it cannot use.

**Why a `status` probe instead of trying and catching.** Provisioning requires elevation, and elevation is a
UAC prompt. A cheap non-elevated `user status` lets the client decide *before* interrupting the user whether
a prompt is needed at all, and lets `/sandbox` render an accurate state. The two consumers are the
initialiser (`:195292`) and the `/sandbox` UI (`:724025`).

### 2.2 `installWindowsSandbox` (`glo`, `:194903-194930`) — an exit-code taxonomy, not a boolean

```javascript
// ============================================
// installWindowsSandbox - runs `srt-win install` (one UAC prompt) and classifies the outcome
// Location: cli_inner_pretty.js:194903-194930
// ============================================

// ORIGINAL (for source lookup):
function glo(e = {}) {
  let t = e.srtWin ?? F8e(),
    r = ["install"];
  if (e.sublayerGuid) r.push("--sublayer-guid", e.sublayerGuid);
  if (e.proxyPortRange) r.push("--proxy-port-range", `${e.proxyPortRange[0]}-${e.proxyPortRange[1]}`);
  if (e.sandboxUser) r.push("--sandbox-user", e.sandboxUser);
  if (e.force) r.push("--force");
  let n = bnr(r, { timeoutMs: 60000, srtWin: t });
  _o(`[Sandbox Windows] install exit=${n.status}: ${n.stderr || n.stdout}`);
  let o = n.stderr || n.stdout,
    i = () => ({ wfp: LLt({ sublayerGuid: e.sublayerGuid, srtWin: t }), user: aNe({ srtWin: t }) });
  switch (n.status) {
    case 0: return i();
    case 10: return { ...i(), cancelled: !0 };
    case 12: throw Error(`srt-win install: WFP filter install failed: ${o}`);
    case 14: throw Error(`srt-win install: sandbox user provisioning failed: ${o}`);
    case 13: throw Error(`srt-win install: filters already exist under this sublayer with a different port range or sandbox-user name. Pass {force: true} to replace, or pick a different sublayerGuid. Output: ${o}`);
    default: throw Error(`srt-win install failed (exit ${n.status}): ${o}`);
  }
}

// READABLE (for understanding):
function installWindowsSandbox(opts = {}) {
  let srtWin = opts.srtWin ?? resolveSrtWinPath(), argv = ["install"];
  if (opts.sublayerGuid)  argv.push("--sublayer-guid", opts.sublayerGuid);
  if (opts.proxyPortRange) argv.push("--proxy-port-range", `${opts.proxyPortRange[0]}-${opts.proxyPortRange[1]}`);
  if (opts.sandboxUser)   argv.push("--sandbox-user", opts.sandboxUser);   // "ClaudeCodeSandbox"
  if (opts.force)         argv.push("--force");
  let run = runSrtWin(argv, { timeoutMs: 60_000, srtWin });                // 60s: UAC + account creation
  logSandbox(`[Sandbox Windows] install exit=${run.status}: ${run.stderr || run.stdout}`);
  let readBackState = () => ({ wfp: getWindowsWfpStatus({ sublayerGuid: opts.sublayerGuid, srtWin }),
                               user: getWindowsSandboxUserStatus({ srtWin }) });
  switch (run.status) {
    case 0:  return readBackState();                                       // installed
    case 10: return { ...readBackState(), cancelled: true };               // UAC declined — NOT an error
    case 12: throw Error("WFP filter install failed");                     // network half failed
    case 14: throw Error("sandbox user provisioning failed");              // user half failed
    case 13: throw Error("conflicting filters under this sublayer — pass force, or change sublayerGuid");
    default: throw Error(`srt-win install failed (exit ${run.status})`);
  }
}

// Mapping: glo→installWindowsSandbox, F8e→resolveSrtWinPath, bnr→runSrtWin, LLt→getWindowsWfpStatus,
//          aNe→getWindowsSandboxUserStatus, _o→logSandbox
```

**What it does:** performs the one-time elevated setup — create the sandbox user, store its credential,
install the WFP filters under a sublayer GUID — and reports which half succeeded.

**How it works, and why each exit code is distinguished:**
1. **Success (0)** does not return the installer's own claim of success; it **re-reads** both halves of the
   state (`readBackState()`), so the caller's decision is based on observed state, not on an exit code.
2. **10 = UAC cancelled** is deliberately *not* an error, and it still re-reads state. The `/sandbox install`
   handler (`NPf`, `:724557-…`) uses that to distinguish two very different cancellations: if the user is
   already provisioned it reports `uac_cancelled_provisioned` and explains that only *verification* of the
   filters was lost (`:724561-724571`); otherwise it reports `uac_cancelled` and tells the user to re-run
   (`:724572-724579`). Two telemetry reasons for one exit code, because the recovery advice differs.
3. **12 vs 14** split the two halves — network filters vs user provisioning. They fail independently and
   have different remedies (Group Policy / WFP driver issues vs account-creation policy).
4. **13 = conflict** is the interesting one: filters already exist under *this* sublayer GUID with a
   *different* port range or sandbox-user name. That is the multi-installation case (two Claude Code
   installs, or a stale install). The error names both escape hatches — `force` to replace, or a different
   `sublayerGuid` to coexist.

**Why a sublayer GUID at all.** WFP filters live in a global kernel table; a sublayer is the namespace that
makes one product's filters removable without disturbing another's. Making it configurable
(`--sublayer-guid`) is what allows exit 13's "pick a different sublayerGuid" advice to be real.

**Key insight:** every branch here re-reads state or names a specific remedy. Compare the 2.1.193 Windows
path, which had nothing to install and therefore nothing to diagnose — it just declared the platform
unsupported. The cost of making Windows a real sandbox target is almost entirely this: a provisioning
lifecycle with failure modes that a developer, not a program, has to resolve.

---

## 3. Enforcement: ACL stamping keyed to a PID

Four operations, all with the same two arguments (`--holder-pid`, `--sandbox-user-sid`):

| Function | srt-win call | Direction | Input | Failure handling |
|---|---|---|---|---|
| `cSu` (`grantWindowsSandboxAcls`, `:194975-194985`) | `acl grant` | **allow** the sandbox user | `{read, write}` on stdin | throws on non-zero |
| `lSu` (`stampWindowsSandboxDenyAcls`, `:194943-194957`) | `acl stamp` | **deny** the sandbox user | `{denyRead, denyWrite}` on stdin | throws; **exit 2 = partial** (`:194954`) |
| `yos` (`revokeWindowsSandboxGrants`, `:194986-194999`) | `acl revoke --json` | undo grants | — | logs, returns `undefined` |
| `gos` (`restoreWindowsSandboxDenies`, `:194958-194974`) | `acl restore --json` | undo denies | — | logs, returns per-path outcomes |

**Why the paths go over stdin, not argv.** `:194945` and `:194977` both `JSON.stringify` the path lists into
`stdin`. That is the same `CreateProcessW` 32,767-wide-char budget that
[filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §6.1 documents for the *exec* path —
here it is avoided entirely rather than budgeted, because the ACL lists are the longest lists in the system
(they are the full deny set, which grows per registered git worktree). Note the asymmetry: the harness could
not do the same for `exec`, because there the deny paths must be flags on the sandboxed command line.

**Why `--holder-pid`.** ACL edits mutate the developer's real files. If Claude Code crashes, something must
be able to say "these edits belonged to PID N, undo them". The PID defaults to `process.pid`
(`:194944`, `:194959`, `:194976`, `:194987`) but is overridable, which is what lets a supervisor clean up
after a dead session.

**Why `revoke`/`restore` swallow errors while `grant`/`stamp` throw.** Apply-time failure must abort the
sandbox (an un-applied deny is a hole); cleanup-time failure must not mask the original error. The
initialiser's catch block is explicit about it (`:195342-195345`):

```javascript
} catch (s) {
  if (Xat) (yos({ sandboxUserSid: Xat, srtWin: o }), gos({ sandboxUserSid: Xat, srtWin: o }));
  throw ((Xat = void 0), (Hl = void 0), s);
}
```

Roll back both directions, clear the recorded SID *and* the runtime config `Hl`, then rethrow the original
exception. Clearing `Hl` matters because `Hl !== undefined` is what `AWg` (`:195379-195381`) reports as
"sandbox is initialised" — leaving it set after a failed ACL apply would make the rest of the system believe
restrictions were in force when they were not. **That is the fail-closed invariant of the whole Windows
backend**, and it is three tokens long.

`acl restore` returns `Array.isArray(r.json) ? r.json : [...(r.json.paths ?? []), ...(r.json.parents ?? [])]`
(`:194969`) — note `parents`: stamping a deny on a file can require touching its **parent directory's** ACL,
and the restore has to report both so the reset path (`:195784-195785`) can log each one.

### 3.1 A structural gap: Windows cannot deny a path that does not exist yet

`buildWindowsFileAclPlan` (`CWg`, `:195467-195474`) runs every list through `hos`
(`resolveExistingPathsForAcl`, `:194931-194942`):

```javascript
function hos(e) {                                        // :194931-194942
  let t = new Set();
  for (let r of e) {
    let n = ZU(r),
      o = ilo(n) ? RLt(n, { caseInsensitive: !0 }) : [n];        // expand globs
    for (let i of o) {
      if (!lKr.statSync(i, { throwIfNoEntry: !1 })) continue;    // <-- SKIP paths that do not exist
      t.add(i);
    }
  }
  return [...t];
}
```

An ACL can only be written onto an object that exists, so this is forced by the mechanism — but the
consequence is a real asymmetry with the other two backends:

| Deny path state | Linux (bwrap) | Windows (ACL) |
|---|---|---|
| exists | `--ro-bind /dev/null <path>` | deny ACE for the sandbox user |
| **does not exist yet** | resolved to *canonical prefix + literal tail* by `Q5g` (`:193612-193638`) and still planned for, so **creation is blocked** (`:193933-193956`) | **skipped entirely** — nothing to stamp |
| becomes a symlink after config build | reconciled per command by `DVg` (`:205249-205281`) | `DVg` runs, but `updateConfig` on Windows only *warns* (`:195716-195721`); the ACLs are session-wide |

So on Windows, `denyWrite: ["~/.aws/credentials"]` on a machine with no `~/.aws` yet is **not enforced**: a
sandboxed command can create the file. On Linux the same config is enforced, because the bwrap plan is
rebuilt per exec and the resolver deliberately handles non-existent paths (see
[filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §4.2, *"Why a partial resolver instead
of `realpathSync`"*).

I found no compensating check on the Windows path. Stated as an observation, not a proven exploit: the
mechanism is per-exec on Linux/macOS and per-session on Windows, and the two gaps above (late creation, late
settings change) are both instances of that one difference.

---

## 4. The two verification steps that have no Linux/macOS equivalent

### 4.1 The WFP egress-fence self-test (`sSu`, `:194832-194880`)

**What it does:** proves, at startup, that a process cannot reach the network without going through the
sandbox proxy — by trying it.

**How it works:**
1. Bind a loopback listener on an **ephemeral port chosen to be outside the WFP permit range**, retrying up
   to 5 times because the OS picks the port (`:194837-194846`). If five draws all land inside the permit
   range, throw rather than run a meaningless test (`:194847-194850`).
2. Ask `srt-win wfp verify --target 127.0.0.1:<port>` to attempt a **direct** outbound connection to it as
   the sandbox user (`:194853`).
3. Interpret the exit code: unparseable output → *"could not be verified"*; **3 → the connection succeeded,
   i.e. the fence is NOT active** (`:194866-194870`); any other non-zero → could not be verified
   (`:194871-194875`). All three throw; only exit 0 continues.
4. `finally { r?.close(); }` (`:194877-194879`) always releases the probe listener.

**Why probe instead of reading filter state.** `LLt` (`getWindowsWfpStatus`, `:194820-194831`) already reads
`wfp status` and can return `state: "cannot-read"` — a non-elevated process often *cannot* enumerate kernel
filters. The probe sidesteps the permission problem by testing the property that actually matters
(*can traffic escape?*) rather than the proxy for it (*are the filters listed?*). It also catches a class of
failure that status reading never could: filters that exist but do not match, e.g. after a Windows update
reorders sublayers.

**Why it runs once per process.** `if (!hSu) { … hSu = !0 }` (`:195300-195307`) — the fence is machine state,
not session state, and the probe costs a process spawn plus a socket. Re-verifying per command would be pure
overhead; re-verifying never would miss an uninstall between sessions. Once per process is the compromise,
and the failure path clears `Hl` before rethrowing (`:195303-195305`), same invariant as §3.

**Key insight:** this is the only place in the sandbox where the client *empirically verifies* its own
containment rather than asserting it from configuration. It exists on Windows and nowhere else because
Windows is the only backend where the enforcement lives in machine-global kernel state that a third party can
have changed since last time.

### 4.2 The per-sandbox-user CA store (`:195308-195325`)

TLS termination needs the sandboxed process to trust an ephemeral CA. On Linux and macOS the child inherits
the parent's view of the filesystem, so a trust bundle path is enough. On Windows the child runs as a
**different user with a different certificate store**, so the CA must be installed *into that user's Root
store* out of band.

The initialiser therefore compares thumbprints and fails hard, twice:

```javascript
if (e.network.tlsTerminate && t4) {                                        // :195308
  let s = aSu(i),                                                          // CA recorded in `user status`
    a = new vlo.X509Certificate(t4.certPem).fingerprint.replace(/:/g, "").toUpperCase();
  if (!s) throw ((Hl = void 0), Error(`tlsTerminate on Windows requires the sandbox to be installed with this CA (thumb=${a}): run \`srt-win user trust-ca ${t4.certPath}\` …`));   // :195311-195317
  if (s.thumb !== a) throw ((Hl = void 0), Error(`tlsTerminate on Windows: the sandbox's installed CA (thumb=${s.thumb}) doesn't match this session's CA (thumb=${a}). Run \`srt-win user trust-ca ${t4.certPath}\` to update it.`));  // :195318-195324
}
```

`trust-ca` is **220=4 / 193=0**. Note the message *"Per-exec installs into the sandbox user's Root store are
not possible"* (`:195315`) — an explicit statement that the obvious design (install the CA at command time)
was considered and rejected, because writing another user's certificate store requires elevation.

**Consequence for the credential-mask feature:** `mask` mode needs TLS termination, so on Windows it needs
this extra elevated step. A config that works on Linux is a *hard startup failure* on Windows — documented
from the credential side in [credentials_mask_promotion.md](credentials_mask_promotion.md) §3.1.

---

## 5. The one changelog bullet that lands here: `.214`'s PowerShell permission-check bypass

> `.214`: *"Fixed a permission-check bypass affecting commands run in Windows PowerShell 5.1 sessions"*
> (CHANGELOG line 146). **Verdict: NET_NEW mechanism, and it is a direct consequence of §1–§4.**

### 5.1 The 2.1.193 guard: a platform refusal

```javascript
// ORIGINAL (193, :450766-450773):
function Dml() {
  return (
    Wt() === "windows" &&
    ko.isSandboxEnabledInSettings() &&
    ko.isPlatformInEnabledList() &&
    !ko.areUnsandboxedCommandsAllowed()
  );
}
```

Message (`:450935 (193)`): *"Enterprise policy requires sandboxing, but **sandboxing is not available on
native Windows**. Shell command execution is blocked on this platform by policy."* — i.e. under a mandatory
sandbox policy, the PowerShell tool was **unconditionally refused** on Windows. Correct, because there was no
Windows filesystem sandbox to run it in.

### 5.2 The 2.1.220 guard: "would this command *actually* be sandboxed?"

```javascript
// ============================================
// shouldRefusePowerShellUnderMandatorySandbox - policy gate for the PowerShell tool on Windows
// Location: cli_inner_pretty.js:430750-430759
// ============================================

// ORIGINAL (for source lookup):
function ZLd(e, t) {
  return (
    Mt() === "windows" &&
    Oo.isSandboxEnabledInSettings() &&
    Oo.isPlatformInEnabledList() &&
    !Oo.areUnsandboxedCommandsAllowed() &&
    !e &&
    !nDd(t)
  );
}
function WRo(e) {
  return H4({ command: e.command, dangerouslyDisableSandbox: e.dangerouslyDisableSandbox, shellType: "powershell" });
}

// READABLE (for understanding):
function shouldRefusePowerShellUnderMandatorySandbox(willBeSandboxed, command) {
  return (
    getPlatform() === "windows" &&
    sandbox.isSandboxEnabledInSettings() &&
    sandbox.isPlatformInEnabledList() &&
    !sandbox.areUnsandboxedCommandsAllowed() &&   // policy: everything must be sandboxed
    !willBeSandboxed &&                           // …but this command would NOT be
    !matchesTrustedWholeCommandExclusion(command) // …and it is not a clean, whole-command exclusion
  );
}
function powerShellCommandWillBeSandboxed(input) {
  return shouldRunUnderSandbox({ command: input.command,
                                 dangerouslyDisableSandbox: input.dangerouslyDisableSandbox,
                                 shellType: "powershell" });
}

// Mapping: ZLd→shouldRefusePowerShellUnderMandatorySandbox, WRo→powerShellCommandWillBeSandboxed,
//          H4→shouldRunUnderSandbox (:512818-512826), nDd→matchesTrustedWholeCommandExclusion (:512802-512807),
//          Mt→getPlatform, Oo→SandboxManager, e→willBeSandboxed, t→command
```

`shellType: "powershell"` is **220=2 / 193=0** — the PowerShell tool did not participate in the sandbox
decision at all before this window.

### 5.3 The bypass, traced

`shouldRunUnderSandbox` (`H4`, `:512818-512826`) decides *whether* a command is sandboxed, and its last
substantive line is:

```javascript
if (I1_(e.command)) return !1;      // :512824 — matches an excludedCommands pattern -> do NOT sandbox
```

`I1_` (`:512771-512801`) is the **permissive** matcher, and two of its properties combine into a hole:

1. It **splits the command into statements** (`n = $E(e)` at `:512776`, falling back to `[e]` on a parse
   error) and returns `true` if *any* statement matches an exclusion (`:512780-512799`).
2. It reads `excludedCommands` from `us()` (`:512772`) — the **fully merged** settings, i.e. including
   `projectSettings` and `localSettings`.

So under an enterprise "everything must be sandboxed" policy, a command like

```
git status; <anything else>
```

had its *first* statement match a `git status` exclusion → `I1_` true → `H4` false → **not sandboxed** — and
the 193-shaped guard, which only asked "is this Windows under mandatory policy?", had already been satisfied
by the platform check. The tail of the compound ran unsandboxed. Worse, on the second property, a
repository-supplied `.claude/settings.json` could *supply* the exclusion pattern.

### 5.4 The fix: a second, deliberately strict matcher

```javascript
// ============================================
// matchesTrustedWholeCommandExclusion - the narrow re-check that closes the compound-command bypass
// Location: cli_inner_pretty.js:512802-512807 (metachar regex R1_ at :512840)
// ============================================

// ORIGINAL (for source lookup):
function nDd(e) {
  let t = YLt().flatMap((n) => n?.sandbox?.excludedCommands ?? []),
    r = e.trim();
  if (t.length === 0 || !r || R1_.test(r)) return !1;
  return t.some((n) => crp(vko(n), r));
}
R1_ = /[;|&`$(){}<>#\n\r]/;

// READABLE (for understanding):
function matchesTrustedWholeCommandExclusion(command) {
  let patterns = getTrustedSettingsSources()                    // (1) NOT project/local settings
        .flatMap((s) => s?.sandbox?.excludedCommands ?? []),
      trimmed = command.trim();
  if (patterns.length === 0 || !trimmed || SHELL_METACHARS.test(trimmed)) return false;  // (2) no tokenising
  return patterns.some((p) => matchesCommandPattern(parseCommandPattern(p), trimmed));   // (3) WHOLE command
}
const SHELL_METACHARS = /[;|&`$(){}<>#\n\r]/;

// Mapping: nDd→matchesTrustedWholeCommandExclusion, YLt→getTrustedSettingsSources (:204062-204064),
//          R1_→SHELL_METACHARS, crp→matchesCommandPattern (:512808-512817), vko→parseCommandPattern
```

Three tightenings, each closing one leg of the bypass:

1. **`YLt()` instead of `us()`** — the trusted-scope primitive from
   [network_strict_allowlist.md](network_strict_allowlist.md) §3. A cloned repository's
   `.claude/settings.json` can no longer contribute an exclusion pattern to this decision. Note this is the
   **fifth** `YLt()` call site and the only one outside the sandbox config builder — the same refactor that
   enabled the two settings bullets also enabled this security fix.
2. **Refuse anything with a shell metacharacter** rather than tokenising it. `[;|&\`$(){}<>#\n\r]` covers
   statement separators, pipelines, backtick and `$()` substitution, subshells/blocks, redirection, and
   comments. This is a *conservative* answer to a parser-divergence problem: the harness's tokeniser and
   PowerShell 5.1 need not agree, so any command whose meaning depends on tokenisation is simply not
   exemptible. It is the same design as the Bash analyser's over-length/divergence passthrough
   (ground truth §6.4) — when parsing is untrustworthy, fall back to the safe verdict rather than to a
   better parser.
3. **Match the whole trimmed command**, never a statement.

The refusal message was rewritten to say exactly this (`QLd`, `:430929-430930`):

> *"Enterprise policy requires sandboxing, but this command would not be sandboxed on Windows: either the
> sandbox is unavailable, or the command matches a sandbox exclusion pattern only in part. **Compound
> commands and commands with shell metacharacters must run sandboxed even when a statement matches an
> exclusion.** Shell command execution is blocked by policy."*

`Enterprise policy requires sandboxing` is 220=1 / **193=1** (the message was *edited*, so a count-only check
scores this bullet as "no change"), while `must run sandboxed even when a statement matches an exclusion` is
**220=1 / 193=0**. That pair is the cleanest illustration in this module of why counting literals is not a
delta detector.

### 5.5 Two enforcement points, one decision

`ZLd` is called **twice** on the PowerShell tool, and both sites emit the same telemetry
(`windows_policy_refusal`, **220=2 / 193=0**):

| Site | Hook | Shape of the refusal |
|---|---|---|
| `:431116-431117` | `validateInput` | `{ result: false, message: QLd, errorCode: 11 }` |
| `:431193-431194` | `call` | `throw new Nco(QLd)` (`SandboxPolicyRefusalError`, exported `:204636`) |

**Why check twice.** `validateInput` produces a clean, model-readable validation failure — the right UX. But
validation and execution are separated in time, and the decision depends on **mutable settings**
(`excludedCommands`, `sandbox.enabled`) that a settings watcher can change in between; `H4` also consults
live sandbox availability, which can drop if `srt-win` becomes unusable mid-session. The re-check in `call`
makes the gate TOCTOU-safe, at the cost of a duplicated condition. The 2.1.193 code had the same two-site
shape (`:451137 (193)`, `:451201 (193)`), so the *pattern* is carryover — only the predicate got smarter.

**Key insight:** the bullet reads like a small permissions bug. It is actually the visible edge of §1–§4: once
Windows gained a real sandbox, "we can't sandbox on Windows, so refuse everything" had to become "sandbox it
if we can, and refuse only what we cannot" — and the moment the answer stopped being constant, the exclusion
matcher became security-relevant and its permissive statement-splitting became a hole.

---

## 6. What I did not cover

- **`srt-win`'s own implementation.** It is a separate Rust binary (`vendor/srt-win-src`, `:211291 (193)`);
  only the client-side invocation surface is in this bundle.
- **The `/sandbox install` UI beyond the outcome taxonomy.** `NPf` (`:724557-…`) and the status view at
  `:724025` were read only far enough to confirm the telemetry reasons and the two cancellation paths.
- **WFP filter semantics** — port ranges, sublayer weights, and how the permit range relates to
  `proxyPortRange` (`pos`, referenced at `:194836`, `:195349`) are not analysed.
- **Whether any of this is reachable in a shipped Windows build.** This extract is the Linux target
  (`kH()` → `"linux"`), so the entire document is a source read, not a behaviour report.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (home for Sandbox)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-theme additions: [symbol_additions_v2_1_220_sandbox.md](../00_overview/symbol_additions_v2_1_220_sandbox.md)

Key functions in this document:

- `getWindowsSandboxUserStatus` (`aNe`, `:194881-194897`) - `srt-win user status` → provisioning report; 220-only.
- `getWindowsSandboxCaCert` (`aSu`, `:194898-194902`) - pulls `{pem, thumb}` out of the status report.
- `installWindowsSandbox` (`glo`, `:194903-194930`) - `srt-win install`; exit-code taxonomy 0/10/12/13/14.
- `getWindowsWfpStatus` (`LLt`, `:194820-194831`) - `wfp status`; can report `cannot-read` when not elevated.
- `verifyWindowsWfpEgress` (`sSu`, `:194832-194880`) - the empirical egress self-test; exit 3 = fence inactive.
- `stampWindowsSandboxDenyAcls` (`lSu`, `:194943-194957`) - `acl stamp`; exit 2 = partial.
- `restoreWindowsSandboxDenies` (`gos`, `:194958-194974`) - `acl restore --json`; returns `paths` ∪ `parents`.
- `grantWindowsSandboxAcls` (`cSu`, `:194975-194985`) - `acl grant`.
- `revokeWindowsSandboxGrants` (`yos`, `:194986-194999`) - `acl revoke --json`.
- `resolveExistingPathsForAcl` (`hos`, `:194931-194942`) - expands globs and drops non-existent paths before ACL work.
- `buildWindowsGitConfigEnv` (`mWg`, `:195000-195024`) - `GIT_CONFIG_KEY_n` injection incl. `safe.directory` and schannel CA.
- `initializeSandboxRuntime` (`vWg`, `:195267-195373`) - the Windows provisioning/CA/ACL sequence at `:195289-195346`.
- `isSandboxRuntimeInitialized` (`AWg`, `:195379-195381`) - `Hl !== undefined`; the flag the rollback clears.
- `SANDBOX_USER_NAME` (`kco`, `:204092`) - `"ClaudeCodeSandbox"`.
- `shouldRefusePowerShellUnderMandatorySandbox` (`ZLd`, `:430750-430759`) - the `.214` gate.
- `powerShellCommandWillBeSandboxed` (`WRo`, `:430760-430762`) - `H4` with `shellType: "powershell"`.
- `POWERSHELL_POLICY_REFUSAL_MESSAGE` (`QLd`, `:430929-430930`) - the rewritten refusal text.
- `shouldRunUnderSandbox` (`H4`, `:512818-512826`) - the sandbox/no-sandbox decision; `I1_` short-circuit at `:512824`.
- `matchesAnyStatementExclusion` (`I1_`, `:512771-512801`) - the permissive matcher (carryover shape).
- `matchesTrustedWholeCommandExclusion` (`nDd`, `:512802-512807`) - the strict re-check; `SHELL_METACHARS` (`R1_`) at `:512840`.
- `matchesCommandPattern` (`crp`, `:512808-512817`) - `prefix` / `exact` / `wildcard` pattern kinds.
- `handleSandboxInstallCommand` (`NPf`, `:724557-…`) - `/sandbox install`; `sandbox_windows_install` outcomes.
