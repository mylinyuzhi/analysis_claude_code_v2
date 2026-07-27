# `sandbox.network.strictAllowlist` — a dead flag becomes a settable policy (v2.1.219)

> **Verdict: DELTA, not an introduction.** The changelog bullet for `.219` reads *"Added
> `sandbox.network.strictAllowlist` setting to deny non-allowlisted hosts for sandboxed commands without
> prompting"*. The **enforcement branch already shipped in 2.1.193**. What `.219` added is the *settings
> surface* that can finally set the flag — in 2.1.193 the property was never written by anything, so the
> branch was provably unreachable.
>
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
> (`VERSION 2.1.220`, `build_sha 4073f595`). Every bare `cli_inner_pretty.js:<line>` is a **220** line I
> read. Baseline lines are tagged **(193)**.
>
> **Platform caveat for this whole module:** the extracted bundle is the **Linux target build** — `kH()`
> at `cli_inner_pretty.js:192732-192742` is emitted as `switch ("linux")`, i.e. the bundler constant-folded
> `process.platform`. The macOS and Windows branches are present in the source but statically unreachable in
> *this artefact*. Everything below about Windows/macOS is read from live source text, not from behaviour.

---

## TL;DR

| | 2.1.193 | 2.1.220 |
|---|---|---|
| `strictAllowlist` literal count | **1** | **4** |
| Settings-schema field | **absent** (`grep -n strictAllowlist` in 193 returns only the enforcement line) | `:49648-49656`, with a 4-clause describe string |
| Written into the runtime config object | **never** — the network object at `:219482-219491 (193)` has no such key | `:205177`, OR-aggregated across trusted scopes |
| Accepted from the SDK parent-managed tier | no | `:62415`, restrictive-direction only |
| Enforcement | `:211506 (193)` | `:195200` — **byte-equivalent** |

So the honest framing is: **2.1.193 dark-launched the deny-without-prompting branch and left it wired to
`undefined`; 2.1.219 attached three pieces of settings plumbing to it.** The behaviour change is real for
users, but nothing in the *enforcement* path changed.

---

## 1. Proof that the 193 flag was dead, not merely undocumented

`grep -c 'strictAllowlist'` gives **220=4 / 193=1**. The single 193 hit *is* the enforcement site:

```javascript
// ============================================
// shouldAllowNetworkConnection - the sandbox proxy's per-connection host filter
// Location: cli_inner_pretty.js:195194-195208   (193 counterpart :211500-211514)
// ============================================

// ORIGINAL (for source lookup):
async function gSu(e, t, r) {
  if (!Hl) return (_o("No config available, denying network request"), !1);
  if (!eKr(t)) return (_o(`Denying malformed host: ${JSON.stringify(t)}:${e}`, { level: "error" }), !1);
  let n = Vns(t) ?? t;
  for (let o of Hl.network.deniedDomains) if (Kat(n, o)) return (_o(`Denied by config rule: ${t}:${e}`), !1);
  for (let o of Hl.network.allowedDomains) if (Kat(n, o)) return (_o(`Allowed by config rule: ${t}:${e}`), !0);
  if (!r || Hl.network.strictAllowlist) return (_o(`No matching config rule, denying: ${t}:${e}`), !1);
  _o(`No matching config rule, asking user: ${t}:${e}`);
  try {
    if (await r({ host: t, port: e })) return (_o(`User allowed: ${t}:${e}`), !0);
    else return (_o(`User denied: ${t}:${e}`), !1);
  } catch (o) {
    return (_o(`Error in permission callback: ${o}`, { level: "error" }), !1);
  }
}

// READABLE (for understanding):
async function shouldAllowNetworkConnection(port, host, askUserCallback) {
  if (!sandboxRuntimeConfig) { logSandbox("No config available, denying network request"); return false; }
  if (!isWellFormedHost(host)) { logSandbox(`Denying malformed host: ${JSON.stringify(host)}:${port}`, { level: "error" }); return false; }
  let comparableHost = canonicalizeHostForMatching(host) ?? host;   // unbracket IPv6, WHATWG-normalise, drop trailing dot
  for (let pattern of sandboxRuntimeConfig.network.deniedDomains)                 // 1. deny list first
    if (matchesDomainPattern(comparableHost, pattern)) { logSandbox(`Denied by config rule: ${host}:${port}`); return false; }
  for (let pattern of sandboxRuntimeConfig.network.allowedDomains)                // 2. allow list second
    if (matchesDomainPattern(comparableHost, pattern)) { logSandbox(`Allowed by config rule: ${host}:${port}`); return true; }
  if (!askUserCallback || sandboxRuntimeConfig.network.strictAllowlist) {         // 3. THE FLAG
    logSandbox(`No matching config rule, denying: ${host}:${port}`); return false;
  }
  logSandbox(`No matching config rule, asking user: ${host}:${port}`);            // 4. interactive prompt
  try {
    return await askUserCallback({ host, port })
      ? (logSandbox(`User allowed: ${host}:${port}`), true)
      : (logSandbox(`User denied: ${host}:${port}`), false);
  } catch (err) {
    logSandbox(`Error in permission callback: ${err}`, { level: "error" });       // 5. fail closed
    return false;
  }
}

// Mapping: gSu→shouldAllowNetworkConnection, Hl→sandboxRuntimeConfig, eKr→isWellFormedHost,
//          Vns→canonicalizeHostForMatching, Kat→matchesDomainPattern, _o→logSandbox,
//          e→port, t→host, r→askUserCallback
```

