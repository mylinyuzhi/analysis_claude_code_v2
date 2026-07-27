# Shared conventions for the v2.1.220 analysis tree (read this first)

Every agent working on `claude_code_v_2.1.220/analyze/` MUST follow this file. It is the single
source of truth for paths, citation rules, formatting, and the known traps.

---

## 1. The bundles

| Role | Path | Facts |
|------|------|-------|
| **TARGET** (analyze this) | `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` | **872,596 lines / 29,422,342 bytes**; `VERSION 2.1.220`, `build_sha 4073f5959…` (short `4073f595`), `build_time 2026-07-24T22:17:45Z`, Bun 1.4.0 (f6d0fcd24) |
| **BEFORE-PICTURE** (delta baseline) | `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` | 718,679 lines / 24,097,739 bytes; `build_sha a1938d2a…` |
| **DEEPER BASELINE** (optional 3rd point) | `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` | 699,346 lines |
| **NAMED TypeScript** (semantic cross-validation) | `/lyz/codespace/3rd/claude-code/src/` | v2.1.88 readable tree — real identifier names, but 132 versions stale |

The bundle **grew +153,917 lines (+21.4%)** across this window (718,679 → 872,596). This is by far the
largest window analysed so far.

Also available in the 2.1.220 extract:
- `cli_unpack_pretty/decls/{functions,vars,classes,ExpressionStatement,IfStatement}/<id>.js` —
  49,263 manifest entries (20,588 `fn-decl`, 13,929 `var-decl`, 13,824 `var-decl-empty`,
  611 `ExpressionStatement`, 310 `class-decl`, 1 `IfStatement`). `_manifest.json` has name+kind+bytes.
  `_summary.json` is `[]` (empty) — use `_manifest.json`.
- `assets/` — `prompts/` + `prompts_index.json` (578 prompts), `system_prompts/` (11 files),
  `tools/` (66 files incl. `_index.json`; `_index.json` carries **65 tool entries**),
  `slash_commands.json` (133 — noisy), `env_vars.json` (`{all:567, claude_anthropic:252, bun:0, node:3}`),
  `cli_flags.json` (`{flags:934, subcommands:0}`), `feature_gates.json` (**1,731** gate/event names),
  `endpoints.json` (470 urls / 136 hosts), `long_strings/` (50 files).
- A pre-computed machine diff of every asset list vs 2.1.193 lives at
  [`00_overview/_raw_asset_diff_193_to_220.md`](00_overview/_raw_asset_diff_193_to_220.md)
  (326 NEW feature gates, 42 gone; +15 tool entries; 51 new CLI flags). **Provenance only — not verified.**

## 2. The delta window

25 **published** releases: `2.1.195 .196 .197 .198 .199 .200 .201 .202 .203 .204 .205 .206 .207 .208
.209 .210 .211 .212 .214 .215 .216 .217 .218 .219 .220`. **`2.1.213` was never published** (and the
window opens at `.195` because `.194` was never published either). Total **579 changelog bullets**.

Per-version bullet counts (from `claude_code_v_2.1.220/CHANGELOG.md`):

```
.195=12  .196=27  .197=1   .198=33  .199=24  .200=17  .201=1   .202=18  .203=37
.204=1   .205=23  .206=27  .207=24  .208=46  .209=1   .210=33  .211=37  .212=48
.214=47  .215=1   .216=40  .217=20  .218=36  .219=24  .220=1
```

The two model releases (`.197` Sonnet 5, `.219` Opus 5) plus the four single-item releases
(`.201 .204 .209 .215 .220`) are the shape markers: this window contains **two default-model changes**.

## 3. Citation rule (non-negotiable)

- Every factual claim cites **`cli_inner_pretty.js:<line>`**, and that line must have been **read in the
  2.1.220 bundle** by you. Do not carry a line number over from another tree.
- Line numbers are stable **only within one build**. The **stable anchor is the string literal /
  tool name / telemetry event / env-var name / settings key** — cite that too wherever possible.
- Any line you quote from the baseline must be tagged `(193)` or `(183)` explicitly, e.g.
  `cli_inner_pretty.js:12345 (193)`. Never mix.
- To claim something is **net-new**, show the grep count in BOTH bundles: `220=N / 193=0`.
  To claim **carryover**, show `220=N / 193=M` with N≈M and read both sites.

Useful invocations:

```bash
T=/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js
B=/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js
grep -n 'strictAllowlist' $T          # find anchor + line
grep -c 'strictAllowlist' $T $B       # delta proof (per-file counts)
sed -n '55800,55830p' $T              # read context  (or use the Read tool with offset/limit)
```

## 4. KNOWN TRAPS — read before you claim anything

1. **Symbols are re-mangled between builds, and old ids get REUSED for different decls.** A name that
   meant X in 2.1.193 very often means something unrelated in 2.1.220. **Re-derive every symbol inside
   the 2.1.220 bundle** from a stable string / gate / env-var anchor. Never import a 193 name.
2. **`assets/env_vars.json` is unreliable in this build.** Its `all` list *lost* 163 entries that are
   demonstrably still live (e.g. `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`, `ANTHROPIC_BETAS`,
   `CLAUDE_CODE_ENABLE_AUTO_MODE`) and *gained* 47 entries that are obfuscated identifiers, not env
   vars (`AUl`, `BGh`, `d`, `__r`…). **Always confirm an env var by grepping the bundle.**
3. **`assets/tools_index.json` (top level) is broken** — it has 1 entry. The usable tool list is
   `assets/tools/_index.json` (65 entries), and even that contains detector noise
   (`<unknown>`, `_unknown_`, `eval_registered________`, `explain_command`, `mcp`).
4. **`assets/slash_commands.json` is noisy** — many entries are filesystem paths, not commands.
5. **A changelog bullet is a CLAIM, not evidence.** Several bullets in this window describe
   server-side or already-shipped behaviour. Anything you cannot anchor in 2.1.220 source must be
   recorded as *unverified* or *carryover*, never dressed up as a delta.
6. **Known pre-existing-literal landmines** (already measured — do NOT call these net-new without
   reading both sites): `strictAllowlist` 220=4 / **193=1**; `axScreenReader` 220=2 / **193=2**;
   `filesystem.disabled` 220=7 / **193=6**. The changelog presents all three as new in this window;
   the literal existed earlier, so the delta is narrower than the bullet implies. Find the *real* delta.
7. **False-delta inflation is the #1 defect** found in prior trees' cross-validation. When in doubt,
   label carryover. A correct "this is carryover" beats a plausible-sounding invented delta.
8. **⚠ `grep -c` treats your literal as a REGEX — always use `grep -cF` for counts.** This produced a
   real **false CARRYOVER** in this tree: `grep -c 'workflow.run_id'` returned `220=3 / 193=2` and the
   bullet was written off as "partially pre-existing", because the unescaped `.` matched 193's
   snake_case `workflow_run_id` (`:424852`, `:424892 (193)`) — an unrelated namespace. The true counts
   are `grep -cF` → **1/0 and 1/0: both attributes are net-new.**
   Dots, `[`, `*`, `+`, `?`, `(`, `|`, `$` are all live metacharacters. Anything resembling
   `a.b`, `foo.json`, `x.y.z` or `${...}` **must** be counted with `-F` (or `\.`-escaped).
   Note the direction: this trap causes **false NEGATIVES**, so it is invisible to a "when in doubt say
   carryover" bias — that bias actively conceals it. Re-count with `-F` before accepting any carryover
   verdict whose literal contains a metacharacter.
   *(Audited across the tree's dotted carryover claims: `filesystem.disabled` 7/6, `.claude/rules` 8/5,
   `MEMORY.md` 9/4, `context: fork` 3/2 and `claude.exe` 8/8 are unaffected — they measure the same
   under `-F`. `daemon.lock` differs (regex 10/3 vs fixed 4/2) but was already cited at the `-F` value.)*

