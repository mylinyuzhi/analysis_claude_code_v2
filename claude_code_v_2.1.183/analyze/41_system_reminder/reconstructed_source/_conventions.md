# Reconstruction Conventions — `<system-reminder>` Subsystem (v2.1.183, readable-source restoration)

> **Goal:** a *readable-source-level* restoration of Claude Code **v2.1.183**'s `<system-reminder>`
> mechanism — the wrap/strip/extract primitives, the per-turn attachment generator pool, the
> attachment-type dispatcher/renderers, the ensure-wrap + smoosh final-pass normalizer, the `isMeta`
> UI-suppression path, and the full reminder **catalogue** (25 reminder strings) — written as clean
> TypeScript organized the way the genuine Anthropic source tree (v2.1.88 named-TS at
> `/lyz/codespace/3rd/claude-code/src`) organizes it. Reconstruct the *whole machine* at 2.1.183.

## Three evidence tiers (do not confuse them)

1. **PRIMARY — the v2.1.183 obfuscated bundle + extracted assets**
   - Bundle: `…/2.1.183/extract/cli_inner_pretty.js` (699,346 lines). Isolated decls under
     `…/extract/cli_unpack_pretty/decls/`.
   - **`…/extract/assets/system_prompts/05_reminders.json` — the 25 verbatim reminder strings.** This is
     the source of truth for reminder *text*. Quote verbatim; map each to its emit site in the bundle.
   - **Every** primitive, dispatcher case, generator, and string MUST be verified by reading the exact
     bundle line(s). `grep -c '<system-reminder>'` and per-string greps are the stable anchors (obf names
     re-mangle per build). Re-derive every decl id in the 2.1.183 bundle.

2. **SCAFFOLD — the v2.1.156 baseline analysis docs**
   `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/41_system_reminder/` — this is a
   **rich, complete** prior analysis with established readable names and verbatim primitives:
   `wrapInSystemReminder` (S0), `wrapMessagesInSystemReminder` (C_), `ensureSystemReminderWrap` (DQ_),
   `wrapMemoryAgeReminder` (Az7), `extractSystemReminderContent` (fi6 / history copy JN6),
   `stripLeadingReminders` (PG4), `stripAllReminders` (OD9), `SYSTEM_REMINDER_CLOSE` (Nm4),
   `smooshSystemReminderSiblings` (hG4), `smooshIntoToolResult` (Ai6),
   `mergeUserMessagesAndToolResults` (VQ_), `normalizeAttachmentForAPI` (kc6), `PER_TYPE_RENDERERS` (DG4),
   `collectAttachments` (Aw4), `runAttachmentGenerator` (E3), `getQueuedCommandAttachments` (gV$),
   `createUserMessage` (T8), `AMBIENT_CONTEXT_TRAILER` (yT8), the cadence configs (QV$/lg6/Kw4/_w4/zw4).
   Inherit names + logic; **re-verify every line + obf name against the 2.1.183 bundle** (they shifted
   ~+50K lines and re-mangled). Note any 2.1.156→2.1.183 delta inline.

3. **CONVENTION ONLY — the v2.1.88 named-TS source**
   `/lyz/codespace/3rd/claude-code/src`. Mirror this shape:
   - `utils/messages.ts` — `wrapInSystemReminder`, `wrapMessagesInSystemReminder`,
     `ensureSystemReminderWrap`, `smooshIntoToolResult`, `mergeUserMessagesAndToolResults`,
     `createUserMessage` (`isMeta`), `extractSystemReminderContent`.
   - `utils/attachments.ts` — `collectAttachments`, `runAttachmentGenerator`, the per-type renderers /
     dispatcher, the generator pool + 1s abort budget + master gate.
   - `components/messageActions.tsx` — `stripSystemReminders` (sticky-prompt strip).
   - `utils/transcriptSearch.ts` — the index-loop strip (`SYSTEM_REMINDER_CLOSE`).
   - `utils/telemetry/betaSessionTracing.ts` — the history-format extract copy.
   Cite the 2.1.88 file when you borrow a convention.

## What each reconstructed file MUST contain

- **The primitives** (`utils/messages.ts` analog): all 4 wrap + 2 extract + 3 strip helpers reconstructed
  verbatim-faithful (these are tiny and byte-precise — get the exact regex/slice constants right), plus
  ensure-wrap + smoosh with the `tengu_chair_sermon` gate and the `tool_reference` decline path.
- **The generator pool** (`utils/attachments.ts` analog): `collectAttachments` with the master gate
  (`CLAUDE_CODE_DISABLE_ATTACHMENTS`/`CLAUDE_CODE_SIMPLE`), the 1-second abort budget, the
  main-agent-only wave (`!agentId`), `runAttachmentGenerator` try/catch + telemetry sampling, the cadence
  configs.
- **The dispatcher + renderers** (`normalizeAttachmentForAPI` + `PER_TYPE_RENDERERS`): the 3-tier
  map+switch and a reconstruction of **each reminder renderer case** — the trigger condition, the emit
  site, and the **verbatim** reminder text (cross-referenced to `assets/system_prompts/05_reminders.json`).
- **The catalogue**: every one of the 25 reminders → {readable name, trigger, emit `@line`, verbatim text}.
  This is the centrepiece — be exhaustive and quote text verbatim.
- **The 2.1.88→2.1.183 evolution note**: what slimmed (per-Read malware reminder removal, the `yT8` hoist)
  and what is new at 2.1.183 vs 2.1.156 (any new reminder types in the 25).

## File format, anchors, and rules

- Clean readable TS; **every** primitive/function/const carries `// 2.1.183: <readable> = <obf> @line`;
  every quoted reminder string + non-trivial branch gets an inline `// @<line>` anchor.
- **File header block**: 2.1.183 regions covered, the 2.1.88 convention mirror path, the 2.1.156 scaffold
  doc, and a one-line cross-validation note.
- **No invented behavior**; mark `// UNVERIFIED:` + report in manifest if unconfirmable. Quote reminder
  text verbatim — paraphrase is a defect. English only.
- **No symbol-mapping tables** in these files ([`CLAUDE.md`](../../../../CLAUDE.md) rule) — inline anchors
  only; module `README.md` uses list-format refs; new symbols → manifest for
  `symbol_additions_v2_1_183_system_reminder.md`.
