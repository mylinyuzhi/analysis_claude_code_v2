# Symbol Additions — System-Reminder Mechanism (v2.1.183)

> Consolidated obfuscated→readable symbol table for the **`<system-reminder>` mechanism**
> **as it exists in v2.1.183** — the wrap / extract / strip / smoosh primitives
> (`utils/messages.ts`), the attachment **generator pool** + the 3-tier **API-normalize
> dispatcher** + the flat **per-type renderer map** (`utils/attachments.ts`), the per-feature
> **cadence configs**, and the catalogue of every per-turn reminder renderer case plus the
> reminder-shaped NON-reminder strings (tool descriptions / base-prompt / debug logs) harvested
> into `05_reminders.json` (`attachmentCatalogue.ts`).
>
> Every row was harvested from the inline `// 2.1.183: <readable> = <obf> @cli_inner_pretty.js:NNN`
> anchors (and the file-header obf lists) of the reconstructed `.ts` files under
> `41_system_reminder/reconstructed_source/` and re-derived by reading the declaration in the live
> v2.1.183 bundle. **The bundler re-mangles every build** — these v2.1.183 names DO NOT apply to
> other versions (e.g. the 2.1.156 dispatcher `kc6` re-mangled to `PWn`; the 2.1.156 ambient
> trailer `yT8` is now the hoisted const `_7n` / `uWn`).
>
> **Unique symbols indexed: 164** (no duplicate obf rows). Where a single obf id already lives in a
> sibling per-module table, the row carries a `↔` cross-reference note instead of being silently
> duplicated: the workflow-owned generators `Jyn`/`o4p`/`s4p`/`Pw`/`itl`, the shared resilience
> wrapper `BA`, the message factory `Rn`, and the shared `_7n` trailer all overlap and are noted.
> Two obf ids carry **two distinct readable roles** and so appear as two rows each with a note:
> `q0o`/`oKr` are NOT the same id (returns-original vs returns-null variants), and the `Rbl`/`ePo`
> strip pair are distinct ids — listed separately, not collapsed.
>
> **Cross-validated against:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines). File:Line column uses the v2.1.183 bundle line (`cli_inner_pretty.js:NNN`); the
> reconstructed source file is noted parenthetically in the Readable column where helpful.
>
> **Home index.** These rows fold into **`00_overview/symbol_index_core_features.md`** (the
> system-reminder / attachment mechanism is a core feature). The workflow-overlapping generator rows
> (`Jyn`/`o4p`/`s4p`) already live in that file's **Workflow** area under different readable names —
> see the `↔` notes; do NOT re-add them as new rows there.

---

## Module: System-Reminder Primitives — Wrap

The envelope builders. `TI` (multiline) is the canonical form every renderer emits; `Jp` is the
list helper called as `Jp([Rn({content, isMeta:true})])`; `bSf` is the idempotent identity-preserving
final-pass re-wrap; the `xOi`/`YWr`/`EHd` trio is the single-line memory-age staleness variant.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| bSf | ensureSystemReminderWrap (idempotent identity-preserving re-wrap; returns same ref when unchanged) (utils/messages.ts) | cli_inner_pretty.js:588027-588039 | function |
| EHd | memoryAgeInDays (whole days since ts, clamped ≥0; 86400000 = 24h ms) (utils/messages.ts) | cli_inner_pretty.js:220191-220193 | function |
| Jp | wrapMessagesInSystemReminder (list helper: wraps each string/text block via TI) (utils/messages.ts) | cli_inner_pretty.js:589078-589091 | function |
| TI | wrapInSystemReminder (canonical MULTILINE `\n…\n` envelope) (utils/messages.ts) | cli_inner_pretty.js:589004-589008 | function |
| xOi | wrapMemoryAgeReminder (single-line `<system-reminder>${text}</system-reminder>\n`; "" when ≤1 day) (utils/messages.ts) | cli_inner_pretty.js:220203-220208 | function |
| YWr | memoryAgeReminderText (staleness text, fires only when >1 day old) (utils/messages.ts) | cli_inner_pretty.js:220194-220201 | function |

---

## Module: System-Reminder Primitives — Extract / Strip

