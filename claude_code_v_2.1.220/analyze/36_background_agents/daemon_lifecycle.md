# Background agents part 1 — the daemon: spawn, lock, handover, launcher, idle reaping

> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (872,596 lines, `VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`).
> Every bare `cli_inner_pretty.js:<line>` below is a **2.1.220** line that I read.
> Baseline citations are tagged `(193)` and come from
> `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.
> Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md). Ledger: [`README.md`](./README.md).

---

## 0. Map of the daemon

There is exactly one background supervisor ("daemon") per config dir. It owns:

| Artefact | Path helper | Line |
|---|---|---|
| `daemon.lock` | `daemonLockPath` (`pq`) | `:664707`, filename const `:664843` |
| `roster.json` (worker table) | see [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) | `:330213` |
| control socket | `jse()` (referenced at `:680471`) | — |
| per-job dir `~/.claude/jobs/<short>` | `jobDir` (`rc`) | `:330421` |

Three **origins** exist and they are load-bearing all the way through the code:
`"transient"` (a `claude agents` / `claude --bg` invocation cold-started it),
`"service"` (installed via launchd/systemd), `"foreground"` (`claude daemon run`).
Only `transient` daemons are eligible for idle exit (`:870738`), version takeover
(`:680303`) and yield (`:870677`).

---

## 1. The lock: identity, not just a PID

### 1.1 What the lock file carries in 2.1.220

Written at `:870580-870600` by `claude daemon run`:

```
pid, version, jsonPath, logPath, startedAt, origin, spawnedBy,
procStart, launchTarget, processWrapper
```

`launchTarget` and `processWrapper` are the two fields that make the rest of this document
possible: they let *any* client compare the running daemon's binary and corporate launcher
against its own without talking to the daemon.

**Precision on which of the two is new.** 2.1.193's writer already recorded `launchTarget`
(`launchTarget: h?.target`, `:717217 (193)`), so that field is **carryover**; the 193 record ends
there. `processWrapper: a9()` (`:870599`) is the only added lock field in this window — which is
consistent with `CLAUDE_CODE_PROCESS_WRAPPER` being 220=13 / 193=0 (§3).

### 1.2 Reading a lock is a three-way identity check — and that is CARRYOVER

`readVerifiedDaemonLock` (`QH`, `:664794-664804`) does: `kill(pid, 0)` →
`verifyDaemonCmdline` (`VAn`, `:664769-664778`, reads `/proc/<pid>/cmdline`) →
`procStartMatchesWithRetry` (`cAa`, `:664779-664787`).

**This is not new.** 2.1.193's `R0()` at `:501897-501907 (193)` is the same three-step check
(`process.kill(e.pid,0)` → `nDo` cmdline → `LC(e.pid, e.procStart)`). The scoping file rates
`.200` bullet 6 ("Bg agents never restarting after a stale `daemon.lock` whose PID the OS
reused") as a RICH delta on the `procStart` anchor (220=69 / 193=46), and the *count* is real,
but the three-way check itself is byte-equivalent carryover. The genuine fix is narrower and
sits in three places.

### 1.3 The real `.200` #6 fix — fail-open on a missing `procStart`

`procStartMatches` (`mB`, `:112404-112408`) starts with `if (t === void 0) return !0`. A lock
file **without** a `procStart` therefore *passes* verification unconditionally. In 2.1.193 the
lock writer was a single, un-retried, **cached** read:

```javascript
procStart: await fB(process.pid),          // :717216 (193)
```

`fB` (=`_L`) is the memoising reader (`:112415-112428`); on a miss it caches `undefined` for
`csg = 5000` ms (`:112476`). So a daemon that started during a transient `/proc` hiccup wrote
`procStart: undefined`, and from then on *every* liveness probe against that lock returned
"alive" — including after the OS recycled the PID. New daemons refused to start; background
agents never came back. Exactly the bullet.

2.1.220 changes three things:

**(a) The writer retries with the cache bypassed and says so out loud** (`:870572-870579`):

```javascript
// ============================================
// daemon self-identity probe with retry - writes a procStart-less lock only as a last resort
// Location: cli_inner_pretty.js:870572-870579
// ============================================

// ORIGINAL (for source lookup):
_ = await _L(process.pid);
if (_ === void 0) {
  if ((await vr(hYo), (_ = await _L(process.pid, { skipCache: !0 })), _ === void 0))
    d.write(
      "supervisor",
      "own process start-time probe failed twice \u2014 writing a procStart-less lock; kill paths will refuse to signal this daemon",
    );
}

// READABLE (for understanding):
ownProcStart = await readProcStartCached(process.pid);
if (ownProcStart === undefined) {
  await delay(PROC_START_RETRY_DELAY_MS);                                  // 250 ms
  ownProcStart = await readProcStartCached(process.pid, { skipCache: true });
  if (ownProcStart === undefined)
    daemonLog.write("supervisor",
      "own process start-time probe failed twice — writing a procStart-less lock; " +
      "kill paths will refuse to signal this daemon");
}

// Mapping: _→ownProcStart, _L→readProcStartCached, hYo→PROC_START_RETRY_DELAY_MS(250, :664845),
//          vr→delay, d→daemonLog
```

**(b) Every *signalling* path now demands the identity field.** The predicate is a one-liner:

```javascript
function Y0r(e) { return e.procStart !== void 0; }        // :664788-664790
```

`lockHasProcStartIdentity` (`Y0r`) gates the SIGTERM in `claude daemon stop` (§4), the
stale-daemon retire (`:680348`) and the zombie restart (`:680459`). The three refusal strings
are all 220=1…2 / 193=0:

| String | 220 | 193 | line |
|---|---:|---:|---|
| `could not be verified as the daemon, so it was not signalled` | 2 | **0** | `:664829`, `:871860` |
| `has no procStart identity` | 1 | **0** | `:680348` |
| `identity unverifiable (no procStart)` | 1 | **0** | `:680461` |

**(c) Verification retries.** `QH` gained an attempts parameter (`QH(e = 1)`, `:664794`) and
`cAa` loops it:

```javascript
async function cAa(e, t, r) {                 // :664779-664787
  if (t === void 0) return !0;
  for (let n = 0; n < r; n++) {
    if (n > 0) await vr(hYo);                 // 250 ms between attempts
    let o = await _L(e, { skipCache: n > 0 });// first attempt may use the cache
    if (o !== void 0) return o === t;
  }
  return !1;                                  // <- fail CLOSED after r inconclusive reads
}
```

Note the asymmetry that makes this safe: a *single* inconclusive read still fails open
(`mB`), but the **retrying** variant fails **closed** (`return !1`) once it has burned `r`
attempts. Startup uses `zAn = 2` (`:664844`, e.g. `:870607`, `:870645`); the generic reader
defaults to 1 so that hot paths (status, `ensure`) stay cheap.

**Why 2 attempts and 250 ms?** `/proc/<pid>/stat` either exists or does not; the only realistic
failure is a momentary EACCES/ENOENT while the kernel tears a process down or a container
remounts `/proc`. One retry after a quarter second covers that without adding a visible stall
to `claude agents` startup. A larger number would make the lock-race path (which runs before
the control socket is up) noticeably slower for no extra certainty.

### 1.4 Where `procStart` comes from

`readProcStartUncached` (`dsg`, `:112437-112452`) reads `/proc/<pid>/stat`, slices past the
**last** `)` (the `comm` field may itself contain spaces and parens) and takes token index 19 —
which, after dropping `pid` and `(comm)`, is `proc(5)` field 22, `starttime` in clock ticks.
That is monotonic per boot and never reused, so `(pid, starttime)` is a genuine process identity.

A `ps -o lstart=` fallback follows the block but is **unreachable** — the preceding `{ … return … }`
always returns. The identical dead branch is present at `:104011-104026 (193)`, so this is a
pre-existing bundler artefact of a compiled-out platform branch, **not** a 2.1.220 regression.

Caching: hits live `lsg = 60000` ms, misses `csg = 5000` ms (`:112475-112476`). The short miss TTL
is what makes the `skipCache` retry in `cAa` meaningful — without it a cached miss would pin the
answer for a minute.

---

## 2. Handover: version recency judged by the embedded build timestamp

### 2.1 The comparator family (NET-NEW)

`-(?:dev|engine)\.(\d{8})\.t(\d{6})` is **220=1 / 193=0** at `:552455`. It is the core of a
five-function comparator family introduced in `.200`:

```javascript
// ============================================
// parseEmbeddedBuildTimestamp - turns "2.1.220-dev.20260724.t221745" into epoch ms
// Location: cli_inner_pretty.js:552453-552468
// ============================================

