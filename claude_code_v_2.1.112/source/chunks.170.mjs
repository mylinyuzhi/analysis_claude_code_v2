
// @from(Ln 440468, Col 4)
_uK = L(() => {
    exK = {
        30: {
            r: 0,
            g: 0,
            b: 0
        },
        31: {
            r: 205,
            g: 49,
            b: 49
        },
        32: {
            r: 13,
            g: 188,
            b: 121
        },
        33: {
            r: 229,
            g: 229,
            b: 16
        },
        34: {
            r: 36,
            g: 114,
            b: 200
        },
        35: {
            r: 188,
            g: 63,
            b: 188
        },
        36: {
            r: 17,
            g: 168,
            b: 205
        },
        37: {
            r: 229,
            g: 229,
            b: 229
        },
        90: {
            r: 102,
            g: 102,
            b: 102
        },
        91: {
            r: 241,
            g: 76,
            b: 76
        },
        92: {
            r: 35,
            g: 209,
            b: 139
        },
        93: {
            r: 245,
            g: 245,
            b: 67
        },
        94: {
            r: 59,
            g: 142,
            b: 234
        },
        95: {
            r: 214,
            g: 112,
            b: 214
        },
        96: {
            r: 41,
            g: 184,
            b: 219
        },
        97: {
            r: 255,
            g: 255,
            b: 255
        }
    }, hP6 = {
        r: 229,
        g: 229,
        b: 229
    }, quK = {
        r: 30,
        g: 30,
        b: 30
    }
})
// @from(Ln 440564, Col 0)
function DRY() {
    let q = new Uint8Array(GO7);
    for (let K = 2; K < RP6 - 4; K++)
        for (let _ = 1; _ < de - 1; _++)
            if ((K === 2 || K === RP6 - 5 || _ === 1 || _ === de - 2) && (_ + K) % 2 === 0) q[K * de + _] = 255;
    return q
}
// @from(Ln 440572, Col 0)
function fRY() {
    let q = Buffer.from(PRY, "base64"),
        K = q.readUInt16LE(0),
        _ = new Map,
        z = 2;
    for (let Y = 0; Y < K; Y++) {
        let A = q.readUInt32LE(z);
        z += 4, _.set(A, q.subarray(z, z + GO7)), z += GO7
    }
    return _
}
// @from(Ln 440584, Col 0)
function zuK(q, K = {}) {
    let {
        scale: _ = 1,
        paddingX: z = 48,
        paddingY: Y = 48,
        borderRadius: A = 16,
        background: O = quK
    } = K, w = KuK(q);
    while (w.length > 0 && w[w.length - 1].every((W) => W.text.trim() === "")) w.pop();
    if (w.length === 0) w.push([{
        text: "",
        color: O,
        bold: !1
    }]);
    let $ = Math.max(1, ...w.map(GRY)),
        j = w.length,
        H = ($ * de + z * 2) * _,
        J = (j * RP6 + Y * 2) * _,
        X = new Uint8Array(H * J * 4);
    if (vRY(X, O), A > 0) NRY(X, H, J, A * _);
    let M = z * _,
        P = Y * _;
    for (let W = 0; W < j; W++) {
        let D = 0;
        for (let Z of w[W])
            for (let G of Z.text) {
                let f = G.codePointAt(0),
                    v = N1(G);
                if (v === 0) continue;
                let V = M + D * de * _,
                    k = P + W * RP6 * _,
                    N = TRY[f];
                if (N !== void 0) VRY(X, H, V, k, Z.color, O, N, _);
                else {
                    let R = ZRY.get(f) ?? WRY;
                    kRY(X, H, V, k, R, Z.color, Z.bold, _)
                }
                D += v
            }
    }
    return RRY(X, H, J)
}
// @from(Ln 440627, Col 0)
function GRY(q) {
    let K = 0;
    for (let _ of q) K += N1(_.text);
    return K
}
// @from(Ln 440633, Col 0)
function vRY(q, K) {
    for (let _ = 0; _ < q.length; _ += 4) q[_] = K.r, q[_ + 1] = K.g, q[_ + 2] = K.b, q[_ + 3] = 255
}
// @from(Ln 440637, Col 0)
function VRY(q, K, _, z, Y, A, O, w) {
    let $ = Math.round(Y.r * O + A.r * (1 - O)),
        j = Math.round(Y.g * O + A.g * (1 - O)),
        H = Math.round(Y.b * O + A.b * (1 - O)),
        J = de * w,
        X = RP6 * w;
    for (let M = 0; M < X; M++) {
        let P = ((z + M) * K + _) * 4;
        for (let W = 0; W < J; W++) {
            let D = P + W * 4;
            q[D] = $, q[D + 1] = j, q[D + 2] = H
        }
    }
}
// @from(Ln 440652, Col 0)
function kRY(q, K, _, z, Y, A, O, w) {
    for (let $ = 0; $ < RP6; $++)
        for (let j = 0; j < de; j++) {
            let H = Y[$ * de + j];
            if (H === 0) continue;
            if (O) H = Math.min(255, H * 1.4);
            let J = 255 - H;
            for (let X = 0; X < w; X++) {
                let M = ((z + $ * w + X) * K + _ + j * w) * 4;
                for (let P = 0; P < w; P++) {
                    let W = M + P * 4;
                    q[W] = A.r * H + q[W] * J >> 8, q[W + 1] = A.g * H + q[W + 1] * J >> 8, q[W + 2] = A.b * H + q[W + 2] * J >> 8
                }
            }
        }
}
// @from(Ln 440669, Col 0)
function NRY(q, K, _, z) {
    let Y = z * z;
    for (let A = 0; A < z; A++)
        for (let O = 0; O < z; O++) {
            let w = z - O - 0.5,
                $ = z - A - 0.5;
            if (w * w + $ * $ <= Y) continue;
            q[(A * K + O) * 4 + 3] = 0, q[(A * K + (K - 1 - O)) * 4 + 3] = 0, q[((_ - 1 - A) * K + O) * 4 + 3] = 0, q[((_ - 1 - A) * K + (K - 1 - O)) * 4 + 3] = 0
        }
}
// @from(Ln 440680, Col 0)
function LRY() {
    let q = new Uint32Array(256);
    for (let K = 0; K < 256; K++) {
        let _ = K;
        for (let z = 0; z < 8; z++) _ = _ & 1 ? 3988292384 ^ _ >>> 1 : _ >>> 1;
        q[K] = _ >>> 0
    }
    return q
}
// @from(Ln 440690, Col 0)
function hRY(q) {
    let K = 4294967295;
    for (let _ = 0; _ < q.length; _++) K = yRY[(K ^ q[_]) & 255] ^ K >>> 8;
    return (K ^ 4294967295) >>> 0
}
// @from(Ln 440696, Col 0)
function fO7(q, K) {
    let _ = Buffer.alloc(4 + K.length);
    _.write(q, 0, "ascii"), _.set(K, 4);
    let z = Buffer.alloc(12 + K.length);
    return z.writeUInt32BE(K.length, 0), _.copy(z, 4), z.writeUInt32BE(hRY(_), 8 + K.length), z
}
// @from(Ln 440703, Col 0)
function RRY(q, K, _) {
    let z = Buffer.alloc(13);
    z.writeUInt32BE(K, 0), z.writeUInt32BE(_, 4), z[8] = 8, z[9] = 6, z[10] = 0, z[11] = 0, z[12] = 0;
    let Y = K * 4,
        A = Buffer.alloc(_ * (Y + 1));
    for (let w = 0; w < _; w++) {
        let $ = w * (Y + 1);
        A[$] = 0, A.set(q.subarray(w * Y, (w + 1) * Y), $ + 1)
    }
    let O = MRY(A);
    return Buffer.concat([ERY, fO7("IHDR", z), fO7("IDAT", O), fO7("IEND", new Uint8Array(0))])
}
// @from(Ln 440715, Col 4)
de = 24
// @from(Ln 440716, Col 4)
RP6 = 48
// @from(Ln 440717, Col 4)
GO7