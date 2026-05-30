# Shipped Skill Bodies in Scope: /simplify, /code-review, /claude-api (Opus 4.8 plus 4.7-to-4.8 Migration)

> Covers the bundled-skill bodies touched by the **2.1.143 → 2.1.156** skill-system delta, viewed *as skills* (registration, frontmatter, body composition, telemetry, file refs). The review **algorithm** itself (the multi-angle finder loop, ultra cloud review, `--fix`/`--comment`) is deferred to module [45_code_review](../45_code_review/). Companion docs in this module: [skill_fork_recursion_guard.md](./skill_fork_recursion_guard.md) (the `context: fork` self-reinvoke fix), [skill_disallowed_tools.md](./skill_disallowed_tools.md); the foundational Skill-record lifecycle lives in the 2.1.142 reference [../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md) (how a Skill record runs) alongside [../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_frontmatter.md](../../../claude_code_v_2.1.142/analyze/10_skill_system/skill_frontmatter.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Skills, Hooks, Compact, Plan, CLI
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop, Tools, State, Subagent
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry, Prompt, MCP, Permissions, Model
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Slash commands, UI, Plugin

Key symbols in this document:

- `registerBundledSkill` (`bA`) — turns a `BundledSkillDefinition` into a `type: "prompt"` Skill record with `source/loadedFrom: "bundled"`; wraps `getPromptForCommand` to merge extracted `files` (cli_inner_pretty.js:524187-524234)
- `extractAndGetSkillRoot` (`RAz`) — extracts a bundled skill's `files` map to a per-skill dir, returns the dir or `null` on failure (cli_inner_pretty.js:524241-524252)
- `prependBaseDir` (`mAz`) — prefixes the prompt blocks with a `Base directory for this skill: <dir>` line so the model can Read/Grep the extracted refs (cli_inner_pretty.js:524283-524289)
- `installLazyStringGetter` (`nwH`) — installs a getter for function-typed `description`/`argumentHint`/`whenToUse` so they compute lazily (cli_inner_pretty.js:222231-222234)
- `registerSimplifySkill` (`vO9`) — registers the `simplify` skill with its cleanup-only description and prompt builder (cli_inner_pretty.js:601350-601372)
- `SIMPLIFY_SKILL_BODY` (`Ehz`) — the `/simplify` body: "not hunting for bugs", 4 cleanup agents via the Agent tool, then apply (cli_inner_pretty.js:601378-601407)
- `CODE_REVIEW_SKILL_NAME` (`Y18`) — the literal `"code-review"`; skill name and slash command (cli_inner_pretty.js:211646)
- `registerCodeReviewSkill` (`zO9`) — registers the `code-review` skill with the `ultra→ultrareview` subcommand and a `getEffort` callback (cli_inner_pretty.js:600612-600624)
- `codeReviewDescription` (`eyz`) — function-typed description; appends the `ultra` clause only when cloud review is enabled (cli_inner_pretty.js:600558-600560)
- `skillToolCodeReviewGuidance` (`Qyz`) — coordinator post-implementation prompt that tells the worker to invoke the Skill tool with `skill: "code-review"` (cli_inner_pretty.js:600237-600242)
- `registerClaudeApiSkill` (`tSz`) — registers the `claude-api` skill: `allowedTools` Read/Grep/Glob/WebFetch, `files: cSz()`, emits `tengu_claude_api_skill_loaded` (cli_inner_pretty.js:612027-612046)
- `buildClaudeApiFiles` (`cSz`) — builds the `files` map by running each SKILL_FILES entry through model-var substitution (cli_inner_pretty.js:611935-611939)
- `detectProjectLanguage` (`nSz`) — scans cwd for language markers (`.py`, `package.json`, …) and returns the detected language (cli_inner_pretty.js:611940-611956)
- `buildClaudeApiPrompt` (`oSz`) — assembles the base prompt + Quick Task Reference + inlined `<doc>` blocks (cli_inner_pretty.js:611986-612021)
- `CLAUDE_API_QUICK_TASK_REFERENCE` (`rSz`) — the Quick Task Reference block; routes "Migrating to a newer model…" to `shared/model-migration.md` (cli_inner_pretty.js:612049-612050)
- `CLAUDE_API_SKILL_DESCRIPTION_BASE` (`aSz`) — base description string ("…migrating existing Claude API code between Claude model versions…") (cli_inner_pretty.js:612051-612052)
- `claudeApiSkillDescription` (`uj9`) — full description = `aSz` + TRIGGER/SKIP clauses (cli_inner_pretty.js:612071-612073)
- `SKILL_MODEL_VARS` (`d1q`) — `{{OPUS_ID}}=claude-opus-4-8`, `{{OPUS_NAME}}=Claude Opus 4.8`, … substituted into every doc (cli_inner_pretty.js:611874-611882)
- `SKILL_FILES` (`c1q`) — map of relative path → bundled markdown string; includes `shared/model-migration.md` (cli_inner_pretty.js:611884-611926)
- `MODEL_MIGRATION_DOC` (`wj9`) — the bundled `shared/model-migration.md` body; contains the actual "Migrating to Opus 4.8" prose (cli_inner_pretty.js:608931-609832)
- `OPUS_4_8_MODEL_IDS` (`Xi$`) — per-provider id map for `claude-opus-4-8` (cli_inner_pretty.js:91825-91834)
- `SKILL_TOOL_NAME` (`ZX`) — the literal `"Skill"`; interpolated into the code-review guidance (cli_inner_pretty.js:216282)
- `AGENT_TOOL_NAME` (`sq`) — the literal `"Agent"`; the subagent tool `/simplify` fans out across (cli_inner_pretty.js:185637)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]`; the effort enum `code-review` validates against (cli_inner_pretty.js:185009)

---

## TL;DR

Three bundled skills changed in this window, and all three flow through one registrar:

- **`registerBundledSkill` (`bA`)** is the single front door. It converts a plain JS definition object into a full Skill *record* (`type: "prompt"`, `source/loadedFrom: "bundled"`), and — when the definition carries a `files` map — wraps `getPromptForCommand` so that on first invocation the files are extracted to disk and a `Base directory for this skill: <dir>` header is prepended to the prompt. It is a near-verbatim descendant of 2.1.88's `registerBundledSkill` (`src/skills/bundledSkills.ts`), plus new pass-throughs (`disallowedTools`, `getEffort`, `progressMessage`, lazy function-typed descriptions).
- **`/simplify`** (registrar `vO9`, body `Ehz`) was **redefined in 2.1.154** to be **cleanup-only**. Its body opens with "you are improving the quality of the changed code, not hunting for bugs" and tells the model to launch **4** review agents in parallel via the Agent tool (`sq`), then apply the fixes. In 2.1.88 it launched **3** agents and *did* fix issues but without the "not bugs" framing — the bug-hunting half moved out to `/code-review`.
- **`/code-review`** (name constant `Y18 = "code-review"`, registrar `zO9`) is the bug-hunting counterpart. As a skill it is invoked two ways: the model calls the **Skill tool** (`ZX`) with `skill: "code-review"` (the coordinator guidance string `Qyz` literally instructs this), and the review then fans out across the **Agent tool** (`sq`). It carries an `ultra → ultrareview` subcommand alias and a `getEffort` callback so the effort word becomes a permission layer. (The review algorithm lives in module 45.)
- **`/claude-api`** (registrar `tSz`) gained **Opus 4.8 support and 4.7→4.8 migration guidance** in 2.1.154. The skill ships its docs as bundled `files`; the Quick Task Reference block (`rSz`) routes "Migrating to a newer model or replacing a retired model" to `shared/model-migration.md`, and the description (`aSz`/`uj9`) advertises migrations. The Opus 4.8 model id and name reach the docs through `{{OPUS_ID}}`/`{{OPUS_NAME}}` template variables (`d1q`). The actual 4.7→4.8 prose is **not inline in the registrar JS**; it lives in the bundled reference doc `shared/model-migration.md`, which *is* present in the bundle as the template-literal `wj9` (cli_inner_pretty.js:608931-609832) and is written to disk via the `files` mechanism. A `tengu_claude_api_skill_loaded` telemetry event (with `detected_lang`, `subcommand`, `has_args`) is **new** in this window.

**Cross-validation summary:** `registerBundledSkill`, `/simplify`, and `/claude-api` all have direct 2.1.88 precursors (`src/skills/bundledSkills.ts`, `src/skills/bundled/simplify.ts`, `src/skills/bundled/claudeApi.ts`). `/code-review` as a *bundled* skill is **new** post-2.1.88 (no `code-review` bundled skill in `src/skills/bundled/`). Body-level diffs are **medium** confidence because the migration doc text (`wj9`) and the per-language docs are data blobs whose 2.1.88 equivalents live in `claudeApiContent.js` (not in our `src/` tree). The Opus 4.8 model ids, `tengu_claude_api_skill_loaded`, and the 4 (vs 3) `/simplify` agents are **high** confidence (read directly from the bundle).

---

## 1. The bundled-skill registrar `bA` — how a definition becomes a Skill record

### What it does

`registerBundledSkill` (`bA`) is the compile-time registration path for skills that ship inside the CLI binary (as opposed to disk-loaded `SKILL.md` files or MCP skills). Every skill in this document is created by calling `bA({...})` exactly once, at module init. The output is a `Command`/Skill record pushed onto an internal registry (`Ji4`), later merged into the global skill list alongside disk and plugin skills.

### How it works (step by step)

```javascript
// ============================================
// registerBundledSkill - Build a bundled Skill record; wrap getPromptForCommand to merge extracted files
// Location: cli_inner_pretty.js:524187-524234
// ============================================

