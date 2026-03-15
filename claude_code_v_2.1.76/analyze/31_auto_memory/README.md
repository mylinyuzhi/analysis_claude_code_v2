# 31 - Auto Memory (Persistent Memory System)

## Overview

Auto Memory provides persistent, cross-session memory for Claude Code agents. A `MEMORY.md` file is automatically loaded into the system prompt, allowing agents to accumulate knowledge about projects, patterns, and user preferences over time.

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.59, and v2.1.74

## Key Components

### MEMORY.md
- Auto-loaded into system prompt at conversation start
- Maximum 200 lines (truncated beyond that)
- Located at `~/.claude/projects/{project-hash}/memory/MEMORY.md` (default location)
- Acts as an index linking to topic-specific files
- Last-modified timestamps tracked for freshness (v2.1.74)

### Topic Files
- Separate markdown files for detailed notes (e.g., `debugging.md`, `patterns.md`)
- Stored alongside MEMORY.md in the memory directory
- Linked from MEMORY.md for organization
- Support `${CLAUDE_SKILL_DIR}` variable substitution (v2.1.74)

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

### Custom Memory Directory (v2.1.59)
- `autoMemoryDirectory` setting allows specifying a custom directory for memory files
- Overrides the default project-hash-based path
- Useful for shared team memories or fixed-path workflows

### Usage Best Practices
- **MEMORY.md as index** - Keep concise (<200 lines), link to topic files
- **Topic files for details** - Store deep content in separate files (debugging.md, patterns.md)
- **When to write** - Confirmed patterns, user requests, recurring solutions
- **When NOT to write** - Session-specific state, speculative conclusions, duplicates
- See [usage_patterns.md](./usage_patterns.md) for comprehensive guidelines

## Analysis Documents

### Phase 1, 2 & 3 (Complete Documentation Suite)
- [usage_patterns.md](./usage_patterns.md) - Best practices for MEMORY.md organization, topic files, when to write/skip (~19KB)
- [multi_agent_memory.md](./multi_agent_memory.md) - Memory isolation vs sharing, directory resolution, team scenarios (~18KB)
- [topic_file_templates.md](./topic_file_templates.md) - Reusable templates for debugging, patterns, architecture, testing (~23KB)
- [memory_maintenance.md](./memory_maintenance.md) - Truncation response, deduplication, cleanup, refactoring workflows (~18KB)
- [remote_memory_sync.md](./remote_memory_sync.md) - Remote directory setup, network storage, distributed teams, SSHFS/NFS (~20KB)

### Phase 4 (New - Comprehensive Reverse Engineering Enhancement)

**Detailed Implementation Analysis:**
- [15_write_edit_integration.md](./15_write_edit_integration.md) - Write/Edit tool permission flow, concurrent access analysis (~17KB)
- [16_error_handling_recovery.md](./16_error_handling_recovery.md) - Dual file size limits, error paths and recovery mechanisms (~18KB)
- [17_tui_integration.md](./17_tui_integration.md) - TUI modal, settings toggle, external editor integration (~16KB)
- [18_system_reminder_generation.md](./18_system_reminder_generation.md) - Dynamic variable registration, prompt injection mechanism (~16KB)
- [19_telemetry_monitoring.md](./19_telemetry_monitoring.md) - Three telemetry events, metrics collection, analytics queries (~17KB)
- [20_feature_flag_rollout.md](./20_feature_flag_rollout.md) - 5-level priority chain, gradual rollout strategy (~15KB)
- [21_implementation_vs_official_docs.md](./21_implementation_vs_official_docs.md) - 6 key discrepancies, verification tests (~16KB)

**Consolidated References:**
- [22_complete_lifecycle_consolidated.md](./22_complete_lifecycle_consolidated.md) - End-to-end scenarios, all flows integrated (~19KB)
- [23_quick_reference_guide.md](./23_quick_reference_guide.md) - Developer cheat sheet, troubleshooting, common scenarios (~13KB)

### Existing Analysis (Enhanced)
- [memory_architecture.md](./memory_architecture.md) - Overall memory system architecture
- [memory_logic.md](./memory_logic.md) - Truncation logic and prompt injection
- [architecture.md](./architecture.md) - Technical architecture details **[Updated: Multi-agent + Remote + Custom Directory sections added]**
- [loading_mechanism.md](./loading_mechanism.md) - How MEMORY.md is loaded into system prompt

## Documentation Coverage

**Current coverage: 95%+** (from initial 75-80%)

### Fully Documented (Phase 4 Complete)
- Core loading mechanism and 200-line truncation logic
- System architecture and lifecycle
- Best practices, usage patterns, and topic file templates
- Multi-agent memory isolation and remote sync capabilities
- Memory maintenance workflows
- **Write/Edit tool integration and permission flow**
- **Error handling and dual file size limits (200 lines + 40000 chars)**
- **TUI multi-pane integration and settings persistence**
- **System prompt injection via dynamic variables**
- **Telemetry tracking (3 events)**
- **Feature flag system (5-level priority chain)**
- **Implementation vs official docs discrepancies**
- **Custom `autoMemoryDirectory` setting (v2.1.59)**
- **Last-modified timestamps for freshness tracking (v2.1.74)**
- **`${CLAUDE_SKILL_DIR}` variable support in memory (v2.1.74)**

### Remaining Gaps (~5%)
- Agent memory directory naming conventions (edge cases)
- Cross-platform path normalization details (Windows vs Unix)
- Feature flag service API details (external service)
- Telemetry backend integration (analytics infrastructure)

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
- **v2.1.59**: `autoMemoryDirectory` setting for custom memory file location
- **v2.1.74**: Last-modified timestamps for freshness; `${CLAUDE_SKILL_DIR}` variable in memory templates
