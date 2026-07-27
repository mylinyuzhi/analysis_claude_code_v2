# 45_skills — Skills and plugins (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
Hand-verified anchors and the trap list: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).
Carryover register: [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md).

---

## The window's story for this theme, in one paragraph

Skills and plugins account for **37 rows in the ledger below** across the 25 releases (29 with a
skills/plugins primary theme, 8 owned elsewhere but touching this surface), and they divide cleanly into
three campaigns that the changelog presents as unrelated bugfixes.

1. **Provenance hardening.** Three separate `.195`/`.207` changes stop repository-controlled files from
   influencing plugin behaviour: `${user_config.*}` may no longer reach a shell (`referencesUserConfig`,
   `:214417`, a brand-new predicate whose 193 same-named twin at `:591395 (193)` is a git-progress
   filter — a textbook symbol-reuse trap); `pluginConfigs` is read from three trusted scopes only
   (`a5g`, `:191083`); and a plugin enabled by a *committed* `settings.local.json` now needs install
   consent (`hEe({onIndeterminate:"tracked"})`, `:280665`/`:280740`). The same three-element scope list
   `["userSettings","flagSettings","policySettings"]` appears **five times** in 2.1.220 and **once** in
   2.1.193 — it became a house pattern during this window.
2. **The skill-loading pipeline got four independent repairs, each one or two statements.** Stacked
   invocations (`.199`), duplicate re-invocation (`.202`), unmatched `$N` (`.210`), and `paths:` brace
   expansion (`.217`). Three of the four are invisible to a literal-count diff: `.210` is a `return f;`
   where 193 returned `""`, `.205`'s LSP fix is a **statement-order swap with zero new strings**, and
   `.217`'s fix has a net-new literal that the foundation pass looked for under the wrong name.
3. **`context: fork` learned to background itself.** The enum member is carryover (`:149313 (193)`); the
   delta is a new `background` frontmatter field with an *inverted* default relative to the identically
   named agent field 60 lines away, plus an entire `if (isBackground) {…}` branch spliced into the fork
   dispatcher that 2.1.193 simply does not have.

The most useful finding for a reader is the **failure-direction discipline**: every new limit in this
theme fails in the least destructive direction available. Background spawn refused → run in-line. Brace
budget exhausted → use the pattern unexpanded. Sixth stacked skill → pass it as arguments with a warning.
Unmatched `$2` → leave it verbatim. Unrecognised frontmatter boolean → `undefined`, not `false`. Only two
sites in the whole theme actually throw (plugin hooks and monitors referencing `${user_config.*}`), and
both are cases where continuing would mean executing attacker-controlled text in a shell.

And the biggest **undocumented** item is not a skill at all: the `tengu_cobalt_plinth_*` gate family
(`:381688-381716`) ships **four unannounced Artifact capabilities dark** — see
[`skill_loading_and_stacking.md`](skill_loading_and_stacking.md) §5.2.

---

## Documents

| Doc | Covers | Bullets |
|---|---|---|
| [`skill_context_fork_background.md`](skill_context_fork_background.md) | the `background` frontmatter field and its polarity inversion vs the agent field; `resolveForkBackgroundMode`'s three-signal fail-closed gate; the six-way fail-open background spawn; the shadow-schema telemetry probe; the `qde` tri-state boolean coercer and why the `number` branch is the load-bearing part | `.218` ×2 |
| [`skill_loading_and_stacking.md`](skill_loading_and_stacking.md) | the stacked-skill peeler and why the cap is 5; the four-branch duplicate-invocation elider; the two preservation strategies for unmatched `$N`; the recursion→worklist brace-expansion rewrite with its two-axis shared budget; the bundled `/dataviz` skill, its OKLab validator, and the gate-injected cross-skill callout; the `verify` skill's edit gate; the plugin-prefix display fix; **§8** the bundled `claude-api` skill's Opus 5 default — the `{{VAR}}` substituter, the one-deep generational ring, and the provider-alias blind spot | `.199`, `.202`, `.205` ×1, `.210` ×2, `.216` ×2, `.217` ×1, `.198`, `.219` |
| [`plugin_config_and_security.md`](plugin_config_and_security.md) | the `${user_config.*}` detector and its three call sites (two removals, one never-existed); `pluginConfigs` scope narrowing; the `.195` consent gate and the `onIndeterminate` probe; the `--settings` fold-in; the LSP registration-order fix; agent-name `:` rejection with NFKC; the LSP disuse grace; the tip impression cap; six honestly-unanchored bullets | `.195` ×2, `.196` ×2, `.205` ×1, `.206`, `.203`, `.207` ×2, `.210` ×1, `.214`, `.217` ×1, `.218` ×1 |

