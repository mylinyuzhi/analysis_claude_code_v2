
// @from(Ln 138173, Col 0)
function hC1(A, q, K) {
    let Y = OJ1(A, K),
        z = [],
        w = 0,
        H = "",
        $ = !1;
    for (let _ of Y) {
        if (K !== void 0 && w >= K) break;
        if (_.type === "ansi") {
            if (z.push(_), $) H += _.code
        } else {
            if (!$ && w >= q) $ = !0, z = f87(vr(z)), H = cG(z);
            if ($) H += _.value;
            w += _.fullWidth ? 2 : _.value.length
        }
    }
    let O = f87(vr(z));
    return H += cG(Z71(O)), H
}
// @from(Ln 138192, Col 4)
wqA = v(() => {
    f71()
})
// @from(Ln 138196, Col 0)
function BO(A, q) {
    if (A === void 0) return;
    if (Number.isInteger(A)) return;
    h(`${q} should be an integer, got ${A}`, {
        level: "warn"
    })
}
// @from(Ln 138203, Col 4)
HqA = v(() => {
    Z6()
})
// @from(Ln 138206, Col 0)
class hK6 {
    strings = [" ", ""];
    stringMap = new Map([
        [" ", 0],
        ["", 1]
    ]);
    ascii = eV5();
    intern(A) {
        if (A.length === 1) {
            let Y = A.charCodeAt(0);
            if (Y < 128) {
                let z = this.ascii[Y];
                if (z !== -1) return z;
                let w = this.strings.length;
                return this.strings.push(A), this.ascii[Y] = w, w
            }
        }
        let q = this.stringMap.get(A);
        if (q !== void 0) return q;
        let K = this.strings.length;
        return this.strings.push(A), this.stringMap.set(A, K), K
    }
    get(A) {
        return this.strings[A] ?? " "
    }
}
// @from(Ln 138232, Col 0)
class IK6 {
    strings = [""];
    stringMap = new Map;
    intern(A) {
        if (!A) return 0;
        let q = this.stringMap.get(A);
        if (q === void 0) q = this.strings.length, this.strings.push(A), this.stringMap.set(A, q);
        return q
    }
    get(A) {
        return A === 0 ? void 0 : this.strings[A]
    }
}
// @from(Ln 138245, Col 0)
class OqA {
    ids = new Map;
    styles = [];
    transitionCache = new Map;
    none;
    constructor() {
        this.none = this.intern([])
    }
    intern(A) {
        let q = A.length === 0 ? "" : A.map((Y) => Y.code).join("\x00"),
            K = this.ids.get(q);
        if (K === void 0) {
            let Y = this.styles.length;
            this.styles.push(A.length === 0 ? [] : A), K = Y << 1 | (A.length > 0 && tV5(A) ? 1 : 0), this.ids.set(q, K)
        }
        return K
    }
    get(A) {
        return this.styles[A >>> 1] ?? []
    }
    transition(A, q) {
        if (A === q) return "";
        let K = A * 1048576 + q,
            Y = this.transitionCache.get(K);
        if (Y === void 0) Y = cG(MS(this.get(A), this.get(q))), this.transitionCache.set(K, Y);
        return Y
    }
}
// @from(Ln 138274, Col 0)
function tV5(A) {
    for (let q of A)
        if (sV5.has(q.endCode)) return !0;
    return !1
}
// @from(Ln 138280, Col 0)
function eV5() {
    let A = new Int32Array(128);
    return A.fill(-1), A[32] = IC1, A
}
// @from(Ln 138285, Col 0)
function Er(A, q, K) {
    return A << _J1 | q << xC1 | K
}
// @from(Ln 138289, Col 0)
function AN5(A, q) {
    let K = q << 1;
    return A.cells[K] === 0 && A.cells[K | 1] === 0
}
// @from(Ln 138294, Col 0)
function T87(A, q, K) {
    if (q < 0 || K < 0 || q >= A.width || K >= A.height) return !0;
    return AN5(A, K * A.width + q)
}
// @from(Ln 138299, Col 0)
function qN5(A, q) {
    return A.hyperlinkPool.intern(q)
}
// @from(Ln 138303, Col 0)
function bC1(A, q, K, Y, z) {
    if (BO(A, "createScreen width"), BO(q, "createScreen height"), !Number.isInteger(A) || A < 0) A = Math.max(0, Math.floor(A) || 0);
    if (!Number.isInteger(q) || q < 0) q = Math.max(0, Math.floor(q) || 0);
    let w = A * q,
        H = new ArrayBuffer(w << 3),
        $ = new Int32Array(H),
        O = new BigInt64Array(H);
    return {
        width: A,
        height: q,
        cells: $,
        cells64: O,
        charPool: Y,
        hyperlinkPool: z,
        emptyStyleId: K.none,
        damage: void 0
    }
}
// @from(Ln 138322, Col 0)
function v87(A, q, K) {
    if (BO(q, "resetScreen width"), BO(K, "resetScreen height"), !Number.isInteger(q) || q < 0) q = Math.max(0, Math.floor(q) || 0);
    if (!Number.isInteger(K) || K < 0) K = Math.max(0, Math.floor(K) || 0);
    let Y = q * K;
    if (A.cells64.length < Y) {
        let z = new ArrayBuffer(Y << 3);
        A.cells = new Int32Array(z), A.cells64 = new BigInt64Array(z)
    }
    A.cells64.fill($qA, 0, Y), A.width = q, A.height = K, A.damage = void 0
}
// @from(Ln 138333, Col 0)
function E87(A, q, K) {
    let {
        charPool: Y,
        hyperlinkPool: z
    } = A;
    if (Y === q && z === K) return;
    let w = A.width * A.height,
        H = A.cells;
    for (let $ = 0; $ < w << 1; $ += 2) {
        let O = H[$];
        H[$] = q.intern(Y.get(O));
        let _ = H[$ + 1],
            J = _ >>> xC1 & xK6;
        if (J !== 0) {
            let X = z.get(J),
                D = K.intern(X),
                j = _ >>> _J1,
                M = _ & ZL;
            H[$ + 1] = Er(j, D, M)
        }
    }
    A.charPool = q, A.hyperlinkPool = K
}
// @from(Ln 138357, Col 0)
function _qA(A, q, K) {
    if (q < 0 || K < 0 || q >= A.width || K >= A.height) return;
    return KN5(A, K * A.width + q)
}
// @from(Ln 138362, Col 0)
function KN5(A, q) {
    let K = q << 1,
        Y = A.cells[K + 1],
        z = Y >>> xC1 & xK6;
    return {
        char: A.charPool.get(A.cells[K]),
        styleId: Y >>> _J1,
        width: Y & ZL,
        hyperlink: z === 0 ? void 0 : A.hyperlinkPool.get(z)
    }
}
// @from(Ln 138374, Col 0)
function k87(A, q, K, Y, z) {
    let w = Y << 1,
        H = A[w];
    if (H === 1) return;
    let $ = A[w + 1];
    if (H === 0 && ($ & 262140) === 0) {
        let _ = $ >>> _J1;
        if (_ === 0 || _ === z) return
    }
    let O = $ >>> xC1 & xK6;
    return {
        char: q.get(H),
        styleId: $ >>> _J1,
        width: $ & ZL,
        hyperlink: O === 0 ? void 0 : K.get(O)
    }
}
// @from(Ln 138392, Col 0)
function kr(A, q, K) {
    let Y = q | 1,
        z = A.cells[Y];
    K.char = A.charPool.get(A.cells[q]), K.styleId = z >>> _J1, K.width = z & ZL;
    let w = z >>> xC1 & xK6;
    K.hyperlink = w === 0 ? void 0 : A.hyperlinkPool.get(w)
}
// @from(Ln 138400, Col 0)
function JqA(A, q, K) {
    if (q < 0 || K < 0 || q >= A.width || K >= A.height) return;
    let Y = K * A.width + q << 1;
    return A.charPool.get(A.cells[Y])
}
// @from(Ln 138406, Col 0)
function bK6(A, q, K, Y) {
    if (q < 0 || K < 0 || q >= A.width || K >= A.height) return;
    let z = K * A.width + q << 1,
        w = A.cells,
        H = w[z + 1] & ZL;
    if (H === 1 && Y.width !== 1) {
        if (q + 1 < A.width) {
            let X = z + 2;
            if ((w[X + 1] & ZL) === 2) w[X] = IC1, w[X + 1] = Er(A.emptyStyleId, 0, 0)
        }
    }
    let $ = -1;
    if (H === 2 && Y.width !== 2) {
        if (q > 0) {
            let J = z - 2;
            if ((w[J + 1] & ZL) === 1) w[J] = IC1, w[J + 1] = Er(A.emptyStyleId, 0, 0), $ = q - 1
        }
    }
    w[z] = YN5(A, Y.char), w[z + 1] = Er(Y.styleId, qN5(A, Y.hyperlink), Y.width);
    let O = $ >= 0 ? Math.min(q, $) : q,
        _ = A.damage;
    if (_) {
        let J = _.x + _.width,
            X = _.y + _.height;
        if (O < _.x) _.width += _.x - O, _.x = O;
        else if (q >= J) _.width = q - _.x + 1;
        if (K < _.y) _.height += _.y - K, _.y = K;
        else if (K >= X) _.height = K - _.y + 1
    } else A.damage = {
        x: O,
        y: K,
        width: q - O + 1,
        height: 1
    };
    if (Y.width === 1) {
        let J = q + 1;
        if (J < A.width) {
            let X = z + 2;
            w[X] = N87, w[X + 1] = Er(A.emptyStyleId, 0, 2);
            let D = A.damage;
            if (D && J >= D.x + D.width) D.width = J - D.x + 1
        }
    }
}
// @from(Ln 138451, Col 0)
function YN5(A, q) {
    return A.charPool.intern(q)
}
// @from(Ln 138455, Col 0)
function L87(A, q, K, Y, z, w) {
    if (K >= z || Y >= w) return;
    let H = z - K,
        $ = q.width << 1,
        O = A.width << 1,
        _ = H << 1,
        J = q.cells,
        X = A.cells;
    if (K === 0 && z === q.width && q.width === A.width) {
        let j = Y * $,
            M = (w - Y) * $;
        X.set(J.subarray(j, j + M), j)
    } else {
        let j = Y * $ + (K << 1),
            M = Y * O + (K << 1);
        for (let P = Y; P < w; P++) X.set(J.subarray(j, j + _), M), j += $, M += O
    }
    let D = {
        x: K,
        y: Y,
        width: H,
        height: w - Y
    };
    if (A.damage) A.damage = HJ1(A.damage, D);
    else A.damage = D;
    if (z < A.width) {
        let j = Y * q.width + (z - 1) << 1,
            M = Y * A.width + z << 1,
            P = !1;
        for (let W = Y; W < w; W++) {
            if ((J[j + 1] & ZL) === 1) X[M] = N87, X[M + 1] = Er(A.emptyStyleId, 0, 2), P = !0;
            j += $, M += O
        }
        if (P && A.damage) {
            if (A.damage.x + A.damage.width === z) A.damage = {
                ...A.damage,
                width: A.damage.width + 1
            }
        }
    }
}
// @from(Ln 138497, Col 0)
function R87(A, q, K, Y, z) {
    let w = Math.max(0, q),
        H = Math.max(0, K),
        $ = Math.min(q + Y, A.width),
        O = Math.min(K + z, A.height);
    if (w >= $ || H >= O) return;
    let {
        cells: _,
        cells64: J,
        width: X
    } = A, D = H * X, j = w, M = $;
    if (w === 0 && $ === X) J.fill($qA, D, D + (O - H) * X);
    else {
        let W = X << 1,
            G = $ - w,
            f = w > 0,
            Z = $ < X,
            N = D + w << 1,
            T = D + $ - 1 << 1,
            k = D + w;
        for (let y = H; y < O; y++) {
            if (f) {
                if ((_[N + 1] & ZL) === 2) {
                    let B = N - 1;
                    if ((_[B] & ZL) === 1) _[B - 1] = IC1, _[B] = Er(A.emptyStyleId, 0, 0), j = w - 1
                }
            }
            if (Z) {
                if ((_[T + 1] & ZL) === 1) {
                    let B = T + 3;
                    if ((_[B] & ZL) === 2) _[B - 1] = IC1, _[B] = Er(A.emptyStyleId, 0, 0), M = $ + 1
                }
            }
            J.fill($qA, k, k + G), N += W, T += W, k += X
        }
    }
    let P = {
        x: j,
        y: H,
        width: M - j,
        height: O - H
    };
    if (A.damage) A.damage = HJ1(A.damage, P);
    else A.damage = P
}
// @from(Ln 138543, Col 0)
function C87(A) {
    for (let q of A) {
        let K = q.code;
        if (K.length < 5 || !K.startsWith(uC1)) continue;
        let Y = K.match(y87);
        if (Y) return Y[1] || null
    }
    return null
}
// @from(Ln 138553, Col 0)
function S87(A) {
    return A.filter((q) => !q.code.startsWith(uC1) || !y87.test(q.code))
}
// @from(Ln 138557, Col 0)
function XqA(A, q, K) {
    let Y = A.width,
        z = q.width,
        w = A.height,
        H = q.height,
        $;
    if (Y === 0 && w === 0) $ = {
        x: 0,
        y: 0,
        width: z,
        height: H
    };
    else if (q.damage) {
        if ($ = q.damage, A.damage) $ = HJ1($, A.damage)
    } else if (A.damage) $ = A.damage;
    else $ = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    if (w > H) $ = HJ1($, {
        x: 0,
        y: H,
        width: Y,
        height: w - H
    });
    if (Y > z) $ = HJ1($, {
        x: z,
        y: 0,
        width: Y - z,
        height: w
    });
    let O = Math.max(w, H),
        _ = Math.max(Y, z),
        J = Math.min($.y + $.height, O),
        X = Math.min($.x + $.width, _);
    if (Y === z) return ON5(A, q, $.x, X, $.y, J, K);
    return _N5(A, q, $.x, X, $.y, J, K)
}
// @from(Ln 138598, Col 0)
function zN5(A, q, K, Y) {
    for (let z = 0; z < Y; z++, K += 2) {
        let w = K | 1;
        if (A[K] !== q[K] || A[w] !== q[w]) return z
    }
    return Y
}
// @from(Ln 138606, Col 0)
function wN5(A, q, K, Y, z, w, H, $, O, _, J) {
    let X = H;
    while (X < $) {
        let D = zN5(A, q, z, $ - X);
        if (X += D, z += D << 1, X >= $) break;
        if (kr(K, z, O), kr(Y, z, _), J(X, w, O, _)) return !0;
        X++, z += 2
    }
    return !1
}
// @from(Ln 138617, Col 0)
function HN5(A, q, K, Y, z, w, H) {
    for (let $ = Y; $ < z; $++, q += 2)
        if (kr(A, q, w), H($, K, w, void 0)) return !0;
    return !1
}
// @from(Ln 138623, Col 0)
function $N5(A, q, K, Y, z, w, H, $) {
    for (let O = z; O < w; O++, K += 2) {
        if (A[K] === 0 && A[K | 1] === 0) continue;
        if (kr(q, K, H), $(O, Y, void 0, H)) return !0
    }
    return !1
}
// @from(Ln 138631, Col 0)
function ON5(A, q, K, Y, z, w, H) {
    let $ = A.cells,
        O = q.cells,
        _ = A.width,
        J = A.height,
        X = q.height,
        D = _ << 1,
        j = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        M = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        P = Math.min(Y, _),
        W = z * _ + K << 1;
    for (let G = z; G < w; G++) {
        let f = G < J,
            Z = G < X;
        if (f && Z) {
            if (wN5($, O, A, q, W, G, K, P, j, M, H)) return !0
        } else if (f) {
            if (HN5(A, W, G, K, P, j, H)) return !0
        } else if (Z) {
            if ($N5(O, q, W, G, K, P, M, H)) return !0
        }
        W += D
    }
    return !1
}
// @from(Ln 138667, Col 0)
function _N5(A, q, K, Y, z, w, H) {
    let $ = A.width,
        O = q.width,
        _ = A.cells,
        J = q.cells,
        X = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        D = {
            char: " ",
            styleId: 0,
            width: 0,
            hyperlink: void 0
        },
        j = $ << 1,
        M = O << 1,
        P = z * $ + K << 1,
        W = z * O + K << 1;
    for (let G = z; G < w; G++) {
        let f = G < A.height,
            Z = G < q.height,
            N = f ? Math.min(Y, $) : K,
            T = Z ? Math.min(Y, O) : K,
            k = Math.min(N, T),
            y = P,
            B = W;
        for (let S = K; S < k; S++) {
            if (_[y] === J[B] && _[y + 1] === J[B + 1]) {
                y += 2, B += 2;
                continue
            }
            if (kr(A, y, X), kr(q, B, D), y += 2, B += 2, H(S, G, X, D)) return !0
        }
        if (N > k) {
            y = P + (k - K << 1);
            for (let S = k; S < N; S++)
                if (kr(A, y, X), y += 2, H(S, G, X, void 0)) return !0
        }
        if (T > k) {
            B = W + (k - K << 1);
            for (let S = k; S < T; S++) {
                if (J[B] === 0 && J[B | 1] === 0) {
                    B += 2;
                    continue
                }
                if (kr(q, B, D), B += 2, H(S, G, void 0, D)) return !0
            }
        }
        P += j, W += M
    }
    return !1
}
// @from(Ln 138722, Col 4)
sV5
// @from(Ln 138722, Col 9)
IC1 = 0
// @from(Ln 138723, Col 4)
N87 = 1
// @from(Ln 138724, Col 4)
_J1 = 17
// @from(Ln 138725, Col 4)
xC1 = 2
// @from(Ln 138726, Col 4)
xK6 = 32767
// @from(Ln 138727, Col 4)
ZL = 3
// @from(Ln 138728, Col 4)
$qA = 0n
// @from(Ln 138729, Col 4)
y87
// @from(Ln 138729, Col 9)
uC1
// @from(Ln 138730, Col 4)
JJ1 = v(() => {
    m4A();
    f71();
    HqA();
    j71();
    sV5 = new Set(["\x1B[49m", "\x1B[27m", "\x1B[24m", "\x1B[29m", "\x1B[55m"]);
    y87 = new RegExp(`^${Zr}\\]8${Vr}${Vr}([^${fr}]*)${fr}$`), uC1 = `${Zr}]8${Vr}`
})
// @from(Ln 138738, Col 0)
class uK6 {
    width;
    height;
    stylePool;
    screen;
    operations = [];
    charCache = new Map;
    constructor(A) {
        let {
            width: q,
            height: K,
            stylePool: Y,
            screen: z
        } = A;
        this.width = q, this.height = K, this.stylePool = Y, this.screen = z, v87(z, q, K)
    }
    blit(A, q) {
        this.operations.push({
            type: "blit",
            src: A,
            region: q
        })
    }
    clear(A) {
        this.operations.push({
            type: "clear",
            region: A
        })
    }
    write(A, q, K) {
        if (!K) return;
        this.operations.push({
            type: "write",
            x: A,
            y: q,
            text: K
        })
    }
    clip(A) {
        this.operations.push({
            type: "clip",
            clip: A
        })
    }
    unclip() {
        this.operations.push({
            type: "unclip"
        })
    }
    get() {
        let A = this.screen,
            q = 0,
            K = 0;
        for (let w of this.operations)
            if (w.type === "clear") {
                let {
                    x: H,
                    y: $,
                    width: O,
                    height: _
                } = w.region;
                R87(A, H, $, O, _)
            } let Y = [];
        for (let w of this.operations) {
            if (w.type === "clip") Y.push(w.clip);
            if (w.type === "unclip") Y.pop();
            if (w.type === "blit") {
                let {
                    src: H,
                    region: $
                } = w, {
                    x: O,
                    y: _,
                    width: J,
                    height: X
                } = $, D = Math.min(_ + X, this.height, H.height), j = Math.min(O + J, this.width, H.width);
                L87(A, H, O, _, j, D), q += (D - _) * (j - O)
            }
            if (w.type === "write") {
                let {
                    text: H
                } = w, {
                    x: $,
                    y: O
                } = w, _ = H.split(`
`), J = Y.at(-1);
                if (J) {
                    let D = typeof J?.x1 === "number" && typeof J?.x2 === "number",
                        j = typeof J?.y1 === "number" && typeof J?.y2 === "number";
                    if (D) {
                        let M = kK6(H);
                        if ($ + M < J.x1 || $ > J.x2) continue
                    }
                    if (j) {
                        let M = _.length;
                        if (O + M < J.y1 || O > J.y2) continue
                    }
                    if (D) {
                        if (_ = _.map((M) => {
                                let P = $ < J.x1 ? J.x1 - $ : 0,
                                    W = UA(M),
                                    G = $ + W > J.x2 ? J.x2 - $ : W;
                                return hC1(M, P, G)
                            }), $ < J.x1) $ = J.x1
                    }
                    if (j) {
                        let M = O < J.y1 ? J.y1 - O : 0,
                            P = _.length,
                            W = O + P > J.y2 ? J.y2 - O : P;
                        if (_ = _.slice(M, W), O < J.y1) O = J.y1
                    }
                }
                let X = 0;
                for (let D of _) {
                    if (O + X >= this.height) break;
                    let j = this.charCache.get(D);
                    if (!j) j = DN5(P87(OJ1(D))), this.charCache.set(D, j);
                    let M = $;
                    for (let P = 0; P < j.length; P++) {
                        let W = j[P],
                            G = W.value.codePointAt(0);
                        if (G !== void 0 && G <= 31) {
                            if (G === 9) {
                                let B = 8 - M % 8;
                                for (let S = 0; S < B && M < this.width; S++) bK6(A, M, O + X, {
                                    char: " ",
                                    styleId: this.stylePool.none,
                                    width: 0,
                                    hyperlink: void 0
                                }), M++
                            } else if (G === 27) {
                                let y = j[P + 1]?.value,
                                    B = y?.codePointAt(0);
                                if (y === "(" || y === ")" || y === "*" || y === "+") P += 2;
                                else if (y === "[") {
                                    P++;
                                    while (P < j.length - 1) {
                                        P++;
                                        let S = j[P]?.value.codePointAt(0);
                                        if (S !== void 0 && S >= 64 && S <= 126) break
                                    }
                                } else if (y === "]" || y === "P" || y === "_" || y === "^" || y === "X") {
                                    P++;
                                    while (P < j.length - 1) {
                                        P++;
                                        let S = j[P]?.value;
                                        if (S === "\x07") break;
                                        if (S === "\x1B") {
                                            if (j[P + 1]?.value === "\\") {
                                                P++;
                                                break
                                            }
                                        }
                                    }
                                } else if (B !== void 0 && B >= 48 && B <= 126) P++
                            }
                            continue
                        }
                        let f = UA(W.value);
                        if (f === 0) continue;
                        let Z = f >= 2;
                        if (Z && M + 2 > this.width) {
                            bK6(A, M, O + X, {
                                char: " ",
                                styleId: this.stylePool.none,
                                width: 3,
                                hyperlink: void 0
                            }), M++;
                            continue
                        }
                        let N = C87(W.styles),
                            k = N !== null || W.styles.some((y) => y.code.length >= uC1.length && y.code.startsWith(uC1)) ? S87(W.styles) : W.styles;
                        bK6(A, M, O + X, {
                            char: W.value,
                            styleId: this.stylePool.intern(k),
                            width: Z ? 1 : 0,
                            hyperlink: N ?? void 0
                        }), K++, M += Z ? 2 : 1
                    }
                    X++
                }
            }
        }
        let z = q + K;
        if (z > 1000 && K > q) h(`High write ratio: blit=${q}, write=${K} (${(K/z*100).toFixed(1)}% writes), screen=${this.height}x${this.width}`);
        return A
    }
}
// @from(Ln 138927, Col 0)
function XN5(A, q) {
    if (A === q) return !0;
    let K = A.length;
    if (K !== q.length) return !1;
    if (K === 0) return !0;
    for (let Y = 0; Y < K; Y++)
        if (A[Y].code !== q[Y].code) return !1;
    return !0
}
// @from(Ln 138937, Col 0)
function DN5(A) {
    let q = A.length;
    if (q === 0) return [];
    let K = [],
        Y = [],
        z = A[0].styles;
    for (let w = 0; w < q; w++) {
        let H = A[w],
            $ = H.styles;
        if (Y.length > 0 && !XN5($, z)) {
            let O = Y.join("");
            for (let {
                    segment: _
                }
                of T_().segment(O)) K.push({
                type: "char",
                value: _,
                fullWidth: UA(_) === 2,
                styles: z
            });
            Y.length = 0
        }
        Y.push(H.value), z = $
    }
    if (Y.length > 0) {
        let w = Y.join("");
        for (let {
                segment: H
            }
            of T_().segment(w)) K.push({
            type: "char",
            value: H,
            fullWidth: UA(H) === 2,
            styles: z
        })
    }
    return K
}
// @from(Ln 138975, Col 4)
h87 = v(() => {
    wqA();
    a4A();
    f71();
    LY();
    JJ1();
    Z6();
    OS()
})
// @from(Ln 138985, Col 0)
function DqA(A, q) {
    return (K) => {
        let {
            frontFrame: Y,
            backFrame: z,
            isTTY: w,
            terminalWidth: H,
            terminalRows: $
        } = K, O = Y.screen, _ = z.screen, J = _.charPool, X = _.hyperlinkPool, D = A.yogaNode?.getComputedHeight(), j = A.yogaNode?.getComputedWidth(), M = D === void 0 || !Number.isFinite(D) || D < 0, P = j === void 0 || !Number.isFinite(j) || j < 0;
        if (!A.yogaNode || M || P) {
            if (A.yogaNode && (M || P)) h(`Invalid yoga dimensions: width=${j}, height=${D}, childNodes=${A.childNodes.length}, terminalWidth=${H}, terminalRows=${$}`);
            return {
                screen: bC1(H, 0, q, J, X),
                viewport: {
                    width: H,
                    height: $
                },
                cursor: {
                    x: 0,
                    y: 0,
                    visible: !0
                }
            }
        }
        let W = Math.floor(A.yogaNode.getComputedWidth()),
            G = Math.floor(A.yogaNode.getComputedHeight()),
            f = new uK6({
                width: W,
                height: G,
                stylePool: q,
                screen: _ ?? bC1(W, G, q, J, X)
            });
        _87(A, f, {
            prevScreen: O
        });
        let Z = f.get();
        return {
            screen: Z,
            viewport: {
                width: H,
                height: $
            },
            cursor: {
                x: 0,
                y: Z.height,
                visible: !w || Z.height === 0
            }
        }
    }
}
// @from(Ln 139035, Col 4)
I87 = v(() => {
    J87();
    h87();
    JJ1();
    Z6()
})
// @from(Ln 139041, Col 0)
class MqA {
    options;
    state;
    constructor(A) {
        this.options = A;
        this.state = {
            previousOutput: ""
        }
    }
    renderPreviousOutput_DEPRECATED(A) {
        if (!this.options.isTTY) return [BK6];
        else if (!this.options.debug) return this.getRenderOpsForDone(A);
        return []
    }
    reset() {
        this.state.previousOutput = ""
    }
    getRenderOpsDebug(A) {
        let {
            screen: q
        } = A, K = [], Y = [];
        for (let z = 0; z < q.height; z++) {
            let w = "";
            for (let $ = 0; $ < q.width; $++) {
                let O = _qA(q, $, z);
                if (O && O.width !== 2) {
                    let _ = this.options.stylePool.get(O.styleId),
                        J = MS(Y, _);
                    if (J.length > 0) w += cG(J), Y = _;
                    w += O.char
                }
            }
            let H = MS(Y, []);
            if (H.length > 0) w += cG(H), Y = [];
            K.push(w.trimEnd())
        }
        if (K.length === 0) return [];
        return [{
            type: "stdout",
            content: K.join(`
`)
        }]
    }
    getRenderOpsForDone(A) {
        if (this.state.previousOutput = "", !A.cursor.visible) return [{
            type: "cursorShow"
        }];
        return []
    }
    render(A, q) {
        if (this.options.debug) return this.getRenderOpsDebug(q);
        let K = performance.now();
        if (q.viewport.height < A.viewport.height || A.viewport.width !== 0 && q.viewport.width !== A.viewport.width) return BC1(q, "resize", this.options.stylePool);
        let Y = A.cursor.y >= A.screen.height,
            z = q.screen.height > A.screen.height,
            w = Y && A.screen.height >= A.viewport.height,
            H = q.screen.height < A.screen.height,
            $ = q.screen.height <= A.viewport.height;
        if (w && $ && H) return h(`Full reset (shrink->below): prevHeight=${A.screen.height}, nextHeight=${q.screen.height}, viewport=${A.viewport.height}`), BC1(q, "offscreen", this.options.stylePool);
        if (A.screen.height >= A.viewport.height && A.screen.height > 0 && Y && !z) {
            let Z = A.screen.height - A.viewport.height + 1,
                N = -1;
            if (XqA(A.screen, q.screen, (T, k) => {
                    if (k < Z) return N = k, !0
                }), N >= 0) {
                let T = "";
                for (let y = 0; y < A.screen.width; y++) T += JqA(A.screen, y, N) ?? " ";
                let k = "";
                for (let y = 0; y < q.screen.width; y++) k += JqA(q.screen, y, N) ?? " ";
                return h(`Full reset (scrollback changes): scrollbackRows=${Z}, firstChangeY=${N}
  prev: "${T}"
  next: "${k}"`), BC1(q, "offscreen", this.options.stylePool)
            }
        }
        let O = new WqA(A.cursor, q.viewport.width),
            _ = Math.max(q.screen.height, 1) - Math.max(A.screen.height, 1),
            J = _ < 0,
            X = _ > 0;
        if (J) {
            let f = A.screen.height - q.screen.height;
            if (f > A.viewport.height) return BC1(q, "offscreen", this.options.stylePool);
            O.txn((Z) => [
                [{
                    type: "clear",
                    count: f
                }, {
                    type: "cursorMove",
                    x: 0,
                    y: -1
                }], {
                    dx: -Z.x,
                    dy: -f
                }
            ])
        }
        let D = w ? 1 : 0,
            j = X ? Math.max(0, A.screen.height - A.viewport.height + D) : Math.max(A.screen.height, q.screen.height) - q.viewport.height,
            M = [],
            P = void 0,
            W = !1;
        if (XqA(A.screen, q.screen, (f, Z, N, T) => {
                if (X && Z >= A.screen.height) return;
                if (T && (T.width === 2 || T.width === 3)) return;
                if (N && (N.width === 2 || N.width === 3) && !T) return;
                if (T && T87(q.screen, f, Z) && !N) return;
                if (Z < j) return W = !0, !0;
                if (jqA(O, f, Z), T) {
                    if (T.width === 1 && PqA(T.char) && f + 1 < q.screen.width) {
                        let S = _qA(A.screen, f + 1, Z);
                        if (S && S.width !== 2 && S.width !== 3) {
                            if (M.length > 0) {
                                let m = MS(M, []);
                                if (m.length > 0) O.diff.push({
                                    type: "style",
                                    codes: m
                                })
                            }
                            if (P !== void 0) O.diff.push({
                                type: "hyperlink",
                                uri: ""
                            }), P = void 0;
                            M = [], O.txn(() => [
                                [{
                                    type: "cursorTo",
                                    col: f + 2
                                }, {
                                    type: "stdout",
                                    content: " "
                                }, {
                                    type: "cursorTo",
                                    col: f + 1
                                }], {
                                    dx: 0,
                                    dy: 0
                                }
                            ])
                        }
                    }
                    let k = T.hyperlink;
                    P = x87(O.diff, P, k);
                    let y = this.options.stylePool.get(T.styleId),
                        B = MS(M, y);
                    MN5(O, T, B), M = y
                } else if (N) {
                    let k = M,
                        y = P;
                    M = [], P = void 0, O.txn(() => {
                        let B = [];
                        if (k.length > 0) {
                            let S = MS(k, []);
                            if (S.length > 0) B.push({
                                type: "style",
                                codes: S
                            })
                        }
                        if (y !== void 0) B.push({
                            type: "hyperlink",
                            uri: ""
                        });
                        return B.push({
                            type: "stdout",
                            content: " "
                        }), [B, {
                            dx: 1,
                            dy: 0
                        }]
                    })
                }
            }), W) return BC1(q, "offscreen", this.options.stylePool);
        if (M.length > 0) {
            let f = MS(M, []);
            if (f.length > 0) O.diff.push({
                type: "style",
                codes: f
            });
            M = []
        }
        if (P !== void 0) O.diff.push({
            type: "hyperlink",
            uri: ""
        }), P = void 0;
        if (X) b87(O, q, A.screen.height, q.screen.height, this.options.stylePool);
        if (q.cursor.y >= q.screen.height) O.txn((f) => {
            let Z = q.cursor.y - f.y;
            if (Z > 0) {
                let T = Array(1 + Z);
                T[0] = XJ1;
                for (let k = 0; k < Z; k++) T[1 + k] = BK6;
                return [T, {
                    dx: -f.x,
                    dy: Z
                }]
            }
            let N = q.cursor.y - f.y;
            if (N !== 0 || f.x !== q.cursor.x) {
                let T = [XJ1];
                return T.push({
                    type: "cursorMove",
                    x: q.cursor.x,
                    y: N
                }), [T, {
                    dx: q.cursor.x - f.x,
                    dy: N
                }]
            }
            return [
                [], {
                    dx: 0,
                    dy: 0
                }
            ]
        });
        else jqA(O, q.cursor.x, q.cursor.y);
        let G = performance.now() - K;
        if (G > 50) {
            let f = q.screen.damage,
                Z = f ? `${f.width}x${f.height} at (${f.x},${f.y})` : "none";
            h(`Slow render: ${G.toFixed(1)}ms, screen: ${q.screen.height}x${q.screen.width}, damage: ${Z}, changes: ${O.diff.length}`)
        }
        return O.diff
    }
}
// @from(Ln 139264, Col 0)
function x87(A, q, K) {
    if (q !== K) return A.push({
        type: "hyperlink",
        uri: K ?? ""
    }), K;
    return q
}
// @from(Ln 139272, Col 0)
function BC1(A, q, K) {
    let Y = new WqA({
        x: 0,
        y: 0
    }, A.viewport.width);
    return jN5(Y, A, K), [{
        type: "clearTerminal",
        reason: q
    }, ...Y.diff]
}
// @from(Ln 139283, Col 0)
function jN5(A, q, K) {
    b87(A, q, 0, q.screen.height, K)
}
// @from(Ln 139287, Col 0)
function b87(A, q, K, Y, z) {
    let w = z.none,
        H = void 0,
        $ = -1,
        {
            width: O,
            cells: _,
            charPool: J,
            hyperlinkPool: X
        } = q.screen,
        D = K * O;
    for (let j = K; j < Y; j += 1) {
        if (A.cursor.y < j) {
            let M = j - A.cursor.y;
            A.txn((P) => {
                let W = Array(1 + M);
                W[0] = XJ1;
                for (let G = 0; G < M; G++) W[1 + G] = BK6;
                return [W, {
                    dx: -P.x,
                    dy: M
                }]
            })
        }
        $ = -1;
        for (let M = 0; M < O; M += 1, D += 1) {
            let P = k87(_, J, X, D, $);
            if (!P) continue;
            jqA(A, M, j);
            let W = P.hyperlink;
            H = x87(A.diff, H, W);
            let G = z.transition(w, P.styleId);
            PN5(A, P, G), w = P.styleId, $ = P.styleId
        }
        if (w !== z.none) {
            let M = z.transition(w, z.none);
            if (M.length > 0) A.diff.push({
                type: "styleStr",
                str: M
            });
            w = z.none
        }
        if (H !== void 0) A.diff.push({
            type: "hyperlink",
            uri: ""
        }), H = void 0;
        A.txn((M) => [
            [XJ1, BK6], {
                dx: -M.x,
                dy: 1
            }
        ])
    }
    if (H !== void 0) A.diff.push({
        type: "hyperlink",
        uri: ""
    });
    if (w !== z.none) {
        let j = z.transition(w, z.none);
        if (j.length > 0) A.diff.push({
            type: "styleStr",
            str: j
        })
    }
    return A
}
// @from(Ln 139354, Col 0)
function MN5(A, q, K) {
    A.txn((Y) => {
        let z = q.width === 1 ? 2 : 1;
        if (z === 2 && Y.x < A.viewportWidth) {
            let O = q.char.length > 2 ? A.viewportWidth : A.viewportWidth + 1;
            if (Y.x + 2 >= O) return [
                [], {
                    dx: 0,
                    dy: 0
                }
            ]
        }
        let w = Y.x >= A.viewportWidth ? z - Y.x : z,
            H = Y.x >= A.viewportWidth ? 1 : 0,
            $ = K.length > 0 ? [{
                type: "style",
                codes: K
            }, {
                type: "stdout",
                content: q.char
            }] : [{
                type: "stdout",
                content: q.char
            }];
        if (z === 2 && PqA(q.char)) $.push({
            type: "cursorTo",
            col: Y.x + z + 1
        });
        return [$, {
            dx: w,
            dy: H
        }]
    })
}
// @from(Ln 139389, Col 0)
function PN5(A, q, K) {
    let Y = q.width === 1 ? 2 : 1,
        z = A.cursor.x,
        w = A.viewportWidth;
    if (Y === 2 && z < w) {
        let $ = q.char.length > 2 ? w : w + 1;
        if (z + 2 >= $) return
    }
    let H = A.diff;
    if (K.length > 0) H.push({
        type: "styleStr",
        str: K
    });
    if (H.push({
            type: "stdout",
            content: q.char
        }), Y === 2 && PqA(q.char)) H.push({
        type: "cursorTo",
        col: z + Y + 1
    });
    if (z >= w) A.cursor.x = Y, A.cursor.y++;
    else A.cursor.x = z + Y
}
// @from(Ln 139413, Col 0)
function jqA(A, q, K) {
    A.txn((Y) => {
        let z = q - Y.x,
            w = K - Y.y;
        if (Y.x >= A.viewportWidth) return [
            [XJ1, {
                type: "cursorMove",
                x: q,
                y: w
            }], {
                dx: z,
                dy: w
            }
        ];
        if (w !== 0) return [
            [XJ1, {
                type: "cursorMove",
                x: q,
                y: w
            }], {
                dx: z,
                dy: w
            }
        ];
        return [
            [{
                type: "cursorMove",
                x: z,
                y: w
            }], {
                dx: z,
                dy: w
            }
        ]
    })
}
// @from(Ln 139450, Col 0)
function PqA(A) {
    let q = A.codePointAt(0);
    if (q === void 0) return !1;
    if (q >= 129648 && q <= 129791 || q >= 129792 && q <= 130047) return !0;
    if (A.length >= 2) {
        for (let K = 0; K < A.length; K++)
            if (A.charCodeAt(K) === 65039) return !0
    }
    return !1
}
// @from(Ln 139460, Col 0)
class WqA {
    viewportWidth;
    cursor;
    diff = [];
    constructor(A, q) {
        this.viewportWidth = q;
        this.cursor = {
            ...A
        }
    }
    txn(A) {
        let [q, K] = A(this.cursor);
        for (let Y of q) this.diff.push(Y);
        this.cursor.x += K.dx, this.cursor.y += K.dy
    }
}
// @from(Ln 139476, Col 4)
XJ1
// @from(Ln 139476, Col 9)
BK6
// @from(Ln 139477, Col 4)
u87 = v(() => {
    JJ1();
    f71();
    Z6();
    XJ1 = {
        type: "carriageReturn"
    }, BK6 = {
        type: "stdout",
        content: `
`
    }
})
// @from(Ln 139489, Col 4)
WN5
// @from(Ln 139489, Col 9)
fL
// @from(Ln 139490, Col 4)
DJ1 = v(() => {
    WN5 = new Map, fL = WN5
})
// @from(Ln 139493, Col 0)
class tg {
    _didStopImmediatePropagation = !1;
    didStopImmediatePropagation() {
        return this._didStopImmediatePropagation
    }
    stopImmediatePropagation() {
        this._didStopImmediatePropagation = !0
    }
}
// @from(Ln 139505, Col 4)
V71
// @from(Ln 139506, Col 4)
mK6 = v(() => {
    V71 = class V71 extends GN5 {
        constructor() {
            super();
            this.setMaxListeners(0)
        }
        emit(A, ...q) {
            if (A === "error") return super.emit(A, ...q);
            let K = this.rawListeners(A);
            if (K.length === 0) return !1;
            let Y = q[0] instanceof tg ? q[0] : null;
            for (let z of K)
                if (z.apply(this, q), Y?.didStopImmediatePropagation()) break;
            return !0
        }
    }
})
// @from(Ln 139523, Col 4)
B87
// @from(Ln 139523, Col 9)
m87
// @from(Ln 139523, Col 14)
FK6
// @from(Ln 139524, Col 4)
GqA = v(() => {
    B87 = o(X1(), 1), m87 = B87.createContext({
        exit() {}
    });
    m87.displayName = "InternalAppContext";
    FK6 = m87
})
// @from(Ln 139531, Col 4)
F87
// @from(Ln 139531, Col 9)
Q87
// @from(Ln 139531, Col 14)
QK6
// @from(Ln 139532, Col 4)
ZqA = v(() => {
    mK6();
    F87 = o(X1(), 1), Q87 = F87.createContext({
        stdin: process.stdin,
        internal_eventEmitter: new V71,
        setRawMode() {},
        isRawModeSupported: !1,
        internal_exitOnCtrlC: !0
    });
    Q87.displayName = "InternalStdinContext";
    QK6 = Q87
})
// @from(Ln 139544, Col 4)
g87
// @from(Ln 139544, Col 9)
U87
// @from(Ln 139544, Col 14)
jJ1
// @from(Ln 139545, Col 4)
gK6 = v(() => {
    g87 = o(X1(), 1), U87 = g87.createContext({
        activeId: void 0,
        add() {},
        remove() {},
        activate() {},
        deactivate() {},
        enableFocus() {},
        disableFocus() {},
        focusNext() {},
        focusPrevious() {},
        focus() {}
    });
    U87.displayName = "InternalFocusContext";
    jJ1 = U87
})
// @from(Ln 139562, Col 0)
function d87(A) {
    VqA = A ? "focused" : "blurred";
    for (let q of fqA) q();
    if (!A) {
        for (let q of p87) q();
        p87.clear()
    }
}
// @from(Ln 139571, Col 0)
function UK6() {
    return VqA !== "blurred"
}
// @from(Ln 139575, Col 0)
function mC1() {
    return VqA
}
// @from(Ln 139579, Col 0)
function FC1(A) {
    return fqA.add(A), () => {
        fqA.delete(A)
    }
}
// @from(Ln 139584, Col 4)
VqA = "unknown"
// @from(Ln 139585, Col 4)
p87
// @from(Ln 139585, Col 9)
fqA
// @from(Ln 139586, Col 4)
MJ1 = v(() => {
    p87 = new Set, fqA = new Set
})
// @from(Ln 139590, Col 0)
function c87(A) {
    let q = e(6),
        {
            children: K
        } = A,
        Y = N71.useSyncExternalStore(FC1, UK6),
        z = N71.useSyncExternalStore(FC1, mC1),
        w;
    if (q[0] !== Y || q[1] !== z) w = {
        isTerminalFocused: Y,
        terminalFocusState: z
    }, q[0] = Y, q[1] = z, q[2] = w;
    else w = q[2];
    let H = w,
        $;
    if (q[3] !== K || q[4] !== H) $ = N71.default.createElement(NqA.Provider, {
        value: H
    }, K), q[3] = K, q[4] = H, q[5] = $;
    else $ = q[5];
    return $
}
// @from(Ln 139611, Col 4)
N71
// @from(Ln 139611, Col 9)
NqA
// @from(Ln 139611, Col 14)
l87
// @from(Ln 139612, Col 4)
TqA = v(() => {
    i1();
    MJ1();
    N71 = o(X1(), 1), NqA = N71.createContext({
        isTerminalFocused: !0,
        terminalFocusState: "unknown"
    });
    NqA.displayName = "TerminalFocusContext";
    l87 = NqA
})
// @from(Ln 139622, Col 4)
n87 = R((hG2, i87) => {
    var ZN5 = /[|\\{}()[\]^$+*?.-]/g;
    i87.exports = (A) => {
        if (typeof A !== "string") throw TypeError("Expected a string");
        return A.replace(ZN5, "\\$&")
    }
})
// @from(Ln 139629, Col 4)
s87 = R((IG2, a87) => {
    var fN5 = n87(),
        VN5 = typeof process === "object" && process && typeof process.cwd === "function" ? process.cwd() : ".",
        o87 = [].concat(h1("module").builtinModules, "bootstrap_node", "node").map((A) => new RegExp(`(?:\\((?:node:)?${A}(?:\\.js)?:\\d+:\\d+\\)$|^\\s*at (?:node:)?${A}(?:\\.js)?:\\d+:\\d+$)`));
    o87.push(/\((?:node:)?internal\/[^:]+:\d+:\d+\)$/, /\s*at (?:node:)?internal\/[^:]+:\d+:\d+$/, /\/\.node-spawn-wrap-\w+-\w+\/node:\d+:\d+\)?$/);
    class vqA {
        constructor(A) {
            if (A = {
                    ignoredPackages: [],
                    ...A
                }, "internals" in A === !1) A.internals = vqA.nodeInternals();
            if ("cwd" in A === !1) A.cwd = VN5;
            this._cwd = A.cwd.replace(/\\/g, "/"), this._internals = [].concat(A.internals, NN5(A.ignoredPackages)), this._wrapCallSite = A.wrapCallSite || !1
        }
        static nodeInternals() {
            return [...o87]
        }
        clean(A, q = 0) {
            if (q = " ".repeat(q), !Array.isArray(A)) A = A.split(`
`);
            if (!/^\s*at /.test(A[0]) && /^\s*at /.test(A[1])) A = A.slice(1);
            let K = !1,
                Y = null,
                z = [];
            return A.forEach((w) => {
                if (w = w.replace(/\\/g, "/"), this._internals.some(($) => $.test(w))) return;
                let H = /^\s*at /.test(w);
                if (K) w = w.trimEnd().replace(/^(\s+)at /, "$1");
                else if (w = w.trim(), H) w = w.slice(3);
                if (w = w.replace(`${this._cwd}/`, ""), w)
                    if (H) {
                        if (Y) z.push(Y), Y = null;
                        z.push(w)
                    } else K = !0, Y = w
            }), z.map((w) => `${q}${w}
`).join("")
        }
        captureString(A, q = this.captureString) {
            if (typeof A === "function") q = A, A = 1 / 0;
            let {
                stackTraceLimit: K
            } = Error;
            if (A) Error.stackTraceLimit = A;
            let Y = {};
            Error.captureStackTrace(Y, q);
            let {
                stack: z
            } = Y;
            return Error.stackTraceLimit = K, this.clean(z)
        }
        capture(A, q = this.capture) {
            if (typeof A === "function") q = A, A = 1 / 0;
            let {
                prepareStackTrace: K,
                stackTraceLimit: Y
            } = Error;
            if (Error.prepareStackTrace = (H, $) => {
                    if (this._wrapCallSite) return $.map(this._wrapCallSite);
                    return $
                }, A) Error.stackTraceLimit = A;
            let z = {};
            Error.captureStackTrace(z, q);
            let {
                stack: w
            } = z;
            return Object.assign(Error, {
                prepareStackTrace: K,
                stackTraceLimit: Y
            }), w
        }
        at(A = this.at) {
            let [q] = this.capture(1, A);
            if (!q) return {};
            let K = {
                line: q.getLineNumber(),
                column: q.getColumnNumber()
            };
            if (r87(K, q.getFileName(), this._cwd), q.isConstructor()) Object.defineProperty(K, "constructor", {
                value: !0,
                configurable: !0
            });
            if (q.isEval()) K.evalOrigin = q.getEvalOrigin();
            if (q.isNative()) K.native = !0;
            let Y;
            try {
                Y = q.getTypeName()
            } catch (H) {}
            if (Y && Y !== "Object" && Y !== "[object Object]") K.type = Y;
            let z = q.getFunctionName();
            if (z) K.function = z;
            let w = q.getMethodName();
            if (w && z !== w) K.method = w;
            return K
        }
        parseLine(A) {
            let q = A && A.match(TN5);
            if (!q) return null;
            let K = q[1] === "new",
                Y = q[2],
                z = q[3],
                w = q[4],
                H = Number(q[5]),
                $ = Number(q[6]),
                O = q[7],
                _ = q[8],
                J = q[9],
                X = q[10] === "native",
                D = q[11] === ")",
                j, M = {};
            if (_) M.line = Number(_);
            if (J) M.column = Number(J);
            if (D && O) {
                let P = 0;
                for (let W = O.length - 1; W > 0; W--)
                    if (O.charAt(W) === ")") P++;
                    else if (O.charAt(W) === "(" && O.charAt(W - 1) === " ") {
                    if (P--, P === -1 && O.charAt(W - 1) === " ") {
                        let G = O.slice(0, W - 1);
                        O = O.slice(W + 1), Y += ` (${G}`;
                        break
                    }
                }
            }
            if (Y) {
                let P = Y.match(vN5);
                if (P) Y = P[1], j = P[2]
            }
            if (r87(M, O, this._cwd), K) Object.defineProperty(M, "constructor", {
                value: !0,
                configurable: !0
            });
            if (z) M.evalOrigin = z, M.evalLine = H, M.evalColumn = $, M.evalFile = w && w.replace(/\\/g, "/");
            if (X) M.native = !0;
            if (Y) M.function = Y;
            if (j && Y !== j) M.method = j;
            return M
        }
    }

    function r87(A, q, K) {
        if (q) {
            if (q = q.replace(/\\/g, "/"), q.startsWith(`${K}/`)) q = q.slice(K.length + 1);
            A.file = q
        }
    }

    function NN5(A) {
        if (A.length === 0) return [];
        let q = A.map((K) => fN5(K));
        return new RegExp(`[/\\\\]node_modules[/\\\\](?:${q.join("|")})[/\\\\][^:]+:\\d+:\\d+`)
    }
    var TN5 = new RegExp("^(?:\\s*at )?(?:(new) )?(?:(.*?) \\()?(?:eval at ([^ ]+) \\((.+?):(\\d+):(\\d+)\\), )?(?:(.+?):(\\d+):(\\d+)|(native))(\\)?)$"),
        vN5 = /^(.*?) \[as (.*?)\]$/;
    a87.exports = vqA
})
// @from(Ln 139784, Col 4)
EN5 = (A, q = 2) => {
        return A.replace(/^\t+/gm, (K) => " ".repeat(K.length * q))
    }
