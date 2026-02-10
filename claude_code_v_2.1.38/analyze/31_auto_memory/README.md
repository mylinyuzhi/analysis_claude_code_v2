# 31 - Auto Memory (Persistent Memory System)

## Overview

Auto Memory provides persistent, cross-session memory for Claude Code agents. A `MEMORY.md` file is automatically loaded into the system prompt, allowing agents to accumulate knowledge about projects, patterns, and user preferences over time.

**Introduced**: v2.1.32, with enhancements in v2.1.33

## Key Components

### MEMORY.md
- Auto-loaded into system prompt at conversation start
- Maximum 200 lines (truncated beyond that)
- Located at `~/.claude/projects/{project-hash}/memory/MEMORY.md`
- Acts as an index linking to topic-specific files

### Topic Files
- Separate markdown files for detailed notes (e.g., `debugging.md`, `patterns.md`)
- Stored alongside MEMORY.md in the memory directory
- Linked from MEMORY.md for organization

### Memory Scopes
- **User scope** - Global preferences across all projects
- **Project scope** - Project-specific patterns and conventions
- **Local scope** - Machine-specific settings

### Memory Frontmatter
- Metadata in frontmatter format for agent consumption
- Scope declarations, priority hints

### Remote Memory
- `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable
- Enables shared memory across distributed setups

## Key Source Files

> To be populated during analysis.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

## Changelog References

- **v2.1.32**: Initial auto memory system, MEMORY.md loading
- **v2.1.33**: Memory frontmatter, remote memory support, topic files
