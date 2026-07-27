# File Index — v2.1.220 extracted build ("what is in the build, and where")

The **navigation reference** for the Claude Code **v2.1.220** extract produced by `claude-code-bomb`.
It answers three questions: (1) what did the extractor produce and how big is it, (2) which of those
artefacts can I trust and which will lie to me, (3) given a feature, which line region of
`cli_inner_pretty.js` do I open.

> **Every number here was measured by the author** (`wc -l`, `stat -c%s`, `grep -c`, `json.load(...)`
> over the asset files), not copied from another tree; every line number was read in the **2.1.220**
> bundle. Baselines are tagged `(193)` / `(183)`. Read
> [`../_CONVENTIONS.md`](../_CONVENTIONS.md) first — §1 (bundles), §3 (citation rule), §4 (traps).

**Scope note.** This file is a **bundle map, not a doc map** — it indexes what lives *where in the
2.1.220 bundle*, so an analyst can start from a line range instead of from scratch.

> ℹ️ It was written before the analysis passes ran, when the theme dirs were still empty. **The tree is
> now complete** — 26 theme dirs / 111 module docs, 25 `by_version/` release files, and four
> `symbol_index_*.md` files. For a *document* map use [`README.md`](README.md) (overview layer) or
> [`../README.md`](../README.md) (whole tree); to go from a changelog bullet to code use
> [`changelog_to_code_map.md`](changelog_to_code_map.md). The bundle landmark table below is unaffected
> by that and remains current for the 2.1.220 build.

---

## 1. Build identity

From `/lyz/codespace/claude-code-bomb/versions/<v>/metadata.json`:

| Field | **2.1.220** | 2.1.193 | 2.1.183 |
|-------|-------------|---------|---------|
| `version` | `2.1.220` | `2.1.193` | `2.1.183` |
| `build_sha` | `4073f59596e272f39393db4f96abc5f4b10eff21` (short `4073f595`) | `a1938d2a07a2e4fecbef4eeac813221929e97d22` | `9d251abdbce0c0a6190d290add83634e0ab481f6` |
| `build_time` | `2026-07-24T22:17:45Z` | `2026-06-25T18:18:11Z` | `2026-06-18T23:04:10Z` |
| `bun_runtime` | `1.4.0 (f6d0fcd24)` | `1.4.0 (fe06227f0)` | `1.4.0 (324c5f012)` |
| `platform` | `linux-x64` | `linux-x64` | `linux-x64` |
| `binary_size` | **275,012,592 B** (262.3 MiB) | 240,556,856 B | 233,584,424 B |
| `bun_section_size` | **188,646,561 B** (179.9 MiB) | 154,394,334 B | 150,181,522 B |
| `module_count` | 3 | 3 | 3 |
| `tools_extracted` | 65 | 51 | 50 |
| `decls_extracted` | 49,263 | 40,494 | 38,762 |

Deltas 193 → 220: `binary_size` **+34,455,736 B (+14.3 %)**, `bun_section_size`
**+34,252,227 B (+22.2 %)**, `decls_extracted` **+8,769 (+21.7 %)**. Same Bun major/minor (`1.4.0`)
across all three builds, different Bun revision hash each time — so none of the growth is a runtime
upgrade; it is all first-party code. `tools_extracted` is simply the count of `assets/tools/*.md` files
the extractor wrote — **not** a count of real tools (see §5).

The version/build triple is also inlined *into the bundle itself*, at `cli_inner_pretty.js:9`
(`// Version: 2.1.220`) and in the constant object first emitted at `cli_inner_pretty.js:226`
(`VERSION: "2.1.220"`, `BUILD_TIME`, `GIT_SHA`). Bun re-inlines that object at every use site, so
`grep -c 'VERSION: "2.1.220"'` returns hundreds of hits — never use it as a uniqueness anchor.

---

## 2. Bundle size

`extract/cli_inner_pretty.js` — one pretty-printed file per build. Counts from `wc -l` / `stat -c%s`:

| Build | Lines | Bytes | Δ lines vs prev | Δ % lines | Δ bytes | Δ % bytes |
|-------|-------|-------|-----------------|-----------|---------|-----------|
| 2.1.183 | 699,346 | 23,659,370 | — | — | — | — |
| 2.1.193 | 718,679 | 24,097,739 | +19,333 | +2.76 % | +438,369 | +1.85 % |
| **2.1.220** | **872,596** | **29,422,342** | **+153,917** | **+21.42 %** | **+5,324,603** | **+22.09 %** |

Cumulative 183 → 220: **+173,250 lines (+24.77 %)**, **+5,762,972 bytes (+24.36 %)**. Normalising by
build date (29 days for this window, 7 for the last): **5,307 new lines/day vs 2,762** — so the rate
roughly doubled, on top of a 4× longer window. Mean bytes/line is stable (33.53 → 33.72), so this is
genuinely more code, not reformatting.

`assets/_summary.json.source_size` reports 29,422,270 for 220 (72 B below `stat`) — the extractor
measures the string it read, not the file; prefer `stat`. Also present:
`cli_inner_pretty.js.PLACEHOLDER.md` (295 B), a git-ignore note on regenerating the bundle.