// ORIGINAL (for source lookup):
function rUt(e) {
  let t;
  for (let a of e.matchAll(/-(?:dev|engine)\.(\d{8})\.t(\d{6})(?:\.|$)/g)) t = a;
  let r = t?.[1], n = t?.[2];
  if (!r || !n) return null;
  let o = Date.UTC(Number(r.slice(0,4)), Number(r.slice(4,6)) - 1, Number(r.slice(6,8)),
                   Number(n.slice(0,2)), Number(n.slice(2,4)), Number(n.slice(4,6)));
  return new Date(o).toISOString().slice(0,19).replace(/[-:]/g,"").replace("T","t") === `${r}t${n}` ? o : null;
}

// READABLE (for understanding):
function parseEmbeddedBuildTimestamp(versionString) {
  let lastMatch;                                              // take the LAST match, not the first
  for (const m of versionString.matchAll(/-(?:dev|engine)\.(\d{8})\.t(\d{6})(?:\.|$)/g)) lastMatch = m;
  const datePart = lastMatch?.[1], timePart = lastMatch?.[2];
  if (!datePart || !timePart) return null;                    // not a timestamped prerelease
  const epochMs = Date.UTC(+datePart.slice(0,4), +datePart.slice(4,6) - 1, +datePart.slice(6,8),
                           +timePart.slice(0,2), +timePart.slice(2,4), +timePart.slice(4,6));
  // round-trip check: reject 20261332 / t256199 etc., which Date.UTC would silently roll over
  const roundTrip = new Date(epochMs).toISOString().slice(0,19)
                      .replace(/[-:]/g, "").replace("T", "t");
  return roundTrip === `${datePart}t${timePart}` ? epochMs : null;
}

// Mapping: rUt→parseEmbeddedBuildTimestamp, e→versionString, t→lastMatch, r→datePart, n→timePart, o→epochMs
```

Two design details worth stating:

1. **Last match wins.** A version string can legitimately contain more than one `-dev.…` chunk
   (a rebuild of a prerelease). Taking the last one means the most recently appended stamp
   decides recency.
2. **The round-trip is the validation.** `Date.UTC(2026, 12, 33, …)` does not throw, it rolls
   over into the next month. Re-formatting and string-comparing is the cheapest way to reject a
   crafted or corrupted version string without a second parser. On failure the function returns
   `null`, which every caller treats as "not comparable" → **no handover** (see §2.2).

Built on top of it:

| Function | Line | Meaning |
|---|---|---|
| `prereleaseChannelOf` (`ugt`) | `:552441` | `"dev"` / `"engine"` / `null` (`PRERELEASE_CHANNELS` at `:552486`) |
| `isPrereleaseBuild` (`fhn`) | `:552444` | channel !== null |
| `channelsDiffer` (`iSr`) | `:552447` | both are prereleases **and** on different channels |
| `isOlderBuild` (`hhp`) | `:552469` | `t`'s stamp is strictly before `e`'s |
| `isNewerBuild` (`mhn`) | `:552474` | see below |

```javascript
function mhn(e, t) {                      // :552474-552483
  let r = rUt(e), n = rUt(t);
  if (r !== null && n !== null) {
    if (ugt(e) !== ugt(t)) return !1;     // never compare dev against engine
    return r > n;
  }
  if (fhn(e) || fhn(t)) return !1;        // one side is a prerelease we cannot date -> refuse
  return phn.valid(e) !== null && phn.valid(t) !== null && phn.gt(e, t);   // else plain semver
}
```

**Why this shape?** Released builds are ordered by semver, but internal `dev`/`engine` builds
all carry the *same* semver (`2.1.220-dev.…`) and differ only by timestamp. A single semver
comparison would call two different internal builds equal and let an arbitrary one win a
handover. The three-tier rule — same-channel timestamps first, refuse cross-channel, semver
last — is the minimum that (a) orders internal builds correctly, (b) never lets a `dev` build
displace an `engine` build or vice versa, and (c) still handles the normal released case.
The refusal on any un-dateable prerelease is deliberately conservative: an unknown prerelease
is treated as *incomparable*, not as *older*.

### 2.2 Client-side takeover: a newer binary retires a stale transient daemon

`shouldClientRetireDaemonByVersion` (`Jjb`, `:680302-680318`) re-implements the `mhn` ladder
against a descriptor instead of two strings, with three cheap pre-filters first:

```javascript
if (e.daemonOrigin !== "transient") return !1;         // never displace a service/foreground daemon
if (e.daemonVersion === e.clientVersion) return !1;    // same version string -> nothing to gain
if (e.daemonTarget === e.clientTarget) return !1;      // same binary on disk -> nothing to gain
```

The `daemonTarget === clientTarget` test is the interesting one: two *different* version strings
resolving to the *same* executable path means the daemon simply has a stale `VERSION` constant
baked into a binary that has since been replaced in place; killing it would gain nothing that
the upgrade poller (§5) is not already doing.

`maybeRetireStaleDaemon` (`Qjb`, `:680319-680407`) then runs the full gauntlet before it will
kill anything:

1. `PE() !== null` → the corporate launcher is misconfigured → refuse (`:680320`).
2. Gate `tengu_bg_binary_takeover` (220=1 / **193=1** — *carryover gate*) (`:680321`).
3. Either the version differs (`n`) or `shouldRetireUnwrappedDaemon` says yes (`o`, §3.4).
4. `await o6()` — the launcher must actually be runnable *now* (`:680336`).
5. Not inside a nested-config situation (`Ccf`, `:680337`, `:680486-680489`).
6. If the service-install prompt is still pending, do not surprise the user (`:680338`).
7. `realpath` of our own launch target must resolve (`:680339`).
8. Our self-exec command must be an executable file, else try the pinned-binary variant
   (`:680341-680345`).
9. Read the lock; **`Y0r(a)` must hold** — a lock with no `procStart` is never signalled
   (`:680348`).
10. `Jjb(...)` on the real lock values (`:680349-680366`).
11. `terminateAndWait` (`K0r`) with a SIGKILL escalation, and the outcome must be `"exited"`
    (`:680383-680390`).

Only then does it log (`:680393-680398`) and emit `tengu_bg_daemon_binary_takeover`
(220=1 / **193=1**, carryover event) with `daemon_age_ms`, `via_prefix`, `via_version`.

**Key insight:** the *decision* is new (timestamp recency, launcher-prefix skew) but the
*mechanism* (binary takeover of a transient daemon) is carryover from 2.1.193. Do not write the
takeover up as an introduction.

### 2.3 Server-side refusal: an older binary must not win an upgrade restart

The daemon polls its own binary and self-restarts when it changes. `.208` #40 and `.203` #14
added a recency guard to that poller (`:870685-870731`):

```javascript
if (ee !== null && hhp(y.target, ee.target) && Ke("tengu_daemon_refuse_stale_upgrade", !0)) {
  // :870697-870705
  ... `binary at ${g} changed to an OLDER build (${y.target} \u2192 ${ee.target}) \u2014 refusing
       self-restart for upgrade; keeping the running build (\`claude daemon stop --any\` to override)`
  O("tengu_daemon_upgrade_refused_stale_binary", {});
  return !1;
}
```

`tengu_daemon_refuse_stale_upgrade` is **220=1 / 193=0** (`:870697`);
`tengu_daemon_upgrade_refused_stale_binary` is **220=2 / 193=0** (`:537443` in the event
allow-list, emitter at `:870704`).

Note the ordering: `CSE(y, ee)` ("did the binary actually change?", `:870496-870499`) runs
first at `:870696`, then the recency refusal, then the launcher-runnability defer (§3.5), then
the actual restart. Cheapest test first, and each refusal is *sticky-logged* via `R` / `H`
so a permanently-downgraded install logs once per state change rather than once per poll.

**The escape hatch is named in the message**: `claude daemon stop --any`. The design says
"we will never silently downgrade your running daemon, but we will tell you exactly how to
force it". That is the same philosophy as the worker-side downgrade refusal
(see [`worker_respawn_and_upgrade.md`](./worker_respawn_and_upgrade.md) §2).

### 2.4 Upgrade self-respawn that never becomes reachable

After deciding to restart, the daemon spawns its successor and waits `GX = 45000` ms
(`:680522`) for a `ping` to succeed (`waitForDaemonPing`, `AJe`, `:680053-680060`). If the
successor never answers (`:871980-871997`):

```
`upgrade self-respawn ${s} — bg workers may be orphan-reaped ~60s after this process exits
 unless a client restarts the daemon (run \`claude agents\`)` [+ `; successor stderr: …`]
