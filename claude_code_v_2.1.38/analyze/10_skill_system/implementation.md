# Implementation Report - Skill System (Module 10)

## Overview

The Skill System is a mechanism for extending Claude Code's capabilities through reusable, prompt-based, or plugin-based modules. Skills can be defined globally, per-user, or per-project. They support dynamic discovery, conditional activation based on file paths, and execution in isolated sub-agents (forking).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `loadSkills` (ukA) - Orchestrates discovery and loading of skills from all sources
- `loadSkillFromDir` (oQ1) - Parses a single skill from a directory containing `SKILL.md`
- `activateConditionalSkills` (EW1) - Dynamically activates skills based on file path matches
- `SkillTool` (found in chunks.132.mjs) - The primary tool for executing skills
- `isSkillFile` (bkA) - Helper to identify `skill.md` files

## Core Algorithms

### 1. Skill Discovery and Loading

The system aggregates skills from multiple tiers of the file system.

**Loading Hierarchy (`loadSkills`):**
1.  **Managed Skills**: Bundled with the application.
2.  **User Skills**: Global skills defined in the user's home directory.
3.  **Project Skills**: Skills specific to the current repository (in `.claude/skills`).
4.  **Legacy Commands**: Compatibility layer for older `/command` implementations.

**Parsing Logic (`loadSkillFromDir`):**
Each skill is defined by a directory containing a `SKILL.md` file. The system parses the Markdown frontmatter for metadata:
- `allowed-tools`: Whitelist of tools permitted for this skill.
- `context: fork`: Triggers sub-agent execution.
- `arguments`: Defined parameters for the skill.

### 2. Conditional Activation (`activateConditionalSkills`)

Claude Code supports "lazy loading" of skills. Some skills are only loaded into the agent's context when relevant files are modified or accessed.

====
// activateConditionalSkills - Dynamically activates skills based on file path matches
// Location: chunks.134.mjs:1996-2025
====

// ORIGINAL (for source lookup):
function EW1(A, q) {
    if (aQ1.size === 0) return [];
    let K = [];
    for (let [Y, z] of aQ1) {
        if (z.type !== "prompt" || !z.paths || z.paths.length === 0) continue;
        let w = UF4.default().add(z.paths);
        for (let H of A) {
            let $ = PEY(H) ? WEY(q, H) : H;
            if (w.ignores($)) {
                Pt.set(Y, z), aQ1.delete(Y), BkA.add(Y), K.push(Y);
                break
            }
        }
    }
    return K
}

// READABLE (for understanding):
function activateConditionalSkills(modifiedPaths, workingDir) {
    if (conditionalSkillsMap.size === 0) return [];
    let activatedSkillNames = [];

    for (let [name, skill] of conditionalSkillsMap) {
        // Only process prompt-based skills with defined path patterns
        if (skill.type !== "prompt" || !skill.paths || skill.paths.length === 0) continue;

        // Use the 'ignore' library logic to match paths against patterns
        let matcher = createPathMatcher().add(skill.paths);

        for (let path of modifiedPaths) {
            let normalizedPath = normalize(path, workingDir);
            if (matcher.matches(normalizedPath)) {
                // Activate the skill: move from conditional map to active map
                activeSkillsMap.set(name, skill);
                conditionalSkillsMap.delete(name);
                activatedSkillNames.push(name);
                log(`Activated conditional skill '${name}' for path: ${normalizedPath}`);
                break;
            }
        }
    }
    return activatedSkillNames;
}

// Mapping: EW1→activateConditionalSkills, aQ1→conditionalSkillsMap, Pt→activeSkillsMap, UF4→pathMatcherLib, A→modifiedPaths, q→workingDir

### 3. Execution Flow (SkillTool)

When a skill is invoked (e.g., via `/commit` or by the agent choosing to use the `SkillTool`):

1.  **Validation**: Checks if the skill exists and is invocable in the current context.
2.  **Environment Setup**: If `context: fork` is set, a new agent instance is initialized.
3.  **Prompt Injection**: The `SKILL.md` content is injected as the system instruction for the sub-agent.
4.  **Permission Inheritance**: The sub-agent inherits permissions but may be restricted by the skill's `allowed-tools`.
5.  **Result Capture**: The output of the skill execution is returned to the main agent loop.

## Key Insight

The Skill System is essentially a **Template-based Sub-agent Orchestrator**. It allows complex multi-step tasks (like "reviewing a PR" or "writing a commit message") to be encapsulated into a single "Skill" that can be shared across projects. The use of conditional activation ensures that the main agent's prompt remains clean and context-efficient until a specific skill is actually needed.
