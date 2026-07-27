# Claude in Chrome: GA, the file-upload rebuild, and four Windows/startup repairs

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `.../2.1.193/extract/cli_inner_pretty.js`, always tagged `(193)`.

`Claude in Chrome` as a literal is **220=109 / 193=63** — the surface nearly doubled in this window,
and the changelog reports only a fraction of it. This document covers the `.198` GA bullet, the
`.211` upload cluster (three bullets that are one code change), and four smaller `.199`/`.211`
repairs.

---

## 1. GA is server-side; the client delta is an install upsell

> `.198` — *"Claude in Chrome is now generally available"*

**Verdict: SERVER_SIDE for the bullet itself.** `generally available` is 220=1 / 193=1 and its one
site (`:508020`, per the false-delta ledger) is unrelated prompt text. There is no client flag that
says "GA".

**But a genuinely net-new client surface shipped alongside it**, and it is the observable trace of
GA: an in-product *install upsell* that offers to set up the extension.

| Anchor | 220 | 193 |
|---|---|---|
| `chrome_install_upsell` (all forms) | 19 | **0** |
| `tengu_chrome_install_upsell` (gate) | 2 | **0** |
| `tengu_chrome_install_upsell_shown` (event) | 1 | **0** |
| `chromeInstallUpsellDismissed` (config key) | 2 | **0** |

### The eligibility predicate is a 13-clause AND

```javascript
// ============================================
// shouldOfferChromeInstall - decides whether to show the Claude-in-Chrome install upsell
// Location: cli_inner_pretty.js:773897-773916
// ============================================

// ORIGINAL (for source lookup):
function vnm() {
  if (F0r()) return !1;
  if (bge !== void 0) return !1;
  return (
    oYo() && !yn() && !PI() && $Ei() === void 0 && !ql() && !G5e() && Mt() !== "wsl" && !Bs() &&
    j9t()?.isTeleported !== !0 && !sL() && !iYo() &&
    xt().chromeInstallUpsellDismissed !== !0 &&
    Ke("tengu_chrome_install_upsell", !1) &&
    !lMr()
  );
}

// READABLE (for understanding):
function shouldOfferChromeInstall() {
  if (isClaudeInChromeWiredThisSession()) return false;    // already set up in this session
  if (upsellPromise !== undefined) return false;           // already offered once this process
  return (
    hasBaseChromeOfferEligibility() &&                     // entrypoint/platform base check
    !isNonInteractive() && !isSomeSuppressedSurface() &&
    getSuppressionReason() === undefined &&
    !cond5() && !cond6() &&
    getPlatform() !== "wsl" &&                             // WSL cannot drive the host browser
    !cond8() &&
    getSessionInfo()?.isTeleported !== true &&             // not a teleported/remote session
    !cond10() &&
    !hasChromeExtensionEvidence() &&                       // no sign the extension already exists
    config().chromeInstallUpsellDismissed !== true &&      // user said no, permanently
    getFeatureValue("tengu_chrome_install_upsell", false) &&  // remote gate, default OFF
    !isBlockedByDeniedMcpServersPolicy()                   // managed policy
  );
}

// Mapping: vnm→shouldOfferChromeInstall, F0r→isClaudeInChromeWiredThisSession, bge→upsellPromise,
//          oYo→hasBaseChromeOfferEligibility, iYo→hasChromeExtensionEvidence, Ke→getFeatureValue,
//          xt→config, Mt→getPlatform, lMr→isBlockedByDeniedMcpServersPolicy, j9t→getSessionInfo
```

**Why this shape.** An upsell that fires wrongly is worse than one that never fires: it interrupts a
turn to ask about a browser. So the predicate is a **conjunction of cheap negative checks with the
remote gate second-to-last**. Two design points are worth stating:

1. **`Ke("tengu_chrome_install_upsell", !1)` defaults to `false`.** GA did *not* turn the upsell on
   for everyone; it made the upsell *possible* and left the ramp to the server. That is exactly why
   the changelog bullet is unanchorable — GA is a gate value, not a code change.
2. **The gate is checked after twelve local predicates, not first.** The gate read
   (`getFeatureValue_CACHED_MAY_BE_STALE` behind `Ke`) is the only clause that can touch cached remote
   state; putting it last means a WSL user or a teleported session never even consults it. The single
   clause placed *after* it, `!lMr()`, is the managed-policy check — deliberately last so that
   "blocked by policy" is the most specific reason available, and indeed `hqS` (`:773937-773943`)
   re-checks it and emits `$e("chrome_install_upsell", "policy_denied")` with the log line
   `[Claude in Chrome] Skipping install upsell: blocked by managed deniedMcpServers policy`.

**`bge` is a promise-shaped once-latch** (`:773920-773935`): the first call stores the in-flight
dialog promise, so concurrent turns cannot double-prompt, and a failure resets `bge = void 0` only
when the abort signal fired (`:773927`) — an ordinary error leaves the latch set, i.e. *one attempt
per process*.

The dialog itself reports `tengu_chrome_install_upsell_shown` from a `useEffect` (`:768702`,
`:768712`) and offers a `"skip"` choice labelled `Continue without browser tools` with the
description `Finish setup later with /chrome` (`:768699`). The `/chrome` command object is at
`:501557-501563` (`description: "Open Claude in Chrome settings"`, `availability: ["claude-ai"]`,
`isEnabled: () => !yn()`).

---

## 2. The file-upload rebuild: path → content

Three `.211` bullets describe one new module:

