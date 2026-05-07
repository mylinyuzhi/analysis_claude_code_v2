
// @from(Ln 189087, Col 0)
function aN6() {
    m$6.useContext(Ca);
    let q = KO.get(process.stdout);
    return m$6.useMemo(() => {
        if (!q) return {
            copySelection: () => "",
            copySelectionNoClear: () => "",
            clearSelection: () => {},
            hasSelection: () => !1,
            getState: () => null,
            subscribe: () => () => {},
            shiftAnchor: () => {},
            shiftSelection: () => {},
            moveFocus: () => {},
            captureScrolledRows: () => {},
            setSelectionBgColor: () => {}
        };
        return {
            copySelection: () => q.copySelection(),
            copySelectionNoClear: () => q.copySelectionNoClear(),
            clearSelection: () => q.clearTextSelection(),
            hasSelection: () => q.hasTextSelection(),
            getState: () => q.selection,
            subscribe: (K) => q.subscribeToSelectionChange(K),
            shiftAnchor: (K, _, z) => eN8(q.selection, K, _, z),
            shiftSelection: (K, _, z) => q.shiftSelectionForScroll(K, _, z),
            moveFocus: (K) => q.moveSelectionFocus(K),
            captureScrolledRows: (K, _, z) => q.captureScrolledRows(K, _, z),
            setSelectionBgColor: (K) => q.setSelectionBgColor(K)
        }
    }, [q])
}
// @from(Ln 189120, Col 0)
function zA4() {
    m$6.useContext(Ca);
    let q = KO.get(process.stdout);
    return m$6.useSyncExternalStore(q ? q.subscribeToSelectionChange : Km_, q ? q.hasTextSelection : _m_)
}
// @from(Ln 189125, Col 4)
m$6
// @from(Ln 189125, Col 9)
Km_ = () => () => {}
// @from(Ln 189126, Col 4)
_m_ = () => !1
// @from(Ln 189127, Col 4)
BE8 = L(() => {
    wa6();
    Yk();
    KE8();
    m$6 = K6(P6(), 1)
})
// @from(Ln 189134, Col 0)
function pE8(q, K) {
    let _ = tN6.useContext(I46),
        z = tN6.useRef(null);
    tN6.useEffect(() => {
        if (q === null) {
            if (z.current !== null && _ && Ia()) _(LP(wN6));
            z.current = null;
            return
        }
        if (z.current = q, !_ || !Ia()) return;
        let Y = zm_[q],
            A = q === "idle" && K !== void 0 ? {
                ...Y,
                status: K
            } : Y;
        _(LP(_K4(A)))
    }, [q, K, _])
}
// @from(Ln 189152, Col 4)
tN6
// @from(Ln 189152, Col 9)
sN6 = (q, K, _) => ({
        type: "rgb",
        r: q,
        g: K,
        b: _
    })
// @from(Ln 189158, Col 4)
zm_
// @from(Ln 189159, Col 4)
YA4 = L(() => {
    HX();
    Gd();
    tN6 = K6(P6(), 1), zm_ = {
        idle: {
            indicator: sN6(0, 215, 95),
            status: "Idle",
            statusColor: sN6(136, 136, 136)
        },
        busy: {
            indicator: sN6(255, 149, 0),
            status: "Working…",
            statusColor: sN6(255, 149, 0)
        },
        waiting: {
            indicator: sN6(95, 135, 255),
            status: "Waiting",
            statusColor: sN6(95, 135, 255)
        }
    }
})
// @from(Ln 189181, Col 0)
function eN6(q) {
    let K = FE8.useContext(I46);
    FE8.useEffect(() => {
        if (q === null || !K) return;
        let _ = MO(q);
        if (process.platform === "win32") process.title = _;
        else K(yP(m2.SET_TITLE_AND_ICON, _))
    }, [q, K])
}
// @from(Ln 189190, Col 4)
FE8
// @from(Ln 189191, Col 4)
Uu1 = L(() => {
    mN();
    HX();
    Gd();
    FE8 = K6(P6(), 1)
})
// @from(Ln 189197, Col 4)
Ym_ = (q) => ({
        width: q.yogaNode?.getComputedWidth() ?? 0,
        height: q.yogaNode?.getComputedHeight() ?? 0
    })