// ORIGINAL (for source lookup):
function bA(H) {
  let { files: $ } = H, q, K = H.getPromptForCommand;
  if ($ && Object.keys($).length > 0) {
    q = Li4(H.name);
    let z, A = H.getPromptForCommand;
    K = async (Y, f) => {
      z ??= RAz(H.name, $);
      let O = await z, M = await A(Y, f);
      if (O === null) return M;
      return mAz(M, O);
    };
  }
  let _ = {
    type: "prompt", name: H.name,
    description: typeof H.description === "function" ? "" : H.description,
    aliases: H.aliases, subcommands: H.subcommands,
    hasUserSpecifiedDescription: !0,
    allowedTools: H.allowedTools ?? [], disallowedTools: H.disallowedTools ?? [],
    argumentHint: typeof H.argumentHint === "function" ? void 0 : H.argumentHint,
    whenToUse: typeof H.whenToUse === "function" ? void 0 : H.whenToUse,
    model: H.model, disableModelInvocation: H.disableModelInvocation ?? !1,
    userInvocable: H.userInvocable ?? !0, contentLength: 0,
    source: "bundled", loadedFrom: "bundled",
    hooks: H.hooks, skillRoot: q, context: H.context, agent: H.agent,
    isEnabled: H.isEnabled, isHidden: !(H.userInvocable ?? !0),
    progressMessage: "running", getPromptForCommand: K, getEffort: H.getEffort,
  };
  (nwH(_, "description", H.description), nwH(_, "argumentHint", H.argumentHint),
    nwH(_, "whenToUse", H.whenToUse), Ji4.push(_));
}

// READABLE (for understanding):
function registerBundledSkill(def) {
  let { files } = def, skillRoot, getPromptForCommand = def.getPromptForCommand;

  // (a) If the skill ships reference files, wrap the prompt builder.
  if (files && Object.keys(files).length > 0) {
    skillRoot = bundledSkillExtractDir(def.name);     // deterministic per-skill dir
    let extractionPromise, innerBuilder = def.getPromptForCommand;
    getPromptForCommand = async (args, ctx) => {
      extractionPromise ??= extractAndGetSkillRoot(def.name, files);  // memoize: extract once
      let extractedDir = await extractionPromise;
      let blocks = await innerBuilder(args, ctx);
      if (extractedDir === null) return blocks;        // write failed -> skill still works
      return prependBaseDir(blocks, extractedDir);     // add "Base directory: <dir>" header
    };
  }

  // (b) Build the Skill record.
  let record = {
    type: "prompt", name: def.name,
    description: typeof def.description === "function" ? "" : def.description,
    aliases: def.aliases, subcommands: def.subcommands,
    hasUserSpecifiedDescription: true,
    allowedTools: def.allowedTools ?? [], disallowedTools: def.disallowedTools ?? [],
    argumentHint: typeof def.argumentHint === "function" ? undefined : def.argumentHint,
    whenToUse: typeof def.whenToUse === "function" ? undefined : def.whenToUse,
    model: def.model, disableModelInvocation: def.disableModelInvocation ?? false,
    userInvocable: def.userInvocable ?? true, contentLength: 0,
    source: "bundled", loadedFrom: "bundled",
    hooks: def.hooks, skillRoot, context: def.context, agent: def.agent,
    isEnabled: def.isEnabled, isHidden: !(def.userInvocable ?? true),
    progressMessage: "running", getPromptForCommand, getEffort: def.getEffort,
  };

  // (c) For function-typed metadata, install lazy getters (computed on read).
  installLazyStringGetter(record, "description", def.description);
  installLazyStringGetter(record, "argumentHint", def.argumentHint);
  installLazyStringGetter(record, "whenToUse", def.whenToUse);
  bundledSkillRegistry.push(record);
}