Now the key step: **who writes `network.strictAllowlist`?** The runtime config is built once, by
`buildEffectiveSandboxConfig` (`znr`, `:204847-205218`), and installed by `initializeSandbox` (`e0u`,
`:205534-205565`) — `kE.initialize(...)` at `:205549`, and `kE.updateConfig(...)` at `:205553` inside the
settings-watcher subscription registered at `:205550-205554`. In 2.1.193 that builder produced the network
sub-object at `:219482-219491 (193)`:

```javascript
// ORIGINAL (193, for comparison only):
: {
    allowedDomains: s,
    deniedDomains: i,
    allowUnixSockets: e.sandbox?.network?.allowUnixSockets,
    allowAllUnixSockets: e.sandbox?.network?.allowAllUnixSockets,
    allowLocalBinding: e.sandbox?.network?.allowLocalBinding,
    allowMachLookup: e.sandbox?.network?.allowMachLookup,
    httpProxyPort: e.sandbox?.network?.httpProxyPort,
    socksProxyPort: e.sandbox?.network?.socksProxyPort,
  },
```

There is no `strictAllowlist` key, and the 193 zod schema (`:54060-54120 (193)` region) has no such field
either — so `Ya.network.strictAllowlist` was always `undefined`. The `.219` bullet's behaviour was therefore
**reachable in 2.1.193 only through the `!r` half of the same condition** (no interactive callback available,
e.g. a headless session with no TTY). That is a genuinely different trigger and it is why the changelog can
call the setting "added" without lying about user-visible behaviour.

### Why the ordering of the four checks matters

**What it does:** decides allow / deny / ask for one outbound TCP connection from a sandboxed child process.

**How it works:**
1. **Missing config → deny.** The proxy is up before the config is; a race must not become an open door.
2. **Malformed host → deny** and log at `error`. `eKr` runs before any pattern match so that a host the
   matcher would mis-parse can never reach the allow list. Order matters: a matcher fed a malformed host
   could produce a false `endsWith(".example.com")` positive.
3. **`deniedDomains` before `allowedDomains`.** Deny wins unconditionally — this is why the schema's
   `deniedDomains` describe string at `:49646` can promise *"always blocked, even if matched by
   allowedDomains … Merged from all settings sources regardless of allowManagedDomainsOnly"*.
4. **`!r || strictAllowlist` → deny.** Two independent reasons collapse into one branch: *nobody can be
   asked* and *policy says never ask*.
5. **Interactive prompt, then fail-closed on throw.** Any exception inside the UI callback is a deny.

**The canonicalisation step (`Vns`, `:192047-192056`) is load-bearing and easy to miss.** Both list walks
match against `comparableHost`, not against the raw `host`:

```javascript
function Vns(e) {
  try {
    let t = rke(e),                                                  // strip [ ] from an IPv6 literal
      r = Cie.isIP(t) === 6 ? `[${t}]` : t,                          // re-bracket so URL() will parse it
      n = new Vao.URL(`http://${r}/`).hostname;                      // WHATWG normalise: lowercase + IDNA
    return rke(n).replace(/\.$/, "");                                // unbracket again, drop the root dot
  } catch { return; }                                                // unparseable -> undefined -> use raw host
}
```

Four normalisations in five lines, and each one closes a spelling that would otherwise dodge a
`deniedDomains` entry: **case** (`EXAMPLE.COM`), **Unicode/IDN** (a punycode-equivalent label), **the FQDN
root dot** (`example.com.`, which resolves identically but does not string-match), and **IPv6 bracketing**
(`[::1]` vs `::1`). The `?? t` fallback matters too: on a parse failure the *raw* host is used, so a host that
cannot be canonicalised is still matched against the deny list rather than skipped — and `eKr`
(`:192040-192046`) has already rejected the genuinely malformed cases one line earlier, including
percent-signs (IPv6 zone ids, which would let `fe80::1%eth0` and `fe80::1` differ).

This whole block is **carryover**: 2.1.193's `Cqi` (`:211500-211514 (193)`) has the identical five
statements with `z5i`/`SNt`/`gNt` in place of `Vns`/`Kat`/`eKr`. It is documented here because a reader
auditing `strictAllowlist` needs to know that the *matching* is sound before concluding anything about the
*policy*.

**Why this approach:** the filter is a *synchronous-shaped* decision inside an async proxy hot path. Making
the deny list first and the fail paths terminal means every early exit is the safe one; the only branch that
can return `true` without an explicit allow-list match is the user's own answer.

**Key insight:** `strictAllowlist` does not add a rule, it **removes a state**. Without it the sandbox has
three outcomes (allow / deny / ask); with it there are two. That is why the flag can be implemented as a
single disjunct with no new code path — and why it was cheap to dark-launch.

---

## 2. The new settings field (`:49648-49656`) — read the describe string as a spec

```javascript
// ============================================
// strictAllowlist schema field - on the sandbox.network settings object
// Location: cli_inner_pretty.js:49648-49656
// ============================================

