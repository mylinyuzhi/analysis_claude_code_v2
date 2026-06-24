# Slash Commands `/loop` `/goal` `/batch` `/simplify` — Readable-Source Restoration (v2.1.183)

> **What this is.** A *readable-source-level* reconstruction of **four user-facing slash commands** —
> **`/loop`**, **`/goal`**, **`/batch`**, **`/simplify`** — **as they exist in Claude Code v2.1.183** —
> not a delta, the *whole command* (carryover included) — written as clean TypeScript organized the way
> the genuine Anthropic source tree (the v2.1.88 named-TS at `/lyz/codespace/3rd/claude-code/src`)
> organizes it.
>
> **Why it exists.** Three of these four commands have a *direct named-TypeScript ancestor* in the
> v2.1.88 tree (`src/skills/bundled/{loop,batch,simplify}.ts`), so the reconstruction is unusually
> strong: it is a *port-forward* of that named source to the exact v2.1.183 prompt text and registration
> flags, not an invented shape. `/goal` has no ancestor (it is a 2.1.156-era addition) and mirrors the
> `src/commands/effort/` `Command` convention. This directory restores the full subsystem at the source
> level so you can read the implementation top-to-bottom without cross-referencing version trees.
>
> Every behavior here is backed by a v2.1.183 line that was read directly; every reconstructed
> function carries a `// 2.1.183: <readable> = <obf> @<line>` anchor so any claim can be re-verified in
> seconds.

---

## How to read these files (the three evidence tiers)

These files were built — and adversarially verified — under a strict evidence discipline (the full
rules live in [`_conventions.md`](./_conventions.md)):

1. **PRIMARY — truth.** The v2.1.183 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines).
   Every symbol, constant, branch, and verbatim prompt string was verified by reading the exact
   line(s). Obfuscated names re-mangle every build, so all were re-derived in this build (never trusted
   from another version). Rich extracted assets corroborate the verbatim prompts:
   `assets/slash_commands.json` (lists `/batch`,`/goal`,`/loop`), `assets/prompts/194_simplify-4-cleanup-agents-in-parallel.txt`,
   `assets/prompts/093|097_autonomous-loop-*.txt`.
2. **SCAFFOLD — the 2.1.156 before-picture.** The v2.1.156 obfuscated bundle
   `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`. All four commands
   already exist there; it is used *only* to compute the 2.1.156→2.1.183 **delta** (what changed), never
   to copy logic — the 183 bundle is read directly for every claim.
3. **CONVENTION + TEMPLATE — the v2.1.88 named-TS source.** For `batch`/`loop`/`simplify`, the files
   `src/skills/bundled/{batch,loop,simplify}.ts` are the **direct readable ancestors**: module-level
   prompt `const`s, a `buildPrompt(args)` helper, a `registerXSkill()` exporter calling
   `registerBundledSkill({...})`, ESM `.js` import specifiers, tool-name constants imported from
   `tools/*/constants.js`. For `goal` there is **no ancestor** — only the *shape* of a `local-jsx`
   immediate command (`src/commands/effort/{index,effort}.tsx`) plus the `type:'local'` non-interactive
   twin. The registrar shape is `src/skills/bundledSkills.ts` (`registerBundledSkill`,
   `BundledSkillDefinition`); the registry is `src/skills/bundled/index.ts` (`initBundledSkills`).

The single load-bearing identity that makes tier 3 strong: the `ap` registrar
(`cli_inner_pretty.js:546973`) **is** v2.1.88's `registerBundledSkill()` — same emitted `Command` object
(`type:'prompt'`, `source:'bundled'`, `getPromptForCommand`, `isHidden:!userInvocable`, …). So porting
the v2.1.88 skill file forward = reconstruction, not invention.

---

## File map

Each `.ts`/`.tsx` file restores one slice. The **role** is the one-line job; **LOC** is the
reconstructed line count; the **primary obf anchor** is the load-bearing entry point (all line numbers
are `cli_inner_pretty.js`). All four commands route to the *Slash Commands* module
(`00_overview/symbol_index_infra_integration.md`).