// Mapping: bA→registerBundledSkill, H→def, $→files, q→skillRoot, K→getPromptForCommand,
//          z→extractionPromise, A→innerBuilder, _→record, Li4→bundledSkillExtractDir,
//          RAz→extractAndGetSkillRoot, mAz→prependBaseDir, nwH→installLazyStringGetter, Ji4→bundledSkillRegistry
```

Walking it:

1. **Files wrapper (step a).** If the definition declares `files`, the registrar computes a deterministic extraction directory (`Li4(H.name)`, cli_inner_pretty.js:524238-524239) and replaces the prompt builder with a wrapper. The wrapper memoizes the *extraction promise* (`z ??= RAz(...)`, cli_inner_pretty.js:524196) so concurrent invocations await a single extraction instead of racing into separate writes — identical reasoning to the 2.1.88 comment "Memoize the promise (not the result)". After extraction it builds the inner prompt and, if the directory exists, prepends the base-dir header via `mAz` (cli_inner_pretty.js:524200).

2. **Record shape (step b).** The record is always `type: "prompt"` with `source: "bundled"` and `loadedFrom: "bundled"` (cli_inner_pretty.js:524204, 524218-524219). These two fields are how the rest of the runtime distinguishes a compiled-in skill from a disk `SKILL.md` (`loadedFrom: "user"`/`"project"`) or a plugin skill. `contentLength: 0` (cli_inner_pretty.js:524217) is a placeholder — bundled bodies are generated lazily by `getPromptForCommand`, so there is no static body length to count. `isHidden` is derived from `userInvocable` (cli_inner_pretty.js:524225): a non-user-invocable bundled skill is hidden from the picker.

3. **`getEffort` / `getPromptForCommand` pass-through.** Both callbacks are copied straight onto the record (cli_inner_pretty.js:524227-524228). `getEffort` is **new** vs 2.1.88's registrar (which had no effort concept) — it lets a skill compute an effort level from its arguments (used by `/code-review`, §3). The downstream loop reads it as `record.getEffort?.(args) ?? record.effort` at the invocation sites (cli_inner_pretty.js:350450, 396035, 396604, 396649).

4. **Lazy descriptions (step c).** `installLazyStringGetter` (`nwH`, cli_inner_pretty.js:222231-222234) only installs a getter when the value is a *function*:

```javascript
// ============================================
// installLazyStringGetter - Install an enumerable getter only for function-typed metadata
// Location: cli_inner_pretty.js:222231-222234
// ============================================

// ORIGINAL (for source lookup):
function nwH(H, $, q) {
  if (typeof q !== "function") return;
  Object.defineProperty(H, $, { get: q, enumerable: !0, configurable: !0 });
}

// READABLE (for understanding):
function installLazyStringGetter(target, key, maybeFn) {
  if (typeof maybeFn !== "function") return;       // plain strings: already set in step (b)
  Object.defineProperty(target, key, { get: maybeFn, enumerable: true, configurable: true });
}

// Mapping: nwH→installLazyStringGetter, H→target, $→key, q→maybeFn
```

This is the mechanism that lets `/code-review`'s description (`eyz`, §3) be *computed at read time* (so it can gate the "ultra" clause on whether cloud review is enabled) while `/claude-api`'s description (`uj9`, a plain string) is fixed.

### Why this approach

- **One registrar, many skills.** Funneling every bundled skill through `bA` guarantees a uniform record shape, so the skill picker, the Skill tool validator, the permission layer, and the override logic all see bundled skills as ordinary skills. The 2.1.143-156 deltas (`disallowedTools`, `getEffort`, lazy descriptions) were added *once* here and every bundled skill inherits them for free.
- **Lazy file extraction + promise memoization.** Extracting only on first invocation avoids paying disk-write cost (and the security-sensitive directory creation, see `RAz` below) for skills the user never runs. Memoizing the promise (not the result) is the cheap correctness fix for the obvious race: two concurrent invocations of `/claude-api` would otherwise both try to `O_EXCL`-create the same files and one would fail.
- **Lazy descriptions via getter** rather than evaluating the function eagerly: the "ultra" clause and the argument hint depend on runtime config (`WF()`), which may not be settled at module-init time.

### Key insight

The `files` mechanism is what makes "documentation-heavy" skills like `/claude-api` possible without bloating the prompt: the skill body stays small, while ~40 markdown reference files are written to a per-skill directory and the model is told the base directory so it can `Read`/`Grep` them on demand. The Skill record is just a thin descriptor; the heavy content is materialized to disk lazily, exactly once.

### The files loader `RAz` / `mAz`

```javascript
// ============================================
// extractAndGetSkillRoot - Extract a bundled skill's files map to disk; return dir or null
// Location: cli_inner_pretty.js:524241-524289
// ============================================

// ORIGINAL (for source lookup):
async function RAz(H, $) {
  let q = Li4(H);
  try { return (await IAz(q, $), SH("skill_bundled_extract"), q); }
  catch (K) { return (N(`Failed to extract bundled skill '${H}' ...`),
    uH("skill_bundled_extract", "skill_bundled_extract_write_failed"), null); }
}
function mAz(H, $) {
  let q = `Base directory for this skill: ${$}\n\n`;
  if (H.length > 0 && H[0].type === "text") return [{ type: "text", text: q + H[0].text }, ...H.slice(1)];
  return [{ type: "text", text: q }, ...H];
}

// READABLE (for understanding):
async function extractAndGetSkillRoot(skillName, files) {
  let dir = bundledSkillExtractDir(skillName);
  try { await writeSkillFilesGrouped(dir, files); logCounter("skill_bundled_extract"); return dir; }
  catch (e) { debugLog(`Failed to extract bundled skill '${skillName}' to ${dir}: ...`);
    logFeatureError("skill_bundled_extract", "skill_bundled_extract_write_failed"); return null; }
}
function prependBaseDir(blocks, dir) {
  let header = `Base directory for this skill: ${dir}\n\n`;
  if (blocks.length > 0 && blocks[0].type === "text")
    return [{ type: "text", text: header + blocks[0].text }, ...blocks.slice(1)];
  return [{ type: "text", text: header }, ...blocks];
}

