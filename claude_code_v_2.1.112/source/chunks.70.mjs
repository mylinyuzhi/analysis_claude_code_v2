
// @from(Ln 183543, Col 0)
class $u1 {
    options;
    state;
    constructor(q) {
        this.options = q;
        this.state = {
            previousOutput: ""
        }
    }
    renderPreviousOutput_DEPRECATED(q) {
        if (!this.options.isTTY) return [VE8];
        return this.getRenderOpsForDone(q)
    }
    reset() {
        this.state.previousOutput = ""
    }
    renderFullFrame(q) {
        let {
            screen: K
        } = q, _ = [], z = [], Y = void 0;
        for (let A = 0; A < K.height; A++) {
            let O = "";
            for (let $ = 0; $ < K.width; $++) {
                let j = Tf(K, $, A);
                if (j && j.width !== 2) {
                    if (j.hyperlink !== Y) {
                        if (Y !== void 0) O += AN8;
                        if (j.hyperlink !== void 0) O += YN8(j.hyperlink);
                        Y = j.hyperlink
                    }
                    let H = this.options.stylePool.get(j.styleId),
                        J = V$6(z, H);
                    if (J.length > 0) O += HR(J), z = H;
                    O += j.char
                }
            }
            if (Y !== void 0) O += AN8, Y = void 0;
            let w = V$6(z, []);
            if (w.length > 0) O += HR(w), z = [];
            _.push(O.trimEnd())
        }
        if (_.length === 0) return [];
        return [{
            type: "stdout",
            content: _.join(`
`)
        }]
    }
    getRenderOpsForDone(q) {
        if (this.state.previousOutput = "", !q.cursor.visible) return [{
            type: "cursorShow"
        }];
        return []
    }
    render(q, K, _ = !1, z = !0) {
        if (!this.options.isTTY) {
            if (E34(q.screen, K.screen)) return [];
            return this.renderFullFrame(K)
        }
        let Y = performance.now(),
            A = this.options.stylePool,
            w = q.cursor.y >= q.screen.height && q.screen.height >= q.viewport.height;
        if (K.viewport.height < q.viewport.height || K.viewport.height > q.viewport.height && w || q.viewport.width !== 0 && K.viewport.width !== q.viewport.width) return TE8(K, "resize", A, _);
        let $ = [];
        if (_ && K.scrollHint && z) {
            let {
                top: k,
                bottom: N,
                delta: R
            } = K.scrollHint;
            if (k >= 0 && N < q.screen.height && N < K.screen.height) aN8(q.screen, k, N, R), $ = [{
                type: "stdout",
                content: i44(k + 1, N + 1) + (R > 0 ? l44(R) : n44(-R)) + r44 + fI
            }]
        }
        let j = K.screen.height < q.screen.height,
            H = K.screen.height <= q.viewport.height;
        if (w && H && j) return E(`Full reset (shrink->below): prevHeight=${q.screen.height}, nextHeight=${K.screen.height}, viewport=${q.viewport.height}`), TE8(K, "offscreen", A, _);
        let J = new ju1(q.cursor, K.viewport.width),
            X = Math.max(K.screen.height, 1) - Math.max(q.screen.height, 1),
            M = X < 0,
            P = X > 0;
        if (M) {
            let k = q.screen.height - K.screen.height;
            if (k > q.viewport.height) return TE8(K, "offscreen", this.options.stylePool, _);
            J.txn((N) => [
                [{
                    type: "clear",
                    count: k
                }, {
                    type: "cursorMove",
                    x: 0,
                    y: -1
                }], {
                    dx: -N.x,
                    dy: -k
                }
            ])
        }
        let W = w ? 1 : 0,
            D = P ? Math.max(0, q.screen.height - q.viewport.height + W) : Math.max(q.screen.height, K.screen.height) - K.viewport.height + W,
            Z = A.none,
            G = void 0,
            f = !1,
            v = -1;
        if (b34(q.screen, K.screen, (k, N, R, h) => {
                if (P && N >= q.screen.height) return;
                if (h && (h.width === 2 || h.width === 3)) return;
                if (R && (R.width === 2 || R.width === 3) && !h) return;
                if (h && pa6(K.screen, k, N) && !R) return;
                if (N < D) {
                    if (_ || M) return f = !0, v = N, !0;
                    return
                }
                if (wu1(J, k, N), h) {
                    let C = h.hyperlink;
                    G = pN6(J.diff, G, C);
                    let x = A.transition(Z, h.styleId);
                    if (yz4(J, h, x)) Z = h.styleId
                } else if (R) {
                    let C = Z,
                        x = G;
                    Z = A.none, G = void 0, J.txn(() => {
                        let B = [];
                        return kE8(B, A, C, A.none), pN6(B, x, void 0), B.push({
                            type: "stdout",
                            content: " "
                        }), [B, {
                            dx: 1,
                            dy: 0
                        }]
                    })
                }
            }), f) return TE8(K, "offscreen", A, _, {
            triggerY: v,
            prevLine: Nz4(q.screen, v),
            nextLine: Nz4(K.screen, v)
        });
        if (Z = kE8(J.diff, A, Z, A.none), G = pN6(J.diff, G, void 0), P) Ez4(J, K, q.screen.height, K.screen.height, A);
        if (_);
        else if (K.cursor.y >= K.screen.height) J.txn((k) => {
            let N = K.cursor.y - k.y;
            if (N > 0) {
                let h = Array(1 + N);
                h[0] = FN6;
                for (let C = 0; C < N; C++) h[1 + C] = VE8;
                return [h, {
                    dx: -k.x,
                    dy: N
                }]
            }
            let R = K.cursor.y - k.y;
            if (R !== 0 || k.x !== K.cursor.x) {
                let h = [FN6];
                return h.push({
                    type: "cursorMove",
                    x: K.cursor.x,
                    y: R
                }), [h, {
                    dx: K.cursor.x - k.x,
                    dy: R
                }]
            }
            return [
                [], {
                    dx: 0,
                    dy: 0
                }
            ]
        });
        else wu1(J, K.cursor.x, K.cursor.y);
        let V = performance.now() - Y;
        if (V > 50) {
            let k = K.screen.damage,
                N = k ? `${k.width}x${k.height} at (${k.x},${k.y})` : "none";
            E(`Slow render: ${V.toFixed(1)}ms, screen: ${K.screen.height}x${K.screen.width}, damage: ${N}, changes: ${J.diff.length}`)
        }
        return $.length > 0 ? [...$, ...J.diff] : J.diff
    }
}
// @from(Ln 183724, Col 0)
function pN6(q, K, _) {
    if (K !== _) return q.push({
        type: "hyperlink",
        uri: _ ?? ""
    }), _;
    return K
}
// @from(Ln 183732, Col 0)
function kE8(q, K, _, z) {
    let Y = K.transition(_, z);
    if (Y.length > 0) q.push({
        type: "styleStr",
        str: Y
    });
    return z
}
// @from(Ln 183741, Col 0)
function Nz4(q, K) {
    let _ = "";
    for (let z = 0; z < q.width; z++) _ += h34(q, z, K) ?? " ";
    return _.trimEnd()
}
// @from(Ln 183747, Col 0)
function TE8(q, K, _, z, Y) {
    let A = new ju1({
        x: 0,
        y: 0
    }, q.viewport.width);
    return Dx_(A, q, _), [{
        type: "clearTerminal",
        reason: K,
        altScreen: z,
        debug: Y
    }, ...A.diff]
}
// @from(Ln 183760, Col 0)
function Dx_(q, K, _) {
    Ez4(q, K, 0, K.screen.height, _)
}
// @from(Ln 183764, Col 0)
function Ez4(q, K, _, z, Y) {
    let A = Y.none,
        O = void 0,
        w = -1,
        {
            width: $,
            cells: j,
            charPool: H,
            hyperlinkPool: J
        } = K.screen,
        X = _ * $;
    for (let M = _; M < z; M += 1) {
        if (q.cursor.y < M) {
            let P = M - q.cursor.y;
            q.txn((W) => {
                let D = Array(1 + P);
                D[0] = FN6;
                for (let Z = 0; Z < P; Z++) D[1 + Z] = VE8;
                return [D, {
                    dx: -W.x,
                    dy: P
                }]
            })
        }
        w = -1;
        for (let P = 0; P < $; P += 1, X += 1) {
            let W = L34(j, H, J, X, w);
            if (!W) continue;
            wu1(q, P, M);
            let D = W.hyperlink;
            O = pN6(q.diff, O, D);
            let Z = Y.transition(A, W.styleId);
            if (yz4(q, W, Z)) A = W.styleId, w = W.styleId
        }
        A = kE8(q.diff, Y, A, Y.none), O = pN6(q.diff, O, void 0), q.txn((P) => [
            [FN6, VE8], {
                dx: -P.x,
                dy: 1
            }
        ])
    }
    return kE8(q.diff, Y, A, Y.none), pN6(q.diff, O, void 0), q
}
// @from(Ln 183808, Col 0)
function yz4(q, K, _) {
    let z = K.width === 1 ? 2 : 1,
        Y = q.cursor.x,
        A = q.viewportWidth;
    if (z === 2 && Y < A) {
        let $ = K.char.length > 2 ? A : A + 1;
        if (Y + 2 >= $) return !1
    }
    let O = q.diff;
    if (_.length > 0) O.push({
        type: "styleStr",
        str: _
    });
    let w = z === 2 && Zx_(K.char);
    if (w && Y + 1 < A) O.push({
        type: "cursorTo",
        col: Y + 2
    }), O.push({
        type: "stdout",
        content: " "
    }), O.push({
        type: "cursorTo",
        col: Y + 1
    });
    if (O.push({
            type: "stdout",
            content: K.char
        }), w) O.push({
        type: "cursorTo",
        col: Y + z + 1
    });
    if (Y >= A) q.cursor.x = z, q.cursor.y++;
    else q.cursor.x = Y + z;
    return !0
}
// @from(Ln 183844, Col 0)
function wu1(q, K, _) {
    q.txn((z) => {
        let Y = K - z.x,
            A = _ - z.y;
        if (z.x >= q.viewportWidth) return [
            [FN6, {
                type: "cursorMove",
                x: K,
                y: A
            }], {
                dx: Y,
                dy: A
            }
        ];
        if (A !== 0) return [
            [FN6, {
                type: "cursorMove",
                x: K,
                y: A
            }], {
                dx: Y,
                dy: A
            }
        ];
        return [
            [{
                type: "cursorMove",
                x: Y,
                y: A
            }], {
                dx: Y,
                dy: A
            }
        ]
    })
}
// @from(Ln 183881, Col 0)
function Zx_(q) {
    let K = q.codePointAt(0);
    if (K === void 0) return !1;
    if (K >= 129648 && K <= 129791 || K >= 129792 && K <= 130047) return !0;
    if (q.length >= 2) {
        for (let _ = 0; _ < q.length; _++)
            if (q.charCodeAt(_) === 65039) return !0
    }
    return !1
}
// @from(Ln 183891, Col 0)
class ju1 {
    viewportWidth;
    cursor;
    diff = [];
    constructor(q, K) {
        this.viewportWidth = K;
        this.cursor = {
            ...q
        }
    }
    txn(q) {
        let [K, _] = q(this.cursor);
        for (let z of K) this.diff.push(z);
        this.cursor.x += _.dx, this.cursor.y += _.dy
    }
}
// @from(Ln 183907, Col 4)
FN6
// @from(Ln 183907, Col 9)
VE8
// @from(Ln 183908, Col 4)
Lz4 = L(() => {
    vN6();
    K8();
    Xd();
    GI();
    HX();
    FN6 = {
        type: "carriageReturn"
    }, VE8 = {
        type: "stdout",
        content: `
`
    }
})
// @from(Ln 183923, Col 0)
function Hu1(q) {
    if (q.length <= 1) return q;
    let K = [],
        _ = 0;
    for (let z of q) {
        let Y = z.type;
        if (Y === "stdout") {
            if (z.content === "") continue
        } else if (Y === "cursorMove") {
            if (z.x === 0 && z.y === 0) continue
        } else if (Y === "clear") {
            if (z.count === 0) continue
        }
        if (_ > 0) {
            let A = _ - 1,
                O = K[A],
                w = O.type;
            if (Y === "cursorMove" && w === "cursorMove") {
                K[A] = {
                    type: "cursorMove",
                    x: O.x + z.x,
                    y: O.y + z.y
                };
                continue
            }
            if (Y === "cursorTo" && w === "cursorTo") {
                K[A] = z;
                continue
            }
            if (Y === "styleStr" && w === "styleStr") {
                K[A] = {
                    type: "styleStr",
                    str: O.str + z.str
                };
                continue
            }
            if (Y === "hyperlink" && w === "hyperlink" && z.uri === O.uri) continue;
            if (Y === "cursorShow" && w === "cursorHide" || Y === "cursorHide" && w === "cursorShow") {
                K.pop(), _--;
                continue
            }
        }
        K.push(z), _++
    }
    return K
}
// @from(Ln 183969, Col 4)
hz4 = p((Ju1, Xu1) => {
    (function(q, K) {
        typeof Ju1 === "object" && typeof Xu1 < "u" ? Xu1.exports = K() : typeof define === "function" && define.amd ? define(K) : (q = typeof globalThis < "u" ? globalThis : q || self, q.bidi_js = K())
    })(Ju1, function() {
        function q() {
            var K = function(_) {
                var z = {
                        R: "13k,1a,2,3,3,2+1j,ch+16,a+1,5+2,2+n,5,a,4,6+16,4+3,h+1b,4mo,179q,2+9,2+11,2i9+7y,2+68,4,3+4,5+13,4+3,2+4k,3+29,8+cf,1t+7z,w+17,3+3m,1t+3z,16o1+5r,8+30,8+mc,29+1r,29+4v,75+73",
                        EN: "1c+9,3d+1,6,187+9,513,4+5,7+9,sf+j,175h+9,qw+q,161f+1d,4xt+a,25i+9",
                        ES: "17,2,6dp+1,f+1,av,16vr,mx+1,4o,2",
                        ET: "z+2,3h+3,b+1,ym,3e+1,2o,p4+1,8,6u,7c,g6,1wc,1n9+4,30+1b,2n,6d,qhx+1,h0m,a+1,49+2,63+1,4+1,6bb+3,12jj",
                        AN: "16o+5,2j+9,2+1,35,ed,1ff2+9,87+u",
                        CS: "18,2+1,b,2u,12k,55v,l,17v0,2,3,53,2+1,b",
                        B: "a,3,f+2,2v,690",
                        S: "9,2,k",
                        WS: "c,k,4f4,1vk+a,u,1j,335",
                        ON: "x+1,4+4,h+5,r+5,r+3,z,5+3,2+1,2+1,5,2+2,3+4,o,w,ci+1,8+d,3+d,6+8,2+g,39+1,9,6+1,2,33,b8,3+1,3c+1,7+1,5r,b,7h+3,sa+5,2,3i+6,jg+3,ur+9,2v,ij+1,9g+9,7+a,8m,4+1,49+x,14u,2+2,c+2,e+2,e+2,e+1,i+n,e+e,2+p,u+2,e+2,36+1,2+3,2+1,b,2+2,6+5,2,2,2,h+1,5+4,6+3,3+f,16+2,5+3l,3+81,1y+p,2+40,q+a,m+13,2r+ch,2+9e,75+hf,3+v,2+2w,6e+5,f+6,75+2a,1a+p,2+2g,d+5x,r+b,6+3,4+o,g,6+1,6+2,2k+1,4,2j,5h+z,1m+1,1e+f,t+2,1f+e,d+3,4o+3,2s+1,w,535+1r,h3l+1i,93+2,2s,b+1,3l+x,2v,4g+3,21+3,kz+1,g5v+1,5a,j+9,n+v,2,3,2+8,2+1,3+2,2,3,46+1,4+4,h+5,r+5,r+a,3h+2,4+6,b+4,78,1r+24,4+c,4,1hb,ey+6,103+j,16j+c,1ux+7,5+g,fsh,jdq+1t,4,57+2e,p1,1m,1m,1m,1m,4kt+1,7j+17,5+2r,d+e,3+e,2+e,2+10,m+4,w,1n+5,1q,4z+5,4b+rb,9+c,4+c,4+37,d+2g,8+b,l+b,5+1j,9+9,7+13,9+t,3+1,27+3c,2+29,2+3q,d+d,3+4,4+2,6+6,a+o,8+6,a+2,e+6,16+42,2+1i",
                        BN: "0+8,6+d,2s+5,2+p,e,4m9,1kt+2,2b+5,5+5,17q9+v,7k,6p+8,6+1,119d+3,440+7,96s+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+1,1ekf+75,6p+2rz,1ben+1,1ekf+1,1ekf+1",
                        NSM: "lc+33,7o+6,7c+18,2,2+1,2+1,2,21+a,1d+k,h,2u+6,3+5,3+1,2+3,10,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,g+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+g,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,k1+w,2db+2,3y,2p+v,ff+3,30+1,n9x+3,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,r2,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+5,3+1,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2d+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,f0c+4,1o+6,t5,1s+3,2a,f5l+1,43t+2,i+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,gzhy+6n",
                        AL: "16w,3,2,e+1b,z+2,2+2s,g+1,8+1,b+m,2+t,s+2i,c+e,4h+f,1d+1e,1bwe+dp,3+3z,x+c,2+1,35+3y,2rm+z,5+7,b+5,dt+l,c+u,17nl+27,1t+27,4x+6n,3+d",
                        LRO: "6ct",
                        RLO: "6cu",
                        LRE: "6cq",
                        RLE: "6cr",
                        PDF: "6cs",
                        LRI: "6ee",
                        RLI: "6ef",
                        FSI: "6eg",
                        PDI: "6eh"
                    },
                    Y = {},
                    A = {};
                Y.L = 1, A[1] = "L", Object.keys(z).forEach(function(f6, G6) {
                    Y[f6] = 1 << G6 + 1, A[Y[f6]] = f6
                }), Object.freeze(Y);
                var O = Y.LRI | Y.RLI | Y.FSI,
                    w = Y.L | Y.R | Y.AL,
                    $ = Y.B | Y.S | Y.WS | Y.ON | Y.FSI | Y.LRI | Y.RLI | Y.PDI,
                    j = Y.BN | Y.RLE | Y.LRE | Y.RLO | Y.LRO | Y.PDF,
                    H = Y.S | Y.WS | Y.B | O | Y.PDI | j,
                    J = null;

                function X() {
                    if (!J) {
                        J = new Map;
                        var f6 = function(k6) {
                            if (z.hasOwnProperty(k6)) {
                                var T6 = 0;
                                z[k6].split(",").forEach(function(v6) {
                                    var L6 = v6.split("+"),
                                        y6 = L6[0],
                                        c6 = L6[1];
                                    y6 = parseInt(y6, 36), c6 = c6 ? parseInt(c6, 36) : 0, J.set(T6 += y6, Y[k6]);
                                    for (var Z8 = 0; Z8 < c6; Z8++) J.set(++T6, Y[k6])
                                })
                            }
                        };
                        for (var G6 in z) f6(G6)
                    }
                }

                function M(f6) {
                    return X(), J.get(f6.codePointAt(0)) || Y.L
                }

                function P(f6) {
                    return A[M(f6)]
                }
                var W = {
                    pairs: "14>1,1e>2,u>2,2wt>1,1>1,1ge>1,1wp>1,1j>1,f>1,hm>1,1>1,u>1,u6>1,1>1,+5,28>1,w>1,1>1,+3,b8>1,1>1,+3,1>3,-1>-1,3>1,1>1,+2,1s>1,1>1,x>1,th>1,1>1,+2,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,4q>1,1e>2,u>2,2>1,+1",
                    canonical: "6f1>-6dx,6dy>-6dx,6ec>-6ed,6ee>-6ed,6ww>2jj,-2ji>2jj,14r4>-1e7l,1e7m>-1e7l,1e7m>-1e5c,1e5d>-1e5b,1e5c>-14qx,14qy>-14qx,14vn>-1ecg,1ech>-1ecg,1edu>-1ecg,1eci>-1ecg,1eda>-1ecg,1eci>-1ecg,1eci>-168q,168r>-168q,168s>-14ye,14yf>-14ye"
                };

                function D(f6, G6) {
                    var k6 = 36,
                        T6 = 0,
                        v6 = new Map,
                        L6 = G6 && new Map,
                        y6;
                    return f6.split(",").forEach(function c6(Z8) {
                        if (Z8.indexOf("+") !== -1)
                            for (var N8 = +Z8; N8--;) c6(y6);
                        else {
                            y6 = Z8;
                            var R6 = Z8.split(">"),
                                p6 = R6[0],
                                q8 = R6[1];
                            p6 = String.fromCodePoint(T6 += parseInt(p6, k6)), q8 = String.fromCodePoint(T6 += parseInt(q8, k6)), v6.set(p6, q8), G6 && L6.set(q8, p6)
                        }
                    }), {
                        map: v6,
                        reverseMap: L6
                    }
                }
                var Z, G, f;

                function v() {
                    if (!Z) {
                        var f6 = D(W.pairs, !0),
                            G6 = f6.map,
                            k6 = f6.reverseMap;
                        Z = G6, G = k6, f = D(W.canonical, !1).map
                    }
                }

                function V(f6) {
                    return v(), Z.get(f6) || null
                }

                function k(f6) {
                    return v(), G.get(f6) || null
                }

                function N(f6) {
                    return v(), f.get(f6) || null
                }
                var {
                    L: R,
                    R: h,
                    EN: C,
                    ES: x,
                    ET: B,
                    AN: m,
                    CS: S,
                    B: F,
                    S: U,
                    ON: g,
                    BN: c,
                    NSM: n,
                    AL: l,
                    LRO: z6,
                    RLO: A6,
                    LRE: e,
                    RLE: i,
                    PDF: O6,
                    LRI: J6,
                    RLI: $6,
                    FSI: H6,
                    PDI: q6
                } = Y;

                function o(f6, G6) {
                    var k6 = 125,
                        T6 = new Uint32Array(f6.length);
                    for (var v6 = 0; v6 < f6.length; v6++) T6[v6] = M(f6[v6]);
                    var L6 = new Map;

                    function y6(_K, r4) {
                        var d5 = T6[_K];
                        if (T6[_K] = r4, L6.set(d5, L6.get(d5) - 1), d5 & $) L6.set($, L6.get($) - 1);
                        if (L6.set(r4, (L6.get(r4) || 0) + 1), r4 & $) L6.set($, (L6.get($) || 0) + 1)
                    }
                    var c6 = new Uint8Array(f6.length),
                        Z8 = new Map,
                        N8 = [],
                        R6 = null;
                    for (var p6 = 0; p6 < f6.length; p6++) {
                        if (!R6) N8.push(R6 = {
                            start: p6,
                            end: f6.length - 1,
                            level: G6 === "rtl" ? 1 : G6 === "ltr" ? 0 : cY(p6, !1)
                        });
                        if (T6[p6] & F) R6.end = p6, R6 = null
                    }
                    var q8 = i | e | A6 | z6 | O | q6 | O6 | F,
                        L8 = function(_K) {
                            return _K + (_K & 1 ? 1 : 2)
                        },
                        w8 = function(_K) {
                            return _K + (_K & 1 ? 2 : 1)
                        };
                    for (var x8 = 0; x8 < N8.length; x8++) {
                        R6 = N8[x8];
                        var a6 = [{
                                _level: R6.level,
                                _override: 0,
                                _isolate: 0
                            }],
                            D8 = void 0,
                            Q6 = 0,
                            W8 = 0,
                            G8 = 0;
                        L6.clear();
                        for (var s6 = R6.start; s6 <= R6.end; s6++) {
                            var u6 = T6[s6];
                            if (D8 = a6[a6.length - 1], L6.set(u6, (L6.get(u6) || 0) + 1), u6 & $) L6.set($, (L6.get($) || 0) + 1);
                            if (u6 & q8) {
                                if (u6 & (i | e)) {
                                    c6[s6] = D8._level;
                                    var h6 = (u6 === i ? w8 : L8)(D8._level);
                                    if (h6 <= k6 && !Q6 && !W8) a6.push({
                                        _level: h6,
                                        _override: 0,
                                        _isolate: 0
                                    });
                                    else if (!Q6) W8++
                                } else if (u6 & (A6 | z6)) {
                                    c6[s6] = D8._level;
                                    var _8 = (u6 === A6 ? w8 : L8)(D8._level);
                                    if (_8 <= k6 && !Q6 && !W8) a6.push({
                                        _level: _8,
                                        _override: u6 & A6 ? h : R,
                                        _isolate: 0
                                    });
                                    else if (!Q6) W8++
                                } else if (u6 & O) {
                                    if (u6 & H6) u6 = cY(s6 + 1, !0) === 1 ? $6 : J6;
                                    if (c6[s6] = D8._level, D8._override) y6(s6, D8._override);
                                    var R8 = (u6 === $6 ? w8 : L8)(D8._level);
                                    if (R8 <= k6 && Q6 === 0 && W8 === 0) G8++, a6.push({
                                        _level: R8,
                                        _override: 0,
                                        _isolate: 1,
                                        _isolInitIndex: s6
                                    });
                                    else Q6++
                                } else if (u6 & q6) {
                                    if (Q6 > 0) Q6--;
                                    else if (G8 > 0) {
                                        W8 = 0;
                                        while (!a6[a6.length - 1]._isolate) a6.pop();
                                        var x6 = a6[a6.length - 1]._isolInitIndex;
                                        if (x6 != null) Z8.set(x6, s6), Z8.set(s6, x6);
                                        a6.pop(), G8--
                                    }
                                    if (D8 = a6[a6.length - 1], c6[s6] = D8._level, D8._override) y6(s6, D8._override)
                                } else if (u6 & O6) {
                                    if (Q6 === 0) {
                                        if (W8 > 0) W8--;
                                        else if (!D8._isolate && a6.length > 1) a6.pop(), D8 = a6[a6.length - 1]
                                    }
                                    c6[s6] = D8._level
                                } else if (u6 & F) c6[s6] = R6.level
                            } else if (c6[s6] = D8._level, D8._override && u6 !== c) y6(s6, D8._override)
                        }
                        var i6 = [],
                            v8 = null;
                        for (var f1 = R6.start; f1 <= R6.end; f1++) {
                            var g8 = T6[f1];
                            if (!(g8 & j)) {
                                var w6 = c6[f1],
                                    D6 = g8 & O,
                                    U6 = g8 === q6;
                                if (v8 && w6 === v8._level) v8._end = f1, v8._endsWithIsolInit = D6;
                                else i6.push(v8 = {
                                    _start: f1,
                                    _end: f1,
                                    _level: w6,
                                    _startsWithPDI: U6,
                                    _endsWithIsolInit: D6
                                })
                            }
                        }
                        var F6 = [];
                        for (var z8 = 0; z8 < i6.length; z8++) {
                            var l6 = i6[z8];
                            if (!l6._startsWithPDI || l6._startsWithPDI && !Z8.has(l6._start)) {
                                var j8 = [v8 = l6];
                                for (var f8 = void 0; v8 && v8._endsWithIsolInit && (f8 = Z8.get(v8._end)) != null;)
                                    for (var p8 = z8 + 1; p8 < i6.length; p8++)
                                        if (i6[p8]._start === f8) {
                                            j8.push(v8 = i6[p8]);
                                            break
                                        } var o8 = [];
                                for (var n1 = 0; n1 < j8.length; n1++) {
                                    var c1 = j8[n1];
                                    for (var dq = c1._start; dq <= c1._end; dq++) o8.push(dq)
                                }
                                var uq = c6[o8[0]],
                                    h4 = R6.level;
                                for (var cq = o8[0] - 1; cq >= 0; cq--)
                                    if (!(T6[cq] & j)) {
                                        h4 = c6[cq];
                                        break
                                    } var C1 = o8[o8.length - 1],
                                    W7 = c6[C1],
                                    $4 = R6.level;
                                if (!(T6[C1] & O)) {
                                    for (var t4 = C1 + 1; t4 <= R6.end; t4++)
                                        if (!(T6[t4] & j)) {
                                            $4 = c6[t4];
                                            break
                                        }
                                }
                                F6.push({
                                    _seqIndices: o8,
                                    _sosType: Math.max(h4, uq) % 2 ? h : R,
                                    _eosType: Math.max($4, W7) % 2 ? h : R
                                })
                            }
                        }
                        for (var x4 = 0; x4 < F6.length; x4++) {
                            var DK = F6[x4],
                                _q = DK._seqIndices,
                                QY = DK._sosType,
                                vz = DK._eosType,
                                JY = c6[_q[0]] & 1 ? h : R;
                            if (L6.get(n))
                                for (var U3 = 0; U3 < _q.length; U3++) {
                                    var DA = _q[U3];
                                    if (T6[DA] & n) {
                                        var U9 = QY;
                                        for (var BH = U3 - 1; BH >= 0; BH--)
                                            if (!(T6[_q[BH]] & j)) {
                                                U9 = T6[_q[BH]];
                                                break
                                            } y6(DA, U9 & (O | q6) ? g : U9)
                                    }
                                }
                            if (L6.get(C))
                                for (var gj = 0; gj < _q.length; gj++) {
                                    var FA = _q[gj];
                                    if (T6[FA] & C)
                                        for (var UG = gj - 1; UG >= -1; UG--) {
                                            var QG = UG === -1 ? QY : T6[_q[UG]];
                                            if (QG & w) {
                                                if (QG === l) y6(FA, m);
                                                break
                                            }
                                        }
                                }
                            if (L6.get(l))
                                for (var XY = 0; XY < _q.length; XY++) {
                                    var UX = _q[XY];
                                    if (T6[UX] & l) y6(UX, h)
                                }
                            if (L6.get(x) || L6.get(S))
                                for (var gA = 1; gA < _q.length - 1; gA++) {
                                    var ZA = _q[gA];
                                    if (T6[ZA] & (x | S)) {
                                        var k4 = 0,
                                            fA = 0;
                                        for (var MY = gA - 1; MY >= 0; MY--)
                                            if (k4 = T6[_q[MY]], !(k4 & j)) break;
                                        for (var UA = gA + 1; UA < _q.length; UA++)
                                            if (fA = T6[_q[UA]], !(fA & j)) break;
                                        if (k4 === fA && (T6[ZA] === x ? k4 === C : k4 & (C | m))) y6(ZA, k4)
                                    }
                                }
                            if (L6.get(C))
                                for (var PY = 0; PY < _q.length; PY++) {
                                    var Q9 = _q[PY];
                                    if (T6[Q9] & C) {
                                        for (var ww = PY - 1; ww >= 0 && T6[_q[ww]] & (B | j); ww--) y6(_q[ww], C);
                                        for (PY++; PY < _q.length && T6[_q[PY]] & (B | j | C); PY++)
                                            if (T6[_q[PY]] !== C) y6(_q[PY], C)
                                    }
                                }
                            if (L6.get(B) || L6.get(x) || L6.get(S))
                                for (var gw = 0; gw < _q.length; gw++) {
                                    var QJ = _q[gw];
                                    if (T6[QJ] & (B | x | S)) {
                                        y6(QJ, g);
                                        for (var h0 = gw - 1; h0 >= 0 && T6[_q[h0]] & j; h0--) y6(_q[h0], g);
                                        for (var $$ = gw + 1; $$ < _q.length && T6[_q[$$]] & j; $$++) y6(_q[$$], g)
                                    }
                                }
                            if (L6.get(C))
                                for (var j$ = 0, a$ = QY; j$ < _q.length; j$++) {
                                    var dJ = _q[j$],
                                        dY = T6[dJ];
                                    if (dY & C) {
                                        if (a$ === R) y6(dJ, R)
                                    } else if (dY & w) a$ = dY
                                }
                            if (L6.get($)) {
                                var V2 = h | C | m,
                                    F1 = V2 | R,
                                    Mq = [];
                                {
                                    var p4 = [];
                                    for (var Gq = 0; Gq < _q.length; Gq++)
                                        if (T6[_q[Gq]] & $) {
                                            var P4 = f6[_q[Gq]],
                                                Z3 = void 0;
                                            if (V(P4) !== null)
                                                if (p4.length < 63) p4.push({
                                                    char: P4,
                                                    seqIndex: Gq
                                                });
                                                else break;
                                            else if ((Z3 = k(P4)) !== null)
                                                for (var Q5 = p4.length - 1; Q5 >= 0; Q5--) {
                                                    var Q3 = p4[Q5].char;
                                                    if (Q3 === Z3 || Q3 === k(N(P4)) || V(N(Q3)) === P4) {
                                                        Mq.push([p4[Q5].seqIndex, Gq]), p4.length = Q5;
                                                        break
                                                    }
                                                }
                                        } Mq.sort(function(_K, r4) {
                                        return _K[0] - r4[0]
                                    })
                                }
                                for (var e4 = 0; e4 < Mq.length; e4++) {
                                    var T5 = Mq[e4],
                                        i4 = T5[0],
                                        h9 = T5[1],
                                        wz = !1,
                                        WY = 0;
                                    for (var cJ = i4 + 1; cJ < h9; cJ++) {
                                        var JO = _q[cJ];
                                        if (T6[JO] & F1) {
                                            wz = !0;
                                            var pH = T6[JO] & V2 ? h : R;
                                            if (pH === JY) {
                                                WY = pH;
                                                break
                                            }
                                        }
                                    }
                                    if (wz && !WY) {
                                        WY = QY;
                                        for (var Uw = i4 - 1; Uw >= 0; Uw--) {
                                            var H$ = _q[Uw];
                                            if (T6[H$] & F1) {
                                                var WW = T6[H$] & V2 ? h : R;
                                                if (WW !== JY) WY = WW;
                                                else WY = JY;
                                                break
                                            }
                                        }
                                    }
                                    if (WY) {
                                        if (T6[_q[i4]] = T6[_q[h9]] = WY, WY !== JY) {
                                            for (var VZ = i4 + 1; VZ < _q.length; VZ++)
                                                if (!(T6[_q[VZ]] & j)) {
                                                    if (M(f6[_q[VZ]]) & n) T6[_q[VZ]] = WY;
                                                    break
                                                }
                                        }
                                        if (WY !== JY) {
                                            for (var nM = h9 + 1; nM < _q.length; nM++)
                                                if (!(T6[_q[nM]] & j)) {
                                                    if (M(f6[_q[nM]]) & n) T6[_q[nM]] = WY;
                                                    break
                                                }
                                        }
                                    }
                                }
                                for (var s$ = 0; s$ < _q.length; s$++)
                                    if (T6[_q[s$]] & $) {
                                        var NN = s$,
                                            kZ = s$,
                                            nz = QY;
                                        for (var J$ = s$ - 1; J$ >= 0; J$--)
                                            if (T6[_q[J$]] & j) NN = J$;
                                            else {
                                                nz = T6[_q[J$]] & V2 ? h : R;
                                                break
                                            } var KC = vz;
                                        for (var lJ = s$ + 1; lJ < _q.length; lJ++)
                                            if (T6[_q[lJ]] & ($ | j)) kZ = lJ;
                                            else {
                                                KC = T6[_q[lJ]] & V2 ? h : R;
                                                break
                                            } for (var nJ = NN; nJ <= kZ; nJ++) T6[_q[nJ]] = nz === KC ? nz : JY;
                                        s$ = kZ
                                    }
                            }
                        }
                        for (var DY = R6.start; DY <= R6.end; DY++) {
                            var LL = c6[DY],
                                NZ = T6[DY];
                            if (LL & 1) {
                                if (NZ & (R | C | m)) c6[DY]++
                            } else if (NZ & h) c6[DY]++;
                            else if (NZ & (m | C)) c6[DY] += 2;
                            if (NZ & j) c6[DY] = DY === 0 ? R6.level : c6[DY - 1];
                            if (DY === R6.end || M(f6[DY]) & (U | F))
                                for (var QX = DY; QX >= 0 && M(f6[QX]) & H; QX--) c6[QX] = R6.level
                        }
                    }
                    return {
                        levels: c6,
                        paragraphs: N8
                    };

                    function cY(_K, r4) {
                        for (var d5 = _K; d5 < f6.length; d5++) {
                            var GA = T6[d5];
                            if (GA & (h | l)) return 1;
                            if (GA & (F | R) || r4 && GA === q6) return 0;
                            if (GA & O) {
                                var cK = hL(d5);
                                d5 = cK === -1 ? f6.length : cK
                            }
                        }
                        return 0
                    }

                    function hL(_K) {
                        var r4 = 1;
                        for (var d5 = _K + 1; d5 < f6.length; d5++) {
                            var GA = T6[d5];
                            if (GA & F) break;
                            if (GA & q6) {
                                if (--r4 === 0) return d5
                            } else if (GA & O) r4++
                        }
                        return -1
                    }
                }
                var _6 = "14>1,j>2,t>2,u>2,1a>g,2v3>1,1>1,1ge>1,1wd>1,b>1,1j>1,f>1,ai>3,-2>3,+1,8>1k0,-1jq>1y7,-1y6>1hf,-1he>1h6,-1h5>1ha,-1h8>1qi,-1pu>1,6>3u,-3s>7,6>1,1>1,f>1,1>1,+2,3>1,1>1,+13,4>1,1>1,6>1eo,-1ee>1,3>1mg,-1me>1mk,-1mj>1mi,-1mg>1mi,-1md>1,1>1,+2,1>10k,-103>1,1>1,4>1,5>1,1>1,+10,3>1,1>8,-7>8,+1,-6>7,+1,a>1,1>1,u>1,u6>1,1>1,+5,26>1,1>1,2>1,2>2,8>1,7>1,4>1,1>1,+5,b8>1,1>1,+3,1>3,-2>1,2>1,1>1,+2,c>1,3>1,1>1,+2,h>1,3>1,a>1,1>1,2>1,3>1,1>1,d>1,f>1,3>1,1a>1,1>1,6>1,7>1,13>1,k>1,1>1,+19,4>1,1>1,+2,2>1,1>1,+18,m>1,a>1,1>1,lk>1,1>1,4>1,2>1,f>1,3>1,1>1,+3,db>1,1>1,+3,3>1,1>1,+2,14qm>1,1>1,+1,6>1,4j>1,j>2,t>2,u>2,2>1,+1",
                    r;

                function t() {
                    if (!r) {
                        var f6 = D(_6, !0),
                            G6 = f6.map,
                            k6 = f6.reverseMap;
                        k6.forEach(function(T6, v6) {
                            G6.set(v6, T6)
                        }), r = G6
                    }
                }

                function Y6(f6) {
                    return t(), r.get(f6) || null
                }

                function X6(f6, G6, k6, T6) {
                    var v6 = f6.length;
                    k6 = Math.max(0, k6 == null ? 0 : +k6), T6 = Math.min(v6 - 1, T6 == null ? v6 - 1 : +T6);
                    var L6 = new Map;
                    for (var y6 = k6; y6 <= T6; y6++)
                        if (G6[y6] & 1) {
                            var c6 = Y6(f6[y6]);
                            if (c6 !== null) L6.set(y6, c6)
                        } return L6
                }

                function M6(f6, G6, k6, T6) {
                    var v6 = f6.length;
                    k6 = Math.max(0, k6 == null ? 0 : +k6), T6 = Math.min(v6 - 1, T6 == null ? v6 - 1 : +T6);
                    var L6 = [];
                    return G6.paragraphs.forEach(function(y6) {
                        var c6 = Math.max(k6, y6.start),
                            Z8 = Math.min(T6, y6.end);
                        if (c6 < Z8) {
                            var N8 = G6.levels.slice(c6, Z8 + 1);
                            for (var R6 = Z8; R6 >= c6 && M(f6[R6]) & H; R6--) N8[R6] = y6.level;
                            var p6 = y6.level,
                                q8 = 1 / 0;
                            for (var L8 = 0; L8 < N8.length; L8++) {
                                var w8 = N8[L8];
                                if (w8 > p6) p6 = w8;
                                if (w8 < q8) q8 = w8 | 1
                            }
                            for (var x8 = p6; x8 >= q8; x8--)
                                for (var a6 = 0; a6 < N8.length; a6++)
                                    if (N8[a6] >= x8) {
                                        var D8 = a6;
                                        while (a6 + 1 < N8.length && N8[a6 + 1] >= x8) a6++;
                                        if (a6 > D8) L6.push([D8 + c6, a6 + c6])
                                    }
                        }
                    }), L6
                }

                function W6(f6, G6, k6, T6) {
                    var v6 = V6(f6, G6, k6, T6),
                        L6 = [].concat(f6);
                    return v6.forEach(function(y6, c6) {
                        L6[c6] = (G6.levels[y6] & 1 ? Y6(f6[y6]) : null) || f6[y6]
                    }), L6.join("")
                }

                function V6(f6, G6, k6, T6) {
                    var v6 = M6(f6, G6, k6, T6),
                        L6 = [];
                    for (var y6 = 0; y6 < f6.length; y6++) L6[y6] = y6;
                    return v6.forEach(function(c6) {
                        var Z8 = c6[0],
                            N8 = c6[1],
                            R6 = L6.slice(Z8, N8 + 1);
                        for (var p6 = R6.length; p6--;) L6[N8 - p6] = R6[p6]
                    }), L6
                }
                return _.closingToOpeningBracket = k, _.getBidiCharType = M, _.getBidiCharTypeName = P, _.getCanonicalBracket = N, _.getEmbeddingLevels = o, _.getMirroredCharacter = Y6, _.getMirroredCharactersMap = X6, _.getReorderSegments = M6, _.getReorderedIndices = V6, _.getReorderedString = W6, _.openingToClosingBracket = V, Object.defineProperty(_, "__esModule", {
                    value: !0
                }), _
            }({});
            return K
        }
        return q
    })
})
// @from(Ln 184557, Col 0)
function fx_() {
    if (Pu1 === void 0) Pu1 = process.platform === "win32" || typeof process.env.WT_SESSION === "string" || process.env.TERM_PROGRAM === "vscode";
    return Pu1
}
// @from(Ln 184562, Col 0)
function Gx_() {
    if (!Mu1) Mu1 = Rz4.default();
    return Mu1
}
// @from(Ln 184567, Col 0)
function Sz4(q) {
    if (!fx_() || q.length === 0) return q;
    let K = q.map(($) => $.value).join("");
    if (!Vx_(K)) return q;
    let _ = Gx_(),
        {
            levels: z
        } = _.getEmbeddingLevels(K, "auto"),
        Y = [],
        A = 0;
    for (let $ = 0; $ < q.length; $++) Y.push(z[A]), A += q[$].value.length;
    let O = [...q],
        w = Math.max(...Y);
    for (let $ = w; $ >= 1; $--) {
        let j = 0;
        while (j < O.length)
            if (Y[j] >= $) {
                let H = j + 1;
                while (H < O.length && Y[H] >= $) H++;
                vx_(O, j, H - 1), Tx_(Y, j, H - 1), j = H
            } else j++
    }
    return O
}
// @from(Ln 184592, Col 0)
function vx_(q, K, _) {
    while (K < _) {
        let z = q[K];
        q[K] = q[_], q[_] = z, K++, _--
    }
}
// @from(Ln 184599, Col 0)
function Tx_(q, K, _) {
    while (K < _) {
        let z = q[K];
        q[K] = q[_], q[_] = z, K++, _--
    }
}
// @from(Ln 184606, Col 0)
function Vx_(q) {
    return /[\u0590-\u05FF\uFB1D-\uFB4F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0780-\u07BF\u0700-\u074F]/u.test(q)
}
// @from(Ln 184609, Col 4)
Rz4
// @from(Ln 184609, Col 9)
Mu1
// @from(Ln 184609, Col 14)
Pu1
// @from(Ln 184610, Col 4)
Cz4 = L(() => {
    Rz4 = K6(hz4(), 1)
})
// @from(Ln 184614, Col 0)
function NE8(q) {
    let K = 0,
        _ = 0;
    while (_ <= q.length) {
        let z = q.indexOf(`
`, _),
            Y = z === -1 ? q.substring(_) : q.substring(_, z);
        if (K = Math.max(K, hN8(Y)), z === -1) break;
        _ = z + 1
    }
    return K
}
// @from(Ln 184626, Col 4)
Wu1 = L(() => {
    FI1()
})
// @from(Ln 184630, Col 0)
function kx_(q, K) {
    if (!q) return K;
    return {
        x1: bz4(q.x1, K.x1),
        x2: Iz4(q.x2, K.x2),
        y1: bz4(q.y1, K.y1),
        y2: Iz4(q.y2, K.y2)
    }
}
// @from(Ln 184640, Col 0)
function bz4(q, K) {
    if (q === void 0) return K;
    if (K === void 0) return q;
    return Math.max(q, K)
}
// @from(Ln 184646, Col 0)
function Iz4(q, K) {
    if (q === void 0) return K;
    if (K === void 0) return q;
    return Math.min(q, K)
}
// @from(Ln 184651, Col 0)
class x$6 {
    width;
    height;
    stylePool;
    screen;
    operations = [];
    charCache = new Map;
    constructor(q) {
        let {
            width: K,
            height: _,
            stylePool: z,
            screen: Y
        } = q;
        this.width = K, this.height = _, this.stylePool = z, this.screen = Y, Tx1(Y, K, _)
    }
    reset(q, K, _) {
        if (this.width = q, this.height = K, this.screen = _, this.operations.length = 0, Tx1(_, q, K), this.charCache.size > 16384) this.charCache.clear()
    }
    blit(q, K, _, z, Y) {
        this.operations.push({
            type: "blit",
            src: q,
            x: K,
            y: _,
            width: z,
            height: Y
        })
    }
    shift(q, K, _) {
        this.operations.push({
            type: "shift",
            top: q,
            bottom: K,
            n: _
        })
    }
    clear(q, K) {
        this.operations.push({
            type: "clear",
            region: q,
            fromAbsolute: K
        })
    }
    noSelect(q) {
        this.operations.push({
            type: "noSelect",
            region: q
        })
    }
    write(q, K, _, z) {
        if (!_) return;
        this.operations.push({
            type: "write",
            x: q,
            y: K,
            text: _,
            softWrap: z
        })
    }
    clip(q) {
        this.operations.push({
            type: "clip",
            clip: q
        })
    }
    unclip() {
        this.operations.push({
            type: "unclip"
        })
    }
    get() {
        let q = this.screen,
            K = this.width,
            _ = this.height,
            z = 0,
            Y = 0,
            A = [];
        for (let $ = 0; $ < this.operations.length; $++) {
            let j = this.operations[$];
            if (j.type !== "clear") continue;
            let {
                x: H,
                y: J,
                width: X,
                height: M
            } = j.region, P = Math.max(0, H), W = Math.max(0, J), D = Math.min(H + X, K), Z = Math.min(J + M, _);
            if (P >= D || W >= Z) continue;
            let G = {
                x: P,
                y: W,
                width: D - P,
                height: Z - W
            };
            if (q.damage = q.damage ? y46(q.damage, G) : G, j.fromAbsolute) A.push({
                rect: G,
                opIndex: $
            })
        }
        let O = [];
        for (let $ = 0; $ < this.operations.length; $++) {
            let j = this.operations[$];
            switch (j.type) {
                case "clear":
                    continue;
                case "clip":
                    O.push(kx_(O.at(-1), j.clip));
                    continue;
                case "unclip":
                    O.pop();
                    continue;
                case "blit": {
                    let {
                        src: H,
                        x: J,
                        y: X,
                        width: M,
                        height: P
                    } = j, W = O.at(-1), D = Math.max(J, W?.x1 ?? 0), Z = Math.max(X, W?.y1 ?? 0), G = Math.min(X + P, _, H.height, W?.y2 ?? 1 / 0), f = Math.min(J + M, K, H.width, W?.x2 ?? 1 / 0);
                    if (D >= f || Z >= G) continue;
                    let v = A.filter((k) => k.opIndex > $);
                    if (v.length === 0) {
                        Vx1(q, H, D, Z, f, G), z += (G - Z) * (f - D);
                        continue
                    }
                    let V = Z;
                    for (let k = Z; k <= G; k++)
                        if (k < G && v.some(({
                                rect: R
                            }) => k >= R.y && k < R.y + R.height && D >= R.x && f <= R.x + R.width) || k === G) {
                            if (k > V) Vx1(q, H, D, V, f, k), z += (k - V) * (f - D);
                            V = k + 1
                        } continue
                }
                case "shift": {
                    aN8(q, j.top, j.bottom, j.n);
                    continue
                }
                case "write": {
                    let {
                        text: H,
                        softWrap: J
                    } = j, {
                        x: X,
                        y: M
                    } = j, P = H.split(`
`), W = 0, D = 0, Z = O.at(-1);
                    if (Z) {
                        let v = typeof Z?.x1 === "number" && typeof Z?.x2 === "number",
                            V = typeof Z?.y1 === "number" && typeof Z?.y2 === "number";
                        if (v) {
                            let k = NE8(H);
                            if (X + k < Z.x1 || X > Z.x2) continue
                        }
                        if (V) {
                            let k = P.length;
                            if (M + k < Z.y1 || M > Z.y2) continue
                        }
                        if (v) {
                            if (P = P.map((k) => {
                                    let N = X < Z.x1 ? Z.x1 - X : 0,
                                        R = N1(k),
                                        h = X + R > Z.x2 ? Z.x2 - X : R,
                                        C = vf(k, N, h);
                                    if (N1(C) > h - N) C = vf(k, N, h - 1);
                                    return C
                                }), X < Z.x1) X = Z.x1
                        }
                        if (V) {
                            let k = M < Z.y1 ? Z.y1 - M : 0,
                                N = P.length,
                                R = M + N > Z.y2 ? Z.y2 - M : N;
                            if (J && k > 0 && J[k] === !0) D = vx1(X + N1(P[k - 1]), X);
                            if (P = P.slice(k, R), W = k, M < Z.y1) M = Z.y1
                        }
                    }
                    let G = q.softWrap,
                        f = 0;
                    for (let v of P) {
                        let V = M + f;
                        if (V >= _) break;
                        let k = yx_(q, v, X, V, K, this.stylePool, this.charCache);
                        if (Y += k - X, J) {
                            let N = J[W + f] === !0;
                            G[V] = N ? D : 0, D = vx1(k, X)
                        }
                        f++
                    }
                    continue
                }
            }
        }
        for (let $ of this.operations)
            if ($.type === "noSelect") {
                let {
                    x: j,
                    y: H,
                    width: J,
                    height: X
                } = $.region;
                I34(q, j, H, J, X)
            } let w = z + Y;
        if (w > 1000 && Y > z) E(`High write ratio: blit=${z}, write=${Y} (${(Y/w*100).toFixed(1)}% writes), screen=${_}x${K}`);
        return q
    }
}
// @from(Ln 184858, Col 0)
function Nx_(q, K) {
    if (q === K) return !0;
    let _ = q.length;
    if (_ !== K.length) return !1;
    if (_ === 0) return !0;
    for (let z = 0; z < _; z++)
        if (q[z].code !== K[z].code) return !1;
    return !0
}
// @from(Ln 184868, Col 0)
function Ex_(q, K) {
    let _ = q.length;
    if (_ === 0) return [];
    let z = [],
        Y = [],
        A = q[0].styles;
    for (let O = 0; O < _; O++) {
        let w = q[O],
            $ = w.styles;
        if (Y.length > 0 && !Nx_($, A)) xz4(Y.join(""), A, K, z), Y.length = 0;
        Y.push(w.value), A = $
    }
    if (Y.length > 0) xz4(Y.join(""), A, K, z);
    return z
}
// @from(Ln 184884, Col 0)
function xz4(q, K, _, z) {
    let Y = S34(K) ?? void 0,
        O = Y !== void 0 || K.some(($) => $.code.length >= L$6.length && $.code.startsWith(L$6)) ? C34(K) : K,
        w = _.intern(O);
    for (let {
            segment: $
        }
        of rH().segment(q)) z.push({
        value: $,
        width: N1($),
        styleId: w,
        hyperlink: Y
    })
}
// @from(Ln 184899, Col 0)
function yx_(q, K, _, z, Y, A, O) {
    let w = O.get(K);
    if (!w) w = Sz4(Ex_(b54(GN6(K)), A)), O.set(K, w);
    let $ = _;
    for (let j = 0; j < w.length; j++) {
        let H = w[j],
            J = H.value.codePointAt(0);
        if (J !== void 0 && J <= 31) {
            if (J === 9) {
                let W = 8 - $ % 8;
                for (let D = 0; D < W && $ < Y; D++) oN8(q, $, z, {
                    char: " ",
                    styleId: A.none,
                    width: 0,
                    hyperlink: void 0
                }), $++
            } else if (J === 27) {
                let P = w[j + 1]?.value,
                    W = P?.codePointAt(0);
                if (P === "(" || P === ")" || P === "*" || P === "+") j += 2;
                else if (P === "[") {
                    j++;
                    while (j < w.length - 1) {
                        j++;
                        let D = w[j]?.value.codePointAt(0);
                        if (D !== void 0 && D >= 64 && D <= 126) break
                    }
                } else if (P === "]" || P === "P" || P === "_" || P === "^" || P === "X") {
                    j++;
                    while (j < w.length - 1) {
                        j++;
                        let D = w[j]?.value;
                        if (D === "\x07") break;
                        if (D === "\x1B") {
                            if (w[j + 1]?.value === "\\") {
                                j++;
                                break
                            }
                        }
                    }
                } else if (W !== void 0 && W >= 48 && W <= 126) j++
            }
            continue
        }
        let X = H.width;
        if (X === 0) continue;
        let M = X >= 2;
        if (M && $ + 2 > Y) {
            oN8(q, $, z, {
                char: " ",
                styleId: A.none,
                width: 3,
                hyperlink: void 0
            }), $++;
            continue
        }
        oN8(q, $, z, {
            char: H.value,
            styleId: H.styleId,
            width: M ? 1 : 0,
            hyperlink: H.hyperlink
        }), $ += M ? 2 : 1
    }
    return $
}
// @from(Ln 184964, Col 4)
EE8 = L(() => {
    vN6();
    K8();
    IZ();
    k$6();
    Cz4();
    y$6();
    Xd();
    n5();
    Wu1()
})
// @from(Ln 184976, Col 0)
function Du1(q, K = 1, _ = {}) {
    let {
        indent: z = " ",
        includeEmptyLines: Y = !1
    } = _;
    if (typeof q !== "string") throw TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof q}\``);
    if (typeof K !== "number") throw TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof K}\``);
    if (K < 0) throw RangeError(`Expected \`count\` to be at least 0, got \`${K}\``);
    if (typeof z !== "string") throw TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof z}\``);
    if (K === 0) return q;
    let A = Y ? /^/gm : /^(?!\s*$)/gm;
    return q.replace(A, z.repeat(K))
}
// @from(Ln 184989, Col 4)
Lx_ = (q) => {
        return q.getComputedWidth() - q.getComputedPadding(0) - q.getComputedPadding(2) - q.getComputedBorder(0) - q.getComputedBorder(2)
    }
