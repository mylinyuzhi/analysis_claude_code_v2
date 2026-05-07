
// @from(Ln 266300, Col 0)
function TI4({
    model: q,
    preNormalizedModel: K,
    start: _,
    startIncludingRetries: z,
    ttftMs: Y,
    usage: A,
    attempt: O,
    messageCount: w,
    messageTokens: $,
    requestId: j,
    firstAttemptRequestId: H,
    stopReason: J,
    didFallBackToNonStreaming: X,
    querySource: M,
    headers: P,
    costUSD: W,
    queryTracking: D,
    permissionMode: Z,
    newMessages: G,
    llmSpan: f,
    globalCacheStrategy: v,
    requestSetupMs: V,
    attemptStartTimes: k,
    fastMode: N,
    previousRequestId: R,
    betas: h
}) {
    let C = fI4({
            headers: P,
            baseUrl: process.env.ANTHROPIC_BASE_URL
        }),
        x, B, m, S;
    if (G) {
        let z6 = 0,
            A6 = 0,
            e = !1,
            i = {},
            O6 = 0;
        for (let J6 of G)
            for (let $6 of J6.message.content)
                if ($6.type === "text") z6 += $6.text.length;
                else if ($6.type === "thinking") A6 += $6.thinking.length;
        else if ($6.type === "tool_use" || $6.type === "server_tool_use" || $6.type === "mcp_tool_use") {
            let H6 = I6($6.input).length,
                q6 = PK($6.name);
            i[q6] = (i[q6] ?? 0) + H6, e = !0
        }
        x = z6, B = A6 > 0 ? A6 : void 0, m = e ? i : void 0, S = O6 > 0 ? O6 : void 0
    }
    let F = Date.now() - _,
        U = Date.now() - z;
    if (L61(U, F), b0z({
            model: q,
            preNormalizedModel: K,
            messageCount: w,
            messageTokens: $,
            usage: A,
            durationMs: F,
            durationMsIncludingRetries: U,
            attempt: O,
            ttftMs: Y,
            requestId: j,
            firstAttemptRequestId: H,
            stopReason: J,
            costUSD: W,
            didFallBackToNonStreaming: X,
            querySource: M,
            gateway: C,
            queryTracking: D,
            permissionMode: Z,
            globalCacheStrategy: v,
            textContentLength: x,
            thinkingContentLength: B,
            toolUseContentLengths: m,
            connectorTextBlockCount: S,
            fastMode: N,
            previousRequestId: R,
            betas: h
        }), Xz("api_request", {
            model: q,
            input_tokens: String(A.input_tokens),
            output_tokens: String(A.output_tokens),
            cache_read_tokens: String(A.cache_read_input_tokens),
            cache_creation_tokens: String(A.cache_creation_input_tokens),
            cost_usd: String(W),
            duration_ms: String(F),
            request_id: j ?? void 0,
            speed: N ? "fast" : "normal"
        }), G) eb4(G, {
        model: q,
        querySource: M,
        requestId: j
    });
    let g, c, n;
    if (hJ() && G) g = G.flatMap((z6) => z6.message.content.filter((A6) => A6.type === "text").map((A6) => A6.text)).join(`
`) || void 0, n = G.some((z6) => z6.message.content.some((A6) => A6.type === "tool_use"));
    ti1(f, {
        success: !0,
        inputTokens: A.input_tokens,
        outputTokens: A.output_tokens,
        cacheReadTokens: A.cache_read_input_tokens,
        cacheCreationTokens: A.cache_creation_input_tokens,
        attempt: O,
        modelOutput: g,
        thinkingOutput: c,
        hasToolCall: n,
        requestId: j ?? void 0,
        ttftMs: Y ?? void 0,
        requestSetupMs: V,
        attemptStartTimes: k
    });
    let l = aO8();
    if (l?.isTeleported && !l.hasLoggedFirstMessage) d("tengu_teleport_first_message_success", {
        session_id: l.sessionId
    }), sO8()
}
// @from(Ln 266417, Col 4)
S0z
// @from(Ln 266417, Col 9)
C0z
// @from(Ln 266418, Col 4)
R18 = L(() => {
    eG();
    y8();
    K8();
    U8();
    x9();
    e8();
    uf();
    li1();
    Qc();
    mB();
    C8();
    q2();
    Jx8();
    rv();
    Ws();
    S0z = {
        litellm: {
            prefixes: ["x-litellm-"]
        },
        helicone: {
            prefixes: ["helicone-"]
        },
        portkey: {
            prefixes: ["x-portkey-"]
        },
        "cloudflare-ai-gateway": {
            prefixes: ["cf-aig-"]
        },
        kong: {
            prefixes: ["x-kong-"]
        },
        braintrust: {
            prefixes: ["x-bt-"]
        }
    }, C0z = {
        databricks: [".cloud.databricks.com", ".azuredatabricks.net", ".gcp.databricks.com"]
    }
})
// @from(Ln 266458, Col 0)
function VI4() {
    return {
        seen: new Map,
        counter: 0
    }
}
// @from(Ln 266465, Col 0)
function Xx8(q) {
    q.seen.clear()
}
// @from(Ln 266469, Col 0)
function kI4(q) {
    let K = 0;
    for (let _ of q) {
        if (_.type !== "user" || !Array.isArray(_.message.content)) continue;
        for (let z of _.message.content) {
            if (z.type !== "tool_result" || typeof z.content !== "string") continue;
            let Y = u0z.exec(z.content);
            if (Y) K = Math.max(K, Number(Y[1]))
        }
    }
    return {
        seen: new Map,
        counter: K
    }
}
// @from(Ln 266485, Col 0)
function NI4(q, K, _, z) {
    if (!u8("tengu_onyx_basin_m1k", !1)) return q;
    if (!_) return q;
    if (q.is_error) return q;
    let Y = q.content;
    if (typeof Y !== "string") return q;
    let A = Y.length;
    if (A <= I0z) return q;
    let O = JS8(K, z);
    if (A + x0z > O) return q;
    let w = m0z(Y),
        $ = _.seen.get(w);
    if ($) {
        let H = `<identical to result [${$.shortId}] from your ${$.toolName} call earlier — refer to that output>`;
        return d("tengu_tool_result_dedup", {
            hit: !0,
            toolName: PK(K),
            originalBytes: A,
            savedBytes: A - H.length
        }), {
            ...q,
            content: H
        }
    }
    _.counter += 1;
    let j = `r${_.counter}`;
    return _.seen.set(w, {
        shortId: j,
        toolName: K
    }), d("tengu_tool_result_dedup", {
        hit: !1,
        toolName: PK(K),
        originalBytes: A,
        savedBytes: 0
    }), {
        ...q,
        content: `${Y}
[result-id: ${j}]`
    }
}
// @from(Ln 266526, Col 0)
function m0z(q) {
    if (typeof Bun < "u") return Bun.hash(q).toString(36);
    let K = 5381;
    for (let _ = 0; _ < q.length; _++) K = (K << 5) + K + q.charCodeAt(_) | 0;
    return (K >>> 0).toString(36)
}
// @from(Ln 266532, Col 4)
I0z = 256
// @from(Ln 266533, Col 4)
x0z = 26
// @from(Ln 266534, Col 4)
u0z
// @from(Ln 266535, Col 4)
YR6 = L(() => {
    ND();
    B1();
    C8();
    q2();
    u0z = /\[result-id: r(\d+)\]$/
})
// @from(Ln 266543, Col 0)
function Px8() {
    return {
        consecutiveDenials: 0,
        totalDenials: 0
    }
}
// @from(Ln 266550, Col 0)
function EI4(q) {
    return {
        ...q,
        consecutiveDenials: q.consecutiveDenials + 1,
        totalDenials: q.totalDenials + 1
    }
}
// @from(Ln 266558, Col 0)
function S18(q) {
    if (q.consecutiveDenials === 0) return q;
    return {
        ...q,
        consecutiveDenials: 0
    }
}
// @from(Ln 266566, Col 0)
function yI4(q) {
    return q.consecutiveDenials >= Mx8.maxConsecutive || q.totalDenials >= Mx8.maxTotal
}
// @from(Ln 266569, Col 4)
Mx8
// @from(Ln 266570, Col 4)
zr1 = L(() => {
    Mx8 = {
        maxConsecutive: 3,
        maxTotal: 20
    }
})
// @from(Ln 266580, Col 0)
function sp(q) {
    if (typeof q !== "string") return null;
    return p0z.test(q) ? q : null
}
// @from(Ln 266585, Col 0)
function tp(q) {
    let K = B0z(8).toString("hex");
    return q ? `a${q}-${K}` : `a${K}`
}
// @from(Ln 266589, Col 4)
p0z
// @from(Ln 266590, Col 4)
dc = L(() => {
    p0z = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
})
// @from(Ln 266597, Col 0)
function RI4(q) {
    hI4 = q
}
// @from(Ln 266601, Col 0)
function XJ6() {
    return hI4
}
// @from(Ln 266605, Col 0)
function nR(q) {
    return {
        systemPrompt: q.systemPrompt,
        userContext: q.userContext,
        systemContext: q.systemContext,
        toolUseContext: q.toolUseContext,
        forkContextMessages: q.messages
    }
}
// @from(Ln 266615, Col 0)
function g0z(q, K) {
    if (K.length === 0) return q;
    return () => {
        let _ = q();
        return {
            ..._,
            toolPermissionContext: {
                ..._.toolPermissionContext,
                alwaysAllowRules: {
                    ..._.toolPermissionContext.alwaysAllowRules,
                    command: F4([..._.toolPermissionContext.alwaysAllowRules.command || [], ...K])
                }
            }
        }
    }
}
// @from(Ln 266631, Col 0)
async function Wx8(q, K, _) {
    let Y = (await q.getPromptForCommand(K, _)).map((J) => J.type === "text" ? J.text : "").join(`
`),
        A = iR(q.allowedTools ?? []),
        O = g0z(_.getAppState, A),
        w = q.agent ?? "general-purpose",
        $ = _.options.agentDefinitions.activeAgents,
        j = $.find((J) => J.agentType === w) ?? $.find((J) => J.agentType === "general-purpose") ?? $[0];
    if (!j) throw Error("No agent available for forked execution");
    let H = [t8({
        content: Y
    })];
    return {
        skillContent: Y,
        modifiedGetAppState: O,
        baseAgent: j,
        promptMessages: H
    }
}
// @from(Ln 266651, Col 0)
function Dx8(q, K = "Execution completed") {
    let _ = fM(q);
    if (!_) return K;
    return s5(_.message.content, `
`) || K
}
// @from(Ln 266658, Col 0)
function C18(q, K) {
    let _ = K?.abortController ?? (K?.shareAbortController ? q.abortController : tv(q.abortController)),
        z = K?.getAppState ? K.getAppState : K?.shareAbortController ? q.getAppState : () => {
            let Y = q.getAppState();
            if (Y.toolPermissionContext.shouldAvoidPermissionPrompts) return Y;
            return {
                ...Y,
                toolPermissionContext: {
                    ...Y.toolPermissionContext,
                    shouldAvoidPermissionPrompts: !0
                }
            }
        };
    return {
        readFileState: Cs(K?.readFileState ?? q.readFileState),
        nestedMemoryAttachmentTriggers: new Set,
        loadedNestedMemoryPaths: new Set,
        sessionEnvVars: q.sessionEnvVars,
        tmuxSocket: q.tmuxSocket,
        dynamicSkillDirTriggers: new Set,
        discoveredSkillNames: new Set,
        discoveredRemoteSkills: q.discoveredRemoteSkills ?? new Map,
        memorySelector: dK6(),
        bashRerunAliases: {
            map: new Map,
            nextId: 1
        },
        toolDecisions: void 0,
        contentReplacementState: K?.contentReplacementState ?? (q.contentReplacementState ? xZ4(q.contentReplacementState) : void 0),
        resultDedupState: VI4(),
        abortController: _,
        getAppState: z,
        setAppState: K?.shareSetAppState ? q.setAppState : () => {},
        setToolPermissionContext: K?.shareSetAppState ? q.setToolPermissionContext : () => {},
        taskRegistry: q.taskRegistry,
        sessionHooksRegistry: q.sessionHooksRegistry,
        setClassifierApprovals: q.setClassifierApprovals,
        setReplContext: q.setReplContext,
        setWebBrowserSlice: q.setWebBrowserSlice,
        abortSpeculation: q.abortSpeculation,
        agentLifecycle: q.agentLifecycle,
        teammateColors: q.teammateColors,
        setComputerUseMcpState: K?.shareSetAppState ? q.setComputerUseMcpState : void 0,
        localDenialTracking: K?.shareSetAppState ? q.localDenialTracking : Px8(),
        setInProgressToolUseIDs: () => {},
        addResponseLength: K?.shareSetResponseLength ? q.addResponseLength : () => {},
        resetResponseLength: K?.shareSetResponseLength ? q.resetResponseLength : () => {},
        pushApiMetricsEntry: K?.shareSetResponseLength ? q.pushApiMetricsEntry : void 0,
        getFileHistoryState: () => {
            return
        },
        applyFileHistoryOp: () => {},
        applyAttributionOp: q.applyAttributionOp,
        addNotification: void 0,
        setToolJSX: void 0,
        setStreamMode: void 0,
        setSDKStatus: void 0,
        openMessageSelector: void 0,
        options: K?.options ?? q.options,
        messages: K?.messages ?? q.messages,
        turnStartIndex: 0,
        agentId: K?.agentId ?? tp(),
        agentType: K?.agentType,
        queryTracking: {
            chainId: F0z(),
            depth: (q.queryTracking?.depth ?? -1) + 1
        },
        fileReadingLimits: q.fileReadingLimits,
        userModified: q.userModified,
        criticalSystemReminder_EXPERIMENTAL: K?.criticalSystemReminder_EXPERIMENTAL,
        requireCanUseTool: K?.requireCanUseTool
    }
}
// @from(Ln 266731, Col 0)
async function rP({
    promptMessages: q,
    cacheSafeParams: K,
    canUseTool: _,
    querySource: z,
    forkLabel: Y,
    overrides: A,
    maxOutputTokens: O,
    maxTurns: w,
    onMessage: $,
    skipTranscript: j,
    skipCacheWrite: H
}) {
    let J = Date.now(),
        X = [],
        M = {
            ...iP
        },
        {
            systemPrompt: P,
            userContext: W,
            systemContext: D,
            toolUseContext: Z,
            forkContextMessages: G
        } = K,
        f = C18(Z, A),
        v = [...G, ...q],
        V = j ? void 0 : tp(Y),
        k = null;
    if (V) await cc(q, V).catch((C) => E(`Forked agent [${Y}] failed to record initial transcript: ${C}`)), k = q.at(-1)?.uuid ?? null;
    let N = w ?? LI4,
        R = 0;
    try {
        for await (let C of yy({
            messages: v,
            systemPrompt: P,
            userContext: W,
            systemContext: D,
            canUseTool: _,
            toolUseContext: f,
            querySource: z,
            maxOutputTokensOverride: O,
            maxTurns: N,
            skipCacheWrite: H
        })) {
            if (C.type === "stream_event") {
                if ("event" in C && C.event?.type === "message_delta" && C.event.usage) {
                    let B = t56({
                        ...iP
                    }, C.event.usage);
                    M = Zx8(M, B)
                }
                continue
            }
            if (C.type === "stream_request_start") continue;
            if (C.type === "assistant") R++;
            E(`Forked agent [${Y}] received message: type=${C.type}`), X.push(C), $?.(C);
            let x = C;
            if (V && (x.type === "assistant" || x.type === "user" || x.type === "progress")) {
                if (await cc([x], V, k).catch((B) => E(`Forked agent [${Y}] failed to record transcript: ${B}`)), x.type !== "progress") k = x.uuid
            }
        }
    } finally {
        f.readFileState.clear(), v.length = 0
    }
    E(`Forked agent [${Y}] finished: ${X.length} messages, types=[${X.map((C)=>C.type).join(", ")}], totalUsage: input=${M.input_tokens} output=${M.output_tokens} cacheRead=${M.cache_read_input_tokens} cacheCreate=${M.cache_creation_input_tokens}`);
    let h = Date.now() - J;
    if (w === void 0 && R >= LI4) d("tengu_forked_agent_default_turns_exceeded", {
        forkLabel: Y,
        querySource: z,
        turnCount: R
    });
    return U0z({
        forkLabel: Y,
        querySource: z,
        durationMs: h,
        messageCount: X.length,
        totalUsage: M,
        queryTracking: Z.queryTracking
    }), {
        messages: X,
        totalUsage: M
    }
}
// @from(Ln 266816, Col 0)
function U0z({
    forkLabel: q,
    querySource: K,
    durationMs: _,
    messageCount: z,
    totalUsage: Y,
    queryTracking: A
}) {
    let O = Y.input_tokens + Y.cache_creation_input_tokens + Y.cache_read_input_tokens,
        w = O > 0 ? Y.cache_read_input_tokens / O : 0;
    d("tengu_fork_agent_query", {
        forkLabel: q,
        querySource: K,
        durationMs: _,
        messageCount: z,
        inputTokens: Y.input_tokens,
        outputTokens: Y.output_tokens,
        cacheReadInputTokens: Y.cache_read_input_tokens,
        cacheCreationInputTokens: Y.cache_creation_input_tokens,
        serviceTier: Y.service_tier,
        cacheCreationEphemeral1hTokens: Y.cache_creation.ephemeral_1h_input_tokens,
        cacheCreationEphemeral5mTokens: Y.cache_creation.ephemeral_5m_input_tokens,
        cacheHitRate: w,
        ...A && {
            queryChainId: A.chainId,
            queryDepth: A.depth
        }
    })
}
// @from(Ln 266845, Col 4)
LI4 = 50
// @from(Ln 266846, Col 4)
hI4 = null
// @from(Ln 266847, Col 4)
lf = L(() => {
    s56();
    C8();
    O2();
    R18();
    YR6();
    x$();
    K8();
    FP();
    _7();
    zr1();
    vX();
    g4();
    ND();
    dc()
})
// @from(Ln 266864, Col 0)
function AR6(q) {
    let K = [],
        _ = [],
        z;
    for (let Y of q) {
        if (Y.type === "assistant" && Y.message.id !== z && _.length > 0) K.push(_), _ = [Y];
        else _.push(Y);
        if (Y.type === "assistant") z = Y.message.id
    }
    if (_.length > 0) K.push(_);
    return K
}
// @from(Ln 266877, Col 0)
function CI4(q, K = "from") {
    let z = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

` + (K === "up_to" ? `Your task is to create a detailed summary of this conversation. This summary will be placed at the start of a continuing session; newer messages that build on this context will follow after your summary (you do not see them here). Summarize thoroughly so that someone reading only your summary and then the newer messages can fully understand what happened and continue the work.

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

1. Primary Request and Intent: Capture the user's explicit requests and intents in detail
2. Key Technical Concepts: List important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List errors encountered and how they were fixed.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results.
7. Pending Tasks: Outline any pending tasks.
8. Work Completed: Describe what was accomplished by the end of this portion.
9. Context for Continuing Work: Summarize any context, decisions, or state that would be needed to understand and continue the work in subsequent messages.

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

8. Work Completed:
   [Description of what was accomplished]

9. Context for Continuing Work:
   [Key context, decisions, or state needed to continue the work]

</summary>
</example>

Please provide your summary following this structure, ensuring precision and thoroughness in your response.
` : Q0z);
    if (q && q.trim() !== "") z += `

Additional Instructions:
${q}`;
    return z += SI4, z
}
// @from(Ln 266965, Col 0)
function fx8(q) {
    let K = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

` + `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
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
7. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
8. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
9. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
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
    if (q && q.trim() !== "") K += `

Additional Instructions:
${q}`;
    return K += SI4, K
}
// @from(Ln 267076, Col 0)
function d0z(q) {
    let K = q;
    K = K.replace(/<analysis>[\s\S]*?<\/analysis>/, "");
    let _ = K.match(/<summary>([\s\S]*?)<\/summary>/);
    if (_) {
        let z = _[1] || "";
        K = K.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${z.trim()}`)
    }
    return K = K.replace(/\n\n+/g, `

`), K.trim()
}
// @from(Ln 267090, Col 0)
function b18(q, K, _, z, Y) {
    let O = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${d0z(q)}`;
    if (_) O += `

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${_}`;
    if (z) O += `

Recent messages are preserved verbatim.`;
    if (Y) O += `

Your REPL VM state has been cleared as part of this compaction. Variables defined in REPL calls before this point are no longer accessible — redefine any you still need.`;
    if (K) return `${O}
Continue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
    return O
}
// @from(Ln 267107, Col 4)
Q0z
// @from(Ln 267107, Col 9)
SI4
// @from(Ln 267108, Col 4)
Yr1 = L(() => {
    Q0z = `Your task is to create a detailed summary of the RECENT portion of the conversation — the messages that follow earlier retained context. The earlier messages are being kept intact and do NOT need to be summarized. Focus your summary on what was discussed, learned, and accomplished in the recent messages only.

${`Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

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
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.`}

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
`, SI4 = `

REMINDER: Do NOT call any tools. Respond with plain text only — ` + "an <analysis> block followed by a <summary> block. Tool calls will be rejected and you will fail the task."
})
// @from(Ln 267185, Col 0)
async function c0z(q, K, _, z) {
    let Y = fx8(_),
        A = t8({
            content: Y
        }),
        O;
    try {
        O = await rP({
            promptMessages: [A],
            cacheSafeParams: {
                ...K,
                forkContextMessages: z ? Ar1(Gx8(q)) : Gx8(q)
            },
            canUseTool: Or1(),
            querySource: "compact",
            forkLabel: "reactive-compact",
            maxTurns: 1,
            maxOutputTokens: Math.min(Po6, lc(K.toolUseContext.options.mainLoopModel)),
            skipTranscript: !0,
            skipCacheWrite: !0
        })
    } catch (J) {
        return j6(J), {
            ok: !1,
            reason: "error",
            detail: b6(J)
        }
    }
    if (K.toolUseContext.abortController.signal.aborted) return {
        ok: !1,
        reason: "aborted"
    };
    let w = fM(O.messages);
    if (!w) return j6(Error(`Reactive compact: no assistant message in summarization response (${O.messages.length} messages, types: ${O.messages.map((J)=>J.type).join(", ")})`)), {
        ok: !1,
        reason: "error",
        detail: "no assistant message in summarization response"
    };
    if (vj6(w)) return {
        ok: !1,
        reason: "prompt_too_long",
        tokenGap: Rh8(w)
    };
    if (Sh8(w)) return {
        ok: !1,
        reason: "media_too_large"
    };
    if (w.isApiErrorMessage) {
        let J = MJ6(w) ?? "API error";
        return j6(Error(`Reactive compact: summarization returned API error: ${J}`)), {
            ok: !1,
            reason: "error",
            detail: J
        }
    }
    let $ = MJ6(w);
    if (!$) return j6(Error("Reactive compact: empty summary text in summarization response")), {
        ok: !1,
        reason: "error",
        detail: "summarization produced empty response"
    };
    let j = bY(),
        H = JJ() && Oa6(K.toolUseContext.getAppState().replContexts, K.toolUseContext.agentId);
    return {
        ok: !0,
        summaryText: $,
        totalUsage: O.totalUsage,
        messages: [t8({
            content: b18($, !0, j, void 0, H),
            isCompactSummary: !0,
            isVisibleInTranscriptOnly: !0
        })]
    }
}
// @from(Ln 267260, Col 0)
function l0z(q, K, _) {
    let z = 0,
        Y = 0;
    for (let A = K - 1; A >= 0; A--)
        if (z += q[A], Y++, z >= _) break;
    if (Y >= K - 1) return Math.max(1, Math.floor(K / 2));
    return Y
}
// @from(Ln 267269, Col 0)
function n0z(q, K, _) {
    if (q === void 0) return {
        mode: "gap_unparseable",
        step: 1
    };
    return {
        mode: "gap_guided",
        step: l0z(K, _, q)
    }
}
// @from(Ln 267279, Col 0)
async function bI4(q, K, _) {
    let z = H2(q).filter((X) => X.type !== "progress"),
        Y = AR6(z),
        A = Y.length;
    if (A < 2) return E("Reactive compact: fewer than 2 groups, nothing to compact", {
        level: "info"
    }), {
        ok: !1,
        reason: "too_few_groups",
        attempts: 0,
        totalGroups: A
    };
    let O = K.toolUseContext.abortController.signal,
        w = 1,
        $ = 0,
        j = void 0,
        H, J = !1;
    while (w < A) {
        if (O.aborted) return {
            ok: !1,
            reason: "aborted",
            attempts: $,
            totalGroups: A
        };
        $++;
        let X = A - w,
            M = Y.slice(0, X),
            P = Y.slice(X),
            W = M.flat();
        if (!W.some((G) => G.type === "assistant")) return E("Reactive compact: no assistant messages in summarize set, bailing", {
            level: "info"
        }), {
            ok: !1,
            reason: $ > 1 ? "exhausted" : "too_few_groups",
            attempts: $ - 1,
            totalGroups: A
        };
        d("tengu_reactive_compact_attempt", {
            attempt: $,
            groupsToSummarize: M.length,
            groupsToPreserve: P.length,
            messagesToSummarize: W.length,
            strippedMedia: J,
            stepMode: j?.mode,
            stepSize: j?.step,
            tokenGap: j?.tokenGap
        });
        let D = await c0z(W, K, _?.customInstructions, J);
        if (D.ok) return {
            ok: !0,
            result: {
                summaryMessages: D.messages,
                summaryText: D.summaryText,
                messagesToPreserve: P.flat(),
                attempt: $,
                totalUsage: D.totalUsage,
                groupsPreserved: w,
                totalGroups: A
            }
        };
        switch (D.reason) {
            case "aborted":
                return {
                    ok: !1, reason: "aborted", attempts: $, totalGroups: A
                };
            case "error":
                return {
                    ok: !1, reason: "error", attempts: $, totalGroups: A, detail: D.detail
                };
            case "media_too_large":
                if (!J) {
                    J = !0, $--, E("Reactive compact: summarize hit media-size error, retrying stripped", {
                        level: "info"
                    });
                    continue
                }
                return {
                    ok: !1, reason: "media_unstrippable", attempts: $, totalGroups: A
                };
            case "prompt_too_long":
                break
        }
        H ??= Y.map((G) => qT(G));
        let Z = n0z(D.tokenGap, H, X);
        j = {
            ...Z,
            tokenGap: D.tokenGap
        }, w += Z.step, E(`Reactive compact: attempt ${$} hit prompt-too-long (gap=${D.tokenGap??"?"} → ${Z.mode} step ${Z.step}), next preserves ${w}/${A}`, {
            level: "info"
        })
    }
    return {
        ok: !1,
        reason: "exhausted",
        attempts: $,
        totalGroups: A
    }
}
// @from(Ln 267377, Col 4)
II4 = L(() => {
    EP();
    AJ();
    K8();
    m8();
    lf();
    U8();
    _7();
    g4();
    C8();
    O2();
    rv();
    wc();
    ep();
    Yr1()
})
// @from(Ln 267394, Col 0)
function XT(q, K) {
    return {
        name: q,
        compute: K,
        cacheBreak: !1
    }
}
// @from(Ln 267401, Col 0)
async function xI4(q) {
    let K = d81();
    return Promise.all(q.map(async (_) => {
        if (!_.cacheBreak && K.has(_.name)) return K.get(_.name) ?? null;
        let z = await _.compute();
        return c81(_.name, z), z
    }))
}
// @from(Ln 267410, Col 0)
function nc() {
    l81(), e81()
}
// @from(Ln 267413, Col 4)
OR6 = L(() => {
    y8()
})
// @from(Ln 267417, Col 0)
function qF(q) {
    return (K) => q((_) => {
        let z = K(_.classifierApprovals);
        if (z === _.classifierApprovals) return _;
        return {
            ..._,
            classifierApprovals: z
        }
    })
}
// @from(Ln 267428, Col 0)
function uI4(q, K) {
    return
}
// @from(Ln 267432, Col 0)
function mI4(q, K, _) {
    q((z) => {
        let Y = z.approvals.get(K);
        if (Y?.classifier === "auto-mode" && Y.reason === _) return z;
        let A = new Map(z.approvals);
        return A.set(K, {
            classifier: "auto-mode",
            reason: _
        }), {
            ...z,
            approvals: A
        }
    })
}
// @from(Ln 267447, Col 0)
function BI4(q, K) {
    let _ = q.classifierApprovals.approvals.get(K);
    if (!_ || _.classifier !== "auto-mode") return;
    return _.reason
}
// @from(Ln 267453, Col 0)
function pI4(q, K) {
    q((_) => {
        if (_.checking.has(K)) return _;
        let z = new Set(_.checking);
        return z.add(K), {
            ..._,
            checking: z
        }
    })
}
// @from(Ln 267464, Col 0)
function _t(q, K) {
    q((_) => {
        if (!_.checking.has(K)) return _;
        let z = new Set(_.checking);
        return z.delete(K), {
            ..._,
            checking: z
        }
    })
}
// @from(Ln 267475, Col 0)
function FI4(q, K) {
    q((_) => {
        if (!_.approvals.has(K)) return _;
        let z = new Map(_.approvals);
        return z.delete(K), {
            ..._,
            approvals: z
        }
    })
}
// @from(Ln 267486, Col 0)
function gI4(q) {
    if (!q) return;
    q((K) => {
        if (K.approvals.size === 0 && K.checking.size === 0) return K;
        return {
            approvals: new Map,
            checking: new Set
        }
    })
}
// @from(Ln 267496, Col 4)
vx8 = () => {}
// @from(Ln 267497, Col 4)
QI4 = `# Autonomous loop check

You're being invoked on a timer while the user is away or occupied. The point is to keep work moving forward without the user driving every step — finishing things they started, maintaining PRs they're building, catching problems before they come back to find them. You're a steward, not an initiator. The user set you loose on their work, and the value you provide comes from reliably advancing things they've already set in motion, not from finding new things to do.

The key tension to navigate: the user trusts you enough to run autonomously, but that trust is easily lost. Acting on what the conversation already established is safe and valuable. Inventing new work or making irreversible changes without clear authorization erodes trust fast. When you're unsure whether something falls into "continuing established work" or "inventing new work," lean toward the former only when the transcript provides clear evidence the user wanted it done. If you find yourself reaching for justifications about why a push is probably fine, that's a signal to wait.

## What to act on

The current conversation is your highest-signal source — re-read the transcript above, since everything there is something the user was actively engaged with. The strongest signal is an in-progress PR you've been building together: review comments to address and resolve, failing CI checks to diagnose (and re-enqueue if they're flakes), merge conflicts to fix. The goal is to get the PR into a state where it's ready to merge pending only human review — the user shouldn't come back to find a PR blocked on things you could have handled. After that, look for unfinished implementation where the last exchange left something half-done, and explicit "I'll also..." or "next I'll..." commitments the conversation made and didn't honor. Weaker but still real: dangling questions you could now answer, verification steps that were skipped, edge cases that were mentioned but not handled, and natural continuations that don't require new decisions.

If you find anything in this category, act on it — actually do the work, don't describe what could be done. Run the tests, don't say "you could run the tests." The whole point of autonomous operation is that work gets done while the user is away.

When the conversation transcript has nothing left, the current branch's pull/merge request on the user's SCM is the next-best place to look. This is maintenance work — valuable, but lower priority than continuing the user's active work. Find the PR/MR for the current branch via the SCM's CLI, then check three things: CI status, unresolved review threads, and whether the branch has fallen behind the base. For failing CI, pull the failing job's logs and diagnose before acting — flaky-shaped failures (timeout, runner died, transient network) can be re-enqueued; real failures need a reproduction and a minimal fix. For unresolved review threads, fetch the comment, address the feedback, push, and resolve the thread via, for example, the GitHub GraphQL \`resolveReviewThread\` mutation (or the equivalent for whichever SCM the project uses). Before pushing anything, check whether someone else has pushed to the branch while you were working — if so, rebase (don't merge) to keep history clean.

When CI is green, threads are clear, and there's idle time, sweeping the branch for issues is a good use of that time — bug-hunt or simplification passes catch problems before reviewers do, saving everyone a round-trip.

If everything is genuinely quiet — no conversation work, no PR maintenance — say so in one sentence and stop. No summary of what you checked, no list of what you might do later. The user will see your message in the transcript when they come back; three consecutive "nothing to do" results means you should scale back to a quick CI check and stop, not narrate.

## Repeated invocations

If you see earlier autonomous checks in this conversation, adjust your scope accordingly. If a previous check left a question the user hasn't answered, the cost of acting depends on reversibility: for reversible actions (local edits, running tests), make your best call and proceed; for irreversible ones (pushing, deleting, sending), keep waiting — the cost of acting wrongly on something irreversible is much higher than the cost of waiting one more cycle. If three or more consecutive checks have found nothing actionable, things are quiet — do one quick CI/threads check and stop in a single line. Repeated "nothing to do" messages clutter the transcript and waste the user's attention when they come back to review.

Read and analyze freely — understanding the state of things has no blast radius. Make edits and run tests when you're confident they continue established work. Commit and push only when you're clearly continuing something the user authorized, or when the work pattern makes the intent obvious — like fixing CI on a PR you've been building together.
`
// @from(Ln 267521, Col 4)
UI4 = () => {}
// @from(Ln 267523, Col 0)
function I18() {
    return u8("tengu_kairos_push_notifications", !1)
}
// @from(Ln 267527, Col 0)
function dI4() {
    return u8("tengu_kairos_input_needed_push", !1)
}
// @from(Ln 267531, Col 0)
function e56() {
    return I18() && H8().agentPushNotifEnabled === !0
}
// @from(Ln 267534, Col 4)
ic = "PushNotification"
// @from(Ln 267535, Col 4)
cI4 = "Send a notification to the user via their terminal and, when Remote Control is connected, also push to their mobile device"
// @from(Ln 267536, Col 4)
lI4 = `This tool sends a desktop notification in the user's terminal. If Remote Control is connected, it also pushes to their phone. Either way, it pulls their attention from whatever they're doing — a meeting, another task, dinner — to this session. That's the cost. The benefit is they learn something now that they'd want to know now: a long task finished while they were away, a build is ready, you've hit something that needs their decision before you can continue.

Because a notification they didn't need is annoying in a way that accumulates, err toward not sending one. Don't notify for routine progress, or to announce you've answered something they asked seconds ago and are clearly still watching, or when a quick task completes. Notify when there's a real chance they've walked away and there's something worth coming back for — or when they've explicitly asked you to notify them.

Keep the message under 200 characters, one line, no markdown. Lead with what they'd act on — "build failed: 2 auth tests" tells them more than "task done" and more than a status dump.

If the result says the push wasn't sent, that's expected — no action needed.`
// @from(Ln 267543, Col 4)
q36 = L(() => {
    B1();
    h1()
})
// @from(Ln 267548, Col 0)
function wr1() {
    return e56() ? `

When an event lands that the user would want to act on now — an error appeared, the status they were waiting on flipped — send a ${ic}. Not every event is worth a push; the ones that change what they'd do next are.` : ""
}
// @from(Ln 267554, Col 0)
function KF() {
    return u8("tengu_amber_sentinel", !1)
}
// @from(Ln 267557, Col 4)
_0 = "Monitor"
// @from(Ln 267558, Col 4)
$r1 = `Start a background monitor that streams events from a long-running script. Each stdout line is an event — you keep working and notifications arrive in the chat. Events arrive on their own schedule and are not replies from the user, even if one lands while you're waiting for the user to answer a question.

Monitor is for the **streaming** case: "tell me every time X happens." For one-shot "wait until X is done," use Bash with run_in_background instead — you'll get a completion notification when it exits.

Your script's stdout is the event stream. Each line becomes a notification. Exit ends the watch.

  # Each matching log line is an event
  tail -f /var/log/app.log | grep --line-buffered "ERROR"

  # Each file change is an event
  inotifywait -m --format '%e %f' /watched/dir

  # Poll GitHub for new PR comments and emit one line per new comment
  last=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  while true; do
    now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    gh api "repos/owner/repo/issues/123/comments?since=$last" --jq '.[] | "\\(.user.login): \\(.body)"'
    last=$now; sleep 30
  done

  # Node script that emits events as they arrive (e.g. WebSocket listener)
  node watch-for-events.js

**Script quality:**
- Always use \`grep --line-buffered\` in pipes — without it, pipe buffering delays events by minutes.
- In poll loops, handle transient failures (\`curl ... || true\`) — one failed request shouldn't kill the monitor.
- Poll intervals: 30s+ for remote APIs (rate limits), 0.5-1s for local checks.
- Write a specific \`description\` — it appears in every notification ("errors in deploy.log" not "watching logs").
- Only stdout is the event stream. Stderr goes to the output file (readable via Read) but does not trigger notifications — for a command you run directly (e.g. \`python train.py 2>&1 | grep --line-buffered ...\`), merge stderr with \`2>&1\` so its failures reach your filter. (No effect on \`tail -f\` of an existing log — that file only contains what its writer redirected.)

**Coverage — silence is not success.** When watching a job or process for an outcome, your filter must match every terminal state, not just the happy path. A monitor that greps only for the success marker stays silent through a crashloop, a hung process, or an unexpected exit — and silence looks identical to "still running." Before arming, ask: *if this process crashed right now, would my filter emit anything?* If not, widen it.

  # Wrong — silent on crash, hang, or any non-success exit
  tail -f run.log | grep --line-buffered "elapsed_steps="

  # Right — one alternation covering progress + the failure signatures you'd act on
  tail -f run.log | grep -E --line-buffered "elapsed_steps=|Traceback|Error|FAILED|assert|Killed|OOM"

For poll loops checking job state, emit on every terminal status (\`succeeded|failed|cancelled|timeout\`), not just success. If you cannot confidently enumerate the failure signatures, broaden the grep alternation rather than narrow it — some extra noise is better than missing a crashloop.

**Output volume**: Every stdout line is a conversation message, so the filter should be selective — but selective means "the lines you'd act on," not "only good news." Never pipe raw logs; use \`grep --line-buffered\`, \`awk\`, or a wrapper that emits exactly the success and failure signals you care about. Monitors that produce too many events are automatically stopped; restart with a tighter filter if this happens.

Stdout lines within 200ms are batched into a single notification, so multiline output from a single event groups naturally.

The script runs in the same shell environment as Bash. Exit ends the watch (exit code is reported). Timeout → killed. Set \`persistent: true\` for session-length watches (PR monitoring, log tails) — the monitor runs until you call TaskStop or the session ends. Use TaskStop to cancel early.`
// @from(Ln 267603, Col 4)
zt = L(() => {
    B1();
    q36()
})
// @from(Ln 267607, Col 4)
jR6 = {}
// @from(Ln 267629, Col 0)
function m18() {
    return e56() ? `

Use ${ic} when the loop can't move further without the user, or when something landed that they'd want to act on now: newly blocked on a decision you won't make alone, third straight tick with nothing to do, you're ending the loop, or a major update arrived (CI went red, a review changes the plan). Progress you made yourself isn't a trigger — the transcript covers that. One ping per state, not per tick.` : ""
}
// @from(Ln 267635, Col 0)
function iI4() {
    return `# Autonomous loop tick

Run the autonomous check using the loop instructions established earlier in this conversation. If you cannot find them, treat this as a no-op tick. The recurring cron will fire the next tick automatically — do not call ${fH} from this tick.${m18()}`
}
// @from(Ln 267641, Col 0)
function a0z() {
    return `# Autonomous loop tick (dynamic pacing)

Run the autonomous check using the loop instructions established earlier in this conversation. If you cannot find them, treat this as a no-op tick.

You scheduled this tick via the ${fH} tool (not a recurring cron). To keep the loop alive, call ${fH} again at the end of this turn with \`prompt\` set to the literal sentinel \`${ys}\` — otherwise the loop ends after this tick.${jr1}${m18()}`
}
// @from(Ln 267649, Col 0)
function Hr1() {
    return u8("tengu_kairos_loop_prompt", !1)
}
// @from(Ln 267653, Col 0)
function Jr1(q) {
    return q === Fj6 || q === ys
}
// @from(Ln 267657, Col 0)
function rI4(q) {
    if (!Jr1(q)) return null;
    if (!Hr1()) return null;
    let K = q === ys ? a0z() : iI4();
    if (u18 || $R6 !== null) return K;
    return u18 = !0, `${x18}

---

${K}`
}
// @from(Ln 267669, Col 0)
function s0z() {
    return `# /loop tick — loop.md tasks

Work the tasks from the loop.md contents established earlier in this conversation. If you cannot find them, treat this as a no-op tick. The recurring cron will fire the next tick automatically — do not call ${fH} from this tick.${m18()}`
}
// @from(Ln 267675, Col 0)
function t0z() {
    return `# /loop tick — loop.md tasks (dynamic pacing)

Work the tasks from the loop.md contents established earlier in this conversation. If you cannot find them, treat this as a no-op tick.

You scheduled this tick via the ${fH} tool (not a recurring cron). To keep the loop alive, call ${fH} again at the end of this turn with \`prompt\` set to the literal sentinel \`${B18}\` — otherwise the loop ends after this tick.${jr1}${m18()}`
}
// @from(Ln 267683, Col 0)
function e0z() {
    return `# /loop tick — loop.md absent (dynamic pacing)

loop.md is not currently present. Run the autonomous check using the loop instructions established earlier in this conversation.

You scheduled this tick via the ${fH} tool (not a recurring cron). To keep the loop alive — and to pick up loop.md if it is recreated — call ${fH} again at the end of this turn with \`prompt\` set to the literal sentinel \`${B18}\` — otherwise the loop ends after this tick.${jr1}${m18()}`
}
// @from(Ln 267691, Col 0)
function qDz(q) {
    if (q.length <= Tx8) return q;
    let K = q.lastIndexOf(`
`, Tx8);
    return `${q.slice(0,K>0?K:Tx8)}

> WARNING: loop.md was truncated to ${Tx8} bytes. Keep the task list concise.`
}
// @from(Ln 267700, Col 0)
function aI4() {
    let q = [nI4(c9(), ".claude", "loop.md"), nI4(A7(), "loop.md")];
    for (let K of q) {
        let _;
        try {
            _ = o0z(K, "utf-8")
        } catch (Y) {
            if (D5(Y) || Q1(Y) === "EISDIR") continue;
            throw Y
        }
        let z = _.trim();
        if (z.length === 0) continue;
        return {
            path: K,
            content: qDz(z)
        }
    }
    return null
}
// @from(Ln 267720, Col 0)
function Xr1(q) {
    return q === oI4 || q === B18
}
// @from(Ln 267724, Col 0)
function sI4(q) {
    if (!Xr1(q)) return null;
    if (!Hr1()) return null;
    let K = q === B18,
        _ = aI4();
    if (_) {
        let Y = K ? t0z() : s0z();
        if ($R6 === _.content) return Y;
        return $R6 = _.content, `# /loop tick — tasks from ${_.path}

The user configured a loop-tasks file. Work through the tasks defined below; these are the instructions for this tick and every subsequent tick (the reminder on later fires refers back to this message).

---

${_.content}

---

${Y}`
    }
    let z = K ? e0z() : iI4();
    if ($R6 === x18 || u18) return z;
    return $R6 = x18, u18 = !0, `${x18}

---

${z}`
}
// @from(Ln 267753, Col 0)
function KDz(q) {
    return Jr1(q) || Xr1(q)
}
// @from(Ln 267757, Col 0)
function _Dz(q) {
    return rI4(q) ?? sI4(q) ?? q
}
// @from(Ln 267761, Col 0)
function zDz() {
    u18 = !1, $R6 = null
}
// @from(Ln 267764, Col 4)
x18
// @from(Ln 267764, Col 9)
jr1
// @from(Ln 267764, Col 14)
u18 = !1
// @from(Ln 267765, Col 4)
$R6 = null
// @from(Ln 267766, Col 4)
oI4 = "<<loop.md>>"
// @from(Ln 267767, Col 4)
B18 = "<<loop.md-dynamic>>"
// @from(Ln 267768, Col 4)
Tx8 = 25000
// @from(Ln 267769, Col 4)
HR6 = L(() => {
    y8();
    B1();
    UI4();
    zt();
    q36();
    fe6();
    Q8();
    m8();
    x18 = QI4;
    jr1 = `

If a ${_0} is armed (check ${xD}), keep \`delaySeconds\` at 1200–1800s — the ${_0} is the wake signal and this is only the fallback heartbeat. If you were woken by a \`<task-notification>\`, handle the event before rescheduling. To stop the loop, also ${RV} the monitor (use ${xD} to find its task ID if no longer in context).`
})
// @from(Ln 267784, Col 0)
function _F(q, K, _) {
    if (_) Xx8(_);
    let z = q === void 0 || q.startsWith("repl_main_thread") || q === "sdk";
    if (SR(), z) $2.cache.clear?.(), Ue6("compact");
    if (nc(), gI4(K ? qF(K) : void 0), Vx8(), KI4(), z) YDz.resetAutonomousLoopDelivered();
    Pr1()
}
// @from(Ln 267791, Col 4)
YDz
// @from(Ln 267792, Col 4)
JR6 = L(() => {
    OR6();
    hk();
    MT();
    PM();
    g4();
    h18();
    YR6();
    $y();
    YDz = (HR6(), B7(jR6))
})
// @from(Ln 267804, Col 0)
function bx() {
    if (I7()) return !1;
    return u8("tengu_cobalt_raccoon", !1)
}
// @from(Ln 267809, Col 0)
function tI4(q) {
    return q?.type === "assistant" && vj6(q)
}
// @from(Ln 267813, Col 0)
function Wr1(q) {
    return q?.type === "assistant" && Sh8(q)
}
// @from(Ln 267816, Col 0)
async function eI4(q) {
    let {
        hasAttempted: K,
        querySource: _,
        aborted: z,
        messages: Y,
        cacheSafeParams: A
    } = q;
    if (!(!K && _ !== "compact" && _ !== "session_memory" && z0() && !z && bx())) return null;
    let {
        toolUseContext: w
    } = A;
    d("tengu_reactive_compact_triggered", {});
    let $ = w.getAppState();
    _R6($.toolPermissionContext, "summary"), w.onCompactProgress?.({
        type: "hooks_start",
        hookType: "pre_compact"
    }), w.setSDKStatus?.("compacting");
    let j = performance.now(),
        H = await oc({
            trigger: "auto",
            customInstructions: null
        }, w.abortController.signal).catch((W) => {
            return j6(W), {}
        });
    if (H.blockedBy) return E(`Reactive compact blocked by PreCompact hook: ${H.blockedBy}`), w.onCompactProgress?.({
        type: "compact_end"
    }), w.setSDKStatus?.(null), null;
    w.onCompactProgress?.({
        type: "compact_start"
    });
    let J = await Dr1(Y, A, {
        customInstructions: H.newCustomInstructions
    }).catch((W) => {
        return j6(W), {
            ok: !1,
            reason: "error",
            detail: b6(W)
        }
    });
    w.onCompactProgress?.({
        type: "compact_end"
    });
    let X = vJ(Y);
    if (!J.ok) {
        let W = J.reason === "error" ? J.detail ?? J.reason : J.reason;
        return aK6({
            trigger: "auto",
            success: !1,
            durationMs: performance.now() - j,
            preTokens: X,
            error: W
        }), w.setSDKStatus?.(null, {
            compactResult: "failed",
            compactError: W
        }), null
    }
    let M = J.result.boundaryMarker;
    aK6({
        trigger: "auto",
        success: !0,
        durationMs: performance.now() - j,
        preTokens: X,
        postTokens: RJ(M) ? M.compactMetadata.postTokens : void 0
    }), w.setSDKStatus?.(null, {
        compactResult: "success"
    }), bs(void 0), _F(_, w.setAppState, w.resultDedupState), nj6(), SR();
    let P = [H.userDisplayMessage, J.result.userDisplayMessage].filter(Boolean).join(`
`) || void 0;
    return {
        ...J.result,
        userDisplayMessage: P
    }
}
// @from(Ln 267890, Col 0)
async function Dr1(q, K, _) {
    let z = vJ(q),
        Y = performance.now(),
        A = await bI4(q, K, {
            customInstructions: _?.customInstructions
        });
    if (!A.ok) return d("tengu_reactive_compact_failed", {
        reason: A.reason,
        preCompactTokens: z,
        attempts: A.attempts,
        totalGroups: A.totalGroups,
        durationMs: Math.round(performance.now() - Y)
    }), {
        ok: !1,
        reason: A.reason,
        detail: A.detail
    };
    let {
        result: O
    } = A, {
        toolUseContext: w
    } = K, $ = pe6(w.readFileState);
    if (w.readFileState.clear(), w.loadedNestedMemoryPaths?.clear(), sj6(w.memorySelector), iI()) Ne6(w.options.querySource ?? "compact", w.agentId);
    GD6(), DR6();
    let j = q.at(-1)?.uuid,
        H = p18(_?.trigger ?? "auto", z, j);
    H.compactMetadata.durationMs = Math.round(performance.now() - Y);
    let J = rc(q);
    if (J.size > 0) H.compactMetadata.preCompactDiscoveredTools = [...J].sort();
    let X = O.messagesToPreserve.map(ODz),
        M = await wDz($, w, X).catch((V) => {
            return j6(V), {
                attachments: [],
                hookResults: []
            }
        });
    w.onCompactProgress?.({
        type: "hooks_start",
        hookType: "post_compact"
    });
    let P = await K36({
            trigger: _?.trigger ?? "auto",
            compactSummary: O.summaryText
        }, w.abortController.signal),
        W = Zr1(H, O.summaryMessages.at(-1).uuid, X),
        D = {
            boundaryMarker: W,
            summaryMessages: O.summaryMessages,
            messagesToKeep: X,
            attachments: M.attachments,
            hookResults: M.hookResults,
            userDisplayMessage: P.userDisplayMessage,
            preCompactTokenCount: z
        },
        Z = qT(Yt(D));
    W.compactMetadata.postTokens = Z;
    let G = (() => {
            try {
                return Kx8(qx8(q))
            } catch (V) {
                return j6(V), {}
            }
        })(),
        f = O.totalUsage,
        v = f.input_tokens + f.cache_creation_input_tokens + f.cache_read_input_tokens;
    return d("tengu_reactive_compact_succeeded", {
        attempts: O.attempt,
        groupsPreserved: O.groupsPreserved,
        totalGroups: O.totalGroups,
        preCompactTokens: z,
        postCompactTokens: Z,
        restoredAttachmentCount: M.attachments.length + M.hookResults.length,
        durationMs: Math.round(performance.now() - Y),
        compactionInputTokens: f.input_tokens,
        compactionOutputTokens: f.output_tokens,
        compactionCacheReadTokens: f.cache_read_input_tokens,
        compactionCacheCreationTokens: f.cache_creation_input_tokens,
        compactionTotalTokens: v + f.output_tokens,
        cacheHitRate: v > 0 ? f.cache_read_input_tokens / v : 0,
        ...G
    }), {
        ok: !0,
        result: D
    }
}
// @from(Ln 267976, Col 0)
function ODz(q) {
    if (q.type !== "assistant") return q;
    return {
        ...q,
        message: {
            ...q.message,
            usage: {
                ...q.message.usage,
                input_tokens: 0,
                output_tokens: 0,
                cache_creation_input_tokens: 0,
                cache_read_input_tokens: 0
            }
        }
    }
}
// @from(Ln 267992, Col 0)
async function wDz(q, K, _) {
    let [z, Y] = await Promise.all([Nx8(q, K, kx8, _), hx8(K)]), A = K.agentId, O = Ex8(A), w = await Lx8(K), $ = yx8(A), j = [...MR6(K.options.tools, K.options.mainLoopModel, _, {
        callSite: "reactive_compact"
    }), ...PR6(K, _), ...WR6(K.options.mcpClients, K.options.tools, K.options.mainLoopModel, _)].map(Y4);
    K.onCompactProgress?.({
        type: "hooks_start",
        hookType: "session_start"
    });
    let H = await lR("compact", {
        model: K.options.mainLoopModel
    });
    return {
        attachments: [...z, ...Y, ...O ? [O] : [], ...w ? [w] : [], ...$ ? [$] : [], ...j],
        hookResults: H
    }
}
// @from(Ln 268008, Col 4)
XR6 = L(() => {
    y8();
    ZM();
    Bi1();
    K8();
    m8();
    FP();
    K9();
    U8();
    _7();
    a56();
    g4();
    uf();
    kD();
    Ix();
    B1();
    C8();
    rv();
    FK6();
    Ox8();
    re6();
    wc();
    rR();
    ep();
    II4();
    ye6();
    $y();
    JR6()
})
// @from(Ln 268037, Col 4)
qx4 = 344
// @from(Ln 268038, Col 0)
async function _x4({
    tools: q,
    signal: K,
    isNonInteractiveSession: _,
    lastAssistantText: z
}) {
    if (q.length === 0) return null;
    try {
        let Y = q.map(($) => {
                let j = Kx4($.input, 300),
                    H = Kx4($.output, 300);
                return `Tool: ${$.name}
Input: ${j}
Output: ${H}`
            }).join(`

`),
            A = z ? `User's intent (from assistant's last message): ${z.slice(0,200)}

` : "";
        return (await ov({
            systemPrompt: sK([$Dz]),
            userPrompt: `${A}Tools completed:

${Y}

Label:`,
            signal: K,
            options: {
                querySource: "tool_use_summary_generation",
                enablePromptCaching: !0,
                agents: [],
                isNonInteractiveSession: _,
                hasAppendSystemPrompt: !1,
                mcpTools: []
            }
        })).message.content.filter(($) => $.type === "text").map(($) => $.type === "text" ? $.text : "").join("").trim() || null
    } catch (Y) {
        let A = r1(Y);
        return A.cause = {
            errorId: qx4
        }, j6(A), null
    }
}
// @from(Ln 268083, Col 0)
function Kx4(q, K) {
    try {
        let _ = I6(q);
        if (_.length <= K) return _;
        return _.slice(0, K - 3) + "..."
    } catch {
        return "[unable to serialize]"
    }
}
// @from(Ln 268092, Col 4)
$Dz = `Write a short summary label describing what these tool calls accomplished. It appears as a single-line row in a mobile app and truncates around 30 characters, so think git-commit-subject, not sentence.

Keep the verb in past tense and the most distinctive noun. Drop articles, connectors, and long location context first.

Examples:
- Searched in auth/
- Fixed NPE in UserService
- Created signup endpoint
- Read config.json
- Ran failing tests`
// @from(Ln 268102, Col 4)
zx4 = L(() => {
    m8();
    U8();
    e8();
    O2()
})
// @from(Ln 268109, Col 0)
function Rx8() {
    let q, K;
    return {
        promise: new Promise((z, Y) => {
            q = z, K = Y
        }),
        resolve: q,
        reject: K
    }
}
// @from(Ln 268129, Col 0)
function WDz(q) {
    if (typeof q !== "object" || q === null) return !1;
    return "sessionId" in q && typeof q.sessionId === "string" && "pid" in q && typeof q.pid === "number"
}
// @from(Ln 268134, Col 0)
function ZR6() {
    return XDz(A7(), MDz)
}
// @from(Ln 268137, Col 0)
async function F18() {
    try {
        let q = await HDz(ZR6(), "utf8"),
            K = n8(q);
        return WDz(K) ? K : void 0
    } catch {
        return
    }
}
// @from(Ln 268147, Col 0)
function Yx4(q) {
    try {
        return process.kill(q, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 268154, Col 0)
async function Gr1(q) {
    try {
        return await JDz(ZR6(), I6(q), {
            flag: "wx"
        }), !0
    } catch (K) {
        if (Q1(K) === "EEXIST") return !1;
        throw K
    }
}
// @from(Ln 268165, Col 0)
function vr1() {
    g18?.(), g18 = eq(async () => {
        await Tr1()
    })
}
// @from(Ln 268170, Col 0)
async function Ax4() {
    let q = await F18();
    if (!q) return {
        kind: "free"
    };
    if (q.sessionId === I8()) return {
        kind: "held_by_self"
    };
    if (Yx4(q.pid)) return {
        kind: "blocked",
        by: q.sessionId
    };
    return E(`Recovering stale computer-use lock from session ${q.sessionId} (PID ${q.pid})`), await Sx8(ZR6()).catch(() => {}), {
        kind: "free"
    }
}
// @from(Ln 268187, Col 0)
function Ox4() {
    return g18 !== void 0
}
// @from(Ln 268190, Col 0)
async function wx4() {
    let q = I8(),
        K = {
            sessionId: q,
            pid: process.pid,
            acquiredAt: Date.now()
        };
    if (await jDz(A7(), {
            recursive: !0
        }), await Gr1(K)) return vr1(), fr1;
    let _ = await F18();
    if (!_) {
        if (await Sx8(ZR6()).catch(() => {}), await Gr1(K)) return vr1(), fr1;
        return {
            kind: "blocked",
            by: (await F18())?.sessionId ?? "unknown"
        }
    }
    if (_.sessionId === q) return PDz;
    if (Yx4(_.pid)) return {
        kind: "blocked",
        by: _.sessionId
    };
    if (E(`Recovering stale computer-use lock from session ${_.sessionId} (PID ${_.pid})`), await Sx8(ZR6()).catch(() => {}), await Gr1(K)) return vr1(), fr1;
    return {
        kind: "blocked",
        by: (await F18())?.sessionId ?? "unknown"
    }
}
// @from(Ln 268219, Col 0)
async function Tr1() {
    g18?.(), g18 = void 0;
    let q = await F18();
    if (!q || q.sessionId !== I8()) return !1;
    try {
        return await Sx8(ZR6()), E("Released computer-use lock"), !0
    } catch {
        return !1
    }
}
// @from(Ln 268229, Col 4)
MDz = "computer-use.lock"
// @from(Ln 268230, Col 4)
g18
// @from(Ln 268230, Col 9)
fr1
// @from(Ln 268230, Col 14)
PDz
// @from(Ln 268231, Col 4)
Vr1 = L(() => {
    y8();
    R9();
    K8();
    Q8();
    e8();
    m8();
    fr1 = {
        kind: "acquired",
        fresh: !0
    }, PDz = {
        kind: "acquired",
        fresh: !1
    }
})
// @from(Ln 268246, Col 4)
jx4 = p((qlw, $x4) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2239/node_modules/@ant/computer-use-swift/js",
        DDz = d6("path");
    if (process.platform !== "darwin") throw Error("@ant/computer-use-swift is only available on macOS");
    var ZDz = d6(process.env.COMPUTER_USE_SWIFT_NODE_PATH ?? DDz.resolve(__dirname, "../prebuilds/computer_use.node"));
    $x4.exports = ZDz.computerUse
})
// @from(Ln 268254, Col 0)
function oR() {
    if (process.platform !== "darwin") throw Error("@ant/computer-use-swift is macOS-only");
    return fDz ??= jx4()
}
// @from(Ln 268258, Col 4)
fDz
// @from(Ln 268260, Col 0)
function GDz(q) {
    q._drainMainRunLoop()
}
// @from(Ln 268264, Col 0)
function Hx4() {
    if (Cx8++, U18 === void 0) U18 = setInterval(GDz, 1, oR()), E("[drainRunLoop] pump started", {
        level: "verbose"
    })
}
// @from(Ln 268270, Col 0)
function Jx4() {
    if (Cx8--, Cx8 <= 0 && U18 !== void 0) clearInterval(U18), U18 = void 0, E("[drainRunLoop] pump stopped", {
        level: "verbose"
    }), Cx8 = 0
}
// @from(Ln 268276, Col 0)
function vDz(q) {
    q(Error(`computer-use native call exceeded ${Xx4}ms`))
}
// @from(Ln 268279, Col 0)
async function zF(q) {
    Hx4();
    let K;
    try {
        let _ = q();
        _.catch(() => {});
        let z = Rx8();
        return K = setTimeout(vDz, Xx4, z.reject), await Promise.race([_, z.promise])
    } finally {
        clearTimeout(K), Jx4()
    }
}
// @from(Ln 268291, Col 4)
U18
// @from(Ln 268291, Col 9)
Cx8 = 0
// @from(Ln 268292, Col 4)
Xx4 = 30000
// @from(Ln 268293, Col 4)
Mx4
// @from(Ln 268293, Col 9)
Px4
// @from(Ln 268294, Col 4)
kr1 = L(() => {
    K8();
    Mx4 = Hx4, Px4 = Jx4
})
// @from(Ln 268299, Col 0)
function Wx4(q) {
    if (Q18) return !0;
    if (!oR().hotkey.registerEscape(q)) return E("[cu-esc] registerEscape returned false", {
        level: "warn"
    }), !1;
    return Mx4(), Q18 = !0, E("[cu-esc] registered"), !0
}
// @from(Ln 268307, Col 0)
function Dx4() {
    if (!Q18) return;
    try {
        oR().hotkey.unregister()
    } finally {
        Px4(), Q18 = !1, E("[cu-esc] unregistered")
    }
}
// @from(Ln 268316, Col 0)
function Nr1() {
    if (!Q18) return;
    oR().hotkey.notifyExpectedEscape()
}
// @from(Ln 268320, Col 4)
Q18 = !1
// @from(Ln 268321, Col 4)
bx8 = L(() => {
    K8();
    kr1()
})
// @from(Ln 268325, Col 4)
ac
// @from(Ln 268326, Col 4)
Ix8 = L(() => {
    ac = {
        clipboardRead: !1,
        clipboardWrite: !1,
        systemKeyCombos: !1
    }
})
// @from(Ln 268334, Col 0)
function Zx4(q, K) {
    return Math.floor((q - 1) / K) + 1
}
// @from(Ln 268338, Col 0)
function fx4(q, K, _) {
    return Zx4(q, _) * Zx4(K, _)
}
// @from(Ln 268342, Col 0)
function xx8(q, K, _) {
    let {
        pxPerToken: z,
        maxTargetPx: Y,
        maxTargetTokens: A
    } = _;
    if (q <= Y && K <= Y && fx4(q, K, z) <= A) return [q, K];
    if (K > q) {
        let [j, H] = xx8(K, q, _);
        return [H, j]
    }
    let O = q / K,
        w = q,
        $ = 1;
    for (;;) {
        if ($ + 1 === w) return [$, Math.max(Math.round($ / O), 1)];
        let j = Math.floor(($ + w) / 2),
            H = Math.max(Math.round(j / O), 1);
        if (j <= Y && fx4(j, H, z) <= A) $ = j;
        else w = j
    }
}
// @from(Ln 268364, Col 4)
Er1
// @from(Ln 268365, Col 4)
Gx4 = L(() => {
    Er1 = {
        pxPerToken: 28,
        maxTargetPx: 1568,
        maxTargetTokens: 1568
    }
})
// @from(Ln 268373, Col 0)
function TDz(q) {
    if (q === "browser" || q === "trading") return "read";
    if (q === "terminal") return "click";
    return "full"
}
// @from(Ln 268379, Col 0)
function ux8(q, K) {
    if (q && EDz.has(q)) return !0;
    let _ = K.toLowerCase();
    for (let z of yDz)
        if (_.includes(z)) return !0;
    return !1
}
// @from(Ln 268387, Col 0)
function LDz(q) {
    if (VDz.has(q)) return "browser";
    if (kDz.has(q)) return "terminal";
    if (NDz.has(q)) return "trading";
    return null
}
// @from(Ln 268394, Col 0)
function CDz(q) {
    let K = q.toLowerCase();
    for (let _ of SDz)
        if (K.includes(_)) return "trading";
    for (let _ of hDz)
        if (K.includes(_)) return "browser";
    for (let _ of RDz)
        if (K.includes(_)) return "terminal";
    return null
}
// @from(Ln 268405, Col 0)
function fR6(q, K) {
    if (q) {
        let _ = LDz(q);
        if (_) return _
    }
    return CDz(K)
}
// @from(Ln 268413, Col 0)
function yr1(q, K) {
    return TDz(fR6(q, K))
}
// @from(Ln 268416, Col 4)
VDz
// @from(Ln 268416, Col 9)
kDz
// @from(Ln 268416, Col 14)
NDz
// @from(Ln 268416, Col 19)
EDz
// @from(Ln 268416, Col 24)
yDz
// @from(Ln 268416, Col 29)
hDz
// @from(Ln 268416, Col 34)
RDz
// @from(Ln 268416, Col 39)
SDz
// @from(Ln 268417, Col 4)
vx4 = L(() => {
    VDz = new Set(["com.apple.Safari", "com.apple.SafariTechnologyPreview", "com.google.Chrome", "com.google.Chrome.beta", "com.google.Chrome.dev", "com.google.Chrome.canary", "com.microsoft.edgemac", "com.microsoft.edgemac.Beta", "com.microsoft.edgemac.Dev", "com.microsoft.edgemac.Canary", "org.mozilla.firefox", "org.mozilla.firefoxdeveloperedition", "org.mozilla.nightly", "org.chromium.Chromium", "com.brave.Browser", "com.brave.Browser.beta", "com.brave.Browser.nightly", "com.operasoftware.Opera", "com.operasoftware.OperaGX", "com.operasoftware.OperaDeveloper", "com.vivaldi.Vivaldi", "company.thebrowser.Browser", "company.thebrowser.dia", "org.torproject.torbrowser", "com.duckduckgo.macos.browser", "ru.yandex.desktop.yandex-browser", "ai.perplexity.comet", "com.sigmaos.sigmaos.macos", "com.kagi.kagimacOS"]), kDz = new Set(["com.apple.Terminal", "com.googlecode.iterm2", "dev.warp.Warp-Stable", "dev.warp.Warp-Beta", "com.github.wez.wezterm", "org.alacritty", "io.alacritty", "net.kovidgoyal.kitty", "co.zeit.hyper", "com.mitchellh.ghostty", "org.tabby", "com.termius-dmg.mac", "com.microsoft.VSCode", "com.microsoft.VSCodeInsiders", "com.vscodium", "com.todesktop.230313mzl4w4u92", "com.exafunction.windsurf", "dev.zed.Zed", "dev.zed.Zed-Preview", "com.jetbrains.intellij", "com.jetbrains.intellij.ce", "com.jetbrains.pycharm", "com.jetbrains.pycharm.ce", "com.jetbrains.WebStorm", "com.jetbrains.CLion", "com.jetbrains.goland", "com.jetbrains.rubymine", "com.jetbrains.PhpStorm", "com.jetbrains.datagrip", "com.jetbrains.rider", "com.jetbrains.AppCode", "com.jetbrains.rustrover", "com.jetbrains.fleet", "com.google.android.studio", "com.axosoft.gitkraken", "com.sublimetext.4", "com.sublimetext.3", "org.vim.MacVim", "com.neovim.neovim", "org.gnu.Emacs", "com.apple.dt.Xcode", "org.eclipse.platform.ide", "org.netbeans.ide", "com.microsoft.visual-studio", "com.apple.ScriptEditor2", "com.apple.Automator", "com.apple.shortcuts"]), NDz = new Set(["com.webull.desktop.v1", "com.webull.trade.mac.v1", "com.tastytrade.desktop", "com.tradingview.tradingviewapp.desktop", "com.fidelity.activetrader", "com.fmr.activetrader", "com.install4j.5889-6375-8446-2021", "com.binance.BinanceDesktop", "com.electron.exodus", "org.pythonmac.unspecified.Electrum", "com.ledger.live", "io.trezor.TrezorSuite"]), EDz = new Set(["com.apple.TV", "com.apple.Music", "com.apple.iBooksX", "com.apple.podcasts", "com.spotify.client", "com.amazon.music", "com.tidal.desktop", "com.deezer.deezer-desktop", "com.pandora.desktop", "com.electron.pocket-casts", "au.com.shiftyjelly.PocketCasts", "tv.plex.desktop", "tv.plex.htpc", "tv.plex.plexamp", "com.amazon.aiv.AIVApp", "net.kovidgoyal.calibre", "com.amazon.Kindle", "com.amazon.Lassen", "com.kobo.desktop.Kobo"]), yDz = ["netflix", "disney+", "hulu", "prime video", "apple tv", "peacock", "paramount+", "tubi", "crunchyroll", "vudu", "kindle", "apple books", "kobo", "play books", "calibre", "libby", "readium", "audible", "libro.fm", "speechify", "spotify", "apple music", "amazon music", "youtube music", "tidal", "deezer", "pandora", "pocket casts", "naver", "reddit", "sony music", "vegas pro", "pitchfork", "economist", "nytimes"];
    hDz = ["safari", "chrome", "firefox", "microsoft edge", "brave", "opera", "vivaldi", "chromium", "arc browser", "tor browser", "duckduckgo", "yandex", "orion browser", "comet", "sigmaos", "dia browser"], RDz = ["terminal", "iterm", "wezterm", "alacritty", "kitty", "ghostty", "tabby", "termius", "script editor", "automator", "powershell", "cmd.exe", "command prompt", "git bash", "conemu", "cmder", "visual studio code", "visual studio", "vscode", "vs code", "vscodium", "cursor", "windsurf", "intellij", "pycharm", "webstorm", "clion", "goland", "rubymine", "phpstorm", "datagrip", "rider", "appcode", "rustrover", "fleet", "android studio", "sublime text", "macvim", "neovim", "emacs", "xcode", "eclipse", "netbeans"], SDz = ["bloomberg", "ameritrade", "thinkorswim", "schwab", "fidelity", "e*trade", "interactive brokers", "trader workstation", "tradestation", "webull", "robinhood", "tastytrade", "ninjatrader", "tradingview", "moomoo", "tradezero", "prorealtime", "plus500", "saxotrader", "oanda", "metatrader", "forex.com", "avaoptions", "ctrader", "jforex", "iq option", "olymp trade", "binomo", "pocket option", "raceoption", "expertoption", "quotex", "naga", "morgan stanley", "ubs neo", "eikon", "coinbase", "kraken", "binance", "okx", "bybit", "phemex", "stormgain", "crypto.com", "electrum", "ledger live", "trezor", "guarda", "atomic wallet", "bitpay", "bisq", "koinly", "cointracker", "blockfi", "stripe cli", "decentraland", "axie infinity", "gods unchained"]
})
// @from(Ln 268422, Col 0)
function uDz(q) {
    let K = q.toLowerCase().split("+").map((A) => A.trim()).filter(Boolean),
        _ = [],
        z = [];
    for (let A of K) {
        let O = bDz[A];
        if (O !== void 0) _.push(O);
        else z.push(A)
    }
    let Y = [...new Set(_)];
    return Y.sort((A, O) => Tx4.indexOf(A) - Tx4.indexOf(O)), {
        mods: Y,
        keys: z
    }
}
// @from(Ln 268438, Col 0)
function mx8(q, K) {
    let _ = K === "darwin" ? IDz : xDz,
        {
            mods: z,
            keys: Y
        } = uDz(q),
        A = z.length > 0 ? z.join("+") + "+" : "";
    if (Y.length === 0) return _.has(z.join("+"));
    for (let O of Y)
        if (_.has(A + O)) return !0;
    return !1
}
// @from(Ln 268450, Col 4)
bDz
// @from(Ln 268450, Col 9)
Tx4
// @from(Ln 268450, Col 14)
IDz
// @from(Ln 268450, Col 19)
xDz
// @from(Ln 268451, Col 4)
Vx4 = L(() => {
    bDz = {
        meta: "meta",
        super: "meta",
        command: "meta",
        cmd: "meta",
        windows: "meta",
        win: "meta",
        ctrl: "ctrl",
        control: "ctrl",
        lctrl: "ctrl",
        lcontrol: "ctrl",
        rctrl: "ctrl",
        rcontrol: "ctrl",
        shift: "shift",
        lshift: "shift",
        rshift: "shift",
        alt: "alt",
        option: "alt"
    }, Tx4 = ["ctrl", "alt", "shift", "meta"], IDz = new Set(["meta+q", "shift+meta+q", "alt+meta+escape", "meta+tab", "meta+space", "ctrl+meta+q"]), xDz = new Set(["ctrl+alt+delete", "alt+f4", "alt+tab", "meta+l", "meta+d"])
})
// @from(Ln 268473, Col 0)
function mDz(q, K, _, z, Y) {
    if (!q || !K) return null;
    let A = Math.max(0, Math.min(100, _)),
        O = Math.max(0, Math.min(100, z)),
        w = Math.round(A / 100 * q),
        $ = Math.round(O / 100 * K),
        j = Math.floor(Y / 2),
        H = Math.max(0, w - j),
        J = Math.max(0, $ - j),
        X = Math.min(Y, q - H),
        M = Math.min(Y, K - J);
    if (X <= 0 || M <= 0) return null;
    return {
        x: H,
        y: J,
        width: X,
        height: M
    }
}
// @from(Ln 268493, Col 0)
function BDz(q, K, _, z, Y, A = 9) {
    let O = mDz(_.width, _.height, z, Y, A);
    if (!O) return !1;
    let w = q(K.base64, O),
        $ = q(_.base64, O);
    if (!w || !$) return !1;
    return w.equals($)
}
// @from(Ln 268501, Col 0)
async function kx4(q, K, _, z, Y, A, O = 9) {
    if (!K) return {
        valid: !0,
        skipped: !0
    };
    try {
        let w = await Y();
        if (!w) return {
            valid: !0,
            skipped: !0
        };
        if (BDz(q, K, w, _, z, O)) return {
            valid: !0,
            skipped: !1
        };
        return {
            valid: !1,
            skipped: !1,
            warning: "Screen content at the target location changed since the last screenshot. Take a new screenshot before clicking."
        }
    } catch (w) {
        return A.debug("[pixelCompare] validation error, skipping", w), {
            valid: !0,
            skipped: !0
        }
    }
}
// @from(Ln 268529, Col 0)
function hx4(q) {
    if (Nx4.has(q)) return "shell";
    if (Ex4.has(q)) return "filesystem";
    if (yx4.has(q)) return "system_settings";
    return null
}
// @from(Ln 268535, Col 4)
Nx4
// @from(Ln 268535, Col 9)
Ex4
// @from(Ln 268535, Col 14)
yx4
// @from(Ln 268535, Col 19)
Lx4
// @from(Ln 268536, Col 4)
Lr1 = L(() => {
    Nx4 = new Set(["com.apple.Terminal", "com.googlecode.iterm2", "com.microsoft.VSCode", "dev.warp.Warp-Stable", "com.github.wez.wezterm", "io.alacritty", "net.kovidgoyal.kitty", "com.jetbrains.intellij", "com.jetbrains.pycharm"]), Ex4 = new Set(["com.apple.finder"]), yx4 = new Set(["com.apple.systempreferences"]), Lx4 = new Set([...Nx4, ...Ex4, ...yx4])
})
// @from(Ln 268543, Col 0)
function X4(q, K) {
    return {
        content: [{
            type: "text",
            text: q
        }],
        isError: !0,
        telemetry: K ? {
            error_kind: K
        } : void 0
    }
}
// @from(Ln 268556, Col 0)
function rf(q) {
    return {
        content: [{
            type: "text",
            text: q
        }]
    }
}
// @from(Ln 268565, Col 0)
function nf(q, K) {
    return {
        content: [{
            type: "text",
            text: JSON.stringify(q)
        }],
        telemetry: K
    }
}
// @from(Ln 268575, Col 0)
function pDz(q) {
    if (typeof q === "object" && q !== null) return q;
    return {}
}
// @from(Ln 268580, Col 0)
function tc(q, K) {
    let _ = q[K];
    if (typeof _ !== "string") return Error(`"${K}" must be a string.`);
    return _
}
// @from(Ln 268586, Col 0)
function l18(q, K = "coordinate") {
    let _ = q[K];
    if (_ === void 0) return Error(`${K} is required`);
    if (!Array.isArray(_) || _.length !== 2) return Error(`${K} must be an array of length 2`);
    let [z, Y] = _;
    if (typeof z !== "number" || typeof Y !== "number" || z < 0 || Y < 0) return Error(`${K} must be a tuple of non-negative numbers`);
    return [z, Y]
}
// @from(Ln 268595, Col 0)
function GR6(q, K, _, z, Y, A) {
    if (_ === "normalized_0_100") return {
        x: Math.round(q / 100 * z.width) + z.originX,
        y: Math.round(K / 100 * z.height) + z.originY
    };
    if (Y) return {
        x: Math.round(q * (Y.displayWidth / Y.width)) + Y.originX,
        y: Math.round(K * (Y.displayHeight / Y.height)) + Y.originY
    };
    return A.warn("[computer-use] pixels-mode coordinate received with no prior screenshot; falling back to /scaleFactor. Click may be off if downsample is active."), {
        x: Math.round(q / z.scaleFactor) + z.originX,
        y: Math.round(K / z.scaleFactor) + z.originY
    }
}
// @from(Ln 268610, Col 0)
function FDz(q, K, _, z) {
    if (_ === "normalized_0_100") return {
        xPct: q,
        yPct: K
    };
    if (!z) return {
        xPct: 0,
        yPct: 0
    };
    return {
        xPct: q / z.width * 100,
        yPct: K / z.height * 100
    }
}
// @from(Ln 268625, Col 0)
function bx4(q, K) {
    let _ = q ?? "full";
    if (K === "mouse_position") return !0;
    if (K === "keyboard" || K === "mouse_full") return _ === "full";
    return _ === "click" || _ === "full"
}
// @from(Ln 268631, Col 0)
async function gx8(q, K, _) {
    let z = K.getClipboardStash?.();
    if (!_) {
        if (z === void 0) return;
        try {
            await q.executor.writeClipboard(z), K.onClipboardStashChanged?.(void 0)
        } catch {}
        return
    }
    if (z === void 0) try {
        let Y = await q.executor.readClipboard();
        K.onClipboardStashChanged?.(Y)
    } catch {
        K.onClipboardStashChanged?.("")
    }
    try {
        await q.executor.writeClipboard("")
    } catch {}
}
// @from(Ln 268650, Col 0)
async function At(q, K, _, z) {
    if (_.hideBeforeAction) {
        let $ = await q.executor.prepareForAction(K.allowedApps.map((j) => j.bundleId), K.selectedDisplayId);
        if ($.length > 0) K.onAppsHidden?.($)
    }
    let Y = await q.executor.getFrontmostApp(),
        A = new Map(K.allowedApps.map(($) => [$.bundleId, $.tier])),
        O = Y ? A.get(Y.bundleId) : void 0;
    if (_.clipboardGuard) await gx8(q, K, O === "click");
    if (!Y) return null;
    let {
        hostBundleId: w
    } = q.executor.capabilities;
    if (O !== void 0) {
        if (bx4(O, z)) return null;
        if (O === "read") {
            let $ = fR6(Y.bundleId, Y.displayName) === "browser";
            return X4(`"${Y.displayName}" is granted at tier "read" — ` + "visible in screenshots only, no clicks or typing." + ($ ? " Use the Claude-in-Chrome MCP for browser interaction (tools named `mcp__Claude_in_Chrome__*`; load via ToolSearch if deferred)." : " No interaction is permitted; ask the user to take any actions in this app themselves.") + PJ6, "tier_insufficient")
        }
        if (z === "keyboard") return X4(`"${Y.displayName}" is granted at tier "click" — ` + `typing, key presses, and paste require tier "full". The keys would go to this app's text fields or integrated terminal. To type into a different app, click it first to bring it forward. For shell commands, use the Bash tool.` + PJ6, "tier_insufficient");
        return X4(`"${Y.displayName}" is granted at tier "click" — ` + 'right-click, middle-click, and clicks with modifier keys require tier "full". Right-click opens a context menu with Paste/Cut, and modifier chords fire as keystrokes before the click. Plain left_click is allowed here.' + PJ6, "tier_insufficient")
    }
    if (Y.bundleId === Cx4) return null;
    if (Y.bundleId === w) {
        if (z !== "keyboard") return null;
        return X4("Claude's own window still has keyboard focus. This should not happen after the pre-action defocus. Click on the target application first.", "state_conflict")
    }
    return X4(`"${Y.displayName}" is not in the allowed applications and is ` + "currently in front. Take a new screenshot — it may have appeared " + "since your last one.", "app_not_granted")
}
// @from(Ln 268679, Col 0)
async function WJ6(q, K, _, z, Y, A) {
    let O = await q.executor.appUnderPoint(z, Y);
    if (!O) return null;
    if (O.bundleId === Cx4) return null;
    let w = new Map(K.allowedApps.map((H) => [H.bundleId, H.tier]));
    if (!w.has(O.bundleId)) return X4(`Click at these coordinates would land on "${O.displayName}", which is not in the allowed applications. Take a fresh screenshot to see the current window layout.`, "app_not_granted");
    let $ = w.get(O.bundleId);
    if (_.clipboardGuard && $ === "click") await gx8(q, K, !0);
    if (bx4($, A)) return null;
    if (A === "mouse_full" && $ === "click") return X4(`Click at these coordinates would land on "${O.displayName}", ` + 'which is granted at tier "click" — right-click, middle-click, and ' + 'clicks with modifier keys require tier "full" (they can Paste via the context menu or fire modifier-chord keystrokes). Plain left_click is allowed here.' + PJ6, "tier_insufficient");
    let j = fR6(O.bundleId, O.displayName) === "browser";
    return X4(`Click at these coordinates would land on "${O.displayName}", which is granted at tier "read" (screenshots only, no interaction). ` + (j ? "Use the Claude-in-Chrome MCP for browser interaction." : "Ask the user to take any actions in this app themselves.") + PJ6, "tier_insufficient")
}
// @from(Ln 268693, Col 0)
function px8(q) {
    let K = q.endsWith("==") ? 2 : q.endsWith("=") ? 1 : 0;
    return Math.floor(q.length * 3 / 4) - K
}
// @from(Ln 268697, Col 0)
async function gDz(q, K, _, z) {
    let Y = await q.screenshot({
        allowedBundleIds: K,
        displayId: z
    });
    if (px8(Y.base64) < Ix4) _.warn(`[computer-use] screenshot implausibly small (${px8(Y.base64)} bytes decoded), retrying once`), Y = await q.screenshot({
        allowedBundleIds: K,
        displayId: z
    });
    return Y
}
// @from(Ln 268709, Col 0)
function QDz(q) {
    try {
        let K = Intl.Segmenter;
        if (typeof K === "function") {
            let _ = new K(void 0, {
                granularity: "grapheme"
            });
            return Array.from(_.segment(q), (z) => z.segment)
        }
    } catch {}
    return Array.from(q)
}
// @from(Ln 268722, Col 0)
function Ux8(q) {
    return new Promise((K) => setTimeout(K, q))
}
// @from(Ln 268726, Col 0)
function xx4(q) {
    return q.split("+").map((K) => K.trim()).filter(Boolean)
}
// @from(Ln 268730, Col 0)
function Cr1() {
    PT = !1, sc = !1
}
// @from(Ln 268733, Col 0)
async function c18(q) {
    if (!PT) return;
    await q.executor.mouseUp(), PT = !1, sc = !1
}
// @from(Ln 268738, Col 0)
function br1(q) {
    return q === "request_access" || q === "list_granted_applications"
}
// @from(Ln 268742, Col 0)
function hr1(q) {
    return dDz.test(q) && !q.includes(" ")
}
// @from(Ln 268746, Col 0)
function cDz(q, K, _) {
    let z = new Map,
        Y = new Map;
    for (let A of K) Y.set(A.bundleId, A), z.set(A.displayName.toLowerCase(), A);
    return q.map((A) => {
        let O;
        if (hr1(A)) O = Y.get(A);
        if (!O) O = z.get(A.toLowerCase());
        let w = O?.bundleId,
            $ = w ?? (hr1(A) ? A : void 0);
        return {
            requestedName: A,
            resolved: O,
            isSentinel: w ? Lx4.has(w) : !1,
            alreadyGranted: w ? _.has(w) : !1,
            proposedTier: yr1($, O?.displayName ?? A)
        }
    })
}
// @from(Ln 268765, Col 0)
async function lDz(q, K, _, z) {
    if (!_.onPermissionRequest) return X4("This session was not wired with a permission handler. Computer control is not available here.", "feature_unavailable");
    if (_.getTeachModeActive?.()) return X4("Cannot request additional permissions during teach mode — the permission dialog would be hidden. End teach mode (finish the tour or let the turn complete), then call request_access, then start a new tour.", "teach_mode_conflict");
    let Y = tc(K, "reason");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    if (z) {
        let V = {
            requestId: Bx8(),
            reason: Y,
            apps: [],
            requestedFlags: {},
            screenshotFiltering: q.executor.capabilities.screenshotFiltering,
            tccState: z
        };
        await _.onPermissionRequest(V);
        let k = await q.ensureOsPermissions();
        if (k.granted) return X4("macOS Accessibility and Screen Recording are now both granted. " + "Call request_access again immediately — the next call will show " + "the app selection list.");
        let N = [];
        if (!k.accessibility) N.push("Accessibility");
        if (!k.screenRecording) N.push("Screen Recording");
        return X4(`macOS ${N.join(" and ")} permission(s) not yet granted. The permission panel has been shown. Once the user grants the missing permission(s), call request_access again.`, "tcc_not_granted")
    }
    let A = K.apps;
    if (!Array.isArray(A) || !A.every((V) => typeof V === "string")) return X4('"apps" must be an array of strings.', "bad_args");
    let O = A,
        w = {};
    if (typeof K.clipboardRead === "boolean") w.clipboardRead = K.clipboardRead;
    if (typeof K.clipboardWrite === "boolean") w.clipboardWrite = K.clipboardWrite;
    if (typeof K.systemKeyCombos === "boolean") w.systemKeyCombos = K.systemKeyCombos;
    let {
        needDialog: $,
        skipDialogGrants: j,
        willHide: H,
        tieredApps: J,
        userDenied: X,
        policyDenied: M
    } = await ux4(q, O, _.allowedApps, new Set(_.userDeniedBundleIds), _.selectedDisplayId), P = [], W = [], D = _.grantFlags;
    if ($.length > 0 || Object.keys(w).length > 0) {
        let V = {
                requestId: Bx8(),
                reason: Y,
                apps: $,
                requestedFlags: w,
                screenshotFiltering: q.executor.capabilities.screenshotFiltering,
                ...H.length > 0 && {
                    willHide: H,
                    autoUnhideEnabled: q.getAutoUnhideEnabled()
                }
            },
            k = await _.onPermissionRequest(V);
        P = k.granted, W = k.denied, D = k.flags
    }
    let Z = [...j, ...P],
        G = new Set(Z.map((V) => V.bundleId)),
        f = J.filter((V) => G.has(V.bundleId)),
        v = [];
    try {
        v = await nDz(q, Z)
    } catch (V) {
        q.logger.warn(`[computer-use] buildWindowLocations failed: ${String(V)}`)
    }
    return nf({
        granted: Z,
        denied: W,
        ...M.length > 0 && {
            policyDenied: {
                apps: M,
                guidance: Sr1(M)
            }
        },
        ...X.length > 0 && {
            userDenied: {
                apps: X,
                guidance: Rr1(X)
            }
        },
        ...f.length > 0 && {
            tierGuidance: mx4(f)
        },
        screenshotFiltering: q.executor.capabilities.screenshotFiltering,
        ...v.length > 0 ? {
            windowLocations: v
        } : {}
    }, {
        granted_count: P.length,
        denied_count: W.length,
        ...Bx4(f)
    })
}
// @from(Ln 268854, Col 0)
async function nDz(q, K) {
    if (K.length === 0) return [];
    let _ = await q.executor.listDisplays();
    if (_.length <= 1) return [];
    let z = K.map(($) => $.bundleId),
        Y = await q.executor.findWindowDisplays(z),
        A = new Map(_.map(($) => [$.displayId, $])),
        O = new Map(Y.map(($) => [$.bundleId, $.displayIds])),
        w = [];
    for (let $ of K) {
        let j = O.get($.bundleId);
        if (!j || j.length === 0) continue;
        w.push({
            bundleId: $.bundleId,
            displayName: $.displayName,
            displays: j.map((H) => {
                let J = A.get(H);
                return {
                    id: H,
                    label: J?.label,
                    isPrimary: J?.isPrimary
                }
            })
        })
    }
    return w
}
// @from(Ln 268881, Col 0)
async function ux4(q, K, _, z, Y) {
    let A = new Set(_.map((f) => f.bundleId)),
        O = await q.executor.listInstalledApps(),
        w = cDz(K, O, A),
        $ = [],
        j = [];
    for (let f of w) {
        let v = f.resolved?.displayName ?? f.requestedName;
        if (ux8(f.resolved?.bundleId, v)) $.push({
            requestedName: f.requestedName,
            displayName: v
        });
        else j.push(f)
    }
    let H = [],
        J = [];
    for (let f of j)
        if (f.resolved && z.has(f.resolved.bundleId)) H.push({
            requestedName: f.requestedName,
            displayName: f.resolved.displayName
        });
        else J.push(f);
    let X = [];
    for (let f of J) {
        if (f.proposedTier === "full" || !f.resolved) continue;
        X.push({
            bundleId: f.resolved.bundleId,
            displayName: f.resolved.displayName,
            tier: f.proposedTier
        })
    }
    let M = J.filter((f) => f.alreadyGranted),
        P = J.filter((f) => !f.alreadyGranted);
    for (let f of P) {
        if (!f.resolved) continue;
        try {
            f.resolved.iconDataUrl = await q.executor.getAppIcon(f.resolved.path)
        } catch {}
    }
    let W = Date.now(),
        D = M.filter((f) => f.resolved).map((f) => {
            return _.find((V) => V.bundleId === f.resolved.bundleId) ?? {
                bundleId: f.resolved.bundleId,
                displayName: f.resolved.displayName,
                grantedAt: W,
                tier: f.proposedTier
            }
        }),
        Z = [..._.map((f) => f.bundleId), ...J.filter((f) => f.resolved).map((f) => f.resolved.bundleId)],
        G = await q.executor.previewHideSet(Z, Y);
    return {
        needDialog: P,
        skipDialogGrants: D,
        willHide: G,
        tieredApps: X,
        userDenied: H,
        policyDenied: $
    }
}
// @from(Ln 268941, Col 0)
function mx4(q) {
    let K = q.filter((A) => A.tier === "read" && fR6(A.bundleId, A.displayName) === "browser"),
        _ = q.filter((A) => A.tier === "read" && fR6(A.bundleId, A.displayName) !== "browser"),
        z = q.filter((A) => A.tier === "click"),
        Y = [];
    if (K.length > 0) {
        let A = K.map((O) => `"${O.displayName}"`).join(", ");
        Y.push(`${A} ${K.length===1?"is a browser":"are browsers"} — ` + `granted at tier "read" (visible in screenshots only; no clicks or typing). You can read what's on screen but cannot navigate, click, or type into ${K.length===1?"it":"them"}. For browser interaction, use the Claude-in-Chrome MCP (tools named \`mcp__Claude_in_Chrome__*\`; load via ToolSearch if deferred).`)
    }
    if (_.length > 0) {
        let A = _.map((O) => `"${O.displayName}"`).join(", ");
        Y.push(`${A} ${_.length===1?"is":"are"} granted at tier "read" (visible in screenshots only; no clicks or typing). You can read what's on screen but cannot interact. Ask the user to take any actions in ${_.length===1?"this app":"these apps"} themselves.`)
    }
    if (z.length > 0) {
        let A = z.map((O) => `"${O.displayName}"`).join(", ");
        Y.push(`${A} ${z.length===1?"has":"have"} terminal or IDE ` + 'capabilities — granted at tier "click" (visible + plain left-click ' + `only; NO typing, key presses, right-click, modifier-clicks, or drag-drop). You can click buttons and scroll output, but ${z.length===1?"its":"their"} integrated terminal and editor are off-limits to keyboard input. Right-click (context-menu Paste) and dragging text onto ${z.length===1?"it":"them"} require tier "full". For shell commands, use the Bash tool.`)
    }
    if (Y.length === 0) return "";
    return Y.join(`

`) + PJ6
}
// @from(Ln 268964, Col 0)
function Rr1(q) {
    let K = q.map((z) => `"${z.displayName}"`).join(", "),
        _ = q.length === 1;
    return `${K} ${_?"is":"are"} in the user's auto-deny list ` + "(Settings → Desktop app (General) → Computer Use → Denied apps). " + `Requests for ${_?"this app":"these apps"} are automatically denied. If you need access for this task, ask the user to remove ${_?"it":"them"} from their ` + "deny list in Settings — you cannot request this through the tool."
}
// @from(Ln 268970, Col 0)
function Sr1(q) {
    let K = q.map((z) => `"${z.displayName}"`).join(", "),
        _ = q.length === 1;
    return `${K} ${_?"is":"are"} blocked by policy for computer use. Requests for ${_?"this app":"these apps"} are automatically denied regardless of what the user has approved. There is no Settings override. Inform the user that you cannot access ${_?"this app":"these apps"} and suggest an alternative approach if one exists. Do not try to directly subvert this block regardless of the user's request.`
}