# Skill Discovery in Subagents (v2.1.142)

## TL;DR

v2.1.133 unified the **Skill tool's discovery loader** so that subagents see the same skill catalog the main loop sees. Before the fix, forked subagents (Agent tool spawns and `context: fork` skills) could only enumerate **bundled** skills via the Skill tool; project skills (`<repo>/.claude/skills/`), user skills (`~/.claude/skills/`), and plugin-provided skills were silently dropped.

The fix is, at its core, *a removal*: an extra subagent-conditional gate inside the loader was deleted, so a unified `getSkillsFromAllSources` (`Ax5`) returns the full catalog regardless of whether the call originates from the main loop or a subagent.

Additionally, agent frontmatter `skills:` is a *preload list*: skills named in this array are *injected as content* at agent start, not just discoverable via the Skill tool.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md) - v2.1.142 subagent subsystem
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Skills)

Key functions in this document:
- `getSkillsFromAllSources` (`Ax5`) - unified loader (cli_inner_pretty.js:513752)
- `loadSkillDirCommands` (`KI6`) - walks `~/.claude/skills/` and `<repo>/.claude/skills/`
- `loadPluginSkills` (`Dh6`) - walks every enabled plugin's `skillsPath`/`skillsPaths`
- `getBundledSkills` (`zG4`)
- `getBuiltinPluginSkills` (`GrK`)
- `resolveSkillByName` (`c85`) - resolve a skill named in agent frontmatter
- `getSkillCommandFromSkill` (`InH`) - turn a Skill into a slash-command record
- `formatSkillLoadingMetadata` (`YX$`) - decorate preloaded skills with progress messages

## Skill Sources (Four Origins)

A skill can come from one of four places:

1. **Bundled** — shipped in the Claude Code binary (`getBundledSkills` / `zG4`). Examples: `/help`, internal utilities.
2. **Built-in plugin** — pre-installed plugins bundled with the binary (`getBuiltinPluginSkills` / `GrK`).
3. **Plugin** — any plugin installed by the user that declares skills via `skillsPath`, `skillsPaths`, `skills`, or a root-level `SKILL.md` (`loadPluginSkills` / `Dh6`).
4. **Skill dir** — user `~/.claude/skills/` or project `<repo>/.claude/skills/` (`loadSkillDirCommands` / `KI6`).

The unified loader returns all four lists from a single async call, in parallel where possible:

```javascript
// ============================================
// getSkillsFromAllSources - The unified skill discovery loader
// Location: cli_inner_pretty.js:513752 onward
// ============================================

// ORIGINAL (for source lookup):
async function Ax5(H) {
  let $ = null;
  try {
    let [q, K] = await Promise.all([
        KI6(H).catch((z) => { ($ = "cmd_load_skill_dir_failed"); return []; }),
        Dh6().catch((z) => { ($ = "cmd_load_plugin_skills_failed"); return []; }),
      ]),
      _ = zG4(),
      A = GrK();
    return { skillDirCommands: q, pluginSkills: K, bundledSkills: _, builtinPluginSkills: A };
  } catch (q) {
    return { skillDirCommands: [], pluginSkills: [], bundledSkills: [], builtinPluginSkills: [] };
  }
}

// READABLE (for understanding):
async function getSkillsFromAllSources(toolUseContext) {
  let failureCode = null;
  try {
    const [skillDirCommands, pluginSkills] = await Promise.all([
      loadSkillDirCommands(toolUseContext).catch(() => { failureCode = "cmd_load_skill_dir_failed"; return []; }),
      loadPluginSkills().catch(() => { failureCode = "cmd_load_plugin_skills_failed"; return []; }),
    ]);
    const bundledSkills = getBundledSkills();
    const builtinPluginSkills = getBuiltinPluginSkills();
    return { skillDirCommands, pluginSkills, bundledSkills, builtinPluginSkills };
  } catch {
    return { skillDirCommands: [], pluginSkills: [], bundledSkills: [], builtinPluginSkills: [] };
  }
}

// Mapping: Ax5→getSkillsFromAllSources, H→toolUseContext,
//          q→skillDirCommands, K→pluginSkills, _→bundledSkills, A→builtinPluginSkills,
//          KI6→loadSkillDirCommands, Dh6→loadPluginSkills,
//          zG4→getBundledSkills, GrK→getBuiltinPluginSkills
```

The dual-error-catch pattern accepts partial failures: if `loadSkillDirCommands` fails (e.g. corrupt YAML in one skill file), the loader still returns plugin/bundled/builtin skills. The user gets a degraded but functional Skill tool.

## The Pre-v2.1.133 Bug

The pre-fix loader had **two parallel paths**:

1. A "main loop" path that walked all four sources.
2. A "fork/subagent" path that delegated to a different helper, which only returned bundled and built-in plugin skills.

