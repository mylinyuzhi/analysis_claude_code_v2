
// @from(Ln 391626, Col 0)
function ZHY(q, K, _) {
    let z = _?.silenceDetection !== !1,
        Y = ["-q", "--buffer", "1024", "-t", "raw", "-r", String(x37), "-e", "signed", "-b", "16", "-c", String(u37), "-"];
    if (z) Y.push("silence", "1", "0.1", KTK, "1", HHY, KTK);
    let A = I37("rec", Y, {
        stdio: ["pipe", "pipe", "pipe"]
    });
    return Ge = A, A.stdout?.on("data", (O) => {
        q(O)
    }), A.stderr?.on("data", () => {}), A.on("close", () => {
        Ge = null, K()
    }), A.on("error", (O) => {
        j6(O), Ge = null, K()
    }), !0
}
// @from(Ln 391642, Col 0)
function fHY(q, K) {
    let _ = ["-f", "S16_LE", "-r", String(x37), "-c", String(u37), "-t", "raw", "-q", "-"],
        z = I37("arecord", _, {
            stdio: ["pipe", "pipe", "pipe"]
        });
    return Ge = z, z.stdout?.on("data", (Y) => {
        q(Y)
    }), z.stderr?.on("data", () => {}), z.on("close", () => {
        Ge = null, K()
    }), z.on("error", (Y) => {
        j6(Y), Ge = null, K()
    }), !0
}
// @from(Ln 391656, Col 0)
function ATK() {
    if (jI6 && S37) {
        S37.stopNativeRecording(), jI6 = !1;
        return
    }
    if (Ge) Ge.kill("SIGTERM"), Ge = null
}
// @from(Ln 391663, Col 4)
S37 = null
// @from(Ln 391664, Col 4)
qTK = null
// @from(Ln 391665, Col 4)
x37 = 16000
// @from(Ln 391666, Col 4)
u37 = 1
// @from(Ln 391667, Col 4)
HHY = "2.0"
// @from(Ln 391668, Col 4)
KTK = "3%"
// @from(Ln 391669, Col 4)
C37 = null
// @from(Ln 391670, Col 4)
b37 = null
// @from(Ln 391671, Col 4)
Ge = null
// @from(Ln 391672, Col 4)
jI6 = !1
// @from(Ln 391673, Col 4)
JI6 = L(() => {
    K8();
    Q8();
    U8();
    NK()
})
// @from(Ln 391680, Col 0)
function OTK(q, K) {
    if (q === "global") {
        let Y = H8(),
            A = K[0];
        if (!A) return;
        return Y[A]
    }
    let z = v7();
    for (let Y of K)
        if (z && typeof z === "object" && Y in z) z = z[Y];
        else return;
    return z
}
// @from(Ln 391694, Col 0)
function wTK(q, K) {
    if (q.length === 0) return {};
    let _ = q[0];
    if (q.length === 1) return {
        [_]: K
    };
    return {
        [_]: wTK(q.slice(1), K)
    }
}
// @from(Ln 391704, Col 4)
vHY
// @from(Ln 391704, Col 9)
THY
// @from(Ln 391704, Col 14)
R8$
// @from(Ln 391705, Col 4)
$TK = L(() => {
    p7();
    C8();
    gq();
    h1();
    m8();
    U8();
    a1();
    e8();
    lvK();
    y37();
    ovK();
    vHY = C6(() => y.strictObject({
        setting: y.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
        value: y.union([y.string(), y.boolean(), y.number()]).optional().describe("The new value. Omit to get current value.")
    })), THY = C6(() => y.object({
        success: y.boolean(),
        operation: y.enum(["get", "set"]).optional(),
        setting: y.string().optional(),
        value: y.unknown().optional(),
        previousValue: y.unknown().optional(),
        newValue: y.unknown().optional(),
        error: y.string().optional()
    })), R8$ = Iq({
        name: hvK,
        searchHint: "get or set Claude Code settings (theme, model)",
        maxResultSizeChars: 1e5,
        async description() {
            return dvK
        },
        async prompt() {
            return cvK()
        },
        get inputSchema() {
            return vHY()
        },
        get outputSchema() {
            return THY()
        },
        userFacingName() {
            return "Config"
        },
        shouldDefer: !0,
        isConcurrencySafe() {
            return !0
        },
        isReadOnly(q) {
            return q.value === void 0
        },
        toAutoClassifierInput(q) {
            return q.value === void 0 ? q.setting : `${q.setting} = ${q.value}`
        },
        async checkPermissions(q) {
            if (q.value === void 0) return {
                behavior: "allow",
                updatedInput: q
            };
            return {
                behavior: "ask",
                message: `Set ${q.setting} to ${I6(q.value)}`
            }
        },
        renderToolUseMessage: nvK,
        renderToolResultMessage: ivK,
        renderToolUseRejectedMessage: rvK,
        async call({
            setting: q,
            value: K
        }, _) {
            if (q === "voiceEnabled") {
                let {
                    isVoiceGrowthBookEnabled: $
                } = await Promise.resolve().then(() => (__6(), N37));
                if (!$()) return {
                    data: {
                        success: !1,
                        error: `Unknown setting: "${q}"`
                    }
                }
            }
            if (!gvK(q)) return {
                data: {
                    success: !1,
                    error: `Unknown setting: "${q}"`
                }
            };
            let z = UvK(q),
                Y = QvK(q);
            if (K === void 0) {
                let $ = OTK(z.source, Y),
                    j = z.formatOnRead ? z.formatOnRead($) : $;
                return {
                    data: {
                        success: !0,
                        operation: "get",
                        setting: q,
                        value: j
                    }
                }
            }
            if (q === "remoteControlAtStartup" && typeof K === "string" && K.toLowerCase().trim() === "default") {
                d8((j) => {
                    if (j.remoteControlAtStartup === void 0) return j;
                    let H = {
                        ...j
                    };
                    return delete H.remoteControlAtStartup, H
                });
                let $ = zd();
                return _.setAppState((j) => {
                    if (j.replBridgeEnabled === $ && !j.replBridgeOutboundOnly) return j;
                    return {
                        ...j,
                        replBridgeEnabled: $,
                        replBridgeOutboundOnly: !1
                    }
                }), {
                    data: {
                        success: !0,
                        operation: "set",
                        setting: q,
                        value: $
                    }
                }
            }
            let A = K;
            if (z.type === "boolean") {
                if (typeof K === "string") {
                    let $ = K.toLowerCase().trim();
                    if ($ === "true") A = !0;
                    else if ($ === "false") A = !1
                }
                if (typeof A !== "boolean") return {
                    data: {
                        success: !1,
                        operation: "set",
                        setting: q,
                        error: `${q} requires true or false.`
                    }
                }
            }
            let O = Nd8(q);
            if (O && !O.includes(String(A))) return {
                data: {
                    success: !1,
                    operation: "set",
                    setting: q,
                    error: `Invalid value "${K}". Options: ${O.join(", ")}`
                }
            };
            if (z.validateOnWrite) {
                let $ = await z.validateOnWrite(A);
                if (!$.valid) return {
                    data: {
                        success: !1,
                        operation: "set",
                        setting: q,
                        error: $.error
                    }
                }
            }
            if (q === "voiceEnabled" && A === !0) {
                let {
                    isVoiceModeEnabled: $
                } = await Promise.resolve().then(() => (__6(), N37));
                if (!$()) {
                    let {
                        isAnthropicAuthEnabled: W
                    } = await Promise.resolve().then(() => (T7(), zR));
                    return {
                        data: {
                            success: !1,
                            error: !W() ? "Voice mode requires a Claude.ai account. Please run /login to sign in." : "Voice mode is not available."
                        }
                    }
                }
                let {
                    isVoiceStreamAvailable: j
                } = await Promise.resolve().then(() => (yd8(), R37)), {
                    checkRecordingAvailability: H,
                    checkVoiceDependencies: J,
                    requestMicrophonePermission: X
                } = await Promise.resolve().then(() => (JI6(), HI6)), M = await H();
                if (!M.available) return {
                    data: {
                        success: !1,
                        error: M.reason ?? "Voice mode is not available in this environment."
                    }
                };
                if (!j()) return {
                    data: {
                        success: !1,
                        error: "Voice mode requires a Claude.ai account. Please run /login to sign in."
                    }
                };
                let P = await J();
                if (!P.available) return {
                    data: {
                        success: !1,
                        error: "No audio recording tool found." + (P.installCommand ? ` Run: ${P.installCommand}` : "")
                    }
                };
                if (!await X()) {
                    let W;
                    if (process.platform === "win32") W = "Settings → Privacy → Microphone";
                    else if (process.platform === "linux") W = "your system's audio settings";
                    else W = "System Settings → Privacy & Security → Microphone";
                    return {
                        data: {
                            success: !1,
                            error: `Microphone access is denied. To enable it, go to ${W}, then try again.`
                        }
                    }
                }
            }
            let w = OTK(z.source, Y);
            try {
                if (z.source === "global") {
                    let $ = Y[0];
                    if (!$) return {
                        data: {
                            success: !1,
                            operation: "set",
                            setting: q,
                            error: "Invalid setting path"
                        }
                    };
                    d8((j) => {
                        if (j[$] === A) return j;
                        return {
                            ...j,
                            [$]: A
                        }
                    })
                } else {
                    let $ = wTK(Y, A),
                        j = P7("userSettings", $);
                    if (j.error) return {
                        data: {
                            success: !1,
                            operation: "set",
                            setting: q,
                            error: j.error.message
                        }
                    }
                }
                if (z.appStateKey) {
                    let $ = z.appStateKey;
                    _.setAppState((j) => {
                        if (j[$] === A) return j;
                        return {
                            ...j,
                            [$]: A
                        }
                    })
                }
                if (q === "remoteControlAtStartup") {
                    let $ = zd();
                    _.setAppState((j) => {
                        if (j.replBridgeEnabled === $ && !j.replBridgeOutboundOnly) return j;
                        return {
                            ...j,
                            replBridgeEnabled: $,
                            replBridgeOutboundOnly: !1
                        }
                    })
                }
                return d("tengu_config_tool_changed", {
                    setting: q,
                    value: String(A)
                }), {
                    data: {
                        success: !0,
                        operation: "set",
                        setting: q,
                        previousValue: w,
                        newValue: A
                    }
                }
            } catch ($) {
                return j6($), {
                    data: {
                        success: !1,
                        operation: "set",
                        setting: q,
                        error: b6($)
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            if (q.success) {
                if (q.operation === "get") return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: `${q.setting} = ${I6(q.value)}`
                };
                return {
                    tool_use_id: K,
                    type: "tool_result",
                    content: `Set ${q.setting} to ${I6(q.newValue)}`
                }
            }
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `Error: ${q.error}`,
                is_error: !0
            }
        }
    })
})
// @from(Ln 392018, Col 0)
function HTK() {
    let q = z4() ? " and potentially assigned to teammates" : "",
        K = z4() ? "- Include enough detail in the description for another agent to understand and complete the task\n- New tasks are created with status 'pending' and no owner - use TaskUpdate with the `owner` parameter to assign them\n" : "";
    return `Use this tool to create a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool

Use this tool proactively in these scenarios:

- Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
- Non-trivial and complex tasks - Tasks that require careful planning or multiple operations${q}
- Plan mode - When using plan mode, create a task list to track the work
- User explicitly requests todo list - When the user directly asks you to use the todo list
- User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
- After receiving new instructions - Immediately capture user requirements as tasks
- When you start working on a task - Mark it as in_progress BEFORE beginning work
- After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
- There is only a single, straightforward task
- The task is trivial and tracking it provides no organizational benefit
- The task can be completed in less than 3 trivial steps
- The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Task Fields

- **subject**: A brief, actionable title in imperative form (e.g., "Fix authentication bug in login flow")
- **description**: What needs to be done
- **activeForm** (optional): Present continuous form shown in the spinner when the task is in_progress (e.g., "Fixing authentication bug"). If omitted, the spinner shows the subject instead.

All tasks are created with status \`pending\`.

## Tips

- Create tasks with clear, specific subjects that describe the outcome
- After creating tasks, use TaskUpdate to set up dependencies (blocks/blockedBy) if needed
${K}- Check TaskList first to avoid creating duplicate tasks
`
}
// @from(Ln 392062, Col 4)
jTK = "Create a new task in the task list"
// @from(Ln 392063, Col 4)
JTK = L(() => {
    fO()
})
// @from(Ln 392066, Col 4)
VHY
// @from(Ln 392066, Col 9)
kHY
// @from(Ln 392066, Col 14)
XTK
// @from(Ln 392067, Col 4)
MTK = L(() => {
    p7();
    gq();
    K9();
    PX();
    zY();
    JTK();
    VHY = C6(() => y.strictObject({
        subject: y.string().describe("A brief title for the task"),
        description: y.string().describe("What needs to be done"),
        activeForm: y.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
        metadata: y.record(y.string(), y.unknown()).optional().describe("Arbitrary metadata to attach to the task")
    })), kHY = C6(() => y.object({
        task: y.object({
            id: y.string(),
            subject: y.string()
        })
    })), XTK = Iq({
        name: YT,
        searchHint: "create a task in the task list",
        maxResultSizeChars: 1e5,
        async description() {
            return jTK
        },
        async prompt() {
            return HTK()
        },
        get inputSchema() {
            return VHY()
        },
        get outputSchema() {
            return kHY()
        },
        userFacingName() {
            return "TaskCreate"
        },
        shouldDefer: !0,
        isEnabled() {
            return kJ()
        },
        isConcurrencySafe() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.subject
        },
        renderToolUseMessage() {
            return null
        },
        async call({
            subject: q,
            description: K,
            activeForm: _,
            metadata: z
        }, Y) {
            let A = await $R4(AT(), {
                    subject: q,
                    description: K,
                    activeForm: _,
                    status: "pending",
                    owner: void 0,
                    blocks: [],
                    blockedBy: [],
                    metadata: z
                }),
                O = [],
                w = e58(A, q, K, T_(), Z9(), void 0, Y?.abortController?.signal, void 0, Y);
            for await (let $ of w) if ($.blockingError) O.push(m37($.blockingError));
            if (O.length > 0) throw await ub8(AT(), A), Error(O.join(`
`));
            return Y.setAppState(($) => {
                if ($.expandedView === "tasks") return $;
                return {
                    ...$,
                    expandedView: "tasks"
                }
            }), {
                data: {
                    task: {
                        id: A,
                        subject: q
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                task: _
            } = q;
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `Task #${_.id} created successfully: ${_.subject}`
            }
        }
    })
})
// @from(Ln 392164, Col 4)
PTK = "Get a task by ID from the task list"
// @from(Ln 392165, Col 4)
WTK = `Use this tool to retrieve a task by its ID from the task list.

## When to Use This Tool

- When you need the full description and context before starting work on a task
- To understand task dependencies (what it blocks, what blocks it)
- After being assigned a task, to get complete requirements

## Output

Returns full task details:
- **subject**: Task title
- **description**: Detailed requirements and context
- **status**: 'pending', 'in_progress', or 'completed'
- **blocks**: Tasks waiting on this one to complete
- **blockedBy**: Tasks that must complete before this one can start

## Tips

- After fetching a task, verify its blockedBy list is empty before beginning work.
- Use TaskList to see all tasks in summary form.
`
// @from(Ln 392187, Col 4)
NHY
// @from(Ln 392187, Col 9)
EHY
// @from(Ln 392187, Col 14)
DTK
// @from(Ln 392188, Col 4)
ZTK = L(() => {
    p7();
    gq();
    PX();
    NHY = C6(() => y.strictObject({
        taskId: y.string().describe("The ID of the task to retrieve")
    })), EHY = C6(() => y.object({
        task: y.object({
            id: y.string(),
            subject: y.string(),
            description: y.string(),
            status: FH6(),
            blocks: y.array(y.string()),
            blockedBy: y.array(y.string())
        }).nullable()
    })), DTK = Iq({
        name: Sc,
        searchHint: "retrieve a task by ID",
        maxResultSizeChars: 1e5,
        async description() {
            return PTK
        },
        async prompt() {
            return WTK
        },
        get inputSchema() {
            return NHY()
        },
        get outputSchema() {
            return EHY()
        },
        userFacingName() {
            return "TaskGet"
        },
        shouldDefer: !0,
        isEnabled() {
            return kJ()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.taskId
        },
        renderToolUseMessage() {
            return null
        },
        async call({
            taskId: q
        }) {
            let K = AT(),
                _ = await Fp(K, q);
            if (!_) return {
                data: {
                    task: null
                }
            };
            return {
                data: {
                    task: {
                        id: _.id,
                        subject: _.subject,
                        description: _.description,
                        status: _.status,
                        blocks: _.blocks,
                        blockedBy: _.blockedBy
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                task: _
            } = q;
            if (!_) return {
                tool_use_id: K,
                type: "tool_result",
                content: "Task not found"
            };
            let z = [`Task #${_.id}: ${_.subject}`, `Status: ${_.status}`, `Description: ${_.description}`];
            if (_.blockedBy.length > 0) z.push(`Blocked by: ${_.blockedBy.map((Y)=>`#${Y}`).join(", ")}`);
            if (_.blocks.length > 0) z.push(`Blocks: ${_.blocks.map((Y)=>`#${Y}`).join(", ")}`);
            return {
                tool_use_id: K,
                type: "tool_result",
                content: z.join(`
`)
            }
        }
    })
})
// @from(Ln 392282, Col 4)
fTK = "Update a task in the task list"
// @from(Ln 392283, Col 4)
GTK = `Use this tool to update a task in the task list.

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
// @from(Ln 392358, Col 4)
yHY
// @from(Ln 392358, Col 9)
LHY
// @from(Ln 392358, Col 14)
vTK
// @from(Ln 392359, Col 4)
TTK = L(() => {
    p7();
    B1();
    gq();
    fO();
    K9();
    PX();
    zY();
    ZX();
    sY();
    yHY = C6(() => {
        let q = FH6().or(y.literal("deleted"));
        return y.strictObject({
            taskId: y.string().describe("The ID of the task to update"),
            subject: y.string().optional().describe("New subject for the task"),
            description: y.string().optional().describe("New description for the task"),
            activeForm: y.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
            status: q.optional().describe("New status for the task"),
            addBlocks: y.array(y.string()).optional().describe("Task IDs that this task blocks"),
            addBlockedBy: y.array(y.string()).optional().describe("Task IDs that block this task"),
            owner: y.string().optional().describe("New owner for the task"),
            metadata: y.record(y.string(), y.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")
        })
    }), LHY = C6(() => y.object({
        success: y.boolean(),
        taskId: y.string(),
        updatedFields: y.array(y.string()),
        error: y.string().optional(),
        statusChange: y.object({
            from: y.string(),
            to: y.string()
        }).optional(),
        verificationNudgeNeeded: y.boolean().optional()
    })), vTK = Iq({
        name: gk,
        searchHint: "update a task",
        maxResultSizeChars: 1e5,
        async description() {
            return fTK
        },
        async prompt() {
            return GTK
        },
        get inputSchema() {
            return yHY()
        },
        get outputSchema() {
            return LHY()
        },
        userFacingName() {
            return "TaskUpdate"
        },
        shouldDefer: !0,
        isEnabled() {
            return kJ()
        },
        isConcurrencySafe() {
            return !0
        },
        toAutoClassifierInput(q) {
            let K = [q.taskId];
            if (q.status) K.push(q.status);
            if (q.subject) K.push(q.subject);
            return K.join(" ")
        },
        renderToolUseMessage() {
            return null
        },
        async call({
            taskId: q,
            subject: K,
            description: _,
            activeForm: z,
            status: Y,
            owner: A,
            addBlocks: O,
            addBlockedBy: w,
            metadata: $
        }, j) {
            let H = AT();
            j.setAppState((W) => {
                if (W.expandedView === "tasks") return W;
                return {
                    ...W,
                    expandedView: "tasks"
                }
            });
            let J = await Fp(H, q);
            if (!J) return {
                data: {
                    success: !1,
                    taskId: q,
                    updatedFields: [],
                    error: "Task not found"
                }
            };
            let X = [],
                M = {};
            if (K !== void 0 && K !== J.subject) M.subject = K, X.push("subject");
            if (_ !== void 0 && _ !== J.description) M.description = _, X.push("description");
            if (z !== void 0 && z !== J.activeForm) M.activeForm = z, X.push("activeForm");
            if (A !== void 0 && A !== J.owner) M.owner = A, X.push("owner");
            if (z4() && Y === "in_progress" && A === void 0 && !J.owner) {
                let W = T_();
                if (W) M.owner = W, X.push("owner")
            }
            if ($ !== void 0) {
                let W = {
                    ...J.metadata ?? {}
                };
                for (let [D, Z] of Object.entries($))
                    if (Z === null) delete W[D];
                    else W[D] = Z;
                M.metadata = W, X.push("metadata")
            }
            if (Y !== void 0) {
                if (Y === "deleted") {
                    let W = await ub8(H, q);
                    return {
                        data: {
                            success: W,
                            taskId: q,
                            updatedFields: W ? ["deleted"] : [],
                            error: W ? void 0 : "Failed to delete task",
                            statusChange: W ? {
                                from: J.status,
                                to: "deleted"
                            } : void 0
                        }
                    }
                }
                if (Y !== J.status) {
                    if (Y === "completed") {
                        let W = [],
                            D = CM6(q, J.subject, J.description, T_(), Z9(), void 0, j?.abortController?.signal, void 0, j);
                        for await (let Z of D) if (Z.blockingError) W.push(q38(Z.blockingError));
                        if (W.length > 0) return {
                            data: {
                                success: !1,
                                taskId: q,
                                updatedFields: [],
                                error: W.join(`
`)
                            }
                        }
                    }
                    M.status = Y, X.push("status")
                }
            }
            if (Object.keys(M).length > 0) await ns(H, q, M);
            if (M.owner && z4()) {
                let W = T_() || "team-lead",
                    D = KH(),
                    Z = JSON.stringify({
                        type: "task_assignment",
                        taskId: q,
                        subject: J.subject,
                        description: J.description,
                        assignedBy: W,
                        timestamp: new Date().toISOString()
                    });
                await F_(M.owner, {
                    from: W,
                    text: Z,
                    timestamp: new Date().toISOString(),
                    color: D
                }, H)
            }
            if (O && O.length > 0) {
                let W = O.filter((D) => !J.blocks.includes(D));
                for (let D of W) await On1(H, q, D);
                if (W.length > 0) X.push("blocks")
            }
            if (w && w.length > 0) {
                let W = w.filter((D) => !J.blockedBy.includes(D));
                for (let D of W) await On1(H, D, q);
                if (W.length > 0) X.push("blockedBy")
            }
            let P = !1;
            return {
                data: {
                    success: !0,
                    taskId: q,
                    updatedFields: X,
                    statusChange: M.status !== void 0 ? {
                        from: J.status,
                        to: M.status
                    } : void 0,
                    verificationNudgeNeeded: P
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                success: _,
                taskId: z,
                updatedFields: Y,
                error: A,
                statusChange: O,
                verificationNudgeNeeded: w
            } = q;
            if (!_) return {
                tool_use_id: K,
                type: "tool_result",
                content: A || `Task #${z} not found`
            };
            let $ = `Updated task #${z} ${Y.join(", ")}`;
            if (O?.to === "completed" && mW() && z4()) $ += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
            if (w) $ += `

NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="${vX8}"). You cannot self-assign PARTIAL by listing caveats in your summary — only the verifier issues a verdict.`;
            return {
                tool_use_id: K,
                type: "tool_result",
                content: $
            }
        }
    })
})
// @from(Ln 392581, Col 0)
function kTK() {
    let q = z4() ? `- Before assigning tasks to teammates, to see what's available
` : "",
        K = z4() ? "- **id**: Task identifier (use with TaskGet, TaskUpdate)" : "- **id**: Task identifier (use with TaskGet, TaskUpdate)",
        _ = z4() ? `
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
${q}- After completing a task, to check for newly unblocked work or claim the next available task
- **Prefer working on tasks in ID order** (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones

## Output

Returns a summary of each task:
${K}
- **subject**: Brief description of the task
- **status**: 'pending', 'in_progress', or 'completed'
- **owner**: Agent ID if assigned, empty if available
- **blockedBy**: List of open task IDs that must be resolved first (tasks with blockedBy cannot be claimed until dependencies resolve)

Use TaskGet with a specific task ID to view full details including description and comments.
${_}`
}
// @from(Ln 392617, Col 4)
VTK = "List all tasks in the task list"
// @from(Ln 392618, Col 4)
NTK = L(() => {
    fO()
})
// @from(Ln 392621, Col 4)
hHY
// @from(Ln 392621, Col 9)
RHY
// @from(Ln 392621, Col 14)
ETK
// @from(Ln 392622, Col 4)
yTK = L(() => {
    p7();
    gq();
    PX();
    NTK();
    hHY = C6(() => y.strictObject({})), RHY = C6(() => y.object({
        tasks: y.array(y.object({
            id: y.string(),
            subject: y.string(),
            status: FH6(),
            owner: y.string().optional(),
            blockedBy: y.array(y.string())
        }))
    })), ETK = Iq({
        name: xD,
        searchHint: "list all tasks",
        maxResultSizeChars: 1e5,
        async description() {
            return VTK
        },
        async prompt() {
            return kTK()
        },
        get inputSchema() {
            return hHY()
        },
        get outputSchema() {
            return RHY()
        },
        userFacingName() {
            return "TaskList"
        },
        shouldDefer: !0,
        isEnabled() {
            return kJ()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        renderToolUseMessage() {
            return null
        },
        async call() {
            let q = AT(),
                K = (await Qf(q)).filter((Y) => !Y.metadata?._internal),
                _ = new Set(K.filter((Y) => Y.status === "completed").map((Y) => Y.id));
            return {
                data: {
                    tasks: K.map((Y) => ({
                        id: Y.id,
                        subject: Y.subject,
                        status: Y.status,
                        owner: Y.owner,
                        blockedBy: Y.blockedBy.filter((A) => !_.has(A))
                    }))
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let {
                tasks: _
            } = q;
            if (_.length === 0) return {
                tool_use_id: K,
                type: "tool_result",
                content: "No tasks found"
            };
            let z = _.map((Y) => {
                let A = Y.owner ? ` (${Y.owner})` : "",
                    O = Y.blockedBy.length > 0 ? ` [blocked by ${Y.blockedBy.map((w)=>`#${w}`).join(", ")}]` : "";
                return `#${Y.id} [${Y.status}] ${Y.subject}${A}${O}`
            });
            return {
                tool_use_id: K,
                type: "tool_result",
                content: z.join(`
`)
            }
        }
    })
})
// @from(Ln 392706, Col 4)
LTK = {}
// @from(Ln 392711, Col 0)
function XI6() {
    return !0
}
// @from(Ln 392715, Col 0)
function hTK(q) {
    return `${q.cron??""}${q.prompt?`: ${w5(q.prompt,60,!0)}`:""}`
}
// @from(Ln 392719, Col 0)
function RTK(q) {
    return YL.default.createElement(_1, null, YL.default.createElement(T, null, "Scheduled ", YL.default.createElement(T, {
        bold: !0
    }, q.id), " ", YL.default.createElement(T, {
        dimColor: !0
    }, "(", q.humanSchedule, ")")))
}
// @from(Ln 392727, Col 0)
function STK(q) {
    return q.id ?? ""
}
// @from(Ln 392731, Col 0)
function CTK(q) {
    return YL.default.createElement(_1, null, YL.default.createElement(T, null, "Cancelled ", YL.default.createElement(T, {
        bold: !0
    }, q.id)))
}
// @from(Ln 392737, Col 0)
function bTK() {
    return ""
}
// @from(Ln 392741, Col 0)
function ITK(q) {
    if (q.jobs.length === 0) return YL.default.createElement(_1, null, YL.default.createElement(T, {
        dimColor: !0
    }, "No scheduled jobs"));
    return YL.default.createElement(_1, null, q.jobs.map((K) => YL.default.createElement(T, {
        key: K.id
    }, YL.default.createElement(T, {
        bold: !0
    }, K.id), " ", YL.default.createElement(T, {
        dimColor: !0
    }, K.humanSchedule))))
}
// @from(Ln 392753, Col 4)
YL
// @from(Ln 392754, Col 4)
hd8 = L(() => {
    GK();
    g6();
    c7();
    YL = K6(P6(), 1)
})
// @from(Ln 392760, Col 4)
uTK = {}
// @from(Ln 392764, Col 4)
xTK = 50
// @from(Ln 392765, Col 4)
SHY
// @from(Ln 392765, Col 9)
CHY
// @from(Ln 392765, Col 14)
bHY
// @from(Ln 392766, Col 4)
mTK = L(() => {
    p7();
    y8();
    gq();
    Uj6();
    yp();
    g96();
    Rv();
    QR();
    hd8();
    SHY = C6(() => y.strictObject({
        cron: y.string().describe('Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).'),
        prompt: y.string().describe("The prompt to enqueue at each fire time."),
        recurring: _W(y.boolean().optional()).describe(`true (default) = fire on every cron match until deleted or auto-expired after ${UR} days. false = fire once at the next match, then auto-delete. Use false for "remind me at X" one-shot requests with pinned minute/hour/dom/month.`),
        durable: _W(y.boolean().optional()).describe("true = persist to .claude/scheduled_tasks.json and survive restarts. false (default) = in-memory only, dies when this Claude session ends. Use true only when the user asks the task to survive across sessions.")
    })), CHY = C6(() => y.object({
        id: y.string(),
        humanSchedule: y.string(),
        recurring: y.boolean(),
        durable: y.boolean().optional()
    })), bHY = Iq({
        name: DX,
        searchHint: "schedule a recurring or one-shot prompt",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return SHY()
        },
        get outputSchema() {
            return CHY()
        },
        isEnabled() {
            return uD()
        },
        toAutoClassifierInput(q) {
            return `${q.cron}: ${q.prompt}`
        },
        async description() {
            return Un1(os())
        },
        async prompt() {
            return Qn1(os())
        },
        getPath() {
            return Ls()
        },
        async validateInput(q) {
            if (!gj6(q.cron)) return {
                result: !1,
                message: `Invalid cron expression '${q.cron}'. Expected 5 fields: M H DoM Mon DoW.`,
                errorCode: 1
            };
            if (Uy6(q.cron, Date.now()) === null) return {
                result: !1,
                message: `Cron expression '${q.cron}' does not match any calendar date in the next year.`,
                errorCode: 2
            };
            if ((await IK6()).length >= xTK) return {
                result: !1,
                message: `Too many scheduled jobs (max ${xTK}). Cancel one first.`,
                errorCode: 3
            };
            if (q.durable && uW()) return {
                result: !1,
                message: "durable crons are not supported for teammates (teammates do not persist across sessions)",
                errorCode: 4
            };
            return {
                result: !0
            }
        },
        async call({
            cron: q,
            prompt: K,
            recurring: _ = !0,
            durable: z = !1
        }) {
            let Y = z && os(),
                A = await UR8(q, K, _, Y, uW()?.agentId);
            return Si(!0), {
                data: {
                    id: A,
                    humanSchedule: Np(q),
                    recurring: _,
                    durable: Y
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let _ = q.durable ? "Persisted to .claude/scheduled_tasks.json" : "Session-only (not written to disk, dies when Claude exits)";
            return {
                tool_use_id: K,
                type: "tool_result",
                content: q.recurring ? `Scheduled recurring job ${q.id} (${q.humanSchedule}). ${_}. Auto-expires after ${UR} days. Use CronDelete to cancel sooner.` : `Scheduled one-shot task ${q.id} (${q.humanSchedule}). ${_}. It will fire once then auto-delete.`
            }
        },
        renderToolUseMessage: hTK,
        renderToolResultMessage: RTK
    })
})
// @from(Ln 392866, Col 4)
BTK = {}
// @from(Ln 392870, Col 4)
IHY
// @from(Ln 392870, Col 9)
xHY
// @from(Ln 392870, Col 14)
uHY
// @from(Ln 392871, Col 4)
pTK = L(() => {
    p7();
    gq();
    yp();
    Rv();
    QR();
    hd8();
    IHY = C6(() => y.strictObject({
        id: y.string().describe("Job ID returned by CronCreate.")
    })), xHY = C6(() => y.object({
        id: y.string()
    })), uHY = Iq({
        name: wT,
        searchHint: "cancel a scheduled cron job",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return IHY()
        },
        get outputSchema() {
            return xHY()
        },
        isEnabled() {
            return uD()
        },
        toAutoClassifierInput(q) {
            return q.id
        },
        async description() {
            return dn1
        },
        async prompt() {
            return cn1(os())
        },
        getPath() {
            return Ls()
        },
        async validateInput(q) {
            let _ = (await IK6()).find((Y) => Y.id === q.id);
            if (!_) return {
                result: !1,
                message: `No scheduled job with id '${q.id}'`,
                errorCode: 1
            };
            let z = uW();
            if (z && _.agentId !== z.agentId) return {
                result: !1,
                message: `Cannot delete cron job '${q.id}': owned by another agent`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async call({
            id: q
        }) {
            return await hs([q]), {
                data: {
                    id: q
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `Cancelled job ${q.id}.`
            }
        },
        renderToolUseMessage: STK,
        renderToolResultMessage: CTK
    })
})
// @from(Ln 392945, Col 4)
FTK = {}
// @from(Ln 392949, Col 4)
mHY
// @from(Ln 392949, Col 9)
BHY
// @from(Ln 392949, Col 14)
pHY
// @from(Ln 392950, Col 4)
gTK = L(() => {
    p7();
    gq();
    Uj6();
    yp();
    c7();
    Rv();
    QR();
    hd8();
    mHY = C6(() => y.strictObject({})), BHY = C6(() => y.object({
        jobs: y.array(y.object({
            id: y.string(),
            cron: y.string(),
            humanSchedule: y.string(),
            prompt: y.string(),
            recurring: y.boolean().optional(),
            durable: y.boolean().optional()
        }))
    })), pHY = Iq({
        name: nH6,
        searchHint: "list active cron jobs",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return mHY()
        },
        get outputSchema() {
            return BHY()
        },
        isEnabled() {
            return uD()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async description() {
            return ln1
        },
        async prompt() {
            return nn1(os())
        },
        async call() {
            let q = await IK6(),
                K = uW();
            return {
                data: {
                    jobs: (K ? q.filter((Y) => Y.agentId === K.agentId) : q).map((Y) => ({
                        id: Y.id,
                        cron: Y.cron,
                        humanSchedule: Np(Y.cron),
                        prompt: Y.prompt,
                        ...Y.recurring ? {
                            recurring: !0
                        } : {},
                        ...Y.durable === !1 ? {
                            durable: !1
                        } : {}
                    }))
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: q.jobs.length > 0 ? q.jobs.map((_) => `${_.id} — ${_.humanSchedule}${_.recurring?" (recurring)":" (one-shot)"}${_.durable===!1?" [session-only]":""}: ${w5(_.prompt,80,!0)}`).join(`
`) : "No scheduled jobs."
            }
        },
        renderToolUseMessage: bTK,
        renderToolResultMessage: ITK
    })
})
// @from(Ln 393026, Col 4)
UTK = {}
// @from(Ln 393030, Col 4)
B37
// @from(Ln 393030, Col 9)
gHY
// @from(Ln 393030, Col 14)
UHY
// @from(Ln 393030, Col 19)
QHY
// @from(Ln 393031, Col 4)
QTK = L(() => {
    p7();
    gq();
    fe6();
    B37 = (cR8(), B7(dR8)), gHY = C6(() => y.strictObject({
        delaySeconds: y.number().describe("Seconds from now to wake up. Clamped to [60, 3600] by the runtime."),
        reason: y.string().describe("One short sentence explaining the chosen delay. Goes to telemetry and is shown to the user. Be specific."),
        prompt: y.string().describe(`The /loop input to fire on wake-up. Pass the same /loop input verbatim each turn so the next firing re-enters the skill and continues the loop. For autonomous /loop (no user prompt), pass the literal sentinel \`${ys}\` instead (the dynamic-pacing variant, not the CronCreate-mode \`${Fj6}\`).`)
    })), UHY = C6(() => y.object({
        scheduledFor: y.number().describe("Epoch ms timestamp when the next wakeup will fire"),
        clampedDelaySeconds: y.number().describe("Actual delay used after clamping to runtime bounds"),
        wasClamped: y.boolean().describe("True if the requested delaySeconds was outside [60, 3600]")
    })), QHY = Iq({
        name: fH,
        searchHint: "self-pace next iteration: pick a delay before resuming work or running the next /loop tick",
        maxResultSizeChars: 1000,
        async description() {
            return MU1
        },
        async prompt() {
            return XU1
        },
        get inputSchema() {
            return gHY()
        },
        get outputSchema() {
            return UHY()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        async checkPermissions(q) {
            return {
                behavior: "allow",
                updatedInput: q
            }
        },
        renderToolUseMessage() {
            return null
        },
        async call({
            delaySeconds: q,
            reason: K,
            prompt: _
        }) {
            let Y = B37 !== null && !B37.isLoopDynamicEnabled() ? null : B37?.scheduleLoopWakeup(q, _, K) ?? null;
            if (Y === null) return {
                data: {
                    scheduledFor: 0,
                    clampedDelaySeconds: 0,
                    wasClamped: !1
                }
            };
            return {
                data: {
                    scheduledFor: Y.scheduledFor,
                    clampedDelaySeconds: Y.clampedDelaySeconds,
                    wasClamped: Y.wasClamped
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            scheduledFor: q,
            clampedDelaySeconds: K,
            wasClamped: _
        }, z) {
            if (q === 0) return {
                tool_use_id: z,
                type: "tool_result",
                content: "Wakeup not scheduled. Either the /loop dynamic runtime gate is off or the loop reached its maximum duration — the loop has ended; do not re-issue."
            };
            let Y = new Date(q).toTimeString().slice(0, 8),
                A = Math.max(0, Math.round((q - Date.now()) / 1000)),
                O = _ ? ` (clamped to ${K}s from your requested value)` : "";
            return {
                tool_use_id: z,
                type: "tool_result",
                content: `Next wakeup scheduled for ${Y} (in ${A}s)${O}.`
            }
        }
    })
})
// @from(Ln 393114, Col 4)
bM6 = "RemoteTrigger"
// @from(Ln 393115, Col 4)
dTK = "Manage scheduled remote Claude Code agents (triggers) via the claude.ai CCR API. Auth is handled in-process — the token never reaches the shell."
// @from(Ln 393116, Col 4)
cTK = `Call the claude.ai remote-trigger API. Use this instead of curl — the OAuth token is added automatically in-process and never exposed.

Actions:
- list: GET /v1/code/triggers
- get: GET /v1/code/triggers/{trigger_id}
- create: POST /v1/code/triggers (requires body)
- update: POST /v1/code/triggers/{trigger_id} (requires body, partial update)
- run: POST /v1/code/triggers/{trigger_id}/run (optional body)

The response is the raw JSON from the API.`
// @from(Ln 393127, Col 0)
function lTK(q) {
    return `${q.action??""}${q.trigger_id?` ${q.trigger_id}`:""}`
}
// @from(Ln 393131, Col 0)
function nTK(q) {
    let K = tz(q.json, `
`) + 1;
    return Rd8.default.createElement(_1, null, Rd8.default.createElement(T, null, "HTTP ", q.status, " ", Rd8.default.createElement(T, {
        dimColor: !0
    }, "(", K, " lines)")))
}
// @from(Ln 393138, Col 4)
Rd8
// @from(Ln 393139, Col 4)
iTK = L(() => {
    GK();
    g6();
    Rd8 = K6(P6(), 1)
})
// @from(Ln 393144, Col 4)
rTK = {}
// @from(Ln 393148, Col 4)
dHY
// @from(Ln 393148, Col 9)
cHY
// @from(Ln 393148, Col 14)
lHY = "ccr-triggers-2026-01-30"
// @from(Ln 393149, Col 4)
nHY
// @from(Ln 393150, Col 4)
oTK = L(() => {
    CK();
    p7();
    z3();
    B1();
    YD();
    J2();
    gq();
    T7();
    Q8();
    e8();
    iTK();
    dHY = C6(() => y.strictObject({
        action: y.enum(["list", "get", "create", "update", "run"]),
        trigger_id: y.string().regex(/^[\w-]+$/).optional().describe("Required for get, update, and run"),
        body: y.record(y.string(), y.unknown()).optional().describe("Required for create and update; optional for run")
    })), cHY = C6(() => y.object({
        status: y.number(),
        json: y.string()
    })), nHY = Iq({
        name: bM6,
        searchHint: "manage scheduled remote agent triggers",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        get inputSchema() {
            return dHY()
        },
        get outputSchema() {
            return cHY()
        },
        isEnabled() {
            return !S6(process.env.CLAUDE_CODE_REMOTE) && u8("tengu_surreal_dali", !1) && N5("allow_remote_sessions")
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly(q) {
            return q.action === "list" || q.action === "get"
        },
        toAutoClassifierInput(q) {
            return `RemoteTrigger ${q.action}${q.trigger_id?` ${q.trigger_id}`:""}`
        },
        async description() {
            return dTK
        },
        async prompt() {
            return cTK
        },
        async call(q, K) {
            await _Y();
            let _ = o7()?.accessToken;
            if (!_) throw Error("Not authenticated with a claude.ai account. Run /login and try again.");
            let z = await zD();
            if (!z) throw Error("Unable to resolve organization UUID.");
            let Y = `${r7().BASE_API_URL}/v1/code/triggers`,
                A = {
                    Authorization: `Bearer ${_}`,
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01",
                    "anthropic-beta": lHY,
                    "x-organization-uuid": z
                },
                {
                    action: O,
                    trigger_id: w,
                    body: $
                } = q,
                j, H, J;
            switch (O) {
                case "list":
                    j = "GET", H = Y;
                    break;
                case "get":
                    if (!w) throw Error("get requires trigger_id");
                    j = "GET", H = `${Y}/${w}`;
                    break;
                case "create":
                    if (!$) throw Error("create requires body");
                    j = "POST", H = Y, J = $;
                    break;
                case "update":
                    if (!w) throw Error("update requires trigger_id");
                    if (!$) throw Error("update requires body");
                    j = "POST", H = `${Y}/${w}`, J = $;
                    break;
                case "run":
                    if (!w) throw Error("run requires trigger_id");
                    j = "POST", H = `${Y}/${w}/run`, J = {
                        ...$,
                        trigger_id: w
                    };
                    break
            }
            let X = await Z1.request({
                method: j,
                url: H,
                headers: A,
                data: J,
                timeout: 20000,
                signal: K.abortController.signal,
                validateStatus: () => !0
            });
            return {
                data: {
                    status: X.status,
                    json: I6(X.data)
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `HTTP ${q.status}
${q.json}`
            }
        },
        renderToolUseMessage: lTK,
        renderToolResultMessage: nTK
    })
})
// @from(Ln 393272, Col 0)
function z_6(q, K) {
    let _;
    if (K.update(q, (z) => {
            if (z.status !== "running" || !WS(z)) return z;
            try {
                E(`LocalShellTask ${q} kill requested`), z.shellCommand?.kill(), z.shellCommand?.cleanup()
            } catch (Y) {
                j6(Y)
            }
            if (z.unregisterCleanup?.(), z.cleanupTimeoutId) clearTimeout(z.cleanupTimeoutId);
            return _ = {
                toolUseId: z.toolUseId,
                description: z.description
            }, {
                ...z,
                status: "killed",
                notified: !0,
                shellCommand: null,
                unregisterCleanup: void 0,
                cleanupTimeoutId: void 0,
                endTime: Date.now()
            }
        }), _) I$(q, "stopped", {
        toolUseId: _.toolUseId,
        summary: _.description
    });
    n2(q)
}
// @from(Ln 393301, Col 0)
function aTK(q, K) {
    for (let [_, z] of Object.entries(K.all()))
        if (WS(z) && z.agentId === q && z.status === "running") E(`killShellTasksForAgent: killing orphaned shell task ${_} (agent ${q} exiting)`), z_6(_, K);
    Ty6((_) => _.agentId === q)
}
// @from(Ln 393306, Col 4)
Sd8 = L(() => {
    K8();
    U8();
    b$();
    BP();
    EH()
})
// @from(Ln 393314, Col 0)
function IM6(q, K, _, z) {
    let Y = _ ? `
<${hW}>${fJ(_)}</${hW}>` : "",
        A = !z?.isHousekeeping && !0 && e56() ? `
If this event is something the user would act on now, send a ${ic}. Routine or benign output doesn't need one.` : "",
        O = `<${TA}>${Y}
<${Mw}>Monitor event: "${fJ(q)}"</${Mw}>
<event>${fJ(K)}</event>${A}
</${TA}>`;
    LY({
        value: O,
        mode: "task-notification",
        priority: "next"
    })
}
// @from(Ln 393330, Col 0)
function Id8(q, K = (_) => {
    let z = setTimeout(_, iHY);
    return () => clearTimeout(z)
}) {
    let _ = "",
        z = [],
        Y = null;

    function A(w) {
        if (Y) Y(), Y = null;
        if (w && _.trim()) {
            let j = _.trim();
            if (j.length > Cd8) j = j.slice(0, Cd8) + "...(truncated)";
            z.push(j), _ = ""
        }
        if (z.length === 0) return;
        let $ = z.join(`
`);
        if ($.length > sTK) $ = $.slice(0, sTK) + `
...(truncated)`;
        z = [], q($)
    }

    function O(w) {
        if (_ += w, _.length > tTK) _ = _.slice(-tTK);
        let $;
        while (($ = _.indexOf(`
`)) !== -1) {
            let j = _.slice(0, $).trim();
            if (_ = _.slice($ + 1), j) {
                if (j.length > Cd8) j = j.slice(0, Cd8) + "...(truncated)";
                z.push(j)
            }
        }
        if (z.length > 0 && !Y) Y = K(A)
    }
    return {
        onData: O,
        flush: A
    }
}
// @from(Ln 393372, Col 0)
function xd8(q, K, _ = Date.now) {
    let z = q,
        Y = _();

    function A() {
        let O = _(),
            w = Math.floor((O - Y) / K);
        if (w > 0) z = Math.min(q, z + w), Y += w * K
    }
    return {
        tryConsume() {
            if (A(), z > 0) return z--, !0;
            return !1
        }
    }
}
// @from(Ln 393388, Col 4)
bd8 = 10
// @from(Ln 393389, Col 4)
K38 = 2000
// @from(Ln 393390, Col 4)
eTK = 30000
// @from(Ln 393391, Col 4)
Cd8 = 500
// @from(Ln 393392, Col 4)
sTK = 3000
// @from(Ln 393393, Col 4)
iHY = 200
// @from(Ln 393394, Col 4)
tTK = 1048576
// @from(Ln 393395, Col 4)
p37 = L(() => {
    rA();
    b$();
    q36()
})
// @from(Ln 393401, Col 0)
function qVK() {
    return "Monitor"
}
// @from(Ln 393405, Col 0)
function KVK(q) {
    if (!q.description) return null;
    return q.description
}
// @from(Ln 393410, Col 0)
function _VK(q) {
    return ud8.default.createElement(_1, null, ud8.default.createElement(T, null, "Monitor started", " ", ud8.default.createElement(T, {
        dimColor: !0
    }, "· task ", q.taskId, " ·", " ", q.persistent ? "persistent" : `timeout ${q.timeoutMs/1000}s`)))
}
// @from(Ln 393416, Col 0)
function zVK(q) {
    if (!q?.description) return null;
    return w5(q.description, av)
}
// @from(Ln 393420, Col 4)
ud8
// @from(Ln 393421, Col 4)
YVK = L(() => {
    GK();
    g6();
    c7();
    ud8 = K6(P6(), 1)
})
// @from(Ln 393427, Col 4)
U37 = {}
// @from(Ln 393432, Col 0)
function oHY() {
    return {
        description: y.string().describe("Short human-readable description of what you are monitoring (shown in notifications)."),
        timeout_ms: y.number().min(1000).optional().default(AVK).describe(`Kill the monitor after this deadline. Default ${AVK}ms, max ${F37}ms. Ignored when persistent is true.`),
        persistent: y.boolean().optional().default(!1).describe("Run for the lifetime of the session (no timeout). Use for session-length watches like PR monitoring or log tails. Stop with TaskStop.")
    }
}
// @from(Ln 393440, Col 0)
function sHY(q) {
    return q.persistent || q.timeout_ms <= F37
}
// @from(Ln 393443, Col 0)
async function qJY(q, K, _) {
    let {
        description: z,
        timeout_ms: Y,
        persistent: A
    } = K, {
        abortController: O,
        toolUseId: w,
        agentId: $,
        taskRegistry: j
    } = _, H = {}, J = 0, X, M, P = !1, W = xd8(bd8, K38), D = Id8((v) => {
        if (P) return;
        if (W.tryConsume()) {
            if (J > 0) {
                if (IM6(z, `[${J} events suppressed — output rate too high. Consider using TaskStop to restart this monitor with a more selective filter.]`, H.id, {
                        isHousekeeping: !0
                    }), J = 0, M !== void 0 && Date.now() - M > K38 * 3) X = void 0
            }
            IM6(z, v, H.id);
            return
        }
        if (J++, M = Date.now(), X === void 0) X = Date.now();
        if (Date.now() - X > eTK) {
            if (P = !0, IM6(z, `[Monitor stopped — your script produced too much output (${J} events suppressed over ${Math.round((Date.now()-X)/1000)}s). Write a new monitor command that filters more aggressively — pipe through grep --line-buffered, awk, or a wrapper script that only emits the specific events you need.]`, H.id, {
                    isHousekeeping: !0
                }), H.id) z_6(H.id, j)
        }
    }), Z = await al(q, O.signal, "bash", {
        preventCwdChanges: !0,
        shouldUseSandbox: AL({
            command: q,
            dangerouslyDisableSandbox: K.dangerouslyDisableSandbox
        }),
        onStdout: D.onData,
        sessionEnvVars: _.sessionEnvVars,
        tmuxSocket: _.tmuxSocket
    }), G = await Y_6({
        command: q,
        description: z,
        shellCommand: Z,
        toolUseId: w,
        agentId: $,
        kind: "monitor"
    }, {
        abortController: O,
        taskRegistry: j,
        abortSpeculation: _.abortSpeculation
    });
    H.id = G.taskId;
    let f = A ? void 0 : setTimeout(() => {
        if (P) return;
        IM6(z, "[Monitor timed out — re-arm if needed.]", G.taskId, {
            isHousekeeping: !0
        }), z_6(G.taskId, j)
    }, Y);
    return Z.result.then(() => {
        if (f) clearTimeout(f);
        D.flush(!0), P = !0
    }), {
        data: {
            taskId: G.taskId,
            timeoutMs: A ? 0 : Y,
            persistent: A
        }
    }
}
// @from(Ln 393509, Col 4)
F37 = 3600000
// @from(Ln 393510, Col 4)
AVK = 300000
// @from(Ln 393511, Col 4)
rHY = "Shell command or script. Each stdout line is an event; exit ends the watch."
// @from(Ln 393512, Col 4)
aHY
// @from(Ln 393512, Col 9)
tHY
// @from(Ln 393512, Col 14)
eHY
// @from(Ln 393512, Col 19)
KJY
// @from(Ln 393512, Col 24)
g37
// @from(Ln 393513, Col 4)
md8 = L(() => {
    p7();
    gq();
    Sd8();
    pl();
    $G();
    MT();
    xM6();
    p37();
    zt();
    YVK();
    aHY = {
        message: `timeout_ms must be ≤ ${F37}`,
        path: ["timeout_ms"]
    };
    tHY = C6(() => y.strictObject({
        ...oHY(),
        command: y.string().describe(rHY)
    }).refine(sHY, aHY)), eHY = C6(() => y.object({
        taskId: y.string().describe("ID of the background monitor task."),
        timeoutMs: y.number().describe("Timeout deadline in milliseconds (0 when persistent)."),
        persistent: y.boolean().optional().describe("No timeout — runs until TaskStop or session end.")
    }));
    KJY = {
        name: _0,
        maxResultSizeChars: 1e4,
        shouldDefer: !0,
        userFacingName: qVK,
        getToolUseSummary: zVK,
        getActivityDescription(q) {
            return q?.description ? `Monitoring: ${q.description}` : "Monitoring"
        },
        isEnabled() {
            return KF()
        },
        isConcurrencySafe() {
            return !0
        },
        renderToolUseMessage: KVK,
        renderToolResultMessage: _VK,
        get outputSchema() {
            return eHY()
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: `Monitor started (task ${q.taskId}, ${q.persistent?"persistent — runs until TaskStop or session end":`timeout ${q.timeoutMs}ms`}). You will be notified on each event. Keep working — do not poll or sleep. Events may arrive while you are waiting for the user — an event is not their reply.`
            }
        }
    }, g37 = Iq({
        ...KJY,
        searchHint: "stream events from a background script as live notifications",
        async description() {
            return $r1 + wr1()
        },
        async prompt() {
            return $r1 + wr1()
        },
        get inputSchema() {
            return tHY()
        },
        toAutoClassifierInput(q) {
            return q.command
        },
        async checkPermissions(q, K) {
            return _38(q, K)
        },
        async call(q, K) {
            return qJY(q.command, q, K)
        }
    })
})
// @from(Ln 393587, Col 0)
function Q37(q) {
    let K = s(13),
        {
            command: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = cP4(), K[0] = z;
    else z = K[0];
    let Y = z,
        [A, O] = MI6.useState(!1);
    if (!Y) {
        let X;
        if (K[1] !== _) X = MI6.default.createElement(T, {
            underline: !0
        }, "/", _), K[1] = _, K[2] = X;
        else X = K[2];
        return X
    }
    let w;
    if (K[3] !== _) w = () => {
        d("tengu_slash_link_clicked", {
            command: _
        }), Y(_)
    }, K[3] = _, K[4] = w;
    else w = K[4];
    let $, j;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) $ = () => O(!0), j = () => O(!1), K[5] = $, K[6] = j;
    else $ = K[5], j = K[6];
    let H;
    if (K[7] !== _ || K[8] !== A) H = MI6.default.createElement(T, {
        underline: !0,
        bold: A
    }, "/", _), K[7] = _, K[8] = A, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] !== w || K[11] !== H) J = MI6.default.createElement(u, {
        onClick: w,
        onMouseEnter: $,
        onMouseLeave: j
    }, H), K[10] = w, K[11] = H, K[12] = J;
    else J = K[12];
    return J
}
// @from(Ln 393630, Col 4)
MI6
// @from(Ln 393631, Col 4)
OVK = L(() => {
    o6();
    g6();
    C8();
    MI6 = K6(P6(), 1)
})
// @from(Ln 393638, Col 0)
function wVK(q) {
    if (!q.message) return "";
    return q.message
}
// @from(Ln 393643, Col 0)
function $VK(q) {
    let K;
    if (q.disabledReason === "config_off") K = VS.default.createElement(u, {
        flexDirection: "row"
    }, VS.default.createElement(T, null, 'Not sent because "Push when Claude decides" is disabled in', " "), VS.default.createElement(Q37, {
        command: "config"
    }), VS.default.createElement(T, null, "."));
    else if (q.disabledReason === "user_present") K = VS.default.createElement(T, null, "Not sent because you're active in this terminal.");
    else if (q.disabledReason === "bridge_inactive") K = q.localSent ? VS.default.createElement(T, null, "Terminal notification sent.") : VS.default.createElement(u, {
        flexDirection: "row"
    }, VS.default.createElement(T, null, "Not sent — Remote Control is off. Enable with "), VS.default.createElement(Q37, {
        command: "remote-control"
    }), VS.default.createElement(T, null, "."));
    else {
        if (q.localSent === void 0) return null;
        K = VS.default.createElement(T, null, q.localSent ? "Terminal and mobile notification sent." : "Mobile notification sent.")
    }
    return VS.default.createElement(_1, {
        height: 1
    }, K)
}
// @from(Ln 393664, Col 4)
VS
// @from(Ln 393665, Col 4)
jVK = L(() => {
    GK();
    OVK();
    g6();
    VS = K6(P6(), 1)
})
// @from(Ln 393671, Col 4)
HVK = {}
// @from(Ln 393675, Col 4)
_JY
// @from(Ln 393675, Col 9)
zJY
// @from(Ln 393675, Col 14)
YJY = 300000
// @from(Ln 393676, Col 4)
AJY
// @from(Ln 393677, Col 4)
JVK = L(() => {
    p7();
    y8();
    B1();
    C8();
    gq();
    h1();
    q36();
    jVK();
    _JY = C6(() => y.strictObject({
        message: y.string().min(1).describe("The notification body. Keep it under 200 characters; mobile OSes truncate."),
        status: y.literal("proactive")
    })), zJY = C6(() => y.object({
        message: y.string(),
        pushSent: y.boolean().optional(),
        localSent: y.boolean().optional(),
        disabledReason: y.enum(["config_off", "user_present", "bridge_inactive"]).optional(),
        idleSec: y.number().optional(),
        hasFocus: y.boolean().optional(),
        sentAt: y.string().optional().describe("ISO timestamp captured at tool execution on the emitting process. Optional — resumed sessions replay pre-sentAt outputs verbatim.")
    })), AJY = Iq({
        name: ic,
        searchHint: "send a notification to the user via terminal and optionally mobile",
        maxResultSizeChars: 1000,
        userFacingName: () => "PushNotification",
        get inputSchema() {
            return _JY()
        },
        get outputSchema() {
            return zJY()
        },
        shouldDefer: !0,
        isEnabled() {
            return XD("tengu_kairos_push_notifications", !1, YJY)
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return q.message
        },
        async description() {
            return cI4
        },
        async prompt() {
            return lI4
        },
        mapToolResultToToolResultBlockParam(q, K) {
            let _;
            if (q.disabledReason === "config_off") _ = "Push not sent — mobile push is disabled in /config.";
            else if (q.disabledReason === "user_present")
                if (q.hasFocus === !0) _ = "Not sent — terminal has focus. Terminal + mobile suppressed.";
                else {
                    let z = pO8 / 1000;
                    _ = `Not sent — user active (last keystroke ${q.idleSec!==void 0?`${q.idleSec}s`:`<${z}s`} ago, threshold ${z}s). Terminal + mobile suppressed.`
                }
            else if (q.disabledReason === "bridge_inactive") _ = q.localSent ? "Terminal notification sent. Mobile push not sent (Remote Control inactive)." : "Mobile push not sent (Remote Control inactive).";
            else _ = q.localSent ? "Terminal notification sent. Mobile push requested." : "Mobile push requested.";
            return {
                tool_use_id: K,
                type: "tool_result",
                content: _
            }
        },
        renderToolUseMessage: wVK,
        renderToolResultMessage: $VK,
        async call({
            message: q
        }, K) {
            let _ = new Date().toISOString(),
                z = H8(),
                Y = q11();
            if (Y && !(z.agentPushNotifEnabled ?? !1)) return {
                data: {
                    message: q,
                    pushSent: !1,
                    localSent: !1,
                    disabledReason: "config_off",
                    sentAt: _
                }
            };
            let A = (w, $) => {
                d("tengu_push_notification_send", {
                    message_length: q.length,
                    push_sent: w,
                    local_sent: $
                })
            };
            if (n61()) {
                let w = Math.round((Date.now() - AV()) / 1000),
                    $ = vD6();
                return A(!1, !1), {
                    data: {
                        message: q,
                        pushSent: !1,
                        localSent: !1,
                        disabledReason: "user_present",
                        idleSec: w,
                        ...$ !== void 0 && {
                            hasFocus: $
                        },
                        sentAt: _
                    }
                }
            }
            let O = K.sendOSNotification !== void 0;
            if (O) K.sendOSNotification?.({
                message: q,
                notificationType: "push_notification"
            });
            if (!Y) return A(!1, O), {
                data: {
                    message: q,
                    pushSent: !1,
                    localSent: O,
                    disabledReason: "bridge_inactive",
                    sentAt: _
                }
            };
            return A(!0, O), {
                data: {
                    message: q,
                    pushSent: !0,
                    localSent: O,
                    sentAt: _
                }
            }
        }
    })
})
// @from(Ln 393811, Col 0)
function XVK() {
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
- A team file at \`~/.claude/teams/{team-name}/config.json\`
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
// @from(Ln 393925, Col 0)
function MVK(q) {
    return `create team: ${q.team_name}`
}
// @from(Ln 393928, Col 4)
PVK = {}
// @from(Ln 393932, Col 4)
OJY
// @from(Ln 393932, Col 9)
wJY
// @from(Ln 393933, Col 4)
WVK = L(() => {
    p7();
    y8();
    C8();
    gq();
    fO();
    n7();
    m8();
    Sq();
    e8();
    sx();
    BD();
    PX();
    OJY = C6(() => y.strictObject({
        team_name: y.string().describe("Name for the new team to create."),
        description: y.string().optional().describe("Team description/purpose."),
        agent_type: y.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.')
    })), wJY = Iq({
        name: lp,
        searchHint: "create a multi-agent swarm team",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return OJY()
        },
        isEnabled() {
            return z4()
        },
        toAutoClassifierInput(q) {
            return q.team_name
        },
        async validateInput(q, K) {
            if (!q.team_name || q.team_name.trim().length === 0) return {
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
            return XVK()
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: I6(q)
                }]
            }
        },
        async call(q, K) {
            let {
                setAppState: _,
                getAppState: z
            } = K, {
                team_name: Y,
                description: A,
                agent_type: O
            } = q, w = z(), $ = w.teamContext?.teamName;
            if ($) throw Error(`Already leading team "${$}". A leader can only manage one team at a time. Use ${Cc} to end the current team before creating a new one.`);
            let j = Y,
                H = op(Mz, j),
                J = O || Mz,
                X = K5(w.mainLoopModelForSession ?? w.mainLoopModel ?? ZP()),
                M = oF(j),
                P = {
                    name: j,
                    description: A,
                    createdAt: Date.now(),
                    leadAgentId: H,
                    leadSessionId: I8(),
                    members: [{
                        agentId: H,
                        name: Mz,
                        agentType: J,
                        model: X,
                        joinedAt: Date.now(),
                        tmuxPaneId: "",
                        cwd: b8(),
                        subscriptions: []
                    }]
                };
            try {
                await Bd8(j, P, {
                    exclusive: !0
                })
            } catch (Z) {
                if (Q1(Z) === "EEXIST" && mw8(Z) === M) throw Error(`Team "${j}" already exists at ${M}. Choose a different team_name, or run ${Cc} on the existing team first.`);
                throw Z
            }
            c37(j);
            let W = T96(j);
            await xb8(W), await An1(W), _R4(T96(j));
            let D = K.teammateColors.assign(H);
            return _((Z) => ({
                ...Z,
                teamContext: {
                    teamName: j,
                    teamFilePath: M,
                    leadAgentId: H,
                    teammates: {
                        [H]: {
                            name: Mz,
                            agentType: J,
                            color: D,
                            tmuxSessionName: "",
                            tmuxPaneId: "",
                            cwd: b8(),
                            spawnedAt: Date.now()
                        }
                    }
                }
            })), d("tengu_team_created", {
                team_name: j,
                teammate_count: 1,
                lead_agent_type: J,
                teammate_mode: d37()
            }), {
                data: {
                    team_name: j,
                    team_file_path: M,
                    lead_agent_id: H
                }
            }
        },
        renderToolUseMessage: MVK
    })
})
// @from(Ln 394072, Col 0)
function DVK() {
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
// @from(Ln 394089, Col 0)
function ZVK(q) {
    return "cleanup team: current"
}
// @from(Ln 394093, Col 0)
function fVK(q, K, {
    verbose: _
}) {
    let z = typeof q === "string" ? n8(q) : q;
    if ("success" in z && "team_name" in z && "message" in z) return null;
    return null
}
// @from(Ln 394100, Col 4)
GVK = L(() => {
    e8()
})
// @from(Ln 394103, Col 4)
vVK = {}
// @from(Ln 394107, Col 4)
$JY
// @from(Ln 394107, Col 9)
jJY
// @from(Ln 394108, Col 4)
TVK = L(() => {
    p7();
    C8();
    gq();
    fO();
    e8();
    BD();
    PX();
    GVK();
    $JY = C6(() => y.strictObject({})), jJY = Iq({
        name: Cc,
        searchHint: "disband a swarm team and clean up",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        userFacingName() {
            return ""
        },
        get inputSchema() {
            return $JY()
        },
        isEnabled() {
            return z4()
        },
        async description() {
            return "Clean up team and task directories when the swarm is complete"
        },
        async prompt() {
            return DVK()
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: [{
                    type: "text",
                    text: I6(q)
                }]
            }
        },
        async call(q, K) {
            let {
                setAppState: _,
                getAppState: z
            } = K, A = z().teamContext?.teamName;
            if (A) {
                let O = uM(A);
                if (O) {
                    let $ = O.members.filter((j) => j.name !== Mz).filter((j) => j.isActive !== !1);
                    if ($.length > 0) {
                        let j = $.map((H) => H.name).join(", ");
                        return {
                            data: {
                                success: !1,
                                message: `Cannot cleanup team with ${$.length} active member(s): ${j}. Use requestShutdown to gracefully terminate teammates first.`,
                                team_name: A
                            }
                        }
                    }
                }
                await pd8(A), l37(A), K.teammateColors.clear(), zR4(), d("tengu_team_deleted", {
                    team_name: A
                })
            }
            return _((O) => ({
                ...O,
                teamContext: void 0,
                inbox: {
                    messages: []
                }
            })), {
                data: {
                    success: !0,
                    message: A ? `Cleaned up directories and worktrees for team "${A}"` : "No team name found, nothing to clean up",
                    team_name: A
                }
            }
        },
        renderToolUseMessage: ZVK,
        renderToolResultMessage: fVK
    })
})
// @from(Ln 394190, Col 0)
function n37(q) {
    VVK = q, nZq(JJY() ?? null).catch(() => {})
}
// @from(Ln 394194, Col 0)
function HJY() {
    return VVK
}
// @from(Ln 394198, Col 0)
function JJY() {
    let q = HJY();
    return q ? ER(q.bridgeSessionId) : void 0
}
// @from(Ln 394202, Col 4)
VVK = null
// @from(Ln 394203, Col 4)
i37 = L(() => {
    wf()
})
// @from(Ln 394210, Col 0)
function PJY() {
    let q = XJY(8),
        K = "s";
    for (let _ = 0; _ < 8; _++) K += kVK[q[_] % kVK.length];
    return K
}
// @from(Ln 394217, Col 0)
function WJY(q, K, _, z) {
    let Y = PJY();
    uM6(Y, X0(w2(Y)));
    let A = z ?? F5(),
        O = eq(async () => {
            K.remove(Y)
        }),
        w = _ ?? MJY,
        $ = {
            ...cf(Y, "local_agent", q),
            type: "local_agent",
            status: "running",
            agentId: Y,
            prompt: q,
            selectedAgent: w,
            agentType: "main-session",
            abortController: A,
            unregisterCleanup: O,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0,
            pendingMessages: [],
            retain: !1,
            diskLoaded: !1
        };
    return E(`[LocalMainSessionTask] Registering task ${Y} with description: ${q}`), K.register($), E(`[LocalMainSessionTask] After registration, task ${Y} exists in state: ${K.get(Y)!==void 0}`), {
        taskId: Y,
        abortSignal: A.signal
    }
}
// @from(Ln 394249, Col 0)
function NVK(q, K, _) {
    let z = K ? "completed" : "failed",
        Y, A;
    if (_.update(q, (O) => {
            if (O.status !== "running") return O;
            return Y = O.toolUseId, A = O.description, O.unregisterCleanup?.(), {
                ...O,
                status: z,
                endTime: Date.now(),
                notified: !0,
                messages: O.messages?.length ? [O.messages.at(-1)] : void 0
            }
        }), n2(q), A === void 0) return;
    I$(q, z, {
        toolUseId: Y,
        summary: A
    })
}
// @from(Ln 394268, Col 0)
function Fd8(q) {
    if (typeof q !== "object" || q === null || !("type" in q) || !("agentType" in q)) return !1;
    return q.type === "local_agent" && q.agentType === "main-session"
}
// @from(Ln 394273, Col 0)
function yVK({
    messages: q,
    queryParams: K,
    description: _,
    taskRegistry: z,
    agentDefinition: Y
}) {
    let {
        taskId: A,
        abortSignal: O
    } = WJY(_, z, Y);
    return cc(q, A).catch(($) => E(`bg-session initial transcript write failed: ${$}`)), eQ({
        agentId: A,
        agentType: "subagent",
        subagentName: "main-session",
        isBuiltIn: !0
    }, async () => {
        try {
            let $ = [...q],
                j = [],
                H = 0,
                J = 0,
                X = q.at(-1)?.uuid ?? null;
            for await (let M of yy({
                messages: $,
                ...K
            })) {
                if (O.aborted) {
                    let P = !1;
                    if (z.update(A, (W) => {
                            return P = W.notified === !0, P ? W : {
                                ...W,
                                notified: !0
                            }
                        }), !P) I$(A, "stopped", {
                        summary: _
                    });
                    return
                }
                if (M.type === "progress" && M.data.type === "repl_tool_call" && M.data.phase === "start") {
                    if (j.push({
                            toolName: M.data.toolName,
                            input: M.data.toolInput
                        }), j.length > EVK) j.shift();
                    let P = j.at(-1);
                    z.update(A, (W) => {
                        if (W.progress?.recentActivities?.at(-1) === P) return W;
                        return {
                            ...W,
                            progress: {
                                tokenCount: J,
                                toolUseCount: H,
                                recentActivities: [...j]
                            }
                        }
                    });
                    continue
                }
                if (M.type !== "user" && M.type !== "assistant" && M.type !== "system") continue;
                if ($.push(M), cc([M], A, X).catch((P) => E(`bg-session transcript write failed: ${P}`)), X = M.uuid, M.type === "assistant") {
                    for (let P of M.message.content)
                        if (P.type === "text") J += w_(P.text);
                        else if (P.type === "tool_use") {
                        if (H++, P.name === GO) continue;
                        let W = {
                            toolName: P.name,
                            input: P.input
                        };
                        if (j.push(W), j.length > EVK) j.shift()
                    }
                }
                z.update(A, (P) => {
                    let W = P.progress;
                    if (W?.tokenCount === J && W.toolUseCount === H && P.messages === $) return P;
                    return {
                        ...P,
                        progress: {
                            tokenCount: J,
                            toolUseCount: H,
                            recentActivities: W?.toolUseCount === H ? W.recentActivities : [...j]
                        },
                        messages: $
                    }
                })
            }
            NVK(A, !0, z)
        } catch ($) {
            j6($), NVK(A, !1, z)
        }
    }), A
}
// @from(Ln 394364, Col 4)
MJY
// @from(Ln 394364, Col 9)
kVK = "0123456789abcdefghijklmnopqrstuvwxyz"
// @from(Ln 394365, Col 4)
EVK = 5
// @from(Ln 394366, Col 4)
gd8 = L(() => {
    s56();
    Nk();
    $T();
    EP();
    Cf();
    x$();
    mB();
    R9();
    K8();
    U8();
    BP();
    g4();
    EH();
    MJY = {
        agentType: "main-session",
        whenToUse: "Main session query",
        source: "userSettings",
        getSystemPrompt: () => ""
    }
})
// @from(Ln 394388, Col 0)
function LVK(q) {
    if (q.startsWith("uds:")) return {
        scheme: "uds",
        target: q.slice(4)
    };
    if (q.startsWith("bridge:")) return {
        scheme: "bridge",
        target: q.slice(7)
    };
    if (q.startsWith("/")) return {
        scheme: "uds",
        target: q
    };
    return {
        scheme: "other",
        target: q
    }
}
// @from(Ln 394409, Col 0)
async function z38({
    agentId: q,
    prompt: K,
    toolUseContext: _,
    canUseTool: z,
    invokingRequestId: Y
}) {
    let A = Date.now(),
        O = _.getAppState(),
        {
            taskRegistry: w
        } = _,
        $ = O.toolPermissionContext.mode,
        [j, H] = await Promise.all([O36(w2(q)), o37(w2(q))]);
    if (!j) throw Error(`No transcript found for agent ID: ${q}`);
    let J = e48(qK8(oF8(j.messages))),
        X = gZ4(_.contentReplacementState, J, j.contentReplacements),
        M = H?.worktreePath ? await hVK.stat(H.worktreePath).then((C) => C.isDirectory() ? H.worktreePath : void 0, () => {
            E(`Resumed worktree ${H.worktreePath} no longer exists; falling back to parent cwd`);
            return
        }) : void 0;
    if (M) {
        let C = new Date;
        await hVK.utimes(M, C, C)
    }
    let P, W = !1;
    if (H?.agentType === bh6.agentType) P = bh6, W = !0;
    else if (H?.agentType) P = _.options.agentDefinitions.activeAgents.find((x) => x.agentType === H.agentType) ?? hc;
    else P = hc;
    let D = H?.description ?? "(resumed)",
        Z;
    if (W) {
        if (_.renderedSystemPrompt) Z = _.renderedSystemPrompt;
        else {
            let C = O.agent ? O.agentDefinitions.activeAgents.find((m) => m.agentType === O.agent) : void 0,
                x = Array.from(O.toolPermissionContext.additionalWorkingDirectories.keys()),
                B = await j0(_.options.tools, _.options.mainLoopModel, x);
            Z = ax({
                mainThreadAgentDefinition: C,
                toolUseContext: _,
                customSystemPrompt: _.options.customSystemPrompt,
                defaultSystemPrompt: B,
                appendSystemPrompt: _.options.appendSystemPrompt
            })
        }
        if (!Z) throw Error("Cannot resume fork agent: unable to reconstruct parent system prompt")
    }
    let G = BC6(P.model, _.options.mainLoopModel, void 0, $),
        f = {
            ...O.toolPermissionContext,
            mode: P.permissionMode ?? "acceptEdits"
        },
        v = _.options.tools.filter(yJ),
        V = W ? _.options.tools : cl(f, _.getAppState().mcp.tools.concat(v), {
            skipReplFilter: !0
        }),
        k = {
            agentDefinition: P,
            promptMessages: [...J, t8({
                content: K
            })],
            toolUseContext: _,
            canUseTool: z,
            isAsync: !0,
            querySource: ju8(P.agentType, Vj(P)),
            model: void 0,
            override: W ? {
                systemPrompt: Z
            } : void 0,
            availableTools: V,
            forkContextMessages: void 0,
            ...W && {
                useExactTools: !0
            },
            worktreePath: M,
            description: H?.description,
            contentReplacementState: X
        },
        N = wU8({
            agentId: q,
            description: D,
            prompt: K,
            selectedAgent: P,
            taskRegistry: w,
            toolUseId: _.toolUseId,
            cwd: M
        }),
        R = {
            prompt: K,
            resolvedAgentModel: G,
            isBuiltInAgent: Vj(P),
            startTime: A,
            agentType: P.agentType,
            isAsync: !0
        },
        h = {
            agentId: q,
            parentSessionId: kQ(),
            agentType: "subagent",
            subagentName: P.agentType,
            isBuiltIn: Vj(P),
            invokingRequestId: Y,
            invocationKind: "resume",
            invocationEmitted: !1
        };
    return eQ(h, () => eU6(M, () => Eg8({
        taskId: N.agentId,
        abortController: N.abortController,
        makeStream: (C) => _u({
            ...k,
            override: {
                ...k.override,
                agentId: w2(N.agentId),
                abortController: N.abortController
            },
            onCacheSafeParams: C
        }),
        metadata: R,
        description: D,
        toolUseContext: _,
        taskRegistry: w,
        agentIdForCleanup: q,
        enableSummarization: Ch6() || kx() || Ug(),
        getWorktreeResult: async () => M ? {
            worktreePath: M
        } : {}
    }))), {
        agentId: q,
        description: D,
        outputFile: $A(q)
    }
}