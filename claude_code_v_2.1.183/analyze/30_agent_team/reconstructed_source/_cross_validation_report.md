# Cross-Validation Report — v2.1.183 Agent-Team Reconstruction

**Scope:** Adversarial cross-validation of the reconstructed source under
`30_agent_team/reconstructed_source/`. Six independent validators each re-read the
live `cli_inner_pretty.js` bundle (v2.1.183) at the anchors cited by the
reconstruction, byte-checked symbol bodies, and ran false-delta guards against the
v2.1.156 (and where available v2.1.132/142) bundles.

---

## Overall Verdict: **PASS** (after post-cross-validation fixes)

The initial adversarial pass returned **FAIL** with 4/6 clusters clean and **two
clusters FAILing**, each because the reconstruction reproduced the v2.1.156
*predecessor* shape instead of the actual v2.1.183 bundle shape. **All flagged
defects have since been corrected and re-verified against the live bundle** (see
"Post-cross-validation resolution" below); the tree is now clean.

The two original FAIL causes were:

1. **`sendmessage+coordinator`** — two FALSE-DELTA claims in `prompt.ts` described a
   non-existent v2.1.156 "broadcast row replacement"; the real delta is a pure
   *addition* of the `"main"` row. → **FIXED** (prose only; the prompt body/string
   was always byte-exact). The cluster's third flag (a coordinator header "anchor
   drift") was a **false alarm** — a direct re-read of the 183 bundle confirms
   `oI`@221871-221875, `z9`@221892-221894 and `sG`@221880-221887 are all cited
   correctly in `coordinatorMode.ts`.
2. **`mailbox+control+permission+addendum`** — `teammateControlMessages.ts`
   `isTeamPermissionUpdate` reproduced the OLD 156 object-returning shape, not the
   183 boolean-returning `xso` @366238. → **FIXED** (body + return type now boolean).

Two non-behavioral notes from the `spawn_paths+backends` cluster (history
attribution in `teammateModeSnapshot.ts`; `Aje`/`mDp` naming precision in
`spawnTeammate.ts`) were also corrected. With every defect resolved and re-read in
the bundle, the overall verdict is **PASS**.

---

## Per-Cluster Verdicts

| Cluster | Verdict (initial) | Anchors Re-read | Defects | Status |
|---------|---------|-----------------|---------|--------|
| implicit_team+bootstrap | PASS | 19 | 0 | clean |
| agent_tool_routing | PASS | 38 | 0 | clean |
| spawn_paths+backends | PASS | 38 | 2 (non-behavioral) | **fixed** |
| sendmessage+coordinator | FAIL→**PASS** | 28 | 2 false-delta (+1 false-alarm) | **fixed** |
| mailbox+control+permission+addendum | FAIL→**PASS** | 62 | 1 (return-type divergence) | **fixed** |
| bg_survival+false_delta_guard | PASS | 24 | 0 (2 non-blocking notes) | clean |

**Total anchors re-read across all validators: 209.** All defects resolved
post-pass and re-verified in the live bundle (see resolution section).

---

## Cluster 1: implicit_team+bootstrap — PASS (19 anchors)

Implicit single-team machinery and the startup bootstrap gate. Verified
**char-for-char**:

- `sessionTeamName` (`xic` @682752) = `` `${B3f}-${e.slice(0,8)}` `` with `B3f="session"`
  @682817 — byte-exact.
- `readInheritedTeamName` (`F3f` @682756): reads `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME || null`,
  **`delete`s** the env var (one-shot consume), caches via `e7t`, returns `ZKt() ?? null` —
  byte-exact.
- `_resetInheritedTeamNameForTesting` (`U3f` @682762) = `e7t(void 0)` — exact.
- `initializeSessionTeam` (`j3f` @682765-682815): name resolution, idempotent write
  (`!(t ? await Nhe(n) : null)`), leader-only roster, `Dla(n)`, tasks-dir rename when
  `n !== i`, `NXr(n)+oso(n)`, `iy[0]` leader color, full `teamContext + teammateColors`
  return — char-for-char match.
- `TeamFile` member + top-level literal fields, and `teamContext.teammates[r]` +
  `teammateColors` literal fields — all exact.
- Bootstrap gate @693472 byte-exact: `if (Sl() && !xr() && !a.agentId)` with lazy
  `await Promise.resolve().then(() => (Lic(), kic))` and non-fatal `catch (Jn) { De(Jn) }`.
- `AppState` seed @694463 byte-exact:
  `...(c && { teamContext: c.teamContext, teammateColors: c.teammateColors })`.
- All helper symbols verified at claimed locations/bodies: `bQ`@103172, `np`@362636
  (`"team-lead"`), `xt`@2661, `Ar`@2710, `Nhe`@362824 (async), `Dla`@299006, `oso`@363019,
  `iy`@353809 (`iy[0]="red"`), `Sl`@293831, `xr`@3151, `yqd`@293828, `ZKt`@3558 / `e7t`@3561.
- `Lic` thunk @682818 sets `Iic=require('fs/promises')` — matches `Iic.rename` mapping.

**FALSE-DELTA CHECK PASS:** The 156 bundle has **no** `initializeSessionTeam` /
`inheritedTeamName` / `sessionTeamName` / `SESSION_TEAM_PREFIX` /
`_resetInheritedTeamNameForTesting`. `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` existed
*write-only* @156:525245 with no reader; the 183 consume-on-read reader (`F3f`) plus
the entire implicit-team machinery is a **REAL** 156→183 delta.