// @from(Ln 184992, Col 4)
uz4
// @from(Ln 184993, Col 4)
mz4 = L(() => {
    ZN6();
    uz4 = Lx_
})
// @from(Ln 184997, Col 4)
Bz4 = p((W4w, hx_) => {
    hx_.exports = {
        single: {
            topLeft: "┌",
            top: "─",
            topRight: "┐",
            right: "│",
            bottomRight: "┘",
            bottom: "─",
            bottomLeft: "└",
            left: "│"
        },
        double: {
            topLeft: "╔",
            top: "═",
            topRight: "╗",
            right: "║",
            bottomRight: "╝",
            bottom: "═",
            bottomLeft: "╚",
            left: "║"
        },
        round: {
            topLeft: "╭",
            top: "─",
            topRight: "╮",
            right: "│",
            bottomRight: "╯",
            bottom: "─",
            bottomLeft: "╰",
            left: "│"
        },
        bold: {
            topLeft: "┏",
            top: "━",
            topRight: "┓",
            right: "┃",
            bottomRight: "┛",
            bottom: "━",
            bottomLeft: "┗",
            left: "┃"
        },
        singleDouble: {
            topLeft: "╓",
            top: "─",
            topRight: "╖",
            right: "║",
            bottomRight: "╜",
            bottom: "─",
            bottomLeft: "╙",
            left: "║"
        },
        doubleSingle: {
            topLeft: "╒",
            top: "═",
            topRight: "╕",
            right: "│",
            bottomRight: "╛",
            bottom: "═",
            bottomLeft: "╘",
            left: "│"
        },
        classic: {
            topLeft: "+",
            top: "-",
            topRight: "+",
            right: "|",
            bottomRight: "+",
            bottom: "-",
            bottomLeft: "+",
            left: "|"
        },
        arrow: {
            topLeft: "↘",
            top: "↓",
            topRight: "↙",
            right: "←",
            bottomRight: "↖",
            bottom: "↑",
            bottomLeft: "↗",
            left: "→"
        }
    }
})
// @from(Ln 185081, Col 4)
Fz4 = p((D4w, Zu1) => {
    var pz4 = Bz4();
    Zu1.exports = pz4;
    Zu1.exports.default = pz4
})
// @from(Ln 185087, Col 0)
function gz4(q, K, _, z = 0, Y) {
    let A = N1(K),
        O = q.length;
    if (A >= O - 2) return ["", K.substring(0, O), ""];
    let w;
    if (_ === "center") w = Math.floor((O - A) / 2);
    else if (_ === "start") w = z + 1;
    else w = O - A - z - 1;
    w = Math.max(1, Math.min(w, O - A - 1));
    let $ = q.substring(0, 1) + Y.repeat(w - 1),
        j = Y.repeat(O - w - A - 1) + q.substring(O - 1);
    return [$, K, j]
}
// @from(Ln 185101, Col 0)
function gN6(q, K, _) {
    let z = Ba(q, K);
    if (_) z = Y8.dim(z);
    return z
}
// @from(Ln 185106, Col 4)
Uz4
// @from(Ln 185106, Col 9)
Rx_
// @from(Ln 185106, Col 14)
Sx_ = (q, K, _, z) => {
        if (_.style.borderStyle) {
            let Y = Math.floor(_.yogaNode.getComputedWidth()),
                A = Math.floor(_.yogaNode.getComputedHeight()),
                O = typeof _.style.borderStyle === "string" ? Rx_[_.style.borderStyle] ?? Uz4.default[_.style.borderStyle] : _.style.borderStyle,
                w = _.style.borderTopColor ?? _.style.borderColor,
                $ = _.style.borderBottomColor ?? _.style.borderColor,
                j = _.style.borderLeftColor ?? _.style.borderColor,
                H = _.style.borderRightColor ?? _.style.borderColor,
                J = _.style.borderTopDimColor ?? _.style.borderDimColor,
                X = _.style.borderBottomDimColor ?? _.style.borderDimColor,
                M = _.style.borderLeftDimColor ?? _.style.borderDimColor,
                P = _.style.borderRightDimColor ?? _.style.borderDimColor,
                W = _.style.borderTop !== !1,
                D = _.style.borderBottom !== !1,
                Z = _.style.borderLeft !== !1,
                G = _.style.borderRight !== !1,
                f = Math.max(0, Y - (Z ? 1 : 0) - (G ? 1 : 0)),
                v = W ? (Z ? O.topLeft : "") + O.top.repeat(f) + (G ? O.topRight : "") : "",
                V;
            if (W && _.style.borderText?.position === "top") {
                let [B, m, S] = gz4(v, _.style.borderText.content, _.style.borderText.align, _.style.borderText.offset, O.top);
                V = gN6(B, w, J) + m + gN6(S, w, J)
            } else if (W) V = gN6(v, w, J);
            let k = A;
            if (W) k -= 1;
            if (D) k -= 1;
            k = Math.max(0, k);
            let N = (Ba(O.left, j) + `
`).repeat(k);
            if (M) N = Y8.dim(N);
            let R = (Ba(O.right, H) + `
`).repeat(k);
            if (P) R = Y8.dim(R);
            let h = D ? (Z ? O.bottomLeft : "") + O.bottom.repeat(f) + (G ? O.bottomRight : "") : "",
                C;
            if (D && _.style.borderText?.position === "bottom") {
                let [B, m, S] = gz4(h, _.style.borderText.content, _.style.borderText.align, _.style.borderText.offset, O.bottom);
                C = gN6(B, $, X) + m + gN6(S, $, X)
            } else if (D) C = gN6(h, $, X);
            let x = W ? 1 : 0;
            if (V) z.write(q, K, V);
            if (Z) z.write(q, K + x, N);
            if (G) z.write(q + Y - 1, K + x, R);
            if (C) z.write(q, K + A - 1, C)
        }
    }
