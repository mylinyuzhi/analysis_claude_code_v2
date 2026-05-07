
// @from(Ln 526798, Col 0)
function ks8(q) {
    let K = q.name;
    if (q.type === "prompt") {
        if (q.source === "plugin" && q.pluginInfo?.repository) return `${K}:${q.source}:${q.pluginInfo.repository}`;
        return `${K}:${q.source}`
    }
    return `${K}:${q.type}`
}
// @from(Ln 526807, Col 0)
function A3A(q, K) {
    if (!K || K.length === 0 || q === "") return;
    return K.find((_) => _.toLowerCase().startsWith(q))
}
// @from(Ln 526812, Col 0)
function GM7(q, K) {
    let _ = y_(q),
        z = K ? ` (${K})` : "",
        Y = q.type === "prompt" && q.kind === "workflow",
        A = (Y ? q.description : IP6(q)) + (q.type === "prompt" && q.argNames?.length ? ` (arguments: ${q.argNames.join(", ")})` : "");
    return {
        id: ks8(q),
        displayText: `/${_}${z}`,
        tag: Y ? "workflow" : void 0,
        description: A,
        metadata: q
    }
}
// @from(Ln 526826, Col 0)
function TM7(q, K) {
    if (!L66(q)) return [];
    if (z3A(q)) return [];
    let _ = q.slice(1).toLowerCase().trim();
    if (_ === "") {
        let H = K.filter((v) => !v.isHidden && !co8(v)),
            J = [],
            X = H.filter((v) => v.type === "prompt").map((v) => ({
                cmd: v,
                score: l88(v.name)
            })).filter((v) => v.score > 0).sort((v, V) => V.score - v.score);
        for (let v of X.slice(0, 5)) J.push(v.cmd);
        let M = new Set(J.map((v) => ks8(v))),
            P = [],
            W = [],
            D = [],
            Z = [],
            G = [];
        H.forEach((v) => {
            if (M.has(ks8(v))) return;
            if (v.type === "local" || v.type === "local-jsx") P.push(v);
            else if (v.type === "prompt" && (v.source === "userSettings" || v.source === "localSettings")) W.push(v);
            else if (v.type === "prompt" && v.source === "projectSettings") D.push(v);
            else if (v.type === "prompt" && v.source === "policySettings") Z.push(v);
            else G.push(v)
        });
        let f = (v, V) => y_(v).localeCompare(y_(V));
        return P.sort(f), W.sort(f), D.sort(f), Z.sort(f), G.sort(f), [...J, ...P, ...W, ...D, ...Z, ...G].map((v) => GM7(v))
    }
    let z = (H) => y_(H).toLowerCase() === _ || H.name.toLowerCase() === _,
        Y = K.find((H) => H.isHidden && z(H));
    if (Y && K.some((H) => !H.isHidden && z(H))) Y = void 0;
    let j = _3A(K).search(_).filter((H) => !co8(H.item.command)).map((H) => {
        let J = H.item.commandName.toLowerCase(),
            X = H.item.displayName.toLowerCase(),
            M = H.item.aliasKey?.map((W) => W.toLowerCase()) ?? [],
            P = H.item.command.type === "prompt" ? l88(H.item.command.name) : 0;
        return {
            r: H,
            name: J,
            display: X,
            aliases: M,
            usage: P
        }
    }).sort((H, J) => {
        let X = H.name,
            M = J.name,
            P = H.aliases,
            W = J.aliases,
            D = X === _ || H.display === _,
            Z = M === _ || J.display === _;
        if (D && !Z) return -1;
        if (Z && !D) return 1;
        let G = P.some((B) => B === _),
            f = W.some((B) => B === _);
        if (G && !f) return -1;
        if (f && !G) return 1;
        let v = (B, m) => Math.min(B.startsWith(_) ? B.length : 1 / 0, m.startsWith(_) ? m.length : 1 / 0),
            V = v(X, H.display),
            k = v(M, J.display),
            N = V < 1 / 0,
            R = k < 1 / 0;
        if (N && !R) return -1;
        if (R && !N) return 1;
        if (N && R && V !== k) return V - k;
        let h = P.find((B) => B.startsWith(_)),
            C = W.find((B) => B.startsWith(_));
        if (h && !C) return -1;
        if (C && !h) return 1;
        if (h && C && h.length !== C.length) return h.length - C.length;
        let x = (H.r.score ?? 0) - (J.r.score ?? 0);
        if (Math.abs(x) > 0.1) return x;
        return J.usage - H.usage
    }).map((H) => {
        let J = H.r.item.command,
            X = A3A(_, J.aliases);
        return GM7(J, X)
    });
    if (Y) {
        let H = ks8(Y);
        if (!j.some((J) => J.id === H)) return [GM7(Y), ...j]
    }
    return j
}
// @from(Ln 526911, Col 0)
function VM7(q, K, _, z, Y, A) {
    let O, w;
    if (typeof q === "string") O = q, w = K ? $b6(O, _) : void 0;
    else {
        if (!k55(q.metadata)) return;
        O = q.metadata.name, w = q.metadata
    }
    let $ = Y3A(O);
    if (z($), Y($.length), K && w) {
        if (w.type !== "prompt" || (w.argNames ?? []).length === 0) A($, !0)
    }
}
// @from(Ln 526924, Col 0)
function O3A(q) {
    return q.toLowerCase().replace(/[^a-z0-9]/g, "")
}
// @from(Ln 526928, Col 0)
function N55(q) {
    let K = [],
        _ = /(^|[\s。、？！])(\/[a-zA-Z][a-zA-Z0-9:\-_]*)/g,
        z = null;
    while ((z = _.exec(q)) !== null) {
        let Y = z[1] ?? "",
            A = z[2] ?? "",
            O = z.index + Y.length;
        K.push({
            start: O,
            end: O + A.length
        })
    }
    return K
}
// @from(Ln 526943, Col 4)
V55
// @from(Ln 526943, Col 9)
fM7 = null
// @from(Ln 526944, Col 4)
kM7 = L(() => {
    wr8();
    CA();
    Ih6();
    V55 = /[:_-]/g
})
// @from(Ln 526950, Col 0)
async function $3A() {
    let q = Date.now();
    if (dW6 && q - E55 < w3A) return dW6;
    let K = [],
        _ = new Set;
    try {
        for await (let z of my8()) {
            if (z.display && z.display.startsWith("!")) {
                let Y = z.display.slice(1).trim();
                if (Y && !_.has(Y)) _.add(Y), K.push(Y)
            }
            if (K.length >= 50) break
        }
    } catch (z) {
        E(`Failed to read shell history: ${z}`)
    }
    return dW6 = K, E55 = q, K
}
// @from(Ln 526969, Col 0)
function y55(q) {
    if (!dW6) return;
    let K = dW6.indexOf(q);
    if (K !== -1) dW6.splice(K, 1);
    dW6.unshift(q)
}
// @from(Ln 526975, Col 0)
async function L55(q) {
    if (!q || q.length < 2) return null;
    if (!q.trim()) return null;
    let _ = await $3A();
    for (let z of _)
        if (z.startsWith(q) && z !== q) return {
            fullCommand: z,
            suffix: z.slice(q.length)
        };
    return null
}
// @from(Ln 526986, Col 4)
dW6 = null
// @from(Ln 526987, Col 4)
E55 = 0
// @from(Ln 526988, Col 4)
w3A = 60000
// @from(Ln 526989, Col 4)
NM7 = L(() => {
    II();
    K8()
})
// @from(Ln 526994, Col 0)
function C55(q) {
    return q.find((K) => K.type === "connected" && K.name.includes("slack"))
}
// @from(Ln 526997, Col 0)
async function H3A(q, K) {
    let _ = C55(q);
    if (!_ || _.type !== "connected") return [];
    try {
        let Y = (await _.client.callTool({
            name: j3A,
            arguments: {
                query: K,
                limit: 20,
                channel_types: "public_channel,private_channel"
            }
        }, void 0, {
            timeout: 5000
        })).content;
        if (!Array.isArray(Y)) return [];
        let A = Y.filter((O) => O.type === "text").map((O) => O.text).join(`
`);
        return M3A(X3A(A))
    } catch (z) {
        return E(`Failed to fetch Slack channels: ${z}`), []
    }
}
// @from(Ln 527020, Col 0)
function X3A(q) {
    let K = q.trim();
    if (!K.startsWith("{")) return q;
    try {
        let _ = J3A().safeParse(n8(K));
        if (_.success) return _.data.results
    } catch {}
    return q
}
// @from(Ln 527030, Col 0)
function M3A(q) {
    let K = [],
        _ = new Set;
    for (let z of q.split(`
`)) {
        let Y = z.match(/^Name:\s*#?([a-z0-9][a-z0-9_-]{0,79})\s*$/);
        if (Y && !_.has(Y[1])) _.add(Y[1]), K.push(Y[1])
    }
    return K
}
// @from(Ln 527041, Col 0)
function Ls8(q) {
    return C55(q) !== void 0
}
// @from(Ln 527045, Col 0)
function b55() {
    return h55
}
// @from(Ln 527049, Col 0)
function I55(q) {
    let K = [],
        _ = /(^|\s)#([a-z0-9][a-z0-9_-]{0,79})(?=\s|$)/g,
        z;
    while ((z = _.exec(q)) !== null) {
        if (!ys8.has(z[2])) continue;
        let Y = z.index + z[1].length;
        K.push({
            start: Y,
            end: Y + 1 + z[2].length
        })
    }
    return K
}
// @from(Ln 527064, Col 0)
function P3A(q) {
    let K = Math.max(q.lastIndexOf("-"), q.lastIndexOf("_"));
    return K > 0 ? q.slice(0, K) : q
}
// @from(Ln 527069, Col 0)
function W3A(q, K) {
    let _, z = 0;
    for (let [Y, A] of Gm6)
        if (q.startsWith(Y) && Y.length > z && A.some((O) => O.startsWith(K))) _ = A, z = Y.length;
    return _
}
// @from(Ln 527075, Col 0)
async function x55(q, K) {
    if (!K) return [];
    let _ = P3A(K),
        z = K.toLowerCase(),
        Y = Gm6.get(_) ?? W3A(_, z);
    if (!Y)
        if (Es8 === _ && KY8) Y = await KY8;
        else {
            Es8 = _, KY8 = H3A(q, _), Y = await KY8, Gm6.set(_, Y);
            let A = ys8.size;
            for (let O of Y) ys8.add(O);
            if (ys8.size !== A) h55++, R55.emit();
            if (Gm6.size > 50) Gm6.delete(Gm6.keys().next().value);
            if (Es8 === _) Es8 = null, KY8 = null
        } return Y.filter((A) => A.startsWith(z)).sort().slice(0, 10).map((A) => ({
        id: `slack-channel-${A}`,
        displayText: `#${A}`
    }))
}
// @from(Ln 527094, Col 4)
j3A = "slack_search_channels"
// @from(Ln 527095, Col 4)
Gm6
// @from(Ln 527095, Col 9)
ys8
// @from(Ln 527095, Col 14)
h55 = 0
// @from(Ln 527096, Col 4)
R55
// @from(Ln 527096, Col 9)
S55
// @from(Ln 527096, Col 14)
Es8 = null
// @from(Ln 527097, Col 4)
KY8 = null
// @from(Ln 527098, Col 4)
J3A
// @from(Ln 527099, Col 4)
EM7 = L(() => {
    Hs();
    K8();
    nH();
    e8();
    Gm6 = new Map, ys8 = new Set, R55 = l5(), S55 = R55.subscribe;
    J3A = C6(() => g7.object({
        results: g7.string()
    }))
})
// @from(Ln 527110, Col 0)
function yM7(q) {
    let K = q.indexOf("{");
    return K === -1 ? q : q.slice(0, K)
}
// @from(Ln 527115, Col 0)
function u55(q) {
    let K = LM7(q.template.uriTemplate),
        _ = Object.keys(q.resolvedArgs).length,
        z = 0;
    for (let Y = 0; Y < K.length; Y++) {
        if (K[Y].type !== "variable") continue;
        if (z === _) return K[Y + 1]?.type === "literal" && K[Y + 2]?.type === "variable";
        z++
    }
    return !1
}
// @from(Ln 527127, Col 0)
function LM7(q) {
    let K = [],
        _ = 0,
        z = 0;
    while (_ < q.length)
        if (q[_] === "{") {
            if (_ > z) K.push({
                type: "literal",
                value: q.slice(z, _)
            });
            let Y = q.indexOf("}", _);
            if (Y === -1) return K.push({
                type: "literal",
                value: q.slice(_)
            }), K;
            let A = q.slice(_ + 1, Y);
            A = A.replace(/^[+#./;?&]/, "").replace(/\*$|:\d+$/, ""), A = i5(A, ","), K.push({
                type: "variable",
                name: A
            }), _ = Y + 1, z = _
        } else _++;
    if (z < q.length) K.push({
        type: "literal",
        value: q.slice(z)
    });
    return K
}
// @from(Ln 527155, Col 0)
function D3A(q, K) {
    let _ = LM7(q.uriTemplate),
        z = {},
        Y = 0;
    for (let A = 0; A < _.length; A++) {
        let O = _[A];
        if (O.type === "literal") {
            let w = K.slice(Y);
            if (w.length < O.value.length) return null;
            if (!w.startsWith(O.value)) return null;
            Y += O.value.length
        } else {
            let w = _[A + 1],
                $ = w?.type === "literal" ? w.value : null,
                j = K.slice(Y);
            if ($) {
                let H = j.indexOf($);
                if (H === -1) return {
                    template: q,
                    argName: O.name,
                    argValue: j,
                    resolvedArgs: z,
                    valueStartIndex: Y
                };
                z[O.name] = j.slice(0, H), Y += H
            } else return {
                template: q,
                argName: O.name,
                argValue: j,
                resolvedArgs: z,
                valueStartIndex: Y
            }
        }
    }
    return null
}
// @from(Ln 527192, Col 0)
function m55(q, K) {
    let _ = null,
        z = [-1, -1, -1];
    for (let Y of K) {
        let A = D3A(Y, q);
        if (!A) continue;
        let O = [Object.keys(A.resolvedArgs).length, A.valueStartIndex, (Y.uriTemplate.match(/\{/g) ?? []).length];
        if (!_ || O[0] > z[0] || O[0] === z[0] && O[1] > z[1] || O[0] === z[0] && O[1] === z[1] && O[2] > z[2]) _ = A, z = O
    }
    return _
}
// @from(Ln 527204, Col 0)
function B55(q, K, _) {
    let z = q.slice(0, K.valueStartIndex),
        Y = LM7(K.template.uriTemplate),
        A = -1,
        O = 0;
    for (let j = 0; j < Y.length; j++)
        if (Y[j].type === "variable") {
            if (O === Object.keys(K.resolvedArgs).length) {
                A = j;
                break
            }
            O++
        } let w = A >= 0 ? Y[A + 1] : void 0,
        $ = w?.type === "literal" ? w.value : "";
    return z + _ + $
}
// @from(Ln 527220, Col 4)
p55 = () => {}
// @from(Ln 527225, Col 0)
function F55(q) {
    switch (q.type) {
        case "file":
            return {
                id: `file-${q.path}`, displayText: q.displayText, description: q.description
            };
        case "mcp_resource":
            return {
                id: `mcp-resource-${q.server}__${q.uri}`, displayText: q.displayText, description: q.description
            };
        case "mcp_resource_template":
            return {
                id: `mcp-template::${q.server}__${q.uriTemplate}`, displayText: q.displayText, description: q.description, metadata: {
                    partial: !0
                }
            };
        case "agent":
            return {
                id: `agent-${q.agentType}`, displayText: q.displayText, description: q.description, color: q.color
            }
    }
}
// @from(Ln 527248, Col 0)
function zY8(q) {
    return j4(q, f3A)
}
// @from(Ln 527252, Col 0)
function G3A(q, K, _ = !1) {
    if (!K && !_) return [];
    try {
        let z = q.map((A) => ({
            type: "agent",
            displayText: `${A.agentType} (agent)`,
            description: zY8(A.whenToUse),
            agentType: A.agentType,
            color: cs(A.agentType)
        }));
        if (!K) return z;
        let Y = K.toLowerCase();
        return z.filter((A) => A.agentType.toLowerCase().includes(Y) || A.displayText.toLowerCase().includes(Y))
    } catch (z) {
        return j6(z), []
    }
}
// @from(Ln 527269, Col 0)
async function hM7(q, K, _, z, Y = !1, A = {}) {
    if (!K && !Y) return [];
    let [O, w] = await Promise.all([bA7(q, K, Y), Promise.resolve(G3A(z, K, Y))]), $ = O.map((M) => ({
        type: "file",
        displayText: M.displayText,
        description: M.description,
        path: M.displayText,
        filename: Z3A(M.displayText),
        score: M.metadata?.score
    })), j = Object.values(_).flat().map((M) => ({
        type: "mcp_resource",
        displayText: `${M.server}:${M.uri}`,
        description: zY8(M.description || M.name || M.uri),
        server: M.server,
        uri: M.uri,
        name: M.name || M.uri
    })), H = Object.values(A).flat().map((M) => ({
        type: "mcp_resource_template",
        displayText: `${M.server}:${yM7(M.uriTemplate)}`,
        description: zY8(M.description || M.name || M.uriTemplate),
        server: M.server,
        uriTemplate: M.uriTemplate,
        name: M.name || M.uriTemplate
    }));
    if (!K) return [...$, ...j, ...H, ...w].slice(0, _Y8).map(F55);
    let J = [...j, ...H, ...w],
        X = [];
    for (let M of $) X.push({
        source: M,
        score: M.score ?? 0.5
    });
    if (J.length > 0) {
        let P = new Lu(J, {
            includeScore: !0,
            threshold: 0.6,
            keys: [{
                name: "displayText",
                weight: 2
            }, {
                name: "name",
                weight: 3
            }, {
                name: "server",
                weight: 1
            }, {
                name: "description",
                weight: 1
            }, {
                name: "agentType",
                weight: 3
            }, {
                name: "uriTemplate",
                weight: 2
            }]
        }).search(K, {
            limit: _Y8
        });
        for (let W of P) {
            let D = W.item.type === "mcp_resource" ? 0.15 : 0;
            X.push({
                source: W.item,
                score: (W.score ?? 0.5) + D
            })
        }
    }
    return X.sort((M, P) => M.score - P.score), X.slice(0, _Y8).map((M) => M.source).map(F55)
}
// @from(Ln 527336, Col 0)
async function RM7(q, K, _) {
    let z = q.indexOf(":");
    if (z === -1) return null;
    let Y = q.slice(0, z),
        A = q.slice(z + 1),
        O = K[Y];
    if (!O || O.length === 0) return null;
    let w = m55(A, O);
    if (!w) {
        if (!A) return null;
        let X = O.filter((M) => M.uriTemplate.startsWith(A));
        if (X.length === 0) return null;
        return X.slice(0, _Y8).map((M) => ({
            id: `mcp-template::${Y}__${M.uriTemplate}`,
            displayText: `${Y}:${yM7(M.uriTemplate)}`,
            description: zY8(M.description || M.name || M.uriTemplate),
            metadata: {
                partial: !0
            }
        }))
    }
    let $ = _.find((X) => X.name === Y && X.type === "connected");
    if (!$) return [];
    let j = await TRK($, w.template.uriTemplate, w.argName, w.argValue, w.resolvedArgs);
    if (j.length === 0) return [];
    let H = zY8(w.template.description || w.template.name || ""),
        J = u55(w);
    return j.slice(0, _Y8).map((X) => {
        let M = B55(A, w, X),
            P = `${Y}:${M}`;
        return {
            id: `mcp-template-value::${Y}__${M}`,
            displayText: M.slice(w.valueStartIndex),
            description: H,
            metadata: {
                partial: J,
                replacement: P
            }
        }
    })
}
// @from(Ln 527377, Col 4)
_Y8 = 15
// @from(Ln 527378, Col 4)
f3A = 60
// @from(Ln 527379, Col 4)
g55 = L(() => {
    wr8();
    g98();
    oW();
    p55();
    Uf();
    c7();
    U8()
})
// @from(Ln 527389, Col 0)
function hs8(q) {
    return typeof q === "object" && q !== null && "type" in q && (q.type === "directory" || q.type === "file")
}
// @from(Ln 527393, Col 0)
function cW6(q, K, _) {
    if (_.length === 0) return -1;
    if (K < 0) return 0;
    let z = q[K];
    if (!z) return 0;
    let Y = _.findIndex((A) => A.id === z.id);
    return Y >= 0 ? Y : 0
}
// @from(Ln 527402, Col 0)
function Q55(q) {
    let K = q.metadata;
    return K?.sessionId ? `/resume ${K.sessionId}` : `/resume ${q.displayText}`
}
// @from(Ln 527407, Col 0)
function d55(q) {
    if (q.isQuoted) return q.token.slice(2).replace(/"$/, "");
    else if (q.token.startsWith("@")) return q.token.substring(1);
    else return q.token
}
// @from(Ln 527413, Col 0)
function CM7(q) {
    let {
        displayText: K,
        mode: _,
        hasAtPrefix: z,
        needsQuotes: Y,
        isQuoted: A,
        isComplete: O
    } = q, w = O ? " " : "";
    if (A || Y) return _ === "bash" ? `"${K}"${w}` : `@"${K}"${w}`;
    else if (z) return _ === "bash" ? `${K}${w}` : `@${K}${w}`;
    else return K
}
// @from(Ln 527427, Col 0)
function bM7(q, K, _, z, Y, A) {
    let $ = K.slice(0, _).lastIndexOf(" ") + 1,
        j;
    if (A === "variable") j = "$" + q.displayText + " ";
    else if (A === "command") j = q.displayText + " ";
    else j = q.displayText;
    let H = K.slice(0, $) + j + K.slice(_);
    z(H), Y($ + j.length)
}
// @from(Ln 527437, Col 0)
function Ss8(q, K, _, z, Y, A) {
    let O = K.slice(0, _).match(z);
    if (!O || O.index === void 0) return;
    let w = O.index + (O[1]?.length ?? 0),
        $ = K.slice(0, w),
        j = $ + q.displayText + " " + K.slice(_);
    Y(j), A($.length + q.displayText.length + 1)
}
// @from(Ln 527445, Col 0)
async function N3A(q, K, _) {
    try {
        if (Cs8) Cs8.abort();
        return Cs8 = new AbortController, await v55(q, K, Cs8.signal, _)
    } catch {
        return d("tengu_shell_completion_failed", {}), []
    }
}
// @from(Ln 527454, Col 0)
function c55(q, K, _, z, Y) {
    let A = Y ? "/" : " ",
        O = q.slice(0, _),
        w = q.slice(_ + z),
        $ = "@" + K + A;
    return {
        newInput: O + $ + w,
        cursorPos: O.length + $.length
    }
}
// @from(Ln 527465, Col 0)
function h66(q, K, _ = !1) {
    if (!q) return null;
    let z = q.substring(0, K);
    if (_) {
        let j = /@"([^"]*)"?$/,
            H = z.match(j);
        if (H && H.index !== void 0) {
            let X = q.substring(K).match(/^[^"]*"?/),
                M = X ? X[0] : "";
            return {
                token: H[0] + M,
                startPos: H.index,
                isQuoted: !0
            }
        }
    }
    if (_) {
        let j = z.lastIndexOf("@");
        if (j >= 0 && (j === 0 || /[\s。、？！]/.test(z[j - 1]))) {
            let H = z.substring(j),
                J = H.match(v3A);
            if (J && J[0].length === H.length) {
                let M = q.substring(K).match(U55),
                    P = M ? M[0] : "";
                return {
                    token: J[0] + P,
                    startPos: j,
                    isQuoted: !1
                }
            }
        }
    }
    let Y = _ ? T3A : V3A,
        A = z.match(Y);
    if (!A || A.index === void 0) return null;
    let w = q.substring(K).match(U55),
        $ = w ? w[0] : "";
    return {
        token: A[0] + $,
        startPos: A.index,
        isQuoted: !1
    }
}
// @from(Ln 527509, Col 0)
function E3A(q) {
    if (L66(q)) {
        let K = q.indexOf(" ");
        if (K === -1) return {
            commandName: q.slice(1),
            args: ""
        };
        return {
            commandName: q.slice(1, K),
            args: q.slice(K + 1)
        }
    }
    return null
}
// @from(Ln 527524, Col 0)
function l55(q, K) {
    return !q && K.includes(" ") && !K.endsWith(" ")
}
// @from(Ln 527528, Col 0)
function n55({
    commands: q,
    onInputChange: K,
    onSubmit: _,
    setCursorOffset: z,
    input: Y,
    cursorOffset: A,
    mode: O,
    agents: w,
    setSuggestionsState: $,
    suggestionsState: {
        suggestions: j,
        selectedSuggestion: H,
        commandArgumentHint: J
    },
    suppressSuggestions: X = !1,
    markAccepted: M,
    onModeChange: P,
    sessionEnvVars: W
}) {
    let {
        addNotification: D
    } = EK(), Z = V3("chat:thinkingToggle", "Chat", "alt+t"), [G, f] = HO.useState("none"), v = HO.useMemo(() => {
        let v6 = q.filter((y6) => !y6.isHidden);
        if (v6.length === 0) return;
        return Math.max(...v6.map((y6) => y_(y6).length)) + 6
    }, [q]), [V, k] = HO.useState(void 0), N = M8((v6) => v6.mcp.resources), R = M8((v6) => v6.mcp.resourceTemplates), h = H9(), C = M8((v6) => v6.promptSuggestion), x = M8((v6) => !!v6.viewingAgentTaskId), B = lv(), [m, S] = HO.useState(void 0), F = HO.useMemo(() => {
        if (O !== "prompt" || X) return;
        let v6 = Ns8(Y, A);
        if (!v6) return;
        let L6 = vM7(v6.partialCommand, q);
        if (!L6) return;
        return {
            text: L6.suffix,
            fullCommand: L6.fullCommand,
            insertPosition: v6.startPos + 1 + v6.partialCommand.length
        }
    }, [Y, A, O, q, X]), U = X ? void 0 : O === "prompt" ? F : m, g = HO.useRef(A);
    g.current = A;
    let c = HO.useRef(null),
        n = HO.useRef(!1),
        l = HO.useRef(""),
        z6 = HO.useRef(""),
        A6 = HO.useRef(""),
        e = HO.useRef(""),
        i = HO.useRef(j);
    i.current = j;
    let O6 = HO.useRef(null),
        J6 = HO.useCallback(() => {
            $(() => ({
                commandArgumentHint: void 0,
                suggestions: [],
                selectedSuggestion: -1
            })), f("none"), k(void 0), S(void 0)
        }, [$]),
        $6 = HO.useCallback(async (v6, L6 = !1) => {
            c.current = v6, n.current = L6;
            let y6 = null;
            if (L6) {
                if (y6 = await RM7(v6, R, h.getState().mcp.clients), c.current !== v6) return
            }
            if (!y6) y6 = await hM7(L_6, v6, N, w, L6, R);
            if (c.current !== v6) return;
            if (y6.length === 0) {
                $(() => ({
                    commandArgumentHint: void 0,
                    suggestions: [],
                    selectedSuggestion: -1
                })), f("none"), k(void 0);
                return
            }
            $((c6) => ({
                commandArgumentHint: void 0,
                suggestions: y6,
                selectedSuggestion: cW6(c6.suggestions, c6.selectedSuggestion, y6)
            })), f(y6.length > 0 ? "file" : "none"), k(void 0)
        }, [N, R, h, $, f, k, w]);
    HO.useEffect(() => {
        return In8(L_6), L_6.indexBuildComplete.subscribe(() => {
            let v6 = c.current;
            if (v6 !== null) {
                let L6 = n.current;
                c.current = null, $6(v6, L6)
            }
        })
    }, [$6]);
    let H6 = ra($6, 50),
        q6 = HO.useCallback(async (v6) => {
            e.current = v6;
            let L6 = await x55(h.getState().mcp.clients, v6);
            if (e.current !== v6) return;
            $((y6) => ({
                commandArgumentHint: void 0,
                suggestions: L6,
                selectedSuggestion: cW6(y6.suggestions, y6.selectedSuggestion, L6)
            })), f(L6.length > 0 ? "slack-channel" : "none"), k(void 0)
        }, [$]),
        o = ra(q6, 150),
        _6 = HO.useCallback(async (v6, L6) => {
            let y6 = L6 ?? g.current;
            if (X) {
                H6.cancel(), J6();
                return
            }
            if (O === "prompt") {
                let R6 = Ns8(v6, y6);
                if (R6) {
                    if (vM7(R6.partialCommand, q)) {
                        $(() => ({
                            commandArgumentHint: void 0,
                            suggestions: [],
                            selectedSuggestion: -1
                        })), f("none"), k(void 0);
                        return
                    }
                }
            }
            if (O === "bash" && v6.trim()) {
                A6.current = v6;
                let R6 = await L55(v6);
                if (A6.current !== v6) return;
                if (R6) {
                    S({
                        text: R6.suffix,
                        fullCommand: R6.fullCommand,
                        insertPosition: v6.length
                    }), $(() => ({
                        commandArgumentHint: void 0,
                        suggestions: [],
                        selectedSuggestion: -1
                    })), f("none"), k(void 0);
                    return
                } else S(void 0)
            }
            let c6 = O !== "bash" ? v6.substring(0, y6).match(Rs8) : null;
            if (c6) {
                let R6 = (c6[2] ?? "").toLowerCase(),
                    p6 = h.getState(),
                    q8 = [],
                    L8 = new Set;
                if (z4() && p6.teamContext)
                    for (let w8 of Object.values(p6.teamContext.teammates ?? {})) {
                        if (w8.name === Mz) continue;
                        if (!w8.name.toLowerCase().startsWith(R6)) continue;
                        L8.add(w8.name), q8.push({
                            id: `dm-${w8.name}`,
                            displayText: `@${w8.name}`,
                            description: "send message"
                        })
                    }
                for (let [w8, x8] of p6.agentNameRegistry) {
                    if (L8.has(w8)) continue;
                    if (!w8.toLowerCase().startsWith(R6)) continue;
                    let a6 = p6.tasks[x8]?.status;
                    q8.push({
                        id: `dm-${w8}`,
                        displayText: `@${w8}`,
                        description: a6 ? `send message · ${a6}` : "send message"
                    })
                }
                if (q8.length > 0) {
                    H6.cancel(), $((w8) => ({
                        commandArgumentHint: void 0,
                        suggestions: q8,
                        selectedSuggestion: cW6(w8.suggestions, w8.selectedSuggestion, q8)
                    })), f("agent"), k(void 0);
                    return
                }
            }
            if (O === "prompt") {
                let R6 = v6.substring(0, y6).match(SM7);
                if (R6 && Ls8(h.getState().mcp.clients)) {
                    o(R6[2]);
                    return
                } else if (G === "slack-channel") o.cancel(), J6()
            }
            let Z8 = v6.substring(0, y6).match(k3A),
                N8 = y6 === v6.length && y6 > 0 && v6.length > 0 && v6[y6 - 1] === " ";
            if (O === "prompt" && L66(v6) && y6 > 0) {
                let R6 = E3A(v6);
                if (R6 && R6.commandName === "add-dir" && R6.args) {
                    let {
                        args: p6
                    } = R6;
                    if (p6.match(/\s+$/)) {
                        H6.cancel(), J6();
                        return
                    }
                    let q8 = await ly8(p6);
                    if (q8.length > 0) {
                        $((L8) => ({
                            suggestions: q8,
                            selectedSuggestion: cW6(L8.suggestions, L8.selectedSuggestion, q8),
                            commandArgumentHint: void 0
                        })), f("directory");
                        return
                    }
                    H6.cancel(), J6();
                    return
                }
                if (R6 && R6.commandName === "resume" && R6.args !== void 0 && R6.args.trim().length > 0 && v6.includes(" ")) {
                    let {
                        args: p6
                    } = R6, L8 = (await Zu(p6, {
                        limit: 10
                    })).map((w8) => {
                        let x8 = xY(w8);
                        return {
                            id: `resume-title-${x8}`,
                            displayText: w8.customTitle,
                            description: wF6(w8),
                            metadata: {
                                sessionId: x8
                            }
                        }
                    });
                    if (L8.length > 0) {
                        $((w8) => ({
                            suggestions: L8,
                            selectedSuggestion: cW6(w8.suggestions, w8.selectedSuggestion, L8),
                            commandArgumentHint: void 0
                        })), f("custom-title");
                        return
                    }
                    J6();
                    return
                }
            }
            if (O === "prompt" && L66(v6) && y6 > 0 && !l55(N8, v6)) {
                let R6 = void 0;
                if (v6.length > 1) {
                    let q8 = v6.indexOf(" "),
                        L8 = q8 === -1 ? v6.slice(1) : v6.slice(1, q8),
                        w8 = q8 !== -1 && v6.slice(q8 + 1).trim().length > 0,
                        x8 = q8 !== -1 && v6.length === q8 + 1;
                    if (q8 !== -1) {
                        let a6 = q.find((D8) => y_(D8) === L8);
                        if (a6 || w8) {
                            if (a6?.argumentHint && x8) R6 = a6.argumentHint;
                            else if (a6?.type === "prompt" && a6.argNames?.length && v6.endsWith(" ")) {
                                let D8 = v6.slice(q8 + 1),
                                    Q6 = jQ1(D8);
                                R6 = SZ4(a6.argNames, Q6)
                            }
                            $(() => ({
                                commandArgumentHint: R6,
                                suggestions: [],
                                selectedSuggestion: -1
                            })), f("none"), k(void 0);
                            return
                        }
                    }
                }
                let p6 = TM7(v6, q);
                if ($(() => ({
                        commandArgumentHint: R6,
                        suggestions: p6,
                        selectedSuggestion: p6.length > 0 ? 0 : -1
                    })), f(p6.length > 0 ? "command" : "none"), p6.length > 0) k(v);
                return
            }
            if (G === "command") H6.cancel(), J6();
            else if (L66(v6) && l55(N8, v6)) $((R6) => R6.commandArgumentHint ? {
                ...R6,
                commandArgumentHint: void 0
            } : R6);
            if (G === "custom-title") J6();
            if (G === "agent" && i.current.some((R6) => R6.id?.startsWith("dm-"))) {
                if (!v6.substring(0, y6).match(Rs8)) J6()
            }
            if (Z8 && O !== "bash") {
                let R6 = h66(v6, y6, !0);
                if (R6 && R6.token.startsWith("@")) {
                    let p6 = d55(R6);
                    if (d$4(p6)) {
                        z6.current = p6;
                        let q8 = await c$4(p6, {
                            maxResults: 10
                        });
                        if (z6.current !== p6) return;
                        if (q8.length > 0) {
                            $((L8) => ({
                                suggestions: q8,
                                selectedSuggestion: cW6(L8.suggestions, L8.selectedSuggestion, q8),
                                commandArgumentHint: void 0
                            })), f("directory");
                            return
                        }
                    }
                    if (c.current === p6) return;
                    H6(p6, !0);
                    return
                }
            }
            if (G === "file") {
                let R6 = h66(v6, y6, !0);
                if (R6) {
                    let p6 = d55(R6);
                    if (c.current === p6) return;
                    H6(p6, !1)
                } else H6.cancel(), J6()
            }
            if (G === "shell") {
                let R6 = i.current[0]?.metadata?.inputSnapshot;
                if (O !== "bash" || v6 !== R6) H6.cancel(), J6()
            }
        }, [G, q, $, J6, H6, o, O, X, v]);
    HO.useEffect(() => {
        if (O6.current === Y) return;
        if (l.current !== Y) l.current = Y, c.current = null;
        O6.current = null, _6(Y)
    }, [Y, _6]);
    let r = HO.useCallback(async () => {
            if (U) {
                if (O === "bash") {
                    K(U.fullCommand), z(U.fullCommand.length), S(void 0);
                    return
                }
                let v6 = Ns8(Y, A);
                if (v6) {
                    let L6 = Y.slice(0, v6.startPos),
                        y6 = Y.slice(v6.startPos + v6.token.length),
                        c6 = L6 + "/" + U.fullCommand + " " + y6,
                        Z8 = v6.startPos + 1 + U.fullCommand.length + 1;
                    K(c6), z(Z8);
                    return
                }
            }
            if (j.length > 0) {
                H6.cancel(), o.cancel();
                let v6 = H === -1 ? 0 : H,
                    L6 = j[v6];
                if (G === "command" && v6 < j.length) {
                    if (L6) VM7(L6, !1, q, K, z, _), J6()
                } else if (G === "custom-title" && j.length > 0) {
                    if (L6) {
                        let y6 = Q55(L6);
                        K(y6), z(y6.length), J6()
                    }
                } else if (G === "directory" && j.length > 0) {
                    let y6 = j[v6];
                    if (y6) {
                        let c6 = L66(Y),
                            Z8;
                        if (c6) {
                            let N8 = Y.indexOf(" "),
                                R6 = Y.slice(0, N8 + 1),
                                p6 = hs8(y6.metadata) && y6.metadata.type === "directory" ? "/" : " ";
                            if (Z8 = R6 + y6.id + p6, K(Z8), z(Z8.length), hs8(y6.metadata) && y6.metadata.type === "directory") $((q8) => ({
                                ...q8,
                                commandArgumentHint: void 0
                            })), _6(Z8, Z8.length);
                            else J6()
                        } else {
                            let R6 = h66(Y, A, !0) ?? h66(Y, A, !1);
                            if (R6) {
                                let p6 = hs8(y6.metadata) && y6.metadata.type === "directory",
                                    q8 = c55(Y, y6.id, R6.startPos, R6.token.length, p6);
                                if (Z8 = q8.newInput, K(Z8), z(q8.cursorPos), p6) $((L8) => ({
                                    ...L8,
                                    commandArgumentHint: void 0
                                })), _6(Z8, q8.cursorPos);
                                else J6()
                            } else J6()
                        }
                    }
                } else if (G === "shell" && j.length > 0) {
                    let y6 = j[v6];
                    if (y6) {
                        let c6 = y6.metadata;
                        bM7(y6, Y, A, K, z, c6?.completionType), J6()
                    }
                } else if (G === "agent" && j.length > 0 && j[v6]?.id?.startsWith("dm-")) {
                    let y6 = j[v6];
                    if (y6) Ss8(y6, Y, A, Rs8, K, z), J6()
                } else if (G === "slack-channel" && j.length > 0) {
                    let y6 = j[v6];
                    if (y6) Ss8(y6, Y, A, SM7, K, z), J6()
                } else if (G === "file" && j.length > 0) {
                    let y6 = h66(Y, A, !0);
                    if (!y6) {
                        J6();
                        return
                    }
                    let Z8 = j.some((p6) => p6.metadata?.replacement) ? "" : MIK(j),
                        N8 = y6.token.startsWith("@"),
                        R6;
                    if (y6.isQuoted) R6 = y6.token.slice(2).replace(/"$/, "").length;
                    else if (N8) R6 = y6.token.length - 1;
                    else R6 = y6.token.length;
                    if (Z8.length > R6) {
                        let p6 = CM7({
                            displayText: Z8,
                            mode: O,
                            hasAtPrefix: N8,
                            needsQuotes: !1,
                            isQuoted: y6.isQuoted,
                            isComplete: !1
                        });
                        xn8(p6, Y, y6.token, y6.startPos, K, z), _6(Y.replace(y6.token, p6), A)
                    } else if (v6 < j.length) {
                        let p6 = j[v6];
                        if (p6) {
                            let q8 = p6.metadata,
                                L8 = q8?.replacement ?? p6.displayText,
                                w8 = L8.includes(" "),
                                x8 = CM7({
                                    displayText: L8,
                                    mode: O,
                                    hasAtPrefix: N8,
                                    needsQuotes: w8,
                                    isQuoted: y6.isQuoted,
                                    isComplete: !q8?.partial
                                });
                            xn8(x8, Y, y6.token, y6.startPos, K, z), J6()
                        }
                    }
                }
            } else if (Y.trim() !== "") {
                let v6, L6;
                if (O === "bash") {
                    v6 = "shell";
                    let y6 = await N3A(Y, A, W);
                    if (y6.length === 1) {
                        let c6 = y6[0];
                        if (c6) {
                            let Z8 = c6.metadata;
                            bM7(c6, Y, A, K, z, Z8?.completionType)
                        }
                        L6 = []
                    } else L6 = y6
                } else {
                    v6 = "file";
                    let y6 = h66(Y, A, !0);
                    if (y6) {
                        let c6 = y6.token.startsWith("@"),
                            Z8 = c6 ? y6.token.substring(1) : y6.token;
                        c.current = Z8, n.current = c6;
                        let N8 = null;
                        if (c6) {
                            if (N8 = await RM7(Z8, R, h.getState().mcp.clients), c.current !== Z8) return
                        }
                        if (L6 = N8 ?? await hM7(L_6, Z8, N, w, c6, R), c.current !== Z8) return
                    } else L6 = []
                }
                if (L6.length > 0) $((y6) => ({
                    commandArgumentHint: void 0,
                    suggestions: L6,
                    selectedSuggestion: cW6(y6.suggestions, y6.selectedSuggestion, L6)
                })), f(v6), k(void 0)
            }
        }, [j, H, Y, G, q, O, K, z, _, J6, A, _6, N, R, h, $, w, H6, o, U, W]),
        t = HO.useCallback(() => {
            if (H < 0 || j.length === 0) return;
            let v6 = j[H];
            if (G === "command" && H < j.length) {
                if (v6) VM7(v6, !0, q, K, z, _), H6.cancel(), J6()
            } else if (G === "custom-title" && H < j.length) {
                if (v6) {
                    let L6 = Q55(v6);
                    K(L6), z(L6.length), _(L6, !0), H6.cancel(), J6()
                }
            } else if (G === "shell" && H < j.length) {
                let L6 = j[H];
                if (L6) {
                    let y6 = L6.metadata;
                    bM7(L6, Y, A, K, z, y6?.completionType), H6.cancel(), J6()
                }
            } else if (G === "agent" && H < j.length && v6?.id?.startsWith("dm-")) Ss8(v6, Y, A, Rs8, K, z), H6.cancel(), J6();
            else if (G === "slack-channel" && H < j.length) {
                if (v6) Ss8(v6, Y, A, SM7, K, z), o.cancel(), J6()
            } else if (G === "file" && H < j.length) {
                let L6 = h66(Y, A, !0);
                if (L6) {
                    if (v6) {
                        let y6 = v6.metadata,
                            c6 = y6?.replacement ?? v6.displayText,
                            Z8 = L6.token.startsWith("@"),
                            N8 = c6.includes(" "),
                            R6 = CM7({
                                displayText: c6,
                                mode: O,
                                hasAtPrefix: Z8,
                                needsQuotes: N8,
                                isQuoted: L6.isQuoted,
                                isComplete: !y6?.partial
                            });
                        xn8(R6, Y, L6.token, L6.startPos, K, z), H6.cancel(), J6()
                    }
                }
            } else if (G === "directory" && H < j.length) {
                if (v6) {
                    if (L66(Y)) {
                        H6.cancel(), J6();
                        return
                    }
                    let y6 = h66(Y, A, !0) ?? h66(Y, A, !1);
                    if (y6) {
                        let c6 = hs8(v6.metadata) && v6.metadata.type === "directory",
                            Z8 = c55(Y, v6.id, y6.startPos, y6.token.length, c6);
                        K(Z8.newInput), z(Z8.cursorPos)
                    }
                    H6.cancel(), J6()
                }
            }
        }, [j, H, G, q, Y, A, O, K, z, _, J6, H6, o]),
        Y6 = HO.useCallback(() => {
            r()
        }, [r]),
        X6 = HO.useCallback(() => {
            H6.cancel(), o.cancel(), J6(), O6.current = Y
        }, [H6, o, J6, Y]),
        M6 = HO.useCallback(() => {
            $((v6) => ({
                ...v6,
                selectedSuggestion: v6.selectedSuggestion <= 0 ? j.length - 1 : v6.selectedSuggestion - 1
            }))
        }, [j.length, $]),
        W6 = HO.useCallback(() => {
            $((v6) => ({
                ...v6,
                selectedSuggestion: v6.selectedSuggestion >= j.length - 1 ? 0 : v6.selectedSuggestion + 1
            }))
        }, [j.length, $]),
        V6 = HO.useMemo(() => ({
            "autocomplete:accept": Y6,
            "autocomplete:dismiss": X6,
            "autocomplete:previous": M6,
            "autocomplete:next": W6
        }), [Y6, X6, M6, W6]),
        f6 = j.length > 0 || !!U,
        G6 = o46();
    A2("autocomplete", f6), dy8("Autocomplete", f6), L7(V6, {
        context: "Autocomplete",
        isActive: f6 && !G6
    });

    function k6(v6) {
        let L6 = ZR(v6);
        if (L6 !== "prompt" && P) {
            P(L6);
            let y6 = Ap(v6);
            K(y6), z(y6.length)
        } else K(v6), z(v6.length)
    }
    return {
        suggestions: j,
        selectedSuggestion: H,
        suggestionType: G,
        maxColumnWidth: V,
        commandArgumentHint: J,
        inlineGhostText: U,
        handleKeyDown: (v6) => {
            if (v6.key === "right" && !x) {
                let {
                    text: y6,
                    shownAt: c6
                } = C;
                if (y6 && c6 > 0 && Y === "") {
                    M(), k6(y6), v6.preventDefault(), v6.stopImmediatePropagation();
                    return
                }
            }
            if (v6.key === "tab" && !v6.shift) {
                if (j.length > 0 || U) return;
                let {
                    text: y6,
                    shownAt: c6
                } = C;
                if (y6 && c6 > 0 && Y === "" && !x) {
                    v6.preventDefault(), M(), k6(y6);
                    return
                }
                if (Y.trim() === "") v6.preventDefault(), D({
                    key: "thinking-toggle-hint",
                    jsx: IM7.createElement(T, {
                        dimColor: !0
                    }, "Use ", Z, " to toggle thinking"),
                    priority: "immediate",
                    timeoutMs: 3000
                });
                return
            }
            if (j.length === 0) return;
            let L6 = B?.pendingChord != null;
            if (v6.ctrl && v6.key === "n" && !L6) {
                v6.preventDefault(), W6();
                return
            }
            if (v6.ctrl && v6.key === "p" && !L6) {
                v6.preventDefault(), M6();
                return
            }
            if (v6.key === "return" && !v6.shift && !v6.meta) v6.preventDefault(), t()
        }
    }
}
// @from(Ln 528125, Col 4)
IM7
// @from(Ln 528125, Col 9)
HO
// @from(Ln 528125, Col 13)
v3A
// @from(Ln 528125, Col 18)
U55
// @from(Ln 528125, Col 23)
T3A
// @from(Ln 528125, Col 28)
V3A
// @from(Ln 528125, Col 33)
k3A
// @from(Ln 528125, Col 38)
SM7
// @from(Ln 528125, Col 43)
Rs8
// @from(Ln 528125, Col 48)
Cs8 = null
// @from(Ln 528126, Col 4)
i55 = L(() => {
    kY();
    g6();
    C8();
    wk();
    CA();
    CP();
    jp();
    C7();
    RM();
    N7();
    fO();
    oe6();
    T55();
    c7();
    g4();
    kM7();
    GB1();
    NM7();
    EM7();
    g98();
    g55();
    IM7 = K6(P6(), 1), HO = K6(P6(), 1), v3A = /^@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*/u, U55 = /^[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+/u, T3A = /(@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+)$/u, V3A = /[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+$/u, k3A = /(^|[\s。、？！])@([\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|"[^"]*"?)$/u, SM7 = /(^|\s)#([a-z0-9][a-z0-9_-]*)$/;
    Rs8 = /(^|[\s。、？！])@([\w-]*)$/
})
// @from(Ln 528152, Col 0)
function r55(q, K, _, z) {
    if (K === "running") return IF(q, _), "killed";
    return tlK(q, z), "dismissed"
}
// @from(Ln 528156, Col 4)
o55 = L(() => {
    vM();
    Ru()
})
// @from(Ln 528161, Col 0)
function a55(q) {
    let K = q.match(/^@([\w-]+)\s+(.+)$/s);
    if (!K) return null;
    let [, _, z] = K;
    if (!_ || !z) return null;
    let Y = z.trim();
    if (!Y) return null;
    return {
        recipientName: _,
        message: Y
    }
}
// @from(Ln 528173, Col 0)
async function s55(q, K, _, z) {
    if (!_ || !z) return {
        success: !1,
        error: "no_team_context"
    };
    if (!Object.values(_.teammates ?? {}).find((A) => A.name === q)) return {
        success: !1,
        error: "unknown_recipient",
        recipientName: q
    };
    return await z(q, {
        from: "user",
        text: K,
        timestamp: new Date().toISOString()
    }, _.teamName), {
        success: !0,
        recipientName: q
    }
}
// @from(Ln 528193, Col 0)
function t55(q) {
    return q in xM7
}
// @from(Ln 528196, Col 4)
xM7
// @from(Ln 528197, Col 4)
e55 = L(() => {
    xM7 = {
        "†": "alt+t",
        π: "alt+p",
        ø: "alt+o"
    }
})
// @from(Ln 528205, Col 0)
function q35(q) {
    {
        let K = $L(),
            _ = !!q.isAutoModeAvailable && K;
        if (!_) E(`[auto-mode] canCycleToAuto=false: ctx.isAutoModeAvailable=${q.isAutoModeAvailable} isAutoModeGateEnabled=${K} reason=${ge()}`);
        return _
    }
    return !1
}
// @from(Ln 528215, Col 0)
function lW6(q, K) {
    switch (q.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (q.isBypassPermissionsModeAvailable) return "bypassPermissions";
            if (q35(q)) return "auto";
            return "default";
        case "bypassPermissions":
            if (q35(q)) return "auto";
            return "default";
        case "dontAsk":
            return "default";
        default:
            return "default"
    }
}
// @from(Ln 528235, Col 0)
function K35(q, K) {
    let _ = lW6(q, K);
    return {
        nextMode: _,
        context: Fe(q.mode, _, q)
    }
}
// @from(Ln 528242, Col 4)
uM7 = L(() => {
    K8();
    vX()
})
// @from(Ln 528246, Col 4)
_35 = {}
// @from(Ln 528252, Col 0)
function mM7(q) {
    let K = s(18),
        {
            onAccept: _,
            onDecline: z,
            declineExits: Y
        } = q,
        A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = [], K[0] = A;
    else A = K[0];
    nW6.default.useEffect(y3A, A);
    let O;
    if (K[1] !== _ || K[2] !== z) O = function(Z) {
        q: switch (Z) {
            case "accept": {
                d("tengu_auto_mode_opt_in_dialog_accept", {}), P7("userSettings", {
                    skipAutoPermissionPrompt: !0
                }), _();
                break q
            }
            case "accept-default": {
                d("tengu_auto_mode_opt_in_dialog_accept_default", {}), P7("userSettings", {
                    skipAutoPermissionPrompt: !0,
                    permissions: {
                        defaultMode: "auto"
                    }
                }), _();
                break q
            }
            case "decline":
                d("tengu_auto_mode_opt_in_dialog_decline", {}), z()
        }
    }, K[1] = _, K[2] = z, K[3] = O;
    else O = K[3];
    let w = O,
        $;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) $ = nW6.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, nW6.default.createElement(T, null, bs8), nW6.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/security"
    })), K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) j = [{
        label: "Yes, and make it my default mode",
        value: "accept-default"
    }], K[5] = j;
    else j = K[5];
    let H;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) H = {
        label: "Yes, enable auto mode",
        value: "accept"
    }, K[6] = H;
    else H = K[6];
    let J = Y ? "No, exit" : "No, go back",
        X;
    if (K[7] !== J) X = [...j, H, {
        label: J,
        value: "decline"
    }], K[7] = J, K[8] = X;
    else X = K[8];
    let M;
    if (K[9] !== w) M = (D) => w(D), K[9] = w, K[10] = M;
    else M = K[10];
    let P;
    if (K[11] !== z || K[12] !== X || K[13] !== M) P = nW6.default.createElement(A1, {
        options: X,
        onChange: M,
        onCancel: z
    }), K[11] = z, K[12] = X, K[13] = M, K[14] = P;
    else P = K[14];
    let W;
    if (K[15] !== z || K[16] !== P) W = nW6.default.createElement(R1, {
        title: "Enable auto mode?",
        color: "warning",
        onCancel: z
    }, $, P), K[15] = z, K[16] = P, K[17] = W;
    else W = K[17];
    return W
}
// @from(Ln 528334, Col 0)
function y3A() {
    d("tengu_auto_mode_opt_in_dialog_shown", {})
}
// @from(Ln 528337, Col 4)
nW6
// @from(Ln 528337, Col 9)
bs8 = "Auto mode lets Claude handle permission prompts automatically — Claude checks each tool call for risky actions and prompt injection before executing. Actions Claude identifies as safe are executed, while actions Claude identifies as risky are blocked and Claude may try a different approach. Ideal for long-running tasks. Sessions are slightly more expensive. Claude can make mistakes that allow harmful commands to run, it's recommended to only use in isolated environments. Shift+Tab to change mode."
// @from(Ln 528338, Col 4)
Is8 = L(() => {
    o6();
    C8();
    g6();
    a1();
    g_();
    S4();
    nW6 = K6(P6(), 1)
})
// @from(Ln 528351, Col 0)
function z35(q) {
    let K = s(96),
        {
            onDone: _
        } = q;
    A2("bridge-dialog");
    let z = M8(d3A),
        Y = M8(Q3A),
        A = M8(U3A),
        O = M8(g3A),
        w = M8(F3A),
        $ = M8(p3A),
        j = M8(B3A),
        H = M8(m3A),
        J = M8(u3A),
        X = M8(x3A),
        M = R7(),
        [P, W] = iW6.useState(!1),
        [D, Z] = iW6.useState(""),
        [G, f] = iW6.useState(""),
        v;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) v = L3A(Y7()), K[0] = v;
    else v = K[0];
    let V = v,
        k, N;
    if (K[1] === Symbol.for("react.memo_cache_sentinel")) k = () => {
        rj().then(f).catch(I3A)
    }, N = [], K[1] = k, K[2] = N;
    else k = K[1], N = K[2];
    iW6.useEffect(k, N);
    let R = Y ? w : O,
        h, C;
    if (K[3] !== R || K[4] !== P) h = () => {
        if (!P || !R) {
            Z("");
            return
        }
        yu(R, {
            type: "utf8",
            errorCorrectionLevel: "L",
            small: !0
        }).then(Z).catch(() => Z(""))
    }, C = [P, R], K[3] = R, K[4] = P, K[5] = h, K[6] = C;
    else h = K[5], C = K[6];
    iW6.useEffect(h, C);
    let x;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) x = () => {
        W(b3A)
    }, K[7] = x;
    else x = K[7];
    let B;
    if (K[8] !== _) B = {
        "confirm:yes": _,
        "confirm:toggle": x
    }, K[8] = _, K[9] = B;
    else B = K[9];
    let m;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) m = {
        context: "Confirmation"
    }, K[10] = m;
    else m = K[10];
    L7(B, m);
    let S;
    if (K[11] !== j || K[12] !== _ || K[13] !== M) S = function(G6) {
        if (G6.key === "d" && !G6.ctrl && !G6.meta) {
            if (G6.preventDefault(), j) d8(C3A);
            M(S3A), _()
        }
    }, K[11] = j, K[12] = _, K[13] = M, K[14] = S;
    else S = K[14];
    let F = S,
        U;
    if (K[15] !== z || K[16] !== $ || K[17] !== A || K[18] !== Y) U = vF8({
        error: $,
        connected: z,
        sessionActive: Y,
        reconnecting: A
    }), K[15] = z, K[16] = $, K[17] = A, K[18] = Y, K[19] = U;
    else U = K[19];
    let {
        label: g,
        color: c
    } = U, n = $ ? wX8 : OX8, l, z6, A6, e, i, O6, J6, $6, H6, q6, o, _6, r;
    if (K[20] !== G || K[21] !== R || K[22] !== H || K[23] !== $ || K[24] !== F || K[25] !== n || K[26] !== _ || K[27] !== D || K[28] !== Y || K[29] !== J || K[30] !== P || K[31] !== c || K[32] !== g || K[33] !== X) {
        let f6 = D ? D.split(`
`).filter(R3A) : [],
            G6;
        if (K[47] !== G) {
            if (G6 = [], V) G6.push(V);
            if (G) G6.push(G);
            K[47] = G, K[48] = G6
        } else G6 = K[48];
        let k6 = G6.length > 0 ? " · " + G6.join(" · ") : "",
            T6;
        if (K[49] !== R || K[50] !== $ || K[51] !== Y) T6 = $ ? kF8 : R ? Y ? VF8(R) : TF8(R) : void 0, K[49] = R, K[50] = $, K[51] = Y, K[52] = T6;
        else T6 = K[52];
        A6 = T6, z6 = R1, o = "Remote Control", _6 = _, r = !0, l = u, e = "column", i = 1, O6 = 0, J6 = !0, $6 = F;
        let v6;
        if (K[53] !== n || K[54] !== c || K[55] !== g) v6 = gY.createElement(T, {
            color: c
        }, n, " ", g), K[53] = n, K[54] = c, K[55] = g, K[56] = v6;
        else v6 = K[56];
        let L6;
        if (K[57] !== k6) L6 = gY.createElement(T, {
            dimColor: !0
        }, k6), K[57] = k6, K[58] = L6;
        else L6 = K[58];
        let y6;
        if (K[59] !== v6 || K[60] !== L6) y6 = gY.createElement(T, null, v6, L6), K[59] = v6, K[60] = L6, K[61] = y6;
        else y6 = K[61];
        let c6;
        if (K[62] !== $) c6 = $ && gY.createElement(T, {
            color: "error"
        }, $), K[62] = $, K[63] = c6;
        else c6 = K[63];
        let Z8;
        if (K[64] !== H || K[65] !== X) Z8 = X && H && gY.createElement(T, {
            dimColor: !0
        }, "Environment: ", H), K[64] = H, K[65] = X, K[66] = Z8;
        else Z8 = K[66];
        let N8;
        if (K[67] !== J || K[68] !== X) N8 = X && J && gY.createElement(T, {
            dimColor: !0
        }, "Session: ", J), K[67] = J, K[68] = X, K[69] = N8;
        else N8 = K[69];
        if (K[70] !== y6 || K[71] !== c6 || K[72] !== Z8 || K[73] !== N8) H6 = gY.createElement(u, {
            flexDirection: "column"
        }, y6, c6, Z8, N8), K[70] = y6, K[71] = c6, K[72] = Z8, K[73] = N8, K[74] = H6;
        else H6 = K[74];
        q6 = P && f6.length > 0 && gY.createElement(u, {
            flexDirection: "column"
        }, f6.map(h3A)), K[20] = G, K[21] = R, K[22] = H, K[23] = $, K[24] = F, K[25] = n, K[26] = _, K[27] = D, K[28] = Y, K[29] = J, K[30] = P, K[31] = c, K[32] = g, K[33] = X, K[34] = l, K[35] = z6, K[36] = A6, K[37] = e, K[38] = i, K[39] = O6, K[40] = J6, K[41] = $6, K[42] = H6, K[43] = q6, K[44] = o, K[45] = _6, K[46] = r
    } else l = K[34], z6 = K[35], A6 = K[36], e = K[37], i = K[38], O6 = K[39], J6 = K[40], $6 = K[41], H6 = K[42], q6 = K[43], o = K[44], _6 = K[45], r = K[46];
    let t;
    if (K[75] !== A6) t = A6 && gY.createElement(T, {
        dimColor: !0
    }, A6), K[75] = A6, K[76] = t;
    else t = K[76];
    let Y6, X6;
    if (K[77] === Symbol.for("react.memo_cache_sentinel")) Y6 = gY.createElement(A8, {
        chord: "d",
        action: "disconnect"
    }), X6 = gY.createElement(T, null, "space for QR code"), K[77] = Y6, K[78] = X6;
    else Y6 = K[77], X6 = K[78];
    let M6;
    if (K[79] === Symbol.for("react.memo_cache_sentinel")) M6 = gY.createElement(T, {
        dimColor: !0
    }, gY.createElement(z1, null, Y6, X6, gY.createElement(A8, {
        chord: ["enter", "escape"],
        action: "close"
    }))), K[79] = M6;
    else M6 = K[79];
    let W6;
    if (K[80] !== l || K[81] !== e || K[82] !== i || K[83] !== O6 || K[84] !== J6 || K[85] !== $6 || K[86] !== H6 || K[87] !== q6 || K[88] !== t) W6 = gY.createElement(l, {
        flexDirection: e,
        gap: i,
        tabIndex: O6,
        autoFocus: J6,
        onKeyDown: $6
    }, H6, q6, t, M6), K[80] = l, K[81] = e, K[82] = i, K[83] = O6, K[84] = J6, K[85] = $6, K[86] = H6, K[87] = q6, K[88] = t, K[89] = W6;
    else W6 = K[89];
    let V6;
    if (K[90] !== z6 || K[91] !== o || K[92] !== _6 || K[93] !== r || K[94] !== W6) V6 = gY.createElement(z6, {
        title: o,
        onCancel: _6,
        hideInputGuide: r
    }, W6), K[90] = z6, K[91] = o, K[92] = _6, K[93] = r, K[94] = W6, K[95] = V6;
    else V6 = K[95];
    return V6
}
// @from(Ln 528522, Col 0)
function h3A(q, K) {
    return gY.createElement(T, {
        key: K
    }, q)
}
// @from(Ln 528528, Col 0)
function R3A(q) {
    return q.length > 0
}
// @from(Ln 528532, Col 0)
function S3A(q) {
    if (!q.replBridgeEnabled) return q;
    return {
        ...q,
        replBridgeEnabled: !1
    }
}
// @from(Ln 528540, Col 0)
function C3A(q) {
    if (q.remoteControlAtStartup === !1) return q;
    return {
        ...q,
        remoteControlAtStartup: !1
    }
}
// @from(Ln 528548, Col 0)
function b3A(q) {
    return !q
}
// @from(Ln 528552, Col 0)
function I3A() {}
// @from(Ln 528554, Col 0)
function x3A(q) {
    return q.verbose
}
// @from(Ln 528558, Col 0)
function u3A(q) {
    return q.replBridgeSessionId
}
// @from(Ln 528562, Col 0)
function m3A(q) {
    return q.replBridgeEnvironmentId
}
// @from(Ln 528566, Col 0)
function B3A(q) {
    return q.replBridgeExplicit
}
// @from(Ln 528570, Col 0)
function p3A(q) {
    return q.replBridgeError
}
// @from(Ln 528574, Col 0)
function F3A(q) {
    return q.replBridgeSessionUrl
}
// @from(Ln 528578, Col 0)
function g3A(q) {
    return q.replBridgeConnectUrl
}
// @from(Ln 528582, Col 0)
function U3A(q) {
    return q.replBridgeReconnecting
}
// @from(Ln 528586, Col 0)
function Q3A(q) {
    return q.replBridgeSessionActive
}
// @from(Ln 528590, Col 0)
function d3A(q) {
    return q.replBridgeConnected
}
// @from(Ln 528593, Col 4)
gY
// @from(Ln 528593, Col 8)
iW6
// @from(Ln 528594, Col 4)
Y35 = L(() => {
    o6();
    lx6();
    y8();
    $96();
    A3();
    CP();
    g6();
    C7();
    N7();
    h1();
    pK();
    Nq();
    S4();
    u7();
    gY = K6(P6(), 1), iW6 = K6(P6(), 1)
})
// @from(Ln 528612, Col 0)
function O35(q, K) {
    let _ = new Set;
    for (let {
            id: z,
            tokenCount: Y
        }
        of K) {
        _.add(z);
        let A = q.get(z);
        if (!A) q.set(z, A = []);
        if (A.push(Y), A.length > A35) A.splice(0, A.length - A35)
    }
    for (let z of q.keys())
        if (!_.has(z)) q.delete(z)
}
// @from(Ln 528628, Col 0)
function n3A(q) {
    if ("label" in q && typeof q.label === "string") return q.label;
    if (q.type === "local_agent") return q.progress?.summary;
    if (q.type === "local_bash" && q.kind !== "monitor") return q.command;
    if (q.type === "local_workflow") return q.workflowName ?? q.summary;
    if (q.type === "remote_agent") return q.title;
    if (q.type === "in_process_teammate") return $u6(q);
    return
}
// @from(Ln 528638, Col 0)
function i3A() {
    let q = Ey() ? E1("policySettings")?.subagentStatusLine : gQ6("subagentStatusLine");
    return q?.type === "command" ? q.command : void 0
}
// @from(Ln 528642, Col 0)
async function w35(q, K, _, z) {
    if (Kt()) return {};
    if (Z66()) return E("Skipping subagentStatusLine execution - workspace trust not accepted"), {};
    let Y = i3A();
    if (Y === void 0 || q.length === 0) return {};
    let A = b8(),
        O = {
            ...J9(),
            columns: K,
            tasks: q.map((H) => ({
                id: H.id,
                name: _.get(H.id),
                type: H.type,
                status: H.status,
                description: H.description,
                label: n3A(H) || H.description,
                startTime: H.startTime,
                tokenCount: H.progress?.tokenCount ?? 0,
                tokenSamples: z.get(H.id) ?? [],
                cwd: H.cwd ?? A
            }))
        },
        w = y1() === "windows",
        $ = await M7(Y, [], {
            shell: w ? _Q6() : !0,
            cwd: A,
            env: {
                ...Dk(),
                CLAUDE_PROJECT_DIR: w ? sX(c9()) : c9()
            },
            timeout: c3A,
            input: I6(O),
            preserveOutputOnError: !0
        });
    if ($.code !== 0) return E(`subagentStatusLine exited ${$.code}: ${$.error??$.stderr}`, {
        level: "error"
    }), {};
    let j = {};
    for (let H of $.stdout.split(`
`)) {
        if (!H.trim()) continue;
        let J;
        try {
            J = n8(H)
        } catch {
            E(`subagentStatusLine emitted non-JSON line: ${H}`, {
                level: "error"
            });
            continue
        }
        let X = l3A().safeParse(J);
        if (!X.success) {
            E(`subagentStatusLine emitted invalid schema: ${X.error.message}`, {
                level: "error"
            });
            continue
        }
        j[X.data.id] = {
            content: X.data.content
        }
    }
    return j
}
// @from(Ln 528705, Col 4)
c3A = 5000
// @from(Ln 528706, Col 4)
l3A
// @from(Ln 528706, Col 9)
BM7 = 4
// @from(Ln 528707, Col 4)
A35 = 16
// @from(Ln 528708, Col 4)
pM7 = L(() => {
    p7();
    y8();
    Y66();
    n7();
    K8();
    Q4();
    Bc();
    K9();
    NK();
    a1();
    e8();
    zy();
    rC();
    l3A = C6(() => y.object({
        id: y.string(),
        content: y.string()
    }))
})
// @from(Ln 528728, Col 0)
function YY8(q) {
    return Object.values(q).filter((K) => aRK(K) && K.evictAfter !== 0).sort((K, _) => K.startTime - _.startTime)
}
// @from(Ln 528732, Col 0)
function xs8(q, K) {
    return YY8(q).filter((_) => K[_.id]?.content !== "")
}
// @from(Ln 528736, Col 0)
function $35(q, K, _) {
    if (q < 1) return q;
    for (let z = Math.min(q, K.length) - 1; z >= 0; z--) {
        let Y = _.indexOf(K[z]);
        if (Y !== -1) return Y + 1
    }
    return 0
}
// @from(Ln 528745, Col 0)
function us8() {
    let q = M8(o3A),
        K = M8(r3A),
        _;
    return _ = 0, _
}
// @from(Ln 528752, Col 0)
function r3A(q) {
    return q.taskDecorations
}
// @from(Ln 528756, Col 0)
function o3A(q) {
    return q.tasks
}
// @from(Ln 528759, Col 4)
vm6
// @from(Ln 528760, Col 4)
AY8 = L(() => {
    o6();
    A3();
    n5();
    g6();
    N7();
    Ru();
    $S();
    vM();
    c7();
    pM7();
    Nq();
    u7();
    Y66();
    vm6 = K6(P6(), 1)
})
// @from(Ln 528776, Col 4)
j35
// @from(Ln 528777, Col 4)
FM7 = L(() => {
    g6();
    j35 = K6(P6(), 1)
})
// @from(Ln 528781, Col 4)
a3A
// @from(Ln 528781, Col 9)
H35
// @from(Ln 528782, Col 4)
ms8 = L(() => {
    o6();
    R_6();
    I4();
    y$6();
    g6();
    EP6();
    Nq();
    u7();
    xE6();
    DJ();
    a3A = K6(P6(), 1), H35 = K6(P6(), 1)
})
// @from(Ln 528795, Col 4)
X35
// @from(Ln 528795, Col 9)
gM7
// @from(Ln 528796, Col 4)
M35 = L(() => {
    o6();
    CP();
    I4();
    g6();
    C8();
    n7();
    Tn();
    c7();
    FM7();
    Sz();
    Ph6();
    BI();
    ms8();
    Qy();
    X35 = K6(P6(), 1), gM7 = K6(P6(), 1)
})
// @from(Ln 528813, Col 4)
t3A
// @from(Ln 528813, Col 9)
UM7
// @from(Ln 528814, Col 4)
P35 = L(() => {
    CP();
    II();
    I4();
    n5();
    ha6();
    g6();
    C8();
    c7();
    ms8();
    t3A = K6(P6(), 1), UM7 = K6(P6(), 1)
})
// @from(Ln 528826, Col 4)
W35
// @from(Ln 528826, Col 9)
QM7
// @from(Ln 528827, Col 4)
D35 = L(() => {
    o6();
    CP();
    g98();
    I4();
    g6();
    C8();
    n7();
    Tn();
    c7();
    FM7();
    Ph6();
    ms8();
    Qy();
    W35 = K6(P6(), 1), QM7 = K6(P6(), 1)
})
// @from(Ln 528844, Col 0)
function f35(q) {
    let K = s(27),
        {
            currentValue: _,
            onSelect: z,
            onCancel: Y,
            isMidConversation: A
        } = q,
        O = $3(),
        [w, $] = Z35.useState(null),
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = [{
        value: "true",
        label: "Enabled",
        description: "Claude will think before responding"
    }, {
        value: "false",
        label: "Disabled",
        description: "Claude will respond without extended thinking"
    }], K[0] = j;
    else j = K[0];
    let H = j,
        J;
    if (K[1] !== w || K[2] !== Y) J = () => {
        if (w !== null) $(null);
        else Y?.()
    }, K[1] = w, K[2] = Y, K[3] = J;
    else J = K[3];
    let X;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Confirmation"
    }, K[4] = X;
    else X = K[4];
    G1("confirm:no", J, X);
    let M;
    if (K[5] !== w || K[6] !== z) M = () => {
        if (w !== null) z(w)
    }, K[5] = w, K[6] = z, K[7] = M;
    else M = K[7];
    let P = w !== null,
        W;
    if (K[8] !== P) W = {
        context: "Confirmation",
        isActive: P
    }, K[8] = P, K[9] = W;
    else W = K[9];
    G1("confirm:yes", M, W);
    let D;
    if (K[10] !== _ || K[11] !== A || K[12] !== z) D = function(N) {
        let R = N === "true";
        if (A && R !== _) $(R);
        else z(R)
    }, K[10] = _, K[11] = A, K[12] = z, K[13] = D;
    else D = K[13];
    let Z = D,
        G;
    if (K[14] === Symbol.for("react.memo_cache_sentinel")) G = n_.createElement(u, {
        marginBottom: 1,
        flexDirection: "column"
    }, n_.createElement(T, {
        color: "remember",
        bold: !0
    }, "Toggle thinking mode"), n_.createElement(T, {
        dimColor: !0
    }, "Enable or disable thinking for this session.")), K[14] = G;
    else G = K[14];
    let f;
    if (K[15] !== w || K[16] !== _ || K[17] !== Z || K[18] !== Y) f = n_.createElement(u, {
        flexDirection: "column"
    }, G, w !== null ? n_.createElement(u, {
        flexDirection: "column",
        marginBottom: 1,
        gap: 1
    }, n_.createElement(T, {
        color: "warning"
    }, "Changing thinking mode mid-conversation will increase latency and may reduce quality. For best results, set this at the start of a session."), n_.createElement(T, {
        color: "warning"
    }, "Do you want to proceed?")) : n_.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, n_.createElement(A1, {
        defaultValue: _ ? "true" : "false",
        defaultFocusValue: _ ? "true" : "false",
        options: H,
        onChange: Z,
        onCancel: Y ?? e3A,
        visibleOptionCount: 2
    }))), K[15] = w, K[16] = _, K[17] = Z, K[18] = Y, K[19] = f;
    else f = K[19];
    let v;
    if (K[20] !== w || K[21] !== O.keyName || K[22] !== O.pending) v = n_.createElement(T, {
        dimColor: !0,
        italic: !0
    }, O.pending ? n_.createElement(n_.Fragment, null, "Press ", O.keyName, " again to exit") : w !== null ? n_.createElement(z1, null, n_.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), n_.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })) : n_.createElement(z1, null, n_.createElement(A8, {
        chord: "enter",
        action: "confirm"
    }), n_.createElement(v1, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "exit"
    }))), K[20] = w, K[21] = O.keyName, K[22] = O.pending, K[23] = v;
    else v = K[23];
    let V;
    if (K[24] !== v || K[25] !== f) V = n_.createElement(A_, {
        color: "permission"
    }, f, v), K[24] = v, K[25] = f, K[26] = V;
    else V = K[26];
    return V
}
// @from(Ln 528963, Col 0)
function e3A() {}
// @from(Ln 528964, Col 4)
n_
// @from(Ln 528964, Col 8)
Z35
// @from(Ln 528965, Col 4)
G35 = L(() => {
    o6();
    C$();
    g6();
    C7();
    bK();
    g_();
    Nq();
    u7();
    DJ();
    n_ = K6(P6(), 1), Z35 = K6(P6(), 1)
})
// @from(Ln 528978, Col 0)
function v35(q) {
    let K = uM(q);
    if (!K) return [];
    let _ = new Set(K.hiddenPaneIds ?? []),
        z = [];
    for (let Y of K.members) {
        if (Y.name === "team-lead") continue;
        let O = Y.isActive !== !1 ? "running" : "idle";
        z.push({
            name: Y.name,
            agentId: Y.agentId,
            agentType: Y.agentType,
            model: Y.model,
            prompt: Y.prompt,
            status: O,
            color: Y.color,
            tmuxPaneId: Y.tmuxPaneId,
            cwd: Y.cwd,
            worktreePath: Y.worktreePath,
            isHidden: _.has(Y.tmuxPaneId),
            backendType: Y.backendType && zJ6(Y.backendType) ? Y.backendType : void 0,
            mode: Y.mode
        })
    }
    return z
}
// @from(Ln 529004, Col 4)
T35 = L(() => {
    BD()
})
// @from(Ln 529011, Col 0)
function V35({
    initialTeams: q,
    onDone: K
}) {
    A2("teams-dialog");
    let _ = R7(),
        z = q?.[0]?.name ?? "",
        [Y, A] = rS.useState({
            type: "teammateList",
            teamName: z
        }),
        [O, w] = rS.useState(0),
        [$, j] = rS.useState(0),
        H = rS.useMemo(() => {
            return v35(Y.teamName)
        }, [Y.teamName, $]);
    fD(() => {
        j((Z) => Z + 1)
    }, 1000);
    let J = rS.useMemo(() => {
            if (Y.type !== "teammateDetail") return null;
            return H.find((Z) => Z.name === Y.memberName) ?? null
        }, [Y, H]),
        X = M8((Z) => Z.toolPermissionContext.isBypassPermissionsModeAvailable),
        M = () => {
            A({
                type: "teammateList",
                teamName: Y.teamName
            }), w(0)
        },
        P = rS.useCallback(() => {
            if (Y.type === "teammateDetail" && J) j9A(J, Y.teamName, X), j((Z) => Z + 1);
            else if (Y.type === "teammateList" && H.length > 0) H9A(H, Y.teamName, X), j((Z) => Z + 1)
        }, [Y, J, H, X]);
    L7({
        "confirm:cycleMode": P
    }, {
        context: "Confirmation"
    });

    function W(Z) {
        if (Z.key === "left") {
            if (Z.preventDefault(), Y.type === "teammateDetail") M();
            return
        }
        if (Z.key === "up" || Z.key === "down") {
            Z.preventDefault();
            let G = D();
            if (Z.key === "up") w((f) => Math.max(0, f - 1));
            else w((f) => Math.min(G, f + 1));
            return
        }
        if (Z.key === "return") {
            if (Z.preventDefault(), Y.type === "teammateList" && H[O]) A({
                type: "teammateDetail",
                teamName: Y.teamName,
                memberName: H[O].name
            });
            else if (Y.type === "teammateDetail" && J) O9A(J.tmuxPaneId, J.backendType), K();
            return
        }
        if (Z.key === "k" && !Z.ctrl && !Z.meta) {
            if (Z.preventDefault(), Y.type === "teammateList" && H[O]) dM7(H[O].tmuxPaneId, H[O].backendType, Y.teamName, H[O].agentId, H[O].name, _).then(() => {
                j((G) => G + 1), w((G) => Math.max(0, Math.min(G, H.length - 2)))
            });
            else if (Y.type === "teammateDetail" && J) dM7(J.tmuxPaneId, J.backendType, Y.teamName, J.agentId, J.name, _), M();
            return
        }
        if (Z.key === "s" && !Z.ctrl && !Z.meta) {
            if (Z.preventDefault(), Y.type === "teammateList" && H[O]) {
                let G = H[O];
                RI8(G.name, Y.teamName, "Graceful shutdown requested by team lead")
            } else if (Y.type === "teammateDetail" && J) RI8(J.name, Y.teamName, "Graceful shutdown requested by team lead"), M();
            return
        }
        if (Z.key === "h" && !Z.ctrl && !Z.meta) {
            Z.preventDefault();
            let G = VI6(),
                f = Y.type === "teammateList" ? H[O] : Y.type === "teammateDetail" ? J : null;
            if (f && G?.supportsHideShow) {
                if (w9A(f, Y.teamName).then(() => {
                        j((v) => v + 1)
                    }), Y.type === "teammateDetail") M()
            }
            return
        }
        if (Z.key === "H" && !Z.ctrl && !Z.meta && Y.type === "teammateList") {
            if (Z.preventDefault(), VI6()?.supportsHideShow && H.length > 0) {
                let f = H.some((v) => !v.isHidden);
                Promise.all(H.map((v) => f ? k35(v, Y.teamName) : N35(v, Y.teamName))).then(() => {
                    j((v) => v + 1)
                })
            }
            return
        }
        if (Z.key === "p" && !Z.ctrl && !Z.meta && Y.type === "teammateList") {
            Z.preventDefault();
            let G = H.filter((f) => f.status === "idle");
            if (G.length > 0) Promise.all(G.map((f) => dM7(f.tmuxPaneId, f.backendType, Y.teamName, f.agentId, f.name, _))).then(() => {
                j((f) => f + 1), w((f) => Math.max(0, Math.min(f, H.length - G.length - 1)))
            });
            return
        }
    }

    function D() {
        if (Y.type === "teammateList") return Math.max(0, H.length - 1);
        return 0
    }
    if (Y.type === "teammateList") return VK.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: W
    }, VK.createElement(K9A, {
        teamName: Y.teamName,
        teammates: H,
        selectedIndex: O,
        onCancel: K
    }));
    if (Y.type === "teammateDetail" && J) return VK.createElement(u, {
        flexDirection: "column",
        onKeyDown: W
    }, VK.createElement(z9A, {
        teammate: J,
        teamName: Y.teamName,
        onCancel: M
    }));
    return null
}
// @from(Ln 529142, Col 0)
function K9A(q) {
    let K = s(13),
        {
            teamName: _,
            teammates: z,
            selectedIndex: Y,
            onCancel: A
        } = q,
        O = `${z.length} ${z.length===1?"teammate":"teammates"}`,
        w = VI6()?.supportsHideShow ?? !1,
        $ = V3("confirm:cycleMode", "Confirmation", "shift+tab"),
        j = `Team ${_}`,
        H;
    if (K[0] !== Y || K[1] !== z) H = z.length === 0 ? VK.createElement(T, {
        dimColor: !0
    }, "No teammates") : VK.createElement(u, {
        flexDirection: "column"
    }, z.map((P, W) => VK.createElement(_9A, {
        key: P.agentId,
        teammate: P,
        isSelected: W === Y
    }))), K[0] = Y, K[1] = z, K[2] = H;
    else H = K[2];
    let J;
    if (K[3] !== A || K[4] !== O || K[5] !== j || K[6] !== H) J = VK.createElement(R1, {
        title: j,
        subtitle: O,
        onCancel: A,
        color: "background",
        hideInputGuide: !0
    }, H), K[3] = A, K[4] = O, K[5] = j, K[6] = H, K[7] = J;
    else J = K[7];
    let X;
    if (K[8] !== $) X = VK.createElement(u, {
        marginLeft: 1
    }, VK.createElement(T, {
        dimColor: !0
    }, e6.arrowUp, "/", e6.arrowDown, " select · Enter view · k kill · s shutdown · p prune idle", w && " · h hide/show · H hide/show all", " · ", $, " sync cycle modes for all · Esc close")), K[8] = $, K[9] = X;
    else X = K[9];
    let M;
    if (K[10] !== J || K[11] !== X) M = VK.createElement(VK.Fragment, null, J, X), K[10] = J, K[11] = X, K[12] = M;
    else M = K[12];
    return M
}
// @from(Ln 529187, Col 0)
function _9A(q) {
    let K = s(21),
        {
            teammate: _,
            isSelected: z
        } = q,
        Y = _.status === "idle",
        A = Y && !z,
        O, w;
    if (K[0] !== _.mode) {
        let D = _.mode ? yV(_.mode) : "default";
        O = CQ6(D), w = LV(D), K[0] = _.mode, K[1] = O, K[2] = w
    } else O = K[1], w = K[2];
    let $ = w,
        j = z ? "suggestion" : void 0,
        H = z ? e6.pointer + " " : "  ",
        J;
    if (K[3] !== _.isHidden) J = _.isHidden && VK.createElement(T, {
        dimColor: !0
    }, "[hidden] "), K[3] = _.isHidden, K[4] = J;
    else J = K[4];
    let X;
    if (K[5] !== Y) X = Y && VK.createElement(T, {
        dimColor: !0
    }, "[idle] "), K[5] = Y, K[6] = X;
    else X = K[6];
    let M;
    if (K[7] !== $ || K[8] !== O) M = O && VK.createElement(T, {
        color: $
    }, O, " "), K[7] = $, K[8] = O, K[9] = M;
    else M = K[9];
    let P;
    if (K[10] !== _.model) P = _.model && VK.createElement(T, {
        dimColor: !0
    }, " (", _.model, ")"), K[10] = _.model, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== A || K[13] !== j || K[14] !== H || K[15] !== J || K[16] !== X || K[17] !== M || K[18] !== P || K[19] !== _.name) W = VK.createElement(T, {
        color: j,
        dimColor: A
    }, H, J, X, M, "@", _.name, P), K[12] = A, K[13] = j, K[14] = H, K[15] = J, K[16] = X, K[17] = M, K[18] = P, K[19] = _.name, K[20] = W;
    else W = K[20];
    return W
}
// @from(Ln 529232, Col 0)
function z9A(q) {
    let K = s(39),
        {
            teammate: _,
            teamName: z,
            onCancel: Y
        } = q,
        [A, O] = rS.useState(!1),
        w = V3("confirm:cycleMode", "Confirmation", "shift+tab"),
        $ = _.color ? QP[_.color] : void 0,
        j;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) j = [], K[0] = j;
    else j = K[0];
    let [H, J] = rS.useState(j), X, M;
    if (K[1] !== z || K[2] !== _.agentId || K[3] !== _.name) X = () => {
        let F = !1;
        return Qf(z).then((U) => {
            if (F) return;
            J(U.filter((g) => g.owner === _.agentId || g.owner === _.name))
        }), () => {
            F = !0
        }
    }, M = [z, _.agentId, _.name], K[1] = z, K[2] = _.agentId, K[3] = _.name, K[4] = X, K[5] = M;
    else X = K[4], M = K[5];
    rS.useEffect(X, M);
    let P;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) P = function(U) {
        if (U.key === "p" && !U.ctrl && !U.meta) U.preventDefault(), O(A9A)
    }, K[6] = P;
    else P = K[6];
    let W = P,
        D = _.worktreePath || _.cwd,
        Z;
    if (K[7] !== _.model || K[8] !== _.worktreePath || K[9] !== D) {
        if (Z = [], _.model) Z.push(_.model);
        if (D) Z.push(_.worktreePath ? `worktree: ${D}` : D);
        K[7] = _.model, K[8] = _.worktreePath, K[9] = D, K[10] = Z
    } else Z = K[10];
    let G = Z.join(" · ") || void 0,
        f, v;
    if (K[11] !== _.mode) {
        let F = _.mode ? yV(_.mode) : "default";
        f = CQ6(F), v = LV(F), K[11] = _.mode, K[12] = f, K[13] = v
    } else f = K[12], v = K[13];
    let V = v,
        k;
    if (K[14] !== V || K[15] !== f) k = f && VK.createElement(T, {
        color: V
    }, f, " "), K[14] = V, K[15] = f, K[16] = k;
    else k = K[16];
    let N;
    if (K[17] !== _.name || K[18] !== $) N = $ ? VK.createElement(T, {
        color: $
    }, `@${_.name}`) : `@${_.name}`, K[17] = _.name, K[18] = $, K[19] = N;
    else N = K[19];
    let R;
    if (K[20] !== k || K[21] !== N) R = VK.createElement(VK.Fragment, null, k, N), K[20] = k, K[21] = N, K[22] = R;
    else R = K[22];
    let h = R,
        C;
    if (K[23] !== H) C = H.length > 0 && VK.createElement(u, {
        flexDirection: "column"
    }, VK.createElement(T, {
        bold: !0
    }, "Tasks"), H.map(Y9A)), K[23] = H, K[24] = C;
    else C = K[24];
    let x;
    if (K[25] !== A || K[26] !== _.prompt) x = _.prompt && VK.createElement(u, {
        flexDirection: "column"
    }, VK.createElement(T, {
        bold: !0
    }, "Prompt"), VK.createElement(T, null, A ? _.prompt : j4(_.prompt, 80), N1(_.prompt) > 80 && !A && VK.createElement(T, {
        dimColor: !0
    }, " (p to expand)"))), K[25] = A, K[26] = _.prompt, K[27] = x;
    else x = K[27];
    let B;
    if (K[28] !== Y || K[29] !== G || K[30] !== x || K[31] !== C || K[32] !== h) B = VK.createElement(R1, {
        title: h,
        subtitle: G,
        onCancel: Y,
        color: "background",
        hideInputGuide: !0
    }, C, x), K[28] = Y, K[29] = G, K[30] = x, K[31] = C, K[32] = h, K[33] = B;
    else B = K[33];
    let m;
    if (K[34] !== w) m = VK.createElement(u, {
        marginLeft: 1
    }, VK.createElement(T, {
        dimColor: !0
    }, e6.arrowLeft, " back · Esc close · k kill · s shutdown", VI6()?.supportsHideShow && " · h hide/show", " · ", w, " cycle mode")), K[34] = w, K[35] = m;
    else m = K[35];
    let S;
    if (K[36] !== B || K[37] !== m) S = VK.createElement(u, {
        flexDirection: "column",
        tabIndex: 0,
        autoFocus: !0,
        onKeyDown: W
    }, B, m), K[36] = B, K[37] = m, K[38] = S;
    else S = K[38];
    return S
}
// @from(Ln 529334, Col 0)
function Y9A(q) {
    return VK.createElement(T, {
        key: q.id,
        color: q.status === "completed" ? "success" : void 0
    }, q.status === "completed" ? e6.tick : "◼", " ", q.subject)
}
// @from(Ln 529341, Col 0)
function A9A(q) {
    return !q
}
// @from(Ln 529344, Col 0)
async function dM7(q, K, _, z, Y, A) {
    if (K) try {
        await TI6(), await dX6(K).killPane(q, !YJ6())
    } catch (w) {
        E(`[TeamsDialog] Failed to kill pane ${q}: ${w}`)
    } else E(`[TeamsDialog] Skipping pane kill for ${q}: no backendType recorded`);
    S97(_, q);
    let {
        notificationMessage: O
    } = await p56(_, z, Y, "terminated");
    A((w) => {
        if (!w.teamContext?.teammates) return w;
        if (!(z in w.teamContext.teammates)) return w;
        let {
            [z]: $, ...j
        } = w.teamContext.teammates;
        return {
            ...w,
            teamContext: {
                ...w.teamContext,
                teammates: j
            },
            inbox: {
                messages: [...w.inbox.messages, {
                    id: q9A(),
                    from: "system",
                    text: I6({
                        type: "teammate_terminated",
                        message: O
                    }),
                    timestamp: new Date().toISOString(),
                    status: "pending"
                }]
            }
        }
    }), E(`[TeamsDialog] Removed ${z} from teamContext`)
}
// @from(Ln 529381, Col 0)
async function O9A(q, K) {
    if (K === "iterm2") await w1(lh6, ["session", "focus", "-s", q]);
    else {
        let _ = YJ6() ? ["select-pane", "-t", q] : ["-L", gh6(), "select-pane", "-t", q];
        await w1(mD, _)
    }
}
// @from(Ln 529388, Col 0)
async function w9A(q, K) {
    if (q.isHidden) await N35(q, K);
    else await k35(q, K)
}
// @from(Ln 529392, Col 0)
async function k35(q, K) {}
// @from(Ln 529393, Col 0)
async function N35(q, K) {}
// @from(Ln 529395, Col 0)
function $9A(q, K, _) {
    kI6(K, q, _);
    let z = II8({
        mode: _,
        from: "team-lead"
    });
    F_(q, {
        from: "team-lead",
        text: I6(z),
        timestamp: new Date().toISOString()
    }, K), E(`[TeamsDialog] Sent mode change to ${q}: ${_}`)
}
// @from(Ln 529408, Col 0)
function j9A(q, K, _) {
    let z = q.mode ? yV(q.mode) : "default",
        Y = {
            ...MD(),
            mode: z,
            isBypassPermissionsModeAvailable: _
        },
        A = lW6(Y);
    $9A(q.name, K, A)
}
// @from(Ln 529419, Col 0)
function H9A(q, K, _) {
    if (q.length === 0) return;
    let z = q.map((w) => w.mode ? yV(w.mode) : "default"),
        A = !z.every((w) => w === z[0]) ? "default" : lW6({
            ...MD(),
            mode: z[0] ?? "default",
            isBypassPermissionsModeAvailable: _
        }),
        O = q.map((w) => ({
            memberName: w.name,
            mode: A
        }));
    b97(K, O);
    for (let w of q) {
        let $ = II8({
            mode: A,
            from: "team-lead"
        });
        F_(w.name, {
            from: "team-lead",
            text: I6($),
            timestamp: new Date().toISOString()
        }, K)
    }
    E(`[TeamsDialog] Sent mode change to all ${q.length} teammates: ${A}`)
}
// @from(Ln 529445, Col 4)
VK
// @from(Ln 529445, Col 8)
rS
// @from(Ln 529446, Col 4)
E35 = L(() => {
    o6();
    Qq();
    wk();
    CP();
    n5();
    g6();
    C7();
    RM();
    N7();
    gq();
    Uf();
    K8();
    Q4();
    c7();
    uM7();
    OP();
    e8();
    yx();
    sx();
    BD();
    PX();
    T35();
    ZX();
    S4();
    dN6();
    VK = K6(P6(), 1), rS = K6(P6(), 1)
})
// @from(Ln 529475, Col 0)
function OY8(q, K, _) {
    let z = K;
    for (let Y = 0; Y < _; Y++) {
        let A = J9A(q, z);
        if (A.equals(z)) break;
        z = A
    }
    return z
}
// @from(Ln 529485, Col 0)
function J9A(q, K) {
    switch (q) {
        case "h":
            return K.left();
        case "l":
            return K.right();
        case "j":
            return K.downLogicalLine();
        case "k":
            return K.upLogicalLine();
        case "gj":
            return K.down();
        case "gk":
            return K.up();
        case "w":
            return K.nextVimWord();
        case "b":
            return K.prevVimWord();
        case "e":
            return K.endOfVimWord();
        case "W":
            return K.nextWORD();
        case "B":
            return K.prevWORD();
        case "E":
            return K.endOfWORD();
        case "0":
            return K.startOfLogicalLine();
        case "^":
            return K.firstNonBlankInLogicalLine();
        case "$":
            return K.endOfLogicalLine();
        case "G":
            return K.startOfLastLine();
        default:
            return K
    }
}
// @from(Ln 529524, Col 0)
function y35(q) {
    return "eE$".includes(q)
}
// @from(Ln 529528, Col 0)
function L35(q) {
    return "jkG".includes(q) || q === "gg"
}
// @from(Ln 529532, Col 0)
function R35(q, K, _, z) {
    if (_ === "w") return h35(q, K, z, Ys);
    if (_ === "W") return h35(q, K, z, (A) => !py8(A));
    let Y = X9A[_];
    if (Y) {
        let [A, O] = Y;
        return A === O ? M9A(q, K, A, z) : P9A(q, K, A, O, z)
    }
    return null
}
// @from(Ln 529543, Col 0)
function h35(q, K, _, z) {
    let Y = [];
    for (let {
            segment: M,
            index: P
        }
        of rH().segment(q)) Y.push({
        segment: M,
        index: P
    });
    let A = Y.length - 1;
    for (let M = 0; M < Y.length; M++) {
        let P = Y[M],
            W = M + 1 < Y.length ? Y[M + 1].index : q.length;
        if (K >= P.index && K < W) {
            A = M;
            break
        }
    }
    let O = (M) => Y[M]?.segment ?? "",
        w = (M) => M < Y.length ? Y[M].index : q.length,
        $ = (M) => py8(O(M)),
        j = (M) => z(O(M)),
        H = (M) => c46(O(M)),
        J = A,
        X = A;
    if (j(A)) {
        while (J > 0 && j(J - 1)) J--;
        while (X < Y.length && j(X)) X++
    } else if ($(A)) {
        while (J > 0 && $(J - 1)) J--;
        while (X < Y.length && $(X)) X++;
        return {
            start: w(J),
            end: w(X)
        }
    } else if (H(A)) {
        while (J > 0 && H(J - 1)) J--;
        while (X < Y.length && H(X)) X++
    }
    if (!_) {
        if (X < Y.length && $(X))
            while (X < Y.length && $(X)) X++;
        else if (J > 0 && $(J - 1))
            while (J > 0 && $(J - 1)) J--
    }
    return {
        start: w(J),
        end: w(X)
    }
}
// @from(Ln 529595, Col 0)
function M9A(q, K, _, z) {
    let Y = q.lastIndexOf(`
`, K - 1) + 1,
        A = q.indexOf(`
`, K),
        O = A === -1 ? q.length : A,
        w = q.slice(Y, O),
        $ = K - Y,
        j = [];
    for (let H = 0; H < w.length; H++)
        if (w[H] === _) j.push(H);
    for (let H = 0; H < j.length - 1; H += 2) {
        let J = j[H],
            X = j[H + 1];
        if (J <= $ && $ <= X) return z ? {
            start: Y + J + 1,
            end: Y + X
        } : {
            start: Y + J,
            end: Y + X + 1
        }
    }
    return null
}
// @from(Ln 529620, Col 0)
function P9A(q, K, _, z, Y) {
    let A = 0,
        O = -1;
    for (let $ = K; $ >= 0; $--)
        if (q[$] === z && $ !== K) A++;
        else if (q[$] === _) {
        if (A === 0) {
            O = $;
            break
        }
        A--
    }
    if (O === -1) return null;
    A = 0;
    let w = -1;
    for (let $ = O + 1; $ < q.length; $++)
        if (q[$] === _) A++;
        else if (q[$] === z) {
        if (A === 0) {
            w = $;
            break
        }
        A--
    }
    if (w === -1) return null;
    return Y ? {
        start: O + 1,
        end: w
    } : {
        start: O,
        end: w + 1
    }
}
// @from(Ln 529653, Col 4)
X9A
// @from(Ln 529654, Col 4)
S35 = L(() => {
    a$6();
    IZ();
    X9A = {
        "(": ["(", ")"],
        ")": ["(", ")"],
        b: ["(", ")"],
        "[": ["[", "]"],
        "]": ["[", "]"],
        "{": ["{", "}"],
        "}": ["{", "}"],
        B: ["{", "}"],
        "<": ["<", ">"],
        ">": ["<", ">"],
        '"': ['"', '"'],
        "'": ["'", "'"],
        "`": ["`", "`"]
    }
})
// @from(Ln 529674, Col 0)
function rW6(q, K, _, z) {
    let Y = OY8(K, z.cursor, _);
    if (Y.equals(z.cursor)) return;
    let A = lM7(z.cursor, Y, K, q, _);
    $Y8(q, A.from, A.to, z, A.linewise), z.recordChange({
        type: "operator",
        op: q,
        motion: K,
        count: _
    })
}
// @from(Ln 529686, Col 0)
function Bs8(q, K, _, z, Y) {
    let A = Y.cursor.findCharacter(_, K, z);
    if (A === null) return;
    let O = new FK(Y.cursor.measuredText, A),
        w = W9A(Y.cursor, O, K);
    $Y8(q, w.from, w.to, Y), Y.setLastFind(K, _), Y.recordChange({
        type: "operatorFind",
        op: q,
        find: K,
        char: _,
        count: z
    })
}
// @from(Ln 529700, Col 0)
function ps8(q, K, _, z, Y) {
    let A = R35(Y.text, Y.cursor.offset, _, K === "inner");
    if (!A) return;
    $Y8(q, A.start, A.end, Y), Y.recordChange({
        type: "operatorTextObj",
        op: q,
        objType: _,
        scope: K,
        count: z
    })
}
// @from(Ln 529712, Col 0)
function cM7(q, K, _) {
    let z = _.text,
        Y = z.split(`
`),
        A = tz(z.slice(0, _.cursor.offset), `
`),
        O = Math.min(K, Y.length - A),
        w = _.cursor.startOfLogicalLine().offset,
        $ = w;
    for (let H = 0; H < O; H++) {
        let J = z.indexOf(`
`, $);
        $ = J === -1 ? z.length : J + 1
    }
    let j = z.slice(w, $);
    if (!j.endsWith(`
`)) j = j + `
`;
    if (_.setRegister(j, !0), q === "yank") _.setOffset(w);
    else if (q === "delete") {
        let H = w,
            J = $;
        if (J === z.length && H > 0 && z[H - 1] === `
`) H -= 1;
        let X = z.slice(0, H) + z.slice(J);
        _.setText(X || "");
        let M = Math.max(0, X.length - (ci(X).length || 1));
        _.setOffset(Math.min(H, M))
    } else if (q === "change")
        if (Y.length === 1) _.setText(""), _.enterInsert(0);
        else {
            let H = Y.slice(0, A),
                J = Y.slice(A + O),
                X = [...H, "", ...J].join(`
`);
            _.setText(X), _.enterInsert(w)
        } _.recordChange({
        type: "operator",
        op: q,
        motion: q[0],
        count: K
    })
}
// @from(Ln 529756, Col 0)
function Fs8(q, K) {
    let _ = K.cursor.offset;
    if (_ >= K.text.length) return;
    let z = K.cursor;
    for (let $ = 0; $ < q && !z.isAtEnd(); $++) z = z.right();
    let Y = z.offset,
        A = K.text.slice(_, Y),
        O = K.text.slice(0, _) + K.text.slice(Y);
    K.setRegister(A, !1), K.setText(O);
    let w = Math.max(0, O.length - (ci(O).length || 1));
    K.setOffset(Math.min(_, w)), K.recordChange({
        type: "x",
        count: q
    })
}
// @from(Ln 529772, Col 0)
function gs8(q, K, _) {
    let z = _.cursor.offset,
        Y = _.text;
    for (let A = 0; A < K && z < Y.length; A++) {
        let O = KF6(Y.slice(z)).length || 1;
        Y = Y.slice(0, z) + q + Y.slice(z + O), z += q.length
    }
    _.setText(Y), _.setOffset(Math.max(0, z - q.length)), _.recordChange({
        type: "replace",
        char: q,
        count: K
    })
}
// @from(Ln 529786, Col 0)
function Us8(q, K) {
    let _ = K.cursor.offset;
    if (_ >= K.text.length) return;
    let z = K.text,
        Y = _,
        A = 0;
    while (Y < z.length && A < q) {
        let O = KF6(z.slice(Y)),
            w = O.length,
            $ = O === O.toUpperCase() ? O.toLowerCase() : O.toUpperCase();
        z = z.slice(0, Y) + $ + z.slice(Y + w), Y += $.length, A++
    }
    K.setText(z), K.setOffset(Y), K.recordChange({
        type: "toggleCase",
        count: q
    })
}
// @from(Ln 529804, Col 0)
function Qs8(q, K) {
    let z = K.text.split(`
`),
        {
            line: Y
        } = K.cursor.getPosition();
    if (Y >= z.length - 1) return;
    let A = Math.min(q, z.length - Y - 1),
        O = z[Y],
        w = O.length;
    for (let H = 1; H <= A; H++) {
        let J = (z[Y + H] ?? "").trimStart();
        if (J.length > 0) {
            if (!O.endsWith(" ") && O.length > 0) O += " ";
            O += J
        }
    }
    let $ = [...z.slice(0, Y), O, ...z.slice(Y + A + 1)],
        j = $.join(`
`);
    K.setText(j), K.setOffset(cs8($, Y) + w), K.recordChange({
        type: "join",
        count: q
    })
}
// @from(Ln 529830, Col 0)
function C35(q, K, _) {
    let z = _.getRegister();
    if (!z) return;
    let Y = z.endsWith(`
`),
        A = Y ? z.slice(0, -1) : z;
    if (Y) {
        let w = _.text.split(`
`),
            {
                line: $
            } = _.cursor.getPosition(),
            j = q ? $ + 1 : $,
            H = A.split(`
`),
            J = [];
        for (let P = 0; P < K; P++) J.push(...H);
        let X = [...w.slice(0, j), ...J, ...w.slice(j)],
            M = X.join(`
`);
        _.setText(M), _.setOffset(cs8(X, j))
    } else {
        let O = A.repeat(K),
            w = q && _.cursor.offset < _.text.length ? _.cursor.measuredText.nextOffset(_.cursor.offset) : _.cursor.offset,
            $ = _.text.slice(0, w) + O + _.text.slice(w),
            j = ci(O),
            H = w + O.length - (j.length || 1);
        _.setText($), _.setOffset(Math.max(w, H))
    }
}
// @from(Ln 529861, Col 0)
function ds8(q, K, _) {
    let Y = _.text.split(`
`),
        {
            line: A
        } = _.cursor.getPosition(),
        O = Math.min(K, Y.length - A),
        w = "  ";
    for (let J = 0; J < O; J++) {
        let X = A + J,
            M = Y[X] ?? "";
        if (q === ">") Y[X] = "  " + M;
        else if (M.startsWith("  ")) Y[X] = M.slice(2);
        else if (M.startsWith("\t")) Y[X] = M.slice(1);
        else {
            let P = 0,
                W = 0;
            while (W < M.length && P < 2 && /\s/.test(M[W])) P++, W++;
            Y[X] = M.slice(W)
        }
    }
    let $ = Y.join(`
`),
        H = ((Y[A] ?? "").match(/^\s*/)?.[0] ?? "").length;
    _.setText($), _.setOffset(cs8(Y, A) + H), _.recordChange({
        type: "indent",
        dir: q,
        count: K
    })
}
// @from(Ln 529892, Col 0)
function wY8(q, K) {
    let z = K.text.split(`
`),
        {
            line: Y
        } = K.cursor.getPosition(),
        A = q === "below" ? Y + 1 : Y,
        O = [...z.slice(0, A), "", ...z.slice(A)],
        w = O.join(`
`);
    K.setText(w), K.enterInsert(cs8(O, A)), K.recordChange({
        type: "openLine",
        direction: q
    })
}
// @from(Ln 529908, Col 0)
function cs8(q, K) {
    return q.slice(0, K).join(`
`).length + (K > 0 ? 1 : 0)
}
// @from(Ln 529913, Col 0)
function lM7(q, K, _, z, Y) {
    let A = Math.min(q.offset, K.offset),
        O = Math.max(q.offset, K.offset),
        w = !1;
    if (z === "change" && (_ === "w" || _ === "W")) {
        let $ = q;
        for (let H = 0; H < Y - 1; H++) $ = _ === "w" ? $.nextVimWord() : $.nextWORD();
        let j = _ === "w" ? $.endOfVimWord() : $.endOfWORD();
        O = q.measuredText.nextOffset(j.offset)
    } else if (L35(_)) {
        w = !0;
        let $ = q.text,
            j = $.indexOf(`
`, O);
        if (j === -1) {
            if (O = $.length, A > 0 && $[A - 1] === `
`) A -= 1
        } else O = j + 1
    } else if (y35(_) && q.offset <= K.offset) O = q.measuredText.nextOffset(O);
    return A = q.snapOutOfImageRef(A, "start"), O = q.snapOutOfImageRef(O, "end"), {
        from: A,
        to: O,
        linewise: w
    }
}
// @from(Ln 529939, Col 0)
function W9A(q, K, _) {
    let z = Math.min(q.offset, K.offset),
        Y = Math.max(q.offset, K.offset),
        A = q.measuredText.nextOffset(Y);
    return {
        from: z,
        to: A
    }
}