## 5. Document format (from the repo CLAUDE.md — enforced)

### 5.1 Symbol references in module docs — LIST format, never a table

Module docs (anything under `NN_<module>/`) MUST NOT contain a section named
`Symbol Mapping Reference` / `Symbol Index Reference`, and MUST NOT contain an
`| Obfuscated | Readable |` table. Instead end each doc with:

```markdown
## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `readableName` (Xy2) - Brief description
- `anotherFn` (AB3) - Brief description
```

Tables of symbol mappings live ONLY in `00_overview/symbol_index_*.md` and
`00_overview/symbol_additions_v2_1_220_<theme>.md`.

### 5.2 Code snippets — dual-version, exactly this shape

````markdown
```javascript
// ============================================
// readableFunctionName - Brief description
// Location: cli_inner_pretty.js:1707-1731
// ============================================

// ORIGINAL (for source lookup):
async function sI2(A, Q, B) { if (Y0(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 }; ... }

// READABLE (for understanding):
async function readableFunctionName(messages, sessionContext, memoryType) {
  if (parseBoolean(process.env.DISABLE_COMPACT)) return { wasCompacted: false };
  ...
}

// Mapping: sI2→readableFunctionName, A→messages, Q→sessionContext, B→memoryType
```
````

Exactly ONE `====` block, at the top. Never wrap `ORIGINAL` / `READABLE` in their own `====` bars.
The ORIGINAL must be verbatim from the bundle (may be elided with `...` but never paraphrased).

### 5.3 Depth requirement

Surface descriptions are rejected. For every key decision / algorithm / logic branch, include:

```markdown
### [Algorithm/Decision Name]

**What it does:** purpose in one or two sentences

**How it works:**
1. step-by-step, each significant operation explained
2. edge cases and special handling

**Why this approach:**
- design rationale
- alternatives inferable from the code
- trade-offs made

**Key insight:** the non-obvious thing a reader should take away
```

Explain *thresholds and constants* (why 20 concurrent subagents? why 2 minutes?), *ordering*
(why is this check before that one?), and *failure modes*.

### 5.4 Other hard rules

- **English only.** No Chinese in any output file.
- Every module doc ends with `## Related Symbols` (§5.1).
- Cross-tree links: from `NN_module/foo.md` the 2.1.193 tree is
  `../../../claude_code_v_2.1.193/analyze/…`; from `00_overview/foo.md` likewise `../../../…`;
  from the tree-root `README.md` it is `../../claude_code_v_2.1.193/analyze/…`. Count the depth.
- Prefer `Read` with `offset`/`limit` over `sed` for reading the bundle; use `grep -n`/`grep -c` for search.
- Never edit files outside `claude_code_v_2.1.220/analyze/` (the CHANGELOG.md above it is input, read-only).

## 6. Symbol-index routing

| Theme | Goes in |
|-------|---------|
| Agent loop, LLM API, tools, agents/subagent plumbing, state, system prompts | `symbol_index_core_execution.md` |
| Plan mode, background agents, todo/tasks, compact, hooks, skills, thinking, steering, CLI, workflow, agent team, auto memory | `symbol_index_core_features.md` |
| MCP, permissions, sandbox, auth, model selection, prompt building, telemetry | `symbol_index_infra_platform.md` |
| LSP, Chrome, IDE, UI components, plugins, code indexing, shell parser, slash commands | `symbol_index_infra_integration.md` |

Row format: `| Obfuscated | Readable | File:Line | Type |` where Type ∈
`function|constant|class|object|variable`. Sort alphabetically inside each module section.

## 7. Reference tree

`../../claude_code_v_2.1.193/analyze/` is the format exemplar. Good models to imitate:
`38_permissions/classify_all_shell.md`, `42_workflow/structured_output_call_control.md`,
`44_telemetry/assistant_response_event.md`, `by_version/2.1.187.md`,
`00_overview/changelog_to_code_map.md`.
