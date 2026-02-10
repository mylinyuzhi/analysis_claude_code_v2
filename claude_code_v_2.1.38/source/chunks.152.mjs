
// @from(Ln 388466, Col 0)
function _iY(A, {
    getFn: q = g3.getFn,
    fieldNormWeight: K = g3.fieldNormWeight
} = {}) {
    let {
        keys: Y,
        records: z
    } = A, w = new Rf6({
        getFn: q,
        fieldNormWeight: K
    });
    return w.setKeys(Y), w.setIndexRecords(z), w
}
// @from(Ln 388480, Col 0)
function kf6(A, {
    errors: q = 0,
    currentLocation: K = 0,
    expectedLocation: Y = 0,
    distance: z = g3.distance,
    ignoreLocation: w = g3.ignoreLocation
} = {}) {
    let H = q / A.length;
    if (w) return H;
    let $ = Math.abs(Y - K);
    if (!z) return $ ? 1 : H;
    return H + $ / z
}
// @from(Ln 388494, Col 0)
function JiY(A = [], q = g3.minMatchCharLength) {
    let K = [],
        Y = -1,
        z = -1,
        w = 0;
    for (let H = A.length; w < H; w += 1) {
        let $ = A[w];
        if ($ && Y === -1) Y = w;
        else if (!$ && Y !== -1) {
            if (z = w - 1, z - Y + 1 >= q) K.push([Y, z]);
            Y = -1
        }
    }
    if (A[w - 1] && w - Y >= q) K.push([Y, w - 1]);
    return K
}
// @from(Ln 388511, Col 0)
function XiY(A, q, K, {
    location: Y = g3.location,
    distance: z = g3.distance,
    threshold: w = g3.threshold,
    findAllMatches: H = g3.findAllMatches,
    minMatchCharLength: $ = g3.minMatchCharLength,
    includeMatches: O = g3.includeMatches,
    ignoreLocation: _ = g3.ignoreLocation
} = {}) {
    if (q.length > $91) throw Error(elY($91));
    let J = q.length,
        X = A.length,
        D = Math.max(0, Math.min(Y, X)),
        j = w,
        M = D,
        P = $ > 1 || O,
        W = P ? Array(X) : [],
        G;
    while ((G = A.indexOf(q, M)) > -1) {
        let y = kf6(q, {
            currentLocation: G,
            expectedLocation: D,
            distance: z,
            ignoreLocation: _
        });
        if (j = Math.min(y, j), M = G + J, P) {
            let B = 0;
            while (B < J) W[G + B] = 1, B += 1
        }
    }
    M = -1;
    let f = [],
        Z = 1,
        N = J + X,
        T = 1 << J - 1;
    for (let y = 0; y < J; y += 1) {
        let B = 0,
            S = N;
        while (B < S) {
            if (kf6(q, {
                    errors: y,
                    currentLocation: D + S,
                    expectedLocation: D,
                    distance: z,
                    ignoreLocation: _
                }) <= j) B = S;
            else N = S;
            S = Math.floor((N - B) / 2 + B)
        }
        N = S;
        let m = Math.max(1, D - S + 1),
            b = H ? X : Math.min(D + S, X) + J,
            g = Array(b + 2);
        g[b + 1] = (1 << y) - 1;
        for (let x = b; x >= m; x -= 1) {
            let p = x - 1,
                l = K[A.charAt(p)];
            if (P) W[p] = +!!l;
            if (g[x] = (g[x + 1] << 1 | 1) & l, y) g[x] |= (f[x + 1] | f[x]) << 1 | 1 | f[x + 1];
            if (g[x] & T) {
                if (Z = kf6(q, {
                        errors: y,
                        currentLocation: p,
                        expectedLocation: D,
                        distance: z,
                        ignoreLocation: _
                    }), Z <= j) {
                    if (j = Z, M = p, M <= D) break;
                    m = Math.max(1, 2 * D - M)
                }
            }
        }
        if (kf6(q, {
                errors: y + 1,
                currentLocation: D,
                expectedLocation: D,
                distance: z,
                ignoreLocation: _
            }) > j) break;
        f = g
    }
    let k = {
        isMatch: M >= 0,
        score: Math.max(0.001, Z)
    };
    if (P) {
        let y = JiY(W, $);
        if (!y.length) k.isMatch = !1;
        else if (O) k.indices = y
    }
    return k
}
// @from(Ln 388604, Col 0)
function DiY(A) {
    let q = {};
    for (let K = 0, Y = A.length; K < Y; K += 1) {
        let z = A.charAt(K);
        q[z] = (q[z] || 0) | 1 << Y - K - 1
    }
    return q
}
// @from(Ln 388612, Col 0)
class YIA {
    constructor(A, {
        location: q = g3.location,
        threshold: K = g3.threshold,
        distance: Y = g3.distance,
        includeMatches: z = g3.includeMatches,
        findAllMatches: w = g3.findAllMatches,
        minMatchCharLength: H = g3.minMatchCharLength,
        isCaseSensitive: $ = g3.isCaseSensitive,
        ignoreLocation: O = g3.ignoreLocation
    } = {}) {
        if (this.options = {
                location: q,
                threshold: K,
                distance: Y,
                includeMatches: z,
                findAllMatches: w,
                minMatchCharLength: H,
                isCaseSensitive: $,
                ignoreLocation: O
            }, this.pattern = $ ? A : A.toLowerCase(), this.chunks = [], !this.pattern.length) return;
        let _ = (X, D) => {
                this.chunks.push({
                    pattern: X,
                    alphabet: DiY(X),
                    startIndex: D
                })
            },
            J = this.pattern.length;
        if (J > $91) {
            let X = 0,
                D = J % $91,
                j = J - D;
            while (X < j) _(this.pattern.substr(X, $91), X), X += $91;
            if (D) {
                let M = J - $91;
                _(this.pattern.substr(M), M)
            }
        } else _(this.pattern, 0)
    }
    searchIn(A) {
        let {
            isCaseSensitive: q,
            includeMatches: K
        } = this.options;
        if (!q) A = A.toLowerCase();
        if (this.pattern === A) {
            let j = {
                isMatch: !0,
                score: 0
            };
            if (K) j.indices = [
                [0, A.length - 1]
            ];
            return j
        }
        let {
            location: Y,
            distance: z,
            threshold: w,
            findAllMatches: H,
            minMatchCharLength: $,
            ignoreLocation: O
        } = this.options, _ = [], J = 0, X = !1;
        this.chunks.forEach(({
            pattern: j,
            alphabet: M,
            startIndex: P
        }) => {
            let {
                isMatch: W,
                score: G,
                indices: f
            } = XiY(A, j, M, {
                location: Y + P,
                distance: z,
                threshold: w,
                findAllMatches: H,
                minMatchCharLength: $,
                includeMatches: K,
                ignoreLocation: O
            });
            if (W) X = !0;
            if (J += G, W && f) _ = [..._, ...f]
        });
        let D = {
            isMatch: X,
            score: X ? J / this.chunks.length : 1
        };
        if (X && K) D.indices = _;
        return D
    }
}
// @from(Ln 388705, Col 0)
class zc {
    constructor(A) {
        this.pattern = A
    }
    static isMultiMatch(A) {
        return ZAq(A, this.multiRegex)
    }
    static isSingleMatch(A) {
        return ZAq(A, this.singleRegex)
    }
    search() {}
}
// @from(Ln 388718, Col 0)
function ZAq(A, q) {
    let K = A.match(q);
    return K ? K[1] : null
}
// @from(Ln 388723, Col 0)
function PiY(A, q = {}) {
    return A.split(MiY).map((K) => {
        let Y = K.trim().split(jiY).filter((w) => w && !!w.trim()),
            z = [];
        for (let w = 0, H = Y.length; w < H; w += 1) {
            let $ = Y[w],
                O = !1,
                _ = -1;
            while (!O && ++_ < fAq) {
                let J = thA[_],
                    X = J.isMultiMatch($);
                if (X) z.push(new J(X, q)), O = !0
            }
            if (O) continue;
            _ = -1;
            while (++_ < fAq) {
                let J = thA[_],
                    X = J.isSingleMatch($);
                if (X) {
                    z.push(new J(X, q));
                    break
                }
            }
        }
        return z
    })
}
// @from(Ln 388750, Col 0)
class xAq {
    constructor(A, {
        isCaseSensitive: q = g3.isCaseSensitive,
        includeMatches: K = g3.includeMatches,
        minMatchCharLength: Y = g3.minMatchCharLength,
        ignoreLocation: z = g3.ignoreLocation,
        findAllMatches: w = g3.findAllMatches,
        location: H = g3.location,
        threshold: $ = g3.threshold,
        distance: O = g3.distance
    } = {}) {
        this.query = null, this.options = {
            isCaseSensitive: q,
            includeMatches: K,
            minMatchCharLength: Y,
            findAllMatches: w,
            ignoreLocation: z,
            location: H,
            threshold: $,
            distance: O
        }, this.pattern = q ? A : A.toLowerCase(), this.query = PiY(this.pattern, this.options)
    }
    static condition(A, q) {
        return q.useExtendedSearch
    }
    searchIn(A) {
        let q = this.query;
        if (!q) return {
            isMatch: !1,
            score: 1
        };
        let {
            includeMatches: K,
            isCaseSensitive: Y
        } = this.options;
        A = Y ? A : A.toLowerCase();
        let z = 0,
            w = [],
            H = 0;
        for (let $ = 0, O = q.length; $ < O; $ += 1) {
            let _ = q[$];
            w.length = 0, z = 0;
            for (let J = 0, X = _.length; J < X; J += 1) {
                let D = _[J],
                    {
                        isMatch: j,
                        indices: M,
                        score: P
                    } = D.search(A);
                if (j) {
                    if (z += 1, H += P, K) {
                        let W = D.constructor.type;
                        if (WiY.has(W)) w = [...w, ...M];
                        else w.push(M)
                    }
                } else {
                    H = 0, z = 0, w.length = 0;
                    break
                }
            }
            if (z) {
                let J = {
                    isMatch: !0,
                    score: H / z
                };
                if (K) J.indices = w;
                return J
            }
        }
        return {
            isMatch: !1,
            score: 1
        }
    }
}
// @from(Ln 388826, Col 0)
function GiY(...A) {
    ehA.push(...A)
}
// @from(Ln 388830, Col 0)
function AIA(A, q) {
    for (let K = 0, Y = ehA.length; K < Y; K += 1) {
        let z = ehA[K];
        if (z.condition(A, q)) return new z(A, q)
    }
    return new YIA(A, q)
}
// @from(Ln 388838, Col 0)
function bAq(A, q, {
    auto: K = !0
} = {}) {
    let Y = (z) => {
        let w = Object.keys(z),
            H = ZiY(z);
        if (!H && w.length > 1 && !KIA(z)) return Y(VAq(z));
        if (fiY(z)) {
            let O = H ? z[qIA.PATH] : w[0],
                _ = H ? z[qIA.PATTERN] : z[O];
            if (!nm(_)) throw Error(tlY(O));
            let J = {
                keyId: shA(O),
                pattern: _
            };
            if (K) J.searcher = AIA(_, q);
            return J
        }
        let $ = {
            children: [],
            operator: w[0]
        };
        return w.forEach((O) => {
            let _ = z[O];
            if (Yc(_)) _.forEach((J) => {
                $.children.push(Y(J))
            })
        }), $
    };
    if (!KIA(A)) A = VAq(A);
    return Y(A)
}
// @from(Ln 388871, Col 0)
function ViY(A, {
    ignoreFieldNorm: q = g3.ignoreFieldNorm
}) {
    A.forEach((K) => {
        let Y = 1;
        K.matches.forEach(({
            key: z,
            norm: w,
            score: H
        }) => {
            let $ = z ? z.weight : null;
            Y *= Math.pow(H === 0 && $ ? Number.EPSILON : H, ($ || 1) * (q ? 1 : w))
        }), K.score = Y
    })
}
// @from(Ln 388887, Col 0)
function NiY(A, q) {
    let K = A.matches;
    if (q.matches = [], !DE(K)) return;
    K.forEach((Y) => {
        if (!DE(Y.indices) || !Y.indices.length) return;
        let {
            indices: z,
            value: w
        } = Y, H = {
            indices: z,
            value: w
        };
        if (Y.key) H.key = Y.key.src;
        if (Y.idx > -1) H.refIndex = Y.idx;
        q.matches.push(H)
    })
}
// @from(Ln 388905, Col 0)
function TiY(A, q) {
    q.score = A.score
}
// @from(Ln 388909, Col 0)
function viY(A, q, {
    includeMatches: K = g3.includeMatches,
    includeScore: Y = g3.includeScore
} = {}) {
    let z = [];
    if (K) z.push(NiY);
    if (Y) z.push(TiY);
    return A.map((w) => {
        let {
            idx: H
        } = w, $ = {
            item: q[H],
            refIndex: H
        };
        if (z.length) z.forEach((O) => {
            O(w, $)
        });
        return $
    })
}
// @from(Ln 388929, Col 0)
class wy {
    constructor(A, q = {}, K) {
        this.options = {
            ...g3,
            ...q
        }, this.options.useExtendedSearch, this._keyStore = new EAq(this.options.keys), this.setCollection(A, K)
    }
    setCollection(A, q) {
        if (this._docs = A, q && !(q instanceof Rf6)) throw Error(slY);
        this._myIndex = q || LAq(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
        })
    }
    add(A) {
        if (!DE(A)) return;
        this._docs.push(A), this._myIndex.add(A)
    }
    remove(A = () => !1) {
        let q = [];
        for (let K = 0, Y = this._docs.length; K < Y; K += 1) {
            let z = this._docs[K];
            if (A(z, K)) this.removeAt(K), K -= 1, Y -= 1, q.push(z)
        }
        return q
    }
    removeAt(A) {
        this._docs.splice(A, 1), this._myIndex.removeAt(A)
    }
    getIndex() {
        return this._myIndex
    }
    search(A, {
        limit: q = -1
    } = {}) {
        let {
            includeMatches: K,
            includeScore: Y,
            shouldSort: z,
            sortFn: w,
            ignoreFieldNorm: H
        } = this.options, $ = nm(A) ? nm(this._docs[0]) ? this._searchStringList(A) : this._searchObjectList(A) : this._searchLogical(A);
        if (ViY($, {
                ignoreFieldNorm: H
            }), z) $.sort(w);
        if (NAq(q) && q > -1) $ = $.slice(0, q);
        return viY($, this._docs, {
            includeMatches: K,
            includeScore: Y
        })
    }
    _searchStringList(A) {
        let q = AIA(A, this.options),
            {
                records: K
            } = this._myIndex,
            Y = [];
        return K.forEach(({
            v: z,
            i: w,
            n: H
        }) => {
            if (!DE(z)) return;
            let {
                isMatch: $,
                score: O,
                indices: _
            } = q.searchIn(z);
            if ($) Y.push({
                item: z,
                idx: w,
                matches: [{
                    score: O,
                    value: z,
                    norm: H,
                    indices: _
                }]
            })
        }), Y
    }
    _searchLogical(A) {
        let q = bAq(A, this.options),
            K = (H, $, O) => {
                if (!H.children) {
                    let {
                        keyId: J,
                        searcher: X
                    } = H, D = this._findMatches({
                        key: this._keyStore.get(J),
                        value: this._myIndex.getValueForItemAtKeyId($, J),
                        searcher: X
                    });
                    if (D && D.length) return [{
                        idx: O,
                        item: $,
                        matches: D
                    }];
                    return []
                }
                let _ = [];
                for (let J = 0, X = H.children.length; J < X; J += 1) {
                    let D = H.children[J],
                        j = K(D, $, O);
                    if (j.length) _.push(...j);
                    else if (H.operator === Lf6.AND) return []
                }
                return _
            },
            Y = this._myIndex.records,
            z = {},
            w = [];
        return Y.forEach(({
            $: H,
            i: $
        }) => {
            if (DE(H)) {
                let O = K(q, H, $);
                if (O.length) {
                    if (!z[$]) z[$] = {
                        idx: $,
                        item: H,
                        matches: []
                    }, w.push(z[$]);
                    O.forEach(({
                        matches: _
                    }) => {
                        z[$].matches.push(..._)
                    })
                }
            }
        }), w
    }
    _searchObjectList(A) {
        let q = AIA(A, this.options),
            {
                keys: K,
                records: Y
            } = this._myIndex,
            z = [];
        return Y.forEach(({
            $: w,
            i: H
        }) => {
            if (!DE(w)) return;
            let $ = [];
            if (K.forEach((O, _) => {
                    $.push(...this._findMatches({
                        key: O,
                        value: w[_],
                        searcher: q
                    }))
                }), $.length) z.push({
                idx: H,
                item: w,
                matches: $
            })
        }), z
    }
    _findMatches({
        key: A,
        value: q,
        searcher: K
    }) {
        if (!DE(q)) return [];
        let Y = [];
        if (Yc(q)) q.forEach(({
            v: z,
            i: w,
            n: H
        }) => {
            if (!DE(z)) return;
            let {
                isMatch: $,
                score: O,
                indices: _
            } = K.searchIn(z);
            if ($) Y.push({
                score: O,
                key: A,
                value: z,
                idx: w,
                norm: H,
                indices: _
            })
        });
        else {
            let {
                v: z,
                n: w
            } = q, {
                isMatch: H,
                score: $,
                indices: O
            } = K.searchIn(z);
            if (H) Y.push({
                score: $,
                key: A,
                value: z,
                norm: w,
                indices: O
            })
        }
        return Y
    }
}
// @from(Ln 389134, Col 4)
ilY = 1 / 0
// @from(Ln 389135, Col 4)
slY = "Incorrect 'index' type"
// @from(Ln 389136, Col 4)
tlY = (A) => `Invalid value for key ${A}`
// @from(Ln 389137, Col 4)
elY = (A) => `Pattern length exceeds max of ${A}.`
// @from(Ln 389138, Col 4)
AiY = (A) => `Missing ${A} property in key`
// @from(Ln 389139, Col 4)
qiY = (A) => `Property 'weight' in key '${A}' must be a positive integer`
// @from(Ln 389140, Col 4)
WAq
// @from(Ln 389140, Col 9)
YiY
// @from(Ln 389140, Col 14)
ziY
// @from(Ln 389140, Col 19)
wiY
// @from(Ln 389140, Col 24)
HiY
// @from(Ln 389140, Col 29)
g3
// @from(Ln 389140, Col 33)
$iY
// @from(Ln 389140, Col 38)
$91 = 32
// @from(Ln 389141, Col 4)
RAq
// @from(Ln 389141, Col 9)
yAq
// @from(Ln 389141, Col 14)
CAq
// @from(Ln 389141, Col 19)
SAq
// @from(Ln 389141, Col 24)
hAq
// @from(Ln 389141, Col 29)
IAq
// @from(Ln 389141, Col 34)
zIA
// @from(Ln 389141, Col 39)
wIA
// @from(Ln 389141, Col 44)
thA
// @from(Ln 389141, Col 49)
fAq
// @from(Ln 389141, Col 54)
jiY
// @from(Ln 389141, Col 59)
MiY = "|"
// @from(Ln 389142, Col 4)
WiY
// @from(Ln 389142, Col 9)
ehA
// @from(Ln 389142, Col 14)
Lf6
// @from(Ln 389142, Col 19)
qIA
// @from(Ln 389142, Col 24)
KIA = (A) => !!(A[Lf6.AND] || A[Lf6.OR])
// @from(Ln 389143, Col 4)
ZiY = (A) => !!A[qIA.PATH]
// @from(Ln 389144, Col 4)
fiY = (A) => !Yc(A) && TAq(A) && !KIA(A)
// @from(Ln 389145, Col 4)
VAq = (A) => ({
        [Lf6.AND]: Object.keys(A).map((q) => ({
            [q]: A[q]
        }))
    })