| File | Role | LOC | Primary obf anchor |
|------|------|-----|--------------------|
| [`skills/bundledSkills.ts`](./skills/bundledSkills.ts) | The shared registrar: `registerBundledSkill` emits the `Command{type:'prompt',source:'bundled'}` and pushes it to the registry; plus the lazy skill-file extraction machinery and the `BundledSkillDefinition` type. | 320 | `registerBundledSkill` = `ap` @546973 |
| [`skills/bundled/index.ts`](./skills/bundled/index.ts) | The registry: `initBundledSkills` registers `/simplify`, `/batch`, `/loop` **unconditionally** (idempotent); loop's visibility is decided lazily per-invocation by `isEnabled`. | 68 | `initBundledSkills` = `FJn` @660991 |
| [`skills/bundled/loop.ts`](./skills/bundled/loop.ts) | `/loop` — recurring prompt/command runner: 3-way dispatch over default-prompt (`loop.md`/autonomous) × dynamic self-pacing / cron × file/autonomous; dynamic pacing via `ScheduleWakeup` + `Monitor` event-gating; legacy fixed-interval cron. | 570 | `registerLoopSkill` = `_1f` @649251 |
| [`skills/bundled/batch.ts`](./skills/bundled/batch.ts) | `/batch` — large-change coordinator: a 3-phase plan-mode prompt (research/decompose into 5–30 units/e2e recipe → spawn worktree+background agents → track a PR table) plus the per-worker instructions (step 1 = the `code-review` skill). | 176 | `registerBatchSkill` = `pzl` @637828 |
| [`skills/bundled/simplify.ts`](./skills/bundled/simplify.ts) | `/simplify` — 4 parallel review agents (Reuse / Simplification / Efficiency / **Altitude**) via the Agent tool, then apply fixes; quality-only (defers bugs to `/code-review`). | 150 | `registerSimplifySkill` = `OKl` @647978 |
| [`commands/goal/index.ts`](./commands/goal/index.ts) | `/goal` — the dual `Command` registration: a `local-jsx` immediate interactive command plus a `type:'local'` non-interactive twin (+ default export). | 58 | `goalLocalJsxCommand` = `Cmf` @562050 / `goalCommand` = `Imf` @562058 |
| [`commands/goal/goal.tsx`](./commands/goal/goal.tsx) | `/goal` interactive path: the Ink `ActiveGoalDialog` (active / achieved / no-goal states), the 1 s re-render tick, the active-goal selector, and the `local-jsx` `call`. | 234 | `ActiveGoalDialog` = `APl` @561812 / call `Tmf` @561989 |
| [`commands/goal/goalNonInteractive.ts`](./commands/goal/goalNonInteractive.ts) | `/goal` non-interactive twin + shared machinery: `validateGoalCondition` installs a session-scoped empty-matcher `prompt` **Stop hook** carrying the condition; `buildGoalPrompt` directive; auto-clear when met; the trust/hooks gate; `MAX_GOAL_CONDITION_CHARS`=4000; clear-keyword set. | 246 | `goalNonInteractive` = `wmf` @562015 / `validateGoalCondition` = `Qdt` @454466 |

> Note on file boundaries: the v2.1.183 bundle is a single concatenated file, so several of these
> modules are co-located there (the registrar helpers `ap`/`Lwo`/`scf`/`icf` cluster @546973–547088; the
> goal machinery — `validateGoalCondition`, `buildGoalPrompt`, `MAX_GOAL_CONDITION_CHARS`, the clear-
> keyword set `qUp` — lives in one chunk @454437–454518, *separate* from the goal command registration
> @562046–562071). The split into `index.ts` / `goal.tsx` / `goalNonInteractive.ts` follows the v2.1.88
> module conventions; each file's header discloses where its content physically sits in the bundle. The
> behavior is faithful to those exact lines — only the grouping is a convention choice.

---

## Registration topology (how a typed `/cmd` reaches its prompt)

```
initBundledSkills (FJn @660991, idempotent)
   ├── registerSimplifySkill (OKl @647978) ─┐
   ├── registerBatchSkill    (pzl @637828) ─┤→ ap()/registerBundledSkill @546973
   └── registerLoopSkill     (_1f @649251) ─┘   emits Command{type:'prompt', source:'bundled'}
                                                pushed to the bundled-skill registry

goal is NOT a bundled skill — it is a dual Command registered directly:
   goalLocalJsxCommand (Cmf @562050, local-jsx, immediate)  ← default export (xmf @562070)
   goalCommand         (Imf @562058, local, non-interactive twin)
```

`/simplify` `/batch` `/loop` are *prompt* skills (the registrar turns a definition into a `Command`
whose `getPromptForCommand` returns the built prompt). `/goal` is a *command* (it runs code: it
installs a Stop hook / opens an Ink dialog), so it bypasses the skill registrar entirely.

---

## Suggested reading order

1. **`skills/bundledSkills.ts`** — the registrar contract: what a `BundledSkillDefinition` is and what
   `Command` it emits. Read this first; the three skills are just data fed to it.