---

## 3. Decl inventory (`cli_unpack_pretty/`)

```
extract/cli_unpack_pretty/
├─ _manifest.json     5,171,041 B — 49,263 records of {file, name, kind, bytes}
├─ _summary.json      2 B — literally "[]"  (EMPTY; same in 193)
└─ decls/
   ├─ functions/      20,588 files
   ├─ vars/           27,748 files
   ├─ classes/           310 files
   ├─ ExpressionStatement/ 611 files
   └─ IfStatement/         1 file
```

Counts per `kind`, straight out of `_manifest.json`:

| kind | **2.1.220** | 2.1.193 | Δ | Δ % |
|------|-------------|---------|---|-----|
| `fn-decl` | 20,588 | 16,285 | +4,303 | +26.4 % |
| `var-decl` | 13,929 | 11,547 | +2,382 | +20.6 % |
| `var-decl-empty` | 13,824 | 11,892 | +1,932 | +16.2 % |
| `ExpressionStatement` | 611 | 487 | +124 | +25.5 % |
| `class-decl` | 310 | 282 | +28 | +9.9 % |
| `IfStatement` | 1 | 1 | 0 | — |
| **total** | **49,263** | **40,494** | **+8,769** | **+21.7 %** |

**`_summary.json` is `[]` in this build** (as in 193) — always compute counts from `_manifest.json`.

### How to use the per-decl files

```bash
X=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_unpack_pretty
cat $X/decls/vars/ZB.js          # -> ZB = "ReportFindings";
cat $X/decls/functions/Bi.js     # -> the whole tool-factory, isolated
python3 -c "import json;m=json.load(open('$X/_manifest.json'));
print(next(e for e in m if e['name']=='wMi'))"   # kind + bytes for one decl
```

The filename is the obfuscated id, so once you have the id you have the file. `_manifest.json` also
gives you a cheap **size ranking** — the largest decls in 220 are `vars/qMo.js` (202,366 B),
`vars/Klm.js` (178,677 B), `vars/FDp.js` (165,110 B); the largest function is `functions/wMi.js`
(37,921 B — the root settings zod schema, §6).

### Two navigation hazards in `decls/` (measured; not in `_CONVENTIONS.md`)

1. **All 13,824 `var-decl-empty` files are ≤ 3 bytes** (max `bytes` over that kind = 3). They are the
   *hoisted declaration only*; the value is assigned inside the sibling Bun lazy-module initializer
   `var <mod> = S(() => { <name> = … })`. The worst case is the model catalogue: `decls/vars/Skl.js`
   contains exactly `Skl;`, while the real 500-line catalogue object lives in
   `decls/vars/bkl.js` (`bkl = S(() => { Skl = { "//": "Hand-maintained baked-in model catalog…"`).
   **28 % of all decl files are therefore stubs.** When a decl file is a stub, grep the bundle for
   `  <name> = ` (two-space indent, inside the module wrapper) to find the assigning module.
2. **Colliding names silently overwrite.** `_manifest.json` has 49,263 records but only 49,258 distinct
   `file` values: `decls/vars/MS.js` is claimed by **6** separate `var-decl-empty` records (193 has the
   same defect with `decls/vars/vg.js`). Any collided file holds only the last writer.

---

## 4. Asset inventory and how much to trust it

`extract/assets/` — real counts, measured by loading each file:

| Asset | **2.1.220** | 2.1.193 | Trustworthy? |
|-------|-------------|---------|--------------|
| `_summary.json` | 12 keys | 12 keys | ✅ as a *summary of the other assets*; `source_size` is 72 B low |
| `prompts/` + `prompts_index.json` | **578** files / 2,935,889 chars | 419 / 1,984,300 | ⚠️ complete, but **mis-named** — the biggest "prompts" are bundled skill docs and embedded scripts (§4.4) |
| `system_prompts/` | **11** files (`01_identity`, 3 × `02_builder_*`, 1 × `03_env_template`, 4 × `04_subagent_*`, `05_reminders`, `_index`) | 12 (5 × `04_subagent_*`) | ✅ small and hand-checkable; the subagent-prompt bucket went 5 → 4 |
| `tools/` | **66** files (65 `.md` + `_index.json`) | 52 (51 + `_index.json`) | ⚠️ see §5 — `_index.json` is the usable list, but 4 of its rows carry no literal name (2 factories + 2 templates) and 1 `.md` has no row at all |
| `tools_index.json` (top level) | **1** entry | 1 entry | ❌ **BROKEN in both builds** (§4.1) |
| `slash_commands.json` | **133** | 126 | ❌ **path/URL-noisy AND incomplete** (§4.3) |
| `env_vars.json` | `{all: 567, claude_anthropic: 252, bun: 0, node: 3}` | `{all: 683, claude_anthropic: 328, bun: 1, node: 3}` | ❌ **worst asset in this build** (§4.2) |
| `cli_flags.json` | `{flags: 934, subcommands: 0}` | `{flags: 885, subcommands: 0}` | ⚠️ 32/33 coverage of `new id("--…")` options; `subcommands` bucket empty (§4.5) |
| `feature_gates.json` | **1,731** | 1,447 | ⚠️ 1,710 are real `tengu_*`; **21 are not gates at all** (§4.6) |
| `endpoints.json` | `{total_urls: 470, by_host: 136}` | `{416, 127}` | ✅ plausible; top hosts `platform.claude.com` 82, `code.claude.com` 55, `github.com` 53, `claude.ai` 23 |
| `long_strings/` | **50** files | 50 | ✅ fixed-size top-N dump, not a count of anything |

