
// @from(Ln 126154, Col 4)
Y67 = v(() => {
    q67 = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool
Use this tool proactively in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. After receiving new instructions - Immediately capture user requirements as todos
6. When you start working on a task - Mark it as in_progress BEFORE beginning work. Ideally you should only have one todo as in_progress at a time
7. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no organizational benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: I'll help add a dark mode toggle to your application settings. Let me create a todo list to track this implementation.
*Creates todo list with the following items:*
1. Creating dark mode toggle component in Settings page
2. Adding dark mode state management (context/store)
3. Implementing CSS-in-JS styles for dark theme
4. Updating existing components to support theme switching
5. Running tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode is a multi-step feature requiring UI, state management, and styling changes
2. The user explicitly requested tests and build be run afterward
3. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: Let me first search through your codebase to find all occurrences of 'getCwd'.
*Uses grep or search tools to locate all instances of getCwd in the codebase*
Assistant: I've found 15 instances of 'getCwd' across 8 different files. Let me create a todo list to track these changes.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. First, the assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains code consistency
</reasoning>
</example>


<example>
User: I need to implement these features for my e-commerce site: user registration, product catalog, shopping cart, and checkout flow.
Assistant: I'll help implement these features. First, let's add all the features to the todo list.
*Creates a todo list breaking down each feature into specific tasks based on the project architecture*
Assistant: Let's start with user registration. This will involve creating database models, API endpoints, and frontend forms that integrate with your existing authentication system.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple complex features to implement in a comma separated list
2. The todo list helps organize these large features into manageable tasks
3. This approach allows for tracking progress across the entire implementation
</reasoning>
</example>

<example>
User: Can you help optimize my React application? It's rendering slowly and has performance issues.</user>
Assistant: I'll help optimize your React application. First, let me examine your codebase to identify potential performance bottlenecks.
*Reviews component structure, render patterns, state management, and data fetching*
Assistant: After analyzing your codebase, I've identified several performance issues. Let me create a todo list to track our optimization efforts.
*Creates todo list with items like: 1) Implementing memoization for expensive calculations in ProductList, 2) Adding virtualization for long lists in Dashboard, 3) Optimizing image loading in Gallery component, 4) Fixing state update loops in ShoppingCart, 5) Reviewing bundle size and implementing code splitting*
Let's start by implementing memoization for the expensive calculations in your ProductList component.</assistant>

<reasoning>
The assistant used the todo list because:
1. First, the assistant examined the codebase to identify specific performance issues
2. Based on this analysis, it identified multiple optimization opportunities
3. Performance optimization is a non-trivial task requiring multiple steps
4. The todo list helps methodically track improvements across different components
5. This systematic approach ensures all performance bottlenecks are addressed
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

python
print("Hello World")

This will output the text "Hello World" to the console when executed.</assistant>

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What does the git status command do?
Assistant: The git status command shows the current state of your working directory and staging area. It displays which changes have been staged, which haven't, and which files aren't being tracked by Git. This is a fundamental command for understanding the current state of your repository before making commits.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual coding task to complete. The user is simply asking for an explanation, not for the assistant to perform multiple steps or tasks.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the ${bq} tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location in the code. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: Run npm install for me and tell me what happens.
Assistant: I'll run the npm install command for you.

*Executes: npm install*

The command completed successfully. Here's the output:
[Output of npm install command]

All dependencies have been installed according to your package.json file.

<reasoning>
The assistant did not use the todo list because this is a single command execution with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward task.
</reasoning>
</example>

## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (limit to ONE task at a time)
   - completed: Task finished successfully

   **IMPORTANT**: Task descriptions must have two forms:
   - content: The imperative form describing what needs to be done (e.g., "Run tests", "Build the project")
   - activeForm: The present continuous form shown during execution (e.g., "Running tests", "Building the project")

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Exactly ONE task must be in_progress at any time (not less, not more)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - Tests are failing
     - Implementation is partial
     - You encountered unresolved errors
     - You couldn't find necessary files or dependencies

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names
   - Always provide both forms:
     - content: "Fix authentication bug"
     - activeForm: "Fixing authentication bug"