2. **`skills/bundled/index.ts`** — where the three skills are wired up (unconditional registration; lazy
   visibility gating).
3. **`skills/bundled/simplify.ts`** — the simplest skill: a static 4-agent prompt. Good warm-up for the
   verbatim-prompt format.
4. **`skills/bundled/batch.ts`** — the coordinator/worker 3-phase prompt; the git gate.
5. **`skills/bundled/loop.ts`** — the most intricate skill: the 3-way default-prompt/dynamic/cron
   dispatch and the dynamic self-pacing machinery.
6. **`commands/goal/index.ts` → `goal.tsx` → `goalNonInteractive.ts`** — the dual command: registration,
   then the interactive dialog, then the Stop-hook machinery that is the heart of `/goal`.

For *what changed* between v2.1.156 and v2.1.183 specifically, the delta is summarized below and
detailed in each file's header. For deeper per-command narrative, read the five anchor dossiers
(next section).

---

## The 2.1.156 → 2.1.183 delta (what actually changed)

Each command's full machinery already shipped by 2.1.156; the 2.1.183 deltas are deliberately tiny and
each is pinned to a 183 line:

- **`/loop`** — ONLY the new `menuDescription` field on the registration
  (`"Repeat a prompt or command on an interval (e.g. /loop 5m /foo)"`, `cli_inner_pretty.js:649254`). The
  entire dynamic / `loop.md` / autonomous machinery already shipped in 2.1.156. (The v2.1.88 ancestor
  was fixed-interval cron *only*.)
- **`/batch`** — ONLY the new `menuDescription`
  (`"Plan a large change; background agents each open a PR"`, `cli_inner_pretty.js:637831`); all prompt
  bodies are byte-identical to 2.1.156. (Worker step 1 changed from `simplify` to `code-review` *before*
  2.1.156, vs the v2.1.88 ancestor.)
- **`/simplify`** — TWO changes: a new `menuDescription`
  (`"Clean up the changed code without changing behavior"`, `cli_inner_pretty.js:647981`) and an
  expanded Efficiency angle (a closure / captured-environment memory-leak paragraph, `ALe`/`mLe`
  region). The 4th "Altitude" angle (`ALe` @435554) was added *before* 2.1.156, vs the v2.1.88 3-agent
  form; a 5th "Conventions (CLAUDE.md)" angle (`Sdt` @435541) exists in the bundle but is *not* wired
  into `/simplify`.
- **`/goal`** — ONLY the local-jsx command's description text: `"Set a goal Claude checks before
  stopping"` (`cli_inner_pretty.js:562053`) vs the non-interactive twin's unchanged
  `"Set a goal — keep working until the condition is met"` (`cli_inner_pretty.js:562063`). The Stop-hook
  machinery is byte-identical to 2.1.156.

---

## Provenance: the build → verify pipeline (5/5 PASS)

Each file was produced by a reconstruction agent (tier-3 port-forward where an ancestor exists,
shape-mirror where it does not), then **independently re-verified** against the cited v2.1.183 lines.
The provenance trail is the **five `_anchors_*.md` dossiers** — one per reconstruction unit — each
listing the load-bearing obf→readable symbols, their exact lines, and the verbatim-prompt cross-checks:

- [`_anchors_registrar.md`](./_anchors_registrar.md) — the shared `registerBundledSkill` (`ap`) registrar,
  the registry + `getBundledSkills` accessor, the lazy file-extraction machinery, and `initBundledSkills`
  (`FJn`). Backs `skills/bundledSkills.ts` + `skills/bundled/index.ts`.
- [`_anchors_loop.md`](./_anchors_loop.md) — `/loop`: the 3-way dispatch, prompt builders, the `_9e`
  default-prompt/autonomous module, the sentinels, and the gates. Backs `skills/bundled/loop.ts`.
- [`_anchors_batch.md`](./_anchors_batch.md) — `/batch`: `buildBatchPrompt` (`h$f`), `WORKER_INSTRUCTIONS`
  (`g$f`), the 5/30 agent caps, the git gate. Backs `skills/bundled/batch.ts`.
- [`_anchors_simplify.md`](./_anchors_simplify.md) — `/simplify`: `SIMPLIFY_PROMPT` (`ZOf`), the four
  angle blocks, and the unwired 5th angle (`Sdt`). Backs `skills/bundled/simplify.ts`.
- [`_anchors_goal.md`](./_anchors_goal.md) — `/goal`: the dual command, the Ink dialog, the Stop-hook
  machinery (`validateGoalCondition`/`buildGoalPrompt`/`clearGoal`), the trust/hooks gate, and the
  clear-keyword set. Backs the three `commands/goal/` files.

