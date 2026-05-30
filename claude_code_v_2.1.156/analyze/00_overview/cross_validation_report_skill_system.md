# Cross-Validation Report — Module 10_skill_system (v2.1.143 → v2.1.156)

- **Module:** `10_skill_system` (Skills delta)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/10_skill_system`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_skill_system.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines)
- **Cross-validation source:** `/lyz/codespace/3rd/claude-code/src` (v2.1.88 readable TypeScript)
- **Markdown files scanned:** 6 module docs + 1 additions file
  (`README.md`, `skill_reload_midsession.md`, `skill_disallowed_tools.md`,
  `skill_fork_recursion_guard.md`, `skill_effort_frontmatter.md`, `bundled_skill_bodies.md`,
  `symbol_additions_v2_1_156_skill_system.md`)
- **Date:** 2026-05-30

---

## C1 — Symbol existence (sampled from the additions table + module docs)

Every sampled obfuscated identifier was located at its cited line by reading the bundle.

- **PASS: 47**
- **FAIL: 0**
- **WARN: 0**

Symbols verified present at their cited lines (representative, all PASS):

| Symbol | Cited line | Verified content |
|--------|-----------|------------------|
| `Zzz` | 521237 | `var Zzz = async (H, $) => { ... }` reload-skills handler |
| `Gzz` | 521262 | `Gzz = { type: "local", name: "reload-skills", ... }` object literal |
| `X$` | 521236 | `X$(Bl4, { call: () => Zzz });` |
| `$U` | 270637 | `async function $U(H, { sessionId: $, ... })` |
| `Xc` | 270624 | `var Xc;` (assigned `Xc = y7()` at 270627) |
| `_C` | 545345 | `function _C() { (wu(), vG8(), Cw4(), DRH()); }` |
| `wu` | 545333 | `function wu() { (sH9.cache?.clear?.(), L2.cache?.clear?.(), ...) }` |
| `vG8` | 414228 | `function vG8()` |
| `Cw4` | 414290 | `function Cw4()` |
| `DRH` | 421850 | `function DRH()` |
| `Bo` | 413487 | `function Bo() { (LG8.clear(), (PG8 = !1), (_RH = null)); }` |
| `Gp6` | 413493 | `function Gp6() { PG8 = !0; }` |
| `LG8` | 414021 | `LG8 = new Map();` |
| `PG8`/`_RH` | 413922/413923 | `var` block `… PG8 = !1, _RH = null;` |
| `nd6` | 421999 | `nd6 = v8(async (H) => {` |
| `tx` | 443338 | `tx = v8(` |
| `zRH` | 414317 | `zRH = v8(async () => {` |
| `Kd6` | 414435 | `Kd6 = v8(async () => {` |
| `BL` | 545320 | `async function BL(H)` |
| `sH9` | 545805 | `sH9 = v8(async (H) => {` |
| `gDz` | 545264 | `async function gDz(H)` |
| `L2` | 545823 | `L2 = v8(async (H) => {` |
| `RDH` | 545827 | `RDH = v8(async (H) => {` |
| `dDz` | 545804 | `dDz = (mqq(), Z6(uqq)).invalidateWorkflowCache` |
| `y7` | 1813 | `function y7()` (signal factory) |
| `cx8` | 1475 | `function cx8(H, $)` (memoize impl) |
| `v8` | 1492 | `v8 = cx8;` (alias) |
| `C$` | 42238 | `function C$()` (cwd) |
| `N8` | 9655 | `function N8(H, $, q = $ + "s")` (pluralize) |
| `GL5` | 184480 | `GL5 = yH(() => y.object({ ... }))` common frontmatter schema |
| `aL6` | 184517 | `aL6 = yH(() => GL5().extend({ ... }))` skill schema |
| `TL5` | 184556 | `TL5 = yH(() => y.object({ ... }))` agent schema |
| `c28` | 395738 | `function c28(H, $, q = "replace")` |
| `fI8` | 590814 | `async function fI8({ input: H, ... })` |
| `yA4` | 396582 | `async function yA4(H, $, q, K = [], _ = [], z, A = [])` inline executor |
| `D0$` | 452910 | `async function D0$(H, $, q)` forked context |
| `T6` | 453162 | `function T6(H)` applyPermissionLayers |
| `fV8` / `YV8` / `tT4` | 452899/452892/452903 | deny / allow appenders + appstate wrapper |
| `k3` | 453183 | `function k3(H) { ... for (... ) if (K.kind === "effort") $ = K.effort; ... }` |
| `dN` | 185009 | `dN = ["low", "medium", "high", "xhigh", "max"];` |
| `vx`/`KkH`/`ycH`/`or`/`Ev`/`q48` | 184870/184859/184834/184909/184944/184987 | effort parser + gates |
| `w5` | 552312 | `function w5(H, $, q)` (status env; effort-layer walk at 552317) |
| `bA` | 524187 | `function bA(H)` registerBundledSkill |
| `vO9`/`Ehz` | 601350/601378 | `/simplify` registrar + body |
| `Y18`/`zO9` | 211646/600612 | `code-review` name + registrar |
| `tSz` | 612027 | `function tSz()` claude-api registrar |
| `Xi$`/`d1q` | 91825/611874 | Opus 4.8 id map + SKILL_MODEL_VARS |
| `ZX`/`sq` | 216282/185637 | `"Skill"` / `"Agent"` |
| `J$4` | 350271 | `function J$4(H) { return uhH.get(H.name) === H; }` |
| `SH`/`uH` | 41590/41593 | `tengu_feature_ok` / `tengu_feature_bad` emitters |

---

## C2 — Line/symbol pairing (representative pairs)

Each pair below was confirmed by reading the cited line and matching the obfuscated token
*and* the surrounding semantics to the doc claim.

- **PASS: 24**
- **FAIL: 0**

Key pairings verified:

- Fork-recursion guard at **350622** — `if (f.type === "prompt" && f.context === "fork" && $.options.spawnedBySkill === f.name)` with `errorCode: 9` and `d("tengu_skill_tool_fork_recursion_blocked", {})` at 350625. Exact match to `skill_fork_recursion_guard.md`.
- `spawnedBySkill: H.name` at **350466** (fork launch) and **396081** (inline-spawn). Exact.
- `spawnedBySkill: f` at **396803** (WS threading). Exact.
- Inheritance `spawnedBySkill ?? activeSkill` at **375253 / 398607 / 454273**. All three exact.
- `q.options.activeSkill = H.name` at **396618**. Exact.
- Inline deny union `c28(q.setToolPermissionContext, D, "union")` at **396622**. Exact.
- Per-message reset `c28(z.setToolPermissionContext, G.disallowedTools ?? [])` at **590839**. Exact.
- `$U` reload-fire `if (M) (_C(), Bo(), Xc.emit(), SH("hook_session_start_reload_skills"));` at **270671**, with `if (w.reloadSkills) M = !0;` at **270669**. Exact.
- `reloadSkills` aggregator yield at **553933**. Exact.
- Disallowed-tools schema (`disallowed-tools` + canonical `disallowedTools` alias) at **184489-184497**. Exact, including the describe text *"Cleared when the user sends the next message."*
- Agent-def `disallowedTools` describe *"Ignored if `tools` is set."* at **184566**. Exact.
- Prompt rule *"Do not invoke a skill that is already running"* at **236811**. Exact.
- `/simplify` description *"Quality only — it does not hunt for bugs; use /code-review for that."* at **601353-601354**. Exact.
- `/code-review` `subcommands: { ultra: "ultrareview" }` + `getEffort` at **600612-600624**. Exact.
- `/claude-api` `files: cSz()` + `tengu_claude_api_skill_loaded { detected_lang, subcommand, has_args }` at **612027-612045**. Exact.

---

## C3 — Line-range sanity (sampled ranges)

All sampled ranges have start < end, point into the correct declaration, and the end line
falls within or just past the function/object body.

- **PASS: 14**
- **FAIL: 0**

| Range | Decl | Verdict |
|-------|------|---------|
| 521237-521252 (`Zzz`) | reload handler body | PASS |
| 521262-521271 (`Gzz`) | object literal | PASS (literal starts 521262; `var Gzz, CE8;` at 521260) |
| 545333-545344 (`wu`) | inner cache buster | PASS |
| 545345-545347 (`_C`) | outer clear | PASS |
| 413487-413489 (`Bo`) | conditional-state reset | PASS |
| 184489-184497 (disallowed-tools schema) | common schema fields | PASS |
| 452910-452925 (`D0$`) | forked context builder | PASS |
| 453162-453182 (`T6`) | layer fold | PASS |
| 453183-453189 (`k3`) | effort fold | PASS (closing `}` at 453189) |
| 552312-552327 (`w5`) | status env | PASS |
| 524187-524234 (`bA`) | registrar | PASS |
| 601378-601407 (`Ehz`) | simplify body | PASS |
| 91825-91834 (`Xi$`) | opus-4-8 id map | PASS |
| 611874-611882 (`d1q`) | model vars | PASS |

Note: minor end-line variance exists where two docs cite the same symbol (`k3`:
`skill_effort_frontmatter.md` says 453183-453188, `skill_disallowed_tools.md` says
453183-453189; the closing brace is at 453189). Both are within sanity bounds; the
additions file cites the single declaration line 453183. No fix required.

---

## C4 — Mapping conflicts (one symbol → one readable name)

A whole-module scan extracted every `` `readable` (`OBF`) `` pair and checked that each
obfuscated symbol has exactly one readable name across all 6 module docs.

- **Conflicts found (pre-fix): 1**
- **Conflicts after fix: 0**

### Conflict (FIXED): `k3`

`skill_disallowed_tools.md` (lines 33 and 603) named `k3` **`applyEffortLayers`**, while
the additions file, `README.md`, and `skill_effort_frontmatter.md` all name it
**`resolveEffortFromLayers`** (the canonical name; the function body folds the layer list
into a single `effortValue`). The bundle confirms `function k3(H)` at 453183 reduces
`permissionLayers` to an effort value — `resolveEffortFromLayers` is the accurate name.
Both occurrences in `skill_disallowed_tools.md` were edited to `resolveEffortFromLayers`.

No other conflicts. The four inline/fork execution symbols are distinct and consistently
named: `yA4`→`runInlineSkill`, `hN_`→`processPromptSlashCommand`, `NN_`→`forkSlashCommand`,
`WS`→`runSubagentQuery`. (These are cross-module execution symbols not present in the
skill-system additions table; they belong to `symbol_index_core_execution.md`.)

---

## C5 — Cross-validation against v2.1.88 (`/lyz/codespace/3rd/claude-code/src`)

Every precursor / NEW assertion in the docs was checked by grepping the 2.1.88 source.

- **PASS: 10 / 10**

| Doc claim | 2.1.88 check | Verdict |
|-----------|--------------|---------|
| Reload primitive (`clearSkillCaches`, `conditionalSkills.clear()`, `createSignal`) is a precursor | `src/skills/loadSkillsDir.ts:806` `clearSkillCaches()`, `:809` `conditionalSkills.clear()`, `:64` imports `createSignal` | PASS — precursor confirmed |
| `/reload-skills` command + `reloadSkills` hook field are NEW | `grep -rln 'reload-skills\|reloadSkills' src` → 0 hits | PASS — NEW confirmed |
| `spawnedBySkill` + fork-recursion guard are NEW | `grep spawnedBySkill` → 0; `grep fork_recursion` → 0 | PASS — NEW confirmed |
| Entire `permissionLayers` mechanism is NEW | `grep permissionLayers` → 0 | PASS — NEW confirmed |
| `xhigh` effort level + `modelSupportsXhighEffort` are NEW | `grep xhigh` → 0 | PASS — NEW confirmed |
| Per-skill `disallowed-tools` frontmatter is NEW; only the `--disallowedTools` CLI flag existed | `grep 'disallowed-tools' src` → only the `--disallowedTools, --disallowed-tools` CLI option in `main.tsx:988` | PASS — NEW confirmed |
| Agent-def `disallowedTools` (pool filter, ignored-if-allowlist) is a precursor | `tools/AgentTool/{loadAgentsDir,agentToolUtils,prompt}.ts` carry `disallowedTools` | PASS — precursor confirmed |
| `/simplify` + `/claude-api` have 2.1.88 bundled precursors | `src/skills/bundled/simplify.ts`, `claudeApi.ts` exist | PASS — precursor confirmed |
| `/code-review` as a *bundled* skill is NEW | `src/skills/bundled/` has no `codeReview.ts` | PASS — NEW confirmed |
| `registerBundledSkill` shape is a precursor | `src/skills/bundledSkills.ts` present (referenced in docs) | PASS — precursor confirmed |

---

## S1 — Semantic spot-checks (5 samples)

### Sample 1 — `k3` (`resolveEffortFromLayers`) at `cli_inner_pretty.js:453183`

```js
function k3(H) {
  let $ = H.getAppState().effortValue,
    q = H.permissionLayers;
  if (!q) return $;
  for (let K of q) if (K.kind === "effort") $ = K.effort;
  return $;
}
```

**Verdict:** PASS. Confirms the doc claim that effort is *derived* per turn by folding the
layer list over the baseline, last-writer-wins. The name `applyEffortLayers` was the only
inaccuracy (fixed to `resolveEffortFromLayers`).

### Sample 2 — Fork-recursion guard at `cli_inner_pretty.js:350622`

```js
if (f.type === "prompt" && f.context === "fork" && $.options.spawnedBySkill === f.name)
  return (
    uH("skill_invoke", "skill_invoke_fork_recursion"),
    d("tengu_skill_tool_fork_recursion_blocked", {}),
    { result: !1, message: `Skill ${_} is already executing in this forked context — you are the subagent running it. Execute the instructions in the skill body directly instead of re-invoking the ${ZX} tool.`, errorCode: 9 }
  );
```

**Verdict:** PASS. Three-condition gate, `errorCode: 9`, dual telemetry (`uH`
`tengu_feature_bad` + `d` dedicated event), and the "you are the subagent running it"
message all match `skill_fork_recursion_guard.md` exactly.

### Sample 3 — `c28` (`applyToolDenyRules`) at `cli_inner_pretty.js:395738`

```js
function c28(H, $, q = "replace") {
  H((K) => {
    let _ = K.alwaysDenyRules.command,
      z = q === "union" ? aq([...(_ ?? []), ...$]) : [...$];
    if ((_?.length ?? 0) === z.length && (_ ?? []).every((Y, f) => Y === z[f])) return K;
    return { ...K, alwaysDenyRules: { ...K.alwaysDenyRules, command: z.length > 0 ? z : void 0 } };
  });
}
```

**Verdict:** PASS. Confirms mode-aware union/replace into `alwaysDenyRules.command`, the
identity-preserving no-op guard, and the default `"replace"` mode that makes per-skill
denials ephemeral (cleared on the next user message via `fI8` at 590839).

### Sample 4 — `vO9` (`registerSimplifySkill`) + `Ehz` body at `cli_inner_pretty.js:601350-601378`

```js
function vO9() {
  bA({
    name: "simplify",
    description: "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    ...
  });
}
// Ehz = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\` ... You are improving the quality of the changed code, not hunting for bugs ...`
```

**Verdict:** PASS. Confirms the 2.1.154 cleanup-only redefinition, the "not hunting for
bugs" framing, and the 4-cleanup-agent fan-out (vs 3 in 2.1.88). Registered via `bA`.

### Sample 5 — `tSz` (`registerClaudeApiSkill`) at `cli_inner_pretty.js:612027`

```js
function tSz() {
  bA({
    name: "claude-api", description: uj9,
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    userInvocable: !0, files: cSz(),
    async getPromptForCommand(H) {
      let $ = await nSz();
      return (d("tengu_claude_api_skill_loaded", { detected_lang: $ ?? "none", subcommand: mj9(H), has_args: H.trim().length > 0 }), [{ type: "text", text: oSz($, H, l1q) }]);
    },
  });
}
```

**Verdict:** PASS. Confirms `files: cSz()` (docs-to-disk mechanism), the
`tengu_claude_api_skill_loaded` telemetry with the three claimed fields, and the
scoped `allowedTools`. The Opus 4.8 id (`Xi$.firstParty = "claude-opus-4-8"` at 91826)
agrees with `d1q.OPUS_ID = "claude-opus-4-8"` at 611875, validating the migration-target
claim.

---

## Fixes applied

1. `skill_disallowed_tools.md:33` — renamed `applyEffortLayers` (`k3`) →
   `resolveEffortFromLayers` (`k3`) in the Related-Symbols list (one-symbol-one-name
   consistency with the additions file and the other module docs).
2. `skill_disallowed_tools.md:603` — same rename in §6 prose.

No line-number corrections were needed: every sampled citation matched the bundle. No
mapping tables were present in module docs (verified). The additions file's stated
line-number corrections (`OP$` 551757, `PG8`/`_RH` 413922-413923, `v8` 1492 vs `cx8`
1475, `Gzz` 521262) were all independently confirmed correct.

---

## Summary

- C1 Symbol existence: **47 PASS / 0 FAIL / 0 WARN**
- C2 Line/symbol pairing: **24 PASS / 0 FAIL**
- C3 Range sanity: **14 PASS / 0 FAIL**
- C4 Mapping conflicts: **1 found → fixed → 0 remaining**
- C5 v2.1.88 cross-validation: **10 PASS / 0 FAIL**
- S1 Semantic spot-checks: **5 PASS / 0 FAIL**

### Confidence roll-up

| Area | Confidence | Notes |
|------|-----------|-------|
| Mid-session reload (`/reload-skills`, hook `reloadSkills`, primitive chain) | **HIGH** | All symbols + the shared `_C`/`Bo`/`Xc.emit` chain verified; 2.1.88 precursor (`clearSkillCaches`) confirmed; both entrypoints confirmed NEW |
| `disallowed-tools` frontmatter (schema, parsers, inline `c28`, fork layer, reset) | **HIGH** | Schema 184489-184497, `c28` 395738, fork `D0$`/`T6`/`fV8`, reset 590839 all exact; 2.1.88 had only the CLI flag |
| Fork-recursion guard (`spawnedBySkill`, gate, telemetry) | **HIGH** | Guard 350622, all set/thread/inherit/read sites verified; NEW confirmed by 0-hit greps |
| `effort:` frontmatter (`xhigh`, effort layer, status-bar fix `w5`) | **HIGH** | `dN` 185009, `k3` 453183, `w5` walk 552317, gates all verified; `xhigh`/`permissionLayers` NEW confirmed |
| Bundled bodies (`bA`, `/simplify`, `/code-review`, `/claude-api`) | **HIGH** for structure/telemetry; **MEDIUM** for migration-doc prose lineage | Registrar + registrars + Opus-4.8 ids verified; `wj9` migration prose is a data blob whose 2.1.88 equivalent lives in `claudeApiContent.js` (the docs already flag this honestly) |

**Overall verdict: PASS.** The module is highly accurate. Every sampled citation
resolved to the claimed code with the claimed semantics; the single defect (the `k3`
readable-name inconsistency in one doc) has been corrected so the symbol now carries one
readable name (`resolveEffortFromLayers`) across all module docs and the additions file.
