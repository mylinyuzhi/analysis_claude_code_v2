
// @from(Ln 434418, Col 0)
function g5z(A, q, K) {
    if (typeof A.message.content === "string") {
        let Y = j5(A.message.content);
        q.userMessageTokens += Y;
        return
    }
    for (let Y of A.message.content) {
        let z = B6(Y),
            _ = j5(z);
        if ("type" in Y && Y.type === "tool_result") {
            q.toolResultTokens += _;
            let w = "tool_use_id" in Y ? Y.tool_use_id : void 0,
                O = (w ? K.get(w) : void 0) || "unknown";
            q.toolResultsByType.set(O, (q.toolResultsByType.get(O) || 0) + _)
        } else q.userMessageTokens += _
    }
}
// @from(Ln 434436, Col 0)
function F5z(A, q) {
    let K = B6(A.attachment),
        Y = j5(K);
    q.attachmentTokens += Y;
    let z = A.attachment.type || "unknown";
    q.attachmentsByType.set(z, (q.attachmentsByType.get(z) || 0) + Y)
}
// @from(Ln 434443, Col 0)
async function p5z(A) {
    let q = await pg(A),
        K = {
            totalTokens: 0,
            toolCallTokens: 0,
            toolResultTokens: 0,
            attachmentTokens: 0,
            assistantMessageTokens: 0,
            userMessageTokens: 0,
            toolCallsByType: new Map,
            toolResultsByType: new Map,
            attachmentsByType: new Map
        },
        Y = new Map;
    for (let _ of q.messages)
        if (_.type === "assistant") {
            for (let w of _.message.content)
                if ("type" in w && w.type === "tool_use") {
                    let O = "id" in w ? w.id : void 0,
                        $ = ("name" in w ? w.name : void 0) || "unknown";
                    if (O) Y.set(O, $)
                }
        } for (let _ of q.messages)
        if (_.type === "assistant") B5z(_, K);
        else if (_.type === "user") g5z(_, K, Y);
    else if (_.type === "attachment") F5z(_, K);
    let z = await Ir6(cM(q.messages).map((_) => {
        if (_.type === "assistant") return {
            role: "assistant",
            content: _.message.content
        };
        return _.message
    }), []);
    return K.totalTokens = z ?? 0, K
}
// @from(Ln 434478, Col 0)
async function Qy1(A, q, K, Y, z, _, w, O, $) {
    let H = II({
            permissionMode: (await K()).mode,
            mainLoopModel: q
        }),
        j = uM(H, Zj()),
        J = await R0(Y, H),
        M = cg({
            mainThreadAgentDefinition: O,
            toolUseContext: w ?? {
                options: {}
            },
            customSystemPrompt: w?.options.customSystemPrompt,
            defaultSystemPrompt: J,
            appendSystemPrompt: w?.options.appendSystemPrompt
        }),
        [{
            systemPromptTokens: D,
            systemPromptSections: X
        }, {
            claudeMdTokens: P,
            memoryFileDetails: W
        }, {
            builtInToolTokens: Z,
            deferredBuiltinDetails: G,
            deferredBuiltinTokens: f,
            systemToolDetails: v
        }, {
            mcpToolTokens: N,
            mcpToolDetails: V,
            deferredToolTokens: L
        }, {
            agentTokens: h,
            agentDetails: R
        }, {
            slashCommandTokens: u,
            commandInfo: I
        }, g] = await Promise.all([C5z(M), I5z(), b5z(Y, K, z, H, A), WU8(Y, K, z, H, A), m5z(z), x5z(Y, K, z), p5z(A)]),
        b = (await u5z(Y, K, z)).skillInfo,
        p = b.skillFrontmatter.reduce((C6, o6) => C6 + o6.tokens, 0),
        Q = g.totalTokens,
        U = Xh(),
        r = U ? OF(q) - Jp8 : void 0,
        e = [];
    if (D > 0) e.push({
        name: "System prompt",
        tokens: D,
        color: "promptBorder"
    });
    let Y6 = Z - p;
    if (Y6 > 0) e.push({
        name: "System tools",
        tokens: Y6,
        color: "inactive"
    });
    if (N > 0) e.push({
        name: "MCP tools",
        tokens: N,
        color: "cyan_FOR_SUBAGENTS_ONLY"
    });
    if (L > 0) e.push({
        name: "MCP tools (deferred)",
        tokens: L,
        color: "inactive",
        isDeferred: !0
    });
    if (f > 0) e.push({
        name: "System tools (deferred)",
        tokens: f,
        color: "inactive",
        isDeferred: !0
    });
    if (h > 0) e.push({
        name: "Custom agents",
        tokens: h,
        color: "permission"
    });
    if (P > 0) e.push({
        name: "Memory files",
        tokens: P,
        color: "claude"
    });
    if (p > 0) e.push({
        name: "Skills",
        tokens: p,
        color: "warning"
    });
    if (Q !== null && Q > 0) e.push({
        name: "Messages",
        tokens: Q,
        color: "purple_FOR_SUBAGENTS_ONLY"
    });
    let H6 = e.reduce((C6, o6) => C6 + (o6.isDeferred ? 0 : o6.tokens), 0),
        J6 = 0;
    if (!1);
    else if (U && r !== void 0) J6 = j - r, e.push({
        name: xi8,
        tokens: J6,
        color: "inactive"
    });
    else if (!U) J6 = Mp8, e.push({
        name: ui8,
        tokens: J6,
        color: "inactive"
    });
    let s = Math.max(0, j - H6 - J6);
    e.push({
        name: "Free space",
        tokens: s,
        color: "promptBorder"
    });
    let X6 = H6,
        z6 = FD1($ ?? A),
        $6 = (z6 ? z6.input_tokens + z6.cache_creation_input_tokens + z6.cache_read_input_tokens : null) ?? X6,
        n = _ && _ < 80,
        o = j >= 1e6 ? n ? 5 : 20 : n ? 5 : 10,
        a = j >= 1e6 ? 10 : n ? 5 : 10,
        i = o * a,
        q6 = e.filter((C6) => !C6.isDeferred).map((C6) => ({
            ...C6,
            squares: C6.name === "Free space" ? Math.round(C6.tokens / j * i) : Math.max(1, Math.round(C6.tokens / j * i)),
            percentageOfTotal: Math.round(C6.tokens / j * 100)
        }));

    function w6(C6) {
        let o6 = [],
            V6 = C6.tokens / j * i,
            b6 = Math.floor(V6),
            E6 = V6 - b6;
        for (let U6 = 0; U6 < C6.squares; U6++) {
            let c6 = 1;
            if (U6 === b6 && E6 > 0) c6 = E6;
            o6.push({
                color: C6.color,
                isFilled: !0,
                categoryName: C6.name,
                tokens: C6.tokens,
                percentage: C6.percentageOfTotal,
                squareFullness: c6
            })
        }
        return o6
    }
    let O6 = [],
        L6 = q6.find((C6) => C6.name === xi8 || C6.name === ui8),
        y6 = q6.filter((C6) => C6.name !== xi8 && C6.name !== ui8 && C6.name !== "Free space");
    for (let C6 of y6) {
        let o6 = w6(C6);
        for (let V6 of o6)
            if (O6.length < i) O6.push(V6)
    }
    let G6 = L6 ? L6.squares : 0,
        R6 = e.find((C6) => C6.name === "Free space"),
        T6 = i - G6;
    while (O6.length < T6) O6.push({
        color: "promptBorder",
        isFilled: !0,
        categoryName: "Free space",
        tokens: R6?.tokens || 0,
        percentage: R6 ? Math.round(R6.tokens / j * 100) : 0,
        squareFullness: 1
    });
    if (L6) {
        let C6 = w6(L6);
        for (let o6 of C6)
            if (O6.length < i) O6.push(o6)
    }
    let D6 = [];
    for (let C6 = 0; C6 < a; C6++) D6.push(O6.slice(C6 * o, (C6 + 1) * o));
    let Q6 = new Map;
    for (let [C6, o6] of g.toolCallsByType.entries()) {
        let V6 = Q6.get(C6) || {
            callTokens: 0,
            resultTokens: 0
        };
        Q6.set(C6, {
            ...V6,
            callTokens: o6
        })
    }
    for (let [C6, o6] of g.toolResultsByType.entries()) {
        let V6 = Q6.get(C6) || {
            callTokens: 0,
            resultTokens: 0
        };
        Q6.set(C6, {
            ...V6,
            resultTokens: o6
        })
    }
    let k6 = Array.from(Q6.entries()).map(([C6, {
            callTokens: o6,
            resultTokens: V6
        }]) => ({
            name: C6,
            callTokens: o6,
            resultTokens: V6
        })).sort((C6, o6) => o6.callTokens + o6.resultTokens - (C6.callTokens + C6.resultTokens)),
        Z6 = Array.from(g.attachmentsByType.entries()).map(([C6, o6]) => ({
            name: C6,
            tokens: o6
        })).sort((C6, o6) => o6.tokens - C6.tokens),
        u6 = {
            toolCallTokens: g.toolCallTokens,
            toolResultTokens: g.toolResultTokens,
            attachmentTokens: g.attachmentTokens,
            assistantMessageTokens: g.assistantMessageTokens,
            userMessageTokens: g.userMessageTokens,
            toolCallsByType: k6,
            attachmentsByType: Z6
        };
    return {
        categories: e,
        totalTokens: $6,
        maxTokens: j,
        rawMaxTokens: j,
        percentage: Math.round($6 / j * 100),
        gridRows: D6,
        model: H,
        memoryFiles: W,
        mcpTools: V,
        deferredBuiltinTools: void 0,
        systemTools: void 0,
        systemPromptSections: void 0,
        agents: R,
        slashCommands: u > 0 ? {
            totalCommands: I.totalCommands,
            includedCommands: I.includedCommands,
            tokens: u
        } : void 0,
        skills: p > 0 ? {
            totalSkills: b.totalSkills,
            includedSkills: b.includedSkills,
            tokens: p,
            skillFrontmatter: b.skillFrontmatter
        } : void 0,
        autoCompactThreshold: r,
        isAutoCompactEnabled: U,
        messageBreakdown: u6,
        apiUsage: z6
    }
}
// @from(Ln 434720, Col 4)
xi8 = "Autocompact buffer"
// @from(Ln 434721, Col 4)
ui8 = "Compact buffer"
// @from(Ln 434722, Col 4)
hh1 = 500
// @from(Ln 434723, Col 4)
Mn6 = E(() => {
    xJ();
    T1();
    bv();
    Hf();
    AZ();
    jE();
    pc6();
    lM();
    A8();
    eR();
    JA();
    Fz6();
    z4();
    Q36();
    lA();
    Xl();
    HA();
    k1();
    H1();
    od();
    g1();
    s8()
})
// @from(Ln 434747, Col 4)
mi8 = {}
// @from(Ln 434761, Col 0)
function uZq(A) {
    if (!A.startsWith("auto:")) return null;
    let q = A.slice(5),
        K = parseInt(q, 10);
    if (isNaN(K)) return k(`Invalid ENABLE_TOOL_SEARCH value "${A}": expected auto:N where N is a number.`), null;
    return Math.max(0, Math.min(100, K))
}
// @from(Ln 434769, Col 0)
function Q5z(A) {
    if (!A) return !1;
    return A === "auto" || A.startsWith("auto:")
}
// @from(Ln 434774, Col 0)
function gi8() {
    let A = process.env.ENABLE_TOOL_SEARCH;
    if (!A) return Bi8;
    if (A === "auto") return Bi8;
    let q = uZq(A);
    if (q !== null) return q;
    return Bi8
}
// @from(Ln 434783, Col 0)
function mZq(A) {
    let q = Ch1(A),
        K = uM(A, q),
        Y = gi8() / 100;
    return Math.floor(K * Y)
}
// @from(Ln 434790, Col 0)
function BZq(A) {
    return Math.floor(mZq(A) * U5z)
}
// @from(Ln 434794, Col 0)
function Fi8() {
    let A = process.env.ENABLE_TOOL_SEARCH,
        q = A ? uZq(A) : null;
    if (q === 0) return "tst";
    if (q === 100) return "standard";
    if (Q5z(A)) return "tst-auto";
    if (t6(A)) return "tst";
    if (xz(process.env.ENABLE_TOOL_SEARCH)) return "standard";
    return "tst"
}
// @from(Ln 434805, Col 0)
function l5z() {
    try {
        let A = w8("tengu_tool_search_unsupported_models", null);
        if (A && Array.isArray(A) && A.length > 0) return A
    } catch {}
    return c5z
}
// @from(Ln 434813, Col 0)
function Vi6(A) {
    let q = A.toLowerCase(),
        K = l5z();
    for (let Y of K)
        if (q.includes(Y.toLowerCase())) return !1;
    return !0
}
// @from(Ln 434821, Col 0)
function dk() {
    let A = Fi8();
    if (A === "standard") {
        if (!RN6) RN6 = !0, k(`[ToolSearch:optimistic] mode=${A}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=false`);
        return !1
    }
    if (!process.env.ENABLE_TOOL_SEARCH && QA() === "firstParty" && !ax()) {
        if (!RN6) RN6 = !0, k(`[ToolSearch:optimistic] disabled: ANTHROPIC_BASE_URL=${process.env.ANTHROPIC_BASE_URL} is not a first-party Anthropic host. Set ENABLE_TOOL_SEARCH=true (or auto / auto:N) if your proxy forwards tool_reference blocks.`);
        return !1
    }
    if (!RN6) RN6 = !0, k(`[ToolSearch:optimistic] mode=${A}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=true`);
    return !0
}
// @from(Ln 434835, Col 0)
function bz6(A) {
    return A.some((q) => z3(q, HZ))
}
// @from(Ln 434838, Col 0)
async function i5z(A, q, K) {
    let Y = A.filter((_) => GX(_));
    if (Y.length === 0) return 0;
    return (await Promise.all(Y.map(async (_) => {
        let w = await _.prompt({
                getToolPermissionContext: q,
                tools: A,
                agents: K
            }),
            O = _.inputJSONSchema ? B6(_.inputJSONSchema) : _.inputSchema ? B6(fU(_.inputSchema)) : "";
        return _.name.length + w.length + O.length
    }))).reduce((_, w) => _ + w, 0)
}
// @from(Ln 434851, Col 0)
async function yi6(A, q, K, Y, z) {
    let _ = q.filter(($) => $.isMcp).length;

    function w($, H, j, J) {
        d("tengu_tool_search_mode_decision", {
            enabled: $,
            mode: H,
            reason: j,
            checkedModel: A,
            mcpToolCount: _,
            userType: "external",
            ...J
        })
    }
    if (!Vi6(A)) return k(`Tool search disabled for model '${A}': model does not support tool_reference blocks. This feature is only available on Claude Sonnet 4+, Opus 4+, and newer models.`), w(!1, "standard", "model_unsupported"), !1;
    if (!bz6(q)) return k("Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools)."), w(!1, "standard", "mcp_search_unavailable"), !1;
    let O = Fi8();
    switch (O) {
        case "tst":
            return w(!0, O, "tst_enabled"), !0;
        case "tst-auto": {
            let {
                enabled: $,
                debugDescription: H,
                metrics: j
            } = await o5z(q, K, Y, A);
            if ($) return k(`Auto tool search enabled: ${H}` + (z ? ` [source: ${z}]` : "")), w(!0, O, "auto_above_threshold", j), !0;
            if (q.some((J) => GX(J)) && !My()) try {
                let J = w8("tengu_tst_kx7", !1);
                return k(`Tool search ${J?"enabled":"disabled"} via experiment (tengu_tst_kx7): below threshold, deferred tools present` + (z ? ` [source: ${z}]` : "")), w(J, O, "experiment_enable_tst"), J
            } catch (J) {
                k(`tengu_tst_kx7: GrowthBook not ready, skipping: ${J}`)
            }
            return k(`Auto tool search disabled: ${H}` + (z ? ` [source: ${z}]` : "")), w(!1, O, "auto_below_threshold", j), !1
        }
        case "standard":
            return w(!1, O, "standard_mode"), !1
    }
}
// @from(Ln 434891, Col 0)
function tb(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "tool_reference"
}
// @from(Ln 434895, Col 0)
function n5z(A) {
    return tb(A) && "tool_name" in A && typeof A.tool_name === "string"
}
// @from(Ln 434899, Col 0)
function r5z(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "tool_result" && "content" in A && Array.isArray(A.content)
}
// @from(Ln 434903, Col 0)
function zF(A) {
    let q = new Set,
        K = 0;
    for (let Y of A) {
        if (Y.type === "system" && Y.subtype === "compact_boundary") {
            let _ = Y.compactMetadata?.preCompactDiscoveredTools;
            if (_) {
                for (let w of _) q.add(w);
                K += _.length
            }
            continue
        }
        if (Y.type !== "user") continue;
        let z = Y.message?.content;
        if (!Array.isArray(z)) continue;
        for (let _ of z)
            if (r5z(_)) {
                for (let w of _.content)
                    if (n5z(w)) q.add(w.tool_name)
            }
    }
    if (q.size > 0) k(`Dynamic tool loading: found ${q.size} discovered tools in message history` + (K > 0 ? ` (${K} carried from compact boundary)` : ""));
    return q
}
// @from(Ln 434928, Col 0)
function ki6() {
    return w8("tengu_glacier_2xr", !1)
}
// @from(Ln 434932, Col 0)
function eF8(A, q) {
    let K = new Set;
    for (let $ of q) {
        if ($.type !== "attachment") continue;
        if ($.attachment.type !== "deferred_tools_delta") continue;
        for (let H of $.attachment.addedNames) K.add(H);
        for (let H of $.attachment.removedNames) K.delete(H)
    }
    let Y = A.filter(GX),
        z = new Set(Y.map(($) => $.name)),
        _ = new Set(A.map(($) => $.name)),
        w = Y.filter(($) => !K.has($.name)),
        O = [];
    for (let $ of K) {
        if (z.has($)) continue;
        if (!_.has($)) O.push($)
    }
    if (w.length === 0 && O.length === 0) return null;
    return d("tengu_deferred_tools_pool_change", {
        addedCount: w.length,
        removedCount: O.length,
        priorAnnouncedCount: K.size
    }), {
        addedNames: w.map(($) => $.name).sort(),
        addedLines: w.map(fp6).sort(),
        removedNames: O.sort()
    }
}
// @from(Ln 434960, Col 0)
async function o5z(A, q, K, Y) {
    let z = await d5z(A, q, K, Y);
    if (z !== null) {
        let O = mZq(Y);
        return {
            enabled: z >= O,
            debugDescription: `${z} tokens (threshold: ${O}, ${gi8()}% of context)`,
            metrics: {
                deferredToolTokens: z,
                threshold: O
            }
        }
    }
    let _ = await i5z(A, q, K),
        w = BZq(Y);
    return {
        enabled: _ >= w,
        debugDescription: `${_} chars (threshold: ${w}, ${gi8()}% of context) (char fallback)`,
        metrics: {
            deferredToolDescriptionChars: _,
            charThreshold: w
        }
    }
}
// @from(Ln 434984, Col 4)
Bi8 = 10
// @from(Ln 434985, Col 4)
U5z = 2.5
// @from(Ln 434986, Col 4)
d5z
// @from(Ln 434986, Col 9)
c5z
// @from(Ln 434986, Col 14)
RN6 = !1
// @from(Ln 434987, Col 4)
fR = E(() => {
    HA();
    ip();
    V1();
    U4();
    A8();
    Nz();
    g1();
    g21();
    Mn6();
    H1();
    pt();
    xJ();
    Mf();
    d5z = e1(async (A, q, K, Y) => {
        let z = A.filter((_) => GX(_));
        if (z.length === 0) return 0;
        try {
            let _ = await o16(z, q, {
                activeAgents: K,
                allAgents: K
            }, Y);
            if (_ === 0) return null;
            return Math.max(0, _ - hh1)
        } catch {
            return null
        }
    }, (A) => A.filter((q) => GX(q)).map((q) => q.name).join(","));
    c5z = ["haiku"]
})
// @from(Ln 435018, Col 0)
function FZq(A) {
    for (let q of A)
        if (q.role === "assistant" && Array.isArray(q.content)) {
            for (let K of q.content)
                if (typeof K === "object" && K !== null && "type" in K && (K.type === "thinking" || K.type === "redacted_thinking")) return !0
        } return !1
}
// @from(Ln 435026, Col 0)
function a5z(A) {
    return A.map((q) => {
        if (!Array.isArray(q.content)) return q;
        let K = q.content.map((Y) => {
            if (Y.type === "tool_use") {
                let z = Y;
                return {
                    type: "tool_use",
                    id: z.id,
                    name: z.name,
                    input: z.input
                }
            }
            if (Y.type === "tool_result") {
                let z = Y;
                if (Array.isArray(z.content)) {
                    let _ = z.content.filter((w) => !tb(w));
                    if (_.length === 0) return {
                        ...z,
                        content: [{
                            type: "text",
                            text: "[tool references]"
                        }]
                    };
                    if (_.length !== z.content.length) return {
                        ...z,
                        content: _
                    }
                }
            }
            return Y
        });
        return {
            ...q,
            content: K
        }
    })
}
// @from(Ln 435064, Col 0)
async function S94(A) {
    if (!A) return 0;
    return br6([{
        role: "user",
        content: A
    }], [])
}
// @from(Ln 435071, Col 0)
async function br6(A, q) {
    return U64(A, q, async () => {
        try {
            let K = cK(),
                Y = bk(K),
                z = FZq(A);
            if (QA() === "bedrock") return t5z({
                model: lg(K),
                messages: A,
                tools: q,
                betas: Y,
                containsThinking: z
            });
            let _ = await MI({
                    maxRetries: 1,
                    model: K,
                    source: "count_tokens"
                }),
                w = QA() === "vertex" ? Y.filter(($) => en1.has($)) : Y,
                O = await _.beta.messages.countTokens({
                    model: lg(K),
                    messages: A.length > 0 ? A : [{
                        role: "user",
                        content: "foo"
                    }],
                    tools: q,
                    ...w.length > 0 ? {
                        betas: w
                    } : {},
                    ...z ? {
                        thinking: {
                            type: "enabled",
                            budget_tokens: Qi8
                        }
                    } : {}
                });
            if (typeof O.input_tokens !== "number") return null;
            return O.input_tokens
        } catch (K) {
            return _6(K), null
        }
    })
}
// @from(Ln 435115, Col 0)
function j5(A, q = 4) {
    return Math.round(A.length / q)
}
// @from(Ln 435119, Col 0)
function PV8(A) {
    switch (A) {
        case "json":
        case "jsonl":
        case "jsonc":
            return 2;
        default:
            return 4
    }
}
// @from(Ln 435130, Col 0)
function C94(A, q) {
    return j5(A, PV8(q))
}
// @from(Ln 435133, Col 0)
async function xZq(A, q) {
    let K = FZq(A),
        Y = t6(process.env.CLAUDE_CODE_USE_VERTEX) && lt6(lH()) === "global",
        z = t6(process.env.CLAUDE_CODE_USE_BEDROCK) && K,
        _ = t6(process.env.CLAUDE_CODE_USE_VERTEX) && K,
        w = Y || z || _ ? Ef() : lH(),
        O = await MI({
            maxRetries: 1,
            model: w,
            source: "count_tokens"
        }),
        $ = a5z(A),
        H = $.length > 0 ? $ : [{
            role: "user",
            content: "count"
        }],
        j = bk(w),
        J = QA() === "vertex" ? j.filter((Z) => en1.has(Z)) : j,
        D = (await O.beta.messages.create({
            model: lg(w),
            max_tokens: K ? gZq : 1,
            messages: H,
            tools: q.length > 0 ? q : void 0,
            ...J.length > 0 ? {
                betas: J
            } : {},
            metadata: Vt(),
            ...Ih1(),
            ...K ? {
                thinking: {
                    type: "enabled",
                    budget_tokens: Qi8
                }
            } : {}
        })).usage,
        X = D.input_tokens,
        P = D.cache_creation_input_tokens || 0,
        W = D.cache_read_input_tokens || 0;
    return X + P + W
}
// @from(Ln 435174, Col 0)
function GF6(A) {
    let q = 0;
    for (let K of A) q += Ap8(K);
    return q
}
// @from(Ln 435180, Col 0)
function Ap8(A) {
    if ((A.type === "assistant" || A.type === "user") && A.message?.content) return pi8(A.message?.content);
    if (A.type === "attachment" && A.attachment) {
        let q = Ui8(A.attachment),
            K = 0;
        for (let Y of q) K += pi8(Y.message.content);
        return K
    }
    return 0
}
// @from(Ln 435191, Col 0)
function pi8(A) {
    if (!A) return 0;
    if (typeof A === "string") return j5(A);
    let q = 0;
    for (let K of A) q += s5z(K);
    return q
}
// @from(Ln 435199, Col 0)
function s5z(A) {
    if (typeof A === "string") return j5(A);
    if (A.type === "text") return j5(A.text);
    if (A.type === "image" || A.type === "document") return 2000;
    if (A.type === "tool_result") return pi8(A.content);
    if (A.type === "tool_use") return j5(A.name + B6(A.input ?? {}));
    if (A.type === "thinking") return j5(A.thinking);
    if (A.type === "redacted_thinking") return j5(A.data);
    return j5(B6(A))
}
// @from(Ln 435209, Col 0)
async function t5z({
    model: A,
    messages: q,
    tools: K,
    betas: Y,
    containsThinking: z
}) {
    try {
        let _ = await IK7(),
            w = pK8(A) ? A : await G31(A);
        if (!w) return null;
        let O = {
                anthropic_version: "bedrock-2023-05-31",
                messages: q.length > 0 ? q : [{
                    role: "user",
                    content: "foo"
                }],
                max_tokens: z ? gZq : 1,
                ...K.length > 0 ? {
                    tools: K
                } : {},
                ...Y.length > 0 ? {
                    anthropic_beta: Y
                } : {},
                ...z ? {
                    thinking: {
                        type: "enabled",
                        budget_tokens: Qi8
                    }
                } : {}
            },
            {
                CountTokensCommand: $
            } = await Promise.resolve().then(() => t(Z31(), 1)),
            H = {
                modelId: w,
                input: {
                    invokeModel: {
                        body: new TextEncoder().encode(B6(O))
                    }
                }
            };
        return (await _.send(new $(H))).inputTokens ?? null
    } catch (_) {
        return _6(_), null
    }
}
// @from(Ln 435256, Col 4)
Qi8 = 1024
// @from(Ln 435257, Col 4)
gZq = 2048
// @from(Ln 435258, Col 4)
Hf = E(() => {
    ag6();
    k1();
    z4();
    JA();
    Mf();
    Tr();
    gw();
    A8();
    Tf8();
    Nz();
    vC6();
    fR();
    g1()
})
// @from(Ln 435274, Col 0)
function bh1() {
    return parseInt(process.env.MAX_MCP_OUTPUT_TOKENS ?? "25000", 10)
}
// @from(Ln 435278, Col 0)
function pZq(A) {
    return A.type === "text"
}
// @from(Ln 435282, Col 0)
function QZq(A) {
    return A.type === "image"
}
// @from(Ln 435286, Col 0)
function di8(A) {
    if (!A) return 0;
    if (typeof A === "string") return j5(A);
    return A.reduce((q, K) => {
        if (pZq(K)) return q + j5(K.text);
        else if (QZq(K)) return q + yN1;
        return q
    }, 0)
}
// @from(Ln 435296, Col 0)
function A3z() {
    return bh1() * 4
}
// @from(Ln 435300, Col 0)
function q3z() {
    return `

[OUTPUT TRUNCATED - exceeded ${bh1()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`
}
// @from(Ln 435308, Col 0)
function K3z(A, q) {
    if (A.length <= q) return A;
    return A.slice(0, q)
}
// @from(Ln 435312, Col 0)
async function Y3z(A, q) {
    let K = [],
        Y = 0;
    for (let z of A)
        if (pZq(z)) {
            let _ = q - Y;
            if (_ <= 0) break;
            if (z.text.length <= _) K.push(z), Y += z.text.length;
            else {
                K.push({
                    type: "text",
                    text: z.text.slice(0, _)
                });
                break
            }
        } else if (QZq(z)) {
        let _ = yN1 * 4;
        if (Y + _ <= q) K.push(z), Y += _;
        else {
            let w = q - Y;
            if (w > 0) {
                let O = Math.floor(w * 0.75);
                try {
                    let $ = await c44(z, O);
                    if (K.push($), $.source.type === "base64") Y += $.source.data.length;
                    else Y += _
                } catch {}
            }
        }
    } else K.push(z);
    return K
}
// @from(Ln 435344, Col 0)
async function ci8(A) {
    if (!A) return !1;
    if (di8(A) <= bh1() * e5z) return !1;
    try {
        let Y = await br6(typeof A === "string" ? [{
            role: "user",
            content: A
        }] : [{
            role: "user",
            content: A
        }], []);
        return !!(Y && Y > bh1())
    } catch (K) {
        return _6(K), !1
    }
}
// @from(Ln 435360, Col 0)
async function z3z(A) {
    if (!A) return A;
    let q = A3z(),
        K = q3z();
    if (typeof A === "string") return K3z(A, q) + K;
    else {
        let Y = await Y3z(A, q);
        return Y.push({
            type: "text",
            text: K
        }), Y
    }
}
// @from(Ln 435373, Col 0)
async function li8(A) {
    if (!await ci8(A)) return A;
    return await z3z(A)
}
// @from(Ln 435377, Col 4)
e5z = 0.5
// @from(Ln 435378, Col 4)
yN1 = 1600
// @from(Ln 435379, Col 4)
LN1 = E(() => {
    Hf();
    k1();
    jR()
})
// @from(Ln 435385, Col 0)
function UZq(A) {
    let q = A.trim(),
        K = q.split(/\s+/)[0]?.toLowerCase();
    if (!K) return;
    if (K === "npx" || K === "bunx") {
        let Y = q.split(/\s+/)[1]?.toLowerCase();
        if (Y && Y in ii8) return ii8[Y]
    }
    return ii8[K]
}
// @from(Ln 435396, Col 0)
function dZq(A) {
    for (let {
            pattern: q,
            tool: K
        }
        of _3z)
        if (q.test(A)) return K;
    return
}
// @from(Ln 435405, Col 4)
ii8
// @from(Ln 435405, Col 9)
_3z
// @from(Ln 435406, Col 4)
ni8 = E(() => {
    ii8 = {
        src: "sourcegraph",
        cody: "cody",
        aider: "aider",
        tabby: "tabby",
        tabnine: "tabnine",
        augment: "augment",
        pieces: "pieces",
        qodo: "qodo",
        aide: "aide",
        hound: "hound",
        seagoat: "seagoat",
        bloop: "bloop",
        gitloop: "gitloop",
        q: "amazon-q",
        gemini: "gemini"
    }, _3z = [{
        pattern: /^sourcegraph$/i,
        tool: "sourcegraph"
    }, {
        pattern: /^cody$/i,
        tool: "cody"
    }, {
        pattern: /^openctx$/i,
        tool: "openctx"
    }, {
        pattern: /^aider$/i,
        tool: "aider"
    }, {
        pattern: /^continue$/i,
        tool: "continue"
    }, {
        pattern: /^github[-_]?copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^copilot$/i,
        tool: "github-copilot"
    }, {
        pattern: /^cursor$/i,
        tool: "cursor"
    }, {
        pattern: /^tabby$/i,
        tool: "tabby"
    }, {
        pattern: /^codeium$/i,
        tool: "codeium"
    }, {
        pattern: /^tabnine$/i,
        tool: "tabnine"
    }, {
        pattern: /^augment[-_]?code$/i,
        tool: "augment"
    }, {
        pattern: /^augment$/i,
        tool: "augment"
    }, {
        pattern: /^windsurf$/i,
        tool: "windsurf"
    }, {
        pattern: /^aide$/i,
        tool: "aide"
    }, {
        pattern: /^codestory$/i,
        tool: "aide"
    }, {
        pattern: /^pieces$/i,
        tool: "pieces"
    }, {
        pattern: /^qodo$/i,
        tool: "qodo"
    }, {
        pattern: /^amazon[-_]?q$/i,
        tool: "amazon-q"
    }, {
        pattern: /^gemini[-_]?code[-_]?assist$/i,
        tool: "gemini"
    }, {
        pattern: /^gemini$/i,
        tool: "gemini"
    }, {
        pattern: /^hound$/i,
        tool: "hound"
    }, {
        pattern: /^seagoat$/i,
        tool: "seagoat"
    }, {
        pattern: /^bloop$/i,
        tool: "bloop"
    }, {
        pattern: /^gitloop$/i,
        tool: "gitloop"
    }, {
        pattern: /^claude[-_]?context$/i,
        tool: "claude-context"
    }, {
        pattern: /^code[-_]?index[-_]?mcp$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^code[-_]?index$/i,
        tool: "code-index-mcp"
    }, {
        pattern: /^local[-_]?code[-_]?search$/i,
        tool: "local-code-search"
    }, {
        pattern: /^codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^autodev[-_]?codebase$/i,
        tool: "autodev-codebase"
    }, {
        pattern: /^code[-_]?context$/i,
        tool: "claude-context"
    }]
})
// @from(Ln 435521, Col 0)
class uh1 {
    ws;
    started = !1;
    opened;
    isBun = typeof Bun < "u";
    constructor(A) {
        this.ws = A;
        if (this.opened = new Promise((q, K) => {
                if (this.ws.readyState === xh1) q();
                else if (this.isBun) {
                    let Y = this.ws,
                        z = () => {
                            Y.removeEventListener("open", z), Y.removeEventListener("error", _), q()
                        },
                        _ = (w) => {
                            Y.removeEventListener("open", z), Y.removeEventListener("error", _), U1("error", "mcp_websocket_connect_fail"), K(w)
                        };
                    Y.addEventListener("open", z), Y.addEventListener("error", _)
                } else {
                    let Y = this.ws;
                    Y.on("open", () => {
                        q()
                    }), Y.on("error", (z) => {
                        U1("error", "mcp_websocket_connect_fail"), K(z)
                    })
                }
            }), this.isBun) {
            let q = this.ws;
            q.addEventListener("message", this.onBunMessage), q.addEventListener("error", this.onBunError), q.addEventListener("close", this.onBunClose)
        } else {
            let q = this.ws;
            q.on("message", this.onNodeMessage), q.on("error", this.onNodeError), q.on("close", this.onNodeClose)
        }
    }
    onclose;
    onerror;
    onmessage;
    onBunMessage = (A) => {
        try {
            let q = typeof A.data === "string" ? A.data : String(A.data),
                K = i1(q),
                Y = PS.parse(K);
            this.onmessage?.(Y)
        } catch (q) {
            this.handleError(q)
        }
    };
    onBunError = () => {
        this.handleError(Error("WebSocket error"))
    };
    onBunClose = () => {
        this.handleCloseCleanup()
    };
    onNodeMessage = (A) => {
        try {
            let q = i1(A.toString("utf-8")),
                K = PS.parse(q);
            this.onmessage?.(K)
        } catch (q) {
            this.handleError(q)
        }
    };
    onNodeError = (A) => {
        this.handleError(A)
    };
    onNodeClose = () => {
        this.handleCloseCleanup()
    };
    handleError(A) {
        U1("error", "mcp_websocket_message_fail"), this.onerror?.(A instanceof Error ? A : Error("Failed to process message"))
    }
    handleCloseCleanup() {
        if (this.onclose?.(), this.isBun) {
            let A = this.ws;
            A.removeEventListener("message", this.onBunMessage), A.removeEventListener("error", this.onBunError), A.removeEventListener("close", this.onBunClose)
        } else {
            let A = this.ws;
            A.off("message", this.onNodeMessage), A.off("error", this.onNodeError), A.off("close", this.onNodeClose)
        }
    }
    async start() {
        if (this.started) throw Error("Start can only be called once per transport.");
        if (await this.opened, this.ws.readyState !== xh1) throw U1("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
        this.started = !0
    }
    async close() {
        if (this.ws.readyState === xh1 || this.ws.readyState === w3z) this.ws.close();
        this.handleCloseCleanup()
    }
    async send(A) {
        if (this.ws.readyState !== xh1) throw U1("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
        let q = B6(A);
        try {
            if (this.isBun) this.ws.send(q);
            else await new Promise((K, Y) => {
                this.ws.send(q, (z) => {
                    if (z) Y(z);
                    else K()
                })
            })
        } catch (K) {
            throw this.handleError(K), K
        }
    }
}
// @from(Ln 435626, Col 4)
w3z = 0
// @from(Ln 435627, Col 4)
xh1 = 1
// @from(Ln 435628, Col 4)
cZq = E(() => {
    hD();
    u_();
    g1()
})
// @from(Ln 435633, Col 4)
lZq = ""
// @from(Ln 435634, Col 4)
iZq = ""
// @from(Ln 435636, Col 0)
function rZq(A, {
    verbose: q
}) {
    if (Object.keys(A).length === 0) return "";
    return Object.entries(A).map(([K, Y]) => {
        let z = B6(Y);
        return `${K}: ${z}`
    }).join(", ")
}
// @from(Ln 435646, Col 0)
function oZq() {
    return eq.createElement(T3, null)
}
// @from(Ln 435650, Col 0)
function aZq(A, {
    verbose: q
}) {
    return eq.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 435659, Col 0)
function sZq(A) {
    let q = A.at(-1);
    if (!q?.data) return eq.createElement(t1, {
        height: 1
    }, eq.createElement(T, {
        dimColor: !0
    }, "Running…"));
    let {
        progress: K,
        total: Y,
        progressMessage: z
    } = q.data;
    if (K === void 0) return eq.createElement(t1, {
        height: 1
    }, eq.createElement(T, {
        dimColor: !0
    }, "Running…"));
    if (Y !== void 0 && Y > 0) {
        let _ = Math.min(1, Math.max(0, K / Y)),
            w = Math.round(_ * 100);
        return eq.createElement(t1, null, eq.createElement(m, {
            flexDirection: "column"
        }, z && eq.createElement(T, {
            dimColor: !0
        }, z), eq.createElement(m, {
            flexDirection: "row",
            gap: 1
        }, eq.createElement(jn6, {
            ratio: _,
            width: 20
        }), eq.createElement(T, {
            dimColor: !0
        }, w, "%"))))
    }
    return eq.createElement(t1, {
        height: 1
    }, eq.createElement(T, {
        dimColor: !0
    }, z ?? `Processing… ${K}`))
}
// @from(Ln 435700, Col 0)
function mh1(A, q, {
    verbose: K
}) {
    let Y = A,
        z = di8(Y),
        w = z > O3z ? `${a6.warning} Large MCP response (~${fq(z)} tokens), this can fill up context quickly` : null,
        O;
    if (Array.isArray(Y)) {
        let $ = Y.map((H, j) => {
            if (H.type === "image") return eq.createElement(m, {
                key: j,
                justifyContent: "space-between",
                overflowX: "hidden",
                width: "100%"
            }, eq.createElement(t1, {
                height: 1
            }, eq.createElement(T, null, "[Image]")));
            let J = H.type === "text" && "text" in H && H.text !== null && H.text !== void 0 ? String(H.text) : "";
            return eq.createElement(IB, {
                key: j,
                content: J,
                verbose: K
            })
        });
        O = eq.createElement(m, {
            flexDirection: "column",
            width: "100%"
        }, $)
    } else if (!Y) O = eq.createElement(m, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, eq.createElement(t1, {
        height: 1
    }, eq.createElement(T, {
        dimColor: !0
    }, "(No content)")));
    else O = eq.createElement(IB, {
        content: Y,
        verbose: K
    });
    if (w) return eq.createElement(m, {
        flexDirection: "column"
    }, eq.createElement(t1, {
        height: 1
    }, eq.createElement(T, {
        color: "warning"
    }, w)), O);
    return O
}
// @from(Ln 435750, Col 4)
eq
// @from(Ln 435750, Col 8)
O3z = 1e4
// @from(Ln 435751, Col 4)
ri8 = E(() => {
    e6();
    i6();
    gj();
    kO();
    WW6();
    iq();
    M4();
    b7();
    LN1();
    g1();
    KU8();
    q3();
    eq = t(P6(), 1)
})
// @from(Ln 435766, Col 4)
$3z
// @from(Ln 435766, Col 9)
H3z
// @from(Ln 435766, Col 14)
tZq
// @from(Ln 435767, Col 4)
eZq = E(() => {
    K7();
    ri8();
    $3z = F6(() => C.object({}).passthrough()), H3z = F6(() => C.string().describe("MCP tool execution result")), tZq = {
        isMcp: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput() {
            return ""
        },
        isDestructive() {
            return !1
        },
        isOpenWorld() {
            return !1
        },
        name: "mcp",
        maxResultSizeChars: 1e5,
        async description() {
            return iZq
        },
        async prompt() {
            return lZq
        },
        get inputSchema() {
            return $3z()
        },
        get outputSchema() {
            return H3z()
        },
        async call() {
            return {
                data: ""
            }
        },
        async checkPermissions() {
            return {
                behavior: "passthrough",
                message: "MCPTool requires permission."
            }
        },
        renderToolUseMessage: rZq,
        userFacingName: () => "mcp",
        renderToolUseRejectedMessage: oZq,
        renderToolUseErrorMessage: aZq,
        renderToolUseProgressMessage: sZq,
        renderToolResultMessage: mh1,
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A
            }
        }
    }
})
// @from(Ln 435831, Col 0)
function j3z(A) {
    return A.scope === "project" || A.scope === "local"
}
// @from(Ln 435834, Col 0)
async function J3z(A, q) {
    if (!q.headersHelper) return null;
    if ("scope" in q && j3z(q) && !q7()) {
        if (!l_()) {
            let Y = Error(`Security: headersHelper for MCP server '${A}' executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.76",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-03-14T00:12:49Z"}.FEEDBACK_CHANNEL}.`);
            return jV("MCP headersHelper invoked before trust check", Y), d("tengu_mcp_headersHelper_missing_trust", {}), null
        }
    }
    try {
        n1(A, "Executing headersHelper to get dynamic headers");
        let K = await RA(q.headersHelper, [], {
            shell: !0,
            timeout: 1e4
        });
        if (K.code !== 0 || !K.stdout) throw Error(`headersHelper for MCP server '${A}' did not return a valid value`);
        let Y = K.stdout.trim(),
            z = i1(Y);
        if (typeof z !== "object" || z === null || Array.isArray(z)) throw Error(`headersHelper for MCP server '${A}' must return a JSON object with string key-value pairs`);
        for (let [_, w] of Object.entries(z))
            if (typeof w !== "string") throw Error(`headersHelper for MCP server '${A}' returned non-string value for key "${_}": ${typeof w}`);
        return n1(A, `Successfully retrieved ${Object.keys(z).length} headers from headersHelper`), z
    } catch (K) {
        return EY(A, `Error getting headers from headersHelper: ${_1(K)}`), _6(Error(`Error getting MCP headers from headersHelper for server '${A}': ${_1(K)}`)), null
    }
}
// @from(Ln 435859, Col 0)
async function Bh1(A, q) {
    let K = q.headers || {},
        Y = await J3z(A, q) || {};
    return {
        ...K,
        ...Y
    }
}
// @from(Ln 435867, Col 4)
AGq = E(() => {
    Eq();
    k8();
    k1();
    H1();
    V1();
    T1();
    g1();
    s8()
})
// @from(Ln 435877, Col 0)
class oi8 {
    serverName;
    sendMcpMessage;
    isClosed = !1;
    onclose;
    onerror;
    onmessage;
    constructor(A, q) {
        this.serverName = A;
        this.sendMcpMessage = q
    }
    async start() {}
    async send(A) {
        if (this.isClosed) throw Error("Transport is closed");
        let q = await this.sendMcpMessage(this.serverName, A);
        if (this.onmessage) this.onmessage(q)
    }
    async close() {
        if (this.isClosed) return;
        this.isClosed = !0, this.onclose?.()
    }
}
// @from(Ln 435899, Col 4)
KGq = {}
// @from(Ln 435905, Col 0)
function D3z(A, q, K) {
    let Y = A.tabId;
    if (typeof Y === "number") Hw4(Y);
    let z = [];
    switch (q) {
        case "navigate":
            if (typeof A.url === "string") try {
                let _ = new URL(A.url);
                z.push(_.hostname)
            } catch {
                z.push(jq(A.url, 30))
            }
            break;
        case "find":
            if (typeof A.query === "string") z.push(`pattern: ${jq(A.query,30)}`);
            break;
        case "computer":
            if (typeof A.action === "string") {
                let _ = A.action;
                if (_ === "left_click" || _ === "right_click" || _ === "double_click" || _ === "middle_click")
                    if (typeof A.ref === "string") z.push(`${_} on ${A.ref}`);
                    else if (Array.isArray(A.coordinate)) z.push(`${_} at (${A.coordinate.join(", ")})`);
                else z.push(_);
                else if (_ === "type" && typeof A.text === "string") z.push(`type "${jq(A.text,15)}"`);
                else if (_ === "key" && typeof A.text === "string") z.push(`key ${A.text}`);
                else if (_ === "scroll" && typeof A.scroll_direction === "string") z.push(`scroll ${A.scroll_direction}`);
                else if (_ === "wait" && typeof A.duration === "number") z.push(`wait ${A.duration}s`);
                else if (_ === "left_click_drag") z.push("drag");
                else z.push(_)
            }
            break;
        case "gif_creator":
            if (typeof A.action === "string") z.push(`${A.action}`);
            break;
        case "resize_window":
            if (typeof A.width === "number" && typeof A.height === "number") z.push(`${A.width}x${A.height}`);
            break;
        case "read_console_messages":
            if (typeof A.pattern === "string") z.push(`pattern: ${jq(A.pattern,20)}`);
            if (A.onlyErrors === !0) z.push("errors only");
            break;
        case "read_network_requests":
            if (typeof A.urlPattern === "string") z.push(`pattern: ${jq(A.urlPattern,20)}`);
            break;
        case "shortcuts_execute":
            if (typeof A.shortcutId === "string") z.push(`shortcut_id: ${A.shortcutId}`);
            break;
        case "javascript_tool":
            if (K && typeof A.text === "string") return A.text;
            return "";
        case "tabs_create_mcp":
        case "tabs_context_mcp":
        case "form_input":
        case "shortcuts_list":
        case "read_page":
        case "upload_image":
        case "get_page_text":
        case "update_plan":
            return ""
    }
    return z.join(", ") || null
}
// @from(Ln 435968, Col 0)
function X3z(A) {
    if (!cG()) return null;
    if (typeof A !== "object" || A === null || !("tabId" in A)) return null;
    let q = typeof A.tabId === "number" ? A.tabId : typeof A.tabId === "string" ? parseInt(A.tabId, 10) : NaN;
    if (isNaN(q)) return null;
    let K = `${M3z}${q}`;
    return eb.createElement(T, null, " ", eb.createElement(y7, {
        url: K
    }, eb.createElement(T, {
        color: "subtle"
    }, "[View Tab]")))
}
// @from(Ln 435981, Col 0)
function qGq(A, q, K) {
    if (K) return mh1(A, [], {
        verbose: K
    });
    let Y = null;
    switch (q) {
        case "navigate":
            Y = "Navigation completed";
            break;
        case "tabs_create_mcp":
            Y = "Tab created";
            break;
        case "tabs_context_mcp":
            Y = "Tabs read";
            break;
        case "form_input":
            Y = "Input completed";
            break;
        case "computer":
            Y = "Action completed";
            break;
        case "resize_window":
            Y = "Window resized";
            break;
        case "find":
            Y = "Search completed";
            break;
        case "gif_creator":
            Y = "GIF action completed";
            break;
        case "read_console_messages":
            Y = "Console messages retrieved";
            break;
        case "read_network_requests":
            Y = "Network requests retrieved";
            break;
        case "shortcuts_list":
            Y = "Shortcuts retrieved";
            break;
        case "shortcuts_execute":
            Y = "Shortcut executed";
            break;
        case "javascript_tool":
            Y = "Script executed";
            break;
        case "read_page":
            Y = "Page read";
            break;
        case "upload_image":
            Y = "Image uploaded";
            break;
        case "get_page_text":
            Y = "Page text retrieved";
            break;
        case "update_plan":
            Y = "Plan updated";
            break
    }
    if (Y) return eb.createElement(t1, {
        height: 1
    }, eb.createElement(T, {
        dimColor: !0
    }, Y));
    return null
}
// @from(Ln 436047, Col 0)
function P3z(A) {
    return {
        userFacingName(q) {
            return `Claude in Chrome[${A.replace(/_mcp$/,"")}]`
        },
        renderToolUseMessage(q, {
            verbose: K
        }) {
            return D3z(q, A, K)
        },
        renderToolUseTag(q) {
            return X3z(q)
        },
        renderToolResultMessage(q, K, {
            verbose: Y
        }) {
            if (!W3z(q)) return null;
            return qGq(q, A, Y)
        }
    }
}
// @from(Ln 436069, Col 0)
function W3z(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 436072, Col 4)
eb
// @from(Ln 436072, Col 8)
M3z = "https://clau.de/chrome/tab/"
// @from(Ln 436073, Col 4)
YGq = E(() => {
    i6();
    iq();
    mU();
    M4();
    ri8();
    SR();
    eb = t(P6(), 1)
})
// @from(Ln 436082, Col 4)
zGq = {}
// @from(Ln 436086, Col 0)
class ai8 {
    peer;
    closed = !1;
    onclose;
    onerror;
    onmessage;
    _setPeer(A) {
        this.peer = A
    }
    async start() {}
    async send(A) {
        if (this.closed) throw Error("Transport is closed");
        queueMicrotask(() => {
            this.peer?.onmessage?.(A)
        })
    }
    async close() {
        if (this.closed) return;
        if (this.closed = !0, this.onclose?.(), this.peer && !this.peer.closed) this.peer.closed = !0, this.peer.onclose?.()
    }
}
// @from(Ln 436108, Col 0)
function Z3z() {
    let A = new ai8,
        q = new ai8;
    return A._setPeer(q), q._setPeer(A), [A, q]
}
// @from(Ln 436124, Col 0)
function jGq(A) {
    if (("code" in A ? A.code : void 0) !== 404) return !1;
    return A.message.includes('"code":-32001') || A.message.includes('"code": -32001')
}
// @from(Ln 436129, Col 0)
function f3z() {
    return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || G3z
}
// @from(Ln 436133, Col 0)
function Kn8() {
    return E3z(c8(), "mcp-needs-auth-cache.json")
}
// @from(Ln 436137, Col 0)
function JGq() {
    if (!gr6) gr6 = v3z(Kn8(), "utf-8").then((A) => i1(A)).catch(() => ({}));
    return gr6
}
// @from(Ln 436141, Col 0)
async function R3z(A) {
    let K = (await JGq())[A];
    if (!K) return !1;
    return Date.now() - K.timestamp < L3z
}
// @from(Ln 436147, Col 0)
function si8(A) {
    _Gq = _Gq.then(async () => {
        let q = await JGq();
        q[A] = {
            timestamp: Date.now()
        };
        let K = Kn8();
        await k3z(y3z(K), {
            recursive: !0
        }), await N3z(K, B6(q)), gr6 = null
    }).catch(() => {})
}
// @from(Ln 436160, Col 0)
function Pw4() {
    gr6 = null, V3z(Kn8()).catch(() => {})
}
// @from(Ln 436164, Col 0)
function h3z(A) {
    return async (q, K) => {
        let Y = async () => {
            await dz();
            let O = sA();
            if (!O) throw Error("No claude.ai OAuth token available");
            let $ = new Headers(K?.headers);
            return $.set("Authorization", `Bearer ${O.accessToken}`), {
                response: await A(q, {
                    ...K,
                    headers: $
                }),
                sentToken: O.accessToken
            }
        }, {
            response: z,
            sentToken: _
        } = await Y();
        if (z.status !== 401) return z;
        let w = await DG(_).catch(() => !1);
        if (d("tengu_mcp_claudeai_proxy_401", {
                tokenChanged: w
            }), !w) {
            let O = sA()?.accessToken;
            if (!O || O === _) return z
        }
        try {
            return (await Y()).response
        } catch {
            return z
        }
    }
}
// @from(Ln 436197, Col 0)
async function wGq(A, q) {
    return new(await Promise.resolve().then(() => (VO6(), V61))).default(A, ["mcp"], q)
}
// @from(Ln 436201, Col 0)
function gh1() {
    return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}