---

## Cluster 2: agent_tool_routing — PASS (38 anchors)

The `Agent`/`Task` tool definition and its spawn-vs-subagent routing predicate.
Verified:

- Tool def `f3n` @423505 via `pi` (`buildTool`); name=`vs` (`'Agent'`), aliases=`[c9]`
  (`'Task'`), searchHint `'delegate work to a subagent'`, `maxResultSizeChars` `1e5` — all
  match `AgentTool.tsx`.
- Base schema `CDp` @423431: model enum `['sonnet','opus','haiku','fable']` — **`'fable'`
  confirmed**; model describe verbatim.
- Build schema `IDp` @423446: name regex `pDa` (`/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/`),
  `mode=zts()`, isolation/cwd describes verbatim.
- Served schema `zao` @423478: `IDp().omit({cwd})` then omits `run_in_background` when
  `o3t` (`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`) || `y7()` (isForkSubagentEnabled).
- Output schema `xDp` @423482: union(completed, async_launched, remote_launched);
  `teammate_spawned` **not** in exported union (returned ad hoc) — confirmed.
- **Routing predicate `if (_ && s && !L)` @423573 — exact byte match.**
  Locals: `_ = Sl() ? A.teamContext : void 0`; `b = !!c.teammateContext`;
  `m = z9() ? void 0 : r`; `x = t !== void 0 && Yut(t) === _7` (`_7='fork'`);
  `L = x && I`.
- Spawn call shape @423576 passes name/prompt/description/`use_splitpane:!0`/
  `plan_mode_required:i==='plan'`/model/agent_type/invokingRequestId — **NO `team_name`**
  (confirmed absent); result `{status:'teammate_spawned', prompt:e, ...ye.data}`.
- `'main'` reserved refine verbatim @423454; `team_name` describe **VERBATIM** @423458:
  `'Deprecated; ignored. The session has a single implicit team.'`
- Error classes: `oWe`=`'AgentPreconditionError'` @423424, `r3t`=`'AgentTypeError'`
  @423412 — both confirmed (**recon correctly flags the scaffold's wrong
  `'TeammateSpawnError'` guess**).
- Symbol identities via export maps: `getDynamicTeamContext`=`l1e`,
  `isInProcessTeammate`=`UN` (`GCr.getStore() !== void 0`), `isTeammate`=`em` —
  **recon correctly flags the scaffold's wrong `UN` guess**.
- `prompt.ts` `Aqa` @423136: teammate-suppression hints @423264/@423308 both drop
  `team_name` — verbatim; `z9` body is `() => oI()` so the dual mapping
  isCoordinatorMode→`z9`/`oI` is **accurate, not a defect**.

**FALSE-DELTA checks vs 2.1.156:** `team_name` present in 156 hints
(@240676/@240679) and dropped in 183 — **REAL**; model enum was
`['sonnet','opus','haiku']` in 156 (@398278) and gained `'fable'` in 183 — **REAL**;
`team_name` deprecation describe + `'main'` refine absent in 156 — both **REAL**
additions.

---

## Cluster 3: spawn_paths+backends — PASS (38 anchors, 2 non-behavioral defects)

The dispatch chain, the three spawn paths, backend detection/registry, and the tmux
respawn fix. Verified:

- Dispatch chain `cqa`@423053 → `HDp`@423041 → {`rWe()`→`sqa`@422925, `eLe()` detect,
  `Aje()!=='auto'` guard, `Wdo()` fallback, `use_splitpane!==false ? SDp : EDp`};
  `iF` protocol-frame reject up front — byte-exact.
- The startup guard string `'Internal error: session team not initialized...'` present in
  **exactly 3 places** (`sqa`@422937, `SDp`@422658, `EDp`@422776), one per spawn path
  (`grep -c = 3`) — byte-exact.
- `isInProcessEnabled` `rWe`@422425 decision tree matches `registry.ts` exactly;
  `detectBackend` `eLe`@422314 matches `detection.ts`; `getTeammateMode` `Aje`@293813
  (`Hxe ?? UOt`, `UOt='in-process'`) matches.
- **THE TMUX FIX** `a3n`@421874 (`sendCommandViaRespawn`): `set-option -p -t <pane>
  remain-on-exit` then `respawn-pane -k -t <pane> -- <command>`, throw `sF` on non-zero
  — **NOT `send-keys`** — byte-exact.
- `Gke`@362642 = `'cat'` (TMUX_HOLDING_CMD); every `Ndo` create path ends in
  `-- Gke -d`. Confirmed.
- `EDp`@422813 calls `Slt(k)` then `a3n([], b, k)` **directly** (no socket args, no `rqa`),
  with control-chars + tmux-respawn-failed telemetry; `SDp`@422700 uses `rqa(b,L,!_)`
  delegate — the SDp/EDp split confirmed.
- `Slt`@362755 `assertNoControlChars`, `bDp`@422632 `dedupeTeammateName` (rejects
  `LY='main'` with em-dash message), `Xdo`@422572 `reserveTeammateIdentity` — byte-exact.
- All helper anchors (Vdo, eqa/tqa/nqa/rqa, _Dp, yDp, Wdo, u3n, iBn, oce, Ydo, Jdo, iqa,
  aqa, Qjt, lqa) verified at cited header line numbers.

