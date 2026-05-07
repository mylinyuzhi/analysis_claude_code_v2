
// @from(Ln 225333, Col 0)
class Rs {
    diff(q, K, _ = {}) {
        let z;
        if (typeof _ === "function") z = _, _ = {};
        else if ("callback" in _) z = _.callback;
        let Y = this.castInput(q, _),
            A = this.castInput(K, _),
            O = this.removeEmpty(this.tokenize(Y, _)),
            w = this.removeEmpty(this.tokenize(A, _));
        return this.diffWithOptionsObj(O, w, _, z)
    }
    diffWithOptionsObj(q, K, _, z) {
        var Y;
        let A = (Z) => {
                if (Z = this.postProcess(Z, _), z) {
                    setTimeout(function() {
                        z(Z)
                    }, 0);
                    return
                } else return Z
            },
            O = K.length,
            w = q.length,
            $ = 1,
            j = O + w;
        if (_.maxEditLength != null) j = Math.min(j, _.maxEditLength);
        let H = (Y = _.timeout) !== null && Y !== void 0 ? Y : 1 / 0,
            J = Date.now() + H,
            X = [{
                oldPos: -1,
                lastComponent: void 0
            }],
            M = this.extractCommon(X[0], K, q, 0, _);
        if (X[0].oldPos + 1 >= w && M + 1 >= O) return A(this.buildValues(X[0].lastComponent, K, q));
        let P = -1 / 0,
            W = 1 / 0,
            D = () => {
                for (let Z = Math.max(P, -$); Z <= Math.min(W, $); Z += 2) {
                    let G, f = X[Z - 1],
                        v = X[Z + 1];
                    if (f) X[Z - 1] = void 0;
                    let V = !1;
                    if (v) {
                        let N = v.oldPos - Z;
                        V = v && 0 <= N && N < O
                    }
                    let k = f && f.oldPos + 1 < w;
                    if (!V && !k) {
                        X[Z] = void 0;
                        continue
                    }
                    if (!k || V && f.oldPos < v.oldPos) G = this.addToPath(v, !0, !1, 0, _);
                    else G = this.addToPath(f, !1, !0, 1, _);
                    if (M = this.extractCommon(G, K, q, Z, _), G.oldPos + 1 >= w && M + 1 >= O) return A(this.buildValues(G.lastComponent, K, q)) || !0;
                    else {
                        if (X[Z] = G, G.oldPos + 1 >= w) W = Math.min(W, Z - 1);
                        if (M + 1 >= O) P = Math.max(P, Z + 1)
                    }
                }
                $++
            };
        if (z)(function Z() {
            setTimeout(function() {
                if ($ > j || Date.now() > J) return z(void 0);
                if (!D()) Z()
            }, 0)
        })();
        else
            while ($ <= j && Date.now() <= J) {
                let Z = D();
                if (Z) return Z
            }
    }
    addToPath(q, K, _, z, Y) {
        let A = q.lastComponent;
        if (A && !Y.oneChangePerToken && A.added === K && A.removed === _) return {
            oldPos: q.oldPos + z,
            lastComponent: {
                count: A.count + 1,
                added: K,
                removed: _,
                previousComponent: A.previousComponent
            }
        };
        else return {
            oldPos: q.oldPos + z,
            lastComponent: {
                count: 1,
                added: K,
                removed: _,
                previousComponent: A
            }
        }
    }
    extractCommon(q, K, _, z, Y) {
        let A = K.length,
            O = _.length,
            w = q.oldPos,
            $ = w - z,
            j = 0;
        while ($ + 1 < A && w + 1 < O && this.equals(_[w + 1], K[$ + 1], Y))
            if ($++, w++, j++, Y.oneChangePerToken) q.lastComponent = {
                count: 1,
                previousComponent: q.lastComponent,
                added: !1,
                removed: !1
            };
        if (j && !Y.oneChangePerToken) q.lastComponent = {
            count: j,
            previousComponent: q.lastComponent,
            added: !1,
            removed: !1
        };
        return q.oldPos = w, $
    }
    equals(q, K, _) {
        if (_.comparator) return _.comparator(q, K);
        else return q === K || !!_.ignoreCase && q.toLowerCase() === K.toLowerCase()
    }
    removeEmpty(q) {
        let K = [];
        for (let _ = 0; _ < q.length; _++)
            if (q[_]) K.push(q[_]);
        return K
    }
    castInput(q, K) {
        return q
    }
    tokenize(q, K) {
        return Array.from(q)
    }
    join(q) {
        return q.join("")
    }
    postProcess(q, K) {
        return q
    }
    get useLongestToken() {
        return !1
    }
    buildValues(q, K, _) {
        let z = [],
            Y;
        while (q) z.push(q), Y = q.previousComponent, delete q.previousComponent, q = Y;
        z.reverse();
        let A = z.length,
            O = 0,
            w = 0,
            $ = 0;
        for (; O < A; O++) {
            let j = z[O];
            if (!j.removed) {
                if (!j.added && this.useLongestToken) {
                    let H = K.slice(w, w + j.count);
                    H = H.map(function(J, X) {
                        let M = _[$ + X];
                        return M.length > J.length ? M : J
                    }), j.value = this.join(H)
                } else j.value = this.join(K.slice(w, w + j.count));
                if (w += j.count, !j.added) $ += j.count
            } else j.value = this.join(_.slice($, $ + j.count)), $ += j.count
        }
        return z
    }
}
// @from(Ln 225499, Col 0)
function vU1(q, K) {
    let _;
    for (_ = 0; _ < q.length && _ < K.length; _++)
        if (q[_] != K[_]) return q.slice(0, _);
    return q.slice(0, _)
}
// @from(Ln 225506, Col 0)
function TU1(q, K) {
    let _;
    if (!q || !K || q[q.length - 1] != K[K.length - 1]) return "";
    for (_ = 0; _ < q.length && _ < K.length; _++)
        if (q[q.length - (_ + 1)] != K[K.length - (_ + 1)]) return q.slice(-_);
    return q.slice(-_)
}
// @from(Ln 225514, Col 0)
function nR8(q, K, _) {
    if (q.slice(0, K.length) != K) throw Error(`string ${JSON.stringify(q)} doesn't start with prefix ${JSON.stringify(K)}; this is a bug`);
    return _ + q.slice(K.length)
}
// @from(Ln 225519, Col 0)
function iR8(q, K, _) {
    if (!K) return q + _;
    if (q.slice(-K.length) != K) throw Error(`string ${JSON.stringify(q)} doesn't end with suffix ${JSON.stringify(K)}; this is a bug`);
    return q.slice(0, -K.length) + _
}
// @from(Ln 225525, Col 0)
function ny6(q, K) {
    return nR8(q, K, "")
}
// @from(Ln 225529, Col 0)
function Ve6(q, K) {
    return iR8(q, K, "")
}
// @from(Ln 225533, Col 0)
function VU1(q, K) {
    return K.slice(0, h4z(q, K))
}
// @from(Ln 225537, Col 0)
function h4z(q, K) {
    let _ = 0;
    if (q.length > K.length) _ = q.length - K.length;
    let z = K.length;
    if (q.length < K.length) z = q.length;
    let Y = Array(z),
        A = 0;
    Y[0] = 0;
    for (let O = 1; O < z; O++) {
        if (K[O] == K[A]) Y[O] = Y[A];
        else Y[O] = A;
        while (A > 0 && K[O] != K[A]) A = Y[A];
        if (K[O] == K[A]) A++
    }
    A = 0;
    for (let O = _; O < q.length; O++) {
        while (A > 0 && q[O] != K[A]) A = Y[A];
        if (q[O] == K[A]) A++
    }
    return A
}
// @from(Ln 225559, Col 0)
function iy6(q) {
    let K;
    for (K = q.length - 1; K >= 0; K--)
        if (!q[K].match(/\s/)) break;
    return q.substring(K + 1)
}
// @from(Ln 225566, Col 0)
function Ss(q) {
    let K = q.match(/^\s*/);
    return K ? K[0] : ""
}
// @from(Ln 225571, Col 0)
function k04(q, K, _, z) {
    if (K && _) {
        let Y = Ss(K.value),
            A = iy6(K.value),
            O = Ss(_.value),
            w = iy6(_.value);
        if (q) {
            let $ = vU1(Y, O);
            q.value = iR8(q.value, O, $), K.value = ny6(K.value, $), _.value = ny6(_.value, $)
        }
        if (z) {
            let $ = TU1(A, w);
            z.value = nR8(z.value, w, $), K.value = Ve6(K.value, $), _.value = Ve6(_.value, $)
        }
    } else if (_) {
        if (q) {
            let Y = Ss(_.value);
            _.value = _.value.substring(Y.length)
        }
        if (z) {
            let Y = Ss(z.value);
            z.value = z.value.substring(Y.length)
        }
    } else if (q && z) {
        let Y = Ss(z.value),
            A = Ss(K.value),
            O = iy6(K.value),
            w = vU1(Y, A);
        K.value = ny6(K.value, w);
        let $ = TU1(ny6(Y, w), O);
        K.value = Ve6(K.value, $), z.value = nR8(z.value, Y, $), q.value = iR8(q.value, Y, Y.slice(0, Y.length - $.length))
    } else if (z) {
        let Y = Ss(z.value),
            A = iy6(K.value),
            O = VU1(A, Y);
        K.value = Ve6(K.value, O)
    } else if (q) {
        let Y = iy6(q.value),
            A = Ss(K.value),
            O = VU1(Y, A);
        K.value = ny6(K.value, O)
    }
}
// @from(Ln 225615, Col 0)
function kU1(q, K, _) {
    return y04.diff(q, K, _)
}
// @from(Ln 225618, Col 4)
rR8 = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}"
// @from(Ln 225619, Col 4)
R4z
// @from(Ln 225619, Col 9)
N04
// @from(Ln 225619, Col 14)
S4z
// @from(Ln 225619, Col 19)
E04
// @from(Ln 225619, Col 24)
y04
// @from(Ln 225620, Col 4)
L04 = L(() => {
    R4z = new RegExp(`[${rR8}]+|\\s+|[^${rR8}]`, "ug");
    N04 = class N04 extends Rs {
        equals(q, K, _) {
            if (_.ignoreCase) q = q.toLowerCase(), K = K.toLowerCase();
            return q.trim() === K.trim()
        }
        tokenize(q, K = {}) {
            let _;
            if (K.intlSegmenter) {
                let A = K.intlSegmenter;
                if (A.resolvedOptions().granularity != "word") throw Error('The segmenter passed must have a granularity of "word"');
                _ = [];
                for (let O of Array.from(A.segment(q))) {
                    let w = O.segment;
                    if (_.length && /\s/.test(_[_.length - 1]) && /\s/.test(w)) _[_.length - 1] += w;
                    else _.push(w)
                }
            } else _ = q.match(R4z) || [];
            let z = [],
                Y = null;
            return _.forEach((A) => {
                if (/\s/.test(A))
                    if (Y == null) z.push(A);
                    else z.push(z.pop() + A);
                else if (Y != null && /\s/.test(Y))
                    if (z[z.length - 1] == Y) z.push(z.pop() + A);
                    else z.push(Y + A);
                else z.push(A);
                Y = A
            }), z
        }
        join(q) {
            return q.map((K, _) => {
                if (_ == 0) return K;
                else return K.replace(/^\s+/, "")
            }).join("")
        }
        postProcess(q, K) {
            if (!q || K.oneChangePerToken) return q;
            let _ = null,
                z = null,
                Y = null;
            if (q.forEach((A) => {
                    if (A.added) z = A;
                    else if (A.removed) Y = A;
                    else {
                        if (z || Y) k04(_, Y, z, A);
                        _ = A, z = null, Y = null
                    }
                }), z || Y) k04(_, Y, z, null);
            return q
        }
    };
    S4z = new N04;
    E04 = class E04 extends Rs {
        tokenize(q) {
            let K = new RegExp(`(\\r?\\n)|[${rR8}]+|[^\\S\\n\\r]+|[^${rR8}]`, "ug");
            return q.match(K) || []
        }
    };
    y04 = new E04
})
// @from(Ln 225684, Col 0)
function mK6(q, K, _) {
    return R04.diff(q, K, _)
}
// @from(Ln 225688, Col 0)
function C4z(q, K) {
    if (K.stripTrailingCr) q = q.replace(/\r\n/g, `
`);
    let _ = [],
        z = q.split(/(\n|\r\n)/);
    if (!z[z.length - 1]) z.pop();
    for (let Y = 0; Y < z.length; Y++) {
        let A = z[Y];
        if (Y % 2 && !K.newlineIsToken) _[_.length - 1] += A;
        else _.push(A)
    }
    return _
}
// @from(Ln 225701, Col 4)
h04
// @from(Ln 225701, Col 9)
R04
// @from(Ln 225702, Col 4)
NU1 = L(() => {
    h04 = class h04 extends Rs {
        constructor() {
            super(...arguments);
            this.tokenize = C4z
        }
        equals(q, K, _) {
            if (_.ignoreWhitespace) {
                if (!_.newlineIsToken || !q.includes(`
`)) q = q.trim();
                if (!_.newlineIsToken || !K.includes(`
`)) K = K.trim()
            } else if (_.ignoreNewlineAtEof && !_.newlineIsToken) {
                if (q.endsWith(`
`)) q = q.slice(0, -1);
                if (K.endsWith(`
`)) K = K.slice(0, -1)
            }
            return super.equals(q, K, _)
        }
    };
    R04 = new h04
})
// @from(Ln 225726, Col 0)
function EU1(q, K, _) {
    return C04.diff(q, K, _)
}
// @from(Ln 225729, Col 4)
S04
// @from(Ln 225729, Col 9)
C04
// @from(Ln 225730, Col 4)
b04 = L(() => {
    S04 = class S04 extends Rs {
        tokenize(q) {
            return q.slice()
        }
        join(q) {
            return q
        }
        removeEmpty(q) {
            return q
        }
    };
    C04 = new S04
})
// @from(Ln 225745, Col 0)
function BK6(q, K, _, z, Y, A, O) {
    let w;
    if (!O) w = {};
    else if (typeof O === "function") w = {
        callback: O
    };
    else w = O;
    if (typeof w.context > "u") w.context = 4;
    let $ = w.context;
    if (w.newlineIsToken) throw Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
    if (!w.callback) return j(mK6(_, z, w));
    else {
        let {
            callback: H
        } = w;
        mK6(_, z, Object.assign(Object.assign({}, w), {
            callback: (J) => {
                let X = j(J);
                H(X)
            }
        }))
    }

    function j(H) {
        if (!H) return;
        H.push({
            value: "",
            lines: []
        });

        function J(G) {
            return G.map(function(f) {
                return " " + f
            })
        }
        let X = [],
            M = 0,
            P = 0,
            W = [],
            D = 1,
            Z = 1;
        for (let G = 0; G < H.length; G++) {
            let f = H[G],
                v = f.lines || b4z(f.value);
            if (f.lines = v, f.added || f.removed) {
                if (!M) {
                    let V = H[G - 1];
                    if (M = D, P = Z, V) W = $ > 0 ? J(V.lines.slice(-$)) : [], M -= W.length, P -= W.length
                }
                for (let V of v) W.push((f.added ? "+" : "-") + V);
                if (f.added) Z += v.length;
                else D += v.length
            } else {
                if (M)
                    if (v.length <= $ * 2 && G < H.length - 2)
                        for (let V of J(v)) W.push(V);
                    else {
                        let V = Math.min(v.length, $);
                        for (let N of J(v.slice(0, V))) W.push(N);
                        let k = {
                            oldStart: M,
                            oldLines: D - M + V,
                            newStart: P,
                            newLines: Z - P + V,
                            lines: W
                        };
                        X.push(k), M = 0, P = 0, W = []
                    } D += v.length, Z += v.length
            }
        }
        for (let G of X)
            for (let f = 0; f < G.lines.length; f++)
                if (G.lines[f].endsWith(`
`)) G.lines[f] = G.lines[f].slice(0, -1);
                else G.lines.splice(f + 1, 0, "\\ No newline at end of file"), f++;
        return {
            oldFileName: q,
            newFileName: K,
            oldHeader: Y,
            newHeader: A,
            hunks: X
        }
    }
}
// @from(Ln 225830, Col 0)
function oR8(q, K) {
    if (!K) K = I04;
    if (Array.isArray(q)) {
        if (q.length > 1 && !K.includeFileHeaders) throw Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");
        return q.map((z) => oR8(z, K)).join(`
`)
    }
    let _ = [];
    if (K.includeIndex && q.oldFileName == q.newFileName) _.push("Index: " + q.oldFileName);
    if (K.includeUnderline) _.push("===================================================================");
    if (K.includeFileHeaders) _.push("--- " + q.oldFileName + (typeof q.oldHeader > "u" ? "" : "\t" + q.oldHeader)), _.push("+++ " + q.newFileName + (typeof q.newHeader > "u" ? "" : "\t" + q.newHeader));
    for (let z = 0; z < q.hunks.length; z++) {
        let Y = q.hunks[z];
        if (Y.oldLines === 0) Y.oldStart -= 1;
        if (Y.newLines === 0) Y.newStart -= 1;
        _.push("@@ -" + Y.oldStart + "," + Y.oldLines + " +" + Y.newStart + "," + Y.newLines + " @@");
        for (let A of Y.lines) _.push(A)
    }
    return _.join(`
`) + `
`
}
// @from(Ln 225853, Col 0)
function x04(q, K, _, z, Y, A, O) {
    if (typeof O === "function") O = {
        callback: O
    };
    if (!(O === null || O === void 0 ? void 0 : O.callback)) {
        let w = BK6(q, K, _, z, Y, A, O);
        if (!w) return;
        return oR8(w, O === null || O === void 0 ? void 0 : O.headerOptions)
    } else {
        let {
            callback: w
        } = O;
        BK6(q, K, _, z, Y, A, Object.assign(Object.assign({}, O), {
            callback: ($) => {
                if (!$) w(void 0);
                else w(oR8($, O.headerOptions))
            }
        }))
    }
}
// @from(Ln 225874, Col 0)
function yU1(q, K, _, z, Y, A) {
    return x04(q, q, K, _, z, Y, A)
}
// @from(Ln 225878, Col 0)
function b4z(q) {
    let K = q.endsWith(`
`),
        _ = q.split(`
`).map((z) => z + `
`);
    if (K) _.pop();
    else _.push(_.pop().slice(0, -1));
    return _
}
// @from(Ln 225888, Col 4)
I04
// @from(Ln 225889, Col 4)
u04 = L(() => {
    NU1();
    I04 = {
        includeIndex: !0,
        includeUnderline: !0,
        includeFileHeaders: !0
    }
})
// @from(Ln 225897, Col 4)
pK6 = L(() => {
    L04();
    NU1();
    b04();
    u04()
})
// @from(Ln 225914, Col 0)
function iI() {
    return S6(process.env.CLAUDE_CODE_IS_COWORK)
}
// @from(Ln 225918, Col 0)
function x4z() {
    let K = "";
    for (let _ = 0; _ < 4; _++) K += "abcdefghijklmnopqrstuvwxyz0123456789" [Math.floor(Math.random() * 36)];
    return U04(iv(), `cache-break-${K}.diff`)
}
// @from(Ln 225924, Col 0)
function Q04() {
    return S6(process.env.CLAUDE_CODE_IS_COWORK)
}
// @from(Ln 225928, Col 0)
function d04() {
    return U04(iv(), `cache-break-state-${I8()}.json`)
}
// @from(Ln 225932, Col 0)
function m4z() {
    if (hU1 || !Q04()) return;
    hU1 = !0;
    try {
        let q = I4z(d04(), "utf8"),
            K = u4z().safeParse(n8(q));
        if (!K.success) return;
        for (let [_, z] of Object.entries(K.data)) {
            if (RR.has(_)) continue;
            RR.set(_, {
                ...z,
                pendingChanges: null,
                buildDiffableContent: () => ""
            })
        }
    } catch {}
}
// @from(Ln 225950, Col 0)
function lj6() {
    if (!Q04()) return;
    try {
        let q = {};
        for (let [z, Y] of RR) {
            let {
                buildDiffableContent: A,
                pendingChanges: O,
                ...w
            } = Y;
            q[z] = w
        }
        let K = d04(),
            _ = I6(q);
        m04 = m04.then(() => F04(iv(), {
            recursive: !0
        })).then(() => g04(K, _)).catch(() => {})
    } catch {}
}
// @from(Ln 225970, Col 0)
function U4z(q) {
    return q.includes("haiku")
}
// @from(Ln 225974, Col 0)
function aR8(q, K) {
    if (q === "compact") return "repl_main_thread";
    for (let _ of p4z)
        if (q.startsWith(_)) return K || q;
    return null
}
// @from(Ln 225981, Col 0)
function B04(q) {
    return q.map((K) => {
        if (!("cache_control" in K)) return K;
        let {
            cache_control: _,
            ...z
        } = K;
        return z
    })
}
// @from(Ln 225992, Col 0)
function RU1(q) {
    let K = q.text;
    return typeof K === "string" ? K : void 0
}
// @from(Ln 225997, Col 0)
function p04(q) {
    return RU1(q)?.startsWith(Q4z) ?? !1
}
// @from(Ln 226001, Col 0)
function cj6(q) {
    let K = I6(q);
    if (typeof Bun < "u") {
        let _ = Bun.hash(K);
        return typeof _ === "bigint" ? Number(_ & 0xffffffffn) : _
    }
    return N16(K)
}
// @from(Ln 226010, Col 0)
function LU1(q) {
    if (!q.startsWith("mcp__")) return q;
    let K = q.split("__")[1];
    if (!K) return "mcp";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent" || rC1.has(K)) return `mcp__${K}`;
    return "mcp"
}
// @from(Ln 226018, Col 0)
function c04(q) {
    if (!q || typeof q !== "object") return q;
    let {
        cache_control: K,
        ..._
    } = q, z = _.source;
    if (z && typeof z === "object") {
        let Y = z;
        if (typeof Y.data === "string" && Y.data.length > 256) return {
            ..._,
            source: {
                ...Y,
                data: Y.data.length
            }
        }
    }
    if (Array.isArray(_.content)) return {
        ..._,
        content: _.content.map(c04)
    };
    return _
}
// @from(Ln 226041, Col 0)
function d4z(q) {
    return q.map((K) => {
        let _ = K.message.content;
        return cj6({
            role: K.message.role,
            content: Array.isArray(_) ? _.map(c04) : _
        })
    })
}
// @from(Ln 226051, Col 0)
function c4z(q, K) {
    let _ = {};
    for (let z = 0; z < q.length; z++) _[K[z] ?? `__idx_${z}`] = cj6(q[z]);
    return _
}
// @from(Ln 226057, Col 0)
function l4z(q) {
    let K = 0;
    for (let _ of q) K += RU1(_)?.length ?? 0;
    return K
}
// @from(Ln 226063, Col 0)
function n4z(q, K, _) {
    let z = q.map((A) => A.text).join(`

`),
        Y = K.map((A) => {
            if (!("name" in A)) return "unknown";
            let O = "description" in A ? A.description : "",
                w = "input_schema" in A ? I6(A.input_schema) : "";
            return `${A.name}
  description: ${O}
  input_schema: ${w}`
        }).sort().join(`

`);
    return `Model: ${_}

=== System Prompt ===

${z}

=== Tools (${K.length}) ===

${Y}
`
}
// @from(Ln 226089, Col 0)
function l04(q) {
    try {
        let {
            system: K,
            toolSchemas: _,
            querySource: z,
            model: Y,
            agentId: A,
            fastMode: O,
            globalCacheStrategy: w = "",
            betas: $ = [],
            autoModeActive: j = !1,
            isUsingOverage: H = !1,
            is1hCacheTTL: J = !1,
            queryDepth: X,
            cachedMCEnabled: M = !1,
            effortValue: P,
            extraBodyParams: W,
            messagesForAPI: D
        } = q, Z = aR8(z, A);
        if (!Z) return;
        let G = B04(K).filter((t) => !p04(t)),
            f = B04(_),
            v = cj6(G),
            V = cj6(f),
            k = cj6(K.filter((t) => !p04(t)).map((t) => ("cache_control" in t) ? t.cache_control : null)),
            N = _.map((t) => ("name" in t) ? t.name : "unknown"),
            R = () => c4z(f, N),
            h = () => G.map((t) => cj6(t)),
            C = () => G.map((t) => RU1(t)?.length ?? 0),
            x = l4z(G),
            B = () => n4z(K, _, Y),
            m = O ?? !1,
            S = [...$].sort(),
            F = P === void 0 ? "" : String(P),
            U = W === void 0 ? 0 : cj6(W),
            g = D ? d4z(D) : [];
        m4z();
        let c = RR.get(Z);
        if (!c) {
            while (RR.size >= B4z) {
                let t = RR.keys().next().value;
                if (t !== void 0) RR.delete(t)
            }
            RR.set(Z, {
                systemHash: v,
                toolsHash: V,
                cacheControlHash: k,
                toolNames: N,
                systemCharCount: x,
                model: Y,
                fastMode: m,
                globalCacheStrategy: w,
                betas: S,
                autoModeActive: j,
                isUsingOverage: H,
                is1hCacheTTL: J,
                queryDepth: X,
                cachedMCEnabled: M,
                effortValue: F,
                extraBodyHash: U,
                callCount: 1,
                pendingChanges: null,
                prevCacheReadTokens: null,
                cacheDeletionsPending: !1,
                messageHashes: g,
                buildDiffableContent: B,
                perToolHashes: R(),
                perBlockHashes: h(),
                perBlockLengths: C()
            }), lj6();
            return
        }
        c.callCount++;
        let n = v !== c.systemHash,
            l = V !== c.toolsHash,
            z6 = Y !== c.model,
            A6 = m !== c.fastMode,
            e = k !== c.cacheControlHash,
            i = w !== c.globalCacheStrategy,
            O6 = S.length !== c.betas.length || S.some((t, Y6) => t !== c.betas[Y6]),
            J6 = j !== c.autoModeActive,
            $6 = H !== c.isUsingOverage,
            H6 = M !== c.cachedMCEnabled,
            q6 = F !== c.effortValue,
            o = U !== c.extraBodyHash,
            _6 = c.messageHashes.findIndex((t, Y6) => g[Y6] !== t),
            r = _6 !== -1;
        if (n || l || z6 || A6 || e || i || O6 || J6 || $6 || H6 || q6 || o || r) {
            let t = new Set(c.toolNames),
                Y6 = new Set(N),
                X6 = new Set(c.betas),
                M6 = new Set(S),
                W6 = N.filter((L6) => !t.has(L6)),
                V6 = c.toolNames.filter((L6) => !Y6.has(L6)),
                f6 = [];
            if (l) {
                let L6 = R();
                for (let y6 of N) {
                    if (!t.has(y6)) continue;
                    if (L6[y6] !== c.perToolHashes[y6]) f6.push(y6)
                }
                c.perToolHashes = L6
            }
            let G6 = c.perBlockHashes.length,
                k6 = G.length,
                T6 = [],
                v6 = [];
            if (n) {
                let L6 = h(),
                    y6 = C();
                if (k6 === G6) {
                    for (let c6 = 0; c6 < k6; c6++)
                        if (L6[c6] !== c.perBlockHashes[c6]) T6.push(c6), v6.push(y6[c6] - c.perBlockLengths[c6])
                }
                c.perBlockHashes = L6, c.perBlockLengths = y6
            }
            c.pendingChanges = {
                systemPromptChanged: n,
                toolSchemasChanged: l,
                modelChanged: z6,
                fastModeChanged: A6,
                cacheControlChanged: e,
                globalCacheStrategyChanged: i,
                betasChanged: O6,
                autoModeChanged: J6,
                overageChanged: $6,
                cachedMCChanged: H6,
                effortChanged: q6,
                extraBodyChanged: o,
                messagesHistoryChanged: r,
                firstChangedMessageIndex: _6,
                prevMessageCount: c.messageHashes.length,
                addedToolCount: W6.length,
                removedToolCount: V6.length,
                addedTools: W6,
                removedTools: V6,
                changedToolSchemas: f6,
                prevBlockCount: G6,
                newBlockCount: k6,
                changedBlockIndices: T6,
                changedBlockLengthDeltas: v6,
                systemCharDelta: x - c.systemCharCount,
                previousModel: c.model,
                newModel: Y,
                prevGlobalCacheStrategy: c.globalCacheStrategy,
                newGlobalCacheStrategy: w,
                addedBetas: S.filter((L6) => !X6.has(L6)),
                removedBetas: c.betas.filter((L6) => !M6.has(L6)),
                prevEffortValue: c.effortValue,
                newEffortValue: F,
                buildPrevDiffableContent: c.buildDiffableContent
            }
        } else c.pendingChanges = null;
        c.systemHash = v, c.toolsHash = V, c.cacheControlHash = k, c.toolNames = N, c.systemCharCount = x, c.model = Y, c.fastMode = m, c.globalCacheStrategy = w, c.betas = S, c.autoModeActive = j, c.isUsingOverage = H, c.is1hCacheTTL = J, c.queryDepth = X, c.cachedMCEnabled = M, c.effortValue = F, c.extraBodyHash = U, c.messageHashes = g, c.buildDiffableContent = B, lj6()
    } catch (K) {
        j6(K)
    }
}
// @from(Ln 226248, Col 0)
async function n04(q, K, _, z, Y, A) {
    let O = aR8(q, Y);
    if (!O) return;
    let w = RR.get(O);
    if (!w) return;
    if (U4z(w.model)) return;
    try {
        let $ = w.prevCacheReadTokens;
        w.prevCacheReadTokens = K;
        let j = z.findLast((v) => v.type === "assistant"),
            H = j ? Date.now() - new Date(j.timestamp).getTime() : null;
        if ($ === null) return;
        let J = w.pendingChanges;
        if (w.cacheDeletionsPending) {
            w.cacheDeletionsPending = !1, E(`[PROMPT CACHE] cache deletion applied, cache read: ${$} → ${K} (expected drop)`), w.pendingChanges = null;
            return
        }
        let X = $ - K;
        if (K >= $ * 0.95 || X < F4z) {
            w.pendingChanges = null;
            return
        }
        let M = [];
        if (J) {
            if (J.modelChanged) M.push(`model changed (${J.previousModel} → ${J.newModel})`);
            if (J.systemPromptChanged) {
                let v = J.systemCharDelta,
                    V = v === 0 ? "" : v > 0 ? ` (+${v} chars)` : ` (${v} chars)`;
                M.push(`system prompt changed${V}`)
            }
            if (J.toolSchemasChanged) {
                let v = J.addedToolCount > 0 || J.removedToolCount > 0 ? ` (+${J.addedToolCount}/-${J.removedToolCount} tools)` : " (tool prompt/schema changed, same tool set)";
                M.push(`tools changed${v}`)
            }
            if (J.fastModeChanged) M.push("fast mode toggled");
            if (J.globalCacheStrategyChanged) M.push(`global cache strategy changed (${J.prevGlobalCacheStrategy||"none"} → ${J.newGlobalCacheStrategy||"none"})`);
            if (J.cacheControlChanged && !J.globalCacheStrategyChanged && !J.systemPromptChanged) M.push("cache_control changed (scope or TTL)");
            if (J.betasChanged) {
                let v = J.addedBetas.length ? `+${J.addedBetas.join(",")}` : "",
                    V = J.removedBetas.length ? `-${J.removedBetas.join(",")}` : "",
                    k = [v, V].filter(Boolean).join(" ");
                M.push(`betas changed${k?` (${k})`:""}`)
            }
            if (J.autoModeChanged) M.push("auto mode toggled");
            if (J.overageChanged) M.push("overage state changed (TTL flip expected)");
            if (J.cachedMCChanged) M.push("cached microcompact toggled");
            if (J.effortChanged) M.push(`effort changed (${J.prevEffortValue||"default"} → ${J.newEffortValue||"default"})`);
            if (J.extraBodyChanged) M.push("extra body params changed");
            if (J.messagesHistoryChanged) M.push(`message history mutated at index ${J.firstChangedMessageIndex}/${J.prevMessageCount}`)
        }
        let P = H !== null && H > g4z,
            W = H !== null && H > ke6,
            D;
        if (M.length > 0) D = M.join(", ");
        else if (W) D = "possible 1h TTL expiry (prompt unchanged)";
        else if (P) D = "possible 5min TTL expiry (prompt unchanged)";
        else if (H !== null) D = "likely server-side (prompt unchanged, <5min gap)";
        else D = "unknown cause";
        d("tengu_prompt_cache_break", {
            systemPromptChanged: J?.systemPromptChanged ?? !1,
            toolSchemasChanged: J?.toolSchemasChanged ?? !1,
            modelChanged: J?.modelChanged ?? !1,
            fastModeChanged: J?.fastModeChanged ?? !1,
            cacheControlChanged: J?.cacheControlChanged ?? !1,
            globalCacheStrategyChanged: J?.globalCacheStrategyChanged ?? !1,
            betasChanged: J?.betasChanged ?? !1,
            autoModeChanged: J?.autoModeChanged ?? !1,
            overageChanged: J?.overageChanged ?? !1,
            cachedMCChanged: J?.cachedMCChanged ?? !1,
            effortChanged: J?.effortChanged ?? !1,
            extraBodyChanged: J?.extraBodyChanged ?? !1,
            messagesHistoryChanged: J?.messagesHistoryChanged ?? !1,
            firstChangedMessageIndex: J?.firstChangedMessageIndex ?? -1,
            addedToolCount: J?.addedToolCount ?? 0,
            removedToolCount: J?.removedToolCount ?? 0,
            systemCharDelta: J?.systemCharDelta ?? 0,
            prevBlockCount: J?.prevBlockCount ?? 0,
            newBlockCount: J?.newBlockCount ?? 0,
            changedBlockIndices: (J?.changedBlockIndices ?? []).join(","),
            changedBlockLengthDeltas: (J?.changedBlockLengthDeltas ?? []).join(","),
            addedTools: (J?.addedTools ?? []).map(LU1).join(","),
            removedTools: (J?.removedTools ?? []).map(LU1).join(","),
            changedToolSchemas: (J?.changedToolSchemas ?? []).map(LU1).join(","),
            addedBetas: (J?.addedBetas ?? []).join(","),
            removedBetas: (J?.removedBetas ?? []).join(","),
            prevGlobalCacheStrategy: J?.prevGlobalCacheStrategy ?? "",
            newGlobalCacheStrategy: J?.newGlobalCacheStrategy ?? "",
            systemHash: w.systemHash,
            toolsHash: w.toolsHash,
            is1hCacheTTL: w.is1hCacheTTL,
            queryDepth: w.queryDepth,
            querySource: q,
            model: w.model,
            globalCacheStrategy: w.globalCacheStrategy,
            callNumber: w.callCount,
            prevCacheReadTokens: $,
            cacheReadTokens: K,
            cacheCreationTokens: _,
            timeSinceLastAssistantMsg: H ?? -1,
            lastAssistantMsgOver5minAgo: P,
            lastAssistantMsgOver1hAgo: W,
            isCowork: S6(process.env.CLAUDE_CODE_IS_COWORK),
            requestId: A ?? ""
        });
        let Z;
        if (J?.buildPrevDiffableContent) Z = await i4z(J.buildPrevDiffableContent(), w.buildDiffableContent());
        let G = Z ? `, diff: ${Z}` : "",
            f = `[PROMPT CACHE BREAK] ${D} [source=${q}, call #${w.callCount}, cache read: ${$} → ${K}, creation: ${_}${G}]`;
        E(f, {
            level: "warn"
        }), w.pendingChanges = null
    } catch ($) {
        j6($)
    } finally {
        lj6()
    }
}
// @from(Ln 226366, Col 0)
function i04(q, K) {
    let _ = aR8(q, K),
        z = _ ? RR.get(_) : void 0;
    if (z) z.cacheDeletionsPending = !0, lj6()
}
// @from(Ln 226372, Col 0)
function Ne6(q, K) {
    let _ = K ?? aR8(q),
        z = _ ? RR.get(_) : void 0;
    if (z) z.prevCacheReadTokens = null, lj6()
}
// @from(Ln 226378, Col 0)
function r04(q) {
    RR.delete(q), lj6()
}
// @from(Ln 226382, Col 0)
function o04() {
    RR.clear(), hU1 = !1, lj6()
}
// @from(Ln 226385, Col 0)
async function i4z(q, K) {
    try {
        let _ = x4z();
        await F04(iv(), {
            recursive: !0
        });
        let z = yU1("prompt-state", q, K, "before", "after");
        return await g04(_, z), _
    } catch {
        return
    }
}
// @from(Ln 226397, Col 4)
RR
// @from(Ln 226397, Col 8)
u4z
// @from(Ln 226397, Col 13)
hU1 = !1
// @from(Ln 226398, Col 4)
m04
// @from(Ln 226398, Col 9)
B4z = 10
// @from(Ln 226399, Col 4)
p4z
// @from(Ln 226399, Col 9)
F4z = 2000
// @from(Ln 226400, Col 4)
g4z = 300000
// @from(Ln 226401, Col 4)
ke6 = 3600000
// @from(Ln 226402, Col 4)
Q4z = "x-anthropic-billing-header:"
// @from(Ln 226403, Col 4)
FK6 = L(() => {
    pK6();
    y8();
    K8();
    Q8();
    U8();
    Sz();
    e8();
    Hs();
    C8();
    q2();
    RR = new Map;
    u4z = C6(() => g7.record(g7.string(), g7.object({
        systemHash: g7.number(),
        toolsHash: g7.number(),
        cacheControlHash: g7.number(),
        toolNames: g7.array(g7.string()),
        perToolHashes: g7.record(g7.string(), g7.number()),
        perBlockHashes: g7.array(g7.number()),
        perBlockLengths: g7.array(g7.number()),
        systemCharCount: g7.number(),
        model: g7.string(),
        fastMode: g7.boolean(),
        globalCacheStrategy: g7.string(),
        betas: g7.array(g7.string()),
        autoModeActive: g7.boolean(),
        isUsingOverage: g7.boolean(),
        is1hCacheTTL: g7.boolean().default(!1),
        queryDepth: g7.number().optional(),
        cachedMCEnabled: g7.boolean(),
        effortValue: g7.string(),
        extraBodyHash: g7.number(),
        callCount: g7.number(),
        prevCacheReadTokens: g7.number().nullable(),
        cacheDeletionsPending: g7.boolean(),
        messageHashes: g7.array(g7.number())
    })));
    m04 = Promise.resolve();
    p4z = ["repl_main_thread", "sdk", "agent:custom", "agent:default", "agent:builtin"]
})
// @from(Ln 226444, Col 0)
function nj6() {
    Ee6.setState(() => !0)
}
// @from(Ln 226448, Col 0)
function a04() {
    Ee6.setState(() => !1)
}
// @from(Ln 226451, Col 4)
Ee6
// @from(Ln 226452, Col 4)
ye6 = L(() => {
    Ee6 = rE(!1)
})
// @from(Ln 226456, Col 0)
function a4z() {
    return {
        cachedMCModule: null,
        cachedMCState: null,
        pendingCacheEdits: null
    }
}
// @from(Ln 226464, Col 0)
function s04() {
    let q = ij6.pendingCacheEdits;
    return ij6.pendingCacheEdits = null, q
}
// @from(Ln 226469, Col 0)
function t04() {
    if (!ij6.cachedMCState) return [];
    return ij6.cachedMCState.pinnedEdits
}
// @from(Ln 226474, Col 0)
function e04(q, K) {
    if (ij6.cachedMCState) ij6.cachedMCState.pinnedEdits.push({
        userMessageIndex: q,
        block: K
    })
}
// @from(Ln 226481, Col 0)
function SR() {
    let q = ij6;
    if (q.cachedMCState && q.cachedMCModule) q.cachedMCModule.resetCachedMCState(q.cachedMCState);
    q.pendingCacheEdits = null
}
// @from(Ln 226487, Col 0)
function s4z(q) {
    if (!q.content) return 0;
    if (typeof q.content === "string") return w_(q.content);
    return q.content.reduce((K, _) => {
        if (_.type === "text") return K + w_(_.text);
        else if (_.type === "image" || _.type === "document") return K + r4z;
        return K
    }, 0)
}
// @from(Ln 226497, Col 0)
function t4z(q) {
    let K = [];
    for (let _ of q)
        if (_.type === "assistant" && Array.isArray(_.message.content)) {
            for (let z of _.message.content)
                if (z.type === "tool_use" && o4z.has(z.name)) K.push(z.id)
        } return K
}
// @from(Ln 226505, Col 0)
async function _c(q, K, _) {
    return a04(), {
        messages: q
    }
}
// @from(Ln 226511, Col 0)
function tR8(q, K) {
    if (K.size === 0) return [...q];
    return q.map((_) => {
        if (_.type !== "user" || !Array.isArray(_.message.content)) return _;
        let z = !1,
            Y = _.message.content.map((A) => {
                if (A.type === "tool_result" && K.has(A.tool_use_id) && A.content !== sR8) return z = !0, {
                    ...A,
                    content: sR8
                };
                return A
            });
        return z ? {
            ..._,
            message: {
                ..._.message,
                content: Y
            }
        } : _
    })
}
// @from(Ln 226533, Col 0)
function qD4(q, K, _) {
    let z = t4z(q),
        Y = Math.max(1, _.keepRecent),
        A = new Set(z.slice(-Y)),
        O = new Set(z.filter((j) => !A.has(j)));
    if (O.size === 0) return null;
    let w = 0,
        $ = q.map((j) => {
            if (j.type !== "user" || !Array.isArray(j.message.content)) return j;
            let H = !1,
                J = j.message.content.map((X) => {
                    if (X.type === "tool_result" && O.has(X.tool_use_id) && X.content !== sR8) return w += s4z(X), H = !0, {
                        ...X,
                        content: sR8
                    };
                    return X
                });
            if (!H) return j;
            return {
                ...j,
                message: {
                    ...j.message,
                    content: J
                }
            }
        });
    if (w === 0) return null;
    if (d("tengu_time_based_microcompact", {
            toolsCleared: O.size,
            toolsKept: A.size,
            keepRecent: _.keepRecent,
            tokensSaved: w,
            trigger: "context_hint"
        }), E(`[KEEP-RECENT MC] context_hint trigger, cleared ${O.size} tool results (~${w} tokens), kept last ${A.size}`), nj6(), SR(), iI() && K) i04(K);
    return {
        messages: $,
        tokensSaved: w,
        clearedIds: O
    }
}
// @from(Ln 226573, Col 4)
sR8 = "[Old tool result content cleared]"
// @from(Ln 226574, Col 4)
r4z = 2000
// @from(Ln 226575, Col 4)
o4z
// @from(Ln 226575, Col 9)
ij6
// @from(Ln 226576, Col 4)
$y = L(() => {
    Rz();
    u$();
    jJ();
    cy6();
    K8();
    Sq();
    uK6();
    e8();
    C8();
    FK6();
    Nk();
    ye6();
    o4z = new Set([xq, ...dj6, a5, T9, hR, PH, J4, IK]);
    ij6 = a4z()
})
// @from(Ln 226593, Col 0)
function KD4(q) {
    let K = Buffer.from(q, "base64"),
        _ = "";
    for (let z of K) _ += String.fromCharCode(z ^ e4z);
    return _.split(",")
}
// @from(Ln 226600, Col 0)
function YKz() {
    let q = process.env.ANTHROPIC_BASE_URL;
    if (!q) return null;
    try {
        return new URL(q).hostname.toLowerCase()
    } catch {
        return null
    }
}
// @from(Ln 226610, Col 0)
function AKz() {
    if (Aj()) return null;
    let q = YKz(),
        K = _F6(),
        _ = K === "Asia/Shanghai" || K === "Asia/Urumqi";
    if (!q) return {
        known: !1,
        labKw: !1,
        cnTZ: _,
        host: null
    };
    return {
        known: _Kz().some((z) => q === z || q.endsWith("." + z)),
        labKw: zKz().some((z) => q.includes(z)),
        cnTZ: _,
        host: q
    }
}
// @from(Ln 226629, Col 0)
function OKz(q, K) {
    if (!q && !K) return "'";
    if (q && !K) return "’";
    if (!q && K) return "ʼ";
    return "ʹ"
}
// @from(Ln 226636, Col 0)
function _D4(q) {
    let K = AKz(),
        _ = OKz(K?.known ?? !1, K?.labKw ?? !1),
        z = K?.cnTZ ? q.replaceAll("-", "/") : q;
    return `Today${_}s date is ${z}.`
}
// @from(Ln 226642, Col 4)
e4z = 91
// @from(Ln 226643, Col 4)
qKz = "ODV3KDo1MC46MnU4NDZ3NT4vPjooPnU4NDZ3am1odTg0Nnc5OjI/LnYyNS91ODQ2dzk6Mj8udTg0Nnc6NzI5Ojk6djI1OHU4NDZ3OjcyKzoidTg0Nnc6NS88KTQuK3YyNTh1ODV3MC46MigzNC51ODQ2dzkiLz4/OjU4PnU1Pi93IzI6NDM0NTwoMy51ODQ2dzgvKTIrODQpK3U4NDZ3MT91ODQ2dzE/ODc0Lj91ODQ2dzkyNzI5MjcydTg0dzI9NyIvPjB1ODQ2dygvPis9LjV2MjU4dTg0Nnc6NzIiLjU4KHU4NDZ3ODV2KDM6NTwzOjJ1PTg6Kyt1KS41dzg1djk+MjEyNTx1PTg6Kyt1KS41dyM6NjI1MjZ1ODQ2dzY0NDUoMzQvdToydzo1Iik0Li8+KXUvNCt3Kzo4MCI6KzJ1ODQ2dzoyODQ/PjYyKSk0KXU4NDZ3OjI8NDg0Pz51ODQ2dzM0NTwoMzo1dTg0NncyLDM6Nz44NzQuP3U4NDZ3PzM4ND8+KXU1Pi93Nz42NDU8Ky91LzQrdyEzMjMuMjorMnUvNCt3MjUvKDI8dTU+L3czMjwzdj0yLT52OjJ1IyIhdzg3NC4/KCw6InU1Pi93byg6KzJ1ODQ2d25pYmJtanU4NDZ3Y2NiYm11ODc0Lj93Y2M4ND8+dToyd2NjODQ/PnU0KTx3Ymo4ND8+dSspNHdiYmlpaG11IyIhdzoydTg0Pz4qOip1ODQ2dzoydTMiOTwhKHU4NDZ3OjJ1MDEtMzN1ODQ2dzoyODo1OisydTg0Nnc6Mjg0PzI1PHUoM3c6Mj06KC91KDIvPnc6MjMuOTYyI3U4NDZ3OjU2NCkidTg0Nnc6KzJ1bmlraWtoa3UjIiF3OisydTo5NzoydS80K3c6KzJ1OTI6NSMyPnU6Mnc6KzJ1OTcvOCJ1OjJ3OisydTgrOigodTg4dzorMnU/Pi1jY3UvPjgzdzorMnU/KT46Njw+KXU4NDZ3OisydT4jKzo1KDI0NXU4MzovdzorMnU8Lj46MnU4NDZ3OisydTM0Nz86MnUvNCt3OisydTIwLjU4ND8+dTg4dzorMnU3ODQ1OjJ1ODQ2dzorMnU3MjUwOisydTQpPHc6KzJ1NjA+OjJ1ODQ2dzorMnU1PjA0OisydTg0Nnc6KzJ1NDoyKyk0dTg0Nnc6KzJ1KS4iLjV1PS41dzorMnUoKDQrPjV1LzQrdzorMnUvLnYhMnU4NDZ3OisydS48NyI4Oi91ODh3OisydS1odTg2dzorMnUsMzovOjJ1ODh3OisydSwrPCEodS80K3c6KzJ1Iy8idTorK3c6KzJ1Ii4+PDc+dTg0Nnc6KzJ1ISEiLnU2Pnc6KzI2OikvdToydzorMispNHU2OiI1NClqa2lvdTcyLT53OisyIjJ1ODQ2dzorKzciMXUzMjorMnUvNCt3Oi48Ni41L3U4NDZ3OW8udSohIXUyNHc4NzouPz8idTg0Nnc4NzouPz52ODQ/PnYzLjl1Oisrdzg3Oi4/PnY0Ky4odS80K3c4NzouPz4yPz51NT4vdzg0dSI+KHUtPHc4ND8+dSw+NSw+NXY6MnU4NDZ3ODQ/PnUjdjoyNHU4NDZ3ODQ/PjI3Ojl1ODQ2dzguOT41OD51ODQ2dz8+PispNC4vPil1LzQrdz8yNjopOiJ1ODQ2dz82IzorMnU4NDZ3PzQ4KHU6Mjw4aT91ODQ2dz8uODA4ND8yNTx1ODQ2dz0wdTMoMywwdTQpPHc9NzorODQ/PnU4NDZ3PTQjODQ/PnUzKDMsMHU0KTx3PTQjODQ/PnUpMTF1ODh3PS43MnUzIzJ1Nj53PD4vPDQ6KzJ1ODQ2dzwrL3UhMzIhPjU8IT41PHU4NDZ3PCsvPDQ/dTg3NC4/dzwrLzA+InU+LnU0KTx3PCsvKzoidSgvNCk+dzM/PCg5dTg0NnczPjU6KzJ1LzQrdzI1KC84NCsyNzQvdjorMnU4NDZ3MT41MiI6dS80K3cxMj4wNC51OjJ3MDx2OisydTg3NC4/dzVqNXU6Mnc1Pix2OisydS5vLSl1ODQ2dzU+LHUjIjgzOi86MnU4NDZ3NDU+djorMnU5Ny84InUvNCt3NDU+dTQ4NDQ3OjJ1ODQ2dzQ1PjorMnUrOjI1Lzk0L3UvNCt3NCs+NXUjMjo0MTI1PDoydTg0Nnc0Kz41ODc6Lj8+dTY+dzQrLih1PCsvLi51ODQ2dys0NzQ6MnUvNCt3KzQ3NDorMnUvNCt3KykyLTU0Pz51ODQ2dyspNCMiOjJ1ODQ2dyoyNSEzMjoydTg0NncpMjwzL3U4ND8+KHcpLjU6NSIvMjY+dTMjMnU2PncoKCg6Mjg0Pz51ODQ2dygvNCk+dSEhIi4odS80K3cvMjo1LzI6NToydSspNHcuMi4yOisydTg0NncuNTI6KzJ1OjJ3LTIrdS41PyIyNTw6KzJ1ODQ2dyw0Nz06MnUvNCt3LCEsdT8+bnU1Pi93LCEsdSsrdS46dyM6Mik0Li8+KXU4NDZ3IzoyIzorMnU4NDZ3IzI6NDMuOisydSgyLz53IzI6NDMuNjI1MnUoMi8+dyMidSs0NzQ6KzJ1ODQ2dyI6NSg/bW1tdTg0NnciOjUoP21tbXUvNCt3Ii41LC51OjJ3Ii41LC51IT46OS4pdTorK3chPjU2LiN1OjI="
// @from(Ln 226644, Col 4)
KKz = "Pz4+Kyg+PjB3NjQ0NSgzNC93NjI1MjY6I3cjOjYyNTI2dyEzMisudzkyPDY0Pz43dzk6MjgzLjo1dygvPis9LjV3a2o6Mnc/OigzKDg0Kz53LTQ3OD4o"
// @from(Ln 226645, Col 4)
_Kz
// @from(Ln 226645, Col 9)
zKz
// @from(Ln 226646, Col 4)
zD4 = L(() => {
    U4();
    IZ();
    x9();
    _Kz = P1(() => KD4(qKz)), zKz = P1(() => KD4(KKz))
})
// @from(Ln 226653, Col 0)
function CU1() {
    return {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null
    }
}
// @from(Ln 226668, Col 0)
function jD4(q) {
    oj6 = q
}
// @from(Ln 226672, Col 0)
function Lw(q, K = "") {
    let _ = typeof q === "string" ? q : q.source,
        z = {
            replace: (Y, A) => {
                let O = typeof A === "string" ? A : A.source;
                return O = O.replace(Ek.caret, "$1"), _ = _.replace(Y, O), z
            },
            getRegex: () => {
                return new RegExp(_, K)
            }
        };
    return z
}
// @from(Ln 226686, Col 0)
function zc(q, K) {
    if (K) {
        if (Ek.escapeTest.test(q)) return q.replace(Ek.escapeReplace, AD4)
    } else if (Ek.escapeTestNoEncode.test(q)) return q.replace(Ek.escapeReplaceNoEncode, AD4);
    return q
}
// @from(Ln 226693, Col 0)
function OD4(q) {
    try {
        q = encodeURI(q).replace(Ek.percentDecode, "%")
    } catch {
        return null
    }
    return q
}
// @from(Ln 226702, Col 0)
function wD4(q, K) {
    let _ = q.replace(Ek.findPipe, (A, O, w) => {
            let $ = !1,
                j = O;
            while (--j >= 0 && w[j] === "\\") $ = !$;
            if ($) return "|";
            else return " |"
        }),
        z = _.split(Ek.splitPipe),
        Y = 0;
    if (!z[0].trim()) z.shift();
    if (z.length > 0 && !z.at(-1)?.trim()) z.pop();
    if (K)
        if (z.length > K) z.splice(K);
        else
            while (z.length < K) z.push("");
    for (; Y < z.length; Y++) z[Y] = z[Y].trim().replace(Ek.slashPipe, "|");
    return z
}
// @from(Ln 226722, Col 0)
function he6(q, K, _) {
    let z = q.length;
    if (z === 0) return "";
    let Y = 0;
    while (Y < z)
        if (q.charAt(z - Y - 1) === K) Y++;
        else break;
    return q.slice(0, z - Y)
}
// @from(Ln 226732, Col 0)
function FKz(q, K) {
    if (q.indexOf(K[1]) === -1) return -1;
    let _ = 0;
    for (let z = 0; z < q.length; z++)
        if (q[z] === "\\") z++;
        else if (q[z] === K[0]) _++;
    else if (q[z] === K[1]) {
        if (_--, _ < 0) return z
    }
    return -1
}
// @from(Ln 226744, Col 0)
function $D4(q, K, _, z, Y) {
    let A = K.href,
        O = K.title || null,
        w = q[1].replace(Y.other.outputLinkReplace, "$1");
    if (q[0].charAt(0) !== "!") {
        z.state.inLink = !0;
        let $ = {
            type: "link",
            raw: _,
            href: A,
            title: O,
            text: w,
            tokens: z.inlineTokens(w)
        };
        return z.state.inLink = !1, $
    }
    return {
        type: "image",
        raw: _,
        href: A,
        title: O,
        text: w
    }
}
// @from(Ln 226769, Col 0)
function gKz(q, K, _) {
    let z = q.match(_.other.indentCodeCompensation);
    if (z === null) return K;
    let Y = z[1];
    return K.split(`
`).map((A) => {
        let O = A.match(_.other.beginningSpace);
        if (O === null) return A;
        let [w] = O;
        if (w.length >= Y.length) return A.slice(Y.length);
        return A
    }).join(`
`)
}
// @from(Ln 226783, Col 0)
class Ce6 {
    options;
    rules;
    lexer;
    constructor(q) {
        this.options = q || oj6
    }
    space(q) {
        let K = this.rules.block.newline.exec(q);
        if (K && K[0].length > 0) return {
            type: "space",
            raw: K[0]
        }
    }
    code(q) {
        let K = this.rules.block.code.exec(q);
        if (K) {
            let _ = K[0].replace(this.rules.other.codeRemoveIndent, "");
            return {
                type: "code",
                raw: K[0],
                codeBlockStyle: "indented",
                text: !this.options.pedantic ? he6(_, `
`) : _
            }
        }
    }
    fences(q) {
        let K = this.rules.block.fences.exec(q);
        if (K) {
            let _ = K[0],
                z = gKz(_, K[3] || "", this.rules);
            return {
                type: "code",
                raw: _,
                lang: K[2] ? K[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : K[2],
                text: z
            }
        }
    }
    heading(q) {
        let K = this.rules.block.heading.exec(q);
        if (K) {
            let _ = K[2].trim();
            if (this.rules.other.endingHash.test(_)) {
                let z = he6(_, "#");
                if (this.options.pedantic) _ = z.trim();
                else if (!z || this.rules.other.endingSpaceChar.test(z)) _ = z.trim()
            }
            return {
                type: "heading",
                raw: K[0],
                depth: K[1].length,
                text: _,
                tokens: this.lexer.inline(_)
            }
        }
    }
    hr(q) {
        let K = this.rules.block.hr.exec(q);
        if (K) return {
            type: "hr",
            raw: he6(K[0], `
`)
        }
    }
    blockquote(q) {
        let K = this.rules.block.blockquote.exec(q);
        if (K) {
            let _ = he6(K[0], `
`).split(`
`),
                z = "",
                Y = "",
                A = [];
            while (_.length > 0) {
                let O = !1,
                    w = [],
                    $;
                for ($ = 0; $ < _.length; $++)
                    if (this.rules.other.blockquoteStart.test(_[$])) w.push(_[$]), O = !0;
                    else if (!O) w.push(_[$]);
                else break;
                _ = _.slice($);
                let j = w.join(`
`),
                    H = j.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
                z = z ? `${z}
${j}` : j, Y = Y ? `${Y}
${H}` : H;
                let J = this.lexer.state.top;
                if (this.lexer.state.top = !0, this.lexer.blockTokens(H, A, !0), this.lexer.state.top = J, _.length === 0) break;
                let X = A.at(-1);
                if (X?.type === "code") break;
                else if (X?.type === "blockquote") {
                    let M = X,
                        P = M.raw + `
` + _.join(`
`),
                        W = this.blockquote(P);
                    A[A.length - 1] = W, z = z.substring(0, z.length - M.raw.length) + W.raw, Y = Y.substring(0, Y.length - M.text.length) + W.text;
                    break
                } else if (X?.type === "list") {
                    let M = X,
                        P = M.raw + `
` + _.join(`
`),
                        W = this.list(P);
                    A[A.length - 1] = W, z = z.substring(0, z.length - X.raw.length) + W.raw, Y = Y.substring(0, Y.length - M.raw.length) + W.raw, _ = P.substring(A.at(-1).raw.length).split(`
`);
                    continue
                }
            }
            return {
                type: "blockquote",
                raw: z,
                tokens: A,
                text: Y
            }
        }
    }
    list(q) {
        let K = this.rules.block.list.exec(q);
        if (K) {
            let _ = K[1].trim(),
                z = _.length > 1,
                Y = {
                    type: "list",
                    raw: "",
                    ordered: z,
                    start: z ? +_.slice(0, -1) : "",
                    loose: !1,
                    items: []
                };
            if (_ = z ? `\\d{1,9}\\${_.slice(-1)}` : `\\${_}`, this.options.pedantic) _ = z ? _ : "[*+-]";
            let A = this.rules.other.listItemRegex(_),
                O = !1;
            while (q) {
                let $ = !1,
                    j = "",
                    H = "";
                if (!(K = A.exec(q))) break;
                if (this.rules.block.hr.test(q)) break;
                j = K[0], q = q.substring(j.length);
                let J = K[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Z) => " ".repeat(3 * Z.length)),
                    X = q.split(`
`, 1)[0],
                    M = !J.trim(),
                    P = 0;
                if (this.options.pedantic) P = 2, H = J.trimStart();
                else if (M) P = K[1].length + 1;
                else P = K[2].search(this.rules.other.nonSpaceChar), P = P > 4 ? 1 : P, H = J.slice(P), P += K[1].length;
                if (M && this.rules.other.blankLine.test(X)) j += X + `
`, q = q.substring(X.length + 1), $ = !0;
                if (!$) {
                    let Z = this.rules.other.nextBulletRegex(P),
                        G = this.rules.other.hrRegex(P),
                        f = this.rules.other.fencesBeginRegex(P),
                        v = this.rules.other.headingBeginRegex(P),
                        V = this.rules.other.htmlBeginRegex(P);
                    while (q) {
                        let k = q.split(`
`, 1)[0],
                            N;
                        if (X = k, this.options.pedantic) X = X.replace(this.rules.other.listReplaceNesting, "  "), N = X;
                        else N = X.replace(this.rules.other.tabCharGlobal, "    ");
                        if (f.test(X)) break;
                        if (v.test(X)) break;
                        if (V.test(X)) break;
                        if (Z.test(X)) break;
                        if (G.test(X)) break;
                        if (N.search(this.rules.other.nonSpaceChar) >= P || !X.trim()) H += `
` + N.slice(P);
                        else {
                            if (M) break;
                            if (J.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
                            if (f.test(J)) break;
                            if (v.test(J)) break;
                            if (G.test(J)) break;
                            H += `
` + X
                        }
                        if (!M && !X.trim()) M = !0;
                        j += k + `
`, q = q.substring(k.length + 1), J = N.slice(P)
                    }
                }
                if (!Y.loose) {
                    if (O) Y.loose = !0;
                    else if (this.rules.other.doubleBlankLine.test(j)) O = !0
                }
                let W = null,
                    D;
                if (this.options.gfm) {
                    if (W = this.rules.other.listIsTask.exec(H), W) D = W[0] !== "[ ] ", H = H.replace(this.rules.other.listReplaceTask, "")
                }
                Y.items.push({
                    type: "list_item",
                    raw: j,
                    task: !!W,
                    checked: D,
                    loose: !1,
                    text: H,
                    tokens: []
                }), Y.raw += j
            }
            let w = Y.items.at(-1);
            if (w) w.raw = w.raw.trimEnd(), w.text = w.text.trimEnd();
            else return;
            Y.raw = Y.raw.trimEnd();
            for (let $ = 0; $ < Y.items.length; $++)
                if (this.lexer.state.top = !1, Y.items[$].tokens = this.lexer.blockTokens(Y.items[$].text, []), !Y.loose) {
                    let j = Y.items[$].tokens.filter((J) => J.type === "space"),
                        H = j.length > 0 && j.some((J) => this.rules.other.anyLine.test(J.raw));
                    Y.loose = H
                } if (Y.loose)
                for (let $ = 0; $ < Y.items.length; $++) Y.items[$].loose = !0;
            return Y
        }
    }
    html(q) {
        let K = this.rules.block.html.exec(q);
        if (K) return {
            type: "html",
            block: !0,
            raw: K[0],
            pre: K[1] === "pre" || K[1] === "script" || K[1] === "style",
            text: K[0]
        }
    }
    def(q) {
        let K = this.rules.block.def.exec(q);
        if (K) {
            let _ = K[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
                z = K[2] ? K[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
                Y = K[3] ? K[3].substring(1, K[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : K[3];
            return {
                type: "def",
                tag: _,
                raw: K[0],
                href: z,
                title: Y
            }
        }
    }
    table(q) {
        let K = this.rules.block.table.exec(q);
        if (!K) return;
        if (!this.rules.other.tableDelimiter.test(K[2])) return;
        let _ = wD4(K[1]),
            z = K[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            Y = K[3]?.trim() ? K[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [],
            A = {
                type: "table",
                raw: K[0],
                header: [],
                align: [],
                rows: []
            };
        if (_.length !== z.length) return;
        for (let O of z)
            if (this.rules.other.tableAlignRight.test(O)) A.align.push("right");
            else if (this.rules.other.tableAlignCenter.test(O)) A.align.push("center");
        else if (this.rules.other.tableAlignLeft.test(O)) A.align.push("left");
        else A.align.push(null);
        for (let O = 0; O < _.length; O++) A.header.push({
            text: _[O],
            tokens: this.lexer.inline(_[O]),
            header: !0,
            align: A.align[O]
        });
        for (let O of Y) A.rows.push(wD4(O, A.header.length).map((w, $) => {
            return {
                text: w,
                tokens: this.lexer.inline(w),
                header: !1,
                align: A.align[$]
            }
        }));
        return A
    }
    lheading(q) {
        let K = this.rules.block.lheading.exec(q);
        if (K) return {
            type: "heading",
            raw: K[0],
            depth: K[2].charAt(0) === "=" ? 1 : 2,
            text: K[1],
            tokens: this.lexer.inline(K[1])
        }
    }
    paragraph(q) {
        let K = this.rules.block.paragraph.exec(q);
        if (K) {
            let _ = K[1].charAt(K[1].length - 1) === `
` ? K[1].slice(0, -1) : K[1];
            return {
                type: "paragraph",
                raw: K[0],
                text: _,
                tokens: this.lexer.inline(_)
            }
        }
    }
    text(q) {
        let K = this.rules.block.text.exec(q);
        if (K) return {
            type: "text",
            raw: K[0],
            text: K[0],
            tokens: this.lexer.inline(K[0])
        }
    }
    escape(q) {
        let K = this.rules.inline.escape.exec(q);
        if (K) return {
            type: "escape",
            raw: K[0],
            text: K[1]
        }
    }
    tag(q) {
        let K = this.rules.inline.tag.exec(q);
        if (K) {
            if (!this.lexer.state.inLink && this.rules.other.startATag.test(K[0])) this.lexer.state.inLink = !0;
            else if (this.lexer.state.inLink && this.rules.other.endATag.test(K[0])) this.lexer.state.inLink = !1;
            if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(K[0])) this.lexer.state.inRawBlock = !0;
            else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(K[0])) this.lexer.state.inRawBlock = !1;
            return {
                type: "html",
                raw: K[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: K[0]
            }
        }
    }
    link(q) {
        let K = this.rules.inline.link.exec(q);
        if (K) {
            let _ = K[2].trim();
            if (!this.options.pedantic && this.rules.other.startAngleBracket.test(_)) {
                if (!this.rules.other.endAngleBracket.test(_)) return;
                let A = he6(_.slice(0, -1), "\\");
                if ((_.length - A.length) % 2 === 0) return
            } else {
                let A = FKz(K[2], "()");
                if (A > -1) {
                    let w = (K[0].indexOf("!") === 0 ? 5 : 4) + K[1].length + A;
                    K[2] = K[2].substring(0, A), K[0] = K[0].substring(0, w).trim(), K[3] = ""
                }
            }
            let z = K[2],
                Y = "";
            if (this.options.pedantic) {
                let A = this.rules.other.pedanticHrefTitle.exec(z);
                if (A) z = A[1], Y = A[3]
            } else Y = K[3] ? K[3].slice(1, -1) : "";
            if (z = z.trim(), this.rules.other.startAngleBracket.test(z))
                if (this.options.pedantic && !this.rules.other.endAngleBracket.test(_)) z = z.slice(1);
                else z = z.slice(1, -1);
            return $D4(K, {
                href: z ? z.replace(this.rules.inline.anyPunctuation, "$1") : z,
                title: Y ? Y.replace(this.rules.inline.anyPunctuation, "$1") : Y
            }, K[0], this.lexer, this.rules)
        }
    }
    reflink(q, K) {
        let _;
        if ((_ = this.rules.inline.reflink.exec(q)) || (_ = this.rules.inline.nolink.exec(q))) {
            let z = (_[2] || _[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
                Y = K[z.toLowerCase()];
            if (!Y) {
                let A = _[0].charAt(0);
                return {
                    type: "text",
                    raw: A,
                    text: A
                }
            }
            return $D4(_, Y, _[0], this.lexer, this.rules)
        }
    }
    emStrong(q, K, _ = "") {
        let z = this.rules.inline.emStrongLDelim.exec(q);
        if (!z) return;
        if (z[3] && _.match(this.rules.other.unicodeAlphaNumeric)) return;
        if (!(z[1] || z[2]) || !_ || this.rules.inline.punctuation.exec(_)) {
            let A = [...z[0]].length - 1,
                O, w, $ = A,
                j = 0,
                H = z[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
            H.lastIndex = 0, K = K.slice(-1 * q.length + A);
            while ((z = H.exec(K)) != null) {
                if (O = z[1] || z[2] || z[3] || z[4] || z[5] || z[6], !O) continue;
                if (w = [...O].length, z[3] || z[4]) {
                    $ += w;
                    continue
                } else if (z[5] || z[6]) {
                    if (A % 3 && !((A + w) % 3)) {
                        j += w;
                        continue
                    }
                }
                if ($ -= w, $ > 0) continue;
                w = Math.min(w, w + $ + j);
                let J = [...z[0]][0].length,
                    X = q.slice(0, A + z.index + J + w);
                if (Math.min(A, w) % 2) {
                    let P = X.slice(1, -1);
                    return {
                        type: "em",
                        raw: X,
                        text: P,
                        tokens: this.lexer.inlineTokens(P)
                    }
                }
                let M = X.slice(2, -2);
                return {
                    type: "strong",
                    raw: X,
                    text: M,
                    tokens: this.lexer.inlineTokens(M)
                }
            }
        }
    }
    codespan(q) {
        let K = this.rules.inline.code.exec(q);
        if (K) {
            let _ = K[2].replace(this.rules.other.newLineCharGlobal, " "),
                z = this.rules.other.nonSpaceChar.test(_),
                Y = this.rules.other.startingSpaceChar.test(_) && this.rules.other.endingSpaceChar.test(_);
            if (z && Y) _ = _.substring(1, _.length - 1);
            return {
                type: "codespan",
                raw: K[0],
                text: _
            }
        }
    }
    br(q) {
        let K = this.rules.inline.br.exec(q);
        if (K) return {
            type: "br",
            raw: K[0]
        }
    }
    del(q) {
        let K = this.rules.inline.del.exec(q);
        if (K) return {
            type: "del",
            raw: K[0],
            text: K[2],
            tokens: this.lexer.inlineTokens(K[2])
        }
    }
    autolink(q) {
        let K = this.rules.inline.autolink.exec(q);
        if (K) {
            let _, z;
            if (K[2] === "@") _ = K[1], z = "mailto:" + _;
            else _ = K[1], z = _;
            return {
                type: "link",
                raw: K[0],
                text: _,
                href: z,
                tokens: [{
                    type: "text",
                    raw: _,
                    text: _
                }]
            }
        }
    }
    url(q) {
        let K;
        if (K = this.rules.inline.url.exec(q)) {
            let _, z;
            if (K[2] === "@") _ = K[0], z = "mailto:" + _;
            else {
                let Y;
                do Y = K[0], K[0] = this.rules.inline._backpedal.exec(K[0])?.[0] ?? ""; while (Y !== K[0]);
                if (_ = K[0], K[1] === "www.") z = "http://" + K[0];
                else z = K[0]
            }
            return {
                type: "link",
                raw: K[0],
                text: _,
                href: z,
                tokens: [{
                    type: "text",
                    raw: _,
                    text: _
                }]
            }
        }
    }
    inlineText(q) {
        let K = this.rules.inline.text.exec(q);
        if (K) {
            let _ = this.lexer.state.inRawBlock;
            return {
                type: "text",
                raw: K[0],
                text: K[0],
                escaped: _
            }
        }
    }
}
// @from(Ln 227300, Col 0)
class yk {
    tokens;
    options;
    state;
    tokenizer;
    inlineQueue;
    constructor(q) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = q || oj6, this.options.tokenizer = this.options.tokenizer || new Ce6, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
            inLink: !1,
            inRawBlock: !1,
            top: !0
        };
        let K = {
            other: Ek,
            block: eR8.normal,
            inline: Le6.normal
        };
        if (this.options.pedantic) K.block = eR8.pedantic, K.inline = Le6.pedantic;
        else if (this.options.gfm)
            if (K.block = eR8.gfm, this.options.breaks) K.inline = Le6.breaks;
            else K.inline = Le6.gfm;
        this.tokenizer.rules = K
    }
    static get rules() {
        return {
            block: eR8,
            inline: Le6
        }
    }
    static lex(q, K) {
        return new yk(K).lex(q)
    }
    static lexInline(q, K) {
        return new yk(K).inlineTokens(q)
    }
    lex(q) {
        q = q.replace(Ek.carriageReturn, `
`), this.blockTokens(q, this.tokens);
        for (let K = 0; K < this.inlineQueue.length; K++) {
            let _ = this.inlineQueue[K];
            this.inlineTokens(_.src, _.tokens)
        }
        return this.inlineQueue = [], this.tokens
    }
    blockTokens(q, K = [], _ = !1) {
        if (this.options.pedantic) q = q.replace(Ek.tabCharGlobal, "    ").replace(Ek.spaceLine, "");
        while (q) {
            let z;
            if (this.options.extensions?.block?.some((A) => {
                    if (z = A.call({
                            lexer: this
                        }, q, K)) return q = q.substring(z.raw.length), K.push(z), !0;
                    return !1
                })) continue;
            if (z = this.tokenizer.space(q)) {
                q = q.substring(z.raw.length);
                let A = K.at(-1);
                if (z.raw.length === 1 && A !== void 0) A.raw += `
`;
                else K.push(z);
                continue
            }
            if (z = this.tokenizer.code(q)) {
                q = q.substring(z.raw.length);
                let A = K.at(-1);
                if (A?.type === "paragraph" || A?.type === "text") A.raw += `
` + z.raw, A.text += `
` + z.text, this.inlineQueue.at(-1).src = A.text;
                else K.push(z);
                continue
            }
            if (z = this.tokenizer.fences(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.heading(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.hr(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.blockquote(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.list(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.html(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.def(q)) {
                q = q.substring(z.raw.length);
                let A = K.at(-1);
                if (A?.type === "paragraph" || A?.type === "text") A.raw += `
` + z.raw, A.text += `
` + z.raw, this.inlineQueue.at(-1).src = A.text;
                else if (!this.tokens.links[z.tag]) this.tokens.links[z.tag] = {
                    href: z.href,
                    title: z.title
                };
                continue
            }
            if (z = this.tokenizer.table(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            if (z = this.tokenizer.lheading(q)) {
                q = q.substring(z.raw.length), K.push(z);
                continue
            }
            let Y = q;
            if (this.options.extensions?.startBlock) {
                let A = 1 / 0,
                    O = q.slice(1),
                    w;
                if (this.options.extensions.startBlock.forEach(($) => {
                        if (w = $.call({
                                lexer: this
                            }, O), typeof w === "number" && w >= 0) A = Math.min(A, w)
                    }), A < 1 / 0 && A >= 0) Y = q.substring(0, A + 1)
            }
            if (this.state.top && (z = this.tokenizer.paragraph(Y))) {
                let A = K.at(-1);
                if (_ && A?.type === "paragraph") A.raw += `
` + z.raw, A.text += `
` + z.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = A.text;
                else K.push(z);
                _ = Y.length !== q.length, q = q.substring(z.raw.length);
                continue
            }
            if (z = this.tokenizer.text(q)) {
                q = q.substring(z.raw.length);
                let A = K.at(-1);
                if (A?.type === "text") A.raw += `
` + z.raw, A.text += `
` + z.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = A.text;
                else K.push(z);
                continue
            }
            if (q) {
                let A = "Infinite loop on byte: " + q.charCodeAt(0);
                if (this.options.silent) {
                    console.error(A);
                    break
                } else throw Error(A)
            }
        }
        return this.state.top = !0, K
    }
    inline(q, K = []) {
        return this.inlineQueue.push({
            src: q,
            tokens: K
        }), K
    }
    inlineTokens(q, K = []) {
        let _ = q,
            z = null;
        if (this.tokens.links) {
            let O = Object.keys(this.tokens.links);
            if (O.length > 0) {
                while ((z = this.tokenizer.rules.inline.reflinkSearch.exec(_)) != null)
                    if (O.includes(z[0].slice(z[0].lastIndexOf("[") + 1, -1))) _ = _.slice(0, z.index) + "[" + "a".repeat(z[0].length - 2) + "]" + _.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)
            }
        }
        while ((z = this.tokenizer.rules.inline.blockSkip.exec(_)) != null) _ = _.slice(0, z.index) + "[" + "a".repeat(z[0].length - 2) + "]" + _.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        while ((z = this.tokenizer.rules.inline.anyPunctuation.exec(_)) != null) _ = _.slice(0, z.index) + "++" + _.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        let Y = !1,
            A = "";
        while (q) {
            if (!Y) A = "";
            Y = !1;
            let O;
            if (this.options.extensions?.inline?.some(($) => {
                    if (O = $.call({
                            lexer: this
                        }, q, K)) return q = q.substring(O.raw.length), K.push(O), !0;
                    return !1
                })) continue;
            if (O = this.tokenizer.escape(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.tag(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.link(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.reflink(q, this.tokens.links)) {
                q = q.substring(O.raw.length);
                let $ = K.at(-1);
                if (O.type === "text" && $?.type === "text") $.raw += O.raw, $.text += O.text;
                else K.push(O);
                continue
            }
            if (O = this.tokenizer.emStrong(q, _, A)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.codespan(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.br(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.del(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (O = this.tokenizer.autolink(q)) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            if (!this.state.inLink && (O = this.tokenizer.url(q))) {
                q = q.substring(O.raw.length), K.push(O);
                continue
            }
            let w = q;
            if (this.options.extensions?.startInline) {
                let $ = 1 / 0,
                    j = q.slice(1),
                    H;
                if (this.options.extensions.startInline.forEach((J) => {
                        if (H = J.call({
                                lexer: this
                            }, j), typeof H === "number" && H >= 0) $ = Math.min($, H)
                    }), $ < 1 / 0 && $ >= 0) w = q.substring(0, $ + 1)
            }
            if (O = this.tokenizer.inlineText(w)) {
                if (q = q.substring(O.raw.length), O.raw.slice(-1) !== "_") A = O.raw.slice(-1);
                Y = !0;
                let $ = K.at(-1);
                if ($?.type === "text") $.raw += O.raw, $.text += O.text;
                else K.push(O);
                continue
            }
            if (q) {
                let $ = "Infinite loop on byte: " + q.charCodeAt(0);
                if (this.options.silent) {
                    console.error($);
                    break
                } else throw Error($)
            }
        }
        return K
    }
}
// @from(Ln 227557, Col 0)
class be6 {
    options;
    parser;
    constructor(q) {
        this.options = q || oj6
    }
    space(q) {
        return ""
    }
    code({
        text: q,
        lang: K,
        escaped: _
    }) {
        let z = (K || "").match(Ek.notSpaceStart)?.[0],
            Y = q.replace(Ek.endingNewline, "") + `
`;
        if (!z) return "<pre><code>" + (_ ? Y : zc(Y, !0)) + `</code></pre>
`;
        return '<pre><code class="language-' + zc(z) + '">' + (_ ? Y : zc(Y, !0)) + `</code></pre>
`
    }
    blockquote({
        tokens: q
    }) {
        return `<blockquote>
${this.parser.parse(q)}</blockquote>
`
    }
    html({
        text: q
    }) {
        return q
    }
    heading({
        tokens: q,
        depth: K
    }) {
        return `<h${K}>${this.parser.parseInline(q)}</h${K}>
`
    }
    hr(q) {
        return `<hr>
`
    }
    list(q) {
        let {
            ordered: K,
            start: _
        } = q, z = "";
        for (let O = 0; O < q.items.length; O++) {
            let w = q.items[O];
            z += this.listitem(w)
        }
        let Y = K ? "ol" : "ul",
            A = K && _ !== 1 ? ' start="' + _ + '"' : "";
        return "<" + Y + A + `>
` + z + "</" + Y + `>
`
    }
    listitem(q) {
        let K = "";
        if (q.task) {
            let _ = this.checkbox({
                checked: !!q.checked
            });
            if (q.loose)
                if (q.tokens[0]?.type === "paragraph") {
                    if (q.tokens[0].text = _ + " " + q.tokens[0].text, q.tokens[0].tokens && q.tokens[0].tokens.length > 0 && q.tokens[0].tokens[0].type === "text") q.tokens[0].tokens[0].text = _ + " " + zc(q.tokens[0].tokens[0].text), q.tokens[0].tokens[0].escaped = !0
                } else q.tokens.unshift({
                    type: "text",
                    raw: _ + " ",
                    text: _ + " ",
                    escaped: !0
                });
            else K += _ + " "
        }
        return K += this.parser.parse(q.tokens, !!q.loose), `<li>${K}</li>
`
    }
    checkbox({
        checked: q
    }) {
        return "<input " + (q ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
    }
    paragraph({
        tokens: q
    }) {
        return `<p>${this.parser.parseInline(q)}</p>
`
    }
    table(q) {
        let K = "",
            _ = "";
        for (let Y = 0; Y < q.header.length; Y++) _ += this.tablecell(q.header[Y]);
        K += this.tablerow({
            text: _
        });
        let z = "";
        for (let Y = 0; Y < q.rows.length; Y++) {
            let A = q.rows[Y];
            _ = "";
            for (let O = 0; O < A.length; O++) _ += this.tablecell(A[O]);
            z += this.tablerow({
                text: _
            })
        }
        if (z) z = `<tbody>${z}</tbody>`;
        return `<table>
<thead>
` + K + `</thead>
` + z + `</table>
`
    }
    tablerow({
        text: q
    }) {
        return `<tr>
${q}</tr>
`
    }
    tablecell(q) {
        let K = this.parser.parseInline(q.tokens),
            _ = q.header ? "th" : "td";
        return (q.align ? `<${_} align="${q.align}">` : `<${_}>`) + K + `</${_}>
`
    }
    strong({
        tokens: q
    }) {
        return `<strong>${this.parser.parseInline(q)}</strong>`
    }
    em({
        tokens: q
    }) {
        return `<em>${this.parser.parseInline(q)}</em>`
    }
    codespan({
        text: q
    }) {
        return `<code>${zc(q,!0)}</code>`
    }
    br(q) {
        return "<br>"
    }
    del({
        tokens: q
    }) {
        return `<del>${this.parser.parseInline(q)}</del>`
    }
    link({
        href: q,
        title: K,
        tokens: _
    }) {
        let z = this.parser.parseInline(_),
            Y = OD4(q);
        if (Y === null) return z;
        q = Y;
        let A = '<a href="' + q + '"';
        if (K) A += ' title="' + zc(K) + '"';
        return A += ">" + z + "</a>", A
    }
    image({
        href: q,
        title: K,
        text: _
    }) {
        let z = OD4(q);
        if (z === null) return zc(_);
        q = z;
        let Y = `<img src="${q}" alt="${_}"`;
        if (K) Y += ` title="${zc(K)}"`;
        return Y += ">", Y
    }
    text(q) {
        return "tokens" in q && q.tokens ? this.parser.parseInline(q.tokens) : ("escaped" in q) && q.escaped ? q.text : zc(q.text)
    }
}
// @from(Ln 227736, Col 0)
class zS8 {
    strong({
        text: q
    }) {
        return q
    }
    em({
        text: q
    }) {
        return q
    }
    codespan({
        text: q
    }) {
        return q
    }
    del({
        text: q
    }) {
        return q
    }
    html({
        text: q
    }) {
        return q
    }
    text({
        text: q
    }) {
        return q
    }
    link({
        text: q
    }) {
        return "" + q
    }
    image({
        text: q
    }) {
        return "" + q
    }
    br() {
        return ""
    }
}
// @from(Ln 227781, Col 0)
class rI {
    options;
    renderer;
    textRenderer;
    constructor(q) {
        this.options = q || oj6, this.options.renderer = this.options.renderer || new be6, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new zS8
    }
    static parse(q, K) {
        return new rI(K).parse(q)
    }
    static parseInline(q, K) {
        return new rI(K).parseInline(q)
    }
    parse(q, K = !0) {
        let _ = "";
        for (let z = 0; z < q.length; z++) {
            let Y = q[z];
            if (this.options.extensions?.renderers?.[Y.type]) {
                let O = Y,
                    w = this.options.extensions.renderers[O.type].call({
                        parser: this
                    }, O);
                if (w !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(O.type)) {
                    _ += w || "";
                    continue
                }
            }
            let A = Y;
            switch (A.type) {
                case "space": {
                    _ += this.renderer.space(A);
                    continue
                }
                case "hr": {
                    _ += this.renderer.hr(A);
                    continue
                }
                case "heading": {
                    _ += this.renderer.heading(A);
                    continue
                }
                case "code": {
                    _ += this.renderer.code(A);
                    continue
                }
                case "table": {
                    _ += this.renderer.table(A);
                    continue
                }
                case "blockquote": {
                    _ += this.renderer.blockquote(A);
                    continue
                }
                case "list": {
                    _ += this.renderer.list(A);
                    continue
                }
                case "html": {
                    _ += this.renderer.html(A);
                    continue
                }
                case "paragraph": {
                    _ += this.renderer.paragraph(A);
                    continue
                }
                case "text": {
                    let O = A,
                        w = this.renderer.text(O);
                    while (z + 1 < q.length && q[z + 1].type === "text") O = q[++z], w += `
` + this.renderer.text(O);
                    if (K) _ += this.renderer.paragraph({
                        type: "paragraph",
                        raw: w,
                        text: w,
                        tokens: [{
                            type: "text",
                            raw: w,
                            text: w,
                            escaped: !0
                        }]
                    });
                    else _ += w;
                    continue
                }
                default: {
                    let O = 'Token with "' + A.type + '" type was not found.';
                    if (this.options.silent) return console.error(O), "";
                    else throw Error(O)
                }
            }
        }
        return _
    }
    parseInline(q, K = this.renderer) {
        let _ = "";
        for (let z = 0; z < q.length; z++) {
            let Y = q[z];
            if (this.options.extensions?.renderers?.[Y.type]) {
                let O = this.options.extensions.renderers[Y.type].call({
                    parser: this
                }, Y);
                if (O !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(Y.type)) {
                    _ += O || "";
                    continue
                }
            }
            let A = Y;
            switch (A.type) {
                case "escape": {
                    _ += K.text(A);
                    break
                }
                case "html": {
                    _ += K.html(A);
                    break
                }
                case "link": {
                    _ += K.link(A);
                    break
                }
                case "image": {
                    _ += K.image(A);
                    break
                }
                case "strong": {
                    _ += K.strong(A);
                    break
                }
                case "em": {
                    _ += K.em(A);
                    break
                }
                case "codespan": {
                    _ += K.codespan(A);
                    break
                }
                case "br": {
                    _ += K.br(A);
                    break
                }
                case "del": {
                    _ += K.del(A);
                    break
                }
                case "text": {
                    _ += K.text(A);
                    break
                }
                default: {
                    let O = 'Token with "' + A.type + '" type was not found.';
                    if (this.options.silent) return console.error(O), "";
                    else throw Error(O)
                }
            }
        }
        return _
    }
}
// @from(Ln 227939, Col 0)
class vD4 {
    defaults = CU1();
    options = this.setOptions;
    parse = this.parseMarkdown(!0);
    parseInline = this.parseMarkdown(!1);
    Parser = rI;
    Renderer = be6;
    TextRenderer = zS8;
    Lexer = yk;
    Tokenizer = Ce6;
    Hooks = Se6;
    constructor(...q) {
        this.use(...q)
    }
    walkTokens(q, K) {
        let _ = [];
        for (let z of q) switch (_ = _.concat(K.call(this, z)), z.type) {
            case "table": {
                let Y = z;
                for (let A of Y.header) _ = _.concat(this.walkTokens(A.tokens, K));
                for (let A of Y.rows)
                    for (let O of A) _ = _.concat(this.walkTokens(O.tokens, K));
                break
            }
            case "list": {
                let Y = z;
                _ = _.concat(this.walkTokens(Y.items, K));
                break
            }
            default: {
                let Y = z;
                if (this.defaults.extensions?.childTokens?.[Y.type]) this.defaults.extensions.childTokens[Y.type].forEach((A) => {
                    let O = Y[A].flat(1 / 0);
                    _ = _.concat(this.walkTokens(O, K))
                });
                else if (Y.tokens) _ = _.concat(this.walkTokens(Y.tokens, K))
            }
        }
        return _
    }
    use(...q) {
        let K = this.defaults.extensions || {
            renderers: {},
            childTokens: {}
        };
        return q.forEach((_) => {
            let z = {
                ..._
            };
            if (z.async = this.defaults.async || z.async || !1, _.extensions) _.extensions.forEach((Y) => {
                if (!Y.name) throw Error("extension name required");
                if ("renderer" in Y) {
                    let A = K.renderers[Y.name];
                    if (A) K.renderers[Y.name] = function(...O) {
                        let w = Y.renderer.apply(this, O);
                        if (w === !1) w = A.apply(this, O);
                        return w
                    };
                    else K.renderers[Y.name] = Y.renderer
                }
                if ("tokenizer" in Y) {
                    if (!Y.level || Y.level !== "block" && Y.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
                    let A = K[Y.level];
                    if (A) A.unshift(Y.tokenizer);
                    else K[Y.level] = [Y.tokenizer];
                    if (Y.start) {
                        if (Y.level === "block")
                            if (K.startBlock) K.startBlock.push(Y.start);
                            else K.startBlock = [Y.start];
                        else if (Y.level === "inline")
                            if (K.startInline) K.startInline.push(Y.start);
                            else K.startInline = [Y.start]
                    }
                }
                if ("childTokens" in Y && Y.childTokens) K.childTokens[Y.name] = Y.childTokens
            }), z.extensions = K;
            if (_.renderer) {
                let Y = this.defaults.renderer || new be6(this.defaults);
                for (let A in _.renderer) {
                    if (!(A in Y)) throw Error(`renderer '${A}' does not exist`);
                    if (["options", "parser"].includes(A)) continue;
                    let O = A,
                        w = _.renderer[O],
                        $ = Y[O];
                    Y[O] = (...j) => {
                        let H = w.apply(Y, j);
                        if (H === !1) H = $.apply(Y, j);
                        return H || ""
                    }
                }
                z.renderer = Y
            }
            if (_.tokenizer) {
                let Y = this.defaults.tokenizer || new Ce6(this.defaults);
                for (let A in _.tokenizer) {
                    if (!(A in Y)) throw Error(`tokenizer '${A}' does not exist`);
                    if (["options", "rules", "lexer"].includes(A)) continue;
                    let O = A,
                        w = _.tokenizer[O],
                        $ = Y[O];
                    Y[O] = (...j) => {
                        let H = w.apply(Y, j);
                        if (H === !1) H = $.apply(Y, j);
                        return H
                    }
                }
                z.tokenizer = Y
            }
            if (_.hooks) {
                let Y = this.defaults.hooks || new Se6;
                for (let A in _.hooks) {
                    if (!(A in Y)) throw Error(`hook '${A}' does not exist`);
                    if (["options", "block"].includes(A)) continue;
                    let O = A,
                        w = _.hooks[O],
                        $ = Y[O];
                    if (Se6.passThroughHooks.has(A)) Y[O] = (j) => {
                        if (this.defaults.async) return Promise.resolve(w.call(Y, j)).then((J) => {
                            return $.call(Y, J)
                        });
                        let H = w.call(Y, j);
                        return $.call(Y, H)
                    };
                    else Y[O] = (...j) => {
                        let H = w.apply(Y, j);
                        if (H === !1) H = $.apply(Y, j);
                        return H
                    }
                }
                z.hooks = Y
            }
            if (_.walkTokens) {
                let Y = this.defaults.walkTokens,
                    A = _.walkTokens;
                z.walkTokens = function(O) {
                    let w = [];
                    if (w.push(A.call(this, O)), Y) w = w.concat(Y.call(this, O));
                    return w
                }
            }
            this.defaults = {
                ...this.defaults,
                ...z
            }
        }), this
    }
    setOptions(q) {
        return this.defaults = {
            ...this.defaults,
            ...q
        }, this
    }
    lexer(q, K) {
        return yk.lex(q, K ?? this.defaults)
    }
    parser(q, K) {
        return rI.parse(q, K ?? this.defaults)
    }
    parseMarkdown(q) {
        return (_, z) => {
            let Y = {
                    ...z
                },
                A = {
                    ...this.defaults,
                    ...Y
                },
                O = this.onError(!!A.silent, !!A.async);
            if (this.defaults.async === !0 && Y.async === !1) return O(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
            if (typeof _ > "u" || _ === null) return O(Error("marked(): input parameter is undefined or null"));
            if (typeof _ !== "string") return O(Error("marked(): input parameter is of type " + Object.prototype.toString.call(_) + ", string expected"));
            if (A.hooks) A.hooks.options = A, A.hooks.block = q;
            let w = A.hooks ? A.hooks.provideLexer() : q ? yk.lex : yk.lexInline,
                $ = A.hooks ? A.hooks.provideParser() : q ? rI.parse : rI.parseInline;
            if (A.async) return Promise.resolve(A.hooks ? A.hooks.preprocess(_) : _).then((j) => w(j, A)).then((j) => A.hooks ? A.hooks.processAllTokens(j) : j).then((j) => A.walkTokens ? Promise.all(this.walkTokens(j, A.walkTokens)).then(() => j) : j).then((j) => $(j, A)).then((j) => A.hooks ? A.hooks.postprocess(j) : j).catch(O);
            try {
                if (A.hooks) _ = A.hooks.preprocess(_);
                let j = w(_, A);
                if (A.hooks) j = A.hooks.processAllTokens(j);
                if (A.walkTokens) this.walkTokens(j, A.walkTokens);
                let H = $(j, A);
                if (A.hooks) H = A.hooks.postprocess(H);
                return H
            } catch (j) {
                return O(j)
            }
        }
    }
    onError(q, K) {
        return (_) => {
            if (_.message += `
Please report this to https://github.com/markedjs/marked.`, q) {
                let z = "<p>An error occurred:</p><pre>" + zc(_.message + "", !0) + "</pre>";
                if (K) return Promise.resolve(z);
                return z
            }
            if (K) return Promise.reject(_);
            throw _
        }
    }
}
// @from(Ln 228141, Col 0)
function wY(q, K) {
    return rj6.parse(q, K)
}
// @from(Ln 228144, Col 4)
oj6
// @from(Ln 228144, Col 9)
Re6
// @from(Ln 228144, Col 14)
Ek
// @from(Ln 228144, Col 18)
wKz
// @from(Ln 228144, Col 23)
$Kz
// @from(Ln 228144, Col 28)
jKz
// @from(Ln 228144, Col 33)
Ie6
// @from(Ln 228144, Col 38)
HKz
// @from(Ln 228144, Col 43)
HD4
// @from(Ln 228144, Col 48)
JD4
// @from(Ln 228144, Col 53)
bU1
// @from(Ln 228144, Col 58)
JKz
// @from(Ln 228144, Col 63)
IU1
// @from(Ln 228144, Col 68)
XKz
// @from(Ln 228144, Col 73)
MKz
// @from(Ln 228144, Col 78)
KS8 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"
// @from(Ln 228145, Col 4)
xU1
// @from(Ln 228145, Col 9)
PKz
// @from(Ln 228145, Col 14)
XD4
// @from(Ln 228145, Col 19)
WKz
// @from(Ln 228145, Col 24)
uU1
// @from(Ln 228145, Col 29)
YD4
// @from(Ln 228145, Col 34)
DKz
// @from(Ln 228145, Col 39)
ZKz
// @from(Ln 228145, Col 44)
fKz
// @from(Ln 228145, Col 49)
GKz
// @from(Ln 228145, Col 54)
MD4
// @from(Ln 228145, Col 59)
vKz
// @from(Ln 228145, Col 64)
_S8
// @from(Ln 228145, Col 69)
mU1
// @from(Ln 228145, Col 74)
PD4
// @from(Ln 228145, Col 79)
TKz
// @from(Ln 228145, Col 84)
WD4
// @from(Ln 228145, Col 89)
VKz
// @from(Ln 228145, Col 94)
kKz
// @from(Ln 228145, Col 99)
NKz
// @from(Ln 228145, Col 104)
DD4
// @from(Ln 228145, Col 109)
EKz
// @from(Ln 228145, Col 114)
yKz
// @from(Ln 228145, Col 119)
ZD4 = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)"
// @from(Ln 228146, Col 4)
LKz
// @from(Ln 228146, Col 9)
hKz
// @from(Ln 228146, Col 14)
RKz
// @from(Ln 228146, Col 19)
SKz
// @from(Ln 228146, Col 24)
CKz
// @from(Ln 228146, Col 29)
bKz
// @from(Ln 228146, Col 34)
IKz
// @from(Ln 228146, Col 39)
qS8
// @from(Ln 228146, Col 44)
xKz
// @from(Ln 228146, Col 49)
fD4
// @from(Ln 228146, Col 54)
GD4
// @from(Ln 228146, Col 59)
uKz
// @from(Ln 228146, Col 64)
BU1
// @from(Ln 228146, Col 69)
mKz
// @from(Ln 228146, Col 74)
SU1
// @from(Ln 228146, Col 79)
BKz
// @from(Ln 228146, Col 84)
eR8
// @from(Ln 228146, Col 89)
Le6
// @from(Ln 228146, Col 94)
pKz
// @from(Ln 228146, Col 99)
AD4 = (q) => pKz[q]
// @from(Ln 228147, Col 4)
Se6
// @from(Ln 228147, Col 9)
rj6
// @from(Ln 228147, Col 14)
TGw
// @from(Ln 228147, Col 19)
VGw
// @from(Ln 228147, Col 24)
kGw
// @from(Ln 228147, Col 29)
NGw
// @from(Ln 228147, Col 34)
EGw
// @from(Ln 228147, Col 39)
yGw
// @from(Ln 228147, Col 44)
LGw