
// @from(Ln 251370, Col 0)
async function je(A, q, K) {
    if (A.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${A}. Names can only contain letters, numbers, hyphens, and underscores.`);
    if (W96(A)) throw Error(`Cannot add MCP server "${A}": this name is reserved.`);
    if (JZ6()) throw Error("Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers");
    let Y = pu().safeParse(q);
    if (!Y.success) {
        let _ = Y.error.issues.map((w) => `${w.path.join(".")}: ${w.message}`).join(", ");
        throw Error(`Invalid configuration: ${_}`)
    }
    let z = Y.data;
    if (Tw4(A, z)) throw Error(`Cannot add MCP server "${A}": server is explicitly blocked by enterprise policy`);
    if (!MQ6(A, z)) throw Error(`Cannot add MCP server "${A}": not allowed by enterprise policy`);
    switch (K) {
        case "project": {
            let {
                servers: _
            } = WE8();
            if (_[A]) throw Error(`MCP server ${A} already exists in .mcp.json`);
            break
        }
        case "user": {
            if (X1().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in user config`);
            break
        }
        case "local": {
            if (d2().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in local config`);
            break
        }
        case "dynamic":
            throw Error("Cannot add MCP server to scope: dynamic");
        case "enterprise":
            throw Error("Cannot add MCP server to scope: enterprise");
        case "claudeai":
            throw Error("Cannot add MCP server to scope: claudeai")
    }
    switch (K) {
        case "project": {
            let {
                servers: _
            } = WE8(), w = {};
            for (let [$, H] of Object.entries(_)) {
                let {
                    scope: j,
                    ...J
                } = H;
                w[$] = J
            }
            w[A] = z;
            let O = {
                mcpServers: w
            };
            try {
                await Zw4(O)
            } catch ($) {
                throw Error(`Failed to write to .mcp.json: ${$}`)
            }
            break
        }
        case "user": {
            d1((_) => ({
                ..._,
                mcpServers: {
                    ..._.mcpServers,
                    [A]: z
                }
            }));
            break
        }
        case "local": {
            c2((_) => ({
                ..._,
                mcpServers: {
                    ..._.mcpServers,
                    [A]: z
                }
            }));
            break
        }
        default:
            throw Error(`Cannot add MCP server to scope: ${K}`)
    }
}
// @from(Ln 251452, Col 0)
async function fE8(A, q) {
    switch (q) {
        case "project": {
            let {
                servers: K
            } = WE8();
            if (!K[A]) throw Error(`No MCP server found with name: ${A} in .mcp.json`);
            let Y = {};
            for (let [_, w] of Object.entries(K))
                if (_ !== A) {
                    let {
                        scope: O,
                        ...$
                    } = w;
                    Y[_] = $
                } let z = {
                mcpServers: Y
            };
            try {
                await Zw4(z)
            } catch (_) {
                throw Error(`Failed to remove from .mcp.json: ${_}`)
            }
            break
        }
        case "user": {
            if (!X1().mcpServers?.[A]) throw Error(`No user-scoped MCP server found with name: ${A}`);
            d1((Y) => {
                let {
                    [A]: z, ..._
                } = Y.mcpServers ?? {};
                return {
                    ...Y,
                    mcpServers: _
                }
            });
            break
        }
        case "local": {
            if (!d2().mcpServers?.[A]) throw Error(`No project-local MCP server found with name: ${A}`);
            c2((Y) => {
                let {
                    [A]: z, ..._
                } = Y.mcpServers ?? {};
                return {
                    ...Y,
                    mcpServers: _
                }
            });
            break
        }
        default:
            throw Error(`Cannot remove MCP server from scope: ${q}`)
    }
}
// @from(Ln 251508, Col 0)
function WE8() {
    if (!SH("projectSettings")) return {
        servers: {},
        errors: []
    };
    let A = EW1(G1(), ".mcp.json"),
        {
            config: q,
            errors: K
        } = HZ6({
            filePath: A,
            expandVars: !0,
            scope: "project"
        });
    if (!q) {
        let Y = K.filter((z) => !z.message.startsWith("MCP config file not found"));
        if (Y.length > 0) return k(`MCP config errors for ${A}: ${B6(Y.map((z)=>z.message))}`, {
            level: "error"
        }), {
            servers: {},
            errors: Y
        };
        return {
            servers: {},
            errors: []
        }
    }
    return {
        servers: q.mcpServers ? JQ6(q.mcpServers, "project") : {},
        errors: K || []
    }
}
// @from(Ln 251541, Col 0)
function dj(A) {
    let q = {
        project: "projectSettings",
        user: "userSettings",
        local: "localSettings"
    };
    if (A in q && !SH(q[A])) return {
        servers: {},
        errors: []
    };
    switch (A) {
        case "project": {
            let K = {},
                Y = [],
                z = [],
                _ = G1();
            while (_ !== hQ9(_).root) z.push(_), _ = RQ9(_);
            for (let w of z.reverse()) {
                let O = EW1(w, ".mcp.json"),
                    {
                        config: $,
                        errors: H
                    } = HZ6({
                        filePath: O,
                        expandVars: !0,
                        scope: "project"
                    });
                if (!$) {
                    let j = H.filter((J) => !J.message.startsWith("MCP config file not found"));
                    if (j.length > 0) k(`MCP config errors for ${O}: ${B6(j.map((J)=>J.message))}`, {
                        level: "error"
                    }), Y.push(...j);
                    continue
                }
                if ($.mcpServers) Object.assign(K, JQ6($.mcpServers, A));
                if (H.length > 0) Y.push(...H)
            }
            return {
                servers: K,
                errors: Y
            }
        }
        case "user": {
            let K = X1().mcpServers;
            if (!K) return {
                servers: {},
                errors: []
            };
            let {
                config: Y,
                errors: z
            } = DQ6({
                configObject: {
                    mcpServers: K
                },
                expandVars: !0,
                scope: "user"
            });
            return {
                servers: JQ6(Y?.mcpServers, A),
                errors: z
            }
        }
        case "local": {
            let K = d2().mcpServers;
            if (!K) return {
                servers: {},
                errors: []
            };
            let {
                config: Y,
                errors: z
            } = DQ6({
                configObject: {
                    mcpServers: K
                },
                expandVars: !0,
                scope: "local"
            });
            return {
                servers: JQ6(Y?.mcpServers, A),
                errors: z
            }
        }
        case "enterprise": {
            let K = TW1(),
                {
                    config: Y,
                    errors: z
                } = HZ6({
                    filePath: K,
                    expandVars: !0,
                    scope: "enterprise"
                });
            if (!Y) {
                let _ = z.filter((w) => !w.message.startsWith("MCP config file not found"));
                if (_.length > 0) return k(`Enterprise MCP config errors for ${K}: ${B6(_.map((w)=>w.message))}`, {
                    level: "error"
                }), {
                    servers: {},
                    errors: _
                };
                return {
                    servers: {},
                    errors: []
                }
            }
            return {
                servers: JQ6(Y.mcpServers, A),
                errors: z
            }
        }
    }
}
// @from(Ln 251656, Col 0)
function cv(A) {
    let {
        servers: q
    } = dj("enterprise"), {
        servers: K
    } = dj("user"), {
        servers: Y
    } = dj("project"), {
        servers: z
    } = dj("local");
    if (q[A]) return q[A];
    if (z[A]) return z[A];
    if (Y[A]) return Y[A];
    if (K[A]) return K[A];
    return null
}
// @from(Ln 251672, Col 0)
async function jZ6() {
    let {
        servers: A
    } = dj("enterprise");
    if (JZ6()) {
        let W = {};
        for (let [Z, G] of Object.entries(A)) {
            if (!MQ6(Z, G)) continue;
            W[Z] = G
        }
        return {
            servers: W,
            errors: []
        }
    }
    let {
        servers: q
    } = dj("user"), {
        servers: K
    } = dj("project"), {
        servers: Y
    } = dj("local"), z = {}, _ = await _z(), w = [];
    if (_.errors.length > 0)
        for (let W of _.errors)
            if (W.type === "mcp-config-invalid" || W.type === "mcpb-download-failed" || W.type === "mcpb-extract-failed" || W.type === "mcpb-invalid-manifest") {
                let Z = `Plugin MCP loading error - ${W.type}: ${sM(W)}`;
                _6(Error(Z))
            } else {
                let Z = W.type;
                k(`Plugin not available for MCP: ${W.source} - error type: ${Z}`)
            } let O = await Promise.all(_.enabled.map((W) => Dw4(W, w)));
    for (let W of O)
        if (W) Object.assign(z, W);
    if (w.length > 0)
        for (let W of w) {
            let Z = `Plugin MCP server error - ${W.type}: ${sM(W)}`;
            _6(Error(Z))
        }
    let $ = {};
    for (let [W, Z] of Object.entries(K))
        if (fW1(W) === "approved") $[W] = Z;
    let H = {};
    for (let [W, Z] of Object.entries({
            ...q,
            ...$,
            ...Y
        }))
        if (!iv(W) && MQ6(W, Z)) H[W] = Z;
    let j = {},
        J = {};
    for (let [W, Z] of Object.entries(z))
        if (iv(W) || !MQ6(W, Z)) J[W] = Z;
        else j[W] = Z;
    let {
        servers: M,
        suppressed: D
    } = uQ9(j, H);
    Object.assign(M, J);
    for (let {
            name: W,
            duplicateOf: Z
        }
        of D) {
        let G = W.split(":");
        if (G[0] !== "plugin" || G.length < 3) continue;
        w.push({
            type: "mcp-server-suppressed-duplicate",
            source: W,
            plugin: G[1],
            serverName: G.slice(2).join(":"),
            duplicateOf: Z
        })
    }
    let X = Object.assign({}, M, q, $, Y),
        P = {};
    for (let [W, Z] of Object.entries(X)) {
        if (!MQ6(W, Z)) continue;
        P[W] = Z
    }
    return {
        servers: P,
        errors: w
    }
}
// @from(Ln 251756, Col 0)
async function Je() {
    let {
        servers: A,
        errors: q
    } = await jZ6();
    if (JZ6()) return {
        servers: A,
        errors: q
    };
    let K = await Z96();
    return {
        servers: Object.assign({}, K, A),
        errors: q
    }
}
// @from(Ln 251772, Col 0)
function DQ6(A) {
    let {
        configObject: q,
        expandVars: K,
        scope: Y,
        filePath: z
    } = A, _ = I57().safeParse(q);
    if (!_.success) return {
        config: null,
        errors: _.error.issues.map(($) => ({
            ...z && {
                file: z
            },
            path: $.path.join("."),
            message: "Does not adhere to MCP server configuration schema",
            mcpErrorMetadata: {
                scope: Y,
                severity: "fatal"
            }
        }))
    };
    let w = [],
        O = {};
    for (let [$, H] of Object.entries(_.data.mcpServers)) {
        let j = H;
        if (K) {
            let {
                expanded: J,
                missingVars: M
            } = FQ9(H);
            if (M.length > 0) w.push({
                ...z && {
                    file: z
                },
                path: `mcpServers.${$}`,
                message: `Missing environment variables: ${M.join(", ")}`,
                suggestion: `Set the following environment variables: ${M.join(", ")}`,
                mcpErrorMetadata: {
                    scope: Y,
                    serverName: $,
                    severity: "warning"
                }
            });
            j = J
        }
        if (y8() === "windows" && (!j.type || j.type === "stdio") && (j.command === "npx" || j.command.endsWith("\\npx") || j.command.endsWith("/npx"))) w.push({
            ...z && {
                file: z
            },
            path: `mcpServers.${$}`,
            message: "Windows requires 'cmd /c' wrapper to execute npx",
            suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]. See: https://code.claude.com/docs/en/mcp#configure-mcp-servers',
            mcpErrorMetadata: {
                scope: Y,
                serverName: $,
                severity: "warning"
            }
        });
        O[$] = j
    }
    return {
        config: {
            mcpServers: O
        },
        errors: w
    }
}
// @from(Ln 251840, Col 0)
function HZ6(A) {
    let {
        filePath: q,
        expandVars: K,
        scope: Y
    } = A, z = $1(), _;
    try {
        _ = z.readFileSync(q, {
            encoding: "utf8"
        })
    } catch (O) {
        if (O.code === "ENOENT") return {
            config: null,
            errors: [{
                file: q,
                path: "",
                message: `MCP config file not found: ${q}`,
                suggestion: "Check that the file path is correct",
                mcpErrorMetadata: {
                    scope: Y,
                    severity: "fatal"
                }
            }]
        };
        return k(`MCP config read error for ${q} (scope=${Y}): ${O}`, {
            level: "error"
        }), {
            config: null,
            errors: [{
                file: q,
                path: "",
                message: `Failed to read file: ${O}`,
                suggestion: "Check file permissions and ensure the file exists",
                mcpErrorMetadata: {
                    scope: Y,
                    severity: "fatal"
                }
            }]
        }
    }
    let w = WK(_);
    if (!w) return k(`MCP config is not valid JSON: ${q} (scope=${Y}, length=${_.length}, first100=${B6(_.slice(0,100))})`, {
        level: "error"
    }), {
        config: null,
        errors: [{
            file: q,
            path: "",
            message: "MCP config is not a valid JSON",
            suggestion: "Fix the JSON syntax errors in the file",
            mcpErrorMetadata: {
                scope: Y,
                severity: "fatal"
            }
        }]
    };
    return DQ6({
        configObject: w,
        expandVars: K,
        scope: Y,
        filePath: q
    })
}
// @from(Ln 251904, Col 0)
function JZ6() {
    let {
        config: A
    } = HZ6({
        filePath: TW1(),
        expandVars: !0,
        scope: "enterprise"
    });
    return A !== null
}
// @from(Ln 251915, Col 0)
function pQ9() {
    return L8("policySettings")?.allowManagedMcpServersOnly === !0
}
// @from(Ln 251919, Col 0)
function vw4(A) {
    return Object.values(A).every((q) => q.type === "sdk" && q.name === "claude-vscode")
}
// @from(Ln 251923, Col 0)
function iv(A) {
    return (d2().disabledMcpServers || []).includes(A)
}
// @from(Ln 251927, Col 0)
function MZ6(A, q) {
    c2((K) => {
        let Y = K.disabledMcpServers || [];
        if (q) Y = Y.filter((z) => z !== A);
        else if (!Y.includes(A)) Y = [...Y, A];
        return {
            ...K,
            disabledMcpServers: Y
        }
    })
}
// @from(Ln 251938, Col 4)
WZ = E(() => {
    k8();
    SA();
    K_();
    MD1();
    lA();
    b46();
    qM();
    YK();
    So();
    i8();
    jC();
    O2();
    k1();
    H1();
    tH();
    SR();
    jQ6();
    $Z6();
    g1()
})
// @from(Ln 251959, Col 4)
I3
// @from(Ln 251959, Col 8)
TE8 = "∙"
// @from(Ln 251960, Col 4)
Me = "✻"
// @from(Ln 251961, Col 4)
Nw4 = "↑"
// @from(Ln 251962, Col 4)
De = "↯"
// @from(Ln 251963, Col 4)
Vw4 = "○"
// @from(Ln 251964, Col 4)
kw4 = "◐"
// @from(Ln 251965, Col 4)
vE8 = "●"
// @from(Ln 251966, Col 4)
Ew4 = "◉"
// @from(Ln 251967, Col 4)
yw4 = "↻"
// @from(Ln 251968, Col 4)
Lw4 = "▎"
// @from(Ln 251969, Col 4)
XQ6
// @from(Ln 251969, Col 9)
yW1 = "·✔︎·"
// @from(Ln 251970, Col 4)
LW1 = "×"
// @from(Ln 251971, Col 4)
qw = E(() => {
    d3();
    I3 = Q8.platform === "darwin" ? "⏺" : "●", XQ6 = ["·|·", "·/·", "·—·", "·\\·"]
})
// @from(Ln 251975, Col 4)
cw4 = x((p7w, dw4) => {
    function yE8(A) {
        if (A instanceof Map) A.clear = A.delete = A.set = function() {
            throw Error("map is read-only")
        };
        else if (A instanceof Set) A.add = A.clear = A.delete = function() {
            throw Error("set is read-only")
        };
        return Object.freeze(A), Object.getOwnPropertyNames(A).forEach(function(q) {
            var K = A[q];
            if (typeof K == "object" && !Object.isFrozen(K)) yE8(K)
        }), A
    }
    var xw4 = yE8,
        QQ9 = yE8;
    xw4.default = QQ9;
    class kE8 {
        constructor(A) {
            if (A.data === void 0) A.data = {};
            this.data = A.data, this.isMatchIgnored = !1
        }
        ignoreMatch() {
            this.isMatchIgnored = !0
        }
    }

    function DZ6(A) {
        return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
    }

    function Xe(A, ...q) {
        let K = Object.create(null);
        for (let Y in A) K[Y] = A[Y];
        return q.forEach(function(Y) {
            for (let z in Y) K[z] = Y[z]
        }), K
    }
    var UQ9 = "</span>",
        Rw4 = (A) => {
            return !!A.kind
        };
    class uw4 {
        constructor(A, q) {
            this.buffer = "", this.classPrefix = q.classPrefix, A.walk(this)
        }
        addText(A) {
            this.buffer += DZ6(A)
        }
        openNode(A) {
            if (!Rw4(A)) return;
            let q = A.kind;
            if (!A.sublanguage) q = `${this.classPrefix}${q}`;
            this.span(q)
        }
        closeNode(A) {
            if (!Rw4(A)) return;
            this.buffer += UQ9
        }
        value() {
            return this.buffer
        }
        span(A) {
            this.buffer += `<span class="${A}">`
        }
    }
    class LE8 {
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
                LE8._collapse(q)
            })
        }
    }
    class mw4 extends LE8 {
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
            return new uw4(this, this.options).value()
        }
        finalize() {
            return !0
        }
    }

    function dQ9(A) {
        return new RegExp(A.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")
    }

    function PQ6(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function cQ9(...A) {
        return A.map((K) => PQ6(K)).join("")
    }

    function lQ9(...A) {
        return "(" + A.map((K) => PQ6(K)).join("|") + ")"
    }

    function iQ9(A) {
        return new RegExp(A.toString() + "|").exec("").length - 1
    }

    function nQ9(A, q) {
        let K = A && A.exec(q);
        return K && K.index === 0
    }
    var rQ9 = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    function oQ9(A, q = "|") {
        let K = 0;
        return A.map((Y) => {
            K += 1;
            let z = K,
                _ = PQ6(Y),
                w = "";
            while (_.length > 0) {
                let O = rQ9.exec(_);
                if (!O) {
                    w += _;
                    break
                }
                if (w += _.substring(0, O.index), _ = _.substring(O.index + O[0].length), O[0][0] === "\\" && O[1]) w += "\\" + String(Number(O[1]) + z);
                else if (w += O[0], O[0] === "(") K++
            }
            return w
        }).map((Y) => `(${Y})`).join(q)
    }
    var aQ9 = /\b\B/,
        Bw4 = "[a-zA-Z]\\w*",
        RE8 = "[a-zA-Z_]\\w*",
        hE8 = "\\b\\d+(\\.\\d+)?",
        gw4 = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        Fw4 = "\\b(0b[01]+)",
        sQ9 = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
        tQ9 = (A = {}) => {
            let q = /^#![ ]*\//;
            if (A.binary) A.begin = cQ9(q, /.*\b/, A.binary, /\b.*/);
            return Xe({
                className: "meta",
                begin: q,
                end: /$/,
                relevance: 0,
                "on:begin": (K, Y) => {
                    if (K.index !== 0) Y.ignoreMatch()
                }
            }, A)
        },
        WQ6 = {
            begin: "\\\\[\\s\\S]",
            relevance: 0
        },
        eQ9 = {
            className: "string",
            begin: "'",
            end: "'",
            illegal: "\\n",
            contains: [WQ6]
        },
        AU9 = {
            className: "string",
            begin: '"',
            end: '"',
            illegal: "\\n",
            contains: [WQ6]
        },
        pw4 = {
            begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
        },
        hW1 = function(A, q, K = {}) {
            let Y = Xe({
                className: "comment",
                begin: A,
                end: q,
                contains: []
            }, K);
            return Y.contains.push(pw4), Y.contains.push({
                className: "doctag",
                begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
                relevance: 0
            }), Y
        },
        qU9 = hW1("//", "$"),
        KU9 = hW1("/\\*", "\\*/"),
        YU9 = hW1("#", "$"),
        zU9 = {
            className: "number",
            begin: hE8,
            relevance: 0
        },
        _U9 = {
            className: "number",
            begin: gw4,
            relevance: 0
        },
        wU9 = {
            className: "number",
            begin: Fw4,
            relevance: 0
        },
        OU9 = {
            className: "number",
            begin: hE8 + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
            relevance: 0
        },
        $U9 = {
            begin: /(?=\/[^/\n]*\/)/,
            contains: [{
                className: "regexp",
                begin: /\//,
                end: /\/[gimuy]*/,
                illegal: /\n/,
                contains: [WQ6, {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [WQ6]
                }]
            }]
        },
        HU9 = {
            className: "title",
            begin: Bw4,
            relevance: 0
        },
        jU9 = {
            className: "title",
            begin: RE8,
            relevance: 0
        },
        JU9 = {
            begin: "\\.\\s*" + RE8,
            relevance: 0
        },
        MU9 = function(A) {
            return Object.assign(A, {
                "on:begin": (q, K) => {
                    K.data._beginMatch = q[1]
                },
                "on:end": (q, K) => {
                    if (K.data._beginMatch !== q[1]) K.ignoreMatch()
                }
            })
        },
        RW1 = Object.freeze({
            __proto__: null,
            MATCH_NOTHING_RE: aQ9,
            IDENT_RE: Bw4,
            UNDERSCORE_IDENT_RE: RE8,
            NUMBER_RE: hE8,
            C_NUMBER_RE: gw4,
            BINARY_NUMBER_RE: Fw4,
            RE_STARTERS_RE: sQ9,
            SHEBANG: tQ9,
            BACKSLASH_ESCAPE: WQ6,
            APOS_STRING_MODE: eQ9,
            QUOTE_STRING_MODE: AU9,
            PHRASAL_WORDS_MODE: pw4,
            COMMENT: hW1,
            C_LINE_COMMENT_MODE: qU9,
            C_BLOCK_COMMENT_MODE: KU9,
            HASH_COMMENT_MODE: YU9,
            NUMBER_MODE: zU9,
            C_NUMBER_MODE: _U9,
            BINARY_NUMBER_MODE: wU9,
            CSS_NUMBER_MODE: OU9,
            REGEXP_MODE: $U9,
            TITLE_MODE: HU9,
            UNDERSCORE_TITLE_MODE: jU9,
            METHOD_GUARD: JU9,
            END_SAME_AS_BEGIN: MU9
        });

    function DU9(A, q) {
        if (A.input[A.index - 1] === ".") q.ignoreMatch()
    }

    function XU9(A, q) {
        if (!q) return;
        if (!A.beginKeywords) return;
        if (A.begin = "\\b(" + A.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", A.__beforeBegin = DU9, A.keywords = A.keywords || A.beginKeywords, delete A.beginKeywords, A.relevance === void 0) A.relevance = 0
    }

    function PU9(A, q) {
        if (!Array.isArray(A.illegal)) return;
        A.illegal = lQ9(...A.illegal)
    }

    function WU9(A, q) {
        if (!A.match) return;
        if (A.begin || A.end) throw Error("begin & end are not supported with match");
        A.begin = A.match, delete A.match
    }

    function ZU9(A, q) {
        if (A.relevance === void 0) A.relevance = 1
    }
    var GU9 = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"],
        fU9 = "keyword";

    function Qw4(A, q, K = fU9) {
        let Y = {};
        if (typeof A === "string") z(K, A.split(" "));
        else if (Array.isArray(A)) z(K, A);
        else Object.keys(A).forEach(function(_) {
            Object.assign(Y, Qw4(A[_], q, _))
        });
        return Y;

        function z(_, w) {
            if (q) w = w.map((O) => O.toLowerCase());
            w.forEach(function(O) {
                let $ = O.split("|");
                Y[$[0]] = [_, TU9($[0], $[1])]
            })
        }
    }

    function TU9(A, q) {
        if (q) return Number(q);
        return vU9(A) ? 0 : 1
    }

    function vU9(A) {
        return GU9.includes(A.toLowerCase())
    }

    function NU9(A, {
        plugins: q
    }) {
        function K(O, $) {
            return new RegExp(PQ6(O), "m" + (A.case_insensitive ? "i" : "") + ($ ? "g" : ""))
        }
        class Y {
            constructor() {
                this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
            }
            addRule(O, $) {
                $.position = this.position++, this.matchIndexes[this.matchAt] = $, this.regexes.push([$, O]), this.matchAt += iQ9(O) + 1
            }
            compile() {
                if (this.regexes.length === 0) this.exec = () => null;
                let O = this.regexes.map(($) => $[1]);
                this.matcherRe = K(oQ9(O), !0), this.lastIndex = 0
            }
            exec(O) {
                this.matcherRe.lastIndex = this.lastIndex;
                let $ = this.matcherRe.exec(O);
                if (!$) return null;
                let H = $.findIndex((J, M) => M > 0 && J !== void 0),
                    j = this.matchIndexes[H];
                return $.splice(0, H), Object.assign($, j)
            }
        }
        class z {
            constructor() {
                this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
            }
            getMatcher(O) {
                if (this.multiRegexes[O]) return this.multiRegexes[O];
                let $ = new Y;
                return this.rules.slice(O).forEach(([H, j]) => $.addRule(H, j)), $.compile(), this.multiRegexes[O] = $, $
            }
            resumingScanAtSamePosition() {
                return this.regexIndex !== 0
            }
            considerAll() {
                this.regexIndex = 0
            }
            addRule(O, $) {
                if (this.rules.push([O, $]), $.type === "begin") this.count++
            }
            exec(O) {
                let $ = this.getMatcher(this.regexIndex);
                $.lastIndex = this.lastIndex;
                let H = $.exec(O);
                if (this.resumingScanAtSamePosition())
                    if (H && H.index === this.lastIndex);
                    else {
                        let j = this.getMatcher(0);
                        j.lastIndex = this.lastIndex + 1, H = j.exec(O)
                    } if (H) {
                    if (this.regexIndex += H.position + 1, this.regexIndex === this.count) this.considerAll()
                }
                return H
            }
        }

        function _(O) {
            let $ = new z;
            if (O.contains.forEach((H) => $.addRule(H.begin, {
                    rule: H,
                    type: "begin"
                })), O.terminatorEnd) $.addRule(O.terminatorEnd, {
                type: "end"
            });
            if (O.illegal) $.addRule(O.illegal, {
                type: "illegal"
            });
            return $
        }

        function w(O, $) {
            let H = O;
            if (O.isCompiled) return H;
            [WU9].forEach((J) => J(O, $)), A.compilerExtensions.forEach((J) => J(O, $)), O.__beforeBegin = null, [XU9, PU9, ZU9].forEach((J) => J(O, $)), O.isCompiled = !0;
            let j = null;
            if (typeof O.keywords === "object") j = O.keywords.$pattern, delete O.keywords.$pattern;
            if (O.keywords) O.keywords = Qw4(O.keywords, A.case_insensitive);
            if (O.lexemes && j) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
            if (j = j || O.lexemes || /\w+/, H.keywordPatternRe = K(j, !0), $) {
                if (!O.begin) O.begin = /\B|\b/;
                if (H.beginRe = K(O.begin), O.endSameAsBegin) O.end = O.begin;
                if (!O.end && !O.endsWithParent) O.end = /\B|\b/;
                if (O.end) H.endRe = K(O.end);
                if (H.terminatorEnd = PQ6(O.end) || "", O.endsWithParent && $.terminatorEnd) H.terminatorEnd += (O.end ? "|" : "") + $.terminatorEnd
            }
            if (O.illegal) H.illegalRe = K(O.illegal);
            if (!O.contains) O.contains = [];
            if (O.contains = [].concat(...O.contains.map(function(J) {
                    return VU9(J === "self" ? O : J)
                })), O.contains.forEach(function(J) {
                    w(J, H)
                }), O.starts) w(O.starts, $);
            return H.matcher = _(H), H
        }
        if (!A.compilerExtensions) A.compilerExtensions = [];
        if (A.contains && A.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        return A.classNameAliases = Xe(A.classNameAliases || {}), w(A)
    }

    function Uw4(A) {
        if (!A) return !1;
        return A.endsWithParent || Uw4(A.starts)
    }

    function VU9(A) {
        if (A.variants && !A.cachedVariants) A.cachedVariants = A.variants.map(function(q) {
            return Xe(A, {
                variants: null
            }, q)
        });
        if (A.cachedVariants) return A.cachedVariants;
        if (Uw4(A)) return Xe(A, {
            starts: A.starts ? Xe(A.starts) : null
        });
        if (Object.isFrozen(A)) return Xe(A);
        return A
    }
    var kU9 = "10.7.3";

    function EU9(A) {
        return Boolean(A || A === "")
    }

    function yU9(A) {
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
                    if (!this.autoDetect && !A.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, DZ6(this.code);
                    let Y = {};
                    if (this.autoDetect) Y = A.highlightAuto(this.code), this.detectedLanguage = Y.language;
                    else Y = A.highlight(this.language, this.code, this.ignoreIllegals), this.detectedLanguage = this.language;
                    return Y.value
                },
                autoDetect() {
                    return !this.language || EU9(this.autodetect)
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
    var LU9 = {
        "after:highlightElement": ({
            el: A,
            result: q,
            text: K
        }) => {
            let Y = hw4(A);
            if (!Y.length) return;
            let z = document.createElement("div");
            z.innerHTML = q.value, q.value = RU9(Y, hw4(z), K)
        }
    };

    function EE8(A) {
        return A.nodeName.toLowerCase()
    }

    function hw4(A) {
        let q = [];
        return function K(Y, z) {
            for (let _ = Y.firstChild; _; _ = _.nextSibling)
                if (_.nodeType === 3) z += _.nodeValue.length;
                else if (_.nodeType === 1) {
                if (q.push({
                        event: "start",
                        offset: z,
                        node: _
                    }), z = K(_, z), !EE8(_).match(/br|hr|img|input/)) q.push({
                    event: "stop",
                    offset: z,
                    node: _
                })
            }
            return z
        }(A, 0), q
    }

    function RU9(A, q, K) {
        let Y = 0,
            z = "",
            _ = [];

        function w() {
            if (!A.length || !q.length) return A.length ? A : q;
            if (A[0].offset !== q[0].offset) return A[0].offset < q[0].offset ? A : q;
            return q[0].event === "start" ? A : q
        }

        function O(j) {
            function J(M) {
                return " " + M.nodeName + '="' + DZ6(M.value) + '"'
            }
            z += "<" + EE8(j) + [].map.call(j.attributes, J).join("") + ">"
        }

        function $(j) {
            z += "</" + EE8(j) + ">"
        }

        function H(j) {
            (j.event === "start" ? O : $)(j.node)
        }
        while (A.length || q.length) {
            let j = w();
            if (z += DZ6(K.substring(Y, j[0].offset)), Y = j[0].offset, j === A) {
                _.reverse().forEach($);
                do H(j.splice(0, 1)[0]), j = w(); while (j === A && j.length && j[0].offset === Y);
                _.reverse().forEach(O)
            } else {
                if (j[0].event === "start") _.push(j[0].node);
                else _.pop();
                H(j.splice(0, 1)[0])
            }
        }
        return z + DZ6(K.substr(Y))
    }
    var Sw4 = {},
        NE8 = (A) => {
            console.error(A)
        },
        Cw4 = (A, ...q) => {
            console.log(`WARN: ${A}`, ...q)
        },
        CR = (A, q) => {
            if (Sw4[`${A}/${q}`]) return;
            console.log(`Deprecated as of ${A}. ${q}`), Sw4[`${A}/${q}`] = !0
        },
        VE8 = DZ6,
        Iw4 = Xe,
        bw4 = Symbol("nomatch"),
        hU9 = function(A) {
            let q = Object.create(null),
                K = Object.create(null),
                Y = [],
                z = !0,
                _ = /(^(<[^>]+>|\t|)+|\n)/gm,
                w = "Could not find the language '{}', did you forget to load/include a language module?",
                O = {
                    disableAutodetect: !0,
                    name: "Plain text",
                    contains: []
                },
                $ = {
                    noHighlightRe: /^(no-?highlight)$/i,
                    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
                    classPrefix: "hljs-",
                    tabReplace: null,
                    useBR: !1,
                    languages: null,
                    __emitter: mw4
                };

            function H(K6) {
                return $.noHighlightRe.test(K6)
            }

            function j(K6) {
                let s = K6.className + " ";
                s += K6.parentNode ? K6.parentNode.className : "";
                let X6 = $.languageDetectRe.exec(s);
                if (X6) {
                    let z6 = p(X6[1]);
                    if (!z6) Cw4(w.replace("{}", X6[1])), Cw4("Falling back to no-highlight mode for this block.", K6);
                    return z6 ? X6[1] : "no-highlight"
                }
                return s.split(/\s+/).find((z6) => H(z6) || p(z6))
            }

            function J(K6, s, X6, z6) {
                let N6 = "",
                    $6 = "";
                if (typeof s === "object") N6 = K6, X6 = s.ignoreIllegals, $6 = s.language, z6 = void 0;
                else CR("10.7.0", "highlight(lang, code, ...args) has been deprecated."), CR("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), $6 = K6, N6 = s;
                let n = {
                    code: N6,
                    language: $6
                };
                Y6("before:highlight", n);
                let o = n.result ? n.result : M(n.language, n.code, X6, z6);
                return o.code = n.code, Y6("after:highlight", o), o
            }

            function M(K6, s, X6, z6) {
                function N6(b6, E6) {
                    let U6 = G6.case_insensitive ? E6[0].toLowerCase() : E6[0];
                    return Object.prototype.hasOwnProperty.call(b6.keywords, U6) && b6.keywords[U6]
                }

                function $6() {
                    if (!D6.keywords) {
                        k6.addText(Z6);
                        return
                    }
                    let b6 = 0;
                    D6.keywordPatternRe.lastIndex = 0;
                    let E6 = D6.keywordPatternRe.exec(Z6),
                        U6 = "";
                    while (E6) {
                        U6 += Z6.substring(b6, E6.index);
                        let c6 = N6(D6, E6);
                        if (c6) {
                            let [K1, j6] = c6;
                            if (k6.addText(U6), U6 = "", u6 += j6, K1.startsWith("_")) U6 += E6[0];
                            else {
                                let W6 = G6.classNameAliases[K1] || K1;
                                k6.addKeyword(E6[0], W6)
                            }
                        } else U6 += E6[0];
                        b6 = D6.keywordPatternRe.lastIndex, E6 = D6.keywordPatternRe.exec(Z6)
                    }
                    U6 += Z6.substr(b6), k6.addText(U6)
                }

                function n() {
                    if (Z6 === "") return;
                    let b6 = null;
                    if (typeof D6.subLanguage === "string") {
                        if (!q[D6.subLanguage]) {
                            k6.addText(Z6);
                            return
                        }
                        b6 = M(D6.subLanguage, Z6, !0, Q6[D6.subLanguage]), Q6[D6.subLanguage] = b6.top
                    } else b6 = X(Z6, D6.subLanguage.length ? D6.subLanguage : null);
                    if (D6.relevance > 0) u6 += b6.relevance;
                    k6.addSublanguage(b6.emitter, b6.language)
                }

                function o() {
                    if (D6.subLanguage != null) n();
                    else $6();
                    Z6 = ""
                }

                function a(b6) {
                    if (b6.className) k6.openNode(G6.classNameAliases[b6.className] || b6.className);
                    return D6 = Object.create(b6, {
                        parent: {
                            value: D6
                        }
                    }), D6
                }

                function i(b6, E6, U6) {
                    let c6 = nQ9(b6.endRe, U6);
                    if (c6) {
                        if (b6["on:end"]) {
                            let K1 = new kE8(b6);
                            if (b6["on:end"](E6, K1), K1.isMatchIgnored) c6 = !1
                        }
                        if (c6) {
                            while (b6.endsParent && b6.parent) b6 = b6.parent;
                            return b6
                        }
                    }
                    if (b6.endsWithParent) return i(b6.parent, E6, U6)
                }

                function l(b6) {
                    if (D6.matcher.regexIndex === 0) return Z6 += b6[0], 1;
                    else return V6 = !0, 0
                }

                function q6(b6) {
                    let E6 = b6[0],
                        U6 = b6.rule,
                        c6 = new kE8(U6),
                        K1 = [U6.__beforeBegin, U6["on:begin"]];
                    for (let j6 of K1) {
                        if (!j6) continue;
                        if (j6(b6, c6), c6.isMatchIgnored) return l(E6)
                    }
                    if (U6 && U6.endSameAsBegin) U6.endRe = dQ9(E6);
                    if (U6.skip) Z6 += E6;
                    else {
                        if (U6.excludeBegin) Z6 += E6;
                        if (o(), !U6.returnBegin && !U6.excludeBegin) Z6 = E6
                    }
                    return a(U6), U6.returnBegin ? 0 : E6.length
                }

                function w6(b6) {
                    let E6 = b6[0],
                        U6 = s.substr(b6.index),
                        c6 = i(D6, b6, U6);
                    if (!c6) return bw4;
                    let K1 = D6;
                    if (K1.skip) Z6 += E6;
                    else {
                        if (!(K1.returnEnd || K1.excludeEnd)) Z6 += E6;
                        if (o(), K1.excludeEnd) Z6 = E6
                    }
                    do {
                        if (D6.className) k6.closeNode();
                        if (!D6.skip && !D6.subLanguage) u6 += D6.relevance;
                        D6 = D6.parent
                    } while (D6 !== c6.parent);
                    if (c6.starts) {
                        if (c6.endSameAsBegin) c6.starts.endRe = c6.endRe;
                        a(c6.starts)
                    }
                    return K1.returnEnd ? 0 : E6.length
                }

                function O6() {
                    let b6 = [];
                    for (let E6 = D6; E6 !== G6; E6 = E6.parent)
                        if (E6.className) b6.unshift(E6.className);
                    b6.forEach((E6) => k6.openNode(E6))
                }
                let L6 = {};

                function y6(b6, E6) {
                    let U6 = E6 && E6[0];
                    if (Z6 += b6, U6 == null) return o(), 0;
                    if (L6.type === "begin" && E6.type === "end" && L6.index === E6.index && U6 === "") {
                        if (Z6 += s.slice(E6.index, E6.index + 1), !z) {
                            let c6 = Error("0 width match regex");
                            throw c6.languageName = K6, c6.badRule = L6.rule, c6
                        }
                        return 1
                    }
                    if (L6 = E6, E6.type === "begin") return q6(E6);
                    else if (E6.type === "illegal" && !X6) {
                        let c6 = Error('Illegal lexeme "' + U6 + '" for mode "' + (D6.className || "<unnamed>") + '"');
                        throw c6.mode = D6, c6
                    } else if (E6.type === "end") {
                        let c6 = w6(E6);
                        if (c6 !== bw4) return c6
                    }
                    if (E6.type === "illegal" && U6 === "") return 1;
                    if (o6 > 1e5 && o6 > E6.index * 3) throw Error("potential infinite loop, way more iterations than matches");
                    return Z6 += U6, U6.length
                }
                let G6 = p(K6);
                if (!G6) throw NE8(w.replace("{}", K6)), Error('Unknown language: "' + K6 + '"');
                let R6 = NU9(G6, {
                        plugins: Y
                    }),
                    T6 = "",
                    D6 = z6 || R6,
                    Q6 = {},
                    k6 = new $.__emitter($);
                O6();
                let Z6 = "",
                    u6 = 0,
                    C6 = 0,
                    o6 = 0,
                    V6 = !1;
                try {
                    D6.matcher.considerAll();
                    for (;;) {
                        if (o6++, V6) V6 = !1;
                        else D6.matcher.considerAll();
                        D6.matcher.lastIndex = C6;
                        let b6 = D6.matcher.exec(s);
                        if (!b6) break;
                        let E6 = s.substring(C6, b6.index),
                            U6 = y6(E6, b6);
                        C6 = b6.index + U6
                    }
                    return y6(s.substr(C6)), k6.closeAllNodes(), k6.finalize(), T6 = k6.toHTML(), {
                        relevance: Math.floor(u6),
                        value: T6,
                        language: K6,
                        illegal: !1,
                        emitter: k6,
                        top: D6
                    }
                } catch (b6) {
                    if (b6.message && b6.message.includes("Illegal")) return {
                        illegal: !0,
                        illegalBy: {
                            msg: b6.message,
                            context: s.slice(C6 - 100, C6 + 100),
                            mode: b6.mode
                        },
                        sofar: T6,
                        relevance: 0,
                        value: VE8(s),
                        emitter: k6
                    };
                    else if (z) return {
                        illegal: !1,
                        relevance: 0,
                        value: VE8(s),
                        emitter: k6,
                        language: K6,
                        top: D6,
                        errorRaised: b6
                    };
                    else throw b6
                }
            }

            function D(K6) {
                let s = {
                    relevance: 0,
                    emitter: new $.__emitter($),
                    value: VE8(K6),
                    illegal: !1,
                    top: O
                };
                return s.emitter.addText(K6), s
            }

            function X(K6, s) {
                s = s || $.languages || Object.keys(q);
                let X6 = D(K6),
                    z6 = s.filter(p).filter(U).map((a) => M(a, K6, !1));
                z6.unshift(X6);
                let N6 = z6.sort((a, i) => {
                        if (a.relevance !== i.relevance) return i.relevance - a.relevance;
                        if (a.language && i.language) {
                            if (p(a.language).supersetOf === i.language) return 1;
                            else if (p(i.language).supersetOf === a.language) return -1
                        }
                        return 0
                    }),
                    [$6, n] = N6,
                    o = $6;
                return o.second_best = n, o
            }

            function P(K6) {
                if (!($.tabReplace || $.useBR)) return K6;
                return K6.replace(_, (s) => {
                    if (s === `
`) return $.useBR ? "<br>" : s;
                    else if ($.tabReplace) return s.replace(/\t/g, $.tabReplace);
                    return s
                })
            }

            function W(K6, s, X6) {
                let z6 = s ? K[s] : X6;
                if (K6.classList.add("hljs"), z6) K6.classList.add(z6)
            }
            let Z = {
                    "before:highlightElement": ({
                        el: K6
                    }) => {
                        if ($.useBR) K6.innerHTML = K6.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`)
                    },
                    "after:highlightElement": ({
                        result: K6
                    }) => {
                        if ($.useBR) K6.value = K6.value.replace(/\n/g, "<br>")
                    }
                },
                G = /^(<[^>]+>|\t)+/gm,
                f = {
                    "after:highlightElement": ({
                        result: K6
                    }) => {
                        if ($.tabReplace) K6.value = K6.value.replace(G, (s) => s.replace(/\t/g, $.tabReplace))
                    }
                };

            function v(K6) {
                let s = null,
                    X6 = j(K6);
                if (H(X6)) return;
                Y6("before:highlightElement", {
                    el: K6,
                    language: X6
                }), s = K6;
                let z6 = s.textContent,
                    N6 = X6 ? J(z6, {
                        language: X6,
                        ignoreIllegals: !0
                    }) : X(z6);
                if (Y6("after:highlightElement", {
                        el: K6,
                        result: N6,
                        text: z6
                    }), K6.innerHTML = N6.value, W(K6, X6, N6.language), K6.result = {
                        language: N6.language,
                        re: N6.relevance,
                        relavance: N6.relevance
                    }, N6.second_best) K6.second_best = {
                    language: N6.second_best.language,
                    re: N6.second_best.relevance,
                    relavance: N6.second_best.relevance
                }
            }

            function N(K6) {
                if (K6.useBR) CR("10.3.0", "'useBR' will be removed entirely in v11.0"), CR("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
                $ = Iw4($, K6)
            }
            let V = () => {
                if (V.called) return;
                V.called = !0, CR("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead."), document.querySelectorAll("pre code").forEach(v)
            };

            function L() {
                CR("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."), h = !0
            }
            let h = !1;

            function R() {
                if (document.readyState === "loading") {
                    h = !0;
                    return
                }
                document.querySelectorAll("pre code").forEach(v)
            }

            function u() {
                if (h) R()
            }
            if (typeof window < "u" && window.addEventListener) window.addEventListener("DOMContentLoaded", u, !1);

            function I(K6, s) {
                let X6 = null;
                try {
                    X6 = s(A)
                } catch (z6) {
                    if (NE8("Language definition for '{}' could not be registered.".replace("{}", K6)), !z) throw z6;
                    else NE8(z6);
                    X6 = O
                }
                if (!X6.name) X6.name = K6;
                if (q[K6] = X6, X6.rawDefinition = s.bind(null, A), X6.aliases) Q(X6.aliases, {
                    languageName: K6
                })
            }

            function g(K6) {
                delete q[K6];
                for (let s of Object.keys(K))
                    if (K[s] === K6) delete K[s]
            }

            function B() {
                return Object.keys(q)
            }

            function b(K6) {
                CR("10.4.0", "requireLanguage will be removed entirely in v11."), CR("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
                let s = p(K6);
                if (s) return s;
                throw Error("The '{}' language is required, but not loaded.".replace("{}", K6))
            }

            function p(K6) {
                return K6 = (K6 || "").toLowerCase(), q[K6] || q[K[K6]]
            }

            function Q(K6, {
                languageName: s
            }) {
                if (typeof K6 === "string") K6 = [K6];
                K6.forEach((X6) => {
                    K[X6.toLowerCase()] = s
                })
            }

            function U(K6) {
                let s = p(K6);
                return s && !s.disableAutodetect
            }

            function r(K6) {
                if (K6["before:highlightBlock"] && !K6["before:highlightElement"]) K6["before:highlightElement"] = (s) => {
                    K6["before:highlightBlock"](Object.assign({
                        block: s.el
                    }, s))
                };
                if (K6["after:highlightBlock"] && !K6["after:highlightElement"]) K6["after:highlightElement"] = (s) => {
                    K6["after:highlightBlock"](Object.assign({
                        block: s.el
                    }, s))
                }
            }

            function e(K6) {
                r(K6), Y.push(K6)
            }

            function Y6(K6, s) {
                let X6 = K6;
                Y.forEach(function(z6) {
                    if (z6[X6]) z6[X6](s)
                })
            }

            function H6(K6) {
                return CR("10.2.0", "fixMarkup will be removed entirely in v11.0"), CR("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534"), P(K6)
            }

            function J6(K6) {
                return CR("10.7.0", "highlightBlock will be removed entirely in v12.0"), CR("10.7.0", "Please use highlightElement now."), v(K6)
            }
            Object.assign(A, {
                highlight: J,
                highlightAuto: X,
                highlightAll: R,
                fixMarkup: H6,
                highlightElement: v,
                highlightBlock: J6,
                configure: N,
                initHighlighting: V,
                initHighlightingOnLoad: L,
                registerLanguage: I,
                unregisterLanguage: g,
                listLanguages: B,
                getLanguage: p,
                registerAliases: Q,
                requireLanguage: b,
                autoDetection: U,
                inherit: Iw4,
                addPlugin: e,
                vuePlugin: yU9(A).VuePlugin
            }), A.debugMode = function() {
                z = !1
            }, A.safeMode = function() {
                z = !0
            }, A.versionString = kU9;
            for (let K6 in RW1)
                if (typeof RW1[K6] === "object") xw4(RW1[K6]);
            return Object.assign(A, RW1), A.addPlugin(Z), A.addPlugin(LU9), A.addPlugin(f), A
        },
        SU9 = hU9({});
    dw4.exports = SU9
})
// @from(Ln 253122, Col 4)
iw4 = x((Q7w, lw4) => {
    function CU9(A) {
        var q = "[A-Za-zА-Яа-яёЁ_][A-Za-zА-Яа-яёЁ_0-9]+",
            K = "далее ",
            Y = "возврат вызватьисключение выполнить для если и из или иначе иначеесли исключение каждого конецесли " + "конецпопытки конеццикла не новый перейти перем по пока попытка прервать продолжить тогда цикл экспорт ",
            z = K + Y,
            _ = "загрузитьизфайла ",
            w = "вебклиент вместо внешнеесоединение клиент конецобласти мобильноеприложениеклиент мобильноеприложениесервер " + "наклиенте наклиентенасервере наклиентенасерверебезконтекста насервере насерверебезконтекста область перед " + "после сервер толстыйклиентобычноеприложение толстыйклиентуправляемоеприложение тонкийклиент ",
            O = _ + w,
            $ = "разделительстраниц разделительстрок символтабуляции ",
            H = "ansitooem oemtoansi ввестивидсубконто ввестиперечисление ввестипериод ввестиплансчетов выбранныйплансчетов " + "датагод датамесяц датачисло заголовоксистемы значениевстроку значениеизстроки каталогиб каталогпользователя " + "кодсимв конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца " + "коннедели лог лог10 максимальноеколичествосубконто названиеинтерфейса названиенабораправ назначитьвид " + "назначитьсчет найтиссылки началопериодаби началостандартногоинтервала начгода начквартала начмесяца " + "начнедели номерднягода номерднянедели номернеделигода обработкаожидания основнойжурналрасчетов " + "основнойплансчетов основнойязык очиститьокносообщений периодстр получитьвремята получитьдатута " + "получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта " + "префиксавтонумерации пропись пустоезначение разм разобратьпозициюдокумента рассчитатьрегистрына " + "рассчитатьрегистрыпо симв создатьобъект статусвозврата стрколичествострок сформироватьпозициюдокумента " + "счетпокоду текущеевремя типзначения типзначениястр установитьтана установитьтапо фиксшаблон шаблон ",
            j = "acos asin atan base64значение base64строка cos exp log log10 pow sin sqrt tan xmlзначение xmlстрока " + "xmlтип xmlтипзнч активноеокно безопасныйрежим безопасныйрежимразделенияданных булево ввестидату ввестизначение " + "ввестистроку ввестичисло возможностьчтенияxml вопрос восстановитьзначение врег выгрузитьжурналрегистрации " + "выполнитьобработкуоповещения выполнитьпроверкуправдоступа вычислить год данныеформывзначение дата день деньгода " + "деньнедели добавитьмесяц заблокироватьданныедляредактирования заблокироватьработупользователя завершитьработусистемы " + "загрузитьвнешнююкомпоненту закрытьсправку записатьjson записатьxml записатьдатуjson записьжурналарегистрации " + "заполнитьзначениясвойств запроситьразрешениепользователя запуститьприложение запуститьсистему зафиксироватьтранзакцию " + "значениевданныеформы значениевстрокувнутр значениевфайл значениезаполнено значениеизстрокивнутр значениеизфайла " + "изxmlтипа импортмоделиxdto имякомпьютера имяпользователя инициализироватьпредопределенныеданные информацияобошибке " + "каталогбиблиотекимобильногоустройства каталогвременныхфайлов каталогдокументов каталогпрограммы кодироватьстроку " + "кодлокализацииинформационнойбазы кодсимвола командасистемы конецгода конецдня конецквартала конецмесяца конецминуты " + "конецнедели конецчаса конфигурациябазыданныхизмененадинамически конфигурацияизменена копироватьданныеформы " + "копироватьфайл краткоепредставлениеошибки лев макс местноевремя месяц мин минута монопольныйрежим найти " + "найтинедопустимыесимволыxml найтиокнопонавигационнойссылке найтипомеченныенаудаление найтипоссылкам найтифайлы " + "началогода началодня началоквартала началомесяца началоминуты началонедели началочаса начатьзапросразрешенияпользователя " + "начатьзапускприложения начатькопированиефайла начатьперемещениефайла начатьподключениевнешнейкомпоненты " + "начатьподключениерасширенияработыскриптографией начатьподключениерасширенияработысфайлами начатьпоискфайлов " + "начатьполучениекаталогавременныхфайлов начатьполучениекаталогадокументов начатьполучениерабочегокаталогаданныхпользователя " + "начатьполучениефайлов начатьпомещениефайла начатьпомещениефайлов начатьсозданиедвоичныхданныхизфайла начатьсозданиекаталога " + "начатьтранзакцию начатьудалениефайлов начатьустановкувнешнейкомпоненты начатьустановкурасширенияработыскриптографией " + "начатьустановкурасширенияработысфайлами неделягода необходимостьзавершениясоединения номерсеансаинформационнойбазы " + "номерсоединенияинформационнойбазы нрег нстр обновитьинтерфейс обновитьнумерациюобъектов обновитьповторноиспользуемыезначения " + "обработкапрерыванияпользователя объединитьфайлы окр описаниеошибки оповестить оповеститьобизменении " + "отключитьобработчикзапросанастроекклиенталицензирования отключитьобработчикожидания отключитьобработчикоповещения " + "открытьзначение открытьиндекссправки открытьсодержаниесправки открытьсправку открытьформу открытьформумодально " + "отменитьтранзакцию очиститьжурналрегистрации очиститьнастройкипользователя очиститьсообщения параметрыдоступа " + "перейтипонавигационнойссылке переместитьфайл подключитьвнешнююкомпоненту " + "подключитьобработчикзапросанастроекклиенталицензирования подключитьобработчикожидания подключитьобработчикоповещения " + "подключитьрасширениеработыскриптографией подключитьрасширениеработысфайлами подробноепредставлениеошибки " + "показатьвводдаты показатьвводзначения показатьвводстроки показатьвводчисла показатьвопрос показатьзначение " + "показатьинформациюобошибке показатьнакарте показатьоповещениепользователя показатьпредупреждение полноеимяпользователя " + "получитьcomобъект получитьxmlтип получитьадреспоместоположению получитьблокировкусеансов получитьвремязавершенияспящегосеанса " + "получитьвремязасыпанияпассивногосеанса получитьвремяожиданияблокировкиданных получитьданныевыбора " + "получитьдополнительныйпараметрклиенталицензирования получитьдопустимыекодылокализации получитьдопустимыечасовыепояса " + "получитьзаголовокклиентскогоприложения получитьзаголовоксистемы получитьзначенияотборажурналарегистрации " + "получитьидентификаторконфигурации получитьизвременногохранилища получитьимявременногофайла " + "получитьимяклиенталицензирования получитьинформациюэкрановклиента получитьиспользованиежурналарегистрации " + "получитьиспользованиесобытияжурналарегистрации получитькраткийзаголовокприложения получитьмакетоформления " + "получитьмаскувсефайлы получитьмаскувсефайлыклиента получитьмаскувсефайлысервера получитьместоположениепоадресу " + "получитьминимальнуюдлинупаролейпользователей получитьнавигационнуюссылку получитьнавигационнуюссылкуинформационнойбазы " + "получитьобновлениеконфигурациибазыданных получитьобновлениепредопределенныхданныхинформационнойбазы получитьобщиймакет " + "получитьобщуюформу получитьокна получитьоперативнуюотметкувремени получитьотключениебезопасногорежима " + "получитьпараметрыфункциональныхопцийинтерфейса получитьполноеимяпредопределенногозначения " + "получитьпредставлениянавигационныхссылок получитьпроверкусложностипаролейпользователей получитьразделительпути " + "получитьразделительпутиклиента получитьразделительпутисервера получитьсеансыинформационнойбазы " + "получитьскоростьклиентскогосоединения получитьсоединенияинформационнойбазы получитьсообщенияпользователю " + "получитьсоответствиеобъектаиформы получитьсоставстандартногоинтерфейсаodata получитьструктурухранениябазыданных " + "получитьтекущийсеансинформационнойбазы получитьфайл получитьфайлы получитьформу получитьфункциональнуюопцию " + "получитьфункциональнуюопциюинтерфейса получитьчасовойпоясинформационнойбазы пользователиос поместитьвовременноехранилище " + "поместитьфайл поместитьфайлы прав праводоступа предопределенноезначение представлениекодалокализации представлениепериода " + "представлениеправа представлениеприложения представлениесобытияжурналарегистрации представлениечасовогопояса предупреждение " + "прекратитьработусистемы привилегированныйрежим продолжитьвызов прочитатьjson прочитатьxml прочитатьдатуjson пустаястрока " + "рабочийкаталогданныхпользователя разблокироватьданныедляредактирования разделитьфайл разорватьсоединениесвнешнимисточникомданных " + "раскодироватьстроку рольдоступна секунда сигнал символ скопироватьжурналрегистрации смещениелетнеговремени " + "смещениестандартноговремени соединитьбуферыдвоичныхданных создатькаталог создатьфабрикуxdto сокрл сокрлп сокрп сообщить " + "состояние сохранитьзначение сохранитьнастройкипользователя сред стрдлина стрзаканчиваетсяна стрзаменить стрнайти стрначинаетсяс " + "строка строкасоединенияинформационнойбазы стрполучитьстроку стрразделить стрсоединить стрсравнить стрчисловхождений " + "стрчислострок стршаблон текущаядата текущаядатасеанса текущаяуниверсальнаядата текущаяуниверсальнаядатавмиллисекундах " + "текущийвариантинтерфейсаклиентскогоприложения текущийвариантосновногошрифтаклиентскогоприложения текущийкодлокализации " + "текущийрежимзапуска текущийязык текущийязыксистемы тип типзнч транзакцияактивна трег удалитьданныеинформационнойбазы " + "удалитьизвременногохранилища удалитьобъекты удалитьфайлы универсальноевремя установитьбезопасныйрежим " + "установитьбезопасныйрежимразделенияданных установитьблокировкусеансов установитьвнешнююкомпоненту " + "установитьвремязавершенияспящегосеанса установитьвремязасыпанияпассивногосеанса установитьвремяожиданияблокировкиданных " + "установитьзаголовокклиентскогоприложения установитьзаголовоксистемы установитьиспользованиежурналарегистрации " + "установитьиспользованиесобытияжурналарегистрации установитькраткийзаголовокприложения " + "установитьминимальнуюдлинупаролейпользователей установитьмонопольныйрежим установитьнастройкиклиенталицензирования " + "установитьобновлениепредопределенныхданныхинформационнойбазы установитьотключениебезопасногорежима " + "установитьпараметрыфункциональныхопцийинтерфейса установитьпривилегированныйрежим " + "установитьпроверкусложностипаролейпользователей установитьрасширениеработыскриптографией " + "установитьрасширениеработысфайлами установитьсоединениесвнешнимисточникомданных установитьсоответствиеобъектаиформы " + "установитьсоставстандартногоинтерфейсаodata установитьчасовойпоясинформационнойбазы установитьчасовойпояссеанса " + "формат цел час часовойпояс часовойпояссеанса число числопрописью этоадресвременногохранилища ",
            J = "wsссылки библиотекакартинок библиотекамакетовоформлениякомпоновкиданных библиотекастилей бизнеспроцессы " + "внешниеисточникиданных внешниеобработки внешниеотчеты встроенныепокупки главныйинтерфейс главныйстиль " + "документы доставляемыеуведомления журналыдокументов задачи информацияобинтернетсоединении использованиерабочейдаты " + "историяработыпользователя константы критерииотбора метаданные обработки отображениерекламы отправкадоставляемыхуведомлений " + "отчеты панельзадачос параметрзапуска параметрысеанса перечисления планывидоврасчета планывидовхарактеристик " + "планыобмена планысчетов полнотекстовыйпоиск пользователиинформационнойбазы последовательности проверкавстроенныхпокупок " + "рабочаядата расширенияконфигурации регистрыбухгалтерии регистрынакопления регистрырасчета регистрысведений " + "регламентныезадания сериализаторxdto справочники средствагеопозиционирования средствакриптографии средствамультимедиа " + "средстваотображениярекламы средствапочты средствателефонии фабрикаxdto файловыепотоки фоновыезадания хранилищанастроек " + "хранилищевариантовотчетов хранилищенастроекданныхформ хранилищеобщихнастроек хранилищепользовательскихнастроекдинамическихсписков " + "хранилищепользовательскихнастроекотчетов хранилищесистемныхнастроек ",
            M = $ + H + j + J,
            D = "webцвета windowsцвета windowsшрифты библиотекакартинок рамкистиля символы цветастиля шрифтыстиля ",
            X = "автоматическоесохранениеданныхформывнастройках автонумерациявформе автораздвижениесерий " + "анимациядиаграммы вариантвыравниванияэлементовизаголовков вариантуправлениявысотойтаблицы " + "вертикальнаяпрокруткаформы вертикальноеположение вертикальноеположениеэлемента видгруппыформы " + "виддекорацииформы виддополненияэлементаформы видизмененияданных видкнопкиформы видпереключателя " + "видподписейкдиаграмме видполяформы видфлажка влияниеразмеранапузырекдиаграммы горизонтальноеположение " + "горизонтальноеположениеэлемента группировкаколонок группировкаподчиненныхэлементовформы " + "группыиэлементы действиеперетаскивания дополнительныйрежимотображения допустимыедействияперетаскивания " + "интервалмеждуэлементамиформы использованиевывода использованиеполосыпрокрутки " + "используемоезначениеточкибиржевойдиаграммы историявыборапривводе источникзначенийоситочекдиаграммы " + "источникзначенияразмерапузырькадиаграммы категориягруппыкоманд максимумсерий начальноеотображениедерева " + "начальноеотображениесписка обновлениетекстаредактирования ориентациядендрограммы ориентациядиаграммы " + "ориентацияметокдиаграммы ориентацияметоксводнойдиаграммы ориентацияэлементаформы отображениевдиаграмме " + "отображениевлегендедиаграммы отображениегруппыкнопок отображениезаголовкашкалыдиаграммы " + "отображениезначенийсводнойдиаграммы отображениезначенияизмерительнойдиаграммы " + "отображениеинтерваладиаграммыганта отображениекнопки отображениекнопкивыбора отображениеобсужденийформы " + "отображениеобычнойгруппы отображениеотрицательныхзначенийпузырьковойдиаграммы отображениепанелипоиска " + "отображениеподсказки отображениепредупрежденияприредактировании отображениеразметкиполосырегулирования " + "отображениестраницформы отображениетаблицы отображениетекстазначениядиаграммыганта " + "отображениеуправленияобычнойгруппы отображениефигурыкнопки палитрацветовдиаграммы поведениеобычнойгруппы " + "поддержкамасштабадендрограммы поддержкамасштабадиаграммыганта поддержкамасштабасводнойдиаграммы " + "поисквтаблицепривводе положениезаголовкаэлементаформы положениекартинкикнопкиформы " + "положениекартинкиэлементаграфическойсхемы положениекоманднойпанелиформы положениекоманднойпанелиэлементаформы " + "положениеопорнойточкиотрисовки положениеподписейкдиаграмме положениеподписейшкалызначенийизмерительнойдиаграммы " + "положениесостоянияпросмотра положениестрокипоиска положениетекстасоединительнойлинии положениеуправленияпоиском " + "положениешкалывремени порядокотображенияточекгоризонтальнойгистограммы порядоксерийвлегендедиаграммы " + "размеркартинки расположениезаголовкашкалыдиаграммы растягиваниеповертикалидиаграммыганта " + "режимавтоотображениясостояния режимвводастроктаблицы режимвыборанезаполненного режимвыделениядаты " + "режимвыделениястрокитаблицы режимвыделениятаблицы режимизмененияразмера режимизменениясвязанногозначения " + "режимиспользованиядиалогапечати режимиспользованияпараметракоманды режиммасштабированияпросмотра " + "режимосновногоокнаклиентскогоприложения режимоткрытияокнаформы режимотображениявыделения " + "режимотображениягеографическойсхемы режимотображениязначенийсерии режимотрисовкисеткиграфическойсхемы " + "режимполупрозрачностидиаграммы режимпробеловдиаграммы режимразмещениянастранице режимредактированияколонки " + "режимсглаживаниядиаграммы режимсглаживанияиндикатора режимсписказадач сквозноевыравнивание " + "сохранениеданныхформывнастройках способзаполнениятекстазаголовкашкалыдиаграммы " + "способопределенияограничивающегозначениядиаграммы стандартнаягруппакоманд стандартноеоформление " + "статусоповещенияпользователя стильстрелки типаппроксимациилиниитрендадиаграммы типдиаграммы " + "типединицышкалывремени типимпортасерийслоягеографическойсхемы типлиниигеографическойсхемы типлиниидиаграммы " + "типмаркерагеографическойсхемы типмаркерадиаграммы типобластиоформления " + "типорганизацииисточникаданныхгеографическойсхемы типотображениясериислоягеографическойсхемы " + "типотображенияточечногообъектагеографическойсхемы типотображенияшкалыэлементалегендыгеографическойсхемы " + "типпоискаобъектовгеографическойсхемы типпроекциигеографическойсхемы типразмещенияизмерений " + "типразмещенияреквизитовизмерений типрамкиэлементауправления типсводнойдиаграммы " + "типсвязидиаграммыганта типсоединениязначенийпосериямдиаграммы типсоединенияточекдиаграммы " + "типсоединительнойлинии типстороныэлементаграфическойсхемы типформыотчета типшкалырадарнойдиаграммы " + "факторлиниитрендадиаграммы фигуракнопки фигурыграфическойсхемы фиксациявтаблице форматдняшкалывремени " + "форматкартинки ширинаподчиненныхэлементовформы ",
            P = "виддвижениябухгалтерии виддвижениянакопления видпериодарегистрарасчета видсчета видточкимаршрутабизнеспроцесса " + "использованиеагрегатарегистранакопления использованиегруппиэлементов использованиережимапроведения " + "использованиесреза периодичностьагрегатарегистранакопления режимавтовремя режимзаписидокумента режимпроведениядокумента ",
            W = "авторегистрацияизменений допустимыйномерсообщения отправкаэлементаданных получениеэлементаданных ",
            Z = "использованиерасшифровкитабличногодокумента ориентациястраницы положениеитоговколоноксводнойтаблицы " + "положениеитоговстроксводнойтаблицы положениетекстаотносительнокартинки расположениезаголовкагруппировкитабличногодокумента " + "способчтениязначенийтабличногодокумента типдвустороннейпечати типзаполненияобластитабличногодокумента " + "типкурсоровтабличногодокумента типлиниирисункатабличногодокумента типлинииячейкитабличногодокумента " + "типнаправленияпереходатабличногодокумента типотображениявыделениятабличногодокумента типотображениялинийсводнойтаблицы " + "типразмещениятекстатабличногодокумента типрисункатабличногодокумента типсмещениятабличногодокумента " + "типузоратабличногодокумента типфайлатабличногодокумента точностьпечати чередованиерасположениястраниц ",
            G = "отображениевремениэлементовпланировщика ",
            f = "типфайлаформатированногодокумента ",
            v = "обходрезультатазапроса типзаписизапроса ",
            N = "видзаполнениярасшифровкипостроителяотчета типдобавленияпредставлений типизмеренияпостроителяотчета типразмещенияитогов ",
            V = "доступкфайлу режимдиалогавыборафайла режимоткрытияфайла ",
            L = "типизмеренияпостроителязапроса ",
            h = "видданныханализа методкластеризации типединицыинтервалавременианализаданных типзаполнениятаблицырезультатаанализаданных " + "типиспользованиячисловыхзначенийанализаданных типисточникаданныхпоискаассоциаций типколонкианализаданныхдереворешений " + "типколонкианализаданныхкластеризация типколонкианализаданныхобщаястатистика типколонкианализаданныхпоискассоциаций " + "типколонкианализаданныхпоискпоследовательностей типколонкимоделипрогноза типмерырасстоянияанализаданных " + "типотсеченияправилассоциации типполяанализаданных типстандартизациианализаданных типупорядочиванияправилассоциациианализаданных " + "типупорядочиванияшаблоновпоследовательностейанализаданных типупрощениядереварешений ",
            R = "wsнаправлениепараметра вариантxpathxs вариантзаписидатыjson вариантпростоготипаxs видгруппымоделиxs видфасетаxdto " + "действиепостроителяdom завершенностьпростоготипаxs завершенностьсоставноготипаxs завершенностьсхемыxs запрещенныеподстановкиxs " + "исключениягруппподстановкиxs категорияиспользованияатрибутаxs категорияограниченияидентичностиxs категорияограниченияпространствименxs " + "методнаследованияxs модельсодержимогоxs назначениетипаxml недопустимыеподстановкиxs обработкапробельныхсимволовxs обработкасодержимогоxs " + "ограничениезначенияxs параметрыотбораузловdom переносстрокjson позициявдокументеdom пробельныесимволыxml типатрибутаxml типзначенияjson " + "типканоническогоxml типкомпонентыxs типпроверкиxml типрезультатаdomxpath типузлаdom типузлаxml формаxml формапредставленияxs " + "форматдатыjson экранированиесимволовjson ",
            u = "видсравнениякомпоновкиданных действиеобработкирасшифровкикомпоновкиданных направлениесортировкикомпоновкиданных " + "расположениевложенныхэлементоврезультатакомпоновкиданных расположениеитоговкомпоновкиданных расположениегруппировкикомпоновкиданных " + "расположениеполейгруппировкикомпоновкиданных расположениеполякомпоновкиданных расположениереквизитовкомпоновкиданных " + "расположениересурсовкомпоновкиданных типбухгалтерскогоостаткакомпоновкиданных типвыводатекстакомпоновкиданных " + "типгруппировкикомпоновкиданных типгруппыэлементовотборакомпоновкиданных типдополненияпериодакомпоновкиданных " + "типзаголовкаполейкомпоновкиданных типмакетагруппировкикомпоновкиданных типмакетаобластикомпоновкиданных типостаткакомпоновкиданных " + "типпериодакомпоновкиданных типразмещениятекстакомпоновкиданных типсвязинаборовданныхкомпоновкиданных типэлементарезультатакомпоновкиданных " + "расположениелегендыдиаграммыкомпоновкиданных типпримененияотборакомпоновкиданных режимотображенияэлементанастройкикомпоновкиданных " + "режимотображениянастроеккомпоновкиданных состояниеэлементанастройкикомпоновкиданных способвосстановлениянастроеккомпоновкиданных " + "режимкомпоновкирезультата использованиепараметракомпоновкиданных автопозицияресурсовкомпоновкиданных " + "вариантиспользованиягруппировкикомпоновкиданных расположениересурсоввдиаграммекомпоновкиданных фиксациякомпоновкиданных " + "использованиеусловногооформлениякомпоновкиданных ",
            I = "важностьинтернетпочтовогосообщения обработкатекстаинтернетпочтовогосообщения способкодированияинтернетпочтовоговложения " + "способкодированиянеasciiсимволовинтернетпочтовогосообщения типтекстапочтовогосообщения протоколинтернетпочты " + "статусразборапочтовогосообщения ",
            g = "режимтранзакциизаписижурналарегистрации статустранзакциизаписижурналарегистрации уровеньжурналарегистрации ",
            B = "расположениехранилищасертификатовкриптографии режимвключениясертификатовкриптографии режимпроверкисертификатакриптографии " + "типхранилищасертификатовкриптографии ",
            b = "кодировкаименфайловвzipфайле методсжатияzip методшифрованияzip режимвосстановленияпутейфайловzip режимобработкиподкаталоговzip " + "режимсохраненияпутейzip уровеньсжатияzip ",
            p = "звуковоеоповещение направлениепереходакстроке позициявпотоке порядокбайтов режимблокировкиданных режимуправленияблокировкойданных " + "сервисвстроенныхпокупок состояниефоновогозадания типподписчикадоставляемыхуведомлений уровеньиспользованиязащищенногосоединенияftp ",
            Q = "направлениепорядкасхемызапроса типдополненияпериодамисхемызапроса типконтрольнойточкисхемызапроса типобъединениясхемызапроса " + "типпараметрадоступнойтаблицысхемызапроса типсоединениясхемызапроса ",
            U = "httpметод автоиспользованиеобщегореквизита автопрефиксномеразадачи вариантвстроенногоязыка видиерархии видрегистранакопления " + "видтаблицывнешнегоисточникаданных записьдвиженийприпроведении заполнениепоследовательностей индексирование " + "использованиебазыпланавидоврасчета использованиебыстроговыбора использованиеобщегореквизита использованиеподчинения " + "использованиеполнотекстовогопоиска использованиеразделяемыхданныхобщегореквизита использованиереквизита " + "назначениеиспользованияприложения назначениерасширенияконфигурации направлениепередачи обновлениепредопределенныхданных " + "оперативноепроведение основноепредставлениевидарасчета основноепредставлениевидахарактеристики основноепредставлениезадачи " + "основноепредставлениепланаобмена основноепредставлениесправочника основноепредставлениесчета перемещениеграницыприпроведении " + "периодичностьномерабизнеспроцесса периодичностьномерадокумента периодичностьрегистрарасчета периодичностьрегистрасведений " + "повторноеиспользованиевозвращаемыхзначений полнотекстовыйпоискпривводепостроке принадлежностьобъекта проведение " + "разделениеаутентификацииобщегореквизита разделениеданныхобщегореквизита разделениерасширенийконфигурацииобщегореквизита " + "режимавтонумерацииобъектов режимзаписирегистра режимиспользованиямодальности " + "режимиспользованиясинхронныхвызововрасширенийплатформыивнешнихкомпонент режимповторногоиспользованиясеансов " + "режимполученияданныхвыборапривводепостроке режимсовместимости режимсовместимостиинтерфейса " + "режимуправленияблокировкойданныхпоумолчанию сериикодовпланавидовхарактеристик сериикодовпланасчетов " + "сериикодовсправочника созданиепривводе способвыбора способпоискастрокипривводепостроке способредактирования " + "типданныхтаблицывнешнегоисточникаданных типкодапланавидоврасчета типкодасправочника типмакета типномерабизнеспроцесса " + "типномерадокумента типномеразадачи типформы удалениедвижений ",
            r = "важностьпроблемыприменениярасширенияконфигурации вариантинтерфейсаклиентскогоприложения вариантмасштабаформклиентскогоприложения " + "вариантосновногошрифтаклиентскогоприложения вариантстандартногопериода вариантстандартнойдатыначала видграницы видкартинки " + "видотображенияполнотекстовогопоиска видрамки видсравнения видцвета видчисловогозначения видшрифта допустимаядлина допустимыйзнак " + "использованиеbyteordermark использованиеметаданныхполнотекстовогопоиска источникрасширенийконфигурации клавиша кодвозвратадиалога " + "кодировкаxbase кодировкатекста направлениепоиска направлениесортировки обновлениепредопределенныхданных обновлениеприизмененииданных " + "отображениепанелиразделов проверказаполнения режимдиалогавопрос режимзапускаклиентскогоприложения режимокругления режимоткрытияформприложения " + "режимполнотекстовогопоиска скоростьклиентскогосоединения состояниевнешнегоисточникаданных состояниеобновленияконфигурациибазыданных " + "способвыборасертификатаwindows способкодированиястроки статуссообщения типвнешнейкомпоненты типплатформы типповеденияклавишиenter " + "типэлементаинформацииовыполненииобновленияконфигурациибазыданных уровеньизоляциитранзакций хешфункция частидаты",
            e = D + X + P + W + Z + G + f + v + N + V + L + h + R + u + I + g + B + b + p + Q + U + r,
            Y6 = "comобъект ftpсоединение httpзапрос httpсервисответ httpсоединение wsопределения wsпрокси xbase анализданных аннотацияxs " + "блокировкаданных буфердвоичныхданных включениеxs выражениекомпоновкиданных генераторслучайныхчисел географическаясхема " + "географическиекоординаты графическаясхема группамоделиxs данныерасшифровкикомпоновкиданных двоичныеданные дендрограмма " + "диаграмма диаграммаганта диалогвыборафайла диалогвыборацвета диалогвыборашрифта диалограсписаниярегламентногозадания " + "диалогредактированиястандартногопериода диапазон документdom документhtml документацияxs доставляемоеуведомление " + "записьdom записьfastinfoset записьhtml записьjson записьxml записьzipфайла записьданных записьтекста записьузловdom " + "запрос защищенноесоединениеopenssl значенияполейрасшифровкикомпоновкиданных извлечениетекста импортxs интернетпочта " + "интернетпочтовоесообщение интернетпочтовыйпрофиль интернетпрокси интернетсоединение информациядляприложенияxs " + "использованиеатрибутаxs использованиесобытияжурналарегистрации источникдоступныхнастроеккомпоновкиданных " + "итераторузловdom картинка квалификаторыдаты квалификаторыдвоичныхданных квалификаторыстроки квалификаторычисла " + "компоновщикмакетакомпоновкиданных компоновщикнастроеккомпоновкиданных конструктормакетаоформлениякомпоновкиданных " + "конструкторнастроеккомпоновкиданных конструкторформатнойстроки линия макеткомпоновкиданных макетобластикомпоновкиданных " + "макетоформлениякомпоновкиданных маскаxs менеджеркриптографии наборсхемxml настройкикомпоновкиданных настройкисериализацииjson " + "обработкакартинок обработкарасшифровкикомпоновкиданных обходдереваdom объявлениеатрибутаxs объявлениенотацииxs " + "объявлениеэлементаxs описаниеиспользованиясобытиядоступжурналарегистрации " + "описаниеиспользованиясобытияотказвдоступежурналарегистрации описаниеобработкирасшифровкикомпоновкиданных " + "описаниепередаваемогофайла описаниетипов определениегруппыатрибутовxs определениегруппымоделиxs " + "определениеограниченияидентичностиxs определениепростоготипаxs определениесоставноготипаxs определениетипадокументаdom " + "определенияxpathxs отборкомпоновкиданных пакетотображаемыхдокументов параметрвыбора параметркомпоновкиданных " + "параметрызаписиjson параметрызаписиxml параметрычтенияxml переопределениеxs планировщик полеанализаданных " + "полекомпоновкиданных построительdom построительзапроса построительотчета построительотчетаанализаданных " + "построительсхемxml поток потоквпамяти почта почтовоесообщение преобразованиеxsl преобразованиекканоническомуxml " + "процессорвыводарезультатакомпоновкиданныхвколлекциюзначений процессорвыводарезультатакомпоновкиданныхвтабличныйдокумент " + "процессоркомпоновкиданных разыменовательпространствименdom рамка расписаниерегламентногозадания расширенноеимяxml " + "результатчтенияданных своднаядиаграмма связьпараметравыбора связьпотипу связьпотипукомпоновкиданных сериализаторxdto " + "сертификатклиентаwindows сертификатклиентафайл сертификаткриптографии сертификатыудостоверяющихцентровwindows " + "сертификатыудостоверяющихцентровфайл сжатиеданных системнаяинформация сообщениепользователю сочетаниеклавиш " + "сравнениезначений стандартнаядатаначала стандартныйпериод схемаxml схемакомпоновкиданных табличныйдокумент " + "текстовыйдокумент тестируемоеприложение типданныхxml уникальныйидентификатор фабрикаxdto файл файловыйпоток " + "фасетдлиныxs фасетколичестваразрядовдробнойчастиxs фасетмаксимальноговключающегозначенияxs " + "фасетмаксимальногоисключающегозначенияxs фасетмаксимальнойдлиныxs фасетминимальноговключающегозначенияxs " + "фасетминимальногоисключающегозначенияxs фасетминимальнойдлиныxs фасетобразцаxs фасетобщегоколичестваразрядовxs " + "фасетперечисленияxs фасетпробельныхсимволовxs фильтрузловdom форматированнаястрока форматированныйдокумент " + "фрагментxs хешированиеданных хранилищезначения цвет чтениеfastinfoset чтениеhtml чтениеjson чтениеxml чтениеzipфайла " + "чтениеданных чтениетекста чтениеузловdom шрифт элементрезультатакомпоновкиданных ",
            H6 = "comsafearray деревозначений массив соответствие списокзначений структура таблицазначений фиксированнаяструктура " + "фиксированноесоответствие фиксированныймассив ",
            J6 = Y6 + H6,
            K6 = "null истина ложь неопределено",
            s = A.inherit(A.NUMBER_MODE),
            X6 = {
                className: "string",
                begin: '"|\\|',
                end: '"|$',
                contains: [{
                    begin: '""'
                }]
            },
            z6 = {
                begin: "'",
                end: "'",
                excludeBegin: !0,
                excludeEnd: !0,
                contains: [{
                    className: "number",
                    begin: "\\d{4}([\\.\\\\/:-]?\\d{2}){0,5}"
                }]
            },
            N6 = A.inherit(A.C_LINE_COMMENT_MODE),
            $6 = {
                className: "meta",
                begin: "#|&",
                end: "$",
                keywords: {
                    $pattern: q,
                    "meta-keyword": z + O
                },
                contains: [N6]
            },
            n = {
                className: "symbol",
                begin: "~",
                end: ";|:",
                excludeEnd: !0
            },
            o = {
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
                            literal: K6
                        },
                        contains: [s, X6, z6]
                    }, N6]
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
                built_in: M,
                class: e,
                type: J6,
                literal: K6
            },
            contains: [$6, o, N6, n, s, X6, z6]
        }
    }
    lw4.exports = CU9
})
// @from(Ln 253246, Col 4)
rw4 = x((U7w, nw4) => {
    function IU9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function bU9(...A) {
        return A.map((K) => IU9(K)).join("")
    }

    function xU9(A) {
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
            _ = {
                className: "symbol",
                begin: /%d[0-9]+(-[0-9]+|(\.[0-9]+)+){0,1}/
            },
            w = {
                className: "symbol",
                begin: /%x[0-9A-F]+(-[0-9A-F]+|(\.[0-9A-F]+)+){0,1}/
            },
            O = {
                className: "symbol",
                begin: /%[si]/
            },
            $ = {
                className: "attribute",
                begin: bU9(q.ruleDeclaration, /(?=\s*=)/)
            };
        return {
            name: "Augmented Backus-Naur Form",
            illegal: q.unexpectedChars,
            keywords: K,
            contains: [$, Y, z, _, w, O, A.QUOTE_STRING_MODE, A.NUMBER_MODE]
        }
    }
    nw4.exports = xU9
})
// @from(Ln 253293, Col 4)
sw4 = x((d7w, aw4) => {
    function ow4(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function uU9(...A) {
        return A.map((K) => ow4(K)).join("")
    }

    function mU9(...A) {
        return "(" + A.map((K) => ow4(K)).join("|") + ")"
    }

    function BU9(A) {
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
                begin: uU9(/"/, mU9(...q)),
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
    aw4.exports = BU9
})
// @from(Ln 253359, Col 4)
ew4 = x((c7w, tw4) => {
    function gU9(A) {
        if (!A) return null;
        if (typeof A === "string") return A;
        return A.source
    }

    function FU9(...A) {
        return A.map((K) => gU9(K)).join("")
    }

    function pU9(A) {
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
                    begin: FU9(/:\s*/, K)
                }]
            }, A.METHOD_GUARD],
            illegal: /#/
        }
    }
    tw4.exports = pU9
})
// @from(Ln 253426, Col 4)
qO4 = x((l7w, AO4) => {
    function QU9(A) {
        let K = "[eE][-+]?\\d(_|\\d)*",
            Y = "\\d(_|\\d)*(\\.\\d(_|\\d)*)?(" + K + ")?",
            z = "\\w+",
            w = "\\b(" + ("\\d(_|\\d)*#\\w+(\\.\\w+)?#(" + K + ")?") + "|" + Y + ")",
            O = "[A-Za-z](_?[A-Za-z0-9.])*",
            $ = `[]\\{\\}%#'"`,
            H = A.COMMENT("--", "$"),
            j = {
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
            contains: [H, {
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
                begin: w,
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
                contains: [H, {
                    className: "title",
                    begin: "(\\bwith\\s+)?\\b(function|procedure)\\s+",
                    end: "(\\(|\\s+|$)",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    illegal: `[]\\{\\}%#'"`
                }, j, {
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
            }, j]
        }
    }
    AO4.exports = QU9
})