// Mapping: RAz→extractAndGetSkillRoot, mAz→prependBaseDir, H→skillName/blocks, $→files/dir,
//          q→dir/header, IAz→writeSkillFilesGrouped, Li4→bundledSkillExtractDir, uH→logFeatureError
```

The writer (`IAz`, cli_inner_pretty.js:524253-524268) groups entries by parent dir, `mkdir`s each subtree once with mode `448` (0o700), then writes each file with `O_WRONLY|O_CREAT|O_EXCL|O_NOFOLLOW` and mode `384` (0o600) (cli_inner_pretty.js:524269-524297). Relative paths are validated by `uAz` (cli_inner_pretty.js:524277-524282), which rejects absolute paths and any `..` segment ("bundled skill file path escapes skill dir"). This is a near-verbatim port of 2.1.88's `writeSkillFiles`/`safeWriteFile`/`resolveSkillFilePath` (`src/skills/bundledSkills.ts:147-189`). **Confidence: high.**

**Cross-validation (`bA`):** 2.1.88 `registerBundledSkill` (`src/skills/bundledSkills.ts:54-100`) is structurally identical: same `files`-wrapper with promise memoization, same record shape (`type: "prompt"`, `source/loadedFrom: "bundled"`, `progressMessage: "running"`, `contentLength: 0`). 2.1.156 **adds** `disallowedTools`, `subcommands`, `getEffort`, and the function-typed-metadata branch (`description`/`argumentHint`/`whenToUse` may be functions). **Confidence: high.**

---

## 2. `/simplify` — cleanup-only review (registrar `vO9`, body `Ehz`)

### What changed

The **2.1.154** changelog line is *"`/simplify` now runs a cleanup-only review instead of code-review fix."* Concretely: in 2.1.88 `/simplify` launched **3** review agents (reuse / quality / efficiency) and fixed what they found; in 2.1.156 it launches **4** agents (reuse / simplification / efficiency / **altitude**) and the body is explicit that it is **not** hunting for correctness bugs — that job belongs to `/code-review`.

### The registrar

```javascript
// ============================================
// registerSimplifySkill - Register /simplify with its cleanup-only description and prompt builder
// Location: cli_inner_pretty.js:601350-601372
// ============================================