Net asset deltas: gates **+284** (326 new / 42 gone per
[`_raw_asset_diff_193_to_220.md`](_raw_asset_diff_193_to_220.md) — 1447 + 326 − 42 = 1731 ✔),
flags **+49** (51 new / 2 gone ✔), env `all` **−116** (47 new / 163 gone ✔), prompts **+159 (+38 %)**,
prompt chars **+951,589 (+48 %)**.

### 4.1 `assets/tools_index.json` is broken (verified)

Both builds contain exactly one record, and it is not a tool:
`[ { "name": "explain_command", "descriptionLen": 41, "offset": 24814269 } ]`. `explain_command` is a
**one-shot Anthropic-API `tool_choice`** used by the bash-explain feature, not a registered agent tool:
`tool_choice: { type: "tool", name: "explain_command" }` at `cli_inner_pretty.js:767824`, inline schema
at `:767891`. Count is **220=2 / 193=2** — pure carryover noise. Use `assets/tools/_index.json` instead.

### 4.2 `assets/env_vars.json` lost 163 entries and gained obfuscated ids (verified)

`all` went **683 → 567**: 47 added, 163 removed. Breaking that down:

- **Of the 163 removed, 128 look like env vars** (`^[A-Z][A-Z0-9_]*$`). I grepped each of those 128 in
  the 220 bundle: **124 are still live**; only **4** genuinely disappeared
  (`CLAUDE_BRIDGE_USE_CCR_V2`, `CLAUDE_CODE_SHOJI_ENGINE`, `CLAUDE_CODE_VERIFY_PROMPT`,
  `SRT_WIN_PATH`). So the "loss" is ~97 % extractor regression, ~3 % real removal.
- Concrete proof — each of these is **absent from `env_vars.json.all` yet grep-live in the 220 bundle**
  (`grep -c` count, first site): `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` 4 @`cli_inner_pretty.js:31105`;
  `ANTHROPIC_BETAS` 2 @`:32832`; `CLAUDE_CODE_ENABLE_AUTO_MODE` 3 @`:58030`; `CLAUDE_CODE_SANDBOXED`
  3 @`:32083`; `ANTHROPIC_DEFAULT_OPUS_MODEL` 51 @`:32707`; `CLAUDE_CODE_MAX_CONTEXT_TOKENS` 4 @`:32816`.
- **Of the 47 added, 35 are obfuscated identifiers, not env vars**: `AUl BGh CCg DOh Eql FGh GBh K8c
  KPh KWn LOh LQl Nic Oul RQl Sql UWn Uwh WBh Y8c YPh YWn _Ru __r bVr bql d jWn jwh oKl qPh uOi vql
  zIr zPh`. Only 12 of the 47 are plausible new env vars (`CLAUDE_CODE_USE_GATEWAY`,
  `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD`, `CLAUDE_GATEWAY_ALLOW_LOOPBACK`,
  `CLAUDE_CODE_BRIDGE_SESSION_ID`, `CLAUDE_CODE_REFUSAL_FALLBACK_CATCH_ALL`,
  `CLAUDE_INTERNAL_FC_OVERRIDES`, `CLAUDE_RUNNER_ACTIVITY_FD`, `CLAUDE_BRIDGE_REATTACH_GROUPING`,
  `CCR_ON_BRANCH_DEFAULT_GUARD`, `GIT_CONFIG_GLOBAL`, `TMPDIR`, `DN`) — and even those must be grepped.
- Overall, **65 of the 567 entries in 220 fail an env-var-shape test** (`ConEmuANSI`, `ProgramFiles`,
  `http_proxy`, and bare single letters `a c d e f i m n o r s t`). 193 had exactly the same count (65),
  so the *shape* noise is constant; the *loss* is new.

**Rule: `env_vars.json` may be used to generate candidates, never to prove presence or absence.**

### 4.3 `assets/slash_commands.json` is noisy *and* incomplete (verified)

133 entries, of which a large fraction are filesystem paths (`/bin /etc /opt /proc /sbin /tmp /usr
/var /lib`), shells (`/sh /zsh /fish`), and **AWS Bedrock REST paths** the `/`-leading heuristic
swallowed (`/foundation-models`, `/inference-profiles`, `/model-invocation-jobs`,
`/provisioned-model-throughputs`, `/guardrails`, `/automated-reasoning-policies`, `/evaluation-jobs`,
`/prompt-routers`, `/use-case-for-model-access`, …).