// ORIGINAL (for source lookup):
strictAllowlist: v
  .boolean()
  .optional()
  .describe(
    "When true, the sandbox runtime deterministically denies hosts not in allowedDomains instead of prompting. " +
      "Enforced for sandboxed commands only — in-process tools such as WebFetch are not gated by this setting. " +
      "Only honored from user, managed/policy, or CLI (--settings) settings — " +
      "project settings (.claude/settings.json and .claude/settings.local.json) are ignored.",
  ),

// READABLE (for understanding):
strictAllowlist: zod.boolean().optional().describe(
  "When true, the sandbox runtime deterministically denies hosts not in allowedDomains instead of prompting. "
  + "Enforced for sandboxed commands only — in-process tools such as WebFetch are not gated by this setting. "
  + "Only honored from user, managed/policy, or CLI (--settings) settings — "
  + "project settings (.claude/settings.json and .claude/settings.local.json) are ignored.",
),

// Mapping: v→zod (the zod namespace alias in this build)
```

Three claims in that string are each verifiable in code, and each is a design decision worth naming.

### 2.1 "Enforced for sandboxed commands only — in-process tools such as WebFetch are not gated"

`Hl` (`sandboxRuntimeConfig`, declared `:195858`) is consulted **only** by the sandbox proxy filter and the
per-platform wrappers. `WebFetch`'s own domain gate is the permission-rule path (`WebFetch(domain:…)` rules,
parsed at `:204706` / `:204859` / `:204873` inside the sandbox *domain collection* helpers). Those rules feed
`allowedDomains`/`deniedDomains` — i.e. the sandbox borrows the permission rules, not the other way round. So
turning on `strictAllowlist` hardens `curl` inside a Bash tool call and leaves the harness's own HTTP client
alone. **This asymmetry is the single most misreadable thing about the setting** and the schema author
evidently knew it, because it is sentence two of four.

### 2.2 "Only honored from user, managed/policy, or CLI (`--settings`) settings"

This phrase is **220=5 / 193=1** — it existed once in 193 (`:54110 (193)`, on `allowAppleEvents`) and now
appears on five switches: `strictAllowlist` `:49654`, `tlsTerminate` `:49692`, `filesystem.disabled` `:49736`,
`credentials.allowPlaintextInject` `:49798`, `allowAppleEvents` `:49841`. The count movement is the real
structural story of this window's sandbox work (see §3).

### 2.3 "deterministically denies … instead of prompting"

The word *deterministically* is doing work: the point is not extra safety per host, it is the **removal of a
human in the loop**, which makes sandboxed runs reproducible in CI and immune to prompt fatigue.

---

## 3. The scope primitive: `getTrustedSettingsSources` (`YLt`, `:204062-204064`)

**What it does:** returns the list of settings objects that are allowed to *loosen or tighten* sandbox
security switches — deliberately excluding `projectSettings` and `localSettings`.

```javascript
// ============================================
// getTrustedSettingsSources - the settings scopes a sandbox security switch may come from
// Location: cli_inner_pretty.js:204062-204064
// ============================================

// ORIGINAL (for source lookup):
function YLt() {
  return [...GQ(), Pr("flagSettings"), pg("userSettings") ? Pr("userSettings") : null];
}

// READABLE (for understanding):
function getTrustedSettingsSources() {
  return [
    ...getManagedSettingsTiers(),                              // remote managed, MDM plist/HKLM, managed file
    getSettingsForSource("flagSettings"),                      // --settings / SDK inline
    isSettingsSourceActive("userSettings") ? getSettingsForSource("userSettings") : null,
  ];
}

