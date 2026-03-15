
// @from(Ln 449895, Col 0)
function BTq(A) {
    let q = new Map;
    for (let K of A) {
        if (!K.sessionId) continue;
        let Y = q.get(K.sessionId);
        if (!Y || K.modified.getTime() > Y.modified.getTime()) q.set(K.sessionId, K)
    }
    return v$6([...q.values()]).map((K, Y) => ({
        ...K,
        value: Y
    }))
}
// @from(Ln 449908, Col 0)
function uN6(A, q, K) {
    let z = [...yr6(A).entries()].sort((w, O) => O[1].mtime - w[1].mtime);
    if (q && z.length > q) z = z.slice(0, q);
    let _ = [];
    for (let [w, O] of z) _.push({
        date: new Date(O.mtime).toISOString(),
        messages: [],
        isLite: !0,
        fullPath: O.path,
        value: 0,
        created: new Date(O.ctime),
        modified: new Date(O.mtime),
        firstPrompt: "",
        messageCount: 0,
        fileSize: O.size,
        isSidechain: !1,
        sessionId: w,
        projectPath: K
    });
    return v$6(_).map((w, O) => ({
        ...w,
        value: O
    }))
}
// @from(Ln 449932, Col 0)
async function H_z(A, q) {
    if (!A.isLite || !A.fullPath) return A;
    let K = await O_z(A.fullPath, A.fileSize ?? 0, q),
        Y = {
            ...A,
            isLite: !1,
            firstPrompt: K.firstPrompt,
            gitBranch: K.gitBranch,
            isSidechain: K.isSidechain,
            teamName: K.teamName,
            customTitle: K.customTitle,
            summary: K.summary,
            tag: K.tag,
            agentSetting: K.agentSetting,
            prNumber: K.prNumber,
            prUrl: K.prUrl,
            prRepository: K.prRepository,
            projectPath: K.projectPath ?? A.projectPath
        };
    if (!Y.firstPrompt && !Y.customTitle) Y.firstPrompt = "(session)";
    if (Y.isSidechain) return k(`Session ${A.sessionId} filtered from /resume: isSidechain=true`), null;
    if (Y.teamName) return k(`Session ${A.sessionId} filtered from /resume: teamName=${Y.teamName}`), null;
    return Y
}
// @from(Ln 449956, Col 0)
async function m_6(A, q, K) {
    let Y = [],
        z = Buffer.alloc(wr),
        _ = q;
    while (_ < A.length && Y.length < K) {
        let $ = A[_];
        _++;
        let H = await H_z($, z);
        if (H) Y.push(H)
    }
    let w = _ - q,
        O = w - Y.length;
    if (O > 0) k(`/resume: enriched ${w} sessions, ${O} filtered out, ${Y.length} visible (${A.length-_} remaining on disk)`);
    return {
        logs: Y,
        nextIndex: _
    }
}
// @from(Ln 449974, Col 4)
pzz
// @from(Ln 449974, Col 9)
hTq
// @from(Ln 449974, Col 14)
Qzz
// @from(Ln 449974, Col 19)
Yr8
// @from(Ln 449974, Col 24)
mj
// @from(Ln 449974, Col 28)
bN = null
// @from(Ln 449975, Col 4)
ETq = !1
// @from(Ln 449976, Col 4)
yTq = 10
// @from(Ln 449977, Col 4)
Y_z
// @from(Ln 449977, Col 9)
mN6
// @from(Ln 449977, Col 14)
DS1 = 50
// @from(Ln 449978, Col 4)
Oq = E(() => {
    JA();
    K_();
    T1();
    A8();
    lA();
    F9();
    SA();
    cL6();
    i8();
    U4();
    $5();
    ln6();
    HV1();
    H1();
    k1();
    xI();
    D$();
    vz();
    V1();
    KY();
    u_();
    HA();
    g1();
    c_();
    pzz = {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.76",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-03-14T00:12:49Z"
    }.VERSION, hTq = new RegExp(`^(?:<local-command-stdout>|<session-start-hook>|<${vV}>|\\[Request interrupted by user[^\\]]*\\]|\\s*<ide_opened_file>[\\s\\S]*</ide_opened_file>\\s*$|\\s*<ide_selection>[\\s\\S]*</ide_selection>\\s*$)`);
    Qzz = new Set(["bash_progress", "powershell_progress", "mcp_progress", ...[]]);
    Yr8 = new Map;
    mj = e1((A) => {
        return uN(sb(), BD(A))
    });
    Y_z = ['"type":"summary"', '"type":"custom-title"', '"type":"tag"', '"type":"agent-name"', '"type":"agent-color"', '"type":"agent-setting"', '"type":"mode"', '"type":"pr-link"'];
    mN6 = e1(async (A) => {
        let {
            messages: q
        } = await xTq(A);
        return new Set(q.keys())
    }, (A) => A)
})
// @from(Ln 450024, Col 4)
GJ$
// @from(Ln 450024, Col 9)
XS1
// @from(Ln 450025, Col 4)
gTq = E(() => {
    K7();
    GJ$ = F6(() => y4.enum(["allow", "deny", "ask"])), XS1 = F6(() => y4.object({
        toolName: y4.string(),
        ruleContent: y4.string().optional()
    }))
})
// @from(Ln 450032, Col 4)
BN6
// @from(Ln 450032, Col 9)
PS1
// @from(Ln 450033, Col 4)
Tr8 = E(() => {
    K7();
    gTq();
    rD();
    BN6 = F6(() => y4.enum(["userSettings", "projectSettings", "localSettings", "session", "cliArg"])), PS1 = F6(() => y4.discriminatedUnion("type", [y4.object({
        type: y4.literal("addRules"),
        rules: y4.array(XS1()),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: BN6()
    }), y4.object({
        type: y4.literal("replaceRules"),
        rules: y4.array(XS1()),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: BN6()
    }), y4.object({
        type: y4.literal("removeRules"),
        rules: y4.array(XS1()),
        behavior: y4.enum(["allow", "deny", "ask"]),
        destination: BN6()
    }), y4.object({
        type: y4.literal("setMode"),
        mode: P57(),
        destination: BN6()
    }), y4.object({
        type: y4.literal("addDirectories"),
        directories: y4.array(y4.string()),
        destination: BN6()
    }), y4.object({
        type: y4.literal("removeDirectories"),
        directories: y4.array(y4.string()),
        destination: BN6()
    })]))
})
// @from(Ln 450067, Col 0)
function FN6(A) {
    return !(("async" in A) && A.async === !0)
}
// @from(Ln 450071, Col 0)
function uh(A) {
    return "async" in A && A.async === !0
}
// @from(Ln 450074, Col 4)
FTq
// @from(Ln 450074, Col 9)
j_z
// @from(Ln 450074, Col 14)
gN6
// @from(Ln 450075, Col 4)
vr8 = E(() => {
    K7();
    JJ6();
    Tr8();
    FTq = F6(() => C.object({
        prompt: C.string(),
        message: C.string(),
        options: C.array(C.object({
            key: C.string(),
            label: C.string(),
            description: C.string().optional()
        }))
    })), j_z = F6(() => C.object({
        continue: C.boolean().describe("Whether Claude should continue after hook (default: true)").optional(),
        suppressOutput: C.boolean().describe("Hide stdout from transcript (default: false)").optional(),
        stopReason: C.string().describe("Message shown when continue is false").optional(),
        decision: C.enum(["approve", "block"]).optional(),
        reason: C.string().describe("Explanation for the decision").optional(),
        systemMessage: C.string().describe("Warning message shown to the user").optional(),
        hookSpecificOutput: C.union([C.object({
            hookEventName: C.literal("PreToolUse"),
            permissionDecision: C.enum(["allow", "deny", "ask"]).optional(),
            permissionDecisionReason: C.string().optional(),
            updatedInput: C.record(C.string(), C.unknown()).optional(),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("UserPromptSubmit"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("SessionStart"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("Setup"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("SubagentStart"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("PostToolUse"),
            additionalContext: C.string().optional(),
            updatedMCPToolOutput: C.unknown().describe("Updates the output for MCP tools").optional()
        }), C.object({
            hookEventName: C.literal("PostToolUseFailure"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("Notification"),
            additionalContext: C.string().optional()
        }), C.object({
            hookEventName: C.literal("PermissionRequest"),
            decision: C.union([C.object({
                behavior: C.literal("allow"),
                updatedInput: C.record(C.string(), C.unknown()).optional(),
                updatedPermissions: C.array(PS1()).optional()
            }), C.object({
                behavior: C.literal("deny"),
                message: C.string().optional(),
                interrupt: C.boolean().optional()
            })])
        }), C.object({
            hookEventName: C.literal("Elicitation"),
            action: C.enum(["accept", "decline", "cancel"]).optional(),
            content: C.record(C.string(), C.unknown()).optional()
        }), C.object({
            hookEventName: C.literal("ElicitationResult"),
            action: C.enum(["accept", "decline", "cancel"]).optional(),
            content: C.record(C.string(), C.unknown()).optional()
        })]).optional()
    })), gN6 = F6(() => {
        let A = C.object({
            async: C.literal(!0),
            asyncTimeout: C.number().optional()
        });
        return C.union([A, j_z()])
    })
})
// @from(Ln 450151, Col 0)
function mN(A, q) {
    let K = sK();
    if (A.aborted || q?.aborted) return K.abort(), {
        signal: K.signal,
        cleanup: () => {}
    };
    let Y = () => {
        K.abort()
    };
    A.addEventListener("abort", Y), q?.addEventListener("abort", Y);
    let z = () => {
        A.removeEventListener("abort", Y), q?.removeEventListener("abort", Y)
    };
    return {
        signal: K.signal,
        cleanup: z
    }
}
// @from(Ln 450169, Col 4)
pN6 = E(() => {
    U$()
})
// @from(Ln 450173, Col 0)
function WS1(A, q) {
    return vW6(A, q)
}
// @from(Ln 450177, Col 0)
function pTq() {
    return {
        ...LV8,
        inputSchema: Yo6(),
        inputJSONSchema: {
            type: "object",
            properties: {
                ok: {
                    type: "boolean",
                    description: "Whether the condition was met"
                },
                reason: {
                    type: "string",
                    description: "Reason, if the condition was not met"
                }
            },
            required: ["ok"],
            additionalProperties: !1
        },
        async prompt() {
            return "Use this tool to return your verification result. You MUST call this tool exactly once at the end of your response."
        }
    }
}
// @from(Ln 450202, Col 0)
function ZS1(A, q) {
    MW1(A, q, "Stop", "", (K) => VTq(K, oM), `You MUST call the ${oM} tool to complete this request. Call this tool now.`, {
        timeout: 5000
    })
}
// @from(Ln 450207, Col 4)
Yo6
// @from(Ln 450208, Col 4)
GS1 = E(() => {
    K7();
    BB();
    Mc();
    JA();
    Wp6();
    Yo6 = F6(() => C.object({
        ok: C.boolean().describe("Whether the condition was met"),
        reason: C.string().describe("Reason, if the condition was not met").optional()
    }))
})
// @from(Ln 450222, Col 0)
async function QTq(A, q, K, Y, z, _, w, O) {
    let $ = O || `hook-${J_z()}`;
    try {
        let H = WS1(A.prompt, Y);
        k(`Hooks: Processing prompt hook with prompt: ${H}`);
        let j = p1({
                content: H
            }),
            J = w && w.length > 0 ? [...w, j] : [j];
        k(`Hooks: Querying model with ${J.length} messages`);
        let M = A.timeout ? A.timeout * 1000 : 30000,
            {
                signal: D,
                cleanup: X
            } = mN(z, AbortSignal.timeout(M));
        try {
            let P = await _i({
                messages: J,
                systemPrompt: uq([`You are evaluating a hook in Claude Code.

Your response must be a JSON object matching one of the following schemas:
1. If the condition is met, return: {"ok": true}
2. If the condition is not met, return: {"ok": false, "reason": "Reason for why it is not met"}`]),
                thinkingConfig: {
                    type: "disabled"
                },
                tools: _.options.tools,
                signal: D,
                options: {
                    async getToolPermissionContext() {
                        return _.getAppState().toolPermissionContext
                    },
                    model: A.model ?? lH(),
                    toolChoice: void 0,
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    agents: [],
                    querySource: "hook_prompt",
                    mcpTools: [],
                    agentId: _.agentId,
                    outputFormat: {
                        type: "json_schema",
                        schema: {
                            type: "object",
                            properties: {
                                ok: {
                                    type: "boolean"
                                },
                                reason: {
                                    type: "string"
                                }
                            },
                            required: ["ok"],
                            additionalProperties: !1
                        }
                    }
                }
            });
            X();
            let W = P.message.content.filter((v) => v.type === "text").map((v) => v.text).join("");
            _.setResponseLength((v) => v + W.length);
            let Z = W.trim();
            k(`Hooks: Model response: ${Z}`);
            let G = WK(Z);
            if (!G) return k(`Hooks: error parsing response as JSON: ${Z}`), {
                hook: A,
                outcome: "non_blocking_error",
                message: f4({
                    type: "hook_non_blocking_error",
                    hookName: q,
                    toolUseID: $,
                    hookEvent: K,
                    stderr: "JSON validation failed",
                    stdout: Z,
                    exitCode: 1
                })
            };
            let f = Yo6().safeParse(G);
            if (!f.success) return k(`Hooks: model response does not conform to expected schema: ${f.error.message}`), {
                hook: A,
                outcome: "non_blocking_error",
                message: f4({
                    type: "hook_non_blocking_error",
                    hookName: q,
                    toolUseID: $,
                    hookEvent: K,
                    stderr: `Schema validation failed: ${f.error.message}`,
                    stdout: Z,
                    exitCode: 1
                })
            };
            if (!f.data.ok) return k(`Hooks: Prompt hook condition was not met: ${f.data.reason}`), {
                hook: A,
                outcome: "blocking",
                blockingError: {
                    blockingError: `Prompt hook condition was not met: ${f.data.reason}`,
                    command: A.prompt
                },
                preventContinuation: !0,
                stopReason: f.data.reason
            };
            return k("Hooks: Prompt hook condition was met"), {
                hook: A,
                outcome: "success",
                message: f4({
                    type: "hook_success",
                    hookName: q,
                    toolUseID: $,
                    hookEvent: K,
                    content: ""
                })
            }
        } catch (P) {
            if (X(), D.aborted) return {
                hook: A,
                outcome: "cancelled"
            };
            throw P
        }
    } catch (H) {
        let j = _1(H);
        return k(`Hooks: Prompt hook error: ${j}`), {
            hook: A,
            outcome: "non_blocking_error",
            message: f4({
                type: "hook_non_blocking_error",
                hookName: q,
                toolUseID: $,
                hookEvent: K,
                stderr: `Error executing prompt hook: ${j}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 450358, Col 4)
UTq = E(() => {
    H1();
    JA();
    gw();
    z4();
    pN6();
    M0();
    K_();
    GS1();
    s8()
})
// @from(Ln 450372, Col 0)
async function cTq(A, q, K, Y, z, _, w, O, $) {
    let H = w || `hook-${dTq()}`,
        j = _.agentId ? L0(_.agentId) : Cz(),
        J = Date.now();
    try {
        let M = WS1(A.prompt, Y);
        k(`Hooks: Processing agent hook with prompt: ${M}`);
        let X = [p1({
            content: M
        })];
        k(`Hooks: Starting agent query with ${X.length} messages`);
        let P = A.timeout ? A.timeout * 1000 : 60000,
            W = sK(),
            {
                signal: Z,
                cleanup: G
            } = mN(z, AbortSignal.timeout(P)),
            f = () => W.abort();
        Z.addEventListener("abort", f);
        let v = W.signal;
        try {
            let N = pTq(),
                L = [..._.options.tools.filter((Q) => !z3(Q, oM)).filter((Q) => !CW6.has(Q.name)), N],
                h = uq([`You are verifying a stop condition in Claude Code. Your task is to verify that the agent completed the given plan. The conversation transcript is available at: ${j}
You can read this file to analyze the conversation history if needed.

Use the available tools to inspect the codebase and verify the condition.
Use as few steps as possible - be efficient and direct.

When done, return your result using the ${oM} tool with:
- ok: true if the condition is met
- ok: false with reason if the condition is not met`]),
                R = A.model ?? lH(),
                u = 50,
                I = X$(`hook-agent-${dTq()}`),
                g = {
                    ..._,
                    agentId: I,
                    abortController: W,
                    options: {
                        ..._.options,
                        tools: L,
                        mainLoopModel: R,
                        isNonInteractiveSession: !0,
                        thinkingConfig: {
                            type: "disabled"
                        }
                    },
                    setInProgressToolUseIDs: () => {},
                    getAppState() {
                        let Q = _.getAppState(),
                            U = Q.toolPermissionContext.alwaysAllowRules.session ?? [];
                        return {
                            ...Q,
                            toolPermissionContext: {
                                ...Q.toolPermissionContext,
                                mode: "dontAsk",
                                alwaysAllowRules: {
                                    ...Q.toolPermissionContext.alwaysAllowRules,
                                    session: [...U, `Read(/${j})`]
                                }
                            }
                        }
                    }
                };
            ZS1(_.setAppState, I);
            let B = null,
                b = 0,
                p = !1;
            for await (let Q of Yh({
                messages: X,
                systemPrompt: h,
                userContext: {},
                systemContext: {},
                canUseTool: tJ,
                toolUseContext: g,
                querySource: "hook_agent"
            })) {
                if (xN6(Q, () => {}, (U) => _.setResponseLength((r) => r + U.length), _.setStreamMode ?? (() => {}), () => {}), Q.type === "stream_event" || Q.type === "stream_request_start") continue;
                if (Q.type === "assistant") {
                    if (b++, b >= 50) {
                        p = !0, k(`Hooks: Agent turn ${b} hit max turns, aborting`), W.abort();
                        break
                    }
                }
                if (Q.type === "attachment" && Q.attachment.type === "structured_output") {
                    let U = Yo6().safeParse(Q.attachment.data);
                    if (U.success) {
                        B = U.data, k(`Hooks: Got structured output: ${B6(B)}`), W.abort();
                        break
                    }
                }
            }
            if (Z.removeEventListener("abort", f), G(), zZ6(_.setAppState, I), !B) {
                if (p) return k("Hooks: Agent hook did not complete within 50 turns"), d("tengu_agent_stop_hook_max_turns", {
                    durationMs: Date.now() - J,
                    turnCount: b,
                    agentName: $
                }), {
                    hook: A,
                    outcome: "cancelled"
                };
                return k("Hooks: Agent hook did not return structured output"), d("tengu_agent_stop_hook_error", {
                    durationMs: Date.now() - J,
                    turnCount: b,
                    errorType: 1,
                    agentName: $
                }), {
                    hook: A,
                    outcome: "cancelled"
                }
            }
            if (!B.ok) return k(`Hooks: Agent hook condition was not met: ${B.reason}`), {
                hook: A,
                outcome: "blocking",
                blockingError: {
                    blockingError: `Agent hook condition was not met: ${B.reason}`,
                    command: A.prompt
                }
            };
            return k("Hooks: Agent hook condition was met"), d("tengu_agent_stop_hook_success", {
                durationMs: Date.now() - J,
                turnCount: b,
                agentName: $
            }), {
                hook: A,
                outcome: "success",
                message: f4({
                    type: "hook_success",
                    hookName: q,
                    toolUseID: H,
                    hookEvent: K,
                    content: ""
                })
            }
        } catch (N) {
            if (Z.removeEventListener("abort", f), G(), v.aborted) return {
                hook: A,
                outcome: "cancelled"
            };
            throw N
        }
    } catch (M) {
        let D = _1(M);
        return k(`Hooks: Agent hook error: ${D}`), d("tengu_agent_stop_hook_error", {
            durationMs: Date.now() - J,
            errorType: 2,
            agentName: $
        }), {
            hook: A,
            outcome: "non_blocking_error",
            message: f4({
                type: "hook_non_blocking_error",
                hookName: q,
                toolUseID: H,
                hookEvent: K,
                stderr: `Error executing agent hook: ${D}`,
                stdout: "",
                exitCode: 1
            })
        }
    }
}
// @from(Ln 450535, Col 4)
lTq = E(() => {
    H1();
    Bj();
    oY6();
    z4();
    M0();
    V1();
    BB();
    U$();
    pN6();
    GS1();
    Oq();
    JA();
    IX();
    Mc();
    g1();
    s8()
})
// @from(Ln 450560, Col 0)
function iTq(A) {
    let q = rTq(A);
    if (q === 4) return oTq(A);
    if (q === 6) return D_z(A);
    return !1
}
// @from(Ln 450567, Col 0)
function oTq(A) {
    let q = A.split(".").map(Number),
        [K, Y] = q;
    if (q.length !== 4 || K === void 0 || Y === void 0 || q.some((z) => Number.isNaN(z))) return !1;
    if (K === 127) return !1;
    if (K === 0) return !0;
    if (K === 10) return !0;
    if (K === 169 && Y === 254) return !0;
    if (K === 172 && Y >= 16 && Y <= 31) return !0;
    if (K === 100 && Y >= 64 && Y <= 127) return !0;
    if (K === 192 && Y === 168) return !0;
    return !1
}
// @from(Ln 450581, Col 0)
function D_z(A) {
    let q = A.toLowerCase();
    if (q === "::1") return !1;
    if (q === "::") return !0;
    let K = P_z(q);
    if (K !== null) return oTq(K);
    if (q.startsWith("fc") || q.startsWith("fd")) return !0;
    let Y = q.split(":")[0];
    if (Y && Y.length === 4 && Y >= "fe80" && Y <= "febf") return !0;
    return !1
}
// @from(Ln 450593, Col 0)
function X_z(A) {
    let q = [];
    if (A.includes(".")) {
        let H = A.lastIndexOf(":"),
            j = A.slice(H + 1);
        A = A.slice(0, H);
        let J = j.split(".").map(Number);
        if (J.length !== 4 || J.some((M) => !Number.isInteger(M) || M < 0 || M > 255)) return null;
        q = [J[0] << 8 | J[1], J[2] << 8 | J[3]]
    }
    let K = A.indexOf("::"),
        Y, z;
    if (K === -1) Y = A.split(":"), z = [];
    else {
        let H = A.slice(0, K),
            j = A.slice(K + 2);
        Y = H === "" ? [] : H.split(":"), z = j === "" ? [] : j.split(":")
    }
    let w = 8 - q.length - Y.length - z.length;
    if (w < 0) return null;
    let $ = [...Y, ...Array(w).fill("0"), ...z].map((H) => parseInt(H, 16));
    if ($.some((H) => Number.isNaN(H) || H < 0 || H > 65535)) return null;
    return $.push(...q), $.length === 8 ? $ : null
}
// @from(Ln 450618, Col 0)
function P_z(A) {
    let q = X_z(A);
    if (!q) return null;
    if (q[0] === 0 && q[1] === 0 && q[2] === 0 && q[3] === 0 && q[4] === 0 && q[5] === 65535) {
        let K = q[6],
            Y = q[7];
        return `${K>>8}.${K&255}.${Y>>8}.${Y&255}`
    }
    return null
}
// @from(Ln 450629, Col 0)
function aTq(A, q, K) {
    let Y = "all" in q && q.all === !0,
        z = rTq(A);
    if (z !== 0) {
        if (iTq(A)) {
            K(nTq(A, A), "");
            return
        }
        let _ = z === 6 ? 6 : 4;
        if (Y) K(null, [{
            address: A,
            family: _
        }]);
        else K(null, A, _);
        return
    }
    M_z(A, {
        all: !0
    }, (_, w) => {
        if (_) {
            K(_, "");
            return
        }
        for (let {
                address: H
            }
            of w)
            if (iTq(H)) {
                K(nTq(A, H), "");
                return
            } let O = w[0];
        if (!O) {
            K(Object.assign(Error(`ENOTFOUND ${A}`), {
                code: "ENOTFOUND",
                hostname: A
            }), "");
            return
        }
        let $ = O.family === 6 ? 6 : 4;
        if (Y) K(null, w.map((H) => ({
            address: H.address,
            family: H.family === 6 ? 6 : 4
        })));
        else K(null, O.address, $)
    })
}
// @from(Ln 450676, Col 0)
function nTq(A, q) {
    let K = Error(`HTTP hook blocked: ${A} resolves to ${q} (private/link-local address). Loopback (127.0.0.1, ::1) is allowed for local dev.`);
    return Object.assign(K, {
        code: "ERR_HTTP_HOOK_BLOCKED_ADDRESS",
        hostname: A,
        address: q
    })
}
// @from(Ln 450684, Col 4)
sTq = () => {}
// @from(Ln 450685, Col 0)
async function Z_z() {
    let {
        SandboxManager: A
    } = await Promise.resolve().then(() => (Lz(), NG7));
    if (!A.isSandboxingEnabled()) return;
    await A.waitForNetworkInitialization();
    let q = A.getProxyPort();
    if (!q) return;
    return {
        host: "127.0.0.1",
        port: q,
        protocol: "http"
    }
}
// @from(Ln 450700, Col 0)
function G_z() {
    let A = mA();
    return {
        allowedUrls: A.allowedHttpHookUrls,
        allowedEnvVars: A.httpHookAllowedEnvVars
    }
}
// @from(Ln 450708, Col 0)
function f_z(A, q) {
    let Y = q.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${Y}$`).test(A)
}
// @from(Ln 450713, Col 0)
function T_z(A) {
    return A.replace(/[\r\n\x00]/g, "")
}
// @from(Ln 450717, Col 0)
function v_z(A, q) {
    let K = A.replace(/\$\{([A-Z_][A-Z0-9_]*)\}|\$([A-Z_][A-Z0-9_]*)/g, (Y, z, _) => {
        let w = z ?? _;
        if (!q.has(w)) return k(`Hooks: env var $${w} not in allowedEnvVars, skipping interpolation`, {
            level: "warn"
        }), "";
        return process.env[w] ?? ""
    });
    return T_z(K)
}
// @from(Ln 450727, Col 0)
async function Nr8(A, q, K, Y) {
    let z = G_z();
    if (z.allowedUrls !== void 0) {
        if (!z.allowedUrls.some((H) => f_z(A.url, H))) {
            let H = `HTTP hook blocked: ${A.url} does not match any pattern in allowedHttpHookUrls`;
            return k(H, {
                level: "warn"
            }), {
                ok: !1,
                body: "",
                error: H
            }
        }
    }
    let _ = A.timeout ? A.timeout * 1000 : W_z,
        {
            signal: w,
            cleanup: O
        } = mN(AbortSignal.timeout(_), Y);
    try {
        let $ = {
            "Content-Type": "application/json"
        };
        if (A.headers) {
            let D = A.allowedEnvVars ?? [],
                X = z.allowedEnvVars !== void 0 ? D.filter((W) => z.allowedEnvVars.includes(W)) : D,
                P = new Set(X);
            for (let [W, Z] of Object.entries(A.headers)) $[W] = v_z(Z, P)
        }
        let H = await Z_z(),
            j = !H && py() !== void 0 && !Oo(A.url);
        if (H) k(`Hooks: HTTP hook POST to ${A.url} (via sandbox proxy :${H.port})`);
        else if (j) k(`Hooks: HTTP hook POST to ${A.url} (via env-var proxy)`);
        else k(`Hooks: HTTP hook POST to ${A.url}`);
        let J = await X8.post(A.url, K, {
            headers: $,
            signal: w,
            responseType: "text",
            validateStatus: () => !0,
            maxRedirects: 0,
            proxy: H ?? !1,
            lookup: H || j ? void 0 : aTq
        });
        O();
        let M = J.data ?? "";
        return k(`Hooks: HTTP hook response status ${J.status}, body length ${M.length}`), {
            ok: J.status >= 200 && J.status < 300,
            statusCode: J.status,
            body: M
        }
    } catch ($) {
        if (O(), w.aborted) return {
            ok: !1,
            body: "",
            aborted: !0
        };
        let H = _1($);
        return k(`Hooks: HTTP hook error: ${H}`, {
            level: "error"
        }), {
            ok: !1,
            body: "",
            error: H
        }
    }
}
// @from(Ln 450793, Col 4)
W_z = 600000
// @from(Ln 450794, Col 4)
tTq = E(() => {
    kK();
    H1();
    pN6();
    sTq();
    dV();
    i8();
    s8()
})
// @from(Ln 450803, Col 4)
PR8 = {}
// @from(Ln 450847, Col 0)
function LQ8() {
    let A = process.env.CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS,
        q = A ? parseInt(A, 10) : NaN;
    return Number.isFinite(q) && q > 0 ? q : V_z
}
// @from(Ln 450853, Col 0)
function eTq({
    processId: A,
    hookId: q,
    shellCommand: K,
    asyncResponse: Y,
    hookEvent: z,
    hookName: _,
    command: w,
    asyncRewake: O,
    pluginId: $
}) {
    if (O) return K.result.then(async (H) => {
        await new Promise((M) => setImmediate(M));
        let j = await K.taskOutput.getStdout(),
            J = K.taskOutput.getStderr();
        if (K.cleanup(), p0({
                hookId: q,
                hookName: _,
                hookEvent: z,
                output: j + J,
                stdout: j,
                stderr: J,
                exitCode: H.code,
                outcome: H.code === 0 ? "success" : "error"
            }), H.code === 2) w0({
            value: af(`Stop hook blocking error from command "${_}": ${J||j}`),
            mode: "task-notification"
        })
    }), !0;
    if (!K.background(A)) return !1;
    return n4q({
        processId: A,
        hookId: q,
        asyncResponse: Y,
        hookEvent: z,
        hookName: _,
        command: w,
        shellCommand: K,
        pluginId: $
    }), !0
}
// @from(Ln 450895, Col 0)
function TS1() {
    if (!!q7()) return !1;
    return !l_()
}
// @from(Ln 450900, Col 0)
function $w(A, q, K) {
    let Y = q ?? R1(),
        z = K?.agentType ?? Pp();
    return {
        session_id: Y,
        transcript_path: cf(Y),
        cwd: G1(),
        permission_mode: A,
        agent_id: K?.agentId,
        agent_type: z
    }
}
// @from(Ln 450913, Col 0)
function qvq(A) {
    let q = i1(A),
        K = gN6().safeParse(q);
    if (K.success) return k("Successfully parsed and validated hook JSON output"), {
        json: K.data
    };
    return {
        validationError: `Hook JSON output validation failed:
${K.error.issues.map((z)=>`  - ${z.path.join(".")}: ${z.message}`).join(`
`)}

The hook's output was: ${B6(q,null,2)}`
    }
}
// @from(Ln 450928, Col 0)
function Kvq(A) {
    let q = A.trim();
    if (!q.startsWith("{")) return k("Hook output does not start with {, treating as plain text"), {
        plainText: A
    };
    try {
        let K = qvq(q);
        if ("json" in K) return K;
        let Y = `${K.validationError}

Expected schema:
${B6({continue:"boolean (optional)",suppressOutput:"boolean (optional)",stopReason:"string (optional)",decision:'"approve" | "block" (optional)',reason:"string (optional)",systemMessage:"string (optional)",permissionDecision:'"allow" | "deny" | "ask" (optional)',hookSpecificOutput:{"for PreToolUse":{hookEventName:'"PreToolUse"',permissionDecision:'"allow" | "deny" | "ask" (optional)',permissionDecisionReason:"string (optional)",updatedInput:"object (optional) - Modified tool input to use"},"for UserPromptSubmit":{hookEventName:'"UserPromptSubmit"',additionalContext:"string (required)"},"for PostToolUse":{hookEventName:'"PostToolUse"',additionalContext:"string (optional)"}}},null,2)}`;
        return k(Y), {
            plainText: A,
            validationError: Y
        }
    } catch (K) {
        return k(`Failed to parse hook output as JSON: ${K}`), {
            plainText: A
        }
    }
}
// @from(Ln 450951, Col 0)
function Yvq(A) {
    let q = A.trim();
    if (q === "") {
        let K = gN6().safeParse({});
        if (K.success) return k("HTTP hook returned empty body, treating as empty JSON object"), {
            json: K.data
        }
    }
    if (!q.startsWith("{")) {
        let K = `HTTP hook must return JSON, but got non-JSON response body: ${q.length>200?q.slice(0,200)+"…":q}`;
        return k(K), {
            validationError: K
        }
    }
    try {
        let K = qvq(q);
        if ("json" in K) return K;
        return k(K.validationError), K
    } catch (K) {
        let Y = `HTTP hook must return valid JSON, but parsing failed: ${K}`;
        return k(Y), {
            validationError: Y
        }
    }
}
// @from(Ln 450977, Col 0)
function Vr8({
    json: A,
    command: q,
    hookName: K,
    toolUseID: Y,
    hookEvent: z,
    expectedHookEvent: _,
    stdout: w,
    stderr: O,
    exitCode: $,
    durationMs: H
}) {
    let j = {},
        J = A;
    if (J.continue === !1) {
        if (j.preventContinuation = !0, J.stopReason) j.stopReason = J.stopReason
    }
    if (A.decision) switch (A.decision) {
        case "approve":
            j.permissionBehavior = "allow";
            break;
        case "block":
            j.permissionBehavior = "deny", j.blockingError = {
                blockingError: A.reason || "Blocked by hook",
                command: q
            };
            break;
        default:
            throw Error(`Unknown hook decision type: ${A.decision}. Valid types are: approve, block`)
    }
    if (A.systemMessage) j.systemMessage = A.systemMessage;
    if (A.hookSpecificOutput?.hookEventName === "PreToolUse" && A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
        case "allow":
            j.permissionBehavior = "allow";
            break;
        case "deny":
            j.permissionBehavior = "deny", j.blockingError = {
                blockingError: A.reason || "Blocked by hook",
                command: q
            };
            break;
        case "ask":
            j.permissionBehavior = "ask";
            break;
        default:
            throw Error(`Unknown hook permissionDecision type: ${A.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask`)
    }
    if (j.permissionBehavior !== void 0 && A.reason !== void 0) j.hookPermissionDecisionReason = A.reason;
    if (A.hookSpecificOutput) {
        if (_ && A.hookSpecificOutput.hookEventName !== _) throw Error(`Hook returned incorrect event name: expected '${_}' but got '${A.hookSpecificOutput.hookEventName}'. Full stdout: ${B6(A,null,2)}`);
        switch (A.hookSpecificOutput.hookEventName) {
            case "PreToolUse":
                if (A.hookSpecificOutput.permissionDecision) switch (A.hookSpecificOutput.permissionDecision) {
                    case "allow":
                        j.permissionBehavior = "allow";
                        break;
                    case "deny":
                        j.permissionBehavior = "deny", j.blockingError = {
                            blockingError: A.hookSpecificOutput.permissionDecisionReason || A.reason || "Blocked by hook",
                            command: q
                        };
                        break;
                    case "ask":
                        j.permissionBehavior = "ask";
                        break
                }
                if (j.hookPermissionDecisionReason = A.hookSpecificOutput.permissionDecisionReason, A.hookSpecificOutput.updatedInput) j.updatedInput = A.hookSpecificOutput.updatedInput;
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "UserPromptSubmit":
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "SessionStart":
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "Setup":
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "SubagentStart":
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "PostToolUse":
                if (j.additionalContext = A.hookSpecificOutput.additionalContext, A.hookSpecificOutput.updatedMCPToolOutput) j.updatedMCPToolOutput = A.hookSpecificOutput.updatedMCPToolOutput;
                break;
            case "PostToolUseFailure":
                j.additionalContext = A.hookSpecificOutput.additionalContext;
                break;
            case "PermissionRequest":
                if (A.hookSpecificOutput.decision) {
                    if (j.permissionRequestResult = A.hookSpecificOutput.decision, j.permissionBehavior = A.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", A.hookSpecificOutput.decision.behavior === "allow" && A.hookSpecificOutput.decision.updatedInput) j.updatedInput = A.hookSpecificOutput.decision.updatedInput
                }
                break;
            case "Elicitation":
                if (A.hookSpecificOutput.action) {
                    if (j.elicitationResponse = {
                            action: A.hookSpecificOutput.action,
                            content: A.hookSpecificOutput.content
                        }, A.hookSpecificOutput.action === "decline") j.blockingError = {
                        blockingError: A.reason || "Elicitation denied by hook",
                        command: q
                    }
                }
                break;
            case "ElicitationResult":
                if (A.hookSpecificOutput.action) {
                    if (j.elicitationResultResponse = {
                            action: A.hookSpecificOutput.action,
                            content: A.hookSpecificOutput.content
                        }, A.hookSpecificOutput.action === "decline") j.blockingError = {
                        blockingError: A.reason || "Elicitation result blocked by hook",
                        command: q
                    }
                }
                break
        }
    }
    return {
        ...j,
        message: j.blockingError ? f4({
            type: "hook_blocking_error",
            hookName: K,
            toolUseID: Y,
            hookEvent: z,
            blockingError: j.blockingError
        }) : f4({
            type: "hook_success",
            hookName: K,
            toolUseID: Y,
            hookEvent: z,
            content: "",
            stdout: w,
            stderr: O,
            exitCode: $,
            command: q,
            durationMs: H
        })
    }
}
// @from(Ln 451115, Col 0)
async function vS1(A, q, K, Y, z, _, w, O, $, H, j, J) {
    let M = y8() === "windows",
        D = M ? (N6) => GP(N6) : (N6) => N6,
        X = qY(),
        P = A.command,
        W;
    if (O) P = ZL(P, D(O));
    if (M && P.trim().match(/\.sh(\s|$|")/)) {
        if (!P.trim().startsWith("bash ")) P = `bash ${P}`
    }
    let Z = process.env.CLAUDE_CODE_SHELL_PREFIX ? M91(process.env.CLAUDE_CODE_SHELL_PREFIX, P) : P,
        G = A.timeout ? A.timeout * 1000 : T$,
        f = {
            ...process.env,
            CLAUDE_PROJECT_DIR: D(X)
        };
    if (O) f.CLAUDE_PLUGIN_ROOT = D(O);
    if (W)
        for (let [N6, $6] of Object.entries(W)) {
            let n = N6.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
            f[`CLAUDE_PLUGIN_OPTION_${n}`] = String($6)
        }
    if (H) f.CLAUDE_PLUGIN_ROOT = D(H);
    if ((q === "SessionStart" || q === "Setup") && w !== void 0) f.CLAUDE_ENV_FILE = await B97(q, w);
    let v = M ? Il1() : !0,
        N = G1(),
        V = await uK(N) ? N : AA();
    if (V !== N) k(`Hooks: cwd ${N} not found, falling back to original cwd`, {
        level: "warn"
    });
    let L = N_z(Z, [], {
            env: f,
            cwd: V,
            shell: v,
            windowsHide: !0
        }),
        h = new kw(`hook_${L.pid}`, null),
        R = H91(L, z, G, h),
        u = !1,
        I = !1;
    if ((A.async || A.asyncRewake) && !j) {
        let N6 = `async_hook_${L.pid}`;
        if (k(`Hooks: Config-based async hook, backgrounding process ${N6}`), L.stdin.write(Y + `
`, "utf8"), L.stdin.end(), I = !0, eTq({
                processId: N6,
                hookId: _,
                shellCommand: R,
                asyncResponse: {
                    async: !0,
                    asyncTimeout: G
                },
                hookEvent: q,
                hookName: K,
                command: A.command,
                asyncRewake: A.asyncRewake,
                pluginId: $
            })) return {
            stdout: "",
            stderr: "",
            output: "",
            status: 0,
            backgrounded: !0
        }
    }
    let g = "",
        B = "",
        b = "";
    L.stdout.setEncoding("utf8"), L.stderr.setEncoding("utf8");
    let p = !1,
        Q = null,
        U = new Promise((N6) => {
            Q = N6
        }),
        r = new Set,
        e = Promise.resolve(),
        Y6 = "";
    L.stdout.on("data", (N6) => {
        if (g += N6, b += N6, J) {
            Y6 += N6;
            let $6 = Y6.split(`
`);
            Y6 = $6.pop() ?? "";
            for (let n of $6) {
                let o = n.trim();
                if (!o) continue;
                try {
                    let a = i1(o),
                        i = FTq().safeParse(a);
                    if (i.success) {
                        r.add(o), k(`Hooks: Detected prompt request from hook: ${o}`);
                        let l = i.data,
                            q6 = J;
                        e = e.then(async () => {
                            try {
                                let w6 = await q6(l);
                                L.stdin.write(B6(w6) + `
`, "utf8")
                            } catch (w6) {
                                k(`Hooks: Prompt request handling failed: ${w6}`), L.stdin.destroy()
                            }
                        });
                        continue
                    }
                } catch {}
            }
        }
        if (!p && g.trim().includes("}")) {
            p = !0, k(`Hooks: Checking initial response for async: ${g.trim()}`);
            try {
                let $6 = i1(g.trim());
                if (k(`Hooks: Parsed initial response: ${B6($6)}`), uh($6) && !j) {
                    let n = `async_hook_${L.pid}`;
                    if (k(`Hooks: Detected async hook, backgrounding process ${n}`), eTq({
                            processId: n,
                            hookId: _,
                            shellCommand: R,
                            asyncResponse: $6,
                            hookEvent: q,
                            hookName: K,
                            command: A.command,
                            pluginId: $
                        })) u = !0, Q?.({
                        stdout: g,
                        stderr: B,
                        output: b,
                        status: 0
                    })
                } else if (uh($6) && j) k("Hooks: Detected async hook but forceSyncExecution is true, waiting for completion");
                else k("Hooks: Initial response is not async, continuing normal processing")
            } catch ($6) {
                k(`Hooks: Failed to parse initial response as JSON: ${$6}`)
            }
        }
    }), L.stderr.on("data", (N6) => {
        B += N6, b += N6
    });
    let H6 = yE1({
            hookId: _,
            hookName: K,
            hookEvent: q,
            getOutput: async () => ({
                stdout: g,
                stderr: B,
                output: b
            })
        }),
        J6 = new Promise((N6) => {
            L.stdout.on("end", () => N6())
        }),
        K6 = new Promise((N6) => {
            L.stderr.on("end", () => N6())
        }),
        s = I ? Promise.resolve() : new Promise((N6, $6) => {
            if (L.stdin.on("error", (n) => {
                    if (!J) $6(n);
                    else k(`Hooks: stdin error during prompt flow (likely process exited): ${n}`)
                }), L.stdin.write(Y + `
`, "utf8"), !J) L.stdin.end();
            N6()
        }),
        X6 = new Promise((N6, $6) => {
            L.on("error", $6)
        }),
        z6 = new Promise((N6) => {
            let $6 = null;
            L.on("close", (n) => {
                $6 = n ?? 1, Promise.all([J6, K6]).then(() => {
                    let o = r.size === 0 ? g : g.split(`
`).filter((a) => !r.has(a.trim())).join(`
`);
                    N6({
                        stdout: o,
                        stderr: B,
                        output: b,
                        status: $6,
                        aborted: z.aborted
                    })
                })
            })
        });
    try {
        await Promise.race([s, X6]);
        let N6 = await Promise.race([U, z6, X6]);
        return await e, N6
    } catch (N6) {
        let $6 = N6;
        if ($6.code === "EPIPE") {
            k("EPIPE error while writing to hook stdin (hook command likely closed early)");
            let n = "Hook command closed stdin before hook input was fully written (EPIPE)";
            return {
                stdout: "",
                stderr: n,
                output: n,
                status: 1
            }
        } else if ($6.code === "ABORT_ERR") return {
            stdout: "",
            stderr: "Hook cancelled",
            output: "Hook cancelled",
            status: 1,
            aborted: !0
        };
        else {
            let o = `Error occurred while executing hook command: ${_1(N6)}`;
            return {
                stdout: "",
                stderr: o,
                output: o,
                status: 1
            }
        }
    } finally {
        if (H6(), !u) R.cleanup()
    }
}
// @from(Ln 451331, Col 0)
function k_z(A, q) {
    if (!q || q === "*") return !0;
    if (/^[a-zA-Z0-9_|]+$/.test(q)) {
        if (q.includes("|")) return q.split("|").map((Y) => EG(Y.trim())).includes(A);
        return A === EG(q)
    }
    try {
        let K = new RegExp(q);
        if (K.test(A)) return !0;
        for (let Y of v57(A))
            if (K.test(Y)) return !0;
        return !1
    } catch {
        return k(`Invalid regex pattern in hook matcher: ${q}`), !1
    }
}
// @from(Ln 451348, Col 0)
function zvq(A) {
    return A.hook.type === "callback" && A.hook.internal === !0
}
// @from(Ln 451352, Col 0)
function fS1(A, q) {
    return `${A.pluginRoot??A.skillRoot??""}\x00${q}`
}
// @from(Ln 451356, Col 0)
function _vq(A) {
    let q = A.filter((Y) => Y.pluginId);
    if (q.length === 0) return;
    let K = {};
    for (let Y of q) {
        let z = Y.pluginId.lastIndexOf("@"),
            w = z > 0 && nV.has(Y.pluginId.slice(z + 1)) ? Y.pluginId : "third-party";
        K[w] = (K[w] || 0) + 1
    }
    return K
}
// @from(Ln 451368, Col 0)
function wvq(A) {
    let q = {};
    for (let K of A) q[K.hook.type] = (q[K.hook.type] || 0) + 1;
    return q
}
// @from(Ln 451374, Col 0)
function E_z(A, q, K) {
    let Y = [...EM6()?.[K] ?? []],
        z = GL(),
        _ = Xp()?.[K];
    if (_)
        for (let w of _) {
            if (z && "pluginRoot" in w) continue;
            Y.push(w)
        }
    if (!z && A !== void 0) {
        let w = jW1(A, q, K).get(K);
        if (w)
            for (let $ of w) Y.push($);
        let O = i24(A, q, K).get(K);
        if (O)
            for (let $ of O) Y.push($)
    }
    return Y
}
// @from(Ln 451394, Col 0)
function NS1(A, q, K) {
    let Y = EM6()?.[A];
    if (Y && Y.length > 0) return !0;
    let z = Xp()?.[A];
    if (z && z.length > 0) return !0;
    if (q?.sessionHooks.get(K)?.hooks[A]) return !0;
    return !1
}
// @from(Ln 451403, Col 0)
function kr8(A, q, K, Y) {
    try {
        let z = E_z(A, q, K),
            _ = void 0;
        switch (Y.hook_event_name) {
            case "PreToolUse":
            case "PostToolUse":
            case "PostToolUseFailure":
            case "PermissionRequest":
                _ = Y.tool_name;
                break;
            case "SessionStart":
                _ = Y.source;
                break;
            case "Setup":
                _ = Y.trigger;
                break;
            case "PreCompact":
            case "PostCompact":
                _ = Y.trigger;
                break;
            case "Notification":
                _ = Y.notification_type;
                break;
            case "SessionEnd":
                _ = Y.reason;
                break;
            case "SubagentStart":
                _ = Y.agent_type;
                break;
            case "SubagentStop":
                _ = Y.agent_type;
                break;
            case "TeammateIdle":
            case "TaskCompleted":
                break;
            case "Elicitation":
                _ = Y.mcp_server_name;
                break;
            case "ElicitationResult":
                _ = Y.mcp_server_name;
                break;
            case "ConfigChange":
                _ = Y.source;
                break;
            case "InstructionsLoaded":
                _ = Y.load_reason;
                break;
            default:
                break
        }
        k(`Getting matching hook commands for ${K} with query: ${_}`), k(`Found ${z.length} hook matchers in settings`);
        let O = (_ ? z.filter((W) => !W.matcher || k_z(_, W.matcher)) : z).flatMap((W) => {
                let Z = "pluginRoot" in W ? W.pluginRoot : void 0,
                    G = "pluginId" in W ? W.pluginId : void 0,
                    f = "skillRoot" in W ? W.skillRoot : void 0,
                    v = Z ? "pluginName" in W ? `plugin:${W.pluginName}` : "plugin" : f ? "skillName" in W ? `skill:${W.skillName}` : "skill" : "settings";
                return W.hooks.map((N) => ({
                    hook: N,
                    pluginRoot: Z,
                    pluginId: G,
                    skillRoot: f,
                    hookSource: v
                }))
            }),
            $ = Array.from(new Map(O.filter((W) => W.hook.type === "command").map((W) => [fS1(W, W.hook.command), W])).values()),
            H = Array.from(new Map(O.filter((W) => W.hook.type === "prompt").map((W) => [fS1(W, W.hook.prompt), W])).values()),
            j = Array.from(new Map(O.filter((W) => W.hook.type === "agent").map((W) => [fS1(W, W.hook.prompt), W])).values()),
            J = Array.from(new Map(O.filter((W) => W.hook.type === "http").map((W) => [fS1(W, W.hook.url), W])).values()),
            M = O.filter((W) => W.hook.type === "callback"),
            D = O.filter((W) => W.hook.type === "function"),
            X = [...$, ...H, ...j, ...J, ...M, ...D],
            P = K === "SessionStart" || K === "Setup" ? X.filter((W) => {
                if (W.hook.type === "http") return k(`Skipping HTTP hook ${W.hook.url} — HTTP hooks are not supported for ${K}`), !1;
                return !0
            }) : X;
        return k(`Matched ${P.length} unique hooks for query "${_||"no match query"}" (${O.length} before deduplication)`), P
    } catch {
        return []
    }
}
// @from(Ln 451485, Col 0)
function yF8(A, q) {
    return `${A} hook error: ${q.blockingError}`
}
// @from(Ln 451489, Col 0)
function Ep8(A) {
    return `Stop hook feedback:
${A.blockingError}`
}
// @from(Ln 451494, Col 0)
function yp8(A) {
    return `TeammateIdle hook feedback:
${A.blockingError}`
}
// @from(Ln 451499, Col 0)
function $i6(A) {
    return `TaskCompleted hook feedback:
${A.blockingError}`
}
// @from(Ln 451504, Col 0)
function Er8(A) {
    return `UserPromptSubmit operation blocked by hook:
${A.blockingError}`
}
// @from(Ln 451508, Col 0)
async function* Ax({
    hookInput: A,
    toolUseID: q,
    matchQuery: K,
    signal: Y,
    timeoutMs: z = T$,
    toolUseContext: _,
    messages: w,
    forceSyncExecution: O,
    requestPrompt: $,
    toolInputSummary: H
}) {
    if (sI6()) return;
    if (t6(process.env.CLAUDE_CODE_SIMPLE)) return;
    let j = A.hook_event_name,
        J = K ? `${j}:${K}` : j,
        M = $?.(J, H);
    if (TS1()) {
        k(`Skipping ${J} hook execution - workspace trust not accepted`);
        return
    }
    let D = _ ? _.getAppState() : void 0,
        X = _?.agentId ?? R1(),
        P = kr8(D, X, j, A);
    if (P.length === 0) return;
    if (Y?.aborted) return;
    let W = P.filter((I) => !zvq(I));
    if (W.length > 0) {
        let I = _vq(W),
            g = wvq(W);
        d("tengu_run_hook", {
            hookName: J,
            numCommands: W.length,
            hookTypeCounts: B6(g),
            ...I && {
                pluginHookCounts: B6(I)
            }
        })
    }
    let Z = a$() ? Avq(P) : [];
    if (a$()) pw("hook_execution_start", {
        hook_event: j,
        hook_name: J,
        num_hooks: String(P.length),
        managed_only: String(GL()),
        hook_definitions: B6(Z),
        hook_source: GL() ? "policySettings" : "merged"
    });
    let G = A_4(j, J, P.length, B6(Z));
    for (let {
            hook: I
        }
        of P) yield {
        message: {
            type: "progress",
            data: {
                type: "hook_progress",
                hookEvent: j,
                hookName: J,
                command: dI(I),
                ...I.type === "prompt" ? {
                    promptText: I.prompt
                } : {},
                ..."statusMessage" in I && I.statusMessage != null ? {
                    statusMessage: I.statusMessage
                } : {}
            },
            parentToolUseID: q,
            toolUseID: q,
            timestamp: new Date().toISOString(),
            uuid: CE()
        }
    };
    let f = Date.now(),
        v;

    function N() {
        if (v !== void 0) return v;
        try {
            return v = {
                ok: !0,
                value: B6(A)
            }
        } catch (I) {
            return _6(Error(`Failed to stringify hook ${J} input`, {
                cause: I
            })), v = {
                ok: !1,
                error: I
            }
        }
    }
    let V = P.map(async function*({
            hook: I,
            pluginRoot: g,
            pluginId: B,
            skillRoot: b
        }, p) {
            if (I.type === "callback") {
                let J6 = I.timeout ? I.timeout * 1000 : z,
                    {
                        signal: K6,
                        cleanup: s
                    } = mN(AbortSignal.timeout(J6), Y);
                yield L_z({
                    toolUseID: q,
                    hook: I,
                    hookEvent: j,
                    hookInput: A,
                    signal: K6,
                    hookIndex: p,
                    toolUseContext: _
                }).finally(s);
                return
            }
            if (I.type === "function") {
                if (!w) {
                    yield {
                        message: f4({
                            type: "hook_error_during_execution",
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            content: "Messages not provided for function hook"
                        }),
                        outcome: "non_blocking_error",
                        hook: I
                    };
                    return
                }
                yield y_z({
                    hook: I,
                    messages: w,
                    hookName: J,
                    toolUseID: q,
                    hookEvent: j,
                    timeoutMs: z,
                    signal: Y
                });
                return
            }
            let Q = I.timeout ? I.timeout * 1000 : z,
                {
                    signal: U,
                    cleanup: r
                } = mN(AbortSignal.timeout(Q), Y),
                e = CE(),
                Y6 = Date.now(),
                H6 = dI(I);
            try {
                let J6 = N();
                if (!J6.ok) {
                    yield {
                        message: f4({
                            type: "hook_error_during_execution",
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            content: `Failed to prepare hook input: ${_1(J6.error)}`,
                            command: H6,
                            durationMs: Date.now() - Y6
                        }),
                        outcome: "non_blocking_error",
                        hook: I
                    };
                    return
                }
                let K6 = J6.value;
                if (I.type === "prompt") {
                    if (!_) throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
                    let n = await QTq(I, J, j, K6, U, _, w, q);
                    if (n.message?.type === "attachment") {
                        let o = n.message.attachment;
                        if (o.type === "hook_success" || o.type === "hook_non_blocking_error") o.command = H6, o.durationMs = Date.now() - Y6
                    }
                    yield n, r?.();
                    return
                }
                if (I.type === "agent") {
                    if (!_) throw Error("ToolUseContext is required for agent hooks. This is a bug.");
                    if (!w) throw Error("Messages are required for agent hooks. This is a bug.");
                    let n = await cTq(I, J, j, K6, U, _, q, w, "agent_type" in A ? A.agent_type : void 0);
                    if (n.message?.type === "attachment") {
                        let o = n.message.attachment;
                        if (o.type === "hook_success" || o.type === "hook_non_blocking_error") o.command = H6, o.durationMs = Date.now() - Y6
                    }
                    yield n, r?.();
                    return
                }
                if (I.type === "http") {
                    nF8(e, J, j);
                    let n = await Nr8(I, j, K6, Y);
                    if (r?.(), n.aborted) {
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: "Hook cancelled",
                            stdout: "",
                            stderr: "",
                            exitCode: void 0,
                            outcome: "cancelled"
                        }), yield {
                            message: f4({
                                type: "hook_cancelled",
                                hookName: J,
                                toolUseID: q,
                                hookEvent: j
                            }),
                            outcome: "cancelled",
                            hook: I
                        };
                        return
                    }
                    if (n.error || !n.ok) {
                        let i = n.error || `HTTP ${n.statusCode} from ${I.url}`;
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: i,
                            stdout: "",
                            stderr: i,
                            exitCode: n.statusCode,
                            outcome: "error"
                        }), yield {
                            message: f4({
                                type: "hook_non_blocking_error",
                                hookName: J,
                                toolUseID: q,
                                hookEvent: j,
                                stderr: i,
                                stdout: "",
                                exitCode: n.statusCode ?? 0
                            }),
                            outcome: "non_blocking_error",
                            hook: I
                        };
                        return
                    }
                    let {
                        json: o,
                        validationError: a
                    } = Yvq(n.body);
                    if (a) {
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: n.body,
                            stdout: n.body,
                            stderr: `JSON validation failed: ${a}`,
                            exitCode: n.statusCode,
                            outcome: "error"
                        }), yield {
                            message: f4({
                                type: "hook_non_blocking_error",
                                hookName: J,
                                toolUseID: q,
                                hookEvent: j,
                                stderr: `JSON validation failed: ${a}`,
                                stdout: n.body,
                                exitCode: n.statusCode ?? 0
                            }),
                            outcome: "non_blocking_error",
                            hook: I
                        };
                        return
                    }
                    if (o && uh(o)) {
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: n.body,
                            stdout: n.body,
                            stderr: "",
                            exitCode: n.statusCode,
                            outcome: "success"
                        }), yield {
                            outcome: "success",
                            hook: I
                        };
                        return
                    }
                    if (o) {
                        let i = Vr8({
                            json: o,
                            command: I.url,
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            expectedHookEvent: j,
                            stdout: n.body,
                            stderr: "",
                            exitCode: n.statusCode
                        });
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: n.body,
                            stdout: n.body,
                            stderr: "",
                            exitCode: n.statusCode,
                            outcome: "success"
                        }), yield {
                            ...i,
                            outcome: "success",
                            hook: I
                        };
                        return
                    }
                    return
                }
                nF8(e, J, j);
                let s = await vS1(I, j, J, K6, U, e, p, g, B, b, O, M);
                r?.();
                let X6 = Date.now() - Y6;
                if (s.backgrounded) {
                    yield {
                        outcome: "success",
                        hook: I
                    };
                    return
                }
                if (s.aborted) {
                    p0({
                        hookId: e,
                        hookName: J,
                        hookEvent: j,
                        output: s.output,
                        stdout: s.stdout,
                        stderr: s.stderr,
                        exitCode: s.status,
                        outcome: "cancelled"
                    }), yield {
                        message: f4({
                            type: "hook_cancelled",
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            command: H6,
                            durationMs: X6
                        }),
                        outcome: "cancelled",
                        hook: I
                    };
                    return
                }
                let {
                    json: z6,
                    plainText: N6,
                    validationError: $6
                } = Kvq(s.stdout);
                if ($6) {
                    p0({
                        hookId: e,
                        hookName: J,
                        hookEvent: j,
                        output: s.output,
                        stdout: s.stdout,
                        stderr: `JSON validation failed: ${$6}`,
                        exitCode: 1,
                        outcome: "error"
                    }), yield {
                        message: f4({
                            type: "hook_non_blocking_error",
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            stderr: `JSON validation failed: ${$6}`,
                            stdout: s.stdout,
                            exitCode: 1,
                            command: H6,
                            durationMs: X6
                        }),
                        outcome: "non_blocking_error",
                        hook: I
                    };
                    return
                }
                if (z6) {
                    if (uh(z6)) {
                        yield {
                            outcome: "success",
                            hook: I
                        };
                        return
                    }
                    let n = Vr8({
                        json: z6,
                        command: H6,
                        hookName: J,
                        toolUseID: q,
                        hookEvent: j,
                        expectedHookEvent: j,
                        stdout: s.stdout,
                        stderr: s.stderr,
                        exitCode: s.status,
                        durationMs: X6
                    });
                    if (FN6(z6) && !z6.suppressOutput && N6 && s.status === 0) {
                        let o = `${O1.bold(J)} completed`;
                        p0({
                            hookId: e,
                            hookName: J,
                            hookEvent: j,
                            output: s.output,
                            stdout: s.stdout,
                            stderr: s.stderr,
                            exitCode: s.status,
                            outcome: "success"
                        }), yield {
                            ...n,
                            message: n.message || f4({
                                type: "hook_success",
                                hookName: J,
                                toolUseID: q,
                                hookEvent: j,
                                content: o,
                                stdout: s.stdout,
                                stderr: s.stderr,
                                exitCode: s.status,
                                command: H6,
                                durationMs: X6
                            }),
                            outcome: "success",
                            hook: I
                        };
                        return
                    }
                    p0({
                        hookId: e,
                        hookName: J,
                        hookEvent: j,
                        output: s.output,
                        stdout: s.stdout,
                        stderr: s.stderr,
                        exitCode: s.status,
                        outcome: s.status === 0 ? "success" : "error"
                    }), yield {
                        ...n,
                        outcome: "success",
                        hook: I
                    };
                    return
                }
                if (s.status === 0) {
                    p0({
                        hookId: e,
                        hookName: J,
                        hookEvent: j,
                        output: s.output,
                        stdout: s.stdout,
                        stderr: s.stderr,
                        exitCode: s.status,
                        outcome: "success"
                    }), yield {
                        message: f4({
                            type: "hook_success",
                            hookName: J,
                            toolUseID: q,
                            hookEvent: j,
                            content: s.stdout.trim(),
                            stdout: s.stdout,
                            stderr: s.stderr,
                            exitCode: s.status,
                            command: H6,
                            durationMs: X6
                        }),
                        outcome: "success",
                        hook: I
                    };
                    return
                }
                if (s.status === 2) {
                    p0({
                        hookId: e,
                        hookName: J,
                        hookEvent: j,
                        output: s.output,
                        stdout: s.stdout,
                        stderr: s.stderr,
                        exitCode: s.status,
                        outcome: "error"
                    }), yield {
                        blockingError: {
                            blockingError: `[${I.command}]: ${s.stderr||"No stderr output"}`,
                            command: I.command
                        },
                        outcome: "blocking",
                        hook: I
                    };
                    return
                }
                p0({
                    hookId: e,
                    hookName: J,
                    hookEvent: j,
                    output: s.output,
                    stdout: s.stdout,
                    stderr: s.stderr,
                    exitCode: s.status,
                    outcome: "error"
                }), yield {
                    message: f4({
                        type: "hook_non_blocking_error",
                        hookName: J,
                        toolUseID: q,
                        hookEvent: j,
                        stderr: `Failed with non-blocking status code: ${s.stderr.trim()||"No stderr output"}`,
                        stdout: s.stdout,
                        exitCode: s.status,
                        command: H6,
                        durationMs: X6
                    }),
                    outcome: "non_blocking_error",
                    hook: I
                };
                return
            } catch (J6) {
                r?.();
                let K6 = J6 instanceof Error ? J6.message : String(J6);
                p0({
                    hookId: e,
                    hookName: J,
                    hookEvent: j,
                    output: `Failed to run: ${K6}`,
                    stdout: "",
                    stderr: `Failed to run: ${K6}`,
                    exitCode: 1,
                    outcome: "error"
                }), yield {
                    message: f4({
                        type: "hook_non_blocking_error",
                        hookName: J,
                        toolUseID: q,
                        hookEvent: j,
                        stderr: `Failed to run: ${K6}`,
                        stdout: "",
                        exitCode: 1,
                        command: H6,
                        durationMs: Date.now() - Y6
                    }),
                    outcome: "non_blocking_error",
                    hook: I
                };
                return
            }
        }),
        L = {
            success: 0,
            blocking: 0,
            non_blocking_error: 0,
            cancelled: 0
        },
        h, R = new Map(P.map((I) => [I.hook, I.hookSource]));
    for await (let I of f01(V)) {
        if (L[I.outcome]++, I.preventContinuation) k(`Hook ${j} (${dI(I.hook)}) requested preventContinuation`), yield {
            preventContinuation: !0,
            stopReason: I.stopReason
        };
        if (I.blockingError) yield {
            blockingError: I.blockingError
        };
        if (I.message) yield {
            message: I.message
        };
        if (I.systemMessage) yield {
            message: f4({
                type: "hook_system_message",
                content: I.systemMessage,
                hookName: J,
                toolUseID: q,
                hookEvent: j
            })
        };
        if (I.additionalContext) k(`Hook ${j} (${dI(I.hook)}) provided additionalContext (${I.additionalContext.length} chars)`), yield {
            additionalContexts: [I.additionalContext]
        };
        if (I.updatedMCPToolOutput) k(`Hook ${j} (${dI(I.hook)}) replaced MCP tool output`), yield {
            updatedMCPToolOutput: I.updatedMCPToolOutput
        };
        if (I.permissionBehavior) switch (k(`Hook ${j} (${dI(I.hook)}) returned permissionDecision: ${I.permissionBehavior}${I.hookPermissionDecisionReason?` (reason: ${I.hookPermissionDecisionReason})`:""}`), I.permissionBehavior) {
            case "deny":
                h = "deny";
                break;
            case "ask":
                if (h !== "deny") h = "ask";
                break;
            case "allow":
                if (!h) h = "allow";
                break;
            case "passthrough":
                break
        }
        if (h !== void 0) {
            let g = I.updatedInput && (I.permissionBehavior === "allow" || I.permissionBehavior === "ask") ? I.updatedInput : void 0;
            if (g) k(`Hook ${j} (${dI(I.hook)}) modified tool input keys: [${Object.keys(g).join(", ")}]`);
            yield {
                permissionBehavior: h,
                hookPermissionDecisionReason: I.hookPermissionDecisionReason,
                hookSource: R.get(I.hook),
                updatedInput: g
            }
        }
        if (I.updatedInput && I.permissionBehavior === void 0) k(`Hook ${j} (${dI(I.hook)}) modified tool input keys: [${Object.keys(I.updatedInput).join(", ")}]`), yield {
            updatedInput: I.updatedInput
        };
        if (I.permissionRequestResult) yield {
            permissionRequestResult: I.permissionRequestResult
        };
        if (I.elicitationResponse) yield {
            elicitationResponse: I.elicitationResponse
        };
        if (I.elicitationResultResponse) yield {
            elicitationResultResponse: I.elicitationResultResponse
        };
        if (D && I.hook.type !== "callback") {
            let g = R1(),
                b = n24(D, g, j, K ?? "", I.hook);
            if (b?.onHookSuccess && I.outcome === "success") try {
                b.onHookSuccess(I.hook, I)
            } catch (p) {
                _6(Error("Session hook success callback failed", {
                    cause: p
                }))
            }
        }
    }
    let u = Date.now() - f;
    if (bw6()?.observe("hook_duration_ms", u), ex1(u), d("tengu_repl_hook_finished", {
            hookName: J,
            numCommands: P.length,
            numSuccess: L.success,
            numBlocking: L.blocking,
            numNonBlockingError: L.non_blocking_error,
            numCancelled: L.cancelled,
            totalDurationMs: u
        }), a$()) {
        let I = Avq(P);
        pw("hook_execution_complete", {
            hook_event: j,
            hook_name: J,
            num_hooks: String(P.length),
            num_success: String(L.success),
            num_blocking: String(L.blocking),
            num_non_blocking_error: String(L.non_blocking_error),
            num_cancelled: String(L.cancelled),
            managed_only: String(GL()),
            hook_definitions: B6(I),
            hook_source: GL() ? "policySettings" : "merged"
        })
    }
    q_4(G, {
        numSuccess: L.success,
        numBlocking: L.blocking,
        numNonBlockingError: L.non_blocking_error,
        numCancelled: L.cancelled
    })
}
// @from(Ln 452171, Col 0)
function QN6(A) {
    return A.some((q) => q.blocked)
}
// @from(Ln 452174, Col 0)
async function RF({
    getAppState: A,
    hookInput: q,
    matchQuery: K,
    signal: Y,
    timeoutMs: z = T$
}) {
    if (t6(process.env.CLAUDE_CODE_SIMPLE)) return [];
    let _ = q.hook_event_name,
        w = K ? `${_}:${K}` : _;
    if (sI6()) return k(`Skipping hooks for ${w} due to 'disableAllHooks' managed setting`), [];
    if (TS1()) return k(`Skipping ${w} hook execution - workspace trust not accepted`), [];
    let O = A ? A() : void 0,
        $ = R1(),
        H = kr8(O, $, _, q);
    if (H.length === 0) return [];
    if (Y?.aborted) return [];
    let j = H.filter((D) => !zvq(D));
    if (j.length > 0) {
        let D = _vq(j),
            X = wvq(j);
        d("tengu_run_hook", {
            hookName: w,
            numCommands: j.length,
            hookTypeCounts: B6(X),
            ...D && {
                pluginHookCounts: B6(D)
            }
        })
    }
    let J;
    try {
        J = B6(q)
    } catch (D) {
        return _6(D), []
    }
    let M = H.map(async ({
        hook: D,
        pluginRoot: X,
        pluginId: P
    }, W) => {
        if (D.type === "callback") {
            let v = D.timeout ? D.timeout * 1000 : z,
                {
                    signal: N,
                    cleanup: V
                } = mN(AbortSignal.timeout(v), Y);
            try {
                let L = CE(),
                    h = await D.callback(q, L, N, W);
                if (V?.(), uh(h)) return k(`${w} [callback] returned async response, returning empty output`), {
                    command: "callback",
                    succeeded: !0,
                    output: "",
                    blocked: !1
                };
                let R = h.systemMessage || "",
                    u = FN6(h) && h.decision === "block";
                return k(`${w} [callback] completed successfully`), {
                    command: "callback",
                    succeeded: !0,
                    output: R,
                    blocked: u
                }
            } catch (L) {
                V?.();
                let h = L instanceof Error ? L.message : String(L);
                return k(`${w} [callback] failed to run: ${h}`, {
                    level: "error"
                }), {
                    command: "callback",
                    succeeded: !1,
                    output: h,
                    blocked: !1
                }
            }
        }
        if (D.type === "prompt") return {
            command: D.prompt,
            succeeded: !1,
            output: "Prompt stop hooks are not yet supported outside REPL",
            blocked: !1
        };
        if (D.type === "agent") return {
            command: D.prompt,
            succeeded: !1,
            output: "Agent stop hooks are not yet supported outside REPL",
            blocked: !1
        };
        if (D.type === "function") return _6(Error(`Function hook reached executeHooksOutsideREPL for ${_}. Function hooks should only be used in REPL context (Stop hooks).`)), {
            command: "function",
            succeeded: !1,
            output: "Internal error: function hook executed outside REPL context",
            blocked: !1
        };
        if (D.type === "http") try {
            let v = await Nr8(D, _, J, Y);
            if (v.aborted) return k(`${w} [${D.url}] cancelled`), {
                command: D.url,
                succeeded: !1,
                output: "Hook cancelled",
                blocked: !1
            };
            if (v.error || !v.ok) {
                let h = v.error || `HTTP ${v.statusCode} from ${D.url}`;
                return k(`${w} [${D.url}] failed: ${h}`, {
                    level: "error"
                }), {
                    command: D.url,
                    succeeded: !1,
                    output: h,
                    blocked: !1
                }
            }
            let {
                json: N,
                validationError: V
            } = Yvq(v.body);
            if (V) throw Error(V);
            if (N && !uh(N)) k(`Parsed JSON output from HTTP hook: ${B6(N)}`);
            let L = N && !uh(N) && FN6(N) && N.decision === "block";
            return {
                command: D.url,
                succeeded: !0,
                output: v.body,
                blocked: !!L
            }
        } catch (v) {
            let N = v instanceof Error ? v.message : String(v);
            return k(`${w} [${D.url}] failed to run: ${N}`, {
                level: "error"
            }), {
                command: D.url,
                succeeded: !1,
                output: N,
                blocked: !1
            }
        }
        let Z = D.timeout ? D.timeout * 1000 : z,
            {
                signal: G,
                cleanup: f
            } = mN(AbortSignal.timeout(Z), Y);
        try {
            let v = await vS1(D, _, w, J, G, CE(), W, X, P);
            if (f?.(), v.aborted) return k(`${w} [${D.command}] cancelled`), {
                command: D.command,
                succeeded: !1,
                output: "Hook cancelled",
                blocked: !1
            };
            k(`${w} [${D.command}] completed with status ${v.status}`);
            let {
                json: N,
                validationError: V
            } = Kvq(v.stdout);
            if (V) throw Error(V);
            if (N && !uh(N)) k(`Parsed JSON output from hook: ${B6(N)}`);
            let L = N && !uh(N) && FN6(N) && N.decision === "block",
                h = v.status === 2 || !!L,
                R = v.status === 0 ? v.stdout || "" : v.stderr || "";
            return {
                command: D.command,
                succeeded: v.status === 0,
                output: R,
                blocked: h
            }
        } catch (v) {
            f?.();
            let N = v instanceof Error ? v.message : String(v);
            return k(`${w} [${D.command}] failed to run: ${N}`, {
                level: "error"
            }), {
                command: D.command,
                succeeded: !1,
                output: N,
                blocked: !1
            }
        }
    });
    return await Promise.all(M)
}
// @from(Ln 452356, Col 0)
async function* LF8(A, q, K, Y, z, _, w = T$, O, $) {
    let H = Y.getAppState(),
        j = Y.agentId ?? R1();
    if (!NS1("PreToolUse", H, j)) return;
    k(`executePreToolHooks called for tool: ${A}`);
    let J = {
        ...$w(z, void 0, Y),
        hook_event_name: "PreToolUse",
        tool_name: A,
        tool_input: K,
        tool_use_id: q
    };
    yield* Ax({
        hookInput: J,
        toolUseID: q,
        matchQuery: A,
        signal: _,
        timeoutMs: w,
        toolUseContext: Y,
        requestPrompt: O,
        toolInputSummary: $
    })
}
// @from(Ln 452379, Col 0)
async function* RF8(A, q, K, Y, z, _, w, O = T$) {
    let $ = {
        ...$w(_, void 0, z),
        hook_event_name: "PostToolUse",
        tool_name: A,
        tool_input: K,
        tool_response: Y,
        tool_use_id: q
    };
    yield* Ax({
        hookInput: $,
        toolUseID: q,
        matchQuery: A,
        signal: w,
        timeoutMs: O,
        toolUseContext: z
    })
}
// @from(Ln 452397, Col 0)
async function* hF8(A, q, K, Y, z, _, w, O, $ = T$) {
    let H = z.getAppState(),
        j = z.agentId ?? R1();
    if (!NS1("PostToolUseFailure", H, j)) return;
    let J = {
        ...$w(w, void 0, z),
        hook_event_name: "PostToolUseFailure",
        tool_name: A,
        tool_input: K,
        tool_use_id: q,
        error: Y,
        is_interrupt: _
    };
    yield* Ax({
        hookInput: J,
        toolUseID: q,
        matchQuery: A,
        signal: O,
        timeoutMs: $,
        toolUseContext: z
    })
}
// @from(Ln 452419, Col 0)
async function Xm(A, q = T$) {
    let {
        message: K,
        title: Y,
        notificationType: z
    } = A, _ = {
        ...$w(void 0),
        hook_event_name: "Notification",
        message: K,
        title: Y,
        notification_type: z
    };
    await RF({
        hookInput: _,
        timeoutMs: q,
        matchQuery: z
    })
}
// @from(Ln 452437, Col 0)
async function* Lp8(A, q, K = T$, Y = !1, z, _, w, O, $) {
    let H = z ? "SubagentStop" : "Stop",
        j = _?.getAppState(),
        J = _?.agentId ?? R1();
    if (!NS1(H, j, J)) return;
    let D = (w ? bX(w) : void 0)?.message.content.filter((P) => P.type === "text").map((P) => P.type === "text" ? P.text : "").join(`
`).trim() || void 0,
        X = z ? {
            ...$w(A),
            hook_event_name: "SubagentStop",
            stop_hook_active: Y,
            agent_id: z,
            agent_transcript_path: L0(z),
            agent_type: O ?? "",
            last_assistant_message: D
        } : {
            ...$w(A),
            hook_event_name: "Stop",
            stop_hook_active: Y,
            last_assistant_message: D
        };
    yield* Ax({
        hookInput: X,
        toolUseID: CE(),
        signal: q,
        timeoutMs: K,
        toolUseContext: _,
        messages: w,
        requestPrompt: $
    })
}
// @from(Ln 452468, Col 0)
async function* Rp8(A, q, K, Y, z = T$) {
    let _ = {
        ...$w(K),
        hook_event_name: "TeammateIdle",
        teammate_name: A,
        team_name: q
    };
    yield* Ax({
        hookInput: _,
        toolUseID: CE(),
        signal: Y,
        timeoutMs: z
    })
}
// @from(Ln 452482, Col 0)
async function* Hi6(A, q, K, Y, z, _, w, O = T$, $) {
    let H = {
        ...$w(_),
        hook_event_name: "TaskCompleted",
        task_id: A,
        task_subject: q,
        task_description: K,
        teammate_name: Y,
        team_name: z
    };
    yield* Ax({
        hookInput: H,
        toolUseID: CE(),
        signal: w,
        timeoutMs: O,
        toolUseContext: $
    })
}
// @from(Ln 452500, Col 0)
async function* yr8(A, q, K, Y) {
    let z = K.getAppState(),
        _ = K.agentId ?? R1();
    if (!NS1("UserPromptSubmit", z, _)) return;
    let w = {
        ...$w(q),
        hook_event_name: "UserPromptSubmit",
        prompt: A
    };
    yield* Ax({
        hookInput: w,
        toolUseID: CE(),
        signal: K.abortController.signal,
        timeoutMs: T$,
        toolUseContext: K,
        requestPrompt: Y
    })
}
// @from(Ln 452518, Col 0)
async function* Qu8(A, q, K, Y, z, _ = T$, w) {
    let O = {
        ...$w(void 0, q),
        hook_event_name: "SessionStart",
        source: A,
        agent_type: K,
        model: Y
    };
    yield* Ax({
        hookInput: O,
        toolUseID: CE(),
        matchQuery: A,
        signal: z,
        timeoutMs: _,
        forceSyncExecution: w
    })
}
// @from(Ln 452535, Col 0)
async function* Uu8(A, q, K = T$, Y) {
    let z = {
        ...$w(void 0),
        hook_event_name: "Setup",
        trigger: A
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: A,
        signal: q,
        timeoutMs: K,
        forceSyncExecution: Y
    })
}
// @from(Ln 452550, Col 0)
async function* Ux8(A, q, K, Y = T$) {
    let z = {
        ...$w(void 0),
        hook_event_name: "SubagentStart",
        agent_id: A,
        agent_type: q
    };
    yield* Ax({
        hookInput: z,
        toolUseID: CE(),
        matchQuery: q,
        signal: K,
        timeoutMs: Y
    })
}
// @from(Ln 452565, Col 0)
async function sT6(A, q, K = T$) {
    let Y = {
            ...$w(void 0),
            hook_event_name: "PreCompact",
            trigger: A.trigger,
            custom_instructions: A.customInstructions
        },
        z = await RF({
            hookInput: Y,
            matchQuery: A.trigger,
            signal: q,
            timeoutMs: K
        });
    if (z.length === 0) return {};
    let _ = z.filter((O) => O.succeeded && O.output.trim().length > 0).map((O) => O.output.trim()),
        w = [];
    for (let O of z)
        if (O.succeeded)
            if (O.output.trim()) w.push(`PreCompact [${O.command}] completed successfully: ${O.output.trim()}`);
            else w.push(`PreCompact [${O.command}] completed successfully`);
    else if (O.output.trim()) w.push(`PreCompact [${O.command}] failed: ${O.output.trim()}`);
    else w.push(`PreCompact [${O.command}] failed`);
    return {
        newCustomInstructions: _.length > 0 ? _.join(`

`) : void 0,
        userDisplayMessage: w.length > 0 ? w.join(`
`) : void 0
    }
}
// @from(Ln 452595, Col 0)
async function FE1(A, q, K = T$) {
    let Y = {
            ...$w(void 0),
            hook_event_name: "PostCompact",
            trigger: A.trigger,
            compact_summary: A.compactSummary
        },
        z = await RF({
            hookInput: Y,
            matchQuery: A.trigger,
            signal: q,
            timeoutMs: K
        });
    if (z.length === 0) return {};
    let _ = [];
    for (let w of z)
        if (w.succeeded)
            if (w.output.trim()) _.push(`PostCompact [${w.command}] completed successfully: ${w.output.trim()}`);
            else _.push(`PostCompact [${w.command}] completed successfully`);
    else if (w.output.trim()) _.push(`PostCompact [${w.command}] failed: ${w.output.trim()}`);
    else _.push(`PostCompact [${w.command}] failed`);
    return {
        userDisplayMessage: _.length > 0 ? _.join(`
`) : void 0
    }
}
// @from(Ln 452621, Col 0)
async function RQ8(A, q) {
    let {
        getAppState: K,
        setAppState: Y,
        signal: z,
        timeoutMs: _ = T$
    } = q || {}, w = {
        ...$w(void 0),
        hook_event_name: "SessionEnd",
        reason: A
    }, O = await RF({
        getAppState: K,
        hookInput: w,
        matchQuery: A,
        signal: z,
        timeoutMs: _
    });
    for (let $ of O)
        if (!$.succeeded && $.output) process.stderr.write(`SessionEnd hook [${$.command}] failed: ${$.output}
`);
    if (Y) {
        let $ = R1();
        zZ6(Y, $)
    }
}
// @from(Ln 452646, Col 0)
async function* b_6(A, q, K, Y, z, _, w, O = T$, $, H) {
    k(`executePermissionRequestHooks called for tool: ${A}`);
    let j = {
        ...$w(z, void 0, Y),
        hook_event_name: "PermissionRequest",
        tool_name: A,
        tool_input: K,
        permission_suggestions: _
    };
    yield* Ax({
        hookInput: j,
        toolUseID: q,
        matchQuery: A,
        signal: w,
        timeoutMs: O,
        toolUseContext: Y,
        requestPrompt: $,
        toolInputSummary: H
    })
}
// @from(Ln 452666, Col 0)
async function UN6(A, q, K = T$) {
    let Y = {
            ...$w(void 0),
            hook_event_name: "ConfigChange",
            source: A,
            file_path: q
        },
        z = await RF({
            hookInput: Y,
            timeoutMs: K,
            matchQuery: A
        });
    if (A === "policy_settings") return z.map((_) => ({
        ..._,
        blocked: !1
    }));
    return z
}
// @from(Ln 452685, Col 0)
function WF6() {
    let A = EM6()?.InstructionsLoaded;
    if (A && A.length > 0) return !0;
    let q = Xp()?.InstructionsLoaded;
    if (q && q.length > 0) return !0;
    return !1
}
// @from(Ln 452692, Col 0)
async function ZF6(A, q, K, Y) {
    let {
        globs: z,
        triggerFilePath: _,
        parentFilePath: w,
        timeoutMs: O = T$
    } = Y ?? {}, $ = {
        ...$w(void 0),
        hook_event_name: "InstructionsLoaded",
        file_path: A,
        memory_type: q,
        load_reason: K,
        globs: z,
        trigger_file_path: _,
        parent_file_path: w
    };
    await RF({
        hookInput: $,
        timeoutMs: O,
        matchQuery: K
    })
}
// @from(Ln 452715, Col 0)
function Ovq(A, q) {
    if (A.blocked && !A.succeeded) return {
        blockingError: {
            blockingError: A.output || "Elicitation blocked by hook",
            command: A.command
        }
    };
    if (!A.output.trim()) return {};
    let K = A.output.trim();
    if (!K.startsWith("{")) return {};
    try {
        let Y = gN6().parse(JSON.parse(K));
        if (uh(Y)) return {};
        if (!FN6(Y)) return {};
        if (Y.decision === "block" || A.blocked) return {
            blockingError: {
                blockingError: Y.reason || "Elicitation blocked by hook",
                command: A.command
            }
        };
        let z = Y.hookSpecificOutput;
        if (!z || z.hookEventName !== q) return {};
        if (!z.action) return {};
        let w = {
            response: {
                action: z.action,
                content: z.content
            }
        };
        if (z.action === "decline") w.blockingError = {
            blockingError: Y.reason || (q === "Elicitation" ? "Elicitation denied by hook" : "Elicitation result blocked by hook"),
            command: A.command
        };
        return w
    } catch {
        return {}
    }
}
// @from(Ln 452753, Col 0)
async function A$8({
    serverName: A,
    message: q,
    requestedSchema: K,
    permissionMode: Y,
    signal: z,
    timeoutMs: _ = T$,
    mode: w,
    url: O,
    elicitationId: $
}) {
    let H = {
            ...$w(Y),
            hook_event_name: "Elicitation",
            mcp_server_name: A,
            message: q,
            mode: w,
            url: O,
            elicitation_id: $,
            requested_schema: K
        },
        j = await RF({
            hookInput: H,
            matchQuery: A,
            signal: z,
            timeoutMs: _
        }),
        J, M;
    for (let D of j) {
        let X = Ovq(D, "Elicitation");
        if (X.blockingError) M = X.blockingError;
        if (X.response) J = X.response
    }
    return {
        elicitationResponse: J,
        blockingError: M
    }
}
// @from(Ln 452791, Col 0)
async function q$8({
    serverName: A,
    action: q,
    content: K,
    permissionMode: Y,
    signal: z,
    timeoutMs: _ = T$,
    mode: w,
    elicitationId: O
}) {
    let $ = {
            ...$w(Y),
            hook_event_name: "ElicitationResult",
            mcp_server_name: A,
            elicitation_id: O,
            mode: w,
            action: q,
            content: K
        },
        H = await RF({
            hookInput: $,
            matchQuery: A,
            signal: z,
            timeoutMs: _
        }),
        j, J;
    for (let M of H) {
        let D = Ovq(M, "ElicitationResult");
        if (D.blockingError) J = D.blockingError;
        if (D.response) j = D.response
    }
    return {
        elicitationResultResponse: j,
        blockingError: J
    }
}
// @from(Ln 452827, Col 0)
async function Lr8(A, q, K = 5000, Y = !1) {
    if (sI6()) return;
    if (TS1()) {
        k("Skipping StatusLine command execution - workspace trust not accepted");
        return
    }
    let z;
    if (GL()) z = L8("policySettings")?.statusLine;
    else z = PA()?.statusLine;
    if (!z || z.type !== "command") return;
    let _ = q || AbortSignal.timeout(K);
    try {
        let w = B6(A),
            O = await vS1(z, "StatusLine", "statusLine", w, _, CE());
        if (O.aborted) return;
        if (O.status === 0) {
            let $ = O.stdout.trim().split(`
`).flatMap((H) => H.trim() || []).join(`
`);
            if ($) {
                if (Y) k(`StatusLine [${z.command}] completed with status ${O.status}`);
                return $
            }
        } else if (Y) k(`StatusLine [${z.command}] completed with status ${O.status}`, {
            level: "warn"
        });
        return
    } catch (w) {
        k(`Status hook failed: ${w}`, {
            level: "error"
        });
        return
    }
}
// @from(Ln 452861, Col 0)
async function vQ8(A, q, K = 5000) {
    if (sI6()) return [];
    if (TS1()) return k("Skipping FileSuggestion command execution - workspace trust not accepted"), [];
    let Y;
    if (GL()) Y = L8("policySettings")?.fileSuggestion;
    else Y = PA()?.fileSuggestion;
    if (!Y || Y.type !== "command") return [];
    let z = q || AbortSignal.timeout(K);
    try {
        let _ = B6(A),
            w = {
                type: "command",
                command: Y.command
            },
            O = await vS1(w, "FileSuggestion", "FileSuggestion", _, z, CE());
        if (O.aborted || O.status !== 0) return [];
        return O.stdout.split(`
`).map(($) => $.trim()).filter(Boolean)
    } catch (_) {
        return k(`File suggestion helper failed: ${_}`, {
            level: "error"
        }), []
    }
}