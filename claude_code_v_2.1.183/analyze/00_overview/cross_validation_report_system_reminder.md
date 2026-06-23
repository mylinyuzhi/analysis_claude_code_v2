# Cross-Validation Report — System-Reminder Mechanism (v2.1.183)

**Module:** System-reminder mechanism (primitives + generator pool + dispatcher + 25-string catalogue)
**Reconstructed files under test:**
- `41_system_reminder/reconstructed_source/utils/messages.ts` (wrap/extract/strip/smoosh primitives + `createUserMessage`)
- `41_system_reminder/reconstructed_source/utils/attachments.ts` (generator pool `ctl`, runner `BA`, queued-cmd `oGt`, dispatcher `PWn`, renderer map `ONl`)
- `41_system_reminder/reconstructed_source/attachmentCatalogue.ts` (25-string catalogue + delta summary)

**Bundle verified against:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
**Delta cross-check bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
**Mode:** Adversarial — every anchor opened at its cited line, decl/obf-id + control-flow + byte-exact string independently confirmed; "new"/"reworded" deltas re-derived from scratch against the 2.1.156 bundle, not trusted from anchors.

---

## PASS / FAIL Table

| # | File : symbol | Bundle anchor | What was checked | Verdict |
|---|---------------|---------------|------------------|---------|
| 1 | messages.ts : `wrapInSystemReminder` (TI) | :589004-589008 | decl + multiline `<system-reminder>\n${e}\n</system-reminder>` | PASS |
| 2 | messages.ts : `extractSystemReminderContent` (q0o) | :589021-589024 | decl + anchored regex + `?t[1]:e` no-match convention | PASS |
| 3 | messages.ts : `stripLeadingReminders` (Rbl) | :587389-587397 | loop + `slice(r+18)` + unterminated `break` | PASS |
| 4 | messages.ts : `stripLeadingRemindersGuarded` (ePo) NEW | :606156-606165 | guard `return e` + empty-string fallback `return e` | PASS |
| 5 | messages.ts : `stripAllReminders` (_Ql) | :661920-661922 | regex `(system-reminder|task-notification)` → `" "` | PASS |
| 6 | messages.ts : `AMBIENT_CONTEXT_TRAILER` (_7n) | :590353-590354 | byte-exact trailer, `—` em-dash | PASS |
| 7 | messages.ts : `NO_CONTENT_MESSAGE` (Dw) | :148106 | `"(no content)"` | PASS |
| 8 | attachments.ts : `normalizeAttachmentForAPI` (PWn) | :589204 | decl `function PWn(e)` | PASS |
| 9 | attachments.ts + catalogue : team_context body | :589213-589241 | branch test @589213 + verbatim multiline body | PASS |
| 10 | attachments.ts : Tier-2 map check | :589246 | `if (e.type in ONl) return ONl[e.type](e)` | PASS |
| 11 | attachments.ts : file truncation note | :589260 | verbatim `Note: The file ... ${OQe} lines ... ${hg.name}` | PASS |
| 12 | attachments.ts : unknown-type fallthrough + `echo_activities` | :589602-589606 | NOOP list incl. NEW `echo_activities` + `H3(...)` no-throw | PASS |
| 13 | catalogue : `renderToolSearchUsageReminder` NEW | :589330 | verbatim string | **FAIL → FIXED** |
| 14 | catalogue : todo_reminder | :589299 | verbatim (incl. quirk "if has become stale") | PASS |
| 15 | catalogue : task_reminder | :589313 | verbatim + `${Vw}`/`${dP}` interpolations | PASS |
| 16 | catalogue : auto_mode body | :589393 | verbatim, `—` em-dashes, `${Ff}` | PASS |
| 17 | attachments.ts : auto_mode case `## ${Jmi}` | :589388-589391 | case label + `## ${Jmi}` heading | PASS |
| 18 | catalogue : mcp_resource "Full contents of resource:" | :589408 | verbatim text block | PASS |
| 19 | catalogue : plan_mode_reentry "## Re-entering Plan Mode" | :589373 | verbatim head | PASS |
| 20 | attachments.ts : `PER_TYPE_RENDERERS` (ONl) | :590431 | `ONl = { ... }` map decl | PASS |
| 21 | catalogue+attachments.ts : workflow_keyword_request (ultracode) REWORDED | :590610 | verbatim "opting this turn into multi-agent..." | PASS |
| 22 | catalogue+attachments.ts : ultra_effort_enter full banner REWORDED | :590619 | verbatim full variant | PASS |
| 23 | catalogue+attachments.ts : ultra_effort_exit REWORDED | :590626 | verbatim "Ultracode is off..." | PASS |
| 24 | attachments.ts : ultra_effort_enter sparse variant | :590620 | verbatim "Ultracode is still on..." | PASS |
| 25 | attachments.ts : edited_text_file budget-exceeded | :590442 | verbatim "...exceeded the snippet budget..." | PASS |
| 26 | attachments.ts : date_change | :590594 | verbatim "The date has changed..." | PASS |
| 27 | attachments.ts : `collectAttachments` (ctl) signature | :464606 | `ctl(e,t,n,r,o,s,i)` positional decl | PASS |
| 28 | attachments.ts : master-gate DELTA (TLe in headless) | :464608-464609 | `[...(await oGt(r,a)), ...TLe(t,o)]` (NEW vs 2.1.156) | PASS |
| 29 | attachments.ts : `queuedModesSet` (J3p) | :466064 | `new Set(["prompt","task-notification"])` | PASS |
| 30 | attachments.ts : 5 cadence configs (rGt/Hho/itl/atl/ltl) | :466059-466063 | all values incl. `MAX_SESSION_BYTES:61440` | PASS |
| 31 | attachments.ts : `runAttachmentGenerator` (BA) | :464693-464715 | 5% sampling + `tengu_attachment_compute_duration` fields + `gB` downgrade + swallow `[]` | PASS |
| 32 | attachments.ts : `getQueuedCommandAttachments` (oGt) DELTA | :464716-464751 | `fileAttachments` + `verifiedSlackHumanTurn` pass-through (NEW) | PASS |
| 33 | attachments.ts : total_tokens_reminder gen NEW | :464660 | `e===null ? P4p(...) : []` gate | PASS |
| 34 | attachments.ts : ONl total_tokens_reminder renderer NEW | :590560 | `(e)=>[Rn({content:TI(e.text),isMeta:!0})]` | PASS |
| 35 | catalogue : peer-session permission guard (R7) NEW | :363300/363303 | verbatim "...permission laundering..." + 2 call sites | PASS |
| 36 | catalogue : external-channel untrusted input (EBe) | :148102 | verbatim string | PASS |
| 37 | catalogue : GitHub rate-limit (xla) | :298898 | verbatim self-tagged `<system-reminder>` | PASS |
| 38 | messages.ts : `memoryAgeReminderText` (YWr) | :220194-220201 | `<=1 return ""` + verbatim staleness text | PASS |
| 39 | messages.ts : `ensureSystemReminderWrap` (bSf) | :588027-588039 | identity-preserving `changed` flag logic | PASS |
| 40 | catalogue : side-question reminder (R14) | :473472 | verbatim head | PASS |
| 41 | catalogue : brief-mode toggle (R17) | :551841 | verbatim both branches + `${KO}` | PASS |
| 42 | catalogue : WebFetch auth reminder (R4) | :211000 | verbatim (full-prompt branch) | PASS |
| 43 | messages.ts : `createUserMessage` (Rn) | :587504 | decl | PASS |
| 44 | messages.ts : Rn empty-content fallback | :587526 | `content: e || Dw` | PASS |
| 45 | messages.ts : `smooshIntoToolResult` (G0o) | :588506-588512 | tool_reference decline `return null` + is_error all-text filter | PASS |
| 46 | messages.ts : `smooshSystemReminderSiblings` (WNl) | :588040-588044 | user-type + array-content + tool_result gate | PASS |
| 47 | catalogue : team_context reworded line | :589219 | "...this session's agent team." (teamName dropped) | PASS |
| 48 | catalogue : container-restart (KPa) | :367816 | verbatim self-tagged body | PASS |
| 49 | catalogue : non-interactive team shutdown (Rlc) | :690484 | verbatim head | PASS |
| 50 | catalogue : diagnostics `<new-diagnostics>` envelope | :285608 (helper) | wrapper delegates to `formatDiagnosticsBlock` | PASS |
| 51 | catalogue : invoked_skills replay head | :589287 | verbatim head | PASS |
| 52 | helper const : `OQe` (truncation line count) | :152225 | `OQe = 2000` | PASS |
| 53 | helper const : `Ws` (Read tool name) | :152217 | `Ws = "Read"` | PASS |
| 54 | helper obj : `hg` = Read tool (`name: Ws`) | :463520 | confirms `${hg.name}` resolves to "Read" | PASS |

