# Symbol additions — v2.1.220 `46_todo_tasks` (task tracking + the `tengu_dead_probe_*` family)

Staged symbol tables from the [`46_todo_tasks/`](../46_todo_tasks/README.md) pass. Every `File:Line` is a
line **read in the 2.1.220 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`) during that pass; ranges
were computed by matching the closing brace of the cited declaration. Rows tagged `(193)` reference
`/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` explicitly.

Row format per [`../_CONVENTIONS.md`](../_CONVENTIONS.md) §6:
`| Obfuscated | Readable | File:Line | Type |`, sorted alphabetically by obfuscated id inside each module
section.

**Duplicate check performed.** `Qko`, `Bvd`, `TAd`, `oVy`, `iVy`, `AAd`, `wAd` and `CAd` are already staged
by the `04_tools` pass in
[`symbol_additions_v2_1_220_tools.md`](symbol_additions_v2_1_220_tools.md) and are **not repeated here**;
this pass reuses their readable names. See §5 for one correction to that file.

---

## MERGE TARGET: `symbol_index_core_features.md`
*(§6 routing: "todo/tasks" → core features)*

### Module: Todo / Tasks — gate, identity and the V2 file store

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$id` | clearTaskList | cli_inner_pretty.js:324818-324846 | function |
| `M7S` | carryTaskListToFork | cli_inner_pretty.js:808777-808801 | function |
| `Nid` | getHighestTaskFileId | cli_inner_pretty.js:324868-324883 | function |
| `Oid` | writeTaskHighWatermark | cli_inner_pretty.js:324810-324813 | function |
| `QL` | isTodoV2Enabled | cli_inner_pretty.js:324814-324817 | function |
| `XHe` | getTaskSchemaValidated | cli_inner_pretty.js:324902-324915 | function |
| `_te` | isTaskTrackingSuppressedForModel | cli_inner_pretty.js:403922-403931 | function |
| `b6` | getTaskListId | cli_inner_pretty.js:324847-324852 | function |
| `gee` | TASK_OUTPUT_TOOL_NAME | cli_inner_pretty.js:230912 | constant |
| `gpm` | openAgentsViewViaLeftArrow | cli_inner_pretty.js:808802 | function |
| `idr` | getTaskPath | cli_inner_pretty.js:324859-324861 | function |
| `inn` | ensureTaskListDir | cli_inner_pretty.js:324862-324867 | function |
| `nte` | listTasks | cli_inner_pretty.js:324959-324971 | function |
| `odr` | sanitizeTaskListPathComponent | cli_inner_pretty.js:324853-324855 | function |
| `v9` | getTaskListDir | cli_inner_pretty.js:324856-324858 | function |

Notes:
- `_te` is the **only net-new decl in this group**. It reads the gate `tengu_vellum_ash` (`:403924`,
  220=1 / 193=0) with default `[]` and substring-matches the resolved model id from `Oi()` (`:110491`).
  Eight call sites: `:404165`, `:406988`, `:407099`, `:407286`, `:407509`, `:516619`, `:532722`, `:532736`.
- `QL` / `b6` / `v9` / `odr` / `idr` / `inn` / `$id` / `Oid` / `Nid` / `XHe` / `nte` are the re-mangled
  2.1.220 ids for the 2.1.193 store functions `ZH` / `vF` / `Out` / `$ut` / … . They are **carryover
  behaviour with new ids** — the five `[Tasks]` log lines are 220=5 / 193=5 and pairwise identical
  (`:324908`↔`:308402 (193)`, `:324912`↔`:308406`, `:325004`↔`:308501`, `:325027`↔`:308524`,
  `:325038`↔`:308535`). **Do not import a 2.1.193 id for any of them.**
- `M7S` and its wiring inside `gpm` (`:808896`) are net-new: `[tasks] carry to fork` 220=3 / 193=0.

### Module: Todo / Tasks — `TaskCreate` input-shape repair (all carryover)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `_zy` | TASK_CREATE_KNOWN_STRIPPED_KEYS | cli_inner_pretty.js:406876-406889 | constant |
| `gzy` | TASK_CREATE_DESCRIPTION_ALIASES | cli_inner_pretty.js:406874 | constant |
| `hzy` | TASK_CREATE_SUBJECT_ALIASES | cli_inner_pretty.js:406873 | constant |
| `mzy` | TASK_CREATE_ALLOWED_KEYS | cli_inner_pretty.js:406872 | constant |
| `yzy` | TASK_CREATE_ACTIVE_FORM_ALIASES | cli_inner_pretty.js:406875 | constant |

Note: the repair itself (`drop_invalid_activeForm` / `drop_invalid_metadata`, `:406854-406855`) has an exact
193 twin at `:437682-437683 (193)`. Recorded so a future pass does not re-discover it as new.

### Module: Todo / Tasks — reminder attachments (all carryover)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `H8s` | getTodoReminderMode | cli_inner_pretty.js:516577-516581 | function |
| `JN_` | buildTodoReminderAttachments | cli_inner_pretty.js:517773-517785 | function |
| `QN_` | countTurnsSinceTaskManagement | cli_inner_pretty.js:517786-517808 | function |
| `ZN_` | buildTaskReminderAttachments | cli_inner_pretty.js:517809-517821 | function |
| `gfn` | TODO_REMINDER_CONFIG | cli_inner_pretty.js:518133 | constant |

Note: `H8s` reads `CLAUDE_CODE_TODO_REMINDER_MODE` (220=2 / **193=2**) then the gate
`tengu_soft_slate_nudge` (220=1 / **193=1**) — **carryover**, and easy to mistake for a 2.1.220 addition
because it sits beside the genuinely-new `_te`. `gfn = { TURNS_SINCE_WRITE: 10, TURNS_BETWEEN_REMINDERS: 10 }`
is identical to `n6t` `:474653 (193)`.

