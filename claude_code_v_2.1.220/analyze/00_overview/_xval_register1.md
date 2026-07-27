# Cross-validation pass — Register 1 (carryover traps) of `_false_delta_ledger.md`

**Mode:** default-to-FAIL. Every row was treated as a test to break, not a claim to confirm.

**Method.** Each row's headline literal was re-measured with `grep -cF` (fixed-string, *not* regex) in
both bundles:

- `T` = `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
- `B` = `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`

56 primary literals + 31 secondary/sub-claim literals were measured. 14 load-bearing line citations
were then **read in both bundles** to defend against identifier-reuse collisions (the `yBc` trap
class), and every row's subject was grepped across all 180 `*.md` files in the tree for a
"new / added / introduced / NET_NEW" claim about the carryover mechanism.

**Headline results:**

| Metric | Value |
|---|---|
| Rows the ledger claims to hold | **61** |
| Rows that actually exist | **51** ← structural defect D1 |
| Rows tested | **51 / 51** |
| Rows whose carryover verdict survives re-measurement | **51** |
| Rows whose **count column** is wrong under `-F` | **5** (D2–D6) |
| `FALSE_CARRYOVER_BULLET_IS_NEW` (i.e. `-F` shows `193=0`) | **0** |
| Tree documents that call a register-1 carryover mechanism "new" | **0** |

---

## 0. Structural defect found before testing began

`_false_delta_ledger.md:6` says *"61 bullets whose headline literal ALREADY EXISTS in 2.1.193"* and
`:28` repeats *"61 bullets. Sorted by release range."* The four section headers declare
15 + 15 + 11 + 10 = **51**, and a row count of the tables confirms 51. **The `2.1.211-2.1.214` band has
no section at all** — the headings jump from `### 2.1.206-2.1.210` (`:70`) straight to
`### 2.1.215-2.1.220` (`:86`). Either ten rows were lost in consolidation or the header count is
inflated by ten. This is defect **D1**; it is listed first because it means *this cross-validation pass
cannot have covered ten traps that the ledger asserts exist*.

---

## 1. Row-by-row results (51 rows)

Counts are `grep -cF` line counts, format `220 / 193`. "Ledger said" reproduces the row's own
count columns.

### 2.1.195–2.1.199 (ledger rows 1–15, file lines 34–48)

