# Changelog Analysis — Claude Code v2.1.193 → v2.1.220

**What this document is.** A narrative analysis of the whole 25-release window, arguing six theses about
what happened to this codebase and what the changelog fails to tell you. It is deliberately *not* a
ledger ([`changelog_to_code_map.md`](changelog_to_code_map.md), all 579 bullets with verdicts and
anchors), *not* a release-by-release summary ([`../by_version/`](../by_version/), 25 files), and *not*
the trap register ([`_false_delta_ledger.md`](_false_delta_ledger.md), 61 carryover traps + 125 verified
net-new anchors; [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md), the
hand-verified set with every correction and retraction). It answers what those four cannot: **taken as a
whole, what did 25 releases do to this program, and where does the release note diverge from the
artefact?**

**Provenance and citation rule.** Every `cli_inner_pretty.js:<line>` below was **read in the 2.1.220
bundle during the writing of this document** —
`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`, 872,596 lines,
`VERSION: "2.1.220"`, `BUILD_TIME: "2026-07-24T22:17:45Z"`,
`GIT_SHA: "4073f59596e272f39393db4f96abc5f4b10eff21"` (`:226-229`). Baseline lines are tagged `(193)`
and were read in `…/2.1.193/extract/cli_inner_pretty.js` (718,679 lines). **All counts here were taken
with `grep -cF`** — see §6.4 for why that matters. Obfuscated identifiers are re-mangled between builds
and never carried across; every symbol named here was resolved inside the 2.1.220 bundle.

---

## 0. The window in numbers

```
window          2.1.195 … 2.1.220        25 published releases, 579 changelog bullets
never published 2.1.194, 2.1.213         (which is why the window opens at .195 and skips .213)
bundle          718,679 → 872,596 lines  +153,917 (+21.4%) — the largest window analysed so far
model launches  2                        Sonnet 5 (.197), Opus 5 (.219)

NET_NEW 340 (58.7%) · UNANCHORED 99 (17.1%) · DELTA 85 (14.7%) · CARRYOVER 48 (8.3%)
SERVER_SIDE 3 · GATE_REMOVAL 2 · OTHER 2
```

509 of 579 bullets (87.9%) reach a module document. The symbol index carries 3,402 unique rows across
216 module sections; a random 400-row citation audit measured a **0.25% error rate**.

**The shape of the window is bimodal.** Six releases carry exactly one bullet (`.197 .201 .204 .209
.215 .220`); three carry 46, 47 and 48 (`.208 .214 .212`). That is not a cadence artefact but two
different *kinds* of release. The single-bullet ones are **coordination events** — a model launch the
server has already flipped on (`.197`), a hotfix (`.201`), a revert (`.209`), a stop (`.215`), a
follow-up build (`.220`). The 36-to-48-bullet ones are **campaign releases**, each with one centre of
gravity: `.208` resource bounds, `.212` delegation budgets, `.214` the shell-permission analyzer,
`.216`/`.218` background execution.

**The verdict mix per release is more informative than the totals.** `.214` — 47 bullets, the security
release — has only **2 UNANCHORED** (4.3%). `.216` and `.203` have **13 each** (32.5%, 35.1%). `.219` has
**zero**. The difference is not analysis quality; it is what the release changed: `.214` edited a
string-rich permission analyzer, `.216` and `.203` edited terminal layout and daemon timing. §5 develops
this.

**Three things in this window have no bullet at all**, and they are the three largest engineering events
in it: the model-registry rewrite, the MCP fork, and the Windows sandbox rebuild. That is §1, and it is
the thesis everything else in this document leans on.

---

## 1. The changelog systematically under-reports structural change

The 579 bullets describe user-visible promises: a setting you can now write, a crash that no longer
happens, a model you can now select. They are, as a class, accurate about *those*. What they never
describe is the shape of the code that makes the promise cheap to keep. Three rewrites landed in this
window, each larger than any single bulleted feature, and **none of the three appears in the changelog
in any form**.

### 1.1 The model registry became a generated, zod-validated catalogue

**What it does:** replaces roughly fifteen hand-written camelCase per-model objects plus a dozen scattered
`if / else-if` ladders with one declarative data structure validated at build time.

**How it works.** In 2.1.193, per-model data lived as free-standing objects keyed by provider —
`:95696-95702 (193)` is representative:

```javascript
(iMr = { firstParty: "claude-opus-4-8", bedrock: "us.anthropic.claude-opus-4-8",
         vertex: "claude-opus-4-8", foundry: "claude-opus-4-8",
         anthropicAws: "claude-opus-4-8", mantle: "anthropic.claude-opus-4-8",
         gateway: "claude-opus-4-8", eagerInputStreaming: { bedrock: !0, vertex: !0 } }),
```

Provider ids only. Pricing, context window, capabilities, knowledge cutoff and picker rank each lived
somewhere else, resolved by branching on the model id string.

In 2.1.220 there is one object, `:14008-14496`, opening with its own contract under the key `"//"` at
`:14009` — *"Hand-maintained baked-in model catalog — the source of truth for per-model provider IDs and
metadata. On model launch add one entry to `models` below; `bun run generate:model-catalog` validates
this file against the schema and formats it."* — followed by `schema_version: 1` (`:14010`), a six-row
`pricing_tiers` table (`:14011-14025`), **17 model ids** (`:14026-14460`), the alias table
(`:14461-14486`), `best: "fable"` (`:14488`), `latest_per_family` (`:14489-14494`) and
`alias_migration: {}` (`:14495`).

**The delta is unambiguous.** Every structural key of the new shape is `220>0 / 193=0` — `provider_ids`
22, `vertex_region_env_var` 19, `knowledge_cutoff` 16, `supports_1m_suffix` 13, `advisor_rank` 12,
`native_1m` 11, `schema_version` 11, `tier_5_25` 6, `pricing_tiers` 4, `latest_per_family` 4,
`alias_migration` 4, `tier_10_50` 3, `generate:model-catalog` 2 — **all against a 2.1.193 count of
zero**. And in the opposite direction: `firstParty:` (the old camelCase key) is **220=10 / 193=22**,
while `first_party` is **220=44 / 193=12**. The old shape did not merely gain a sibling; it was largely
replaced.

**Why this approach:** a model launch touches four independent questions — does the id exist, what can it
do, what is it called in the picker, what does the bare word `opus` resolve to. Imperative code answers
those in four places, so a launch is four edits with four chances to disagree; the catalogue answers them
in one entry. `bun run generate:model-catalog` is the tell: this is not a refactor for elegance but a
*build gate* — a malformed entry fails CI rather than shipping a model that renders in the picker and
404s on the API. The trade-off is that a catalogue must be complete before it can be authoritative, which
is why the bundle still carries substring fallbacks *alongside* capability lookups (`mv`,
`:109467-109474`, checks `modelHasCapability(…, "fast_mode")` **and then** `includes("opus-4-7")`) — and
that belt-and-braces duplication is exactly what causes §3.1's contradiction.

**Key insight:** `.197` — the Sonnet 5 launch — is a **one-bullet release**, which reads as "not much
changed". The correct reading is the inverse: **a model launch is one bullet precisely because the
registry was rewritten to make it one entry.** The single-bullet shape is evidence *of* the undocumented
rewrite. Full treatment in
[`../47_models/model_catalogue_rewrite.md`](../47_models/model_catalogue_rewrite.md).

### 1.2 The MCP client was forked into two complete runtime trees

**What it does:** ships two independent implementations of the MCP client stack in one binary and picks
one per process, with a self-check that crashes rather than mixing them.

