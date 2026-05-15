# Subagent Skill Discovery via Skill Tool (v2.1.133)

## What it does

Before v2.1.133, when a forked subagent (created by `Agent` tool or a `context: fork` skill) listed its available tools, the `Skill` tool was present but the skill **listing** that the Skill tool surfaces was empty for some sources. Specifically:

- Project skills (`<repo>/.claude/skills/<name>/SKILL.md`) were missing.
- User skills (`~/.claude/skills/<name>/SKILL.md`) were missing.
- Plugin-sourced skills were missing.

Only bundled skills showed up. A user who relied on a `/deploy` project skill from a subagent prompt saw the subagent fail to discover the skill - even though the same skill worked from the main loop.

v2.1.133 unifies the skill-discovery loader (`Ax5`/`getSkillsFromAllSources`) so it returns the full set for both the main loop and any forked subagent, regardless of whether the call originated from main or fork context.

---

## How it works

### 1. The unified loader `Ax5`

```javascript
// ============================================
// getSkillsFromAllSources - the unified skill discovery loader
// Location: cli_inner_pretty.js:513752-513791
// ============================================

// ORIGINAL (for source lookup):
async function Ax5(H) {
  let $ = null;
  try {
    let [q, K] = await Promise.all([
        KI6(H).catch((z) => {
          return (
            EH(y6(z)),
            ($ = "cmd_load_skill_dir_failed"),
            N("Skill directory commands failed to load, continuing without them"),
            []
          );
        }),
        Dh6().catch((z) => {
          return (
            EH(y6(z)),
            ($ = "cmd_load_plugin_skills_failed"),
            N("Plugin skills failed to load, continuing without them"),
            []
          );
        }),
      ]),
      _ = zG4(),
      A = GrK();
    if (
      (N(
        `getSkills returning: ${q.length} skill dir commands, ${K.length} plugin skills, ${_.length} bundled skills, ${A.length} builtin plugin skills`,
      ),
      $)
    )
      uH("cmd_load", $);
    else RH("cmd_load");
    return { skillDirCommands: q, pluginSkills: K, bundledSkills: _, builtinPluginSkills: A };
  } catch (q) {
    return (
      EH(y6(q)),
      J8("cmd_load", "cmd_load_skills_failed"),
      N("Unexpected error in getSkills, returning empty"),
      { skillDirCommands: [], pluginSkills: [], bundledSkills: [], builtinPluginSkills: [] }
    );
  }
}

// READABLE (for understanding):
async function getSkillsFromAllSources(toolUseContext) {
  let failureCode = null;
  try {
    const [skillDirCommands, pluginSkills] = await Promise.all([
      // Project + user skills: scans <repo>/.claude/skills/ and ~/.claude/skills/
      loadSkillDirCommands(toolUseContext).catch((err) => {
        recordError(makeErrorPayload(err));
        failureCode = "cmd_load_skill_dir_failed";
        log("Skill directory commands failed to load, continuing without them");
        return [];
      }),
      // Plugin skills: scans every loaded plugin's skillsPath/skillsPaths
      loadPluginSkills().catch((err) => {
        recordError(makeErrorPayload(err));
        failureCode = "cmd_load_plugin_skills_failed";
        log("Plugin skills failed to load, continuing without them");
        return [];
      }),
    ]);
    // Bundled and built-in plugin skills are statically known
    const bundledSkills = getBundledSkills();
    const builtinPluginSkills = getBuiltinPluginSkills();
    log(`getSkills returning: ${skillDirCommands.length} skill dir commands, ${pluginSkills.length} plugin skills, ${bundledSkills.length} bundled skills, ${builtinPluginSkills.length} builtin plugin skills`);
    if (failureCode) recordFailure("cmd_load", failureCode);
    else recordSuccess("cmd_load");
    return { skillDirCommands, pluginSkills, bundledSkills, builtinPluginSkills };
  } catch (err) {
    recordError(makeErrorPayload(err));
    recordFailureMetric("cmd_load", "cmd_load_skills_failed");
    log("Unexpected error in getSkills, returning empty");
    return { skillDirCommands: [], pluginSkills: [], bundledSkills: [], builtinPluginSkills: [] };
  }
}

// Mapping:
//   Ax5  -> getSkillsFromAllSources,           KI6 -> loadSkillDirCommands,
//   Dh6  -> loadPluginSkills,                  zG4 -> getBundledSkills,
//   GrK  -> getBuiltinPluginSkills,            EH  -> recordError,
//   uH   -> recordFailure,                     J8  -> recordFailureMetric,
//   RH   -> recordSuccess,                     y6  -> makeErrorPayload,
//   N    -> log,                               H   -> toolUseContext
```

