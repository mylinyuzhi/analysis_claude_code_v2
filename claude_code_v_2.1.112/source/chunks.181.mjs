
// @from(Ln 465440, Col 4)
wr8 = L(() => {
    kQK = Object.prototype.hasOwnProperty;
    zgY = {
        includeMatches: !1,
        findAllMatches: !1,
        minMatchCharLength: 1
    }, YgY = {
        isCaseSensitive: !1,
        includeScore: !1,
        keys: [],
        shouldSort: !0,
        sortFn: (q, K) => q.score === K.score ? q.idx < K.idx ? -1 : 1 : q.score < K.score ? -1 : 1
    }, AgY = {
        location: 0,
        threshold: 0.6,
        distance: 100
    }, OgY = {
        useExtendedSearch: !1,
        getFn: _gY,
        ignoreLocation: !1,
        ignoreFieldNorm: !1,
        fieldNormWeight: 1
    }, y9 = {
        ...YgY,
        ...zgY,
        ...AgY,
        ...OgY
    }, wgY = /[^ ]+/g;
    xQK = class xQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "exact"
        }
        static get multiRegex() {
            return /^="(.*)"$/
        }
        static get singleRegex() {
            return /^=(.*)$/
        }
        search(q) {
            let K = q === this.pattern;
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [0, this.pattern.length - 1]
            }
        }
    };
    uQK = class uQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "inverse-exact"
        }
        static get multiRegex() {
            return /^!"(.*)"$/
        }
        static get singleRegex() {
            return /^!(.*)$/
        }
        search(q) {
            let _ = q.indexOf(this.pattern) === -1;
            return {
                isMatch: _,
                score: _ ? 0 : 1,
                indices: [0, q.length - 1]
            }
        }
    };
    mQK = class mQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "prefix-exact"
        }
        static get multiRegex() {
            return /^\^"(.*)"$/
        }
        static get singleRegex() {
            return /^\^(.*)$/
        }
        search(q) {
            let K = q.startsWith(this.pattern);
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [0, this.pattern.length - 1]
            }
        }
    };
    BQK = class BQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "inverse-prefix-exact"
        }
        static get multiRegex() {
            return /^!\^"(.*)"$/
        }
        static get singleRegex() {
            return /^!\^(.*)$/
        }
        search(q) {
            let K = !q.startsWith(this.pattern);
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [0, q.length - 1]
            }
        }
    };
    pQK = class pQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "suffix-exact"
        }
        static get multiRegex() {
            return /^"(.*)"\$$/
        }
        static get singleRegex() {
            return /^(.*)\$$/
        }
        search(q) {
            let K = q.endsWith(this.pattern);
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [q.length - this.pattern.length, q.length - 1]
            }
        }
    };
    FQK = class FQK extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "inverse-suffix-exact"
        }
        static get multiRegex() {
            return /^!"(.*)"\$$/
        }
        static get singleRegex() {
            return /^!(.*)\$$/
        }
        search(q) {
            let K = !q.endsWith(this.pattern);
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [0, q.length - 1]
            }
        }
    };
    m27 = class m27 extends se {
        constructor(q, {
            location: K = y9.location,
            threshold: _ = y9.threshold,
            distance: z = y9.distance,
            includeMatches: Y = y9.includeMatches,
            findAllMatches: A = y9.findAllMatches,
            minMatchCharLength: O = y9.minMatchCharLength,
            isCaseSensitive: w = y9.isCaseSensitive,
            ignoreLocation: $ = y9.ignoreLocation
        } = {}) {
            super(q);
            this._bitapSearch = new u27(q, {
                location: K,
                threshold: _,
                distance: z,
                includeMatches: Y,
                findAllMatches: A,
                minMatchCharLength: O,
                isCaseSensitive: w,
                ignoreLocation: $
            })
        }
        static get type() {
            return "fuzzy"
        }
        static get multiRegex() {
            return /^"(.*)"$/
        }
        static get singleRegex() {
            return /^(.*)$/
        }
        search(q) {
            return this._bitapSearch.searchIn(q)
        }
    };
    B27 = class B27 extends se {
        constructor(q) {
            super(q)
        }
        static get type() {
            return "include"
        }
        static get multiRegex() {
            return /^'"(.*)"$/
        }
        static get singleRegex() {
            return /^'(.*)$/
        }
        search(q) {
            let K = 0,
                _, z = [],
                Y = this.pattern.length;
            while ((_ = q.indexOf(this.pattern, K)) > -1) K = _ + Y, z.push([_, K - 1]);
            let A = !!z.length;
            return {
                isMatch: A,
                score: A ? 0 : 1,
                indices: z
            }
        }
    };
    S27 = [xQK, B27, mQK, BQK, FQK, pQK, uQK, m27], yQK = S27.length, MgY = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    DgY = new Set([m27.type, B27.type]);
    C27 = [];
    Ar8 = {
        AND: "$and",
        OR: "$or"
    }, I27 = {
        PATH: "$path",
        PATTERN: "$val"
    };
    Lu.version = "7.0.0";
    Lu.createIndex = IQK;
    Lu.parseIndex = jgY;
    Lu.config = y9;
    Lu.parseQuery = UQK;
    ZgY(gQK)
})
// @from(Ln 465680, Col 0)
function QQK(q, K) {
    for (let _ of q)
        if (!K.has(_)) return !1;
    return !0
}
// @from(Ln 465686, Col 0)
function dQK(q) {
    if (q.type !== "user") return !1;
    let K = q.message.content[0];
    if (K?.type !== "text") return !1;
    if (!K.text.includes(`<${TA}`)) return !1;
    if (vK(K.text, rX) !== "completed") return !1;
    return vK(K.text, Mw)?.startsWith(eI6) ?? !1
}
// @from(Ln 465695, Col 0)
function cQK(q, K) {
    if (!lq()) return q;
    if (K) return q;
    let _ = [],
        z = 0;
    while (z < q.length) {
        let Y = q[z];
        if (dQK(Y)) {
            let A = 0;
            while (z < q.length && dQK(q[z])) A++, z++;
            if (A === 1) _.push(Y);
            else _.push({
                ...Y,
                message: {
                    role: "user",
                    content: [{
                        type: "text",
                        text: `<${TA}><${rX}>completed</${rX}><${Mw}>${A} background commands completed</${Mw}></${TA}>`
                    }]
                }
            })
        } else _.push(Y), z++
    }
    return _
}
// @from(Ln 465720, Col 4)
lQK = L(() => {
    rA();
    pl();
    nO();
    _7()
})
// @from(Ln 465727, Col 0)
function nQK(q) {
    return q.type === "system" && q.subtype === "stop_hook_summary" && q.hookLabel !== void 0
}
// @from(Ln 465731, Col 0)
function iQK(q) {
    let K = [],
        _ = 0;
    while (_ < q.length) {
        let z = q[_];
        if (nQK(z)) {
            let Y = z.hookLabel,
                A = [];
            while (_ < q.length) {
                let O = q[_];
                if (!nQK(O) || O.hookLabel !== Y) break;
                A.push(O), _++
            }
            if (A.length === 1) K.push(z);
            else K.push({
                ...z,
                hookCount: A.reduce((O, w) => O + w.hookCount, 0),
                hookInfos: A.flatMap((O) => O.hookInfos),
                hookErrors: A.flatMap((O) => O.hookErrors),
                preventedContinuation: A.some((O) => O.preventedContinuation),
                hasOutput: A.some((O) => O.hasOutput),
                totalDurationMs: Math.max(...A.map((O) => O.totalDurationMs ?? 0))
            })
        } else K.push(z), _++
    }
    return K
}
// @from(Ln 465759, Col 0)
function rQK(q) {
    return q.type === "attachment" && q.attachment.type === "task_status" && q.attachment.taskType === "in_process_teammate" && q.attachment.status === "completed"
}
// @from(Ln 465763, Col 0)
function oQK(q) {
    let K = [],
        _ = 0;
    while (_ < q.length) {
        let z = q[_];
        if (rQK(z)) {
            let Y = 0;
            while (_ < q.length && rQK(q[_])) Y++, _++;
            if (Y === 1) K.push(z);
            else K.push({
                type: "attachment",
                uuid: z.uuid,
                timestamp: z.timestamp,
                attachment: {
                    type: "teammate_shutdown_batch",
                    count: Y
                }
            })
        } else K.push(z), _++
    }
    return K
}
// @from(Ln 465786, Col 0)
function NgY(q) {
    let K = aQK.get(q);
    if (!K) K = new Set(q.filter((_) => _.renderGroupedToolUse).map((_) => _.name)), aQK.set(q, K);
    return K
}
// @from(Ln 465792, Col 0)
function p27(q) {
    if (q.type === "assistant" && q.message.content[0]?.type === "tool_use") {
        let K = q.message.content[0];
        return {
            messageId: q.message.id,
            toolUseId: K.id,
            toolName: K.name
        }
    }
    return null
}
// @from(Ln 465804, Col 0)
function sQK(q, K, _ = !1) {
    if (_) return {
        messages: q
    };
    let z = NgY(K),
        Y = new Map;
    for (let H of q) {
        let J = p27(H);
        if (J && z.has(J.toolName)) {
            let X = `${J.messageId}:${J.toolName}`,
                M = Y.get(X) ?? [];
            M.push(H), Y.set(X, M)
        }
    }
    let A = new Map,
        O = new Set;
    for (let [H, J] of Y)
        if (J.length >= 2) {
            A.set(H, J);
            for (let X of J) {
                let M = p27(X);
                if (M) O.add(M.toolUseId)
            }
        } let w = new Map;
    for (let H of q)
        if (H.type === "user") {
            for (let J of H.message.content)
                if (J.type === "tool_result" && O.has(J.tool_use_id)) w.set(J.tool_use_id, H)
        } let $ = [],
        j = new Set;
    for (let H of q) {
        let J = p27(H);
        if (J) {
            let X = `${J.messageId}:${J.toolName}`,
                M = A.get(X);
            if (M) {
                if (!j.has(X)) {
                    j.add(X);
                    let P = M[0],
                        W = [];
                    for (let Z of M) {
                        let G = Z.message.content[0].id,
                            f = w.get(G);
                        if (f) W.push(f)
                    }
                    let D = {
                        type: "grouped_tool_use",
                        toolName: J.toolName,
                        messages: M,
                        results: W,
                        displayMessage: P,
                        uuid: `grouped-${P.uuid}`,
                        timestamp: P.timestamp,
                        messageId: J.messageId
                    };
                    $.push(D)
                }
                continue
            }
        }
        if (H.type === "user") {
            let X = H.message.content.filter((M) => M.type === "tool_result");
            if (X.length > 0) {
                if (X.every((P) => O.has(P.tool_use_id))) continue
            }
        }
        $.push(H)
    }
    return {
        messages: $
    }
}
// @from(Ln 465876, Col 4)
aQK
// @from(Ln 465877, Col 4)
tQK = L(() => {
    aQK = new WeakMap
})
// @from(Ln 465881, Col 0)
function $r8(q) {
    let K = KdK.get(q);
    if (K !== void 0) return K;
    let _ = EgY(q).toLowerCase();
    return KdK.set(q, _), _
}
// @from(Ln 465888, Col 0)
function EgY(q) {
    let K = "";
    switch (q.type) {
        case "user": {
            let Y = q.message.content;
            if (typeof Y === "string") K = qdK.has(Y) ? "" : Y;
            else {
                let A = [];
                for (let O of Y)
                    if (O.type === "text") {
                        if (!qdK.has(O.text)) A.push(O.text)
                    } else if (O.type === "tool_result") A.push(LgY(q.toolUseResult));
                K = A.join(`
`)
            }
            break
        }
        case "assistant": {
            let Y = q.message.content;
            if (Array.isArray(Y)) K = Y.flatMap((A) => {
                if (A.type === "text") return [A.text];
                if (A.type === "tool_use") return [ygY(A.input)];
                return []
            }).join(`
`);
            break
        }
        case "attachment": {
            if (q.attachment.type === "relevant_memories") K = q.attachment.memories.map((Y) => Y.content).join(`
`);
            else if (q.attachment.type === "queued_command" && q.attachment.commandMode !== "task-notification" && !q.attachment.isMeta) {
                let Y = q.attachment.prompt;
                K = typeof Y === "string" ? Y : Y.flatMap((A) => A.type === "text" ? [A.text] : []).join(`
`)
            }
            break
        }
        case "collapsed_read_search": {
            if (q.relevantMemories) K = q.relevantMemories.map((Y) => Y.content).join(`
`);
            break
        }
        default:
            break
    }
    let _ = K,
        z = _.indexOf("<system-reminder>");
    while (z >= 0) {
        let Y = _.indexOf(eQK, z);
        if (Y < 0) break;
        _ = _.slice(0, z) + _.slice(Y + eQK.length), z = _.indexOf("<system-reminder>")
    }
    return _
}
// @from(Ln 465943, Col 0)
function ygY(q) {
    if (!q || typeof q !== "object") return "";
    let K = q,
        _ = [];
    for (let z of ["command", "pattern", "file_path", "path", "prompt", "description", "query", "url", "skill"]) {
        let Y = K[z];
        if (typeof Y === "string") _.push(Y)
    }
    for (let z of ["args", "files"]) {
        let Y = K[z];
        if (Array.isArray(Y) && Y.every((A) => typeof A === "string")) _.push(Y.join(" "))
    }
    return _.join(`
`)
}
// @from(Ln 465959, Col 0)
function LgY(q) {
    if (!q || typeof q !== "object") return typeof q === "string" ? q : "";
    let K = q;
    if (typeof K.stdout === "string") {
        let z = typeof K.stderr === "string" ? K.stderr : "";
        return K.stdout + (z ? `
` + z : "")
    }
    if (K.file && typeof K.file === "object" && typeof K.file.content === "string") return K.file.content;
    let _ = [];
    for (let z of ["content", "output", "result", "text", "message"]) {
        let Y = K[z];
        if (typeof Y === "string") _.push(Y)
    }
    for (let z of ["filenames", "lines", "results"]) {
        let Y = K[z];
        if (Array.isArray(Y) && Y.every((A) => typeof A === "string")) _.push(Y.join(`
`))
    }
    return _.join(`
`)
}
// @from(Ln 465981, Col 4)
eQK = "</system-reminder>"
// @from(Ln 465982, Col 4)
qdK
// @from(Ln 465982, Col 9)
KdK
// @from(Ln 465983, Col 4)
F27 = L(() => {
    _7();
    qdK = new Set([M36, of]), KdK = new WeakMap
})
// @from(Ln 465988, Col 0)
function zdK(q) {
    if (q >= 70) return "horizontal";
    return "compact"
}
// @from(Ln 465993, Col 0)
function YdK(q, K, _) {
    if (K === "horizontal") {
        let Y = _,
            A = g27 + Hr8 + jr8 + Y,
            O = q - A,
            w = Math.max(30, O),
            $ = Math.min(Y + w + jr8 + Hr8, q - g27);
        if ($ < Y + w + jr8 + Hr8) w = $ - Y - jr8 - Hr8;
        return {
            leftWidth: Y,
            rightWidth: w,
            totalWidth: $
        }
    }
    let z = Math.min(q - g27, _dK + 20);
    return {
        leftWidth: z,
        rightWidth: z,
        totalWidth: z
    }
}
// @from(Ln 466015, Col 0)
function AdK(q, K, _) {
    let z = Math.max(N1(q), N1(K), N1(_), 20);
    return Math.min(z + 4, _dK)
}
// @from(Ln 466020, Col 0)
function Xr8(q) {
    if (!q || q.length > hgY) return "Welcome back!";
    return `Welcome back ${q}!`
}
// @from(Ln 466025, Col 0)
function b_8(q, K) {
    if (N1(q) <= K) return q;
    let _ = "/",
        z = "…",
        Y = 1,
        A = 1,
        O = q.split(_),
        w = O[0] || "",
        $ = O.at(-1) || "",
        j = N1(w),
        H = N1($);
    if (O.length === 1) return j4(q, K);
    if (w === "" && Y + A + H >= K) return `${_}${j4($,Math.max(1,K-A))}`;
    if (w !== "" && Y * 2 + A + H >= K) return `${z}${_}${j4($,Math.max(1,K-Y-A))}`;
    if (O.length === 2) {
        let M = K - Y - A - H;
        return `${RY6(w,M)}${z}${_}${$}`
    }
    let J = K - j - H - Y - 2 * A;
    if (J <= 0) {
        let M = Math.max(0, K - H - Y - 2 * A);
        return `${RY6(w,M)}${_}${z}${_}${$}`
    }
    let X = [];
    for (let M = O.length - 2; M > 0; M--) {
        let P = O[M];
        if (P && N1(P) + A <= J) X.unshift(P), J -= N1(P) + A;
        else break
    }
    if (X.length === 0) return `${w}${_}${z}${_}${$}`;
    return `${w}${_}${z}${_}${X.join(_)}${_}${$}`
}
// @from(Ln 466057, Col 0)
async function OdK() {
    if (Jr8) return Jr8;
    let q = I8();
    return Jr8 = uC6(10).then((K) => {
        return C_8 = K.filter((_) => {
            if (_.isSidechain) return !1;
            if (_.sessionId === q) return !1;
            if (_.summary?.includes("I apologize")) return !1;
            let z = _.summary && _.summary !== "No prompt",
                Y = _.firstPrompt && _.firstPrompt !== "No prompt";
            return z || Y
        }).slice(0, 3), C_8
    }).catch(() => {
        return C_8 = [], C_8
    }), Jr8
}
// @from(Ln 466074, Col 0)
function wdK() {
    return C_8
}
// @from(Ln 466078, Col 0)
function Mr8() {
    let q = process.env.DEMO_VERSION ?? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION,
        K = y61(),
        _ = process.env.DEMO_VERSION ? "/code/claude" : S3(b8()),
        z = K ? `${_} in ${K.replace(/^https?:\/\//,"")}` : _,
        Y = i7() ? BV8() : "API Usage Billing",
        A = v7().agent;
    return {
        version: q,
        cwd: z,
        billingType: Y,
        agentName: A
    }
}
// @from(Ln 466100, Col 0)
function $dK(q, K, _) {
    if (N1(q) + 3 + N1(K) > _) return {
        shouldSplit: !0,
        truncatedModel: w5(q, _),
        truncatedBilling: w5(K, _)
    };
    return {
        shouldSplit: !1,
        truncatedModel: w5(q, Math.max(_ - N1(K) - 3, 10)),
        truncatedBilling: K
    }
}
// @from(Ln 466113, Col 0)
function jdK(q) {
    let K = qr8();
    if (!K) return [];
    let _;
    try {
        _ = Kr8(K)
    } catch {
        return []
    }
    let z = [],
        Y = Object.keys(_).sort((A, O) => RP(A, O) ? -1 : 1).slice(0, 3);
    for (let A of Y) {
        let O = _[A];
        if (O) z.push(...O)
    }
    return z.slice(0, q)
}
// @from(Ln 466130, Col 4)
_dK = 50
// @from(Ln 466131, Col 4)
hgY = 20
// @from(Ln 466132, Col 4)
g27 = 4
// @from(Ln 466133, Col 4)
jr8 = 1
// @from(Ln 466134, Col 4)
Hr8 = 2
// @from(Ln 466135, Col 4)
C_8
// @from(Ln 466135, Col 9)
Jr8 = null
// @from(Ln 466136, Col 4)
Pr8 = L(() => {
    y8();
    n5();
    T7();
    n7();
    eK();
    c7();
    ix6();
    g4();
    a1();
    C_8 = []
})
// @from(Ln 466149, Col 0)
function sP6(q) {
    let K = s(26),
        _;
    if (K[0] !== q) _ = q === void 0 ? {} : q, K[0] = q, K[1] = _;
    else _ = K[1];
    let {
        pose: z
    } = _, Y = z === void 0 ? "default" : z;
    if (X7.terminal === "Apple_Terminal") {
        let D;
        if (K[2] !== Y) D = cz.createElement(CgY, {
            pose: Y
        }), K[2] = Y, K[3] = D;
        else D = K[3];
        return D
    }
    let A = RgY[Y],
        O;
    if (K[4] !== A.r1L) O = cz.createElement(T, {
        color: "clawd_body"
    }, A.r1L), K[4] = A.r1L, K[5] = O;
    else O = K[5];
    let w;
    if (K[6] !== A.r1E) w = cz.createElement(T, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, A.r1E), K[6] = A.r1E, K[7] = w;
    else w = K[7];
    let $;
    if (K[8] !== A.r1R) $ = cz.createElement(T, {
        color: "clawd_body"
    }, A.r1R), K[8] = A.r1R, K[9] = $;
    else $ = K[9];
    let j;
    if (K[10] !== O || K[11] !== w || K[12] !== $) j = cz.createElement(T, null, O, w, $), K[10] = O, K[11] = w, K[12] = $, K[13] = j;
    else j = K[13];
    let H;
    if (K[14] !== A.r2L) H = cz.createElement(T, {
        color: "clawd_body"
    }, A.r2L), K[14] = A.r2L, K[15] = H;
    else H = K[15];
    let J;
    if (K[16] === Symbol.for("react.memo_cache_sentinel")) J = cz.createElement(T, {
        color: "clawd_body",
        backgroundColor: "clawd_background"
    }, "█████"), K[16] = J;
    else J = K[16];
    let X;
    if (K[17] !== A.r2R) X = cz.createElement(T, {
        color: "clawd_body"
    }, A.r2R), K[17] = A.r2R, K[18] = X;
    else X = K[18];
    let M;
    if (K[19] !== H || K[20] !== X) M = cz.createElement(T, null, H, J, X), K[19] = H, K[20] = X, K[21] = M;
    else M = K[21];
    let P;
    if (K[22] === Symbol.for("react.memo_cache_sentinel")) P = cz.createElement(T, {
        color: "clawd_body"
    }, "  ", "▘▘ ▝▝", "  "), K[22] = P;
    else P = K[22];
    let W;
    if (K[23] !== M || K[24] !== j) W = cz.createElement(u, {
        flexDirection: "column"
    }, j, M, P), K[23] = M, K[24] = j, K[25] = W;
    else W = K[25];
    return W
}
// @from(Ln 466217, Col 0)
function CgY(q) {
    let K = s(10),
        {
            pose: _
        } = q,
        z;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) z = cz.createElement(T, {
        color: "clawd_body"
    }, "▗"), K[0] = z;
    else z = K[0];
    let Y = SgY[_],
        A;
    if (K[1] !== Y) A = cz.createElement(T, {
        color: "clawd_background",
        backgroundColor: "clawd_body"
    }, Y), K[1] = Y, K[2] = A;
    else A = K[2];
    let O;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) O = cz.createElement(T, {
        color: "clawd_body"
    }, "▖"), K[3] = O;
    else O = K[3];
    let w;
    if (K[4] !== A) w = cz.createElement(T, null, z, A, O), K[4] = A, K[5] = w;
    else w = K[5];
    let $, j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) $ = cz.createElement(T, {
        backgroundColor: "clawd_body"
    }, " ".repeat(7)), j = cz.createElement(T, {
        color: "clawd_body"
    }, "▘▘ ▝▝"), K[6] = $, K[7] = j;
    else $ = K[6], j = K[7];
    let H;
    if (K[8] !== w) H = cz.createElement(u, {
        flexDirection: "column",
        alignItems: "center"
    }, w, $, j), K[8] = w, K[9] = H;
    else H = K[9];
    return H
}
// @from(Ln 466257, Col 4)
cz
// @from(Ln 466257, Col 8)
RgY
// @from(Ln 466257, Col 13)
SgY
// @from(Ln 466258, Col 4)
Wr8 = L(() => {
    o6();
    g6();
    D_();
    cz = K6(P6(), 1), RgY = {
        default: {
            r1L: " ▐",
            r1E: "▛███▜",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "look-left": {
            r1L: " ▐",
            r1E: "▟███▟",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "look-right": {
            r1L: " ▐",
            r1E: "▙███▙",
            r1R: "▌",
            r2L: "▝▜",
            r2R: "▛▘"
        },
        "arms-up": {
            r1L: "▗▟",
            r1E: "▛███▜",
            r1R: "▙▖",
            r2L: " ▜",
            r2R: "▛ "
        }
    }, SgY = {
        default: " ▗   ▖ ",
        "look-left": " ▘   ▘ ",
        "look-right": " ▝   ▝ ",
        "arms-up": " ▗   ▖ "
    }
})
// @from(Ln 466299, Col 0)
function HdK(q) {
    let {
        title: K,
        lines: _,
        footer: z,
        emptyMessage: Y,
        customContent: A
    } = q, O = N1(K);
    if (A !== void 0) O = Math.max(O, A.width);
    else if (_.length === 0 && Y) O = Math.max(O, N1(Y));
    else {
        let $ = Math.max(0, ..._.map((j) => j.timestamp ? N1(j.timestamp) : 0));
        for (let j of _) {
            let H = $ > 0 ? $ : 0,
                J = N1(j.text) + (H > 0 ? H + 2 : 0);
            O = Math.max(O, J)
        }
    }
    if (z) O = Math.max(O, N1(z));
    return O
}
// @from(Ln 466321, Col 0)
function JdK(q) {
    let K = s(15),
        {
            config: _,
            actualWidth: z
        } = q,
        {
            title: Y,
            lines: A,
            footer: O,
            emptyMessage: w,
            customContent: $
        } = _,
        j;
    if (K[0] !== A) j = Math.max(0, ...A.map(bgY)), K[0] = A, K[1] = j;
    else j = K[1];
    let H = j,
        J;
    if (K[2] !== Y) J = Ow.createElement(T, {
        bold: !0,
        color: "claude"
    }, Y), K[2] = Y, K[3] = J;
    else J = K[3];
    let X;
    if (K[4] !== z || K[5] !== $ || K[6] !== w || K[7] !== O || K[8] !== A || K[9] !== H) X = $ ? Ow.createElement(Ow.Fragment, null, $.content, O && Ow.createElement(T, {
        dimColor: !0,
        italic: !0
    }, w5(O, z))) : A.length === 0 && w ? Ow.createElement(T, {
        dimColor: !0
    }, w5(w, z)) : Ow.createElement(Ow.Fragment, null, A.map((P, W) => {
        let D = Math.max(10, z - (H > 0 ? H + 2 : 0));
        return Ow.createElement(T, {
            key: W
        }, H > 0 && Ow.createElement(Ow.Fragment, null, Ow.createElement(T, {
            dimColor: !0
        }, (P.timestamp || "").padEnd(H)), "  "), Ow.createElement(T, null, w5(P.text, D)))
    }), O && Ow.createElement(T, {
        dimColor: !0,
        italic: !0
    }, w5(O, z))), K[4] = z, K[5] = $, K[6] = w, K[7] = O, K[8] = A, K[9] = H, K[10] = X;
    else X = K[10];
    let M;
    if (K[11] !== z || K[12] !== J || K[13] !== X) M = Ow.createElement(u, {
        flexDirection: "column",
        width: z
    }, J, X), K[11] = z, K[12] = J, K[13] = X, K[14] = M;
    else M = K[14];
    return M
}
// @from(Ln 466371, Col 0)
function bgY(q) {
    return q.timestamp ? N1(q.timestamp) : 0
}
// @from(Ln 466374, Col 4)
Ow
// @from(Ln 466375, Col 4)
XdK = L(() => {
    o6();
    n5();
    g6();
    c7();
    Ow = K6(P6(), 1)
})
// @from(Ln 466383, Col 0)
function MdK(q) {
    let K = s(10),
        {
            feeds: _,
            maxWidth: z
        } = q,
        Y;
    if (K[0] !== _) {
        let j = _.map(IgY);
        Y = Math.max(...j), K[0] = _, K[1] = Y
    } else Y = K[1];
    let O = Math.min(Y, z),
        w;
    if (K[2] !== O || K[3] !== _) {
        let j;
        if (K[5] !== O || K[6] !== _.length) j = (H, J) => Mg.createElement(Mg.Fragment, {
            key: J
        }, Mg.createElement(JdK, {
            config: H,
            actualWidth: O
        }), J < _.length - 1 && Mg.createElement(zA, {
            color: "claude",
            width: O
        })), K[5] = O, K[6] = _.length, K[7] = j;
        else j = K[7];
        w = _.map(j), K[2] = O, K[3] = _, K[4] = w
    } else w = K[4];
    let $;
    if (K[8] !== w) $ = Mg.createElement(u, {
        flexDirection: "column"
    }, w), K[8] = w, K[9] = $;
    else $ = K[9];
    return $
}
// @from(Ln 466418, Col 0)
function IgY(q) {
    return HdK(q)
}
// @from(Ln 466421, Col 4)
Mg
// @from(Ln 466422, Col 4)
PdK = L(() => {
    o6();
    g6();
    VR();
    XdK();
    Mg = K6(P6(), 1)
})
// @from(Ln 466429, Col 0)
async function xgY(q = "claude_code_guest_pass") {
    let {
        accessToken: K,
        orgUUID: _
    } = await TX(), z = {
        ...bA(K),
        "x-organization-uuid": _
    }, Y = `${r7().BASE_API_URL}/api/oauth/organizations/${_}/referral/eligibility`;
    return (await Z1.get(Y, {
        headers: z,
        params: {
            campaign: q
        },
        timeout: 5000
    })).data
}
// @from(Ln 466445, Col 0)
async function ZdK(q = "claude_code_guest_pass") {
    let {
        accessToken: K,
        orgUUID: _
    } = await TX(), z = {
        ...bA(K),
        "x-organization-uuid": _
    }, Y = `${r7().BASE_API_URL}/api/oauth/organizations/${_}/referral/redemptions`;
    return (await Z1.get(Y, {
        headers: z,
        params: {
            campaign: q
        },
        timeout: 1e4
    })).data
}
// @from(Ln 466462, Col 0)
function fdK() {
    return !!(k_()?.organizationUuid && i7() && MK() === "max")
}
// @from(Ln 466466, Col 0)
function sx6() {
    if (!fdK()) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let q = k_()?.organizationUuid;
    if (!q) return {
        eligible: !1,
        needsRefresh: !1,
        hasCache: !1
    };
    let _ = H8().passesEligibilityCache?.[q];
    if (!_) return {
        eligible: !1,
        needsRefresh: !0,
        hasCache: !1
    };
    let {
        eligible: z,
        timestamp: Y
    } = _, O = Date.now() - Y > DdK;
    return {
        eligible: z,
        needsRefresh: O,
        hasCache: !0
    }
}
// @from(Ln 466495, Col 0)
function r_6(q) {
    let K = ugY[q.currency] ?? `${q.currency} `,
        _ = q.amount_minor_units / 100,
        z = _ % 1 === 0 ? _.toString() : _.toFixed(2);
    return `${K}${z}`
}
// @from(Ln 466502, Col 0)
function o_6() {
    let q = k_()?.organizationUuid;
    if (!q) return null;
    return H8().passesEligibilityCache?.[q]?.referrer_reward ?? null
}
// @from(Ln 466508, Col 0)
function Dr8() {
    let q = k_()?.organizationUuid;
    if (!q) return null;
    return H8().passesEligibilityCache?.[q]?.remaining_passes ?? null
}
// @from(Ln 466513, Col 0)
async function WdK() {
    if (I_8) return E("Passes: Reusing in-flight eligibility fetch"), I_8;
    let q = k_()?.organizationUuid;
    if (!q) return null;
    return I_8 = (async () => {
        try {
            let K = await xgY(),
                _ = {
                    ...K,
                    timestamp: Date.now()
                };
            return d8((z) => ({
                ...z,
                passesEligibilityCache: {
                    ...z.passesEligibilityCache,
                    [q]: _
                }
            })), E(`Passes eligibility cached for org ${q}: ${K.eligible}`), K
        } catch (K) {
            return E("Failed to fetch and cache passes eligibility"), j6(K), null
        } finally {
            I_8 = null
        }
    })(), I_8
}
// @from(Ln 466538, Col 0)
async function U27() {
    if (!fdK()) return null;
    let q = k_()?.organizationUuid;
    if (!q) return null;
    let _ = H8().passesEligibilityCache?.[q],
        z = Date.now();
    if (!_) return E("Passes: No cache, fetching eligibility in background (command unavailable this session)"), WdK(), null;
    if (z - _.timestamp > DdK) {
        E("Passes: Cache stale, returning cached data and refreshing in background"), WdK();
        let {
            timestamp: O,
            ...w
        } = _;
        return w
    }
    E("Passes: Using fresh cached eligibility data");
    let {
        timestamp: Y,
        ...A
    } = _;
    return A
}
// @from(Ln 466560, Col 0)
async function GdK() {
    if (o3()) return;
    U27()
}
// @from(Ln 466564, Col 4)
DdK = 86400000
// @from(Ln 466565, Col 4)
I_8 = null
// @from(Ln 466566, Col 4)
ugY
// @from(Ln 466567, Col 4)
a_6 = L(() => {
    CK();
    z3();
    T7();
    h1();
    K8();
    U8();
    G$();
    VX();
    ugY = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        BRL: "R$",
        CAD: "CA$",
        AUD: "A$",
        NZD: "NZ$",
        SGD: "S$"
    }
})
// @from(Ln 466591, Col 0)
function tx6(q) {
    let K = q.map((_) => {
        let z = CC(_.modified);
        return {
            text: (_.summary && _.summary !== "No prompt" ? _.summary : _.firstPrompt) || "",
            timestamp: z
        }
    });
    return {
        title: "Recent activity",
        lines: K,
        footer: K.length > 0 ? "/resume for more" : void 0,
        emptyMessage: "No recent activity"
    }
}
// @from(Ln 466607, Col 0)
function vdK(q) {
    let K = q.map((z) => {
            return {
                text: z
            }
        }),
        _ = "Check the Claude Code changelog for updates";
    return {
        title: "What's new",
        lines: K,
        footer: K.length > 0 ? "/release-notes for more" : void 0,
        emptyMessage: "Check the Claude Code changelog for updates"
    }
}
// @from(Ln 466622, Col 0)
function TdK(q) {
    let _ = q.filter(({
            isEnabled: Y
        }) => Y).sort((Y, A) => Number(Y.isComplete) - Number(A.isComplete)).map(({
            text: Y,
            isComplete: A
        }) => {
            return {
                text: `${A?`${e6.tick} `:""}${Y}`
            }
        }),
        z = b8() === mgY() ? "Note: You have launched claude in your home directory. For the best experience, launch it in a project directory instead." : void 0;
    if (z) _.push({
        text: z
    });
    return {
        title: "Tips for getting started",
        lines: _
    }
}
// @from(Ln 466643, Col 0)
function VdK() {
    let q = o_6(),
        K = q ? `Share Claude Code and earn ${r_6(q)} of extra usage` : "Share Claude Code with friends";
    return {
        title: "3 guest passes",
        lines: [],
        customContent: {
            content: hu.createElement(hu.Fragment, null, hu.createElement(u, {
                marginY: 1
            }, hu.createElement(T, {
                color: "claude"
            }, "[✻] [✻] [✻]")), hu.createElement(T, {
                dimColor: !0
            }, K)),
            width: 48
        },
        footer: "/passes"
    }
}
// @from(Ln 466662, Col 4)
hu
// @from(Ln 466663, Col 4)
kdK = L(() => {
    Qq();
    g6();
    a_6();
    n7();
    c7();
    hu = K6(P6(), 1)
})
// @from(Ln 466672, Col 0)
function pS(q, K, _) {
    return Array.from({
        length: _
    }, () => ({
        pose: q,
        offset: K
    }))
}
// @from(Ln 466681, Col 0)
function ydK(q) {
    let K = s(10),
        _;
    if (K[0] !== q) _ = q === void 0 ? {} : q, K[0] = q, K[1] = _;
    else _ = K[1];
    let {
        autoplay: z,
        sequence: Y,
        onComplete: A
    } = _, O = z === void 0 ? !1 : z, {
        pose: w,
        bounceOffset: $,
        onClick: j
    } = cgY(O, Y, A), H;
    if (K[2] !== w) H = tP6.createElement(sP6, {
        pose: w
    }), K[2] = w, K[3] = H;
    else H = K[3];
    let J;
    if (K[4] !== $ || K[5] !== H) J = tP6.createElement(u, {
        marginTop: $,
        flexShrink: 0
    }, H), K[4] = $, K[5] = H, K[6] = J;
    else J = K[6];
    let X;
    if (K[7] !== j || K[8] !== J) X = tP6.createElement(u, {
        height: UgY,
        flexDirection: "column",
        onClick: j
    }, J), K[7] = j, K[8] = J, K[9] = X;
    else X = K[9];
    return X
}
// @from(Ln 466715, Col 0)
function cgY(q, K, _) {
    let [z] = te.useState(() => v7().prefersReducedMotion ?? !1), Y = (q || K !== void 0) && !z, [A, O] = te.useState(Y ? 0 : -1), w = te.useRef(K ? dgY[K] : q ? BgY : Zr8), $ = te.useRef(_);
    $.current = _, te.useEffect(() => {
        if (z) $.current?.()
    }, [z]);
    let j = () => {
        if (q || K || z || A !== -1) return;
        w.current = NdK[Math.floor(Math.random() * NdK.length)], O(0)
    };
    te.useEffect(() => {
        if (A === -1) return;
        if (A >= w.current.length) {
            $.current?.(), O(q && !K ? 0 : -1);
            return
        }
        let M = setTimeout(O, FgY, ggY);
        return () => clearTimeout(M)
    }, [A, q, K]);
    let H = w.current,
        J = K ? H.at(-1) : pgY,
        X = A >= 0 && A < H.length ? H[A] : J;
    return {
        pose: X.pose,
        bounceOffset: X.offset,
        onClick: j
    }
}
// @from(Ln 466742, Col 4)
tP6
// @from(Ln 466742, Col 9)
te
// @from(Ln 466742, Col 13)
Zr8
// @from(Ln 466742, Col 18)
EdK
// @from(Ln 466742, Col 23)
BgY
// @from(Ln 466742, Col 28)
NdK
// @from(Ln 466742, Col 33)
pgY
// @from(Ln 466742, Col 38)
FgY = 60
// @from(Ln 466743, Col 4)
ggY = (q) => q + 1
// @from(Ln 466744, Col 4)
UgY = 3
// @from(Ln 466745, Col 4)
QgY
// @from(Ln 466745, Col 9)
dgY
// @from(Ln 466746, Col 4)
LdK = L(() => {
    o6();
    g6();
    a1();
    Wr8();
    tP6 = K6(P6(), 1), te = K6(P6(), 1);
    Zr8 = [...pS("default", 1, 2), ...pS("arms-up", 0, 3), ...pS("default", 0, 1), ...pS("default", 1, 2), ...pS("arms-up", 0, 3), ...pS("default", 0, 1)], EdK = [...pS("look-right", 0, 5), ...pS("look-left", 0, 5), ...pS("default", 0, 1)], BgY = [...pS("default", 0, 12), ...pS("look-right", 0, 5), ...pS("look-left", 0, 5)], NdK = [Zr8, EdK], pgY = {
        pose: "default",
        offset: 0
    }, QgY = [...Zr8, ...pS("default", 1, 3)], dgY = {
        jump: Zr8,
        look: EdK,
        celebrate: QgY
    }
})
// @from(Ln 466762, Col 0)
function RdK({
    char: q = EV
}) {
    let [K] = eP6.useState(() => v7().prefersReducedMotion ?? !1), [_, z] = eP6.useState(K), Y = eP6.useRef(null), [A, O] = _O(_ ? null : 50);
    if (eP6.useEffect(() => {
            if (_) return;
            let j = setTimeout(z, ngY, !0);
            return () => clearTimeout(j)
        }, [_]), _) return ee.createElement(u, {
        ref: A
    }, ee.createElement(T, {
        color: igY
    }, q));
    if (Y.current === null) Y.current = O;
    let $ = (O - Y.current) / hdK * 360 % 360;
    return ee.createElement(u, {
        ref: A
    }, ee.createElement(T, {
        color: fR(Uy8($))
    }, q))
}
// @from(Ln 466783, Col 4)
ee
// @from(Ln 466783, Col 8)
eP6
// @from(Ln 466783, Col 13)
hdK = 1500
// @from(Ln 466784, Col 4)
lgY = 2
// @from(Ln 466785, Col 4)
ngY
// @from(Ln 466785, Col 9)
igY
// @from(Ln 466786, Col 4)
SdK = L(() => {
    A3();
    g6();
    a1();
    Bd();
    ee = K6(P6(), 1), eP6 = K6(P6(), 1), ngY = hdK * lgY, igY = fR({
        r: 153,
        g: 153,
        b: 153
    })
})
// @from(Ln 466798, Col 0)
function Q27() {
    return u8("tengu_ochre_hollow", !1)
}
// @from(Ln 466802, Col 0)
function ogY() {
    if (S6(process.env.CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL)) return !0;
    if (lq()) return !1;
    if (!Q27()) return !1;
    if ((H8().fullscreenUpsellSeenCount ?? 0) >= rgY) return !1;
    return !0
}
// @from(Ln 466810, Col 0)
function bdK() {
    let [q] = CdK.useState(ogY);
    return q
}
// @from(Ln 466815, Col 0)
function IdK() {
    let q = 0;
    d8((K) => {
        return q = (K.fullscreenUpsellSeenCount ?? 0) + 1, {
            ...K,
            fullscreenUpsellSeenCount: q
        }
    }), d("tengu_fullscreen_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 466827, Col 0)
function xdK() {
    let q = s(2),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = mw.createElement(RdK, null), q[0] = K;
    else K = q[0];
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = mw.createElement(u, {
        flexDirection: "row"
    }, K, mw.createElement(T, null, mw.createElement(T, {
        color: "autoAccept"
    }, " Try flicker-free rendering"), mw.createElement(T, {
        dimColor: !0
    }, " · /tui fullscreen"))), q[1] = _;
    else _ = q[1];
    return _
}
// @from(Ln 466844, Col 0)
function udK() {
    let q = s(2);
    switch (process.env.CLAUDE_CODE_TUI_JUST_SWITCHED) {
        case "fullscreen": {
            let K;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = mw.createElement(u, {
                flexDirection: "column"
            }, mw.createElement(T, null, mw.createElement(D4, {
                status: "success",
                withSpace: !0
            }), mw.createElement(T, {
                color: "success"
            }, "Using flicker-free rendering"), mw.createElement(T, {
                dimColor: !0
            }, " · go back with /tui default")), mw.createElement(T, {
                dimColor: !0
            }, "  ", "· Click to move your cursor in the text input"), mw.createElement(T, {
                dimColor: !0
            }, "  ", "· Click to expand collapsed tool results"), mw.createElement(T, {
                dimColor: !0
            }, "  ", "· By default, text auto-copies when you select it (/config to change)")), q[0] = K;
            else K = q[0];
            return K
        }
        case "default": {
            let K;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) K = mw.createElement(T, {
                dimColor: !0
            }, "Switched back to the classic renderer"), q[1] = K;
            else K = q[1];
            return K
        }
        default:
            return null
    }
}
// @from(Ln 466880, Col 4)
mw
// @from(Ln 466880, Col 8)
CdK
// @from(Ln 466880, Col 13)
rgY = 3
// @from(Ln 466881, Col 4)
d27 = L(() => {
    o6();
    g6();
    B1();
    C8();
    h1();
    Q8();
    nO();
    Y2();
    SdK();
    mw = K6(P6(), 1), CdK = K6(P6(), 1)
})
// @from(Ln 466894, Col 0)
function agY() {
    let q = Dr8();
    if (q == null || q <= 0) return;
    let _ = H8().passesLastSeenRemaining ?? 0;
    if (q > _) d8((z) => ({
        ...z,
        passesUpsellSeenCount: 0,
        hasVisitedPasses: !1,
        passesLastSeenRemaining: q
    }))
}
// @from(Ln 466906, Col 0)
function sgY() {
    let {
        eligible: q,
        hasCache: K
    } = sx6();
    if (!q || !K) return !1;
    agY();
    let _ = H8();
    if ((_.passesUpsellSeenCount ?? 0) >= 3) return !1;
    if (_.hasVisitedPasses) return !1;
    return !0
}
// @from(Ln 466919, Col 0)
function fr8() {
    let [q] = mdK.useState(tgY);
    return q
}
// @from(Ln 466924, Col 0)
function tgY() {
    return sgY()
}
// @from(Ln 466928, Col 0)
function Gr8() {
    let q = 0;
    d8((K) => {
        return q = (K.passesUpsellSeenCount ?? 0) + 1, {
            ...K,
            passesUpsellSeenCount: q
        }
    }), d("tengu_guest_passes_upsell_shown", {
        seen_count: q
    })
}
// @from(Ln 466940, Col 0)
function BdK() {
    let q = s(1),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let _ = o_6();
        K = q66.createElement(T, {
            dimColor: !0
        }, q66.createElement(T, {
            color: "claude"
        }, "[✻]"), " ", q66.createElement(T, {
            color: "claude"
        }, "[✻]"), " ", q66.createElement(T, {
            color: "claude"
        }, "[✻]"), " ·", " ", _ ? `Share Claude Code and earn ${r_6(_)} of extra usage · /passes` : "3 guest passes at /passes"), q[0] = K
    } else K = q[0];
    return K
}
// @from(Ln 466957, Col 4)
q66
// @from(Ln 466957, Col 9)
mdK
// @from(Ln 466958, Col 4)
c27 = L(() => {
    o6();
    g6();
    C8();
    a_6();
    h1();
    q66 = K6(P6(), 1), mdK = K6(P6(), 1)
})
// @from(Ln 466967, Col 0)
function KUY() {
    if (pq() !== "firstParty") return !1;
    if ((H8().opus47LaunchSeenCount ?? 0) >= egY) return !1;
    return !0
}
// @from(Ln 466973, Col 0)
function vr8() {
    let [q] = FdK.useState(_UY);
    return q
}
// @from(Ln 466978, Col 0)
function _UY() {
    return KUY()
}
// @from(Ln 466982, Col 0)
function Tr8() {
    d8((q) => ({
        ...q,
        opus47LaunchSeenCount: (q.opus47LaunchSeenCount ?? 0) + 1
    })), d("tengu_opus47_launch_shown", {})
}
// @from(Ln 466989, Col 0)
function gdK(q) {
    let K = s(5),
        {
            maxWidth: _
        } = q,
        z, Y;
    if (K[0] !== _) {
        z = Symbol.for("react.early_return_sentinel");
        q: {
            Y = _ ? w5(pdK, _) : pdK;
            let O = qUY.length;
            if (O < Y.length) {
                z = FS.createElement(T, {
                    dimColor: !0
                }, FS.createElement(T, {
                    color: "claude"
                }, Y.slice(0, O)), Y.slice(O));
                break q
            }
        }
        K[0] = _, K[1] = z, K[2] = Y
    } else z = K[1], Y = K[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    let A;
    if (K[3] !== Y) A = FS.createElement(T, {
        dimColor: !0
    }, FS.createElement(T, {
        color: "claude"
    }, Y)), K[3] = Y, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 467022, Col 0)
function UdK() {
    return {
        title: "Opus 4.7 is here",
        lines: [],
        customContent: {
            content: FS.createElement(u, {
                marginY: 1
            }, FS.createElement(T, {
                bold: !0,
                color: "claude"
            }, "Welcome to Opus 4.7 xhigh!")),
            width: 48
        },
        footer: "/effort to tune speed vs. intelligence"
    }
}
// @from(Ln 467038, Col 4)
FS
// @from(Ln 467038, Col 8)
FdK
// @from(Ln 467038, Col 13)
egY = 12
// @from(Ln 467039, Col 4)
pdK = "Welcome to Opus 4.7 xhigh! · /effort to tune speed vs. intelligence"
// @from(Ln 467040, Col 4)
qUY = "Welcome to Opus 4.7 xhigh!"
// @from(Ln 467041, Col 4)
l27 = L(() => {
    o6();
    g6();
    C8();
    h1();
    c7();
    x9();
    FS = K6(P6(), 1), FdK = K6(P6(), 1)
})
// @from(Ln 467051, Col 0)
function QdK() {
    let q = s(55),
        {
            columns: K
        } = s1(),
        _ = M8(YUY),
        z = M8(zUY),
        Y = s2(),
        A = Jn6(Y),
        {
            version: O,
            cwd: w,
            billingType: $,
            agentName: j
        } = Mr8(),
        H = _ ?? j,
        J = fr8(),
        X = sn8(),
        M = process.env.CLAUDE_CODE_TUI_JUST_SWITCHED !== void 0,
        P = bdK() && !M,
        W = vr8(),
        D, Z;
    if (q[0] !== W) D = () => {
        if (W) Tr8()
    }, Z = [W], q[0] = W, q[1] = D, q[2] = Z;
    else D = q[1], Z = q[2];
    x_8.useEffect(D, Z);
    let G, f;
    if (q[3] !== J || q[4] !== W) G = () => {
        if (J && !W) Gr8()
    }, f = [J, W], q[3] = J, q[4] = W, q[5] = G, q[6] = f;
    else G = q[5], f = q[6];
    x_8.useEffect(G, f);
    let v, V;
    if (q[7] !== J || q[8] !== W || q[9] !== X) v = () => {
        if (X && !W && !J) tn8()
    }, V = [X, W, J], q[7] = J, q[8] = W, q[9] = X, q[10] = v, q[11] = V;
    else v = q[10], V = q[11];
    x_8.useEffect(v, V);
    let k, N;
    if (q[12] !== P || q[13] !== J || q[14] !== W || q[15] !== X) k = () => {
        if (P && !W && !J && !X) IdK()
    }, N = [P, W, J, X], q[12] = P, q[13] = J, q[14] = W, q[15] = X, q[16] = k, q[17] = N;
    else k = q[16], N = q[17];
    x_8.useEffect(k, N);
    let R = Math.max(K - 15, 20),
        h = w5(O, Math.max(R - 13, 6)),
        C = jy6(Y, z),
        {
            shouldSplit: x,
            truncatedModel: B,
            truncatedBilling: m
        } = $dK(A + C, $, R),
        S = H ? R - 1 - N1(H) - 3 : R,
        F = b_8(w, Math.max(S, 10)),
        U;
    if (q[18] === Symbol.for("react.memo_cache_sentinel")) U = lq() ? X9.createElement(ydK, null) : X9.createElement(sP6, null), q[18] = U;
    else U = q[18];
    let g;
    if (q[19] === Symbol.for("react.memo_cache_sentinel")) g = X9.createElement(T, {
        bold: !0
    }, "Claude Code"), q[19] = g;
    else g = q[19];
    let c;
    if (q[20] !== h) c = X9.createElement(T, null, g, " ", X9.createElement(T, {
        dimColor: !0
    }, "v", h)), q[20] = h, q[21] = c;
    else c = q[21];
    let n;
    if (q[22] !== x || q[23] !== m || q[24] !== B) n = x ? X9.createElement(X9.Fragment, null, X9.createElement(T, {
        dimColor: !0
    }, B), X9.createElement(T, {
        dimColor: !0
    }, m)) : X9.createElement(T, {
        dimColor: !0
    }, B, " · ", m), q[22] = x, q[23] = m, q[24] = B, q[25] = n;
    else n = q[25];
    let l = H ? `@${H} · ${F}` : F,
        z6;
    if (q[26] !== l) z6 = X9.createElement(T, {
        dimColor: !0
    }, l), q[26] = l, q[27] = z6;
    else z6 = q[27];
    let A6;
    if (q[28] !== W || q[29] !== R) A6 = W && X9.createElement(gdK, {
        maxWidth: R
    }), q[28] = W, q[29] = R, q[30] = A6;
    else A6 = q[30];
    let e;
    if (q[31] !== J || q[32] !== W) e = !W && J && X9.createElement(BdK, null), q[31] = J, q[32] = W, q[33] = e;
    else e = q[33];
    let i;
    if (q[34] !== J || q[35] !== W || q[36] !== X || q[37] !== R) i = !W && !J && X && X9.createElement(en8, {
        maxWidth: R,
        twoLine: !0
    }), q[34] = J, q[35] = W, q[36] = X, q[37] = R, q[38] = i;
    else i = q[38];
    let O6;
    if (q[39] !== c || q[40] !== n || q[41] !== z6 || q[42] !== A6 || q[43] !== e || q[44] !== i) O6 = X9.createElement(u, {
        flexDirection: "row",
        gap: 2,
        alignItems: "center"
    }, U, X9.createElement(u, {
        flexDirection: "column"
    }, c, n, z6, A6, e, i)), q[39] = c, q[40] = n, q[41] = z6, q[42] = A6, q[43] = e, q[44] = i, q[45] = O6;
    else O6 = q[45];
    let J6;
    if (q[46] === Symbol.for("react.memo_cache_sentinel")) J6 = M && X9.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column",
        marginTop: 1
    }, X9.createElement(udK, null)), q[46] = J6;
    else J6 = q[46];
    let $6;
    if (q[47] !== P || q[48] !== J || q[49] !== W || q[50] !== X) $6 = !W && !J && !X && P && X9.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column",
        marginTop: 1
    }, X9.createElement(xdK, null)), q[47] = P, q[48] = J, q[49] = W, q[50] = X, q[51] = $6;
    else $6 = q[51];
    let H6;
    if (q[52] !== O6 || q[53] !== $6) H6 = X9.createElement(zG, null, X9.createElement(u, {
        flexDirection: "column"
    }, O6, J6, $6)), q[52] = O6, q[53] = $6, q[54] = H6;
    else H6 = q[54];
    return H6
}
// @from(Ln 467179, Col 0)
function zUY(q) {
    return q.effortValue
}
// @from(Ln 467183, Col 0)
function YUY(q) {
    return q.agent
}
// @from(Ln 467186, Col 4)
X9
// @from(Ln 467186, Col 8)
x_8
// @from(Ln 467187, Col 4)
ddK = L(() => {
    o6();
    oy();
    I4();
    n5();
    g6();
    N7();
    hf();
    c7();
    nO();
    Pr8();
    Sq();
    f96();
    LdK();
    Wr8();
    d27();
    c27();
    l27();
    r98();
    X9 = K6(P6(), 1), x_8 = K6(P6(), 1)
})
// @from(Ln 467209, Col 0)
function n27() {
    let q = m_8.useMemo(wUY, []),
        K = m_8.useMemo(() => H8().lastShownEmergencyTip, []),
        _ = q.tip && q.tip !== K;
    if (m_8.useEffect(() => {
            if (_) d8((z) => {
                if (z.lastShownEmergencyTip === q.tip) return z;
                return {
                    ...z,
                    lastShownEmergencyTip: q.tip
                }
            })
        }, [_, q.tip]), !_) return null;
    return u_8.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, u_8.createElement(T, {
        ...q.color === "warning" ? {
            color: "warning"
        } : q.color === "error" ? {
            color: "error"
        } : {
            dimColor: !0
        }
    }, q.tip))
}
// @from(Ln 467236, Col 0)
function wUY() {
    return Fv(AUY, OUY)
}
// @from(Ln 467239, Col 4)
u_8
// @from(Ln 467239, Col 9)
m_8
// @from(Ln 467239, Col 14)
AUY = "tengu-top-of-feed-tip"
// @from(Ln 467240, Col 4)
OUY
// @from(Ln 467241, Col 4)
cdK = L(() => {
    g6();
    B1();
    h1();
    u_8 = K6(P6(), 1), m_8 = K6(P6(), 1);
    OUY = {
        tip: "",
        color: "dim"
    }
})
// @from(Ln 467251, Col 4)
ndK = {}
// @from(Ln 467256, Col 0)
function $UY() {
    let q = s(32),
        [K] = ldK.useState(XUY),
        {
            channels: _,
            disabled: z,
            noAuth: Y,
            policyBlocked: A,
            list: O,
            unmatched: w
        } = K;
    if (_.length === 0) return null;
    let $ = _.some(JUY),
        j = tO8() && $ ? "Channels" : tO8() ? "--dangerously-load-development-channels" : "--channels";
    if (z) {
        let P;
        if (q[0] !== j || q[1] !== O) P = hO.createElement(T, {
            color: "error"
        }, j, " ignored (", O, ")"), q[0] = j, q[1] = O, q[2] = P;
        else P = q[2];
        let W;
        if (q[3] === Symbol.for("react.memo_cache_sentinel")) W = hO.createElement(T, {
            dimColor: !0
        }, "Channels are not currently available"), q[3] = W;
        else W = q[3];
        let D;
        if (q[4] !== P) D = hO.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, P, W), q[4] = P, q[5] = D;
        else D = q[5];
        return D
    }
    if (Y) {
        let P;
        if (q[6] !== j || q[7] !== O) P = hO.createElement(T, {
            color: "error"
        }, j, " ignored (", O, ")"), q[6] = j, q[7] = O, q[8] = P;
        else P = q[8];
        let W;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) W = hO.createElement(T, {
            dimColor: !0
        }, "Channels require claude.ai authentication · run /login, then restart"), q[9] = W;
        else W = q[9];
        let D;
        if (q[10] !== P) D = hO.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, P, W), q[10] = P, q[11] = D;
        else D = q[11];
        return D
    }
    if (A) {
        let P;
        if (q[12] !== j || q[13] !== O) P = hO.createElement(T, {
            color: "error"
        }, j, " blocked by org policy (", O, ")"), q[12] = j, q[13] = O, q[14] = P;
        else P = q[14];
        let W, D;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) W = hO.createElement(T, {
            dimColor: !0
        }, "Inbound messages will be silently dropped"), D = hO.createElement(T, {
            dimColor: !0
        }, "Have an administrator set channelsEnabled: true in managed settings to enable"), q[15] = W, q[16] = D;
        else W = q[15], D = q[16];
        let Z;
        if (q[17] !== w) Z = w.map(HUY), q[17] = w, q[18] = Z;
        else Z = q[18];
        let G;
        if (q[19] !== P || q[20] !== Z) G = hO.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, P, W, D, Z), q[19] = P, q[20] = Z, q[21] = G;
        else G = q[21];
        return G
    }
    let H;
    if (q[22] !== O) H = hO.createElement(T, {
        color: "error"
    }, "Listening for channel messages from: ", O), q[22] = O, q[23] = H;
    else H = q[23];
    let J;
    if (q[24] !== j) J = hO.createElement(T, {
        dimColor: !0
    }, "Experimental · inbound messages will be pushed into this session, this carries prompt injection risks. Restart Claude Code without ", j, " to disable."), q[24] = j, q[25] = J;
    else J = q[25];
    let X;
    if (q[26] !== w) X = w.map(jUY), q[26] = w, q[27] = X;
    else X = q[27];
    let M;
    if (q[28] !== H || q[29] !== J || q[30] !== X) M = hO.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, H, J, X), q[28] = H, q[29] = J, q[30] = X, q[31] = M;
    else M = q[31];
    return M
}
// @from(Ln 467354, Col 0)
function jUY(q) {
    return hO.createElement(T, {
        key: `${B_8(q.entry)}:${q.why}`,
        color: "warning"
    }, B_8(q.entry), " · ", q.why)
}
// @from(Ln 467361, Col 0)
function HUY(q) {
    return hO.createElement(T, {
        key: `${B_8(q.entry)}:${q.why}`,
        color: "warning"
    }, B_8(q.entry), " · ", q.why)
}
// @from(Ln 467368, Col 0)
function JUY(q) {
    return !q.dev
}
// @from(Ln 467372, Col 0)
function XUY() {
    let q = qj();
    if (q.length === 0) return {
        channels: q,
        disabled: !1,
        noAuth: !1,
        policyBlocked: !1,
        list: "",
        unmatched: []
    };
    let K = q.map(B_8).join(", "),
        _ = MK(),
        z = _ === "team" || _ === "enterprise",
        Y = E1("policySettings"),
        A = sO7(_, Y?.allowedChannelPlugins);
    return {
        channels: q,
        disabled: !mP6(),
        noAuth: !o7()?.accessToken,
        policyBlocked: z && Y?.channelsEnabled !== !0,
        list: K,
        unmatched: MUY(q, A)
    }
}
// @from(Ln 467397, Col 0)
function B_8(q) {
    return q.kind === "plugin" ? `plugin:${q.name}@${q.marketplace}` : `server:${q.name}`
}
// @from(Ln 467401, Col 0)
function MUY(q, K) {
    let _ = ["enterprise", "user", "project", "local"],
        z = new Set;
    for (let $ of _)
        for (let j of Object.keys(SJ($).servers)) z.add(j);
    let Y = new Set(Object.keys(OZ().plugins)),
        {
            entries: A,
            source: O
        } = K,
        w = [];
    for (let $ of q) {
        if ($.kind === "server") {
            if (!z.has($.name)) w.push({
                entry: $,
                why: "no MCP server configured with that name"
            });
            if (!$.dev) w.push({
                entry: $,
                why: "server: entries need --dangerously-load-development-channels"
            });
            continue
        }
        if (!Y.has(`${$.name}@${$.marketplace}`)) w.push({
            entry: $,
            why: "plugin not installed"
        });
        if (!$.dev && !A.some((j) => j.plugin === $.name && j.marketplace === $.marketplace)) w.push({
            entry: $,
            why: O === "org" ? "not on your org's approved channels list" : "not on the approved channels allowlist"
        })
    }
    return w
}
// @from(Ln 467435, Col 4)
hO
// @from(Ln 467435, Col 8)
ldK
// @from(Ln 467436, Col 4)
idK = L(() => {
    o6();
    y8();
    g6();
    __8();
    O_8();
    rD();
    T7();
    yD();
    a1();
    hO = K6(P6(), 1), ldK = K6(P6(), 1)
})
// @from(Ln 467449, Col 0)
function rdK() {
    let q = s(94),
        K = wdK(),
        _ = H8().oauthAccount?.displayName ?? "",
        {
            columns: z
        } = s1(),
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = l24(), q[0] = Y;
    else Y = q[0];
    let A = Y,
        O;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = Z7.isSandboxingEnabled(), q[1] = O;
    else O = q[1];
    let w = O,
        $ = fr8(),
        j = sn8(),
        H = vr8(),
        J = M8(ZUY),
        X = M8(DUY),
        M = H8(),
        P;
    try {
        P = jdK(3)
    } catch {
        P = []
    }
    let [W] = qW6.useState(() => {
        let i6 = v7().companyAnnouncements;
        if (!i6 || i6.length === 0) return;
        return M.numStartups === 1 ? i6[0] : i6[Math.floor(Math.random() * i6.length)]
    }), {
        hasReleaseNotes: D
    } = HQK(M.lastReleaseNotesSeen), Z;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) Z = () => {
        if (H8().lastReleaseNotesSeen === {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION) return;
        if (d8(WUY), A) n24()
    }, q[2] = Z;
    else Z = q[2];
    let G;
    if (q[3] !== M) G = [M, A], q[3] = M, q[4] = G;
    else G = q[4];
    qW6.useEffect(Z, G);
    let f;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) f = !D && !A && !S6(process.env.CLAUDE_CODE_FORCE_FULL_LOGO), q[5] = f;
    else f = q[5];
    let v = f,
        V, k;
    if (q[6] !== $ || q[7] !== H) V = () => {
        if ($ && !A && !H && !v) Gr8()
    }, k = [$, A, H, v], q[6] = $, q[7] = H, q[8] = V, q[9] = k;
    else V = q[8], k = q[9];
    qW6.useEffect(V, k);
    let N, R;
    if (q[10] !== $ || q[11] !== H || q[12] !== j) N = () => {
        if (j && !A && !H && !$ && !v) tn8()
    }, R = [j, A, H, $, v], q[10] = $, q[11] = H, q[12] = j, q[13] = N, q[14] = R;
    else N = q[13], R = q[14];
    qW6.useEffect(N, R);
    let h, C;
    if (q[15] !== H) C = () => {
        if (H && !A && !v) Tr8()
    }, h = [H, A, v], q[15] = H, q[16] = h, q[17] = C;
    else h = q[16], C = q[17];
    qW6.useEffect(C, h);
    let x = s2(),
        B = Jn6(x),
        {
            version: m,
            cwd: S,
            billingType: F,
            agentName: U
        } = Mr8(),
        g = J ?? U,
        c = jy6(x, X),
        n = B + c,
        l;
    if (q[18] !== n) l = w5(n, i27 - 20), q[18] = n, q[19] = l;
    else l = q[19];
    let z6 = l;
    if (!D && !A && !S6(process.env.CLAUDE_CODE_FORCE_FULL_LOGO)) {
        let i6, v8, f1, g8, w6, D6;
        if (q[20] === Symbol.for("react.memo_cache_sentinel")) i6 = V7.createElement(QdK, null), v8 = ex6 && V7.createElement(ex6.ChannelsNotice, null), f1 = V7.createElement(r27, null), g8 = MV() && V7.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, V7.createElement(T, {
            color: "warning"
        }, "Debug mode enabled"), V7.createElement(T, {
            dimColor: !0
        }, "Logging to: ", SC() ? "stderr" : yY6())), w6 = V7.createElement(n27, null), D6 = process.env.CLAUDE_CODE_TMUX_SESSION && V7.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, V7.createElement(T, {
            dimColor: !0
        }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), V7.createElement(T, {
            dimColor: !0
        }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), q[20] = i6, q[21] = v8, q[22] = f1, q[23] = g8, q[24] = w6, q[25] = D6;
        else i6 = q[20], v8 = q[21], f1 = q[22], g8 = q[23], w6 = q[24], D6 = q[25];
        let U6;
        if (q[26] !== W || q[27] !== M) U6 = W && V7.createElement(u, {
            paddingLeft: 2,
            flexDirection: "column"
        }, !process.env.IS_DEMO && M.oauthAccount?.organizationName && V7.createElement(T, {
            dimColor: !0
        }, "Message from ", M.oauthAccount.organizationName, ":"), V7.createElement(T, null, W)), q[26] = W, q[27] = M, q[28] = U6;
        else U6 = q[28];
        let F6, z8, l6;
        if (q[29] === Symbol.for("react.memo_cache_sentinel")) F6 = !1, z8 = !1, l6 = !1, q[29] = F6, q[30] = z8, q[31] = l6;
        else F6 = q[29], z8 = q[30], l6 = q[31];
        let j8;
        if (q[32] !== U6) j8 = V7.createElement(V7.Fragment, null, i6, v8, f1, g8, w6, D6, U6, F6, z8, l6), q[32] = U6, q[33] = j8;
        else j8 = q[33];
        return j8
    }
    let A6 = zdK(z),
        e = Ad(H8().theme),
        i = ` ${d7("claude",e)("Claude Code")} ${d7("inactive",e)(`v${m}`)} `,
        O6 = d7("claude", e)(" Claude Code ");
    if (A6 === "compact") {
        let i6 = Xr8(_);
        if (N1(i6) > z - 4) {
            let f8;
            if (q[34] === Symbol.for("react.memo_cache_sentinel")) f8 = Xr8(null), q[34] = f8;
            else f8 = q[34];
            i6 = f8
        }
        let v8 = g ? z - 4 - 1 - N1(g) - 3 : z - 4,
            f1 = b_8(S, Math.max(v8, 10)),
            g8;
        if (q[35] !== O6) g8 = {
            content: O6,
            position: "top",
            align: "start",
            offset: 1
        }, q[35] = O6, q[36] = g8;
        else g8 = q[36];
        let w6;
        if (q[37] === Symbol.for("react.memo_cache_sentinel")) w6 = V7.createElement(u, {
            marginY: 1
        }, V7.createElement(sP6, null)), q[37] = w6;
        else w6 = q[37];
        let D6;
        if (q[38] !== z6) D6 = V7.createElement(T, {
            dimColor: !0
        }, z6), q[38] = z6, q[39] = D6;
        else D6 = q[39];
        let U6, F6;
        if (q[40] === Symbol.for("react.memo_cache_sentinel")) U6 = ex6 && V7.createElement(ex6.ChannelsNotice, null), F6 = V7.createElement(r27, null), q[40] = U6, q[41] = F6;
        else U6 = q[40], F6 = q[41];
        let z8;
        if (q[42] !== w) z8 = w && V7.createElement(u, {
            marginTop: 1,
            flexDirection: "column"
        }, V7.createElement(T, {
            color: "warning"
        }, "Your bash commands will be sandboxed. Disable with /sandbox.")), q[42] = w, q[43] = z8;
        else z8 = q[43];
        let l6, j8;
        if (q[44] === Symbol.for("react.memo_cache_sentinel")) l6 = !1, j8 = !1, q[44] = l6, q[45] = j8;
        else l6 = q[44], j8 = q[45];
        return V7.createElement(V7.Fragment, null, V7.createElement(zG, null, V7.createElement(u, {
            flexDirection: "column",
            borderStyle: "round",
            borderColor: "claude",
            borderText: g8,
            paddingX: 1,
            paddingY: 1,
            alignItems: "center",
            width: z
        }, V7.createElement(T, {
            bold: !0
        }, i6), w6, D6, V7.createElement(T, {
            dimColor: !0
        }, F), V7.createElement(T, {
            dimColor: !0
        }, g ? `@${g} · ${f1}` : f1))), U6, F6, z8, l6, j8)
    }
    let J6 = Xr8(_),
        $6 = !process.env.IS_DEMO && M.oauthAccount?.organizationName ? `${z6} · ${F} · ${M.oauthAccount.organizationName}` : `${z6} · ${F}`,
        H6 = g ? i27 - 1 - N1(g) - 3 : i27,
        q6 = b_8(S, Math.max(H6, 10)),
        o = g ? `@${g} · ${q6}` : q6,
        _6 = AdK(J6, o, $6),
        {
            leftWidth: r,
            rightWidth: t
        } = YdK(z, A6, _6),
        Y6 = zG,
        X6 = u,
        M6 = "column",
        W6 = "round",
        V6 = "claude",
        f6;
    if (q[46] !== i) f6 = {
        content: i,
        position: "top",
        align: "start",
        offset: 3
    }, q[46] = i, q[47] = f6;
    else f6 = q[47];
    let G6 = u,
        k6 = A6 === "horizontal" ? "row" : "column",
        T6 = 1,
        v6 = 1,
        L6;
    if (q[48] !== J6) L6 = V7.createElement(u, {
        marginTop: 1
    }, V7.createElement(T, {
        bold: !0
    }, J6)), q[48] = J6, q[49] = L6;
    else L6 = q[49];
    let y6;
    if (q[50] === Symbol.for("react.memo_cache_sentinel")) y6 = V7.createElement(sP6, null), q[50] = y6;
    else y6 = q[50];
    let c6;
    if (q[51] !== $6) c6 = V7.createElement(T, {
        dimColor: !0
    }, $6), q[51] = $6, q[52] = c6;
    else c6 = q[52];
    let Z8;
    if (q[53] !== o) Z8 = V7.createElement(T, {
        dimColor: !0
    }, o), q[53] = o, q[54] = Z8;
    else Z8 = q[54];
    let N8;
    if (q[55] !== c6 || q[56] !== Z8) N8 = V7.createElement(u, {
        flexDirection: "column",
        alignItems: "center"
    }, c6, Z8), q[55] = c6, q[56] = Z8, q[57] = N8;
    else N8 = q[57];
    let R6;
    if (q[58] !== r || q[59] !== L6 || q[60] !== N8) R6 = V7.createElement(u, {
        flexDirection: "column",
        width: r,
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 9
    }, L6, y6, N8), q[58] = r, q[59] = L6, q[60] = N8, q[61] = R6;
    else R6 = q[61];
    let p6;
    if (q[62] !== A6) p6 = A6 === "horizontal" && V7.createElement(u, {
        height: "100%",
        borderStyle: "single",
        borderColor: "claude",
        borderDimColor: !0,
        borderTop: !1,
        borderBottom: !1,
        borderLeft: !1
    }), q[62] = A6, q[63] = p6;
    else p6 = q[63];
    let q8 = A6 === "horizontal" && V7.createElement(MdK, {
            feeds: A ? [TdK(cm1()), tx6(K)] : H ? [tx6(K), UdK()] : $ ? [tx6(K), VdK()] : j ? [tx6(K), IxK()] : [tx6(K), vdK(P)],
            maxWidth: t
        }),
        L8;
    if (q[64] !== G6 || q[65] !== k6 || q[66] !== R6 || q[67] !== p6 || q[68] !== q8) L8 = V7.createElement(G6, {
        flexDirection: k6,
        paddingX: T6,
        gap: v6
    }, R6, p6, q8), q[64] = G6, q[65] = k6, q[66] = R6, q[67] = p6, q[68] = q8, q[69] = L8;
    else L8 = q[69];
    let w8;
    if (q[70] !== X6 || q[71] !== f6 || q[72] !== L8) w8 = V7.createElement(X6, {
        flexDirection: M6,
        borderStyle: W6,
        borderColor: V6,
        borderText: f6
    }, L8), q[70] = X6, q[71] = f6, q[72] = L8, q[73] = w8;
    else w8 = q[73];
    let x8;
    if (q[74] !== Y6 || q[75] !== w8) x8 = V7.createElement(Y6, null, w8), q[74] = Y6, q[75] = w8, q[76] = x8;
    else x8 = q[76];
    let a6, D8, Q6, W8, G8;
    if (q[77] === Symbol.for("react.memo_cache_sentinel")) a6 = ex6 && V7.createElement(ex6.ChannelsNotice, null), D8 = V7.createElement(r27, null), Q6 = MV() && V7.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, V7.createElement(T, {
        color: "warning"
    }, "Debug mode enabled"), V7.createElement(T, {
        dimColor: !0
    }, "Logging to: ", SC() ? "stderr" : yY6())), W8 = V7.createElement(n27, null), G8 = process.env.CLAUDE_CODE_TMUX_SESSION && V7.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, V7.createElement(T, {
        dimColor: !0
    }, "tmux session: ", process.env.CLAUDE_CODE_TMUX_SESSION), V7.createElement(T, {
        dimColor: !0
    }, process.env.CLAUDE_CODE_TMUX_PREFIX_CONFLICTS ? `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} ${process.env.CLAUDE_CODE_TMUX_PREFIX} d (press prefix twice - Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX})` : `Detach: ${process.env.CLAUDE_CODE_TMUX_PREFIX} d`)), q[77] = a6, q[78] = D8, q[79] = Q6, q[80] = W8, q[81] = G8;
    else a6 = q[77], D8 = q[78], Q6 = q[79], W8 = q[80], G8 = q[81];
    let s6;
    if (q[82] !== W || q[83] !== M) s6 = W && V7.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, !process.env.IS_DEMO && M.oauthAccount?.organizationName && V7.createElement(T, {
        dimColor: !0
    }, "Message from ", M.oauthAccount.organizationName, ":"), V7.createElement(T, null, W)), q[82] = W, q[83] = M, q[84] = s6;
    else s6 = q[84];
    let u6;
    if (q[85] !== w) u6 = w && V7.createElement(u, {
        paddingLeft: 2,
        flexDirection: "column"
    }, V7.createElement(T, {
        color: "warning"
    }, "Your bash commands will be sandboxed. Disable with /sandbox.")), q[85] = w, q[86] = u6;
    else u6 = q[86];
    let h6, _8, R8;
    if (q[87] === Symbol.for("react.memo_cache_sentinel")) h6 = !1, _8 = !1, R8 = !1, q[87] = h6, q[88] = _8, q[89] = R8;
    else h6 = q[87], _8 = q[88], R8 = q[89];
    let x6;
    if (q[90] !== x8 || q[91] !== s6 || q[92] !== u6) x6 = V7.createElement(V7.Fragment, null, x8, a6, D8, Q6, W8, G8, s6, u6, h6, _8, R8), q[90] = x8, q[91] = s6, q[92] = u6, q[93] = x6;
    else x6 = q[93];
    return x6
}
// @from(Ln 467770, Col 0)
function WUY(q) {
    if (q.lastReleaseNotesSeen === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION) return q;
    return {
        ...q,
        lastReleaseNotesSeen: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION
    }
}
// @from(Ln 467792, Col 0)
function DUY(q) {
    return q.effortValue
}
// @from(Ln 467796, Col 0)
function ZUY(q) {
    return q.agent
}
// @from(Ln 467800, Col 0)
function r27() {
    let q = s(5),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) K = ["DISABLE_PROMPT_CACHING", "DISABLE_PROMPT_CACHING_HAIKU", "DISABLE_PROMPT_CACHING_OPUS", "DISABLE_PROMPT_CACHING_SONNET"], q[0] = K;
    else K = q[0];
    let _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = K.filter(fUY), q[1] = _;
    else _ = q[1];
    let z = _;
    if (z.length === 0) return null;
    let Y;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) Y = V7.createElement(T, {
        color: "error"
    }, "● "), q[2] = Y;
    else Y = q[2];
    let A;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) A = V7.createElement(T, {
        color: "error"
    }, "Prompt caching disabled via ", z.join(", "), ". This will impact latency and token costs."), q[3] = A;
    else A = q[3];
    let O;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) O = V7.createElement(u, {
        flexDirection: "row"
    }, Y, V7.createElement(u, {
        flexDirection: "column"
    }, A, V7.createElement(T, {
        dimColor: !0
    }, "We highly recommend disabling", " ", z.length === 1 ? "this environment variable" : "these environment variables"))), q[4] = O;
    else O = q[4];
    return O
}
// @from(Ln 467832, Col 0)
function fUY(q) {
    return S6(process.env[q])
}
// @from(Ln 467835, Col 4)
V7
// @from(Ln 467835, Col 8)
qW6
// @from(Ln 467835, Col 13)
ex6
// @from(Ln 467835, Col 18)
i27 = 50
// @from(Ln 467836, Col 4)
odK = L(() => {
    o6();
    g6();
    I4();
    n5();
    Pr8();
    c7();
    Wr8();
    PdK();
    kdK();
    h1();
    a1();
    K8();
    hs6();
    ddK();
    f96();
    ix6();
    Q8();
    cdK();
    yY();
    c27();
    r98();
    l27();
    N7();
    hf();
    oy();
    Sq();
    V7 = K6(P6(), 1), qW6 = K6(P6(), 1), ex6 = (idK(), B7(ndK))
})
// @from(Ln 467866, Col 0)
function adK(q) {
    let K = s(5),
        {
            message: _,
            isTranscriptMode: z
        } = q;
    if (!(z && _.type === "assistant" && _.message.model && _.message.content.some(GUY))) return null;
    let A = N1(_.message.model) + 8,
        O;
    if (K[0] !== _.message.model) O = o27.default.createElement(T, {
        dimColor: !0
    }, _.message.model), K[0] = _.message.model, K[1] = O;
    else O = K[1];
    let w;
    if (K[2] !== A || K[3] !== O) w = o27.default.createElement(u, {
        minWidth: A
    }, O), K[2] = A, K[3] = O, K[4] = w;
    else w = K[4];
    return w
}
// @from(Ln 467887, Col 0)
function GUY(q) {
    return q.type === "text"
}
// @from(Ln 467890, Col 4)
o27
// @from(Ln 467891, Col 4)
sdK = L(() => {
    o6();
    n5();
    g6();
    o27 = K6(P6(), 1)
})
// @from(Ln 467898, Col 0)
function tdK(q) {
    let K = s(10),
        {
            message: _,
            isTranscriptMode: z
        } = q;
    if (!(z && _.timestamp && _.type === "assistant" && _.message.content.some(vUY))) return null;
    let A, O, w;
    if (K[0] !== _.timestamp) O = new Date(_.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: !0
    }), A = u, w = N1(O), K[0] = _.timestamp, K[1] = A, K[2] = O, K[3] = w;
    else A = K[1], O = K[2], w = K[3];
    let $;
    if (K[4] !== O) $ = a27.default.createElement(T, {
        dimColor: !0
    }, O), K[4] = O, K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] !== A || K[7] !== w || K[8] !== $) j = a27.default.createElement(A, {
        minWidth: w
    }, $), K[6] = A, K[7] = w, K[8] = $, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 467925, Col 0)