**How it works:** `getMcpSdkGeneration` (`o9`, `:262846-262863`) resolves the arm once and memoises it.
The env var `MCP_SDK_GENERATION` (**220=3 / 193=0**, accessor `:31998`) wins; a bad value is rejected
with a named warning at `:262852` (`MCP_SDK_GENERATION=${e} is invalid; expected 'v1' or 'v2' —
ignoring`); otherwise the GrowthBook gate `tengu_brindle_causeway` (**220=1 / 193=0**) may select `v2`;
otherwise `v1`. The resolution emits `tengu_mcp_sdk_generation` with `{generation, source}`, `source`
being `"env" | "growthbook" | "default"`. Nine module accessors then sit at `:302410-302474`; **eight
fork**, only `mcpSkillsListModule` (`j0y`, `:302468-302470`) returns the same module either way, and two
carry a tripwire:

```javascript
// ============================================
// mcpClientModule - returns the MCP client for the resolved runtime arm, with a self-check
// Location: cli_inner_pretty.js:302428-302442
// ============================================

// ORIGINAL (for source lookup):
function P0y() {
  if (o9() === "v2") {
    let r = (mYu(), en(fYu));
    if (r.MCP_TREE_ID !== "v2")
      throw Error(
        "MCP runtime accessor tripwire: resolved generation is v2 but the loaded client module does not carry MCP_TREE_ID v2",
      );
    return r;
  }
  let e = (U7u(), en(B7u));
  if (e.MCP_TREE_ID !== "v1") throw Error("MCP runtime accessor tripwire: … v1 …");   // … elided, same shape
  return e;
}

// READABLE (for understanding):
function mcpClientModule() {
  if (getMcpSdkGeneration() === "v2") {
    const v2 = loadMcpClientV2();          // module table :292852, brand xAy = "v2" :294477
    if (v2.MCP_TREE_ID !== "v2") throw Error("MCP runtime accessor tripwire: … v2 …");
    return v2;
  }
  const v1 = loadMcpClientV1();            // module table :298394, brand aTy = "v1" :300019  <- DEFAULT
  if (v1.MCP_TREE_ID !== "v1") throw Error("MCP runtime accessor tripwire: … v1 …");
  return v1;
}

// Mapping: P0y→mcpClientModule, o9→getMcpSdkGeneration, fYu→mcpClientV2Module (:292779),
//          B7u→mcpClientV1Module (:298321), en→requireModule
```

`MCP_TREE_ID` is **220=6 / 193=0**. The forked region is bracketed by four module tables — v2 auth `w9u`
`:286591`, v2 client `fYu` `:292779`, v1 auth `zYu` `:296638`, v1 client `B7u` `:298321` — with the
accessor block closing at `:302474`: roughly **16,000 lines, ~1.8% of the bundle**, about half of it a
second copy. `tengu_mcp_oauth_refresh_failure` is emitted at `:288008` *and* `:298055`, against **one**
site in the baseline (`:282863 (193)`).

**Why this approach:** an MCP SDK generation change alters wire behaviour against third-party servers the
vendor does not control, and a staged rollout needs a *reversible* switch — for a shipped CLI, one
requiring no download. Shipping both trees costs bundle size and buys an instant server-side revert. The
tripwire exists because the failure mode of a half-migrated import graph — a v1 transport handed to a v2
client — is a subtle protocol bug, and a loud crash at module-load beats that.

