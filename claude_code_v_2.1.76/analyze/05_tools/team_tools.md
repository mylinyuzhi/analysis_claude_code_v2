# Team Tools - Deep Analysis (Claude Code 2.1.76)

> Complete analysis of team/swarm coordination tools: TeamCreate, TeamDelete, SendMessage.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `TeamCreateTool` (vh) - Create new team for agent coordination - chunks.141.mjs:572
- `TeamDeleteTool` (VK1) - Delete team and cleanup resources - chunks.141.mjs:760
- `SendMessageTool` (iB) - Send messages between team members - chunks.141.mjs

---

## Architecture Overview

```
Team/Swarm System
│
├── Team Creation
│   ├── TeamCreate → Creates team with leader agent
│   │   ├── Generates unique team name
│   │   ├── Creates team config file
│   │   └── Sets up task list for team
│   │
│   └── Team Spawning (via Task tool)
│       └── spawnTeammateDispatcher → Launches teammate agents
│
├── Team Communication
│   ├── SendMessage → Send message to team members
│   └── Mailbox System → File-based message queue
│
└── Team Cleanup
    └── TeamDelete → Removes team resources
        ├── Cleanup worktrees
        ├── Remove config files
        └── Clear task list
```

---

## 1. TeamCreate Tool

### TeamCreateTool (vh) - Create agent team

**What it does:** Creates a new team for coordinating multiple agents working on a project. Teams have a 1:1 correspondence with task lists.

**How it works:**
1. Validates no existing team leadership
2. Generates unique team ID and leader agent ID
3. Creates team configuration file
4. Initializes task list for team coordination
5. Sets up team context in app state

```javascript
// ============================================
// TeamCreateTool - Team creation and setup
// Location: chunks.141.mjs:572-700
// ============================================

// ORIGINAL (for source lookup):
vh = "TeamCreate"

// Tool definition at chunks.141.mjs:572-700
{
    name: vh,  // "TeamCreate"
    maxResultSizeChars: 1e5,
    userFacingName() { return "" },
    get inputSchema() { return BSY() },
    isEnabled() { return l8() },
    isConcurrencySafe(A) { return !1 },
    isReadOnly(A) { return !1 },
    async checkPermissions(A, q) { return { behavior: "allow", updatedInput: A } },
    async validateInput(A, q) {
        if (!A.team_name || A.team_name.trim().length === 0) {
            return { result: !1, message: "team_name is required for TeamCreate", errorCode: 9 };
        }
        return { result: !0 }
    },
    async call(A, q) {
        let { setAppState: K, getAppState: Y } = q,
            { team_name: z, description: w, agent_type: H } = A,
            $ = await Y(),
            O = $.teamContext?.teamName;

        if (O) throw Error(`Already leading team "${O}". A leader can only manage one team at a time.`);

        let _ = FSY(z),  // Sanitize team name
            J = pv(K2, _),  // Generate leader agent ID
            X = H || K2,
            D = t9($.mainLoopModelForSession ?? $.mainLoopModel ?? ML()),
            j = ul4(_),  // Get team directory path
            M = lRA(j, "config.json"),  // Config file path
            P = {
                name: _,
                description: w,
                createdAt: Date.now(),
                leadAgentId: J,
                leadSessionId: U6(),
                members: [{
                    agentId: J,
                    name: K2,
                    agentType: X,
                    model: D,
                    joinedAt: Date.now(),
                    tmuxPaneId: "",
                    cwd: h6(),
                    subscriptions: []
                }]
            };
        // ... write config, create task list, update state
    }
}

// READABLE (for understanding):
const TeamCreateTool = {
    name: "TeamCreate",
    maxResultSizeChars: 100000,

    inputSchema: z.strictObject({
        team_name: z.string().describe("Name for the team"),
        description: z.string().optional().describe("Description of what the team is working on"),
        agent_type: z.string().optional().describe("Agent type for the leader")
    }),

    isEnabled() {
        return isAgentTeamsEnabled();  // Feature flag check
    },

    isConcurrencySafe() { return false; },  // Modifies global team state
    isReadOnly() { return false; },

    async validateInput(input, context) {
        if (!input.team_name || input.team_name.trim().length === 0) {
            return {
                result: false,
                message: "team_name is required for TeamCreate",
                errorCode: 9
            };
        }
        return { result: true };
    },

    async call(input, toolUseContext) {
        let { setAppState, getAppState } = toolUseContext;
        let { team_name, description, agent_type } = input;

        let appState = await getAppState();
        let existingTeam = appState.teamContext?.teamName;

        // Prevent leading multiple teams
        if (existingTeam) {
            throw Error(`Already leading team "${existingTeam}". A leader can only manage one team at a time. Use TeamDelete to end the current team before creating a new one.`);
        }

        // Generate team identifiers
        let sanitizedTeamName = sanitizeTeamName(team_name);
        let leaderAgentId = generateAgentId("leader", sanitizedTeamName);
        let leaderAgentType = agent_type || "leader";

        // Resolve model for leader
        let leaderModel = resolveModelId(
            appState.mainLoopModelForSession ?? appState.mainLoopModel ?? getDefaultModel()
        );

        // Create team directory
        let teamDir = getTeamDirectory(sanitizedTeamName);
        let configPath = path.join(teamDir, "config.json");

        // Team configuration
        let teamConfig = {
            name: sanitizedTeamName,
            description: description,
            createdAt: Date.now(),
            leadAgentId: leaderAgentId,
            leadSessionId: getSessionId(),
            members: [{
                agentId: leaderAgentId,
                name: "leader",
                agentType: leaderAgentType,
                model: leaderModel,
                joinedAt: Date.now(),
                tmuxPaneId: "",
                cwd: getCurrentWorkingDirectory(),
                subscriptions: []
            }]
        };

        // Write team config
        await fs.mkdir(teamDir, { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(teamConfig, null, 2));

        // Create task list for team
        let taskListId = createTaskListForTeam(sanitizedTeamName);

        // Update app state with team context
        setAppState((state) => ({
            ...state,
            teamContext: {
                teamName: sanitizedTeamName,
                isLeader: true,
                leadAgentId: leaderAgentId
            },
            inbox: {
                messages: []
            }
        }));

        return {
            data: {
                success: true,
                team_name: sanitizedTeamName,
                leader_agent_id: leaderAgentId,
                task_list_id: taskListId
            }
        };
    }
};

// Mapping: vh→TeamCreateTool, FSY→sanitizeTeamName, pv→generateAgentId,
//          ul4→getTeamDirectory, l8→isAgentTeamsEnabled, K2→LEADER_NAME
```

