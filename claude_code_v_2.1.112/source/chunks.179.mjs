
// @from(Ln 459575, Col 0)
function VFK(q) {
    let K = s(75),
        {
            onComplete: _,
            args: z,
            showMcpRedirectMessage: Y
        } = q,
        A, O;
    if (K[0] !== z) A = WFK(z), O = txY(A), K[0] = z, K[1] = A, K[2] = O;
    else A = K[1], O = K[2];
    let w = O,
        [$, j] = HZ.useState(w),
        H;
    if (K[3] !== w) H = exY(w), K[3] = w, K[4] = H;
    else H = K[4];
    let [J, X] = HZ.useState(H), [M, P] = HZ.useState($.type === "add-marketplace" ? $.initialValue || "" : ""), [W, D] = HZ.useState(0), [Z, G] = HZ.useState(null), [f, v] = HZ.useState(null), [V, k] = HZ.useState(!1), N = R7(), R = M8(KuY), h = R > 0 ? `Errors (${R})` : "Errors", C = $3(), x = A.type === "marketplace" && A.action === "add" && A.target !== void 0, B;
    if (K[5] !== N) B = () => {
        N(quY)
    }, K[5] = N, K[6] = B;
    else B = K[6];
    let m = B,
        S;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) S = (G6) => {
        let k6 = G6;
        X(k6), G(null);
        q: switch (k6) {
            case "discover": {
                j({
                    type: "discover-plugins"
                });
                break q
            }
            case "installed": {
                j({
                    type: "manage-plugins"
                });
                break q
            }
            case "marketplaces": {
                j({
                    type: "manage-marketplaces"
                });
                break q
            }
            case "errors":
        }
    }, K[7] = S;
    else S = K[7];
    let F = S,
        U, g;
    if (K[8] !== _ || K[9] !== f || K[10] !== $.type) U = () => {
        if ($.type === "menu" && !f) _()
    }, g = [$.type, f, _], K[8] = _, K[9] = f, K[10] = $.type, K[11] = U, K[12] = g;
    else U = K[11], g = K[12];
    HZ.useEffect(U, g);
    let c, n;
    if (K[13] !== J || K[14] !== $.type) c = () => {
        if ($.type === "browse-marketplace" && J !== "discover") X("discover")
    }, n = [$.type, J], K[13] = J, K[14] = $.type, K[15] = c, K[16] = n;
    else c = K[15], n = K[16];
    HZ.useEffect(c, n);
    let l;
    if (K[17] === Symbol.for("react.memo_cache_sentinel")) l = () => {
        X("marketplaces"), j({
            type: "manage-marketplaces"
        }), P(""), G(null)
    }, K[17] = l;
    else l = K[17];
    let z6 = l,
        A6 = $.type === "add-marketplace",
        e;
    if (K[18] !== A6) e = {
        context: "Settings",
        isActive: A6
    }, K[18] = A6, K[19] = e;
    else e = K[19];
    G1("confirm:no", z6, e);
    let i, O6;
    if (K[20] !== _ || K[21] !== f) i = () => {
        if (f) _(f)
    }, O6 = [f, _], K[20] = _, K[21] = f, K[22] = i, K[23] = O6;
    else i = K[22], O6 = K[23];
    HZ.useEffect(i, O6);
    let J6, $6;
    if (K[24] !== _ || K[25] !== $.type) J6 = () => {
        if ($.type === "help") _()
    }, $6 = [$.type, _], K[24] = _, K[25] = $.type, K[26] = J6, K[27] = $6;
    else J6 = K[26], $6 = K[27];
    if (HZ.useEffect(J6, $6), $.type === "help") {
        let G6;
        if (K[28] === Symbol.for("react.memo_cache_sentinel")) G6 = e1.createElement(u, {
            flexDirection: "column"
        }, e1.createElement(T, {
            bold: !0
        }, "Plugin Command Usage:"), e1.createElement(T, null, " "), e1.createElement(T, {
            dimColor: !0
        }, "Installation:"), e1.createElement(T, null, " /plugin install - Browse and install plugins"), e1.createElement(T, null, " ", "/plugin install <marketplace> - Install from specific marketplace"), e1.createElement(T, null, " /plugin install <plugin> - Install specific plugin"), e1.createElement(T, null, " ", "/plugin install <plugin>@<market> - Install plugin from marketplace"), e1.createElement(T, null, " "), e1.createElement(T, {
            dimColor: !0
        }, "Management:"), e1.createElement(T, null, " /plugin manage - Manage installed plugins"), e1.createElement(T, null, " /plugin enable <plugin> - Enable a plugin"), e1.createElement(T, null, " /plugin disable <plugin> - Disable a plugin"), e1.createElement(T, null, " /plugin uninstall <plugin> - Uninstall a plugin"), e1.createElement(T, null, " "), e1.createElement(T, {
            dimColor: !0
        }, "Marketplaces:"), e1.createElement(T, null, " /plugin marketplace - Marketplace management menu"), e1.createElement(T, null, " /plugin marketplace add - Add a marketplace"), e1.createElement(T, null, " ", "/plugin marketplace add <path/url> - Add marketplace directly"), e1.createElement(T, null, " /plugin marketplace update - Update marketplaces"), e1.createElement(T, null, " ", "/plugin marketplace update <name> - Update specific marketplace"), e1.createElement(T, null, " /plugin marketplace remove - Remove a marketplace"), e1.createElement(T, null, " ", "/plugin marketplace remove <name> - Remove specific marketplace"), e1.createElement(T, null, " /plugin marketplace list - List all marketplaces"), e1.createElement(T, null, " "), e1.createElement(T, {
            dimColor: !0
        }, "Validation:"), e1.createElement(T, null, " ", "/plugin validate <path> - Validate a manifest file or directory"), e1.createElement(T, null, " "), e1.createElement(T, {
            dimColor: !0
        }, "Other:"), e1.createElement(T, null, " /plugin - Main plugin menu"), e1.createElement(T, null, " /plugin help - Show this help"), e1.createElement(T, null, " /plugins - Alias for /plugin")), K[28] = G6;
        else G6 = K[28];
        return G6
    }
    if ($.type === "validate") {
        let G6;
        if (K[29] !== _ || K[30] !== $.path) G6 = e1.createElement(GFK, {
            onComplete: _,
            path: $.path
        }), K[29] = _, K[30] = $.path, K[31] = G6;
        else G6 = K[31];
        return G6
    }
    if ($.type === "marketplace-menu") return j({
        type: "menu"
    }), null;
    if ($.type === "marketplace-list") {
        let G6;
        if (K[32] !== _) G6 = e1.createElement(mxY, {
            onComplete: _
        }), K[32] = _, K[33] = G6;
        else G6 = K[33];
        return G6
    }
    if ($.type === "add-marketplace") {
        let G6;
        if (K[34] !== x || K[35] !== W || K[36] !== Z || K[37] !== M || K[38] !== m || K[39] !== f) G6 = e1.createElement(QpK, {
            inputValue: M,
            setInputValue: P,
            cursorOffset: W,
            setCursorOffset: D,
            error: Z,
            setError: G,
            result: f,
            setResult: v,
            setViewState: j,
            onAddComplete: m,
            cliMode: x
        }), K[34] = x, K[35] = W, K[36] = Z, K[37] = M, K[38] = m, K[39] = f, K[40] = G6;
        else G6 = K[40];
        return G6
    }
    let H6;
    if (K[41] !== J || K[42] !== Y) H6 = Y && J === "installed" ? e1.createElement(pxY, null) : void 0, K[41] = J, K[42] = Y, K[43] = H6;
    else H6 = K[43];
    let q6;
    if (K[44] !== Z || K[45] !== m || K[46] !== f || K[47] !== $.targetMarketplace || K[48] !== $.targetPlugin || K[49] !== $.type) q6 = e1.createElement($O, {
        id: "discover",
        title: "Discover"
    }, $.type === "browse-marketplace" ? e1.createElement(npK, {
        error: Z,
        setError: G,
        result: f,
        setResult: v,
        setViewState: j,
        onInstallComplete: m,
        targetMarketplace: $.targetMarketplace,
        targetPlugin: $.targetPlugin
    }) : e1.createElement(rpK, {
        error: Z,
        setError: G,
        result: f,
        setResult: v,
        setViewState: j,
        onInstallComplete: m,
        onSearchModeChange: k,
        targetPlugin: $.type === "discover-plugins" ? $.targetPlugin : void 0
    })), K[44] = Z, K[45] = m, K[46] = f, K[47] = $.targetMarketplace, K[48] = $.targetPlugin, K[49] = $.type, K[50] = q6;
    else q6 = K[50];
    let o = $.type === "manage-plugins" ? $.targetPlugin : void 0,
        _6 = $.type === "manage-plugins" ? $.targetMarketplace : void 0,
        r = $.type === "manage-plugins" ? $.action : void 0,
        t;
    if (K[51] !== m || K[52] !== o || K[53] !== _6 || K[54] !== r) t = e1.createElement($O, {
        id: "installed",
        title: "Installed"
    }, e1.createElement(MFK, {
        setViewState: j,
        setResult: v,
        onManageComplete: m,
        onSearchModeChange: k,
        targetPlugin: o,
        targetMarketplace: _6,
        action: r
    })), K[51] = m, K[52] = o, K[53] = _6, K[54] = r, K[55] = t;
    else t = K[55];
    let Y6 = $.type === "manage-marketplaces" ? $.targetMarketplace : void 0,
        X6 = $.type === "manage-marketplaces" ? $.action : void 0,
        M6;
    if (K[56] !== Z || K[57] !== C || K[58] !== m || K[59] !== Y6 || K[60] !== X6) M6 = e1.createElement($O, {
        id: "marketplaces",
        title: "Marketplaces"
    }, e1.createElement(_FK, {
        setViewState: j,
        error: Z,
        setError: G,
        setResult: v,
        exitState: C,
        onManageComplete: m,
        targetMarketplace: Y6,
        action: X6
    })), K[56] = Z, K[57] = C, K[58] = m, K[59] = Y6, K[60] = X6, K[61] = M6;
    else M6 = K[61];
    let W6;
    if (K[62] !== m) W6 = e1.createElement(dxY, {
        setViewState: j,
        setActiveTab: X,
        markPluginsChanged: m
    }), K[62] = m, K[63] = W6;
    else W6 = K[63];
    let V6;
    if (K[64] !== h || K[65] !== W6) V6 = e1.createElement($O, {
        id: "errors",
        title: h
    }, W6), K[64] = h, K[65] = W6, K[66] = V6;
    else V6 = K[66];
    let f6;
    if (K[67] !== J || K[68] !== V || K[69] !== H6 || K[70] !== q6 || K[71] !== t || K[72] !== M6 || K[73] !== V6) f6 = e1.createElement(A_, {
        color: "suggestion"
    }, e1.createElement(JL, {
        title: "Plugins",
        selectedTab: J,
        onTabChange: F,
        color: "suggestion",
        disableNavigation: V,
        banner: H6
    }, q6, t, M6, V6)), K[67] = J, K[68] = V, K[69] = H6, K[70] = q6, K[71] = t, K[72] = M6, K[73] = V6, K[74] = f6;
    else f6 = K[74];
    return f6
}
// @from(Ln 459810, Col 0)
function quY(q) {
    return q.plugins.needsRefresh ? q : {
        ...q,
        plugins: {
            ...q.plugins,
            needsRefresh: !0
        }
    }
}
// @from(Ln 459820, Col 0)
function KuY(q) {
    let K = q.plugins.errors.length;
    for (let _ of q.plugins.installationStatus.marketplaces)
        if (_.status === "failed") K++;
    return K
}
// @from(Ln 459826, Col 4)
e1
// @from(Ln 459826, Col 8)
HZ
// @from(Ln 459826, Col 12)
gxY
// @from(Ln 459827, Col 4)
vw7 = L(() => {
    o6();
    Qq();
    bK();
    Nq();
    DJ();
    BT();
    C$();
    g6();
    C7();
    N7();
    m8();
    uR();
    Xc();
    m$();
    X_8();
    a1();
    dpK();
    ipK();
    opK();
    zFK();
    PFK();
    Jw7();
    vFK();
    e1 = K6(P6(), 1), HZ = K6(P6(), 1);
    gxY = new Set(["git-auth-failed", "git-timeout", "network-error"])
})
// @from(Ln 459854, Col 4)
kFK = {}
// @from(Ln 459859, Col 0)
function _uY(q) {
    let K = s(7),
        {
            action: _,
            target: z,
            onComplete: Y
        } = q,
        A = M8(YuY),
        O = m_6(),
        w = re.useRef(!1),
        $, j;
    if (K[0] !== _ || K[1] !== A || K[2] !== Y || K[3] !== z || K[4] !== O) $ = () => {
        if (w.current) return;
        w.current = !0;
        let H = _ === "enable",
            J = A.filter(zuY),
            X = z === "all" ? J.filter((M) => H ? M.type === "disabled" : M.type !== "disabled") : J.filter((M) => M.name === z);
        if (X.length === 0) {
            Y(z === "all" ? `All MCP servers are already ${H?"enabled":"disabled"}` : `MCP server "${z}" not found`);
            return
        }
        for (let M of X) O(M.name);
        Y(z === "all" ? `${H?"Enabled":"Disabled"} ${X.length} MCP server(s)` : `MCP server "${z}" ${H?"enabled":"disabled"}`)
    }, j = [_, z, A, O, Y], K[0] = _, K[1] = A, K[2] = Y, K[3] = z, K[4] = O, K[5] = $, K[6] = j;
    else $ = K[5], j = K[6];
    return re.useEffect($, j), null
}
// @from(Ln 459887, Col 0)
function zuY(q) {
    return q.name !== "ide"
}
// @from(Ln 459891, Col 0)
function YuY(q) {
    return q.mcp.clients
}
// @from(Ln 459894, Col 0)
async function AuY(q, K, _) {
    if (_) {
        let z = _.trim().split(/\s+/);
        if (z[0] === "no-redirect") return re.default.createElement(Ci8, {
            onComplete: q
        });
        if (z[0] === "reconnect" && z[1]) return re.default.createElement(qw7, {
            serverName: z.slice(1).join(" "),
            onComplete: q
        });
        if (z[0] === "enable" || z[0] === "disable") return re.default.createElement(_uY, {
            action: z[0],
            target: z.length > 1 ? z.slice(1).join(" ") : "all",
            onComplete: q
        })
    }
    return re.default.createElement(Ci8, {
        onComplete: q
    })
}
// @from(Ln 459914, Col 4)
re
// @from(Ln 459915, Col 4)
NFK = L(() => {
    o6();
    FpK();
    Kw7();
    B_6();
    N7();
    vw7();
    re = K6(P6(), 1)
})
// @from(Ln 459924, Col 4)
OuY
// @from(Ln 459924, Col 9)
EFK
// @from(Ln 459925, Col 4)
yFK = L(() => {
    OuY = {
        type: "local-jsx",
        name: "mcp",
        description: "Manage MCP servers",
        immediate: !0,
        argumentHint: "[enable|disable [server-name]]",
        load: () => Promise.resolve().then(() => (NFK(), kFK))
    }, EFK = OuY
})
// @from(Ln 459935, Col 4)
Tw7 = p((a7j, LFK) => {
    LFK.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then
    }
})
// @from(Ln 459940, Col 4)
U_6 = p(($uY) => {
    var Vw7, wuY = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    $uY.getSymbolSize = function(K) {
        if (!K) throw Error('"version" cannot be null or undefined');
        if (K < 1 || K > 40) throw Error('"version" should be in range from 1 to 40');
        return K * 4 + 17
    };
    $uY.getSymbolTotalCodewords = function(K) {
        return wuY[K]
    };
    $uY.getBCHDigit = function(q) {
        let K = 0;
        while (q !== 0) K++, q >>>= 1;
        return K
    };
    $uY.setToSJISFunction = function(K) {
        if (typeof K !== "function") throw Error('"toSJISFunc" is not a valid function.');
        Vw7 = K
    };
    $uY.isKanjiModeEnabled = function() {
        return typeof Vw7 < "u"
    };
    $uY.toSJIS = function(K) {
        return Vw7(K)
    }
})
// @from(Ln 459966, Col 4)
li8 = p((DuY) => {
    DuY.L = {
        bit: 1
    };
    DuY.M = {
        bit: 0
    };
    DuY.Q = {
        bit: 3
    };
    DuY.H = {
        bit: 2
    };

    function WuY(q) {
        if (typeof q !== "string") throw Error("Param is not a string");
        switch (q.toLowerCase()) {
            case "l":
            case "low":
                return DuY.L;
            case "m":
            case "medium":
                return DuY.M;
            case "q":
            case "quartile":
                return DuY.Q;
            case "h":
            case "high":
                return DuY.H;
            default:
                throw Error("Unknown EC Level: " + q)
        }
    }
    DuY.isValid = function(K) {
        return K && typeof K.bit < "u" && K.bit >= 0 && K.bit < 4
    };
    DuY.from = function(K, _) {
        if (DuY.isValid(K)) return K;
        try {
            return WuY(K)
        } catch (z) {
            return _
        }
    }
})
// @from(Ln 460011, Col 4)
uFK = p((e7j, xFK) => {
    function IFK() {
        this.buffer = [], this.length = 0
    }
    IFK.prototype = {
        get: function(q) {
            let K = Math.floor(q / 8);
            return (this.buffer[K] >>> 7 - q % 8 & 1) === 1
        },
        put: function(q, K) {
            for (let _ = 0; _ < K; _++) this.putBit((q >>> K - _ - 1 & 1) === 1)
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(q) {
            let K = Math.floor(this.length / 8);
            if (this.buffer.length <= K) this.buffer.push(0);
            if (q) this.buffer[K] |= 128 >>> this.length % 8;
            this.length++
        }
    };
    xFK.exports = IFK
})
// @from(Ln 460035, Col 4)
BFK = p((qqj, mFK) => {
    function v_8(q) {
        if (!q || q < 1) throw Error("BitMatrix size must be defined and greater than 0");
        this.size = q, this.data = new Uint8Array(q * q), this.reservedBit = new Uint8Array(q * q)
    }
    v_8.prototype.set = function(q, K, _, z) {
        let Y = q * this.size + K;
        if (this.data[Y] = _, z) this.reservedBit[Y] = !0
    };
    v_8.prototype.get = function(q, K) {
        return this.data[q * this.size + K]
    };
    v_8.prototype.xor = function(q, K, _) {
        this.data[q * this.size + K] ^= _
    };
    v_8.prototype.isReserved = function(q, K) {
        return this.reservedBit[q * this.size + K]
    };
    mFK.exports = v_8
})
// @from(Ln 460055, Col 4)
FFK = p((GuY) => {
    var fuY = U_6().getSymbolSize;
    GuY.getRowColCoords = function(K) {
        if (K === 1) return [];
        let _ = Math.floor(K / 7) + 2,
            z = fuY(K),
            Y = z === 145 ? 26 : Math.ceil((z - 13) / (2 * _ - 2)) * 2,
            A = [z - 7];
        for (let O = 1; O < _ - 1; O++) A[O] = A[O - 1] - Y;
        return A.push(6), A.reverse()
    };
    GuY.getPositions = function(K) {
        let _ = [],
            z = GuY.getRowColCoords(K),
            Y = z.length;
        for (let A = 0; A < Y; A++)
            for (let O = 0; O < Y; O++) {
                if (A === 0 && O === 0 || A === 0 && O === Y - 1 || A === Y - 1 && O === 0) continue;
                _.push([z[A], z[O]])
            }
        return _
    }
})
// @from(Ln 460078, Col 4)
gFK = p((VuY) => {
    var TuY = U_6().getSymbolSize;
    VuY.getPositions = function(K) {
        let _ = TuY(K);
        return [
            [0, 0],
            [_ - 7, 0],
            [0, _ - 7]
        ]
    }
})
// @from(Ln 460089, Col 4)
nFK = p((EuY) => {
    EuY.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    var lP6 = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
    };
    EuY.isValid = function(K) {
        return K != null && K !== "" && !isNaN(K) && K >= 0 && K <= 7
    };
    EuY.from = function(K) {
        return EuY.isValid(K) ? parseInt(K, 10) : void 0
    };
    EuY.getPenaltyN1 = function(K) {
        let _ = K.size,
            z = 0,
            Y = 0,
            A = 0,
            O = null,
            w = null;
        for (let $ = 0; $ < _; $++) {
            Y = A = 0, O = w = null;
            for (let j = 0; j < _; j++) {
                let H = K.get($, j);
                if (H === O) Y++;
                else {
                    if (Y >= 5) z += lP6.N1 + (Y - 5);
                    O = H, Y = 1
                }
                if (H = K.get(j, $), H === w) A++;
                else {
                    if (A >= 5) z += lP6.N1 + (A - 5);
                    w = H, A = 1
                }
            }
            if (Y >= 5) z += lP6.N1 + (Y - 5);
            if (A >= 5) z += lP6.N1 + (A - 5)
        }
        return z
    };
    EuY.getPenaltyN2 = function(K) {
        let _ = K.size,
            z = 0;
        for (let Y = 0; Y < _ - 1; Y++)
            for (let A = 0; A < _ - 1; A++) {
                let O = K.get(Y, A) + K.get(Y, A + 1) + K.get(Y + 1, A) + K.get(Y + 1, A + 1);
                if (O === 4 || O === 0) z++
            }
        return z * lP6.N2
    };
    EuY.getPenaltyN3 = function(K) {
        let _ = K.size,
            z = 0,
            Y = 0,
            A = 0;
        for (let O = 0; O < _; O++) {
            Y = A = 0;
            for (let w = 0; w < _; w++) {
                if (Y = Y << 1 & 2047 | K.get(O, w), w >= 10 && (Y === 1488 || Y === 93)) z++;
                if (A = A << 1 & 2047 | K.get(w, O), w >= 10 && (A === 1488 || A === 93)) z++
            }
        }
        return z * lP6.N3
    };
    EuY.getPenaltyN4 = function(K) {
        let _ = 0,
            z = K.data.length;
        for (let A = 0; A < z; A++) _ += K.data[A];
        return Math.abs(Math.ceil(_ * 100 / z / 5) - 10) * lP6.N4
    };

    function NuY(q, K, _) {
        switch (q) {
            case EuY.Patterns.PATTERN000:
                return (K + _) % 2 === 0;
            case EuY.Patterns.PATTERN001:
                return K % 2 === 0;
            case EuY.Patterns.PATTERN010:
                return _ % 3 === 0;
            case EuY.Patterns.PATTERN011:
                return (K + _) % 3 === 0;
            case EuY.Patterns.PATTERN100:
                return (Math.floor(K / 2) + Math.floor(_ / 3)) % 2 === 0;
            case EuY.Patterns.PATTERN101:
                return K * _ % 2 + K * _ % 3 === 0;
            case EuY.Patterns.PATTERN110:
                return (K * _ % 2 + K * _ % 3) % 2 === 0;
            case EuY.Patterns.PATTERN111:
                return (K * _ % 3 + (K + _) % 2) % 2 === 0;
            default:
                throw Error("bad maskPattern:" + q)
        }
    }
    EuY.applyMask = function(K, _) {
        let z = _.size;
        for (let Y = 0; Y < z; Y++)
            for (let A = 0; A < z; A++) {
                if (_.isReserved(A, Y)) continue;
                _.xor(A, Y, NuY(K, A, Y))
            }
    };
    EuY.getBestMask = function(K, _) {
        let z = Object.keys(EuY.Patterns).length,
            Y = 0,
            A = 1 / 0;
        for (let O = 0; O < z; O++) {
            _(O), EuY.applyMask(O, K);
            let w = EuY.getPenaltyN1(K) + EuY.getPenaltyN2(K) + EuY.getPenaltyN3(K) + EuY.getPenaltyN4(K);
            if (EuY.applyMask(O, K), w < A) A = w, Y = O
        }
        return Y
    }
})
// @from(Ln 460212, Col 4)
Nw7 = p((huY) => {
    var Q_6 = li8(),
        ni8 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81],
        ii8 = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
    huY.getBlocksCount = function(K, _) {
        switch (_) {
            case Q_6.L:
                return ni8[(K - 1) * 4 + 0];
            case Q_6.M:
                return ni8[(K - 1) * 4 + 1];
            case Q_6.Q:
                return ni8[(K - 1) * 4 + 2];
            case Q_6.H:
                return ni8[(K - 1) * 4 + 3];
            default:
                return
        }
    };
    huY.getTotalCodewordsCount = function(K, _) {
        switch (_) {
            case Q_6.L:
                return ii8[(K - 1) * 4 + 0];
            case Q_6.M:
                return ii8[(K - 1) * 4 + 1];
            case Q_6.Q:
                return ii8[(K - 1) * 4 + 2];
            case Q_6.H:
                return ii8[(K - 1) * 4 + 3];
            default:
                return
        }
    }
})
// @from(Ln 460245, Col 4)
iFK = p((CuY) => {
    var T_8 = new Uint8Array(512),
        ri8 = new Uint8Array(256);
    (function() {
        let K = 1;
        for (let _ = 0; _ < 255; _++)
            if (T_8[_] = K, ri8[K] = _, K <<= 1, K & 256) K ^= 285;
        for (let _ = 255; _ < 512; _++) T_8[_] = T_8[_ - 255]
    })();
    CuY.log = function(K) {
        if (K < 1) throw Error("log(" + K + ")");
        return ri8[K]
    };
    CuY.exp = function(K) {
        return T_8[K]
    };
    CuY.mul = function(K, _) {
        if (K === 0 || _ === 0) return 0;
        return T_8[ri8[K] + ri8[_]]
    }
})
// @from(Ln 460266, Col 4)
oFK = p((uuY) => {
    var Ew7 = iFK();
    uuY.mul = function(K, _) {
        let z = new Uint8Array(K.length + _.length - 1);
        for (let Y = 0; Y < K.length; Y++)
            for (let A = 0; A < _.length; A++) z[Y + A] ^= Ew7.mul(K[Y], _[A]);
        return z
    };
    uuY.mod = function(K, _) {
        let z = new Uint8Array(K);
        while (z.length - _.length >= 0) {
            let Y = z[0];
            for (let O = 0; O < _.length; O++) z[O] ^= Ew7.mul(_[O], Y);
            let A = 0;
            while (A < z.length && z[A] === 0) A++;
            z = z.slice(A)
        }
        return z
    };
    uuY.generateECPolynomial = function(K) {
        let _ = new Uint8Array([1]);
        for (let z = 0; z < K; z++) _ = uuY.mul(_, new Uint8Array([1, Ew7.exp(z)]));
        return _
    }
})
// @from(Ln 460291, Col 4)
tFK = p((wqj, sFK) => {
    var aFK = oFK();

    function yw7(q) {
        if (this.genPoly = void 0, this.degree = q, this.degree) this.initialize(this.degree)
    }
    yw7.prototype.initialize = function(K) {
        this.degree = K, this.genPoly = aFK.generateECPolynomial(this.degree)
    };
    yw7.prototype.encode = function(K) {
        if (!this.genPoly) throw Error("Encoder not initialized");
        let _ = new Uint8Array(K.length + this.degree);
        _.set(K);
        let z = aFK.mod(_, this.genPoly),
            Y = this.degree - z.length;
        if (Y > 0) {
            let A = new Uint8Array(this.degree);
            return A.set(z, Y), A
        }
        return z
    };
    sFK.exports = yw7
})
// @from(Ln 460314, Col 4)
Lw7 = p((puY) => {
    puY.isValid = function(K) {
        return !isNaN(K) && K >= 1 && K <= 40
    }
})
// @from(Ln 460319, Col 4)
hw7 = p((cuY) => {
    var V_8 = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    V_8 = V_8.replace(/u/g, "\\u");
    var guY = "(?:(?![A-Z0-9 $%*+\\-./:]|" + V_8 + `)(?:.|[\r
]))+`;
    cuY.KANJI = new RegExp(V_8, "g");
    cuY.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    cuY.BYTE = new RegExp(guY, "g");
    cuY.NUMERIC = new RegExp("[0-9]+", "g");
    cuY.ALPHANUMERIC = new RegExp("[A-Z $%*+\\-./:]+", "g");
    var UuY = new RegExp("^" + V_8 + "$"),
        QuY = new RegExp("^[0-9]+$"),
        duY = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    cuY.testKanji = function(K) {
        return UuY.test(K)
    };
    cuY.testNumeric = function(K) {
        return QuY.test(K)
    };
    cuY.testAlphanumeric = function(K) {
        return duY.test(K)
    }
})
// @from(Ln 460342, Col 4)
d_6 = p((KmY) => {
    var euY = Lw7(),
        Rw7 = hw7();
    KmY.NUMERIC = {
        id: "Numeric",
        bit: 1,
        ccBits: [10, 12, 14]
    };
    KmY.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 2,
        ccBits: [9, 11, 13]
    };
    KmY.BYTE = {
        id: "Byte",
        bit: 4,
        ccBits: [8, 16, 16]
    };
    KmY.KANJI = {
        id: "Kanji",
        bit: 8,
        ccBits: [8, 10, 12]
    };
    KmY.MIXED = {
        bit: -1
    };
    KmY.getCharCountIndicator = function(K, _) {
        if (!K.ccBits) throw Error("Invalid mode: " + K);
        if (!euY.isValid(_)) throw Error("Invalid version: " + _);
        if (_ >= 1 && _ < 10) return K.ccBits[0];
        else if (_ < 27) return K.ccBits[1];
        return K.ccBits[2]
    };
    KmY.getBestModeForData = function(K) {
        if (Rw7.testNumeric(K)) return KmY.NUMERIC;
        else if (Rw7.testAlphanumeric(K)) return KmY.ALPHANUMERIC;
        else if (Rw7.testKanji(K)) return KmY.KANJI;
        else return KmY.BYTE
    };
    KmY.toString = function(K) {
        if (K && K.id) return K.id;
        throw Error("Invalid mode")
    };
    KmY.isValid = function(K) {
        return K && K.bit && K.ccBits
    };

    function qmY(q) {
        if (typeof q !== "string") throw Error("Param is not a string");
        switch (q.toLowerCase()) {
            case "numeric":
                return KmY.NUMERIC;
            case "alphanumeric":
                return KmY.ALPHANUMERIC;
            case "kanji":
                return KmY.KANJI;
            case "byte":
                return KmY.BYTE;
            default:
                throw Error("Unknown mode: " + q)
        }
    }
    KmY.from = function(K, _) {
        if (KmY.isValid(K)) return K;
        try {
            return qmY(K)
        } catch (z) {
            return _
        }
    }
})
// @from(Ln 460413, Col 4)
YgK = p((JmY) => {
    var oi8 = U_6(),
        wmY = Nw7(),
        qgK = li8(),
        c_6 = d_6(),
        xw7 = Lw7(),
        KgK = oi8.getBCHDigit(7973);

    function $mY(q, K, _) {
        for (let z = 1; z <= 40; z++)
            if (K <= JmY.getCapacity(z, _, q)) return z;
        return
    }

    function _gK(q, K) {
        return c_6.getCharCountIndicator(q, K) + 4
    }

    function jmY(q, K) {
        let _ = 0;
        return q.forEach(function(z) {
            let Y = _gK(z.mode, K);
            _ += Y + z.getBitsLength()
        }), _
    }

    function HmY(q, K) {
        for (let _ = 1; _ <= 40; _++)
            if (jmY(q, _) <= JmY.getCapacity(_, K, c_6.MIXED)) return _;
        return
    }
    JmY.from = function(K, _) {
        if (xw7.isValid(K)) return parseInt(K, 10);
        return _
    };
    JmY.getCapacity = function(K, _, z) {
        if (!xw7.isValid(K)) throw Error("Invalid QR Code version");
        if (typeof z > "u") z = c_6.BYTE;
        let Y = oi8.getSymbolTotalCodewords(K),
            A = wmY.getTotalCodewordsCount(K, _),
            O = (Y - A) * 8;
        if (z === c_6.MIXED) return O;
        let w = O - _gK(z, K);
        switch (z) {
            case c_6.NUMERIC:
                return Math.floor(w / 10 * 3);
            case c_6.ALPHANUMERIC:
                return Math.floor(w / 11 * 2);
            case c_6.KANJI:
                return Math.floor(w / 13);
            case c_6.BYTE:
            default:
                return Math.floor(w / 8)
        }
    };
    JmY.getBestVersionForData = function(K, _) {
        let z, Y = qgK.from(_, qgK.M);
        if (Array.isArray(K)) {
            if (K.length > 1) return HmY(K, Y);
            if (K.length === 0) return 1;
            z = K[0]
        } else z = K;
        return $mY(z.mode, z.getLength(), Y)
    };
    JmY.getEncodedBits = function(K) {
        if (!xw7.isValid(K) || K < 7) throw Error("Invalid QR Code version");
        let _ = K << 12;
        while (oi8.getBCHDigit(_) - KgK >= 0) _ ^= 7973 << oi8.getBCHDigit(_) - KgK;
        return K << 12 | _
    }
})
// @from(Ln 460484, Col 4)
OgK = p((WmY) => {
    var uw7 = U_6(),
        AgK = uw7.getBCHDigit(1335);
    WmY.getEncodedBits = function(K, _) {
        let z = K.bit << 3 | _,
            Y = z << 10;
        while (uw7.getBCHDigit(Y) - AgK >= 0) Y ^= 1335 << uw7.getBCHDigit(Y) - AgK;
        return (z << 10 | Y) ^ 21522
    }
})
// @from(Ln 460494, Col 4)
$gK = p((Mqj, wgK) => {
    var ZmY = d_6();

    function px6(q) {
        this.mode = ZmY.NUMERIC, this.data = q.toString()
    }
    px6.getBitsLength = function(K) {
        return 10 * Math.floor(K / 3) + (K % 3 ? K % 3 * 3 + 1 : 0)
    };
    px6.prototype.getLength = function() {
        return this.data.length
    };
    px6.prototype.getBitsLength = function() {
        return px6.getBitsLength(this.data.length)
    };
    px6.prototype.write = function(K) {
        let _, z, Y;
        for (_ = 0; _ + 3 <= this.data.length; _ += 3) z = this.data.substr(_, 3), Y = parseInt(z, 10), K.put(Y, 10);
        let A = this.data.length - _;
        if (A > 0) z = this.data.substr(_), Y = parseInt(z, 10), K.put(Y, A * 3 + 1)
    };
    wgK.exports = px6
})
// @from(Ln 460517, Col 4)
HgK = p((Pqj, jgK) => {
    var fmY = d_6(),
        mw7 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];

    function Fx6(q) {
        this.mode = fmY.ALPHANUMERIC, this.data = q
    }
    Fx6.getBitsLength = function(K) {
        return 11 * Math.floor(K / 2) + 6 * (K % 2)
    };
    Fx6.prototype.getLength = function() {
        return this.data.length
    };
    Fx6.prototype.getBitsLength = function() {
        return Fx6.getBitsLength(this.data.length)
    };
    Fx6.prototype.write = function(K) {
        let _;
        for (_ = 0; _ + 2 <= this.data.length; _ += 2) {
            let z = mw7.indexOf(this.data[_]) * 45;
            z += mw7.indexOf(this.data[_ + 1]), K.put(z, 11)
        }
        if (this.data.length % 2) K.put(mw7.indexOf(this.data[_]), 6)
    };
    jgK.exports = Fx6
})
// @from(Ln 460543, Col 4)
XgK = p((Wqj, JgK) => {
    var GmY = d_6();

    function gx6(q) {
        if (this.mode = GmY.BYTE, typeof q === "string") this.data = new TextEncoder().encode(q);
        else this.data = new Uint8Array(q)
    }
    gx6.getBitsLength = function(K) {
        return K * 8
    };
    gx6.prototype.getLength = function() {
        return this.data.length
    };
    gx6.prototype.getBitsLength = function() {
        return gx6.getBitsLength(this.data.length)
    };
    gx6.prototype.write = function(q) {
        for (let K = 0, _ = this.data.length; K < _; K++) q.put(this.data[K], 8)
    };
    JgK.exports = gx6
})
// @from(Ln 460564, Col 4)
PgK = p((Dqj, MgK) => {
    var vmY = d_6(),
        TmY = U_6();

    function Ux6(q) {
        this.mode = vmY.KANJI, this.data = q
    }
    Ux6.getBitsLength = function(K) {
        return K * 13
    };
    Ux6.prototype.getLength = function() {
        return this.data.length
    };
    Ux6.prototype.getBitsLength = function() {
        return Ux6.getBitsLength(this.data.length)
    };
    Ux6.prototype.write = function(q) {
        let K;
        for (K = 0; K < this.data.length; K++) {
            let _ = TmY.toSJIS(this.data[K]);
            if (_ >= 33088 && _ <= 40956) _ -= 33088;
            else if (_ >= 57408 && _ <= 60351) _ -= 49472;
            else throw Error("Invalid SJIS character: " + this.data[K] + `
Make sure your charset is UTF-8`);
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), q.put(_, 13)
        }
    };
    MgK.exports = Ux6
})
// @from(Ln 460593, Col 4)
WgK = p((Zqj, Bw7) => {
    var k_8 = {
        single_source_shortest_paths: function(q, K, _) {
            var z = {},
                Y = {};
            Y[K] = 0;
            var A = k_8.PriorityQueue.make();
            A.push(K, 0);
            var O, w, $, j, H, J, X, M, P;
            while (!A.empty()) {
                O = A.pop(), w = O.value, j = O.cost, H = q[w] || {};
                for ($ in H)
                    if (H.hasOwnProperty($)) {
                        if (J = H[$], X = j + J, M = Y[$], P = typeof Y[$] > "u", P || M > X) Y[$] = X, A.push($, X), z[$] = w
                    }
            }
            if (typeof _ < "u" && typeof Y[_] > "u") {
                var W = ["Could not find a path from ", K, " to ", _, "."].join("");
                throw Error(W)
            }
            return z
        },
        extract_shortest_path_from_predecessor_list: function(q, K) {
            var _ = [],
                z = K,
                Y;
            while (z) _.push(z), Y = q[z], z = q[z];
            return _.reverse(), _
        },
        find_path: function(q, K, _) {
            var z = k_8.single_source_shortest_paths(q, K, _);
            return k_8.extract_shortest_path_from_predecessor_list(z, _)
        },
        PriorityQueue: {
            make: function(q) {
                var K = k_8.PriorityQueue,
                    _ = {},
                    z;
                q = q || {};
                for (z in K)
                    if (K.hasOwnProperty(z)) _[z] = K[z];
                return _.queue = [], _.sorter = q.sorter || K.default_sorter, _
            },
            default_sorter: function(q, K) {
                return q.cost - K.cost
            },
            push: function(q, K) {
                var _ = {
                    value: q,
                    cost: K
                };
                this.queue.push(_), this.queue.sort(this.sorter)
            },
            pop: function() {
                return this.queue.shift()
            },
            empty: function() {
                return this.queue.length === 0
            }
        }
    };
    if (typeof Bw7 < "u") Bw7.exports = k_8
})
// @from(Ln 460656, Col 4)
kgK = p((ymY) => {
    var Aw = d_6(),
        fgK = $gK(),
        GgK = HgK(),
        vgK = XgK(),
        TgK = PgK(),
        N_8 = hw7(),
        ai8 = U_6(),
        VmY = WgK();

    function DgK(q) {
        return unescape(encodeURIComponent(q)).length
    }

    function E_8(q, K, _) {
        let z = [],
            Y;
        while ((Y = q.exec(_)) !== null) z.push({
            data: Y[0],
            index: Y.index,
            mode: K,
            length: Y[0].length
        });
        return z
    }

    function VgK(q) {
        let K = E_8(N_8.NUMERIC, Aw.NUMERIC, q),
            _ = E_8(N_8.ALPHANUMERIC, Aw.ALPHANUMERIC, q),
            z, Y;
        if (ai8.isKanjiModeEnabled()) z = E_8(N_8.BYTE, Aw.BYTE, q), Y = E_8(N_8.KANJI, Aw.KANJI, q);
        else z = E_8(N_8.BYTE_KANJI, Aw.BYTE, q), Y = [];
        return K.concat(_, z, Y).sort(function(O, w) {
            return O.index - w.index
        }).map(function(O) {
            return {
                data: O.data,
                mode: O.mode,
                length: O.length
            }
        })
    }

    function pw7(q, K) {
        switch (K) {
            case Aw.NUMERIC:
                return fgK.getBitsLength(q);
            case Aw.ALPHANUMERIC:
                return GgK.getBitsLength(q);
            case Aw.KANJI:
                return TgK.getBitsLength(q);
            case Aw.BYTE:
                return vgK.getBitsLength(q)
        }
    }

    function kmY(q) {
        return q.reduce(function(K, _) {
            let z = K.length - 1 >= 0 ? K[K.length - 1] : null;
            if (z && z.mode === _.mode) return K[K.length - 1].data += _.data, K;
            return K.push(_), K
        }, [])
    }

    function NmY(q) {
        let K = [];
        for (let _ = 0; _ < q.length; _++) {
            let z = q[_];
            switch (z.mode) {
                case Aw.NUMERIC:
                    K.push([z, {
                        data: z.data,
                        mode: Aw.ALPHANUMERIC,
                        length: z.length
                    }, {
                        data: z.data,
                        mode: Aw.BYTE,
                        length: z.length
                    }]);
                    break;
                case Aw.ALPHANUMERIC:
                    K.push([z, {
                        data: z.data,
                        mode: Aw.BYTE,
                        length: z.length
                    }]);
                    break;
                case Aw.KANJI:
                    K.push([z, {
                        data: z.data,
                        mode: Aw.BYTE,
                        length: DgK(z.data)
                    }]);
                    break;
                case Aw.BYTE:
                    K.push([{
                        data: z.data,
                        mode: Aw.BYTE,
                        length: DgK(z.data)
                    }])
            }
        }
        return K
    }

    function EmY(q, K) {
        let _ = {},
            z = {
                start: {}
            },
            Y = ["start"];
        for (let A = 0; A < q.length; A++) {
            let O = q[A],
                w = [];
            for (let $ = 0; $ < O.length; $++) {
                let j = O[$],
                    H = "" + A + $;
                w.push(H), _[H] = {
                    node: j,
                    lastCount: 0
                }, z[H] = {};
                for (let J = 0; J < Y.length; J++) {
                    let X = Y[J];
                    if (_[X] && _[X].node.mode === j.mode) z[X][H] = pw7(_[X].lastCount + j.length, j.mode) - pw7(_[X].lastCount, j.mode), _[X].lastCount += j.length;
                    else {
                        if (_[X]) _[X].lastCount = j.length;
                        z[X][H] = pw7(j.length, j.mode) + 4 + Aw.getCharCountIndicator(j.mode, K)
                    }
                }
            }
            Y = w
        }
        for (let A = 0; A < Y.length; A++) z[Y[A]].end = 0;
        return {
            map: z,
            table: _
        }
    }

    function ZgK(q, K) {
        let _, z = Aw.getBestModeForData(q);
        if (_ = Aw.from(K, z), _ !== Aw.BYTE && _.bit < z.bit) throw Error('"' + q + '" cannot be encoded with mode ' + Aw.toString(_) + `.
 Suggested mode is: ` + Aw.toString(z));
        if (_ === Aw.KANJI && !ai8.isKanjiModeEnabled()) _ = Aw.BYTE;
        switch (_) {
            case Aw.NUMERIC:
                return new fgK(q);
            case Aw.ALPHANUMERIC:
                return new GgK(q);
            case Aw.KANJI:
                return new TgK(q);
            case Aw.BYTE:
                return new vgK(q)
        }
    }
    ymY.fromArray = function(K) {
        return K.reduce(function(_, z) {
            if (typeof z === "string") _.push(ZgK(z, null));
            else if (z.data) _.push(ZgK(z.data, z.mode));
            return _
        }, [])
    };
    ymY.fromString = function(K, _) {
        let z = VgK(K, ai8.isKanjiModeEnabled()),
            Y = NmY(z),
            A = EmY(Y, _),
            O = VmY.find_path(A.map, "start", "end"),
            w = [];
        for (let $ = 1; $ < O.length - 1; $++) w.push(A.table[O[$]].node);
        return ymY.fromArray(kmY(w))
    };
    ymY.rawSplit = function(K) {
        return ymY.fromArray(VgK(K, ai8.isKanjiModeEnabled()))
    }
})
// @from(Ln 460831, Col 4)
lw7 = p((cmY) => {
    var ti8 = U_6(),
        gw7 = li8(),
        RmY = uFK(),
        SmY = BFK(),
        CmY = FFK(),
        bmY = gFK(),
        dw7 = nFK(),
        cw7 = Nw7(),
        ImY = tFK(),
        si8 = YgK(),
        xmY = OgK(),
        umY = d_6(),
        Uw7 = kgK();

    function mmY(q, K) {
        let _ = q.size,
            z = bmY.getPositions(K);
        for (let Y = 0; Y < z.length; Y++) {
            let A = z[Y][0],
                O = z[Y][1];
            for (let w = -1; w <= 7; w++) {
                if (A + w <= -1 || _ <= A + w) continue;
                for (let $ = -1; $ <= 7; $++) {
                    if (O + $ <= -1 || _ <= O + $) continue;
                    if (w >= 0 && w <= 6 && ($ === 0 || $ === 6) || $ >= 0 && $ <= 6 && (w === 0 || w === 6) || w >= 2 && w <= 4 && $ >= 2 && $ <= 4) q.set(A + w, O + $, !0, !0);
                    else q.set(A + w, O + $, !1, !0)
                }
            }
        }
    }

    function BmY(q) {
        let K = q.size;
        for (let _ = 8; _ < K - 8; _++) {
            let z = _ % 2 === 0;
            q.set(_, 6, z, !0), q.set(6, _, z, !0)
        }
    }

    function pmY(q, K) {
        let _ = CmY.getPositions(K);
        for (let z = 0; z < _.length; z++) {
            let Y = _[z][0],
                A = _[z][1];
            for (let O = -2; O <= 2; O++)
                for (let w = -2; w <= 2; w++)
                    if (O === -2 || O === 2 || w === -2 || w === 2 || O === 0 && w === 0) q.set(Y + O, A + w, !0, !0);
                    else q.set(Y + O, A + w, !1, !0)
        }
    }

    function FmY(q, K) {
        let _ = q.size,
            z = si8.getEncodedBits(K),
            Y, A, O;
        for (let w = 0; w < 18; w++) Y = Math.floor(w / 3), A = w % 3 + _ - 8 - 3, O = (z >> w & 1) === 1, q.set(Y, A, O, !0), q.set(A, Y, O, !0)
    }

    function Qw7(q, K, _) {
        let z = q.size,
            Y = xmY.getEncodedBits(K, _),
            A, O;
        for (A = 0; A < 15; A++) {
            if (O = (Y >> A & 1) === 1, A < 6) q.set(A, 8, O, !0);
            else if (A < 8) q.set(A + 1, 8, O, !0);
            else q.set(z - 15 + A, 8, O, !0);
            if (A < 8) q.set(8, z - A - 1, O, !0);
            else if (A < 9) q.set(8, 15 - A - 1 + 1, O, !0);
            else q.set(8, 15 - A - 1, O, !0)
        }
        q.set(z - 8, 8, 1, !0)
    }

    function gmY(q, K) {
        let _ = q.size,
            z = -1,
            Y = _ - 1,
            A = 7,
            O = 0;
        for (let w = _ - 1; w > 0; w -= 2) {
            if (w === 6) w--;
            while (!0) {
                for (let $ = 0; $ < 2; $++)
                    if (!q.isReserved(Y, w - $)) {
                        let j = !1;
                        if (O < K.length) j = (K[O] >>> A & 1) === 1;
                        if (q.set(Y, w - $, j), A--, A === -1) O++, A = 7
                    } if (Y += z, Y < 0 || _ <= Y) {
                    Y -= z, z = -z;
                    break
                }
            }
        }
    }

    function UmY(q, K, _) {
        let z = new RmY;
        _.forEach(function($) {
            z.put($.mode.bit, 4), z.put($.getLength(), umY.getCharCountIndicator($.mode, q)), $.write(z)
        });
        let Y = ti8.getSymbolTotalCodewords(q),
            A = cw7.getTotalCodewordsCount(q, K),
            O = (Y - A) * 8;
        if (z.getLengthInBits() + 4 <= O) z.put(0, 4);
        while (z.getLengthInBits() % 8 !== 0) z.putBit(0);
        let w = (O - z.getLengthInBits()) / 8;
        for (let $ = 0; $ < w; $++) z.put($ % 2 ? 17 : 236, 8);
        return QmY(z, q, K)
    }

    function QmY(q, K, _) {
        let z = ti8.getSymbolTotalCodewords(K),
            Y = cw7.getTotalCodewordsCount(K, _),
            A = z - Y,
            O = cw7.getBlocksCount(K, _),
            w = z % O,
            $ = O - w,
            j = Math.floor(z / O),
            H = Math.floor(A / O),
            J = H + 1,
            X = j - H,
            M = new ImY(X),
            P = 0,
            W = Array(O),
            D = Array(O),
            Z = 0,
            G = new Uint8Array(q.buffer);
        for (let N = 0; N < O; N++) {
            let R = N < $ ? H : J;
            W[N] = G.slice(P, P + R), D[N] = M.encode(W[N]), P += R, Z = Math.max(Z, R)
        }
        let f = new Uint8Array(z),
            v = 0,
            V, k;
        for (V = 0; V < Z; V++)
            for (k = 0; k < O; k++)
                if (V < W[k].length) f[v++] = W[k][V];
        for (V = 0; V < X; V++)
            for (k = 0; k < O; k++) f[v++] = D[k][V];
        return f
    }

    function dmY(q, K, _, z) {
        let Y;
        if (Array.isArray(q)) Y = Uw7.fromArray(q);
        else if (typeof q === "string") {
            let j = K;
            if (!j) {
                let H = Uw7.rawSplit(q);
                j = si8.getBestVersionForData(H, _)
            }
            Y = Uw7.fromString(q, j || 40)
        } else throw Error("Invalid data");
        let A = si8.getBestVersionForData(Y, _);
        if (!A) throw Error("The amount of data is too big to be stored in a QR Code");
        if (!K) K = A;
        else if (K < A) throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + A + `.
`);
        let O = UmY(K, _, Y),
            w = ti8.getSymbolSize(K),
            $ = new SmY(w);
        if (mmY($, K), BmY($), pmY($, K), Qw7($, _, 0), K >= 7) FmY($, K);
        if (gmY($, O), isNaN(z)) z = dw7.getBestMask($, Qw7.bind(null, $, _));
        return dw7.applyMask(z, $), Qw7($, _, z), {
            modules: $,
            version: K,
            errorCorrectionLevel: _,
            maskPattern: z,
            segments: Y
        }
    }
    cmY.create = function(K, _) {
        if (typeof K > "u" || K === "") throw Error("No input text");
        let z = gw7.M,
            Y, A;
        if (typeof _ < "u") {
            if (z = gw7.from(_.errorCorrectionLevel, gw7.M), Y = si8.from(_.version), A = dw7.from(_.maskPattern), _.toSJISFunc) ti8.setToSJISFunction(_.toSJISFunc)
        }
        return dmY(K, Y, z, A)
    }
})
// @from(Ln 461015, Col 4)
nw7 = p((vqj, EgK) => {
    var nmY = d6("util"),
        NgK = d6("stream"),
        Jg = EgK.exports = function() {
            NgK.call(this), this._buffers = [], this._buffered = 0, this._reads = [], this._paused = !1, this._encoding = "utf8", this.writable = !0
        };
    nmY.inherits(Jg, NgK);
    Jg.prototype.read = function(q, K) {
        this._reads.push({
            length: Math.abs(q),
            allowLess: q < 0,
            func: K
        }), process.nextTick(function() {
            if (this._process(), this._paused && this._reads && this._reads.length > 0) this._paused = !1, this.emit("drain")
        }.bind(this))
    };
    Jg.prototype.write = function(q, K) {
        if (!this.writable) return this.emit("error", Error("Stream not writable")), !1;
        let _;
        if (Buffer.isBuffer(q)) _ = q;
        else _ = Buffer.from(q, K || this._encoding);
        if (this._buffers.push(_), this._buffered += _.length, this._process(), this._reads && this._reads.length === 0) this._paused = !0;
        return this.writable && !this._paused
    };
    Jg.prototype.end = function(q, K) {
        if (q) this.write(q, K);
        if (this.writable = !1, !this._buffers) return;
        if (this._buffers.length === 0) this._end();
        else this._buffers.push(null), this._process()
    };
    Jg.prototype.destroySoon = Jg.prototype.end;
    Jg.prototype._end = function() {
        if (this._reads.length > 0) this.emit("error", Error("Unexpected end of input"));
        this.destroy()
    };
    Jg.prototype.destroy = function() {
        if (!this._buffers) return;
        this.writable = !1, this._reads = null, this._buffers = null, this.emit("close")
    };
    Jg.prototype._processReadAllowingLess = function(q) {
        this._reads.shift();
        let K = this._buffers[0];
        if (K.length > q.length) this._buffered -= q.length, this._buffers[0] = K.slice(q.length), q.func.call(this, K.slice(0, q.length));
        else this._buffered -= K.length, this._buffers.shift(), q.func.call(this, K)
    };
    Jg.prototype._processRead = function(q) {
        this._reads.shift();
        let K = 0,
            _ = 0,
            z = Buffer.alloc(q.length);
        while (K < q.length) {
            let Y = this._buffers[_++],
                A = Math.min(Y.length, q.length - K);
            if (Y.copy(z, K, 0, A), K += A, A !== Y.length) this._buffers[--_] = Y.slice(A)
        }
        if (_ > 0) this._buffers.splice(0, _);
        this._buffered -= q.length, q.func.call(this, z)
    };
    Jg.prototype._process = function() {
        try {
            while (this._buffered > 0 && this._reads && this._reads.length > 0) {
                let q = this._reads[0];
                if (q.allowLess) this._processReadAllowingLess(q);
                else if (this._buffered >= q.length) this._processRead(q);
                else break
            }
            if (this._buffers && !this.writable) this._end()
        } catch (q) {
            this.emit("error", q)
        }
    }
})
// @from(Ln 461087, Col 4)
iw7 = p((imY) => {
    var l_6 = [{
        x: [0],
        y: [0]
    }, {
        x: [4],
        y: [0]
    }, {
        x: [0, 4],
        y: [4]
    }, {
        x: [2, 6],
        y: [0, 4]
    }, {
        x: [0, 2, 4, 6],
        y: [2, 6]
    }, {
        x: [1, 3, 5, 7],
        y: [0, 2, 4, 6]
    }, {
        x: [0, 1, 2, 3, 4, 5, 6, 7],
        y: [1, 3, 5, 7]
    }];
    imY.getImagePasses = function(q, K) {
        let _ = [],
            z = q % 8,
            Y = K % 8,
            A = (q - z) / 8,
            O = (K - Y) / 8;
        for (let w = 0; w < l_6.length; w++) {
            let $ = l_6[w],
                j = A * $.x.length,
                H = O * $.y.length;
            for (let J = 0; J < $.x.length; J++)
                if ($.x[J] < z) j++;
                else break;
            for (let J = 0; J < $.y.length; J++)
                if ($.y[J] < Y) H++;
                else break;
            if (j > 0 && H > 0) _.push({
                width: j,
                height: H,
                index: w
            })
        }
        return _
    };
    imY.getInterlaceIterator = function(q) {
        return function(K, _, z) {
            let Y = K % l_6[z].x.length,
                A = (K - Y) / l_6[z].x.length * 8 + l_6[z].x[Y],
                O = _ % l_6[z].y.length,
                w = (_ - O) / l_6[z].y.length * 8 + l_6[z].y[O];
            return A * 4 + w * q * 4
        }
    }
})
// @from(Ln 461144, Col 4)
rw7 = p((Vqj, ygK) => {
    ygK.exports = function(K, _, z) {
        let Y = K + _ - z,
            A = Math.abs(Y - K),
            O = Math.abs(Y - _),
            w = Math.abs(Y - z);
        if (A <= O && A <= w) return K;
        if (O <= w) return _;
        return z
    }
})
// @from(Ln 461155, Col 4)
ow7 = p((kqj, hgK) => {
    var amY = iw7(),
        smY = rw7();

    function LgK(q, K, _) {
        let z = q * K;
        if (_ !== 8) z = Math.ceil(z / (8 / _));
        return z
    }
    var Qx6 = hgK.exports = function(q, K) {
        let {
            width: _,
            height: z,
            interlace: Y,
            bpp: A,
            depth: O
        } = q;
        if (this.read = K.read, this.write = K.write, this.complete = K.complete, this._imageIndex = 0, this._images = [], Y) {
            let w = amY.getImagePasses(_, z);
            for (let $ = 0; $ < w.length; $++) this._images.push({
                byteWidth: LgK(w[$].width, A, O),
                height: w[$].height,
                lineIndex: 0
            })
        } else this._images.push({
            byteWidth: LgK(_, A, O),
            height: z,
            lineIndex: 0
        });
        if (O === 8) this._xComparison = A;
        else if (O === 16) this._xComparison = A * 2;
        else this._xComparison = 1
    };
    Qx6.prototype.start = function() {
        this.read(this._images[this._imageIndex].byteWidth + 1, this._reverseFilterLine.bind(this))
    };
    Qx6.prototype._unFilterType1 = function(q, K, _) {
        let z = this._xComparison,
            Y = z - 1;
        for (let A = 0; A < _; A++) {
            let O = q[1 + A],
                w = A > Y ? K[A - z] : 0;
            K[A] = O + w
        }
    };
    Qx6.prototype._unFilterType2 = function(q, K, _) {
        let z = this._lastLine;
        for (let Y = 0; Y < _; Y++) {
            let A = q[1 + Y],
                O = z ? z[Y] : 0;
            K[Y] = A + O
        }
    };
    Qx6.prototype._unFilterType3 = function(q, K, _) {
        let z = this._xComparison,
            Y = z - 1,
            A = this._lastLine;
        for (let O = 0; O < _; O++) {
            let w = q[1 + O],
                $ = A ? A[O] : 0,
                j = O > Y ? K[O - z] : 0,
                H = Math.floor((j + $) / 2);
            K[O] = w + H
        }
    };
    Qx6.prototype._unFilterType4 = function(q, K, _) {
        let z = this._xComparison,
            Y = z - 1,
            A = this._lastLine;
        for (let O = 0; O < _; O++) {
            let w = q[1 + O],
                $ = A ? A[O] : 0,
                j = O > Y ? K[O - z] : 0,
                H = O > Y && A ? A[O - z] : 0,
                J = smY(j, $, H);
            K[O] = w + J
        }
    };
    Qx6.prototype._reverseFilterLine = function(q) {
        let K = q[0],
            _, z = this._images[this._imageIndex],
            Y = z.byteWidth;
        if (K === 0) _ = q.slice(1, Y + 1);
        else switch (_ = Buffer.alloc(Y), K) {
            case 1:
                this._unFilterType1(q, _, Y);
                break;
            case 2:
                this._unFilterType2(q, _, Y);
                break;
            case 3:
                this._unFilterType3(q, _, Y);
                break;
            case 4:
                this._unFilterType4(q, _, Y);
                break;
            default:
                throw Error("Unrecognised filter type - " + K)
        }
        if (this.write(_), z.lineIndex++, z.lineIndex >= z.height) this._lastLine = null, this._imageIndex++, z = this._images[this._imageIndex];
        else this._lastLine = _;
        if (z) this.read(z.byteWidth + 1, this._reverseFilterLine.bind(this));
        else this._lastLine = null, this.complete()
    }
})
// @from(Ln 461260, Col 4)
CgK = p((Nqj, SgK) => {
    var tmY = d6("util"),
        RgK = nw7(),
        emY = ow7(),
        qBY = SgK.exports = function(q) {
            RgK.call(this);
            let K = [],
                _ = this;
            this._filter = new emY(q, {
                read: this.read.bind(this),
                write: function(z) {
                    K.push(z)
                },
                complete: function() {
                    _.emit("complete", Buffer.concat(K))
                }
            }), this._filter.start()
        };
    tmY.inherits(qBY, RgK)
})
// @from(Ln 461280, Col 4)
dx6 = p((Eqj, bgK) => {
    bgK.exports = {
        PNG_SIGNATURE: [137, 80, 78, 71, 13, 10, 26, 10],
        TYPE_IHDR: 1229472850,
        TYPE_IEND: 1229278788,
        TYPE_IDAT: 1229209940,
        TYPE_PLTE: 1347179589,
        TYPE_tRNS: 1951551059,
        TYPE_gAMA: 1732332865,
        COLORTYPE_GRAYSCALE: 0,
        COLORTYPE_PALETTE: 1,
        COLORTYPE_COLOR: 2,
        COLORTYPE_ALPHA: 4,
        COLORTYPE_PALETTE_COLOR: 3,
        COLORTYPE_COLOR_ALPHA: 6,
        COLORTYPE_TO_BPP_MAP: {
            0: 1,
            2: 3,
            3: 1,
            4: 2,
            6: 4
        },
        GAMMA_DIVISION: 1e5
    }
})
// @from(Ln 461305, Col 4)
tw7 = p((yqj, IgK) => {
    var aw7 = [];
    (function() {
        for (let q = 0; q < 256; q++) {
            let K = q;
            for (let _ = 0; _ < 8; _++)
                if (K & 1) K = 3988292384 ^ K >>> 1;
                else K = K >>> 1;
            aw7[q] = K
        }
    })();
    var sw7 = IgK.exports = function() {
        this._crc = -1
    };
    sw7.prototype.write = function(q) {
        for (let K = 0; K < q.length; K++) this._crc = aw7[(this._crc ^ q[K]) & 255] ^ this._crc >>> 8;
        return !0
    };
    sw7.prototype.crc32 = function() {
        return this._crc ^ -1
    };
    sw7.crc32 = function(q) {
        let K = -1;
        for (let _ = 0; _ < q.length; _++) K = aw7[(K ^ q[_]) & 255] ^ K >>> 8;
        return K ^ -1
    }
})
// @from(Ln 461332, Col 4)
ew7 = p((Lqj, xgK) => {
    var v0 = dx6(),
        KBY = tw7(),
        JZ = xgK.exports = function(q, K) {
            this._options = q, q.checkCRC = q.checkCRC !== !1, this._hasIHDR = !1, this._hasIEND = !1, this._emittedHeadersFinished = !1, this._palette = [], this._colorType = 0, this._chunks = {}, this._chunks[v0.TYPE_IHDR] = this._handleIHDR.bind(this), this._chunks[v0.TYPE_IEND] = this._handleIEND.bind(this), this._chunks[v0.TYPE_IDAT] = this._handleIDAT.bind(this), this._chunks[v0.TYPE_PLTE] = this._handlePLTE.bind(this), this._chunks[v0.TYPE_tRNS] = this._handleTRNS.bind(this), this._chunks[v0.TYPE_gAMA] = this._handleGAMA.bind(this), this.read = K.read, this.error = K.error, this.metadata = K.metadata, this.gamma = K.gamma, this.transColor = K.transColor, this.palette = K.palette, this.parsed = K.parsed, this.inflateData = K.inflateData, this.finished = K.finished, this.simpleTransparency = K.simpleTransparency, this.headersFinished = K.headersFinished || function() {}
        };
    JZ.prototype.start = function() {
        this.read(v0.PNG_SIGNATURE.length, this._parseSignature.bind(this))
    };
    JZ.prototype._parseSignature = function(q) {
        let K = v0.PNG_SIGNATURE;
        for (let _ = 0; _ < K.length; _++)
            if (q[_] !== K[_]) {
                this.error(Error("Invalid file signature"));
                return
            } this.read(8, this._parseChunkBegin.bind(this))
    };
    JZ.prototype._parseChunkBegin = function(q) {
        let K = q.readUInt32BE(0),
            _ = q.readUInt32BE(4),
            z = "";
        for (let A = 4; A < 8; A++) z += String.fromCharCode(q[A]);
        let Y = Boolean(q[4] & 32);
        if (!this._hasIHDR && _ !== v0.TYPE_IHDR) {
            this.error(Error("Expected IHDR on beggining"));
            return
        }
        if (this._crc = new KBY, this._crc.write(Buffer.from(z)), this._chunks[_]) return this._chunks[_](K);
        if (!Y) {
            this.error(Error("Unsupported critical chunk type " + z));
            return
        }
        this.read(K + 4, this._skipChunk.bind(this))
    };
    JZ.prototype._skipChunk = function() {
        this.read(8, this._parseChunkBegin.bind(this))
    };
    JZ.prototype._handleChunkEnd = function() {
        this.read(4, this._parseChunkEnd.bind(this))
    };
    JZ.prototype._parseChunkEnd = function(q) {
        let K = q.readInt32BE(0),
            _ = this._crc.crc32();
        if (this._options.checkCRC && _ !== K) {
            this.error(Error("Crc error - " + K + " - " + _));
            return
        }
        if (!this._hasIEND) this.read(8, this._parseChunkBegin.bind(this))
    };
    JZ.prototype._handleIHDR = function(q) {
        this.read(q, this._parseIHDR.bind(this))
    };
    JZ.prototype._parseIHDR = function(q) {
        this._crc.write(q);
        let K = q.readUInt32BE(0),
            _ = q.readUInt32BE(4),
            z = q[8],
            Y = q[9],
            A = q[10],
            O = q[11],
            w = q[12];
        if (z !== 8 && z !== 4 && z !== 2 && z !== 1 && z !== 16) {
            this.error(Error("Unsupported bit depth " + z));
            return
        }
        if (!(Y in v0.COLORTYPE_TO_BPP_MAP)) {
            this.error(Error("Unsupported color type"));
            return
        }
        if (A !== 0) {
            this.error(Error("Unsupported compression method"));
            return
        }
        if (O !== 0) {
            this.error(Error("Unsupported filter method"));
            return
        }
        if (w !== 0 && w !== 1) {
            this.error(Error("Unsupported interlace method"));
            return
        }
        this._colorType = Y;
        let $ = v0.COLORTYPE_TO_BPP_MAP[this._colorType];
        this._hasIHDR = !0, this.metadata({
            width: K,
            height: _,
            depth: z,
            interlace: Boolean(w),
            palette: Boolean(Y & v0.COLORTYPE_PALETTE),
            color: Boolean(Y & v0.COLORTYPE_COLOR),
            alpha: Boolean(Y & v0.COLORTYPE_ALPHA),
            bpp: $,
            colorType: Y
        }), this._handleChunkEnd()
    };
    JZ.prototype._handlePLTE = function(q) {
        this.read(q, this._parsePLTE.bind(this))
    };
    JZ.prototype._parsePLTE = function(q) {
        this._crc.write(q);
        let K = Math.floor(q.length / 3);
        for (let _ = 0; _ < K; _++) this._palette.push([q[_ * 3], q[_ * 3 + 1], q[_ * 3 + 2], 255]);
        this.palette(this._palette), this._handleChunkEnd()
    };
    JZ.prototype._handleTRNS = function(q) {
        this.simpleTransparency(), this.read(q, this._parseTRNS.bind(this))
    };
    JZ.prototype._parseTRNS = function(q) {
        if (this._crc.write(q), this._colorType === v0.COLORTYPE_PALETTE_COLOR) {
            if (this._palette.length === 0) {
                this.error(Error("Transparency chunk must be after palette"));
                return
            }
            if (q.length > this._palette.length) {
                this.error(Error("More transparent colors than palette size"));
                return
            }
            for (let K = 0; K < q.length; K++) this._palette[K][3] = q[K];
            this.palette(this._palette)
        }
        if (this._colorType === v0.COLORTYPE_GRAYSCALE) this.transColor([q.readUInt16BE(0)]);
        if (this._colorType === v0.COLORTYPE_COLOR) this.transColor([q.readUInt16BE(0), q.readUInt16BE(2), q.readUInt16BE(4)]);
        this._handleChunkEnd()
    };
    JZ.prototype._handleGAMA = function(q) {
        this.read(q, this._parseGAMA.bind(this))
    };
    JZ.prototype._parseGAMA = function(q) {
        this._crc.write(q), this.gamma(q.readUInt32BE(0) / v0.GAMMA_DIVISION), this._handleChunkEnd()
    };
    JZ.prototype._handleIDAT = function(q) {
        if (!this._emittedHeadersFinished) this._emittedHeadersFinished = !0, this.headersFinished();
        this.read(-q, this._parseIDAT.bind(this, q))
    };
    JZ.prototype._parseIDAT = function(q, K) {
        if (this._crc.write(K), this._colorType === v0.COLORTYPE_PALETTE_COLOR && this._palette.length === 0) throw Error("Expected palette not found");
        this.inflateData(K);
        let _ = q - K.length;
        if (_ > 0) this._handleIDAT(_);
        else this._handleChunkEnd()
    };
    JZ.prototype._handleIEND = function(q) {
        this.read(q, this._parseIEND.bind(this))
    };
    JZ.prototype._parseIEND = function(q) {
        if (this._crc.write(q), this._hasIEND = !0, this._handleChunkEnd(), this.finished) this.finished()
    }
})
// @from(Ln 461480, Col 4)
q27 = p((wBY) => {
    var ugK = iw7(),
        _BY = [function() {}, function(q, K, _, z) {
            if (z === K.length) throw Error("Ran out of data");
            let Y = K[z];
            q[_] = Y, q[_ + 1] = Y, q[_ + 2] = Y, q[_ + 3] = 255
        }, function(q, K, _, z) {
            if (z + 1 >= K.length) throw Error("Ran out of data");
            let Y = K[z];
            q[_] = Y, q[_ + 1] = Y, q[_ + 2] = Y, q[_ + 3] = K[z + 1]
        }, function(q, K, _, z) {
            if (z + 2 >= K.length) throw Error("Ran out of data");
            q[_] = K[z], q[_ + 1] = K[z + 1], q[_ + 2] = K[z + 2], q[_ + 3] = 255
        }, function(q, K, _, z) {
            if (z + 3 >= K.length) throw Error("Ran out of data");
            q[_] = K[z], q[_ + 1] = K[z + 1], q[_ + 2] = K[z + 2], q[_ + 3] = K[z + 3]
        }],
        zBY = [function() {}, function(q, K, _, z) {
            let Y = K[0];
            q[_] = Y, q[_ + 1] = Y, q[_ + 2] = Y, q[_ + 3] = z
        }, function(q, K, _) {
            let z = K[0];
            q[_] = z, q[_ + 1] = z, q[_ + 2] = z, q[_ + 3] = K[1]
        }, function(q, K, _, z) {
            q[_] = K[0], q[_ + 1] = K[1], q[_ + 2] = K[2], q[_ + 3] = z
        }, function(q, K, _) {
            q[_] = K[0], q[_ + 1] = K[1], q[_ + 2] = K[2], q[_ + 3] = K[3]
        }];

    function YBY(q, K) {
        let _ = [],
            z = 0;

        function Y() {
            if (z === q.length) throw Error("Ran out of data");
            let A = q[z];
            z++;
            let O, w, $, j, H, J, X, M;
            switch (K) {
                default:
                    throw Error("unrecognised depth");
                case 16:
                    X = q[z], z++, _.push((A << 8) + X);
                    break;
                case 4:
                    X = A & 15, M = A >> 4, _.push(M, X);
                    break;
                case 2:
                    H = A & 3, J = A >> 2 & 3, X = A >> 4 & 3, M = A >> 6 & 3, _.push(M, X, J, H);
                    break;
                case 1:
                    O = A & 1, w = A >> 1 & 1, $ = A >> 2 & 1, j = A >> 3 & 1, H = A >> 4 & 1, J = A >> 5 & 1, X = A >> 6 & 1, M = A >> 7 & 1, _.push(M, X, J, H, j, $, w, O);
                    break
            }
        }
        return {
            get: function(A) {
                while (_.length < A) Y();
                let O = _.slice(0, A);
                return _ = _.slice(A), O
            },
            resetAfterLine: function() {
                _.length = 0
            },
            end: function() {
                if (z !== q.length) throw Error("extra data found")
            }
        }
    }

    function ABY(q, K, _, z, Y, A) {
        let {
            width: O,
            height: w,
            index: $
        } = q;
        for (let j = 0; j < w; j++)
            for (let H = 0; H < O; H++) {
                let J = _(H, j, $);
                _BY[z](K, Y, J, A), A += z
            }
        return A
    }

    function OBY(q, K, _, z, Y, A) {
        let {
            width: O,
            height: w,
            index: $
        } = q;
        for (let j = 0; j < w; j++) {
            for (let H = 0; H < O; H++) {
                let J = Y.get(z),
                    X = _(H, j, $);
                zBY[z](K, J, X, A)
            }
            Y.resetAfterLine()
        }
    }
    wBY.dataToBitMap = function(q, K) {
        let {
            width: _,
            height: z,
            depth: Y,
            bpp: A,
            interlace: O
        } = K, w;
        if (Y !== 8) w = YBY(q, Y);
        let $;
        if (Y <= 8) $ = Buffer.alloc(_ * z * 4);
        else $ = new Uint16Array(_ * z * 4);
        let j = Math.pow(2, Y) - 1,
            H = 0,
            J, X;
        if (O) J = ugK.getImagePasses(_, z), X = ugK.getInterlaceIterator(_, z);
        else {
            let M = 0;
            X = function() {
                let P = M;
                return M += 4, P
            }, J = [{
                width: _,
                height: z
            }]
        }
        for (let M = 0; M < J.length; M++)
            if (Y === 8) H = ABY(J[M], $, X, A, q, H);
            else OBY(J[M], $, X, A, w, j);
        if (Y === 8) {
            if (H !== q.length) throw Error("extra data found")
        } else w.end();
        return $
    }
})
// @from(Ln 461614, Col 4)
K27 = p((Rqj, mgK) => {
    function jBY(q, K, _, z, Y) {
        let A = 0;
        for (let O = 0; O < z; O++)
            for (let w = 0; w < _; w++) {
                let $ = Y[q[A]];
                if (!$) throw Error("index " + q[A] + " not in palette");
                for (let j = 0; j < 4; j++) K[A + j] = $[j];
                A += 4
            }
    }

    function HBY(q, K, _, z, Y) {
        let A = 0;
        for (let O = 0; O < z; O++)
            for (let w = 0; w < _; w++) {
                let $ = !1;
                if (Y.length === 1) {
                    if (Y[0] === q[A]) $ = !0
                } else if (Y[0] === q[A] && Y[1] === q[A + 1] && Y[2] === q[A + 2]) $ = !0;
                if ($)
                    for (let j = 0; j < 4; j++) K[A + j] = 0;
                A += 4
            }
    }

    function JBY(q, K, _, z, Y) {
        let A = 255,
            O = Math.pow(2, Y) - 1,
            w = 0;
        for (let $ = 0; $ < z; $++)
            for (let j = 0; j < _; j++) {
                for (let H = 0; H < 4; H++) K[w + H] = Math.floor(q[w + H] * A / O + 0.5);
                w += 4
            }
    }
    mgK.exports = function(q, K) {
        let {
            depth: _,
            width: z,
            height: Y,
            colorType: A,
            transColor: O,
            palette: w
        } = K, $ = q;
        if (A === 3) jBY(q, $, z, Y, w);
        else {
            if (O) HBY(q, $, z, Y, O);
            if (_ !== 8) {
                if (_ === 16) $ = Buffer.alloc(z * Y * 4);
                JBY(q, $, z, Y, _)
            }
        }
        return $
    }
})
// @from(Ln 461670, Col 4)
FgK = p((Sqj, pgK) => {
    var XBY = d6("util"),
        _27 = d6("zlib"),
        BgK = nw7(),
        MBY = CgK(),
        PBY = ew7(),
        WBY = q27(),
        DBY = K27(),
        En = pgK.exports = function(q) {
            BgK.call(this), this._parser = new PBY(q, {
                read: this.read.bind(this),
                error: this._handleError.bind(this),
                metadata: this._handleMetaData.bind(this),
                gamma: this.emit.bind(this, "gamma"),
                palette: this._handlePalette.bind(this),
                transColor: this._handleTransColor.bind(this),
                finished: this._finished.bind(this),
                inflateData: this._inflateData.bind(this),
                simpleTransparency: this._simpleTransparency.bind(this),
                headersFinished: this._headersFinished.bind(this)
            }), this._options = q, this.writable = !0, this._parser.start()
        };
    XBY.inherits(En, BgK);
    En.prototype._handleError = function(q) {
        if (this.emit("error", q), this.writable = !1, this.destroy(), this._inflate && this._inflate.destroy) this._inflate.destroy();
        if (this._filter) this._filter.destroy(), this._filter.on("error", function() {});
        this.errord = !0
    };
    En.prototype._inflateData = function(q) {
        if (!this._inflate)
            if (this._bitmapInfo.interlace) this._inflate = _27.createInflate(), this._inflate.on("error", this.emit.bind(this, "error")), this._filter.on("complete", this._complete.bind(this)), this._inflate.pipe(this._filter);
            else {
                let _ = ((this._bitmapInfo.width * this._bitmapInfo.bpp * this._bitmapInfo.depth + 7 >> 3) + 1) * this._bitmapInfo.height,
                    z = Math.max(_, _27.Z_MIN_CHUNK);
                this._inflate = _27.createInflate({
                    chunkSize: z
                });
                let Y = _,
                    A = this.emit.bind(this, "error");
                this._inflate.on("error", function(w) {
                    if (!Y) return;
                    A(w)
                }), this._filter.on("complete", this._complete.bind(this));
                let O = this._filter.write.bind(this._filter);
                this._inflate.on("data", function(w) {
                    if (!Y) return;
                    if (w.length > Y) w = w.slice(0, Y);
                    Y -= w.length, O(w)
                }), this._inflate.on("end", this._filter.end.bind(this._filter))
            } this._inflate.write(q)
    };
    En.prototype._handleMetaData = function(q) {
        this._metaData = q, this._bitmapInfo = Object.create(q), this._filter = new MBY(this._bitmapInfo)
    };
    En.prototype._handleTransColor = function(q) {
        this._bitmapInfo.transColor = q
    };
    En.prototype._handlePalette = function(q) {
        this._bitmapInfo.palette = q
    };
    En.prototype._simpleTransparency = function() {
        this._metaData.alpha = !0
    };
    En.prototype._headersFinished = function() {
        this.emit("metadata", this._metaData)
    };
    En.prototype._finished = function() {
        if (this.errord) return;
        if (!this._inflate) this.emit("error", "No Inflate block");
        else this._inflate.end()
    };
    En.prototype._complete = function(q) {
        if (this.errord) return;
        let K;
        try {
            let _ = WBY.dataToBitMap(q, this._bitmapInfo);
            K = DBY(_, this._bitmapInfo), _ = null
        } catch (_) {
            this._handleError(_);
            return
        }
        this.emit("parsed", K)
    }
})
// @from(Ln 461754, Col 4)
UgK = p((Cqj, ggK) => {
    var Eu = dx6();
    ggK.exports = function(q, K, _, z) {
        let Y = [Eu.COLORTYPE_COLOR_ALPHA, Eu.COLORTYPE_ALPHA].indexOf(z.colorType) !== -1;
        if (z.colorType === z.inputColorType) {
            let P = function() {
                let W = new ArrayBuffer(2);
                return new DataView(W).setInt16(0, 256, !0), new Int16Array(W)[0] !== 256
            }();
            if (z.bitDepth === 8 || z.bitDepth === 16 && P) return q
        }
        let A = z.bitDepth !== 16 ? q : new Uint16Array(q.buffer),
            O = 255,
            w = Eu.COLORTYPE_TO_BPP_MAP[z.inputColorType];
        if (w === 4 && !z.inputHasAlpha) w = 3;
        let $ = Eu.COLORTYPE_TO_BPP_MAP[z.colorType];
        if (z.bitDepth === 16) O = 65535, $ *= 2;
        let j = Buffer.alloc(K * _ * $),
            H = 0,
            J = 0,
            X = z.bgColor || {};
        if (X.red === void 0) X.red = O;
        if (X.green === void 0) X.green = O;
        if (X.blue === void 0) X.blue = O;

        function M() {
            let P, W, D, Z = O;
            switch (z.inputColorType) {
                case Eu.COLORTYPE_COLOR_ALPHA:
                    Z = A[H + 3], P = A[H], W = A[H + 1], D = A[H + 2];
                    break;
                case Eu.COLORTYPE_COLOR:
                    P = A[H], W = A[H + 1], D = A[H + 2];
                    break;
                case Eu.COLORTYPE_ALPHA:
                    Z = A[H + 1], P = A[H], W = P, D = P;
                    break;
                case Eu.COLORTYPE_GRAYSCALE:
                    P = A[H], W = P, D = P;
                    break;
                default:
                    throw Error("input color type:" + z.inputColorType + " is not supported at present")
            }
            if (z.inputHasAlpha) {
                if (!Y) Z /= O, P = Math.min(Math.max(Math.round((1 - Z) * X.red + Z * P), 0), O), W = Math.min(Math.max(Math.round((1 - Z) * X.green + Z * W), 0), O), D = Math.min(Math.max(Math.round((1 - Z) * X.blue + Z * D), 0), O)
            }
            return {
                red: P,
                green: W,
                blue: D,
                alpha: Z
            }
        }
        for (let P = 0; P < _; P++)
            for (let W = 0; W < K; W++) {
                let D = M(A, H);
                switch (z.colorType) {
                    case Eu.COLORTYPE_COLOR_ALPHA:
                    case Eu.COLORTYPE_COLOR:
                        if (z.bitDepth === 8) {
                            if (j[J] = D.red, j[J + 1] = D.green, j[J + 2] = D.blue, Y) j[J + 3] = D.alpha
                        } else if (j.writeUInt16BE(D.red, J), j.writeUInt16BE(D.green, J + 2), j.writeUInt16BE(D.blue, J + 4), Y) j.writeUInt16BE(D.alpha, J + 6);
                        break;
                    case Eu.COLORTYPE_ALPHA:
                    case Eu.COLORTYPE_GRAYSCALE: {
                        let Z = (D.red + D.green + D.blue) / 3;
                        if (z.bitDepth === 8) {
                            if (j[J] = Z, Y) j[J + 1] = D.alpha
                        } else if (j.writeUInt16BE(Z, J), Y) j.writeUInt16BE(D.alpha, J + 2);
                        break
                    }
                    default:
                        throw Error("unrecognised color Type " + z.colorType)
                }
                H += w, J += $
            }
        return j
    }
})
// @from(Ln 461833, Col 4)
cgK = p((bqj, dgK) => {
    var QgK = rw7();

    function ZBY(q, K, _, z, Y) {
        for (let A = 0; A < _; A++) z[Y + A] = q[K + A]
    }

    function fBY(q, K, _) {
        let z = 0,
            Y = K + _;
        for (let A = K; A < Y; A++) z += Math.abs(q[A]);
        return z
    }

    function GBY(q, K, _, z, Y, A) {
        for (let O = 0; O < _; O++) {
            let w = O >= A ? q[K + O - A] : 0,
                $ = q[K + O] - w;
            z[Y + O] = $
        }
    }

    function vBY(q, K, _, z) {
        let Y = 0;
        for (let A = 0; A < _; A++) {
            let O = A >= z ? q[K + A - z] : 0,
                w = q[K + A] - O;
            Y += Math.abs(w)
        }
        return Y
    }

    function TBY(q, K, _, z, Y) {
        for (let A = 0; A < _; A++) {
            let O = K > 0 ? q[K + A - _] : 0,
                w = q[K + A] - O;
            z[Y + A] = w
        }
    }

    function VBY(q, K, _) {
        let z = 0,
            Y = K + _;
        for (let A = K; A < Y; A++) {
            let O = K > 0 ? q[A - _] : 0,
                w = q[A] - O;
            z += Math.abs(w)
        }
        return z
    }

    function kBY(q, K, _, z, Y, A) {
        for (let O = 0; O < _; O++) {
            let w = O >= A ? q[K + O - A] : 0,
                $ = K > 0 ? q[K + O - _] : 0,
                j = q[K + O] - (w + $ >> 1);
            z[Y + O] = j
        }
    }

    function NBY(q, K, _, z) {
        let Y = 0;
        for (let A = 0; A < _; A++) {
            let O = A >= z ? q[K + A - z] : 0,
                w = K > 0 ? q[K + A - _] : 0,
                $ = q[K + A] - (O + w >> 1);
            Y += Math.abs($)
        }
        return Y
    }

    function EBY(q, K, _, z, Y, A) {
        for (let O = 0; O < _; O++) {
            let w = O >= A ? q[K + O - A] : 0,
                $ = K > 0 ? q[K + O - _] : 0,
                j = K > 0 && O >= A ? q[K + O - (_ + A)] : 0,
                H = q[K + O] - QgK(w, $, j);
            z[Y + O] = H
        }
    }

    function yBY(q, K, _, z) {
        let Y = 0;
        for (let A = 0; A < _; A++) {
            let O = A >= z ? q[K + A - z] : 0,
                w = K > 0 ? q[K + A - _] : 0,
                $ = K > 0 && A >= z ? q[K + A - (_ + z)] : 0,
                j = q[K + A] - QgK(O, w, $);
            Y += Math.abs(j)
        }
        return Y
    }
    var LBY = {
            0: ZBY,
            1: GBY,
            2: TBY,
            3: kBY,
            4: EBY
        },
        hBY = {
            0: fBY,
            1: vBY,
            2: VBY,
            3: NBY,
            4: yBY
        };
    dgK.exports = function(q, K, _, z, Y) {
        let A;
        if (!("filterType" in z) || z.filterType === -1) A = [0, 1, 2, 3, 4];
        else if (typeof z.filterType === "number") A = [z.filterType];
        else throw Error("unrecognised filter types");
        if (z.bitDepth === 16) Y *= 2;
        let O = K * Y,
            w = 0,
            $ = 0,
            j = Buffer.alloc((O + 1) * _),
            H = A[0];
        for (let J = 0; J < _; J++) {
            if (A.length > 1) {
                let X = 1 / 0;
                for (let M = 0; M < A.length; M++) {
                    let P = hBY[A[M]](q, $, O, Y);
                    if (P < X) H = A[M], X = P
                }
            }
            j[w] = H, w++, LBY[H](q, $, O, j, w, Y), w += O, $ += O
        }
        return j
    }
})
// @from(Ln 461963, Col 4)
z27 = p((Iqj, lgK) => {
    var UT = dx6(),
        RBY = tw7(),
        SBY = UgK(),
        CBY = cgK(),
        bBY = d6("zlib"),
        n_6 = lgK.exports = function(q) {
            if (this._options = q, q.deflateChunkSize = q.deflateChunkSize || 32768, q.deflateLevel = q.deflateLevel != null ? q.deflateLevel : 9, q.deflateStrategy = q.deflateStrategy != null ? q.deflateStrategy : 3, q.inputHasAlpha = q.inputHasAlpha != null ? q.inputHasAlpha : !0, q.deflateFactory = q.deflateFactory || bBY.createDeflate, q.bitDepth = q.bitDepth || 8, q.colorType = typeof q.colorType === "number" ? q.colorType : UT.COLORTYPE_COLOR_ALPHA, q.inputColorType = typeof q.inputColorType === "number" ? q.inputColorType : UT.COLORTYPE_COLOR_ALPHA, [UT.COLORTYPE_GRAYSCALE, UT.COLORTYPE_COLOR, UT.COLORTYPE_COLOR_ALPHA, UT.COLORTYPE_ALPHA].indexOf(q.colorType) === -1) throw Error("option color type:" + q.colorType + " is not supported at present");
            if ([UT.COLORTYPE_GRAYSCALE, UT.COLORTYPE_COLOR, UT.COLORTYPE_COLOR_ALPHA, UT.COLORTYPE_ALPHA].indexOf(q.inputColorType) === -1) throw Error("option input color type:" + q.inputColorType + " is not supported at present");
            if (q.bitDepth !== 8 && q.bitDepth !== 16) throw Error("option bit depth:" + q.bitDepth + " is not supported at present")
        };
    n_6.prototype.getDeflateOptions = function() {
        return {
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        }
    };
    n_6.prototype.createDeflate = function() {
        return this._options.deflateFactory(this.getDeflateOptions())
    };
    n_6.prototype.filterData = function(q, K, _) {
        let z = SBY(q, K, _, this._options),
            Y = UT.COLORTYPE_TO_BPP_MAP[this._options.colorType];
        return CBY(z, K, _, this._options, Y)
    };
    n_6.prototype._packChunk = function(q, K) {
        let _ = K ? K.length : 0,
            z = Buffer.alloc(_ + 12);
        if (z.writeUInt32BE(_, 0), z.writeUInt32BE(q, 4), K) K.copy(z, 8);
        return z.writeInt32BE(RBY.crc32(z.slice(4, z.length - 4)), z.length - 4), z
    };
    n_6.prototype.packGAMA = function(q) {
        let K = Buffer.alloc(4);
        return K.writeUInt32BE(Math.floor(q * UT.GAMMA_DIVISION), 0), this._packChunk(UT.TYPE_gAMA, K)
    };
    n_6.prototype.packIHDR = function(q, K) {
        let _ = Buffer.alloc(13);
        return _.writeUInt32BE(q, 0), _.writeUInt32BE(K, 4), _[8] = this._options.bitDepth, _[9] = this._options.colorType, _[10] = 0, _[11] = 0, _[12] = 0, this._packChunk(UT.TYPE_IHDR, _)
    };
    n_6.prototype.packIDAT = function(q) {
        return this._packChunk(UT.TYPE_IDAT, q)
    };
    n_6.prototype.packIEND = function() {
        return this._packChunk(UT.TYPE_IEND, null)
    }
})
// @from(Ln 462010, Col 4)
ogK = p((xqj, rgK) => {
    var IBY = d6("util"),
        ngK = d6("stream"),
        xBY = dx6(),
        uBY = z27(),
        igK = rgK.exports = function(q) {
            ngK.call(this);
            let K = q || {};
            this._packer = new uBY(K), this._deflate = this._packer.createDeflate(), this.readable = !0
        };
    IBY.inherits(igK, ngK);
    igK.prototype.pack = function(q, K, _, z) {
        if (this.emit("data", Buffer.from(xBY.PNG_SIGNATURE)), this.emit("data", this._packer.packIHDR(K, _)), z) this.emit("data", this._packer.packGAMA(z));
        let Y = this._packer.filterData(q, K, _);
        this._deflate.on("error", this.emit.bind(this, "error")), this._deflate.on("data", function(A) {
            this.emit("data", this._packer.packIDAT(A))
        }.bind(this)), this._deflate.on("end", function() {
            this.emit("data", this._packer.packIEND()), this.emit("end")
        }.bind(this)), this._deflate.end(Y)
    }
})
// @from(Ln 462031, Col 4)
KUK = p((y_8, qUK) => {
    var agK = d6("assert").ok,
        cx6 = d6("zlib"),
        mBY = d6("util"),
        sgK = d6("buffer").kMaxLength;

    function nP6(q) {
        if (!(this instanceof nP6)) return new nP6(q);
        if (q && q.chunkSize < cx6.Z_MIN_CHUNK) q.chunkSize = cx6.Z_MIN_CHUNK;
        if (cx6.Inflate.call(this, q), this._offset = this._offset === void 0 ? this._outOffset : this._offset, this._buffer = this._buffer || this._outBuffer, q && q.maxLength != null) this._maxLength = q.maxLength
    }

    function BBY(q) {
        return new nP6(q)
    }

    function tgK(q, K) {
        if (K) process.nextTick(K);
        if (!q._handle) return;
        q._handle.close(), q._handle = null
    }
    nP6.prototype._processChunk = function(q, K, _) {
        if (typeof _ === "function") return cx6.Inflate._processChunk.call(this, q, K, _);
        let z = this,
            Y = q && q.length,
            A = this._chunkSize - this._offset,
            O = this._maxLength,
            w = 0,
            $ = [],
            j = 0,
            H;
        this.on("error", function(P) {
            H = P
        });

        function J(P, W) {
            if (z._hadError) return;
            let D = A - W;
            if (agK(D >= 0, "have should not go down"), D > 0) {
                let Z = z._buffer.slice(z._offset, z._offset + D);
                if (z._offset += D, Z.length > O) Z = Z.slice(0, O);
                if ($.push(Z), j += Z.length, O -= Z.length, O === 0) return !1
            }
            if (W === 0 || z._offset >= z._chunkSize) A = z._chunkSize, z._offset = 0, z._buffer = Buffer.allocUnsafe(z._chunkSize);
            if (W === 0) return w += Y - P, Y = P, !0;
            return !1
        }
        agK(this._handle, "zlib binding closed");
        let X;
        do X = this._handle.writeSync(K, q, w, Y, this._buffer, this._offset, A), X = X || this._writeState; while (!this._hadError && J(X[0], X[1]));
        if (this._hadError) throw H;
        if (j >= sgK) throw tgK(this), RangeError("Cannot create final Buffer. It would be larger than 0x" + sgK.toString(16) + " bytes");
        let M = Buffer.concat($, j);
        return tgK(this), M
    };
    mBY.inherits(nP6, cx6.Inflate);

    function pBY(q, K) {
        if (typeof K === "string") K = Buffer.from(K);
        if (!(K instanceof Buffer)) throw TypeError("Not a string or buffer");
        let _ = q._finishFlushFlag;
        if (_ == null) _ = cx6.Z_FINISH;
        return q._processChunk(K, _)
    }

    function egK(q, K) {
        return pBY(new nP6(K), q)
    }
    qUK.exports = y_8 = egK;
    y_8.Inflate = nP6;
    y_8.createInflate = BBY;
    y_8.inflateSync = egK
})
// @from(Ln 462104, Col 4)
Y27 = p((uqj, zUK) => {
    var _UK = zUK.exports = function(q) {
        this._buffer = q, this._reads = []
    };
    _UK.prototype.read = function(q, K) {
        this._reads.push({
            length: Math.abs(q),
            allowLess: q < 0,
            func: K
        })
    };
    _UK.prototype.process = function() {
        while (this._reads.length > 0 && this._buffer.length) {
            let q = this._reads[0];
            if (this._buffer.length && (this._buffer.length >= q.length || q.allowLess)) {
                this._reads.shift();
                let K = this._buffer;
                this._buffer = K.slice(q.length), q.func.call(this, K.slice(0, q.length))
            } else break
        }
        if (this._reads.length > 0) return Error("There are some read requests waitng on finished stream");
        if (this._buffer.length > 0) return Error("unrecognised content at end of stream")
    }
})
// @from(Ln 462128, Col 4)
YUK = p((UBY) => {
    var FBY = Y27(),
        gBY = ow7();
    UBY.process = function(q, K) {
        let _ = [],
            z = new FBY(q);
        return new gBY(K, {
            read: z.read.bind(z),
            write: function(A) {
                _.push(A)
            },
            complete: function() {}
        }).start(), z.process(), Buffer.concat(_)
    }
})
// @from(Ln 462143, Col 4)
$UK = p((Bqj, wUK) => {
    var AUK = !0,
        OUK = d6("zlib"),
        dBY = KUK();
    if (!OUK.deflateSync) AUK = !1;
    var cBY = Y27(),
        lBY = YUK(),
        nBY = ew7(),
        iBY = q27(),
        rBY = K27();
    wUK.exports = function(q, K) {
        if (!AUK) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let _;

        function z(v) {
            _ = v
        }
        let Y;

        function A(v) {
            Y = v
        }

        function O(v) {
            Y.transColor = v
        }

        function w(v) {
            Y.palette = v
        }

        function $() {
            Y.alpha = !0
        }
        let j;

        function H(v) {
            j = v
        }
        let J = [];

        function X(v) {
            J.push(v)
        }
        let M = new cBY(q);
        if (new nBY(K, {
                read: M.read.bind(M),
                error: z,
                metadata: A,
                gamma: H,
                palette: w,
                transColor: O,
                inflateData: X,
                simpleTransparency: $
            }).start(), M.process(), _) throw _;
        let W = Buffer.concat(J);
        J.length = 0;
        let D;
        if (Y.interlace) D = OUK.inflateSync(W);
        else {
            let V = ((Y.width * Y.bpp * Y.depth + 7 >> 3) + 1) * Y.height;
            D = dBY(W, {
                chunkSize: V,
                maxLength: V
            })
        }
        if (W = null, !D || !D.length) throw Error("bad png - invalid inflate data response");
        let Z = lBY.process(D, Y);
        W = null;
        let G = iBY.dataToBitMap(Z, Y);
        Z = null;
        let f = rBY(G, Y);
        return Y.data = f, Y.gamma = j || 0, Y
    }
})
// @from(Ln 462218, Col 4)
XUK = p((pqj, JUK) => {
    var jUK = !0,
        HUK = d6("zlib");
    if (!HUK.deflateSync) jUK = !1;
    var oBY = dx6(),
        aBY = z27();
    JUK.exports = function(q, K) {
        if (!jUK) throw Error("To use the sync capability of this library in old node versions, please pin pngjs to v2.3.0");
        let z = new aBY(K || {}),
            Y = [];
        if (Y.push(Buffer.from(oBY.PNG_SIGNATURE)), Y.push(z.packIHDR(q.width, q.height)), q.gamma) Y.push(z.packGAMA(q.gamma));
        let A = z.filterData(q.data, q.width, q.height),
            O = HUK.deflateSync(A, z.getDeflateOptions());
        if (A = null, !O || !O.length) throw Error("bad png - invalid compressed data response");
        return Y.push(z.packIDAT(O)), Y.push(z.packIEND()), Buffer.concat(Y)
    }
})
// @from(Ln 462235, Col 4)
MUK = p((eBY) => {
    var sBY = $UK(),
        tBY = XUK();
    eBY.read = function(q, K) {
        return sBY(q, K || {})
    };
    eBY.write = function(q, K) {
        return tBY(q, K)
    }
})
// @from(Ln 462245, Col 4)
WUK = p((OpY) => {
    var _pY = d6("util"),
        PUK = d6("stream"),
        zpY = FgK(),
        YpY = ogK(),
        ApY = MUK(),
        wN = OpY.PNG = function(q) {
            if (PUK.call(this), q = q || {}, this.width = q.width | 0, this.height = q.height | 0, this.data = this.width > 0 && this.height > 0 ? Buffer.alloc(4 * this.width * this.height) : null, q.fill && this.data) this.data.fill(0);
            this.gamma = 0, this.readable = this.writable = !0, this._parser = new zpY(q), this._parser.on("error", this.emit.bind(this, "error")), this._parser.on("close", this._handleClose.bind(this)), this._parser.on("metadata", this._metadata.bind(this)), this._parser.on("gamma", this._gamma.bind(this)), this._parser.on("parsed", function(K) {
                this.data = K, this.emit("parsed", K)
            }.bind(this)), this._packer = new YpY(q), this._packer.on("data", this.emit.bind(this, "data")), this._packer.on("end", this.emit.bind(this, "end")), this._parser.on("close", this._handleClose.bind(this)), this._packer.on("error", this.emit.bind(this, "error"))
        };
    _pY.inherits(wN, PUK);
    wN.sync = ApY;
    wN.prototype.pack = function() {
        if (!this.data || !this.data.length) return this.emit("error", "No data provided"), this;
        return process.nextTick(function() {
            this._packer.pack(this.data, this.width, this.height, this.gamma)
        }.bind(this)), this
    };
    wN.prototype.parse = function(q, K) {
        if (K) {
            let _, z;
            _ = function(Y) {
                this.removeListener("error", z), this.data = Y, K(null, this)
            }.bind(this), z = function(Y) {
                this.removeListener("parsed", _), K(Y, null)
            }.bind(this), this.once("parsed", _), this.once("error", z)
        }
        return this.end(q), this
    };
    wN.prototype.write = function(q) {
        return this._parser.write(q), !0
    };
    wN.prototype.end = function(q) {
        this._parser.end(q)
    };
    wN.prototype._metadata = function(q) {
        this.width = q.width, this.height = q.height, this.emit("metadata", q)
    };
    wN.prototype._gamma = function(q) {
        this.gamma = q
    };
    wN.prototype._handleClose = function() {
        if (!this._parser.writable && !this._packer.readable) this.emit("close")
    };
    wN.bitblt = function(q, K, _, z, Y, A, O, w) {
        if (_ |= 0, z |= 0, Y |= 0, A |= 0, O |= 0, w |= 0, _ > q.width || z > q.height || _ + Y > q.width || z + A > q.height) throw Error("bitblt reading outside image");
        if (O > K.width || w > K.height || O + Y > K.width || w + A > K.height) throw Error("bitblt writing outside image");
        for (let $ = 0; $ < A; $++) q.data.copy(K.data, (w + $) * K.width + O << 2, (z + $) * q.width + _ << 2, (z + $) * q.width + _ + Y << 2)
    };
    wN.prototype.bitblt = function(q, K, _, z, Y, A, O) {
        return wN.bitblt(this, q, K, _, z, Y, A, O), this
    };
    wN.adjustGamma = function(q) {
        if (q.gamma) {
            for (let K = 0; K < q.height; K++)
                for (let _ = 0; _ < q.width; _++) {
                    let z = q.width * K + _ << 2;
                    for (let Y = 0; Y < 3; Y++) {
                        let A = q.data[z + Y] / 255;
                        A = Math.pow(A, 0.45454545454545453 / q.gamma), q.data[z + Y] = Math.round(A * 255)
                    }
                }
            q.gamma = 0
        }
    };
    wN.prototype.adjustGamma = function() {
        wN.adjustGamma(this)
    }
})
// @from(Ln 462316, Col 4)
L_8 = p((wpY) => {
    function DUK(q) {
        if (typeof q === "number") q = q.toString();
        if (typeof q !== "string") throw Error("Color should be defined as hex string");
        let K = q.slice().replace("#", "").split("");
        if (K.length < 3 || K.length === 5 || K.length > 8) throw Error("Invalid hex color: " + q);
        if (K.length === 3 || K.length === 4) K = Array.prototype.concat.apply([], K.map(function(z) {
            return [z, z]
        }));
        if (K.length === 6) K.push("F", "F");
        let _ = parseInt(K.join(""), 16);
        return {
            r: _ >> 24 & 255,
            g: _ >> 16 & 255,
            b: _ >> 8 & 255,
            a: _ & 255,
            hex: "#" + K.slice(0, 6).join("")
        }
    }
    wpY.getOptions = function(K) {
        if (!K) K = {};
        if (!K.color) K.color = {};
        let _ = typeof K.margin > "u" || K.margin === null || K.margin < 0 ? 4 : K.margin,
            z = K.width && K.width >= 21 ? K.width : void 0,
            Y = K.scale || 4;
        return {
            width: z,
            scale: z ? 4 : Y,
            margin: _,
            color: {
                dark: DUK(K.color.dark || "#000000ff"),
                light: DUK(K.color.light || "#ffffffff")
            },
            type: K.type,
            rendererOpts: K.rendererOpts || {}
        }
    };
    wpY.getScale = function(K, _) {
        return _.width && _.width >= K + _.margin * 2 ? _.width / (K + _.margin * 2) : _.scale
    };
    wpY.getImageWidth = function(K, _) {
        let z = wpY.getScale(K, _);
        return Math.floor((K + _.margin * 2) * z)
    };
    wpY.qrToImageData = function(K, _, z) {
        let Y = _.modules.size,
            A = _.modules.data,
            O = wpY.getScale(Y, z),
            w = Math.floor((Y + z.margin * 2) * O),
            $ = z.margin * O,
            j = [z.color.light, z.color.dark];
        for (let H = 0; H < w; H++)
            for (let J = 0; J < w; J++) {
                let X = (H * w + J) * 4,
                    M = z.color.light;
                if (H >= $ && J >= $ && H < w - $ && J < w - $) {
                    let P = Math.floor((H - $) / O),
                        W = Math.floor((J - $) / O);
                    M = j[A[P * Y + W] ? 1 : 0]
                }
                K[X++] = M.r, K[X++] = M.g, K[X++] = M.b, K[X] = M.a
            }
    }
})