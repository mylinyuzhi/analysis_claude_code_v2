
// @from(Ln 244528, Col 0)
function hh(A) {
    let q = A.filter((_) => _.source === "built-in"),
        K = A.filter((_) => _.source === "plugin"),
        Y = A.filter((_) => _.source === "userSettings"),
        z = A.filter((_) => _.source === "projectSettings"),
        w = A.filter((_) => _.source === "policySettings"),
        H = A.filter((_) => _.source === "flagSettings"),
        $ = [q, K, Y, z, H, w],
        O = new Map;
    for (let _ of $)
        for (let J of _) O.set(J.agentType, J);
    return Array.from(O.values())
}
// @from(Ln 244542, Col 0)
function KPA(A, q) {
    if (!A.requiredMcpServers || A.requiredMcpServers.length === 0) return !0;
    return A.requiredMcpServers.every((K) => q.some((Y) => Y.toLowerCase().includes(K.toLowerCase())))
}
// @from(Ln 244547, Col 0)
function un7(A, q) {
    return A.filter((K) => KPA(K, q))
}
// @from(Ln 244551, Col 0)
function aL9(A) {
    let {
        name: q,
        description: K,
        model: Y
    } = A;
    if (!q || typeof q !== "string") return 'Missing required "name" field in frontmatter';
    if (!K || typeof K !== "string") return 'Missing required "description" field in frontmatter';
    if (Y && typeof Y === "string" && !U_1.includes(Y)) return `Invalid model "${Y}". Valid options: ${U_1.join(", ")}`;
    return "Unknown parsing error"
}
// @from(Ln 244563, Col 0)
function sL9(A, q) {
    if (!A.hooks) return;
    let K = Xk.safeParse(A.hooks);
    if (!K.success) {
        h(`Invalid hooks in agent '${q}': ${K.error.message}`);
        return
    }
    return K.data
}
// @from(Ln 244573, Col 0)
function tL9(A, q, K = "flagSettings") {
    try {
        let Y = bn7.parse(q),
            z = HK1(Y.tools);
        if (y2() && Y.memory && z !== void 0) {
            let O = new Set(z);
            for (let _ of [f5, bq, Jq])
                if (!O.has(_)) z = [...z, _]
        }
        let w = Y.disallowedTools !== void 0 ? HK1(Y.disallowedTools) : void 0,
            H = Y.prompt;
        return {
            agentType: A,
            whenToUse: Y.description,
            ...z !== void 0 ? {
                tools: z
            } : {},
            ...w !== void 0 ? {
                disallowedTools: w
            } : {},
            getSystemPrompt: () => {
                if (y2() && Y.memory) return H + `

` + zK1(A, Y.memory);
                return H
            },
            source: K,
            ...Y.model ? {
                model: Y.model
            } : {},
            ...Y.effort !== void 0 ? {
                effort: Y.effort
            } : {},
            ...Y.permissionMode ? {
                permissionMode: Y.permissionMode
            } : {},
            ...Y.mcpServers && Y.mcpServers.length > 0 ? {
                mcpServers: Y.mcpServers
            } : {},
            ...Y.hooks ? {
                hooks: Y.hooks
            } : {},
            ...Y.maxTurns !== void 0 ? {
                maxTurns: Y.maxTurns
            } : {},
            ...Y.skills && Y.skills.length > 0 ? {
                skills: Y.skills
            } : {},
            ...Y.memory ? {
                memory: Y.memory
            } : {}
        }
    } catch (Y) {
        let z = Y instanceof Error ? Y.message : String(Y);
        return h(`Error parsing agent '${A}' from JSON: ${z}`), K1(Y instanceof Error ? Y : Error(String(Y))), null
    }
}
// @from(Ln 244631, Col 0)
function fJ6(A, q = "flagSettings") {
    try {
        let K = oL9.parse(A);
        return Object.entries(K).map(([Y, z]) => tL9(Y, z, q)).filter((Y) => Y !== null)
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        return h(`Error parsing agents from JSON: ${Y}`), K1(K instanceof Error ? K : Error(String(K))), []
    }
}
// @from(Ln 244641, Col 0)
function eL9(A, q, K, Y, z) {
    try {
        let {
            name: w,
            description: H
        } = K;
        if (!w || typeof w !== "string" || !H || typeof H !== "string") {
            let l = `Agent file ${A} is missing required '${!w||typeof w!=="string"?"name":"description"}' in frontmatter`;
            return h(l), null
        }
        H = H.replace(/\\n/g, `
`);
        let {
            color: $,
            model: O,
            forkContext: _
        } = K;
        if (_ !== void 0 && _ !== "true" && _ !== "false") {
            let p = `Agent file ${A} has invalid forkContext value '${_}'. Must be 'true', 'false', or omitted.`;
            h(p)
        }
        let J = _ === "true",
            X = ["user", "project", "local"],
            D = K.memory,
            j;
        if (D !== void 0)
            if (X.includes(D)) j = D;
            else h(`Agent file ${A} has invalid memory value '${D}'. Valid options: ${X.join(", ")}`);
        if (J && O !== "inherit") {
            let p = `Agent file ${A} has forkContext: true but model is not 'inherit'. Overriding to 'inherit'. Agents with forkContext must use model: inherit to avoid context length mismatch.`;
            h(p), O = "inherit"
        }
        let M = O && typeof O === "string" && U_1.includes(O);
        if (O && typeof O === "string" && !M) {
            let p = `Agent file ${A} has invalid model '${O}'. Valid options: ${U_1.join(", ")}`;
            h(p)
        }
        let P = K.effort,
            W = P !== void 0 ? uK1(P) : void 0;
        if (P !== void 0 && W === void 0) h(`Agent file ${A} has invalid effort '${P}'. Valid options: ${WJ6.join(", ")} or an integer`);
        let G = K.permissionMode,
            f = G && ox.includes(G);
        if (G && !f) {
            let p = `Agent file ${A} has invalid permissionMode '${G}'. Valid options: ${ox.join(", ")}`;
            h(p)
        }
        let Z = K.maxTurns,
            N = Lr8(Z);
        if (Z !== void 0 && N === void 0) h(`Agent file ${A} has invalid maxTurns '${Z}'. Must be a positive integer.`);
        let T = rL9(A, ".md"),
            k = HK1(K.tools);
        if (y2() && j && k !== void 0) {
            let p = new Set(k);
            for (let l of [f5, bq, Jq])
                if (!p.has(l)) k = [...k, l]
        }
        let y = K.disallowedTools,
            B = y !== void 0 ? HK1(y) : void 0,
            S = Vh(K.skills),
            m = K.mcpServers,
            b;
        if (Array.isArray(m)) b = m.map((p) => {
            let l = xn7.safeParse(p);
            if (l.success) return l.data;
            return h(`Agent file ${A} has invalid mcpServers item: ${Q1(p)}. Error: ${l.error.message}`), null
        }).filter((p) => p !== null);
        let g = sL9(K, w),
            U = Y.trim();
        return {
            baseDir: q,
            agentType: w,
            whenToUse: H,
            ...k !== void 0 ? {
                tools: k
            } : {},
            ...B !== void 0 ? {
                disallowedTools: B
            } : {},
            ...S !== void 0 ? {
                skills: S
            } : {},
            ...b !== void 0 && b.length > 0 ? {
                mcpServers: b
            } : {},
            ...g !== void 0 ? {
                hooks: g
            } : {},
            getSystemPrompt: () => {
                if (y2() && j) {
                    let p = zK1(w, j);
                    return U + `

` + p
                }
                return U
            },
            source: z,
            filename: T,
            ...$ && typeof $ === "string" && cO.includes($) ? {
                color: $
            } : {},
            ...M ? {
                model: O
            } : {},
            ...W !== void 0 ? {
                effort: W
            } : {},
            ...f ? {
                permissionMode: G
            } : {},
            ...J ? {
                forkContext: J
            } : {},
            ...N !== void 0 ? {
                maxTurns: N
            } : {},
            ...j ? {
                memory: j
            } : {}
        }
    } catch (w) {
        let H = w instanceof Error ? w.message : String(w);
        return h(`Error parsing agent from ${A}: ${H}`), K1(w instanceof Error ? w : Error(String(w))), null
    }
}
// @from(Ln 244766, Col 4)
xn7
// @from(Ln 244766, Col 9)
bn7
// @from(Ln 244766, Col 14)
oL9
// @from(Ln 244766, Col 19)
TB1
// @from(Ln 244767, Col 4)
uv = v(() => {
    zq();
    i7();
    u6();
    Z6();
    Lg();
    y6();
    Ep();
    e7();
    lM();
    Cn7();
    hQ();
    Uu1();
    oj();
    NB1();
    YA1();
    m6();
    xW();
    gB();
    In7();
    SD();
    _H();
    xn7 = u.union([u.string(), u.record(u.string(), sx)]), bn7 = u.object({
        description: u.string().min(1, "Description cannot be empty"),
        tools: u.array(u.string()).optional(),
        disallowedTools: u.array(u.string()).optional(),
        prompt: u.string().min(1, "Prompt cannot be empty"),
        model: u.enum(U_1).optional(),
        effort: u.union([u.enum(WJ6), u.number().int()]).optional(),
        permissionMode: u.enum(ox).optional(),
        mcpServers: u.array(xn7).optional(),
        hooks: u.lazy(() => Xk).optional(),
        maxTurns: u.number().int().positive().optional(),
        skills: u.array(u.string()).optional(),
        memory: u.enum(["user", "project", "local"]).optional()
    }), oL9 = u.record(u.string(), bn7);
    TB1 = KA(async (A) => {
        try {
            let q = await Qp("agents", A),
                K = [],
                Y = q.map(({
                    filePath: O,
                    baseDir: _,
                    frontmatter: J,
                    content: X,
                    source: D
                }) => {
                    let j = eL9(O, _, J, X, D);
                    if (!j) {
                        let M = aL9(J);
                        return K.push({
                            path: O,
                            error: M
                        }), h(`Failed to parse agent from ${O}: ${M}`), c("tengu_agent_parse_error", {
                            error: M,
                            location: D
                        }), null
                    }
                    return j
                }).filter((O) => O !== null),
                z = await wK1(),
                H = [...APA(), ...z, ...Y],
                $ = hh(H);
            for (let O of $)
                if (O.color) xK1(O.agentType, O.color);
            return {
                activeAgents: $,
                allAgents: H,
                failedFiles: K.length > 0 ? K : void 0
            }
        } catch (q) {
            let K = q instanceof Error ? q.message : String(q);
            h(`Error loading agent definitions: ${K}`), K1(q instanceof Error ? q : Error(String(q)));
            let Y = APA();
            return {
                activeAgents: Y,
                allAgents: Y,
                failedFiles: [{
                    path: "unknown",
                    error: K
                }]
            }
        }
    })
})
// @from(Ln 244853, Col 0)
function Bn7(A, q, K, Y, z = !1) {
    if (!K || Object.keys(K).length === 0) return;
    let w = 0;
    for (let H of ax) {
        let $ = K[H];
        if (!$ || $.length === 0) continue;
        let O = H;
        if (z && H === "Stop") O = "SubagentStop", h(`Converting Stop hook to SubagentStop for ${Y} (subagents trigger SubagentStop)`);
        for (let _ of $) {
            let J = _.matcher ?? "",
                X = _.hooks;
            if (!X || X.length === 0) continue;
            for (let D of X) Mw6(A, q, O, J, D), w++
        }
    }
    if (w > 0) h(`Registered ${w} frontmatter hook(s) from ${Y} for session ${q}`)
}
// @from(Ln 244870, Col 4)
mn7 = v(() => {
    sw1();
    eU();
    Z6()
})
// @from(Ln 244875, Col 4)
oj1 = v(() => {
    B6();
    hA();
    m6()
})
// @from(Ln 244880, Col 4)
Ar7 = R((SVw, en7) => {
    function $PA(A) {
        if (A instanceof Map) A.clear = A.delete = A.set = function() {
            throw Error("map is read-only")
        };
        else if (A instanceof Set) A.add = A.clear = A.delete = function() {
            throw Error("set is read-only")
        };
        return Object.freeze(A), Object.getOwnPropertyNames(A).forEach(function(q) {
            var K = A[q];
            if (typeof K == "object" && !Object.isFrozen(K)) $PA(K)
        }), A
    }
    var cn7 = $PA,
        AR9 = $PA;
    cn7.default = AR9;
    class wPA {
        constructor(A) {
            if (A.data === void 0) A.data = {};
            this.data = A.data, this.isMatchIgnored = !1
        }
        ignoreMatch() {
            this.isMatchIgnored = !0
        }
    }

    function aj1(A) {
        return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
    }

    function Ks(A, ...q) {
        let K = Object.create(null);
        for (let Y in A) K[Y] = A[Y];
        return q.forEach(function(Y) {
            for (let z in Y) K[z] = Y[z]
        }), K
    }
    var qR9 = "</span>",
        Fn7 = (A) => {
            return !!A.kind
        };
    class ln7 {
        constructor(A, q) {
            this.buffer = "", this.classPrefix = q.classPrefix, A.walk(this)
        }
        addText(A) {
            this.buffer += aj1(A)
        }
        openNode(A) {
            if (!Fn7(A)) return;
            let q = A.kind;
            if (!A.sublanguage) q = `${this.classPrefix}${q}`;
            this.span(q)
        }
        closeNode(A) {
            if (!Fn7(A)) return;
            this.buffer += qR9
        }
        value() {
            return this.buffer
        }
        span(A) {
            this.buffer += `<span class="${A}">`
        }
    }
    class OPA {
        constructor() {
            this.rootNode = {
                children: []
            }, this.stack = [this.rootNode]
        }
        get top() {
            return this.stack[this.stack.length - 1]
        }
        get root() {
            return this.rootNode
        }
        add(A) {
            this.top.children.push(A)
        }
        openNode(A) {
            let q = {
                kind: A,
                children: []
            };
            this.add(q), this.stack.push(q)
        }
        closeNode() {
            if (this.stack.length > 1) return this.stack.pop();
            return
        }
        closeAllNodes() {
            while (this.closeNode());
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4)
        }
        walk(A) {
            return this.constructor._walk(A, this.rootNode)
        }
        static _walk(A, q) {
            if (typeof q === "string") A.addText(q);
            else if (q.children) A.openNode(q), q.children.forEach((K) => this._walk(A, K)), A.closeNode(q);
            return A
        }
        static _collapse(A) {
            if (typeof A === "string") return;
            if (!A.children) return;
            if (A.children.every((q) => typeof q === "string")) A.children = [A.children.join("")];
            else A.children.forEach((q) => {
                OPA._collapse(q)
            })
        }
    }
    class in7 extends OPA {
        constructor(A) {
            super();
            this.options = A
        }
        addKeyword(A, q) {
            if (A === "") return;
            this.openNode(q), this.addText(A), this.closeNode()
        }
        addText(A) {
            if (A === "") return;
            this.add(A)
        }
        addSublanguage(A, q) {
            let K = A.root;
            K.kind = q, K.sublanguage = !0, this.add(K)
        }
        toHTML() {
            return new ln7(this, this.options).value()
        }
        finalize() {
            return !0
        }
    }

    function KR9(A) {
        return new RegExp(A.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")
    }

    function vB1(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function YR9(...A) {
        return A.map((K) => vB1(K)).join("")
    }

    function zR9(...A) {
        return "(" + A.map((K) => vB1(K)).join("|") + ")"
    }

    function wR9(A) {
        return new RegExp(A.toString() + "|").exec("").length - 1
    }

    function HR9(A, q) {
        let K = A && A.exec(q);
        return K && K.index === 0
    }
    var $R9 = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    function OR9(A, q = "|") {
        let K = 0;
        return A.map((Y) => {
            K += 1;
            let z = K,
                w = vB1(Y),
                H = "";
            while (w.length > 0) {
                let $ = $R9.exec(w);
                if (!$) {
                    H += w;
                    break
                }
                if (H += w.substring(0, $.index), w = w.substring($.index + $[0].length), $[0][0] === "\\" && $[1]) H += "\\" + String(Number($[1]) + z);
                else if (H += $[0], $[0] === "(") K++
            }
            return H
        }).map((Y) => `(${Y})`).join(q)
    }
    var _R9 = /\b\B/,
        nn7 = "[a-zA-Z]\\w*",
        _PA = "[a-zA-Z_]\\w*",
        JPA = "\\b\\d+(\\.\\d+)?",
        rn7 = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        on7 = "\\b(0b[01]+)",
        JR9 = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
        XR9 = (A = {}) => {
            let q = /^#![ ]*\//;
            if (A.binary) A.begin = YR9(q, /.*\b/, A.binary, /\b.*/);
            return Ks({
                className: "meta",
                begin: q,
                end: /$/,
                relevance: 0,
                "on:begin": (K, Y) => {
                    if (K.index !== 0) Y.ignoreMatch()
                }
            }, A)
        },
        EB1 = {
            begin: "\\\\[\\s\\S]",
            relevance: 0
        },
        DR9 = {
            className: "string",
            begin: "'",
            end: "'",
            illegal: "\\n",
            contains: [EB1]
        },
        jR9 = {
            className: "string",
            begin: '"',
            end: '"',
            illegal: "\\n",
            contains: [EB1]
        },
        an7 = {
            begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
        },
        NJ6 = function(A, q, K = {}) {
            let Y = Ks({
                className: "comment",
                begin: A,
                end: q,
                contains: []
            }, K);
            return Y.contains.push(an7), Y.contains.push({
                className: "doctag",
                begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
                relevance: 0
            }), Y
        },
        MR9 = NJ6("//", "$"),
        PR9 = NJ6("/\\*", "\\*/"),
        WR9 = NJ6("#", "$"),
        GR9 = {
            className: "number",
            begin: JPA,
            relevance: 0
        },
        ZR9 = {
            className: "number",
            begin: rn7,
            relevance: 0
        },
        fR9 = {
            className: "number",
            begin: on7,
            relevance: 0
        },
        VR9 = {
            className: "number",
            begin: JPA + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
            relevance: 0
        },
        NR9 = {
            begin: /(?=\/[^/\n]*\/)/,
            contains: [{
                className: "regexp",
                begin: /\//,
                end: /\/[gimuy]*/,
                illegal: /\n/,
                contains: [EB1, {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [EB1]
                }]
            }]
        },
        TR9 = {
            className: "title",
            begin: nn7,
            relevance: 0
        },
        vR9 = {
            className: "title",
            begin: _PA,
            relevance: 0
        },
        ER9 = {
            begin: "\\.\\s*" + _PA,
            relevance: 0
        },
        kR9 = function(A) {
            return Object.assign(A, {
                "on:begin": (q, K) => {
                    K.data._beginMatch = q[1]
                },
                "on:end": (q, K) => {
                    if (K.data._beginMatch !== q[1]) K.ignoreMatch()
                }
            })
        },
        VJ6 = Object.freeze({
            __proto__: null,
            MATCH_NOTHING_RE: _R9,
            IDENT_RE: nn7,
            UNDERSCORE_IDENT_RE: _PA,
            NUMBER_RE: JPA,
            C_NUMBER_RE: rn7,
            BINARY_NUMBER_RE: on7,
            RE_STARTERS_RE: JR9,
            SHEBANG: XR9,
            BACKSLASH_ESCAPE: EB1,
            APOS_STRING_MODE: DR9,
            QUOTE_STRING_MODE: jR9,
            PHRASAL_WORDS_MODE: an7,
            COMMENT: NJ6,
            C_LINE_COMMENT_MODE: MR9,
            C_BLOCK_COMMENT_MODE: PR9,
            HASH_COMMENT_MODE: WR9,
            NUMBER_MODE: GR9,
            C_NUMBER_MODE: ZR9,
            BINARY_NUMBER_MODE: fR9,
            CSS_NUMBER_MODE: VR9,
            REGEXP_MODE: NR9,
            TITLE_MODE: TR9,
            UNDERSCORE_TITLE_MODE: vR9,
            METHOD_GUARD: ER9,
            END_SAME_AS_BEGIN: kR9
        });

    function LR9(A, q) {
        if (A.input[A.index - 1] === ".") q.ignoreMatch()
    }

    function RR9(A, q) {
        if (!q) return;
        if (!A.beginKeywords) return;
        if (A.begin = "\\b(" + A.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", A.__beforeBegin = LR9, A.keywords = A.keywords || A.beginKeywords, delete A.beginKeywords, A.relevance === void 0) A.relevance = 0
    }

    function yR9(A, q) {
        if (!Array.isArray(A.illegal)) return;
        A.illegal = zR9(...A.illegal)
    }

    function CR9(A, q) {
        if (!A.match) return;
        if (A.begin || A.end) throw Error("begin & end are not supported with match");
        A.begin = A.match, delete A.match
    }

    function SR9(A, q) {
        if (A.relevance === void 0) A.relevance = 1
    }
    var hR9 = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"],
        IR9 = "keyword";

    function sn7(A, q, K = IR9) {
        let Y = {};
        if (typeof A === "string") z(K, A.split(" "));
        else if (Array.isArray(A)) z(K, A);
        else Object.keys(A).forEach(function(w) {
            Object.assign(Y, sn7(A[w], q, w))
        });
        return Y;

        function z(w, H) {
            if (q) H = H.map(($) => $.toLowerCase());
            H.forEach(function($) {
                let O = $.split("|");
                Y[O[0]] = [w, xR9(O[0], O[1])]
            })
        }
    }

    function xR9(A, q) {
        if (q) return Number(q);
        return bR9(A) ? 0 : 1
    }

    function bR9(A) {
        return hR9.includes(A.toLowerCase())
    }

    function uR9(A, {
        plugins: q
    }) {
        function K($, O) {
            return new RegExp(vB1($), "m" + (A.case_insensitive ? "i" : "") + (O ? "g" : ""))
        }
        class Y {
            constructor() {
                this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
            }
            addRule($, O) {
                O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, $]), this.matchAt += wR9($) + 1
            }
            compile() {
                if (this.regexes.length === 0) this.exec = () => null;
                let $ = this.regexes.map((O) => O[1]);
                this.matcherRe = K(OR9($), !0), this.lastIndex = 0
            }
            exec($) {
                this.matcherRe.lastIndex = this.lastIndex;
                let O = this.matcherRe.exec($);
                if (!O) return null;
                let _ = O.findIndex((X, D) => D > 0 && X !== void 0),
                    J = this.matchIndexes[_];
                return O.splice(0, _), Object.assign(O, J)
            }
        }
        class z {
            constructor() {
                this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
            }
            getMatcher($) {
                if (this.multiRegexes[$]) return this.multiRegexes[$];
                let O = new Y;
                return this.rules.slice($).forEach(([_, J]) => O.addRule(_, J)), O.compile(), this.multiRegexes[$] = O, O
            }
            resumingScanAtSamePosition() {
                return this.regexIndex !== 0
            }
            considerAll() {
                this.regexIndex = 0
            }
            addRule($, O) {
                if (this.rules.push([$, O]), O.type === "begin") this.count++
            }
            exec($) {
                let O = this.getMatcher(this.regexIndex);
                O.lastIndex = this.lastIndex;
                let _ = O.exec($);
                if (this.resumingScanAtSamePosition())
                    if (_ && _.index === this.lastIndex);
                    else {
                        let J = this.getMatcher(0);
                        J.lastIndex = this.lastIndex + 1, _ = J.exec($)
                    } if (_) {
                    if (this.regexIndex += _.position + 1, this.regexIndex === this.count) this.considerAll()
                }
                return _
            }
        }

        function w($) {
            let O = new z;
            if ($.contains.forEach((_) => O.addRule(_.begin, {
                    rule: _,
                    type: "begin"
                })), $.terminatorEnd) O.addRule($.terminatorEnd, {
                type: "end"
            });
            if ($.illegal) O.addRule($.illegal, {
                type: "illegal"
            });
            return O
        }

        function H($, O) {
            let _ = $;
            if ($.isCompiled) return _;
            [CR9].forEach((X) => X($, O)), A.compilerExtensions.forEach((X) => X($, O)), $.__beforeBegin = null, [RR9, yR9, SR9].forEach((X) => X($, O)), $.isCompiled = !0;
            let J = null;
            if (typeof $.keywords === "object") J = $.keywords.$pattern, delete $.keywords.$pattern;
            if ($.keywords) $.keywords = sn7($.keywords, A.case_insensitive);
            if ($.lexemes && J) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
            if (J = J || $.lexemes || /\w+/, _.keywordPatternRe = K(J, !0), O) {
                if (!$.begin) $.begin = /\B|\b/;
                if (_.beginRe = K($.begin), $.endSameAsBegin) $.end = $.begin;
                if (!$.end && !$.endsWithParent) $.end = /\B|\b/;
                if ($.end) _.endRe = K($.end);
                if (_.terminatorEnd = vB1($.end) || "", $.endsWithParent && O.terminatorEnd) _.terminatorEnd += ($.end ? "|" : "") + O.terminatorEnd
            }
            if ($.illegal) _.illegalRe = K($.illegal);
            if (!$.contains) $.contains = [];
            if ($.contains = [].concat(...$.contains.map(function(X) {
                    return BR9(X === "self" ? $ : X)
                })), $.contains.forEach(function(X) {
                    H(X, _)
                }), $.starts) H($.starts, O);
            return _.matcher = w(_), _
        }
        if (!A.compilerExtensions) A.compilerExtensions = [];
        if (A.contains && A.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        return A.classNameAliases = Ks(A.classNameAliases || {}), H(A)
    }

    function tn7(A) {
        if (!A) return !1;
        return A.endsWithParent || tn7(A.starts)
    }

    function BR9(A) {
        if (A.variants && !A.cachedVariants) A.cachedVariants = A.variants.map(function(q) {
            return Ks(A, {
                variants: null
            }, q)
        });
        if (A.cachedVariants) return A.cachedVariants;
        if (tn7(A)) return Ks(A, {
            starts: A.starts ? Ks(A.starts) : null
        });
        if (Object.isFrozen(A)) return Ks(A);
        return A
    }
    var mR9 = "10.7.3";

    function FR9(A) {
        return Boolean(A || A === "")
    }

    function QR9(A) {
        let q = {
            props: ["language", "code", "autodetect"],
            data: function() {
                return {
                    detectedLanguage: "",
                    unknownLanguage: !1
                }
            },
            computed: {
                className() {
                    if (this.unknownLanguage) return "";
                    return "hljs " + this.detectedLanguage
                },
                highlighted() {
                    if (!this.autoDetect && !A.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, aj1(this.code);
                    let Y = {};
                    if (this.autoDetect) Y = A.highlightAuto(this.code), this.detectedLanguage = Y.language;
                    else Y = A.highlight(this.language, this.code, this.ignoreIllegals), this.detectedLanguage = this.language;
                    return Y.value
                },
                autoDetect() {
                    return !this.language || FR9(this.autodetect)
                },
                ignoreIllegals() {
                    return !0
                }
            },
            render(Y) {
                return Y("pre", {}, [Y("code", {
                    class: this.className,
                    domProps: {
                        innerHTML: this.highlighted
                    }
                })])
            }
        };
        return {
            Component: q,
            VuePlugin: {
                install(Y) {
                    Y.component("highlightjs", q)
                }
            }
        }
    }
    var gR9 = {
        "after:highlightElement": ({
            el: A,
            result: q,
            text: K
        }) => {
            let Y = Qn7(A);
            if (!Y.length) return;
            let z = document.createElement("div");
            z.innerHTML = q.value, q.value = UR9(Y, Qn7(z), K)
        }
    };

    function HPA(A) {
        return A.nodeName.toLowerCase()
    }

    function Qn7(A) {
        let q = [];
        return function K(Y, z) {
            for (let w = Y.firstChild; w; w = w.nextSibling)
                if (w.nodeType === 3) z += w.nodeValue.length;
                else if (w.nodeType === 1) {
                if (q.push({
                        event: "start",
                        offset: z,
                        node: w
                    }), z = K(w, z), !HPA(w).match(/br|hr|img|input/)) q.push({
                    event: "stop",
                    offset: z,
                    node: w
                })
            }
            return z
        }(A, 0), q
    }

    function UR9(A, q, K) {
        let Y = 0,
            z = "",
            w = [];

        function H() {
            if (!A.length || !q.length) return A.length ? A : q;
            if (A[0].offset !== q[0].offset) return A[0].offset < q[0].offset ? A : q;
            return q[0].event === "start" ? A : q
        }

        function $(J) {
            function X(D) {
                return " " + D.nodeName + '="' + aj1(D.value) + '"'
            }
            z += "<" + HPA(J) + [].map.call(J.attributes, X).join("") + ">"
        }

        function O(J) {
            z += "</" + HPA(J) + ">"
        }

        function _(J) {
            (J.event === "start" ? $ : O)(J.node)
        }
        while (A.length || q.length) {
            let J = H();
            if (z += aj1(K.substring(Y, J[0].offset)), Y = J[0].offset, J === A) {
                w.reverse().forEach(O);
                do _(J.splice(0, 1)[0]), J = H(); while (J === A && J.length && J[0].offset === Y);
                w.reverse().forEach($)
            } else {
                if (J[0].event === "start") w.push(J[0].node);
                else w.pop();
                _(J.splice(0, 1)[0])
            }
        }
        return z + aj1(K.substr(Y))
    }
    var gn7 = {},
        YPA = (A) => {
            console.error(A)
        },
        Un7 = (A, ...q) => {
            console.log(`WARN: ${A}`, ...q)
        },
        vR = (A, q) => {
            if (gn7[`${A}/${q}`]) return;
            console.log(`Deprecated as of ${A}. ${q}`), gn7[`${A}/${q}`] = !0
        },
        zPA = aj1,
        pn7 = Ks,
        dn7 = Symbol("nomatch"),
        pR9 = function(A) {
            let q = Object.create(null),
                K = Object.create(null),
                Y = [],
                z = !0,
                w = /(^(<[^>]+>|\t|)+|\n)/gm,
                H = "Could not find the language '{}', did you forget to load/include a language module?",
                $ = {
                    disableAutodetect: !0,
                    name: "Plain text",
                    contains: []
                },
                O = {
                    noHighlightRe: /^(no-?highlight)$/i,
                    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
                    classPrefix: "hljs-",
                    tabReplace: null,
                    useBR: !1,
                    languages: null,
                    __emitter: in7
                };

            function _(q1) {
                return O.noHighlightRe.test(q1)
            }

            function J(q1) {
                let t = q1.className + " ";
                t += q1.parentNode ? q1.parentNode.className : "";
                let J1 = O.languageDetectRe.exec(t);
                if (J1) {
                    let D1 = p(J1[1]);
                    if (!D1) Un7(H.replace("{}", J1[1])), Un7("Falling back to no-highlight mode for this block.", q1);
                    return D1 ? J1[1] : "no-highlight"
                }
                return t.split(/\s+/).find((D1) => _(D1) || p(D1))
            }

            function X(q1, t, J1, D1) {
                let Z1 = "",
                    E1 = "";
                if (typeof t === "object") Z1 = q1, J1 = t.ignoreIllegals, E1 = t.language, D1 = void 0;
                else vR("10.7.0", "highlight(lang, code, ...args) has been deprecated."), vR("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), E1 = q1, Z1 = t;
                let a = {
                    code: Z1,
                    language: E1
                };
                T1("before:highlight", a);
                let A1 = a.result ? a.result : D(a.language, a.code, J1, D1);
                return A1.code = a.code, T1("after:highlight", A1), A1
            }

            function D(q1, t, J1, D1) {
                function Z1(K6, j6) {
                    let M6 = f1.case_insensitive ? j6[0].toLowerCase() : j6[0];
                    return Object.prototype.hasOwnProperty.call(K6.keywords, M6) && K6.keywords[M6]
                }

                function E1() {
                    if (!y1.keywords) {
                        A6.addText(O6);
                        return
                    }
                    let K6 = 0;
                    y1.keywordPatternRe.lastIndex = 0;
                    let j6 = y1.keywordPatternRe.exec(O6),
                        M6 = "";
                    while (j6) {
                        M6 += O6.substring(K6, j6.index);
                        let N6 = Z1(y1, j6);
                        if (N6) {
                            let [F6, P1] = N6;
                            if (A6.addText(M6), M6 = "", P6 += P1, F6.startsWith("_")) M6 += j6[0];
                            else {
                                let k1 = f1.classNameAliases[F6] || F6;
                                A6.addKeyword(j6[0], k1)
                            }
                        } else M6 += j6[0];
                        K6 = y1.keywordPatternRe.lastIndex, j6 = y1.keywordPatternRe.exec(O6)
                    }
                    M6 += O6.substr(K6), A6.addText(M6)
                }

                function a() {
                    if (O6 === "") return;
                    let K6 = null;
                    if (typeof y1.subLanguage === "string") {
                        if (!q[y1.subLanguage]) {
                            A6.addText(O6);
                            return
                        }
                        K6 = D(y1.subLanguage, O6, !0, B1[y1.subLanguage]), B1[y1.subLanguage] = K6.top
                    } else K6 = M(O6, y1.subLanguage.length ? y1.subLanguage : null);
                    if (y1.relevance > 0) P6 += K6.relevance;
                    A6.addSublanguage(K6.emitter, K6.language)
                }

                function A1() {
                    if (y1.subLanguage != null) a();
                    else E1();
                    O6 = ""
                }

                function M1(K6) {
                    if (K6.className) A6.openNode(f1.classNameAliases[K6.className] || K6.className);
                    return y1 = Object.create(K6, {
                        parent: {
                            value: y1
                        }
                    }), y1
                }

                function z1(K6, j6, M6) {
                    let N6 = HR9(K6.endRe, M6);
                    if (N6) {
                        if (K6["on:end"]) {
                            let F6 = new wPA(K6);
                            if (K6["on:end"](j6, F6), F6.isMatchIgnored) N6 = !1
                        }
                        if (N6) {
                            while (K6.endsParent && K6.parent) K6 = K6.parent;
                            return K6
                        }
                    }
                    if (K6.endsWithParent) return z1(K6.parent, j6, M6)
                }

                function Y1(K6) {
                    if (y1.matcher.regexIndex === 0) return O6 += K6[0], 1;
                    else return p1 = !0, 0
                }

                function _1(K6) {
                    let j6 = K6[0],
                        M6 = K6.rule,
                        N6 = new wPA(M6),
                        F6 = [M6.__beforeBegin, M6["on:begin"]];
                    for (let P1 of F6) {
                        if (!P1) continue;
                        if (P1(K6, N6), N6.isMatchIgnored) return Y1(j6)
                    }
                    if (M6 && M6.endSameAsBegin) M6.endRe = KR9(j6);
                    if (M6.skip) O6 += j6;
                    else {
                        if (M6.excludeBegin) O6 += j6;
                        if (A1(), !M6.returnBegin && !M6.excludeBegin) O6 = j6
                    }
                    return M1(M6), M6.returnBegin ? 0 : j6.length
                }

                function $1(K6) {
                    let j6 = K6[0],
                        M6 = t.substr(K6.index),
                        N6 = z1(y1, K6, M6);
                    if (!N6) return dn7;
                    let F6 = y1;
                    if (F6.skip) O6 += j6;
                    else {
                        if (!(F6.returnEnd || F6.excludeEnd)) O6 += j6;
                        if (A1(), F6.excludeEnd) O6 = j6
                    }
                    do {
                        if (y1.className) A6.closeNode();
                        if (!y1.skip && !y1.subLanguage) P6 += y1.relevance;
                        y1 = y1.parent
                    } while (y1 !== N6.parent);
                    if (N6.starts) {
                        if (N6.endSameAsBegin) N6.starts.endRe = N6.endRe;
                        M1(N6.starts)
                    }
                    return F6.returnEnd ? 0 : j6.length
                }

                function G1() {
                    let K6 = [];
                    for (let j6 = y1; j6 !== f1; j6 = j6.parent)
                        if (j6.className) K6.unshift(j6.className);
                    K6.forEach((j6) => A6.openNode(j6))
                }
                let L1 = {};

                function x1(K6, j6) {
                    let M6 = j6 && j6[0];
                    if (O6 += K6, M6 == null) return A1(), 0;
                    if (L1.type === "begin" && j6.type === "end" && L1.index === j6.index && M6 === "") {
                        if (O6 += t.slice(j6.index, j6.index + 1), !z) {
                            let N6 = Error("0 width match regex");
                            throw N6.languageName = q1, N6.badRule = L1.rule, N6
                        }
                        return 1
                    }
                    if (L1 = j6, j6.type === "begin") return _1(j6);
                    else if (j6.type === "illegal" && !J1) {
                        let N6 = Error('Illegal lexeme "' + M6 + '" for mode "' + (y1.className || "<unnamed>") + '"');
                        throw N6.mode = y1, N6
                    } else if (j6.type === "end") {
                        let N6 = $1(j6);
                        if (N6 !== dn7) return N6
                    }
                    if (j6.type === "illegal" && M6 === "") return 1;
                    if (q6 > 1e5 && q6 > j6.index * 3) throw Error("potential infinite loop, way more iterations than matches");
                    return O6 += M6, M6.length
                }
                let f1 = p(q1);
                if (!f1) throw YPA(H.replace("{}", q1)), Error('Unknown language: "' + q1 + '"');
                let R1 = uR9(f1, {
                        plugins: Y
                    }),
                    H1 = "",
                    y1 = D1 || R1,
                    B1 = {},
                    A6 = new O.__emitter(O);
                G1();
                let O6 = "",
                    P6 = 0,
                    V6 = 0,
                    q6 = 0,
                    p1 = !1;
                try {
                    y1.matcher.considerAll();
                    for (;;) {
                        if (q6++, p1) p1 = !1;
                        else y1.matcher.considerAll();
                        y1.matcher.lastIndex = V6;
                        let K6 = y1.matcher.exec(t);
                        if (!K6) break;
                        let j6 = t.substring(V6, K6.index),
                            M6 = x1(j6, K6);
                        V6 = K6.index + M6
                    }
                    return x1(t.substr(V6)), A6.closeAllNodes(), A6.finalize(), H1 = A6.toHTML(), {
                        relevance: Math.floor(P6),
                        value: H1,
                        language: q1,
                        illegal: !1,
                        emitter: A6,
                        top: y1
                    }
                } catch (K6) {
                    if (K6.message && K6.message.includes("Illegal")) return {
                        illegal: !0,
                        illegalBy: {
                            msg: K6.message,
                            context: t.slice(V6 - 100, V6 + 100),
                            mode: K6.mode
                        },
                        sofar: H1,
                        relevance: 0,
                        value: zPA(t),
                        emitter: A6
                    };
                    else if (z) return {
                        illegal: !1,
                        relevance: 0,
                        value: zPA(t),
                        emitter: A6,
                        language: q1,
                        top: y1,
                        errorRaised: K6
                    };
                    else throw K6
                }
            }

            function j(q1) {
                let t = {
                    relevance: 0,
                    emitter: new O.__emitter(O),
                    value: zPA(q1),
                    illegal: !1,
                    top: $
                };
                return t.emitter.addText(q1), t
            }

            function M(q1, t) {
                t = t || O.languages || Object.keys(q);
                let J1 = j(q1),
                    D1 = t.filter(p).filter(r).map((M1) => D(M1, q1, !1));
                D1.unshift(J1);
                let Z1 = D1.sort((M1, z1) => {
                        if (M1.relevance !== z1.relevance) return z1.relevance - M1.relevance;
                        if (M1.language && z1.language) {
                            if (p(M1.language).supersetOf === z1.language) return 1;
                            else if (p(z1.language).supersetOf === M1.language) return -1
                        }
                        return 0
                    }),
                    [E1, a] = Z1,
                    A1 = E1;
                return A1.second_best = a, A1
            }

            function P(q1) {
                if (!(O.tabReplace || O.useBR)) return q1;
                return q1.replace(w, (t) => {
                    if (t === `
`) return O.useBR ? "<br>" : t;
                    else if (O.tabReplace) return t.replace(/\t/g, O.tabReplace);
                    return t
                })
            }

            function W(q1, t, J1) {
                let D1 = t ? K[t] : J1;
                if (q1.classList.add("hljs"), D1) q1.classList.add(D1)
            }
            let G = {
                    "before:highlightElement": ({
                        el: q1
                    }) => {
                        if (O.useBR) q1.innerHTML = q1.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`)
                    },
                    "after:highlightElement": ({
                        result: q1
                    }) => {
                        if (O.useBR) q1.value = q1.value.replace(/\n/g, "<br>")
                    }
                },
                f = /^(<[^>]+>|\t)+/gm,
                Z = {
                    "after:highlightElement": ({
                        result: q1
                    }) => {
                        if (O.tabReplace) q1.value = q1.value.replace(f, (t) => t.replace(/\t/g, O.tabReplace))
                    }
                };

            function N(q1) {
                let t = null,
                    J1 = J(q1);
                if (_(J1)) return;
                T1("before:highlightElement", {
                    el: q1,
                    language: J1
                }), t = q1;
                let D1 = t.textContent,
                    Z1 = J1 ? X(D1, {
                        language: J1,
                        ignoreIllegals: !0
                    }) : M(D1);
                if (T1("after:highlightElement", {
                        el: q1,
                        result: Z1,
                        text: D1
                    }), q1.innerHTML = Z1.value, W(q1, J1, Z1.language), q1.result = {
                        language: Z1.language,
                        re: Z1.relevance,
                        relavance: Z1.relevance
                    }, Z1.second_best) q1.second_best = {
                    language: Z1.second_best.language,
                    re: Z1.second_best.relevance,
                    relavance: Z1.second_best.relevance
                }
            }

            function T(q1) {
                if (q1.useBR) vR("10.3.0", "'useBR' will be removed entirely in v11.0"), vR("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
                O = pn7(O, q1)
            }
            let k = () => {
                if (k.called) return;
                k.called = !0, vR("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead."), document.querySelectorAll("pre code").forEach(N)
            };

            function y() {
                vR("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."), B = !0
            }
            let B = !1;

            function S() {
                if (document.readyState === "loading") {
                    B = !0;
                    return
                }
                document.querySelectorAll("pre code").forEach(N)
            }

            function m() {
                if (B) S()
            }
            if (typeof window < "u" && window.addEventListener) window.addEventListener("DOMContentLoaded", m, !1);

            function b(q1, t) {
                let J1 = null;
                try {
                    J1 = t(A)
                } catch (D1) {
                    if (YPA("Language definition for '{}' could not be registered.".replace("{}", q1)), !z) throw D1;
                    else YPA(D1);
                    J1 = $
                }
                if (!J1.name) J1.name = q1;
                if (q[q1] = J1, J1.rawDefinition = t.bind(null, A), J1.aliases) l(J1.aliases, {
                    languageName: q1
                })
            }

            function g(q1) {
                delete q[q1];
                for (let t of Object.keys(K))
                    if (K[t] === q1) delete K[t]
            }

            function U() {
                return Object.keys(q)
            }

            function x(q1) {
                vR("10.4.0", "requireLanguage will be removed entirely in v11."), vR("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
                let t = p(q1);
                if (t) return t;
                throw Error("The '{}' language is required, but not loaded.".replace("{}", q1))
            }

            function p(q1) {
                return q1 = (q1 || "").toLowerCase(), q[q1] || q[K[q1]]
            }

            function l(q1, {
                languageName: t
            }) {
                if (typeof q1 === "string") q1 = [q1];
                q1.forEach((J1) => {
                    K[J1.toLowerCase()] = t
                })
            }

            function r(q1) {
                let t = p(q1);
                return t && !t.disableAutodetect
            }

            function s(q1) {
                if (q1["before:highlightBlock"] && !q1["before:highlightElement"]) q1["before:highlightElement"] = (t) => {
                    q1["before:highlightBlock"](Object.assign({
                        block: t.el
                    }, t))
                };
                if (q1["after:highlightBlock"] && !q1["after:highlightElement"]) q1["after:highlightElement"] = (t) => {
                    q1["after:highlightBlock"](Object.assign({
                        block: t.el
                    }, t))
                }
            }

            function O1(q1) {
                s(q1), Y.push(q1)
            }

            function T1(q1, t) {
                let J1 = q1;
                Y.forEach(function(D1) {
                    if (D1[J1]) D1[J1](t)
                })
            }

            function N1(q1) {
                return vR("10.2.0", "fixMarkup will be removed entirely in v11.0"), vR("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534"), P(q1)
            }

            function j1(q1) {
                return vR("10.7.0", "highlightBlock will be removed entirely in v12.0"), vR("10.7.0", "Please use highlightElement now."), N(q1)
            }
            Object.assign(A, {
                highlight: X,
                highlightAuto: M,
                highlightAll: S,
                fixMarkup: N1,
                highlightElement: N,
                highlightBlock: j1,
                configure: T,
                initHighlighting: k,
                initHighlightingOnLoad: y,
                registerLanguage: b,
                unregisterLanguage: g,
                listLanguages: U,
                getLanguage: p,
                registerAliases: l,
                requireLanguage: x,
                autoDetection: r,
                inherit: pn7,
                addPlugin: O1,
                vuePlugin: QR9(A).VuePlugin
            }), A.debugMode = function() {
                z = !1
            }, A.safeMode = function() {
                z = !0
            }, A.versionString = mR9;
            for (let q1 in VJ6)
                if (typeof VJ6[q1] === "object") cn7(VJ6[q1]);
            return Object.assign(A, VJ6), A.addPlugin(G), A.addPlugin(gR9), A.addPlugin(Z), A
        },
        dR9 = pR9({});
    en7.exports = dR9
})
// @from(Ln 246027, Col 4)
Kr7 = R((hVw, qr7) => {
    function cR9(A) {
        var q = "[A-Za-zА-Яа-яёЁ_][A-Za-zА-Яа-яёЁ_0-9]+",
            K = "далее ",
            Y = "возврат вызватьисключение выполнить для если и из или иначе иначеесли исключение каждого конецесли " + "конецпопытки конеццикла не новый перейти перем по пока попытка прервать продолжить тогда цикл экспорт ",
            z = K + Y,
            w = "загрузитьизфайла ",
            H = "вебклиент вместо внешнеесоединение клиент конецобласти мобильноеприложениеклиент мобильноеприложениесервер " + "наклиенте наклиентенасервере наклиентенасерверебезконтекста насервере насерверебезконтекста область перед " + "после сервер толстыйклиентобычноеприложение толстыйклиентуправляемоеприложение тонкийклиент ",
            $ = w + H,
            O = "разделительстраниц разделительстрок символтабуляции ",
            _ = "ansitooem oemtoansi ввестивидсубконто ввестиперечисление ввестипериод ввестиплансчетов выбранныйплансчетов " + "датагод датамесяц датачисло заголовоксистемы значениевстроку значениеизстроки каталогиб каталогпользователя " + "кодсимв конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца " + "коннедели лог лог10 максимальноеколичествосубконто названиеинтерфейса названиенабораправ назначитьвид " + "назначитьсчет найтиссылки началопериодаби началостандартногоинтервала начгода начквартала начмесяца " + "начнедели номерднягода номерднянедели номернеделигода обработкаожидания основнойжурналрасчетов " + "основнойплансчетов основнойязык очиститьокносообщений периодстр получитьвремята получитьдатута " + "получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта " + "префиксавтонумерации пропись пустоезначение разм разобратьпозициюдокумента рассчитатьрегистрына " + "рассчитатьрегистрыпо симв создатьобъект статусвозврата стрколичествострок сформироватьпозициюдокумента " + "счетпокоду текущеевремя типзначения типзначениястр установитьтана установитьтапо фиксшаблон шаблон ",
            J = "acos asin atan base64значение base64строка cos exp log log10 pow sin sqrt tan xmlзначение xmlстрока " + "xmlтип xmlтипзнч активноеокно безопасныйрежим безопасныйрежимразделенияданных булево ввестидату ввестизначение " + "ввестистроку ввестичисло возможностьчтенияxml вопрос восстановитьзначение врег выгрузитьжурналрегистрации " + "выполнитьобработкуоповещения выполнитьпроверкуправдоступа вычислить год данныеформывзначение дата день деньгода " + "деньнедели добавитьмесяц заблокироватьданныедляредактирования заблокироватьработупользователя завершитьработусистемы " + "загрузитьвнешнююкомпоненту закрытьсправку записатьjson записатьxml записатьдатуjson записьжурналарегистрации " + "заполнитьзначениясвойств запроситьразрешениепользователя запуститьприложение запуститьсистему зафиксироватьтранзакцию " + "значениевданныеформы значениевстрокувнутр значениевфайл значениезаполнено значениеизстрокивнутр значениеизфайла " + "изxmlтипа импортмоделиxdto имякомпьютера имяпользователя инициализироватьпредопределенныеданные информацияобошибке " + "каталогбиблиотекимобильногоустройства каталогвременныхфайлов каталогдокументов каталогпрограммы кодироватьстроку " + "кодлокализацииинформационнойбазы кодсимвола командасистемы конецгода конецдня конецквартала конецмесяца конецминуты " + "конецнедели конецчаса конфигурациябазыданныхизмененадинамически конфигурацияизменена копироватьданныеформы " + "копироватьфайл краткоепредставлениеошибки лев макс местноевремя месяц мин минута монопольныйрежим найти " + "найтинедопустимыесимволыxml найтиокнопонавигационнойссылке найтипомеченныенаудаление найтипоссылкам найтифайлы " + "началогода началодня началоквартала началомесяца началоминуты началонедели началочаса начатьзапросразрешенияпользователя " + "начатьзапускприложения начатькопированиефайла начатьперемещениефайла начатьподключениевнешнейкомпоненты " + "начатьподключениерасширенияработыскриптографией начатьподключениерасширенияработысфайлами начатьпоискфайлов " + "начатьполучениекаталогавременныхфайлов начатьполучениекаталогадокументов начатьполучениерабочегокаталогаданныхпользователя " + "начатьполучениефайлов начатьпомещениефайла начатьпомещениефайлов начатьсозданиедвоичныхданныхизфайла начатьсозданиекаталога " + "начатьтранзакцию начатьудалениефайлов начатьустановкувнешнейкомпоненты начатьустановкурасширенияработыскриптографией " + "начатьустановкурасширенияработысфайлами неделягода необходимостьзавершениясоединения номерсеансаинформационнойбазы " + "номерсоединенияинформационнойбазы нрег нстр обновитьинтерфейс обновитьнумерациюобъектов обновитьповторноиспользуемыезначения " + "обработкапрерыванияпользователя объединитьфайлы окр описаниеошибки оповестить оповеститьобизменении " + "отключитьобработчикзапросанастроекклиенталицензирования отключитьобработчикожидания отключитьобработчикоповещения " + "открытьзначение открытьиндекссправки открытьсодержаниесправки открытьсправку открытьформу открытьформумодально " + "отменитьтранзакцию очиститьжурналрегистрации очиститьнастройкипользователя очиститьсообщения параметрыдоступа " + "перейтипонавигационнойссылке переместитьфайл подключитьвнешнююкомпоненту " + "подключитьобработчикзапросанастроекклиенталицензирования подключитьобработчикожидания подключитьобработчикоповещения " + "подключитьрасширениеработыскриптографией подключитьрасширениеработысфайлами подробноепредставлениеошибки " + "показатьвводдаты показатьвводзначения показатьвводстроки показатьвводчисла показатьвопрос показатьзначение " + "показатьинформациюобошибке показатьнакарте показатьоповещениепользователя показатьпредупреждение полноеимяпользователя " + "получитьcomобъект получитьxmlтип получитьадреспоместоположению получитьблокировкусеансов получитьвремязавершенияспящегосеанса " + "получитьвремязасыпанияпассивногосеанса получитьвремяожиданияблокировкиданных получитьданныевыбора " + "получитьдополнительныйпараметрклиенталицензирования получитьдопустимыекодылокализации получитьдопустимыечасовыепояса " + "получитьзаголовокклиентскогоприложения получитьзаголовоксистемы получитьзначенияотборажурналарегистрации " + "получитьидентификаторконфигурации получитьизвременногохранилища получитьимявременногофайла " + "получитьимяклиенталицензирования получитьинформациюэкрановклиента получитьиспользованиежурналарегистрации " + "получитьиспользованиесобытияжурналарегистрации получитькраткийзаголовокприложения получитьмакетоформления " + "получитьмаскувсефайлы получитьмаскувсефайлыклиента получитьмаскувсефайлысервера получитьместоположениепоадресу " + "получитьминимальнуюдлинупаролейпользователей получитьнавигационнуюссылку получитьнавигационнуюссылкуинформационнойбазы " + "получитьобновлениеконфигурациибазыданных получитьобновлениепредопределенныхданныхинформационнойбазы получитьобщиймакет " + "получитьобщуюформу получитьокна получитьоперативнуюотметкувремени получитьотключениебезопасногорежима " + "получитьпараметрыфункциональныхопцийинтерфейса получитьполноеимяпредопределенногозначения " + "получитьпредставлениянавигационныхссылок получитьпроверкусложностипаролейпользователей получитьразделительпути " + "получитьразделительпутиклиента получитьразделительпутисервера получитьсеансыинформационнойбазы " + "получитьскоростьклиентскогосоединения получитьсоединенияинформационнойбазы получитьсообщенияпользователю " + "получитьсоответствиеобъектаиформы получитьсоставстандартногоинтерфейсаodata получитьструктурухранениябазыданных " + "получитьтекущийсеансинформационнойбазы получитьфайл получитьфайлы получитьформу получитьфункциональнуюопцию " + "получитьфункциональнуюопциюинтерфейса получитьчасовойпоясинформационнойбазы пользователиос поместитьвовременноехранилище " + "поместитьфайл поместитьфайлы прав праводоступа предопределенноезначение представлениекодалокализации представлениепериода " + "представлениеправа представлениеприложения представлениесобытияжурналарегистрации представлениечасовогопояса предупреждение " + "прекратитьработусистемы привилегированныйрежим продолжитьвызов прочитатьjson прочитатьxml прочитатьдатуjson пустаястрока " + "рабочийкаталогданныхпользователя разблокироватьданныедляредактирования разделитьфайл разорватьсоединениесвнешнимисточникомданных " + "раскодироватьстроку рольдоступна секунда сигнал символ скопироватьжурналрегистрации смещениелетнеговремени " + "смещениестандартноговремени соединитьбуферыдвоичныхданных создатькаталог создатьфабрикуxdto сокрл сокрлп сокрп сообщить " + "состояние сохранитьзначение сохранитьнастройкипользователя сред стрдлина стрзаканчиваетсяна стрзаменить стрнайти стрначинаетсяс " + "строка строкасоединенияинформационнойбазы стрполучитьстроку стрразделить стрсоединить стрсравнить стрчисловхождений " + "стрчислострок стршаблон текущаядата текущаядатасеанса текущаяуниверсальнаядата текущаяуниверсальнаядатавмиллисекундах " + "текущийвариантинтерфейсаклиентскогоприложения текущийвариантосновногошрифтаклиентскогоприложения текущийкодлокализации " + "текущийрежимзапуска текущийязык текущийязыксистемы тип типзнч транзакцияактивна трег удалитьданныеинформационнойбазы " + "удалитьизвременногохранилища удалитьобъекты удалитьфайлы универсальноевремя установитьбезопасныйрежим " + "установитьбезопасныйрежимразделенияданных установитьблокировкусеансов установитьвнешнююкомпоненту " + "установитьвремязавершенияспящегосеанса установитьвремязасыпанияпассивногосеанса установитьвремяожиданияблокировкиданных " + "установитьзаголовокклиентскогоприложения установитьзаголовоксистемы установитьиспользованиежурналарегистрации " + "установитьиспользованиесобытияжурналарегистрации установитькраткийзаголовокприложения " + "установитьминимальнуюдлинупаролейпользователей установитьмонопольныйрежим установитьнастройкиклиенталицензирования " + "установитьобновлениепредопределенныхданныхинформационнойбазы установитьотключениебезопасногорежима " + "установитьпараметрыфункциональныхопцийинтерфейса установитьпривилегированныйрежим " + "установитьпроверкусложностипаролейпользователей установитьрасширениеработыскриптографией " + "установитьрасширениеработысфайлами установитьсоединениесвнешнимисточникомданных установитьсоответствиеобъектаиформы " + "установитьсоставстандартногоинтерфейсаodata установитьчасовойпоясинформационнойбазы установитьчасовойпояссеанса " + "формат цел час часовойпояс часовойпояссеанса число числопрописью этоадресвременногохранилища ",
            X = "wsссылки библиотекакартинок библиотекамакетовоформлениякомпоновкиданных библиотекастилей бизнеспроцессы " + "внешниеисточникиданных внешниеобработки внешниеотчеты встроенныепокупки главныйинтерфейс главныйстиль " + "документы доставляемыеуведомления журналыдокументов задачи информацияобинтернетсоединении использованиерабочейдаты " + "историяработыпользователя константы критерииотбора метаданные обработки отображениерекламы отправкадоставляемыхуведомлений " + "отчеты панельзадачос параметрзапуска параметрысеанса перечисления планывидоврасчета планывидовхарактеристик " + "планыобмена планысчетов полнотекстовыйпоиск пользователиинформационнойбазы последовательности проверкавстроенныхпокупок " + "рабочаядата расширенияконфигурации регистрыбухгалтерии регистрынакопления регистрырасчета регистрысведений " + "регламентныезадания сериализаторxdto справочники средствагеопозиционирования средствакриптографии средствамультимедиа " + "средстваотображениярекламы средствапочты средствателефонии фабрикаxdto файловыепотоки фоновыезадания хранилищанастроек " + "хранилищевариантовотчетов хранилищенастроекданныхформ хранилищеобщихнастроек хранилищепользовательскихнастроекдинамическихсписков " + "хранилищепользовательскихнастроекотчетов хранилищесистемныхнастроек ",
            D = O + _ + J + X,
            j = "webцвета windowsцвета windowsшрифты библиотекакартинок рамкистиля символы цветастиля шрифтыстиля ",
            M = "автоматическоесохранениеданныхформывнастройках автонумерациявформе автораздвижениесерий " + "анимациядиаграммы вариантвыравниванияэлементовизаголовков вариантуправлениявысотойтаблицы " + "вертикальнаяпрокруткаформы вертикальноеположение вертикальноеположениеэлемента видгруппыформы " + "виддекорацииформы виддополненияэлементаформы видизмененияданных видкнопкиформы видпереключателя " + "видподписейкдиаграмме видполяформы видфлажка влияниеразмеранапузырекдиаграммы горизонтальноеположение " + "горизонтальноеположениеэлемента группировкаколонок группировкаподчиненныхэлементовформы " + "группыиэлементы действиеперетаскивания дополнительныйрежимотображения допустимыедействияперетаскивания " + "интервалмеждуэлементамиформы использованиевывода использованиеполосыпрокрутки " + "используемоезначениеточкибиржевойдиаграммы историявыборапривводе источникзначенийоситочекдиаграммы " + "источникзначенияразмерапузырькадиаграммы категориягруппыкоманд максимумсерий начальноеотображениедерева " + "начальноеотображениесписка обновлениетекстаредактирования ориентациядендрограммы ориентациядиаграммы " + "ориентацияметокдиаграммы ориентацияметоксводнойдиаграммы ориентацияэлементаформы отображениевдиаграмме " + "отображениевлегендедиаграммы отображениегруппыкнопок отображениезаголовкашкалыдиаграммы " + "отображениезначенийсводнойдиаграммы отображениезначенияизмерительнойдиаграммы " + "отображениеинтерваладиаграммыганта отображениекнопки отображениекнопкивыбора отображениеобсужденийформы " + "отображениеобычнойгруппы отображениеотрицательныхзначенийпузырьковойдиаграммы отображениепанелипоиска " + "отображениеподсказки отображениепредупрежденияприредактировании отображениеразметкиполосырегулирования " + "отображениестраницформы отображениетаблицы отображениетекстазначениядиаграммыганта " + "отображениеуправленияобычнойгруппы отображениефигурыкнопки палитрацветовдиаграммы поведениеобычнойгруппы " + "поддержкамасштабадендрограммы поддержкамасштабадиаграммыганта поддержкамасштабасводнойдиаграммы " + "поисквтаблицепривводе положениезаголовкаэлементаформы положениекартинкикнопкиформы " + "положениекартинкиэлементаграфическойсхемы положениекоманднойпанелиформы положениекоманднойпанелиэлементаформы " + "положениеопорнойточкиотрисовки положениеподписейкдиаграмме положениеподписейшкалызначенийизмерительнойдиаграммы " + "положениесостоянияпросмотра положениестрокипоиска положениетекстасоединительнойлинии положениеуправленияпоиском " + "положениешкалывремени порядокотображенияточекгоризонтальнойгистограммы порядоксерийвлегендедиаграммы " + "размеркартинки расположениезаголовкашкалыдиаграммы растягиваниеповертикалидиаграммыганта " + "режимавтоотображениясостояния режимвводастроктаблицы режимвыборанезаполненного режимвыделениядаты " + "режимвыделениястрокитаблицы режимвыделениятаблицы режимизмененияразмера режимизменениясвязанногозначения " + "режимиспользованиядиалогапечати режимиспользованияпараметракоманды режиммасштабированияпросмотра " + "режимосновногоокнаклиентскогоприложения режимоткрытияокнаформы режимотображениявыделения " + "режимотображениягеографическойсхемы режимотображениязначенийсерии режимотрисовкисеткиграфическойсхемы " + "режимполупрозрачностидиаграммы режимпробеловдиаграммы режимразмещениянастранице режимредактированияколонки " + "режимсглаживаниядиаграммы режимсглаживанияиндикатора режимсписказадач сквозноевыравнивание " + "сохранениеданныхформывнастройках способзаполнениятекстазаголовкашкалыдиаграммы " + "способопределенияограничивающегозначениядиаграммы стандартнаягруппакоманд стандартноеоформление " + "статусоповещенияпользователя стильстрелки типаппроксимациилиниитрендадиаграммы типдиаграммы " + "типединицышкалывремени типимпортасерийслоягеографическойсхемы типлиниигеографическойсхемы типлиниидиаграммы " + "типмаркерагеографическойсхемы типмаркерадиаграммы типобластиоформления " + "типорганизацииисточникаданныхгеографическойсхемы типотображениясериислоягеографическойсхемы " + "типотображенияточечногообъектагеографическойсхемы типотображенияшкалыэлементалегендыгеографическойсхемы " + "типпоискаобъектовгеографическойсхемы типпроекциигеографическойсхемы типразмещенияизмерений " + "типразмещенияреквизитовизмерений типрамкиэлементауправления типсводнойдиаграммы " + "типсвязидиаграммыганта типсоединениязначенийпосериямдиаграммы типсоединенияточекдиаграммы " + "типсоединительнойлинии типстороныэлементаграфическойсхемы типформыотчета типшкалырадарнойдиаграммы " + "факторлиниитрендадиаграммы фигуракнопки фигурыграфическойсхемы фиксациявтаблице форматдняшкалывремени " + "форматкартинки ширинаподчиненныхэлементовформы ",
            P = "виддвижениябухгалтерии виддвижениянакопления видпериодарегистрарасчета видсчета видточкимаршрутабизнеспроцесса " + "использованиеагрегатарегистранакопления использованиегруппиэлементов использованиережимапроведения " + "использованиесреза периодичностьагрегатарегистранакопления режимавтовремя режимзаписидокумента режимпроведениядокумента ",
            W = "авторегистрацияизменений допустимыйномерсообщения отправкаэлементаданных получениеэлементаданных ",
            G = "использованиерасшифровкитабличногодокумента ориентациястраницы положениеитоговколоноксводнойтаблицы " + "положениеитоговстроксводнойтаблицы положениетекстаотносительнокартинки расположениезаголовкагруппировкитабличногодокумента " + "способчтениязначенийтабличногодокумента типдвустороннейпечати типзаполненияобластитабличногодокумента " + "типкурсоровтабличногодокумента типлиниирисункатабличногодокумента типлинииячейкитабличногодокумента " + "типнаправленияпереходатабличногодокумента типотображениявыделениятабличногодокумента типотображениялинийсводнойтаблицы " + "типразмещениятекстатабличногодокумента типрисункатабличногодокумента типсмещениятабличногодокумента " + "типузоратабличногодокумента типфайлатабличногодокумента точностьпечати чередованиерасположениястраниц ",
            f = "отображениевремениэлементовпланировщика ",
            Z = "типфайлаформатированногодокумента ",
            N = "обходрезультатазапроса типзаписизапроса ",
            T = "видзаполнениярасшифровкипостроителяотчета типдобавленияпредставлений типизмеренияпостроителяотчета типразмещенияитогов ",
            k = "доступкфайлу режимдиалогавыборафайла режимоткрытияфайла ",
            y = "типизмеренияпостроителязапроса ",
            B = "видданныханализа методкластеризации типединицыинтервалавременианализаданных типзаполнениятаблицырезультатаанализаданных " + "типиспользованиячисловыхзначенийанализаданных типисточникаданныхпоискаассоциаций типколонкианализаданныхдереворешений " + "типколонкианализаданныхкластеризация типколонкианализаданныхобщаястатистика типколонкианализаданныхпоискассоциаций " + "типколонкианализаданныхпоискпоследовательностей типколонкимоделипрогноза типмерырасстоянияанализаданных " + "типотсеченияправилассоциации типполяанализаданных типстандартизациианализаданных типупорядочиванияправилассоциациианализаданных " + "типупорядочиванияшаблоновпоследовательностейанализаданных типупрощениядереварешений ",
            S = "wsнаправлениепараметра вариантxpathxs вариантзаписидатыjson вариантпростоготипаxs видгруппымоделиxs видфасетаxdto " + "действиепостроителяdom завершенностьпростоготипаxs завершенностьсоставноготипаxs завершенностьсхемыxs запрещенныеподстановкиxs " + "исключениягруппподстановкиxs категорияиспользованияатрибутаxs категорияограниченияидентичностиxs категорияограниченияпространствименxs " + "методнаследованияxs модельсодержимогоxs назначениетипаxml недопустимыеподстановкиxs обработкапробельныхсимволовxs обработкасодержимогоxs " + "ограничениезначенияxs параметрыотбораузловdom переносстрокjson позициявдокументеdom пробельныесимволыxml типатрибутаxml типзначенияjson " + "типканоническогоxml типкомпонентыxs типпроверкиxml типрезультатаdomxpath типузлаdom типузлаxml формаxml формапредставленияxs " + "форматдатыjson экранированиесимволовjson ",
            m = "видсравнениякомпоновкиданных действиеобработкирасшифровкикомпоновкиданных направлениесортировкикомпоновкиданных " + "расположениевложенныхэлементоврезультатакомпоновкиданных расположениеитоговкомпоновкиданных расположениегруппировкикомпоновкиданных " + "расположениеполейгруппировкикомпоновкиданных расположениеполякомпоновкиданных расположениереквизитовкомпоновкиданных " + "расположениересурсовкомпоновкиданных типбухгалтерскогоостаткакомпоновкиданных типвыводатекстакомпоновкиданных " + "типгруппировкикомпоновкиданных типгруппыэлементовотборакомпоновкиданных типдополненияпериодакомпоновкиданных " + "типзаголовкаполейкомпоновкиданных типмакетагруппировкикомпоновкиданных типмакетаобластикомпоновкиданных типостаткакомпоновкиданных " + "типпериодакомпоновкиданных типразмещениятекстакомпоновкиданных типсвязинаборовданныхкомпоновкиданных типэлементарезультатакомпоновкиданных " + "расположениелегендыдиаграммыкомпоновкиданных типпримененияотборакомпоновкиданных режимотображенияэлементанастройкикомпоновкиданных " + "режимотображениянастроеккомпоновкиданных состояниеэлементанастройкикомпоновкиданных способвосстановлениянастроеккомпоновкиданных " + "режимкомпоновкирезультата использованиепараметракомпоновкиданных автопозицияресурсовкомпоновкиданных " + "вариантиспользованиягруппировкикомпоновкиданных расположениересурсоввдиаграммекомпоновкиданных фиксациякомпоновкиданных " + "использованиеусловногооформлениякомпоновкиданных ",
            b = "важностьинтернетпочтовогосообщения обработкатекстаинтернетпочтовогосообщения способкодированияинтернетпочтовоговложения " + "способкодированиянеasciiсимволовинтернетпочтовогосообщения типтекстапочтовогосообщения протоколинтернетпочты " + "статусразборапочтовогосообщения ",
            g = "режимтранзакциизаписижурналарегистрации статустранзакциизаписижурналарегистрации уровеньжурналарегистрации ",
            U = "расположениехранилищасертификатовкриптографии режимвключениясертификатовкриптографии режимпроверкисертификатакриптографии " + "типхранилищасертификатовкриптографии ",
            x = "кодировкаименфайловвzipфайле методсжатияzip методшифрованияzip режимвосстановленияпутейфайловzip режимобработкиподкаталоговzip " + "режимсохраненияпутейzip уровеньсжатияzip ",
            p = "звуковоеоповещение направлениепереходакстроке позициявпотоке порядокбайтов режимблокировкиданных режимуправленияблокировкойданных " + "сервисвстроенныхпокупок состояниефоновогозадания типподписчикадоставляемыхуведомлений уровеньиспользованиязащищенногосоединенияftp ",
            l = "направлениепорядкасхемызапроса типдополненияпериодамисхемызапроса типконтрольнойточкисхемызапроса типобъединениясхемызапроса " + "типпараметрадоступнойтаблицысхемызапроса типсоединениясхемызапроса ",
            r = "httpметод автоиспользованиеобщегореквизита автопрефиксномеразадачи вариантвстроенногоязыка видиерархии видрегистранакопления " + "видтаблицывнешнегоисточникаданных записьдвиженийприпроведении заполнениепоследовательностей индексирование " + "использованиебазыпланавидоврасчета использованиебыстроговыбора использованиеобщегореквизита использованиеподчинения " + "использованиеполнотекстовогопоиска использованиеразделяемыхданныхобщегореквизита использованиереквизита " + "назначениеиспользованияприложения назначениерасширенияконфигурации направлениепередачи обновлениепредопределенныхданных " + "оперативноепроведение основноепредставлениевидарасчета основноепредставлениевидахарактеристики основноепредставлениезадачи " + "основноепредставлениепланаобмена основноепредставлениесправочника основноепредставлениесчета перемещениеграницыприпроведении " + "периодичностьномерабизнеспроцесса периодичностьномерадокумента периодичностьрегистрарасчета периодичностьрегистрасведений " + "повторноеиспользованиевозвращаемыхзначений полнотекстовыйпоискпривводепостроке принадлежностьобъекта проведение " + "разделениеаутентификацииобщегореквизита разделениеданныхобщегореквизита разделениерасширенийконфигурацииобщегореквизита " + "режимавтонумерацииобъектов режимзаписирегистра режимиспользованиямодальности " + "режимиспользованиясинхронныхвызововрасширенийплатформыивнешнихкомпонент режимповторногоиспользованиясеансов " + "режимполученияданныхвыборапривводепостроке режимсовместимости режимсовместимостиинтерфейса " + "режимуправленияблокировкойданныхпоумолчанию сериикодовпланавидовхарактеристик сериикодовпланасчетов " + "сериикодовсправочника созданиепривводе способвыбора способпоискастрокипривводепостроке способредактирования " + "типданныхтаблицывнешнегоисточникаданных типкодапланавидоврасчета типкодасправочника типмакета типномерабизнеспроцесса " + "типномерадокумента типномеразадачи типформы удалениедвижений ",
            s = "важностьпроблемыприменениярасширенияконфигурации вариантинтерфейсаклиентскогоприложения вариантмасштабаформклиентскогоприложения " + "вариантосновногошрифтаклиентскогоприложения вариантстандартногопериода вариантстандартнойдатыначала видграницы видкартинки " + "видотображенияполнотекстовогопоиска видрамки видсравнения видцвета видчисловогозначения видшрифта допустимаядлина допустимыйзнак " + "использованиеbyteordermark использованиеметаданныхполнотекстовогопоиска источникрасширенийконфигурации клавиша кодвозвратадиалога " + "кодировкаxbase кодировкатекста направлениепоиска направлениесортировки обновлениепредопределенныхданных обновлениеприизмененииданных " + "отображениепанелиразделов проверказаполнения режимдиалогавопрос режимзапускаклиентскогоприложения режимокругления режимоткрытияформприложения " + "режимполнотекстовогопоиска скоростьклиентскогосоединения состояниевнешнегоисточникаданных состояниеобновленияконфигурациибазыданных " + "способвыборасертификатаwindows способкодированиястроки статуссообщения типвнешнейкомпоненты типплатформы типповеденияклавишиenter " + "типэлементаинформацииовыполненииобновленияконфигурациибазыданных уровеньизоляциитранзакций хешфункция частидаты",
            O1 = j + M + P + W + G + f + Z + N + T + k + y + B + S + m + b + g + U + x + p + l + r + s,
            T1 = "comобъект ftpсоединение httpзапрос httpсервисответ httpсоединение wsопределения wsпрокси xbase анализданных аннотацияxs " + "блокировкаданных буфердвоичныхданных включениеxs выражениекомпоновкиданных генераторслучайныхчисел географическаясхема " + "географическиекоординаты графическаясхема группамоделиxs данныерасшифровкикомпоновкиданных двоичныеданные дендрограмма " + "диаграмма диаграммаганта диалогвыборафайла диалогвыборацвета диалогвыборашрифта диалограсписаниярегламентногозадания " + "диалогредактированиястандартногопериода диапазон документdom документhtml документацияxs доставляемоеуведомление " + "записьdom записьfastinfoset записьhtml записьjson записьxml записьzipфайла записьданных записьтекста записьузловdom " + "запрос защищенноесоединениеopenssl значенияполейрасшифровкикомпоновкиданных извлечениетекста импортxs интернетпочта " + "интернетпочтовоесообщение интернетпочтовыйпрофиль интернетпрокси интернетсоединение информациядляприложенияxs " + "использованиеатрибутаxs использованиесобытияжурналарегистрации источникдоступныхнастроеккомпоновкиданных " + "итераторузловdom картинка квалификаторыдаты квалификаторыдвоичныхданных квалификаторыстроки квалификаторычисла " + "компоновщикмакетакомпоновкиданных компоновщикнастроеккомпоновкиданных конструктормакетаоформлениякомпоновкиданных " + "конструкторнастроеккомпоновкиданных конструкторформатнойстроки линия макеткомпоновкиданных макетобластикомпоновкиданных " + "макетоформлениякомпоновкиданных маскаxs менеджеркриптографии наборсхемxml настройкикомпоновкиданных настройкисериализацииjson " + "обработкакартинок обработкарасшифровкикомпоновкиданных обходдереваdom объявлениеатрибутаxs объявлениенотацииxs " + "объявлениеэлементаxs описаниеиспользованиясобытиядоступжурналарегистрации " + "описаниеиспользованиясобытияотказвдоступежурналарегистрации описаниеобработкирасшифровкикомпоновкиданных " + "описаниепередаваемогофайла описаниетипов определениегруппыатрибутовxs определениегруппымоделиxs " + "определениеограниченияидентичностиxs определениепростоготипаxs определениесоставноготипаxs определениетипадокументаdom " + "определенияxpathxs отборкомпоновкиданных пакетотображаемыхдокументов параметрвыбора параметркомпоновкиданных " + "параметрызаписиjson параметрызаписиxml параметрычтенияxml переопределениеxs планировщик полеанализаданных " + "полекомпоновкиданных построительdom построительзапроса построительотчета построительотчетаанализаданных " + "построительсхемxml поток потоквпамяти почта почтовоесообщение преобразованиеxsl преобразованиекканоническомуxml " + "процессорвыводарезультатакомпоновкиданныхвколлекциюзначений процессорвыводарезультатакомпоновкиданныхвтабличныйдокумент " + "процессоркомпоновкиданных разыменовательпространствименdom рамка расписаниерегламентногозадания расширенноеимяxml " + "результатчтенияданных своднаядиаграмма связьпараметравыбора связьпотипу связьпотипукомпоновкиданных сериализаторxdto " + "сертификатклиентаwindows сертификатклиентафайл сертификаткриптографии сертификатыудостоверяющихцентровwindows " + "сертификатыудостоверяющихцентровфайл сжатиеданных системнаяинформация сообщениепользователю сочетаниеклавиш " + "сравнениезначений стандартнаядатаначала стандартныйпериод схемаxml схемакомпоновкиданных табличныйдокумент " + "текстовыйдокумент тестируемоеприложение типданныхxml уникальныйидентификатор фабрикаxdto файл файловыйпоток " + "фасетдлиныxs фасетколичестваразрядовдробнойчастиxs фасетмаксимальноговключающегозначенияxs " + "фасетмаксимальногоисключающегозначенияxs фасетмаксимальнойдлиныxs фасетминимальноговключающегозначенияxs " + "фасетминимальногоисключающегозначенияxs фасетминимальнойдлиныxs фасетобразцаxs фасетобщегоколичестваразрядовxs " + "фасетперечисленияxs фасетпробельныхсимволовxs фильтрузловdom форматированнаястрока форматированныйдокумент " + "фрагментxs хешированиеданных хранилищезначения цвет чтениеfastinfoset чтениеhtml чтениеjson чтениеxml чтениеzipфайла " + "чтениеданных чтениетекста чтениеузловdom шрифт элементрезультатакомпоновкиданных ",
            N1 = "comsafearray деревозначений массив соответствие списокзначений структура таблицазначений фиксированнаяструктура " + "фиксированноесоответствие фиксированныймассив ",
            j1 = T1 + N1,
            q1 = "null истина ложь неопределено",
            t = A.inherit(A.NUMBER_MODE),
            J1 = {
                className: "string",
                begin: '"|\\|',
                end: '"|$',
                contains: [{
                    begin: '""'
                }]
            },
            D1 = {
                begin: "'",
                end: "'",
                excludeBegin: !0,
                excludeEnd: !0,
                contains: [{
                    className: "number",
                    begin: "\\d{4}([\\.\\\\/:-]?\\d{2}){0,5}"
                }]
            },
            Z1 = A.inherit(A.C_LINE_COMMENT_MODE),
            E1 = {
                className: "meta",
                begin: "#|&",
                end: "$",
                keywords: {
                    $pattern: q,
                    "meta-keyword": z + $
                },
                contains: [Z1]
            },
            a = {
                className: "symbol",
                begin: "~",
                end: ";|:",
                excludeEnd: !0
            },
            A1 = {
                className: "function",
                variants: [{
                    begin: "процедура|функция",
                    end: "\\)",
                    keywords: "процедура функция"
                }, {
                    begin: "конецпроцедуры|конецфункции",
                    keywords: "конецпроцедуры конецфункции"
                }],
                contains: [{
                    begin: "\\(",
                    end: "\\)",
                    endsParent: !0,
                    contains: [{
                        className: "params",
                        begin: q,
                        end: ",",
                        excludeEnd: !0,
                        endsWithParent: !0,
                        keywords: {
                            $pattern: q,
                            keyword: "знач",
                            literal: q1
                        },
                        contains: [t, J1, D1]
                    }, Z1]
                }, A.inherit(A.TITLE_MODE, {
                    begin: q
                })]
            };
        return {
            name: "1C:Enterprise",
            case_insensitive: !0,
            keywords: {
                $pattern: q,
                keyword: z,
                built_in: D,
                class: O1,
                type: j1,
                literal: q1
            },
            contains: [E1, A1, Z1, a, t, J1, D1]
        }
    }
    qr7.exports = cR9
})
// @from(Ln 246151, Col 4)
zr7 = R((IVw, Yr7) => {
    function lR9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function iR9(...A) {
        return A.map((K) => lR9(K)).join("")
    }

    function nR9(A) {
        let q = {
                ruleDeclaration: /^[a-zA-Z][a-zA-Z0-9-]*/,
                unexpectedChars: /[!@#$^&',?+~`|:]/
            },
            K = ["ALPHA", "BIT", "CHAR", "CR", "CRLF", "CTL", "DIGIT", "DQUOTE", "HEXDIG", "HTAB", "LF", "LWSP", "OCTET", "SP", "VCHAR", "WSP"],
            Y = A.COMMENT(/;/, /$/),
            z = {
                className: "symbol",
                begin: /%b[0-1]+(-[0-1]+|(\.[0-1]+)+){0,1}/
            },
            w = {
                className: "symbol",
                begin: /%d[0-9]+(-[0-9]+|(\.[0-9]+)+){0,1}/
            },
            H = {
                className: "symbol",
                begin: /%x[0-9A-F]+(-[0-9A-F]+|(\.[0-9A-F]+)+){0,1}/
            },
            $ = {
                className: "symbol",
                begin: /%[si]/
            },
            O = {
                className: "attribute",
                begin: iR9(q.ruleDeclaration, /(?=\s*=)/)
            };
        return {
            name: "Augmented Backus-Naur Form",
            illegal: q.unexpectedChars,
            keywords: K,
            contains: [O, Y, z, w, H, $, A.QUOTE_STRING_MODE, A.NUMBER_MODE]
        }
    }
    Yr7.exports = nR9
})
// @from(Ln 246198, Col 4)
$r7 = R((xVw, Hr7) => {
    function wr7(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function rR9(...A) {
        return A.map((K) => wr7(K)).join("")
    }

    function oR9(...A) {
        return "(" + A.map((K) => wr7(K)).join("|") + ")"
    }

    function aR9(A) {
        let q = ["GET", "POST", "HEAD", "PUT", "DELETE", "CONNECT", "OPTIONS", "PATCH", "TRACE"];
        return {
            name: "Apache Access Log",
            contains: [{
                className: "number",
                begin: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?\b/,
                relevance: 5
            }, {
                className: "number",
                begin: /\b\d+\b/,
                relevance: 0
            }, {
                className: "string",
                begin: rR9(/"/, oR9(...q)),
                end: /"/,
                keywords: q,
                illegal: /\n/,
                relevance: 5,
                contains: [{
                    begin: /HTTP\/[12]\.\d'/,
                    relevance: 5
                }]
            }, {
                className: "string",
                begin: /\[\d[^\]\n]{8,}\]/,
                illegal: /\n/,
                relevance: 1
            }, {
                className: "string",
                begin: /\[/,
                end: /\]/,
                illegal: /\n/,
                relevance: 0
            }, {
                className: "string",
                begin: /"Mozilla\/\d\.\d \(/,
                end: /"/,
                illegal: /\n/,
                relevance: 3
            }, {
                className: "string",
                begin: /"/,
                end: /"/,
                illegal: /\n/,
                relevance: 0
            }]
        }
    }
    Hr7.exports = aR9
})
// @from(Ln 246264, Col 4)
_r7 = R((bVw, Or7) => {
    function sR9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function tR9(...A) {
        return A.map((K) => sR9(K)).join("")
    }

    function eR9(A) {
        let q = /[a-zA-Z_$][a-zA-Z0-9_$]*/,
            K = /([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)/,
            Y = {
                className: "rest_arg",
                begin: /[.]{3}/,
                end: q,
                relevance: 10
            };
        return {
            name: "ActionScript",
            aliases: ["as"],
            keywords: {
                keyword: "as break case catch class const continue default delete do dynamic each else extends final finally for function get if implements import in include instanceof interface internal is namespace native new override package private protected public return set static super switch this throw try typeof use var void while with",
                literal: "true false null undefined"
            },
            contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.C_NUMBER_MODE, {
                className: "class",
                beginKeywords: "package",
                end: /\{/,
                contains: [A.TITLE_MODE]
            }, {
                className: "class",
                beginKeywords: "class interface",
                end: /\{/,
                excludeEnd: !0,
                contains: [{
                    beginKeywords: "extends implements"
                }, A.TITLE_MODE]
            }, {
                className: "meta",
                beginKeywords: "import include",
                end: /;/,
                keywords: {
                    "meta-keyword": "import include"
                }
            }, {
                className: "function",
                beginKeywords: "function",
                end: /[{;]/,
                excludeEnd: !0,
                illegal: /\S/,
                contains: [A.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, Y]
                }, {
                    begin: tR9(/:\s*/, K)
                }]
            }, A.METHOD_GUARD],
            illegal: /#/
        }
    }
    Or7.exports = eR9
})
// @from(Ln 246331, Col 4)
Xr7 = R((uVw, Jr7) => {
    function Ay9(A) {
        let K = "[eE][-+]?\\d(_|\\d)*",
            Y = "\\d(_|\\d)*(\\.\\d(_|\\d)*)?(" + K + ")?",
            z = "\\w+",
            H = "\\b(" + ("\\d(_|\\d)*#\\w+(\\.\\w+)?#(" + K + ")?") + "|" + Y + ")",
            $ = "[A-Za-z](_?[A-Za-z0-9.])*",
            O = `[]\\{\\}%#'"`,
            _ = A.COMMENT("--", "$"),
            J = {
                begin: "\\s+:\\s+",
                end: "\\s*(:=|;|\\)|=>|$)",
                illegal: `[]\\{\\}%#'"`,
                contains: [{
                    beginKeywords: "loop for declare others",
                    endsParent: !0
                }, {
                    className: "keyword",
                    beginKeywords: "not null constant access function procedure in out aliased exception"
                }, {
                    className: "type",
                    begin: "[A-Za-z](_?[A-Za-z0-9.])*",
                    endsParent: !0,
                    relevance: 0
                }]
            };
        return {
            name: "Ada",
            case_insensitive: !0,
            keywords: {
                keyword: "abort else new return abs elsif not reverse abstract end accept entry select access exception of separate aliased exit or some all others subtype and for out synchronized array function overriding at tagged generic package task begin goto pragma terminate body private then if procedure type case in protected constant interface is raise use declare range delay limited record when delta loop rem while digits renames with do mod requeue xor",
                literal: "True False"
            },
            contains: [_, {
                className: "string",
                begin: /"/,
                end: /"/,
                contains: [{
                    begin: /""/,
                    relevance: 0
                }]
            }, {
                className: "string",
                begin: /'.'/
            }, {
                className: "number",
                begin: H,
                relevance: 0
            }, {
                className: "symbol",
                begin: "'[A-Za-z](_?[A-Za-z0-9.])*"
            }, {
                className: "title",
                begin: "(\\bwith\\s+)?(\\bprivate\\s+)?\\bpackage\\s+(\\bbody\\s+)?",
                end: "(is|$)",
                keywords: "package body",
                excludeBegin: !0,
                excludeEnd: !0,
                illegal: `[]\\{\\}%#'"`
            }, {
                begin: "(\\b(with|overriding)\\s+)?\\b(function|procedure)\\s+",
                end: "(\\bis|\\bwith|\\brenames|\\)\\s*;)",
                keywords: "overriding function procedure with is renames return",
                returnBegin: !0,
                contains: [_, {
                    className: "title",
                    begin: "(\\bwith\\s+)?\\b(function|procedure)\\s+",
                    end: "(\\(|\\s+|$)",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    illegal: `[]\\{\\}%#'"`
                }, J, {
                    className: "type",
                    begin: "\\breturn\\s+",
                    end: "(\\s+|;|$)",
                    keywords: "return",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    endsParent: !0,
                    illegal: `[]\\{\\}%#'"`
                }]
            }, {
                className: "type",
                begin: "\\b(sub)?type\\s+",
                end: "\\s+",
                keywords: "type",
                excludeBegin: !0,
                illegal: `[]\\{\\}%#'"`
            }, J]
        }
    }
    Jr7.exports = Ay9
})
// @from(Ln 246424, Col 4)
jr7 = R((BVw, Dr7) => {
    function qy9(A) {
        var q = {
                className: "built_in",
                begin: "\\b(void|bool|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|string|ref|array|double|float|auto|dictionary)"
            },
            K = {
                className: "symbol",
                begin: "[a-zA-Z0-9_]+@"
            },
            Y = {
                className: "keyword",
                begin: "<",
                end: ">",
                contains: [q, K]
            };
        return q.contains = [Y], K.contains = [Y], {
            name: "AngelScript",
            aliases: ["asc"],
            keywords: "for in|0 break continue while do|0 return if else case switch namespace is cast or and xor not get|0 in inout|10 out override set|0 private public const default|0 final shared external mixin|10 enum typedef funcdef this super import from interface abstract|0 try catch protected explicit property",
            illegal: "(^using\\s+[A-Za-z0-9_\\.]+;$|\\bfunction\\s*[^\\(])",
            contains: [{
                className: "string",
                begin: "'",
                end: "'",
                illegal: "\\n",
                contains: [A.BACKSLASH_ESCAPE],
                relevance: 0
            }, {
                className: "string",
                begin: '"""',
                end: '"""'
            }, {
                className: "string",
                begin: '"',
                end: '"',
                illegal: "\\n",
                contains: [A.BACKSLASH_ESCAPE],
                relevance: 0
            }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
                className: "string",
                begin: "^\\s*\\[",
                end: "\\]"
            }, {
                beginKeywords: "interface namespace",
                end: /\{/,
                illegal: "[;.\\-]",
                contains: [{
                    className: "symbol",
                    begin: "[a-zA-Z0-9_]+"
                }]
            }, {
                beginKeywords: "class",
                end: /\{/,
                illegal: "[;.\\-]",
                contains: [{
                    className: "symbol",
                    begin: "[a-zA-Z0-9_]+",
                    contains: [{
                        begin: "[:,]\\s*",
                        contains: [{
                            className: "symbol",
                            begin: "[a-zA-Z0-9_]+"
                        }]
                    }]
                }]
            }, q, K, {
                className: "literal",
                begin: "\\b(null|true|false)"
            }, {
                className: "number",
                relevance: 0,
                begin: "(-?)(\\b0[xXbBoOdD][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?f?|\\.\\d+f?)([eE][-+]?\\d+f?)?)"
            }]
        }
    }
    Dr7.exports = qy9
})
// @from(Ln 246502, Col 4)
Pr7 = R((mVw, Mr7) => {
    function Ky9(A) {
        let q = {
                className: "number",
                begin: /[$%]\d+/
            },
            K = {
                className: "number",
                begin: /\d+/
            },
            Y = {
                className: "number",
                begin: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/
            },
            z = {
                className: "number",
                begin: /:\d{1,5}/
            };
        return {
            name: "Apache config",
            aliases: ["apacheconf"],
            case_insensitive: !0,
            contains: [A.HASH_COMMENT_MODE, {
                className: "section",
                begin: /<\/?/,
                end: />/,
                contains: [Y, z, A.inherit(A.QUOTE_STRING_MODE, {
                    relevance: 0
                })]
            }, {
                className: "attribute",
                begin: /\w+/,
                relevance: 0,
                keywords: {
                    nomarkup: "order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"
                },
                starts: {
                    end: /$/,
                    relevance: 0,
                    keywords: {
                        literal: "on off all deny allow"
                    },
                    contains: [{
                        className: "meta",
                        begin: /\s\[/,
                        end: /\]$/
                    }, {
                        className: "variable",
                        begin: /[\$%]\{/,
                        end: /\}/,
                        contains: ["self", q]
                    }, Y, K, A.QUOTE_STRING_MODE]
                }
            }],
            illegal: /\S/
        }
    }
    Mr7.exports = Ky9
})