O("tengu_daemon_upgrade_respawn_unreachable", { stderr_captured: … })
```

`tengu_daemon_upgrade_respawn_unreachable` is **220=1 / 193=0** (`:871997`). The successor's
stderr is captured from a temp file, read up to 1 MiB and tailed to 2000 chars (`:871986`) —
the same breadcrumb pattern used for worker spawns (§3.2). The `~60s` in the message is
`SWEEP_INTERVAL_MS` (`d$n = 60000`, `:870133`): the orphan reaper runs once per sweep.

This is the anchor for `.195` #9 ("Background agent daemons running unreachable when the
control socket fails to start") *in part*; the other half of that bullet is §6.

---

## 3. `CLAUDE_CODE_PROCESS_WRAPPER` — the corporate launcher (fully NET-NEW)

`CLAUDE_CODE_PROCESS_WRAPPER` is **220=13 / 193=0**; the settings key `processWrapper` is
**220=16 / 193=0**. This is the single largest net-new surface in the theme.

### 3.1 Two entry points, one precedence rule

The zod field lives in the settings schema at `:60628-60633`, and its `.describe()` text is the
spec:

> "Corporate launcher argv prefix for the background-agent supervisor, the sessions and workers
> it hosts, and the other covered background processes … Equivalent to the
> `CLAUDE_CODE_PROCESS_WRAPPER` environment variable, **which takes precedence when set**.
> Honored from managed settings, a `--settings`/SDK-supplied settings file, and user settings,
> **in that precedence order; project and local settings are ignored**."

The promotion from settings into the environment is at `:267849-267857`:

```javascript
let t = process.env[DN];
if (!t || t === N_s) {                                  // unset, or still OUR last promoted value
  let r = [
    Pr("policySettings")?.processWrapper,                // managed settings  (highest)
    Pr("flagSettings")?.processWrapper,                  // --settings / SDK
    pg("userSettings") ? Pr("userSettings")?.processWrapper : void 0,   // ~/.claude/settings.json
  ].find((n) => typeof n === "string" && n !== "");
  if (r !== void 0) ((process.env[DN] = r), (N_s = r));
}
```

**Why `t === N_s`?** Settings can be re-read mid-session. Without the memo, a re-read would see
the env var *it itself set* and treat it as an operator override, permanently pinning the first
value. Comparing against `N_s` distinguishes "the user exported this" from "we promoted this
last time", so a settings change still takes effect. `N_s` is cleared by the reset hook at
`:267862`.

**Why are project/local settings excluded?** The launcher is an argv prefix prepended to every
self-spawn — i.e. arbitrary code execution. A repository must not be able to inject one by
committing `.claude/settings.json`. `pg("userSettings")` additionally lets `--setting-sources`
disable even the user file.

### 3.2 Parsing: an argv list, not a shell command

`parseProcessWrapperArgv` (`Xmy`, `:267586-267641`) accepts two forms:

- **JSON array**: value starts with `[` → `["/opt/corp/launch","--mode","strict"]`. Rejects
  non-arrays, non-string members, and (crucially) an array containing an empty element —
  with the message *"the JSON array contains an empty element — remove it, or fill in the value
  it was a placeholder for"* (`:267600-267602`). An all-empty array means "no launcher".
- **Quoted string**: a hand-rolled tokeniser with `"…"` support and `\"`/`\\` escapes, which
  **throws on any unquoted shell metacharacter**:

```javascript
if (Ymy.includes(a))
  throw Error("the value contains an unquoted shell metacharacter (one of ; | & $ ( ) ` < >) \u2014 it is an argv list, not a shell command");