**FALSE-DELTA CHECK PASS:** 156 `sendCommandToPane` @380567 = `['send-keys','-t',H,$,'Enter']`
with NO sleep. The **send-keys → respawn-pane** change is a **REAL** 156→183 delta.

**INVENTED-SLEEP CHECK PASS:** No `setTimeout`/`sleep`/`200`/`waitForPaneShellReady` in
the 156 TmuxBackend region (380555-380720) nor the 183 `a3n`+`Ndo` region
(421874-422122). The previously-reported 200ms shell-init sleep does **not** reappear.

### Open defects (non-behavioral — do not block this cluster's PASS):

- **`backends/teammateModeSnapshot.ts:18-20,96`** — *documentation-precision (not
  behavioral)*. The header/inline comments attribute the `'auto'` default-mode to
  v2.1.88 and frame the change as 88→183, but the immediate predecessor **v2.1.156
  also defaulted to `'auto'`** (156 @380291 `Q1("teammateMode","auto").value`, @380296
  `return DSH ?? "auto"`). The more relevant delta is 156→183 (auto→in-process), which
  the **code captures correctly** (`UOt='in-process'`, `Ec`, `?? UOt`); only the prose
  mis-scopes the history by omitting that 156 still used `'auto'`. The 183 facts are
  byte-exact — incomplete attribution, not a false delta or invented behavior.
- **`spawnTeammate.ts:157,173`** — *naming-precision (not behavioral)*. The dispatcher
  calls `getTeammateMode()` and the mapping comment says `Aje → getTeammateMode`, but
  the bundle's `HDp`@423046 calls `Aje()` **directly**, whereas `getTeammateMode` in the
  registry is `mDp`@422422 (a wrapper that itself calls `Aje()`). Both resolve to
  identical values, so behavior is faithful; the mapping conflates `Aje` (direct call in
  HDp) with the registry's `mDp` wrapper.

---

## Cluster 4: sendmessage+coordinator — **FAIL** (28 anchors)

`SendMessageTool.ts`, its prompt, and the coordinator-mode machinery. The bulk of this
cluster is byte-exact:

- Tool def `p$p` @434568 (name=`zh`, searchHint='send messages to agent teammates',
  shouldDefer, isEnabled=`Sl`, isReadOnly, backfill/classifier/checkPermissions) —
  byte-match.