function vUY(q) {
    return q.type === "text"
}
// @from(Ln 467928, Col 4)
a27
// @from(Ln 467929, Col 4)
edK = L(() => {
    o6();
    n5();
    g6();
    a27 = K6(P6(), 1)
})
// @from(Ln 467936, Col 0)
function qcK(q, K, _, z) {
    for (let Y = K + 1; Y < q.length; Y++) {
        let A = q[Y];
        if (A?.type === "assistant") {
            let O = A.message.content[0];
            if (O?.type === "thinking" || O?.type === "redacted_thinking") continue;
            if (O?.type === "tool_use") {
                if (V_6(O.name, O.input, _).isCollapsible) continue;
                if (z.has(O.id)) continue
            }
            return !0
        }
        if (A?.type === "system" || A?.type === "attachment") continue;
        if (A?.type === "user") {
            if (A.message.content[0]?.type === "tool_result") continue
        }
        if (A?.type === "grouped_tool_use") {
            let O = A.messages[0]?.message.content[0]?.input;
            if (V_6(A.toolName, O, _).isCollapsible) continue
        }
        return !0
    }
    return !1
}
// @from(Ln 467961, Col 0)
function TUY(q) {
    let K = s(64),
        {
            message: _,
            isUserContinuation: z,
            hasContentAfter: Y,
            tools: A,
            commands: O,
            verbose: w,
            inProgressToolUseIDs: $,
            streamingToolUseIDs: j,
            screen: H,
            canAnimate: J,
            onOpenRateLimitOptions: X,
            lastThinkingBlockId: M,
            latestBashOutputUUID: P,
            columns: W,
            isLoading: D,
            lookups: Z
        } = q,
        G = H === "transcript",
        f = _.type === "grouped_tool_use",
        v = _.type === "collapsed_read_search",
        V;
    if (K[0] !== Y || K[1] !== $ || K[2] !== v || K[3] !== D || K[4] !== _) V = v && (OY7(_, $) || D && !Y), K[0] = Y, K[1] = $, K[2] = v, K[3] = D, K[4] = _, K[5] = V;
    else V = K[5];
    let k = V,
        N;
    if (K[6] !== v || K[7] !== f || K[8] !== _) N = f ? _.displayMessage : v ? lRK(_) : _, K[6] = v, K[7] = f, K[8] = _, K[9] = N;
    else N = K[9];
    let R = N,
        h;
    if (K[10] !== v || K[11] !== f || K[12] !== Z || K[13] !== _) h = f || v ? [] : UCK(_, Z), K[10] = v, K[11] = f, K[12] = Z, K[13] = _, K[14] = h;
    else h = K[14];
    let C = h,
        x;
    if (K[15] !== $ || K[16] !== v || K[17] !== f || K[18] !== Z || K[19] !== _ || K[20] !== H || K[21] !== j) {
        let A6 = f || v ? Dn8 : gCK(_, Z);
        x = zcK(_, j, $, A6, H, Z), K[15] = $, K[16] = v, K[17] = f, K[18] = Z, K[19] = _, K[20] = H, K[21] = j, K[22] = x
    } else x = K[22];
    let B = x,
        m = !1;
    if (J)
        if (f) {
            let A6;
            if (K[23] !== $ || K[24] !== _.messages) {
                let e;
                if (K[26] !== $) e = (i) => {
                    let O6 = i.message.content[0];
                    return O6?.type === "tool_use" && $.has(O6.id)
                }, K[26] = $, K[27] = e;
                else e = K[27];
                A6 = _.messages.some(e), K[23] = $, K[24] = _.messages, K[25] = A6
            } else A6 = K[25];
            m = A6
        } else if (v) {
        let A6;
        if (K[28] !== $ || K[29] !== _) A6 = OY7(_, $), K[28] = $, K[29] = _, K[30] = A6;
        else A6 = K[30];
        m = A6
    } else {
        let A6;
        if (K[31] !== $ || K[32] !== _) {
            let e = Ue(_);
            A6 = !e || $.has(e), K[31] = $, K[32] = _, K[33] = A6
        } else A6 = K[33];
        m = A6
    }
    let S;
    if (K[34] !== R || K[35] !== G) S = G && R.type === "assistant" && R.message.content.some(VUY) && (R.timestamp || R.message.model), K[34] = R, K[35] = G, K[36] = S;
    else S = K[36];
    let F = S,
        U = !F,
        g = F ? void 0 : W,
        c;
    if (K[37] !== O || K[38] !== $ || K[39] !== k || K[40] !== B || K[41] !== G || K[42] !== z || K[43] !== M || K[44] !== P || K[45] !== Z || K[46] !== _ || K[47] !== X || K[48] !== C || K[49] !== m || K[50] !== U || K[51] !== g || K[52] !== A || K[53] !== w) c = TG.createElement(Ku, {
        message: _,
        lookups: Z,
        addMargin: U,
        containerWidth: g,
        tools: A,
        commands: O,
        verbose: w,
        inProgressToolUseIDs: $,
        progressMessagesForMessage: C,
        shouldAnimate: m,
        shouldShowDot: !0,
        isTranscriptMode: G,
        isStatic: B,
        onOpenRateLimitOptions: X,
        isActiveCollapsedGroup: k,
        isUserContinuation: z,
        lastThinkingBlockId: M,
        latestBashOutputUUID: P
    }), K[37] = O, K[38] = $, K[39] = k, K[40] = B, K[41] = G, K[42] = z, K[43] = M, K[44] = P, K[45] = Z, K[46] = _, K[47] = X, K[48] = C, K[49] = m, K[50] = U, K[51] = g, K[52] = A, K[53] = w, K[54] = c;
    else c = K[54];
    let n = c;
    if (!F) {
        let A6;
        if (K[55] !== n) A6 = TG.createElement(zG, null, n), K[55] = n, K[56] = A6;
        else A6 = K[56];
        return A6
    }
    let l;
    if (K[57] !== R || K[58] !== G) l = TG.createElement(u, {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 1,
        marginTop: 1
    }, TG.createElement(tdK, {
        message: R,
        isTranscriptMode: G
    }), TG.createElement(adK, {
        message: R,
        isTranscriptMode: G
    })), K[57] = R, K[58] = G, K[59] = l;
    else l = K[59];
    let z6;
    if (K[60] !== W || K[61] !== n || K[62] !== l) z6 = TG.createElement(zG, null, TG.createElement(u, {
        width: W,
        flexDirection: "column"
    }, l, n)), K[60] = W, K[61] = n, K[62] = l, K[63] = z6;
    else z6 = K[63];
    return z6
}
// @from(Ln 468087, Col 0)
function VUY(q) {
    return q.type === "text"
}
// @from(Ln 468091, Col 0)
function kUY(q, K) {
    if (q.type === "grouped_tool_use") return q.messages.some((z) => {
        let Y = z.message.content[0];
        return Y?.type === "tool_use" && K.has(Y.id)
    });
    if (q.type === "collapsed_read_search") return Kb6(q).some((Y) => K.has(Y));
    let _ = Ue(q);
    return !!_ && K.has(_)
}
// @from(Ln 468101, Col 0)
function NUY(q, K) {
    if (q.type === "grouped_tool_use") return q.messages.every((z) => {
        let Y = z.message.content[0];
        return Y?.type === "tool_use" && K.has(Y.id)
    });
    if (q.type === "collapsed_read_search") return Kb6(q).every((Y) => K.has(Y));
    if (q.type === "assistant") {
        let z = q.message.content[0];
        if (z?.type === "server_tool_use") return K.has(z.id)
    }
    let _ = Ue(q);
    return !_ || K.has(_)
}
// @from(Ln 468115, Col 0)
function EUY(q, K) {
    if (q.message !== K.message) return !1;
    if (q.screen !== K.screen) return !1;
    if (q.verbose !== K.verbose) return !1;
    if (q.message.type === "collapsed_read_search" && K.screen !== "transcript") return !1;
    if (q.columns !== K.columns) return !1;
    let _ = q.latestBashOutputUUID === q.message.uuid,
        z = K.latestBashOutputUUID === K.message.uuid;
    if (_ !== z) return !1;
    if (q.lastThinkingBlockId !== K.lastThinkingBlockId && yq7(K.message)) return !1;
    let Y = kUY(q.message, q.streamingToolUseIDs),
        A = NUY(q.message, q.lookups.resolvedToolUseIDs);
    if (Y || !A) return !1;
    return !0
}
// @from(Ln 468130, Col 4)
TG
// @from(Ln 468130, Col 8)
KcK
// @from(Ln 468131, Col 4)
_cK = L(() => {
    o6();
    g6();
    Bt();
    _7();
    _b6();
    sdK();
    p_8();
    edK();
    f96();
    TG = K6(P6(), 1);
    KcK = TG.memo(TUY, EUY)
})
// @from(Ln 468145, Col 0)
function Vr8(q) {
    return q.type === "attachment" && LUY.has(q.attachment.type)
}
// @from(Ln 468148, Col 4)
yUY
// @from(Ln 468148, Col 9)
LUY
// @from(Ln 468149, Col 4)
s27 = L(() => {
    yUY = ["hook_success", "hook_additional_context", "hook_cancelled", "command_permissions", "agent_mention", "budget_usd", "critical_system_reminder", "edited_image_file", "edited_text_file", "opened_file_in_ide", "output_style", "plan_mode", "plan_mode_exit", "plan_mode_reentry", "structured_output", "team_context", "todo_reminder", "context_efficiency", "deferred_tools_delta", "mcp_instructions_delta", "token_usage", "ultrathink_effort", "max_turns_reached", "task_reminder", "auto_mode", "auto_mode_exit", "output_token_usage", "verify_plan_reminder", "current_session_memory", "date_change"], LUY = new Set(yUY)
})
// @from(Ln 468153, Col 0)
function kr8(q) {
    let K = s(9),
        {
            status: _,
            children: z
        } = q,
        {
            color: Y
        } = kB1[_],
        A;
    if (K[0] !== _) A = Pg.createElement(u, {
        width: 2,
        flexShrink: 0
    }, Pg.createElement(D4, {
        status: _
    })), K[0] = _, K[1] = A;
    else A = K[1];
    let O = !Y,
        w;
    if (K[2] !== z || K[3] !== Y || K[4] !== O) w = Pg.createElement(u, {
        flexGrow: 1,
        flexShrink: 1
    }, Pg.createElement(T, {
        color: Y,
        dimColor: O
    }, z)), K[2] = z, K[3] = Y, K[4] = O, K[5] = w;
    else w = K[5];
    let $;
    if (K[6] !== A || K[7] !== w) $ = Pg.createElement(u, {
        flexDirection: "row"
    }, A, w), K[6] = A, K[7] = w, K[8] = $;
    else $ = K[8];
    return $
}
// @from(Ln 468187, Col 4)
Pg
// @from(Ln 468188, Col 4)
YcK = L(() => {
    o6();
    g6();
    Y2();
    Pg = K6(P6(), 1)
})
// @from(Ln 468198, Col 0)
function AcK(q) {
    return uUY.filter((K) => K.isActive(q))
}
// @from(Ln 468201, Col 4)
N3
// @from(Ln 468201, Col 8)
RUY
// @from(Ln 468201, Col 13)
SUY
// @from(Ln 468201, Col 18)
CUY
// @from(Ln 468201, Col 23)
bUY
// @from(Ln 468201, Col 28)
IUY
// @from(Ln 468201, Col 33)
xUY
// @from(Ln 468201, Col 38)
uUY
// @from(Ln 468202, Col 4)
OcK = L(() => {
    g6();
    PM();
    Qq();
    YcK();
    Y2();
    n7();
    c7();
    T7();
    CO7();
    kj();
    Dn1();
    N3 = K6(P6(), 1), RUY = {
        id: "large-memory-files",
        type: "warning",
        isActive: (q) => QK6(q.memoryFiles).length > 0,
        render: (q) => {
            let K = QK6(q.memoryFiles);
            return N3.createElement(N3.Fragment, null, K.map((_) => {
                let z = _.path.startsWith(b8()) ? hUY(b8(), _.path) : _.path;
                return N3.createElement(kr8, {
                    key: _.path,
                    status: "warning"
                }, "Large ", N3.createElement(T, {
                    bold: !0
                }, z), " will impact performance (", iK(_.content.length), " chars >", " ", iK(Oc), ")", N3.createElement(T, {
                    dimColor: !0
                }, " · /memory to edit"))
            }))
        }
    }, SUY = {
        id: "claude-ai-external-token",
        type: "warning",
        isActive: () => {
            let q = xb();
            return i7() && (q.source === "ANTHROPIC_AUTH_TOKEN" || q.source === "apiKeyHelper")
        },
        render: () => {
            let q = xb();
            return N3.createElement(u, {
                marginTop: 1
            }, N3.createElement(kr8, {
                status: "warning"
            }, "Auth conflict: Using ", q.source, " instead of Claude account subscription token. Either unset ", q.source, ", or run `claude /logout`."))
        }
    }, CUY = {
        id: "api-key-conflict",
        type: "warning",
        isActive: () => {
            let {
                source: q
            } = Vw({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return !!Ek6() && (q === "ANTHROPIC_API_KEY" || q === "apiKeyHelper")
        },
        render: () => {
            let {
                source: q
            } = Vw({
                skipRetrievingKeyFromApiKeyHelper: !0
            });
            return N3.createElement(u, {
                flexDirection: "row",
                marginTop: 1
            }, N3.createElement(D4, {
                status: "warning"
            }), N3.createElement(T, {
                color: "warning"
            }, "Auth conflict: Using ", q, " instead of Anthropic Console key. Either unset ", q, ", or run `claude /logout`."))
        }
    }, bUY = {
        id: "both-auth-methods",
        type: "warning",
        isActive: () => {
            let {
                source: q
            } = Vw({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), K = xb();
            return q !== "none" && K.source !== "none" && !(q === "apiKeyHelper" && K.source === "apiKeyHelper")
        },
        render: () => {
            let {
                source: q
            } = Vw({
                skipRetrievingKeyFromApiKeyHelper: !0
            }), K = xb();
            return N3.createElement(u, {
                flexDirection: "column",
                marginTop: 1
            }, N3.createElement(u, {
                flexDirection: "row"
            }, N3.createElement(D4, {
                status: "warning"
            }), N3.createElement(T, {
                color: "warning"
            }, "Auth conflict: Both a token (", K.source, ") and an API key (", q, ") are set. This may lead to unexpected behavior.")), N3.createElement(u, {
                flexDirection: "column",
                marginLeft: 3
            }, N3.createElement(T, {
                color: "warning"
            }, "· Trying to use", " ", K.source === "claude.ai" ? "claude.ai" : K.source, "?", " ", q === "ANTHROPIC_API_KEY" ? 'Unset the ANTHROPIC_API_KEY environment variable, or claude /logout then say "No" to the API key approval before login.' : q === "apiKeyHelper" ? "Unset the apiKeyHelper setting." : "claude /logout"), N3.createElement(T, {
                color: "warning"
            }, "· Trying to use ", q, "?", " ", K.source === "claude.ai" ? "claude /logout to sign out of claude.ai." : `Unset the ${K.source} environment variable.`)))
        }
    }, IUY = {
        id: "large-agent-descriptions",
        type: "warning",
        isActive: (q) => {
            return e98(q.agentDefinitions) > bP6
        },
        render: (q) => {
            let K = e98(q.agentDefinitions);
            return N3.createElement(kr8, {
                status: "warning"
            }, "Large cumulative agent descriptions will impact performance (~", iK(K), " tokens >", " ", iK(bP6), ")", N3.createElement(T, {
                dimColor: !0
            }, " · /agents to manage"))
        }
    }, xUY = {
        id: "jetbrains-plugin-install",
        type: "info",
        isActive: (q) => {
            if (!Th6()) return !1;
            if (!(q.config.autoInstallIdeExtension ?? !0)) return !1;
            let _ = Gh6();
            return _ !== null && !pR4(_)
        },
        render: () => {
            let q = Gh6(),
                K = kH(q);
            return N3.createElement(u, {
                flexDirection: "row",
                gap: 1,
                marginLeft: 1
            }, N3.createElement(T, {
                color: "ide"
            }, e6.arrowUp), N3.createElement(T, null, "Install the ", N3.createElement(T, {
                color: "ide"
            }, K), " plugin from the JetBrains Marketplace:", " ", N3.createElement(T, {
                bold: !0
            }, "https://docs.claude.com/s/claude-code-jetbrains")))
        }
    }, uUY = [RUY, IUY, SUY, CUY, bUY, xUY]
})
// @from(Ln 468349, Col 0)
function $cK(q) {
    let K = s(4),
        {
            agentDefinitions: _
        } = q === void 0 ? {} : q,
        z = H8(),
        Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = GJ(), K[0] = Y;
    else Y = K[0];
    let A = {
            config: z,
            agentDefinitions: _,
            memoryFiles: wcK.use(Y)
        },
        O = AcK(A);
    if (O.length === 0) return null;
    let w = u,
        $ = "column",
        j = 1,
        H = O.map((X) => KW6.createElement(KW6.Fragment, {
            key: X.id
        }, X.render(A))),
        J;
    if (K[1] !== w || K[2] !== H) J = KW6.createElement(w, {
        flexDirection: $,
        paddingLeft: j
    }, H), K[1] = w, K[2] = H, K[3] = J;
    else J = K[3];
    return J
}
// @from(Ln 468379, Col 4)
KW6
// @from(Ln 468379, Col 9)
wcK
// @from(Ln 468380, Col 4)
jcK = L(() => {
    o6();
    g6();
    PM();
    h1();
    OcK();
    KW6 = K6(P6(), 1), wcK = K6(P6(), 1)
})
// @from(Ln 468389, Col 0)
function JcK({
    isLoading: q
}) {
    let K = gAK(),
        [_, z] = gS.useState(-1),
        Y = gS.useRef(_);
    if (Y.current = _, gS.useEffect(() => {
            if (!K || !q) {
                if (Y.current !== -1) z(-1);
                return
            }
            let A = HcK.map((O, w) => setTimeout(z, O.afterMs, w));
            return () => {
                for (let O of A) clearTimeout(O)
            }
        }, [K, q]), _ < 0 || !K || !q) return null;
    return gS.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        width: "100%"
    }, gS.default.createElement(u, {
        flexDirection: "row"
    }, gS.default.createElement(xF, {
        shouldAnimate: !0,
        isUnresolved: !0,
        isError: !1
    }), gS.default.createElement(T, null, "Thinking")), gS.default.createElement(_1, null, gS.default.createElement(T, {
        dimColor: !0
    }, HcK[_].text)))
}
// @from(Ln 468419, Col 4)
gS
// @from(Ln 468419, Col 8)
HcK
// @from(Ln 468420, Col 4)
XcK = L(() => {
    g6();
    GK();
    p48();
    lC6();
    gS = K6(P6(), 1), HcK = [{
        afterMs: 1000,
        text: "Hmm…"
    }, {
        afterMs: 6000,
        text: "This one needs a moment…"
    }, {
        afterMs: 12000,
        text: "Working through it…"
    }, {
        afterMs: 20000,
        text: "Untangling some thoughts…"
    }, {
        afterMs: 28000,
        text: "Weighing a few approaches…"
    }, {
        afterMs: 36000,
        text: "Consulting the rubber duck…"
    }, {
        afterMs: 48000,
        text: "Cross-referencing seventeen theories…"
    }, {
        afterMs: 60000,
        text: "Double-checking the double-checks…"
    }, {
        afterMs: 80000,
        text: "Almost there…"
    }, {
        afterMs: 108000,
        text: "Pacing in small circles…"
    }, {
        afterMs: 120000,
        text: "Reticulating splines…"
    }, {
        afterMs: 135000,
        text: "Hmm…?"
    }, {
        afterMs: 150000,
        text: "Staring thoughtfully into the middle distance…"
    }, {
        afterMs: 165000,
        text: "Still here, still at it…"
    }]
})