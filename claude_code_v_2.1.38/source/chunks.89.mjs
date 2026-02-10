
// @from(Ln 238101, Col 0)
function tu1({
    filePath: A,
    fileContents: q,
    edits: K
}) {
    let Y = q,
        z = [];
    if (!q && K.length === 1 && K[0] && K[0].old_string === "" && K[0].new_string === "") return {
        patch: kv({
            filePath: A,
            fileContents: q,
            edits: [{
                old_string: q,
                new_string: Y,
                replace_all: !1
            }]
        }),
        updatedFile: ""
    };
    for (let H of K) {
        let $ = H.old_string.replace(/\n+$/, "");
        for (let _ of z)
            if ($ !== "" && _.includes($)) throw Error("Cannot edit file: old_string is a substring of a new_string from a previous edit.");
        let O = Y;
        if (Y = H.old_string === "" ? H.new_string : jv9(Y, H.old_string, H.new_string, H.replace_all), Y === O) throw Error("String not found in file. Failed to apply edit.");
        z.push(H.new_string)
    }
    if (Y === q) throw Error("Original and edited file match exactly. Failed to apply edit.");
    return {
        patch: kv({
            filePath: A,
            fileContents: q,
            edits: [{
                old_string: q,
                new_string: Y,
                replace_all: !1
            }]
        }),
        updatedFile: Y
    }
}
// @from(Ln 238143, Col 0)
function DjA(A, q) {
    return io("file.txt", "file.txt", A, q, void 0, void 0, {
        context: 8
    }).hunks.map((Y) => ({
        startLine: Y.oldStart,
        content: Y.lines.filter((z) => !z.startsWith("-") && !z.startsWith("\\")).map((z) => z.slice(1)).join(`
`)
    })).map(Sj1).join(`
...
`)
}
// @from(Ln 238155, Col 0)
function Vp7(A) {
    return A.map((q) => {
        let K = [],
            Y = [],
            z = [];
        for (let w of q.lines)
            if (w.startsWith(" ")) K.push(w.slice(1)), Y.push(w.slice(1)), z.push(w.slice(1));
            else if (w.startsWith("-")) Y.push(w.slice(1));
        else if (w.startsWith("+")) z.push(w.slice(1));
        return {
            old_string: Y.join(`
`),
            new_string: z.join(`
`),
            replace_all: !1
        }
    })
}
// @from(Ln 238174, Col 0)
function Pv9(A) {
    let q = A,
        K = [];
    for (let [Y, z] of Object.entries(Mv9)) {
        let w = q;
        if (q = q.replaceAll(Y, z), w !== q) K.push({
            from: Y,
            to: z
        })
    }
    return {
        result: q,
        appliedReplacements: K
    }
}
// @from(Ln 238190, Col 0)
function Np7({
    file_path: A,
    edits: q
}) {
    if (q.length === 0) return {
        file_path: A,
        edits: q
    };
    try {
        let K = g4(A);
        if (!b1().existsSync(K)) return {
            file_path: A,
            edits: q
        };
        let Y = jjA(K);
        return {
            file_path: A,
            edits: q.map(({
                old_string: z,
                new_string: w,
                replace_all: H
            }) => {
                let $ = XjA(w);
                if (Y.includes(z)) return {
                    old_string: z,
                    new_string: $,
                    replace_all: H
                };
                let {
                    result: O,
                    appliedReplacements: _
                } = Pv9(z);
                if (Y.includes(O)) {
                    let J = $;
                    for (let {
                            from: X,
                            to: D
                        }
                        of _) J = J.replaceAll(X, D);
                    return {
                        old_string: O,
                        new_string: J,
                        replace_all: H
                    }
                }
                return {
                    old_string: z,
                    new_string: $,
                    replace_all: H
                }
            })
        }
    } catch (K) {
        K1(K)
    }
    return {
        file_path: A,
        edits: q
    }
}
// @from(Ln 238251, Col 0)
function Wv9(A, q, K) {
    if (A.length === q.length && A.every(($, O) => {
            let _ = q[O];
            return _ !== void 0 && $.old_string === _.old_string && $.new_string === _.new_string && $.replace_all === _.replace_all
        })) return !0;
    let Y = null,
        z = null,
        w = null,
        H = null;
    try {
        Y = tu1({
            filePath: "temp",
            fileContents: K,
            edits: A
        })
    } catch ($) {
        z = $ instanceof Error ? $.message : String($)
    }
    try {
        w = tu1({
            filePath: "temp",
            fileContents: K,
            edits: q
        })
    } catch ($) {
        H = $ instanceof Error ? $.message : String($)
    }
    if (z !== null && H !== null) return z === H;
    if (z !== null || H !== null) return !1;
    return Y.updatedFile === w.updatedFile
}
// @from(Ln 238283, Col 0)
function Tp7(A, q) {
    if (A.file_path !== q.file_path) return !1;
    if (A.edits.length === q.edits.length && A.edits.every((z, w) => {
            let H = q.edits[w];
            return H !== void 0 && z.old_string === H.old_string && z.new_string === H.new_string && z.replace_all === H.replace_all
        })) return !0;
    let Y = b1().existsSync(A.file_path) ? jjA(A.file_path) : "";
    return Wv9(A.edits, q.edits, Y)
}
// @from(Ln 238292, Col 4)
_v9 = "‘"
// @from(Ln 238293, Col 4)
Jv9 = "’"
// @from(Ln 238294, Col 4)
Xv9 = "“"
// @from(Ln 238295, Col 4)
Dv9 = "”"
// @from(Ln 238296, Col 4)
Mv9
// @from(Ln 238297, Col 4)
WK1 = v(() => {
    Pq1();
    wq();
    wp();
    Ez();
    _8();
    y6();
    Mv9 = {
        "<fnr>": "<function_results>",
        "<n>": "<name>",
        "</n>": "</name>",
        "<o>": "<output>",
        "</o>": "</output>",
        "<e>": "<error>",
        "</e>": "</error>",
        "<s>": "<system>",
        "</s>": "</system>",
        "<r>": "<result>",
        "</r>": "</result>",
        "< META_START >": "<META_START>",
        "< META_END >": "<META_END>",
        "< EOT >": "<EOT>",
        "< META >": "<META>",
        "< SOS >": "<SOS>",
        "\n\nH:": `

Human:`,
        "\n\nA:": `

Assistant:`
    }
})
// @from(Ln 238346, Col 0)
function eu1() {
    return MjA(P_6(), "tasks")
}
// @from(Ln 238350, Col 0)
function PjA() {
    let A = eu1();
    if (!GK1(A)) Lp7(A, {
        recursive: !0
    })
}
// @from(Ln 238357, Col 0)
function ww(A) {
    return MjA(eu1(), `${A}.output`)
}
// @from(Ln 238361, Col 0)
function ZK1(A, q) {
    try {
        PjA();
        let w = ww(A),
            H = Nv9(w);
        if (!GK1(H)) Lp7(H, {
            recursive: !0
        })
    } catch (w) {
        K1(w instanceof Error ? w : Error(String(w)));
        return
    }
    let K = ww(A),
        z = (vp7.get(A) ?? Promise.resolve()).then(async () => {
            try {
                await Vv9(K, q, "utf8")
            } catch (w) {
                K1(w instanceof Error ? w : Error(String(w)))
            }
        });
    vp7.set(A, z)
}
// @from(Ln 238384, Col 0)
function WjA(A, q) {
    try {
        let K = ww(A);
        if (!GK1(K)) return {
            content: "",
            newOffset: q
        };
        let z = Gv9(K).size;
        if (z <= q) return {
            content: "",
            newOffset: q
        };
        return {
            content: Ep7(K, "utf8").slice(q),
            newOffset: z
        }
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), {
            content: "",
            newOffset: q
        }
    }
}
// @from(Ln 238408, Col 0)
function M_6(A) {
    try {
        let q = ww(A);
        if (!GK1(q)) return "";
        return Ep7(q, "utf8")
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), ""
    }
}
// @from(Ln 238418, Col 0)
function hj1(A) {
    PjA();
    let q = ww(A);
    if (!GK1(q)) c8(q, "", "utf8");
    return q
}
// @from(Ln 238425, Col 0)
function Ij1(A, q) {
    try {
        PjA();
        let K = ww(A);
        if (GK1(K)) kp7(K);
        return fv9(q, K), K
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), hj1(A)
    }
}
// @from(Ln 238436, Col 0)
function Rp7() {
    try {
        let A = eu1();
        if (!GK1(A)) return;
        let q = Zv9(A);
        for (let K of q)
            if (K.endsWith(".output")) try {
                kp7(MjA(A, K))
            } catch {}
    } catch {}
}
// @from(Ln 238447, Col 4)
vp7
// @from(Ln 238448, Col 4)
hZ = v(() => {
    m6();
    y6();
    E2();
    vp7 = new Map
})
// @from(Ln 238455, Col 0)
function yp7(A, q) {
    let K = Object.create(null),
        Y = 0;
    for (let z of A) {
        let w = q(z, Y++);
        if (K[w] === void 0) K[w] = [];
        K[w].push(z)
    }
    return K
}
// @from(Ln 238466, Col 0)
function AB1(A, q) {
    let K = U6(),
        Y = {
            type: "queue-operation",
            operation: A,
            timestamp: new Date().toISOString(),
            sessionId: K,
            ...q !== void 0 && {
                content: q
            }
        };
    ZjA(Y)
}
// @from(Ln 238480, Col 0)
function Sp7(A) {
    return W_6.add(A), () => {
        W_6.delete(A)
    }
}
// @from(Ln 238486, Col 0)
function hp7() {
    return Cp7
}
// @from(Ln 238490, Col 0)
function G_6() {
    Cp7++;
    for (let A of W_6) A()
}
// @from(Ln 238495, Col 0)
function Ip7() {
    return xj1.length > 0
}
// @from(Ln 238499, Col 0)
function xp7() {
    return xj1.length
}
// @from(Ln 238503, Col 0)
function bp7() {
    if (xj1.length > 0) G_6()
}
// @from(Ln 238507, Col 0)
function up7() {
    let A = xj1.shift();
    if (A !== void 0) G_6();
    return A
}
// @from(Ln 238513, Col 0)
function GjA() {
    xj1.length = 0, G_6()
}
// @from(Ln 238517, Col 0)
function WR(A) {
    xj1.push(A), G_6(), AB1("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Ln 238521, Col 0)
function lB(A, q) {
    if (A.mode === "task-notification" && W_6.size > 0) WR(A);
    else q((K) => ({
        ...K,
        queuedCommands: [...K.queuedCommands, A]
    })), AB1("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Ln 238528, Col 0)
async function Z_6(A, q) {
    if ((await A()).queuedCommands.length === 0) return;
    let Y;
    if (q((z) => {
            if (z.queuedCommands.length === 0) return z;
            return [Y] = z.queuedCommands, {
                ...z,
                queuedCommands: z.queuedCommands.slice(1)
            }
        }), Y) AB1("dequeue");
    return Y
}
// @from(Ln 238541, Col 0)
function Bp7(A, q) {
    if (A.length === 0) return;
    q((K) => ({
        ...K,
        queuedCommands: K.queuedCommands.filter((Y) => !A.some((z) => z.value === Y.value))
    }));
    for (let K of A) AB1("remove")
}
// @from(Ln 238550, Col 0)
function f_6(A) {
    return !Tv9.has(A)
}
// @from(Ln 238554, Col 0)
function vv9(A) {
    if (typeof A === "string") return A;
    let q = [];
    for (let K of A)
        if (K.type === "text") q.push(K.text);
    return q.join(`
`)
}
// @from(Ln 238563, Col 0)
function Ev9(A, q) {
    if (typeof A === "string") return [];
    let K = [],
        Y = 0;
    for (let z of A)
        if (z.type === "image" && z.source.type === "base64") K.push({
            id: q + Y,
            type: "image",
            content: z.source.data,
            mediaType: z.source.media_type,
            filename: `image${Y+1}`
        }), Y++;
    return K
}
// @from(Ln 238577, Col 0)
async function V_6(A, q, K, Y) {
    let z = await K();
    if (z.queuedCommands.length === 0) return;
    let {
        editable: w = [],
        nonEditable: H = []
    } = yp7(z.queuedCommands, (D) => f_6(D.mode) ? "editable" : "nonEditable");
    if (w.length === 0) return;
    let $ = w.map((D) => vv9(D.value)),
        O = [...$, A].filter(Boolean).join(`
`),
        _ = $.join(`
`).length + 1 + q,
        J = [],
        X = Date.now();
    for (let D of w) {
        let j = Ev9(D.value, X);
        J.push(...j), X += j.length
    }
    for (let D of w) AB1("popAll", typeof D.value === "string" ? D.value : void 0);
    return Y((D) => ({
        ...D,
        queuedCommands: H
    })), {
        text: O,
        cursorOffset: _,
        images: J
    }
}
// @from(Ln 238606, Col 4)
xj1
// @from(Ln 238606, Col 9)
Cp7 = 0
// @from(Ln 238607, Col 4)
W_6
// @from(Ln 238607, Col 9)
Tv9
// @from(Ln 238608, Col 4)
AN = v(() => {
    lq();
    B6();
    xj1 = [], W_6 = new Set;
    Tv9 = new Set(["task-notification"])
})
// @from(Ln 238618, Col 0)
function Rv9(A) {
    return Lv9[A] ?? "x"
}
// @from(Ln 238622, Col 0)
function hp(A) {
    let q = Rv9(A),
        K = kv9().replace(/-/g, "").substring(0, 6);
    return `${q}${K}`
}
// @from(Ln 238628, Col 0)
function IZ(A, q, K) {
    return {
        id: A,
        type: q,
        status: "pending",
        description: K,
        startTime: Date.now(),
        outputFile: ww(A),
        outputOffset: 0,
        notified: !1
    }
}
// @from(Ln 238640, Col 4)
Lv9
// @from(Ln 238641, Col 4)
fK1 = v(() => {
    hZ();
    Lv9 = {
        local_bash: "b",
        local_agent: "a",
        remote_agent: "r",
        in_process_teammate: "t"
    }
})
// @from(Ln 238650, Col 4)
bj1 = "TaskStop"
// @from(Ln 238651, Col 4)
mp7 = `
- Stops a running background task by its ID
- Takes a task_id parameter identifying the task to stop
- Returns a success or failure status
- Use this tool when you need to terminate a long-running task
`
// @from(Ln 238657, Col 4)
uj1 = "TaskOutput"
// @from(Ln 238658, Col 4)
N_6 = "EnterPlanMode"
// @from(Ln 238659, Col 4)
TH = "AskUserQuestion"
// @from(Ln 238660, Col 4)
Fp7 = 12
// @from(Ln 238661, Col 4)
Qp7 = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."
// @from(Ln 238662, Col 4)
gp7 = `Use this tool when you need to ask the user questions during execution. This allows you to:
1. Gather user preferences or requirements
2. Clarify ambiguous instructions
3. Get decisions on implementation choices as you work
4. Offer choices to the user about what direction to take.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: In plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?" or "Should I proceed?" - use ExitPlanMode for plan approval.
`
// @from(Ln 238675, Col 4)
NJ = "Skill"
// @from(Ln 238676, Col 4)
vh = "TeamCreate"
// @from(Ln 238677, Col 4)
VK1 = "TeamDelete"
// @from(Ln 238678, Col 4)
iB = "SendMessage"
// @from(Ln 238679, Col 4)
NK1 = "TaskGet"
// @from(Ln 238680, Col 4)
TK1 = "TaskList"
// @from(Ln 238682, Col 0)
function Up7(A) {}
// @from(Ln 238683, Col 4)
T_6 = v(() => {
    U4();
    cA()
})
// @from(Ln 238687, Col 4)
cp7 = {}
// @from(Ln 238695, Col 0)
function BW(A) {
    if (A.isMcp === !0) return !0;
    return !1
}
// @from(Ln 238700, Col 0)
function v_6() {
    if (J6(process.env.CLAUDE_CODE_TST_NAMES_IN_MESSAGES)) return !0;
    if (FY(process.env.CLAUDE_CODE_TST_NAMES_IN_MESSAGES)) return !1;
    return x8("tengu_tst_names_in_messages", !1)
}
// @from(Ln 238706, Col 0)
function E_6(A) {
    if (v_6()) return yv9;
    let q = A.filter(BW);
    if (q.length === 0) {
        if (ca !== void 0 && ca !== "") c("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: ca.split(`
`).length,
            newDeferredCount: 0
        });
        return ca = "", pp7
    }
    let K = x8("tengu_kv7_prompt_sort", !1) ? q.map((Y) => Y.name).sort().join(`
`) : q.map((Y) => Y.name).join(`
`);
    if (ca !== void 0 && K !== ca) {
        let Y = ca.split(`
`).filter(Boolean).length,
            z = K.split(`
`).filter(Boolean).length;
        c("tengu_tool_prompt_changed", {
            tool: "ToolSearchTool",
            previousDeferredCount: Y,
            newDeferredCount: z
        })
    }
    return ca = K, `${pp7}

Available deferred tools (must be loaded before use):
${K}`
}
// @from(Ln 238737, Col 4)
ca
// @from(Ln 238737, Col 8)
dM = "ToolSearch"
// @from(Ln 238738, Col 4)
dp7 = `

**Why this is non-negotiable:**
- Deferred tools are not loaded until discovered via this tool
- Calling a deferred tool without first loading it will fail

**Query modes:**

1. **Keyword search** - Use keywords when you're unsure which tool to use or need to discover multiple tools at once:
   - "list directory" - find tools for listing directories
   - "notebook jupyter" - find notebook editing tools
   - "slack message" - find slack messaging tools
   - Returns up to 5 matching tools ranked by relevance
   - All returned tools are immediately available to call — no further selection step needed

2. **Direct selection** - Use \`select:<tool_name>\` when you know the exact tool name and only need that one tool:
   - "select:mcp__slack__read_channel"
   - "select:NotebookEdit"
   - Returns just that tool if it exists

**IMPORTANT:** Both modes load tools equally. Do NOT follow up a keyword search with \`select:\` calls for tools already returned — they are already loaded.

3. **Required keyword** - Prefix with \`+\` to require a match:
   - "+linear create issue" - only tools from "linear", ranked by "create"/"issue"
   - "+slack send" - only "slack" tools, ranked by "send"
   - Useful when you know the service name but not the exact tool

**CORRECT Usage Patterns:**

<example>
User: I need to work with slack somehow
Assistant: Let me search for slack tools.
[Calls ToolSearch with query: "slack"]
Assistant: Found several options including mcp__slack__read_channel.
[Calls mcp__slack__read_channel directly — it was loaded by the keyword search]
</example>

<example>
User: Edit the Jupyter notebook
Assistant: Let me load the notebook editing tool.
[Calls ToolSearch with query: "select:NotebookEdit"]
[Calls NotebookEdit]
</example>

<example>
User: List files in the src directory
Assistant: I can see mcp__filesystem__list_directory in the available tools. Let me select it.
[Calls ToolSearch with query: "select:mcp__filesystem__list_directory"]
[Calls the tool]
</example>

**INCORRECT Usage Patterns - NEVER DO THESE:**

<bad-example>
User: Read my slack messages
Assistant: [Directly calls mcp__slack__read_channel without loading it first]
WRONG - You must load the tool FIRST using this tool
</bad-example>

<bad-example>
Assistant: [Calls ToolSearch with query: "slack", gets back mcp__slack__read_channel]
Assistant: [Calls ToolSearch with query: "select:mcp__slack__read_channel"]
WRONG - The keyword search already loaded the tool. The select call is redundant.
</bad-example>`
// @from(Ln 238802, Col 4)
pp7
// @from(Ln 238802, Col 9)
yv9
// @from(Ln 238803, Col 4)
la = v(() => {
    U4();
    T_6();
    u6();
    hA();
    pp7 = `Search for or select deferred tools to make them available for use.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST use this tool to load deferred tools BEFORE calling them directly.

This is a BLOCKING REQUIREMENT - deferred tools listed below are NOT available until you load them using this tool. Both query modes (keyword search and direct selection) load the returned tools — once a tool appears in the results, it is immediately available to call.${dp7}`, yv9 = `Search for or select deferred tools to make them available for use.

**MANDATORY PREREQUISITE - THIS IS A HARD REQUIREMENT**

You MUST use this tool to load deferred tools BEFORE calling them directly.

This is a BLOCKING REQUIREMENT - deferred tools are NOT available until you load them using this tool. Look for <available-deferred-tools> messages in the conversation for the list of tools you can discover. Both query modes (keyword search and direct selection) load the returned tools — once a tool appears in the results, it is immediately available to call.${dp7}`
})
// @from(Ln 238823, Col 0)
function ip7(A) {
    return A.isNonInteractiveSession
}
// @from(Ln 238827, Col 0)
function k_6(A) {
    try {
        let q = new lp7.Ajv({
            allErrors: !0
        });
        if (!q.validateSchema(A)) throw Error(`Invalid JSON Schema: ${q.errorsText(q.errors)}`);
        let Y = q.compile(A);
        return {
            ...fjA,
            inputJSONSchema: A,
            async call(z) {
                if (!Y(z)) {
                    let H = Y.errors?.map(($) => `${$.instancePath||"root"}: ${$.message}`).join(", ");
                    throw Error(`Output does not match required schema: ${H}`)
                }
                return {
                    data: "Structured output provided successfully",
                    structured_output: z
                }
            }
        }
    } catch {
        return null
    }
}
// @from(Ln 238852, Col 4)
lp7
// @from(Ln 238852, Col 9)
Cv9
// @from(Ln 238852, Col 14)
Sv9
// @from(Ln 238852, Col 19)
cD = "StructuredOutput"
// @from(Ln 238853, Col 4)
fjA
// @from(Ln 238854, Col 4)
nB = v(() => {
    i7();
    m6();
    lp7 = o(dH6(), 1), Cv9 = z7(() => u.object({}).passthrough()), Sv9 = z7(() => u.string().describe("Structured output tool result"));
    fjA = {
        isMcp: !1,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        isDestructive() {
            return !1
        },
        isOpenWorld() {
            return !1
        },
        name: cD,
        maxResultSizeChars: 1e5,
        async description() {
            return "Return structured output in the requested format"
        },
        async prompt() {
            return "Use this tool to return your final response in the requested structured format. You MUST call this tool exactly once at the end of your response to provide the structured output."
        },
        get inputSchema() {
            return Cv9()
        },
        get outputSchema() {
            return Sv9()
        },
        async call(A) {
            return {
                data: "Structured output provided successfully",
                structured_output: A
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage(A) {
            let q = Object.keys(A);
            if (q.length === 0) return null;
            if (q.length <= 3) return q.map((K) => `${K}: ${Q1(A[K])}`).join(", ");
            return `${q.length} fields: ${q.slice(0,3).join(", ")}…`
        },
        userFacingName: () => cD,
        renderToolUseRejectedMessage() {
            return "Structured output rejected"
        },
        renderToolUseErrorMessage() {
            return "Structured output error"
        },
        renderToolUseProgressMessage() {
            return null
        },
        renderToolResultMessage(A) {
            return A
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A
            }
        }
    }
})
// @from(Ln 238929, Col 4)
Bj1
// @from(Ln 238929, Col 9)
VjA
// @from(Ln 238929, Col 14)
L_6
// @from(Ln 238929, Col 19)
np7
// @from(Ln 238929, Col 24)
R_6
// @from(Ln 238930, Col 4)
mj1 = v(() => {
    _H();
    t81();
    DW();
    SD();
    la();
    nB();
    Bj1 = new Set([uj1, bW, N_6, fK, TH, bj1]), VjA = new Set([...Bj1]), L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB]), np7 = new Set([Nh, NK1, TK1, DR]), R_6 = new Set([vh, VK1, iB, Nh, NK1, TK1, DR, fK])
})
// @from(Ln 238940, Col 0)
function KY() {
    return !1
}
// @from(Ln 238943, Col 4)
cM = v(() => {
    u6();
    hA();
    mj1();
    nB()
})
// @from(Ln 238950, Col 0)
function Yj(A) {
    return A
}
// @from(Ln 238954, Col 0)
function xZ(A) {
    return A
}
// @from(Ln 238957, Col 4)
y_6 = "REPL"
// @from(Ln 238958, Col 4)
rp7
// @from(Ln 238959, Col 4)
NjA = v(() => {
    rp7 = new Set(["Read", "Write", "Edit", "Glob", "Grep", "Bash", "NotebookEdit"])
})
// @from(Ln 238968, Col 0)
function qB1(A) {
    let q = O8();
    if (!A.startsWith(q)) return null;
    let K = A.split(vjA.sep).join(TjA.sep);
    if (K.includes("/session-memory/") && K.endsWith(".md")) return "session_memory";
    if (K.includes("/projects/") && K.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 238977, Col 0)
function C_6(A) {
    let q = A.split(vjA.sep).join(TjA.sep);
    if (q.includes("session-memory") && (q.includes(".md") || q.endsWith("*"))) return "session_memory";
    if (q.includes(".jsonl") || q.includes("projects") && q.includes("*.jsonl")) return "session_transcript";
    return null
}
// @from(Ln 238984, Col 0)
function S_6(A) {
    if (y2()) return Fu1(A);
    return !1
}
// @from(Ln 238989, Col 0)
function Iv9(A) {
    if (y2()) return gu1(A);
    return !1
}
// @from(Ln 238994, Col 0)
function h_6(A) {
    if (S_6(A)) return !0;
    if (qB1(A) !== null) return !0;
    if (Iv9(A)) return !0;
    return !1
}
// @from(Ln 239001, Col 0)
function op7(A) {
    let q = hv9(A),
        K = q.split(vjA.sep).join(TjA.sep);
    if (y2() && (K.includes("/agent-memory/") || K.includes("/agent-memory-local/"))) return !0;
    let Y = O8(),
        z = ga(),
        w = q.startsWith(Y),
        H = q.startsWith(z);
    if (!w && !H) return !1;
    if (K.includes("/session-memory/")) return !0;
    if (w && K.includes("/projects/")) return !0;
    if (y2() && K.includes("/memory/")) return !0;
    return !1
}
// @from(Ln 239016, Col 0)
function ap7(A) {
    if (C_6(A) !== null) return !0;
    if (y2() && (A.replace(/\\/g, "/").includes("agent-memory/") || A.replace(/\\/g, "/").includes("agent-memory-local/"))) return !0;
    return !1
}
// @from(Ln 239021, Col 4)
EjA = v(() => {
    dD();
    hA();
    xW();
    gB();
    xW()
})
// @from(Ln 239029, Col 0)
function xv9(A) {
    let q = A;
    return q?.file_path ?? q?.path
}
// @from(Ln 239034, Col 0)
function bv9(A) {
    let q = A;
    if (!q) return !1;
    if (q.path) {
        if (h_6(q.path) || op7(q.path)) return !0
    }
    if (q.glob && ap7(q.glob)) return !0;
    return !1
}
// @from(Ln 239044, Col 0)
function uv9(A, q) {
    if (A !== f5 && A !== bq) return !1;
    let K = xv9(q);
    return K !== void 0 && h_6(K)
}
// @from(Ln 239050, Col 0)
function x_6(A, q, K) {
    if (A === y_6) return {
        isCollapsible: !1,
        isSearch: !1,
        isRead: !1,
        isREPL: !0,
        isMemoryWrite: !1
    };
    if (uv9(A, q)) return {
        isCollapsible: !0,
        isSearch: !1,
        isRead: !1,
        isREPL: !1,
        isMemoryWrite: !0
    };
    let Y = Tv(K, A);
    if (!Y?.isSearchOrReadCommand) return {
        isCollapsible: !1,
        isSearch: !1,
        isRead: !1,
        isREPL: !1,
        isMemoryWrite: !1
    };
    let z = Y.isSearchOrReadCommand(q);
    return {
        isCollapsible: z.isSearch || z.isRead,
        isSearch: z.isSearch,
        isRead: z.isRead,
        isREPL: !1,
        isMemoryWrite: !1
    }
}
// @from(Ln 239083, Col 0)
function KB1(A, q) {
    if (A?.type === "tool_use" && A.name) {
        let K = x_6(A.name, A.input, q);
        if (K.isCollapsible || K.isREPL) return {
            isSearch: K.isSearch,
            isRead: K.isRead,
            isREPL: K.isREPL,
            isMemoryWrite: K.isMemoryWrite
        }
    }
    return null
}
// @from(Ln 239096, Col 0)
function I_6(A, q, K) {
    return x_6(A, q, K).isCollapsible
}
// @from(Ln 239100, Col 0)
function Bv9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0],
            Y = KB1(K, q);
        if (Y && K?.type === "tool_use") return {
            name: K.name,
            input: K.input,
            ...Y
        }
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0],
            Y = KB1(K ? {
                type: "tool_use",
                name: A.toolName,
                input: K.input
            } : void 0, q);
        if (Y && K?.type === "tool_use") return {
            name: A.toolName,
            input: K.input,
            ...Y
        }
    }
    return null
}
// @from(Ln 239126, Col 0)
function mv9(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "text" && q.text.trim().length > 0) return !0
    }
    return !1
}
// @from(Ln 239134, Col 0)
function Fv9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0];
        if (K?.type === "tool_use" && !I_6(K.name, K.input, q)) return !0
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0];
        if (K?.type === "tool_use" && !I_6(A.toolName, K.input, q)) return !0
    }
    return !1
}
// @from(Ln 239146, Col 0)
function Qv9(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "thinking" || q?.type === "redacted_thinking") return !0
    }
    if (A.type === "attachment") return !0;
    if (A.type === "system") return !0;
    return !1
}
// @from(Ln 239156, Col 0)
function gv9(A, q) {
    if (A.type === "assistant") {
        let K = A.message.content[0];
        return K?.type === "tool_use" && I_6(K.name, K.input, q)
    }
    if (A.type === "grouped_tool_use") {
        let K = A.messages[0]?.message.content[0];
        return K?.type === "tool_use" && I_6(A.toolName, K.input, q)
    }
    return !1
}
// @from(Ln 239168, Col 0)
function Uv9(A, q) {
    if (A.type === "user") {
        let K = A.message.content.filter((Y) => Y.type === "tool_result");
        return K.length > 0 && K.every((Y) => q.has(Y.tool_use_id))
    }
    return !1
}
// @from(Ln 239176, Col 0)
function tp7(A) {
    if (A.type === "assistant") {
        let q = A.message.content[0];
        if (q?.type === "tool_use") return [q.id]
    }
    if (A.type === "grouped_tool_use") return A.messages.map((q) => {
        let K = q.message.content[0];
        return K.type === "tool_use" ? K.id : ""
    }).filter(Boolean);
    return []
}
// @from(Ln 239188, Col 0)
function Fj1(A) {
    let q = [];
    for (let K of A.messages) q.push(...tp7(K));
    return q
}
// @from(Ln 239194, Col 0)
function ep7(A, q) {
    return Fj1(A).some((K) => q.has(K))
}
// @from(Ln 239198, Col 0)
function Ad7(A) {
    let q = A.displayMessage;
    if (q.type === "grouped_tool_use") return q.displayMessage;
    return q
}
// @from(Ln 239204, Col 0)
function kjA(A) {
    if (A.type === "grouped_tool_use") return A.messages.length;
    return 1
}
// @from(Ln 239209, Col 0)
function pv9(A) {
    let q = [];
    if (A.type === "assistant") {
        let K = A.message.content[0];
        if (K?.type === "tool_use") {
            let Y = K.input;
            if (Y?.file_path) q.push(Y.file_path)
        }
    } else if (A.type === "grouped_tool_use")
        for (let K of A.messages) {
            let Y = K.message.content[0];
            if (Y?.type === "tool_use") {
                let z = Y.input;
                if (z?.file_path) q.push(z.file_path)
            }
        }
    return q
}
// @from(Ln 239228, Col 0)
function sp7() {
    return {
        messages: [],
        searchCount: 0,
        readFilePaths: new Set,
        readOperationCount: 0,
        toolUseIds: new Set,
        memorySearchCount: 0,
        memoryReadFilePaths: new Set,
        memoryWriteCount: 0
    }
}
// @from(Ln 239241, Col 0)
function dv9(A) {
    let q = A.messages[0],
        K = A.readFilePaths.size + A.readOperationCount,
        Y = A.memoryReadFilePaths.size;
    return {
        type: "collapsed_read_search",
        searchCount: Math.max(0, A.searchCount - A.memorySearchCount),
        readCount: Math.max(0, K - Y),
        replCount: 0,
        memorySearchCount: A.memorySearchCount,
        memoryReadCount: Y,
        memoryWriteCount: A.memoryWriteCount,
        messages: A.messages,
        displayMessage: q,
        uuid: `collapsed-${q.uuid}`,
        timestamp: q.timestamp
    }
}
// @from(Ln 239260, Col 0)
function qd7(A, q) {
    let K = [],
        Y = sp7(),
        z = [];

    function w() {
        if (Y.messages.length === 0) return;
        K.push(dv9(Y));
        for (let H of z) K.push(H);
        z = [], Y = sp7()
    }
    for (let H of A)
        if (gv9(H, q)) {
            let $ = Bv9(H, q);
            if ($.isMemoryWrite) Y.memoryWriteCount += kjA(H);
            else if ($.isSearch) {
                let O = kjA(H);
                if (Y.searchCount += O, bv9($.input)) Y.memorySearchCount += O
            } else {
                let O = pv9(H);
                for (let _ of O)
                    if (Y.readFilePaths.add(_), h_6(_)) Y.memoryReadFilePaths.add(_);
                if (O.length === 0) Y.readOperationCount += kjA(H)
            }
            for (let O of tp7(H)) Y.toolUseIds.add(O);
            Y.messages.push(H)
        } else if (Uv9(H, Y.toolUseIds)) Y.messages.push(H);
    else if (Qv9(H))
        if (Y.messages.length > 0) z.push(H);
        else K.push(H);
    else if (mv9(H)) w(), K.push(H);
    else if (Fv9(H, q)) w(), K.push(H);
    else w(), K.push(H);
    return w(), K
}
// @from(Ln 239296, Col 0)
function b_6(A, q, K, Y = 0, z) {
    let w = [];
    if (z) {
        let {
            memorySearchCount: $,
            memoryReadCount: O,
            memoryWriteCount: _
        } = z;
        if (O > 0) {
            let J = K ? w.length === 0 ? "Recalling" : "recalling" : w.length === 0 ? "Recalled" : "recalled";
            w.push(`${J} ${O} ${O===1?"memory":"memories"}`)
        }
        if ($ > 0) {
            let J = K ? w.length === 0 ? "Searching" : "searching" : w.length === 0 ? "Searched" : "searched";
            w.push(`${J} memories`)
        }
        if (_ > 0) {
            let J = K ? w.length === 0 ? "Writing" : "writing" : w.length === 0 ? "Wrote" : "wrote";
            w.push(`${J} ${_} ${_===1?"memory":"memories"}`)
        }
    }
    if (A > 0) {
        let $ = K ? w.length === 0 ? "Searching for" : "searching for" : w.length === 0 ? "Searched for" : "searched for";
        w.push(`${$} ${A} ${A===1?"pattern":"patterns"}`)
    }
    if (q > 0) {
        let $ = K ? w.length === 0 ? "Reading" : "reading" : w.length === 0 ? "Read" : "read";
        w.push(`${$} ${q} ${q===1?"file":"files"}`)
    }
    if (Y > 0) {
        let $ = K ? "REPL'ing" : "REPL'd";
        w.push(`${$} ${Y} ${Y===1?"time":"times"}`)
    }
    let H = w.join(", ");
    return K ? `${H}…` : H
}
// @from(Ln 239333, Col 0)
function rB(A) {
    if (A.length === 0) return;
    let q = 0,
        K = 0;
    for (let z = A.length - 1; z >= 0; z--) {
        let w = A[z];
        if (w.isSearch) q++;
        else if (w.isRead) K++;
        else break
    }
    if (q + K >= 2) return b_6(q, K, !0);
    for (let z = A.length - 1; z >= 0; z--)
        if (A[z]?.activityDescription) return A[z].activityDescription;
    return
}
// @from(Ln 239348, Col 4)
Eh = v(() => {
    NjA();
    SD();
    EjA()
})
// @from(Ln 239354, Col 0)
function YB1() {
    return {
        toolUseCount: 0,
        latestInputTokens: 0,
        cumulativeOutputTokens: 0,
        recentActivities: []
    }
}
// @from(Ln 239363, Col 0)
function LjA(A) {
    return A.latestInputTokens + A.cumulativeOutputTokens
}
// @from(Ln 239367, Col 0)
function Qj1(A, q, K, Y) {
    if (q.type !== "assistant") return;
    let z = q.message.usage;
    A.latestInputTokens = z.input_tokens + (z.cache_creation_input_tokens ?? 0) + (z.cache_read_input_tokens ?? 0), A.cumulativeOutputTokens += z.output_tokens;
    for (let w of q.message.content)
        if (w.type === "tool_use") {
            if (A.toolUseCount++, w.name !== cD) {
                let H = w.input,
                    $ = Y ? x_6(w.name, H, Y) : void 0;
                A.recentActivities.push({
                    toolName: w.name,
                    input: H,
                    activityDescription: K?.(w.name, H),
                    isSearch: $?.isSearch,
                    isRead: $?.isRead
                })
            }
        } while (A.recentActivities.length > cv9) A.recentActivities.shift()
}
// @from(Ln 239387, Col 0)
function zB1(A) {
    return {
        toolUseCount: A.toolUseCount,
        tokenCount: LjA(A),
        lastActivity: A.recentActivities.length > 0 ? A.recentActivities[A.recentActivities.length - 1] : void 0,
        recentActivities: [...A.recentActivities]
    }
}
// @from(Ln 239396, Col 0)
function wB1(A) {
    return (q, K) => {
        return Tv(A, q)?.getActivityDescription?.(K) ?? void 0
    }
}
// @from(Ln 239402, Col 0)
function ia(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_agent"
}
// @from(Ln 239406, Col 0)
function vK1(A, q, K, Y, z, w, H) {
    let $ = !1;
    if (c5(A, z, (M) => {
            if (M.notified) return M;
            return $ = !0, {
                ...M,
                notified: !0
            }
        }), !$) return;
    let O = K === "completed" ? `Agent "${q}" completed` : K === "failed" ? `Agent "${q}" failed: ${Y||"Unknown error"}` : `Agent "${q}" was stopped`,
        _ = ww(A),
        J = w ? `
<result>${w}</result>` : "",
        X = H ? `
<usage>total_tokens: ${H.totalTokens}
tool_uses: ${H.toolUses}
duration_ms: ${H.durationMs}</usage>` : "",
        D = KY() ? "" : `
Full transcript available at: ${_}`,
        j = `<${NO}>
<${dP}>${A}</${dP}>
<${ND}>${K}</${ND}>
<${TD}>${O}</${TD}>${J}${X}
</${NO}>${D}`;
    WR({
        value: j,
        mode: "task-notification"
    })
}
// @from(Ln 239436, Col 0)
function na(A, q) {
    let K = !1;
    return c5(A, q, (Y) => {
        if (Y.status !== "running") return Y;
        return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
            ...Y,
            status: "killed",
            endTime: Date.now()
        }
    }), K
}
// @from(Ln 239448, Col 0)
function Kd7(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") na(K, q)
}
// @from(Ln 239453, Col 0)
function RjA(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        let z = Y.progress?.summary;
        return {
            ...Y,
            progress: z ? {
                ...q,
                summary: z
            } : q
        }
    })
}
// @from(Ln 239467, Col 0)
function Yd7(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return {
            ...Y,
            progress: {
                ...Y.progress,
                toolUseCount: Y.progress?.toolUseCount ?? 0,
                tokenCount: Y.progress?.tokenCount ?? 0,
                summary: q
            }
        }
    })
}
// @from(Ln 239482, Col 0)
function yjA(A, q) {
    let K = A.agentId;
    c5(K, q, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "completed",
            result: A,
            endTime: Date.now()
        }
    })
}
// @from(Ln 239495, Col 0)
function CjA(A, q, K) {
    c5(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return Y.unregisterCleanup?.(), {
            ...Y,
            status: "failed",
            error: q,
            endTime: Date.now()
        }
    })
}
// @from(Ln 239507, Col 0)
function zd7({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z,
    parentAbortController: w
}) {
    Ij1(A, kh(xZ(A)));
    let H = w ? R61(w) : Aq(),
        $ = {
            ...IZ(A, "local_agent", q),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: H,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0
        },
        O = Tq(async () => {
            na(A, z)
        });
    return $.unregisterCleanup = O, bZ($, z), $
}
// @from(Ln 239537, Col 0)
function wd7({
    agentId: A,
    description: q,
    prompt: K,
    selectedAgent: Y,
    setAppState: z
}) {
    Ij1(A, kh(xZ(A)));
    let w = Aq(),
        H = Tq(async () => {
            na(A, z)
        }),
        $ = {
            ...IZ(A, "local_agent", q),
            type: "local_agent",
            status: "running",
            agentId: A,
            prompt: K,
            selectedAgent: Y,
            agentType: Y.agentType ?? "general-purpose",
            abortController: w,
            unregisterCleanup: H,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !1
        },
        O, _ = new Promise((J) => {
            O = J
        });
    return u_6.set(A, O), bZ($, z), {
        taskId: A,
        backgroundSignal: _
    }
}
// @from(Ln 239573, Col 0)
function Hd7(A, q, K) {
    let z = q().tasks[A];
    if (!ia(z) || z.isBackgrounded) return !1;
    K((H) => {
        let $ = H.tasks[A];
        if (!ia($)) return H;
        return {
            ...H,
            tasks: {
                ...H.tasks,
                [A]: {
                    ...$,
                    isBackgrounded: !0
                }
            }
        }
    });
    let w = u_6.get(A);
    if (w) w(), u_6.delete(A);
    return !0
}
// @from(Ln 239595, Col 0)
function $d7(A, q) {
    u_6.delete(A);
    let K;
    q((Y) => {
        let z = Y.tasks[A];
        if (!ia(z) || z.isBackgrounded) return Y;
        K = z.unregisterCleanup;
        let {
            [A]: w, ...H
        } = Y.tasks;
        return {
            ...Y,
            tasks: H
        }
    }), K?.()
}
// @from(Ln 239611, Col 4)
Ip
// @from(Ln 239611, Col 8)
cv9 = 5
// @from(Ln 239612, Col 4)
B_6
// @from(Ln 239612, Col 9)
u_6
// @from(Ln 239613, Col 4)
ra = v(() => {
    m1();
    fK1();
    G2();
    Tz();
    AN();
    GR();
    hZ();
    lq();
    cM();
    Eh();
    nB();
    vz();
    Ip = o(X1(), 1);
    B_6 = {
        name: "LocalAgentTask",
        type: "local_agent",
        async spawn(A, q) {
            let {
                prompt: K,
                description: Y,
                agentType: z,
                model: w,
                selectedAgent: H,
                agentId: $
            } = A, {
                setAppState: O
            } = q, _ = $ ?? hp("local_agent");
            Ij1(_, kh(xZ(_)));
            let J = Aq(),
                X = {
                    ...IZ(_, "local_agent", Y),
                    type: "local_agent",
                    status: "running",
                    agentId: _,
                    prompt: K,
                    selectedAgent: H,
                    agentType: z,
                    model: w,
                    abortController: J,
                    retrieved: !1,
                    lastReportedToolCount: 0,
                    lastReportedTokenCount: 0,
                    isBackgrounded: !0
                },
                D = Tq(async () => {
                    na(_, O)
                });
            return X.unregisterCleanup = D, bZ(X, O), {
                taskId: _,
                cleanup: () => {
                    D(), J.abort()
                }
            }
        },
        async kill(A, q) {
            na(A, q.setAppState)
        },
        renderStatus(A) {
            let q = A,
                K = q.status,
                Y = q.description,
                z = q.progress,
                w = K === "running" ? "warning" : K === "completed" ? "success" : K === "failed" ? "error" : "inactive",
                H = z ? ` (${z.toolUseCount} tools, ${z.tokenCount} tokens)` : "";
            return Ip.createElement(I, null, Ip.createElement(V, {
                color: w
            }, "[", K, "] ", Y, H))
        },
        renderOutput(A) {
            return Ip.createElement(I, null, Ip.createElement(V, null, A))
        },
        getProgressMessage(A) {
            let q = A,
                K = q.progress;
            if (!K) return null;
            let Y = K.toolUseCount - q.lastReportedToolCount,
                z = K.tokenCount - q.lastReportedTokenCount;
            if (Y === 0 && z === 0) return null;
            let w = [];
            if (Y > 0) w.push(`${Y} new tool${Y>1?"s":""} used`);
            if (z > 0) w.push(`${z} new tokens`);
            return `Agent ${A.id} progress: ${w.join(", ")}. The agent is still running. You usually do not need to read ${A.outputFile} unless you need specific details right away. You will be notified when the agent is done.`
        }
    };
    u_6 = new Map
})
// @from(Ln 239704, Col 0)
function nv9() {
    return `s${lv9().replace(/-/g,"").substring(0,6)}`
}
// @from(Ln 239708, Col 0)
function rv9(A, q, K, Y) {
    let z = nv9();
    Ij1(z, dO());
    let w = Y ?? Aq(),
        H = Tq(async () => {
            q((_) => {
                let {
                    [z]: J, ...X
                } = _.tasks;
                return {
                    ..._,
                    tasks: X
                }
            })
        }),
        $ = K ?? iv9,
        O = {
            ...IZ(z, "local_agent", A),
            type: "local_agent",
            status: "running",
            agentId: z,
            prompt: A,
            selectedAgent: $,
            agentType: "main-session",
            abortController: w,
            unregisterCleanup: H,
            retrieved: !1,
            lastReportedToolCount: 0,
            lastReportedTokenCount: 0,
            isBackgrounded: !0
        };
    return h(`[LocalMainSessionTask] Registering task ${z} with description: ${A}`), bZ(O, q), q((_) => {
        let J = z in _.tasks;
        return h(`[LocalMainSessionTask] After registration, task ${z} exists in state: ${J}`), _
    }), {
        taskId: z,
        abortSignal: w.signal
    }
}
// @from(Ln 239748, Col 0)
function Od7(A, q, K) {
    let Y = !0;
    if (c5(A, K, (z) => {
            if (z.status !== "running") return z;
            return Y = z.isBackgrounded ?? !0, z.unregisterCleanup?.(), {
                ...z,
                status: q ? "completed" : "failed",
                endTime: Date.now()
            }
        }), Y) ov9(A, "Background session", q ? "completed" : "failed", K)
}
// @from(Ln 239760, Col 0)
function ov9(A, q, K, Y) {
    let z = K === "completed" ? `Background session "${q}" completed` : `Background session "${q}" failed`,
        w = ww(A),
        H = `<${NO}>
<${dP}>${A}</${dP}>
<${WT}>${w}</${WT}>
<${ND}>${K}</${ND}>
<${TD}>${z}</${TD}>
</${NO}>
Read the output file to retrieve the result: ${w}`;
    WR({
        value: H,
        mode: "task-notification"
    }), c5(A, Y, ($) => ({
        ...$,
        notified: !0
    }))
}
// @from(Ln 239779, Col 0)
function _d7(A) {
    if (typeof A !== "object" || A === null || !("type" in A) || !("agentType" in A)) return !1;
    return A.type === "local_agent" && A.agentType === "main-session"
}
// @from(Ln 239784, Col 0)
function Jd7({
    messages: A,
    queryParams: q,
    description: K,
    setAppState: Y,
    agentDefinition: z,
    recordTranscript: w
}) {
    let {
        taskId: H,
        abortSignal: $
    } = rv9(K, Y, z);
    return (async () => {
        try {
            let O = [...A],
                _ = [],
                J = 0,
                X = 0;
            for await (let D of ZR({
                messages: O,
                ...q
            })) {
                if ($.aborted) {
                    w(O);
                    return
                }
                if (D.type !== "user" && D.type !== "assistant" && D.type !== "system") continue;
                if (O.push(D), D.type === "assistant") {
                    for (let j of D.message.content)
                        if (j.type === "text") X += Math.round(j.text.length / 4);
                        else if (j.type === "tool_use") {
                        J++;
                        let M = {
                            toolName: j.name,
                            input: j.input
                        };
                        if (_.push(M), _.length > av9) _.shift()
                    }
                }
                Y((j) => {
                    let M = j.tasks[H];
                    if (!M || M.type !== "local_agent") return j;
                    return {
                        ...j,
                        tasks: {
                            ...j.tasks,
                            [H]: {
                                ...M,
                                progress: {
                                    tokenCount: X,
                                    toolUseCount: J,
                                    recentActivities: [..._]
                                },
                                messages: O
                            }
                        }
                    }
                })
            }
            w(O), Od7(H, !0, Y)
        } catch (O) {
            K1(O instanceof Error ? O : Error(String(O))), Od7(H, !1, Y)
        }
    })(), H
}
// @from(Ln 239849, Col 4)
iv9
// @from(Ln 239849, Col 9)
av9 = 5
// @from(Ln 239850, Col 4)
SjA = v(() => {
    fK1();
    hZ();
    GR();
    Z6();
    y6();
    lq();
    AN();
    Tz();
    G2();
    EK1();
    vz();
    iv9 = {
        agentType: "main-session",
        whenToUse: "Main session query",
        source: "userSettings",
        getSystemPrompt: () => ""
    }
})
// @from(Ln 239870, Col 0)
function oB(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "local_bash"
}
// @from(Ln 239874, Col 0)
function HB1(A, q, K, Y, z) {
    let w = !1;
    if (c5(A, z, (_) => {
            if (_.notified) return _;
            return w = !0, {
                ..._,
                notified: !0
            }
        }), !w) return;
    let H = K === "completed" ? `completed${Y!==void 0?` (exit code ${Y})`:""}` : K === "failed" ? `failed${Y!==void 0?` with exit code ${Y}`:""}` : "was stopped",
        $ = ww(A),
        O = `<${NO}>
<${dP}>${A}</${dP}>
<${WT}>${$}</${WT}>
<${ND}>${K}</${ND}>
<${TD}>Background command "${q}" ${H}</${TD}>
</${NO}>
Read the output file to retrieve the result: ${$}`;
    WR({
        value: O,
        mode: "task-notification"
    })
}
// @from(Ln 239898, Col 0)
function hjA(A, q) {
    c5(A, q, (K) => {
        if (K.status !== "running" || !oB(K)) return K;
        try {
            h(`LocalBashTask ${A} kill requested`), K.shellCommand?.kill(), K.shellCommand?.cleanup()
        } catch (Y) {
            K1(Y instanceof Error ? Y : Error(String(Y)))
        }
        if (K.unregisterCleanup?.(), K.cleanupTimeoutId) clearTimeout(K.cleanupTimeoutId);
        return {
            ...K,
            status: "killed",
            shellCommand: null,
            unregisterCleanup: void 0,
            cleanupTimeoutId: void 0,
            endTime: Date.now()
        }
    })
}
// @from(Ln 239918, Col 0)
function Xd7(A, q) {
    let {
        command: K,
        description: Y,
        shellCommand: z
    } = A, w = hp("local_bash");
    hj1(w);
    let H = Tq(async () => {
            hjA(w, q)
        }),
        $ = {
            ...IZ(w, "local_bash", Y),
            type: "local_bash",
            status: "running",
            command: K,
            completionStatusSentInAttachment: !1,
            shellCommand: z,
            unregisterCleanup: H,
            stdoutLineCount: 0,
            stderrLineCount: 0,
            lastReportedStdoutLines: 0,
            lastReportedStderrLines: 0,
            isBackgrounded: !1
        };
    return bZ($, q), w
}
// @from(Ln 239945, Col 0)
function sv9(A, q, K) {
    let z = q().tasks[A];
    if (!oB(z) || z.isBackgrounded || !z.shellCommand) return !1;
    let {
        shellCommand: w,
        description: H
    } = z, $ = w.background(A);
    if (!$) return !1;
    return K((O) => {
        let _ = O.tasks[A];
        if (!oB(_) || _.isBackgrounded) return O;
        return {
            ...O,
            tasks: {
                ...O.tasks,
                [A]: {
                    ..._,
                    isBackgrounded: !0
                }
            }
        }
    }), $.stdoutStream.on("data", (O) => {
        let _ = O.toString();
        ZK1(A, _);
        let J = _.split(`
`).filter((X) => X.length > 0).length;
        c5(A, K, (X) => ({
            ...X,
            stdoutLineCount: X.stdoutLineCount + J
        }))
    }), $.stderrStream.on("data", (O) => {
        let _ = O.toString();
        ZK1(A, `[stderr] ${_}`);
        let J = _.split(`
`).filter((X) => X.length > 0).length;
        c5(A, K, (X) => ({
            ...X,
            stderrLineCount: X.stderrLineCount + J
        }))
    }), w.result.then((O) => {
        w.cleanup();
        let _ = !1,
            J;
        if (c5(A, K, (X) => {
                if (X.status === "killed") return _ = !0, X;
                return J = X.unregisterCleanup, {
                    ...X,
                    status: O.code === 0 ? "completed" : "failed",
                    result: {
                        code: O.code,
                        interrupted: O.interrupted
                    },
                    shellCommand: null,
                    unregisterCleanup: void 0,
                    endTime: Date.now()
                }
            }), J?.(), _) HB1(A, H, "killed", O.code, K);
        else {
            let X = O.code === 0 ? "completed" : "failed";
            HB1(A, H, X, O.code, K)
        }
    }), !0
}
// @from(Ln 240009, Col 0)
function Dd7(A) {
    return Object.values(A.tasks).some((q) => {
        if (oB(q) && !q.isBackgrounded && q.shellCommand) return !0;
        if (ia(q) && !q.isBackgrounded && !_d7(q)) return !0;
        return !1
    })
}
// @from(Ln 240017, Col 0)
function m_6(A, q) {
    let K = A(),
        Y = Object.keys(K.tasks).filter((w) => {
            let H = K.tasks[w];
            return oB(H) && !H.isBackgrounded && H.shellCommand
        });
    for (let w of Y) sv9(w, A, q);
    let z = Object.keys(K.tasks).filter((w) => {
        let H = K.tasks[w];
        return ia(H) && !H.isBackgrounded
    });
    for (let w of z) Hd7(w, A, q)
}
// @from(Ln 240031, Col 0)
function jd7(A, q) {
    let K;
    q((Y) => {
        let z = Y.tasks[A];
        if (!oB(z) || z.isBackgrounded) return Y;
        K = z.unregisterCleanup;
        let {
            [A]: w, ...H
        } = Y.tasks;
        return {
            ...Y,
            tasks: H
        }
    }), K?.()
}
// @from(Ln 240046, Col 4)
xp
// @from(Ln 240046, Col 8)
gj1
// @from(Ln 240047, Col 4)
kK1 = v(() => {
    m1();
    fK1();
    Tz();
    y6();
    Z6();
    AN();
    GR();
    hZ();
    ra();
    SjA();
    vz();
    xp = o(X1(), 1);
    gj1 = {
        name: "LocalBashTask",
        type: "local_bash",
        async spawn(A, q) {
            let {
                command: K,
                description: Y,
                shellCommand: z
            } = A, {
                setAppState: w
            } = q, H = hp("local_bash");
            hj1(H);
            let $ = Tq(async () => {
                    hjA(H, w)
                }),
                O = {
                    ...IZ(H, "local_bash", Y),
                    type: "local_bash",
                    status: "running",
                    command: K,
                    completionStatusSentInAttachment: !1,
                    shellCommand: z,
                    unregisterCleanup: $,
                    stdoutLineCount: 0,
                    stderrLineCount: 0,
                    lastReportedStdoutLines: 0,
                    lastReportedStderrLines: 0,
                    isBackgrounded: !0
                };
            bZ(O, w);
            let _ = z.background(H);
            if (!_) return z.result.then((J) => {
                z.cleanup();
                let X = J.code === 0 ? "completed" : "failed";
                c5(H, w, (D) => ({
                    ...D,
                    status: X,
                    result: {
                        code: J.code,
                        interrupted: J.interrupted
                    },
                    endTime: Date.now()
                })), HB1(H, Y, X, J.code, w)
            }), {
                taskId: H
            };
            return _.stdoutStream.on("data", (J) => {
                let X = J.toString();
                ZK1(H, X);
                let D = X.split(`
`).filter((j) => j.length > 0).length;
                c5(H, w, (j) => ({
                    ...j,
                    stdoutLineCount: j.stdoutLineCount + D
                }))
            }), _.stderrStream.on("data", (J) => {
                let X = J.toString();
                ZK1(H, `[stderr] ${X}`);
                let D = X.split(`
`).filter((j) => j.length > 0).length;
                c5(H, w, (j) => ({
                    ...j,
                    stderrLineCount: j.stderrLineCount + D
                }))
            }), z.result.then((J) => {
                z.cleanup();
                let X = !1;
                if (c5(H, w, (D) => {
                        if (D.status === "killed") return X = !0, D;
                        return {
                            ...D,
                            status: J.code === 0 ? "completed" : "failed",
                            result: {
                                code: J.code,
                                interrupted: J.interrupted
                            },
                            shellCommand: null,
                            unregisterCleanup: void 0,
                            endTime: Date.now()
                        }
                    }), X) HB1(H, Y, "killed", J.code, w);
                else {
                    let D = J.code === 0 ? "completed" : "failed";
                    HB1(H, Y, D, J.code, w)
                }
            }), {
                taskId: H,
                cleanup: () => {
                    $()
                }
            }
        },
        async kill(A, q) {
            hjA(A, q.setAppState)
        },
        renderStatus(A) {
            if (!oB(A)) return null;
            let {
                status: q,
                command: K
            } = A;
            return xp.createElement(I, null, xp.createElement(V, {
                color: q === "running" ? "warning" : q === "completed" ? "success" : q === "failed" ? "error" : "inactive"
            }, "[", q, "] ", K))
        },
        renderOutput(A) {
            return xp.createElement(I, null, xp.createElement(V, null, A))
        },
        getProgressMessage(A) {
            if (!oB(A)) return null;
            let q = A.stdoutLineCount - A.lastReportedStdoutLines,
                K = A.stderrLineCount - A.lastReportedStderrLines;
            if (q === 0 && K === 0) return null;
            let Y = [];
            if (q > 0) Y.push(`${q} line${q>1?"s":""} of stdout`);
            if (K > 0) Y.push(`${K} line${K>1?"s":""} of stderr`);
            return `Background bash ${A.id} has new output: ${Y.join(", ")}. Read ${A.outputFile} to see output.`
        }
    }
})
// @from(Ln 240180, Col 4)
fd7 = R((JPw, Zd7) => {
    var Gd7 = h1("child_process"),
        Md7 = Gd7.spawn,
        tv9 = Gd7.exec;
    Zd7.exports = function(A, q, K) {
        if (typeof q === "function" && K === void 0) K = q, q = void 0;
        if (A = parseInt(A), Number.isNaN(A))
            if (K) return K(Error("pid must be a number"));
            else throw Error("pid must be a number");
        var Y = {},
            z = {};
        switch (Y[A] = [], z[A] = 1, process.platform) {
            case "win32":
                tv9("taskkill /pid " + A + " /T /F", K);
                break;
            case "darwin":
                IjA(A, Y, z, function(w) {
                    return Md7("pgrep", ["-P", w])
                }, function() {
                    Pd7(Y, q, K)
                });
                break;
            default:
                IjA(A, Y, z, function(w) {
                    return Md7("ps", ["-o", "pid", "--no-headers", "--ppid", w])
                }, function() {
                    Pd7(Y, q, K)
                });
                break
        }
    };

    function Pd7(A, q, K) {
        var Y = {};
        try {
            Object.keys(A).forEach(function(z) {
                if (A[z].forEach(function(w) {
                        if (!Y[w]) Wd7(w, q), Y[w] = 1
                    }), !Y[z]) Wd7(z, q), Y[z] = 1
            })
        } catch (z) {
            if (K) return K(z);
            else throw z
        }
        if (K) return K()
    }

    function Wd7(A, q) {
        try {
            process.kill(parseInt(A, 10), q)
        } catch (K) {
            if (K.code !== "ESRCH") throw K
        }
    }

    function IjA(A, q, K, Y, z) {
        var w = Y(A),
            H = "";
        w.stdout.on("data", function(_) {
            var _ = _.toString("ascii");
            H += _
        });
        var $ = function(O) {
            if (delete K[A], O != 0) {
                if (Object.keys(K).length == 0) z();
                return
            }
            H.match(/\d+/g).forEach(function(_) {
                _ = parseInt(_, 10), q[A].push(_), q[_] = [], K[_] = 1, IjA(_, q, K, Y, z)
            })
        };
        w.on("close", $)
    }
})
// @from(Ln 240254, Col 0)
class $B1 {
    capacity;
    buffer;
    head = 0;
    size = 0;
    constructor(A) {
        this.capacity = A;
        this.buffer = Array(A)
    }
    add(A) {
        if (this.buffer[this.head] = A, this.head = (this.head + 1) % this.capacity, this.size < this.capacity) this.size++
    }
    addAll(A) {
        for (let q of A) this.add(q)
    }
    getRecent(A) {
        let q = [],
            K = this.size < this.capacity ? 0 : this.head,
            Y = Math.min(A, this.size);
        for (let z = 0; z < Y; z++) {
            let w = (K + this.size - Y + z) % this.capacity;
            q.push(this.buffer[w])
        }
        return q
    }
    toArray() {
        if (this.size === 0) return [];
        let A = [],
            q = this.size < this.capacity ? 0 : this.head;
        for (let K = 0; K < this.size; K++) {
            let Y = (q + K) % this.capacity;
            A.push(this.buffer[Y])
        }
        return A
    }
    clear() {
        this.head = 0, this.size = 0
    }
    length() {
        return this.size
    }
}
// @from(Ln 240299, Col 0)
class Ed7 {
    #A;
    #q = null;
    #K = !1;
    #z;
    #Y = this.#w.bind(this);
    #$;
    constructor(A, q) {
        this.#$ = q, this.#A = A, this.#z = new FD1, this.#A.setEncoding("utf-8"), this.#A.on("data", this.#Y)
    }
    #w(A) {
        let q = this.#q,
            K = this.#$;
        if (K) K(A);
        if (q) q.write(A);
        else this.#z.append(A)
    }
    get() {
        return this.#z.toString()
    }
    asStream() {
        if (this.#q) return this.#q;
        let A = this.#q = new ev9({
            highWaterMark: 10485760
        });
        return A.on("error", function() {}), A.write(this.get()), this.#z.clear(), A
    }
    cleanup() {
        if (this.#K) return;
        if (this.#$ = null, this.#K = !0, this.#A.removeListener("data", this.#Y), this.#Y = () => {}, this.#q && !this.#q.destroyed) this.#q.end();
        this.#z.clear()
    }
}
// @from(Ln 240332, Col 0)
class kd7 {
    #A = new $B1(1000);
    #q = 0;
    #K;
    constructor(A) {
        this.#K = A
    }
    handleData(A) {
        let K = A.toString().split(`
`).filter((z) => z.trim());
        this.#A.addAll(K), this.#q += K.length;
        let Y = this.#A.getRecent(5);
        if (Y.length > 0) this.#K(d$A(Y, `
`), d$A(this.#A.getRecent(100), `
`), this.#q)
    }
}
// @from(Ln 240350, Col 0)
function Td7(A, q) {
    return new Ed7(A, q)
}
// @from(Ln 240353, Col 0)
class xjA {
    #A = "running";
    #q;
    #K;
    #z;
    #Y;
    #$ = null;
    #w;
    #_;
    #J;
    #O;
    #H = null;
    #D = null;
    #P = null;
    static #W(A) {
        if (A.#O && A.#_) A.#_(A.background.bind(A));
        else A.#G(Nd7)
    }
    result;
    onTimeout;
    constructor(A, q, K, Y, z = !1) {
        this.#Y = A, this.#w = q, this.#J = K, this.#O = z;
        let w = this.#j(Y);
        if (this.#K = Td7(A.stdout, w), this.#z = Td7(A.stderr, w), z) this.onTimeout = (H) => {
            this.#_ = H
        };
        this.result = this.#T()
    }
    get status() {
        return this.#A
    }
    #j(A) {
        if (!A) return null;
        let q = new kd7(A);
        return q.handleData.bind(q)
    }
    #V() {
        if (this.#w.reason === "interrupt") return;
        this.kill()
    }
    #M(A, q) {
        let K = A !== null && A !== void 0 ? A : q === "SIGTERM" ? 144 : 1;
        this.#f(K)
    }
    #N() {
        this.#f(1)
    }
    #f(A) {
        if (this.#D) this.#D(A), this.#D = null
    }
    #Z() {
        let A = this.#$;
        if (A) clearTimeout(A), this.#$ = null;
        let q = this.#P;
        if (q) this.#w.removeEventListener("abort", q), this.#P = null
    }
    #T() {
        this.#P = this.#V.bind(this), this.#w.addEventListener("abort", this.#P, {
            once: !0
        }), this.#Y.once("exit", this.#M.bind(this)), this.#Y.once("error", this.#N.bind(this)), this.#$ = setTimeout(xjA.#W, this.#J, this);
        let A = new Promise((q) => {
            this.#D = q
        });
        return new Promise((q) => {
            this.#H = q, A.then(this.#E.bind(this))
        })
    }
    #E(A) {
        if (this.#Z(), this.#A === "running" || this.#A === "backgrounded") this.#A = "completed";
        let q = {
            code: A,
            stdout: this.#K.get(),
            stderr: this.#z.get(),
            interrupted: A === Vd7,
            backgroundTaskId: this.#q
        };
        if (A === Nd7) q.stderr = [`Command timed out after ${Xz(this.#J)}`, q.stderr].filter(Boolean).join(" ");
        let K = this.#H;
        if (K) this.#H = null, K(q)
    }
    #G(A) {
        if (this.#A = "killed", this.#Y.pid) vd7.default(this.#Y.pid, "SIGKILL");
        this.#f(A ?? Vd7)
    }
    kill() {
        this.#G()
    }
    background(A) {
        if (this.#A === "running") return this.#q = A, this.#A = "backgrounded", this.#Z(), {
            stdoutStream: this.#K.asStream(),
            stderrStream: this.#z.asStream()
        };
        return null
    }
    cleanup() {
        this.#K.cleanup(), this.#z.cleanup()
    }
}
// @from(Ln 240452, Col 0)
function F_6(A, q, K, Y, z = !1) {
    return new xjA(A, q, K, Y, z)
}
// @from(Ln 240455, Col 0)
class Ld7 {
    status = "killed";
    result;
    constructor(A) {
        this.result = Promise.resolve({
            code: 145,
            stdout: "",
            stderr: "Command aborted before execution",
            interrupted: !0,
            backgroundTaskId: A
        })
    }
    background() {
        return null
    }
    kill() {}
    cleanup() {}
}
// @from(Ln 240474, Col 0)
function Rd7(A) {
    return new Ld7(A)
}
// @from(Ln 240477, Col 4)
vd7
// @from(Ln 240477, Col 9)
Vd7 = 137
// @from(Ln 240478, Col 4)
Nd7 = 143
// @from(Ln 240479, Col 4)
bjA = v(() => {
    vq();
    vd7 = o(fd7(), 1)
})
// @from(Ln 240484, Col 0)
function Q_6(A, q) {
    let K = A.lastIndexOf(" -");
    if (K > 0) {
        let Y = A.substring(0, K),
            z = A.substring(K + 1);
        return `${R7([Y])} ${z} ${R7([q])}`
    } else return `${R7([A])} ${R7([q])}`
}
// @from(Ln 240492, Col 4)
ujA = v(() => {
    M_()
})
// @from(Ln 240505, Col 0)
function Sd7() {
    let A = BjA(O8(), "session-env", U6());
    return AE9(A, {
        recursive: !0
    }), A
}
// @from(Ln 240512, Col 0)
function hd7(A, q) {
    let K = A.toLowerCase();
    return BjA(Sd7(), `${K}-hook-${q}.sh`)
}
// @from(Ln 240517, Col 0)
function Id7() {
    h("Invalidating session environment cache"), oa = void 0
}
// @from(Ln 240521, Col 0)
function xd7() {
    if (eA() === "windows") return h("Session environment not yet supported on Windows"), null;
    if (oa !== void 0) return oa;
    let A = [],
        q = process.env.CLAUDE_ENV_FILE;
    if (q && Cd7(q)) try {
        let Y = yd7(q, "utf8").trim();
        if (Y) A.push(Y), h(`Session environment loaded from CLAUDE_ENV_FILE: ${q} (${Y.length} chars)`)
    } catch (Y) {
        h(`Failed to read CLAUDE_ENV_FILE: ${Y instanceof Error?Y.message:String(Y)}`)
    }
    let K = Sd7();
    if (Cd7(K)) try {
        let z = qE9(K).filter((w) => w.match(/^(setup|sessionstart)-hook-\d+\.sh$/)).sort((w, H) => {
            let $ = w.match(/^(setup|sessionstart)-hook-(\d+)\.sh$/),
                O = H.match(/^(setup|sessionstart)-hook-(\d+)\.sh$/),
                _ = $?.[1] || "",
                J = O?.[1] || "";
            if (_ !== J) return _ === "setup" ? -1 : 1;
            let X = parseInt($?.[2] || "0", 10),
                D = parseInt(O?.[2] || "0", 10);
            return X - D
        });
        for (let w of z) {
            let H = BjA(K, w),
                $ = yd7(H, "utf8").trim();
            if ($) A.push($)
        }
        if (z.length > 0) h(`Session environment loaded from ${z.length} hook file(s)`)
    } catch (Y) {
        h(`Failed to load session environment from hooks: ${Y instanceof Error?Y.message:String(Y)}`)
    }
    if (A.length === 0) return h("No session environment scripts found"), oa = null, oa;
    return oa = A.join(`
`), h(`Session environment script ready (${oa.length} chars total)`), oa
}
// @from(Ln 240557, Col 4)
oa = void 0
// @from(Ln 240558, Col 4)
g_6 = v(() => {
    Z6();
    x3();
    hA();
    B6()
})
// @from(Ln 240565, Col 0)
function mjA(A) {
    let q = KE9[A],
        K = process.env[A];
    if (K === void 0) return q;
    return K === "true"
}
// @from(Ln 240572, Col 0)
function Uj1() {
    let A = Lh(),
        q = U6(),
        K = {
            "user.id": A
        };
    if (mjA("OTEL_METRICS_INCLUDE_SESSION_ID")) K["session.id"] = q;
    if (mjA("OTEL_METRICS_INCLUDE_VERSION")) K["app.version"] = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION;
    let Y = u3();
    if (Y) {
        let {
            organizationUuid: z,
            emailAddress: w,
            accountUuid: H
        } = Y;
        if (z) K["organization.id"] = z;
        if (w) K["user.email"] = w;
        if (H && mjA("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) K["user.account_uuid"] = H
    }
    if (lV.terminal) K["terminal.type"] = lV.terminal;
    return K
}
// @from(Ln 240601, Col 4)
KE9
// @from(Ln 240602, Col 4)
U_6 = v(() => {
    B6();
    cA();
    $a();
    J7();
    KE9 = {
        OTEL_METRICS_INCLUDE_SESSION_ID: !0,
        OTEL_METRICS_INCLUDE_VERSION: !1,
        OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
    }
})
// @from(Ln 240614, Col 0)
function zE9() {
    return J6(process.env.OTEL_LOG_USER_PROMPTS)
}
// @from(Ln 240618, Col 0)
function p_6(A) {
    return zE9() ? A : "<REDACTED>"
}
// @from(Ln 240621, Col 0)
async function zj(A, q = {}) {
    let K = IL6();
    if (!K) return;
    let Y = {
        ...Uj1(),
        "event.name": A,
        "event.timestamp": new Date().toISOString(),
        "event.sequence": YE9++
    };
    for (let [z, w] of Object.entries(q))
        if (w !== void 0) Y[z] = w;
    K.emit({
        body: `claude_code.${A}`,
        attributes: Y
    })
}
// @from(Ln 240637, Col 4)
YE9 = 0
// @from(Ln 240638, Col 4)
aa = v(() => {
    B6();
    U_6();
    hA()
})
// @from(Ln 240643, Col 4)
Bd7 = R((bd7) => {
    Object.defineProperty(bd7, "__esModule", {
        value: !0
    });
    bd7._globalThis = void 0;
    bd7._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 240650, Col 4)
md7 = R((LK1) => {
    var wE9 = LK1 && LK1.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        HE9 = LK1 && LK1.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) wE9(q, A, K)
        };
    Object.defineProperty(LK1, "__esModule", {
        value: !0
    });
    HE9(Bd7(), LK1)
})
// @from(Ln 240672, Col 4)
Fd7 = R((RK1) => {
    var $E9 = RK1 && RK1.__createBinding || (Object.create ? function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            Object.defineProperty(A, Y, {
                enumerable: !0,
                get: function() {
                    return q[K]
                }
            })
        } : function(A, q, K, Y) {
            if (Y === void 0) Y = K;
            A[Y] = q[K]
        }),
        OE9 = RK1 && RK1.__exportStar || function(A, q) {
            for (var K in A)
                if (K !== "default" && !Object.prototype.hasOwnProperty.call(q, K)) $E9(q, A, K)
        };
    Object.defineProperty(RK1, "__esModule", {
        value: !0
    });
    OE9(md7(), RK1)
})
// @from(Ln 240694, Col 4)
FjA = R((Qd7) => {
    Object.defineProperty(Qd7, "__esModule", {
        value: !0
    });
    Qd7.VERSION = void 0;
    Qd7.VERSION = "1.9.0"
})
// @from(Ln 240701, Col 4)
ld7 = R((dd7) => {
    Object.defineProperty(dd7, "__esModule", {
        value: !0
    });
    dd7.isCompatible = dd7._makeCompatibilityCheck = void 0;
    var _E9 = FjA(),
        Ud7 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;

    function pd7(A) {
        let q = new Set([A]),
            K = new Set,
            Y = A.match(Ud7);
        if (!Y) return () => !1;
        let z = {
            major: +Y[1],
            minor: +Y[2],
            patch: +Y[3],
            prerelease: Y[4]
        };
        if (z.prerelease != null) return function(O) {
            return O === A
        };

        function w($) {
            return K.add($), !1
        }

        function H($) {
            return q.add($), !0
        }
        return function(O) {
            if (q.has(O)) return !0;
            if (K.has(O)) return !1;
            let _ = O.match(Ud7);
            if (!_) return w(O);
            let J = {
                major: +_[1],
                minor: +_[2],
                patch: +_[3],
                prerelease: _[4]
            };
            if (J.prerelease != null) return w(O);
            if (z.major !== J.major) return w(O);
            if (z.major === 0) {
                if (z.minor === J.minor && z.patch <= J.patch) return H(O);
                return w(O)
            }
            if (z.minor <= J.minor) return H(O);
            return w(O)
        }
    }
    dd7._makeCompatibilityCheck = pd7;
    dd7.isCompatible = pd7(_E9.VERSION)
})
// @from(Ln 240755, Col 4)
yK1 = R((id7) => {
    Object.defineProperty(id7, "__esModule", {
        value: !0
    });
    id7.unregisterGlobal = id7.getGlobal = id7.registerGlobal = void 0;
    var XE9 = Fd7(),
        pj1 = FjA(),
        DE9 = ld7(),
        jE9 = pj1.VERSION.split(".")[0],
        OB1 = Symbol.for(`opentelemetry.js.api.${jE9}`),
        _B1 = XE9._globalThis;

    function ME9(A, q, K, Y = !1) {
        var z;
        let w = _B1[OB1] = (z = _B1[OB1]) !== null && z !== void 0 ? z : {
            version: pj1.VERSION
        };
        if (!Y && w[A]) {
            let H = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${A}`);
            return K.error(H.stack || H.message), !1
        }
        if (w.version !== pj1.VERSION) {
            let H = Error(`@opentelemetry/api: Registration of version v${w.version} for ${A} does not match previously registered API v${pj1.VERSION}`);
            return K.error(H.stack || H.message), !1
        }
        return w[A] = q, K.debug(`@opentelemetry/api: Registered a global for ${A} v${pj1.VERSION}.`), !0
    }
    id7.registerGlobal = ME9;

    function PE9(A) {
        var q, K;
        let Y = (q = _B1[OB1]) === null || q === void 0 ? void 0 : q.version;
        if (!Y || !(0, DE9.isCompatible)(Y)) return;
        return (K = _B1[OB1]) === null || K === void 0 ? void 0 : K[A]
    }
    id7.getGlobal = PE9;

    function WE9(A, q) {
        q.debug(`@opentelemetry/api: Unregistering a global for ${A} v${pj1.VERSION}.`);
        let K = _B1[OB1];
        if (K) delete K[A]
    }
    id7.unregisterGlobal = WE9
})
// @from(Ln 240799, Col 4)
sd7 = R((od7) => {
    Object.defineProperty(od7, "__esModule", {
        value: !0
    });
    od7.DiagComponentLogger = void 0;
    var fE9 = yK1();
    class rd7 {
        constructor(A) {
            this._namespace = A.namespace || "DiagComponentLogger"
        }
        debug(...A) {
            return JB1("debug", this._namespace, A)
        }
        error(...A) {
            return JB1("error", this._namespace, A)
        }
        info(...A) {
            return JB1("info", this._namespace, A)
        }
        warn(...A) {
            return JB1("warn", this._namespace, A)
        }
        verbose(...A) {
            return JB1("verbose", this._namespace, A)
        }
    }
    od7.DiagComponentLogger = rd7;

    function JB1(A, q, K) {
        let Y = (0, fE9.getGlobal)("diag");
        if (!Y) return;
        return K.unshift(q), Y[A](...K)
    }
})
// @from(Ln 240833, Col 4)
d_6 = R((td7) => {
    Object.defineProperty(td7, "__esModule", {
        value: !0
    });
    td7.DiagLogLevel = void 0;
    var VE9;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.ERROR = 30] = "ERROR", A[A.WARN = 50] = "WARN", A[A.INFO = 60] = "INFO", A[A.DEBUG = 70] = "DEBUG", A[A.VERBOSE = 80] = "VERBOSE", A[A.ALL = 9999] = "ALL"
    })(VE9 = td7.DiagLogLevel || (td7.DiagLogLevel = {}))
})
// @from(Ln 240843, Col 4)
qc7 = R((ed7) => {
    Object.defineProperty(ed7, "__esModule", {
        value: !0
    });
    ed7.createLogLevelDiagLogger = void 0;
    var bp = d_6();

    function NE9(A, q) {
        if (A < bp.DiagLogLevel.NONE) A = bp.DiagLogLevel.NONE;
        else if (A > bp.DiagLogLevel.ALL) A = bp.DiagLogLevel.ALL;
        q = q || {};

        function K(Y, z) {
            let w = q[Y];
            if (typeof w === "function" && A >= z) return w.bind(q);
            return function() {}
        }
        return {
            error: K("error", bp.DiagLogLevel.ERROR),
            warn: K("warn", bp.DiagLogLevel.WARN),
            info: K("info", bp.DiagLogLevel.INFO),
            debug: K("debug", bp.DiagLogLevel.DEBUG),
            verbose: K("verbose", bp.DiagLogLevel.VERBOSE)
        }
    }
    ed7.createLogLevelDiagLogger = NE9
})
// @from(Ln 240870, Col 4)
CK1 = R((Yc7) => {
    Object.defineProperty(Yc7, "__esModule", {
        value: !0
    });
    Yc7.DiagAPI = void 0;
    var TE9 = sd7(),
        vE9 = qc7(),
        Kc7 = d_6(),
        c_6 = yK1(),
        EE9 = "diag";
    class gjA {
        constructor() {
            function A(Y) {
                return function(...z) {
                    let w = (0, c_6.getGlobal)("diag");
                    if (!w) return;
                    return w[Y](...z)
                }
            }
            let q = this,
                K = (Y, z = {
                    logLevel: Kc7.DiagLogLevel.INFO
                }) => {
                    var w, H, $;
                    if (Y === q) {
                        let J = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                        return q.error((w = J.stack) !== null && w !== void 0 ? w : J.message), !1
                    }
                    if (typeof z === "number") z = {
                        logLevel: z
                    };
                    let O = (0, c_6.getGlobal)("diag"),
                        _ = (0, vE9.createLogLevelDiagLogger)((H = z.logLevel) !== null && H !== void 0 ? H : Kc7.DiagLogLevel.INFO, Y);
                    if (O && !z.suppressOverrideMessage) {
                        let J = ($ = Error().stack) !== null && $ !== void 0 ? $ : "<failed to generate stacktrace>";
                        O.warn(`Current logger will be overwritten from ${J}`), _.warn(`Current logger will overwrite one already registered from ${J}`)
                    }
                    return (0, c_6.registerGlobal)("diag", _, q, !0)
                };
            q.setLogger = K, q.disable = () => {
                (0, c_6.unregisterGlobal)(EE9, q)
            }, q.createComponentLogger = (Y) => {
                return new TE9.DiagComponentLogger(Y)
            }, q.verbose = A("verbose"), q.debug = A("debug"), q.info = A("info"), q.warn = A("warn"), q.error = A("error")
        }
        static instance() {
            if (!this._instance) this._instance = new gjA;
            return this._instance
        }
    }
    Yc7.DiagAPI = gjA
})
// @from(Ln 240922, Col 4)
$c7 = R((wc7) => {
    Object.defineProperty(wc7, "__esModule", {
        value: !0
    });
    wc7.BaggageImpl = void 0;
    class dj1 {
        constructor(A) {
            this._entries = A ? new Map(A) : new Map
        }
        getEntry(A) {
            let q = this._entries.get(A);
            if (!q) return;
            return Object.assign({}, q)
        }
        getAllEntries() {
            return Array.from(this._entries.entries()).map(([A, q]) => [A, q])
        }
        setEntry(A, q) {
            let K = new dj1(this._entries);
            return K._entries.set(A, q), K
        }
        removeEntry(A) {
            let q = new dj1(this._entries);
            return q._entries.delete(A), q
        }
        removeEntries(...A) {
            let q = new dj1(this._entries);
            for (let K of A) q._entries.delete(K);
            return q
        }
        clear() {
            return new dj1
        }
    }
    wc7.BaggageImpl = dj1
})
// @from(Ln 240958, Col 4)
Jc7 = R((Oc7) => {
    Object.defineProperty(Oc7, "__esModule", {
        value: !0
    });
    Oc7.baggageEntryMetadataSymbol = void 0;
    Oc7.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Ln 240965, Col 4)
UjA = R((Xc7) => {
    Object.defineProperty(Xc7, "__esModule", {
        value: !0
    });
    Xc7.baggageEntryMetadataFromString = Xc7.createBaggage = void 0;
    var kE9 = CK1(),
        LE9 = $c7(),
        RE9 = Jc7(),
        yE9 = kE9.DiagAPI.instance();

    function CE9(A = {}) {
        return new LE9.BaggageImpl(new Map(Object.entries(A)))
    }
    Xc7.createBaggage = CE9;

    function SE9(A) {
        if (typeof A !== "string") yE9.error(`Cannot create baggage metadata from unknown type: ${typeof A}`), A = "";
        return {
            __TYPE__: RE9.baggageEntryMetadataSymbol,
            toString() {
                return A
            }
        }
    }
    Xc7.baggageEntryMetadataFromString = SE9
})
// @from(Ln 240991, Col 4)
XB1 = R((jc7) => {
    Object.defineProperty(jc7, "__esModule", {
        value: !0
    });
    jc7.ROOT_CONTEXT = jc7.createContextKey = void 0;

    function IE9(A) {
        return Symbol.for(A)
    }
    jc7.createContextKey = IE9;
    class l_6 {
        constructor(A) {
            let q = this;
            q._currentContext = A ? new Map(A) : new Map, q.getValue = (K) => q._currentContext.get(K), q.setValue = (K, Y) => {
                let z = new l_6(q._currentContext);
                return z._currentContext.set(K, Y), z
            }, q.deleteValue = (K) => {
                let Y = new l_6(q._currentContext);
                return Y._currentContext.delete(K), Y
            }
        }
    }
    jc7.ROOT_CONTEXT = new l_6
})
// @from(Ln 241015, Col 4)
Zc7 = R((Wc7) => {
    Object.defineProperty(Wc7, "__esModule", {
        value: !0
    });
    Wc7.DiagConsoleLogger = void 0;
    var pjA = [{
        n: "error",
        c: "error"
    }, {
        n: "warn",
        c: "warn"
    }, {
        n: "info",
        c: "info"
    }, {
        n: "debug",
        c: "debug"
    }, {
        n: "verbose",
        c: "trace"
    }];
    class Pc7 {
        constructor() {
            function A(q) {
                return function(...K) {
                    if (console) {
                        let Y = console[q];
                        if (typeof Y !== "function") Y = console.log;
                        if (typeof Y === "function") return Y.apply(console, K)
                    }
                }
            }
            for (let q = 0; q < pjA.length; q++) this[pjA[q].n] = A(pjA[q].c)
        }
    }
    Wc7.DiagConsoleLogger = Pc7
})
// @from(Ln 241052, Col 4)
sjA = R((fc7) => {
    Object.defineProperty(fc7, "__esModule", {
        value: !0
    });
    fc7.createNoopMeter = fc7.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = fc7.NOOP_OBSERVABLE_GAUGE_METRIC = fc7.NOOP_OBSERVABLE_COUNTER_METRIC = fc7.NOOP_UP_DOWN_COUNTER_METRIC = fc7.NOOP_HISTOGRAM_METRIC = fc7.NOOP_GAUGE_METRIC = fc7.NOOP_COUNTER_METRIC = fc7.NOOP_METER = fc7.NoopObservableUpDownCounterMetric = fc7.NoopObservableGaugeMetric = fc7.NoopObservableCounterMetric = fc7.NoopObservableMetric = fc7.NoopHistogramMetric = fc7.NoopGaugeMetric = fc7.NoopUpDownCounterMetric = fc7.NoopCounterMetric = fc7.NoopMetric = fc7.NoopMeter = void 0;
    class djA {
        constructor() {}
        createGauge(A, q) {
            return fc7.NOOP_GAUGE_METRIC
        }
        createHistogram(A, q) {
            return fc7.NOOP_HISTOGRAM_METRIC
        }
        createCounter(A, q) {
            return fc7.NOOP_COUNTER_METRIC
        }
        createUpDownCounter(A, q) {
            return fc7.NOOP_UP_DOWN_COUNTER_METRIC
        }
        createObservableGauge(A, q) {
            return fc7.NOOP_OBSERVABLE_GAUGE_METRIC
        }
        createObservableCounter(A, q) {
            return fc7.NOOP_OBSERVABLE_COUNTER_METRIC
        }
        createObservableUpDownCounter(A, q) {
            return fc7.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
        }
        addBatchObservableCallback(A, q) {}
        removeBatchObservableCallback(A) {}
    }
    fc7.NoopMeter = djA;
    class cj1 {}
    fc7.NoopMetric = cj1;
    class cjA extends cj1 {
        add(A, q) {}
    }
    fc7.NoopCounterMetric = cjA;
    class ljA extends cj1 {
        add(A, q) {}
    }
    fc7.NoopUpDownCounterMetric = ljA;
    class ijA extends cj1 {
        record(A, q) {}
    }
    fc7.NoopGaugeMetric = ijA;
    class njA extends cj1 {
        record(A, q) {}
    }
    fc7.NoopHistogramMetric = njA;
    class DB1 {
        addCallback(A) {}
        removeCallback(A) {}
    }
    fc7.NoopObservableMetric = DB1;
    class rjA extends DB1 {}
    fc7.NoopObservableCounterMetric = rjA;
    class ojA extends DB1 {}
    fc7.NoopObservableGaugeMetric = ojA;
    class ajA extends DB1 {}
    fc7.NoopObservableUpDownCounterMetric = ajA;
    fc7.NOOP_METER = new djA;
    fc7.NOOP_COUNTER_METRIC = new cjA;
    fc7.NOOP_GAUGE_METRIC = new ijA;
    fc7.NOOP_HISTOGRAM_METRIC = new njA;
    fc7.NOOP_UP_DOWN_COUNTER_METRIC = new ljA;
    fc7.NOOP_OBSERVABLE_COUNTER_METRIC = new rjA;
    fc7.NOOP_OBSERVABLE_GAUGE_METRIC = new ojA;
    fc7.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new ajA;

    function bE9() {
        return fc7.NOOP_METER
    }
    fc7.createNoopMeter = bE9
})
// @from(Ln 241127, Col 4)
Sc7 = R((Cc7) => {
    Object.defineProperty(Cc7, "__esModule", {
        value: !0
    });
    Cc7.ValueType = void 0;
    var lE9;
    (function(A) {
        A[A.INT = 0] = "INT", A[A.DOUBLE = 1] = "DOUBLE"
    })(lE9 = Cc7.ValueType || (Cc7.ValueType = {}))
})
// @from(Ln 241137, Col 4)
ejA = R((hc7) => {
    Object.defineProperty(hc7, "__esModule", {
        value: !0
    });
    hc7.defaultTextMapSetter = hc7.defaultTextMapGetter = void 0;
    hc7.defaultTextMapGetter = {
        get(A, q) {
            if (A == null) return;
            return A[q]
        },
        keys(A) {
            if (A == null) return [];
            return Object.keys(A)
        }
    };
    hc7.defaultTextMapSetter = {
        set(A, q, K) {
            if (A == null) return;
            A[q] = K
        }
    }
})
// @from(Ln 241159, Col 4)
Bc7 = R((bc7) => {
    Object.defineProperty(bc7, "__esModule", {
        value: !0
    });
    bc7.NoopContextManager = void 0;
    var nE9 = XB1();
    class xc7 {
        active() {
            return nE9.ROOT_CONTEXT
        }
        with(A, q, K, ...Y) {
            return q.call(K, ...Y)
        }
        bind(A, q) {
            return q
        }
        enable() {
            return this
        }
        disable() {
            return this
        }
    }
    bc7.NoopContextManager = xc7
})
// @from(Ln 241184, Col 4)
jB1 = R((Fc7) => {
    Object.defineProperty(Fc7, "__esModule", {
        value: !0
    });
    Fc7.ContextAPI = void 0;
    var rE9 = Bc7(),
        AMA = yK1(),
        mc7 = CK1(),
        qMA = "context",
        oE9 = new rE9.NoopContextManager;
    class KMA {
        constructor() {}
        static getInstance() {
            if (!this._instance) this._instance = new KMA;
            return this._instance
        }
        setGlobalContextManager(A) {
            return (0, AMA.registerGlobal)(qMA, A, mc7.DiagAPI.instance())
        }
        active() {
            return this._getContextManager().active()
        }
        with(A, q, K, ...Y) {
            return this._getContextManager().with(A, q, K, ...Y)
        }
        bind(A, q) {
            return this._getContextManager().bind(A, q)
        }
        _getContextManager() {
            return (0, AMA.getGlobal)(qMA) || oE9
        }
        disable() {
            this._getContextManager().disable(), (0, AMA.unregisterGlobal)(qMA, mc7.DiagAPI.instance())
        }
    }
    Fc7.ContextAPI = KMA
})
// @from(Ln 241221, Col 4)
zMA = R((gc7) => {
    Object.defineProperty(gc7, "__esModule", {
        value: !0
    });
    gc7.TraceFlags = void 0;
    var aE9;
    (function(A) {
        A[A.NONE = 0] = "NONE", A[A.SAMPLED = 1] = "SAMPLED"
    })(aE9 = gc7.TraceFlags || (gc7.TraceFlags = {}))
})
// @from(Ln 241231, Col 4)
i_6 = R((Uc7) => {
    Object.defineProperty(Uc7, "__esModule", {
        value: !0
    });
    Uc7.INVALID_SPAN_CONTEXT = Uc7.INVALID_TRACEID = Uc7.INVALID_SPANID = void 0;
    var sE9 = zMA();
    Uc7.INVALID_SPANID = "0000000000000000";
    Uc7.INVALID_TRACEID = "00000000000000000000000000000000";
    Uc7.INVALID_SPAN_CONTEXT = {
        traceId: Uc7.INVALID_TRACEID,
        spanId: Uc7.INVALID_SPANID,
        traceFlags: sE9.TraceFlags.NONE
    }
})
// @from(Ln 241245, Col 4)
n_6 = R((ic7) => {
    Object.defineProperty(ic7, "__esModule", {
        value: !0
    });
    ic7.NonRecordingSpan = void 0;
    var tE9 = i_6();
    class lc7 {
        constructor(A = tE9.INVALID_SPAN_CONTEXT) {
            this._spanContext = A
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(A, q) {
            return this
        }
        setAttributes(A) {
            return this
        }
        addEvent(A, q) {
            return this
        }
        addLink(A) {
            return this
        }
        addLinks(A) {
            return this
        }
        setStatus(A) {
            return this
        }
        updateName(A) {
            return this
        }
        end(A) {}
        isRecording() {
            return !1
        }
        recordException(A, q) {}
    }
    ic7.NonRecordingSpan = lc7
})
// @from(Ln 241287, Col 4)
$MA = R((oc7) => {
    Object.defineProperty(oc7, "__esModule", {
        value: !0
    });
    oc7.getSpanContext = oc7.setSpanContext = oc7.deleteSpan = oc7.setSpan = oc7.getActiveSpan = oc7.getSpan = void 0;
    var eE9 = XB1(),
        Ak9 = n_6(),
        qk9 = jB1(),
        wMA = (0, eE9.createContextKey)("OpenTelemetry Context Key SPAN");

    function HMA(A) {
        return A.getValue(wMA) || void 0
    }
    oc7.getSpan = HMA;

    function Kk9() {
        return HMA(qk9.ContextAPI.getInstance().active())
    }
    oc7.getActiveSpan = Kk9;

    function rc7(A, q) {
        return A.setValue(wMA, q)
    }
    oc7.setSpan = rc7;

    function Yk9(A) {
        return A.deleteValue(wMA)
    }
    oc7.deleteSpan = Yk9;

    function zk9(A, q) {
        return rc7(A, new Ak9.NonRecordingSpan(q))
    }
    oc7.setSpanContext = zk9;

    function wk9(A) {
        var q;
        return (q = HMA(A)) === null || q === void 0 ? void 0 : q.spanContext()
    }
    oc7.getSpanContext = wk9
})
// @from(Ln 241328, Col 4)
r_6 = R((Al7) => {
    Object.defineProperty(Al7, "__esModule", {
        value: !0
    });
    Al7.wrapSpanContext = Al7.isSpanContextValid = Al7.isValidSpanId = Al7.isValidTraceId = void 0;
    var sc7 = i_6(),
        Xk9 = n_6(),
        Dk9 = /^([0-9a-f]{32})$/i,
        jk9 = /^[0-9a-f]{16}$/i;

    function tc7(A) {
        return Dk9.test(A) && A !== sc7.INVALID_TRACEID
    }
    Al7.isValidTraceId = tc7;

    function ec7(A) {
        return jk9.test(A) && A !== sc7.INVALID_SPANID
    }
    Al7.isValidSpanId = ec7;

    function Mk9(A) {
        return tc7(A.traceId) && ec7(A.spanId)
    }
    Al7.isSpanContextValid = Mk9;

    function Pk9(A) {
        return new Xk9.NonRecordingSpan(A)
    }
    Al7.wrapSpanContext = Pk9
})
// @from(Ln 241358, Col 4)
JMA = R((zl7) => {
    Object.defineProperty(zl7, "__esModule", {
        value: !0
    });
    zl7.NoopTracer = void 0;
    var fk9 = jB1(),
        Kl7 = $MA(),
        OMA = n_6(),
        Vk9 = r_6(),
        _MA = fk9.ContextAPI.getInstance();
    class Yl7 {
        startSpan(A, q, K = _MA.active()) {
            if (Boolean(q === null || q === void 0 ? void 0 : q.root)) return new OMA.NonRecordingSpan;
            let z = K && (0, Kl7.getSpanContext)(K);
            if (Nk9(z) && (0, Vk9.isSpanContextValid)(z)) return new OMA.NonRecordingSpan(z);
            else return new OMA.NonRecordingSpan
        }
        startActiveSpan(A, q, K, Y) {
            let z, w, H;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) H = q;
            else if (arguments.length === 3) z = q, H = K;
            else z = q, w = K, H = Y;
            let $ = w !== null && w !== void 0 ? w : _MA.active(),
                O = this.startSpan(A, z, $),
                _ = (0, Kl7.setSpan)($, O);
            return _MA.with(_, H, void 0, O)
        }
    }
    zl7.NoopTracer = Yl7;

    function Nk9(A) {
        return typeof A === "object" && typeof A.spanId === "string" && typeof A.traceId === "string" && typeof A.traceFlags === "number"
    }
})
// @from(Ln 241393, Col 4)
XMA = R(($l7) => {
    Object.defineProperty($l7, "__esModule", {
        value: !0
    });
    $l7.ProxyTracer = void 0;
    var Tk9 = JMA(),
        vk9 = new Tk9.NoopTracer;
    class Hl7 {
        constructor(A, q, K, Y) {
            this._provider = A, this.name = q, this.version = K, this.options = Y
        }
        startSpan(A, q, K) {
            return this._getTracer().startSpan(A, q, K)
        }
        startActiveSpan(A, q, K, Y) {
            let z = this._getTracer();
            return Reflect.apply(z.startActiveSpan, z, arguments)
        }
        _getTracer() {
            if (this._delegate) return this._delegate;
            let A = this._provider.getDelegateTracer(this.name, this.version, this.options);
            if (!A) return vk9;
            return this._delegate = A, this._delegate
        }
    }
    $l7.ProxyTracer = Hl7
})
// @from(Ln 241420, Col 4)
Dl7 = R((Jl7) => {
    Object.defineProperty(Jl7, "__esModule", {
        value: !0
    });
    Jl7.NoopTracerProvider = void 0;
    var Ek9 = JMA();
    class _l7 {
        getTracer(A, q, K) {
            return new Ek9.NoopTracer
        }
    }
    Jl7.NoopTracerProvider = _l7
})
// @from(Ln 241433, Col 4)
DMA = R((Ml7) => {
    Object.defineProperty(Ml7, "__esModule", {
        value: !0
    });
    Ml7.ProxyTracerProvider = void 0;
    var kk9 = XMA(),
        Lk9 = Dl7(),
        Rk9 = new Lk9.NoopTracerProvider;
    class jl7 {
        getTracer(A, q, K) {
            var Y;
            return (Y = this.getDelegateTracer(A, q, K)) !== null && Y !== void 0 ? Y : new kk9.ProxyTracer(this, A, q, K)
        }
        getDelegate() {
            var A;
            return (A = this._delegate) !== null && A !== void 0 ? A : Rk9
        }
        setDelegate(A) {
            this._delegate = A
        }
        getDelegateTracer(A, q, K) {
            var Y;
            return (Y = this._delegate) === null || Y === void 0 ? void 0 : Y.getTracer(A, q, K)
        }
    }
    Ml7.ProxyTracerProvider = jl7
})
// @from(Ln 241460, Col 4)
Gl7 = R((Wl7) => {
    Object.defineProperty(Wl7, "__esModule", {
        value: !0
    });
    Wl7.SamplingDecision = void 0;
    var yk9;
    (function(A) {
        A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(yk9 = Wl7.SamplingDecision || (Wl7.SamplingDecision = {}))
})
// @from(Ln 241470, Col 4)
fl7 = R((Zl7) => {
    Object.defineProperty(Zl7, "__esModule", {
        value: !0
    });
    Zl7.SpanKind = void 0;
    var Ck9;
    (function(A) {
        A[A.INTERNAL = 0] = "INTERNAL", A[A.SERVER = 1] = "SERVER", A[A.CLIENT = 2] = "CLIENT", A[A.PRODUCER = 3] = "PRODUCER", A[A.CONSUMER = 4] = "CONSUMER"
    })(Ck9 = Zl7.SpanKind || (Zl7.SpanKind = {}))
})
// @from(Ln 241480, Col 4)
Nl7 = R((Vl7) => {
    Object.defineProperty(Vl7, "__esModule", {
        value: !0
    });
    Vl7.SpanStatusCode = void 0;
    var Sk9;
    (function(A) {
        A[A.UNSET = 0] = "UNSET", A[A.OK = 1] = "OK", A[A.ERROR = 2] = "ERROR"
    })(Sk9 = Vl7.SpanStatusCode || (Vl7.SpanStatusCode = {}))
})
// @from(Ln 241490, Col 4)
El7 = R((Tl7) => {
    Object.defineProperty(Tl7, "__esModule", {
        value: !0
    });
    Tl7.validateValue = Tl7.validateKey = void 0;
    var WMA = "[_0-9a-z-*/]",
        hk9 = `[a-z]${WMA}{0,255}`,
        Ik9 = `[a-z0-9]${WMA}{0,240}@[a-z]${WMA}{0,13}`,
        xk9 = new RegExp(`^(?:${hk9}|${Ik9})$`),
        bk9 = /^[ -~]{0,255}[!-~]$/,
        uk9 = /,|=/;

    function Bk9(A) {
        return xk9.test(A)
    }
    Tl7.validateKey = Bk9;

    function mk9(A) {
        return bk9.test(A) && !uk9.test(A)
    }
    Tl7.validateValue = mk9
})