`KI6` (`loadSkillDirCommands`) walks **both** `~/.claude/skills/` and `<repo>/.claude/skills/`, calling `krH` on each. `Dh6` (`loadPluginSkills`) iterates every enabled plugin and merges their `skillsPath`/`skillsPaths`. The function is parameterized by `toolUseContext`, not by "is this a subagent?".

### 2. The memoized command orchestrator `TE4`

```javascript
// ============================================
// getAllCommands - the memoised orchestrator for the full skill+command set
// Location: cli_inner_pretty.js:514269-514285
// ============================================

// ORIGINAL (for source lookup):
TE4 = L8(async (H) => {
  let $ = performance.now(),
    [{ skillDirCommands: q, pluginSkills: K, bundledSkills: _, builtinPluginSkills: A }, z, Y] = await Promise.all([
      Ax5(H).then((O) => {
        return (ejH("skills_load_ms", performance.now() - $), O);
      }),
      jNH(),
      LE4 ? LE4(H) : Promise.resolve([]),
    ]),
    f = D9H([...q, ...Y, ...z, ...K, ..._, ...A, ...Eg6()]);
  return (
    YOH("command", f.map((O) => ({ name: O.name, source: O.type === "prompt" ? O.source : "builtin" })).reverse(), {
      resolves: !0,
    }),
    f
  );
});

// READABLE (for understanding):
const getAllCommands = memoizeAsync(async (toolUseContext) => {
  const t0 = performance.now();
  const [
    { skillDirCommands, pluginSkills, bundledSkills, builtinPluginSkills },
    mcpCommands,            // z - from jNH() (MCP servers' prompts/list)
    sdkCommands,            // Y - from LE4(toolUseContext) (SDK-provided commands), may be empty
  ] = await Promise.all([
    getSkillsFromAllSources(toolUseContext).then((result) => {
      recordTelemetry("skills_load_ms", performance.now() - t0);
      return result;
    }),
    loadMcpCommands(),
    loadSdkCommands ? loadSdkCommands(toolUseContext) : Promise.resolve([]),
  ]);
  // Order matters: bundled comes last so plugin/user/project entries shadow it for name collisions
  const merged = applyFallbackDeduplication([
    ...skillDirCommands,    // project + user
    ...sdkCommands,         // SDK
    ...mcpCommands,         // MCP
    ...pluginSkills,        // plugins
    ...bundledSkills,       // bundled
    ...builtinPluginSkills, // builtin plugin (e.g. claude-api skill is a builtin "plugin")
    ...getLocalJsxCommands(),                                          // local-JSX commands (/agents, /effort, /goal, etc.)
  ]);
  recordSpanAttributes("command", merged.map((cmd) => ({
    name: cmd.name,
    source: cmd.type === "prompt" ? cmd.source : "builtin",
  })).reverse(), { resolves: true });
  return merged;
});

// Mapping:
//   TE4  -> getAllCommands,        L8  -> memoizeAsync,
//   Ax5  -> getSkillsFromAllSources, jNH -> loadMcpCommands,
//   LE4  -> loadSdkCommands,       ejH -> recordTelemetry,
//   D9H  -> applyFallbackDeduplication,
//   Eg6  -> getLocalJsxCommands,   YOH -> recordSpanAttributes
```

The memoizing wrapper `L8` is keyed on the `toolUseContext` object. Subagents have their own `toolUseContext`, which means they get their own cache entry - but the underlying loader function still pulls from the same `~/.claude/skills/`, `<repo>/.claude/skills/`, and plugin sources.

### 3. The Skill tool's listing builder consumes `getAllCommands` results

The Skill tool's listing is built by `HG` and filtered by `XG$` (`cli_inner_pretty.js:513858`):

```javascript
// ============================================
// shouldListSkillForModel - filter predicate for the skill listing
// Location: cli_inner_pretty.js:513858-513870
// ============================================

// ORIGINAL (for source lookup):
function XG$(H) {
  return (
    H.type === "prompt" &&
    !H.disableModelInvocation &&
    !VE4(H) &&
    (H.source === "builtin" ||
      H.loadedFrom === "bundled" ||
      H.loadedFrom === "skills" ||
      H.loadedFrom === "commands_DEPRECATED" ||
      H.hasUserSpecifiedDescription ||
      !!H.whenToUse)
  );
}

// READABLE (for understanding):
function shouldListSkillForModel(command) {
  // Must be a prompt-type command (not local-JSX, not local)
  if (command.type !== "prompt") return false;
  // Author opted out via frontmatter
  if (command.disableModelInvocation) return false;
  // skillOverrides says off or user-invocable-only
  if (isSkillModelInvocationDisabled(command)) return false;
  // Source must be one of the four lists OR the command must have a user-provided
  // description (which acts as a "yes, show this to the model" signal for MCP prompts)
  return (
    command.source === "builtin"
    || command.loadedFrom === "bundled"
    || command.loadedFrom === "skills"               // <- THIS line is the v2.1.133 fix
    || command.loadedFrom === "commands_DEPRECATED"
    || command.hasUserSpecifiedDescription
    || !!command.whenToUse
  );
}

// Mapping: XG$ -> shouldListSkillForModel, VE4 -> isSkillModelInvocationDisabled
```

