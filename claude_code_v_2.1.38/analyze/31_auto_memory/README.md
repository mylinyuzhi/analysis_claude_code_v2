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
- **Project scope** - Project-specific patterns and conventions (default)
- **Local scope** - Machine-specific settings

### Memory Frontmatter
- Metadata in frontmatter format for agent consumption
- Scope declarations, priority hints

### Remote Memory
- `CLAUDE_CODE_REMOTE_MEMORY_DIR` environment variable
- Enables shared memory across distributed setups
- See [multi_agent_memory.md](./multi_agent_memory.md) for multi-agent scenarios and synchronization

### Usage Best Practices
- **MEMORY.md as index** - Keep concise (<200 lines), link to topic files
- **Topic files for details** - Store deep content in separate files (debugging.md, patterns.md)
- **When to write** - Confirmed patterns, user requests, recurring solutions
- **When NOT to write** - Session-specific state, speculative conclusions, duplicates
- See [usage_patterns.md](./usage_patterns.md) for comprehensive guidelines

## Analysis Documents

### Phase 1, 2 & 3 (New - Complete Documentation Suite)
- [usage_patterns.md](./usage_patterns.md) - Best practices for MEMORY.md organization, topic files, when to write/skip (~19KB)
- [multi_agent_memory.md](./multi_agent_memory.md) - Memory isolation vs sharing, directory resolution, team scenarios (~18KB)
- [topic_file_templates.md](./topic_file_templates.md) - Reusable templates for debugging, patterns, architecture, testing (~23KB)
- [memory_maintenance.md](./memory_maintenance.md) - Truncation response, deduplication, cleanup, refactoring workflows (~18KB)
- [remote_memory_sync.md](./remote_memory_sync.md) - Remote directory setup, network storage, distributed teams, SSHFS/NFS (~20KB)

### Existing Analysis (Enhanced)
- [memory_architecture.md](./memory_architecture.md) - Overall memory system architecture
- [memory_logic.md](./memory_logic.md) - Truncation logic and prompt injection
- [architecture.md](./architecture.md) - Technical architecture details **[Updated: Multi-agent + Remote sections added]**
- [loading_mechanism.md](./loading_mechanism.md) - How MEMORY.md is loaded into system prompt

## Key Source Files

- `chunks.87.mjs` - Memory loading, buildMemoryPrompt, directory resolution (lines 2194-2312)
- `chunks.169.mjs` - System prompt integration and dynamic variable registration
- `chunks.174.mjs` - Write/Edit tool permissions for memory files

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

## Changelog References

- **v2.1.32**: Initial auto memory system, MEMORY.md loading
- **v2.1.33**: Memory frontmatter, remote memory support, topic files