// @from(Ln 185153, Col 4)
Qz4
// @from(Ln 185154, Col 4)
dz4 = L(() => {
    Y3();
    G$6();
    n5();
    Uz4 = K6(Fz4(), 1), Rx_ = {
        dashed: {
            top: "╌",
            left: "╎",
            right: "╎",
            bottom: "╌",
            topLeft: " ",
            topRight: " ",
            bottomLeft: " ",
            bottomRight: " "
        },
        quote: {
            top: " ",
            left: "▎",
            right: " ",
            bottom: " ",
            topLeft: " ",
            topRight: " ",
            bottomLeft: " ",
            bottomRight: " "
        }
    };
    Qz4 = Sx_
})
// @from(Ln 185183, Col 0)
function Cx_() {
    return process.env.TERM_PROGRAM === "vscode" || ca()
}
// @from(Ln 185187, Col 0)
function Vu1() {
    UN6 = !1
}
// @from(Ln 185191, Col 0)
function rz4() {
    return UN6
}
// @from(Ln 185195, Col 0)
function oz4() {
    yE8 = null, vu1 = zs6, zs6 = []
}
// @from(Ln 185199, Col 0)
function sz4(q) {
    az4 = q
}
// @from(Ln 185203, Col 0)
function tz4() {
    return yE8
}
// @from(Ln 185207, Col 0)
function ez4() {
    ku1 = null
}
// @from(Ln 185211, Col 0)
function qY4() {
    return ku1
}
// @from(Ln 185215, Col 0)
function KY4() {
    let q = Tu1;
    return Tu1 = null, q
}
// @from(Ln 185220, Col 0)
function Bx_(q, K, _) {
    let z = K > 0 ? 1 : -1,
        Y = Math.abs(K),
        A = 0;
    if (Y > fu1) A += z * (Y - fu1), Y = fu1;
    let O = Y <= Ix_ ? Y : Y < xx_ ? ux_ : mx_;
    A += z * O;
    let w = Y - O,
        $ = Math.max(1, _ - 1),
        j = Math.abs(A);
    if (j > $) {
        let H = j - $;
        return q.pendingScrollDelta = z * (w + H), z * $
    }
    return q.pendingScrollDelta = w > 0 ? z * w : void 0, A
}
// @from(Ln 185237, Col 0)
function px_(q, K, _) {
    let z = Math.abs(K),
        Y = Math.max(1, _ - 1),
        A = Math.min(Y, Math.max(bx_, z * 3 >> 2));
    if (z <= A) return q.pendingScrollDelta = void 0, K;
    let O = K > 0 ? A : -A;
    return q.pendingScrollDelta = K - O, O
}
// @from(Ln 185246, Col 0)
function LE8(q, K) {
    return `${cz4}8;;${K}${lz4}${q}${cz4}8;;${lz4}`
}
// @from(Ln 185250, Col 0)
function Fx_(q) {
    let K = 0;
    for (let Y = 0; Y < q.length; Y++) K += q[Y].text.length;
    let _ = new Uint32Array(K),
        z = 0;
    for (let Y = 0; Y < q.length; Y++) {
        let A = z + q[Y].text.length;
        _.fill(Y, z, A), z = A
    }
    return _
}
// @from(Ln 185262, Col 0)
function gx_(q, K, _, z, Y = !1) {
    let A = q.split(`
`),
        O = [],
        w = 0;
    for (let $ = 0; $ < A.length; $++) {
        let j = A[$];
        if (Y && j.length > 0) {
            let W = /\s/.test(j[0]);
            if (w < z.length && /\s/.test(z[w]) && !W)
                while (w < z.length && /\s/.test(z[w])) w++
        }
        let H = "",
            J = 0,
            X = _[w] ?? 0;
        for (let W = 0; W < j.length; W++) {
            let D = _[w] ?? X;
            if (D !== X) {
                let Z = j.slice(J, W),
                    G = K[X];
                if (G) {
                    let f = XN6(Z, G.styles);
                    if (G.hyperlink) f = LE8(f, G.hyperlink);
                    H += f
                } else H += Z;
                J = W, X = D
            }
            w++
        }
        let M = j.slice(J),
            P = K[X];
        if (P) {
            let W = XN6(M, P.styles);
            if (P.hyperlink) W = LE8(W, P.hyperlink);
            H += W
        } else H += M;
        if (O.push(H), w < z.length && z[w] === "\r") w++;
        if (w < z.length && z[w] === `
`) w++;
        if (Y && $ < A.length - 1) {
            let W = A[$ + 1],
                D = W.length > 0 ? W[0] : null;
            while (w < z.length && /\s/.test(z[w])) {
                if (D !== null && z[w] === D) break;
                w++
            }
        }
    }
    return O.join(`
`)
}
// @from(Ln 185314, Col 0)
function nz4(q, K, _) {
    if (_ !== "wrap" && _ !== "wrap-trim") return {
        wrapped: JR(q, K, _),
        softWrap: void 0
    };
    let z = q.replace(/\r\n?/g, `
`).split(`
`),
        Y = [],
        A = [];
    for (let O of z) {
        let w = JR(O, K, _).split(`
`);
        for (let $ = 0; $ < w.length; $++) Y.push(w[$]), A.push($ > 0)
    }
    return {
        wrapped: Y.join(`
`),
        softWrap: A
    }
}
// @from(Ln 185336, Col 0)
function Ux_(q, K, _) {
    let z = q.childNodes[0]?.yogaNode;
    if (z) {
        let Y = z.getComputedLeft(),
            A = z.getComputedTop();
        if (K = `
`.repeat(A) + Du1(K, Y), _ && A > 0) _.unshift(...Array(A).fill(!1))
    }
    return K
}
// @from(Ln 185347, Col 0)
function hE8(q, K, {
    offsetX: _ = 0,
    offsetY: z = 0,
    prevScreen: Y,
    skipSelfBlit: A = !1,
    inheritedBackgroundColor: O
}) {
    let {
        yogaNode: w
    } = q;
    if (w) {
        if (w.getDisplay() === 1) {
            if (q.dirty) {
                let G = S$.get(q);
                if (G) K.clear({
                    x: Math.floor(G.x),
                    y: Math.floor(G.y),
                    width: Math.floor(G.width),
                    height: Math.floor(G.height)
                }), Nu1(q), UN6 = !0
            }
            return
        }
        let $ = _ + w.getComputedLeft(),
            j = w.getComputedTop(),
            H = z + j,
            J = w.getComputedWidth(),
            X = w.getComputedHeight();
        if (H < 0 && q.style.position === "absolute") H = 0;
        let M = S$.get(q);
        if (!q.dirty && !A && q.pendingScrollDelta === void 0 && M && M.x === $ && M.y === H && M.width === J && M.height === X && Y) {
            let G = Math.floor($),
                f = Math.floor(H),
                v = Math.floor(J),
                V = Math.floor(X);
            if (K.blit(Y, G, f, v, V), q.style.position === "absolute") zs6.push(M);
            _Y4(q, K, Y, G, f, v, V);
            return
        }
        let P = M !== void 0 && (M.x !== $ || M.y !== H || M.width !== J || M.height !== X);
        if (P) UN6 = !0;
        if (M && (q.dirty || P)) K.clear({
            x: Math.floor(M.x),
            y: Math.floor(M.y),
            width: Math.floor(M.width),
            height: Math.floor(M.height)
        }, q.style.position === "absolute");
        let W = ya6.get(q),
            D = W !== void 0;
        if (D) {
            UN6 = !0;
            for (let G of W) K.clear({
                x: Math.floor(G.x),
                y: Math.floor(G.y),
                width: Math.floor(G.width),
                height: Math.floor(G.height)
            });
            ya6.delete(q)
        }
        if (X === 0 && cx_(q, w)) {
            S$.set(q, {
                x: $,
                y: H,
                width: J,
                height: X,
                top: j
            }), q.dirty = !1;
            return
        }
        if (q.nodeName === "ink-raw-ansi") {
            let G = q.attributes.rawText;
            if (G) K.write($, H, G)
        } else if (q.nodeName === "ink-text") {
            let G = RN8(q, O ? {
                    backgroundColor: O
                } : void 0),
                f = G.map((v) => v.text).join("");
            if (f.length > 0) {
                let v = Math.min(uz4(w), K.width - $),
                    V = q.style.textWrap ?? "wrap",
                    k = NE8(f) > v,
                    N, R;
                if (k && G.length === 1) {
                    let h = G[0],
                        C = nz4(f, v, V);
                    R = C.softWrap, N = C.wrapped.split(`
`).map((x) => {
                        let B = XN6(x, h.styles);
                        if (h.hyperlink) B = LE8(B, h.hyperlink);
                        return B
                    }).join(`
`)
                } else if (k) {
                    let h = nz4(f, v, V);
                    R = h.softWrap;
                    let C = Fx_(G);
                    N = gx_(h.wrapped, G, C, f, V === "wrap-trim")
                } else N = G.map((h) => {
                    let C = XN6(h.text, h.styles);
                    if (h.hyperlink) C = LE8(C, h.hyperlink);
                    return C
                }).join("");
                N = Ux_(q, N, R), K.write($, H, N, R)
            }
        } else if (q.nodeName === "ink-box") {
            let G = q.style.backgroundColor ?? O;
            if (q.style.noSelect) {
                let x = Math.floor($),
                    B = q.style.noSelect === "from-left-edge";
                K.noSelect({
                    x: B ? 0 : x,
                    y: Math.floor(H),
                    width: B ? x + Math.floor(J) : Math.floor(J),
                    height: Math.floor(X)
                })
            }
            let f = q.style.overflowX ?? q.style.overflow,
                v = q.style.overflowY ?? q.style.overflow,
                V = f === "hidden" || f === "scroll",
                k = v === "hidden" || v === "scroll",
                N = v === "scroll",
                R = V || k,
                h, C;
            if (R) {
                let x = V ? $ + w.getComputedBorder(0) : void 0,
                    B = V ? $ + w.getComputedWidth() - w.getComputedBorder(2) : void 0;
                h = k ? H + w.getComputedBorder(1) : void 0, C = k ? H + w.getComputedHeight() - w.getComputedBorder(3) : void 0, K.clip({
                    x1: x,
                    x2: B,
                    y1: h,
                    y2: C
                })
            }
            if (N) {
                let x = w.getComputedPadding(1),
                    B = Math.max(0, (C ?? H + X) - (h ?? H) - x - w.getComputedPadding(3)),
                    m = q.childNodes.find((r) => r.yogaNode),
                    S = m?.yogaNode,
                    F = S?.getComputedHeight() ?? 0,
                    U = q.scrollHeight ?? F,
                    g = q.scrollViewportHeight ?? B;
                q.scrollHeight = F, q.scrollViewportHeight = B, q.scrollViewportTop = (h ?? H) + x;
                let c = Math.max(0, F - B);
                if (q.scrollAnchor) {
                    let r = q.scrollAnchor.el.yogaNode?.getComputedTop();
                    if (r != null) q.scrollTop = r + q.scrollAnchor.offset, q.pendingScrollDelta = void 0;
                    q.scrollAnchor = void 0
                }
                let n = q.scrollTop ?? 0,
                    l = q.stickyScroll ?? Boolean(q.attributes.stickyScroll),
                    z6 = Math.max(0, U - g),
                    A6 = F >= U;
                if ((l || A6 && n >= z6) && (q.pendingScrollDelta ?? 0) >= 0) {
                    if (q.scrollTop = c, q.pendingScrollDelta = void 0, q.stickyScroll === !1 && n >= z6) q.stickyScroll = !0
                }
                let i = (q.scrollTop ?? 0) - n;
                if (i > 0) {
                    let r = q.scrollViewportTop ?? 0;
                    Tu1 = {
                        delta: i,
                        viewportTop: r,
                        viewportBottom: r + B - 1
                    }
                }
                let O6 = q.scrollTop ?? 0,
                    J6 = q.pendingScrollDelta,
                    $6 = q.scrollClampMin,
                    H6 = q.scrollClampMax,
                    q6 = $6 !== void 0 && H6 !== void 0;
                if (J6 !== void 0 && J6 !== 0) {
                    let t = q6 && (J6 < 0 && O6 < $6 || J6 > 0 && O6 > H6) ? Math.min(4, B >> 3) : B;
                    O6 += Cx_() ? Bx_(q, J6, t) : px_(q, J6, t)
                } else if (J6 === 0) q.pendingScrollDelta = void 0;
                let o = Math.max(0, Math.min(O6, c)),
                    _6 = q6 ? Math.max($6, Math.min(o, H6)) : o;
                if (q.scrollTop = o, o !== O6) q.pendingScrollDelta = void 0;
                if (q.pendingScrollDelta !== void 0) ku1 = q;
                if (o = _6, m && S) {
                    let r = $ + S.getComputedLeft(),
                        t = H + S.getComputedTop() - o,
                        Y6 = S$.get(m),
                        X6 = null;
                    if (Y6 && Y6.y !== t) {
                        let k6 = Y6.y - t,
                            T6 = Math.floor(H + S.getComputedTop()),
                            v6 = T6 + B - 1;
                        if (M?.y === H && M.height === X && B > 0 && Math.abs(k6) < B) X6 = {
                            top: T6,
                            bottom: v6,
                            delta: k6
                        }, yE8 = X6;
                        else UN6 = !0
                    }
                    let M6 = S.getComputedHeight(),
                        W6 = Y6?.height ?? M6,
                        V6 = M6 - W6,
                        f6 = !X6 || V6 === 0 || X6.delta > 0 && V6 === X6.delta,
                        G6 = Y && f6 && !az4;
                    if (X6 && !G6) yE8 = null;
                    if (X6 && G6) {
                        let {
                            top: k6,
                            bottom: T6,
                            delta: v6
                        } = X6, L6 = Math.floor(J);
                        K.blit(Y, Math.floor($), k6, L6, T6 - k6 + 1), K.shift(k6, T6, v6);
                        let y6 = v6 > 0 ? T6 - v6 + 1 : k6,
                            c6 = v6 > 0 ? T6 : k6 - v6 - 1;
                        K.clear({
                            x: Math.floor($),
                            y: y6,
                            width: L6,
                            height: c6 - y6 + 1
                        }), K.clip({
                            x1: void 0,
                            x2: void 0,
                            y1: y6,
                            y2: c6 + 1
                        });
                        let Z8 = m.dirty ? new Set(m.childNodes.filter((R6) => R6.dirty)) : null;
                        if (Gu1(m, K, r, t, D, void 0, y6 - t, c6 + 1 - t, G, !0), K.unclip(), Z8) {
                            let R6 = y6 - t,
                                p6 = c6 + 1 - t,
                                q8 = " ".repeat(L6),
                                L8 = 0,
                                w8;
                            for (let x8 of m.childNodes) {
                                let a6 = x8,
                                    D8 = Z8.has(x8);
                                if (!D8 && L8 === 0) {
                                    if (S$.has(a6)) continue
                                }
                                let Q6 = a6.yogaNode;
                                if (!Q6) continue;
                                let W8 = Q6.getComputedTop(),
                                    G8 = Q6.getComputedHeight(),
                                    s6 = W8 + G8;
                                if (D8) {
                                    let _8 = S$.get(a6);
                                    L8 += G8 - (_8 ? _8.height : 0)
                                }
                                if (s6 <= o || W8 >= o + B) continue;
                                if (W8 >= R6 && s6 <= p6) continue;
                                let u6 = Math.floor(t + W8);
                                if (!D8) {
                                    let _8 = S$.get(a6);
                                    if (_8) {
                                        let R8 = Math.floor(_8.y) - v6;
                                        if (R8 === u6) continue;
                                        let x6 = Math.max(R8, X6.top),
                                            i6 = Math.min(R8 + _8.height, w8 ?? X6.bottom + 1);
                                        if (x6 < i6) K.write(Math.floor($), x6, Array(i6 - x6).fill(q8).join(`
`))
                                    }
                                }
                                let h6 = Math.min(Math.floor(t + s6), Math.floor((h ?? H) + x + B));
                                if (u6 < h6) {
                                    w8 ??= u6;
                                    let _8 = Array(h6 - u6).fill(q8).join(`
`);
                                    K.write(Math.floor($), u6, _8), K.clip({
                                        x1: void 0,
                                        x2: void 0,
                                        y1: u6,
                                        y2: h6
                                    }), hE8(a6, K, {
                                        offsetX: r,
                                        offsetY: t,
                                        prevScreen: void 0,
                                        inheritedBackgroundColor: G
                                    }), K.unclip()
                                }
                            }
                        }
                        let N8 = vu1.length ? " ".repeat(L6) : "";
                        for (let R6 of vu1) {
                            if (R6.y >= T6 + 1 || R6.y + R6.height <= k6) continue;
                            let p6 = Math.max(k6, Math.floor(R6.y) - v6),
                                q8 = Math.min(T6 + 1, Math.floor(R6.y + R6.height) - v6);
                            if (p6 >= y6 && q8 <= c6 + 1) continue;
                            if (p6 >= q8) continue;
                            let L8 = Array(q8 - p6).fill(N8).join(`
`);
                            K.write(Math.floor($), p6, L8), K.clip({
                                x1: void 0,
                                x2: void 0,
                                y1: p6,
                                y2: q8
                            }), Gu1(m, K, r, t, D, void 0, p6 - t, q8 - t, G, !0), K.unclip()
                        }
                    } else {
                        let k6 = Y6 && Y6.y !== t;
                        if (k6 && h !== void 0 && C !== void 0) K.clear({
                            x: Math.floor($),
                            y: Math.floor(h),
                            width: Math.floor(J),
                            height: Math.floor(C - h)
                        });
                        Gu1(m, K, r, t, D, k6 || P ? void 0 : Y, o, o + B, G)
                    }
                    S$.set(m, {
                        x: r,
                        y: t,
                        width: S.getComputedWidth(),
                        height: S.getComputedHeight()
                    }), m.dirty = !1
                }
            } else {
                let x = q.style.backgroundColor;
                if (x || q.style.opaque) {
                    let B = w.getComputedBorder(0),
                        m = w.getComputedBorder(2),
                        S = w.getComputedBorder(1),
                        F = w.getComputedBorder(3),
                        U = Math.floor(J) - B - m,
                        g = Math.floor(X) - S - F;
                    if (U > 0 && g > 0) {
                        let c = " ".repeat(U),
                            n = x ? XN6(c, {
                                backgroundColor: x
                            }) : c,
                            l = Array(g).fill(n).join(`
`);
                        K.write($ + B, H + S, l)
                    }
                }
                iz4(q, K, $, H, D, x || q.style.opaque ? void 0 : Y, G)
            }
            if (R) K.unclip();
            Qz4($, H, q, K)
        } else if (q.nodeName === "ink-root") iz4(q, K, $, H, D, Y, O);
        let Z = {
            x: $,
            y: H,
            width: J,
            height: X,
            top: j
        };
        if (S$.set(q, Z), q.style.position === "absolute") zs6.push(Z);
        q.dirty = !1
    }
}
// @from(Ln 185690, Col 0)
function Qx_(q, K, _) {
    for (let z of q.childNodes) {
        let Y = z;
        if (Y.style.position !== "absolute") continue;
        let A = Y.yogaNode;
        if (!A || A.getDisplay() === 1) continue;
        let O = S$.get(Y);
        if (!O) continue;
        let w = K + A.getComputedLeft(),
            $ = _ + A.getComputedTop();
        if ($ < 0) $ = 0;
        if (O.x !== w || O.y !== $ || O.width !== A.getComputedWidth() || O.height !== A.getComputedHeight()) return !0
    }
    return !1
}
// @from(Ln 185706, Col 0)
function iz4(q, K, _, z, Y, A, O) {
    let w = A !== void 0 && Qx_(q, _, z),
        $ = !1,
        j = !1;
    for (let H of q.childNodes) {
        let J = H,
            X = J.dirty,
            M = J.style.position === "absolute";
        if (hE8(J, K, {
                offsetX: _,
                offsetY: z,
                prevScreen: Y || $ || w && !M ? void 0 : A,
                skipSelfBlit: j && M && !J.style.opaque && J.style.backgroundColor === void 0,
                inheritedBackgroundColor: O
            }), X && !$)
            if (!dx_(J) || M) $ = !0;
            else j = !0
    }
}
// @from(Ln 185726, Col 0)
function dx_(q) {
    let K = q.style.overflowX ?? q.style.overflow,
        _ = q.style.overflowY ?? q.style.overflow;
    return (K === "hidden" || K === "scroll") && (_ === "hidden" || _ === "scroll")
}
// @from(Ln 185732, Col 0)
function cx_(q, K) {
    let _ = q.parentNode;
    if (!_) return !1;
    let z = K.getComputedTop(),
        Y = _.childNodes,
        A = Y.indexOf(q);
    for (let O = A + 1; O < Y.length; O++) {
        let w = Y[O].yogaNode;
        if (!w) continue;
        return w.getComputedTop() === z
    }
    for (let O = A - 1; O >= 0; O--) {
        let w = Y[O].yogaNode;
        if (!w) continue;
        return w.getComputedTop() === z
    }
    return !1
}
// @from(Ln 185751, Col 0)
function _Y4(q, K, _, z, Y, A, O) {
    let w = z + A,
        $ = Y + O;
    for (let j of q.childNodes) {
        if (j.nodeName === "#text") continue;
        let H = j;
        if (H.style.position === "absolute") {
            let J = S$.get(H);
            if (J) {
                zs6.push(J);
                let X = Math.floor(J.x),
                    M = Math.floor(J.y),
                    P = Math.floor(J.width),
                    W = Math.floor(J.height);
                if (X < z || M < Y || X + P > w || M + W > $) K.blit(_, X, M, P, W)
            }
        }
        _Y4(H, K, _, z, Y, A, O)
    }
}
// @from(Ln 185772, Col 0)
function Gu1(q, K, _, z, Y, A, O, w, $, j = !1) {
    let H = !1,
        J = 0;
    for (let X of q.childNodes) {
        let M = X,
            P = M.yogaNode;
        if (P) {
            let D = S$.get(M),
                Z, G;
            if (D?.top !== void 0 && !M.dirty && J === 0) Z = D.top, G = D.height;
            else {
                if (Z = P.getComputedTop(), G = P.getComputedHeight(), M.dirty) J += G - (D ? D.height : 0);
                if (D) D.top = Z
            }
            if (Z + G <= O || Z >= w) {
                if (!j) Nu1(M);
                continue
            }
        }
        let W = M.dirty;
        if (hE8(M, K, {
                offsetX: _,
                offsetY: z,
                prevScreen: Y || H ? void 0 : A,
                inheritedBackgroundColor: $
            }), W) H = !0
    }
}
// @from(Ln 185801, Col 0)
function Nu1(q) {
    S$.delete(q);
    for (let K of q.childNodes)
        if (K.nodeName !== "#text") Nu1(K)
}
// @from(Ln 185806, Col 4)
UN6 = !1
// @from(Ln 185807, Col 4)
yE8 = null
// @from(Ln 185808, Col 4)
vu1
// @from(Ln 185808, Col 9)
zs6
// @from(Ln 185808, Col 14)
az4 = !1
// @from(Ln 185809, Col 4)
ku1 = null
// @from(Ln 185810, Col 4)
Tu1 = null
// @from(Ln 185811, Col 4)
bx_ = 4
// @from(Ln 185812, Col 4)
Ix_ = 5
// @from(Ln 185813, Col 4)
xx_ = 12
// @from(Ln 185814, Col 4)
ux_ = 2
// @from(Ln 185815, Col 4)
mx_ = 3
// @from(Ln 185816, Col 4)
fu1 = 30
// @from(Ln 185817, Col 4)
cz4 = "\x1B]"
// @from(Ln 185818, Col 4)
lz4 = "\x07"
// @from(Ln 185819, Col 4)
Ys6
// @from(Ln 185820, Col 4)
RE8 = L(() => {
    G$6();
    mz4();
    ZN6();
    v$6();
    dz4();
    dI1();
    la();
    Wu1();
    FN8();
    vu1 = [], zs6 = [];
    Ys6 = hE8
})
// @from(Ln 185834, Col 0)
function zY4(q, K) {
    let _ = K.toLowerCase();
    if (!_) return [];
    let z = _.length,
        Y = q.width,
        A = q.height,
        O = q.noSelect,
        w = [],
        $ = performance.now();
    for (let j = 0; j < A; j++) {
        let H = j * Y,
            J = "",
            X = [],
            M = [];
        for (let W = 0; W < Y; W++) {
            let D = H + W,
                Z = Ua(q, D);
            if (Z.width === 2 || Z.width === 3 || O[D] === 1) continue;
            let G = Z.char.toLowerCase(),
                f = X.length;
            for (let v = 0; v < G.length; v++) M.push(f);
            J += G, X.push(W)
        }
        let P = J.indexOf(_);
        while (P >= 0) {
            let W = M[P],
                D = M[P + z - 1],
                Z = X[W],
                G = X[D] + 1;
            w.push({
                row: j,
                col: Z,
                len: G - Z
            }), P = J.indexOf(_, P + z)
        }
    }
    return lx_.scan += performance.now() - $, w
}
// @from(Ln 185873, Col 0)
function YY4(q, K, _, z, Y) {
    if (Y < 0 || Y >= _.length) return !1;
    let A = _[Y],
        O = A.row + z;
    if (O < 0 || O >= q.height) return !1;
    let w = (j) => K.withCurrentMatch(j),
        $ = O * q.width;
    for (let j = A.col; j < A.col + A.len; j++) {
        if (j < 0 || j >= q.width) continue;
        let H = Ua(q, $ + j);
        EN6(q, j, O, w(H.styleId))
    }
    return !0
}
// @from(Ln 185887, Col 4)
lx_
// @from(Ln 185888, Col 4)
AY4 = L(() => {
    XN8();
    K8();
    TN6();
    lB();
    EE8();
    xa6();
    RE8();
    Xd();
    lx_ = {
        reconcile: 0,
        yoga: 0,
        paint: 0,
        scan: 0,
        calls: 0
    }
})
// @from(Ln 185906, Col 0)
function Eu1(q, K) {
    let _;
    return (z) => {
        let {
            frontFrame: Y,
            backFrame: A,
            isTTY: O,
            terminalWidth: w,
            terminalRows: $
        } = z, j = Y.screen, H = A.screen, J = H.charPool, X = H.hyperlinkPool, M = q.yogaNode?.getComputedHeight(), P = q.yogaNode?.getComputedWidth(), W = M === void 0 || !Number.isFinite(M) || M < 0, D = P === void 0 || !Number.isFinite(P) || P < 0;
        if (!q.yogaNode || W || D) {
            if (q.yogaNode && (W || D)) E(`Invalid yoga dimensions: width=${P}, height=${M}, childNodes=${q.childNodes.length}, terminalWidth=${w}, terminalRows=${$}`);
            return {
                screen: ga(w, 0, K, J, X),
                viewport: {
                    width: w,
                    height: $
                },
                cursor: {
                    x: 0,
                    y: 0,
                    visible: !0
                }
            }
        }
        let Z = Math.floor(q.yogaNode.getComputedWidth()),
            G = Math.floor(q.yogaNode.getComputedHeight()),
            f = z.altScreen ? $ : G;
        if (z.altScreen && G > $) E(`alt-screen: yoga height ${G} > terminalRows ${$} — ` + "something is rendering outside <AlternateScreen>. Overflow clipped.", {
            level: "warn"
        });
        let v = H ?? ga(Z, f, K, J, X);
        if (_) _.reset(Z, f, v);
        else _ = new x$6({
            width: Z,
            height: f,
            stylePool: K,
            screen: v
        });
        Vu1(), oz4(), ez4(), sz4(z.overlayActive);
        let V = T54();
        Ys6(q, _, {
            prevScreen: V || z.prevFrameContaminated ? void 0 : j
        });
        let k = _.get(),
            N = qY4();
        if (N) WD(N);
        return {
            scrollHint: z.altScreen ? tz4() : null,
            scrollDrainPending: N !== null,
            screen: k,
            viewport: {
                width: w,
                height: z.altScreen ? $ + 1 : $
            },
            cursor: {
                x: 0,
                y: z.altScreen ? Math.max(0, Math.min(v.height, $) - 1) : v.height,
                visible: !O || v.height === 0
            }
        }
    }
}
// @from(Ln 185969, Col 4)
OY4 = L(() => {
    K8();
    TN6();
    v$6();
    EE8();
    RE8();
    Xd()
})
// @from(Ln 185978, Col 0)
function wY4(q, K, _) {
    if (!K) return !1;
    let z = K.toLowerCase(),
        Y = z.length,
        A = q.width,
        O = q.noSelect,
        w = q.height,
        $ = !1;
    for (let j = 0; j < w; j++) {
        let H = j * A,
            J = "",
            X = [],
            M = [];
        for (let W = 0; W < A; W++) {
            let D = H + W,
                Z = Ua(q, D);
            if (Z.width === 2 || Z.width === 3 || O[D] === 1) continue;
            let G = Z.char.toLowerCase(),
                f = X.length;
            for (let v = 0; v < G.length; v++) M.push(f);
            J += G, X.push(W)
        }
        let P = J.indexOf(z);
        while (P >= 0) {
            $ = !0;
            let W = M[P],
                D = M[P + Y - 1];
            for (let Z = W; Z <= D; Z++) {
                let G = X[Z],
                    f = Ua(q, H + G);
                EN6(q, G, j, _.withInverse(f.styleId))
            }
            P = J.indexOf(z, P + Y)
        }
    }
    return $
}
// @from(Ln 186015, Col 4)
$Y4 = L(() => {
    Xd()
})
// @from(Ln 186019, Col 0)
function As6(q) {
    let K = "";
    for (let _ = 0; _ < q.length; _++) {
        let z = q.charCodeAt(_);
        K += z < 32 || z === 127 ? " " : q[_]
    }
    return K
}
// @from(Ln 186028, Col 0)
function fd() {
    let q = yI.useContext(I46);
    if (!q) throw Error("useTerminalNotification must be used within TerminalWriteProvider");
    let K = yI.useCallback(({
            message: O,
            title: w
        }) => {
            let $ = w ? `${w}: ${O}` : O;
            q(LP(yP(m2.ITERM2, As6($))))
        }, [q]),
        _ = yI.useCallback(({
            message: O,
            title: w,
            id: $
        }) => {
            q(LP(yP(m2.KITTY, `i=${$}:d=0:p=title`, As6(w)))), q(LP(yP(m2.KITTY, `i=${$}:p=body`, As6(O)))), q(LP(yP(m2.KITTY, `i=${$}:d=1:a=focus`, "")))
        }, [q]),
        z = yI.useCallback(({
            message: O,
            title: w
        }) => {
            q(LP(yP(m2.GHOSTTY, "notify", As6(w), As6(O))))
        }, [q]),
        Y = yI.useCallback(() => {
            q(dE)
        }, [q]),
        A = yI.useCallback((O, w) => {
            if (!Q_4()) return;
            if (!O) {
                q(LP(yP(m2.ITERM2, Z$6.PROGRESS, f$6.CLEAR, "")));
                return
            }
            let $ = Math.max(0, Math.min(100, Math.round(w ?? 0)));
            switch (O) {
                case "completed":
                    q(LP(yP(m2.ITERM2, Z$6.PROGRESS, f$6.CLEAR, "")));
                    break;
                case "error":
                    q(LP(yP(m2.ITERM2, Z$6.PROGRESS, f$6.ERROR, $)));
                    break;
                case "indeterminate":
                    q(LP(yP(m2.ITERM2, Z$6.PROGRESS, f$6.INDETERMINATE, "")));
                    break;
                case "running":
                    q(LP(yP(m2.ITERM2, Z$6.PROGRESS, f$6.SET, $)));
                    break;
                case null:
                    break
            }
        }, [q]);
    return yI.useMemo(() => ({
        notifyITerm2: K,
        notifyKitty: _,
        notifyGhostty: z,
        notifyBell: Y,
        progress: A
    }), [K, _, z, Y, A])
}
// @from(Ln 186086, Col 4)
yI
// @from(Ln 186086, Col 8)
I46
// @from(Ln 186086, Col 13)
jY4
// @from(Ln 186087, Col 4)
Gd = L(() => {
    la();
    Z46();
    HX();
    yI = K6(P6(), 1);
    I46 = yI.createContext(null), jY4 = I46.Provider
})
// @from(Ln 186105, Col 0)
function XY4(q) {
    return Object.freeze({
        type: "stdout",
        content: Qb1(q, 1)
    })
}