### Delta re-derivations (from-scratch against 2.1.156 bundle)

| Claim | 2.1.156 evidence | 2.1.183 evidence | Verdict |
|-------|------------------|------------------|---------|
| R7 permission-laundering guard is NEW | `grep -c "permission laundering"` = **0** | present @363300/363303 | CONFIRMED NEW |
| tool_search_usage_reminder is NEW | `grep -c "Some available tools' schemas are not loaded"` = **0** | present @589330 | CONFIRMED NEW |
| team_context teamName dropped (reworded) | had `"You are a teammate in team"`; `"...this session's agent team"` = **0** | `"...this session's agent team"` @589219 | CONFIRMED REWORDED |
| ultracode "multi-agent orchestration" reworded | `grep -c` = **0** | @590610 | CONFIRMED REWORDED |
| per-Read malware reminder removed | (gone) | `grep -c -i malware` (2.1.183) = **0** | CONFIRMED REMOVED |
| `echo_activities` NOOP is NEW | `grep -c echo_activities` = **0** | in NOOP list @589602 | CONFIRMED NEW |

---

## Counts

- **Sampled:** 54 anchors (+ 6 from-scratch delta re-derivations against 2.1.156)
- **Passed:** 53 (first pass)
- **Fixed:** 1
- **Flagged (unfixable / structural):** 0