// Mapping: YLt→getTrustedSettingsSources, GQ→getManagedSettingsTiers (:63159),
//          Pr→getSettingsForSource, pg→isSettingsSourceActive (:57672)
```

**How it works:**
1. `GQ()` (`:63159-63161`) resolves the managed/policy tiers through `vIh`/`IMi` (`:62485`, `:62455`) —
   remote managed settings, MDM (plist on macOS / HKLM on Windows), and the managed-settings file, plus the
   restrictive-only SDK parent slice (§4).
2. `flagSettings` — the `--settings` file or SDK inline settings. Trusted because it is on the command line
   of whoever launched the process.
3. `userSettings` — but only when `pg("userSettings")` says that source is active. `pg` (`:57672-57674`) is
   `wT().includes(e)`, i.e. the `--setting-sources` selection. A session launched with project-only sources
   does not silently inherit `~/.claude/settings.json`.
4. **`projectSettings` and `localSettings` never appear.** Those two are the files a cloned repository can
   carry, so they are exactly the untrusted input.

**Why this approach — and what it replaced.** In 2.1.193 this list existed **once, inline**, inside the
config builder for `allowAppleEvents`:

```javascript
// ORIGINAL (193, :219500-219502):
allowAppleEvents: [...n, _n("flagSettings"), Hm("userSettings") ? _n("userSettings") : null]
  .map(($) => $?.sandbox?.allowAppleEvents)
  .find(($) => $ !== void 0),
```

2.1.220 lifts that array literal into the named `YLt()` and reuses it at **five** call sites: `:204674`
(`filesystem.disabled`), `:205177` (`strictAllowlist`), `:205185` (`tlsTerminate`), `:205209`
(`allowAppleEvents`), `:512803` (a stricter `excludedCommands` matcher). **The extraction of a
"trusted-scope" primitive is the enabling refactor for both of this window's sandbox settings bullets** —
neither could have been added safely while the scope rule was an anonymous array copied by hand.

**Key insight:** the interesting security property is not the flag, it is the *shape of the scope list*.
Every new sandbox switch in this window is expressed as `YLt()` + an aggregation rule; the aggregation rule
is where the per-switch thinking lives (§3.1).

### 3.1 Two aggregation rules, and why they differ

Same source list, three different reductions over it:

| Switch | Site | Reduction | Direction it can move security |
|---|---|---|---|
| `network.strictAllowlist` | `:205177` | `.some(x => x === true) \|\| undefined` — **OR** | tighten only |
| `network.tlsTerminate` | `:205185-205187` | `.map(…).find(x => x !== undefined)` — **first defined wins** | loosen (MITM) |
| `allowAppleEvents` | `:205209-205211` | `.map(…).find(x => x !== undefined)` — **first defined wins** | loosen (code exec) |
| `filesystem.disabled` | `:204669-204677` | first-defined **plus a managed pin** | loosen |

```javascript
// ============================================
// buildEffectiveSandboxConfig - the strictAllowlist aggregation (excerpt)
// Location: cli_inner_pretty.js:205172-205184
// ============================================

// ORIGINAL (for source lookup):
j = G
  ? { allowedDomains: void 0, deniedDomains: [], allowAllUnixSockets: !0 }
  : {
      allowedDomains: i,
      deniedDomains: s,
      strictAllowlist: YLt().some((K) => K?.sandbox?.network?.strictAllowlist === !0) || void 0,
      allowUnixSockets: e.sandbox?.network?.allowUnixSockets,
      ...
    },

// READABLE (for understanding):
networkConfig = isScrubbedAgentRunner
  ? { allowedDomains: undefined, deniedDomains: [], allowAllUnixSockets: true }   // CI runner: FS-only sandbox
  : {
      allowedDomains: collectedAllowDomains,
      deniedDomains: collectedDenyDomains,
      strictAllowlist:
        getTrustedSettingsSources().some((s) => s?.sandbox?.network?.strictAllowlist === true) || undefined,
      allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
      ...
    },

