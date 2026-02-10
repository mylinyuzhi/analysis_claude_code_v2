
// @from(Ln 385300, Col 0)
function V6q(A, q, K, Y, z) {
    try {
        let {
            setMessages: w,
            readFileState: H,
            cwd: $
        } = z;
        K((G) => {
            if (G.promptSuggestion.text === null && G.promptSuggestion.promptId === null) return G;
            return {
                ...G,
                promptSuggestion: {
                    text: null,
                    promptId: null,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: null
                }
            }
        });
        let O = A.messagesRef.current,
            _ = UcY(O),
            J = c6({
                content: Y
            });
        w((G) => [...G, J]);
        let X = ccY(A, K, _.length),
            D = X?.timeSavedMs ?? 0,
            j = q + D,
            M = pcY(_, X?.boundary ?? null, D, j);
        w((G) => [...G, ..._]);
        let P = A91(_, $, JK1);
        if (H.current = yj1(H.current, P), M) w((G) => [...G, M]);
        let W = X?.boundary?.type === "complete";
        if (h(`[Speculation] ${X?.boundary?.type??"incomplete"}, injected ${_.length} messages`), W && A.pipelinedSuggestion) {
            let {
                text: G,
                promptId: f,
                generationRequestId: Z
            } = A.pipelinedSuggestion;
            h(`[Speculation] Promoting pipelined suggestion: "${G.slice(0,50)}..."`), K((T) => ({
                ...T,
                promptSuggestion: {
                    text: G,
                    promptId: f,
                    shownAt: Date.now(),
                    acceptedAt: 0,
                    generationRequestId: Z
                }
            }));
            let N = {
                ...A.contextRef.current,
                messages: [...A.contextRef.current.messages, c6({
                    content: Y
                }), ..._]
            };
            vhA(G, N, K, !0)
        }
        return {
            queryRequired: !W
        }
    } catch (w) {
        return K1(w instanceof Error ? w : Error("handleSpeculationAccept failed")), jf6(A.id, "error", A.startTime, A.suggestionLength, A.messagesRef.current, A.boundary, {
            error_type: w instanceof Error ? w.name : "Unknown",
            error_message: (w instanceof Error ? w.message : String(w)).slice(0, 200),
            error_phase: "accept",
            is_pipelined: A.isPipelined
        }), cU1(Df6(A.id)), fhA(K), {
            queryRequired: !0
        }
    }
}
// @from(Ln 385372, Col 4)
bcY = 20
// @from(Ln 385373, Col 4)
ucY = 100
// @from(Ln 385374, Col 4)
BcY
// @from(Ln 385374, Col 9)
mcY
// @from(Ln 385375, Col 4)
lU1 = v(() => {
    E2();
    d8();
    YI();
    N8();
    vq();
    _f6();
    wG();
    u6();
    Z6();
    lq();
    m6();
    cA();
    y6();
    G2();
    B6();
    Jf6();
    pM();
    mG1();
    cM();
    BcY = new Set(["Edit", "Write", "NotebookEdit"]), mcY = new Set(["Read", "Glob", "Grep", "ToolSearch", "LSP", "TaskGet", "TaskList"])
})
// @from(Ln 385398, Col 0)
function Mf6() {
    if (KY()) return "coordinator";
    return x8(lcY, "user_intent")
}
// @from(Ln 385403, Col 0)
function Wf6() {
    let A = process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION;
    if (A === "false") return c("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "env"
    }), !1;
    if (A === "1") return c("tengu_prompt_suggestion_init", {
        enabled: !0,
        source: "env"
    }), !0;
    if (!x8("tengu_chomp_inflection", !0)) return c("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "growthbook"
    }), !1;
    if (w4()) return c("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "non_interactive"
    }), !1;
    if (l8() && Dz()) return c("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "swarm_teammate"
    }), !1;
    if (w91() === "mcp-cli") return c("tengu_prompt_suggestion_init", {
        enabled: !1,
        source: "mcp_cli_mode"
    }), !1;
    let K = l4()?.promptSuggestionEnabled !== !1;
    return c("tengu_prompt_suggestion_init", {
        enabled: K,
        source: "setting"
    }), K
}
// @from(Ln 385436, Col 0)
function N6q() {
    if (z91) z91.abort(), z91 = null
}
// @from(Ln 385440, Col 0)
function EhA(A) {
    if (!A.promptSuggestionEnabled) return "disabled";
    if (A.pendingWorkerRequest || A.pendingSandboxRequest) return "pending_permission";
    if (A.elicitation.queue.length > 0) return "elicitation_active";
    if (A.toolPermissionContext.mode === "plan") return "plan_mode";
    if (Pv.status !== "allowed") return "rate_limit";
    return null
}
// @from(Ln 385448, Col 0)
async function Y6q(A) {
    if (A.querySource !== "repl_main_thread") return;
    let q = await A.toolUseContext.getAppState(),
        K = EhA(q);
    if (K) {
        uI(K);
        return
    }
    if (A.messages.filter((O) => O.type === "assistant").length < 2) {
        uI("early_conversation");
        return
    }
    let z = GN(A.messages);
    if (z?.isApiErrorMessage) {
        uI("last_response_error");
        return
    }
    if (z && ncY(z)) {
        uI("cache_cold");
        return
    }
    z91 = new AbortController;
    let w = z91,
        H = Mf6(),
        $ = tt(A);
    try {
        let {
            suggestion: O,
            generationRequestId: _
        } = await khA(A, w, H, $);
        if (LhA(O, H)) return;
        if (A.toolUseContext.setAppState((J) => ({
                ...J,
                promptSuggestion: {
                    text: O,
                    promptId: H,
                    shownAt: 0,
                    acceptedAt: 0,
                    generationRequestId: _
                }
            })), ThA() && O) vhA(O, A, A.toolUseContext.setAppState, !1, $)
    } catch (O) {
        if (O instanceof Error && O.name === "AbortError") {
            uI("aborted");
            return
        }
        K1(O instanceof Error ? O : Error("Prompt suggestion generation failed"))
    } finally {
        if (z91 === w) z91 = null
    }
}
// @from(Ln 385500, Col 0)
function ncY(A) {
    if (!A) return !1;
    let q = A.message.usage,
        K = q.input_tokens ?? 0,
        Y = q.cache_read_input_tokens ?? 0,
        z = q.cache_creation_input_tokens ?? 0,
        w = K + Y + z;
    if (w === 0) return !1;
    return z / w > icY
}
// @from(Ln 385510, Col 0)
async function khA(A, q, K, Y) {
    let z = Y ?? tt(A),
        w = scY[K],
        H = async () => ({
            behavior: "deny",
            message: "No tools needed for suggestion",
            decisionReason: {
                type: "other",
                reason: "suggestion only"
            }
        }), $ = await av({
            promptMessages: [c6({
                content: w
            })],
            cacheSafeParams: z,
            canUseTool: H,
            querySource: "prompt_suggestion",
            forkLabel: "prompt_suggestion",
            overrides: {
                abortController: q
            },
            skipTranscript: !0
        }), O = $.messages.find((J) => J.type === "assistant"), _ = O?.type === "assistant" ? O.requestId ?? null : null;
    for (let J of $.messages) {
        if (J.type !== "assistant") continue;
        let X = J.message.content.find((D) => D.type === "text");
        if (X?.type === "text" && X.text.trim()) return {
            suggestion: X.text.trim(),
            generationRequestId: _
        }
    }
    return {
        suggestion: null,
        generationRequestId: _
    }
}
// @from(Ln 385547, Col 0)
function LhA(A, q) {
    if (!A) return uI("empty", void 0, q), !0;
    let K = A.toLowerCase(),
        Y = A.trim().split(/\s+/).length,
        z = [
            ["done", () => K === "done"],
            ["meta_text", () => K === "nothing found" || K === "nothing found." || K.startsWith("nothing to suggest") || K.startsWith("no suggestion")],
            ["error_message", () => K.startsWith("api error:") || K.startsWith("prompt is too long") || K.startsWith("request timed out") || K.startsWith("invalid api key") || K.startsWith("image was too large")],
            ["prefixed_label", () => /^\w+:\s/.test(A)],
            ["too_few_words", () => {
                if (Y >= 2) return !1;
                if (A.startsWith("/")) return !1;
                return !new Set(["yes", "yeah", "yep", "yea", "yup", "sure", "ok", "okay", "push", "commit", "deploy", "stop", "continue", "check", "exit", "quit", "no"]).has(K)
            }],
            ["too_many_words", () => Y > 12],
            ["too_long", () => A.length >= 100],
            ["multiple_sentences", () => /[.!?]\s+[A-Z]/.test(A)],
            ["has_formatting", () => /[\n*]|\*\*/.test(A)],
            ["evaluative", () => /thanks|thank you|looks good|sounds good|that works|that worked|that's all|nice|great|perfect|makes sense|awesome|excellent/.test(K)],
            ["claude_voice", () => /^(let me|i'll|i've|i'm|i can|i would|i think|i notice|here's|here is|here are|that's|this is|this will|you can|you should|you could|sure,|of course|certainly)/i.test(A)]
        ];
    for (let [w, H] of z)
        if (H()) return uI(w, A, q), !0;
    return !1
}
// @from(Ln 385573, Col 0)
function uI(A, q, K) {
    let Y = K ?? Mf6();
    c("tengu_prompt_suggestion", {
        outcome: "suppressed",
        reason: A,
        prompt_id: Y,
        coordinator_mode: KY(),
        ...!1
    })
}
// @from(Ln 385583, Col 4)
lcY = "tengu_plank_river_frost"
// @from(Ln 385584, Col 4)
z91 = null
// @from(Ln 385585, Col 4)
icY = 0.5
// @from(Ln 385586, Col 4)
rcY = `[SUGGESTION MODE: Suggest what the user might naturally type next into Claude Code.]

FIRST: Look at the user's recent messages and original request.

Your job is to predict what THEY would type - not what you think they should do.

THE TEST: Would they think "I was just about to type that"?

EXAMPLES:
User asked "fix the bug and run tests", bug is fixed → "run the tests"
After code written → "try it out"
Claude offers options → suggest the one the user would likely pick, based on conversation
Claude asks to continue → "yes" or "go ahead"
Task complete, obvious follow-up → "commit this" or "push it"
After error or misunderstanding → silence (let them assess/correct)

Be specific: "run the tests" beats "continue".

NEVER SUGGEST:
- Evaluative ("looks good", "thanks")
- Questions ("what about...?")
- Claude-voice ("Let me...", "I'll...", "Here's...")
- New ideas they didn't ask about
- Multiple sentences

Stay silent if the next step isn't obvious from what the user said.

Format: 2-12 words, match the user's style. Or nothing.

Reply with ONLY the suggestion, no quotes or explanation.`
// @from(Ln 385616, Col 4)
ocY = `[SUGGESTION MODE]

TASK: Find a stated next step in the user's messages. Return it, or nothing.

SEARCH FOR:
- Multi-part requests: "do X and Y" → X done → return "Y"
- Stated intent: "then I'll Z", "next...", "after that..." → return "Z"
- Answer to Claude's question → return "yes" / "go ahead" / obvious choice

NOTHING FOUND → return nothing.
This is correct most of the time. Only return text you can trace to the user's stated plan.

2-12 words. User's phrasing. Never evaluate, never Claude-voice.
Output ONLY the suggestion, or nothing.`
// @from(Ln 385630, Col 4)
acY = `[SUGGESTION MODE: Suggest what the coordinator would naturally type next.]

The user is supervising AI workers. Most messages are automated task-notifications — look past them to what the user actually needs to respond to.

Your job is to predict what THEY would type - not what you think should happen next.

THE TEST: Would they think "I was just about to type that"?

EXAMPLES:
You asked a yes/no question → "yes" or "go ahead"
All work complete, user said to push → "push" or "commit and push"
User asked for X and Y, X is done → the next step in their words
Workers still running, reporting progress → silence
Task notification arrived → silence
After error or unexpected result → silence (let them assess)

In coordinator mode, silence is usually correct — the user is watching, not typing.

NEVER SUGGEST:
- Task-specific instructions the user didn't ask about
- Slash commands ("/commit", "/review")
- Claude-voice ("Let me...", "I'll...")
- Evaluative ("looks good", "thanks")

Format: 1-3 words, match the user's phrasing. Or nothing.

Reply with ONLY the suggestion, no quotes or explanation.`
// @from(Ln 385657, Col 4)
scY
// @from(Ln 385658, Col 4)
mG1 = v(() => {
    YI();
    N8();
    u6();
    y6();
    S9();
    Cz();
    oL();
    B6();
    nu();
    p8();
    lU1();
    U4();
    cM();
    scY = {
        user_intent: rcY,
        stated_intent: ocY,
        coordinator: acY
    }
})
// @from(Ln 385679, Col 0)
function Gf6(A, q) {
    let K = A,
        Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let w = K,
                H = z(w);
            if (Object.is(H, w)) return;
            K = H, q?.({
                newState: H,
                oldState: w
            });
            for (let $ of Y) $()
        },
        subscribe: (z) => {
            return Y.add(z), () => Y.delete(z)
        }
    }
}
// @from(Ln 385700, Col 0)
function gG1() {
    let A = (Cz(), ay(d7A)),
        q = A.isTeammate() && A.isPlanModeRequired() ? "plan" : "default";
    return {
        settings: l4(),
        tasks: {},
        verbose: !1,
        mainLoopModel: null,
        mainLoopModelForSession: null,
        statusLineText: void 0,
        expandedView: "none",
        showTeammateMessagePreview: !1,
        selectedIPAgentIndex: -1,
        viewSelectionMode: "none",
        remoteSessionUrl: void 0,
        toolPermissionContext: {
            ...QD(),
            mode: q
        },
        agent: void 0,
        agentDefinitions: {
            activeAgents: [],
            allAgents: []
        },
        fileHistory: {
            snapshots: [],
            trackedFiles: new Set
        },
        attribution: Zw6(),
        mcp: {
            clients: [],
            tools: [],
            commands: [],
            resources: {}
        },
        plugins: {
            enabled: [],
            disabled: [],
            commands: [],
            agents: [],
            errors: [],
            installationStatus: {
                marketplaces: [],
                plugins: []
            },
            needsRefresh: !1
        },
        todos: {},
        notifications: {
            current: null,
            queue: []
        },
        elicitation: {
            queue: []
        },
        thinkingEnabled: fw6(),
        promptSuggestionEnabled: Wf6(),
        feedbackSurvey: {
            timeLastShown: null,
            submitCountAtLastAppearance: null
        },
        sessionHooks: {},
        inbox: {
            messages: []
        },
        workerSandboxPermissions: {
            queue: [],
            selectedIndex: 0
        },
        pendingWorkerRequest: null,
        pendingSandboxRequest: null,
        promptSuggestion: {
            text: null,
            promptId: null,
            shownAt: 0,
            acceptedAt: 0,
            generationRequestId: null
        },
        speculation: Y91,
        speculationSessionTimeSavedMs: 0,
        promptCoaching: {
            tip: null,
            shownAt: 0
        },
        queuedCommands: [],
        gitDiff: {
            stats: null,
            perFileStats: new Map,
            hunks: new Map,
            lastUpdated: 0
        },
        prStatus: {
            number: null,
            url: null,
            reviewState: null,
            lastUpdated: 0
        },
        authVersion: 0,
        initialMessage: null,
        effortValue: void 0
    }
}
// @from(Ln 385803, Col 0)
function u_(A) {
    let q = e(13),
        {
            children: K,
            initialState: Y,
            onChangeAppState: z
        } = A;
    if (eD.useContext(T6q)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
    let H;
    if (q[0] !== Y || q[1] !== z) H = () => Gf6(Y ?? gG1(), z), q[0] = Y, q[1] = z, q[2] = H;
    else H = q[2];
    let [$] = eD.useState(H), O;
    if (q[3] !== $) O = () => {
        let {
            toolPermissionContext: M
        } = $.getState();
        if (M.isBypassPermissionsModeAvailable && rD1()) h("Disabling bypass permissions mode on mount (remote settings loaded before mount)"), $.setState(tcY)
    }, q[3] = $, q[4] = O;
    else O = q[4];
    let _;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[5] = _;
    else _ = q[5];
    eD.useEffect(O, _);
    let J;
    if (q[6] !== $.setState) J = (M) => Gw6(M, $.setState), q[6] = $.setState, q[7] = J;
    else J = q[7];
    let X = eD.useEffectEvent(J);
    bD1(X);
    let D;
    if (q[8] !== K) D = eD.default.createElement(ik7, null, K), q[8] = K, q[9] = D;
    else D = q[9];
    let j;
    if (q[10] !== $ || q[11] !== D) j = eD.default.createElement(T6q.Provider, {
        value: !0
    }, eD.default.createElement(RhA.Provider, {
        value: $
    }, D)), q[10] = $, q[11] = D, q[12] = j;
    else j = q[12];
    return j
}
// @from(Ln 385844, Col 0)
function tcY(A) {
    return {
        ...A,
        toolPermissionContext: oD1(A.toolPermissionContext)
    }
}
// @from(Ln 385851, Col 0)
function yhA() {
    let A = eD.useContext(RhA);
    if (!A) throw ReferenceError("useAppState/useSetAppState cannot be called outside of an <AppStateProvider />");
    return A
}
// @from(Ln 385857, Col 0)
function v6(A) {
    let q = e(3),
        K = yhA(),
        Y;
    if (q[0] !== A || q[1] !== K) Y = () => {
        let w = K.getState(),
            H = A(w);
        if (w === H) throw Error(`Your selector in \`useAppState(${A.toString()})\` returned the original state, which is not allowed. You must instead return a property for optimised rendering.`);
        return H
    }, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    let z = Y;
    return eD.useSyncExternalStore(K.subscribe, z, z)
}
// @from(Ln 385872, Col 0)
function L7() {
    return yhA().setState
}
// @from(Ln 385876, Col 0)
function B_() {
    return yhA()
}
// @from(Ln 385880, Col 0)
function C74(A) {
    let q = e(3),
        K = eD.useContext(RhA),
        Y;
    if (q[0] !== A || q[1] !== K) Y = () => K ? A(K.getState()) : void 0, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    return eD.useSyncExternalStore(K ? K.subscribe : ecY, Y)
}
// @from(Ln 385888, Col 4)
eD
// @from(Ln 385888, Col 8)
Y91
// @from(Ln 385888, Col 13)
RhA
// @from(Ln 385888, Col 18)
T6q
// @from(Ln 385888, Col 23)
ecY = () => () => {}
// @from(Ln 385889, Col 4)
d8 = v(() => {
    i1();
    o26();
    KOA();
    qp();
    Mq1();
    zOA();
    tD1();
    mG1();
    p8();
    Z6();
    eD = o(X1(), 1), Y91 = {
        status: "idle"
    };
    RhA = eD.default.createContext(null), T6q = eD.default.createContext(!1)
})
// @from(Ln 385906, Col 0)
function iq() {
    let A = v6((w) => w.notifications.queue.length),
        q = L7(),
        K = UG1.useCallback(() => {
            q((w) => {
                let H = AlY(w.notifications.queue);
                if (w.notifications.current !== null || !H) return w;
                return oZ = setTimeout(() => {
                    oZ = null, q(($) => {
                        if ($.notifications.current?.key !== H.key) return $;
                        return {
                            ...$,
                            notifications: {
                                queue: $.notifications.queue,
                                current: null
                            }
                        }
                    }), K()
                }, H.timeoutMs ?? ChA), {
                    ...w,
                    notifications: {
                        queue: w.notifications.queue.filter(($) => $ !== H),
                        current: H
                    }
                }
            })
        }, [q]),
        Y = UG1.useCallback((w) => {
            if (w.priority === "immediate") {
                if (oZ) clearTimeout(oZ), oZ = null;
                oZ = setTimeout(() => {
                    oZ = null, q((H) => {
                        if (H.notifications.current?.key !== w.key) return H;
                        return {
                            ...H,
                            notifications: {
                                queue: H.notifications.queue.filter(($) => !w.invalidates?.includes($.key)),
                                current: null
                            }
                        }
                    }), K()
                }, w.timeoutMs ?? ChA), q((H) => ({
                    ...H,
                    notifications: {
                        current: w,
                        queue: [...H.notifications.current ? [H.notifications.current] : [], ...H.notifications.queue].filter(($) => $.priority !== "immediate" && !w.invalidates?.includes($.key))
                    }
                }));
                return
            }
            q((H) => {
                if (w.fold) {
                    if (H.notifications.current?.key === w.key) {
                        let J = w.fold(H.notifications.current, w);
                        if (oZ) clearTimeout(oZ), oZ = null;
                        return oZ = setTimeout(() => {
                            oZ = null, q((X) => {
                                if (X.notifications.current?.key !== J.key) return X;
                                return {
                                    ...X,
                                    notifications: {
                                        queue: X.notifications.queue,
                                        current: null
                                    }
                                }
                            }), K()
                        }, J.timeoutMs ?? ChA), {
                            ...H,
                            notifications: {
                                current: J,
                                queue: H.notifications.queue
                            }
                        }
                    }
                    let _ = H.notifications.queue.findIndex((J) => J.key === w.key);
                    if (_ !== -1) {
                        let J = w.fold(H.notifications.queue[_], w),
                            X = [...H.notifications.queue];
                        return X[_] = J, {
                            ...H,
                            notifications: {
                                current: H.notifications.current,
                                queue: X
                            }
                        }
                    }
                }
                let O = !new Set(H.notifications.queue.map((_) => _.key)).has(w.key) && H.notifications.current?.key !== w.key;
                return {
                    ...H,
                    notifications: {
                        current: H.notifications.current,
                        queue: O ? [...H.notifications.queue.filter((_) => _.priority !== "immediate" && !w.invalidates?.includes(_.key)), w] : H.notifications.queue
                    }
                }
            }), K()
        }, [q, K]),
        z = UG1.useCallback((w) => {
            q((H) => {
                let $ = H.notifications.current?.key === w,
                    O = H.notifications.queue.some((_) => _.key === w);
                if (!$ && !O) return H;
                if ($ && oZ) clearTimeout(oZ), oZ = null;
                return {
                    ...H,
                    notifications: {
                        current: $ ? null : H.notifications.current,
                        queue: H.notifications.queue.filter((_) => _.key !== w)
                    }
                }
            }), K()
        }, [q, K]);
    return UG1.useEffect(() => {
        if (A > 0) K()
    }, []), {
        addNotification: Y,
        removeNotification: z
    }
}
// @from(Ln 386026, Col 0)
function AlY(A) {
    return A.sort((q, K) => {
        let Y = v6q[q.priority] ?? 999,
            z = v6q[K.priority] ?? 999;
        return Y - z
    })[0]
}
// @from(Ln 386033, Col 4)
UG1
// @from(Ln 386033, Col 9)
ChA = 8000
// @from(Ln 386034, Col 4)
oZ = null
// @from(Ln 386035, Col 4)
v6q
// @from(Ln 386036, Col 4)
h2 = v(() => {
    d8();
    UG1 = o(X1(), 1);
    v6q = {
        immediate: 0,
        high: 1,
        medium: 2,
        low: 3
    }
})
// @from(Ln 386046, Col 4)
hhA = {}
// @from(Ln 386063, Col 0)
function ShA() {
    if (iU1) return iU1;
    if (process.platform !== "darwin") return null;
    try {
        if (process.env.MODIFIERS_NODE_PATH) iU1 = h1(process.env.MODIFIERS_NODE_PATH);
        else {
            let A = zlY(YlY(KlY(import.meta.url)), "..", "modifiers-napi", `${process.arch}-darwin`, "modifiers.node");
            iU1 = qlY(import.meta.url)(A)
        }
        return iU1
    } catch {
        return null
    }
}
// @from(Ln 386078, Col 0)
function wlY() {
    let A = ShA();
    if (!A) return [];
    return A.getModifiers()
}
// @from(Ln 386084, Col 0)
function HlY(A) {
    let q = ShA();
    if (!q) return !1;
    return q.isModifierPressed(A)
}
// @from(Ln 386090, Col 0)
function $lY() {
    ShA()
}
// @from(Ln 386093, Col 4)
iU1 = null
// @from(Ln 386094, Col 4)
IhA = () => {}
// @from(Ln 386096, Col 0)
function k6q() {
    if (E6q || process.platform !== "darwin") return;
    E6q = !0;
    try {
        let {
            prewarm: A
        } = (IhA(), ay(hhA));
        A()
    } catch {}
}
// @from(Ln 386107, Col 0)
function L6q(A) {
    if (process.platform !== "darwin") return !1;
    let {
        isModifierPressed: q
    } = (IhA(), ay(hhA));
    return q(A)
}
// @from(Ln 386114, Col 4)
E6q = !1
// @from(Ln 386116, Col 0)
function R6q(A) {
    return function(q) {
        return (new Map(A).get(q) ?? (() => {}))(q)
    }
}
// @from(Ln 386122, Col 0)
function Zf6({
    value: A,
    onChange: q,
    onSubmit: K,
    onExit: Y,
    onExitMessage: z,
    onHistoryUp: w,
    onHistoryDown: H,
    onHistoryReset: $,
    onClearInput: O,
    mask: _ = "",
    multiline: J = !1,
    cursorChar: X,
    invert: D,
    columns: j,
    onImagePaste: M,
    disableCursorMovementForUpDownKeys: P = !1,
    externalOffset: W,
    onOffsetChange: G,
    inputFilter: f,
    inlineGhostText: Z,
    dim: N
}) {
    if (xA.terminal === "Apple_Terminal") k6q();
    let T = W,
        k = G,
        y = z3.fromText(A, j, T),
        {
            addNotification: B,
            removeNotification: S
        } = iq(),
        m = iS((A1) => {
            z?.(A1, "Ctrl-C")
        }, () => Y?.(), () => {
            if (A) q(""), k(0), $?.()
        }),
        b = iS((A1) => {
            if (!A || !A1) return;
            B({
                key: "escape-again-to-clear",
                text: "Esc to clear again",
                priority: "immediate",
                timeoutMs: 1000
            })
        }, () => {
            if (S("escape-again-to-clear"), O?.(), A) {
                if (u8("double-escape"), A.trim() !== "") _q1(A);
                q(""), k(0), $?.()
            }
        });

    function g() {
        if (A.trim() !== "") _q1(A), $?.();
        return z3.fromText("", j, 0)
    }
    let U = iS((A1) => {
        if (A !== "") return;
        z?.(A1, "Ctrl-D")
    }, () => {
        if (A !== "") return;
        Y?.()
    });

    function x() {
        if (y.text === "") return U(), y;
        return y.del()
    }

    function p() {
        let {
            cursor: A1,
            killed: M1
        } = y.deleteToLineEnd();
        return rU(M1, "append"), A1
    }

    function l() {
        let {
            cursor: A1,
            killed: M1
        } = y.deleteToLineStart();
        return rU(M1, "prepend"), A1
    }

    function r() {
        let {
            cursor: A1,
            killed: M1
        } = y.deleteWordBefore();
        return rU(M1, "prepend"), A1
    }

    function s() {
        eE7();
        let A1 = u26();
        if (A1.length > 0) {
            let M1 = y.offset,
                z1 = y.insert(A1);
            return B26(M1, A1.length), z1
        }
        return y
    }

    function O1() {
        let A1 = m26();
        if (!A1) return y;
        let {
            text: M1,
            start: z1,
            length: Y1
        } = A1, _1 = y.text.slice(0, z1), $1 = y.text.slice(z1 + Y1), G1 = _1 + M1 + $1, L1 = z1 + M1.length;
        return F26(M1.length), z3.fromText(G1, j, L1)
    }
    let T1 = R6q([
            ["a", () => y.startOfLine()],
            ["b", () => y.left()],
            ["c", m],
            ["d", x],
            ["e", () => y.endOfLine()],
            ["f", () => y.right()],
            ["h", () => y.deleteTokenBefore() ?? y.backspace()],
            ["k", p],
            ["l", () => g()],
            ["n", () => t()],
            ["p", () => q1()],
            ["u", l],
            ["w", r],
            ["y", s]
        ]),
        N1 = R6q([
            ["b", () => y.prevWord()],
            ["f", () => y.nextWord()],
            ["d", () => y.deleteWordAfter()],
            ["y", O1]
        ]);

    function j1(A1) {
        if (J && y.offset > 0 && y.text[y.offset - 1] === "\\") return b$A(), y.backspace().insert(`
`);
        if (A1.meta || A1.shift) return y.insert(`
`);
        if (xA.terminal === "Apple_Terminal" && L6q("shift")) return y.insert(`
`);
        K?.(A)
    }

    function q1() {
        if (P) return w?.(), y;
        let A1 = y.up();
        if (!A1.equals(y)) return A1;
        if (J) {
            let M1 = y.upLogicalLine();
            if (!M1.equals(y)) return M1
        }
        return w?.(), y
    }

    function t() {
        if (P) return H?.(), y;
        let A1 = y.down();
        if (!A1.equals(y)) return A1;
        if (J) {
            let M1 = y.downLogicalLine();
            if (!M1.equals(y)) return M1
        }
        return H?.(), y
    }

    function J1(A1) {
        switch (!0) {
            case A1.escape:
                return () => {
                    return b(), y
                };
            case (A1.leftArrow && (A1.ctrl || A1.meta || A1.fn)):
                return () => y.prevWord();
            case (A1.rightArrow && (A1.ctrl || A1.meta || A1.fn)):
                return () => y.nextWord();
            case A1.backspace:
                return A1.meta || A1.ctrl ? r : () => y.deleteTokenBefore() ?? y.backspace();
            case A1.delete:
                return A1.meta ? p : () => y.del();
            case A1.ctrl:
                return T1;
            case A1.home:
                return () => y.startOfLine();
            case A1.end:
                return () => y.endOfLine();
            case A1.pageDown:
                return () => y.endOfLine();
            case A1.pageUp:
                return () => y.startOfLine();
            case A1.return:
                return () => j1(A1);
            case A1.meta:
                return N1;
            case A1.tab:
                return () => y;
            case (A1.upArrow && !A1.shift):
                return q1;
            case (A1.downArrow && !A1.shift):
                return t;
            case A1.leftArrow:
                return () => y.left();
            case A1.rightArrow:
                return () => y.right();
            default:
                return function(M1) {
                    switch (!0) {
                        case (M1 === "\x1B[H" || M1 === "\x1B[1~"):
                            return y.startOfLine();
                        case (M1 === "\x1B[F" || M1 === "\x1B[4~"):
                            return y.endOfLine();
                        default:
                            if (y.isAtStart() && Kk7(M1)) return y.insert(JH(M1).replace(/\r/g, `
`)).left();
                            return y.insert(JH(M1).replace(/\r/g, `
`))
                    }
                }
        }
    }

    function D1(A1, M1) {
        if (A1.ctrl && (M1 === "k" || M1 === "u" || M1 === "w")) return !0;
        if (A1.meta && (A1.backspace || A1.delete)) return !0;
        return !1
    }

    function Z1(A1, M1) {
        return (A1.ctrl || A1.meta) && M1 === "y"
    }

    function E1(A1, M1) {
        let z1 = f ? f(A1, M1) : A1;
        if (z1 === "" && A1 !== "") return;
        if (!M1.backspace && !M1.delete && A1.includes("")) {
            let _1 = (A1.match(/\x7f/g) || []).length,
                $1 = y;
            for (let G1 = 0; G1 < _1; G1++) $1 = $1.deleteTokenBefore() ?? $1.backspace();
            if (!y.equals($1)) {
                if (y.text !== $1.text) q($1.text);
                k($1.offset)
            }
            Nx1(), Tx1();
            return
        }
        if (!D1(M1, z1)) Nx1();
        if (!Z1(M1, z1)) Tx1();
        let Y1 = J1(M1)(z1);
        if (Y1) {
            if (!y.equals(Y1)) {
                if (y.text !== Y1.text) q(Y1.text);
                k(Y1.offset)
            }
        }
    }
    let a = Z && N && Z.insertPosition === T ? {
        text: Z.text,
        dim: N
    } : void 0;
    return {
        onInput: E1,
        renderedValue: y.render(X, _, D, a),
        offset: T,
        setOffset: k
    }
}
// @from(Ln 386390, Col 4)
xhA = v(() => {
    XL();
    fx1();
    RD1();
    Oq1();
    nS();
    n26();
    h2();
    v3();
    G5()
})
// @from(Ln 386405, Col 0)
function y6q({
    onPaste: A,
    onInput: q,
    onImagePaste: K
}) {
    let [Y, z] = Ae.default.useState({
        chunks: [],
        timeoutId: null
    }), [w, H] = Ae.default.useState(!1), $ = Ae.default.useRef(!0), O = Ae.default.useMemo(() => eA() === "macos", []);
    Ae.default.useEffect(() => {
        return () => {
            $.current = !1
        }
    }, []);
    let _ = Ae.default.useCallback(() => {
            if (!K || !$.current) return;
            QD1().then((j) => {
                if (j && $.current) K(j.base64, j.mediaType, void 0, j.dimensions)
            }).catch((j) => {
                if ($.current) K1(j)
            }).finally(() => {
                if ($.current) H(!1)
            })
        }, [K]),
        J = TD1(_, _lY),
        X = Ae.default.useCallback((j) => {
            if (j) clearTimeout(j);
            return setTimeout(() => {
                z(({
                    chunks: M
                }) => {
                    let P = M.join("").replace(/\[I$/, "").replace(/\[O$/, ""),
                        W = P.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((f) => f.split(`
`)).filter((f) => f.trim()),
                        G = W.filter((f) => zw6(f));
                    if (K && G.length > 0) {
                        let f = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(P);
                        return Promise.all(G.map((Z) => Vk7(Z))).then((Z) => {
                            let N = Z.filter((T) => T !== null);
                            if (N.length > 0) {
                                for (let k of N) {
                                    let y = OlY(k.path);
                                    K(k.base64, k.mediaType, y, k.dimensions, k.path)
                                }
                                let T = W.filter((k) => !zw6(k));
                                if (T.length > 0 && A) A(T.join(`
`));
                                H(!1)
                            } else if (f && O) J();
                            else {
                                if (A) A(P);
                                H(!1)
                            }
                        }), {
                            chunks: [],
                            timeoutId: null
                        }
                    }
                    if (O && K && P.length === 0) return J(), {
                        chunks: [],
                        timeoutId: null
                    };
                    if (A) A(P);
                    return H(!1), {
                        chunks: [],
                        timeoutId: null
                    }
                })
            }, JlY)
        }, [J, O, K, A]);
    return {
        wrappedOnInput: (j, M, P) => {
            let W = P.keypress.isPasted;
            if (W) H(!0);
            let G = j.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((Z) => Z.split(`
`)).some((Z) => zw6(Z.trim()));
            if (W && j.length === 0 && O && K) {
                J(), H(!1);
                return
            }
            if (A && (j.length > Yw6 || Y.timeoutId || G || W)) {
                z(({
                    chunks: Z,
                    timeoutId: N
                }) => {
                    return {
                        chunks: [...Z, j],
                        timeoutId: X(N)
                    }
                });
                return
            }
            if (q(j, M), j.length > 10) H(!1)
        },
        pasteState: Y,
        isPasting: w
    }
}
// @from(Ln 386503, Col 4)
Ae
// @from(Ln 386503, Col 8)
_lY = 50
// @from(Ln 386504, Col 4)
JlY = 100
// @from(Ln 386505, Col 4)
C6q = v(() => {
    XZ();
    Cx1();
    x3();
    y6();
    Ae = o(X1(), 1)
})
// @from(Ln 386513, Col 0)
function S6q({
    placeholder: A,
    value: q,
    showCursor: K,
    focus: Y,
    terminalFocus: z = !0
}) {
    let w = void 0;
    if (A) {
        if (w = H6.dim(A), K && Y && z) w = A.length > 0 ? H6.inverse(A[0]) + H6.dim(A.slice(1)) : H6.inverse(" ")
    }
    let H = q.length === 0 && Boolean(A);
    return {
        renderedPlaceholder: w,
        showPlaceholder: H
    }
}
// @from(Ln 386530, Col 4)
h6q = v(() => {
    q3()
})
// @from(Ln 386534, Col 0)
function x6q(A, q) {
    if (q.length === 0) return [{
        text: A,
        start: 0
    }];
    let K = [...q].sort((w, H) => {
            if (w.start !== H.start) return w.start - H.start;
            return H.priority - w.priority
        }),
        Y = [],
        z = [];
    for (let w of K) {
        if (w.start === w.end) continue;
        if (!z.some(($) => w.start >= $.start && w.start < $.end || w.end > $.start && w.end <= $.end || w.start <= $.start && w.end >= $.end)) Y.push(w), z.push({
            start: w.start,
            end: w.end
        })
    }
    return new b6q(A).segment(Y)
}
// @from(Ln 386554, Col 0)
class b6q {
    text;
    tokens;
    visiblePos = 0;
    stringPos = 0;
    tokenIdx = 0;
    charIdx = 0;
    codes = [];
    constructor(A) {
        this.text = A;
        this.tokens = OJ1(A)
    }
    segment(A) {
        let q = [];
        for (let Y of A) {
            let z = this.segmentTo(Y.start);
            if (z) q.push(z);
            let w = this.segmentTo(Y.end);
            if (w) w.highlight = Y, q.push(w)
        }
        let K = this.segmentTo(1 / 0);
        if (K) q.push(K);
        return q
    }
    segmentTo(A) {
        if (this.tokenIdx >= this.tokens.length || A <= this.visiblePos) return null;
        let q = this.visiblePos;
        while (this.tokenIdx < this.tokens.length) {
            let O = this.tokens[this.tokenIdx];
            if (O.type !== "ansi") break;
            this.codes.push(O), this.stringPos += O.code.length, this.tokenIdx++
        }
        let K = this.stringPos,
            Y = [...this.codes];
        while (this.visiblePos < A && this.tokenIdx < this.tokens.length) {
            let O = this.tokens[this.tokenIdx];
            if (O.type === "ansi") this.codes.push(O), this.stringPos += O.code.length, this.tokenIdx++;
            else {
                let _ = A - this.visiblePos,
                    J = O.value.length - this.charIdx,
                    X = Math.min(_, J);
                if (this.stringPos += X, this.visiblePos += X, this.charIdx += X, this.charIdx >= O.value.length) this.tokenIdx++, this.charIdx = 0
            }
        }
        if (this.stringPos === K) return null;
        let z = I6q(Y),
            w = I6q(this.codes);
        this.codes = w;
        let H = cG(z),
            $ = cG(Z71(w));
        return {
            text: H + this.text.substring(K, this.stringPos) + $,
            start: q
        }
    }
}
// @from(Ln 386611, Col 0)
function I6q(A) {
    return vr(A).filter((q) => q.code !== q.endCode)
}
// @from(Ln 386614, Col 4)
u6q = v(() => {
    f71()
})
// @from(Ln 386618, Col 0)
function B6q(A) {
    let q = e(3),
        {
            text: K,
            highlights: Y
        } = A,
        z;
    if (q[0] !== Y || q[1] !== K) {
        let w = x6q(K, Y),
            H = [
                []
            ];
        for (let $ of w) {
            let O = $.text.split(`
`);
            for (let _ = 0; _ < O.length; _++) {
                if (_ > 0) H.push([]);
                let J = O[_];
                if (J.length > 0) H[H.length - 1].push({
                    text: J,
                    highlight: $.highlight
                })
            }
        }
        z = _E.createElement(I, {
            flexDirection: "column"
        }, H.map(XlY)), q[0] = Y, q[1] = K, q[2] = z
    } else z = q[2];
    return z
}
// @from(Ln 386649, Col 0)
function XlY(A, q) {
    return _E.createElement(I, {
        key: q
    }, A.map(DlY))
}
// @from(Ln 386655, Col 0)
function DlY(A, q) {
    if (A.highlight?.color) return _E.createElement(V, {
        key: q,
        color: A.highlight.color
    }, _E.createElement(W3, null, A.text));
    return _E.createElement(V, {
        key: q
    }, _E.createElement(W3, null, A.text))
}
// @from(Ln 386664, Col 4)
_E
// @from(Ln 386665, Col 4)
m6q = v(() => {
    i1();
    m1();
    u6q();
    _E = o(X1(), 1)
})
// @from(Ln 386672, Col 0)
function ff6(A) {
    let q = e(9),
        {
            inputState: K,
            children: Y,
            terminalFocus: z,
            ...w
        } = A,
        {
            onInput: H,
            renderedValue: $
        } = K,
        {
            wrappedOnInput: O,
            isPasting: _
        } = y6q({
            onPaste: w.onPaste,
            onInput: (S, m) => {
                if (J && m.return) return;
                H(S, m)
            },
            onImagePaste: w.onImagePaste
        }),
        J = _,
        {
            onIsPastingChange: X
        } = w;
    im.default.useEffect(() => {
        if (X) X(J)
    }, [J, X]);
    let {
        showPlaceholder: D,
        renderedPlaceholder: j
    } = S6q({
        placeholder: w.placeholder,
        value: w.value,
        showCursor: w.showCursor,
        focus: w.focus,
        terminalFocus: z
    });
    D8(O, {
        isActive: w.focus
    });
    let M = w.value && w.value.trim().indexOf(" ") === -1 || w.value && w.value.endsWith(" "),
        P = Boolean(w.argumentHint && w.value && M && w.value.startsWith("/")),
        W = w.showCursor && w.highlights ? w.highlights.filter((S) => w.cursorOffset < S.start || w.cursorOffset >= S.end) : w.highlights;
    if (W && W.length > 0) return im.default.createElement(I, null, im.default.createElement(B6q, {
        text: $,
        highlights: W
    }), P && im.default.createElement(V, {
        dimColor: !0
    }, w.value?.endsWith(" ") ? "" : " ", w.argumentHint), Y);
    let f = I,
        Z = V,
        N = "truncate-end",
        T = D && w.placeholderElement ? w.placeholderElement : D && j ? im.default.createElement(W3, null, j) : im.default.createElement(W3, null, $),
        k = P && im.default.createElement(V, {
            dimColor: !0
        }, w.value?.endsWith(" ") ? "" : " ", w.argumentHint),
        y;
    if (q[0] !== Z || q[1] !== Y || q[2] !== w || q[3] !== T || q[4] !== k) y = im.default.createElement(Z, {
        wrap: N,
        dimColor: w.dimColor
    }, T, k, Y), q[0] = Z, q[1] = Y, q[2] = w, q[3] = T, q[4] = k, q[5] = y;
    else y = q[5];
    let B;
    if (q[6] !== f || q[7] !== y) B = im.default.createElement(f, null, y), q[6] = f, q[7] = y, q[8] = B;
    else B = q[8];
    return B
}
// @from(Ln 386742, Col 4)
im
// @from(Ln 386743, Col 4)
bhA = v(() => {
    i1();
    m1();
    C6q();
    h6q();
    m6q();
    im = o(X1(), 1)
})
// @from(Ln 386751, Col 4)
uhA
// @from(Ln 386751, Col 9)
pG1
// @from(Ln 386751, Col 14)
UbH
// @from(Ln 386751, Col 19)
pbH
// @from(Ln 386751, Col 24)
BhA
// @from(Ln 386752, Col 4)
nU1 = v(() => {
    x3();
    uhA = eA() === "macos" ? "opt" : "alt", pG1 = eA() === "windows" ? {
        displayText: `${uhA}+v`,
        check: (A, q) => q.meta && (A === "v" || A === "V")
    } : {
        displayText: "ctrl+v",
        check: (A, q) => q.ctrl && (A === "v" || A === "V")
    }, UbH = {
        displayText: `${uhA}+p`,
        check: (A, q) => q.meta && (A === "p" || A === "P")
    }, pbH = {
        displayText: `${uhA}+t`,
        check: (A, q) => q.meta && (A === "t" || A === "T")
    }, BhA = {
        "†": "alt+t",
        π: "alt+p"
    }
})
// @from(Ln 386772, Col 0)
function Vf6(A, q) {
    let {
        addNotification: K
    } = iq(), Y = dG1.useRef(A), z = dG1.useRef(0), w = dG1.useRef(null);
    dG1.useEffect(() => {
        let H = Y.current;
        Y.current = A;
        return
    }, [A, q, K])
}
// @from(Ln 386782, Col 4)
dG1
// @from(Ln 386782, Col 9)
jlY = "clipboard-image-hint"
// @from(Ln 386783, Col 4)
MlY = 1000
// @from(Ln 386784, Col 4)
PlY = 30000
// @from(Ln 386785, Col 4)
mhA = v(() => {
    h2();
    Cx1();
    nU1();
    dG1 = o(X1(), 1)
})
// @from(Ln 386792, Col 0)
function k3(A) {
    let q = e(29),
        [K] = T7(),
        Y = k_();
    Vf6(Y, !!A.onImagePaste);
    let {
        value: z,
        onChange: w,
        onSubmit: H,
        onExit: $,
        onExitMessage: O,
        onHistoryReset: _,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: D,
        focus: j,
        mask: M,
        multiline: P
    } = A, W = A.showCursor ? " " : "", G = A.highlightPastedText, f = Y && !J6(process.env.CLAUDE_CODE_ACCESSIBILITY) ? H6.inverse : WlY, Z;
    if (q[0] !== K) Z = k8("text", K), q[0] = K, q[1] = Z;
    else Z = q[1];
    let N;
    if (q[2] !== A.columns || q[3] !== A.cursorOffset || q[4] !== A.disableCursorMovementForUpDownKeys || q[5] !== A.focus || q[6] !== A.highlightPastedText || q[7] !== A.inlineGhostText || q[8] !== A.mask || q[9] !== A.multiline || q[10] !== A.onChange || q[11] !== A.onChangeCursorOffset || q[12] !== A.onClearInput || q[13] !== A.onExit || q[14] !== A.onExitMessage || q[15] !== A.onHistoryDown || q[16] !== A.onHistoryReset || q[17] !== A.onHistoryUp || q[18] !== A.onImagePaste || q[19] !== A.onSubmit || q[20] !== A.value || q[21] !== W || q[22] !== f || q[23] !== Z) N = {
        value: z,
        onChange: w,
        onSubmit: H,
        onExit: $,
        onExitMessage: O,
        onHistoryReset: _,
        onHistoryUp: J,
        onHistoryDown: X,
        onClearInput: D,
        focus: j,
        mask: M,
        multiline: P,
        cursorChar: W,
        highlightPastedText: G,
        invert: f,
        themeText: Z,
        columns: A.columns,
        onImagePaste: A.onImagePaste,
        disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
        externalOffset: A.cursorOffset,
        onOffsetChange: A.onChangeCursorOffset,
        inlineGhostText: A.inlineGhostText,
        dim: H6.dim
    }, q[2] = A.columns, q[3] = A.cursorOffset, q[4] = A.disableCursorMovementForUpDownKeys, q[5] = A.focus, q[6] = A.highlightPastedText, q[7] = A.inlineGhostText, q[8] = A.mask, q[9] = A.multiline, q[10] = A.onChange, q[11] = A.onChangeCursorOffset, q[12] = A.onClearInput, q[13] = A.onExit, q[14] = A.onExitMessage, q[15] = A.onHistoryDown, q[16] = A.onHistoryReset, q[17] = A.onHistoryUp, q[18] = A.onImagePaste, q[19] = A.onSubmit, q[20] = A.value, q[21] = W, q[22] = f, q[23] = Z, q[24] = N;
    else N = q[24];
    let T = Zf6(N),
        k;
    if (q[25] !== Y || q[26] !== A || q[27] !== T) k = F6q.default.createElement(ff6, {
        inputState: T,
        terminalFocus: Y,
        highlights: A.highlights,
        ...A
    }), q[25] = Y, q[26] = A, q[27] = T, q[28] = k;
    else k = q[28];
    return k
}
// @from(Ln 386852, Col 0)
function WlY(A) {
    return A
}
// @from(Ln 386855, Col 4)
F6q
// @from(Ln 386856, Col 4)
gO = v(() => {
    i1();
    q3();
    xhA();
    bhA();
    mhA();
    m1();
    hA();
    F6q = o(X1(), 1)
})
// @from(Ln 386873, Col 0)
function c6q(A, q) {
    if (!A) return {
        directory: q || h6(),
        prefix: ""
    };
    let K = g4(A, q);
    if (A.endsWith("/") || A.endsWith(Nf6)) return {
        directory: K,
        prefix: ""
    };
    let Y = GlY(K),
        z = ZlY(A);
    return {
        directory: Y,
        prefix: z
    }
}
// @from(Ln 386891, Col 0)
function flY(A) {
    let q = Q6q.get(A);
    if (q) return q;
    try {
        let z = b1().readdirSync(A).filter((w) => w.isDirectory() && !w.name.startsWith(".")).map((w) => ({
            name: w.name,
            path: U6q(A, w.name),
            type: "directory"
        })).slice(0, 100);
        return Q6q.set(A, z), z
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), []
    }
}
// @from(Ln 386905, Col 0)
async function Tf6(A, q = {}) {
    let {
        basePath: K = h6(),
        maxResults: Y = 10
    } = q, {
        directory: z,
        prefix: w
    } = c6q(A, K), H = flY(z), $ = w.toLowerCase();
    return H.filter((_) => _.name.toLowerCase().startsWith($)).slice(0, Y).map((_) => ({
        id: _.path,
        displayText: _.name + "/",
        description: "directory",
        type: "directory"
    }))
}
// @from(Ln 386921, Col 0)
function l6q(A) {
    return A.startsWith("~/") || A.startsWith("/") || A.startsWith("./") || A.startsWith("../") || A === "~" || A === "." || A === ".."
}
// @from(Ln 386925, Col 0)
function VlY(A, q = !1) {
    let K = `${A}:${q}`,
        Y = g6q.get(K);
    if (Y) return Y;
    try {
        let H = b1().readdirSync(A).filter(($) => q || !$.name.startsWith(".")).map(($) => ({
            name: $.name,
            path: U6q(A, $.name),
            type: $.isDirectory() ? "directory" : "file"
        })).sort(($, O) => {
            if ($.type === "directory" && O.type !== "directory") return -1;
            if ($.type !== "directory" && O.type === "directory") return 1;
            return $.name.localeCompare(O.name)
        }).slice(0, 100);
        return g6q.set(K, H), H
    } catch (z) {
        return K1(z instanceof Error ? z : Error(String(z))), []
    }
}
// @from(Ln 386944, Col 0)
async function i6q(A, q = {}) {
    let {
        basePath: K = h6(),
        maxResults: Y = 10,
        includeFiles: z = !0,
        includeHidden: w = !1
    } = q, {
        directory: H,
        prefix: $
    } = c6q(A, K), O = VlY(H, w), _ = $.toLowerCase(), J = O.filter((j) => {
        if (!z && j.type === "file") return !1;
        return j.name.toLowerCase().startsWith(_)
    }).slice(0, Y), X = A.includes("/") || A.includes(Nf6), D = "";
    if (X) {
        let j = A.lastIndexOf("/"),
            M = A.lastIndexOf(Nf6),
            P = Math.max(j, M);
        D = A.substring(0, P + 1)
    }
    if (D.startsWith("./") || D.startsWith("." + Nf6)) D = D.slice(2);
    return J.map((j) => {
        let M = D + j.name;
        return {
            id: M,
            displayText: j.type === "directory" ? M + "/" : M,
            metadata: {
                type: j.type
            }
        }
    })
}
// @from(Ln 386975, Col 4)
p6q = 500
// @from(Ln 386976, Col 4)
d6q = 300000
// @from(Ln 386977, Col 4)
Q6q
// @from(Ln 386977, Col 9)
g6q
// @from(Ln 386978, Col 4)
FhA = v(() => {
    kw1();
    N7();
    _8();
    y6();
    Ez();
    Q6q = new ZT({
        max: p6q,
        ttl: d6q
    }), g6q = new ZT({
        max: p6q,
        ttl: d6q
    })
})
// @from(Ln 386993, Col 0)
function NlY(A) {
    if (A.startsWith("file-")) return "+";
    if (A.startsWith("mcp-resource-")) return "◇";
    if (A.startsWith("agent-")) return "*";
    return "+"
}
// @from(Ln 387000, Col 0)
function TlY(A) {
    return A.startsWith("file-") || A.startsWith("mcp-resource-") || A.startsWith("agent-")
}
// @from(Ln 387004, Col 0)
function rU1(A) {
    let q = e(21),
        {
            suggestions: K,
            selectedSuggestion: Y,
            query: z,
            maxColumnWidth: w
        } = A,
        {
            rows: H
        } = Z8(),
        $ = Math.min(6, Math.max(1, H - 3));
    if (K.length === 0) return null;
    let O;
    if (q[0] !== w || q[1] !== K) O = w ?? Math.max(...K.map(ElY)) + 5, q[0] = w, q[1] = K, q[2] = O;
    else O = q[2];
    let _ = O,
        J = Math.max(0, Math.min(Y - Math.floor($ / 2), K.length - $)),
        X = Math.min(J + $, K.length),
        D, j, M;
    if (q[3] !== X || q[4] !== _ || q[5] !== z || q[6] !== Y || q[7] !== J || q[8] !== K) {
        let W = K.slice(J, X);
        D = I, j = "column";
        let G;
        if (q[12] !== _ || q[13] !== z || q[14] !== Y || q[15] !== K) G = (f) => JE.createElement(vlY, {
            key: f.id,
            item: f,
            maxColumnWidth: _,
            isSelected: f.id === K[Y]?.id,
            query: z
        }), q[12] = _, q[13] = z, q[14] = Y, q[15] = K, q[16] = G;
        else G = q[16];
        M = W.map(G), q[3] = X, q[4] = _, q[5] = z, q[6] = Y, q[7] = J, q[8] = K, q[9] = D, q[10] = j, q[11] = M
    } else D = q[9], j = q[10], M = q[11];
    let P;
    if (q[17] !== D || q[18] !== j || q[19] !== M) P = JE.createElement(D, {
        flexDirection: j
    }, M), q[17] = D, q[18] = j, q[19] = M, q[20] = P;
    else P = q[20];
    return P
}
// @from(Ln 387046, Col 0)
function ElY(A) {
    return UA(A.displayText)
}
// @from(Ln 387049, Col 4)
JE
// @from(Ln 387049, Col 8)
QhA
// @from(Ln 387049, Col 13)
vlY
// @from(Ln 387049, Col 18)
MuH
// @from(Ln 387050, Col 4)
ghA = v(() => {
    i1();
    m1();
    mq();
    vq();
    LY();
    JE = o(X1(), 1), QhA = o(X1(), 1);
    vlY = QhA.memo(function(q) {
        let K = e(33),
            {
                item: Y,
                maxColumnWidth: z,
                isSelected: w
            } = q,
            H = Z8().columns;
        if (TlY(Y.id)) {
            let k;
            if (K[0] !== Y.id) k = NlY(Y.id), K[0] = Y.id, K[1] = k;
            else k = K[1];
            let y = k,
                B = w ? "suggestion" : void 0,
                S = !w,
                m = Y.id.startsWith("file-"),
                b = Y.id.startsWith("mcp-resource-"),
                g = Y.description ? 3 : 0,
                U;
            if (m) {
                let r;
                if (K[2] !== Y.description) r = Y.description ? Math.min(20, UA(Y.description)) : 0, K[2] = Y.description, K[3] = r;
                else r = K[3];
                let s = r,
                    O1 = H - 2 - 4 - g - s,
                    T1;
                if (K[4] !== Y.displayText || K[5] !== O1) T1 = C17(Y.displayText, O1), K[4] = Y.displayText, K[5] = O1, K[6] = T1;
                else T1 = K[6];
                U = T1
            } else if (b) {
                let r;
                if (K[7] !== Y.displayText) r = K3(Y.displayText, 30), K[7] = Y.displayText, K[8] = r;
                else r = K[8];
                U = r
            } else U = Y.displayText;
            let x = H - 2 - UA(U) - g - 4,
                p;
            if (Y.description) {
                let r = Math.max(0, x),
                    s;
                if (K[9] !== Y.description || K[10] !== r) s = K3(Y.description, r), K[9] = Y.description, K[10] = r, K[11] = s;
                else s = K[11];
                p = `${y} ${U} – ${s}`
            } else p = `${y} ${U}`;
            let l;
            if (K[12] !== S || K[13] !== p || K[14] !== B) l = JE.createElement(V, {
                color: B,
                dimColor: S,
                wrap: "truncate"
            }, p), K[12] = S, K[13] = p, K[14] = B, K[15] = l;
            else l = K[15];
            return l
        }
        let O = Math.floor(H * 0.4),
            _ = Math.min(z ?? UA(Y.displayText) + 5, O),
            J = Y.color || (w ? "suggestion" : void 0),
            X = !w,
            D = Y.displayText;
        if (UA(D) > _ - 2) {
            let k = _ - 2,
                y;
            if (K[16] !== D || K[17] !== k) y = K3(D, k), K[16] = D, K[17] = k, K[18] = y;
            else y = K[18];
            D = y
        }
        let j = D + " ".repeat(Math.max(0, _ - UA(D))),
            M = Math.max(0, H - _ - 4),
            P;
        if (K[19] !== M || K[20] !== Y.description) P = Y.description ? K3(Y.description, M) : "", K[19] = M, K[20] = Y.description, K[21] = P;
        else P = K[21];
        let W = P,
            G;
        if (K[22] !== j || K[23] !== X || K[24] !== J) G = JE.createElement(V, {
            color: J,
            dimColor: X
        }, j), K[22] = j, K[23] = X, K[24] = J, K[25] = G;
        else G = K[25];
        let f = w ? "suggestion" : void 0,
            Z = !w,
            N;
        if (K[26] !== f || K[27] !== Z || K[28] !== W) N = JE.createElement(V, {
            color: f,
            dimColor: Z
        }, W), K[26] = f, K[27] = Z, K[28] = W, K[29] = N;
        else N = K[29];
        let T;
        if (K[30] !== G || K[31] !== N) T = JE.createElement(V, null, G, N), K[30] = G, K[31] = N, K[32] = T;
        else T = K[32];
        return T
    });
    MuH = QhA.memo(rU1)
})
// @from(Ln 387150, Col 0)
function n6q() {
    let A = e(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = FK.createElement(V, {
        dimColor: !0
    }, "Claude Code will be able to read files in this directory and make edits when auto-accept edits is on."), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 387160, Col 0)
function LlY(A) {
    let q = e(5),
        {
            path: K
        } = A,
        Y;
    if (q[0] !== K) Y = FK.createElement(V, {
        color: "permission"
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) z = FK.createElement(n6q, null), q[2] = z;
    else z = q[2];
    let w;
    if (q[3] !== Y) w = FK.createElement(I, {
        flexDirection: "column",
        paddingX: 2,
        gap: 1
    }, Y, z), q[3] = Y, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 387183, Col 0)
function RlY(A) {
    let q = e(14),
        {
            value: K,
            onChange: Y,
            onSubmit: z,
            error: w,
            suggestions: H,
            selectedSuggestion: $
        } = A,
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = FK.createElement(V, null, "Enter the path to the directory:"), q[0] = O;
    else O = q[0];
    let _;
    if (q[1] !== Y || q[2] !== z || q[3] !== K) _ = FK.createElement(I, {
        borderDimColor: !0,
        borderStyle: "round",
        marginY: 1,
        paddingLeft: 1
    }, FK.createElement(k3, {
        showCursor: !0,
        placeholder: `Directory path${l1.ellipsis}`,
        value: K,
        onChange: Y,
        onSubmit: z,
        columns: 80,
        cursorOffset: K.length,
        onChangeCursorOffset: ylY
    })), q[1] = Y, q[2] = z, q[3] = K, q[4] = _;
    else _ = q[4];
    let J;
    if (q[5] !== $ || q[6] !== H) J = H.length > 0 && FK.createElement(I, {
        marginBottom: 1
    }, FK.createElement(rU1, {
        suggestions: H,
        selectedSuggestion: $
    })), q[5] = $, q[6] = H, q[7] = J;
    else J = q[7];
    let X;
    if (q[8] !== w) X = w && FK.createElement(V, {
        color: "error"
    }, w), q[8] = w, q[9] = X;
    else X = q[9];
    let D;
    if (q[10] !== _ || q[11] !== J || q[12] !== X) D = FK.createElement(I, {
        flexDirection: "column"
    }, O, _, J, X), q[10] = _, q[11] = J, q[12] = X, q[13] = D;
    else D = q[13];
    return D
}
// @from(Ln 387234, Col 0)
function ylY() {}
// @from(Ln 387236, Col 0)
function oU1(A) {
    let q = e(34),
        {
            onAddDirectory: K,
            onCancel: Y,
            permissionContext: z,
            directoryPath: w
        } = A,
        [H, $] = H91.useState(""),
        [O, _] = H91.useState(null),
        J;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) J = [], q[0] = J;
    else J = q[0];
    let [X, D] = H91.useState(J), [j, M] = H91.useState(0), P = uq(), W;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) W = async (r) => {
        if (!r) {
            D([]), M(0);
            return
        }
        let s = await Tf6(r);
        D(s), M(0)
    }, q[1] = W;
    else W = q[1];
    let f = TD1(W, 100),
        Z, N;
    if (q[2] !== f || q[3] !== H) Z = () => {
        f(H)
    }, N = [H, f], q[2] = f, q[3] = H, q[4] = Z, q[5] = N;
    else Z = q[4], N = q[5];
    H91.useEffect(Z, N);
    let T;
    if (q[6] === Symbol.for("react.memo_cache_sentinel")) T = (r) => {
        let s = r.id + "/";
        $(s), _(null)
    }, q[6] = T;
    else T = q[6];
    let k = T,
        y;
    if (q[7] !== K || q[8] !== z) y = (r) => {
        let s = cG1(r, z);
        if (s.resultType === "success") K(s.absolutePath, !1);
        else _(lG1(s))
    }, q[7] = K, q[8] = z, q[9] = y;
    else y = q[9];
    let B = y,
        S;
    if (q[10] === Symbol.for("react.memo_cache_sentinel")) S = {
        context: "Settings"
    }, q[10] = S;
    else S = q[10];
    DA("confirm:no", Y, S);
    let m;
    if (q[11] !== B || q[12] !== j || q[13] !== X) m = (r, s) => {
        if (X.length > 0) {
            if (s.tab) {
                let O1 = X[j];
                if (O1) k(O1);
                return
            }
            if (s.return) {
                let O1 = X[j];
                if (O1) B(O1.id + "/");
                return
            }
            if (s.upArrow || s.ctrl && r === "p") {
                M((O1) => O1 <= 0 ? X.length - 1 : O1 - 1);
                return
            }
            if (s.downArrow || s.ctrl && r === "n") {
                M((O1) => O1 >= X.length - 1 ? 0 : O1 + 1);
                return
            }
        }
    }, q[11] = B, q[12] = j, q[13] = X, q[14] = m;
    else m = q[14];
    D8(m);
    let b;
    if (q[15] !== w || q[16] !== K || q[17] !== Y) b = (r) => {
        if (!w) return;
        let s = r;
        A: switch (s) {
            case "yes-session": {
                K(w, !1);
                break A
            }
            case "yes-remember": {
                K(w, !0);
                break A
            }
            case "no":
                Y()
        }
    }, q[15] = w, q[16] = K, q[17] = Y, q[18] = b;
    else b = q[18];
    let g = b,
        U;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) U = FK.createElement(V, {
        bold: !0,
        color: "permission"
    }, "Add directory to workspace"), q[19] = U;
    else U = q[19];
    let x;
    if (q[20] !== H || q[21] !== w || q[22] !== O || q[23] !== g || q[24] !== B || q[25] !== j || q[26] !== X) x = FK.createElement(I, {
        flexDirection: "column",
        borderStyle: "round",
        paddingLeft: 1,
        paddingRight: 1,
        gap: 1,
        borderColor: "permission"
    }, U, w ? FK.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, FK.createElement(LlY, {
        path: w
    }), FK.createElement(kA, {
        options: klY,
        onChange: g,
        onCancel: () => g("no")
    })) : FK.createElement(I, {
        flexDirection: "column",
        gap: 1,
        marginX: 2
    }, FK.createElement(n6q, null), FK.createElement(RlY, {
        value: H,
        onChange: $,
        onSubmit: B,
        error: O,
        suggestions: X,
        selectedSuggestion: j
    }))), q[20] = H, q[21] = w, q[22] = O, q[23] = g, q[24] = B, q[25] = j, q[26] = X, q[27] = x;
    else x = q[27];
    let p;
    if (q[28] !== w || q[29] !== P) p = !w && FK.createElement(I, {
        marginLeft: 3
    }, P.pending ? FK.createElement(V, {
        dimColor: !0
    }, "Press ", P.keyName, " again to exit") : FK.createElement(V, {
        dimColor: !0
    }, "Tab to complete · Enter to add · Esc to cancel")), q[28] = w, q[29] = P, q[30] = p;
    else p = q[30];
    let l;
    if (q[31] !== x || q[32] !== p) l = FK.createElement(FK.Fragment, null, x, p), q[31] = x, q[32] = p, q[33] = l;
    else l = q[33];
    return l
}
// @from(Ln 387381, Col 4)
FK
// @from(Ln 387381, Col 8)
H91
// @from(Ln 387381, Col 13)
klY
// @from(Ln 387382, Col 4)
UhA = v(() => {
    i1();
    m1();
    R2();
    K7();
    gO();
    vf6();
    b7();
    U5();
    FhA();
    ghA();
    XZ();
    FK = o(X1(), 1), H91 = o(X1(), 1), klY = [{
        value: "yes-session",
        label: "Yes, for this session"
    }, {
        value: "yes-remember",
        label: "Yes, and remember this directory"
    }, {
        value: "no",
        label: "No"
    }]
})
// @from(Ln 387405, Col 4)
o6q = {}
// @from(Ln 387415, Col 0)
function SlY(A) {
    let q = e(10),
        {
            message: K,
            args: Y,
            onDone: z
        } = A,
        w, H;
    if (q[0] !== z) w = () => {
        let J = setTimeout(z, 0);
        return () => clearTimeout(J)
    }, H = [z], q[0] = z, q[1] = w, q[2] = H;
    else w = q[1], H = q[2];
    r6q.useEffect(w, H);
    let $;
    if (q[3] !== Y) $ = qe.default.createElement(V, {
        dimColor: !0
    }, l1.pointer, " /add-dir ", Y), q[3] = Y, q[4] = $;
    else $ = q[4];
    let O;
    if (q[5] !== K) O = qe.default.createElement(HA, null, qe.default.createElement(V, null, K)), q[5] = K, q[6] = O;
    else O = q[6];
    let _;
    if (q[7] !== $ || q[8] !== O) _ = qe.default.createElement(I, {
        flexDirection: "column"
    }, $, O), q[7] = $, q[8] = O, q[9] = _;
    else _ = q[9];
    return _
}
// @from(Ln 387445, Col 0)
function cG1(A, q) {
    if (!A) return {
        resultType: "emptyPath"
    };
    let K = g4(A),
        Y = b1();
    if (!Y.existsSync(K)) return {
        resultType: "pathNotFound",
        directoryPath: A,
        absolutePath: K
    };
    if (!Y.statSync(K).isDirectory()) return {
        resultType: "notADirectory",
        directoryPath: A,
        absolutePath: K
    };
    let z = iG1(q);
    for (let w of z)
        if (Sp(K, w)) return {
            resultType: "alreadyInWorkingDirectory",
            directoryPath: A,
            workingDir: w
        };
    return {
        resultType: "success",
        absolutePath: K
    }
}
// @from(Ln 387474, Col 0)
function lG1(A) {
    switch (A.resultType) {
        case "emptyPath":
            return "Please provide a directory path.";
        case "pathNotFound":
            return `Path ${H6.bold(A.absolutePath)} was not found.`;
        case "notADirectory": {
            let q = ClY(A.absolutePath);
            return `${H6.bold(A.directoryPath)} is not a directory. Did you mean to add the parent directory ${H6.bold(q)}?`
        }
        case "alreadyInWorkingDirectory":
            return `${H6.bold(A.directoryPath)} is already accessible within the existing working directory ${H6.bold(A.workingDir)}.`;
        case "success":
            return `Added ${H6.bold(A.absolutePath)} as a working directory.`
    }
}
// @from(Ln 387490, Col 0)
async function hlY(A, q, K) {
    u8("multi-directory");
    let Y = (K ?? "").trim(),
        z = await q.getAppState(),
        w = async ($, O = !1) => {
            let J = {
                    type: "addDirectories",
                    directories: [$],
                    destination: O ? "localSettings" : "session"
                },
                X = await q.getAppState(),
                D = a2(X.toolPermissionContext, J);
            q.setAppState((W) => ({
                ...W,
                toolPermissionContext: D
            }));
            let j = qC();
            if (!j.includes($)) WN1([...j, $]);
            b8.refreshConfig();
            let M;
            if (O) try {
                eb(J), M = `Added ${H6.bold($)} as a working directory and saved to local settings`
            } catch (W) {
                M = `Added ${H6.bold($)} as a working directory. Failed to save to local settings: ${W instanceof Error?W.message:"Unknown error"}`
            } else M = `Added ${H6.bold($)} as a working directory for this session`;
            let P = `${M} ${H6.dim("· /permissions to manage")}`;
            A(P)
        };
    if (!Y) return qe.default.createElement(oU1, {
        permissionContext: z.toolPermissionContext,
        onAddDirectory: w,
        onCancel: () => {
            A("Did not add a working directory.")
        }
    });
    let H = cG1(Y, z.toolPermissionContext);
    if (H.resultType !== "success") {
        let $ = lG1(H);
        return qe.default.createElement(SlY, {
            message: $,
            args: K ?? "",
            onDone: () => A($)
        })
    }
    return qe.default.createElement(oU1, {
        directoryPath: H.absolutePath,
        permissionContext: z.toolPermissionContext,
        onAddDirectory: w,
        onCancel: () => {
            A(`Did not add ${H6.bold(H.absolutePath)} as a working directory.`)
        }
    })
}
// @from(Ln 387543, Col 4)
qe
// @from(Ln 387543, Col 8)
r6q
// @from(Ln 387544, Col 4)
vf6 = v(() => {
    i1();
    b7();
    q3();
    m1();
    E2();
    _8();
    Ez();
    UhA();
    eq();
    CO();
    v3();
    k2();
    B6();
    qe = o(X1(), 1), r6q = o(X1(), 1)
})
// @from(Ln 387560, Col 4)
IlY
// @from(Ln 387560, Col 9)
a6q
// @from(Ln 387561, Col 4)
s6q = v(() => {
    IlY = {
        type: "local-jsx",
        name: "add-dir",
        description: "Add a new working directory",
        argumentHint: "<path>",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (vf6(), o6q)),
        userFacingName() {
            return "add-dir"
        }
    }, a6q = IlY
})
// @from(Ln 387575, Col 4)
t6q = () => {}
// @from(Ln 387576, Col 4)
e6q = () => {}
// @from(Ln 387578, Col 0)
function AAq(A) {
    return []
}
// @from(Ln 387581, Col 0)
async function qAq({
    question: A,
    cacheSafeParams: q
}) {
    let K = {
            ...q.toolUseContext,
            options: {
                ...q.toolUseContext.options,
                maxThinkingTokens: 0
            }
        },
        Y = `<system-reminder>This is a side question from the user. You must answer this question directly in a single response.

CRITICAL CONSTRAINTS:
- You have NO tools available - you cannot read files, run commands, search, or take any actions
- This is a one-off response - there will be no follow-up turns
- You can ONLY provide information based on what you already know from the conversation context
- NEVER say things like "Let me try...", "I'll now...", "Let me check...", or promise to take any action
- If you don't know the answer, say so - do not offer to look it up or investigate

Simply answer the question with the information you have.</system-reminder>

${A}`,
        z = await av({
            promptMessages: [c6({
                content: Y
            })],
            cacheSafeParams: {
                ...q,
                toolUseContext: K
            },
            canUseTool: async () => ({
                behavior: "deny",
                message: "Side questions cannot use tools",
                decisionReason: {
                    type: "other",
                    reason: "side_question"
                }
            }),
            querySource: "side_question",
            forkLabel: "side_question",
            maxTurns: 1
        }),
        H = z.messages.find((O) => O.type === "assistant")?.message?.content?.find((O) => O.type === "text");
    return {
        response: H && H.type === "text" ? H.text.trim() : null,
        usage: z.totalUsage
    }
}
// @from(Ln 387630, Col 4)
xlY
// @from(Ln 387631, Col 4)
phA = v(() => {
    YI();
    N8();
    xlY = /^\/btw\b/gi
})
// @from(Ln 387636, Col 4)
KAq = {}
// @from(Ln 387641, Col 0)
function blY(A) {
    let q = e(21),
        {
            question: K,
            context: Y,
            onDone: z
        } = A,
        [w, H] = nG1.useState(null),
        [$, O] = nG1.useState(null),
        [_, J] = nG1.useState(0),
        X;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) X = () => J(ulY), q[0] = X;
    else X = q[0];
    RX(X, w || $ ? null : 80);
    let D;
    if (q[1] !== z) D = (N, T) => {
        if (T.escape || T.return || N === " ") z(void 0, {
            display: "skip"
        })
    }, q[1] = z, q[2] = D;
    else D = q[2];
    D8(D);
    let j, M;
    if (q[3] !== Y || q[4] !== K) j = () => {
        let N = Aq();
        return async function() {
            try {
                let [y, B, S] = await Promise.all([dZ(Y.options.tools, Y.options.mainLoopModel, [], Y.options.mcpClients), i$(), l$()]), m = await qAq({
                    question: K,
                    cacheSafeParams: {
                        systemPrompt: y,
                        userContext: B,
                        systemContext: S,
                        toolUseContext: Y,
                        forkContextMessages: Y.messages
                    }
                });
                if (!N.signal.aborted)
                    if (m.response) H(m.response);
                    else O("No response received")
            } catch (y) {
                let B = y;
                if (!N.signal.aborted) O(B.message || "Failed to get response")
            }
        }(), () => {
            N.abort()
        }
    }, M = [K, Y], q[3] = Y, q[4] = K, q[5] = j, q[6] = M;
    else j = q[5], M = q[6];
    nG1.useEffect(j, M);
    let P;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) P = pw.createElement(V, {
        color: "warning",
        bold: !0
    }, "/btw", " "), q[7] = P;
    else P = q[7];
    let W;
    if (q[8] !== K) W = pw.createElement(I, null, P, pw.createElement(V, {
        dimColor: !0
    }, K)), q[8] = K, q[9] = W;
    else W = q[9];
    let G;
    if (q[10] !== $ || q[11] !== _ || q[12] !== w) G = pw.createElement(I, {
        marginTop: 1,
        marginLeft: 2
    }, $ ? pw.createElement(V, {
        color: "error"
    }, $) : w ? pw.createElement(V, null, w) : pw.createElement(I, null, pw.createElement(SF1, {
        frame: _,
        messageColor: "warning"
    }), pw.createElement(V, {
        color: "warning"
    }, "Answering..."))), q[10] = $, q[11] = _, q[12] = w, q[13] = G;
    else G = q[13];
    let f;
    if (q[14] !== $ || q[15] !== w) f = (w || $) && pw.createElement(I, {
        marginTop: 1
    }, pw.createElement(V, {
        dimColor: !0
    }, "Press Space, Enter, or Escape to dismiss")), q[14] = $, q[15] = w, q[16] = f;
    else f = q[16];
    let Z;
    if (q[17] !== W || q[18] !== G || q[19] !== f) Z = pw.createElement(I, {
        flexDirection: "column",
        paddingLeft: 2,
        marginTop: 1
    }, W, G, f), q[17] = W, q[18] = G, q[19] = f, q[20] = Z;
    else Z = q[20];
    return Z
}
// @from(Ln 387732, Col 0)
function ulY(A) {
    return A + 1
}
// @from(Ln 387735, Col 0)
async function BlY(A, q, K) {
    let Y = K?.trim();
    if (!Y) return A("Usage: /btw <your question>", {
        display: "system"
    }), null;
    return pw.createElement(blY, {
        question: Y,
        context: q,
        onDone: A
    })
}
// @from(Ln 387746, Col 4)
pw
// @from(Ln 387746, Col 8)
nG1
// @from(Ln 387747, Col 4)
YAq = v(() => {
    i1();
    m1();
    phA();
    ov();
    TR();
    DTA();
    XZ();
    G2();
    pw = o(X1(), 1), nG1 = o(X1(), 1)
})
// @from(Ln 387758, Col 4)
mlY
// @from(Ln 387758, Col 9)
dhA
// @from(Ln 387759, Col 4)
zAq = v(() => {
    mlY = {
        type: "local-jsx",
        name: "btw",
        description: "Ask a quick side question without interrupting the main conversation",
        isEnabled: () => !1,
        isHidden: !1,
        immediate: !0,
        argumentHint: "<question>",
        load: () => Promise.resolve().then(() => (YAq(), KAq)),
        userFacingName() {
            return "btw"
        }
    }, dhA = mlY
})
// @from(Ln 387774, Col 4)
wAq = () => {}
// @from(Ln 387775, Col 4)
HAq = () => {}
// @from(Ln 387780, Col 0)
function rG1(A) {
    let q = A;
    return q = q.replace(/"(sk-ant[^\s"']{24,})"/g, '"[REDACTED_API_KEY]"'), q = q.replace(/(?<![A-Za-z0-9"'])(sk-ant-?[A-Za-z0-9_-]{10,})(?![A-Za-z0-9"'])/g, "[REDACTED_API_KEY]"), q = q.replace(/AWS key: "(AWS[A-Z0-9]{20,})"/g, 'AWS key: "[REDACTED_AWS_KEY]"'), q = q.replace(/(AKIA[A-Z0-9]{16})/g, "[REDACTED_AWS_KEY]"), q = q.replace(/(?<![A-Za-z0-9])(AIza[A-Za-z0-9_-]{35})(?![A-Za-z0-9])/g, "[REDACTED_GCP_KEY]"), q = q.replace(/(?<![A-Za-z0-9])([a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com)(?![A-Za-z0-9])/g, "[REDACTED_GCP_SERVICE_ACCOUNT]"), q = q.replace(/(["']?x-api-key["']?\s*[:=]\s*["']?)[^"',\s)}\]]+/gi, "$1[REDACTED_API_KEY]"), q = q.replace(/(["']?authorization["']?\s*[:=]\s*["']?(bearer\s+)?)[^"',\s)}\]]+/gi, "$1[REDACTED_TOKEN]"), q = q.replace(/(AWS[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_AWS_VALUE]"), q = q.replace(/(GOOGLE[_-][A-Za-z0-9_]+\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED_GCP_VALUE]"), q = q.replace(/((API[-_]?KEY|TOKEN|SECRET|PASSWORD)\s*[=:]\s*)["']?[^"',\s)}\]]+["']?/gi, "$1[REDACTED]"), q
}
// @from(Ln 387785, Col 0)
function OAq() {
    return fw1().map((A) => {
        let q = {
            ...A
        };
        if (q && typeof q.error === "string") q.error = rG1(q.error);
        return q
    })
}
// @from(Ln 387794, Col 0)
async function glY() {
    try {
        let A = dO();
        return await FlY(A, "utf-8")
    } catch {
        return null
    }
}
// @from(Ln 387803, Col 0)
function JAq({
    abortSignal: A,
    messages: q,
    initialDescription: K,
    onDone: Y,
    backgroundTasks: z = {}
}) {
    let [w, H] = XE.useState("userInput"), [$, O] = XE.useState(0), [_, J] = XE.useState(K ?? ""), [X, D] = XE.useState(null), [j, M] = XE.useState(null), [P, W] = XE.useState({
        isGit: !1,
        gitState: null
    }), [G, f] = XE.useState(null), Z = Z8().columns - 4;
    XE.useEffect(() => {
        async function k() {
            let y = await aj(),
                B = null;
            if (y) B = await XH8();
            W({
                isGit: y,
                gitState: B
            })
        }
        k()
    }, []);
    let N = XE.useCallback(async () => {
            H("submitting"), M(null), D(null);
            let k = OAq(),
                B = GN(q)?.requestId ?? null,
                S = chA(q),
                m = lhA(z),
                b = [...new Set([...S, ...m])],
                [g, U] = await Promise.all([nhA(b), glY()]),
                x = ihA(z),
                p = {
                    ...g,
                    ...x
                },
                l = {
                    latestAssistantMessageId: B,
                    message_count: q.length,
                    datetime: new Date().toISOString(),
                    description: _,
                    platform: xA.platform,
                    gitRepo: P.isGit,
                    terminal: xA.terminal,
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.VERSION,
                    transcript: WJ(q),
                    errors: k,
                    lastApiRequest: pL6(),
                    ...Object.keys(p).length > 0 && {
                        subagentTranscripts: p
                    },
                    ...U && {
                        rawTranscriptJsonl: U
                    }
                },
                [r, s] = await Promise.all([dlY(l, A), plY(_, A)]);
            if (f(s), r.success) {
                if (r.feedbackId) D(r.feedbackId), c("tengu_bug_report_submitted", {
                    feedback_id: r.feedbackId,
                    last_assistant_message_id: B
                });
                H("done")
            } else {
                if (r.isZdrOrg) M("Feedback collection is not available for organizations with custom data retention policies.");
                else M("Could not submit feedback. Please try again later.");
                H("userInput")
            }
        }, [_, P.isGit, q]),
        T = XE.useCallback(() => {
            if (w === "done") {
                if (j) Y("Error submitting feedback / bug report", {
                    display: "system"
                });
                else Y("Feedback / bug report submitted", {
                    display: "system"
                });
                return
            }
            Y("Feedback / bug report cancelled", {
                display: "system"
            })
        }, [w, j, Y]);
    return DA("confirm:no", T, {
        context: "Settings",
        isActive: w === "userInput"
    }), D8((k, y) => {
        if (w === "done") {
            if (y.return && G) {
                let B = UlY(X ?? "", G, _, OAq());
                zY(B)
            }
            if (j) Y("Error submitting feedback / bug report", {
                display: "system"
            });
            else Y("Feedback / bug report submitted", {
                display: "system"
            });
            return
        }
        if (j && w !== "userInput") {
            Y("Error submitting feedback / bug report", {
                display: "system"
            });
            return
        }
        if (w === "consent" && (y.return || k === " ")) N()
    }), U7.createElement(w8, {
        title: "Submit Feedback / Bug Report",
        onCancel: T,
        isCancelActive: w !== "userInput",
        inputGuide: (k) => k.pending ? U7.createElement(V, null, "Press ", k.keyName, " again to exit") : w === "userInput" ? U7.createElement(oA, null, U7.createElement(YA, {
            shortcut: "Enter",
            action: "continue"
        }), U7.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : w === "consent" ? U7.createElement(oA, null, U7.createElement(YA, {
            shortcut: "Enter",
            action: "submit"
        }), U7.createElement(NA, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })) : null
    }, w === "userInput" && U7.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, U7.createElement(V, null, "Describe the issue below:"), U7.createElement(k3, {
        value: _,
        onChange: (k) => {
            if (J(k), j) M(null)
        },
        columns: Z,
        onSubmit: () => H("consent"),
        onExitMessage: () => Y("Feedback cancelled", {
            display: "system"
        }),
        cursorOffset: $,
        onChangeCursorOffset: O
    }), j && U7.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, U7.createElement(V, {
        color: "error"
    }, j), U7.createElement(V, {
        dimColor: !0
    }, "Edit and press Enter to retry, or Esc to cancel"))), w === "consent" && U7.createElement(I, {
        flexDirection: "column"
    }, U7.createElement(V, null, "This report will include:"), U7.createElement(I, {
        marginLeft: 2,
        flexDirection: "column"
    }, U7.createElement(V, null, "- Your feedback / bug description:", " ", U7.createElement(V, {
        dimColor: !0
    }, _)), U7.createElement(V, null, "- Environment info:", " ", U7.createElement(V, {
        dimColor: !0
    }, xA.platform, ", ", xA.terminal, ", v", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION)), P.gitState && U7.createElement(V, null, "- Git repo metadata:", " ", U7.createElement(V, {
        dimColor: !0
    }, P.gitState.branchName, P.gitState.commitHash ? `, ${P.gitState.commitHash.slice(0,7)}` : "", P.gitState.remoteUrl ? ` @ ${P.gitState.remoteUrl}` : "", !P.gitState.isHeadOnRemote && ", not synced", !P.gitState.isClean && ", has local changes")), U7.createElement(V, null, "- Current session transcript")), U7.createElement(I, {
        marginTop: 1
    }, U7.createElement(V, {
        wrap: "wrap",
        dimColor: !0
    }, "We will use your feedback to debug related issues or to improve", " ", "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future).")), U7.createElement(I, {
        marginTop: 1
    }, U7.createElement(V, null, "Press ", U7.createElement(V, {
        bold: !0
    }, "Enter"), " to confirm and submit."))), w === "submitting" && U7.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, U7.createElement(V, null, "Submitting report…")), w === "done" && U7.createElement(I, {
        flexDirection: "column"
    }, j ? U7.createElement(V, {
        color: "error"
    }, j) : U7.createElement(V, {
        color: "success"
    }, "Thank you for your report!"), X && U7.createElement(V, {
        dimColor: !0
    }, "Feedback ID: ", X), U7.createElement(I, {
        marginTop: 1
    }, U7.createElement(V, null, "Press "), U7.createElement(V, {
        bold: !0
    }, "Enter "), U7.createElement(V, null, "to open your browser and draft a GitHub issue, or any other key to close."))))
}
// @from(Ln 388004, Col 0)
function UlY(A, q, K, Y) {
    let z = rG1(q),
        H = `**Bug Description**
${rG1(K)}

**Environment Info**
- Platform: ${xA.platform}
- Terminal: ${xA.terminal}
- Version: ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION||"unknown"}
- Feedback ID: ${A}

**Errors**
\`\`\`json
`,
        $ = "\n```\n",
        O = Q1(Y),
        _ = `${QlY}/new?title=${encodeURIComponent(z)}&labels=user-reported,bug&body=`,
        J = `
**Note:** Content was truncated.
`,
        X = encodeURIComponent(H),
        D = encodeURIComponent("\n```\n"),
        j = encodeURIComponent(`
**Note:** Content was truncated.
`),
        M = encodeURIComponent(O),
        P = $Aq - _.length - X.length - D.length - j.length;
    if (P <= 0) {
        let N = encodeURIComponent("…"),
            T = 50,
            k = $Aq - _.length - N.length - j.length - 50,
            y = H + O + "\n```\n",
            B = encodeURIComponent(y);
        if (B.length > k) {
            B = B.slice(0, k);
            let S = B.lastIndexOf("%");
            if (S >= B.length - 2) B = B.slice(0, S)
        }
        return _ + B + N + j
    }
    if (M.length <= P) return _ + X + M + D;
    let W = encodeURIComponent("…"),
        G = 50,
        f = M.slice(0, P - W.length - G),
        Z = f.lastIndexOf("%");
    if (Z >= f.length - 2) f = f.slice(0, Z);
    return _ + X + f + W + D + j
}
// @from(Ln 388052, Col 0)
async function plY(A, q) {
    try {
        let K = await SX({
                systemPrompt: ["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"'],
                userPrompt: A,
                signal: q,
                options: {
                    hasAppendSystemPrompt: !1,
                    toolChoice: void 0,
                    isNonInteractiveSession: !1,
                    agents: [],
                    querySource: "feedback",
                    mcpTools: []
                }
            }),
            Y = K.message.content[0]?.type === "text" ? K.message.content[0].text : "Bug Report";
        if (Y.startsWith(QO)) return _Aq(A);
        return Y
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), _Aq(A)
    }
}
// @from(Ln 388075, Col 0)
function _Aq(A) {
    let q = A.split(`
`)[0] || "";
    if (q.length <= 60 && q.length > 5) return q;
    let K = q.slice(0, 60);
    if (q.length > 60) {
        let Y = K.lastIndexOf(" ");
        if (Y > 30) K = K.slice(0, Y);
        K += "..."
    }
    return K.length < 10 ? "Bug Report" : K
}
// @from(Ln 388088, Col 0)
function Ef6(A) {
    if (A instanceof Error) {
        let q = Error(rG1(A.message));
        if (A.stack) q.stack = rG1(A.stack);
        K1(q)
    } else {
        let q = rG1(String(A));
        K1(Error(q))
    }
}
// @from(Ln 388098, Col 0)
async function dlY(A, q) {
    try {
        await XM();
        let K = DH();
        if (K.error) return {
            success: !1
        };
        let Y = {
                "Content-Type": "application/json",
                "User-Agent": Jr(),
                ...K.headers
            },
            z = await sA.post("https://api.anthropic.com/api/claude_cli_feedback", {
                content: Q1(A)
            }, {
                headers: Y,
                timeout: 30000,
                signal: q
            });
        if (z.status === 200) {
            let w = z.data;
            if (w?.feedback_id) return {
                success: !0,
                feedbackId: w.feedback_id
            };
            return Ef6(Error("Failed to submit feedback: request did not return feedback_id")), {
                success: !1
            }
        }
        return Ef6(Error("Failed to submit feedback:" + z.status)), {
            success: !1
        }
    } catch (K) {
        if (sA.isCancel(K)) return {
            success: !1
        };
        if (sA.isAxiosError(K) && K.response?.status === 403) {
            let Y = K.response.data;
            if (Y?.error?.type === "permission_error" && Y?.error?.message?.includes("Custom data retention settings")) return Ef6(Error("Cannot submit feedback because custom data retention settings are enabled")), {
                success: !1,
                isZdrOrg: !0
            }
        }
        return Ef6(K), {
            success: !1
        }
    }
}
// @from(Ln 388146, Col 4)
U7
// @from(Ln 388146, Col 8)
XE
// @from(Ln 388146, Col 12)
$Aq = 7250
// @from(Ln 388147, Col 4)
QlY = "https://github.com/anthropics/claude-code/issues"
// @from(Ln 388148, Col 4)
XAq = v(() => {
    m1();
    K7();
    gO();
    y6();
    G5();
    h9();
    mq();
    B0();
    J7();
    u6();
    yw();
    AB();
    Oj();
    y5();
    N8();
    B6();
    lq();
    m6();
    Bq();
    wK();
    HK();
    BK();
    U7 = o(X1(), 1), XE = o(X1(), 1)
})
// @from(Ln 388173, Col 4)
jAq = {}
// @from(Ln 388179, Col 0)
function DAq(A, q, K, Y = "", z = {}) {
    return rhA.createElement(JAq, {
        abortSignal: q,
        messages: K,
        initialDescription: Y,
        onDone: A,
        backgroundTasks: z
    })
}
// @from(Ln 388188, Col 0)
async function clY(A, q, K) {
    let Y = K || "";
    return DAq(A, q.abortController.signal, q.messages, Y)
}
// @from(Ln 388192, Col 4)
rhA
// @from(Ln 388193, Col 4)
MAq = v(() => {
    XAq();
    rhA = o(X1(), 1)
})
// @from(Ln 388197, Col 4)
llY
// @from(Ln 388197, Col 9)
ohA
// @from(Ln 388198, Col 4)
PAq = v(() => {
    hA();
    mV();
    llY = {
        aliases: ["bug"],
        type: "local-jsx",
        name: "feedback",
        description: "Submit feedback about Claude Code",
        argumentHint: "[report]",
        isEnabled: () => !(J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY) || process.env.DISABLE_FEEDBACK_COMMAND || process.env.DISABLE_BUG_COMMAND || process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC || !1 || !p0("allow_product_feedback")),
        isHidden: !1,
        load: () => Promise.resolve().then(() => (MAq(), jAq)),
        userFacingName() {
            return "feedback"
        }
    }, ohA = llY
})
// @from(Ln 388216, Col 0)
function Yc(A) {
    return !Array.isArray ? vAq(A) === "[object Array]" : Array.isArray(A)
}
// @from(Ln 388220, Col 0)
function nlY(A) {
    if (typeof A == "string") return A;
    let q = A + "";
    return q == "0" && 1 / A == -ilY ? "-0" : q
}
// @from(Ln 388226, Col 0)
function rlY(A) {
    return A == null ? "" : nlY(A)
}
// @from(Ln 388230, Col 0)
function nm(A) {
    return typeof A === "string"
}
// @from(Ln 388234, Col 0)
function NAq(A) {
    return typeof A === "number"
}
// @from(Ln 388238, Col 0)
function olY(A) {
    return A === !0 || A === !1 || alY(A) && vAq(A) == "[object Boolean]"
}
// @from(Ln 388242, Col 0)
function TAq(A) {
    return typeof A === "object"
}
// @from(Ln 388246, Col 0)
function alY(A) {
    return TAq(A) && A !== null
}
// @from(Ln 388250, Col 0)
function DE(A) {
    return A !== void 0 && A !== null
}
// @from(Ln 388254, Col 0)
function ahA(A) {
    return !A.trim().length
}
// @from(Ln 388258, Col 0)
function vAq(A) {
    return A == null ? A === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(A)
}
// @from(Ln 388261, Col 0)
class EAq {
    constructor(A) {
        this._keys = [], this._keyMap = {};
        let q = 0;
        A.forEach((K) => {
            let Y = kAq(K);
            this._keys.push(Y), this._keyMap[Y.id] = Y, q += Y.weight
        }), this._keys.forEach((K) => {
            K.weight /= q
        })
    }
    get(A) {
        return this._keyMap[A]
    }
    keys() {
        return this._keys
    }
    toJSON() {
        return JSON.stringify(this._keys)
    }
}
// @from(Ln 388283, Col 0)
function kAq(A) {
    let q = null,
        K = null,
        Y = null,
        z = 1,
        w = null;
    if (nm(A) || Yc(A)) Y = A, q = GAq(A), K = shA(A);
    else {
        if (!WAq.call(A, "name")) throw Error(AiY("name"));
        let H = A.name;
        if (Y = H, WAq.call(A, "weight")) {
            if (z = A.weight, z <= 0) throw Error(qiY(H))
        }
        q = GAq(H), K = shA(H), w = A.getFn
    }
    return {
        path: q,
        id: K,
        weight: z,
        src: Y,
        getFn: w
    }
}
// @from(Ln 388307, Col 0)
function GAq(A) {
    return Yc(A) ? A : A.split(".")
}
// @from(Ln 388311, Col 0)
function shA(A) {
    return Yc(A) ? A.join(".") : A
}
// @from(Ln 388315, Col 0)
function KiY(A, q) {
    let K = [],
        Y = !1,
        z = (w, H, $) => {
            if (!DE(w)) return;
            if (!H[$]) K.push(w);
            else {
                let O = H[$],
                    _ = w[O];
                if (!DE(_)) return;
                if ($ === H.length - 1 && (nm(_) || NAq(_) || olY(_))) K.push(rlY(_));
                else if (Yc(_)) {
                    Y = !0;
                    for (let J = 0, X = _.length; J < X; J += 1) z(_[J], H, $ + 1)
                } else if (H.length) z(_, H, $ + 1)
            }
        };
    return z(A, nm(q) ? q.split(".") : q, 0), Y ? K : K[0]
}
// @from(Ln 388335, Col 0)
function OiY(A = 1, q = 3) {
    let K = new Map,
        Y = Math.pow(10, q);
    return {
        get(z) {
            let w = z.match($iY).length;
            if (K.has(w)) return K.get(w);
            let H = 1 / Math.pow(w, 0.5 * A),
                $ = parseFloat(Math.round(H * Y) / Y);
            return K.set(w, $), $
        },
        clear() {
            K.clear()
        }
    }
}
// @from(Ln 388351, Col 0)
class Rf6 {
    constructor({
        getFn: A = g3.getFn,
        fieldNormWeight: q = g3.fieldNormWeight
    } = {}) {
        this.norm = OiY(q, 3), this.getFn = A, this.isCreated = !1, this.setIndexRecords()
    }
    setSources(A = []) {
        this.docs = A
    }
    setIndexRecords(A = []) {
        this.records = A
    }
    setKeys(A = []) {
        this.keys = A, this._keysMap = {}, A.forEach((q, K) => {
            this._keysMap[q.id] = K
        })
    }
    create() {
        if (this.isCreated || !this.docs.length) return;
        if (this.isCreated = !0, nm(this.docs[0])) this.docs.forEach((A, q) => {
            this._addString(A, q)
        });
        else this.docs.forEach((A, q) => {
            this._addObject(A, q)
        });
        this.norm.clear()
    }
    add(A) {
        let q = this.size();
        if (nm(A)) this._addString(A, q);
        else this._addObject(A, q)
    }
    removeAt(A) {
        this.records.splice(A, 1);
        for (let q = A, K = this.size(); q < K; q += 1) this.records[q].i -= 1
    }
    getValueForItemAtKeyId(A, q) {
        return A[this._keysMap[q]]
    }
    size() {
        return this.records.length
    }
    _addString(A, q) {
        if (!DE(A) || ahA(A)) return;
        let K = {
            v: A,
            i: q,
            n: this.norm.get(A)
        };
        this.records.push(K)
    }
    _addObject(A, q) {
        let K = {
            i: q,
            $: {}
        };
        this.keys.forEach((Y, z) => {
            let w = Y.getFn ? Y.getFn(A) : this.getFn(A, Y.path);
            if (!DE(w)) return;
            if (Yc(w)) {
                let H = [],
                    $ = [{
                        nestedArrIndex: -1,
                        value: w
                    }];
                while ($.length) {
                    let {
                        nestedArrIndex: O,
                        value: _
                    } = $.pop();
                    if (!DE(_)) continue;
                    if (nm(_) && !ahA(_)) {
                        let J = {
                            v: _,
                            i: O,
                            n: this.norm.get(_)
                        };
                        H.push(J)
                    } else if (Yc(_)) _.forEach((J, X) => {
                        $.push({
                            nestedArrIndex: X,
                            value: J
                        })
                    })
                }
                K.$[z] = H
            } else if (nm(w) && !ahA(w)) {
                let H = {
                    v: w,
                    n: this.norm.get(w)
                };
                K.$[z] = H
            }
        }), this.records.push(K)
    }
    toJSON() {
        return {
            keys: this.keys,
            records: this.records
        }
    }
}
// @from(Ln 388455, Col 0)
function LAq(A, q, {
    getFn: K = g3.getFn,
    fieldNormWeight: Y = g3.fieldNormWeight
} = {}) {
    let z = new Rf6({
        getFn: K,
        fieldNormWeight: Y
    });
    return z.setKeys(A.map(kAq)), z.setSources(q), z.create(), z
}