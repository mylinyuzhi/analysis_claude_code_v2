# Cross-Validation Summary — v2.1.193 (v2.1.183 → v2.1.193 focused delta)

A cross-feature roll-up of the **twelve per-theme adversarial cross-validation passes** that audited the
v2.1.183 → v2.1.193 focused-delta tree, plus an independent consolidated re-check of the tree-wide invariants
(forbidden-mapping-table scan over every module doc, `## Related Symbols` presence, a full relative-link
resolution sweep, and an English-only scan) run directly by this summary against the live tree.

> **What this tree is.** This is a **focused delta analysis** of the **v2.1.183 → v2.1.193** window — published
> sub-versions **2.1.185, .186, .187, .190, .191, .193** (unpublished .184/.188/.189/.192) — scoped to the twelve
> subsystems that actually changed in the window: Tools, Compaction, Agent Team, Auto Memory, Background Agents,
> Permissions, MCP, System Prompt, Workflow, Slash Commands, Telemetry, and Skills. It is **not** a comprehensive
> every-module re-analysis; subsystems untouched in the window are intentionally out of scope. The twelve
> cross-validation reports rolled up here cover exactly these twelve module trees.

**Source under analysis (TARGET):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
— **718,679 lines**, build `a1938d2a`. Every `cli_inner_pretty.js:<line>` citation below resolves to this bundle
unless it is explicitly tagged `(183)` or `(156)` as a before-picture.