// Mapping: j→networkConfig, G→isScrubbedAgentRunner (GP() && Bxe() && !dlt(), :205171), YLt→getTrustedSettingsSources
```

**Why OR for `strictAllowlist` and first-wins for the others.** `strictAllowlist === true` can only *remove*
an allow path, so OR is monotone in the safe direction: any trusted scope may tighten, and no scope can
untighten. Precedence would be a liability here — a lower-priority user file that says `true` would be
overridden by a higher-priority managed file that happens to say `false`, which is not what an
"allowlist-strict shop" wants. Conversely `tlsTerminate`, `allowAppleEvents` and `filesystem.disabled` all
*grant* something, so OR would let the weakest scope win; those use precedence so the highest-trust tier
decides.

**Failure mode of the OR form.** Note `=== !0` (strict `true`), so `"true"`, `1`, or `{}` do not enable it;
zod would have rejected them earlier anyway, but the strict compare means a schema bypass still fails closed.
And `|| void 0` deletes the key when nothing enables it, so `structuredClone` in `updateConfig` (`:195724`)
does not carry a `false` that would look like an explicit opt-out downstream.

**Key insight:** `strictAllowlist` is the only sandbox switch in this window whose aggregation is a
disjunction, and that is a direct consequence of it being the only *purely restrictive* one. If you ever see
a new sandbox boolean aggregated with `.some(...)`, it tightens; with `.find(...)`, it loosens.

Note the first arm of the ternary: when `G` (`GP() && Bxe() && !dlt()`, `:205171`) — the scrubbed
agent-runner mode — the whole network policy is replaced by `allowedDomains: undefined` +
`allowAllUnixSockets: true`, i.e. **network filtering is off and `strictAllowlist` is not even computed**.
`undefined` `allowedDomains` also short-circuits `getNetworkRestrictionConfig` at `:205768-205770`, so the
model is not told about a network policy that is not there. A reader auditing "is strictAllowlist in force?"
must check this arm first.

---

## 4. The SDK parent-managed tier: a restrictive-only ratchet (`:62382-62436`)

The second new site, `:62415`, is inside the filter that decides what an **SDK-supplied parent managed
settings** tier may contribute. `parentSettingsBehavior` (`:61093-61100`, **220=2 / 193=2** — carryover)
documents the mechanism:

> `"first-wins"` (default): parent is dropped — admin tiers are the only policy source. `"merge"`: parent's
> **restrictive-only-filtered** settings union under the admin winner. Has no effect when no admin tier
> exists (parent applies as the sole policy tier, still filtered restrictive-only).

The filter itself is `EIh` (`:62382`), called once at `:62481` as `l && SIh(d) ? EIh(l, p) : null`.
Its sandbox branch, diffed against 193, is a **three-line delta**:

```javascript
// ============================================
// filterParentManagedSettingsRestrictiveOnly - sandbox branch (the three new lines marked)
// Location: cli_inner_pretty.js:62405-62434   (193 counterpart :57720-57746)
// ============================================

// ORIGINAL (for source lookup):
if (e.sandbox) {
  let { network: o, filesystem: i, credentials: s } = e.sandbox,
    a = {};
  if (e.sandbox.enabled === !0) a.enabled = !0;
  if (e.sandbox.failIfUnavailable === !0) a.failIfUnavailable = !0;
  if (e.sandbox.allowUnsandboxedCommands === !1) a.allowUnsandboxedCommands = !1;
  if (e.sandbox.autoAllowBashIfSandboxed === !1) a.autoAllowBashIfSandboxed = !1;
  if (o) {
    let l = ZYt(o, ["deniedDomains"]);
    if (o.allowManagedDomainsOnly === !0) l.allowManagedDomainsOnly = !0;
    if (o.strictAllowlist === !0) l.strictAllowlist = !0;                        // <-- NEW in 220
    if (t.sandbox?.network?.allowManagedDomainsOnly !== !0 && o.allowedDomains) l.allowedDomains = o.allowedDomains;
    if (Object.keys(l).length > 0) a.network = l;
  }
  if (i) {
    let l = ZYt(i, ["denyRead", "denyWrite"]);
    if (i.allowManagedReadPathsOnly === !0) l.allowManagedReadPathsOnly = !0;
    if (i.disabled === !1) l.disabled = !1;                                      // <-- NEW in 220
    if (t.sandbox?.filesystem?.allowManagedReadPathsOnly !== !0 && i.allowRead) l.allowRead = i.allowRead;
    if (Object.keys(l).length > 0) a.filesystem = l;
  }
  if (s) {
    let l = (s.files ?? []).filter((d) => d.mode === "deny"),
      c = (s.envVars ?? []).filter((d) => d.mode === "deny"),
      u = { ...(l.length > 0 && { files: l }), ...(c.length > 0 && { envVars: c }) };
    if (s.allowPlaintextInject === !1) u.allowPlaintextInject = !1;               // <-- NEW in 220
    if (Object.keys(u).length > 0) a.credentials = u;
  }
  if (Object.keys(a).length > 0) r.sandbox = a;
}