// @from(Ln 139787, Col 4)
t87
// @from(Ln 139788, Col 4)
e87 = v(() => {
    t87 = EN5
})
// @from(Ln 139791, Col 4)
kN5 = (A, q) => {
        let K = [],
            Y = A - q,
            z = A + q;
        for (let w = Y; w <= z; w++) K.push(w);
        return K
    }
// @from(Ln 139798, Col 4)
LN5 = (A, q, K = {}) => {
        var Y;
        if (typeof A !== "string") throw TypeError("Source code is missing.");
        if (!q || q < 1) throw TypeError("Line number must start from `1`.");
        let z = t87(A).split(/\r?\n/);
        if (q > z.length) return;
        return kN5(q, (Y = K.around) !== null && Y !== void 0 ? Y : 3).filter((w) => z[w - 1] !== void 0).map((w) => ({
            line: w,
            value: z[w - 1]
        }))
    }
// @from(Ln 139809, Col 4)
A77
// @from(Ln 139810, Col 4)
q77 = v(() => {
    e87();
    A77 = LN5
})
// @from(Ln 139815, Col 0)
function RN5(A) {
    let q = e(20),
        K, Y, z, w, H, $, O;
    if (q[0] !== A) {
        let {
            children: j,
            flexWrap: M,
            flexDirection: P,
            flexGrow: W,
            flexShrink: G,
            ref: f,
            ...Z
        } = A;
        K = j, $ = f, O = Z, H = M === void 0 ? "nowrap" : M, Y = P === void 0 ? "row" : P, z = W === void 0 ? 0 : W, w = G === void 0 ? 1 : G, BO(O.margin, "margin"), BO(O.marginX, "marginX"), BO(O.marginY, "marginY"), BO(O.marginTop, "marginTop"), BO(O.marginBottom, "marginBottom"), BO(O.marginLeft, "marginLeft"), BO(O.marginRight, "marginRight"), BO(O.padding, "padding"), BO(O.paddingX, "paddingX"), BO(O.paddingY, "paddingY"), BO(O.paddingTop, "paddingTop"), BO(O.paddingBottom, "paddingBottom"), BO(O.paddingLeft, "paddingLeft"), BO(O.paddingRight, "paddingRight"), BO(O.gap, "gap"), BO(O.columnGap, "columnGap"), BO(O.rowGap, "rowGap"), q[0] = A, q[1] = K, q[2] = Y, q[3] = z, q[4] = w, q[5] = H, q[6] = $, q[7] = O
    } else K = q[1], Y = q[2], z = q[3], w = q[4], H = q[5], $ = q[6], O = q[7];
    let _ = O.overflowX ?? O.overflow ?? "visible",
        J = O.overflowY ?? O.overflow ?? "visible",
        X;
    if (q[8] !== Y || q[9] !== z || q[10] !== w || q[11] !== H || q[12] !== O || q[13] !== _ || q[14] !== J) X = {
        flexWrap: H,
        flexDirection: Y,
        flexGrow: z,
        flexShrink: w,
        ...O,
        overflowX: _,
        overflowY: J
    }, q[8] = Y, q[9] = z, q[10] = w, q[11] = H, q[12] = O, q[13] = _, q[14] = J, q[15] = X;
    else X = q[15];
    let D;
    if (q[16] !== K || q[17] !== $ || q[18] !== X) D = K77.default.createElement("ink-box", {
        ref: $,
        style: X
    }, K), q[16] = K, q[17] = $, q[18] = X, q[19] = D;
    else D = q[19];
    return D
}
// @from(Ln 139851, Col 4)
K77
// @from(Ln 139851, Col 9)
PW
// @from(Ln 139852, Col 4)
QC1 = v(() => {
    i1();
    HqA();
    K77 = o(X1(), 1);
    PW = RN5
})
// @from(Ln 139859, Col 0)
function pK6(A) {
    let q = e(22),
        {
            children: K,
            initialState: Y,
            onThemeChange: z,
            onThemeSave: w
        } = A,
        [H, $] = Lr.useState(Y),
        [O, _] = Lr.useState(null),
        J;
    if (q[0] !== z || q[1] !== w) J = (f) => {
        $(f), _(null), z?.(f), w?.(f)
    }, q[0] = z, q[1] = w, q[2] = J;
    else J = q[2];
    let X;
    if (q[3] !== z) X = (f) => {
        _(f), z?.(f)
    }, q[3] = z, q[4] = X;
    else X = q[4];
    let D;
    if (q[5] !== w || q[6] !== O) D = () => {
        if (O !== null) $(O), _(null), w?.(O)
    }, q[5] = w, q[6] = O, q[7] = D;
    else D = q[7];
    let j;
    if (q[8] !== z || q[9] !== O || q[10] !== H) j = () => {
        if (O !== null) _(null), z?.(H)
    }, q[8] = z, q[9] = O, q[10] = H, q[11] = j;
    else j = q[11];
    let M = O ?? H,
        P;
    if (q[12] !== J || q[13] !== X || q[14] !== D || q[15] !== j || q[16] !== M || q[17] !== H) P = {
        theme: H,
        setTheme: J,
        setPreviewTheme: X,
        savePreview: D,
        cancelPreview: j,
        currentTheme: M
    }, q[12] = J, q[13] = X, q[14] = D, q[15] = j, q[16] = M, q[17] = H, q[18] = P;
    else P = q[18];
    let W = P,
        G;
    if (q[19] !== K || q[20] !== W) G = Y77.default.createElement(EqA.Provider, {
        value: W
    }, K), q[19] = K, q[20] = W, q[21] = G;
    else G = q[21];
    return G
}
// @from(Ln 139909, Col 0)
function T7() {
    let A = e(3),
        {
            currentTheme: q,
            setTheme: K
        } = Lr.useContext(EqA),
        Y;
    if (A[0] !== q || A[1] !== K) Y = [q, K], A[0] = q, A[1] = K, A[2] = Y;
    else Y = A[2];
    return Y
}
// @from(Ln 139921, Col 0)
function dK6() {
    let A = e(4),
        {
            setPreviewTheme: q,
            savePreview: K,
            cancelPreview: Y
        } = Lr.useContext(EqA),
        z;
    if (A[0] !== Y || A[1] !== K || A[2] !== q) z = {
        setPreviewTheme: q,
        savePreview: K,
        cancelPreview: Y
    }, A[0] = Y, A[1] = K, A[2] = q, A[3] = z;
    else z = A[3];
    return z
}
// @from(Ln 139937, Col 4)
Y77
// @from(Ln 139937, Col 9)
Lr
// @from(Ln 139937, Col 13)
EqA
// @from(Ln 139938, Col 4)
gC1 = v(() => {
    i1();
    Y77 = o(X1(), 1), Lr = o(X1(), 1), EqA = Lr.createContext({
        theme: null,
        setTheme: (A) => A,
        setPreviewTheme: (A) => A,
        savePreview: () => {},
        cancelPreview: () => {},
        currentTheme: null
    })
})
// @from(Ln 139950, Col 0)
function E_(A) {
    let q = e(29),
        {
            color: K,
            backgroundColor: Y,
            bold: z,
            dim: w,
            italic: H,
            underline: $,
            strikethrough: O,
            inverse: _,
            wrap: J,
            children: X
        } = A,
        D = H === void 0 ? !1 : H,
        j = $ === void 0 ? !1 : $,
        M = O === void 0 ? !1 : O,
        P = _ === void 0 ? !1 : _,
        W = J === void 0 ? "wrap" : J;
    if (X === void 0 || X === null) return null;
    let G;
    if (q[0] !== K) G = K && {
        color: K
    }, q[0] = K, q[1] = G;
    else G = q[1];
    let f;
    if (q[2] !== Y) f = Y && {
        backgroundColor: Y
    }, q[2] = Y, q[3] = f;
    else f = q[3];
    let Z;
    if (q[4] !== w) Z = w && {
        dim: w
    }, q[4] = w, q[5] = Z;
    else Z = q[5];
    let N;
    if (q[6] !== z) N = z && {
        bold: z
    }, q[6] = z, q[7] = N;
    else N = q[7];
    let T;
    if (q[8] !== D) T = D && {
        italic: D
    }, q[8] = D, q[9] = T;
    else T = q[9];
    let k;
    if (q[10] !== j) k = j && {
        underline: j
    }, q[10] = j, q[11] = k;
    else k = q[11];
    let y;
    if (q[12] !== M) y = M && {
        strikethrough: M
    }, q[12] = M, q[13] = y;
    else y = q[13];
    let B;
    if (q[14] !== P) B = P && {
        inverse: P
    }, q[14] = P, q[15] = B;
    else B = q[15];
    let S;
    if (q[16] !== T || q[17] !== k || q[18] !== y || q[19] !== B || q[20] !== G || q[21] !== f || q[22] !== Z || q[23] !== N) S = {
        ...G,
        ...f,
        ...Z,
        ...N,
        ...T,
        ...k,
        ...y,
        ...B
    }, q[16] = T, q[17] = k, q[18] = y, q[19] = B, q[20] = G, q[21] = f, q[22] = Z, q[23] = N, q[24] = S;
    else S = q[24];
    let m = S,
        b = yN5[W],
        g;
    if (q[25] !== X || q[26] !== b || q[27] !== m) g = z77.default.createElement("ink-text", {
        style: b,
        textStyles: m
    }, X), q[25] = X, q[26] = b, q[27] = m, q[28] = g;
    else g = q[28];
    return g
}
// @from(Ln 140032, Col 4)
z77
// @from(Ln 140032, Col 9)
yN5
// @from(Ln 140033, Col 4)
PJ1 = v(() => {
    i1();
    z77 = o(X1(), 1), yN5 = {
        wrap: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "wrap"
        },
        "wrap-trim": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "wrap-trim"
        },
        end: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "end"
        },
        middle: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "middle"
        },
        "truncate-end": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-end"
        },
        truncate: {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate"
        },
        "truncate-middle": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-middle"
        },
        "truncate-start": {
            flexGrow: 0,
            flexShrink: 1,
            flexDirection: "row",
            textWrap: "truncate-start"
        }
    }
})
// @from(Ln 140087, Col 0)
function CN5(A, q) {
    if (!A) return;
    if (A.startsWith("rgb(") || A.startsWith("#") || A.startsWith("ansi256(") || A.startsWith("ansi:")) return A;
    return q[A]
}
// @from(Ln 140093, Col 0)
function V(A) {
    let q = e(15),
        {
            color: K,
            backgroundColor: Y,
            dimColor: z,
            bold: w,
            italic: H,
            underline: $,
            strikethrough: O,
            inverse: _,
            wrap: J,
            children: X
        } = A,
        D = z === void 0 ? !1 : z,
        j = w === void 0 ? !1 : w,
        M = H === void 0 ? !1 : H,
        P = $ === void 0 ? !1 : $,
        W = O === void 0 ? !1 : O,
        G = _ === void 0 ? !1 : _,
        f = J === void 0 ? "wrap" : J,
        [Z] = T7(),
        N, T;
    if (q[0] !== K || q[1] !== D || q[2] !== Z) T = MW(Z), N = D ? T.inactive : CN5(K, T), q[0] = K, q[1] = D, q[2] = Z, q[3] = N, q[4] = T;
    else N = q[3], T = q[4];
    let k = N,
        y = Y ? T[Y] : void 0,
        B;
    if (q[5] !== j || q[6] !== X || q[7] !== G || q[8] !== M || q[9] !== y || q[10] !== k || q[11] !== W || q[12] !== P || q[13] !== f) B = w77.default.createElement(E_, {
        color: k,
        backgroundColor: y,
        bold: j,
        italic: M,
        underline: P,
        strikethrough: W,
        inverse: G,
        wrap: f
    }, X), q[5] = j, q[6] = X, q[7] = G, q[8] = M, q[9] = y, q[10] = k, q[11] = W, q[12] = P, q[13] = f, q[14] = B;
    else B = q[14];
    return B
}
// @from(Ln 140134, Col 4)
w77
// @from(Ln 140135, Col 4)
UC1 = v(() => {
    i1();
    Wu();
    gC1();
    PJ1();
    w77 = o(X1(), 1)
})
// @from(Ln 140147, Col 0)
function LqA(A) {
    let q = e(21),
        {
            error: K
        } = A,
        Y, z, w, H, $, O;
    if (q[0] !== K.message || q[1] !== K.stack) {
        let X = K.stack ? K.stack.split(`
`).slice(1) : void 0,
            D = X ? O77.parseLine(X[0]) : void 0,
            j = $77(D?.file),
            M, P = 0;
        if (j && D?.line && cK6.existsSync(j)) {
            let G = cK6.readFileSync(j, "utf8");
            if (M = A77(G, D.line), M)
                for (let {
                        line: f
                    }
                    of M) P = Math.max(P, String(f).length)
        }
        Y = PW, z = "column", w = 1;
        let W;
        if (q[8] === Symbol.for("react.memo_cache_sentinel")) W = ZX.default.createElement(V, {
            backgroundColor: "error",
            color: "text"
        }, " ", "ERROR", " "), q[8] = W;
        else W = q[8];
        if (q[9] !== K.message) H = ZX.default.createElement(PW, null, W, ZX.default.createElement(V, null, " ", K.message)), q[9] = K.message, q[10] = H;
        else H = q[10];
        $ = D && j && ZX.default.createElement(PW, {
            marginTop: 1
        }, ZX.default.createElement(V, {
            dimColor: !0
        }, j, ":", D.line, ":", D.column)), O = D && M && ZX.default.createElement(PW, {
            marginTop: 1,
            flexDirection: "column"
        }, M.map((G) => {
            let {
                line: f,
                value: Z
            } = G;
            return ZX.default.createElement(PW, {
                key: f
            }, ZX.default.createElement(PW, {
                width: P + 1
            }, ZX.default.createElement(V, {
                dimColor: f !== D.line,
                backgroundColor: f === D.line ? "error" : void 0,
                color: f === D.line ? "text" : void 0
            }, String(f).padStart(P, " "), ":")), ZX.default.createElement(V, {
                key: f,
                backgroundColor: f === D.line ? "error" : void 0,
                color: f === D.line ? "text" : void 0
            }, " " + Z))
        })), q[0] = K.message, q[1] = K.stack, q[2] = Y, q[3] = z, q[4] = w, q[5] = H, q[6] = $, q[7] = O
    } else Y = q[2], z = q[3], w = q[4], H = q[5], $ = q[6], O = q[7];
    let _;
    if (q[11] !== K.stack) _ = K.stack && ZX.default.createElement(PW, {
        marginTop: 1,
        flexDirection: "column"
    }, K.stack.split(`
`).slice(1).map(SN5)), q[11] = K.stack, q[12] = _;
    else _ = q[12];
    let J;
    if (q[13] !== Y || q[14] !== z || q[15] !== w || q[16] !== H || q[17] !== $ || q[18] !== O || q[19] !== _) J = ZX.default.createElement(Y, {
        flexDirection: z,
        padding: w
    }, H, $, O, _), q[13] = Y, q[14] = z, q[15] = w, q[16] = H, q[17] = $, q[18] = O, q[19] = _, q[20] = J;
    else J = q[20];
    return J
}
// @from(Ln 140219, Col 0)
function SN5(A) {
    let q = O77.parseLine(A);
    if (!q) return ZX.default.createElement(PW, {
        key: A
    }, ZX.default.createElement(V, {
        dimColor: !0
    }, "- "), ZX.default.createElement(V, {
        dimColor: !0,
        bold: !0
    }, A));
    return ZX.default.createElement(PW, {
        key: A
    }, ZX.default.createElement(V, {
        dimColor: !0
    }, "- "), ZX.default.createElement(V, {
        dimColor: !0,
        bold: !0
    }, q.function), ZX.default.createElement(V, {
        dimColor: !0
    }, " ", "(", $77(q.file) ?? "", ":", q.line, ":", q.column, ")"))
}
// @from(Ln 140240, Col 4)
ZX
// @from(Ln 140240, Col 8)
kqA
// @from(Ln 140240, Col 13)
$77 = (A) => {
        return A?.replace(`file://${H77()}/`, "")
    }