**Key insight, operationally important for anyone reading this bundle: the default MCP code path is the
HIGHER line range.** A reader who greps an MCP literal and opens the first hit is reading the *opt-in*
tree. This corrects [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.7,
which read the doubling as a bundling artefact; the retraction is recorded there and the full analysis is
in [`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md).

### 1.3 The Windows sandbox was rebuilt around a provisioned low-privilege user

**What it does:** replaces a network-only *group* model with a full containment backend — a provisioned
user account, SID-keyed filesystem ACLs, a kernel-level egress fence, and a per-user certificate store.

**How it works, measured as a before/after.** `sandboxUser` **220=12 / 193=0**; `sandboxUserSid` 9/0;
`srt-win install` 9/0; `trust-ca` 4/0; `WFP egress fence` 3/0; `acl stamp` 2/0 — and, the row that makes
this a *rewrite* rather than an addition, **`srt-win group status` is 220=0 / 193=1** (`:211400 (193)`).
The old model's status command is gone from 2.1.220 entirely.

The most striking piece is that the backend **verifies its own containment empirically** rather than
trusting configuration. `:194860-194874` carries three failure messages from a startup probe that binds a
port outside the permitted range and expects the fence to refuse it — `WFP egress fence could not be
verified — \`srt-win wfp …` (`:194860`); `WFP egress fence is not active — direct outbound from the …`
(`:194868`), remediated by `Re-run \`srt-win install\` (one UAC prompt).` (`:194869`); and a probe-timeout
variant (`:194873`).

**Why this approach:** on macOS and Linux the sandbox denies by *path*, because the process runs as the
user and the kernel primitive (seatbelt, bubblewrap) is a deny-list. Windows has no equivalent per-path
primitive for an arbitrary child process, so containment must be expressed as *identity*: run as a
principal with no rights, then grant precisely the paths needed by stamping ACLs keyed to its SID. That
inversion has a consequence the settings schema spends most of its longest description string on — a
"skip filesystem isolation" switch cannot mean the same thing on Windows, because skipping the rules
there withholds every grant instead of loosening a deny-list.

**Key insight:** this rebuild is the *reason* two of the window's bulleted settings
(`sandbox.filesystem.disabled` in `.216`, `sandbox.network.strictAllowlist` in `.219`) needed a platform
veto and a scope rule. The changelog documents the switches and omits the backend that makes them
conditional. See [`../49_sandbox/windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md).

### 1.4 Why the pattern exists

All three follow the same rule: **a bullet is written when a user's mental model must change.** A new
setting changes it; a model launch changes it; a rewrite that makes the *next* launch cheaper does not —
"there is a model called Opus 5" reads identically whether the id came from a catalogue or a switch
statement.

That rule produces a systematic, one-way bias: enablers are invisible, consequences are visible. So a
changelog reader sees `.197` (one bullet), `.219` (24 bullets) and a scattering of MCP fixes, and infers
a maintenance window with two launches in it. The artefact shows a window whose three most expensive
pieces of work were a data-model rewrite, a runtime fork, and a platform backend replacement — **none of
which a reader could have guessed from 579 bullets.** The consequence for this tree: `NET_NEW` is
measured against *bullets*, so 340 understates the change.

---

## 2. "Shipped ≠ reachable" is a first-class pattern in this build

The raw asset diff reports **326 new feature-gate/telemetry names** (a figure this document reproduces at
the source level: `grep -o 'tengu_[a-z0-9_]*' | sort -u` gives **220=1,755 / 193=1,471**). It is tempting
to read that list as a feature manifest. It is not: four independent instances in this build show shipped
code that is provably unreachable, in four *different* ways.

### 2.1 The `tengu_dead_probe_*` census — instrumentation whose purpose is to prove unreachability

`dead_probe` is **220=32 / 193=0**: **25 distinct gate names across 32 emission sites**, not one of which
existed in 2.1.193, and **not one of which has a changelog bullet** — in a window with 579 of them. Each
probe sits inside a legacy compatibility branch, fires **once per process**, reports a closed-vocabulary
description of which legacy shape was seen, and then **lets the legacy path run exactly as before**. The
`TaskStop` member at `:399998-400003` is the whole family in six lines:

```javascript
async validateInput({ task_id: e, shell_id: t }, r) {
  if (t !== void 0 && !CAd)
    ((CAd = !0),
      O("tengu_dead_probe_taskstop_shell_id", { with_task_id: e !== void 0 ? Ee("true") : Ee("false") }));
  let { taskRegistry: n, getAppState: o } = r,
    i = e ?? t;                       // <- the deprecated `shell_id` is still honoured
```

`i = e ?? t` is the point. The probe reports that `shell_id` was used; `shell_id` still works. The
`--remote` alias member at `:828205` is identical in shape — `if (e.remote !== void 0 && !yEm) ((yEm =
!0), O("tengu_dead_probe_remote_flag_alias", {}));` followed immediately by `let n = e.cloud ?? e.remote;`.

**Why fire-and-continue rather than deprecate-and-warn:** a deprecation warning *changes the population
you are measuring* — tell users `--remote` is deprecated and they stop using it, and the resulting zero
proves nothing about whether deletion was safe *before* the warning. "Delete it and see who complains" is
unrecoverable for a CLI shipping to pinned installs and CI jobs; there is no server-side rollback for a
deleted branch in a shipped binary. And static analysis cannot answer the question: every one of these
branches is *statically* reachable — the input is a config file on someone's disk, an argv the user
typed, a model-generated tool call, or a wire frame from an older peer. Only a census over real installs
decides.

Two structural facts confirm the reading. `grep -c 'Ke("tengu_dead_probe'` is **0**: not one of these
names is ever passed to the feature-gate evaluator — pure measurement, never control. And the payload
alphabet is closed by construction: every probe value passes through an erased brand constructor
(`Ee` `:138`, `fe` `:141`), producing lines that are pure nonsense at runtime
(`{ param: o === "agentId" ? Ee("agentId") : Ee("bash_id") }`) because the wrapper accepts only a string
*literal* type. The privacy surface of a fleet-wide census is enforced by the type system, not by review.

**Key insight:** this converts a judgement ("this looks dead") into a measurement with a falsifiable
prediction (count == 0). It also means **the 25-member list is a preview of the next release's removal
notes**: anything that reports zero is a deletion candidate. Full treatment in
[`../46_todo_tasks/dead_probe_gate_family.md`](../46_todo_tasks/dead_probe_gate_family.md).

### 2.2 Three of six new `tengu_remote_*` gates are dead behind a `null` sentinel

The six new Remote Control gates are all `220>0 / 193=0`. Three fire: `tengu_remote_active_goal_adopted`
(`:757214`, `:757334`, `:757958`), `tengu_remote_bootstrap_cycle_hidden` (`:757247`),
`tengu_remote_model_picker` (`:715357`, `:715363`). Three **can never fire**:
`tengu_remote_reply_channel_init` (`:757204`, `:757208`), `tengu_remote_reply_channel_frame` (`:757388`)
and `tengu_remote_subagent_frame_nested` (`:757401`).

The last is the easy case — a *local* sentinel, `let ut = null;` at `:757389` immediately followed by
`if (ut !== null) {` at `:757390`. Anyone reading the function sees it.

The first two are the hard case, and the more instructive finding. `cqt` is declared `cqt = null` at
`:757708` — **500 lines below its own guards** — and occurs exactly **8 times in the whole 872,596-line
bundle**: the declaration, five `cqt !== null` guards (`:757198`, `:757199`, `:757303`, `:757364`,
`:757377`) and two member accesses that only run inside those guards (`cqt.hasReplyChannelInit`
`:757304`, `cqt.replyChannelBlockKind` `:757379`). **There is no other assignment.** So the entire
"remote reply channel" — two gates, a store field, a seeded tool-use-id set and two UI selectors, every
one of them `220>0 / 193=0` — is inert.

**Why this matters for method:** a literal-count audit scores the reply channel as a large, confident
`NET_NEW` — five distinct 220-only anchors and two telemetry gates. It is dark. The rule that catches it:
**when a new feature's entry condition is a bare identifier compared against `null`, resolve that
identifier's declaration before writing a word**, by grepping the whole file rather than scrolling. See
[`../54_remote_control/client_surfaces.md`](../54_remote_control/client_surfaces.md) §1.

### 2.3 `alias_migration` shipped disarmed, in both halves

`.219` changed what the bare word `opus` resolves to. Users who had *pinned* a model in
`userSettings.model` would not follow that change. The bundle ships the migration for them, fully
plumbed and completely inert:

```javascript
// ============================================
// applyModelAliasMigration - rewrites a pinned userSettings.model to its successor id
// Location: cli_inner_pretty.js:833732-833744  (map at :833753, call site :834073)
// ============================================

// ORIGINAL (for source lookup):
async function rTm(e = qlE) {
  if (Hn() !== "firstParty") return !0;
  let t = Pr("userSettings")?.model;
  if (!t) return !0;
  let r = Qs(t);
  if (!Object.hasOwn(e, r)) return !0;
  let n = e[r];
  if (n === void 0) return !0;
  let o = r !== t,
    { error: i } = await yi("userSettings", { model: o ? `${n}[1m]` : n });
  if (i) return (w(`Failed to apply model alias migration: ${i}`, { level: "error" }), !1);
  return (O("tengu_alias_migration", { from_model: Bu(r), to_model: Bu(n), has_1m: o }), !0);
}
var qlE;
/* … */ qlE = {};                                   // :833753 — the migration map, EMPTY

// READABLE (for understanding):
async function applyModelAliasMigration(migrationMap = ALIAS_MIGRATION_MAP /* = {} , :833753 */) {
  if (currentProvider() !== "firstParty") return true;          // first-party only
  const pinned = readSettings("userSettings")?.model;
  if (!pinned) return true;
  const base = strip1mSuffix(pinned);
  if (!Object.hasOwn(migrationMap, base)) return true;          // <- ALWAYS TAKEN: map is {}
  const target = migrationMap[base];
  if (target === undefined) return true;
  const had1m = base !== pinned;                                // preserve a [1m] suffix
  const { error } = await writeSettings("userSettings", { model: had1m ? `${target}[1m]` : target });
  if (error) { log(`Failed to apply model alias migration: ${error}`, { level: "error" }); return false; }
  logEvent("tengu_alias_migration", { from_model: safe(base), to_model: safe(target), has_1m: had1m });
  return true;
}

// Mapping: rTm→applyModelAliasMigration, qlE→ALIAS_MIGRATION_MAP, Hn→currentProvider,
//          Pr→readSettings, Qs→strip1mSuffix, yi→writeSettings, O→logEvent, w→log
```

The function runs on **every** first-party startup (`:834073`, `e.push(await rTm())`) and always returns
at the fourth line. The *catalogue's* matching field, `alias_migration: {}` at `:14495`, is
schema-validated and **read by nothing**. Both halves shipped empty.

**Why ship it disarmed?** The map is the risky part, not the code. A migration that rewrites a user's
pinned model is irreversible from the user's side, so shipping the runner one release ahead of any
population means the *first* migration to run is executed by code that has already survived a release —
and populating `qlE` later is a one-line diff, whereas adding the runner during an incident is not.
`tengu_alias_migration` is in the 326-new-gate list and has never fired.

### 2.4 `opus_5_prompt_bundle`: two of six gates cannot be reached by the model

The Opus 5 catalogue entry carries a capability token that no API surface consumes — `opus_5_prompt_bundle`
(**220=2 / 193=0**, declared at `:14395`). Its only job is to turn on six prompt experiments at once:

```javascript
// ============================================
// isOpus5PromptBundleEnabled / gateOrBundle - one capability token, six prompt gates
// Location: cli_inner_pretty.js:118700-118725 (gate names :118744-118750)
// ============================================

// ORIGINAL (for source lookup):
function ZXn(e) {
  if (e === void 0) return !1;
  if (M$(lo(e), "opus_5_prompt_bundle") !== !0) return !1;
  return !Ke(Qcg, !1);
}
function vQt(e, t, r) { return e || ZXn(r) || Jx()?.[t] === !0 || Ke(t, !1); }
function jFc(e) { return vQt(Z.CLAUDE_CODE_MARL_CORMORANT,  Vcg, e); }
function WFc()  { return vQt(Z.CLAUDE_CODE_GORSE_PLOVER,    Kcg, void 0); }
function qFc()  { return vQt(Z.CLAUDE_CODE_AMBER_ASTROLABE, Ycg, void 0); }
... GFc/zcg, VFc/Xcg, zFc/Jcg elided — all take (e) and pass it through, like jFc

// READABLE (for understanding):
function isOpus5PromptBundleEnabled(model) {
  if (model === undefined) return false;                                        // <- see below
  if (modelHasCapability(normalizeModelId(model), "opus_5_prompt_bundle") !== true) return false;
  return !getFeatureValue(OPUS5_BUNDLE_KILL_SWITCH, false);                     // "tengu_fennel_godwit"
}
function gateOrBundle(envOverride, gateName, model) {
  return envOverride                                   // 1. per-experiment env override
      || isOpus5PromptBundleEnabled(model)             // 2. the model-carried bundle
      || orgFlagSettings()?.[gateName] === true        // 3. server-pushed client data
      || getFeatureValue(gateName, false);             // 4. the individual GrowthBook gate
}
// marl_cormorant / gault_kestrel / bison_cairn / larch_cistern  -> gateOrBundle(env, gate, model)
// gorse_plover / amber_astrolabe                                -> gateOrBundle(env, gate, undefined)
//                                                                  ^^^^^^^^^ bundle path is dead
// Mapping: ZXn→isOpus5PromptBundleEnabled, vQt→gateOrBundle, M$→modelHasCapability,
//          lo→normalizeModelId, Ke→getFeatureValue, Jx→orgFlagSettings, Qcg→"tengu_fennel_godwit"
```

**`WFc` (`:118714-118716`) and `qFc` (`:118717-118719`) pass `void 0` as the model**, and
`ZXn(undefined)` returns `false` on its first line. So selecting Opus 5 auto-enables **four** of the six
experiments; `tengu_gorse_plover` and `tengu_amber_astrolabe` remain env-, org- or gate-only. All seven
names (six plus the kill switch `tengu_fennel_godwit`) are in the 326-new-gate list, and the list cannot
distinguish the four from the two. Note also the strictness — `!== !0` rather than truthiness, because
`modelHasCapability` is tri-state and returns `undefined` both for "in the catalogue without the token"
and "not in the catalogue at all": an unknown model must never inherit a prompt bundle tuned for one
specific model.

### 2.5 The general conclusion, and a taxonomy

**A gate appearing in the "326 new gates" list proves that a string is present. It proves nothing about
reachability.** The four cases above are four distinct mechanisms, and only one is visible from the
emission site:

| Mechanism | Example | Visible from the emission site? |
|---|---|---|
| Local `null` sentinel | `ut` `:757389-757390` → `tengu_remote_subagent_frame_nested` | yes — four lines up |
| **Module-level `null` sentinel** | `cqt` `:757708` → the reply channel | **no** — 500 lines away |
| **Empty data table** | `qlE = {}` `:833753` → `tengu_alias_migration` | **no** — a different file section |
| **Argument that is always `undefined`** | `void 0` at `:118715`/`:118718` | **no** — one call frame away |
| Live emission, dead *subject* | the 25 `tengu_dead_probe_*` | n/a — inverted: the emission is live, the code it measures is hypothesised dead |

The last row is worth separating: `dead_probe` is not an unreachable gate but the *opposite* — a gate that
fires precisely when unreachability turns out to be false. Conflating the two is easy and wrong.
**Method that survives all five:** before writing up a gate, resolve every identifier in its guard chain
to a declaration and check the *arity and arguments* of the enclosing accessor, grepping across the whole
bundle rather than within a window.

---

## 3. Two bullets are contradicted by the code

Most bullets in this window are accurate; 48 over-claim (the `CARRYOVER` class, catalogued in
[`_false_delta_ledger.md`](_false_delta_ledger.md) register 1). Two are different in kind: they state a
change that the shipped artefact does not contain.

### 3.1 `.219` "Removed Opus 4.7 from fast mode" is *premature* — and the window was 1 h 42 min 15 s

**The bullet:** *"Removed Opus 4.7 from fast mode; `/fast` now applies to Opus 5 and Opus 4.8."*

**The code:** Opus 4.7 is fast-mode eligible in 2.1.220 **on two independent paths**. The catalogue entry
declares it — `:14324` reads
`capabilities: ["effort", "max_effort", "xhigh_effort", "adaptive_thinking", "context_management", "fast_mode"]`
— and the eligibility predicate `mv` (`:109467-109474`) checks the capability *and then* a substring
fallback, `return n.includes("opus-4-7") || n.includes("opus-4-8") || n.includes("opus-5");` (`:109473`).
Removing the capability alone would not have been enough.

**What actually shipped is a countdown.** `LIc` (`:109491-109498`) formats a sunset date, or returns
`null`:

```javascript
function LIc() {
  if (lo(Oi()) !== "claude-opus-4-7") return null;
  let e = Ke("tengu_sunset_penguin_opus47", "2026-07-25"),
    t = Date.parse(e);
  if (Number.isNaN(t) || Date.now() >= t) return null;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
```

Its single caller `ZFo` (`:499782-499790`) builds
`{ key: "opus47-fast-mode-deprecation", text: "Opus 4.7 fast mode is deprecated and will be removed on ${e}", priority: "immediate", color: "warning" }`.

**The arithmetic is the finding.** `Date.parse("2026-07-25")` on a **date-only** string yields UTC
midnight, `2026-07-25T00:00:00Z`. This build's own `BUILD_TIME` (`:228`) is `2026-07-24T22:17:45Z`. The
notice's displayable window from build was therefore **1 h 42 min 15 s** — and because the function
returns `null` once `Date.now() >= t`, **2.1.220 is the last build that can ever render it**. Anyone
running this build today sees nothing.

**Why the discrepancy exists, and what it teaches.** The removal is a *server* decision: the gate name
`tengu_sunset_penguin_opus47` is **220=1 / 193=1** — carryover — and the org/flag layer that actually
disables fast mode per account is read at `:109461-109466`. The client shipped the announcement of a
removal the release note describes as done. There is a second, structural finding in the same place:
2.1.193 held this as a *data table* (`QYu`, `:102522-102525 (193)`, one row per sunsetting model with
`{canonical, label, flag, defaultDate}`); 2.1.220 collapsed it to a hardcoded single-model function once
the Opus 4.6 row expired. **A count-only check calls this "no change" — the gate name is 1/1 — while the
surrounding structure was rewritten.** That is the strongest argument in this tree for reading code
rather than counting literals.

**Key insight:** reason from the *constant*, never from behaviour. A reader who ran the binary to check
this bullet would observe no banner and conclude the removal had happened.

### 3.2 `.201`'s Sonnet-5 change was *replaced*, not reverted — there are three framing states

**The bullet** (`.201`, a single-bullet release): *"Claude Sonnet 5 sessions no longer use the
mid-conversation system role for harness reminders."* The tempting summary — "reverted" — is **half right
and must not be quoted alone.**

**What was reverted: the role-level exclusion.** `Ser` (`:150505-150526`), the memoised
`supportsMidConversationSystem`, holds an explicit exclusion list — `claude-3-*`, opus-4-0/4-1/4-5/4-6/
**4-7**, sonnet-4-0/4-5/4-6, haiku-4-5 (`:150511-150521`) — and **`claude-sonnet-5` is not in it**.
Control reaches `if (M$(r, "mid_conv_system") || r === "claude-mythos-5") return !0;` (`:150524`), and
Sonnet 5's catalogue entry declares `mid_conv_system` at `:14207`. So Sonnet 5 *does* use the
mid-conversation system role in 2.1.220.

**What survives: a Sonnet-5-only carve-out one level down.**

```javascript
// ============================================
// isSonnet5 - the presentation-level Sonnet-5 carve-out that replaced .201's role-level exclusion
// Location: cli_inner_pretty.js:150395-150397, consumed at :508117 and :531422
// ============================================

// ORIGINAL (for source lookup):
function mro(e) { return lo(e) === "claude-sonnet-5"; }
/* consumer 1 */ Jep = Vr((e) => (nvi(() => Jep.cache.clear?.()), Ser(e) && !mro(e) && !$Fc(lo(e))), () => "latch");
/* consumer 2 */ let o = r !== void 0 && Ser(r), i = r !== void 0 && o && mro(r);
/* $Fc */        function $Fc(e) { return Qs(e) === "claude-opus-4-8"; }
/* Ww  */        function Ww(e) { return `<system-reminder>\n${e}\n</system-reminder>`; }

// READABLE (for understanding):
function isSonnet5(model) { return normalizeModelId(model) === "claude-sonnet-5"; }

// :508117 — should this model be told what a mid-conversation system turn IS?  (used at :507550)
const shouldExplainMidConvSystem = memoize((model) =>
  supportsMidConversationSystem(model) && !isSonnet5(model) && !isOpus48(normalizeModelId(model)));

// :531422 — should each reminder be individually <system-reminder>-wrapped?  (Sonnet 5 only)
const wrapEachReminder = model !== undefined && supportsMidConversationSystem(model) && isSonnet5(model);
//   …later:  push({ content: wrapEachReminder ? aggregate : wrapReminder(aggregate) })
//   …later:  push(...(wrapEachReminder ? parsed.reminders.map(wrapReminder) : parsed.reminders))

// Mapping: mro→isSonnet5, Ser→supportsMidConversationSystem, $Fc→isOpus48, Jep→shouldExplainMidConvSystem,
//          lO_→MID_CONV_SYSTEM_FRAMING (:508025-508026), Ww→wrapReminder (:532376-532380),
//          NN→buildSystemTurn (:531420), Vr→memoize, Qs→strip1mSuffix, lo→normalizeModelId
```

Two consequences, both read in the bundle. **The framing sentence is withheld from two models:** `lO_`
(`:508025-508026`) — *"The system may send updates, reminders, or modifications to rules via
mid-conversation system turns. These are system-controlled, unlike function results."* — is
**220=1 / 193=0** and is returned at `:507550` only when `Jep(model)` is true, so Sonnet 5 is excluded by
`mro` **and Opus 4.8 by `$Fc`** (`:118668-118669`). **And the wrapping is inverted for Sonnet 5:** at
`:531420-531422` the flag is true only for Sonnet 5 and it flips which layer gets the `<system-reminder>`
tags (`Ww`, `:532376-532380`) — on Sonnet 5 each reminder is wrapped individually and the aggregate is
not; on every other model the aggregate is wrapped and the individual reminders are not.

**Correct statement: `.201`'s role-level exclusion was reverted and replaced by a presentation-level
shim. There are THREE framing states — Sonnet 5, Opus 4.8, everything else — not two.** The bullet
describes state 1 as a role decision; the code implements it as a rendering decision and extends part of
it to a model the bullet never mentions. See
[`../40_system_prompt/mid_conversation_system_role.md`](../40_system_prompt/mid_conversation_system_role.md).

---

## 4. Provider-dependence is invisible in the changelog

`.219` bullet 1: *"Claude Opus 5 … now the default Opus."* `.197`: *"Introducing Claude Sonnet 5: now the
default model in Claude Code."* Both sentences are unqualified. Both are **first-party statements
rendered as universal ones**, and the catalogue is the only place the asymmetry is visible. The alias
table at `:14461-14486`, read verbatim:

```javascript
aliases: {
  opus:   { default: "claude-opus-5",
            per_provider: { bedrock: "claude-opus-5", vertex: "claude-opus-5", foundry: "claude-opus-4-6",
                            mantle: "claude-opus-5", anthropic_aws: "claude-opus-5", gateway: "claude-opus-4-7" } },
  sonnet: { default: "claude-sonnet-5",
            per_provider: { bedrock: "claude-sonnet-4-5", vertex: "claude-sonnet-4-5", foundry: "claude-sonnet-4-5",
                            mantle: "claude-sonnet-4-5", anthropic_aws: "claude-sonnet-4-6", gateway: "claude-sonnet-4-6" } },
  haiku: { default: "claude-haiku-4-5" },  fable: { default: "claude-fable-5" },
},
```

Three readings the changelog does not support:

1. **`opus` is Opus 5 on first-party, Bedrock, Vertex, `anthropic_aws` and Mantle — but Opus 4.6 on
   Foundry and Opus 4.7 on the gateway.** A Foundry user who reads `.219` and types `/model opus` gets a
   model two generations behind the one the bullet names.
2. **`sonnet` is Sonnet 5 on first-party and nowhere else.** Every listed third-party channel still
   resolves to 4.5 or 4.6 — **twenty-two releases after `.197` announced Sonnet 5 as "the default model
   in Claude Code"**. That is the largest gap between a bullet and the artefact in this window, and it is
   invisible unless you read the table.
3. **`.207`'s bullet was silently overwritten.** `.207` said *"Changed Bedrock, Vertex, and Claude
   Platform on AWS to default to Claude Opus 4.8"*; those three rows now read `claude-opus-5`. Two
   changelog entries describe the same three fields twelve releases apart, only the later one is true in
   the shipped build, and nothing in the changelog links them.

**Why per-provider aliasing exists at all:** one binary serves channels whose model rollout schedules
belong to other companies — a Bedrock or Foundry region gets weights when that cloud publishes them. The
alternatives are worse: a single `default` plus runtime availability probing adds a network round-trip to
model selection and fails closed on a cold start; per-provider *builds* multiply the release matrix.

**The same shape recurs one level down as a fail-safe decision.** The 1M-context predicate
`native1mOnThirdParty` treats `"gateway"` as an **intersection**, not a union — a gateway request may be
served by Bedrock, Vertex *or* Foundry and the client cannot know which, so the native 1M window is
claimed only when all three upstreams have it. A two-of-three claim would produce a hard API failure on
the third. Same principle as the alias table: **the abstraction layer must assume the worst upstream.**

**Key insight:** every capability claim in this product is really a claim about a (model, provider) pair.
The changelog has no vocabulary for the second coordinate, so it drops it, and a reader on any channel
other than first-party should treat every unqualified model statement in this window as unverified for
them. See [`../47_models/opus5_and_sonnet5.md`](../47_models/opus5_and_sonnet5.md) and
[`../47_models/anthropic_google_cloud_channel.md`](../47_models/anthropic_google_cloud_channel.md) — the
latter documenting an **eighth provider channel** (`anthropic_google_cloud` 220=20 / 193=0;
`CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` 220=13 / 193=0) with **no bullet in any of the 25 releases**.

---

## 5. What 99 `UNANCHORED` bullets actually mean

17.1% of the window's bullets could not be tied to a client-side anchor. That number deserves an honest
argument rather than an apology: **it is a finding about method and about the subject matter, not a
coverage gap.**

### 5.1 The distribution is not random

Of the ~90 `UNANCHORED` rows in the per-release map whose primary theme is recorded, **21 are
`accessibility_ui`** (a further 8 have it as a secondary theme) and **8 are `background_agents`** —
between them roughly 40% of the class. Compare the per-release spread:

```
.214  47 bullets   2 UNANCHORED   4%   shell-permission analyzer — string-rich, constant-rich
.208  46 bullets   4 UNANCHORED   9%   resource bounds — every fix is a named numeric cap
.212  48 bullets   5 UNANCHORED  10%   delegation budgets — new commands, new env vars
.203  37 bullets  13 UNANCHORED  35%   daemon timing, terminal escapes, Windows file I/O
.216  40 bullets  13 UNANCHORED  33%   fullscreen layout, resume-picker focus, worktree lifecycle
```

The correlation is with **what kind of thing was changed**, not with the effort spent. A fix reading
*"Fixed dialogs in fullscreen mode stretching past the right edge of their panel"* has no string, no
constant, no gate, no settings key and no telemetry event — it is a change to an arithmetic expression
inside one of hundreds of structurally identical layout functions. There is no anchor because there is
nothing anchor-shaped.

### 5.2 Mature subsystems produce single-line deltas

[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.4 is the worked example,
and it defines the ceiling on what anchoring can achieve. The bullet — *"Fixed Bash permission checks
misjudging very long commands — commands over 10,000 characters now always prompt instead of running
automatically"* — reads like an introduction. It is not.

- The number is useless: `10000` is **220=36 / 193=34**.
- The obvious literal is a **decoy**: `10,000 characters` is **220=1 / 193=1**, and its 2.1.220 site
  (`:205495`) is the *Windows sandbox argv* error message — *"On PowerShell the script is base64-encoded
  first (~2.7x), leaving roughly 10,000 characters of script"* — nothing to do with permissions.
- The real threshold is a named constant, `AIe = 1e4` at `:512643`, ten occurrences in 220 against nine
  in 193.
- **The delta is the set difference: exactly one new guard**, at `:392119` —
  `if (r.length > AIe) return { behavior: "passthrough", message: "Command too long for read-only analysis" };`
  — and that message is **220=1 / 193=0**, the only genuinely new string in the whole cluster.

When a subsystem is this mature the honest ceiling is "locate the one changed line", and for a *sibling*
bullet whose changed line happens to carry no string, the honest answer is `UNANCHORED`. Reporting the
carryover is the finding; an invented introduction would be worse than silence — and the ledger records
48 bullets where exactly that temptation was resisted.

### 5.3 A two-point diff across 27 version numbers cannot attribute

Only two bundles exist for this window: `2.1.193` and `2.1.220`. Every delta the diff can see is
attributable to *some* release in the window and **nothing in the diff carries a release stamp**. This
hard limit bites in three ways.

**Superposition.** `.217` disabled nested subagents by default; `.219` re-enabled them at depth 3. The
bundle contains one resolver, `hee` (`:230896-230905`), with `ZDu = 3` at `:230906` behind the gate
`tengu_hazel_trellis` (`:230907`, 220=1 / 193=0). The flip-flop happened **server-side**; neither release
is separately visible. The code shows the *end state* and the mechanism, never the sequence.
**Overwriting.** §4's `.207` → `.219` alias case: the earlier bullet's value is simply not in the bundle
any more. **And `.220` itself is unattributable in principle** — its one bullet cannot be checked because
there is no `.219` bundle to diff against, and the only `.220`-specific fact readable from the artefact is
its build identity at `:226-229`. The tree records it as `UNANCHORED` rather than `SERVER_SIDE`
deliberately: `SERVER_SIDE` would assert the change lives outside the client, a positive claim the
evidence does not support, since a new binary *was* cut. See
[`../by_version/2.1.220.md`](../by_version/2.1.220.md).

### 5.4 Some bullets have no client artefact at all

Three legitimately unanchorable classes. **Not JavaScript:** `srt-win`'s WFP filter semantics live in a
separate Rust binary (`vendor/srt-win-src`, `:211291 (193)`), macOS Local Network entitlements live in a
plist, and the VS Code extension is a different package — `.203`'s *"Enable Remote Control for all
sessions"* toggle greps **220=1 / 193=1** on the CLI side (`:452049`), because the string exists in both
builds and the toggle is in neither. **Server-side:** fast-mode org policy (§3.1), the gateway upstream
list, the Sonnet-5 promo end date, the GrowthBook values behind `tengu_hazel_trellis` and
`tengu_brindle_causeway`. **Not source-verifiable by construction:** `.203`'s *"binary size −7 MB and
startup memory −7 MB via lazy dependency load"* cannot be checked against a bundle that **grew 21.4%**;
both bundled `.node` addons are unchanged and the claim is about a different artefact axis than line
count.

### 5.5 What `UNANCHORED` is not

It is not "not investigated": every row in the class names the candidates eliminated — the gap register in
[`changelog_to_code_map.md`](changelog_to_code_map.md) §4 carries 70 rows, and the per-release files carry
the probe lists (`.216` bullet 27: *16 probes, all 0/0 or carryover*). Nor is it "probably server-side" —
that is a different verdict with a different evidential standard, used exactly 3 times in 579.

**Key insight:** the useful metric is not "what fraction of bullets did we anchor" but "what fraction
*have* an anchor to find". `.214`'s 96% and `.216`'s 67% are both near their respective ceilings; a tree
reporting 100% would be a tree that invented anchors.

---

## 6. The traps, as a transferable methodology

Six distinct failure modes were caught in this tree, four of them by *cross-validation retracting an
earlier claim*. They generalise to any obfuscated-bundle diff, and they are ordered here from most to
least obvious.

### 6.1 Identifier reuse across builds

Symbols are re-mangled between builds and **old ids get reused for unrelated declarations**. `yBc` is
**220=2 / 193=2**, which reads as textbook carryover; it is not — 193's `yBc` is a vendored helper at
`:9245 (193)`, 220's is declared at `:119662` and used as `thinkingConfig: yBc(...)` at `:344538`. In the
opposite direction, the Explore agent's opus cap greps `$Wu = "opus"` **220=1 / 193=0**, which reads as
net-new; the constant existed as `DYa = "opus"` at `:384831 (193)`. Both are pure naming artefacts.

**Rule: never carry a symbol across builds. Re-derive every identifier from a stable anchor — a string
literal, a gate name, an env var, a settings key — inside the target bundle.**

### 6.2 Equal counts that are not carryover

A `220=N / 193=N` match is evidence of nothing on its own. `.208`'s screen-reader bullet is instructive
*in both directions*: `axScreenReader` is **2/2**, `--ax-screen-reader` **3/3**, `CLAUDE_AX_SCREEN_READER`
**6/5** — the feature was dark-launched in 2.1.193 with a byte-identical description string, so the
bullet's "Added" is wrong. But the *real* delta appears only on reading both sites:

```
220 :156208    else ((e = eo().axScreenReader === !0), (t = "settings"));
193 :137299      e = t !== void 0 ? t : Lr().axScreenReader === !0;
```

2.1.220 returns a **source tuple** (`"flag"` / `"settings"`) that 2.1.193 does not. The count says
"nothing"; the code says "the resolver now reports provenance". `screenReader` is meanwhile
**220=9 / 193=3** — the *group* around the field grew even though the field did not.

**Rule: read the declaration in BOTH bundles before accepting an equal-count row as carryover.**

### 6.3 Unequal counts attributed to the wrong subsystem

This produced a false delta that survived into the tree's own ground truth before being retracted.
`consecutiveFailures` is **220=11 / 193=6**; the +5 looks like a new circuit breaker on compaction, and
§6.6 of the ground-truth file said exactly that. It was wrong. The compaction breaker is **pure
carryover** — `failure_breaker_open` is 1/1 (`:441117` vs `:470252 (193)`), the threshold is `3` in both
builds, and the 193 line is byte-identical apart from a re-mangled constant name. **The five extra 220
sites are an unrelated artifact live-watch backoff at `:420177-420192`.** A *generic* field name
(`consecutiveFailures`, `timeout`, `retries`, `enabled`) is shared across subsystems, so its aggregate
count is a sum over unrelated features and says nothing about any one of them.

**Rule: for any generic identifier, enumerate the sites with `grep -n` and classify each one before
subtracting.** The retraction is preserved in
[`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.6.

### 6.4 Regex metacharacters in `grep -c` — and why this trap hides from a careful analyst

`grep -c` treats its argument as a **regex**. Unescaped `.` is a wildcard. Reproduced live in this
bundle:

```
grep -c  'workflow.run_id'   →  220=3   193=2      grep -cF 'workflow.run_id'   →  220=1   193=0
grep -c  'workflow.name'     →  220=11  193=8      grep -cF 'workflow.name'     →  220=1   193=0
```

`.202`'s bullet — *"Added `workflow.run_id` / `workflow.name` OTel attributes"* — was written off as
"partially pre-existing" on the strength of the first column. The 193 matches are `workflow_run_id: n` at
`:424852 (193)` and `:424892 (193)`, **snake_case fields inside the `tengu_workflow_completed` telemetry
payload** — a different namespace entirely from the dotted OTel attribute emitted at `:111461`
(`return { "workflow.run_id": e.workflowRunId, ...(e.workflowName && { "workflow.name": e.workflowName }) };`).
Both attributes are genuinely **NET_NEW**, emitted together on one line.

**The direction of this error is what makes it dangerous.** It inflates the *baseline* count, so it
produces **false CARRYOVER** — false *negatives*. Every other trap here produces false positives, which a
"when in doubt, say carryover" bias suppresses; this one the bias **actively conceals**, because the
analyst's caution and the tool's error point the same way. The result is a confident, wrong, conservative
verdict that no amount of extra caution will surface.

**Rule: use `grep -cF` for every count. Always.** Anything resembling `a.b`, `foo.json`, `x.y.z`, `${…}`,
`[…]`, `a|b`, `a+`, `a*`, `a?` must be counted fixed-string. The tree's other dotted carryover claims were
re-audited and are unaffected (`filesystem.disabled` 7/6, `.claude/rules` 8/5, `MEMORY.md` 9/4,
`context: fork` 3/2, `claude.exe` 8/8 measure identically under `-F`); one (`daemon.lock`, regex 10/3 vs
fixed 4/2) differs but was already cited at the `-F` value.

### 6.5 The asset lists are leads, not evidence

Every extracted asset list in this build is wrong in at least one direction, and the error rates differ by
an order of magnitude. **`feature_gates.json`** (1,731 entries) is ~99.4% reliable for net-new detection,
with 2 false-new (`gate_denied`, `tengu_session_fork` both exist in 193) — but it **also under-reports**:
23 `dead_probe` names listed, **25 in the bundle**. **`env_vars.json`** is broken both ways: it lost 163
live entries, gained 47 that are obfuscated identifiers (`AUl`, `BGh`, `d`, `__r`), and carries at least
one genuine false-new (`CLAUDE_CODE_REMOTE_SEND_KEEPALIVES`, 220=3 / **193=3**). The **`cli_flags.json`
NEW list** (51) is **~6× over-counted**: ~8 real flags, ~21 argv we construct for *other* binaries (git,
gh, rg, docker), ~19 not flags at all — CSS custom properties from bundled skill payloads (`--accent`,
`--ink-muted`) and substring artefacts (`--hand` ⊂ `--handle-uri`). **`tools_index.json`** (top level) is
unusable at 1 entry (use `tools/_index.json`, 65, itself noisy), and **`slash_commands.json`** presents
filesystem paths as commands.

The under-report in the gate list is the subtle one: the asset **cannot be used as a completeness
oracle**. The source-level oracle is `grep -o 'tengu_[a-z0-9_]*' | sort -u` (**220=1,755 / 193=1,471**),
and the character class must include `0-9` or `tengu_dead_probe_plugins_v1_file` truncates at the digit.

### 6.6 The procedure that survives all six

1. Take the bullet's most distinctive **string literal**, not its numbers and not its identifiers.
2. `grep -cF 'literal' $T $B` — **both files, one call, fixed-string**.
3. If `193 > 0`, the bullet over-claims: find the narrower delta by enumerating sites with `grep -n` in
   both bundles and taking the set difference.
4. If `193 = 0`, **read the 2.1.220 site and its whole guard chain**, resolving every identifier in the
   guard to a declaration anywhere in the file (§2.5).
5. Check the *arity* of any accessor between you and the guard — an always-`undefined` argument is
   invisible at the guard.
6. If nothing anchors, say `UNANCHORED` and **name the candidates you eliminated** (§5.5).

Steps 4 and 5 are what this window added; steps 1–3 were already the practice, and step 2's `-F` is the
correction this window forced.

---

## 7. What the window was actually about

Strip the 579 bullets to their mechanisms and four programmes account for most of the work — none of them
named in any release heading.

**1. Delegation acquired budgets and boundaries.** In 2.1.193 the only limit was a depth constant. By
2.1.220 there are four caps declared side by side at `:231398-231411` — concurrency (`gty = 20`),
per-session spawns (`yty = 200`), per-session web searches (`_ty = 200`), each read as
`Z.<ENV> ?? <const>` with no gate and no validation — plus a fifth, spawn depth, that is *deliberately
different*: `hee` (`:230896-230905`) validates (`Number.isInteger(r) && r >= 1`) and consults a remote
gate before falling back to `ZDu = 3`. **That asymmetry is a prediction, and it came true**: depth was the
one Anthropic expected to change without a release, and it moved twice (`.217` off, `.219` to 3) with no
enforcement code touched.

**2. Dark switches were promoted to settings.** The three-step shape ran three times in the sandbox alone:
build the capability with a runtime-only property; ship it (`strictAllowlist` is **220=4 / 193=1**, and
the single 193 site *is* the enforcement branch — dead code, `:211506 (193)` byte-identical to `:195200`);
then attach a schema field, a scope rule and an aggregation rule. The changelog reports step 3 as *"Added
`<setting>`"* — true for the user, misleading for anyone diffing code — while the enabling refactor,
extracting a reusable trusted-settings-scope primitive that 2.1.193 had inline exactly once, has no
bullet.

**3. Deletion became evidence-driven.** §2.1's 25-probe census, plus at least two *executed* deletions in
the same spirit: the stream watchdog's gate is gone (`tengu_event_watchdog_default_on` **220=0 / 193=1**)
and the resolution collapsed from
`Be.CLAUDE_ENABLE_STREAM_WATCHDOG ?? it("tengu_event_watchdog_default_on", !1)` (`:595164 (193)`) to
`Z.CLAUDE_ENABLE_STREAM_WATCHDOG ?? !0` (`:510479`). Two further 193 sites that *set* the variable in a
child environment (`:606918 (193)`, `:715178 (193)`) are gone too, which is why the literal count fell
**4 → 2** for a bullet announcing a default-on. **A default flipping on deletes code; the count goes
down.** That is the `GATE_REMOVAL` verdict, and it applies to exactly 2 of 579 bullets.

**4. Observability shifted from measurement to correlation.** The count of distinct OTel log events did
not change (39 in both builds); what changed is that records became joinable — a `context` field resolved
through a new three-tier resolver, `workflow.run_id`/`workflow.name` scoped to subagent contexts, a
`traceparent` ingest path, and `build_time` as an OTel *resource attribute* so every metric slices by
build. That last is the quiet explanation for `.220`: a release whose only claim is "reliability
improvements" is a release whose evidence is a dashboard, not a feature.

---

## 8. Confidence, and the limits of this reading

**HIGH confidence** — every claim in §1.1, §1.2, §2.1–2.4, §3.1, §3.2, §4, §6.1–6.5, each resting on a
both-bundle `grep -cF` count *and* a read of the 2.1.220 declaration. The sharpest (the alias table, the
`cqt` sentinel, the `void 0` arguments, the `qlE = {}` map, the `Ww` inversion, the MCP tripwire) rest on
reading code rather than counting anything.

**MEDIUM confidence** — §1.3's characterisation of the Windows rewrite as *complete* rather than
*substantial*. This extract is the **Linux target build** (`kH()` is emitted as `switch ("linux")`), so
every Windows branch quoted is live source text that is statically unreachable in *this* artefact: the
counts are certain, the runtime behaviour inferred. Likewise §1.2's ~16,000-line figure for the forked
MCP region is bracketed by module-table positions, not by a byte-level clone analysis — the two trees are
*not* required to be identical. Also MEDIUM: §5's claim that the `UNANCHORED` rate is near its ceiling for
the layout-heavy releases, which is an argument from the shape of the changes rather than a proof.

**LOW confidence** — any statement about *when within the window* something happened, unless a release is
named by a changelog bullet that the code corroborates. Two bundles, 27 version numbers. §5.3 states this
limit and it applies retroactively to every attribution here. **Nothing was executed**; all claims are
static reads.

**One correction this document makes to an existing tree document.** `claude-mythos-5` is described in
[`../by_version/2.1.220.md`](../by_version/2.1.220.md) §5.1 as *"An unannounced family, shipped inert"*,
grouped with the three undocumented structural changes. "Unannounced" and "inert" are both correct (every
`provider_ids` value in its catalogue entry is `null`, `capabilities` is `[]`) but it is **not new in this
window**: `claude-mythos-5` is **220=25 / 193=31** — the count went *down*. It is a pre-existing
unannounced family the catalogue rewrite disowned, not a 2.1.220 addition. No document in the tree calls
it net-new, so this is a framing correction rather than a factual error, reported rather than silently
edited.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](symbol_index_infra_integration.md) - Integrations
>
> Per-theme 2.1.220 additions are staged here as `symbol_additions_v2_1_220_<theme>.md`.

Key symbols read in the 2.1.220 bundle for this document:

- `MODEL_CATALOGUE` (`Skl`, `:14008-14496`) - the generated, zod-validated catalogue; doc comment `:14009`, `pricing_tiers` `:14011-14025`, aliases `:14461-14486`, `latest_per_family` `:14489-14494`, `alias_migration` `:14495`
- `getMcpSdkGeneration` (`o9`, `:262846-262863`) / `mcpClientModule` (`P0y`, `:302428-302442`) - the arm resolver and the forked accessor with the tripwire
- `MCP_TREE_ID` (`xAy` = `"v2"`, `:294477`; `aTy` = `"v1"`, `:300019`) - the brand constants the tripwire checks
- `isFastModeEligibleModel` (`mv`, `:109467-109474`) - capability check plus substring fallback; still matches Opus 4.7
- `getOpus47FastModeSunsetDate` (`LIc`, `:109491-109498`) / `buildOpus47FastModeDeprecationNotice` (`ZFo`, `:499782-499790`) - the 1 h 42 min 15 s notice and its banner
- `supportsMidConversationSystem` (`Ser`, `:150505-150526`) - the exclusion list Sonnet 5 is *not* in
- `isSonnet5` (`mro`, `:150395-150397`) / `isOpus48` (`$Fc`, `:118668-118669`) - the two presentation-level carve-outs
- `shouldExplainMidConvSystem` (`Jep`, `:508117`) / `MID_CONV_SYSTEM_FRAMING` (`lO_`, `:508025-508026`) - consumed at `:507550`
- `buildSystemTurn` (`NN`, `:531420-…`) / `wrapReminder` (`Ww`, `:532376-532380`) - the Sonnet-5 wrapping inversion
- `isOpus5PromptBundleEnabled` (`ZXn`, `:118700-118706`) / `gateOrBundle` (`vQt`, `:118707-118709`) - one token, six gates, two unreachable via the bundle path (`:118714-118719`)
- `applyModelAliasMigration` (`rTm`, `:833732-833744`) / `ALIAS_MIGRATION_MAP` (`qlE`, `:833753`) - shipped disarmed; called at `:834073`
- `replyChannelAdapter` (`cqt`, `:757708`) - the module-level `null` sentinel that darkens the remote reply channel
- `getMaxSubagentSpawnDepth` (`hee`, `:230896-230905`) - the one delegation cap that is gate-backed and validated; `ZDu = 3` `:230906`, `tengu_hazel_trellis` `:230907`
- `getMaxConcurrentSubagents` (`gPu`, `:231399-231401`) / `getMaxSubagentsPerSession` (`Q7r`, `:231402-231404`) / `getMaxWebSearchesPerSession` (`yPu`, `:231405-231407`) - the three ungated caps; `gty = 20`, `yty = 200`, `_ty = 200` at `:231411-231413`
- `READ_ONLY_ANALYSIS_MAX_COMMAND_LENGTH` (`AIe = 1e4`, `:512643`) plus the one new guard at `:392119` - §5.2's single-line delta
- `shouldAllowNetworkConnection` (`:195194-195208`) - `strictAllowlist` enforcement, byte-equivalent to `:211506 (193)`
- `safeLiteral` (`Ee`, `:138`) / `safeEnum` (`fe`, `:141`) - the erased brand constructors that close the `dead_probe` payload alphabet
- `BUILD_CONSTANTS` (`:223-231`) - `VERSION 2.1.220`, `BUILD_TIME 2026-07-24T22:17:45Z`, `GIT_SHA 4073f595…`

---

## See also

- Per-bullet map → [`changelog_to_code_map.md`](changelog_to_code_map.md) (gap register §4). Per-release
  narratives → [`../by_version/`](../by_version/), especially
  [`2.1.197`](../by_version/2.1.197.md) (one-bullet launch), [`2.1.208`](../by_version/2.1.208.md)
  (resource bounds), [`2.1.212`](../by_version/2.1.212.md) (delegation budgets),
  [`2.1.214`](../by_version/2.1.214.md) (security), [`2.1.219`](../by_version/2.1.219.md) (Opus 5),
  [`2.1.220`](../by_version/2.1.220.md) (the contentless endpoint).
- Traps and provenance → [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §4 ·
  [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) ·
  [`_false_delta_ledger.md`](_false_delta_ledger.md) · [`_raw_asset_diff_193_to_220.md`](_raw_asset_diff_193_to_220.md)
- The three unbulleted rewrites → [`../47_models/model_catalogue_rewrite.md`](../47_models/model_catalogue_rewrite.md) ·
  [`../39_mcp/dual_mcp_runtime_trees.md`](../39_mcp/dual_mcp_runtime_trees.md) ·
  [`../49_sandbox/windows_user_sandbox.md`](../49_sandbox/windows_user_sandbox.md)
- Shipped-but-unreachable → [`../46_todo_tasks/dead_probe_gate_family.md`](../46_todo_tasks/dead_probe_gate_family.md) ·
  [`../54_remote_control/client_surfaces.md`](../54_remote_control/client_surfaces.md)
- Prior window's narrative → [`../../../claude_code_v_2.1.193/analyze/00_overview/changelog_analysis.md`](../../../claude_code_v_2.1.193/analyze/00_overview/changelog_analysis.md)
