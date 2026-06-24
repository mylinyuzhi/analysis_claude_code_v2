# Anchor Dossier — `/simplify` bundled skill (Claude Code v2.1.183)

> Readable-source restoration of the `/simplify` bundled skill as it exists in **v2.1.183**.
> PRIMARY truth = `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.
> Reconstructed file: `reconstructed_source/skills/bundled/simplify.ts`.

## 1. Load-bearing symbols (v2.1.183)

| Readable | Obf | Line | Role |
|----------|-----|------|------|
| `registerSimplifySkill` | `OKl` | `cli_inner_pretty.js:647978` | Exporter; calls `ap(...)` (`registerBundledSkill`) with the skill `Command` definition |
| `registerBundledSkill` | `ap` | `:546973` | Registrar (= v2.1.88 `registerBundledSkill`); emits the `Command` object |
| skill `name` (`"simplify"`) | `BUt` | `:372051` | `BUt = "simplify"` — the slash-command name |
| `SIMPLIFY_PROMPT` | `ZOf` | declared `:648003`; assigned in module-init `NKl` `:648004` (body `:648007-648036`) | The big template string assembled from the angle blocks |
| (module init) | `NKl` | `:648004` | Lazy ESM module initializer that assigns `ZOf` (calls `Pg()`, `OH()` then sets `ZOf`) |
| `DIFF_PREAMBLE` (Phase 0) | `_dt` | `:435519` | "## Phase 0 — Gather the diff" block, prepended before Phase 1 |
| `REUSE_ANGLE_BODY` | `bdt` | `:435521` | Body of the **Reuse** angle (the `### Reuse` header is hardcoded in `ZOf`) |
| `SIMPLIFICATION_ANGLE` | `fLe` | `:435525` | Full **Simplification** angle (header + body) |
| `EFFICIENCY_ANGLE` | `mLe` | `:435531` | Full **Efficiency** angle (header + body) — **changed vs 2.1.156** (see §4) |
| `CONVENTIONS_ANGLE` | `Sdt` | `:435541` | **Conventions (CLAUDE.md)** angle — DEFINED in 183 but **NOT used** by `/simplify` (see §5) |
| `ALTITUDE_ANGLE` | `ALe` | `:435554` | Full **Altitude** angle (header + body) — the 4th angle |
| `AGENT_TOOL_NAME` (`"Agent"`) | `vs` | `:149939` | `vs = "Agent"` — interpolated as `${vs}` in `ZOf` Phase 1 |

The five angle constants (`_dt`, `bdt`, `fLe`, `mLe`, `Sdt`, `ALe`) live in one shared `var` declaration block at `:435519` (they are reused by `/code-review` and other review prompts, hence the shared module location, not co-located with `OKl`).

## 2. Verbatim prompt strings captured (line ranges, 183 bundle)

| String | Lines | Notes |
|--------|-------|-------|
| `SIMPLIFY_PROMPT` (`ZOf` assembly) | `:648007-648036` | Backtick template with `${_dt}`, `${vs}`, `${bdt}`, `${fLe}`, `${mLe}`, `${ALe}` interpolations |
| `_dt` (Phase 0 preamble) | `:435519-435520` | Double-quoted JS string with `\n` escapes (decoded to real newlines in the `.ts`) |
| `bdt` (Reuse body) | `:435521-435524` | Backtick string |
| `fLe` (Simplification) | `:435525-435530` | Backtick string |
| `mLe` (Efficiency) | `:435531-435540` | Backtick string (longest — includes the closures/memory-leak paragraph) |
| `ALe` (Altitude) | `:435554-435559` | Backtick string |
| `menuDescription` | `:647981` | `"Clean up the changed code without changing behavior"` |
| `description` | `:647982-647983` | `"Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that."` |
| `argumentHint` | `:647984` | `"[<target>]"` |
| `getPromptForCommand` arg-prefix | `:647987-648000` | Prepends ``Review target: `<t>`\n\n`` when an arg is present |

All `—` escapes in the bundle decode to the em-dash `—`; `→` decodes to the right-arrow `→`. These are written as the real characters in the reconstructed `.ts`.

Corroborating asset (decoded prompt, no obf): `extract/assets/prompts/194_simplify-4-cleanup-agents-in-parallel.txt` — matches `ZOf` exactly with the `${...}` interpolation slots blanked.

## 3. v2.1.88 ancestor mapping

Ancestor: `/lyz/codespace/3rd/claude-code/src/skills/bundled/simplify.ts` (`registerSimplifySkill`, `SIMPLIFY_PROMPT`).

