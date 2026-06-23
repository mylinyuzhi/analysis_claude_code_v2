# `<system-reminder>` Mechanism — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of the **entire** `<system-reminder>`
> subsystem **as it exists in Claude Code v2.1.183** — the wrap / extract / strip / smoosh
> **primitives**, the per-turn attachment **generator pool**, the 3-tier API-normalize **dispatcher** +
> flat **per-type renderer map**, the `isMeta` UI-suppression path, and the full reminder
> **catalogue** (25 verbatim strings + every dispatcher case) — written as clean TypeScript organized
> the way the genuine Anthropic source tree (the v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`)
> organizes it.
>
> **Why it exists.** The module-level [`../README.md`](../README.md) is the *front door* narrative; this
> directory completes it by restoring the implementation at source level so you can read the machine
> top-to-bottom. Every behavior here is backed by a v2.1.183 line that was read directly; every
> reconstructed function carries a `// 2.1.183: <readable> = <obf> @<line>` anchor so any claim can be
> re-verified in seconds.

---

## How to read these files (the three evidence tiers)

These files were built — and verified — under a strict evidence discipline (the full rules live in
[`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines), plus
   the extracted asset **`assets/system_prompts/05_reminders.json`** — the 25 verbatim reminder strings,
   the source of truth for reminder *text*. Every primitive, dispatcher case, generator, and string was
   verified by reading the exact line(s). Obfuscated names re-mangle every build (and lines shifted
   ~+50K from 2.1.156, e.g. `kc6`→`PWn`, `Aw4`→`ctl`, `S0`→`TI`), so all were re-derived in this build
   by string-anchoring (the regex literals, the `Unknown attachment type:` dispatcher error, the
   `tengu_chair_sermon` / `tengu_attachment_compute_duration` events, the `CLAUDE_CODE_DISABLE_ATTACHMENTS`
   gate, the verbatim reminder strings) and cross-anchored against their call sites.
2. **SCAFFOLD — readable logic & names.** The v2.1.156 baseline analysis
   (`../../../../claude_code_v_2.1.156/analyze/41_system_reminder/`) — a rich prior analysis that supplied
   the established readable names for the unchanged spine (`wrapInSystemReminder`, `smooshIntoToolResult`,
   `collectAttachments`, `AMBIENT_CONTEXT_TRAILER`, the cadence configs, …). Each claim was re-verified
   against the 183 bundle; any 2.1.156→2.1.183 delta is noted inline.
3. **CONVENTION ONLY — file shape.** The v2.1.88 named-TS source. It supplies the *module layout* —
   `utils/messages.ts` for the envelope primitives + `createUserMessage`, `utils/attachments.ts` for the
   pool + dispatcher, `components/messageActions.tsx` / `utils/transcriptSearch.ts` for the strip
   variants — not the implementation (the 2.1.183 logic is what is restored).

---

## File inventory

Each `.ts` file restores one slice of the subsystem. The **mirrors** column is the v2.1.88 path whose
conventions the file imitates (shape only); the **v2.1.183 regions** are the load-bearing source spans
(all line numbers are `cli_inner_pretty.js`).

| File | Restores | Mirrors (v2.1.88 convention) | v2.1.183 regions | LOC |
|------|----------|------------------------------|------------------|----:|
| [`utils/messages.ts`](./utils/messages.ts) | The **primitives** — 4 wrap (`wrapInSystemReminder` `TI`, `wrapMessagesInSystemReminder` `Jp`, `ensureSystemReminderWrap` `bSf`, single-line `wrapMemoryAgeReminder` `xOi`), 2 extract (returns-original `q0o`, returns-null `oKr` over one anchored regex), 4 strip (`stripLeadingReminders` `Rbl`, the **NEW** guarded `ePo`, `stripAllReminders` `_Ql`→space, the index-loop `fyl`→nothing), the smoosh/merge final pass (`smooshSystemReminderSiblings` `WNl`, `smooshIntoToolResult` `G0o` with the `tool_reference` decline, `mergeUserMessagesAndToolResults` `Cx` gated by `tengu_chair_sermon`), and the `isMeta` factory `createUserMessage` `Rn`. | `utils/messages.ts`; `components/messageActions.tsx`; `utils/transcriptSearch.ts`; `utils/telemetry/betaSessionTracing.ts` | 588027–589091, 587389–587543, 220191–220208, 277246, 518094–518148, 606156–606165, 661920 | 619 |
| [`utils/attachments.ts`](./utils/attachments.ts) | The **generator pool + dispatcher** — `collectAttachments` `ctl` (master gate, 1 s abort budget, main-agent-only flag, two waves), `runAttachmentGenerator` `BA` (per-generator try/catch + 5 % `tengu_attachment_compute_duration` telemetry), `getQueuedCommandAttachments` `oGt` (the only generator surviving the gate), the 3-tier `normalizeAttachmentForAPI` `PWn`, the `PER_TYPE_RENDERERS` map `ONl`, the five cadence configs (`rGt`/`Hho`/`itl`/`atl`/`ltl`), and the `J3p` queued-modes set. | `utils/attachments.ts` (+ dispatcher colocated next to the pool, per 2.1.183) | 464606–464751, 589204–589607, 590431–590642, 466059–466064 | 849 |
| [`attachmentCatalogue.ts`](./attachmentCatalogue.ts) | The **catalogue** — a const-table inventory of every per-turn reminder renderer case (switch + map) **plus** the reminder-shaped strings the asset extractor harvested into `05_reminders.json` that are NOT per-turn reminders (tool descriptions / base-prompt / debug-log strings, explicitly flagged). Each entry: readable name, attachment `type`, emit `@line`, trigger, NEW-vs-2.1.156 status, and the **verbatim** rendered text. ~72 catalogued entries. | `utils/attachments.ts` (the renderer-string inventory) | 148102, 298898, 363300, 367816, 581457, 589198–590642 | 1342 |

> **Note on file boundaries.** The v2.1.183 bundle is a single concatenated file, so these modules are
> co-located there (the renderer map `ONl` physically sits right after the dispatcher `PWn`, both in the
> 589k–590k region; the primitives are scattered across 5 regions from 220k to 661k). The split into
> `utils/messages.ts` / `utils/attachments.ts` / `attachmentCatalogue.ts` follows the v2.1.88 module
> conventions; each file's header discloses where its content physically sits in the bundle. The
> behavior is faithful to those exact lines — only the grouping is a convention choice.

---

## The anchor-comment convention

Every primitive, function, const, and quoted reminder string carries an inline anchor so a reader can
jump from the readable reconstruction straight to the obfuscated truth:

```ts
// 2.1.183: <readableName> = <obfId> @cli_inner_pretty.js:<line[-line]>
```

For example, in `utils/messages.ts`:

```ts
// 2.1.183: wrapInSystemReminder = TI @cli_inner_pretty.js:589004-589008
export function wrapInSystemReminder(content: string): string { … }
```

Rules these files follow (from [`_conventions.md`](./_conventions.md)):

- **Every** decl gets a `// 2.1.183:` anchor; every quoted reminder string and non-trivial branch gets
  an inline `// @<line>` anchor.
- **File header block** discloses: the 2.1.183 regions covered, the 2.1.88 convention-mirror path, the
  2.1.156 scaffold doc, and a one-line cross-validation note.
- **No invented behavior** — anything unconfirmable is marked `// UNVERIFIED:`. Reminder text is quoted
  **verbatim** (paraphrase is a defect); the bundle stores em-dashes as the `&mdash;`-style escape that
  resolves to a literal `—` at runtime, which is what the quoted text shows.
- **No symbol-mapping tables** in these files (the project [`CLAUDE.md`](../../../../CLAUDE.md) rule) —
  inline anchors only; each `.ts` file is itself the authoritative, line-anchored symbol map for its
  slice. New symbols flow to `00_overview/symbol_additions_v2_1_183_system_reminder.md`.

---

## Provenance

The reconstruction was driven by two verified anchor dossiers plus the conventions file. They are the
working notes each `.ts` file was built from — read them when you need the raw evidence behind a claim:

- [`_anchors_primitives.md`](./_anchors_primitives.md) — the **primitives + pipeline** dossier: the
  full symbol crosswalk (2.1.156 readable → 2.1.183 obf → line), the 4 wrap / 2 extract / 4 strip
  primitives with verbatim bodies, the smoosh/merge region, the generator pool, the dispatcher + renderer
  map, the cadence configs, and the §9 2.1.156→2.1.183 delta summary. Source of truth for the *machine*.
- [`_anchors_catalogue.md`](./_anchors_catalogue.md) — the **catalogue** dossier: every one of the 25
  `05_reminders.json` strings (R1–R25) mapped to its emit site, enclosing decl, trigger, NEW-vs-2.1.156
  status, and verbatim text; plus the full `PWn`/`ONl` dispatcher case inventory beyond the 25, and the
  §4 NEW-in-2.1.183 summary (R7 peer-guard, `tool_search_usage_reminder`, R23 rewording). Source of
  truth for the *strings*.
- [`_conventions.md`](./_conventions.md) — the reconstruction rules: the three evidence tiers, what each
  file must contain, and the file-format / anchor / no-tables rules.

Each `.ts` file's header block additionally cites the specific v2.1.88 convention-mirror path and the
specific 2.1.156 scaffold doc it inherited readable names from.

---

## Cross-validation status

Every `@line` cited across the three files and both dossiers was Read against the live v2.1.183 bundle,
and every 2.1.156→2.1.183 delta claim was corroborated by a 0-count / shape-diff `grep` against the
v2.1.156 before-picture bundle (the NEW guarded strip `ePo`, the `tool_search_usage_reminder` and
`total_tokens_reminder` renderers, the R7 peer/permission-laundering guard, the R23 `team_context`
rewording, and the master-gate return-shape change). Overall confidence is **HIGH**: each obf id was
re-derived by string-anchoring and confirmed by converging call sites (e.g. `TI` is anchored by both its
multiline-literal body and its ~20 call sites; `q0o`/`oKr` by the identical anchored regex; the cadence
configs by both their value literals and their export aliases). Full per-feature results:
[`../../00_overview/cross_validation_report_system_reminder.md`](../../00_overview/cross_validation_report_system_reminder.md).

---

## Suggested reading order

1. **`utils/messages.ts`** — the primitives; tiny, byte-precise, and called by everything else. Read
   wrap → extract → strip → smoosh → `createUserMessage`.
2. **`utils/attachments.ts`** — the pool (`collectAttachments`: master gate, 1 s budget, two waves) then
   the dispatcher (`normalizeAttachmentForAPI`: team-exit → map → switch) and the `PER_TYPE_RENDERERS`
   map.
3. **`attachmentCatalogue.ts`** — the exhaustive string inventory; the lookup table for "which reminder
   fires when, and what does it say verbatim."

For *what changed* between v2.1.156 and v2.1.183 specifically, and the four-layer narrative, read
[`../README.md`](../README.md). For the still-authoritative description of the unchanged spine, the
v2.1.156 baseline is linked from each `.ts` file's header.

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts` file is itself the authoritative, line-anchored symbol
> map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_additions_v2_1_183_system_reminder.md](../../00_overview/symbol_additions_v2_1_183_system_reminder.md) — the consolidated v2.1.183 system-reminder symbol table (164 rows: primitives, pool, dispatcher, renderer map, cadence configs, catalogue).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — the system-reminder / attachment mechanism is a core feature (Plan, Hooks, Skills, Compact, Todo, Thinking, Steering, CLI).
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — the per-turn attachment collection point in the agent loop; subagent context that sets `agentId`.
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — the `ct` Statsig gate evaluator, the `tengu_chair_sermon` flag, telemetry sinks, the lean-prompt gate.
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — IDE selection / opened-file attachments, LSP diagnostics, the transcript-search strip.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `wrapInSystemReminder` (`TI`, `cli_inner_pretty.js:589004`) — the canonical envelope → `utils/messages.ts`.
- `createUserMessage` (`Rn`, `cli_inner_pretty.js:587504`) — the `isMeta` factory → `utils/messages.ts`.
- `collectAttachments` (`ctl`, `cli_inner_pretty.js:464606`) — the generator pool → `utils/attachments.ts`.
- `normalizeAttachmentForAPI` (`PWn`, `cli_inner_pretty.js:589204`) / `PER_TYPE_RENDERERS` (`ONl`, `cli_inner_pretty.js:590431`) — the dispatcher + map → `utils/attachments.ts`.
- `smooshIntoToolResult` (`G0o`, `cli_inner_pretty.js:588506`) — the smoosh fold + `tool_reference` decline → `utils/messages.ts`.
- `stripLeadingRemindersGuarded` (`ePo`, `cli_inner_pretty.js:606156`, **NEW**) — the new guarded strip → `utils/messages.ts`.
- `AMBIENT_CONTEXT_TRAILER` (`_7n`, `cli_inner_pretty.js:590353`) / shared wrapper (`uWn`, `cli_inner_pretty.js:581457`) — the "do not narrate" trailer → `attachmentCatalogue.ts`.
- The 25 catalogue strings (R1–R25) → `attachmentCatalogue.ts`, dossier [`_anchors_catalogue.md`](./_anchors_catalogue.md).
