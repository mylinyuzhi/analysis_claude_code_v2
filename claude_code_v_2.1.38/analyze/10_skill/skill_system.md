# Skill System Analysis

## 1. Overview

The **Skill System** (formerly "Custom Commands" or "Plugins") is Claude Code's extensibility engine. It allows users and the system to define reusable capabilities using Markdown files (`SKILL.md`). These skills can inject system prompts, define tools, and execute hooks.

### Key Capabilities
- **Prompt Injection**: Skills primarily provide context and instructions to the LLM.
- **Tool Access**: Skills can define which tools they are allowed to use (`allowed-tools`).
- **Hooks**: Skills can register event hooks (e.g., `SessionStart`, `PreTool`).
- **Dynamic Loading**: Skills are discovered from project directories and configuration folders.
- **Context-Awareness**: Skills can be conditional (`when_to_use`) or path-specific.

## 2. Skill Definition (`SKILL.md`)

Skills are defined in Markdown files with YAML frontmatter.

### Structure
```markdown
---
name: "My Skill"
description: "Does something useful"
allowed-tools: ["Bash", "Read"]
when_to_use: "When the user asks for X"
user-invocable: true
disable-model-invocation: false
hooks: ...
---

# Prompt Content
This is the system prompt text that will be injected...
```

### Core Data Structure (`dF4`)
The `createSkillObject` function (`dF4` in `chunks.134.mjs`) converts the raw markdown/frontmatter into an executable skill object.

```javascript
// createSkillObject (dF4)
function dF4({ skillName, displayName, description, ... }) {
    return {
        type: "prompt",
        name: skillName,
        // ... properties ...
        async getPromptForCommand(userInput, context) {
            // Injects base directory context if available
            // Resolves placeholders like ${CLAUDE_SESSION_ID}
            // Returns prompt text
        }
    }
}
```

## 3. Discovery and Loading

The system employs a multi-layered discovery strategy (`oQ1`, `vW1` in `chunks.134.mjs`).

### Loading Logic (`loadSkillFromDir` / `oQ1`)
1.  **Directory Scan**: Scans a given directory for subdirectories or direct `SKILL.md` files.
2.  **Validation**: Parses frontmatter using `yD` (yaml parser).
3.  **Hook Parsing**: uses `pF4` to validate and extract hooks.
4.  **Registration**: Adds the skill to the active skills list.

### Dynamic Discovery (`discoverProjectSkills` / `vW1`)
-   **Trigger**: Called when file system events occur or context changes.
-   **Operation**:
    1.  Identifies potential skill directories (e.g., `.claude/skills`).
    2.  Calls `loadSkillFromDir` for each.
    3.  Updates the global `activeSkillsMap` (`Pt`).
    4.  Fires change listeners (`mkA`).

## 4. Conditional Activation

Skills aren't always active. The system uses `activateConditionalSkills` (`EW1`) to determine relevance.

-   **Path-Based**: Skills can specify `paths` (globs) in frontmatter. They only activate if the user's working directory or query involves matching files.
-   **Explicit Activation**: Users can explicitly invoke skills via slash commands (if `user-invocable: true`).

## 5. Built-in Skills & Commands

Several core features are implemented as "Internal Skills" or Local JSX commands (found in `chunks.162.mjs`).

### Security Review (`wzq`)
-   **Purpose**: Performs a security audit of current changes.
-   **Implementation**: hardcoded prompt (`y7z`) that instructs the LLM to run `git diff`, `git status`, etc., and look for vulnerabilities (XSS, Injection, Auth issues).
-   **Tools**: Restricted set (`Bash(git ...)`).

### Tasks (`E7z`) & Todos (`R7z`)
-   **Tasks**: Manages background agents. Renders a UI (`EN6`) to list running shells and agents.
-   **Todos**: Lists current todo items using the `k7z` component.

### Vim Mode (`b7z`)
-   **Purpose**: Toggles editor mode between `normal` and `vim`.
-   **Implementation**: Updates global state `editorMode`.

## 6. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md)

Key functions in this document:
- `loadSkills` (ukA) - Main entry for loading.
- `loadSkillFromDir` (oQ1) - Directory scanner.
- `createSkillObject` (dF4) - Factory function for skill objects.
- `activeSkillsMap` (Pt) - Global registry of active skills.
- `SecurityReviewPlugin` (wzq) - Built-in security auditing skill.