New symbols are staged in
[`../00_overview/symbol_additions_v2_1_220_skills_plugins.md`](../00_overview/symbol_additions_v2_1_220_skills_plugins.md)
for merge into `symbol_index_core_features.md` (skills) and `symbol_index_infra_integration.md` (plugins,
LSP, slash commands).

---

## Per-bullet ledger

Every changelog bullet in `.195`–`.220` whose primary or secondary theme is skills or plugins.

Verdicts: **NET_NEW** (new mechanism, 193=0 proven) · **DELTA** (existing mechanism, changed constant /
list / statement / control flow) · **CARRYOVER** (bullet describes pre-existing code) · **UNANCHORED**
(no anchor isolated in 2.1.220) · **OTHER MODULE**.

Counts in the Anchor column are `220 / 193` for the named literal.

| # | Ver | Bullet (abridged) | Verdict | Anchor (2.1.220) | Doc section |
|---|---|---|---|---|---|
| 1 | `.195` | external plugins enabled only by project `.claude/settings.json` need install consent on every loader path | **NET_NEW** (`projectSettings` exclusion is CARRYOVER) | `onIndeterminate` **7 / 0**; new gate `:280661-280679`; tightened predicate `:280738-280740` vs `:479662-479664 (193)`; `hEe` `:535971` | plugin §3 |
| 2 | `.195` | `/plugin` Enable/Disable broken when `plugin.json` `name` ≠ marketplace entry name | **UNANCHORED** | `plugin.json` 60 / 52; `marketplace` 855 / 816; `renamedTo` 5 / 5 — all carryover | plugin §9 |
| 3 | `.196` | `claude plugin validate` skipping local plugins whose source is `"."` | **CARRYOVER** (per `_false_delta_ledger`) | `plugin validate` **7 / 7** | not covered |
| 4 | `.196` | plugin dependency version pins ignored with a local-folder marketplace | **UNANCHORED** | `resolvedVersion` **10 / 10**; `versionPin`/`pinnedVersion` 0 / 0; candidates `:280693`, `:278961` | plugin §9 |
| 5 | `.198` | added `/dataviz` skill with a runnable colour-palette validator | **NET_NEW** | `bvo = "dataviz"` `:318659`; registration `Oom` `:777520-777543`; nine-file bundle `c8S` `:777505-777515`; `OKLab` **16 / 0** | loading §5 |
| 6 | `.199` | stacked `/skill-a /skill-b do XYZ` loads all leading skills (up to 5) | **NET_NEW** | `tengu_stacked_slash_commands` **1 / 0** `:343685`; `tpd` `:343833`; `epd = 5` `:344087`; `stackedExpansion` **8 / 0** | loading §1 |
| 7 | `.200` | `claude agents --plugin-dir <dir>` ignored when the flag follows `agents` | OWNED BY `43_slash_commands` | ⚠ re-measured **2 / 1** (not 1/0 — `193:718546` ≡ `220:872437`); true delta = 3 inserted lines `:865021-865023` | [../43_slash_commands/command_and_flag_deltas.md](../43_slash_commands/command_and_flag_deltas.md) §1.6 |
| 8 | `.200` | project-scoped plugins not loading from git worktrees of the same repo | **UNANCHORED** | `pluginRoots`/`projectPlugins`/`gitCommonDir` 0 / 0 | not covered |
| 9 | `.202` | re-invoking an already-loaded skill appended a duplicate copy of its instructions | **NET_NEW** (scoping's `already loaded` probe is a decoy) | `Skill /… is already loaded above` **1 / 0** `:346767`; `ZNy` `:346748`; `priorContent` **2 / 0** | loading §2 |
| 10 | `.203` | LSP-only plugins incorrectly flagged for disuse | **NET_NEW** | `serves code navigation` **1 / 0** `:785743` | plugin §7 |
| 11 | `.205` | a failing plugin LSP server blocked another plugin's valid server for the same extension | **NET_NEW** (statement-order swap; **zero new literals**) | `:307210-307224` vs `:298343-298357 (193)`; resolver `c` `:307244-307251` | plugin §5 |
| 12 | `.205` | project verify skills rewritten every session instead of only on a documented-command change | **DELTA** (prompt text only) | `Routine learnings` **1 / 0** `:789373`; `verify/SKILL.md` **3 / 0**; 193 before-text `:661758-661761 (193)` | loading §6 |
| 13 | `.206` | false "disused plugin" tips and skewed disuse telemetry for LSP plugins | **NET_NEW** | `pluginUsageLspGraceAppliedIds` **3 / 0** `:214905`; `hCu` `:214904`; caller `:215060-215061` | plugin §7 |
| 14 | `.207` | `${user_config.*}` in shell-form plugin hooks / monitors / `headersHelper` rejected | **NET_NEW predicate**; hooks + monitors are removals, `headersHelper` **never substituted in 193** | `lor` `:214417` (**193's `lor` at `:591395 (193)` is unrelated**); `:519965-519972`, `:764145-764149`, `:268206-268216` | plugin §1 |
| 15 | `.207` | `pluginConfigs` no longer read from project-level `.claude/settings.json` | **NET_NEW** (also drops `localSettings`, which the bullet omits) | `a5g` **1 / 0** `:191083`; `Yzr` `:191064`; 193 read `jo()` = merged settings `:279505 (193)` | plugin §2 |
| 16 | `.207` | malformed bracket patterns in rules globs / **skill paths** / `.ignore` / `.worktreeinclude` | OTHER MODULE (permissions) | `tengu_uncompilable_ignore_pattern` `:224144` **1 / 0** | loading §4 (cross-ref) |
| 17 | `.208` | SDK sessions losing `initialize`-defined agents when a plugin refresh ran first | OTHER MODULE (headless_sdk) | — | plugin §9 |
| 18 | `.210` | unmatched `$1`/`$2` positional placeholders silently stripped; now preserved verbatim | **NET_NEW** (two-line control-flow change) | `if (s[g] === void 0) return f;` **1 / 0** `:237732`; sentinel guard `if (u \|\| p)` `:237743` vs `if (u)` `:298904 (193)` | loading §3 |
| 19 | `.210` | plugin cache writes leaving temp files; locked-file renames on Windows/NFS | **UNANCHORED** | `renameWithRetry` 0 / 0; retry set `jue` `:49993` ≡ `SBe` `:46613 (193)`; candidate `Fbs` `:278485` | plugin §9 |
| 20 | `.210` | plugin-provided MCP servers torn down on MCP re-sync | OTHER MODULE (mcp) | — | plugin §9 |
| 21 | `.210` | bundled dataviz skill: OKLab colour difference + recalibrated CVD thresholds | **NET_NEW text, NOT separable from `.198`** | `OKLab` **16 / 0**; thresholds `:776235-776237`; validator `:777100-777175` | loading §5 |
| 22 | `.211` | plugin MCP servers not reconnecting after an idle web session woke | OTHER MODULE (mcp) | `ensureConnected` 19 / 15 — count drift only | not covered |
| 23 | `.211` | hardened synced skill/plugin dir naming on Windows; CCR proxies survive `/clear` | **NET_NEW gate only** | `tengu_skills_sync_manifest_failed` **1 / 0**; `tengu_plugins_sync_manifest_failed` **1 / 0** | plugin §9 |
| 24 | `.212` | @-mentions after partial read; **plugin uninstall wrong marketplace**; false "Command timed out" | **CARRYOVER-trap** (3-in-1 bullet) | `uninstall` 74 / 69; `Command timed out` 1 / 1 | not covered |
| 25 | `.214` | plugins enabled via `--settings` not loading (regression since 2.1.181) | **NET_NEW** (five-line block) | `:277785-277789` vs `:477403-477425 (193)`; `C8` `:57679`; `YI` `:237995` | plugin §4 |
| 26 | `.215` | Claude no longer runs `/verify` and `/code-review` on its own | OTHER MODULE (code_review) | `disable-model-invocation` 11 / 7 | loading §6 (note) |
| 27 | `.216` | skills/commands changed mid-session not appearing in the slash menu | **NET_NEW gate only** | `tengu_skills_sync_manifest_failed` **1 / 0** | plugin §9 |
| 28 | `.216` | plugin skills with a `name` frontmatter field losing their plugin prefix | **NET_NEW** (three added expressions) | `:270585-270588` + `userFacingName` `:270636-270638` vs `:474884` / `:474930-474932 (193)` | loading §7 |
| 29 | `.216` | bundled dataviz skill: palette reorder + direct-label guidance | **NET_NEW text, NOT separable from `.198`** | `:776231`, `:776321`, `:776622` | loading §5 |
| 30 | `.217` | `CLAUDE.md`/`SKILL.md` `paths` frontmatter brace groups OOM-killing startup | **NET_NEW** (`_false_delta_ledger` calls this unanchorable — it is not) | `Brace pattern expansion exceeds the budget` **1 / 0** `:158177`; `BIg` `:158159`; `NIg=1000`/`FIg=4194304` `:158227-158228`; 193 recursion `Qxi` `:149557-149571 (193)` | loading §4 |
| 31 | `.217` | frontend-design plugin tip capped at 3 lifetime impressions | **DELTA** (one property) | `maxLifetimeShows` **6 / 3**; entry `:815590-815598` vs `:683021-683028 (193)`; filter `:814944` carryover | plugin §8 |
| 32 | `.218` | agent markdown files reject agent names containing `:` | **NET_NEW** | `reserved for plugin namespacing` **2 / 0** `:269872`, `:269957`; NFKC normalise | plugin §6 |
| 33 | `.218` | skills with `context: fork` run in the background by default; `background: false` opts out | **NET_NEW** (`context: fork` itself **3 / 2 CARRYOVER**) | `Forks run as background agents` **1 / 0** `:157797`; `qTo` `:342396`; `forkedSkillName` **22 / 0**; 193 dispatcher `A9p` `:397679 (193)` has no branch | fork §1–2 |
| 34 | `.218` | `yes`/`no`/`on`/`off`/`1`/`0` accepted for skill and plugin frontmatter booleans | **NET_NEW** (word lists are **1 / 1 carryover**) | `qde` `:158204`; `Yt`/`su` `:1950-1961` ≡ `:1938`/`:1944 (193)`; 193 `aje`/`drt` `:149589-149596 (193)` | fork §3 |
| 35 | `.218` | agent frontmatter hooks require the agent file's folder to have accepted workspace trust | OTHER MODULE (agent_team / permissions) | `tengu_agent_hooks_origin_untrusted` (new-gate list) | not covered |
| 36 | `.218` | plugin/settings panels not moving the terminal cursor to the focused row | OTHER MODULE (accessibility_ui) | `focusedRow` 0 / 0 | not covered |
| 37 | `.219` | `claude-api` skill defaults to Claude Opus 5, with a migration path from Opus 4.8 | **NET_NEW data in a CARRYOVER mechanism** (owned here; was cycle C2 in `_xval_contradictions.md` §2) | `PREV_OPUS_ID` **10 / 0**, `PREV_OPUS_NAME` **14 / 0**, `SONNET_NEXT_ID` **27 / 0**, `claude-opus-5` **42 / 0**, `Migrating to {{OPUS_NAME}}` **9 / 0**; table `QzS` `:799615-799631` vs `Esm` `:671821-671833 (193)`; substituter `ucl` `:799732-799738`; `SKILL_MODEL_VARS` **3 / 3** | loading §8 |

**Tally:** 37 rows. **NET_NEW 21** · **DELTA 2** · **CARRYOVER 2** · **UNANCHORED 4** · **OTHER MODULE 8**.
(Three of the eight OTHER-MODULE rows — `.208` #17, `.210` #20, `.211` #23 — are additionally listed in
`plugin_config_and_security.md` §9 because a plugin-side probe was run and came back empty.)

### The three carryover traps this module caught

| Bullet | Trap | Proof |
|---|---|---|
| `.218` `context: fork` | The enum member is 3 / 2. Only the `background` field and the dispatcher branch are new. | `:157788-157792` vs `:149313-149316 (193)`, byte-identical; `agent:` companion likewise |
| `.218` frontmatter booleans | The accepted-token vocabulary is 1 / 1 — it is the **env-var** parser, unchanged since 193. What is new is the `typeof e === "number"` admission that lets YAML-parsed `1`/`0` reach it. | `["1","true","yes","on"]` `:1954` ≡ `:1938 (193)` |
| `.207` `${user_config.*}` | `function lor(` is **1 / 1** and looks like carryover. 193's `lor` (`:591395 (193)`) is a git-progress line filter — a re-mangled identifier, `_CONVENTIONS` §4 trap #1. | the two functions share nothing but their name |

### The two ledger corrections this module makes

1. **`.217` brace expansion is anchorable.** `../00_overview/_false_delta_ledger.md` records it as
   unanchorable on the grounds that `brace expansion` is 1 / 1 (the Bash parser at `:211144`) and
   `maxPatterns`/`pattern budget`/`expandedCount` are 0 / 0. All of that is true, and the fix is still
   findable: grep `Brace pattern expansion exceeds the budget` (**220=1 / 193=0**, `:158177`). The full
   recursion→worklist rewrite is in [`skill_loading_and_stacking.md`](skill_loading_and_stacking.md) §4.
2. **`.207`'s `headersHelper` half is not a removal.** 2.1.193's plugin MCP resolver
   (`:279780-279793 (193)`) does not touch `headersHelper` at all — there was no substitution to remove.
   2.1.220 *adds* plugin-var and env-var expansion to the field (`:268213-268215`) and carves
   `${user_config.*}` out of the new capability. The hooks and monitor halves *are* genuine removals.

---

## Where the code lives

| Region | Contents |
|---|---|
| `:157707-157972` | skill / agent / output-style **frontmatter shadow schemas**, the canonical-key list `DIg`, the drift telemetry probe `uRt` |
| `:157974-158238` | YAML parse (`Lp` `:158070`), lossy-value quoting (`$Ig` `:158018`), **brace expansion** (`Zno`/`bru`/`BIg` `:158136-158183`), the **boolean coercers** (`otr`/`qde` `:158201-158211`), budget constants `:158227-158228` |
| `:214398-214431` | plugin-variable and `${user_config.*}` substitution + the new `referencesUserConfig` detector |
| `:214890-215100` | plugin usage / disuse accounting, the **LSP grace** `hCu` |
| `:237706-237746` | `$ARGUMENTS` / `$N` **argument substitution** |
| `:268100-268260` | plugin **MCP server** config resolution (`headersHelper` branch at `:268205`) |
| `:269860-270000` | **agent** markdown loading and name validation |
| `:270500-271250` | **plugin** skill/command and output-style loading |
| `:277660-281200` | plugin **install / enable / sync / consent** (`Ggy` `:277771`, loader `:280600-280760`) |
| `:303600-303790`, `:307190-307280` | **LSP** plugin server config and the server registry |
| `:318657-318669` | built-in skill **id constants** (`artifact-design`, `artifact-capabilities`, `dataviz`, `verify`, …) |
| `:342100-344100` | **fork dispatch** (`qTo` `:342396`, `VTo` `:342400`, `aNy` `:343059`), slash dispatch, **stacked-command peeler** `:343833`, `epd = 5` `:344087` |
| `:346500-347150` | the **Skill tool** and the **duplicate-invocation elider** `:346748` |
| `:381680-381720` | the **`tengu_cobalt_plinth_*` Artifact gate family** |
| `:438430-438600` | filesystem **SKILL.md** loading (`sn_` `:438436`, `jFs` `:438444`, `tcn` `:438492`) |
| `:519920-520030` | plugin **hook command** construction (the `.207` refusal at `:519965`) |
| `:764143-764180` | plugin **monitor** resolution (the `.207` refusal at `:764145`) |
| `:772000-777550`, `:785700-789600` | **embedded skill bundles**: `artifact-design`, `dataviz` (+ 9 files), plugin-dev, disuse review, `verify` |
| `:814900-815700` | the **tip framework** and the frontend-design plugin suggestion |

---

## Not covered

- `.196` `claude plugin validate` (`plugin validate` 7 / 7 — recorded as carryover by the foundation pass,
  not re-derived here).
- `.200` project-scoped plugins in git worktrees (0 / 0 on every probe).
- `.212` the three-in-one bullet including plugin-uninstall marketplace targeting.
- The `SuggestSkills` / `SuggestPluginInstall` / `ListSkills` / `SearchSkills` / `propose_skills` tool
  surfaces (`file_index.md` §5.1–5.2) — new tools, owned by `04_tools`.
- `.218` agent-frontmatter-hook workspace trust — the trust half belongs to `38_permissions`, the agent
  half to `30_agent_team`.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> Everything discovered in this module is staged in
> [symbol_additions_v2_1_220_skills_plugins.md](../00_overview/symbol_additions_v2_1_220_skills_plugins.md).

Key functions across this module:
- `resolveForkBackgroundMode` (`qTo`, `:342396`) - `.218` background default
- `spawnForkedSkillAsBackgroundAgent` (`VTo`, `:342400`) - fail-open background spawn
- `coerceFrontmatterBoolean` (`qde`, `:158204`) - `.218` tri-state boolean coercion
- `peelStackedPromptCommands` (`tpd`, `:343833`) - `.199` stacked skills, cap `epd = 5`
- `elideDuplicateSkillInvocation` (`ZNy`, `:346748`) - `.202` re-invocation elision
- `substituteCommandArguments` (`vct`, `:237706`) - `.210` positional-placeholder preservation
- `expandBracePatterns` (`BIg`, `:158159`) - `.217` budget-bounded `paths:` expansion
- `referencesUserConfig` (`lor`, `:214417`) - `.207` shell-injection detector
- `readTrustedPluginConfig` (`Yzr`, `:191064`) - `.207` `pluginConfigs` scope narrowing
- `isLocalSettingsRepoTracked` (`hEe`, `:535971`) - `.195` consent probe
- `syncInstalledPluginsFromSettings` (`Ggy`, `:277771`) - `.214` `--settings` fold-in
- `applyLspDisuseGraceOnce` (`hCu`, `:214904`) - `.206`/`.203` disuse grace
- `registerDatavizSkill` (`Oom`, `:777520`) - `.198` `/dataviz`
- `buildDatavizCalloutForArtifactDesign` (`F6S`, `:772270`) - gate-injected cross-skill pointer