// @from(Ln 140243, Col 4)
O77
// @from(Ln 140244, Col 4)
_77 = v(() => {
    i1();
    q77();
    QC1();
    UC1();
    ZX = o(X1(), 1), kqA = o(s87(), 1), O77 = new kqA.default({
        cwd: H77(),
        internals: kqA.default.nodeInternals()
    })
})
// @from(Ln 140254, Col 4)
WJ1 = 16
// @from(Ln 140256, Col 0)
function k_() {
    let {
        isTerminalFocused: A
    } = J77.useContext(l87);
    return A
}
// @from(Ln 140262, Col 4)
J77
// @from(Ln 140263, Col 4)
RqA = v(() => {
    TqA();
    J77 = o(X1(), 1)
})
// @from(Ln 140268, Col 0)
function hN5(A) {
    let q = new Map,
        K = null,
        Y = A,
        z = 0,
        w = 0;

    function H() {
        w = Date.now() - z;
        for (let O of q.keys()) O()
    }

    function $() {
        if ([...q.values()].some(Boolean)) {
            if (K) clearInterval(K), K = null;
            if (z === 0) z = Date.now();
            K = setInterval(H, Y)
        } else if (K) clearInterval(K), K = null
    }
    return {
        subscribe(O, _) {
            return q.set(O, _), $(), () => {
                q.delete(O), $()
            }
        },
        now() {
            if (z === 0) z = Date.now();
            if (K && w) return w;
            return Date.now() - z
        },
        setTickInterval(O) {
            if (O === Y) return;
            Y = O, $()
        }
    }
}
// @from(Ln 140305, Col 0)
function X77(A) {
    let q = e(7),
        {
            children: K
        } = A,
        [Y] = Rr.useState(xN5),
        z = k_(),
        w, H;
    if (q[0] !== Y || q[1] !== z) w = () => {
        Y.setTickInterval(z ? WJ1 : IN5)
    }, H = [Y, z], q[0] = Y, q[1] = z, q[2] = w, q[3] = H;
    else w = q[2], H = q[3];
    Rr.useEffect(w, H);
    let $;
    if (q[4] !== K || q[5] !== Y) $ = Rr.default.createElement(GJ1.Provider, {
        value: Y
    }, K), q[4] = K, q[5] = Y, q[6] = $;
    else $ = q[6];
    return $
}
// @from(Ln 140326, Col 0)
function xN5() {
    return hN5(WJ1)
}
// @from(Ln 140329, Col 4)
Rr
// @from(Ln 140329, Col 8)
GJ1
// @from(Ln 140329, Col 13)
IN5
// @from(Ln 140330, Col 4)
lK6 = v(() => {
    i1();
    RqA();
    Rr = o(X1(), 1);
    GJ1 = Rr.createContext(null), IN5 = WJ1 * 2
})
// @from(Ln 140340, Col 0)
function D77(A) {
    return {
        name: "",
        fn: !1,
        ctrl: !1,
        meta: !1,
        shift: !1,
        option: !1,
        sequence: A,
        raw: A,
        isPasted: !0
    }
}
// @from(Ln 140354, Col 0)
function FN5(A) {
    if (bN5.isBuffer(A))
        if (A[0] > 127 && A[1] === void 0) return A[0] -= 128, "\x1B" + String(A);
        else return String(A);
    else if (A !== void 0 && typeof A !== "string") return String(A);
    else if (!A) return "";
    else return A
}
// @from(Ln 140363, Col 0)
function P77(A, q = "") {
    let K = q === null,
        Y = K ? "" : FN5(q),
        z = A._tokenizer ?? AJ1(),
        w = K ? z.flush() : z.feed(Y),
        H = [],
        $ = A.mode === "IN_PASTE",
        O = A.pasteBuffer;
    for (let J of w)
        if (J.type === "sequence")
            if (J.value === jA7) $ = !0, O = "";
            else if (J.value === MA7) H.push(D77(O)), $ = !1, O = "";
    else if ($) O += J.value;
    else H.push(j77(J.value));
    else if (J.type === "text")
        if ($) O += J.value;
        else H.push(j77(J.value));
    if (K && $ && O) H.push(D77(O)), $ = !1, O = "";
    let _ = {
        mode: $ ? "IN_PASTE" : "NORMAL",
        incomplete: z.buffer(),
        pasteBuffer: O,
        _tokenizer: z
    };
    return [H, _]
}
// @from(Ln 140390, Col 0)
function UN5(A) {
    let q = A - 1;
    return {
        shift: !!(q & 1),
        meta: !!(q & 2) || !!(q & 8),
        ctrl: !!(q & 4)
    }
}
// @from(Ln 140399, Col 0)
function pN5(A) {
    switch (A) {
        case 9:
            return "tab";
        case 13:
            return "return";
        case 27:
            return "escape";
        case 32:
            return "space";
        case 127:
            return "backspace";
        case 57399:
            return "0";
        case 57400:
            return "1";
        case 57401:
            return "2";
        case 57402:
            return "3";
        case 57403:
            return "4";
        case 57404:
            return "5";
        case 57405:
            return "6";
        case 57406:
            return "7";
        case 57407:
            return "8";
        case 57408:
            return "9";
        case 57409:
            return ".";
        case 57410:
            return "/";
        case 57411:
            return "*";
        case 57412:
            return "-";
        case 57413:
            return "+";
        case 57414:
            return "return";
        case 57415:
            return "=";
        default:
            if (A >= 32 && A <= 126) return String.fromCharCode(A).toLowerCase();
            return
    }
}
// @from(Ln 140451, Col 0)
function j77(A = "") {
    let q, K = {
        name: "",
        fn: !1,
        ctrl: !1,
        meta: !1,
        shift: !1,
        option: !1,
        sequence: A,
        raw: A,
        isPasted: !1
    };
    K.sequence = K.sequence || A || K.name;
    let Y;
    if (Y = mN5.exec(A)) {
        let z = parseInt(Y[1], 10),
            w = Y[2] ? parseInt(Y[2], 10) : 1,
            H = UN5(w);
        return {
            name: pN5(z),
            fn: !1,
            ctrl: H.ctrl,
            meta: H.meta,
            shift: H.shift,
            option: !1,
            sequence: A,
            raw: A,
            isPasted: !1
        }
    }
    if (A === "\r") K.raw = void 0, K.name = "return";
    else if (A === `
`) K.name = "enter";
    else if (A === "\t") K.name = "tab";
    else if (A === "\b" || A === "\x1B\b") K.name = "backspace", K.meta = A.charAt(0) === "\x1B";
    else if (A === "" || A === "\x1B") K.name = "backspace", K.meta = A.charAt(0) === "\x1B";
    else if (A === "\x1B" || A === "\x1B\x1B") K.name = "escape", K.meta = A.length === 2;
    else if (A === " " || A === "\x1B ") K.name = "space", K.meta = A.length === 2;
    else if (A === "\x1F") K.name = "_", K.ctrl = !0;
    else if (A <= "\x1A" && A.length === 1) K.name = String.fromCharCode(A.charCodeAt(0) + 97 - 1), K.ctrl = !0;
    else if (A.length === 1 && A >= "0" && A <= "9") K.name = "number";
    else if (A.length === 1 && A >= "a" && A <= "z") K.name = A;
    else if (A.length === 1 && A >= "A" && A <= "Z") K.name = A.toLowerCase(), K.shift = !0;
    else if (q = uN5.exec(A)) K.meta = !0, K.shift = /^[A-Z]$/.test(q[1]);
    else if (q = BN5.exec(A)) {
        let z = [...A];
        if (z[0] === "\x1B" && z[1] === "\x1B") K.option = !0;
        let w = [q[1], q[2], q[4], q[6]].filter(Boolean).join(""),
            H = (q[3] || q[5] || 1) - 1;
        K.ctrl = !!(H & 4), K.meta = !!(H & 10), K.shift = !!(H & 1), K.code = w, K.name = W77[w], K.shift = QN5(w) || K.shift, K.ctrl = gN5(w) || K.ctrl
    }
    if (K.raw === "\x1Bb") K.meta = !0, K.name = "left";
    else if (K.raw === "\x1Bf") K.meta = !0, K.name = "right";
    switch (A) {
        case "\x1B[1~":
            return {
                name: "home", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            };
        case "\x1B[4~":
            return {
                name: "end", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            };
        case "\x1B[5~":
            return {
                name: "pageup", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            };
        case "\x1B[6~":
            return {
                name: "pagedown", ctrl: !1, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            };
        case "\x1B[1;5D":
            return {
                name: "left", ctrl: !0, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            };
        case "\x1B[1;5C":
            return {
                name: "right", ctrl: !0, meta: !1, shift: !1, option: !1, fn: !1, sequence: A, raw: A, isPasted: !1
            }
    }
    return K
}
// @from(Ln 140532, Col 4)
uN5
// @from(Ln 140532, Col 9)
BN5
// @from(Ln 140532, Col 14)
mN5
// @from(Ln 140532, Col 19)
M77
// @from(Ln 140532, Col 24)
W77
// @from(Ln 140532, Col 29)
G77
// @from(Ln 140532, Col 34)
QN5 = (A) => {
        return ["[a", "[b", "[c", "[d", "[e", "[2$", "[3$", "[5$", "[6$", "[7$", "[8$", "[Z"].includes(A)
    }
