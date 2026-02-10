
// @from(Ln 445062, Col 0)
function czz(A, q) {
    let K = A.message.content;
    if (!Array.isArray(K)) return A;
    if (!K.some((z) => z.type === "tool_result" && Array.isArray(z.content) && z.content.some((w) => {
            if (!Kp(w)) return !1;
            let H = w.tool_name;
            return H && !q.has(H)
        }))) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: K.map((z) => {
                if (z.type !== "tool_result" || !Array.isArray(z.content)) return z;
                let w = z.content.filter((H) => {
                    if (!Kp(H)) return !0;
                    let $ = H.tool_name;
                    if (!$) return !0;
                    let O = q.has($);
                    if (!O) h(`Filtering out tool_reference for unavailable tool: ${$}`, {
                        level: "warn"
                    });
                    return O
                });
                if (w.length === 0) return {
                    ...z,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tools no longer available]"
                    }]
                };
                return {
                    ...z,
                    content: w
                }
            })
        }
    }
}
// @from(Ln 445102, Col 0)
function sBA(A) {
    let q = A.message.content;
    if (!Array.isArray(q)) return A;
    if (!q.some((Y) => Y.type === "tool_result" && Array.isArray(Y.content) && Y.content.some(Kp))) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: q.map((Y) => {
                if (Y.type !== "tool_result" || !Array.isArray(Y.content)) return Y;
                let z = Y.content.filter((w) => !Kp(w));
                if (z.length === 0) return {
                    ...Y,
                    content: [{
                        type: "text",
                        text: "[Tool references removed - tool search not enabled]"
                    }]
                };
                return {
                    ...Y,
                    content: z
                }
            })
        }
    }
}
// @from(Ln 445129, Col 0)
function iOq(A) {
    if (!A.message.content.some((K) => K.type === "tool_use" && ("caller" in K) && K.caller !== null)) return A;
    return {
        ...A,
        message: {
            ...A.message,
            content: A.message.content.map((K) => {
                if (K.type !== "tool_use") return K;
                return {
                    type: "tool_use",
                    id: K.id,
                    name: K.name,
                    input: K.input
                }
            })
        }
    }
}
// @from(Ln 445148, Col 0)
function WJ(A, q = []) {
    let K = new Set(q.map((J) => J.name)),
        Y = dzz(A),
        z = {
            [eHA()]: new Set(["document"]),
            [A$A()]: new Set(["document"]),
            [D26()]: new Set(["image"]),
            [q$A()]: new Set(["document", "image"])
        },
        w = new Map;
    for (let J = 0; J < Y.length; J++) {
        let X = Y[J];
        if (!pmA(X)) continue;
        let D = Array.isArray(X.message.content) && X.message.content[0]?.type === "text" ? X.message.content[0].text : void 0;
        if (!D) continue;
        let j = z[D];
        if (!j) continue;
        for (let M = J - 1; M >= 0; M--) {
            let P = Y[M];
            if (P.type === "user" && P.isMeta) {
                let W = w.get(P.uuid);
                if (W)
                    for (let G of j) W.add(G);
                else w.set(P.uuid, new Set(j));
                break
            }
            if (pmA(P)) continue;
            break
        }
    }
    let H = [];
    Y.filter((J) => {
        if (J.type === "progress" || J.type === "system" || pmA(J)) return !1;
        return !0
    }).forEach((J) => {
        switch (J.type) {
            case "user": {
                let X = J;
                if (!Fp()) X = sBA(J);
                else X = czz(J, K);
                let D = w.get(X.uuid);
                if (D && X.isMeta) {
                    let M = X.message.content;
                    if (Array.isArray(M)) {
                        let P = M.filter((W) => !D.has(W.type));
                        if (P.length === 0) return;
                        if (P.length < M.length) X = {
                            ...X,
                            message: {
                                ...X.message,
                                content: P
                            }
                        }
                    }
                }
                let j = gP(H);
                if (j?.type === "user") {
                    H[H.indexOf(j)] = MJq(j, X);
                    return
                }
                H.push(X);
                return
            }
            case "assistant": {
                let X = Fp(),
                    D = {
                        ...J,
                        message: {
                            ...J.message,
                            content: J.message.content.map((j) => {
                                if (j.type === "tool_use") {
                                    let M = q.find((W) => W.name === j.name),
                                        P = M ? y1q(M, j.input) : j.input;
                                    if (X) return {
                                        ...j,
                                        input: P
                                    };
                                    return {
                                        type: "tool_use",
                                        id: j.id,
                                        name: j.name,
                                        input: P
                                    }
                                }
                                return j
                            })
                        }
                    };
                for (let j = H.length - 1; j >= 0; j--) {
                    let M = H[j];
                    if (M.type !== "assistant" && !nzz(M)) break;
                    if (M.type === "assistant") {
                        if (M.message.id === D.message.id) {
                            H[j] = izz(M, D);
                            return
                        }
                        break
                    }
                }
                H.push(D);
                return
            }
            case "attachment": {
                let X = K2z(J.attachment),
                    D = gP(H);
                if (D?.type === "user") {
                    H[H.indexOf(D)] = X.reduce((j, M) => lzz(j, M), D);
                    return
                }
                H.push(...X);
                return
            }
        }
    }), eT7(H);
    let $ = mQ1(H),
        O = z2z($),
        _ = BQ1(O);
    return H2z(_)
}
// @from(Ln 445268, Col 0)
function lzz(A, q) {
    let K = vT6(A.message.content),
        Y = vT6(q.message.content);
    return {
        ...A,
        message: {
            ...A.message,
            content: PJq(rzz(K, Y))
        }
    }
}
// @from(Ln 445280, Col 0)
function izz(A, q) {
    return {
        ...A,
        message: {
            ...A.message,
            content: [...A.message.content, ...q.message.content]
        }
    }
}
// @from(Ln 445290, Col 0)
function nzz(A) {
    if (A.type !== "user") return !1;
    let q = A.message.content;
    if (typeof q === "string") return !1;
    return q.some((K) => K.type === "tool_result")
}
// @from(Ln 445297, Col 0)
function MJq(A, q) {
    let K = vT6(A.message.content),
        Y = vT6(q.message.content);
    return {
        ...A,
        message: {
            ...A.message,
            content: PJq([...K, ...Y])
        }
    }
}
// @from(Ln 445309, Col 0)
function PJq(A) {
    let q = [],
        K = [];
    for (let Y of A)
        if (Y.type === "tool_result") q.push(Y);
        else K.push(Y);
    return [...q, ...K]
}
// @from(Ln 445318, Col 0)
function vT6(A) {
    if (typeof A === "string") return [{
        type: "text",
        text: A
    }];
    return A
}
// @from(Ln 445326, Col 0)
function rzz(A, q) {
    let K = gP(A);
    if (K?.type === "tool_result" && typeof K.content === "string" && q.every((Y) => Y.type === "text")) return [...A.slice(0, -1), {
        ...K,
        content: [K.content, ...q.map((Y) => Y.text)].map((Y) => Y.trim()).filter(Boolean).join(`

`)
    }];
    return [...A, ...q]
}
// @from(Ln 445337, Col 0)
function JT6(A, q, K) {
    if (!A) return [];
    return A.map((Y) => {
        switch (Y.type) {
            case "tool_use": {
                if (typeof Y.input !== "string" && !WO(Y.input)) throw Error("Tool use input must be a string or object");
                let z = typeof Y.input === "string" ? j9(Y.input) ?? {} : Y.input;
                if (typeof z === "object" && z !== null) {
                    let w = q.find((H) => H.name === Y.name);
                    if (w) try {
                        z = R1q(w, z, K)
                    } catch (H) {
                        K1(Error("Error normalizing tool input: " + H))
                    }
                }
                return {
                    ...Y,
                    input: z
                }
            }
            case "text":
                if (Y.text.trim().length === 0) c("tengu_model_whitespace_response", {
                    length: Y.text.length
                });
                return Y;
            case "code_execution_tool_result":
            case "mcp_tool_use":
            case "mcp_tool_result":
            case "container_upload":
            case "server_tool_use":
                return Y;
            default:
                return Y
        }
    })
}
// @from(Ln 445374, Col 0)
function DM6(A) {
    return qX6(A).trim() === "" || A.trim() === iv
}
// @from(Ln 445378, Col 0)
function qX6(A) {
    let q = new RegExp(`<(${ozz.join("|")})>.*?</\\1>
?`, "gs");
    return A.replace(q, "").trim()
}
// @from(Ln 445384, Col 0)
function Re(A) {
    switch (A.type) {
        case "attachment":
            if (dd1(A)) return A.attachment.toolUseID;
            return null;
        case "assistant":
            if (A.message.content[0]?.type !== "tool_use") return null;
            return A.message.content[0].id;
        case "user":
            if (A.sourceToolUseID) return A.sourceToolUseID;
            if (A.message.content[0]?.type !== "tool_result") return null;
            return A.message.content[0].tool_use_id;
        case "progress":
            return A.toolUseID;
        case "system":
            return A.subtype === "informational" ? A.toolUseID ?? null : null
    }
}
// @from(Ln 445403, Col 0)
function wP6(A) {
    let q = new Set,
        K = new Set;
    for (let z of A) {
        if (z.type !== "user" && z.type !== "assistant") continue;
        let w = z.message.content;
        if (!Array.isArray(w)) continue;
        for (let H of w) {
            if (H.type === "tool_use") q.add(H.id);
            if (H.type === "tool_result") K.add(H.tool_use_id)
        }
    }
    let Y = new Set([...q].filter((z) => !K.has(z)));
    if (Y.size === 0) return A;
    return A.filter((z) => {
        if (z.type !== "assistant") return !0;
        let w = z.message.content;
        if (!Array.isArray(w)) return !0;
        let H = [];
        for (let $ of w)
            if ($.type === "tool_use") H.push($.id);
        if (H.length === 0) return !0;
        return !H.every(($) => Y.has($))
    })
}
// @from(Ln 445429, Col 0)
function B51(A) {
    if (A.type !== "assistant") return null;
    if (Array.isArray(A.message.content)) return A.message.content.filter((q) => q.type === "text").map((q) => q.type === "text" ? q.text : "").join(`
`).trim() || null;
    return null
}
// @from(Ln 445436, Col 0)
function ZQ1(A) {
    if (A.type !== "user") return null;
    let q = A.message.content;
    return J51(q)
}
// @from(Ln 445442, Col 0)
function J51(A) {
    if (typeof A === "string") return A;
    if (Array.isArray(A)) return A.filter((q) => q.type === "text").map((q) => q.type === "text" ? q.text : "").join(`
`).trim() || null;
    return null
}
// @from(Ln 445449, Col 0)
function iW1(A, q, K, Y, z, w, H) {
    if (A.type !== "stream_event" && A.type !== "stream_request_start") {
        if (A.type === "tombstone") {
            w?.(A.message);
            return
        }
        if (A.type === "tool_use_summary") return;
        if (A.type === "assistant") {
            let $ = A.message.content.find((O) => O.type === "thinking");
            if ($ && $.type === "thinking") H?.(() => ({
                thinking: $.thinking,
                isStreaming: !1,
                streamingEndedAt: Date.now()
            }))
        }
        q(A);
        return
    }
    if (A.type === "stream_request_start") {
        Y("requesting");
        return
    }
    if (A.event.type === "message_stop") {
        Y("tool-use"), z(() => []);
        return
    }
    switch (A.event.type) {
        case "content_block_start":
            switch (A.event.content_block.type) {
                case "thinking":
                case "redacted_thinking":
                    Y("thinking");
                    return;
                case "text":
                    Y("responding");
                    return;
                case "tool_use": {
                    Y("tool-input");
                    let $ = A.event.content_block,
                        O = A.event.index;
                    z((_) => [..._, {
                        index: O,
                        contentBlock: $,
                        unparsedToolInput: ""
                    }]);
                    return
                }
                case "server_tool_use":
                case "web_search_tool_result":
                case "code_execution_tool_result":
                case "mcp_tool_use":
                case "mcp_tool_result":
                case "container_upload":
                case "web_fetch_tool_result":
                case "bash_code_execution_tool_result":
                case "text_editor_code_execution_tool_result":
                case "tool_search_tool_result":
                case "compaction":
                    Y("tool-input");
                    return
            }
            break;
        case "content_block_delta":
            switch (A.event.delta.type) {
                case "text_delta":
                    K(A.event.delta.text);
                    return;
                case "input_json_delta": {
                    let $ = A.event.delta.partial_json,
                        O = A.event.index;
                    K($), z((_) => {
                        let J = _.find((X) => X.index === O);
                        if (!J) return _;
                        return [..._.filter((X) => X !== J), {
                            ...J,
                            unparsedToolInput: J.unparsedToolInput + $
                        }]
                    });
                    return
                }
                case "thinking_delta":
                    K(A.event.delta.thinking);
                    return;
                case "signature_delta":
                    K(A.event.delta.signature);
                    return;
                default:
                    return
            }
        case "content_block_stop":
            return;
        case "message_delta":
            Y("responding");
            return;
        default:
            Y("responding");
            return
    }
}
// @from(Ln 445549, Col 0)
function tI(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}
// @from(Ln 445555, Col 0)
function _9(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q,
            message: {
                ...q.message,
                content: tI(q.message.content)
            }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return {
                    ...Y,
                    text: tI(Y.text)
                };
                return Y
            });
            return {
                ...q,
                message: {
                    ...q.message,
                    content: K
                }
            }
        }
        return q
    })
}
// @from(Ln 445584, Col 0)
function azz(A) {
    if (A.isSubAgent) return q2z(A);
    if (A.reminderType === "sparse") return A2z(A);
    return szz(A)
}
// @from(Ln 445590, Col 0)
function szz(A) {
    if (A.isSubAgent) return [];
    if (sO()) return ezz(A);
    let q = Xc4(),
        K = Dc4(),
        z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${sW.name} tool.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${vj.name} tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request by reading through code and asking them questions. Critical: In this phase you should only use the ${bv.agentType} subagent type.

1. Focus on understanding the user's request and the code associated with their request. Actively search for existing functions, utilities, and patterns that can be reused — avoid proposing new code when suitable implementations already exist.

2. **Launch up to ${K} ${bv.agentType} agents IN PARALLEL** (single message, multiple tool calls) to efficiently explore the codebase.
   - Use 1 agent when the task is isolated to known files, the user provided specific file paths, or you're making a small targeted change.
   - Use multiple agents when: the scope is uncertain, multiple areas of the codebase are involved, or you need to understand existing patterns before planning.
   - Quality over quantity - ${K} agents maximum, but you should try to use the minimum number of agents necessary (usually just 1)
   - If using multiple agents: Provide each agent with a specific search focus or area to explore. Example: One agent searches for existing implementations, another explores related components, a third investigating testing patterns

### Phase 2: Design
Goal: Design an implementation approach.

Launch ${PJ6.agentType} agent(s) to design the implementation based on the user's intent and your exploration results from Phase 1.

You can launch up to ${q} agent(s) in parallel.

**Guidelines:**
- **Default**: Launch at least 1 Plan agent for most tasks - it helps validate your understanding and consider alternatives
- **Skip agents**: Only for truly trivial tasks (typo fixes, single-line changes, simple renames)
${q>1?`- **Multiple agents**: Use up to ${q} agents for complex tasks that benefit from different perspectives

Examples of when to use multiple agents:
- The task touches multiple parts of the codebase
- It's a large refactor or architectural change
- There are many edge cases to consider
- You'd benefit from exploring different approaches

Example perspectives by task type:
- New feature: simplicity vs performance vs maintainability
- Bug fix: root cause vs workaround vs prevention
- Refactoring: minimal change vs clean architecture
`:""}
In the agent prompt:
- Provide comprehensive background context from Phase 1 exploration including filenames and code path traces
- Describe requirements and constraints
- Request a detailed implementation plan

### Phase 3: Review
Goal: Review the plan(s) from Phase 2 and ensure alignment with the user's intentions.
1. Read the critical files identified by agents to deepen your understanding
2. Ensure that the plans align with the user's original request
3. Use ${TH} to clarify any remaining questions with the user

### Phase 4: Final Plan
Goal: Write your final plan to the plan file (the only file you can edit).
- Begin with a **Context** section: explain why this change is being made — the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### Phase 5: Call ${Nj.name}
At the very end of your turn, once you have asked the user questions and are happy with your final plan file - you should always call ${Nj.name} to indicate to the user that you are done planning.
This is critical - your turn should only end with either using the ${TH} tool OR calling ${Nj.name}. Do not stop unless it's for these 2 reasons

**Important:** Use ${TH} ONLY to clarify requirements or choose between approaches. Use ${Nj.name} to request plan approval. Do NOT ask about plan approval in any other way - no text questions, no AskUserQuestion. Phrases like "Is this plan okay?", "Should I proceed?", "How does this plan look?", "Any changes before we start?", or similar MUST use ${Nj.name}.

NOTE: At any point in time through this workflow you should feel free to ask the user questions or clarifications using the ${TH} tool. Don't make large assumptions about user intent. The goal is to present a well researched plan to the user, and tie any loose ends before implementation begins.`;
    return _9([c6({
        content: z,
        isMeta: !0
    })])
}
// @from(Ln 445670, Col 0)
function tzz() {
    let A = [Jq, Jz, s9],
        {
            allowedTools: q
        } = sz();
    return (q && q.length > 0 ? A.filter((Y) => q.includes(Y)) : A).join(", ")
}
// @from(Ln 445678, Col 0)
function ezz(A) {
    let q = A.planExists ? `A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${sW.name} tool.` : `No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${vj.name} tool.`,
        K = `You can use the ${bv.agentType} agent type to parallelize complex searches without filling your context, though for straightforward queries direct tools are simpler.`,
        Y = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received.

## Plan File Info:
${q}

## Iterative Planning Workflow

You are pair-planning with the user. Explore the code to build context, ask the user questions when you hit decisions you can't make alone, and write your findings into the plan file as you go. The plan file (above) is the ONLY file you may edit — it starts as a rough skeleton and gradually becomes the final plan.

### The Loop

Repeat this cycle until the plan is complete:

1. **Explore** — Use ${tzz()} to read code. Look for existing functions, utilities, and patterns to reuse. ${K}
2. **Update the plan file** — After each discovery, immediately capture what you learned. Don't wait until the end.
3. **Ask the user** — When you hit an ambiguity or decision you can't resolve from code alone, use ${TH}. Then go back to step 1.

### First Turn

Start by quickly scanning a few key files to form an initial understanding of the task scope. Then write a skeleton plan (headers and rough notes) and ask the user your first round of questions. Don't explore exhaustively before engaging the user.

### Asking Good Questions

- Never ask what you could find out by reading the code
- Batch related questions together (use multi-question ${TH} calls)
- Focus on things only the user can answer: requirements, preferences, tradeoffs, edge case priorities
- Scale depth to the task — a vague feature request needs many rounds; a focused bug fix may need one or none

### Plan File Structure
Your plan file should be divided into clear sections using markdown headers, based on the request. Fill out these sections as you go.
- Begin with a **Context** section: explain why this change is being made — the problem or need it addresses, what prompted it, and the intended outcome
- Include only your recommended approach, not all alternatives
- Ensure that the plan file is concise enough to scan quickly, but detailed enough to execute effectively
- Include the paths of critical files to be modified
- Reference existing functions and utilities you found that should be reused, with their file paths
- Include a verification section describing how to test the changes end-to-end (run the code, use MCP tools, run tests)

### When to Converge

Your plan is ready when you've addressed all ambiguities and it covers: what to change, which files to modify, what existing code to reuse (with file paths), and how to verify the changes. Call ${Nj.name} when the plan is ready for approval.

### Ending Your Turn

Your turn should only end by either:
- Using ${TH} to gather more information
- Calling ${Nj.name} when the plan is ready for approval

**Important:** Use ${Nj.name} to request plan approval. Do NOT ask about plan approval via text or AskUserQuestion.`;
    return _9([c6({
        content: Y,
        isMeta: !0
    })])
}
// @from(Ln 445735, Col 0)
function A2z(A) {
    let q = sO() ? "Follow iterative workflow: explore codebase, interview user, write to plan incrementally." : "Follow 5-phase workflow.",
        K = `Plan mode still active (see full instructions earlier in conversation). Read-only except plan file (${A.planFilePath}). ${q} End turns with ${TH} (for clarifications) or ${Nj.name} (for plan approval). Never ask about plan approval via text or AskUserQuestion.`;
    return _9([c6({
        content: K,
        isMeta: !0
    })])
}
// @from(Ln 445744, Col 0)
function q2z(A) {
    let K = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${sW.name} tool if you need to.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${vj.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${TH} tool if you need to ask the user clarifying questions. If you do use the ${TH}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
    return _9([c6({
        content: K,
        isMeta: !0
    })])
}
// @from(Ln 445757, Col 0)
function K2z(A) {
    if (l8()) {
        if (A.type === "teammate_mailbox") return [c6({
            content: Uzz().formatTeammateMessages(A.messages),
            isMeta: !0
        })];
        if (A.type === "team_context") return [c6({
            content: `<system-reminder>
# Team Coordination

You are a teammate in team "${A.teamName}".

**Your Identity:**
- Name: ${A.agentName}

**Team Resources:**
- Team config: ${A.teamConfigPath}
- Task list: ${A.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"), never by UUID. When messaging, use the name directly:

\`\`\`json
{
  "operation": "write",
  "target_agent_id": "team-lead",
  "value": "Your message here"
}
\`\`\`
</system-reminder>`,
            isMeta: !0
        })]
    }
    switch (A.type) {
        case "directory":
            return _9([pd1(qq.name, {
                command: `ls ${R7([A.path])}`,
                description: `Lists files in ${A.path}`
            }), Ud1(qq, {
                stdout: A.content,
                stderr: "",
                interrupted: !1
            })]);
        case "edited_text_file":
            return _9([c6({
                content: `Note: ${A.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${A.snippet}`,
                isMeta: !0
            })]);
        case "file": {
            let K = A.content;
            switch (K.type) {
                case "image":
                    return _9([pd1(i5.name, {
                        file_path: A.filename
                    }), Ud1(i5, K)]);
                case "text":
                    return _9([pd1(i5.name, {
                        file_path: A.filename
                    }), Ud1(i5, K), ...A.truncated ? [c6({
                        content: `Note: The file ${A.filename} was too large and has been truncated to the first ${AC1} lines. Don't tell the user about this truncation. Use ${i5.name} to read more of the file if you need.`,
                        isMeta: !0
                    })] : []]);
                case "notebook":
                    return _9([pd1(i5.name, {
                        file_path: A.filename
                    }), Ud1(i5, K)]);
                case "pdf":
                    return _9([pd1(i5.name, {
                        file_path: A.filename
                    }), Ud1(i5, K)])
            }
            break
        }
        case "compact_file_reference":
            return _9([c6({
                content: `Note: ${A.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${i5.name} tool if you need to access it.`,
                isMeta: !0
            })]);
        case "pdf_reference":
            return _9([c6({
                content: `PDF file: ${A.filename} (${A.pageCount} pages, ${L2(A.fileSize)}). This PDF is too large to read all at once. You MUST use the ${Jq} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${Jq} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`,
                isMeta: !0
            })]);
        case "selected_lines_in_ide": {
            let Y = A.content.length > 2000 ? A.content.substring(0, 2000) + `
... (truncated)` : A.content;
            return _9([c6({
                content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:
${Y}

This may or may not be related to the current task.`,
                isMeta: !0
            })])
        }
        case "opened_file_in_ide":
            return _9([c6({
                content: `The user opened the file ${A.filename} in the IDE. This may or may not be related to the current task.`,
                isMeta: !0
            })]);
        case "todo":
            if (A.itemCount === 0) return _9([c6({
                content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the ${cg} tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
                isMeta: !0
            })]);
            else return _9([c6({
                content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${Q1(A.content)}. Continue on with the tasks at hand if applicable.`,
                isMeta: !0
            })]);
        case "plan_file_reference":
            return _9([c6({
                content: `A plan file exists from plan mode at: ${A.planFilePath}

Plan contents:

${A.planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
                isMeta: !0
            })]);
        case "invoked_skills": {
            if (A.skills.length === 0) return [];
            let K = A.skills.map((Y) => `### Skill: ${Y.name}
Path: ${Y.path}

${Y.content}`).join(`

---

`);
            return _9([c6({
                content: `The following skills were invoked in this session. Continue to follow these guidelines:

${K}`,
                isMeta: !0
            })])
        }
        case "todo_reminder": {
            let K = A.content.map((z, w) => `${w+1}. [${z.status}] ${z.content}`).join(`
`),
                Y = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
            if (K.length > 0) Y += `

Here are the existing contents of your todo list:

[${K}]`;
            return _9([c6({
                content: Y,
                isMeta: !0
            })])
        }
        case "task_reminder": {
            if (!jH()) return [];
            let K = A.content.map((z) => `#${z.id}. [${z.status}] ${z.subject}`).join(`
`),
                Y = `The task tools haven't been used recently. If you're working on tasks that would benefit from tracking progress, consider using ${Nh} to add new tasks and ${DR} to update task status (set to in_progress when starting, completed when done). Also consider cleaning up the task list if it has become stale. Only use these if relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
            if (K.length > 0) Y += `

Here are the existing tasks:

${K}`;
            return _9([c6({
                content: Y,
                isMeta: !0
            })])
        }
        case "nested_memory":
            return _9([c6({
                content: `Contents of ${A.content.path}:

${A.content.content}`,
                isMeta: !0
            })]);
        case "dynamic_skill":
            return [];
        case "skill_listing": {
            if (!A.content) return [];
            return _9([c6({
                content: `The following skills are available for use with the Skill tool:

${A.content}`,
                isMeta: !0
            })])
        }
        case "queued_command": {
            if (Array.isArray(A.prompt)) {
                let K = A.prompt.filter((w) => w.type === "text").map((w) => w.text).join(`
`),
                    Y = A.prompt.filter((w) => w.type === "image"),
                    z = [{
                        type: "text",
                        text: `The user sent a new message while you were working:
${K}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`
                    }, ...Y];
                return _9([c6({
                    content: z,
                    isMeta: !0
                })])
            }
            return _9([c6({
                content: `The user sent a new message while you were working:
${A.prompt}

IMPORTANT: After completing your current task, you MUST address the user's message above. Do not ignore it.`,
                isMeta: !0
            })])
        }
        case "ultramemory":
            return _9([c6({
                content: A.content,
                isMeta: !0
            })]);
        case "output_style": {
            let K = D51[A.style];
            if (!K) return [];
            return _9([c6({
                content: `${K.name} output style is active. Remember to follow the specific guidelines for this style.`,
                isMeta: !0
            })])
        }
        case "diagnostics": {
            if (A.files.length === 0) return [];
            let K = KI.formatDiagnosticsSummary(A.files);
            return _9([c6({
                content: `<new-diagnostics>The following new diagnostic issues were detected:

${K}</new-diagnostics>`,
                isMeta: !0
            })])
        }
        case "plan_mode":
            return azz(A);
        case "plan_mode_reentry": {
            let K = `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${A.planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ${Nj.name}

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`;
            return _9([c6({
                content: K,
                isMeta: !0
            })])
        }
        case "plan_mode_exit": {
            let Y = `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${A.planExists?` The plan file is located at ${A.planFilePath} if you need to reference it.`:""}`;
            return _9([c6({
                content: Y,
                isMeta: !0
            })])
        }
        case "delegate_mode": {
            if (!l8()) return [];
            let K = `## Delegate Mode

You are in delegate mode for team "${A.teamName}". In this mode, you can ONLY use the following tools:
- TeammateTool: For spawning teammates, sending messages, and team coordination
- TaskCreate: For creating new tasks
- TaskGet: For retrieving task details
- TaskUpdate: For updating task status and adding comments
- TaskList: For listing all tasks

You CANNOT use any other tools (Bash, Read, Write, Edit, etc.) until you exit delegate mode.

**Task list location:** ${A.taskListPath}

Focus on coordinating work by creating tasks, assigning them to teammates, and monitoring progress. Use the Teammate tool to communicate with your team.`;
            return _9([c6({
                content: K,
                isMeta: !0
            })])
        }
        case "delegate_mode_exit":
            return _9([c6({
                content: `## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
                isMeta: !0
            })]);
        case "critical_system_reminder":
            return _9([c6({
                content: A.content,
                isMeta: !0
            })]);
        case "mcp_resource": {
            let K = A.content;
            if (!K || !K.contents || K.contents.length === 0) return _9([c6({
                content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No content)</mcp-resource>`,
                isMeta: !0
            })]);
            let Y = [];
            for (let z of K.contents)
                if (z && typeof z === "object") {
                    if ("text" in z && typeof z.text === "string") Y.push({
                        type: "text",
                        text: "Full contents of resource:"
                    }, {
                        type: "text",
                        text: z.text
                    }, {
                        type: "text",
                        text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents."
                    });
                    else if ("blob" in z) {
                        let w = "mimeType" in z ? String(z.mimeType) : "application/octet-stream";
                        Y.push({
                            type: "text",
                            text: `[Binary content: ${w}]`
                        })
                    }
                } if (Y.length > 0) return _9([c6({
                content: Y,
                isMeta: !0
            })]);
            else return SA(A.server, `No displayable content found in MCP resource ${A.uri}.`), _9([c6({
                content: `<mcp-resource server="${A.server}" uri="${A.uri}">(No displayable content)</mcp-resource>`,
                isMeta: !0
            })])
        }
        case "agent_mention":
            return _9([c6({
                content: `The user has expressed a desire to invoke the agent "${A.agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
                isMeta: !0
            })]);
        case "task_status": {
            let K = A.status === "killed" ? "stopped" : A.status;
            if (A.status === "killed") return [c6({
                content: tI(`Task "${A.description}" (${A.taskId}) was stopped by the user.`),
                isMeta: !0
            })];
            let Y = [`Task ${A.taskId}`, `(type: ${A.taskType})`, `(status: ${K})`, `(description: ${A.description})`];
            if (A.deltaSummary) Y.push(`Delta: ${A.deltaSummary}`);
            return Y.push("You can check its output using the TaskOutput tool."), [c6({
                content: tI(Y.join(" ")),
                isMeta: !0
            })]
        }
        case "task_progress":
            return [c6({
                content: tI(A.message),
                isMeta: !0
            })];
        case "async_hook_response": {
            let K = A.response,
                Y = [];
            if (K.systemMessage) Y.push(c6({
                content: K.systemMessage,
                isMeta: !0
            }));
            if (K.hookSpecificOutput && "additionalContext" in K.hookSpecificOutput && K.hookSpecificOutput.additionalContext) Y.push(c6({
                content: K.hookSpecificOutput.additionalContext,
                isMeta: !0
            }));
            return _9(Y)
        }
        case "token_usage":
            return [c6({
                content: tI(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`),
                isMeta: !0
            })];
        case "budget_usd":
            return [c6({
                content: tI(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`),
                isMeta: !0
            })];
        case "hook_blocking_error":
            return [c6({
                content: tI(`${A.hookName} hook blocking error from command: "${A.blockingError.command}": ${A.blockingError.blockingError}`),
                isMeta: !0
            })];
        case "hook_success":
            if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return [];
            if (A.content === "") return [];
            return [c6({
                content: tI(`${A.hookName} hook success: ${A.content}`),
                isMeta: !0
            })];
        case "hook_additional_context": {
            if (A.content.length === 0) return [];
            return [c6({
                content: tI(`${A.hookName} hook additional context: ${A.content.join(`
`)}`),
                isMeta: !0
            })]
        }
        case "hook_stopped_continuation":
            return [c6({
                content: tI(`${A.hookName} hook stopped continuation: ${A.message}`),
                isMeta: !0
            })];
        case "compaction_reminder":
            return _9([c6({
                content: "Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush — you have unlimited context through automatic compaction.",
                isMeta: !0
            })]);
        case "verify_plan_reminder": {
            let Y = `You have completed implementing the plan. Please call the "" tool directly (NOT the ${fK} tool or an agent) to verify that all plan items were completed correctly.`;
            return _9([c6({
                content: Y,
                isMeta: !0
            })])
        }
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
            return []
    }
    if (["autocheckpointing", "background_task_status"].includes(A.type)) return [];
    return Yk("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}
// @from(Ln 446192, Col 0)
function Ud1(A, q) {
    try {
        let K = A.mapToolResultToToolResultBlockParam(q, "1");
        if (Array.isArray(K.content) && K.content.some((Y) => Y.type === "image")) return c6({
            content: K.content,
            isMeta: !0
        });
        return c6({
            content: `Result of calling the ${A.name} tool: ${Q1(K.content)}`,
            isMeta: !0
        })
    } catch {
        return c6({
            content: `Result of calling the ${A.name} tool: Error`,
            isMeta: !0
        })
    }
}
// @from(Ln 446211, Col 0)
function pd1(A, q) {
    return c6({
        content: `Called the ${A} tool with the following input: ${Q1(q)}`,
        isMeta: !0
    })
}
// @from(Ln 446218, Col 0)
function WP(A, q, K, Y) {
    return {
        type: "system",
        subtype: "informational",
        content: A,
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: _f(),
        toolUseID: K,
        level: q,
        ...Y && {
            preventContinuation: Y
        }
    }
}
// @from(Ln 446234, Col 0)
function z6q(A, q, K, Y, z, w, H, $) {
    return {
        type: "system",
        subtype: "stop_hook_summary",
        hookCount: A,
        hookInfos: q,
        hookErrors: K,
        preventedContinuation: Y,
        stopReason: z,
        hasOutput: w,
        level: H,
        timestamp: new Date().toISOString(),
        uuid: _f(),
        toolUseID: $
    }
}
// @from(Ln 446251, Col 0)
function cmA(A) {
    return {
        type: "system",
        subtype: "turn_duration",
        durationMs: A,
        timestamp: new Date().toISOString(),
        uuid: _f(),
        isMeta: !1
    }
}
// @from(Ln 446262, Col 0)
function tvA(A) {
    return {
        type: "system",
        subtype: "local_command",
        content: A,
        level: "info",
        timestamp: new Date().toISOString(),
        uuid: _f(),
        isMeta: !1
    }
}
// @from(Ln 446274, Col 0)
function JU1(A, q, K, Y, z) {
    return {
        type: "system",
        subtype: "compact_boundary",
        content: "Conversation compacted",
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: _f(),
        level: "info",
        compactMetadata: {
            trigger: A,
            preTokens: q,
            userContext: Y,
            messagesSummarized: z
        },
        ...K ? {
            logicalParentUuid: K
        } : {}
    }
}
// @from(Ln 446295, Col 0)
function Ws4(A, q, K, Y, z) {
    return {
        type: "system",
        subtype: "microcompact_boundary",
        content: "Context microcompacted",
        isMeta: !1,
        timestamp: new Date().toISOString(),
        uuid: _f(),
        level: "info",
        microcompactMetadata: {
            trigger: A,
            preTokens: q,
            tokensSaved: K,
            compactedToolIds: Y,
            clearedAttachmentUUIDs: z
        }
    }
}
// @from(Ln 446314, Col 0)
function QCA(A) {
    return A?.type === "system" && A.subtype === "microcompact_boundary"
}
// @from(Ln 446318, Col 0)
function Hv7(A, q, K, Y) {
    return {
        type: "system",
        subtype: "api_error",
        level: "error",
        cause: A.cause instanceof Error ? A.cause : void 0,
        error: A,
        retryInMs: q,
        retryAttempt: K,
        maxRetries: Y,
        timestamp: new Date().toISOString(),
        uuid: _f()
    }
}
// @from(Ln 446333, Col 0)
function cR(A) {
    return A?.type === "system" && A.subtype === "compact_boundary"
}
// @from(Ln 446337, Col 0)
function Y2z(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K && cR(K)) return q
    }
    return -1
}
// @from(Ln 446345, Col 0)
function EN(A) {
    let q = Y2z(A);
    if (q === -1) return A;
    return A.slice(q)
}
// @from(Ln 446351, Col 0)
function qYq(A, q) {
    if (A.type !== "user") return !0;
    if (A.isMeta) return !1;
    if (A.isVisibleInTranscriptOnly && !q) return !1;
    return !0
}
// @from(Ln 446358, Col 0)
function bg1(A) {
    if (A.type !== "assistant") return !1;
    if (!Array.isArray(A.message.content)) return !1;
    return A.message.content.every((q) => q.type === "thinking")
}
// @from(Ln 446364, Col 0)
function lmA(A, q, K) {
    let Y = 0;
    for (let z of A) {
        if (!z) continue;
        if (z.type === "assistant" && Array.isArray(z.message.content)) {
            if (z.message.content.some((H) => H.type === "tool_use" && H.name === q)) {
                if (Y++, K && Y >= K) return Y
            }
        }
    }
    return Y
}
// @from(Ln 446377, Col 0)
function Mn7(A, q) {
    let K;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (!z) continue;
        if (z.type === "assistant" && Array.isArray(z.message.content)) {
            let w = z.message.content.find((H) => H.type === "tool_use" && H.name === q);
            if (w) {
                K = w.id;
                break
            }
        }
    }
    if (!K) return !1;
    for (let Y = A.length - 1; Y >= 0; Y--) {
        let z = A[Y];
        if (!z) continue;
        if (z.type === "user" && Array.isArray(z.message.content)) {
            let w = z.message.content.find((H) => H.type === "tool_result" && H.tool_use_id === K);
            if (w) return w.is_error !== !0
        }
    }
    return !1
}
// @from(Ln 446402, Col 0)
function dmA(A) {
    return A.type === "thinking" || A.type === "redacted_thinking"
}
// @from(Ln 446406, Col 0)
function z2z(A) {
    let q = A[A.length - 1];
    if (!q || q.type !== "assistant") return A;
    let K = q.message.content,
        Y = K[K.length - 1];
    if (!Y || !dmA(Y)) return A;
    let z = K.length - 1;
    while (z >= 0) {
        let $ = K[z];
        if (!$ || !dmA($)) break;
        z--
    }
    c("tengu_filtered_trailing_thinking_block", {
        messageUUID: q.uuid,
        blocksRemoved: K.length - z - 1,
        remainingBlocks: z + 1
    });
    let w = z < 0 ? [{
            type: "text",
            text: "[No message content]",
            citations: []
        }] : K.slice(0, z + 1),
        H = [...A];
    return H[A.length - 1] = {
        ...q,
        message: {
            ...q.message,
            content: w
        }
    }, H
}
// @from(Ln 446438, Col 0)
function w2z(A) {
    if (A.length === 0) return !1;
    for (let q of A) {
        if (q.type !== "text") return !1;
        if (q.text !== void 0 && q.text.trim() !== "") return !1
    }
    return !0
}
// @from(Ln 446447, Col 0)
function BQ1(A) {
    let q = !1,
        K = A.filter((z) => {
            if (z.type !== "assistant") return !0;
            let w = z.message.content;
            if (!Array.isArray(w) || w.length === 0) return !0;
            if (w2z(w)) return q = !0, c("tengu_filtered_whitespace_only_assistant", {
                messageUUID: z.uuid
            }), !1;
            return !0
        });
    if (!q) return A;
    let Y = [];
    for (let z of K) {
        let w = Y[Y.length - 1];
        if (z.type === "user" && w?.type === "user") Y[Y.length - 1] = MJq(w, z);
        else Y.push(z)
    }
    return Y
}
// @from(Ln 446468, Col 0)
function H2z(A) {
    if (A.length === 0) return A;
    let q = !1,
        K = A.map((Y, z) => {
            if (Y.type !== "assistant") return Y;
            if (z === A.length - 1) return Y;
            let w = Y.message.content;
            if (Array.isArray(w) && w.length === 0) return q = !0, c("tengu_fixed_empty_assistant_content", {
                messageUUID: Y.uuid,
                messageIndex: z
            }), {
                ...Y,
                message: {
                    ...Y.message,
                    content: [{
                        type: "text",
                        text: iv,
                        citations: []
                    }]
                }
            };
            return Y
        });
    return q ? K : A
}
// @from(Ln 446494, Col 0)
function mQ1(A) {
    let q = new Set;
    for (let Y of A) {
        if (Y.type !== "assistant") continue;
        let z = Y.message.content;
        if (!Array.isArray(z)) continue;
        if (z.some((H) => H.type !== "thinking" && H.type !== "redacted_thinking") && Y.message.id) q.add(Y.message.id)
    }
    return A.filter((Y) => {
        if (Y.type !== "assistant") return !0;
        let z = Y.message.content;
        if (!Array.isArray(z) || z.length === 0) return !0;
        if (!z.every((H) => H.type === "thinking" || H.type === "redacted_thinking")) return !0;
        if (Y.message.id && q.has(Y.message.id)) return !0;
        return c("tengu_filtered_orphaned_thinking_message", {
            messageUUID: Y.uuid,
            messageId: Y.message.id,
            blockCount: z.length
        }), !1
    })
}
// @from(Ln 446516, Col 0)
function xI4(A) {
    let q = !1,
        K = A.map((Y) => {
            if (Y.type !== "assistant") return Y;
            let z = Y.message.content;
            if (!Array.isArray(z)) return Y;
            let w = z.filter((H) => !dmA(H));
            if (w.length === z.length) return Y;
            if (w.length === 0) return Y;
            return q = !0, {
                ...Y,
                message: {
                    ...Y.message,
                    content: w
                }
            }
        });
    return q ? K : A
}
// @from(Ln 446536, Col 0)
function H6q(A, q) {
    return {
        type: "tool_use_summary",
        summary: A,
        precedingToolUseIds: q,
        uuid: _f(),
        timestamp: new Date().toISOString()
    }
}
// @from(Ln 446546, Col 0)
function nOq(A) {
    let q = [],
        K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (q.push(z), z.type !== "assistant") continue;
        let w = z.message.content.filter((D) => D.type === "tool_use").map((D) => D.id),
            H = A[Y + 1],
            $ = new Set;
        if (H?.type === "user") {
            let D = H.message.content;
            if (Array.isArray(D)) {
                for (let j of D)
                    if (typeof j === "object" && "type" in j && j.type === "tool_result") $.add(j.tool_use_id)
            }
        }
        let O = new Set(w),
            _ = w.filter((D) => !$.has(D)),
            J = [...$].filter((D) => !O.has(D));
        if (_.length === 0 && J.length === 0) continue;
        K = !0;
        let X = _.map((D) => ({
            type: "tool_result",
            tool_use_id: D,
            content: "[Tool result missing due to internal error]",
            is_error: !0
        }));
        if (H?.type === "user") {
            let D = Array.isArray(H.message.content) ? H.message.content : [{
                type: "text",
                text: H.message.content
            }];
            if (J.length > 0) {
                let M = new Set(J);
                D = D.filter((P) => {
                    if (typeof P === "object" && "type" in P && P.type === "tool_result") return !M.has(P.tool_use_id);
                    return !0
                })
            }
            let j = [...X, ...D];
            if (j.length > 0) {
                let M = {
                    ...H,
                    message: {
                        ...H.message,
                        content: j
                    }
                };
                Y++, q.push(M)
            } else Y++
        } else if (X.length > 0) q.push(c6({
            content: X,
            isMeta: !0
        }))
    }
    if (K) {
        let Y = A.map((z, w) => {
            if (z.type === "assistant") {
                let H = z.message.content.filter(($) => $.type === "tool_use").map(($) => $.id);
                return `[${w}] assistant(id=${z.message.id}, tool_uses=[${H.join(",")}])`
            }
            if (z.type === "user" && Array.isArray(z.message.content)) {
                let H = z.message.content.filter(($) => typeof $ === "object" && ("type" in $) && $.type === "tool_result").map(($) => $.tool_use_id);
                if (H.length > 0) return `[${w}] user(tool_results=[${H.join(",")}])`
            }
            return `[${w}] ${z.type}`
        });
        c("tengu_tool_result_pairing_repaired", {
            messageCount: A.length,
            repairedMessageCount: q.length,
            messageTypes: Y.join("; ")
        }), K1(Error(`ensureToolResultPairing: repaired missing tool_result blocks (${A.length} -> ${q.length} messages). Message structure: ${Y.join("; ")}`))
    }
    return q
}
// @from(Ln 446621, Col 4)
ts = "[Request interrupted by user]"
// @from(Ln 446622, Col 4)
YN = "[Request interrupted by user for tool use]"
// @from(Ln 446623, Col 4)
_M1 = "The user doesn't want to take this action right now. STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Ln 446624, Col 4)
nK1 = "The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed."
// @from(Ln 446625, Col 4)
UB1 = `The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). To tell you how to proceed, the user said:
`
// @from(Ln 446627, Col 4)
$I = "Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task."
// @from(Ln 446628, Col 4)
CQ1 = `Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:
`
// @from(Ln 446630, Col 4)
OWA = `The agent proposed a plan that was rejected by the user. The user chose to stay in plan mode rather than proceed with implementation.

Rejected plan:
`
// @from(Ln 446634, Col 4)
pzz = "IMPORTANT: You *may* attempt to accomplish this action using other tools that might naturally be used to accomplish this goal, e.g. using head instead of cat. But you *should not* attempt to work around this denial in malicious ways, e.g. do not use your ability to run tests to execute non-test actions. You should only try to work around this restriction in reasonable ways that do not attempt to bypass the intent behind this denial. If you believe this capability is essential to complete the user's request, STOP and explain to the user what you were trying to do and why you need this permission. Let the user decide how to proceed."
// @from(Ln 446635, Col 4)
Kq1 = "No response requested."
// @from(Ln 446636, Col 4)
eD1 = "<synthetic>"
// @from(Ln 446637, Col 4)
DOA
// @from(Ln 446637, Col 9)
vm
// @from(Ln 446637, Col 13)
ozz
// @from(Ln 446638, Col 4)
N8 = v(() => {
    S9();
    tE();
    P61();
    u6();
    Em();
    AB();
    M_();
    m6();
    _51();
    YE();
    vw();
    AH();
    y6();
    vz();
    X26();
    Z6();
    _H();
    at();
    i0();
    sMA();
    S51();
    fB1();
    V51();
    Lt();
    _H();
    wq();
    DW();
    cA();
    Tg1();
    oL();
    DOA = new Set([ts, YN, _M1, nK1, Kq1]);
    vm = {
        siblingToolUseIDs: new Map,
        progressMessagesByToolUseID: new Map,
        inProgressHookCounts: new Map,
        resolvedHookCounts: new Map,
        toolResultByToolUseID: new Map,
        toolUseByToolUseID: new Map,
        normalizedMessageCount: 0,
        resolvedToolUseIDs: new Set,
        erroredToolUseIDs: new Set
    };
    ozz = ["commit_analysis", "context", "function_analysis", "pr_analysis"]
})
// @from(Ln 446683, Col 4)
r0A = {}
// @from(Ln 446759, Col 0)
function vI(A) {
    return A.type === "user" || A.type === "assistant" || A.type === "attachment" || A.type === "system" || A.type === "progress"
}
// @from(Ln 446763, Col 0)
function oI() {
    return MF(O8(), "projects")
}
// @from(Ln 446767, Col 0)
function dO() {
    let A = ML6();
    if (A) return A;
    return a$(U6())
}
// @from(Ln 446773, Col 0)
function a$(A) {
    let q = fJ(eZ1);
    return MF(q, `${A}.jsonl`)
}
// @from(Ln 446778, Col 0)
function kh(A) {
    let q = fJ(eZ1),
        K = U6();
    return MF(q, K, "subagents", `agent-${A}.jsonl`)
}
// @from(Ln 446784, Col 0)
function zm1(A) {
    let q = fJ(eZ1),
        K = MF(q, `${A}.jsonl`),
        Y = b1();
    try {
        return Y.statSync(K), !0
    } catch {
        return !1
    }
}
// @from(Ln 446795, Col 0)
function VJq() {
    return "production"
}
// @from(Ln 446799, Col 0)
function nmA() {
    return "external"
}
// @from(Ln 446803, Col 0)
function Gc() {
    return !0
}
// @from(Ln 446807, Col 0)
function fJ(A) {
    return MF(oI(), dx(A))
}
// @from(Ln 446811, Col 0)
function YD() {
    if (!EE) {
        if (EE = new NJq, !GJq) Tq(async () => {
            await EE?.flush()
        }), GJq = !0
    }
    return EE
}
// @from(Ln 446820, Col 0)
function M2z() {
    if (EE) {
        if (EE.pendingWriteCount = 0, EE.flushResolvers = [], EE.flushTimer) clearTimeout(EE.flushTimer);
        EE.flushTimer = null, EE.activeDrain = null, EE.writeQueues = new Map
    }
}
// @from(Ln 446827, Col 0)
function P2z() {
    EE = null
}
// @from(Ln 446831, Col 0)
function W2z(A) {
    YD().setRemoteIngressUrl(A)
}
// @from(Ln 446834, Col 0)
class NJq {
    currentSessionTag;
    currentSessionTitle;
    currentSessionAgentName;
    currentSessionAgentColor;
    sessionFile = null;
    remoteIngressUrl = null;
    pendingWriteCount = 0;
    flushResolvers = [];
    writeQueues = new Map;
    flushTimer = null;
    activeDrain = null;
    FLUSH_INTERVAL_MS = 100;
    MAX_CHUNK_BYTES = 104857600;
    constructor() {}
    incrementPendingWrites() {
        this.pendingWriteCount++
    }
    decrementPendingWrites() {
        if (this.pendingWriteCount--, this.pendingWriteCount === 0) {
            for (let A of this.flushResolvers) A();
            this.flushResolvers = []
        }
    }
    async trackWrite(A) {
        this.incrementPendingWrites();
        try {
            return await A()
        } finally {
            this.decrementPendingWrites()
        }
    }
    enqueueWrite(A, q) {
        return new Promise((K) => {
            let Y = this.writeQueues.get(A);
            if (!Y) Y = [], this.writeQueues.set(A, Y);
            Y.push({
                entry: q,
                resolve: K
            }), this.scheduleDrain()
        })
    }
    scheduleDrain() {
        if (this.flushTimer) return;
        this.flushTimer = setTimeout(async () => {
            if (this.flushTimer = null, this.activeDrain = this.drainWriteQueue(), await this.activeDrain, this.activeDrain = null, this.writeQueues.size > 0) this.scheduleDrain()
        }, this.FLUSH_INTERVAL_MS)
    }
    async appendToFile(A, q) {
        try {
            await WJq(A, q, {
                mode: 384
            })
        } catch {
            await _2z(ZJq(A), {
                recursive: !0,
                mode: 448
            }), await WJq(A, q, {
                mode: 384
            })
        }
    }
    async drainWriteQueue() {
        for (let [A, q] of this.writeQueues) {
            if (q.length === 0) continue;
            let K = q.splice(0),
                Y = "",
                z = [];
            for (let {
                    entry: w,
                    resolve: H
                }
                of K) {
                let $ = Q1(w) + `
`;
                if (Y.length + $.length >= this.MAX_CHUNK_BYTES) {
                    await this.appendToFile(A, Y);
                    for (let O of z) O();
                    z.length = 0, Y = ""
                }
                Y += $, z.push(H)
            }
            if (Y.length > 0) {
                await this.appendToFile(A, Y);
                for (let w of z) w()
            }
        }
        for (let [A, q] of this.writeQueues)
            if (q.length === 0) this.writeQueues.delete(A)
    }
    async flush() {
        if (this.flushTimer) clearTimeout(this.flushTimer), this.flushTimer = null;
        if (this.activeDrain) await this.activeDrain;
        if (await this.drainWriteQueue(), this.pendingWriteCount === 0) return;
        return new Promise((A) => {
            this.flushResolvers.push(A)
        })
    }
    async removeMessageByUuid(A) {
        return this.trackWrite(async () => {
            if (this.sessionFile !== null) try {
                let K = (await kT6(this.sessionFile, {
                    encoding: "utf-8"
                })).split(`
`).filter((Y) => {
                    if (!Y.trim()) return !0;
                    try {
                        return _A(Y).uuid !== A
                    } catch {
                        return !0
                    }
                });
                await X2z(this.sessionFile, K.join(`
`), {
                    encoding: "utf8"
                })
            } catch {}
        })
    }
    async insertMessageChain(A, q = !1, K, Y, z) {
        return this.trackWrite(async () => {
            let w = Y ?? null,
                H;
            try {
                H = await sj()
            } catch {
                H = void 0
            }
            let $ = U6(),
                O = _61().get($);
            for (let _ of A) {
                let J = cR(_),
                    X = w;
                if (_.type === "user" && "sourceToolAssistantUUID" in _ && _.sourceToolAssistantUUID) X = _.sourceToolAssistantUUID;
                let D = {
                    parentUuid: J ? null : X,
                    logicalParentUuid: J ? w : void 0,
                    isSidechain: q,
                    teamName: z?.teamName,
                    agentName: z?.agentName,
                    userType: nmA(),
                    cwd: h6(),
                    sessionId: $,
                    version: j2z,
                    gitBranch: H,
                    agentId: K,
                    slug: O,
                    ..._
                };
                await this.appendEntry(D), w = _.uuid
            }
        })
    }
    async insertFileHistorySnapshot(A, q, K) {
        return this.trackWrite(async () => {
            let Y = {
                type: "file-history-snapshot",
                messageId: A,
                snapshot: q,
                isSnapshotUpdate: K
            };
            await this.appendEntry(Y)
        })
    }
    async insertQueueOperation(A) {
        return this.trackWrite(async () => {
            await this.appendEntry(A)
        })
    }
    async insertAttributionSnapshot(A) {
        return this.trackWrite(async () => {
            await this.appendEntry(A)
        })
    }
    async appendEntry(A, q = U6()) {
        let K = process.env.TEST_ENABLE_SESSION_PERSISTENCE === "true";
        if (VJq() === "test" && !K || C8()?.cleanupPeriodDays === 0 || qk()) return;
        let Y = U6(),
            z = q === Y,
            w;
        if (z) w = this.ensureCurrentSessionFile();
        else {
            let H = this.getExistingSessionFile(q);
            if (!H) {
                K1(Error(`appendEntry: session file not found for other session ${q}`));
                return
            }
            w = H
        }
        if (A.type === "summary") this.enqueueWrite(w, A);
        else if (A.type === "custom-title") this.enqueueWrite(w, A);
        else if (A.type === "tag") this.enqueueWrite(w, A);
        else if (A.type === "agent-name") this.enqueueWrite(w, A);
        else if (A.type === "agent-color") this.enqueueWrite(w, A);
        else if (A.type === "agent-setting") this.enqueueWrite(w, A);
        else if (A.type === "pr-link") this.enqueueWrite(w, A);
        else if (A.type === "file-history-snapshot") this.enqueueWrite(w, A);
        else if (A.type === "attribution-snapshot") this.enqueueWrite(w, A);
        else if (A.type === "speculation-accept") this.enqueueWrite(w, A);
        else if (A.type === "mode") this.enqueueWrite(w, A);
        else {
            let H = await qFA(q);
            if (A.type === "queue-operation") this.enqueueWrite(w, A);
            else {
                let O = A.isSidechain && A.agentId !== void 0 ? kh(xZ(A.agentId)) : w;
                if (!H.has(A.uuid)) {
                    if (this.enqueueWrite(O, A), H.add(A.uuid), this.remoteIngressUrl && vI(A) && A.type !== "progress") await this.persistToRemote(q, A)
                }
            }
        }
    }
    ensureCurrentSessionFile() {
        if (this.sessionFile === null) this.sessionFile = dO();
        return this.sessionFile
    }
    existingSessionFiles = new Map;
    getExistingSessionFile(A) {
        let q = this.existingSessionFiles.get(A);
        if (q) return q;
        let K = a$(A),
            Y = b1();
        try {
            return Y.statSync(K), this.existingSessionFiles.set(A, K), K
        } catch (z) {
            let w = z.code;
            if (w === "ENOENT" || w === "EACCES" || w === "EPERM") return null;
            throw z
        }
    }
    async persistToRemote(A, q) {
        if (!this.remoteIngressUrl || nO4()) return;
        if (!await yi4(A, q, this.remoteIngressUrl)) c("tengu_session_persistence_failed", {}), w3(1, "other")
    }
    setRemoteIngressUrl(A) {
        if (this.remoteIngressUrl = A, h(`Remote persistence enabled with URL: ${A}`), A) this.FLUSH_INTERVAL_MS = G2z
    }
    async getLastLog(A) {
        let {
            messages: q
        } = await AFA(A);
        if (q.size === 0) return null;
        let Y = Array.from(q.values()).filter((w) => !w.isSidechain).sort((w, H) => new Date(H.timestamp).getTime() - new Date(w.timestamp).getTime())[0];
        if (!Y) return null;
        return ld1(q, Y)
    }
}
// @from(Ln 447080, Col 0)
async function bI(A, q) {
    let K = EJq(A),
        Y = U6(),
        z = await qFA(Y),
        w = [],
        H;
    for (let $ of K)
        if (z.has($.uuid)) H = $.uuid;
        else w.push($);
    if (w.length > 0) await YD().insertMessageChain(w, !1, void 0, H, q);
    return K[K.length - 1]?.uuid || null
}
// @from(Ln 447092, Col 0)
async function X51(A, q, K) {
    await YD().insertMessageChain(EJq(A), !0, q, K)
}
// @from(Ln 447095, Col 0)
async function ZjA(A) {
    await YD().insertQueueOperation(A)
}
// @from(Ln 447098, Col 0)
async function rmA(A) {
    await YD().removeMessageByUuid(A)
}
// @from(Ln 447101, Col 0)
async function iQ1(A, q, K) {
    await YD().insertFileHistorySnapshot(A, q, K)
}
// @from(Ln 447104, Col 0)
async function Z2z(A) {
    await YD().insertAttributionSnapshot(A)
}
// @from(Ln 447107, Col 0)
async function Hy() {
    let A = YD();
    A.sessionFile = dO()
}
// @from(Ln 447111, Col 0)
async function e91() {
    await YD().flush()
}
// @from(Ln 447114, Col 0)
async function omA(A, q) {
    mP(Yj(A));
    let K = YD();
    try {
        let Y = await Si4(A, q) || [],
            z = b1(),
            w = fJ(eZ1);
        try {
            z.statSync(w)
        } catch {
            z.mkdirSync(w, {
                mode: 448
            })
        }
        let H = a$(A);
        try {
            z.unlinkSync(H)
        } catch {}
        for (let $ of Y) z.appendFileSync(H, Q1($) + `
`, {
            mode: 384
        });
        if (Y.length === 0) c8(H, "", {
            encoding: "utf8",
            flush: !0,
            mode: 384
        });
        return h(`Hydrated ${Y.length} entries from remote`), Y.length > 0
    } catch (Y) {
        return h(`Error hydrating session from remote: ${Y}`), H8("error", "hydrate_remote_session_fail"), !1
    } finally {
        K.setRemoteIngressUrl(q)
    }
}
// @from(Ln 447149, Col 0)
function amA(A) {
    let q = GN6(A);
    if (q) {
        let K = q.replace(/\n/g, " ").trim();
        if (K.length > 200) K = K.slice(0, 200).trim() + "…";
        return K
    }
    return "No prompt"
}
// @from(Ln 447159, Col 0)
function GN6(A) {
    for (let q of A) {
        if (q.type !== "user" || q.isMeta) continue;
        if ("isCompactSummary" in q && q.isCompactSummary) continue;
        let K = q.message?.content;
        if (!K) continue;
        let Y = "";
        if (typeof K === "string") Y = K;
        else if (Array.isArray(K)) Y = K.find(($) => $.type === "text")?.text || "";
        if (!Y) continue;
        let z = C4(Y, SG);
        if (z) {
            let H = z.replace(/^\//, "");
            if (Cd().has(H)) continue;
            else {
                let $ = C4(Y, "command-args");
                if (!$ || $.trim() === "") continue
            }
        }
        if (fJq.test(Y)) continue;
        let w = C4(Y, "bash-input");
        if (w) return `! ${w}`;
        return Y
    }
    return
}
// @from(Ln 447186, Col 0)
function smA(A) {
    return A.map((q) => {
        let {
            isSidechain: K,
            parentUuid: Y,
            ...z
        } = q;
        return z
    })
}
// @from(Ln 447197, Col 0)
function ld1(A, q) {
    let K = [],
        Y = new Set,
        z = q;
    while (z) {
        if (Y.has(z.uuid)) {
            K1(Error(`Cycle detected in parentUuid chain at message ${z.uuid}. Returning partial transcript.`)), c("tengu_chain_parent_cycle", {});
            break
        }
        Y.add(z.uuid), K.unshift(z), z = z.parentUuid ? A.get(z.parentUuid) : void 0
    }
    return K
}
// @from(Ln 447211, Col 0)
function RT6(A, q) {
    let K = [];
    for (let Y of q) {
        let z = A.get(Y.uuid);
        if (!z) continue;
        if (!z.isSnapshotUpdate) K.push(z.snapshot);
        else {
            let w = K.findLastIndex((H) => H.messageId === z.snapshot.messageId);
            if (w === -1) K.push(z.snapshot);
            else K[w] = z.snapshot
        }
    }
    return K
}
// @from(Ln 447226, Col 0)
function yT6(A, q) {
    return Array.from(A.values())
}
// @from(Ln 447229, Col 0)
async function f2z(A) {
    let q = b1();
    if (A.endsWith(".jsonl")) {
        let {
            messages: w,
            summaries: H,
            customTitles: $,
            tags: O,
            fileHistorySnapshots: _,
            attributionSnapshots: J,
            leafUuids: X
        } = await AY1(A);
        if (w.size === 0) throw Error("No messages found in JSONL file");
        let D = [...w.values()].filter((G) => X.has(G.uuid)).sort((G, f) => new Date(f.timestamp).getTime() - new Date(G.timestamp).getTime())[0];
        if (!D) throw Error("No valid conversation chain found in JSONL file");
        let j = ld1(w, D),
            M = H.get(D.uuid),
            P = $.get(D.sessionId),
            W = O.get(D.sessionId);
        return imA(j, 0, M, P, RT6(_, j), W, A, yT6(J, j))
    }
    let K = q.readFileSync(A, {
            encoding: "utf-8"
        }),
        Y;
    try {
        Y = _A(K)
    } catch (w) {
        throw Error(`Invalid JSON in transcript file: ${w}`)
    }
    let z;
    if (Array.isArray(Y)) z = Y;
    else if (Y && typeof Y === "object" && "messages" in Y) {
        if (!Array.isArray(Y.messages)) throw Error("Transcript messages must be an array");
        z = Y.messages
    } else throw Error("Transcript must be an array of messages or an object with a messages array");
    return imA(z, 0, void 0, void 0, void 0, void 0, A)
}
// @from(Ln 447268, Col 0)
function V2z(A) {
    if (A.type !== "user") return !1;
    if (A.isMeta) return !1;
    let q = A.message?.content;
    if (!q) return !1;
    if (typeof q === "string") return q.trim().length > 0;
    if (Array.isArray(q)) return q.some((K) => K.type === "text" || K.type === "image" || K.type === "document");
    return !1
}
// @from(Ln 447278, Col 0)
function N2z(A) {
    if (A.type !== "assistant") return !1;
    let q = A.message?.content;
    if (!q || !Array.isArray(q)) return !1;
    return q.some((K) => K.type === "text" && typeof K.text === "string" && K.text.trim().length > 0)
}
// @from(Ln 447285, Col 0)
function tmA(A) {
    let q = 0;
    for (let K of A) switch (K.type) {
        case "user":
            if (V2z(K)) q++;
            break;
        case "assistant":
            if (N2z(K)) q++;
            break;
        case "attachment":
        case "system":
        case "progress":
            break
    }
    return q
}
// @from(Ln 447302, Col 0)
function imA(A, q = 0, K, Y, z, w, H, $, O) {
    let _ = A[A.length - 1],
        J = A[0],
        X = amA(A),
        D = new Date(J.timestamp),
        j = new Date(_.timestamp);
    return {
        date: _.timestamp,
        messages: smA(A),
        fullPath: H,
        value: q,
        created: D,
        modified: j,
        firstPrompt: X,
        messageCount: tmA(A),
        isSidechain: J.isSidechain,
        teamName: J.teamName,
        agentName: J.agentName,
        agentSetting: O,
        leafUuid: _.uuid,
        summary: K,
        customTitle: Y,
        tag: w,
        fileHistorySnapshots: z,
        attributionSnapshots: $,
        gitBranch: _.gitBranch,
        projectPath: J.cwd
    }
}
// @from(Ln 447331, Col 0)
async function T2z(A) {
    let q = new Map,
        K = 0;
    for (let H of A) {
        let $ = Xw(H);
        if ($) {
            let O = (q.get($) || 0) + 1;
            q.set($, O), K = Math.max(O, K)
        }
    }
    if (K <= 1) return;
    let Y = Array.from(q.values()).filter((H) => H > 1),
        z = Y.length,
        w = Y.reduce((H, $) => H + $, 0);
    c("tengu_session_forked_branches_fetched", {
        total_sessions: q.size,
        sessions_with_branches: z,
        max_branches_per_session: Math.max(...Y),
        avg_branches_per_session: Math.round(w / z),
        total_transcript_count: A.length
    })
}
// @from(Ln 447353, Col 0)
async function TJq(A) {
    let q = fJ(eZ1),
        K = tZ1(q, A, eZ1);
    return await T2z(K), K
}
// @from(Ln 447359, Col 0)
function re(A, q) {
    b1().appendFileSync(A, Q1(q) + `
`, {
        mode: 384
    })
}
// @from(Ln 447365, Col 0)
async function Q91(A, q, K) {
    let Y = K ?? a$(A);
    if (re(Y, {
            type: "custom-title",
            customTitle: q,
            sessionId: A
        }), A === U6()) YD().currentSessionTitle = q;
    c("tengu_session_renamed", {})
}
// @from(Ln 447374, Col 0)
async function pN6(A, q, K) {
    let Y = K ?? a$(A);
    if (re(Y, {
            type: "tag",
            tag: q,
            sessionId: A
        }), A === U6()) YD().currentSessionTag = q;
    c("tengu_session_tagged", {})
}
// @from(Ln 447383, Col 0)
async function v2z(A, q, K, Y, z) {
    let w = z ?? a$(A);
    re(w, {
        type: "pr-link",
        sessionId: A,
        prNumber: q,
        prUrl: K,
        prRepository: Y,
        timestamp: new Date().toISOString()
    }), c("tengu_session_linked_to_pr", {
        prNumber: q
    })
}
// @from(Ln 447397, Col 0)
function JBA(A) {
    if (A === U6()) return YD().currentSessionTag;
    return
}
// @from(Ln 447402, Col 0)
function wm1(A) {
    if (A === U6()) return YD().currentSessionTitle;
    return
}
// @from(Ln 447407, Col 0)
function id1(A) {
    YD().currentSessionTitle = A
}
// @from(Ln 447410, Col 0)
async function FbA(A, q, K) {
    let Y = K ?? a$(A);
    if (re(Y, {
            type: "agent-name",
            agentName: q,
            sessionId: A
        }), A === U6()) YD().currentSessionAgentName = q;
    c("tengu_agent_name_set", {})
}
// @from(Ln 447419, Col 0)
async function VIA(A, q, K) {
    let Y = K ?? a$(A);
    if (re(Y, {
            type: "agent-color",
            agentColor: q,
            sessionId: A
        }), A === U6()) YD().currentSessionAgentColor = q;
    c("tengu_agent_color_set", {})
}
// @from(Ln 447429, Col 0)
function emA(A, q) {
    let K = a$(A);
    re(K, {
        type: "agent-setting",
        agentSetting: q,
        sessionId: A
    })
}
// @from(Ln 447438, Col 0)
function E2z(A, q, K) {
    if (qk()) return;
    let Y = K ?? a$(A);
    try {
        re(Y, {
            type: "mode",
            mode: q,
            sessionId: A
        })
    } catch {
        b1().mkdirSync(ZJq(Y), {
            mode: 448
        }), re(Y, {
            type: "mode",
            mode: q,
            sessionId: A
        })
    }
}
// @from(Ln 447458, Col 0)
function k2z(A) {
    if (A === U6()) return YD().currentSessionAgentName;
    return
}
// @from(Ln 447463, Col 0)
function L2z(A) {
    if (A === U6()) return YD().currentSessionAgentColor;
    return
}
// @from(Ln 447468, Col 0)
function Xw(A) {
    if (A.sessionId) return A.sessionId;
    return A.messages[0]?.sessionId
}
// @from(Ln 447473, Col 0)
function sR(A) {
    return A.messages.length === 0 && A.sessionId !== void 0
}
// @from(Ln 447476, Col 0)
async function TI(A) {
    if (!sR(A)) return A;
    let q = A.fullPath;
    if (!q) return A;
    try {
        let {
            messages: K,
            summaries: Y,
            customTitles: z,
            tags: w,
            agentNames: H,
            agentColors: $,
            agentSettings: O,
            prNumbers: _,
            prUrls: J,
            prRepositories: X,
            modes: D,
            fileHistorySnapshots: j,
            attributionSnapshots: M,
            leafUuids: P
        } = await AY1(q);
        if (K.size === 0) return A;
        let G = [...K.values()].filter((N) => P.has(N.uuid) && (N.type === "user" || N.type === "assistant")).sort((N, T) => new Date(T.timestamp).getTime() - new Date(N.timestamp).getTime())[0];
        if (!G) return A;
        let f = ld1(K, G),
            Z = f[0]?.sessionId;
        return {
            ...A,
            messages: smA(f),
            firstPrompt: amA(f),
            messageCount: tmA(f),
            summary: G ? Y.get(G.uuid) : A.summary,
            customTitle: Z ? z.get(Z) : A.customTitle,
            tag: Z ? w.get(Z) : A.tag,
            agentName: Z ? H.get(Z) : A.agentName,
            agentColor: Z ? $.get(Z) : A.agentColor,
            agentSetting: Z ? O.get(Z) : A.agentSetting,
            mode: Z ? D.get(Z) : A.mode,
            prNumber: Z ? _.get(Z) : A.prNumber,
            prUrl: Z ? J.get(Z) : A.prUrl,
            prRepository: Z ? X.get(Z) : A.prRepository,
            gitBranch: G?.gitBranch ?? A.gitBranch,
            isSidechain: f[0]?.isSidechain ?? A.isSidechain,
            teamName: f[0]?.teamName ?? A.teamName,
            leafUuid: G?.uuid ?? A.leafUuid,
            fileHistorySnapshots: RT6(j, f),
            attributionSnapshots: yT6(M, f)
        }
    } catch {
        return A
    }
}
// @from(Ln 447528, Col 0)
async function $F(A, q) {
    let {
        limit: K,
        exact: Y
    } = q || {}, z = await jc(y8()), w = vJq(z), {
        logs: H
    } = await qY1(w, 0, w.length), $ = A.toLowerCase().trim(), O = H.filter((X) => {
        let D = X.customTitle?.toLowerCase().trim();
        if (!D) return !1;
        return Y ? D === $ : D.includes($)
    }), _ = new Map;
    for (let X of O) {
        let D = Xw(X);
        if (D) {
            let j = _.get(D);
            if (!j || X.modified > j.modified) _.set(D, X)
        }
    }
    let J = Array.from(_.values());
    if (J.sort((X, D) => D.modified.getTime() - X.modified.getTime()), K) return J.slice(0, K);
    return J
}
// @from(Ln 447550, Col 0)
async function R2z(A) {
    let {
        createReadStream: q
    } = await import("fs"), {
        createInterface: K
    } = await import("readline"), Y = q(A, {
        encoding: "utf-8"
    }), z = K({
        input: Y,
        crlfDelay: 1 / 0
    }), w = -1, H = 0;
    for await (let $ of z) {
        let O = Buffer.byteLength($, "utf-8") + 1;
        if ($.includes('"compact_boundary"')) try {
            let _ = JSON.parse($);
            if (_.type === "system" && _.subtype === "compact_boundary") w = H + O
        } catch {}
        H += O
    }
    return w
}
// @from(Ln 447571, Col 0)
async function y2z(A, q) {
    let {
        createReadStream: K
    } = await import("fs"), Y = [], z = K(A, {
        start: q
    });
    for await (let w of z) Y.push(w);
    return Buffer.concat(Y)
}
// @from(Ln 447580, Col 0)
async function AY1(A) {
    let q = new Map,
        K = new Map,
        Y = new Map,
        z = new Map,
        w = new Map,
        H = new Map,
        $ = new Map,
        O = new Map,
        _ = new Map,
        J = new Map,
        X = new Map,
        D = new Map,
        j = new Map;
    try {
        let N;
        if (J6(process.env.CLAUDE_CODE_SKIP_PRECOMPACT_LOAD)) {
            let {
                size: k
            } = await J2z(A);
            if (k > 104857600) {
                let y = await R2z(A);
                N = y > 0 ? await y2z(A, y) : await kT6(A)
            } else N = await kT6(A)
        } else N = await kT6(A);
        let T = Q61(N);
        for (let k of T)
            if (vI(k)) {
                if (k.type === "progress" && k.data && typeof k.data === "object" && "normalizedMessages" in k.data && Array.isArray(k.data.normalizedMessages) && k.data.normalizedMessages.length > 0) k.data.normalizedMessages = [];
                q.set(k.uuid, k)
            } else if (k.type === "summary" && k.leafUuid) K.set(k.leafUuid, k.summary);
        else if (k.type === "custom-title" && k.sessionId) Y.set(k.sessionId, k.customTitle);
        else if (k.type === "tag" && k.sessionId) z.set(k.sessionId, k.tag);
        else if (k.type === "agent-name" && k.sessionId) w.set(k.sessionId, k.agentName);
        else if (k.type === "agent-color" && k.sessionId) H.set(k.sessionId, k.agentColor);
        else if (k.type === "agent-setting" && k.sessionId) $.set(k.sessionId, k.agentSetting);
        else if (k.type === "mode" && k.sessionId) X.set(k.sessionId, k.mode);
        else if (k.type === "pr-link" && k.sessionId) O.set(k.sessionId, k.prNumber), _.set(k.sessionId, k.prUrl), J.set(k.sessionId, k.prRepository);
        else if (k.type === "file-history-snapshot") D.set(k.messageId, k);
        else if (k.type === "attribution-snapshot") j.set(k.messageId, k)
    } catch {}
    let M = [...q.values()],
        P = new Set(M.map((Z) => Z.parentUuid).filter((Z) => Z !== null)),
        W = M.filter((Z) => !P.has(Z.uuid)),
        G = new Set,
        f = !1;
    for (let Z of W) {
        let N = new Set,
            T = Z;
        while (T) {
            if (N.has(T.uuid)) {
                f = !0;
                break
            }
            if (N.add(T.uuid), T.type === "user" || T.type === "assistant") {
                G.add(T.uuid);
                break
            }
            T = T.parentUuid ? q.get(T.parentUuid) : void 0
        }
    }
    if (f) c("tengu_transcript_parent_cycle", {});
    return {
        messages: q,
        summaries: K,
        customTitles: Y,
        tags: z,
        agentNames: w,
        agentColors: H,
        agentSettings: $,
        prNumbers: O,
        prUrls: _,
        prRepositories: J,
        modes: X,
        fileHistorySnapshots: D,
        attributionSnapshots: j,
        leafUuids: G
    }
}
// @from(Ln 447659, Col 0)
async function AFA(A) {
    let q = MF(fJ(y8()), `${A}.jsonl`);
    return AY1(q)
}
// @from(Ln 447663, Col 0)
async function KFA(A, q) {
    return (await qFA(A)).has(q)
}
// @from(Ln 447666, Col 0)
async function DyA(A) {
    let q = await YD().getLastLog(A);
    if (q !== null && q !== void 0) {
        let K = q[q.length - 1],
            {
                summaries: Y,
                customTitles: z,
                tags: w,
                agentSettings: H,
                fileHistorySnapshots: $,
                attributionSnapshots: O
            } = await AFA(A),
            _ = K ? Y.get(K.uuid) : void 0,
            J = K ? z.get(K.sessionId) : void 0,
            X = K ? w.get(K.sessionId) : void 0,
            D = H.get(A);
        return imA(q, 0, _, J, RT6($, q), X, a$(A), yT6(O, q), D)
    }
    return null
}
// @from(Ln 447686, Col 0)
async function XN6(A) {
    let q = await TJq(A),
        {
            logs: K
        } = await qY1(q, 0, q.length);
    return m61(K).map((Y, z) => ({
        ...Y,
        value: z
    }))
}
// @from(Ln 447696, Col 0)
async function wuA(A, q) {
    if (q?.skipIndex) return C2z(A);
    return (await CT6(A, q?.initialEnrichCount ?? 10)).logs
}
// @from(Ln 447700, Col 0)
async function C2z(A) {
    let q = b1(),
        K = oI();
    try {
        q.statSync(K)
    } catch {
        return []
    }
    let z = q.readdirSync(K).filter(($) => $.isDirectory()).map(($) => MF(K, $.name)),
        H = (await Promise.all(z.map(($) => S2z($, A)))).flat();
    return m61(H).map(($, O) => ({
        ...$,
        value: O
    }))
}
// @from(Ln 447715, Col 0)
async function CT6(A, q = 10) {
    let K = b1(),
        Y = oI();
    try {
        K.statSync(Y)
    } catch {
        return {
            logs: [],
            allStatLogs: [],
            nextIndex: 0
        }
    }
    let w = K.readdirSync(Y).filter((J) => J.isDirectory()).map((J) => MF(Y, J.name)),
        H = [];
    for (let J of w) H.push(...tZ1(J, A));
    let $ = m61(H).map((J, X) => ({
            ...J,
            value: X
        })),
        {
            logs: O,
            nextIndex: _
        } = await qY1($, 0, q);
    return {
        logs: O.map((J, X) => ({
            ...J,
            value: X
        })),
        allStatLogs: $,
        nextIndex: _
    }
}
// @from(Ln 447747, Col 0)
async function VN6(A, q, K = 10) {
    return (await nd1(A, q, K)).logs
}
// @from(Ln 447750, Col 0)
async function nd1(A, q, K = 10) {
    let Y = vJq(A, q),
        {
            logs: z,
            nextIndex: w
        } = await qY1(Y, 0, K);
    return {
        logs: z.map((H, $) => ({
            ...H,
            value: $
        })),
        allStatLogs: Y,
        nextIndex: w
    }
}
// @from(Ln 447766, Col 0)
function vJq(A, q) {
    let K = b1(),
        Y = oI();
    if (A.length <= 1) {
        let H = y8(),
            $ = fJ(H);
        return tZ1($, void 0, H)
    }
    try {
        K.statSync(Y)
    } catch {
        let H = fJ(y8());
        return tZ1(H, q, y8())
    }
    let z = A.map((H) => dx(H)),
        w = [];
    try {
        let H = K.readdirSync(Y);
        for (let $ of H) {
            if (!$.isDirectory()) continue;
            let O = $.name;
            for (let _ = 0; _ < z.length; _++) {
                let J = z[_];
                if (O === J || O.startsWith(J + "-")) {
                    w.push(...tZ1(MF(Y, O), void 0, A[_]));
                    break
                }
            }
        }
    } catch {
        let H = fJ(y8());
        return tZ1(H, q, y8())
    }
    return m61(w).map((H, $) => ({
        ...H,
        value: $
    }))
}
// @from(Ln 447804, Col 0)
async function sP1(A) {
    let q = kh(A),
        K = b1();
    try {
        K.statSync(q)
    } catch {
        return null
    }
    try {
        let {
            messages: Y
        } = await AY1(q), z = Array.from(Y.values()).filter((_) => _.agentId === A && _.isSidechain);
        if (z.length === 0) return null;
        let w = new Set(z.map((_) => _.parentUuid)),
            H = z.filter((_) => !w.has(_.uuid)).sort((_, J) => new Date(J.timestamp).getTime() - new Date(_.timestamp).getTime())[0];
        if (!H) return null;
        return ld1(Y, H).filter((_) => _.agentId === A).map(({
            isSidechain: _,
            parentUuid: J,
            ...X
        }) => X)
    } catch {
        return null
    }
}
// @from(Ln 447830, Col 0)
function chA(A) {
    let q = [];
    for (let K of A)
        if (K.type === "progress" && K.data && typeof K.data === "object" && "type" in K.data && K.data.type === "agent_progress" && "agentId" in K.data && typeof K.data.agentId === "string") q.push(K.data.agentId);
    return [...new Set(q)]
}
// @from(Ln 447837, Col 0)
function lhA(A) {
    return Object.entries(A).filter(([q, K]) => K.type === "local_agent").map(([q]) => q)
}
// @from(Ln 447841, Col 0)
function ihA(A) {
    let q = {};
    for (let K of Object.values(A))
        if (K.type === "in_process_teammate" && K.identity?.agentId && K.messages && K.messages.length > 0) q[K.identity.agentId] = K.messages;
    return q
}
// @from(Ln 447847, Col 0)
async function nhA(A) {
    let q = await Promise.all(A.map(async (Y) => {
            try {
                let z = await sP1(xZ(Y));
                if (z && z.length > 0) return {
                    agentId: Y,
                    transcript: z
                };
                return null
            } catch {
                return null
            }
        })),
        K = {};
    for (let Y of q)
        if (Y) K[Y.agentId] = Y.transcript;
    return K
}
// @from(Ln 447866, Col 0)
function EJq(A) {
    return A.filter((q) => {
        if (q.type === "attachment" && nmA() !== "ant") return !1;
        return !0
    }).map((q) => {
        if (q.type === "progress" && q.data && typeof q.data === "object" && "normalizedMessages" in q.data && Array.isArray(q.data.normalizedMessages)) return {
            ...q,
            data: {
                ...q.data,
                normalizedMessages: []
            }
        };
        return q
    })
}
// @from(Ln 447881, Col 0)
async function jyA(A) {
    return (await XN6())[A] || null
}
// @from(Ln 447884, Col 0)
async function YFA(A) {
    try {
        let q = U6(),
            K = a$(q),
            {
                messages: Y
            } = await AY1(K),
            z = null;
        for (let w of Y.values())
            if (w.type === "assistant") {
                let H = w.message.content;
                if (Array.isArray(H)) {
                    for (let $ of H)
                        if ($.type === "tool_use" && $.id === A) {
                            z = w;
                            break
                        }
                }
            } else if (w.type === "user") {
            let H = w.message.content;
            if (Array.isArray(H)) {
                for (let $ of H)
                    if ($.type === "tool_result" && $.tool_use_id === A) return null
            }
        }
        return z
    } catch {
        return null
    }
}
// @from(Ln 447915, Col 0)
function Rd1(A) {
    let q = b1(),
        K = new Map,
        Y;
    try {
        Y = q.readdirSync(A)
    } catch {
        return K
    }
    for (let z of Y) {
        if (!z.isFile() || !z.name.endsWith(".jsonl")) continue;
        let w = xv(O2z(z.name, ".jsonl"));
        if (!w) continue;
        let H = MF(A, z.name);
        try {
            let $ = q.statSync(H);
            K.set(w, {
                path: H,
                mtime: $.mtime.getTime(),
                ctime: $.birthtime.getTime(),
                size: $.size
            })
        } catch {
            h(`Failed to stat session file: ${H}`)
        }
    }
    return K
}
// @from(Ln 447943, Col 0)
async function HT6(A, q) {
    let {
        messages: K,
        summaries: Y,
        customTitles: z,
        tags: w,
        agentNames: H,
        agentColors: $,
        agentSettings: O,
        prNumbers: _,
        prUrls: J,
        prRepositories: X,
        modes: D,
        fileHistorySnapshots: j,
        attributionSnapshots: M,
        leafUuids: P
    } = await AY1(A);
    if (K.size === 0) return [];
    let W = [...K.values()].filter((f) => P.has(f.uuid)),
        G = [];
    for (let f of W) {
        let Z = ld1(K, f);
        if (Z.length === 0) continue;
        let N = [...K.values()].filter((y) => y.parentUuid === f.uuid && !P.has(y.uuid)).sort((y, B) => new Date(y.timestamp).getTime() - new Date(B.timestamp).getTime());
        Z.push(...N);
        let T = Z[0],
            k = T.sessionId;
        G.push({
            date: f.timestamp,
            messages: smA(Z),
            fullPath: A,
            value: 0,
            created: new Date(T.timestamp),
            modified: new Date(f.timestamp),
            firstPrompt: amA(Z),
            messageCount: tmA(Z),
            isSidechain: T.isSidechain ?? !1,
            sessionId: k,
            leafUuid: f.uuid,
            summary: Y.get(f.uuid),
            customTitle: z.get(k),
            tag: w.get(k),
            agentName: H.get(k),
            agentColor: $.get(k),
            agentSetting: O.get(k),
            mode: D.get(k),
            prNumber: _.get(k),
            prUrl: J.get(k),
            prRepository: X.get(k),
            gitBranch: f.gitBranch,
            projectPath: q ?? T.cwd,
            fileHistorySnapshots: RT6(j, Z),
            attributionSnapshots: yT6(M, Z)
        })
    }
    return G
}
// @from(Ln 448000, Col 0)
async function S2z(A, q) {
    let K = Rd1(A);
    if (K.size === 0) return [];
    let Y;
    if (q && K.size > q) Y = [...K.values()].sort((w, H) => H.mtime - w.mtime).slice(0, q);
    else Y = [...K.values()];
    let z = [];
    for (let w of Y) try {
        let H = await HT6(w.path);
        z.push(...H)
    } catch {
        h(`Failed to load session file: ${w.path}`)
    }
    return z
}