```

That single error message (`:267626-267629`) is the whole security model stated out loud: the
value is `execve` argv, never `/bin/sh -c`. There is no shell, so `$(…)`/`;`/`|` cannot mean
anything, and refusing them prevents an operator from *believing* they do.

### 3.3 Validation: five refusals, all fail-closed

`validateProcessWrapper` (`Kmy`, `:267559-267582`):

```javascript
// ============================================
// validateProcessWrapper - decide whether a configured launcher may be used
// Location: cli_inner_pretty.js:267559-267582
// ============================================

// ORIGINAL (for source lookup):
function Kmy(e) {
  if (Mt() === "windows") return { argv: [], error: null, platformIgnored: !0, record: "" };
  let t;
  try { t = Xmy(e); } catch (n) { return elr(n instanceof Error ? n.message : String(n)); }
  if (t.length === 0) return elr("the value is set but contains no launcher \u2014 unset the variable to run without one, or set it to the absolute path of your launcher");
  let r = t[0];
  if (r === process.execPath || r === uyo.join(uEe(), "claude"))
    return elr(`launcher \`${r}\` is Claude Code's own launch path \u2014 point ${DN} at your launcher, not at claude`);
  if (!uyo.isAbsolute(r)) return elr("the launcher must be an absolute path, not a bare name resolved via PATH");
  try {
    let n = lyo.statSync(r);
    if (!n.isFile() || (n.mode & 73) === 0) return elr(`launcher \`${r}\` is not an executable regular file`);
  } catch { return elr(`launcher \`${r}\` does not exist or is not readable`); }
  return { argv: t, error: null, platformIgnored: !1, record: t.map((n) => (/[\s"]/.test(n) ? Ie(n) : n)).join(" ") };
}

// READABLE (for understanding):
function validateProcessWrapper(rawValue) {
  if (platform() === "windows")
    return { argv: [], error: null, platformIgnored: true, record: "" };   // Windows cannot exec-replace
  let argv;
  try { argv = parseProcessWrapperArgv(rawValue); }
  catch (e) { return processWrapperConfigError(e.message); }
  if (argv.length === 0) return processWrapperConfigError("the value is set but contains no launcher …");
  const launcher = argv[0];
  if (launcher === process.execPath || launcher === join(userLocalBinDir(), "claude"))
    return processWrapperConfigError(`launcher \`${launcher}\` is Claude Code's own launch path …`);
  if (!isAbsolute(launcher))
    return processWrapperConfigError("the launcher must be an absolute path, not a bare name resolved via PATH");
  try {
    const st = statSync(launcher);
    if (!st.isFile() || (st.mode & 0o111) === 0)                            // 73 === 0o111
      return processWrapperConfigError(`launcher \`${launcher}\` is not an executable regular file`);
  } catch { return processWrapperConfigError(`launcher \`${launcher}\` does not exist or is not readable`); }
  return { argv, error: null, platformIgnored: false,
           record: argv.map((a) => (/[\s"]/.test(a) ? jsonQuote(a) : a)).join(" ") };
}

// Mapping: Kmy→validateProcessWrapper, Xmy→parseProcessWrapperArgv, elr→processWrapperConfigError,
//          Mt→platform, uEe→userLocalBinDir, lyo→fs, uyo→path, Ie→jsonQuote, DN→PROCESS_WRAPPER_ENV
```

Each refusal exists for a distinct failure mode:

- **self-reference** — pointing the wrapper at `claude` would produce infinite self-wrapping.
- **relative path** — `PATH` differs between the dispatching shell, the daemon and the worker
  (that is the whole subject of
  [`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §4), so a bare name would
  resolve differently in each. Requiring absolute paths removes the class.
- **not an executable regular file** — `(mode & 0o111) === 0` catches a file that exists but has
  lost its `+x` bit, which is the common outcome of a package redeploy.
- **Windows** — the launcher contract requires the launcher to `exec`-replace itself with
  Claude Code, which Windows cannot do; `platformIgnored` makes that a *warning*, not an error
  (`:267518-267522`), so Windows fleets are not bricked by a cross-platform managed setting.

The whole result is memoised on the raw string (`R_s` / `Iut`, `:267511-267513`) so that
`$Qr()` can be called freely on hot paths, and the error is logged only when it *changes*
(`Iut.error !== t`, `:267513`) — otherwise a permanently broken launcher would spam the log
once per call.

### 3.4 Fail-closed everywhere: refuse rather than run unwrapped

The rule is stated identically in four places. `resolveProcessWrapper` (`$Qr`, `:267515`):

> "`CLAUDE_CODE_PROCESS_WRAPPER` is set but can't be used — **self-spawns that require it will
> refuse to start rather than run unwrapped**"

Enforcement points:

| Site | Line | Behaviour |
|---|---|---|
| daemon spawn | `:679802-679815` | `spawnDaemonProcess` returns an error before doing anything |
| worker spawn | `:554318-554325` | `tengu_bg_launcher_worker_refused`, worker settles `crashed` |
| session relaunch | `:501785-501795` | throws; "this session was left running" |
| `claude daemon status` | `:666078-666081` | prints the self-exec line and the refusal reason |

The last one is worth quoting because it names the exact operational consequence
(`:666080`):

> "The launcher `…` cannot run right now (deleted or not executable) — new background sessions
> are refused until it is restored; **a background service that validated it earlier keeps
> serving its existing sessions** (`claude daemon status`)"

That is a deliberate split: validation happens at *spawn* time, not continuously, so a launcher
that disappears does not kill running work — it only blocks new work.

### 3.5 Launcher skew and the "raw daemon is back" detector

Because the wrapper is recorded in the lock (`processWrapper: a9()`, `:870599`) and echoed in
the control-socket `nudge` reply (`:679262`), a client can detect three distinct skews:

1. **Daemon runs unwrapped, we have a wrapper** → `shouldRetireUnwrappedDaemon`
   (`Zjb`, `:680408-680424`) → retire it so the replacement runs through the launcher. The
   log at `:680396` says exactly that: *"…predates `CLAUDE_CODE_PROCESS_WRAPPER` and spawns
   sessions unwrapped — retired it so the replacement runs through the configured launcher"*.
2. **We already took over and a raw daemon is running again** → the single best diagnostic
   string in the module (`:680415`, `tengu_bg_launcher_replacement_raw`, 220=1 / 193=0):

   > "a raw *daemon* is running again after this session's launcher-driven restart. **Two causes
   > look identical from here**: a claude session started BEFORE `CLAUDE_CODE_PROCESS_WRAPPER`
   > was deployed cold-started it (restart those sessions), or the launcher does not pass that
   > variable through in the environment it hands to `exec` (**launcher contract #3**).
   > Sessions dispatched to it run unwrapped either way; `claude daemon status` shows the
   > launcher it records."

   `launcher contract #3` is 220=1 / 193=0. The `cJo` state machine (`"idle"` →
   `"attempted"` → `"took-over"`, `:680524`) plus the `wcf` once-flag ensures this fires once
   per process, and `Zjb` returns `!1` afterwards so the client does not loop retiring daemons.
3. **Different launcher strings** → `noteWrapperSkew` (`xcf`, `:680509-680514`) reports
   `served_by_skewed_wrapper`; `claude daemon status` prints
   *"restart it — and your running claude sessions — to apply the current
   `CLAUDE_CODE_PROCESS_WRAPPER`"* (`:871915-871919`).

And the upgrade poller defers rather than breaks (`:870713-870719`):

> "binary at … changed but `CLAUDE_CODE_PROCESS_WRAPPER` cannot be used (…) — deferring the
> upgrade restart until it is fixed (**re-checked every poll**)"
> → `$e("agent_launcher", "upgrade_deferred_launcher_unrunnable")`

**Key insight:** the whole feature is designed around the assumption that the launcher is
deployed by a fleet-management tool and can therefore be *momentarily* absent. Every decision
is "defer and re-check", never "fall back to unwrapped".

---

## 4. `claude daemon stop --any` and the stale legacy lockfile (the `.216` #11 security fix)

`.216` #11: *"`claude daemon stop --any` terminating an unrelated process via a stale legacy
lockfile."* The scoping file rates this DELTA on `daemon stop --any` (220=6 / 193=3). Here is
the proof, and it is a textbook fail-open bug.

**2.1.193** (`:718011-718038 (193)`):

```javascript
d = await zJ(),            // service installed?
p = await R0();            // verified lock  <-- passes when procStart is ABSENT (mB/LC fail-open)
...
} else if (p && Wt() !== "windows")
  try { process.kill(p.pid, "SIGTERM"), (m = !0); }        // :718038 (193)
```

A `daemon.lock` written by a build that never recorded `procStart` (or by the 193 writer whose
probe silently missed, §1.3) satisfied `R0()` as soon as the PID happened to be alive. After a
reboot or a PID wrap, that PID belongs to something else — and `claude daemon stop --any`
SIGTERMs it.

**2.1.220** (`:871793-871868`) splits the holder into three variables and only ever signals the
verified one:

```javascript
// ============================================
// `claude daemon stop` holder classification - only a procStart-verified holder is signalled
// Location: cli_inner_pretty.js:871793-871807, 871835-871837, 871856-871865
// ============================================

// ORIGINAL (for source lookup):
p = await swe(),
f = await QH(),
m = f && Y0r(f) ? f : null,
g = f,
y;
if (!g) {
  let T = await jAe();
  if (T && HT(T.pid)) {
    let C = await VAn(T.pid),
      I = C ? await _L(T.pid, { skipCache: !0 }) : void 0,
      R = T.procStart !== void 0 && I !== void 0;
    if (!C || (R && I !== T.procStart)) y = T.pid;
    else if (R) ((m = T), (g = T));
    else g = T;
  }
}
... } else if (m && Mt() !== "windows") try { (process.kill(m.pid, "SIGTERM"), (E = !0)); }
... if (!E && !m && g) return ($b(... `pid=${g.pid} is holding ${pq()} but could not be verified as the daemon, so it was not signalled. ...`), d(!1, b, "daemon_stop_holder_unverified"));
... if (y !== void 0) $b(`note: ${pq()} is stale (pid=${y} is not the daemon). The next daemon start reclaims it automatically.`);

// READABLE (for understanding):
const serviceInstalled = await isServiceInstalled();
const verifiedLock      = await readVerifiedDaemonLock();
let signallable = verifiedLock && lockHasProcStartIdentity(verifiedLock) ? verifiedLock : null;
let anyHolder   = verifiedLock;
let staleLockPid;
if (!anyHolder) {                             // verified read said "nobody" — look closer
  const raw = await readDaemonLockRaw();
  if (raw && isPidAlive(raw.pid)) {
    const cmdlineOk = await verifyDaemonCmdline(raw.pid);
    const liveStart = cmdlineOk ? await readProcStartCached(raw.pid, { skipCache: true }) : undefined;
    const comparable = raw.procStart !== undefined && liveStart !== undefined;
    if (!cmdlineOk || (comparable && liveStart !== raw.procStart)) staleLockPid = raw.pid;  // PID reused
    else if (comparable) { signallable = raw; anyHolder = raw; }                            // provably ours
    else anyHolder = raw;                                                                   // unverifiable
  }
}
// … only `signallable` is ever SIGTERMed; `anyHolder` yields a report; `staleLockPid` yields a note.

// Mapping: p→serviceInstalled, f→verifiedLock, m→signallable, g→anyHolder, y→staleLockPid,
//          swe→isServiceInstalled, QH→readVerifiedDaemonLock, Y0r→lockHasProcStartIdentity,
//          jAe→readDaemonLockRaw, HT→isPidAlive, VAn→verifyDaemonCmdline, _L→readProcStartCached
```

The three outcomes:

| Classification | Action | Line |
|---|---|---|
| `signallable` (procStart matches) | SIGTERM (POSIX) / `taskkill` advice (Windows) | `:871837`, `:871847-871855` |
| `anyHolder` only (no comparable identity) | **report, do not signal**; telemetry `daemon_stop_holder_unverified` | `:871856-871863`, `:871788` |
| `staleLockPid` (cmdline wrong or start-time differs) | print "the lock is stale, the next daemon start reclaims it" | `:871864-871865` |

The workers are still reaped in every branch (`s7s()` at `:871820`/`:871845`), so the *user's
intent* ("stop my background sessions") is honoured even when the supervisor cannot be
identified. That is the trade-off: the command becomes weaker (it can now fail to stop a
daemon) in exchange for never killing a stranger's process. The new advice string at
`:664792` — *"Stop it with `claude daemon stop --any` (a graceful, socket-based stop); if
nothing is running at that pid, delete `<lock>`"* — makes the manual recovery explicit.

Related net-new classifications from the same push: `not-stopped` (220=8 / 193=0),
`unknown-origin` (220=4 / 193=0), `describeUnstoppedHolder` (`Hbt`, `:664824-664833`) and
`describeUnknownOriginHolder` (`gYo`, `:664834-664836` — *"a background daemon with an
unrecognized origin (pid …) holds the daemon lock — it may have been started by a newer Claude
Code, so it was left untouched"*). Forward compatibility as a first-class case.

---

## 5. Spawning the daemon: a five-rung fallback ladder

`spawnDaemonProcess` (`lJo`, `:679802-679866`) is the only place a daemon is created. Order
matters, so here it is in order:

1. **Launcher gate** (`:679803-679815`) — misconfigured or unrunnable → return an error.
2. **Env construction** (`Kjb`, `:680015-680033`) — see §5.3.
3. **Windows: WMI first** (`:679820-679833`). `windowsWmiSpawn` (`Gjb`, `:679946-679983`)
   builds a PowerShell script (`Wjb`, `:679985-679993`) that calls
   `Invoke-CimMethod -ClassName Win32_Process -MethodName Create` with
   `CreateFlags = 8` (`DETACHED_PROCESS`) and an explicit `EnvironmentVariables` array,
   base64-encodes it as UTF-16LE and runs it with `-NoProfile -NonInteractive -EncodedCommand`
   under a 5 s timeout. On failure it logs *"WMI spawn failed (…); falling back to direct spawn
   — daemon will not survive SSH/terminal close"* and emits `tengu_bg_daemon_wmi_fallback`.
   **This whole path is carryover** — `Win32_Process` is 220=4 / **193=4** and
   `tengu_bg_daemon_wmi_fallback` is 220=2 / **193=2**.
4. **macOS: the aqua wrap probe** (§5.1).
5. **The target ladder** (`:679840-679862`): configured launcher → `process.execPath` +
   `argv[1]` → pinned-current-binary variant (`tengu_bg_daemon_spawn_execpath_fallback`) →
   `~/.local/bin/claude` (`tengu_bg_daemon_spawn_launcher_fallback`, **220=1 / 193=0**,
   `:679855`) → newest binary in the versions dir (`tengu_bg_daemon_spawn_versions_fallback`).
   Each rung is tried only if it is a *new* target (`m = new Set([i])`, `:679844`) and only
   when the previous attempt failed with `ENOENT`/`EACCES`.

`spawnDetached` (`xTn`, `:679899-679915`) is the primitive: `detached: true`,
`stdio: ["ignore","ignore", <breadcrumb fd>]`, `windowsHide: true`, `unref()`, and — the neat
part — `await new Promise((o) => setImmediate(o))` so that a synchronously-delivered `"error"`
event is captured before the function returns. Without that microtask hop, an `ENOENT` from
`spawn` would arrive after the caller had already decided the spawn succeeded, and the whole
fallback ladder would be dead code.

A `cc-daemon-*` temp dir holds `stderr.log` (`:679836-679838`) so that a daemon which dies
before it can open its own log still leaves a breadcrumb.

### 5.1 macOS: `launchctl asuser` (NET-NEW)

`tengu_bg_daemon_macos_aqua_wrap` is **220=1 / 193=0** (`:679939`). The bullet is `.199` #7:
*"Bg agents failing to cold-start over SSH on macOS (`Could not switch to audit session`)."*

```javascript
// ============================================
// macosAquaWrapPrefix - probe whether launchctl can reach this uid's GUI session
// Location: cli_inner_pretty.js:679917-679939
// ============================================

// ORIGINAL (for source lookup):
async function jjb() {
  let e = process.getuid?.();
  if (e === void 0) return [];
  let t = await new Promise((r) => {
    let n = !1, o, i = (a) => { if (n) return; ((n = !0), clearTimeout(s), r(a)); },
      s = setTimeout(() => { (o.kill(), i(!1)); }, 5000);
    s.unref();
    try { o = aJo.spawn("/bin/launchctl", ["asuser", String(e), "/usr/bin/true"], { stdio: "ignore", windowsHide: !0 }); }
    catch { i(!1); return; }
    (o.once("error", () => i(!1)), o.once("exit", (a) => i(a === 0)));
  });
  return (O("tengu_bg_daemon_macos_aqua_wrap", { has_gui: t }), t ? ["/bin/launchctl", "asuser", String(e)] : []);
}

// READABLE (for understanding):
async function macosAquaWrapPrefix() {
  const uid = process.getuid?.();
  if (uid === undefined) return [];                       // non-POSIX: nothing to do
  const hasGuiSession = await new Promise((resolve) => {
    let done = false, child;
    const finish = (ok) => { if (done) return; done = true; clearTimeout(timer); resolve(ok); };
    const timer = setTimeout(() => { child.kill(); finish(false); }, 5000);
    timer.unref();
    try {
      // cheapest possible capability probe: can launchctl put /usr/bin/true in this uid's Aqua session?
      child = spawn("/bin/launchctl", ["asuser", String(uid), "/usr/bin/true"],
                    { stdio: "ignore", windowsHide: true });
    } catch { finish(false); return; }
    child.once("error", () => finish(false));
    child.once("exit", (code) => finish(code === 0));
  });
  emitTelemetry("tengu_bg_daemon_macos_aqua_wrap", { has_gui: hasGuiSession });
  return hasGuiSession ? ["/bin/launchctl", "asuser", String(uid)] : [];
}

// Mapping: jjb→macosAquaWrapPrefix, e→uid, t→hasGuiSession, aJo→child_process, O→emitTelemetry
```

**Why probe instead of detect?** The naive alternatives are all wrong on some machine:
checking `SSH_TTY` misses `screen`/`tmux` inside an SSH session; checking
`launchctl managername` requires parsing localised output; assuming "GUI unless SSH" breaks
under `sudo -u`. Running `/usr/bin/true` through the exact wrapper you intend to use answers
the exact question — *will this wrapper work?* — in one syscall's worth of work, and its exit
code is unambiguous.

`applyAquaWrapPrefix` (`kTn`, `:679941-679944`) has a second guard that matters:

```javascript
if (e.length === 0) return t;
if (!(await dGt(t[0]))) return t;      // if the payload itself is not executable, do NOT wrap
return [...e, ...t];
```

Wrapping a non-executable payload would turn a clear `ENOENT` from `spawn` into an opaque
`launchctl` exit code, defeating the ladder in §5 rung 5, which branches on `Bt(p) === "ENOENT"`.
So the wrapper is skipped precisely when the error message matters most.

### 5.2 Windows PowerShell resolution — the `.212` #11 bullet is *mostly* carryover

`.212` #11: *"`/background` / `claude --bg` uv_spawn failure on Windows; daemon prefers
PowerShell 7."*

The **preference order is carryover.** 2.1.220 `:168556-168564` and 2.1.193 `:299416-299424`
are line-for-line equivalent: `pwsh` on `PATH` → `%ProgramFiles%\PowerShell\7\pwsh.exe` →
`%LOCALAPPDATA%\Microsoft\WindowsApps\pwsh.exe` → `%USERPROFILE%\.dotnet\tools\pwsh.exe` →
`powershell` on `PATH`. Do not write "prefers PowerShell 7" up as new.

The **real delta is one added last resort** (220 `:168568-168572`; 193 returns `null` at
`:299428`):

```javascript
if (Mt() === "windows") {
  let r = Z.SYSTEMROOT ?? "C:\\Windows",
    n = await mrr(G9r.join(r, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"));
  if (n) return ($e("shell_powershell_detect", "fell_back_to_powershell_5"), n);
}
```

**Do not measure this delta by its telemetry reason string.** `fell_back_to_powershell_5` is
**220=2 / 193=1** — the *same* reason token is emitted by the pre-existing `powershell`-on-`PATH`
rung (220 `:168567`, 193 `:299427`) and by the new absolute-path rung (220 `:168571`). A
count-only check therefore reports "+1 occurrence" and tells you nothing about which rung is new;
the only reliable evidence is that 193's function *returns `null`* on the next line (`:299428`)
where 220 opens a new `if (Mt() === "windows")` block. Read the two function bodies
(`d$g`, 220 `:168540-168574`; `Vfp`, 193 `:299400-299429`) — they are otherwise rung-for-rung
identical.

That is the failure the bullet describes: on a locked-down Windows image where neither `pwsh`
nor `powershell` is on the daemon's `PATH`, `windowsWmiSpawn` got
`{ ok:false, reason:"no-powershell" }` from `OZ()` (`:679953-679954`) and the whole WMI rung
was skipped — leaving a direct `spawn` that could not survive terminal close (and, upstream,
a raw `uv_spawn` error). Resolving Windows PowerShell 5.1 by absolute path under `%SYSTEMROOT%`
closes it. Note that the daemon's `PATH` is inherited from whatever dispatched it, which is
exactly the class of problem documented in
[`session_store_and_worktrees.md`](./session_store_and_worktrees.md) §4.

### 5.3 The daemon's environment is scrubbed, not inherited

`buildDaemonSpawnEnv` (`Kjb`, `:680015-680033`):

```javascript
let e = { ...process.env, INVOCATION_ID: "" };
delete e.CLAUDECODE; delete e.CLAUDE_CODE_SESSION_ID; delete e.CLAUDE_CODE_CHILD_SESSION;
delete e.CLAUDE_CODE_BRIDGE_SESSION_ID; delete e.CLAUDE_BG_AUTH_SNAPSHOT_PATH;
```

- `INVOCATION_ID: ""` — systemd sets this inside a unit. Clearing it stops the daemon from
  being mistaken for (or accounted to) the unit that happened to spawn it.
- The five deletions all identify *the dispatching session*. A daemon that inherited
  `CLAUDE_CODE_SESSION_ID` would report itself as that session and its children would inherit
  a session identity they do not own.
- If `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` is set, the entire host-managed provider auth
  surface is stripped (`:680023-680027`): three named env lists plus
  `ANTHROPIC_CUSTOM_HEADERS`, the host auth var, and the two marker vars themselves.
- On **non-macOS**, `CLAUDE_CODE_OAUTH_TOKEN` and its file-descriptor sibling are dropped when a
  refresh token is available from the credential store (`:680028-680031`). Rationale: a
  long-lived daemon must re-derive access tokens rather than carry a snapshot that will expire;
  macOS is excluded because keychain access from a detached process is unreliable, so there the
  snapshot is the only option (and see `writeAuthSnapshot`, `:553452-553465`, which is
  macOS-only for the same reason).

---

## 6. Control-socket failure: `bgDisabled` (NET-NEW)

`bgDisabled` is **220=5 / 193=0**. When the daemon comes up but its control socket cannot
listen, it records that fact *in the lock*:

```javascript
async function Nef(e) {                          // :664718-664722
  let t = await jAe();
  if (!t || t.pid !== e.pid || t.startedAt !== e.startedAt) return;   // compare-and-set
  await mYo({ ...t, bgDisabled: !0 });
}
```

The compare-and-set on `(pid, startedAt)` before rewriting is important: by the time the socket
failure is noticed, the lock may already belong to a successor. Overwriting it would resurrect a
dead daemon's record.

Clients then get a *diagnosis* instead of a timeout (`:680428-680437`,
`tengu_bg_daemon_bg_disabled_skip`, **220=1 / 193=0**):

> "the background service on this machine is running without background sessions — **its control
> socket failed to start**. Check the cause with `claude daemon status` (daemon.log), then
> restart the service (launchctl/systemctl, or reboot)." — code `daemon_ensure_bg_disabled`

This is the other half of `.195` #9. Compare with the zombie path in the same function
(`detectZombieDaemon`, `Tcf`, `:680425-680485`), which handles the *different* case of a live
supervisor with an unreachable socket:

1. Ignore daemons younger than `pIa + 5000` ms — still booting (`:680438`).
2. Re-`ping` with a 1 s timeout; `ok` **or** `ETIMEOUT` → false positive
   (`tengu_bg_daemon_zombie_false_positive`, `:680457-680458`). `ETIMEOUT` counting as *alive*
   is deliberate: a busy daemon that misses a 1 s deadline is not a zombie.
3. `Y0r(e)` must hold or it is reported and **not signalled** (`:680459-680468`).
4. Otherwise log *"supervisor pid … alive but control socket unreachable — signalling restart"*,
   handle `EPERM`, and emit `tengu_bg_daemon_zombie_restart` (`:680477-680484`).

`tengu_bg_daemon_zombie_restart` / `_false_positive` are both in the pre-existing event
allow-list at `:537404-537405`, so the zombie machinery is carryover; the `bgDisabled`
distinction is the new part.

---

## 7. Idle reaping and the sweep clock

### 7.1 Two idle graces

`G1m` (`:870507-870519`) destructures its options with these defaults:

```
staleCheckIntervalMs: ASE = 60000      (:870906)
idleGraceMs:          j1m = 5000       (:870908)
startupIdleGraceMs:   TSE = GX + j1m   (:870937 → 45000 + 5000 = 50000)
```

`K` (`:870737-870762`) is the idle reaper. It picks between them with one flag:

```javascript
let ee = z ? c : u;         // z = "we have had a client at some point"
```

- **Never had a client** → wait `TSE` = `DAEMON_REACHABLE_TIMEOUT_MS + 5000`. That is not an
  arbitrary number: it is exactly the window in which a *client that is still waiting for the
  daemon to become reachable* could still connect. Exiting sooner would race the very client
  that spawned us.
- **Had a client, now idle** → `j1m` = 5 s. Once a client has connected and gone, and
  `leaseCount + liveHandleCount === 0`, there is nothing to wait for.

The whole reaper is `transient`-only (`:870738`) and suppressed while upgrading, shutting down,
yielding or aborted (`:870739`). Telemetry `tengu_daemon_idle_exit` carries
`{ grace_ms, never_had_client: !z, cfg_workers }` (`:870759`).

`tengu_daemon_yield` (220=5 / 193=5) is carryover: a transient daemon yields to a
foreground/service daemon and its workers are re-adopted (`:870676-870684`).

### 7.2 The sweep tick detects a sleeping host

`SWEEP_INTERVAL_MS` (`d$n`) = 60000 (`:870133`). The tick body opens with:

```javascript
let z = Date.now(), V = z - E - d$n;             // :869756-869757
if (((E = z), V > d$n)) {                        // we are more than one interval late
  for (let ne of G.values()) ne.shiftGraceClocksForward(V);
  j();
  return;                                        // skip this sweep entirely
}
```

If the process was suspended (laptop lid, VM pause, SIGSTOP) every worker's grace clock is
pushed forward by the missing time and the sweep is skipped. Without it, one lid-close would
make every worker look "idle for 8 hours" and the sweep would reap the entire fleet.

**Honesty note:** `shiftGraceClocksForward` is **220=2 / 193=2** — the sleep-shift mechanism is
**carryover**, not part of this window. The `.200` #4 bullet ("Bg sessions silently stopping
mid-turn after sleep/wake") is anchored elsewhere: `tengu_resume_interrupted_turn` (220=2 /
193=0) and `CLAUDE_CODE_RESUME_INTERRUPTED_TURN` (220=18 / **193=8**), covered in
[`worker_respawn_and_upgrade.md`](./worker_respawn_and_upgrade.md) §4.

### 7.3 Low memory: macOS finally gets a real signal

The retire grace flips to `LOW_MEM_RETIRE_GRACE_MS` (`Wvl` = 60000, `:870132`) instead of
`IDLE_RETIRE_GRACE_MS` (`uSE` = 3600000, `:870131`) whenever `isLowMemory()` holds
(`:869763-869765`) — a 60× reduction. And if low memory *persists* after shedding all
non-pinned workers, it retires pinned settled ones too
(`tengu_bg_retire_pinned_low_mem`, 220=1 / **193=1**, carryover, `:869777-869785`).

The **detector** is the delta:

```javascript
function t7s() {                                              // :552598-552604
  let e = Ke("tengu_bg_low_mem_mb", 1024) * 1024 * 1024;
  if (e <= 0) return { lowMem: !1, level: void 0 };
  if (Mt() !== "macos") return { lowMem: Shp.freemem() < e, level: void 0 };
  let t = oq_();
  return { lowMem: t !== void 0 && t >= rq_, level: t };       // rq_ = 4  (:552630)
}
```

`readMacVmPressureLevel` (`oq_`, `:552608-552622`) `dlopen`s `/usr/lib/libSystem.B.dylib` via
`bun:ffi` and calls `sysctlbyname("kern.memorystatus_vm_pressure_level")` into an `Int32Array`.
`kern.memorystatus_vm_pressure_level` is **220=1 / 193=0** (`:552638`).

2.1.193's equivalent was:

```javascript
function Gnr() {
  if (Wt() === "macos") return 0;                    // :575137 (193) — feature OFF on macOS
  return it("tengu_bg_low_mem_mb", 1024) * 1024 * 1024;
}
```

So the trajectory is: **193 = disabled on macOS** → `.196` re-enabled it using `os.freemem()`
(the regression the `.203` #4 bullet names, not observable in either bundle) → **220 = a real
pressure level**. `os.freemem()` on macOS reports only genuinely free pages and ignores the
enormous purgeable/compressed pools, so it reads "starved" on a perfectly healthy Mac — hence
the 15-20 s stall on session open. The `sysctl` returns Apple's own pressure enum, and the
threshold `>= 4` is `kVMPressureLevel_Critical`, i.e. only act when the kernel itself says the
system is critical. `dlopen` failure is cached as `null` and degrades to "never low memory"
(`:552614-552618`) — fail-open, because a false "low memory" is far more damaging (it reaps
work) than a false "plenty".

---

## 8. Other daemon-adjacent findings

- **`logind KillUserProcesses=yes` warning** (`tGb`, `:680496-680505`). On Linux/WSL the daemon
  greps `/etc/systemd/logind.conf` and warns: *"SSH disconnect will kill the transient daemon
  and its background jobs. Run `loginctl enable-linger $USER` or `claude daemon install` to keep
  it alive across logout."* A configuration-diagnosis rather than a code fix — the correct
  response to a class of "my agents died when I logged out" report.
- **Cold-start install prompt** (`ITn`, `:680554-680582`): `[y/N/never, or 'once' just for now]`,
  answers recorded as `tengu_bg_daemon_cold_start_ask_answer`. Suppressed unless both stdin and
  stderr are TTYs and not in CI (`:680557`). Event names present in the 193 allow-list
  (`:537397-537398`) → carryover surface.
- **Startup lock race, three steps** (`:870601-870640`): `createDaemonLockExclusive` (`wx` flag)
  → on `EEXIST`, verify the incumbent with `cAa(pid, procStart, zAn)` and exit if it is really
  alive → else force-replace with `writeDaemonLockAtomic`, sleep `wSE = 100` ms (`:870907`) and
  **re-read to confirm we still hold it**, exiting with `lock_vanished_after_replace` otherwise.
  Step 3 is new in 2.1.220 — 2.1.193's equivalent (`:717219-717245 (193)`) replaced the lock and
  simply carried on, so two daemons that force-replaced concurrently could both proceed. The
  100 ms settle is one filesystem round-trip's worth of slack, enough for a competing
  `rename` to land.
- **`daemon.lock` I/O is carryover.** `readDaemonLockRaw` (`jAe`, `:664723-664739`, with its
  `lstat`+`isFile`+`size > 65536` self-heal) and `writeDaemonLockAtomic` (`mYo`,
  `:664740-664761`, tmp-write + rename with EEXIST/EPERM retry + read-back verify) are
  effectively byte-identical to `:501841-501878 (193)`. Do not present them as new.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_background_agents_daemon.md](../00_overview/symbol_additions_v2_1_220_background_agents_daemon.md).

Key functions in this document:

- `parseEmbeddedBuildTimestamp` (rUt) - `-dev.YYYYMMDD.tHHMMSS` → epoch ms with a round-trip validation
- `isNewerBuild` (mhn) / `isOlderBuild` (hhp) - three-tier recency comparators used by every handover decision
- `prereleaseChannelOf` (ugt) / `channelsDiffer` (iSr) - dev-vs-engine channel isolation
- `readVerifiedDaemonLock` (QH) - kill(0) + cmdline + procStart identity, with a retry count
- `lockHasProcStartIdentity` (Y0r) - the one-line predicate that gates every SIGTERM
- `procStartMatchesWithRetry` (cAa) - fail-closed retrying variant of `procStartMatches`
- `readProcStartUncached` (dsg) - `/proc/<pid>/stat` field 22 reader
- `markDaemonLockBgDisabled` (Nef) - compare-and-set `bgDisabled` when the control socket fails
- `validateProcessWrapper` (Kmy) / `parseProcessWrapperArgv` (Xmy) - the corporate-launcher config front door
- `resolveProcessWrapper` ($Qr) / `isProcessWrapperRunnable` (o6) / `processWrapperError` (PE) - memoised accessors
- `spawnDaemonProcess` (lJo) - the five-rung spawn ladder
- `macosAquaWrapPrefix` (jjb) - `launchctl asuser` capability probe
- `applyAquaWrapPrefix` (kTn) - skips the wrap when the payload itself is not executable
- `windowsWmiSpawn` (Gjb) / `buildWmiScript` (Wjb) - carryover `Win32_Process.Create` detached spawn
- `buildDaemonSpawnEnv` (Kjb) - env scrubbing for the supervisor
- `maybeRetireStaleDaemon` (Qjb) / `shouldClientRetireDaemonByVersion` (Jjb) - client-side takeover
- `shouldRetireUnwrappedDaemon` (Zjb) - launcher-prefix skew detector + `launcher contract #3` diagnostic
- `detectZombieDaemon` (Tcf) - live supervisor / dead socket triage
- `lowMemorySnapshot` (t7s) / `readMacVmPressureLevel` (oq_) - macOS `sysctlbyname` pressure read
