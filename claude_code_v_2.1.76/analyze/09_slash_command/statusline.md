# Status Line Feature — Deep Reverse Engineering Analysis

> **Version:** Claude Code v2.1.76
> **Feature:** `/statusline` slash command + `statusline-setup` subagent + runtime UI component
> **Key files:** `chunks.167.mjs`, `chunks.90.mjs`, `chunks.142.mjs`, `chunks.183.mjs`, `chunks.141.mjs`, `chunks.184.mjs`, `chunks.182.mjs`

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Hooks, Skill System, CLI)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Subagent)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Auth)

Key symbols in this document:
- `E3z` / `GBA` (chunks.167.mjs:760) — `/statusline` slash command definition object
- `En7` / `kn7` (chunks.90.mjs:2650) — `statusline-setup` built-in agent definition
- `APA` (chunks.90.mjs:3049) — `getBuiltinAgents` — registers all built-in agent types
- `JyA` (chunks.142.mjs:48) — `executeStatusLineHook` — runs the configured shell command
- `Zjz` (chunks.183.mjs:2910) — `buildStatusLinePayload` — assembles the full JSON context piped to the script
- `YZq` (chunks.183.mjs:2981) — `StatusLineComponent` — React/Ink component that renders the user's custom status bar
- `nWq` (chunks.182.mjs:1642) — `NotificationStatusBar` — built-in system status bar with notifications, auth, token counts
- `ugA` (chunks.183.mjs:2906) — `isStatusLineConfigured` — guard: checks if `settings.statusLine !== undefined`
- `KZq` (chunks.183.mjs:2976) — `getLastAssistantMessageId` — tracks last message to detect change
- `kw6` (chunks.75.mjs:2261) — `checkExceeds200kTokens` — scans messages to find if last API response exceeded 200k tokens

---

## Overview

The `/statusline` feature allows users to configure a custom status bar at the bottom of the Claude Code terminal interface. This status bar runs a user-specified shell command and displays its output in real-time, updated after each assistant response.

The feature has three interlocking components:

1. **`/statusline` slash command**: Interactive setup wizard that guides the user through configuration
2. **`statusline-setup` subagent**: A built-in agent that helps the user write and test their status line script
3. **`StatusLineComponent`**: The React/Ink component that runs the script and renders its output in the terminal

---

## Part 1: The `/statusline` Slash Command

### Command Definition

`/statusline` is registered as a `"prompt"` type command with `context: "fork"`, meaning it runs in an isolated sub-agent rather than the main conversation loop.

```javascript
// ============================================
// statuslineCommand - /statusline command definition
// Location: chunks.167.mjs:760
// ============================================

// READABLE (for understanding):
const statuslineCommand = {
    type: "prompt",
    context: "fork",              // spawns dedicated sub-agent
    name: "statusline",
    description: "Configure a custom status line",
    progressMessage: "setting up status line",
    source: "builtin",
    async getPromptForCommand(args, toolUseContext) {
        return [{ type: "text", text: statuslineSetupPrompt }];
    }
}
```

**Why `context: "fork"`:**
The status line setup wizard involves multiple turns of dialogue (showing examples, asking for the script, testing it, saving settings). Running this in the main conversation loop would pollute the user's project context. Forking creates a clean isolated agent that can run the wizard without affecting the main session.

### The Forked Execution Path

```
User types: /statusline
    │
    ▼
executeCommand (ifY) → context === "fork" → handleForkedCommand (cfY)
    │
    ▼
setupForkedCommandContext (mM6):
    - Creates new agent loop context
    - Sets allowedTools to [Bash, Write, Read] (needed for script testing)
    - Isolates from main conversation state
    │
    ▼
Spawns "statusline-setup" built-in agent (En7):
    - Agent has access to Bash (to test the script)
    - Agent has access to Write (to save the config)
    │
    ▼
Wizard conversation:
    - Agent shows example scripts
    - User provides their script
    - Agent tests it: Bash("my-status-script.sh")
    - Agent saves: Write(".claude/settings.json", { statusLine: "..." })
    │
    ▼
Result wrapped in <local-command-stdout>
    - extractForkedCommandResult (FM6) extracts final text
    - Shown in conversation via ⎿ prefix
```

---

## Part 2: `statusline-setup` Built-In Agent

### Agent Definition (En7 / kn7)

```javascript
// ============================================
// statuslineSetupAgent - Built-in agent for status line configuration
// Location: chunks.90.mjs:2650
// ============================================

// READABLE (for understanding):
const statuslineSetupAgentDefinition = {
    name: "statusline-setup",
    description: "Interactive wizard for configuring custom status lines",
    systemPrompt: `You are helping the user configure a custom status line for Claude Code.