// @from(Ln 389150, Col 4)
yf6 = v(() => {
    WAq = Object.prototype.hasOwnProperty;
    YiY = {
        includeMatches: !1,
        findAllMatches: !1,
        minMatchCharLength: 1
    }, ziY = {
        isCaseSensitive: !1,
        includeScore: !1,
        keys: [],
        shouldSort: !0,
        sortFn: (A, q) => A.score === q.score ? A.idx < q.idx ? -1 : 1 : A.score < q.score ? -1 : 1
    }, wiY = {
        location: 0,
        threshold: 0.6,
        distance: 100
    }, HiY = {
        useExtendedSearch: !1,
        getFn: KiY,
        ignoreLocation: !1,
        ignoreFieldNorm: !1,
        fieldNormWeight: 1
    }, g3 = {
        ...ziY,
        ...YiY,
        ...wiY,
        ...HiY
    }, $iY = /[^ ]+/g;
    RAq = class RAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "exact"
        }
        static get multiRegex() {
            return /^="(.*)"$/
        }
        static get singleRegex() {
            return /^=(.*)$/
        }
        search(A) {
            let q = A === this.pattern;
            return {
                isMatch: q,
                score: q ? 0 : 1,
                indices: [0, this.pattern.length - 1]
            }
        }
    };
    yAq = class yAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "inverse-exact"
        }
        static get multiRegex() {
            return /^!"(.*)"$/
        }
        static get singleRegex() {
            return /^!(.*)$/
        }
        search(A) {
            let K = A.indexOf(this.pattern) === -1;
            return {
                isMatch: K,
                score: K ? 0 : 1,
                indices: [0, A.length - 1]
            }
        }
    };
    CAq = class CAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "prefix-exact"
        }
        static get multiRegex() {
            return /^\^"(.*)"$/
        }
        static get singleRegex() {
            return /^\^(.*)$/
        }
        search(A) {
            let q = A.startsWith(this.pattern);
            return {
                isMatch: q,
                score: q ? 0 : 1,
                indices: [0, this.pattern.length - 1]
            }
        }
    };
    SAq = class SAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "inverse-prefix-exact"
        }
        static get multiRegex() {
            return /^!\^"(.*)"$/
        }
        static get singleRegex() {
            return /^!\^(.*)$/
        }
        search(A) {
            let q = !A.startsWith(this.pattern);
            return {
                isMatch: q,
                score: q ? 0 : 1,
                indices: [0, A.length - 1]
            }
        }
    };
    hAq = class hAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "suffix-exact"
        }
        static get multiRegex() {
            return /^"(.*)"\$$/
        }
        static get singleRegex() {
            return /^(.*)\$$/
        }
        search(A) {
            let q = A.endsWith(this.pattern);
            return {
                isMatch: q,
                score: q ? 0 : 1,
                indices: [A.length - this.pattern.length, A.length - 1]
            }
        }
    };
    IAq = class IAq extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "inverse-suffix-exact"
        }
        static get multiRegex() {
            return /^!"(.*)"\$$/
        }
        static get singleRegex() {
            return /^!(.*)\$$/
        }
        search(A) {
            let q = !A.endsWith(this.pattern);
            return {
                isMatch: q,
                score: q ? 0 : 1,
                indices: [0, A.length - 1]
            }
        }
    };
    zIA = class zIA extends zc {
        constructor(A, {
            location: q = g3.location,
            threshold: K = g3.threshold,
            distance: Y = g3.distance,
            includeMatches: z = g3.includeMatches,
            findAllMatches: w = g3.findAllMatches,
            minMatchCharLength: H = g3.minMatchCharLength,
            isCaseSensitive: $ = g3.isCaseSensitive,
            ignoreLocation: O = g3.ignoreLocation
        } = {}) {
            super(A);
            this._bitapSearch = new YIA(A, {
                location: q,
                threshold: K,
                distance: Y,
                includeMatches: z,
                findAllMatches: w,
                minMatchCharLength: H,
                isCaseSensitive: $,
                ignoreLocation: O
            })
        }
        static get type() {
            return "fuzzy"
        }
        static get multiRegex() {
            return /^"(.*)"$/
        }
        static get singleRegex() {
            return /^(.*)$/
        }
        search(A) {
            return this._bitapSearch.searchIn(A)
        }
    };
    wIA = class wIA extends zc {
        constructor(A) {
            super(A)
        }
        static get type() {
            return "include"
        }
        static get multiRegex() {
            return /^'"(.*)"$/
        }
        static get singleRegex() {
            return /^'(.*)$/
        }
        search(A) {
            let q = 0,
                K, Y = [],
                z = this.pattern.length;
            while ((K = A.indexOf(this.pattern, q)) > -1) q = K + z, Y.push([K, q - 1]);
            let w = !!Y.length;
            return {
                isMatch: w,
                score: w ? 0 : 1,
                indices: Y
            }
        }
    };
    thA = [RAq, wIA, CAq, SAq, IAq, hAq, yAq, zIA], fAq = thA.length, jiY = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    WiY = new Set([zIA.type, wIA.type]);
    ehA = [];
    Lf6 = {
        AND: "$and",
        OR: "$or"
    }, qIA = {
        PATH: "$path",
        PATTERN: "$val"
    };
    wy.version = "7.0.0";
    wy.createIndex = LAq;
    wy.parseIndex = _iY;
    wy.config = g3;
    wy.parseQuery = bAq;
    GiY(xAq)
})
// @from(Ln 389389, Col 4)
HIA = {}
// @from(Ln 389394, Col 4)
Cf6
// @from(Ln 389394, Col 9)
EiY
// @from(Ln 389394, Col 14)
kiY
// @from(Ln 389395, Col 4)
$IA = v(() => {
    try {
        Cf6 = (() => {
            throw new Error("Cannot require module " + "../../file-index.node");
        })()
    } catch (A) {
        Cf6 = null
    }
    EiY = Cf6?.FileIndex, kiY = Cf6?.FileIndex
})
// @from(Ln 389406, Col 0)
async function LiY() {
    if (Sf6) return null;
    if (aU1) return aU1;
    if (D9()) try {
        return aU1 = new(await Promise.resolve().then(() => ($IA(), HIA))).FileIndex, aU1
    } catch (A) {
        return Sf6 = !0, h(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${A instanceof Error?A.message:String(A)}`), K1(A), null
    } else return Sf6 = !0, h("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}
// @from(Ln 389416, Col 0)
function FAq() {
    aU1 = null, Sf6 = !1, sG1 = null, tG1 = [], O91 = null, jIA = 0, sU1 = null, _IA = null, hf6 = null, oG1 = [], JIA = null, XIA = null
}
// @from(Ln 389419, Col 0)
async function yiY() {
    let A = h6();
    if (_IA === A && sU1 !== null) return sU1;
    return sU1 = YX(A) !== null, _IA = A, sU1
}
// @from(Ln 389425, Col 0)
function uAq(A, q, K) {
    if (K === q) return A;
    return A.map((Y) => {
        let z = bJ.join(q, Y);
        return bJ.relative(K, z)
    })
}
// @from(Ln 389433, Col 0)
function CiY(A) {
    if (A.length === 0) return;
    let q = DIA(A);
    if (sG1 && oG1.length > 0) {
        let K = DIA(oG1),
            Y = [...oG1, ...K, ...A, ...q];
        try {
            sG1.loadFromFileList(Y), h(`[FileIndex] rebuilt Rust index with ${oG1.length} tracked + ${A.length} untracked files`)
        } catch (z) {
            h(`[FileIndex] failed to rebuild Rust index: ${z}`)
        }
    } else {
        let K = [...A, ...q],
            Y = new Set(tG1);
        for (let z of K)
            if (!Y.has(z)) tG1.push(z);
        h(`[FileIndex] merged ${A.length} untracked files into JS cache`)
    }
}
// @from(Ln 389453, Col 0)
function BAq(A, q) {
    let K = `${A}:${q}`;
    if (XIA === K) return JIA;
    let Y = b1(),
        z = [".ignore", ".rgignore"],
        w = [...new Set([A, q])],
        H = mAq.default(),
        $ = !1;
    for (let _ of w)
        for (let J of z) {
            let X = bJ.join(_, J);
            if (Y.existsSync(X)) try {
                let D = Y.readFileSync(X, {
                    encoding: "utf8"
                });
                H.add(D), $ = !0, h(`[FileIndex] loaded ignore patterns from ${X}`)
            } catch {}
        }
    let O = $ ? H : null;
    return JIA = O, XIA = K, O
}
// @from(Ln 389474, Col 0)
async function SiY(A, q) {
    let K = Date.now();
    if (h("[FileIndex] getFilesUsingGit called"), !await yiY()) return h("[FileIndex] not a git repo, returning null"), null;
    try {
        let Y = YX(h6());
        if (!Y) return h("[FileIndex] git rev-parse --show-toplevel failed, falling back to ripgrep"), null;
        let z = h6(),
            w = Date.now(),
            H = await d4(pq(), ["-c", "core.quotepath=false", "ls-files", "--recurse-submodules"], {
                timeout: 5000,
                abortSignal: A,
                cwd: Y
            });
        if (h(`[FileIndex] git ls-files (tracked) took ${Date.now()-w}ms`), H.code !== 0) return h(`[FileIndex] git ls-files failed (code=${H.code}, stderr=${H.stderr}), falling back to ripgrep`), null;
        let $ = H.stdout.trim().split(`
`).filter(Boolean),
            O = uAq($, Y, z),
            _ = BAq(Y, z);
        if (_) {
            let X = O.length;
            O = _.filter(O), h(`[FileIndex] applied ignore patterns: ${X} -> ${O.length} files`)
        }
        oG1 = O;
        let J = Date.now() - K;
        if (h(`[FileIndex] git ls-files: ${O.length} tracked files in ${J}ms`), c("tengu_file_suggestions_git_ls_files", {
                file_count: O.length,
                tracked_count: O.length,
                untracked_count: 0,
                duration_ms: J
            }), !hf6) {
            let X = q ? ["-c", "core.quotepath=false", "ls-files", "--others", "--exclude-standard"] : ["-c", "core.quotepath=false", "ls-files", "--others"];
            hf6 = d4(pq(), X, {
                timeout: 1e4,
                cwd: Y
            }).then((D) => {
                if (D.code === 0) {
                    let j = D.stdout.trim().split(`
`).filter(Boolean),
                        M = uAq(j, Y, z),
                        P = BAq(Y, z);
                    if (P && M.length > 0) {
                        let W = M.length;
                        M = P.filter(M), h(`[FileIndex] applied ignore patterns to untracked: ${W} -> ${M.length} files`)
                    }
                    h(`[FileIndex] background untracked fetch: ${M.length} files`), CiY(M)
                }
            }).catch((D) => {
                h(`[FileIndex] background untracked fetch failed: ${D}`)
            }).finally(() => {
                hf6 = null
            })
        }
        return O
    } catch (Y) {
        return h(`[FileIndex] git ls-files error: ${Y instanceof Error?Y.message:String(Y)}`), null
    }
}
// @from(Ln 389532, Col 0)
function DIA(A) {
    let q = new Set;
    return A.forEach((K) => {
        let Y = bJ.parse(K).root,
            z = bJ.dirname(K);
        while (z !== "." && z !== Y && !q.has(z)) q.add(z), z = bJ.dirname(z)
    }), [...q].map((K) => K + bJ.sep)
}
// @from(Ln 389540, Col 0)
async function hiY(A) {
    return (await Promise.all(UAq.map((K) => Qp(K, A)))).flatMap((K) => K.map((Y) => Y.filePath))
}
// @from(Ln 389543, Col 0)
async function IiY(A, q) {
    h(`[FileIndex] getProjectFiles called, respectGitignore=${q}`);
    let K = await SiY(A, q);
    if (K !== null) return h(`[FileIndex] using git ls-files result (${K.length} files)`), K;
    h("[FileIndex] git ls-files returned null, falling back to ripgrep");
    let Y = Date.now(),
        z = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!q) z.push("--no-ignore-vcs");
    let H = (await lx(z, ".", A)).map((O) => bJ.relative(h6(), O)),
        $ = Date.now() - Y;
    return h(`[FileIndex] ripgrep: ${H.length} files in ${$}ms`), c("tengu_file_suggestions_ripgrep", {
        file_count: H.length,
        duration_ms: $
    }), H
}
// @from(Ln 389558, Col 0)
async function xiY() {
    let A = Aq(),
        q = setTimeout(() => {
            A.abort()
        }, 1e4);
    try {
        let K = l4(),
            Y = f6(),
            z = K.respectGitignore ?? Y.respectGitignore ?? !0,
            w = h6(),
            [H, $] = await Promise.all([IiY(A.signal, z), hiY(w)]),
            O = [...H, ...$],
            J = [...DIA(O), ...O],
            X = [],
            D = await LiY();
        if (D) try {
            D.loadFromFileList(J)
        } catch (j) {
            h(`[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${j instanceof Error?j.message:String(j)}`), K1(j), X = J
        } else X = J;
        return {
            fileIndex: D,
            fileList: X
        }
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), {
            fileIndex: null,
            fileList: []
        }
    } finally {
        clearTimeout(q)
    }
}
// @from(Ln 389592, Col 0)
function biY(A, q) {
    let K = Math.min(A.length, q.length),
        Y = 0;
    while (Y < K && A[Y] === q[Y]) Y++;
    return A.substring(0, Y)
}
// @from(Ln 389599, Col 0)
function QAq(A) {
    if (A.length === 0) return "";
    let q = A.map((Y) => Y.displayText),
        K = q[0];
    for (let Y = 1; Y < q.length; Y++) {
        let z = q[Y];
        if (K = biY(K, z), K === "") return ""
    }
    return K
}
// @from(Ln 389610, Col 0)
function tU1(A, q) {
    return {
        id: `file-${A}`,
        displayText: A,
        metadata: q !== void 0 ? {
            score: q
        } : void 0
    }
}
// @from(Ln 389619, Col 0)
async function uiY(A, q, K) {
    if (A) try {
        return A.search(K, aG1).map((_) => tU1(_.path, _.score))
    } catch (O) {
        h(`[FileIndex] Rust search failed, falling back to Fuse.js: ${O instanceof Error?O.message:String(O)}`), K1(O)
    }
    h("[FileIndex] Using Fuse.js fallback for search");
    let Y = [...new Set(q)];
    if (!K) {
        let O = new Set;
        for (let _ of Y) {
            let J = _.split(bJ.sep)[0];
            if (J) {
                if (O.add(J), O.size >= aG1) break
            }
        }
        return [...O].sort().map(tU1)
    }
    let z = Y.map((O) => {
            return {
                path: O,
                filename: bJ.basename(O),
                testPenalty: O.includes("test") ? 1 : 0
            }
        }),
        w = K.lastIndexOf(bJ.sep);
    if (w > 2) z = z.filter((O) => {
        return O.path.substring(0, w).startsWith(K.substring(0, w))
    });
    let $ = new wy(z, {
        includeScore: !0,
        threshold: 0.5,
        keys: [{
            name: "path",
            weight: 1
        }, {
            name: "filename",
            weight: 2
        }]
    }).search(K, {
        limit: aG1
    });
    return $ = $.sort((O, _) => {
        if (O.score === void 0 || _.score === void 0) return 0;
        if (Math.abs(O.score - _.score) > 0.05) return O.score - _.score;
        return O.item.testPenalty - _.item.testPenalty
    }), $.map((O) => O.item.path).slice(0, aG1).map(tU1)
}
// @from(Ln 389668, Col 0)
function OIA() {
    if (!O91) O91 = xiY().then((A) => {
        return sG1 = A.fileIndex, tG1 = A.fileList, jIA = Date.now(), O91 = null, A
    }).catch((A) => {
        return h(`[FileIndex] Cache refresh failed: ${A instanceof Error?A.message:String(A)}`), K1(A), O91 = null, {
            fileIndex: null,
            fileList: []
        }
    })
}
// @from(Ln 389678, Col 0)
async function BiY() {
    let A = b1(),
        q = h6();
    try {
        return A.readdirSync(q).map((Y) => {
            let z = bJ.join(q, Y.name),
                w = bJ.relative(q, z);
            return Y.isDirectory() ? w + bJ.sep : w
        })
    } catch (K) {
        return K1(K), []
    }
}
// @from(Ln 389691, Col 0)
async function gAq(A, q = !1) {
    if (!A && !q) return [];
    if (l4().fileSuggestion?.type === "command") {
        let K = {
            ...aX(),
            query: A
        };
        return (await XyA(K)).slice(0, aG1).map(tU1)
    }
    if (A === "" || A === "." || A === "./") {
        let K = await BiY();
        return OIA(), K.slice(0, aG1).map(tU1)
    }
    try {
        let Y = Date.now() - jIA > RiY;
        if (!sG1 && tG1.length === 0) {
            if (OIA(), O91) await O91
        } else if (Y) OIA();
        let z = A,
            w = "." + bJ.sep;
        if (A.startsWith(w)) z = A.substring(2);
        if (z.startsWith("~")) z = g4(z);
        return await uiY(sG1, tG1, z)
    } catch (K) {
        return K1(K), []
    }
}
// @from(Ln 389719, Col 0)
function If6(A, q, K, Y, z, w) {
    let H = typeof A === "string" ? A : A.displayText,
        $ = q.substring(0, Y) + H + q.substring(Y + K.length);
    z($);
    let O = Y + H.length;
    w(O)
}
// @from(Ln 389726, Col 4)
mAq
// @from(Ln 389726, Col 9)
aU1 = null
// @from(Ln 389727, Col 4)
Sf6 = !1
// @from(Ln 389728, Col 4)
sG1 = null
// @from(Ln 389729, Col 4)
tG1
// @from(Ln 389729, Col 9)
O91 = null
// @from(Ln 389730, Col 4)
jIA = 0
// @from(Ln 389731, Col 4)
RiY = 60000
// @from(Ln 389732, Col 4)
sU1 = null
// @from(Ln 389733, Col 4)
_IA = null
// @from(Ln 389734, Col 4)
hf6 = null
// @from(Ln 389735, Col 4)
oG1
// @from(Ln 389735, Col 9)
JIA = null
// @from(Ln 389736, Col 4)
XIA = null
// @from(Ln 389737, Col 4)
aG1 = 15
// @from(Ln 389738, Col 4)
xf6 = v(() => {
    yf6();
    y6();
    _8();
    N7();
    Ep();
    Ez();
    cA();
    ix();
    G2();
    Z6();
    h9();
    aM();
    p8();
    tq();
    u6();
    mAq = o(Aj1(), 1);
    tG1 = [], oG1 = []
})
// @from(Ln 389758, Col 0)
function _91(A, q) {
    return {
        name: A,
        compute: q,
        cacheBreak: !1
    }
}
// @from(Ln 389766, Col 0)
function wc(A, q, K) {
    return {
        name: A,
        compute: q,
        cacheBreak: !0
    }
}
// @from(Ln 389773, Col 0)
async function MIA(A) {
    let q = OR6();
    return Promise.all(A.map(async (K) => {
        if (!K.cacheBreak && q.has(K.name)) return q.get(K.name) ?? null;
        let Y = await K.compute();
        return _R6(K.name, Y), Y
    }))
}
// @from(Ln 389782, Col 0)
function bf6() {
    JR6()
}
// @from(Ln 389785, Col 4)
uf6 = v(() => {
    B6()
})
// @from(Ln 389788, Col 4)
WIA = {}
// @from(Ln 389793, Col 0)
function PIA() {
    i$.cache.clear?.(), l$.cache.clear?.(), rMA.cache.clear?.(), I_.cache.clear?.(), FAq(), bm(), rd(), uL7(), HR6(), fn7(null), bf6()
}
// @from(Ln 389796, Col 4)
Bf6 = v(() => {
    c$();
    TR();
    dD();
    B6();
    xf6();
    FW();
    bx1();
    uf6()
})
// @from(Ln 389806, Col 4)
pAq = {}
// @from(Ln 389813, Col 0)
async function GIA({
    setMessages: A,
    readFileState: q,
    getAppState: K,
    setAppState: Y,
    setConversationId: z
}) {
    if (await _yA("clear", {
            getAppState: K,
            setAppState: Y
        }), A(() => []), z) z(miY());
    if (PIA(), lZ(y8()), q.clear(), Y) Y((H) => ({
        ...H,
        fileHistory: {
            snapshots: [],
            trackedFiles: new Set
        },
        mcp: {
            clients: [],
            tools: [],
            commands: [],
            resources: {}
        }
    }));
    dU7(), DL6({
        setCurrentAsParent: !0
    }), await Hy();
    let w = await PP("clear");
    if (w.length > 0) A(() => w)
}
// @from(Ln 389843, Col 4)
ZIA = v(() => {
    B6();
    VI();
    lq();
    Rt();
    aM();
    mX();
    Bf6()
})
// @from(Ln 389852, Col 4)
dAq = {}
// @from(Ln 389856, Col 4)
FiY = async (A, q) => {
    return u8("clear"), await GIA(q), {
        type: "text",
        value: ""
    }
}
// @from(Ln 389862, Col 4)
cAq = v(() => {
    v3();
    ZIA()
})
// @from(Ln 389866, Col 4)
QiY
// @from(Ln 389866, Col 9)
fIA
// @from(Ln 389867, Col 4)
lAq = v(() => {
    QiY = {
        type: "local",
        name: "clear",
        description: "Clear conversation history and free up context",
        aliases: ["reset", "new"],
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (cAq(), dAq)),
        userFacingName() {
            return "clear"
        }
    }, fIA = QiY
})
// @from(Ln 389882, Col 4)
iAq = {}
// @from(Ln 389886, Col 4)
giY = async (A, q) => {
    if (Dz()) return {
        type: "text",
        value: "Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader."
    };
    if (!A || A.trim() === "") return {
        type: "text",
        value: `Please provide a color. Available colors: ${cO.join(", ")}`
    };
    let K = A.trim().toLowerCase();
    if (!cO.includes(K)) {
        let w = cO.join(", ");
        return {
            type: "text",
            value: `Invalid color "${K}". Available colors: ${w}`
        }
    }
    let Y = U6(),
        z = dO();
    return await VIA(Y, K, z), q.setAppState((w) => ({
        ...w,
        standaloneAgentContext: {
            ...w.standaloneAgentContext,
            name: w.standaloneAgentContext?.name ?? "",
            color: K
        }
    })), {
        type: "text",
        value: `Session color set to: ${K}`
    }
}
// @from(Ln 389917, Col 4)
nAq = v(() => {
    lq();
    B6();
    lM();
    Cz()
})
// @from(Ln 389923, Col 4)
UiY
// @from(Ln 389923, Col 9)
NIA
// @from(Ln 389924, Col 4)
rAq = v(() => {
    S9();
    UiY = {
        type: "local",
        name: "color",
        description: "Set the prompt bar color for this session",
        isEnabled: () => l8(),
        isHidden: !1,
        supportsNonInteractive: !1,
        argumentHint: "<color>",
        load: () => Promise.resolve().then(() => (nAq(), iAq)),
        userFacingName() {
            return "color"
        }
    }, NIA = UiY
})
// @from(Ln 389940, Col 4)
oAq = v(() => {
    a01();
    qZ6()
})
// @from(Ln 389944, Col 4)
aAq = {}
// @from(Ln 389949, Col 0)
function piY(A) {
    return A.filter((q) => q.type === "text" && q.text).map((q) => q.text).join(`

`)
}
// @from(Ln 389954, Col 4)
diY = async (A, q) => {
    u8("copy");
    let K = GN(q.messages);
    if (!K) return {
        type: "text",
        value: "No assistant message to copy"
    };
    let Y = K.message.content;
    if (!Array.isArray(Y) || Y.length === 0) return {
        type: "text",
        value: "No content to copy"
    };
    let z = piY(Y);
    if (!z) return {
        type: "text",
        value: "No text content to copy"
    };
    if (await l0(z)) {
        let H = z.split(`
`).length;
        return {
            type: "text",
            value: `Copied to clipboard (${z.length} characters, ${H} lines)`
        }
    }
    return {
        type: "text",
        value: xD1()
    }
}
// @from(Ln 389984, Col 4)
sAq = v(() => {
    OB();
    N8();
    v3()
})
// @from(Ln 389989, Col 4)
ciY
// @from(Ln 389989, Col 9)
TIA
// @from(Ln 389990, Col 4)
tAq = v(() => {
    ciY = {
        type: "local",
        name: "copy",
        description: "Copy Claude's last response to clipboard as markdown",
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (sAq(), aAq)),
        userFacingName() {
            return "copy"
        }
    }, TIA = ciY
})
// @from(Ln 390004, Col 4)
eAq = () => {}
// @from(Ln 390005, Col 4)
A8q = v(() => {
    a01();
    qZ6();
    h9()
})
// @from(Ln 390010, Col 4)
q8q = {}
// @from(Ln 390014, Col 0)
async function iiY(A, q) {
    let K = await A.getAppState(),
        Y = await dZ(A.options.tools, A.options.mainLoopModel, Array.from(K.toolPermissionContext.additionalWorkingDirectories.keys()), A.options.mcpClients),
        z = ot({
            mainThreadAgentDefinition: void 0,
            toolUseContext: A,
            customSystemPrompt: A.options.customSystemPrompt,
            defaultSystemPrompt: Y,
            appendSystemPrompt: A.options.appendSystemPrompt
        }),
        [w, H] = await Promise.all([i$(), l$()]);
    return {
        systemPrompt: z,
        userContext: w,
        systemContext: H,
        toolUseContext: A,
        forkContextMessages: q
    }
}
// @from(Ln 390033, Col 4)
liY = async (A, q) => {
    u8("compact");
    let {
        abortController: K,
        messages: Y
    } = q;
    if (Y.length === 0) throw Error("No messages to compact");
    let z = A.trim();
    try {
        if (!z) {
            let X = await vZ6(Y, q.agentId);
            if (X) {
                i$.cache.clear?.(), I_.cache.clear?.(), NG1();
                let D = oK1("tip"),
                    j = m0("app:toggleTranscript", "Global", "ctrl+o"),
                    M = [...q.options.verbose ? [] : [`(${j} to see full summary)`], ...D ? [D] : []];
                return {
                    type: "compact",
                    compactionResult: X,
                    displayText: H6.dim("Compacted " + M.join(`
`))
                }
            }
        }
        let H = (await gm(Y, void 0, q)).messages,
            $ = await AW1(H, q, await iiY(q, H), !1, z, !1);
        i51(void 0), NG1(), i$.cache.clear?.(), I_.cache.clear?.(), bf6();
        let O = oK1("tip"),
            _ = m0("app:toggleTranscript", "Global", "ctrl+o"),
            J = [...q.options.verbose ? [] : [`(${_} to see full summary)`], ...$.userDisplayMessage ? [$.userDisplayMessage] : [], ...O ? [O] : []];
        return {
            type: "compact",
            compactionResult: $,
            displayText: H6.dim("Compacted " + J.join(`
`))
        }
    } catch (w) {
        if (K.signal.aborted) throw Error("Compaction canceled.");
        else if (w instanceof Error && w.message === _U1) throw Error(_U1);
        else throw K1(w instanceof Error ? w : Error(String(w))), Error(`Error during compaction: ${w}`)
    }
}
// @from(Ln 390075, Col 4)
K8q = v(() => {
    TR();
    dD();
    vd();
    ov();
    uf6();
    cZ6();
    Qt();
    ZZ6();
    EZ6();
    fG1();
    y6();
    q3();
    XX6();
    v3();
    s2()
})
// @from(Ln 390092, Col 4)
niY
// @from(Ln 390092, Col 9)
Y8q
// @from(Ln 390093, Col 4)
z8q = v(() => {
    hA();
    niY = {
        type: "local",
        name: "compact",
        description: "Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]",
        isEnabled: () => !J6(process.env.DISABLE_COMPACT),
        isHidden: !1,
        supportsNonInteractive: !0,
        argumentHint: "<optional custom summarization instructions>",
        load: () => Promise.resolve().then(() => (K8q(), q8q)),
        userFacingName() {
            return "compact"
        }
    }, Y8q = niY
})
// @from(Ln 390110, Col 0)
function $y(A) {
    let q = e(11),
        {
            title: K,
            color: Y,
            defaultTab: z,
            children: w,
            hidden: H,
            useFullWidth: $,
            selectedTab: O,
            onTabChange: _,
            banner: J,
            disableNavigation: X
        } = A,
        {
            columns: D
        } = Z8(),
        j = w.map(oiY),
        M = z ? j.findIndex((s) => z === s[0]) : 0,
        P = O !== void 0,
        [W, G] = J91.useState(M !== -1 ? M : 0),
        f = P ? j.findIndex((s) => s[0] === O) : -1,
        Z = P ? f !== -1 ? f : 0 : W,
        N = (s) => {
            let O1 = (Z + j.length + s) % j.length,
                T1 = j[O1]?.[0];
            if (P && _ && T1) _(T1);
            else G(O1)
        },
        T = !H && !X,
        k;
    if (q[0] !== T) k = {
        context: "Tabs",
        isActive: T
    }, q[0] = T, q[1] = k;
    else k = q[1];
    c7({
        "tabs:next": () => N(1),
        "tabs:previous": () => N(-1)
    }, k);
    let y = K ? UA(K) + 1 : 0,
        B = j.reduce(riY, 0),
        S = y + B + 21,
        m = $ ? Math.max(0, D - S - 2) : 0,
        b = $ ? D - 2 : void 0,
        g = I,
        U = "column",
        x = !H && jE.default.createElement(jE.default.Fragment, null, jE.default.createElement(V, {
            color: Y
        }, "─".repeat(D - 2)), jE.default.createElement(I, {
            flexDirection: "row",
            gap: 1,
            paddingLeft: 1
        }, K !== void 0 && jE.default.createElement(V, {
            bold: !0,
            color: Y
        }, K), j.map((s, O1) => {
            let [T1, N1] = s;
            return jE.default.createElement(V, {
                key: T1,
                backgroundColor: Y && Z === O1 ? Y : void 0,
                color: Y && Z === O1 ? "inverseText" : void 0,
                bold: Z === O1
            }, " ", N1, " ")
        }), jE.default.createElement(V, {
            dimColor: !0
        }, "(←/→ or tab to cycle)"), m > 0 && jE.default.createElement(V, null, " ".repeat(m)))),
        p = H ? 0 : 1,
        l;
    if (q[2] !== w || q[3] !== b || q[4] !== p) l = jE.default.createElement(I, {
        width: b,
        paddingLeft: 1,
        marginTop: p
    }, w), q[2] = w, q[3] = b, q[4] = p, q[5] = l;
    else l = q[5];
    let r;
    if (q[6] !== g || q[7] !== J || q[8] !== x || q[9] !== l) r = jE.default.createElement(g, {
        flexDirection: U
    }, x, J, l), q[6] = g, q[7] = J, q[8] = x, q[9] = l, q[10] = r;
    else r = q[10];
    return jE.default.createElement(vIA.Provider, {
        value: {
            selectedTab: j[Z][0],
            width: b
        }
    }, r)
}
// @from(Ln 390198, Col 0)
function riY(A, q) {
    let [, K] = q;
    return A + (K ? UA(K) : 0) + 2 + 1
}
// @from(Ln 390203, Col 0)
function oiY(A) {
    return [A.props.id ?? A.props.title, A.props.title]
}
// @from(Ln 390207, Col 0)
function LH(A) {
    let q = e(3),
        {
            title: K,
            id: Y,
            children: z
        } = A,
        {
            selectedTab: w,
            width: H
        } = J91.useContext(vIA);
    if (w !== (Y ?? K)) return null;
    let $;
    if (q[0] !== z || q[1] !== H) $ = jE.default.createElement(I, {
        width: H
    }, z), q[0] = z, q[1] = H, q[2] = $;
    else $ = q[2];
    return $
}
// @from(Ln 390227, Col 0)
function w8q() {
    let {
        width: A
    } = J91.useContext(vIA);
    return A
}
// @from(Ln 390233, Col 4)
jE
// @from(Ln 390233, Col 8)
J91
// @from(Ln 390233, Col 13)
vIA
// @from(Ln 390234, Col 4)
X91 = v(() => {
    i1();
    m1();
    K7();
    mq();
    LY();
    jE = o(X1(), 1), J91 = o(X1(), 1), vIA = J91.createContext({
        selectedTab: void 0,
        width: void 0
    })
})
// @from(Ln 390246, Col 0)
function H8q(A) {
    let q = e(3),
        K, Y;
    if (q[0] !== A) {
        Y = Symbol.for("react.early_return_sentinel");
        A: {
            let {
                context: z,
                flat: w
            } = A === void 0 ? {} : A,
            H = I_(),
            $ = [];
            if (z?.readFileState) Th(z.readFileState).forEach((J) => {
                let X = z.readFileState.get(J);
                if (X && J.endsWith("/CLAUDE.md") && !H.some((D) => D.path === J)) $.push({
                    path: J,
                    content: X.content,
                    type: "Project",
                    isNested: !0
                })
            });
            let O = [...H, ...$];
            if (O.length === 0) {
                Y = null;
                break A
            }
            if (w) {
                Y = uJ.createElement(I, {
                    flexDirection: "row",
                    columnGap: 1,
                    flexWrap: "wrap"
                }, O.map((J, X) => {
                    let D = L3(J.path),
                        j = J.isNested ? "nested" : bCA(J.type),
                        M = X < O.length - 1 ? "," : "";
                    return uJ.createElement(I, {
                        key: X,
                        flexDirection: "row",
                        flexShrink: 0
                    }, uJ.createElement(V, null, j, " "), uJ.createElement(V, {
                        dimColor: !0
                    }, "(", D, ")"), uJ.createElement(V, null, M))
                }));
                break A
            }
            let _ = new Map;K = uJ.createElement(I, {
                flexDirection: "column"
            }, O.map((J, X) => {
                let D = L3(J.path),
                    j = J.isNested ? "nested: " : `${bCA(J.type)}: `,
                    M = J.parent ? (_.get(J.parent) ?? 0) + 1 : 0;
                if (_.set(J.path, M), M === 0) return uJ.createElement(V, {
                    key: X
                }, uJ.createElement(V, {
                    dimColor: !0
                }, " L "), `${j}${D}`);
                else {
                    let P = "  ".repeat(M - 1);
                    return uJ.createElement(V, {
                        key: X
                    }, " ".repeat(j.length + 2), P, uJ.createElement(V, {
                        dimColor: !0
                    }, " L "), D)
                }
            }))
        }
        q[0] = A, q[1] = K, q[2] = Y
    } else K = q[1], Y = q[2];
    if (Y !== Symbol.for("react.early_return_sentinel")) return Y;
    return K
}
// @from(Ln 390317, Col 4)
uJ
// @from(Ln 390318, Col 4)
$8q = v(() => {
    i1();
    m1();
    dD();
    wq();
    uCA();
    pM();
    uJ = o(X1(), 1)
})
// @from(Ln 390334, Col 0)
function Ff6(A) {
    return {
        env: A?.env ?? process.env,
        home: A?.homedir ?? aiY()
    }
}
// @from(Ln 390341, Col 0)
function Qf6(A) {
    let {
        env: q,
        home: K
    } = Ff6(A);
    return q.XDG_STATE_HOME ?? mf6(K, ".local", "state")
}
// @from(Ln 390349, Col 0)
function O8q(A) {
    let {
        env: q,
        home: K
    } = Ff6(A);
    return q.XDG_CACHE_HOME ?? mf6(K, ".cache")
}
// @from(Ln 390357, Col 0)
function _8q(A) {
    let {
        env: q,
        home: K
    } = Ff6(A);
    return q.XDG_DATA_HOME ?? mf6(K, ".local", "share")
}
// @from(Ln 390365, Col 0)
function J8q(A) {
    let {
        home: q
    } = Ff6(A);
    return mf6(q, ".local", "bin")
}
// @from(Ln 390371, Col 4)
EIA = () => {}
// @from(Ln 390376, Col 0)
function j8q() {
    return (process.argv[1] || "").includes("/.claude/local/node_modules/")
}
// @from(Ln 390379, Col 0)
async function siY() {
    try {
        if (!b1().existsSync(Ke)) b1().mkdirSync(Ke);
        if (!b1().existsSync(X8q)) c8(X8q, Q1({
            name: "claude-local",
            version: "0.0.1",
            private: !0
        }, null, 2), {
            encoding: "utf8",
            flush: !1
        });
        let A = eU1(Ke, "claude");
        if (!b1().existsSync(A)) {
            let q = `#!/bin/sh
exec "${Ke}/node_modules/.bin/claude" "$@"`;
            c8(A, q, {
                encoding: "utf8",
                flush: !1
            }), await IA("chmod", ["+x", A])
        }
        return !0
    } catch (A) {
        return K1(A instanceof Error ? A : Error(String(A))), !1
    }
}
// @from(Ln 390404, Col 0)
async function Ap1(A, q) {
    try {
        if (!await siY()) return "install_failed";
        let K = q ? q : A === "stable" ? "stable" : "latest",
            Y = await d4("npm", ["install", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}@${K}`], {
                cwd: Ke,
                maxBuffer: 1e6
            });
        if (Y.code !== 0) {
            let z = Error(`Failed to install Claude CLI package: ${Y.stderr}`);
            return K1(z), Y.code === 190 ? "in_progress" : "install_failed"
        }
        return jA((z) => ({
            ...z,
            installMethod: "local"
        })), "success"
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), "install_failed"
    }
}
// @from(Ln 390425, Col 0)
function Ye() {
    return b1().existsSync(eU1(Ke, "node_modules", ".bin", "claude"))
}
// @from(Ln 390429, Col 0)
function eG1() {
    let A = process.env.SHELL || "";
    if (A.includes("zsh")) return "zsh";
    if (A.includes("bash")) return "bash";
    if (A.includes("fish")) return "fish";
    return "unknown"
}
// @from(Ln 390436, Col 4)
Ke
// @from(Ln 390436, Col 8)
X8q
// @from(Ln 390436, Col 13)
D8q
// @from(Ln 390437, Col 4)
D91 = v(() => {
    tq();
    y6();
    cA();
    _8();
    hA();
    m6();
    m6();
    Ke = eU1(O8(), "local"), X8q = eU1(Ke, "package.json"), D8q = eU1(Ke, "claude")
})
// @from(Ln 390454, Col 0)
function ze() {
    let A = process.env.ZDOTDIR || gf6();
    return {
        zsh: kIA(A, ".zshrc"),
        bash: kIA(gf6(), ".bashrc"),
        fish: kIA(gf6(), ".config/fish/config.fish")
    }
}
// @from(Ln 390463, Col 0)
function Uf6(A) {
    let q = !1;
    return {
        filtered: A.filter((Y) => {
            if (M8q.test(Y)) {
                let z = Y.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
                if (!z) z = Y.match(/alias\s+claude\s*=\s*([^#\n]+)/);
                if (z && z[1]) {
                    if (z[1].trim() === D8q) return q = !0, !1
                }
            }
            return !0
        }),
        hadAlias: q
    }
}
// @from(Ln 390480, Col 0)
function qp1(A) {
    let q = b1();
    try {
        if (!q.existsSync(A)) return null;
        return q.readFileSync(A, {
            encoding: "utf8"
        }).split(`
`)
    } catch {
        return null
    }
}
// @from(Ln 390493, Col 0)
function pf6(A, q) {
    c8(A, q.join(`
`), {
        encoding: "utf8",
        flush: !0
    })
}
// @from(Ln 390501, Col 0)
function LIA() {
    let A = ze();
    for (let q of Object.values(A)) {
        let K = qp1(q);
        if (!K) continue;
        for (let Y of K)
            if (M8q.test(Y)) {
                let z = Y.match(/alias\s+claude=["']?([^"'\s]+)/);
                if (z && z[1]) return z[1]
            }
    }
    return null
}
// @from(Ln 390515, Col 0)
function P8q() {
    let A = LIA();
    if (!A) return null;
    let q = b1(),
        K = A.startsWith("~") ? A.replace("~", gf6()) : A;
    try {
        if (q.existsSync(K)) {
            let Y = q.statSync(K);
            if (Y.isFile() || Y.isSymbolicLink()) return A
        }
    } catch {}
    return null
}
// @from(Ln 390528, Col 4)
M8q
// @from(Ln 390529, Col 4)
df6 = v(() => {
    _8();
    D91();
    m6();
    M8q = /^\s*alias\s+claude\s*=/
})
// @from(Ln 390547, Col 0)
async function W8q() {
    try {
        let A = await CI("tengu_version_config", {
            minVersion: "0.0.0"
        });
        if (A.minVersion && if6.lt({
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION, A.minVersion)) console.error(`
It looks like your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}) needs an update.
A newer version (${A.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), w3(1)
    } catch (A) {
        K1(A)
    }
}
// @from(Ln 390573, Col 0)
function AZ1(A) {
    let K = l4()?.minimumVersion;
    if (!K) return !1;
    let Y = !if6.gte(A, K, {
        loose: !0
    });
    if (Y) h(`Skipping update to ${A} - below minimumVersion ${K}`);
    return Y
}
// @from(Ln 390583, Col 0)
function j91() {
    return eiY(O8(), ".update.lock")
}
// @from(Ln 390587, Col 0)
function YnY() {
    try {
        if (!b1().existsSync(O8())) b1().mkdirSync(O8());
        if (b1().existsSync(j91())) {
            let A = b1().statSync(j91());
            if (Date.now() - A.mtimeMs < KnY) return !1;
            try {
                b1().unlinkSync(j91())
            } catch (K) {
                return K1(K), !1
            }
        }
        return c8(j91(), `${process.pid}`, {
            encoding: "utf8"
        }), !0
    } catch (A) {
        return K1(A), !1
    }
}
// @from(Ln 390607, Col 0)
function znY() {
    try {
        if (b1().existsSync(j91())) {
            if (b1().readFileSync(j91(), {
                    encoding: "utf8"
                }) === `${process.pid}`) b1().unlinkSync(j91())
        }
    } catch (A) {
        K1(A)
    }
}
// @from(Ln 390618, Col 0)
async function wnY() {
    let A = xA.isRunningWithBun(),
        q = null;
    if (A) q = await d4("bun", ["pm", "bin", "-g"], {
        cwd: Kp1()
    });
    else q = await d4("npm", ["-g", "config", "get", "prefix"], {
        cwd: Kp1()
    });
    if (q.code !== 0) return K1(Error(`Failed to check ${A?"bun":"npm"} permissions`)), null;
    return q.stdout.trim()
}
// @from(Ln 390630, Col 0)
async function RIA() {
    try {
        let A = await wnY();
        if (!A) return {
            hasPermissions: !1,
            npmPrefix: null
        };
        let q = !1;
        try {
            AnY(A, tiY.W_OK), q = !0
        } catch {
            q = !1
        }
        if (q) return {
            hasPermissions: !0,
            npmPrefix: A
        };
        return K1(new cf6("Insufficient permissions for global npm install.")), {
            hasPermissions: !1,
            npmPrefix: A
        }
    } catch (A) {
        return K1(A), {
            hasPermissions: !1,
            npmPrefix: null
        }
    }
}
// @from(Ln 390658, Col 0)
async function M91(A) {
    let q = Aq();
    setTimeout(() => q.abort(), 5000);
    let K = A === "stable" ? "stable" : "latest",
        Y = await d4("npm", ["view", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}@${K}`, "version", "--prefer-online"], {
            abortSignal: q.signal,
            cwd: Kp1()
        });
    if (Y.code !== 0) {
        if (h(`npm view failed with code ${Y.code}`), Y.stderr) h(`npm stderr: ${Y.stderr.trim()}`);
        else h("npm stderr: (empty)");
        if (Y.stdout) h(`npm stdout: ${Y.stdout.trim()}`);
        return null
    }
    return Y.stdout.trim()
}
// @from(Ln 390674, Col 0)
async function G8q() {
    let A = Aq();
    setTimeout(() => A.abort(), 5000);
    let q = await d4("npm", ["view", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.PACKAGE_URL, "dist-tags", "--json", "--prefer-online"], {
        abortSignal: A.signal,
        cwd: Kp1()
    });
    if (q.code !== 0) return h(`npm view dist-tags failed with code ${q.code}`), {
        latest: null,
        stable: null
    };
    try {
        let K = _A(q.stdout.trim());
        return {
            latest: typeof K.latest === "string" ? K.latest : null,
            stable: typeof K.stable === "string" ? K.stable : null
        }
    } catch (K) {
        return h(`Failed to parse dist-tags: ${K}`), {
            latest: null,
            stable: null
        }
    }
}
// @from(Ln 390705, Col 0)
async function lf6(A) {
    try {
        return (await sA.get(`${qnY}/${A}`, {
            timeout: 5000,
            responseType: "text"
        })).data.trim()
    } catch (q) {
        return h(`Failed to fetch ${A} from GCS: ${q}`), null
    }
}
// @from(Ln 390715, Col 0)
async function Z8q() {
    let [A, q] = await Promise.all([lf6("latest"), lf6("stable")]);
    return {
        latest: A,
        stable: q
    }
}
// @from(Ln 390722, Col 0)
async function Yp1(A) {
    if (!YnY()) return K1(new cf6("Another process is currently installing an update")), c("tengu_auto_updater_lock_contention", {
        pid: process.pid,
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION
    }), "in_progress";
    try {
        if (HnY(), !xA.isRunningWithBun() && xA.isNpmFromWindowsPath()) return K1(Error("Windows NPM detected in WSL environment")), c("tengu_auto_updater_windows_npm_in_wsl", {
            currentVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION
        }), console.error(`
Error: Windows NPM detected in WSL

You're running Claude Code in WSL but using the Windows NPM installation from /mnt/c/.
This configuration is not supported for updates.

To fix this issue:
  1. Install Node.js within your Linux distribution: e.g. sudo apt install nodejs npm
  2. Make sure Linux NPM is in your PATH before the Windows version
  3. Try updating again with 'claude update'
`), "install_failed";
        let {
            hasPermissions: q
        } = await RIA();
        if (!q) return "no_permissions";
        let K = A ? `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}@${A}` : {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.PACKAGE_URL,
            Y = xA.isRunningWithBun() ? "bun" : "npm",
            z = await d4(Y, ["install", "-g", K], {
                cwd: Kp1()
            });
        if (z.code !== 0) {
            let w = new cf6(`Failed to install new version of claude: ${z.stdout} ${z.stderr}`);
            return K1(w), "install_failed"
        }
        return jA((w) => ({
            ...w,
            installMethod: "global"
        })), "success"
    } finally {
        znY()
    }
}
// @from(Ln 390784, Col 0)
function HnY() {
    let A = ze();
    for (let [, q] of Object.entries(A)) try {
        let K = qp1(q);
        if (!K) continue;
        let {
            filtered: Y,
            hadAlias: z
        } = Uf6(K);
        if (z) pf6(q, Y), h(`Removed claude alias from ${q}`)
    } catch (K) {
        h(`Failed to remove alias from ${q}: ${K}`, {
            level: "error"
        })
    }
}
// @from(Ln 390800, Col 4)
if6
// @from(Ln 390800, Col 9)
qnY = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 390801, Col 4)
cf6
// @from(Ln 390801, Col 9)
KnY = 300000
// @from(Ln 390802, Col 4)
we = v(() => {
    u6();
    U4();
    G2();
    cA();
    Z6();
    G5();
    hA();
    qH();
    tq();
    m6();
    _8();
    w$();
    y6();
    p8();
    df6();
    m6();
    y5();
    if6 = o(GS(), 1);
    cf6 = class cf6 extends CT1 {}
})
// @from(Ln 390832, Col 0)
async function JnY(A = "latest", q, K) {
    let Y = Date.now();
    try {
        let z = await sA.get(`${q}/${A}`, {
                timeout: 30000,
                responseType: "text",
                ...K
            }),
            w = Date.now() - Y;
        return c("tengu_version_check_success", {
            latency_ms: w
        }), z.data.trim()
    } catch (z) {
        let w = Date.now() - Y,
            H = z instanceof Error ? z.message : String(z),
            $;
        if (sA.isAxiosError(z) && z.response) $ = z.response.status;
        c("tengu_version_check_failure", {
            latency_ms: w,
            http_status: $,
            is_timeout: H.includes("timeout")
        });
        let O = Error(`Failed to fetch version from ${q}/${A}: ${H}`);
        throw K1(O), O
    }
}
// @from(Ln 390858, Col 0)
async function CIA(A) {
    if (/^v?\d+\.\d+\.\d+(-\S+)?$/.test(A)) return A.startsWith("v") ? A.slice(1) : A;
    let q = A;
    if (q !== "stable" && q !== "latest") throw Error(`Invalid channel: ${A}. Use 'stable' or 'latest'`);
    return JnY(q, f8q)
}
// @from(Ln 390864, Col 0)
async function DnY(A, q, K, Y = {}) {
    let z;
    for (let w = 1; w <= yIA; w++) {
        let H = new AbortController,
            $, O = () => {
                if ($) clearTimeout($), $ = void 0
            },
            _ = () => {
                O(), $ = setTimeout(() => {
                    H.abort()
                }, XnY)
            };
        try {
            _();
            let J = await sA.get(A, {
                timeout: 300000,
                responseType: "arraybuffer",
                signal: H.signal,
                onDownloadProgress: () => {
                    _()
                },
                ...Y
            });
            O();
            let X = OnY("sha256");
            X.update(J.data);
            let D = X.digest("hex");
            if (D !== q) throw Error(`Checksum mismatch: expected ${q}, got ${D}`);
            (await import("fs")).writeFileSync(K, Buffer.from(J.data)), _nY(K, 493);
            return
        } catch (J) {
            O();
            let X = sA.isCancel(J);
            if (X) z = new V8q;
            else z = J instanceof Error ? J : Error(String(J));
            if (X && w < yIA) {
                h(`Download stalled on attempt ${w}/${yIA}, retrying...`), await new Promise((D) => setTimeout(D, 1000));
                continue
            }
            throw z
        }
    }
    throw z ?? Error("Download failed after all retries")
}
// @from(Ln 390908, Col 0)
async function jnY(A, q, K, Y) {
    let z = b1();
    if (z.existsSync(q)) z.rmSync(q, {
        recursive: !0,
        force: !0
    });
    let w = Hc(),
        H = Date.now();
    c("tengu_binary_download_attempt", {});
    let $;
    try {
        $ = (await sA.get(`${K}/${A}/manifest.json`, {
            timeout: 1e4,
            responseType: "json",
            ...Y
        })).data
    } catch (j) {
        let M = Date.now() - H,
            P = j instanceof Error ? j.message : String(j),
            W;
        if (sA.isAxiosError(j) && j.response) W = j.response.status;
        throw c("tengu_binary_manifest_fetch_failure", {
            latency_ms: M,
            http_status: W,
            is_timeout: P.includes("timeout")
        }), K1(Error(`Failed to fetch manifest from ${K}/${A}/manifest.json: ${P}`)), j
    }
    let O = $.platforms[w];
    if (!O) throw c("tengu_binary_platform_not_found", {}), Error(`Platform ${w} not found in manifest for version ${A}`);
    let _ = O.checksum,
        J = nf6(w),
        X = `${K}/${A}/${w}/${J}`;
    z.mkdirSync(q);
    let D = $nY(q, J);
    try {
        await DnY(X, _, D, Y || {});
        let j = Date.now() - H;
        c("tengu_binary_download_success", {
            latency_ms: j
        })
    } catch (j) {
        let M = Date.now() - H,
            P = j instanceof Error ? j.message : String(j),
            W;
        if (sA.isAxiosError(j) && j.response) W = j.response.status;
        throw c("tengu_binary_download_failure", {
            latency_ms: M,
            http_status: W,
            is_timeout: P.includes("timeout"),
            is_checksum_mismatch: P.includes("Checksum mismatch")
        }), K1(Error(`Failed to download binary from ${X}: ${P}`)), j
    }
}
// @from(Ln 390961, Col 0)
async function N8q(A, q) {
    return await jnY(A, q, f8q), "binary"
}
// @from(Ln 390964, Col 4)
f8q = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 390965, Col 4)
XnY = 60000
// @from(Ln 390966, Col 4)
yIA = 3
// @from(Ln 390967, Col 4)
V8q
// @from(Ln 390968, Col 4)
T8q = v(() => {
    y5();
    _8();
    tq();
    Z6();
    u6();
    SIA();
    y6();
    m6();
    m6();
    V8q = class V8q extends Error {
        constructor() {
            super("Download stalled: no data received for 60 seconds");
            this.name = "StallTimeoutError"
        }
    }
})
// @from(Ln 390989, Col 0)
function of6(A, q) {
    return q.includes(A.id) || A.idLike.some((K) => q.includes(K))
}
// @from(Ln 390993, Col 0)
function af6() {
    let A = eA();
    if (A !== "macos" && A !== "linux" && A !== "wsl") return !1;
    let q = process.execPath || process.argv[0] || "";
    if (q.includes("/Caskroom/")) return h(`Detected Homebrew cask installation: ${q}`), !0;
    return !1
}
// @from(Ln 391001, Col 0)
function hIA() {
    if (eA() !== "windows") return !1;
    let q = process.execPath || process.argv[0] || "",
        K = [/Microsoft[/\\]WinGet[/\\]Packages/i, /Microsoft[/\\]WinGet[/\\]Links/i];
    for (let Y of K)
        if (Y.test(q)) return h(`Detected winget installation: ${q}`), !0;
    return !1
}
// @from(Ln 391009, Col 4)
rf6
// @from(Ln 391009, Col 9)
IIA
// @from(Ln 391009, Col 14)
xIA
// @from(Ln 391009, Col 19)
bIA
// @from(Ln 391009, Col 24)
uIA
// @from(Ln 391009, Col 29)
qZ1
// @from(Ln 391010, Col 4)
sf6 = v(() => {
    x3();
    Z6();
    tq();
    zq();
    rf6 = KA(async () => {
        try {
            let A = await MnY("/etc/os-release", "utf8"),
                q = A.match(/^ID=["']?(\S+?)["']?\s*$/m),
                K = A.match(/^ID_LIKE=["']?(.+?)["']?\s*$/m);
            return {
                id: q?.[1] ?? "",
                idLike: K?.[1]?.split(" ") ?? []
            }
        } catch {
            return null
        }
    });
    IIA = KA(async () => {
        if (eA() !== "linux") return !1;
        let q = await rf6();
        if (q && !of6(q, ["arch"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await IA("pacman", ["-Qo", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return h(`Detected pacman installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), xIA = KA(async () => {
        if (eA() !== "linux") return !1;
        let q = await rf6();
        if (q && !of6(q, ["debian"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await IA("dpkg", ["-S", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return h(`Detected deb installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), bIA = KA(async () => {
        if (eA() !== "linux") return !1;
        let q = await rf6();
        if (q && !of6(q, ["fedora", "rhel", "suse"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await IA("rpm", ["-qf", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return h(`Detected rpm installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), uIA = KA(async () => {
        if (eA() !== "linux") return !1;
        let q = await rf6();
        if (q && !of6(q, ["alpine"])) return !1;
        let K = process.execPath || process.argv[0] || "",
            Y = await IA("apk", ["info", "--who-owns", K], {
                timeout: 5000,
                useCwd: !1
            });
        if (Y.code === 0 && Y.stdout) return h(`Detected apk installation: ${Y.stdout.trim()}`), !0;
        return !1
    }), qZ1 = KA(async () => {
        if (af6()) return "homebrew";
        if (hIA()) return "winget";
        if (await IIA()) return "pacman";
        if (await uIA()) return "apk";
        if (await xIA()) return "deb";
        if (await bIA()) return "rpm";
        return "unknown"
    })
})
// @from(Ln 391092, Col 0)
function WnY() {
    let A = process.argv[1] || "",
        q = process.execPath || process.argv[0] || "";
    if (eA() === "windows") A = A.split(wp1.sep).join(zp1.sep), q = q.split(wp1.sep).join(zp1.sep);
    return [A, q]
}
// @from(Ln 391098, Col 0)
async function om() {
    let [A] = WnY();
    if (D9()) {
        if (af6() || hIA() || await IIA() || await xIA() || await bIA() || await uIA()) return "package-manager";
        return "native"
    }
    if (j8q()) return "npm-local";
    if (["/usr/local/lib/node_modules", "/usr/lib/node_modules", "/opt/homebrew/lib/node_modules", "/opt/homebrew/bin", "/usr/local/bin", "/.nvm/versions/node/"].some((z) => A.includes(z))) return "npm-global";
    if (A.includes("/npm/") || A.includes("/nvm/")) return "npm-global";
    let K = await XY("npm config get prefix", {
            shell: !0,
            reject: !1
        }),
        Y = K.exitCode === 0 ? K.stdout.trim() : null;
    if (Y && A.startsWith(Y)) return "npm-global";
    return "unknown"
}
// @from(Ln 391115, Col 0)
async function GnY() {
    if (D9()) {
        let A = b1();
        try {
            return A.realpathSync(process.execPath)
        } catch {}
        try {
            let q = await mf("claude");
            if (q) return q
        } catch {}
        if (A.existsSync(rm(P91(), ".local/bin/claude"))) return rm(P91(), ".local/bin/claude");
        return "native"
    }
    try {
        return process.argv[0] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 391135, Col 0)
function Hp1() {
    try {
        if (D9()) return process.execPath || "unknown";
        return process.argv[1] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 391143, Col 0)
async function ZnY() {
    let A = b1(),
        q = [],
        K = rm(P91(), ".claude", "local");
    if (Ye()) q.push({
        type: "npm-local",
        path: K
    });
    let Y = ["@anthropic-ai/claude-code"];
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") Y.push({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.PACKAGE_URL);
    let z = await IA("npm", ["-g", "config", "get", "prefix"]);
    if (z.code === 0 && z.stdout) {
        let $ = z.stdout.trim(),
            O = eA() === "windows",
            _ = O ? rm($, "claude") : rm($, "bin", "claude");
        if (A.existsSync(_)) {
            let J = !1;
            try {
                if (A.realpathSync(_).includes("/Caskroom/")) J = af6()
            } catch {}
            if (!J) q.push({
                type: "npm-global",
                path: _
            })
        } else
            for (let J of Y) {
                let X = O ? rm($, "node_modules", J) : rm($, "lib", "node_modules", J);
                if (A.existsSync(X)) q.push({
                    type: "npm-global-orphan",
                    path: X
                })
            }
    }
    let w = rm(P91(), ".local", "bin", "claude");
    if (A.existsSync(w)) q.push({
        type: "native",
        path: w
    });
    if (f6().installMethod === "native") {
        let $ = rm(P91(), ".local", "share", "claude");
        if (A.existsSync($) && !q.some((O) => O.type === "native")) q.push({
            type: "native",
            path: $
        })
    }
    return q
}
// @from(Ln 391211, Col 0)
async function fnY(A) {
    let q = [],
        K = f6();
    if (A === "development") return q;
    if (A === "native") {
        let H = (process.env.PATH || "").split(PnY),
            $ = P91(),
            O = rm($, ".local", "bin"),
            _ = O;
        if (eA() === "windows") _ = O.split(wp1.sep).join(zp1.sep);
        if (!H.some((X) => {
                let D = X;
                if (eA() === "windows") D = X.split(wp1.sep).join(zp1.sep);
                let j = D.replace(/\/+$/, ""),
                    M = X.replace(/[/\\]+$/, "");
                return j === _ || M === "~/.local/bin" || M === "$HOME/.local/bin"
            }))
            if (eA() === "windows") {
                let D = O.split(zp1.sep).join(wp1.sep);
                q.push({
                    issue: `Native installation exists but ${D} is not in your PATH`,
                    fix: "Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal."
                })
            } else {
                let D = eG1(),
                    M = ze()[D],
                    P = M ? M.replace(P91(), "~") : "your shell config file";
                q.push({
                    issue: "Native installation exists but ~/.local/bin is not in your PATH",
                    fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${P} then open a new terminal or run: source ${P}`
                })
            }
    }
    if (!J6(process.env.DISABLE_INSTALLATION_CHECKS)) {
        if (A === "npm-local" && K.installMethod !== "local") q.push({
            issue: `Running from local installation but config install method is '${K.installMethod}'`,
            fix: "Consider using native installation: claude install"
        });
        if (A === "native" && K.installMethod !== "native") q.push({
            issue: `Running native installation but config install method is '${K.installMethod}'`,
            fix: "Run claude install to update configuration"
        })
    }
    if (A === "npm-global" && Ye()) q.push({
        issue: "Local installation exists but not being used",
        fix: "Consider using native installation: claude install"
    });
    let Y = LIA(),
        z = P8q();
    if (A === "npm-local") {
        if (!await mf("claude") && !z)
            if (Y) q.push({
                issue: "Local installation not accessible",
                fix: `Alias exists but points to invalid target: ${Y}. Update alias: alias claude="~/.claude/local/claude"`
            });
            else q.push({
                issue: "Local installation not accessible",
                fix: 'Create alias: alias claude="~/.claude/local/claude"'
            })
    }
    return q
}
// @from(Ln 391274, Col 0)
function VnY() {
    if (eA() !== "linux") return [];
    let A = [],
        q = b8.getLinuxGlobPatternWarnings();
    if (q.length > 0) {
        let K = q.slice(0, 3).join(", "),
            Y = q.length - 3,
            z = Y > 0 ? `${K} (${Y} more)` : K;
        A.push({
            issue: "Glob patterns in sandbox permission rules are not fully supported on Linux",
            fix: `Found ${q.length} pattern(s): ${z}. On Linux, glob patterns in Edit/Read rules will be ignored.`
        })
    }
    return A
}
// @from(Ln 391289, Col 0)
async function W91() {
    let A = await om(),
        q = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION ? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION : "unknown",
        K = await GnY(),
        Y = Hp1(),
        z = await ZnY(),
        w = await fnY(A);
    if (w.push(...VnY()), A === "native") {
        let j = z.filter((P) => P.type === "npm-global" || P.type === "npm-global-orphan" || P.type === "npm-local"),
            M = eA() === "windows";
        for (let P of j)
            if (P.type === "npm-global") {
                let W = "npm -g uninstall @anthropic-ai/claude-code";
                if ({
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.PACKAGE_URL && {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.38",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-02-10T00:04:56Z"
                    }.PACKAGE_URL !== "@anthropic-ai/claude-code") W += ` && npm -g uninstall ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.PACKAGE_URL}`;
                w.push({
                    issue: `Leftover npm global installation at ${P.path}`,
                    fix: `Run: ${W}`
                })
            } else if (P.type === "npm-global-orphan") w.push({
            issue: `Orphaned npm global package at ${P.path}`,
            fix: M ? `Run: rmdir /s /q "${P.path}"` : `Run: rm -rf ${P.path}`
        });
        else if (P.type === "npm-local") w.push({
            issue: `Leftover npm local installation at ${P.path}`,
            fix: M ? `Run: rmdir /s /q "${P.path}"` : `Run: rm -rf ${P.path}`
        })
    }
    let $ = f6().installMethod || "not set",
        O = null;
    if (A === "npm-global") {
        if (O = (await RIA()).hasPermissions, !O && !KZ1()) w.push({
            issue: "Insufficient permissions for auto-updates",
            fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
        })
    }
    let _ = jz8(),
        J = {
            working: _.working ?? !0,
            mode: _.mode,
            systemPath: _.mode === "system" ? _.path : null
        },
        X = A === "package-manager" ? await qZ1() : void 0;
    return {
        installationType: A,
        version: q,
        installationPath: K,
        invokedBinary: Y,
        configInstallMethod: $,
        autoUpdates: (() => {
            let j = KZ1();
            return j ? `disabled (${j})` : "enabled"
        })(),
        hasUpdatePermissions: O,
        multipleInstallations: z,
        warnings: w,
        packageManager: X,
        ripgrepStatus: J
    }
}
// @from(Ln 391376, Col 4)
am = v(() => {
    _8();
    N7();
    D91();
    cA();
    we();
    df6();
    x3();
    tq();
    Bf();
    ix();
    k2();
    hA();
    sf6();
    WQ()
})
// @from(Ln 391397, Col 0)
function G91() {
    if (J6(void 0)) return !0;
    if (FY(void 0)) return !1;
    return x8("tengu_pid_based_version_locking", !1)
}
// @from(Ln 391403, Col 0)
function tf6(A) {
    if (A <= 1) return !1;
    try {
        return process.kill(A, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 391412, Col 0)
function vnY(A, q) {
    if (!tf6(A)) return !1;
    if (A === process.pid) return !0;
    try {
        let K = Px7(A);
        if (!K) return !0;
        let Y = K.toLowerCase(),
            z = q.toLowerCase();
        return Y.includes("claude") || Y.includes(z)
    } catch {
        return !0
    }
}
// @from(Ln 391426, Col 0)
function $p1(A) {
    let q = b1();
    try {
        if (!q.existsSync(A)) return null;
        let K = q.readFileSync(A, {
            encoding: "utf8"
        });
        if (!K || K.trim() === "") return null;
        let Y = _A(K);
        if (typeof Y.pid !== "number" || !Y.version || !Y.execPath) return null;
        return Y
    } catch {
        return null
    }
}
// @from(Ln 391442, Col 0)
function ef6(A) {
    let q = $p1(A);
    if (!q) return !1;
    let {
        pid: K,
        execPath: Y
    } = q;
    if (!tf6(K)) return !1;
    if (!vnY(K, Y)) return h(`Lock PID ${K} is running but does not appear to be Claude - treating as stale`), !1;
    let z = b1();
    try {
        let w = z.statSync(A);
        if (Date.now() - w.mtimeMs > TnY) {
            if (!tf6(K)) return !1
        }
    } catch {}
    return !0
}
// @from(Ln 391461, Col 0)
function EnY(A, q) {
    let K = b1(),
        Y = `${A}.tmp.${process.pid}.${Date.now()}`;
    try {
        c8(Y, Q1(q, null, 2), {
            encoding: "utf8",
            flush: !0
        }), K.renameSync(Y, A)
    } catch (z) {
        try {
            if (K.existsSync(Y)) K.unlinkSync(Y)
        } catch {}
        throw z
    }
}
// @from(Ln 391476, Col 0)
async function E8q(A, q) {
    let K = b1(),
        Y = NnY(A);
    if (ef6(q)) {
        let w = $p1(q);
        return h(`Cannot acquire lock for ${Y} - held by PID ${w?.pid}`), null
    }
    let z = {
        pid: process.pid,
        version: Y,
        execPath: process.execPath,
        acquiredAt: Date.now()
    };
    try {
        if (EnY(q, z), $p1(q)?.pid !== process.pid) return null;
        return h(`Acquired PID lock for ${Y} (PID ${process.pid})`), () => {
            try {
                if ($p1(q)?.pid === process.pid) K.unlinkSync(q), h(`Released PID lock for ${Y}`)
            } catch (H) {
                h(`Failed to release lock for ${Y}: ${H}`)
            }
        }
    } catch (w) {
        return h(`Failed to acquire lock for ${Y}: ${w}`), null
    }
}
// @from(Ln 391502, Col 0)
async function k8q(A, q) {
    let K = await E8q(A, q);
    if (!K) return !1;
    let Y = () => {
        try {
            K()
        } catch {}
    };
    return process.on("exit", Y), process.on("SIGINT", Y), process.on("SIGTERM", Y), !0
}
// @from(Ln 391512, Col 0)
async function L8q(A, q, K) {
    let Y = await E8q(A, q);
    if (!Y) return !1;
    try {
        return await K(), !0
    } finally {
        Y()
    }
}
// @from(Ln 391522, Col 0)
function BIA(A) {
    let q = b1(),
        K = [];
    if (!q.existsSync(A)) return K;
    try {
        let Y = q.readdirStringSync(A).filter((z) => z.endsWith(".lock"));
        for (let z of Y) {
            let w = v8q(A, z),
                H = $p1(w);
            if (H) K.push({
                version: H.version,
                pid: H.pid,
                isProcessRunning: tf6(H.pid),
                execPath: H.execPath,
                acquiredAt: new Date(H.acquiredAt),
                lockFilePath: w
            })
        }
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(`Failed to get lock info: ${Y}`))
    }
    return K
}
// @from(Ln 391546, Col 0)
function AV6(A) {
    let q = b1(),
        K = 0;
    if (!q.existsSync(A)) return 0;
    try {
        let Y = q.readdirStringSync(A).filter((z) => z.endsWith(".lock"));
        for (let z of Y) {
            let w = v8q(A, z);
            try {
                if (q.lstatSync(w).isDirectory()) q.rmSync(w, {
                    recursive: !0,
                    force: !0
                }), K++, h(`Cleaned up legacy directory lock: ${z}`);
                else if (!ef6(w)) q.unlinkSync(w), K++, h(`Cleaned up stale lock: ${z}`)
            } catch {}
        }
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(`Failed to cleanup stale locks: ${Y}`))
    }
    return K
}
// @from(Ln 391567, Col 4)
TnY = 7200000
// @from(Ln 391568, Col 4)
mIA = v(() => {
    _8();
    Z6();
    y6();
    M$6();
    U4();
    hA();
    m6();
    m6()
})
// @from(Ln 391610, Col 0)
function Hc() {
    let A = xA.platform,
        q = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
    if (!q) {
        let K = Error(`Unsupported architecture: ${process.arch}`);
        throw h(`Native installer does not support architecture: ${process.arch}`, {
            level: "error"
        }), K
    }
    if (A === "linux" && lV.isMuslEnvironment()) return `linux-${q}-musl`;
    return `${A}-${q}`
}
// @from(Ln 391623, Col 0)
function nf6(A) {
    return A.startsWith("win32") ? "claude.exe" : "claude"
}
// @from(Ln 391627, Col 0)
function $e() {
    let A = Hc(),
        q = nf6(A);
    return {
        versions: BJ(_8q(), "claude", "versions"),
        staging: BJ(O8q(), "claude", "staging"),
        locks: BJ(Qf6(), "claude", "locks"),
        executable: BJ(J8q(), q)
    }
}
// @from(Ln 391637, Col 0)
async function He(A) {
    try {
        let q = await HG(A);
        if (!q.isFile() || q.size === 0) return !1;
        return await ynY(A, RnY.X_OK), !0
    } catch {
        return !1
    }
}
// @from(Ln 391646, Col 0)
async function C8q(A) {
    let q = $e(),
        K = [q.versions, q.staging, q.locks];
    await Promise.all(K.map((w) => Z91(w, {
        recursive: !0
    })));
    let Y = $c(q.executable);
    await Z91(Y, {
        recursive: !0
    });
    let z = BJ(q.versions, A);
    try {
        await HG(z)
    } catch {
        await bnY(z, "", {
            encoding: "utf8"
        })
    }
    return {
        stagingPath: BJ(q.staging, A),
        installPath: z
    }
}
// @from(Ln 391669, Col 0)
async function unY(A, q, K = 0) {
    let Y = $e(),
        z = pIA(Y, A);
    if (await Z91(Y.locks, {
            recursive: !0
        }), G91()) {
        let H = 0,
            $ = K + 1,
            O = K > 0 ? 1000 : 100,
            _ = K > 0 ? 5000 : 500;
        while (H < $) {
            if (await L8q(A, z, async () => {
                    try {
                        await q()
                    } catch (X) {
                        throw K1(X instanceof Error ? X : Error(String(X))), X
                    }
                })) return c("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !1,
                attempts: H + 1
            }), !0;
            if (H++, H < $) {
                let X = Math.min(O * Math.pow(2, H - 1), _);
                await new Promise((D) => setTimeout(D, X))
            }
        }
        return c("tengu_version_lock_failed", {
            is_pid_based: !0,
            is_lifetime_lock: !1,
            attempts: $
        }), KV6(A, Error("Lock held by another process")), !1
    }
    let w = null;
    try {
        try {
            w = await YV6.default.lock(A, {
                stale: UIA,
                retries: {
                    retries: K,
                    minTimeout: K > 0 ? 1000 : 100,
                    maxTimeout: K > 0 ? 5000 : 500
                },
                lockfilePath: z,
                onCompromised: (H) => {
                    h(`NON-FATAL: Version lock was compromised during operation: ${H.message}`, {
                        level: "info"
                    })
                }
            })
        } catch (H) {
            return c("tengu_version_lock_failed", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), KV6(A, H), !1
        }
        try {
            return await q(), c("tengu_version_lock_acquired", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), !0
        } catch (H) {
            throw K1(H instanceof Error ? H : Error(String(H))), H
        }
    } finally {
        if (w) await w()
    }
}
// @from(Ln 391737, Col 0)
async function S8q(A, q) {
    await Z91($c(q), {
        recursive: !0
    });
    let K = `${q}.tmp.${process.pid}.${Date.now()}`;
    try {
        await QIA(A, K), await CnY(K, 493), await qV6(K, q), h(`Atomically installed binary to ${q}`)
    } catch (Y) {
        try {
            await Oc(K)
        } catch {}
        throw Y
    }
}
// @from(Ln 391751, Col 0)
async function BnY(A, q) {
    try {
        let K = BJ(A, "node_modules", "@anthropic-ai"),
            z = (await YZ1(K)).find((H) => H.startsWith("claude-cli-native-"));
        if (!z) throw c("tengu_native_install_package_failure", {
            stage_find_package: !0,
            error_package_not_found: !0
        }), Error("Could not find platform-specific native package");
        let w = BJ(K, z, "cli");
        try {
            await HG(w)
        } catch {
            throw c("tengu_native_install_package_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Native binary not found in staged package")
        }
        await S8q(w, q), await zV6(A, {
            recursive: !0,
            force: !0
        }), c("tengu_native_install_package_success", {})
    } catch (K) {
        let Y = K instanceof Error ? K.message : String(K);
        if (!Y.includes("Could not find platform-specific") && !Y.includes("Native binary not found")) c("tengu_native_install_package_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw K1(K instanceof Error ? K : Error(Y)), K
    }
}