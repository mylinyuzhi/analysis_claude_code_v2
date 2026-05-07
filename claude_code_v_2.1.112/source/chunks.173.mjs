
// @from(Ln 443789, Col 0)
function OCY(q) {
    let K = s(14),
        {
            file: _,
            isSelected: z,
            maxPathWidth: Y
        } = q,
        A;
    if (K[0] !== _.path || K[1] !== Y) A = hY6(_.path, Y), K[0] = _.path, K[1] = Y, K[2] = A;
    else A = K[2];
    let O = A,
        $ = `${z?e6.pointer+" ":"  "}${O}`,
        j = z ? "background" : void 0,
        H;
    if (K[3] !== z || K[4] !== $ || K[5] !== j) H = fG.default.createElement(T, {
        bold: z,
        color: j,
        inverse: z
    }, $), K[3] = z, K[4] = $, K[5] = j, K[6] = H;
    else H = K[6];
    let J;
    if (K[7] === Symbol.for("react.memo_cache_sentinel")) J = fG.default.createElement(u, {
        flexGrow: 1
    }), K[7] = J;
    else J = K[7];
    let X;
    if (K[8] !== _ || K[9] !== z) X = fG.default.createElement(wCY, {
        file: _,
        isSelected: z
    }), K[8] = _, K[9] = z, K[10] = X;
    else X = K[10];
    let M;
    if (K[11] !== H || K[12] !== X) M = fG.default.createElement(u, {
        flexDirection: "row"
    }, H, J, X), K[11] = H, K[12] = X, K[13] = M;
    else M = K[13];
    return M
}
// @from(Ln 443828, Col 0)
function wCY(q) {
    let K = s(20),
        {
            file: _,
            isSelected: z
        } = q;
    if (_.isUntracked) {
        let j = !z,
            H;
        if (K[0] !== j) H = fG.default.createElement(T, {
            dimColor: j,
            italic: !0
        }, "untracked"), K[0] = j, K[1] = H;
        else H = K[1];
        return H
    }
    if (_.isBinary) {
        let j = !z,
            H;
        if (K[2] !== j) H = fG.default.createElement(T, {
            dimColor: j,
            italic: !0
        }, "Binary file"), K[2] = j, K[3] = H;
        else H = K[3];
        return H
    }
    if (_.isLargeFile) {
        let j = !z,
            H;
        if (K[4] !== j) H = fG.default.createElement(T, {
            dimColor: j,
            italic: !0
        }, "Large file modified"), K[4] = j, K[5] = H;
        else H = K[5];
        return H
    }
    let Y;
    if (K[6] !== _.linesAdded || K[7] !== z) Y = _.linesAdded > 0 && fG.default.createElement(T, {
        color: "diffAddedWord",
        bold: z
    }, "+", _.linesAdded), K[6] = _.linesAdded, K[7] = z, K[8] = Y;
    else Y = K[8];
    let A = _.linesAdded > 0 && _.linesRemoved > 0 && " ",
        O;
    if (K[9] !== _.linesRemoved || K[10] !== z) O = _.linesRemoved > 0 && fG.default.createElement(T, {
        color: "diffRemovedWord",
        bold: z
    }, "-", _.linesRemoved), K[9] = _.linesRemoved, K[10] = z, K[11] = O;
    else O = K[11];
    let w;
    if (K[12] !== _.isTruncated || K[13] !== z) w = _.isTruncated && fG.default.createElement(T, {
        dimColor: !z
    }, " (truncated)"), K[12] = _.isTruncated, K[13] = z, K[14] = w;
    else w = K[14];
    let $;
    if (K[15] !== Y || K[16] !== A || K[17] !== O || K[18] !== w) $ = fG.default.createElement(T, null, Y, A, O, w), K[15] = Y, K[16] = A, K[17] = O, K[18] = w, K[19] = $;
    else $ = K[19];
    return $
}
// @from(Ln 443887, Col 4)
fG
// @from(Ln 443887, Col 8)
s98 = 5
// @from(Ln 443888, Col 4)
euK = L(() => {
    o6();
    Qq();
    I4();
    g6();
    c7();
    fG = K6(P6(), 1)
})
// @from(Ln 443896, Col 4)
qmK = {}
// @from(Ln 443901, Col 0)
function $CY(q) {
    let K = Array.from(q.files.values()).map((z) => ({
            path: z.filePath,
            linesAdded: z.linesAdded,
            linesRemoved: z.linesRemoved,
            isBinary: !1,
            isLargeFile: !1,
            isTruncated: !1,
            isNewFile: z.isNewFile
        })).sort((z, Y) => z.path.localeCompare(Y.path)),
        _ = new Map;
    for (let z of q.files.values()) _.set(z.filePath, z.hunks);
    return {
        stats: {
            filesCount: q.stats.filesChanged,
            linesAdded: q.stats.linesAdded,
            linesRemoved: q.stats.linesRemoved
        },
        files: K,
        hunks: _,
        loading: !1
    }
}
// @from(Ln 443925, Col 0)
function jCY(q) {
    let K = s(73),
        {
            messages: _,
            onDone: z
        } = q,
        Y = cuK(),
        A = iuK(_),
        [O, w] = pY.useState("list"),
        [$, j] = pY.useState(0),
        [H, J] = pY.useState(0),
        X;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) X = {
        type: "current"
    }, K[0] = X;
    else X = K[0];
    let M;
    if (K[1] !== A) M = [X, ...A.map(XCY)], K[1] = A, K[2] = M;
    else M = K[2];
    let P = M,
        W = P[H],
        D = W?.type === "turn" ? W.turn : null,
        Z;
    if (K[3] !== D || K[4] !== Y) Z = D ? $CY(D) : Y, K[3] = D, K[4] = Y, K[5] = Z;
    else Z = K[5];
    let G = Z,
        f = G.files[$],
        v;
    if (K[6] !== G.hunks || K[7] !== f) v = f ? G.hunks.get(f.path) || [] : [], K[6] = G.hunks, K[7] = f, K[8] = v;
    else v = K[8];
    let V = v,
        k, N;
    if (K[9] !== H || K[10] !== P.length) k = () => {
        if (H >= P.length) J(Math.max(0, P.length - 1))
    }, N = [P.length, H], K[9] = H, K[10] = P.length, K[11] = k, K[12] = N;
    else k = K[11], N = K[12];
    pY.useEffect(k, N);
    let R = pY.useRef(H),
        h, C;
    if (K[13] !== H) h = () => {
        if (R.current !== H) j(0), R.current = H
    }, C = [H], K[13] = H, K[14] = h, K[15] = C;
    else h = K[14], C = K[15];
    pY.useEffect(h, C), A2("diff-dialog");
    let x, B;
    if (K[16] !== P.length || K[17] !== O) B = () => {
        if (O === "detail") w("list");
        else if (O === "list" && P.length > 1) J(JCY)
    }, x = () => {
        if (O === "list" && P.length > 1) J((M6) => Math.min(P.length - 1, M6 + 1))
    }, K[16] = P.length, K[17] = O, K[18] = x, K[19] = B;
    else x = K[18], B = K[19];
    let m;
    if (K[20] !== O) m = () => {
        if (O === "detail") w("list")
    }, K[20] = O, K[21] = m;
    else m = K[21];
    let S;
    if (K[22] !== f || K[23] !== O) S = () => {
        if (O === "list" && f) w("detail")
    }, K[22] = f, K[23] = O, K[24] = S;
    else S = K[24];
    let F;
    if (K[25] !== O) F = () => {
        if (O === "list") j(HCY)
    }, K[25] = O, K[26] = F;
    else F = K[26];
    let U;
    if (K[27] !== G.files.length || K[28] !== O) U = () => {
        if (O === "list") j((M6) => Math.min(G.files.length - 1, M6 + 1))
    }, K[27] = G.files.length, K[28] = O, K[29] = U;
    else U = K[29];
    let g;
    if (K[30] !== x || K[31] !== m || K[32] !== S || K[33] !== F || K[34] !== U || K[35] !== B) g = {
        "diff:previousSource": B,
        "diff:nextSource": x,
        "diff:back": m,
        "diff:viewDetails": S,
        "diff:previousFile": F,
        "diff:nextFile": U
    }, K[30] = x, K[31] = m, K[32] = S, K[33] = F, K[34] = U, K[35] = B, K[36] = g;
    else g = K[36];
    let c;
    if (K[37] === Symbol.for("react.memo_cache_sentinel")) c = {
        context: "DiffDialog"
    }, K[37] = c;
    else c = K[37];
    L7(g, c);
    let n;
    if (K[38] !== G.stats) n = G.stats ? pY.default.createElement(T, {
        dimColor: !0
    }, G.stats.filesCount, " ", O7(G.stats.filesCount, "file"), " ", "changed", G.stats.linesAdded > 0 && pY.default.createElement(T, {
        color: "diffAddedWord"
    }, " +", G.stats.linesAdded), G.stats.linesRemoved > 0 && pY.default.createElement(T, {
        color: "diffRemovedWord"
    }, " -", G.stats.linesRemoved)) : null, K[38] = G.stats, K[39] = n;
    else n = K[39];
    let l = n,
        z6 = D ? `Turn ${D.turnIndex}` : "Uncommitted changes",
        A6 = D ? D.userPromptPreview ? `"${D.userPromptPreview}"` : "" : "(git diff HEAD)",
        e;
    if (K[40] !== H || K[41] !== P) e = P.length > 1 ? pY.default.createElement(u, null, H > 0 && pY.default.createElement(T, {
        dimColor: !0
    }, "◀ "), P.map((M6, W6) => {
        let V6 = W6 === H,
            f6 = M6.type === "current" ? "Current" : `T${M6.turn.turnIndex}`;
        return pY.default.createElement(T, {
            key: W6,
            dimColor: !V6,
            bold: V6
        }, W6 > 0 ? " · " : "", f6)
    }), H < P.length - 1 && pY.default.createElement(T, {
        dimColor: !0
    }, " ▶")) : null, K[40] = H, K[41] = P, K[42] = e;
    else e = K[42];
    let i = e,
        O6 = V3("diff:dismiss", "DiffDialog", "esc"),
        J6;
    q: {
        if (G.loading) {
            J6 = "Loading diff…";
            break q
        }
        if (D) {
            J6 = "No file changes in this turn";
            break q
        }
        if (G.stats && G.stats.filesCount > 0 && G.files.length === 0) {
            J6 = "Too many files to display details";
            break q
        }
        J6 = "Working tree is clean"
    }
    let $6 = J6,
        H6;
    if (K[43] !== A6) H6 = A6 && pY.default.createElement(T, {
        dimColor: !0
    }, " ", A6), K[43] = A6, K[44] = H6;
    else H6 = K[44];
    let q6;
    if (K[45] !== z6 || K[46] !== H6) q6 = pY.default.createElement(T, null, z6, H6), K[45] = z6, K[46] = H6, K[47] = q6;
    else q6 = K[47];
    let o = q6,
        _6;
    if (K[48] !== z || K[49] !== O) _6 = function() {
        if (O === "detail") w("list");
        else z("Diff dialog dismissed", {
            display: "system"
        })
    }, K[48] = z, K[49] = O, K[50] = _6;
    else _6 = K[50];
    let r = _6,
        t;
    if (K[51] !== O6 || K[52] !== P.length || K[53] !== O) t = (M6) => M6.pending ? pY.default.createElement(T, null, "Press ", M6.keyName, " again to exit") : O === "list" ? pY.default.createElement(z1, null, P.length > 1 && pY.default.createElement(T, null, "←/→ source"), pY.default.createElement(T, null, "↑/↓ select"), pY.default.createElement(T, null, "Enter view"), pY.default.createElement(T, null, O6, " close")) : pY.default.createElement(z1, null, pY.default.createElement(T, null, "← back"), pY.default.createElement(T, null, O6, " close")), K[51] = O6, K[52] = P.length, K[53] = O, K[54] = t;
    else t = K[54];
    let Y6;
    if (K[55] !== G.files || K[56] !== $6 || K[57] !== f?.isBinary || K[58] !== f?.isLargeFile || K[59] !== f?.isTruncated || K[60] !== f?.isUntracked || K[61] !== f?.path || K[62] !== V || K[63] !== $ || K[64] !== O) Y6 = G.files.length === 0 ? pY.default.createElement(u, {
        marginTop: 1
    }, pY.default.createElement(T, {
        dimColor: !0
    }, $6)) : O === "list" ? pY.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, pY.default.createElement(tuK, {
        files: G.files,
        selectedIndex: $
    })) : pY.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, pY.default.createElement(auK, {
        filePath: f?.path || "",
        hunks: V,
        isLargeFile: f?.isLargeFile,
        isBinary: f?.isBinary,
        isTruncated: f?.isTruncated,
        isUntracked: f?.isUntracked
    })), K[55] = G.files, K[56] = $6, K[57] = f?.isBinary, K[58] = f?.isLargeFile, K[59] = f?.isTruncated, K[60] = f?.isUntracked, K[61] = f?.path, K[62] = V, K[63] = $, K[64] = O, K[65] = Y6;
    else Y6 = K[65];
    let X6;
    if (K[66] !== r || K[67] !== i || K[68] !== l || K[69] !== t || K[70] !== Y6 || K[71] !== o) X6 = pY.default.createElement(R1, {
        title: o,
        onCancel: r,
        color: "background",
        inputGuide: t
    }, i, l, Y6), K[66] = r, K[67] = i, K[68] = l, K[69] = t, K[70] = Y6, K[71] = o, K[72] = X6;
    else X6 = K[72];
    return X6
}
// @from(Ln 444114, Col 0)
function HCY(q) {
    return Math.max(0, q - 1)
}
// @from(Ln 444118, Col 0)
function JCY(q) {
    return Math.max(0, q - 1)
}
// @from(Ln 444122, Col 0)
function XCY(q) {
    return {
        type: "turn",
        turn: q
    }
}
// @from(Ln 444128, Col 4)
pY
// @from(Ln 444129, Col 4)
KmK = L(() => {
    o6();
    CP();
    luK();
    ruK();
    g6();
    C7();
    RM();
    Nq();
    S4();
    suK();
    euK();
    pY = K6(P6(), 1)
})
// @from(Ln 444143, Col 4)
_mK = {}
// @from(Ln 444147, Col 4)
LO7
// @from(Ln 444147, Col 9)
MCY = async (q, K) => {
    let {
        DiffDialog: _
    } = await Promise.resolve().then(() => (KmK(), qmK));
    return LO7.createElement(_, {
        messages: K.messages,
        onDone: q
    })
}
// @from(Ln 444156, Col 4)
zmK = L(() => {
    LO7 = K6(P6(), 1)
})
// @from(Ln 444159, Col 4)
YmK
// @from(Ln 444160, Col 4)
AmK = L(() => {
    YmK = {
        type: "local-jsx",
        name: "diff",
        description: "View uncommitted changes and per-turn diffs",
        load: () => Promise.resolve().then(() => (zmK(), _mK))
    }
})
// @from(Ln 444168, Col 4)
OmK
// @from(Ln 444169, Col 4)
wmK = L(() => {
    OmK = {
        isEnabled: () => !1,
        isHidden: !0,
        name: "stub"
    }
})
// @from(Ln 444177, Col 0)
function $mK() {
    let q = s(1);
    if (!WR()) return null;
    let K = RI.warnings;
    if (K.length === 0) return null;
    let _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let z = [...K].sort(WCY),
            Y = z[0]?.severity === "error";
        _ = vn.default.createElement(u, {
            flexDirection: "column",
            marginTop: 1
        }, vn.default.createElement(T, null, vn.default.createElement(D4, {
            status: Y ? "error" : "warning",
            withSpace: !0
        }), vn.default.createElement(T, {
            bold: !0
        }, "Keybinding configuration issues"), vn.default.createElement(T, {
            dimColor: !0
        }, " · ", aa())), vn.default.createElement(uK, null, z.map(PCY))), q[0] = _
    } else _ = q[0];
    return _
}
// @from(Ln 444201, Col 0)
function PCY(q, K) {
    return vn.default.createElement(uK.Node, {
        key: K,
        label: vn.default.createElement(T, {
            color: q.severity === "error" ? "error" : "warning"
        }, q.message)
    }, q.suggestion && vn.default.createElement(uK.Node, {
        dimColor: !0
    }, q.suggestion))
}
// @from(Ln 444212, Col 0)
function WCY(q, K) {
    return q.severity === K.severity ? 0 : q.severity === "error" ? -1 : 1
}
// @from(Ln 444215, Col 4)
vn
// @from(Ln 444216, Col 4)
jmK = L(() => {
    o6();
    g6();
    yd();
    Y2();
    vx6();
    vn = K6(P6(), 1)
})
// @from(Ln 444225, Col 0)
function DCY(q) {
    let K = s(26),
        {
            scope: _,
            parsingErrors: z,
            warnings: Y
        } = q,
        A = z.length > 0,
        O = Y.length > 0;
    if (!A && !O) return null;
    let w;
    if (K[0] !== A || K[1] !== O) w = (A || O) && pA.default.createElement(T, {
        color: A ? "error" : "warning"
    }, "[", A ? "Failed to parse" : "Contains warnings", "]", " "), K[0] = A, K[1] = O, K[2] = w;
    else w = K[2];
    let $;
    if (K[3] !== _) $ = K48(_), K[3] = _, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] !== $) j = pA.default.createElement(T, null, $), K[5] = $, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== w || K[8] !== j) H = pA.default.createElement(u, null, w, j), K[7] = w, K[8] = j, K[9] = H;
    else H = K[9];
    let J;
    if (K[10] === Symbol.for("react.memo_cache_sentinel")) J = pA.default.createElement(T, {
        dimColor: !0
    }, "Location: "), K[10] = J;
    else J = K[10];
    let X;
    if (K[11] !== _) X = rk(_), K[11] = _, K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== X) M = pA.default.createElement(u, null, J, pA.default.createElement(T, {
        dimColor: !0
    }, X)), K[13] = X, K[14] = M;
    else M = K[14];
    let P;
    if (K[15] !== z) P = z.map(fCY), K[15] = z, K[16] = P;
    else P = K[16];
    let W;
    if (K[17] !== Y) W = Y.map(ZCY), K[17] = Y, K[18] = W;
    else W = K[18];
    let D;
    if (K[19] !== P || K[20] !== W) D = pA.default.createElement(u, {
        marginLeft: 1
    }, pA.default.createElement(uK, null, P, W)), K[19] = P, K[20] = W, K[21] = D;
    else D = K[21];
    let Z;
    if (K[22] !== D || K[23] !== H || K[24] !== M) Z = pA.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, H, M, D), K[22] = D, K[23] = H, K[24] = M, K[25] = Z;
    else Z = K[25];
    return Z
}
// @from(Ln 444282, Col 0)
function ZCY(q, K) {
    let _ = q.mcpErrorMetadata?.serverName;
    return pA.default.createElement(uK.Node, {
        key: `warning-${K}`
    }, pA.default.createElement(T, null, pA.default.createElement(T, {
        color: "warning"
    }, "[Warning]"), pA.default.createElement(T, {
        dimColor: !0
    }, " ", _ && `[${_}] `, q.path && q.path !== "" ? `${q.path}: ` : "", q.message)))
}
// @from(Ln 444293, Col 0)
function fCY(q, K) {
    let _ = q.mcpErrorMetadata?.serverName;
    return pA.default.createElement(uK.Node, {
        key: `error-${K}`
    }, pA.default.createElement(T, null, pA.default.createElement(T, {
        color: "error"
    }, "[Error]"), pA.default.createElement(T, {
        dimColor: !0
    }, " ", _ && `[${_}] `, q.path && q.path !== "" ? `${q.path}: ` : "", q.message)))
}
// @from(Ln 444304, Col 0)
function Pi8() {
    let q = s(3),
        K;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        let $ = [{
                scope: "user",
                config: SJ("user")
            }, {
                scope: "project",
                config: SJ("project")
            }, {
                scope: "local",
                config: SJ("local")
            }, {
                scope: "enterprise",
                config: SJ("enterprise")
            }],
            j = T_K($.filter(NCY).map(kCY));
        K = {
            scopes: $,
            conflicts: j
        }, q[0] = K
    } else K = q[0];
    let {
        scopes: _,
        conflicts: z
    } = K, Y = _.some(VCY), A = z.length > 0 || _.some(TCY);
    if (!Y && !A) return null;
    let O;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) O = pA.default.createElement(T, {
        bold: !0
    }, "MCP Config Diagnostics"), q[1] = O;
    else O = q[1];
    let w;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) w = pA.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1,
        marginBottom: 1
    }, O, pA.default.createElement(u, {
        marginTop: 1
    }, pA.default.createElement(T, {
        dimColor: !0
    }, "For help configuring MCP servers, see:", " ", pA.default.createElement(yq, {
        url: "https://code.claude.com/docs/en/mcp"
    }, "https://code.claude.com/docs/en/mcp"))), _.map(vCY), z.length > 0 && pA.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, pA.default.createElement(T, {
        color: "warning"
    }, "[Conflicting scopes]"), pA.default.createElement(u, {
        marginLeft: 1,
        flexDirection: "column"
    }, z.map(GCY)))), q[2] = w;
    else w = q[2];
    return w
}
// @from(Ln 444361, Col 0)
function GCY(q, K) {
    return pA.default.createElement(u, {
        key: `conflict-${K}`,
        flexDirection: "column"
    }, pA.default.createElement(T, null, pA.default.createElement(T, {
        dimColor: !0
    }, "└ "), pA.default.createElement(T, {
        color: "warning"
    }, "[Warning]"), pA.default.createElement(T, {
        dimColor: !0
    }, " ", q.message)), q.suggestion && pA.default.createElement(T, {
        dimColor: !0
    }, "  ", "Suggestion: ", q.suggestion))
}
// @from(Ln 444376, Col 0)
function vCY(q) {
    let {
        scope: K,
        config: _
    } = q;
    return pA.default.createElement(DCY, {
        key: K,
        scope: K,
        parsingErrors: Mi8(_.errors, "fatal"),
        warnings: Mi8(_.errors, "warning")
    })
}
// @from(Ln 444389, Col 0)
function TCY(q) {
    let {
        config: K
    } = q;
    return Mi8(K.errors, "warning").length > 0
}
// @from(Ln 444396, Col 0)
function VCY(q) {
    let {
        config: K
    } = q;
    return Mi8(K.errors, "fatal").length > 0
}
// @from(Ln 444403, Col 0)
function kCY(q) {
    return {
        scope: q.scope,
        servers: q.config.servers
    }
}
// @from(Ln 444410, Col 0)
function NCY(q) {
    return q.scope !== "enterprise"
}
// @from(Ln 444414, Col 0)
function Mi8(q, K) {
    return q.filter((_) => _.mcpErrorMetadata?.severity === K)
}
// @from(Ln 444417, Col 4)
pA
// @from(Ln 444418, Col 4)
hO7 = L(() => {
    o6();
    rD();
    iD();
    g6();
    vx6();
    pA = K6(P6(), 1)
})
// @from(Ln 444426, Col 4)
HmK
// @from(Ln 444427, Col 4)
JmK = L(() => {
    o6();
    g6();
    N7();
    Xh6();
    HmK = K6(P6(), 1)
})
// @from(Ln 444435, Col 0)
function XmK() {
    let q = s(2);
    if (!Z7.isSupportedPlatform()) return null;
    if (!Z7.isSandboxEnabledInSettings()) return null;
    let K, _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) {
        _ = Symbol.for("react.early_return_sentinel");
        q: {
            let z = Z7.checkDependencies(),
                Y = z.errors.length > 0,
                A = z.warnings.length > 0;
            if (!Y && !A) {
                _ = null;
                break q
            }
            let O = Y ? "error" : "warning",
                w = Y ? "Missing dependencies" : "Available (with warnings)";K = Vu.default.createElement(u, {
                flexDirection: "column",
                marginTop: 1
            }, Vu.default.createElement(T, null, Vu.default.createElement(D4, {
                status: Y ? "error" : "warning",
                withSpace: !0
            }), Vu.default.createElement(T, {
                bold: !0
            }, "Sandbox")), Vu.default.createElement(uK, null, Vu.default.createElement(uK.Node, null, Vu.default.createElement(T, null, "Status: ", Vu.default.createElement(T, {
                color: O
            }, w))), z.errors.map(yCY), z.warnings.map(ECY), Y && Vu.default.createElement(uK.Node, {
                dimColor: !0
            }, "Run /sandbox for install instructions")))
        }
        q[0] = K, q[1] = _
    } else K = q[0], _ = q[1];
    if (_ !== Symbol.for("react.early_return_sentinel")) return _;
    return K
}
// @from(Ln 444471, Col 0)
function ECY(q, K) {
    return Vu.default.createElement(uK.Node, {
        key: K,
        color: "warning"
    }, q)
}
// @from(Ln 444478, Col 0)
function yCY(q, K) {
    return Vu.default.createElement(uK.Node, {
        key: K,
        color: "error"
    }, q)
}
// @from(Ln 444484, Col 4)
Vu
// @from(Ln 444485, Col 4)
MmK = L(() => {
    o6();
    g6();
    yY();
    Y2();
    vx6();
    Vu = K6(P6(), 1)
})
// @from(Ln 444494, Col 0)
function LCY(q, K, _, z) {
    return z = typeof z == "function" ? z : void 0, q == null ? q : TH8(q, K, _, z)
}
// @from(Ln 444497, Col 4)
PmK
// @from(Ln 444498, Col 4)
WmK = L(() => {
    gz1();
    PmK = LCY
})
// @from(Ln 444503, Col 0)
function DmK(q, K = {}) {
    let {
        showValues: _ = !0,
        hideFunctions: z = !1,
        themeName: Y = "dark",
        treeCharColors: A = {}
    } = K, O = [], w = new WeakSet;

    function $(J, X) {
        if (!X) return J;
        return d7(X, Y)(J)
    }

    function j(J, X, M, P = 0) {
        if (typeof J === "string") {
            O.push(X + $(J, A.value));
            return
        }
        if (typeof J !== "object" || J === null) {
            if (_) {
                let D = String(J);
                O.push(X + $(D, A.value))
            }
            return
        }
        if (w.has(J)) {
            O.push(X + $("[Circular]", A.value));
            return
        }
        w.add(J);
        let W = Object.keys(J).filter((D) => {
            let Z = J[D];
            if (z && typeof Z === "function") return !1;
            return !0
        });
        W.forEach((D, Z) => {
            let G = J[D],
                f = Z === W.length - 1,
                v = P === 0 && Z === 0 ? "" : X,
                V = f ? t98.lastBranch : t98.branch,
                k = $(V, A.treeChar),
                N = D.trim() === "" ? "" : $(D, A.key),
                R = v + k + (N ? " " + N : ""),
                h = D.trim() !== "";
            if (G && typeof G === "object" && w.has(G)) {
                let C = $("[Circular]", A.value);
                O.push(R + (h ? ": " : R ? " " : "") + C)
            } else if (G && typeof G === "object" && !Array.isArray(G)) {
                O.push(R);
                let C = f ? t98.empty : t98.line,
                    x = $(C, A.treeChar),
                    B = v + x + " ";
                j(G, B, f, P + 1)
            } else if (Array.isArray(G)) O.push(R + (h ? ": " : R ? " " : "") + "[Array(" + G.length + ")]");
            else if (_) {
                let C = typeof G === "function" ? "[Function]" : String(G),
                    x = $(C, A.value);
                R += (h ? ": " : R ? " " : "") + x, O.push(R)
            } else O.push(R)
        })
    }
    let H = Object.keys(q);
    if (H.length === 0) return $("(empty)", A.value);
    if (H.length === 1 && H[0] !== void 0 && H[0].trim() === "" && typeof q[H[0]] === "string") {
        let J = H[0],
            X = $(t98.lastBranch, A.treeChar),
            M = $(q[J], A.value);
        return X + " " + M
    }
    return j(q, "", !0), O.join(`
`)
}
// @from(Ln 444575, Col 4)
t98
// @from(Ln 444576, Col 4)
ZmK = L(() => {
    u$6();
    A3();
    t98 = {
        branch: fU.branch,
        lastBranch: fU.last,
        line: fU.pipe,
        empty: " "
    }
})
// @from(Ln 444587, Col 0)
function hCY(q) {
    let K = {};
    return q.forEach((_) => {
        if (!_.path) {
            K[""] = _.message;
            return
        }
        let z = _.path.split("."),
            Y = _.path;
        if (_.invalidValue !== null && _.invalidValue !== void 0 && z.length > 0) {
            let A = [];
            for (let O = 0; O < z.length; O++) {
                let w = z[O];
                if (!w) continue;
                let $ = parseInt(w, 10);
                if (!isNaN($) && O === z.length - 1) {
                    let j;
                    if (typeof _.invalidValue === "string") j = `"${_.invalidValue}"`;
                    else if (_.invalidValue === null) j = "null";
                    else if (_.invalidValue === void 0) j = "undefined";
                    else j = String(_.invalidValue);
                    A.push(j)
                } else A.push(w)
            }
            Y = A.join(".")
        }
        PmK(K, Y, _.message, Object)
    }), K
}
// @from(Ln 444617, Col 0)
function Wi8(q) {
    let K = s(9),
        {
            errors: _
        } = q,
        [z] = Zq();
    if (_.length === 0) return null;
    let Y, A, O;
    if (K[0] !== _ || K[1] !== z) {
        let $ = _.reduce(CCY, {}),
            j = Object.keys($).sort();
        Y = u, A = "column", O = j.map((H) => {
            let J = $[H] || [];
            J.sort(SCY);
            let X = hCY(J),
                M = new Map;
            J.forEach((W) => {
                if (W.suggestion || W.docLink) {
                    let D = `${W.suggestion||""}|${W.docLink||""}`;
                    if (!M.has(D)) M.set(D, {
                        suggestion: W.suggestion,
                        docLink: W.docLink
                    })
                }
            });
            let P = DmK(X, {
                showValues: !0,
                themeName: z,
                treeCharColors: {
                    treeChar: "inactive",
                    key: "text",
                    value: "inactive"
                }
            });
            return P0.createElement(u, {
                key: H,
                flexDirection: "column"
            }, P0.createElement(T, null, H), P0.createElement(u, {
                marginLeft: 1
            }, P0.createElement(T, {
                dimColor: !0
            }, P)), M.size > 0 && P0.createElement(u, {
                flexDirection: "column",
                marginTop: 1
            }, Array.from(M.values()).map(RCY)))
        }), K[0] = _, K[1] = z, K[2] = Y, K[3] = A, K[4] = O
    } else Y = K[2], A = K[3], O = K[4];
    let w;
    if (K[5] !== Y || K[6] !== A || K[7] !== O) w = P0.createElement(Y, {
        flexDirection: A
    }, O), K[5] = Y, K[6] = A, K[7] = O, K[8] = w;
    else w = K[8];
    return w
}
// @from(Ln 444672, Col 0)
function RCY(q, K) {
    return P0.createElement(u, {
        key: `suggestion-pair-${K}`,
        flexDirection: "column",
        marginBottom: 1
    }, q.suggestion && P0.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, q.suggestion), q.docLink && P0.createElement(T, {
        dimColor: !0,
        wrap: "wrap"
    }, "Learn more: ", q.docLink))
}
// @from(Ln 444686, Col 0)
function SCY(q, K) {
    if (!q.path && K.path) return -1;
    if (q.path && !K.path) return 1;
    return (q.path || "").localeCompare(K.path || "")
}
// @from(Ln 444692, Col 0)
function CCY(q, K) {
    let _ = K.file || "(file not specified)";
    if (!q[_]) q[_] = [];
    return q[_].push(K), q
}
// @from(Ln 444697, Col 4)
P0
// @from(Ln 444698, Col 4)
RO7 = L(() => {
    o6();
    WmK();
    g6();
    ZmK();
    P0 = K6(P6(), 1)
})
// @from(Ln 444706, Col 0)
function Zi8() {
    let q = s(6),
        {
            addNotification: K,
            removeNotification: _
        } = EK(),
        [z, Y] = Di8.useState(bCY),
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = () => {
        let {
            errors: j
        } = bt();
        Y(j)
    }, q[0] = A;
    else A = q[0];
    gR6(A);
    let w, $;
    if (q[1] !== K || q[2] !== z || q[3] !== _) w = () => {
        if (nK()) return;
        if (z.length > 0) {
            let j = `Found ${z.length} settings ${z.length===1?"issue":"issues"} · /doctor for details`;
            K({
                key: fmK,
                text: j,
                color: "warning",
                priority: "high",
                timeoutMs: 60000
            })
        } else _(fmK)
    }, $ = [z, K, _], q[1] = K, q[2] = z, q[3] = _, q[4] = w, q[5] = $;
    else w = q[4], $ = q[5];
    return Di8.useEffect(w, $), z
}
// @from(Ln 444740, Col 0)
function bCY() {
    let {
        errors: q
    } = bt();
    return q
}
// @from(Ln 444746, Col 4)
Di8
// @from(Ln 444746, Col 9)
fmK = "settings-errors"
// @from(Ln 444747, Col 4)
SO7 = L(() => {
    o6();
    kY();
    y8();
    A48();
    Tu8();
    Di8 = K6(P6(), 1)
})
// @from(Ln 444756, Col 0)
function ICY(q) {
    return q === "projectSettings" || q === "policySettings" || q === "command"
}
// @from(Ln 444760, Col 0)
function fi8(q) {
    return E98(q)
}
// @from(Ln 444764, Col 0)
function GmK(q, K, _) {
    let z = fi8(K.source),
        Y = fi8(_.source),
        A = K.ruleValue.toolName;
    if (q === "deny") return `Remove the "${A}" deny rule from ${z}, or remove the specific allow rule from ${Y}`;
    return `Remove the "${A}" ask rule from ${z}, or remove the specific allow rule from ${Y}`
}
// @from(Ln 444772, Col 0)
function xCY(q, K, _) {
    let {
        toolName: z,
        ruleContent: Y
    } = q.ruleValue;
    if (Y === void 0) return {
        shadowed: !1
    };
    let A = K.find((O) => O.ruleValue.toolName === z && O.ruleValue.ruleContent === void 0);
    if (!A) return {
        shadowed: !1
    };
    if (z === S7 && _.sandboxAutoAllowEnabled) {
        if (!ICY(A.source)) return {
            shadowed: !1
        }
    }
    return {
        shadowed: !0,
        shadowedBy: A,
        shadowType: "ask"
    }
}
// @from(Ln 444796, Col 0)
function uCY(q, K) {
    let {
        toolName: _,
        ruleContent: z
    } = q.ruleValue;
    if (z === void 0) return {
        shadowed: !1
    };
    let Y = K.find((A) => A.ruleValue.toolName === _ && A.ruleValue.ruleContent === void 0);
    if (!Y) return {
        shadowed: !1
    };
    return {
        shadowed: !0,
        shadowedBy: Y,
        shadowType: "deny"
    }
}
// @from(Ln 444815, Col 0)
function Tx6(q, K) {
    let _ = [],
        z = wx6(q),
        Y = $x6(q),
        A = N_6(q);
    for (let O of z) {
        let w = uCY(O, A);
        if (w.shadowed) {
            let j = fi8(w.shadowedBy.source);
            _.push({
                rule: O,
                reason: `Blocked by "${w.shadowedBy.ruleValue.toolName}" deny rule (from ${j})`,
                shadowedBy: w.shadowedBy,
                shadowType: "deny",
                fix: GmK("deny", w.shadowedBy, O)
            });
            continue
        }
        let $ = xCY(O, Y, K);
        if ($.shadowed) {
            let j = fi8($.shadowedBy.source);
            _.push({
                rule: O,
                reason: `Shadowed by "${$.shadowedBy.ruleValue.toolName}" ask rule (from ${j})`,
                shadowedBy: $.shadowedBy,
                shadowType: "ask",
                fix: GmK("ask", $.shadowedBy, O)
            })
        }
    }
    return _
}
// @from(Ln 444847, Col 4)
Gi8 = L(() => {
    g$()
})
// @from(Ln 444851, Col 0)
function e98(q) {
    if (!q) return 0;
    return q.activeAgents.filter((K) => K.source !== "built-in").reduce((K, _) => {
        let z = `${_.agentType}: ${_.whenToUse}`;
        return K + w_(z)
    }, 0)
}
// @from(Ln 444858, Col 4)
bP6 = 15000
// @from(Ln 444859, Col 4)
CO7 = L(() => {
    Nk()
})
// @from(Ln 444862, Col 0)
async function mCY() {
    let q = QK6(await GJ());
    if (q.length === 0) return null;
    let K = q.sort((z, Y) => Y.content.length - z.content.length).map((z) => `${z.path}: ${z.content.length.toLocaleString()} chars`);
    return {
        type: "claudemd_files",
        severity: "warning",
        message: q.length === 1 ? `Large CLAUDE.md file detected (${q[0].content.length.toLocaleString()} chars > ${Oc.toLocaleString()})` : `${q.length} large CLAUDE.md files detected (each > ${Oc.toLocaleString()} chars)`,
        details: K,
        currentValue: q.length,
        threshold: Oc
    }
}
// @from(Ln 444875, Col 0)
async function BCY(q) {
    if (!q) return null;
    let K = e98(q);
    if (K <= bP6) return null;
    let _ = q.activeAgents.filter((Y) => Y.source !== "built-in").map((Y) => {
            let A = `${Y.agentType}: ${Y.whenToUse}`;
            return {
                name: Y.agentType,
                tokens: w_(A)
            }
        }).sort((Y, A) => A.tokens - Y.tokens),
        z = _.slice(0, 5).map((Y) => `${Y.name}: ~${Y.tokens.toLocaleString()} tokens`);
    if (_.length > 5) z.push(`(${_.length-5} more custom agents)`);
    return {
        type: "agent_descriptions",
        severity: "warning",
        message: `Large agent descriptions (~${K.toLocaleString()} tokens > ${bP6.toLocaleString()})`,
        details: z,
        currentValue: K,
        threshold: bP6
    }
}
// @from(Ln 444897, Col 0)
async function pCY(q) {
    let K = await q(),
        _ = Z7.isSandboxingEnabled() && Z7.isAutoAllowBashIfSandboxedEnabled(),
        z = Tx6(K, {
            sandboxAutoAllowEnabled: _
        });
    if (z.length === 0) return null;
    let Y = z.flatMap((A) => [`${I9(A.rule.ruleValue)}: ${A.reason}`, `  Fix: ${A.fix}`]);
    return {
        type: "unreachable_rules",
        severity: "warning",
        message: `${z.length} ${O7(z.length,"unreachable permission rule")} detected`,
        details: Y,
        currentValue: z.length,
        threshold: 0
    }
}
// @from(Ln 444914, Col 0)
async function vmK(q, K) {
    let [_, z, Y] = await Promise.all([mCY(), BCY(q), pCY(K)]);
    return {
        claudeMdWarning: _,
        agentWarning: z,
        unreachableRulesWarning: Y
    }
}
// @from(Ln 444922, Col 4)
TmK = L(() => {
    Nk();
    PM();
    cZ();
    Gi8();
    yY();
    CO7()
})
// @from(Ln 444930, Col 4)
EmK = {}
// @from(Ln 444940, Col 0)
function kmK(q) {
    let K = s(9),
        {
            promise: _
        } = q,
        {
            tags: z,
            isNative: Y
        } = F7.use(_);
    if (!z.latest) {
        let $;
        if (K[0] !== Y) $ = Y && o3() ? F7.default.createElement(uK.Node, {
            dimColor: !0
        }, "Version check skipped (essential-traffic-only mode)") : F7.default.createElement(uK.Node, {
            dimColor: !0
        }, "Failed to fetch versions"), K[0] = Y, K[1] = $;
        else $ = K[1];
        return $
    }
    let A;
    if (K[2] !== z.stable) A = z.stable && F7.default.createElement(uK.Node, null, "Stable version: ", z.stable), K[2] = z.stable, K[3] = A;
    else A = K[3];
    let O;
    if (K[4] !== z.latest) O = F7.default.createElement(uK.Node, null, "Latest version: ", z.latest), K[4] = z.latest, K[5] = O;
    else O = K[5];
    let w;
    if (K[6] !== A || K[7] !== O) w = F7.default.createElement(F7.default.Fragment, null, A, O), K[6] = A, K[7] = O, K[8] = w;
    else w = K[8];
    return w
}
// @from(Ln 444971, Col 0)
function IO7({
    onDone: q
}) {
    let K = M8((f) => f.agentDefinitions),
        _ = M8((f) => f.toolPermissionContext),
        z = M8((f) => f.plugins.errors);
    $3();
    let [Y, A] = F7.useState(null), [O, w] = F7.useState(null), [$, j] = F7.useState(null), [H, J] = F7.useState(null), X = Zi8(), M = F7.useMemo(async () => {
        let v = (await $X6()).installationType === "native";
        return {
            tags: await (v ? d9K : Q9K)().catch(() => ({
                latest: null,
                stable: null
            })),
            isNative: v
        }
    }, []), P = vu(), W = X.filter((f) => f.mcpErrorMetadata === void 0), D = F7.useMemo(() => {
        return [{
            name: "BASH_MAX_OUTPUT_LENGTH",
            default: B47,
            upperLimit: m47
        }, {
            name: "TASK_MAX_OUTPUT_LENGTH",
            default: A37,
            upperLimit: Y37
        }, {
            name: "CLAUDE_CODE_MAX_OUTPUT_TOKENS",
            ...wa("claude-opus-4-6")
        }].map((v) => {
            let V = process.env[v.name],
                k = Lp(v.name, V, v.default, v.upperLimit);
            return {
                name: v.name,
                ...k
            }
        }).filter((v) => v.status !== "valid")
    }, []);
    F7.useEffect(() => {
        $X6({
            probeKeychain: !0
        }).then(A), (async () => {
            let f = bO7(A7(), "agents"),
                v = bO7(Y7(), ".claude", "agents"),
                {
                    activeAgents: V,
                    allAgents: k,
                    failedFiles: N
                } = K,
                [R, h] = await Promise.all([a3(f), a3(v)]),
                C = {
                    activeAgents: V.map((B) => ({
                        agentType: B.agentType,
                        source: B.source
                    })),
                    userAgentsDir: f,
                    projectAgentsDir: v,
                    userDirExists: R,
                    projectDirExists: h,
                    failedFiles: N
                };
            w(C);
            let x = await vmK({
                activeAgents: V,
                allAgents: k,
                failedFiles: N
            }, async () => _);
            if (j(x), i36()) {
                let B = bO7(vp8(), "claude", "locks"),
                    m = Np8(B),
                    S = e9K(B);
                J({
                    enabled: !0,
                    locks: S,
                    locksDir: B,
                    staleLocksCleaned: m
                })
            } else J({
                enabled: !1,
                locks: [],
                locksDir: "",
                staleLocksCleaned: 0
            })
        })()
    }, [_, K]);
    let Z = F7.useCallback(() => {
            q("Claude Code diagnostics dismissed", {
                display: "system"
            })
        }, [q]),
        G = F7.useMemo(() => NmK(Y, O, W, z, $, D), [Y, O, W, z, $, D]);
    if (L7({
            "confirm:yes": Z,
            "confirm:no": Z
        }, {
            context: "Confirmation"
        }), L7({
            "doctor:fix": () => {
                if (G) q(G, {
                    display: "user",
                    shouldQuery: !0
                })
            }
        }, {
            context: "Doctor",
            isActive: G !== null
        }), !Y) return F7.default.createElement(A_, null, F7.default.createElement(T, {
        dimColor: !0
    }, "Checking installation status…"));
    return F7.default.createElement(A_, null, F7.default.createElement(u, {
        flexDirection: "column"
    }, F7.default.createElement(T, {
        bold: !0
    }, "Diagnostics"), F7.default.createElement(uK, null, F7.default.createElement(uK.Node, null, "Currently running: ", Y.installationType, " (", Y.version, ")"), Y.packageManager && F7.default.createElement(uK.Node, null, "Package manager: ", Y.packageManager), F7.default.createElement(uK.Node, null, "Path: ", Y.installationPath), Y.invokedBinary !== Y.installationPath && F7.default.createElement(uK.Node, null, "Invoked: ", Y.invokedBinary), F7.default.createElement(uK.Node, null, "Config install method: ", Y.configInstallMethod), F7.default.createElement(uK.Node, null, "Search: ", Y.ripgrepStatus.working ? "OK" : "Not working", " (", Y.ripgrepStatus.mode === "embedded" ? "bundled" : Y.ripgrepStatus.mode === "builtin" ? "vendor" : Y.ripgrepStatus.systemPath || "system", ")"))), Y.multipleInstallations.length > 1 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), "Multiple installations found"), F7.default.createElement(uK, null, Y.multipleInstallations.map((f, v) => F7.default.createElement(uK.Node, {
        key: v
    }, f.type, " at ", f.path)))), Y.warnings.length > 0 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, Y.warnings.map((f, v) => F7.default.createElement(u, {
        key: v,
        flexDirection: "column"
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), f.issue), F7.default.createElement(wi8, {
        connectors: ["space", "last"]
    }, F7.default.createElement(T, {
        dimColor: !0
    }, f.fix))))), W.length > 0 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, {
        bold: !0
    }, "Invalid settings"), F7.default.createElement(Wi8, {
        errors: W
    })), F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, {
        bold: !0
    }, "Updates"), F7.default.createElement(uK, null, F7.default.createElement(uK.Node, null, "Auto-updates:", " ", Y.packageManager ? "Managed by package manager" : Y.autoUpdates), Y.hasUpdatePermissions !== null && F7.default.createElement(uK.Node, null, "Update permissions:", " ", Y.hasUpdatePermissions ? "Yes" : "No (requires sudo)"), F7.default.createElement(uK.Node, null, "Auto-update channel: ", P), F7.default.createElement(F7.Suspense, {
        fallback: null
    }, F7.default.createElement(kmK, {
        promise: M
    })))), F7.default.createElement(XmK, null), F7.default.createElement(Pi8, null), F7.default.createElement($mK, null), null, D.length > 0 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, {
        bold: !0
    }, "Environment variables"), F7.default.createElement(uK, null, D.map((f, v) => F7.default.createElement(uK.Node, {
        key: v
    }, F7.default.createElement(T, null, f.name, ":", " ", F7.default.createElement(T, {
        color: f.status === "capped" ? "warning" : "error"
    }, f.message)))))), H?.enabled && (H.locks.length > 0 || H.staleLocksCleaned > 0) && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, {
        bold: !0
    }, "Version locks"), F7.default.createElement(uK, null, H.staleLocksCleaned > 0 && F7.default.createElement(uK.Node, {
        dimColor: !0
    }, "Cleaned ", H.staleLocksCleaned, " stale lock(s)"), H.locks.map((f, v) => F7.default.createElement(uK.Node, {
        key: v
    }, F7.default.createElement(T, null, f.version, ": PID ", f.pid, " ", f.isProcessRunning ? F7.default.createElement(T, null, "(running)") : F7.default.createElement(T, {
        color: "warning"
    }, "(stale)")))))), O?.failedFiles && O.failedFiles.length > 0 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), F7.default.createElement(T, {
        bold: !0
    }, "Agent parse errors")), F7.default.createElement(uK, null, F7.default.createElement(uK.Node, {
        color: "error",
        label: `Failed to parse ${O.failedFiles.length} agent file(s):`
    }, O.failedFiles.map((f, v) => F7.default.createElement(uK.Node, {
        key: v,
        dimColor: !0
    }, f.path, ": ", f.error))))), z.length > 0 && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "error",
        withSpace: !0
    }), F7.default.createElement(T, {
        bold: !0
    }, "Plugin errors")), F7.default.createElement(uK, null, F7.default.createElement(uK.Node, {
        color: "error",
        label: `${z.length} plugin error(s) detected:`
    }, z.map((f, v) => F7.default.createElement(uK.Node, {
        key: v,
        dimColor: !0
    }, f.source || "unknown", "plugin" in f && f.plugin ? ` [${f.plugin}]` : "", ": ", GH(f)))))), $?.unreachableRulesWarning && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), F7.default.createElement(T, {
        bold: !0
    }, "Unreachable permission rules")), F7.default.createElement(uK, null, F7.default.createElement(uK.Node, {
        color: "warning",
        label: $.unreachableRulesWarning.message
    }, $.unreachableRulesWarning.details.map((f, v) => F7.default.createElement(uK.Node, {
        key: v,
        dimColor: !0
    }, f))))), $ && ($.claudeMdWarning || $.agentWarning) && F7.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, F7.default.createElement(T, null, F7.default.createElement(D4, {
        status: "warning",
        withSpace: !0
    }), F7.default.createElement(T, {
        bold: !0
    }, "Context usage warnings")), F7.default.createElement(uK, null, F7.default.createElement(VmK, {
        warning: $.claudeMdWarning
    }), F7.default.createElement(VmK, {
        warning: $.agentWarning
    }))), F7.default.createElement(u, {
        marginTop: 1
    }, F7.default.createElement(T, {
        dimColor: !0
    }, "Still having issues? Run /feedback to report details.")), F7.default.createElement(u, {
        marginTop: 1
    }, F7.default.createElement(T, {
        color: "permission"
    }, "Press ", F7.default.createElement(T, {
        bold: !0
    }, "Enter"), " to continue", G && F7.default.createElement(T, {
        dimColor: !0
    }, " · ", F7.default.createElement(T, {
        bold: !0
    }, "f"), " to fix with Claude"))))
}
// @from(Ln 445211, Col 0)
function NmK(q, K, _, z, Y, A) {
    let O = [];
    for (let w of q?.warnings ?? []) O.push(`- ${w.issue}
  Suggested fix: ${w.fix}`);
    for (let w of RI.warnings) O.push(`- Keybinding (${aa()}): ${w.message}${w.suggestion?`
  Suggested fix: ${w.suggestion}`:""}`);
    for (let w of K?.failedFiles ?? []) O.push(`- Agent file failed to parse: ${w.path}
  Error: ${w.error}`);
    for (let w of _) {
        let $ = [w.file, w.path].filter(Boolean).join(" › ");
        O.push(`- Settings${$?` (${$})`:""}: ${w.message}${w.suggestion?`
  Suggested fix: ${w.suggestion}`:""}`)
    }
    for (let w of z) {
        let $ = ["plugin" in w && w.plugin, w.source].filter(Boolean).join(" @ ");
        O.push(`- Plugin${$?` (${$})`:""}: ${GH(w)}`)
    }
    if (Z7.isSupportedPlatform() && Z7.isSandboxEnabledInSettings())
        for (let w of Z7.checkDependencies().errors) O.push(`- Sandbox: ${w}
  (See /sandbox for install instructions)`);
    for (let w of [Y?.claudeMdWarning, Y?.agentWarning, Y?.unreachableRulesWarning])
        if (w) O.push(`- ${w.message}
  ${w.details.join(`
  `)}`);
    for (let w of A) O.push(`- Environment variable ${w.name}: ${w.message}`);
    if (O.length === 0) return null;
    return ["Help me fix the issues reported by /doctor below.", "", "For each issue: briefly explain what the fix will do, then ask me to confirm before running any shell command that deletes files, modifies global config, or changes my installation. Safe read-only checks are fine without asking. If a suggested fix looks wrong for my setup, say so instead of running it.", "", O.join(`
`)].join(`
`)
}
// @from(Ln 445242, Col 0)
function VmK(q) {
    let K = s(5),
        {
            warning: _
        } = q;
    if (!_) return null;
    let z = _.message,
        Y;
    if (K[0] !== _.details) Y = _.details.map(FCY), K[0] = _.details, K[1] = Y;
    else Y = K[1];
    let A;
    if (K[2] !== Y || K[3] !== _.message) A = F7.default.createElement(uK.Node, {
        color: "warning",
        label: z
    }, Y), K[2] = Y, K[3] = _.message, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 445261, Col 0)