The `loadedFrom === "skills"` clause is the inclusion path for project/user skills. Before the fix, `loadedFrom` for those was being checked via a different identifier (or a subagent-conditional gate) that prevented them from passing. The unified loader populates `loadedFrom: "skills"` for every `<repo>/.claude/skills/<name>/SKILL.md` and `~/.claude/skills/<name>/SKILL.md` regardless of context, so the filter now accepts them.

### 4. The Skill tool itself

The Skill tool's `validateInput` (`cli_inner_pretty.js:353504`) does **not** branch on subagent state. It takes the command list from `q.options.commands` - which the subagent's `toolUseContext` populates from `getAllCommands(toolUseContext)` at fork-creation time. Once the loader returns the right set, the validation, permission, and call paths all behave identically.

### 5. The subagent fork path

When a forked skill or Agent-tool invocation creates a subagent, the orchestration code at `cli_inner_pretty.js:351530` (around the `Vb` runAgent call) builds a `toolUseContext` for the child. That context's `options.commands` is populated from the parent's already-loaded command set (or freshly loaded if the cache is invalidated). After v2.1.133, that command set is the full unified list, so the subagent's Skill tool sees the same skill universe as the parent.

The subagent variant is gated by `availableTools` - the parent passes the tool list down through `availableTools: V ? M.options.tools : HH` (`cli_inner_pretty.js:351548`). The Skill tool is included in `HH` for forked subagents, which is what makes the discovery fix actually surface to the model.

---

## Why this approach

**Why was discovery broken in the first place?** Before v2.1.133 the loader had two paths - a "main loop" path that walked `.claude/skills/` and a "fork" path that delegated to a different (incomplete) helper. The fork path was a holdover from an earlier subagent implementation where forks ran with their own scoped command set, and `~/.claude/skills/` was deliberately excluded. As project skills became the dominant skill source, the exclusion turned into a regression.

**Why fix it by unifying the loader rather than patching the fork path?** Two reasons:

1. Drift risk - a separate fork loader would have its own bug surface for every new source (MCP prompts/list, plugin manifests, etc.). Unifying eliminates the drift.
2. User expectations - a skill that works at the top level should work from a subagent. The fix matches the mental model.

**Why memoize the loader on `toolUseContext`?** Skills are an expensive load (file IO for every `.claude/skills/<name>/SKILL.md`, plugin manifest parsing, MCP server prompts/list). Memoizing by context avoids re-running the IO when a tool invocation re-requests the listing within the same turn. The subagent gets its own memoization key because its context object is fresh - so the first call inside a subagent does pay the IO cost once, but subsequent calls inside the same subagent are cheap.

**Why does the filter `XG$` accept MCP/plugin skills via `hasUserSpecifiedDescription || whenToUse`?** Because MCP prompts and plugin skills can come from sources outside the user's `.claude/skills/`, but the model still needs to know about them. The two extra clauses ensure that any skill with a deliberately-provided description (the author wants the model to use it) or a `when_to_use` hint (the model gets routing guidance) is listed.

**Key insight:** This is a fix-by-removal. The "right" behavior was already the default - all four sources are checked, all four loaders run, all four results merge. The bug was an extra branch that filtered the merged list inside the subagent path. v2.1.133 deleted that branch.

---

## Files involved

- `cli_inner_pretty.js:513752-513791` - `Ax5` (`getSkillsFromAllSources`) - unified loader
- `cli_inner_pretty.js:514269-514285` - `TE4` (`getAllCommands`) - memoised orchestrator
- `cli_inner_pretty.js:513858-513870` - `XG$` (`shouldListSkillForModel`) - filter predicate
- `cli_inner_pretty.js:513829-513842` - `D9H` (`applyFallbackDeduplication`) - fallback drop logic for same-suffix skills
- `cli_inner_pretty.js:351530` and surrounding - subagent runtime context construction
- `cli_inner_pretty.js:353376` - `ql_` (forked-skill executor) - inherits `q.options.commands` from the parent context

---

## Cross-references

- The Skill tool definition (`Kl_`, `_l_`, `SnH`, `Al_` at `cli_inner_pretty.js:353475` and surrounding)
- The v2.1.108 "model can discover built-in slash commands via Skill tool" change - v2.1.112 `10_skill_system/model_invokable_builtins.md`
- The v2.1.110 disable-model-invocation mid-message bypass - same v2.1.112 doc
- The v2.1.133 `effort.level` JSON input addition for hooks - related but lives in `27_hooks_subsystem`
- `Vb` (`runAgent`) - the subagent runtime entrypoint - `02_agents`