**Key insight:** Teams are persisted as config files on disk, allowing persistence across sessions and enabling teammate discovery.

---

## 2. TeamDelete Tool

### TeamDeleteTool (VK1) - Delete team and cleanup

**What it does:** Cleans up team resources when the swarm is complete. Removes team directories, worktrees, and clears state.

**How it works:**
1. Checks for active teammates (cannot delete if members present)
2. Removes team directory and config
3. Cleans up any worktrees created by team
4. Clears team context from app state

```javascript
// ============================================
// TeamDeleteTool - Team cleanup
// Location: chunks.141.mjs:760-840
// ============================================

// ORIGINAL (for source lookup):
VK1 = "TeamDelete"

// Tool definition at chunks.141.mjs:760-840
{
    name: VK1,  // "TeamDelete"
    maxResultSizeChars: 1e5,
    userFacingName() { return "" },
    get inputSchema() { return gSY() },
    isEnabled() { return l8() },
    isConcurrencySafe(A) { return !1 },
    isReadOnly(A) { return !1 },
    async checkPermissions(A, q) { return { behavior: "allow", updatedInput: A } },
    async description() { return "Clean up team and task directories when the swarm is complete" },
    async call(A, q) {
        let { setAppState: K, getAppState: Y } = q,
            w = (await Y()).teamContext?.teamName;

        if (w) {
            let H = iX(w);  // Get team config
            if (H) {
                let $ = H.members.filter((O) => O.name !== K2);  // Non-leader members
                if ($.length > 0) {
                    let O = $.map((_) => _.name).join(", ");
                    return {
                        data: {
                            success: !1,
                            message: `Cannot cleanup team with ${$.length} active member(s): ${O}. Use requestShutdown to gracefully terminate teammates first.`,
                            team_name: w
                        }
                    };
                }
            }
            await OR4(w);  // Cleanup team directory
            fu4();  // Cleanup task list
            D67();  // Cleanup worktrees
        }

        K((H) => ({
            ...H,
            teamContext: void 0,
            inbox: { messages: [] }
        }));

        return {
            data: {
                success: !0,
                message: w ? `Cleaned up directories and worktrees for team "${w}"` : "No team name found, nothing to clean up",
                team_name: w
            }
        };
    }
}

// READABLE (for understanding):
const TeamDeleteTool = {
    name: "TeamDelete",
    maxResultSizeChars: 100000,

    async description() {
        return "Clean up team and task directories when the swarm is complete";
    },

    isEnabled() {
        return isAgentTeamsEnabled();
    },

    isConcurrencySafe() { return false; },
    isReadOnly() { return false; },

    async call(input, toolUseContext) {
        let { setAppState, getAppState } = toolUseContext;

        let teamName = (await getAppState()).teamContext?.teamName;

        if (teamName) {
            // Load team config to check for active members
            let teamConfig = loadTeamConfig(teamName);

            if (teamConfig) {
                // Filter out leader to get active teammates
                let activeMembers = teamConfig.members.filter(
                    (member) => member.name !== "leader"
                );

                if (activeMembers.length > 0) {
                    let memberNames = activeMembers.map((m) => m.name).join(", ");
                    return {
                        data: {
                            success: false,
                            message: `Cannot cleanup team with ${activeMembers.length} active member(s): ${memberNames}. Use requestShutdown to gracefully terminate teammates first.`,
                            team_name: teamName
                        }
                    };
                }
            }

            // Perform cleanup
            await cleanupTeamDirectory(teamName);
            cleanupTaskList();
            cleanupWorktrees();
        }

        // Clear team context from state
        setAppState((state) => ({
            ...state,
            teamContext: undefined,
            inbox: { messages: [] }
        }));

        return {
            data: {
                success: true,
                message: teamName
                    ? `Cleaned up directories and worktrees for team "${teamName}"`
                    : "No team name found, nothing to clean up",
                team_name: teamName
            }
        };
    }
};

// Mapping: VK1→TeamDeleteTool, iX→loadTeamConfig, OR4→cleanupTeamDirectory,
//          fu4→cleanupTaskList, D67→cleanupWorktrees, l8→isAgentTeamsEnabled
```

**Why cleanup is required:** Teams create persistent resources (directories, config files, worktrees) that must be explicitly cleaned up to avoid resource leaks.

---

## 3. SendMessage Tool

### SendMessageTool (iB) - Inter-agent messaging

**What it does:** Sends messages between team members via a mailbox system for coordination.

```javascript
// ============================================
// SendMessageTool - Team messaging
// Location: chunks.141.mjs (referenced)
// ============================================

// READABLE (for understanding):
const SendMessageTool = {
    name: "SendMessage",
    maxResultSizeChars: 100000,

    inputSchema: z.strictObject({
        recipient: z.string().describe("Name of the recipient agent or 'all' for broadcast"),
        message: z.string().describe("Message content to send"),
        message_type: z.enum(["text", "task", "status"]).optional()
    }),

    outputSchema: z.object({
        success: z.boolean(),
        message_id: z.string().optional(),
        recipient: z.string()
    }),

    isEnabled() {
        return isAgentTeamsEnabled();
    },

    isConcurrencySafe() { return true; },
    isReadOnly() { return false; },

    async call({ recipient, message, message_type }, toolUseContext) {
        let appState = await toolUseContext.getAppState();
        let teamContext = appState.teamContext;

        if (!teamContext) {
            throw Error("SendMessage can only be used within a team context");
        }

        // Create message object
        let messageObj = {
            id: generateMessageId(),
            sender: teamContext.isLeader ? "leader" : getCurrentAgentName(),
            recipient: recipient,
            message: message,
            type: message_type || "text",
            timestamp: Date.now()
        };

        // Write to recipient's mailbox
        if (recipient === "all") {
            // Broadcast to all team members
            let teamConfig = loadTeamConfig(teamContext.teamName);
            for (let member of teamConfig.members) {
                await writeToMailbox(member.agentId, messageObj);
            }
        } else {
            // Direct message to specific agent
            await writeToMailbox(recipient, messageObj);
        }

        return {
            data: {
                success: true,
                message_id: messageObj.id,
                recipient: recipient
            }
        };
    }
};

// Mapping: iB→SendMessageTool
```

