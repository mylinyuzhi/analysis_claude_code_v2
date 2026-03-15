
// @from(Ln 493937, Col 4)
II1 = E(() => {
    UIq = t(P6(), 1)
})
// @from(Ln 493944, Col 0)
function dIq(A) {
    let q = A6(7),
        {
            ideSelection: K,
            mcpClients: Y
        } = A,
        {
            status: z
        } = LV6(Y),
        _ = z === "connected" && (K?.filePath || K?.text && K.lineCount > 0);
    if (z === null || !_ || !K) return null;
    if (K.text && K.lineCount > 0) {
        let w = K.lineCount === 1 ? "line" : "lines",
            O;
        if (q[0] !== K.lineCount || q[1] !== w) O = fa6.createElement(T, {
            color: "ide",
            key: "selection-indicator",
            wrap: "truncate"
        }, "⧉ ", K.lineCount, " ", w, " selected"), q[0] = K.lineCount, q[1] = w, q[2] = O;
        else O = q[2];
        return O
    }
    if (K.filePath) {
        let w;
        if (q[3] !== K.filePath) w = UWz(K.filePath), q[3] = K.filePath, q[4] = w;
        else w = q[4];
        let O;
        if (q[5] !== w) O = fa6.createElement(T, {
            color: "ide",
            key: "selection-indicator",
            wrap: "truncate"
        }, "⧉ In ", w), q[5] = w, q[6] = O;
        else O = q[6];
        return O
    }
}
// @from(Ln 493980, Col 4)
fa6
// @from(Ln 493981, Col 4)
cIq = E(() => {
    e6();
    i6();
    II1();
    fa6 = t(P6(), 1)
})
// @from(Ln 493988, Col 0)
function iIq() {
    let [A, q] = lIq.useState(null);
    return OX(() => {
        let K = process.memoryUsage().heapUsed,
            Y = K >= cWz ? "critical" : K >= dWz ? "high" : "normal";
        q((z) => {
            if (Y === "normal") return z === null ? z : null;
            return {
                heapUsed: K,
                status: Y
            }
        })
    }, 1e4), A
}
// @from(Ln 494002, Col 4)
lIq
// @from(Ln 494002, Col 9)
dWz = 1610612736
// @from(Ln 494003, Col 4)
cWz = 2684354560
// @from(Ln 494004, Col 4)
nIq = E(() => {
    Pv();
    lIq = t(P6(), 1)
})
// @from(Ln 494009, Col 0)
function rIq() {
    return null
}
// @from(Ln 494012, Col 4)
Ta6
// @from(Ln 494013, Col 4)
oIq = E(() => {
    i6();
    nIq();
    Z7();
    Ta6 = t(P6(), 1)
})
// @from(Ln 494020, Col 0)
function aIq() {
    let A = A6(6),
        [q, K] = RV6.useState(0),
        Y = RV6.useRef(null),
        z = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        _, w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) _ = () => {
        if (!vA.isSandboxingEnabled()) return;
        let H = vA.getSandboxViolationStore(),
            j = H.getTotalCount(),
            J = H.subscribe(() => {
                let M = H.getTotalCount(),
                    D = M - j;
                if (D > 0) {
                    if (K(D), j = M, Y.current) clearTimeout(Y.current);
                    Y.current = setTimeout(K, 5000, 0)
                }
            });
        return () => {
            if (J(), Y.current) clearTimeout(Y.current)
        }
    }, w = [], A[0] = _, A[1] = w;
    else _ = A[0], w = A[1];
    if (RV6.useEffect(_, w), !vA.isSandboxingEnabled() || q === 0) return null;
    let O = q === 1 ? "operation" : "operations",
        $;
    if (A[2] !== z || A[3] !== q || A[4] !== O) $ = va6.createElement(m, {
        paddingX: 0,
        paddingY: 0
    }, va6.createElement(T, {
        color: "inactive",
        wrap: "truncate"
    }, "⧈ Sandbox blocked ", q, " ", O, " ·", " ", z, " for details · /sandbox to disable")), A[2] = z, A[3] = q, A[4] = O, A[5] = $;
    else $ = A[5];
    return $
}
// @from(Ln 494056, Col 4)
va6
// @from(Ln 494056, Col 9)
RV6
// @from(Ln 494057, Col 4)
sIq = E(() => {
    e6();
    i6();
    Lz();
    Rj();
    va6 = t(P6(), 1), RV6 = t(P6(), 1)
})
// @from(Ln 494064, Col 4)
tIq = {}
// @from(Ln 494070, Col 0)
function oWz(A) {
    let q = A6(2),
        K;
    if (q[0] !== A) K = KT.createElement(aWz, {
        ...A
    }), q[0] = A, q[1] = K;
    else K = q[1];
    return K
}
// @from(Ln 494080, Col 0)
function aWz(A) {
    let q = A6(2),
        {
            voiceState: K
        } = A;
    switch (K) {
        case "recording": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = KT.createElement(T, {
                dimColor: !0
            }, "listening…"), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "processing": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = KT.createElement(sWz, null), q[1] = Y;
            else Y = q[1];
            return Y
        }
        case "idle":
            return null
    }
}
// @from(Ln 494105, Col 0)
function rs8() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = KT.createElement(T, {
        dimColor: !0
    }, "keep holding…"), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 494115, Col 0)