The whole-string extract regex (shared by both extract variants) and the four strip forms. NOTE:
`q0o` and `oKr` are **distinct ids** (returns-original vs trims-and-returns-null); `Rbl` and `ePo`
are **distinct ids** (`ePo` is the NEW-in-2.1.183 guarded leading-strip). `_Ql` (replace-with-space)
and the in-`Aef` index-loop (splice-out, no space) differ precisely in their replacement.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _Ql | stripAllReminders (regex strip of system-reminder OR task-notification ANYWHERE → single space) (utils/messages.ts) | cli_inner_pretty.js:661920-661922 | function |
| Aef | stripRemindersInPlace (index-loop strip-ANYWHERE, splices slice OUT with NO replacement; enclosing per-msg search/digest builder) (utils/messages.ts) | cli_inner_pretty.js:518094-518101 | function |
| ePo | stripLeadingRemindersGuarded (NEW in 2.1.183: returns ORIGINAL text if no leading reminder OR if stripping empties the string) (utils/messages.ts) | cli_inner_pretty.js:606156-606165 | function |
| fyl | SYSTEM_REMINDER_CLOSE (`"</system-reminder>"`, length 18; used by the Aef index-loop strip) (utils/messages.ts) | cli_inner_pretty.js:518148 | const |
| oKr | extractSystemReminderContentOrNull (telemetry/history copy: trims in+out, returns `null` on no-match) (utils/messages.ts) | cli_inner_pretty.js:277246-277248 | function |
| q0o | extractSystemReminderContent (returns inner content, or the ORIGINAL string on no-match) (utils/messages.ts) | cli_inner_pretty.js:589021-589024 | function |
| Rbl | stripLeadingReminders (peels leading reminder blocks; ALWAYS returns stripped result, may be "") (utils/messages.ts) | cli_inner_pretty.js:587389-587397 | function |

---

## Module: System-Reminder Primitives — Smoosh / Merge / Factory / Trailer

The final-pass smoosh chain that folds `<system-reminder>`-prefixed text siblings into the last
tool_result (gated by `tengu_chair_sermon`), plus the user-message factory and the shared
no-content / ambient-trailer consts. `_7n` is also referenced by the renderer map — single
definition lives here.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _7n | AMBIENT_CONTEXT_TRAILER / sharedAmbientDriftTrailer ("This is ambient context — do not narrate…"; hoisted 2.1.156 `yT8`; reused by 4 delta renderers) (utils/messages.ts) | cli_inner_pretty.js:590353-590354 | const |
| b7n | mergeUserMessages (mergeUserContentBlocks; concats two adjacent user msgs, smooshing post-tool_result siblings) (utils/messages.ts) | cli_inner_pretty.js:588434+ | function |
| Cx | mergeUserMessagesAndToolResults (the API-bound merge DRIVER; `tengu_chair_sermon` gate @588352/588370) (utils/messages.ts) | cli_inner_pretty.js:588170-588373 | function |
| Dw | NO_CONTENT_MESSAGE (`"(no content)"` placeholder for empty user-message content) (utils/messages.ts) | cli_inner_pretty.js:148106 | const |
| G0o | smooshIntoToolResult (folds blocks into a tool_result; DECLINES → null on tool_reference; joins text with "\n\n") (utils/messages.ts) | cli_inner_pretty.js:588506-588536 | function |
| KNl | mergeAdjacentUserMessages (folds back-to-back user msgs via b7n; early-outs when none adjacent) (utils/messages.ts) | cli_inner_pretty.js:588434-588449 | function |
| rne | isToolReferenceBlock (type guard: object block with `type==="tool_reference"`; canonical decl in toolSearch.ts) (utils/messages.ts) | cli_inner_pretty.js:462304-462306 | function |
| Rn | createUserMessage (user-message factory; `isMeta:true` for every reminder; empty→NO_CONTENT_MESSAGE) (utils/messages.ts) ↔ also in symbol_additions_v2_1_183_workflow.md | cli_inner_pretty.js:587504-587543 | function |
| SSf | sanitizeErrorToolResultContent (strips non-text blocks from is_error tool_results; final merge pass) (utils/messages.ts) | cli_inner_pretty.js:588060-588093 | function |
| WNl | smooshSystemReminderSiblings (per-user-msg: partition SR-prefixed text, fold into LAST tool_result via G0o) (utils/messages.ts) | cli_inner_pretty.js:588040-588059 | function |

---

## Module: Attachment Generator Pool & Dispatcher