When in doubt, use this tool. Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully.
`
})
// @from(Ln 126339, Col 4)
ff5
// @from(Ln 126339, Col 9)
Vf5
// @from(Ln 126339, Col 14)
d_1
// @from(Ln 126340, Col 4)
Q7A = v(() => {
    i7();
    ff5 = u.enum(["pending", "in_progress", "completed"]), Vf5 = u.object({
        content: u.string().min(1, "Content cannot be empty"),
        status: ff5,
        activeForm: u.string().min(1, "Active form cannot be empty")
    }), d_1 = u.array(Vf5)
})
// @from(Ln 126349, Col 0)
function z67() {
    return null
}
// @from(Ln 126353, Col 0)
function w67() {
    return null
}
// @from(Ln 126357, Col 0)
function H67() {
    return null
}
// @from(Ln 126361, Col 0)
function $67() {
    return null
}
// @from(Ln 126365, Col 0)
function O67() {
    return null
}
// @from(Ln 126368, Col 4)
cg = "TodoWrite"
// @from(Ln 126373, Col 0)
function PL() {
    return g7A.getStore()
}
// @from(Ln 126377, Col 0)
function nq6(A, q) {
    return g7A.run(A, q)
}
// @from(Ln 126381, Col 0)
function MM() {
    return g7A.getStore() !== void 0
}
// @from(Ln 126385, Col 0)
function rq6(A) {
    return {
        ...A,
        isInProcess: !0
    }
}
// @from(Ln 126391, Col 4)
g7A
// @from(Ln 126392, Col 4)
Yv = v(() => {
    g7A = new Nf5
})
// @from(Ln 126395, Col 4)
d7A = {}
// @from(Ln 126417, Col 0)
function Dr() {
    let A = PL();
    if (A) return A.parentSessionId;
    return zv?.parentSessionId
}
// @from(Ln 126423, Col 0)
function Tf5(A) {
    zv = A
}
// @from(Ln 126427, Col 0)
function vf5() {
    zv = null
}
// @from(Ln 126431, Col 0)
function jC1() {
    return zv
}
// @from(Ln 126435, Col 0)
function ID() {
    let A = PL();
    if (A) return A.agentId;
    return zv?.agentId
}
// @from(Ln 126441, Col 0)
function g5() {
    let A = PL();
    if (A) return A.agentName;
    return zv?.agentName
}
// @from(Ln 126447, Col 0)
function i3(A) {
    let q = PL();
    if (q) return q.teamName;
    if (zv?.teamName) return zv.teamName;
    return A?.teamName
}
// @from(Ln 126454, Col 0)
function Dz() {
    if (PL()) return !0;
    return !!(zv?.agentId && zv?.teamName)
}
// @from(Ln 126459, Col 0)
function b$() {
    let A = PL();
    if (A) return A.color;
    return zv?.color
}
// @from(Ln 126465, Col 0)
function MC1() {
    let A = PL();
    if (A) return A.planModeRequired;
    if (zv !== null) return zv.planModeRequired;
    return process.env.CLAUDE_CODE_PLAN_MODE_REQUIRED === "true"
}
// @from(Ln 126472, Col 0)
function PM(A) {
    if (!A?.leadAgentId) return !1;
    let q = ID(),
        K = A.leadAgentId;
    if (q === K) return !0;
    if (!q) return !0;
    return !1
}
// @from(Ln 126481, Col 0)
function oq6(A) {
    for (let q of Object.values(A.tasks))
        if (q.type === "in_process_teammate" && q.status === "running") return !0;
    return !1
}
// @from(Ln 126487, Col 0)
function U7A(A) {
    for (let q of Object.values(A.tasks))
        if (q.type === "in_process_teammate" && q.status === "running" && !q.isIdle) return !0;
    return !1
}
// @from(Ln 126493, Col 0)
function p7A(A, q) {
    let K = [];
    for (let [Y, z] of Object.entries(q.tasks))
        if (z.type === "in_process_teammate" && z.status === "running" && !z.isIdle) K.push(Y);
    if (K.length === 0) return Promise.resolve();
    return new Promise((Y) => {
        let z = K.length,
            w = () => {
                if (z--, z === 0) Y()
            };
        A((H) => {
            let $ = {
                ...H.tasks
            };
            for (let O of K) {
                let _ = $[O];
                if (_ && _.type === "in_process_teammate")
                    if (_.isIdle) w();
                    else $[O] = {
                        ..._,
                        onIdleCallbacks: [..._.onIdleCallbacks ?? [], w]
                    }
            }
            return {
                ...H,
                tasks: $
            }
        })
    })
}
// @from(Ln 126523, Col 4)
zv = null
// @from(Ln 126524, Col 4)
Cz = v(() => {
    Yv();
    Yv()
})
// @from(Ln 126539, Col 0)
function X67(A) {
    i7A = A
}
// @from(Ln 126543, Col 0)
function D67() {
    i7A = void 0
}
// @from(Ln 126547, Col 0)
function j67(A) {
    return c7A.add(A), () => c7A.delete(A)
}
// @from(Ln 126551, Col 0)
function l_1() {
    for (let A of c7A) try {
        A()
    } catch {}
}
// @from(Ln 126557, Col 0)
function M67(A) {
    return c_1(WL(A), Lf5)
}
// @from(Ln 126561, Col 0)
function n7A(A) {
    let q = M67(A);
    try {
        let K = _67(q, "utf-8").trim(),
            Y = parseInt(K, 10);
        return isNaN(Y) ? 0 : Y
    } catch {
        return 0
    }
}
// @from(Ln 126572, Col 0)
function P67(A, q) {
    let K = M67(A);
    c8(K, String(q))
}
// @from(Ln 126577, Col 0)
function jH() {
    if (FY(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !1;
    if (J6(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !0;
    if (w4()) return !1;
    return !0
}
// @from(Ln 126584, Col 0)
function aq6(A) {
    let q = WL(A);
    GC1(A);
    let K = c_1(q, ".lock");
    if (!jr(K)) c8(K, "");
    let Y;
    try {
        Y = PC1.default.lockSync(K);
        let z = W67(A);
        if (z > 0) {
            let w = n7A(A);
            if (z > w) P67(A, z)
        }
        if (jr(q)) {
            let w = l7A(q);
            for (let H of w)
                if (H.endsWith(".json") && !H.startsWith(".")) {
                    let $ = c_1(q, H);
                    try {
                        J67($)
                    } catch {}
                }
        }
        l_1()
    } finally {
        if (Y) Y()
    }
}
// @from(Ln 126613, Col 0)
function WM() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = PL();
    if (A) return A.teamName;
    return i3() || i7A || U6()
}
// @from(Ln 126620, Col 0)
function i_1(A) {
    return A.replace(/[^a-zA-Z0-9_-]/g, "-")
}
// @from(Ln 126624, Col 0)
function WL(A) {
    return c_1(O8(), "tasks", i_1(A))
}
// @from(Ln 126628, Col 0)
function WC1(A, q) {
    return c_1(WL(A), `${i_1(q)}.json`)
}
// @from(Ln 126632, Col 0)
function GC1(A) {
    let q = WL(A);
    if (!jr(q)) Ef5(q, {
        recursive: !0
    })
}
// @from(Ln 126639, Col 0)
function W67(A) {
    let q = WL(A);
    if (!jr(q)) return 0;
    let K = l7A(q),
        Y = 0;
    for (let z of K) {
        if (!z.endsWith(".json")) continue;
        let w = parseInt(z.replace(".json", ""), 10);
        if (!isNaN(w) && w > Y) Y = w
    }
    return Y
}
// @from(Ln 126652, Col 0)
function Rf5(A) {
    let q = W67(A),
        K = n7A(A);
    return Math.max(q, K)
}
// @from(Ln 126658, Col 0)
function n_1(A, q) {
    let K = G67(A),
        Y;
    try {
        Y = PC1.default.lockSync(K);
        let z = Rf5(A),
            w = String(z + 1),
            H = {
                id: w,
                ...q
            },
            $ = WC1(A, w);
        return c8($, Q1(H, null, 2)), l_1(), w
    } finally {
        if (Y) Y()
    }
}
// @from(Ln 126676, Col 0)
function lg(A, q) {
    let K = WC1(A, q);
    try {
        let Y = _67(K, "utf-8"),
            z = _A(Y),
            w = kf5.safeParse(z);
        if (!w.success) return h(`[Tasks] Task ${q} failed schema validation: ${w.error.message}`), null;
        return w.data
    } catch (Y) {
        if (Y.code === "ENOENT") return null;
        return h(`[Tasks] Failed to read task ${q}: ${Y instanceof Error?Y.message:String(Y)}`), K1(Y instanceof Error ? Y : Error(String(Y))), null
    }
}
// @from(Ln 126690, Col 0)
function JS(A, q, K) {
    let Y = lg(A, q);
    if (!Y) return null;
    let z = {
            ...Y,
            ...K,
            id: q
        },
        w = WC1(A, q);
    return c8(w, Q1(z, null, 2)), l_1(), z
}
// @from(Ln 126702, Col 0)
function sq6(A, q) {
    let K = WC1(A, q);
    if (!jr(K)) return !1;
    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let w = n7A(A);
            if (Y > w) P67(A, Y)
        }
        J67(K);
        let z = WX(A);
        for (let w of z) {
            let H = w.blocks.filter((O) => O !== q),
                $ = w.blockedBy.filter((O) => O !== q);
            if (H.length !== w.blocks.length || $.length !== w.blockedBy.length) JS(A, w.id, {
                blocks: H,
                blockedBy: $
            })
        }
        return l_1(), !0
    } catch {
        return !1
    }
}
// @from(Ln 126727, Col 0)
function WX(A) {
    let q = WL(A);
    if (!jr(q)) return [];
    let K = l7A(q),
        Y = [];
    for (let z of K) {
        if (!z.endsWith(".json")) continue;
        let w = z.replace(".json", ""),
            H = lg(A, w);
        if (H) Y.push(H)
    }
    return Y
}
// @from(Ln 126741, Col 0)
function r7A(A, q, K) {
    let Y = lg(A, q),
        z = lg(A, K);
    if (!Y || !z) return !1;
    if (!Y.blocks.includes(K)) JS(A, q, {
        blocks: [...Y.blocks, K]
    });
    if (!z.blockedBy.includes(q)) JS(A, K, {
        blockedBy: [...z.blockedBy, q]
    });
    return !0
}
// @from(Ln 126754, Col 0)
function yf5(A) {
    return c_1(WL(A), ".lock")
}
// @from(Ln 126758, Col 0)
function G67(A) {
    GC1(A);
    let q = yf5(A);
    if (!jr(q)) c8(q, "");
    return q
}
// @from(Ln 126765, Col 0)
function o7A(A, q, K, Y = {}) {
    let z = WC1(A, q);
    if (!jr(z)) return {
        success: !1,
        reason: "task_not_found"
    };
    if (Y.checkAgentBusy) return Cf5(A, q, K);
    let w;
    try {
        w = PC1.default.lockSync(z);
        let H = lg(A, q);
        if (!H) return {
            success: !1,
            reason: "task_not_found"
        };
        if (H.owner && H.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: H
        };
        if (H.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: H
        };
        let $ = WX(A),
            O = new Set($.filter((X) => X.status !== "completed").map((X) => X.id)),
            _ = H.blockedBy.filter((X) => O.has(X));
        if (_.length > 0) return {
            success: !1,
            reason: "blocked",
            task: H,
            blockedByTasks: _
        };
        return {
            success: !0,
            task: JS(A, q, {
                owner: K
            })
        }
    } catch (H) {
        return h(`[Tasks] Failed to claim task ${q}: ${H instanceof Error?H.message:String(H)}`), K1(H instanceof Error ? H : Error(String(H))), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (w) w()
    }
}
// @from(Ln 126815, Col 0)
function Cf5(A, q, K) {
    let Y = G67(A),
        z;
    try {
        z = PC1.default.lockSync(Y);
        let w = WX(A),
            H = w.find((X) => X.id === q);
        if (!H) return {
            success: !1,
            reason: "task_not_found"
        };
        if (H.owner && H.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: H
        };
        if (H.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: H
        };
        let $ = new Set(w.filter((X) => X.status !== "completed").map((X) => X.id)),
            O = H.blockedBy.filter((X) => $.has(X));
        if (O.length > 0) return {
            success: !1,
            reason: "blocked",
            task: H,
            blockedByTasks: O
        };
        let _ = w.filter((X) => X.status !== "completed" && X.owner === K && X.id !== q);
        if (_.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: H,
            busyWithTasks: _.map((X) => X.id)
        };
        return {
            success: !0,
            task: JS(A, q, {
                owner: K
            })
        }
    } catch (w) {
        return h(`[Tasks] Failed to claim task ${q} with busy check: ${w instanceof Error?w.message:String(w)}`), K1(w instanceof Error ? w : Error(String(w))), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) z()
    }
}
// @from(Ln 126867, Col 0)
function Mr(A, q, K, Y) {
    let w = WX(A).filter((O) => O.status !== "completed" && (O.owner === q || O.owner === K));
    for (let O of w) JS(A, O.id, {
        owner: void 0,
        status: "pending"
    });
    if (w.length > 0) h(`[Tasks] Unassigned ${w.length} task(s) from ${K}`);
    let $ = `${K} ${Y==="terminated"?"was terminated":"has shut down"}.`;
    if (w.length > 0) {
        let O = w.map((_) => `#${_.id} "${_.subject}"`).join(", ");
        $ += ` ${w.length} task(s) were unassigned: ${O}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: w.map((O) => ({
            id: O.id,
            subject: O.subject
        })),
        notificationMessage: $
    }
}
// @from(Ln 126887, Col 4)
PC1
// @from(Ln 126887, Col 9)
c7A
// @from(Ln 126887, Col 14)
i7A
// @from(Ln 126887, Col 19)
J71
// @from(Ln 126887, Col 24)
kf5
// @from(Ln 126887, Col 29)
Lf5 = ".highwatermark"
// @from(Ln 126888, Col 4)
a7A = "tasklist"
// @from(Ln 126889, Col 4)
vw = v(() => {
    m6();
    hA();
    B6();
    hA();
    i7();
    y6();
    Z6();
    m6();
    Cz();
    Yv();
    PC1 = o(NQ(), 1), c7A = new Set;
    J71 = u.enum(["pending", "in_progress", "completed"]), kf5 = u.object({
        id: u.string(),
        subject: u.string(),
        description: u.string(),
        activeForm: u.string().optional(),
        owner: u.string().optional(),
        status: J71,
        blocks: u.array(u.string()),
        blockedBy: u.array(u.string()),
        metadata: u.record(u.string(), u.unknown()).optional()
    })
})
// @from(Ln 126913, Col 4)
Sf5
// @from(Ln 126913, Col 9)
hf5
// @from(Ln 126913, Col 14)
bO
// @from(Ln 126914, Col 4)
r_1 = v(() => {
    i7();
    Y67();
    Q7A();
    B6();
    vw();
    Sf5 = z7(() => u.strictObject({
        todos: d_1.describe("The updated todo list")
    })), hf5 = z7(() => u.object({
        oldTodos: d_1.describe("The todo list before the update"),
        newTodos: d_1.describe("The todo list after the update")
    })), bO = {
        name: cg,
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            todos: [{
                content: "Fix the login bug",
                status: "pending",
                activeForm: "Fixing the login bug"
            }]
        }, {
            todos: [{
                content: "Implement feature",
                status: "completed",
                activeForm: "Implementing feature"
            }, {
                content: "Write unit tests",
                status: "in_progress",
                activeForm: "Writing unit tests"
            }]
        }],
        async description() {
            return K67
        },
        async prompt() {
            return q67
        },
        get inputSchema() {
            return Sf5()
        },
        get outputSchema() {
            return hf5()
        },
        userFacingName() {
            return ""
        },
        isEnabled() {
            return !jH()
        },
        isConcurrencySafe() {
            return !1
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
        renderToolUseMessage: z67,
        renderToolUseProgressMessage: w67,
        renderToolUseRejectedMessage: H67,
        renderToolUseErrorMessage: $67,
        renderToolResultMessage: O67,
        async call({
            todos: A
        }, q) {
            let K = await q.getAppState(),
                Y = q.agentId ?? U6(),
                z = K.todos[Y] ?? [],
                w = A.every((H) => H.status === "completed") ? [] : A;
            return q.setAppState((H) => ({
                ...H,
                todos: {
                    ...H.todos,
                    [Y]: w
                }
            })), {
                data: {
                    oldTodos: z,
                    newTodos: A
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
            }
        }
    }
})
// @from(Ln 127010, Col 4)
Z67
// @from(Ln 127010, Col 9)
If5
// @from(Ln 127010, Col 14)
e = function(A) {
    return If5.H.useMemoCache(A)
}
// @from(Ln 127013, Col 4)
i1 = v(() => {
    Z67 = o(X1(), 1), If5 = Z67.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
})
// @from(Ln 127017, Col 0)
function f67(A, q, {
    signal: K,
    edges: Y
} = {}) {
    let z = void 0,
        w = null,
        H = Y != null && Y.includes("leading"),
        $ = Y == null || Y.includes("trailing"),
        O = () => {
            if (w !== null) A.apply(z, w), z = void 0, w = null
        },
        _ = () => {
            if ($) O();
            j()
        },
        J = null,
        X = () => {
            if (J != null) clearTimeout(J);
            J = setTimeout(() => {
                J = null, _()
            }, q)
        },
        D = () => {
            if (J !== null) clearTimeout(J), J = null
        },
        j = () => {
            D(), z = void 0, w = null
        },
        M = () => {
            D(), O()
        },
        P = function(...W) {
            if (K?.aborted) return;
            z = this, w = W;
            let G = J == null;
            if (X(), H && G) O()
        };
    return P.schedule = X, P.cancel = j, P.flush = M, K?.addEventListener("abort", j, {
        once: !0
    }), P
}
// @from(Ln 127058, Col 4)
V67 = () => {}
// @from(Ln 127060, Col 0)
function N67(A, q = 0, K = {}) {
    if (typeof K !== "object") K = {};
    let {
        signal: Y,
        leading: z = !1,
        trailing: w = !0,
        maxWait: H
    } = K, $ = Array(2);
    if (z) $[0] = "leading";
    if (w) $[1] = "trailing";
    let O = void 0,
        _ = null,
        J = f67(function(...j) {
            O = A.apply(this, j), _ = null
        }, q, {
            signal: Y,
            edges: $
        }),
        X = function(...j) {
            if (H != null) {
                if (_ === null) _ = Date.now();
                else if (Date.now() - _ >= H) return O = A.apply(this, j), _ = Date.now(), J.cancel(), J.schedule(), O
            }
            return J.apply(this, j), O
        },
        D = () => {
            return J.flush(), O
        };
    return X.cancel = J.cancel, X.flush = D, X
}
// @from(Ln 127090, Col 4)
T67 = v(() => {
    V67()
})
// @from(Ln 127094, Col 0)
function s7A(A, q = 0, K = {}) {
    if (typeof K !== "object") K = {};
    let {
        leading: Y = !0,
        trailing: z = !0,
        signal: w
    } = K;
    return N67(A, q, {
        leading: Y,
        trailing: z,
        signal: w,
        maxWait: q
    })
}
// @from(Ln 127108, Col 4)
v67 = v(() => {
    T67()
})
// @from(Ln 127111, Col 4)
E67 = v(() => {
    v67()
})
// @from(Ln 127115, Col 0)
function t7A(A, {
    include: q,
    exclude: K
} = {}) {
    let Y = (z) => {
        let w = (H) => typeof H === "string" ? z === H : H.test(z);
        if (q) return q.some(w);
        if (K) return !K.some(w);
        return !0
    };
    for (let [z, w] of xf5(A.constructor.prototype)) {
        if (w === "constructor" || !Y(w)) continue;
        let H = Reflect.getOwnPropertyDescriptor(z, w);
        if (H && typeof H.value === "function") A[w] = A[w].bind(A)
    }
    return A
}
// @from(Ln 127132, Col 4)
xf5 = (A) => {
    let q = new Set;
    do
        for (let K of Reflect.ownKeys(A)) q.add([A, K]); while ((A = Reflect.getPrototypeOf(A)) && A !== Object.prototype);
    return q
}
// @from(Ln 127141, Col 4)
L67
// @from(Ln 127141, Col 9)
e7A
// @from(Ln 127141, Col 14)
bf5 = (A) => {
        let q = new k67,
            K = new k67;
        q.write = (z) => {
            A("stdout", z)
        }, K.write = (z) => {
            A("stderr", z)
        };
        let Y = new console.Console(q, K);
        for (let z of L67) e7A[z] = console[z], console[z] = Y[z];
        return () => {
            for (let z of L67) console[z] = e7A[z];
            e7A = {}
        }
    }
// @from(Ln 127156, Col 4)
R67
// @from(Ln 127157, Col 4)
y67 = v(() => {
    L67 = ["assert", "count", "countReset", "debug", "dir", "dirxml", "error", "group", "groupCollapsed", "groupEnd", "info", "log", "table", "time", "timeEnd", "timeLog", "trace", "warn"], e7A = {}, R67 = bf5
})
// @from(Ln 127161, Col 0)
function K4A(A, q) {
    var K = A.length;
    A.push(q);
    A: for (; 0 < K;) {
        var Y = K - 1 >>> 1,
            z = A[Y];
        if (0 < tq6(z, q)) A[Y] = q, A[K] = z, K = Y;
        else break A
    }
}
// @from(Ln 127172, Col 0)
function Ju(A) {
    return A.length === 0 ? null : A[0]
}
// @from(Ln 127176, Col 0)
function KK6(A) {
    if (A.length === 0) return null;
    var q = A[0],
        K = A.pop();
    if (K !== q) {
        A[0] = K;
        A: for (var Y = 0, z = A.length, w = z >>> 1; Y < w;) {
            var H = 2 * (Y + 1) - 1,
                $ = A[H],
                O = H + 1,
                _ = A[O];
            if (0 > tq6($, K)) O < z && 0 > tq6(_, $) ? (A[Y] = _, A[O] = K, Y = O) : (A[Y] = $, A[H] = K, Y = H);
            else if (O < z && 0 > tq6(_, K)) A[Y] = _, A[O] = K, Y = O;
            else break A
        }
    }
    return q
}
// @from(Ln 127195, Col 0)
function tq6(A, q) {
    var K = A.sortIndex - q.sortIndex;
    return K !== 0 ? K : A.id - q.id
}
// @from(Ln 127200, Col 0)
function AK6(A) {
    for (var q = Ju(Pr); q !== null;) {
        if (q.callback === null) KK6(Pr);
        else if (q.startTime <= A) KK6(Pr), q.sortIndex = q.expirationTime, K4A(ig, q);
        else break;
        q = Ju(Pr)
    }
}
// @from(Ln 127209, Col 0)
function O4A(A) {
    if (fC1 = !1, AK6(A), !ZC1)
        if (Ju(ig) !== null) ZC1 = !0, a_1 || (a_1 = !0, o_1());
        else {
            var q = Ju(Pr);
            q !== null && _4A(O4A, q.startTime - A)
        }
}
// @from(Ln 127218, Col 0)
function x67() {
    return $4A ? !0 : Xu() - I67 < Bf5 ? !1 : !0
}
// @from(Ln 127222, Col 0)
function q4A() {
    if ($4A = !1, a_1) {
        var A = Xu();
        I67 = A;
        var q = !0;
        try {
            A: {
                ZC1 = !1,
                fC1 && (fC1 = !1, h67(VC1), VC1 = -1),
                w4A = !0;
                var K = A4A;
                try {
                    q: {
                        AK6(A);
                        for (GL = Ju(ig); GL !== null && !(GL.expirationTime > A && x67());) {
                            var Y = GL.callback;
                            if (typeof Y === "function") {
                                GL.callback = null, A4A = GL.priorityLevel;
                                var z = Y(GL.expirationTime <= A);
                                if (A = Xu(), typeof z === "function") {
                                    GL.callback = z, AK6(A), q = !0;
                                    break q
                                }
                                GL === Ju(ig) && KK6(ig), AK6(A)
                            } else KK6(ig);
                            GL = Ju(ig)
                        }
                        if (GL !== null) q = !0;
                        else {
                            var w = Ju(Pr);
                            w !== null && _4A(O4A, w.startTime - A), q = !1
                        }
                    }
                    break A
                }
                finally {
                    GL = null, A4A = K, w4A = !1
                }
                q = void 0
            }
        }
        finally {
            q ? o_1() : a_1 = !1
        }
    }
}
// @from(Ln 127269, Col 0)
function _4A(A, q) {
    VC1 = S67(function() {
        A(Xu())
    }, q)
}
// @from(Ln 127274, Col 4)
Xu = void 0
// @from(Ln 127275, Col 4)
Y4A
// @from(Ln 127275, Col 9)
eq6
// @from(Ln 127275, Col 14)
z4A
// @from(Ln 127275, Col 19)
ig
// @from(Ln 127275, Col 23)
Pr
// @from(Ln 127275, Col 27)
uf5 = 1
// @from(Ln 127276, Col 4)
GL = null
// @from(Ln 127277, Col 4)
A4A = 3
// @from(Ln 127278, Col 4)
w4A = !1
// @from(Ln 127279, Col 4)
ZC1 = !1
// @from(Ln 127280, Col 4)
fC1 = !1
// @from(Ln 127281, Col 4)
$4A = !1
// @from(Ln 127282, Col 4)
S67
// @from(Ln 127282, Col 9)
h67
// @from(Ln 127282, Col 14)
C67
// @from(Ln 127282, Col 19)
a_1 = !1
// @from(Ln 127283, Col 4)
VC1 = -1
// @from(Ln 127284, Col 4)
Bf5 = 5
// @from(Ln 127285, Col 4)
I67 = -1
// @from(Ln 127286, Col 4)
o_1
// @from(Ln 127286, Col 9)
qK6
// @from(Ln 127286, Col 14)
H4A
// @from(Ln 127286, Col 19)
J4A = 5
// @from(Ln 127287, Col 4)
X4A = 1
// @from(Ln 127288, Col 4)
YK6 = 3
// @from(Ln 127289, Col 4)
D4A = 2
// @from(Ln 127290, Col 4)
j4A = function(A) {
        A.callback = null
    }
// @from(Ln 127293, Col 4)
M4A = function() {
        $4A = !0
    }
// @from(Ln 127296, Col 4)
zK6 = function(A, q, K) {
        var Y = Xu();
        switch (typeof K === "object" && K !== null ? (K = K.delay, K = typeof K === "number" && 0 < K ? Y + K : Y) : K = Y, A) {
            case 1:
                var z = -1;
                break;
            case 2:
                z = 250;
                break;
            case 5:
                z = 1073741823;
                break;
            case 4:
                z = 1e4;
                break;
            default:
                z = 5000
        }
        return z = K + z, A = {
            id: uf5++,
            callback: q,
            priorityLevel: A,
            startTime: K,
            expirationTime: z,
            sortIndex: -1
        }, K > Y ? (A.sortIndex = K, K4A(Pr, A), Ju(ig) === null && A === Ju(Pr) && (fC1 ? (h67(VC1), VC1 = -1) : fC1 = !0, _4A(O4A, K - Y))) : (A.sortIndex = z, K4A(ig, A), ZC1 || w4A || (ZC1 = !0, a_1 || (a_1 = !0, o_1()))), A
    }
// @from(Ln 127323, Col 4)
P4A
// @from(Ln 127324, Col 4)
u67 = v(() => {
    if (typeof performance === "object" && typeof performance.now === "function") Y4A = performance, Xu = function() {
        return Y4A.now()
    };
    else eq6 = Date, z4A = eq6.now(), Xu = function() {
        return eq6.now() - z4A
    };
    ig = [], Pr = [], S67 = typeof setTimeout === "function" ? setTimeout : null, h67 = typeof clearTimeout === "function" ? clearTimeout : null, C67 = typeof setImmediate < "u" ? setImmediate : null;
    if (typeof C67 === "function") o_1 = function() {
        C67(q4A)
    };
    else if (typeof MessageChannel < "u") qK6 = new MessageChannel, H4A = qK6.port2, qK6.port1.onmessage = q4A, o_1 = function() {
        H4A.postMessage(null)
    };
    else o_1 = function() {
        S67(q4A, 0)
    };
    P4A = x67
})