The **inverse** defect is worse and is *not* recorded in `_CONVENTIONS.md`: real commands are missing.
All fifteen of `/agents /bg /background /doctor /resume /review /code-review /todos /vim
/terminal-setup /upgrade /cost /release-notes /add-dir /ide` are **absent from the 133-entry list**,
yet their definitions are in the bundle — e.g. `name: "agents"` at `cli_inner_pretty.js:500597`,
`name: "doctor"` at `:785857`, `{ type: "local-jsx", name: "add-dir", … }` at `:226501`, and the
`code-review` id constants at `:231212` / `:318660`.

**Rule: confirm a slash command at its definition site (§6), never from this list.**

### 4.4 `assets/prompts/` over-counts model-facing prompts

`prompts_index.json` is 578 × `{file, len, offset, headline}`, `offset` being a **byte offset into
`cli_inner_pretty.js`** — which makes it a genuinely useful locator. But the top of the size ranking
shows what the corpus actually contains (offsets converted to lines by me):

| Line | len | What it really is |
|------|-----|-------------------|
| `:795962` | 173,985 | the `claude-api` skill's *Model Migration Guide* reference doc |
| `:376708` / `:373944` | 115,489 / 109,103 | `workshoppage` / `workshop` skill HTML templates |
| `:443294` | 73,173 | code-review/security-review skill "Environment / slots" prompt |
| `:794465` | 69,729 | *Building LLM-Powered Applications with Claude* reference doc |
| `:777910` / `:777914` | 69,070 / 55,444 | design-system Storybook doc, and an embedded `#!/usr/bin/env node` React→DS converter script |

So the +159 prompt growth is dominated by **bundled skill payloads**, not by system-prompt changes. For
the true system-prompt surface use `assets/system_prompts/` (11 files) plus the anchors in §6.

### 4.5 `assets/cli_flags.json` — one confirmed miss

934 flags. I extracted every `new id("--…")` commander option from the bundle (33 distinct) and
diffed: **32 are present, 1 is missing** — `--teammate-mode`, registered at
`cli_inner_pretty.js:851381` as
`new id("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "iterm2", "in-process", or "auto"')`.
Interesting in its own right: in 193 this flag was *constructed at runtime* by the inherited-flag
builder; in 220 it is a first-class registered option and the extractor *still* misses it.
`subcommands` is `0` in both builds — an extractor categorisation quirk, not a feature removal.

### 4.6 `assets/feature_gates.json` — 21 non-gates (new defect, not in `_CONVENTIONS.md`)

1,731 entries, **1,710** of which start with `tengu_`. The other 21 are not gates:

- **entrypoint names**: `claude_code_cli claude_code_vscode claude_code_remote claude_code_sdk
  claude_code_mcp claude_code_github_action claude_code_local_agent claude_code_guest_pass`
  — these are the return values of the entrypoint classifier at `cli_inner_pretty.js:182-207`.
- **telemetry reason strings**: `gate_denied gate_error gate_skip gate_blocked gate_default gate_off
  feature_disabled feature_not_enabled_for_org feature_unavailable feature_support
  feature_flag_writes feature_of_the_week exp_mod_normal`. Proof: `gate_denied` / `gate_error` appear
  only as the second argument of a telemetry call — `$e("agent_observer_delivery", "gate_denied")` at
  `cli_inner_pretty.js:317446` and `"gate_error"` at `:317450`.

That is ~1.2 % noise, so the asset is broadly usable — but a "new gate" claim on any `feature_*` /
`gate_*` / `claude_code_*` name must be grepped.

---

## 5. Tool surface (authoritative: `assets/tools/_index.json`, 65 entries)

Each record is `{name, userFacingName, searchHint, descriptionLen, promptLen, schemaLen, isReadOnly,
isConcurrencySafe, offset}`. **`offset` is a byte offset into `cli_inner_pretty.js` and lands within
±5 lines of the tool's `Bi({ … })` call** — I verified this for `Bash`, `Read` and `Agent`. All tools
are built by the same factory: `function Bi(e)` at `cli_inner_pretty.js:224053`.

**65 records → 64 distinct names** (`<unknown>` appears twice). **Zero 193 tool names disappeared.**

### 5.1 The 13 candidate new names — all confirmed NET-NEW (`193=0`)

| Tool | 220 grep | 193 grep | Name constant | Tool object (`Bi({`) |
|------|----------|----------|---------------|----------------------|
| `ReportFindings` | 1 | **0** | `var ZB = "ReportFindings"` `:403821` | `:403877`, `name: ZB` `:403878`, `searchHint` `:403879` |
| `SendFeedback` | 6 | **0** | `var rTd = "SendFeedback"` `:404669` | `:404722`, `name: rTd` `:404723` |
| `RefreshMcpTools` | 3 | **0** | `var Hpe = "RefreshMcpTools"` `:231346` | `:405748` (`KOs = Bi({`), `name: Hpe` `:405758` |
| `SearchMcpRegistry` | 7 | **0** | `var r1s = "SearchMcpRegistry"` `:408111` | `:408150`, `name: r1s` `:408151` |
| `SuggestConnectors` | 5 | **0** | `var s1s = "SuggestConnectors"` `:408195` | `:408227`, `name: s1s` `:408228` |
| `ListConnectors` | 5 | **0** | `var u1s = "ListConnectors"` `:408271` | `:408314`, `name: u1s` `:408315` |
| `SuggestPluginInstall` | 6 | **0** | inline literal | `:408900`, `name: "SuggestPluginInstall"` `:408901` |
| `SuggestSkills` | 4 | **0** | inline literal | `:408939`, `name: "SuggestSkills"` `:408940` |
| `propose_skills` | 3 | **0** | `var jVe = "propose_skills"` `:230914` | `:409191`, `name: jVe` `:409192` |
| `ClaudeDesign` | 24 | **0** | `var HKe = "ClaudeDesign"` `:411089` | `:411813`, `name: HKe` `:411814` |
| `EndConversation` | 7 | **0** | `var PB = "EndConversation"` `:231369` | `:413093`, `name: PB` `:413094` |
| `ObserverReport` | 8 | **0** | `var _Io = "ObserverReport"` `:413768` | `:413788`, `name: _Io` `:413789` |
| `SendFile` | 10 | **0** | `var LKe = "SendFile"` `:418883` | `:419036`, `name: LKe` `:419037` |

### 5.2 The `<unknown>` rows are NOT noise — they are two tool *factories* (4 hidden tools)

`_CONVENTIONS.md` §4.3 and `_GROUND_TRUTH_verified_anchors.md` §5 both file `<unknown>` / `_unknown_`
under "detector noise". That is **not correct**, and it is the most consequential thing I found. The two
records (offsets → `:408716` and `:408780`) are parameterised builders whose `name` comes from an
argument, so the extractor could not read a literal:

- `function pCd(e)` at `:408718` → `return Bi({` `:408719`, `name: e.name` `:408720`,
  `` searchHint: `list the user's enabled claude.ai ${e.noun}s` `` `:408721`
- `function mCd(e)` at `:408783` → `return Bi({` `:408784`, `name: e.name` `:408785`,
  `` searchHint: `discover claude.ai ${e.noun}s by keyword` `` `:408786`

Their four instantiations, each grepped as `220=1 / 193=0`: `pCd({ name: "ListPlugins", noun: "plugin" })`
at `cli_inner_pretty.js:408760-408762`, `pCd({ name: "ListSkills", noun: "skill" })` at `:408771-408773`,
`mCd({ name: "SearchPlugins" })` at `:408821-408822`, `mCd({ name: "SearchSkills" })` at `:408835-408836`.
`SuggestSkills`' own description cross-confirms the pair: *"List the user's enabled claude.ai skills…
To recommend skills they do NOT have yet, use SuggestSkills instead"* (`:408780`).

### 5.3 Detector noise / templates — the real classification

| Row | Verdict | Evidence |
|---|---|---|
| `<unknown>` ×2 | **factory, not noise** (§5.2) | `pCd` `:408718`, `mCd` `:408783` |
| `mcp` | real **template** tool object (`isMcp: !0`, literal `name: "mcp"`) — the generic wrapper every MCP tool is cloned from | `zar = Bi({` `:266683`, `isMcp: !0` `:266684`, `name: "mcp"` `:266688` |
| `eval_registered__${...}` | real **factory** — `name: \`eval_registered__${e.name}\`` for eval-harness tools | `hVy` `:400353`, `Bi({` `:400355` |
| `explain_command.md` | **noise** — an API `tool_choice`, no `_index.json` row at all (65 `.md` vs 64 unique names) | `:767824`, `:767891`; 220=2 / 193=2 |
| `_unknown_.md` | the collapsed filename for both `<unknown>` rows | 220 only (193 had no `<unknown>` rows) |

### 5.4 Net tool arithmetic

| | 220 | 193 |
|---|---|---|
| `_index.json` records | 65 | 50 |
| distinct names | 64 | 50 |
| minus `<unknown>` / `mcp` / `eval_registered__${...}` templates | 61 literal-named | 48 literal-named |
| plus factory-produced concrete tools | +4 (`List/SearchPlugins`, `List/SearchSkills`) | +0 |
| **real tool surface** | **65** | **48** |

**+17 tools, 0 removed.** All 50 of 193's names survive into 220 — a pure-addition window, unlike the
183 → 193 window which removed `TeamCreate`/`TeamDelete`.

The 48 carryover names are exactly 193's `_index.json` list minus `mcp` and `eval_registered__${...}`
(`Agent Artifact AskUserQuestion Bash Cron{Create,Delete,List} DesignSync Edit {Enter,Exit}PlanMode
{Enter,Exit}Worktree Glob Grep LSP ListMcpResourcesTool NotebookEdit PowerShell Projects
PushNotification REPL Read ReadMcpResource{Dir,}Tool RemoteTrigger ScheduleWakeup SendMessage
SendUser{File,Message} ShareOnboardingGuide ShowOnboardingRolePicker Skill StructuredOutput
Task{Create,Get,List,Output,Stop,Update} TestingPermission TodoWrite ToolSearch WaitForMcpServers
WebFetch WebSearch Workflow Write`).

---

## 6. Where the interesting regions are