// READABLE (for understanding):
if (parent.sandbox) {
  let { network, filesystem, credentials } = parent.sandbox, out = {};
  if (parent.sandbox.enabled === true) out.enabled = true;                          // only ON is restrictive
  if (parent.sandbox.failIfUnavailable === true) out.failIfUnavailable = true;      // only ON is restrictive
  if (parent.sandbox.allowUnsandboxedCommands === false) out.allowUnsandboxedCommands = false;  // only OFF
  if (parent.sandbox.autoAllowBashIfSandboxed === false) out.autoAllowBashIfSandboxed = false;  // only OFF
  if (network) {
    let n = pickKeys(network, ["deniedDomains"]);                                   // deny list always allowed
    if (network.allowManagedDomainsOnly === true) n.allowManagedDomainsOnly = true;
    if (network.strictAllowlist === true) n.strictAllowlist = true;                 // tighten-only
    if (adminClamps.sandbox?.network?.allowManagedDomainsOnly !== true && network.allowedDomains)
      n.allowedDomains = network.allowedDomains;                                    // allow list only if not clamped
    if (Object.keys(n).length > 0) out.network = n;
  }
  ...
}

// Mapping: EIh→filterParentManagedSettingsRestrictiveOnly, ZYt→pickKeys, e→parent, t→adminClamps,
//          r→result, a→out, o→network, i→filesystem, s→credentials
```

**Why this shape.** Every accepted key is pinned to the value that *reduces* capability: `enabled: true`,
`failIfUnavailable: true`, `allowUnsandboxedCommands: false`, `autoAllowBashIfSandboxed: false`,
`strictAllowlist: true`, `filesystem.disabled: **false**`, `allowPlaintextInject: **false**`. Note the
inversions: for `disabled` and `allowPlaintextInject` the *restrictive* value is `false`, and the filter
correctly tests `=== !1`. An SDK embedder can therefore hand Claude Code a parent policy that hardens the
sandbox but cannot use the same channel to soften it.

**Alternative not taken:** a generic "restrictive-only" schema annotation. Instead each key is enumerated by
hand, which is verbose but leaves no room for a new key to be swept in by default — a new sandbox switch is
*excluded* from the parent tier until someone adds a line here. That is fail-closed by construction, and it
is why `filesystem.disabled` and `strictAllowlist` each needed their own line in `.216`/`.219`.

**Key insight:** the aggregation OR at `:205177` and this filter at `:62415` are two different one-way
ratchets on the same flag, applied at two different layers (scope aggregation vs. tier admission). Reading
only one of them gives a wrong answer about who can turn the flag on.

---

## 5. The other half of the network decision: the auto-mode classifier memo (`.198`)

`.198`'s bullet *"Fixed excessive background classifier requests when sandboxed processes repeatedly accessed
the same network host"* is the same code path as `strictAllowlist`, one layer up: it is what happens when the
permission mode routes the host decision to an LLM instead of to the user.

`u7t` (`:58472-58477`) maps permission mode → disposition:

```javascript
function u7t(e, t) {
  if (e === "auto") return "classify";
  if (e === "bypassPermissions" || (e === "plan" && t)) return "allow";
  if (e === "dontAsk") return "deny";
  return "ask";
}
```

In `"classify"` the callback at `:822244` calls `getOrClassify`, and the memo is **220=4 / 193=0**:

```javascript
// ============================================
// SandboxHostVerdictCache - memoises per-host classifier verdicts against a transcript watermark
// Location: cli_inner_pretty.js:809578-809611 (watermark helper :809572-809577)
// ============================================

// ORIGINAL (for source lookup):
class o8t {
  verdicts = new Map();
  getOrClassify(e, t, r, n) {
    let o = `${e}:${t ?? "*"}`,
      i = this.verdicts.get(o);
    if (
      i &&
      ((i.watermark.messageCount === r.messageCount && i.watermark.lastMessageUuid === r.lastMessageUuid) ||
        i.isDeny === !0)
    )
      return i.promise;
    let s = n(),
      a = { promise: s.then((l) => l.allow), watermark: r, isDeny: void 0 };
    return (
      this.verdicts.set(o, a),
      s.then(
        (l) => {
          if (l.unavailable) {
            if (this.verdicts.get(o) === a) this.verdicts.delete(o);
            return;
          }
          a.isDeny = !l.allow;
        },
        () => {
          if (this.verdicts.get(o) === a) this.verdicts.delete(o);
        },
      ),
      a.promise
    );
  }
  clear() { this.verdicts.clear(); }
}

// READABLE (for understanding):
class SandboxHostVerdictCache {
  verdicts = new Map();                                       // "host:port" -> { promise, watermark, isDeny }
  getOrClassify(host, port, watermark, classify) {
    let key = `${host}:${port ?? "*"}`, cached = this.verdicts.get(key);
    if (cached && ((sameWatermark(cached.watermark, watermark)) || cached.isDeny === true))
      return cached.promise;                                  // reuse: fresh transcript OR a sticky deny
    let inflight = classify(),
      entry = { promise: inflight.then((r) => r.allow), watermark, isDeny: undefined };
    this.verdicts.set(key, entry);
    inflight.then(
      (r) => { if (r.unavailable) { if (this.verdicts.get(key) === entry) this.verdicts.delete(key); return; }
               entry.isDeny = !r.allow; },
      () => { if (this.verdicts.get(key) === entry) this.verdicts.delete(key); },   // throw -> forget
    );
    return entry.promise;
  }
  clear() { this.verdicts.clear(); }
}