function FCY(q, K) {
    return q.startsWith("(") ? F7.default.createElement(wi8, {
        key: K,
        connectors: ["space", "space"]
    }, F7.default.createElement(T, {
        dimColor: !0
    }, q)) : F7.default.createElement(uK.Node, {
        key: K,
        dimColor: !0
    }, q)
}
// @from(Ln 445272, Col 4)
F7
// @from(Ln 445273, Col 4)
xO7 = L(() => {
    o6();
    jmK();
    hO7();
    AJ();
    Q8();
    y8();
    DJ();
    Y2();
    vx6();
    JmK();
    MmK();
    RO7();
    SO7();
    C$();
    g6();
    yd();
    C7();
    N7();
    ht();
    TmK();
    n36();
    ty6();
    eK();
    u87();
    G$();
    h_6();
    yY();
    P58();
    O37();
    aq8();
    F7 = K6(P6(), 1)
})
// @from(Ln 445306, Col 4)
LmK = {}
// @from(Ln 445310, Col 4)
ymK
// @from(Ln 445310, Col 9)
gCY = (q, K, _) => {
    return Promise.resolve(ymK.default.createElement(IO7, {
        onDone: q
    }))
}
// @from(Ln 445315, Col 4)
hmK = L(() => {
    xO7();
    ymK = K6(P6(), 1)
})
// @from(Ln 445319, Col 4)
UCY
// @from(Ln 445319, Col 9)
uO7
// @from(Ln 445320, Col 4)
RmK = L(() => {
    Q8();
    UCY = {
        name: "doctor",
        description: "Diagnose and verify your Claude Code installation and settings",
        isEnabled: () => !S6(process.env.DISABLE_DOCTOR_COMMAND),
        type: "local-jsx",
        load: () => Promise.resolve().then(() => (hmK(), LmK))
    }, uO7 = UCY
})
// @from(Ln 445331, Col 0)
function SmK(q) {
    return ez(q) !== null
}
// @from(Ln 445334, Col 4)
CmK = L(() => {
    pK()
})
// @from(Ln 445344, Col 0)
function xmK(q) {
    let K = s(61),
        {
            onSelect: _,
            onCancel: z
        } = q,
        Y = Hg.use(GJ()),
        A = bmK(A7(), "CLAUDE.md"),
        O = bmK(Y7(), "CLAUDE.md"),
        w = Y.some((k6) => k6.path === A),
        $ = Y.some((k6) => k6.path === O),
        j = [...Y.filter(sCY).map(aCY), ...w ? [] : [{
            path: A,
            type: "User",
            content: "",
            exists: !1
        }], ...$ ? [] : [{
            path: O,
            type: "Project",
            content: "",
            exists: !1
        }]],
        H = new Map,
        J = j.map((k6) => {
            let T6 = S3(k6.path),
                v6 = k6.exists ? "" : " (new)",
                L6 = k6.parent ? (H.get(k6.parent) ?? 0) + 1 : 0;
            H.set(k6.path, L6);
            let y6 = L6 > 0 ? "  ".repeat(L6 - 1) : "",
                c6;
            if (k6.type === "User" && !k6.isNested && k6.path === A) c6 = "User memory";
            else if (k6.type === "Project" && !k6.isNested && k6.path === O) c6 = "Project memory";
            else if (L6 > 0) c6 = `${y6}L ${T6}${v6}`;
            else c6 = `${T6}`;
            let Z8, N8 = SmK(Y7());
            if (k6.type === "User" && !k6.isNested) Z8 = "Saved in ~/.claude/CLAUDE.md";
            else if (k6.type === "Project" && !k6.isNested && k6.path === O) Z8 = `${N8?"Checked in at":"Saved in"} ./CLAUDE.md`;
            else if (k6.parent) Z8 = "@-imported";
            else if (k6.isNested) Z8 = "dynamically loaded";
            else Z8 = "";
            return {
                label: c6,
                value: k6.path,
                description: Z8
            }
        }),
        X = [],
        M = M8(oCY);
    if (x3()) {
        let k6;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) k6 = {
            label: "Open auto-memory folder",
            value: `${q_8}${Nw()}`,
            description: ""
        }, K[0] = k6;
        else k6 = K[0];
        if (X.push(k6), ImK.isTeamMemoryEnabled()) {
            let T6;
            if (K[1] === Symbol.for("react.memo_cache_sentinel")) T6 = {
                label: "Open team memory folder",
                value: `${q_8}${ImK.getTeamMemPath()}`,
                description: ""
            }, K[1] = T6;
            else T6 = K[1];
            X.push(T6)
        }
        for (let T6 of M.activeAgents)
            if (T6.memory) {
                let v6 = Jh6(T6.agentType, T6.memory);
                X.push({
                    label: `Open ${Y8.bold(T6.agentType)} agent memory`,
                    value: `${q_8}${v6}`,
                    description: `${T6.memory} scope`
                })
            }
    }
    J.push(...X);
    let P;
    if (K[2] !== J) P = vi8 && J.some(rCY) ? vi8 : J[0]?.value || "", K[2] = J, K[3] = P;
    else P = K[3];
    let W = P,
        [D, Z] = Hg.useState(x3),
        [G, f] = Hg.useState(X38),
        [v, V] = Hg.useState(td8),
        k, N;
    if (K[4] !== v) k = () => {
        if (v) return;
        return A$6(() => {
            if (td8()) V(!0), f(X38())
        })
    }, N = [v], K[4] = v, K[5] = k, K[6] = N;
    else k = K[5], N = K[6];
    Hg.useEffect(k, N);
    let R = D && v,
        h = M8(nCY),
        [C, x] = Hg.useState(null),
        B;
    if (K[7] !== R) B = () => {
        if (!R) return;
        UQ8().then(x)
    }, K[7] = R, K[8] = B;
    else B = K[8];
    let m;
    if (K[9] !== h || K[10] !== R) m = [R, h], K[9] = h, K[10] = R, K[11] = m;
    else m = K[11];
    Hg.useEffect(B, m);
    let S;
    if (K[12] !== h || K[13] !== C) S = h ? "running" : C === null ? "" : C === 0 ? "never" : `last ran ${CC(new Date(C))}`, K[12] = h, K[13] = C, K[14] = S;
    else S = K[14];
    let F = S,
        [U, g] = Hg.useState(null),
        c = U !== null,
        n = R ? 1 : 0,
        l;
    if (K[15] !== D) l = function() {
        let T6 = !D;
        P7("userSettings", {
            autoMemoryEnabled: T6
        }), Z(T6), d("tengu_auto_memory_toggled", {
            enabled: T6
        })
    }, K[15] = D, K[16] = l;
    else l = K[16];
    let z6 = l,
        A6;
    if (K[17] !== G) A6 = function() {
        let T6 = !G,
            v6 = T6 && v7().autoDreamEnabled === void 0;
        P7("userSettings", {
            autoDreamEnabled: T6
        }), f(T6), d("tengu_auto_dream_toggled", {
            enabled: T6,
            is_first_enable: v6
        })
    }, K[17] = G, K[18] = A6;
    else A6 = K[18];
    let e = A6;
    $3();
    let i;
    if (K[19] === Symbol.for("react.memo_cache_sentinel")) i = {
        context: "Confirmation"
    }, K[19] = i;
    else i = K[19];
    G1("confirm:no", z, i);
    let O6;
    if (K[20] !== U || K[21] !== e || K[22] !== z6) O6 = () => {
        if (U === 0) z6();
        else if (U === 1) e()
    }, K[20] = U, K[21] = e, K[22] = z6, K[23] = O6;
    else O6 = K[23];
    let J6;
    if (K[24] !== c) J6 = {
        context: "Confirmation",
        isActive: c
    }, K[24] = c, K[25] = J6;
    else J6 = K[25];
    G1("confirm:yes", O6, J6);
    let $6;
    if (K[26] !== n) $6 = () => {
        g((k6) => k6 !== null && k6 < n ? k6 + 1 : null)
    }, K[26] = n, K[27] = $6;
    else $6 = K[27];
    let H6;
    if (K[28] !== c) H6 = {
        context: "Select",
        isActive: c
    }, K[28] = c, K[29] = H6;
    else H6 = K[29];
    G1("select:next", $6, H6);
    let q6;
    if (K[30] === Symbol.for("react.memo_cache_sentinel")) q6 = () => {
        g(lCY)
    }, K[30] = q6;
    else q6 = K[30];
    let o;
    if (K[31] !== c) o = {
        context: "Select",
        isActive: c
    }, K[31] = c, K[32] = o;
    else o = K[32];
    G1("select:previous", q6, o);
    let _6 = U === 0,
        r = D ? "on" : "off",
        t;
    if (K[33] !== r) t = W0.createElement(T, null, "Auto-memory: ", r), K[33] = r, K[34] = t;
    else t = K[34];
    let Y6;
    if (K[35] !== _6 || K[36] !== t) Y6 = W0.createElement(TR, {
        isFocused: _6
    }, t), K[35] = _6, K[36] = t, K[37] = Y6;
    else Y6 = K[37];
    let X6;
    if (K[38] !== G || K[39] !== F || K[40] !== U || K[41] !== h || K[42] !== R) X6 = R && W0.createElement(TR, {
        isFocused: U === 1,
        styled: !1
    }, W0.createElement(T, {
        color: U === 1 ? "suggestion" : void 0
    }, "Auto-dream: ", G ? "on" : "off", F && W0.createElement(T, {
        dimColor: !0
    }, " · ", F), !h && G && W0.createElement(T, {
        dimColor: !0
    }, " · /dream to run"))), K[38] = G, K[39] = F, K[40] = U, K[41] = h, K[42] = R, K[43] = X6;
    else X6 = K[43];
    let M6;
    if (K[44] !== Y6 || K[45] !== X6) M6 = W0.createElement(u, {
        flexDirection: "column",
        marginBottom: 1
    }, Y6, X6), K[44] = Y6, K[45] = X6, K[46] = M6;
    else M6 = K[46];
    let W6;
    if (K[47] !== _) W6 = (k6) => {
        if (k6.startsWith(q_8)) {
            let T6 = k6.slice(q_8.length);
            dCY(T6, {
                recursive: !0
            }).catch(cCY).then(() => lS6(T6));
            return
        }
        vi8 = k6, _(k6)
    }, K[47] = _, K[48] = W6;
    else W6 = K[48];
    let V6;
    if (K[49] !== n) V6 = () => g(n), K[49] = n, K[50] = V6;
    else V6 = K[50];
    let f6;
    if (K[51] !== W || K[52] !== J || K[53] !== z || K[54] !== W6 || K[55] !== V6 || K[56] !== c) f6 = W0.createElement(A1, {
        defaultFocusValue: W,
        options: J,
        isDisabled: c,
        onChange: W6,
        onCancel: z,
        onUpFromFirstItem: V6
    }), K[51] = W, K[52] = J, K[53] = z, K[54] = W6, K[55] = V6, K[56] = c, K[57] = f6;
    else f6 = K[57];
    let G6;
    if (K[58] !== M6 || K[59] !== f6) G6 = W0.createElement(u, {
        flexDirection: "column",
        width: "100%"
    }, M6, f6), K[58] = M6, K[59] = f6, K[60] = G6;
    else G6 = K[60];
    return G6
}
// @from(Ln 445587, Col 0)
function cCY() {}
// @from(Ln 445589, Col 0)
function lCY(q) {
    return q !== null && q > 0 ? q - 1 : q
}
// @from(Ln 445593, Col 0)
function nCY(q) {
    return Object.values(q.tasks).some(iCY)
}
// @from(Ln 445597, Col 0)
function iCY(q) {
    return q.type === "dream" && q.status === "running"
}
// @from(Ln 445601, Col 0)
function rCY(q) {
    return q.value === vi8
}
// @from(Ln 445605, Col 0)
function oCY(q) {
    return q.agentDefinitions
}
// @from(Ln 445609, Col 0)
function aCY(q) {
    return {
        ...q,
        exists: !0
    }
}
// @from(Ln 445616, Col 0)
function sCY(q) {
    return q.type !== "AutoMem"
}
// @from(Ln 445619, Col 4)
W0
// @from(Ln 445619, Col 8)
Hg
// @from(Ln 445619, Col 12)
ImK
// @from(Ln 445619, Col 17)
vi8
// @from(Ln 445619, Col 22)
q_8 = "__open_folder__"
// @from(Ln 445620, Col 4)
umK = L(() => {
    o6();
    Y3();
    y8();
    C$();
    g6();
    C7();
    VY();
    B1();
    C8();
    j97();
    F58();
    N7();
    pp();
    Nj();
    PM();
    Q8();
    eK();
    c7();
    CmK();
    a1();
    g_();
    xE6();
    W0 = K6(P6(), 1), Hg = K6(P6(), 1), ImK = (ev(), B7(Tp))
})
// @from(Ln 445652, Col 0)
function mmK(q) {
    let K = tCY(),
        _ = b8(),
        z = q.startsWith(K) ? "~" + q.slice(K.length) : null,
        Y = q.startsWith(_) ? "./" + eCY(_, q) : null;
    if (z && Y) return z.length <= Y.length ? z : Y;
    return z || Y || q
}
// @from(Ln 445660, Col 4)
qbY
// @from(Ln 445661, Col 4)
BmK = L(() => {
    o6();
    g6();
    n7();
    qbY = K6(P6(), 1)
})
// @from(Ln 445675, Col 0)
function KbY(q) {
    return !!rN(q)
}
// @from(Ln 445679, Col 0)
function BO7(q) {
    let K = mO7(i5(q, " "));
    return _bY.find((_) => K.includes(_))
}
// @from(Ln 445684, Col 0)
function AbY(q, K, _) {
    if (!_) return [K];
    if (YbY.has(q)) return ["-g", `${K}:${_}`];
    if (q === "subl") return [`${K}:${_}`];
    return [K]
}
// @from(Ln 445691, Col 0)
function Ti8(q, K) {
    let _ = XL();
    if (!_) return !1;
    let z = _.split(" "),
        Y = z[0] ?? _,
        A = z.slice(1),
        O = BO7(_);
    if (O) {
        let j = AbY(O, q, K),
            H = {
                detached: !0,
                stdio: "ignore"
            },
            J;
        if (process.platform === "win32") {
            let X = j.map((M) => `"${M}"`).join(" ");
            J = pmK(`${_} ${X}`, {
                ...H,
                shell: !0
            })
        } else J = pmK(Y, [...A, ...j], H);
        return J.on("error", (X) => E(`editor spawn failed: ${X}`, {
            level: "error"
        })), J.unref(), !0
    }
    let w = KO.get(process.stdout);
    if (!w) return !1;
    let $ = K && zbY.test(mO7(Y));
    w.enterAlternateScreen();
    try {
        let j = {
                stdio: "inherit"
            },
            H;
        if (process.platform === "win32") {
            let J = $ ? `+${K} ` : "";
            H = FmK(`${_} ${J}"${q}"`, {
                ...j,
                shell: !0
            })
        } else {
            let J = [...A, ...$ ? [`+${K}`, q] : [q]];
            H = FmK(Y, J, j)
        }
        if (H.error) return E(`editor spawn failed: ${H.error}`, {
            level: "error"
        }), !1;
        return !0
    } finally {
        w.exitAlternateScreen()
    }
}
// @from(Ln 445743, Col 4)
_bY
// @from(Ln 445743, Col 9)
zbY
// @from(Ln 445743, Col 14)
YbY
// @from(Ln 445743, Col 19)
XL
// @from(Ln 445743, Col 23)
gmK
// @from(Ln 445744, Col 4)
Tn = L(() => {
    U4();
    Yk();
    K8();
    n0();
    _bY = ["code", "cursor", "windsurf", "codium", "subl", "atom", "gedit", "notepad++", "notepad"], zbY = /\b(vi|vim|nvim|nano|emacs|pico|micro|helix|hx)\b/, YbY = new Set(["code", "cursor", "windsurf", "codium"]);
    XL = P1(() => {
        if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
        if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
        if (process.platform === "win32") return "start /wait notepad";
        return ["code", "vi", "nano"].find((K) => KbY(K))
    }), gmK = P1(() => {
        let q = XL();
        if (!q) return;
        let K = mO7(i5(q, " "));
        return K && K.length <= 8 ? K : void 0
    })
})
// @from(Ln 445766, Col 0)
function wbY(q) {
    return BO7(q) !== void 0
}
// @from(Ln 445770, Col 0)
function xS(q) {
    let K = V8(),
        _ = KO.get(process.stdout);
    if (!_) throw Error("Ink instance not found - cannot pause rendering");
    let z = XL();
    if (!z) return {
        content: null
    };
    try {
        K.statSync(q)
    } catch {
        return {
            content: null
        }
    }
    let Y = !wbY(z);
    if (Y) _.enterAlternateScreen();
    else _.pause(), _.suspendStdin();
    try {
        let A = ObY[z] ?? z,
            O = A.split(" "),
            w = O[0] ?? A,
            $ = O.slice(1),
            j;
        if (process.platform === "win32") j = UmK(`${A} "${q}"`, {
            stdio: "inherit",
            shell: !0
        });
        else j = UmK(w, [...$, q], {
            stdio: "inherit"
        });
        if (j.error || j.signal || j.status !== null && j.status !== 0) {
            let J = kH(z),
                X = j.error ? j.error.message : j.signal ? `terminated by signal ${j.signal}` : `exited with code ${j.status}`;
            return {
                content: null,
                error: `${J} ${X}`
            }
        }
        return {
            content: K.readFileSync(q, {
                encoding: "utf-8"
            })
        }
    } catch {
        return {
            content: null
        }
    } finally {
        if (Y) _.exitAlternateScreen();
        else _.resumeStdin(), _.resume()
    }
}
// @from(Ln 445824, Col 0)
function $bY(q, K, _) {
    let z = q;
    for (let [Y, A] of Object.entries(_))
        if (A.type === "text") {
            let O = parseInt(Y),
                w = A.content,
                $ = z.indexOf(w);
            if ($ !== -1) {
                let j = hE6(w),
                    H = uy8(O, j);
                z = z.slice(0, $) + H + z.slice($ + w.length)
            }
        } return z
}
// @from(Ln 445839, Col 0)
function jbY(q) {
    let K = q.split(`
`);
    if (K.length > QmK) K = K.slice(-QmK), K.unshift("… (earlier output truncated)");
    return `# ─── Claude's last response (for reference; removed on save) ───
` + `${K.map((z)=>z?`# ${z}`:"#").join(`
`)}
${pO7}

`
}
// @from(Ln 445851, Col 0)
function HbY(q) {
    let K = q.indexOf(pO7);
    if (K === -1) return q;
    return q.slice(K + pO7.length).replace(/^\r?\n\r?\n?/, "")
}
// @from(Ln 445857, Col 0)
function ML(q, K, _) {
    let z = V8(),
        Y = vE6();
    try {
        let A = K ? RE6(q, K) : q,
            O = _ ? jbY(_) + A : A;
        aJ(Y, O, {
            encoding: "utf-8",
            flush: !0
        });
        let w = xS(Y);
        if (w.content === null) return w;
        let $ = w.content;
        if (_) $ = HbY($);
        if ($.endsWith(`
`) && !$.endsWith(`

`)) $ = $.slice(0, -1);
        if (K) $ = $bY($, q, K);
        return {
            content: $
        }
    } finally {
        try {
            z.unlinkSync(Y)
        } catch {}
    }
}
// @from(Ln 445885, Col 4)
ObY
// @from(Ln 445885, Col 9)
pO7 = "# ─── Write your reply below this line ──────────────────────────"
// @from(Ln 445886, Col 4)
QmK = 50
// @from(Ln 445887, Col 4)
uS = L(() => {
    II();
    Yk();
    Tn();
    Yq();
    kj();
    e8();
    cW();
    ObY = {
        code: "code -w",
        subl: "subl --wait"
    }
})
// @from(Ln 445900, Col 4)
dmK = {}
// @from(Ln 445909, Col 0)
function MbY({
    onDone: q
}) {
    let K = async (z) => {
        try {
            if (z.includes(A7())) await JbY(A7(), {
                recursive: !0
            });
            try {
                await XbY(z, "", {
                    encoding: "utf8",
                    flag: "wx"
                })
            } catch ($) {
                if (Q1($) !== "EEXIST") throw $
            }
            await xS(z);
            let Y = "default",
                A = "";
            if (process.env.VISUAL) Y = "$VISUAL", A = process.env.VISUAL;
            else if (process.env.EDITOR) Y = "$EDITOR", A = process.env.EDITOR;
            let O = Y !== "default" ? `Using ${Y}="${A}".` : "",
                w = O ? `> ${O} To change editor, set $EDITOR or $VISUAL environment variable.` : "> To use a different editor, set the $EDITOR or $VISUAL environment variable.";
            q(`Opened memory file at ${mmK(z)}

${w}`, {
                display: "system"
            })
        } catch (Y) {
            j6(Y), q(`Error opening memory file: ${Y}`)
        }
    }, _ = () => {
        q("Cancelled memory editing", {
            display: "system"
        })
    };
    return D0.createElement(R1, {
        title: "Memory",
        onCancel: _,
        color: "remember"
    }, D0.createElement(u, {
        flexDirection: "column"
    }, D0.createElement(D0.Suspense, {
        fallback: null
    }, D0.createElement(xmK, {
        onSelect: K,
        onCancel: _
    })), D0.createElement(u, {
        marginTop: 1
    }, D0.createElement(T, {
        dimColor: !0
    }, "Learn more: ", D0.createElement(yq, {
        url: "https://code.claude.com/docs/en/memory"
    })))))
}
// @from(Ln 445964, Col 4)
D0
// @from(Ln 445964, Col 8)
PbY = async (q) => {
    return Lk(), await GJ(), D0.createElement(MbY, {
        onDone: q
    })
}
// @from(Ln 445969, Col 4)
cmK = L(() => {
    S4();
    umK();
    BmK();
    g6();
    PM();
    Q8();
    m8();
    U8();
    uS();
    D0 = K6(P6(), 1)
})
// @from(Ln 445981, Col 4)
WbY
// @from(Ln 445981, Col 9)
lmK
// @from(Ln 445982, Col 4)
nmK = L(() => {
    WbY = {
        type: "local-jsx",
        name: "memory",
        description: "Edit Claude memory files",
        load: () => Promise.resolve().then(() => (cmK(), dmK))
    }, lmK = WbY
})
// @from(Ln 445990, Col 4)
imK = {}
// @from(Ln 445994, Col 4)
DbY = async () => {
    let q = !Qg();
    return J81(q), d("tengu_memory_toggled", {
        toggled_off: q
    }), {
        type: "text",
        value: q ? `Automemory disabled for this session · this conversation will not write or read new memories, and previously-loaded memory content should not be referenced.

Run /toggle-memory again to re-enable.` : "Automemory re-enabled · memory content may be referenced and new memories can be saved."
    }
}
// @from(Ln 446005, Col 4)
rmK = L(() => {
    y8();
    C8()
})
// @from(Ln 446009, Col 4)
ZbY
// @from(Ln 446009, Col 9)
omK
// @from(Ln 446010, Col 4)
amK = L(() => {
    y8();
    VY();
    ZbY = {
        type: "local",
        name: "toggle-memory",
        description: "Toggle automemory off/on for this session",
        isEnabled: () => !1,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (rmK(), imK)),
        userFacingName() {
            return "toggle-memory"
        }
    }, omK = ZbY
})
// @from(Ln 446027, Col 0)
function FO7(q) {
    let K = s(14),
        {
            commands: _,
            maxHeight: z,
            columns: Y,
            title: A,
            onCancel: O,
            emptyMessage: w
        } = q,
        {
            headerFocused: $,
            focusHeader: j
        } = uX(),
        H = Math.max(1, Y - 10),
        J = Math.max(1, Math.floor((z - 10) / 2)),
        X;
    if (K[0] !== _ || K[1] !== H) {
        let W = new Set,
            D;
        if (K[3] !== H) D = (Z) => ({
            label: `/${Z.name}`,
            value: Z.name,
            description: w5(IP6(Z), H, !0)
        }), K[3] = H, K[4] = D;
        else D = K[4];
        X = _.filter((Z) => {
            if (W.has(Z.name)) return !1;
            return W.add(Z.name), !0
        }).sort(fbY).map(D), K[0] = _, K[1] = H, K[2] = X
    } else X = K[2];
    let M = X,
        P;
    if (K[5] !== _.length || K[6] !== w || K[7] !== j || K[8] !== $ || K[9] !== O || K[10] !== M || K[11] !== A || K[12] !== J) P = FT.createElement(u, {
        flexDirection: "column",
        paddingY: 1
    }, _.length === 0 && w ? FT.createElement(T, {
        dimColor: !0
    }, w) : FT.createElement(FT.Fragment, null, FT.createElement(T, null, A), FT.createElement(u, {
        marginTop: 1
    }, FT.createElement(A1, {
        options: M,
        visibleOptionCount: J,
        onCancel: O,
        disableSelection: !0,
        hideIndexes: !0,
        layout: "compact-vertical",
        onUpFromFirstItem: j,
        isDisabled: $
    })))), K[5] = _.length, K[6] = w, K[7] = j, K[8] = $, K[9] = O, K[10] = M, K[11] = A, K[12] = J, K[13] = P;
    else P = K[13];
    return P
}
// @from(Ln 446081, Col 0)
function fbY(q, K) {
    return q.name.localeCompare(K.name)
}
// @from(Ln 446084, Col 4)
FT
// @from(Ln 446085, Col 4)
smK = L(() => {
    o6();
    CA();
    g6();
    c7();
    gK();
    BT();
    FT = K6(P6(), 1)
})
// @from(Ln 446095, Col 0)
function ce() {
    return H8().editorMode === "vim"
}
// @from(Ln 446099, Col 0)
function tmK() {
    if (X7.terminal === "Apple_Terminal" && process.platform === "darwin") return "shift + ⏎ for newline";
    if (_B1()) return "shift + ⏎ for newline";
    return zB1() ? "\\⏎ for newline" : "backslash (\\) + return (⏎) for newline"
}
// @from(Ln 446105, Col 0)
function emK(q, K) {
    if (K.ctrl || K.meta) return !1;
    if (GbY.has(q)) return !1;
    return q.length > 0 && !/^\s/.test(q)
}
// @from(Ln 446111, Col 0)
function qBK(q) {
    return q.length > 0 && ".,?!:;)]".includes(q.charAt(0))
}
// @from(Ln 446114, Col 4)
GbY
// @from(Ln 446115, Col 4)
K_8 = L(() => {
    o$6();
    h1();
    D_();
    GbY = new Set(["escape", "return", "enter", "tab", "backspace", "delete", "up", "down", "left", "right", "pageup", "pagedown", "home", "end", "insert", "clear", "center", "undefined", "mouse", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"])
})
// @from(Ln 446122, Col 0)
function KBK(q) {
    return q.replaceAll("+", " + ")
}
// @from(Ln 446126, Col 0)
function Vi8(q) {
    let K = s(97),
        {
            dimColor: _,
            fixedWidth: z,
            gap: Y,
            paddingX: A
        } = q,
        O = V3("app:toggleTranscript", "Global", "ctrl+o"),
        w;
    if (K[0] !== O) w = KBK(O), K[0] = O, K[1] = w;
    else w = K[1];
    let $ = w,
        j = GR("app:toggleTodos", "Global", "ctrl+t"),
        H = GR("chat:undo", "Chat", "ctrl+_"),
        J = GR("chat:stash", "Chat", "ctrl+s"),
        X = GR("chat:cycleMode", "Chat", "shift+tab"),
        M = GR("chat:modelPicker", "Chat", "alt+p"),
        P = GR("chat:fastMode", "Chat", "alt+o"),
        W = GR("chat:externalEditor", "Chat", "ctrl+g"),
        D = V3("app:toggleTerminal", "Global", "meta+j"),
        Z;
    if (K[2] !== D) Z = KBK(D), K[2] = D, K[3] = Z;
    else Z = K[3];
    let G = Z,
        f = GR("chat:imagePaste", "Chat", "ctrl+v"),
        v;
    if (K[4] !== _ || K[5] !== G) v = null, K[4] = _, K[5] = G, K[6] = v;
    else v = K[6];
    let V = v,
        k = z ? 24 : void 0,
        N;
    if (K[7] !== _) N = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "! for bash mode")), K[7] = _, K[8] = N;
    else N = K[8];
    let R;
    if (K[9] !== _) R = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "/ for commands")), K[9] = _, K[10] = R;
    else R = K[10];
    let h;
    if (K[11] !== _) h = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "@ for file paths")), K[11] = _, K[12] = h;
    else h = K[12];
    let C;
    if (K[13] !== _) C = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "& for background")), K[13] = _, K[14] = C;
    else C = K[14];
    let x;
    if (K[15] !== _) x = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "/btw for side question")), K[15] = _, K[16] = x;
    else x = K[16];
    let B;
    if (K[17] !== x || K[18] !== k || K[19] !== N || K[20] !== R || K[21] !== h || K[22] !== C) B = $q.createElement(u, {
        flexDirection: "column",
        width: k
    }, N, R, h, C, x), K[17] = x, K[18] = k, K[19] = N, K[20] = R, K[21] = h, K[22] = C, K[23] = B;
    else B = K[23];
    let m = z ? 35 : void 0,
        S;
    if (K[24] !== _) S = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "double tap esc to clear input")), K[24] = _, K[25] = S;
    else S = K[25];
    let F;
    if (K[26] !== X) F = $q.createElement(A8, {
        chord: X,
        action: "auto-accept edits",
        format: le
    }), K[26] = X, K[27] = F;
    else F = K[27];
    let U;
    if (K[28] !== _ || K[29] !== F) U = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, F)), K[28] = _, K[29] = F, K[30] = U;
    else U = K[30];
    let g;
    if (K[31] !== _ || K[32] !== $) g = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, $, " for verbose output")), K[31] = _, K[32] = $, K[33] = g;
    else g = K[33];
    let c;
    if (K[34] !== j) c = $q.createElement(A8, {
        chord: j,
        action: "toggle tasks",
        format: le
    }), K[34] = j, K[35] = c;
    else c = K[35];
    let n;
    if (K[36] !== _ || K[37] !== c) n = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, c)), K[36] = _, K[37] = c, K[38] = n;
    else n = K[38];
    let l;
    if (K[39] === Symbol.for("react.memo_cache_sentinel")) l = tmK(), K[39] = l;
    else l = K[39];
    let z6;
    if (K[40] !== _) z6 = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, l)), K[40] = _, K[41] = z6;
    else z6 = K[41];
    let A6;
    if (K[42] !== m || K[43] !== S || K[44] !== U || K[45] !== g || K[46] !== n || K[47] !== z6 || K[48] !== V) A6 = $q.createElement(u, {
        flexDirection: "column",
        width: m
    }, S, U, g, n, V, z6), K[42] = m, K[43] = S, K[44] = U, K[45] = g, K[46] = n, K[47] = z6, K[48] = V, K[49] = A6;
    else A6 = K[49];
    let e;
    if (K[50] !== H) e = $q.createElement(A8, {
        chord: H,
        action: "undo",
        format: le
    }), K[50] = H, K[51] = e;
    else e = K[51];
    let i;
    if (K[52] !== _ || K[53] !== e) i = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, e)), K[52] = _, K[53] = e, K[54] = i;
    else i = K[54];
    let O6;
    if (K[55] !== _) O6 = y1() !== "windows" && $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, $q.createElement(A8, {
        chord: "ctrl+z",
        action: "suspend",
        format: le
    }))), K[55] = _, K[56] = O6;
    else O6 = K[56];
    let J6;
    if (K[57] !== f) J6 = $q.createElement(A8, {
        chord: f,
        action: "paste images",
        format: le
    }), K[57] = f, K[58] = J6;
    else J6 = K[58];
    let $6;
    if (K[59] !== _ || K[60] !== J6) $6 = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, J6)), K[59] = _, K[60] = J6, K[61] = $6;
    else $6 = K[61];
    let H6;
    if (K[62] !== M) H6 = $q.createElement(A8, {
        chord: M,
        action: "switch model",
        format: le
    }), K[62] = M, K[63] = H6;
    else H6 = K[63];
    let q6;
    if (K[64] !== _ || K[65] !== H6) q6 = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, H6)), K[64] = _, K[65] = H6, K[66] = q6;
    else q6 = K[66];
    let o;
    if (K[67] !== _ || K[68] !== P) o = q5() && AM() && $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, $q.createElement(A8, {
        chord: P,
        action: "toggle fast mode",
        format: le
    }))), K[67] = _, K[68] = P, K[69] = o;
    else o = K[69];
    let _6;
    if (K[70] !== J) _6 = $q.createElement(A8, {
        chord: J,
        action: "stash prompt",
        format: le
    }), K[70] = J, K[71] = _6;
    else _6 = K[71];
    let r;
    if (K[72] !== _ || K[73] !== _6) r = $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, _6)), K[72] = _, K[73] = _6, K[74] = r;
    else r = K[74];
    let t;
    if (K[75] !== W) t = $q.createElement(A8, {
        chord: W,
        action: "edit in $EDITOR",
        format: le
    }), K[75] = W, K[76] = t;
    else t = K[76];
    let Y6;
    if (K[77] !== _ || K[78] !== t) Y6 = $q.createElement(u, {
        flexShrink: 0
    }, $q.createElement(T, {
        dimColor: _
    }, t)), K[77] = _, K[78] = t, K[79] = Y6;
    else Y6 = K[79];
    let X6;
    if (K[80] !== _) X6 = WR() && $q.createElement(u, null, $q.createElement(T, {
        dimColor: _
    }, "/keybindings to customize")), K[80] = _, K[81] = X6;
    else X6 = K[81];
    let M6;
    if (K[82] !== i || K[83] !== O6 || K[84] !== $6 || K[85] !== q6 || K[86] !== o || K[87] !== r || K[88] !== Y6 || K[89] !== X6) M6 = $q.createElement(u, {
        flexDirection: "column"
    }, i, O6, $6, q6, o, r, Y6, X6), K[82] = i, K[83] = O6, K[84] = $6, K[85] = q6, K[86] = o, K[87] = r, K[88] = Y6, K[89] = X6, K[90] = M6;
    else M6 = K[90];
    let W6;
    if (K[91] !== Y || K[92] !== A || K[93] !== B || K[94] !== A6 || K[95] !== M6) W6 = $q.createElement(u, {
        paddingX: A,
        flexDirection: "row",
        gap: Y
    }, B, A6, M6), K[91] = Y, K[92] = A, K[93] = B, K[94] = A6, K[95] = M6, K[96] = W6;
    else W6 = K[96];
    return W6
}
// @from(Ln 446336, Col 4)
$q
// @from(Ln 446336, Col 8)
le
// @from(Ln 446337, Col 4)
gO7 = L(() => {
    o6();
    g6();
    NK();
    yd();
    iy8();
    RM();
    B1();
    zf();
    u7();
    K_8();
    $q = K6(P6(), 1);
    le = {
        keyCase: "lower",
        modSep: " + "
    }
})
// @from(Ln 446355, Col 0)
function _BK() {
    let q = s(8),
        {
            rows: K
        } = s1(),
        _ = K < vbY,
        z = _ ? 0 : 1,
        Y = _ ? 0 : 1,
        A;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) A = FM.createElement(u, {
        flexShrink: 0
    }, FM.createElement(T, null, "Claude understands your codebase, makes edits with your permission, and executes commands — right from your terminal.")), q[0] = A;
    else A = q[0];
    let O;
    if (q[1] !== _) O = !_ && FM.createElement(u, null, FM.createElement(T, {
        dimColor: !0
    }, "New here? Run ", FM.createElement(T, {
        color: "suggestion"
    }, "/powerup"), " to learn the features most people miss.")), q[1] = _, q[2] = O;
    else O = q[2];
    let w;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) w = FM.createElement(u, {
        flexDirection: "column"
    }, FM.createElement(u, {
        flexShrink: 0
    }, FM.createElement(T, {
        bold: !0
    }, "Shortcuts")), FM.createElement(Vi8, {
        gap: 2,
        fixedWidth: !0
    })), q[3] = w;
    else w = q[3];
    let $;
    if (q[4] !== z || q[5] !== Y || q[6] !== O) $ = FM.createElement(u, {
        flexDirection: "column",
        paddingY: z,
        gap: Y
    }, A, O, w), q[4] = z, q[5] = Y, q[6] = O, q[7] = $;
    else $ = q[7];
    return $
}
// @from(Ln 446396, Col 4)
FM
// @from(Ln 446396, Col 8)
vbY = 44
// @from(Ln 446397, Col 4)
zBK = L(() => {
    o6();
    I4();
    g6();
    gO7();
    FM = K6(P6(), 1)
})
// @from(Ln 446405, Col 0)
function YBK(q) {
    let K = s(47),
        {
            onClose: _,
            commands: z
        } = q,
        {
            rows: Y,
            columns: A
        } = s1(),
        O = Math.floor(Y / 2),
        w = Y >= TbY,
        $ = bP(),
        j;
    if (K[0] !== _) j = () => _("Help dialog dismissed", {
        display: "system"
    }), K[0] = _, K[1] = j;
    else j = K[1];
    let H = j,
        J;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) J = {
        context: "Help"
    }, K[2] = J;
    else J = K[2];
    G1("help:dismiss", H, J);
    let X = $3(H),
        M = V3("help:dismiss", "Help", "esc"),
        P, W, D;
    if (K[3] !== z) {
        let x = UF();
        W = z.filter((m) => x.has(m.name) && !m.isHidden);
        let B;
        if (K[7] === Symbol.for("react.memo_cache_sentinel")) B = [], K[7] = B;
        else B = K[7];
        P = B, D = z.filter((m) => !x.has(m.name) && !m.isHidden), K[3] = z, K[4] = P, K[5] = W, K[6] = D
    } else P = K[4], W = K[5], D = K[6];
    let Z = D,
        G;
    if (K[8] === Symbol.for("react.memo_cache_sentinel")) G = c_.createElement($O, {
        key: "general",
        title: "general"
    }, c_.createElement(_BK, null)), K[8] = G;
    else G = K[8];
    let f;
    if (K[9] !== P || K[10] !== W || K[11] !== H || K[12] !== A || K[13] !== Z || K[14] !== O) {
        f = [G];
        let x;
        if (K[16] !== W || K[17] !== H || K[18] !== A || K[19] !== O) x = c_.createElement($O, {
            key: "commands",
            title: "commands"
        }, c_.createElement(FO7, {
            commands: W,
            maxHeight: O,
            columns: A,
            title: "Browse default commands:",
            onCancel: H
        })), K[16] = W, K[17] = H, K[18] = A, K[19] = O, K[20] = x;
        else x = K[20];
        f.push(x);
        let B;
        if (K[21] !== H || K[22] !== A || K[23] !== Z || K[24] !== O) B = c_.createElement($O, {
            key: "custom",
            title: "custom-commands"
        }, c_.createElement(FO7, {
            commands: Z,
            maxHeight: O,
            columns: A,
            title: "Browse custom commands:",
            emptyMessage: "No custom commands found",
            onCancel: H
        })), K[21] = H, K[22] = A, K[23] = Z, K[24] = O, K[25] = B;
        else B = K[25];
        f.push(B), K[9] = P, K[10] = W, K[11] = H, K[12] = A, K[13] = Z, K[14] = O, K[15] = f
    } else f = K[15];
    let v = $ ? void 0 : O,
        V;
    if (K[31] !== f) V = c_.createElement(JL, {
        title: `Claude Code v${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}`,
        color: "professionalBlue",
        defaultTab: "general"
    }, f), K[31] = f, K[32] = V;
    else V = K[32];
    let k;
    if (K[33] === Symbol.for("react.memo_cache_sentinel")) k = c_.createElement(u, {
        marginTop: 1,
        flexShrink: 0
    }, c_.createElement(T, null, "For more help:", " ", c_.createElement(yq, {
        url: "https://code.claude.com/docs/en/overview"
    }))), K[33] = k;
    else k = K[33];
    let N;
    if (K[34] !== w) N = w && c_.createElement(u, {
        marginTop: 1,
        flexShrink: 0
    }, c_.createElement(T, {
        dimColor: !0
    }, "Something else? Use /feedback to report bugs or request features.")), K[34] = w, K[35] = N;
    else N = K[35];
    let R;
    if (K[36] !== M || K[37] !== X.keyName || K[38] !== X.pending) R = c_.createElement(u, {
        marginTop: 1,
        flexShrink: 0
    }, c_.createElement(T, {
        dimColor: !0
    }, X.pending ? c_.createElement(c_.Fragment, null, "Press ", X.keyName, " again to exit") : c_.createElement(T, {
        italic: !0
    }, M, " to cancel"))), K[36] = M, K[37] = X.keyName, K[38] = X.pending, K[39] = R;
    else R = K[39];
    let h;
    if (K[40] !== V || K[41] !== N || K[42] !== R) h = c_.createElement(A_, {
        color: "professionalBlue"
    }, V, k, N, R), K[40] = V, K[41] = N, K[42] = R, K[43] = h;
    else h = K[43];
    let C;
    if (K[44] !== h || K[45] !== v) C = c_.createElement(u, {
        flexDirection: "column",
        height: v
    }, h), K[44] = h, K[45] = v, K[46] = C;
    else C = K[46];
    return C
}
// @from(Ln 446526, Col 4)
c_
// @from(Ln 446526, Col 8)
TbY = 44
// @from(Ln 446527, Col 4)
ABK = L(() => {
    o6();
    C$();
    RM();
    CA();
    Mk();
    I4();
    g6();
    C7();
    DJ();
    BT();
    smK();
    zBK();
    c_ = K6(P6(), 1)
})
// @from(Ln 446542, Col 4)
OBK = {}
// @from(Ln 446546, Col 4)
UO7
// @from(Ln 446546, Col 9)
VbY = async (q, {
    options: {
        commands: K
    }
}) => {
    return UO7.createElement(YBK, {
        commands: K,
        onClose: q
    })
}
// @from(Ln 446556, Col 4)
wBK = L(() => {
    ABK();
    UO7 = K6(P6(), 1)
})
// @from(Ln 446560, Col 4)
kbY
// @from(Ln 446560, Col 9)
QO7
// @from(Ln 446561, Col 4)
$BK = L(() => {
    kbY = {
        type: "local-jsx",
        name: "help",
        description: "Show help and available commands",
        load: () => Promise.resolve().then(() => (wBK(), OBK))
    }, QO7 = kbY
})
// @from(Ln 446570, Col 0)
function jBK(q) {
    let K = s(9),
        {
            onComplete: _
        } = q,
        z;
    if (K[0] !== _) z = async (H) => {
        let J = H === "yes";
        d8((X) => ({
            ...X,
            autoConnectIde: J,
            hasIdeAutoConnectDialogBeenShown: !0
        })), _()
    }, K[0] = _, K[1] = z;
    else z = K[1];
    let Y = z,
        A;
    if (K[2] === Symbol.for("react.memo_cache_sentinel")) A = [{
        label: "Yes",
        value: "yes"
    }, {
        label: "No",
        value: "no"
    }], K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== Y) w = Vx6.default.createElement(A1, {
        options: O,
        onChange: Y,
        defaultValue: "yes"
    }), K[3] = Y, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) $ = Vx6.default.createElement(T, {
        dimColor: !0
    }, "You can also configure this in /config or with the --ide flag"), K[5] = $;
    else $ = K[5];
    let j;
    if (K[6] !== _ || K[7] !== w) j = Vx6.default.createElement(R1, {
        title: "Do you wish to enable auto-connect to IDE?",
        color: "ide",
        onCancel: _
    }, w, $), K[6] = _, K[7] = w, K[8] = j;
    else j = K[8];
    return j
}
// @from(Ln 446618, Col 0)
function HBK() {
    let q = H8();
    return !q0() && q.autoConnectIde !== !0 && q.hasIdeAutoConnectDialogBeenShown !== !0
}
// @from(Ln 446623, Col 0)
function JBK(q) {
    let K = s(10),
        {
            onComplete: _
        } = q,
        z;
    if (K[0] !== _) z = (J) => {
        let X = J === "yes";
        if (X) d8(NbY);
        _(X)
    }, K[0] = _, K[1] = z;
    else z = K[1];
    let Y = z,
        A;
    if (K[2] !== _) A = () => {
        _(!1)
    }, K[2] = _, K[3] = A;
    else A = K[3];
    let O = A,
        w;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) w = [{
        label: "No",
        value: "no"
    }, {
        label: "Yes",
        value: "yes"
    }], K[4] = w;
    else w = K[4];
    let $ = w,
        j;
    if (K[5] !== Y) j = Vx6.default.createElement(A1, {
        options: $,
        onChange: Y,
        defaultValue: "no"
    }), K[5] = Y, K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== O || K[8] !== j) H = Vx6.default.createElement(R1, {
        title: "Do you wish to disable auto-connect to IDE?",
        subtitle: "You can also configure this in /config",
        onCancel: O,
        color: "ide"
    }, j), K[7] = O, K[8] = j, K[9] = H;
    else H = K[9];
    return H
}
// @from(Ln 446670, Col 0)
function NbY(q) {
    return {
        ...q,
        autoConnectIde: !1
    }
}
// @from(Ln 446677, Col 0)
function XBK() {
    let q = H8();
    return !q0() && q.autoConnectIde === !0
}
// @from(Ln 446681, Col 4)
Vx6
// @from(Ln 446682, Col 4)
MBK = L(() => {
    o6();
    g6();
    h1();
    kj();
    g_();
    S4();
    Vx6 = K6(P6(), 1)
})
// @from(Ln 446691, Col 4)
WBK = {}
// @from(Ln 446698, Col 0)
function EbY(q) {
    let K = s(39),
        {
            availableIDEs: _,
            unavailableIDEs: z,
            selectedIDE: Y,
            onClose: A,
            onSelect: O
        } = q,
        w;
    if (K[0] !== Y?.port) w = Y?.port?.toString() ?? "None", K[0] = Y?.port, K[1] = w;
    else w = K[1];
    let [$, j] = S_.useState(w), [H, J] = S_.useState(!1), [X, M] = S_.useState(!1), P;
    if (K[2] !== _ || K[3] !== O) P = (x) => {
        if (x !== "None" && HBK()) J(!0);
        else if (x === "None" && XBK()) M(!0);
        else O(_.find((B) => B.port === parseInt(x)))
    }, K[2] = _, K[3] = O, K[4] = P;
    else P = K[4];
    let W = P,
        D;
    if (K[5] !== _) D = _.reduce(hbY, {}), K[5] = _, K[6] = D;
    else D = K[6];
    let Z = D,
        G;
    if (K[7] !== _ || K[8] !== Z) {
        let x;
        if (K[10] !== Z) x = (B) => {
            let S = (Z[B.name] || 0) > 1 && B.workspaceFolders.length > 0;
            return {
                label: B.name,
                value: B.port.toString(),
                description: S ? dO7(B.workspaceFolders) : void 0
            }
        }, K[10] = Z, K[11] = x;
        else x = K[11];
        G = _.map(x).concat([{
            label: "None",
            value: "None",
            description: void 0
        }]), K[7] = _, K[8] = Z, K[9] = G
    } else G = K[9];
    let f = G;
    if (H) {
        let x;
        if (K[12] !== W || K[13] !== $) x = S_.default.createElement(jBK, {
            onComplete: () => W($)
        }), K[12] = W, K[13] = $, K[14] = x;
        else x = K[14];
        return x
    }
    if (X) {
        let x;
        if (K[15] !== O) x = S_.default.createElement(JBK, {
            onComplete: () => {
                O(void 0)
            }
        }), K[15] = O, K[16] = x;
        else x = K[16];
        return x
    }
    let v;
    if (K[17] !== _.length) v = _.length === 0 && S_.default.createElement(T, {
        dimColor: !0
    }, Th6() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."), K[17] = _.length, K[18] = v;
    else v = K[18];
    let V;
    if (K[19] !== _.length || K[20] !== W || K[21] !== f || K[22] !== $) V = _.length !== 0 && S_.default.createElement(A1, {
        defaultValue: $,
        defaultFocusValue: $,
        options: f,
        onChange: (x) => {
            j(x), W(x)
        }
    }), K[19] = _.length, K[20] = W, K[21] = f, K[22] = $, K[23] = V;
    else V = K[23];
    let k;
    if (K[24] !== _) k = _.length !== 0 && _.some(LbY) && S_.default.createElement(u, {
        marginTop: 1
    }, S_.default.createElement(T, {
        color: "warning"
    }, "Note: Only one Claude Code instance can be connected to VS Code at a time.")), K[24] = _, K[25] = k;
    else k = K[25];
    let N;
    if (K[26] !== _.length) N = _.length !== 0 && !q0() && S_.default.createElement(u, {
        marginTop: 1
    }, S_.default.createElement(T, {
        dimColor: !0
    }, "Tip: You can enable auto-connect to IDE in /config or with the --ide flag")), K[26] = _.length, K[27] = N;
    else N = K[27];
    let R;
    if (K[28] !== z) R = z.length > 0 && S_.default.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, S_.default.createElement(T, {
        dimColor: !0
    }, "Found ", z.length, " other running IDE(s). However, their workspace/project directories do not match the current cwd."), S_.default.createElement(u, {
        marginTop: 1,
        flexDirection: "column"
    }, z.map(ybY))), K[28] = z, K[29] = R;
    else R = K[29];
    let h;
    if (K[30] !== v || K[31] !== V || K[32] !== k || K[33] !== N || K[34] !== R) h = S_.default.createElement(u, {
        flexDirection: "column"
    }, v, V, k, N, R), K[30] = v, K[31] = V, K[32] = k, K[33] = N, K[34] = R, K[35] = h;
    else h = K[35];
    let C;
    if (K[36] !== A || K[37] !== h) C = S_.default.createElement(R1, {
        title: "Select IDE",
        subtitle: "Connect to an IDE for integrated development features.",
        onCancel: A,
        color: "ide"
    }, h), K[36] = A, K[37] = h, K[38] = C;
    else C = K[38];
    return C
}
// @from(Ln 446816, Col 0)
function ybY(q, K) {
    return S_.default.createElement(u, {
        key: K,
        paddingLeft: 3
    }, S_.default.createElement(T, {
        dimColor: !0
    }, "• ", q.name, ": ", dO7(q.workspaceFolders)))
}
// @from(Ln 446825, Col 0)
function LbY(q) {
    return q.name === "VS Code" || q.name === "Visual Studio Code"
}
// @from(Ln 446829, Col 0)
function hbY(q, K) {
    return q[K.name] = (q[K.name] || 0) + 1, q
}
// @from(Ln 446832, Col 0)
async function RbY(q, K) {
    let _ = K?.ide;
    if (!_ || _.type !== "sse-ide" && _.type !== "ws-ide") return null;
    for (let z of q)
        if (z.url === _.url) return z;
    return null
}
// @from(Ln 446840, Col 0)
function SbY(q) {
    let K = s(18),
        {
            availableIDEs: _,
            onSelectIDE: z,
            onDone: Y
        } = q,
        A;
    if (K[0] !== _[0]?.port) A = _[0]?.port?.toString() ?? "", K[0] = _[0]?.port, K[1] = A;
    else A = K[1];
    let [O, w] = S_.useState(A), $;
    if (K[2] !== _ || K[3] !== z) $ = (Z) => {
        let G = _.find((f) => f.port === parseInt(Z));
        z(G)
    }, K[2] = _, K[3] = z, K[4] = $;
    else $ = K[4];
    let j = $,
        H;
    if (K[5] !== _) H = _.map(CbY), K[5] = _, K[6] = H;
    else H = K[6];
    let J = H,
        X;
    if (K[7] !== Y) X = function() {
        Y("IDE selection cancelled", {
            display: "system"
        })
    }, K[7] = Y, K[8] = X;
    else X = K[8];
    let M = X,
        P;
    if (K[9] !== j) P = (Z) => {
        w(Z), j(Z)
    }, K[9] = j, K[10] = P;
    else P = K[10];
    let W;
    if (K[11] !== J || K[12] !== O || K[13] !== P) W = S_.default.createElement(A1, {
        defaultValue: O,
        defaultFocusValue: O,
        options: J,
        onChange: P
    }), K[11] = J, K[12] = O, K[13] = P, K[14] = W;
    else W = K[14];
    let D;
    if (K[15] !== M || K[16] !== W) D = S_.default.createElement(R1, {
        title: "Select an IDE to open the project",
        onCancel: M,
        color: "ide"
    }, W), K[15] = M, K[16] = W, K[17] = D;
    else D = K[17];
    return D
}
// @from(Ln 446892, Col 0)
function CbY(q) {
    return {
        label: q.name,
        value: q.port.toString()
    }
}
// @from(Ln 446899, Col 0)
function bbY(q) {
    let K = s(15),
        {
            runningIDEs: _,
            onSelectIDE: z,
            onDone: Y
        } = q,
        [A, O] = S_.useState(_[0] ?? ""),
        w;
    if (K[0] !== z) w = (D) => {
        z(D)
    }, K[0] = z, K[1] = w;
    else w = K[1];
    let $ = w,
        j;
    if (K[2] !== _) j = _.map(IbY), K[2] = _, K[3] = j;
    else j = K[3];
    let H = j,
        J;
    if (K[4] !== Y) J = function() {
        Y("IDE selection cancelled", {
            display: "system"
        })
    }, K[4] = Y, K[5] = J;
    else J = K[5];
    let X = J,
        M;
    if (K[6] !== $) M = (D) => {
        O(D), $(D)
    }, K[6] = $, K[7] = M;
    else M = K[7];
    let P;
    if (K[8] !== H || K[9] !== A || K[10] !== M) P = S_.default.createElement(A1, {
        defaultFocusValue: A,
        options: H,
        onChange: M
    }), K[8] = H, K[9] = A, K[10] = M, K[11] = P;
    else P = K[11];
    let W;
    if (K[12] !== X || K[13] !== P) W = S_.default.createElement(R1, {
        title: "Select IDE to install extension",
        onCancel: X,
        color: "ide"
    }, P), K[12] = X, K[13] = P, K[14] = W;
    else W = K[14];
    return W
}
// @from(Ln 446947, Col 0)
function IbY(q) {
    return {
        label: kH(q),
        value: q
    }
}
// @from(Ln 446954, Col 0)
function xbY(q) {
    let K = s(4),
        {
            ide: _,
            onInstall: z
        } = q,
        Y, A;
    if (K[0] !== _ || K[1] !== z) Y = () => {
        z(_)
    }, A = [_, z], K[0] = _, K[1] = z, K[2] = Y, K[3] = A;
    else Y = K[2], A = K[3];
    return S_.useEffect(Y, A), null
}