Every row below was located by the grep anchor in the last column and the line was read in the
**2.1.220** bundle. Ranges are the useful reading window; the anchor is the stable re-entry point.

| Line range | What lives there | Grep anchor (verified) |
|------------|------------------|------------------------|
| `1-230` | legal header + bundler-inlined build constants | `// Version: 2.1.220` `:9`; `VERSION: "2.1.220"` `:226` |
| `6721-13600` | vendored **Zod v4** core (internal `$Zod*` + public `Zod*` factories) | `Ro("$ZodObject"` `:6721`; `Ro("ZodObject"` `:13580` |
| `14007-14700` | **baked-in model catalogue** (17 model ids, pricing tiers, aliases) then its zod schema + pricing/alias/capability resolvers | `"Hand-maintained baked-in model catalog"` `:14009`; `id: "claude-opus-5"` `:14365`; `function $Ti(e)` `:14511` |
| `15800-20000` | vendored **Anthropic SDK** (messages, skills, files, streaming) | `` ac`/v1/skills/${e}/versions` `` `:18146` |
| `21269`, `3188-3189` | the debug logger `w()` and the OTEL cost/token counters | `function w(e, { level: t } = { level: "debug" })` `:21269`; `"claude_code.cost.usage"` `:3188` |
| `24363-24882` | OTEL env-var registry, **OAuth endpoint table**, `<system-reminder>` delimiters | `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: () =>` `:24363`; `CONSOLE_AUTHORIZE_URL` `:24602`; `cRl = "<system-reminder>"` `:24881` |
| `30900-33000` | **managed env-var proxy**: the getter namespace every `Z.<ENV>` read goes through | `INK_SCREEN_READER: () => ieh` `:30934`; `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: () =>` `:31051` |
| `33780-34600` | **Chrome bridge client** — WS pairing, reconnect, tool-call relay | `chrome_bridge_tool_call_started` `:33857` |
| `35611-36000` | **MCP JSON-RPC zod schemas** + supported protocol-version list | `[frt, "2025-06-18", "2025-03-26", …]` `:35611`; `method: zd("tools/call")` `:35856` |
| `43100-43500` | MCP request/notification dispatch | `case "tools/call":` `:43192`; `case "notifications/tools/list_changed":` `:43322` |
| `47870-47876` | the three telemetry helpers `be` / `pe` / `$e` | `function be(e, t)` `:47870` |
| `49367-49400` | **hook event-name enum** | `"PreToolUse"` `:49367`, `"SessionStart"` `:49374` |
| `49640-49760` | `sandbox.network` + `sandbox.filesystem` zod schemas | `strictAllowlist: v` `:49648` |
| `60188-61529` | accessibility settings, then the **root settings zod schema** (`wMi`, 37,921 B — the single biggest function in the build) | `axScreenReader: v` `:60191`; `function wMi(e)` `:60613`; `apiKeyHelper: v.string()` `:60617` |
| `61841-62000` | settings validation **error-tip catalogue** + docs deep links | `cleanupPeriodDays must be at least 1` `:61863` |
| `63556-63600` | auto-mode settings-source gating (project settings ignored) | `only user/flag/managed settings may set classifier rules` `:63560`; `?.autoMode?.classifyAllShell === !0` `:63592` |
| `100849-104300` | vendored `@opentelemetry/api` + semconv attribute maps | `@opentelemetry/api: Attempted duplicate registration` `:100849`; `ATTR_SERVICE_NAME = "service.name"` `:104216` |
| `148033-148200`, `209500-211200` | the **two shell parsers**: class-based command-component splitter, then the argv/redirect/glob analyser | `static parseCommand(e)` `:148094`; `parseCommand: () => Xco` `:209510` |
| `151900-162400` | core **tool-name constants** cluster + skill frontmatter zod + memory reminder text | `var ri = "Bash"` `:151912`; `var zi = "Read"` `:162298`; `var hN = "ExitPlanMode"` `:162389`; `"allowed-tools": Hst()` `:157748`; `Recalled memories appearing inside` `:161097` |
| `156667`, `205798` | **feature-gate evaluator** `Ke(gate, default)` and telemetry gate helper `Ct()` | `function Ke(e, t)` `:156667`; `function Ct(e)` `:205798` |
| `167354-168200` | **OTEL emitters**: `Ac()` log events + span attribute setters | `async function Ac(e, t = {}, r)` `:167354`; `query_source` `:168123` |
| `193700-195210` | **sandbox runtime**: bubblewrap (Linux) + seatbelt (macOS) argv builders, then the network deny fallback that enforces `strictAllowlist` | `bubblewrap (bwrap) not installed` `:193751`; `"/usr/bin/sandbox-exec"` `:194553`; `No matching config rule, denying:` `:195200` |
| `214060-214200` | **filesystem permission decision engine** (deny rules → sandbox → safety → working-dir → allow rules) | `decisionReason: { type: "rule", rule: c }` `:214084` |
| `224007-224080` | base **system-prompt identity** strings + the **tool factory** `Bi` | `"You are Claude Code, Anthropic's official CLI for Claude."` `:224007`; `function Bi(e)` `:224053` |
| `226487-231400` | second tool-name-constant cluster + `/add-dir` command object | `var Oj = "TodoWrite"` `:226487`; `{ type: "local-jsx", name: "add-dir" }` `:226501`; `Cir = "code-review"` `:231212` |
| `248000-260500` | vendored **Ink renderer fork** with screen-reader / accessibility mode | `nodeName === "ink-text"` `:250484`; `process.env.INK_SCREEN_READER` `:257902` |
| `264400-265200` | **MCP client transports**: stdio, SSE, streamable HTTP | `StreamableHTTPClientTransport already started!` `:264977` |
| `266470-266760`, `283478-283800` | MCP tool wrappers: the generic `mcp` template, `ListMcpResourcesTool`, `ReadMcpResource{Dir,}Tool` | `zar = Bi({ isMcp: !0` `:266683-266684`, `name: "mcp"` `:266688`; `_index.json` offsets → `:283478` / `:283726` |
| `292900-300000` | **MCP connection manager**: connect, tool load, OAuth retry, needs-auth | `Ac("mcp_server_connection"` `:293007`; `tengu_mcp_server_connection_failed` `:293035` |
| `303400-307600` | **LSP client**: diagnostics register/dedup/deliver, `didOpen` | `lsp_diagnostics_deliver` `:303555`; `"textDocument/didOpen"` `:307289` |
| `310958-312200`, `323344-326400` | `Edit`/`Write`/`Glob`/`Grep`, then `AskUserQuestion`/`Exit`+`EnterPlanMode` tool objects | `_index.json` offsets; `ExitPlanMode inherently requests user approval` `:325829` |
| `363000-381000` | **embedded skill bundle #1**: Artifact/dataviz templates, workshop pages, plan template (id constants at `:318657-318659`) | `var CBe = "artifact-design"` `:318657`; `SKILL_MD: () => p4y` `:365279`; `PLAN_TEMPLATE: () => jGy` `:380704` |
| `398289-439800` | **the tool-object belt** — 40+ tool objects in lexical order | `Agent` `:398293` (`Wko = Bi({`), `ReportFindings` `:403877`, `Bash` `:437927` (`bu = Bi({`, `name: ri` `:437928`), `Read` `:439787` (`KS = Bi({`, `name: zi` `:439788`) |
| `441116-441200` | **auto-compact dispatcher** (discriminated `{kind}` union) | `if (Z.DISABLE_COMPACT) return { kind: "not_needed" }` `:441116` |
| `442600-444500` | auto-mode **classifier gate + prompt corpus** (outcome taxonomy, rule list, staged telemetry) | `tengu_auto_mode_classifier_queue` `:442629`; `Unauthorized Persistence` `:443401` |
| `448440-503400` | **slash-command definitions** (~130 command objects, lexically scattered) | `name: "auto-mode-setup"` `:448440` … `name: "remote-control"` `:503375` |
| `455000-472000`, `494000-494400` | vendored **OTEL SDK**: samplers + OTLP trace/metric/log exporters | `OTEL_TRACES_SAMPLER value` `:460006`; `OTLPTraceExporter: () => Oun` `:471479`; `pFo.OTLPLogExporter` `:494369` |
| `495200-496600`, `759560-759600` | `/voice` command, STT stream module, transcription error codes | `connectVoiceStream: () => CFo` `:495534`; `voice_transcription_connection_failed` `:759587` |
| `384698`, `518000-522100` | **hooks**: the `runHooks` executor, then one `execute<Event>Hooks` dispatcher per event + the event→dispatcher map | `async runHooks(d, p, f, m)` `:384698`; `hook_event_name: "DirectoryAdded"` `:518818` (`a2t` `:518817`); `DirectoryAdded: a2t` `:519444` |
| `528512` | **permission rule matcher** `B0(path, ctx, kind, behavior)` — called by the fs engine | `function B0(e, t, r, n)` `:528512` |
| `595000-636000` | vendored **highlight.js** grammars + emitter glue + the screen-reader-aware diff/markdown renderer | `(ocf\|systemd\|service\|lsb)` `:599098`; `classList.add("hljs")` `:633936`; `screenReader: l = !1` `:635795` |
| `537380-537410`, `678380-680570` | **background daemon**: telemetry gate list, systemd user-unit path, `claude agents` install copy | `"tengu_bg_daemon_install"` `:537399`; `uGt.join(e, "systemd", "user", \`${Q3e}.service\`)` `:678406`; `Installing it as a service keeps the background daemon running` `:680559` |
| `772000-810000` | **embedded skill bundle #2**: `claude-api`, design-system, plugin-dev, `run` | `SKILL_MD: () => P6S` `:772264`; `interleaved-thinking-2025-05-14` `:795994` |
| `851350-872596` | top-level commander option registration, then the startup **doctor** (managed settings + telemetry relay) | `new id("--teammate-mode <mode>"` `:851381`; `"telemetry relay: not configured"` `:860000` |

