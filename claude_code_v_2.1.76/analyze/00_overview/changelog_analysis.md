# Changelog Analysis: v2.1.7 → v2.1.76

## Overview

This document analyzes the major changes between Claude Code v2.1.7 and v2.1.76, with particular focus on the v2.1.38 → v2.1.76 delta which represents the most recent evolution.

---

## 1. Module Count Evolution

| Version | Modules | New Modules |
|---------|---------|-------------|
| v2.1.7 | 30 | - |
| v2.1.38 | 35 | +5 |
| v2.1.76 | 36 | +1 |

**New Modules (v2.1.38 → v2.1.76)**:
1. **36_loop_cron** (v2.1.71) - `/loop` command + CronCreate/Delete/List tools

---

## 2. v2.1.7 → v2.1.38: Major Features

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

## 3. v2.1.38 → v2.1.76: Delta Analysis

### 3.1 Loop/Cron Scheduling System (v2.1.71)

**What Changed**:
- `/loop` slash command for recurring prompt/command execution at set intervals
- New tools: `CronCreate`, `CronDelete`, `CronList`
- Session-scoped cron jobs with interval scheduling
- `CLAUDE_CODE_DISABLE_CRON` environment variable to disable all cron behavior

**How it works**:
- `/loop 5m /check-status` creates a cron job running every 5 minutes
- `CronCreate` creates programmatic recurring jobs with interval expressions
- Cron jobs are session-scoped and survive compaction
- Circuit breaker: loop stops after consecutive failures

**Impact**: Enables autonomous monitoring and periodic task execution

---

### 3.2 MCP Elicitation (v2.1.76)

**What Changed**:
- MCP servers can now request structured input from users mid-task
- Two interaction modes: form fields or browser URL
- New hook events: `Elicitation`, `ElicitationResult`
- Interactive dialog with schema-driven form fields

**How it works**:
1. MCP server sends elicitation request with JSON Schema
2. Claude Code shows interactive dialog to user
3. User fills in form fields or opens browser URL
4. Response sent back to MCP server as structured data

**Design rationale**: MCP servers need to collect user input without breaking the conversation flow; elicitation provides a structured, non-intrusive way to do this.

**Impact**: MCP servers become more interactive and can gather required information mid-task

---

### 3.3 HTTP Hooks (v2.1.63)

**What Changed**:
- Hook type `"http"` added alongside existing `"shell"` hooks
- HTTP hooks POST JSON to a URL and receive JSON response
- Supports authentication headers and timeout configuration
- Blocking and non-blocking modes supported

**How it works**:
```json
{
  "type": "http",
  "url": "https://webhook.example.com/hook",
  "headers": {"Authorization": "Bearer token"},
  "timeout": 5000
}
```

**Impact**: Hooks can now integrate with external services without shell scripts

---

### 3.4 Effort Level Simplification (v2.1.72)

**What Changed**:
- Effort levels reduced from 4 (low/medium/high/max) to 3 (low/medium/high)
- `max` effort level removed
- `/effort auto` command resets to model default
- Visual indicators: ○ (low), ◐ (medium), ● (high)
- `ultrathink` keyword re-introduced for high effort single-turn (v2.1.68)

**Why this approach**:
- `max` was confusing and rarely needed
- Simpler model for users: low=disabled thinking, medium=moderate budget, high=extended budget
- `ultrathink` in prompts still triggers high effort without `/effort high`

**Effort level mapping**:
- `low`: thinking disabled (off)
- `medium`: thinking budget ~8,000 tokens (default for most models)
- `high`: thinking budget ~32,000 tokens
- `auto`: reset to model default (Opus 4.6 defaults to medium for Max/Team plans)

---

### 3.5 Auto-Compact Circuit Breaker (v2.1.76)

**What Changed**:
- Auto-compaction stops after 3 consecutive failures
- Prevents infinite retry loops that could block the agent
- Error state is visible in UI with actionable guidance

**How it works**:
- Counter tracks consecutive compaction failures
- After 3 failures, auto-compact is disabled for the session
- User must manually trigger compaction or start a new session

**Why this approach**:
- Before this change, compaction failures could cause the agent to spin indefinitely
- 3 attempts provides enough retries for transient failures while preventing runloop

---

### 3.6 PostCompact Hook (v2.1.76)

**What Changed**:
- New `PostCompact` hook event fires after compaction completes (success or failure)
- Available as shell hook and HTTP hook
- Receives compaction result (success/failure, message count, token savings)

**Use cases**:
- Notify external systems when context is compacted
- Log compaction metrics
- Trigger memory file synchronization after compaction

