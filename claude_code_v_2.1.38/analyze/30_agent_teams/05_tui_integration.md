# TUI Integration & User Interface Patterns

> **Module**: Agent Teams - Terminal UI & Multi-Pane Management
> **Version**: Claude Code 2.1.38
> **Purpose**: User interface patterns for in-process and pane-based modes

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [In-Process Mode UI](#2-in-process-mode-ui)
3. [Pane-Based Mode UI](#3-pane-based-mode-ui)
4. [Status Indicators](#4-status-indicators)
5. [Visual Styling](#5-visual-styling)

---

## 1. Executive Summary

Agent Teams provide two distinct UI experiences:

| Mode | UI Location | User Interaction | Visual Feedback |
|------|-------------|------------------|-----------------|
| **In-Process** | AppState task list (main TUI) | Shift+Up/Down navigation, direct message input | Status text, spinner verbs |
| **Pane-Based** | Separate tmux/iTerm2 panes | Switch panes (Ctrl+B arrow keys) | Border colors, full terminal |

**Key design decision**: In-process mode uses **text-based status display** (limited real estate in task list), while pane-based mode provides **full terminal per agent** (rich visual feedback).

---

## 2. In-Process Mode UI

### 2.1 Task List Display

**Location**: Main Claude Code TUI, "Running Tasks" section.

**Display format**:
```
Running Tasks:
■ researcher (in-process teammate) - Analyzing codebase structure...
■ backend-dev (in-process teammate) - Implementing POST /users endpoint
▶ frontend-dev (in-process teammate) - Waiting for API spec  ← Selected

Messages (3)   Tasks (5)   Delegate   [Shift+↑/↓ to select teammate]
```

**Status verbs**: Shown after agent name, indicates current activity.

Examples:
- "Analyzing codebase..." (reading files)
- "Implementing POST /users..." (writing code)
- "Waiting for API spec" (idle, blocked on message)
- "Plan submitted, awaiting approval" (in plan mode)

### 2.2 Shift+Up/Down Navigation

**Keybinding**: Registered in chunks.110.mjs (KeybindingHandler).

**Behavior**:
1. User presses Shift+Up or Shift+Down
2. TUI cycles through in-process teammates in AppState.tasks
3. Selected teammate highlighted with ▶ marker
4. Input box context changes to selected teammate

**Message sending**:
```
User flow:
1. Press Shift+Down to select "backend-dev"
2. Type: "Please add input validation"
3. Press Enter
4. Message injected to backend-dev.pendingUserMessages (Priority 1)
5. Backend-dev receives message within 0-500ms
```

**Why keyboard navigation**: Faster than mouse for power users, consistent with vim-mode philosophy.

### 2.3 Teammate Status Updates

**Status sources**:
1. **Agent loop events**: "Calling LLM API...", "Executing tool Bash..."
2. **Poll loop state**: "Waiting for messages...", "Claiming task..."
3. **Plan mode**: "Planning implementation...", "Awaiting plan approval"

**Update mechanism**: AppState.tasks[id].status string updated by agent runner, TUI polls AppState every 100ms for display refresh.

**Spinner verbs** (obfuscated: `getSpinnerVerb`):
```javascript
const SPINNER_VERBS = [
    "Analyzing", "Baked", "Brewed", "Cogitated", "Deliberating",
    "Examining", "Pondering", "Processing", "Thinking", "Working"
];

function getSpinnerVerb() {
    return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)];
}
```

**Why random verbs**: Adds personality, prevents monotony of "Processing..." for all agents.

---

## 3. Pane-Based Mode UI

### 3.1 Tmux Layout (Main-Vertical)

**Layout algorithm** (applied after teammate spawns):

```bash
# Step 1: Apply main-vertical layout
tmux select-layout main-vertical

# Result: Left pane (leader) gets 30%, right area gets 70%

# Step 2: Manually adjust leader pane width
tmux resize-pane -t ${leaderPaneId} -x 30%

# Step 3: Apply tiled layout to teammate area
tmux select-layout -t ${firstTeammatePaneId} tiled

# Result: Teammates evenly distributed in 70% area
```

**Visual result** (4 teammates):
```
┌─────────┬───────────────────────┐
│         │  Teammate 1           │
│  Team   ├───────────────────────┤
│  Lead   │  Teammate 2           │
│  (30%)  ├───────────────────────┤
│         │  Teammate 3           │
│         ├───────────────────────┤
│         │  Teammate 4           │
└─────────┴───────────────────────┘
```

**Why main-vertical**: Provides dedicated leadership pane (user interaction point) while teammates share remaining space.

**Trade-off**: Leader gets fixed 30%, teammates split 70%. For 10+ teammates, panes become cramped. Mitigation: Use separate window mode.

### 3.2 Pane Switching

**tmux navigation**:
```
Ctrl+B → ↑/↓/←/→    Navigate between panes
Ctrl+B → z          Zoom current pane (fullscreen toggle)
Ctrl+B → q          Display pane numbers
Ctrl+B → o          Cycle to next pane
```

**Use case**: User wants to inspect teammate's output.
```
1. Ctrl+B → → (move right to teammate panes)
2. Inspect output (see full terminal history)
3. Ctrl+B → z (zoom pane to fullscreen)
4. Read details
5. Ctrl+B → z (unzoom back to layout)
6. Ctrl+B → ← (return to leader pane)
```

### 3.3 iTerm2 Pane Management

**Differences from tmux**:

| Feature | tmux | iTerm2 |
|---------|------|--------|
| **Layout control** | Precise (main-vertical, tiled) | Auto-arrange only |
| **Border colors** | Supported | Not supported |
| **Keyboard shortcuts** | Customizable (Ctrl+B prefix) | iTerm2 defaults (Cmd+[, Cmd+]) |

**iTerm2 pane navigation**:
```
Cmd+[    Previous pane
Cmd+]    Next pane
Cmd+Opt+Arrow    Navigate by direction
```

**Why iTerm2 support less feature-rich**: iTerm2 API more limited than tmux. Trade-off: macOS users prefer native app over terminal multiplexer.

---

## 4. Status Indicators

### 4.1 Pane Title (tmux)

**Set pane title** after teammate spawn:

```bash
tmux select-pane -t ${paneId} -T "${agentName}"

# Example:
tmux select-pane -t %13 -T "backend-dev"
```

**Display**: Pane title shown in tmux status bar or pane borders (depends on tmux.conf).

**Use case**: User can identify panes by name instead of process ID.

### 4.2 Process Status (pane-based)

**Teammate process lifecycle**:

```
State 1: Starting
  • Display: "Starting Claude Code teammate..."
  • Duration: 0-1s (process spawn + initialization)

State 2: Polling
  • Display: "Waiting for messages..."
  • Duration: Indefinite (until message/task arrives)

State 3: Processing
  • Display: Agent's natural output (tool calls, LLM responses)
  • Duration: Varies (30s - 5min per message)

State 4: Shutdown
  • Display: "Teammate shutdown approved. Exiting..."
  • Duration: <1s (cleanup + exit)

State 5: Exited
  • Display: "[Pane is dead]" (tmux native message)
```

**User visibility**: Full process output visible in pane (unlike in-process mode where output suppressed).

### 4.3 Exit Status

**Clean exit** (shutdown approved):
```
Teammate output:
> Shutdown request received from team-lead
> Sending shutdown approval...
> Cleaning up session state...
> Goodbye!
[Process exited with code 0]
```

**Crash exit**:
```
Teammate output:
> Error: Uncaught exception in agent loop
> Stack trace: ...
[Process exited with code 1]
```

**Why preserve exit status**: Helps debugging. User can inspect pane history to see why teammate crashed.

---

## 5. Visual Styling

### 5.1 Border Colors (tmux)

**Color assignment algorithm**:

```javascript
// ============================================
// hashColor - Deterministic color from agent ID
// ============================================

function hashColor(agentId) {
    const COLOR_PALETTE = [
        "#ef4444", // red
        "#3b82f6", // blue
        "#10b981", // green
        "#f59e0b", // yellow
        "#8b5cf6", // purple
        "#f97316", // orange
        "#ec4899", // pink
        "#06b6d4"  // cyan
    ];

    // Simple hash: sum of char codes mod palette size
    let hash = 0;
    for (let i = 0; i < agentId.length; i++) {
        hash += agentId.charCodeAt(i);
    }

    return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}
```

**Application**:
```bash
color=$(hashColor "${agentId}")  # e.g., "#3b82f6"
tmux select-pane -t ${paneId} -P "bg=${color}"
```

**Why deterministic**: Same agent always gets same color (consistent across restarts).

**Why 8 colors**: Enough variety for small teams (<8 agents), limited enough to be distinguishable.

**Trade-off**: >8 agents → color collisions. Mitigation: Use separate window mode for large teams.

### 5.2 Message Colors (mailbox)

**Sender color** (in mailbox JSON):

```json
{
  "from": "team-lead",
  "text": "...",
  "color": "#3b82f6",  ← Sender's agent ID → color
  "read": false
}
```

**Use case**: TUI or future GUI can color-code messages by sender for visual differentiation.

**Not currently displayed**: In-process mode TUI shows plain text. Future enhancement: colorize message previews.

### 5.3 Visual Hierarchy

**In-process mode** (text-only):
```
Running Tasks:
■ researcher - Analyzing...           ← Bullet for clarity
▶ backend-dev - Implementing...       ← Arrow for selected
■ frontend-dev - Waiting...
```

**Pane-based mode** (spatial + color):
```
┌─────────┬───────────────┐
│ Leader  │  backend-dev  │ ← Blue border
│         │  (typing...)  │
│         ├───────────────┤
│         │  frontend-dev │ ← Green border
│         │  (waiting)    │
└─────────┴───────────────┘
```

**Why different approaches**: In-process limited to text characters, pane-based leverages terminal emulator's rendering.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `TmuxBackend.setPaneBorderColor` (fEA method) - Visual styling
- `TmuxBackend.rebalanceLayout` (fEA method) - Main-vertical layout
- `hashColor` - Deterministic color assignment
- `getSpinnerVerb` - Random status text

## Source Locations

- `chunks.131.mjs:1144` - TmuxBackend class
- `chunks.110.mjs:931` - Keybinding registration
- `chunks.131.mjs:1201` - Layout algorithms (select-layout main-vertical)

---

**Document Status**: Complete UI/TUI patterns for both in-process and pane-based modes.