**Bonus measurement:** built-in skill bundles (`SKILL_MD: () =>` in the bundle) went **220=12 / 193=6**
— the embedded-skill corpus *doubled* in this window. That is the mechanical reason `prompts_chars`
grew 48 % while `system_prompts/` shrank by one file.

---

## 7. How to navigate

### 7.1 The four commands you actually need

```bash
T=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js
B=/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js

grep -n 'strictAllowlist' $T          # 1. find the anchor + its line
grep -c 'strictAllowlist' $T $B       # 2. delta proof — BOTH files, one call
sed -n '49640,49700p' $T              # 3. read context (or Read with offset/limit)
grep -n 'function wMi(' $T            # 4. pin the enclosing decl
```

Rule of thumb from `_CONVENTIONS.md` §3: **run step 2 before writing a word.** A non-zero 193 count
means the changelog bullet is over-claiming and your job becomes *finding the narrower true delta*.

### 7.2 Symbol → source

1. Get the obfuscated id from the bundle (the identifier before `=`, or after `function`/`class`).
2. `cat cli_unpack_pretty/decls/{functions,vars,classes}/<id>.js` for the isolated body.
3. If the file is a ≤3-byte stub (`<id>;`), it is a `var-decl-empty` — grep the bundle for
   `  <id> = ` to find the `S(() => …)` module initializer that assigns it (§3).
