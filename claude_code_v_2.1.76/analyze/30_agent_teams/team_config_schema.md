# Team Config Schema - Structure and Lifecycle

> **Module**: Agent Teams - Team Configuration
> **Source**: `chunks.141.mjs` (lines 530-687, 759-850)
> **Version**: Claude Code 2.1.76

---

## Table of Contents

1. [Overview](#1-overview)
2. [Config File Location](#2-config-file-location)
3. [Schema Structure](#3-schema-structure)
4. [Lifecycle Management](#4-lifecycle-management)
5. [Validation Rules](#5-validation-rules)
6. [Read/Write Functions](#6-readwrite-functions)
7. [Error Handling](#7-error-handling)
8. [Design Trade-offs](#8-design-trade-offs)
9. [Related Symbols](#9-related-symbols)

---

## 1. Overview

The team configuration file (`config.json`) is the single source of truth for agent team metadata. It stores team membership, agent identities, backend information, and coordination state.

### Purpose

**Central registry**: All team operations (SendMessage, TeamDelete, graceful shutdown) read this file to determine:
- Who are the team members?
- What are their agent IDs and names?
- Which tmux/iTerm panes are they running in?
- What models are they using?
- When did they join the team?
- Are they background agents? (v2.1.76)

**Persistence**: Survives session restarts. If the team lead process crashes, the config file can be used to reconstruct team state (though this isn't currently implemented).

**File-based coordination**: In a distributed system where agents run in separate processes (or even separate machines), the file system provides a simple coordination mechanism without requiring a database or service.

### v2.1.76 Schema Changes

- `background` field added to `TeamMember` - marks an agent as a background worker
- `activeForm` field is **no longer required** for task creation - the schema is more permissive
- Improved handling of optional/missing fields to be more robust during partial state scenarios

---

## 2. Config File Location

### Path Structure

```
~/.claude/teams/{team-name}/config.json
```

**Examples**:
```
~/.claude/teams/research-team/config.json
~/.claude/teams/test-runners/config.json
~/.claude/teams/my-project-swarm/config.json
```

### Directory Creation

The directory is created atomically when TeamCreate executes:

```javascript
// In writeTeamConfig (mSY)
let configPath = getTeamConfigPath(teamName);  // ~/.claude/teams/{name}/
fs.mkdirSync(configPath, { recursive: true });  // Create if doesn't exist
let configFile = path.join(configPath, "config.json");
fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
```

**Why recursive: true**: Ensures parent directories (`~/.claude/teams/`) are created if they don't exist.

### Sibling Directories

```
~/.claude/teams/{team-name}/
├── config.json           # Team metadata
└── mailbox/              # Inter-agent message files
    ├── team-lead.jsonl
    ├── teammate-1.jsonl
    └── teammate-2.jsonl
```

---

## 3. Schema Structure

### Top-Level Fields

```typescript
interface TeamConfig {
  name: string;                // Team name (sanitized)
  description?: string;        // Optional team purpose
  createdAt: number;           // Unix timestamp (milliseconds)
  leadAgentId: string;         // Agent ID of team lead
  leadSessionId: string;       // Session ID of team lead
  members: TeamMember[];       // Array of team members (includes lead)
}
```

### TeamMember Structure

```typescript
interface TeamMember {
  agentId: string;             // Unique agent identifier (e.g., "agent-abc123")
  name: string;                // Display name (e.g., "team-lead", "researcher-1")
  agentType: string;           // Role/type (e.g., "researcher", "test-runner")
  model: string;               // Model name (e.g., "claude-sonnet-4-5-20250929")
  joinedAt: number;            // Unix timestamp when member joined
  tmuxPaneId: string;          // Tmux pane ID (e.g., "%42") or "" for in-process
  cwd: string;                 // Working directory path
  subscriptions: string[];     // Event subscriptions (currently unused)
  background?: boolean;        // NEW in v2.1.76: marks as background worker
}
```

### Example config.json

```json
{
  "name": "research-team",
  "description": "Team for analyzing codebase patterns",
  "createdAt": 1709596800000,
  "leadAgentId": "agent-lead-abc123",
  "leadSessionId": "session-xyz789",
  "members": [
    {
      "agentId": "agent-lead-abc123",
      "name": "team-lead",
      "agentType": "coordinator",
      "model": "claude-sonnet-4-5-20250929",
      "joinedAt": 1709596800000,
      "tmuxPaneId": "",
      "cwd": "/Users/alice/my-project",
      "subscriptions": [],
      "background": false
    },
    {
      "agentId": "agent-mate-def456",
      "name": "researcher-1",
      "agentType": "researcher",
      "model": "claude-sonnet-4-5-20250929",
      "joinedAt": 1709596850000,
      "tmuxPaneId": "%42",
      "cwd": "/Users/alice/my-project",
      "subscriptions": [],
      "background": false
    },
    {
      "agentId": "agent-mate-ghi789",
      "name": "test-runner",
      "agentType": "test-runner",
      "model": "claude-haiku-4-5-20251001",
      "joinedAt": 1709596900000,
      "tmuxPaneId": "%43",
      "cwd": "/Users/alice/my-project",
      "subscriptions": [],
      "background": true
    }
  ]
}
```

**Note**: The `test-runner` above is a background agent (`background: true`), meaning it runs as a non-interactive background worker and appears differently in the agent tab UI.

---

## 4. Lifecycle Management

### Creation (TeamCreate Tool)

**Step-by-step process:**

1. **Validate input**: Check `team_name` is non-empty, no existing team in current session

2. **Sanitize team name**: Convert to filesystem-safe format
   ```javascript
   function sanitizeTeamName(name) {
     if (!isValidTeamName(name)) return name;
     return generateRandomTeamName();  // Fallback to random name
   }
   ```

3. **Generate lead agent ID**: Create unique identifier for team lead
   ```javascript
   let leadAgentId = generateAgentId("team-lead", teamName);
   ```

4. **Build initial config**:
   ```javascript
   let config = {
     name: sanitizedName,
     description: userDescription,
     createdAt: Date.now(),
     leadAgentId: leadAgentId,
     leadSessionId: getCurrentSessionId(),
     members: [{
       agentId: leadAgentId,
       name: "team-lead",
       agentType: userAgentType || "team-lead",
       model: getCurrentModel(),
       joinedAt: Date.now(),
       tmuxPaneId: "",  // Team lead doesn't have pane (runs in main session)
       cwd: process.cwd(),
       subscriptions: [],
       background: false
     }]
   };
   ```

5. **Write to disk**: Call `writeTeamConfig(teamName, config)`

6. **Create mailbox directory**: Initialize `~/.claude/teams/{name}/mailbox/`

7. **Update AppState**: Store team context in session state
   ```javascript
   setAppState(state => ({
     ...state,
     teamContext: {
       teamName: sanitizedName,
       teamFilePath: configPath,
       leadAgentId: leadAgentId,
       teammates: { [leadAgentId]: { ... } }
     }
   }));
   ```

### Teammate Addition

**When a teammate is spawned** (via backend spawn command):

1. **Read current config**: `let config = readTeamConfig(teamName)`

2. **Generate teammate agent ID**: `let teammateId = generateAgentId(role, teamName)`

3. **Append to members array**:
   ```javascript
   config.members.push({
     agentId: teammateId,
     name: teammateName,
     agentType: role,
     model: modelForTeammate,
     joinedAt: Date.now(),
     tmuxPaneId: paneId,  // Populated by backend
     cwd: process.cwd(),
     subscriptions: [],
     background: params.background || false  // v2.1.76: honor background flag
   });
   ```

4. **Write updated config**: `writeTeamConfig(teamName, config)`

### Teammate Removal

**When a teammate exits gracefully**:

1. **Read current config**

2. **Remove from members array**:
   ```javascript
   config.members = config.members.filter(m => m.agentId !== exitingAgentId);
   ```

3. **Write updated config**

**Note**: Current implementation may not remove members automatically. TeamDelete cleans up entire team.

### Deletion (TeamDelete Tool)

**Step-by-step process:**

1. **Validate no active teammates**: Check that all teammates have exited
   ```javascript
   let config = readTeamConfig(teamName);
   let activeMembers = config.members.filter(m => m.agentId !== leadAgentId);
   if (activeMembers.length > 0) {
     throw Error("Team still has active members. Shut down teammates first.");
   }
   ```

2. **Delete team directory**: Remove entire `~/.claude/teams/{name}/`
   ```javascript
   fs.rmSync(teamDirPath, { recursive: true, force: true });
   ```

3. **Delete task directory**: Remove `~/.claude/tasks/{name}/` if exists

4. **Clear AppState**: Remove team context from session state
   ```javascript
   setAppState(state => ({ ...state, teamContext: null }));
   ```

---

## 5. Validation Rules

### Team Name Validation

**Rules**:
- Non-empty string
- Alphanumeric + hyphens + underscores
- No spaces or special characters
- No directory traversal characters (`.`, `/`, `\`)

**Implementation**:
```javascript
async validateInput(input, context) {
  if (!input.team_name || input.team_name.trim().length === 0) {
    return {
      result: false,
      message: "team_name is required for TeamCreate",
      errorCode: 9
    };
  }
  return { result: true };
}
```

**Sanitization**:
```javascript
function sanitizeTeamName(name) {
  if (!isValidTeamName(name)) {
    return name;  // Already valid
  }
  // Generate random name if invalid
  return generateRandomTeamName();
}
```

### Config Structure Validation

**Required fields**:
- `name` (string)
- `members` (array)
- `leadAgentId` (string)

**Optional fields**:
- `description` (string)
- `createdAt` (number) - defaults to Date.now()
- `leadSessionId` (string) - defaults to current session

**Member validation**:
- Each member must have: `agentId`, `name`, `agentType`, `model`, `joinedAt`
- `agentId` must be unique within members array
- `tmuxPaneId` can be empty string (for in-process) or pane ID
- `cwd` must be valid path (not validated currently)
- `background` is optional boolean (v2.1.76), defaults to `false`
- `activeForm` is no longer required (v2.1.76 - removed from required fields)

### Constraint: One Team Per Lead

```javascript
let currentTeam = appState.teamContext?.teamName;
if (currentTeam) {
  throw Error(`Already leading team "${currentTeam}". A leader can only manage one team at a time. Use TeamDelete to end the current team before creating a new one.`);
}
```

**Why this constraint**:
- Simplifies state management (one teamContext per session)
- Prevents confusion about which team a SendMessage targets
- Reduces risk of cross-team message delivery errors

---

## 6. Read/Write Functions

### getTeamConfigPath (ul4)

**What it does**: Resolves the path to a team's configuration directory.

```javascript
// ============================================
// getTeamConfigPath - Resolve team config directory path
// Location: chunks.141.mjs:530-532
// ============================================

// ORIGINAL (for source lookup):
function ul4(A) {
    return lRA(QP(), cRA(A))
}

// READABLE (for understanding):
function getTeamConfigPath(teamName) {
    let teamsBaseDir = getTeamsBaseDirectory();  // ~/.claude/teams/
    let teamSubdir = getTeamSubdirectory(teamName);  // Resolve symlink/alias
    return path.join(teamsBaseDir, teamSubdir);
}

// Mapping: ul4->getTeamConfigPath, A->teamName, lRA->path.join, QP->getTeamsBaseDirectory, cRA->getTeamSubdirectory
```

### writeTeamConfig (mSY)

**What it does**: Writes team configuration to disk, creating directories if needed.

```javascript
// ============================================
// writeTeamConfig - Write team config to disk
// Location: chunks.141.mjs:534-541
// ============================================

// ORIGINAL (for source lookup):
function mSY(A, q) {
    let K = ul4(A);
    uSY(K, { recursive: !0 });
    let Y = lRA(K, "config.json");
    c8(Y, Q1(q, null, 2))
}

// READABLE (for understanding):
function writeTeamConfig(teamName, configObject) {
    // Get team directory path
    let teamDir = getTeamConfigPath(teamName);

    // Create directory (and parents) if doesn't exist
    fs.mkdirSync(teamDir, { recursive: true });

    // Build full path to config.json
    let configFilePath = path.join(teamDir, "config.json");

    // Write config as formatted JSON (2-space indent)
    fs.writeFileSync(configFilePath, JSON.stringify(configObject, null, 2));
}

// Mapping: mSY->writeTeamConfig, A->teamName, q->configObject, K->teamDir, Y->configFilePath, ul4->getTeamConfigPath, uSY->fs.mkdirSync, lRA->path.join, c8->fs.writeFileSync, Q1->JSON.stringify
```

**Why JSON.stringify with indent**: Makes config human-readable for debugging. Users can inspect `~/.claude/teams/{name}/config.json` directly.

### readTeamConfig (M51)

**What it does**: Reads team configuration from disk, with error handling for missing/corrupted files.

```javascript
// Typical implementation (inferred from usage):
function readTeamConfig(teamName) {
    let configPath = path.join(getTeamConfigPath(teamName), "config.json");

    try {
        let raw = fs.readFileSync(configPath, "utf-8");
        let config = JSON.parse(raw);
        return config;
    } catch (error) {
        if (error.code === "ENOENT") {
            // File doesn't exist
            return null;
        }
        // Parse error or permission error
        log(`Failed to read team config: ${error.message}`);
        return null;
    }
}
```

**Error handling**: Returns `null` on failure rather than throwing. Callers must check for null.

---

## 7. Error Handling

### Error 1: Team Already Exists

**Scenario**: User calls TeamCreate with a name that already has a config directory.

**Detection**:
```javascript
let configPath = getTeamConfigPath(teamName);
if (fs.existsSync(path.join(configPath, "config.json"))) {
  throw Error(`Team "${teamName}" already exists. Use a different name or delete the existing team.`);
}
```

**User action**: Use TeamDelete to remove old team, or choose different name.

### Error 2: Config File Corrupted

**Scenario**: `config.json` contains invalid JSON or missing required fields.

**Detection**:
```javascript
let config = readTeamConfig(teamName);
if (!config || !config.members || !config.leadAgentId) {
  throw Error(`Team config for "${teamName}" is corrupted. Delete and recreate team.`);
}
```

**Recovery**: See [error_recovery.md](./error_recovery.md#state-corruption-recovery)

### Error 3: Teammate Not Found in Config

**Scenario**: SendMessage tries to send to a teammate that isn't in members array.

**Detection**:
```javascript
let config = readTeamConfig(teamName);
let recipient = config.members.find(m => m.name === recipientName);
if (!recipient) {
  return {
    success: false,
    error: `Recipient "${recipientName}" is not a member of team "${teamName}"`
  };
}
```

**User action**: Check available teammates with TeamList (if implemented) or use broadcast.

### Error 4: TeamDelete with Active Members

**Scenario**: User tries to delete team while teammates are still running.

**Detection**:
```javascript
let config = readTeamConfig(teamName);
let activeMembers = config.members.filter(m => m.agentId !== leadAgentId);
if (activeMembers.length > 0) {
  throw Error(`Team still has ${activeMembers.length} active members. Shut down teammates first.`);
}
```

**User action**: Send shutdown requests to all teammates, wait for approval/termination, then retry TeamDelete.

---

## 8. Design Trade-offs

### File-Based vs Database Storage

**Chosen approach**: File-based (JSON file per team)

**Alternatives considered**:
- **SQLite database**: `~/.claude/teams.db` with teams/members tables
- **In-memory only**: No persistence, reconstruct on restart

**Why file-based**:
- Simple implementation (no database library needed)
- Human-readable (users can inspect/edit config.json)
- No locking complexity (file system provides atomicity for small writes)
- Easy to back up (copy entire ~/.claude/teams/ directory)

**Trade-offs**:
- No transactions (multi-file updates not atomic)
- No indexes (must read entire file to find member)
- Race conditions possible (simultaneous writes from separate processes)

### JSON vs Binary Format

**Chosen approach**: JSON with 2-space indent

**Alternatives considered**:
- **Binary format** (MessagePack, Protocol Buffers)
- **YAML** (more human-readable)
- **TOML** (simpler syntax)

**Why JSON**:
- Built-in JavaScript support (no extra dependencies)
- Widely understood format
- Easy to parse and edit manually
- 2-space indent makes diffs readable

**Trade-offs**:
- Larger file size than binary (not significant for config files)
- No comments support (can't add inline documentation)

### Directory per Team vs Single Config File

**Chosen approach**: Directory per team (`~/.claude/teams/{name}/`)

**Alternatives considered**:
- **Single file**: `~/.claude/teams.json` with all teams
- **Flat files**: `~/.claude/team-{name}.json` in teams dir

**Why directory per team**:
- Scales to many teams (no single-file size limit)
- Natural grouping (config + mailbox in same directory)
- Easy to delete team (remove directory recursively)
- Supports per-team resources (logs, state files)

**Trade-offs**:
- More filesystem operations (list directories to find teams)
- No easy way to atomically update multiple teams

### Recursive: true for mkdirSync

**Chosen approach**: Always use `{ recursive: true }`

**Why**:
- Creates parent directories automatically (`~/.claude/` if needed)
- Idempotent (doesn't fail if directory exists)
- Simplifies code (no need to check existence first)

**Trade-off**: Slightly slower than non-recursive (checks all parents), but negligible for small depth.

---

## 9. Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `getTeamConfigPath` (ul4) - Resolve path to team config directory
- `writeTeamConfig` (mSY) - Write team configuration to disk with directory creation
- `readTeamConfig` (M51) - Read team configuration from disk with error handling
- `TeamCreateTool` (QSY) - Tool for creating new teams, initializes config
- `TeamDeleteTool` (USY) - Tool for deleting teams, removes config and directories
- `sanitizeTeamName` (FSY) - Convert team name to filesystem-safe format
- `generateAgentId` (pv) - Create unique agent identifier
- `getTeamsBaseDirectory` (QP) - Get base directory for all teams (~/.claude/teams/)
- `getTeamSubdirectory` (cRA) - Resolve team subdirectory name

Cross-references:

- [error_recovery.md](./error_recovery.md) - Config corruption recovery strategies
- [inter_agent_communication.md](./inter_agent_communication.md) - Mailbox directory structure
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture
