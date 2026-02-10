
// @from(Ln 357085, Col 4)
Gl4 = v(() => {
    i7();
    vw();
    S9();
    Cz();
    H$();
    aM();
    hSY = z7(() => {
        let A = J71.or(u.literal("deleted"));
        return u.strictObject({
            taskId: u.string().describe("The ID of the task to update"),
            subject: u.string().optional().describe("New subject for the task"),
            description: u.string().optional().describe("New description for the task"),
            activeForm: u.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
            status: A.optional().describe("New status for the task"),
            addBlocks: u.array(u.string()).optional().describe("Task IDs that this task blocks"),
            addBlockedBy: u.array(u.string()).optional().describe("Task IDs that block this task"),
            owner: u.string().optional().describe("New owner for the task"),
            metadata: u.record(u.string(), u.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")
        })
    }), ISY = z7(() => u.object({
        success: u.boolean(),
        taskId: u.string(),
        updatedFields: u.array(u.string()),
        error: u.string().optional(),
        statusChange: u.object({
            from: u.string(),
            to: u.string()
        }).optional()
    })), Wl4 = {
        name: DR,
        maxResultSizeChars: 1e5,
        async description() {
            return _l4
        },
        async prompt() {
            return Jl4
        },
        get inputSchema() {
            return hSY()
        },
        get outputSchema() {
            return ISY()
        },
        userFacingName() {
            return "TaskUpdate"
        },
        isEnabled() {
            return jH()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: Xl4,
        renderToolUseProgressMessage: Dl4,
        renderToolUseRejectedMessage: jl4,
        renderToolUseErrorMessage: Ml4,
        renderToolResultMessage: Pl4,
        async call({
            taskId: A,
            subject: q,
            description: K,
            activeForm: Y,
            status: z,
            owner: w,
            addBlocks: H,
            addBlockedBy: $,
            metadata: O
        }, _) {
            let J = WM();
            _.setAppState((M) => {
                if (M.expandedView === "tasks") return M;
                return {
                    ...M,
                    expandedView: "tasks"
                }
            });
            let X = lg(J, A);
            if (!X) return {
                data: {
                    success: !1,
                    taskId: A,
                    updatedFields: [],
                    error: "Task not found"
                }
            };
            let D = [],
                j = {};
            if (q !== void 0 && q !== X.subject) j.subject = q, D.push("subject");
            if (K !== void 0 && K !== X.description) j.description = K, D.push("description");
            if (Y !== void 0 && Y !== X.activeForm) j.activeForm = Y, D.push("activeForm");
            if (w !== void 0 && w !== X.owner) j.owner = w, D.push("owner");
            if (l8() && z === "in_progress" && w === void 0 && !X.owner) {
                let M = g5();
                if (M) j.owner = M, D.push("owner")
            }
            if (O !== void 0) {
                let M = {
                    ...X.metadata ?? {}
                };
                for (let [P, W] of Object.entries(O))
                    if (W === null) delete M[P];
                    else M[P] = W;
                j.metadata = M, D.push("metadata")
            }
            if (z !== void 0) {
                if (z === "deleted") {
                    let M = sq6(J, A);
                    return {
                        data: {
                            success: M,
                            taskId: A,
                            updatedFields: M ? ["deleted"] : [],
                            error: M ? void 0 : "Failed to delete task",
                            statusChange: M ? {
                                from: X.status,
                                to: "deleted"
                            } : void 0
                        }
                    }
                }
                if (z !== X.status) {
                    if (z === "completed") {
                        let M = [],
                            P = Cg1(A, X.subject, X.description, g5(), i3(), void 0, _?.abortController?.signal, void 0, _);
                        for await (let W of P) if (W.blockingError) M.push(yg1(W.blockingError));
                        if (M.length > 0) return {
                            data: {
                                success: !1,
                                taskId: A,
                                updatedFields: [],
                                error: M.join(`
`)
                            }
                        }
                    }
                    j.status = z, D.push("status")
                }
            }
            if (Object.keys(j).length > 0) JS(J, A, j);
            if (j.owner && l8()) {
                let M = g5() || "team-lead",
                    P = b$(),
                    W = JSON.stringify({
                        type: "task_assignment",
                        taskId: A,
                        subject: X.subject,
                        description: X.description,
                        assignedBy: M,
                        timestamp: new Date().toISOString()
                    });
                f9(j.owner, {
                    from: M,
                    text: W,
                    timestamp: new Date().toISOString(),
                    color: P
                }, J)
            }
            if (H && H.length > 0) {
                let M = H.filter((P) => !X.blocks.includes(P));
                for (let P of M) r7A(J, A, P);
                if (M.length > 0) D.push("blocks")
            }
            if ($ && $.length > 0) {
                let M = $.filter((P) => !X.blockedBy.includes(P));
                for (let P of M) r7A(J, P, A);
                if (M.length > 0) D.push("blockedBy")
            }
            return {
                data: {
                    success: !0,
                    taskId: A,
                    updatedFields: D,
                    statusChange: j.status !== void 0 ? {
                        from: X.status,
                        to: j.status
                    } : void 0
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                success: K,
                taskId: Y,
                updatedFields: z,
                error: w,
                statusChange: H
            } = A;
            if (!K) return {
                tool_use_id: q,
                type: "tool_result",
                content: w || `Task #${Y} not found`
            };
            let $ = `Updated task #${Y} ${z.join(", ")}`;
            if (H?.to === "completed" && ID() && l8()) $ += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
            return {
                tool_use_id: q,
                type: "tool_result",
                content: $
            }
        }
    }
})
// @from(Ln 357300, Col 0)
function fl4() {
    let A = l8() ? `- Before assigning tasks to teammates, to see what's available
` : "",
        q = l8() ? "- **id**: Task identifier (use with TaskGet, TaskUpdate)" : "- **id**: Task identifier (use with TaskGet, TaskUpdate)",
        K = l8() ? `
## Teammate Workflow

When working as a teammate:
1. After completing your current task, call TaskList to find available work
2. Look for tasks with status 'pending', no owner, and empty blockedBy
3. **Prefer tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones
4. Claim an available task using TaskUpdate (set \`owner\` to your name), or wait for leader assignment
5. If blocked, focus on unblocking tasks or notify the team lead
` : "";
    return `Use this tool to list all tasks in the task list.

## When to Use This Tool

- To see what tasks are available to work on (status: 'pending', no owner, not blocked)
- To check overall progress on the project
- To find tasks that are blocked and need dependencies resolved
${A}- After completing a task, to check for newly unblocked work or claim the next available task
- **Prefer working on tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones

## Output

Returns a summary of each task:
${q}
- **subject**: Brief description of the task
- **status**: 'pending', 'in_progress', or 'completed'
- **owner**: Agent ID if assigned, empty if available
- **blockedBy**: List of open task IDs that must be resolved first (tasks with blockedBy cannot be claimed until dependencies resolve)

Use TaskGet with a specific task ID to view full details including description and comments.
${K}`
}
// @from(Ln 357336, Col 4)
Zl4 = "List all tasks in the task list"
// @from(Ln 357337, Col 4)
Vl4 = v(() => {
    S9()
})
// @from(Ln 357341, Col 0)
function Nl4() {
    return null
}
// @from(Ln 357345, Col 0)
function Tl4() {
    return null
}
// @from(Ln 357349, Col 0)
function vl4() {
    return null
}
// @from(Ln 357353, Col 0)
function El4() {
    return null
}
// @from(Ln 357357, Col 0)
function kl4(A) {
    return null
}
// @from(Ln 357360, Col 4)
xSY
// @from(Ln 357360, Col 9)
bSY
// @from(Ln 357360, Col 14)
Ll4
// @from(Ln 357361, Col 4)
Rl4 = v(() => {
    i7();
    Vl4();
    vw();
    xSY = z7(() => u.strictObject({})), bSY = z7(() => u.object({
        tasks: u.array(u.object({
            id: u.string(),
            subject: u.string(),
            status: J71,
            owner: u.string().optional(),
            blockedBy: u.array(u.string())
        }))
    })), Ll4 = {
        name: TK1,
        maxResultSizeChars: 1e5,
        async description() {
            return Zl4
        },
        async prompt() {
            return fl4()
        },
        get inputSchema() {
            return xSY()
        },
        get outputSchema() {
            return bSY()
        },
        userFacingName() {
            return "TaskList"
        },
        isEnabled() {
            return jH()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: Nl4,
        renderToolUseProgressMessage: Tl4,
        renderToolUseRejectedMessage: vl4,
        renderToolUseErrorMessage: El4,
        renderToolResultMessage: kl4,
        async call() {
            let A = WM(),
                q = WX(A).filter((z) => !z.metadata?._internal),
                K = new Set(q.filter((z) => z.status === "completed").map((z) => z.id));
            return {
                data: {
                    tasks: q.map((z) => ({
                        id: z.id,
                        subject: z.subject,
                        status: z.status,
                        owner: z.owner,
                        blockedBy: z.blockedBy.filter((w) => !K.has(w))
                    }))
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                tasks: K
            } = A;
            if (K.length === 0) return {
                tool_use_id: q,
                type: "tool_result",
                content: "No tasks found"
            };
            let Y = K.map((z) => {
                let w = z.owner ? ` (${z.owner})` : "",
                    H = z.blockedBy.length > 0 ? ` [blocked by ${z.blockedBy.map(($)=>`#${$}`).join(", ")}]` : "";
                return `#${z.id} [${z.status}] ${z.subject}${w}${H}`
            });
            return {
                tool_use_id: q,
                type: "tool_result",
                content: Y.join(`
`)
            }
        }
    }
})
// @from(Ln 357451, Col 0)
function yl4() {
    return `
# TeamCreate

## When to Use

Use this tool proactively whenever:
- The user explicitly asks to use a team, swarm, or group of agents
- The user mentions wanting agents to work together, coordinate, or collaborate
- A task is complex enough that it would benefit from parallel work by multiple agents (e.g., building a full-stack feature with frontend and backend work, refactoring a codebase while keeping tests passing, implementing a multi-step project with research, planning, and coding phases)

When in doubt about whether a task warrants a team, prefer spawning a team.

## Choosing Agent Types for Teammates

When spawning teammates via the Task tool, choose the \`subagent_type\` based on what tools the agent needs for its task. Each agent type has a different set of available tools — match the agent to the work:

- **Read-only agents** (e.g., Explore, Plan) cannot edit or write files. Only assign them research, search, or planning tasks. Never assign them implementation work.
- **Full-capability agents** (e.g., general-purpose) have access to all tools including file editing, writing, and bash. Use these for tasks that require making changes.
- **Custom agents** defined in \`.claude/agents/\` may have their own tool restrictions. Check their descriptions to understand what they can and cannot do.

Always review the agent type descriptions and their available tools listed in the Task tool prompt before selecting a \`subagent_type\` for a teammate.

Create a new team to coordinate multiple agents working on a project. Teams have a 1:1 correspondence with task lists (Team = TaskList).

\`\`\`
{
  "team_name": "my-project",
  "description": "Working on feature X"
}
\`\`\`

This creates:
- A team file at \`~/.claude/teams/{team-name}.json\`
- A corresponding task list directory at \`~/.claude/tasks/{team-name}/\`

## Team Workflow

1. **Create a team** with TeamCreate - this creates both the team and its task list
2. **Create tasks** using the Task tools (TaskCreate, TaskList, etc.) - they automatically use the team's task list
3. **Spawn teammates** using the Task tool with \`team_name\` and \`name\` parameters to create teammates that join the team
4. **Assign tasks** using TaskUpdate with \`owner\` to give tasks to idle teammates
5. **Teammates work on assigned tasks** and mark them completed via TaskUpdate
6. **Teammates go idle between turns** - after each turn, teammates automatically go idle and send a notification. IMPORTANT: Be patient with idle teammates! Don't comment on their idleness until it actually impacts your work.
7. **Shutdown your team** - when the task is completed, gracefully shut down your teammates via SendMessage with type: "shutdown_request".

## Task Ownership

Tasks are assigned using TaskUpdate with the \`owner\` parameter. Any agent can set or change task ownership via TaskUpdate.

## Automatic Message Delivery

**IMPORTANT**: Messages from teammates are automatically delivered to you. You do NOT need to manually check your inbox.

When you spawn teammates:
- They will send you messages when they complete tasks or need help
- These messages appear automatically as new conversation turns (like user messages)
- If you're busy (mid-turn), messages are queued and delivered when your turn ends
- The UI shows a brief notification with the sender's name when messages are waiting

Messages will be delivered automatically.

When reporting on teammate messages, you do NOT need to quote the original message—it's already rendered to the user.

## Teammate Idle State

Teammates go idle after every turn—this is completely normal and expected. A teammate going idle immediately after sending you a message does NOT mean they are done or unavailable. Idle simply means they are waiting for input.

- **Idle teammates can receive messages.** Sending a message to an idle teammate wakes them up and they will process it normally.
- **Idle notifications are automatic.** The system sends an idle notification whenever a teammate's turn ends. You do not need to react to idle notifications unless you want to assign new work or send a follow-up message.
- **Do not treat idle as an error.** A teammate sending a message and then going idle is the normal flow—they sent their message and are now waiting for a response.
- **Peer DM visibility.** When a teammate sends a DM to another teammate, a brief summary is included in their idle notification. This gives you visibility into peer collaboration without the full message content. You do not need to respond to these summaries — they are informational.

## Discovering Team Members

Teammates can read the team config file to discover other team members:
- **Team config location**: \`~/.claude/teams/{team-name}/config.json\`

The config file contains a \`members\` array with each teammate's:
- \`name\`: Human-readable name (**always use this** for messaging and task assignment)
- \`agentId\`: Unique identifier (for reference only - do not use for communication)
- \`agentType\`: Role/type of the agent

**IMPORTANT**: Always refer to teammates by their NAME (e.g., "team-lead", "researcher", "tester"). Names are used for:
- \`target_agent_id\` when sending messages
- Identifying task owners

Example of reading team config:
\`\`\`
Use the Read tool to read ~/.claude/teams/{team-name}/config.json
\`\`\`

## Task List Coordination

Teams share a task list that all teammates can access at \`~/.claude/tasks/{team-name}/\`.

Teammates should:
1. Check TaskList periodically, **especially after completing each task**, to find available work or see newly unblocked tasks
2. Claim unassigned, unblocked tasks with TaskUpdate (set \`owner\` to your name). **Prefer tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones
3. Create new tasks with \`TaskCreate\` when identifying additional work
4. Mark tasks as completed with \`TaskUpdate\` when done, then check TaskList for next work
5. Coordinate with other teammates by reading the task list status
6. If all available tasks are blocked, notify the team lead or help resolve blocking tasks

**IMPORTANT notes for communication with your team**:
- Do not use terminal tools to view your team's activity; always send a message to your teammates (and remember, refer to them by name).
- Your team cannot hear you if you do not use the SendMessage tool. Always send a message to your teammates if you are responding to them.
- Do NOT send structured JSON status messages like \`{"type":"idle",...}\` or \`{"type":"task_completed",...}\`. Just communicate in plain text when you need to message teammates.
- Use TaskUpdate to mark tasks completed.
- If you are an agent in the team, the system will automatically send idle notifications to the team lead when you stop.

`.trim()
}
// @from(Ln 357565, Col 0)
function Cl4(A) {
    return `create team: ${A.team_name}`
}
// @from(Ln 357569, Col 0)
function Sl4() {
    return null
}
// @from(Ln 357573, Col 0)
function hl4() {
    return dRA.default.createElement(Y9, null)
}
// @from(Ln 357577, Col 0)
function Il4(A, {
    verbose: q
}) {
    return dRA.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 357586, Col 0)
function xl4() {
    return null
}
// @from(Ln 357589, Col 4)
dRA
// @from(Ln 357590, Col 4)
bl4 = v(() => {
    CX();
    UO();
    dRA = o(X1(), 1)
})
// @from(Ln 357595, Col 4)
Bl4 = {}
// @from(Ln 357606, Col 0)
function cRA(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 357610, Col 0)
function ul4(A) {
    return lRA(QP(), cRA(A))
}
// @from(Ln 357614, Col 0)
function mSY(A, q) {
    let K = ul4(A);
    uSY(K, {
        recursive: !0
    });
    let Y = lRA(K, "config.json");
    c8(Y, Q1(q, null, 2))
}
// @from(Ln 357623, Col 0)
function FSY(A) {
    if (!iX(A)) return A;
    return tO6()
}
// @from(Ln 357627, Col 4)
BSY
// @from(Ln 357627, Col 9)
QSY
// @from(Ln 357628, Col 4)
ml4 = v(() => {
    i7();
    hA();
    uQ1();
    N7();
    i0A();
    XN();
    vw();
    B6();
    e7();
    m6();
    S9();
    m6();
    bl4();
    BSY = z7(() => u.strictObject({
        team_name: u.string().describe("Name for the new team to create."),
        description: u.string().optional().describe("Team description/purpose."),
        agent_type: u.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.')
    }));
    QSY = {
        name: vh,
        maxResultSizeChars: 1e5,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return BSY()
        },
        isEnabled() {
            return l8()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return !1
        },
        async checkPermissions(A, q) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async validateInput(A, q) {
            if (!A.team_name || A.team_name.trim().length === 0) return {
                result: !1,
                message: "team_name is required for TeamCreate",
                errorCode: 9
            };
            return {
                result: !0
            }
        },
        async description() {
            return "Create a new team for coordinating multiple agents"
        },
        async prompt() {
            return yl4()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: Q1(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            let {
                setAppState: K,
                getAppState: Y
            } = q, {
                team_name: z,
                description: w,
                agent_type: H
            } = A, $ = await Y(), O = $.teamContext?.teamName;
            if (O) throw Error(`Already leading team "${O}". A leader can only manage one team at a time. Use TeamDelete to end the current team before creating a new one.`);
            let _ = FSY(z),
                J = pv(K2, _),
                X = H || K2,
                D = t9($.mainLoopModelForSession ?? $.mainLoopModel ?? ML()),
                j = ul4(_),
                M = lRA(j, "config.json"),
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
            mSY(_, P);
            let W = cRA(_);
            return aq6(W), GC1(W), X67(cRA(_)), K((G) => ({
                ...G,
                teamContext: {
                    teamName: _,
                    teamFilePath: M,
                    leadAgentId: J,
                    teammates: {
                        [J]: {
                            name: K2,
                            agentType: X,
                            color: bd(J),
                            tmuxSessionName: "",
                            tmuxPaneId: "",
                            cwd: h6(),
                            spawnedAt: Date.now()
                        }
                    }
                }
            })), {
                data: {
                    team_name: _,
                    team_file_path: M,
                    lead_agent_id: J
                }
            }
        },
        renderToolUseMessage: Cl4,
        renderToolUseProgressMessage: Sl4,
        renderToolUseRejectedMessage: hl4,
        renderToolUseErrorMessage: Il4,
        renderToolResultMessage: xl4
    }
})
// @from(Ln 357766, Col 0)
function Fl4() {
    return `
# TeamDelete

Remove team and task directories when the swarm work is complete.

This operation:
- Removes the team directory (\`~/.claude/teams/{team-name}/\`)
- Removes the task directory (\`~/.claude/tasks/{team-name}/\`)
- Clears team context from the current session

**IMPORTANT**: TeamDelete will fail if the team still has active members. Gracefully terminate teammates first, then call TeamDelete after all teammates have shut down.

Use this when all teammates have finished their work and you want to clean up the team resources. The team name is automatically determined from the current session's team context.
`.trim()
}
// @from(Ln 357783, Col 0)
function Ql4(A) {
    return "cleanup team: current"
}
// @from(Ln 357787, Col 0)
function gl4() {
    return null
}
// @from(Ln 357791, Col 0)
function Ul4() {
    return iRA.default.createElement(Y9, null)
}
// @from(Ln 357795, Col 0)
function pl4(A, {
    verbose: q
}) {
    return iRA.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 357804, Col 0)
function dl4(A, q, {
    verbose: K
}) {
    let Y = typeof A === "string" ? _A(A) : A;
    if ("success" in Y && "team_name" in Y && "message" in Y) return null;
    return null
}
// @from(Ln 357811, Col 4)
iRA
// @from(Ln 357812, Col 4)
cl4 = v(() => {
    CX();
    UO();
    m6();
    iRA = o(X1(), 1)
})
// @from(Ln 357818, Col 4)
ll4 = {}
// @from(Ln 357822, Col 4)
gSY
// @from(Ln 357822, Col 9)
USY
// @from(Ln 357823, Col 4)
il4 = v(() => {
    i7();
    uQ1();
    XN();
    m6();
    S9();
    vw();
    cl4();
    gSY = z7(() => u.strictObject({})), USY = {
        name: VK1,
        maxResultSizeChars: 1e5,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return gSY()
        },
        isEnabled() {
            return l8()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return !1
        },
        async checkPermissions(A, q) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async description() {
            return "Clean up team and task directories when the swarm is complete"
        },
        async prompt() {
            return Fl4()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: Q1(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            let {
                setAppState: K,
                getAppState: Y
            } = q, w = (await Y()).teamContext?.teamName;
            if (w) {
                let H = iX(w);
                if (H) {
                    let $ = H.members.filter((O) => O.name !== K2);
                    if ($.length > 0) {
                        let O = $.map((_) => _.name).join(", ");
                        return {
                            data: {
                                success: !1,
                                message: `Cannot cleanup team with ${$.length} active member(s): ${O}. Use requestShutdown to gracefully terminate teammates first.`,
                                team_name: w
                            }
                        }
                    }
                }
                await OR4(w), fu4(), D67()
            }
            return K((H) => ({
                ...H,
                teamContext: void 0,
                inbox: {
                    messages: []
                }
            })), {
                data: {
                    success: !0,
                    message: w ? `Cleaned up directories and worktrees for team "${w}"` : "No team name found, nothing to clean up",
                    team_name: w
                }
            }
        },
        renderToolUseMessage: Ql4,
        renderToolUseProgressMessage: gl4,
        renderToolUseRejectedMessage: Ul4,
        renderToolUseErrorMessage: pl4,
        renderToolResultMessage: dl4
    }
})
// @from(Ln 357915, Col 0)
function rl4() {
    return `
# SendMessageTool

Send messages to agent teammates and handle protocol requests/responses in a team.

## Message Types

### type: "message" - Send a Direct Message

Send a message to a **single specific teammate**. You MUST specify the recipient.

**IMPORTANT for teammates**: Your plain text output is NOT visible to the team lead or other teammates. To communicate with anyone on your team, you **MUST** use this tool. Just typing a response or acknowledgment in text is not enough.

\`\`\`
{
  "type": "message",
  "recipient": "researcher",
  "content": "Your message here",
  "summary": "Brief status update on auth module"
}
\`\`\`

- **recipient**: The name of the teammate to message (required)
- **content**: The message text (required)
- **summary**: A 5-10 word summary shown as preview in the UI (required)

### type: "broadcast" - Send Message to ALL Teammates (USE SPARINGLY)

Send the **same message to everyone** on the team at once.

**WARNING: Broadcasting is expensive.** Each broadcast sends a separate message to every teammate, which means:
- N teammates = N separate message deliveries
- Each delivery consumes API resources
- Costs scale linearly with team size

\`\`\`
{
  "type": "broadcast",
  "content": "Message to send to all teammates",
  "summary": "Critical blocking issue found"
}
\`\`\`

- **content**: The message content to broadcast (required)
- **summary**: A 5-10 word summary shown as preview in the UI (required)

**CRITICAL: Use broadcast only when absolutely necessary.** Valid use cases:
- Critical issues requiring immediate team-wide attention (e.g., "stop all work, blocking bug found")
- Major announcements that genuinely affect every teammate equally

**Default to "message" instead of "broadcast".** Use "message" for:
- Responding to a single teammate
- Normal back-and-forth communication
- Following up on a task with one person
- Sharing findings relevant to only some teammates
- Any message that doesn't require everyone's attention

### type: "shutdown_request" - Request a Teammate to Shut Down

Use this to ask a teammate to gracefully shut down:

\`\`\`
{
  "type": "shutdown_request",
  "recipient": "researcher",
  "content": "Task complete, wrapping up the session"
}
\`\`\`

The teammate will receive a shutdown request and can either approve (exit) or reject (continue working).

### type: "shutdown_response" - Respond to a Shutdown Request

#### Approve Shutdown

When you receive a shutdown request as a JSON message with \`type: "shutdown_request"\`, you **MUST** respond to approve or reject it. Do NOT just acknowledge the request in text - you must actually call this tool.

\`\`\`
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": true
}
\`\`\`

**IMPORTANT**: Extract the \`requestId\` from the JSON message and pass it as \`request_id\` to the tool. Simply saying "I'll shut down" is not enough - you must call the tool.

This will send confirmation to the leader and terminate your process.

#### Reject Shutdown

\`\`\`
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": false,
  "content": "Still working on task #3, need 5 more minutes"
}
\`\`\`

The leader will receive your rejection with the reason.

### type: "plan_approval_response" - Approve or Reject a Teammate's Plan

#### Approve Plan

When a teammate with \`plan_mode_required\` calls ExitPlanMode, they send you a plan approval request as a JSON message with \`type: "plan_approval_request"\`. Use this to approve their plan:

\`\`\`
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": true
}
\`\`\`

After approval, the teammate will automatically exit plan mode and can proceed with implementation.

#### Reject Plan

\`\`\`
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "researcher",
  "approve": false,
  "content": "Please add error handling for the API calls"
}
\`\`\`

The teammate will receive the rejection with your feedback and can revise their plan.

## Important Notes

- Messages from teammates are automatically delivered to you. You do NOT need to manually check your inbox.
- When reporting on teammate messages, you do NOT need to quote the original message - it's already rendered to the user.
- **IMPORTANT**: Always refer to teammates by their NAME (e.g., "team-lead", "researcher", "tester"), never by UUID.
- Do NOT send structured JSON status messages. Use TaskUpdate to mark tasks completed and the system will automatically send idle notifications when you stop.
`.trim()
}
// @from(Ln 358057, Col 4)
nl4 = "Send messages to agent teammates and handle protocol requests (shutdown, plan approval)"
// @from(Ln 358059, Col 0)
function ol4(A) {
    switch (A.type) {
        case "message":
        case "broadcast":
        case "shutdown_request":
        case "shutdown_response":
            return null;
        case "plan_approval_response":
            return A.approve ? `approve plan from: ${A.recipient}` : `reject plan from: ${A.recipient}`;
        default:
            return "agent message operation"
    }
}
// @from(Ln 358073, Col 0)
function al4() {
    return null
}
// @from(Ln 358077, Col 0)
function sl4() {
    return Sg1.default.createElement(Y9, null)
}
// @from(Ln 358081, Col 0)
function tl4(A, {
    verbose: q
}) {
    return Sg1.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 358090, Col 0)
function el4(A, q, {
    verbose: K
}) {
    let Y = typeof A === "string" ? _A(A) : A;
    if ("routing" in Y && Y.routing) return null;
    if ("request_id" in Y && "target" in Y) return null;
    return Sg1.default.createElement(HA, null, Sg1.default.createElement(V, {
        dimColor: !0
    }, Y.message))
}
// @from(Ln 358100, Col 4)
Sg1
// @from(Ln 358101, Col 4)
Ai4 = v(() => {
    m1();
    CX();
    UO();
    m6();
    eq();
    Sg1 = o(X1(), 1)
})
// @from(Ln 358109, Col 4)
Ki4 = {}
// @from(Ln 358114, Col 0)
function qi4(A) {
    if (A.includes("@")) {
        let q = c31(A);
        if (q) return q.agentName
    }
    return A
}
// @from(Ln 358122, Col 0)
function rSY(A, q) {
    let K = A.teamContext?.teammates;
    if (!K) return;
    for (let Y of Object.values(K))
        if ("name" in Y && Y.name === q) return Y.color;
    return
}
// @from(Ln 358129, Col 0)
async function oSY(A, q) {
    let K = await q.getAppState(),
        Y = i3(K.teamContext),
        z = g5() || (Dz() ? "teammate" : K2),
        w = qi4(A.recipient),
        H = b$();
    f9(w, {
        from: z,
        text: A.content,
        summary: A.summary,
        timestamp: new Date().toISOString(),
        color: H
    }, Y);
    let $ = rSY(K, w);
    return {
        data: {
            success: !0,
            message: `Message sent to ${w}'s inbox`,
            routing: {
                sender: z,
                senderColor: H,
                target: `@${w}`,
                targetColor: $,
                summary: A.summary,
                content: A.content
            }
        }
    }
}
// @from(Ln 358158, Col 0)
async function aSY(A, q) {
    let K = await q.getAppState(),
        Y = i3(K.teamContext);
    if (!Y) throw Error("Not in a team context. Create a team with Teammate spawnTeam first, or set CLAUDE_CODE_TEAM_NAME.");
    let z = M51(Y);
    if (!z) throw Error(`Team "${Y}" does not exist`);
    let w = g5() || (Dz() ? "teammate" : K2);
    if (!w) throw Error("Cannot broadcast: sender name is required. Set CLAUDE_CODE_AGENT_NAME.");
    let H = b$(),
        $ = [];
    for (let O of z.members) {
        if (O.name.toLowerCase() === w.toLowerCase()) continue;
        $.push(O.name)
    }
    if ($.length === 0) return {
        data: {
            success: !0,
            message: "No teammates to broadcast to (you are the only team member)",
            recipients: []
        }
    };
    for (let O of $) f9(O, {
        from: w,
        text: A.content,
        summary: A.summary,
        timestamp: new Date().toISOString(),
        color: H
    }, Y);
    return {
        data: {
            success: !0,
            message: `Message broadcast to ${$.length} teammate(s): ${$.join(", ")}`,
            recipients: $,
            routing: {
                sender: w,
                senderColor: H,
                target: "@team",
                summary: A.summary,
                content: A.content
            }
        }
    }
}
// @from(Ln 358201, Col 0)
async function sSY(A, q) {
    let K = await q.getAppState(),
        Y = i3(K.teamContext),
        z = qi4(A.recipient),
        w = g5() || K2,
        H = vP1("shutdown", z),
        $ = lP1({
            requestId: H,
            from: w,
            reason: A.content
        });
    return f9(z, {
        from: w,
        text: Q1($),
        timestamp: new Date().toISOString(),
        color: b$()
    }, Y), {
        data: {
            success: !0,
            message: `Shutdown request sent to ${z}. Request ID: ${H}`,
            request_id: H,
            target: z
        }
    }
}
// @from(Ln 358226, Col 0)
async function tSY(A, q) {
    let K = i3(),
        Y = ID(),
        z = g5() || "teammate",
        w = A.request_id;
    h(`[SendMessageTool] handleShutdownApproval: teamName=${K}, agentId=${Y}, agentName=${z}`);
    let H, $;
    if (K) {
        let _ = M51(K);
        if (_ && Y) {
            let J = _.members.find((X) => X.agentId === Y);
            if (J) H = J.tmuxPaneId, $ = J.backendType
        }
    }
    let O = mvA({
        requestId: w,
        from: z,
        paneId: H,
        backendType: $
    });
    if (f9(K2, {
            from: z,
            text: Q1(O),
            timestamp: new Date().toISOString(),
            color: b$()
        }, K), $ === "in-process") {
        if (h(`[SendMessageTool] In-process teammate ${z} approving shutdown - signaling abort`), Y) {
            let _ = await q.getAppState(),
                J = ps(Y, _.tasks);
            if (J?.abortController) J.abortController.abort(), h(`[SendMessageTool] Aborted controller for in-process teammate ${z}`);
            else h(`[SendMessageTool] Warning: Could not find task/abortController for ${z}`)
        }
    } else {
        if (Y) {
            let _ = await q.getAppState(),
                J = ps(Y, _.tasks);
            if (J?.abortController) return h(`[SendMessageTool] Fallback: Found in-process task for ${z} via AppState, aborting`), J.abortController.abort(), {
                data: {
                    success: !0,
                    message: `Shutdown approved (fallback path). Agent ${z} is now exiting.`,
                    request_id: w
                }
            }
        }
        setImmediate(async () => {
            await nK(0, "other")
        })
    }
    return {
        data: {
            success: !0,
            message: `Shutdown approved. Sent confirmation to team-lead. Agent ${z} is now exiting.`,
            request_id: w
        }
    }
}
// @from(Ln 358283, Col 0)
function eSY(A) {
    let q = i3(),
        K = g5() || "teammate",
        Y = A.request_id,
        z = FvA({
            requestId: Y,
            from: K,
            reason: A.content || ""
        });
    return f9(K2, {
        from: K,
        text: Q1(z),
        timestamp: new Date().toISOString(),
        color: b$()
    }, q), {
        data: {
            success: !0,
            message: `Shutdown rejected. Reason: "${A.content}". Continuing to work.`,
            request_id: Y
        }
    }
}
// @from(Ln 358305, Col 0)
async function AhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext)) throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    let z = K.toolPermissionContext.mode,
        w = z === "plan" || z === "delegate" ? "default" : z,
        H = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
    return f9(A.recipient, {
        from: K2,
        text: Q1(H),
        timestamp: new Date().toISOString()
    }, Y), {
        data: {
            success: !0,
            message: `Plan approved for ${A.recipient}. They will receive the approval and can proceed with implementation.`,
            request_id: A.request_id
        }
    }
}
// @from(Ln 358330, Col 0)
async function qhY(A, q) {
    let K = await q.getAppState(),
        Y = K.teamContext?.teamName;
    if (!PM(K.teamContext)) throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    let z = A.content || "Plan needs revision",
        w = {
            type: "plan_approval_response",
            requestId: A.request_id,
            approved: !1,
            feedback: z,
            timestamp: new Date().toISOString()
        };
    return f9(A.recipient, {
        from: K2,
        text: Q1(w),
        timestamp: new Date().toISOString()
    }, Y), {
        data: {
            success: !0,
            message: `Plan rejected for ${A.recipient} with feedback: "${z}"`,
            request_id: A.request_id
        }
    }
}
// @from(Ln 358354, Col 4)
pSY
// @from(Ln 358354, Col 9)
dSY
// @from(Ln 358354, Col 14)
cSY
// @from(Ln 358354, Col 19)
lSY
// @from(Ln 358354, Col 24)
iSY
// @from(Ln 358354, Col 29)
nSY
// @from(Ln 358354, Col 34)
KhY
// @from(Ln 358354, Col 39)
YhY
// @from(Ln 358355, Col 4)
Yi4 = v(() => {
    i7();
    Ai4();
    H$();
    Cz();
    QEA();
    Z6();
    S9();
    w$();
    gR();
    m6();
    pSY = u.object({
        type: u.literal("message"),
        recipient: u.string(),
        content: u.string(),
        summary: u.string().describe("A 5-10 word summary of the message, shown as a preview in the UI")
    }), dSY = u.object({
        type: u.literal("broadcast"),
        content: u.string(),
        summary: u.string().describe("A 5-10 word summary of the message, shown as a preview in the UI")
    }), cSY = u.object({
        type: u.literal("shutdown_request"),
        recipient: u.string(),
        content: u.string().optional()
    }), lSY = u.object({
        type: u.literal("shutdown_response"),
        request_id: u.string(),
        approve: u.boolean(),
        content: u.string().optional()
    }), iSY = u.object({
        type: u.literal("plan_approval_response"),
        request_id: u.string(),
        approve: u.boolean(),
        recipient: u.string(),
        content: u.string().optional()
    }), nSY = z7(() => u.discriminatedUnion("type", [pSY, dSY, cSY, lSY, iSY]));
    KhY = {
        type: "object",
        properties: {
            type: {
                type: "string",
                enum: ["message", "broadcast", "shutdown_request", "shutdown_response", "plan_approval_response"],
                description: 'Message type: "message" for DMs, "broadcast" to all teammates, "shutdown_request" to request shutdown, "shutdown_response" to respond to shutdown, "plan_approval_response" to approve/reject plans'
            },
            recipient: {
                type: "string",
                description: "Agent name of the recipient (required for message, shutdown_request, plan_approval_response)"
            },
            content: {
                type: "string",
                description: "Message text, reason, or feedback"
            },
            summary: {
                type: "string",
                description: "A 5-10 word summary of the message, shown as a preview in the UI (required for message, broadcast)"
            },
            request_id: {
                type: "string",
                description: "Request ID to respond to (required for shutdown_response, plan_approval_response)"
            },
            approve: {
                type: "boolean",
                description: "Whether to approve the request (required for shutdown_response, plan_approval_response)"
            }
        },
        required: ["type"],
        additionalProperties: !1
    }, YhY = {
        name: iB,
        maxResultSizeChars: 1e5,
        userFacingName() {
            return "SendMessage"
        },
        get inputSchema() {
            return nSY()
        },
        inputJSONSchema: KhY,
        isEnabled() {
            return l8()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return A.type === "message" || A.type === "broadcast"
        },
        async checkPermissions(A, q) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async validateInput(A, q) {
            if ("recipient" in A && typeof A.recipient === "string" && A.recipient.trim().length === 0) return {
                result: !1,
                message: "recipient must not be empty",
                errorCode: 9
            };
            if (A.type === "shutdown_response" && !A.approve && (!A.content || A.content.trim().length === 0)) return {
                result: !1,
                message: "content (reason) is required when rejecting a shutdown request",
                errorCode: 9
            };
            return {
                result: !0
            }
        },
        async description() {
            return nl4
        },
        async prompt() {
            return rl4()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: Q1(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            switch (A.type) {
                case "message":
                    return oSY(A, q);
                case "broadcast":
                    return aSY(A, q);
                case "shutdown_request":
                    return sSY(A, q);
                case "shutdown_response":
                    if (A.approve) return tSY(A, q);
                    return eSY(A);
                case "plan_approval_response":
                    if (A.approve) return AhY(A, q);
                    return qhY(A, q)
            }
        },
        renderToolUseMessage: ol4,
        renderToolUseProgressMessage: al4,
        renderToolUseRejectedMessage: sl4,
        renderToolUseErrorMessage: tl4,
        renderToolResultMessage: el4
    }
})
// @from(Ln 358502, Col 0)
function Oi4(A) {
    let q = A.toLowerCase();
    if (!$hY.includes(q)) return null;
    return q
}
// @from(Ln 358508, Col 0)
function rRA() {
    let A = kt(),
        q = A.map((K) => K.isEnabled());
    return A.filter((K, Y) => q[Y]).map((K) => K.name)
}
// @from(Ln 358514, Col 0)
function kt() {
    return [rj1, kW6, qq, WB, tS, Nj, i5, sW, vj, gd, Vj, bO, LW6, vW6, dW1, wt, kg1, ...jH() ? [tc4, $l4, Wl4, Ll4] : [], ...Hi4 ? [Hi4] : [], ...$i4 ? [$i4] : [], vRA, ...l8() ? [zhY(), whY(), HhY()] : [], ...wi4 ? [wi4] : [], ...zi4 ? [zi4] : [], cd, ld, ...Fp() ? [IW6] : []]
}
// @from(Ln 358518, Col 0)
function hg1(A, q) {
    let K = tU(q);
    return A.filter((Y) => {
        return !K.some((z) => z.ruleValue.toolName === Y.name && z.ruleValue.ruleContent === void 0)
    })
}
// @from(Ln 358525, Col 0)
function YP6(A, q) {
    let K = tD(A);
    if (O$()) return K;
    let Y = hg1(q, A),
        z = Sx([...K, ...Y], "name");
    if (A.mode === "delegate") return z.filter((w) => R_6.has(w.name));
    return z
}
// @from(Ln 358534, Col 0)
function _i4(A, q) {
    return [...tD(A), ...q]
}
// @from(Ln 358537, Col 4)
zi4 = null
// @from(Ln 358538, Col 4)
zhY = () => (ml4(), ay(Bl4)).TeamCreateTool
// @from(Ln 358539, Col 4)
whY = () => (il4(), ay(ll4)).TeamDeleteTool
// @from(Ln 358540, Col 4)
HhY = () => (Yi4(), ay(Ki4)).SendMessageTool
// @from(Ln 358541, Col 4)
wi4 = null
// @from(Ln 358542, Col 4)
Hi4 = null
// @from(Ln 358543, Col 4)
$i4 = null
// @from(Ln 358544, Col 4)
$hY
// @from(Ln 358544, Col 9)
tD = (A) => {
        if (J6(void 0)) return [qq];
        let q = new Set([cd.name, ld.name, cD]),
            K = kt().filter((w) => !q.has(w.name)),
            Y = hg1(K, A);
        if (A.mode === "delegate") Y = Y.filter((w) => R_6.has(w.name));
        if (J6(process.env.CLAUDE_REPL_MODE)) {
            if (Y.some((H) => H.name === y_6)) Y = Y.filter((H) => !rp7.has(H.name))
        }
        let z = Y.map((w) => w.isEnabled());
        return Y.filter((w, H) => z[H])
    }
// @from(Ln 358556, Col 4)
$P = v(() => {
    MJ6();
    $P6();
    i0();
    V51();
    YE();
    Lt();
    cx1();
    tQ1();
    gW1();
    DRA();
    PRA();
    GRA();
    r_1();
    Tg1();
    Jd4();
    $01();
    RW6();
    md4();
    SW6();
    hW6();
    RRA();
    yRA();
    Fc4();
    dc4();
    ec4();
    Ol4();
    Gl4();
    Rl4();
    H21();
    Tj();
    oL();
    vw();
    nB();
    mj1();
    mj1();
    PJ();
    hA();
    S9();
    NjA();
    $hY = ["default"]
})
// @from(Ln 358601, Col 0)
async function Xi4(A, q, K, Y, z, w, H, $) {
    let O = H || `hook-${Ji4()}`,
        _ = w.agentId ? kh(w.agentId) : dO(),
        J = Date.now();
    try {
        let X = XJ6(A.prompt($), Y);
        h(`Hooks: Processing agent hook with prompt: ${X}`);
        let j = [c6({
            content: X
        })];
        h(`Hooks: Starting agent query with ${j.length} messages`);
        let M = A.timeout ? A.timeout * 1000 : 60000,
            P = Aq(),
            {
                signal: W,
                cleanup: G
            } = fR(z, AbortSignal.timeout(M)),
            f = () => P.abort();
        W.addEventListener("abort", f);
        let Z = P.signal;
        try {
            let N = jn7(),
                k = [...w.options.tools.filter((p) => p.name !== cD).filter((p) => !Bj1.has(p.name)), N],
                y = [`You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${_}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${cD} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`],
                B = A.model ?? _J(),
                S = 50,
                m = xZ(`hook-agent-${Ji4()}`),
                b = {
                    ...w,
                    agentId: m,
                    abortController: P,
                    options: {
                        ...w.options,
                        tools: k,
                        mainLoopModel: B,
                        isNonInteractiveSession: !0,
                        maxThinkingTokens: 0
                    },
                    setInProgressToolUseIDs: () => {},
                    async getAppState() {
                        let p = await w.getAppState(),
                            l = p.toolPermissionContext.alwaysAllowRules.session ?? [];
                        return {
                            ...p,
                            toolPermissionContext: {
                                ...p.toolPermissionContext,
                                mode: "dontAsk",
                                alwaysAllowRules: {
                                    ...p.toolPermissionContext.alwaysAllowRules,
                                    session: [...l, `Read(/${_})`]
                                }
                            }
                        }
                    }
                };
            DJ6(w.setAppState, m);
            let g = null,
                U = 0,
                x = !1;
            for await (let p of ZR({
                messages: j,
                systemPrompt: y,
                userContext: {},
                systemContext: {},
                canUseTool: uX,
                toolUseContext: b,
                querySource: "hook_agent"
            })) {
                if (iW1(p, () => {}, (l) => w.setResponseLength((r) => r + l.length), w.setStreamMode ?? (() => {}), () => {}), p.type === "stream_event" || p.type === "stream_request_start") continue;
                if (p.type === "assistant") {
                    if (U++, U >= 50) {
                        x = !0, h(`Hooks: Agent turn ${U} hit max turns, aborting`), P.abort();
                        break
                    }
                }
                if (p.type === "attachment" && p.attachment.type === "structured_output") {
                    let l = GB1.safeParse(p.attachment.data);
                    if (l.success) {
                        g = l.data, h(`Hooks: Got structured output: ${Q1(g)}`), P.abort();
                        break
                    }
                }
            }
            if (W.removeEventListener("abort", f), G(), iD1(w.setAppState, m), !g) {
                if (x) return h("Hooks: Agent hook did not complete within 50 turns"), c("tengu_agent_stop_hook_max_turns", {
                    durationMs: Date.now() - J,
                    turnCount: U
                }), {
                    hook: A,
                    outcome: "cancelled"
                };
                return h("Hooks: Agent hook did not return structured output"), c("tengu_agent_stop_hook_error", {
                    durationMs: Date.now() - J,
                    turnCount: U,
                    errorType: 1
                }), {
                    hook: A,
                    outcome: "cancelled"
                }
            }
            if (!g.ok) return h(`Hooks: Agent hook condition was not met: ${g.reason}`), {
                hook: A,
                outcome: "blocking",
                blockingError: {
                    blockingError: `Agent hook condition was not met: ${g.reason}`,
                    command: A.prompt($)
                }
            };
            return h("Hooks: Agent hook condition was met"), c("tengu_agent_stop_hook_success", {
                durationMs: Date.now() - J,
                turnCount: U
            }), {
                hook: A,
                outcome: "success",
                message: kq({
                    type: "hook_success",
                    hookName: q,
                    toolUseID: O,
                    hookEvent: K,
                    content: "Condition met"
                })
            }
        } catch (N) {
            if (W.removeEventListener("abort", f), G(), Z.aborted) return {
                hook: A,
                outcome: "cancelled"
            };
            throw N
        }
    } catch (X) {
        let D = X instanceof Error ? X.message : String(X);
        return h(`Hooks: Agent hook error: ${D}`), c("tengu_agent_stop_hook_error", {
            durationMs: Date.now() - J,
            errorType: 2
        }), {
            hook: A,
            outcome: "non_blocking_error",
            message: kq({
                type: "hook_non_blocking_error",
                hookName: q,
                toolUseID: O,
                hookEvent: K,
                stderr: `Error executing agent hook: ${D}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 358758, Col 4)
Di4 = v(() => {
    Z6();
    PJ();
    EK1();
    e7();
    FW();
    u6();
    nB();
    G2();
    WB1();
    jJ6();
    lq();
    N8();
    $P();
    eU();
    m6()
})
// @from(Ln 358775, Col 4)
rO4 = {}
// @from(Ln 358808, Col 0)
function ji4({
    processId: A,
    hookId: q,
    shellCommand: K,
    asyncResponse: Y,
    hookEvent: z,
    hookName: w,
    command: H
}) {
    let $ = K.background(A);
    if (!$) return !1;
    return $n7({
        processId: A,
        hookId: q,
        asyncResponse: Y,
        hookEvent: z,
        hookName: w,
        command: H,
        shellCommand: K
    }), $.stdoutStream.on("data", (O) => {
        On7(A, O.toString())
    }), $.stderrStream.on("data", (O) => {
        _n7(A, O.toString())
    }), !0
}
// @from(Ln 358834, Col 0)
function Pi4() {
    if (!!w4()) return !1;
    return !$H(!1)
}
// @from(Ln 358839, Col 0)
function aX(A, q) {
    let K = q ?? U6();
    return {
        session_id: K,
        transcript_path: a$(K),
        cwd: h6(),
        permission_mode: A
    }
}
// @from(Ln 358849, Col 0)
function Wi4(A) {
    let q = A.trim();
    if (!q.startsWith("{")) return h("Hook output does not start with {, treating as plain text"), {
        plainText: A
    };
    try {
        let K = _A(q),
            Y = zJ6.safeParse(K);
        if (Y.success) return h("Successfully parsed and validated hook JSON output"), {
            json: Y.data
        };
        else {
            let w = `Hook JSON output validation failed:
${Y.error.issues.map((H)=>`  - ${H.path.join(".")}: ${H.message}`).join(`
`)}

Expected schema:
${Q1({continue:"boolean (optional)",suppressOutput:"boolean (optional)",stopReason:"string (optional)",decision:'"approve" | "block" (optional)',reason:"string (optional)",systemMessage:"string (optional)",permissionDecision:'"allow" | "deny" | "ask" (optional)',hookSpecificOutput:{"for PreToolUse":{hookEventName:'"PreToolUse"',permissionDecision:'"allow" | "deny" | "ask" (optional)',permissionDecisionReason:"string (optional)",updatedInput:"object (optional) - Modified tool input to use"},"for UserPromptSubmit":{hookEventName:'"UserPromptSubmit"',additionalContext:"string (required)"},"for PostToolUse":{hookEventName:'"PostToolUse"',additionalContext:"string (optional)"}}},null,2)}. The hook's stdout was: ${Q1(K,null,2)}`;
            return h(w), {
                plainText: A,
                validationError: w
            }
        }
    } catch (K) {
        return h(`Failed to parse hook output as JSON: ${K}`), {
            plainText: A
        }
    }
}
// @from(Ln 358879, Col 0)
function Gi4({
    json: A,
    command: q,
    hookName: K,
    toolUseID: Y,
    hookEvent: z,
    expectedHookEvent: w,
    stdout: H,
    stderr: $,
    exitCode: O
}) {
    let _ = {},
        J = A;
    if (J.continue === !1) {
        if (_.preventContinuation = !0, J.stopReason) _.stopReason = J.stopReason
    }
    if (A.decision) switch (A.decision) {
        case "approve":
            _.permissionBehavior = "allow";
            break;
        case "block":
            _.permissionBehavior = "deny", _.blockingError = {
                blockingError: A.reason || "Blocked by hook",
                command: q
            };
            break;
        default:
            throw Error(`Unknown hook decision type: ${A.decision}. Valid types are: approve, block`)
    }
    if (A.systemMessage) _.systemMessage = A.systemMessage;
    if (A.hookSpecificOutput?.hookEventName === "PreToolUse" && A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
        case "allow":
            _.permissionBehavior = "allow";
            break;
        case "deny":
            _.permissionBehavior = "deny", _.blockingError = {
                blockingError: A.reason || "Blocked by hook",
                command: q
            };
            break;
        case "ask":
            _.permissionBehavior = "ask";
            break;
        default:
            throw Error(`Unknown hook permissionDecision type: ${A.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask`)
    }
    if (_.permissionBehavior !== void 0 && A.reason !== void 0) _.hookPermissionDecisionReason = A.reason;
    if (A.hookSpecificOutput) {
        if (w && A.hookSpecificOutput.hookEventName !== w) throw Error(`Hook returned incorrect event name: expected '${w}' but got '${A.hookSpecificOutput.hookEventName}'. Full stdout: ${Q1(A,null,2)}`);
        switch (A.hookSpecificOutput.hookEventName) {
            case "PreToolUse":
                if (A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
                    case "allow":
                        _.permissionBehavior = "allow";
                        break;
                    case "deny":
                        _.permissionBehavior = "deny", _.blockingError = {
                            blockingError: A.hookSpecificOutput.permissionDecisionReason || A.reason || "Blocked by hook",
                            command: q
                        };
                        break;
                    case "ask":
                        _.permissionBehavior = "ask";
                        break
                }
                if (_.hookPermissionDecisionReason = A.hookSpecificOutput.permissionDecisionReason, A.hookSpecificOutput.updatedInput) _.updatedInput = A.hookSpecificOutput.updatedInput;
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "UserPromptSubmit":
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "SessionStart":
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "Setup":
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "SubagentStart":
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "PostToolUse":
                if (_.additionalContext = A.hookSpecificOutput.additionalContext, A.hookSpecificOutput.updatedMCPToolOutput) _.updatedMCPToolOutput = A.hookSpecificOutput.updatedMCPToolOutput;
                break;
            case "PostToolUseFailure":
                _.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "PermissionRequest":
                if (A.hookSpecificOutput.decision) {
                    if (_.permissionRequestResult = A.hookSpecificOutput.decision, _.permissionBehavior = A.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", A.hookSpecificOutput.decision.behavior === "allow" && A.hookSpecificOutput.decision.updatedInput) _.updatedInput = A.hookSpecificOutput.decision.updatedInput
                }
                break
        }
    }
    return {
        ..._,
        message: _.blockingError ? kq({
            type: "hook_blocking_error",
            hookName: K,
            toolUseID: Y,
            hookEvent: z,
            blockingError: _.blockingError
        }) : kq({
            type: "hook_success",
            hookName: K,
            toolUseID: Y,
            hookEvent: z,
            content: "Success",
            stdout: H,
            stderr: $,
            exitCode: O
        })
    }
}
// @from(Ln 358992, Col 0)
async function BW6(A, q, K, Y, z, w, H, $, O, _) {
    let J = y8(),
        X = A.command;
    if ($) X = X.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, $);
    if (eA() === "windows" && X.trim().match(/\.sh(\s|$|")/)) {
        if (!X.trim().startsWith("bash ")) X = `bash ${X}`
    }
    let D = process.env.CLAUDE_CODE_SHELL_PREFIX ? Q_6(process.env.CLAUDE_CODE_SHELL_PREFIX, X) : X,
        j = A.timeout ? A.timeout * 1000 : MP,
        M = {
            ...process.env,
            CLAUDE_PROJECT_DIR: J
        };
    if ($) M.CLAUDE_PLUGIN_ROOT = $;
    if (O) M.CLAUDE_PLUGIN_ROOT = O;
    if ((q === "SessionStart" || q === "Setup") && H !== void 0) M.CLAUDE_ENV_FILE = hd7(q, H);
    let P = OhY(D, [], {
            env: M,
            cwd: h6(),
            shell: !0,
            windowsHide: !0
        }),
        W = F_6(P, z, j),
        G = !1,
        f = !1;
    if (A.async && !_) {
        let p = `async_hook_${P.pid}`;
        if (h(`Hooks: Config-based async hook, backgrounding process ${p}`), P.stdin.write(Y, "utf8"), P.stdin.end(), f = !0, ji4({
                processId: p,
                hookId: w,
                shellCommand: W,
                asyncResponse: {
                    async: !0,
                    asyncTimeout: j
                },
                hookEvent: q,
                hookName: K,
                command: A.command
            })) return {
            stdout: "",
            stderr: "",
            output: "",
            status: 0,
            backgrounded: !0
        }
    }
    let Z = "",
        N = "",
        T = "";
    P.stdout.setEncoding("utf8"), P.stderr.setEncoding("utf8");
    let k = !1,
        y = null,
        B = new Promise((p) => {
            y = p
        });
    P.stdout.on("data", (p) => {
        if (Z += p, T += p, !k && Z.trim().includes("}")) {
            k = !0, h(`Hooks: Checking initial response for async: ${Z.trim()}`);
            try {
                let l = _A(Z.trim());
                if (h(`Hooks: Parsed initial response: ${Q1(l)}`), SK1(l) && !_) {
                    let r = `async_hook_${P.pid}`;
                    if (h(`Hooks: Detected async hook, backgrounding process ${r}`), ji4({
                            processId: r,
                            hookId: w,
                            shellCommand: W,
                            asyncResponse: l,
                            hookEvent: q,
                            hookName: K,
                            command: A.command
                        })) G = !0, y?.({
                        stdout: Z,
                        stderr: N,
                        output: T,
                        status: 0
                    })
                } else if (SK1(l) && _) h("Hooks: Detected async hook but forceSyncExecution is true, waiting for completion");
                else h("Hooks: Initial response is not async, continuing normal processing")
            } catch (l) {
                h(`Hooks: Failed to parse initial response as JSON: ${l}`)
            }
        }
    }), P.stderr.on("data", (p) => {
        N += p, T += p
    });
    let S = HJ6({
            hookId: w,
            hookName: K,
            hookEvent: q,
            getOutput: () => ({
                stdout: Z,
                stderr: N,
                output: T
            })
        }),
        m = new Promise((p) => {
            P.stdout.on("end", () => p())
        }),
        b = new Promise((p) => {
            P.stderr.on("end", () => p())
        }),
        g = f ? Promise.resolve() : new Promise((p, l) => {
            P.stdin.on("error", l), P.stdin.write(Y, "utf8"), P.stdin.end(), p()
        }),
        U = new Promise((p, l) => {
            P.on("error", l)
        }),
        x = new Promise((p) => {
            let l = null;
            P.on("close", (r) => {
                l = r ?? 1, Promise.all([m, b]).then(() => {
                    p({
                        stdout: Z,
                        stderr: N,
                        output: T,
                        status: l,
                        aborted: z.aborted
                    })
                })
            })
        });
    try {
        return await Promise.race([g, U]), await Promise.race([B, x, U])
    } catch (p) {
        let l = p;
        if (l.code === "EPIPE") {
            h("EPIPE error while writing to hook stdin (hook command likely closed early)");
            let r = "Hook command closed stdin before hook input was fully written (EPIPE)";
            return {
                stdout: "",
                stderr: r,
                output: r,
                status: 1
            }
        } else if (l.code === "ABORT_ERR") return {
            stdout: "",
            stderr: "Hook cancelled",
            output: "Hook cancelled",
            status: 1,
            aborted: !0
        };
        else {
            let s = `Error occurred while executing hook command: ${p instanceof Error?p.message:String(p)}`;
            return {
                stdout: "",
                stderr: s,
                output: s,
                status: 1
            }
        }
    } finally {
        if (S(), !G) W.cleanup()
    }
}
// @from(Ln 359147, Col 0)
function _hY(A, q) {
    if (!q || q === "*") return !0;
    if (/^[a-zA-Z0-9_|]+$/.test(q)) {
        if (q.includes("|")) return q.split("|").map((Y) => Y.trim()).includes(A);
        return A === q
    }
    try {
        return new RegExp(q).test(A)
    } catch {
        return h(`Invalid regex pattern in hook matcher: ${q}`), !1
    }
}
// @from(Ln 359160, Col 0)
function Zi4(A) {
    let q = A.filter((Y) => Y.pluginId);
    if (q.length === 0) return;
    let K = {};
    for (let Y of q) {
        let z = Y.pluginId.lastIndexOf("@"),
            H = z > 0 && NT.has(Y.pluginId.slice(z + 1)) ? Y.pluginId : "third-party";
        K[H] = (K[H] || 0) + 1
    }
    return K
}
// @from(Ln 359172, Col 0)
function JhY(A, q) {
    let K = {},
        Y = Uk7();
    if (Y)
        for (let [H, $] of Object.entries(Y)) K[H] = $.map((O) => ({
            matcher: O.matcher,
            hooks: O.hooks
        }));
    let z = Ap(),
        w = DN1();
    if (w)
        for (let [H, $] of Object.entries(w)) {
            if (!K[H]) K[H] = [];
            for (let O of $) {
                if (z && "pluginRoot" in O) continue;
                K[H].push(O)
            }
        }
    if (!z && A !== void 0) {
        let H = Ww6(A, q);
        for (let [O, _] of H.entries()) {
            if (!K[O]) K[O] = [];
            for (let J of _) K[O].push(J)
        }
        let $ = Ik7(A, q);
        for (let [O, _] of $.entries()) {
            if (!K[O]) K[O] = [];
            for (let J of _) K[O].push({
                matcher: J.matcher,
                hooks: J.hooks
            })
        }
    }
    return K
}
// @from(Ln 359208, Col 0)
function oRA(A, q, K, Y) {
    try {
        let w = JhY(A, q)?.[K] ?? [],
            H = void 0;
        switch (Y.hook_event_name) {
            case "PreToolUse":
            case "PostToolUse":
            case "PostToolUseFailure":
            case "PermissionRequest":
                H = Y.tool_name;
                break;
            case "SessionStart":
                H = Y.source;
                break;
            case "Setup":
                H = Y.trigger;
                break;
            case "PreCompact":
                H = Y.trigger;
                break;
            case "Notification":
                H = Y.notification_type;
                break;
            case "SessionEnd":
                H = Y.reason;
                break;
            case "SubagentStart":
                H = Y.agent_type;
                break;
            case "SubagentStop":
                H = Y.agent_type;
                break;
            case "TeammateIdle":
            case "TaskCompleted":
                break;
            default:
                break
        }
        h(`Getting matching hook commands for ${K} with query: ${H}`), h(`Found ${w.length} hook matchers in settings`);
        let O = (H ? w.filter((P) => !P.matcher || _hY(H, P.matcher)) : w).flatMap((P) => {
                let W = "pluginRoot" in P ? P.pluginRoot : void 0,
                    G = "pluginId" in P ? P.pluginId : void 0,
                    f = "skillRoot" in P ? P.skillRoot : void 0;
                return P.hooks.map((Z) => ({
                    hook: Z,
                    pluginRoot: W,
                    pluginId: G,
                    skillRoot: f
                }))
            }),
            _ = Array.from(new Map(O.filter((P) => P.hook.type === "command").map((P) => [P.hook.command, P])).values()),
            J = Array.from(new Map(O.filter((P) => P.hook.type === "prompt").map((P) => [P.hook.prompt, P])).values()),
            X = Array.from(new Map(O.filter((P) => P.hook.type === "agent").map((P) => [P.hook.prompt([]), P])).values()),
            D = O.filter((P) => P.hook.type === "callback"),
            j = O.filter((P) => P.hook.type === "function"),
            M = [..._, ...J, ...X, ...D, ...j];
        return h(`Matched ${M.length} unique hooks for query "${H||"no match query"}" (${O.length} before deduplication)`), M
    } catch {
        return []
    }
}
// @from(Ln 359270, Col 0)
function aRA(A, q) {
    return `${A} hook error: ${q.blockingError}`
}
// @from(Ln 359274, Col 0)
function sRA(A) {
    return `Stop hook feedback:
${A.blockingError}`
}
// @from(Ln 359279, Col 0)
function tRA(A) {
    return `TeammateIdle hook feedback:
${A.blockingError}`
}
// @from(Ln 359284, Col 0)
function yg1(A) {
    return `TaskCompleted hook feedback:
${A.blockingError}`
}
// @from(Ln 359289, Col 0)
function eRA(A) {
    return `UserPromptSubmit operation blocked by hook:
${A.blockingError}`
}
// @from(Ln 359293, Col 0)
async function* NI({
    hookInput: A,
    toolUseID: q,
    matchQuery: K,
    signal: Y,
    timeoutMs: z = MP,
    toolUseContext: w,
    messages: H,
    forceSyncExecution: $
}) {
    if (C8().disableAllHooks) return;
    let O = A.hook_event_name,
        _ = K ? `${O}:${K}` : O;
    if (Pi4()) {
        h(`Skipping ${_} hook execution - workspace trust not accepted`);
        return
    }
    let J = w ? await w.getAppState() : void 0,
        X = w?.agentId ?? U6(),
        D = oRA(J, X, O, A);
    if (D.length === 0) return;
    if (Y?.aborted) return;
    let j = Zi4(D);
    c("tengu_run_hook", {
        hookName: _,
        numCommands: D.length,
        ...j && {
            pluginHookCounts: Q1(j)
        }
    });
    let M = FX() ? Mi4(D) : [];
    if (FX()) zj("hook_execution_start", {
        hook_event: O,
        hook_name: _,
        num_hooks: String(D.length),
        managed_only: String(Ap()),
        hook_definitions: Q1(M),
        hook_source: Ap() ? "policySettings" : "merged"
    });
    let P = qn7(O, _, D.length, Q1(M));
    for (let {
            hook: Z
        }
        of D) yield {
        message: {
            type: "progress",
            data: {
                type: "hook_progress",
                hookEvent: O,
                hookName: _,
                command: MZ(Z),
                promptText: Z.type === "prompt" ? Z.prompt : void 0,
                statusMessage: "statusMessage" in Z ? Z.statusMessage : void 0
            },
            parentToolUseID: q,
            toolUseID: q,
            timestamp: new Date().toISOString(),
            uuid: zE()
        }
    };
    let W = D.map(async function*({
            hook: Z,
            pluginRoot: N,
            skillRoot: T
        }, k) {
            if (Z.type === "callback") {
                let b = Z.timeout ? Z.timeout * 1000 : z,
                    {
                        signal: g,
                        cleanup: U
                    } = fR(AbortSignal.timeout(b), Y);
                yield DhY({
                    toolUseID: q,
                    hook: Z,
                    hookEvent: O,
                    hookInput: A,
                    signal: g,
                    hookIndex: k,
                    toolUseContext: w
                }).finally(U);
                return
            }
            if (Z.type === "function") {
                if (!H) {
                    yield {
                        message: kq({
                            type: "hook_error_during_execution",
                            hookName: _,
                            toolUseID: q,
                            hookEvent: O,
                            content: "Messages not provided for function hook"
                        }),
                        outcome: "non_blocking_error",
                        hook: Z
                    };
                    return
                }
                yield XhY({
                    hook: Z,
                    messages: H,
                    hookName: _,
                    toolUseID: q,
                    hookEvent: O,
                    timeoutMs: z,
                    signal: Y
                });
                return
            }
            let y = Z.timeout ? Z.timeout * 1000 : z,
                {
                    signal: B,
                    cleanup: S
                } = fR(AbortSignal.timeout(y), Y),
                m = zE();
            try {
                let b;
                try {
                    b = Q1(A)
                } catch (l) {
                    K1(Error(`Failed to stringify hook ${_} input`, {
                        cause: l
                    })), yield {
                        message: kq({
                            type: "hook_error_during_execution",
                            hookName: _,
                            toolUseID: q,
                            hookEvent: O,
                            content: `Failed to prepare hook input: ${l instanceof Error?l.message:String(l)}`
                        }),
                        outcome: "non_blocking_error",
                        hook: Z
                    };
                    return
                }
                if (Z.type === "prompt") {
                    if (!w) throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
                    yield await Pn7(Z, _, O, b, B, w, H, q), S?.();
                    return
                }
                if (Z.type === "agent") {
                    if (!w) throw Error("ToolUseContext is required for agent hooks. This is a bug.");
                    if (!H) throw Error("Messages are required for agent hooks. This is a bug.");
                    yield await Xi4(Z, _, O, b, B, w, q, H), S?.();
                    return
                }
                Hn7(m, _, O);
                let g = await BW6(Z, O, _, b, B, m, k, N, T, $);
                if (S?.(), g.backgrounded) {
                    yield {
                        outcome: "success",
                        hook: Z
                    };
                    return
                }
                if (g.aborted) {
                    Ch({
                        hookId: m,
                        hookName: _,
                        hookEvent: O,
                        output: g.output,
                        stdout: g.stdout,
                        stderr: g.stderr,
                        exitCode: g.status,
                        outcome: "cancelled"
                    }), yield {
                        message: kq({
                            type: "hook_cancelled",
                            hookName: _,
                            toolUseID: q,
                            hookEvent: O
                        }),
                        outcome: "cancelled",
                        hook: Z
                    };
                    return
                }
                let {
                    json: U,
                    plainText: x,
                    validationError: p
                } = Wi4(g.stdout);
                if (p) {
                    Ch({
                        hookId: m,
                        hookName: _,
                        hookEvent: O,
                        output: g.output,
                        stdout: g.stdout,
                        stderr: `JSON validation failed: ${p}`,
                        exitCode: 1,
                        outcome: "error"
                    }), yield {
                        message: kq({
                            type: "hook_non_blocking_error",
                            hookName: _,
                            toolUseID: q,
                            hookEvent: O,
                            stderr: `JSON validation failed: ${p}`,
                            stdout: g.stdout,
                            exitCode: 1
                        }),
                        outcome: "non_blocking_error",
                        hook: Z
                    };
                    return
                }
                if (U) {
                    if (SK1(U)) {
                        yield {
                            outcome: "success",
                            hook: Z
                        };
                        return
                    }
                    let l = Gi4({
                        json: U,
                        command: Z.type === "command" ? Z.command : "prompt",
                        hookName: _,
                        toolUseID: q,
                        hookEvent: O,
                        expectedHookEvent: O,
                        stdout: g.stdout,
                        stderr: g.stderr,
                        exitCode: g.status
                    });
                    if (zn7(U) && !U.suppressOutput && x && g.status === 0) {
                        let r = `${H6.bold(_)} completed`;
                        Ch({
                            hookId: m,
                            hookName: _,
                            hookEvent: O,
                            output: g.output,
                            stdout: g.stdout,
                            stderr: g.stderr,
                            exitCode: g.status,
                            outcome: "success"
                        }), yield {
                            ...l,
                            message: l.message || kq({
                                type: "hook_success",
                                hookName: _,
                                toolUseID: q,
                                hookEvent: O,
                                content: r,
                                stdout: g.stdout,
                                stderr: g.stderr,
                                exitCode: g.status
                            }),
                            outcome: "success",
                            hook: Z
                        };
                        return
                    }
                    Ch({
                        hookId: m,
                        hookName: _,
                        hookEvent: O,
                        output: g.output,
                        stdout: g.stdout,
                        stderr: g.stderr,
                        exitCode: g.status,
                        outcome: g.status === 0 ? "success" : "error"
                    }), yield {
                        ...l,
                        outcome: "success",
                        hook: Z
                    };
                    return
                }
                if (g.status === 0) {
                    Ch({
                        hookId: m,
                        hookName: _,
                        hookEvent: O,
                        output: g.output,
                        stdout: g.stdout,
                        stderr: g.stderr,
                        exitCode: g.status,
                        outcome: "success"
                    }), yield {
                        message: kq({
                            type: "hook_success",
                            hookName: _,
                            toolUseID: q,
                            hookEvent: O,
                            content: g.stdout.trim(),
                            stdout: g.stdout,
                            stderr: g.stderr,
                            exitCode: g.status
                        }),
                        outcome: "success",
                        hook: Z
                    };
                    return
                }
                if (g.status === 2) {
                    Ch({
                        hookId: m,
                        hookName: _,
                        hookEvent: O,
                        output: g.output,
                        stdout: g.stdout,
                        stderr: g.stderr,
                        exitCode: g.status,
                        outcome: "error"
                    }), yield {
                        blockingError: {
                            blockingError: `[${Z.command}]: ${g.stderr||"No stderr output"}`,
                            command: Z.command
                        },
                        outcome: "blocking",
                        hook: Z
                    };
                    return
                }
                Ch({
                    hookId: m,
                    hookName: _,
                    hookEvent: O,
                    output: g.output,
                    stdout: g.stdout,
                    stderr: g.stderr,
                    exitCode: g.status,
                    outcome: "error"
                }), yield {
                    message: kq({
                        type: "hook_non_blocking_error",
                        hookName: _,
                        toolUseID: q,
                        hookEvent: O,
                        stderr: `Failed with non-blocking status code: ${g.stderr.trim()||"No stderr output"}`,
                        stdout: g.stdout,
                        exitCode: g.status
                    }),
                    outcome: "non_blocking_error",
                    hook: Z
                };
                return
            } catch (b) {
                S?.();
                let g = b instanceof Error ? b.message : String(b);
                Ch({
                    hookId: m,
                    hookName: _,
                    hookEvent: O,
                    output: `Failed to run: ${g}`,
                    stdout: "",
                    stderr: `Failed to run: ${g}`,
                    exitCode: 1,
                    outcome: "error"
                }), yield {
                    message: kq({
                        type: "hook_non_blocking_error",
                        hookName: _,
                        toolUseID: q,
                        hookEvent: O,
                        stderr: `Failed to run: ${g}`,
                        stdout: "",
                        exitCode: 1
                    }),
                    outcome: "non_blocking_error",
                    hook: Z
                };
                return
            }
        }),
        G = {
            success: 0,
            blocking: 0,
            non_blocking_error: 0,
            cancelled: 0
        },
        f;
    for await (let Z of _J6(W)) {
        if (G[Z.outcome]++, Z.preventContinuation) yield {
            preventContinuation: !0,
            stopReason: Z.stopReason
        };
        if (Z.blockingError) yield {
            blockingError: Z.blockingError
        };
        if (Z.message) yield {
            message: Z.message
        };
        if (Z.systemMessage) yield {
            message: kq({
                type: "hook_system_message",
                content: Z.systemMessage,
                hookName: _,
                toolUseID: q,
                hookEvent: O
            })
        };
        if (Z.additionalContext) yield {
            additionalContexts: [Z.additionalContext]
        };
        if (Z.updatedMCPToolOutput) yield {
            updatedMCPToolOutput: Z.updatedMCPToolOutput
        };
        if (Z.permissionBehavior) switch (Z.permissionBehavior) {
            case "deny":
                f = "deny";
                break;
            case "ask":
                if (f !== "deny") f = "ask";
                break;
            case "allow":
                if (!f) f = "allow";
                break;
            case "passthrough":
                break
        }
        if (f !== void 0) yield {
            permissionBehavior: f,
            hookPermissionDecisionReason: Z.hookPermissionDecisionReason,
            updatedInput: Z.updatedInput && (Z.permissionBehavior === "allow" || Z.permissionBehavior === "ask") ? Z.updatedInput : void 0
        };
        if (Z.updatedInput && Z.permissionBehavior === void 0) yield {
            updatedInput: Z.updatedInput
        };
        if (Z.permissionRequestResult) yield {
            permissionRequestResult: Z.permissionRequestResult
        };
        if (J && Z.hook.type !== "callback") {
            let N = U6(),
                k = xk7(J, N, O, K ?? "", Z.hook);
            if (k?.onHookSuccess && Z.outcome === "success") try {
                k.onHookSuccess(Z.hook, Z)
            } catch (y) {
                K1(Error("Session hook success callback failed", {
                    cause: y
                }))
            }
        }
    }
    if (c("tengu_repl_hook_finished", {
            hookName: _,
            numCommands: D.length,
            numSuccess: G.success,
            numBlocking: G.blocking,
            numNonBlockingError: G.non_blocking_error,
            numCancelled: G.cancelled
        }), FX()) {
        let Z = Mi4(D);
        zj("hook_execution_complete", {
            hook_event: O,
            hook_name: _,
            num_hooks: String(D.length),
            num_success: String(G.success),
            num_blocking: String(G.blocking),
            num_non_blocking_error: String(G.non_blocking_error),
            num_cancelled: String(G.cancelled),
            managed_only: String(Ap()),
            hook_definitions: Q1(Z),
            hook_source: Ap() ? "policySettings" : "merged"
        })
    }
    Kn7(P, {
        numSuccess: G.success,
        numBlocking: G.blocking,
        numNonBlockingError: G.non_blocking_error,
        numCancelled: G.cancelled
    })
}
// @from(Ln 359757, Col 0)
async function AyA({
    getAppState: A,
    hookInput: q,
    matchQuery: K,
    signal: Y,
    timeoutMs: z = MP
}) {
    let w = q.hook_event_name,
        H = K ? `${w}:${K}` : w;
    if (C8().disableAllHooks) return h(`Skipping hooks for ${H} due to 'disableAllHooks' setting`), [];
    if (Pi4()) return h(`Skipping ${H} hook execution - workspace trust not accepted`), [];
    let $ = A ? await A() : void 0,
        O = U6(),
        _ = oRA($, O, w, q);
    if (_.length === 0) return [];
    if (Y?.aborted) return [];
    let J = Zi4(_);
    c("tengu_run_hook", {
        hookName: H,
        numCommands: _.length,
        ...J && {
            pluginHookCounts: Q1(J)
        }
    });
    let X;
    try {
        X = Q1(q)
    } catch (j) {
        return K1(j instanceof Error ? j : Error(String(j))), []
    }
    let D = _.map(async ({
        hook: j,
        pluginRoot: M
    }, P) => {
        if (j.type === "callback") {
            let Z = j.timeout ? j.timeout * 1000 : z,
                {
                    signal: N,
                    cleanup: T
                } = fR(AbortSignal.timeout(Z), Y);
            try {
                let k = zE(),
                    y = await j.callback(q, k, N, P);
                if (T?.(), SK1(y)) return h(`${H} [callback] returned async response, returning empty output`), {
                    command: "callback",
                    succeeded: !0,
                    output: ""
                };
                let B = y.systemMessage || "";
                return h(`${H} [callback] completed successfully`), {
                    command: "callback",
                    succeeded: !0,
                    output: B
                }
            } catch (k) {
                T?.();
                let y = k instanceof Error ? k.message : String(k);
                return h(`${H} [callback] failed to run: ${y}`, {
                    level: "error"
                }), {
                    command: "callback",
                    succeeded: !1,
                    output: y
                }
            }
        }
        if (j.type === "prompt") return {
            command: j.prompt,
            succeeded: !1,
            output: "Prompt stop hooks are not yet supported outside REPL"
        };
        if (j.type === "agent") return {
            command: j.prompt([]),
            succeeded: !1,
            output: "Agent stop hooks are not yet supported outside REPL"
        };
        if (j.type === "function") return K1(Error(`Function hook reached executeHooksOutsideREPL for ${w}. Function hooks should only be used in REPL context (Stop hooks).`)), {
            command: "function",
            succeeded: !1,
            output: "Internal error: function hook executed outside REPL context"
        };
        let W = j.timeout ? j.timeout * 1000 : z,
            {
                signal: G,
                cleanup: f
            } = fR(AbortSignal.timeout(W), Y);
        try {
            let Z = await BW6(j, w, H, X, G, zE(), P, M);
            if (f?.(), Z.aborted) return h(`${H} [${j.command}] cancelled`), {
                command: j.command,
                succeeded: !1,
                output: "Hook cancelled"
            };
            h(`${H} [${j.command}] completed with status ${Z.status}`);
            let {
                json: N,
                validationError: T
            } = Wi4(Z.stdout);
            if (T) throw Error(T);
            if (N && !SK1(N)) h(`Parsed JSON output from hook: ${Q1(N)}`);
            let k = Z.status === 0 ? Z.stdout || "" : Z.stderr || "";
            return {
                command: j.command,
                succeeded: Z.status === 0,
                output: k
            }
        } catch (Z) {
            f?.();
            let N = Z instanceof Error ? Z.message : String(Z);
            return h(`${H} [${j.command}] failed to run: ${N}`, {
                level: "error"
            }), {
                command: j.command,
                succeeded: !1,
                output: N
            }
        }
    });
    return await Promise.all(D)
}
// @from(Ln 359877, Col 0)
async function* qyA(A, q, K, Y, z, w, H = MP) {
    h(`executePreToolHooks called for tool: ${A}`);
    let $ = {
        ...aX(z),
        hook_event_name: "PreToolUse",
        tool_name: A,
        tool_input: K,
        tool_use_id: q
    };
    yield* NI({
        hookInput: $,
        toolUseID: q,
        matchQuery: A,
        signal: w,
        timeoutMs: H,
        toolUseContext: Y
    })
}
// @from(Ln 359895, Col 0)
async function* KyA(A, q, K, Y, z, w, H, $ = MP) {
    let O = {
        ...aX(w),
        hook_event_name: "PostToolUse",
        tool_name: A,
        tool_input: K,
        tool_response: Y,
        tool_use_id: q
    };
    yield* NI({
        hookInput: O,
        toolUseID: q,
        matchQuery: A,
        signal: H,
        timeoutMs: $,
        toolUseContext: z
    })
}
// @from(Ln 359913, Col 0)
async function* YyA(A, q, K, Y, z, w, H, $, O = MP) {
    let _ = {
        ...aX(H),
        hook_event_name: "PostToolUseFailure",
        tool_name: A,
        tool_input: K,
        tool_use_id: q,
        error: Y,
        is_interrupt: w
    };
    yield* NI({
        hookInput: _,
        toolUseID: q,
        matchQuery: A,
        signal: $,
        timeoutMs: O,
        toolUseContext: z
    })
}
// @from(Ln 359932, Col 0)
async function UTA(A, q = MP) {
    let {
        message: K,
        title: Y,
        notificationType: z
    } = A, w = {
        ...aX(void 0),
        hook_event_name: "Notification",
        message: K,
        title: Y,
        notification_type: z
    };
    await AyA({
        hookInput: w,
        timeoutMs: q,
        matchQuery: z
    })
}
// @from(Ln 359950, Col 0)
async function* zyA(A, q, K = MP, Y = !1, z, w, H, $) {
    let O = z ? {
        ...aX(A),
        hook_event_name: "SubagentStop",
        stop_hook_active: Y,
        agent_id: z,
        agent_transcript_path: kh(z),
        agent_type: $ ?? ""
    } : {
        ...aX(A),
        hook_event_name: "Stop",
        stop_hook_active: Y
    };
    yield* NI({
        hookInput: O,
        toolUseID: zE(),
        signal: q,
        timeoutMs: K,
        toolUseContext: w,
        messages: H
    })
}
// @from(Ln 359972, Col 0)
async function* wyA(A, q, K, Y, z = MP) {
    let w = {
        ...aX(K),
        hook_event_name: "TeammateIdle",
        teammate_name: A,
        team_name: q
    };
    yield* NI({
        hookInput: w,
        toolUseID: zE(),
        signal: Y,
        timeoutMs: z
    })
}
// @from(Ln 359986, Col 0)
async function* Cg1(A, q, K, Y, z, w, H, $ = MP, O) {
    let _ = {
        ...aX(w),
        hook_event_name: "TaskCompleted",
        task_id: A,
        task_subject: q,
        task_description: K,
        teammate_name: Y,
        team_name: z
    };
    yield* NI({
        hookInput: _,
        toolUseID: zE(),
        signal: H,
        timeoutMs: $,
        toolUseContext: O
    })
}
// @from(Ln 360004, Col 0)
async function* HyA(A, q, K) {
    let Y = {
        ...aX(q),
        hook_event_name: "UserPromptSubmit",
        prompt: A
    };
    yield* NI({
        hookInput: Y,
        toolUseID: zE(),
        signal: K.abortController.signal,
        timeoutMs: MP,
        toolUseContext: K
    })
}
// @from(Ln 360018, Col 0)
async function* $yA(A, q, K, Y, z, w = MP, H) {
    let $ = {
        ...aX(void 0, q),
        hook_event_name: "SessionStart",
        source: A,
        agent_type: K,
        model: Y
    };
    yield* NI({
        hookInput: $,
        toolUseID: zE(),
        matchQuery: A,
        signal: z,
        timeoutMs: w,
        forceSyncExecution: H
    })
}
// @from(Ln 360035, Col 0)
async function* OyA(A, q, K = MP, Y) {
    let z = {
        ...aX(void 0),
        hook_event_name: "Setup",
        trigger: A
    };
    yield* NI({
        hookInput: z,
        toolUseID: zE(),
        matchQuery: A,
        signal: q,
        timeoutMs: K,
        forceSyncExecution: Y
    })
}
// @from(Ln 360050, Col 0)
async function* AEA(A, q, K, Y = MP) {
    let z = {
        ...aX(void 0),
        hook_event_name: "SubagentStart",
        agent_id: A,
        agent_type: q
    };
    yield* NI({
        hookInput: z,
        toolUseID: zE(),
        matchQuery: q,
        signal: K,
        timeoutMs: Y
    })
}
// @from(Ln 360065, Col 0)
async function mW6(A, q, K = MP) {
    let Y = {
            ...aX(void 0),
            hook_event_name: "PreCompact",
            trigger: A.trigger,
            custom_instructions: A.customInstructions
        },
        z = await AyA({
            hookInput: Y,
            matchQuery: A.trigger,
            signal: q,
            timeoutMs: K
        });
    if (z.length === 0) return {};
    let w = z.filter(($) => $.succeeded && $.output.trim().length > 0).map(($) => $.output.trim()),
        H = [];
    for (let $ of z)
        if ($.succeeded)
            if ($.output.trim()) H.push(`PreCompact [${$.command}] completed successfully: ${$.output.trim()}`);
            else H.push(`PreCompact [${$.command}] completed successfully`);
    else if ($.output.trim()) H.push(`PreCompact [${$.command}] failed: ${$.output.trim()}`);
    else H.push(`PreCompact [${$.command}] failed`);
    return {
        newCustomInstructions: w.length > 0 ? w.join(`

`) : void 0,
        userDisplayMessage: H.length > 0 ? H.join(`
`) : void 0
    }
}