The per-turn pool driver (`ctl`), the per-generator resilience boundary (`BA`), the master-gate
survivor (`oGt`), the 3-tier API-normalize dispatcher (`PWn`), and the flat per-type renderer map
(`ONl`). `PWn` was 2.1.156 `kc6`; `ONl` is declared at `var ONl @590351`, assigned @590431.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| BA | runAttachmentGenerator (per-gen try/catch boundary; 5% `tengu_attachment_compute_duration` sampling) (utils/attachments.ts) ↔ also in symbol_additions_v2_1_183_workflow.md | cli_inner_pretty.js:464693-464715 | function |
| ctl | collectAttachments (generator pool: master gate + 1s abort budget + mention wave + waves A/G) (utils/attachments.ts) | cli_inner_pretty.js:464606-464692 | function |
| dSf | getTeammateMailbox (returns the mailbox formatter with formatTeammateMessages; team Tier-1 exit) (utils/attachments.ts) | cli_inner_pretty.js:589209 | function |
| oGt | getQueuedCommandAttachments (the ONE gen surviving the master gate; filters to J3p modes, resolves pasted images) (utils/attachments.ts) | cli_inner_pretty.js:464716-464751 | function |
| ONl | PER_TYPE_RENDERERS (flat per-type renderer map; Tier-2 of the dispatcher) (utils/attachments.ts) | cli_inner_pretty.js:590431-590642 | object |
| PWn | normalizeAttachmentForAPI (3-tier dispatcher: team-exit / map / switch; was 2.1.156 `kc6`) (utils/attachments.ts) | cli_inner_pretty.js:589204-589607 | function |

---

## Module: Attachment Pool — Cadence Configs, Allow-list & Imported Generators