### The one defect (fixed in place)

`attachmentCatalogue.ts` line ~207, `renderToolSearchUsageReminder.text` ended:
`"...This is just a gentle reminder - ignore if not applicable."`
The bundle @589330 actually ends:
`"...This is just a gentle reminder - ignore if not applicable to the current work."`
The trailing `" to the current work"` had been dropped. Fixed via `Edit` to restore the byte-exact ending. Swept the two sibling reminders (todo_reminder @589299, task_reminder @589313) — both genuinely end at `"ignore if not applicable."` in the bundle, so no over-correction was applied; only the tool_search case carried the extra clause.

---

## Verdict

The system-reminder reconstruction is **high-fidelity and trustworthy**. Across a fresh 54-anchor adversarial sample spanning all three files — the wrap/extract/strip/smoosh primitives (`TI`/`q0o`/`Rbl`/`ePo`/`_Ql`/`bSf`/`WNl`/`G0o`/`Rn`), the generator pool and its master-gate/abort/two-wave control flow (`ctl`/`BA`/`oGt`), the 3-tier dispatcher (`PWn`) with its Tier-1 team fast-path, Tier-2 `ONl` renderer map, and Tier-3 switch, plus the catalogue's 25 verbatim strings and inline emitters — every cited obf id, control-flow core, gate predicate, and byte-exact string matched the live 2.1.183 bundle, with the single exception of one truncated reminder string that I corrected in place. Every load-bearing "new"/"reworded"/"removed" delta (R7 permission-laundering guard, tool_search_usage_reminder, team_context teamName drop, the three ultracode rewords, the malware/`echo_activities` changes, the headless-mode `TLe` master-gate change, and the `fileAttachments`/`verifiedSlackHumanTurn`/`total_tokens_reminder` additions) was independently re-derived from scratch against the 2.1.156 bundle and confirmed — none were taken on faith from the reconstruction's own anchors. No structural defects remain; the module passes.