---

### 3.7 Session Naming (-n/--name Flag) (v2.1.76)

**What Changed**:
- `-n`/`--name <name>` CLI flag sets display name for a session
- Name shown in `/resume` session list and terminal title
- Session name preserved through compaction
- `claude remote-control --name` option for remote sessions

**Design**: Session identity (UUID) remains separate from display name for UX clarity

---

### 3.8 Auto-Memory Improvements (v2.1.59, v2.1.74)

**What Changed (v2.1.59)**:
- Last-modified timestamps added to memory files
- Helps Claude understand freshness/relevance of memories
- `/copy` command added for copying conversation to clipboard

**What Changed (v2.1.74)**:
- `autoMemoryDirectory` setting allows custom directory for memory files
- `/context` command now provides actionable suggestions for improving context
- ConfigChange hook fires when settings change mid-session

---

### 3.9 Model and API Improvements (v2.1.73-75)

**modelOverrides (v2.1.73)**:
- New `modelOverrides` settings field maps model identifiers to overrides
- Allows per-model configuration (e.g., different context window, pricing tier)
- Useful for enterprise deployments with custom model endpoints

**1M Context Opus 4.6 (v2.1.75)**:
- Opus 4.6 extended to support 1 million token context window
- Automatically used for sessions that would otherwise exceed limits

**SDKRateLimitInfo (v2.1.76)**:
- New `SDKRateLimitInfo` and `SDKRateLimitEvent` types in SDK
- `supportsEffort` and `supportsAdaptiveThinking` capability fields
- Better rate limit visibility for SDK consumers

---

### 3.10 Worktree Improvements (v2.1.72)

**What Changed**:
- `ExitWorktree` tool added (paired with existing `EnterWorktree`)
- `worktree.sparsePaths` configuration for sparse checkout worktrees
- `WorktreeCreate`/`WorktreeRemove` hook events properly fire (bug fix)
- Subagent `isolation: worktree` declarative support

---

### 3.11 Plugin System Improvements (v2.1.76)

**What Changed**:
- `pathPattern` field in `strictKnownMarketplaces` for URL matching
- `git-subdir` plugin source type (clone only a subdirectory)
- Plugins can now ship `settings.json` for default settings
- `pluginTrustMessage` managed setting for enterprise trust display
- LSP plugins fix: registration timing issue when marketplaces reconcile after LSP init

---

### 3.12 Sandbox and Auth Improvements (v2.1.75-76)

**Sandbox (v2.1.75)**:
- `sandbox.enableWeakerNetworkIsolation` setting for macOS (supports Go TLS with custom proxy)
- Symlink bypass security fix
- Non-allowed domains blocked without bypass when `allowManagedDomainsOnly`

**Auth (v2.1.41+)**:
- `claude auth login` / `claude auth status` / `claude auth logout` CLI subcommands
- SSL certificate error guidance for OAuth flows
- JWT refresh redelivery fix for remote sessions

---

## 4. Breaking Changes (v2.1.38 → v2.1.76)

| Change | Version | Migration |
|--------|---------|-----------|
| `max` effort level removed | v2.1.72 | Use `high` instead; `ultrathink` keyword still triggers high |
| Task creation: `activeForm` no longer required | v2.1.76 | Remove `activeForm` field from TaskCreate calls |
| Auto-compact stops after 3 consecutive failures | v2.1.76 | Handle compaction errors in tooling |

---

## 5. Performance Improvements

| Feature | v2.1.38 | v2.1.76 | Improvement |
|---------|---------|---------|-------------|
| React Compiler | - | Applied to TUI | Faster renders, fewer re-renders |
| Spinner animation | Inline | Isolated 50ms loop | No more UI jank during loading |
| Streaming buffers | Leaked on abort | Released on early termination | Memory savings |
| Compaction reliability | Unlimited retries | Circuit breaker at 3 | Prevents infinite loops |

---

## Summary

v2.1.76 represents a **feature-complete evolution** of v2.1.38:

1. **+1 new module** (36_loop_cron)
2. **Recurring task scheduling** via /loop and Cron tools
3. **MCP Elicitation** for structured mid-task user input
4. **HTTP hooks** for webhook integration
5. **Simplified effort model** (3 levels instead of 4)
6. **Session naming** for better workspace organization
7. **Reliability improvements** (circuit breaker, memory leak fix)

**Architectural stability**: Core execution flow (agent loop, tools, LLM API) is unchanged from v2.1.38. All changes are additive feature layers.