---

## 4. Team Configuration Schema

### Team Config Structure

```javascript
// ============================================
// TeamConfig - Team configuration schema
// ============================================

interface TeamConfig {
    name: string;           // Sanitized team name
    description?: string;   // Team purpose
    createdAt: number;      // Creation timestamp

    leadAgentId: string;    // Leader's unique agent ID
    leadSessionId: string;  // Leader's session ID

    members: TeamMember[];  // All team members including leader
}

interface TeamMember {
    agentId: string;        // Unique agent identifier
    name: string;           // Display name (leader, agent-1, etc.)
    agentType: string;      // Agent type (general-purpose, explore, etc.)
    model: string;          // Model ID (claude-sonnet-4-6, etc.)

    joinedAt: number;       // Join timestamp
    tmuxPaneId: string;     // tmux pane ID for terminal control
    cwd: string;            // Working directory

    subscriptions: string[]; // Subscribed message channels
}
```

---

## 5. Mailbox System

### File-based Message Queue

**What it does:** Provides persistent message storage for inter-agent communication with file locking for concurrent access safety.

```javascript
// ============================================
// Mailbox System - File-based message queue
// Location: chunks.132.mjs:3-55
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", { encoding: "utf-8", flag: "wx" }),
        k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {
            k(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${w}`), _6(w);
            return
        }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, { lockfilePath: z, ...iv1 });
        let w = await wl(A, K),
            O = { ...q, read: !1 };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"),
        k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = JSON.parse(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            // Mailbox doesn't exist yet - return empty
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

async function writeToMailbox(recipientName, message, teamName) {
    // Ensure team directory exists
    await ensureTeamDirectory(teamName);

    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${mailboxPath}`);

    // Create mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Write only if doesn't exist
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Acquire lock and write message
    let releaseLock;
    try {
        releaseLock = await fileLock.acquire(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        let messages = await readMailbox(recipientName, teamName);
        let newMessage = { ...message, read: false };
        messages.push(newMessage);

        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (error) {
        log(`Failed to write to inbox for ${recipientName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: wl→readMailbox, x3→writeToMailbox, FY6→getMailboxPath,
//          Nc6.lock→fileLock.acquire, Pf6→fs.writeFile, xd4→fs.readFile
```

**Key insight:** Uses file locking (`Nc6.lock`) to prevent race conditions when multiple agents write to the same mailbox concurrently. The lock file pattern (`${mailboxPath}.lock`) ensures atomic operations.

### Mailbox Message Schema

```javascript
interface MailboxMessage {
    from: string;       // Sender agent name
    to: string;          // Recipient agent name or "all"
    message: string;     // Message content
    type: "text" | "task" | "status";
    read: boolean;       // Whether message has been read
    timestamp: number;   // Unix timestamp
}
```

---

## 6. Complete Tool Reference

| Tool | Obfuscated | Purpose | Location |
|------|------------|---------|----------|
| TeamCreate | `vh` | Create new team | chunks.141.mjs:572 |
| TeamDelete | `VK1` | Delete team and cleanup | chunks.141.mjs:760 |
| SendMessage | `iB` | Send inter-agent messages | chunks.141.mjs |

---

## 7. Key Properties

| Tool | Concurrency Safe | Read-Only | Team Required |
|------|-----------------|-----------|---------------|
| TeamCreate | ❌ | ❌ | No |
| TeamDelete | ❌ | ❌ | Yes |
| SendMessage | ✅ | ❌ | Yes |

---

## 8. Team Spawning Flow

```
User Request
     │
     ▼
TeamCreate(team_name, description)
     │
     ├── Create team directory
     ├── Write config.json
     ├── Create task list
     └── Set teamContext in state
     │
     ▼
Task tool with team_name parameter
     │
     ├── spawnTeammateDispatcher
     │   ├── Create agent ID
     │   ├── Fork conversation context
     │   └── Launch in split pane
     │
     └── Teammate joins team
         ├── Update config.json
         └── Subscribe to messages
     │
     ▼
SendMessage for coordination
     │
     ▼
TeamDelete when complete
     │
     ├── Cleanup teammate processes
     ├── Remove team directory
     └── Clear teamContext
```