### Module: Task registry — eviction, keepalive and the agent-name registry

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Bas` | consumeTaskNotifiedOnceFlag | cli_inner_pretty.js:216501-216503 | function |
| `CE` | isTerminalTaskStatus | cli_inner_pretty.js:165103-165105 | function |
| `E$d` | lookupTaskByIdOrResumableId | cli_inner_pretty.js:448598-448601 | function |
| `Fas` | notifiedOnceTaskIds | cli_inner_pretty.js:216506 | variable |
| `Gfe` | isCompletedWithKeepalive | cli_inner_pretty.js:399368-399377 | function |
| `Hpr` | KILLED_TASK_EVICT_GRACE_MS (3000) | cli_inner_pretty.js:341921 | constant |
| `L2e` | IDLE_WINDOW_KEEPALIVE ("flag:idle-window") | cli_inner_pretty.js:399378 | constant |
| `QB` | normalizeAgentRef | cli_inner_pretty.js:399557-399564 | function |
| `QLr` | dismissOrKillTaskFromView | cli_inner_pretty.js:747145-747168 | function |
| `RDo` | pruneAgentNameRegistry | cli_inner_pretty.js:448602-448616 | function |
| `Yse` | IDLE_TASK_EVICT_GRACE_MS (30000) | cli_inner_pretty.js:341922 | constant |
| `oxu` | claimTaskNotifiedOnce | cli_inner_pretty.js:216497-216500 | function |
| `vdr` | suggestClosestNames | cli_inner_pretty.js:326554-326567 | function |

Notes:
- `RDo` + `E$d` are **net-new**: 2.1.193 pruned the registry inside every task-eviction reducer via `dCo`
  (`:446683 (193)`, call sites `:446715`, `:446816`, `:446873`), and **all three call sites are gone** in
  2.1.220 (`:341861`, `:341917` no longer mention `agentNameRegistry`). Reconciliation now happens only at
  `/clear` (`:449503`) and resume/fork (`:821895`).
- `Bas` / `oxu` / `Fas` are a **notified-once dedup Set**, not a registry prune — `Bas(c)` at `:341912` is
  *not* the replacement for `dCo`. Recorded explicitly because the call position invites that reading.
- `Hpr` / `Yse` are **carryover values**: `omt = 3000, Rde = 30000, hfl = 30000` at `:446878-446880 (193)`.
- `vdr` is net-new (Levenshtein ≤ 2 with a ±2 length pre-filter); it backs the "Did you mean" suggestion in
  the `.203` task-resolution fix and two unrelated call sites (`:413514`, `:843112`).

---

## MERGE TARGET: `symbol_index_infra_platform.md`
*(§6 routing: "telemetry" → platform infra)*

### Module: Telemetry — emission pipeline and payload branding

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `D0l` | createTelemetryBuffer | cli_inner_pretty.js:4060-4062 | function |
| `Ee` | safeLiteral | cli_inner_pretty.js:138-140 | function |
| `H5` | safeSortedSet | cli_inner_pretty.js:156-158 | function |
| `Hp` | safeToolName | cli_inner_pretty.js:159-161 | function |
| `L0l` | TELEMETRY_BUFFER_CAP (1000) | cli_inner_pretty.js:4099 | constant |
| `O` | logEvent | cli_inner_pretty.js:4083-4090 | function |
| `P0l` | bufferTelemetryEvent | cli_inner_pretty.js:4063-4066 | function |
| `Tf` | safeNumber | cli_inner_pretty.js:147-149 | function |
| `Xo` | safeOptional | cli_inner_pretty.js:144-146 | function |
| `_vi` | installTelemetrySink | cli_inner_pretty.js:4070-4082 | function |
| `ebi` | safeJoinedList | cli_inner_pretty.js:153-155 | function |
| `fe` | safeEnum | cli_inner_pretty.js:141-143 | function |
| `itt` | safeOptionalNumber | cli_inner_pretty.js:150-152 | function |
| `lb` | logEventAsync | cli_inner_pretty.js:4091-4098 | function |
| `ott` | brandTelemetryValue | cli_inner_pretty.js:135-137 | function |
| `rk` | logEventTo1PAwaitable | cli_inner_pretty.js:153134-153142 | function |
| `ua` | sanitizeToolNameForTelemetry | cli_inner_pretty.js:151979-151984 | function |

Notes:
- `ott` and every wrapper above it are **runtime identity functions**. Their names encode an erased
  compile-time brand; the surviving evidence is *which* wrapper a call site had to use. `Ee` accepts a
  string-literal type only — proved by call sites that re-derive a literal they already hold, e.g.
  `o === "agentId" ? Ee("agentId") : Ee("bash_id")` (`:508461`). `fe` accepts a narrowed union, e.g.
  `fe(t.autoUpdaterStatus)` inside an `.includes()` guard (`:536211`).
- `ua` collapses every `mcp__*` tool name to the literal `"mcp_tool"`, so MCP server names cannot reach
  telemetry.
- There is exactly **one top-level declaration of each of `Ee` and `fe`** in the bundle and no shadowing
  import; multi-argument `Ee(...)` calls elsewhere are vendored-scope bindings, not this function.

### Module: Dead-code probes — `tengu_dead_probe_*` (all net-new, 220=32 sites / 193=0)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `Azs` | migrateAutoUpdaterStatusConfig | cli_inner_pretty.js:536206-536239 | function |
| `Cvs` | reportedSubSecondMcpTimeoutSites (v1 tree) | cli_inner_pretty.js:294627 | variable |
| `Dvs` | reportSubSecondMcpTimeout (v1 tree) | cli_inner_pretty.js:292940-292947 | function |
| `EAy` | resetSubSecondMcpTimeoutProbe (v1 tree) | cli_inner_pretty.js:292948-292950 | function |
| `KSE` | flushPendingDaemonProbes | cli_inner_pretty.js:871384-871387 | function |
| `Pbs` | convertV1InstalledPluginsFile | cli_inner_pretty.js:277542-277564 | function |
| `Vnd` | reportLegacyAttachmentType | cli_inner_pretty.js:320073-320076 | function |
| `Y6u` | reportPluginsV2DualFile | cli_inner_pretty.js:277433-277439 | function |
| `YSE` | resetDaemonProbeStateForTest | cli_inner_pretty.js:871388-871390 | function |
| `_Em` | resolveRemoteSessionFlags | cli_inner_pretty.js:828203-828250 | function |
| `fhp` | reportStrippedRemoteFlag | cli_inner_pretty.js:552411-552414 | function |
| `i_o` | reportLegacyTopLevelPluginField | cli_inner_pretty.js:280062-280066 | function |
| `k_i` | pendingDaemonProbeEmissions | cli_inner_pretty.js:872115 | variable |
| `mJo` | reportDaemonShortCompat | cli_inner_pretty.js:681618-681623 | function |
| `nAl` | reportDaemonOriginAutoDefault | cli_inner_pretty.js:871374-871383 | function |
| `nAs` | reportedSubSecondMcpTimeoutSites (v2 tree) | cli_inner_pretty.js:300169 | variable |
| `nWu` | reportLegacyGlobalConfigEnv | cli_inner_pretty.js:267784-267787 | function |
| `rAl` | reportedDaemonOriginSites | cli_inner_pretty.js:872115 | variable |
| `tTy` | resetSubSecondMcpTimeoutProbe (v2 tree) | cli_inner_pretty.js:298490-298492 | function |
| `uAs` | reportSubSecondMcpTimeout (v2 tree) | cli_inner_pretty.js:298482-298489 | function |
| `vqu` | reportedTopLevelPluginFields | cli_inner_pretty.js:281402 | variable |
| `xEp` | migrateCachedChangelogToDisk | cli_inner_pretty.js:566028-566037 | function |
| `zBo` | reportedTaskOutputLegacyParams | cli_inner_pretty.js:508586 | variable |
| `zmy` | probeLegacyChromeSocket | cli_inner_pretty.js:267278-267292 | function |

Probe latch booleans (all `variable`, cited at their set-site; each is `= !1` at a nearby `var` block):

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `B5u` | chromeLegacySocketProbeLatch | cli_inner_pretty.js:267285 | variable |
| `BRd` | toolAliasExecProbeLatch | cli_inner_pretty.js:425387 | variable |
| `K5u` | globalConfigEnvProbeLatch | cli_inner_pretty.js:267786 | variable |
| `K6u` | pluginsV2DualFileProbeLatch | cli_inner_pretty.js:277435 | variable |
| `QLp` | disableBugCommandFeedbackModeProbeLatch | cli_inner_pretty.js:592810 | variable |
| `Qef` | speculationOverlayProbeLatch | cli_inner_pretty.js:665445 | variable |
| `TEp` | changelogConfigProbeLatch | cli_inner_pretty.js:566031 | variable |
| `UCm` | preservedSegmentTailPickProbeLatch | cli_inner_pretty.js:841938 | variable |
| `Ufp` | preservedSegmentChainRelinkProbeLatch | cli_inner_pretty.js:549105 | variable |
| `Vcf` | reportedDaemonShortCompatKinds | cli_inner_pretty.js:681622 | variable |
| `azf` | envLogFlatMessageProbeLatch | cli_inner_pretty.js:756601 | variable |
| `dhm` | disableBugCommandSurveyProbeLatch | cli_inner_pretty.js:814212 | variable |
| `gcf` | bgAttachNoAuthProbeLatch | cli_inner_pretty.js:679402 | variable |
| `nsp` | preservedSegmentWalkResolveProbeLatch | cli_inner_pretty.js:524945 | variable |
| `oDp` | preservedSegmentSdkIngestProbeLatch | cli_inner_pretty.js:593385 | variable |
| `ocp` | autoUpdaterStatusProbeLatch | cli_inner_pretty.js:536210 | variable |
| `php` | reportedStrippedRemoteFlags | cli_inner_pretty.js:552413 | variable |
| `qnd` | attachmentRenameProbeLatch | cli_inner_pretty.js:320075 | variable |
| `rRp` | installCountsCleanupProbeLatch | cli_inner_pretty.js:587170 | variable |
| `vjf` | voiceEnabledFlatProbeLatch | cli_inner_pretty.js:741126 | variable |
| `wad` | pinnedSidecarProbeLatch | cli_inner_pretty.js:330622 | variable |
| `yEm` | remoteFlagAliasProbeLatch | cli_inner_pretty.js:828205 | variable |
| `z6u` | pluginsV1FileProbeLatch | cli_inner_pretty.js:277544 | variable |

Notes:
- `CAd` (`taskStopShellIdProbeLatch`, `:400000`) is the 24th latch and is **already staged** by the
  `04_tools` pass — not repeated.
- `Dvs`/`Cvs`/`EAy` and `uAs`/`nAs`/`tTy` are the **same logical probe emitted twice**, once in each of the
  two MCP runtime trees documented in
  [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) §6.7. Count them as one
  probe with two emission sites.
- `feature_gates.json` lists only **23** of the **25** `tengu_dead_probe_*` names — it is missing
  `tengu_dead_probe_plugins_v1_file` (`:277546`) and `tengu_dead_probe_plugins_v2_dualfile` (`:277437`).

---

## MERGE TARGET: `symbol_index_core_execution.md`
*(§6 routing: tool dispatch → core execution)*

### Module: Tools — input normalisation

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `atp` | normalizeToolInput | cli_inner_pretty.js:508391-508471 | function |
| `utp` | postNormalizeToolInput | cli_inner_pretty.js:508507-508531 | function |

---

## 5. Correction to `symbol_additions_v2_1_220_tools.md`

That file's row

```
| `atp` | postNormalizeToolInput | cli_inner_pretty.js:508507-508531 | function |
```

pairs the id `atp` with the line range of a **different function**. Re-read in 2.1.220:

- `atp` is declared at `:508391` and runs to `:508471`. It is the *pre*-dispatch normaliser (a `switch`
  over `zi`/`UP`/`bu.name`/`XL.name`/`NH.name`/`gee`), and its `gee` case is where the
  `tengu_dead_probe_taskoutput_legacy_params` probe lives (`:508461`, `:508463`). Its only call site is
  `:531890`.
- `utp` is declared at `:508507` and runs to `:508531`. It is the *post*-dispatch stripper (a `switch` over
  `UP`/`XL.name`/`mf` that removes fields before persisting), which is what the readable name
  `postNormalizeToolInput` describes.

So the readable name and the line range in that row belong to `utp`; the obfuscated id belongs to `atp`.
Both rows are given above with the correct pairing. Flagged rather than silently overwritten, per
`_CONVENTIONS.md` §2.