**Cross-validation sources:** the **v2.1.183 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`, 699,346 lines, build `9d251abd`)
for every before-picture and the first absence grep; the **v2.1.156 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines) for the second,
independent absence grep; the **v2.1.88 named TypeScript** at `/lyz/codespace/3rd/claude-code/src/` for
NEW-vs-evolved lineage where a theme cites a named ancestor; the extracted asset trees
(`…/extract/assets/`) for the system-prompt reminder/env set-diffs, the telemetry `env_vars.json`, and the tools
`assets/tools/*.md` surface diff; and the twelve `_scout_dossier_<theme>.md` spec dossiers as the claim source
each pass adversarially re-derived.

**Scope of the delta tree:** twelve module dirs — `04_tools`, `07_compact`, `30_agent_team`, `31_auto_memory`,
`36_background_agents`, `38_permissions`, `39_mcp`, `40_system_prompt`, `42_workflow`, `43_slash_commands`,
`44_telemetry`, `45_skills` — plus `00_overview/` (the four consolidated `symbol_index_*.md` routing files,
twelve per-theme `symbol_additions_v2_1_193_*.md` tables, the twelve per-theme `cross_validation_report_*.md`, and
this summary) and the `by_version/` digest. The reports rolled up here are:

- [`cross_validation_report_tools.md`](./cross_validation_report_tools.md)
- [`cross_validation_report_compact.md`](./cross_validation_report_compact.md)
- [`cross_validation_report_agent_team.md`](./cross_validation_report_agent_team.md)
- [`cross_validation_report_auto_memory.md`](./cross_validation_report_auto_memory.md)
- [`cross_validation_report_background_agents.md`](./cross_validation_report_background_agents.md)
- [`cross_validation_report_permissions.md`](./cross_validation_report_permissions.md)
- [`cross_validation_report_mcp.md`](./cross_validation_report_mcp.md)
- [`cross_validation_report_system_prompt.md`](./cross_validation_report_system_prompt.md)
- [`cross_validation_report_workflow.md`](./cross_validation_report_workflow.md)
- [`cross_validation_report_slash_commands.md`](./cross_validation_report_slash_commands.md)
- [`cross_validation_report_telemetry.md`](./cross_validation_report_telemetry.md)
- [`cross_validation_report_skills.md`](./cross_validation_report_skills.md)

**Headline: 12 / 12 PASS WITH FIXES, HIGH confidence. 625 distinct v2.1.193 anchors re-read at their exact cited
lines; 42 defects fixed in place; 2 false-deltas caught and reclassified as carryover; 0 FAIL.**

---

## 1. Per-theme verification roll-up

Each theme was verified independently by a default-to-FAIL skeptic who re-opened every sampled anchor at its
exact cited line in the named bundle (`sed -n`), re-read the before-pictures in the 183 (and 156) bundle, and
re-ran every NET-NEW / CARRYOVER grep-count in **both** the 183 and 156 bundles. "Anchors (193)" is the count of
distinct v2.1.193 `cli_inner_pretty.js:<line>` citations re-read in the TARGET bundle; every one resolved to the
claimed declaration/string — the "defects fixed" are citation-precision, mapping-label, count, or
delta-classification corrections, **never a wrong symbol or a fabricated line**.

| Theme | Anchors (193) | Anchors resolved | Defects fixed | False-deltas | Verdict | Confidence |
|---|---:|---|---:|---:|---|---|
| `04_tools` | 53 | 53 / 53 | 1 | 0 | PASS WITH FIXES | HIGH |
| `07_compact` | 30 | 30 / 30 | 2 | 0 | PASS WITH FIXES | HIGH |
| `30_agent_team` | 33 | 33 / 33 (2 drift-corrected) | 5 | 1 | PASS WITH FIXES | HIGH |
| `31_auto_memory` | 30 | 30 / 30 | 3 | 0 | PASS WITH FIXES | HIGH |
| `36_background_agents` | 95 | 95 / 95 | 6 | 0 | PASS WITH FIXES | HIGH |
| `38_permissions` | ~85 | ~85 / ~85 | 4 | 0 | PASS WITH FIXES | HIGH |
| `39_mcp` | 85 | 85 / 85 | 7 | 1 | PASS WITH FIXES | HIGH |
| `40_system_prompt` | 35 | 35 / 35 | 5 | 0 | PASS WITH FIXES | HIGH |
| `42_workflow` | 46 | 46 / 46 | 2 | 0 | PASS WITH FIXES | HIGH |
| `43_slash_commands` | 55 | 55 / 55 | 3 | 0 | PASS WITH FIXES | HIGH |
| `44_telemetry` | 33 | 33 / 33 | 1 | 0 | PASS WITH FIXES | HIGH |
| `45_skills` | 45 | 45 / 45 | 3 | 0 | PASS WITH FIXES | HIGH |
| **Total** | **625** | **625 / 625** | **42** | **2** | **PASS (12/12)** | **HIGH** |

**Aggregate: 625 / 625 sampled v2.1.193 anchors resolved to the claimed symbol on re-read; 42 in-place defects
fixed; 2 false-deltas caught and reclassified to carryover; 0 FAIL.** Beyond the 625 TARGET anchors, the twelve
passes re-read **150+ before-pictures** in the 183/156/88 trees and re-ran **230+ grep-count diffs** (each in 193,
183, and 156) plus six asset cross-checks — none of which is counted in the 625.

> The "625" is the sum of distinct 193 anchors per report
> (53 + 30 + 33 + 30 + 95 + 85 + 85 + 35 + 46 + 55 + 33 + 45). The two themes reported as "~85"/"85+" (permissions,
> MCP) and the two reported as "55+"/"~45"/"~45" (slash_commands, skills, tools') are taken at their stated
> base figure for the sum; the roll-up is therefore a conservative floor, not an inflated count.

---

## 2. Failure / defect taxonomy (all 42 now fixed)

Every one of the 42 fixes is a precision, label, count, or classification defect: in each case the obfuscated
identifier exists, the declaration/string text is what the doc says, and the underlying delta finding holds. **No
pass found a single invented symbol, a fabricated line, a wrong-token mapping, or a wrong-direction delta.** The 42
group cleanly into five categories that re-add to 42 from two independent angles (per-theme sum and per-category
sum):

| Category | Count | What it is |
|---|---:|---|
| Line-precision / citation drift (±1…±4 lines) | ~26 | The decl/symbol/region is correct; only the cited line number was off (landed on a body line, a comma-chained sibling, a closing brace, or a neighbour statement) |
| Obf→readable mapping mislabel | ~8 | The symbol is correct but the readable name or signature description was wrong; corrected to match the decl body |
| Grep-count / enumeration correction | ~2 | A reported count was off (the symbol and direction were right) |
| False-delta → reclassified carryover | 2 | A "NET-NEW" claim that was actually present pre-window; reclassified CARRYOVER (see §3) |
| Source-text / prose content fix | ~4 | A snippet field, stale anchor, or prose number disagreed with the source/its own table |

**Per-theme breakdown of the 42** (each reconciles to its report's "Defects fixed" section):

- **`30_agent_team` (5).** 2 decl-line drifts (`$jt` `302921→302920`, `Mde` `431809→431808`); 1 grep-count fix
  (`"iterm2"` literal `16→20`, re-counted at `cli_inner_pretty.js:` whole-bundle `grep -o` = 20 in 193 / 9 in 183);
  1 source-text snippet fix (`kill_reason:`→`reason:` to match `:384657`); **1 false delta** (`user_kill_async`).
- **`39_mcp` (7).** 3 cite drifts (`aOt` 183 `:283328→:283324`, `psr` callsite `:611560→:611561`, login-success
  message `:613452→:613457`); 3 mapping mislabels (`Ct`→`logFeatureSadEvent` at `:44851`, generic `tengu_feature_sad`,
  not "logMcpEvent"; `lWe` and `Vj` runtime-`.name` annotations added); **1 false delta** (`mcp_headers_helper`).
- **`40_system_prompt` (5).** 2 mislabels — the HIGH-severity `D_f`→`L_f` env-builder token (the 183 carryover of
  `W3f` is `L_f`@(183)`580976`, a 2-param builder; `D_f`@(183)`581006` is the unrelated 3-param sibling = 193 `V3f`,
  independently proven by the extracted asset filename `03_env_template_0_L_f.txt`), and the `Kwn`@`152092`
  save-time→staleness-bullet description; plus 3 ±1 cite drifts (slot range `592873-592879→-592878`, function range
  end `…592881→…592880`, model-info line `592852→592851`).
- **`36_background_agents` (6).** 2 +1 drifts (`Mde` `431809→431808`, `CXp` `431817→431816`); 1 mislabel (`Re`@`44848`
  is a `tengu_feature_bad` emitter — relabeled `logFeatureError`, not "logToolEvent"); 1 identity-passthrough
  clarification (`Ou`@`1792` is `(e)=>e`; the real `.meta.json` path builder `t7l`@`581864` added to the index); 1
  parenthetical `summary`-arg drift (`431260→431255`); 1 stale panel schema pointer replaced by `dSc`/`Eim` and the
  child-row overflow slice anchors.
- **`38_permissions` (4).** Four ±1–2 cite drifts, each naming a decl whose exact line was off by one or two
  (`credentials: IEu()` `54096→54095`; `Rwr` `54059→54058`; `FRn.register` method `209633→209631`; `u_n`
  `103211→103212`). The 18-grep-diff false-delta hunt across all three bundles found **zero** false deltas.
- **`31_auto_memory` (3).** 1 wrong-signature description (the deleted `Hgi` builder lacks the *session-transcripts*
  param, not "no memory-dir param"); 1 under-count (183 `aH()` gate sites `11→16`, `grep -c '\baH()'` = 17 = 16
  call-sites + 1 decl); 1 +2 decl drift (`FOa` `378928→378926`).
- **`43_slash_commands` (3).** 3 cite drifts (`tKt` `517886→517883`, `Kcn`/`KL` `589640→589641`, `Hzn` `538526→443362`).
- **`45_skills` (3).** 3 cite drifts (the `skillUsage`/`skillOverrides` reads `519547/519548-519550 →
  519548/519550-519552`; the 183 `CA` empty-metadata/body cite `148679/148691 → 148681/148693`, fixed in two docs).
- **`07_compact` (2).** 2 ±1 drifts (`wYe` getter decl `2876→2875`, `BIo` callsite `466459→466460`).
- **`42_workflow` (2).** 1 cross-link drift (`depth: K3(pe)+1` `423707→423711`); 1 source-text correction
  ("byte-equivalent" → "logic-equivalent (re-mangle only)" for the print-mode cap, since `Mjo≠Y0o`, `Cr≠_n`, `Ti≠en`).
- **`04_tools` (1).** 1 cite drift (the `getAvailableTools` exclusion `new Set([…])` `444239→444237`).
- **`44_telemetry` (1).** 1 prose-count fix ("five axes" → "six axes" to match the six-row comparison table).

**Confirmation that none was a wrong symbol or fabricated line:** every report's verdict explicitly closes "no
fabricated anchors, no wrong tokens." The two false-deltas are the only *classification* defects, and even there the
symbol exists and the grep count is real — only the NET-NEW-vs-CARRYOVER label was wrong. The mapping mislabels all
kept the correct obfuscated token and corrected only the human-readable gloss against the decl body. The
line-precision drifts already pointed at the correct function/region and were snapped to the exact line.

---

## 3. The two false-deltas — the framing-integrity win

The single highest-value step in every pass was the **dual-bundle false-delta hunt**: re-running each NET-NEW /
CARRYOVER claim with `grep -c` in **both** the 183 **and** 156 bundles, because a genuine 193 delta must be `0 in
183 AND 0 in 156`. Ten of the twelve themes survived it with **zero** false deltas. Two did not — and in both the
defect was a "NET-NEW" claim that was actually pre-existing **CARRYOVER**:

- **`30_agent_team` — `user_kill_async` was not new.** `stop_attribution.md` claimed all three termination reasons
  (`parent_kill_async` / `system_kill_async` / `user_kill_async`) were 0→1 NET-NEW telemetry. Re-grepping showed
  `user_kill_async` already present at 183 `:371804` and 156 `:279437`. Reclassified: `parent_kill_async` /
  `system_kill_async` are the genuine net-new arms (0→1 each), while `user_kill_async` is **CARRYOVER** — the new
  `killedBy` plumbing (193 `:384650-384658`) now also routes `parent`/`system` into the *pre-existing* reason enum.
- **`39_mcp` — `mcp_headers_helper` was not new.** `headers_helper_reauth.md` presented the `mcp_headers_helper`
  telemetry as NET-NEW `1|0`. It is actually `7|6`: a **pre-existing** `tengu_feature_sad` feature_name (emitted by
  `Ct`@`44851`) used since ≤156 for headersHelper config-validation errors. Only the `reauth_retry` **error_code**
  value is the 193 delta (`reauth_retry` 193=1 / 183=0 / 156=0). The row was rewritten to grep `reauth_retry`, with a
  separate `mcp_headers_helper` `7|6` CARRYOVER row.

Both were exactly the trap the dual-bundle step exists to catch: a per-file read would have accepted the `1|0`
row; only `grep -c` in 183 **and** 156 exposed the pre-existing uses.

**Standout dossier down-scopes (the most-tempting headline claims, rigorously narrowed, each re-verified):**

- **Background Agents.** The turn-end "working" finalizer is correctly flagged **CARRYOVER, not a 183→193 delta**:
  183 `pgo`@`456114` is byte-equivalent to 193 `Exo`@`464591` (identical guard and `tempo:"blocked"` write; only the
  re-mangled `needs` sentinel and two added `[reply-on-resume]` debug strings differ). The doc's honesty flag holds.
  A later focused pass also upgraded the pinned-reprompt area: the `WWn` resume-prompt call sites are still carryover,
  but 193 adds an isolable bg-job metadata refresh (`k3i`/`R3i`/`$Kr`) after `/cd` and conversation reset, with no
  equivalent in the 183 reset/classifier windows.
- **Compaction.** The whole `Ego`→`Rxo` change is correctly characterized as a **behavior-preserving shape change**
  (flat `{wasCompacted}` → discriminated `{kind}` union), proven by the six-exit-point map and the two diagnostic
  greps `wasCompacted` 10→0 and `rapid_refill_breaker_tripped` 0→2 — not a behavior change.
- **Auto Memory.** The "2.1.186 MEMORY.md compact reminder" is correctly proven **CARRYOVER** (byte-identical
  load-time WARNING + dream Phase-4; the proactive `nearing`/`approaching the limit` strings are 0/0 in both
  bundles), and the guessed name `findRelevantMemories` is correctly flagged as never having existed (0/0).
- **System Prompt.** The reminder-catalogue delta was settled by an **authoritative Python set-diff** of the two
  `05_reminders.json` assets: exactly **one add** (the Remote "now running as" model-change reminder) and **one
  remove** (the "Tool results may include additional `<system-reminder>` blocks…" paragraph) — matching the doc
  verbatim, the strongest single piece of evidence in the tree.
- **Permissions.** The adversarial `rre` phrase "restricted by your organization's settings" (present in 183=1) is
  correctly disclosed as **carryover**, with the genuinely-new string isolated as "Run /model to choose a different
  model." (183=0).
- **Slash Commands.** The `FileChanged` watch-path splitter `split("|")`@`240472` is correctly flagged as a
  **different feature**, not the hooks comma-matcher fix (`s3f` `/[|,]/`@`589634`).
- **Tools.** `classifyAllShell` is correctly disambiguated to the **permissions** theme (not tool-surface), and the
  `compgen -f` Tab completion is correctly held **CARRYOVER**.

These are the behaviors the framing-trap mandate exists to produce: the most-cited, most-tempting deltas were the
ones most rigorously down-scoped, each backed by evidence.

---

## 4. Methodology — what made the passes adversarial

A 99.x% first-read anchor-resolution rate could still surface 42 real defects and 2 false-deltas because every pass
ran the same multi-layer self-check:

1. **Three-bundle physical re-read, never memory.** The 193 bundle (718,679 lines) is line-shifted ~19k vs 183
   (699,346) and ~69k vs 156 (649,979), so a citation cannot be confirmed by recall — it must be physically
   re-opened at the exact line in the correct bundle. This is what caught all ~26 line-precision drifts.

2. **Absence proven by a dual zero-count grep, not assumed.** Every NET-NEW / REMOVED claim was proven by `grep -c`
   returning **0 in 183 AND 0 in 156** for a stable, non-renamed token (a telemetry event name, an env-var name, a
   user-facing string). Examples reproduced across the tree: tools `respondToBashCommands` 0/0, `"bash-path"` 0/0,
   `ReadMcpResourceDirTool` 0/0; telemetry `assistant_response` 0/0, `OTEL_LOG_ASSISTANT_RESPONSES` 0/0; workflow
   `requiresStructuredOutput` 0/0, `[structured-output-enforce]` 0/0; mcp `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` 0/0,
   `ENDPOINT_NOT_FOUND` 0/0, `Authenticate with an MCP server` 0/0; permissions `classifyAllShell` 0/0,
   `denied_by_entitlement` 0/0; system_prompt `Outbound HTTPS goes through a pre-configured agent proxy` 0/0;
   skills `parseError:` 0/0, `skill_load_yaml_failed` 0/0; background `memoryPressure` 0/0, `stoppedByUser` 0/0;
   slash_commands `precedingAssistantUuid` 0/0, `chain-too-deep` 0/0. The dual-grep is also what caught both
   false-deltas (§3).

3. **v2.1.88 named-TS lineage check where an ancestor is cited.** Telemetry located 9/9 named ancestors (e.g.
   `logOTelEvent` `events.ts:21`, `MAX_CONTENT_SIZE = 60*1024` `betaSessionTracing.ts:70`) and confirmed
   `assistant_response` absent from the 88 tree; auto_memory confirmed `buildConsolidationPrompt`
   `consolidationPrompt.ts:10`; agent_team confirmed `getTeammateMode` has no `iterm2` and `buildInheritedCliFlags`
   never took `effortValue`; skills confirmed the 88 `frontmatterParser.ts` / `loadSkillsDir.ts` shape has literal
   field readers, body-preserving YAML failure behavior, no `parseError`, and no `normalizeKeys` parser option.
   MCP confirmed the 88 client already had direct list calls, headersHelper, the absolute `MCP_TOOL_TIMEOUT`, legacy
   401 needs-auth surfacing, and the needs-auth cache, while lacking `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`,
   `reauth_retry`, `mcpLoginHandler`, and `ENDPOINT_NOT_FOUND`. Tools confirmed 88 already had Bash
   `processBashCommand`, List/Read MCP resource tools, ToolSearch, TeamCreate/TeamDelete, and non-bash `@` path
   completion, while lacking `respondToBashCommands`, `"bash-path"`, and `ReadMcpResourceDirTool` /
   `resources/directory/read`.
   Non-existence assertions (background "no 88 ancestor for the disk-resume model") were verified by `grep`=0 over
   `src/`, so there is nothing to falsify.

4. **Asset cross-checks.** System_prompt's `05_reminders.json` set-diff (one add / one remove) and env-template
   byte sizes (198→203 B); telemetry's `env_vars.json` (the new var absent from the asset, bundle authoritative);
   tools' `assets/tools/*.md` count (50→51, diff = `+ReadMcpResourceDirTool.md`) and the byte-identical
   `Bash.md`/`PowerShell.md` description blocks.

5. **Re-mangle awareness.** Obfuscated tokens change between builds, so the cross-version before/after tables in the
   module docs are obf→obf **re-mangle** evidence (the allowed exception), not obf→readable deobfuscation lookups —
   confirmed for permissions (`$Cr`=isSubagent in 183 → isClassifyAllShellEnabled in 193; `PNa`→`dQa`; `WGe`→`r9e`),
   compact (`Ego`→`Rxo`), tools (`bat`→`Wpt`), and workflow (the print-mode `Mjo`/`Cr`/`Ti`/`Em` re-mangle).

---

## 5. Consolidated tree-wide invariant sweep (this summary's own re-check)

Beyond trusting the twelve digests, this roll-up re-ran the tree-wide invariants directly over all twelve module
dirs (the 47 `NN_module/*.md` docs) plus `00_overview/`, `by_version/`, the scout dossiers, and the tree README:

- **Forbidden obf→readable mapping tables in module docs — ZERO.** A scan of all 47 module-doc `.md` files for the
  `| Obfuscated | Readable` table header (both the exact form and the broad "any header cell containing both words"
  form) returned **0 hits**. Mapping tables live only in the twelve `00_overview/symbol_additions_v2_1_193_*.md`
  files and the four `symbol_index_*.md`. The per-theme passes individually confirmed that the cross-version
  before/after tables that *do* appear in module docs (the compact/workflow/tools/skills/permissions re-mangle
  lineage tables) are the allowed exception, not deobfuscation lookups.

- **`## Related Symbols` closing block — present in 47 / 47 module docs.** Every one of the 47 module docs carries
  exactly one `## Related Symbols` section (verified by per-file `grep -c` = 1 across all 47), each pointing at the
  four `../00_overview/symbol_index_*.md` plus its per-theme additions file, followed by a list-format key-function
  index. No duplicates, no omissions.

- **Relative-link resolution — all genuine links resolve, 0 broken (2 fixed in place).** A full sweep of every
  relative `.md` link across the whole tree (code-fence and inline-code spans stripped to avoid false positives)
  extracted **1,025** markdown links, of which **1,021** are relative path links (0 external, 4 anchor-only). The
  first sweep found **5** unresolved; investigation classified them as:
  - **2 genuine broken links — FIXED here.** `38_permissions/README.md` and
    `38_permissions/background_subagent_permission_forwarding.md` both linked
    `../36_background_agents/nested_subagent_depth_limit.md`, a filename that exists only in the **183** tree; the 193
    equivalent is `subagent_depth_tracking.md`. Both links (display text and target) were repointed to
    `../36_background_agents/subagent_depth_tracking.md`. (The background docs' own links to the 183 tree's
    `nested_subagent_depth_limit.md` via `../../../claude_code_v_2.1.183/analyze/…` are valid — that file exists in
    183 — and were correctly not flagged.)
  - **2 forward-references to this file.** `00_overview/README.md` links `cross_validation_summary.md` twice; these
    resolve on creation of this document.
  - **1 confirmed false positive.** `31_auto_memory/memory_reminder_and_dream_carryover.md:88` contains
    `[Title](file.md)` *inside a verbatim backtick-quoted blockquote of the Claude Code dream-consolidation source
    prompt* ("Update `${UH}` so it stays under `${RY}` lines … `- [Title](file.md) — one-line hook`"). It is an
    illustrative markdown example embedded in quoted source text, **not** a navigational link, and was correctly left
    untouched. (This is the same class of false positive the 183 sweep flagged: a link-shaped string inside a quoted
    span.)

  After the two fixes, the only remaining "unresolved" candidates are the two self-references (now satisfied) and the
  one verbatim-source false positive — i.e. **0 genuine broken links** tree-wide.

- **Routing layer present — the 183-era consolidation gap is closed.** Several per-theme reports (notably
  permissions and telemetry) carried a residual that the four `../00_overview/symbol_index_*.md` targets "do not yet
  exist." In this tree they **do**: all four `symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md`
  and all twelve `symbol_additions_v2_1_193_*.md` are present in `00_overview/`, which is why the link sweep resolves
  every `## Related Symbols` blockquote link. That shared residual is therefore **resolved**.

- **English-only — PASS in all docs.** A `grep -P` for CJK / Hiragana / Katakana / Hangul / Cyrillic word characters
  across every `.md` in the tree returned **0 files**. The only non-ASCII glyphs are typographic/box-drawing
  (`·`/`…`/`—`/`←`/`→`/`≤`) and verbatim-quoted source-string glyphs.

---

## 6. Residual low-confidence items / open questions (consolidated, carried forward)

These were honestly flagged by the individual passes as **not errors** in the audited docs — they are genuinely
un-pinned runtime edges or best-effort attributions the docs carry at low/medium confidence rather than overclaim.
Carried forward for any future pass:

1. **Sub-version pinning (.185/.186/.187/.190/.191/.193) is not bundle-verifiable.** Only the 193/183/156 bundles
   exist, so the bundle evidence confirms only "new in the 183→193 window" (every headline string flips 0→present
   from 183 to 193 — HIGH). The exact intermediate sub-version for each delta is taken from the changelog scoping,
   not a bundle diff. Flagged by agent_team, compact (the `Rxo` refactor commit), mcp, skills, tools, and others.
2. **Compaction — refactor commit boundaries.** The `VZr` extraction and the `autocompactRan` pre-derivation are
   plausibly part of the same commit as the discriminated-union change but are not separable without intermediate
   bundles; behavior-preserving regardless.
3. **Background — soft naming and bounded UI items.** `Tr`@`3061` is literally `!isInteractive` (named
   `isRemoteMode`); `Ie`/`Re` are generic `tengu_feature_ok`/`_bad` emitters. The pinned-reprompt area now has an
   isolated bg-job metadata-refresh mechanism (`$Kr`/`k3i`/`R3i`), but the direct pin-specific UI guard, panel
   sibling-hide/row-jump, and channel-drop fix remain bounded as inferred / LOW with no fabricated anchors.
4. **MCP — runtime vs role names and prior-window notices.** `lWe`/`Vj` readable names differ from their runtime
   `.name` ("McpAuthError"/"AuthenticationCancelledError"), annotated rather than renamed; `fde`/`z5t` is now
   re-derived as a bounded name+alias matcher over an adjacent-transposition-aware DP edit distance; the notice
   strings are carryover-vs-183 but absent in 156 (added in the prior window).
5. **Tools — the `--tools` cold-launch gate fix (T4) is un-isolable / LOW.** No `flagsLoaded`/`ensureFlags`/
   `waitForFlags` symbol exists (0 in both bundles), `Sjo`/`b4` are carryover-identical, and the explicit
   GrowthBook `gb-before-tools` await occurs after `Sjo` in both 183 and 193. The visible `SendUserMessage`
   `--tools` opt-in latch (`FXp`/`Jfe`) also predates this window, so a `38_permissions` startup-ordering
   follow-up remains the right call.
6. **Auto Memory — carryover recall builders + asset-range edges.** The `m0i`/`g0i`/`VVr` private+team,
   team-only/multi-dir/read-only, and single-dir roles were re-derived from their 193 bodies and `w$t` dispatcher,
   then matched to 183 `mgi`/`Agi`/`UNr`; they remain carryover and out of the 193 behavioral delta. The
   `billiard…§2` code-snippet header range is the createElement call range (±2).
7. **System Prompt — cross-theme + lineage edges.** Delta #4 ("background launch-result no longer says 'end your
   response'") is owned by `36_background_agents` and only sanity-checked here; the v2.1.88 `computeEnvInfo`
   `constants/prompts.ts:606-648` lineage was line-by-line checked for the env scaffold and direct `OS Version` →
   `</env>` ending; the sub-agent asset sizes are quoted in the extractor's char-length convention vs `wc -c` bytes
   (load-bearing claim — 183≡193 sub-agent assets — holds on both measures).
8. **Cosmetic cross-doc naming variance.** The telemetry `lIt` variance is resolved: the deep doc now uses the same
   `envValuePreprocessor` readable name as the additions file (`lIt` at `@36039`, body
   `return e === void 0 ? void 0 : String(e);`). The Skills `yJu` before-picture is also resolved: published docs
   now cite both its 183 declaration (`:148571`) and list assignment range (`:148574-148628`). The Workflow local-var
   anchor caveat is resolved too: additions now cite declaration+use pairs for `dt`, `sr`, `Mr`, and `Ko`. No
   remaining item in this bucket affects a delta finding.

---

## 7. Overall conclusion

- **Citation accuracy:** 625 / 625 sampled v2.1.193 anchors resolved to the claimed symbol on physical re-read;
  the 42 in-place fixes were ~26 line-precision drifts, ~8 mapping-label corrections, ~2 count corrections, 2
  false-delta reclassifications, and ~4 source-text/prose fixes — **zero fabricated symbols, zero wrong tokens, zero
  wrong-direction deltas.**
- **Delta correctness:** every headline delta is corroborated at the cited 193 lines and proven absent in **both**
  183 and 156 — Tools (`"bash-path"` autocomplete, `respondToBashCommands` auto-respond, `ReadMcpResourceDirTool`
  50→51); Compaction (`Ego`→`Rxo` discriminated-union refactor, behavior-preserving); Agent Team (iTerm2 explicit
  pin, `--effort` pane inheritance, stop attribution); Auto Memory (`tengu_billiard_aviary`/`tiny_memory` full
  removal); Background (memory-pressure reaper, subagent depth-cap throw, stop-is-permanent); Permissions
  (`classifyAllShell` trust-collapse, denial-reason surfacing, sandbox credentials, org entitlement gate,
  approve-persists, named-spawn upfront deny); MCP (idle-timeout watchdog, headersHelper 401/403 reauth,
  reliability retries+backoff, login/logout CLI, name suggestions); System Prompt (env agent-proxy line, Remote
  model-change reminder, memory-prompt dedup); Workflow (StructuredOutput success-guard + retry-cap,
  `requiresStructuredOutput` inline enforcement, `/workflows` `f` filter); Slash Commands (`/rewind` before `/clear`,
  plugin `renames` auto-follow, hooks comma matcher, CLI/review/retry items); Telemetry (`assistant_response` OTEL
  event + `OTEL_LOG_ASSISTANT_RESPONSES` inheritance gate); Skills (frontmatter case tolerance, malformed-YAML
  handling, `/plugin` Skills section).
- **Framing integrity:** the two most-tempting "NET-NEW" claims were exactly the two false-deltas, both down-scoped
  to carryover with evidence (`user_kill_async`, `mcp_headers_helper`); ten further dossier over-claims/disambiguations
  (background finalizer, compact shape-only, auto-memory MEMORY.md reminder, system-prompt set-diff, permissions
  `rre` trap, slash FileChanged splitter, tools `classifyAllShell`/`compgen`) were rigorously narrowed and re-verified.
- **Compliance (this summary's own re-run):** 0 forbidden mapping tables in 47 module docs; `## Related Symbols`
  present in 47 / 47; **every relative `.md` link across the tree now resolves, 0 genuine broken** (2 stale
  `nested_subagent_depth_limit.md` links repointed to `subagent_depth_tracking.md` in place; the lone remaining
  `file.md` hit is a verbatim-quoted source-prompt example, not a link); English-only throughout.

**Overall status: PASS — HIGH confidence (12 / 12 PASS WITH FIXES).** The focused twelve-theme v2.1.183 → v2.1.193
delta analysis is substantively correct and every delta claim resolves to its cited bundle line. The fixes applied
this run are mechanical and per-theme (the line-number bumps, the mapping-label corrections, the two false-delta
reclassifications, and the two repointed cross-tree links); the §6 residuals are documentation-honest "not pinned to
one line / not the exact sub-version / not live-repro'd" caveats that would require runtime bisection or intermediate
bundles to close, not a source audit, and are carried forward unchanged.