// @from(Ln 436205, Col 0)
function ti8(A) {
    return async (q, K) => {
        if ((K?.method ?? "GET").toUpperCase() === "GET") return A(q, K);
        let z = new Headers(K?.headers);
        if (!z.has("accept")) z.set("accept", C3z);
        let _ = AbortSignal.timeout(MGq);
        if (!K?.signal) return A(q, {
            ...K,
            headers: z,
            signal: _
        });
        let w = new AbortController,
            O = () => w.abort();
        K.signal.addEventListener("abort", O), _.addEventListener("abort", O);
        let $ = () => {
            K.signal?.removeEventListener("abort", O), _.removeEventListener("abort", O)
        };
        if (K.signal.aborted) w.abort();
        try {
            let H = await A(q, {
                ...K,
                headers: z,
                signal: w.signal
            });
            return $(), H
        } catch (H) {
            throw $(), H
        }
    }
}
// @from(Ln 436236, Col 0)
function Yn8() {
    return parseInt(process.env.MCP_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 3
}
// @from(Ln 436240, Col 0)
function I3z() {
    return parseInt(process.env.MCP_REMOTE_SERVER_CONNECTION_BATCH_SIZE || "", 10) || 20
}
// @from(Ln 436244, Col 0)
function OGq(A) {
    return !A.type || A.type === "stdio" || A.type === "sdk"
}
// @from(Ln 436248, Col 0)
function x3z(A) {
    return !A.name.startsWith("mcp__ide__") || b3z.includes(A.name)
}
// @from(Ln 436252, Col 0)
function ei8(A, q) {
    return `${A}-${B6(q)}`
}
// @from(Ln 436255, Col 0)
async function VN(A, q) {
    let K = ei8(A, q);
    try {
        let Y = await zh(A, q);
        if (Y.type === "connected") await Y.cleanup()
    } catch {}
    zh.cache.delete(K), JE.cache.delete(A), Rl.cache.delete(A), K_6.cache.delete(A)
}
// @from(Ln 436263, Col 0)
async function yT6(A) {
    if (A.config.type === "sdk") return A;
    let q = await zh(A.name, A.config);
    if (q.type !== "connected") throw new EV(`MCP server "${A.name}" is not connected`, "MCP server not connected");
    return q
}
// @from(Ln 436270, Col 0)
function DGq(A, q) {
    if (A.type !== q.type) return !1;
    let {
        scope: K,
        ...Y
    } = A, {
        scope: z,
        ..._
    } = q;
    return B6(Y) === B6(_)
}
// @from(Ln 436282, Col 0)
function u3z(A, q) {
    let K = Object.keys(A);
    return K.length > 0 ? K.map((Y) => `${Y}=${String(A[Y])}`).join(" ") : q
}
// @from(Ln 436286, Col 0)
async function pC(A, q, K) {
    return (await PGq({
        client: K,
        tool: A,
        args: q,
        signal: sK().signal
    })).content
}
// @from(Ln 436294, Col 0)
async function nl(A, q) {
    try {
        tV(), await VN(A, q);
        let K = await zh(A, q);
        if (K.type !== "connected") return {
            client: K,
            tools: [],
            commands: []
        };
        if (q.type === "claudeai-proxy") XE8(A);
        let Y = !!K.capabilities?.resources,
            [z, _, w] = await Promise.all([JE(K), K_6(K), Y ? Rl(K) : Promise.resolve([])]),
            O = [];
        if (Y) {
            if (![Ll, hl].some((H) => z.some((j) => z3(j, H.name)))) O.push(Ll, hl);
            if (K.capabilities?.resources?.subscribe && xr6 && ur6) {
                if (![xr6, ur6].some((j) => z.some((J) => z3(J, j.name)))) O.push(xr6, ur6)
            }
        }
        if (mr6 && Br6) {
            if (![mr6, Br6].some((H) => z.some((j) => z3(j, H.name)))) O.push(mr6, Br6)
        }
        return {
            client: K,
            tools: [...z, ...O],
            commands: _,
            resources: w.length > 0 ? w : void 0
        }
    } catch (K) {
        return EY(A, `Error during reconnection: ${_1(K)}`), {
            client: {
                name: A,
                type: "failed",
                config: q
            },
            tools: [],
            commands: []
        }
    }
}
// @from(Ln 436334, Col 0)
async function $Gq(A, q, K) {
    await Ux6(A, K, {
        concurrency: q
    })
}
// @from(Ln 436339, Col 0)
async function ZL1(A, q) {
    let K = !1,
        Y = !1,
        z = !1,
        _ = Object.entries(q ?? (await Je()).servers),
        w = [];
    for (let Z of _)
        if (iv(Z[0])) A({
            client: {
                name: Z[0],
                type: "disabled",
                config: Z[1]
            },
            tools: [],
            commands: []
        });
        else w.push(Z);
    let O = w.length,
        $ = w.filter(([Z, G]) => G.type === "stdio").length,
        H = w.filter(([Z, G]) => G.type === "sse").length,
        j = w.filter(([Z, G]) => G.type === "http").length,
        J = w.filter(([Z, G]) => G.type === "sse-ide").length,
        M = w.filter(([Z, G]) => G.type === "ws-ide").length,
        D = w.filter(([Z, G]) => OGq(G)),
        X = w.filter(([Z, G]) => !OGq(G)),
        P = {
            totalServers: O,
            stdioCount: $,
            sseCount: H,
            httpCount: j,
            sseIdeCount: J,
            wsIdeCount: M
        },
        W = async ([Z, G]) => {
            try {
                if (iv(Z)) {
                    A({
                        client: {
                            name: Z,
                            type: "disabled",
                            config: G
                        },
                        tools: [],
                        commands: []
                    });
                    return
                }
                if ((G.type === "claudeai-proxy" || G.type === "http" || G.type === "sse") && await R3z(Z)) {
                    n1(Z, "Skipping connection (cached needs-auth)"), A({
                        client: {
                            name: Z,
                            type: "needs-auth",
                            config: G
                        },
                        tools: [],
                        commands: []
                    });
                    return
                }
                let f = await zh(Z, G, P);
                if (f.type !== "connected") {
                    A({
                        client: f,
                        tools: [],
                        commands: []
                    });
                    return
                }
                if (G.type === "claudeai-proxy") XE8(Z);
                let v = !!f.capabilities?.resources,
                    [N, V, L] = await Promise.all([JE(f), K_6(f), v ? Rl(f) : Promise.resolve([])]),
                    h = [];
                if (v && !K) K = !0, h.push(Ll, hl);
                if (xr6 && ur6 && f.capabilities?.resources?.subscribe && !Y) Y = !0, h.push(xr6, ur6);
                if (mr6 && Br6 && !z) z = !0, h.push(mr6, Br6);
                A({
                    client: f,
                    tools: [...N, ...h],
                    commands: V,
                    resources: L.length > 0 ? L : void 0
                })
            } catch (f) {
                EY(Z, `Error fetching tools/commands/resources: ${_1(f)}`), A({
                    client: {
                        name: Z,
                        type: "failed",
                        config: G
                    },
                    tools: [],
                    commands: []
                })
            }
        };
    await Promise.all([$Gq(D, Yn8(), W), $Gq(X, I3z(), W)])
}
// @from(Ln 436435, Col 0)
function Fr6(A) {
    return new Promise((q) => {
        let K = 0,
            Y = 0;
        if (K = Object.keys(A).length, K === 0) {
            q({
                clients: [],
                tools: [],
                commands: []
            });
            return
        }
        let z = [],
            _ = [],
            w = [];
        ZL1((O) => {
            if (z.push(O.client), _.push(...O.tools), w.push(...O.commands), Y++, Y >= K) {
                let $ = w.reduce((H, j) => {
                    let J = j.name.length + (j.description ?? "").length + (j.argumentHint ?? "").length;
                    return H + J
                }, 0);
                d("tengu_mcp_tools_commands_loaded", {
                    tools_count: _.length,
                    commands_count: w.length,
                    commands_metadata_length: $
                }), q({
                    clients: z,
                    tools: _,
                    commands: w
                })
            }
        }, A).catch((O) => {
            EY("prefetchAllMcpResources", `Failed to get MCP resources: ${_1(O)}`), q({
                clients: [],
                tools: [],
                commands: []
            })
        })
    })
}
// @from(Ln 436475, Col 0)
async function XGq(A, q) {
    switch (A.type) {
        case "text":
            return [{
                type: "text",
                text: A.text
            }];
        case "audio": {
            let K = A;
            return await HGq(Buffer.from(K.data, "base64"), K.mimeType, q, `[Audio from ${q}] `)
        }
        case "image": {
            let K = Buffer.from(String(A.data), "base64"),
                Y = A.mimeType?.split("/")[1] || "png",
                z = await Bk(K, K.length, Y);
            return [{
                type: "image",
                source: {
                    data: z.buffer.toString("base64"),
                    media_type: `image/${z.mediaType}`,
                    type: "base64"
                }
            }]
        }
        case "resource": {
            let K = A.resource,
                Y = `[Resource from ${q} at ${K.uri}] `;
            if ("text" in K) return [{
                type: "text",
                text: `${Y}${K.text}`
            }];
            else if ("blob" in K)
                if (S3z.has(K.mimeType ?? "")) {
                    let _ = Buffer.from(K.blob, "base64"),
                        w = K.mimeType?.split("/")[1] || "png",
                        O = await Bk(_, _.length, w),
                        $ = [];
                    if (Y) $.push({
                        type: "text",
                        text: Y
                    });
                    return $.push({
                        type: "image",
                        source: {
                            data: O.buffer.toString("base64"),
                            media_type: `image/${O.mediaType}`,
                            type: "base64"
                        }
                    }), $
                } else return await HGq(Buffer.from(K.blob, "base64"), K.mimeType, q, Y);
            return []
        }
        case "resource_link": {
            let K = A,
                Y = `[Resource link: ${K.name}] ${K.uri}`;
            if (K.description) Y += ` (${K.description})`;
            return [{
                type: "text",
                text: Y
            }]
        }
        default:
            return []
    }
}
// @from(Ln 436540, Col 0)
async function HGq(A, q, K, Y) {
    let z = `mcp-${lO(K)}-blob-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        _ = await _T6(A, q, z);
    if ("error" in _) return [{
        type: "text",
        text: `${Y}Binary content (${q||"unknown type"}, ${A.length} bytes) could not be saved to disk: ${_.error}`
    }];
    return [{
        type: "text",
        text: Ak1(_.filepath, q, _.size, Y)
    }]
}
// @from(Ln 436553, Col 0)
function Fh1(A, q = 2) {
    if (A === null) return "null";
    if (Array.isArray(A)) {
        if (A.length === 0) return "[]";
        return `[${Fh1(A[0],q-1)}]`
    }
    if (typeof A === "object") {
        if (q <= 0) return "{...}";
        let Y = Object.entries(A).slice(0, 10).map(([_, w]) => `${_}: ${Fh1(w,q-1)}`),
            z = Object.keys(A).length > 10 ? ", ..." : "";
        return `{${Y.join(", ")}${z}}`
    }
    return typeof A
}
// @from(Ln 436567, Col 0)
async function m3z(A, q, K) {
    if (A && typeof A === "object") {
        if ("toolResult" in A) return {
            content: String(A.toolResult),
            type: "toolResult"
        };
        if ("structuredContent" in A && A.structuredContent !== void 0) return {
            content: B6(A.structuredContent),
            type: "structuredContent",
            schema: Fh1(A.structuredContent)
        };
        if ("content" in A && Array.isArray(A.content)) {
            let z = (await Promise.all(A.content.map((_) => XGq(_, K)))).flat();
            return {
                content: z,
                type: "contentArray",
                schema: Fh1(z)
            }
        }
    }
    let Y = `MCP server "${K}" tool "${q}": unexpected response format`;
    throw EY(K, Y), new EV(Y, "MCP tool unexpected response format")
}
// @from(Ln 436591, Col 0)
function B3z(A) {
    if (!A || typeof A === "string") return !1;
    return A.some((q) => q.type === "image")
}
// @from(Ln 436595, Col 0)
async function g3z(A, q, K) {
    let {
        content: Y,
        type: z,
        schema: _
    } = await m3z(A, q, K);
    if (K === "ide") return Y;
    if (!await ci8(Y)) return Y;
    if (xz(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES)) return await li8(Y);
    if (!Y) return Y;
    if (B3z(Y)) return await li8(Y);
    let w = Date.now(),
        O = `mcp-${lO(K)}-${lO(q)}-${w}`,
        $ = typeof Y === "string" ? Y : B6(Y, null, 2),
        H = await XP1($, O);
    if (WP1(H)) return `Error: result (${$.length.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${H.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
    let j = vs4(z, _);
    return Ns4(H.filepath, H.originalSize, j)
}
// @from(Ln 436614, Col 0)
async function F3z({
    client: A,
    clientConnection: q,
    tool: K,
    args: Y,
    meta: z,
    signal: _,
    setAppState: w,
    onProgress: O,
    callToolFn: $ = PGq,
    handleElicitation: H
}) {
    for (let J = 0;; J++) try {
        return await $({
            client: A,
            tool: K,
            args: Y,
            meta: z,
            signal: _,
            onProgress: O
        })
    } catch (M) {
        if (!(M instanceof Aq) || M.code !== Fq.UrlElicitationRequired) throw M;
        if (J >= 3) throw M;
        if (!KK6()) throw M;
        let D = M.data,
            P = (D != null && typeof D === "object" && "elicitations" in D && Array.isArray(D.elicitations) ? D.elicitations : []).filter((Z) => {
                if (Z == null || typeof Z !== "object") return !1;
                let G = Z;
                return G.mode === "url" && typeof G.url === "string" && typeof G.elicitationId === "string" && typeof G.message === "string"
            }),
            W = q.type === "connected" ? q.name : "unknown";
        if (P.length === 0) throw n1(W, `Tool '${K}' returned -32042 but no valid elicitations in error data`), M;
        n1(W, `Tool '${K}' requires URL elicitation (error -32042, attempt ${J+1}), processing ${P.length} elicitation(s)`);
        for (let Z of P) {
            let {
                elicitationId: G
            } = Z, f = await sx6(W, Z, _);
            if (f) {
                if (n1(W, `URL elicitation ${G} resolved by hook: ${B6(f)}`), f.action !== "accept") return {
                    content: `URL elicitation was ${f.action==="decline"?"declined":f.action+"ed"} by a hook. The tool "${K}" could not complete because it requires the user to open a URL.`
                };
                continue
            }
            let v;
            if (H) v = await H(W, Z, _);
            else {
                let V = {
                    actionLabel: "Retry now",
                    showCancel: !0
                };
                v = await new Promise((L) => {
                    let h = () => {
                        L({
                            action: "cancel"
                        })
                    };
                    if (_.aborted) {
                        h();
                        return
                    }
                    _.addEventListener("abort", h), w((R) => ({
                        ...R,
                        elicitation: {
                            queue: [...R.elicitation.queue, {
                                serverName: W,
                                requestId: `error-elicit-${G}`,
                                params: Z,
                                signal: _,
                                waitingState: V,
                                respond: (u) => {
                                    if (u.action === "accept") return;
                                    _.removeEventListener("abort", h), L(u)
                                },
                                onWaitingDismiss: (u) => {
                                    if (_.removeEventListener("abort", h), u === "retry") L({
                                        action: "accept"
                                    });
                                    else L({
                                        action: "cancel"
                                    })
                                }
                            }]
                        }
                    }))
                })
            }
            let N = await tx6(W, v, _, "url", G);
            if (N.action !== "accept") return n1(W, `User ${N.action==="decline"?"declined":N.action+"ed"} URL elicitation ${G}`), {
                content: `URL elicitation was ${N.action==="decline"?"declined":N.action+"ed"} by the user. The tool "${K}" could not complete because it requires the user to open a URL.`
            };
            n1(W, `Elicitation ${G} completed, retrying tool call`)
        }
    }
}
// @from(Ln 436709, Col 0)
async function PGq({
    client: {
        client: A,
        name: q,
        config: K
    },
    tool: Y,
    args: z,
    meta: _,
    signal: w,
    onProgress: O
}) {
    let $ = Date.now(),
        H;
    try {
        n1(q, `Calling MCP tool: ${Y}`), H = setInterval((G, f, v) => {
            let N = Date.now() - G,
                L = `${Math.floor(N/1000)}s`;
            n1(f, `Tool '${v}' still running (${L} elapsed)`)
        }, 30000, $, q, Y);
        let j = f3z(),
            J, M = new Promise((G, f) => {
                J = setTimeout((v, N, V, L) => {
                    v(new EV(`MCP server "${N}" tool "${V}" timed out after ${Math.floor(L/1000)}s`, "MCP tool timeout"))
                }, j, f, q, Y, j)
            }),
            D = await Promise.race([A.callTool({
                name: Y,
                arguments: z,
                _meta: _
            }, bx, {
                signal: w,
                timeout: j,
                onprogress: O ? (G) => {
                    O({
                        type: "mcp_progress",
                        status: "progress",
                        serverName: q,
                        toolName: Y,
                        progress: G.progress,
                        total: G.total,
                        progressMessage: G.message
                    })
                } : void 0
            }), M]).finally(() => {
                if (J) clearTimeout(J)
            });
        if ("isError" in D && D.isError) {
            let G = "Unknown error";
            if ("content" in D && Array.isArray(D.content) && D.content.length > 0) {
                let f = D.content[0];
                if (f && typeof f === "object" && "text" in f) G = f.text
            } else if ("error" in D) G = String(D.error);
            throw EY(q, G), new ZE1(G, "MCP tool returned error", "_meta" in D && D._meta ? {
                _meta: D._meta
            } : void 0)
        }
        let X = Date.now() - $,
            P = X < 1000 ? `${X}ms` : X < 60000 ? `${Math.floor(X/1000)}s` : `${Math.floor(X/60000)}m ${Math.floor(X%60000/1000)}s`;
        n1(q, `Tool '${Y}' completed successfully in ${P}`);
        let W = dZq(q);
        if (W) d("tengu_code_indexing_tool_used", {
            tool: W,
            source: "mcp",
            success: !0
        });
        return {
            content: await g3z(D, Y, q),
            _meta: D._meta,
            structuredContent: D.structuredContent
        }
    } catch (j) {
        if (H !== void 0) clearInterval(H);
        let J = Date.now() - $;
        if (j instanceof Error && j.name !== "AbortError") n1(q, `Tool '${Y}' failed after ${Math.floor(J/1000)}s: ${j.message}`);
        if (j instanceof Error) {
            if (("code" in j ? j.code : void 0) === 401 || j instanceof zX) throw n1(q, "Tool call returned 401 Unauthorized - token may have expired"), d("tengu_mcp_tool_call_auth_error", {}), new WE1(q, `MCP server "${q}" requires re-authorization (token expired)`);
            let D = jGq(j),
                X = "code" in j && j.code === -32000 && j.message.includes("Connection closed") && (K.type === "http" || K.type === "claudeai-proxy");
            if (D || X) throw n1(q, `MCP session expired during tool call (${D?"404/-32001":"connection closed"}), clearing connection cache for re-initialization`), d("tengu_mcp_session_expired", {}), await VN(q, K), new qn8(q)
        }
        if (!(j instanceof Error) || j.name !== "AbortError") throw j;
        return {
            content: void 0
        }
    } finally {
        if (H !== void 0) clearInterval(H)
    }
}
// @from(Ln 436799, Col 0)
function p3z(A) {
    if (A.message.content[0]?.type !== "tool_use") return;
    return A.message.content[0].id
}
// @from(Ln 436803, Col 0)
async function WGq(A, q) {
    let K = [],
        Y = [],
        z = await Promise.allSettled(Object.entries(A).map(async ([_, w]) => {
            let O = new oi8(_, q),
                $ = new zw1({
                    name: "claude-code",
                    version: {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.76",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-03-14T00:12:49Z"
                    }.VERSION ?? "unknown"
                }, {
                    capabilities: {}
                });
            try {
                await $.connect(O);
                let H = $.getServerCapabilities(),
                    j = {
                        type: "connected",
                        name: _,
                        capabilities: H || {},
                        client: $,
                        config: {
                            ...w,
                            scope: "dynamic"
                        },
                        cleanup: async () => {
                            await $.close()
                        }
                    },
                    J = [];
                if (H?.tools) {
                    let M = await JE(j);
                    J.push(...M)
                }
                return {
                    client: j,
                    tools: J
                }
            } catch (H) {
                return EY(_, `Failed to connect SDK MCP server: ${H}`), {
                    client: {
                        type: "failed",
                        name: _,
                        config: {
                            ...w,
                            scope: "user"
                        }
                    },
                    tools: []
                }
            }
        }));
    for (let _ of z)
        if (_.status === "fulfilled") K.push(_.value.client), Y.push(..._.value.tools);
    return {
        clients: K,
        tools: Y
    }
}
// @from(Ln 436867, Col 4)
xr6 = null
// @from(Ln 436868, Col 4)
ur6 = null
// @from(Ln 436869, Col 4)
mr6 = null
// @from(Ln 436870, Col 4)
Br6 = null
// @from(Ln 436871, Col 4)
WE1
// @from(Ln 436871, Col 9)
qn8
// @from(Ln 436871, Col 14)
ZE1
// @from(Ln 436871, Col 19)
G3z = 1e8
// @from(Ln 436872, Col 4)
T3z = () => (YGq(), k4(KGq))
// @from(Ln 436873, Col 4)
L3z = 900000
// @from(Ln 436874, Col 4)
gr6 = null
// @from(Ln 436875, Col 4)
_Gq
// @from(Ln 436875, Col 9)
S3z
// @from(Ln 436875, Col 14)
MGq = 60000
// @from(Ln 436876, Col 4)
C3z = "application/json, text/event-stream"
// @from(Ln 436877, Col 4)
b3z
// @from(Ln 436877, Col 9)
zh
// @from(Ln 436877, Col 13)
zn8 = 20
// @from(Ln 436878, Col 4)
JE
// @from(Ln 436878, Col 8)
Rl
// @from(Ln 436878, Col 12)
K_6