The fork path was a holdover from an earlier subagent implementation where forks ran with their own scoped command set, and `~/.claude/skills/` was deliberately excluded. As project skills became the dominant skill source, the exclusion turned into a regression: users would write a `/deploy` project skill that worked from the main loop, fail to see it in a code-reviewer subagent, and file the issue as "skill not available".

The fix is **fix-by-removal**: delete the secondary path, route every caller through `getSkillsFromAllSources`. The unified loader is parameterized by `toolUseContext`, not by "is this a subagent?", so it returns the right answer regardless of caller.

## The Subagent Skill Listing

For a subagent, the Skill tool's "what's available" listing is built from the same source as for the main loop. When `runAgent` is preparing the toolUseContext for the new subagent, the inherited `getAllCommands(toolUseContext)` populates `q.options.commands` with the full unified list. The Skill tool's `validateInput` doesn't branch on subagent state — it consumes the command list as-is.

The subagent's `availableTools` is gated by the parent's pass-down: at cli_inner_pretty.js:351548 (in the Agent tool's call), the parent passes `availableTools: V ? M.options.tools : HH` (where `HH` is the filtered tool pool computed from the subagent's permissionMode). The Skill tool is included in `HH` for forked subagents — that's what makes the unified discovery actually surface to the model.

## How the Subagent Inherits the Skill Catalog from the Parent

The flow is:

```
Parent's main loop builds: q.options.commands = getAllCommands(toolUseContext)
                                                    │
                                                    ▼
                                       getSkillsFromAllSources(toolUseContext)
                                                    │
                                                    ▼
                              ┌─── skillDirCommands ───┐
                              │      (project+user)    │
                              │── pluginSkills ────────│
                              │      (every plugin)    │
                              │── bundledSkills ───────│
                              │── builtinPluginSkills ─│
                              └────────────────────────┘
                                                    │
                                                    ▼  merged into commands
                                       (one master list of available skills)
                                                    │
                                                    ▼  passed via toolUseContext.options.commands
                                       Agent tool fires (subagent spawn)
                                                    │
                                                    ▼
                                       runAgent(agentDefinition, ...)
                                                    │
                                                    ▼  child runs query() with same commands list
                                       Skill tool sees the full catalog
```

The key observation: **the subagent doesn't re-load skills from disk**. It inherits the *list* through the toolUseContext. Skill content is loaded lazily by the Skill tool when the model picks one (so the cost is per-use, not per-spawn).

There are two layers of memoization in this path:

1. The `getSkillsFromAllSources` call inside `getAllCommands` is memoized on `toolUseContext`. A second call within the same turn doesn't re-IO.
2. The subagent's fresh toolUseContext gets its own memoization key. The first call from inside the subagent does pay the IO cost once, but subsequent calls in the same subagent are cheap.

## Frontmatter `skills:` Preload

Separately from the Skill tool's discoverability, agent frontmatter can name skills to **preload** at agent start. Walk from cli_inner_pretty.js:393201-393231:

```javascript
let NH = H.skills ?? [];
if (NH.length > 0) {
  let $$ = await gZ(R9()),                           // project root
    G$ = [];
  for (let S$ of NH) {
    let m$ = c85(S$, $$, H);                         // resolveSkillByName
    if (!m$) {
      log(`[Agent: ${H.agentType}] Warning: Skill '${S$}' specified in frontmatter was not found`, { level: "warn" });
      continue;
    }
    let i$ = InH(m$, $$);                            // getSkillCommandFromSkill
    if (i$.type !== "prompt") {
      log(`[Agent: ${H.agentType}] Warning: Skill '${S$}' is not a prompt-based skill`, { level: "warn" });
      continue;
    }
    G$.push({ skillName: S$, skill: i$ });
  }
  let { formatSkillLoadingMetadata: M$ } = await Promise.resolve().then(() => (ynH(), YX$)),
    W$ = await Promise.all(
      G$.map(async ({ skillName: S$, skill: m$ }) => ({
        skillName: S$,
        skill: m$,
        content: await m$.getPromptForCommand("", q),
      })),
    );
  for (let { skillName: S$, skill: m$, content: i$ } of W$) {
    log(`[Agent: ${H.agentType}] Preloaded skill '${S$}'`);
    let p$ = M$(S$, m$.progressMessage);
    x.push(w8({ content: [{ type: "text", text: p$ }, ...i$], isMeta: !0 }));
  }
}
```

What this does, step by step:

