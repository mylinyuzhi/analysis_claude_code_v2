# 38_permissions — Permissions and auto mode (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
Hand-verified anchors and the false-delta trap list: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).

---

## The window's story for this theme, in one paragraph

Permissions was the second-busiest theme in this window (13 bullets in `.211`-`.214` alone). Three things
happened, and only one of them is what the changelog emphasises.

1. **Auto mode stopped being opt-in.** `.207`'s bullet reads like a provider-availability tweak; in the
   code it is *one line* — a provider predicate that read `process.env.CLAUDE_CODE_ENABLE_AUTO_MODE`
   became `return !0`. Everything else in `.207`/`.210`/`.212` is the consequence: a five-event opt-in
   dialog was deleted and replaced by a four-event *configuration* prompt, a 3-question setup wizard
   appeared, the rules' trusted settings scopes were narrowed to exclude the repo, and a
   `claude auto-mode reset` subcommand was added to undo a wizard run.
2. **The classifier became an adjudicator, not just an extra check.** `.218` introduced
   `circuitBreaker` (220=12 / 193=0) — a *name* on a non-classifier-approvable safety check that makes it
   eligible for model adjudication in auto mode. Three checks got names (`dangerousRemoval`,
   `backgroundOperator`, `suspiciousWindowsPath`), which is precisely the changelog's three. `.211` had
   already fixed the boundary in the other direction: `hookAskFloor` forbids the classifier from lowering a
   *user-installed hook*'s `ask`. Harness heuristics may be relaxed by a model; user instructions may not.
