
// @from(Ln 204493, Col 0)
function xL7(A, q, K, Y, z) {
    try {
        let w = xw6(A, z);
        if (!w) return;
        let H = K01.get(w);
        if (!H) return;
        if (z99(H.model)) return;
        let $ = H.prevCacheReadTokens;
        H.prevCacheReadTokens = q;
        let O = Y.findLast((Z) => Z.type === "assistant"),
            _ = O ? Date.now() - new Date(O.timestamp).getTime() : null;
        if ($ === null) return;
        let J = H.pendingChanges,
            X = $ - q;
        if (q >= $ * 0.95 || X < q99) {
            H.pendingChanges = null, H.microcompacted = !1;
            return
        }
        let D = [],
            j = H.microcompacted;
        if (j) D.push("microcompact"), H.microcompacted = !1;
        if (J) {
            if (J.modelChanged) D.push(`model changed (${J.previousModel} → ${J.newModel})`);
            if (J.systemPromptChanged) {
                let Z = J.systemCharDelta,
                    N = Z === 0 ? "" : Z > 0 ? ` (+${Z} chars)` : ` (${Z} chars)`;
                D.push(`system prompt changed${N}`)
            }
            if (J.toolSchemasChanged) {
                let Z = J.addedToolCount > 0 || J.removedToolCount > 0 ? ` (+${J.addedToolCount}/-${J.removedToolCount} tools)` : " (tool prompt/schema changed, same tool set)";
                D.push(`tools changed${Z}`)
            }
            if (J.fastModeChanged) D.push("fast mode toggled")
        }
        let M = _ !== null && _ > K99,
            P = _ !== null && _ > Y99,
            G = `[PROMPT CACHE BREAK] ${D.length>0?D.join(", "):"unknown cause"} [source=${A}, call #${H.callCount}, cache read: ${$} → ${q}, creation: ${K}]`;
        h(G, {
            level: "warn"
        }), c("tengu_prompt_cache_break", {
            systemPromptChanged: J?.systemPromptChanged ?? !1,
            toolSchemasChanged: J?.toolSchemasChanged ?? !1,
            modelChanged: J?.modelChanged ?? !1,
            fastModeChanged: J?.fastModeChanged ?? !1,
            microcompacted: j,
            addedToolCount: J?.addedToolCount ?? 0,
            removedToolCount: J?.removedToolCount ?? 0,
            callNumber: H.callCount,
            prevCacheReadTokens: $,
            cacheReadTokens: q,
            cacheCreationTokens: K,
            timeSinceLastAssistantMsg: _ ?? -1,
            lastAssistantMsgOver5minAgo: M,
            lastAssistantMsgOver1hAgo: P
        });
        let f;
        if (J?.prevDiffableContent) f = $99(J.prevDiffableContent, H.diffableContent);
        wR6(G, f), H.pendingChanges = null
    } catch (w) {
        K1(w instanceof Error ? w : Error(String(w)))
    }
}
// @from(Ln 204556, Col 0)
function bL7(A, q) {
    let K = xw6(A, q),
        Y = K ? K01.get(K) : void 0;
    if (Y) Y.microcompacted = !0
}
// @from(Ln 204562, Col 0)
function fOA(A, q) {
    let K = xw6(A, q),
        Y = K ? K01.get(K) : void 0;
    if (Y) Y.prevCacheReadTokens = null
}
// @from(Ln 204568, Col 0)
function uL7() {
    K01.clear()
}
// @from(Ln 204572, Col 0)
function $99(A, q) {
    try {
        let K = e59();
        s59("/tmp/claude", {
            recursive: !0
        });
        let Y = ZOA("prompt-state", A, q, "before", "after");
        return t59(K, Y), K
    } catch {
        return
    }
}
// @from(Ln 204584, Col 4)
K01
// @from(Ln 204584, Col 9)
A99
// @from(Ln 204584, Col 14)
q99 = 2000
// @from(Ln 204585, Col 4)
K99 = 300000
// @from(Ln 204586, Col 4)
Y99 = 3600000
// @from(Ln 204587, Col 4)
bx1 = v(() => {
    Z6();
    u6();
    B6();
    m6();
    y6();
    Pq1();
    K01 = new Map, A99 = ["repl_main_thread", "sdk", "agent:custom", "agent:default", "agent:builtin"]
})
// @from(Ln 204597, Col 0)
function BL7(A) {
    let q = `Your task is to create a detailed summary of the RECENT portion of the conversation — the messages that follow earlier retained context. The earlier messages are being kept intact and do NOT need to be summarized. Focus your summary on what was discussed, learned, and accomplished in the recent messages only.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Analyze the recent messages chronologically. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture the user's explicit requests and intents from the recent messages
2. Key Technical Concepts: List important technical concepts, technologies, and frameworks discussed recently.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List errors encountered and how they were fixed.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages from the recent portion that are not tool results.
7. Pending Tasks: Outline any pending tasks from the recent messages.
8. Current Work: Describe precisely what was being worked on immediately before this summary request.
9. Optional Next Step: List the next step related to the most recent work. Include direct quotes from the most recent conversation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Important Code Snippet]

4. Errors and fixes:
    - [Error description]:
      - [How you fixed it]

5. Problem Solving:
   [Description]

6. All user messages:
    - [Detailed non tool use user message]

7. Pending Tasks:
   - [Task 1]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the RECENT messages only (after the retained earlier context), following this structure and ensuring precision and thoroughness in your response.
`;
    if (A && A.trim() !== "") q += `

Additional Instructions:
${A}`;
    return q += `

IMPORTANT: Do NOT use any tools. You MUST respond with ONLY the <summary>...</summary> block as your text output.`, q
}
// @from(Ln 204680, Col 0)
function VOA(A) {
    let q = `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
  - Errors that you ran into and how you fixed them
  - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
6. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
7. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
8. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>
`;
    if (A && A.trim() !== "") q += `

Additional Instructions:
${A}`;
    return q += `

IMPORTANT: Do NOT use any tools. You MUST respond with ONLY the <summary>...</summary> block as your text output.`, q
}
// @from(Ln 204786, Col 0)
function O99(A) {
    let q = A,
        K = q.match(/<analysis>([\s\S]*?)<\/analysis>/);
    if (K) {
        let z = K[1] || "";
        q = q.replace(/<analysis>[\s\S]*?<\/analysis>/, `Analysis:
${z.trim()}`)
    }
    let Y = q.match(/<summary>([\s\S]*?)<\/summary>/);
    if (Y) {
        let z = Y[1] || "";
        q = q.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${z.trim()}`)
    }
    return q = q.replace(/\n\n+/g, `

`), q.trim()
}
// @from(Ln 204805, Col 0)
function ux1(A, q, K, Y) {
    let w = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${O99(A)}`;
    if (K) w += `

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${K}`;
    if (Y) w += `

Recent messages are preserved verbatim.`;
    if (q) return `${w}
Please continue the conversation from where we left off without asking the user any further questions. Continue with the last task that you were asked to work on.`;
    return w
}
// @from(Ln 204820, Col 0)
function _99(A, q) {
    return A?.includes("_staging_") === !0 || q?.includes("staging") === !0
}
// @from(Ln 204824, Col 0)
function J99(A, q) {
    return _99(A, q) ? "https://staging.claude.ai" : "https://claude.ai"
}
// @from(Ln 204828, Col 0)
function bw6(A, q) {
    return `${J99(A,q)}/code/${A}`
}
// @from(Ln 204831, Col 4)
mL7 = "https://claude.com/claude-code"
// @from(Ln 204833, Col 0)
function Z8() {
    let A = FL7.useContext(fJ1);
    if (!A) throw Error("useTerminalSize must be used within an Ink App component");
    return A
}
// @from(Ln 204838, Col 4)
FL7
// @from(Ln 204839, Col 4)
mq = v(() => {
    iK6();
    FL7 = o(X1(), 1)
})
// @from(Ln 204844, Col 0)
function QL7(A) {
    let q = e(10),
        {
            children: K,
            lock: Y
        } = A,
        z = Y === void 0 ? "always" : Y,
        [w, H] = wB(),
        {
            isVisible: $
        } = H,
        {
            rows: O
        } = Z8(),
        _ = DB.useRef(null),
        J = DB.useRef(0),
        [X, D] = DB.useState(0),
        j;
    if (q[0] !== w) j = (N) => {
        w(N)
    }, q[0] = w, q[1] = j;
    else j = q[1];
    let M = j,
        P = z === "always" || !$,
        W;
    if (q[2] !== O) W = () => {
        if (!_.current) return;
        let {
            height: N
        } = ED1(_.current);
        if (N > J.current) J.current = Math.min(N, O), D(J.current)
    }, q[2] = O, q[3] = W;
    else W = q[3];
    DB.useLayoutEffect(W);
    let G = P ? X : void 0,
        f;
    if (q[4] !== K) f = DB.default.createElement(I, {
        ref: _,
        flexDirection: "column"
    }, K), q[4] = K, q[5] = f;
    else f = q[5];
    let Z;
    if (q[6] !== M || q[7] !== G || q[8] !== f) Z = DB.default.createElement(I, {
        minHeight: G,
        ref: M
    }, f), q[6] = M, q[7] = G, q[8] = f, q[9] = Z;
    else Z = q[9];
    return Z
}
// @from(Ln 204893, Col 4)
DB
// @from(Ln 204894, Col 4)
gL7 = v(() => {
    i1();
    m1();
    mq();
    h26();
    DB = o(X1(), 1)
})
// @from(Ln 204902, Col 0)
function HA(A) {
    let q = e(8),
        {
            children: K,
            height: Y
        } = A;
    if (UL7.useContext(pL7)) return K;
    let w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = WZ.createElement(V, null, "  ", "⎿  "), q[0] = w;
    else w = q[0];
    let H;
    if (q[1] !== K) H = WZ.createElement(I, {
        flexShrink: 1,
        flexGrow: 1
    }, K), q[1] = K, q[2] = H;
    else H = q[2];
    let $;
    if (q[3] !== Y || q[4] !== H) $ = WZ.createElement(X99, null, WZ.createElement(I, {
        flexDirection: "row",
        height: Y,
        overflowY: "hidden"
    }, w, H)), q[3] = Y, q[4] = H, q[5] = $;
    else $ = q[5];
    let O = $;
    if (Y !== void 0) return O;
    let _;
    if (q[6] !== O) _ = WZ.createElement(QL7, {
        lock: "offscreen"
    }, O), q[6] = O, q[7] = _;
    else _ = q[7];
    return _
}
// @from(Ln 204935, Col 0)
function X99(A) {
    let q = e(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = WZ.createElement(pL7.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 204947, Col 4)
WZ
// @from(Ln 204947, Col 8)
UL7
// @from(Ln 204947, Col 13)
pL7
// @from(Ln 204948, Col 4)
eq = v(() => {
    i1();
    m1();
    gL7();
    WZ = o(X1(), 1), UL7 = o(X1(), 1);
    pL7 = WZ.createContext(!1)
})
// @from(Ln 204956, Col 0)
function MB() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = jB.createElement(jB.Fragment, null, jB.createElement(V, {
        dimColor: !0
    }, "Interrupted "), jB.createElement(V, {
        dimColor: !0
    }, "· What should Claude do instead?")), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 204967, Col 4)
jB
// @from(Ln 204968, Col 4)
Y01 = v(() => {
    i1();
    m1();
    jB = o(X1(), 1)
})
// @from(Ln 204974, Col 0)
function Y9() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Bx1.createElement(HA, {
        height: 1
    }, Bx1.createElement(MB, null)), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 204983, Col 4)
Bx1
// @from(Ln 204984, Col 4)
CX = v(() => {
    i1();
    eq();
    Y01();
    Bx1 = o(X1(), 1)
})
// @from(Ln 204991, Col 0)
function mx1(A) {
    let q = e(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = Wq1.default.createElement(dL7.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 205004, Col 0)
function aS() {
    let A = e(2),
        q = Wq1.useContext(dL7),
        K = RK("app:toggleTranscript", "Global", "ctrl+o");
    if (q) return null;
    let Y;
    if (A[0] !== K) Y = Wq1.default.createElement(V, {
        dimColor: !0
    }, Wq1.default.createElement(YA, {
        shortcut: K,
        action: "expand",
        parens: !0
    })), A[0] = K, A[1] = Y;
    else Y = A[1];
    return Y
}
// @from(Ln 205021, Col 0)
function cL7() {
    let A = m0("app:toggleTranscript", "Global", "ctrl+o");
    return H6.dim(`(${A} to expand)`)
}
// @from(Ln 205025, Col 4)
Wq1
// @from(Ln 205025, Col 9)
dL7
// @from(Ln 205026, Col 4)
no = v(() => {
    i1();
    m1();
    q3();
    wK();
    s2();
    Wq1 = o(X1(), 1), dL7 = Wq1.default.createContext(!1)
})
// @from(Ln 205035, Col 0)
function TOA(A, q) {
    if (J6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) return;
    let K = q ? `${A} ${q}` : "";
    if (process.platform === "win32") process.title = K;
    else process.stdout.write(`\x1B]0;${K}\x07`)
}
// @from(Ln 205042, Col 0)
function Qx1(A) {
    if (Bw6 = A, !z01) TOA(NOA, A)
}
// @from(Ln 205046, Col 0)
function nL7(A) {
    iL7 = !0, Qx1(A)
}
// @from(Ln 205050, Col 0)
function rL7() {
    Qx1("Claude Code")
}
// @from(Ln 205054, Col 0)
function oL7() {
    return Bw6
}
// @from(Ln 205058, Col 0)
function aL7() {
    if (z01) return;
    uw6 = 0, z01 = setInterval(() => {
        uw6 = (uw6 + 1) % lL7.length, TOA(lL7[uw6] ?? NOA, Bw6)
    }, D99)
}
// @from(Ln 205065, Col 0)
function sL7() {
    if (z01) clearInterval(z01), z01 = null
}
// @from(Ln 205069, Col 0)
function tL7() {
    if (vOA = !0, mC1() !== "blurred") aL7()
}
// @from(Ln 205073, Col 0)
function gx1() {
    vOA = !1, sL7(), TOA(NOA, Bw6)
}
// @from(Ln 205076, Col 0)
async function eL7(A) {
    if (J6(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE)) return;
    if (iL7) return;
    if (A.startsWith(`<${Pw1}>`)) return;
    try {
        let K = (await SX({
                systemPrompt: ["Analyze if this message indicates a new conversation topic. If it does, extract a 2-3 word title that captures the new topic. Format your response as a JSON object with two fields: 'isNewTopic' (boolean) and 'title' (string, or null if isNewTopic is false)."],
                userPrompt: A,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            isNewTopic: {
                                type: "boolean"
                            },
                            title: {
                                anyOf: [{
                                    type: "string"
                                }, {
                                    type: "null"
                                }]
                            }
                        },
                        required: ["isNewTopic", "title"],
                        additionalProperties: !1
                    }
                },
                signal: new AbortController().signal,
                options: {
                    querySource: "terminal_update_title",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content.filter((z) => z.type === "text").map((z) => z.text).join(""),
            Y = j9(K);
        if (Y && typeof Y === "object" && "isNewTopic" in Y && "title" in Y) {
            if (Y.isNewTopic && Y.title) Qx1(Y.title)
        }
    } catch (q) {
        K1(q)
    }
}
// @from(Ln 205122, Col 0)
function AR7() {
    return new Promise((A) => {
        process.stdout.write(Mx1(), () => {
            A()
        })
    })
}
// @from(Ln 205130, Col 0)
function M99(A, q) {
    let K = A.split(`
`),
        Y = [];
    for (let w of K) {
        let H = UA(w);
        if (H <= q) Y.push(w.trimEnd());
        else {
            let $ = 0;
            while ($ < H) {
                let O = hC1(w, $, $ + q);
                Y.push(O.trimEnd()), $ += q
            }
        }
    }
    let z = Y.length - Fx1;
    if (z === 1) return {
        aboveTheFold: Y.slice(0, Fx1 + 1).join(`
`).trimEnd(),
        remainingLines: 0
    };
    return {
        aboveTheFold: Y.slice(0, Fx1).join(`
`).trimEnd(),
        remainingLines: Math.max(0, z)
    }
}
// @from(Ln 205158, Col 0)
function qR7(A, q) {
    let K = A.trimEnd();
    if (!K) return "";
    let Y = Math.max(q - j99, 10),
        z = Fx1 * Y * 4,
        w = K.length > z,
        H = w ? K.slice(0, z) : K,
        {
            aboveTheFold: $,
            remainingLines: O
        } = M99(H, Y),
        _ = w ? Math.max(O, Math.ceil(K.length / Y) - Fx1) : O;
    return [$, _ > 0 ? H6.dim(`… +${_} lines ${cL7()}`) : ""].filter(Boolean).join(`
`)
}
// @from(Ln 205173, Col 4)
lL7
// @from(Ln 205173, Col 9)
NOA = "✳"
// @from(Ln 205174, Col 4)
D99 = 960
// @from(Ln 205175, Col 4)
Bw6 = ""
// @from(Ln 205176, Col 4)
z01 = null
// @from(Ln 205177, Col 4)
uw6 = 0
// @from(Ln 205178, Col 4)
iL7 = !1
// @from(Ln 205179, Col 4)
vOA = !1
// @from(Ln 205180, Col 4)
Fx1 = 3
// @from(Ln 205181, Col 4)
j99 = 10
// @from(Ln 205182, Col 4)
w01 = v(() => {
    yw();
    AH();
    y6();
    q3();
    no();
    hA();
    vz();
    wqA();
    LY();
    $$A();
    MJ1();
    lL7 = ["⠂", "⠐"];
    FC1(() => {
        if (!vOA) return;
        if (mC1() === "blurred") sL7();
        else aL7()
    })
})
// @from(Ln 205202, Col 0)
function zR7(A) {
    let q = e(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = Ux1.createElement(YR7.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 205215, Col 0)
function wR7() {
    return KR7.useContext(YR7)
}
// @from(Ln 205218, Col 4)
Ux1
// @from(Ln 205218, Col 9)
KR7
// @from(Ln 205218, Col 14)
YR7
// @from(Ln 205219, Col 4)
EOA = v(() => {
    i1();
    Ux1 = o(X1(), 1), KR7 = o(X1(), 1), YR7 = Ux1.createContext(!1)
})
// @from(Ln 205224, Col 0)
function P99(A) {
    try {
        let q = _A(A),
            K = Q1(q),
            Y = A.replace(/\s+/g, ""),
            z = K.replace(/\s+/g, "");
        if (Y !== z) return A;
        return Q1(q, null, 2)
    } catch {
        return A
    }
}
// @from(Ln 205237, Col 0)
function HR7(A) {
    if (A.length > W99) return A;
    return A.split(`
`).map(P99).join(`
`)
}
// @from(Ln 205244, Col 0)
function PB(A) {
    let q = e(10),
        {
            content: K,
            verbose: Y,
            isError: z,
            isWarning: w
        } = A,
        {
            columns: H
        } = Z8(),
        $ = wR7(),
        O = Y || $,
        _;
    if (O) {
        let M;
        if (q[0] !== K) M = mw6(HR7(K)), q[0] = K, q[1] = M;
        else M = q[1];
        _ = M
    } else {
        let M;
        if (q[2] !== H || q[3] !== K) M = mw6(qR7(HR7(K), H)), q[2] = H, q[3] = K, q[4] = M;
        else M = q[4];
        _ = M
    }
    let J = _,
        X = z ? "error" : w ? "warning" : void 0,
        D;
    if (q[5] !== J) D = Gq1.createElement(W3, null, J), q[5] = J, q[6] = D;
    else D = q[6];
    let j;
    if (q[7] !== X || q[8] !== D) j = Gq1.createElement(HA, null, Gq1.createElement(V, {
        color: X
    }, D)), q[7] = X, q[8] = D, q[9] = j;
    else j = q[9];
    return j
}
// @from(Ln 205282, Col 0)
function mw6(A) {
    return A.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "")
}
// @from(Ln 205285, Col 4)
Gq1
// @from(Ln 205285, Col 9)
W99 = 1e4
// @from(Ln 205286, Col 4)
H01 = v(() => {
    i1();
    m1();
    eq();
    mq();
    w01();
    m6();
    EOA();
    Gq1 = o(X1(), 1)
})
// @from(Ln 205297, Col 0)
function Fw6(A) {
    return A.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}
// @from(Ln 205301, Col 0)
function z5(A) {
    let q = e(16),
        {
            result: K,
            verbose: Y
        } = A,
        z = RK("app:toggleTranscript", "Global", "ctrl+o"),
        w, H, $, O, _;
    if (q[0] !== K || q[1] !== z || q[2] !== Y) {
        let D;
        if (typeof K !== "string") D = "Tool execution failed";
        else {
            let M = C4(K, "tool_use_error") ?? K,
                W = Fw6(M).trim();
            if (!Y && W.includes("InputValidationError: ")) D = "Invalid tool parameters";
            else if (W.startsWith("Error: ")) D = W;
            else D = `Error: ${W}`
        }
        let j = D.split(`
`).length - kOA;
        H = HA, w = I, $ = "column", O = SM.createElement(V, {
            color: "error"
        }, mw6(Y ? D : D.split(`
`).slice(0, kOA).join(`
`))), _ = !Y && D.split(`
`).length > kOA && SM.createElement(I, null, SM.createElement(V, {
            dimColor: !0
        }, "… +", j, " ", j === 1 ? "line" : "lines", " ("), SM.createElement(V, {
            dimColor: !0,
            bold: !0
        }, z), SM.createElement(V, null, " "), SM.createElement(V, {
            dimColor: !0
        }, "to see all)")), q[0] = K, q[1] = z, q[2] = Y, q[3] = w, q[4] = H, q[5] = $, q[6] = O, q[7] = _
    } else w = q[3], H = q[4], $ = q[5], O = q[6], _ = q[7];
    let J;
    if (q[8] !== w || q[9] !== $ || q[10] !== O || q[11] !== _) J = SM.createElement(w, {
        flexDirection: $
    }, O, _), q[8] = w, q[9] = $, q[10] = O, q[11] = _, q[12] = J;
    else J = q[12];
    let X;
    if (q[13] !== H || q[14] !== J) X = SM.createElement(H, null, J), q[13] = H, q[14] = J, q[15] = X;
    else X = q[15];
    return X
}
// @from(Ln 205345, Col 4)
SM
// @from(Ln 205345, Col 8)
kOA = 10
// @from(Ln 205346, Col 4)
UO = v(() => {
    i1();
    m1();
    eq();
    N8();
    H01();
    s2();
    SM = o(X1(), 1)
})
// @from(Ln 205355, Col 4)
$R7 = 1e5
// @from(Ln 205356, Col 4)
LOA = 4
// @from(Ln 205357, Col 4)
px1 = 400000
// @from(Ln 205358, Col 4)
sS = 50
// @from(Ln 205360, Col 0)
function ROA(A) {
    let q = e(25),
        {
            count: K,
            countLabel: Y,
            secondaryCount: z,
            secondaryLabel: w,
            content: H,
            verbose: $
        } = A,
        O;
    if (q[0] !== K) O = hX.default.createElement(V, {
        bold: !0
    }, K, " "), q[0] = K, q[1] = O;
    else O = q[1];
    let _;
    if (q[2] !== K || q[3] !== Y) _ = K === 0 || K > 1 ? Y : Y.slice(0, -1), q[2] = K, q[3] = Y, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== O || q[6] !== _) J = hX.default.createElement(V, null, "Found ", O, _), q[5] = O, q[6] = _, q[7] = J;
    else J = q[7];
    let X = J,
        D;
    if (q[8] !== z || q[9] !== w) D = z !== void 0 && w ? hX.default.createElement(V, null, " ", "across ", hX.default.createElement(V, {
        bold: !0
    }, z, " "), z === 0 || z > 1 ? w : w.slice(0, -1)) : null, q[8] = z, q[9] = w, q[10] = D;
    else D = q[10];
    let j = D;
    if ($) {
        let W;
        if (q[11] !== X || q[12] !== j) W = hX.default.createElement(I, {
            flexDirection: "row"
        }, hX.default.createElement(V, null, "  ⎿  ", X, j)), q[11] = X, q[12] = j, q[13] = W;
        else W = q[13];
        let G;
        if (q[14] !== H) G = hX.default.createElement(I, {
            marginLeft: 5
        }, hX.default.createElement(V, null, H)), q[14] = H, q[15] = G;
        else G = q[15];
        let f;
        if (q[16] !== W || q[17] !== G) f = hX.default.createElement(I, {
            flexDirection: "column"
        }, W, G), q[16] = W, q[17] = G, q[18] = f;
        else f = q[18];
        return f
    }
    let M;
    if (q[19] !== K) M = K > 0 && hX.default.createElement(aS, null), q[19] = K, q[20] = M;
    else M = q[20];
    let P;
    if (q[21] !== X || q[22] !== j || q[23] !== M) P = hX.default.createElement(HA, {
        height: 1
    }, hX.default.createElement(V, null, X, j, " ", M)), q[21] = X, q[22] = j, q[23] = M, q[24] = P;
    else P = q[24];
    return P
}
// @from(Ln 205417, Col 0)
function OR7({
    pattern: A,
    path: q
}, {
    verbose: K
}) {
    if (!A) return null;
    let Y = [`pattern: "${A}"`];
    if (q) Y.push(`path: "${K?q:L3(q)}"`);
    return Y.join(", ")
}
// @from(Ln 205429, Col 0)
function _R7() {
    return hX.default.createElement(Y9, null)
}
// @from(Ln 205433, Col 0)
function JR7(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return hX.default.createElement(HA, null, hX.default.createElement(V, {
        color: "error"
    }, "Error searching files"));
    return hX.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 205445, Col 0)
function XR7() {
    return null
}
// @from(Ln 205449, Col 0)
function DR7({
    mode: A = "files_with_matches",
    filenames: q,
    numFiles: K,
    content: Y,
    numLines: z,
    numMatches: w
}, H, {
    verbose: $
}) {
    if (A === "content") return hX.default.createElement(ROA, {
        count: z ?? 0,
        countLabel: "lines",
        content: Y,
        verbose: $
    });
    if (A === "count") return hX.default.createElement(ROA, {
        count: w ?? 0,
        countLabel: "matches",
        secondaryCount: K,
        secondaryLabel: "files",
        content: Y,
        verbose: $
    });
    let O = q.map((_) => _).join(`
`);
    return hX.default.createElement(ROA, {
        count: K,
        countLabel: "files",
        content: O,
        verbose: $
    })
}
// @from(Ln 205483, Col 0)
function yOA(A) {
    if (!A?.pattern) return null;
    return DY(A.pattern, sS)
}
// @from(Ln 205487, Col 4)
hX
// @from(Ln 205488, Col 4)
jR7 = v(() => {
    i1();
    m1();
    CX();
    UO();
    eq();
    no();
    wq();
    N8();
    vq();
    hX = o(X1(), 1)
})
// @from(Ln 205504, Col 0)
function COA(A, q, K = 0) {
    if (q === void 0) return A.slice(K);
    return A.slice(K, K + q)
}
// @from(Ln 205509, Col 0)
function SOA(A) {
    let q = h6(),
        K = G99(q, A);
    return K.startsWith("..") ? A : K
}
// @from(Ln 205515, Col 0)
function hOA(A, q) {
    if (!A && !q) return "";
    return `limit: ${A}, offset: ${q??0}`
}
// @from(Ln 205519, Col 4)
Z99
// @from(Ln 205519, Col 9)
f99
// @from(Ln 205519, Col 14)
V99
// @from(Ln 205519, Col 19)
tS
// @from(Ln 205520, Col 4)
$01 = v(() => {
    i7();
    N7();
    Ez();
    ix();
    DW();
    E2();
    _8();
    jR7();
    Z99 = z7(() => u.strictObject({
        pattern: u.string().describe("The regular expression pattern to search for in file contents"),
        path: u.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
        glob: u.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
        output_mode: u.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
        "-B": u.number().optional().describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
        "-A": u.number().optional().describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
        "-C": u.number().optional().describe("Alias for context."),
        context: u.number().optional().describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
        "-n": u.boolean().optional().describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
        "-i": u.boolean().optional().describe("Case insensitive search (rg -i)"),
        type: u.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
        head_limit: u.number().optional().describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 0 (unlimited).'),
        offset: u.number().optional().describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
        multiline: u.boolean().optional().describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
    })), f99 = [".git", ".svn", ".hg", ".bzr"];
    V99 = z7(() => u.object({
        mode: u.enum(["content", "files_with_matches", "count"]).optional(),
        numFiles: u.number(),
        filenames: u.array(u.string()),
        content: u.string().optional(),
        numLines: u.number().optional(),
        numMatches: u.number().optional(),
        appliedLimit: u.number().optional(),
        appliedOffset: u.number().optional()
    })), tS = {
        name: s9,
        maxResultSizeChars: 20000,
        strict: !0,
        input_examples: [{
            pattern: "TODO",
            output_mode: "files_with_matches"
        }, {
            pattern: "function.*export",
            glob: "*.ts",
            output_mode: "content",
            "-n": !0
        }, {
            pattern: "error",
            "-i": !0,
            type: "js",
            output_mode: "content",
            "-B": 2,
            "-A": 5
        }, {
            pattern: "import.*from",
            path: "/Users/username/project/src",
            output_mode: "content",
            "-C": 3,
            head_limit: 20
        }],
        async description() {
            return w7A()
        },
        userFacingName() {
            return "Search"
        },
        getToolUseSummary: yOA,
        getActivityDescription(A) {
            let q = yOA(A);
            return q ? `Searching for ${q}` : "Searching"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return Z99()
        },
        get outputSchema() {
            return V99()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: A
        }) {
            return A || h6()
        },
        async validateInput({
            path: A
        }) {
            if (A) {
                let q = b1(),
                    K = g4(A);
                if (K.startsWith("\\\\") || K.startsWith("//")) return {
                    result: !0
                };
                if (!q.existsSync(K)) return {
                    result: !1,
                    message: `Path does not exist: ${A}`,
                    errorCode: 1
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return ro(tS, A, K.toolPermissionContext)
        },
        async prompt() {
            return w7A()
        },
        renderToolUseMessage: OR7,
        renderToolUseRejectedMessage: _R7,
        renderToolUseErrorMessage: JR7,
        renderToolUseProgressMessage: XR7,
        renderToolResultMessage: DR7,
        mapToolResultToToolResultBlockParam({
            mode: A = "files_with_matches",
            numFiles: q,
            filenames: K,
            content: Y,
            numLines: z,
            numMatches: w,
            appliedLimit: H,
            appliedOffset: $
        }, O) {
            if (A === "content") {
                let X = hOA(H, $),
                    D = Y || "No matches found",
                    j = X ? `${D}

[Showing results with pagination = ${X}]` : D;
                return {
                    tool_use_id: O,
                    type: "tool_result",
                    content: j
                }
            }
            if (A === "count") {
                let X = hOA(H, $),
                    D = Y || "No matches found",
                    j = w ?? 0,
                    M = q ?? 0,
                    P = `

Found ${j} total ${j===1?"occurrence":"occurrences"} across ${M} ${M===1?"file":"files"}.${X?` with pagination = ${X}`:""}`;
                return {
                    tool_use_id: O,
                    type: "tool_result",
                    content: D + P
                }
            }
            let _ = hOA(H, $);
            if (q === 0) return {
                tool_use_id: O,
                type: "tool_result",
                content: "No files found"
            };
            let J = `Found ${q} file${q===1?"":"s"}${_?` ${_}`:""}
${K.join(`
`)}`;
            return {
                tool_use_id: O,
                type: "tool_result",
                content: J
            }
        },
        async call({
            pattern: A,
            path: q,
            glob: K,
            type: Y,
            output_mode: z = "files_with_matches",
            "-B": w,
            "-A": H,
            "-C": $,
            context: O,
            "-n": _ = !0,
            "-i": J = !1,
            head_limit: X,
            offset: D = 0,
            multiline: j = !1
        }, {
            abortController: M,
            getAppState: P
        }) {
            let W = q ? g4(q) : h6(),
                G = ["--hidden"];
            for (let m of f99) G.push("--glob", `!${m}`);
            if (G.push("--max-columns", "500"), j) G.push("-U", "--multiline-dotall");
            if (J) G.push("-i");
            if (z === "files_with_matches") G.push("-l");
            else if (z === "count") G.push("-c");
            if (_ && z === "content") G.push("-n");
            if (z === "content")
                if (O !== void 0) G.push("-C", O.toString());
                else if ($ !== void 0) G.push("-C", $.toString());
            else {
                if (w !== void 0) G.push("-B", w.toString());
                if (H !== void 0) G.push("-A", H.toString())
            }
            if (A.startsWith("-")) G.push("-e", A);
            else G.push(A);
            if (Y) G.push("--type", Y);
            if (K) {
                let m = [],
                    b = K.split(/\s+/);
                for (let g of b)
                    if (g.includes("{") && g.includes("}")) m.push(g);
                    else m.push(...g.split(",").filter(Boolean));
                for (let g of m.filter(Boolean)) G.push("--glob", g)
            }
            let f = await P(),
                Z = O01(_01(f.toolPermissionContext), h6());
            for (let m of Z) {
                let b = m.startsWith("/") ? `!${m}` : `!**/${m}`;
                G.push("--glob", b)
            }
            let N = await lx(G, W, M.signal);
            if (z === "content") {
                let m = N.map((U) => {
                        let x = U.indexOf(":");
                        if (x > 0) {
                            let p = U.substring(0, x),
                                l = U.substring(x);
                            return SOA(p) + l
                        }
                        return U
                    }),
                    b = COA(m, X, D);
                return {
                    data: {
                        mode: "content",
                        numFiles: 0,
                        filenames: [],
                        content: b.join(`
`),
                        numLines: b.length,
                        ...X !== void 0 && {
                            appliedLimit: X
                        },
                        ...D > 0 && {
                            appliedOffset: D
                        }
                    }
                }
            }
            if (z === "count") {
                let m = N.map((p) => {
                        let l = p.lastIndexOf(":");
                        if (l > 0) {
                            let r = p.substring(0, l),
                                s = p.substring(l);
                            return SOA(r) + s
                        }
                        return p
                    }),
                    b = COA(m, X, D),
                    g = 0,
                    U = 0;
                for (let p of b) {
                    let l = p.lastIndexOf(":");
                    if (l > 0) {
                        let r = p.substring(l + 1),
                            s = parseInt(r, 10);
                        if (!isNaN(s)) g += s, U += 1
                    }
                }
                return {
                    data: {
                        mode: "count",
                        numFiles: U,
                        filenames: [],
                        content: b.join(`
`),
                        numMatches: g,
                        ...X !== void 0 && {
                            appliedLimit: X
                        },
                        ...D > 0 && {
                            appliedOffset: D
                        }
                    }
                }
            }
            let T = await Promise.all(N.map((m) => b1().stat(m))),
                k = N.map((m, b) => [m, T[b]]).sort((m, b) => {
                    let g = (b[1].mtimeMs ?? 0) - (m[1].mtimeMs ?? 0);
                    if (g === 0) return m[0].localeCompare(b[0]);
                    return g
                }).map((m) => m[0]),
                B = COA(k, X, D).map(SOA);
            return {
                data: {
                    mode: "files_with_matches",
                    filenames: B,
                    numFiles: B.length,
                    ...X !== void 0 && {
                        appliedLimit: X
                    },
                    ...D > 0 && {
                        appliedOffset: D
                    }
                }
            }
        }
    }
})
// @from(Ln 205841, Col 0)
function MR7() {
    return "Search"
}
// @from(Ln 205845, Col 0)
function PR7({
    pattern: A,
    path: q
}, {
    verbose: K
}) {
    if (!A) return null;
    if (!q) return `pattern: "${A}"`;
    return `pattern: "${A}", path: "${K?q:L3(q)}"`
}
// @from(Ln 205856, Col 0)
function WR7() {
    return dx1.default.createElement(Y9, null)
}
// @from(Ln 205860, Col 0)
function GR7(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return dx1.default.createElement(HA, null, dx1.default.createElement(V, {
        color: "error"
    }, "Error searching files"));
    return dx1.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 205872, Col 0)
function ZR7() {
    return null
}
// @from(Ln 205876, Col 0)
function IOA(A) {
    if (!A?.pattern) return null;
    return DY(A.pattern, sS)
}
// @from(Ln 205880, Col 4)
dx1
// @from(Ln 205880, Col 9)
fR7
// @from(Ln 205881, Col 4)
VR7 = v(() => {
    m1();
    CX();
    UO();
    eq();
    N8();
    wq();
    $01();
    vq();
    dx1 = o(X1(), 1);
    fR7 = tS.renderToolResultMessage
})
// @from(Ln 205893, Col 4)
N99
// @from(Ln 205893, Col 9)
T99
// @from(Ln 205893, Col 14)
WB
// @from(Ln 205894, Col 4)
cx1 = v(() => {
    i7();
    N7();
    wq();
    E2();
    Ez();
    _8();
    VR7();
    N99 = z7(() => u.strictObject({
        pattern: u.string().describe("The glob pattern to match files against"),
        path: u.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
    })), T99 = z7(() => u.object({
        durationMs: u.number().describe("Time taken to execute the search in milliseconds"),
        numFiles: u.number().describe("Total number of files found"),
        filenames: u.array(u.string()).describe("Array of file paths that match the pattern"),
        truncated: u.boolean().describe("Whether results were truncated (limited to 100 files)")
    })), WB = {
        name: Jz,
        maxResultSizeChars: 1e5,
        async description() {
            return z7A
        },
        userFacingName: MR7,
        getToolUseSummary: IOA,
        getActivityDescription(A) {
            let q = IOA(A);
            return q ? `Finding ${q}` : "Finding files"
        },
        isEnabled() {
            return !0
        },
        get inputSchema() {
            return N99()
        },
        get outputSchema() {
            return T99()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !0,
                isRead: !1
            }
        },
        getPath({
            path: A
        }) {
            return A ? g4(A) : h6()
        },
        async validateInput({
            path: A
        }) {
            if (A) {
                let q = b1(),
                    K = g4(A);
                if (K.startsWith("\\\\") || K.startsWith("//")) return {
                    result: !0
                };
                if (!q.existsSync(K)) return {
                    result: !1,
                    message: `Directory does not exist: ${A}`,
                    errorCode: 1
                };
                if (!q.statSync(K).isDirectory()) return {
                    result: !1,
                    message: `Path is not a directory: ${A}`,
                    errorCode: 2
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return ro(WB, A, K.toolPermissionContext)
        },
        async prompt() {
            return z7A
        },
        renderToolUseMessage: PR7,
        renderToolUseRejectedMessage: WR7,
        renderToolUseErrorMessage: GR7,
        renderToolUseProgressMessage: ZR7,
        renderToolResultMessage: fR7,
        async call(A, {
            abortController: q,
            getAppState: K,
            globLimits: Y
        }) {
            let z = Date.now(),
                w = await K(),
                H = Y?.maxResults ?? 100,
                {
                    files: $,
                    truncated: O
                } = await NR7(A.pattern, WB.getPath(A), {
                    limit: H,
                    offset: 0
                }, q.signal, w.toolPermissionContext);
            return {
                data: {
                    filenames: $,
                    durationMs: Date.now() - z,
                    numFiles: $.length,
                    truncated: O
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            if (A.filenames.length === 0) return {
                tool_use_id: q,
                type: "tool_result",
                content: "No files found"
            };
            return {
                tool_use_id: q,
                type: "tool_result",
                content: [...A.filenames, ...A.truncated ? ["(Results are truncated. Consider using a more specific path or pattern.)"] : []].join(`
`)
            }
        }
    }
})
// @from(Ln 206023, Col 4)
Qw6
// @from(Ln 206023, Col 9)
xOA
// @from(Ln 206023, Col 14)
TR7
// @from(Ln 206024, Col 4)
gw6 = v(() => {
    i7();
    Qw6 = z7(() => u.strictObject({
        file_path: u.string().describe("The absolute path to the file to modify"),
        old_string: u.string().describe("The text to replace"),
        new_string: u.string().describe("The text to replace it with (must be different from old_string)"),
        replace_all: u.boolean().default(!1).optional().describe("Replace all occurrences of old_string (default false)")
    })), xOA = u.object({
        oldStart: u.number(),
        oldLines: u.number(),
        newStart: u.number(),
        newLines: u.number(),
        lines: u.array(u.string())
    }), TR7 = z7(() => u.object({
        filePath: u.string().describe("The file path that was edited"),
        oldString: u.string().describe("The original string that was replaced"),
        newString: u.string().describe("The new string that replaced it"),
        originalFile: u.string().describe("The original file contents before editing"),
        structuredPatch: u.array(xOA).describe("Diff patch showing the changes"),
        userModified: u.boolean().describe("Whether the user modified the proposed changes"),
        replaceAll: u.boolean().describe("Whether all occurrences were replaced"),
        gitDiff: u.object({
            filename: u.string(),
            status: u.enum(["modified", "added"]),
            additions: u.number(),
            deletions: u.number(),
            changes: u.number(),
            patch: u.string()
        }).optional()
    }))
})
// @from(Ln 206059, Col 0)
function v99(A) {
    return vR7("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Ln 206063, Col 0)
function E99(A) {
    return vR7("sha256").update(A).digest("hex")
}
// @from(Ln 206067, Col 0)
function eS(A) {
    let q = {
        operation: A.operation,
        tool: A.tool,
        filePathHash: v99(A.filePath)
    };
    if (A.content !== void 0 && A.content.length <= k99) q.contentHash = E99(A.content);
    if (A.type !== void 0) q.type = A.type;
    c("tengu_file_operation", q)
}
// @from(Ln 206077, Col 4)
k99 = 102400
// @from(Ln 206078, Col 4)
Uw6 = v(() => {
    u6()
})
// @from(Ln 206082, Col 0)
function lx1(A) {
    return A.replaceAll("&", kR7).replaceAll("$", LR7)
}
// @from(Ln 206086, Col 0)
function RR7(A) {
    return A.replaceAll(kR7, "&").replaceAll(LR7, "$")
}
// @from(Ln 206090, Col 0)
function ix1(A, q) {
    let K = 0,
        Y = 0;
    if (A.length === 0 && q) K = q.split(/\r?\n/).length;
    else K = A.reduce((z, w) => z + w.lines.filter((H) => H.startsWith("+")).length, 0), Y = A.reduce((z, w) => z + w.lines.filter((H) => H.startsWith("-")).length, 0);
    Xn1(K, Y), jn1()?.add(K, {
        type: "added"
    }), jn1()?.add(Y, {
        type: "removed"
    }), c("tengu_file_changed", {
        lines_added: K,
        lines_removed: Y
    })
}
// @from(Ln 206105, Col 0)
function yR7({
    filePath: A,
    oldContent: q,
    newContent: K,
    ignoreWhitespace: Y = !1,
    singleHunk: z = !1
}) {
    return io(A, A, lx1(q), lx1(K), void 0, void 0, {
        ignoreWhitespace: Y,
        context: z ? 1e5 : ER7
    }).hunks.map((w) => ({
        ...w,
        lines: w.lines.map(RR7)
    }))
}
// @from(Ln 206121, Col 0)
function kv({
    filePath: A,
    fileContents: q,
    edits: K,
    ignoreWhitespace: Y = !1
}) {
    let z = lx1(J01(q));
    return io(A, A, z, K.reduce((w, H) => {
        let {
            old_string: $,
            new_string: O
        } = H, _ = "replace_all" in H ? H.replace_all : !1, J = lx1(J01($)), X = lx1(J01(O));
        if (_) return w.replaceAll(J, () => X);
        else return w.replace(J, () => X)
    }, z), void 0, void 0, {
        context: ER7,
        ignoreWhitespace: Y
    }).hunks.map((w) => ({
        ...w,
        lines: w.lines.map(RR7)
    }))
}
// @from(Ln 206143, Col 4)
ER7 = 3
// @from(Ln 206144, Col 4)
kR7 = "<<:AMPERSAND_TOKEN:>>"
// @from(Ln 206145, Col 4)
LR7 = "<<:DOLLAR_TOKEN:>>"
// @from(Ln 206146, Col 4)
wp = v(() => {
    Pq1();
    DL();
    wq();
    u6();
    B6()
})
// @from(Ln 206153, Col 4)
CR7 = v(() => {
    IG()
})
// @from(Ln 206156, Col 4)
SR7 = () => {}
// @from(Ln 206157, Col 4)
hR7 = () => {}
// @from(Ln 206158, Col 4)
IR7 = () => {}
// @from(Ln 206159, Col 4)
xR7 = () => {}
// @from(Ln 206160, Col 4)
bR7 = v(() => {
    IG();
    ga1();
    IR7();
    xR7();
    CR7();
    SR7();
    hR7()
})
// @from(Ln 206169, Col 4)
uR7 = v(() => {
    bR7()
})
// @from(Ln 206172, Col 4)
BR7 = v(() => {
    uR7()
})
// @from(Ln 206176, Col 0)
function oo(A) {
    return !!A._zod
}
// @from(Ln 206180, Col 0)
function GZ(A, q) {
    if (oo(A)) return gw1(A, q);
    return A.safeParse(q)
}
// @from(Ln 206185, Col 0)
function X01(A) {
    var q, K;
    if (!A) return;
    let Y;
    if (oo(A)) Y = (K = (q = A._zod) === null || q === void 0 ? void 0 : q.def) === null || K === void 0 ? void 0 : K.shape;
    else Y = A.shape;
    if (!Y) return;
    if (typeof Y === "function") try {
        return Y()
    } catch (z) {
        return
    }
    return Y
}
// @from(Ln 206200, Col 0)
function mR7(A) {
    var q;
    if (oo(A)) {
        let H = (q = A._zod) === null || q === void 0 ? void 0 : q.def;
        if (H) {
            if (H.value !== void 0) return H.value;
            if (Array.isArray(H.values) && H.values.length > 0) return H.values[0]
        }
    }
    let Y = A._def;
    if (Y) {
        if (Y.value !== void 0) return Y.value;
        if (Array.isArray(Y.values) && Y.values.length > 0) return Y.values[0]
    }
    let z = A.value;
    if (z !== void 0) return z;
    return
}
// @from(Ln 206218, Col 4)
nx1 = v(() => {
    BR7()
})
// @from(Ln 206221, Col 4)
ao = "2025-11-25"
// @from(Ln 206222, Col 4)
dw6
// @from(Ln 206222, Col 9)
ZB = "io.modelcontextprotocol/related-task"
// @from(Ln 206223, Col 4)
cw6 = "2.0"
// @from(Ln 206224, Col 4)
GB
// @from(Ln 206224, Col 8)
FR7
// @from(Ln 206224, Col 13)
QR7
// @from(Ln 206224, Col 18)
C99
// @from(Ln 206224, Col 23)
bOA
// @from(Ln 206224, Col 28)
S99
// @from(Ln 206224, Col 33)
QV
// @from(Ln 206224, Col 37)
hM
// @from(Ln 206224, Col 41)
Zq1
// @from(Ln 206224, Col 46)
aL
// @from(Ln 206224, Col 50)
yW
// @from(Ln 206224, Col 54)
lw6
// @from(Ln 206224, Col 59)
gR7
// @from(Ln 206224, Col 64)
rx1 = (A) => gR7.safeParse(A).success
// @from(Ln 206225, Col 4)
UR7
// @from(Ln 206225, Col 9)
pR7 = (A) => UR7.safeParse(A).success
// @from(Ln 206226, Col 4)
dR7
// @from(Ln 206226, Col 9)
fq1 = (A) => dR7.safeParse(A).success
// @from(Ln 206227, Col 4)
VK
// @from(Ln 206227, Col 8)
cR7
// @from(Ln 206227, Col 13)
lR7 = (A) => cR7.safeParse(A).success
// @from(Ln 206228, Col 4)
Ah
// @from(Ln 206228, Col 8)
Hp
// @from(Ln 206228, Col 12)
h99
// @from(Ln 206228, Col 17)
iw6
// @from(Ln 206228, Col 22)
I99
// @from(Ln 206228, Col 27)
ox1
// @from(Ln 206228, Col 32)
D01
// @from(Ln 206228, Col 37)
iR7
// @from(Ln 206228, Col 42)
x99
// @from(Ln 206228, Col 47)
b99
// @from(Ln 206228, Col 52)
u99
// @from(Ln 206228, Col 57)
B99
// @from(Ln 206228, Col 62)
m99
// @from(Ln 206228, Col 67)
F99
// @from(Ln 206228, Col 72)
uOA
// @from(Ln 206228, Col 77)
Q99
// @from(Ln 206228, Col 82)
BOA
// @from(Ln 206228, Col 87)
nw6
// @from(Ln 206228, Col 92)
nR7 = (A) => nw6.safeParse(A).success
// @from(Ln 206229, Col 4)
rw6
// @from(Ln 206229, Col 9)
g99
// @from(Ln 206229, Col 14)
U99
// @from(Ln 206229, Col 19)
ow6
// @from(Ln 206229, Col 24)
p99
// @from(Ln 206229, Col 29)
ax1
// @from(Ln 206229, Col 34)
sx1
// @from(Ln 206229, Col 39)
tx1
// @from(Ln 206229, Col 44)
$p
// @from(Ln 206229, Col 48)
d99
// @from(Ln 206229, Col 53)
ex1
// @from(Ln 206229, Col 58)
aw6
// @from(Ln 206229, Col 63)
sw6
// @from(Ln 206229, Col 68)
tw6
// @from(Ln 206229, Col 73)
ew6
// @from(Ln 206229, Col 78)
AH6
// @from(Ln 206229, Col 83)
rR7
// @from(Ln 206229, Col 88)
oR7
// @from(Ln 206229, Col 93)
aR7
// @from(Ln 206229, Col 98)
sR7
// @from(Ln 206229, Col 103)
mOA
// @from(Ln 206229, Col 108)
tR7
// @from(Ln 206229, Col 113)
j01
// @from(Ln 206229, Col 118)
eR7
// @from(Ln 206229, Col 123)
c99
// @from(Ln 206229, Col 128)
l99
// @from(Ln 206229, Col 133)
Vq1
// @from(Ln 206229, Col 138)
i99
// @from(Ln 206229, Col 143)
FOA
// @from(Ln 206229, Col 148)
QOA
// @from(Ln 206229, Col 153)
n99
// @from(Ln 206229, Col 158)
r99
// @from(Ln 206229, Col 163)
Nq1
// @from(Ln 206229, Col 168)
gOA
// @from(Ln 206229, Col 173)
o99
// @from(Ln 206229, Col 178)
a99
// @from(Ln 206229, Col 183)
s99
// @from(Ln 206229, Col 188)
t99
// @from(Ln 206229, Col 193)
e99
// @from(Ln 206229, Col 198)
AY9
// @from(Ln 206229, Col 203)
qY9
// @from(Ln 206229, Col 208)
KY9
// @from(Ln 206229, Col 213)
YY9
// @from(Ln 206229, Col 218)
Ab1
// @from(Ln 206229, Col 223)
zY9
// @from(Ln 206229, Col 228)
wY9
// @from(Ln 206229, Col 233)
UOA
// @from(Ln 206229, Col 238)
pOA
// @from(Ln 206229, Col 243)
dOA
// @from(Ln 206229, Col 248)
HY9
// @from(Ln 206229, Col 253)
$Y9
// @from(Ln 206229, Col 258)
OY9
// @from(Ln 206229, Col 263)
cOA
// @from(Ln 206229, Col 268)
_Y9
// @from(Ln 206229, Col 273)
lOA
// @from(Ln 206229, Col 278)
iOA
// @from(Ln 206229, Col 283)
JY9
// @from(Ln 206229, Col 288)
XY9
// @from(Ln 206229, Col 293)
Ay7
// @from(Ln 206229, Col 298)
qb1
// @from(Ln 206229, Col 303)
Kb1
// @from(Ln 206229, Col 308)
ZZ
// @from(Ln 206229, Col 312)
RKw
// @from(Ln 206229, Col 317)
DY9
// @from(Ln 206229, Col 322)
Tq1
// @from(Ln 206229, Col 327)
nOA
// @from(Ln 206229, Col 332)
Yb1
// @from(Ln 206229, Col 337)
jY9
// @from(Ln 206229, Col 342)
rOA
// @from(Ln 206229, Col 347)
MY9
// @from(Ln 206229, Col 352)
PY9
// @from(Ln 206229, Col 357)
WY9
// @from(Ln 206229, Col 362)
GY9
// @from(Ln 206229, Col 367)
ZY9
// @from(Ln 206229, Col 372)
fY9
// @from(Ln 206229, Col 377)
VY9
// @from(Ln 206229, Col 382)
pw6
// @from(Ln 206229, Col 387)
NY9
// @from(Ln 206229, Col 392)
TY9
// @from(Ln 206229, Col 397)
oOA
// @from(Ln 206229, Col 402)
zb1
// @from(Ln 206229, Col 407)
aOA
// @from(Ln 206229, Col 412)
vY9
// @from(Ln 206229, Col 417)
EY9
// @from(Ln 206229, Col 422)
kY9
// @from(Ln 206229, Col 427)
LY9
// @from(Ln 206229, Col 432)
RY9
// @from(Ln 206229, Col 437)
yY9
// @from(Ln 206229, Col 442)
CY9
// @from(Ln 206229, Col 447)
SY9
// @from(Ln 206229, Col 452)
hY9
// @from(Ln 206229, Col 457)
IY9
// @from(Ln 206229, Col 462)
xY9
// @from(Ln 206229, Col 467)
bY9
// @from(Ln 206229, Col 472)
uY9
// @from(Ln 206229, Col 477)
BY9
// @from(Ln 206229, Col 482)
mY9
// @from(Ln 206229, Col 487)
vq1
// @from(Ln 206229, Col 492)
FY9
// @from(Ln 206229, Col 497)
QY9
// @from(Ln 206229, Col 502)
M01
// @from(Ln 206229, Col 507)
gY9
// @from(Ln 206229, Col 512)
UY9
// @from(Ln 206229, Col 517)
pY9
// @from(Ln 206229, Col 522)
dY9
// @from(Ln 206229, Col 527)
sOA
// @from(Ln 206229, Col 532)
cY9
// @from(Ln 206229, Col 537)
tOA
// @from(Ln 206229, Col 542)
eOA
// @from(Ln 206229, Col 547)
lY9
// @from(Ln 206229, Col 552)
yKw
// @from(Ln 206229, Col 557)
CKw
// @from(Ln 206229, Col 562)
SKw
// @from(Ln 206229, Col 567)
hKw
// @from(Ln 206229, Col 572)
IKw
// @from(Ln 206229, Col 577)
xKw
// @from(Ln 206229, Col 582)
Eq
// @from(Ln 206229, Col 586)
qy7
// @from(Ln 206230, Col 4)
gD = v(() => {
    i7();
    dw6 = [ao, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"], GB = om6((A) => A !== null && (typeof A === "object" || typeof A === "function")), FR7 = l2([p6(), Yz().int()]), QR7 = p6(), C99 = rj({
        ttl: l2([Yz(), Ev1()]).optional(),
        pollInterval: Yz().optional()
    }), bOA = rj({
        taskId: p6()
    }), S99 = rj({
        progressToken: FR7.optional(),
        [ZB]: bOA.optional()
    }), QV = rj({
        task: C99.optional(),
        _meta: S99.optional()
    }), hM = H7({
        method: p6(),
        params: QV.optional()
    }), Zq1 = rj({
        _meta: H7({
            [ZB]: Wq(bOA)
        }).passthrough().optional()
    }), aL = H7({
        method: p6(),
        params: Zq1.optional()
    }), yW = rj({
        _meta: rj({
            [ZB]: bOA.optional()
        }).optional()
    }), lw6 = l2([p6(), Yz().int()]), gR7 = H7({
        jsonrpc: Hq(cw6),
        id: lw6,
        ...hM.shape
    }).strict(), UR7 = H7({
        jsonrpc: Hq(cw6),
        ...aL.shape
    }).strict(), dR7 = H7({
        jsonrpc: Hq(cw6),
        id: lw6,
        result: yW
    }).strict();
    (function(A) {
        A[A.ConnectionClosed = -32000] = "ConnectionClosed", A[A.RequestTimeout = -32001] = "RequestTimeout", A[A.ParseError = -32700] = "ParseError", A[A.InvalidRequest = -32600] = "InvalidRequest", A[A.MethodNotFound = -32601] = "MethodNotFound", A[A.InvalidParams = -32602] = "InvalidParams", A[A.InternalError = -32603] = "InternalError", A[A.UrlElicitationRequired = -32042] = "UrlElicitationRequired"
    })(VK || (VK = {}));
    cR7 = H7({
        jsonrpc: Hq(cw6),
        id: lw6,
        error: H7({
            code: Yz().int(),
            message: p6(),
            data: Wq(KJ())
        })
    }).strict(), Ah = l2([gR7, UR7, dR7, cR7]), Hp = yW.strict(), h99 = Zq1.extend({
        requestId: lw6,
        reason: p6().optional()
    }), iw6 = aL.extend({
        method: Hq("notifications/cancelled"),
        params: h99
    }), I99 = H7({
        src: p6(),
        mimeType: p6().optional(),
        sizes: B7(p6()).optional()
    }), ox1 = H7({
        icons: B7(I99).optional()
    }), D01 = H7({
        name: p6(),
        title: p6().optional()
    }), iR7 = D01.extend({
        ...D01.shape,
        ...ox1.shape,
        version: p6(),
        websiteUrl: p6().optional()
    }), x99 = kv1(H7({
        applyDefaults: c2().optional()
    }), P_(p6(), KJ())), b99 = Es1((A) => {
        if (A && typeof A === "object" && !Array.isArray(A)) {
            if (Object.keys(A).length === 0) return {
                form: {}
            }
        }
        return A
    }, kv1(H7({
        form: x99.optional(),
        url: GB.optional()
    }), P_(p6(), KJ()).optional())), u99 = H7({
        list: Wq(H7({}).passthrough()),
        cancel: Wq(H7({}).passthrough()),
        requests: Wq(H7({
            sampling: Wq(H7({
                createMessage: Wq(H7({}).passthrough())
            }).passthrough()),
            elicitation: Wq(H7({
                create: Wq(H7({}).passthrough())
            }).passthrough())
        }).passthrough())
    }).passthrough(), B99 = H7({
        list: Wq(H7({}).passthrough()),
        cancel: Wq(H7({}).passthrough()),
        requests: Wq(H7({
            tools: Wq(H7({
                call: Wq(H7({}).passthrough())
            }).passthrough())
        }).passthrough())
    }).passthrough(), m99 = H7({
        experimental: P_(p6(), GB).optional(),
        sampling: H7({
            context: GB.optional(),
            tools: GB.optional()
        }).optional(),
        elicitation: b99.optional(),
        roots: H7({
            listChanged: c2().optional()
        }).optional(),
        tasks: Wq(u99)
    }), F99 = QV.extend({
        protocolVersion: p6(),
        capabilities: m99,
        clientInfo: iR7
    }), uOA = hM.extend({
        method: Hq("initialize"),
        params: F99
    }), Q99 = H7({
        experimental: P_(p6(), GB).optional(),
        logging: GB.optional(),
        completions: GB.optional(),
        prompts: Wq(H7({
            listChanged: Wq(c2())
        })),
        resources: H7({
            subscribe: c2().optional(),
            listChanged: c2().optional()
        }).optional(),
        tools: H7({
            listChanged: c2().optional()
        }).optional(),
        tasks: Wq(B99)
    }).passthrough(), BOA = yW.extend({
        protocolVersion: p6(),
        capabilities: Q99,
        serverInfo: iR7,
        instructions: p6().optional()
    }), nw6 = aL.extend({
        method: Hq("notifications/initialized")
    }), rw6 = hM.extend({
        method: Hq("ping")
    }), g99 = H7({
        progress: Yz(),
        total: Wq(Yz()),
        message: Wq(p6())
    }), U99 = H7({
        ...Zq1.shape,
        ...g99.shape,
        progressToken: FR7
    }), ow6 = aL.extend({
        method: Hq("notifications/progress"),
        params: U99
    }), p99 = QV.extend({
        cursor: QR7.optional()
    }), ax1 = hM.extend({
        params: p99.optional()
    }), sx1 = yW.extend({
        nextCursor: Wq(QR7)
    }), tx1 = H7({
        taskId: p6(),
        status: V0(["working", "input_required", "completed", "failed", "cancelled"]),
        ttl: l2([Yz(), Ev1()]),
        createdAt: p6(),
        lastUpdatedAt: p6(),
        pollInterval: Wq(Yz()),
        statusMessage: Wq(p6())
    }), $p = yW.extend({
        task: tx1
    }), d99 = Zq1.merge(tx1), ex1 = aL.extend({
        method: Hq("notifications/tasks/status"),
        params: d99
    }), aw6 = hM.extend({
        method: Hq("tasks/get"),
        params: QV.extend({
            taskId: p6()
        })
    }), sw6 = yW.merge(tx1), tw6 = hM.extend({
        method: Hq("tasks/result"),
        params: QV.extend({
            taskId: p6()
        })
    }), ew6 = ax1.extend({
        method: Hq("tasks/list")
    }), AH6 = sx1.extend({
        tasks: B7(tx1)
    }), rR7 = hM.extend({
        method: Hq("tasks/cancel"),
        params: QV.extend({
            taskId: p6()
        })
    }), oR7 = yW.merge(tx1), aR7 = H7({
        uri: p6(),
        mimeType: Wq(p6()),
        _meta: P_(p6(), KJ()).optional()
    }), sR7 = aR7.extend({
        text: p6()
    }), mOA = p6().refine((A) => {
        try {
            return atob(A), !0
        } catch (q) {
            return !1
        }
    }, {
        message: "Invalid Base64 string"
    }), tR7 = aR7.extend({
        blob: mOA
    }), j01 = H7({
        audience: B7(V0(["user", "assistant"])).optional(),
        priority: Yz().min(0).max(1).optional(),
        lastModified: rw1.datetime({
            offset: !0
        }).optional()
    }), eR7 = H7({
        ...D01.shape,
        ...ox1.shape,
        uri: p6(),
        description: Wq(p6()),
        mimeType: Wq(p6()),
        annotations: j01.optional(),
        _meta: Wq(rj({}))
    }), c99 = H7({
        ...D01.shape,
        ...ox1.shape,
        uriTemplate: p6(),
        description: Wq(p6()),
        mimeType: Wq(p6()),
        annotations: j01.optional(),
        _meta: Wq(rj({}))
    }), l99 = ax1.extend({
        method: Hq("resources/list")
    }), Vq1 = sx1.extend({
        resources: B7(eR7)
    }), i99 = ax1.extend({
        method: Hq("resources/templates/list")
    }), FOA = sx1.extend({
        resourceTemplates: B7(c99)
    }), QOA = QV.extend({
        uri: p6()
    }), n99 = QOA, r99 = hM.extend({
        method: Hq("resources/read"),
        params: n99
    }), Nq1 = yW.extend({
        contents: B7(l2([sR7, tR7]))
    }), gOA = aL.extend({
        method: Hq("notifications/resources/list_changed")
    }), o99 = QOA, a99 = hM.extend({
        method: Hq("resources/subscribe"),
        params: o99
    }), s99 = QOA, t99 = hM.extend({
        method: Hq("resources/unsubscribe"),
        params: s99
    }), e99 = Zq1.extend({
        uri: p6()
    }), AY9 = aL.extend({
        method: Hq("notifications/resources/updated"),
        params: e99
    }), qY9 = H7({
        name: p6(),
        description: Wq(p6()),
        required: Wq(c2())
    }), KY9 = H7({
        ...D01.shape,
        ...ox1.shape,
        description: Wq(p6()),
        arguments: Wq(B7(qY9)),
        _meta: Wq(rj({}))
    }), YY9 = ax1.extend({
        method: Hq("prompts/list")
    }), Ab1 = sx1.extend({
        prompts: B7(KY9)
    }), zY9 = QV.extend({
        name: p6(),
        arguments: P_(p6(), p6()).optional()
    }), wY9 = hM.extend({
        method: Hq("prompts/get"),
        params: zY9
    }), UOA = H7({
        type: Hq("text"),
        text: p6(),
        annotations: j01.optional(),
        _meta: P_(p6(), KJ()).optional()
    }), pOA = H7({
        type: Hq("image"),
        data: mOA,
        mimeType: p6(),
        annotations: j01.optional(),
        _meta: P_(p6(), KJ()).optional()
    }), dOA = H7({
        type: Hq("audio"),
        data: mOA,
        mimeType: p6(),
        annotations: j01.optional(),
        _meta: P_(p6(), KJ()).optional()
    }), HY9 = H7({
        type: Hq("tool_use"),
        name: p6(),
        id: p6(),
        input: H7({}).passthrough(),
        _meta: Wq(H7({}).passthrough())
    }).passthrough(), $Y9 = H7({
        type: Hq("resource"),
        resource: l2([sR7, tR7]),
        annotations: j01.optional(),
        _meta: P_(p6(), KJ()).optional()
    }), OY9 = eR7.extend({
        type: Hq("resource_link")
    }), cOA = l2([UOA, pOA, dOA, OY9, $Y9]), _Y9 = H7({
        role: V0(["user", "assistant"]),
        content: cOA
    }), lOA = yW.extend({
        description: Wq(p6()),
        messages: B7(_Y9)
    }), iOA = aL.extend({
        method: Hq("notifications/prompts/list_changed")
    }), JY9 = H7({
        title: p6().optional(),
        readOnlyHint: c2().optional(),
        destructiveHint: c2().optional(),
        idempotentHint: c2().optional(),
        openWorldHint: c2().optional()
    }), XY9 = H7({
        taskSupport: V0(["required", "optional", "forbidden"]).optional()
    }), Ay7 = H7({
        ...D01.shape,
        ...ox1.shape,
        description: p6().optional(),
        inputSchema: H7({
            type: Hq("object"),
            properties: P_(p6(), GB).optional(),
            required: B7(p6()).optional()
        }).catchall(KJ()),
        outputSchema: H7({
            type: Hq("object"),
            properties: P_(p6(), GB).optional(),
            required: B7(p6()).optional()
        }).catchall(KJ()).optional(),
        annotations: Wq(JY9),
        execution: Wq(XY9),
        _meta: P_(p6(), KJ()).optional()
    }), qb1 = ax1.extend({
        method: Hq("tools/list")
    }), Kb1 = sx1.extend({
        tools: B7(Ay7)
    }), ZZ = yW.extend({
        content: B7(cOA).default([]),
        structuredContent: P_(p6(), KJ()).optional(),
        isError: Wq(c2())
    }), RKw = ZZ.or(yW.extend({
        toolResult: KJ()
    })), DY9 = QV.extend({
        name: p6(),
        arguments: Wq(P_(p6(), KJ()))
    }), Tq1 = hM.extend({
        method: Hq("tools/call"),
        params: DY9
    }), nOA = aL.extend({
        method: Hq("notifications/tools/list_changed")
    }), Yb1 = V0(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), jY9 = QV.extend({
        level: Yb1
    }), rOA = hM.extend({
        method: Hq("logging/setLevel"),
        params: jY9
    }), MY9 = Zq1.extend({
        level: Yb1,
        logger: p6().optional(),
        data: KJ()
    }), PY9 = aL.extend({
        method: Hq("notifications/message"),
        params: MY9
    }), WY9 = H7({
        name: p6().optional()
    }), GY9 = H7({
        hints: Wq(B7(WY9)),
        costPriority: Wq(Yz().min(0).max(1)),
        speedPriority: Wq(Yz().min(0).max(1)),
        intelligencePriority: Wq(Yz().min(0).max(1))
    }), ZY9 = H7({
        mode: Wq(V0(["auto", "required", "none"]))
    }), fY9 = H7({
        type: Hq("tool_result"),
        toolUseId: p6().describe("The unique identifier for the corresponding tool call."),
        content: B7(cOA).default([]),
        structuredContent: H7({}).passthrough().optional(),
        isError: Wq(c2()),
        _meta: Wq(H7({}).passthrough())
    }).passthrough(), VY9 = Ts1("type", [UOA, pOA, dOA]), pw6 = Ts1("type", [UOA, pOA, dOA, HY9, fY9]), NY9 = H7({
        role: V0(["user", "assistant"]),
        content: l2([pw6, B7(pw6)]),
        _meta: Wq(H7({}).passthrough())
    }).passthrough(), TY9 = QV.extend({
        messages: B7(NY9),
        modelPreferences: GY9.optional(),
        systemPrompt: p6().optional(),
        includeContext: V0(["none", "thisServer", "allServers"]).optional(),
        temperature: Yz().optional(),
        maxTokens: Yz().int(),
        stopSequences: B7(p6()).optional(),
        metadata: GB.optional(),
        tools: Wq(B7(Ay7)),
        toolChoice: Wq(ZY9)
    }), oOA = hM.extend({
        method: Hq("sampling/createMessage"),
        params: TY9
    }), zb1 = yW.extend({
        model: p6(),
        stopReason: Wq(V0(["endTurn", "stopSequence", "maxTokens"]).or(p6())),
        role: V0(["user", "assistant"]),
        content: VY9
    }), aOA = yW.extend({
        model: p6(),
        stopReason: Wq(V0(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(p6())),
        role: V0(["user", "assistant"]),
        content: l2([pw6, B7(pw6)])
    }), vY9 = H7({
        type: Hq("boolean"),
        title: p6().optional(),
        description: p6().optional(),
        default: c2().optional()
    }), EY9 = H7({
        type: Hq("string"),
        title: p6().optional(),
        description: p6().optional(),
        minLength: Yz().optional(),
        maxLength: Yz().optional(),
        format: V0(["email", "uri", "date", "date-time"]).optional(),
        default: p6().optional()
    }), kY9 = H7({
        type: V0(["number", "integer"]),
        title: p6().optional(),
        description: p6().optional(),
        minimum: Yz().optional(),
        maximum: Yz().optional(),
        default: Yz().optional()
    }), LY9 = H7({
        type: Hq("string"),
        title: p6().optional(),
        description: p6().optional(),
        enum: B7(p6()),
        default: p6().optional()
    }), RY9 = H7({
        type: Hq("string"),
        title: p6().optional(),
        description: p6().optional(),
        oneOf: B7(H7({
            const: p6(),
            title: p6()
        })),
        default: p6().optional()
    }), yY9 = H7({
        type: Hq("string"),
        title: p6().optional(),
        description: p6().optional(),
        enum: B7(p6()),
        enumNames: B7(p6()).optional(),
        default: p6().optional()
    }), CY9 = l2([LY9, RY9]), SY9 = H7({
        type: Hq("array"),
        title: p6().optional(),
        description: p6().optional(),
        minItems: Yz().optional(),
        maxItems: Yz().optional(),
        items: H7({
            type: Hq("string"),
            enum: B7(p6())
        }),
        default: B7(p6()).optional()
    }), hY9 = H7({
        type: Hq("array"),
        title: p6().optional(),
        description: p6().optional(),
        minItems: Yz().optional(),
        maxItems: Yz().optional(),
        items: H7({
            anyOf: B7(H7({
                const: p6(),
                title: p6()
            }))
        }),
        default: B7(p6()).optional()
    }), IY9 = l2([SY9, hY9]), xY9 = l2([yY9, CY9, IY9]), bY9 = l2([xY9, vY9, EY9, kY9]), uY9 = QV.extend({
        mode: Hq("form").optional(),
        message: p6(),
        requestedSchema: H7({
            type: Hq("object"),
            properties: P_(p6(), bY9),
            required: B7(p6()).optional()
        })
    }), BY9 = QV.extend({
        mode: Hq("url"),
        message: p6(),
        elicitationId: p6(),
        url: p6().url()
    }), mY9 = l2([uY9, BY9]), vq1 = hM.extend({
        method: Hq("elicitation/create"),
        params: mY9
    }), FY9 = Zq1.extend({
        elicitationId: p6()
    }), QY9 = aL.extend({
        method: Hq("notifications/elicitation/complete"),
        params: FY9
    }), M01 = yW.extend({
        action: V0(["accept", "decline", "cancel"]),
        content: Es1((A) => A === null ? void 0 : A, P_(p6(), l2([p6(), Yz(), c2(), B7(p6())])).optional())
    }), gY9 = H7({
        type: Hq("ref/resource"),
        uri: p6()
    }), UY9 = H7({
        type: Hq("ref/prompt"),
        name: p6()
    }), pY9 = QV.extend({
        ref: l2([UY9, gY9]),
        argument: H7({
            name: p6(),
            value: p6()
        }),
        context: H7({
            arguments: P_(p6(), p6()).optional()
        }).optional()
    }), dY9 = hM.extend({
        method: Hq("completion/complete"),
        params: pY9
    }), sOA = yW.extend({
        completion: rj({
            values: B7(p6()).max(100),
            total: Wq(Yz().int()),
            hasMore: Wq(c2())
        })
    }), cY9 = H7({
        uri: p6().startsWith("file://"),
        name: p6().optional(),
        _meta: P_(p6(), KJ()).optional()
    }), tOA = hM.extend({
        method: Hq("roots/list")
    }), eOA = yW.extend({
        roots: B7(cY9)
    }), lY9 = aL.extend({
        method: Hq("notifications/roots/list_changed")
    }), yKw = l2([rw6, uOA, dY9, rOA, wY9, YY9, l99, i99, r99, a99, t99, Tq1, qb1, aw6, tw6, ew6]), CKw = l2([iw6, ow6, nw6, lY9, ex1]), SKw = l2([Hp, zb1, aOA, M01, eOA, sw6, AH6, $p]), hKw = l2([rw6, oOA, vq1, tOA, aw6, tw6, ew6]), IKw = l2([iw6, ow6, PY9, AY9, gOA, nOA, iOA, ex1, QY9]), xKw = l2([Hp, BOA, sOA, lOA, Ab1, Vq1, FOA, Nq1, ZZ, Kb1, sw6, AH6, $p]);
    Eq = class Eq extends Error {
        constructor(A, q, K) {
            super(`MCP error ${A}: ${q}`);
            this.code = A, this.data = K, this.name = "McpError"
        }
        static fromError(A, q, K) {
            if (A === VK.UrlElicitationRequired && K) {
                let Y = K;
                if (Y.elicitations) return new qy7(Y.elicitations, q)
            }
            return new Eq(A, q, K)
        }
    };
    qy7 = class qy7 extends Eq {
        constructor(A, q = `URL elicitation${A.length>1?"s":""} required`) {
            super(VK.UrlElicitationRequired, q, {
                elicitations: A
            })
        }
        get elicitations() {
            var A, q;
            return (q = (A = this.data) === null || A === void 0 ? void 0 : A.elicitations) !== null && q !== void 0 ? q : []
        }
    }
})
// @from(Ln 206796, Col 0)
function so(A) {
    return A === "completed" || A === "failed" || A === "cancelled"
}
// @from(Ln 206799, Col 4)
iY9
// @from(Ln 206800, Col 4)
qH6 = v(() => {
    iY9 = Symbol("Let zodToJsonSchema decide on which parser to use")
})
// @from(Ln 206803, Col 4)
A_A = v(() => {
    qH6()
})
// @from(Ln 206806, Col 4)
sL = () => {}
// @from(Ln 206807, Col 4)
q_A = v(() => {
    IX()
})
// @from(Ln 206810, Col 4)
K_A = () => {}
// @from(Ln 206811, Col 4)
KH6 = v(() => {
    IX()
})
// @from(Ln 206814, Col 4)
Y_A = v(() => {
    IX()
})
// @from(Ln 206817, Col 4)
z_A = () => {}
// @from(Ln 206818, Col 4)
w_A = v(() => {
    IX()
})
// @from(Ln 206821, Col 4)
H_A = v(() => {
    IX();
    sL()
})
// @from(Ln 206825, Col 4)
$_A = v(() => {
    IX()
})
// @from(Ln 206828, Col 4)
D3w
// @from(Ln 206829, Col 4)
YH6 = v(() => {
    D3w = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789")
})
// @from(Ln 206832, Col 4)
zH6 = v(() => {
    IX();
    YH6();
    KH6();
    sL()
})
// @from(Ln 206838, Col 4)
O_A = v(() => {
    IX();
    zH6();
    sL()
})
// @from(Ln 206843, Col 4)
__A = v(() => {
    sL()
})
// @from(Ln 206846, Col 4)
wH6 = v(() => {
    IX()
})
// @from(Ln 206849, Col 4)
J_A = v(() => {
    IX();
    wH6()
})
// @from(Ln 206853, Col 4)
X_A = () => {}
// @from(Ln 206854, Col 4)
D_A = v(() => {
    IX()
})
// @from(Ln 206857, Col 4)
j_A = v(() => {
    IX();
    sL()
})
// @from(Ln 206861, Col 4)
M_A = v(() => {
    IX()
})
// @from(Ln 206864, Col 4)
P_A = v(() => {
    IX()
})
// @from(Ln 206867, Col 4)
W_A = v(() => {
    IX()
})
// @from(Ln 206870, Col 4)
G_A = v(() => {
    IX()
})
// @from(Ln 206873, Col 4)
Z_A = v(() => {
    sL()
})
// @from(Ln 206876, Col 4)
f_A = v(() => {
    sL()
})
// @from(Ln 206879, Col 4)
V_A = v(() => {
    IX()
})
// @from(Ln 206882, Col 4)
N_A = v(() => {
    sL();
    q_A();
    K_A();
    KH6();
    Y_A();
    z_A();
    w_A();
    H_A();
    $_A();
    O_A();
    __A();
    J_A();
    X_A();
    D_A();
    j_A();
    M_A();
    P_A();
    zH6();
    W_A();
    YH6();
    G_A();
    Z_A();
    wH6();
    f_A();
    V_A()
})
// @from(Ln 206909, Col 4)
IX = v(() => {
    qH6();
    N_A();
    sL()
})
// @from(Ln 206914, Col 4)
Ky7 = () => {}
// @from(Ln 206915, Col 4)
T_A = v(() => {
    IX();
    A_A();
    sL()
})
// @from(Ln 206920, Col 4)
Yy7 = v(() => {
    T_A();
    qH6();
    A_A();
    IX();
    Ky7();
    sL();
    q_A();
    K_A();
    KH6();
    Y_A();
    z_A();
    w_A();
    H_A();
    $_A();
    O_A();
    __A();
    J_A();
    X_A();
    D_A();
    j_A();
    M_A();
    P_A();
    V_A();
    zH6();
    W_A();
    YH6();
    G_A();
    Z_A();
    wH6();
    f_A();
    N_A();
    T_A()
})
// @from(Ln 206955, Col 0)
function v_A(A) {
    let q = X01(A),
        K = q === null || q === void 0 ? void 0 : q.method;
    if (!K) throw Error("Schema is missing a method literal");
    let Y = mR7(K);
    if (typeof Y !== "string") throw Error("Schema method literal must be a string");
    return Y
}
// @from(Ln 206964, Col 0)
function E_A(A, q) {
    let K = GZ(A, q);
    if (!K.success) throw K.error;
    return K.data
}
// @from(Ln 206969, Col 4)
zy7 = v(() => {
    nx1();
    Yy7()
})