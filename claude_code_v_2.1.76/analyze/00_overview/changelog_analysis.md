# Changelog Analysis: v2.1.7 → v2.1.76

## Overview

This document analyzes the major changes between Claude Code v2.1.7 and v2.1.76, covering new features, architectural changes, and breaking changes.

---

## 0. Version Delta: v2.1.38 → v2.1.76

### New Modules

| Module | Version | Description |
|--------|---------|-------------|
| `35_rewind` | v2.1.41 | Checkpoint/rewind system with session snapshots |

### New Hook Types

| Hook | Version | Purpose |
|------|---------|---------|
| PostCompact | v2.1.76 | After conversation compaction completes |
| Elicitation | v2.1.76 | When MCP server requests user input |
| ElicitationResult | v2.1.76 | After user responds to MCP elicitation |
| WorktreeCreate | v2.1.50 | Create VCS-agnostic worktree isolation |
| WorktreeRemove | v2.1.50 | Remove worktree |
| InstructionsLoaded | v2.1.69 | When CLAUDE.md or rule file is loaded |
| ConfigChange | v2.1.49 | When config files change during session |
| SubagentStart | v2.1.x | When subagent is started |

### New Tools

| Tool | Version | Constant | Purpose |
|------|---------|----------|---------|
| EnterWorktree | v2.1.72 | `sP1` | Create isolated git worktree |
| ExitWorktree | v2.1.72 | `tP1` | Exit worktree session |
| CronCreate | v2.1.76 | `ER` | Schedule prompt to run at future time |
| CronDelete | v2.1.76 | `ed` | Cancel scheduled cron job |
| CronList | v2.1.76 | `SW6` | List scheduled cron jobs |

### New Slash Commands

| Command | Version | Purpose |
|---------|---------|---------|
| `/effort` | v2.1.76 | Set model reasoning depth (low/medium/high/max/auto) |

### Key Improvements

1. **Circuit Breaker for Auto-Compaction** (v2.1.76)
   - Constant: `aqq = 3`
   - Prevents infinite retry loops after 3 consecutive failures
   - Location: chunks.147.mjs:2666

2. **MCP Elicitation Protocol** (v2.1.76)
   - Error code: `UrlElicitationRequired` (-32042)
   - Hooks for automated elicitation responses
   - UI dialog component: `ElicitationDialog`

3. **Session Naming** (v2.1.76)
   - New CLI flag: `-n`/`--name`
   - Custom session names for easier identification

4. **sparsePaths Setting** (v2.1.76)
   - Worktree optimization configuration
   - Location: chunks.40.mjs:1403

5. **feedbackSurveyRate Setting** (v2.1.76)
   - Session quality survey configuration
   - Location: chunks.40.mjs:1427

### Symbol Count Growth

| Version | Estimated Symbols | Change |
|---------|-------------------|--------|
| v2.1.38 | ~1200 | - |
| v2.1.76 | ~1500 | +300 (25% increase) |

### Chunk File Count

| Version | Chunk Files | Change |
|---------|-------------|--------|
| v2.1.38 | 190 | - |
| v2.1.76 | 199 | +9 files |

---

## 1. Module Count Evolution

| Version | Modules | New Modules |
|---------|---------|-------------|
| v2.1.7 | 30 | - |
| v2.1.38 | 35 | +5 |

**New Modules**:
1. **30_agent_teams** (v2.1.32+) - Multi-agent collaboration
2. **31_auto_memory** (v2.1.32+) - Persistent memory system
3. **32_keybindings** (v2.1.18+) - Customizable shortcuts
4. **33_remote_sessions** (v2.1.27+) - WebSocket remote execution
5. **34_fast_mode** (v2.1.36+) - Optimized Opus 4.6 streaming

---

## 2. Major Features

### 2.1 Agent Teams (v2.1.32)

**What Changed**:
- Added multi-agent collaboration via "swarms"
- New tools: `TeamCreate`, `TeamDelete`, `SendMessage`
- Tmux/iTerm backend integration for visual agent separation
- Team-based task assignment and messaging

**Impact**: Enables parallel work distribution across specialized agents

---

### 2.2 Auto Memory (v2.1.32)

**What Changed**:
- Added `MEMORY.md` file automatically injected into system prompt
- 200-line truncation with topic file recommendations
- Scope hierarchy: user/project/local
- Hot-reload on file changes

**Impact**: Agents can now persist learnings across sessions

---

### 2.3 Task System Rebranding (v2.1.32)

**What Changed**:
- Replaced Todo List with Task System
- Added dependency graph (`blocks`, `blockedBy`)
- Task ownership and claiming
- Team integration for task assignment

**Breaking Change**: `TodoCreate` → `TaskCreate`, different schema

---

### 2.4 Fast Mode (v2.1.36)

**What Changed**:
- Added `/fast` command for Opus 4.6 optimization
- Beta flag `research-preview-2026-02-01` for lower latency
- Quota management with cooldown
- Premium billing tier

**Impact**: ~40-60% reduction in time-to-first-token for simple tasks

---

### 2.5 Remote Sessions (v2.1.27)

**What Changed**:
- WebSocket-based remote agent execution
- Session hydration and state sync
- Permission delegation via control channel
- Cloud-based session persistence

**Impact**: Enables running agents on remote infrastructure (SSH, cloud)

---

## 3. Breaking Changes

### 3.1 Todo → Task Migration

**v2.1.7**:
```javascript
TodoCreate({ subject: "...", description: "..." })
```

**v2.1.38**:
```javascript
TaskCreate({ subject: "...", description: "...", activeForm: "..." })
```

**Migration**: Must update tool calls and add `activeForm` parameter

---

### 3.2 Tool Permission Schema

**v2.1.7**: Simple allow/deny
**v2.1.38**: Rich permission objects with `allowedPrompts`, `updatedInput`

---

## 4. Performance Improvements

| Feature | v2.1.7 | v2.1.38 | Improvement |
|---------|--------|---------|-------------|
| Time-to-first-token | ~2s | ~1.2s (fast mode) | 40% faster |
| Compaction efficiency | Basic | Advanced with tool summary | Better context retention |
| Tool execution | Sequential | Parallel (via teams) | N×  speedup |

---

## 5. Symbol Count

**Estimated Symbol Growth**:
- v2.1.7: ~800 symbols
- v2.1.38: ~1200 symbols (+400, 50% increase)

**New Symbol Categories**:
- Agent teams: ~50 symbols
- Auto memory: ~20 symbols
- Task system: ~30 symbols
- Fast mode: ~15 symbols
- Remote sessions: ~40 symbols

---

## Summary

v2.1.38 represents a **major evolution** from v2.1.7:

1. **+5 new modules** (17% increase)
2. **Multi-agent support** via teams
3. **Persistent memory** across sessions
4. **Remote execution** capability
5. **Performance optimizations** (fast mode)
6. **Enhanced task management** with dependencies

**Architectural Shift**: From single-agent, session-scoped execution → multi-agent, persistent, distributed execution.

**Backward Compatibility**: Mostly compatible except for Todo→Task migration.