function sWz() {
    let A = A6(8),
        K = Kj().prefersReducedMotion ?? !1,
        [Y, z] = gJ(K ? null : 50);
    if (K) {
        let J;
        if (A[0] === Symbol.for("react.memo_cache_sentinel")) J = KT.createElement(T, {
            color: "warning"
        }, "Voice: processing…"), A[0] = J;
        else J = A[0];
        return J
    }
    let _ = z / 1000,
        w = (Math.sin(_ * Math.PI * 2 / rWz) + 1) / 2,
        O;
    if (A[1] !== w) O = ok(sI(iWz, nWz, w)), A[1] = w, A[2] = O;
    else O = A[2];
    let $ = O,
        H;
    if (A[3] !== $) H = KT.createElement(T, {
        color: $
    }, "Voice: processing…"), A[3] = $, A[4] = H;
    else H = A[4];
    let j;
    if (A[5] !== Y || A[6] !== H) j = KT.createElement(m, {
        ref: Y
    }, H), A[5] = Y, A[6] = H, A[7] = j;
    else j = A[7];
    return j
}
// @from(Ln 494145, Col 4)
KT
// @from(Ln 494145, Col 8)
iWz
// @from(Ln 494145, Col 13)
nWz
// @from(Ln 494145, Col 18)
rWz = 2
// @from(Ln 494146, Col 4)
os8 = E(() => {
    e6();
    i6();
    Vc();
    nI();
    KT = t(P6(), 1), iWz = {
        r: 153,
        g: 153,
        b: 153
    }, nWz = {
        r: 185,
        g: 185,
        b: 185
    }
})
// @from(Ln 494162, Col 0)
function Abq(A) {
    let q = A6(28),
        {
            apiKeyStatus: K,
            autoUpdaterResult: Y,
            debug: z,
            isAutoUpdating: _,
            verbose: w,
            messages: O,
            onAutoUpdaterResult: $,
            onChangeIsUpdating: H,
            ideSelection: j,
            mcpClients: J,
            isInputWrapped: M,
            isNarrow: D
        } = A,
        X = M === void 0 ? !1 : M,
        P = D === void 0 ? !1 : D,
        W;
    if (q[0] !== O) {
        let X6 = fN(O);
        W = Ck(X6), q[0] = O, q[1] = W
    } else W = q[1];
    let Z = W,
        G;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) G = cK(), q[2] = G;
    else G = q[2];
    let f = G,
        v = pIq(Z, f),
        {
            status: N
        } = LV6(J),
        V = M1(eWz),
        {
            addNotification: L,
            removeNotification: h
        } = o4(),
        R = j66(),
        I = !(N === "connected" && (j?.filePath || j?.text && j.lineCount > 0)) || _ || Y?.status !== "success",
        g = R.isUsingOverage,
        B;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) B = CK(), q[3] = B;
    else B = q[3];
    let b = B,
        p = b === "team" || b === "enterprise",
        Q;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) Q = vh(), q[4] = Q;
    else Q = q[4];
    let U = Q,
        r = X && !v && K !== "invalid" && K !== "missing" && U !== void 0,
        e, Y6;
    if (q[5] !== L || q[6] !== h || q[7] !== r) e = () => {
        if (r && U) d("tengu_external_editor_hint_shown", {}), L({
            key: "external-editor-hint",
            jsx: mq.createElement(T, {
                dimColor: !0
            }, mq.createElement(O8, {
                action: "chat:externalEditor",
                context: "Chat",
                fallback: "ctrl+g",
                description: `edit in ${Y$(U)}`
            })),
            priority: "immediate",
            timeoutMs: 5000
        });
        else h("external-editor-hint")
    }, Y6 = [r, U, L, h], q[5] = L, q[6] = h, q[7] = r, q[8] = e, q[9] = Y6;
    else e = q[8], Y6 = q[9];
    eIq.useEffect(e, Y6);
    let H6 = P ? "flex-start" : "flex-end",
        J6 = g ?? !1,
        K6;
    if (q[10] !== K || q[11] !== Y || q[12] !== z || q[13] !== j || q[14] !== _ || q[15] !== v || q[16] !== J || q[17] !== V || q[18] !== $ || q[19] !== H || q[20] !== I || q[21] !== J6 || q[22] !== Z || q[23] !== w) K6 = mq.createElement(AZz, {
        ideSelection: j,
        mcpClients: J,
        notifications: V,
        isInOverageMode: J6,
        isTeamOrEnterprise: p,
        apiKeyStatus: K,
        debug: z,
        verbose: w,
        tokenUsage: Z,
        mainLoopModel: f,
        shouldShowAutoUpdater: I,
        autoUpdaterResult: Y,
        isAutoUpdating: _,
        isShowingCompactMessage: v,
        onAutoUpdaterResult: $,
        onChangeIsUpdating: H
    }), q[10] = K, q[11] = Y, q[12] = z, q[13] = j, q[14] = _, q[15] = v, q[16] = J, q[17] = V, q[18] = $, q[19] = H, q[20] = I, q[21] = J6, q[22] = Z, q[23] = w, q[24] = K6;
    else K6 = q[24];
    let s;
    if (q[25] !== K6 || q[26] !== H6) s = mq.createElement(y96, null, mq.createElement(m, {
        flexDirection: "column",
        alignItems: H6,
        flexShrink: 0,
        overflowX: "hidden"
    }, K6)), q[25] = K6, q[26] = H6, q[27] = s;
    else s = q[27];
    return s
}
// @from(Ln 494264, Col 0)
function eWz(A) {
    return A.notifications
}
// @from(Ln 494268, Col 0)
function AZz({
    ideSelection: A,
    mcpClients: q,
    notifications: K,
    isInOverageMode: Y,
    isTeamOrEnterprise: z,
    apiKeyStatus: _,
    debug: w,
    verbose: O,
    tokenUsage: $,
    mainLoopModel: H,
    shouldShowAutoUpdater: j,
    autoUpdaterResult: J,
    isAutoUpdating: M,
    isShowingCompactMessage: D,
    onAutoUpdaterResult: X,
    onChangeIsUpdating: P
}) {
    let W = M1((v) => v.voiceState) ?? "idle",
        Z = (M1((v) => v.voiceEnabled) ?? !1) && GI(),
        G = M1((v) => v.voiceError) ?? null,
        f = M1((v) => v.isBriefOnly);
    if (Z && (W === "recording" || W === "processing")) return mq.createElement(tWz, {
        voiceState: W
    });
    return mq.createElement(mq.Fragment, null, mq.createElement(dIq, {
        ideSelection: A,
        mcpClients: q
    }), K.current && ("jsx" in K.current ? mq.createElement(T, {
        wrap: "truncate",
        key: K.current.key
    }, K.current.jsx) : mq.createElement(T, {
        color: K.current.color,
        dimColor: !K.current.color,
        wrap: "truncate"
    }, K.current.text)), Y && !z && mq.createElement(m, null, mq.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, "Now using extra usage")), _ === "invalid" && mq.createElement(m, null, mq.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "Not logged in · Run /login")), _ === "missing" && mq.createElement(m, null, mq.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, "Not logged in · Run /login")), w && mq.createElement(m, null, mq.createElement(T, {
        color: "warning",
        wrap: "truncate"
    }, "Debug mode")), _ !== "invalid" && _ !== "missing" && O && mq.createElement(m, null, mq.createElement(T, {
        dimColor: !0,
        wrap: "truncate"
    }, $, " tokens")), !f && mq.createElement(gIq, {
        tokenUsage: $,
        model: H
    }), j && mq.createElement(IIq, {
        verbose: O,
        onAutoUpdaterResult: X,
        autoUpdaterResult: J,
        isUpdating: M,
        onChangeIsUpdating: P,
        showSuccessMessage: !D
    }), Z && G && mq.createElement(m, null, mq.createElement(T, {
        color: "error",
        wrap: "truncate"
    }, G)), mq.createElement(rIq, null), mq.createElement(aIq, null))
}
// @from(Ln 494333, Col 4)
mq
// @from(Ln 494333, Col 8)
eIq
// @from(Ln 494333, Col 13)
tWz
// @from(Ln 494333, Col 18)
bI1 = 5000
// @from(Ln 494334, Col 4)
xI1 = E(() => {
    e6();
    i6();
    bIq();
    MZ1();
    FIq();
    QIq();
    cIq();
    II1();
    NA();
    z4();
    wz();
    oIq();
    Id();
    V1();
    ll();
    Sw();
    AZ();
    JA();
    sIq();
    OK();
    Wc6();
    fA();
    mq = t(P6(), 1), eIq = t(P6(), 1), tWz = (os8(), k4(tIq)).VoiceIndicator
})
// @from(Ln 494359, Col 0)
async function qZz(A, q) {
    let K = Math.ceil(A / qbq) * qbq;
    if (P26 && uI1 >= K && as8 === q) return P26;
    if (P26) await P26;
    uI1 = K, as8 = q, P26 = (async () => {
        let Y = [],
            z = 0;
        for await (let _ of MX1()) {
            if (q) {
                if (PB(_.display) !== q) continue
            }
            if (Y.push(_), z++, z >= uI1) break
        }
        return Y
    })();
    try {
        return await P26
    } finally {
        P26 = null, uI1 = 0, as8 = void 0
    }
}
// @from(Ln 494381, Col 0)
function Kbq(A, q, K, Y, z) {
    let [_, w] = PH.useState(0), [O, $] = PH.useState(void 0), H = PH.useRef(!1), {
        addNotification: j,
        removeNotification: J
    } = o4(), M = PH.useRef([]), D = PH.useRef(void 0), X = PH.useRef(0), P = PH.useRef(void 0), W = PH.useRef(q), Z = PH.useRef(K), G = PH.useRef(z);
    W.current = q, Z.current = K, G.current = z;
    let f = PH.useCallback((u, I, g, B = !1) => {
            A(u, I, g), Y?.(B ? 0 : u.length)
        }, [A, Y]),
        v = PH.useCallback((u, I = !1) => {
            if (!u || !u.display) return;
            let g = PB(u.display),
                B = g === "bash" ? u.display.slice(1) : u.display;
            f(B, g, u.pastedContents ?? {}, I)
        }, [f]),
        N = PH.useCallback(() => {
            j({
                key: "search-history-hint",
                jsx: PH.default.createElement(T, {
                    dimColor: !0
                }, PH.default.createElement(O8, {
                    action: "history:search",
                    context: "Global",
                    fallback: "ctrl+r",
                    description: "search history"
                })),
                priority: "immediate",
                timeoutMs: bI1
            })
        }, [j]),
        V = PH.useCallback(() => {
            let u = X.current;
            X.current++;
            let I = W.current,
                g = Z.current,
                B = G.current;
            if (u === 0) {
                P.current = B === "bash" ? B : void 0;
                let p = I.trim() !== "";
                $(p ? {
                    display: I,
                    pastedContents: g,
                    mode: B
                } : void 0)
            }
            let b = P.current;
            (async () => {
                let p = u + 1;
                if (D.current !== b) M.current = [], D.current = b, X.current = 0;
                if (M.current.length < p) {
                    let U = await qZz(p, b);
                    if (U.length > M.current.length) M.current = U
                }
                if (u >= M.current.length) {
                    X.current--;
                    return
                }
                let Q = u + 1;
                if (w(Q), v(M.current[u], !0), Q >= 2 && !H.current) H.current = !0, N()
            })()
        }, [v, N]),
        L = PH.useCallback(() => {
            let u = X.current;
            if (u > 1) X.current--, w(u - 1), v(M.current[u - 2]);
            else if (u === 1)
                if (X.current = 0, w(0), O) {
                    let I = O.mode;
                    if (I) f(O.display, I, O.pastedContents ?? {});
                    else v(O)
                } else f("", P.current ?? "prompt", {});
            return u <= 0
        }, [O, v, f]),
        h = PH.useCallback(() => {
            $(void 0), w(0), X.current = 0, P.current = void 0, J("search-history-hint"), M.current = [], D.current = void 0
        }, [J]),
        R = PH.useCallback(() => {
            J("search-history-hint")
        }, [J]);
    return {
        historyIndex: _,
        setHistoryIndex: w,
        onHistoryUp: V,
        onHistoryDown: L,
        resetHistory: h,
        dismissSearchHint: R
    }
}
// @from(Ln 494468, Col 4)
PH
// @from(Ln 494468, Col 8)
qbq = 10
// @from(Ln 494469, Col 4)
P26 = null
// @from(Ln 494470, Col 4)
uI1 = 0
// @from(Ln 494471, Col 4)
as8 = void 0
// @from(Ln 494472, Col 4)
Ybq = E(() => {
    i6();
    ZI();
    xI1();
    wz();
    OK();
    PH = t(P6(), 1)
})
// @from(Ln 494481, Col 0)
function YZz(A) {
    if (ss8?.commands === A) return ss8.fuse;
    let q = A.filter((Y) => !Y.isHidden).map((Y) => {
            let z = Y.userFacingName(),
                _ = z.split(KZz).filter(Boolean);
            return {
                descriptionKey: (Y.description ?? "").split(" ").map((w) => OZz(w)).filter(Boolean),
                partKey: _.length > 1 ? _ : void 0,
                commandName: z,
                command: Y,
                aliasKey: Y.aliases
            }
        }),
        K = new Wh(q, {
            includeScore: !0,
            threshold: 0.3,
            location: 0,
            distance: 100,
            keys: [{
                name: "commandName",
                weight: 3
            }, {
                name: "partKey",
                weight: 2
            }, {
                name: "aliasKey",
                weight: 2
            }, {
                name: "descriptionKey",
                weight: 0.5
            }]
        });
    return ss8 = {
        commands: A,
        fuse: K
    }, K
}
// @from(Ln 494519, Col 0)
function zbq(A) {
    return typeof A === "object" && A !== null && "userFacingName" in A && typeof A.userFacingName === "function" && "type" in A
}
// @from(Ln 494523, Col 0)
function BI1(A, q) {
    if (A.startsWith("/")) return null;
    let Y = A.slice(0, q).match(/(?<=\s)\/([a-zA-Z0-9_:-]*)$/);
    if (!Y || Y.index === void 0) return null;
    let z = Y.index,
        w = A.slice(z + 1).match(/^[a-zA-Z0-9_:-]*/),
        O = w ? w[0] : "";
    if (q > z + 1 + O.length) return null;
    return {
        token: "/" + O,
        startPos: z,
        partialCommand: O
    }
}
// @from(Ln 494538, Col 0)
function es8(A, q) {
    if (!A) return null;
    let K = At8("/" + A, q);
    if (K.length === 0) return null;
    let Y = A.toLowerCase();
    for (let z of K) {
        if (!zbq(z.metadata)) continue;
        let _ = z.metadata.userFacingName();
        if (_.toLowerCase().startsWith(Y)) {
            let w = _.slice(A.length);
            if (w) return {
                suffix: w,
                fullCommand: _
            }
        }
    }
    return null
}
// @from(Ln 494557, Col 0)
function ci(A) {
    return A.startsWith("/")
}
// @from(Ln 494561, Col 0)
function zZz(A) {
    if (!ci(A)) return !1;
    if (!A.includes(" ")) return !1;
    if (A.endsWith(" ")) return !1;
    return !0
}
// @from(Ln 494568, Col 0)
function _Zz(A) {
    return `/${A} `
}
// @from(Ln 494572, Col 0)
function mI1(A) {
    let q = A.userFacingName();
    if (A.type === "prompt") {
        if (A.source === "plugin" && A.pluginInfo?.repository) return `${q}:${A.source}:${A.pluginInfo.repository}`;
        return `${q}:${A.source}`
    }
    return `${q}:${A.type}`
}
// @from(Ln 494581, Col 0)
function wZz(A, q) {
    if (!q || q.length === 0 || A === "") return;
    return q.find((K) => K.toLowerCase().startsWith(A))
}
// @from(Ln 494586, Col 0)
function ts8(A, q) {
    let K = A.userFacingName(),
        Y = q ? ` (${q})` : "",
        z = A.type === "prompt" && A.kind === "workflow",
        _ = (z ? A.description : Sv6(A)) + (A.type === "prompt" && A.argNames?.length ? ` (arguments: ${A.argNames.join(", ")})` : "");
    return {
        id: mI1(A),
        displayText: `/${K}${Y}`,
        tag: z ? "workflow" : void 0,
        description: _,
        metadata: A
    }
}
// @from(Ln 494600, Col 0)
function At8(A, q) {
    if (!ci(A)) return [];
    if (zZz(A)) return [];
    let K = A.slice(1).toLowerCase().trim();
    if (K === "") {
        let H = q.filter((f) => !f.isHidden),
            j = [],
            J = H.filter((f) => f.type === "prompt").map((f) => ({
                cmd: f,
                score: ux8(f.userFacingName())
            })).filter((f) => f.score > 0).sort((f, v) => v.score - f.score);
        for (let f of J.slice(0, 5)) j.push(f.cmd);
        let M = new Set(j.map((f) => mI1(f))),
            D = [],
            X = [],
            P = [],
            W = [],
            Z = [];
        H.forEach((f) => {
            if (M.has(mI1(f))) return;
            if (f.type === "local" || f.type === "local-jsx") D.push(f);
            else if (f.type === "prompt" && (f.source === "userSettings" || f.source === "localSettings")) X.push(f);
            else if (f.type === "prompt" && f.source === "projectSettings") P.push(f);
            else if (f.type === "prompt" && f.source === "policySettings") W.push(f);
            else Z.push(f)
        });
        let G = (f, v) => f.userFacingName().localeCompare(v.userFacingName());
        return D.sort(G), X.sort(G), P.sort(G), W.sort(G), Z.sort(G), [...j, ...D, ...X, ...P, ...W, ...Z].map((f) => ts8(f))
    }
    let Y = q.find((H) => H.isHidden && H.userFacingName().toLowerCase() === K);
    if (Y && q.some((H) => !H.isHidden && H.userFacingName().toLowerCase() === K)) Y = void 0;
    let $ = YZz(q).search(K).map((H) => {
        let j = H.item.commandName.toLowerCase(),
            J = H.item.aliasKey?.map((D) => D.toLowerCase()) ?? [],
            M = H.item.command.type === "prompt" ? ux8(H.item.command.userFacingName()) : 0;
        return {
            r: H,
            name: j,
            aliases: J,
            usage: M
        }
    }).sort((H, j) => {
        let J = H.name,
            M = j.name,
            D = H.aliases,
            X = j.aliases,
            P = J === K,
            W = M === K;
        if (P && !W) return -1;
        if (W && !P) return 1;
        let Z = D.some((h) => h === K),
            G = X.some((h) => h === K);
        if (Z && !G) return -1;
        if (G && !Z) return 1;
        let f = J.startsWith(K),
            v = M.startsWith(K);
        if (f && !v) return -1;
        if (v && !f) return 1;
        if (f && v && J.length !== M.length) return J.length - M.length;
        let N = D.find((h) => h.startsWith(K)),
            V = X.find((h) => h.startsWith(K));
        if (N && !V) return -1;
        if (V && !N) return 1;
        if (N && V && N.length !== V.length) return N.length - V.length;
        let L = (H.r.score ?? 0) - (j.r.score ?? 0);
        if (Math.abs(L) > 0.1) return L;
        return j.usage - H.usage
    }).map((H) => {
        let j = H.r.item.command,
            J = wZz(K, j.aliases);
        return ts8(j, J)
    });
    if (Y) {
        let H = mI1(Y);
        if (!$.some((j) => j.id === H)) return [ts8(Y), ...$]
    }
    return $
}
// @from(Ln 494679, Col 0)
function qt8(A, q, K, Y, z, _) {
    let w, O;
    if (typeof A === "string") w = A, O = q ? kf6(w, K) : void 0;
    else {
        if (!zbq(A.metadata)) return;
        w = A.metadata.userFacingName(), O = A.metadata
    }
    let $ = _Zz(w);
    if (Y($), z($.length), q && O) {
        if (O.type !== "prompt" || (O.argNames ?? []).length === 0) _($, !0)
    }
}
// @from(Ln 494692, Col 0)
function OZz(A) {
    return A.toLowerCase().replace(/[^a-z0-9]/g, "")
}
// @from(Ln 494696, Col 0)
function _bq(A) {
    let q = [],
        K = /(^|[\s])(\/[a-zA-Z][a-zA-Z0-9:\-_]*)/g,
        Y = null;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1] ?? "",
            _ = Y[2] ?? "",
            w = Y.index + z.length;
        q.push({
            start: w,
            end: w + _.length
        })
    }
    return q
}
// @from(Ln 494711, Col 4)
KZz
// @from(Ln 494711, Col 9)
ss8 = null
// @from(Ln 494712, Col 4)
Kt8 = E(() => {
    Zy1();
    D$();
    $N1();
    KZz = /[:_-]/g
})
// @from(Ln 494719, Col 0)
function Obq(A) {
    return typeof A === "object" && A !== null && "op" in A && HZz.includes(A.op)
}
// @from(Ln 494723, Col 0)
function wbq(A) {
    if (A.startsWith("$")) return "variable";
    if (A.includes("/") || A.startsWith("~") || A.startsWith(".")) return "file";
    return "command"
}
// @from(Ln 494729, Col 0)
function jZz(A) {
    for (let q = A.length - 1; q >= 0; q--)
        if (typeof A[q] === "string") return {
            token: A[q],
            index: q
        };
    return null
}
// @from(Ln 494738, Col 0)
function JZz(A, q) {
    if (q === 0) return !0;
    let K = A[q - 1];
    return K !== void 0 && Obq(K)
}
// @from(Ln 494744, Col 0)
function MZz(A, q) {
    let K = A.slice(0, q),
        Y = K.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
    if (Y) return {
        prefix: Y[0],
        completionType: "variable"
    };
    let z = Fz(K);
    if (!z.success) {
        let $ = K.split(/\s+/),
            H = $[$.length - 1] || "",
            J = $.length === 1 && !K.includes(" ") ? "command" : wbq(H);
        return {
            prefix: H,
            completionType: J
        }
    }
    let _ = jZz(z.tokens);
    if (!_) {
        let $ = z.tokens[z.tokens.length - 1];
        return {
            prefix: "",
            completionType: $ && Obq($) ? "command" : "command"
        }
    }
    if (K.endsWith(" ")) return {
        prefix: "",
        completionType: "file"
    };
    let w = wbq(_.token);
    if (w === "variable" || w === "file") return {
        prefix: _.token,
        completionType: w
    };
    let O = JZz(z.tokens, _.index) ? "command" : "file";
    return {
        prefix: _.token,
        completionType: O
    }
}
// @from(Ln 494785, Col 0)
function DZz(A, q) {
    if (q === "variable") {
        let K = A.slice(1);
        return `compgen -v ${j4([K])} 2>/dev/null`
    } else if (q === "file") return `compgen -f ${j4([A])} 2>/dev/null | head -${Yt8} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
    else return `compgen -c ${j4([A])} 2>/dev/null`
}
// @from(Ln 494793, Col 0)
function XZz(A, q) {
    if (q === "variable") {
        let K = A.slice(1);
        return `print -rl -- \${(k)parameters[(I)${j4([K])}*]} 2>/dev/null`
    } else if (q === "file") return `for f in ${j4([A])}*(N[1,${Yt8}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
    else return `print -rl -- \${(k)commands[(I)${j4([A])}*]} 2>/dev/null`
}
// @from(Ln 494800, Col 0)
async function PZz(A, q, K, Y) {
    let z;
    if (A === "bash") z = DZz(q, K);
    else if (A === "zsh") z = XZz(q, K);
    else return [];
    return (await (await HP1(z, Y, "bash", {
        timeout: $Zz
    })).result).stdout.split(`
`).filter((O) => O.trim()).slice(0, Yt8).map((O) => ({
        id: O,
        displayText: O,
        description: void 0,
        metadata: {
            completionType: K
        }
    }))
}
// @from(Ln 494817, Col 0)
async function $bq(A, q, K) {
    let Y = Kf6();
    if (Y !== "bash" && Y !== "zsh") return [];
    try {
        let {
            prefix: z,
            completionType: _
        } = MZz(A, q);
        if (!z) return [];
        return (await PZz(Y, z, _, K)).map((O) => ({
            ...O,
            metadata: {
                ...O.metadata,
                inputSnapshot: A
            }
        }))
    } catch (z) {
        return k(`Shell completion failed: ${z}`), []
    }
}
// @from(Ln 494837, Col 4)
Yt8 = 15
// @from(Ln 494838, Col 4)
$Zz = 1000
// @from(Ln 494839, Col 4)
HZz
// @from(Ln 494840, Col 4)
Hbq = E(() => {
    yY6();
    WR();
    H1();
    RJ();
    HZz = ["|", "||", "&&", ";"]
})
// @from(Ln 494847, Col 0)
async function ZZz() {
    let A = Date.now();
    if (zt8 && A - jbq < WZz) return zt8;
    let q = [],
        K = new Set;
    try {
        for await (let Y of MX1()) {
            if (Y.display && Y.display.startsWith("!")) {
                let z = Y.display.slice(1).trim();
                if (z && !K.has(z)) K.add(z), q.push(z)
            }
            if (q.length >= 50) break
        }
    } catch (Y) {
        k(`Failed to read shell history: ${Y}`)
    }
    return zt8 = q, jbq = A, q
}
// @from(Ln 494865, Col 0)
async function Jbq(A) {
    if (!A || A.length < 2) return null;
    if (!A.trim()) return null;
    let K = await ZZz();
    for (let Y of K)
        if (Y.startsWith(A) && Y !== A) return {
            fullCommand: Y,
            suffix: Y.slice(A.length)
        };
    return null
}
// @from(Ln 494876, Col 4)
zt8 = null
// @from(Ln 494877, Col 4)
jbq = 0
// @from(Ln 494878, Col 4)
WZz = 60000
// @from(Ln 494879, Col 4)
Mbq = E(() => {
    ZI();
    H1()
})
// @from(Ln 494885, Col 0)
function Dbq(A) {
    switch (A.type) {
        case "file":
            return {
                id: `file-${A.path}`, displayText: A.displayText, description: A.description
            };
        case "mcp_resource":
            return {
                id: `mcp-resource-${A.server}__${A.uri}`, displayText: A.displayText, description: A.description
            };
        case "agent":
            return {
                id: `agent-${A.agentType}`, displayText: A.displayText, description: A.description, color: A.color
            }
    }
}
// @from(Ln 494902, Col 0)
function Pbq(A) {
    return jq(A, GZz)
}
// @from(Ln 494906, Col 0)
function fZz(A, q, K = !1) {
    if (!q && !K) return [];
    try {
        let Y = A.map((_) => ({
            type: "agent",
            displayText: `${_.agentType} (agent)`,
            description: Pbq(_.whenToUse),
            agentType: _.agentType,
            color: s36(_.agentType)
        }));
        if (!q) return Y;
        let z = q.toLowerCase();
        return Y.filter((_) => _.agentType.toLowerCase().includes(z) || _.displayText.toLowerCase().includes(z))
    } catch (Y) {
        return _6(Y), []
    }
}
// @from(Ln 494923, Col 0)
async function wt8(A, q, K, Y = !1) {
    if (!A && !Y) return [];
    let [z, _] = await Promise.all([TQ8(A, Y), Promise.resolve(fZz(K, A, Y))]), w = z.map((j) => ({
        type: "file",
        displayText: j.displayText,
        description: j.description,
        path: j.displayText,
        filename: Xbq.basename(j.displayText),
        score: j.metadata?.score
    })), O = Object.values(q).flat().map((j) => ({
        type: "mcp_resource",
        displayText: `${j.server}:${j.uri}`,
        description: Pbq(j.description || j.name || j.uri),
        server: j.server,
        uri: j.uri,
        name: j.name || j.uri
    }));
    if (!A) return [...w, ...O, ..._].slice(0, _t8).map(Dbq);
    let $ = [...O, ..._],
        H = [];
    for (let j of w) H.push({
        source: j,
        score: j.score ?? 0.5
    });
    if ($.length > 0) {
        let J = new Wh($, {
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
            }]
        }).search(A, {
            limit: _t8
        });
        for (let M of J) H.push({
            source: M.item,
            score: M.score ?? 0.5
        })
    }
    return H.sort((j, J) => j.score - J.score), H.slice(0, _t8).map((j) => j.source).map(Dbq)
}
// @from(Ln 494977, Col 4)
_t8 = 15
// @from(Ln 494978, Col 4)
GZz = 60
// @from(Ln 494979, Col 4)
Wbq = E(() => {
    Zy1();
    H0();
    M4();
    k1();
    ii6()
})
// @from(Ln 494987, Col 0)
function gI1(A) {
    return typeof A === "object" && A !== null && "type" in A && (A.type === "directory" || A.type === "file")
}
// @from(Ln 494991, Col 0)
function hV6(A, q, K) {
    if (K.length === 0) return -1;
    if (q < 0) return 0;
    let Y = A[q];
    if (!Y) return 0;
    let z = K.findIndex((_) => _.id === Y.id);
    return z >= 0 ? z : 0
}
// @from(Ln 495000, Col 0)
function Gbq(A) {
    let q = A.metadata;
    return q?.sessionId ? `/resume ${q.sessionId}` : `/resume ${A.displayText}`
}
// @from(Ln 495005, Col 0)
function fbq(A) {
    if (A.isQuoted) return A.token.slice(2).replace(/"$/, "");
    else if (A.token.startsWith("@")) return A.token.substring(1);
    else return A.token
}
// @from(Ln 495011, Col 0)
function Ot8(A) {
    let {
        displayText: q,
        mode: K,
        hasAtPrefix: Y,
        needsQuotes: z,
        isQuoted: _,
        isComplete: w
    } = A, O = w ? " " : "";
    if (_ || z) return K === "bash" ? `"${q}"${O}` : `@"${q}"${O}`;
    else if (Y) return K === "bash" ? `${q}${O}` : `@${q}${O}`;
    else return q
}
// @from(Ln 495025, Col 0)
function $t8(A, q, K, Y, z, _) {
    let $ = q.slice(0, K).lastIndexOf(" ") + 1,
        H;
    if (_ === "variable") H = "$" + A.displayText + " ";
    else if (_ === "command") H = A.displayText + " ";
    else H = A.displayText;
    let j = q.slice(0, $) + H + q.slice(K);
    Y(j), z($ + H.length)
}
// @from(Ln 495034, Col 0)
async function kZz(A, q) {
    try {
        if (FI1) FI1.abort();
        return FI1 = new AbortController, await $bq(A, q, FI1.signal)
    } catch {
        return d("tengu_shell_completion_failed", {}), []
    }
}
// @from(Ln 495043, Col 0)
function Tbq(A, q, K, Y, z) {
    let _ = z ? "/" : " ",
        w = A.slice(0, K),
        O = A.slice(K + Y),
        $ = "@" + q + _;
    return {
        newInput: w + $ + O,
        cursorPos: w.length + $.length
    }
}
// @from(Ln 495054, Col 0)
function li(A, q, K = !1) {
    if (!A) return null;
    let Y = A.substring(0, q);
    if (K) {
        let H = /@"([^"]*)"?$/,
            j = Y.match(H);
        if (j && j.index !== void 0) {
            let M = A.substring(q).match(/^[^"]*"?/),
                D = M ? M[0] : "";
            return {
                token: j[0] + D,
                startPos: j.index,
                isQuoted: !0
            }
        }
    }
    if (K) {
        let H = Y.lastIndexOf("@");
        if (H >= 0 && (H === 0 || /\s/.test(Y[H - 1]))) {
            let j = Y.substring(H),
                J = j.match(TZz);
            if (J && J[0].length === j.length) {
                let D = A.substring(q).match(Zbq),
                    X = D ? D[0] : "";
                return {
                    token: J[0] + X,
                    startPos: H,
                    isQuoted: !1
                }
            }
        }
    }
    let z = K ? vZz : NZz,
        _ = Y.match(z);
    if (!_ || _.index === void 0) return null;
    let O = A.substring(q).match(Zbq),
        $ = O ? O[0] : "";
    return {
        token: _[0] + $,
        startPos: _.index,
        isQuoted: !1
    }
}
// @from(Ln 495098, Col 0)
function EZz(A) {
    if (ci(A)) {
        let q = A.indexOf(" ");
        if (q === -1) return {
            commandName: A.slice(1),
            args: ""
        };
        return {
            commandName: A.slice(1, q),
            args: A.slice(q + 1)
        }
    }
    return null
}
// @from(Ln 495113, Col 0)
function vbq(A, q) {
    return !A && q.includes(" ") && !q.endsWith(" ")
}
// @from(Ln 495117, Col 0)
function Nbq({
    commands: A,
    onInputChange: q,
    onSubmit: K,
    setCursorOffset: Y,
    input: z,
    cursorOffset: _,
    mode: w,
    agents: O,
    setSuggestionsState: $,
    suggestionsState: {
        suggestions: H,
        selectedSuggestion: j,
        commandArgumentHint: J
    },
    suppressSuggestions: M = !1,
    markAccepted: D
}) {
    let {
        addNotification: X
    } = o4(), P = Rq("chat:thinkingToggle", "Chat", "alt+t"), [W, Z] = k2.useState("none"), G = k2.useMemo(() => {
        let l = A.filter((w6) => !w6.isHidden);
        if (l.length === 0) return;
        return Math.max(...l.map((w6) => w6.userFacingName().length)) + 6
    }, [A]), [f, v] = k2.useState(void 0), N = M1((l) => l.mcp.resources), V = S5(), L = M1((l) => l.promptSuggestion), h = Wv(), [R, u] = k2.useState(void 0), I = k2.useMemo(() => {
        if (w !== "prompt" || M) return;
        let l = BI1(z, _);
        if (!l) return;
        let q6 = es8(l.partialCommand, A);
        if (!q6) return;
        return {
            text: q6.suffix,
            fullCommand: q6.fullCommand,
            insertPosition: l.startPos + 1 + l.partialCommand.length
        }
    }, [z, _, w, A, M]), g = M ? void 0 : w === "prompt" ? I : R, B = k2.useRef(_);
    B.current = _;
    let b = k2.useRef(null),
        p = k2.useRef(""),
        Q = k2.useRef(""),
        U = k2.useRef(""),
        r = k2.useRef(H);
    r.current = H;
    let e = k2.useRef(null),
        Y6 = k2.useCallback(() => {
            $(() => ({
                commandArgumentHint: void 0,
                suggestions: [],
                selectedSuggestion: -1
            })), Z("none"), v(void 0), u(void 0)
        }, [$]),
        H6 = k2.useCallback(async (l, q6 = !1) => {
            b.current = l;
            let w6 = await wt8(l, N, O, q6);
            if (b.current !== l) return;
            if (w6.length === 0) {
                $(() => ({
                    commandArgumentHint: void 0,
                    suggestions: [],
                    selectedSuggestion: -1
                })), Z("none"), v(void 0);
                return
            }
            $((O6) => ({
                commandArgumentHint: void 0,
                suggestions: w6,
                selectedSuggestion: hV6(O6.suggestions, O6.selectedSuggestion, w6)
            })), Z(w6.length > 0 ? "file" : "none"), v(void 0)
        }, [N, $, Z, v, O]),
        J6 = CX6(H6, 200),
        K6 = k2.useCallback(async (l, q6) => {
            let w6 = q6 ?? B.current;
            if (M) {
                J6.cancel(), Y6();
                return
            }
            if (w === "prompt") {
                let y6 = BI1(l, w6);
                if (y6) {
                    if (es8(y6.partialCommand, A)) {
                        $(() => ({
                            commandArgumentHint: void 0,
                            suggestions: [],
                            selectedSuggestion: -1
                        })), Z("none"), v(void 0);
                        return
                    }
                }
            }
            if (w === "bash" && l.trim()) {
                U.current = l;
                let y6 = await Jbq(l);
                if (U.current !== l) return;
                if (y6) {
                    u({
                        text: y6.suffix,
                        fullCommand: y6.fullCommand,
                        insertPosition: l.length
                    }), $(() => ({
                        commandArgumentHint: void 0,
                        suggestions: [],
                        selectedSuggestion: -1
                    })), Z("none"), v(void 0);
                    return
                } else u(void 0)
            }
            if (E7()) {
                let y6 = l.substring(0, w6).match(/(^|\s)@([\w-]*)$/),
                    G6 = y6 && V.getState().teamContext;
                if (y6 && G6) {
                    let R6 = y6[2] ?? "",
                        T6 = Object.values(G6.teammates ?? {}).filter((D6) => D6.name !== "team-lead").filter((D6) => D6.name.toLowerCase().startsWith(R6.toLowerCase())).map((D6) => ({
                            id: `dm-${D6.name}`,
                            displayText: `@${D6.name}`,
                            description: "send message"
                        }));
                    if (T6.length > 0) {
                        $((D6) => ({
                            commandArgumentHint: void 0,
                            suggestions: T6,
                            selectedSuggestion: hV6(D6.suggestions, D6.selectedSuggestion, T6)
                        })), Z("agent"), v(void 0);
                        return
                    }
                }
            }
            let O6 = l.substring(0, w6).match(VZz),
                L6 = w6 === l.length && w6 > 0 && l.length > 0 && l[w6 - 1] === " ";
            if (w === "prompt" && ci(l) && w6 > 0) {
                let y6 = EZz(l);
                if (y6 && y6.commandName === "add-dir" && y6.args) {
                    let {
                        args: G6
                    } = y6;
                    if (G6.match(/\s+$/)) {
                        J6.cancel(), Y6();
                        return
                    }
                    let R6 = await My1(G6);
                    if (R6.length > 0) {
                        $((T6) => ({
                            suggestions: R6,
                            selectedSuggestion: hV6(T6.suggestions, T6.selectedSuggestion, R6),
                            commandArgumentHint: void 0
                        })), Z("directory");
                        return
                    }
                    J6.cancel(), Y6();
                    return
                }
                if (y6 && y6.commandName === "resume" && y6.args !== void 0 && l.includes(" ")) {
                    let {
                        args: G6
                    } = y6, T6 = (await GF(G6, {
                        limit: 10
                    })).map((D6) => {
                        let Q6 = n_(D6);
                        return {
                            id: `resume-title-${Q6}`,
                            displayText: D6.customTitle,
                            description: iC6(D6),
                            metadata: {
                                sessionId: Q6
                            }
                        }
                    });
                    if (T6.length > 0) {
                        $((D6) => ({
                            suggestions: T6,
                            selectedSuggestion: hV6(D6.suggestions, D6.selectedSuggestion, T6),
                            commandArgumentHint: void 0
                        })), Z("custom-title");
                        return
                    }
                    Y6();
                    return
                }
            }
            if (w === "prompt" && ci(l) && w6 > 0 && !vbq(L6, l)) {
                let y6 = void 0;
                if (l.length > 1) {
                    let R6 = l.indexOf(" "),
                        T6 = R6 === -1 ? l.slice(1) : l.slice(1, R6),
                        D6 = R6 !== -1 && l.slice(R6 + 1).trim().length > 0,
                        Q6 = R6 !== -1 && l.length === R6 + 1;
                    if (R6 !== -1) {
                        let k6 = A.find((Z6) => Z6.userFacingName() === T6);
                        if (k6 || D6) {
                            if (k6?.argumentHint && Q6) y6 = k6.argumentHint;
                            else if (k6?.type === "prompt" && k6.argNames?.length && l.endsWith(" ")) {
                                let Z6 = l.slice(R6 + 1),
                                    u6 = $V8(Z6);
                                y6 = G94(k6.argNames, u6)
                            }
                            $(() => ({
                                commandArgumentHint: y6,
                                suggestions: [],
                                selectedSuggestion: -1
                            })), Z("none"), v(void 0);
                            return
                        }
                    }
                }
                let G6 = At8(l, A);
                if ($((R6) => {
                        let D6 = R6.suggestions.length !== G6.length || R6.suggestions.some((Q6, k6) => Q6.id !== G6[k6]?.id) ? G6.length > 0 ? 0 : -1 : R6.selectedSuggestion;
                        return {
                            commandArgumentHint: y6,
                            suggestions: G6,
                            selectedSuggestion: D6
                        }
                    }), Z(G6.length > 0 ? "command" : "none"), G6.length > 0) v(G);
                return
            }
            if (W === "command") J6.cancel(), Y6();
            else if (ci(l) && vbq(L6, l)) $((y6) => y6.commandArgumentHint ? {
                ...y6,
                commandArgumentHint: void 0
            } : y6);
            if (W === "custom-title") Y6();
            if (W === "agent" && r.current.some((y6) => y6.id?.startsWith("dm-"))) {
                if (!l.substring(0, w6).match(/(^|\s)@([\w-]*)$/)) Y6()
            }
            if (O6 && w !== "bash") {
                let y6 = li(l, w6, !0);
                if (y6 && y6.token.startsWith("@")) {
                    let G6 = fbq(y6);
                    if (f5q(G6)) {
                        Q.current = G6;
                        let R6 = await T5q(G6, {
                            maxResults: 10
                        });
                        if (Q.current !== G6) return;
                        if (R6.length > 0) {
                            $((T6) => ({
                                suggestions: R6,
                                selectedSuggestion: hV6(T6.suggestions, T6.selectedSuggestion, R6),
                                commandArgumentHint: void 0
                            })), Z("directory");
                            return
                        }
                    }
                    if (b.current === G6) return;
                    J6(G6, !0);
                    return
                }
            }
            if (W === "file") {
                let y6 = li(l, w6, !0);
                if (y6) {
                    let G6 = fbq(y6);
                    if (b.current === G6) return;
                    J6(G6, !1)
                } else J6.cancel(), Y6()
            }
            if (W === "shell") {
                let y6 = r.current[0]?.metadata?.inputSnapshot;
                if (w !== "bash" || l !== y6) J6.cancel(), Y6()
            }
        }, [W, A, $, Y6, J6, w, M, G]);
    k2.useEffect(() => {
        if (e.current === z) return;
        if (p.current !== z) p.current = z, b.current = null;
        e.current = null, K6(z)
    }, [z, K6]);
    let s = k2.useCallback(async () => {
            if (g) {
                if (w === "bash") {
                    q(g.fullCommand), Y(g.fullCommand.length), u(void 0);
                    return
                }
                let l = BI1(z, _);
                if (l) {
                    let q6 = z.slice(0, l.startPos),
                        w6 = z.slice(l.startPos + l.token.length),
                        O6 = q6 + "/" + g.fullCommand + " " + w6,
                        L6 = l.startPos + 1 + g.fullCommand.length + 1;
                    q(O6), Y(L6);
                    return
                }
            }
            if (H.length > 0) {
                J6.cancel();
                let l = j === -1 ? 0 : j,
                    q6 = H[l];
                if (W === "command" && l < H.length) {
                    if (q6) qt8(q6, !1, A, q, Y, K), Y6()
                } else if (W === "custom-title" && H.length > 0) {
                    if (q6) {
                        let w6 = Gbq(q6);
                        q(w6), Y(w6.length), Y6()
                    }
                } else if (W === "directory" && H.length > 0) {
                    let w6 = H[l];
                    if (w6) {
                        let O6 = ci(z),
                            L6;
                        if (O6) {
                            let y6 = z.indexOf(" "),
                                G6 = z.slice(0, y6 + 1),
                                R6 = gI1(w6.metadata) && w6.metadata.type === "directory" ? "/" : " ";
                            if (L6 = G6 + w6.id + R6, q(L6), Y(L6.length), gI1(w6.metadata) && w6.metadata.type === "directory") $((T6) => ({
                                ...T6,
                                commandArgumentHint: void 0
                            })), K6(L6, L6.length);
                            else Y6()
                        } else {
                            let G6 = li(z, _, !0) ?? li(z, _, !1);
                            if (G6) {
                                let R6 = gI1(w6.metadata) && w6.metadata.type === "directory",
                                    T6 = Tbq(z, w6.id, G6.startPos, G6.token.length, R6);
                                if (L6 = T6.newInput, q(L6), Y(T6.cursorPos), R6) $((D6) => ({
                                    ...D6,
                                    commandArgumentHint: void 0
                                })), K6(L6, T6.cursorPos);
                                else Y6()
                            } else Y6()
                        }
                    }
                } else if (W === "shell" && H.length > 0) {
                    let w6 = H[l];
                    if (w6) {
                        let O6 = w6.metadata;
                        $t8(w6, z, _, q, Y, O6?.completionType), Y6()
                    }
                } else if (W === "agent" && H.length > 0 && H[l]?.id?.startsWith("dm-")) {
                    let w6 = H[l];
                    if (w6) {
                        let L6 = z.slice(0, _).match(/(^|\s)@[\w-]*$/);
                        if (L6 && L6.index !== void 0) {
                            let y6 = L6.index + (L6[1]?.length ?? 0),
                                G6 = z.slice(0, y6),
                                R6 = z.slice(_),
                                T6 = G6 + w6.displayText + " " + R6;
                            q(T6), Y(G6.length + w6.displayText.length + 1), Y6()
                        }
                    }
                } else if (W === "file" && H.length > 0) {
                    let w6 = li(z, _, !0);
                    if (!w6) {
                        Y6();
                        return
                    }
                    let O6 = D3q(H),
                        L6 = w6.token.startsWith("@"),
                        y6;
                    if (w6.isQuoted) y6 = w6.token.slice(2).replace(/"$/, "").length;
                    else if (L6) y6 = w6.token.length - 1;
                    else y6 = w6.token.length;
                    if (O6.length > y6) {
                        let G6 = Ot8({
                            displayText: O6,
                            mode: w,
                            hasAtPrefix: L6,
                            needsQuotes: !1,
                            isQuoted: w6.isQuoted,
                            isComplete: !1
                        });
                        vy1(G6, z, w6.token, w6.startPos, q, Y), K6(z.replace(w6.token, G6), _)
                    } else if (l < H.length) {
                        let G6 = H[l];
                        if (G6) {
                            let R6 = G6.displayText.includes(" "),
                                T6 = Ot8({
                                    displayText: G6.displayText,
                                    mode: w,
                                    hasAtPrefix: L6,
                                    needsQuotes: R6,
                                    isQuoted: w6.isQuoted,
                                    isComplete: !0
                                });
                            vy1(T6, z, w6.token, w6.startPos, q, Y), Y6()
                        }
                    }
                }
            } else if (z.trim() !== "") {
                let l, q6;
                if (w === "bash") {
                    l = "shell";
                    let w6 = await kZz(z, _);
                    if (w6.length === 1) {
                        let O6 = w6[0];
                        if (O6) {
                            let L6 = O6.metadata;
                            $t8(O6, z, _, q, Y, L6?.completionType)
                        }
                        q6 = []
                    } else q6 = w6
                } else {
                    l = "file";
                    let w6 = li(z, _, !0);
                    if (w6) {
                        let O6 = w6.token.startsWith("@"),
                            L6 = O6 ? w6.token.substring(1) : w6.token;
                        q6 = await wt8(L6, N, O, O6)
                    } else q6 = []
                }
                if (q6.length > 0) $((w6) => ({
                    commandArgumentHint: void 0,
                    suggestions: q6,
                    selectedSuggestion: hV6(w6.suggestions, w6.selectedSuggestion, q6)
                })), Z(l), v(void 0)
            }
        }, [H, j, z, W, A, w, q, Y, K, Y6, _, K6, N, $, O, J6, g]),
        X6 = k2.useCallback(() => {
            if (j < 0 || H.length === 0) return;
            let l = H[j];
            if (W === "command" && j < H.length) {
                if (l) qt8(l, !0, A, q, Y, K), J6.cancel(), Y6()
            } else if (W === "custom-title" && j < H.length) {
                if (l) {
                    let q6 = Gbq(l);
                    q(q6), Y(q6.length), K(q6, !0), J6.cancel(), Y6()
                }
            } else if (W === "shell" && j < H.length) {
                let q6 = H[j];
                if (q6) {
                    let w6 = q6.metadata;
                    $t8(q6, z, _, q, Y, w6?.completionType), J6.cancel(), Y6()
                }
            } else if (W === "agent" && j < H.length && l?.id?.startsWith("dm-")) {
                let w6 = z.slice(0, _).match(/(^|\s)@[\w-]*$/);
                if (w6 && w6.index !== void 0) {
                    let O6 = w6.index + (w6[1]?.length ?? 0),
                        L6 = z.slice(0, O6),
                        y6 = z.slice(_),
                        G6 = L6 + l.displayText + " " + y6;
                    q(G6), Y(L6.length + l.displayText.length + 1), J6.cancel(), Y6()
                }
            } else if (W === "file" && j < H.length) {
                let q6 = li(z, _, !0);
                if (q6) {
                    if (l) {
                        let w6 = q6.token.startsWith("@"),
                            O6 = l.displayText.includes(" "),
                            L6 = Ot8({
                                displayText: l.displayText,
                                mode: w,
                                hasAtPrefix: w6,
                                needsQuotes: O6,
                                isQuoted: q6.isQuoted,
                                isComplete: !0
                            });
                        vy1(L6, z, q6.token, q6.startPos, q, Y), J6.cancel(), Y6()
                    }
                }
            } else if (W === "directory" && j < H.length) {
                if (l) {
                    if (ci(z)) {
                        J6.cancel(), Y6();
                        return
                    }
                    let w6 = li(z, _, !0) ?? li(z, _, !1);
                    if (w6) {
                        let O6 = gI1(l.metadata) && l.metadata.type === "directory",
                            L6 = Tbq(z, l.id, w6.startPos, w6.token.length, O6);
                        q(L6.newInput), Y(L6.cursorPos)
                    }
                    J6.cancel(), Y6()
                }
            }
        }, [H, j, W, A, z, _, w, q, Y, K, Y6, J6]),
        z6 = k2.useCallback(() => {
            s()
        }, [s]),
        N6 = k2.useCallback(() => {
            J6.cancel(), Y6(), e.current = z
        }, [J6, Y6, z]),
        $6 = k2.useCallback(() => {
            $((l) => ({
                ...l,
                selectedSuggestion: l.selectedSuggestion <= 0 ? H.length - 1 : l.selectedSuggestion - 1
            }))
        }, [H.length, $]),
        n = k2.useCallback(() => {
            $((l) => ({
                ...l,
                selectedSuggestion: l.selectedSuggestion >= H.length - 1 ? 0 : l.selectedSuggestion + 1
            }))
        }, [H.length, $]),
        o = k2.useMemo(() => ({
            "autocomplete:accept": z6,
            "autocomplete:dismiss": N6,
            "autocomplete:previous": $6,
            "autocomplete:next": n
        }), [z6, N6, $6, n]),
        a = H.length > 0 || !!g,
        i = he();
    return oj("autocomplete", a), f$1("Autocomplete", a), tA(o, {
        context: "Autocomplete",
        isActive: a && !i
    }), jA((l, q6, w6) => {
        if (q6.rightArrow) {
            let {
                text: L6,
                shownAt: y6
            } = L;
            if (L6 && y6 > 0 && z === "") {
                D(), q(L6), Y(L6.length), w6.stopImmediatePropagation();
                return
            }
        }
        if (q6.tab && !q6.shift) {
            if (H.length > 0 || g) return;
            let {
                text: L6,
                shownAt: y6
            } = L;
            if (L6 && y6 > 0 && z === "") {
                D(), q(L6), Y(L6.length);
                return
            }
            if (z.trim() === "") X({
                key: "thinking-toggle-hint",
                jsx: Ht8.createElement(T, {
                    dimColor: !0
                }, "Use ", P, " to toggle thinking"),
                priority: "immediate",
                timeoutMs: 3000
            });
            return
        }
        if (H.length === 0) return;
        let O6 = h?.pendingChord != null;
        if (q6.ctrl && l === "n" && !O6) {
            n();
            return
        }
        if (q6.ctrl && l === "p" && !O6) {
            $6();
            return
        }
        if (q6.return) X6()
    }), {
        suggestions: H,
        selectedSuggestion: j,
        suggestionType: W,
        maxColumnWidth: f,
        commandArgumentHint: J,
        inlineGhostText: g
    }
}
// @from(Ln 495659, Col 4)
k2
// @from(Ln 495659, Col 8)
Ht8
// @from(Ln 495659, Col 13)
TZz
// @from(Ln 495659, Col 18)
Zbq
// @from(Ln 495659, Col 23)
vZz
// @from(Ln 495659, Col 28)
NZz
// @from(Ln 495659, Col 33)
VZz
// @from(Ln 495659, Col 38)
FI1 = null
// @from(Ln 495660, Col 4)
Vbq = E(() => {
    i6();
    _7();
    Rm();
    Kt8();
    np8();
    Oq();
    ii6();
    Hbq();
    Mbq();
    Wbq();
    Pv();
    NA();
    V1();
    Rj();
    wz();
    fZ();
    i6();
    M4();
    Qz();
    Wp6();
    k2 = t(P6(), 1), Ht8 = t(P6(), 1), TZz = /^@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*/u, Zbq = /^[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+/u, vZz = /(@[\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+)$/u, NZz = /[\p{L}\p{N}\p{M}_\-./\\()[\]~:]+$/u, VZz = /(^|\s)@([\p{L}\p{N}\p{M}_\-./\\()[\]~:]*|"[^"]*"?)$/u
})
// @from(Ln 495684, Col 0)
function Lbq() {
    return {
        mode: "INSERT",
        insertedText: ""
    }
}
// @from(Ln 495691, Col 0)
function Rbq() {
    return {
        lastChange: null,
        lastFind: null,
        register: "",
        registerIsLinewise: !1
    }
}
// @from(Ln 495699, Col 4)
kbq
// @from(Ln 495699, Col 9)
jt8
// @from(Ln 495699, Col 14)
Jt8
// @from(Ln 495699, Col 19)
Ebq
// @from(Ln 495699, Col 24)
ybq
// @from(Ln 495699, Col 29)
Mt8 = 1e4
// @from(Ln 495700, Col 4)
Dt8 = E(() => {
    kbq = {
        d: "delete",
        c: "change",
        y: "yank"
    }, jt8 = new Set(["h", "l", "j", "k", "w", "b", "e", "W", "B", "E", "0", "^", "$"]), Jt8 = new Set(["f", "F", "t", "T"]), Ebq = {
        i: "inner",
        a: "around"
    }, ybq = new Set(["w", "W", '"', "'", "`", "(", ")", "b", "[", "]", "{", "}", "B", "<", ">"])
})
// @from(Ln 495711, Col 0)
function pI1(A, q, K) {
    let Y = q;
    for (let z = 0; z < K; z++) {
        let _ = yZz(A, Y);
        if (_.equals(Y)) break;
        Y = _
    }
    return Y
}
// @from(Ln 495721, Col 0)
function yZz(A, q) {
    switch (A) {
        case "h":
            return q.left();
        case "l":
            return q.right();
        case "j":
            return q.downLogicalLine();
        case "k":
            return q.upLogicalLine();
        case "w":
            return q.nextVimWord();
        case "b":
            return q.prevVimWord();
        case "e":
            return q.endOfVimWord();
        case "W":
            return q.nextWORD();
        case "B":
            return q.prevWORD();
        case "E":
            return q.endOfWORD();
        case "0":
            return q.startOfLogicalLine();
        case "^":
            return q.firstNonBlankInLogicalLine();
        case "$":
            return q.endOfLogicalLine();
        case "G":
            return q.startOfLastLine();
        default:
            return q
    }
}
// @from(Ln 495756, Col 0)
function hbq(A) {
    return "eE$".includes(A)
}
// @from(Ln 495760, Col 0)
function Sbq(A) {
    return "jkG".includes(A) || A === "gg"
}
// @from(Ln 495764, Col 0)
function Ibq(A, q, K, Y) {
    if (K === "w") return Cbq(A, q, Y, hd);
    if (K === "W") return Cbq(A, q, Y, (_) => !_X1(_));
    let z = LZz[K];
    if (z) {
        let [_, w] = z;
        return _ === w ? RZz(A, q, _, Y) : hZz(A, q, _, w, Y)
    }
    return null
}
// @from(Ln 495775, Col 0)
function Cbq(A, q, K, Y) {
    let z = [];
    for (let {
            segment: D,
            index: X
        }
        of bH().segment(A)) z.push({
        segment: D,
        index: X
    });
    let _ = z.length - 1;
    for (let D = 0; D < z.length; D++) {
        let X = z[D],
            P = D + 1 < z.length ? z[D + 1].index : A.length;
        if (q >= X.index && q < P) {
            _ = D;
            break
        }
    }
    let w = (D) => z[D]?.segment ?? "",
        O = (D) => D < z.length ? z[D].index : A.length,
        $ = (D) => _X1(w(D)),
        H = (D) => Y(w(D)),
        j = (D) => Tt(w(D)),
        J = _,
        M = _;
    if (H(_)) {
        while (J > 0 && H(J - 1)) J--;
        while (M < z.length && H(M)) M++
    } else if ($(_)) {
        while (J > 0 && $(J - 1)) J--;
        while (M < z.length && $(M)) M++;
        return {
            start: O(J),
            end: O(M)
        }
    } else if (j(_)) {
        while (J > 0 && j(J - 1)) J--;
        while (M < z.length && j(M)) M++
    }
    if (!K) {
        if (M < z.length && $(M))
            while (M < z.length && $(M)) M++;
        else if (J > 0 && $(J - 1))
            while (J > 0 && $(J - 1)) J--
    }
    return {
        start: O(J),
        end: O(M)
    }
}
// @from(Ln 495827, Col 0)
function RZz(A, q, K, Y) {
    let z = A.lastIndexOf(`
`, q - 1) + 1,
        _ = A.indexOf(`
`, q),
        w = _ === -1 ? A.length : _,
        O = A.slice(z, w),
        $ = q - z,
        H = [];
    for (let j = 0; j < O.length; j++)
        if (O[j] === K) H.push(j);
    for (let j = 0; j < H.length - 1; j += 2) {
        let J = H[j],
            M = H[j + 1];
        if (J <= $ && $ <= M) return Y ? {
            start: z + J + 1,
            end: z + M
        } : {
            start: z + J,
            end: z + M + 1
        }
    }
    return null
}
// @from(Ln 495852, Col 0)
function hZz(A, q, K, Y, z) {
    let _ = 0,
        w = -1;
    for (let $ = q; $ >= 0; $--)
        if (A[$] === Y && $ !== q) _++;
        else if (A[$] === K) {
        if (_ === 0) {
            w = $;
            break
        }
        _--
    }
    if (w === -1) return null;
    _ = 0;
    let O = -1;
    for (let $ = w + 1; $ < A.length; $++)
        if (A[$] === K) _++;
        else if (A[$] === Y) {
        if (_ === 0) {
            O = $;
            break
        }
        _--
    }
    if (O === -1) return null;
    return z ? {
        start: w + 1,
        end: O
    } : {
        start: w,
        end: O + 1
    }
}
// @from(Ln 495885, Col 4)
LZz
// @from(Ln 495886, Col 4)
bbq = E(() => {
    j36();
    AL();
    LZz = {
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
// @from(Ln 495906, Col 0)
function SV6(A, q, K, Y) {
    let z = pI1(q, Y.cursor, K);
    if (z.equals(Y.cursor)) return;
    let _ = Pt8(Y.cursor, z, q, A, K);
    Va6(A, _.from, _.to, Y, _.linewise), Y.recordChange({
        type: "operator",
        op: A,
        motion: q,
        count: K
    })
}
// @from(Ln 495918, Col 0)
function QI1(A, q, K, Y, z) {
    let _ = z.cursor.findCharacter(K, q, Y);
    if (_ === null) return;
    let w = new RK(z.cursor.measuredText, _),
        O = SZz(z.cursor, w, q);
    Va6(A, O.from, O.to, z), z.setLastFind(q, K), z.recordChange({
        type: "operatorFind",
        op: A,
        find: q,
        char: K,
        count: Y
    })
}
// @from(Ln 495932, Col 0)
function UI1(A, q, K, Y, z) {
    let _ = Ibq(z.text, z.cursor.offset, K, q === "inner");
    if (!_) return;
    Va6(A, _.start, _.end, z), z.recordChange({
        type: "operatorTextObj",
        op: A,
        objType: K,
        scope: q,
        count: Y
    })
}
// @from(Ln 495944, Col 0)
function Xt8(A, q, K) {
    let Y = K.text,
        z = Y.split(`
`),
        _ = Y.slice(0, K.cursor.offset).split(`
`).length - 1,
        w = Math.min(q, z.length - _),
        O = K.cursor.startOfLogicalLine().offset,
        $ = O;
    for (let j = 0; j < w; j++) {
        let J = Y.indexOf(`
`, $);
        $ = J === -1 ? Y.length : J + 1
    }
    let H = Y.slice(O, $);
    if (!H.endsWith(`
`)) H = H + `
`;
    if (K.setRegister(H, !0), A === "yank") K.setOffset(O);
    else if (A === "delete") {
        let j = O,
            J = $;
        if (J === Y.length && j > 0 && Y[j - 1] === `
`) j -= 1;
        let M = Y.slice(0, j) + Y.slice(J);
        K.setText(M || "");
        let D = Math.max(0, M.length - (lQ(M).length || 1));
        K.setOffset(Math.min(j, D))
    } else if (A === "change")
        if (z.length === 1) K.setText(""), K.enterInsert(0);
        else {
            let j = z.slice(0, _),
                J = z.slice(_ + w),
                M = [...j, "", ...J].join(`
`);
            K.setText(M), K.enterInsert(O)
        } K.recordChange({
        type: "operator",
        op: A,
        motion: A[0],
        count: q
    })
}
// @from(Ln 495988, Col 0)
function dI1(A, q) {
    let K = q.cursor.offset;
    if (K >= q.text.length) return;
    let Y = q.cursor;
    for (let $ = 0; $ < A && !Y.isAtEnd(); $++) Y = Y.right();
    let z = Y.offset,
        _ = q.text.slice(K, z),
        w = q.text.slice(0, K) + q.text.slice(z);
    q.setRegister(_, !1), q.setText(w);
    let O = Math.max(0, w.length - (lQ(w).length || 1));
    q.setOffset(Math.min(K, O)), q.recordChange({
        type: "x",
        count: A
    })
}
// @from(Ln 496004, Col 0)
function cI1(A, q, K) {
    let Y = K.cursor.offset,
        z = K.text;
    for (let _ = 0; _ < q && Y < z.length; _++) {
        let w = lC6(z.slice(Y)).length || 1;
        z = z.slice(0, Y) + A + z.slice(Y + w), Y += A.length
    }
    K.setText(z), K.setOffset(Math.max(0, Y - A.length)), K.recordChange({
        type: "replace",
        char: A,
        count: q
    })
}
// @from(Ln 496018, Col 0)
function lI1(A, q) {
    let K = q.cursor.offset;
    if (K >= q.text.length) return;
    let Y = q.text,
        z = K,
        _ = 0;
    while (z < Y.length && _ < A) {
        let w = lC6(Y.slice(z)),
            O = w.length,
            $ = w === w.toUpperCase() ? w.toLowerCase() : w.toUpperCase();
        Y = Y.slice(0, z) + $ + Y.slice(z + O), z += $.length, _++
    }
    q.setText(Y), q.setOffset(z), q.recordChange({
        type: "toggleCase",
        count: A
    })
}
// @from(Ln 496036, Col 0)
function iI1(A, q) {
    let Y = q.text.split(`
`),
        {
            line: z
        } = q.cursor.getPosition();
    if (z >= Y.length - 1) return;
    let _ = Math.min(A, Y.length - z - 1),
        w = Y[z],
        O = w.length;
    for (let j = 1; j <= _; j++) {
        let J = (Y[z + j] ?? "").trimStart();
        if (J.length > 0) {
            if (!w.endsWith(" ") && w.length > 0) w += " ";
            w += J
        }
    }
    let $ = [...Y.slice(0, z), w, ...Y.slice(z + _ + 1)],
        H = $.join(`
`);
    q.setText(H), q.setOffset(rI1($, z) + O), q.recordChange({
        type: "join",
        count: A
    })
}
// @from(Ln 496062, Col 0)
function xbq(A, q, K) {
    let Y = K.getRegister();
    if (!Y) return;
    let z = Y.endsWith(`
`),
        _ = z ? Y.slice(0, -1) : Y;
    if (z) {
        let O = K.text.split(`
`),
            {
                line: $
            } = K.cursor.getPosition(),
            H = A ? $ + 1 : $,
            j = _.split(`
`),
            J = [];
        for (let X = 0; X < q; X++) J.push(...j);
        let M = [...O.slice(0, H), ...J, ...O.slice(H)],
            D = M.join(`
`);
        K.setText(D), K.setOffset(rI1(M, H))
    } else {
        let w = _.repeat(q),
            O = A && K.cursor.offset < K.text.length ? K.cursor.measuredText.nextOffset(K.cursor.offset) : K.cursor.offset,
            $ = K.text.slice(0, O) + w + K.text.slice(O),
            H = lQ(w),
            j = O + w.length - (H.length || 1);
        K.setText($), K.setOffset(Math.max(O, j))
    }
}
// @from(Ln 496093, Col 0)
function nI1(A, q, K) {
    let z = K.text.split(`
`),
        {
            line: _
        } = K.cursor.getPosition(),
        w = Math.min(q, z.length - _),
        O = "  ";
    for (let J = 0; J < w; J++) {
        let M = _ + J,
            D = z[M] ?? "";
        if (A === ">") z[M] = "  " + D;
        else if (D.startsWith("  ")) z[M] = D.slice(2);
        else if (D.startsWith("\t")) z[M] = D.slice(1);
        else {
            let X = 0,
                P = 0;
            while (P < D.length && X < 2 && /\s/.test(D[P])) X++, P++;
            z[M] = D.slice(P)
        }
    }
    let $ = z.join(`
`),
        j = ((z[_] ?? "").match(/^\s*/)?.[0] ?? "").length;
    K.setText($), K.setOffset(rI1(z, _) + j), K.recordChange({
        type: "indent",
        dir: A,
        count: q
    })
}
// @from(Ln 496124, Col 0)
function Na6(A, q) {
    let Y = q.text.split(`
`),
        {
            line: z
        } = q.cursor.getPosition(),
        _ = A === "below" ? z + 1 : z,
        w = [...Y.slice(0, _), "", ...Y.slice(_)],
        O = w.join(`
`);
    q.setText(O), q.enterInsert(rI1(w, _)), q.recordChange({
        type: "openLine",
        direction: A
    })
}
// @from(Ln 496140, Col 0)
function rI1(A, q) {
    return A.slice(0, q).join(`
`).length + (q > 0 ? 1 : 0)
}
// @from(Ln 496145, Col 0)
function Pt8(A, q, K, Y, z) {
    let _ = Math.min(A.offset, q.offset),
        w = Math.max(A.offset, q.offset),
        O = !1;
    if (Y === "change" && (K === "w" || K === "W")) {
        let $ = A;
        for (let j = 0; j < z - 1; j++) $ = K === "w" ? $.nextVimWord() : $.nextWORD();
        let H = K === "w" ? $.endOfVimWord() : $.endOfWORD();
        w = A.measuredText.nextOffset(H.offset)
    } else if (Sbq(K)) {
        O = !0;
        let $ = A.text,
            H = $.indexOf(`
`, w);
        if (H === -1) {
            if (w = $.length, _ > 0 && $[_ - 1] === `
`) _ -= 1
        } else w = H + 1
    } else if (hbq(K) && A.offset <= q.offset) w = A.measuredText.nextOffset(w);
    return {
        from: _,
        to: w,
        linewise: O
    }
}
// @from(Ln 496171, Col 0)
function SZz(A, q, K) {
    let Y = Math.min(A.offset, q.offset),
        z = Math.max(A.offset, q.offset),
        _ = A.measuredText.nextOffset(z);
    return {
        from: Y,
        to: _
    }
}
// @from(Ln 496181, Col 0)
function Va6(A, q, K, Y, z = !1) {
    let _ = Y.text.slice(q, K);
    if (z && !_.endsWith(`
`)) _ = _ + `
`;
    if (Y.setRegister(_, z), A === "yank") Y.setOffset(q);
    else if (A === "delete") {
        let w = Y.text.slice(0, q) + Y.text.slice(K);
        Y.setText(w);
        let O = Math.max(0, w.length - (lQ(w).length || 1));
        Y.setOffset(Math.min(q, O))
    } else if (A === "change") {
        let w = Y.text.slice(0, q) + Y.text.slice(K);
        Y.setText(w), Y.enterInsert(q)
    }
}
// @from(Ln 496198, Col 0)
function ubq(A, q, K) {
    let Y = q === 1 ? K.cursor.startOfLastLine() : K.cursor.goToLine(q);
    if (Y.equals(K.cursor)) return;
    let z = Pt8(K.cursor, Y, "G", A, q);
    Va6(A, z.from, z.to, K, z.linewise), K.recordChange({
        type: "operator",
        op: A,
        motion: "G",
        count: q
    })
}
// @from(Ln 496210, Col 0)
function mbq(A, q, K) {
    let Y = q === 1 ? K.cursor.startOfFirstLine() : K.cursor.goToLine(q);
    if (Y.equals(K.cursor)) return;
    let z = Pt8(K.cursor, Y, "gg", A, q);
    Va6(A, z.from, z.to, K, z.linewise), K.recordChange({
        type: "operator",
        op: A,
        motion: "gg",
        count: q
    })
}
// @from(Ln 496221, Col 4)
Wt8 = E(() => {
    j36();
    AL();
    bbq()
})
// @from(Ln 496227, Col 0)
function Bbq(A, q, K) {
    switch (A.type) {
        case "idle":
            return CZz(q, K);
        case "count":
            return IZz(A, q, K);
        case "operator":
            return bZz(A, q, K);
        case "operatorCount":
            return xZz(A, q, K);
        case "operatorFind":
            return uZz(A, q, K);
        case "operatorTextObj":
            return mZz(A, q, K);
        case "find":
            return BZz(A, q, K);
        case "g":
            return gZz(A, q, K);
        case "operatorG":
            return FZz(A, q, K);
        case "replace":
            return pZz(A, q, K);
        case "indent":
            return QZz(A, q, K)
    }
}
// @from(Ln 496254, Col 0)
function gbq(A, q, K) {
    let Y = kbq[A];
    if (Y) return {
        next: {
            type: "operator",
            op: Y,
            count: q
        }
    };
    if (jt8.has(A)) return {
        execute: () => {
            let z = pI1(A, K.cursor, q);
            K.setOffset(z.offset)
        }
    };
    if (Jt8.has(A)) return {
        next: {
            type: "find",
            find: A,
            count: q
        }
    };
    if (A === "g") return {
        next: {
            type: "g",
            count: q
        }
    };
    if (A === "r") return {
        next: {
            type: "replace",
            count: q
        }
    };
    if (A === ">" || A === "<") return {
        next: {
            type: "indent",
            dir: A,
            count: q
        }
    };
    if (A === "~") return {
        execute: () => lI1(q, K)
    };
    if (A === "x") return {
        execute: () => dI1(q, K)
    };
    if (A === "J") return {
        execute: () => iI1(q, K)
    };
    if (A === "p" || A === "P") return {
        execute: () => xbq(A === "p", q, K)
    };
    if (A === "D") return {
        execute: () => SV6("delete", "$", 1, K)
    };
    if (A === "C") return {
        execute: () => SV6("change", "$", 1, K)
    };
    if (A === "Y") return {
        execute: () => Xt8("yank", q, K)
    };
    if (A === "G") return {
        execute: () => {
            if (q === 1) K.setOffset(K.cursor.startOfLastLine().offset);
            else K.setOffset(K.cursor.goToLine(q).offset)
        }
    };
    if (A === ".") return {
        execute: () => K.onDotRepeat?.()
    };
    if (A === ";" || A === ",") return {
        execute: () => UZz(A === ",", q, K)
    };
    if (A === "u") return {
        execute: () => K.onUndo?.()
    };
    if (A === "i") return {
        execute: () => K.enterInsert(K.cursor.offset)
    };
    if (A === "I") return {
        execute: () => K.enterInsert(K.cursor.firstNonBlankInLogicalLine().offset)
    };
    if (A === "a") return {
        execute: () => {
            let z = K.cursor.isAtEnd() ? K.cursor.offset : K.cursor.right().offset;
            K.enterInsert(z)
        }
    };
    if (A === "A") return {
        execute: () => K.enterInsert(K.cursor.endOfLogicalLine().offset)
    };
    if (A === "o") return {
        execute: () => Na6("below", K)
    };
    if (A === "O") return {
        execute: () => Na6("above", K)
    };
    return null
}
// @from(Ln 496355, Col 0)
function Fbq(A, q, K, Y) {
    let z = Ebq[K];
    if (z) return {
        next: {
            type: "operatorTextObj",
            op: A,
            count: q,
            scope: z
        }
    };
    if (Jt8.has(K)) return {
        next: {
            type: "operatorFind",
            op: A,
            count: q,
            find: K
        }
    };
    if (jt8.has(K)) return {
        execute: () => SV6(A, K, q, Y)
    };
    if (K === "G") return {
        execute: () => ubq(A, q, Y)
    };
    if (K === "g") return {
        next: {
            type: "operatorG",
            op: A,
            count: q
        }
    };
    return null
}
// @from(Ln 496389, Col 0)
function CZz(A, q) {
    if (/[1-9]/.test(A)) return {
        next: {
            type: "count",
            digits: A
        }
    };
    if (A === "0") return {
        execute: () => q.setOffset(q.cursor.startOfLogicalLine().offset)
    };
    let K = gbq(A, 1, q);
    if (K) return K;
    return {}
}
// @from(Ln 496404, Col 0)
function IZz(A, q, K) {
    if (/[0-9]/.test(q)) {
        let _ = A.digits + q,
            w = Math.min(parseInt(_, 10), Mt8);
        return {
            next: {
                type: "count",
                digits: String(w)
            }
        }
    }
    let Y = parseInt(A.digits, 10),
        z = gbq(q, Y, K);
    if (z) return z;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496425, Col 0)
function bZz(A, q, K) {
    if (q === A.op[0]) return {
        execute: () => Xt8(A.op, A.count, K)
    };
    if (/[0-9]/.test(q)) return {
        next: {
            type: "operatorCount",
            op: A.op,
            count: A.count,
            digits: q
        }
    };
    let Y = Fbq(A.op, A.count, q, K);
    if (Y) return Y;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496446, Col 0)
function xZz(A, q, K) {
    if (/[0-9]/.test(q)) {
        let w = A.digits + q,
            O = Math.min(parseInt(w, 10), Mt8);
        return {
            next: {
                ...A,
                digits: String(O)
            }
        }
    }
    let Y = parseInt(A.digits, 10),
        z = A.count * Y,
        _ = Fbq(A.op, z, q, K);
    if (_) return _;
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496468, Col 0)
function uZz(A, q, K) {
    return {
        execute: () => QI1(A.op, A.find, q, A.count, K)
    }
}
// @from(Ln 496474, Col 0)
function mZz(A, q, K) {
    if (ybq.has(q)) return {
        execute: () => UI1(A.op, A.scope, q, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496485, Col 0)
function BZz(A, q, K) {
    return {
        execute: () => {
            let Y = K.cursor.findCharacter(q, A.find, A.count);
            if (Y !== null) K.setOffset(Y), K.setLastFind(A.find, q)
        }
    }
}
// @from(Ln 496494, Col 0)
function gZz(A, q, K) {
    if (q === "g") {
        if (A.count > 1) return {
            execute: () => {
                let Y = K.text.split(`
`),
                    z = Math.min(A.count - 1, Y.length - 1),
                    _ = 0;
                for (let w = 0; w < z; w++) _ += (Y[w]?.length ?? 0) + 1;
                K.setOffset(_)
            }
        };
        return {
            execute: () => K.setOffset(K.cursor.startOfFirstLine().offset)
        }
    }
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496517, Col 0)
function FZz(A, q, K) {
    if (q === "g") return {
        execute: () => mbq(A.op, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496528, Col 0)
function pZz(A, q, K) {
    return {
        execute: () => cI1(q, A.count, K)
    }
}
// @from(Ln 496534, Col 0)
function QZz(A, q, K) {
    if (q === A.dir) return {
        execute: () => nI1(A.dir, A.count, K)
    };
    return {
        next: {
            type: "idle"
        }
    }
}
// @from(Ln 496545, Col 0)
function UZz(A, q, K) {
    let Y = K.getLastFind();
    if (!Y) return;
    let z = Y.type;
    if (A) z = {
        f: "F",
        F: "f",
        t: "T",
        T: "t"
    } [z];
    let _ = K.cursor.findCharacter(Y.char, z, q);
    if (_ !== null) K.setOffset(_)
}
// @from(Ln 496558, Col 4)
pbq = E(() => {
    Dt8();
    Wt8()
})
// @from(Ln 496563, Col 0)
function Qbq(A) {
    let q = ii.default.useRef(Lbq()),
        [K, Y] = ii.useState("INSERT"),
        z = ii.default.useRef(Rbq()),
        _ = zy1({
            ...A,
            inputFilter: A.inputFilter
        }),
        {
            onModeChange: w
        } = A,
        O = ii.useCallback((D) => {
            if (D !== void 0) _.setOffset(D);
            q.current = {
                mode: "INSERT",
                insertedText: ""
            }, Y("INSERT"), w?.("INSERT")
        }, [_, w]),
        $ = ii.useCallback(() => {
            let D = q.current;
            if (D.mode === "INSERT" && D.insertedText) z.current.lastChange = {
                type: "insert",
                text: D.insertedText
            };
            let X = _.offset;
            if (X > 0 && A.value[X - 1] !== `
`) _.setOffset(X - 1);
            q.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }, Y("NORMAL"), w?.("NORMAL")
        }, [w, _, A.value]);

    function H(D, X = !1) {
        return {
            cursor: D,
            text: A.value,
            setText: (P) => A.onChange(P),
            setOffset: (P) => _.setOffset(P),
            enterInsert: (P) => O(P),
            getRegister: () => z.current.register,
            setRegister: (P, W) => {
                z.current.register = P, z.current.registerIsLinewise = W
            },
            getLastFind: () => z.current.lastFind,
            setLastFind: (P, W) => {
                z.current.lastFind = {
                    type: P,
                    char: W
                }
            },
            recordChange: X ? () => {} : (P) => {
                z.current.lastChange = P
            }
        }
    }

    function j() {
        let D = z.current.lastChange;
        if (!D) return;
        let X = RK.fromText(A.value, A.columns, _.offset),
            P = H(X, !0);
        switch (D.type) {
            case "insert":
                if (D.text) {
                    let W = X.insert(D.text);
                    A.onChange(W.text), _.setOffset(W.offset)
                }
                break;
            case "x":
                dI1(D.count, P);
                break;
            case "replace":
                cI1(D.char, D.count, P);
                break;
            case "toggleCase":
                lI1(D.count, P);
                break;
            case "indent":
                nI1(D.dir, D.count, P);
                break;
            case "join":
                iI1(D.count, P);
                break;
            case "openLine":
                Na6(D.direction, P);
                break;
            case "operator":
                SV6(D.op, D.motion, D.count, P);
                break;
            case "operatorFind":
                QI1(D.op, D.find, D.char, D.count, P);
                break;
            case "operatorTextObj":
                UI1(D.op, D.scope, D.objType, D.count, P);
                break
        }
    }

    function J(D, X) {
        let P = RK.fromText(A.value, A.columns, _.offset),
            W = q.current;
        if (X.ctrl) {
            _.onInput(D, X);
            return
        }
        if (X.escape && W.mode === "INSERT") {
            $();
            return
        }
        if (X.escape && W.mode === "NORMAL") {
            q.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            };
            return
        }
        if (X.return) {
            _.onInput(D, X);
            return
        }
        if (W.mode === "INSERT") {
            if (X.backspace || X.delete) {
                if (W.insertedText.length > 0) q.current = {
                    mode: "INSERT",
                    insertedText: W.insertedText.slice(0, -(lQ(W.insertedText).length || 1))
                }
            } else q.current = {
                mode: "INSERT",
                insertedText: W.insertedText + D
            };
            _.onInput(D, X);
            return
        }
        if (W.mode !== "NORMAL") return;
        if (W.command.type === "idle" && (X.upArrow || X.downArrow || X.leftArrow || X.rightArrow)) {
            _.onInput(D, X);
            return
        }
        let Z = {
                ...H(P, !1),
                onUndo: A.onUndo,
                onDotRepeat: j
            },
            G = D;
        if (X.leftArrow) G = "h";
        else if (X.rightArrow) G = "l";
        else if (X.upArrow) G = "k";
        else if (X.downArrow) G = "j";
        let f = Bbq(W.command, G, Z);
        if (f.execute) f.execute();
        if (q.current.mode === "NORMAL") {
            if (f.next) q.current = {
                mode: "NORMAL",
                command: f.next
            };
            else if (f.execute) q.current = {
                mode: "NORMAL",
                command: {
                    type: "idle"
                }
            }
        }
        if (D === "?" && W.mode === "NORMAL" && W.command.type === "idle") A.onChange("?")
    }
    let M = ii.useCallback((D) => {
        if (D === "INSERT") q.current = {
            mode: "INSERT",
            insertedText: ""
        };
        else q.current = {
            mode: "NORMAL",
            command: {
                type: "idle"
            }
        };
        Y(D), w?.(D)
    }, [w]);
    return {
        ..._,
        onInput: J,
        mode: K,
        setMode: M
    }
}
// @from(Ln 496752, Col 4)
ii
// @from(Ln 496753, Col 4)
Ubq = E(() => {
    Up8();
    j36();
    AL();
    Dt8();
    pbq();
    Wt8();
    ii = t(P6(), 1)
})
// @from(Ln 496763, Col 0)
function Zt8(A) {
    let q = A6(36),
        [K] = z7(),
        Y = p_();
    Hy1(Y, !!A.onImagePaste);
    let {
        value: z,
        onChange: _,
        onSubmit: w,
        onExit: O,
        onExitMessage: $,
        onHistoryReset: H,
        onHistoryUp: j,
        onHistoryDown: J,
        onClearInput: M,
        focus: D,
        mask: X,
        multiline: P
    } = A, W = A.showCursor ? " " : "", Z = A.highlightPastedText, G = Y ? O1.inverse : dZz, f;
    if (q[0] !== K) f = kA("text", K), q[0] = K, q[1] = f;
    else f = q[1];
    let v;
    if (q[2] !== A.columns || q[3] !== A.cursorOffset || q[4] !== A.disableCursorMovementForUpDownKeys || q[5] !== A.disableEscapeDoublePress || q[6] !== A.focus || q[7] !== A.highlightPastedText || q[8] !== A.mask || q[9] !== A.multiline || q[10] !== A.onChange || q[11] !== A.onChangeCursorOffset || q[12] !== A.onClearInput || q[13] !== A.onExit || q[14] !== A.onExitMessage || q[15] !== A.onHistoryDown || q[16] !== A.onHistoryReset || q[17] !== A.onHistoryUp || q[18] !== A.onImagePaste || q[19] !== A.onModeChange || q[20] !== A.onSubmit || q[21] !== A.onUndo || q[22] !== A.value || q[23] !== W || q[24] !== G || q[25] !== f) v = {
        value: z,
        onChange: _,
        onSubmit: w,
        onExit: O,
        onExitMessage: $,
        onHistoryReset: H,
        onHistoryUp: j,
        onHistoryDown: J,
        onClearInput: M,
        focus: D,
        mask: X,
        multiline: P,
        cursorChar: W,
        highlightPastedText: Z,
        invert: G,
        themeText: f,
        columns: A.columns,
        onImagePaste: A.onImagePaste,
        disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
        disableEscapeDoublePress: A.disableEscapeDoublePress,
        externalOffset: A.cursorOffset,
        onOffsetChange: A.onChangeCursorOffset,
        onModeChange: A.onModeChange,
        onUndo: A.onUndo
    }, q[2] = A.columns, q[3] = A.cursorOffset, q[4] = A.disableCursorMovementForUpDownKeys, q[5] = A.disableEscapeDoublePress, q[6] = A.focus, q[7] = A.highlightPastedText, q[8] = A.mask, q[9] = A.multiline, q[10] = A.onChange, q[11] = A.onChangeCursorOffset, q[12] = A.onClearInput, q[13] = A.onExit, q[14] = A.onExitMessage, q[15] = A.onHistoryDown, q[16] = A.onHistoryReset, q[17] = A.onHistoryUp, q[18] = A.onImagePaste, q[19] = A.onModeChange, q[20] = A.onSubmit, q[21] = A.onUndo, q[22] = A.value, q[23] = W, q[24] = G, q[25] = f, q[26] = v;
    else v = q[26];
    let N = Qbq(v),
        {
            mode: V,
            setMode: L
        } = N,
        h, R;
    if (q[27] !== V || q[28] !== A.initialMode || q[29] !== L) h = () => {
        if (A.initialMode && A.initialMode !== V) L(A.initialMode)
    }, R = [A.initialMode, V, L], q[27] = V, q[28] = A.initialMode, q[29] = L, q[30] = h, q[31] = R;
    else h = q[30], R = q[31];
    oI1.default.useEffect(h, R);
    let u;
    if (q[32] !== Y || q[33] !== A || q[34] !== N) u = oI1.default.createElement(m, {
        flexDirection: "column"
    }, oI1.default.createElement(_y1, {
        inputState: N,
        terminalFocus: Y,
        highlights: A.highlights,
        ...A
    })), q[32] = Y, q[33] = A, q[34] = N, q[35] = u;
    else u = q[35];
    return u
}
// @from(Ln 496836, Col 0)
function dZz(A) {
    return A
}
// @from(Ln 496839, Col 4)
oI1
// @from(Ln 496840, Col 4)
dbq = E(() => {
    e6();
    i6();
    aK();
    Ubq();
    dp8();
    lp8();
    oI1 = t(P6(), 1)
})
// @from(Ln 496850, Col 0)
function cbq(A) {
    return !!A.isAutoModeAvailable && IN()
}
// @from(Ln 496854, Col 0)
function W26(A, q) {
    switch (A.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            if (cbq(A)) return "auto";
            return "default";
        case "bypassPermissions":
            if (cbq(A)) return "auto";
            return "default";
        case "dontAsk":
            return "default";
        default:
            return "default"
    }
}
// @from(Ln 496874, Col 0)
function lbq(A, q) {
    let K = W26(A, q);
    return {
        nextMode: K,
        context: ki(A.mode, K, A)
    }
}
// @from(Ln 496881, Col 4)
Gt8 = E(() => {
    rJ()
})
// @from(Ln 496885, Col 0)
function ibq(A, q, K, Y, z = !0) {
    let _ = A.length;
    if (_ === 0) return {
        startIndex: 0,
        endIndex: 0,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let w = Math.max(0, Math.min(Y, _ - 1));
    if (A.reduce((D, X) => D + X, 0) <= q) return {
        startIndex: 0,
        endIndex: _,
        showLeftArrow: !1,
        showRightArrow: !1
    };
    let $ = [0];
    for (let D = 0; D < _; D++) $.push($[D] + A[D]);

    function H(D, X) {
        let P = $[X] - $[D];
        if (z && D > 0) return P - 1;
        return P
    }

    function j(D, X) {
        let P = q;
        if (D > 0) P -= K;
        if (X < _) P -= K;
        return P
    }
    let J = 0,
        M = 1;
    while (M < _ && H(J, M + 1) <= j(J, M + 1)) M++;
    if (w >= J && w < M) return {
        startIndex: J,
        endIndex: M,
        showLeftArrow: J > 0,
        showRightArrow: M < _
    };
    if (w >= M) {
        M = w + 1, J = w;
        while (J > 0 && H(J - 1, M) <= j(J - 1, M)) J--
    } else {
        J = w, M = w + 1;
        while (M < _ && H(J, M + 1) <= j(J, M + 1)) M++
    }
    return {
        startIndex: J,
        endIndex: M,
        showLeftArrow: J > 0,
        showRightArrow: M < _
    }
}
// @from(Ln 496939, Col 0)
function ft8(A) {
    let q = A6(69),
        {
            tasksSelected: K,
            showHint: Y,
            isViewingTeammate: z,
            teammateFooterIndex: _,
            isLeaderIdle: w
        } = A,
        O = _ === void 0 ? 0 : _,
        $ = w === void 0 ? !1 : w,
        {
            columns: H
        } = KA(),
        j;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) j = X1(), q[0] = j;
    else j = q[0];
    let J = j.hasSeenTasksHint,
        M = M1(AGz),
        D = M1(eZz),
        X;
    if (q[1] !== M) X = Object.values(M ?? {}).filter(tZz), q[1] = M, q[2] = X;
    else X = q[2];
    let P = X,
        Z = M1(sZz) === "teammates",
        G = !Z && P.length > 0 && P.every(aZz),
        f;
    if (q[3] !== P) f = P.filter(oZz).sort(rZz), q[3] = P, q[4] = f;
    else f = q[4];
    let v = f,
        N;
    if (q[5] !== $) N = {
        name: "main",
        color: void 0,
        isIdle: $
    }, q[5] = $, q[6] = N;
    else N = q[6];
    let V = N,
        L;
    if (q[7] !== V || q[8] !== K || q[9] !== v) {
        let B = v.map(nZz);
        if (!K) B.sort(iZz);
        L = [V, ...B].map(lZz), q[7] = V, q[8] = K, q[9] = v, q[10] = L
    } else L = q[10];
    let h = L,
        R;
    if (q[11] !== h) R = h.map(cZz), q[11] = h, q[12] = R;
    else R = q[12];
    let u = R;
    if (G || !Z && z) {
        let B = K ? O : -1,
            b;
        if (q[13] !== v || q[14] !== D) b = D ? v.findIndex((l) => l.id === D) + 1 : 0, q[13] = v, q[14] = D, q[15] = b;
        else b = q[15];
        let p = b,
            Q;
        if (q[16] !== Y || q[17] !== K) Q = Y && !J && !K ? p4.createElement(p4.Fragment, null, p4.createElement(T, {
            dimColor: !0
        }, " · "), p4.createElement(T, {
            dimColor: !0
        }, p4.createElement(a1, {
            shortcut: "↓",
            action: "view"
        }))) : null, q[16] = Y, q[17] = K, q[18] = Q;
        else Q = q[18];
        let U = Q,
            e = Math.max(20, H - (U ? 15 : 0) - 4),
            Y6 = B >= 0 ? B : 0,
            H6;
        if (q[19] !== e || q[20] !== u || q[21] !== Y6) H6 = ibq(u, e, 2, Y6), q[19] = e, q[20] = u, q[21] = Y6, q[22] = H6;
        else H6 = q[22];
        let {
            startIndex: J6,
            endIndex: K6,
            showLeftArrow: s,
            showRightArrow: X6
        } = H6, z6;
        if (q[23] !== h || q[24] !== K6 || q[25] !== J6) z6 = h.slice(J6, K6), q[23] = h, q[24] = K6, q[25] = J6, q[26] = z6;
        else z6 = q[26];
        let N6 = z6,
            $6;
        if (q[27] !== s) $6 = s && p4.createElement(T, {
            dimColor: !0
        }, a6.arrowLeft, " "), q[27] = s, q[28] = $6;
        else $6 = q[28];
        let n;
        if (q[29] !== B || q[30] !== p || q[31] !== N6) n = N6.map((l, q6) => {
            let w6 = q6 > 0;
            return p4.createElement(p4.Fragment, {
                key: l.name
            }, w6 && p4.createElement(T, null, " "), p4.createElement(qGz, {
                name: l.name,
                color: l.color,
                isSelected: B === l.idx,
                isViewed: p === l.idx,
                isIdle: l.isIdle
            }))
        }), q[29] = B, q[30] = p, q[31] = N6, q[32] = n;
        else n = q[32];
        let o;
        if (q[33] !== X6) o = X6 && p4.createElement(T, {
            dimColor: !0
        }, " ", a6.arrowRight), q[33] = X6, q[34] = o;
        else o = q[34];
        let a;
        if (q[35] === Symbol.for("react.memo_cache_sentinel")) a = p4.createElement(T, {
            dimColor: !0
        }, " · ", p4.createElement(a1, {
            shortcut: "shift + ↓",
            action: "expand"
        })), q[35] = a;
        else a = q[35];
        let i;
        if (q[36] !== $6 || q[37] !== n || q[38] !== o || q[39] !== U) i = p4.createElement(p4.Fragment, null, $6, n, o, U, a), q[36] = $6, q[37] = n, q[38] = o, q[39] = U, q[40] = i;
        else i = q[40];
        return i
    }
    if (hh(M ?? {}, Z)) return null;
    let I;
    if (q[41] !== Y || q[42] !== K) I = Y ? p4.createElement(p4.Fragment, null, p4.createElement(T, {
        dimColor: !0
    }, " · "), p4.createElement(T, {
        dimColor: !0
    }, K ? p4.createElement(a1, {
        shortcut: "Enter",
        action: "view tasks"
    }) : p4.createElement(a1, {
        shortcut: "↓",
        action: "manage"
    }))) : null, q[41] = Y, q[42] = K, q[43] = I;
    else I = q[43];
    let g = I;
    if (P.length === 0) return null;
    if (P.length === 1 && H >= 150) {
        let B = P[0],
            b, p, Q, U;
        if (q[44] !== B || q[45] !== K) {
            let H6 = YGz(B);
            b = T, p = "background", Q = K, U = R3(H6, 40, !0), q[44] = B, q[45] = K, q[46] = b, q[47] = p, q[48] = Q, q[49] = U
        } else b = q[46], p = q[47], Q = q[48], U = q[49];
        let r;
        if (q[50] !== B.status) r = p4.createElement(T, {
            dimColor: !0
        }, "(", B.status, ")"), q[50] = B.status, q[51] = r;
        else r = q[51];
        let e;
        if (q[52] !== b || q[53] !== p || q[54] !== Q || q[55] !== U || q[56] !== r) e = p4.createElement(b, {
            color: p,
            inverse: Q
        }, U, " ", r), q[52] = b, q[53] = p, q[54] = Q, q[55] = U, q[56] = r, q[57] = e;
        else e = q[57];
        let Y6;
        if (q[58] !== g || q[59] !== e) Y6 = p4.createElement(p4.Fragment, null, e, g), q[58] = g, q[59] = e, q[60] = Y6;
        else Y6 = q[60];
        return Y6
    }
    if (P.length >= 1) {
        let B;
        if (q[61] !== P) B = zGz(P), q[61] = P, q[62] = B;
        else B = q[62];
        let b = B,
            p;
        if (q[63] !== b || q[64] !== K) p = p4.createElement(T, {
            color: "background",
            inverse: K
        }, b), q[63] = b, q[64] = K, q[65] = p;
        else p = q[65];
        let Q;
        if (q[66] !== g || q[67] !== p) Q = p4.createElement(p4.Fragment, null, p, g), q[66] = g, q[67] = p, q[68] = Q;
        else Q = q[68];
        return Q
    }
    return null
}
// @from(Ln 497114, Col 0)
function cZz(A, q) {
    let K = `@${A.name}`;
    return f8(K) + (q > 0 ? 1 : 0)
}
// @from(Ln 497119, Col 0)
function lZz(A, q) {
    return {
        ...A,
        idx: q
    }
}
// @from(Ln 497126, Col 0)
function iZz(A, q) {
    if (A.isIdle !== q.isIdle) return A.isIdle ? 1 : -1;
    return 0
}
// @from(Ln 497131, Col 0)
function nZz(A) {
    return {
        name: A.identity.agentName,
        color: KGz(A.identity.color),
        isIdle: A.isIdle
    }
}
// @from(Ln 497139, Col 0)
function rZz(A, q) {
    return A.identity.agentName.localeCompare(q.identity.agentName)
}
// @from(Ln 497143, Col 0)
function oZz(A) {
    return A.type === "in_process_teammate"
}
// @from(Ln 497147, Col 0)
function aZz(A) {
    return A.type === "in_process_teammate"
}
// @from(Ln 497151, Col 0)
function sZz(A) {
    return A.expandedView
}
// @from(Ln 497155, Col 0)
function tZz(A) {
    return ij(A) && !((e2() || sH()) && A.type === "local_agent")
}
// @from(Ln 497159, Col 0)
function eZz(A) {
    return A.viewingAgentTaskId
}
// @from(Ln 497163, Col 0)
function AGz(A) {
    return A.tasks
}