3. **`.214` was a nine-bullet hardening sweep on a mature machine, and most of it is one line per bullet.**
   The redirect fix is three lines of control flow; the over-length fix is one guard; the docker fix is
   seven new strings in a list; the `file` fix is three *deleted* map keys. Two of the nine bullets
   (`.214` #2 PowerShell 5.1, #7 remote-prompt ordering) I could not anchor at all, and in both cases the
   anchor proposed during scoping turned out to be a **different feature** — the encoding prologue and a
   growth upsell respectively.

The single most useful finding for a reader is the shape of the deltas: **this theme's mechanisms were
already built in 2.1.193.** Nine of the fourteen anchored bullets are a changed constant, a changed list,
a deleted map key, or a hoisted variable. Anyone diffing by literal count will over-report; anyone
diffing by control flow will find the real changes.

---

## Documents

| Doc | Covers | Bullets |
|---|---|---|
| [`security_hardening_214.md`](security_hardening_214.md) | the `.214` Bash-analyzer sweep: fd-redirect fail-closed, zsh `[[ ]]` subscripts, over-length, `help`/`man`, `file`, docker, plus the two disproven anchors | `.214` ×10 |
| [`auto_mode_availability_and_gating.md`](auto_mode_availability_and_gating.md) | the `.207` one-line opt-in removal, the four-gate availability resolver, `disableAutoMode` carryover, settings-source trust, env onboarding, setup wizard, `claude auto-mode reset`, repo-visibility lookup | `.196`, `.207` ×2, `.210` ×1, `.212` ×1 |
| [`classifier_adjudication.md`](classifier_adjudication.md) | `circuitBreaker`, `hookAskFloor`, the scope preamble / outcome taxonomy / intent rule, staged `xml_s1`/`xml_s2` + severity grammar, queueing, the classifier beta and its dead self-heal | `.211` ×1, `.216` ×1, `.218` ×2 |
| [`rule_matching_and_glob_semantics.md`](rule_matching_and_glob_semantics.md) | `dir/**` anchoring (allow vs deny vs hook `if:`), matcher compilation + LRU cache, deny-array hoisting, worktree-root rule persistence with its ownership gate, malformed-pattern hygiene | `.207` ×1, `.208` ×1, `.210` ×1, `.211` ×1, `.214` ×2 |
| [`destructive_command_rules.md`](destructive_command_rules.md) | the 66-id classifier rule set, transcript-tamper rule, unresolvable-variable rule, command-substitution removal scan with its two budgets, the static `emr` analyzer | `.205` ×2, `.208` ×1, `.214` ×2 (cross-ref) |

Nothing was merged away; all five planned documents had enough source substance. `.214` #1 and #44 are
covered in `rule_matching_and_glob_semantics.md` rather than `security_hardening_214.md` because the
interesting content is the allow/deny asymmetry, not the shell analyzer.

New symbols are staged in
[`../00_overview/symbol_additions_v2_1_220_permissions.md`](../00_overview/symbol_additions_v2_1_220_permissions.md)
for merge into `symbol_index_infra_platform.md`.

---

## Per-bullet ledger

Every changelog bullet in the `.195`-`.220` window whose primary or secondary theme is permissions.
Verdicts: **NET_NEW** (new mechanism, 193=0 proven) · **DELTA** (existing mechanism, changed constant /
list / control flow) · **CARRYOVER** (bullet describes pre-existing code) · **UNANCHORED** (no anchor found
in 2.1.220) · **OTHER MODULE** (permissions-adjacent, owned elsewhere).

Counts in the Anchor column are `220 / 193` for the named literal.

| # | Ver | Bullet (abridged) | Verdict | Anchor (2.1.220) | Doc section |
|---|---|---|---|---|---|
| 1 | `.196` | `claude agents --dangerously-skip-permissions` fell back to auto mode; now shows bypass disclaimer | **UNANCHORED** (scoping's `:683507` disproven) | `--bg with bypassPermissions requires accepting the disclaimer` **1 / 1** | availability §1 |
| 2 | `.198` | excessive background classifier requests for repeated sandbox network hosts | OTHER MODULE (sandbox) | — | — |
| 3 | `.199` | `claude --dangerously-skip-permissions daemon <sub>` treated as a prompt | OTHER MODULE (slash_cli) | `=== "daemon" ? e.slice(t + 1) : null` | — |
| 4 | `.200` | "default" permission mode renamed "Manual"; `manual` accepted as an alias | **DELTA** | descriptor `:58496-58503` (193 `:54284`); `fL` preprocessor `:58323`, wired at `:58492`/`:58493` | this README §"Mode rename" |
| 5 | `.202` | `/remote-control` showing the wrong permission mode in mobile/web | OTHER MODULE (remote_control) | — | — |
| 6 | `.203` | grey ⏸ badge in the footer in manual permission mode | **NET_NEW** | `indicator: "manual mode"` **1 / 0** `:58499`; `X4r = "⏸"` `:58419`; `color: "inactive"` `:58501` | this README §"Mode rename" |
| 7 | `.205` | auto mode rule blocking session-transcript tampering | **NET_NEW** | `session_transcript_tampering` **1 / 0** `:345225`; rule text `:443406` | destructive §2 |
| 8 | `.205` | auto mode asks before `rm -rf` on an unresolvable variable | **NET_NEW** | `Unverifiable Deletion Target` **1 / 0** `:443379` | destructive §3 |
| 9 | `.206` | `--permission-prompt-tool` on an MCP server crashing on cold start | OTHER MODULE (mcp) | `Permission prompt tool` 2 / 1 | — |
| 10 | `.207` | auto mode available without `CLAUDE_CODE_ENABLE_AUTO_MODE` on Bedrock/Vertex/Foundry; `disableAutoMode` | **NET_NEW** (1 line); `disableAutoMode` is **7 / 7 carryover** | `Eer` `:150416-150419` vs `ont` `:135186-135189 (193)`; onboarding gates `:736553` etc. **2 / 0** | availability §1, §3, §7 |
| 11 | `.207` | compound `cd` prompting when the only redirect was `/dev/null` | **CARRYOVER label / DELTA inside** | `cd-compound-redirect` **1 / 1** `:391024` | not covered (see below) |
| 12 | `.207` | malformed bracket patterns in rules globs / skill paths / `.ignore` / `.worktreeinclude` | **NET_NEW** | `tengu_uncompilable_ignore_pattern` **1 / 0** `:224144`; sites `:224133-224137` | glob §4 |
| 13 | `.207` | auto mode no longer reads `autoMode` from `.claude/settings.local.json` | **NET_NEW** | `tengu_settings_auto_mode_rules_untrusted_source_ignored` **1 / 0** `:63563`; scope list `H3r` `:63681` vs `Uys` `:58827 (193)` | availability §5 |
| 14 | `.207` | remote managed settings recorded as consented from `claude -p` / SDK | OTHER MODULE (auth_providers) | `deferred_non_interactive` 3 / 0 `:455663` | — |
| 15 | `.208` | multi-second per-turn slowdowns with many deny/ask rules; matchers compiled once and cached | **NET_NEW** (two caches) | `s9s`/`r9s` `:528463`/`:529043`; `(r ?? mM(e))` **1 / 0** `:513296`; hoist `:425005` | glob §2 |
| 16 | `.208` | catastrophic removals inside `$(…)`/backticks/`<(…)` now prompt in bypass and auto | **NET_NEW** | `too many to analyze for catastrophic removals` **1 / 0** `:394329`; `inside command substitution` **2 / 0** `:394351` | destructive §4 |
| 17 | `.210` | startup warning for `Write(path)` / `NotebookEdit(path)` / `Glob(path)` rules | **UNANCHORED** | none — 10 probes run, all 0 or carryover | glob §5 |
| 18 | `.210` | `/doctor` skipping its auto-mode-default proposal on Bedrock/Vertex/Foundry | **NET_NEW** (doc text) | `make auto mode the default permission mode` **1 / 0** `:785865`; rationale `:785812` | availability §4 |
| 19 | `.210` | classifier defaults to Sonnet 5 for external sessions, validated then pinned | **DELTA**; `CLAUDE_CODE_AUTO_MODE_MODEL` is **1 / 1 carryover** | classifier beta `auto-mode-classifier-2026-07-16` **1 / 0** `:109221`; queue `:442629` | classifier §6 |
| 20 | `.210` | screen reader announces permission-mode changes on Shift+Tab | OTHER MODULE (accessibility_ui) | — | — |
| 21 | `.211` | permission previews relayed to chat channels strip bidi / zero-width / look-alike quotes | OTHER MODULE (remote_control) | strip-regex family 10 / 3 | — |
| 22 | `.211` | auto mode overriding a `PreToolUse` hook's `ask` for unsandboxed Bash | **NET_NEW** | `hookAskFloor` **3 / 0** `:400915`, `:400917`, `:513734` | classifier §2 |
| 23 | `.211` | "always allow" rules save at the repository root; persist across worktrees | **NET_NEW** | `canonicalGitRoot` **3 / 0** `:62290`; `canonical repo root` **1 / 0** `:224977`; ownership gate `yIh` `:62311` | glob §3 |
| 24 | `.212` | `claude auto-mode reset` (+`--yes`) restores default auto-mode config | **NET_NEW** | `auto-mode reset` **1 / 0** `:865404`; confirmation `:865396`; scope-pinned write `:865400`; `LOm` `:865434` | availability §6 |
| 25 | `.212` | plan mode auto-running file-modifying Bash without a prompt or `canUseTool` | OTHER MODULE (plan_mode) | — | — |
| 26 | `.212` | auto-mode denial notifications breaking characters when truncated mid-emoji | **CARRYOVER-trap** | `grapheme` 32 / 32; `truncateToWidth` 2 / 2; `mid-emoji` 0 / 0 | not covered |
| 27 | `.212` | Task tool `mode` parameter deprecated; subagents inherit the parent mode | OTHER MODULE (subagent_limits) | `mode parameter` 0 / 2 (verified removal) | — |
| 28 | `.214` | `Edit(src/**)` allow rules auto-approving nested `dir/` anywhere | **NET_NEW** | `r.includes("/") \|\| !t` **1 / 0** `:528459`; call site `:528493` | glob §1 |
| 29 | `.214` | permission-check bypass in Windows PowerShell 5.1 sessions | **UNANCHORED** (scoping's `:169565` disproven — it is the encoding prologue) | `PowerShell 5.1` **3 / 3** | hardening §8 |
| 30 | `.214` | Bash permission checks fail closed on fd-redirect forms bash parses differently | **NET_NEW** | `Close-fd redirect is followed by a word` **2 / 0** `:210595`, `:210636`; pre-pass `M0u(t)` `:209809` | hardening §1 |
| 31 | `.214` | commands over 10,000 characters now always prompt | **NET_NEW** (1 line) | `Command too long for read-only analysis` **1 / 0** `:392119`; `AIe = 1e4` `:512643` | hardening §3 |
| 32 | `.214` | zsh variable subscripts/modifiers in `[[ ]]` treated as inert text | **NET_NEW** (the `[[ ]]` variant only; the bare-concat variant is **1 / 1**) | `zsh $name[expr] / $name:mod in [[ ]] operand` **1 / 0** `:210371` | hardening §2 |
| 33 | `.214` | `help`/`man` no longer auto-approved for unsafe options, cmd-subs, backslash paths | **NET_NEW** (2 parts) | `help` callback `:392567-392568` (193 `:306065` had `safeFlags {-d,-m,-s}`); `man` `Lf`+`\`+`~` `:392546-392548` | hardening §4 |
| 34 | `.214` | permission prompts on remote sessions proceeding before the local dialog | **UNANCHORED** (scoping's `tengu_rc_permission_nudge` disproven — it is a growth upsell) | `pending_permission_requests` 12 / 9 is the plausible home | hardening §9 |
| 35 | `.214` | permission prompts for `docker` daemon-redirect flags (incl. Podman shim) | **NET_NEW** (list only; predicate byte-identical) | `hYr` `:213928-213944` = **15 entries** vs `oYi` `:227647 (193)` = 8; `"--connection"` **1 / 0** `:213939` | hardening §6 |
| 36 | `.214` | single-segment `dir/**` hook `if:` conditions match only `<cwd>/dir` | **NET_NEW** | `yap(gap(n), !0)` **1 / 0** `:528541` | glob §1 |
| 37 | `.214` | `file -m`/`--magic-file` and `-f`/`--files-from` require permission | **NET_NEW** (deletion) | `"--magic-file"` **0 / 1**; table `:392410-392445` | hardening §5 |
| 38 | `.216` | auto mode denying commands with "HTTP 401" classifier errors after token rotation | **UNANCHORED** (`HTTP 401` **3 / 0** but all three are Claude Design; OAuth-401 machinery is 1/1, 7/7, 2/2, 7/7) | `errorKind` 39 / 22 is the plausible home | classifier §6 |
| 39 | `.216` | Bash permission checking for compound statements with redirects inside `&&` lists / negations | **CARRYOVER label** | `Redirect involving /dev/tcp or /dev/udp` **1 / 1** `:391107` | not covered |
| 40 | `.216` | read-only commands on Windows accessing network paths without a prompt | **CARRYOVER** | `UNC network paths require manual approval` **1 / 1** `:214165` (193 `:227863`) — same `decisionReason` site in both | not covered |
| 41 | `.216` | PowerShell tool permission validation of commands with invisible Unicode | OTHER MODULE (tools) | `U+200B` etc. `:323491` | — |
| 42 | `.216` | telemetry misreporting permission denials (failed prompts / interrupts) | OTHER MODULE (telemetry) | `{ decision: "reject", source: { type: "user_abort" } }` `:395797`; `user_abort` 5 / 4 | — |
| 43 | `.217` | Remote Control not showing a pending permission prompt to late-joining viewers | OTHER MODULE (remote_control) — anchor located here | `pending_permission_requests` **12 / 9**; contract doc `:839684` | hardening §9 |
| 44 | `.218` | dangerous-rm, background-`&`, suspicious-Windows-path no longer open dialogs | **NET_NEW** | `circuitBreaker` **12 / 0**; `:390684`, `:394435`, `:528321`; gate `:513745` | classifier §1 |
| 45 | `.218` | trust dialogs name the repository root the grant covers | **UNANCHORED** | `repository root` **5 / 5**, none a trust dialog; `tengu_trust_dialog_shown` payload byte-identical (13 fields). One real trust delta found: `gated_grants_backstop_declined` **1 / 0** `:831181` | this README §"Not covered" |
| 46 | `.218` | plan mode with auto no longer prompts for Bash the analyzer can't prove read-only | **NET_NEW** | `gnn`'s plan disjunct `:325873`; `Qqs` `:513122` | classifier §1 |
| 47 | `.219` | `sandbox.network.strictAllowlist` setting | OTHER MODULE (sandbox) | 4 / 1 — see ground truth §3 | — |
| 48 | `.219` | managed MCP allowlist/denylist `${VAR}` resolution | OTHER MODULE (mcp) | `policy expansion env` 2 / 0 | — |

### Ledger roll-up

| Verdict | Count |
|---|---|
| NET_NEW | **19** |
| DELTA | **2** |
| CARRYOVER / CARRYOVER-trap | **4** |
| UNANCHORED | **6** |
| OTHER MODULE | **12** |
| Sub-total assessed here | **31** of 48 rows |

Of the 6 UNANCHORED rows, **4 had an anchor proposed during scoping that this pass disproved** by reading
the site: `.196` #1, `.214` #2, `.214` #7, `.216` #3. That is the single highest-value output of this
module — those four anchors would each have produced a plausible, wrong paragraph.

---

## Mode rename: `default` → `Manual` (`.200`, `.203`)

Not big enough for its own document, so it lives here. Both bullets are one table entry plus one
preprocessor.

**The descriptor table** (`dWl`, `:58495-…`). 2.1.193 (`:54284`):

```javascript
default: { title: "Default", shortTitle: "Default", symbol: "", color: "text", external: "default" },
```

2.1.220 (`:58496-58503`):

```javascript
default: {
  title: "Manual",
  shortTitle: "Manual",
  indicator: "manual mode",
  symbol: X4r,
  color: "inactive",
  external: "default",
},
```

Four changes in one object: the two labels, a **new `indicator` field** (193 descriptors had none), the
symbol `X4r = "⏸"` (`:58419`), and `color: "text"` → `"inactive"` — which is the grey in `.203`'s "grey ⏸
badge". `indicator: "manual mode"` is 220=1 / 193=0.

**The alias.** `fL` (`:58323-58325`):

```javascript
function fL(e) {
  return e === "manual" ? "default" : e;
}
```

It is installed as a **zod preprocessor** on two enums (`:58492-58493`):

```javascript
(pWl = Se(() => tc.preprocess(fL, tc.enum(J5)))),
(r3r = Se(() => tc.preprocess(fL, tc.enum(Yye)))),
```

and called directly at the settings `defaultMode` read (`:58325`-consumers, e.g. `:118944`
`let y = fL(n.permissions.defaultMode);`) and in `BK` (`:58326-58329`).

**Why a preprocessor rather than adding `"manual"` to the enum?** Adding a member would mean every
downstream `switch` on the mode has to handle two spellings of one mode forever, and the persisted
`toolPermissionContext.mode` could hold either. Normalising at the *parse boundary* keeps exactly one
internal spelling (`"default"`) while accepting two external ones. The `external: "default"` field in the
descriptor is the same idea in the other direction: what the IDE extensions and the SDK see is still
`default`, so `.200`'s rename is **presentation-only** and does not break the VS Code / JetBrains
protocol. That is why the changelog can say "across the CLI, `--help`, VS Code, and JetBrains" without a
protocol version bump.

The mode-ordering map `uWl` (`:58494`) is unchanged in shape:
`{ plan: 0, bubble: 1, default: 1, dontAsk: 1, acceptEdits: 2, auto: 3, bypassPermissions: 4 }` — note
`default`, `dontAsk` and `bubble` share rank 1, i.e. they are siblings in the same permissiveness tier
rather than a strict order.

---

## Not covered, and why

Honest list. Each of these is a permissions-theme bullet I did not analyse in depth, with what I know.

1. **`.207` "compound commands with `cd` prompting when the only redirect was `/dev/null`"**
   (ledger #11). `cd-compound-redirect` is **220=1 / 193=1** (`:391024`), so the `bashMissKind` label is
   carryover and the fix is inside the predicate that decides whether a redirect in a `cd`-compound is
   benign. Finding it needs a statement-level diff of the `cd`-compound branch, which I did not do. The
   13-kind `bashMissKind` taxonomy is in ground truth §6.4 and *shrank* (22 / 23), so the region did change.
2. **`.212` "auto-mode denial notifications rendering broken characters when truncated mid-emoji"**
   (#26). Every grapheme/truncation literal is identical (`grapheme` 32/32, `truncateToWidth` 2/2,
   `mid-emoji` 0/0). This is a grapheme-cluster boundary fix with no string surface; it needs a diff of
   the truncation helper's body. Owned better by `48_accessibility_ui`.
3. **`.216` "compound statements with redirects inside `&&` lists or negations"** (#39). The one candidate
   literal `Redirect involving /dev/tcp or /dev/udp` is 1/1. The `.214` work in
   [`security_hardening_214.md`](security_hardening_214.md) §1 rebuilt the redirect auditor and gave it a
   *tree-wide* pre-pass, which would also fix "redirects inside `&&` lists" — so this bullet is plausibly
   a second description of `M0u`'s introduction. I did not prove that, so it is listed as carryover-label
   rather than folded in.
4. **`.216` "read-only commands on Windows accessing network paths"** (#40). Proven **CARRYOVER** at the
   literal level: the identical `decisionReason` at `:214165` / `:227863 (193)`. The UNC prompt existed;
   the fix must be that the read-only classifier path now *reaches* it — most likely a consequence of
   `.214` #4's `tvd` guard or of `M0u`. Not traced.
5. **`.218` "trust dialogs name the repository root the grant covers"** (#45). Disproven at the literal
   level (see ledger). The one trust-dialog delta I did find is a new decline outcome
   `gated_grants_backstop_declined` (220=1 / 193=0, `:831181`), reported through
   `pe("onboarding_trust_dialog", …)`; the `tengu_trust_dialog_shown` / `_accept` payloads are
   byte-identical 13-field objects (220 `:831150`, `:831190`; 193 `:693729`). Whoever picks this up should
   diff the *render* function around `:831100-831260` against 193's `:693680-693820`, not the telemetry.
6. **`.216` #42 (telemetry) and `.216` #41 (PowerShell Unicode)** are assigned to other modules; I located
   `:395797` and noted `:323491` but did not analyse either.
7. **The `.211` chat-relay bidi/zero-width stripping** (#21) is a remote-control render concern; the
   strip-regex family grew 3 → 10 sites but the scoping pass already established the growth is mostly
   ClaudeDesign project names. Not re-derived.

Two adjacent findings I *did* surface but which belong to other modules, flagged for their owners:

- **`.207`'s repo-visibility lookup is entirely undocumented.**
  `CLAUDE_CODE_AUTO_MODE_REPO_VISIBILITY` / `tengu_auto_mode_repo_visibility_lookup_failed` are
  220=4 / 193=0 and make an authenticated GitHub API call to classify the repo as public/private for the
  classifier. Gated off by default. See
  [`auto_mode_availability_and_gating.md`](auto_mode_availability_and_gating.md) §9. `44_telemetry` /
  `55_auth_providers` may want it.
- **The classifier's beta self-heal is dead code.** `Fi_` (`:444409`) guards on `zJt`, which is declared
  `= null` at `:109181` and never assigned, so `tengu_auto_mode_beta_latch` (`:444423`) can never fire —
  while the classifier *does* send `auto-mode-classifier-2026-07-16` via a different slot `Sji`
  (`:109221`). See [`classifier_adjudication.md`](classifier_adjudication.md) §6.

---

## Confidence

**HIGH** for the 19 NET_NEW rows: each has a `220=N / 193=0` literal count *and* the 2.1.220 site was
read, and for the important ones the 2.1.193 counterpart function was read too (`ont`/`Eer`,
`fv`/`B0`, `M9t`/`WB`, `Uys`/`H3r`, `test_command` branch, `file.safeFlags`, `oYi`/`hYr`).

**HIGH** for the 6 UNANCHORED rows *as negative results* — in four of them I read the proposed anchor and
showed it is a different feature.

**MEDIUM** for the "why" paragraphs where I infer design intent from structure (e.g. why only deny/ask are
cached, why the 64-substitution budget branches on `rm` presence). These are arguments from the code, not
from comments, and are labelled as reasoning rather than fact.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> This module's new symbols are staged in
> [symbol_additions_v2_1_220_permissions.md](../00_overview/symbol_additions_v2_1_220_permissions.md)
> for merge into `symbol_index_infra_platform.md`.

Key functions introduced in this README:
- `normalizeManualModeAlias` (`fL`, `:58323`) - `"manual" → "default"` zod preprocessor
- `PERMISSION_MODE_DESCRIPTORS` (`dWl`, `:58495`) - the table whose `default` entry became "Manual"
- `PAUSE_GLYPH` (`X4r`, `:58419`) - `"⏸"`, the `.203` footer badge
- `PERMISSION_MODE_RANK` (`uWl`, `:58494`) - permissiveness tiers; `default`/`dontAsk`/`bubble` share rank 1
- `resolvePermissionMode` (`BK`, `:58326`) - alias-normalising mode lookup