// Mapping: o8t→SandboxHostVerdictCache, LMr→conversationWatermark, e→host, t→port,
//          r→watermark, n→classify
```

**How it works:**
1. Key is `host:port`, with `*` standing in for "no port" — so a per-host verdict covers all ports unless a
   port-specific request created its own entry.
2. `LMr(messages)` (`:809572-809577`) is the watermark: `{ messageCount (non-progress), lastMessageUuid }`.
3. **An `allow` is only reused while the transcript has not advanced.** Any new message invalidates it.
4. **A `deny` is reused forever** (`|| i.isDeny === !0`) — the watermark is ignored on the deny side.
5. **`unavailable` deletes the entry**, and so does a rejected promise. `Phr` (`:444741-444750`) maps
   `unavailable` to `allow: false` with the log `Sandbox network classifier unavailable for ${host}; failing
   closed (deny)` (`:444747`) — a fail-closed deny that must not become sticky, hence the delete.

**Why this asymmetry.** The threat model is prompt injection: content fetched or read *later in the
conversation* could be what makes a host dangerous, so a stale allow is unsafe and must expire on any
transcript advance. A deny has the opposite risk profile — re-asking cannot make a bad host good, and
re-asking is exactly the "excessive classifier requests" the bullet complains about. Distinguishing
`unavailable` from `deny` is the third leg: an infrastructure failure is not a policy decision and must not
be cached as one.

**Key insight:** three distinct cache lifetimes (transcript-scoped allow, permanent deny, no-cache
unavailable) fall out of one `if`. `isDeny` starting as `undefined` also means an in-flight entry is shared
by concurrent connections to the same host — the dedup that the bullet is actually about.

The classifier itself (`Phr`, `:444741`) is **carryover**; only the memo is new.

---

## 6. Undocumented delta in the same path: the "allow and remember" race

`addSessionAllowedHost` is **220=7 / 193=5**, and the two new call sites are inside the *persist* branch of
the sandbox network dialog (`:824593`) and of the agent-team `worker-sandbox-permission` dialog (`:824637`).

2.1.193 (`:691039-691049 (193)`):

```javascript
if (gn) {                                              // persistToSettings
  let Yo = { type: "addRules", rules: [{ toolName: Wb, ruleContent: `domain:${Ur}` }],
             behavior: zt ? "allow" : "deny", destination: "localSettings" };
  (He((ma) => ({ ...ma, toolPermissionContext: _y(ma.toolPermissionContext, Yo) })),
    Hce(Yo),
    ko.refreshConfig());                               // fire-and-forget write, then refresh, racing
} else if (zt) ko.addSessionAllowedHost(Ur);           // session-only path DID add
```

2.1.220 (`:824583-824597`):

```javascript
if (Nr) {
  let ws = { type: "addRules", rules: [{ toolName: $T, ruleContent: `domain:${Co}` }],
             behavior: dr ? "allow" : "deny", destination: "localSettings" };
  if ((Me((_l) => ({ ..._l, toolPermissionContext: YS(_l.toolPermissionContext, ws) })), dr))
    Oo.addSessionAllowedHost(Co);                      // <-- immediate in-memory allow
  LEe(ws).then(() => Oo.refreshConfig()).catch(xe);    // <-- refresh sequenced AFTER the write resolves
} else if (dr) Oo.addSessionAllowedHost(Co);
```

Two changes in four lines: the host enters the in-memory session allow-set **before** the settings write, and
`refreshConfig()` now runs in the write's `.then` instead of concurrently. In 193, choosing *allow and
remember* could leave a window where the rule was neither in `localSettings`-as-read nor in the session
set — the connection that triggered the prompt could be denied by the very act of remembering it. The
session set is consumed at `:204868` (`for (let K of Mco) i.push(K)`) when building `allowedDomains`, and
note it is inside the `else` of `nVe()` (`allowManagedDomainsOnly`) — under a managed domain clamp, session
grants are ignored entirely, which is correct and easy to miss.

**No changelog bullet in the `.195`–`.220` window describes this.** Record it as an undocumented fix.

---

## 7. What this bullet is *not*

- **Not** a change to `deniedDomains`, `allowedDomains`, `allowManagedDomainsOnly`, `allowUnixSockets`,
  `allowMachLookup` (7/7), or `mitmProxy` (4/4). `allowManagedDomainsOnly` is `220=10 / 193=9`; the nine
  shared sites line up 1:1 (`:49646`↔`:53988 (193)`, `:49657`↔`:53990 (193)`, `:62400`↔`:57715 (193)`,
  `:62414`↔`:57729 (193)`, `:62416`↔`:57730 (193)`, `:62474`↔`:57786 (193)`, `:204697`↔`:219236 (193)`,
  `:204850`↔`:219269 (193)`, `:205539`↔`:219708 (193)`) and the
  one extra 220 site is `:204719` — the refusal reason inside `isDomainAllowedForMask` (`fss`,
  `:204711-204721`), which belongs to the new credential-mask surface, not to `strictAllowlist`. See
  [credentials_mask_promotion.md](credentials_mask_promotion.md).
- **Not** a change to the enforcement text: `No matching config rule, denying:` is byte-identical between
  `:195200` and `:211506 (193)`.
- **Not** applicable to `WebFetch`, `WebSearch`, MCP HTTP transports, or the API client — all in-process.
- **Not** the mechanism that stops a sandboxed process from bypassing the proxy entirely. `gSu` only sees
  connections that *reach* the proxy. On Linux that is arranged by the network namespace + socat bridge; on
  Windows, by a kernel-level **WFP egress fence** installed per sandbox user (`WFP egress fence` 220=3 /
  **193=0**, verify probe `sSu` `:194832-194880`), which is new in this window and has no changelog bullet — see
  [windows_user_sandbox.md](windows_user_sandbox.md). `strictAllowlist` is a *policy* on the proxy's verdict;
  the fence is what makes the proxy unavoidable.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (home for Sandbox)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-theme additions: [symbol_additions_v2_1_220_sandbox.md](../00_overview/symbol_additions_v2_1_220_sandbox.md)

Key functions in this document:

- `shouldAllowNetworkConnection` (`gSu`, `:195194-195208`) - the sandbox proxy's per-connection host filter; `strictAllowlist` enforcement at `:195200`.
- `matchesDomainPattern` (`Kat`, `:195171-195180`) - wildcard host matcher; refuses `*.` patterns for literal IPs.
- `canonicalizeHostForMatching` (`Vns`, `:192047-192056`) - case/IDN/root-dot/IPv6-bracket normalisation before every list walk; carryover (`z5i`, `:211503 (193)`).
- `isWellFormedHost` (`eKr`, `:192040-192046`) - length ≤ 255, no `%` zone id, IP or `[A-Za-z0-9._-]+`.
- `unbracketIpv6Literal` (`rke`, `:192028-192030`).
- `getTrustedSettingsSources` (`YLt`, `:204062-204064`) - managed tiers + `flagSettings` + active `userSettings`; never project/local.
- `getManagedSettingsTiers` (`GQ`, `:63159-63161`) - resolved policy tiers, cached.
- `isSettingsSourceActive` (`pg`, `:57672-57674`) - `wT().includes(source)`.
- `buildEffectiveSandboxConfig` (`znr`, `:204847`) - builds the runtime config; `strictAllowlist` OR-aggregation at `:205177`.
- `filterParentManagedSettingsRestrictiveOnly` (`EIh`, `:62382-62436`) - restrictive-only admission for the SDK parent tier; new lines `:62415`, `:62422`, `:62430`.
- `parentTierMergesUnderAdmin` (`SIh`, `:62379-62381`) - `parentSettingsBehavior === "merge"`.
- `loadManagedSettingsTiers` (`IMi`, `:62455-62484`) - three admin tiers + parent slice + managed clamps `:62472-62479`.
- `permissionModeToNetworkDisposition` (`u7t`, `:58472-58477`) - `auto→classify`, `bypassPermissions→allow`, `dontAsk→deny`, else `ask`.
- `SandboxHostVerdictCache` (`o8t`, `:809578-809611`) - host verdict memo; sticky deny, watermarked allow, no-cache unavailable.
- `conversationWatermark` (`LMr`, `:809572-809577`) - `{ messageCount, lastMessageUuid }`.
- `classifySandboxNetworkHost` (`Phr`, `:444741-444750`) - LLM classifier call; fail-closed on `unavailable` (carryover).
- `addSessionAllowedHost` (`HVg`, `:204722-204725`) - session-only host grant; consumed at `:204868`.
- `isManagedDomainsOnly` (`nVe`, `:204696-204698`) - managed allow-list clamp.
- `collectSandboxDomains` (`FTu`, `:204699-204710`) - merges `sandbox.network.*Domains` with `WebFetch(domain:…)` rules.
- `isDomainAllowedForMask` (`fss`, `:204711-204721`) - deny-first domain reachability check used by credential masking.
- `getPlatform` (`Mt`, `:25076`) / `getSandboxPlatform` (`kH`, `:192732-192742`) - platform helpers; `kH` is constant-folded to `"linux"` in this build.