The five per-feature throttle configs (one module-init block @466059-466063, export aliases
@464595-464599), the queued-mode allow-list, and the pool member generators imported into
`ctl`. The team-gate `Sl` and feature-gates `_H`/`B1r` decide which generators run.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| _H | isTodoV2Enabled (chooses task-reminder vs todo-reminder generator) (utils/attachments.ts) | cli_inner_pretty.js:464625 | function |
| a4p | getOutputStyleAttachment (output_style generator) (utils/attachments.ts) | cli_inner_pretty.js:464680 | function |
| A4p | getNestedMemoryAttachments (nested_memory generator) (utils/attachments.ts) | cli_inner_pretty.js:464639 | function |
| atl | RELEVANT_MEMORIES_CONFIG (`MAX_SESSION_BYTES: 61440` = 60*1024; read @465370) (utils/attachments.ts) | cli_inner_pretty.js:466062 | const |
| aye | getDeferredToolsDeltaAttachment (deferred_tools_delta generator) (utils/attachments.ts) | cli_inner_pretty.js:464633 | function |
| b4p | getDynamicSkillAttachments (dynamic_skill generator) (utils/attachments.ts) | cli_inner_pretty.js:464640 | function |
| B1r | toolSearchToolName (non-null ⇒ enable tool_search_usage_reminder gen) (utils/attachments.ts) | cli_inner_pretty.js:464655 | function |
| Bel | getImagePasteIds (queued-command image paste id extractor) (utils/attachments.ts) | cli_inner_pretty.js:464742 | function |
| Ctl | getMemoryUpdateAttachment (memory_update generator) (utils/attachments.ts) | cli_inner_pretty.js:464688 | function |
| D4p | getTokenUsageAttachment (token_usage generator) (utils/attachments.ts) | cli_inner_pretty.js:464685 | function |
| d4p | processAtMentionedFiles (at_mentioned_files mention-wave gen) (utils/attachments.ts) | cli_inner_pretty.js:464614 | function |
| dtl | getPlanModeExitAttachment (plan_mode_exit generator) (utils/attachments.ts) | cli_inner_pretty.js:464649 | function |
| E4p | getLSPDiagnosticAttachments (lsp_diagnostics generator) (utils/attachments.ts) | cli_inner_pretty.js:464677 | function |
| e4p | getPlanModeAttachments (plan_mode generator) (utils/attachments.ts) | cli_inner_pretty.js:464647 | function |
| EUn | getSkillListingAttachments (skill_listing generator) (utils/attachments.ts) | cli_inner_pretty.js:464641 | function |
| f4p | processMcpResourceAttachments (mcp_resources mention-wave gen) (utils/attachments.ts) | cli_inner_pretty.js:464614 | function |
| ftl | getDateChangeAttachments (date_change generator) (utils/attachments.ts) | cli_inner_pretty.js:464631 | function |
| gtl | getChangedFiles (changed_files / edited_text_file generator) (utils/attachments.ts) | cli_inner_pretty.js:464638 | function |
| Hho | PLAN_MODE_ATTACHMENT_CONFIG (`TURNS_BETWEEN_ATTACHMENTS:5`, `FULL_REMINDER_EVERY_N_ATTACHMENTS:5`) (utils/attachments.ts) | cli_inner_pretty.js:466060 | const |
| i4p | getCriticalSystemReminderAttachment (critical_system_reminder generator) (utils/attachments.ts) | cli_inner_pretty.js:464659 | function |
| I4p | getUnifiedTaskAttachments (unified_tasks generator) (utils/attachments.ts) | cli_inner_pretty.js:464681 | function |
| itl | ULTRA_EFFORT_CONFIG (`TURNS_BETWEEN_MAINTENANCE:10`; read @464898) (utils/attachments.ts) ↔ also in symbol_additions_v2_1_183_workflow.md | cli_inner_pretty.js:466061 | const |
| J3p | INLINE_NOTIFICATION_MODES / queuedModesSet (`Set(['prompt','task-notification'])`) (utils/attachments.ts) | cli_inner_pretty.js:466064 | const |
| Jyn | hasUltracodeKeyword (ultracode-keyword detector; gates workflow_keyword_request) (utils/attachments.ts) ↔ canonical in symbol_index_core_features.md (Workflow) as isUltracodeKeywordTriggerEnabled | cli_inner_pretty.js:148797 | function |
| k4p | getTeammateMailboxAttachments (teammate_mailbox generator; Sl-gated) (utils/attachments.ts) | cli_inner_pretty.js:464658 | function |
| l4p | getSelectedLinesFromIDE (ide_selection generator) (utils/attachments.ts) | cli_inner_pretty.js:464675 | function |
| L4p | getTeamContextAttachment (team_context generator; Sl-gated) (utils/attachments.ts) | cli_inner_pretty.js:464658 | function |
| ltl | VERIFY_PLAN_REMINDER_CONFIG (`TURNS_BETWEEN_REMINDERS:10`) (utils/attachments.ts) | cli_inner_pretty.js:466063 | const |
| M4p | getOutputTokenUsageAttachment (output_token_usage generator) (utils/attachments.ts) | cli_inner_pretty.js:464687 | function |
| n4p | getAutoModeExitAttachment (auto_mode_exit generator) (utils/attachments.ts) | cli_inner_pretty.js:464651 | function |
| o4p | getWorkflowKeywordRequestAttachment (workflow_keyword_request generator) (utils/attachments.ts) ↔ canonical in symbol_index_core_features.md (Workflow) as makeWorkflowKeywordReminder | cli_inner_pretty.js:464869 | function |
| OWe | getMcpInstructionsDeltaAttachment (mcp_instructions_delta generator) (utils/attachments.ts) | cli_inner_pretty.js:464637 | function |
| p4p | processAgentMentions (agent_mentions mention-wave gen) (utils/attachments.ts) | cli_inner_pretty.js:464614 | function |
| P4p | getTotalTokensReminderAttachment (total_tokens_reminder gen; NEW in 2.1.183, fires on input===null) (utils/attachments.ts) | cli_inner_pretty.js:464661 | function |
| Pw | isWorkflowEnabled (gates workflow_keyword_request / ultra_effort pair) (utils/attachments.ts) ↔ also in symbol_additions_v2_1_183_workflow.md | cli_inner_pretty.js:464663 | function |
| Q3p | buildImageContentBlocks (resolves pasted images into content blocks for queued commands) (utils/attachments.ts) | cli_inner_pretty.js:464721 | function |
| r4p | getUltrathinkEffortAttachment (ultrathink_effort generator) (utils/attachments.ts) | cli_inner_pretty.js:464632 | function |
| R4p | getMaxBudgetUsdAttachment (budget_usd generator) (utils/attachments.ts) | cli_inner_pretty.js:464686 | function |
| rGt | TODO_REMINDER_CONFIG (`TURNS_SINCE_WRITE:10`, `TURNS_BETWEEN_REMINDERS:10`; dual-`&&` cadence gate) (utils/attachments.ts) | cli_inner_pretty.js:466059 | const |
| S4p | getDiagnosticAttachments (diagnostics generator) (utils/attachments.ts) | cli_inner_pretty.js:464676 | function |
| s4p | getUltraEffortEnterAttachment (ultra_effort_enter generator) (utils/attachments.ts) ↔ canonical in symbol_index_core_features.md (Workflow) as makeStandingUltracodeReminder | cli_inner_pretty.js:464873 | function |
| Sl | isAgentTeamEnabled (R7 analog; gates dispatcher Tier-1 + the team gen pair) (utils/attachments.ts) | cli_inner_pretty.js:293831 | function |
| t4p | getAutoModeAttachments (auto_mode generator) (utils/attachments.ts) | cli_inner_pretty.js:464650 | function |
| TLe | getAgentListingDeltaAttachment (agent_listing_delta gen; ALSO survives the master gate in 2.1.183) (utils/attachments.ts) | cli_inner_pretty.js:464916 | function |
| u4p | getOpenedFileFromIDE (ide_opened_file generator) (utils/attachments.ts) | cli_inner_pretty.js:464676 | function |
| utl | getAgentPendingMessageAttachments (agent_pending_messages generator) (utils/attachments.ts) | cli_inner_pretty.js:464660 | function |
| v4p | getTodoReminderAttachments (todo_reminder generator; chosen when !_H()) (utils/attachments.ts) | cli_inner_pretty.js:464653 | function |
| w4p | getTaskReminderAttachments (task_reminder generator; chosen when _H()) (utils/attachments.ts) | cli_inner_pretty.js:464653 | function |
| wc | extractTextContent (flatten structured prompt to a single joined string) (utils/attachments.ts) | cli_inner_pretty.js:464730 | function |
| wtl | getToolSearchUsageReminderAttachment (tool_search_usage_reminder gen; B1r-gated) (utils/attachments.ts) | cli_inner_pretty.js:464655 | function |
| x4p | getAsyncHookResponseAttachments (async_hook_responses generator) (utils/attachments.ts) | cli_inner_pretty.js:464683 | function |
| $4p | getVerifyPlanReminderAttachment (verify_plan_reminder generator) (utils/attachments.ts) | cli_inner_pretty.js:464689 | function |