> - *"Fixed file upload validation: filenames ending in a DOS device suffix (`.prn`) or trailing dot
>   are now accepted, and files with multiple hard links are refused"* (#9)
> - *"Fixed file uploads to Claude in Chrome from remote and CLI sessions"* (#10)
> - *"Claude in Chrome: hardened file-upload path validation"* (#35)

**Verdict: NET_NEW — an entire module.** In 2.1.193 the CLI did *no* upload validation at all:
`file_upload` appears there only as an extension-side tool name (`:13073 (193)`) and an OAuth scope.
The 2.1.220 module lives at `:514071-514330` and exports:

```
prepareChromeFileUploadInput   a$_     :514094
uploadRootsForSession          Wrp     :514079
verifyHandleBinding            d2o     :514249     (220=2 / 193=0)
readBoundedToSnapshot          qrp     :514234
readlinkFailureVerdict         Vrp     :514246
FILE_UPLOAD_MAX_TOTAL_BYTES    t8s     :514308  = 10485760 (10 MiB)
```

### 2.1 Where it hooks in, and why it appears twice

`:295687` (and its clone `:301229`) wrap the MCP tool's `call` method:

```javascript
// ============================================
// wrapChromeUploadTool - swaps file paths for base64 content before the call leaves the CLI
// Location: cli_inner_pretty.js:295687-295696
// ============================================

// ORIGINAL (for source lookup):
            if (xY(e.name) && Bde(e.config) && (L.name === "file_upload" || L.name === "browser_batch")) {
              let G = q.call;
              q.call = async (j, z, V, K, Y) => {
                let { prepareChromeFileUploadInput: re } = await Promise.resolve().then(() => (Ybo(), Bvs)),
                  { getToolPermissionContext: oe } = await Promise.resolve().then(() => (jl(), Rfo)),
                  ce = await re(L.name, j ?? {}, oe(z));
                if (ce.error) throw new Lr(ce.error, "Claude in Chrome file_upload path rejected");
                return G(ce.input ?? j, z, V, K, Y);
              };
            }

// READABLE (for understanding):
            if (isClaudeInChromeMCPServer(server.name) && isBridgeBackedConfig(server.config) &&
                (tool.name === "file_upload" || tool.name === "browser_batch")) {
              let innerCall = wrapper.call;
              wrapper.call = async (input, ctx, a, b, c) => {
                let { prepareChromeFileUploadInput } = await import("./chrome-file-upload"),
                  { getToolPermissionContext } = await import("./permissions");
                let prepared = await prepareChromeFileUploadInput(tool.name, input ?? {},
                                                                 getToolPermissionContext(ctx));
                if (prepared.error) throw new UserVisibleError(prepared.error,
                                                              "Claude in Chrome file_upload path rejected");
                return innerCall(prepared.input ?? input, ctx, a, b, c);
              };
            }

// Mapping: xY→isClaudeInChromeMCPServer, Bde→isBridgeBackedConfig, q→wrapper, G→innerCall,
//          re→prepareChromeFileUploadInput, oe→getToolPermissionContext, Lr→UserVisibleError
```

The wrapper appears at **both `:295687` and `:301229`** because 2.1.220 ships two complete MCP
runtime trees (v1 default, v2 opt-in) — see
[`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md). Reading only the first
hit means reading the v1 tree. Both copies are byte-equivalent here.

### 2.2 Why the rewrite exists at all (this is bullet #10)

`prepareChromeFileUploadInput` (`:514094-514126`) reads the file **in the CLI process** and rewrites
`{paths: [...]}` into `{files: [{data: <base64>, name, mimeType}]}` (`:514154`, `:514157`).

**This is the whole fix for "file uploads from remote and CLI sessions".** The extension runs inside
the user's browser on the *local* machine. When Claude Code runs on a remote host, in a container, or
simply in a different filesystem namespace, a path handed to the extension resolves to a different
file or to nothing. Moving the bytes instead of the path makes upload independent of whether the two
processes share a filesystem.

The trade-off is stated in the error text itself (`:514288`):

> `file_upload sends file contents over the browser bridge in a single message; use a smaller file,
> or split across multiple file_upload calls if the page accepts files one at a time.`

Hence `FILE_UPLOAD_MAX_TOTAL_BYTES = 10 MiB` — and note it is a **budget, not a per-file cap**:
`{remaining: t8s}` is created once in `prepareChromeFileUploadInput` (`:514095`) and decremented per
file (`:514292`), so a `browser_batch` of ten uploads shares one 10 MiB allowance.

**`browser_batch` recursion is handled explicitly** (`:514097-514123`) with three refusals *before*
any file is touched:

1. sub-action must be an object with a string `name`;
2. **`browser_batch` cannot be nested** (`c === "browser_batch"`, `:514110`);
3. the name must be printable ASCII `/^[\x20-\x7E]+$/` (`:514108`) **and** must not be a case- or
   whitespace-variant of `file_upload` (`:514114`: `if (c === "file_upload" && l !== "file_upload")`).

That third check is the interesting one. `c` is `l.trim().toLowerCase()`. So `" File_Upload "`
normalises to `file_upload` but is not byte-equal to it — and is **rejected**, not normalised. The
alternative (normalise and proceed) would mean the validator and the extension could disagree about
which tool is being invoked: the CLI would decide "not an upload, skip validation" while a lenient
extension-side matcher accepted `"File_Upload"` and performed one. Rejecting closes that gap. This is
a **parser-differential defence**, the same class of bug as the Bash analyzer's tokenizer-divergence
guard documented in [`../38_permissions/security_hardening_214.md`](../38_permissions/security_hardening_214.md).

### 2.3 The validator: eight refusals in a deliberate order

`l$_` (`:514159-514233`) is bullet #35. Every refusal carries a marker string prefixed
`claudeInChrome/fileUpload:` — grep that prefix to enumerate them.

| # | Line | Refusal | Checked against |
|---|---|---|---|
| 1 | `:514164-514168` | network path (UNC / mapped drive) — **before any filesystem access** | raw input + each ancestor |
| 2 | `:514169-514173` | suspicious Windows path spelling (`Sht`) | raw input + each ancestor |
| 3 | `:514178-514182` | network path — **again, after `realpath`** | resolved path + ancestors |
| 4 | `:514183-514187` | suspicious spelling — again, after resolution | resolved |
| 5 | `:514188-514189` | matches a **read `deny`** rule (`B0(a, t, "read", "deny")`) | resolved |
| 6 | `:514190-514191` | matches a **read `ask`** rule — refused, not prompted | resolved |
| 7 | `:514223-514227` | the `Read` tool itself is denied or ask-gated for this session | tool policy |
| 8 | `:514229-514231` | path not readable under session permissions (`glt(a, t, "read")`) | every resolved ancestor |

Four design points, each non-obvious:

**(a) The network/spelling checks run twice — before and after `realpath`.** `:514163` iterates
`[e.trim(), ...n]` (the *raw* input and its ancestors); `:514177` iterates
`new Set([...n, ...M_(i)])` (the resolved path's ancestors). The pre-check exists because
`fs.realpath` on a UNC path is itself an act of network access — resolving `\\evil-host\share\x`
makes an SMB connection before you have decided whether you trust it. The refusal marker spells this
out: `network path rejected **before filesystem access**` (`:514167`) versus
`network path rejected **after resolution**` (`:514181`). The post-check exists because a *local*
path can be a symlink to a UNC path.

**(b) A read-`ask` rule is a refusal, not a prompt** (`:514190`). Elsewhere in Claude Code an `ask`
rule opens a dialog. Here it cannot: the upload is a side effect of an MCP tool call already in
flight, and the destination is a web page that may be attacker-influenced. Downgrading `ask` to
`deny` at a trust boundary is fail-closed.

**(c) `bypassPermissions` short-circuits only check 8, never checks 1–7** (`:514228`:
`if (t.mode === "bypassPermissions") return { realPath: i };`). The ordering is load-bearing: the
network-path, spelling, deny-rule, ask-rule and Read-tool checks are all *above* that line, so
`--dangerously-skip-permissions` still cannot upload over UNC or through a deny rule. Only the
generic "is this path readable" check is skipped.

**(d) The allowed-roots walk verifies the directory by handle, not by name** (`:514193-514222`).
For each upload root it `open()`s the directory with `O_RDONLY | O_NOFOLLOW | O_NONBLOCK`, `stat()`s
**the open handle**, `realpath()`s the name, `stat()`s that, and requires `ino`/`dev` to match
(`:514207`). Only then does it accept `i === u || i.startsWith(u + sep)`. This closes the TOCTOU
window where the root directory is swapped for a symlink between the name check and the read.
`O_NOFOLLOW` is 220=33 / **193=11** across the bundle — this module accounts for much of the growth.

### 2.4 Bullet #9, part one — hard links

```javascript
// ============================================
// openAndSnapshotUploadFile - opens, refuses aliased/moved files, and reads a bounded snapshot
// Location: cli_inner_pretty.js:514269-514298
// ============================================

// ORIGINAL (for source lookup):
async function c$_(e, t, r) {
  let n = await V9.lstat(t).catch(() => null);
  if (n === null || !n.isFile()) return { error: `Cannot upload "${e}": not a regular file.` };
  let o;
  try { o = await V9.open(t, F_r.constants.O_RDONLY | Grp | i$_); }
  catch (i) { return { error: `Cannot upload "${e}": failed to open file (...).` }; }
  try {
    let i = await o.stat();
    if (i.nlink > 1)
      return { error: `Cannot upload "${e}": the file has multiple hard links, which can alias a file outside the session's allowed directories. This commonly triggers for files inside package-manager stores like node_modules (Bun and pnpm hard-link packages). Copy the file (e.g. with cp) and upload the copy.` };
    if (!i.isFile()) return { error: `Cannot upload "${e}": path moved during validation.` };
    if ((await d2o(o, t, i)) === "moved") return { error: `Cannot upload "${e}": path moved during validation.` };
    if (i.size > r.remaining) return { error: `Cannot upload "${e}": total upload size would exceed ${Math.round(t8s / 1048576)} MB. ...` };
    let s = await qrp(o, i.size);
    if (s === "grew" || s.buf.length > r.remaining) return { error: `Cannot upload "${e}": file grew during read.` };
    return ((r.remaining -= s.buf.length), { buf: s.buf });
  } catch (i) { return { error: `Cannot upload "${e}": failed to read file (...).` }; }
  finally { await o.close(); }
}

// READABLE (for understanding):
async function openAndSnapshotUploadFile(displayName, realPath, budget) {
  let pre = await fs.lstat(realPath).catch(() => null);
  if (pre === null || !pre.isFile()) return { error: `... not a regular file.` };
  let handle;
  try { handle = await fs.open(realPath, O_RDONLY | O_NOFOLLOW | O_NONBLOCK); }
  catch (e) { return { error: `... failed to open file (${e}).` }; }
  try {
    let st = await handle.stat();                        // stat the HANDLE, not the name
    if (st.nlink > 1)     return { error: HARD_LINK_REFUSAL };
    if (!st.isFile())     return { error: `... path moved during validation.` };
    if ((await verifyHandleBinding(handle, realPath, st)) === "moved")
                          return { error: `... path moved during validation.` };
    if (st.size > budget.remaining) return { error: TOTAL_SIZE_REFUSAL };
    let snap = await readBoundedToSnapshot(handle, st.size);
    if (snap === "grew" || snap.buf.length > budget.remaining)
                          return { error: `... file grew during read.` };
    budget.remaining -= snap.buf.length;
    return { buf: snap.buf };
  } catch (e) { return { error: `... failed to read file (${e}).` }; }
  finally { await handle.close(); }
}

// Mapping: c$_→openAndSnapshotUploadFile, e→displayName, t→realPath, r→budget, o→handle, i→st,
//          d2o→verifyHandleBinding, qrp→readBoundedToSnapshot, Grp→O_NOFOLLOW, i$_→O_NONBLOCK
```

**Why refuse `nlink > 1` at all?** The whole validator establishes that *this path* is inside an
allowed directory. A hard link is a second name for the same inode, and the *other* name can be
anywhere on the volume — including outside every allowed root. Since `.claude` deny rules and
`/add-dir` grants are expressed over **paths**, a hard link is a legitimate-looking path that aliases
an illegitimate one. There is no way to enumerate an inode's other names portably, so the code
refuses rather than resolves.

**Why the refusal text names `node_modules`.** Bun and pnpm hard-link package files from a global
store, so `nlink > 1` is the *normal* state for most files under `node_modules`. Without the
explanation this refusal would look like a bug on the most common repository layout in existence.
The message therefore states the cause, names the two package managers, and gives the workaround
(`cp` and upload the copy). That is the pattern the rest of this build follows for fail-closed
security refusals: *reason, likely benign cause, remedy*.

**`verifyHandleBinding`** (`d2o`, `:514249-514268`, 220=2/193=0) answers "is the handle I am holding
still the file at that path?" with a two-tier strategy:

1. **Preferred:** `readlink("/proc/self/fd/N")` and compare to the expected path; a `" (deleted)"`
   suffix means the file was unlinked while open (`:514261`).
2. **Fallback** (when `/proc` is unavailable — macOS, Windows): `realpath(path) === path` and then
   `stat(path)` must match the handle's `ino`/`dev` (`:514265-514266`).

`readlinkFailureVerdict` (`Vrp`, `:514246`) maps `ENAMETOOLONG` to `"moved"` rather than to the
fallback — an over-long `/proc` link is evidence the target was replaced, not evidence that `/proc`
is missing.

**`readBoundedToSnapshot`** (`qrp`, `:514234-514245`) allocates `size + 1` and loops; returning
`"grew"` when more than `size` bytes are available. Same `+1` oracle as `readFileForRemote` (see
[`bridge_transport.md`](bridge_transport.md#35-new-gate--tengu_bridge_read_file_served)). Combined
with the post-read `snap.buf.length > budget.remaining` check, a file that grows during the read is
refused rather than truncated — because a truncated upload is a *silently wrong* upload.

### 2.5 Bullet #9, part two — the `.prn` / trailing-dot round trip

The changelog says these names are now **accepted**. The mechanism is a suffix round-trip, and it is
easy to misread as a rejection.

- `isWindowsReservedOrTrailingDotName` (`Tou`, `:162382-162384`):
  `UQi = /[.\s]+$/` (trailing dots/whitespace) and
  `jQi = /\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i` (DOS device suffixes).
  **Both regexes are carryover** — the byte-identical device-name regex is at `:586101 (193)`.
- When Claude Code *stores* a shared attachment it appends `_` to any name that trips the predicate:
  `HKg(e)` → `Fxu(e) ? e + "_" : e` (`:217624-217626`), used by `Nxu(e, t)` → `` `${e}-${HKg(t)}` ``
  (`:217618`). This is what makes the file writable on Windows at all.
- On upload, `Bxu` (`:217627-217631`) reverses it:

```javascript
// ============================================
// restoreAttachmentDisplayName - undoes the Windows-safe "_" suffix for the outbound filename
// Location: cli_inner_pretty.js:217627-217631
// ============================================

// ORIGINAL (for source lookup):
function Bxu(e) {
  let t = e.replace(kKg, "");
  if (t.endsWith("_") && Fxu(t)) return t.slice(0, -1);
  return t || e;
}

// READABLE (for understanding):
function restoreAttachmentDisplayName(storedBasename) {
  let stripped = storedBasename.replace(ATTACHMENT_PREFIX_RE, "");   // drop the "<id>-" prefix
  if (stripped.endsWith("_") && isReservedAfterTrailingUnderscores(stripped))
    return stripped.slice(0, -1);                                    // give back "report.prn"
  return stripped || storedBasename;
}

// Mapping: Bxu→restoreAttachmentDisplayName, Fxu→isReservedAfterTrailingUnderscores,
//          kKg→ATTACHMENT_PREFIX_RE
```

with `Fxu(e) = Tou(e.replace(/_+$/, ""))` (`:217621`) — strip *all* trailing underscores, then ask
whether the result is reserved. The call site (`:514150-514153`) applies it **only** when the file's
directory `realpath`s to the attachments root:

```javascript
let d = await V9.realpath(Cor()).catch(() => { return; }),
  p = d !== void 0 && dRe.dirname(l) === d ? Bxu(dRe.basename(l)) : dRe.basename(l);
```

**Why gate the un-suffixing on the directory.** `Bxu` is a *reversal of our own encoding*. Applying
it to an arbitrary user file would silently rename `backup_` → `backup` on the way out. Restricting
it to `~/.claude/uploads/<session>` (`Cor()`, `:217615`) means the transform only ever runs on names
this code wrote. The `realpath` on the root (rather than a string compare) is the same anti-symlink
posture as §2.3(d).

Also at the same site: **`registered attachment digest mismatch`** (`:514148-514149`). If the path
was registered as an attachment with a known digest (`jxu`, `:217640`), the bytes just read must hash
to it, else the upload is refused with the generic `Urp` message. The registry is an LRU capped at
`IKg = 1024` entries (`:217645`, eviction at `:217634-217637`) — bounded so a long session cannot
grow it without limit, at the cost of very old attachments losing their digest binding and falling
back to the ordinary permission path.

### 2.6 The generic refusal message is deliberately uninformative

```javascript
function Urp(e) {   // :514127-514129
  return `Cannot upload "${e}": only files this session is allowed to read can be uploaded. Ask the user to share the file with this session, or to add its folder with /add-dir.`;
}
```

Every *permission-class* failure collapses to this one string (`:514143`, `:514149`), while the
specific reason goes to the debug log (`:514142`,
`[chrome file_upload] rejected path: ${a} (${message})`). **This is an oracle-suppression choice**:
the model is driving a browser that may be showing attacker-controlled content, and distinguishing
"denied by rule" from "does not exist" from "outside allowed dirs" would let a page probe the local
filesystem one path at a time. The precise `claudeInChrome/fileUpload:` markers exist for the
*developer* reading logs, not for the model.

---

## 3. `.211` #12 — the startup hang and the dead probe on the legacy socket

> *"Fixed a startup hang when the Claude in Chrome extension is enabled but Chrome is not running"*

**Verdict: DELTA, thin.** The only new anchor is a dead-probe gate.

`tengu_dead_probe_chrome_legacy_socket` is 220=1 / 193=0, at `:267285` inside `zmy`:

```javascript
async function zmy(e) {            // probeLegacyChromeSockets, :267278-267292
  if (B5u || w_s) return;          // already reported, or a probe is in flight
  w_s = !0;
  try {
    for (let t of e)
      try { if ((await Jar.stat(t)).isSocket()) { ((B5u = !0), O("tengu_dead_probe_chrome_legacy_socket", {})); return; } }
      catch {}
  } finally { w_s = !1; }
}
```

It is called fire-and-forget from `getAllSocketPaths` (`H_s`, `:267293-267307`) with the two
*legacy* socket locations — `$TMPDIR/claude-mcp-browser-bridge-<hash>` and the hard-coded
`/tmp/claude-mcp-browser-bridge-<hash>` (`:267301-267306`). Two latches (`B5u` report-once, `w_s`
in-flight) make it fire at most once per process.

**What this actually tells us.** The transport selector at `:44179` is
`bridgeConfig ? wsBridge : getSocketPaths ? socketPool : singleSocket`, and the Chrome context has
always supplied `bridgeConfig` (`bridgeConfig` is 220=7 / **193=7**, 193 site `:605382 (193)`). So
the local-socket path was already dead code in 2.1.193 — it is a pre-WS-relay design in which the CLI
connected to a native-messaging host over a unix socket, and *that* is the code that blocks when
Chrome is not running. 2.1.220 does not remove it; it **instruments it** so Anthropic can confirm
nobody still lands there before deleting it. `tengu_dead_probe_*` is a family-wide pattern in this
build — see [`../46_todo_tasks/dead_probe_gate_family.md`](../46_todo_tasks/dead_probe_gate_family.md)
for the pattern write-up; this is its Chrome member.

**Honest conclusion:** the gate is evidence of the *cleanup* the bullet describes, not proof of the
hang fix itself. `Chrome is not running` is 220=0 / 193=0 — there is no user-facing literal for this
bullet in either bundle, and no timeout constant isolable to the socket probe. Recorded as a thin
delta.

---

## 4. `.211` #20 — Windows setup pages: the App Paths resolver

> *"Fixed Claude in Chrome setup pages failing to open in the browser on Windows"*

**Verdict: NET_NEW.** The scoping pass's anchor `openInBrowser` is a decoy — 220=3 / **193=3**, and
all three sites (`:502752`, `:502791`, `:502822`) are a different, generic browser opener. The real
anchor is `App Paths`: **220=9 / 193=0**, plus `app_paths_spawn_failed` 220=1 / 193=0.

### Before / after

| | 2.1.193 (`:194088-194091`) | 2.1.220 (`:267233-267256`) |
|---|---|---|
| Windows open | `await $n("rundll32", ["url,OpenURL", e])`, one attempt | App Paths registry lookup → direct detached spawn → `rundll32` fallback **with `cwd`** |
| cwd | inherited | `v_s()` (the resolved system root) |
| telemetry | `chrome_open_url` success/`exec_failed` | adds `open_method` ∈ `app_paths` / `rundll32_after_spawn_fail` / `rundll32` / `rundll32_no_app_paths_support`, plus `browser` |

```javascript
// ============================================
// openInChrome (Windows arm) - App Paths first, rundll32 second, with method telemetry
// Location: cli_inner_pretty.js:267233-267256
// ============================================

// ORIGINAL (for source lookup):
    case "windows": {
      let o = n.windows.appPathsExe, i = !1;
      if (o) {
        let a = await $5u(o);
        if (a) {
          if (await N5u(a, [e])) return (be("chrome_open_url", { open_method: Ee("app_paths"), browser: fe(r) }), !0);
          i = !0;
        }
      }
      let s = await Xn("rundll32", ["url,OpenURL", e], { cwd: v_s() });
      if (s.code === 0)
        return (be("chrome_open_url", { open_method: i ? Ee("rundll32_after_spawn_fail") : o ? Ee("rundll32") : Ee("rundll32_no_app_paths_support"), browser: fe(r) }), !0);
      return (pe("chrome_open_url", "exec_failed", { ...A_s(s), ...(i && { app_paths_spawn_failed: !0 }), browser: fe(r) }), !1);
    }

// READABLE (for understanding):
    case "windows": {
      let appPathsExe = browserDef.windows.appPathsExe, spawnFailed = false;
      if (appPathsExe) {
        let exePath = await resolveViaAppPaths(appPathsExe);           // HKCU then HKLM
        if (exePath) {
          if (await spawnDetached(exePath, [url]))
            return (trackOk("chrome_open_url", { open_method: "app_paths", browser }), true);
          spawnFailed = true;                                          // found it, could not launch it
        }
      }
      let res = await run("rundll32", ["url,OpenURL", url], { cwd: systemRoot() });
      if (res.code === 0)
        return (trackOk("chrome_open_url", { open_method:
                 spawnFailed ? "rundll32_after_spawn_fail"
               : appPathsExe ? "rundll32"
               : "rundll32_no_app_paths_support", browser }), true);
      return (trackFail("chrome_open_url", "exec_failed",
               { ...execFailureFields(res), ...(spawnFailed && { app_paths_spawn_failed: true }), browser }), false);
    }

// Mapping: D9e→openInChrome, $5u→resolveViaAppPaths, N5u→spawnDetached, Xn→run, v_s→systemRoot,
//          A_s→execFailureFields, o→appPathsExe, i→spawnFailed, r→browser, e→url
```

### `resolveViaAppPaths` — five guards around one registry read

`$5u` (`:267035-267084`) queries
`HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\<exe>` then `HKLM\…` (`Bmy` `:267104`):

1. **`reg.exe` is invoked by absolute path** — `` `${v_s()}\\System32\\reg.exe` `` (`:267037`), with
   `cwd` also set to the system root. Not `"reg"`. This is a **PATH-hijack defence**: a
   `reg.exe`/`reg.bat` in the current directory would otherwise win.
2. **10 s timeout** (`P5u = 1e4`, `:267105`) on the registry query, with a distinct log line when
   `i.exitCode === void 0` — *"did not run to completion: … killed at the 10000ms bound, or reg.exe
   failed to spawn"* (`:267043`).
3. **Value parsing** — `Gmy` (`:267019-267029`) matches `REG_SZ` / `REG_EXPAND_SZ` and strips
   surrounding quotes; then `Wmy` (`:267030-267034`) expands `%VAR%` case-insensitively from
   `process.env`.
4. **Fully-qualified-path check** — `/^(?:[a-zA-Z]:[\\/]|\\\\)/` (`:267053`). A relative value is
   discarded rather than resolved, so a poisoned registry value cannot become a relative-path
   execution.
5. **5 s bounded existence check** — `Umy = 5000` (`:267106`). `lstat` is raced against a timer
   (`:267061-267066`); on timeout the candidate is skipped with *"existence check exceeded 5000ms"*.
   Plus a **stat-odd escape hatch** (`:267074-267078`): if `lstat` throws something that is *not*
   `ENOENT`/`ENOTDIR` and the path is under the system root, the candidate is accepted anyway, logged
   as `Resolved … via {hive} App Paths (stat-odd: {code})`.

**Why two separate timeouts, and why is the `lstat` one bounded at all?** Because both operations can
block indefinitely on a corporate Windows box: `reg.exe` can hang against a slow roaming profile, and
`lstat` can hang against an exe on a disconnected network drive. The 5 s / 10 s split reflects
expected cost — a registry read should be near-instant, a filesystem probe may legitimately take
seconds. Guard 5's escape hatch exists because on Windows a *present* file can produce
`EPERM`/`EBUSY`/`EACCES` from `lstat` (AV interception, locked file); treating those as "missing"
would defeat the whole fix on exactly the machines that need it, so the code accepts the path when it
is inside the system root — a location the user cannot plant a binary in without admin rights.

`spawnDetached` (`N5u`, `:267085-267100`) uses `{cwd: dirname(exe), detached: true, stdio: "ignore",
windowsHide: false}` and resolves on the `"spawn"` event rather than on exit — a browser launched
this way must outlive the CLI, so waiting for exit would hang.

**Key insight:** `rundll32 url,OpenURL` goes through the *default browser*, which on a machine where
the user's default is Edge or Firefox opens the Claude setup page in the wrong browser — or, if the
URL handler association is broken, in none. Resolving the specific browser's exe from `App Paths` and
launching it directly is the only way to guarantee *the browser the extension is installed in* opens
the page. The `open_method` telemetry values exist to measure exactly how often each tier is used.

---

## 5. The `.199` reconnect-page loop: a one-boolean → two-boolean rewrite

> *"Fixed Claude in Chrome repeatedly opening the reconnect page when sessions run from different
> builds or config directories"*

**Verdict: DELTA, precisely located.** `reconnect page` is 220=1 / **193=1** — the log string is
carryover and proves nothing. The delta is the control flow around it, plus
`skipReconnectAutoOpen` (220=2 / **193=0**).

```javascript
// ============================================
// installChromeNativeHostManifest - writes the native-host manifest; opens the reconnect page only on a true first install
// Location: cli_inner_pretty.js:664042-664091 (193 twin at :509971-510012)
// ============================================

// ORIGINAL (for source lookup, 2.1.220):
    let i = !1, s = !1;
    for (let a of r) {
      let l = BAe.join(a, gef), c = !1,
        u = await KLe.readFile(l, "utf-8").catch((d) => ((c = qt(d)), null));
      if (!c) i = !0;
      if (u === o) continue;
      try {
        if ((await KLe.mkdir(a, { recursive: !0 }), await KLe.writeFile(l, o),
             w(`[Claude in Chrome] Installed native host manifest at: ${l}`), c)) s = !0;
      } catch (d) { w(`[Claude in Chrome] Failed to install manifest at ${l}: ${d}`); }
    }
    ...
    if (s && !i && !t?.skipReconnectAutoOpen)
      MX().then((a) => { if (a) (w("[Claude in Chrome] First-time install detected, opening reconnect page in browser"), D9e(gjt).catch(xe));
                         else w("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect"); })

// READABLE (for understanding):
    let anyDirAlreadyHadManifest = false, wroteWhereNoneExisted = false;
    for (let dir of hostDirs) {
      let manifestPath = join(dir, MANIFEST_FILENAME), wasMissing = false,
        existing = await fs.readFile(manifestPath, "utf-8").catch((e) => ((wasMissing = isENOENT(e)), null));
      if (!wasMissing) anyDirAlreadyHadManifest = true;     // present, or an error other than ENOENT
      if (existing === desiredJson) continue;               // already correct -> nothing to do
      try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(manifestPath, desiredJson);
        log(`Installed native host manifest at: ${manifestPath}`);
        if (wasMissing) wroteWhereNoneExisted = true;       // ONLY a genuinely absent manifest counts
      } catch (e) { log(`Failed to install manifest at ${manifestPath}: ${e}`); }
    }
    ...
    if (wroteWhereNoneExisted && !anyDirAlreadyHadManifest && !opts?.skipReconnectAutoOpen)
      isChromeExtensionInstalled().then(...)

// Mapping: Wva→installChromeNativeHostManifest, r→hostDirs, gef→MANIFEST_FILENAME, o→desiredJson,
//          c→wasMissing, i→anyDirAlreadyHadManifest, s→wroteWhereNoneExisted, qt→isENOENT,
//          MX→isChromeExtensionInstalled, D9e→openInChrome, gjt→CHROME_EXTENSION_RECONNECT_URL
```

### Why 2.1.193 looped

193 (`:509983-509995 (193)`, with `if (o)` at `:510000 (193)`) has a **single** flag:

```javascript
let o = !1;
for (let s of t) {
  let i = tQ.join(s, LLl);
  if ((await ooe.readFile(i, "utf-8").catch(() => null)) === r) continue;   // no ENOENT/other distinction
  try { … await ooe.writeFile(i, r); … (o = !0); } catch (l) { … }
}
…
if (o) Ape().then(…)                                                         // open reconnect page
```

`o` means **"the manifest content differed and I rewrote it"** — and the manifest embeds
`path: <absolute path to the native-host launcher>` (`:664049` / `:509978 (193)`). That path is
derived from `~/.claude/chrome/chrome-native-host{,.bat}` (`:664105-664106`), i.e. from the **config
directory**. Therefore:

- run Claude Code with a different `CLAUDE_CONFIG_DIR` → different `path` → content differs → rewrite
  → reconnect page;
- install a new build at a different location → same thing;
- alternate between two config dirs → the page opens **every single time you switch**.

That is the reported bug, exactly.

### What 2.1.220 changed

Three things, and each is necessary:

1. **`wasMissing` distinguishes ENOENT from every other read outcome** (`c = qt(d)` inside the
   `.catch`). 193 collapsed "absent" and "present but different" into one `null`.
2. **`wroteWhereNoneExisted` is only set when `wasMissing`** — a content *update* no longer counts as
   an install.
3. **`!anyDirAlreadyHadManifest` is an additional global veto.** Even if one of several host
   directories was genuinely empty, the reconnect page is suppressed when *any other* directory
   already had a manifest — because that is proof the extension was set up before, just not for this
   browser channel.

**Why both (2) and (3)?** (2) alone still fires when a *new browser* is installed (Chrome Beta
appears, its host dir is empty, we write there). (3) suppresses that: the user already paired, they
do not need the onboarding page again. The pair implements "first time on this machine", not
"first time in this directory" — which is precisely the distinction the bug report was about.

`skipReconnectAutoOpen` (an option on the call, 220=2/193=0) gives non-interactive callers — setup
flows that will show their own UI — an explicit opt-out rather than relying on the heuristic.

**Also verified:** the guarded call still checks `isChromeExtensionInstalled()` first and logs
*"First-time install detected, but extension not installed, skipping reconnect"* — that string is
220=1 / 193=1, i.e. carryover. A reader anchoring on it would conclude nothing changed.

The Windows host directory is `%APPDATA%` (or `~/AppData/Local`) `\Claude Code\ChromeNativeHost`
(`oDb`, `:664034-664040`), with registry registration under each browser's key (`iDb`,
`:664093-664102`) — both carryover apart from `process.env.APPDATA` → `Z.APPDATA`.

---

## 6. `.211` #36 — `save_to_disk` finally has a writer

> *"Claude in Chrome: `save_to_disk` on screenshot actions now writes the image to disk and returns
> the path; previously it did nothing"*

**Verdict: NET_NEW writer, byte-identical schema.** This is a clean case where the changelog is
literally true and provable.

| Anchor | 220 | 193 |
|---|---|---|
| `save_to_disk` | 14 | **3** |
| the parameter's schema description (`:34885-34889`) | 1 | 1 — **byte-identical** at `:12746 (193)` |
| `Screenshot saved to: ` (`ZSh`, `:43767`) | 1 | **0** |
| `claude-chrome-screenshots-` (mkdtemp prefix, `:43677`) | 1 | **0** |
| `getScreenshotSaveDir` | 3 (`:43684`, `:43685`, `:537657`) | **0** |

So 2.1.193 **advertised the parameter to the model in the tool schema and had no code that acted on
it.** The model was being told "Returns the saved path in the tool result" by a build that never
returned one.

### The writer

`BFl` (`:43697-43762`) post-processes any tool result containing an image:

1. Resolve a directory via `tEh` (`:43683-43696`): a caller-supplied `getScreenshotSaveDir()` if
   present, else a memoised `mkdtemp(tmpdir(), "claude-chrome-screenshots-")` (`:43677`).
2. **Re-validate the memoised temp dir on every use** (`:43690-43695`): `lstat`, then require
   `isDirectory()` and — when `process.getuid` exists — `uid === getuid()` **and**
   `(mode & 0o777) === 0o700`. Any mismatch clears the memo and creates a fresh one.
3. For each image block, write `screenshot-<epochMs>-<counter>.<ext>` with
   `{flag: "wx", mode: 0o600}` (`:43742`) and push a text block `Screenshot saved to: <path>`.
4. If at least one write succeeded, append
   *"Include the saved path(s) in your response so they can be attached for the user."* (`:43753`).

**Three failure modes, three distinct model-facing notices** — this is the part worth studying:

| Condition | Line | Text handed to the model |
|---|---|---|
| directory could not be created | `:43713-43715` | `Note: save_to_disk failed — the screenshot directory could not be created. The image is included inline above.` |
| no save dir configured for this session | `:43728-43730` | `Note: save_to_disk had no effect — screenshots are not persisted to disk in this session. The image is included inline above; refer to it directly. **Do not retry with save_to_disk.**` |
| some writes failed | `:43757-43759` | `Note: save_to_disk failed for at least one screenshot — it could not be written to disk. The image is included inline above.` |

The middle one carries an explicit **`Do not retry`** instruction; the other two do not. That
asymmetry is the design: a directory-creation failure or a write failure might be transient (disk
full, race), so retrying is rational. "This session does not persist screenshots" is a
*configuration* fact that will not change within the session, so a retry is guaranteed to waste a
turn. Encoding the retry policy in the message is cheaper than adding a structured error field the
model would have to be trained to read.

**Security notes:** `mode: 448` = `0o700` on the directory and `mode: 384` = `0o600` on the file, and
`flag: "wx"` refuses to overwrite — a screenshot may contain credentials on screen, so it is written
private and never clobbers an existing name. The `uid`+`mode` re-check in step 2 defends against a
long-lived process whose temp dir was replaced by another user's symlink.

**Consumer worth knowing about:** plan mode's read-only predicate `Vqs` (`:512876-512881`) declares a
browser action read-only only when `!save_to_disk`. Now that `save_to_disk` genuinely writes to the
filesystem, that flag has become a permission-relevant input rather than a no-op — see
[`../05_plan_mode/`](../05_plan_mode/).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `shouldOfferChromeInstall` (`vnm`) - 13-clause install-upsell eligibility predicate, `:773897`
- `prepareChromeFileUploadInput` (`a$_`) - path→base64 rewrite for `file_upload` / `browser_batch`, `:514094`
- `validateUploadPath` (`l$_`) - eight-refusal upload path validator, `:514159`
- `openAndSnapshotUploadFile` (`c$_`) - hard-link refusal, handle re-verification, bounded read, `:514269`
- `verifyHandleBinding` (`d2o`) - `/proc/self/fd` path check with an ino/dev fallback, `:514249`
- `readBoundedToSnapshot` (`qrp`) - `size + 1` read with a `"grew"` verdict, `:514234`
- `uploadDeniedMessage` (`Urp`) - the single generic permission-refusal string, `:514127`
- `restoreAttachmentDisplayName` (`Bxu`) - reverses the Windows-safe `_` suffix, `:217627`
- `isWindowsReservedOrTrailingDotName` (`Tou`) - DOS device / trailing-dot predicate, `:162384`
- `openInChrome` (`D9e`) - cross-platform URL opener, Windows App Paths arm, `:267221`
- `resolveViaAppPaths` (`$5u`) - registry lookup with five guards, `:267035`
- `spawnDetached` (`N5u`) - detached browser launch resolving on `"spawn"`, `:267085`
- `probeLegacyChromeSockets` (`zmy`) - the `tengu_dead_probe_chrome_legacy_socket` emitter, `:267278`
- `getAllSocketPaths` (`H_s`) - legacy socket enumeration, `:267293`
- `installChromeNativeHostManifest` (`Wva`) - two-boolean first-install detection, `:664042`
- `writeScreenshotsToDisk` (`BFl`) - the new `save_to_disk` writer, `:43697`
- `resolveScreenshotSaveDir` (`tEh`) - memoised `0700` temp dir with per-use re-validation, `:43683`
