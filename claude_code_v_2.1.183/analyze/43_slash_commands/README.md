# 43 — Slash Commands (`/loop` · `/goal` · `/batch` · `/simplify`) — Claude Code v2.1.183

> **What this module is.** A **Layer-2 readable-source reconstruction** — the same
> kind of source-level restoration as [`04_tools`](../04_tools/), [`40_system_prompt`](../40_system_prompt/),
> and [`41_system_reminder`](../41_system_reminder/) — of **four user-facing slash commands** as they
> exist in Claude Code **v2.1.183**. The four commands are restored as clean,
> line-anchored TypeScript organized exactly the way the genuine Anthropic source
> tree organizes them (the v2.1.88 named-TS layout under
> [`/lyz/codespace/3rd/claude-code/src`](file:///lyz/codespace/3rd/claude-code/src)).
> Three of the four — `/batch`, `/loop`, `/simplify` — have a **direct named-TS
> ancestor** in v2.1.88, so their reconstruction is a *port-forward* of a real file
> rather than an invented shape; `/goal` is a **2.1.156-era** addition with no
> ancestor, reconstructed in the `commands/effort/` idiom it mirrors. Every factual
> claim below is verified against the primary truth, the v2.1.183 bundle
> `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
> (699,346 lines); each `cli_inner_pretty.js:<line>` citation is a v2.1.183 line
> unless tagged *(v2.1.156)* or *(v2.1.88)*.

---

## The four commands at a glance

> **Note.** This is a *command-overview* table (kind/registrar/purpose/ancestor/delta), **not** an
> obfuscated→readable symbol-mapping table — symbol mappings live only in the central index and the
> per-feature additions file (see [Related Symbols](#related-symbols)). It is included here per the
> CLAUDE.md exception for descriptive command catalogs.

| Command | Kind | Registrar (obf) | One-line purpose | v2.1.88 ancestor | 2.1.156 → 2.1.183 delta |
|---------|------|-----------------|------------------|------------------|--------------------------|
| `/loop` | bundled skill (`type:'prompt'`, `source:'bundled'`) | `registerLoopSkill` (`_1f`, `:649251`) | Run a prompt/slash-command on a recurring interval, or self-pace with no interval | `src/skills/bundled/loop.ts` (**fixed-interval only**) | **only** the new `menuDescription` field (`:649254`) — the dynamic/`loop.md`/autonomous machinery already shipped in 2.1.156 |
| `/batch` | bundled skill (`type:'prompt'`, `disableModelInvocation:true`) | `registerBatchSkill` (`pzl`, `:637828`) | Plan a large change, then spawn 5–30 worktree background agents that each open a PR | `src/skills/bundled/batch.ts` (worker step 1 was `simplify`) | **only** the new `menuDescription` field (`:637831`); worker step 1 was already `code-review` by 2.1.156 |
| `/simplify` | bundled skill (`type:'prompt'`) | `registerSimplifySkill` (`OKl`, `:647978`) | Quality cleanup: 4 parallel review agents (Reuse/Simplification/Efficiency/Altitude), then apply fixes | `src/skills/bundled/simplify.ts` (**3 agents**: Reuse/Quality/Efficiency) | new `menuDescription` (`:647981`) **+** the Efficiency angle's new closure/captured-environment memory-leak paragraph |
| `/goal` | dual `Command`: `local-jsx` + `local` twin | default export `xmf` `:562070` (= `Cmf`, the local-jsx) | Set a session goal Claude checks (via a Stop hook) before it is allowed to stop | *none* (2.1.156-era addition) | **only** the local-jsx `description` text (`:562053` "Set a goal Claude checks before stopping" vs the twin's "…keep working until the condition is met" `:562063`) |

All four are wired into the registry from the same idempotent init function
`initBundledSkills` (`FJn`, `:660991`) — the three bundled skills via the shared
registrar `registerBundledSkill` (`ap`, `:546973`), and `/goal` as a standalone
default-exported `Command` object. The headline is the same across all four:
**2.1.183 was a labeling/UX pass, not a behavior rewrite** — the only logic change
anywhere in the module is `/simplify`'s one new Efficiency paragraph (`:647978`);
every other delta is the new `menuDescription` slash-menu label or a description edit.

---

## Analysis documents

The module is one hub doc plus four per-command deep-dives. Read the hub first for
the shared machinery (how a command becomes a `Command`, the three command *types*,
how `getPromptForCommand` blocks get injected as the next turn), then the
per-command docs for the prompt logic and dispatch.

- **[registration_and_dispatch.md](./registration_and_dispatch.md)** — the hub.
  `registerBundledSkill` (`ap`, `:546973`) registrar and the emitted `Command` field
  set; `initBundledSkills` (`FJn`, `:660991`) registry init; the three command
  *types* (`prompt` / `local-jsx` / `local`); the lazy file-extraction machinery
  (dormant for these four); and the prompt-command dispatch runner that turns
  `getPromptForCommand` output into the next user turn.
- **[loop_command.md](./loop_command.md)** — `/loop`. The richest of the four: a
  3-way dispatch (default-prompt path / dynamic self-pacing / legacy fixed-interval
  cron), interval parsing, the `ScheduleWakeup` + `Monitor` event-gating self-pacing
  algorithm, and the `loop.md` / autonomous-default branches.
- **[goal_command.md](./goal_command.md)** — `/goal`. The Stop-hook mechanism:
  `setGoal` (`Qdt`, `:454466`) installs a session-scoped empty-matcher `prompt` Stop
  hook carrying the condition; `buildGoalPrompt` (`UGn`, `:454505`) injects the
  directive; auto-clear on success; the hooks-before-trust gate (`ego`, `:454461`);
  the 4000-char cap (`Xdt`, `:454503`); and the interactive Ink dialog vs the
  non-interactive twin.
- **[batch_command.md](./batch_command.md)** — `/batch`. The coordinator prompt
  (`buildBatchPrompt`, `h$f`, `:637757`) — 3 phases: plan-mode research/decompose
  into 5–30 units + e2e recipe → spawn worktree background agents → track a PR table
  — and the verbatim worker instructions (`g$f`, step 1 = the `code-review` skill);
  the `disableModelInvocation:true` flag and the `getIsGit` (`T_`) gate.
- **[simplify_command.md](./simplify_command.md)** — `/simplify`. The 4 parallel
  review agents (Reuse `bdt` / Simplification `fLe` / Efficiency `mLe` / Altitude
  `ALe`) launched via the Agent tool, then the apply-fixes phase; quality-only
  (defers correctness bugs to `/code-review`); the 3→4 agent evolution and why the
  5th "Conventions (CLAUDE.md)" angle (`Sdt`, `:435541`) exists but is *not* wired in.

**[reconstructed_source/](./reconstructed_source/)** — the readable TypeScript
restoration that all five docs analyze. Layout mirrors the v2.1.88 `src/` tree:

```
reconstructed_source/
├── skills/
│   ├── bundledSkills.ts          # registerBundledSkill registrar + BundledSkillDefinition (ap@546973)
│   └── bundled/
│       ├── index.ts              # initBundledSkills registry (FJn@660991)
│       ├── loop.ts               # registerLoopSkill — fixed + dynamic + loop.md + autonomous (_1f@649251)
│       ├── batch.ts              # registerBatchSkill — coordinator + worker (pzl@637828)
│       └── simplify.ts           # registerSimplifySkill — 4 cleanup agents (OKl@647978)
└── commands/
    └── goal/
        ├── index.ts              # local-jsx Cmf + local Imf Command defs (default xmf@562070)
        ├── goal.tsx              # interactive Ink dialog (APl) + selectors + Tmf call
        └── goalNonInteractive.ts # the type:'local' twin (wmf) + setGoal/clearGoal/validate machinery
```

The anchor dossiers (`_anchors_loop.md`, `_anchors_goal.md`, `_anchors_batch.md`,
`_anchors_simplify.md`, `_anchors_registrar.md`) and the reconstruction conventions
(`_conventions.md`) sit alongside the `.ts` files in `reconstructed_source/`.

---

## Reconstruction provenance

This module is a **build → adversarial-verify** restoration, not a paraphrase. The
pipeline was:

1. **Scout** the four commands in the v2.1.183 bundle, pinning every registrar,
   prompt builder, constant, and verbatim prompt string to an exact
   `cli_inner_pretty.js:<line>` anchor (the `_anchors_*.md` dossiers).
2. **Build** the readable TypeScript by porting the v2.1.88 named-TS ancestor forward
   to the v2.1.183 prompt text + registration flags (for `/batch` `/loop` `/simplify`),
   or reconstructing the `Command` shape in the `commands/effort/` idiom (for `/goal`).
   The verbatim prompt template strings are copied **byte-for-byte** from the bundle —
   they *are* the user-facing behavior, so they are never paraphrased or reflowed.
3. **Adversarially verify** every reconstructed function/constant/branch/string back
   against the bundle, line by line, and compute the 2.1.156 → 2.1.183 delta against
   the before-picture bundle.

The result: **13 `.ts`/`.tsx` files, ~1,822 LOC**, every top-level symbol carrying a
line anchor; the verbatim prompt strings re-read against the bundle (and corroborated
by the decoded `extract/assets/prompts/*.txt` and `extract/assets/slash_commands.json`
assets). The cross-validation pass scored **5/5 units PASS** (the four commands plus
the shared registrar/dispatch). Details, including the per-unit verdicts and the
spot-checked anchors, are in
**[cross_validation_report_slash_commands.md](../00_overview/cross_validation_report_slash_commands.md)**.

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc (per CLAUDE.md,
> Slash Commands route to the integration index):
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, Plugin, IDE, UI) — primary index for this module
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks — `/goal`'s Stop-hook mechanism; Skills)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools — the dispatch/turn-injection runner)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model)
> - [symbol_additions_v2_1_183_slash_commands.md](../00_overview/symbol_additions_v2_1_183_slash_commands.md) - the new/changed v2.1.183 symbols for this module

Key functions/constants in this module (list format, per CLAUDE.md):

- `registerBundledSkill` (obfuscated: `ap`, `cli_inner_pretty.js:546973`) — the shared bundled-skill registrar; emits the `Command{type:'prompt',source:'bundled'}` and pushes it to the registry. v2.1.88 ancestor in `src/skills/bundledSkills.ts`.
- `initBundledSkills` (obfuscated: `FJn`, `cli_inner_pretty.js:660991`) — idempotent registry init that registers all three bundled skills (`OKl()`/`pzl()`/lazily-bound `registerLoopSkill`).
- `registerLoopSkill` (obfuscated: `_1f`, `cli_inner_pretty.js:649251`) — `/loop`; `menuDescription` at `:649254`; `isEnabled = isLoopEnabled`.
- `registerBatchSkill` (obfuscated: `pzl`, `cli_inner_pretty.js:637828`) — `/batch`; `menuDescription` at `:637831`; `disableModelInvocation:true`; `MIN_AGENTS`=5 (`uzl`)/`MAX_AGENTS`=30 (`dzl`) at `:637847-637848`.
- `registerSimplifySkill` (obfuscated: `OKl`, `cli_inner_pretty.js:647978`) — `/simplify`; `menuDescription` at `:647981`; 4 review angles (Reuse `bdt`/Simplification `fLe`/Efficiency `mLe`/Altitude `ALe`).
- `goalLocalJsxCommand` (obfuscated: `Cmf`, `cli_inner_pretty.js:562050`) — `/goal`'s `local-jsx` interactive entry; description `:562053`; default-exported as `xmf` (`:562070`).
- `goalCommand` non-interactive twin (obfuscated: `Imf`, `cli_inner_pretty.js:562058`) — `type:'local'`; description `:562063`.
- `setGoal` / `validateGoalCondition` (obfuscated: `Qdt`, `cli_inner_pretty.js:454466`) — installs the session-scoped empty-matcher `prompt` Stop hook carrying the goal condition.
- `buildGoalPrompt` (obfuscated: `UGn`, `cli_inner_pretty.js:454505`) — the verbatim Stop-hook directive injected when a goal is set; `MAX_GOAL_CONDITION_CHARS`=4000 (`Xdt`, `:454503`).