| # | Bullet gist | Literal tested | `-F` 220/193 | Ledger said | VERDICT | Violating doc |
|---|---|---|---|---|---|---|
| 1 | `.196` readable default session names | `axolotl` | **1 / 1** | 4 / 4 | `CONFIRMED_CARRYOVER` + `LEDGER_COUNT_WRONG` | — (see D2) |
| 2 | `.196` `mcp list/get` no longer spawn `.mcp.json` servers | `Pending approval` | 3 / 3 | 3 / 3 | `CONFIRMED_CARRYOVER` | none |
| 3 | `.198` Claude Platform on AWS as upstream | `anthropicAws` | 35 / 46 | 35 / 46 | `CONFIRMED_CARRYOVER` (count *fell*) | none |
| 4 | `.198` `awsAuthRefresh` auto-runs on STS expiry | `awsAuthRefresh` | 10 / 10 | 10 / 10 | `CONFIRMED_CARRYOVER` | none |
| 5 | `.199` retry watchdog raises retries to 300 | `CLAUDE_CODE_RETRY_WATCHDOG` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER` | none |
| 6 | `.198/.199` plan-mode browser auto-allow set | `gif_creator` | 9 / 8 | 9 / 8 | `CONFIRMED_CARRYOVER` | — (sub-claim wrong, D6) |
| 7 | `.199` PR links as bare `#N` | `` #${e.prNumber} `` | **4 / 4** | 1 / 1 | `CONFIRMED_CARRYOVER` + `LEDGER_COUNT_WRONG` | see D3 |
| 8 | `.199` SessionStart/Setup/SubagentStart stderr on exit 2 | `hook_non_blocking_error` | 24 / 23 | 24 / 23 | `CONFIRMED_CARRYOVER` | none |
| 9 | `.198` subagents/compaction inherit thinking config | `yBc` | 2 / 2 | 2 / 2 (RETRACTED) | `CONFIRMED` — retraction is correct; `yBc` decls differ (`:119662` vs `:9245 (193)`) | none |
| 10 | `.198` Explore inherits session model, capped at opus | `model: "inherit"` | 3 / 2 | 3 / 2 | `CONFIRMED_CARRYOVER` | stale verdict, D7 |
| 11 | `.198` Claude in Chrome GA | `generally available` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` — read `:508020`, it is Fable-5 prompt prose, unrelated | none |
| 12 | `.196` stalled agents "Needs attention" | `Needs attention` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 13 | `.199` remote sessions flapping / "Reconnecting…" | `Reconnecting` | 41 / 42 | 41 / 42 | `CONFIRMED_CARRYOVER` (count *fell*) | none |
| 14 | `.197` Sonnet 5 native 1M context | `1M context` | 42 / 40 | 42 / 40 | `CONFIRMED_CARRYOVER`; `native_1m` **11 / 0** is the real anchor | none |
| 15 | `.196` `plugin validate` skipping `"."` sources | `plugin validate` | 7 / 7 | 7 / 7 | `CONFIRMED_CARRYOVER` | none |

### 2.1.200–2.1.205 (ledger rows 16–30, file lines 54–68)

| # | Bullet gist | Literal tested | `-F` 220/193 | Ledger said | VERDICT | Violating doc |
|---|---|---|---|---|---|---|
| 16 | `.201` Sonnet 5 drops mid-conversation system role | `mid_conv_system` | 6 / 1 | 6 / 1 | `CONFIRMED_CARRYOVER`; read `:14207` — Sonnet 5 declares it, so **reverted** in 220 | none |
| 17 | `.200` voice "Voice connection failed" with no audio | `No audio detected from microphone` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 18 | `.200` tmux 3.4+ flicker / synchronized output | `DECRQM(2026)` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER`; read `220:253386` vs `193:160038` — the one-line delta is real | none |
| 19 | `.205` bg notifications state no human input | `[SYSTEM NOTIFICATION - NOT USER INPUT]` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER`; `no human` **3 / 0** | none |
| 20 | `.200/.203` screen-reader landmine | `axScreenReader` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER`; `screenReader` 9 / 3 | none |
| 21 | `.202` Remote Control "Unknown command" | `Unknown command` | 3 / 3 | 3 / 3 | `CONFIRMED_CARRYOVER` | none |
| 22 | `.202` chat from `claude agents` fails | `currently running as a background agent` | 3 / 3 | 3 / 3 | `CONFIRMED_CARRYOVER` | none |
| 23 | `.202` resume-by-name slow with many worktrees | `worktrees exceeds fanout cap` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 24 | `.203` bg startup failure shows only `exit_with_message` | `exit_with_message` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 25 | `.203` `^[[I` / `^[[O` on reattach | `?1004` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER` | none |
| 26 | `.203` [VSCode] Remote Control toggle | `Enable Remote Control for all sessions` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 27 | `.205` `add-from-claude-desktop` name chars | `unsupported characters` | 1 / **0** | 1 / 0 | `CONFIRMED` — row is a **false-match** row, not a carryover row, and says so; `add-from-claude-desktop` is 1 / 1 | none |
| 28 | `.203` removed "claude command missing or broken" | *(literal)* | **0 / 0** | 0 / 0 | `NOT_TESTABLE_AS_CARRYOVER` — absent from both bundles. Superseded by a *verified* tree correction: `installBrokenMessages` **0 / 8** | none (correction is sound) |
| 29 | `.203` bg agents stale PATH / `ANTHROPIC_BASE_URL` | `ANTHROPIC_BASE_URL` | 47 / 40 | 47 / 40 | `CONFIRMED_CARRYOVER` | none |
| 30 | `.203` binary size −7 MB | `image-processor.node` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER`; `audio-capture.node` 2 / 2 confirmed | none |