// ORIGINAL (for source lookup):
function vO9() {
  bA({
    name: "simplify",
    description:
      "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: !0,
    async getPromptForCommand(H) {
      let $ = H.trim();
      return [{ type: "text", text: `${$ ? `Review target: \`${$}\`\n\n` : ""}${Ehz}` }];
    },
  });
}

// READABLE (for understanding):
function registerSimplifySkill() {
  registerBundledSkill({
    name: "simplify",
    description:
      "Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.",
    argumentHint: "[<target>]",
    userInvocable: true,
    async getPromptForCommand(args) {
      let target = args.trim();
      // Optionally pin a "Review target" header, then append the static body.
      return [{ type: "text", text: `${target ? `Review target: \`${target}\`\n\n` : ""}${SIMPLIFY_SKILL_BODY}` }];
    },
  });
}

// Mapping: vO9→registerSimplifySkill, H→args, $→target, Ehz→SIMPLIFY_SKILL_BODY
```

The **description at cli_inner_pretty.js:601354** is the canonical "Quality only — it does not hunt for bugs; use /code-review for that" line. The skill is plain `type: "prompt"`, no `context: fork` and no `files` — its body is fully inline.

### The body `Ehz`

```javascript
// ============================================
// SIMPLIFY_SKILL_BODY - The /simplify body: not bugs, 4 cleanup agents in parallel, then apply
// Location: cli_inner_pretty.js:601378-601407
// ============================================

// ORIGINAL (for source lookup):
Ehz = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\`

You are improving the quality of the changed code, not hunting for bugs. Review
it for reuse, simplification, efficiency, and altitude issues, then fix what you
find. Do not look for correctness bugs — that is what \`/code-review\` is for.

${dq$}
## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent review agents** via the ${sq} tool, all in a
single message so they run concurrently. ...

### Reuse

${BI8}
${cq$}
${lq$}
${nq$}
## Phase 2 — Apply the fixes

Wait for all four agents to complete, dedup findings ... and fix each remaining
one directly. Skip any finding whose fix would change intended behavior ...`;

// READABLE (for understanding):
SIMPLIFY_SKILL_BODY =
  "`/simplify → 4 cleanup agents in parallel → apply the fixes`\n\n" +
  "You are improving the quality of the changed code, NOT hunting for bugs. " +
  "Review it for reuse, simplification, efficiency, and altitude; do NOT look for correctness bugs (use /code-review).\n\n" +
  GATHER_DIFF_PHASE_0 +                       // dq$  - "Phase 0 — Gather the diff" (git diff @{upstream}...HEAD)
  "## Phase 1 — Review (4 cleanup agents in parallel)\n" +
  "Launch 4 independent review agents via the Agent tool, all in a single message (concurrent).\n" +
  "### Reuse\n"      + REUSE_ANGLE +          // BI8 - "Flag new code that re-implements something the codebase already has"
  SIMPLIFICATION_ANGLE +                      // cq$ - "### Simplification" (redundant state, copy-paste, dead code)
  EFFICIENCY_ANGLE +                          // lq$ - "### Efficiency" (redundant computation, sequential I/O)
  ALTITUDE_ANGLE +                            // nq$ - "### Altitude" (right depth, not a fragile bandaid)
  "## Phase 2 — Apply the fixes\n" +
  "Wait for all four, dedup, fix each directly; skip behavior-changing/out-of-scope/false-positive fixes.";

// Mapping: Ehz→SIMPLIFY_SKILL_BODY, sq→AGENT_TOOL_NAME("Agent"), dq$→GATHER_DIFF_PHASE_0,
//          BI8→REUSE_ANGLE, cq$→SIMPLIFICATION_ANGLE, lq$→EFFICIENCY_ANGLE, nq$→ALTITUDE_ANGLE
```

### How it works (algorithm)

1. **Phase 0 — gather the diff** (`dq$`, cli_inner_pretty.js:600275-600276): run `git diff @{upstream}...HEAD` (falling back to `main...HEAD` / `HEAD~1`), also `git diff HEAD` for uncommitted changes, or review an explicit target argument. This is *shared verbatim* with `/code-review` — both skills import the same Phase-0 block.
2. **Phase 1 — fan out 4 agents** (cli_inner_pretty.js:601385-601398): the model is told to launch **4** review agents *in a single message* via the Agent tool (`${sq}` → `"Agent"`, cli_inner_pretty.js:185637) so they run concurrently. Each agent gets the diff plus one angle: **Reuse** (`BI8`, cli_inner_pretty.js:600277-600280), **Simplification** (`cq$`, cli_inner_pretty.js:600281-600286), **Efficiency** (`lq$`, cli_inner_pretty.js:600287-600292), **Altitude** (`nq$`, cli_inner_pretty.js:600293-600299). Each returns findings shaped as `file` / `line` / one-line `summary` / concrete cost.
3. **Phase 2 — apply** (cli_inner_pretty.js:601399-601406): wait for all four, dedup findings pointing at the same line/mechanism, fix each remaining one directly, skip behavior-changing / out-of-scope / false-positive fixes (noting the skip), finish with a summary.

### Why this approach

- **Quality/bugs split.** Separating cleanup from bug-hunting (rather than one mega-prompt) keeps each agent's job narrow and its findings high-signal. The "not bugs" framing also prevents `/simplify` from rewriting behavior in the name of "cleanup" — the explicit Phase-2 skip rule ("would change intended behavior") enforces this.
- **Shared building blocks.** Phase 0 (`dq$`) and the four angle blocks are module-level constants shared with `/code-review`'s angles. This keeps the two skills' diff-gathering and cleanup criteria identical, so a user who runs `/code-review --fix` (which fixes cleanups *and* bugs) and a user who runs `/simplify` (cleanups only) get the *same* cleanup definitions.
- **Parallelism via a single message.** "All in a single message" is the load-bearing instruction: the Agent tool only runs subagents concurrently when their tool calls arrive in one assistant turn. Four serial agents would be 4× slower.

### Key insight

`/simplify` and `/code-review` are deliberately built from the *same parts list*. The 2.1.154 change did not write a new prompt — it re-composed the existing cleanup angles (`reuse/simplification/efficiency/altitude`) into a standalone skill and stripped out the correctness-bug angles, which now live only in `/code-review`. The "4 agents" count is exactly the four cleanup angles, one per agent.

**Cross-validation (`/simplify`):** 2.1.88 `src/skills/bundled/simplify.ts` registers `simplify` with description *"Review changed code for reuse, quality, and efficiency, then fix any issues found."* and launches **3** agents (Reuse / Quality / Efficiency) via `AGENT_TOOL_NAME`, then "Aggregate their findings and fix each issue directly." The 2.1.156 body is the clear successor: **4** agents (added **Altitude**, split **Quality→Simplification**), the new "not hunting for bugs" framing, the shared Phase-0/angle constants, and the `[<target>]` argument hint + "Review target:" header (both absent in 2.1.88). **Confidence: high** that this is the same skill evolved; **medium** on exact prose lineage since the angle text was rewritten.

---

## 3. `/code-review` — the bug-hunting skill (name `Y18`, registrar `zO9`)

> The review *algorithm* (multi-angle finder loop, verification pass, gap sweep, ultra cloud review, JSON output schema, `--fix`/`--comment`) is documented in module [45_code_review](../../../claude_code_v_2.1.156/analyze/45_code_review/). Here we cover only its identity *as a skill*: the name constant, registration, invocation surfaces, and the effort/ultra metadata.

### The name constant

```javascript
// ============================================
// CODE_REVIEW_SKILL_NAME - Skill name + slash command literal
// Location: cli_inner_pretty.js:211646
// ============================================

// ORIGINAL (for source lookup):
var Y18 = "code-review", T97 = "verify", e26 = "commit", HZ6 = "commit-push-pr";

// READABLE (for understanding):
const CODE_REVIEW_SKILL_NAME = "code-review";  // also the /code-review slash command

// Mapping: Y18→CODE_REVIEW_SKILL_NAME
```

### Registration

```javascript
// ============================================
// registerCodeReviewSkill - Register /code-review with ultra→ultrareview alias and a getEffort callback
// Location: cli_inner_pretty.js:600612-600624
// ============================================

// ORIGINAL (for source lookup):
function zO9() {
  bA({
    name: Y18,
    subcommands: { ultra: "ultrareview" },
    description: eyz,
    argumentHint: Hhz,
    userInvocable: !0,
    getEffort(H) { return _O9(H).explicit; },
    getPromptForCommand: $hz,
  });
}

// READABLE (for understanding):
function registerCodeReviewSkill() {
  registerBundledSkill({
    name: CODE_REVIEW_SKILL_NAME,                 // "code-review"
    subcommands: { ultra: "ultrareview" },        // /code-review ultra == legacy "ultrareview"
    description: codeReviewDescription,            // FUNCTION → lazy getter (installs via nwH)
    argumentHint: codeReviewArgHint,              // FUNCTION → "[low|medium|high|xhigh|max(|ultra)] [--fix] [--comment] [<target>]"
    userInvocable: true,
    getEffort(args) { return parseCodeReviewArgs(args).explicit; },  // returns the effort word
    getPromptForCommand: buildCodeReviewPrompt,
  });
}

// Mapping: zO9→registerCodeReviewSkill, eyz→codeReviewDescription, Hhz→codeReviewArgHint,
//          _O9→parseCodeReviewArgs, $hz→buildCodeReviewPrompt
```

Three skill-level facts matter here:

1. **`ultra → ultrareview` subcommand alias** (cli_inner_pretty.js:600615). `/code-review ultra` resolves to the legacy `ultrareview` subcommand — this is the deprecated-alias relationship the scout summary calls out. The cloud multi-agent review is gated behind a runtime check (`WF()`); when unavailable, `ultra` falls back to a local `max`-effort review (see `qhz`'s `ultraFallback` branch at cli_inner_pretty.js:600578-600582). Full ultra semantics: module 45.
2. **Function-typed description** (`eyz`, cli_inner_pretty.js:600558-600560). Because it is a function, `bA` routes it through `nwH` into a lazy getter so it can append the `ultra` clause only when cloud review is enabled:

```javascript
// ============================================
// codeReviewDescription - Lazy description; appends the ultra clause only when cloud review is enabled
// Location: cli_inner_pretty.js:600558-600560
// ============================================

// ORIGINAL (for source lookup):
function eyz() {
  return `Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings${WF() ? "; ultra: deep multi-agent review in the cloud" : ""}). Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.`;
}

// READABLE (for understanding):
function codeReviewDescription() {
  return "Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups "
    + "at the given effort level (low/medium: fewer, high-confidence findings; "
    + "high→max: broader coverage, may include uncertain findings"
    + (cloudReviewEnabled() ? "; ultra: deep multi-agent review in the cloud" : "")
    + "). Pass --comment to post findings as inline PR comments, or --fix to apply the findings to the working tree after the review.";
}

// Mapping: eyz→codeReviewDescription, WF→cloudReviewEnabled
```

3. **`getEffort` callback** (cli_inner_pretty.js:600619-600621). It returns `parseCodeReviewArgs(args).explicit` — the effort word the user typed (`low|medium|high|xhigh|max`). This is validated against the effort enum `dN = ["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009; surfaced locally as `pI8 = dN` at 600660). Returning a `getEffort` is how the skill makes the typed effort become a **kind effort permission layer** for its forked review agents (this status-bar/permission-layer effort plumbing is the §"effort frontmatter" delta covered in [skill_effort_frontmatter.md](./skill_effort_frontmatter.md)).

### Invocation surfaces (Skill tool + Agent tool)

As a skill, `/code-review` is reachable two ways:

1. **The Skill tool (`ZX = "Skill"`, cli_inner_pretty.js:216282).** Other prompts instruct the model to invoke it. The clearest example is the coordinator's post-implementation guidance `Qyz`:

```javascript
// ============================================
// skillToolCodeReviewGuidance - Tells a worker to invoke the Skill tool with skill "code-review"
// Location: cli_inner_pretty.js:600237-600242
// ============================================

// ORIGINAL (for source lookup):
Qyz = `After you finish implementing the change:
1. **Code review** — Invoke the \`${ZX}\` tool with \`skill: "code-review"\` to find correctness bugs (it reports findings; it does not edit code). Fix any findings it surfaces before continuing.
2. **Run unit tests** ...`;

// READABLE (for understanding):
skillToolCodeReviewGuidance =
  "After you finish implementing the change:\n" +
  "1. Code review — Invoke the `Skill` tool with `skill: \"code-review\"` to find correctness bugs " +
  "(it reports findings; it does not edit code). Fix any findings before continuing.\n" +
  "2. Run unit tests ...";

// Mapping: Qyz→skillToolCodeReviewGuidance, ZX→SKILL_TOOL_NAME("Skill")
```

Note the framing "it reports findings; it does not edit code" — invoked via the Skill tool, `/code-review` is read-only; the `--fix` apply behavior is a slash-command-level flag (module 45).

2. **The Agent tool (`sq = "Agent"`, cli_inner_pretty.js:185637).** Once running, the review fans its angles out across subagents using the Agent tool — the same fan-out primitive `/simplify` uses. (The exact agent choreography is module 45.)

### Why this approach

- **`/code-review` and `/simplify` are siblings, not duplicates.** `/code-review` covers correctness bugs *plus* cleanups; `/simplify` is cleanups-only. The 2.1.147 rename (`/simplify`→`/code-review` for bug-hunting) and the 2.1.154 re-introduction of `/simplify` as cleanup-only produced today's pairing. The shared Phase-0/angle constants keep their cleanup definitions in lockstep.
- **Effort as a first-class skill input.** Wiring effort through `getEffort` (instead of hard-coding it in the body) lets one skill serve the full `low…max` (and `ultra`) spectrum, and lets the runtime turn the chosen effort into a permission layer that bounds the forked review agents.

### Key insight

`/code-review` is a *bundled skill* in 2.1.156, registered through the same `bA` path as `/simplify` and `/claude-api`. That uniformity is what lets the coordinator prompt invoke it generically through the Skill tool by name (`skill: "code-review"`) instead of hard-wiring a special review code path.

**Cross-validation (`/code-review`):** there is **no** `code-review` bundled skill in 2.1.88's `src/skills/bundled/` (the directory has `simplify.ts`, `claudeApi.ts`, `verify.ts`, etc., but no `codeReview.ts`). `/code-review` as a bundled skill is **new** post-2.1.88. **Confidence: high.**

---

## 4. `/claude-api` — Opus 4.8 support + 4.7→4.8 migration (registrar `tSz`)

### What changed in 2.1.154

`/claude-api` already existed (2.1.88 `src/skills/bundled/claudeApi.ts`). The 2.1.154 delta added **Opus 4.8 support and 4.7→4.8 migration guidance**:

- The model-var table (`d1q`) now points `{{OPUS_ID}}` at `claude-opus-4-8` and `{{OPUS_NAME}}` at `Claude Opus 4.8` (cli_inner_pretty.js:611874-611882) — every `{{OPUS_ID}}` in every bundled doc is substituted to the 4.8 id.
- The Quick Task Reference (`rSz`) routes migrations to `shared/model-migration.md` (cli_inner_pretty.js:612050), and that doc (`wj9`) now contains a full "Migrating to Opus 4.8" section (cli_inner_pretty.js:609719-609832).
- A `tengu_claude_api_skill_loaded` telemetry event is emitted on every invocation — **new** in this window.

### The registrar

```javascript
// ============================================
// registerClaudeApiSkill - Register /claude-api: bundled docs via files, lang detection, load telemetry
// Location: cli_inner_pretty.js:612027-612046
// ============================================

// ORIGINAL (for source lookup):
function tSz() {
  bA({
    name: "claude-api",
    description: uj9,
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    userInvocable: !0,
    files: cSz(),
    async getPromptForCommand(H) {
      let $ = await nSz();
      return (
        d("tengu_claude_api_skill_loaded", {
          detected_lang: $ ?? "none",
          subcommand: mj9(H),
          has_args: H.trim().length > 0,
        }),
        [{ type: "text", text: oSz($, H, l1q) }]
      );
    },
  });
}

// READABLE (for understanding):
function registerClaudeApiSkill() {
  registerBundledSkill({
    name: "claude-api",
    description: claudeApiSkillDescription,          // uj9 = base + TRIGGER/SKIP
    allowedTools: ["Read", "Grep", "Glob", "WebFetch"],
    userInvocable: true,
    files: buildClaudeApiFiles(),                    // cSz() -> { "shared/model-migration.md": <wj9>, ... }
    async getPromptForCommand(args) {
      let detectedLang = await detectProjectLanguage();   // nSz()
      logTelemetryEvent("tengu_claude_api_skill_loaded", {
        detected_lang: detectedLang ?? "none",
        subcommand: matchSubcommand(args),            // mj9 -> "migrate" | "managed-agents-onboard" | "none"
        has_args: args.trim().length > 0,
      });
      return [{ type: "text", text: buildClaudeApiPrompt(detectedLang, args, SKILL_CONTENT) }];  // oSz(...)
    },
  });
}

// Mapping: tSz→registerClaudeApiSkill, uj9→claudeApiSkillDescription, cSz→buildClaudeApiFiles,
//          nSz→detectProjectLanguage, d→logTelemetryEvent, mj9→matchSubcommand, oSz→buildClaudeApiPrompt, l1q→SKILL_CONTENT
```

Skill-level anatomy:

1. **`allowedTools: ["Read","Grep","Glob","WebFetch"]`** (cli_inner_pretty.js:612031). The skill scopes the model to reading/searching the extracted docs and fetching live docs — it cannot Edit/Bash while the skill is the active context. Identical to 2.1.88.
2. **`files: cSz()`** (cli_inner_pretty.js:612033). `buildClaudeApiFiles` (`cSz`, cli_inner_pretty.js:611935-611939) builds the files map by running each `SKILL_FILES` (`c1q`) entry through model-var substitution (`n1q(value, d1q)`) so `{{OPUS_ID}}`/`{{OPUS_NAME}}` are baked into the on-disk docs:

```javascript
// ============================================
// buildClaudeApiFiles - Materialize SKILL_FILES with model vars substituted, for files extraction
// Location: cli_inner_pretty.js:611935-611939
// ============================================

// ORIGINAL (for source lookup):
function cSz() {
  let H = {};
  for (let [$, q] of Object.entries(c1q)) H[$] = n1q(q, d1q);
  return H;
}

// READABLE (for understanding):
function buildClaudeApiFiles() {
  let files = {};
  for (let [relPath, md] of Object.entries(SKILL_FILES))   // c1q
    files[relPath] = substituteModelVars(md, SKILL_MODEL_VARS);  // n1q(md, d1q): {{OPUS_ID}} -> claude-opus-4-8
  return files;
}

// Mapping: cSz→buildClaudeApiFiles, c1q→SKILL_FILES, d1q→SKILL_MODEL_VARS, n1q→substituteModelVars
```

   Passing `files` here means `bA` installs the files-extraction wrapper (§1): on first `/claude-api` invocation the ~40 markdown docs (including `shared/model-migration.md`) are written to disk and the prompt is prefixed with `Base directory for this skill: <dir>`. *(2.1.88 did not pass `files`; it inlined docs into the prompt only — see cross-val below.)*

3. **`tengu_claude_api_skill_loaded` telemetry** (cli_inner_pretty.js:612037-612041). Emitted with `detected_lang` (from `nSz`), `subcommand` (from `mj9`, one of `migrate` / `managed-agents-onboard` / `none`, cli_inner_pretty.js:612023-612026 + 612074), and `has_args`. This event does **not** exist in 2.1.88 — it is new.

4. **Language detection `nSz`** (cli_inner_pretty.js:611940-611956) scans the cwd for language markers (`.py`, `package.json`, `go.mod`, …) using the `lSz` indicator map (cli_inner_pretty.js:612061-612070) — a direct port of 2.1.88's `detectLanguage`.

### Where the 4.7→4.8 prose actually lives (stated honestly)

The Quick Task Reference (`rSz`) routes migrations to a *file*, not to inline text:

```javascript
// ============================================
// CLAUDE_API_QUICK_TASK_REFERENCE - Routes "Migrating to a newer model..." to shared/model-migration.md
// Location: cli_inner_pretty.js:612049-612050
// ============================================

// ORIGINAL (for source lookup):
rSz = '## Reference Documentation\n\n...### Quick Task Reference\n\n...**Migrating to a newer model or replacing a retired model:**\n→ Refer to `shared/model-migration.md`\n\n...';

// READABLE (for understanding):
CLAUDE_API_QUICK_TASK_REFERENCE =
  "## Reference Documentation\n\n... ### Quick Task Reference\n\n" +
  "**Migrating to a newer model or replacing a retired model:**\n" +
  "→ Refer to `shared/model-migration.md`\n\n...";

// Mapping: rSz→CLAUDE_API_QUICK_TASK_REFERENCE
```

And the description (`aSz`, baked into `uj9`) advertises migrations:

```javascript
// ============================================
// CLAUDE_API_SKILL_DESCRIPTION_BASE - Base description; mentions migrating between model versions
// Location: cli_inner_pretty.js:612051-612052, 612071-612073
// ============================================

// ORIGINAL (for source lookup):
aSz = `Build, debug, and optimize Claude API / Anthropic SDK apps. Apps built with this skill should include prompt caching. Also handles migrating existing Claude API code between Claude model versions (4.5 → 4.6, 4.6 → 4.7, retired-model replacements).\n`;
// ... uj9 = aSz + "TRIGGER when: ... SKIP: ..."

// READABLE (for understanding):
CLAUDE_API_SKILL_DESCRIPTION_BASE =
  "Build, debug, and optimize Claude API / Anthropic SDK apps. Apps built with this skill should include prompt caching. " +
  "Also handles migrating existing Claude API code between Claude model versions (4.5 → 4.6, 4.6 → 4.7, retired-model replacements).\n";
claudeApiSkillDescription = CLAUDE_API_SKILL_DESCRIPTION_BASE + "TRIGGER when: ...\nSKIP: ...";  // uj9

// Mapping: aSz→CLAUDE_API_SKILL_DESCRIPTION_BASE, uj9→claudeApiSkillDescription
```

**Honest statement of where the migration content is.** The registrar JS (`tSz`, `rSz`, `aSz`, `uj9`) only *advertises and routes to* migration; it contains **no** 4.7→4.8 prose. The actual migration text is the bundled reference doc `shared/model-migration.md`, registered in `SKILL_FILES` (`c1q`) as the entry `"shared/model-migration.md": wj9` (cli_inner_pretty.js:611916). That doc is **present in the JS bundle** as the template-literal variable `wj9` (cli_inner_pretty.js:608931-609832) — so the prose *is* technically in the bundle, but it is a **data blob loaded via the `files` mechanism**, not logic inline in the registrar. At runtime it is written to disk by the files extractor and the model `Read`s/`Grep`s it on demand; it is also inlined into the prompt as `<doc path="shared/model-migration.md">…</doc>` when the detected (or all) languages are assembled by `oSz`/`Cj9` (cli_inner_pretty.js:611973-611985, 611990-612012). The doc's own "Migrating to Opus 4.8" section is the source of truth:

- *"No new breaking changes. Opus 4.8 keeps the same request surface as Opus 4.7… A 4.7 → 4.8 migration is therefore the model-ID swap plus prompt re-tuning."* (cli_inner_pretty.js:609725)
- *"swap the model ID to `claude-opus-4-8`. Nothing else is required to avoid an error. Then re-tune prompts for the behavioral shifts…"* (cli_inner_pretty.js:609727)
- New API features and behavioral shifts: mid-session system prompts (cli_inner_pretty.js:609740-609751), long-horizon execution / effort tuning (cli_inner_pretty.js:609755-609757), narration / ask-rate / search-triggering deltas (cli_inner_pretty.js:609767-609791).

The model id `claude-opus-4-8` that those docs write is authoritative because it matches the per-provider id map `Xi$`:

```javascript
// ============================================
// OPUS_4_8_MODEL_IDS - Per-provider id map for claude-opus-4-8 (the migration target)
// Location: cli_inner_pretty.js:91825-91834
// ============================================

// ORIGINAL (for source lookup):
(Xi$ = {
  firstParty: "claude-opus-4-8",
  bedrock: "us.anthropic.claude-opus-4-8",
  vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8",
  anthropicAws: "claude-opus-4-8",
  mantle: "anthropic.claude-opus-4-8",
  gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: !0, vertex: !0 },
}),

// READABLE (for understanding):
OPUS_4_8_MODEL_IDS = {
  firstParty: "claude-opus-4-8",
  bedrock: "us.anthropic.claude-opus-4-8",
  vertex: "claude-opus-4-8",
  foundry: "claude-opus-4-8",
  anthropicAws: "claude-opus-4-8",
  mantle: "anthropic.claude-opus-4-8",
  gateway: "claude-opus-4-8",
  eagerInputStreaming: { bedrock: true, vertex: true },
};

// Mapping: Xi$→OPUS_4_8_MODEL_IDS (Ji$ at 91815-91823 is the matching 4.7 block)
```

So the SKILL_MODEL_VARS `{{OPUS_ID}} = "claude-opus-4-8"` (cli_inner_pretty.js:611875) and the model-registry id `Xi$.firstParty = "claude-opus-4-8"` (cli_inner_pretty.js:91826) agree — the migration target the docs tell users to write is the same string the CLI actually sends.

### ASCII: how `/claude-api` assembles its prompt

```
/claude-api [args]
      │
      ▼
registerClaudeApiSkill (tSz)  ── files: cSz()  ──►  bA installs files-extraction wrapper
      │                                                      │ (first invocation)
      ▼                                                      ▼
getPromptForCommand(args)                         RAz: write ~40 docs to <skillRoot>/
      │                                              incl. shared/model-migration.md (wj9)
      ├─ nSz(): detect language (cwd markers)        + prependBaseDir header
      ├─ d("tengu_claude_api_skill_loaded",
      │     {detected_lang, subcommand=mj9(args), has_args})   ◄── NEW telemetry
      └─ oSz(lang, args, l1q):
            base prompt (up to "Reading Guide")
          + rSz Quick Task Reference  ── "Migrating…" → shared/model-migration.md
          + <doc path="…">…</doc> blocks  (model vars d1q substituted: {{OPUS_ID}}→claude-opus-4-8)
          + "When to Use WebFetch" tail
          + "## User Request\n\n{args}"
```

### Why this approach

- **Docs as data, not prompt.** Shipping the migration guide as a `files` entry (vs. cramming it into the system/skill prompt) keeps the live prompt small while giving the model a `Grep`-able on-disk reference. The migration guide alone is ~900 lines; inlining it on every turn would be wasteful and cache-hostile.
- **Template variables decouple prose from model ids.** Writing `{{OPUS_ID}}` in the docs and substituting `d1q` at build time means an Opus version bump (4.7 → 4.8) is a one-line change to `d1q` plus the new migration section — the surrounding doc prose does not have to be hand-edited everywhere.
- **Telemetry on load** (`tengu_claude_api_skill_loaded`) lets Anthropic measure which languages and subcommands (`migrate`, `managed-agents-onboard`) users actually hit, informing which docs to keep current.

### Key insight

The 4.7→4.8 migration "feature" is almost entirely **documentation + a one-line model-var change**, not code. The only executable changes are: `d1q` now names 4.8 (cli_inner_pretty.js:611875-611876), `SKILL_FILES` carries the updated `shared/model-migration.md` blob (`wj9`, which gained the 4.8 section), and the `Xi$` id map exists. Everything a user experiences as "4.7→4.8 migration help" is the model reading `shared/model-migration.md` after `/claude-api` routes it there.

**Cross-validation (`/claude-api`):** 2.1.88 `src/skills/bundled/claudeApi.ts` is a strong precursor — same `name`, same `allowedTools`, same `detectLanguage`/`LANGUAGE_INDICATORS`, same `buildPrompt`/`buildInlineReference`/`processContent` shape, same Quick Task Reference structure. Differences in 2.1.156: (a) it now passes **`files: cSz()`** so docs are extracted to disk (2.1.88 only inlined them); (b) it emits **`tengu_claude_api_skill_loaded`** (no telemetry in 2.1.88); (c) the Quick Task Reference adds a **"Migrating to a newer model"** route to `shared/model-migration.md` and **Managed Agents** routes (absent in 2.1.88's `INLINE_READING_GUIDE`); (d) the description (`aSz`) explicitly advertises **migrations** (2.1.88's description was just "Build apps with the Claude API or Anthropic SDK"). The migration **doc body** and per-language docs are data blobs whose 2.1.88 equivalents live in `claudeApiContent.js` (not in our `src/` tree), so the 4.7→4.8 prose itself is **medium** confidence on lineage. Skill structure and telemetry: **high**.

---

## 5. Cross-cutting: why all three skills share one shape

```
                    registerBundledSkill (bA)            cli_inner_pretty.js:524187
                            │  (type:"prompt", source/loadedFrom:"bundled")
        ┌───────────────────┼────────────────────────┐
        ▼                   ▼                         ▼
  registerSimplifySkill  registerCodeReviewSkill  registerClaudeApiSkill
       (vO9 601350)          (zO9 600612)             (tSz 612027)
        │                     │                         │
   body Ehz (inline)     description=eyz(fn)       files: cSz() (docs to disk)
   4 Agent agents        getEffort → effort layer   tengu_claude_api_skill_loaded
   "not bugs"            ultra→ultrareview alias     {{OPUS_ID}}=claude-opus-4-8
        │                     │  Skill tool (ZX)         routes → shared/model-migration.md (wj9)
        └─ Agent tool (sq) ───┴─ Agent tool (sq)
```

- All three are `type: "prompt"`, `source/loadedFrom: "bundled"`, `userInvocable: true`, registered exactly once via `bA`.
- `/simplify` and `/code-review` both fan out via the **Agent tool** (`sq`) and share the Phase-0 diff-gather + cleanup-angle constants.
- `/code-review` is reachable through the **Skill tool** (`ZX`) by name from other prompts (the coordinator guidance `Qyz`).
- `/claude-api` is the only one of the three that uses the **`files`** mechanism — its docs (incl. the 4.7→4.8 migration guide) are bundled blobs written to disk, not inline body text.

---

## Confidence summary

| Claim | Confidence | Basis |
|---|---|---|
| `bA` registrar shape + files loader | high | direct read (524187-524297) + 2.1.88 `bundledSkills.ts` |
| `/simplify` = 4 cleanup agents, "not bugs", cleanup-only | high | direct read (601350-601407); 2.1.88 had 3 agents |
| `/code-review` is a bundled skill, ultra→ultrareview, getEffort | high | direct read (600612-600624); NEW post-2.1.88 |
| `/claude-api` adds files + telemetry + migration route | high | direct read (612027-612074); 2.1.88 `claudeApi.ts` |
| Opus 4.8 model id map / SKILL_MODEL_VARS | high | direct read (91825-91834, 611874-611882) |
| 4.7→4.8 migration *prose* lineage | medium | `wj9` is a bundled data blob; 2.1.88 equivalent not in `src/` |

*(Note: this is a module doc — no symbol mapping table appears here; mappings are in the `00_overview/symbol_index_*.md` files per project convention.)*