1. **Read frontmatter `skills` array** — e.g. `skills: ["deploy", "security-checklist"]`.
2. **For each name, resolve via `resolveSkillByName` (`c85`)** — looks the skill up in the unified catalog. If not found, warn but continue with other skills.
3. **Reject non-prompt skills** — skills with `context: fork` aren't valid for preload (they would spawn a sub-subagent, which the architecture doesn't support).
4. **Load each skill's content** — `getPromptForCommand("", q)` is called with empty arguments to get the skill's "no-args" content. This is the skill's main markdown body.
5. **Wrap with metadata** — `formatSkillLoadingMetadata(skillName, progressMessage)` generates a one-line header like `[Loaded skill 'deploy' — Deploy automation prompts]`.
6. **Push as meta user message** — the wrapped content is appended to the message array with `isMeta: true` so the model sees it as context, not as a turn the user typed.

The effect: the model starts its first turn with skill instructions already in the conversation. It doesn't need to invoke the Skill tool to get them; they're pre-baked.

## Why a Preload AND a Tool?

These two mechanisms cover different use cases:

| Mechanism | When to use |
|-----------|-------------|
| **Frontmatter `skills:` preload** | The agent ALWAYS needs this skill. Cost: bytes in every API request. |
| **Skill tool invocation** | The agent MIGHT need a skill. Cost: tool call latency, but only when used. |

A `code-reviewer` agent that always invokes a `code-review-checklist` skill should preload it. A general-purpose agent should leave skill loading to the model's discretion.

The skills tool listing for an agent is filtered by `skillOverrides` and by the agent's frontmatter — so an agent author can choose which skills the model can pick from. Preloaded skills aren't subject to that filter; they're already in the conversation.

## Recursion Note

A `context: fork` skill spawns a subagent. That subagent will also call `getSkillsFromAllSources` for its own Skill tool listing. **Will the fork-spawned subagent see the same skill again?**

Yes — the unified loader returns the full catalog regardless of context. But the subagent's "skills available" list still includes the originating skill. This is the same situation as in the main loop: a skill can recursively invoke itself if the model chooses to. The model is responsible for not infinite-looping.

The fork-subagent boilerplate (the `FORK_BOILERPLATE_TAG` content) explicitly says **"Do NOT spawn sub-agents"** — which would catch this recursion. But the Skill tool isn't *technically* a sub-agent spawn from the model's perspective; it's a tool call. The model is expected to apply judgment.

In practice, recursive skill invocation is rare because the model treats the skill's content as instructions and follows them; calling a skill while already executing it would normally indicate confusion.

## Telemetry and Failure Modes

`getSkillsFromAllSources` emits:
- `cmd_load` failure metric with `cmd_load_skill_dir_failed` or `cmd_load_plugin_skills_failed` reason.
- A debug log line with the count of each source: `getSkills returning: 12 skill dir commands, 5 plugin skills, 8 bundled skills, 3 builtin plugin skills`.
- On total failure, success metric resets.

Failure modes the unified loader gracefully degrades:
- A skill `.md` file has malformed YAML — the *one* file is dropped, a warning is logged, the rest proceed.
- A plugin's `skillsPath` points to a missing directory — that plugin returns 0 skills, the rest proceed.
- `~/.claude/skills/` doesn't exist — empty list, no error.
- Bundled skills always succeed (they're shipped in the binary).

## Key Decision: Why Unify Rather Than Patch the Subagent Path?

**Alternative considered**: leave the subagent loader as-is but extend it to include the missing sources.

This would mean two parallel implementations of the same logic, which had to stay in sync as new skill sources were added (e.g. when `builtinPluginSkills` was added, both paths would need updating). It's bug-prone and adds maintenance debt.

**Chosen approach**: delete the subagent path entirely, route everything through `getSkillsFromAllSources`.

**Trade-off**: this means any future "subagents should NOT see X kind of skill" filter has to be implemented as a post-loader filter at the caller, not baked into the loader. So far, no such case has come up — subagents legitimately need to see the same skills the parent does.

**Key insight**: the bug was an *extra* branch that filtered the merged list. The fix is to *remove* that branch and trust the merged list. Less code, fewer code paths to test, no special-case logic. This is the "simplification cures correctness" pattern.

## Cross-References

- **`context: fork` skills** — skill frontmatter `context: "fork"` (cli_inner_pretty.js:198694) spawns a subagent. The `agent:` field (cli_inner_pretty.js:198695) names which subagent type to use; without it, the fork-subagent default applies.
- **`skillOverrides`** — the per-skill listing override (`off`, `name-only`, `user-invocable-only`) honored at the Skill-tool listing level, *after* the loader returns. v2.1.129 fixed this to actually work.
- **`disable-model-invocation`** — frontmatter field that flips a skill from model-invocable to user-only. v2.1.118 added the listing-side affordance.
- **Subagent fork path** ([fork_lifecycle.md](./fork_lifecycle.md)) — when the unified skill catalog is consumed by the fork subagent's API call, all preloaded skills are inside the cache prefix (identical across forks).
