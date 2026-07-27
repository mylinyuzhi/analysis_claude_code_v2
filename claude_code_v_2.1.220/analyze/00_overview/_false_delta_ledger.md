# False-delta ledger and verified net-new anchor register (v2.1.193 -> v2.1.220)

Consolidated from the five changelog-scoping agents of the foundation pass, which between them probed
**578 of the 579 changelog bullets** against both bundles. Two registers:

1. **[Carryover traps](#1-carryover-traps)** - **70** bullets whose headline literal ALREADY EXISTS in 2.1.193.
   Writing any of these up as an introduction is a defect. Each row gives the narrower true delta where one
   was isolated, or says plainly that it was not.
2. **[Verified net-new anchors](#2-verified-net-new-anchors)** - 125 anchors confirmed `220>0 / 193=0` with the
   2.1.220 line read. Safe to build on.

Provenance: `00_overview/_scope_v*.md` hold the full per-bullet tables; this file is the cross-cutting
index. Hand-verified additions live in [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).

> **How to use this in cross-validation:** every row in register 1 is a test. Grep the tree for the
> bullet's subject and confirm no module doc calls it new. Every row in register 2 is a citation to
> re-read in the live bundle.

---

## 1. Carryover traps

> ⚠ **A 220=N / 193=N count match does NOT prove carryover.** Obfuscated names are re-mangled
> between builds and ids get REUSED for unrelated decls, so an identical count can be two different
> functions. The `yBc` row below was wrong for exactly this reason. **Always read the decl in BOTH
> bundles before accepting an equal-count row as carryover.**

**70 bullets**, sorted by release range: 15 + 15 + 11 + **19** + 10.

> ⚠ **Corrected during cross-validation.** This register previously claimed 61 and contained only 51 —
> the entire `2.1.211-2.1.214` band was missing, i.e. the three largest releases of the window
> (132 bullets) had no traps to check against even though every agent brief instructs "check every
> bullet against register 1". The band was reconstructed from [`_scope_v211_214.md`](_scope_v211_214.md)
> and is marked **RECOVERED SECTION** below. Five of its rows were then found to be **false carryovers**
> that later passes overturned — see the Later-status column.

### 2.1.195-2.1.199 (15 traps)

| Changelog bullet | Anchor probed | 220 | 193 | Why it is a trap / the real delta |
|---|---|---|---|---|
| 2.1.196: "Added readable default names for sessions at start" | `sQt(` call sites vs 193 `nrt(` (⚠ **bare `sQt` is 5/7 — 193 REUSES the id** as the FleetView namespace object at `:678835 (193)`; `"axolotl"` itself is 1/1) | 4 | 4 | Both generators and both wordlists pre-exist: sQt at :111543 / I7n at :111524 map one-for-one to nrt at :147620 (193) / uwn at :147601 (193), and all three call sites match (220:527704/547196/737663 vs 193:585651/570090/622768). The generator is NOT new. |
| 2.1.196: Security — claude mcp list/get no longer spawn self-approved .mcp.json servers | `Pending approval` | 3 | 3 | The "⏸ Pending approval" constant (:567837) and the byte-identical mcp list/get help text (:585701/:585713 vs :613560/:613572 (193)) are pure carryover. Only the spawn-suppression is new; the visible label is old. |
| 2.1.198: Gateway — added Claude Platform on AWS (anthropicAws) as an upstream provider | `anthropicAws` | 35 | 46 | Count went DOWN. anthropicAws model ids and the "Claude Platform on AWS" display name are all at :95585-95838 (193). The genuinely new provider in this window is anthropicGoogleCloud (220=23/193=0) plus CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD (220=13/193=0) — which the bullet does not mention. The gateway upstream list itself is server-side. |
| 2.1.198: awsAuthRefresh now runs automatically on STS expiry | `awsAuthRefresh` | 10 | 10 | Exact count match. The refresh helper exists in 193; only the auto-invocation point can be a delta, and I could not isolate it. |
| 2.1.199: CLAUDE_CODE_RETRY_WATCHDOG raises default retries to 300 and lifts the cap of 15 | `CLAUDE_CODE_RETRY_WATCHDOG` | 2 | 2 | Both env vars are carryover (CLAUDE_CODE_MAX_RETRIES 220=5/193=4). The real delta is semantic: Pqs() at :534956 now does `if (t > X9s && !e)` and returns `e ? NU_ : $U_` with $U_=10/NU_=300/X9s=15 at :534989-534991, whereas O5f() at :603210 (193) had no watchdog awareness and always clamped to Ujo=15 (:603244 (193)). |
| 2.1.198/2.1.199: plan mode browser tool auto-allow / browser_batch read-only | `gif_creator (member of the 9-name browser auto-allow set)` | 9 | 8 | OKt at :34675-34684 is the SAME 9-name set as Kvt at :12536-12546 (193). The set is carryover; the delta is the new read-only predicate cOt (:288994) — count it as `cOt(` **220=6/193=0**; ⚠ bare `cOt` is 6/4 because 193 reuses the id as a CommonJS wrapper at `:161316 (193)` that now gates it, plus BEy (:289288) recursing into browser_batch sub-actions. |
| 2.1.199: claude agents rows show PR links as bare #N without the "PR" label | ``#${e.prNumber}`` | 4 | 4 | Identical at :160555 and :11182 (193); the "PR #"-prefixed renderer also survives at :722854. The bare-#N formatter is not new. |
| 2.1.199: SessionStart/Setup/SubagentStart hooks now show stderr on exit code 2 | `hook_non_blocking_error` | 24 | 23 | The attachment TYPE is long-standing (23 sites in 193). Only the wrapper Pur() at :520551 — which mints one with a synthetic exitCode:2 for these three non-tool events — is new. |
| 2.1.198: Subagents and compaction inherit extended thinking configuration | `yBc` — **RETRACTED, see note** | 2 | 2 | ⚠ **This row was WRONG and is corrected here.** The 2/2 count is an **identifier-reuse collision**, not carryover: 193's `yBc` is an unrelated vendored helper at `:9245 (193)` (aliased `s7e = yBc` at `:9253 (193)`), while 220's `yBc` is declared at `:119662` and used as `thinkingConfig: yBc(...)` at `:344538`. Two different functions that happen to share a re-mangled name — exactly the trap `_CONVENTIONS.md` §4.1 warns about. Correct net-new anchors for this bullet: `display: "omitted"` **220=1/193=0** and `sessionDisplayExplicit` **220=2/193=0**. Caught by the 51_headless_sdk agent and re-verified by the orchestrator. |
| 2.1.198: Explore agent inherits the session model, capped at opus | `model: "inherit"` | 3 | 2 | `model: "inherit"` already existed twice in 193 for other agents; only the Explore descriptor at :269303 flipped from "haiku" (:384852 (193)). The opus cap is also carryover — the literal `$Wu = "opus"` greps 220=1/193=0 ONLY because the identifier was re-mangled (it is DYa = "opus" at :384831 (193)). Classic _CONVENTIONS trap #1. |
| 2.1.198: Claude in Chrome is now generally available | `generally available` | 1 | 1 | The single hit (:508020) is unrelated prompt text. GA is a server/rollout announcement with no client anchor. |
| 2.1.196: claude agents status — stalled agents labeled "Needs attention" | `Needs attention` | 1 | 1 | The one 220 hit (:712396) is a skills/favorites picker section header, not the agents list. Do not cite it for the agents-status bullet. |
| 2.1.199: Remote sessions flapping Working/Idle; 2.1.198 "Reconnecting…" every ~52s | `Reconnecting` | 41 | 42 | Count went DOWN. No new Reconnecting literal; any delta is in timer/state logic, not strings. |
| 2.1.197: Sonnet 5 native 1M-token context window | `1M context` | 42 | 40 | The whole 1M-context plumbing (and context-1m, 220=3/193=2) predates .197. Only the catalog entry's `native_1m: !0` (:14196) is new — do not attribute 1M machinery to this release. |
| 2.1.196: claude plugin validate skipping local plugins whose source is "." | `plugin validate` | 7 | 7 | Exact count match; no new literal anywhere in the validate path I could find. |

### 2.1.200-2.1.205 (15 traps)

| Changelog bullet | Anchor probed | 220 | 193 | Why it is a trap / the real delta |
|---|---|---|---|---|
| 2.1.201: Sonnet 5 no longer uses the mid-conversation system role | `mid_conv_system` | 6 | 1 | The .201 change was real (193 hardcoded `claude-fable-5`; 220:150524 uses a capability lookup) but 220's `claude-sonnet-5` registry entry DECLARES `mid_conv_system` at 14207, so 2.1.220 uses it again. The bullet's stated behaviour is reverted - do not assert it for 220. |
| 2.1.200: voice dictation showed 'Voice connection failed' when no audio captured | `No audio detected from microphone` | 1 | 1 | The 'new' message is identical in both bundles (759581). The delta is check ORDER: 220's new jKf() at 759577 tests !hadAudioSignal before !wsConnected; 193 tested wsConnected first. Error codes voice_transcription_no_audio_signal/_no_speech are also 1/1. |
| 2.1.200: rendering flicker under tmux 3.4+ fixed via synchronized output | `DECRQM(2026)` | 1 | 1 | DECRQM(2026), SYNCHRONIZED_UPDATE (4/4), XTVERSION (3/3) and client_termtype (1/1) all pre-exist. The entire delta is one line: 193:160038 `if (process.env.TMUX) return !1;` -> 220:253386 `if (Z.TMUX) return tho === !0;` plus the f2u() undefined-while-probing wrapper. |
| 2.1.205: bg task notifications now state that no human input has occurred | `[SYSTEM NOTIFICATION - NOT USER INPUT]` | 1 | 1 | The banner prefix already existed with three lines (193:599351). Only the fourth line is new; grep `no human` (220=3/193=0) not the banner literal, or you will mis-score this as carryover. |
| 2.1.200/.203: strictAllowlist-class landmine - 'Voice connection failed' and axScreenReader | `axScreenReader` | 2 | 2 | Pre-flagged in _CONVENTIONS.md and confirmed: axScreenReader is 2/2 and isScreenReaderEnabled 12/12. The .200 screen-reader bullet's real delta is `screenReader: l` (4/0) in the markdown renderer, not the setting. |
| 2.1.202: Remote Control commands failing 'Unknown command' | `Unknown command` | 3 | 3 | Message literal unchanged; the fix is in the bridge command dispatcher. Citing the string proves nothing. |
| 2.1.202: opening a chat from claude agents failing 'currently running as a background agent' | `currently running as a background agent` | 3 | 3 | Identical counts (849864/868531/868586). Any delta must come from the worker-spawn guard, not this message. |
| 2.1.202: resume-by-name slow in repos with many git worktrees | `worktrees exceeds fanout cap` | 1 | 1 | The bridge-pointer worktree fanout cap at 545665 already existed in 193 - it is NOT this fix. listWorktrees 0/0, `git worktree list` 5/5. Label unanchored, not a delta on the cap. |
| 2.1.203: bg agent startup failures showing only 'exit_with_message' | `exit_with_message` | 1 | 1 | Single identical site (832207) in both bundles. |
| 2.1.203: literal ^[[I / ^[[O escape codes printed on reattach | `?1004` | 2 | 2 | The focus-event-reporting DECSET that produces ^[[I/^[[O is unchanged (258042, 258064). The fix is in the reattach teardown, unanchored. |
| 2.1.203 [VSCode]: Settings toggle 'Enable Remote Control for all sessions' | `Enable Remote Control for all sessions` | 1 | 1 | 1/1 at 452049 - the CLI-side string pre-exists; the toggle itself lives in the VS Code extension, which is not in this bundle. Do not present as a CLI delta. |
| 2.1.205: claude mcp add-from-claude-desktop stuck on unsupported name chars | `unsupported characters` | 1 | 0 | FALSE MATCH: `unsupported characters` is 1/0 but its only site (417735) is 'session id contains unsupported characters - check the --session-id value', unrelated to MCP import. add-from-claude-desktop itself is 1/1. |
| 2.1.203: removed startup 'claude command missing or broken' warnings | `claude command missing or broken` | 0 | 0 | The literal is absent from BOTH bundles, so the changelog wording is not the source string. The only checkable half is the compensating /doctor surface (`full setup checkup` 1/0 at 585327). |
| 2.1.203: bg agents inheriting a stale PATH; dropping ANTHROPIC_BASE_URL | `ANTHROPIC_BASE_URL` | 47 | 40 | High-frequency literal in both bundles; the +7 delta is spread across unrelated provider plumbing. A count bump on a common env var is not evidence for this bullet. |
| 2.1.203: binary size -7 MB and startup memory -7 MB via lazy dependency load | `image-processor.node` | 1 | 1 | Both bundled .node addons are unchanged (image-processor 1/1, audio-capture 2/2), and the bundle GREW +21.4% overall. The lazily-loaded dependency is something else; the size claim is not source-verifiable here. |

### 2.1.206-2.1.210 (11 traps)

| Changelog bullet | Anchor probed | 220 | 193 | Why it is a trap / the real delta |
|---|---|---|---|---|
| .208 "Added screen reader mode: --ax-screen-reader / CLAUDE_AX_SCREEN_READER / axScreenReader" | `axScreenReader` | 2 | 2 | All three surfaces already exist in 2.1.193 with a byte-identical description string. The only real 220 delta is the settings GROUP wrapper screenReader: { buildGate: () => !0, shape: ... } at :60188-60197 plus the group name joining XHh at :60112 (literal screenReader 220=9/193=3) and the plain-text renderer prop at :635795. Dark-launched in .193, promoted in .208 - never write it up as an addition. |
| .207 "disable via disableAutoMode in settings" (auto mode default-on for Bedrock/Vertex/Foundry) | `disableAutoMode` | 7 | 7 | The kill switch is pure carryover. The delta is default availability plus the four new tengu_auto_mode_env_onboarding_* gates (e.g. :736553, 220=2/193=0). Anchoring on disableAutoMode produces a false introduction. |
| .207 "Changed Bedrock, Vertex, and Claude Platform on AWS to default to Claude Opus 4.8" | ~~`aliases.opus.per_provider.bedrock`~~ → **`per_provider`** (the dotted form is a JSON *path*, not a literal: it greps **0/0**) | 4 | 0 | Not a literal trap but a VALUE supersession: the 2.1.220 alias table at :14461-14486 reads bedrock/vertex/anthropic_aws -> "claude-opus-5". Only foundry (4-6) and gateway (4-7) still lag. .219 overwrote .207's value, so the bundle contradicts the bullet. Report the per_provider mechanism, not the 4.8 value. |
| .206 "expired login failing every model with a misleading 'There's an issue with the selected model' error" | `There's an issue with the selected model` | 1 | 1 | Read at :228674 in 220 - the string already carries its 'Run /login to pick a different model.' suffix and exists identically in 193. The fix is upstream error routing, not a new message. |
| .206 "Bedrock multi-minute startup hang using an awsCredentialExport helper" / .207 #21 Windows AWS stall guard / .207 #16 SSO per-request / .208 #46 sso_region | `awsCredentialExport / sso_region / credential_process` | 12 | 12 | Every AWS/SSO bullet in this range sits behind an unchanged literal surface (awsCredentialExport 12/12, sso_region 9/9, credential_process 7/7). These are timeout/caching constant changes; a string-grep approach will either find nothing or over-claim. Diff numeric constants and call graphs instead. |
| .210 "plan approvals without edits being labeled '(edited by user)'" | `(edited by user)` | 2 | 2 | Both sites (:326160, :498208) pre-exist. The delta is when the label is applied and whether the plan file is overwritten; the new instrumentation to use instead is tengu_plan_exit_dialog_shown (:761290) and tengu_plan_review_step (:761415), both 220=1/193=0. |
| .207 "pasting the same text again expands the collapsed [Pasted text #N] placeholder" | `[Pasted text #` | 3 | 3 | Placeholder rendering is carryover at :454760/:454761/:454776; only the re-paste collapse logic changed and it carries no new literal. |
| .208 "Truncated event message received" now names the content-type (Bedrock gateway) | `Truncated event message received` | 2 | 2 | The message string is identical in both builds (:97362, :124031). Only an appended detail changed; do not present the message as new. |
| .210 "the session you pressed <- from stays visibly marked" | `keepInPlaceIds` | 2 | 2 | Looked like the obvious selection-stability anchor (:710562 inside xCf({searchQuery, favoriteIds, showDisabled, disusedDays, keepInPlaceIds})) but is 2/2. I initially recorded it as a delta and corrected it to CARRYOVER after re-counting - exactly the false-delta class the conventions warn about. |
| .206 "OAuth MCP servers requiring manual re-auth after a single failed token refresh" | `tengu_mcp_oauth_refresh_failure` | 2 | 1 | The 2:1 ratio looks like a delta but the 2.1.220 bundle contains TWO near-identical copies of the MCP client module (:286969... and :297016...) - every tengu_mcp_oauth_* gate appears twice. Any 2:1 count on an MCP-client literal in this build is a bundling artefact and proves nothing. |
| .207 "compound commands with cd prompting when the only redirect was /dev/null" | `cd-compound-redirect` | 1 | 1 | The bashMissKind label pre-exists (:391024); the /dev/null exemption lives inside the predicate. Consistent with _GROUND_TRUTH 6.4: the .21x Bash-permission bullets are single-line deltas inside mature machinery. |

### 2.1.211-2.1.214 (19 traps) — **RECOVERED SECTION**

> ⚠ **This band was missing from the ledger** and was recovered by the register-1 cross-validation pass.
> The omission mattered: `.211`/`.212`/`.214` are the three largest releases in the window (132 bullets),
> and every module agent was instructed to "check every bullet against register 1" — for this band there
> was nothing to check against. Rows below are reconstructed from
> [`_scope_v211_214.md`](_scope_v211_214.md), whose per-bullet probes carry the 220/193 counts.
>
> The **Later status** column records what the module and `by_version` passes subsequently proved. Five
> of these "traps" were **overturned** — the foundation pass's carryover call was wrong, and the real
> anchor was found later. That is why a carryover verdict is a *lead*, not a conclusion: the bias that
> protects against false deltas also manufactures false carryovers.

| Changelog bullet | Anchor probed | 220 | 193 | Later status (verified this pass) |
|---|---|---|---|---|
| `.211` #6 Vertex/Bedrock attempting default Opus at startup + spurious fallback | model-default probe | 1 | 1 | Stands as carryover; see [`47_models/`](../47_models/README.md) |
| `.211` #19 `/clear` not resetting the session cost counter | `resetCost` / `totalCostUsd` | 1 | 1 | Stands as carryover — every cost literal is identical |
| `.211` #20 Chrome setup pages failing to open on Windows | `openInBrowser` | 3 | 3 | **OVERTURNED.** `openInBrowser` is a decoy; the real anchor is `App Paths` **220=9 / 193=0**. See [`56_chrome_ide/chrome_ga_and_hardening.md`](../56_chrome_ide/chrome_ga_and_hardening.md) |
| `.211` #22 Background session titles showing the naming model's refusal text | `yLb` refusal regex | 1 | 1 | **OVERTURNED → NET_NEW.** `yLb` `:662344` is the GitHub bug-report path. Real fix is the naming prompt at `:335634-335636`: `The quotes are data to label` **220=1 / 193=0** |
| `.212` #12 Shell mode `!` not executing commands with file paths | path-prefix predicate | 1 | 1 | Stands as carryover |
| `.212` #13 Auto-mode denial notifications breaking characters mid-truncation | truncation helper | 1 | 1 | Stands; the delta is `content: oa(t,50)` `:418067` — see [`30_agent_team/`](../30_agent_team/README.md) |
| `.212` #20 Spurious "File has not been read yet" after a read with offset/limit | `File has not been read yet` | 1 | 1 | Stands as carryover; delta is in the read-tracking state |
| `.212` #21 `ExitWorktree` failing after `--continue`/`--resume` | `no active EnterWorktree session` | 1 | 1 | Stands; recorded as a **circular-deferral gap** — analysed in [`by_version/2.1.212.md`](../by_version/2.1.212.md) |
| `.212` #26 Stopping teammate sent the leader duplicate idle notifications | idle-notification path | 1 | 1 | **OVERTURNED → NET_NEW.** `id: "teammate-idle-notification"` `:759395` **220=1 / 193=0** |
| `.212` #30 @-mentions after partial read; plugin uninstall wrong marketplace | compound bullet | 1 | 1 | Stands; split across [`04_tools/`](../04_tools/README.md) and [`45_skills/`](../45_skills/README.md) |
| `.212` #34 Web search/fetch returning "API Error" as content + 529 retries | `tengu_convolute_arcades_retry*` | 1 | 1 | **RE-ATTRIBUTED.** That gate family is the *silent refusal-fallback continuation retry* (SDK schema `:838180`), **not** web search — `_scope_v211_214.md:134-135` misattributes it. The 529-backoff half is UNANCHORED. See [`57_api_reliability/retry_policy.md`](../57_api_reliability/retry_policy.md) |
| `.212` #36 Mid-conversation system block behind gateways/custom base URLs | `mid-conversation-system-2026-04-07` | 1 | 1 | Stands as carryover; the delta is the cache-breakpoint promotion `g1_` `:511909` |
| `.212` #46 Agent view / `--json` sandbox/MCP/managed-settings wait states | `Needs input` | 2 | 2 | Stands — label carryover, delta is the state machine |
| `.212` #48 Correction to the `.200` tmux note | tmux capability probe | 1 | 1 | Stands as carryover |
| `.214` #2 Permission-check bypass in Windows PowerShell 5.1 sessions | permission-analyzer probe | 3 | 3 | **OVERTURNED → DELTA.** Not in the permission path at all: the fix is the **sandbox exclusion gate** `nDd` `:512802-512807`, literal `must run sandboxed even when a statement matches an exclusion` **220=1 / 193=0**. See [`49_sandbox/windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md) |
| `.214` #13 Reasoning effort added to the `subagentStatusLine` payload | `subagentStatusLine` | 11 | 11 | **OVERTURNED → NET_NEW.** The container literal is carryover but the field is not: `effort: g.effort` `:750210` **220=1 / 193=0** |
| `.214` #24 PowerShell reporting `where.exe`/`fc.exe`/`diff.exe` as errors on exit 1 | `fc.exe` / `diff.exe` | 0 | 0 | Untestable — literals absent from **both** bundles |
| `.214` #39 Spurious "check your network" warning while the advisor was thinking | network-warning literal | 1 | 1 | Stands as carryover |
| `.214` #40 Hooks with exit code 2 not blocking when stdout JSON fails to parse | exit-code-2 path | 1 | 1 | Stands; see [`41_hooks/matching_and_exit_codes.md`](../41_hooks/matching_and_exit_codes.md) |

### 2.1.215-2.1.220 (10 traps)

| Changelog bullet | Anchor probed | 220 | 193 | Why it is a trap / the real delta |
|---|---|---|---|---|
| 2.1.219: Added `sandbox.network.strictAllowlist` setting to deny non-allowlisted hosts without prompting | `strictAllowlist` | 4 | 1 | The deny branch already shipped in 193 (193:211506, identical to 220:195200). Only the settings surface is new: schema field 49648, OR-only merge 62415, effective-settings projection 205177. The enforcement is carryover. |
| 2.1.216: Added `sandbox.filesystem.disabled` setting to skip filesystem isolation | `filesystem.disabled` | 7 | 6 | All enforcement branches (195430/195452/195572/195845/205758/205764) have 193 twins. New in 220 is only the settings-schema description at 49733-49739 and the projection at 195477. |
| 2.1.219: Removed Opus 4.7 from fast mode; /fast now applies to Opus 5 and Opus 4.8 | `includes("opus-4-7")` in the fast-mode eligibility fallback (⚠ recorded as 1/1; **actually 3/5** — and bare `opus-4-7` is 45/54, so neither count supports a carryover argument on its own) | 3 | 5 | REVERSE trap: opus-4-7 is STILL fast-mode eligible in 220 — capabilities array at 14324 lists fast_mode and mv() at 109473 still matches opus-4-7. The client-side delta is 4-6 out / opus-5 in; the 4.7 retirement is server/gate driven (tengu_sunset_penguin_opus47, 109493, 220=1/193=1). |
| 2.1.218: Fixed gateway spend metering to price Bedrock application-inference-profile ARNs | `application-inference-profile` | 6 | 6 | ARN detection already existed (111144 in 220 has a 193 twin). Only the rate-table lookup changed — no new literal, so this is CARRYOVER at the literal level. |
| 2.1.217: Improved footer PR badge links to be clickable hyperlinks; set FORCE_HYPERLINK=0 to opt out | `FORCE_HYPERLINK` | 2 | 2 | Reads as a new env var but 259540/259587 both have 193 twins. The env var and its opt-out are pre-existing; only the force-on-undetected-terminal decision is new. |
| 2.1.216: Fixed read-only commands on Windows accessing network paths without a permission prompt | `UNC network paths require manual approval` | 1 | 1 | Same decisionReason site at 214165 in both builds. The Windows-UNC prompt existed; the fix is that the read-only classifier path now reaches it. |
| 2.1.217: brace expansion in CLAUDE.md/SKILL.md paths frontmatter is now budget-bounded | `brace expansion` | 1 | 1 | The only hit (211144, 'Word contains brace expansion syntax') is the Bash permission parser, unrelated to frontmatter globs. Do not cite it as the budget fix — maxPatterns/pattern budget/expandedCount are all 0/0. |
| 2.1.216: Fixed a slowdown where message normalization cost grew quadratically | `quadratic` | 4 | 2 | All four 220 hits are vendor strings (BiquadraticFilterModel 611610, quadraticVertex 621538, canvas quadraticCurveTo 787331/787462). The 4-vs-2 count delta is pure vendor-bundle noise, not the fix. |
| 2.1.218: Fixed an engine teardown race that could start and abandon a phantom turn | `phantom` | 8 | 8 | Exactly 8/8; the phantom-parent transcript telemetry at 524022/524221/526163 is pre-existing and is about transcript parent pointers, not engine teardown. |
| 2.1.218: Fixed the Bedrock setup wizard failing assume-role profiles in partitioned AWS regions | `aws-us-gov` | 9 | 9 | Partition list is 9/9 identical and `assume-role` is 0/0 in both builds — no literal supports a delta here. |

---

## 2. Verified net-new anchors

125 rows (**122 unique anchors** — three are duplicated), grouped by theme so a module agent can find
its own in one place. Every row was reported as `220=N / 193=0` with the cited 2.1.220 line read by the
probing agent. **Still re-read the line yourself before citing it** — this register is provenance, not a
substitute.

> ⚠ **Audited in cross-validation: 107 of 125 confirmed, 18 defective.** Every row below was re-measured
> with `grep -F` against both bundles and its cited line re-read. Defects are annotated inline and
> summarised in [`_xval_register2.md`](_xval_register2.md). The classes were:
>
> - **3 rows are NOT net-new** — `claude agents --plugin-dir` (2/**1**, identical call at `:718546 (193)`),
>   the `["userSettings","flagSettings","policySettings"]` array (only the mangled name `a5g` is new;
>   the array is `JWp` at `:386042 (193)`), and the `user_abort` reject-decision (byte-identical to
>   `:427383-427386 (193)`).
> - **2 rows are identifier-reuse collisions** — the same `yBc` trap this register warns about, committed
>   *inside* the register: `jXs` is 4/**3** (193's is the vendored `__exportStar` helper at `:106549 (193)`;
>   re-anchor on `cVr("deleted")` = **1/0**) and `qde` is not 193-clean.
> - **6 rows cited the wrong line** (all corrected inline, all re-verified).
> - **6 rows carry a non-zero 193 count inside a "193=0" register** — narrower replacements are given in
>   the audit file.
> - **3 anchors are duplicated**, one (`tengu_repair_double_escaped_unicode`) with **contradictory**
>   `.202` / `.218` release attributions.
>
> **Lesson:** a "verified net-new" register is not self-validating. Two of its rows fell to the exact
> trap documented at the top of register 1 — so re-derive from a *stable string literal*, never from a
> mangled identifier, and measure with `grep -cF` (`_CONVENTIONS.md` §4 traps 1 and 8).

### background_agents (22)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| tengu_bg_roster_orphan_pruned (Nad adoptRosterOrphans dead-record prune) | `cli_inner_pretty.js:330930` | 1 | 0 | 2.1.195 |
| .orphaned- (quarantineJobTranscript rename-instead-of-delete) | `cli_inner_pretty.js:51506` | 1 | 0 | 2.1.196 |
| gh auth login for PR status (mur PR-status auth hint) | `cli_inner_pretty.js:316038` | 1 | 0 | 2.1.196 |
| tengu_bg_handoff_settle (Vvl bg settle: handoff kill vs crash) | `cli_inner_pretty.js:869956` | 1 | 0 | 2.1.196 |
| shipping is part of the task (bg session shipping prompt) | `cli_inner_pretty.js:507957` | 1 | 0 | 2.1.198 |
| gh pr create --draft (dRu shipping constant) | `cli_inner_pretty.js:224098` | 2 | 0 | 2.1.198 |
| tengu_bg_daemon_macos_aqua_wrap (launchctl asuser capability probe jjb) | `cli_inner_pretty.js:679939` | 1 | 0 | 2.1.199 |
| tengu_bg_respawn_suppressed (doSpawnUnlessSettledOnDisk) | `cli_inner_pretty.js:554662` | 2 | 0 | 2.1.199 |
| -(?:dev\|engine)\.(\d{8})\.t(\d{6}) | `cli_inner_pretty.js:552455` | 1 | 0 | 2.1.200 |
| CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS | `cli_inner_pretty.js:320147` | 6 | 0 | 2.1.200 |
| tengu_resume_stale_turn_suppressed | `cli_inner_pretty.js:320211` | 1 | 0 | 2.1.200 |
| tengu_resume_interrupted_turn | `cli_inner_pretty.js:320161` | 2 | 0 | 2.1.200 |
| kern.memorystatus_vm_pressure_level | `cli_inner_pretty.js:552638` | 1 | 0 | 2.1.203 |
| so the work carries over | `cli_inner_pretty.js:413946` | 1 | 0 | 2.1.203 |
| unlinked reparse point before removal | `cli_inner_pretty.js:224251` | 1 | 0 | 2.1.205 |
| evict: v.boolean().optional() | `cli_inner_pretty.js:330157` | 1 | 0 | 2.1.206 |
| f.delete(A.short), A.evict  (daemon kill arm, delete T.workers[A.short]) | `cli_inner_pretty.js:679374` | 1 | 0 | 2.1.206 |
| extensions.worktreeConfig (restore/unset-all after last linked worktree) | `cli_inner_pretty.js:225915` | 4 | 0 | 2.1.207 |
| tengu_slash_command_unavailable + reason unavailable_in_agent_view (/model carve-out at :806788) | `cli_inner_pretty.js:806776` | 2 | 0 | 2.1.209 |
| removeAgentWorktree: git no longer recognizes | `cli_inner_pretty.js:225854` | 2 | 0 | 2.1.211 |
| tengu_fleet_nudge_state / fleet_needs_input_nudge (needsInput 6/0) | `cli_inner_pretty.js:749960` | 1 | 0 | 2.1.212 |
| "needs input" park message for /install-github-app in background sessions | `cli_inner_pretty.js:701705` | 6 | 3 | 2.1.216 |

### permissions (14)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| indicator: "manual mode" | `cli_inner_pretty.js:58499` | 1 | 0 | 2.1.200 |
| session_transcript_tampering | `cli_inner_pretty.js:345225` | 1 | 0 | 2.1.205 |
| tengu_settings_auto_mode_rules_untrusted_source_ignored | `cli_inner_pretty.js:63563` | 1 | 0 | 2.1.207 |
| deferred_non_interactive | `cli_inner_pretty.js:455663` | 3 | 0 | 2.1.207 |
| tengu_uncompilable_ignore_pattern (site table claudemd_rule_globs/skill_paths/file_suggestions_ignore/worktreeinclude) | `cli_inner_pretty.js:224144` | 1 | 0 | 2.1.207 |
| too many to analyze for catastrophic removals | `cli_inner_pretty.js:394329` | 1 | 0 | 2.1.208 |
| hookAskFloor | `cli_inner_pretty.js:400915` | 3 | 0 | 2.1.211 |
| canonical repo root / revocation-resurrecting legacy overlay | `cli_inner_pretty.js:224977` | 1 | 0 | 2.1.211 |
| r.includes("/") \|\| !t  (inside `yap`, called as yap(_, r === "allow") @528493 and yap(gap(n), !0) @528541) | `cli_inner_pretty.js:528459` | 1 | 0 | 2.1.214 |
| Close-fd redirect is followed by a word — bash passes it to the command as a hidden argument | `cli_inner_pretty.js:210595` | 2 | 0 | 2.1.214 |
| Command too long for read-only analysis  (with AIe = 1e4 @512643) | `cli_inner_pretty.js:392119` | 1 | 0 | 2.1.214 |
| zsh $name[expr] / $name:mod in [[ ]] operand — recursive eval | `cli_inner_pretty.js:210371` | 1 | 0 | 2.1.214 |
| "--connection" / "--identity" in the docker daemon-redirect flag list hYr | `cli_inner_pretty.js:213939` | 1 | 0 | 2.1.214 |
| circuitBreaker: "suspiciousWindowsPath" (auto-mode classifier carve-out) | `cli_inner_pretty.js:528321` | 1 | 0 | 2.1.218 |

### subagent_limits (12)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| The /agents wizard has been removed. | `cli_inner_pretty.js:500583` | 1 | 0 | 2.1.198 |
| AgentApiErrorTerminationError (class m0o, msg "Agent terminated early due to an API error") | `cli_inner_pretty.js:346387` | 1 | 0 | 2.1.199 |
| PARTIAL output recovered from the agent (cutoffNote in jNy) | `cli_inner_pretty.js:345902` | 1 | 0 | 2.1.199 |
| tengu_agent_worktree_cwd_escape_blocked | `cli_inner_pretty.js:314164` | 4 | 0 | 2.1.203 |
| harness: subagent output matched instruction-shaped pattern(s):  | `cli_inner_pretty.js:345393` | 1 | 0 | 2.1.210 |
| A repository-committed symlink at .claude, .claude/worktrees, or .claude/worktrees/<name> | `cli_inner_pretty.js:224564` | 1 | 0 | 2.1.212 |
| CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION | `cli_inner_pretty.js:231403` | 4 | 0 | 2.1.212 |
| CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION | `cli_inner_pretty.js:231406` | 4 | 0 | 2.1.212 |
| tengu_agent_worktree_cwd_escape_blocked (context_lost / worktree_gone / shared_checkout) | `cli_inner_pretty.js:314164` | 4 | 0 | 2.1.216 |
| "GIT_WORK_TREE" env scrub list for worktree-isolated subagents | `cli_inner_pretty.js:312758` | 2 | 0 | 2.1.216 |
| CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS (gPu(); gty = 20; yty = 200; _ty = 200) | `cli_inner_pretty.js:231400` (env read; `:231411-231413` are the constants) | 3 | 0 | 2.1.217 |
| CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH (hee() resolver; var ZDu = 3; gate tengu_hazel_trellis) | `cli_inner_pretty.js:230897` (env read; `:230907` is `ZDu = 3`) | 3 | 0 | 2.1.217 + 2.1.219 |

### accessibility_ui (10)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| CLAUDE_CODE_DISABLE_MOUSE_CLICKS (ybe -> "scroll" mouse mode) | `cli_inner_pretty.js:164999` | 3 | 0 | 2.1.195 |
| no microphone (Linux voice: SoX present but no capture device) | `cli_inner_pretty.js:496027` | 1 | 0 | 2.1.195 |
| LC_TERMINAL === "iTerm2" \|\| Z.TERM_PROGRAM === "Apple_Terminal" (dHe Mac-over-SSH) | `cli_inner_pretty.js:261059` | 1 | 0 | 2.1.198 |
| screenReader: l | `cli_inner_pretty.js:635795` | 4 | 0 | 2.1.200 |
| stripVTControlCharacters | `cli_inner_pretty.js:545755` | 5 | 0 | 2.1.200 |
| tengu_left_arrow_editing_guard | `cli_inner_pretty.js:559928` | 1 | 0 | 2.1.203 |
| CLAUDE_AX_STARTUP_QUIET_MS (default 3000ms, clamp 600000ms) | `cli_inner_pretty.js:156240` | 2 | 0 | 2.1.217 |
| emojiCompletionEnabled + shortcode table (heart_eyes) + input_emoji_completion telemetry | `cli_inner_pretty.js:746222` | 2 | 0 | 2.1.217 |
| jXs() screen-reader deletion/typed-char announce mapper ("deleted" / "new line" / "tab" / "space") | `cli_inner_pretty.js:559693` | 4 | 0 | 2.1.218 + 2.1.219 |
| OSC-52 GNU screen DCS-chunked passthrough branch (emit mode raw / raw+dcs / dcs) | `cli_inner_pretty.js:216158` | 2 | 1 | 2.1.219 |

### tools (10)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| send_message_pin_guard (+ "now resolves to a different agent than it did earlier") | `cli_inner_pretty.js:418478` | 2 | 0 | 2.1.199 |
| askUserQuestionTimeout | `cli_inner_pretty.js:61218` | 9 | 0 | 2.1.200 |
| a model-supplied worktree outside (.claude/worktrees/) — EnterWorktree checkPermissions | `cli_inner_pretty.js:406441` | 1 | 0 | 2.1.206 |
| No entries at this offset | `cli_inner_pretty.js:312208` | 3 | 0 | 2.1.208 |
| ripgrep spawn blocked: null byte | `cli_inner_pretty.js:204180` | 3 | 0 | 2.1.208 |
| multiple hard links, which can alias a file outside the session's allowed directories | `cli_inner_pretty.js:514282` | 2 | 0 | 2.1.211 |
| pkill: refusing to run — this pattern matches the Claude CLI process (PID %s) | `cli_inner_pretty.js:313526` | 1 | 0 | 2.1.214 |
| PYTHONIOENCODING: "utf-8:surrogateescape", NO_COLOR: "1"  (+ $PSDefaultParameterValues['Out-File:Encoding']='utf8' @169565) | `cli_inner_pretty.js:169575` | 1 | 0 | 2.1.214 |
| "The user answered: … they may request clarification, changes, or that you not proceed" | `cli_inner_pretty.js:323485` | 1 | 0 | 2.1.216 |
| tengu_repair_double_escaped_unicode (ctp/vqs, repaired_strings + windows_path_skips) | `cli_inner_pretty.js:508476` | 1 | 0 | 2.1.218 |

### skills_plugins (8)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| tengu_stacked_slash_commands (+ epd = 5 cap at :344087, parser tpd at :343833) | `cli_inner_pretty.js:343685` | 1 | 0 | 2.1.199 |
| ⚠ **NOT NET-NEW** ~~claude agents --plugin-dir (commander action)~~ | `cli_inner_pretty.js:865022`; the identical `R("claude agents --plugin-dir")` clearPluginCache call is at `:718546 (193)` | **2** | **1** | 2.1.200 |
| pluginUsageLspGraceAppliedIds | `cli_inner_pretty.js:214905` | 3 | 0 | 2.1.206 |
| ⚠ **NOT NET-NEW** ~~a5g = ["userSettings","flagSettings","policySettings"]~~ — only the mangled NAME is new (`a5g` 3/0); the array itself is `JWp` at `:386042 (193)` | `cli_inner_pretty.js:191083` | **5** | **1** | 2.1.207 |
| plugin hook references ${user_config.*} in shell-form command | `cli_inner_pretty.js:519971` | 1 | 0 | 2.1.207 |
| maxLifetimeShows: 3 on the frontend-design plugin tip | `cli_inner_pretty.js:815597` | 6 | 3 | 2.1.217 |
| qde() frontmatter boolean coercer (yes/no/on/off/1/0 via Yt/su) | `cli_inner_pretty.js:158204` | 1 | 0 | 2.1.218 |
| skill frontmatter `background` field ('Only for `context: fork`. Forks run as background agents…') | `cli_inner_pretty.js:157797` | 3 | 2 | 2.1.218 |

### hooks (5)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| See CHANGELOG v2.1.195 (hook matcher exact-string warning) | `cli_inner_pretty.js:520215` | 1 | 0 | 2.1.195 |
| /^[a-zA-Z0-9_\|, -]+$/ (hook matcher fast-path char class, hyphen added) | `cli_inner_pretty.js:520221` | 2 | 0 | 2.1.195 |
| CLAUDE_RUNNER_ACTIVITY_FD | `cli_inner_pretty.js:840835` | 3 | 0 | 2.1.204 |
| hook callback timed out after | `cli_inner_pretty.js:520743` | 1 | 0 | 2.1.210 |
| DirectoryAdded hook event | `cli_inner_pretty.js:49396` | 20 | 0 | 2.1.219 |

### mcp (5)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| url_missing_type | `cli_inner_pretty.js:282631` | 2 | 0 | 2.1.202 |
| omitted from roots/list | `cli_inner_pretty.js:293424` | 2 | 0 | 2.1.203 |
| CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS (+ tengu_mcp_auto_background, tengu_mcp_tool_auto_backgrounded) — note `SEy` `:288857` returns 0 in non-interactive sessions unless `CLAUDE_AUTO_BACKGROUND_TASKS` is set | `cli_inner_pretty.js:288858` | 3 | 0 | 2.1.212 |
| "MCP policy predicate references environment variable(s) not present in the policy expansion env" | `cli_inner_pretty.js:281949` | 2 | 0 | 2.1.219 |
| "Leading or trailing whitespace in: …" MCP config warning | `cli_inner_pretty.js:282659` | 1 | 0 | 2.1.219 |

### performance (5)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| highWaterMark: 4194304 | `cli_inner_pretty.js:540228` | 1 | 0 | 2.1.205 |
| (r ?? mM(e))  precomputed deny-rule array threaded into WB | `cli_inner_pretty.js:513296` | 1 | 0 | 2.1.208 |
| let r = mM(t);  (tool-pool assembly hoist inside nve) | `cli_inner_pretty.js:425005` | 1 | 0 | 2.1.208 |
| more ${Et(e, "row")} not shown  (with _Up = 200 at :636511) | `cli_inner_pretty.js:636279` | 1 | 0 | 2.1.208 |
| didClose for evicted document  (with zCy = 50 at :307353) | `cli_inner_pretty.js:307185` | 3 | 0 | 2.1.208 |

### auth_providers (4)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| api_request_api_key_helper_failed (with WU_ = 2 at :534999) | `cli_inner_pretty.js:534688` | 1 | 0 | 2.1.208 |
| tengu_oauth_token_refresh_lock_compromised_pre_post (+4 sibling CAS gates @155345-155395) | `cli_inner_pretty.js:155352` | 1 | 0 | 2.1.211 |
| skipping settings-sourced NODE_EXTRA_CA_CERTS under host-managed provider (host-managed 6/0) | `cli_inner_pretty.js:825529` | 1 | 0 | 2.1.212 |
| tff = 3 * rff login-expiry threshold ($xr(), refreshTokenExpiresAt) | `cli_inner_pretty.js:687512` | 2 | 0 | 2.1.217 |

### telemetry (4)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| OTLP request body chunk is not string or Uint8Array (addRequest monkey-patch setting Content-Length) | `cli_inner_pretty.js:494957` | 1 | 0 | 2.1.212 |
| CLAUDE_CODE_OTEL_CONTENT_MAX_LENGTH (with q1g = 61440 @167289) | `cli_inner_pretty.js:167274` | 2 | 0 | 2.1.214 |
| traceparent: Z.TRACEPARENT (X1g + stored-context fallback Bio/les/tlu @167322-167331) | `cli_inner_pretty.js:167351` | 2 | 0 | 2.1.214 |
| ⚠ **NOT NET-NEW** ~~logDecision({decision:"reject",source:{type:"user_abort"}}) in the cancelled branch~~ — `:395796-395799` is byte-identical to `:427383-427386 (193)` in the same `case "cancelled":` | `cli_inner_pretty.js:395797` | **1** | **1** | 2.1.216 |

### models (3)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| Org default (iQt attribution ladder at :110736) | `cli_inner_pretty.js:111167` | 2 | 0 | 2.1.196 |
| claude-sonnet-5 (catalog entry, native_1m:!0, window 1e6) | `cli_inner_pretty.js:14177` | 35 | 0 | 2.1.197 |
| claude-opus-5 model registry entry (1M native context, fast_mode capability) | `cli_inner_pretty.js:14365` | 42 | 0 | 2.1.219 |

### remote_control (3)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| does not point at api.anthropic.com (H4_ remote-control blocker builder) | `cli_inner_pretty.js:535671` | 1 | 0 | 2.1.196 |
| background_tasks_changed | `cli_inner_pretty.js:837671` | 11 | 0 | 2.1.205 |
| Remote Control provider-naming chain (mbr + ecp/tcp remediation strings) | `cli_inner_pretty.js:535665` | 3 | 3 | 2.1.219 |

### slash_cli (3)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| --bg and --print conflict (validator $Gb) | `cli_inner_pretty.js:683498` | 1 | 0 | 2.1.198 |
| === "daemon" ? e.slice(t + 1) : null (_Al argv peeler) | `cli_inner_pretty.js:133` | 1 | 0 | 2.1.199 |
| full setup checkup | `cli_inner_pretty.js:585327` | 1 | 0 | 2.1.205 |

### system_prompt (3)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| launched you (subagent system-prompt: agent messages are task direction, not approval) | `cli_inner_pretty.js:507936` | 1 | 0 | 2.1.198 |
| No human input has been received | `cli_inner_pretty.js:226519` | 1 | 0 | 2.1.205 |
| isHumanTypedPrompt | `cli_inner_pretty.js:516671` | 2 | 0 | 2.1.210 |

### workflow (3)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| workflowSizeGuideline | `cli_inner_pretty.js:60914` | 21 | 0 | 2.1.202 |
| tengu_repair_double_escaped_unicode | `cli_inner_pretty.js:508476` | 1 | 0 | 2.1.202 |
| workflowSizeGuideline / tko = { small: 5, medium: 15, large: 50 } / cEd = "medium" | `cli_inner_pretty.js:389147` | 21 | 0 | 2.1.219 |

### api_reliability (2)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| ERR_STREAM_PREMATURE_CLOSE | `cli_inner_pretty.js:540251` | 1 | 0 | 2.1.202 |
| ERR_HTTP2_GOAWAY_SESSION / streamRejectedByGoawaySession | `cli_inner_pretty.js:165078` | 1 | 0 | 2.1.208 |

### auto_memory (2)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| over its ${r.capDesc} read limit (MEMORY.md index; ht_=0.8, tPd=0.7) | `cli_inner_pretty.js:434076` | 1 | 0 | 2.1.210 |
| splicedSizeBytes / spliceActive | `cli_inner_pretty.js:434116` | 3 | 0 | 2.1.211 |

### code_review (2)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| tengu_review_remote_precondition_recovery | `cli_inner_pretty.js:496656` | 13 | 0 | 2.1.212 |
| no_merge_base_empty_tree_fallback / empty_tree_bundle (6/0) | `cli_inner_pretty.js:497365` | 1 | 0 | 2.1.214 |

### headless_sdk (2)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| scaleBudgetToQueue / drainStdoutBeforeExit / stdout drain timeout (exit) | `cli_inner_pretty.js:20552` | 3 | 0 | 2.1.214 |
| mcp_server_errors (init-event field + documented open-set type taxonomy) | `cli_inner_pretty.js:836952` | 3 | 0 | 2.1.219 |

### sandbox (2)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| getOrClassify (class o8t, host:port verdict cache w/ conversation watermark) | `cli_inner_pretty.js:809580` | 4 | 0 | 2.1.198 |
| Resolved symlinked deny path | `cli_inner_pretty.js:193923` | 1 | 0 | 2.1.210 |

### agent_team (1)

| Anchor | 2.1.220 line | 220 | 193 | Release |
|---|---|---|---|---|
| reserved for plugin namespacing — agent names must not contain ':' | `cli_inner_pretty.js:269872` | 3 | 1 | 2.1.218 |