- Input schema `o$p` @434558 and message union `r$p` @434541 (**exactly 3 members**:
  shutdown_request | shutdown_response | plan_approval_response via
  `discriminatedUnion('type',...)`; `request_id` regex `lza`=`/^[^\n\r]{1,200}$/`;
  **resolves open-Q#5: NOT-trimmed**) — confirmed.
- `validateInput` @434611 byte-exact (empty-to, `to==='*'` broadcast-removed rejection
  with U+2014 em-dash, `LLa` bridge/uds empty-target, dual `!Lhe` gate, `'@'` rejection,
  summary-required, `iF` structured guard, 5-type lifecycle list, shutdown_response
  constraints).
- `call()` @434694 byte-match (`'main'` leg with self-send guard, `o_`/enqueuePrompt
  `agentId:Ls()` `priority:'next'` `skipSlashCommands:!0` `isMeta:!0`, named-agent
  resolution, running/stopped/evicted branches, in-flight resume Map `d4n`, switch
  dispatch).
- `description()`=`nza` @434314 = `'Send a message to another agent'`; `prompt()`=`rza()`.
- `coordinatorMode.ts`: `oI`@221871 3-clause body byte-match; `z9`@221892 returns `oI()`;
  `hvd`@221895 returns `z9()&&!1`; export object `sG`@221880; `yvd`@221898 rollback guard;
  `_vd`@221916 worker-tool filters; **`getCoordinatorSystemPrompt` `bvd`@221940-222177 full
  prompt body byte-for-byte verbatim**; `COORDINATOR_HIDDEN_TOOLS` `gvd` = `new Set([zh,Em])`
  @222194 (SendMessage, StructuredOutput only) — confirmed.
- Identity predicates (`_S`@353770, `LLa`@359974, `Lhe`@359981, `L3t`@433816, `od`@445761)
  confirmed.
- **TRUE DELTA confirmed:** searchHint 156 `'send messages to agent teammates (swarm
  protocol)'` @407449 → 183 `'send messages to agent teammates'`.

### Open defects (BLOCKING — cause this cluster's FAIL):

- **FALSE DELTA — `tools/SendMessageTool/prompt.ts:9-12` (header comment).** Claims
  *"the v2.1.183 delta is ONE table row: the `\"*\"` broadcast row is REPLACED by a
  `\"main\"` row."* The v2.1.156 SendMessage prompt `iO4` @cli_inner_pretty.js(156):407200-407228
  had **no `\"*\"` broadcast row** — its recipient table was a **single** row
  ``| `"researcher"` | Teammate by name |${""}`` (407212). The real 183 delta is the
  **ADDITION** of a new ``| `"main"` | The main conversation (background subagents only) |``
  row to that same one-row table, **not** a replacement of a broadcast row.
  *Expected:* "156 table had only the researcher row; 183 ADDS the main row."
  *Found in recon:* claims a `\"*\"` broadcast row existed in 156 and was replaced.
- **FALSE DELTA — `tools/SendMessageTool/prompt.ts:69-70` (mapping footnote).** Claims
  *"(v2.1.156 before-picture: prompt `iO4` @407201 had a `\"*\"` broadcast row where
  v2.1.183 now has the `\"main\"` row..."*. Bundle: `iO4` is defined @407200 (not 407201)
  and contains **only** the `'researcher'`/`'Teammate by name'` row (407212) — there is
  no `\"*\"` broadcast row in the 156 prompt body. The broadcast `to:\"*\"` rejection
  existed only in the 156 `validateInput` @407495 (already "no longer supported"), **not**
  in the 156 prompt table.
- **MINOR anchor drift — `coordinator/coordinatorMode.ts:8-9` (header) + task-prompt
  anchors** *(non-load-bearing)*. Header says `oI` `@221871-221875`, but `oI`'s function
  body is 221871-221874 (`}` at 221874; `var h7` follows at 221875); `z9` is @221892 (the
  task-prompt's claimed `@221874` for `z9` is actually `oI`'s `return !0` line). The
  recon's in-body anchors (`oI`@221871, `z9`@221892) are correct; only the inclusive
  end-range and task-prompt anchors are slightly off.

---

## Cluster 5: mailbox+control+permission+addendum — **FAIL** (62 anchors)

The mailbox primitive, teammate mailbox file I/O, control-message builders/parsers, the
leader permission bridge, and the prompt addendum. This is the most heavily-checked
cluster (62 anchors), and almost all of it is byte-exact:

- `Mailbox` class === `kJr` @301895-301937 byte-for-byte (queue/waiters/`changed=ca()`/
  `_revision`, `send`@301906 bumps `_revision` then waiter-splice fast-path, `poll`@301918,
  `receive`@301923, `subscribe`, `notify`@301934).
- `Gbe` @735 = `ker.join(tr(),"teams")` → reconstructed `path.join(getConfigDir(),"teams")`
  faithful; **no literal `".claude/teams"` string**.
- `teammateMailbox.ts` (`v4e`/`Kyp`/`Fhe`/`T4e`/`$A`/`aUt`/`Ilt`/`w4e`/`lUt`/`xlt`/`klt`)
  re-read @365916-366065 and match exactly (incl. `$A` EEXIST pre-create + re-read-under-lock,
  `aUt` splice+prune-read, `w4e` delivered-set keep-logic).
- `iUt` LOCK_OPTIONS @366363 = `{retries:{retries:10,minTimeout:5,maxTimeout:100},
  onCompromised:(e)=>De(e)}` matches.
- **`leaderPermissionBridge` `eDp` @420713-420862 two-path design confirmed; MAILBOX
  `onAllow`@420806 calls `mG(S)` with NO `?? []` (bundle: `(_(),mG(S))`)** — the recon's
  explicit "no-`?? []`" comment is the KEY CLAIM and it **HOLDS**. Interactive path
  @420760 correctly uses `mG(I ?? [])` and recon mirrors with `applyPermissionUpdates(... ?? [])`.
- Denial strings `Wte`@590318 and `Mjt`@590322 (trailing `\n`) byte-exact.
- `teammateControlMessages` builders/parsers @366068-366256 all match; strict parsers use
  plain `.safeParse` (no `.strict()`) **except** `jT`@366231 which uses `.strict()`.
- `iF` master set @366256 = same 10 types, same order; `hUt` planApprovalResumeText @366277
  byte-exact; `kso`@366282 matches; `gUt`@366345 em-dash matches.
- SendMessage union `r$p`@434541 = 3 members, `lza`=`/^[^\n\r]{1,200}$/`, union NOT trimmed
  — correct.
- **`Rdo` addendum @420704-420712 VERBATIM byte-exact** (`cat -A` confirmed blank lines +
  escaped backticks); identical to v2.1.156 `jU6` @379422 → **no false delta**; `sDp`
  composition @421046 faithfully modeled with documented base-as-string simplification.
- `permissionSync` deps (`TUn`@387641/`WBa`@387672/`wUn`@387680) and poller
  (`wBn`@366480/`FDa`@366483/`Nlt`@366492) confirmed; `eDp` call-site @421155 matches.

### Open defect (BLOCKING — causes this cluster's FAIL):

- **`utils/teammateControlMessages.ts:656-665` — `isTeamPermissionUpdate` (`xso` @366238):
  RETURN-TYPE DIVERGENCE + MISSED 156→183 DELTA.** Bundle 183 `xso` body is
  `return !!t && t.type === "team_permission_update"` (returns **BOOLEAN**). The
  reconstructed file returns
  `parsed && parsed.type === 'team_permission_update' ? parsed : null` (returns
  **OBJECT|null**) and declares return type `TeamPermissionUpdateMessage | null`. This
  object-returning form is the **v2.1.156 `tJ8` @338596 behavior**
  (`if ($ && $.type===...) return $; return null`), which the bundle **CHANGED to a
  boolean in 183**. The reconstruction reproduces the OLD 156 shape — both the body and
  the declared return type are wrong vs the 183 boolean-returning `xso`. *Fix:* change the
  body to `return !!parsed && parsed.type === 'team_permission_update'` and the return type
  to `boolean`.

---

## Cluster 6: bg_survival+false_delta_guard — PASS (24 anchors)

Background-subagent task-completion notification, owner-alive routing, and the
keep-alive lifecycle. Verified:

- `buildTaskNotification` `G4e` @445827 — destructure + body match recon exactly.
- Owner-alive gate `g`@445849: `g=(od(m)&&YR(m)&&!xr())||(od(m)&&m.status==="running")`
  byte-exact (recon line 339-341).
- Pin-release `if(!(d&&g)) Fut(f,`agent:${e}`,o)` @445850 (recon line 348-350).
- `<note>` string @445887 byte-exact (recon line 394); **`grep` in 2.1.156 = 0** (genuine
  156→183 delta).
- Routing `agentId: g && f ? If(f) : Ls()` @445889 (recon line 413).
- Lifecycle helpers all match: `Lye`@445750, `YR`@445753 (`status==="completed" &&
  Lye(e).size>0`), `Gmo`@445897 (ownerAgentId predicate), `jmo`@445756 (computeEvictAfter),
  `Fut`@445779 (removeKeepaliveReason, incl. `tC(r.status)` terminal gate), `ect`@445794
  (hasLiveChildAgents), `QBn`@445801 (gcStaleChildKeepalives, `.slice(6)` + pending-queue
  exclusion).
- In-process token-count `_v(I, ww(a.options.mainLoopModel))` @421101 — `ww`@102904 returns
  4/3 via `YPu`; recon maps to `tokenCountUpToAnchor(getCharsPerTokenForModel(...))`.
- Helper anchors (tC@575418, fg@575229, If@2037, xr@3151, Ls@2664, zGe=30000@439188, tag
  consts @45659-45668) and queue helpers (`_f`@234006, `lge`@234000, `dIe`@234010) all match.

**FALSE-DELTA GUARD (key result):** in the 183 bundle —
`grep TeamCreate = 0`, `TeamDelete = 0`, `tengu_team_created = 0`,
`tengu_team_deleted = 0` (**all 0**). The master gate `Sl`@293831 = env
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` OR `--agent-teams` (`yqd`) + `tengu_amber_flint`,
with **NO `USER_TYPE==='ant'` branch** — recon's `agentSwarmsEnabled.ts` reflects 183
exactly. Owner-routing is a genuine 156→183 delta (156 has no `G4e`, no "came to rest",
no `<note>`, no owner-alive gate; `ownerAgentId` appears 2× in 156 in unrelated context
vs 22× in 183).

### Non-blocking notes (not defects):

- `agentNotification.ts:144-152` omits `rEe`="task-type" @45662 from the constants block;
  not consumed by this module and `bM="output-file"`@45663 is cited correctly — no
  functional/byte mismatch.
- The 88-ancestor claim that a `USER_TYPE==='ant'` branch existed and was dropped cannot
  be byte-checked (no 2.1.88 bundle in this environment — only 132/142/156/183). The
  OR-condition is satisfied because the recon correctly reflects what **183** does (`Sl`
  @293832-293834, no ant branch). UNVERIFIABLE, not counted as a defect.

---

## False-Delta Guard — Consolidated Results

All false-delta guards across the six validators **PASS** (i.e., every claimed 156→183
delta is real, and every counter-check returned the expected absence):

| Guard | Result | Verdict |
|-------|--------|---------|
| `TeamCreate` in 183 bundle | grep = 0 | confirmed removed |
| `TeamDelete` in 183 bundle | grep = 0 | confirmed removed |
| `tengu_team_created` | grep = 0 | confirmed removed |
| `tengu_team_deleted` | grep = 0 | confirmed removed |
| Gate `USER_TYPE==='ant'` branch | absent in 183 `Sl` | confirmed dropped (88-existence unverifiable, no bundle) |
| tmux `send-keys` → `respawn-pane` | 156 `send-keys` @380567, 183 `respawn-pane` `a3n`@421874 | **REAL delta** |
| invented 200ms shell-init sleep | absent in both 156 + 183 regions | does NOT reappear |
| implicit-team machinery | absent in 156, present in 183 | **REAL delta** (consume-on-read reader `F3f` new) |
| `team_name` hint suppression | present 156 @240676/240679, dropped 183 | **REAL delta** |
| model enum `'fable'` | absent 156 @398278, present 183 `CDp`@423431 | **REAL delta** |
| owner-routing `<note>` / `G4e` | absent 156, present 183 @445827/445887 | **REAL delta** |
| `Rdo` permission addendum | identical 156 `jU6`@379422 == 183 `Rdo`@420704 | **NO delta** (correctly NOT claimed as one) |
| `searchHint` "(swarm protocol)" suffix | present 156 @407449, dropped 183 @434570 | **REAL delta** |

**FALSE-DELTA defects found:** two — both in `SendMessageTool/prompt.ts`, claiming a
nonexistent "`*` broadcast row → `main` row replacement" when the 156 prompt table had
only a single `researcher` row and 183 merely **adds** a `main` row (see Cluster 4).

---

## Coherence Pass Summary

Run after cross-validation to reconcile imports, duplicate definitions, and aliases
across the reconstructed tree.

- **Imports fixed: 11.**
- **Duplicate definitions resolved (4):**
  - `TEAM_LEAD_NAME` — was defined twice (`utils/agentId.ts` AND `utils/swarm/constants.ts`).
    SSOT = `utils/swarm/constants.ts` (matches 88-ancestor home `np` @362636);
    `agentId.ts` now re-exports via `export { TEAM_LEAD_NAME } from './swarm/constants.js'`;
    the two `agentId.js` importers (teammateInit, spawnTeammate) repointed to
    `constants.js`. Acyclic.
  - `IN_PROCESS_POLL_MS` — was defined twice (`constants.ts:80` AND `inProcessRunner.ts:314`).
    SSOT = `constants.ts`; `inProcessRunner.ts` now imports it; local `export const`
    removed. Sole external importer (leaderPermissionBridge) already used `constants.js`.
  - `MAIN_RESERVED_NAME` — **not** a true definition-duplicate (defined only once,
    `agentId.ts:54`). The apparent duplication was a broken import (`AgentTool.tsx`
    imported it from `swarm/constants.js`, which never exported it); fixed by repointing to
    `agentId.js`. SSOT = `agentId.ts` (bundle `LY`@362512 lives in the agent-message
    XML-tag chunk, not the swarm-constants block).
  - `sanitizeAgentName` — exists as exported fn in `utils/teammate.ts` AND as a private
    (non-exported) local in `spawnTeammate.ts`. Not an export collision (the spawnTeammate
    copy is module-private and behaviorally identical); left as-is, noted.
- **Aliases reconciled (3):**
  - `getAgentName`/`getTeamName`/`getTeammateColor` (bundle `ih`/`zp`/`fT`
    @103455/103460/103514): two importers disagreed on the external home;
    `teammateControlMessages.ts` (correct, `../teammate.js`) vs `SendMessageTool.ts`
    (wrong, `../../utils/agentContext.js`). Reconciled both to `utils/teammate.js`
    (confirmed via bundle export map @103415-103435). These three remain **EXTERNAL**.
  - `generateRequestId` **name collision** (kept distinct, NOT merged): two genuinely
    different bundle symbols share one readable name — `agentId.ts` exports the 3-arg `TYe`
    form (`${type}-${ts}@${agentId}`) while `permissionSync.ts` exports its own 0-arg `HTp`
    form (`perm-${ts}-${rand}`, internal-only). No single importer sees both; both verified
    correct; left distinct (merging would be a logic-doc change the pass forbids).
  - `isTeammateSession` is the recon's readable name for bundle `isTeammate` (`em` @103466);
    consistent across `agentId.ts` (def), `SendMessageTool.ts`, and `prompt.ts` (both import
    from `agentId.js`). No conflicting second readable name.

---

## Residual UNVERIFIED Markers

Carried forward from the coherence pass; each is **deliberately kept** and documented in
the reconstructed source. None is a wiring bug; none is byte-confirmable against the 183
bundle:

- **`utils/teammateControlMessages.ts:475` — `isShutdownRejected`: KEPT.** Grep of the
  2.1.183 bundle = 0 occurrences; no discrete predicate exists (only the schema `SBn`
  @366415, consumed inline via `jT(SBn(),...)`). Reconstructed from the 88 ancestor for
  API symmetry with its sibling parsers. Genuinely unconfirmable as a live bundle symbol.
- **`tools/AgentTool/AgentTool.tsx:63` — error classes `oWe`/`r3t`
  (`AgentPreconditionError`/`AgentTypeError`) + `AGENT_NAME_RE`/`FORK_AGENT_TYPE`/
  `normalizeAgentType` grouped under `./forkSubagent.js`: KEPT.** The 88 `forkSubagent.ts`
  does not export these; the bundle defines the classes inline next to the Agent tool def
  @423412-423429 and the others in separate chunks. The original re-exporting module is
  unrecoverable; the grouping under `forkSubagent.js` is a reconstruction guess.
  **EXTERNAL.**
- **`utils/teammateMailbox.ts:445` — `wrapForLead` (`nUt`, called @366064): KEPT.**
  Out-of-scope lead-relay wrapper defined in another unit; declared locally only so the
  file type-checks. Not a wiring bug.
- **`utils/swarm/leaderPermissionBridge.ts:90` — section-header hedge
  (`// UNVERIFIED where the exact field set is not pinned`): KEPT.** A documentation note
  that inferred TS type shapes may be imprecise; behavior-irrelevant, not a per-symbol
  unresolved reference.

---

## Disposition

**The reconstruction is FAIL pending two fixes.** Recommended actions before re-marking
the tree clean:

1. **`tools/SendMessageTool/prompt.ts`** — rewrite the header comment (lines 9-12) and the
   mapping footnote (lines 69-70) to state the actual delta: *the 156 recipient table had a
   single `researcher` row; 183 **adds** a `main` row.* Remove all references to a
   nonexistent `\"*\"` broadcast row in the 156 prompt body. (The prompt **content** itself
   is byte-verbatim correct — only the delta-attribution prose is wrong.)
2. **`utils/teammateControlMessages.ts:656-665`** — change `isTeamPermissionUpdate` to the
   183 boolean shape: body `return !!parsed && parsed.type === 'team_permission_update'`,
   return type `boolean`. Note the 156→183 change in the header comment (object|null →
   boolean; old `tJ8` @338596 → new `xso` @366238).

Optionally (non-blocking, improves precision):
3. `backends/teammateModeSnapshot.ts` prose — note that v2.1.156 also defaulted to `'auto'`,
   so the salient delta is 156→183 (auto → in-process).
4. `spawnTeammate.ts` mapping comment — distinguish `Aje` (direct call in `HDp`) from the
   registry's `mDp` wrapper.
5. `coordinatorMode.ts` header — correct `oI` end-range to 221874 and the task-prompt `z9`
   anchor to 221892.

Once defects 1 and 2 are corrected, all six clusters would PASS and the overall verdict
would flip to PASS.

---

## Post-cross-validation resolution (all defects fixed + re-verified)

Every defect from the initial pass was corrected in place and re-read against the live
v2.1.183 bundle. Net result: **6/6 clusters PASS**.

1. **`tools/SendMessageTool/prompt.ts` — false-delta prose (BLOCKING).** Header (¶ "2.1.88
   ancestor mirrored") and the trailing `// Mapping` footnote rewritten. The reconstructed
   prompt **body/string was always byte-exact** — only the *before-picture prose* was wrong.
   Evidence re-read: v2.1.156 `iO4` @cli_inner_pretty.js(156):407200 has a one-row recipient
   table (`"researcher"` | Teammate by name @407212) and **no `"*"` row**; the `to:"*"`
   broadcast rejection lived only in 156 `validateInput` @407495. v2.1.183 `rza` @434298 ADDS
   the `"main"` row. The corrected prose states it as an *addition*, not a replacement.

2. **`utils/teammateControlMessages.ts` — `isTeamPermissionUpdate` return shape (BLOCKING).**
   Body + signature changed from `… ? parsed : null : TeamPermissionUpdateMessage | null` to
   `return !!parsed && parsed.type === 'team_permission_update' : boolean`. Evidence re-read:
   183 `xso` @366238 is `function xso(e){ try{ let t=Gt(e); return !!t && t.type==="team_permission_update" } catch{ return !1 } }` — a pure boolean predicate (v2.1.156 `tJ8` @338596 returned the object/null). No caller in the tree consumed the object form, so the change is safe.

3. **`backends/teammateModeSnapshot.ts` — history attribution (non-behavioral).** Header
   cross-val note + the inline "183 DIVERGENCE" comment now record that **both v2.1.88 AND
   v2.1.156 defaulted to `'auto'`** (156 @380291 `Q1("teammateMode","auto")`), so the salient
   delta is 156→183 (`auto` → `in-process`). Code was already byte-exact (`UOt='in-process'`).

4. **`spawnTeammate.ts` — `Aje`/`mDp` naming precision (non-behavioral).** Mapping comment now
   notes `HDp`@423046 calls the snapshot getter `Aje()`@293813 directly (= our
   `getTeammateMode`), distinct from the registry wrapper `mDp`@422422 which itself delegates
   to `Aje()` — same value, two call sites.

5. **`coordinatorMode.ts` header anchors — FALSE ALARM (no change needed).** A direct re-read
   of the 183 bundle confirms the header is already correct: `function oI()` @221871-221875,
   `function z9()` @221892-221894, export object `sG` @221880-221887, `Avd` @221888-221891,
   `hvd` @221895-221897. The initial "anchor drift" flag mis-counted the preceding block's
   closing brace; the reconstruction was accurate. Left unchanged.

**Final state:** all blocking + non-blocking defects resolved; overall verdict **PASS**.

---

# Second independent cross-validation pass (2026-06-24)

A fresh, finer-grained, **default-to-FAIL** pass was run on the reconstruction (independent of the first):
**13 validators** — 10 per-file-group anchor re-reads + a dedicated false-delta hunter + a verbatim-string
auditor + an import/SSOT/coherence re-check — re-reading the **live bundle**, **468 anchors** re-read total.
This pass intentionally went deeper than the first (which used 6 broad clusters) and **caught real defects the
first pass missed or wrongly cleared.** All were fixed against the bundle and re-verified.

## Defects found and fixed

### Structural / correctness (BLOCKING)

1. **Identity-module import-coherence failure (the first pass wrongly claimed this was reconciled).**
   ~16 imports across 7 files pulled identity accessors (`getAgentName`/`getTeamName`/`getTeammateColor`/
   `getAgentId`/`getDynamicTeamContext`/`getParentSessionId`) from `./teammate.js`, but the reconstructed
   `utils/teammate.ts` exported only team-FILE helpers — the accessors were never reconstructed. Bundle truth:
   these live in the agentContext/identity module (export-map `zCr` @103410: `ih`/`zp`/`fT`/`VD`/`l1e`/`a4`/
   `Pk`/`em`…). In the genuine v2.1.88 tree they live in `src/utils/teammate.ts`, while team-file ops live in
   `src/utils/swarm/teamHelpers.ts`. **The reconstruction had inverted the two modules.**
   → **FIX (88-faithful restructure):** created `utils/swarm/teamHelpers.ts` (team-file I/O moved out of
   teammate.ts, internal imports re-based ../, header re-cited to 88 swarm/teamHelpers.ts); **rewrote
   `utils/teammate.ts` as the identity module** (`$q` + `getDynamicTeamContext`/`setDynamicTeamContext`/
   `clearDynamicTeamContext`/`getParentSessionId`/`getAgentId`/`getAgentName`/`getTeamName`/`getTeammateColor`,
   each re-read from the `zCr` region); reverted a wrong first-attempt that had put the accessors in
   `agentContext.ts`. Identity imports (already pointing at `teammate.js`) now resolve unchanged.

2. **Missing team-management functions (`#7`).** `spawnTeammate.ts` and `teammateInit.ts` imported
   `updateTeamFile` / `removeTeamMember` / `registerTeamForSessionCleanup` from a non-existent `./teamHelpers.js`.
   → **FIX:** reconstructed all three in the new `teamHelpers.ts` from their bundle bodies — `updateTeamFile`
   (`ice` @362851, lock→read→mutate→`false`-sentinel-skip→write→release), `removeTeamMember` (`nso` @362874,
   splice-by-agentId via updateTeamFile), `registerTeamForSessionCleanup` (`oso` @363019). Team-file consumers
   repointed: `teammateInit.ts`/`permissionSync.ts` → `./teamHelpers.js`; `SendMessageTool.ts` →
   `../../utils/swarm/teamHelpers.js` (identity imports stay on `teammate.js`).

3. **Invented return in `leaderPermissionBridge.ts` (`#1`).** The interactive-dialog arm appended a
   "Defensive: switch is exhaustive" trailing `return { behavior:'ask', message:PERMISSION_DENIED }` AFTER the
   switch. Bundle truth (`eDp` interactive arm @420782-420789): the switch's `}` falls straight into `} finally`
   — there is **no** trailing return (a non-matching result returns `undefined`). → **FIX:** deleted the invented
   return; widened the return type to `… | undefined` so the genuine fall-through is represented, not masked.

### False deltas (a claimed 156→183 change that isn't real)

4. **`inProcessRunner.ts` (`#2`).** `standalone`, `parentAgentId`, and the standalone mailbox/team-skip gating
   were labeled "NEW in 183" but exist in v2.1.156 (156 @379730 `standalone:X=!1`; @379736
   `parentAgentId:$D()?.agentId`; DT_ @379654/@379658 standalone gating). → **FIX:** relabeled them as
   carryover-from-156; kept only `depth` (`Gz`) + `resumeMessages`/`resumeReplacementState`/`initialFrom` as
   183-new, and noted `parentAgentId` is a value-SOURCE-only change.

5. **`spawnTeammate.ts` `buildInheritedCliFlags` docstring (`#3`).** Claimed 183 adds `--permission-mode auto`
   AND `--plugin-url` AND `--plugin-dir-no-mcp`. Bundle truth: 156 `rA4` @397673 already had `auto` and @397682
   already had `--plugin-url`; only `--plugin-dir-no-mcp` is new (grep 156=0 / 183=10). → **FIX:** docstring now
   lists only `--plugin-dir-no-mcp` as the 183 addition.

6. **`registry.ts` invented rename (`#4`).** Exported `markInProcessFallbackActive`, but the bundle export-map
   @422266 is `markInProcessFallback: () => Wdo`. → **FIX:** renamed the export + its `spawnTeammate.ts` import
   site to `markInProcessFallback` (matches the live bundle).

### Coherence

7. **Value-level import cycle `detection.ts` ↔ `registry.ts` (`#6`).** Real mutual value import. Verified both
   sides use the cross-module values **only inside functions** (never at module top-level), so the cycle is
   runtime-only and safe under ESM live-bindings. → **FIX:** documented the deliberate runtime-only cycle in both
   file headers (no longer presented as cycle-free); no restructuring needed.

## Post-fix verification (re-run after all fixes)

- **Import graph:** an authoritative resolver (comment-stripped) over all 31 files → **0 true internal import
  failures** (90 internal imports resolve to a real exported symbol; 82 specifiers are the documented
  out-of-scope infra imports that mirror the real source tree, e.g. `debug`/`telemetry`/`Tool`/`envUtils`/
  `bootstrap/state`/`permissions/*`). The raw first-pass numbers were inflated by comment lines, `export type
  {…} from` re-exports, and those by-design external imports.
- **Braces/parens:** a stack-based matcher (handling comments, single/double/template strings with `${}`
  nesting, and regex literals) → **all 31 files structurally balanced**.
- **Files:** 31 (`teammate.ts` split into `teammate.ts` [identity] + `utils/swarm/teamHelpers.ts` [team-file]).

## Residual cosmetic items (LEFT, faithful — documented per the reconstruction-residual convention)

These are non-behavioral and each file is internally consistent; the canonical obf→readable mapping lives in
`00_overview/symbol_additions_v2_1_183_agent_team.md` / `symbol_index_core_features.md`:

- **Same readable name for two *different* bundle symbols across non-importing files:**
  `generateRequestId` (`TYe` @103183, 2-arg, in `agentId.ts` — the shared one) vs (`HTp` @387638, 0-arg,
  local-only in `permissionSync.ts`); `isLocalAgent`/`isLocalAgentTask` (`od` @445761);
  `sanitizeName`/`slugifyForTmux` (`uBn`); `formatAsTeammateXml`/`formatAsTeammateMessage` (`xlt`).
- **`SendMessageMessage`** type alias `z.infer<typeof SendMessageMessageUnionSchema>` is declared in both
  `teammateControlMessages.ts` (the union-schema SSOT) and `SendMessageTool.ts` (re-derived from the imported
  schema) — identical type, harmless.
- **Header anchor-citation drift** in a few file headers (line numbers off by 1–4) while the cited
  string/logic content is byte-exact and the in-body anchors are correct.

## Verdict

**PASS** — all structural, correctness, and false-delta defects from the second pass are fixed and re-verified
against the live bundle; only the cosmetic residuals above remain (left deliberately, faithfully documented).
