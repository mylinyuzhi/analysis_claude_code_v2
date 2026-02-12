# Comprehensive Tool Registry

## Overview

This document acts as the central registry for all tools available in `claude_code_v_2.1.38`. It aggregates findings from various modules to provide a single reference point.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `wt` (chunks.132.mjs) - **SkillTool**: Tool for executing skills.
- `gd` (chunks.134.mjs) - **EditNotebookTool**: Tool for editing Jupyter Notebooks.
- `avA` (chunks.132.mjs) - **AgentTool**: Tool for spawning sub-agents (also referred to as Task).
- `Bash` - **BashTool**: Executes shell commands (implied, referenced in security checks).

## Core Tools

### 1. Skill Tool (`wt`)
**Location**: `chunks.132.mjs:820`
**Internal Symbol**: `wt` / `NJ`
**Description**: Executes high-level "skills" which can be prompt-based (macros) or forked agent sessions.
**Modes**:
- `inline`: Executes within the current agent context.
- `fork`: Spawns a sub-agent to handle the skill.
**Permissions**: Controlled by `checkPermissions` with rule-based allow/deny logic.

### 2. Agent / Task Tool (`avA`)
**Location**: `chunks.132.mjs` (Schema definition)
**Description**: Spawns a specialized agent to perform a complex task.
**Inputs**:
- `prompt`: The task description.
- `subagent_type`: Type of agent (e.g., "general-purpose", "plan", "explore").
- `run_in_background`: Boolean to run asynchronously.
- `model`: Optional model override (Sonnet/Opus/Haiku).

### 3. Edit Notebook Tool (`gd`)
**Location**: `chunks.134.mjs:2615`
**Internal Symbol**: `gd` / `jM`
**Description**: Provides specialized operations for manipulating Jupyter Notebook (`.ipynb`) files.
**Operations**:
- `replace`: Replaces cell content.
- `insert`: Inserts a new cell.
- `delete`: Deletes a cell.
**Key Logic**:
- Manually parses JSON.
- Generates cell IDs compatible with `nbformat` >= 4.5.
- Validates cell types (`code`, `markdown`).

### 4. Bash Tool
**Location**: Implied / Referenced in `chunks.150.mjs` (Security Checks)
**Description**: Executes shell commands.
**Security**:
- **Denied Commands**: `vim`, `nano` (interactive editors blocked).
- **Warning Triggers**: `jq` with `system()`, suspicious shell metacharacters, large output.
- **Safe Commands**: `ls`, `cd`, `pwd`, `whoami`, `echo`, `cat`, etc. (See `fcY` whitelist in `chunks.150.mjs`).

## Filesystem Tools (Inferred)

Based on standard Agent capability patterns and references in validation schemas (`chunks.46.mjs`), the following tools are present:

### 5. Read Tool
- **Function**: Reads file content.
- **Features**: Likely supports line range reading for large files.

### 6. Write Tool
- **Function**: Writes content to a file.
- **Safety**: overwrite confirmation usually required.

### 7. Edit Tool
- **Function**: Performs string replacement in files.
- **Constraint**: Often requires unique context to avoid ambiguous edits.

### 8. LS Tool
- **Function**: Lists directory contents.

### 9. Glob Tool
- **Function**: Finds files matching a pattern.

### 10. Grep Tool
- **Function**: Searches for text within files (using `ripgrep` or internal equivalent).

## MCP Tools
**Integration**: `chunks.132.mjs` references `mcp__` prefix handling.
**Description**: Dynamic tools loaded from Model Context Protocol servers.
**Loading**: handled by `chunks.143.mjs` (Plugin Manager).

## Tool Registry Structure

The system appears to use a dynamic registry where tools can be enabled/disabled based on:
1.  **Session Type**: Read-only vs. Interactive.
2.  **Permissions**: User-defined allow/deny lists.
3.  **Capabilities**: Remote execution vs. Local execution.