| v2.1.88 ancestor | v2.1.183 equivalent | Change |
|------------------|--------------------|--------|
| `registerSimplifySkill()` | `OKl` (`registerSimplifySkill`) | Same exporter shape; new `menuDescription` + `argumentHint` fields passed |
| `SIMPLIFY_PROMPT` (one inline `const`) | `ZOf`, assembled from `_dt`+`bdt`+`fLe`+`mLe`+`ALe` | Prompt fully rewritten; angle bodies factored into shared module-level consts |
| Phase 1 = **3** review agents (Reuse / Quality / Efficiency) | Phase 1 = **4** review agents (Reuse / Simplification / Efficiency / **Altitude**) | **3 → 4 agents** (see §4) |
| `description: 'Review changed code for reuse, quality, and efficiency, then fix any issues found.'` | `description: '...reuse, simplification, efficiency, and altitude cleanups...Quality only — it does not hunt for bugs; use /code-review for that.'` | Reworded; adds "altitude", "Quality only", `/code-review` pointer |
| `getPromptForCommand(args)` appends `## Additional Focus\n\n${args}` | `getPromptForCommand(e)` **prepends** ``Review target: `${t}``` | Arg handling moved from suffix "Additional Focus" to prefix "Review target" |
| no `menuDescription`/`argumentHint` | `menuDescription`, `argumentHint: "[<target>]"` | New `BundledSkillDefinition` fields |
| `import { AGENT_TOOL_NAME } from '../../tools/AgentTool/constants.js'` | `${vs}` = `AGENT_TOOL_NAME` = `"Agent"` `:149939` | Same tool-name constant, same interpolation |

### The 3→4 agent evolution — what the 4th "Altitude" angle is

The v2.1.88 ancestor launched **three** agents: *Code Reuse Review*, *Code Quality Review*, *Efficiency Review*. v2.1.183 launches **four**, restructured as four "angles" passed one-per-agent:

1. **Reuse** (`bdt`) — re-implementation of existing helpers; Grep utility/adjacent modules; name the existing helper. (≈ ancestor "Code Reuse Review", condensed.)
2. **Simplification** (`fLe`) — redundant/derivable state, copy-paste-with-variation, deep nesting, dead code. (≈ ancestor "Code Quality Review", condensed.)
3. **Efficiency** (`mLe`) — redundant computation/repeated I/O, missed concurrency, hot-path/startup blocking, **plus the new closure/captured-environment memory-leak check**. (≈ ancestor "Efficiency Review", expanded.)
4. **Altitude** (`ALe`) — **NEW 4th angle**. Checks each change is implemented at the *right depth*, not as a "fragile bandaid". Heuristic: "Special cases layered on shared infrastructure are a sign the fix isn't deep enough — prefer generalizing the underlying mechanism over adding special cases." There is **no** v2.1.88 ancestor for this angle; it is a genuinely new review dimension introduced after 2.1.88.

## 4. v2.1.156 → v2.1.183 delta

The skill was **already 4-agent in v2.1.156** (`name:"simplify"`@538-era, prompt `Ehz`, angles `dq$`/`BI8`/`cq$`/`lq$`/`nq$`, tool `sq`="Agent"). So the 3→4 jump predates 2.1.156. The 2.1.156→2.1.183 delta is:

1. **Re-mangled symbols + line shifts** (no behavior change):
   - prompt `Ehz` → `ZOf`; module-init `kO9` → `NKl`; registrar `T(...)` form → `E(...)` form (`ap` unchanged).
   - angles: `dq$`→`_dt`, `BI8`→`bdt`, `cq$`→`fLe`, `lq$`→`mLe`, `nq$`→`ALe`; tool `sq`→`vs`.
2. **Efficiency angle wording EXPANDED** (the only prompt-text change for `/simplify`):
   - 2.1.156 `lq$` ended: `...blocking work added to startup or hot paths. Name the cheaper alternative.`
   - 2.1.183 `mLe` inserts a new paragraph before the closing sentence:
     `Also flag long-lived objects built from closures or captured environments — they keep the entire enclosing scope alive for the object's lifetime (a memory leak when that scope holds large values); prefer a class/struct that copies only the fields it needs.`
3. **New unused angle defined**: `Sdt` "### Conventions (CLAUDE.md)" appears in the 183 shared block (`:435541`) but is **not** referenced by `ZOf` — `/simplify` still wires only Reuse/Simplification/Efficiency/Altitude. (It is consumed elsewhere, e.g. the `/code-review` family.) See §5.
4. **New `menuDescription` field added**: 2.1.183 registration (`OKl`@647978) adds `menuDescription: "Clean up the changed code without changing behavior"` (`:647981`). The 2.1.156 registration (`vO9`@601350) had **no** `menuDescription` field at all — it went straight from `name:"simplify"` to `description:`. Verified by reading `vO9` `:601350-601372` in the 2.1.156 bundle.
5. `description`, `argumentHint`, `userInvocable`, the `Review target:` arg-prefix, Phase 0 / Phase 1 / Phase 2 body text are all **byte-identical** 156↔183. (`menuDescription` is NOT — see point 4.)

## 5. Open questions

- `Sdt` ("Conventions (CLAUDE.md)") is defined in the same shared `var` block (`:435541`) but is NOT interpolated into `ZOf` for `/simplify` in 183. Confirmed by reading `ZOf` (`:648006-648075`): only `_dt`, `bdt`, `fLe`, `mLe`, `ALe` are used. It is recorded here as an adjacent constant but intentionally excluded from the reconstruction. (Likely wired into the `/code-review` prompt; out of scope for this unit.)
- The module-init wrapper `NKl` (`:648004`) calls `Pg()` and `OH()` before assigning `ZOf` — these are ESM lazy-init dependency primers (the bundler's `__esmMin` pattern), not part of the skill's behavior. Reconstructed as plain top-level `const`s in the `.ts` (the readable idiom), which is faithful to the v2.1.88 ancestor.
