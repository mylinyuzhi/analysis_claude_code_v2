# TUI Integration & User Interface Patterns

> **Module**: Agent Teams - Terminal UI & Multi-Pane Management
> **Version**: Claude Code 2.1.76
> **Purpose**: User interface patterns for in-process and pane-based modes

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [In-Process Mode UI](#2-in-process-mode-ui)
3. [Pane-Based Mode UI](#3-pane-based-mode-ui)
4. [Agent Tab Component (v2.1.76)](#4-agent-tab-component-v2176)
5. [Status Indicators](#5-status-indicators)
6. [Visual Styling](#6-visual-styling)

---

## 1. Executive Summary

Agent Teams provide three distinct UI experiences in v2.1.76:

| Mode | UI Location | User Interaction | Visual Feedback |
|------|-------------|------------------|-----------------|
| **In-Process** | AppState task list (main TUI) | Shift+Up/Down navigation, direct message input | Status text, spinner verbs |
| **Pane-Based** | Separate tmux/iTerm2 panes | Switch panes (Ctrl+B arrow keys) | Border colors, full terminal |
| **Agent Tab** (new) | Dedicated tab in main TUI | Ctrl+F to filter/kill, state visualization | Selected/Viewed/Idle states |

**Key design decisions**:
- In-process mode uses **text-based status display** (limited real estate in task list)
- Pane-based mode provides **full terminal per agent** (rich visual feedback)
- Agent tab component (`qGz`) provides **unified overview** across all agents (v2.1.76 addition)

---

## 2. In-Process Mode UI

### 2.1 Task List Display

**Location**: Main Claude Code TUI, "Running Tasks" section.

**Display format**:
```
Running Tasks:
[bullet] researcher (in-process teammate) - Analyzing codebase structure...
[bullet] backend-dev (in-process teammate) - Implementing POST /users endpoint
[arrow]  frontend-dev (in-process teammate) - Waiting for API spec   <- Selected

Messages (3)   Tasks (5)   Delegate   [Shift+Up/Down to select teammate]
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
3. Selected teammate highlighted with arrow marker
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
+---------+-----------------------+
|         |  Teammate 1           |
|  Team   +-----------------------+
|  Lead   |  Teammate 2           |
|  (30%)  +-----------------------+
|         |  Teammate 3           |
|         +-----------------------+
|         |  Teammate 4           |
+---------+-----------------------+
```

**Why main-vertical**: Provides dedicated leadership pane (user interaction point) while teammates share remaining space.

**Trade-off**: Leader gets fixed 30%, teammates split 70%. For 10+ teammates, panes become cramped. Mitigation: Use separate window mode, or use the agent tab component.

### 3.2 Pane Switching

**tmux navigation**:
```
Ctrl+B + Up/Down/Left/Right    Navigate between panes
Ctrl+B + z          Zoom current pane (fullscreen toggle)
Ctrl+B + q          Display pane numbers
Ctrl+B + o          Cycle to next pane
```

**Use case**: User wants to inspect teammate's output.
```
1. Ctrl+B + Right (move right to teammate panes)
2. Inspect output (see full terminal history)
3. Ctrl+B + z (zoom pane to fullscreen)
4. Read details
5. Ctrl+B + z (unzoom back to layout)
6. Ctrl+B + Left (return to leader pane)
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

## 4. Agent Tab Component (v2.1.76)

### 4.1 Overview

**What it does**: Provides a dedicated tab in the main TUI for monitoring and managing all agents simultaneously, regardless of backend mode (in-process or pane-based).

**Location**: `chunks.192.mjs` - component `qGz`

**Key design**: Unifies agent management across all execution modes. Previously, in-process agents were managed via task list and pane-based agents via tmux navigation. The agent tab consolidates both into a single view.

### 4.2 Agent State Visualization

Each agent in the tab shows one of three states:

```
Agent Tab:
> researcher      [SELECTED]   - Analyzing src/main.ts...
  backend-dev     [VIEWED]     - Implementing auth module
  frontend-dev    [IDLE]       - Waiting for messages
  test-runner     [IDLE]       - No tasks available
```

**State definitions**:
- **SELECTED**: Agent currently focused/selected in user interaction (can receive direct input)
- **VIEWED**: Agent whose output was recently viewed (user has inspected this agent's context)
- **IDLE**: Agent waiting for work - either polling for messages or no tasks available

**Why these three states**:
- **Selected** distinguishes input target (prevents accidental messages to wrong agent)
- **Viewed** tracks user attention (helps user remember which agents they've checked)
- **Idle** is the default state, visually deemphasized since no action needed

### 4.3 Ctrl+F Filter/Kill

**What it does**: Enables efficient management of large agent teams by filtering the agent list.

**How it works**:
1. User presses Ctrl+F while agent tab is focused
2. A filter input appears at the top of the agent list
3. User types text to filter agent list (matches against agent name and status)
4. Filtered agent can be selected
5. Selected agent can then be killed/shut down via keyboard shortcut

**Why this is needed**:
- For teams with 10+ agents, scrolling through the list is inefficient
- Ctrl+F is a familiar "find" shortcut in many applications
- Kill operation after filter avoids navigating to the agent's pane

**Design rationale**: Rather than adding individual kill buttons (clutters small terminal UI), filter-then-kill provides power-user efficiency without UI complexity.

### 4.4 CJK Layout Fix

**Problem in v2.1.38**: When agent names or status messages contained CJK (Chinese, Japanese, Korean) characters, the agent tab had layout misalignment because CJK characters are "double-width" (occupy 2 columns in terminal).

**Fix in v2.1.76**:
- Text layout functions now use character width accounting (e.g., `wcwidth`-style calculation)
- CJK characters count as 2 columns when computing padding and alignment
- Prevents text truncation at wrong position and column misalignment

**Why important**: Claude Code has significant user base in East Asia. CJK team names or task descriptions are common in those locales.

**Implementation detail**: The `qGz` component applies width-aware string truncation before rendering. Pure byte-count truncation (old behavior) was replaced with column-width-aware truncation.

### 4.5 Integration with Existing Modes

**Agent tab complements (not replaces) existing UIs**:

| Mode | Primary UX | Agent Tab Role |
|------|-----------|----------------|
| In-process | Task list in main TUI | Unified view of all agents + kill capability |
| Split-pane (tmux) | Individual panes | Alternative overview without switching panes |
| Separate window | Separate windows | Remote management overview |

**Relationship to Shift+Up/Down**: Shift+Up/Down still works for quick message sending to in-process agents. The agent tab is primarily for monitoring and bulk management (filter, kill).

---

## 5. Status Indicators

### 5.1 Pane Title (tmux)

**Set pane title** after teammate spawn:

```bash
tmux select-pane -t ${paneId} -T "${agentName}"

# Example:
tmux select-pane -t %13 -T "backend-dev"
```

**Display**: Pane title shown in tmux status bar or pane borders (depends on tmux.conf).

**Use case**: User can identify panes by name instead of process ID.

### 5.2 Process Status (pane-based)

**Teammate process lifecycle**:

```
State 1: Starting
  Display: "Starting Claude Code teammate..."
  Duration: 0-1s (process spawn + initialization)

State 2: Polling
  Display: "Waiting for messages..."
  Duration: Indefinite (until message/task arrives)

State 3: Processing
  Display: Agent's natural output (tool calls, LLM responses)
  Duration: Varies (30s - 5min per message)

State 4: Shutdown
  Display: "Teammate shutdown approved. Exiting..."
  Duration: <1s (cleanup + exit)

State 5: Exited
  Display: "[Pane is dead]" (tmux native message)
```

**User visibility**: Full process output visible in pane (unlike in-process mode where output suppressed).

### 5.3 Exit Status

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

## 6. Visual Styling

### 6.1 Border Colors (tmux)

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

**Trade-off**: >8 agents -> color collisions. Mitigation: Use agent tab for large teams (provides text-based differentiation rather than relying on colors).

### 6.2 Message Colors (mailbox)

**Sender color** (in mailbox JSON):

```json
{
  "from": "team-lead",
  "text": "...",
  "color": "#3b82f6",
  "read": false
}
```

**Use case**: TUI or future GUI can color-code messages by sender for visual differentiation.

### 6.3 Visual Hierarchy

**In-process mode** (text-only):
```
Running Tasks:
[bullet] researcher - Analyzing...
[arrow]  backend-dev - Implementing...    <- Selected
[bullet] frontend-dev - Waiting...
```

**Pane-based mode** (spatial + color):
```
+---------+---------------+
| Leader  |  backend-dev  |  <- Blue border
|         |  (typing...)  |
|         +---------------+
|         |  frontend-dev |  <- Green border
|         |  (waiting)    |
+---------+---------------+
```

**Agent tab mode** (v2.1.76 - unified view):
```
Agents (4)  [Ctrl+F to filter]
> researcher    [SEL] Analyzing...
  backend-dev   [VWD] Implementing...
  frontend-dev  [IDL] Waiting...
  test-runner   [IDL] Polling...
```

**Why three approaches**: Each mode serves a different use case. Text (in-process) is fastest. Spatial (pane) is most informative. Agent tab is most manageable for large teams.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:

- `TmuxBackend.setPaneBorderColor` (fEA method) - Visual styling
- `TmuxBackend.rebalanceLayout` (fEA method) - Main-vertical layout
- `hashColor` - Deterministic color assignment
- `getSpinnerVerb` - Random status text
- `AgentTabComponent` (qGz) - NEW in v2.1.76: Agent tab UI (chunks.192.mjs)

## Source Locations

- `chunks.131.mjs:1144` - TmuxBackend class
- `chunks.110.mjs:931` - Keybinding registration
- `chunks.131.mjs:1201` - Layout algorithms (select-layout main-vertical)
- `chunks.192.mjs` - AgentTabComponent (qGz) - NEW in v2.1.76

---

**Document Status**: Complete UI/TUI patterns for in-process, pane-based, and new agent tab modes (v2.1.76).