---

## Module: Reminder Helper-Symbol Name Resolvers

Tool-name / heading consts interpolated into reminder text (resolved by the catalogue header).
These are referenced by the rendered reminder strings, not reminder machinery themselves.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DA | TOOL_SEARCH_NAME (`"ToolSearch"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221267 | const |
| dP | TASK_UPDATE_NAME (`"TaskUpdate"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221453 | const |
| Ff | ASK_USER_QUESTION_TOOL (`"AskUserQuestion"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221xxx | const |
| hg | READ_TOOL (object; `hg.name` = `"Read"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:463520 | object |
| Jmi | AUTO_MODE_HEADING (`"Auto Mode Active"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:148109 | const |
| KO | SEND_USER_MESSAGE_NAME (`"SendUserMessage"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221278 | const |
| OQe | FILE_TRUNCATION_LINE_LIMIT (`2000`; truncation note line cap) (attachmentCatalogue.ts) | cli_inner_pretty.js:152225 | const |
| Vw | TASK_CREATE_NAME (`"TaskCreate"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221451 | const |
| vs | AGENT_TOOL_NAME (`"Agent"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:149939 | const |
| W9 | TASK_OUTPUT_NAME (`"TaskOutput"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221313 | const |
| Ws | READ_TOOL_NAME (`"Read"` tool-name const used by pdf_reference) (attachmentCatalogue.ts) | cli_inner_pretty.js:152217 | const |
| zh | SEND_MESSAGE_NAME (`"SendMessage"`) (attachmentCatalogue.ts) | cli_inner_pretty.js:221450 | const |

---

## Module: Dispatcher-Switch Reminder Cases (PWn Tier-3 switch)

Per-turn reminders emitted by the `PWn` inline switch (and the two pre-switch team fast-path
branches). The `decl`/case label gives the bundle case; `emit` is the rendered-text line.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| GSf | renderPlanMode (plan_mode body selector: zSf subagent / VSf sparse / qSf full 5-phase) (attachmentCatalogue.ts) | cli_inner_pretty.js:589092 | function |
| PWn case "agent_listing_delta" | renderAgentListingDelta (available Agent-tool types changed; isInitial header; _7n trailer on removals) (attachmentCatalogue.ts) | cli_inner_pretty.js:589515 | function |
| PWn case "async_hook_response" | renderAsyncHookResponse (asyncRewake hook payload → systemMessage + additionalContext) (attachmentCatalogue.ts) | cli_inner_pretty.js:589455 | function |
| PWn case "auto_mode" | renderAutoMode (Auto Mode Active prose; ${Jmi} heading, ${Ff} AskUserQuestion) (attachmentCatalogue.ts) | cli_inner_pretty.js:589391 | function |
| PWn case "context_efficiency" | renderContextEfficiency (no-op in shipped builds; returns []) (attachmentCatalogue.ts) | cli_inner_pretty.js:589468 | function |
| PWn case "deferred_tools_delta" | renderDeferredToolsDelta (MCP deferred tools added/readded/removed/pending; up to 4 sections; _7n on removals) (attachmentCatalogue.ts) | cli_inner_pretty.js:589473 | function |
| PWn case "diagnostics" | renderDiagnostics (LSP/IDE diagnostics → `<new-diagnostics>` envelope via OG.formatDiagnosticsBlock) (attachmentCatalogue.ts) | cli_inner_pretty.js:589366 | function |
| PWn case "file" | renderFileTruncationNote (file subcase: truncation note when e.truncated; first ${OQe}=2000 lines) (attachmentCatalogue.ts) | cli_inner_pretty.js:589260 | function |
| PWn case "hook_success" | renderHookSuccess (SessionStart/UserPromptSubmit/UserPromptExpansion hook non-empty stdout) (attachmentCatalogue.ts) | cli_inner_pretty.js:589463 | function |
| PWn case "invoked_skills" | renderInvokedSkillsReplay (pre-compaction skill-invocation replay; isMeta) (attachmentCatalogue.ts) | cli_inner_pretty.js:589287 | function |
| PWn case "mcp_instructions_delta" | renderMcpInstructionsDelta (MCP server instruction block added/removed; _7n on removals) (attachmentCatalogue.ts) | cli_inner_pretty.js:589544 | function |
| PWn case "mcp_resource" | renderMcpResource (ReadMcpResource content: text/binary/empty branches) (attachmentCatalogue.ts) | cli_inner_pretty.js:589408 | function |
| PWn case "memory_update" | renderMemoryUpdate (/dream background memory consolidation; YSf source label; always _7n trailer) (attachmentCatalogue.ts) | cli_inner_pretty.js:589566 | function |
| PWn case "plan_mode" | renderPlanModeDispatch (plan_mode case; delegates to GSf @589092) (attachmentCatalogue.ts) | cli_inner_pretty.js:589370 | function |
| PWn case "plan_mode_reentry" | renderPlanModeReentry (re-entering plan mode with an existing plan file) (attachmentCatalogue.ts) | cli_inner_pretty.js:589373 | function |
| PWn case "queued_command" | renderQueuedCommand (drains a queued prompt via N4e; isMeta iff origin non-user) (attachmentCatalogue.ts) | cli_inner_pretty.js:589354 | function |
| PWn case "relevant_memories" | renderRelevantMemories (auto-memory matches; lead-in only on first non-synthesis memory) (attachmentCatalogue.ts) | cli_inner_pretty.js:589343 | function |
| PWn case "task_reminder" | renderTaskReminder (TaskCreate/TaskUpdate idle; dual-gate; _H()-guarded) (attachmentCatalogue.ts) | cli_inner_pretty.js:589313 | function |
| PWn case "task_status" | renderTaskStatus (background-agent lifecycle: killed/running/completed branches) (attachmentCatalogue.ts) | cli_inner_pretty.js:589435 | function |
| PWn case "team_context" | renderTeamContext (PWn fast-path; "# Team Coordination"; REWORDED — teamName dropped vs 2.1.156) (attachmentCatalogue.ts) | cli_inner_pretty.js:589217 | function |
| PWn case "todo_reminder" | renderTodoReminder (TodoWrite idle; dual-gate cadence; appends current items) (attachmentCatalogue.ts) | cli_inner_pretty.js:589299 | function |
| PWn case "tool_search_usage_reminder" | renderToolSearchUsageReminder (NEW in 2.1.183: undiscovered deferred-tool schemas nudge; ${DA}=ToolSearch) (attachmentCatalogue.ts) | cli_inner_pretty.js:589330 | function |
| PWn case "verify_plan_reminder" | renderVerifyPlanReminder (plan-implemented verify-tool nudge; inert in shipped builds, tool name "") (attachmentCatalogue.ts) | cli_inner_pretty.js:589584 | function |
| YSf | MEMORY_UPDATE_SOURCE_LABELS (`{dream:"Background memory consolidation"}`) (attachmentCatalogue.ts) | cli_inner_pretty.js:590643 | object |

---

## Module: Renderer-Map Reminder Cases (ONl Tier-2 map)

Per-turn reminders emitted via the flat `ONl` per-type renderer map. The three ultracode-mode
renderers (`workflow_keyword_request` / `ultra_effort_enter` / `ultra_effort_exit`) carry REWORDED
text vs 2.1.156.

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| ONl["agent_mention"] | renderAgentMention (@-mentioned agent type acknowledgement) (utils/attachments.ts) | cli_inner_pretty.js:590511 | function |
| ONl["auto_mode_exit"] | renderAutoModeExit ("## Exited Auto Mode" prose) (utils/attachments.ts) | cli_inner_pretty.js:590551 | function |
| ONl["budget_usd"] | renderBudgetUsd (USD budget meter) (utils/attachments.ts) | cli_inner_pretty.js:590563 | function |
| ONl["compact_file_reference"] | renderCompactFileReference (file read pre-compaction, too large to inline) (utils/attachments.ts) | cli_inner_pretty.js:590451 | function |
| ONl["critical_system_reminder"] | renderCriticalSystemReminder (passthrough: e.content is the full reminder body) (utils/attachments.ts) | cli_inner_pretty.js:590536 | function |
| ONl["date_change"] | renderDateChange (local calendar day rolled over) (utils/attachments.ts) | cli_inner_pretty.js:590594 | function |
| ONl["directory"] | renderDirectory (synthetic Bash `ls <path>` tool_use+result via K9t/z9t) (utils/attachments.ts) | cli_inner_pretty.js:590432 | function |
| ONl["edited_text_file"] | renderEditedTextFile (user/linter mid-turn edit; snippet vs budget-exceeded branches) (utils/attachments.ts) | cli_inner_pretty.js:590442 | function |
| ONl["hook_additional_context"] | renderHookAdditionalContext (Pre/PostToolUse hook additionalContext, newline-joined) (utils/attachments.ts) | cli_inner_pretty.js:590581 | function |
| ONl["hook_blocking_error"] | renderHookBlockingError (hook blocking error from command) (utils/attachments.ts) | cli_inner_pretty.js:590571 | function |
| ONl["hook_stopped_continuation"] | renderHookStoppedContinuation (hook stopped the agent continuation) (utils/attachments.ts) | cli_inner_pretty.js:590589 | function |
| ONl["nested_memory"] | renderNestedMemory (ancestor CLAUDE.md memory surfaced) (utils/attachments.ts) | cli_inner_pretty.js:590502 | function |
| ONl["opened_file_in_ide"] | renderOpenedFileInIde (IDE bridge reports user opened a file) (utils/attachments.ts) | cli_inner_pretty.js:590482 | function |
| ONl["output_style"] | renderOutputStyle (non-default output style active) (utils/attachments.ts) | cli_inner_pretty.js:590531 | function |
| ONl["output_token_usage"] | renderOutputTokenUsage (turn/session output-token meter; em-dash + middot separators) (utils/attachments.ts) | cli_inner_pretty.js:590566 | function |
| ONl["pdf_reference"] | renderPdfReference (oversized PDF; force page-ranged Read; ${Ws}=Read) (utils/attachments.ts) | cli_inner_pretty.js:590458 | function |
| ONl["plan_file_reference"] | renderPlanFileReference (surfaces plan file path + contents) (utils/attachments.ts) | cli_inner_pretty.js:590489 | function |
| ONl["plan_mode_exit"] | renderPlanModeExit ("## Exited Plan Mode"; path sentence only when planExists) (utils/attachments.ts) | cli_inner_pretty.js:590541 | function |
| ONl["selected_lines_in_ide"] | renderSelectedLinesInIde (IDE non-empty text selection; truncated at 2000 chars) (utils/attachments.ts) | cli_inner_pretty.js:590472 | function |
| ONl["skill_listing"] | renderSkillListing (skills available for the Skill tool) (utils/attachments.ts) | cli_inner_pretty.js:590519 | function |
| ONl["token_usage"] | renderTokenUsage (token-budget meter; env-gated) (utils/attachments.ts) | cli_inner_pretty.js:590558 | function |
| ONl["total_tokens_reminder"] | renderTotalTokensReminder (NEW in 2.1.183: passes precomputed P4p text through) (utils/attachments.ts) | cli_inner_pretty.js:590560 | function |
| ONl["ultra_effort_enter"] | renderUltraEffortEnter (REWORDED: Ultracode-on full/sparse banner) (utils/attachments.ts) | cli_inner_pretty.js:590619 | function |
| ONl["ultra_effort_exit"] | renderUltraEffortExit (REWORDED: "Ultracode is off…") (utils/attachments.ts) | cli_inner_pretty.js:590626 | function |
| ONl["ultrathink_effort"] | renderUltrathinkEffort ("ultrathink" keyword present) (utils/attachments.ts) | cli_inner_pretty.js:590602 | function |
| ONl["workflow_keyword_request"] | renderWorkflowKeywordRequest (REWORDED: "ultracode" keyword → Workflow opt-in) (utils/attachments.ts) | cli_inner_pretty.js:590610 | function |

---

## Module: Inline & Standalone Reminder Emitters

Reminders emitted by non-dispatcher call sites: the shared ambient wrapper, the untrusted-input /
peer-session / GitHub / container guards, the non-interactive team-shutdown const, and the four
standalone one-off system-prompt dispatchers (side-question / remote ULTRAPLAN / multi-agent / brief).

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| DSl | multiAgentUltraplanReminder (remote multi-agent ULTRAPLAN module export; Hrf.exports) (attachmentCatalogue.ts) | cli_inner_pretty.js:526386 | object |
| EBe | renderUntrustedExternalInput (`<channel>`/`<input>` external-source untrusted-data guard; e=isPlugin) (attachmentCatalogue.ts) | cli_inner_pretty.js:148102 | function |
| KPa | renderContainerRestart (sandbox restarted; lists stopped background tasks; self-tagged) (attachmentCatalogue.ts) | cli_inner_pretty.js:367815-367822 | function |
| kSl | remoteUltraplanReminder (remote-planning-session module export; Srf.exports; gated by Tue()) (attachmentCatalogue.ts) | cli_inner_pretty.js:526341 | object |
| P5n | sideQuestionSystemPrompt (side-question dispatcher; tool use hard-denied; self-tagged) (attachmentCatalogue.ts) | cli_inner_pretty.js:473472 | function |
| Rlc | renderNonInteractiveTeamShutdown (headless run owns a live team; must shut down before final response; self-tagged) (attachmentCatalogue.ts) | cli_inner_pretty.js:690484 | const |
| tdf | briefModeToggle (/brief slash-command handler; enabled/disabled text; ${KO}=SendUserMessage) (attachmentCatalogue.ts) | cli_inner_pretty.js:551841 | object |
| uWn | wrapAmbientContextTrailer (shared ambient-context wrapper; prepends one isMeta `<system-reminder>`; 3 call sites @458050/@542407/@581457) (attachmentCatalogue.ts) | cli_inner_pretty.js:581457 | function |
| xla | renderGithubRateLimit (gh rate-limit guard with cooldown Tla; self-tagged) (attachmentCatalogue.ts) | cli_inner_pretty.js:298898 | function |
| (inline @363300) | renderPeerSessionPermissionGuard (NEW in 2.1.183: inter-session SendMessage permission-laundering guard; 2nd site @363303) (attachmentCatalogue.ts) | cli_inner_pretty.js:363300 | function |

---

## Module: Reminder-Shaped NON-Reminders (05_reminders.json harvest)

Strings harvested into the 25-string `05_reminders.json` asset that are NOT per-turn
`<system-reminder>` injections — tool descriptions, base-prompt fragments, permission-system
strings, and a debug-log line. Catalogued explicitly so a reader does not mistake them for
dispatcher cases. (Asset id in parentheses.)

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| __f | tagsBearNoRelationLine (R19: base "# System" prompt line about tags) (attachmentCatalogue.ts) | cli_inner_pretty.js:580723 | function |
| _gi | recalledMemoriesGuidance (R3: memory-system base-prompt about recalled `<system-reminder>` blocks) (attachmentCatalogue.ts) | cli_inner_pretty.js:151571 | object |
| Egi | memoryToolDescription (R2: Memory tool `description` text) (attachmentCatalogue.ts) | cli_inner_pretty.js:151496 | function |
| Jko | securityDualUseGuidance (R18: security/dual-use system-prompt fragment) (attachmentCatalogue.ts) | cli_inner_pretty.js:580616 | const |
| m$i | webFetchAuthReminder (R4: WebFetch tool description, full-prompt branch) (attachmentCatalogue.ts) | cli_inner_pretty.js:211000 | function |
| u (Agent desc) | agentListingPointerLine (R9: Agent tool description line pointing at the live roster) (attachmentCatalogue.ts) | cli_inner_pretty.js:423238 | const |
| V0o | permissionDenialWorkaroundGuidance (R24: appended to a denied tool result) (attachmentCatalogue.ts) | cli_inner_pretty.js:590325 | const |
| xvd | toolSearchDescription (R5: ToolSearch tool description; assembled by own()) (attachmentCatalogue.ts) | cli_inner_pretty.js:222330 | const |
| (Bash desc @450152) | bashDedicatedToolNudge (R11: Bash tool description "use a dedicated tool" nudge) (attachmentCatalogue.ts) | cli_inner_pretty.js:450152 | const |
| (Agent desc p @423245) | agentToolDescription (R10: Agent tool description body) (attachmentCatalogue.ts) | cli_inner_pretty.js:423245 | const |
| (v log @583222) | midConvSystemFallbackLog (R22: streaming-retry DEBUG log; NEVER injected; tengu_mid_conv_system_fallback_retry) (attachmentCatalogue.ts) | cli_inner_pretty.js:583222 | variable |
