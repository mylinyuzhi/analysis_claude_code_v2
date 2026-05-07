
// @from(Ln 48533, Col 0)
function EQ6(q, K = !1) {
    let _ = q.length,
        z = 0,
        Y = "",
        A = 0,
        O = 16,
        w = 0,
        $ = 0,
        j = 0,
        H = 0,
        J = 0;

    function X(f, v) {
        let V = 0,
            k = 0;
        while (V < f || !v) {
            let N = q.charCodeAt(z);
            if (N >= 48 && N <= 57) k = k * 16 + N - 48;
            else if (N >= 65 && N <= 70) k = k * 16 + N - 65 + 10;
            else if (N >= 97 && N <= 102) k = k * 16 + N - 97 + 10;
            else break;
            z++, V++
        }
        if (V < f) k = -1;
        return k
    }

    function M(f) {
        z = f, Y = "", A = 0, O = 16, J = 0
    }

    function P() {
        let f = z;
        if (q.charCodeAt(z) === 48) z++;
        else {
            z++;
            while (z < q.length && of6(q.charCodeAt(z))) z++
        }
        if (z < q.length && q.charCodeAt(z) === 46)
            if (z++, z < q.length && of6(q.charCodeAt(z))) {
                z++;
                while (z < q.length && of6(q.charCodeAt(z))) z++
            } else return J = 3, q.substring(f, z);
        let v = z;
        if (z < q.length && (q.charCodeAt(z) === 69 || q.charCodeAt(z) === 101)) {
            if (z++, z < q.length && q.charCodeAt(z) === 43 || q.charCodeAt(z) === 45) z++;
            if (z < q.length && of6(q.charCodeAt(z))) {
                z++;
                while (z < q.length && of6(q.charCodeAt(z))) z++;
                v = z
            } else J = 3
        }
        return q.substring(f, v)
    }

    function W() {
        let f = "",
            v = z;
        while (!0) {
            if (z >= _) {
                f += q.substring(v, z), J = 2;
                break
            }
            let V = q.charCodeAt(z);
            if (V === 34) {
                f += q.substring(v, z), z++;
                break
            }
            if (V === 92) {
                if (f += q.substring(v, z), z++, z >= _) {
                    J = 2;
                    break
                }
                switch (q.charCodeAt(z++)) {
                    case 34:
                        f += '"';
                        break;
                    case 92:
                        f += "\\";
                        break;
                    case 47:
                        f += "/";
                        break;
                    case 98:
                        f += "\b";
                        break;
                    case 102:
                        f += "\f";
                        break;
                    case 110:
                        f += `
`;
                        break;
                    case 114:
                        f += "\r";
                        break;
                    case 116:
                        f += "\t";
                        break;
                    case 117:
                        let N = X(4, !0);
                        if (N >= 0) f += String.fromCharCode(N);
                        else J = 4;
                        break;
                    default:
                        J = 5
                }
                v = z;
                continue
            }
            if (V >= 0 && V <= 31)
                if (NQ6(V)) {
                    f += q.substring(v, z), J = 2;
                    break
                } else J = 6;
            z++
        }
        return f
    }

    function D() {
        if (Y = "", J = 0, A = z, $ = w, H = j, z >= _) return A = _, O = 17;
        let f = q.charCodeAt(z);
        if (nA1(f)) {
            do z++, Y += String.fromCharCode(f), f = q.charCodeAt(z); while (nA1(f));
            return O = 15
        }
        if (NQ6(f)) {
            if (z++, Y += String.fromCharCode(f), f === 13 && q.charCodeAt(z) === 10) z++, Y += `
`;
            return w++, j = z, O = 14
        }
        switch (f) {
            case 123:
                return z++, O = 1;
            case 125:
                return z++, O = 2;
            case 91:
                return z++, O = 3;
            case 93:
                return z++, O = 4;
            case 58:
                return z++, O = 6;
            case 44:
                return z++, O = 5;
            case 34:
                return z++, Y = W(), O = 10;
            case 47:
                let v = z - 1;
                if (q.charCodeAt(z + 1) === 47) {
                    z += 2;
                    while (z < _) {
                        if (NQ6(q.charCodeAt(z))) break;
                        z++
                    }
                    return Y = q.substring(v, z), O = 12
                }
                if (q.charCodeAt(z + 1) === 42) {
                    z += 2;
                    let V = _ - 1,
                        k = !1;
                    while (z < V) {
                        let N = q.charCodeAt(z);
                        if (N === 42 && q.charCodeAt(z + 1) === 47) {
                            z += 2, k = !0;
                            break
                        }
                        if (z++, NQ6(N)) {
                            if (N === 13 && q.charCodeAt(z) === 10) z++;
                            w++, j = z
                        }
                    }
                    if (!k) z++, J = 1;
                    return Y = q.substring(v, z), O = 13
                }
                return Y += String.fromCharCode(f), z++, O = 16;
            case 45:
                if (Y += String.fromCharCode(f), z++, z === _ || !of6(q.charCodeAt(z))) return O = 16;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                return Y += P(), O = 11;
            default:
                while (z < _ && Z(f)) z++, f = q.charCodeAt(z);
                if (A !== z) {
                    switch (Y = q.substring(A, z), Y) {
                        case "true":
                            return O = 8;
                        case "false":
                            return O = 9;
                        case "null":
                            return O = 7
                    }
                    return O = 16
                }
                return Y += String.fromCharCode(f), z++, O = 16
        }
    }

    function Z(f) {
        if (nA1(f) || NQ6(f)) return !1;
        switch (f) {
            case 125:
            case 93:
            case 123:
            case 91:
            case 34:
            case 58:
            case 44:
            case 47:
                return !1
        }
        return !0
    }

    function G() {
        let f;
        do f = D(); while (f >= 12 && f <= 15);
        return f
    }
    return {
        setPosition: M,
        getPosition: () => z,
        scan: K ? G : D,
        getToken: () => O,
        getTokenValue: () => Y,
        getTokenOffset: () => A,
        getTokenLength: () => z - A,
        getTokenStartLine: () => $,
        getTokenStartCharacter: () => A - H,
        getTokenError: () => J
    }
}
// @from(Ln 48774, Col 0)
function nA1(q) {
    return q === 32 || q === 9
}
// @from(Ln 48778, Col 0)
function NQ6(q) {
    return q === 10 || q === 13
}
// @from(Ln 48782, Col 0)
function of6(q) {
    return q >= 48 && q <= 57
}
// @from(Ln 48785, Col 4)
TF7
// @from(Ln 48786, Col 4)
aJ8 = L(() => {
    (function(q) {
        q[q.lineFeed = 10] = "lineFeed", q[q.carriageReturn = 13] = "carriageReturn", q[q.space = 32] = "space", q[q._0 = 48] = "_0", q[q._1 = 49] = "_1", q[q._2 = 50] = "_2", q[q._3 = 51] = "_3", q[q._4 = 52] = "_4", q[q._5 = 53] = "_5", q[q._6 = 54] = "_6", q[q._7 = 55] = "_7", q[q._8 = 56] = "_8", q[q._9 = 57] = "_9", q[q.a = 97] = "a", q[q.b = 98] = "b", q[q.c = 99] = "c", q[q.d = 100] = "d", q[q.e = 101] = "e", q[q.f = 102] = "f", q[q.g = 103] = "g", q[q.h = 104] = "h", q[q.i = 105] = "i", q[q.j = 106] = "j", q[q.k = 107] = "k", q[q.l = 108] = "l", q[q.m = 109] = "m", q[q.n = 110] = "n", q[q.o = 111] = "o", q[q.p = 112] = "p", q[q.q = 113] = "q", q[q.r = 114] = "r", q[q.s = 115] = "s", q[q.t = 116] = "t", q[q.u = 117] = "u", q[q.v = 118] = "v", q[q.w = 119] = "w", q[q.x = 120] = "x", q[q.y = 121] = "y", q[q.z = 122] = "z", q[q.A = 65] = "A", q[q.B = 66] = "B", q[q.C = 67] = "C", q[q.D = 68] = "D", q[q.E = 69] = "E", q[q.F = 70] = "F", q[q.G = 71] = "G", q[q.H = 72] = "H", q[q.I = 73] = "I", q[q.J = 74] = "J", q[q.K = 75] = "K", q[q.L = 76] = "L", q[q.M = 77] = "M", q[q.N = 78] = "N", q[q.O = 79] = "O", q[q.P = 80] = "P", q[q.Q = 81] = "Q", q[q.R = 82] = "R", q[q.S = 83] = "S", q[q.T = 84] = "T", q[q.U = 85] = "U", q[q.V = 86] = "V", q[q.W = 87] = "W", q[q.X = 88] = "X", q[q.Y = 89] = "Y", q[q.Z = 90] = "Z", q[q.asterisk = 42] = "asterisk", q[q.backslash = 92] = "backslash", q[q.closeBrace = 125] = "closeBrace", q[q.closeBracket = 93] = "closeBracket", q[q.colon = 58] = "colon", q[q.comma = 44] = "comma", q[q.dot = 46] = "dot", q[q.doubleQuote = 34] = "doubleQuote", q[q.minus = 45] = "minus", q[q.openBrace = 123] = "openBrace", q[q.openBracket = 91] = "openBracket", q[q.plus = 43] = "plus", q[q.slash = 47] = "slash", q[q.formFeed = 12] = "formFeed", q[q.tab = 9] = "tab"
    })(TF7 || (TF7 = {}))
})
// @from(Ln 48791, Col 4)
Ph
// @from(Ln 48791, Col 8)
iA1
// @from(Ln 48791, Col 13)
VF7
// @from(Ln 48792, Col 4)
kF7 = L(() => {
    Ph = Array(20).fill(0).map((q, K) => {
        return " ".repeat(K)
    }), iA1 = {
        " ": {
            "\n": Array(200).fill(0).map((q, K) => {
                return `
` + " ".repeat(K)
            }),
            "\r": Array(200).fill(0).map((q, K) => {
                return "\r" + " ".repeat(K)
            }),
            "\r\n": Array(200).fill(0).map((q, K) => {
                return `\r
` + " ".repeat(K)
            })
        },
        "\t": {
            "\n": Array(200).fill(0).map((q, K) => {
                return `
` + "\t".repeat(K)
            }),
            "\r": Array(200).fill(0).map((q, K) => {
                return "\r" + "\t".repeat(K)
            }),
            "\r\n": Array(200).fill(0).map((q, K) => {
                return `\r
` + "\t".repeat(K)
            })
        }
    }, VF7 = [`
`, "\r", `\r
`]
})
// @from(Ln 48827, Col 0)
function rA1(q, K, _) {
    let z, Y, A, O, w;
    if (K) {
        O = K.offset, w = O + K.length, A = O;
        while (A > 0 && !yQ6(q, A - 1)) A--;
        let V = w;
        while (V < q.length && !yQ6(q, V)) V++;
        Y = q.substring(A, V), z = Jn5(Y, _)
    } else Y = q, z = 0, A = 0, O = 0, w = q.length;
    let $ = Xn5(_, q),
        j = VF7.includes($),
        H = 0,
        J = 0,
        X;
    if (_.insertSpaces) X = Ph[_.tabSize || 4] ?? af6(Ph[1], _.tabSize || 4);
    else X = "\t";
    let M = X === "\t" ? "\t" : " ",
        P = EQ6(Y, !1),
        W = !1;

    function D() {
        if (H > 1) return af6($, H) + af6(X, z + J);
        let V = X.length * (z + J);
        if (!j || V > iA1[M][$].length) return $ + af6(X, z + J);
        if (V <= 0) return $;
        return iA1[M][$][V]
    }

    function Z() {
        let V = P.scan();
        H = 0;
        while (V === 15 || V === 14) {
            if (V === 14 && _.keepLines) H += 1;
            else if (V === 14) H = 1;
            V = P.scan()
        }
        return W = V === 16 || P.getTokenError() !== 0, V
    }
    let G = [];

    function f(V, k, N) {
        if (!W && (!K || k < w && N > O) && q.substring(k, N) !== V) G.push({
            offset: k,
            length: N - k,
            content: V
        })
    }
    let v = Z();
    if (_.keepLines && H > 0) f(af6($, H), 0, 0);
    if (v !== 17) {
        let V = P.getTokenOffset() + A,
            k = X.length * z < 20 && _.insertSpaces ? Ph[X.length * z] : af6(X, z);
        f(k, A, V)
    }
    while (v !== 17) {
        let V = P.getTokenOffset() + P.getTokenLength() + A,
            k = Z(),
            N = "",
            R = !1;
        while (H === 0 && (k === 12 || k === 13)) {
            let C = P.getTokenOffset() + A;
            f(Ph[1], V, C), V = P.getTokenOffset() + P.getTokenLength() + A, R = k === 12, N = R ? D() : "", k = Z()
        }
        if (k === 2) {
            if (v !== 1) J--;
            if (_.keepLines && H > 0 || !_.keepLines && v !== 1) N = D();
            else if (_.keepLines) N = Ph[1]
        } else if (k === 4) {
            if (v !== 3) J--;
            if (_.keepLines && H > 0 || !_.keepLines && v !== 3) N = D();
            else if (_.keepLines) N = Ph[1]
        } else {
            switch (v) {
                case 3:
                case 1:
                    if (J++, _.keepLines && H > 0 || !_.keepLines) N = D();
                    else N = Ph[1];
                    break;
                case 5:
                    if (_.keepLines && H > 0 || !_.keepLines) N = D();
                    else N = Ph[1];
                    break;
                case 12:
                    N = D();
                    break;
                case 13:
                    if (H > 0) N = D();
                    else if (!R) N = Ph[1];
                    break;
                case 6:
                    if (_.keepLines && H > 0) N = D();
                    else if (!R) N = Ph[1];
                    break;
                case 10:
                    if (_.keepLines && H > 0) N = D();
                    else if (k === 6 && !R) N = "";
                    break;
                case 7:
                case 8:
                case 9:
                case 11:
                case 2:
                case 4:
                    if (_.keepLines && H > 0) N = D();
                    else if ((k === 12 || k === 13) && !R) N = Ph[1];
                    else if (k !== 5 && k !== 17) W = !0;
                    break;
                case 16:
                    W = !0;
                    break
            }
            if (H > 0 && (k === 12 || k === 13)) N = D()
        }
        if (k === 17)
            if (_.keepLines && H > 0) N = D();
            else N = _.insertFinalNewline ? $ : "";
        let h = P.getTokenOffset() + A;
        f(N, V, h), v = k
    }
    return G
}
// @from(Ln 48949, Col 0)
function af6(q, K) {
    let _ = "";
    for (let z = 0; z < K; z++) _ += q;
    return _
}
// @from(Ln 48955, Col 0)
function Jn5(q, K) {
    let _ = 0,
        z = 0,
        Y = K.tabSize || 4;
    while (_ < q.length) {
        let A = q.charAt(_);
        if (A === Ph[1]) z++;
        else if (A === "\t") z += Y;
        else break;
        _++
    }
    return Math.floor(z / Y)
}
// @from(Ln 48969, Col 0)
function Xn5(q, K) {
    for (let _ = 0; _ < K.length; _++) {
        let z = K.charAt(_);
        if (z === "\r") {
            if (_ + 1 < K.length && K.charAt(_ + 1) === `
`) return `\r
`;
            return "\r"
        } else if (z === `
`) return `
`
    }
    return q && q.eol || `
`
}
// @from(Ln 48985, Col 0)
function yQ6(q, K) {
    return `\r
`.indexOf(q.charAt(K)) !== -1
}
// @from(Ln 48989, Col 4)
oA1 = L(() => {
    aJ8();
    kF7()
})
// @from(Ln 48994, Col 0)
function NF7(q, K = [], _ = LQ6.DEFAULT) {
    let z = null,
        Y = [],
        A = [];

    function O($) {
        if (Array.isArray(Y)) Y.push($);
        else if (z !== null) Y[z] = $
    }
    return sA1(q, {
        onObjectBegin: () => {
            let $ = {};
            O($), A.push(Y), Y = $, z = null
        },
        onObjectProperty: ($) => {
            z = $
        },
        onObjectEnd: () => {
            Y = A.pop()
        },
        onArrayBegin: () => {
            let $ = [];
            O($), A.push(Y), Y = $, z = null
        },
        onArrayEnd: () => {
            Y = A.pop()
        },
        onLiteralValue: O,
        onError: ($, j, H) => {
            K.push({
                error: $,
                offset: j,
                length: H
            })
        }
    }, _), Y[0]
}
// @from(Ln 49032, Col 0)
function aA1(q, K = [], _ = LQ6.DEFAULT) {
    let z = {
        type: "array",
        offset: -1,
        length: -1,
        children: [],
        parent: void 0
    };

    function Y($) {
        if (z.type === "property") z.length = $ - z.offset, z = z.parent
    }

    function A($) {
        return z.children.push($), $
    }
    sA1(q, {
        onObjectBegin: ($) => {
            z = A({
                type: "object",
                offset: $,
                length: -1,
                parent: z,
                children: []
            })
        },
        onObjectProperty: ($, j, H) => {
            z = A({
                type: "property",
                offset: j,
                length: -1,
                parent: z,
                children: []
            }), z.children.push({
                type: "string",
                value: $,
                offset: j,
                length: H,
                parent: z
            })
        },
        onObjectEnd: ($, j) => {
            Y($ + j), z.length = $ + j - z.offset, z = z.parent, Y($ + j)
        },
        onArrayBegin: ($, j) => {
            z = A({
                type: "array",
                offset: $,
                length: -1,
                parent: z,
                children: []
            })
        },
        onArrayEnd: ($, j) => {
            z.length = $ + j - z.offset, z = z.parent, Y($ + j)
        },
        onLiteralValue: ($, j, H) => {
            A({
                type: Pn5($),
                offset: j,
                length: H,
                parent: z,
                value: $
            }), Y(j + H)
        },
        onSeparator: ($, j, H) => {
            if (z.type === "property") {
                if ($ === ":") z.colonOffset = j;
                else if ($ === ",") Y(j)
            }
        },
        onError: ($, j, H) => {
            K.push({
                error: $,
                offset: j,
                length: H
            })
        }
    }, _);
    let w = z.children[0];
    if (w) delete w.parent;
    return w
}
// @from(Ln 49116, Col 0)
function sJ8(q, K) {
    if (!q) return;
    let _ = q;
    for (let z of K)
        if (typeof z === "string") {
            if (_.type !== "object" || !Array.isArray(_.children)) return;
            let Y = !1;
            for (let A of _.children)
                if (Array.isArray(A.children) && A.children[0].value === z && A.children.length === 2) {
                    _ = A.children[1], Y = !0;
                    break
                } if (!Y) return
        } else {
            let Y = z;
            if (_.type !== "array" || Y < 0 || !Array.isArray(_.children) || Y >= _.children.length) return;
            _ = _.children[Y]
        } return _
}
// @from(Ln 49135, Col 0)
function sA1(q, K, _ = LQ6.DEFAULT) {
    let z = EQ6(q, !1),
        Y = [];

    function A(B) {
        return B ? () => B(z.getTokenOffset(), z.getTokenLength(), z.getTokenStartLine(), z.getTokenStartCharacter()) : () => !0
    }

    function O(B) {
        return B ? () => B(z.getTokenOffset(), z.getTokenLength(), z.getTokenStartLine(), z.getTokenStartCharacter(), () => Y.slice()) : () => !0
    }

    function w(B) {
        return B ? (m) => B(m, z.getTokenOffset(), z.getTokenLength(), z.getTokenStartLine(), z.getTokenStartCharacter()) : () => !0
    }

    function $(B) {
        return B ? (m) => B(m, z.getTokenOffset(), z.getTokenLength(), z.getTokenStartLine(), z.getTokenStartCharacter(), () => Y.slice()) : () => !0
    }
    let j = O(K.onObjectBegin),
        H = $(K.onObjectProperty),
        J = A(K.onObjectEnd),
        X = O(K.onArrayBegin),
        M = A(K.onArrayEnd),
        P = $(K.onLiteralValue),
        W = w(K.onSeparator),
        D = A(K.onComment),
        Z = w(K.onError),
        G = _ && _.disallowComments,
        f = _ && _.allowTrailingComma;

    function v() {
        while (!0) {
            let B = z.scan();
            switch (z.getTokenError()) {
                case 4:
                    V(14);
                    break;
                case 5:
                    V(15);
                    break;
                case 3:
                    V(13);
                    break;
                case 1:
                    if (!G) V(11);
                    break;
                case 2:
                    V(12);
                    break;
                case 6:
                    V(16);
                    break
            }
            switch (B) {
                case 12:
                case 13:
                    if (G) V(10);
                    else D();
                    break;
                case 16:
                    V(1);
                    break;
                case 15:
                case 14:
                    break;
                default:
                    return B
            }
        }
    }

    function V(B, m = [], S = []) {
        if (Z(B), m.length + S.length > 0) {
            let F = z.getToken();
            while (F !== 17) {
                if (m.indexOf(F) !== -1) {
                    v();
                    break
                } else if (S.indexOf(F) !== -1) break;
                F = v()
            }
        }
    }

    function k(B) {
        let m = z.getTokenValue();
        if (B) P(m);
        else H(m), Y.push(m);
        return v(), !0
    }

    function N() {
        switch (z.getToken()) {
            case 11:
                let B = z.getTokenValue(),
                    m = Number(B);
                if (isNaN(m)) V(2), m = 0;
                P(m);
                break;
            case 7:
                P(null);
                break;
            case 8:
                P(!0);
                break;
            case 9:
                P(!1);
                break;
            default:
                return !1
        }
        return v(), !0
    }

    function R() {
        if (z.getToken() !== 10) return V(3, [], [2, 5]), !1;
        if (k(!1), z.getToken() === 6) {
            if (W(":"), v(), !x()) V(4, [], [2, 5])
        } else V(5, [], [2, 5]);
        return Y.pop(), !0
    }

    function h() {
        j(), v();
        let B = !1;
        while (z.getToken() !== 2 && z.getToken() !== 17) {
            if (z.getToken() === 5) {
                if (!B) V(4, [], []);
                if (W(","), v(), z.getToken() === 2 && f) break
            } else if (B) V(6, [], []);
            if (!R()) V(4, [], [2, 5]);
            B = !0
        }
        if (J(), z.getToken() !== 2) V(7, [2], []);
        else v();
        return !0
    }

    function C() {
        X(), v();
        let B = !0,
            m = !1;
        while (z.getToken() !== 4 && z.getToken() !== 17) {
            if (z.getToken() === 5) {
                if (!m) V(4, [], []);
                if (W(","), v(), z.getToken() === 4 && f) break
            } else if (m) V(6, [], []);
            if (B) Y.push(0), B = !1;
            else Y[Y.length - 1]++;
            if (!x()) V(4, [], [4, 5]);
            m = !0
        }
        if (M(), !B) Y.pop();
        if (z.getToken() !== 4) V(8, [4], []);
        else v();
        return !0
    }

    function x() {
        switch (z.getToken()) {
            case 3:
                return C();
            case 1:
                return h();
            case 10:
                return k(!0);
            default:
                return N()
        }
    }
    if (v(), z.getToken() === 17) {
        if (_.allowEmptyContent) return !0;
        return V(4, [], []), !1
    }
    if (!x()) return V(4, [], []), !1;
    if (z.getToken() !== 17) V(9, [], []);
    return !0
}
// @from(Ln 49315, Col 0)
function Pn5(q) {
    switch (typeof q) {
        case "boolean":
            return "boolean";
        case "number":
            return "number";
        case "string":
            return "string";
        case "object": {
            if (!q) return "null";
            else if (Array.isArray(q)) return "array";
            return "object"
        }
        default:
            return "null"
    }
}
// @from(Ln 49332, Col 4)
LQ6
// @from(Ln 49333, Col 4)
tA1 = L(() => {
    aJ8();
    (function(q) {
        q.DEFAULT = {
            allowTrailingComma: !1
        }
    })(LQ6 || (LQ6 = {}))
})
// @from(Ln 49342, Col 0)
function EF7(q, K, _, z) {
    let Y = K.slice(),
        O = aA1(q, []),
        w = void 0,
        $ = void 0;
    while (Y.length > 0)
        if ($ = Y.pop(), w = sJ8(O, Y), w === void 0 && _ !== void 0)
            if (typeof $ === "string") _ = {
                [$]: _
            };
            else _ = [_];
    else break;
    if (!w) {
        if (_ === void 0) throw Error("Can not delete in empty document");
        return BA6(q, {
            offset: O ? O.offset : 0,
            length: O ? O.length : 0,
            content: JSON.stringify(_)
        }, z)
    } else if (w.type === "object" && typeof $ === "string" && Array.isArray(w.children)) {
        let j = sJ8(w, [$]);
        if (j !== void 0)
            if (_ === void 0) {
                if (!j.parent) throw Error("Malformed AST");
                let H = w.children.indexOf(j.parent),
                    J, X = j.parent.offset + j.parent.length;
                if (H > 0) {
                    let M = w.children[H - 1];
                    J = M.offset + M.length
                } else if (J = w.offset + 1, w.children.length > 1) X = w.children[1].offset;
                return BA6(q, {
                    offset: J,
                    length: X - J,
                    content: ""
                }, z)
            } else return BA6(q, {
                offset: j.offset,
                length: j.length,
                content: JSON.stringify(_)
            }, z);
        else {
            if (_ === void 0) return [];
            let H = `${JSON.stringify($)}: ${JSON.stringify(_)}`,
                J = z.getInsertionIndex ? z.getInsertionIndex(w.children.map((M) => M.children[0].value)) : w.children.length,
                X;
            if (J > 0) {
                let M = w.children[J - 1];
                X = {
                    offset: M.offset + M.length,
                    length: 0,
                    content: "," + H
                }
            } else if (w.children.length === 0) X = {
                offset: w.offset + 1,
                length: 0,
                content: H
            };
            else X = {
                offset: w.offset + 1,
                length: 0,
                content: H + ","
            };
            return BA6(q, X, z)
        }
    } else if (w.type === "array" && typeof $ === "number" && Array.isArray(w.children)) {
        let j = $;
        if (j === -1) {
            let H = `${JSON.stringify(_)}`,
                J;
            if (w.children.length === 0) J = {
                offset: w.offset + 1,
                length: 0,
                content: H
            };
            else {
                let X = w.children[w.children.length - 1];
                J = {
                    offset: X.offset + X.length,
                    length: 0,
                    content: "," + H
                }
            }
            return BA6(q, J, z)
        } else if (_ === void 0 && w.children.length >= 0) {
            let H = $,
                J = w.children[H],
                X;
            if (w.children.length === 1) X = {
                offset: w.offset + 1,
                length: w.length - 2,
                content: ""
            };
            else if (w.children.length - 1 === H) {
                let M = w.children[H - 1],
                    P = M.offset + M.length,
                    W = w.offset + w.length;
                X = {
                    offset: P,
                    length: W - 2 - P,
                    content: ""
                }
            } else X = {
                offset: J.offset,
                length: w.children[H + 1].offset - J.offset,
                content: ""
            };
            return BA6(q, X, z)
        } else if (_ !== void 0) {
            let H, J = `${JSON.stringify(_)}`;
            if (!z.isArrayInsertion && w.children.length > $) {
                let X = w.children[$];
                H = {
                    offset: X.offset,
                    length: X.length,
                    content: J
                }
            } else if (w.children.length === 0 || $ === 0) H = {
                offset: w.offset + 1,
                length: 0,
                content: w.children.length === 0 ? J : J + ","
            };
            else {
                let X = $ > w.children.length ? w.children.length : $,
                    M = w.children[X - 1];
                H = {
                    offset: M.offset + M.length,
                    length: 0,
                    content: "," + J
                }
            }
            return BA6(q, H, z)
        } else throw Error(`Can not ${_===void 0?"remove":z.isArrayInsertion?"insert":"modify"} Array index ${j} as length is not sufficient`)
    } else throw Error(`Can not add ${typeof $!=="number"?"index":"property"} to parent of type ${w.type}`)
}
// @from(Ln 49477, Col 0)
function BA6(q, K, _) {
    if (!_.formattingOptions) return [K];
    let z = tJ8(q, K),
        Y = K.offset,
        A = K.offset + K.content.length;
    if (K.length === 0 || K.content.length === 0) {
        while (Y > 0 && !yQ6(z, Y - 1)) Y--;
        while (A < z.length && !yQ6(z, A)) A++
    }
    let O = rA1(z, {
        offset: Y,
        length: A - Y
    }, {
        ..._.formattingOptions,
        keepLines: !1
    });
    for (let $ = O.length - 1; $ >= 0; $--) {
        let j = O[$];
        z = tJ8(z, j), Y = Math.min(Y, j.offset), A = Math.max(A, j.offset + j.length), A += j.content.length - j.length
    }
    let w = q.length - (z.length - A) - Y;
    return [{
        offset: Y,
        length: w,
        content: z.substring(Y, A)
    }]
}
// @from(Ln 49505, Col 0)
function tJ8(q, K) {
    return q.substring(0, K.offset) + K.content + q.substring(K.offset + K.length)
}
// @from(Ln 49508, Col 4)
yF7 = L(() => {
    oA1();
    tA1()
})
// @from(Ln 49513, Col 0)
function SF7(q, K, _, z) {
    return EF7(q, K, _, z)
}
// @from(Ln 49517, Col 0)
function CF7(q, K) {
    let _ = K.slice(0).sort((Y, A) => {
            let O = Y.offset - A.offset;
            if (O === 0) return Y.length - A.length;
            return O
        }),
        z = q.length;
    for (let Y = _.length - 1; Y >= 0; Y--) {
        let A = _[Y];
        if (A.offset + A.length <= z) q = tJ8(q, A);
        else throw Error("Overlapping edit");
        z = A.offset
    }
    return q
}
// @from(Ln 49532, Col 4)
LF7
// @from(Ln 49532, Col 9)
hF7
// @from(Ln 49532, Col 14)
eA1
// @from(Ln 49532, Col 19)
RF7
// @from(Ln 49533, Col 4)
bF7 = L(() => {
    oA1();
    yF7();
    aJ8();
    tA1();
    (function(q) {
        q[q.None = 0] = "None", q[q.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", q[q.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", q[q.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", q[q.InvalidUnicode = 4] = "InvalidUnicode", q[q.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", q[q.InvalidCharacter = 6] = "InvalidCharacter"
    })(LF7 || (LF7 = {}));
    (function(q) {
        q[q.OpenBraceToken = 1] = "OpenBraceToken", q[q.CloseBraceToken = 2] = "CloseBraceToken", q[q.OpenBracketToken = 3] = "OpenBracketToken", q[q.CloseBracketToken = 4] = "CloseBracketToken", q[q.CommaToken = 5] = "CommaToken", q[q.ColonToken = 6] = "ColonToken", q[q.NullKeyword = 7] = "NullKeyword", q[q.TrueKeyword = 8] = "TrueKeyword", q[q.FalseKeyword = 9] = "FalseKeyword", q[q.StringLiteral = 10] = "StringLiteral", q[q.NumericLiteral = 11] = "NumericLiteral", q[q.LineCommentTrivia = 12] = "LineCommentTrivia", q[q.BlockCommentTrivia = 13] = "BlockCommentTrivia", q[q.LineBreakTrivia = 14] = "LineBreakTrivia", q[q.Trivia = 15] = "Trivia", q[q.Unknown = 16] = "Unknown", q[q.EOF = 17] = "EOF"
    })(hF7 || (hF7 = {}));
    eA1 = NF7;
    (function(q) {
        q[q.InvalidSymbol = 1] = "InvalidSymbol", q[q.InvalidNumberFormat = 2] = "InvalidNumberFormat", q[q.PropertyNameExpected = 3] = "PropertyNameExpected", q[q.ValueExpected = 4] = "ValueExpected", q[q.ColonExpected = 5] = "ColonExpected", q[q.CommaExpected = 6] = "CommaExpected", q[q.CloseBraceExpected = 7] = "CloseBraceExpected", q[q.CloseBracketExpected = 8] = "CloseBracketExpected", q[q.EndOfFileExpected = 9] = "EndOfFileExpected", q[q.InvalidCommentToken = 10] = "InvalidCommentToken", q[q.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", q[q.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", q[q.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", q[q.InvalidUnicode = 14] = "InvalidUnicode", q[q.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", q[q.InvalidCharacter = 16] = "InvalidCharacter"
    })(RF7 || (RF7 = {}))
})
// @from(Ln 49555, Col 0)
function xF7(q, K) {
    try {
        return {
            ok: !0,
            value: JSON.parse(XU(q))
        }
    } catch (_) {
        if (K) j6(_);
        return {
            ok: !1
        }
    }
}
// @from(Ln 49569, Col 0)
function uF7(q) {
    if (!q) return null;
    try {
        return eA1(XU(q))
    } catch (K) {
        return j6(K), null
    }
}
// @from(Ln 49578, Col 0)
function Tn5(q) {
    let K = mF7,
        _ = q.length,
        z = K(q);
    if (!z.error || z.done || z.read >= _) return z.values;
    let {
        values: Y,
        read: A
    } = z;
    while (A < _) {
        let O = typeof q === "string" ? q.indexOf(`
`, A) : q.indexOf(10, A);
        if (O === -1) break;
        A = O + 1;
        let w = K(q, A);
        if (w.values.length > 0) Y = Y.concat(w.values);
        if (!w.error || w.done || w.read >= _) break;
        A = w.read
    }
    return Y
}
// @from(Ln 49600, Col 0)
function Vn5(q) {
    let K = q.length,
        _ = 0;
    if (q[0] === 239 && q[1] === 187 && q[2] === 191) _ = 3;
    let z = [];
    while (_ < K) {
        let Y = q.indexOf(10, _);
        if (Y === -1) Y = K;
        let A = q.toString("utf8", _, Y).trim();
        if (_ = Y + 1, !A) continue;
        try {
            z.push(JSON.parse(A))
        } catch {}
    }
    return z
}
// @from(Ln 49617, Col 0)
function kn5(q) {
    let K = XU(q),
        _ = K.length,
        z = 0,
        Y = [];
    while (z < _) {
        let A = K.indexOf(`
`, z);
        if (A === -1) A = _;
        let O = K.substring(z, A).trim();
        if (z = A + 1, !O) continue;
        try {
            Y.push(JSON.parse(O))
        } catch {}
    }
    return Y
}
// @from(Ln 49635, Col 0)
function Nr(q) {
    if (mF7) return Tn5(q);
    if (typeof q === "string") return kn5(q);
    return Vn5(q)
}
// @from(Ln 49640, Col 0)
async function eJ8(q) {
    let w = [];
    try {
        let {
            size: K
        } = await Gn5(q);
        if (K <= hQ6) return Nr(await fn5(q));
        const _ = rz(w, await Zn5(q, "r"), 1);
        let z = Buffer.allocUnsafe(hQ6);
        let Y = 0;
        let A = K - hQ6;
        while (Y < hQ6) {
            let {
                bytesRead: X
            } = await _.read(z, Y, hQ6 - Y, A + Y);
            if (X === 0) break;
            Y += X
        }
        let O = z.indexOf(10);
        if (O !== -1 && O < Y - 1) return Nr(z.subarray(O + 1, Y));
        return Nr(z.subarray(0, Y))
    } catch ($) {
        var j = $,
            H = 1
    } finally {
        var J = oz(w, j, H);
        J && await J
    }
}
// @from(Ln 49670, Col 0)
function BF7(q, K) {
    try {
        if (!q || q.trim() === "") return I6([K], null, 4);
        let _ = XU(q),
            z = eA1(_);
        if (Array.isArray(z)) {
            let Y = z.length,
                w = SF7(_, Y === 0 ? [0] : [Y], K, {
                    formattingOptions: {
                        insertSpaces: !0,
                        tabSize: 4
                    },
                    isArrayInsertion: !0
                });
            if (!w || w.length === 0) {
                let $ = [...z, K];
                return I6($, null, 4)
            }
            return CF7(_, w)
        } else return I6([K], null, 4)
    } catch (_) {
        return j6(_), I6([K], null, 4)
    }
}
// @from(Ln 49694, Col 4)
vn5 = 8192
// @from(Ln 49695, Col 4)
IF7
// @from(Ln 49695, Col 9)
k5
// @from(Ln 49695, Col 13)
mF7
// @from(Ln 49695, Col 18)
hQ6 = 104857600
// @from(Ln 49696, Col 4)
mO = L(() => {
    bF7();
    U8();
    Lm();
    e8();
    IF7 = aX(xF7, (q) => q, 50), k5 = Object.assign(function(K, _ = !0) {
        if (!K) return null;
        let z = K.length > vn5 ? xF7(K, _) : IF7(K, _);
        return z.ok ? z.value : null
    }, {
        cache: IF7.cache
    });
    mF7 = (() => {
        if (typeof Bun > "u") return !1;
        let K = Bun.JSONL;
        if (!K?.parseChunk) return !1;
        return K.parseChunk
    })()
})
// @from(Ln 49716, Col 0)
function u16(q) {
    switch (q) {
        case "userSettings":
            return "user";
        case "projectSettings":
            return "project";
        case "localSettings":
            return "project, gitignored";
        case "flagSettings":
            return "cli flag";
        case "policySettings":
            return "managed"
    }
}
// @from(Ln 49731, Col 0)
function sf6(q) {
    switch (q) {
        case "userSettings":
            return "User";
        case "projectSettings":
            return "Project";
        case "localSettings":
            return "Local";
        case "flagSettings":
            return "Flag";
        case "policySettings":
            return "Managed";
        case "plugin":
            return "Plugin";
        case "built-in":
            return "Built-in"
    }
}
// @from(Ln 49750, Col 0)
function qX8(q) {
    switch (q) {
        case "userSettings":
            return "user settings";
        case "projectSettings":
            return "shared project settings";
        case "localSettings":
            return "project local settings";
        case "flagSettings":
            return "command line arguments";
        case "policySettings":
            return "enterprise managed settings";
        case "cliArg":
            return "CLI argument";
        case "command":
            return "command configuration";
        case "session":
            return "current session"
    }
}
// @from(Ln 49771, Col 0)
function pF7(q) {
    switch (q) {
        case "userSettings":
            return "User settings";
        case "projectSettings":
            return "Shared project settings";
        case "localSettings":
            return "Project local settings";
        case "flagSettings":
            return "Command line arguments";
        case "policySettings":
            return "Enterprise managed settings";
        case "cliArg":
            return "CLI argument";
        case "command":
            return "Command configuration";
        case "session":
            return "Current session"
    }
}
// @from(Ln 49792, Col 0)
function FF7(q) {
    if (q === "") return [];
    let K = q.split(",").map((z) => z.trim()),
        _ = [];
    for (let z of K) switch (z) {
        case "user":
            _.push("userSettings");
            break;
        case "project":
            _.push("projectSettings");
            break;
        case "local":
            _.push("localSettings");
            break;
        default:
            throw Error(`Invalid setting source: ${z}. Valid options are: user, project, local`)
    }
    return _
}
// @from(Ln 49812, Col 0)
function Er() {
    let q = y81(),
        K = new Set(q);
    return K.add("policySettings"), K.add("flagSettings"), Array.from(K)
}
// @from(Ln 49818, Col 0)
function L2(q) {
    return Er().includes(q)
}
// @from(Ln 49821, Col 4)
wv
// @from(Ln 49821, Col 8)
$v
// @from(Ln 49821, Col 12)
RQ6
// @from(Ln 49821, Col 17)
gF7 = "https://json.schemastore.org/claude-code-settings.json"
// @from(Ln 49822, Col 4)
aY = L(() => {
    y8();
    wv = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"];
    $v = ["userSettings", "projectSettings", "localSettings"], RQ6 = ["localSettings", "projectSettings", "userSettings"]
})
// @from(Ln 49828, Col 0)
function qO1(q) {
    KX8.set(q, Date.now())
}
// @from(Ln 49832, Col 0)
function UF7(q, K) {
    let _ = KX8.get(q);
    if (_ !== void 0 && Date.now() - _ < K) return KX8.delete(q), !0;
    return !1
}
// @from(Ln 49838, Col 0)
function QF7() {
    KX8.clear()
}
// @from(Ln 49841, Col 4)
KX8
// @from(Ln 49842, Col 4)
_X8 = L(() => {
    KX8 = new Map
})
// @from(Ln 49848, Col 4)
SW
// @from(Ln 49848, Col 8)
ZU
// @from(Ln 49849, Col 4)
Rm = L(() => {
    U4();
    NK();
    SW = P1(function() {
        switch (y1()) {
            case "macos":
                return "/Library/Application Support/ClaudeCode";
            case "windows":
                return "C:\\Program Files\\ClaudeCode";
            default:
                return "/etc/claude-code"
        }
    }), ZU = P1(function() {
        return Nn5(SW(), "managed-settings.d")
    })
})
// @from(Ln 49866, Col 0)
function C6(q) {
    let K;
    return () => K ??= q()
}
// @from(Ln 49870, Col 4)
En5
// @from(Ln 49870, Col 9)
yn5
// @from(Ln 49870, Col 14)
dF7
// @from(Ln 49871, Col 4)
cF7 = L(() => {
    p7();
    En5 = C6(() => y.object({
        allowedDomains: y.array(y.string()).optional(),
        allowManagedDomainsOnly: y.boolean().optional().describe("When true (and set in managed settings), only allowedDomains and WebFetch(domain:...) allow rules from managed settings are respected. User, project, local, and flag settings domains are ignored. Denied domains are still respected from all sources."),
        allowUnixSockets: y.array(y.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
        allowAllUnixSockets: y.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
        allowLocalBinding: y.boolean().optional(),
        allowMachLookup: y.array(y.string().refine((q) => {
            return !(q.endsWith("*") ? q.slice(0, -1) : q).includes("*")
        }, {
            message: 'Wildcards are only allowed as a single trailing "*" (e.g., "com.example.*" or "*" for all services).'
        })).optional().describe('macOS only: Additional XPC/Mach service names to allow looking up. Supports trailing-wildcard prefix matching (e.g., "com.apple.coresimulator.*"). Needed for tools that communicate via XPC such as the iOS Simulator or Playwright.'),
        httpProxyPort: y.number().optional(),
        socksProxyPort: y.number().optional()
    }).optional()), yn5 = C6(() => y.object({
        allowWrite: y.array(y.string()).optional().describe("Additional paths to allow writing within the sandbox. Merged with paths from Edit(...) allow permission rules."),
        denyWrite: y.array(y.string()).optional().describe("Additional paths to deny writing within the sandbox. Merged with paths from Edit(...) deny permission rules."),
        denyRead: y.array(y.string()).optional().describe("Additional paths to deny reading within the sandbox. Merged with paths from Read(...) deny permission rules."),
        allowRead: y.array(y.string()).optional().describe("Paths to re-allow reading within denyRead regions. Takes precedence over denyRead for matching paths."),
        allowManagedReadPathsOnly: y.boolean().optional().describe("When true (set in managed settings), only allowRead paths from policySettings are used.")
    }).optional()), dF7 = C6(() => y.object({
        enabled: y.boolean().optional(),
        failIfUnavailable: y.boolean().optional().describe("Exit with an error at startup if sandbox.enabled is true but the sandbox cannot start (missing dependencies, unsupported platform, or platform not in enabledPlatforms). When false (default), a warning is shown and commands run unsandboxed. Intended for managed-settings deployments that require sandboxing as a hard gate."),
        autoAllowBashIfSandboxed: y.boolean().optional(),
        allowUnsandboxedCommands: y.boolean().optional().describe("Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. When false, the dangerouslyDisableSandbox parameter is completely ignored and all commands must run sandboxed. Default: true."),
        network: En5(),
        filesystem: yn5(),
        ignoreViolations: y.record(y.string(), y.array(y.string())).optional(),
        enableWeakerNestedSandbox: y.boolean().optional(),
        enableWeakerNetworkIsolation: y.boolean().optional().describe("macOS only: Allow access to com.apple.trustd.agent in the sandbox. Needed for Go-based CLI tools (gh, gcloud, terraform, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. " + "**Reduces security** — opens a potential data exfiltration vector through the trustd service. Default: false"),
        excludedCommands: y.array(y.string()).optional(),
        ripgrep: y.object({
            command: y.string(),
            args: y.array(y.string()).optional()
        }).optional().describe("Custom ripgrep configuration for bundled ripgrep support")
    }).passthrough())
})
// @from(Ln 49910, Col 0)
function m16() {
    return process.versions.bun !== void 0
}
// @from(Ln 49914, Col 0)
function v$() {
    return typeof Bun < "u" && Array.isArray(Bun.embeddedFiles) && Bun.embeddedFiles.length > 0
}
// @from(Ln 49923, Col 0)
async function tf6(q) {
    try {
        return !!await oA(q)
    } catch {
        return !1
    }
}
// @from(Ln 49931, Col 0)
function bn5() {
    return process.env.__CFBundleIdentifier === "com.conductor.app"
}
// @from(Ln 49935, Col 0)
function In5() {
    if (process.env.CURSOR_TRACE_ID) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("cursor")) return "cursor";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("windsurf")) return "windsurf";
    if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("antigravity")) return "antigravity";
    let q = process.env.__CFBundleIdentifier?.toLowerCase();
    if (q?.includes("vscodium")) return "codium";
    if (q?.includes("windsurf")) return "windsurf";
    if (q?.includes("com.google.android.studio")) return "androidstudio";
    if (q) {
        for (let K of _O1)
            if (q.includes(K)) return K
    }
    if (process.env.VisualStudioVersion) return "visualstudio";
    if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
        if (process.platform === "darwin") return "pycharm";
        return "pycharm"
    }
    if (process.env.TERM === "xterm-ghostty") return "ghostty";
    if (process.env.TERM?.includes("kitty")) return "kitty";
    if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM;
    if (process.env.TMUX) return "tmux";
    if (process.env.STY) return "screen";
    if (process.env.KONSOLE_VERSION) return "konsole";
    if (process.env.GNOME_TERMINAL_SERVICE) return "gnome-terminal";
    if (process.env.XTERM_VERSION) return "xterm";
    if (process.env.VTE_VERSION) return "vte-based";
    if (process.env.TERMINATOR_UUID) return "terminator";
    if (process.env.KITTY_WINDOW_ID) return "kitty";
    if (process.env.ALACRITTY_LOG) return "alacritty";
    if (process.env.TILIX_ID) return "tilix";
    if (process.env.WT_SESSION) return "windows-terminal";
    if (process.env.SESSIONNAME && process.env.TERM === "cygwin") return "cygwin";
    if (process.env.MSYSTEM) return process.env.MSYSTEM.toLowerCase();
    if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return "conemu";
    if (process.env.WSL_DISTRO_NAME) return `wsl-${process.env.WSL_DISTRO_NAME}`;
    if (nF7()) return "ssh-session";
    if (process.env.TERM) {
        let K = process.env.TERM;
        if (K.includes("alacritty")) return "alacritty";
        if (K.includes("rxvt")) return "rxvt";
        if (K.includes("termite")) return "termite";
        return process.env.TERM
    }
    if (!process.stdout.isTTY) return "non-interactive";
    return null
}
// @from(Ln 49983, Col 0)
function nF7() {
    return !!(process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY)
}
// @from(Ln 49987, Col 0)
function ef6() {
    let q = process.env.CLAUDE_CODE_HOST_PLATFORM;
    if (q === "win32" || q === "darwin" || q === "linux") return q;
    return X7.platform
}
// @from(Ln 49992, Col 4)
QZ
// @from(Ln 49992, Col 8)
hn5
// @from(Ln 49992, Col 13)
Rn5
// @from(Ln 49992, Col 18)
Sn5
// @from(Ln 49992, Col 23)
lF7
// @from(Ln 49992, Col 28)
Cn5
// @from(Ln 49992, Col 33)
_O1
// @from(Ln 49992, Col 38)
xn5
// @from(Ln 49992, Col 43)
X7
// @from(Ln 49993, Col 4)
D_ = L(() => {
    U4();
    z3();
    Q8();
    Yq();
    n0();
    QZ = P1(() => {
        if (V8().existsSync(KO1(A7(), ".config.json"))) return KO1(A7(), ".config.json");
        let q = `.claude${YY1()}.json`;
        return KO1(process.env.CLAUDE_CONFIG_DIR || Ln5(), q)
    }), hn5 = P1(async () => {
        try {
            let {
                default: q
            } = await Promise.resolve().then(() => (CK(), Jf6));
            return await q.head("http://1.1.1.1", {
                signal: AbortSignal.timeout(1000)
            }), !0
        } catch {
            return !1
        }
    });
    Rn5 = P1(async () => {
        let q = [];
        if (await tf6("npm")) q.push("npm");
        if (await tf6("yarn")) q.push("yarn");
        if (await tf6("pnpm")) q.push("pnpm");
        return q
    }), Sn5 = P1(async () => {
        let q = [];
        if (await tf6("bun")) q.push("bun");
        if (await tf6("deno")) q.push("deno");
        if (await tf6("node")) q.push("node");
        return q
    }), lF7 = P1(() => {
        try {
            return V8().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")
        } catch (q) {
            return !1
        }
    }), Cn5 = P1(() => {
        try {
            if (!lF7()) return !1;
            let q = rN("npm");
            if (q === null) return !1;
            return q.startsWith("/mnt/c/")
        } catch (q) {
            return !1
        }
    });
    _O1 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];
    xn5 = P1(() => {
        if (S6(process.env.CODESPACES)) return "codespaces";
        if (process.env.GITPOD_WORKSPACE_ID) return "gitpod";
        if (S6(process.env.CODER) || process.env.CODER_WORKSPACE_NAME) return "coder";
        if (S6(process.env.DEVPOD) || process.env.DEVPOD_WORKSPACE_UID) return "devpod";
        if (process.env.DAYTONA_WS_ID) return "daytona";
        if (process.env.CLOUD_WORKSTATIONS_CLUSTER_ID) return "gcp-cloud-workstations";
        if (process.env.C9_PID || process.env.C9_USER) return "aws-cloud9";
        if (process.env.REPL_ID || process.env.REPL_SLUG) return "replit";
        if (process.env.PROJECT_DOMAIN) return "glitch";
        if (S6(process.env.VERCEL)) return "vercel";
        if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME) return "railway";
        if (S6(process.env.RENDER)) return "render";
        if (S6(process.env.NETLIFY)) return "netlify";
        if (process.env.DYNO) return "heroku";
        if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID) return "fly.io";
        if (S6(process.env.CF_PAGES)) return "cloudflare-pages";
        if (process.env.DENO_DEPLOYMENT_ID) return "deno-deploy";
        if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws-lambda";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE") return "aws-fargate";
        if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2") return "aws-ecs";
        try {
            if (V8().readFileSync("/sys/hypervisor/uuid", {
                    encoding: "utf8"
                }).trim().toLowerCase().startsWith("ec2")) return "aws-ec2"
        } catch {}
        if (process.env.K_SERVICE) return "gcp-cloud-run";
        if (process.env.GOOGLE_CLOUD_PROJECT) return "gcp";
        if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU) return "azure-app-service";
        if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) return "azure-functions";
        if (process.env.APP_URL?.includes("ondigitalocean.app")) return "digitalocean-app-platform";
        if (process.env.SPACE_CREATOR_USER_ID) return "huggingface-spaces";
        if (S6(process.env.GITHUB_ACTIONS)) return "github-actions";
        if (S6(process.env.GITLAB_CI)) return "gitlab-ci";
        if (process.env.CIRCLECI) return "circleci";
        if (process.env.BUILDKITE) return "buildkite";
        if (S6(!1)) return "ci";
        if (process.env.KUBERNETES_SERVICE_HOST) return "kubernetes";
        try {
            if (V8().existsSync("/.dockerenv")) return "docker"
        } catch {}
        if (X7.platform === "darwin") return "unknown-darwin";
        if (X7.platform === "linux") return "unknown-linux";
        if (X7.platform === "win32") return "unknown-win32";
        return "unknown"
    });
    X7 = {
        hasInternetAccess: hn5,
        isCI: S6(!1),
        platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
        arch: process.arch,
        nodeVersion: process.version,
        terminal: In5(),
        isSSH: nF7,
        getPackageManagers: Rn5,
        getRuntimes: Sn5,
        isRunningWithBun: P1(m16),
        isWslEnvironment: lF7,
        isNpmFromWindowsPath: Cn5,
        isConductor: bn5,
        detectDeploymentEnvironment: xn5
    }
})
// @from(Ln 50107, Col 4)
$9
// @from(Ln 50107, Col 8)
iF7 = "∙"
// @from(Ln 50108, Col 4)
rF7 = "⌕"
// @from(Ln 50109, Col 4)
EV = "✻"
// @from(Ln 50110, Col 4)
oF7 = "↑"
// @from(Ln 50111, Col 4)
zX8 = "↓"
// @from(Ln 50112, Col 4)
zO1 = "←"
// @from(Ln 50113, Col 4)
aF7 = "→"
// @from(Ln 50114, Col 4)
B16 = "↯"
// @from(Ln 50115, Col 4)
sF7 = "○"
// @from(Ln 50116, Col 4)
YX8 = "◐"
// @from(Ln 50117, Col 4)
YO1 = "●"
// @from(Ln 50118, Col 4)
tF7 = "◉"
// @from(Ln 50119, Col 4)
eF7 = "◈"
// @from(Ln 50120, Col 4)
qg7 = "▶"
// @from(Ln 50121, Col 4)
AX8 = "⏸"
// @from(Ln 50122, Col 4)
Kg7 = "↻"
// @from(Ln 50123, Col 4)
_g7 = "←"
// @from(Ln 50124, Col 4)
eH = "◇"
// @from(Ln 50125, Col 4)
dZ = "◆"
// @from(Ln 50126, Col 4)
zg7 = "※"
// @from(Ln 50127, Col 4)
Yg7 = "⚠"
// @from(Ln 50128, Col 4)
Ag7 = "▎"
// @from(Ln 50129, Col 4)
Og7 = "─"
// @from(Ln 50130, Col 4)
SQ6
// @from(Ln 50130, Col 9)
OX8 = "·✔︎·"
// @from(Ln 50131, Col 4)
wX8 = "×"
// @from(Ln 50132, Col 4)
fU
// @from(Ln 50133, Col 4)
A3 = L(() => {
    D_();
    $9 = X7.platform === "darwin" ? "⏺" : "●", SQ6 = ["·|·", "·/·", "·—·", "·\\·"], fU = {
        branch: "├",
        last: "└",
        pipe: "│"
    }
})
// @from(Ln 50141, Col 4)
AO1 = {}
// @from(Ln 50147, Col 4)
p16
// @from(Ln 50147, Col 9)
wg7
// @from(Ln 50147, Col 14)
jv
// @from(Ln 50148, Col 4)
qG6 = L(() => {
    p16 = ["acceptEdits", "auto", "bypassPermissions", "default", "dontAsk", "plan"], wg7 = [...p16], jv = wg7
})
// @from(Ln 50152, Col 0)
function Jg7(q) {
    return q !== "bubble"
}
// @from(Ln 50156, Col 0)
function $X8(q) {
    return $g7[q] ?? $g7.default
}
// @from(Ln 50160, Col 0)
function Sm(q) {
    return $X8(q).external
}
// @from(Ln 50164, Col 0)
function yV(q) {
    return jv.includes(q) ? q : "default"
}
// @from(Ln 50168, Col 0)
function yr(q) {
    return $X8(q).title
}
// @from(Ln 50172, Col 0)
function Xg7(q) {
    return q === "default" || q === void 0
}
// @from(Ln 50176, Col 0)
function jX8(q, K) {
    if (q === "auto") return "classify";
    if (q === "bypassPermissions" || q === "plan" && K) return "allow";
    if (q === "dontAsk") return "deny";
    return "ask"
}
// @from(Ln 50183, Col 0)
function CQ6(q) {
    return $X8(q).symbol
}
// @from(Ln 50187, Col 0)
function LV(q) {
    return $X8(q).color
}
// @from(Ln 50190, Col 4)
jg7
// @from(Ln 50190, Col 9)
Hg7
// @from(Ln 50190, Col 14)
$g7
// @from(Ln 50191, Col 4)
OP = L(() => {
    p7();
    A3();
    qG6();
    jg7 = C6(() => fK.enum(jv)), Hg7 = C6(() => fK.enum(p16)), $g7 = {
        default: {
            title: "Default",
            shortTitle: "Default",
            symbol: "",
            color: "text",
            external: "default"
        },
        plan: {
            title: "Plan Mode",
            shortTitle: "Plan",
            symbol: AX8,
            color: "planMode",
            external: "plan"
        },
        acceptEdits: {
            title: "Accept edits",
            shortTitle: "Accept",
            symbol: "⏵⏵",
            color: "autoAccept",
            external: "acceptEdits"
        },
        bypassPermissions: {
            title: "Bypass Permissions",
            shortTitle: "Bypass",
            symbol: "⏵⏵",
            color: "error",
            external: "bypassPermissions"
        },
        dontAsk: {
            title: "Don't Ask",
            shortTitle: "DontAsk",
            symbol: "⏵⏵",
            color: "error",
            external: "dontAsk"
        },
        auto: {
            title: "Auto mode",
            shortTitle: "Auto",
            symbol: "⏵⏵",
            color: "warning",
            external: "auto"
        }
    }
})
// @from(Ln 50240, Col 4)
hV
// @from(Ln 50240, Col 8)
F16 = "__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__"
// @from(Ln 50241, Col 4)
HX8 = L(() => {
    hV = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "StopFailure", "SubagentStart", "SubagentStop", "PreCompact", "PostCompact", "PermissionRequest", "PermissionDenied", "Setup", "TeammateIdle", "TaskCreated", "TaskCompleted", "Elicitation", "ElicitationResult", "ConfigChange", "WorktreeCreate", "WorktreeRemove", "InstructionsLoaded", "CwdChanged", "FileChanged"]
})
// @from(Ln 50244, Col 4)
Mg7 = () => {}
// @from(Ln 50245, Col 4)
pA6 = L(() => {
    HX8();
    Mg7()
})
// @from(Ln 50249, Col 4)
Pg7
// @from(Ln 50249, Col 9)
KG6 = "bash"
// @from(Ln 50250, Col 4)
JX8 = L(() => {
    Pg7 = ["bash", "powershell"]
})
// @from(Ln 50254, Col 0)
function un5() {
    let q = y.object({
            type: y.literal("command").describe("Shell command hook type"),
            command: y.string().describe("Shell command to execute"),
            if: XX8(),
            shell: y.enum(Pg7).optional().describe("Shell interpreter. 'bash' uses your $SHELL (bash/zsh/sh); 'powershell' uses pwsh. Defaults to bash."),
            timeout: y.number().positive().optional().describe("Timeout in seconds for this specific command"),
            statusMessage: y.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: y.boolean().optional().describe("If true, hook runs once and is removed after execution"),
            async: y.boolean().optional().describe("If true, hook runs in background without blocking"),
            asyncRewake: y.boolean().optional().describe("If true, hook runs in background and wakes the model on exit code 2 (blocking error). Implies async."),
            rewakeMessage: y.string().min(1).optional().describe("@internal Custom prefix for the system-reminder shown to the model when an asyncRewake hook exits with code 2. The hook output is appended after this prefix."),
            rewakeSummary: y.string().min(1).optional().describe('@internal One-line summary shown to the user in the terminal when an asyncRewake hook exits with code 2. Defaults to "Stop hook feedback".')
        }),
        K = y.object({
            type: y.literal("prompt").describe("LLM prompt hook type"),
            prompt: y.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
            if: XX8(),
            timeout: y.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
            model: y.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-6"). If not specified, uses the default small fast model.'),
            statusMessage: y.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: y.boolean().optional().describe("If true, hook runs once and is removed after execution")
        }),
        _ = y.object({
            type: y.literal("http").describe("HTTP hook type"),
            url: y.string().url().describe("URL to POST the hook input JSON to"),
            if: XX8(),
            timeout: y.number().positive().optional().describe("Timeout in seconds for this specific request"),
            headers: y.record(y.string(), y.string()).optional().describe('Additional headers to include in the request. Values may reference environment variables using $VAR_NAME or ${VAR_NAME} syntax (e.g., "Authorization": "Bearer $MY_TOKEN"). Only variables listed in allowedEnvVars will be interpolated.'),
            allowedEnvVars: y.array(y.string()).optional().describe("Explicit list of environment variable names that may be interpolated in header values. Only variables listed here will be resolved; all other $VAR references are left as empty strings. Required for env var interpolation to work."),
            statusMessage: y.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: y.boolean().optional().describe("If true, hook runs once and is removed after execution")
        }),
        z = y.object({
            type: y.literal("agent").describe("Agentic verifier hook type"),
            prompt: y.string().describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
            if: XX8(),
            timeout: y.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
            model: y.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-6"). If not specified, uses Haiku.'),
            statusMessage: y.string().optional().describe("Custom status message to display in spinner while hook runs"),
            once: y.boolean().optional().describe("If true, hook runs once and is removed after execution")
        });
    return {
        BashCommandHookSchema: q,
        PromptHookSchema: K,
        HttpHookSchema: _,
        AgentHookSchema: z
    }
}
// @from(Ln 50303, Col 4)
XX8
// @from(Ln 50303, Col 9)
Wg7
// @from(Ln 50303, Col 14)
Dg7
// @from(Ln 50303, Col 19)
sN
// @from(Ln 50304, Col 4)
MX8 = L(() => {
    pA6();
    p7();
    JX8();
    XX8 = C6(() => y.string().optional().describe('Permission rule syntax to filter when this hook runs (e.g., "Bash(git *)"). Only runs if the tool call matches the pattern. Avoids spawning hooks for non-matching commands.'));
    Wg7 = C6(() => {
        let {
            BashCommandHookSchema: q,
            PromptHookSchema: K,
            AgentHookSchema: _,
            HttpHookSchema: z
        } = un5();
        return y.discriminatedUnion("type", [q, K, _, z])
    }), Dg7 = C6(() => y.object({
        matcher: y.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
        hooks: y.array(Wg7()).describe("List of hooks to execute when the matcher matches")
    })), sN = C6(() => y.partialRecord(y.enum(hV), y.array(Dg7())))
})
// @from(Ln 50322, Col 4)
OO1
// @from(Ln 50322, Col 9)
C5O
// @from(Ln 50322, Col 14)
wO1
// @from(Ln 50322, Col 19)
mn5
// @from(Ln 50322, Col 24)
Zg7
// @from(Ln 50322, Col 29)
Bn5
// @from(Ln 50322, Col 34)
pn5
// @from(Ln 50322, Col 39)
Fn5
// @from(Ln 50322, Col 44)
gn5
// @from(Ln 50322, Col 49)
Un5
// @from(Ln 50322, Col 54)
Qn5
// @from(Ln 50322, Col 59)
dn5
// @from(Ln 50322, Col 64)
GU
// @from(Ln 50322, Col 68)
fg7
// @from(Ln 50323, Col 4)
FA6 = L(() => {
    p7();
    OO1 = C6(() => y.enum(["local", "user", "project", "dynamic", "enterprise", "claudeai", "managed"])), C5O = C6(() => y.enum(["stdio", "sse", "sse-ide", "http", "ws", "sdk"])), wO1 = C6(() => y.object({
        type: y.literal("stdio").optional(),
        command: y.string().min(1, "Command cannot be empty"),
        args: y.array(y.string()).default([]),
        env: y.record(y.string(), y.string()).optional()
    })), mn5 = C6(() => y.boolean()), Zg7 = C6(() => y.object({
        clientId: y.string().optional(),
        callbackPort: y.number().int().positive().optional(),
        authServerMetadataUrl: y.string().url().startsWith("https://", {
            message: "authServerMetadataUrl must use https://"
        }).optional(),
        scopes: y.string().min(1).optional(),
        xaa: mn5().optional()
    })), Bn5 = C6(() => y.object({
        type: y.literal("sse"),
        url: y.string(),
        headers: y.record(y.string(), y.string()).optional(),
        headersHelper: y.string().optional(),
        oauth: Zg7().optional()
    })), pn5 = C6(() => y.object({
        type: y.literal("sse-ide"),
        url: y.string(),
        ideName: y.string(),
        ideRunningInWindows: y.boolean().optional()
    })), Fn5 = C6(() => y.object({
        type: y.literal("ws-ide"),
        url: y.string(),
        ideName: y.string(),
        authToken: y.string().optional(),
        ideRunningInWindows: y.boolean().optional()
    })), gn5 = C6(() => y.object({
        type: y.literal("http"),
        url: y.string(),
        headers: y.record(y.string(), y.string()).optional(),
        headersHelper: y.string().optional(),
        oauth: Zg7().optional()
    })), Un5 = C6(() => y.object({
        type: y.literal("ws"),
        url: y.string(),
        headers: y.record(y.string(), y.string()).optional(),
        headersHelper: y.string().optional()
    })), Qn5 = C6(() => y.object({
        type: y.literal("sdk"),
        name: y.string()
    })), dn5 = C6(() => y.object({
        type: y.literal("claudeai-proxy"),
        url: y.string(),
        id: y.string()
    })), GU = C6(() => y.union([wO1(), Bn5(), pn5(), Fn5(), gn5(), Un5(), Qn5(), dn5()])), fg7 = C6(() => y.object({
        mcpServers: y.record(y.string(), GU())
    }))
})
// @from(Ln 50378, Col 0)
function bQ6(q, K) {
    let _ = q.toLowerCase();
    return K.autoUpdate ?? (vU.has(_) && !cn5.has(_))
}
// @from(Ln 50383, Col 0)
function in5(q) {
    if (vU.has(q.toLowerCase())) return !1;
    if (nn5.test(q)) return !0;
    return ln5.test(q)
}
// @from(Ln 50389, Col 0)
function on5(q) {
    let K = q.trim(),
        _ = /^git@github\.com:anthropics\/(.+)$/i.exec(K);
    if (_) return !(_[1] ?? "").split("/").includes("..");
    try {
        let z = new URL(K);
        if (!rn5.has(z.protocol.toLowerCase())) return !1;
        if (z.pathname.split("/").includes("..")) return !1;
        return z.hostname.toLowerCase() === "github.com" && z.pathname.toLowerCase().startsWith("/anthropics/")
    } catch {
        return !1
    }
}
// @from(Ln 50403, Col 0)
function Tg7(q, K) {
    let _ = q.toLowerCase();
    if (!vU.has(_)) return null;
    if (K.source === "github") {
        let z = K.repo || "";
        if (!z.toLowerCase().startsWith(`${PX8}/`) || z.split("/").includes("..")) return `The name '${q}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${PX8}/' can use this name.`;
        return null
    }
    if (K.source === "git" && K.url) {
        if (on5(K.url)) return null;
        return `The name '${q}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${PX8}/' can use this name.`
    }
    return `The name '${q}' is reserved for official Anthropic marketplaces and can only be used with GitHub sources from the '${PX8}' organization.`
}
// @from(Ln 50418, Col 0)
function uQ6(q) {
    return typeof q === "string" && q.startsWith("./")
}
// @from(Ln 50422, Col 0)
function Wh(q) {
    return q.source === "file" || q.source === "directory"
}
// @from(Ln 50425, Col 4)
vU
// @from(Ln 50425, Col 8)
cn5
// @from(Ln 50425, Col 13)
ln5
// @from(Ln 50425, Col 18)
nn5
// @from(Ln 50425, Col 23)
PX8 = "anthropics"
// @from(Ln 50426, Col 4)
rn5
// @from(Ln 50426, Col 9)
Lr
// @from(Ln 50426, Col 13)
gA6
// @from(Ln 50426, Col 18)
Gg7
// @from(Ln 50426, Col 23)
jO1
// @from(Ln 50426, Col 28)
HO1
// @from(Ln 50426, Col 33)
Vg7
// @from(Ln 50426, Col 38)
JO1
// @from(Ln 50426, Col 43)
an5
// @from(Ln 50426, Col 48)
WX8
// @from(Ln 50426, Col 53)
sn5
// @from(Ln 50426, Col 58)
tn5
// @from(Ln 50426, Col 63)
en5
// @from(Ln 50426, Col 68)
qi5
// @from(Ln 50426, Col 73)
Ki5
// @from(Ln 50426, Col 78)
_i5
// @from(Ln 50426, Col 83)
vg7
// @from(Ln 50426, Col 88)
zi5
// @from(Ln 50426, Col 93)
Yi5
// @from(Ln 50426, Col 98)
kg7
// @from(Ln 50426, Col 103)
Ai5
// @from(Ln 50426, Col 108)
Oi5
// @from(Ln 50426, Col 113)
_G6
// @from(Ln 50426, Col 118)
wi5
// @from(Ln 50426, Col 123)
XO1
// @from(Ln 50426, Col 128)
$i5
// @from(Ln 50426, Col 133)
ji5
// @from(Ln 50426, Col 138)
Ng7
// @from(Ln 50426, Col 143)
Hi5
// @from(Ln 50426, Col 148)
IQ6
// @from(Ln 50426, Col 153)
xQ6
// @from(Ln 50426, Col 158)
$O1
// @from(Ln 50426, Col 163)
Eg7
// @from(Ln 50426, Col 168)
Ji5
// @from(Ln 50426, Col 173)
MO1
// @from(Ln 50426, Col 178)
g16
// @from(Ln 50426, Col 183)
DX8
// @from(Ln 50426, Col 188)
Xi5
// @from(Ln 50426, Col 193)
Mi5
// @from(Ln 50426, Col 198)
Pi5
// @from(Ln 50426, Col 203)
mQ6
// @from(Ln 50426, Col 208)
Wi5
// @from(Ln 50426, Col 213)
Di5
// @from(Ln 50426, Col 218)
BQ6
// @from(Ln 50426, Col 223)
B5O
// @from(Ln 50426, Col 228)
Zi5
// @from(Ln 50426, Col 233)
zG6
// @from(Ln 50427, Col 4)
Hv = L(() => {
    p7();
    MX8();
    FA6();
    vU = new Set(["claude-code-marketplace", "claude-code-plugins", "claude-plugins-official", "anthropic-marketplace", "anthropic-plugins", "agent-skills", "life-sciences", "knowledge-work-plugins"]), cn5 = new Set(["knowledge-work-plugins"]);
    ln5 = /(?:official[^a-z0-9]*(anthropic|claude)|(?:anthropic|claude)[^a-z0-9]*official|^(?:anthropic|claude)[^a-z0-9]*(marketplace|plugins|official))/i, nn5 = /[^\u0020-\u007E]/;
    rn5 = new Set(["https:", "http:", "git:", "git+https:", "git+http:", "git+ssh:", "ssh:"]);
    Lr = C6(() => y.string().startsWith("./")), gA6 = C6(() => Lr().endsWith(".json")), Gg7 = C6(() => y.union([Lr().refine((q) => q.endsWith(".mcpb") || q.endsWith(".dxt"), {
        message: "MCPB file path must end with .mcpb or .dxt"
    }).describe("Path to MCPB file relative to plugin root"), y.string().url().refine((q) => q.endsWith(".mcpb") || q.endsWith(".dxt"), {
        message: "MCPB URL must end with .mcpb or .dxt"
    }).describe("URL to MCPB file")])), jO1 = C6(() => Lr().endsWith(".md")), HO1 = C6(() => y.union([jO1(), Lr()])), Vg7 = C6(() => y.string().min(1, "Marketplace must have a name").refine((q) => !q.includes(" "), {
        message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")'
    }).refine((q) => !q.includes("/") && !q.includes("\\") && !q.includes("..") && q !== ".", {
        message: 'Marketplace name cannot contain path separators (/ or \\), ".." sequences, or be "."'
    }).refine((q) => !in5(q), {
        message: "Marketplace name impersonates an official Anthropic/Claude marketplace"
    }).refine((q) => q.toLowerCase() !== "inline", {
        message: 'Marketplace name "inline" is reserved for --plugin-dir session plugins'
    }).refine((q) => q.toLowerCase() !== "builtin", {
        message: 'Marketplace name "builtin" is reserved for built-in plugins'
    })), JO1 = C6(() => y.object({
        name: y.string().min(1, "Author name cannot be empty").describe("Display name of the plugin author or organization"),
        email: y.string().optional().describe("Contact email for support or feedback"),
        url: y.string().optional().describe("Website, GitHub profile, or organization URL")
    })), an5 = C6(() => y.object({
        name: y.string().min(1, "Plugin name cannot be empty").refine((q) => !q.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier for the plugin, used for namespacing (prefer kebab-case)"),
        version: y.string().optional().describe("Semantic version (e.g., 1.2.3) following semver.org specification"),
        description: y.string().optional().describe("Brief, user-facing explanation of what the plugin provides"),
        author: JO1().optional().describe("Information about the plugin creator or maintainer"),
        homepage: y.string().url().optional().describe("Plugin homepage or documentation URL"),
        repository: y.string().optional().describe("Source code repository URL"),
        license: y.string().optional().describe("SPDX license identifier (e.g., MIT, Apache-2.0)"),
        keywords: y.array(y.string()).optional().describe("Tags for plugin discovery and categorization"),
        dependencies: y.array(Mi5()).optional().describe(`Plugins that must be enabled for this plugin to function. Bare names (no "@marketplace") are resolved against the declaring plugin's own marketplace.`)
    })), WX8 = C6(() => y.object({
        description: y.string().optional().describe("Brief, user-facing explanation of what these hooks provide"),
        hooks: y.lazy(() => sN()).describe("The hooks provided by the plugin, in the same format as the one used for settings")
    })), sn5 = C6(() => y.object({
        hooks: y.union([gA6().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), y.lazy(() => sN()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)"), y.array(y.union([gA6().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"), y.lazy(() => sN()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)")]))])
    })), tn5 = C6(() => y.object({
        source: HO1().optional().describe("Path to command markdown file, relative to plugin root"),
        content: y.string().optional().describe("Inline markdown content for the command"),
        description: y.string().optional().describe("Command description override"),
        argumentHint: y.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
        model: y.string().optional().describe("Default model for this command"),
        allowedTools: y.array(y.string()).optional().describe("Tools allowed when command runs")
    }).refine((q) => q.source && !q.content || !q.source && q.content, {
        message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both'
    })), en5 = C6(() => y.object({
        commands: y.union([HO1().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root"), y.array(HO1().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional command files or skill directories"), y.record(y.string(), tn5()).describe('Object mapping of command names to their metadata and source files. Command name becomes the slash command name (e.g., "about" → "/plugin:about")')])
    })), qi5 = C6(() => y.object({
        agents: y.union([jO1().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root"), y.array(jO1().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional agent files")])
    })), Ki5 = C6(() => y.object({
        skills: y.union([Lr().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"), y.array(Lr().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional skill directories")])
    })), _i5 = C6(() => y.object({
        outputStyles: y.union([Lr().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root"), y.array(Lr().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional output styles directories or files")])
    })), vg7 = C6(() => y.string().min(1)), zi5 = C6(() => y.string().min(2).refine((q) => q.startsWith("."), {
        message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
    })), Yi5 = C6(() => y.object({
        mcpServers: y.union([gA6().describe("MCP servers to include in the plugin (in addition to those in the .mcp.json file, if it exists)"), Gg7().describe("Path or URL to MCPB file containing MCP server configuration"), y.record(y.string(), GU()).describe("MCP server configurations keyed by server name"), y.array(y.union([gA6().describe("Path to MCP servers configuration file"), Gg7().describe("Path or URL to MCPB file"), y.record(y.string(), GU()).describe("Inline MCP server configurations")])).describe("Array of MCP server configurations (paths, MCPB files, or inline definitions)")])
    })), kg7 = C6(() => y.object({
        type: y.enum(["string", "number", "boolean", "directory", "file"]).describe("Type of the configuration value"),
        title: y.string().describe("Human-readable label shown in the config dialog"),
        description: y.string().describe("Help text shown beneath the field in the config dialog"),
        required: y.boolean().optional().describe("If true, validation fails when this field is empty"),
        default: y.union([y.string(), y.number(), y.boolean(), y.array(y.string())]).optional().describe("Default value used when the user provides nothing"),
        multiple: y.boolean().optional().describe("For string type: allow an array of strings"),
        sensitive: y.boolean().optional().describe("If true, masks dialog input and stores value in secure storage (keychain/credentials file) instead of settings.json"),
        min: y.number().optional().describe("Minimum value (number type only)"),
        max: y.number().optional().describe("Maximum value (number type only)")
    }).strict()), Ai5 = C6(() => y.object({
        userConfig: y.record(y.string().regex(/^[A-Za-z_]\w*$/, "Option keys must be valid identifiers (letters, digits, underscore; no leading digit) — they become CLAUDE_PLUGIN_OPTION_<KEY> env vars in hooks"), kg7()).optional().describe("User-configurable values this plugin needs. Prompted at enable time. Non-sensitive values saved to settings.json; sensitive values to secure storage (macOS keychain or .credentials.json). Available as ${user_config.KEY} in MCP/LSP server config, hook commands, and (non-sensitive only) skill/agent content. " + "Note: sensitive values share a single keychain entry with OAuth tokens — keep " + "secret counts small to stay under the ~2KB stdin-safe limit (see INC-3028).")
    })), Oi5 = C6(() => y.object({
        channels: y.array(y.object({
            server: y.string().min(1).describe("Name of the MCP server this channel binds to. Must match a key in this plugin's mcpServers."),
            displayName: y.string().optional().describe('Human-readable name shown in the config dialog title (e.g., "Telegram"). Defaults to the server name.'),
            userConfig: y.record(y.string(), kg7()).optional().describe("Fields to prompt the user for when enabling this plugin in assistant mode. Saved values are substituted into ${user_config.KEY} references in the mcpServers env.")
        }).strict()).describe("Channels this plugin provides. Each entry declares an MCP server as a message channel and optionally specifies user configuration to prompt for at enable time.")
    })), _G6 = C6(() => y.strictObject({
        command: y.string().min(1).refine((q) => {
            if (q.includes(" ") && !q.startsWith("/")) return !1;
            return !0
        }, {
            message: "Command should not contain spaces. Use args array for arguments."
        }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
        args: y.array(vg7()).optional().describe("Command-line arguments to pass to the server"),
        extensionToLanguage: y.record(zi5(), vg7()).refine((q) => Object.keys(q).length > 0, {
            message: "extensionToLanguage must have at least one mapping"
        }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
        transport: y.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
        env: y.record(y.string(), y.string()).optional().describe("Environment variables to set when starting the server"),
        initializationOptions: y.unknown().optional().describe("Initialization options passed to the server during initialization"),
        settings: y.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
        workspaceFolder: y.string().optional().describe("Workspace folder path to use for the server"),
        startupTimeout: y.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
        shutdownTimeout: y.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
        restartOnCrash: y.boolean().optional().describe("Whether to restart the server if it crashes"),
        maxRestarts: y.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
    })), wi5 = C6(() => y.strictObject({
        name: y.string().min(1).describe("Identifier for this monitor, unique within the plugin. Used to dedupe so re-arming (plugin reload, repeat skill invoke) does not spawn duplicates."),
        command: y.string().min(1).describe('Shell command to run as a persistent background monitor. Each stdout line is delivered to the model as a <task_notification> event; the process runs for the session lifetime. ${CLAUDE_PLUGIN_ROOT}, ${CLAUDE_PLUGIN_DATA}, ${user_config.*}, and ${ENV_VAR} are substituted. Runs in the session cwd — prefix with `cd "${CLAUDE_PLUGIN_ROOT}" && ` if the script needs its own directory.'),
        description: y.string().min(1).describe("Short human-readable description of what is being monitored (shown in task panel and notification summary)."),
        when: y.union([y.literal("always"), y.string().startsWith("on-skill-invoke:").refine((q) => q.length > 16, {
            message: "on-skill-invoke: must specify a skill name"
        })]).default("always").describe('Arm trigger. "always" arms at session start and on plugin reload. "on-skill-invoke:<skill>" arms the first time that skill is dispatched (via Skill tool or slash command).')
    })), XO1 = C6(() => y.array(wi5()).refine((q) => new Set(q.map((K) => K.name)).size === q.length, {
        message: "Monitor names must be unique within a plugin"
    })), $i5 = C6(() => y.object({
        monitors: y.union([gA6().describe("Path to a JSON file containing the monitors array, relative to the plugin root"), XO1()]).describe("Background watch scripts the host arms as persistent Monitor tasks (unsandboxed, same trust tier as hooks) so plugins need not instruct the model to arm them. When omitted, monitors/monitors.json at the plugin root is loaded if present.")
    })), ji5 = C6(() => y.object({
        lspServers: y.union([gA6().describe("Path to .lsp.json configuration file relative to plugin root"), y.record(y.string(), _G6()).describe("LSP server configurations keyed by server name"), y.array(y.union([gA6().describe("Path to LSP configuration file"), y.record(y.string(), _G6()).describe("Inline LSP server configurations")])).describe("Array of LSP server configurations (paths or inline definitions)")])
    })), Ng7 = C6(() => y.string().refine((q) => !q.includes("..") && !q.includes("//"), "Package name cannot contain path traversal patterns").refine((q) => {
        let K = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/,
            _ = /^[a-z0-9][a-z0-9-._]*$/;
        return K.test(q) || _.test(q)
    }, "Invalid npm package name format")), Hi5 = C6(() => y.object({
        settings: y.record(y.string(), y.unknown()).optional().describe("Settings to merge when plugin is enabled. Only keys in PLUGIN_SETTINGS_KEYS (pluginSettingsKeys.ts) are kept")
    })), IQ6 = C6(() => y.object({
        ...an5().shape,
        ...sn5().partial().shape,
        ...en5().partial().shape,
        ...qi5().partial().shape,
        ...Ki5().partial().shape,
        ..._i5().partial().shape,
        ...Oi5().partial().shape,
        ...Yi5().partial().shape,
        ...ji5().partial().shape,
        ...$i5().partial().shape,
        ...Hi5().partial().shape,
        ...Ai5().partial().shape
    })), xQ6 = C6(() => y.discriminatedUnion("source", [y.object({
        source: y.literal("url"),
        url: y.string().url().describe("Direct URL to marketplace.json file"),
        headers: y.record(y.string(), y.string()).optional().describe("Custom HTTP headers (e.g., for authentication)")
    }), y.object({
        source: y.literal("github"),
        repo: y.string().describe("GitHub repository in owner/repo format"),
        ref: y.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: y.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
        sparsePaths: y.array(y.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }), y.object({
        source: y.literal("git"),
        url: y.string().describe("Full git repository URL"),
        ref: y.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        path: y.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
        sparsePaths: y.array(y.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }), y.object({
        source: y.literal("npm"),
        package: Ng7().describe("NPM package containing marketplace.json")
    }), y.object({
        source: y.literal("file"),
        path: y.string().describe("Local file path to marketplace.json")
    }), y.object({
        source: y.literal("directory"),
        path: y.string().describe("Local directory containing .claude-plugin/marketplace.json")
    }), y.object({
        source: y.literal("hostPattern"),
        hostPattern: y.string().describe('Regex pattern to match the host/domain extracted from any marketplace source type. For github sources, matches against "github.com". For git sources (SSH or HTTPS), extracts the hostname from the URL. Use in strictKnownMarketplaces to allow all marketplaces from a specific host (e.g., "^github\\.mycompany\\.com$").')
    }), y.object({
        source: y.literal("pathPattern"),
        pathPattern: y.string().describe('Regex pattern matched against the .path field of file and directory sources. Use in strictKnownMarketplaces to allow filesystem-based marketplaces alongside hostPattern restrictions for network sources. Use ".*" to allow all filesystem paths, or a narrower pattern (e.g., "^/opt/approved/") to restrict to specific directories.')
    }), y.object({
        source: y.literal("settings"),
        name: Vg7().refine((q) => !vU.has(q.toLowerCase()), {
            message: "Reserved official marketplace names cannot be used with settings sources. validateOfficialNameSource only accepts github/git sources from anthropics/* for these names; a settings source would be rejected after loadAndCacheMarketplace has already written to disk with cleanupNeeded=false."
        }).describe("Marketplace name. Must match the extraKnownMarketplaces key (enforced); the synthetic manifest is written under this name. Same validation " + "as PluginMarketplaceSchema plus reserved-name rejection — " + "validateOfficialNameSource runs after the disk write, too late to clean up."),
        plugins: y.array(Ji5()).describe("Plugin entries declared inline in settings.json"),
        owner: JO1().optional()
    }).describe("Inline marketplace manifest defined directly in settings.json. The reconciler writes a synthetic marketplace.json to the cache; diffMarketplaces detects edits via isEqual on the stored source (the plugins array is inside this object, so edits surface as sourceChanged).")])), $O1 = C6(() => y.string().length(40).regex(/^[a-f0-9]{40}$/, "Must be a full 40-character lowercase git commit SHA")), Eg7 = C6(() => y.union([Lr().describe("Path to the plugin root, relative to the marketplace root (the directory containing .claude-plugin/, not .claude-plugin/ itself)"), y.object({
        source: y.literal("npm"),
        package: Ng7().or(y.string().refine((q) => /^(?:file|https?|git(?:\+https?|\+ssh)?|ssh|github|gitlab|bitbucket):/i.test(q) || !q.includes(".."), 'Package reference cannot contain ".." path segments')).describe("Package name (or url, or local path, or anything else that can be passed to `npm` as a package)"),
        version: y.string().optional().describe("Specific version or version range (e.g., ^1.0.0, ~2.1.0)"),
        registry: y.string().url().optional().describe("Custom NPM registry URL (defaults to using system default, likely npmjs.org)")
    }).describe("NPM package as plugin source"), y.object({
        source: y.literal("pip"),
        package: y.string().describe("Python package name as it appears on PyPI"),
        version: y.string().optional().describe("Version specifier (e.g., ==1.0.0, >=2.0.0, <3.0.0)"),
        registry: y.string().url().optional().describe("Custom PyPI registry URL (defaults to using system default, likely pypi.org)")
    }).describe("Python package as plugin source"), y.object({
        source: y.literal("url"),
        url: y.string().describe("Full git repository URL (https:// or git@)"),
        ref: y.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: $O1().optional().describe("Specific commit SHA to use")
    }), y.object({
        source: y.literal("github"),
        repo: y.string().describe("GitHub repository in owner/repo format"),
        ref: y.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: $O1().optional().describe("Specific commit SHA to use")
    }), y.object({
        source: y.literal("git-subdir"),
        url: y.string().describe("Git repository: GitHub owner/repo shorthand, https://, or git@ URL"),
        path: y.string().min(1).describe('Subdirectory within the repo containing the plugin (e.g., "tools/claude-plugin"). Cloned sparsely using partial clone (--filter=tree:0) to minimize bandwidth for monorepos.'),
        ref: y.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
        sha: $O1().optional().describe("Specific commit SHA to use")
    }).describe("Plugin located in a subdirectory of a larger repository (monorepo). Only the specified subdirectory is materialized; the rest of the repo is not downloaded.")])), Ji5 = C6(() => y.object({
        name: y.string().min(1, "Plugin name cannot be empty").refine((q) => !q.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Plugin name as it appears in the target repository"),
        source: Eg7().describe("Where to fetch the plugin from. Must be a remote source — relative " + "paths have no marketplace repository to resolve against."),
        description: y.string().optional(),
        version: y.string().optional(),
        strict: y.boolean().optional()
    }).refine((q) => typeof q.source !== "string", {
        message: 'Plugins in a settings-sourced marketplace must use remote sources (github, git-subdir, npm, url, pip). Relative-path sources like "./foo" have no marketplace repository to resolve against.'
    }));
    MO1 = C6(() => IQ6().partial().extend({
        name: y.string().min(1, "Plugin name cannot be empty").refine((q) => !q.includes(" "), {
            message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
        }).describe("Unique identifier matching the plugin name"),
        source: Eg7().describe("Where to fetch the plugin from"),
        category: y.string().optional().describe('Category for organizing plugins (e.g., "productivity", "development")'),
        tags: y.array(y.string()).optional().describe("Tags for searchability and discovery"),
        strict: y.boolean().optional().default(!0).describe("Require the plugin manifest to be present in the plugin folder. If false, the marketplace entry provides the manifest.")
    })), g16 = C6(() => y.object({
        name: Vg7(),
        owner: JO1().describe("Marketplace maintainer or curator information"),
        plugins: y.array(MO1()).describe("Collection of available plugins in this marketplace"),
        forceRemoveDeletedPlugins: y.boolean().optional().describe("When true, plugins removed from this marketplace will be automatically uninstalled and flagged for users"),
        metadata: y.object({
            pluginRoot: y.string().optional().describe("Base path for relative plugin sources"),
            version: y.string().optional().describe("Marketplace version"),
            description: y.string().optional().describe("Marketplace description")
        }).optional().describe("Optional marketplace metadata"),
        allowCrossMarketplaceDependenciesOn: y.array(y.string()).optional().describe("Marketplace names whose plugins may be auto-installed as dependencies. Only the root marketplace's allowlist applies — no transitive trust.")
    })), DX8 = C6(() => y.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, "Plugin ID must be in format: plugin@marketplace")), Xi5 = /^[a-z0-9][-a-z0-9._]*(@[a-z0-9][-a-z0-9._]*)?(@\^[^@]*)?$/i, Mi5 = C6(() => y.union([y.string().regex(Xi5, "Dependency must be a plugin name, optionally qualified with @marketplace").transform((q) => q.replace(/@\^[^@]*$/, "")), y.object({
        name: y.string().min(1).regex(/^[a-z0-9][-a-z0-9._]*$/i),
        marketplace: y.string().min(1).regex(/^[a-z0-9][-a-z0-9._]*$/i).optional()
    }).loose().transform((q) => q.marketplace ? `${q.name}@${q.marketplace}` : q.name)])), Pi5 = C6(() => y.object({
        version: y.string().describe("Currently installed version"),
        installedAt: y.string().describe("ISO 8601 timestamp of installation"),
        lastUpdated: y.string().optional().describe("ISO 8601 timestamp of last update"),
        installPath: y.string().describe("Absolute path to the installed plugin directory"),
        gitCommitSha: y.string().optional().describe("Git commit SHA for git-based plugins (for version tracking)"),
        resolvedVersion: y.string().optional().describe("Tag-derived semver this install resolved to (when fetched via a version constraint). Used by verifyAndDemote in preference to manifest.version, since the upstream may have forgotten to bump plugin.json.")
    })), mQ6 = C6(() => y.object({
        version: y.literal(1).describe("Schema version 1"),
        plugins: y.record(DX8(), Pi5()).describe("Map of plugin IDs to their installation metadata")
    })), Wi5 = C6(() => y.enum(["managed", "user", "project", "local"])), Di5 = C6(() => y.object({
        scope: Wi5().describe("Installation scope"),
        projectPath: y.string().optional().describe("Project path (required for project/local scopes)"),
        installPath: y.string().describe("Absolute path to the versioned plugin directory"),
        version: y.string().optional().describe("Currently installed version"),
        installedAt: y.string().optional().describe("ISO 8601 timestamp of installation"),
        lastUpdated: y.string().optional().describe("ISO 8601 timestamp of last update"),
        gitCommitSha: y.string().optional().describe("Git commit SHA for git-based plugins"),
        resolvedVersion: y.string().optional().describe("Tag-derived semver this install resolved to")
    })), BQ6 = C6(() => y.object({
        version: y.literal(2).describe("Schema version 2"),
        plugins: y.record(DX8(), y.array(Di5())).describe("Map of plugin IDs to arrays of installation entries")
    })), B5O = C6(() => y.union([mQ6(), BQ6()])), Zi5 = C6(() => y.object({
        source: xQ6().describe("Where to fetch the marketplace from"),
        installLocation: y.string().describe("Local cache path where marketplace manifest is stored"),
        lastUpdated: y.string().describe("ISO 8601 timestamp of last marketplace refresh"),
        autoUpdate: y.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
    })), zG6 = C6(() => y.record(y.string(), Zi5()))
})
// @from(Ln 50687, Col 0)
function PO1() {
    return fi5.filter((q) => ZX8[q].buildGate())
}
// @from(Ln 50691, Col 0)
function yg7(q) {
    let K = {};
    for (let _ of q) K = {
        ...K,
        ...ZX8[_].shape()
    };
    return K
}
// @from(Ln 50700, Col 0)
function Lg7(q) {
    let K = {};
    for (let _ of q) K = {
        ...K,
        ...ZX8[_].permissionsShape?.()
    };
    return K
}
// @from(Ln 50709, Col 0)
function hg7(q) {
    let K = [];
    for (let _ of q) K.push(...ZX8[_].permissionModes?.() ?? []);
    return K
}
// @from(Ln 50714, Col 4)
fi5
// @from(Ln 50714, Col 9)
Gi5
// @from(Ln 50714, Col 14)
ZX8