// @from(Ln 140535, Col 4)
gN5 = (A) => {
        return ["Oa", "Ob", "Oc", "Od", "Oe", "[2^", "[3^", "[5^", "[6^", "[7^", "[8^"].includes(A)
    }
// @from(Ln 140538, Col 4)
yqA = v(() => {
    fK6();
    Mu();
    uN5 = /^(?:\x1b)([a-zA-Z0-9])$/, BN5 = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/, mN5 = /^\x1b\[(\d+)(?:;(\d+))?u/;
    M77 = {
        mode: "NORMAL",
        incomplete: "",
        pasteBuffer: ""
    };
    W77 = {
        OP: "f1",
        OQ: "f2",
        OR: "f3",
        OS: "f4",
        "[11~": "f1",
        "[12~": "f2",
        "[13~": "f3",
        "[14~": "f4",
        "[[A": "f1",
        "[[B": "f2",
        "[[C": "f3",
        "[[D": "f4",
        "[[E": "f5",
        "[15~": "f5",
        "[17~": "f6",
        "[18~": "f7",
        "[19~": "f8",
        "[20~": "f9",
        "[21~": "f10",
        "[23~": "f11",
        "[24~": "f12",
        "[A": "up",
        "[B": "down",
        "[C": "right",
        "[D": "left",
        "[E": "clear",
        "[F": "end",
        "[H": "home",
        OA: "up",
        OB: "down",
        OC: "right",
        OD: "left",
        OE: "clear",
        OF: "end",
        OH: "home",
        "[1~": "home",
        "[2~": "insert",
        "[3~": "delete",
        "[4~": "end",
        "[5~": "pageup",
        "[6~": "pagedown",
        "[[5~": "pageup",
        "[[6~": "pagedown",
        "[7~": "home",
        "[8~": "end",
        "[a": "up",
        "[b": "down",
        "[c": "right",
        "[d": "left",
        "[e": "clear",
        "[2$": "insert",
        "[3$": "delete",
        "[5$": "pageup",
        "[6$": "pagedown",
        "[7$": "home",
        "[8$": "end",
        Oa: "up",
        Ob: "down",
        Oc: "right",
        Od: "left",
        Oe: "clear",
        "[2^": "insert",
        "[3^": "delete",
        "[5^": "pageup",
        "[6^": "pagedown",
        "[7^": "home",
        "[8^": "end",
        "[Z": "tab"
    }, G77 = [...Object.values(W77), "backspace"]
})
// @from(Ln 140619, Col 0)
function dN5(A) {
    let q = {
            upArrow: A.name === "up",
            downArrow: A.name === "down",
            leftArrow: A.name === "left",
            rightArrow: A.name === "right",
            pageDown: A.name === "pagedown",
            pageUp: A.name === "pageup",
            home: A.name === "home",
            end: A.name === "end",
            return: A.name === "return",
            escape: A.name === "escape",
            fn: A.fn,
            ctrl: A.ctrl,
            shift: A.shift,
            tab: A.name === "tab",
            backspace: A.name === "backspace",
            delete: A.name === "delete",
            meta: A.meta || A.name === "escape" || A.option
        },
        K = A.ctrl ? A.name : A.sequence;
    if (K === void 0) K = "";
    if (A.name && G77.includes(A.name)) K = "";
    if (K.startsWith("\x1B")) K = K.slice(1);
    if (K.startsWith("[") && K.endsWith("u") && A.name) K = A.name === "space" ? " " : A.name;
    if (K.length === 1 && typeof K[0] === "string" && K[0] >= "A" && K[0] <= "Z") q.shift = !0;
    return [q, K]
}
// @from(Ln 140647, Col 4)
pC1
// @from(Ln 140648, Col 4)
CqA = v(() => {
    yqA();
    pC1 = class pC1 extends tg {
        keypress;
        key;
        input;
        constructor(A) {
            super();
            let [q, K] = dN5(A);
            this.keypress = A, this.key = q, this.input = K
        }
    }
})
// @from(Ln 140661, Col 4)
ZJ1
// @from(Ln 140662, Col 4)
SqA = v(() => {
    ZJ1 = class ZJ1 extends tg {
        type;
        constructor(A) {
            super();
            this.type = A
        }
    }
})
// @from(Ln 140671, Col 4)
Z77
// @from(Ln 140671, Col 9)
fJ1
// @from(Ln 140672, Col 4)
iK6 = v(() => {
    Z77 = o(X1(), 1), fJ1 = Z77.createContext(null)
})
// @from(Ln 140676, Col 0)
function nK6(A) {
    return uO(`?${A}h`)
}
// @from(Ln 140680, Col 0)
function rK6(A) {
    return uO(`?${A}l`)
}
// @from(Ln 140683, Col 4)
GM
// @from(Ln 140683, Col 8)
f77
// @from(Ln 140683, Col 13)
V77
// @from(Ln 140683, Col 18)
N77
// @from(Ln 140683, Col 23)
VJ1
// @from(Ln 140683, Col 28)
hqA
// @from(Ln 140683, Col 33)
T71
// @from(Ln 140683, Col 38)
PS
// @from(Ln 140683, Col 42)
dC1
// @from(Ln 140684, Col 4)
v71 = v(() => {
    Mu();
    GM = {
        CURSOR_VISIBLE: 25,
        ALT_SCREEN: 47,
        ALT_SCREEN_CLEAR: 1049,
        MOUSE_NORMAL: 1000,
        MOUSE_BUTTON: 1002,
        MOUSE_ANY: 1003,
        FOCUS_EVENTS: 1004,
        BRACKETED_PASTE: 2004,
        SYNCHRONIZED_UPDATE: 2026
    };
    f77 = nK6(GM.SYNCHRONIZED_UPDATE), V77 = rK6(GM.SYNCHRONIZED_UPDATE), N77 = nK6(GM.BRACKETED_PASTE), VJ1 = rK6(GM.BRACKETED_PASTE), hqA = nK6(GM.FOCUS_EVENTS), T71 = rK6(GM.FOCUS_EVENTS), PS = nK6(GM.CURSOR_VISIBLE), dC1 = rK6(GM.CURSOR_VISIBLE)
})
// @from(Ln 140699, Col 4)
T77 = {}
// @from(Ln 140708, Col 0)
function cN5() {
    if (!process.stdin.isTTY || NJ1) return;
    NJ1 = !0, Gu = "";
    try {
        process.stdin.setEncoding("utf8"), process.stdin.setRawMode(!0), process.stdin.ref(), cC1 = () => {
            let A = process.stdin.read();
            while (A !== null) {
                if (typeof A === "string") lN5(A);
                A = process.stdin.read()
            }
        }, process.stdin.on("readable", cC1)
    } catch {
        NJ1 = !1
    }
}
// @from(Ln 140724, Col 0)
function lN5(A) {
    let q = 0;
    while (q < A.length) {
        let K = A[q],
            Y = K.charCodeAt(0);
        if (Y === 3) {
            yr(), process.exit(130);
            return
        }
        if (Y === 4) {
            yr();
            return
        }
        if (Y === 127 || Y === 8) {
            if (Gu.length > 0) {
                let z = pg(Gu);
                Gu = Gu.slice(0, -(z.length || 1))
            }
            q++;
            continue
        }
        if (Y === 27) {
            q++;
            while (q < A.length && !(A.charCodeAt(q) >= 64 && A.charCodeAt(q) <= 126)) q++;
            if (q < A.length) q++;
            continue
        }
        if (Y < 32 && Y !== 9 && Y !== 10 && Y !== 13) {
            q++;
            continue
        }
        if (Y === 13) {
            Gu += `
`, q++;
            continue
        }
        Gu += K, q++
    }
}
// @from(Ln 140764, Col 0)
function yr() {
    if (!NJ1) return;
    if (NJ1 = !1, cC1) process.stdin.removeListener("readable", cC1), cC1 = null
}
// @from(Ln 140769, Col 0)
function IqA() {
    yr();
    let A = Gu.trim();
    return Gu = "", A
}
// @from(Ln 140775, Col 0)
function iN5() {
    return Gu.trim().length > 0
}
// @from(Ln 140779, Col 0)
function nN5() {
    return NJ1
}
// @from(Ln 140782, Col 4)
Gu = ""
// @from(Ln 140783, Col 4)
NJ1 = !1
// @from(Ln 140784, Col 4)
cC1 = null
// @from(Ln 140785, Col 4)
lC1 = v(() => {
    OS()
})
// @from(Ln 140789, Col 0)
function iC1(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1
        };
    for (let Y of q) {
        let z = Y.toLowerCase();
        switch (z) {
            case "ctrl":
            case "control":
                K.ctrl = !0;
                break;
            case "alt":
            case "opt":
            case "option":
                K.alt = !0;
                break;
            case "shift":
                K.shift = !0;
                break;
            case "meta":
            case "cmd":
            case "command":
                K.meta = !0;
                break;
            case "esc":
                K.key = "escape";
                break;
            case "return":
                K.key = "enter";
                break;
            case "space":
                K.key = " ";
                break;
            case "↑":
                K.key = "up";
                break;
            case "↓":
                K.key = "down";
                break;
            case "←":
                K.key = "left";
                break;
            case "→":
                K.key = "right";
                break;
            default:
                K.key = z;
                break
        }
    }
    return K
}
// @from(Ln 140847, Col 0)
function rN5(A) {
    if (A === " ") return [iC1("space")];
    return A.trim().split(/\s+/).map(iC1)
}
// @from(Ln 140852, Col 0)
function oN5(A) {
    let q = [];
    if (A.ctrl) q.push("ctrl");
    if (A.alt) q.push("alt");
    if (A.shift) q.push("shift");
    if (A.meta) q.push("meta");
    let K = aN5(A.key);
    return q.push(K), q.join("+")
}
// @from(Ln 140862, Col 0)
function aN5(A) {
    switch (A) {
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
            return A
    }
}
// @from(Ln 140897, Col 0)
function oK6(A) {
    return A.map(oN5).join(" ")
}
// @from(Ln 140901, Col 0)
function aK6(A) {
    let q = [];
    for (let K of A)
        for (let [Y, z] of Object.entries(K.bindings)) q.push({
            chord: rN5(Y),
            action: z,
            context: K.context
        });
    return q
}
// @from(Ln 140912, Col 0)
function v77(A, q) {
    if (q.escape) return "escape";
    if (q.return) return "enter";
    if (q.tab) return "tab";
    if (q.backspace) return "backspace";
    if (q.delete) return "delete";
    if (q.upArrow) return "up";
    if (q.downArrow) return "down";
    if (q.leftArrow) return "left";
    if (q.rightArrow) return "right";
    if (q.pageUp) return "pageup";
    if (q.pageDown) return "pagedown";
    if (q.home) return "home";
    if (q.end) return "end";
    if (A.length === 1) return A.toLowerCase();
    return null
}
// @from(Ln 140930, Col 0)
function sK6(A, q, K) {
    for (let Y = K.length - 1; Y >= 0; Y--) {
        let z = K[Y];
        if (z && z.action === A && z.context === q) return oK6(z.chord)
    }
    return
}
// @from(Ln 140938, Col 0)
function sN5(A, q) {
    let K = v77(A, q);
    if (!K) return null;
    let Y = q.escape ? !1 : q.meta;
    return {
        key: K,
        ctrl: q.ctrl,
        alt: Y,
        shift: q.shift,
        meta: Y
    }
}
// @from(Ln 140951, Col 0)
function tN5(A, q) {
    if (A.length >= q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (Y.key !== z.key) return !1;
        if (Y.ctrl !== z.ctrl) return !1;
        if ((Y.alt || Y.meta) !== (z.alt || z.meta)) return !1;
        if (Y.shift !== z.shift) return !1
    }
    return !0
}
// @from(Ln 140965, Col 0)
function eN5(A, q) {
    if (A.length !== q.chord.length) return !1;
    for (let K = 0; K < A.length; K++) {
        let Y = A[K],
            z = q.chord[K];
        if (!Y || !z) return !1;
        if (Y.key !== z.key) return !1;
        if (Y.ctrl !== z.ctrl) return !1;
        if ((Y.alt || Y.meta) !== (z.alt || z.meta)) return !1;
        if (Y.shift !== z.shift) return !1
    }
    return !0
}
// @from(Ln 140979, Col 0)
function tK6(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let w = sN5(A, q);
    if (!w) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let H = z ? [...z, w] : [w],
        $ = Y.filter((J) => K.includes(J.context));
    if ($.some((J) => J.chord.length > H.length && tN5(H, J))) return {
        type: "chord_started",
        pending: H
    };
    let _;
    for (let J of $)
        if (eN5(H, J)) _ = J;
    if (_) {
        if (_.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: _.action
        }
    }
    if (z !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}
// @from(Ln 141017, Col 4)
eK6 = () => {}
// @from(Ln 141019, Col 0)
function A36(A) {
    let q = e(27),
        {
            bindings: K,
            pendingChordRef: Y,
            pendingChord: z,
            setPendingChord: w,
            activeContexts: H,
            registerActiveContext: $,
            unregisterActiveContext: O,
            handlerRegistryRef: _,
            children: J
        } = A,
        X;
    if (q[0] !== K) X = (k, y) => sK6(k, y, K), q[0] = K, q[1] = X;
    else X = q[1];
    let D = X,
        j;
    if (q[2] !== _) j = (k) => {
        let y = _.current;
        if (!y) return AT5;
        if (!y.has(k.action)) y.set(k.action, new Set);
        return y.get(k.action).add(k), () => {
            let B = y.get(k.action);
            if (B) {
                if (B.delete(k), B.size === 0) y.delete(k.action)
            }
        }
    }, q[2] = _, q[3] = j;
    else j = q[3];
    let M = j,
        P;
    if (q[4] !== H || q[5] !== _) P = (k) => {
        let y = _.current;
        if (!y) return !1;
        let B = y.get(k);
        if (!B || B.size === 0) return !1;
        for (let S of B)
            if (H.has(S.context)) return S.handler(), !0;
        return !1
    }, q[4] = H, q[5] = _, q[6] = P;
    else P = q[6];
    let W = P,
        G;
    if (q[7] !== K || q[8] !== Y) G = (k, y, B) => tK6(k, y, B, K, Y.current), q[7] = K, q[8] = Y, q[9] = G;
    else G = q[9];
    let f;
    if (q[10] !== D) f = (k, y) => D(k, y), q[10] = D, q[11] = f;
    else f = q[11];
    let Z;
    if (q[12] !== H || q[13] !== K || q[14] !== D || q[15] !== W || q[16] !== z || q[17] !== $ || q[18] !== M || q[19] !== w || q[20] !== G || q[21] !== f || q[22] !== O) Z = {
        resolve: G,
        setPendingChord: w,
        getDisplayText: D,
        getPlatformDisplayText: f,
        bindings: K,
        pendingChord: z,
        activeContexts: H,
        registerActiveContext: $,
        unregisterActiveContext: O,
        registerHandler: M,
        invokeAction: W
    }, q[12] = H, q[13] = K, q[14] = D, q[15] = W, q[16] = z, q[17] = $, q[18] = M, q[19] = w, q[20] = G, q[21] = f, q[22] = O, q[23] = Z;
    else Z = q[23];
    let N = Z,
        T;
    if (q[24] !== J || q[25] !== N) T = E77.default.createElement(k77.Provider, {
        value: N
    }, J), q[24] = J, q[25] = N, q[26] = T;
    else T = q[26];
    return T
}
// @from(Ln 141092, Col 0)
function AT5() {}
// @from(Ln 141094, Col 0)
function VL() {
    return TJ1.useContext(k77)
}
// @from(Ln 141098, Col 0)
function q36(A, q) {
    let K = e(5),
        Y = q === void 0 ? !0 : q,
        z = VL(),
        w, H;
    if (K[0] !== A || K[1] !== Y || K[2] !== z) w = () => {
        if (!z || !Y) return;
        return z.registerActiveContext(A), () => {
            z.unregisterActiveContext(A)
        }
    }, H = [A, z, Y], K[0] = A, K[1] = Y, K[2] = z, K[3] = w, K[4] = H;
    else w = K[3], H = K[4];
    TJ1.useLayoutEffect(w, H)
}
// @from(Ln 141112, Col 4)
E77
// @from(Ln 141112, Col 9)
TJ1
// @from(Ln 141112, Col 14)
k77
// @from(Ln 141113, Col 4)
eg = v(() => {
    i1();
    eK6();
    E77 = o(X1(), 1), TJ1 = o(X1(), 1), k77 = TJ1.createContext(null)
})
// @from(Ln 141118, Col 4)
nC1 = R((SZ2, L77) => {
    var qT5 = Number.MAX_SAFE_INTEGER || 9007199254740991,
        KT5 = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];
    L77.exports = {
        MAX_LENGTH: 256,
        MAX_SAFE_COMPONENT_LENGTH: 16,
        MAX_SAFE_BUILD_LENGTH: 250,
        MAX_SAFE_INTEGER: qT5,
        RELEASE_TYPES: KT5,
        SEMVER_SPEC_VERSION: "2.0.0",
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2
    }
})
// @from(Ln 141132, Col 4)
rC1 = R((hZ2, R77) => {
    var YT5 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...A) => console.error("SEMVER", ...A) : () => {};
    R77.exports = YT5
})
// @from(Ln 141136, Col 4)
vJ1 = R((Zu, y77) => {
    var {
        MAX_SAFE_COMPONENT_LENGTH: xqA,
        MAX_SAFE_BUILD_LENGTH: zT5,
        MAX_LENGTH: wT5
    } = nC1(), HT5 = rC1();
    Zu = y77.exports = {};
    var $T5 = Zu.re = [],
        OT5 = Zu.safeRe = [],
        I4 = Zu.src = [],
        _T5 = Zu.safeSrc = [],
        x4 = Zu.t = {},
        JT5 = 0,
        bqA = "[a-zA-Z0-9-]",
        XT5 = [
            ["\\s", 1],
            ["\\d", wT5],
            [bqA, zT5]
        ],
        DT5 = (A) => {
            for (let [q, K] of XT5) A = A.split(`${q}*`).join(`${q}{0,${K}}`).split(`${q}+`).join(`${q}{1,${K}}`);
            return A
        },
        e3 = (A, q, K) => {
            let Y = DT5(q),
                z = JT5++;
            HT5(A, z, q), x4[A] = z, I4[z] = q, _T5[z] = Y, $T5[z] = new RegExp(q, K ? "g" : void 0), OT5[z] = new RegExp(Y, K ? "g" : void 0)
        };
    e3("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    e3("NUMERICIDENTIFIERLOOSE", "\\d+");
    e3("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${bqA}*`);
    e3("MAINVERSION", `(${I4[x4.NUMERICIDENTIFIER]})\\.(${I4[x4.NUMERICIDENTIFIER]})\\.(${I4[x4.NUMERICIDENTIFIER]})`);
    e3("MAINVERSIONLOOSE", `(${I4[x4.NUMERICIDENTIFIERLOOSE]})\\.(${I4[x4.NUMERICIDENTIFIERLOOSE]})\\.(${I4[x4.NUMERICIDENTIFIERLOOSE]})`);
    e3("PRERELEASEIDENTIFIER", `(?:${I4[x4.NONNUMERICIDENTIFIER]}|${I4[x4.NUMERICIDENTIFIER]})`);
    e3("PRERELEASEIDENTIFIERLOOSE", `(?:${I4[x4.NONNUMERICIDENTIFIER]}|${I4[x4.NUMERICIDENTIFIERLOOSE]})`);
    e3("PRERELEASE", `(?:-(${I4[x4.PRERELEASEIDENTIFIER]}(?:\\.${I4[x4.PRERELEASEIDENTIFIER]})*))`);
    e3("PRERELEASELOOSE", `(?:-?(${I4[x4.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${I4[x4.PRERELEASEIDENTIFIERLOOSE]})*))`);
    e3("BUILDIDENTIFIER", `${bqA}+`);
    e3("BUILD", `(?:\\+(${I4[x4.BUILDIDENTIFIER]}(?:\\.${I4[x4.BUILDIDENTIFIER]})*))`);
    e3("FULLPLAIN", `v?${I4[x4.MAINVERSION]}${I4[x4.PRERELEASE]}?${I4[x4.BUILD]}?`);
    e3("FULL", `^${I4[x4.FULLPLAIN]}$`);
    e3("LOOSEPLAIN", `[v=\\s]*${I4[x4.MAINVERSIONLOOSE]}${I4[x4.PRERELEASELOOSE]}?${I4[x4.BUILD]}?`);
    e3("LOOSE", `^${I4[x4.LOOSEPLAIN]}$`);
    e3("GTLT", "((?:<|>)?=?)");
    e3("XRANGEIDENTIFIERLOOSE", `${I4[x4.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    e3("XRANGEIDENTIFIER", `${I4[x4.NUMERICIDENTIFIER]}|x|X|\\*`);
    e3("XRANGEPLAIN", `[v=\\s]*(${I4[x4.XRANGEIDENTIFIER]})(?:\\.(${I4[x4.XRANGEIDENTIFIER]})(?:\\.(${I4[x4.XRANGEIDENTIFIER]})(?:${I4[x4.PRERELEASE]})?${I4[x4.BUILD]}?)?)?`);
    e3("XRANGEPLAINLOOSE", `[v=\\s]*(${I4[x4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${I4[x4.XRANGEIDENTIFIERLOOSE]})(?:\\.(${I4[x4.XRANGEIDENTIFIERLOOSE]})(?:${I4[x4.PRERELEASELOOSE]})?${I4[x4.BUILD]}?)?)?`);
    e3("XRANGE", `^${I4[x4.GTLT]}\\s*${I4[x4.XRANGEPLAIN]}$`);
    e3("XRANGELOOSE", `^${I4[x4.GTLT]}\\s*${I4[x4.XRANGEPLAINLOOSE]}$`);
    e3("COERCEPLAIN", `(^|[^\\d])(\\d{1,${xqA}})(?:\\.(\\d{1,${xqA}}))?(?:\\.(\\d{1,${xqA}}))?`);
    e3("COERCE", `${I4[x4.COERCEPLAIN]}(?:$|[^\\d])`);
    e3("COERCEFULL", I4[x4.COERCEPLAIN] + `(?:${I4[x4.PRERELEASE]})?(?:${I4[x4.BUILD]})?(?:$|[^\\d])`);
    e3("COERCERTL", I4[x4.COERCE], !0);
    e3("COERCERTLFULL", I4[x4.COERCEFULL], !0);
    e3("LONETILDE", "(?:~>?)");
    e3("TILDETRIM", `(\\s*)${I4[x4.LONETILDE]}\\s+`, !0);
    Zu.tildeTrimReplace = "$1~";
    e3("TILDE", `^${I4[x4.LONETILDE]}${I4[x4.XRANGEPLAIN]}$`);
    e3("TILDELOOSE", `^${I4[x4.LONETILDE]}${I4[x4.XRANGEPLAINLOOSE]}$`);
    e3("LONECARET", "(?:\\^)");
    e3("CARETTRIM", `(\\s*)${I4[x4.LONECARET]}\\s+`, !0);
    Zu.caretTrimReplace = "$1^";
    e3("CARET", `^${I4[x4.LONECARET]}${I4[x4.XRANGEPLAIN]}$`);
    e3("CARETLOOSE", `^${I4[x4.LONECARET]}${I4[x4.XRANGEPLAINLOOSE]}$`);
    e3("COMPARATORLOOSE", `^${I4[x4.GTLT]}\\s*(${I4[x4.LOOSEPLAIN]})$|^$`);
    e3("COMPARATOR", `^${I4[x4.GTLT]}\\s*(${I4[x4.FULLPLAIN]})$|^$`);
    e3("COMPARATORTRIM", `(\\s*)${I4[x4.GTLT]}\\s*(${I4[x4.LOOSEPLAIN]}|${I4[x4.XRANGEPLAIN]})`, !0);
    Zu.comparatorTrimReplace = "$1$2$3";
    e3("HYPHENRANGE", `^\\s*(${I4[x4.XRANGEPLAIN]})\\s+-\\s+(${I4[x4.XRANGEPLAIN]})\\s*$`);
    e3("HYPHENRANGELOOSE", `^\\s*(${I4[x4.XRANGEPLAINLOOSE]})\\s+-\\s+(${I4[x4.XRANGEPLAINLOOSE]})\\s*$`);
    e3("STAR", "(<|>)?=?\\s*\\*");
    e3("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    e3("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$")
})
// @from(Ln 141211, Col 4)
K36 = R((IZ2, C77) => {
    var jT5 = Object.freeze({
            loose: !0
        }),
        MT5 = Object.freeze({}),
        PT5 = (A) => {
            if (!A) return MT5;
            if (typeof A !== "object") return jT5;
            return A
        };
    C77.exports = PT5
})
// @from(Ln 141223, Col 4)
uqA = R((xZ2, I77) => {
    var S77 = /^[0-9]+$/,
        h77 = (A, q) => {
            let K = S77.test(A),
                Y = S77.test(q);
            if (K && Y) A = +A, q = +q;
            return A === q ? 0 : K && !Y ? -1 : Y && !K ? 1 : A < q ? -1 : 1
        },
        WT5 = (A, q) => h77(q, A);
    I77.exports = {
        compareIdentifiers: h77,
        rcompareIdentifiers: WT5
    }
})