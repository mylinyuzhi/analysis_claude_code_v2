# Execution Modes Comparison - Subagent System (Claude Code 2.1.76)

## Overview

Claude Code's subagent system supports three distinct execution modes. This document compares them across key dimensions to guide mode selection.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

---

## Feature Comparison

| Feature | Synchronous | Asynchronous | Teammate |
|---------|-------------|--------------|---------|
| Caller blocks | Yes | No | No |
| Real-time progress | Yes | Via file poll | Via mailbox |
| Can be backgrounded | Yes (mid-run) | N/A (already async) | No |
| Communication style | One-way (result) | One-way (file poll) | Two-way (mailbox) |
| UI visibility | Inline in session | Background indicator | Separate pane |
| Context isolation | Full | Full | Full + shared appState |
| Worktree isolation | Supported (v2.1.76) | Supported (v2.1.76) | N/A |
| model override | Yes (v2.1.76) | Yes (v2.1.76) | Yes (v2.1.76) |

---

## Resource Usage

| Resource | Synchronous | Asynchronous | Teammate |
|---------|-------------|--------------|---------|
| Session blocked during run | Yes | No | No |
| Memory footprint | Medium | Medium + file I/O | Medium + mailbox |
| Context window | Independent | Independent | Independent |
| File handles | Minimal | Transcript file | Mailbox + transcript |

---

## Decision Matrix

### Use Synchronous When

- The parent agent needs the result before it can continue
- The task is expected to complete in under a few minutes
- You want real-time progress visibility in the main session
- The task has a well-defined end point

**Examples:**
- "Run the test suite and tell me if they pass"
- "Analyze this file and summarize the findings"
- "Search the codebase for usages of X"

### Use Asynchronous When

- The task is long-running (minutes to hours)
- The parent agent can continue with other work while waiting
- Results can be consumed later
- You want to run multiple tasks in parallel

**Examples:**
- "Refactor all files in this directory (200+ files)"
- "Run the full CI pipeline"
- "Generate documentation for the entire codebase"

### Use Teammate When

- Real-time bi-directional communication is needed
- The task involves ongoing collaboration (not a one-shot result)
- You want visual separation of the agent's output
- Multi-agent coordination with shared state is required

**Examples:**
- "Work with a code-review agent while I write code"
- "Pair with a planning agent to iterate on a design"
- "Have a documentation agent update docs as I implement"

---

## Mid-Run Backgrounding

A unique capability of synchronous mode: tasks can be promoted to background mid-execution.

```
Scenario: User starts a sync task, realizes it will take longer than expected

1. Task starts in sync mode (blocking)
2. User presses "Background this task" key
3. Promise.race fires the backgrounding signal
4. createForegroundTask returns { status: "async_launched", outputFile }
5. Agent continues running, output goes to file
6. Session is unblocked immediately
```

**Why this matters:** Users don't need to predict upfront whether a task will be fast or slow. They can start it synchronously and move it to background if needed, without restarting.

---

## v2.1.76 Changes Affecting Mode Selection

### Per-Invocation Model Override

All modes now support specifying a model per Task call. This enables:
- Using a cheaper model for async background tasks (cost optimization)
- Using a more capable model for critical synchronous tasks (quality optimization)
- Mixing models within a multi-agent workflow

### Worktree Isolation

Synchronous and asynchronous modes support `isolation: worktree`. This is particularly valuable for async tasks that perform extensive file modifications, as it prevents conflicts with the main working tree.

### Simplified Task Creation

The removal of the `activeForm` required field simplifies programmatic task creation in all modes.