4. **Never import a 193 symbol name.** Ids are re-mangled *and reused*. Re-derive from a string
   literal / tool name / telemetry event / env var / settings key every time.

### 7.3 Asset → source (the offset trick)

`assets/tools/_index.json` and `assets/prompts_index.json` both carry a **byte offset** into
`cli_inner_pretty.js`. Build a newline-prefix array once (`bisect.bisect_right(starts, offset)`) and you
jump straight to the definition: for tools the offset lands within ±5 lines of the `Bi({ … })` call
(verified on `Bash`, `Read`, `Agent`); for prompts it lands inside the template literal.

### 7.4 Using `_raw_asset_diff_193_to_220.md`

[`_raw_asset_diff_193_to_220.md`](_raw_asset_diff_193_to_220.md) is the machine diff of every asset
list: 326 new / 42 gone feature gates, 47 new / 163 gone env vars, 51 new / 2 gone CLI flags, +15 tool
`_index` rows, slash-command and `.md` deltas. Its own header says *provenance only — not verified*, and
this index shows why:

- Treat **NEW** rows as **candidates**. Confirm with `grep -c … $T $B`. It is a list of *literals the
  extractor saw*, not of features that shipped.
- Treat **GONE** rows with active suspicion, especially in the env-var section: **124 of the 163 "gone"
  env vars are still live in 220** (§4.2). Only 4 are real removals.
- The tool section under-reports: it lists 13 new `.md` names but misses the 4 factory-produced tools
  behind `_unknown_` (§5.2). Real count is **+17**.
- The gate section is the *most* trustworthy of the four (1.2 % noise, §4.6) and is a good place to
  mine anchors — a new `tengu_*` name is almost always a real new call site.
- Cross-check every candidate against
  [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) first; it already
  settles the model catalogue, the subagent caps, `EndConversation`, `DirectoryAdded`,
  `workflowSizeGuideline`, and eleven confirmed false-delta traps.

### 7.5 Region-first triage

When you have a theme but no anchor, start from §6 and work inward:

| Theme | Start at |
|-------|----------|
| a settings key | `:60613-61529` (root schema), then `:61841+` for its error tip |
| an env var | `:30900-33000` (getter namespace), then the read site |
| a tool | `assets/tools/_index.json` offset → the `Bi({` call |
| a slash command | `:448440-503400`, `grep -n 'name: "<cmd>"'` |
| a hook event | `:49367-49400`, then the dispatcher near `:384698` / `:518800-522100` |
| a telemetry event | `grep -n '"<event>"'`, then trace back to `Ac` `:167354` / `$e` `:47876` / `Ct` `:205798` |
| a permission behaviour | `:214060-214200` (fs), `:528512` (rule match), `:195200` (network) |
| an MCP behaviour | `:35611-36000` (schemas), `:264400-265200` (transports), `:292900-300000` (manager) |
| a model behaviour | `:14007-14700` (catalogue + resolvers) |
| a prompt string | `assets/prompts_index.json` offset → line |

---

## 8. See also

- [`../_CONVENTIONS.md`](../_CONVENTIONS.md) — bundles, citation rule, traps, document format.
- [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md) — anchors already
  verified by hand; build on them rather than re-deriving.
- [`_raw_asset_diff_193_to_220.md`](_raw_asset_diff_193_to_220.md) — machine asset diff (provenance only).
- `_scope_v195_199.md`, `_scope_v200_205.md`, `_scope_v206_210.md`, `_scope_v211_214.md` — the
  per-release scoping passes over the 25-release window.
- [`../../CHANGELOG.md`](../../CHANGELOG.md) — upstream bullets (579 across `.195`…`.220`), read-only input.
- [`../../../claude_code_v_2.1.193/analyze/00_overview/file_index.md`](../../../claude_code_v_2.1.193/analyze/00_overview/file_index.md)
  — the prior-window index and the format exemplar for this file.
