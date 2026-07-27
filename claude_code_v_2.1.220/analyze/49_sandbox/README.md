# 49_sandbox — filesystem and network controls (2.1.193 → 2.1.220)

Deobfuscation analysis of the sandbox subsystem across the 25-release window
`2.1.195 … 2.1.220`. TARGET bundle
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(`VERSION 2.1.220`, `build_sha 4073f595`, `build_time 2026-07-24T22:17:45Z`); baseline
`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`. Conventions:
[`_CONVENTIONS.md`](../_CONVENTIONS.md). Verified anchors:
[`_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).

---

## Documents

| Doc | Covers |
|---|---|
| [network_strict_allowlist.md](network_strict_allowlist.md) | `.219` `sandbox.network.strictAllowlist`: the enforcement branch was dead code in 2.1.193 and got a settings surface in `.219`. Also the shared trusted-scope primitive `YLt`, the OR-vs-first-wins aggregation asymmetry, the restrictive-only SDK parent tier, `.198`'s host-verdict memo, and an undocumented "allow and remember" race fix. |
| [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) | `.216` `sandbox.filesystem.disabled`: which of the seven literal sites is actually new, the new resolver + managed pin + Windows veto, what the setting really turns off (and the three things it does not), then the path-containment layer — `.210`'s late `.claude/*` symlink reconciliation, the net-new 40-hop symlink resolver with a fail-closed branch, worktree/UNC/device-namespace escapes, the Windows argv budget (`.214`'s decoy), and `.203`'s `E2BIG` worktree diagnostic. Also the honest UNANCHORED record for `.218`'s IDE bullet. |
| [credentials_mask_promotion.md](credentials_mask_promotion.md) | **No changelog bullet.** `sandbox.credentials.envVars[].mode: "mask"` + `injectHosts` + `allowPlaintextInject` went from runtime-only-and-unreachable (193) to settable (220) — the same dark-launch→promotion shape as the two bullets above, plus the project-scope mask filter that closes an exfiltration primitive the promotion would otherwise have created. |
| [windows_user_sandbox.md](windows_user_sandbox.md) | **No changelog bullet, and the biggest structural change in this module.** The Windows backend went from a *group* model with no filesystem enforcement to a **provisioned low-privilege user** with SID-keyed ACL stamping, a kernel WFP egress fence that is *empirically probed* at startup, and a per-user CA store. This is the missing context for the Windows caveats in the other two bullets. It also hosts the one changelog bullet that lands here: `.214`'s Windows PowerShell 5.1 permission-check bypass. |

---

## Verification record (this pass)

The first three documents were written in an earlier, interrupted run. This pass re-read **every**
`cli_inner_pretty.js` citation in them against the bundles before publishing.

| Checked | Count |
|---|---|
| Distinct line citations in the three pre-existing docs | **326** |
| Distinct 2.1.220 lines re-read (range starts / bare cites) | 281 |
| Range **end** lines re-read (to confirm each function extent) | 143 |
| Baseline **(193)** lines re-read in the 2.1.193 bundle | 45 |
| `grep -c` delta claims re-run in **both** bundles | 87 — **all 87 reproduced exactly** |

**Eight citations were wrong and are now fixed.** All eight were location errors; no claim's *substance* was
affected, and not one delta count was wrong.

| Was | Is | Nature of the error |
|---|---|---|
| `Sos` `:195392-195420` | `:195404-195421` | start landed 12 lines early, inside `vSu` |
| `kE.initialize(...)` `:195547` | `:205549` | `195`↔`205` digit slip; `:195547` is `MWg`'s closing brace |
| `kE.updateConfig(...)` `:195553` | `:205553` | same slip |
| settings-watcher subscription `:195550-195554` | `:205550-205554` | same slip |
| `Uky` `:312570-312573` (Related Symbols) | `:312569-312572` | off-by-one; the doc body already had it right |
| `led` `:312560-312569` | `:312560-312568` | end overlapped the next function |
| `rMd` `:437150-437180` | `:437150-437220` | end truncated mid-array |
| `N0h` `:49640-49696` | `:49638-49696` | start pointed at `.object({`, not the assignment |

**Eight further citations violated the tagging rule** (a baseline line quoted without `(193)`): the nine-site
`allowManagedDomainsOnly` 1:1 list in network §7, and the `injectHosts` runtime-only row in the credentials
TL;DR. Their *content* verified correct in the 2.1.193 bundle; they are now tagged.

**Two changelog attributions were wrong** and are corrected in the ledger below: the `E2BIG` worktree bullet
is **`.203`**, not `.205` (CHANGELOG line 471), and the committed-`.claude/worktrees`-symlink bullet is
**`.212`**, not `.214` (line 202).

Five anchors previously marked *"not read by me"* (`:224564`, `:225693`, `:835183`, `:214165`, `:400915`)
have now been read in the 2.1.220 bundle and are marked verified in the ledger.

---

## The window's story for this theme

**`sandbox` is the only theme in the `.215`–`.220` range with zero NET_NEW bullets**
([`_scope_v215_220.md`](../00_overview/_scope_v215_220.md) roll-up: 3 bullets, 0 NET_NEW, 2 DELTA, 1
UNANCHORED). That is not because nothing happened; it is because **what happened was a settings-surface
project and a Windows-backend project, and the changelog only reported the first one.**

### Thread 1 — dark launch, then promotion

The shape repeats three times in this window:

1. A capability is built **dark**: the runtime reads a config property that no settings file can write.
   `network.strictAllowlist` (193=1 literal, never assigned), `filesystem.disabled` (193=6 literals, driven
   only by a remote GrowthBook value), `credentials.envVars[].mode: "mask"` (sentinel registry + `injectHosts`
   live, schema says `literal("deny")`).
2. Later, a **settings field + a scope rule + an aggregation rule** are attached. The changelog reports this as
   *"Added `<setting>`"*, which is true for the user and misleading for a reader diffing code.
3. The scope rule is always the same list and it is always the *interesting* part: managed/policy tiers,
   `--settings`/SDK `flagSettings`, and `userSettings` **only when that source is active** — never
   `projectSettings` or `localSettings`, because those are the files a cloned repository carries.

The enabling refactor for all of it is small and invisible in the changelog: in 2.1.193 that scope list existed
**once, as an inline array literal**, for `allowAppleEvents` (`:219500 (193)`). In 2.1.220 it is the named
`getTrustedSettingsSources` (`YLt`, `:204062-204064`) with **five** call sites. Once you have a reusable
"trusted scope" primitive, promoting a dark switch costs three lines; before that it cost a copy-paste with a
security bug waiting in it. The fifth call site (`:512803`) is not a promotion at all — it is the security fix
for `.214`'s PowerShell bypass, which needed exactly the same primitive.

### Thread 2 — path containment

This is where the genuinely new code is. `.210`'s bullet about late `.claude/*` symlinks buys you a
per-command reconciliation pass (`DVg`, `:205249-205281`) plus a kernel-matched 40-hop partial symlink
resolver with an explicit fail-closed branch (`Q5g`, `:193612-193638`, bound `J5g = 40` at `:194136`) in the
Linux bwrap deny loop. Around it, `.203`/`.210`/`.214`/`.216` add network-shaped-path and device-namespace
refusals, a complete enumeration of git's tree-redirect env vars, flags and config keys, and two exec-budget
diagnostics whose whole value is *attribution* (the Windows argv message names the sandbox arguments as part
of the budget; the `E2BIG` message counts how many deny paths came from stale git worktrees).

### Thread 3 — platform asymmetry, and its unannounced cause

The `filesystem.disabled` describe string (`:49733-49739`) is the longest in the whole settings schema and
spends most of its length explaining *why native Windows ignores the setting*: there, the sandboxed process
runs as a separate user with no inherent rights, so "skip the filesystem rules" would withhold every access
grant rather than loosen them. `getEffectiveFilesystemPolicy` (`ult`, `:204678-204686`) encodes that as a veto
placed **before** the settings read (`:204680`), and `buildWindowsFileAclPlan` (`CWg`, `:195467-195474`) shows
what would happen otherwise (all four ACL lists empty).

**That whole caveat exists because the Windows backend was rebuilt in this window.** `sandboxUser` is
220=12 / **193=0**; 2.1.193's Windows sandbox was network-only, driven by a *group*
(`srt-win group status`, `:211319 (193)`), with no filesystem enforcement and no ACL subcommands. The rewrite
has **no changelog bullet at all** and is documented in [windows_user_sandbox.md](windows_user_sandbox.md).

⚠ **Read the caveat in each doc:** this extract is the **Linux target build** — `kH()` (`:192732-192742`) is
emitted as `switch ("linux")`. Every Windows and macOS branch quoted here is live source text that is
statically unreachable in *this artefact*.

---

## Per-bullet ledger

Sandbox-**primary** bullets. Version numbers re-checked against `claude_code_v_2.1.220/CHANGELOG.md`;
verdicts are mine, from reading both bundles.

| # | Bullet (abridged) | Ver | Verdict | Anchor (220) | Doc section |
|---|---|---|---|---|---|
| 1 | Added `sandbox.network.strictAllowlist` to deny non-allowlisted hosts for sandboxed commands without prompting | .219 | **DELTA** (enforcement carryover; settings surface new). `strictAllowlist` 220=4 / **193=1**, and the single 193 hit *is* the enforcement line — the property was never assigned, so the branch was dead | schema `:49648-49656`; parent-tier filter `:62415`; aggregation `:205177`; enforcement `:195200` ↔ `:211506 (193)` byte-equal; 193 network object without the key `:219482-219491 (193)` | [network_strict_allowlist.md](network_strict_allowlist.md) §1–4 |
| 2 | Improved sandbox command restrictions for IDE interactions | .218 | **UNANCHORED** — 16 probes, all 0/0 or carryover-or-shrinking. The one structural candidate turned out to belong to bullet 6 | none | [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §7 |
| 3 | Added `sandbox.filesystem.disabled` to skip filesystem isolation while keeping network egress control | .216 | **DELTA**. `filesystem.disabled` 220=7 / **193=6**; six sites map 1:1 to 193, and the seventh (`:195477`) is a Windows change-detection snapshot, not enforcement. Real delta = new resolver + platform veto | resolver `xVg` `:204669-204677` (pin predicate 220=1/193=0); veto+settings edge `ult` `:204678-204686` vs `:219220-219225 (193)`; schema `:49729-49740` (`skip filesystem isolation` 220=1/193=0); new literal site `:195477` | [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §1–3 |
| 4 | Fixed late-appearing `.claude/*` symlinks not being reconciled into the sandbox deny-write list | .210 | **NET_NEW** (two halves: a reconcile pass and a Linux resolver) | `DVg` `:205249-205281`, called per command at `:205487`; `Q5g` `:193612-193638` + `J5g = 40` `:194136`; new logs `:193920`, `:193923` (both 220=1/193=0); sibling scrub `:205245` is 1/1 carryover | [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §4.1–4.3 |
| 5 | Fixed excessive background classifier requests when sandboxed processes repeatedly accessed the same host | .198 | **NET_NEW**. `getOrClassify` 220=4 / **193=0**; the classifier `Phr` `:444741-444750` itself is carryover | `o8t` `:809578-809611`, watermark `LMr` `:809572-809577`, call sites `:809812`, `:822244`, `:842906`; mode mapper `u7t` `:58472-58477` | [network_strict_allowlist.md](network_strict_allowlist.md) §5 |
| 6 | Fixed a permission-check bypass affecting commands run in Windows PowerShell 5.1 sessions | .214 | **NET_NEW mechanism.** `windows_policy_refusal` 220=2 / **193=0**; `shellType: "powershell"` 220=2 / **193=0**. 193 refused *all* PowerShell under a mandatory-sandbox policy (`Dml`, `:450766-450773 (193)`); 220 asks "would this command actually be sandboxed?" and adds a strict whole-command exclusion re-check | gate `ZLd` `:430750-430759`; strict matcher `nDd` `:512802-512807` + `R1_` `:512840`; permissive matcher `I1_` `:512771-512801`; decision `H4` `:512818-512826`; message `QLd` `:430929-430930` (`must run sandboxed even when a statement matches an exclusion` 220=1 / **193=0**) | [windows_user_sandbox.md](windows_user_sandbox.md) §5 |

**Undocumented (no changelog bullet), owned here:**

| Subject | Verdict | Anchor (220) | Doc |
|---|---|---|---|
| Windows sandbox rebuilt around a provisioned user + SID-keyed ACLs + WFP egress fence + per-user CA store | **NET_NEW, unannounced** | `sandboxUser` 220=12 / **193=0**; `srt-win install` 9 / **0**; `acl stamp`\|`grant`\|`revoke` 2/2/2 vs **0/0/0**; `WFP egress fence` 3 / **0**; `trust-ca` 4 / **0**; `aNe` `:194881-194897`, `glo` `:194903-194930`, `sSu` `:194832-194880` | [windows_user_sandbox.md](windows_user_sandbox.md) |
| `sandbox.credentials.envVars[].mode: "mask"` promoted from runtime-only to settable, with a new project-scope filter | **DELTA, unannounced** | `mode: v.enum(["deny","mask"])` `:49765` vs `A.literal("deny")` `:54066 (193)`; guard `:205162` | [credentials_mask_promotion.md](credentials_mask_promotion.md) |
| "Allow and remember" for a sandbox host: the session allow-set is now updated before the settings write, and the refresh is sequenced after it | **DELTA, unannounced** | `addSessionAllowedHost` 220=7 / **193=5**; `:824593`, `:824637` vs `:691039-691049 (193)` | [network_strict_allowlist.md](network_strict_allowlist.md) §6 |

Sandbox-**secondary** bullets (another module owns the primary write-up). Listed so the theme is fully
accounted for.

| Bullet (abridged) | Ver | Verdict | Anchor | Where |
|---|---|---|---|---|
| Worktree-isolated subagents redirecting git via `git -C`, `--git-dir`, `GIT_DIR`/`GIT_WORK_TREE` | .216 | NET_NEW | `GIT_WORK_TREE` in the scrub set `:312758` (220=2/193=0); `Uky` `:312569-312572`; `Yky` `:312738-312740`; 4× `tengu_agent_worktree_cwd_escape_blocked` `:314164`/`:314192`/`:314210`/`:314220` (220=4/193=0) | Path-containment context in [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §5; full state machine → [`53_subagent_limits/`](../53_subagent_limits/) |
| `isolation: 'worktree'` subagents running git-mutating commands on the main repo | .210 | NET_NEW | same four telemetry reasons; path-shape refusals `:312389`, `:312391` (`network-shaped` 220=3/193=0, `device-namespace` 220=4/193=0) | §5.1 / [`53_subagent_limits/`](../53_subagent_limits/) |
| Bash "argument list too long" in repos with many git worktrees | **.203** (was mis-filed as `.205`) | NET_NEW | `Ned` `:313211-313239` (`E2BIG` 220=3/193=1); worktree heuristic `hHy` `:313208-313210`, `:313244-313245` | [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §6.2 |
| Bash permission checks misjudging commands over 10,000 characters | .214 | DELTA — **decoy resolved here**: the `10,000 characters` literal at `:205495` is the Windows sandbox argv message, not the permission threshold | `jVg` `:205490-205499`; the real permission anchor is `AIe = 1e4` `:512643` + the new guard `:392119` (ground truth §6.4) | §6.1 (decoy); real bullet → [`38_permissions/`](../38_permissions/) |
| Fixed background session isolation not canonicalizing symlinked working directories | .217 | NET_NEW per scoping; anchor **verified this pass** (`could not canonicalize the path` 220=1 / **193=0**) | `:225693` | not covered → [`36_background_agents/`](../36_background_agents/) |
| Fixed workflow saves and scheduled-task writes following a symlink at `.claude` | .216 | DELTA (`symlink at` 2/2); anchor **verified this pass** | `:224564` — the message names all three of `.claude`, `.claude/worktrees`, `.claude/worktrees/<name>` | not covered → [`42_workflow/`](../42_workflow/) |
| `/rewind` no longer restores/deletes through symlinks or hard links | .216 | NET_NEW; anchor **verified this pass** (`symlink, hard link, or other non-regular file` 220=1 / **193=0**) | `:835183` | not covered → [`04_tools/`](../04_tools/) |
| Fixed read-only commands on Windows accessing network paths without a permission prompt | .216 | CARRYOVER literal (`UNC network paths require manual approval` 1/1); anchor **verified this pass** | `:214165` | not covered → [`38_permissions/`](../38_permissions/) |
| Fixed worktree creation following a repository-committed symlink at `.claude/worktrees` | **.212** (was mis-filed as `.214`) | NET_NEW literal (220=1 / **193=0**); anchor **verified this pass** — it is the *same* string as the `.216` workflow bullet, i.e. one guard serves both | `:224564` | **owned by [`36_background_agents/session_store_and_worktrees.md`](../36_background_agents/session_store_and_worktrees.md) §8** — worktree-lifecycle code, not sandbox code. *(Cycle D1 resolved: this pointer was dangling — `36_background_agents` had no row for it and `42_workflow` covers only the `.216` half, so nobody wrote it.)* |
| Fixed Windows worktree removal deleting files outside the worktree when an NTFS junction or directory symlink existed inside it | .205 | partial delta; `junction` 220=16 / **193=14**, `reparse` 220=9 / **193=4** | `:314048` (`shell cwd read-back resolves through a network symlink/junction; ignoring`), `:428286` (`new Set(["symboliclink","junction","hardlink"])`) — both read | **handed to [`36_background_agents/`](../36_background_agents/)** (worktree removal); mentioned in §5.2 |
| Agent view: sessions waiting on a sandbox prompt show "Needs input" | .212 | NET_NEW mechanism, carryover label (`needsInput` 220=6 / **193=0**; `Needs input` 2/2) | per scoping `:808871` (**not read by me**) | not covered → [`36_background_agents/`](../36_background_agents/) |
| Auto mode no longer overrides a PreToolUse hook `ask` for unsandboxed Bash | .211 | NET_NEW (`hookAskFloor` 220=3 / **193=0**); anchor **verified this pass** | `:400915` | not covered → [`38_permissions/`](../38_permissions/) |
| `EnterWorktree` asks for confirmation before entering a worktree outside `.claude/worktrees/` | .206 | NET_NEW per the false-delta register | `:406441` (**not read by me**) | not covered → [`53_subagent_limits/`](../53_subagent_limits/) |

**Coverage check.** `grep -ci sandbox` over this window's CHANGELOG returns **7** bullets; all 7 appear above
(5 primary, plus `.212` "Needs input" and `.211` `hookAskFloor` as secondary). Bullet 6 (`.214` PowerShell)
does not contain the word "sandbox" but *is* a sandbox-enforcement decision, and is claimed here.

---

## Findings the changelog does not contain

Each is proved in the linked section with a both-bundle count and a read site.

| Finding | Evidence | Section |
|---|---|---|
| **The Windows backend was rebuilt around a provisioned user account.** 193 had a network-only *group* model; 220 has a SID, ACL stamping, an egress fence and a per-user CA store | `sandboxUser` 12/**0**, `sandboxUserSid` 9/**0**, `srt-win install` 9/**0**, `holder-pid` 4/**0**, `WFP egress fence` 3/**0**, `trust-ca` 4/**0**; 193's `group status` at `:211319 (193)` | windows §1–4 |
| The Windows sandbox **verifies its own containment empirically** — it binds a port outside the WFP permit range and asks the fence to fail | `sSu` `:194832-194880`; exit 3 = *"WFP egress fence is not active"* `:194866-194870` | windows §4.1 |
| Windows **cannot deny a path that does not exist yet**; the ACL plan silently drops it, while Linux plans for it | `hos` `:194931-194942` (`if (!statSync(i, { throwIfNoEntry: !1 })) continue`) called from `CWg` `:195470`; contrast `Q5g` `:193612-193638` | windows §3.1 |
| The 2.1.193 `strictAllowlist` branch was **dead code**, not merely undocumented — no settings field *and* the runtime network object never sets the key | `:219482-219491 (193)` has no `strictAllowlist`; 193's only occurrence is the consumer at `:211506 (193)` | network §1 |
| A **trusted-settings-scope primitive** was extracted; it is the enabling refactor for both settings bullets *and* the `.214` PowerShell fix | `YLt` `:204062-204064`, 5 call sites (`:204674`, `:205177`, `:205185`, `:205209`, `:512803`); 193 had it inline once at `:219500 (193)` | network §3 |
| Aggregation direction encodes the security direction: `.some(=== true)` for tighten-only switches, `.find(!== undefined)` for loosening ones | `:205177` vs `:205185-205187` / `:205209-205211` / `xVg` `:204669` | network §3.1 |
| The restrictive-only SDK parent-tier filter gained **exactly three lines** this window, one per promoted switch | `:62415`, `:62422`, `:62430` vs `:57720-57746 (193)` | network §4 |
| "Allow and remember" for a sandbox host had a **race**: the settings write and `refreshConfig()` ran concurrently and the session allow-set was not updated | `addSessionAllowedHost` 220=7 / **193=5**; new sites `:824593`, `:824637` vs `:691039-691049 (193)` | network §6 |
| `filesystem.disabled` does **not** stop the harness's own Read/Edit tools, because the facade substitutes the configured lists back | `:205756-205767`; consumers `cas` `:214068-214078`, `rMd` `:437150-437220`, `:314242`, `:723744` | filesystem §3.4 |
| `sandbox.enabled: true` + `filesystem.disabled: true` is **weaker than no sandbox** for prompting, because `autoAllowBashIfSandboxed` still defaults true | `PVg` `:205327-205330`; the schema warns about it at `:49735` | filesystem §3.5 |
| The `filesystem.disabled` **pin** deliberately excludes `credentials.envVars` and includes `credentials.files`, because only the latter is FS-enforced | `xVg` `:204673`; `Sos` `:195404-195421`; env unset at `:205531` | filesystem §2.1, §3.2–3.3 |
| A **40-hop** partial-realpath resolver with a fail-closed `null` was added to the Linux deny loop; 40 matches Linux `MAXSYMLINKS` exactly | `Q5g` `:193612-193638`, `J5g = 40` `:194136`; new logs `:193920`, `:193923`; the 193 loop `:210574-210583 (193)` deduped on the literal and never resolved | filesystem §4.2 |
| A Windows argv budget of **30,000 of 32,767** wide chars, with `+3` per element for quote/space serialisation, and matching `windows_argv_too_long` telemetry | `uSu` `:195025-195050`; `jVg` `:205490-205499` (`windows_argv_too_long` 220=1 / 193=0) | filesystem §6.1 |
| The Windows ACL grant is **session-wide**, so a mid-session settings change cannot be applied — detected by a new file-access-set snapshot | `wSu`/`xWg`/`kWg` `:195475-195502` (`credFiles` 220=2 / 193=0); warning `:195716-195721` | filesystem §1.1, windows §1 |
| `mask`-mode credentials were **promoted to a public setting** with no changelog bullet, and the promotion required a new project-scope filter to avoid creating an exfiltration primitive | `mode: v.enum(["deny","mask"])` `:49765` vs `A.literal("deny")` `:54066 (193)`; guard `:205162` vs `:219471-219476 (193)` | credentials §2, §4 |
| Masked credential **files**, `decode: "jwt"` and `maskClaims` are still dark in 2.1.220 — the pattern is mid-flight | `maskedFileBinds` 220=6 / 193=0, `maskClaims` 220=12 / 193=0, files schema still `v.literal("deny")` `:49752` | credentials §5 |
| A JWT-mask misconfiguration **fails open** (variable left unprotected, loud warning) while a masked-file failure **fails closed** (degrades to deny) | `_bu` `:193395-193454`, `hbu` `:193292-193384`; `sandbox-runtime] WARNING` 220=4 / 193=0 | credentials §5 |
| On Windows a working `mask` config is a **hard startup failure** until `srt-win user trust-ca` has been run — the sandbox user has its own certificate store | `:195308-195325`; `trust-ca` 220=4 / **193=0** | credentials §3.1, windows §4.2 |
| The `.214` PowerShell bypass was **statement-level exclusion matching**: `I1_` returns true if *any* statement of a compound command matches, and `H4` then skips sandboxing for the whole command | `I1_` `:512771-512801` (the statement loop at `:512780-512799`), consumed at `:512824`; fix `nDd` `:512802-512807` | windows §5.3–5.4 |

### Correction to a provenance file

[`_scope_v215_220.md`](../00_overview/_scope_v215_220.md)'s `.216` bullet-1 note says line `195845` "gates
the Linux seccomp path". It does not: `WWg` (`:195844-195853`) is `getLinuxGlobPatternWarnings`, which collects
glob patterns that bubblewrap cannot express. The seccomp violation monitor is started at `:195281-195288`
and is **not** gated on `filesystem.disabled` — which is what makes the bullet's "keeps network and seccomp
isolation" claim true. Detail in [filesystem_disabled_and_paths.md](filesystem_disabled_and_paths.md) §1.

---

## Not covered

Honest list of what I did **not** verify in the bundle.

- **`.218` "Improved sandbox command restrictions for IDE interactions"** — UNANCHORED after 16 probes. All the
  macOS IDE-interaction knobs (`allowAppleEvents` 8/**9**, `allowMachLookup` 7/7,
  `enableWeakerNetworkIsolation` 7/**8**, `osascript` 12/12, `appleeventsd` 2/2) are carryover or *shrinking*,
  and `ideSandbox` / `IDE interactions` are 0/0 in both builds. The one structural candidate I had
  (`nDd` `:512802-512807`) turned out to be `.214`'s PowerShell fix, so this bullet now has **no** candidate
  at all.
- **Two secondary bullets whose primary anchors I did not read** — `.212` "Needs input" (`:808871`) and
  `.206` `EnterWorktree` confirmation (`:406441`). Both are carried from the scoping / false-delta files and
  marked as such; the owning modules should treat those line numbers as provenance, not verified citations.
  (The other five previously-unread anchors have now been read — see the verification record.)
- **`.205` Windows worktree removal via an NTFS junction** and **`.212` worktree creation through a committed
  `.claude/worktrees` symlink** — explicitly **handed to [`36_background_agents/`](../36_background_agents/)**
  (and to `42_workflow` for the workflow half of `:224564`). I read the three anchors (`:314048`, `:428286`,
  `:224564`) and confirmed the counts, but the mechanisms live in worktree-lifecycle code, not in the sandbox.
- **macOS backend depth.** The seatbelt profile builder (`/usr/bin/sandbox-exec` at `:194553`),
  `allowMachLookup` wildcard semantics and the macOS violation log monitor (`:195279-195280`) are only touched
  in passing. Linux (bubblewrap — `bubblewrap (bwrap) not installed` at `:193751`) and Windows (`srt-win`) got
  the detailed treatment because that is where this window's deltas are.
- **`srt-win`'s own implementation** — a separate Rust binary (`vendor/srt-win-src`, `:211291 (193)`); only the
  client-side invocation surface is in this bundle. WFP filter semantics and sublayer weights are not analysed.
- **The `/sandbox` slash command UI** (`:723744-723745`, `:724204`, `:724256`) beyond confirming it consumes
  the facade's FS config, and `/sandbox install` (`NPf`, `:724557-…`) beyond its outcome taxonomy.
- **`tlsTerminate`** (220=22 / 193=10) — a substantial, largely undocumented expansion (`excludeDomains`
  `:195225-195241`, ephemeral CA, the Windows thumbprint check). Cited where it corroborates other findings;
  it has no changelog bullet in this window and no doc of its own here.
- **Runtime behaviour on any platform.** Nothing was executed. All claims are static reads of the Linux target
  build.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (home for Sandbox)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-theme additions (merge source): [symbol_additions_v2_1_220_sandbox.md](../00_overview/symbol_additions_v2_1_220_sandbox.md)

Key symbols indexed by this module:

- `getTrustedSettingsSources` (`YLt`, `:204062-204064`) - the scope primitive the whole window turns on.
- `resolveFilesystemDisabledSetting` (`xVg`, `:204669-204677`) - net-new resolver with the managed pin.
- `getEffectiveFilesystemPolicy` (`ult`, `:204678-204686`) - new Windows veto + new settings edge.
- `buildEffectiveSandboxConfig` (`znr`, `:204847-205218`) - the one function that turns settings into runtime config.
- `initializeSandbox` (`e0u`, `:205534-205565`) - `kE.initialize` at `:205549`, settings watcher at `:205550-205554`.
- `shouldAllowNetworkConnection` (`gSu`, `:195194-195208`) - `strictAllowlist` enforcement (carryover).
- `SandboxHostVerdictCache` (`o8t`, `:809578-809611`) - `.198`'s memo; sticky deny, watermarked allow.
- `reconcileLateSymlinkedDenyPaths` (`DVg`, `:205249-205281`) - `.210`'s fix.
- `resolveDenyPathThroughSymlinks` (`Q5g`, `:193612-193638`) - the 40-hop fail-closed resolver.
- `snapshotWindowsFileAccessSet` (`wSu`, `:195475-195484`) - the one new `filesystem.disabled` site.
- `filterParentManagedSettingsRestrictiveOnly` (`EIh`, `:62382-62436`) - three new lines, one per promoted switch.
- `buildWindowsSandboxArgv` (`uSu`, `:195025-195050`) / `translateWindowsArgvTooLong` (`jVg`, `:205490-205499`).
- `buildE2BIGDiagnostic` (`Ned`, `:313211-313239`) - `.203`'s worktree attribution.
- `credentialEnvVarSchema` (`LLi`, `:49755-49778`) - the undocumented `mask` promotion.
- `getWindowsSandboxUserStatus` (`aNe`, `:194881-194897`) / `installWindowsSandbox` (`glo`, `:194903-194930`) / `verifyWindowsWfpEgress` (`sSu`, `:194832-194880`) - the unannounced Windows rewrite.
- `shouldRefusePowerShellUnderMandatorySandbox` (`ZLd`, `:430750-430759`) / `matchesTrustedWholeCommandExclusion` (`nDd`, `:512802-512807`) - `.214`'s bypass fix.