The status line runs a shell command after each assistant response and shows its output.

Guide the user through:
1. Choosing what to display (git status, time, token count, custom metrics)
2. Writing or selecting a shell script
3. Testing the script works correctly
4. Saving the configuration

The script's stdout will be displayed in the status line. Keep it short (< 80 chars).
    `,
    allowedTools: ["Bash", "Write", "Read"],
    isBuiltin: true
}
```

**Why a dedicated agent vs. a simpler local-jsx command:**
The status line setup involves:
- Natural language discussion about what to show
- Code generation (writing shell scripts)
- Testing (running the script)
- Saving (writing config files)

A simple form or dialog cannot handle this level of interactivity. A dedicated agent that can use tools is the appropriate abstraction.

---

## Part 3: StatusLineComponent (YZq)

### What it does

The React/Ink component that runs the user's configured shell command after each assistant response and renders the output in the terminal's bottom status bar.

### How it works

**Update trigger:**
The component watches `getLastAssistantMessageId` (KZq). When the message ID changes (indicating a new assistant response), it re-runs the script.

**Execution:**
1. `executeStatusLineHook` (JyA) runs the script: `Bash(settings.statusLine)`
2. Sets a 5-second timeout (scripts that hang don't freeze the UI)
3. Captures stdout

**Rendering:**
The stdout is displayed in a fixed-height bar at the bottom of the terminal. ANSI color codes are preserved (via `AnsiText`).

### buildStatusLinePayload (Zjz)

**What it does:** Assembles the JSON context object passed to the status line script via stdin (or env vars). This allows scripts to show context-aware information.

**Payload structure:**
```json
{
  "sessionId": "...",
  "messageCount": 42,
  "tokenCount": 12500,
  "model": "claude-sonnet-4-5",
  "lastToolUse": "Bash",
  "isThinking": false,
  "exceeds200kTokens": false,
  "gitBranch": "main",
  "gitStatus": "clean"
}
```

Scripts can read this JSON to show dynamic information. For example:
```bash
#!/bin/bash
PAYLOAD=$(cat -)
TOKEN_COUNT=$(echo "$PAYLOAD" | jq '.tokenCount')
echo "Tokens: $TOKEN_COUNT | $(git branch --show-current)"
```

### isStatusLineConfigured (ugA)

```javascript
function isStatusLineConfigured(settings) {
    return settings?.statusLine !== undefined;
}
```

Simple guard that prevents the component from rendering or the hook from running if no script is configured.

---

## Part 4: NotificationStatusBar (nWq)

### What it does

The built-in system status bar that shows Claude Code's own status information, shown **below** the user's custom status line (if configured).

### What it displays

- Active notifications (tool permission requests, background agent status)
- Authentication status (logged in as...)
- Token usage (X tokens used this session)
- `checkExceeds200kTokens` (kw6) indicator when approaching context limits
- Active MCP server count

### Interaction with custom status line

```
┌────────────────────────────────────────────────────────────┐
│  Tokens: 12.5k | main | clean                              │  ← user's custom statusline (YZq)
├────────────────────────────────────────────────────────────┤
│  ● claude-sonnet-4-5  |  3 MCP servers  |  user@org       │  ← built-in NotificationStatusBar (nWq)
└────────────────────────────────────────────────────────────┘
```

The built-in bar is always shown; the custom bar is shown only when configured. The custom bar renders first (closer to the conversation content), with the system bar below it.

---

## Part 5: checkExceeds200kTokens (kw6)

### What it does

Scans the conversation messages to detect if the last API response used more than 200k input tokens. This is displayed as a warning in the status bar and in telemetry.

### How it works

```javascript
// ============================================
// checkExceeds200kTokens - Detect high token usage for status bar warning
// Location: chunks.75.mjs:2261
// ============================================

// READABLE (for understanding):
function checkExceeds200kTokens(messages) {
    // Find the last assistant message with usage metadata
    let lastAssistant = [...messages].reverse().find(m => m.type === "assistant" && m.usage);
    if (!lastAssistant) return false;

    let inputTokens = lastAssistant.usage.input_tokens ?? 0;
    return inputTokens > 200_000;
}
```

**Why 200k threshold:** This corresponds to the input token limit for many Claude models. When approaching this limit, users may experience degraded response quality or rate limiting. The warning prompts users to use `/compact` before hitting the hard limit.

**Why "last assistant" not cumulative:** The relevant metric is the most recent API call's token usage, not the total session usage. Each API call re-sends the full conversation history, so the last call's input tokens represent the current "active context size".