### 2.1.206–2.1.210 (ledger rows 31–41, file lines 74–84)

| # | Bullet gist | Literal tested | `-F` 220/193 | Ledger said | VERDICT | Violating doc |
|---|---|---|---|---|---|---|
| 31 | `.208` "Added screen reader mode" | `axScreenReader` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER` (dark-launched in 193) | none |
| 32 | `.207` `disableAutoMode` kill switch | `disableAutoMode` | 7 / 7 | 7 / 7 | `CONFIRMED_CARRYOVER`; `tengu_auto_mode_env_onboarding` **8 / 0** | none |
| 33 | `.207` Bedrock/Vertex/AWS default to Opus 4.8 | `aliases.opus.per_provider.bedrock` | **0 / 0** | 1 / 0 | `LEDGER_COUNT_WRONG` (not a literal); conclusion holds — read `:14461-14472`, rows say `claude-opus-5` | see D5 |
| 34 | `.206` expired login → "issue with the selected model" | `There's an issue with the selected model` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 35 | `.206-.208` AWS/SSO startup hang cluster | `awsCredentialExport` | 12 / 12 | 12 / 12 | `CONFIRMED_CARRYOVER`; `sso_region` 9 / 9, `credential_process` 7 / 7 | none |
| 36 | `.210` plan approvals labelled "(edited by user)" | `(edited by user)` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER`; `planWasEdited` 3 / 3 | none |
| 37 | `.207` re-pasting expands `[Pasted text #N]` | `[Pasted text #` | 3 / 3 | 3 / 3 | `CONFIRMED_CARRYOVER`; tree's later "new call site `:807029`" correction **verified** against `193:677731-677744` | none |
| 38 | `.208` "Truncated event message received" | `Truncated event message received` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER` | none |
| 39 | `.210` `←`-origin session stays marked | `keepInPlaceIds` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER` | none |
| 40 | `.206` OAuth MCP manual re-auth | `tengu_mcp_oauth_refresh_failure` | 2 / 1 | 2 / 1 | `CONFIRMED_CARRYOVER` (dual-MCP-tree artefact) | none |
| 41 | `.207` compound `cd` with `/dev/null` redirect | `cd-compound-redirect` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |

### 2.1.215–2.1.220 (ledger rows 42–51, file lines 90–99)

| # | Bullet gist | Literal tested | `-F` 220/193 | Ledger said | VERDICT | Violating doc |
|---|---|---|---|---|---|---|
| 42 | `.219` `sandbox.network.strictAllowlist` | `strictAllowlist` | 4 / 1 | 4 / 1 | `CONFIRMED_CARRYOVER`; read `220:195200` ≡ `193:211506` byte-for-byte | none |
| 43 | `.216` `sandbox.filesystem.disabled` | `filesystem.disabled` | 7 / 6 | 7 / 6 | `CONFIRMED_CARRYOVER` (`-F` and regex agree here) | none |
| 44 | `.219` Removed Opus 4.7 from fast mode | `opus-4-7` | **45 / 54** | 1 / 1 | `CONFIRMED_CARRYOVER` (reverse trap) + `LEDGER_COUNT_WRONG`. Read `220:109473` — still matches `opus-4-7` | see D4 |
| 45 | `.218` gateway spend metering for AIP ARNs | `application-inference-profile` | 6 / 6 | 6 / 6 | `CONFIRMED_CARRYOVER` | none |
| 46 | `.217` footer PR badge hyperlinks | `FORCE_HYPERLINK` | 2 / 2 | 2 / 2 | `CONFIRMED_CARRYOVER`; `assumeSupport` 13 / 3 | none |
| 47 | `.216` Windows read-only commands on UNC paths | `UNC network paths require manual approval` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` | none |
| 48 | `.217` brace expansion budget in frontmatter paths | `brace expansion` | 1 / 1 | 1 / 1 | `CONFIRMED_CARRYOVER` (false match); `maxPatterns`/`expandedCount`/`pattern budget` all 0 / 0 | none |
| 49 | `.216` quadratic message-normalization cost | `quadratic` | 4 / 2 | 4 / 2 | `CONFIRMED_CARRYOVER` (vendor-string noise) | none |
| 50 | `.218` engine teardown phantom turn | `phantom` | 8 / 8 | 8 / 8 | `CONFIRMED_CARRYOVER` | none |
| 51 | `.218` Bedrock wizard, partitioned AWS regions | `aws-us-gov` | 9 / 9 | 9 / 9 | `CONFIRMED_CARRYOVER`; `assume-role` 0 / 0 confirmed | none |

---

## 2. Defects found

### D1 — `61` rows claimed, `51` rows exist; the `.211`–`.214` band is missing (STRUCTURAL, high)

**File:line:** `00_overview/_false_delta_ledger.md:6` and `:28`; missing section between `:84` and `:86`.

Current: *"**[Carryover traps](#1-carryover-traps)** - 61 bullets whose headline literal ALREADY EXISTS in 2.1.193."*
and *"61 bullets. Sorted by release range."*

Corrected wording (if no rows were lost):

> **[Carryover traps](#1-carryover-traps)** - 51 bullets whose headline literal ALREADY EXISTS in 2.1.193.
> …
> 51 bullets, sorted by release range. **No traps were recorded for 2.1.211-2.1.214**; the four
> scoping bands that produced this register did not include that range.

If rows *were* lost, the `.211`–`.214` band must be reconstructed from
`00_overview/_scope_v211_214.md` before this register can be called complete.

### D2 — Row 1's `4 / 4` is a cross-name count presented as a same-name count, over an identifier that 193 REUSES (COUNT, medium)

**File:line:** `00_overview/_false_delta_ledger.md:34`.

Measured: `axolotl` is **1 / 1**. `sQt` is **5 / 7** — but 193's `sQt` is an *unrelated FleetView module
namespace object* (`var sQt = {};` at `193:678835`, `gt(sQt, { mountFleetViewWithComposerBack: … })`),
not a name generator. The honest functional pair is `sQt(` **220=4** vs `nrt(` **193=4**.

This is the *exact* trap the row's own preamble (`:23-26`) warns about, and which forced the `yBc`
retraction eight rows later. A reader who re-measures `sQt` in 193 gets `7` from a completely
different subsystem.

The substantive verdict is nevertheless **correct** — I read both generators:
`220:111543 function sQt(){ let e=P5r(hRc), t=P5r(gRc); return \`${e}-${t}\` }` is structurally
identical to `193:147620 function nrt(){ let e=JMt(Exi), t=JMt(Hxi); return \`${e}-${t}\` }`, and
likewise `I7n` (`220:111524`) ≡ `uwn` (`193:147601`).

Corrected wording for the count columns and rationale:

> `sQt(` **4** / `nrt(` **4** (cross-name pair; `axolotl` 1/1) … ⚠ Do **not** re-measure bare `sQt`
> against 193 — 193 reuses that identifier for the FleetView module namespace at `:678835`.

**Propagated (same ambiguity, not independently wrong):**
- `00_overview/changelog_to_code_map.md:758` — *"`axolotl` 1/1; generator 4/4"*
- `by_version/2.1.196.md:64` — same string
- `36_background_agents/README.md:162` — *"2-word generator 4/4"*

Each should read `sQt( 4 / nrt( 4 (cross-name)`.

### D3 — Row 7 records `#${e.prNumber}` as 1 / 1; it is 4 / 4 (COUNT, medium)

**File:line:** `00_overview/_false_delta_ledger.md:40`.

`grep -cF '#${e.prNumber}'` → **220 = 4** (`:160555`, `:497254`, `:497265`, `:723431`),
**193 = 4** (`:11182`, `:536188`, `:537208`, `:537219`). The `1 / 1` appears to be the count of the
*bare-`#N`* site only. The CARRYOVER verdict stands (`220:160555` is byte-identical to `193:11182`).

Corrected wording: `` `#${e.prNumber}` 4 / 4 (the bare-#N formatter is the single site :160555 ≡ :11182 (193)) ``

**Propagated:**
- `36_background_agents/agent_view_and_status.md:37` — *"`` `#${e.prNumber}` `` `:160555` = `:11182 (193)`, 1/1"*
- `36_background_agents/agent_view_and_status.md:940` — *"`` `#${e.prNumber}` `` `220=1 / 193=1`"*

### D4 — Row 44 records `opus-4-7` as 1 / 1; it is 45 / 54 (COUNT, medium)

**File:line:** `00_overview/_false_delta_ledger.md:92`.

`grep -cF 'opus-4-7'` → **220 = 45 / 193 = 54**. Even the narrower
`grep -cF 'includes("opus-4-7")'` → **220 = 3 / 193 = 5**. Neither is `1 / 1`.

The row's *conclusion* is correct and I verified it by reading both bundles:
`193:102324  return r.includes("opus-4-6") || r.includes("opus-4-7") || r.includes("opus-4-8");`
`220:109473  return n.includes("opus-4-7") || n.includes("opus-4-8") || n.includes("opus-5");`
— 4-6 out, opus-5 in, **4-7 still eligible**; and `220:14324` still carries `"fast_mode"` on the
Opus 4.7 catalogue entry.

Corrected wording: `` `includes("opus-4-7")` 3 / 5 (bare `opus-4-7` 45 / 54) ``

### D5 — Row 33's anchor is not a literal; recorded 1 / 0, actually 0 / 0 (COUNT, low)

**File:line:** `00_overview/_false_delta_ledger.md:76`.

`aliases.opus.per_provider.bedrock` is **0 / 0** under `-F` — it is a JSON path, not a source string.
The testable anchor is `per_provider`, **220 = 4 / 193 = 0** (genuinely net-new). The row already says
*"Not a literal trap but a VALUE supersession"*, so only the count columns mislead.

Corrected wording: `` `per_provider` (the path `aliases.opus.per_provider.bedrock` is not a literal) | 4 | 0 ``

### D6 — Row 6's "real delta" sub-claim `cOt 220=4/193=0` is wrong in both columns (COUNT, medium)

**File:line:** `00_overview/_false_delta_ledger.md:39`.

`grep -cF 'cOt'` → **220 = 6 / 193 = 4**, because **193 reuses `cOt`** as a CommonJS module-wrapper
variable (`193:161316 var H$i = Q((GPh, cOt) => { cOt.exports = …`). `grep -cF 'cOt('` → **220 = 6 / 193 = 0**.

The claim survives on the reading, not the count: `220:288994 function cOt(e, t)` is the read-only
browser predicate with five call sites (`:289063`, `:289276`, `:289292`, `:289356`, `:289357`), and
193 has no such function. But `193=0` as stated is false for the bare identifier.

Corrected wording: `` cOt( **220=6 / 193=0** (bare `cOt` is 6/4 — 193 reuses the id for a vendored CommonJS wrapper at :161316) ``

### D7 — A foundation-pass scope file still records a register-1 row as `NET_NEW` (CONSISTENCY, low)

**File:line:** `00_overview/_scope_v195_199.md:174`.

> `| 7 | Built-in Explore agent inherits the session model (capped at opus) instead of haiku | subagent_limits | BEHAVIOR_CHANGE | `model: "inherit"` | 3 | 2 | cli_inner_pretty.js:269303 | NET_NEW | RICH |`

The ledger (row 10), `53_subagent_limits/README.md:88`, `by_version/2.1.198.md:68` and
`changelog_to_code_map.md:715` all say **DELTA (a dark-launched gate graduated)**. The scope file's
`NET_NEW` verdict is stale. Corrected verdict column: `DELTA` (with a pointer to the ledger row).

This is the only stale "NET_NEW" I found against a register-1 subject anywhere in the tree, and it is
in a provenance file the ledger explicitly supersedes — so it is low severity, but it is the one place
a reader could still be led to write the Explore-inherit machinery up as an introduction.

### Deliberate non-defects (checked and cleared)

Four documents **contradict** a register-1 row. All four are legitimate, evidence-backed corrections,
not violations, and I re-verified each against the bundles:

| Doc | Correction | Verified evidence |
|---|---|---|
| `43_slash_commands/README.md:88` | row 28 UNANCHORED → NET_NEW (a deletion) | `installBrokenMessages` **220=0 / 193=8** |
| `57_api_reliability/README.md:69` | row 38 flat CARRYOVER → carryover message + net-new guard | `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD` **3 / 0** |
| `48_accessibility_ui/README.md:234` | row 37 CARRYOVER → ANCHORED | new re-paste expand branch at `220:807028-807031`, absent from `193:677731-677744` (read both) |
| `55_auth_providers/aws_and_provider_plumbing.md:61` | row 35 UNANCHORED → DELTA, newly anchored | `invalidateAuth` **6 / 0** |

---

## 3. Register-1 rows that are themselves wrong (the `-F` re-measurement failures)

**No row flipped to `FALSE_CARRYOVER_BULLET_IS_NEW`.** Every literal that the ledger presents as
carryover measures `193 > 0` under `grep -cF`. The `workflow.run_id`-class failure (regex dot
inflating the 193 count) does **not** recur here: the four rows carrying regex-active characters in
their literal — `filesystem.disabled` (row 43), `image-processor.node` (row 30),
`[SYSTEM NOTIFICATION - NOT USER INPUT]` (row 19), `(edited by user)` (row 36) — all hold under `-F`,
and `filesystem.disabled` returns the identical `7 / 6` under both regex and `-F`.

Five rows are nevertheless **numerically wrong**:

| Row | Ledger count | `-F` count | Nature of the error |
|---|---|---|---|
| 1 (`.196` session names) | 4 / 4 | `axolotl` 1 / 1; `sQt` 5 / 7 | cross-name count presented as same-name, over an id 193 reuses (**D2**) |
| 6 (`.198/.199` browser set, sub-claim) | `cOt` 4 / 0 | `cOt` 6 / 4; `cOt(` 6 / 0 | 193 reuses `cOt` as a CommonJS wrapper (**D6**) |
| 7 (`.199` bare `#N`) | 1 / 1 | 4 / 4 | narrower site count reported as the literal count (**D3**) |
| 33 (`.207` Opus 4.8 default) | 1 / 0 | 0 / 0 | anchor is a JSON path, not a source literal (**D5**) |
| 44 (`.219` fast mode) | 1 / 1 | 45 / 54 | order-of-magnitude count error (**D4**) |

**Two of the five (rows 1 and 6) are identifier-reuse collisions in the same class as the retracted
`yBc` row.** Both survive on the reading, but both would mislead anyone who re-measures the bare
identifier — and row 6 in particular publishes a `193=0` that is simply false. The register's own
warning banner at `:23-26` should be extended to say that a `193=0` is *also* untrustworthy for short
mangled identifiers, not only a count *match*.

**One row cannot be tested as a carryover at all:** row 28 (`claude command missing or broken`) is
`0 / 0` — the literal is absent from both bundles, so it is an unanchored bullet, not a carryover
trap, and it does not belong in register 1 under the register's own definition ("bullets whose
headline literal ALREADY EXISTS in 2.1.193").

---

## 4. Tree-wide "is it called new anywhere?" sweep — result

For each of the 51 subjects, all 180 `*.md` files were grepped and filtered for
`new | newly | added | adds | introduc | NET_NEW`, then every hit was read in context. Module docs,
`by_version/*.md`, `00_overview/changelog_to_code_map.md` and all four `symbol_index_*.md` files were
covered. A separate sweep over every `^#{1,4} .*(Added|New |Introduc)` heading in the tree returned
only `DirectoryAdded` (a register-**2** anchor, `220=20 / 193=0`, legitimately new).

**Zero documents present a register-1 carryover mechanism as an introduction.** The tree is
consistently disciplined: carryover rows carry explicit `CARRYOVER` verdicts with the 193 twin line
cited, and the several `NET_NEW` verdicts on register-1 *bullets* are all scoped to a genuinely new
wrapper/gate/call-site with the carryover literal called out in the same cell (e.g.
`41_hooks/README.md:74` "NET_NEW (wrapper only — attachment type is carryover)";
`44_telemetry/README.md:114` "NET_NEW (literal carryover)").

**Confidence: high** for the 51 rows tested. **The tree's register-1 exposure is not the defect class
this pass was sent to find — the counts are.** The unquantifiable risk is D1: ten claimed traps that
do not exist in the file cannot be validated, and if they were lost rather than miscounted, the
`.211`–`.214` window has no carryover protection at all.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations

Symbols read in both bundles during this pass:

- `sessionNameTwoWord` (`sQt`, `:111543`) - 2-word session-name generator; 193 twin is `nrt` (`:147620 (193)`). **193's `sQt` (`:678835 (193)`) is an unrelated FleetView namespace object.**
- `sessionNameThreeWord` (`I7n`, `:111524`) - 3-word generator; 193 twin is `uwn` (`:147601 (193)`)
- `isBrowserActionReadOnly` (`cOt`, `:288994`) - net-new read-only browser predicate. **193's `cOt` (`:161316 (193)`) is an unrelated CommonJS module wrapper.**
- `BROWSER_AUTO_ALLOW_SET` (`OKt`, `:34675-34684`) - 9-name set, identical to `Kvt` (`:12536-12546 (193)`)
- `hookNonBlockingErrorWrapper` (`Pur`, `:520551`) - synthetic `exitCode: 2` attachment minter
- `resolveRetryBudget` (`Pqs`, `:534954`) - watchdog-aware retry clamp; constants `$U_=10`, `NU_=300`, `X9s=15` at `:534988-534990`
- `thinkingConfigForSubagent` (`yBc`, `:119662`) - used at `:344538`. **193's `yBc` (`:9245 (193)`) is an unrelated vendored helper — the retracted collision.**
- `isFastModeEligible` (`:109468-109474`) - still matches `opus-4-7`; 193 twin at `:102320-102325 (193)` matched `4-6`
- `opus47SunsetNotice` (`LIc`, `:109491-109498`) - future-removal notice, gate `tengu_sunset_penguin_opus47` (`:109493`, 1/1)
- `supportsMidConversationSystem` (`:150505-150526`) - capability lookup at `:150524`; Sonnet 5 declares `mid_conv_system` at `:14207`
- `MODEL_ALIASES` (`:14461-14486`) - `per_provider` table; bedrock/vertex/anthropic_aws → `claude-opus-5`, foundry → `4-6`, gateway → `4-7`
- `setSyncOutputProbeResult` (`p2u`, `:253377`) / `syncOutputPendingProbe` (`f2u`, `:253380`) / `shouldUseSyncOutput` (`xee`, `:253384`) - tmux arm at `:253386` vs `:160038 (193)`
- `isNetworkHostAllowed` (`:195200`) - `strictAllowlist` enforcement, byte-identical to `:211506 (193)`