// @from(Ln 189201, Col 4)
qE6
// @from(Ln 189202, Col 4)
AA4 = L(() => {
    qE6 = Ym_
})
// @from(Ln 189205, Col 4)
kd = {}
// @from(Ln 189248, Col 0)
function wA4(q) {
    return OA4.createElement($N8, null, q)
}
// @from(Ln 189251, Col 0)
async function eB(q, K) {
    return WY4(wA4(q), K)
}
// @from(Ln 189254, Col 0)
async function Qu1(q) {
    let K = await PY4(q);
    return {
        ...K,
        render: (_) => K.render(wA4(_))
    }
}
// @from(Ln 189261, Col 4)
OA4
// @from(Ln 189262, Col 4)
g6 = L(() => {
    jN6();
    DY4();
    u$6();
    GY4();
    dN6();
    jN6();
    mY4();
    na();
    BY4();
    u46();
    FY4();
    xu1();
    QY4();
    cY4();
    I$6();
    Au1();
    qN8();
    GI1();
    vI1();
    lB();
    lY4();
    mu1();
    uE8();
    qA4();
    _A4();
    BE8();
    KN8();
    YA4();
    ea6();
    Uu1();
    $s6();
    AA4();
    HX();
    FN8();
    OA4 = K6(P6(), 1)
})
// @from(Ln 189300, Col 0)
function s1() {
    let q = $A4.useContext(C46);
    if (!q) throw Error("useTerminalSize must be used within an Ink App component");
    return q
}
// @from(Ln 189305, Col 4)
$A4
// @from(Ln 189306, Col 4)
I4 = L(() => {
    qs6();
    $A4 = K6(P6(), 1)
})
// @from(Ln 189311, Col 0)
function jA4(q) {
    let K = s(10),
        {
            children: _,
            lock: z
        } = q,
        Y = z === void 0 ? "always" : z,
        [A, O] = m46(),
        {
            isVisible: w
        } = O,
        {
            rows: $
        } = s1(),
        j = Nd.useRef(null),
        H = Nd.useRef(0),
        [J, X] = Nd.useState(0),
        M;
    if (K[0] !== A) M = (v) => {
        A(v)
    }, K[0] = A, K[1] = M;
    else M = K[1];
    let P = M,
        W = Y === "always" || !w,
        D;
    if (K[2] !== $) D = () => {
        if (!j.current) return;
        let {
            height: v
        } = qE6(j.current);
        if (v > H.current) H.current = Math.min(v, $), X(H.current)
    }, K[2] = $, K[3] = D;
    else D = K[3];
    Nd.useLayoutEffect(D);
    let Z = W ? J : void 0,
        G;
    if (K[4] !== _) G = Nd.default.createElement(u, {
        ref: j,
        flexDirection: "column"
    }, _), K[4] = _, K[5] = G;
    else G = K[5];
    let f;
    if (K[6] !== P || K[7] !== Z || K[8] !== G) f = Nd.default.createElement(u, {
        minHeight: Z,
        ref: P
    }, G), K[6] = P, K[7] = Z, K[8] = G, K[9] = f;
    else f = K[9];
    return f
}
// @from(Ln 189360, Col 4)
Nd
// @from(Ln 189361, Col 4)
HA4 = L(() => {
    o6();
    I4();
    $s6();
    g6();
    Nd = K6(P6(), 1)
})
// @from(Ln 189369, Col 0)
function _1(q) {
    let K = s(8),
        {
            children: _,
            height: z
        } = q;
    if (JA4.useContext(XA4)) return _;
    let A;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) A = Nf.createElement(PJ, {
        fromLeftEdge: !0,
        flexShrink: 0
    }, Nf.createElement(T, {
        dimColor: !0
    }, "  ", "⎿  ")), K[0] = A;
    else A = K[0];
    let O;
    if (K[1] !== _) O = Nf.createElement(u, {
        flexShrink: 1,
        flexGrow: 1
    }, _), K[1] = _, K[2] = O;
    else O = K[2];
    let w;
    if (K[3] !== z || K[4] !== O) w = Nf.createElement(Am_, null, Nf.createElement(u, {
        flexDirection: "row",
        height: z,
        overflowY: "hidden"
    }, A, O)), K[3] = z, K[4] = O, K[5] = w;
    else w = K[5];
    let $ = w;
    if (z !== void 0) return $;
    let j;
    if (K[6] !== $) j = Nf.createElement(jA4, {
        lock: "offscreen"
    }, $), K[6] = $, K[7] = j;
    else j = K[7];
    return j
}
// @from(Ln 189407, Col 0)
function Am_(q) {
    let K = s(2),
        {
            children: _
        } = q,
        z;
    if (K[0] !== _) z = Nf.createElement(XA4.Provider, {
        value: !0
    }, _), K[0] = _, K[1] = z;
    else z = K[1];
    return z
}
// @from(Ln 189419, Col 4)
Nf
// @from(Ln 189419, Col 8)
JA4
// @from(Ln 189419, Col 13)
XA4
// @from(Ln 189420, Col 4)
GK = L(() => {
    o6();
    g6();
    HA4();
    Nf = K6(P6(), 1), JA4 = K6(P6(), 1);
    XA4 = Nf.createContext(!1)
})
// @from(Ln 189434, Col 0)
async function KE6(q, K) {
    if (!q) return {
        resultType: "emptyPath"
    };
    let _ = $m_(Wq(q));
    try {
        if (!(await Om_(_)).isDirectory()) return {
            resultType: "notADirectory",
            directoryPath: q,
            absolutePath: _
        }
    } catch (Y) {
        let A = Q1(Y);
        if (A === "ENOENT" || A === "ENOTDIR" || A === "EACCES" || A === "EPERM") return {
            resultType: "pathNotFound",
            directoryPath: q,
            absolutePath: _
        };
        throw Y
    }
    let z = qp(K);
    for (let Y of z)
        if (iE(_, Y)) return {
            resultType: "alreadyInWorkingDirectory",
            directoryPath: q,
            workingDir: Y
        };
    return {
        resultType: "success",
        absolutePath: _
    }
}
// @from(Ln 189467, Col 0)
function _E6(q) {
    switch (q.resultType) {
        case "emptyPath":
            return "Please provide a directory path.";
        case "pathNotFound":
            return `Path ${Y8.bold(q.absolutePath)} was not found.`;
        case "notADirectory": {
            let K = wm_(q.absolutePath);
            return `${Y8.bold(q.directoryPath)} is not a directory. Did you mean to add the parent directory ${Y8.bold(K)}?`
        }
        case "alreadyInWorkingDirectory":
            return `${Y8.bold(q.directoryPath)} is already accessible within the existing working directory ${Y8.bold(q.workingDir)}.`;
        case "success":
            return `Added ${Y8.bold(q.absolutePath)} as a working directory.`
    }
}
// @from(Ln 189483, Col 4)
gE8 = L(() => {
    Y3();
    m8();
    b9();
    Sz()
})
// @from(Ln 189490, Col 0)
function rE(q, K) {
    let _ = q,
        z = new Set;
    return {
        getState: () => _,
        setState: (Y) => {
            let A = _,
                O = Y(A);
            if (Object.is(O, A)) return;
            _ = O, K?.({
                newState: O,
                oldState: A
            });
            for (let w of z) w()
        },
        subscribe: (Y) => {
            return z.add(Y), () => z.delete(Y)
        }
    }
}
// @from(Ln 189510, Col 4)
PA4 = {}
// @from(Ln 189518, Col 0)
function Hm_(q) {
    let K = s(3),
        {
            children: _
        } = q,
        [z] = Ed.useState(Jm_),
        Y;
    if (K[0] !== _ || K[1] !== z) Y = Ed.default.createElement(MA4.Provider, {
        value: z
    }, _), K[0] = _, K[1] = z, K[2] = Y;
    else Y = K[2];
    return Y
}
// @from(Ln 189532, Col 0)
function Jm_() {
    return rE(jm_)
}
// @from(Ln 189536, Col 0)
function du1() {
    let q = Ed.useContext(MA4);
    if (!q) throw Error("useVoiceState must be used within a VoiceProvider");
    return q
}
// @from(Ln 189542, Col 0)
function oE(q) {
    let K = s(3),
        _ = du1(),
        z;
    if (K[0] !== q || K[1] !== _) z = () => q(_.getState()), K[0] = q, K[1] = _, K[2] = z;
    else z = K[2];
    let Y = z;
    return Ed.useSyncExternalStore(_.subscribe, Y, Y)
}
// @from(Ln 189552, Col 0)
function js6() {
    return du1().setState
}
// @from(Ln 189556, Col 0)
function cu1() {
    return du1().getState
}
// @from(Ln 189559, Col 4)
Ed
// @from(Ln 189559, Col 8)
jm_
// @from(Ln 189559, Col 13)
MA4
// @from(Ln 189560, Col 4)
B$6 = L(() => {
    o6();
    Ed = K6(P6(), 1), jm_ = {
        voiceState: "idle",
        voiceError: null,
        voiceInterimTranscript: "",
        voiceAudioLevels: [],
        voiceWarmingUp: !1
    }, MA4 = Ed.createContext(null)
})
// @from(Ln 189571, Col 0)
function lu1() {
    let q = B46.useContext(zE6);
    if (!q) throw ReferenceError("useAppState/useSetAppState cannot be called outside of an <AppStateProvider />");
    return q
}
// @from(Ln 189577, Col 0)
function M8(q) {
    let K = lu1(),
        _ = () => {
            let z = K.getState();
            return q(z)
        };
    return B46.useSyncExternalStore(K.subscribe, _, _)
}
// @from(Ln 189586, Col 0)
function R7() {
    return lu1().setState
}
// @from(Ln 189590, Col 0)
function H9() {
    return lu1()
}
// @from(Ln 189594, Col 0)
function Kp(q) {
    let K = B46.useContext(zE6);
    return B46.useSyncExternalStore(K ? K.subscribe : Xm_, () => K ? q(K.getState()) : void 0)
}
// @from(Ln 189598, Col 4)
B46
// @from(Ln 189598, Col 9)
zE6
// @from(Ln 189598, Col 14)
Xm_ = () => () => {}
// @from(Ln 189599, Col 4)
N7 = L(() => {
    B46 = K6(P6(), 1), zE6 = B46.createContext(null)
})
// @from(Ln 189603, Col 0)
function ZA4({
    children: q
}) {
    let K = MR.useRef({
        currentTimeoutId: {
            current: null
        },
        mountCount: {
            current: 0
        }
    }).current;
    return iu1.createElement(DA4.Provider, {
        value: K
    }, q)
}
// @from(Ln 189619, Col 0)
function EK() {
    let q = H9(),
        K = R7(),
        _ = MR.useContext(DA4),
        z = MR.useRef({
            currentTimeoutId: {
                current: null
            },
            mountCount: {
                current: 0
            }
        }).current,
        {
            currentTimeoutId: Y,
            mountCount: A
        } = _ ?? z,
        O = MR.useCallback(() => {
            K((j) => {
                let H = Mm_(j.notifications.queue);
                if (j.notifications.current !== null || !H) return j;
                return Y.current = setTimeout((J, X, M, P) => {
                    P.current = null, J((W) => {
                        if (W.notifications.current?.key !== X) return W;
                        return {
                            ...W,
                            notifications: {
                                queue: W.notifications.queue,
                                current: null
                            }
                        }
                    }), M()
                }, H.timeoutMs ?? nu1, K, H.key, O, Y), {
                    ...j,
                    notifications: {
                        queue: j.notifications.queue.filter((J) => J !== H),
                        current: H
                    }
                }
            })
        }, [K, Y]),
        w = MR.useCallback((j) => {
            if (j.priority === "immediate") {
                if (Y.current) clearTimeout(Y.current), Y.current = null;
                Y.current = setTimeout((H, J, X, M) => {
                    M.current = null, H((P) => {
                        if (P.notifications.current?.key !== J.key) return P;
                        return {
                            ...P,
                            notifications: {
                                queue: P.notifications.queue.filter((W) => !J.invalidates?.includes(W.key)),
                                current: null
                            }
                        }
                    }), X()
                }, j.timeoutMs ?? nu1, K, j, O, Y), K((H) => ({
                    ...H,
                    notifications: {
                        current: j,
                        queue: [...H.notifications.current ? [H.notifications.current] : [], ...H.notifications.queue].filter((J) => J.priority !== "immediate" && !j.invalidates?.includes(J.key))
                    }
                }));
                return
            }
            K((H) => {
                if (j.fold) {
                    if (H.notifications.current?.key === j.key) {
                        let W = j.fold(H.notifications.current, j);
                        if (Y.current) clearTimeout(Y.current), Y.current = null;
                        return Y.current = setTimeout((D, Z, G, f) => {
                            f.current = null, D((v) => {
                                if (v.notifications.current?.key !== Z) return v;
                                return {
                                    ...v,
                                    notifications: {
                                        queue: v.notifications.queue,
                                        current: null
                                    }
                                }
                            }), G()
                        }, W.timeoutMs ?? nu1, K, W.key, O, Y), {
                            ...H,
                            notifications: {
                                current: W,
                                queue: H.notifications.queue
                            }
                        }
                    }
                    let P = H.notifications.queue.findIndex((W) => W.key === j.key);
                    if (P !== -1) {
                        let W = j.fold(H.notifications.queue[P], j),
                            D = [...H.notifications.queue];
                        return D[P] = W, {
                            ...H,
                            notifications: {
                                current: H.notifications.current,
                                queue: D
                            }
                        }
                    }
                }
                if (!(!new Set(H.notifications.queue.map((P) => P.key)).has(j.key) && H.notifications.current?.key !== j.key)) return H;
                let M = H.notifications.current !== null && j.invalidates?.includes(H.notifications.current.key);
                if (M && Y.current) clearTimeout(Y.current), Y.current = null;
                return {
                    ...H,
                    notifications: {
                        current: M ? null : H.notifications.current,
                        queue: [...H.notifications.queue.filter((P) => P.priority !== "immediate" && !j.invalidates?.includes(P.key)), j]
                    }
                }
            }), O()
        }, [K, O, Y]),
        $ = MR.useCallback((j) => {
            K((H) => {
                let J = H.notifications.current?.key === j,
                    X = H.notifications.queue.some((M) => M.key === j);
                if (!J && !X) return H;
                if (J && Y.current) clearTimeout(Y.current), Y.current = null;
                return {
                    ...H,
                    notifications: {
                        current: J ? null : H.notifications.current,
                        queue: H.notifications.queue.filter((M) => M.key !== j)
                    }
                }
            }), O()
        }, [K, O, Y]);
    return MR.useEffect(() => {
        if (A.current++, q.getState().notifications.queue.length > 0) O();
        return () => {
            if (A.current--, A.current === 0 && Y.current) clearTimeout(Y.current), Y.current = null
        }
    }, []), {
        addNotification: w,
        removeNotification: $
    }
}
// @from(Ln 189757, Col 0)
function Mm_(q) {
    if (q.length === 0) return;
    return q.reduce((K, _) => WA4[_.priority] < WA4[K.priority] ? _ : K)
}
// @from(Ln 189761, Col 4)
iu1
// @from(Ln 189761, Col 9)
MR
// @from(Ln 189761, Col 13)
nu1 = 8000
// @from(Ln 189762, Col 4)
DA4
// @from(Ln 189762, Col 9)
WA4
// @from(Ln 189763, Col 4)
kY = L(() => {
    N7();
    iu1 = K6(P6(), 1), MR = K6(P6(), 1), DA4 = MR.createContext(null);
    WA4 = {
        immediate: 0,
        high: 1,
        medium: 2,
        low: 3
    }
})
// @from(Ln 189789, Col 0)
function EA4(q, K = {}) {
    let _ = K.entryType || K.type;
    if (_ === "both") _ = PR.FILE_DIR_TYPE;
    if (_) K.type = _;
    if (!q) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
    else if (typeof q !== "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
    else if (_ && !vA4.includes(_)) throw Error(`readdirp: Invalid type passed. Use one of ${vA4.join(", ")}`);
    return K.root = q, new NA4(K)
}
// @from(Ln 189798, Col 4)
PR
// @from(Ln 189798, Col 8)
ru1
// @from(Ln 189798, Col 13)
kA4 = "READDIRP_RECURSIVE_ERROR"
// @from(Ln 189799, Col 4)
Tm_
// @from(Ln 189799, Col 9)
vA4
// @from(Ln 189799, Col 14)
Vm_
// @from(Ln 189799, Col 19)
km_
// @from(Ln 189799, Col 24)
Nm_ = (q) => Tm_.has(q.code)
// @from(Ln 189800, Col 4)
Em_
// @from(Ln 189800, Col 9)
TA4 = (q) => !0
// @from(Ln 189801, Col 4)
VA4 = (q) => {
        if (q === void 0) return TA4;
        if (typeof q === "function") return q;
        if (typeof q === "string") {
            let K = q.trim();
            return (_) => _.basename === K
        }
        if (Array.isArray(q)) {
            let K = q.map((_) => _.trim());
            return (_) => K.some((z) => _.basename === z)
        }
        return TA4
    }
// @from(Ln 189814, Col 4)
NA4
// @from(Ln 189815, Col 4)
yA4 = L(() => {
    PR = {
        FILE_TYPE: "files",
        DIR_TYPE: "directories",
        FILE_DIR_TYPE: "files_directories",
        EVERYTHING_TYPE: "all"
    }, ru1 = {
        root: ".",
        fileFilter: (q) => !0,
        directoryFilter: (q) => !0,
        type: PR.FILE_TYPE,
        lstat: !1,
        depth: 2147483648,
        alwaysStat: !1,
        highWaterMark: 4096
    };
    Object.freeze(ru1);
    Tm_ = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", kA4]), vA4 = [PR.DIR_TYPE, PR.EVERYTHING_TYPE, PR.FILE_DIR_TYPE, PR.FILE_TYPE], Vm_ = new Set([PR.DIR_TYPE, PR.EVERYTHING_TYPE, PR.FILE_DIR_TYPE]), km_ = new Set([PR.EVERYTHING_TYPE, PR.FILE_DIR_TYPE, PR.FILE_TYPE]), Em_ = process.platform === "win32";
    NA4 = class NA4 extends Zm_ {
        constructor(q = {}) {
            super({
                objectMode: !0,
                autoDestroy: !0,
                highWaterMark: q.highWaterMark
            });
            let K = {
                    ...ru1,
                    ...q
                },
                {
                    root: _,
                    type: z
                } = K;
            this._fileFilter = VA4(K.fileFilter), this._directoryFilter = VA4(K.directoryFilter);
            let Y = K.lstat ? fA4 : Pm_;
            if (Em_) this._stat = (A) => Y(A, {
                bigint: !0
            });
            else this._stat = Y;
            this._maxDepth = K.depth ?? ru1.depth, this._wantsDir = z ? Vm_.has(z) : !1, this._wantsFile = z ? km_.has(z) : !1, this._wantsEverything = z === PR.EVERYTHING_TYPE, this._root = GA4(_), this._isDirent = !K.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = {
                encoding: "utf8",
                withFileTypes: this._isDirent
            }, this.parents = [this._exploreDir(_, 1)], this.reading = !1, this.parent = void 0
        }
        async _read(q) {
            if (this.reading) return;
            this.reading = !0;
            try {
                while (!this.destroyed && q > 0) {
                    let K = this.parent,
                        _ = K && K.files;
                    if (_ && _.length > 0) {
                        let {
                            path: z,
                            depth: Y
                        } = K, A = _.splice(0, q).map((w) => this._formatEntry(w, z)), O = await Promise.all(A);
                        for (let w of O) {
                            if (!w) continue;
                            if (this.destroyed) return;
                            let $ = await this._getEntryType(w);
                            if ($ === "directory" && this._directoryFilter(w)) {
                                if (Y <= this._maxDepth) this.parents.push(this._exploreDir(w.fullPath, Y + 1));
                                if (this._wantsDir) this.push(w), q--
                            } else if (($ === "file" || this._includeAsFile(w)) && this._fileFilter(w)) {
                                if (this._wantsFile) this.push(w), q--
                            }
                        }
                    } else {
                        let z = this.parents.pop();
                        if (!z) {
                            this.push(null);
                            break
                        }
                        if (this.parent = await z, this.destroyed) return
                    }
                }
            } catch (K) {
                this.destroy(K)
            } finally {
                this.reading = !1
            }
        }
        async _exploreDir(q, K) {
            let _;
            try {
                _ = await Wm_(q, this._rdOptions)
            } catch (z) {
                this._onError(z)
            }
            return {
                files: _,
                depth: K,
                path: q
            }
        }
        async _formatEntry(q, K) {
            let _, z = this._isDirent ? q.name : q;
            try {
                let Y = GA4(Gm_(K, z));
                _ = {
                    path: fm_(this._root, Y),
                    fullPath: Y,
                    basename: z
                }, _[this._statsProp] = this._isDirent ? q : await this._stat(Y)
            } catch (Y) {
                this._onError(Y);
                return
            }
            return _
        }
        _onError(q) {
            if (Nm_(q) && !this.destroyed) this.emit("warn", q);
            else this.destroy(q)
        }
        async _getEntryType(q) {
            if (!q && this._statsProp in q) return "";
            let K = q[this._statsProp];
            if (!K) return "";
            if (K.isFile()) return "file";
            if (K.isDirectory()) return "directory";
            if (K && K.isSymbolicLink()) {
                let _ = q.fullPath;
                try {
                    let z = await Dm_(_),
                        Y = await fA4(z);
                    if (Y.isFile()) return "file";
                    if (Y.isDirectory()) {
                        let A = z.length;
                        if (_.startsWith(z) && _.substr(A, 1) === vm_) {
                            let O = Error(`Circular symlink detected: "${_}" points to "${z}"`);
                            return O.code = kA4, this._onError(O)
                        }
                        return "directory"
                    }
                } catch (z) {
                    return this._onError(z), ""
                }
            }
        }
        _includeAsFile(q) {
            let K = q && q[this._statsProp];
            return K && this._wantsEverything && !K.isDirectory()
        }
    }
})
// @from(Ln 189976, Col 0)
function hA4(q, K, _, z, Y) {
    let A = (O, w) => {
        if (_(q), Y(O, w, {
                watchedPath: q
            }), w && q !== w) dE8(XH.resolve(q, w), p$6, XH.join(q, w))
    };
    try {
        return Lm_(q, {
            persistent: K.persistent
        }, A)
    } catch (O) {
        z(O);
        return
    }
}
// @from(Ln 189991, Col 0)
class qm1 {
    constructor(q) {
        this.fsw = q, this._boundHandleError = (K) => q._handleError(K)
    }
    _watchWithNodeFs(q, K) {
        let _ = this.fsw.options,
            z = XH.dirname(q),
            Y = XH.basename(q);
        this.fsw._getWatchedDir(z).add(Y);
        let O = XH.resolve(q),
            w = {
                persistent: _.persistent
            };
        if (!K) K = cE8;
        let $;
        if (_.usePolling) {
            let j = _.interval !== _.binaryInterval;
            w.interval = j && Fm_(Y) ? _.binaryInterval : _.interval, $ = Qm_(q, O, w, {
                listener: K,
                rawEmitter: this.fsw._emitRaw
            })
        } else $ = Um_(q, O, w, {
            listener: K,
            errHandler: this._boundHandleError,
            rawEmitter: this.fsw._emitRaw
        });
        return $
    }
    _handleFile(q, K, _) {
        if (this.fsw.closed) return;
        let z = XH.dirname(q),
            Y = XH.basename(q),
            A = this.fsw._getWatchedDir(z),
            O = K;
        if (A.has(Y)) return;
        let w = async (j, H) => {
            if (!this.fsw._throttle(um_, q, 5)) return;
            if (!H || H.mtimeMs === 0) try {
                let J = await RA4(q);
                if (this.fsw.closed) return;
                let {
                    atimeMs: X,
                    mtimeMs: M
                } = J;
                if (!X || X <= M || M !== O.mtimeMs) this.fsw._emit(_p.CHANGE, q, J);
                if ((bm_ || Im_ || xm_) && O.ino !== J.ino) {
                    this.fsw._closeFile(j), O = J;
                    let P = this._watchWithNodeFs(q, w);
                    if (P) this.fsw._addPathCloser(j, P)
                } else O = J
            } catch (J) {
                this.fsw._remove(z, Y)
            } else if (A.has(Y)) {
                let {
                    atimeMs: J,
                    mtimeMs: X
                } = H;
                if (!J || J <= X || X !== O.mtimeMs) this.fsw._emit(_p.CHANGE, q, H);
                O = H
            }
        }, $ = this._watchWithNodeFs(q, w);
        if (!(_ && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(q)) {
            if (!this.fsw._throttle(_p.ADD, q, 0)) return;
            this.fsw._emit(_p.ADD, q, K)
        }
        return $
    }
    async _handleSymlink(q, K, _, z) {
        if (this.fsw.closed) return;
        let Y = q.fullPath,
            A = this.fsw._getWatchedDir(K);
        if (!this.fsw.options.followSymlinks) {
            this.fsw._incrReadyCount();
            let O;
            try {
                O = await ou1(_)
            } catch (w) {
                return this.fsw._emitReady(), !0
            }
            if (this.fsw.closed) return;
            if (A.has(z)) {
                if (this.fsw._symlinkPaths.get(Y) !== O) this.fsw._symlinkPaths.set(Y, O), this.fsw._emit(_p.CHANGE, _, q.stats)
            } else A.add(z), this.fsw._symlinkPaths.set(Y, O), this.fsw._emit(_p.ADD, _, q.stats);
            return this.fsw._emitReady(), !0
        }
        if (this.fsw._symlinkPaths.has(Y)) return !0;
        this.fsw._symlinkPaths.set(Y, !0)
    }
    _handleRead(q, K, _, z, Y, A, O) {
        if (q = XH.join(q, ""), O = this.fsw._throttle("readdir", q, 1000), !O) return;
        let w = this.fsw._getWatchedDir(_.path),
            $ = new Set,
            j = this.fsw._readdirp(q, {
                fileFilter: (H) => _.filterPath(H),
                directoryFilter: (H) => _.filterDir(H)
            });
        if (!j) return;
        return j.on(Cm_, async (H) => {
            if (this.fsw.closed) {
                j = void 0;
                return
            }
            let J = H.path,
                X = XH.join(q, J);
            if ($.add(J), H.stats.isSymbolicLink() && await this._handleSymlink(H, q, X, J)) return;
            if (this.fsw.closed) {
                j = void 0;
                return
            }
            if (J === z || !z && !w.has(J)) this.fsw._incrReadyCount(), X = XH.join(Y, XH.relative(Y, X)), this._addToNodeFs(X, K, _, A + 1)
        }).on(_p.ERROR, this._boundHandleError), new Promise((H, J) => {
            if (!j) return J();
            j.once(tu1, () => {
                if (this.fsw.closed) {
                    j = void 0;
                    return
                }
                let X = O ? O.clear() : !1;
                if (H(void 0), w.getChildren().filter((M) => {
                        return M !== q && !$.has(M)
                    }).forEach((M) => {
                        this.fsw._remove(q, M)
                    }), j = void 0, X) this._handleRead(q, !1, _, z, Y, A, O)
            })
        })
    }
    async _handleDir(q, K, _, z, Y, A, O) {
        let w = this.fsw._getWatchedDir(XH.dirname(q)),
            $ = w.has(XH.basename(q));
        if (!(_ && this.fsw.options.ignoreInitial) && !Y && !$) this.fsw._emit(_p.ADD_DIR, q, K);
        w.add(XH.basename(q)), this.fsw._getWatchedDir(q);
        let j, H, J = this.fsw.options.depth;
        if ((J == null || z <= J) && !this.fsw._symlinkPaths.has(O)) {
            if (!Y) {
                if (await this._handleRead(q, _, A, Y, q, z, j), this.fsw.closed) return
            }
            H = this._watchWithNodeFs(q, (X, M) => {
                if (M && M.mtimeMs === 0) return;
                this._handleRead(X, !1, A, Y, q, z, j)
            })
        }
        return H
    }
    async _addToNodeFs(q, K, _, z, Y) {
        let A = this.fsw._emitReady;
        if (this.fsw._isIgnored(q) || this.fsw.closed) return A(), !1;
        let O = this.fsw._getWatchHelpers(q);
        if (_) O.filterPath = (w) => _.filterPath(w), O.filterDir = (w) => _.filterDir(w);
        try {
            let w = await mm_[O.statMethod](O.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(O.watchPath, w)) return A(), !1;
            let $ = this.fsw.options.followSymlinks,
                j;
            if (w.isDirectory()) {
                let H = XH.resolve(q),
                    J = $ ? await ou1(q) : q;
                if (this.fsw.closed) return;
                if (j = await this._handleDir(O.watchPath, w, K, z, Y, O, J), this.fsw.closed) return;
                if (H !== J && J !== void 0) this.fsw._symlinkPaths.set(H, J)
            } else if (w.isSymbolicLink()) {
                let H = $ ? await ou1(q) : q;
                if (this.fsw.closed) return;
                let J = XH.dirname(O.watchPath);
                if (this.fsw._getWatchedDir(J).add(O.watchPath), this.fsw._emit(_p.ADD, O.watchPath, w), j = await this._handleDir(J, w, K, z, q, O, H), this.fsw.closed) return;
                if (H !== void 0) this.fsw._symlinkPaths.set(XH.resolve(q), H)
            } else j = this._handleFile(O.watchPath, w, K);
            if (A(), j) this.fsw._addPathCloser(q, j);
            return !1
        } catch (w) {
            if (this.fsw._handleError(w)) return A(), q
        }
    }
}
// @from(Ln 190165, Col 4)
Cm_ = "data"
// @from(Ln 190166, Col 4)
tu1 = "end"
// @from(Ln 190167, Col 4)
SA4 = "close"
// @from(Ln 190168, Col 4)
cE8 = () => {}
// @from(Ln 190169, Col 4)
lE8
// @from(Ln 190169, Col 9)
eu1
// @from(Ln 190169, Col 14)
bm_
// @from(Ln 190169, Col 19)
Im_
// @from(Ln 190169, Col 24)
xm_
// @from(Ln 190169, Col 29)
CA4
// @from(Ln 190169, Col 34)
Pj
// @from(Ln 190169, Col 38)
_p
// @from(Ln 190169, Col 42)
um_ = "watch"
// @from(Ln 190170, Col 4)
mm_
// @from(Ln 190170, Col 9)
p$6 = "listeners"
// @from(Ln 190171, Col 4)
UE8 = "errHandlers"
// @from(Ln 190172, Col 4)
YE6 = "rawEmitters"
// @from(Ln 190173, Col 4)
Bm_
// @from(Ln 190173, Col 9)
pm_
// @from(Ln 190173, Col 14)
Fm_ = (q) => pm_.has(XH.extname(q).slice(1).toLowerCase())
// @from(Ln 190174, Col 4)
su1 = (q, K) => {
        if (q instanceof Set) q.forEach(K);
        else K(q)
    }
// @from(Ln 190178, Col 4)
Hs6 = (q, K, _) => {
        let z = q[K];
        if (!(z instanceof Set)) q[K] = z = new Set([z]);
        z.add(_)
    }
// @from(Ln 190183, Col 4)
gm_ = (q) => (K) => {
        let _ = q[K];
        if (_ instanceof Set) _.clear();
        else delete q[K]
    }
// @from(Ln 190188, Col 4)
Js6 = (q, K, _) => {
        let z = q[K];
        if (z instanceof Set) z.delete(_);
        else if (z === _) delete q[K]
    }
// @from(Ln 190193, Col 4)
bA4 = (q) => q instanceof Set ? q.size === 0 : !q
// @from(Ln 190194, Col 4)
QE8
// @from(Ln 190194, Col 9)
dE8 = (q, K, _, z, Y) => {
        let A = QE8.get(q);
        if (!A) return;
        su1(A[K], (O) => {
            O(_, z, Y)
        })
    }
// @from(Ln 190201, Col 4)
Um_ = (q, K, _, z) => {
        let {
            listener: Y,
            errHandler: A,
            rawEmitter: O
        } = z, w = QE8.get(K), $;
        if (!_.persistent) {
            if ($ = hA4(q, _, Y, A, O), !$) return;
            return $.close.bind($)
        }
        if (w) Hs6(w, p$6, Y), Hs6(w, UE8, A), Hs6(w, YE6, O);
        else {
            if ($ = hA4(q, _, dE8.bind(null, K, p$6), A, dE8.bind(null, K, YE6)), !$) return;
            $.on(_p.ERROR, async (j) => {
                let H = dE8.bind(null, K, UE8);
                if (w) w.watcherUnusable = !0;
                if (eu1 && j.code === "EPERM") try {
                    await (await hm_(q, "r")).close(), H(j)
                } catch (J) {} else H(j)
            }), w = {
                listeners: Y,
                errHandlers: A,
                rawEmitters: O,
                watcher: $
            }, QE8.set(K, w)
        }
        return () => {
            if (Js6(w, p$6, Y), Js6(w, UE8, A), Js6(w, YE6, O), bA4(w.listeners)) w.watcher.close(), QE8.delete(K), Bm_.forEach(gm_(w)), w.watcher = void 0, Object.freeze(w)
        }
    }
// @from(Ln 190231, Col 4)
au1
// @from(Ln 190231, Col 9)
Qm_ = (q, K, _, z) => {
        let {
            listener: Y,
            rawEmitter: A
        } = z, O = au1.get(K), w = O && O.options;
        if (w && (w.persistent < _.persistent || w.interval > _.interval)) LA4(K), O = void 0;
        if (O) Hs6(O, p$6, Y), Hs6(O, YE6, A);
        else O = {
            listeners: Y,
            rawEmitters: A,
            options: _,
            watcher: ym_(K, _, ($, j) => {
                su1(O.rawEmitters, (J) => {
                    J(_p.CHANGE, K, {
                        curr: $,
                        prev: j
                    })
                });
                let H = $.mtimeMs;
                if ($.size !== j.size || H > j.mtimeMs || H === 0) su1(O.listeners, (J) => J(q, $))
            })
        }, au1.set(K, O);
        return () => {
            if (Js6(O, p$6, Y), Js6(O, YE6, A), bA4(O.listeners)) au1.delete(K), LA4(K), O.options = O.watcher = void 0, Object.freeze(O)
        }
    }
// @from(Ln 190257, Col 4)
IA4 = L(() => {
    lE8 = process.platform, eu1 = lE8 === "win32", bm_ = lE8 === "darwin", Im_ = lE8 === "linux", xm_ = lE8 === "freebsd", CA4 = Sm_() === "OS400", Pj = {
        ALL: "all",
        READY: "ready",
        ADD: "add",
        CHANGE: "change",
        ADD_DIR: "addDir",
        UNLINK: "unlink",
        UNLINK_DIR: "unlinkDir",
        RAW: "raw",
        ERROR: "error"
    }, _p = Pj, mm_ = {
        lstat: Rm_,
        stat: RA4
    }, Bm_ = [p$6, UE8, YE6], pm_ = new Set(["3dm", "3ds", "3g2", "3gp", "7z", "a", "aac", "adp", "afdesign", "afphoto", "afpub", "ai", "aif", "aiff", "alz", "ape", "apk", "appimage", "ar", "arj", "asf", "au", "avi", "bak", "baml", "bh", "bin", "bk", "bmp", "btif", "bz2", "bzip2", "cab", "caf", "cgm", "class", "cmx", "cpio", "cr2", "cur", "dat", "dcm", "deb", "dex", "djvu", "dll", "dmg", "dng", "doc", "docm", "docx", "dot", "dotm", "dra", "DS_Store", "dsk", "dts", "dtshd", "dvb", "dwg", "dxf", "ecelp4800", "ecelp7470", "ecelp9600", "egg", "eol", "eot", "epub", "exe", "f4v", "fbs", "fh", "fla", "flac", "flatpak", "fli", "flv", "fpx", "fst", "fvt", "g3", "gh", "gif", "graffle", "gz", "gzip", "h261", "h263", "h264", "icns", "ico", "ief", "img", "ipa", "iso", "jar", "jpeg", "jpg", "jpgv", "jpm", "jxr", "key", "ktx", "lha", "lib", "lvp", "lz", "lzh", "lzma", "lzo", "m3u", "m4a", "m4v", "mar", "mdi", "mht", "mid", "midi", "mj2", "mka", "mkv", "mmr", "mng", "mobi", "mov", "movie", "mp3", "mp4", "mp4a", "mpeg", "mpg", "mpga", "mxu", "nef", "npx", "numbers", "nupkg", "o", "odp", "ods", "odt", "oga", "ogg", "ogv", "otf", "ott", "pages", "pbm", "pcx", "pdb", "pdf", "pea", "pgm", "pic", "png", "pnm", "pot", "potm", "potx", "ppa", "ppam", "ppm", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", "psd", "pya", "pyc", "pyo", "pyv", "qt", "rar", "ras", "raw", "resources", "rgb", "rip", "rlc", "rmf", "rmvb", "rpm", "rtf", "rz", "s3m", "s7z", "scpt", "sgi", "shar", "snap", "sil", "sketch", "slk", "smv", "snk", "so", "stl", "suo", "sub", "swf", "tar", "tbz", "tbz2", "tga", "tgz", "thmx", "tif", "tiff", "tlz", "ttc", "ttf", "txz", "udf", "uvh", "uvi", "uvm", "uvp", "uvs", "uvu", "viv", "vob", "war", "wav", "wax", "wbmp", "wdp", "weba", "webm", "webp", "whl", "wim", "wm", "wma", "wmv", "wmx", "woff", "woff2", "wrm", "wvx", "xbm", "xif", "xla", "xlam", "xls", "xlsb", "xlsm", "xlsx", "xlt", "xltm", "xltx", "xm", "xmind", "xpi", "xpm", "xwd", "xz", "z", "zip", "zipx"]), QE8 = new Map;
    au1 = new Map
})
// @from(Ln 190274, Col 4)
dA4 = {}
// @from(Ln 190293, Col 0)
function nE8(q) {
    return Array.isArray(q) ? q : [q]
}
// @from(Ln 190297, Col 0)
function em_(q) {
    if (typeof q === "function") return q;
    if (typeof q === "string") return (K) => q === K;
    if (q instanceof RegExp) return (K) => q.test(K);
    if (typeof q === "object" && q !== null) return (K) => {
        if (q.path === K) return !0;
        if (q.recursive) {
            let _ = Cz.relative(q.path, K);
            if (!_) return !1;
            return !_.startsWith("..") && !Cz.isAbsolute(_)
        }
        return !1
    };
    return () => !1
}
// @from(Ln 190313, Col 0)
function qB_(q) {
    if (typeof q !== "string") throw Error("string expected");
    q = Cz.normalize(q), q = q.replace(/\\/g, "/");
    let K = !1;
    if (q.startsWith("//")) K = !0;
    let _ = /\/\//;
    while (q.match(_)) q = q.replace(_, "/");
    if (K) q = "/" + q;
    return q
}
// @from(Ln 190324, Col 0)
function uA4(q, K, _) {
    let z = qB_(K);
    for (let Y = 0; Y < q.length; Y++) {
        let A = q[Y];
        if (A(z, _)) return !0
    }
    return !1
}
// @from(Ln 190333, Col 0)
function KB_(q, K) {
    if (q == null) throw TypeError("anymatch: specify first argument");
    let z = nE8(q).map((Y) => em_(Y));
    if (K == null) return (Y, A) => {
        return uA4(z, Y, A)
    };
    return uA4(z, K)
}
// @from(Ln 190341, Col 0)
class UA4 {
    constructor(q, K) {
        this.path = q, this._removeWatcher = K, this.items = new Set
    }
    add(q) {
        let {
            items: K
        } = this;
        if (!K) return;
        if (q !== FA4 && q !== rm_) K.add(q)
    }
    async remove(q) {
        let {
            items: K
        } = this;
        if (!K) return;
        if (K.delete(q), K.size > 0) return;
        let _ = this.path;
        try {
            await lm_(_)
        } catch (z) {
            if (this._removeWatcher) this._removeWatcher(Cz.dirname(_), Cz.basename(_))
        }
    }
    has(q) {
        let {
            items: K
        } = this;
        if (!K) return;
        return K.has(q)
    }
    getChildren() {
        let {
            items: q
        } = this;
        if (!q) return [];
        return [...q.values()]
    }
    dispose() {
        this.items.clear(), this.path = "", this._removeWatcher = cE8, this.items = zB_, Object.freeze(this)
    }
}
// @from(Ln 190383, Col 0)
class zm1 {
    constructor(q, K, _) {
        this.fsw = _;
        let z = q;
        this.path = q = q.replace(tm_, ""), this.watchPath = z, this.fullWatchPath = Cz.resolve(z), this.dirParts = [], this.dirParts.forEach((Y) => {
            if (Y.length > 1) Y.pop()
        }), this.followSymlinks = K, this.statMethod = K ? YB_ : AB_
    }
    entryPath(q) {
        return Cz.join(this.watchPath, Cz.relative(this.watchPath, q.fullPath))
    }
    filterPath(q) {
        let {
            stats: K
        } = q;
        if (K && K.isSymbolicLink()) return this.filterDir(q);
        let _ = this.entryPath(q);
        return this.fsw._isntIgnored(_, K) && this.fsw._hasReadPermissions(K)
    }
    filterDir(q) {
        return this.fsw._isntIgnored(this.entryPath(q), q.stats)
    }
}
// @from(Ln 190407, Col 0)
function QA4(q, K = {}) {
    let _ = new iE8(K);
    return _.add(q), _
}
// @from(Ln 190411, Col 4)
Km1 = "/"
// @from(Ln 190412, Col 4)
im_ = "//"
// @from(Ln 190413, Col 4)
FA4 = "."
// @from(Ln 190414, Col 4)
rm_ = ".."
// @from(Ln 190415, Col 4)
om_ = "string"
// @from(Ln 190416, Col 4)
am_
// @from(Ln 190416, Col 9)
xA4
// @from(Ln 190416, Col 14)
sm_
// @from(Ln 190416, Col 19)
tm_
// @from(Ln 190416, Col 24)
_m1 = (q) => typeof q === "object" && q !== null && !(q instanceof RegExp)
// @from(Ln 190417, Col 4)
mA4 = (q) => {
        let K = nE8(q).flat();
        if (!K.every((_) => typeof _ === om_)) throw TypeError(`Non-string provided as watch path: ${K}`);
        return K.map(gA4)
    }
// @from(Ln 190422, Col 4)
BA4 = (q) => {
        let K = q.replace(am_, Km1),
            _ = !1;
        if (K.startsWith(im_)) _ = !0;
        while (K.match(xA4)) K = K.replace(xA4, Km1);
        if (_) K = Km1 + K;
        return K
    }
// @from(Ln 190430, Col 4)
gA4 = (q) => BA4(Cz.normalize(BA4(q)))
// @from(Ln 190431, Col 4)
pA4 = (q = "") => (K) => {
        if (typeof K === "string") return gA4(Cz.isAbsolute(K) ? K : Cz.join(q, K));
        else return K
    }
// @from(Ln 190435, Col 4)
_B_ = (q, K) => {
        if (Cz.isAbsolute(q)) return q;
        return Cz.join(K, q)
    }
// @from(Ln 190439, Col 4)
zB_
// @from(Ln 190439, Col 9)
YB_ = "stat"
// @from(Ln 190440, Col 4)
AB_ = "lstat"
// @from(Ln 190441, Col 4)
iE8
// @from(Ln 190441, Col 9)
oa
// @from(Ln 190442, Col 4)
AE6 = L(() => {
    yA4();
    IA4(); /*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
    am_ = /\\/g, xA4 = /\/\//, sm_ = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, tm_ = /^\.[/\\]/;
    zB_ = Object.freeze(new Set);
    iE8 = class iE8 extends nm_ {
        constructor(q = {}) {
            super();
            this.closed = !1, this._closers = new Map, this._ignoredPaths = new Set, this._throttled = new Map, this._streams = new Set, this._symlinkPaths = new Map, this._watched = new Map, this._pendingWrites = new Map, this._pendingUnlinks = new Map, this._readyCount = 0, this._readyEmitted = !1;
            let K = q.awaitWriteFinish,
                _ = {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                },
                z = {
                    persistent: !0,
                    ignoreInitial: !1,
                    ignorePermissionErrors: !1,
                    interval: 100,
                    binaryInterval: 300,
                    followSymlinks: !0,
                    usePolling: !1,
                    atomic: !0,
                    ...q,
                    ignored: q.ignored ? nE8(q.ignored) : nE8([]),
                    awaitWriteFinish: K === !0 ? _ : typeof K === "object" ? {
                        ..._,
                        ...K
                    } : !1
                };
            if (CA4) z.usePolling = !0;
            if (z.atomic === void 0) z.atomic = !z.usePolling;
            let Y = process.env.CHOKIDAR_USEPOLLING;
            if (Y !== void 0) {
                let w = Y.toLowerCase();
                if (w === "false" || w === "0") z.usePolling = !1;
                else if (w === "true" || w === "1") z.usePolling = !0;
                else z.usePolling = !!w
            }
            let A = process.env.CHOKIDAR_INTERVAL;
            if (A) z.interval = Number.parseInt(A, 10);
            let O = 0;
            this._emitReady = () => {
                if (O++, O >= this._readyCount) this._emitReady = cE8, this._readyEmitted = !0, process.nextTick(() => this.emit(Pj.READY))
            }, this._emitRaw = (...w) => this.emit(Pj.RAW, ...w), this._boundRemove = this._remove.bind(this), this.options = z, this._nodeFsHandler = new qm1(this), Object.freeze(z)
        }
        _addIgnoredPath(q) {
            if (_m1(q)) {
                for (let K of this._ignoredPaths)
                    if (_m1(K) && K.path === q.path && K.recursive === q.recursive) return
            }
            this._ignoredPaths.add(q)
        }
        _removeIgnoredPath(q) {
            if (this._ignoredPaths.delete(q), typeof q === "string") {
                for (let K of this._ignoredPaths)
                    if (_m1(K) && K.path === q) this._ignoredPaths.delete(K)
            }
        }
        add(q, K, _) {
            let {
                cwd: z
            } = this.options;
            this.closed = !1, this._closePromise = void 0;
            let Y = mA4(q);
            if (z) Y = Y.map((A) => {
                return _B_(A, z)
            });
            if (Y.forEach((A) => {
                    this._removeIgnoredPath(A)
                }), this._userIgnored = void 0, !this._readyCount) this._readyCount = 0;
            return this._readyCount += Y.length, Promise.all(Y.map(async (A) => {
                let O = await this._nodeFsHandler._addToNodeFs(A, !_, void 0, 0, K);
                if (O) this._emitReady();
                return O
            })).then((A) => {
                if (this.closed) return;
                A.forEach((O) => {
                    if (O) this.add(Cz.dirname(O), Cz.basename(K || O))
                })
            }), this
        }
        unwatch(q) {
            if (this.closed) return this;
            let K = mA4(q),
                {
                    cwd: _
                } = this.options;
            return K.forEach((z) => {
                if (!Cz.isAbsolute(z) && !this._closers.has(z)) {
                    if (_) z = Cz.join(_, z);
                    z = Cz.resolve(z)
                }
                if (this._closePath(z), this._addIgnoredPath(z), this._watched.has(z)) this._addIgnoredPath({
                    path: z,
                    recursive: !0
                });
                this._userIgnored = void 0
            }), this
        }
        close() {
            if (this._closePromise) return this._closePromise;
            this.closed = !0, this.removeAllListeners();
            let q = [];
            return this._closers.forEach((K) => K.forEach((_) => {
                let z = _();
                if (z instanceof Promise) q.push(z)
            })), this._streams.forEach((K) => K.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((K) => K.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = q.length ? Promise.all(q).then(() => {
                return
            }) : Promise.resolve(), this._closePromise
        }
        getWatched() {
            let q = {};
            return this._watched.forEach((K, _) => {
                let Y = (this.options.cwd ? Cz.relative(this.options.cwd, _) : _) || FA4;
                q[Y] = K.getChildren().sort()
            }), q
        }
        emitWithAll(q, K) {
            if (this.emit(q, ...K), q !== Pj.ERROR) this.emit(Pj.ALL, q, ...K)
        }
        async _emit(q, K, _) {
            if (this.closed) return;
            let z = this.options;
            if (eu1) K = Cz.normalize(K);
            if (z.cwd) K = Cz.relative(z.cwd, K);
            let Y = [K];
            if (_ != null) Y.push(_);
            let A = z.awaitWriteFinish,
                O;
            if (A && (O = this._pendingWrites.get(K))) return O.lastChange = new Date, this;
            if (z.atomic) {
                if (q === Pj.UNLINK) return this._pendingUnlinks.set(K, [q, ...Y]), setTimeout(() => {
                    this._pendingUnlinks.forEach((w, $) => {
                        this.emit(...w), this.emit(Pj.ALL, ...w), this._pendingUnlinks.delete($)
                    })
                }, typeof z.atomic === "number" ? z.atomic : 100), this;
                if (q === Pj.ADD && this._pendingUnlinks.has(K)) q = Pj.CHANGE, this._pendingUnlinks.delete(K)
            }
            if (A && (q === Pj.ADD || q === Pj.CHANGE) && this._readyEmitted) {
                let w = ($, j) => {
                    if ($) q = Pj.ERROR, Y[0] = $, this.emitWithAll(q, Y);
                    else if (j) {
                        if (Y.length > 1) Y[1] = j;
                        else Y.push(j);
                        this.emitWithAll(q, Y)
                    }
                };
                return this._awaitWriteFinish(K, A.stabilityThreshold, q, w), this
            }
            if (q === Pj.CHANGE) {
                if (!this._throttle(Pj.CHANGE, K, 50)) return this
            }
            if (z.alwaysStat && _ === void 0 && (q === Pj.ADD || q === Pj.ADD_DIR || q === Pj.CHANGE)) {
                let w = z.cwd ? Cz.join(z.cwd, K) : K,
                    $;
                try {
                    $ = await cm_(w)
                } catch (j) {}
                if (!$ || this.closed) return;
                Y.push($)
            }
            return this.emitWithAll(q, Y), this
        }
        _handleError(q) {
            let K = q && q.code;
            if (q && K !== "ENOENT" && K !== "ENOTDIR" && (!this.options.ignorePermissionErrors || K !== "EPERM" && K !== "EACCES")) this.emit(Pj.ERROR, q);
            return q || this.closed
        }
        _throttle(q, K, _) {
            if (!this._throttled.has(q)) this._throttled.set(q, new Map);
            let z = this._throttled.get(q);
            if (!z) throw Error("invalid throttle");
            let Y = z.get(K);
            if (Y) return Y.count++, !1;
            let A, O = () => {
                let $ = z.get(K),
                    j = $ ? $.count : 0;
                if (z.delete(K), clearTimeout(A), $) clearTimeout($.timeoutObject);
                return j
            };
            A = setTimeout(O, _);
            let w = {
                timeoutObject: A,
                clear: O,
                count: 0
            };
            return z.set(K, w), w
        }
        _incrReadyCount() {
            return this._readyCount++
        }
        _awaitWriteFinish(q, K, _, z) {
            let Y = this.options.awaitWriteFinish;
            if (typeof Y !== "object") return;
            let A = Y.pollInterval,
                O, w = q;
            if (this.options.cwd && !Cz.isAbsolute(q)) w = Cz.join(this.options.cwd, q);
            let $ = new Date,
                j = this._pendingWrites;

            function H(J) {
                dm_(w, (X, M) => {
                    if (X || !j.has(q)) {
                        if (X && X.code !== "ENOENT") z(X);
                        return
                    }
                    let P = Number(new Date);
                    if (J && M.size !== J.size) j.get(q).lastChange = P;
                    let W = j.get(q);
                    if (P - W.lastChange >= K) j.delete(q), z(void 0, M);
                    else O = setTimeout(H, A, M)
                })
            }
            if (!j.has(q)) j.set(q, {
                lastChange: $,
                cancelWait: () => {
                    return j.delete(q), clearTimeout(O), _
                }
            }), O = setTimeout(H, A)
        }
        _isIgnored(q, K) {
            if (this.options.atomic && sm_.test(q)) return !0;
            if (!this._userIgnored) {
                let {
                    cwd: _
                } = this.options, Y = (this.options.ignored || []).map(pA4(_)), O = [...[...this._ignoredPaths].map(pA4(_)), ...Y];
                this._userIgnored = KB_(O, void 0)
            }
            return this._userIgnored(q, K)
        }
        _isntIgnored(q, K) {
            return !this._isIgnored(q, K)
        }
        _getWatchHelpers(q) {
            return new zm1(q, this.options.followSymlinks, this)
        }
        _getWatchedDir(q) {
            let K = Cz.resolve(q);
            if (!this._watched.has(K)) this._watched.set(K, new UA4(K, this._boundRemove));
            return this._watched.get(K)
        }
        _hasReadPermissions(q) {
            if (this.options.ignorePermissionErrors) return !0;
            return Boolean(Number(q.mode) & 256)
        }
        _remove(q, K, _) {
            let z = Cz.join(q, K),
                Y = Cz.resolve(z);
            if (_ = _ != null ? _ : this._watched.has(z) || this._watched.has(Y), !this._throttle("remove", z, 100)) return;
            if (!_ && this._watched.size === 1) this.add(q, K, !0);
            this._getWatchedDir(z).getChildren().forEach((J) => this._remove(z, J));
            let w = this._getWatchedDir(q),
                $ = w.has(K);
            if (w.remove(K), this._symlinkPaths.has(Y)) this._symlinkPaths.delete(Y);
            let j = z;
            if (this.options.cwd) j = Cz.relative(this.options.cwd, z);
            if (this.options.awaitWriteFinish && this._pendingWrites.has(j)) {
                if (this._pendingWrites.get(j).cancelWait() === Pj.ADD) return
            }
            this._watched.delete(z), this._watched.delete(Y);
            let H = _ ? Pj.UNLINK_DIR : Pj.UNLINK;
            if ($ && !this._isIgnored(z)) this._emit(H, z);
            this._closePath(z)
        }
        _closePath(q) {
            this._closeFile(q);
            let K = Cz.dirname(q);
            this._getWatchedDir(K).remove(Cz.basename(q))
        }
        _closeFile(q) {
            let K = this._closers.get(q);
            if (!K) return;
            K.forEach((_) => _()), this._closers.delete(q)
        }
        _addPathCloser(q, K) {
            if (!K) return;
            let _ = this._closers.get(q);
            if (!_) _ = [], this._closers.set(q, _);
            _.push(K)
        }
        _readdirp(q, K) {
            if (this.closed) return;
            let _ = {
                    type: Pj.ALL,
                    alwaysStat: !0,
                    lstat: !0,
                    ...K,
                    depth: 0
                },
                z = EA4(q, _);
            return this._streams.add(z), z.once(SA4, () => {
                z = void 0
            }), z.once(tu1, () => {
                if (z) this._streams.delete(z), z = void 0
            }), z
        }
    };
    oa = {
        watch: QA4,
        FSWatcher: iE8
    }
})
// @from(Ln 190745, Col 4)
OB_
// @from(Ln 190745, Col 9)
wB_
// @from(Ln 190745, Col 14)
cA4
// @from(Ln 190745, Col 19)
OE6
// @from(Ln 190746, Col 4)
rE8 = L(() => {
    NK();
    OB_ = y1() === "windows" ? "alt+v" : "ctrl+v", wB_ = y1() !== "windows" || (m16() ? Qx1(process.versions.bun, ">=1.2.23") : Qx1(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), cA4 = wB_ ? "shift+tab" : "meta+m", OE6 = [{
        context: "Global",
        bindings: {
            "ctrl+c": "app:interrupt",
            "ctrl+d": "app:exit",
            "ctrl+t": "app:toggleTodos",
            "ctrl+o": "app:toggleTranscript",
            ...{
                "ctrl+shift+b": "app:toggleBrief"
            },
            "ctrl+shift+o": "app:toggleTeammatePreview",
            "ctrl+r": "history:search",
            ...{},
            ...{},
            ...{}
        }
    }, {
        context: "Chat",
        bindings: {
            escape: "chat:cancel",
            "ctrl+l": "chat:clearInput",
            "ctrl+x ctrl+k": "chat:killAgents",
            [cA4]: "chat:cycleMode",
            "meta+p": "chat:modelPicker",
            "meta+o": "chat:fastMode",
            "meta+t": "chat:thinkingToggle",
            enter: "chat:submit",
            "ctrl+j": "chat:newline",
            up: "history:previous",
            down: "history:next",
            "ctrl+_": "chat:undo",
            "ctrl+shift+-": "chat:undo",
            "ctrl+x ctrl+e": "chat:externalEditor",
            "ctrl+g": "chat:externalEditor",
            "ctrl+s": "chat:stash",
            [OB_]: "chat:imagePaste",
            ...{},
            ...{
                space: "voice:pushToTalk"
            }
        }
    }, {
        context: "Autocomplete",
        bindings: {
            tab: "autocomplete:accept",
            escape: "autocomplete:dismiss",
            up: "autocomplete:previous",
            down: "autocomplete:next"
        }
    }, {
        context: "Settings",
        bindings: {
            escape: "confirm:no",
            up: "select:previous",
            down: "select:next",
            k: "select:previous",
            j: "select:next",
            "ctrl+p": "select:previous",
            "ctrl+n": "select:next",
            space: "select:accept",
            enter: "settings:close",
            "/": "settings:search",
            r: "settings:retry",
            d: "settings:periodDay",
            w: "settings:periodWeek",
            t: "settings:sortByTokens"
        }
    }, {
        context: "Doctor",
        bindings: {
            f: "doctor:fix"
        }
    }, {
        context: "Confirmation",
        bindings: {
            y: "confirm:yes",
            n: "confirm:no",
            enter: "confirm:yes",
            escape: "confirm:no",
            up: "confirm:previous",
            down: "confirm:next",
            tab: "confirm:nextField",
            space: "confirm:toggle",
            [cA4]: "confirm:cycleMode",
            "ctrl+e": "confirm:toggleExplanation",
            "ctrl+d": "permission:toggleDebug"
        }
    }, {
        context: "Tabs",
        bindings: {
            tab: "tabs:next",
            "shift+tab": "tabs:previous",
            right: "tabs:next",
            left: "tabs:previous"
        }
    }, {
        context: "Transcript",
        bindings: {
            "ctrl+e": "transcript:toggleShowAll",
            "ctrl+c": "transcript:exit",
            escape: "transcript:exit",
            q: "transcript:exit",
            "ctrl+u": "scroll:halfPageUp",
            "ctrl+d": "scroll:halfPageDown",
            "ctrl+b": "scroll:fullPageUp",
            "ctrl+f": "scroll:fullPageDown",
            "ctrl+n": "scroll:lineDown",
            "ctrl+p": "scroll:lineUp",
            g: "scroll:top",
            "shift+g": "scroll:bottom",
            j: "scroll:lineDown",
            k: "scroll:lineUp",
            space: "scroll:fullPageDown",
            b: "scroll:fullPageUp",
            up: "scroll:lineUp",
            down: "scroll:lineDown",
            home: "scroll:top",
            end: "scroll:bottom"
        }
    }, {
        context: "HistorySearch",
        bindings: {
            "ctrl+r": "historySearch:next",
            escape: "historySearch:accept",
            tab: "historySearch:accept",
            "ctrl+c": "historySearch:cancel",
            enter: "historySearch:execute"
        }
    }, {
        context: "Task",
        bindings: {
            "ctrl+b": "task:background"
        }
    }, {
        context: "ThemePicker",
        bindings: {
            "ctrl+t": "theme:toggleSyntaxHighlighting"
        }
    }, {
        context: "Scroll",
        bindings: {
            pageup: "scroll:pageUp",
            pagedown: "scroll:pageDown",
            wheelup: "scroll:lineUp",
            wheeldown: "scroll:lineDown",
            "ctrl+home": "scroll:top",
            "ctrl+end": "scroll:bottom",
            "ctrl+shift+c": "selection:copy",
            "cmd+c": "selection:copy",
            "shift+left": "selection:extendLeft",
            "shift+right": "selection:extendRight",
            "shift+up": "selection:extendUp",
            "shift+down": "selection:extendDown",
            "shift+home": "selection:extendLineStart",
            "shift+end": "selection:extendLineEnd"
        }
    }, {
        context: "Help",
        bindings: {
            escape: "help:dismiss"
        }
    }, {
        context: "Attachments",
        bindings: {
            right: "attachments:next",
            left: "attachments:previous",
            backspace: "attachments:remove",
            delete: "attachments:remove",
            down: "attachments:exit",
            escape: "attachments:exit"
        }
    }, {
        context: "Footer",
        bindings: {
            up: "footer:up",
            "ctrl+p": "footer:up",
            down: "footer:down",
            "ctrl+n": "footer:down",
            right: "footer:next",
            left: "footer:previous",
            enter: "footer:openSelected",
            escape: "footer:clearSelection"
        }
    }, {
        context: "MessageSelector",
        bindings: {
            up: "messageSelector:up",
            down: "messageSelector:down",
            k: "messageSelector:up",
            j: "messageSelector:down",
            "ctrl+p": "messageSelector:up",
            "ctrl+n": "messageSelector:down",
            "ctrl+up": "messageSelector:top",
            "shift+up": "messageSelector:top",
            "meta+up": "messageSelector:top",
            "shift+k": "messageSelector:top",
            "ctrl+down": "messageSelector:bottom",
            "shift+down": "messageSelector:bottom",
            "meta+down": "messageSelector:bottom",
            "shift+j": "messageSelector:bottom",
            enter: "messageSelector:select"
        }
    }, ...[], {
        context: "DiffDialog",
        bindings: {
            escape: "diff:dismiss",
            left: "diff:previousSource",
            right: "diff:nextSource",
            up: "diff:previousFile",
            down: "diff:nextFile",
            enter: "diff:viewDetails"
        }
    }, {
        context: "ModelPicker",
        bindings: {
            left: "modelPicker:decreaseEffort",
            right: "modelPicker:increaseEffort"
        }
    }, {
        context: "Select",
        bindings: {
            up: "select:previous",
            down: "select:next",
            j: "select:next",
            k: "select:previous",
            "ctrl+n": "select:next",
            "ctrl+p": "select:previous",
            enter: "select:accept",
            escape: "select:cancel"
        }
    }, {
        context: "Plugin",
        bindings: {
            space: "plugin:toggle",
            i: "plugin:install",
            f: "plugin:favorite"
        }
    }]
})
// @from(Ln 190988, Col 0)
function Xs6(q) {
    let K = q.split("+"),
        _ = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1,
            super: !1
        };
    for (let z of K) {
        let Y = z.toLowerCase();
        switch (Y) {
            case "ctrl":
            case "control":
                _.ctrl = !0;
                break;
            case "alt":
            case "opt":
            case "option":
                _.alt = !0;
                break;
            case "shift":
                _.shift = !0;
                break;
            case "meta":
                _.meta = !0;
                break;
            case "cmd":
            case "command":
            case "super":
            case "win":
                _.super = !0;
                break;
            case "esc":
                _.key = "escape";
                break;
            case "return":
                _.key = "enter";
                break;
            case "del":
                _.key = "delete";
                break;
            case "space":
                _.key = " ";
                break;
            case "↑":
                _.key = "up";
                break;
            case "↓":
                _.key = "down";
                break;
            case "←":
                _.key = "left";
                break;
            case "→":
                _.key = "right";
                break;
            default:
                _.key = Y;
                break
        }
    }
    return _
}
// @from(Ln 191054, Col 0)
function Ms6(q) {
    if (q === " ") return [Xs6("space")];
    return q.trim().split(/\s+/).map(Xs6)
}
// @from(Ln 191059, Col 0)
function $B_(q) {
    let K = [];
    if (q.ctrl) K.push("ctrl");
    if (q.alt) K.push("alt");
    if (q.shift) K.push("shift");
    if (q.meta) K.push("meta");
    if (q.super) K.push("cmd");
    let _ = jB_(q.key);
    return K.push(_), K.join("+")
}
// @from(Ln 191070, Col 0)
function jB_(q) {
    switch (q) {
        case "escape":
            return "Esc";
        case " ":
            return "Space";
        case "tab":
            return "tab";
        case "enter":
            return "Enter";
        case "backspace":
            return "Backspace";
        case "delete":
            return "Delete";
        case "up":
            return "↑";
        case "down":
            return "↓";
        case "left":
            return "←";
        case "right":
            return "→";
        case "pageup":
            return "PageUp";
        case "pagedown":
            return "PageDown";
        case "home":
            return "Home";
        case "end":
            return "End";
        default:
            return q
    }
}
// @from(Ln 191105, Col 0)
function g$6(q) {
    return q.map($B_).join(" ")
}
// @from(Ln 191109, Col 0)
function oE8(q) {
    let K = [];
    for (let _ of q)
        for (let [z, Y] of Object.entries(_.bindings)) K.push({
            chord: Ms6(z),
            action: Y,
            context: _.context
        });
    return K
}
// @from(Ln 191120, Col 0)
function lA4() {
    let q = y1(),
        K = [...Ps6, ...Ym1];
    if (q === "macos") K.push(...Am1);
    return K
}
// @from(Ln 191127, Col 0)
function U$6(q) {
    if (q === " ") return "space";
    return q.trim().split(/\s+/).map(JB_).join(" ")
}
// @from(Ln 191132, Col 0)
function JB_(q) {
    let K = q.split("+"),
        _ = [],
        z = "";
    for (let Y of K) {
        let A = Y.trim().toLowerCase();
        if (["ctrl", "control", "alt", "opt", "option", "meta", "cmd", "command", "super", "win", "shift"].includes(A))
            if (A === "control") _.push("ctrl");
            else if (A === "option" || A === "opt" || A === "meta") _.push("alt");
        else if (A === "command" || A === "cmd" || A === "super" || A === "win") _.push("cmd");
        else _.push(A);
        else z = HB_[A] ?? A
    }
    return _.sort(), [..._, z].join("+")
}
// @from(Ln 191147, Col 4)
Ps6
// @from(Ln 191147, Col 9)
Ym1
// @from(Ln 191147, Col 14)
Am1
// @from(Ln 191147, Col 19)
HB_
// @from(Ln 191148, Col 4)
aE8 = L(() => {
    NK();
    Ps6 = [{
        key: "ctrl+c",
        reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+d",
        reason: "Cannot be rebound - used for exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+m",
        reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
        severity: "error"
    }], Ym1 = [{
        key: "ctrl+z",
        reason: "Unix process suspend (SIGTSTP)",
        severity: "warning"
    }, {
        key: "ctrl+\\",
        reason: "Terminal quit signal (SIGQUIT)",
        severity: "error"
    }], Am1 = [{
        key: "cmd+c",
        reason: "macOS system copy",
        severity: "error"
    }, {
        key: "cmd+v",
        reason: "macOS system paste",
        severity: "error"
    }, {
        key: "cmd+x",
        reason: "macOS system cut",
        severity: "error"
    }, {
        key: "cmd+q",
        reason: "macOS quit application",
        severity: "error"
    }, {
        key: "cmd+w",
        reason: "macOS close window/tab",
        severity: "error"
    }, {
        key: "cmd+tab",
        reason: "macOS app switcher",
        severity: "error"
    }, {
        key: "cmd+space",
        reason: "macOS Spotlight",
        severity: "error"
    }];
    HB_ = {
        esc: "escape",
        return: "enter",
        del: "delete",
        "↑": "up",
        "↓": "down",
        "←": "left",
        "→": "right"
    }
})
// @from(Ln 191209, Col 4)
Ws6
// @from(Ln 191209, Col 9)
Om1
// @from(Ln 191209, Col 14)
nA4
// @from(Ln 191209, Col 19)
wm1
// @from(Ln 191209, Col 24)
XB_
// @from(Ln 191209, Col 29)
z_w
// @from(Ln 191210, Col 4)
$m1 = L(() => {
    p7();
    Ws6 = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin", "Scroll", "MessageActions", "Doctor"], Om1 = /^messageActions:[a-zA-Z0-9:\-_]+$/, nA4 = {
        Global: "Active everywhere, regardless of focus",
        Chat: "When the chat input is focused",
        Autocomplete: "When autocomplete menu is visible",
        Confirmation: "When a confirmation/permission dialog is shown",
        Help: "When the help overlay is open",
        Transcript: "When viewing the transcript",
        HistorySearch: "When searching command history (ctrl+r)",
        Task: "When a task/agent is running in the foreground",
        ThemePicker: "When the theme picker is open",
        Settings: "When the settings menu is open",
        Tabs: "When tab navigation is active",
        Attachments: "When navigating image attachments in a select dialog",
        Footer: "When footer indicators are focused",
        MessageSelector: "When the message selector (rewind) is open",
        DiffDialog: "When the diff dialog is open",
        ModelPicker: "When the model picker is open",
        Select: "When a select/list component is focused",
        Plugin: "When the plugin dialog is open",
        Scroll: "When a scrollable view is focused (fullscreen layout)",
        MessageActions: "When the message actions menu is open (fullscreen layout)",
        Doctor: "When the /doctor diagnostics screen is open"
    }, wm1 = ["app:interrupt", "app:exit", "app:toggleTodos", "app:toggleTranscript", "app:toggleBrief", "app:toggleTeammatePreview", "app:toggleTerminal", "app:redraw", "app:globalSearch", "app:quickOpen", "app:openFrame", "history:search", "history:previous", "history:next", "chat:cancel", "chat:killAgents", "chat:cycleMode", "chat:modelPicker", "chat:fastMode", "chat:thinkingToggle", "chat:submit", "chat:newline", "chat:undo", "chat:externalEditor", "chat:stash", "chat:imagePaste", "chat:messageActions", "chat:clearInput", "autocomplete:accept", "autocomplete:dismiss", "autocomplete:previous", "autocomplete:next", "confirm:yes", "confirm:no", "confirm:previous", "confirm:next", "confirm:nextField", "confirm:previousField", "confirm:cycleMode", "confirm:toggle", "confirm:toggleExplanation", "tabs:next", "tabs:previous", "transcript:toggleShowAll", "transcript:exit", "historySearch:next", "historySearch:accept", "historySearch:cancel", "historySearch:execute", "task:background", "theme:toggleSyntaxHighlighting", "help:dismiss", "attachments:next", "attachments:previous", "attachments:remove", "attachments:exit", "footer:up", "footer:down", "footer:next", "footer:previous", "footer:openSelected", "footer:clearSelection", "footer:close", "messageSelector:up", "messageSelector:down", "messageSelector:top", "messageSelector:bottom", "messageSelector:select", "diff:dismiss", "diff:previousSource", "diff:nextSource", "diff:back", "diff:viewDetails", "diff:previousFile", "diff:nextFile", "modelPicker:decreaseEffort", "modelPicker:increaseEffort", "select:next", "select:previous", "select:accept", "select:cancel", "plugin:toggle", "plugin:install", "plugin:favorite", "doctor:fix", "permission:toggleDebug", "settings:search", "settings:retry", "settings:close", "settings:periodDay", "settings:periodWeek", "settings:sortByTokens", "voice:pushToTalk", "scroll:pageUp", "scroll:pageDown", "scroll:lineUp", "scroll:lineDown", "scroll:top", "scroll:bottom", "scroll:halfPageUp", "scroll:halfPageDown", "scroll:fullPageUp", "scroll:fullPageDown", "selection:copy", "selection:clear", "selection:extendLeft", "selection:extendRight", "selection:extendUp", "selection:extendDown", "selection:extendLineStart", "selection:extendLineEnd"], XB_ = C6(() => y.object({
        context: y.enum(Ws6).describe("UI context where these bindings apply. Global bindings work everywhere."),
        bindings: y.record(y.string().describe('Keystroke pattern (e.g., "ctrl+k", "shift+tab")'), y.union([y.enum(wm1), y.string().regex(/^command:[a-zA-Z0-9:\-_]+$/).describe('Command binding (e.g., "command:help", "command:compact"). Executes the slash command as if typed.'), y.string().regex(Om1).describe('Message action binding (e.g., "messageActions:copy"). Triggers a registered message action.'), y.null().describe("Set to null to unbind a default shortcut")]).describe("Action to trigger, command to invoke, or null to unbind")).describe("Map of keystroke patterns to actions")
    }).describe("A block of keybindings for a specific context")), z_w = C6(() => y.object({
        $schema: y.string().optional().describe("JSON Schema URL for editor validation"),
        $docs: y.string().optional().describe("Documentation URL"),
        bindings: y.array(XB_()).describe("Array of keybinding blocks by context")
    }).describe("Claude Code keybindings configuration. Customize keyboard shortcuts by context."))
})
// @from(Ln 191244, Col 0)
function PB_(q) {
    return MB_().safeParse(q).success
}
// @from(Ln 191248, Col 0)
function sE8(q) {
    return Array.isArray(q) && q.every(PB_)
}
// @from(Ln 191252, Col 0)
function WB_(q) {
    return iA4.includes(q)
}
// @from(Ln 191256, Col 0)
function DB_(q) {
    let K = q.toLowerCase().split("+");
    for (let z of K)
        if (!z.trim()) return {
            type: "parse_error",
            severity: "error",
            message: `Empty key part in "${q}"`,
            key: q,
            suggestion: 'Remove extra "+" characters'
        };
    let _ = Xs6(q);
    if (!_.key && !_.ctrl && !_.alt && !_.shift && !_.meta) return {
        type: "parse_error",
        severity: "error",
        message: `Could not parse keystroke "${q}"`,
        key: q
    };
    return null
}
// @from(Ln 191276, Col 0)
function ZB_(q, K) {
    let _ = [];
    if (typeof q !== "object" || q === null) return _.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${K+1} is not an object`
    }), _;
    let z = q,
        Y = z.context,
        A;
    if (typeof Y !== "string") _.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${K+1} missing "context" field`
    });
    else if (!WB_(Y)) _.push({
        type: "invalid_context",
        severity: "error",
        message: `Unknown context "${Y}"`,
        context: Y,
        suggestion: `Valid contexts: ${iA4.join(", ")}`
    });
    else A = Y;
    if (typeof z.bindings !== "object" || z.bindings === null) return _.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${K+1} missing "bindings" field`
    }), _;
    let O = z.bindings;
    for (let [w, $] of Object.entries(O)) {
        let j = DB_(w);
        if (j) j.context = A, _.push(j);
        if ($ !== null && typeof $ !== "string") _.push({
            type: "invalid_action",
            severity: "error",
            message: `Invalid action for "${w}": must be a string or null`,
            key: w,
            context: A
        });
        else if (typeof $ === "string" && $.startsWith("command:")) {
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test($)) _.push({
                type: "invalid_action",
                severity: "warning",
                message: `Invalid command binding "${$}" for "${w}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                key: w,
                context: A,
                action: $
            });
            if (A && A !== "Chat") _.push({
                type: "invalid_action",
                severity: "warning",
                message: `Command binding "${$}" must be in "Chat" context, not "${A}"`,
                key: w,
                context: A,
                action: $,
                suggestion: 'Move this binding to a block with "context": "Chat"'
            })
        } else if (typeof $ === "string" && $.startsWith("messageActions:")) {
            if (!Om1.test($)) _.push({
                type: "invalid_action",
                severity: "warning",
                message: `Invalid messageActions binding "${$}" for "${w}": action name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                key: w,
                context: A,
                action: $
            });
            if (A && A !== "MessageActions") _.push({
                type: "invalid_action",
                severity: "warning",
                message: `messageActions binding "${$}" must be in "MessageActions" context, not "${A}"`,
                key: w,
                context: A,
                action: $,
                suggestion: 'Move this binding to a block with "context": "MessageActions"'
            })
        } else if ($ === "voice:pushToTalk") {
            let H = Ms6(w)[0];
            if (H && !H.ctrl && !H.alt && !H.shift && !H.meta && !H.super && /^[a-z]$/.test(H.key)) _.push({
                type: "invalid_action",
                severity: "warning",
                message: `Binding "${w}" to voice:pushToTalk prints into the input during warmup; use space or a modifier combo like meta+k`,
                key: w,
                context: A,
                action: $
            })
        }
    }
    return _
}
// @from(Ln 191366, Col 0)
function jm1(q) {
    let K = [],
        _ = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
        z;
    while ((z = _.exec(q)) !== null) {
        let Y = z[1];
        if (!Y) continue;
        let w = q.slice(0, z.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
            $ = /"([^"]+)"\s*:/g,
            j = new Map,
            H;
        while ((H = $.exec(Y)) !== null) {
            let J = H[1];
            if (!J) continue;
            let X = (j.get(J) ?? 0) + 1;
            if (j.set(J, X), X === 2) K.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate key "${J}" in ${w} bindings`,
                key: J,
                context: w,
                suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
            })
        }
    }
    return K
}
// @from(Ln 191394, Col 0)
function fB_(q) {
    let K = [];
    if (!Array.isArray(q)) return K.push({
        type: "parse_error",
        severity: "error",
        message: "keybindings.json must contain an array",
        suggestion: "Wrap your bindings in [ ]"
    }), K;
    for (let _ = 0; _ < q.length; _++) K.push(...ZB_(q[_], _));
    return K
}
// @from(Ln 191406, Col 0)
function GB_(q) {
    let K = [],
        _ = new Map;
    for (let z of q) {
        let Y = _.get(z.context) ?? new Map;
        _.set(z.context, Y);
        for (let [A, O] of Object.entries(z.bindings)) {
            let w = U$6(A),
                $ = Y.get(w);
            if ($ && $ !== O) K.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate binding "${A}" in ${z.context} context`,
                key: A,
                context: z.context,
                action: O ?? "null (unbind)",
                suggestion: `Previously bound to "${$}". Only the last binding will be used.`
            });
            Y.set(w, O ?? "null")
        }
    }
    return K
}
// @from(Ln 191430, Col 0)
function vB_(q) {
    let K = [],
        _ = lA4();
    for (let z of q) {
        let Y = g$6(z.chord),
            A = U$6(Y);
        for (let O of _)
            if (U$6(O.key) === A) K.push({
                type: "reserved",
                severity: O.severity,
                message: `"${Y}" may not work: ${O.reason}`,
                key: Y,
                context: z.context,
                action: z.action ?? void 0
            })
    }
    return K
}
// @from(Ln 191449, Col 0)
function TB_(q) {
    let K = [];
    for (let _ of q)
        for (let [z, Y] of Object.entries(_.bindings)) {
            let A = z.split(" ").map((O) => Xs6(O));
            K.push({
                chord: A,
                action: Y,
                context: _.context
            })
        }
    return K
}
// @from(Ln 191463, Col 0)
function Hm1(q, K) {
    let _ = [];
    if (_.push(...fB_(q)), sE8(q)) {
        _.push(...GB_(q));
        let Y = TB_(q);
        _.push(...vB_(Y))
    }
    let z = new Set;
    return _.filter((Y) => {
        let A = `${Y.type}:${Y.key}:${Y.context}`;
        if (z.has(A)) return !1;
        return z.add(A), !0
    })
}
// @from(Ln 191477, Col 4)
MB_
// @from(Ln 191477, Col 9)
iA4
// @from(Ln 191478, Col 4)
rA4 = L(() => {
    p7();
    aE8();
    $m1();
    MB_ = C6(() => y.object({
        context: y.string(),
        bindings: y.record(y.string(), y.string().nullable())
    }));
    iA4 = Ws6
})
// @from(Ln 191500, Col 0)
function WR() {
    return u8("tengu_keybinding_customization_release", !0)
}
// @from(Ln 191504, Col 0)
function RB_() {
    return {
        bindings: null,
        warnings: [],
        watcher: null,
        initialized: !1,
        disposed: !1,
        lastCustomBindingsLogDate: null,
        changed: l5()
    }
}
// @from(Ln 191516, Col 0)
function aA4(q, K) {
    let _ = new Date().toISOString().slice(0, 10);
    if (q.lastCustomBindingsLogDate === _) return;
    q.lastCustomBindingsLogDate = _, d("tengu_custom_keybindings_loaded", {
        user_binding_count: K
    })
}
// @from(Ln 191524, Col 0)
function aa() {
    return yB_(A7(), "keybindings.json")
}
// @from(Ln 191528, Col 0)
function Jm1() {
    return oE8(OE6)
}
// @from(Ln 191531, Col 0)
async function SB_(q) {
    let K = Jm1();
    if (!WR()) return {
        bindings: K,
        warnings: []
    };
    let _ = aa();
    try {
        let z = await kB_(_, "utf-8"),
            Y = n8(z),
            A;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) A = Y.bindings;
        else return E('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
            bindings: K,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: 'keybindings.json must have a "bindings" array',
                suggestion: 'Use format: { "bindings": [ ... ] }'
            }]
        };
        if (!sE8(A)) {
            let H = !Array.isArray(A) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                J = !Array.isArray(A) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object mapping keys to a string action or null)';
            return E(`[keybindings] Invalid keybindings.json: ${H}`), {
                bindings: K,
                warnings: [{
                    type: "parse_error",
                    severity: "error",
                    message: H,
                    suggestion: J
                }]
            }
        }
        let O = oE8(A);
        E(`[keybindings] Loaded ${O.length} user bindings from ${_}`);
        let w = [...K, ...O];
        aA4(q, O.length);
        let j = [...jm1(z), ...Hm1(A, w)];
        if (j.length > 0) E(`[keybindings] Found ${j.length} validation issue(s)`);
        return {
            bindings: w,
            warnings: j
        }
    } catch (z) {
        if (t1(z)) return {
            bindings: K,
            warnings: []
        };
        return E(`[keybindings] Error loading ${_}: ${b6(z)}`), {
            bindings: K,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: `Failed to parse keybindings.json: ${b6(z)}`
            }]
        }
    }
}
// @from(Ln 191591, Col 0)
function sA4(q) {
    if (q.bindings) return q.bindings;
    return Ds6(q).bindings
}
// @from(Ln 191596, Col 0)
function Ds6(q) {
    if (q.bindings) return {
        bindings: q.bindings,
        warnings: q.warnings
    };
    let K = Jm1();
    if (!WR()) return q.bindings = K, q.warnings = [], {
        bindings: q.bindings,
        warnings: q.warnings
    };
    let _ = aa();
    try {
        let z = VB_(_, "utf-8"),
            Y = n8(z),
            A;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) A = Y.bindings;
        else return q.bindings = K, q.warnings = [{
            type: "parse_error",
            severity: "error",
            message: 'keybindings.json must have a "bindings" array',
            suggestion: 'Use format: { "bindings": [ ... ] }'
        }], {
            bindings: q.bindings,
            warnings: q.warnings
        };
        if (!sE8(A)) {
            let $ = !Array.isArray(A) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                j = !Array.isArray(A) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object mapping keys to a string action or null)';
            return q.bindings = K, q.warnings = [{
                type: "parse_error",
                severity: "error",
                message: $,
                suggestion: j
            }], {
                bindings: q.bindings,
                warnings: q.warnings
            }
        }
        let O = oE8(A);
        E(`[keybindings] Loaded ${O.length} user bindings from ${_}`), q.bindings = [...K, ...O], aA4(q, O.length);
        let w = jm1(z);
        if (q.warnings = [...w, ...Hm1(A, q.bindings)], q.warnings.length > 0) E(`[keybindings] Found ${q.warnings.length} validation issue(s)`);
        return {
            bindings: q.bindings,
            warnings: q.warnings
        }
    } catch (z) {
        if (t1(z)) return q.bindings = K, q.warnings = [], {
            bindings: q.bindings,
            warnings: q.warnings
        };
        return E(`[keybindings] Error loading ${_}: ${b6(z)}`), q.bindings = K, q.warnings = [{
            type: "parse_error",
            severity: "error",
            message: `Failed to parse keybindings.json: ${b6(z)}`
        }], {
            bindings: q.bindings,
            warnings: q.warnings
        }
    }
}
// @from(Ln 191657, Col 0)
async function tA4(q) {
    if (q.initialized || q.disposed) return;
    if (!WR()) {
        E("[keybindings] Skipping file watcher - user customization disabled");
        return
    }
    let K = aa(),
        _ = EB_(K);
    try {
        if (!(await NB_(_)).isDirectory()) {
            E(`[keybindings] Not watching: ${_} is not a directory`);
            return
        }
    } catch {
        E(`[keybindings] Not watching: ${_} does not exist`);
        return
    }
    q.initialized = !0, E(`[keybindings] Watching for changes to ${K}`), q.watcher = oa.watch(K, {
        persistent: !0,
        ignoreInitial: !0,
        awaitWriteFinish: {
            stabilityThreshold: LB_,
            pollInterval: hB_
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), q.watcher.on("add", (z) => oA4(q, z)), q.watcher.on("change", (z) => oA4(q, z)), q.watcher.on("unlink", (z) => bB_(q, z)), eq(async () => CB_(q))
}
// @from(Ln 191687, Col 0)
function CB_(q) {
    if (q.disposed = !0, q.watcher) q.watcher.close(), q.watcher = null;
    q.changed.clear()
}
// @from(Ln 191691, Col 0)
async function oA4(q, K) {
    E(`[keybindings] Detected change to ${K}`);
    try {
        let _ = await SB_(q);
        q.bindings = _.bindings, q.warnings = _.warnings, q.changed.emit(_)
    } catch (_) {
        E(`[keybindings] Error reloading: ${b6(_)}`)
    }
}
// @from(Ln 191701, Col 0)
function bB_(q, K) {
    E(`[keybindings] Detected deletion of ${K}`);
    let _ = Jm1();
    q.bindings = _, q.warnings = [], q.changed.emit({
        bindings: _,
        warnings: []
    })
}
// @from(Ln 191709, Col 4)
LB_ = 500
// @from(Ln 191710, Col 4)
hB_ = 200
// @from(Ln 191711, Col 4)
RI
// @from(Ln 191712, Col 4)
yd = L(() => {
    AE6();
    B1();
    C8();
    R9();
    K8();
    Q8();
    m8();
    nH();
    e8();
    rE8();
    rA4();
    RI = RB_()
})
// @from(Ln 191727, Col 0)
function eA4(q, K) {
    if (K.escape) return "escape";
    if (K.return) return "enter";
    if (K.tab) return "tab";
    if (K.backspace) return "backspace";
    if (K.delete) return "delete";
    if (K.upArrow) return "up";
    if (K.downArrow) return "down";
    if (K.leftArrow) return "left";
    if (K.rightArrow) return "right";
    if (K.pageUp) return "pageup";
    if (K.pageDown) return "pagedown";
    if (K.wheelUp) return "wheelup";
    if (K.wheelDown) return "wheeldown";
    if (K.home) return "home";
    if (K.end) return "end";
    if (q.length === 1) return q.toLowerCase();
    return null
}
// @from(Ln 191747, Col 0)
function tE8(q, K, _) {
    let z = _.findLast((Y) => Y.action === q && Y.context === K);
    return z ? g$6(z.chord) : void 0
}
// @from(Ln 191752, Col 0)
function IB_(q, K) {
    let _ = eA4(q, K);
    if (!_) return null;
    let z = K.escape ? !1 : K.meta,
        Y = K.shift || q.length === 1 && q !== q.toLowerCase() && q === q.toUpperCase();
    return {
        key: _,
        ctrl: K.ctrl,
        alt: z,
        shift: Y,
        meta: z,
        super: K.super
    }
}
// @from(Ln 191767, Col 0)
function eE8(q, K) {
    return q.key === K.key && q.ctrl === K.ctrl && q.shift === K.shift && (q.alt || q.meta) === (K.alt || K.meta) && q.super === K.super
}
// @from(Ln 191771, Col 0)
function xB_(q, K) {
    if (q.length >= K.chord.length) return !1;
    for (let _ = 0; _ < q.length; _++) {
        let z = q[_],
            Y = K.chord[_];
        if (!z || !Y) return !1;
        if (!eE8(z, Y)) return !1
    }
    return !0
}
// @from(Ln 191782, Col 0)
function uB_(q, K) {
    if (q.length !== K.chord.length) return !1;
    for (let _ = 0; _ < q.length; _++) {
        let z = q[_],
            Y = K.chord[_];
        if (!z || !Y) return !1;
        if (!eE8(z, Y)) return !1
    }
    return !0
}
// @from(Ln 191793, Col 0)
function Zs6(q, K, _, z, Y) {
    if (K.escape && Y !== null) return {
        type: "chord_cancelled"
    };
    let A = IB_(q, K);
    if (!A) {
        if (Y !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let O = Y ? [...Y, A] : [A],
        w = new Set(_),
        $ = z.filter((X) => w.has(X.context)),
        j = new Map;
    for (let X of $)
        if (X.chord.length > O.length && xB_(O, X)) j.set(g$6(X.chord), X.action);
    let H = !1;
    for (let X of j.values())
        if (X !== null) {
            H = !0;
            break
        } if (H) return {
        type: "chord_started",
        pending: O
    };
    let J;
    for (let X of $)
        if (uB_(O, X)) J = X;
    if (J) {
        if (J.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: J.action
        }
    }
    if (Y !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}
// @from(Ln 191840, Col 4)
fs6 = () => {}
// @from(Ln 191842, Col 0)
function WJ(q, K, _) {
    let z = sA4(RI),
        Y = tE8(q, K, z);
    if (Y === void 0) {
        let A = `${q}:${K}`;
        if (!qO4.has(A)) qO4.add(A), d("tengu_keybinding_fallback_used", {
            action: q,
            context: K,
            fallback: _,
            reason: "action_not_found"
        });
        return _
    }
    return Y
}
// @from(Ln 191857, Col 4)
qO4
// @from(Ln 191858, Col 4)
zp = L(() => {
    C8();
    yd();
    fs6();
    qO4 = new Set
})
// @from(Ln 191864, Col 4)
Ky8 = {}
// @from(Ln 191871, Col 0)
function _O4() {
    if (KO4) return qy8;
    KO4 = !0;
    try {
        qy8 = (() => {
            throw new Error("Cannot require module " + "../../image-processor.node");
        })()
    } catch {
        qy8 = null
    }
    return qy8
}
// @from(Ln 191884, Col 0)
function zO4(q) {
    let K = null,
        _ = [],
        z = 0;
    async function Y() {
        if (!K) K = (async () => {
            let w = _O4();
            if (!w) throw Error("Native image processor module not available");
            return w.processImage(q)
        })();
        return K
    }

    function A(w) {
        for (let $ = z; $ < _.length; $++) {
            let j = _[$];
            if (j) j(w)
        }
        z = _.length
    }
    let O = {
        async metadata() {
            return (await Y()).metadata()
        },
        resize(w, $, j) {
            return _.push((H) => {
                H.resize(w, $, j)
            }), O
        },
        jpeg(w) {
            return _.push(($) => {
                $.jpeg(w?.quality)
            }), O
        },
        png(w) {
            return _.push(($) => {
                $.png(w)
            }), O
        },
        webp(w) {
            return _.push(($) => {
                $.webp(w?.quality)
            }), O
        },
        async toBuffer() {
            let w = await Y();
            return A(w), w.toBuffer()
        }
    };
    return O
}
// @from(Ln 191935, Col 4)
qy8 = null
// @from(Ln 191936, Col 4)
KO4 = !1
// @from(Ln 191937, Col 4)
mB_
// @from(Ln 191938, Col 4)
_y8 = L(() => {
    mB_ = zO4
})
// @from(Ln 191941, Col 4)
Ld = p((B_w, AO4) => {
    /*!
      Copyright 2013 Lovell Fuller and others.
      SPDX-License-Identifier: Apache-2.0
    */
    var YO4 = (q) => typeof q < "u" && q !== null,
        BB_ = (q) => typeof q === "object",
        pB_ = (q) => Object.prototype.toString.call(q) === "[object Object]",
        FB_ = (q) => typeof q === "function",
        gB_ = (q) => typeof q === "boolean",
        UB_ = (q) => q instanceof Buffer,
        QB_ = (q) => {
            if (YO4(q)) switch (q.constructor) {
                case Uint8Array:
                case Uint8ClampedArray:
                case Int8Array:
                case Uint16Array:
                case Int16Array:
                case Uint32Array:
                case Int32Array:
                case Float32Array:
                case Float64Array:
                    return !0
            }
            return !1
        },
        dB_ = (q) => q instanceof ArrayBuffer,
        cB_ = (q) => typeof q === "string" && q.length > 0,
        lB_ = (q) => typeof q === "number" && !Number.isNaN(q),
        nB_ = (q) => Number.isInteger(q),
        iB_ = (q, K, _) => q >= K && q <= _,
        rB_ = (q, K) => K.includes(q),
        oB_ = (q, K, _) => Error(`Expected ${K} for ${q} but received ${_} of type ${typeof _}`),
        aB_ = (q, K) => {
            return K.message = q.message, K
        };
    AO4.exports = {
        defined: YO4,
        object: BB_,
        plainObject: pB_,
        fn: FB_,
        bool: gB_,
        buffer: UB_,
        typedArray: QB_,
        arrayBuffer: dB_,
        string: cB_,
        number: lB_,
        integer: nB_,
        inRange: iB_,
        inArray: rB_,
        invalidParameterError: oB_,
        nativeError: aB_
    }
})
// @from(Ln 191995, Col 4)
$O4 = p((p_w, wO4) => {
    var OO4 = () => process.platform === "linux",
        zy8 = null,
        sB_ = () => {
            if (!zy8)
                if (OO4() && process.report) {
                    let q = process.report.excludeNetwork;
                    process.report.excludeNetwork = !0, zy8 = process.report.getReport(), process.report.excludeNetwork = q
                } else zy8 = {};
            return zy8
        };
    wO4.exports = {
        isLinux: OO4,
        getReport: sB_
    }
})
// @from(Ln 192011, Col 4)
HO4 = p((F_w, jO4) => {
    var wE6 = d6("fs"),
        tB_ = (q) => {
            let K = wE6.openSync(q, "r"),
                _ = Buffer.alloc(2048),
                z = wE6.readSync(K, _, 0, 2048, 0);
            return wE6.close(K, () => {}), _.subarray(0, z)
        },
        eB_ = (q) => new Promise((K, _) => {
            wE6.open(q, "r", (z, Y) => {
                if (z) _(z);
                else {
                    let A = Buffer.alloc(2048);
                    wE6.read(Y, A, 0, 2048, 0, (O, w) => {
                        K(A.subarray(0, w)), wE6.close(Y, () => {})
                    })
                }
            })
        });
    jO4.exports = {
        LDD_PATH: "/usr/bin/ldd",
        SELF_PATH: "/proc/self/exe",
        readFileSync: tB_,
        readFile: eB_
    }
})