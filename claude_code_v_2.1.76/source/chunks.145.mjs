
// @from(Ln 366693, Col 4)
IAq = `Use this tool to update a task in the task list.

## When to Use This Tool

**Mark tasks as resolved:**
- When you have completed the work described in a task
- When a task is no longer needed or has been superseded
- IMPORTANT: Always mark your assigned tasks as resolved when you finish them
- After resolving, call TaskList to find your next task

- ONLY mark a task as completed when you have FULLY accomplished it
- If you encounter errors, blockers, or cannot finish, keep the task as in_progress
- When blocked, create a new task describing what needs to be resolved
- Never mark a task as completed if:
  - Tests are failing
  - Implementation is partial
  - You encountered unresolved errors
  - You couldn't find necessary files or dependencies

**Delete tasks:**
- When a task is no longer relevant or was created in error
- Setting status to \`deleted\` permanently removes the task

**Update task details:**
- When requirements change or become clearer
- When establishing dependencies between tasks

## Fields You Can Update

- **status**: The task status (see Status Workflow below)
- **subject**: Change the task title (imperative form, e.g., "Run tests")
- **description**: Change the task description
- **activeForm**: Present continuous form shown in spinner when in_progress (e.g., "Running tests")
- **owner**: Change the task owner (agent name)
- **metadata**: Merge metadata keys into the task (set a key to null to delete it)
- **addBlocks**: Mark tasks that cannot start until this one completes
- **addBlockedBy**: Mark tasks that must complete before this one can start

## Status Workflow

Status progresses: \`pending\` → \`in_progress\` → \`completed\`

Use \`deleted\` to permanently remove a task.

## Staleness

Make sure to read a task's latest state using \`TaskGet\` before updating it.

## Examples

Mark task as in progress when starting work:
\`\`\`json
{"taskId": "1", "status": "in_progress"}
\`\`\`

Mark task as completed after finishing work:
\`\`\`json
{"taskId": "1", "status": "completed"}
\`\`\`

Delete a task:
\`\`\`json
{"taskId": "1", "status": "deleted"}
\`\`\`

Claim a task by setting owner:
\`\`\`json
{"taskId": "1", "owner": "my-name"}
\`\`\`

Set up task dependencies:
\`\`\`json
{"taskId": "2", "addBlockedBy": ["1"]}
\`\`\`
`
// @from(Ln 366769, Col 0)
function bAq() {
    return null
}
// @from(Ln 366773, Col 0)
function xAq() {
    return null
}
// @from(Ln 366777, Col 0)
function uAq() {
    return null
}
// @from(Ln 366781, Col 0)
function mAq() {
    return null
}
// @from(Ln 366785, Col 0)
function BAq(A) {
    return null
}
// @from(Ln 366788, Col 4)
zbY
// @from(Ln 366788, Col 9)
_bY
// @from(Ln 366788, Col 14)
gAq
// @from(Ln 366789, Col 4)
FAq = E(() => {
    K7();
    Bw();
    Qz();
    HA();
    zz();
    qH();
    hw();
    zbY = F6(() => {
        let A = H36().or(C.literal("deleted"));
        return C.strictObject({
            taskId: C.string().describe("The ID of the task to update"),
            subject: C.string().optional().describe("New subject for the task"),
            description: C.string().optional().describe("New description for the task"),
            activeForm: C.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
            status: A.optional().describe("New status for the task"),
            addBlocks: C.array(C.string()).optional().describe("Task IDs that this task blocks"),
            addBlockedBy: C.array(C.string()).optional().describe("Task IDs that block this task"),
            owner: C.string().optional().describe("New owner for the task"),
            metadata: C.record(C.string(), C.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")
        })
    }), _bY = F6(() => C.object({
        success: C.boolean(),
        taskId: C.string(),
        updatedFields: C.array(C.string()),
        error: C.string().optional(),
        statusChange: C.object({
            from: C.string(),
            to: C.string()
        }).optional(),
        verificationNudgeNeeded: C.boolean().optional()
    })), gAq = {
        name: ck,
        searchHint: "update a task",
        maxResultSizeChars: 1e5,
        async description() {
            return CAq
        },
        async prompt() {
            return IAq
        },
        get inputSchema() {
            return zbY()
        },
        get outputSchema() {
            return _bY()
        },
        userFacingName() {
            return "TaskUpdate"
        },
        shouldDefer: !0,
        isEnabled() {
            return r$()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            let q = [A.taskId];
            if (A.status) q.push(A.status);
            if (A.subject) q.push(A.subject);
            return q.join(" ")
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: bAq,
        renderToolUseProgressMessage: xAq,
        renderToolUseRejectedMessage: uAq,
        renderToolUseErrorMessage: mAq,
        renderToolResultMessage: BAq,
        async call({
            taskId: A,
            subject: q,
            description: K,
            activeForm: Y,
            status: z,
            owner: _,
            addBlocks: w,
            addBlockedBy: O,
            metadata: $
        }, H) {
            let j = jf();
            H.setAppState((P) => {
                if (P.expandedView === "tasks") return P;
                return {
                    ...P,
                    expandedView: "tasks"
                }
            });
            let J = await DB(j, A);
            if (!J) return {
                data: {
                    success: !1,
                    taskId: A,
                    updatedFields: [],
                    error: "Task not found"
                }
            };
            let M = [],
                D = {};
            if (q !== void 0 && q !== J.subject) D.subject = q, M.push("subject");
            if (K !== void 0 && K !== J.description) D.description = K, M.push("description");
            if (Y !== void 0 && Y !== J.activeForm) D.activeForm = Y, M.push("activeForm");
            if (_ !== void 0 && _ !== J.owner) D.owner = _, M.push("owner");
            if (E7() && z === "in_progress" && _ === void 0 && !J.owner) {
                let P = i3();
                if (P) D.owner = P, M.push("owner")
            }
            if ($ !== void 0) {
                let P = {
                    ...J.metadata ?? {}
                };
                for (let [W, Z] of Object.entries($))
                    if (Z === null) delete P[W];
                    else P[W] = Z;
                D.metadata = P, M.push("metadata")
            }
            if (z !== void 0) {
                if (z === "deleted") {
                    let P = await sD1(j, A);
                    return {
                        data: {
                            success: P,
                            taskId: A,
                            updatedFields: P ? ["deleted"] : [],
                            error: P ? void 0 : "Failed to delete task",
                            statusChange: P ? {
                                from: J.status,
                                to: "deleted"
                            } : void 0
                        }
                    }
                }
                if (z !== J.status) {
                    if (z === "completed") {
                        let P = [],
                            W = Hi6(A, J.subject, J.description, i3(), l5(), void 0, H?.abortController?.signal, void 0, H);
                        for await (let Z of W) if (Z.blockingError) P.push($i6(Z.blockingError));
                        if (P.length > 0) return {
                            data: {
                                success: !1,
                                taskId: A,
                                updatedFields: [],
                                error: P.join(`
`)
                            }
                        }
                    }
                    D.status = z, M.push("status")
                }
            }
            if (Object.keys(D).length > 0) await WI(j, A, D);
            if (D.owner && E7()) {
                let P = i3() || "team-lead",
                    W = H$(),
                    Z = JSON.stringify({
                        type: "task_assignment",
                        taskId: A,
                        subject: J.subject,
                        description: J.description,
                        assignedBy: P,
                        timestamp: new Date().toISOString()
                    });
                await x3(D.owner, {
                    from: P,
                    text: Z,
                    timestamp: new Date().toISOString(),
                    color: W
                }, j)
            }
            if (w && w.length > 0) {
                let P = w.filter((W) => !J.blocks.includes(W));
                for (let W of P) await _T8(j, A, W);
                if (P.length > 0) M.push("blocks")
            }
            if (O && O.length > 0) {
                let P = O.filter((W) => !J.blockedBy.includes(W));
                for (let W of P) await _T8(j, W, A);
                if (P.length > 0) M.push("blockedBy")
            }
            let X = !1;
            return {
                data: {
                    success: !0,
                    taskId: A,
                    updatedFields: M,
                    statusChange: D.status !== void 0 ? {
                        from: J.status,
                        to: D.status
                    } : void 0,
                    verificationNudgeNeeded: X
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                success: K,
                taskId: Y,
                updatedFields: z,
                error: _,
                statusChange: w,
                verificationNudgeNeeded: O
            } = A;
            if (!K) return {
                tool_use_id: q,
                type: "tool_result",
                content: _ || `Task #${Y} not found`
            };
            let $ = `Updated task #${Y} ${z.join(", ")}`;
            if (w?.to === "completed" && nM() && E7()) $ += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
            if (O) $ += `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${R31}"). You cannot self-assign PARTIAL by listing caveats in your summary — only the verifier issues a verdict.`;
            return {
                tool_use_id: q,
                type: "tool_result",
                content: $
            }
        }
    }
})
// @from(Ln 367020, Col 0)
function QAq() {
    let A = E7() ? `- Before assigning tasks to teammates, to see what's available
` : "",
        q = E7() ? "- **id**: Task identifier (use with TaskGet, TaskUpdate)" : "- **id**: Task identifier (use with TaskGet, TaskUpdate)",
        K = E7() ? `
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
// @from(Ln 367056, Col 4)
pAq = "List all tasks in the task list"
// @from(Ln 367057, Col 4)
UAq = E(() => {
    Qz()
})
// @from(Ln 367061, Col 0)
function dAq() {
    return null
}
// @from(Ln 367065, Col 0)
function cAq() {
    return null
}
// @from(Ln 367069, Col 0)
function lAq() {
    return null
}
// @from(Ln 367073, Col 0)
function iAq() {
    return null
}
// @from(Ln 367077, Col 0)
function nAq(A) {
    return null
}
// @from(Ln 367080, Col 4)
wbY
// @from(Ln 367080, Col 9)
ObY
// @from(Ln 367080, Col 14)
rAq
// @from(Ln 367081, Col 4)
oAq = E(() => {
    K7();
    UAq();
    Bw();
    wbY = F6(() => C.strictObject({})), ObY = F6(() => C.object({
        tasks: C.array(C.object({
            id: C.string(),
            subject: C.string(),
            status: H36(),
            owner: C.string().optional(),
            blockedBy: C.array(C.string())
        }))
    })), rAq = {
        name: it,
        searchHint: "list all tasks",
        maxResultSizeChars: 1e5,
        async description() {
            return pAq
        },
        async prompt() {
            return QAq()
        },
        get inputSchema() {
            return wbY()
        },
        get outputSchema() {
            return ObY()
        },
        userFacingName() {
            return "TaskList"
        },
        shouldDefer: !0,
        isEnabled() {
            return r$()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: dAq,
        renderToolUseProgressMessage: cAq,
        renderToolUseRejectedMessage: lAq,
        renderToolUseErrorMessage: iAq,
        renderToolResultMessage: nAq,
        async call() {
            let A = jf(),
                q = (await DX(A)).filter((z) => !z.metadata?._internal),
                K = new Set(q.filter((z) => z.status === "completed").map((z) => z.id));
            return {
                data: {
                    tasks: q.map((z) => ({
                        id: z.id,
                        subject: z.subject,
                        status: z.status,
                        owner: z.owner,
                        blockedBy: z.blockedBy.filter((_) => !K.has(_))
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
                let _ = z.owner ? ` (${z.owner})` : "",
                    w = z.blockedBy.length > 0 ? ` [blocked by ${z.blockedBy.map((O)=>`#${O}`).join(", ")}]` : "";
                return `#${z.id} [${z.status}] ${z.subject}${_}${w}`
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
// @from(Ln 367175, Col 4)
aAq = {}
// @from(Ln 367180, Col 0)
function ST6() {
    return !0
}
// @from(Ln 367184, Col 0)
function HbY(A, q) {
    let {
        min: K,
        max: Y
    } = q, z = new Set;
    for (let _ of A.split(",")) {
        let w = _.match(/^\*(?:\/(\d+))?$/);
        if (w) {
            let H = w[1] ? parseInt(w[1], 10) : 1;
            if (H < 1) return null;
            for (let j = K; j <= Y; j += H) z.add(j);
            continue
        }
        let O = _.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
        if (O) {
            let H = parseInt(O[1], 10),
                j = parseInt(O[2], 10),
                J = O[3] ? parseInt(O[3], 10) : 1,
                M = K === 0 && Y === 6,
                D = M ? 7 : Y;
            if (H > j || J < 1 || H < K || j > D) return null;
            for (let X = H; X <= j; X += J) z.add(M && X === 7 ? 0 : X);
            continue
        }
        if (_.match(/^\d+$/)) {
            let H = parseInt(_, 10);
            if (K === 0 && Y === 6 && H === 7) H = 0;
            if (H < K || H > Y) return null;
            z.add(H);
            continue
        }
        return null
    }
    if (z.size === 0) return null;
    return Array.from(z).sort((_, w) => _ - w)
}
// @from(Ln 367221, Col 0)
function ji6(A) {
    let q = A.trim().split(/\s+/);
    if (q.length !== 5) return null;
    let K = [];
    for (let Y = 0; Y < 5; Y++) {
        let z = HbY(q[Y], $bY[Y]);
        if (!z) return null;
        K.push(z)
    }
    return {
        minute: K[0],
        hour: K[1],
        dayOfMonth: K[2],
        month: K[3],
        dayOfWeek: K[4]
    }
}
// @from(Ln 367239, Col 0)
function tAq(A, q) {
    let K = new Set(A.minute),
        Y = new Set(A.hour),
        z = new Set(A.dayOfMonth),
        _ = new Set(A.month),
        w = new Set(A.dayOfWeek),
        O = A.dayOfMonth.length === 31,
        $ = A.dayOfWeek.length === 7,
        H = new Date(q.getTime());
    H.setSeconds(0, 0), H.setMinutes(H.getMinutes() + 1);
    let j = 527040;
    for (let J = 0; J < j; J++) {
        let M = H.getMonth() + 1;
        if (!_.has(M)) {
            H.setMonth(H.getMonth() + 1, 1), H.setHours(0, 0, 0, 0);
            continue
        }
        let D = H.getDate(),
            X = H.getDay();
        if (!(O && $ ? !0 : O ? w.has(X) : $ ? z.has(D) : z.has(D) || w.has(X))) {
            H.setDate(H.getDate() + 1), H.setHours(0, 0, 0, 0);
            continue
        }
        if (!Y.has(H.getHours())) {
            H.setHours(H.getHours() + 1, 0, 0, 0);
            continue
        }
        if (!K.has(H.getMinutes())) {
            H.setMinutes(H.getMinutes() + 1);
            continue
        }
        return H
    }
    return null
}
// @from(Ln 367275, Col 0)
function jbY(A, q) {
    return new Date(2000, 0, 1, q, A).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })
}
// @from(Ln 367282, Col 0)
function JbY(A, q) {
    let K = new Date;
    return K.setUTCHours(q, A, 0, 0), K.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
    })
}
// @from(Ln 367291, Col 0)
function CT6(A, q) {
    let K = q?.utc ?? !1,
        Y = A.trim().split(/\s+/);
    if (Y.length !== 5) return A;
    let [z, _, w, O, $] = Y, H = z.match(/^\*\/(\d+)$/);
    if (H && _ === "*" && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(H[1], 10);
        return X === 1 ? "Every minute" : `Every ${X} minutes`
    }
    if (z.match(/^\d+$/) && _ === "*" && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(z, 10);
        if (X === 0) return "Every hour";
        return `Every hour at :${X.toString().padStart(2,"0")}`
    }
    let j = _.match(/^\*\/(\d+)$/);
    if (z.match(/^\d+$/) && j && w === "*" && O === "*" && $ === "*") {
        let X = parseInt(j[1], 10),
            P = parseInt(z, 10),
            W = P === 0 ? "" : ` at :${P.toString().padStart(2,"0")}`;
        return X === 1 ? `Every hour${W}` : `Every ${X} hours${W}`
    }
    if (!z.match(/^\d+$/) || !_.match(/^\d+$/)) return A;
    let J = parseInt(z, 10),
        M = parseInt(_, 10),
        D = K ? JbY : jbY;
    if (w === "*" && O === "*" && $ === "*") return `Every day at ${D(J,M)}`;
    if (w === "*" && O === "*" && $.match(/^\d$/)) {
        let X = parseInt($, 10) % 7,
            P;
        if (K) {
            let W = new Date,
                Z = (X - W.getUTCDay() + 7) % 7;
            W.setUTCDate(W.getUTCDate() + Z), W.setUTCHours(M, J, 0, 0), P = sAq[W.getDay()]
        } else P = sAq[X];
        if (P) return `Every ${P} at ${D(J,M)}`
    }
    if (w === "*" && O === "*" && $ === "1-5") return `Weekdays at ${D(J,M)}`;
    return A
}
// @from(Ln 367330, Col 4)
$bY
// @from(Ln 367330, Col 9)
sAq
// @from(Ln 367331, Col 4)
Ji6 = E(() => {
    $bY = [{
        min: 0,
        max: 59
    }, {
        min: 0,
        max: 23
    }, {
        min: 1,
        max: 31
    }, {
        min: 1,
        max: 12
    }, {
        min: 0,
        max: 6
    }];
    sAq = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
})
// @from(Ln 367364, Col 0)
function bl(A) {
    return DF8(A ?? qY(), WbY)
}
// @from(Ln 367367, Col 0)
async function Mi6(A) {
    let q = $1(),
        K;
    try {
        K = await q.readFile(bl(A), {
            encoding: "utf-8"
        })
    } catch (w) {
        let O = w.code;
        if (O === "ENOENT" || O === "EACCES" || O === "EPERM") return [];
        return _6(w), []
    }
    let Y = WK(K, !1);
    if (!Y || typeof Y !== "object") return [];
    let z = Y;
    if (!Array.isArray(z.tasks)) return [];
    let _ = [];
    for (let w of z.tasks) {
        if (!w || typeof w.id !== "string" || typeof w.cron !== "string" || typeof w.prompt !== "string" || typeof w.createdAt !== "number") {
            k(`[ScheduledTasks] skipping malformed task: ${B6(w)}`);
            continue
        }
        if (!ji6(w.cron)) {
            k(`[ScheduledTasks] skipping task ${w.id} with invalid cron '${w.cron}'`);
            continue
        }
        _.push({
            id: w.id,
            cron: w.cron,
            prompt: w.prompt,
            createdAt: w.createdAt,
            ...w.recurring ? {
                recurring: !0
            } : {},
            ...w.permanent ? {
                permanent: !0
            } : {}
        })
    }
    return _
}
// @from(Ln 367409, Col 0)
function zE1(A) {
    let q;
    try {
        q = DbY(bl(A), "utf-8")
    } catch {
        return !1
    }
    let K = WK(q, !1);
    if (!K || typeof K !== "object") return !1;
    let Y = K.tasks;
    return Array.isArray(Y) && Y.length > 0
}
// @from(Ln 367421, Col 0)
async function eAq(A, q) {
    let K = q ?? qY();
    await PbY(DF8(K, ".claude"), {
        recursive: !0
    });
    let Y = {
        tasks: A.map(({
            durable: z,
            ..._
        }) => _)
    };
    await XbY(bl(K), B6(Y, null, 2) + `
`, "utf-8")
}
// @from(Ln 367435, Col 0)
async function A7q(A, q, K, Y, z) {
    let _ = MbY().slice(0, 8),
        w = {
            id: _,
            cron: A,
            prompt: q,
            createdAt: Date.now(),
            ...K ? {
                recurring: !0
            } : {}
        };
    if (!Y) return Bu1({
        ...w,
        ...z ? {
            agentId: z
        } : {}
    }), _;
    let O = await Mi6();
    return O.push(w), await eAq(O), _
}
// @from(Ln 367455, Col 0)
async function yz6(A, q) {
    if (A.length === 0) return;
    if (q === void 0 && lk6(A) === A.length) return;
    let K = new Set(A),
        Y = await Mi6(q),
        z = Y.filter((_) => !K.has(_.id));
    if (z.length === Y.length) return;
    await eAq(z, q)
}
// @from(Ln 367464, Col 0)
async function bT6(A) {
    let q = await Mi6(A);
    if (A !== void 0) return q;
    let K = ck6().map((Y) => ({
        ...Y,
        durable: !1
    }));
    return [...q, ...K]
}
// @from(Ln 367474, Col 0)
function IT6(A, q) {
    let K = ji6(A);
    if (!K) return null;
    let Y = tAq(K, new Date(q));
    return Y ? Y.getTime() : null
}
// @from(Ln 367481, Col 0)
function q7q(A) {
    let q = parseInt(A.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(q) ? q : 0
}
// @from(Ln 367486, Col 0)
function XF8(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    let _ = IT6(A, z);
    if (_ === null) return z;
    let w = Math.min(q7q(K) * Y.recurringFrac * (_ - z), Y.recurringCapMs);
    return z + w
}
// @from(Ln 367495, Col 0)
function K7q(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    if (new Date(z).getMinutes() % Y.oneShotMinuteMod !== 0) return z;
    let _ = Y.oneShotFloorMs + q7q(K) * (Y.oneShotMaxMs - Y.oneShotFloorMs);
    return Math.max(z - _, q)
}
// @from(Ln 367503, Col 0)
function Y7q(A, q) {
    return A.filter((K) => {
        let Y = IT6(K.cron, K.createdAt);
        return Y !== null && Y < q
    })
}
// @from(Ln 367509, Col 4)
WbY
// @from(Ln 367509, Col 9)
Lz6
// @from(Ln 367510, Col 4)
Rz6 = E(() => {
    T1();
    SA();
    K_();
    H1();
    k1();
    g1();
    Ji6();
    WbY = DF8(".claude", "scheduled_tasks.json");
    Lz6 = {
        recurringFrac: 0.1,
        recurringCapMs: 900000,
        oneShotMaxMs: 90000,
        oneShotFloorMs: 0,
        oneShotMinuteMod: 30
    }
})
// @from(Ln 367528, Col 0)
function z7q(A) {
    return `${A.cron??""}${A.prompt?`: ${R3(A.prompt,60,!0)}`:""}`
}
// @from(Ln 367532, Col 0)
function _7q(A) {
    return BZ.default.createElement(t1, null, BZ.default.createElement(T, null, "Scheduled ", BZ.default.createElement(T, {
        bold: !0
    }, A.id), " ", BZ.default.createElement(T, {
        dimColor: !0
    }, "(", A.humanSchedule, ")")))
}
// @from(Ln 367540, Col 0)
function w7q(A) {
    return A.id ?? ""
}
// @from(Ln 367544, Col 0)
function O7q(A) {
    return BZ.default.createElement(t1, null, BZ.default.createElement(T, null, "Cancelled ", BZ.default.createElement(T, {
        bold: !0
    }, A.id)))
}
// @from(Ln 367550, Col 0)
function $7q() {
    return ""
}
// @from(Ln 367554, Col 0)
function H7q(A) {
    if (A.jobs.length === 0) return BZ.default.createElement(t1, null, BZ.default.createElement(T, {
        dimColor: !0
    }, "No scheduled jobs"));
    return BZ.default.createElement(t1, null, A.jobs.map((q) => BZ.default.createElement(T, {
        key: q.id
    }, BZ.default.createElement(T, {
        bold: !0
    }, q.id), " ", BZ.default.createElement(T, {
        dimColor: !0
    }, q.humanSchedule))))
}
// @from(Ln 367567, Col 0)
function xT6() {
    return null
}
// @from(Ln 367571, Col 0)
function uT6() {
    return BZ.default.createElement(T3, null)
}
// @from(Ln 367575, Col 0)
function mT6(A, {
    verbose: q
}) {
    return BZ.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 367583, Col 4)
BZ
// @from(Ln 367584, Col 4)
_E1 = E(() => {
    i6();
    gj();
    kO();
    iq();
    M4();
    BZ = t(P6(), 1)
})
// @from(Ln 367592, Col 4)
J7q = {}
// @from(Ln 367596, Col 4)
j7q = 50
// @from(Ln 367597, Col 4)
ZbY
// @from(Ln 367597, Col 9)
GbY
// @from(Ln 367597, Col 14)
fbY
// @from(Ln 367597, Col 19)
TbY
// @from(Ln 367598, Col 4)
M7q = E(() => {
    K7();
    dq6();
    Ji6();
    Rz6();
    T1();
    qZ();
    nt();
    _E1();
    ZbY = F6(() => C.strictObject({
        cron: C.string().describe('Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'),
        prompt: C.string().describe("The prompt to enqueue at each fire time."),
        recurring: YX(C.boolean().optional()).describe('true (default) = fire on every cron match until deleted or auto-expired after 3 days. false = fire once at the next match, then auto-delete. Use false for "remind me at X" one-shot requests with pinned minute/hour/dom/month.'),
        durable: YX(C.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json and survive restarts. false (default) = in-memory only, dies when this Claude session ends. Use true only when the user asks the task to survive across sessions.")
    })), GbY = F6(() => ZbY().omit({
        durable: !0
    })), fbY = F6(() => C.object({
        id: C.string(),
        humanSchedule: C.string(),
        recurring: C.boolean(),
        durable: C.boolean().optional()
    })), TbY = {
        name: ER,
        searchHint: "schedule a recurring prompt for this session",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return GbY()
        },
        get outputSchema() {
            return fbY()
        },
        userFacingName() {
            return ER
        },
        isEnabled() {
            return kR()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return `${A.cron}: ${A.prompt}`
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async description() {
            return RV8
        },
        async prompt() {
            return hV8
        },
        getPath() {
            return bl()
        },
        async validateInput(A) {
            if (!ji6(A.cron)) return {
                result: !1,
                message: `Invalid cron expression '${A.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
                errorCode: 1
            };
            if (IT6(A.cron, Date.now()) === null) return {
                result: !1,
                message: `Cron expression '${A.cron}' does not match any calendar date in the next year.`,
                errorCode: 2
            };
            if ((await bT6()).length >= j7q) return {
                result: !1,
                message: `Too many scheduled jobs (max ${j7q}). Cancel one first.`,
                errorCode: 3
            };
            if (A.durable && iM()) return {
                result: !1,
                message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
                errorCode: 4
            };
            return {
                result: !0
            }
        },
        async call({
            cron: A,
            prompt: q,
            recurring: K = !0,
            durable: Y = !1
        }) {
            let z = await A7q(A, q, K, Y, iM()?.agentId);
            return dk6(!0), {
                data: {
                    id: z,
                    humanSchedule: CT6(A),
                    recurring: K,
                    durable: Y
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let K = A.durable ? "Persisted to .claude/scheduled_tasks.json" : "Session-only (not written to disk, dies when Claude exits)";
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A.recurring ? `Scheduled recurring job ${A.id} (${A.humanSchedule}). ${K}. Auto-expires after 3 days. Use CronDelete to cancel sooner.` : `Scheduled one-shot task ${A.id} (${A.humanSchedule}). ${K}. It will fire once then auto-delete.`
            }
        },
        renderToolUseMessage: z7q,
        renderToolUseProgressMessage: xT6,
        renderToolUseRejectedMessage: uT6,
        renderToolUseErrorMessage: mT6,
        renderToolResultMessage: _7q
    }
})
// @from(Ln 367716, Col 4)
D7q = {}
// @from(Ln 367720, Col 4)
vbY
// @from(Ln 367720, Col 9)
NbY
// @from(Ln 367720, Col 14)
VbY
// @from(Ln 367721, Col 4)
X7q = E(() => {
    K7();
    Rz6();
    qZ();
    nt();
    _E1();
    vbY = F6(() => C.strictObject({
        id: C.string().describe("Job ID returned by CronCreate.")
    })), NbY = F6(() => C.object({
        id: C.string()
    })), VbY = {
        name: ed,
        searchHint: "cancel a scheduled cron job",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return vbY()
        },
        get outputSchema() {
            return NbY()
        },
        userFacingName() {
            return ed
        },
        isEnabled() {
            return kR()
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return A.id
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async description() {
            return SV8
        },
        async prompt() {
            return CV8
        },
        getPath() {
            return bl()
        },
        async validateInput(A) {
            let K = (await bT6()).find((z) => z.id === A.id);
            if (!K) return {
                result: !1,
                message: `No scheduled job with id '${A.id}'`,
                errorCode: 1
            };
            let Y = iM();
            if (Y && K.agentId !== Y.agentId) return {
                result: !1,
                message: `Cannot delete cron job '${A.id}': owned by another agent`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call({
            id: A
        }) {
            return await yz6([A]), {
                data: {
                    id: A
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: `Cancelled job ${A.id}.`
            }
        },
        renderToolUseMessage: w7q,
        renderToolUseProgressMessage: xT6,
        renderToolUseRejectedMessage: uT6,
        renderToolUseErrorMessage: mT6,
        renderToolResultMessage: O7q
    }
})
// @from(Ln 367812, Col 4)
P7q = {}
// @from(Ln 367816, Col 4)
kbY
// @from(Ln 367816, Col 9)
EbY
// @from(Ln 367816, Col 14)
ybY
// @from(Ln 367817, Col 4)
W7q = E(() => {
    K7();
    Ji6();
    M4();
    Rz6();
    qZ();
    nt();
    _E1();
    kbY = F6(() => C.strictObject({})), EbY = F6(() => C.object({
        jobs: C.array(C.object({
            id: C.string(),
            cron: C.string(),
            humanSchedule: C.string(),
            prompt: C.string(),
            recurring: C.boolean().optional(),
            durable: C.boolean().optional()
        }))
    })), ybY = {
        name: SW6,
        searchHint: "list active cron jobs",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return kbY()
        },
        get outputSchema() {
            return EbY()
        },
        userFacingName() {
            return SW6
        },
        isEnabled() {
            return kR()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async description() {
            return IV8
        },
        async prompt() {
            return bV8
        },
        async call() {
            let A = await bT6(),
                q = iM();
            return {
                data: {
                    jobs: (q ? A.filter((z) => z.agentId === q.agentId) : A).map((z) => ({
                        id: z.id,
                        cron: z.cron,
                        humanSchedule: CT6(z.cron),
                        prompt: z.prompt,
                        ...z.recurring ? {
                            recurring: !0
                        } : {},
                        ...z.durable === !1 ? {
                            durable: !1
                        } : {}
                    }))
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A.jobs.length > 0 ? A.jobs.map((K) => `${K.id} — ${K.humanSchedule}${K.recurring?" (recurring)":" (one-shot)"}${K.durable===!1?" [session-only]":""}: ${R3(K.prompt,80,!0)}`).join(`
`) : "No scheduled jobs."
            }
        },
        renderToolUseMessage: $7q,
        renderToolUseProgressMessage: xT6,
        renderToolUseRejectedMessage: uT6,
        renderToolUseErrorMessage: mT6,
        renderToolResultMessage: H7q
    }
})
// @from(Ln 367907, Col 4)
G7q = {}
// @from(Ln 367922, Col 0)
function bbY(A) {
    let q = SbY(A).toLowerCase();
    return IbY[q] ?? "application/octet-stream"
}
// @from(Ln 367927, Col 0)
function hz6(A) {
    k(`[brief:upload] ${A}`)
}
// @from(Ln 367931, Col 0)
function xbY() {
    return sA()?.accessToken || void 0
}
// @from(Ln 367935, Col 0)
function ubY() {
    return process.env.ANTHROPIC_BASE_URL || P7().BASE_API_URL
}
// @from(Ln 367938, Col 0)
async function BbY(A, q, K) {
    {
        if (!K.replBridgeEnabled) return;
        if (q > Z7q) {
            hz6(`skip ${A}: ${q} bytes exceeds ${Z7q} limit`);
            return
        }
        let Y = xbY();
        if (!Y) {
            hz6("skip: no oauth token");
            return
        }
        let z;
        try {
            z = await RbY(A)
        } catch (J) {
            hz6(`read failed for ${A}: ${J}`);
            return
        }
        let w = `${ubY()}/api/oauth/file_upload`,
            O = hbY(A),
            $ = bbY(O),
            H = `----FormBoundary${LbY()}`,
            j = Buffer.concat([Buffer.from(`--${H}\r
Content-Disposition: form-data; name="file"; filename="${O}"\r
Content-Type: ${$}\r
\r
`), z, Buffer.from(`\r
--${H}--\r
`)]);
        try {
            let J = await X8.post(w, j, {
                headers: {
                    Authorization: `Bearer ${Y}`,
                    "Content-Type": `multipart/form-data; boundary=${H}`,
                    "Content-Length": j.length.toString()
                },
                timeout: CbY,
                signal: K.signal,
                validateStatus: () => !0
            });
            if (J.status !== 201) {
                hz6(`upload failed for ${A}: status=${J.status} body=${B6(J.data).slice(0,200)}`);
                return
            }
            let M = mbY().safeParse(J.data);
            if (!M.success) {
                hz6(`unexpected response shape for ${A}: ${M.error.message}`);
                return
            }
            return hz6(`uploaded ${A} → ${M.data.file_uuid} (${q} bytes)`), M.data.file_uuid
        } catch (J) {
            hz6(`upload threw for ${A}: ${J}`);
            return
        }
    }
    return
}
// @from(Ln 367996, Col 4)
Z7q = 31457280
// @from(Ln 367997, Col 4)
CbY = 30000
// @from(Ln 367998, Col 4)
IbY
// @from(Ln 367998, Col 9)
mbY
// @from(Ln 367999, Col 4)
f7q = E(() => {
    kK();
    K7();
    F5();
    fA();
    H1();
    g1();
    IbY = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp"
    };
    mbY = F6(() => C.object({
        file_uuid: C.string()
    }))
})
// @from(Ln 368020, Col 0)
async function v7q(A) {
    let q = G1();
    for (let K of A) {
        let Y = L4(K);
        try {
            if (!(await T7q(Y)).isFile()) return {
                result: !1,
                message: `Attachment "${K}" is not a regular file.`,
                errorCode: 1
            }
        } catch (z) {
            let _ = z.code;
            if (_ === "ENOENT") return {
                result: !1,
                message: `Attachment "${K}" does not exist. Current working directory: ${q}.`,
                errorCode: 1
            };
            if (_ === "EACCES" || _ === "EPERM") return {
                result: !1,
                message: `Attachment "${K}" is not accessible (permission denied).`,
                errorCode: 1
            };
            throw z
        }
    }
    return {
        result: !0
    }
}
// @from(Ln 368049, Col 0)
async function N7q(A, q) {
    let K = [];
    for (let Y of A) {
        let z = L4(Y),
            _ = await T7q(z);
        K.push({
            path: z,
            size: _.size,
            isImage: XG1.test(z)
        })
    } {
        let Y = q.replBridgeEnabled || t6(process.env.CLAUDE_CODE_BRIEF_UPLOAD),
            {
                uploadBriefAttachment: z
            } = await Promise.resolve().then(() => (f7q(), G7q)),
            _ = await Promise.all(K.map((w) => z(w.path, w.size, {
                replBridgeEnabled: Y,
                signal: q.signal
            })));
        return K.map((w, O) => _[O] === void 0 ? w : {
            ...w,
            file_uuid: _[O]
        })
    }
    return K
}
// @from(Ln 368075, Col 4)
V7q = E(() => {
    lA();
    A8();
    aZ6();
    F9()
})
// @from(Ln 368082, Col 0)
function k7q() {
    return ""
}
// @from(Ln 368086, Col 0)
function E7q() {
    return null
}
// @from(Ln 368090, Col 0)
function y7q() {
    return dw.default.createElement(T3, null)
}
// @from(Ln 368094, Col 0)
function L7q(A, {
    verbose: q
}) {
    return dw.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 368103, Col 0)
function R7q(A, q, K) {
    let Y = (A.attachments?.length ?? 0) > 0;
    if (!A.message && !Y) return null;
    if (K?.isTranscriptMode) return dw.default.createElement(m, {
        flexDirection: "row",
        marginTop: 1
    }, dw.default.createElement(m, {
        minWidth: 2
    }, dw.default.createElement(T, {
        color: "text"
    }, I3)), dw.default.createElement(m, {
        flexDirection: "column"
    }, A.message ? dw.default.createElement(U_, null, A.message) : null, dw.default.createElement(PF8, {
        attachments: A.attachments
    })));
    if (K?.isBriefOnly) {
        let z = K.timestamp ? Uv1(K.timestamp) : "";
        return dw.default.createElement(m, {
            flexDirection: "column",
            marginTop: 1,
            paddingLeft: 2
        }, dw.default.createElement(m, {
            flexDirection: "row"
        }, dw.default.createElement(T, {
            color: "briefLabelClaude"
        }, "Claude"), z ? dw.default.createElement(T, {
            dimColor: !0
        }, " ", z) : null), dw.default.createElement(m, {
            flexDirection: "column"
        }, A.message ? dw.default.createElement(U_, null, A.message) : null, dw.default.createElement(PF8, {
            attachments: A.attachments
        })))
    }
    return dw.default.createElement(m, {
        flexDirection: "row",
        marginTop: 1
    }, dw.default.createElement(m, {
        minWidth: 2
    }), dw.default.createElement(m, {
        flexDirection: "column"
    }, A.message ? dw.default.createElement(U_, null, A.message) : null, dw.default.createElement(PF8, {
        attachments: A.attachments
    })))
}
// @from(Ln 368148, Col 0)
function PF8(A) {
    let q = A6(4),
        {
            attachments: K
        } = A;
    if (!K || K.length === 0) return null;
    let Y;
    if (q[0] !== K) Y = K.map(gbY), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== Y) z = dw.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, Y), q[2] = Y, q[3] = z;
    else z = q[3];
    return z
}
// @from(Ln 368166, Col 0)
function gbY(A) {
    return dw.default.createElement(m, {
        key: A.path,
        flexDirection: "row"
    }, dw.default.createElement(T, {
        dimColor: !0
    }, a6.pointerSmall, " ", A.isImage ? "[image]" : "[file]", " "), dw.default.createElement(T, null, $K(A.path)), dw.default.createElement(T, {
        dimColor: !0
    }, " (", xq(A.size), ")"))
}
// @from(Ln 368176, Col 4)
dw
// @from(Ln 368177, Col 4)
h7q = E(() => {
    e6();
    b7();
    i6();
    gj();
    kO();
    ov();
    Z7();
    qw();
    dw = t(P6(), 1)
})
// @from(Ln 368188, Col 4)
xl = {}
// @from(Ln 368195, Col 0)
function wE1() {
    return Vn() || t6(process.env.CLAUDE_CODE_BRIEF) || lk("tengu_kairos_brief", !1, QbY)
}
// @from(Ln 368199, Col 0)
function S7q() {
    return (Vn() || KG()) && wE1()
}
// @from(Ln 368202, Col 4)
FbY
// @from(Ln 368202, Col 9)
pbY
// @from(Ln 368202, Col 14)
QbY = 300000
// @from(Ln 368203, Col 4)
UbY
// @from(Ln 368204, Col 4)
qF = E(() => {
    K7();
    HA();
    T1();
    A8();
    V1();
    V7q();
    gu();
    h7q();
    FbY = F6(() => C.strictObject({
        message: C.string().describe("The message for the user. Supports markdown formatting."),
        attachments: C.array(C.string()).optional().describe("Optional file paths (absolute or relative to cwd) to attach. Use for photos, screenshots, diffs, logs, or any file the user should see alongside your message."),
        status: C.enum(["normal", "proactive"]).describe("Use 'proactive' when you're surfacing something the user hasn't asked for and needs to see now — task completion while they're away, a blocker you hit, an unsolicited status update. Use 'normal' when replying to something the user just said.")
    })), pbY = F6(() => C.object({
        message: C.string().describe("The message"),
        attachments: C.array(C.object({
            path: C.string(),
            size: C.number(),
            isImage: C.boolean(),
            file_uuid: C.string().optional()
        })).optional().describe("Resolved attachment metadata")
    }));
    UbY = {
        name: Y58,
        aliases: [z58],
        searchHint: "send a message to the user — your primary visible output channel",
        maxResultSizeChars: 1e5,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return FbY()
        },
        get outputSchema() {
            return pbY()
        },
        isEnabled() {
            return S7q()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.message
        },
        async validateInput({
            attachments: A
        }, q) {
            if (!A || A.length === 0) return {
                result: !0
            };
            return v7q(A)
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async description() {
            return _58
        },
        async prompt() {
            return w58
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let K = A.attachments?.length ?? 0,
                Y = K === 0 ? "" : ` (${K} attachment${K===1?"":"s"} included)`;
            return {
                tool_use_id: q,
                type: "tool_result",
                content: `Message delivered to user.${Y}`
            }
        },
        renderToolUseMessage: k7q,
        renderToolUseProgressMessage: E7q,
        renderToolUseRejectedMessage: y7q,
        renderToolUseErrorMessage: L7q,
        renderToolResultMessage: R7q,
        async call({
            message: A,
            attachments: q,
            status: K
        }, Y) {
            if (d("tengu_brief_send", {
                    proactive: K === "proactive",
                    attachment_count: q?.length ?? 0
                }), !q || q.length === 0) return {
                data: {
                    message: A
                }
            };
            let z = Y.getAppState(),
                _ = await N7q(q, {
                    replBridgeEnabled: z.replBridgeEnabled,
                    signal: Y.abortController.signal
                });
            return {
                data: {
                    message: A,
                    attachments: _
                }
            }
        }
    }
})
// @from(Ln 368314, Col 0)
function C7q() {
    return `
# TeamCreate

## When to Use

Use this tool proactively whenever:
- The user explicitly asks to use a team, swarm, or group of agents
- The user mentions wanting agents to work together, coordinate, or collaborate
- A task is complex enough that it would benefit from parallel work by multiple agents (e.g., building a full-stack feature with frontend and backend work, refactoring a codebase while keeping tests passing, implementing a multi-step project with research, planning, and coding phases)

When in doubt about whether a task warrants a team, prefer spawning a team.

## Choosing Agent Types for Teammates

When spawning teammates via the Agent tool, choose the \`subagent_type\` based on what tools the agent needs for its task. Each agent type has a different set of available tools — match the agent to the work:

- **Read-only agents** (e.g., Explore, Plan) cannot edit or write files. Only assign them research, search, or planning tasks. Never assign them implementation work.
- **Full-capability agents** (e.g., general-purpose) have access to all tools including file editing, writing, and bash. Use these for tasks that require making changes.
- **Custom agents** defined in \`.claude/agents/\` may have their own tool restrictions. Check their descriptions to understand what they can and cannot do.

Always review the agent type descriptions and their available tools listed in the Agent tool prompt before selecting a \`subagent_type\` for a teammate.

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
3. **Spawn teammates** using the Agent tool with \`team_name\` and \`name\` parameters to create teammates that join the team
4. **Assign tasks** using TaskUpdate with \`owner\` to give tasks to idle teammates
5. **Teammates work on assigned tasks** and mark them completed via TaskUpdate
6. **Teammates go idle between turns** - after each turn, teammates automatically go idle and send a notification. IMPORTANT: Be patient with idle teammates! Don't comment on their idleness until it actually impacts your work.
7. **Shutdown your team** - when the task is completed, gracefully shut down your teammates via SendMessage with \`message: {type: "shutdown_request"}\`.

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
- \`to\` when sending messages
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
// @from(Ln 368428, Col 0)
function I7q(A) {
    return `create team: ${A.team_name}`
}
// @from(Ln 368432, Col 0)
function b7q() {
    return null
}
// @from(Ln 368436, Col 0)
function x7q() {
    return ZF8.default.createElement(T3, null)
}
// @from(Ln 368440, Col 0)
function u7q(A, {
    verbose: q
}) {
    return ZF8.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 368449, Col 0)
function m7q() {
    return null
}
// @from(Ln 368452, Col 4)
ZF8
// @from(Ln 368453, Col 4)
B7q = E(() => {
    gj();
    kO();
    ZF8 = t(P6(), 1)
})
// @from(Ln 368458, Col 4)
F7q = {}
// @from(Ln 368470, Col 0)
function GF8(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 368474, Col 0)
function g7q(A) {
    return fF8(YG(), GF8(A))
}
// @from(Ln 368477, Col 0)
async function ibY(A, q) {
    let K = g7q(A);
    await dbY(K, {
        recursive: !0
    });
    let Y = fF8(K, "config.json");
    await cbY(Y, B6(q, null, 2))
}
// @from(Ln 368486, Col 0)
function nbY(A) {
    if (!e$(A)) return A;
    return kP1()
}
// @from(Ln 368490, Col 4)
lbY
// @from(Ln 368490, Col 9)
rbY
// @from(Ln 368491, Col 4)
p7q = E(() => {
    K7();
    A8();
    Kl6();
    lA();
    V1();
    qV8();
    vf();
    Bw();
    T1();
    z4();
    g1();
    Qz();
    wh();
    B7q();
    lbY = F6(() => C.strictObject({
        team_name: C.string().describe("Name for the new team to create."),
        description: C.string().optional().describe("Team description/purpose."),
        agent_type: C.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.')
    }));
    rbY = {
        name: SI,
        searchHint: "create a multi-agent swarm team",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return lbY()
        },
        isEnabled() {
            return E7()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return !1
        },
        toAutoClassifierInput(A) {
            return A.team_name
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
            return C7q()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: B6(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            let {
                setAppState: K,
                getAppState: Y
            } = q, {
                team_name: z,
                description: _,
                agent_type: w
            } = A, O = Y(), $ = O.teamContext?.teamName;
            if ($) throw Error(`Already leading team "${$}". A leader can only manage one team at a time. Use TeamDelete to end the current team before creating a new one.`);
            let H = nbY(z),
                j = ak(BY, H),
                J = w || BY,
                M = H5(O.mainLoopModelForSession ?? O.mainLoopModel ?? g0()),
                D = g7q(H),
                X = fF8(D, "config.json"),
                P = {
                    name: H,
                    description: _,
                    createdAt: Date.now(),
                    leadAgentId: j,
                    leadSessionId: R1(),
                    members: [{
                        agentId: j,
                        name: BY,
                        agentType: J,
                        model: M,
                        joinedAt: Date.now(),
                        tmuxPaneId: "",
                        cwd: G1(),
                        subscriptions: []
                    }]
                };
            await ibY(H, P), qL8(H);
            let W = GF8(H);
            return await rD1(W), await oD1(W), J84(GF8(H)), K((Z) => ({
                ...Z,
                teamContext: {
                    teamName: H,
                    teamFilePath: X,
                    leadAgentId: j,
                    teammates: {
                        [j]: {
                            name: BY,
                            agentType: J,
                            color: Pl(j),
                            tmuxSessionName: "",
                            tmuxPaneId: "",
                            cwd: G1(),
                            spawnedAt: Date.now()
                        }
                    }
                }
            })), d("tengu_team_created", {
                team_name: H,
                teammate_count: 1,
                lead_agent_type: J,
                teammate_mode: Tu8()
            }), {
                data: {
                    team_name: H,
                    team_file_path: X,
                    lead_agent_id: j
                }
            }
        },
        renderToolUseMessage: I7q,
        renderToolUseProgressMessage: b7q,
        renderToolUseRejectedMessage: x7q,
        renderToolUseErrorMessage: u7q,
        renderToolResultMessage: m7q
    }
})
// @from(Ln 368640, Col 0)
function Q7q() {
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
// @from(Ln 368657, Col 0)
function U7q(A) {
    return "cleanup team: current"
}
// @from(Ln 368661, Col 0)
function d7q() {
    return null
}
// @from(Ln 368665, Col 0)
function c7q() {
    return TF8.default.createElement(T3, null)
}
// @from(Ln 368669, Col 0)
function l7q(A, {
    verbose: q
}) {
    return TF8.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 368678, Col 0)
function i7q(A, q, {
    verbose: K
}) {
    let Y = typeof A === "string" ? i1(A) : A;
    if ("success" in Y && "team_name" in Y && "message" in Y) return null;
    return null
}
// @from(Ln 368685, Col 4)
TF8
// @from(Ln 368686, Col 4)
n7q = E(() => {
    gj();
    kO();
    g1();
    TF8 = t(P6(), 1)
})
// @from(Ln 368692, Col 4)
r7q = {}
// @from(Ln 368696, Col 4)
obY
// @from(Ln 368696, Col 9)
abY
// @from(Ln 368697, Col 4)
o7q = E(() => {
    K7();
    Kl6();
    vf();
    g1();
    Qz();
    V1();
    Bw();
    n7q();
    obY = F6(() => C.strictObject({})), abY = {
        name: l36,
        searchHint: "disband a swarm team and clean up",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return obY()
        },
        isEnabled() {
            return E7()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return !1
        },
        toAutoClassifierInput() {
            return ""
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
            return Q7q()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: B6(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            let {
                setAppState: K,
                getAppState: Y
            } = q, _ = Y().teamContext?.teamName;
            if (_) {
                let w = e$(_);
                if (w) {
                    let $ = w.members.filter((H) => H.name !== BY).filter((H) => H.isActive !== !1);
                    if ($.length > 0) {
                        let H = $.map((j) => j.name).join(", ");
                        return {
                            data: {
                                success: !1,
                                message: `Cannot cleanup team with ${$.length} active member(s): ${H}. Use requestShutdown to gracefully terminate teammates first.`,
                                team_name: _
                            }
                        }
                    }
                }
                await CZ1(_), KL8(_), Qi4(), M84(), d("tengu_team_deleted", {
                    team_name: _
                })
            }
            return K((w) => ({
                ...w,
                teamContext: void 0,
                inbox: {
                    messages: []
                }
            })), {
                data: {
                    success: !0,
                    message: _ ? `Cleaned up directories and worktrees for team "${_}"` : "No team name found, nothing to clean up",
                    team_name: _
                }
            }
        },
        renderToolUseMessage: U7q,
        renderToolUseProgressMessage: d7q,
        renderToolUseRejectedMessage: c7q,
        renderToolUseErrorMessage: l7q,
        renderToolResultMessage: i7q
    }
})
// @from(Ln 368797, Col 0)
function s7q() {
    return `
# SendMessageTool

Send messages to agent teammates and handle protocol requests/responses in a team.

## Schema

Every call has three fields:

- **to**: The recipient address (string, required)
- **message**: The message content — either a plain string or a structured protocol object (required)
- **summary**: A 5-10 word preview shown in the UI

## Addressing (\`to\`)

There is one team per session. Addressing is by member name:

| Address | Meaning |
|---------|---------|
| \`"researcher"\` | Direct message to the teammate named "researcher" |
| \`"*"\` | Broadcast to all teammates (except yourself) |

Structured protocol messages (shutdown, plan approval) cannot be broadcast — they require a specific recipient name.

## Plain Text Messages

Send a message to a **single specific teammate**:

\`\`\`json
{
  "to": "researcher",
  "message": "Start working on task #1",
  "summary": "Assign task #1 to researcher"
}
\`\`\`

**IMPORTANT for teammates**: Your plain text output is NOT visible to the team lead or other teammates. To communicate with anyone on your team, you **MUST** use this tool. Just typing a response or acknowledgment in text is not enough.

## Broadcast to All Teammates (USE SPARINGLY)

Send the **same message to everyone** on the team at once:

\`\`\`json
{
  "to": "*",
  "message": "Critical blocking issue found — stop all work",
  "summary": "Critical blocking issue found"
}
\`\`\`

**WARNING: Broadcasting is expensive.** Each broadcast sends a separate message to every teammate. Costs scale linearly with team size.

**CRITICAL: Use broadcast only when absolutely necessary.** Valid use cases:
- Critical issues requiring immediate team-wide attention
- Major announcements that genuinely affect every teammate equally

**Default to direct messages.** Use a specific \`to\` name for responding to one teammate, normal back-and-forth, or anything that doesn't require everyone's attention.

## Structured Protocol Messages

### Shutdown Request

Ask a teammate to gracefully shut down:

\`\`\`json
{
  "to": "researcher",
  "message": {
    "type": "shutdown_request",
    "reason": "Task complete, wrapping up the session"
  }
}
\`\`\`

The teammate will receive a shutdown request and can either approve (exit) or reject (continue working).

### Shutdown Response

When you receive a shutdown request as a JSON message with \`type: "shutdown_request"\`, you **MUST** respond to approve or reject it. Do NOT just acknowledge in text — call this tool.

**Approve:**
\`\`\`json
{
  "to": "team-lead",
  "message": {
    "type": "shutdown_response",
    "request_id": "abc-123",
    "approve": true
  }
}
\`\`\`

Extract \`requestId\` from the incoming JSON and pass it as \`request_id\`. This sends confirmation to the leader and terminates your process.

**Reject:**
\`\`\`json
{
  "to": "team-lead",
  "message": {
    "type": "shutdown_response",
    "request_id": "abc-123",
    "approve": false,
    "reason": "Still working on task #3, need 5 more minutes"
  }
}
\`\`\`

### Plan Approval Response

When a teammate with \`plan_mode_required\` calls ExitPlanMode, they send you a plan approval request as a JSON message with \`type: "plan_approval_request"\`.

**Approve:**
\`\`\`json
{
  "to": "researcher",
  "message": {
    "type": "plan_approval_response",
    "request_id": "abc-123",
    "approve": true
  }
}
\`\`\`

After approval, the teammate will automatically exit plan mode and can proceed with implementation.

**Reject:**
\`\`\`json
{
  "to": "researcher",
  "message": {
    "type": "plan_approval_response",
    "request_id": "abc-123",
    "approve": false,
    "feedback": "Please add error handling for the API calls"
  }
}
\`\`\`

The teammate will receive the rejection with your feedback and can revise their plan.

## Important Notes

- Messages from teammates are automatically delivered to you. You do NOT need to manually check your inbox.
- When reporting on teammate messages, you do NOT need to quote the original message — it's already rendered to the user.
- **IMPORTANT**: Always refer to teammates by their NAME (e.g., "team-lead", "researcher"), never by UUID.
- Do NOT send structured JSON status messages. Use TaskUpdate to mark tasks completed and the system will automatically send idle notifications when you stop.
`.trim()
}
// @from(Ln 368946, Col 4)
a7q = "Send messages to agent teammates and handle protocol requests (shutdown, plan approval)"
// @from(Ln 368948, Col 0)
function t7q(A) {
    if (typeof A.message !== "object" || A.message === null) return null;
    if (A.message.type === "plan_approval_response") return A.message.approve ? `approve plan from: ${A.to}` : `reject plan from: ${A.to}`;
    return null
}
// @from(Ln 368954, Col 0)
function e7q() {
    return null
}
// @from(Ln 368958, Col 0)
function A4q() {
    return Di6.default.createElement(T3, null)
}
// @from(Ln 368962, Col 0)
function q4q(A, {
    verbose: q
}) {
    return Di6.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 368971, Col 0)
function K4q(A, q, {
    verbose: K
}) {
    let Y = typeof A === "string" ? i1(A) : A;
    if ("routing" in Y && Y.routing) return null;
    if ("request_id" in Y && "target" in Y) return null;
    return Di6.default.createElement(t1, null, Di6.default.createElement(T, {
        dimColor: !0
    }, Y.message))
}
// @from(Ln 368981, Col 4)
Di6
// @from(Ln 368982, Col 4)
Y4q = E(() => {
    i6();
    gj();
    kO();
    g1();
    iq();
    Di6 = t(P6(), 1)
})
// @from(Ln 368990, Col 4)
z4q = {}
// @from(Ln 368995, Col 0)
function ebY(A, q) {
    let K = A.teamContext?.teammates;
    if (!K) return;
    for (let Y of Object.values(K))
        if ("name" in Y && Y.name === q) return Y.color;
    return
}
// @from(Ln 369002, Col 0)
async function AxY(A, q, K, Y) {
    let z = Y.getAppState(),
        _ = l5(z.teamContext),
        w = i3() || ($Y() ? "teammate" : BY),
        O = H$();
    await x3(A, {
        from: w,
        text: q,
        summary: K,
        timestamp: new Date().toISOString(),
        color: O
    }, _);
    let $ = ebY(z, A);
    return {
        data: {
            success: !0,
            message: `Message sent to ${A}'s inbox`,
            routing: {
                sender: w,
                senderColor: O,
                target: `@${A}`,
                targetColor: $,
                summary: K,
                content: q
            }
        }
    }
}
// @from(Ln 369030, Col 0)
async function qxY(A, q, K) {
    let Y = K.getAppState(),
        z = l5(Y.teamContext);
    if (!z) throw Error("Not in a team context. Create a team with Teammate spawnTeam first, or set CLAUDE_CODE_TEAM_NAME.");
    let _ = await Kz6(z);
    if (!_) throw Error(`Team "${z}" does not exist`);
    let w = i3() || ($Y() ? "teammate" : BY);
    if (!w) throw Error("Cannot broadcast: sender name is required. Set CLAUDE_CODE_AGENT_NAME.");
    let O = H$(),
        $ = [];
    for (let H of _.members) {
        if (H.name.toLowerCase() === w.toLowerCase()) continue;
        $.push(H.name)
    }
    if ($.length === 0) return {
        data: {
            success: !0,
            message: "No teammates to broadcast to (you are the only team member)",
            recipients: []
        }
    };
    for (let H of $) await x3(H, {
        from: w,
        text: A,
        summary: q,
        timestamp: new Date().toISOString(),
        color: O
    }, z);
    return {
        data: {
            success: !0,
            message: `Message broadcast to ${$.length} teammate(s): ${$.join(", ")}`,
            recipients: $,
            routing: {
                sender: w,
                senderColor: O,
                target: "@team",
                summary: q,
                content: A
            }
        }
    }
}
// @from(Ln 369073, Col 0)
async function KxY(A, q, K) {
    let Y = K.getAppState(),
        z = l5(Y.teamContext),
        _ = i3() || BY,
        w = bZ6("shutdown", A),
        O = Wf6({
            requestId: w,
            from: _,
            reason: q
        });
    return await x3(A, {
        from: _,
        text: B6(O),
        timestamp: new Date().toISOString(),
        color: H$()
    }, z), {
        data: {
            success: !0,
            message: `Shutdown request sent to ${A}. Request ID: ${w}`,
            request_id: w,
            target: A
        }
    }
}
// @from(Ln 369097, Col 0)
async function YxY(A, q) {
    let K = l5(),
        Y = nM(),
        z = i3() || "teammate";
    k(`[SendMessageTool] handleShutdownApproval: teamName=${K}, agentId=${Y}, agentName=${z}`);
    let _, w;
    if (K) {
        let $ = await Kz6(K);
        if ($ && Y) {
            let H = $.members.find((j) => j.agentId === Y);
            if (H) _ = H.tmuxPaneId, w = H.backendType
        }
    }
    let O = Gx8({
        requestId: A,
        from: z,
        paneId: _,
        backendType: w
    });
    if (await x3(BY, {
            from: z,
            text: B6(O),
            timestamp: new Date().toISOString(),
            color: H$()
        }, K), w === "in-process") {
        if (k(`[SendMessageTool] In-process teammate ${z} approving shutdown - signaling abort`), Y) {
            let $ = q.getAppState(),
                H = _g(Y, $.tasks);
            if (H?.abortController) H.abortController.abort(), k(`[SendMessageTool] Aborted controller for in-process teammate ${z}`);
            else k(`[SendMessageTool] Warning: Could not find task/abortController for ${z}`)
        }
    } else {
        if (Y) {
            let $ = q.getAppState(),
                H = _g(Y, $.tasks);
            if (H?.abortController) return k(`[SendMessageTool] Fallback: Found in-process task for ${z} via AppState, aborting`), H.abortController.abort(), {
                data: {
                    success: !0,
                    message: `Shutdown approved (fallback path). Agent ${z} is now exiting.`,
                    request_id: A
                }
            }
        }
        setImmediate(async () => {
            await Vq(0, "other")
        })
    }
    return {
        data: {
            success: !0,
            message: `Shutdown approved. Sent confirmation to team-lead. Agent ${z} is now exiting.`,
            request_id: A
        }
    }
}
// @from(Ln 369152, Col 0)
async function zxY(A, q) {
    let K = l5(),
        Y = i3() || "teammate",
        z = fx8({
            requestId: A,
            from: Y,
            reason: q
        });
    return await x3(BY, {
        from: Y,
        text: B6(z),
        timestamp: new Date().toISOString(),
        color: H$()
    }, K), {
        data: {
            success: !0,
            message: `Shutdown rejected. Reason: "${q}". Continuing to work.`,
            request_id: A
        }
    }
}
// @from(Ln 369173, Col 0)
async function _xY(A, q, K) {
    let Y = K.getAppState(),
        z = Y.teamContext?.teamName;
    if (!KZ(Y.teamContext)) throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    let _ = Y.toolPermissionContext.mode,
        w = _ === "plan" ? "default" : _,
        O = {
            type: "plan_approval_response",
            requestId: q,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
    return await x3(A, {
        from: BY,
        text: B6(O),
        timestamp: new Date().toISOString()
    }, z), {
        data: {
            success: !0,
            message: `Plan approved for ${A}. They will receive the approval and can proceed with implementation.`,
            request_id: q
        }
    }
}
// @from(Ln 369198, Col 0)
async function wxY(A, q, K, Y) {
    let z = Y.getAppState(),
        _ = z.teamContext?.teamName;
    if (!KZ(z.teamContext)) throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    let w = {
        type: "plan_approval_response",
        requestId: q,
        approved: !1,
        feedback: K,
        timestamp: new Date().toISOString()
    };
    return await x3(A, {
        from: BY,
        text: B6(w),
        timestamp: new Date().toISOString()
    }, _), {
        data: {
            success: !0,
            message: `Plan rejected for ${A} with feedback: "${K}"`,
            request_id: q
        }
    }
}
// @from(Ln 369221, Col 4)
sbY
// @from(Ln 369221, Col 9)
tbY
// @from(Ln 369221, Col 14)
OxY
// @from(Ln 369222, Col 4)
_4q = E(() => {
    K7();
    dq6();
    Y4q();
    qH();
    zz();
    Su8();
    H1();
    Qz();
    c_();
    sk();
    Vb();
    Fc6();
    g1();
    sbY = F6(() => C.discriminatedUnion("type", [C.object({
        type: C.literal("shutdown_request"),
        reason: C.string().optional()
    }), C.object({
        type: C.literal("shutdown_response"),
        request_id: C.string(),
        approve: YX(),
        reason: C.string().optional()
    }), C.object({
        type: C.literal("plan_approval_response"),
        request_id: C.string(),
        approve: YX(),
        feedback: C.string().optional()
    })])), tbY = F6(() => C.object({
        to: C.string().describe('Recipient: teammate name, or "*" for broadcast to all teammates'),
        message: C.union([C.string().describe("Plain text message content"), sbY()]),
        summary: C.string().optional().describe("A 5-10 word summary shown as a preview in the UI (required when message is a string)")
    }));
    OxY = {
        name: hI,
        searchHint: "send messages to agent teammates (swarm protocol)",
        maxResultSizeChars: 1e5,
        userFacingName() {
            return "SendMessage"
        },
        get inputSchema() {
            return tbY()
        },
        shouldDefer: !0,
        isEnabled() {
            return E7()
        },
        isConcurrencySafe(A) {
            return !1
        },
        isReadOnly(A) {
            return typeof A.message === "string"
        },
        backfillObservableInput(A) {
            if ("type" in A) return;
            if (typeof A.to !== "string") return;
            if (A.to === "*") {
                if (A.type = "broadcast", typeof A.message === "string") A.content = A.message
            } else if (typeof A.message === "string") A.type = "message", A.recipient = A.to, A.content = A.message;
            else if (typeof A.message === "object" && A.message !== null) {
                let q = A.message;
                if (A.type = q.type, A.recipient = A.to, q.request_id !== void 0) A.request_id = q.request_id;
                if (q.approve !== void 0) A.approve = q.approve;
                let K = q.reason ?? q.feedback;
                if (K !== void 0) A.content = K
            }
        },
        toAutoClassifierInput(A) {
            if (typeof A.message === "string") return `to ${A.to}: ${A.message}`;
            switch (A.message.type) {
                case "shutdown_request":
                    return `shutdown_request to ${A.to}`;
                case "shutdown_response":
                    return `shutdown_response ${A.message.approve?"approve":"reject"} ${A.message.request_id}`;
                case "plan_approval_response":
                    return `plan_approval ${A.message.approve?"approve":"reject"} to ${A.to}`
            }
        },
        async checkPermissions(A, q) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async validateInput(A, q) {
            if (A.to.trim().length === 0) return {
                result: !1,
                message: "to must not be empty",
                errorCode: 9
            };
            if (A.to.includes("@")) return {
                result: !1,
                message: 'to must be a bare teammate name or "*" — there is only one team per session',
                errorCode: 9
            };
            if (typeof A.message === "string") {
                if (!A.summary || A.summary.trim().length === 0) return {
                    result: !1,
                    message: "summary is required when message is a string",
                    errorCode: 9
                };
                return {
                    result: !0
                }
            }
            if (A.to === "*") return {
                result: !1,
                message: 'structured messages cannot be broadcast (to: "*")',
                errorCode: 9
            };
            if (A.message.type === "shutdown_response" && A.to !== BY) return {
                result: !1,
                message: `shutdown_response must be sent to "${BY}"`,
                errorCode: 9
            };
            if (A.message.type === "shutdown_response" && !A.message.approve && (!A.message.reason || A.message.reason.trim().length === 0)) return {
                result: !1,
                message: "reason is required when rejecting a shutdown request",
                errorCode: 9
            };
            return {
                result: !0
            }
        },
        async description() {
            return a7q
        },
        async prompt() {
            return s7q()
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: B6(A, null, 2)
                }]
            }
        },
        async call(A, q) {
            if (typeof A.message === "string" && A.to !== "*") {
                let K = q.getAppState(),
                    Y = K.agentNameRegistry.get(A.to),
                    z = Y ?? ZY4(A.to);
                if (z) {
                    let _ = K.tasks[z];
                    if (Sf(_) && !Ef6(_)) {
                        if (_.status !== "running") return {
                            data: {
                                success: !1,
                                message: `Agent "${A.to}" is not running (status: ${_.status}). Use Agent({resume: "${z}"}) to continue it.`
                            }
                        };
                        return NV1(z, A.message, q.setAppStateForTasks ?? q.setAppState), {
                            data: {
                                success: !0,
                                message: `Message queued for delivery to ${A.to} at its next tool round.`
                            }
                        }
                    }
                    if (Y) return {
                        data: {
                            success: !1,
                            message: `No running local agent found for "${A.to}". Use Agent({resume: "${z}"}) to start it.`
                        }
                    }
                }
            }
            if (typeof A.message === "string") {
                if (A.to === "*") return qxY(A.message, A.summary, q);
                return AxY(A.to, A.message, A.summary, q)
            }
            if (A.to === "*") throw Error("structured messages cannot be broadcast");
            switch (A.message.type) {
                case "shutdown_request":
                    return KxY(A.to, A.message.reason, q);
                case "shutdown_response":
                    if (A.message.approve) return YxY(A.message.request_id, q);
                    return zxY(A.message.request_id, A.message.reason);
                case "plan_approval_response":
                    if (A.message.approve) return _xY(A.to, A.message.request_id, q);
                    return wxY(A.to, A.message.request_id, A.message.feedback ?? "Plan needs revision", q)
            }
        },
        renderToolUseMessage: t7q,
        renderToolUseProgressMessage: e7q,
        renderToolUseRejectedMessage: A4q,
        renderToolUseErrorMessage: q4q,
        renderToolResultMessage: K4q
    }
})
// @from(Ln 369414, Col 0)
function Z4q(A) {
    let q = A.toLowerCase();
    if (!MxY.includes(q)) return null;
    return q
}
// @from(Ln 369420, Col 0)
function vF8() {
    let A = ng(),
        q = A.map((K) => K.isEnabled());
    return A.filter((K, Y) => q[Y]).map((K) => K.name)
}
// @from(Ln 369426, Col 0)
function ng() {
    return [QW6, ck1, J4, ...n$() ? [] : [rg, bb], zD, L9, pX, xX, Vl, BX, xv, lk1, Uk1, kT6, m66, Ki6, ...r$() ? [TAq, hAq, gAq, rAq] : [], ...J4q ? [J4q] : [], ...M4q ? [M4q] : [], ...D4q ? [D4q] : [], wF8, ...ST6() ? [g8q, o8q] : [], ...E7() ? [HxY(), jxY(), JxY()] : [], ...j4q ? [j4q] : [], ...P4q ? [P4q] : [], ...w4q ? [w4q] : [], ...$xY, ...O4q ? [O4q] : [], ...$4q ? [$4q] : [], ...H4q ? [H4q] : [], ...W4q?.() ? [W4q()] : [], ...X4q ? [X4q] : [], Ll, hl, ...OE1 ? [OE1] : [], ...$E1 ? [$E1] : [], ...HE1 ? [HE1] : [], ...jE1 ? [jE1] : [], ...dk() ? [Tp6] : []]
}
// @from(Ln 369430, Col 0)
function BT6(A, q) {
    let K = KF(q);
    return A.filter((Y) => {
        let z = LC6(Y);
        return !K.some((_) => _.ruleValue.toolName === z && _.ruleValue.ruleContent === void 0)
    })
}
// @from(Ln 369438, Col 0)
function u66(A, q) {
    let K = FX(A);
    if (t6(process.env.CLAUDE_CODE_SIMPLE)) return K;
    let Y = BT6(q, A);
    return K0([...K, ...Y], "name")
}
// @from(Ln 369444, Col 4)
w4q = null
// @from(Ln 369445, Col 4)
$xY
// @from(Ln 369445, Col 9)
O4q = null
// @from(Ln 369446, Col 4)
$4q
// @from(Ln 369446, Col 9)
H4q = null
// @from(Ln 369447, Col 4)
HxY = () => (p7q(), k4(F7q)).TeamCreateTool
// @from(Ln 369448, Col 4)
jxY = () => (o7q(), k4(r7q)).TeamDeleteTool
// @from(Ln 369449, Col 4)
JxY = () => (_4q(), k4(z4q)).SendMessageTool
// @from(Ln 369450, Col 4)
j4q = null
// @from(Ln 369451, Col 4)
J4q = null
// @from(Ln 369452, Col 4)
M4q = null
// @from(Ln 369453, Col 4)
D4q = null
// @from(Ln 369454, Col 4)
OE1 = null
// @from(Ln 369455, Col 4)
$E1 = null
// @from(Ln 369456, Col 4)
HE1 = null
// @from(Ln 369457, Col 4)
jE1 = null
// @from(Ln 369458, Col 4)
X4q = null
// @from(Ln 369459, Col 4)
P4q = null
// @from(Ln 369460, Col 4)
W4q = null
// @from(Ln 369461, Col 4)
MxY
// @from(Ln 369461, Col 9)
FX = (A) => {
        if (t6(process.env.CLAUDE_CODE_SIMPLE)) return BT6([J4, L9, pX], A);
        let q = new Set([Ll.name, hl.name, ...OE1 ? [OE1.name] : [], ...$E1 ? [$E1.name] : [], ...HE1 ? [HE1.name] : [], ...jE1 ? [jE1.name] : [], oM]),
            K = ng().filter((_) => !q.has(_.name)),
            Y = BT6(K, A);
        if (t6(process.env.CLAUDE_REPL_MODE)) {
            if (Y.some((w) => z3(w, A01))) Y = Y.filter((w) => !GY4.has(w.name))
        }
        let z = Y.map((_) => _.isEnabled());
        return Y.filter((_, w) => z[w])
    }
// @from(Ln 369472, Col 4)
IX = E(() => {
    S01();
    EV1();
    OZ();
    Sz6();
    RI();
    c66();
    Ll6();
    Rl6();
    vT6();
    dg8();
    ng8();
    og8();
    R06();
    tl6();
    L1q();
    KT6();
    nk1();
    Y8q();
    sk1();
    tk1();
    pP1();
    OF8();
    F8q();
    a8q();
    JAq();
    vAq();
    SAq();
    FAq();
    oAq();
    dd();
    fR();
    Bw();
    BB();
    kp6();
    Bj();
    sy();
    XI();
    A8();
    Qz();
    uV8();
    $xY = [(M7q(), k4(J7q)).CronCreateTool, (X7q(), k4(D7q)).CronDeleteTool, (W7q(), k4(P7q)).CronListTool], $4q = (qF(), k4(xl)).BriefTool, MxY = ["default"]
})
// @from(Ln 369516, Col 0)
function f4q() {
    NF8(), ul = setInterval(() => {
        if (U1("debug", "session_keepalive_heartbeat", {
                refcount: Cz6
            }), t6(process.env.CLAUDE_CODE_REMOTE_SEND_KEEPALIVES)) Iz6?.()
    }, G4q)
}
// @from(Ln 369524, Col 0)
function DxY() {
    if (NF8(), Iz6 === null) return;
    Xi6 = setTimeout(() => {
        U1("info", "session_idle_30s"), Xi6 = null
    }, G4q)
}
// @from(Ln 369531, Col 0)
function NF8() {
    if (Xi6 !== null) clearTimeout(Xi6), Xi6 = null
}
// @from(Ln 369535, Col 0)
function JE1(A) {
    if (Iz6 = A, Cz6 > 0 && ul === null) f4q()
}
// @from(Ln 369539, Col 0)
function gT6() {
    if (Iz6 = null, ul !== null) clearInterval(ul), ul = null;
    NF8()
}
// @from(Ln 369544, Col 0)
function T4q() {
    if (t6(process.env.CLAUDE_CODE_REMOTE_SEND_KEEPALIVES)) Iz6?.()
}
// @from(Ln 369548, Col 0)
function v4q() {
    return Iz6 !== null
}
// @from(Ln 369552, Col 0)
function ME1() {
    if (Cz6++, Cz6 === 1 && Iz6 !== null && ul === null) f4q()
}
// @from(Ln 369556, Col 0)
function DE1() {
    if (Cz6 > 0) Cz6--;
    if (Cz6 === 0 && ul !== null) clearInterval(ul), ul = null, DxY()
}
// @from(Ln 369560, Col 4)
G4q = 30000
// @from(Ln 369561, Col 4)
Iz6 = null
// @from(Ln 369562, Col 4)
Cz6 = 0
// @from(Ln 369563, Col 4)
ul = null
// @from(Ln 369564, Col 4)
Xi6 = null
// @from(Ln 369565, Col 4)
FT6 = E(() => {
    u_();
    A8()
})
// @from(Ln 369569, Col 4)
Pi6
// @from(Ln 369570, Col 4)
VF8 = E(() => {
    Pi6 = class Pi6 {
        returned;
        queue = [];
        readResolve;
        readReject;
        isDone = !1;
        hasError;
        started = !1;
        constructor(A) {
            this.returned = A
        } [Symbol.asyncIterator]() {
            if (this.started) throw Error("Stream can only be iterated once");
            return this.started = !0, this
        }
        next() {
            if (this.queue.length > 0) return Promise.resolve({
                done: !1,
                value: this.queue.shift()
            });
            if (this.isDone) return Promise.resolve({
                done: !0,
                value: void 0
            });
            if (this.hasError) return Promise.reject(this.hasError);
            return new Promise((A, q) => {
                this.readResolve = A, this.readReject = q
            })
        }
        enqueue(A) {
            if (this.readResolve) {
                let q = this.readResolve;
                this.readResolve = void 0, this.readReject = void 0, q({
                    done: !1,
                    value: A
                })
            } else this.queue.push(A)
        }
        done() {
            if (this.isDone = !0, this.readResolve) {
                let A = this.readResolve;
                this.readResolve = void 0, this.readReject = void 0, A({
                    done: !0,
                    value: void 0
                })
            }
        }
        error(A) {
            if (this.hasError = A, this.readReject) {
                let q = this.readReject;
                this.readResolve = void 0, this.readReject = void 0, q(A)
            }
        }
        return () {
            if (this.isDone = !0, this.returned) this.returned();
            return Promise.resolve({
                done: !0,
                value: void 0
            })
        }
    }
})
// @from(Ln 369633, Col 0)
function pT6(A) {
    if (A instanceof oY) return A.message || P0;
    if (!(A instanceof Error)) return String(A);
    let K = kF8(A).filter(Boolean).join(`
`).trim() || "Command failed with no output";
    if (K.length <= 1e4) return K;
    let Y = 5000,
        z = K.slice(0, Y),
        _ = K.slice(-Y);
    return `${z}

... [${K.length-1e4} characters truncated] ...

${_}`
}
// @from(Ln 369649, Col 0)
function kF8(A) {
    if (A instanceof uS) return [`Exit code ${A.code}`, A.interrupted ? P0 : "", A.stderr, A.stdout];
    let q = [A.message];
    if ("stderr" in A && typeof A.stderr === "string") q.push(A.stderr);
    if ("stdout" in A && typeof A.stdout === "string") q.push(A.stdout);
    return q
}
// @from(Ln 369657, Col 0)
function N4q(A) {
    if (A.length === 0) return "";
    return A.reduce((q, K, Y) => {
        let z = String(K);
        if (typeof K === "number") return `${String(q)}[${z}]`;
        return Y === 0 ? z : `${String(q)}.${z}`
    }, "")
}
// @from(Ln 369666, Col 0)
function V4q(A, q) {
    let K = q.issues.filter((O) => O.code === "invalid_type" && O.message.includes("received undefined")).map((O) => N4q(O.path)),
        Y = q.issues.filter((O) => O.code === "unrecognized_keys").flatMap((O) => O.keys),
        z = q.issues.filter((O) => O.code === "invalid_type" && !O.message.includes("received undefined")).map((O) => {
            let $ = O,
                H = O.message.match(/received (\w+)/),
                j = H ? H[1] : "unknown";
            return {
                param: N4q(O.path),
                expected: $.expected,
                received: j
            }
        }),
        _ = q.message,
        w = [];
    if (K.length > 0) {
        let O = K.map(($) => `The required parameter \`${$}\` is missing`);
        w.push(...O)
    }
    if (Y.length > 0) {
        let O = Y.map(($) => `An unexpected parameter \`${$}\` was provided`);
        w.push(...O)
    }
    if (z.length > 0) {
        let O = z.map(({
            param: $,
            expected: H,
            received: j
        }) => `The parameter \`${$}\` type is expected as \`${H}\` but provided as \`${j}\``);
        w.push(...O)
    }
    if (w.length > 0) _ = `${A} failed due to the following ${w.length>1?"issues":"issue"}:
${w.join(`
`)}`;
    return _
}
// @from(Ln 369702, Col 4)
XE1 = E(() => {
    s8();
    JA()
})
// @from(Ln 369707, Col 0)
function EF8(A) {
    switch (A) {
        case "allow":
            return "allowed";
        case "deny":
            return "denied";
        default:
            return "asked for confirmation for"
    }
}
// @from(Ln 369717, Col 0)
async function* k4q(A, q, K, Y, z, _, w, O, $) {
    let H = Date.now();
    try {
        let J = A.getAppState().toolPermissionContext.mode,
            M = _;
        for await (let D of RF8(q.name, K, z, M, A, J, A.abortController.signal)) try {
            if (D.message?.type === "attachment" && D.message.attachment.type === "hook_cancelled") {
                d("tengu_post_tool_hooks_cancelled", {
                    toolName: hq(q.name),
                    queryChainId: A.queryTracking?.chainId,
                    queryDepth: A.queryTracking?.depth
                }), yield {
                    message: f4({
                        type: "hook_cancelled",
                        hookName: `PostToolUse:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUse"
                    })
                };
                continue
            }
            if (D.message && !(D.message.type === "attachment" && D.message.attachment.type === "hook_blocking_error")) yield {
                message: D.message
            };
            if (D.blockingError) yield {
                message: f4({
                    type: "hook_blocking_error",
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse",
                    blockingError: D.blockingError
                })
            };
            if (D.preventContinuation) {
                yield {
                    message: f4({
                        type: "hook_stopped_continuation",
                        message: D.stopReason || "Execution stopped by PostToolUse hook",
                        hookName: `PostToolUse:${q.name}`,
                        toolUseID: K,
                        hookEvent: "PostToolUse"
                    })
                };
                return
            }
            if (D.additionalContexts && D.additionalContexts.length > 0) yield {
                message: f4({
                    type: "hook_additional_context",
                    content: D.additionalContexts,
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse"
                })
            };
            if (D.updatedMCPToolOutput && rk(q)) M = D.updatedMCPToolOutput, yield {
                updatedMCPToolOutput: M
            }
        } catch (X) {
            let P = Date.now() - H;
            d("tengu_post_tool_hook_error", {
                messageID: Y,
                toolName: hq(q.name),
                isMcp: q.isMcp ?? !1,
                duration: P,
                queryChainId: A.queryTracking?.chainId,
                queryDepth: A.queryTracking?.depth,
                ...O ? {
                    mcpServerType: O
                } : {},
                ...w ? {
                    requestId: w
                } : {}
            }), yield {
                message: f4({
                    type: "hook_error_during_execution",
                    content: pT6(X),
                    hookName: `PostToolUse:${q.name}`,
                    toolUseID: K,
                    hookEvent: "PostToolUse"
                })
            }
        }
    } catch (j) {
        _6(j)
    }
}