Outcome: **5/5 PASS** — one PASS per reconstruction unit (registrar, loop, batch, simplify, goal), every
headline anchor re-read directly in the live 2.1.183 bundle, zero defects in the primary-truth anchors.

---

## How to re-verify any claim (60-second loop)

Every reconstructed top-level symbol carries a `// 2.1.183: <readable> = <obf> @<line>` anchor, and
non-trivial branches carry inline `// @<line>` anchors. To check one:

1. Read the anchor, e.g. `// 2.1.183: registerSimplifySkill = OKl @647978`.
2. Print the exact line(s) from the bundle:
   ```bash
   sed -n '647978,647979p' /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
   # → function OKl() {  /  ap({  ...
   ```
3. Confirm the obf name, the structure, and (for prompts) the verbatim string match the reconstruction.

Representative anchors confirmed during the build (all in `cli_inner_pretty.js`):

- `registerBundledSkill` = `ap` @546973 — `function ap(e) {`
- `initBundledSkills` = `FJn` @660991 — `function FJn() {`
- `registerSimplifySkill` = `OKl` @647978; `registerBatchSkill` = `pzl` @637828; `registerLoopSkill` = `_1f` @649251 — all `function …() { ap({ … })`
- `/loop` `menuDescription` @649254; `/simplify` `menuDescription` @647981; `/batch` `menuDescription` @637831
- `/batch` caps `MIN_AGENTS` = `uzl` = 5, `MAX_AGENTS` = `dzl` = 30 @637847–637848
- `/simplify` 4th angle `Altitude` = `ALe` @435554 — `ALe = \`### Altitude…`
- `/goal` `goalLocalJsxCommand` = `Cmf` @562050 (desc @562053), `goalCommand` = `Imf` @562058 (desc @562063), default `xmf` @562070
- `/goal` `validateGoalCondition` = `Qdt` @454466, `buildGoalPrompt` = `UGn` @454505, gate `goalGateCheck` = `ego` @454461, `MAX_GOAL_CONDITION_CHARS` = `Xdt` = 4000 @454503, clear-keyword set `qUp` = `{clear,stop,off,reset,none,cancel}` @454518

---

## Related Symbols

> Symbol mappings live in the central index and the per-feature additions file (never as obf→readable
> tables in these docs). Each reconstructed `.ts`/`.tsx` file is itself the authoritative, line-anchored
> symbol map for its slice (via its `// 2.1.183: <readable> = <obf> @<line>` comments).
>
> - [symbol_index_infra_integration.md](../../00_overview/symbol_index_infra_integration.md) — **home module**: Slash Commands route here (LSP, Chrome, IDE, UI, Plugin, Code Indexing, Shell Parser, Slash Commands).
> - [symbol_index_core_features.md](../../00_overview/symbol_index_core_features.md) — Skills, Hooks (the `/goal` Stop hook), Background Agents (the `/batch` background spawn), Steering.
> - [symbol_index_core_execution.md](../../00_overview/symbol_index_core_execution.md) — the Agent tool / subagent spawn used by `/simplify` and `/batch`.
> - [symbol_index_infra_platform.md](../../00_overview/symbol_index_infra_platform.md) — feature-gate / settings reads behind `isLoopEnabled` / `isDynamicLoopEnabled` and the trust/hooks gate.

Anchor entry points (re-derived v2.1.183 names; each file is the full map):

- `registerBundledSkill` (`ap`, cli_inner_pretty.js:546973) — the shared registrar → `skills/bundledSkills.ts`.
- `initBundledSkills` (`FJn`, cli_inner_pretty.js:660991) — the registry → `skills/bundled/index.ts`.
- `registerLoopSkill` (`_1f`, cli_inner_pretty.js:649251) — `/loop` → `skills/bundled/loop.ts`.
- `registerBatchSkill` (`pzl`, cli_inner_pretty.js:637828) — `/batch` → `skills/bundled/batch.ts`.
- `registerSimplifySkill` (`OKl`, cli_inner_pretty.js:647978) — `/simplify` → `skills/bundled/simplify.ts`.
- `goalLocalJsxCommand` (`Cmf`, cli_inner_pretty.js:562050) / `goalCommand` (`Imf`, cli_inner_pretty.js:562058) — `/goal` registration → `commands/goal/index.ts`.
- `validateGoalCondition` (`Qdt`, cli_inner_pretty.js:454466) / `buildGoalPrompt` (`UGn`, cli_inner_pretty.js:454505) — the `/goal` Stop-hook machinery → `commands/goal/goalNonInteractive.ts`.
