
// @from(Ln 161345, Col 4)
FCB = w(() => {
  KCB = `Use this tool to create and manage a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
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
* Uses the ${I8} tool to add a comment to the calculateTotal function *

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
// @from(Ln 161530, Col 4)
NX8
// @from(Ln 161530, Col 9)
wX8
// @from(Ln 161530, Col 14)
jIA
// @from(Ln 161531, Col 4)
a10 = w(() => {
  j9();
  NX8 = m.enum(["pending", "in_progress", "completed"]), wX8 = m.object({
    content: m.string().min(1, "Content cannot be empty"),
    status: NX8,
    activeForm: m.string().min(1, "Active form cannot be empty")
  }), jIA = m.array(wX8)
})
// @from(Ln 161540, Col 0)
function HCB() {
  return null
}
// @from(Ln 161544, Col 0)
function ECB() {
  return null
}
// @from(Ln 161548, Col 0)
function zCB() {
  return null
}
// @from(Ln 161552, Col 0)
function $CB() {
  return null
}
// @from(Ln 161556, Col 0)
function CCB() {
  return null
}
// @from(Ln 161559, Col 4)
Bm = "TodoWrite"
// @from(Ln 161561, Col 0)
function UCB(A) {
  return
}
// @from(Ln 161564, Col 4)
qCB = () => {}
// @from(Ln 161576, Col 0)
function wCB(A) {
  return o10.add(A), () => o10.delete(A)
}
// @from(Ln 161580, Col 0)
function LCB() {
  for (let A of o10) try {
    A()
  } catch {}
}
// @from(Ln 161586, Col 0)
function Gm() {
  return !1
}
// @from(Ln 161590, Col 0)
function OCB(A) {
  let Q = La(A);
  t10(A);
  let B = CB1(Q, ".lock");
  if (!TIA(B)) bB(B, "");
  let G;
  try {
    if (G = NCB.default.lockSync(B), TIA(Q)) {
      let Z = s10(Q);
      for (let Y of Z)
        if (Y.endsWith(".json") && !Y.startsWith(".")) {
          let J = CB1(Q, Y);
          try {
            MX8(J)
          } catch {}
        }
    }
    r10.delete(A), LCB()
  } finally {
    if (G) G()
  }
}
// @from(Ln 161613, Col 0)
function PIA() {
  return process.env.CLAUDE_CODE_TASK_LIST_ID || UCB() || q0()
}
// @from(Ln 161617, Col 0)
function MCB(A) {
  return A.replace(/[^a-zA-Z0-9_-]/g, "-")
}
// @from(Ln 161621, Col 0)
function La(A) {
  return CB1(zQ(), "tasks", MCB(A))
}
// @from(Ln 161625, Col 0)
function RCB(A, Q) {
  return CB1(La(A), `${MCB(Q)}.json`)
}
// @from(Ln 161629, Col 0)
function t10(A) {
  let Q = La(A);
  if (!TIA(Q)) LX8(Q, {
    recursive: !0
  })
}
// @from(Ln 161636, Col 0)
function jX8(A) {
  let Q = La(A);
  if (!TIA(Q)) return 0;
  let B = s10(Q),
    G = 0;
  for (let Z of B) {
    if (!Z.endsWith(".json")) continue;
    let Y = parseInt(Z.replace(".json", ""), 10);
    if (!isNaN(Y) && Y > G) G = Y
  }
  return G
}
// @from(Ln 161649, Col 0)
function TX8(A) {
  t10(A);
  let Q = r10.get(A);
  if (Q === void 0) Q = jX8(A);
  return Q++, r10.set(A, Q), String(Q)
}
// @from(Ln 161656, Col 0)
function _CB(A, Q) {
  let B = TX8(A),
    G = {
      id: B,
      ...Q
    },
    Z = RCB(A, B);
  return bB(Z, eA(G, null, 2)), LCB(), B
}
// @from(Ln 161666, Col 0)
function PX8(A, Q) {
  let B = RCB(A, Q);
  if (!TIA(B)) return null;
  try {
    let G = OX8(B, "utf-8"),
      Z = AQ(G),
      Y = _X8.safeParse(Z);
    if (!Y.success) return k(`[Tasks] Task ${Q} failed schema validation: ${Y.error.message}`), null;
    return Y.data
  } catch (G) {
    return k(`[Tasks] Failed to read task ${Q}: ${G instanceof Error?G.message:String(G)}`), e(G instanceof Error ? G : Error(String(G))), null
  }
}
// @from(Ln 161680, Col 0)
function RBA(A) {
  let Q = La(A);
  if (!TIA(Q)) return [];
  let B = s10(Q),
    G = [];
  for (let Z of B) {
    if (!Z.endsWith(".json")) continue;
    let Y = Z.replace(".json", ""),
      J = PX8(A, Y);
    if (J) G.push(J)
  }
  return G
}
// @from(Ln 161693, Col 4)
NCB
// @from(Ln 161693, Col 9)
o10
// @from(Ln 161693, Col 14)
RX8
// @from(Ln 161693, Col 19)
_X8
// @from(Ln 161693, Col 24)
r10
// @from(Ln 161693, Col 29)
e10 = "tasklist"
// @from(Ln 161694, Col 4)
Oa = w(() => {
  A0();
  fQ();
  C0();
  j9();
  v1();
  T1();
  A0();
  qCB();
  NCB = c(qi(), 1), o10 = new Set;
  RX8 = m.enum(["pending", "in_progress", "completed"]), _X8 = m.object({
    id: m.string(),
    subject: m.string(),
    description: m.string(),
    activeForm: m.string().optional(),
    owner: m.string().optional(),
    status: RX8,
    blocks: m.array(m.string()),
    blockedBy: m.array(m.string())
  });
  r10 = new Map
})
// @from(Ln 161716, Col 4)
SX8
// @from(Ln 161716, Col 9)
xX8
// @from(Ln 161716, Col 14)
vD
// @from(Ln 161717, Col 4)
SIA = w(() => {
  j9();
  FCB();
  a10();
  C0();
  Oa();
  SX8 = m.strictObject({
    todos: jIA.describe("The updated todo list")
  }), xX8 = m.object({
    oldTodos: jIA.describe("The todo list before the update"),
    newTodos: jIA.describe("The todo list after the update")
  }), vD = {
    name: Bm,
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
      return VCB
    },
    async prompt() {
      return KCB
    },
    inputSchema: SX8,
    outputSchema: xX8,
    userFacingName() {
      return ""
    },
    isEnabled() {
      return !Gm()
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
    renderToolUseMessage: HCB,
    renderToolUseProgressMessage: ECB,
    renderToolUseRejectedMessage: zCB,
    renderToolUseErrorMessage: $CB,
    renderToolResultMessage: CCB,
    async call({
      todos: A
    }, Q) {
      let B = await Q.getAppState(),
        G = Q.agentId ?? q0(),
        Z = B.todos[G] ?? [],
        Y = A.every((J) => J.status === "completed") ? [] : A;
      return Q.setAppState((J) => ({
        ...J,
        todos: {
          ...J.todos,
          [G]: Y
        }
      })), {
        data: {
          oldTodos: Z,
          newTodos: A
        }
      }
    },
    mapToolResultToToolResultBlockParam(A, Q) {
      return {
        tool_use_id: Q,
        type: "tool_result",
        content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
      }
    }
  }
})
// @from(Ln 161810, Col 0)
function jCB(A, Q, {
  signal: B,
  edges: G
} = {}) {
  let Z = void 0,
    Y = null,
    J = G != null && G.includes("leading"),
    X = G == null || G.includes("trailing"),
    I = () => {
      if (Y !== null) A.apply(Z, Y), Z = void 0, Y = null
    },
    D = () => {
      if (X) I();
      F()
    },
    W = null,
    K = () => {
      if (W != null) clearTimeout(W);
      W = setTimeout(() => {
        W = null, D()
      }, Q)
    },
    V = () => {
      if (W !== null) clearTimeout(W), W = null
    },
    F = () => {
      V(), Z = void 0, Y = null
    },
    H = () => {
      V(), I()
    },
    E = function (...z) {
      if (B?.aborted) return;
      Z = this, Y = z;
      let $ = W == null;
      if (K(), J && $) I()
    };
  return E.schedule = K, E.cancel = F, E.flush = H, B?.addEventListener("abort", F, {
    once: !0
  }), E
}
// @from(Ln 161851, Col 4)
TCB = () => {}
// @from(Ln 161853, Col 0)
function PCB(A, Q = 0, B = {}) {
  if (typeof B !== "object") B = {};
  let {
    signal: G,
    leading: Z = !1,
    trailing: Y = !0,
    maxWait: J
  } = B, X = Array(2);
  if (Z) X[0] = "leading";
  if (Y) X[1] = "trailing";
  let I = void 0,
    D = null,
    W = jCB(function (...F) {
      I = A.apply(this, F), D = null
    }, Q, {
      signal: G,
      edges: X
    }),
    K = function (...F) {
      if (J != null) {
        if (D === null) D = Date.now();
        else if (Date.now() - D >= J) return I = A.apply(this, F), D = Date.now(), W.cancel(), W.schedule(), I
      }
      return W.apply(this, F), I
    },
    V = () => {
      return W.flush(), I
    };
  return K.cancel = W.cancel, K.flush = V, K
}
// @from(Ln 161883, Col 4)
SCB = w(() => {
  TCB()
})
// @from(Ln 161887, Col 0)
function A00(A, Q = 0, B = {}) {
  if (typeof B !== "object") B = {};
  let {
    leading: G = !0,
    trailing: Z = !0,
    signal: Y
  } = B;
  return PCB(A, Q, {
    leading: G,
    trailing: Z,
    signal: Y,
    maxWait: Q
  })
}
// @from(Ln 161901, Col 4)
xCB = w(() => {
  SCB()
})
// @from(Ln 161904, Col 4)
yCB = w(() => {
  xCB()
})
// @from(Ln 161908, Col 0)
function Q00(A, {
  include: Q,
  exclude: B
} = {}) {
  let G = (Z) => {
    let Y = (J) => typeof J === "string" ? Z === J : J.test(Z);
    if (Q) return Q.some(Y);
    if (B) return !B.some(Y);
    return !0
  };
  for (let [Z, Y] of yX8(A.constructor.prototype)) {
    if (Y === "constructor" || !G(Y)) continue;
    let J = Reflect.getOwnPropertyDescriptor(Z, Y);
    if (J && typeof J.value === "function") A[Y] = A[Y].bind(A)
  }
  return A
}
// @from(Ln 161925, Col 4)
yX8 = (A) => {
  let Q = new Set;
  do
    for (let B of Reflect.ownKeys(A)) Q.add([A, B]); while ((A = Reflect.getPrototypeOf(A)) && A !== Object.prototype);
  return Q
}
// @from(Ln 161934, Col 4)
kCB
// @from(Ln 161934, Col 9)
B00
// @from(Ln 161934, Col 14)
vX8 = (A) => {
    let Q = new vCB,
      B = new vCB;
    Q.write = (Z) => {
      A("stdout", Z)
    }, B.write = (Z) => {
      A("stderr", Z)
    };
    let G = new console.Console(Q, B);
    for (let Z of kCB) B00[Z] = console[Z], console[Z] = G[Z];
    return () => {
      for (let Z of kCB) console[Z] = B00[Z];
      B00 = {}
    }
  }
// @from(Ln 161949, Col 2)
bCB
// @from(Ln 161950, Col 4)
fCB = w(() => {
  kCB = ["assert", "count", "countReset", "debug", "dir", "dirxml", "error", "group", "groupCollapsed", "groupEnd", "info", "log", "table", "time", "timeEnd", "timeLog", "trace", "warn"], B00 = {}, bCB = vX8
})
// @from(Ln 161954, Col 0)
function Y00(A, Q) {
  var B = A.length;
  A.push(Q);
  A: for (; 0 < B;) {
    var G = B - 1 >>> 1,
      Z = A[G];
    if (0 < UB1(Z, Q)) A[G] = Q, A[B] = Z, B = G;
    else break A
  }
}
// @from(Ln 161965, Col 0)
function Ck(A) {
  return A.length === 0 ? null : A[0]
}
// @from(Ln 161969, Col 0)
function LB1(A) {
  if (A.length === 0) return null;
  var Q = A[0],
    B = A.pop();
  if (B !== Q) {
    A[0] = B;
    A: for (var G = 0, Z = A.length, Y = Z >>> 1; G < Y;) {
      var J = 2 * (G + 1) - 1,
        X = A[J],
        I = J + 1,
        D = A[I];
      if (0 > UB1(X, B)) I < Z && 0 > UB1(D, X) ? (A[G] = D, A[I] = B, G = I) : (A[G] = X, A[J] = B, G = J);
      else if (I < Z && 0 > UB1(D, B)) A[G] = D, A[I] = B, G = I;
      else break A
    }
  }
  return Q
}
// @from(Ln 161988, Col 0)
function UB1(A, Q) {
  var B = A.sortIndex - Q.sortIndex;
  return B !== 0 ? B : A.id - Q.id
}
// @from(Ln 161993, Col 0)
function NB1(A) {
  for (var Q = Ck(Ma); Q !== null;) {
    if (Q.callback === null) LB1(Ma);
    else if (Q.startTime <= A) LB1(Ma), Q.sortIndex = Q.expirationTime, Y00(Zm, Q);
    else break;
    Q = Ck(Ma)
  }
}
// @from(Ln 162002, Col 0)
function K00(A) {
  if (H_A = !1, NB1(A), !F_A)
    if (Ck(Zm) !== null) F_A = !0, yIA || (yIA = !0, xIA());
    else {
      var Q = Ck(Ma);
      Q !== null && V00(K00, Q.startTime - A)
    }
}
// @from(Ln 162011, Col 0)
function dCB() {
  return W00 ? !0 : Uk() - mCB < bX8 ? !1 : !0
}
// @from(Ln 162015, Col 0)
function Z00() {
  if (W00 = !1, yIA) {
    var A = Uk();
    mCB = A;
    var Q = !0;
    try {
      A: {
        F_A = !1,
        H_A && (H_A = !1, uCB(E_A), E_A = -1),
        I00 = !0;
        var B = G00;
        try {
          Q: {
            NB1(A);
            for (oR = Ck(Zm); oR !== null && !(oR.expirationTime > A && dCB());) {
              var G = oR.callback;
              if (typeof G === "function") {
                oR.callback = null, G00 = oR.priorityLevel;
                var Z = G(oR.expirationTime <= A);
                if (A = Uk(), typeof Z === "function") {
                  oR.callback = Z, NB1(A), Q = !0;
                  break Q
                }
                oR === Ck(Zm) && LB1(Zm), NB1(A)
              } else LB1(Zm);
              oR = Ck(Zm)
            }
            if (oR !== null) Q = !0;
            else {
              var Y = Ck(Ma);
              Y !== null && V00(K00, Y.startTime - A), Q = !1
            }
          }
          break A
        }
        finally {
          oR = null, G00 = B, I00 = !1
        }
        Q = void 0
      }
    }
    finally {
      Q ? xIA() : yIA = !1
    }
  }
}
// @from(Ln 162062, Col 0)
function V00(A, Q) {
  E_A = gCB(function () {
    A(Uk())
  }, Q)
}
// @from(Ln 162067, Col 4)
Uk = void 0
// @from(Ln 162068, Col 2)
J00
// @from(Ln 162068, Col 7)
qB1
// @from(Ln 162068, Col 12)
X00
// @from(Ln 162068, Col 17)
Zm
// @from(Ln 162068, Col 21)
Ma
// @from(Ln 162068, Col 25)
kX8 = 1
// @from(Ln 162069, Col 2)
oR = null
// @from(Ln 162070, Col 2)
G00 = 3
// @from(Ln 162071, Col 2)
I00 = !1
// @from(Ln 162072, Col 2)
F_A = !1
// @from(Ln 162073, Col 2)
H_A = !1
// @from(Ln 162074, Col 2)
W00 = !1
// @from(Ln 162075, Col 2)
gCB
// @from(Ln 162075, Col 7)
uCB
// @from(Ln 162075, Col 12)
hCB
// @from(Ln 162075, Col 17)
yIA = !1
// @from(Ln 162076, Col 2)
E_A = -1
// @from(Ln 162077, Col 2)
bX8 = 5
// @from(Ln 162078, Col 2)
mCB = -1
// @from(Ln 162079, Col 2)
xIA
// @from(Ln 162079, Col 7)
wB1
// @from(Ln 162079, Col 12)
D00
// @from(Ln 162079, Col 17)
F00 = 5
// @from(Ln 162080, Col 2)
H00 = 1
// @from(Ln 162081, Col 2)
OB1 = 3
// @from(Ln 162082, Col 2)
E00 = 2
// @from(Ln 162083, Col 2)
z00 = function (A) {
    A.callback = null
  }
// @from(Ln 162086, Col 2)
$00 = function () {
    W00 = !0
  }
// @from(Ln 162089, Col 2)
MB1 = function (A, Q, B) {
    var G = Uk();
    switch (typeof B === "object" && B !== null ? (B = B.delay, B = typeof B === "number" && 0 < B ? G + B : G) : B = G, A) {
      case 1:
        var Z = -1;
        break;
      case 2:
        Z = 250;
        break;
      case 5:
        Z = 1073741823;
        break;
      case 4:
        Z = 1e4;
        break;
      default:
        Z = 5000
    }
    return Z = B + Z, A = {
      id: kX8++,
      callback: Q,
      priorityLevel: A,
      startTime: B,
      expirationTime: Z,
      sortIndex: -1
    }, B > G ? (A.sortIndex = B, Y00(Ma, A), Ck(Zm) === null && A === Ck(Ma) && (H_A ? (uCB(E_A), E_A = -1) : H_A = !0, V00(K00, B - G))) : (A.sortIndex = Z, Y00(Zm, A), F_A || I00 || (F_A = !0, yIA || (yIA = !0, xIA()))), A
  }
// @from(Ln 162116, Col 2)
C00
// @from(Ln 162117, Col 4)
pCB = w(() => {
  if (typeof performance === "object" && typeof performance.now === "function") J00 = performance, Uk = function () {
    return J00.now()
  };
  else qB1 = Date, X00 = qB1.now(), Uk = function () {
    return qB1.now() - X00
  };
  Zm = [], Ma = [], gCB = typeof setTimeout === "function" ? setTimeout : null, uCB = typeof clearTimeout === "function" ? clearTimeout : null, hCB = typeof setImmediate < "u" ? setImmediate : null;
  if (typeof hCB === "function") xIA = function () {
    hCB(Z00)
  };
  else if (typeof MessageChannel < "u") wB1 = new MessageChannel, D00 = wB1.port2, wB1.port1.onmessage = Z00, xIA = function () {
    D00.postMessage(null)
  };
  else xIA = function () {
    gCB(Z00, 0)
  };
  C00 = dCB
})