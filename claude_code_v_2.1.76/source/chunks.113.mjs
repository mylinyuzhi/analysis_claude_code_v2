
// @from(Ln 275451, Col 0)
function ae9(A) {
    let q = A6(37),
        {
            task: K,
            ownerColor: Y,
            openBlockers: z,
            activity: _,
            ownerActive: w,
            columns: O
        } = A,
        $ = K.status === "completed",
        H = K.status === "in_progress",
        j = z.length > 0,
        J;
    if (q[0] !== K.status) J = oe9(K.status), q[0] = K.status, q[1] = J;
    else J = q[1];
    let {
        icon: M,
        color: D
    } = J, X = H && !j && _, P = O >= 60 && K.owner && w, W;
    if (q[2] !== P || q[3] !== K.owner) W = P ? f8(` (@${K.owner})`) : 0, q[2] = P, q[3] = K.owner, q[4] = W;
    else W = q[4];
    let Z = W,
        G = Math.max(15, O - 15 - Z),
        f;
    if (q[5] !== G || q[6] !== K.subject) f = jq(K.subject, G), q[5] = G, q[6] = K.subject, q[7] = f;
    else f = q[7];
    let v = f,
        N = Math.max(15, O - 15),
        V;
    if (q[8] !== _ || q[9] !== N) V = _ ? jq(_, N) : void 0, q[8] = _, q[9] = N, q[10] = V;
    else V = q[10];
    let L = V,
        h;
    if (q[11] !== D || q[12] !== M) h = pq.createElement(T, {
        color: D
    }, M, " "), q[11] = D, q[12] = M, q[13] = h;
    else h = q[13];
    let R = $ || j,
        u;
    if (q[14] !== v || q[15] !== $ || q[16] !== H || q[17] !== R) u = pq.createElement(T, {
        bold: H,
        strikethrough: $,
        dimColor: R
    }, v), q[14] = v, q[15] = $, q[16] = H, q[17] = R, q[18] = u;
    else u = q[18];
    let I;
    if (q[19] !== Y || q[20] !== P || q[21] !== K.owner) I = P && pq.createElement(T, {
        dimColor: !0
    }, " (", Y ? pq.createElement(T, {
        color: Y
    }, "@", K.owner) : `@${K.owner}`, ")"), q[19] = Y, q[20] = P, q[21] = K.owner, q[22] = I;
    else I = q[22];
    let g;
    if (q[23] !== j || q[24] !== z) g = j && pq.createElement(T, {
        dimColor: !0
    }, " ", a6.pointerSmall, " blocked by", " ", [...z].sort(te9).map(se9).join(", ")), q[23] = j, q[24] = z, q[25] = g;
    else g = q[25];
    let B;
    if (q[26] !== h || q[27] !== u || q[28] !== I || q[29] !== g) B = pq.createElement(m, null, h, u, I, g), q[26] = h, q[27] = u, q[28] = I, q[29] = g, q[30] = B;
    else B = q[30];
    let b;
    if (q[31] !== L || q[32] !== X) b = X && L && pq.createElement(m, null, pq.createElement(T, {
        dimColor: !0
    }, "  ", L, a6.ellipsis)), q[31] = L, q[32] = X, q[33] = b;
    else b = q[33];
    let p;
    if (q[34] !== B || q[35] !== b) p = pq.createElement(m, {
        flexDirection: "column"
    }, B, b), q[34] = B, q[35] = b, q[36] = p;
    else p = q[36];
    return p
}
// @from(Ln 275525, Col 0)
function se9(A) {
    return `#${A}`
}
// @from(Ln 275529, Col 0)
function te9(A, q) {
    return parseInt(A, 10) - parseInt(q, 10)
}
// @from(Ln 275532, Col 4)
pq
// @from(Ln 275532, Col 8)
FW4 = 30000
// @from(Ln 275533, Col 4)
dy8 = E(() => {
    e6();
    i6();
    b7();
    Bw();
    NA();
    H0();
    RX6();
    Qz();
    _q();
    gB();
    q3();
    M4();
    pq = t(P6(), 1)
})
// @from(Ln 275551, Col 0)
class pW4 {
    #A = void 0;
    #q = !1;
    #K = null;
    #z = null;
    #Y = null;
    #w = null;
    #_ = null;
    #$ = null;
    #H = new Set;
    #j = !1;
    getSnapshot = () => {
        return this.#q ? void 0 : this.#A
    };
    subscribe = (A) => {
        if (this.#H.add(A), !this.#j) this.#j = !0, this.#$ = D84(this.#W), this.#X();
        return this.#O.bind(this, A)
    };
    #O(A) {
        if (this.#H.delete(A), this.#H.size === 0) this.#Z()
    }
    #J() {
        for (let A of this.#H) A()
    }
    #M(A) {
        if (A === this.#z && this.#K !== null) return;
        this.#K?.close(), this.#K = null, this.#z = A;
        try {
            this.#K = ee9(A, this.#W), this.#K.unref()
        } catch {}
    }
    #W = () => {
        if (this.#w) clearTimeout(this.#w);
        this.#w = setTimeout(() => void this.#X(), q6Y), this.#w.unref()
    };
    #X = async () => {
        let A = jf();
        this.#M(wR(A));
        let q = (await DX(A)).filter((Y) => !Y.metadata?._internal);
        this.#A = q;
        let K = q.some((Y) => Y.status !== "completed");
        if (K || q.length === 0) this.#q = q.length === 0, this.#P();
        else if (this.#Y === null && !this.#q) this.#Y = setTimeout(this.#G.bind(this, A), A6Y), this.#Y.unref();
        if (this.#J(), this.#_) clearTimeout(this.#_), this.#_ = null;
        if (K) this.#_ = setTimeout(this.#W, K6Y), this.#_.unref()
    };
    #G(A) {
        this.#Y = null;
        let q = jf();
        if (q !== A) return;
        DX(q).then(async (K) => {
            if (K.length > 0 && K.every((z) => z.status === "completed")) await rD1(q), this.#A = [], this.#q = !0;
            this.#J()
        })
    }
    #P() {
        if (this.#Y) clearTimeout(this.#Y), this.#Y = null
    }
    #Z() {
        if (this.#K?.close(), this.#K = null, this.#z = null, this.#$?.(), this.#$ = null, this.#P(), this.#w) clearTimeout(this.#w);
        if (this.#_) clearTimeout(this.#_);
        this.#w = null, this.#_ = null, this.#j = !1
    }
}
// @from(Ln 275616, Col 0)
function z6Y() {
    return Y6Y ??= new pW4
}
// @from(Ln 275620, Col 0)
function cQ6() {
    let A = M1((Y) => Y.teamContext),
        K = r$() && (!A || KZ(A)) ? z6Y() : null;
    return kZ1.useSyncExternalStore(K ? K.subscribe : w6Y, K ? K.getSnapshot : O6Y)
}
// @from(Ln 275626, Col 0)
function QW4() {
    let A = cQ6(),
        q = xA(),
        K = A === void 0;
    return kZ1.useEffect(() => {
        if (!K) return;
        q((Y) => {
            if (Y.expandedView !== "tasks") return Y;
            return {
                ...Y,
                expandedView: "none"
            }
        })
    }, [K, q]), A
}
// @from(Ln 275641, Col 4)
kZ1
// @from(Ln 275641, Col 9)
A6Y = 5000
// @from(Ln 275642, Col 4)
q6Y = 50
// @from(Ln 275643, Col 4)
K6Y = 5000
// @from(Ln 275644, Col 4)
Y6Y = null
// @from(Ln 275645, Col 4)
_6Y = () => {}
// @from(Ln 275646, Col 4)
w6Y = () => _6Y
// @from(Ln 275647, Col 4)
O6Y = () => {
        return
    }
// @from(Ln 275650, Col 4)
EZ1 = E(() => {
    Bw();
    zz();
    NA();
    kZ1 = t(P6(), 1)
})
// @from(Ln 275657, Col 0)
function lQ6() {
    if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
    return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
}
// @from(Ln 275662, Col 0)
function sI(A, q, K) {
    return {
        r: Math.round(A.r + (q.r - A.r) * K),
        g: Math.round(A.g + (q.g - A.g) * K),
        b: Math.round(A.b + (q.b - A.b) * K)
    }
}
// @from(Ln 275670, Col 0)
function ok(A) {
    return `rgb(${A.r},${A.g},${A.b})`
}
// @from(Ln 275674, Col 0)
function yZ1(A) {
    let q = (A % 360 + 360) % 360,
        K = 0.7,
        Y = 0.6,
        z = (1 - Math.abs(0.19999999999999996)) * 0.7,
        _ = z * (1 - Math.abs(q / 60 % 2 - 1)),
        w = 0.6 - z / 2,
        O = 0,
        $ = 0,
        H = 0;
    if (q < 60) O = z, $ = _;
    else if (q < 120) O = _, $ = z;
    else if (q < 180) $ = z, H = _;
    else if (q < 240) $ = _, H = z;
    else if (q < 300) O = _, H = z;
    else O = z, H = _;
    return {
        r: Math.round((O + w) * 255),
        g: Math.round(($ + w) * 255),
        b: Math.round((H + w) * 255)
    }
}
// @from(Ln 275697, Col 0)
function u96(A) {
    let q = UW4.get(A);
    if (q !== void 0) return q;
    let K = A.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/),
        Y = K ? {
            r: parseInt(K[1], 10),
            g: parseInt(K[2], 10),
            b: parseInt(K[3], 10)
        } : null;
    return UW4.set(A, Y), Y
}
// @from(Ln 275708, Col 4)
UW4
// @from(Ln 275709, Col 4)
Vc = E(() => {
    UW4 = new Map
})
// @from(Ln 275712, Col 4)
$6Y
// @from(Ln 275713, Col 4)
dW4 = E(() => {
    e6();
    i6();
    ym();
    Vc();
    $6Y = t(P6(), 1)
})
// @from(Ln 275721, Col 0)
function CZ6(A) {
    let q = A6(3),
        {
            char: K,
            index: Y,
            glimmerIndex: z,
            messageColor: _,
            shimmerColor: w
        } = A,
        O = Y === z,
        $ = Math.abs(Y - z) === 1,
        j = O || $ ? w : _,
        J;
    if (q[0] !== K || q[1] !== j) J = cy8.createElement(T, {
        color: j
    }, K), q[0] = K, q[1] = j, q[2] = J;
    else J = q[2];
    return J
}
// @from(Ln 275740, Col 4)
cy8
// @from(Ln 275741, Col 4)
iQ6 = E(() => {
    e6();
    i6();
    cy8 = t(P6(), 1)
})
// @from(Ln 275747, Col 0)
function ly8(A) {
    let q = A6(75),
        {
            message: K,
            mode: Y,
            messageColor: z,
            glimmerIndex: _,
            flashOpacity: w,
            shimmerColor: O,
            stalledIntensity: $
        } = A,
        H = $ === void 0 ? 0 : $,
        [j] = z7(),
        J, M, D;
    if (q[0] !== w || q[1] !== K || q[2] !== z || q[3] !== Y || q[4] !== O || q[5] !== H || q[6] !== j) {
        D = Symbol.for("react.early_return_sentinel");
        A: {
            let u = QW(j),
                I;
            if (q[10] !== K) {
                I = [];
                for (let {
                        segment: b
                    }
                    of bH().segment(K)) I.push({
                    segment: b,
                    width: f8(b)
                });
                q[10] = K, q[11] = I
            } else I = q[11];
            let g;
            if (q[12] !== K) g = f8(K),
            q[12] = K,
            q[13] = g;
            else g = q[13];
            let B;
            if (q[14] !== I || q[15] !== g) B = {
                segments: I,
                messageWidth: g
            },
            q[14] = I,
            q[15] = g,
            q[16] = B;
            else B = q[16];
            if ({
                    segments: M,
                    messageWidth: J
                } = B, !K) {
                D = null;
                break A
            }
            if (H > 0) {
                let b = u[z],
                    p = b ? u96(b) : null;
                if (p) {
                    let Y6 = sI(p, H6Y, H),
                        H6 = ok(Y6),
                        J6;
                    if (q[17] !== H6) J6 = rq.createElement(T, {
                        color: H6
                    }, " "), q[17] = H6, q[18] = J6;
                    else J6 = q[18];
                    D = rq.createElement(rq.Fragment, null, rq.createElement(T, {
                        color: H6
                    }, K), J6);
                    break A
                }
                let Q = H > 0.5 ? "error" : z,
                    U;
                if (q[19] !== Q || q[20] !== K) U = rq.createElement(T, {
                    color: Q
                }, K), q[19] = Q, q[20] = K, q[21] = U;
                else U = q[21];
                let r;
                if (q[22] !== Q) r = rq.createElement(T, {
                    color: Q
                }, " "), q[22] = Q, q[23] = r;
                else r = q[23];
                let e;
                if (q[24] !== U || q[25] !== r) e = rq.createElement(rq.Fragment, null, U, r), q[24] = U, q[25] = r, q[26] = e;
                else e = q[26];
                D = e;
                break A
            }
            if (Y === "tool-use") {
                let b = u[z],
                    p = u[O],
                    Q = b ? u96(b) : null,
                    U = p ? u96(p) : null;
                if (Q && U) {
                    let J6 = sI(Q, U, w),
                        K6 = rq.createElement(T, {
                            color: ok(J6)
                        }, K),
                        s;
                    if (q[27] !== z) s = rq.createElement(T, {
                        color: z
                    }, " "), q[27] = z, q[28] = s;
                    else s = q[28];
                    let X6;
                    if (q[29] !== K6 || q[30] !== s) X6 = rq.createElement(rq.Fragment, null, K6, s), q[29] = K6, q[30] = s, q[31] = X6;
                    else X6 = q[31];
                    D = X6;
                    break A
                }
                let r = w > 0.5 ? O : z,
                    e;
                if (q[32] !== r || q[33] !== K) e = rq.createElement(T, {
                    color: r
                }, K), q[32] = r, q[33] = K, q[34] = e;
                else e = q[34];
                let Y6;
                if (q[35] !== z) Y6 = rq.createElement(T, {
                    color: z
                }, " "), q[35] = z, q[36] = Y6;
                else Y6 = q[36];
                let H6;
                if (q[37] !== e || q[38] !== Y6) H6 = rq.createElement(rq.Fragment, null, e, Y6), q[37] = e, q[38] = Y6, q[39] = H6;
                else H6 = q[39];
                D = H6;
                break A
            }
        }
        q[0] = w, q[1] = K, q[2] = z, q[3] = Y, q[4] = O, q[5] = H, q[6] = j, q[7] = J, q[8] = M, q[9] = D
    } else J = q[7], M = q[8], D = q[9];
    if (D !== Symbol.for("react.early_return_sentinel")) return D;
    let X = _ - 1,
        P = _ + 1;
    if (X >= J || P < 0) {
        let u;
        if (q[40] !== K || q[41] !== z) u = rq.createElement(T, {
            color: z
        }, K), q[40] = K, q[41] = z, q[42] = u;
        else u = q[42];
        let I;
        if (q[43] !== z) I = rq.createElement(T, {
            color: z
        }, " "), q[43] = z, q[44] = I;
        else I = q[44];
        let g;
        if (q[45] !== u || q[46] !== I) g = rq.createElement(rq.Fragment, null, u, I), q[45] = u, q[46] = I, q[47] = g;
        else g = q[47];
        return g
    }
    let W = Math.max(0, X),
        Z = 0,
        G = "",
        f = "",
        v = "";
    if (q[48] !== v || q[49] !== G || q[50] !== W || q[51] !== Z || q[52] !== M || q[53] !== f || q[54] !== P) {
        for (let {
                segment: u,
                width: I
            }
            of M) {
            if (Z + I <= W) G = G + u;
            else if (Z > P) v = v + u;
            else f = f + u;
            Z = Z + I
        }
        q[48] = v, q[49] = G, q[50] = W, q[51] = Z, q[52] = M, q[53] = f, q[54] = P, q[55] = G, q[56] = v, q[57] = f, q[58] = Z
    } else G = q[55], v = q[56], f = q[57], Z = q[58];
    let N;
    if (q[59] !== G || q[60] !== z) N = G && rq.createElement(T, {
        color: z
    }, G), q[59] = G, q[60] = z, q[61] = N;
    else N = q[61];
    let V;
    if (q[62] !== f || q[63] !== O) V = rq.createElement(T, {
        color: O
    }, f), q[62] = f, q[63] = O, q[64] = V;
    else V = q[64];
    let L;
    if (q[65] !== v || q[66] !== z) L = v && rq.createElement(T, {
        color: z
    }, v), q[65] = v, q[66] = z, q[67] = L;
    else L = q[67];
    let h;
    if (q[68] !== z) h = rq.createElement(T, {
        color: z
    }, " "), q[68] = z, q[69] = h;
    else h = q[69];
    let R;
    if (q[70] !== N || q[71] !== V || q[72] !== L || q[73] !== h) R = rq.createElement(rq.Fragment, null, N, V, L, h), q[70] = N, q[71] = V, q[72] = L, q[73] = h, q[74] = R;
    else R = q[74];
    return R
}
// @from(Ln 275934, Col 4)
rq
// @from(Ln 275934, Col 8)
H6Y
// @from(Ln 275935, Col 4)
iy8 = E(() => {
    e6();
    i6();
    q3();
    ym();
    AL();
    Vc();
    rq = t(P6(), 1), H6Y = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 275949, Col 0)
function nQ6(A) {
    let q = A6(9),
        {
            frame: K,
            messageColor: Y,
            stalledIntensity: z,
            reducedMotion: _,
            time: w
        } = A,
        O = z === void 0 ? 0 : z,
        $ = _ === void 0 ? !1 : _,
        H = w === void 0 ? 0 : w,
        [j] = z7(),
        J = QW(j);
    if ($) {
        let X = Math.floor(H / (J6Y / 2)) % 2 === 1,
            P;
        if (q[0] !== X || q[1] !== Y) P = Z0.createElement(m, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, Z0.createElement(T, {
            color: Y,
            dimColor: X
        }, j6Y)), q[0] = X, q[1] = Y, q[2] = P;
        else P = q[2];
        return P
    }
    let M = lW4[K % lW4.length];
    if (O > 0) {
        let X = J[Y],
            P = X ? u96(X) : null;
        if (P) {
            let G = sI(P, M6Y, O);
            return Z0.createElement(m, {
                flexWrap: "wrap",
                height: 1,
                width: 2
            }, Z0.createElement(T, {
                color: ok(G)
            }, M))
        }
        let W = O > 0.5 ? "error" : Y,
            Z;
        if (q[3] !== W || q[4] !== M) Z = Z0.createElement(m, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, Z0.createElement(T, {
            color: W
        }, M)), q[3] = W, q[4] = M, q[5] = Z;
        else Z = q[5];
        return Z
    }
    let D;
    if (q[6] !== Y || q[7] !== M) D = Z0.createElement(m, {
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, Z0.createElement(T, {
        color: Y
    }, M)), q[6] = Y, q[7] = M, q[8] = D;
    else D = q[8];
    return D
}
// @from(Ln 276014, Col 4)
Z0
// @from(Ln 276014, Col 8)
cW4
// @from(Ln 276014, Col 13)
lW4
// @from(Ln 276014, Col 18)
j6Y = "●"
// @from(Ln 276015, Col 4)
J6Y = 2000
// @from(Ln 276016, Col 4)
M6Y
// @from(Ln 276017, Col 4)
LZ1 = E(() => {
    e6();
    i6();
    ym();
    Vc();
    Z0 = t(P6(), 1), cW4 = lQ6(), lW4 = [...cW4, ...[...cW4].reverse()], M6Y = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 276029, Col 0)
function RZ1(A, q, K) {
    let Y = A === "requesting" ? 50 : 200,
        [z, _] = gJ(K ? null : Y),
        w = iW4.useMemo(() => f8(q), [q]);
    if (K) return [z, -100];
    let O = Math.floor(_ / Y),
        $ = w + 20;
    if (A === "requesting") return [z, O % $ - 10];
    return [z, w + 10 - O % $]
}
// @from(Ln 276039, Col 4)
iW4
// @from(Ln 276040, Col 4)
hZ1 = E(() => {
    i6();
    q3();
    iW4 = t(P6(), 1)
})
// @from(Ln 276046, Col 0)
function ny8(A, q, K = !1, Y = !1) {
    let z = IZ6.useRef(A),
        _ = IZ6.useRef(q),
        w = IZ6.useRef(A),
        O = IZ6.useRef(0),
        $ = IZ6.useRef(A);
    if (q > _.current) z.current = A, _.current = q, O.current = 0, $.current = A;
    let H;
    if (K) H = 0, z.current = A;
    else if (q > 0) H = A - z.current;
    else H = A - w.current;
    let j = H > 3000 && !K,
        J = j ? Math.min((H - 3000) / 2000, 1) : 0;
    if (!Y && (J > 0 || O.current > 0)) {
        let D = A - $.current;
        if (D >= 50) {
            let X = Math.floor(D / 50),
                P = O.current;
            for (let W = 0; W < X; W++) {
                let Z = J - P;
                if (Math.abs(Z) < 0.01) {
                    P = J;
                    break
                }
                P += Z * 0.1
            }
            O.current = P, $.current = A
        }
    } else O.current = J, $.current = A;
    let M = Y ? J : O.current;
    return {
        isStalled: j,
        stalledIntensity: M
    }
}
// @from(Ln 276081, Col 4)
IZ6
// @from(Ln 276082, Col 4)
ry8 = E(() => {
    IZ6 = t(P6(), 1)
})
// @from(Ln 276085, Col 4)
nW4 = E(() => {
    dW4();
    iQ6();
    iy8();
    LZ1();
    hZ1();
    ry8();
    Vc()
})
// @from(Ln 276095, Col 0)
function G0(A) {
    if (!A) return D6Y;
    let q = t$[A];
    if (q) return q;
    return `ansi:${A}`
}
// @from(Ln 276101, Col 4)
D6Y = "cyan_FOR_SUBAGENTS_ONLY"
// @from(Ln 276102, Col 4)
kc = E(() => {
    H0()
})
// @from(Ln 276106, Col 0)
function aW4({
    mode: A,
    reducedMotion: q,
    hasActiveTools: K,
    responseLengthRef: Y,
    message: z,
    messageColor: _,
    shimmerColor: w,
    overrideColor: O,
    loadingStartTimeRef: $,
    totalPausedMsRef: H,
    pauseStartTimeRef: j,
    spinnerSuffix: J,
    verbose: M,
    columns: D,
    hasRunningTeammates: X,
    teammateTokens: P,
    foregroundedTeammate: W,
    leaderIsIdle: Z = !1,
    thinkingStatus: G,
    effortSuffix: f
}) {
    let [v, N] = gJ(q ? null : 50), V = Date.now(), L = j.current !== null ? j.current - $.current - H.current : V - $.current - H.current, h = V - L, R = rQ6.useRef(h);
    if (!X || h < R.current) R.current = h;
    let u = Y.current,
        {
            isStalled: I,
            stalledIntensity: g
        } = ny8(N, u, K || Z, q),
        B = q ? 0 : Math.floor(N / 120),
        b = A === "requesting" ? 50 : 200,
        p = rQ6.useMemo(() => f8(z), [z]),
        Q = p + 20,
        U = Math.floor(N / b),
        r = q ? -100 : I ? -100 : A === "requesting" ? U % Q - 10 : p + 10 - U % Q,
        e = q ? 0 : A === "tool-use" ? (Math.sin(N / 1000 * Math.PI) + 1) / 2 : 0,
        Y6 = rQ6.useRef(u);
    if (q) Y6.current = u;
    else {
        let o6 = u - Y6.current;
        if (o6 > 0) {
            let V6;
            if (o6 < 70) V6 = 3;
            else if (o6 < 200) V6 = Math.max(8, Math.ceil(o6 * 0.15));
            else V6 = 50;
            Y6.current = Math.min(Y6.current + V6, u)
        }
    }
    let H6 = Y6.current,
        J6 = Math.round(H6 / 4),
        K6 = X ? Math.max(L, V - R.current) : L,
        s = UK(K6),
        X6 = f8(s),
        z6 = W && !W.isIdle ? W.progress?.tokenCount ?? 0 : J6 + P,
        N6 = fq(z6),
        $6 = X ? `${N6} tokens` : `${a6.arrowDown} ${N6} tokens`,
        n = f8($6),
        o = G === "thinking" ? `thinking${f}` : typeof G === "number" ? `thought for ${Math.max(1,Math.round(G/1000))}s` : null,
        a = o ? f8(o) : 0,
        i = p + 2,
        l = X6Y,
        q6 = G !== null,
        w6 = M || X || K6 > P6Y,
        O6 = D - i - 5,
        L6 = q6 && O6 > a;
    if (!L6 && q6 && G === "thinking" && f) {
        if (O6 > rW4) o = "thinking", a = rW4, L6 = !0
    }
    let y6 = L6 ? a + l : 0,
        G6 = w6 && O6 > y6 + X6,
        R6 = y6 + (G6 ? X6 + l : 0),
        T6 = w6 && z6 > 0 && O6 > R6 + n,
        D6 = L6 && G === "thinking" && !J && !G6 && !T6 && !0,
        Q6 = (N - oW4) / 1000,
        k6 = N < oW4 ? 0 : (Math.sin(Q6 * Math.PI * 2 / G6Y) + 1) / 2,
        Z6 = ok(sI(W6Y, Z6Y, k6)),
        u6 = [...J ? [HK.createElement(T, {
            dimColor: !0,
            key: "suffix"
        }, J)] : [], ...G6 ? [HK.createElement(T, {
            dimColor: !0,
            key: "elapsedTime"
        }, s)] : [], ...T6 ? [HK.createElement(m, {
            flexDirection: "row",
            key: "tokens"
        }, !X && HK.createElement(f6Y, {
            mode: A
        }), HK.createElement(T, {
            dimColor: !0
        }, N6, " tokens"))] : [], ...L6 && o ? [G === "thinking" && !q ? HK.createElement(T, {
            key: "thinking",
            color: Z6
        }, D6 ? `(${o})` : o) : HK.createElement(T, {
            dimColor: !0,
            key: "thinking"
        }, o)] : []],
        C6 = W && !W.isIdle ? HK.createElement(HK.Fragment, null, HK.createElement(T, {
            dimColor: !0
        }, "(esc to interrupt "), HK.createElement(T, {
            color: G0(W.identity.color)
        }, W.identity.agentName), HK.createElement(T, {
            dimColor: !0
        }, ")")) : !W && u6.length > 0 ? D6 ? HK.createElement(C8, null, u6) : HK.createElement(HK.Fragment, null, HK.createElement(T, {
            dimColor: !0
        }, "("), HK.createElement(C8, null, u6), HK.createElement(T, {
            dimColor: !0
        }, ")")) : null;
    return HK.createElement(m, {
        ref: v,
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 1,
        width: "100%"
    }, HK.createElement(nQ6, {
        frame: B,
        messageColor: _,
        stalledIntensity: O ? 0 : g,
        reducedMotion: q,
        time: N
    }), HK.createElement(ly8, {
        message: z,
        mode: A,
        messageColor: _,
        glimmerIndex: r,
        flashOpacity: e,
        shimmerColor: w,
        stalledIntensity: O ? 0 : g
    }), C6)
}
// @from(Ln 276236, Col 0)
function f6Y(A) {
    let q = A6(2),
        {
            mode: K
        } = A;
    switch (K) {
        case "tool-input":
        case "tool-use":
        case "responding":
        case "thinking": {
            let Y;
            if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = HK.createElement(m, {
                width: 2
            }, HK.createElement(T, {
                dimColor: !0
            }, a6.arrowDown)), q[0] = Y;
            else Y = q[0];
            return Y
        }
        case "requesting": {
            let Y;
            if (q[1] === Symbol.for("react.memo_cache_sentinel")) Y = HK.createElement(m, {
                width: 2
            }, HK.createElement(T, {
                dimColor: !0
            }, a6.arrowUp)), q[1] = Y;
            else Y = q[1];
            return Y
        }
    }
}
// @from(Ln 276267, Col 4)
HK
// @from(Ln 276267, Col 8)
rQ6
// @from(Ln 276267, Col 13)
X6Y
// @from(Ln 276267, Col 18)
rW4
// @from(Ln 276267, Col 23)
P6Y = 30000
// @from(Ln 276268, Col 4)
W6Y
// @from(Ln 276268, Col 9)
Z6Y
// @from(Ln 276268, Col 14)
oW4 = 3000
// @from(Ln 276269, Col 4)
G6Y = 2
// @from(Ln 276270, Col 4)
sW4 = E(() => {
    e6();
    i6();
    b7();
    M4();
    q3();
    Xq();
    kc();
    iy8();
    LZ1();
    ry8();
    Vc();
    HK = t(P6(), 1), rQ6 = t(P6(), 1), X6Y = f8(" · "), rW4 = f8("thinking"), W6Y = {
        r: 153,
        g: 153,
        b: 153
    }, Z6Y = {
        r: 185,
        g: 185,
        b: 185
    }
})
// @from(Ln 276293, Col 0)
function ij(A) {
    if (A.status !== "running" && A.status !== "pending") return !1;
    if ("isBackgrounded" in A && A.isBackgrounded === !1) return !1;
    return !0
}
// @from(Ln 276299, Col 0)
function ak(A, q) {
    return `${A}@${q}`
}
// @from(Ln 276303, Col 0)
function oQ6(A) {
    let q = A.indexOf("@");
    if (q === -1) return null;
    return {
        agentName: A.slice(0, q),
        teamName: A.slice(q + 1)
    }
}
// @from(Ln 276312, Col 0)
function bZ6(A, q) {
    let K = Date.now();
    return `${A}-${K}@${q}`
}
// @from(Ln 276316, Col 4)
qZ4 = {}
// @from(Ln 276352, Col 0)
function eW4(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
}
// @from(Ln 276356, Col 0)
function y6Y(A) {
    return A.replace(/@/g, "-")
}
// @from(Ln 276360, Col 0)
function SZ1(A) {
    return m96(YG(), eW4(A))
}
// @from(Ln 276364, Col 0)
function e$(A) {
    let q = m96(SZ1(A), "config.json");
    try {
        let K = v6Y(q, "utf-8");
        return i1(K)
    } catch (K) {
        if (K.code === "ENOENT") return null;
        return k(`[TeammateTool] Failed to read team file for ${A}: ${_1(K)}`), null
    }
}
// @from(Ln 276375, Col 0)
function B96(A, q) {
    let K = SZ1(A);
    T6Y(K, {
        recursive: !0
    });
    let Y = m96(K, "config.json");
    N6Y(Y, B6(q, null, 2))
}
// @from(Ln 276384, Col 0)
function g96(A, q) {
    let K = q.agentId || q.name;
    if (!K) return k("[TeammateTool] removeTeammateFromTeamFile called with no identifier"), !1;
    let Y = e$(A);
    if (!Y) return k(`[TeammateTool] Cannot remove teammate ${K}: failed to read team file for "${A}"`), !1;
    let z = Y.members.length;
    if (Y.members = Y.members.filter((_) => {
            if (q.agentId && _.agentId === q.agentId) return !1;
            if (q.name && _.name === q.name) return !1;
            return !0
        }), Y.members.length === z) return k(`[TeammateTool] Teammate ${K} not found in team file for "${A}"`), !1;
    return B96(A, Y), k(`[TeammateTool] Removed teammate from team file: ${K}`), !0
}
// @from(Ln 276398, Col 0)
function L6Y(A, q) {
    let K = e$(A);
    if (!K) return !1;
    let Y = K.hiddenPaneIds ?? [];
    if (!Y.includes(q)) Y.push(q), K.hiddenPaneIds = Y, B96(A, K), k(`[TeammateTool] Added ${q} to hidden panes for team ${A}`);
    return !0
}
// @from(Ln 276406, Col 0)
function R6Y(A, q) {
    let K = e$(A);
    if (!K) return !1;
    let Y = K.hiddenPaneIds ?? [],
        z = Y.indexOf(q);
    if (z !== -1) Y.splice(z, 1), K.hiddenPaneIds = Y, B96(A, K), k(`[TeammateTool] Removed ${q} from hidden panes for team ${A}`);
    return !0
}
// @from(Ln 276415, Col 0)
function AZ4(A) {
    return e$(A)?.hiddenPaneIds ?? []
}
// @from(Ln 276419, Col 0)
function ay8(A, q) {
    return AZ4(A).includes(q)
}
// @from(Ln 276423, Col 0)
function sy8(A, q) {
    let K = e$(A);
    if (!K) return !1;
    let Y = K.members.findIndex((z) => z.tmuxPaneId === q);
    if (Y === -1) return !1;
    if (K.members.splice(Y, 1), K.hiddenPaneIds) {
        let z = K.hiddenPaneIds.indexOf(q);
        if (z !== -1) K.hiddenPaneIds.splice(z, 1)
    }
    return B96(A, K), k(`[TeammateTool] Removed member with pane ${q} from team ${A}`), !0
}
// @from(Ln 276435, Col 0)
function ty8(A, q) {
    let K = e$(A);
    if (!K) return !1;
    let Y = K.members.findIndex((z) => z.agentId === q);
    if (Y === -1) return !1;
    return K.members.splice(Y, 1), B96(A, K), k(`[TeammateTool] Removed member ${q} from team ${A}`), !0
}
// @from(Ln 276443, Col 0)
function xZ6(A, q, K) {
    let Y = e$(A);
    if (!Y) return !1;
    let z = Y.members.find((w) => w.name === q);
    if (!z) return k(`[TeammateTool] Cannot set member mode: member ${q} not found in team ${A}`), !1;
    if (z.mode === K) return !0;
    let _ = Y.members.map((w) => w.name === q ? {
        ...w,
        mode: K
    } : w);
    return B96(A, {
        ...Y,
        members: _
    }), k(`[TeammateTool] Set member ${q} in team ${A} to mode: ${K}`), !0
}
// @from(Ln 276459, Col 0)
function ey8(A, q) {
    if (!$Y()) return;
    let K = q ?? l5(),
        Y = i3();
    if (K && Y) xZ6(K, Y, A)
}
// @from(Ln 276466, Col 0)
function AL8(A, q) {
    let K = e$(A);
    if (!K) return !1;
    let Y = new Map(q.map((w) => [w.memberName, w.mode])),
        z = !1,
        _ = K.members.map((w) => {
            let O = Y.get(w.name);
            if (O !== void 0 && w.mode !== O) return z = !0, {
                ...w,
                mode: O
            };
            return w
        });
    if (z) B96(A, {
        ...K,
        members: _
    }), k(`[TeammateTool] Set ${q.length} member modes in team ${A}`);
    return !0
}
// @from(Ln 276485, Col 0)
async function aQ6(A, q, K) {
    let Y = SZ1(A),
        z = m96(Y, "config.json"),
        _;
    try {
        let O = await tW4(z, "utf-8");
        _ = i1(O)
    } catch {
        k(`[TeammateTool] Cannot set member active: team ${A} not found`);
        return
    }
    let w = _.members.find((O) => O.name === q);
    if (!w) {
        k(`[TeammateTool] Cannot set member active: member ${q} not found in team ${A}`);
        return
    }
    if (w.isActive === K) return;
    w.isActive = K, await k6Y(Y, {
        recursive: !0
    }), await V6Y(z, B6(_, null, 2)), k(`[TeammateTool] Set member ${q} in team ${A} to ${K?"active":"idle"}`)
}
// @from(Ln 276506, Col 0)
async function h6Y(A) {
    let q = m96(A, ".git"),
        K = null;
    try {
        let z = (await tW4(q, "utf-8")).trim().match(/^gitdir:\s*(.+)$/);
        if (z && z[1]) {
            let _ = z[1],
                w = m96(_, "..", "..");
            K = m96(w, "..")
        }
    } catch {}
    if (K) {
        let Y = await RA(hA(), ["worktree", "remove", "--force", A], {
            cwd: K
        });
        if (Y.code === 0) {
            k(`[TeammateTool] Removed worktree via git: ${A}`);
            return
        }
        if (Y.stderr?.includes("not a working tree")) {
            k(`[TeammateTool] Worktree already removed: ${A}`);
            return
        }
        k(`[TeammateTool] git worktree remove failed, falling back to rm: ${Y.stderr}`)
    }
    try {
        await oy8(A, {
            recursive: !0,
            force: !0
        }), k(`[TeammateTool] Removed worktree directory manually: ${A}`)
    } catch (Y) {
        k(`[TeammateTool] Failed to remove worktree ${A}: ${_1(Y)}`)
    }
}
// @from(Ln 276541, Col 0)
function qL8(A) {
    rk6().add(A)
}
// @from(Ln 276545, Col 0)
function KL8(A) {
    rk6().delete(A)
}
// @from(Ln 276548, Col 0)
async function S6Y() {
    let A = rk6();
    if (A.size === 0) return;
    let q = Array.from(A);
    k(`cleanupSessionTeams: removing ${q.length} orphan team dir(s): ${q.join(", ")}`), await Promise.allSettled(q.map((K) => CZ1(K))), A.clear()
}
// @from(Ln 276554, Col 0)
async function CZ1(A) {
    let q = eW4(A),
        K = e$(A),
        Y = [];
    if (K) {
        for (let w of K.members)
            if (w.worktreePath) Y.push(w.worktreePath)
    }
    for (let w of Y) await h6Y(w);
    let z = SZ1(A);
    try {
        await oy8(z, {
            recursive: !0,
            force: !0
        }), k(`[TeammateTool] Cleaned up team directory: ${z}`)
    } catch (w) {
        k(`[TeammateTool] Failed to clean up team directory ${z}: ${_1(w)}`)
    }
    let _ = wR(q);
    try {
        await oy8(_, {
            recursive: !0,
            force: !0
        }), k(`[TeammateTool] Cleaned up tasks directory: ${_}`), Gt()
    } catch (w) {
        k(`[TeammateTool] Failed to clean up tasks directory ${_}: ${_1(w)}`)
    }
}
// @from(Ln 276582, Col 4)
E6Y
// @from(Ln 276583, Col 4)
vf = E(() => {
    K7();
    A8();
    H1();
    g1();
    zz();
    Eq();
    Bw();
    $5();
    s8();
    T1();
    E6Y = F6(() => C.strictObject({
        operation: C.enum(["spawnTeam", "cleanup"]).describe("Operation: spawnTeam to create a team, cleanup to remove team and task directories."),
        agent_type: C.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.'),
        team_name: C.string().optional().describe("Name for the new team to create (required for spawnTeam)."),
        description: C.string().optional().describe("Team description/purpose (only used with spawnTeam).")
    }))
})
// @from(Ln 276601, Col 4)
uZ6
// @from(Ln 276602, Col 4)
IZ1 = E(() => {
    uZ6 = ["Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked"]
})
// @from(Ln 276605, Col 0)
async function mZ6(A, q) {
    let {
        name: K,
        teamName: Y,
        prompt: z,
        color: _,
        planModeRequired: w,
        model: O
    } = A, {
        setAppState: $
    } = q, H = ak(K, Y), j = oV("in_process_teammate");
    k(`[spawnInProcessTeammate] Spawning ${H} (taskId: ${j})`);
    try {
        let J = sK(),
            M = R1(),
            D = {
                agentId: H,
                agentName: K,
                teamName: Y,
                color: _,
                planModeRequired: w,
                parentSessionId: M
            },
            X = dD1({
                agentId: H,
                agentName: K,
                teamName: Y,
                color: _,
                planModeRequired: w,
                parentSessionId: M,
                abortController: J
            });
        if (qc()) R01(H, K, M);
        let P = `${K}: ${z.substring(0,50)}${z.length>50?"...":""}`,
            W = await aD1(Y, {
                subject: K,
                description: z.substring(0, 100),
                status: "in_progress",
                blocks: [],
                blockedBy: [],
                metadata: {
                    _internal: !0
                }
            }),
            Z = {
                ...RG(j, "in_process_teammate", P, q.toolUseId),
                type: "in_process_teammate",
                status: "running",
                identity: D,
                prompt: z,
                model: O,
                abortController: J,
                awaitingPlanApproval: !1,
                spinnerVerb: YM(x96()),
                pastTenseVerb: YM(uZ6),
                permissionMode: w ? "plan" : "default",
                isIdle: !1,
                shutdownRequested: !1,
                lastReportedToolCount: 0,
                lastReportedTokenCount: 0,
                pendingUserMessages: [],
                messages: [],
                localTaskId: W
            },
            G = E4(async () => {
                k(`[spawnInProcessTeammate] Cleanup called for ${H}`), J.abort()
            });
        return Z.unregisterCleanup = G, Zf(Z, $), k(`[spawnInProcessTeammate] Registered ${H} in AppState`), {
            success: !0,
            agentId: H,
            taskId: j,
            abortController: J,
            teammateContext: X
        }
    } catch (J) {
        let M = J instanceof Error ? J.message : "Unknown error during spawn";
        return k(`[spawnInProcessTeammate] Failed to spawn ${H}: ${M}`), {
            success: !1,
            agentId: H,
            error: M
        }
    }
}
// @from(Ln 276689, Col 0)
function bZ1(A, q) {
    let K = !1,
        Y = null,
        z = null;
    if (q((_) => {
            let w = _.tasks[A];
            if (!w || w.type !== "in_process_teammate") return _;
            let O = w;
            if (O.status !== "running") return _;
            Y = O.identity.teamName, z = O.identity.agentId, O.abortController?.abort(), O.unregisterCleanup?.(), K = !0, O.onIdleCallbacks?.forEach((H) => H());
            let $ = _.teamContext;
            if (_.teamContext && _.teamContext.teammates && z) {
                let {
                    [z]: H, ...j
                } = _.teamContext.teammates;
                $ = {
                    ..._.teamContext,
                    teammates: j
                }
            }
            return {
                ..._,
                teamContext: $,
                tasks: {
                    ..._.tasks,
                    [A]: {
                        ...O,
                        status: "killed",
                        notified: !0,
                        endTime: Date.now(),
                        onIdleCallbacks: [],
                        messages: O.messages?.length ? [O.messages[O.messages.length - 1]] : void 0,
                        pendingUserMessages: [],
                        inProgressToolUseIDs: void 0,
                        abortController: void 0,
                        unregisterCleanup: void 0,
                        currentWorkAbortController: void 0
                    }
                }
            }
        }), Y && z) ty8(Y, z);
    if (K) $O(A), setTimeout(VR.bind(null, A, q), mB);
    if (z) a36(z);
    return K
}
// @from(Ln 276734, Col 4)
xZ1 = E(() => {
    qL();
    U$();
    qZ();
    O0();
    KY();
    H1();
    Bw();
    T1();
    vf();
    SM();
    gW6();
    Nc();
    NZ1();
    IZ1()
})
// @from(Ln 276750, Col 4)
KZ4 = {}
// @from(Ln 276760, Col 0)
function YL8(A, q) {
    i9(A, q, (K) => {
        if (K.status !== "running" || K.shutdownRequested) return K;
        return {
            ...K,
            shutdownRequested: !0
        }
    })
}
// @from(Ln 276770, Col 0)
function uZ1(A, q, K) {
    i9(A, K, (Y) => {
        if (Y.status !== "running") return Y;
        return {
            ...Y,
            messages: [...Y.messages ?? [], q]
        }
    })
}
// @from(Ln 276780, Col 0)
function tQ6(A, q, K) {
    i9(A, K, (Y) => {
        if (LJ6(Y.status)) return k(`Dropping message for teammate task ${A}: task status is "${Y.status}"`), Y;
        return {
            ...Y,
            pendingUserMessages: [...Y.pendingUserMessages, q],
            messages: [...Y.messages ?? [], p1({
                content: q
            })]
        }
    })
}
// @from(Ln 276793, Col 0)
function _g(A, q) {
    let K;
    for (let Y of Object.values(q))
        if (M$(Y) && Y.identity.agentId === A) {
            if (Y.status === "running") return Y;
            if (!K) K = Y
        } return K
}
// @from(Ln 276802, Col 0)
function BR(A) {
    return Object.values(A).filter(M$)
}
// @from(Ln 276805, Col 4)
Ec
// @from(Ln 276805, Col 8)
sQ6
// @from(Ln 276806, Col 4)
sk = E(() => {
    i6();
    qL();
    O0();
    xZ1();
    JA();
    H1();
    Ec = t(P6(), 1), sQ6 = {
        name: "InProcessTeammateTask",
        type: "in_process_teammate",
        async spawn(A, q) {
            let K = {
                    name: A.name,
                    teamName: A.teamName,
                    prompt: A.prompt,
                    color: A.color,
                    planModeRequired: A.planModeRequired
                },
                Y = await mZ6(K, {
                    setAppState: q.setAppState
                });
            if (!Y.success || !Y.taskId) throw Error(Y.error || "Failed to spawn in-process teammate");
            return {
                taskId: Y.taskId,
                cleanup: () => {
                    Y.abortController?.abort()
                }
            }
        },
        async kill(A, q) {
            bZ1(A, q.setAppState)
        },
        renderStatus(A) {
            if (!M$(A)) return null;
            let {
                status: q,
                identity: K,
                progress: Y,
                awaitingPlanApproval: z,
                isIdle: _
            } = A, w = q === "running" ? z ? "warning" : "success" : q === "completed" ? "success" : q === "failed" ? "error" : q === "killed" ? "warning" : "inactive", O = q === "killed" ? "stopped" : q;
            if (q === "running" && _) O = "idle";
            else if (q === "running" && z) O = "awaiting approval";
            let $ = Y ? ` (${Y.toolUseCount} tools, ${Y.tokenCount} tokens)` : "";
            return Ec.createElement(m, null, Ec.createElement(T, {
                color: w
            }, "[", O, "] ", K.agentName, "@", K.teamName, $))
        },
        renderOutput(A) {
            return Ec.createElement(m, null, Ec.createElement(T, null, A))
        }
    }
})
// @from(Ln 276860, Col 0)
function BZ6(A, q, K = 1000, Y = 0, z) {
    let _ = () => UK(Math.max(0, (z ?? Date.now()) - A - Y)),
        w = mZ1.useCallback((O) => {
            if (!q) return () => {};
            let $ = setInterval(O, K);
            return () => clearInterval($)
        }, [q, K]);
    return mZ1.useSyncExternalStore(w, _, _)
}
// @from(Ln 276869, Col 4)
mZ1
// @from(Ln 276870, Col 4)
BZ1 = E(() => {
    M4();
    mZ1 = t(P6(), 1)
})
// @from(Ln 276874, Col 4)
eQ6 = "shift + ↑/↓ to select"
// @from(Ln 276876, Col 0)
function C6Y(A) {
    if (!A?.length) return [];
    let q = [],
        K = 80;
    for (let Y = A.length - 1; Y >= 0 && q.length < 3; Y--) {
        let z = A[Y];
        if (!z || z.type !== "user" && z.type !== "assistant" || !z.message?.content?.length) continue;
        let _ = z.message.content;
        for (let w of _) {
            if (q.length >= 3) break;
            if (!w || typeof w !== "object") continue;
            if ("type" in w && w.type === "tool_use" && "name" in w) {
                let O = "input" in w ? w.input : null,
                    $ = `Using ${w.name}…`;
                if (O) {
                    let H = O.description || O.prompt || O.command || O.query || O.pattern;
                    if (H) $ = H.split(`
`)[0] ?? $
                }
                q.push(jq($, K))
            } else if ("type" in w && w.type === "text" && "text" in w) {
                let O = w.text.split(`
`).filter(($) => $.trim());
                for (let $ = O.length - 1; $ >= 0 && q.length < 3; $--) {
                    let H = O[$];
                    if (!H) continue;
                    q.push(jq(H, K))
                }
            }
        }
    }
    return q.reverse()
}
// @from(Ln 276910, Col 0)
function YZ4({
    teammate: A,
    isLast: q,
    isSelected: K,
    isForegrounded: Y,
    allIdle: z,
    showPreview: _
}) {
    let [w] = gZ6.useState(() => A.spinnerVerb ?? YM(x96())), [O] = gZ6.useState(() => A.pastTenseVerb ?? YM(uZ6)), $ = K || Y, H = $ ? q ? "╘═" : "╞═" : q ? "└─" : "├─", j = G0(A.identity.color), {
        columns: J
    } = KA(), M = gZ6.useRef(null), D = gZ6.useRef(null);
    if (A.isIdle && M.current === null) M.current = Date.now();
    else if (!A.isIdle) M.current = null;
    if (!z && D.current !== null) D.current = null;
    let X = BZ6(M.current ?? Date.now(), A.isIdle && !z);
    if (z && D.current === null) D.current = UK(Math.max(0, Date.now() - A.startTime - (A.totalPausedMs ?? 0)));
    let P = z ? D.current ?? (() => {
            throw Error(`frozenDurationRef is null for idle teammate ${A.identity.agentName}`)
        })() : X,
        W = 8,
        Z = `@${A.identity.agentName}`,
        G = f8(Z),
        f = A.progress?.toolUseCount ?? 0,
        v = A.progress?.tokenCount ?? 0,
        N = ` · ${f} tool ${f===1?"use":"uses"} · ${fq(v)} tokens`,
        V = f8(N),
        L = ` · ${eQ6}`,
        h = f8(L),
        u = f8(" · enter to view"),
        I = 25,
        g = J - W - G - 2,
        B = J >= 60 && g >= I,
        b = B ? G + 2 : 0,
        p = J - W - b,
        Q = K && !Y && p > u + V + I + 5,
        U = $ && p > h + (Q ? u : 0) + V + I + 5,
        r = p > V + I + 5,
        e = (r ? V : 0) + (U ? h : 0) + (Q ? u : 0),
        Y6 = Math.max(I, p - e - 1),
        H6 = (() => {
            let X6 = A.progress?.recentActivities;
            if (X6 && X6.length > 0) {
                let N6 = rt(X6);
                if (N6) return jq(N6, Y6)
            }
            let z6 = A.progress?.lastActivity?.activityDescription;
            if (z6) return jq(z6, Y6);
            return w
        })(),
        J6 = () => {
            if (A.shutdownRequested) return h9.createElement(T, {
                dimColor: !0
            }, "[stopping]");
            if (A.awaitingPlanApproval) return h9.createElement(T, {
                color: "warning"
            }, "[awaiting approval]");
            if (A.isIdle) {
                if (z) return h9.createElement(T, {
                    dimColor: !0
                }, O, " for ", P);
                return h9.createElement(T, {
                    dimColor: !0
                }, "Idle for ", X)
            }
            if ($) return null;
            return h9.createElement(T, {
                dimColor: !0
            }, H6?.endsWith("…") ? H6 : `${H6}…`)
        },
        K6 = _ ? C6Y(A.messages) : [],
        s = q ? "   " : "│  ";
    return h9.createElement(m, {
        flexDirection: "column"
    }, h9.createElement(m, {
        paddingLeft: 3
    }, h9.createElement(T, {
        color: K ? "suggestion" : void 0,
        bold: K
    }, K ? a6.pointer : " "), h9.createElement(T, {
        dimColor: !K
    }, H, " "), B && h9.createElement(T, {
        color: K ? "suggestion" : j
    }, "@", A.identity.agentName), B && h9.createElement(T, {
        dimColor: !K
    }, ": "), J6(), r && h9.createElement(T, {
        dimColor: !0
    }, " ", "· ", f, " tool ", f === 1 ? "use" : "uses", " ·", " ", fq(v), " tokens"), U && h9.createElement(T, {
        dimColor: !0
    }, " · ", eQ6), Q && h9.createElement(T, {
        dimColor: !0
    }, " · enter to view")), K6.map((X6, z6) => h9.createElement(m, {
        key: z6,
        paddingLeft: 3
    }, h9.createElement(T, {
        dimColor: !0
    }, " "), h9.createElement(T, {
        dimColor: !0
    }, s, " "), h9.createElement(T, {
        dimColor: !0
    }, X6))))
}
// @from(Ln 277011, Col 4)
h9
// @from(Ln 277011, Col 8)
gZ6
// @from(Ln 277012, Col 4)
zZ4 = E(() => {
    b7();
    i6();
    Nc();
    kc();
    M4();
    IZ1();
    BZ1();
    M4();
    q3();
    gB();
    _q();
    NZ1();
    h9 = t(P6(), 1), gZ6 = t(P6(), 1)
})
// @from(Ln 277028, Col 0)
function gZ1({
    selectedIndex: A,
    isInSelectionMode: q,
    allIdle: K,
    leaderVerb: Y,
    leaderTokenCount: z,
    leaderIdleText: _
}) {
    let w = M1((Z) => Z.tasks),
        O = M1((Z) => Z.viewingAgentTaskId),
        $ = M1((Z) => Z.showTeammateMessagePreview),
        H = void 0,
        j = BR(w).filter((Z) => Z.status === "running").sort((Z, G) => Z.identity.agentName.localeCompare(G.identity.agentName));
    if (j.length === 0) return null;
    let J = O === void 0,
        M = q && A === -1,
        D = J || M,
        X = "cyan_FOR_SUBAGENTS_ONLY",
        P = q === !0 && A === j.length;
    return JY.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, !!1 && JY.createElement(m, {
        paddingLeft: 3
    }, JY.createElement(T, {
        color: M ? "suggestion" : void 0,
        bold: D
    }, M ? a6.pointer : " "), JY.createElement(T, {
        dimColor: !D,
        bold: D
    }, D ? "╒═" : "┌─", " "), JY.createElement(T, {
        bold: D,
        color: M ? "suggestion" : X
    }, "team-lead"), !J && Y && JY.createElement(T, {
        dimColor: !0
    }, ": ", Y, "…"), !J && !Y && _ && JY.createElement(T, {
        dimColor: !0
    }, ": ", _), z !== void 0 && z > 0 && JY.createElement(T, {
        dimColor: !D
    }, " ", "· ", fq(z), " tokens"), D && JY.createElement(T, {
        dimColor: !0
    }, " · ", eQ6), M && !J && JY.createElement(T, {
        dimColor: !0
    }, " · enter to view")), j.map((Z, G) => JY.createElement(YZ4, {
        key: Z.id,
        teammate: Z,
        isLast: !q && G === j.length - 1,
        isSelected: q && A === G,
        isForegrounded: O === Z.id,
        allIdle: K,
        showPreview: $
    })), q && JY.createElement(I6Y, {
        isSelected: P
    }))
}
// @from(Ln 277084, Col 0)
function I6Y(A) {
    let q = A6(18),
        {
            isSelected: K
        } = A,
        Y = K ? "suggestion" : void 0,
        z = K ? a6.pointer : " ",
        _;
    if (q[0] !== K || q[1] !== Y || q[2] !== z) _ = JY.createElement(T, {
        color: Y,
        bold: K
    }, z), q[0] = K, q[1] = Y, q[2] = z, q[3] = _;
    else _ = q[3];
    let w = !K,
        O = K ? "╘═" : "└─",
        $;
    if (q[4] !== K || q[5] !== w || q[6] !== O) $ = JY.createElement(T, {
        dimColor: w,
        bold: K
    }, O, " "), q[4] = K, q[5] = w, q[6] = O, q[7] = $;
    else $ = q[7];
    let H = !K,
        j;
    if (q[8] !== K || q[9] !== H) j = JY.createElement(T, {
        dimColor: H,
        bold: K
    }, "hide"), q[8] = K, q[9] = H, q[10] = j;
    else j = q[10];
    let J;
    if (q[11] !== K) J = K && JY.createElement(T, {
        dimColor: !0
    }, " · enter to collapse"), q[11] = K, q[12] = J;
    else J = q[12];
    let M;
    if (q[13] !== _ || q[14] !== $ || q[15] !== j || q[16] !== J) M = JY.createElement(m, {
        paddingLeft: 3
    }, _, $, j, J), q[13] = _, q[14] = $, q[15] = j, q[16] = J, q[17] = M;
    else M = q[17];
    return M
}
// @from(Ln 277124, Col 4)
JY
// @from(Ln 277125, Col 4)
zL8 = E(() => {
    e6();
    b7();
    i6();
    NA();
    sk();
    M4();
    zZ4();
    JY = t(P6(), 1)
})
// @from(Ln 277136, Col 0)
function F96() {
    return w8("tengu_marble_whisper2", !1)
}
// @from(Ln 277140, Col 0)
function _Z4(A) {
    if (!F96()) return [];
    let q = [],
        K = A.matchAll(b6Y);
    for (let Y of K)
        if (Y.index !== void 0) q.push({
            word: Y[0],
            start: Y.index,
            end: Y.index + Y[0].length
        });
    return q
}
// @from(Ln 277152, Col 0)
async function wZ4({
    question: A,
    cacheSafeParams: q
}) {
    let K = `<system-reminder>This is a side question from the user. You must answer this question directly in a single response.

IMPORTANT CONTEXT:
- You are a separate, lightweight agent spawned to answer this one question
- The main agent is NOT interrupted - it continues working independently in the background
- You share the conversation context but are a completely separate instance
- Do NOT reference being interrupted or what you were "previously doing" - that framing is incorrect

CRITICAL CONSTRAINTS:
- You have NO tools available - you cannot read files, run commands, search, or take any actions
- This is a one-off response - there will be no follow-up turns
- You can ONLY provide information based on what you already know from the conversation context
- NEVER say things like "Let me try...", "I'll now...", "Let me check...", or promise to take any action
- If you don't know the answer, say so - do not offer to look it up or investigate

Simply answer the question with the information you have.</system-reminder>

${A}`,
        Y = await av({
            promptMessages: [p1({
                content: K
            })],
            cacheSafeParams: q,
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
            maxTurns: 1,
            skipCacheWrite: !0
        });
    return {
        response: x6Y(Y.messages),
        usage: Y.totalUsage
    }
}
// @from(Ln 277198, Col 0)
function x6Y(A) {
    let q = A.flatMap((Y) => Y.type === "assistant" ? Y.message.content : []);
    if (q.length > 0) {
        let Y = q.filter((_) => _.type === "text").map((_) => ("text" in _) ? _.text : "").join(`

`).trim();
        if (Y) return Y;
        let z = q.find((_) => _.type === "tool_use");
        if (z) return `(The model tried to call ${"name"in z?z.name:"a tool"} instead of answering directly. Try rephrasing or ask in the main conversation.)`
    }
    let K = A.find((Y) => Y.type === "system" && ("subtype" in Y) && Y.subtype === "api_error");
    if (K) return `(API error: ${i06(K.error)})`;
    return null
}
// @from(Ln 277212, Col 4)
b6Y
// @from(Ln 277213, Col 4)
FZ6 = E(() => {
    gR();
    JA();
    HA();
    uv();
    b6Y = /^\/btw\b/gi
})
// @from(Ln 277221, Col 0)
function jZ4(A) {
    let q = A6(5),
        K = M1(m6Y),
        Y = M1(u6Y);
    if ((Vn() || KG() && (t6(process.env.CLAUDE_CODE_BRIEF) || w8("tengu_kairos_brief", !1))) && K && !Y) {
        let _;
        if (q[0] !== A.mode || q[1] !== A.overrideMessage) _ = Pq.createElement(g6Y, {
            mode: A.mode,
            overrideMessage: A.overrideMessage
        }), q[0] = A.mode, q[1] = A.overrideMessage, q[2] = _;
        else _ = q[2];
        return _
    }
    let z;
    if (q[3] !== A) z = Pq.createElement(B6Y, {
        ...A
    }), q[3] = A, q[4] = z;
    else z = q[4];
    return z
}
// @from(Ln 277242, Col 0)
function u6Y(A) {
    return A.viewingAgentTaskId
}
// @from(Ln 277246, Col 0)
function m6Y(A) {
    return A.isBriefOnly
}
// @from(Ln 277250, Col 0)
function B6Y({
    mode: A,
    loadingStartTimeRef: q,
    totalPausedMsRef: K,
    pauseStartTimeRef: Y,
    spinnerTip: z,
    responseLengthRef: _,
    overrideColor: w,
    overrideShimmerColor: O,
    overrideMessage: $,
    spinnerSuffix: H,
    verbose: j,
    hasActiveTools: J = !1,
    leaderIsIdle: M = !1
}) {
    let D = Kj(),
        X = D.prefersReducedMotion ?? !1,
        P = M1((O6) => O6.tasks),
        W = M1((O6) => O6.viewingAgentTaskId),
        Z = M1((O6) => O6.expandedView),
        G = Z === "tasks",
        f = Z === "teammates",
        v = M1((O6) => O6.selectedIPAgentIndex),
        N = M1((O6) => O6.viewSelectionMode),
        V = W ? vR({
            viewingAgentTaskId: W,
            tasks: P
        }) : void 0,
        {
            columns: L
        } = KA(),
        h = cQ6(),
        [R, u] = FR.useState(null),
        I = FR.useRef(null);
    FR.useEffect(() => {
        let O6 = null,
            L6 = null;
        if (A === "thinking") {
            if (I.current === null) I.current = Date.now(), u("thinking")
        } else if (I.current !== null) {
            let y6 = Date.now() - I.current,
                G6 = Date.now() - I.current,
                R6 = Math.max(0, 2000 - G6);
            I.current = null;
            let T6 = () => {
                u(y6), L6 = setTimeout(u, 2000, null)
            };
            if (R6 > 0) O6 = setTimeout(T6, R6);
            else T6()
        }
        return () => {
            if (O6) clearTimeout(O6);
            if (L6) clearTimeout(L6)
        }
    }, [A]);
    let g = h?.find((O6) => O6.status !== "pending" && O6.status !== "completed"),
        B = d6Y(h),
        [b] = FR.useState(() => YM(x96())),
        p = $ ?? g?.activeForm ?? g?.subject ?? b,
        U = (V && !V.isIdle ? V.spinnerVerb ?? b : p) + "…";
    FR.useEffect(() => {
        let O6 = "spinner-" + A;
        return b96.startCLIActivity(O6), () => {
            b96.endCLIActivity(O6)
        }
    }, [A]);
    let r = M1((O6) => O6.effortValue),
        e = vD6(cK(), r),
        Y6 = BR(P).filter((O6) => O6.status === "running"),
        H6 = Y6.length > 0,
        J6 = H6 && Y6.every((O6) => O6.isIdle),
        K6 = 0;
    if (!f) {
        for (let O6 of Object.values(P))
            if (M$(O6) && O6.status === "running") {
                if (O6.progress?.tokenCount) K6 += O6.progress.tokenCount
            }
    }
    let s = Y.current !== null ? Y.current - q.current - K.current : Date.now() - q.current - K.current,
        X6 = Math.round(_.current / 4),
        z6 = "claude",
        N6 = "claudeShimmer",
        $6 = w ?? z6,
        n = O ?? N6,
        o = null;
    if (M && H6 && !V) return Pq.createElement(m, {
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start"
    }, Pq.createElement(m, {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 1,
        width: "100%"
    }, Pq.createElement(T, {
        dimColor: !0
    }, Me, " Idle", !J6 && " · teammates running")), f && Pq.createElement(gZ1, {
        selectedIndex: v,
        isInSelectionMode: N === "selecting-agent",
        allIdle: J6,
        leaderTokenCount: X6,
        leaderIdleText: "Idle"
    }));
    if (V?.isIdle) {
        let O6 = J6 ? `${Me} Worked for ${UK(Date.now()-V.startTime)}` : `${Me} Idle`;
        return Pq.createElement(m, {
            flexDirection: "column",
            width: "100%",
            alignItems: "flex-start"
        }, Pq.createElement(m, {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 1,
            width: "100%"
        }, Pq.createElement(T, {
            dimColor: !0
        }, O6)), f && H6 && Pq.createElement(gZ1, {
            selectedIndex: v,
            isInSelectionMode: N === "selecting-agent",
            allIdle: J6,
            leaderVerb: M ? void 0 : p,
            leaderIdleText: M ? "Idle" : void 0,
            leaderTokenCount: X6
        }))
    }
    let a = D.spinnerTipsEnabled !== !1,
        i = a && s > 1800000,
        l = a && s > 30000 && F96() && !X1().btwUseCount,
        q6 = i && !B ? "Use /clear to start fresh when switching topics and free up context" : l && !B ? "Use /btw to ask a quick side question without interrupting Claude's current work" : z,
        w6 = null;
    return Pq.createElement(m, {
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start"
    }, Pq.createElement(aW4, {
        mode: A,
        reducedMotion: X,
        hasActiveTools: J,
        responseLengthRef: _,
        message: U,
        messageColor: $6,
        shimmerColor: n,
        overrideColor: w,
        loadingStartTimeRef: q,
        totalPausedMsRef: K,
        pauseStartTimeRef: Y,
        spinnerSuffix: H,
        verbose: j,
        columns: L,
        hasRunningTeammates: H6,
        teammateTokens: K6,
        foregroundedTeammate: V,
        leaderIsIdle: M,
        thinkingStatus: R,
        effortSuffix: e
    }), f && H6 ? Pq.createElement(gZ1, {
        selectedIndex: v,
        isInSelectionMode: N === "selecting-agent",
        allIdle: J6,
        leaderVerb: M ? void 0 : p,
        leaderIdleText: M ? "Idle" : void 0,
        leaderTokenCount: X6
    }) : G && h && h.length > 0 ? Pq.createElement(m, {
        width: "100%",
        flexDirection: "column"
    }, Pq.createElement(t1, null, Pq.createElement(VZ1, {
        tasks: h
    }))) : B || q6 || w6 ? Pq.createElement(m, {
        width: "100%",
        flexDirection: "column"
    }, w6 && Pq.createElement(t1, null, Pq.createElement(T, {
        dimColor: !0
    }, w6)), (B || q6) && Pq.createElement(t1, null, Pq.createElement(T, {
        dimColor: !0
    }, B ? `Next: ${B.subject}` : `Tip: ${q6}`))) : null)
}
// @from(Ln 277427, Col 0)
function g6Y(A) {
    let q = A6(13),
        {
            mode: K,
            overrideMessage: Y
        } = A,
        _ = Kj().prefersReducedMotion ?? !1,
        [w, O] = FR.useState(0),
        [$] = FR.useState(U6Y),
        H = Y ?? $,
        j, J;
    if (q[0] !== K) j = () => {
        let f = "spinner-" + K;
        return b96.startCLIActivity(f), () => {
            b96.endCLIActivity(f)
        }
    }, J = [K], q[0] = K, q[1] = j, q[2] = J;
    else j = q[1], J = q[2];
    FR.useEffect(j, J);
    let M, D;
    if (q[3] !== _) M = () => {
        if (_) return;
        let f = setInterval(p6Y, 400, O);
        return () => clearInterval(f)
    }, D = [_], q[3] = _, q[4] = M, q[5] = D;
    else M = q[4], D = q[5];
    FR.useEffect(M, D);
    let X = M1(F6Y),
        P;
    if (q[6] !== w || q[7] !== _) P = _ ? "…" : ".".repeat(w + 1), q[6] = w, q[7] = _, q[8] = P;
    else P = q[8];
    let W = P,
        Z = X > 0 ? ` · ${X} in background` : "",
        G;
    if (q[9] !== W || q[10] !== Z || q[11] !== H) G = Pq.createElement(m, {
        marginTop: 1,
        paddingLeft: 2
    }, Pq.createElement(T, {
        dimColor: !0
    }, H, W, Z)), q[9] = W, q[10] = Z, q[11] = H, q[12] = G;
    else G = q[12];
    return G
}
// @from(Ln 277471, Col 0)
function F6Y(A) {
    return Object.values(A.tasks).filter(ij).length
}
// @from(Ln 277475, Col 0)
function p6Y(A) {
    return A(Q6Y)
}
// @from(Ln 277479, Col 0)
function Q6Y(A) {
    return (A + 1) % 3
}
// @from(Ln 277483, Col 0)
function U6Y() {
    return YM(x96())
}
// @from(Ln 277487, Col 0)
function JZ4() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = Pq.createElement(m, {
        marginTop: 1,
        paddingLeft: 2
    }, Pq.createElement(T, {
        color: "subtle"
    }, "Idle")), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 277500, Col 0)
function Wq() {
    let A = A6(8),
        K = Kj().prefersReducedMotion ?? !1,
        [Y, z] = gJ(K ? null : 120);
    if (K) {
        let H;
        if (A[0] === Symbol.for("react.memo_cache_sentinel")) H = Pq.createElement(T, {
            color: "text"
        }, "●"), A[0] = H;
        else H = A[0];
        let j;
        if (A[1] !== Y) j = Pq.createElement(m, {
            ref: Y,
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, H), A[1] = Y, A[2] = j;
        else j = A[2];
        return j
    }
    let _ = Math.floor(z / 120) % HZ4.length,
        w = HZ4[_],
        O;
    if (A[3] !== w) O = Pq.createElement(T, {
        color: "text"
    }, w), A[3] = w, A[4] = O;
    else O = A[4];
    let $;
    if (A[5] !== Y || A[6] !== O) $ = Pq.createElement(m, {
        ref: Y,
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, O), A[5] = Y, A[6] = O, A[7] = $;
    else $ = A[7];
    return $
}
// @from(Ln 277538, Col 0)
function d6Y(A) {
    if (!A) return;
    let q = A.filter((Y) => Y.status === "pending");
    if (q.length === 0) return;
    let K = new Set(A.filter((Y) => Y.status !== "completed").map((Y) => Y.id));
    return q.find((Y) => !Y.blockedBy.some((z) => K.has(z))) ?? q[0]
}
// @from(Ln 277545, Col 4)
Pq
// @from(Ln 277545, Col 8)
FR
// @from(Ln 277545, Col 12)
$Z4
// @from(Ln 277545, Col 17)
HZ4
// @from(Ln 277546, Col 4)
LO = E(() => {
    e6();
    i6();
    T1();
    HA();
    A8();
    Nc();
    M4();
    Qy8();
    NZ1();
    iq();
    dy8();
    EZ1();
    NA();
    _q();
    nW4();
    sW4();
    nI();
    sk();
    wk();
    z4();
    p36();
    qw();
    T1();
    zL8();
    i6();
    k8();
    FZ6();
    Pq = t(P6(), 1), FR = t(P6(), 1), $Z4 = lQ6(), HZ4 = [...$Z4, ...[...$Z4].reverse()]
})
// @from(Ln 277576, Col 4)
AU6 = x((i6Y) => {
    function c6Y(A, q, K) {
        if (K === void 0) K = Array.prototype;
        if (A && typeof K.find === "function") return K.find.call(A, q);
        for (var Y = 0; Y < A.length; Y++)
            if (Object.prototype.hasOwnProperty.call(A, Y)) {
                var z = A[Y];
                if (q.call(void 0, z, Y, A)) return z
            }
    }

    function _L8(A, q) {
        if (q === void 0) q = Object;
        return q && typeof q.freeze === "function" ? q.freeze(A) : A
    }

    function l6Y(A, q) {
        if (A === null || typeof A !== "object") throw TypeError("target is not an object");
        for (var K in q)
            if (Object.prototype.hasOwnProperty.call(q, K)) A[K] = q[K];
        return A
    }
    var MZ4 = _L8({
            HTML: "text/html",
            isHTML: function(A) {
                return A === MZ4.HTML
            },
            XML_APPLICATION: "application/xml",
            XML_TEXT: "text/xml",
            XML_XHTML_APPLICATION: "application/xhtml+xml",
            XML_SVG_IMAGE: "image/svg+xml"
        }),
        DZ4 = _L8({
            HTML: "http://www.w3.org/1999/xhtml",
            isHTML: function(A) {
                return A === DZ4.HTML
            },
            SVG: "http://www.w3.org/2000/svg",
            XML: "http://www.w3.org/XML/1998/namespace",
            XMLNS: "http://www.w3.org/2000/xmlns/"
        });
    i6Y.assign = l6Y;
    i6Y.find = c6Y;
    i6Y.freeze = _L8;
    i6Y.MIME_TYPE = MZ4;
    i6Y.NAMESPACE = DZ4
})
// @from(Ln 277623, Col 4)
WL8 = x((J1Y) => {
    var vZ4 = AU6(),
        wg = vZ4.find,
        qU6 = vZ4.NAMESPACE;

    function t6Y(A) {
        return A !== ""
    }

    function e6Y(A) {
        return A ? A.split(/[\t\n\f\r ]+/).filter(t6Y) : []
    }

    function A1Y(A, q) {
        if (!A.hasOwnProperty(q)) A[q] = !0;
        return A
    }

    function XZ4(A) {
        if (!A) return [];
        var q = e6Y(A);
        return Object.keys(q.reduce(A1Y, {}))
    }

    function q1Y(A) {
        return function(q) {
            return A && A.indexOf(q) !== -1
        }
    }

    function YU6(A, q) {
        for (var K in A)
            if (Object.prototype.hasOwnProperty.call(A, K)) q[K] = A[K]
    }

    function tv(A, q) {
        var K = A.prototype;
        if (!(K instanceof q)) {
            let z = function() {};
            var Y = z;
            z.prototype = q.prototype, z = new z, YU6(K, z), A.prototype = K = z
        }
        if (K.constructor != A) {
            if (typeof A != "function") console.error("unknown Class:" + A);
            K.constructor = A
        }
    }
    var ev = {},
        tI = ev.ELEMENT_NODE = 1,
        QZ6 = ev.ATTRIBUTE_NODE = 2,
        FZ1 = ev.TEXT_NODE = 3,
        NZ4 = ev.CDATA_SECTION_NODE = 4,
        VZ4 = ev.ENTITY_REFERENCE_NODE = 5,
        K1Y = ev.ENTITY_NODE = 6,
        kZ4 = ev.PROCESSING_INSTRUCTION_NODE = 7,
        EZ4 = ev.COMMENT_NODE = 8,
        yZ4 = ev.DOCUMENT_NODE = 9,
        LZ4 = ev.DOCUMENT_TYPE_NODE = 10,
        Lc = ev.DOCUMENT_FRAGMENT_NODE = 11,
        Y1Y = ev.NOTATION_NODE = 12,
        GZ = {},
        EX = {},
        fww = GZ.INDEX_SIZE_ERR = (EX[1] = "Index size error", 1),
        Tww = GZ.DOMSTRING_SIZE_ERR = (EX[2] = "DOMString size error", 2),
        sv = GZ.HIERARCHY_REQUEST_ERR = (EX[3] = "Hierarchy request error", 3),
        vww = GZ.WRONG_DOCUMENT_ERR = (EX[4] = "Wrong document", 4),
        Nww = GZ.INVALID_CHARACTER_ERR = (EX[5] = "Invalid character", 5),
        Vww = GZ.NO_DATA_ALLOWED_ERR = (EX[6] = "No data allowed", 6),
        kww = GZ.NO_MODIFICATION_ALLOWED_ERR = (EX[7] = "No modification allowed", 7),
        RZ4 = GZ.NOT_FOUND_ERR = (EX[8] = "Not found", 8),
        Eww = GZ.NOT_SUPPORTED_ERR = (EX[9] = "Not supported", 9),
        PZ4 = GZ.INUSE_ATTRIBUTE_ERR = (EX[10] = "Attribute in use", 10),
        yww = GZ.INVALID_STATE_ERR = (EX[11] = "Invalid state", 11),
        Lww = GZ.SYNTAX_ERR = (EX[12] = "Syntax error", 12),
        Rww = GZ.INVALID_MODIFICATION_ERR = (EX[13] = "Invalid modification", 13),
        hww = GZ.NAMESPACE_ERR = (EX[14] = "Invalid namespace", 14),
        Sww = GZ.INVALID_ACCESS_ERR = (EX[15] = "Invalid access", 15);

    function nj(A, q) {
        if (q instanceof Error) var K = q;
        else if (K = this, Error.call(this, EX[A]), this.message = EX[A], Error.captureStackTrace) Error.captureStackTrace(this, nj);
        if (K.code = A, q) this.message = this.message + ": " + q;
        return K
    }
    nj.prototype = Error.prototype;
    YU6(GZ, nj);

    function yc() {}
    yc.prototype = {
        length: 0,
        item: function(A) {
            return A >= 0 && A < this.length ? this[A] : null
        },
        toString: function(A, q) {
            for (var K = [], Y = 0; Y < this.length; Y++) pZ6(this[Y], K, A, q);
            return K.join("")
        },
        filter: function(A) {
            return Array.prototype.filter.call(this, A)
        },
        indexOf: function(A) {
            return Array.prototype.indexOf.call(this, A)
        }
    };

    function UZ6(A, q) {
        this._node = A, this._refresh = q, $L8(this)
    }

    function $L8(A) {
        var q = A._node._inc || A._node.ownerDocument._inc;
        if (A._inc !== q) {
            var K = A._refresh(A._node);
            if (pZ4(A, "length", K.length), !A.$$length || K.length < A.$$length) {
                for (var Y = K.length; Y in A; Y++)
                    if (Object.prototype.hasOwnProperty.call(A, Y)) delete A[Y]
            }
            YU6(K, A), A._inc = q
        }
    }
    UZ6.prototype.item = function(A) {
        return $L8(this), this[A] || null
    };
    tv(UZ6, yc);

    function pZ1() {}

    function hZ4(A, q) {
        var K = A.length;
        while (K--)
            if (A[K] === q) return K
    }

    function WZ4(A, q, K, Y) {
        if (Y) q[hZ4(q, Y)] = K;
        else q[q.length++] = K;
        if (A) {
            K.ownerElement = A;
            var z = A.ownerDocument;
            if (z) Y && IZ4(z, A, Y), z1Y(z, A, K)
        }
    }

    function ZZ4(A, q, K) {
        var Y = hZ4(q, K);
        if (Y >= 0) {
            var z = q.length - 1;
            while (Y < z) q[Y] = q[++Y];
            if (q.length = z, A) {
                var _ = A.ownerDocument;
                if (_) IZ4(_, A, K), K.ownerElement = null
            }
        } else throw new nj(RZ4, Error(A.tagName + "@" + K))
    }
    pZ1.prototype = {
        length: 0,
        item: yc.prototype.item,
        getNamedItem: function(A) {
            var q = this.length;
            while (q--) {
                var K = this[q];
                if (K.nodeName == A) return K
            }
        },
        setNamedItem: function(A) {
            var q = A.ownerElement;
            if (q && q != this._ownerElement) throw new nj(PZ4);
            var K = this.getNamedItem(A.nodeName);
            return WZ4(this._ownerElement, this, A, K), K
        },
        setNamedItemNS: function(A) {
            var q = A.ownerElement,
                K;
            if (q && q != this._ownerElement) throw new nj(PZ4);
            return K = this.getNamedItemNS(A.namespaceURI, A.localName), WZ4(this._ownerElement, this, A, K), K
        },
        removeNamedItem: function(A) {
            var q = this.getNamedItem(A);
            return ZZ4(this._ownerElement, this, q), q
        },
        removeNamedItemNS: function(A, q) {
            var K = this.getNamedItemNS(A, q);
            return ZZ4(this._ownerElement, this, K), K
        },
        getNamedItemNS: function(A, q) {
            var K = this.length;
            while (K--) {
                var Y = this[K];
                if (Y.localName == q && Y.namespaceURI == A) return Y
            }
            return null
        }
    };

    function SZ4() {}
    SZ4.prototype = {
        hasFeature: function(A, q) {
            return !0
        },
        createDocument: function(A, q, K) {
            var Y = new zU6;
            if (Y.implementation = this, Y.childNodes = new yc, Y.doctype = K || null, K) Y.appendChild(K);
            if (q) {
                var z = Y.createElementNS(A, q);
                Y.appendChild(z)
            }
            return Y
        },
        createDocumentType: function(A, q, K) {
            var Y = new dZ1;
            return Y.name = A, Y.nodeName = A, Y.publicId = q || "", Y.systemId = K || "", Y
        }
    };

    function d_() {}
    d_.prototype = {
        firstChild: null,
        lastChild: null,
        previousSibling: null,
        nextSibling: null,
        attributes: null,
        parentNode: null,
        childNodes: null,
        ownerDocument: null,
        nodeValue: null,
        namespaceURI: null,
        prefix: null,
        localName: null,
        insertBefore: function(A, q) {
            return QZ1(this, A, q)
        },
        replaceChild: function(A, q) {
            if (QZ1(this, A, q, xZ4), q) this.removeChild(q)
        },
        removeChild: function(A) {
            return bZ4(this, A)
        },
        appendChild: function(A) {
            return this.insertBefore(A, null)
        },
        hasChildNodes: function() {
            return this.firstChild != null
        },
        cloneNode: function(A) {
            return OL8(this.ownerDocument || this, this, A)
        },
        normalize: function() {
            var A = this.firstChild;
            while (A) {
                var q = A.nextSibling;
                if (q && q.nodeType == FZ1 && A.nodeType == FZ1) this.removeChild(q), A.appendData(q.data);
                else A.normalize(), A = q
            }
        },
        isSupported: function(A, q) {
            return this.ownerDocument.implementation.hasFeature(A, q)
        },
        hasAttributes: function() {
            return this.attributes.length > 0
        },
        lookupPrefix: function(A) {
            var q = this;
            while (q) {
                var K = q._nsMap;
                if (K) {
                    for (var Y in K)
                        if (Object.prototype.hasOwnProperty.call(K, Y) && K[Y] === A) return Y
                }
                q = q.nodeType == QZ6 ? q.ownerDocument : q.parentNode
            }
            return null
        },
        lookupNamespaceURI: function(A) {
            var q = this;
            while (q) {
                var K = q._nsMap;
                if (K) {
                    if (Object.prototype.hasOwnProperty.call(K, A)) return K[A]
                }
                q = q.nodeType == QZ6 ? q.ownerDocument : q.parentNode
            }
            return null
        },
        isDefaultNamespace: function(A) {
            var q = this.lookupPrefix(A);
            return q == null
        }
    };

    function CZ4(A) {
        return A == "<" && "&lt;" || A == ">" && "&gt;" || A == "&" && "&amp;" || A == '"' && "&quot;" || "&#" + A.charCodeAt() + ";"
    }
    YU6(ev, d_);
    YU6(ev, d_.prototype);

    function KU6(A, q) {
        if (q(A)) return !0;
        if (A = A.firstChild)
            do
                if (KU6(A, q)) return !0; while (A = A.nextSibling)
    }

    function zU6() {
        this.ownerDocument = this
    }

    function z1Y(A, q, K) {
        A && A._inc++;
        var Y = K.namespaceURI;
        if (Y === qU6.XMLNS) q._nsMap[K.prefix ? K.localName : ""] = K.value
    }

    function IZ4(A, q, K, Y) {
        A && A._inc++;
        var z = K.namespaceURI;
        if (z === qU6.XMLNS) delete q._nsMap[K.prefix ? K.localName : ""]
    }

    function HL8(A, q, K) {
        if (A && A._inc) {
            A._inc++;
            var Y = q.childNodes;
            if (K) Y[Y.length++] = K;
            else {
                var z = q.firstChild,
                    _ = 0;
                while (z) Y[_++] = z, z = z.nextSibling;
                Y.length = _, delete Y[Y.length]
            }
        }
    }

    function bZ4(A, q) {
        var {
            previousSibling: K,
            nextSibling: Y
        } = q;
        if (K) K.nextSibling = Y;
        else A.firstChild = Y;
        if (Y) Y.previousSibling = K;
        else A.lastChild = K;
        return q.parentNode = null, q.previousSibling = null, q.nextSibling = null, HL8(A.ownerDocument, A), q
    }

    function _1Y(A) {
        return A && (A.nodeType === d_.DOCUMENT_NODE || A.nodeType === d_.DOCUMENT_FRAGMENT_NODE || A.nodeType === d_.ELEMENT_NODE)
    }

    function w1Y(A) {
        return A && (Og(A) || jL8(A) || Rc(A) || A.nodeType === d_.DOCUMENT_FRAGMENT_NODE || A.nodeType === d_.COMMENT_NODE || A.nodeType === d_.PROCESSING_INSTRUCTION_NODE)
    }

    function Rc(A) {
        return A && A.nodeType === d_.DOCUMENT_TYPE_NODE
    }

    function Og(A) {
        return A && A.nodeType === d_.ELEMENT_NODE
    }

    function jL8(A) {
        return A && A.nodeType === d_.TEXT_NODE
    }

    function GZ4(A, q) {
        var K = A.childNodes || [];
        if (wg(K, Og) || Rc(q)) return !1;
        var Y = wg(K, Rc);
        return !(q && Y && K.indexOf(Y) > K.indexOf(q))
    }

    function fZ4(A, q) {
        var K = A.childNodes || [];

        function Y(_) {
            return Og(_) && _ !== q
        }
        if (wg(K, Y)) return !1;
        var z = wg(K, Rc);
        return !(q && z && K.indexOf(z) > K.indexOf(q))
    }

    function O1Y(A, q, K) {
        if (!_1Y(A)) throw new nj(sv, "Unexpected parent node type " + A.nodeType);
        if (K && K.parentNode !== A) throw new nj(RZ4, "child not in parent");
        if (!w1Y(q) || Rc(q) && A.nodeType !== d_.DOCUMENT_NODE) throw new nj(sv, "Unexpected node type " + q.nodeType + " for parent node type " + A.nodeType)
    }

    function $1Y(A, q, K) {
        var Y = A.childNodes || [],
            z = q.childNodes || [];
        if (q.nodeType === d_.DOCUMENT_FRAGMENT_NODE) {
            var _ = z.filter(Og);
            if (_.length > 1 || wg(z, jL8)) throw new nj(sv, "More than one element or text in fragment");
            if (_.length === 1 && !GZ4(A, K)) throw new nj(sv, "Element in fragment can not be inserted before doctype")
        }
        if (Og(q)) {
            if (!GZ4(A, K)) throw new nj(sv, "Only one element can be added and only after doctype")
        }
        if (Rc(q)) {
            if (wg(Y, Rc)) throw new nj(sv, "Only one doctype is allowed");
            var w = wg(Y, Og);
            if (K && Y.indexOf(w) < Y.indexOf(K)) throw new nj(sv, "Doctype can only be inserted before an element");
            if (!K && w) throw new nj(sv, "Doctype can not be appended since element is present")
        }
    }

    function xZ4(A, q, K) {
        var Y = A.childNodes || [],
            z = q.childNodes || [];
        if (q.nodeType === d_.DOCUMENT_FRAGMENT_NODE) {
            var _ = z.filter(Og);
            if (_.length > 1 || wg(z, jL8)) throw new nj(sv, "More than one element or text in fragment");
            if (_.length === 1 && !fZ4(A, K)) throw new nj(sv, "Element in fragment can not be inserted before doctype")
        }
        if (Og(q)) {
            if (!fZ4(A, K)) throw new nj(sv, "Only one element can be added and only after doctype")
        }
        if (Rc(q)) {
            let $ = function(H) {
                return Rc(H) && H !== K
            };
            var O = $;
            if (wg(Y, $)) throw new nj(sv, "Only one doctype is allowed");
            var w = wg(Y, Og);
            if (K && Y.indexOf(w) < Y.indexOf(K)) throw new nj(sv, "Doctype can only be inserted before an element")
        }
    }

    function QZ1(A, q, K, Y) {
        if (O1Y(A, q, K), A.nodeType === d_.DOCUMENT_NODE)(Y || $1Y)(A, q, K);
        var z = q.parentNode;
        if (z) z.removeChild(q);
        if (q.nodeType === Lc) {
            var _ = q.firstChild;
            if (_ == null) return q;
            var w = q.lastChild
        } else _ = w = q;
        var O = K ? K.previousSibling : A.lastChild;
        if (_.previousSibling = O, w.nextSibling = K, O) O.nextSibling = _;
        else A.firstChild = _;
        if (K == null) A.lastChild = w;
        else K.previousSibling = w;
        do _.parentNode = A; while (_ !== w && (_ = _.nextSibling));
        if (HL8(A.ownerDocument || A, A), q.nodeType == Lc) q.firstChild = q.lastChild = null;
        return q
    }

    function H1Y(A, q) {
        if (q.parentNode) q.parentNode.removeChild(q);
        if (q.parentNode = A, q.previousSibling = A.lastChild, q.nextSibling = null, q.previousSibling) q.previousSibling.nextSibling = q;
        else A.firstChild = q;
        return A.lastChild = q, HL8(A.ownerDocument, A, q), q
    }
    zU6.prototype = {
        nodeName: "#document",
        nodeType: yZ4,
        doctype: null,
        documentElement: null,
        _inc: 1,
        insertBefore: function(A, q) {
            if (A.nodeType == Lc) {
                var K = A.firstChild;
                while (K) {
                    var Y = K.nextSibling;
                    this.insertBefore(K, q), K = Y
                }
                return A
            }
            if (QZ1(this, A, q), A.ownerDocument = this, this.documentElement === null && A.nodeType === tI) this.documentElement = A;
            return A
        },
        removeChild: function(A) {
            if (this.documentElement == A) this.documentElement = null;
            return bZ4(this, A)
        },
        replaceChild: function(A, q) {
            if (QZ1(this, A, q, xZ4), A.ownerDocument = this, q) this.removeChild(q);
            if (Og(A)) this.documentElement = A
        },
        importNode: function(A, q) {
            return FZ4(this, A, q)
        },
        getElementById: function(A) {
            var q = null;
            return KU6(this.documentElement, function(K) {
                if (K.nodeType == tI) {
                    if (K.getAttribute("id") == A) return q = K, !0
                }
            }), q
        },
        getElementsByClassName: function(A) {
            var q = XZ4(A);
            return new UZ6(this, function(K) {
                var Y = [];
                if (q.length > 0) KU6(K.documentElement, function(z) {
                    if (z !== K && z.nodeType === tI) {
                        var _ = z.getAttribute("class");
                        if (_) {
                            var w = A === _;
                            if (!w) {
                                var O = XZ4(_);
                                w = q.every(q1Y(O))
                            }
                            if (w) Y.push(z)
                        }
                    }
                });
                return Y
            })
        },
        createElement: function(A) {
            var q = new p96;
            q.ownerDocument = this, q.nodeName = A, q.tagName = A, q.localName = A, q.childNodes = new yc;
            var K = q.attributes = new pZ1;
            return K._ownerElement = q, q
        },
        createDocumentFragment: function() {
            var A = new cZ1;
            return A.ownerDocument = this, A.childNodes = new yc, A
        },
        createTextNode: function(A) {
            var q = new JL8;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createComment: function(A) {
            var q = new ML8;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createCDATASection: function(A) {
            var q = new DL8;
            return q.ownerDocument = this, q.appendData(A), q
        },
        createProcessingInstruction: function(A, q) {
            var K = new PL8;
            return K.ownerDocument = this, K.tagName = K.nodeName = K.target = A, K.nodeValue = K.data = q, K
        },
        createAttribute: function(A) {
            var q = new UZ1;
            return q.ownerDocument = this, q.name = A, q.nodeName = A, q.localName = A, q.specified = !0, q
        },
        createEntityReference: function(A) {
            var q = new XL8;
            return q.ownerDocument = this, q.nodeName = A, q
        },
        createElementNS: function(A, q) {
            var K = new p96,
                Y = q.split(":"),
                z = K.attributes = new pZ1;
            if (K.childNodes = new yc, K.ownerDocument = this, K.nodeName = q, K.tagName = q, K.namespaceURI = A, Y.length == 2) K.prefix = Y[0], K.localName = Y[1];
            else K.localName = q;
            return z._ownerElement = K, K
        },
        createAttributeNS: function(A, q) {
            var K = new UZ1,
                Y = q.split(":");
            if (K.ownerDocument = this, K.nodeName = q, K.name = q, K.namespaceURI = A, K.specified = !0, Y.length == 2) K.prefix = Y[0], K.localName = Y[1];
            else K.localName = q;
            return K
        }
    };
    tv(zU6, d_);

    function p96() {
        this._nsMap = {}
    }
    p96.prototype = {
        nodeType: tI,
        hasAttribute: function(A) {
            return this.getAttributeNode(A) != null
        },
        getAttribute: function(A) {
            var q = this.getAttributeNode(A);
            return q && q.value || ""
        },
        getAttributeNode: function(A) {
            return this.attributes.getNamedItem(A)
        },
        setAttribute: function(A, q) {
            var K = this.ownerDocument.createAttribute(A);
            K.value = K.nodeValue = "" + q, this.setAttributeNode(K)
        },
        removeAttribute: function(A) {
            var q = this.getAttributeNode(A);
            q && this.removeAttributeNode(q)
        },
        appendChild: function(A) {
            if (A.nodeType === Lc) return this.insertBefore(A, null);
            else return H1Y(this, A)
        },
        setAttributeNode: function(A) {
            return this.attributes.setNamedItem(A)
        },
        setAttributeNodeNS: function(A) {
            return this.attributes.setNamedItemNS(A)
        },
        removeAttributeNode: function(A) {
            return this.attributes.removeNamedItem(A.nodeName)
        },
        removeAttributeNS: function(A, q) {
            var K = this.getAttributeNodeNS(A, q);
            K && this.removeAttributeNode(K)
        },
        hasAttributeNS: function(A, q) {
            return this.getAttributeNodeNS(A, q) != null
        },
        getAttributeNS: function(A, q) {
            var K = this.getAttributeNodeNS(A, q);
            return K && K.value || ""
        },
        setAttributeNS: function(A, q, K) {
            var Y = this.ownerDocument.createAttributeNS(A, q);
            Y.value = Y.nodeValue = "" + K, this.setAttributeNode(Y)
        },
        getAttributeNodeNS: function(A, q) {
            return this.attributes.getNamedItemNS(A, q)
        },
        getElementsByTagName: function(A) {
            return new UZ6(this, function(q) {
                var K = [];
                return KU6(q, function(Y) {
                    if (Y !== q && Y.nodeType == tI && (A === "*" || Y.tagName == A)) K.push(Y)
                }), K
            })
        },
        getElementsByTagNameNS: function(A, q) {
            return new UZ6(this, function(K) {
                var Y = [];
                return KU6(K, function(z) {
                    if (z !== K && z.nodeType === tI && (A === "*" || z.namespaceURI === A) && (q === "*" || z.localName == q)) Y.push(z)
                }), Y
            })
        }
    };
    zU6.prototype.getElementsByTagName = p96.prototype.getElementsByTagName;
    zU6.prototype.getElementsByTagNameNS = p96.prototype.getElementsByTagNameNS;
    tv(p96, d_);

    function UZ1() {}
    UZ1.prototype.nodeType = QZ6;
    tv(UZ1, d_);

    function _U6() {}
    _U6.prototype = {
        data: "",
        substringData: function(A, q) {
            return this.data.substring(A, A + q)
        },
        appendData: function(A) {
            A = this.data + A, this.nodeValue = this.data = A, this.length = A.length
        },
        insertData: function(A, q) {
            this.replaceData(A, 0, q)
        },
        appendChild: function(A) {
            throw Error(EX[sv])
        },
        deleteData: function(A, q) {
            this.replaceData(A, q, "")
        },
        replaceData: function(A, q, K) {
            var Y = this.data.substring(0, A),
                z = this.data.substring(A + q);
            K = Y + K + z, this.nodeValue = this.data = K, this.length = K.length
        }
    };
    tv(_U6, d_);

    function JL8() {}
    JL8.prototype = {
        nodeName: "#text",
        nodeType: FZ1,
        splitText: function(A) {
            var q = this.data,
                K = q.substring(A);
            q = q.substring(0, A), this.data = this.nodeValue = q, this.length = q.length;
            var Y = this.ownerDocument.createTextNode(K);
            if (this.parentNode) this.parentNode.insertBefore(Y, this.nextSibling);
            return Y
        }
    };
    tv(JL8, _U6);

    function ML8() {}
    ML8.prototype = {
        nodeName: "#comment",
        nodeType: EZ4
    };
    tv(ML8, _U6);

    function DL8() {}
    DL8.prototype = {
        nodeName: "#cdata-section",
        nodeType: NZ4
    };
    tv(DL8, _U6);

    function dZ1() {}
    dZ1.prototype.nodeType = LZ4;
    tv(dZ1, d_);

    function uZ4() {}
    uZ4.prototype.nodeType = Y1Y;
    tv(uZ4, d_);

    function mZ4() {}
    mZ4.prototype.nodeType = K1Y;
    tv(mZ4, d_);

    function XL8() {}
    XL8.prototype.nodeType = VZ4;
    tv(XL8, d_);

    function cZ1() {}
    cZ1.prototype.nodeName = "#document-fragment";
    cZ1.prototype.nodeType = Lc;
    tv(cZ1, d_);

    function PL8() {}
    PL8.prototype.nodeType = kZ4;
    tv(PL8, d_);

    function BZ4() {}
    BZ4.prototype.serializeToString = function(A, q, K) {
        return gZ4.call(A, q, K)
    };
    d_.prototype.toString = gZ4;

    function gZ4(A, q) {
        var K = [],
            Y = this.nodeType == 9 && this.documentElement || this,
            z = Y.prefix,
            _ = Y.namespaceURI;
        if (_ && z == null) {
            var z = Y.lookupPrefix(_);
            if (z == null) var w = [{
                namespace: _,
                prefix: null
            }]
        }
        return pZ6(this, K, A, q, w), K.join("")
    }

    function TZ4(A, q, K) {
        var Y = A.prefix || "",
            z = A.namespaceURI;
        if (!z) return !1;
        if (Y === "xml" && z === qU6.XML || z === qU6.XMLNS) return !1;
        var _ = K.length;
        while (_--) {
            var w = K[_];
            if (w.prefix === Y) return w.namespace !== z
        }
        return !0
    }

    function wL8(A, q, K) {
        A.push(" ", q, '="', K.replace(/[<>&"\t\n\r]/g, CZ4), '"')
    }

    function pZ6(A, q, K, Y, z) {
        if (!z) z = [];
        if (Y)
            if (A = Y(A), A) {
                if (typeof A == "string") {
                    q.push(A);
                    return
                }
            } else return;
        switch (A.nodeType) {
            case tI:
                var _ = A.attributes,
                    w = _.length,
                    Z = A.firstChild,
                    O = A.tagName;
                K = qU6.isHTML(A.namespaceURI) || K;
                var $ = O;
                if (!K && !A.prefix && A.namespaceURI) {
                    var H;
                    for (var j = 0; j < _.length; j++)
                        if (_.item(j).name === "xmlns") {
                            H = _.item(j).value;
                            break
                        } if (!H)
                        for (var J = z.length - 1; J >= 0; J--) {
                            var M = z[J];
                            if (M.prefix === "" && M.namespace === A.namespaceURI) {
                                H = M.namespace;
                                break
                            }
                        }
                    if (H !== A.namespaceURI)
                        for (var J = z.length - 1; J >= 0; J--) {
                            var M = z[J];
                            if (M.namespace === A.namespaceURI) {
                                if (M.prefix) $ = M.prefix + ":" + O;
                                break
                            }
                        }
                }
                q.push("<", $);
                for (var D = 0; D < w; D++) {
                    var X = _.item(D);
                    if (X.prefix == "xmlns") z.push({
                        prefix: X.localName,
                        namespace: X.value
                    });
                    else if (X.nodeName == "xmlns") z.push({
                        prefix: "",
                        namespace: X.value
                    })
                }
                for (var D = 0; D < w; D++) {
                    var X = _.item(D);
                    if (TZ4(X, K, z)) {
                        var P = X.prefix || "",
                            W = X.namespaceURI;
                        wL8(q, P ? "xmlns:" + P : "xmlns", W), z.push({
                            prefix: P,
                            namespace: W
                        })
                    }
                    pZ6(X, q, K, Y, z)
                }
                if (O === $ && TZ4(A, K, z)) {
                    var P = A.prefix || "",
                        W = A.namespaceURI;
                    wL8(q, P ? "xmlns:" + P : "xmlns", W), z.push({
                        prefix: P,
                        namespace: W
                    })
                }
                if (Z || K && !/^(?:meta|link|img|br|hr|input)$/i.test(O)) {
                    if (q.push(">"), K && /^script$/i.test(O))
                        while (Z) {
                            if (Z.data) q.push(Z.data);
                            else pZ6(Z, q, K, Y, z.slice());
                            Z = Z.nextSibling
                        } else
                            while (Z) pZ6(Z, q, K, Y, z.slice()), Z = Z.nextSibling;
                    q.push("</", $, ">")
                } else q.push("/>");
                return;
            case yZ4:
            case Lc:
                var Z = A.firstChild;
                while (Z) pZ6(Z, q, K, Y, z.slice()), Z = Z.nextSibling;
                return;
            case QZ6:
                return wL8(q, A.name, A.value);
            case FZ1:
                return q.push(A.data.replace(/[<&>]/g, CZ4));
            case NZ4:
                return q.push("<![CDATA[", A.data, "]]>");
            case EZ4:
                return q.push("<!--", A.data, "-->");
            case LZ4:
                var {
                    publicId: G, systemId: f
                } = A;
                if (q.push("<!DOCTYPE ", A.name), G) {
                    if (q.push(" PUBLIC ", G), f && f != ".") q.push(" ", f);
                    q.push(">")
                } else if (f && f != ".") q.push(" SYSTEM ", f, ">");
                else {
                    var v = A.internalSubset;
                    if (v) q.push(" [", v, "]");
                    q.push(">")
                }
                return;
            case kZ4:
                return q.push("<?", A.target, " ", A.data, "?>");
            case VZ4:
                return q.push("&", A.nodeName, ";");
            default:
                q.push("??", A.nodeName)
        }
    }

    function FZ4(A, q, K) {
        var Y;
        switch (q.nodeType) {
            case tI:
                Y = q.cloneNode(!1), Y.ownerDocument = A;
            case Lc:
                break;
            case QZ6:
                K = !0;
                break
        }
        if (!Y) Y = q.cloneNode(!1);
        if (Y.ownerDocument = A, Y.parentNode = null, K) {
            var z = q.firstChild;
            while (z) Y.appendChild(FZ4(A, z, K)), z = z.nextSibling
        }
        return Y
    }

    function OL8(A, q, K) {
        var Y = new q.constructor;
        for (var z in q)
            if (Object.prototype.hasOwnProperty.call(q, z)) {
                var _ = q[z];
                if (typeof _ != "object") {
                    if (_ != Y[z]) Y[z] = _
                }
            } if (q.childNodes) Y.childNodes = new yc;
        switch (Y.ownerDocument = A, Y.nodeType) {
            case tI:
                var w = q.attributes,
                    O = Y.attributes = new pZ1,
                    $ = w.length;
                O._ownerElement = Y;
                for (var H = 0; H < $; H++) Y.setAttributeNode(OL8(A, w.item(H), !0));
                break;
            case QZ6:
                K = !0
        }
        if (K) {
            var j = q.firstChild;
            while (j) Y.appendChild(OL8(A, j, K)), j = j.nextSibling
        }
        return Y
    }

    function pZ4(A, q, K) {
        A[q] = K
    }
    try {
        if (Object.defineProperty) {
            let A = function(q) {
                switch (q.nodeType) {
                    case tI:
                    case Lc:
                        var K = [];
                        q = q.firstChild;
                        while (q) {
                            if (q.nodeType !== 7 && q.nodeType !== 8) K.push(A(q));
                            q = q.nextSibling
                        }
                        return K.join("");
                    default:
                        return q.nodeValue
                }
            };
            j1Y = A, Object.defineProperty(UZ6.prototype, "length", {
                get: function() {
                    return $L8(this), this.$$length
                }
            }), Object.defineProperty(d_.prototype, "textContent", {
                get: function() {
                    return A(this)
                },
                set: function(q) {
                    switch (this.nodeType) {
                        case tI:
                        case Lc:
                            while (this.firstChild) this.removeChild(this.firstChild);
                            if (q || String(q)) this.appendChild(this.ownerDocument.createTextNode(q));
                            break;
                        default:
                            this.data = q, this.value = q, this.nodeValue = q
                    }
                }
            }), pZ4 = function(q, K, Y) {
                q["$$" + K] = Y
            }
        }
    } catch (A) {}
    var j1Y;
    J1Y.DocumentType = dZ1;
    J1Y.DOMException = nj;
    J1Y.DOMImplementation = SZ4;
    J1Y.Element = p96;
    J1Y.Node = d_;
    J1Y.NodeList = yc;
    J1Y.XMLSerializer = BZ4
})