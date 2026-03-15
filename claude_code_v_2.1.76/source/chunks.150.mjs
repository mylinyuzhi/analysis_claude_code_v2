
// @from(Ln 381180, Col 0)
class Wh {
    constructor(A, q = {}, K) {
        this.options = {
            ...V5,
            ...q
        }, this.options.useExtendedSearch, this._keyStore = new t5q(this.options.keys), this.setCollection(A, K)
    }
    setCollection(A, q) {
        if (this._docs = A, q && !(q instanceof Wy1)) throw Error(HgY);
        this._myIndex = q || A3q(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
        })
    }
    add(A) {
        if (!fE(A)) return;
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
            sortFn: _,
            ignoreFieldNorm: w
        } = this.options, O = HF(A) ? HF(this._docs[0]) ? this._searchStringList(A) : this._searchObjectList(A) : this._searchLogical(A);
        if (IgY(O, {
                ignoreFieldNorm: w
            }), z) O.sort(_);
        if (o5q(q) && q > -1) O = O.slice(0, q);
        return ugY(O, this._docs, {
            includeMatches: K,
            includeScore: Y
        })
    }
    _searchStringList(A) {
        let q = OQ8(A, this.options),
            {
                records: K
            } = this._myIndex,
            Y = [];
        return K.forEach(({
            v: z,
            i: _,
            n: w
        }) => {
            if (!fE(z)) return;
            let {
                isMatch: O,
                score: $,
                indices: H
            } = q.searchIn(z);
            if (O) Y.push({
                item: z,
                idx: _,
                matches: [{
                    score: $,
                    value: z,
                    norm: w,
                    indices: H
                }]
            })
        }), Y
    }
    _searchLogical(A) {
        let q = $3q(A, this.options),
            K = (w, O, $) => {
                if (!w.children) {
                    let {
                        keyId: j,
                        searcher: J
                    } = w, M = this._findMatches({
                        key: this._keyStore.get(j),
                        value: this._myIndex.getValueForItemAtKeyId(O, j),
                        searcher: J
                    });
                    if (M && M.length) return [{
                        idx: $,
                        item: O,
                        matches: M
                    }];
                    return []
                }
                let H = [];
                for (let j = 0, J = w.children.length; j < J; j += 1) {
                    let M = w.children[j],
                        D = K(M, O, $);
                    if (D.length) H.push(...D);
                    else if (w.operator === Py1.AND) return []
                }
                return H
            },
            Y = this._myIndex.records,
            z = {},
            _ = [];
        return Y.forEach(({
            $: w,
            i: O
        }) => {
            if (fE(w)) {
                let $ = K(q, w, O);
                if ($.length) {
                    if (!z[O]) z[O] = {
                        idx: O,
                        item: w,
                        matches: []
                    }, _.push(z[O]);
                    $.forEach(({
                        matches: H
                    }) => {
                        z[O].matches.push(...H)
                    })
                }
            }
        }), _
    }
    _searchObjectList(A) {
        let q = OQ8(A, this.options),
            {
                keys: K,
                records: Y
            } = this._myIndex,
            z = [];
        return Y.forEach(({
            $: _,
            i: w
        }) => {
            if (!fE(_)) return;
            let O = [];
            if (K.forEach(($, H) => {
                    O.push(...this._findMatches({
                        key: $,
                        value: _[H],
                        searcher: q
                    }))
                }), O.length) z.push({
                idx: w,
                item: _,
                matches: O
            })
        }), z
    }
    _findMatches({
        key: A,
        value: q,
        searcher: K
    }) {
        if (!fE(q)) return [];
        let Y = [];
        if (pl(q)) q.forEach(({
            v: z,
            i: _,
            n: w
        }) => {
            if (!fE(z)) return;
            let {
                isMatch: O,
                score: $,
                indices: H
            } = K.searchIn(z);
            if (O) Y.push({
                score: $,
                key: A,
                value: z,
                idx: _,
                norm: w,
                indices: H
            })
        });
        else {
            let {
                v: z,
                n: _
            } = q, {
                isMatch: w,
                score: O,
                indices: $
            } = K.searchIn(z);
            if (w) Y.push({
                score: O,
                key: A,
                value: z,
                norm: _,
                indices: $
            })
        }
        return Y
    }
}
// @from(Ln 381385, Col 4)
zgY = 1 / 0
// @from(Ln 381386, Col 4)
HgY = "Incorrect 'index' type"
// @from(Ln 381387, Col 4)
jgY = (A) => `Invalid value for key ${A}`
// @from(Ln 381388, Col 4)
JgY = (A) => `Pattern length exceeds max of ${A}.`
// @from(Ln 381389, Col 4)
MgY = (A) => `Missing ${A} property in key`
// @from(Ln 381390, Col 4)
DgY = (A) => `Property 'weight' in key '${A}' must be a positive integer`
// @from(Ln 381391, Col 4)
c5q
// @from(Ln 381391, Col 9)
PgY
// @from(Ln 381391, Col 14)
WgY
// @from(Ln 381391, Col 19)
ZgY
// @from(Ln 381391, Col 24)
GgY
// @from(Ln 381391, Col 29)
V5
// @from(Ln 381391, Col 33)
fgY
// @from(Ln 381391, Col 38)
cz6 = 32
// @from(Ln 381392, Col 4)
q3q
// @from(Ln 381392, Col 9)
K3q
// @from(Ln 381392, Col 14)
Y3q
// @from(Ln 381392, Col 19)
z3q
// @from(Ln 381392, Col 24)
_3q
// @from(Ln 381392, Col 29)
w3q
// @from(Ln 381392, Col 34)
JQ8
// @from(Ln 381392, Col 39)
MQ8
// @from(Ln 381392, Col 44)
_Q8
// @from(Ln 381392, Col 49)
n5q
// @from(Ln 381392, Col 54)
EgY
// @from(Ln 381392, Col 59)
ygY = "|"
// @from(Ln 381393, Col 4)
RgY
// @from(Ln 381393, Col 9)
wQ8
// @from(Ln 381393, Col 14)
Py1
// @from(Ln 381393, Col 19)
$Q8
// @from(Ln 381393, Col 24)
HQ8 = (A) => !!(A[Py1.AND] || A[Py1.OR])
// @from(Ln 381394, Col 4)
SgY = (A) => !!A[$Q8.PATH]
// @from(Ln 381395, Col 4)
CgY = (A) => !pl(A) && a5q(A) && !HQ8(A)
// @from(Ln 381396, Col 4)
r5q = (A) => ({
        [Py1.AND]: Object.keys(A).map((q) => ({
            [q]: A[q]
        }))
    })
// @from(Ln 381401, Col 4)
Zy1 = E(() => {
    c5q = Object.prototype.hasOwnProperty;
    PgY = {
        includeMatches: !1,
        findAllMatches: !1,
        minMatchCharLength: 1
    }, WgY = {
        isCaseSensitive: !1,
        includeScore: !1,
        keys: [],
        shouldSort: !0,
        sortFn: (A, q) => A.score === q.score ? A.idx < q.idx ? -1 : 1 : A.score < q.score ? -1 : 1
    }, ZgY = {
        location: 0,
        threshold: 0.6,
        distance: 100
    }, GgY = {
        useExtendedSearch: !1,
        getFn: XgY,
        ignoreLocation: !1,
        ignoreFieldNorm: !1,
        fieldNormWeight: 1
    }, V5 = {
        ...WgY,
        ...PgY,
        ...ZgY,
        ...GgY
    }, fgY = /[^ ]+/g;
    q3q = class q3q extends Ql {
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
    K3q = class K3q extends Ql {
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
    Y3q = class Y3q extends Ql {
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
    z3q = class z3q extends Ql {
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
    _3q = class _3q extends Ql {
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
    w3q = class w3q extends Ql {
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
    JQ8 = class JQ8 extends Ql {
        constructor(A, {
            location: q = V5.location,
            threshold: K = V5.threshold,
            distance: Y = V5.distance,
            includeMatches: z = V5.includeMatches,
            findAllMatches: _ = V5.findAllMatches,
            minMatchCharLength: w = V5.minMatchCharLength,
            isCaseSensitive: O = V5.isCaseSensitive,
            ignoreLocation: $ = V5.ignoreLocation
        } = {}) {
            super(A);
            this._bitapSearch = new jQ8(A, {
                location: q,
                threshold: K,
                distance: Y,
                includeMatches: z,
                findAllMatches: _,
                minMatchCharLength: w,
                isCaseSensitive: O,
                ignoreLocation: $
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
    MQ8 = class MQ8 extends Ql {
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
            let _ = !!Y.length;
            return {
                isMatch: _,
                score: _ ? 0 : 1,
                indices: Y
            }
        }
    };
    _Q8 = [q3q, MQ8, Y3q, z3q, w3q, _3q, K3q, JQ8], n5q = _Q8.length, EgY = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
    RgY = new Set([JQ8.type, MQ8.type]);
    wQ8 = [];
    Py1 = {
        AND: "$and",
        OR: "$or"
    }, $Q8 = {
        PATH: "$path",
        PATTERN: "$val"
    };
    Wh.version = "7.0.0";
    Wh.createIndex = A3q;
    Wh.parseIndex = vgY;
    Wh.config = V5;
    Wh.parseQuery = $3q;
    hgY(O3q)
})
// @from(Ln 381640, Col 4)
DQ8 = {}
// @from(Ln 381645, Col 4)
Gy1
// @from(Ln 381645, Col 9)
mgY
// @from(Ln 381645, Col 14)
BgY
// @from(Ln 381646, Col 4)
XQ8 = E(() => {
    try {
        Gy1 = (() => {
            throw new Error("Cannot require module " + "../../file-index.node");
        })()
    } catch (A) {
        Gy1 = null
    }
    mgY = Gy1?.FileIndex, BgY = Gy1?.FileIndex
})
// @from(Ln 381657, Col 0)
async function ggY() {
    if (fy1) return null;
    if (di6) return di6;
    if (rY()) try {
        return di6 = new(await Promise.resolve().then(() => (XQ8(), DQ8))).FileIndex, di6
    } catch (A) {
        return fy1 = !0, k(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${_1(A)}`), _6(A), null
    } else return fy1 = !0, k("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}
// @from(Ln 381667, Col 0)
function M3q() {
    di6 = null, fy1 = !1, Dv6 = null, Xv6 = [], lz6 = null, Mv6++, ci6 = null, WQ8 = null, Ty1 = null, jv6 = [], ZQ8 = null, GQ8 = null
}
// @from(Ln 381670, Col 0)
async function FgY() {
    let A = G1();
    if (WQ8 === A && ci6 !== null) return ci6;
    return ci6 = H_(A) !== null, WQ8 = A, ci6
}
// @from(Ln 381676, Col 0)
function H3q(A, q, K) {
    if (K === q) return A;
    return A.map((Y) => {
        let z = OD.join(q, Y);
        return OD.relative(K, z)
    })
}
// @from(Ln 381684, Col 0)
function pgY(A) {
    if (A.length === 0) return;
    let q = fQ8(A);
    if (Dv6 && jv6.length > 0) {
        let K = fQ8(jv6),
            Y = [...jv6, ...K, ...A, ...q];
        try {
            Dv6.loadFromFileList(Y), k(`[FileIndex] rebuilt Rust index with ${jv6.length} tracked + ${A.length} untracked files`)
        } catch (z) {
            k(`[FileIndex] failed to rebuild Rust index: ${z}`)
        }
    } else {
        let K = [...A, ...q],
            Y = new Set(Xv6);
        for (let z of K)
            if (!Y.has(z)) Xv6.push(z);
        k(`[FileIndex] merged ${A.length} untracked files into JS cache`)
    }
}
// @from(Ln 381703, Col 0)
async function j3q(A, q) {
    let K = `${A}:${q}`;
    if (GQ8 === K) return ZQ8;
    let Y = $1(),
        z = [".ignore", ".rgignore"],
        _ = [...new Set([A, q])],
        w = J3q.default(),
        O = !1;
    for (let H of _)
        for (let j of z) {
            let J = OD.join(H, j);
            try {
                let M = await Y.readFile(J, {
                    encoding: "utf8"
                });
                w.add(M), O = !0, k(`[FileIndex] loaded ignore patterns from ${J}`)
            } catch {}
        }
    let $ = O ? w : null;
    return ZQ8 = $, GQ8 = K, $
}
// @from(Ln 381724, Col 0)
async function QgY(A, q) {
    let K = Date.now();
    if (k("[FileIndex] getFilesUsingGit called"), !await FgY()) return k("[FileIndex] not a git repo, returning null"), null;
    try {
        let Y = H_(G1());
        if (!Y) return k("[FileIndex] git rev-parse --show-toplevel failed, falling back to ripgrep"), null;
        let z = G1(),
            _ = Date.now(),
            w = await RA(hA(), ["-c", "core.quotepath=false", "ls-files", "--recurse-submodules"], {
                timeout: 5000,
                abortSignal: A,
                cwd: Y
            });
        if (k(`[FileIndex] git ls-files (tracked) took ${Date.now()-_}ms`), w.code !== 0) return k(`[FileIndex] git ls-files failed (code=${w.code}, stderr=${w.stderr}), falling back to ripgrep`), null;
        let O = w.stdout.trim().split(`
`).filter(Boolean),
            $ = H3q(O, Y, z),
            H = await j3q(Y, z);
        if (H) {
            let J = $.length;
            $ = H.filter($), k(`[FileIndex] applied ignore patterns: ${J} -> ${$.length} files`)
        }
        jv6 = $;
        let j = Date.now() - K;
        if (k(`[FileIndex] git ls-files: ${$.length} tracked files in ${j}ms`), d("tengu_file_suggestions_git_ls_files", {
                file_count: $.length,
                tracked_count: $.length,
                untracked_count: 0,
                duration_ms: j
            }), !Ty1) {
            let J = q ? ["-c", "core.quotepath=false", "ls-files", "--others", "--exclude-standard"] : ["-c", "core.quotepath=false", "ls-files", "--others"],
                M = Mv6;
            Ty1 = RA(hA(), J, {
                timeout: 1e4,
                cwd: Y
            }).then(async (D) => {
                if (M !== Mv6) return;
                if (D.code === 0) {
                    let X = D.stdout.trim().split(`
`).filter(Boolean),
                        P = H3q(X, Y, z),
                        W = await j3q(Y, z);
                    if (W && P.length > 0) {
                        let Z = P.length;
                        P = W.filter(P), k(`[FileIndex] applied ignore patterns to untracked: ${Z} -> ${P.length} files`)
                    }
                    k(`[FileIndex] background untracked fetch: ${P.length} files`), pgY(P)
                }
            }).catch((D) => {
                k(`[FileIndex] background untracked fetch failed: ${D}`)
            }).finally(() => {
                Ty1 = null
            })
        }
        return $
    } catch (Y) {
        return k(`[FileIndex] git ls-files error: ${_1(Y)}`), null
    }
}
// @from(Ln 381784, Col 0)
function fQ8(A) {
    let q = new Set;
    for (let K of A) {
        let Y = OD.dirname(K);
        while (Y !== "." && !q.has(Y)) {
            let z = OD.dirname(Y);
            if (z === Y) break;
            q.add(Y), Y = z
        }
    }
    return [...q].map((K) => K + OD.sep)
}
// @from(Ln 381796, Col 0)
async function UgY(A) {
    return (await Promise.all(X3q.map((K) => sd(K, A)))).flatMap((K) => K.map((Y) => Y.filePath))
}
// @from(Ln 381799, Col 0)
async function dgY(A, q) {
    k(`[FileIndex] getProjectFiles called, respectGitignore=${q}`);
    let K = await QgY(A, q);
    if (K !== null) return k(`[FileIndex] using git ls-files result (${K.length} files)`), K;
    k("[FileIndex] git ls-files returned null, falling back to ripgrep");
    let Y = Date.now(),
        z = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!q) z.push("--no-ignore-vcs");
    let w = (await yV(z, ".", A)).map(($) => OD.relative(G1(), $)),
        O = Date.now() - Y;
    return k(`[FileIndex] ripgrep: ${w.length} files in ${O}ms`), d("tengu_file_suggestions_ripgrep", {
        file_count: w.length,
        duration_ms: O
    }), w
}
// @from(Ln 381814, Col 0)
async function cgY() {
    let A = AbortSignal.timeout(1e4);
    try {
        let q = mA(),
            K = X1(),
            Y = q.respectGitignore ?? K.respectGitignore ?? !0,
            z = G1(),
            [_, w] = await Promise.all([dgY(A, Y), UgY(z)]),
            O = [..._, ...w],
            H = [...fQ8(O), ...O],
            j = [],
            J = await ggY();
        if (J) try {
            J.loadFromFileList(H)
        } catch (M) {
            k(`[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${_1(M)}`), _6(M), j = H
        } else j = H;
        return {
            fileIndex: J,
            fileList: j
        }
    } catch (q) {
        return _6(q), {
            fileIndex: null,
            fileList: []
        }
    }
}
// @from(Ln 381843, Col 0)
function lgY(A, q) {
    let K = Math.min(A.length, q.length),
        Y = 0;
    while (Y < K && A[Y] === q[Y]) Y++;
    return A.substring(0, Y)
}
// @from(Ln 381850, Col 0)
function D3q(A) {
    if (A.length === 0) return "";
    let q = A.map((Y) => Y.displayText),
        K = q[0];
    for (let Y = 1; Y < q.length; Y++) {
        let z = q[Y];
        if (K = lgY(K, z), K === "") return ""
    }
    return K
}
// @from(Ln 381861, Col 0)
function li6(A, q) {
    return {
        id: `file-${A}`,
        displayText: A,
        metadata: q !== void 0 ? {
            score: q
        } : void 0
    }
}
// @from(Ln 381870, Col 0)
async function igY(A, q, K) {
    if (A) try {
        return A.search(K, Jv6).map((H) => li6(H.path, H.score))
    } catch ($) {
        k(`[FileIndex] Rust search failed, falling back to Fuse.js: ${_1($)}`), _6($)
    }
    k("[FileIndex] Using Fuse.js fallback for search");
    let Y = [...new Set(q)];
    if (!K) {
        let $ = new Set;
        for (let H of Y) {
            let j = H.split(OD.sep)[0];
            if (j) {
                if ($.add(j), $.size >= Jv6) break
            }
        }
        return [...$].sort().map(li6)
    }
    let z = Y.map(($) => {
            return {
                path: $,
                filename: OD.basename($),
                testPenalty: $.includes("test") ? 1 : 0
            }
        }),
        _ = K.lastIndexOf(OD.sep);
    if (_ > 2) z = z.filter(($) => {
        return $.path.substring(0, _).startsWith(K.substring(0, _))
    });
    let O = new Wh(z, {
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
        limit: Jv6
    });
    return O = O.sort(($, H) => {
        if ($.score === void 0 || H.score === void 0) return 0;
        if (Math.abs($.score - H.score) > 0.05) return $.score - H.score;
        return $.item.testPenalty - H.item.testPenalty
    }), O.map(($) => $.item.path).slice(0, Jv6).map(li6)
}
// @from(Ln 381919, Col 0)
function PQ8() {
    if (!lz6) {
        let A = Mv6,
            q = Date.now();
        lz6 = cgY().then((K) => {
            if (A !== Mv6) return K;
            Dv6 = K.fileIndex, Xv6 = K.fileList, lz6 = null;
            let Y = K.fileIndex ? "rust index" : `${K.fileList.length} files`;
            return k(`[FileIndex] cache refresh completed in ${Date.now()-q}ms (${Y})`), K
        }).catch((K) => {
            if (k(`[FileIndex] Cache refresh failed: ${_1(K)}`), _6(K), A === Mv6) lz6 = null;
            return {
                fileIndex: null,
                fileList: []
            }
        })
    }
}
// @from(Ln 381937, Col 0)
async function ngY() {
    let A = $1(),
        q = G1();
    try {
        return (await A.readdir(q)).map((Y) => {
            let z = OD.join(q, Y.name),
                _ = OD.relative(q, z);
            return Y.isDirectory() ? _ + OD.sep : _
        })
    } catch (K) {
        return _6(K), []
    }
}
// @from(Ln 381950, Col 0)
async function TQ8(A, q = !1) {
    if (!A && !q) return [];
    if (mA().fileSuggestion?.type === "command") {
        let Y = {
            ...$w(),
            query: A
        };
        return (await vQ8(Y)).slice(0, Jv6).map(li6)
    }
    if (A === "" || A === "." || A === "./") {
        let Y = await ngY();
        return PQ8(), Y.slice(0, Jv6).map(li6)
    }
    let K = Date.now();
    try {
        let Y = Dv6 || Xv6.length > 0;
        if (Y) PQ8();
        else if (PQ8(), lz6) await lz6;
        let z = A,
            _ = "." + OD.sep;
        if (A.startsWith(_)) z = A.substring(2);
        if (z.startsWith("~")) z = L4(z);
        let w = await igY(Dv6, Xv6, z),
            O = Date.now() - K;
        return k(`[FileIndex] generateFileSuggestions: ${w.length} results in ${O}ms (cache ${Y?"hit":"miss"})`), d("tengu_file_suggestions_query", {
            duration_ms: O,
            cache_hit: !!Y,
            result_count: w.length,
            query_length: A.length
        }), w
    } catch (Y) {
        return _6(Y), []
    }
}
// @from(Ln 381985, Col 0)
function vy1(A, q, K, Y, z, _) {
    let w = typeof A === "string" ? A : A.displayText,
        O = q.substring(0, Y) + w + q.substring(Y + K.length);
    z(O);
    let $ = Y + w.length;
    _($)
}
// @from(Ln 381992, Col 4)
J3q
// @from(Ln 381992, Col 9)
di6 = null
// @from(Ln 381993, Col 4)
fy1 = !1
// @from(Ln 381994, Col 4)
Dv6 = null
// @from(Ln 381995, Col 4)
Xv6
// @from(Ln 381995, Col 9)
lz6 = null
// @from(Ln 381996, Col 4)
Mv6 = 0
// @from(Ln 381997, Col 4)
ci6 = null
// @from(Ln 381998, Col 4)
WQ8 = null
// @from(Ln 381999, Col 4)
Ty1 = null
// @from(Ln 382000, Col 4)
jv6
// @from(Ln 382000, Col 9)
ZQ8 = null
// @from(Ln 382001, Col 4)
GQ8 = null
// @from(Ln 382002, Col 4)
Jv6 = 15
// @from(Ln 382003, Col 4)
ii6 = E(() => {
    Zy1();
    k1();
    SA();
    lA();
    td();
    F9();
    k8();
    jy();
    H1();
    $5();
    hw();
    i8();
    Eq();
    V1();
    s8();
    J3q = t(Kq6(), 1);
    Xv6 = [], jv6 = []
})
// @from(Ln 382026, Col 0)
function ogY() {
    return `IMPORTANT: This message and these instructions are NOT part of the actual user conversation. Do NOT include any references to "documentation updates", "magic docs", or these update instructions in the document content.

Based on the user conversation above (EXCLUDING this documentation update instruction message), update the Magic Doc file to incorporate any NEW learnings, insights, or information that would be valuable to preserve.

The file {{docPath}} has already been read for you. Here are its current contents:
<current_doc_content>
{{docContents}}
</current_doc_content>

Document title: {{docTitle}}
{{customInstructions}}

Your ONLY task is to use the Edit tool to update the documentation file if there is substantial new information to add, then stop. You can make multiple edits (update multiple sections as needed) - make all Edit tool calls in parallel in a single message. If there's nothing substantial to add, simply respond with a brief explanation and do not call any tools.

CRITICAL RULES FOR EDITING:
- Preserve the Magic Doc header exactly as-is: # MAGIC DOC: {{docTitle}}
- If there's an italicized line immediately after the header, preserve it exactly as-is
- Keep the document CURRENT with the latest state of the codebase - this is NOT a changelog or history
- Update information IN-PLACE to reflect the current state - do NOT append historical notes or track changes over time
- Remove or replace outdated information rather than adding "Previously..." or "Updated to..." notes
- Clean up or DELETE sections that are no longer relevant or don't align with the document's purpose
- Fix obvious errors: typos, grammar mistakes, broken formatting, incorrect information, or confusing statements
- Keep the document well organized: use clear headings, logical section order, consistent formatting, and proper nesting

DOCUMENTATION PHILOSOPHY - READ CAREFULLY:
- BE TERSE. High signal only. No filler words or unnecessary elaboration.
- Documentation is for OVERVIEWS, ARCHITECTURE, and ENTRY POINTS - not detailed code walkthroughs
- Do NOT duplicate information that's already obvious from reading the source code
- Do NOT document every function, parameter, or line number reference
- Focus on: WHY things exist, HOW components connect, WHERE to start reading, WHAT patterns are used
- Skip: detailed implementation steps, exhaustive API docs, play-by-play narratives

What TO document:
- High-level architecture and system design
- Non-obvious patterns, conventions, or gotchas
- Key entry points and where to start reading code
- Important design decisions and their rationale
- Critical dependencies or integration points
- References to related files, docs, or code (like a wiki) - help readers navigate to relevant context

What NOT to document:
- Anything obvious from reading the code itself
- Exhaustive lists of files, functions, or parameters
- Step-by-step implementation details
- Low-level code mechanics
- Information already in CLAUDE.md or other project docs

Use the Edit tool with file_path: {{docPath}}

REMEMBER: Only update if there is substantial new information. The Magic Doc header (# MAGIC DOC: {{docTitle}}) must remain unchanged.`
}
// @from(Ln 382078, Col 0)
async function agY() {
    let A = $1(),
        q = rgY(c8(), "magic-docs", "prompt.md");
    try {
        return await A.readFile(q, {
            encoding: "utf-8"
        })
    } catch {
        return ogY()
    }
}
// @from(Ln 382090, Col 0)
function sgY(A, q) {
    return A.replace(/\{\{(\w+)\}\}/g, (K, Y) => Object.prototype.hasOwnProperty.call(q, Y) ? q[Y] : K)
}
// @from(Ln 382093, Col 0)
async function P3q(A, q, K, Y) {
    let z = await agY(),
        _ = Y ? `

DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS:
The document author has provided specific instructions for how this file should be updated. Pay extra attention to these instructions and follow them carefully:

"${Y}"

These instructions take priority over the general rules below. Make sure your updates align with these specific guidelines.` : "";
    return sgY(z, {
        docContents: A,
        docPath: q,
        docTitle: K,
        customInstructions: _
    })
}
// @from(Ln 382110, Col 4)
W3q = E(() => {
    SA();
    A8()
})
// @from(Ln 382115, Col 0)
function Z3q() {
    ni6.clear()
}
// @from(Ln 382119, Col 0)
function AFY(A) {
    let q = A.match(tgY);
    if (!q || !q[1]) return null;
    let K = q[1].trim(),
        Y = q.index + q[0].length,
        _ = A.slice(Y).match(/^\s*\n(?:\s*\n)?(.+?)(?:\n|$)/);
    if (_ && _[1]) {
        let O = _[1].match(egY);
        if (O && O[1]) {
            let $ = O[1].trim();
            return {
                title: K,
                instructions: $
            }
        }
    }
    return {
        title: K
    }
}
// @from(Ln 382140, Col 0)
function qFY() {
    return {
        agentType: "magic-docs",
        whenToUse: "Update Magic Docs",
        tools: [R4],
        model: "sonnet",
        source: "built-in",
        baseDir: "built-in",
        getSystemPrompt: () => ""
    }
}
// @from(Ln 382151, Col 0)
async function KFY(A, q) {
    let {
        messages: K,
        systemPrompt: Y,
        userContext: z,
        systemContext: _,
        toolUseContext: w
    } = q, O = DI(w.readFileState), $ = {
        ...w,
        readFileState: O
    }, H = $1();
    try {
        await H.stat(A.path)
    } catch (W) {
        if (W.code === "ENOENT") {
            ni6.delete(A.path);
            return
        }
        throw W
    }
    let j = await L9.call({
            file_path: A.path
        }, $),
        J = "",
        M = j.data;
    if (M.type === "text") J = M.file.content;
    let D = AFY(J);
    if (!D) {
        ni6.delete(A.path);
        return
    }
    let X = await P3q(J, A.path, D.title, D.instructions),
        P = async (W, Z) => {
            if (W.name === R4 && typeof Z === "object" && Z !== null && "file_path" in Z) {
                let G = Z.file_path;
                if (typeof G === "string" && G === A.path) return {
                    behavior: "allow",
                    updatedInput: Z
                }
            }
            return {
                behavior: "deny",
                message: `only ${R4} is allowed for ${A.path}`,
                decisionReason: {
                    type: "other",
                    reason: `only ${R4} is allowed`
                }
            }
        };
    for await (let W of qh({
        agentDefinition: qFY(),
        promptMessages: [p1({
            content: X
        })],
        toolUseContext: $,
        canUseTool: P,
        isAsync: !0,
        forkContextMessages: K,
        querySource: "magic_docs",
        override: {
            systemPrompt: Y,
            userContext: z,
            systemContext: _
        },
        availableTools: $.options.tools
    }));
}
// @from(Ln 382218, Col 0)
async function G3q() {}
// @from(Ln 382219, Col 4)
tgY
// @from(Ln 382219, Col 9)
egY
// @from(Ln 382219, Col 14)
ni6
// @from(Ln 382219, Col 19)
EHO
// @from(Ln 382220, Col 4)
NQ8 = E(() => {
    SA();
    RI();
    W3q();
    nY6();
    xi6();
    tP();
    JA();
    RI();
    tgY = /^#\s*MAGIC\s+DOC:\s*(.+)$/im, egY = /^[_*](.+?)[_*]\s*$/m, ni6 = new Map;
    EHO = Bu(async function(A) {
        let {
            messages: q,
            querySource: K
        } = A;
        if (K !== "repl_main_thread") return;
        if (ri6(q)) return;
        if (ni6.size === 0) return;
        for (let _ of Array.from(ni6.values())) await KFY(_, A)
    })
})
// @from(Ln 382241, Col 4)
kQ8 = {}
// @from(Ln 382246, Col 0)
function VQ8(A = new Set) {
    let q = A.size > 0;
    if (a2.cache.clear?.(), mw.cache.clear?.(), sf8.cache.clear?.(), M3q(), oB(), !q) R54();
    if (t14(null), dw6(null), gl(), ef4(), Cn4(), !q) qi4();
    if (v58(), f3q(), !q) a24();
    iu1(A), l57(), E94(), Oa4(), Z3q(), c54(), Promise.resolve().then(() => (Fg8(), r6q)).then(({
        clearWebFetchCache: K
    }) => K()), Promise.resolve().then(() => (pP1(), d94)).then(({
        clearToolSearchDescriptionCache: K
    }) => K()), Promise.resolve().then(() => (J0(), g24)).then(({
        clearAgentDefinitionsCache: K
    }) => K()), Promise.resolve().then(() => (Q36(), s94)).then(({
        clearPromptCache: K
    }) => K())
}
// @from(Ln 382261, Col 4)
Ny1 = E(() => {
    D$();
    bv();
    T1();
    ii6();
    bt();
    nE1();
    Sc();
    HV1();
    bf6();
    yG();
    jZ();
    $e();
    yo();
    od();
    AT6();
    NQ8();
    hN8()
})
// @from(Ln 382280, Col 4)
T3q = {}
// @from(Ln 382287, Col 0)
async function EQ8({
    setMessages: A,
    readFileState: q,
    getAppState: K,
    setAppState: Y,
    setConversationId: z
}) {
    let _ = LQ8();
    await RQ8("clear", {
        getAppState: K,
        setAppState: Y,
        signal: AbortSignal.timeout(_),
        timeoutMs: _
    });
    let w = new Set,
        O = [],
        $ = (j) => ("isBackgrounded" in j) && j.isBackgrounded === !1;
    if (K)
        for (let j of Object.values(K().tasks)) {
            if ($(j)) continue;
            if (Sf(j)) w.add(j.agentId), O.push(j);
            else if (M$(j)) w.add(j.identity.agentId)
        }
    if (A(() => []), z) z(YFY());
    if (VQ8(w), VO(AA()), q.clear(), Y) Y((j) => {
        let J = {};
        for (let [M, D] of Object.entries(j.tasks)) {
            if (!$(D)) {
                J[M] = D;
                continue
            }
            try {
                if (D.status === "running") {
                    if (Gf(D)) {
                        if (D.shellCommand?.kill(), D.shellCommand?.cleanup(), D.cleanupTimeoutId) clearTimeout(D.cleanupTimeoutId)
                    }
                    if ("abortController" in D) D.abortController?.abort();
                    if ("unregisterCleanup" in D) D.unregisterCleanup?.()
                }
            } catch (X) {
                _6(X)
            }
            $O(M)
        }
        return {
            ...j,
            tasks: J,
            attribution: g06(),
            standaloneAgentContext: void 0,
            fileHistory: {
                snapshots: [],
                trackedFiles: new Set,
                snapshotSequence: 0
            },
            mcp: {
                clients: [],
                tools: [],
                commands: [],
                resources: {},
                pluginReconnectKey: j.mcp.pluginReconnectKey
            }
        }
    });
    e34(), ai6(), ix1({
        setCurrentAsParent: !0
    }), await Zh();
    for (let j of O) {
        if (j.status !== "running") continue;
        Co(j.id, L0(X$(j.agentId)))
    }
    let H = await C0("clear");
    if (H.length > 0) A(() => H)
}
// @from(Ln 382360, Col 4)
yQ8 = E(() => {
    T1();
    WR();
    Oq();
    y66();
    hw();
    rH();
    Ny1();
    QP();
    SM();
    k1();
    xd();
    Vb()
})
// @from(Ln 382374, Col 4)
v3q = {}
// @from(Ln 382378, Col 4)
zFY = async (A, q) => {
    return await EQ8(q), {
        type: "text",
        value: ""
    }
}
// @from(Ln 382384, Col 4)
N3q = E(() => {
    yQ8()
})
// @from(Ln 382387, Col 4)
_FY
// @from(Ln 382387, Col 9)
hQ8
// @from(Ln 382388, Col 4)
V3q = E(() => {
    _FY = {
        type: "local",
        name: "clear",
        description: "Clear conversation history and free up context",
        aliases: ["reset", "new"],
        isEnabled: () => !0,
        isHidden: !1,
        supportsNonInteractive: !1,
        load: () => Promise.resolve().then(() => (N3q(), v3q)),
        userFacingName() {
            return "clear"
        }
    }, hQ8 = _FY
})
// @from(Ln 382403, Col 4)
k3q = {}
// @from(Ln 382407, Col 0)
async function OFY(A, q, K) {
    if ($Y()) return A("Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader.", {
        display: "system"
    }), null;
    if (!K || K.trim() === "") {
        let w = s$.join(", ");
        return A(`Please provide a color. Available colors: ${w}, default`, {
            display: "system"
        }), null
    }
    let Y = K.trim().toLowerCase();
    if (wFY.includes(Y)) {
        let w = R1(),
            O = Cz();
        return await Vy1(w, "default", O), q.setAppState(($) => ({
            ...$,
            standaloneAgentContext: {
                ...$.standaloneAgentContext,
                name: $.standaloneAgentContext?.name ?? "",
                color: void 0
            }
        })), A("Session color reset to default", {
            display: "system"
        }), null
    }
    if (!s$.includes(Y)) {
        let w = s$.join(", ");
        return A(`Invalid color "${Y}". Available colors: ${w}, default`, {
            display: "system"
        }), null
    }
    let z = R1(),
        _ = Cz();
    return await Vy1(z, Y, _), q.setAppState((w) => ({
        ...w,
        standaloneAgentContext: {
            ...w.standaloneAgentContext,
            name: w.standaloneAgentContext?.name ?? "",
            color: Y
        }
    })), A(`Session color set to: ${Y}`, {
        display: "system"
    }), null
}
// @from(Ln 382451, Col 4)
wFY
// @from(Ln 382452, Col 4)
E3q = E(() => {
    Oq();
    T1();
    H0();
    zz();
    wFY = ["default", "reset", "none", "gray", "grey"]
})
// @from(Ln 382459, Col 4)
$FY
// @from(Ln 382459, Col 9)
SQ8
// @from(Ln 382460, Col 4)
y3q = E(() => {
    $FY = {
        type: "local-jsx",
        name: "color",
        description: "Set the prompt bar color for this session",
        isEnabled: () => !0,
        isHidden: !1,
        immediate: !0,
        argumentHint: "<color|default>",
        load: () => Promise.resolve().then(() => (E3q(), k3q)),
        userFacingName() {
            return "color"
        }
    }, SQ8 = $FY
})
// @from(Ln 382475, Col 4)
HFY
// @from(Ln 382475, Col 9)
L3q
// @from(Ln 382475, Col 14)
R3q
// @from(Ln 382476, Col 4)
h3q = E(() => {
    t46();
    HFY = F6(() => K4.object({
        entries: K4.record(K4.string(), K4.string()),
        entryChecksums: K4.record(K4.string(), K4.string()).optional()
    })), L3q = F6(() => K4.object({
        organizationId: K4.string(),
        repo: K4.string(),
        version: K4.number(),
        lastModified: K4.string(),
        checksum: K4.string(),
        content: HFY()
    })), R3q = F6(() => K4.object({
        error: K4.object({
            details: K4.object({
                error_code: K4.literal("team_memory_too_many_entries"),
                max_entries: K4.number().int().positive(),
                received_entries: K4.number().int().positive()
            })
        })
    }))
})
// @from(Ln 382514, Col 0)
function C3q() {
    return {
        lastKnownChecksum: null,
        serverChecksums: new Map,
        serverMaxEntries: null
    }
}
// @from(Ln 382522, Col 0)
function GFY(A) {
    return "sha256:" + DFY("sha256").update(A, "utf8").digest("hex")
}
// @from(Ln 382526, Col 0)
function I3q(A) {
    return A instanceof Error && "code" in A && typeof A.code === "string"
}
// @from(Ln 382530, Col 0)
function xQ8() {
    if (QA() !== "firstParty" || !ax()) return !1;
    let A = sA();
    return Boolean(A?.accessToken && A.scopes?.includes(ZV) && A.scopes.includes(pp))
}
// @from(Ln 382536, Col 0)
function uQ8(A) {
    return `${process.env.TEAM_MEMORY_SYNC_URL||P7().BASE_API_URL}/api/claude_code/team_memory?repo=${encodeURIComponent(A)}`
}
// @from(Ln 382540, Col 0)
function mQ8() {
    let A = sA();
    if (A?.accessToken) return {
        headers: {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": DP,
            "User-Agent": pO()
        }
    };
    return {
        error: "No OAuth token available for team memory sync"
    }
}
// @from(Ln 382553, Col 0)
async function fFY(A, q, K) {
    try {
        await dz();
        let Y = mQ8();
        if (Y.error) return {
            success: !1,
            error: Y.error,
            skipRetry: !0,
            errorType: "auth"
        };
        let z = {
            ...Y.headers
        };
        if (K) z["If-None-Match"] = `"${K.replace(/"/g,"")}"`;
        let _ = uQ8(q),
            w = await X8.get(_, {
                headers: z,
                timeout: bQ8,
                validateStatus: (H) => H === 200 || H === 304 || H === 404
            });
        if (w.status === 304) return k("team-memory-sync: not modified (304)", {
            level: "debug"
        }), {
            success: !0,
            notModified: !0,
            checksum: K ?? void 0
        };
        if (w.status === 404) return k("team-memory-sync: no remote data (404)", {
            level: "debug"
        }), A.lastKnownChecksum = null, {
            success: !0,
            isEmpty: !0
        };
        let O = L3q().safeParse(w.data);
        if (!O.success) return k("team-memory-sync: invalid response format", {
            level: "warn"
        }), {
            success: !1,
            error: "Invalid team memory response format",
            skipRetry: !0,
            errorType: "parse"
        };
        let $ = O.data.checksum || w.headers.etag?.replace(/^"|"$/g, "") || void 0;
        if ($) A.lastKnownChecksum = $;
        return k(`team-memory-sync: fetched successfully (checksum: ${$??"none"})`, {
            level: "debug"
        }), {
            success: !0,
            data: O.data,
            isEmpty: !1,
            checksum: $
        }
    } catch (Y) {
        if (X8.isAxiosError(Y)) {
            let z = Y.response?.status,
                _ = JSON.stringify(Y.response?.data ?? "");
            if (k(`team-memory-sync: fetch error ${z}: ${_}`, {
                    level: "warn"
                }), z === 401 || z === 403) return {
                success: !1,
                error: `Not authorized for team memory sync: ${_}`,
                skipRetry: !0,
                errorType: "auth",
                httpStatus: z
            };
            if (Y.code === "ECONNABORTED") return {
                success: !1,
                error: "Team memory sync request timeout",
                errorType: "timeout"
            };
            if (Y.code === "ECONNREFUSED" || Y.code === "ENOTFOUND") return {
                success: !1,
                error: "Cannot connect to server",
                errorType: "network"
            };
            return {
                success: !1,
                error: Y.message,
                errorType: "unknown",
                httpStatus: z
            }
        }
        return {
            success: !1,
            error: Y instanceof Error ? Y.message : "Unknown error",
            errorType: "unknown"
        }
    }
}
// @from(Ln 382642, Col 0)
async function TFY(A, q) {
    try {
        await dz();
        let K = mQ8();
        if (K.error) return {
            success: !1,
            error: K.error,
            errorType: "auth"
        };
        let Y = uQ8(q) + "&view=hashes",
            z = await X8.get(Y, {
                headers: K.headers,
                timeout: bQ8,
                validateStatus: (O) => O === 200 || O === 404
            });
        if (z.status === 404) return A.lastKnownChecksum = null, {
            success: !0,
            entryChecksums: {}
        };
        let _ = z.data?.checksum || z.headers.etag?.replace(/^"|"$/g, ""),
            w = z.data?.entryChecksums;
        if (!w || typeof w !== "object") return {
            success: !1,
            error: "Server did not return entryChecksums (?view=hashes unsupported)",
            errorType: "parse"
        };
        if (_) A.lastKnownChecksum = _;
        return {
            success: !0,
            version: z.data?.version,
            checksum: _,
            entryChecksums: w
        }
    } catch (K) {
        if (X8.isAxiosError(K)) {
            let Y = K.response?.status;
            if (Y === 401 || Y === 403) return {
                success: !1,
                error: "Not authorized",
                errorType: "auth",
                httpStatus: Y
            };
            if (K.code === "ECONNABORTED") return {
                success: !1,
                error: "Timeout",
                errorType: "timeout"
            };
            if (K.code === "ECONNREFUSED" || K.code === "ENOTFOUND") return {
                success: !1,
                error: "Network error",
                errorType: "network"
            };
            return {
                success: !1,
                error: K.message,
                errorType: "unknown",
                httpStatus: Y
            }
        }
        return {
            success: !1,
            error: K instanceof Error ? K.message : "Unknown error",
            errorType: "unknown"
        }
    }
}
// @from(Ln 382708, Col 0)
async function vFY(A, q, K) {
    let Y = null;
    for (let z = 1; z <= CQ8 + 1; z++) {
        if (Y = await fFY(A, q, K), Y.success || Y.skipRetry) return Y;
        if (z > CQ8) return Y;
        let _ = VI(z);
        k(`team-memory-sync: retry ${z}/${CQ8}`, {
            level: "debug"
        }), await new Promise((w) => setTimeout(w, _))
    }
    return Y
}
// @from(Ln 382720, Col 0)
async function NFY(A, q, K, Y) {
    try {
        await dz();
        let z = mQ8();
        if (z.error) return {
            success: !1,
            error: z.error,
            errorType: "auth"
        };
        let _ = {
            ...z.headers,
            "Content-Type": "application/json"
        };
        if (Y) _["If-Match"] = `"${Y.replace(/"/g,"")}"`;
        let w = uQ8(q),
            O = await X8.put(w, {
                entries: K
            }, {
                headers: _,
                timeout: bQ8,
                validateStatus: (H) => H === 200 || H === 412
            });
        if (O.status === 412) return k("team-memory-sync: conflict (412 Precondition Failed)", {
            level: "info"
        }), {
            success: !1,
            conflict: !0,
            error: "ETag mismatch"
        };
        let $ = O.data?.checksum;
        if ($) A.lastKnownChecksum = $;
        return k(`team-memory-sync: uploaded ${Object.keys(K).length} entries (checksum: ${$??"none"})`, {
            level: "debug"
        }), {
            success: !0,
            checksum: $,
            lastModified: O.data?.lastModified
        }
    } catch (z) {
        let _ = X8.isAxiosError(z) ? JSON.stringify(z.response?.data ?? "") : "";
        k(`team-memory-sync: upload failed: ${z instanceof Error?z.message:""} ${_}`, {
            level: "warn"
        });
        let w = "unknown",
            O, $, H, j;
        if (X8.isAxiosError(z)) {
            if (O = z.response?.status, O === 401 || O === 403) w = "auth";
            else if (z.code === "ECONNABORTED") w = "timeout";
            else if (z.code === "ECONNREFUSED" || z.code === "ENOTFOUND") w = "network";
            if (O === 413) {
                let J = R3q().safeParse(z.response?.data);
                if (J.success) $ = J.data.error.details.error_code, H = J.data.error.details.max_entries, j = J.data.error.details.received_entries
            }
        }
        return {
            success: !1,
            error: z instanceof Error ? z.message : "Unknown error",
            errorType: w,
            httpStatus: O,
            ...$ !== void 0 && {
                serverErrorCode: $
            },
            ...H !== void 0 && {
                serverMaxEntries: H
            },
            ...j !== void 0 && {
                serverReceivedEntries: j
            }
        }
    }
}
// @from(Ln 382791, Col 0)
async function VFY(A) {
    let q = Lk(),
        K = {},
        Y = [];
    async function z(w) {
        try {
            let O = await XFY(w, {
                withFileTypes: !0
            });
            await Promise.all(O.map(async ($) => {
                let H = jFY(w, $.name);
                if ($.isDirectory()) await z(H);
                else if ($.isFile()) try {
                    let j = await ZFY(H);
                    if (j.size > IQ8) {
                        k(`team-memory-sync: skipping oversized file ${$.name} (${j.size} > ${IQ8} bytes)`, {
                            level: "info"
                        });
                        return
                    }
                    let J = await S3q(H, "utf8"),
                        M = JFY(q, H).replaceAll("\\", "/"),
                        D = lm8(J);
                    if (D.length > 0) {
                        let X = D[0];
                        Y.push({
                            path: M,
                            ruleId: X.ruleId,
                            label: X.label
                        }), k(`team-memory-sync: skipping "${M}" — detected ${X.label}`, {
                            level: "warn"
                        });
                        return
                    }
                    K[M] = J
                } catch {}
            }))
        } catch (O) {
            if (I3q(O)) {
                if (O.code !== "ENOENT" && O.code !== "EACCES" && O.code !== "EPERM") throw O
            } else throw O
        }
    }
    await z(q);
    let _ = Object.keys(K).sort();
    if (A !== null && _.length > A) {
        let w = _.slice(A);
        k(`team-memory-sync: ${_.length} local entries exceeds server cap of ${A}; ${w.length} file(s) will NOT sync: ${w.join(", ")}. Consider consolidating or removing some team memory files.`, {
            level: "warn"
        }), d("tengu_team_mem_entries_capped", {
            total_entries: _.length,
            dropped_count: w.length,
            max_entries: A
        });
        let O = {};
        for (let $ of _.slice(0, A)) O[$] = K[$];
        return {
            entries: O,
            skippedSecrets: Y
        }
    }
    return {
        entries: K,
        skippedSecrets: Y
    }
}
// @from(Ln 382857, Col 0)
async function kFY(A) {
    let q = 0;
    for (let [K, Y] of Object.entries(A)) {
        let z;
        try {
            z = await Ff8(K)
        } catch (w) {
            if (w instanceof MX) {
                k(`team-memory-sync: ${w.message}`, {
                    level: "warn"
                });
                continue
            }
            throw w
        }
        if (Buffer.byteLength(Y, "utf8") > IQ8) {
            k(`team-memory-sync: skipping oversized remote entry "${K}"`, {
                level: "info"
            });
            continue
        }
        try {
            if (await S3q(z, "utf8") === Y) continue
        } catch (w) {
            if (I3q(w) && w.code !== "ENOENT" && w.code !== "ENOTDIR") k(`team-memory-sync: unexpected read error for "${K}": ${w.code}`, {
                level: "debug"
            })
        }
        try {
            let w = z.substring(0, z.lastIndexOf(MFY));
            await PFY(w, {
                recursive: !0
            }), await WFY(z, Y, "utf8"), q++
        } catch {
            k(`team-memory-sync: failed to write "${K}"`, {
                level: "warn"
            })
        }
    }
    return q
}
// @from(Ln 382899, Col 0)
function b3q() {
    return xQ8()
}
// @from(Ln 382902, Col 0)
async function x3q(A, q) {
    let K = q?.skipEtagCache ?? !1,
        Y = Date.now();
    if (!xQ8()) return d("tengu_team_mem_sync_pull", {
        success: !1,
        files_written: 0,
        not_modified: !1,
        duration_ms: Date.now() - Y,
        errorType: "no_oauth"
    }), {
        success: !1,
        filesWritten: 0,
        entryCount: 0,
        error: "OAuth not available"
    };
    let z = await ho();
    if (!z) return d("tengu_team_mem_sync_pull", {
        success: !1,
        files_written: 0,
        not_modified: !1,
        duration_ms: Date.now() - Y,
        errorType: "no_repo"
    }), {
        success: !1,
        filesWritten: 0,
        entryCount: 0,
        error: "No git remote found"
    };
    let _ = K ? null : A.lastKnownChecksum,
        w = await vFY(A, z, _);
    if (!w.success) return d("tengu_team_mem_sync_pull", {
        success: !1,
        files_written: 0,
        not_modified: !1,
        duration_ms: Date.now() - Y,
        ...w.errorType && {
            errorType: w.errorType
        },
        ...w.httpStatus && {
            status: w.httpStatus
        }
    }), {
        success: !1,
        filesWritten: 0,
        entryCount: 0,
        error: w.error
    };
    if (w.notModified) return d("tengu_team_mem_sync_pull", {
        success: !0,
        files_written: 0,
        not_modified: !0,
        duration_ms: Date.now() - Y
    }), {
        success: !0,
        filesWritten: 0,
        entryCount: 0,
        notModified: !0
    };
    if (w.isEmpty || !w.data) return A.serverChecksums.clear(), d("tengu_team_mem_sync_pull", {
        success: !0,
        files_written: 0,
        not_modified: !1,
        duration_ms: Date.now() - Y
    }), {
        success: !0,
        filesWritten: 0,
        entryCount: 0
    };
    let O = w.data.content.entries,
        $ = w.data.content.entryChecksums;
    if (A.serverChecksums.clear(), $)
        for (let [j, J] of Object.entries($)) A.serverChecksums.set(j, J);
    else k("team-memory-sync: server response missing entryChecksums (pre-#283027 deploy) — next push will be full, not delta", {
        level: "debug"
    });
    let H = await kFY(O);
    if (H > 0) {
        let {
            getMemoryFiles: j
        } = await Promise.resolve().then(() => (lM(), s14));
        j.cache.clear?.()
    }
    return k(`team-memory-sync: pulled ${H} files`, {
        level: "info"
    }), d("tengu_team_mem_sync_pull", {
        success: !0,
        files_written: H,
        not_modified: !1,
        duration_ms: Date.now() - Y
    }), {
        success: !0,
        filesWritten: H,
        entryCount: Object.keys(O).length
    }
}
// @from(Ln 382997, Col 0)
async function BQ8(A) {
    let q = Date.now(),
        K = 0;
    if (!xQ8()) return d("tengu_team_mem_sync_push", {
        success: !1,
        files_uploaded: 0,
        conflict: !1,
        conflict_retries: 0,
        duration_ms: Date.now() - q,
        errorType: "no_oauth"
    }), {
        success: !1,
        filesUploaded: 0,
        error: "OAuth not available"
    };
    let Y = await ho();
    if (!Y) return d("tengu_team_mem_sync_push", {
        success: !1,
        files_uploaded: 0,
        conflict: !1,
        conflict_retries: 0,
        duration_ms: Date.now() - q,
        errorType: "no_repo"
    }), {
        success: !1,
        filesUploaded: 0,
        error: "No git remote found"
    };
    let z = await VFY(A.serverMaxEntries),
        _ = z.entries,
        w = z.skippedSecrets;
    if (w.length > 0) {
        let H = w.map((j) => `"${j.path}" (${j.label})`).join(", ");
        k(`team-memory-sync: ${w.length} file(s) skipped due to detected secrets: ${H}. Remove the secret(s) to enable sync for these files.`, {
            level: "warn"
        }), d("tengu_team_mem_secret_skipped", {
            file_count: w.length,
            rule_ids: w.map((j) => j.ruleId).join(",")
        })
    }
    let O = new Map;
    for (let [H, j] of Object.entries(_)) O.set(H, GFY(j));
    let $ = !1;
    for (let H = 0; H <= ky1; H++) {
        let j = {};
        for (let [X, P] of O)
            if (A.serverChecksums.get(X) !== P) j[X] = _[X];
        let J = Object.keys(j).length;
        if (J === 0) return d("tengu_team_mem_sync_push", {
            success: !0,
            files_uploaded: 0,
            conflict: $,
            conflict_retries: K,
            duration_ms: Date.now() - q
        }), {
            success: !0,
            filesUploaded: 0,
            ...w.length > 0 && {
                skippedSecrets: w
            }
        };
        let M = await NFY(A, Y, j, A.lastKnownChecksum);
        if (M.success) {
            for (let [X, P] of O)
                if (X in j) A.serverChecksums.set(X, P);
            return k(`team-memory-sync: pushed ${J} of ${O.size} files (delta)`, {
                level: "info"
            }), d("tengu_team_mem_sync_push", {
                success: !0,
                files_uploaded: J,
                conflict: $,
                conflict_retries: K,
                duration_ms: Date.now() - q
            }), {
                success: !0,
                filesUploaded: J,
                checksum: M.checksum,
                ...w.length > 0 && {
                    skippedSecrets: w
                }
            }
        }
        if (!M.conflict) {
            if (M.serverMaxEntries !== void 0) A.serverMaxEntries = M.serverMaxEntries, k(`team-memory-sync: learned server max_entries=${M.serverMaxEntries} from 413; next push will truncate to this`, {
                level: "warn"
            });
            return d("tengu_team_mem_sync_push", {
                success: !1,
                files_uploaded: 0,
                conflict: !1,
                conflict_retries: K,
                duration_ms: Date.now() - q,
                ...M.errorType && {
                    errorType: M.errorType
                },
                ...M.httpStatus && {
                    status: M.httpStatus
                },
                ...M.serverErrorCode && {
                    error_code: M.serverErrorCode
                },
                ...M.serverMaxEntries !== void 0 && {
                    server_max_entries: M.serverMaxEntries
                },
                ...M.serverReceivedEntries !== void 0 && {
                    server_received_entries: M.serverReceivedEntries
                }
            }), {
                success: !1,
                filesUploaded: 0,
                error: M.error
            }
        }
        if ($ = !0, H >= ky1) return k(`team-memory-sync: giving up after ${ky1} conflict retries`, {
            level: "warn"
        }), d("tengu_team_mem_sync_push", {
            success: !1,
            files_uploaded: 0,
            conflict: !0,
            conflict_retries: K,
            duration_ms: Date.now() - q,
            errorType: "conflict"
        }), {
            success: !1,
            filesUploaded: 0,
            conflict: !0,
            error: "Conflict resolution failed after retries"
        };
        K++, k(`team-memory-sync: conflict (412), probing server hashes (attempt ${H+1}/${ky1})`, {
            level: "info"
        });
        let D = await TFY(A, Y);
        if (!D.success || !D.entryChecksums) return d("tengu_team_mem_sync_push", {
            success: !1,
            files_uploaded: 0,
            conflict: !0,
            conflict_retries: K,
            duration_ms: Date.now() - q,
            errorType: "conflict"
        }), {
            success: !1,
            filesUploaded: 0,
            conflict: !0,
            error: `Conflict resolution hashes probe failed: ${D.error}`
        };
        A.serverChecksums.clear();
        for (let [X, P] of Object.entries(D.entryChecksums)) A.serverChecksums.set(X, P)
    }
    return d("tengu_team_mem_sync_push", {
        success: !1,
        files_uploaded: 0,
        conflict: !1,
        conflict_retries: K,
        duration_ms: Date.now() - q
    }), {
        success: !1,
        filesUploaded: 0,
        error: "Unexpected end of conflict resolution loop"
    }
}
// @from(Ln 383157, Col 4)
bQ8 = 15000
// @from(Ln 383158, Col 4)
IQ8 = 250000
// @from(Ln 383159, Col 4)
CQ8 = 3
// @from(Ln 383160, Col 4)
ky1 = 2
// @from(Ln 383161, Col 4)
u3q = E(() => {
    kK();
    Rk();
    $5();
    RM();
    fA();
    F5();
    Nz();
    F5();
    H1();
    V1();
    Ud();
    h3q();
    im8()
})
// @from(Ln 383176, Col 4)
FQ8 = {}
// @from(Ln 383183, Col 0)
async function RFY() {
    if (!$16) return;
    Ey1 = !0;
    try {
        let A = await BQ8($16);
        if (A.success) yy1 = !1;
        if (A.success && A.filesUploaded > 0) k(`team-memory-watcher: pushed ${A.filesUploaded} files`, {
            level: "info"
        });
        else if (!A.success) k(`team-memory-watcher: push failed: ${A.error}`, {
            level: "warn"
        })
    } catch (A) {
        k(`team-memory-watcher: push error: ${_1(A)}`, {
            level: "warn"
        })
    } finally {
        Ey1 = !1, ti6 = null
    }
}
// @from(Ln 383204, Col 0)
function si6() {
    if (yy1 = !0, iz6) clearTimeout(iz6);
    iz6 = setTimeout(() => {
        if (Ey1) {
            si6();
            return
        }
        ti6 = RFY()
    }, LFY)
}
// @from(Ln 383214, Col 0)
async function hFY() {
    if (gQ8) return;
    gQ8 = !0;
    let A = Lk();
    O16 = (await Promise.resolve().then(() => (F46(), e31))).default.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        awaitWriteFinish: {
            stabilityThreshold: EFY,
            pollInterval: yFY
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), O16.on("add", si6), O16.on("change", si6), O16.on("unlink", si6), k(`team-memory-watcher: watching ${A}`, {
        level: "debug"
    }), E4(async () => m3q())
}
// @from(Ln 383232, Col 0)
async function SFY() {
    if (!SD1() || !b3q()) return;
    if (!await ho()) {
        k("team-memory-watcher: no github.com remote, skipping sync", {
            level: "debug"
        });
        return
    }
    $16 = C3q();
    let q = !1,
        K = 0,
        Y = !1;
    try {
        let z = await x3q($16);
        if (q = z.success, Y = z.entryCount > 0, z.success && z.filesWritten > 0) K = z.filesWritten, k(`team-memory-watcher: initial pull got ${z.filesWritten} files`, {
            level: "info"
        })
    } catch (z) {
        k(`team-memory-watcher: initial pull failed: ${_1(z)}`, {
            level: "warn"
        })
    }
    await hFY(), d("tengu_team_mem_sync_started", {
        initial_pull_success: q,
        initial_files_pulled: K,
        watcher_started: !0,
        server_has_content: Y
    })
}
// @from(Ln 383261, Col 0)
async function CFY() {
    if (!$16) return;
    si6()
}
// @from(Ln 383265, Col 0)
async function m3q() {
    if (iz6) clearTimeout(iz6), iz6 = null;
    if (O16) await O16.close(), O16 = null;
    if (ti6) try {
        await ti6
    } catch {}
    if (yy1 && $16) try {
        await BQ8($16)
    } catch {}
}
// @from(Ln 383276, Col 0)
function IFY(A) {
    O16 = null, iz6 = null, Ey1 = !1, yy1 = !1, ti6 = null, gQ8 = A?.skipWatcher ?? !1, $16 = A?.syncState ?? null
}
// @from(Ln 383279, Col 4)
EFY = 500
// @from(Ln 383280, Col 4)
yFY = 100
// @from(Ln 383281, Col 4)
LFY = 2000
// @from(Ln 383282, Col 4)
O16 = null
// @from(Ln 383283, Col 4)
iz6 = null
// @from(Ln 383284, Col 4)
Ey1 = !1
// @from(Ln 383285, Col 4)
yy1 = !1
// @from(Ln 383286, Col 4)
ti6 = null
// @from(Ln 383287, Col 4)
gQ8 = !1
// @from(Ln 383288, Col 4)
$16 = null
// @from(Ln 383289, Col 4)
pQ8 = E(() => {
    Rk();
    H1();
    V1();
    KY();
    u3q();
    s8();
    $5()
})
// @from(Ln 383298, Col 4)
Q3q = {}
// @from(Ln 383304, Col 0)
function F3q(A, q) {
    switch (A) {
        case s7: {
            let K = L9.inputSchema.safeParse(q);
            return K.success ? K.data.file_path : null
        }
        case R4: {
            let K = lV1().safeParse(q);
            if (K.success) return K.data.file_path;
            let Y = Wa4().safeParse(q);
            return Y.success ? Y.data.file_path : null
        }
        case _K: {
            let K = xX.inputSchema.safeParse(q);
            return K.success ? K.data.file_path : null
        }
        default:
            return null
    }
}
// @from(Ln 383325, Col 0)
function p3q(A, q) {
    switch (A) {
        case s7: {
            let K = L9.inputSchema.safeParse(q);
            if (!K.success) return null;
            return Dp6(K.data.file_path)
        }
        case N9: {
            let K = bb.inputSchema.safeParse(q);
            if (!K.success) return null;
            if (K.data.path) {
                let Y = Dp6(K.data.path);
                if (Y) return Y
            }
            if (K.data.glob) {
                let Y = RP1(K.data.glob);
                if (Y) return Y
            }
            return null
        }
        case qz: {
            let K = rg.inputSchema.safeParse(q);
            if (!K.success) return null;
            if (K.data.path) {
                let z = Dp6(K.data.path);
                if (z) return z
            }
            let Y = RP1(K.data.pattern);
            if (Y) return Y;
            return null
        }
        default:
            return null
    }
}
// @from(Ln 383361, Col 0)
function UQ8(A, q) {
    if (p3q(A, q) === "session_memory") return !0;
    let K = F3q(A, q);
    if (K && (fW6(K) || g3q.isTeamMemFile(K))) return !0;
    return !1
}
// @from(Ln 383367, Col 0)
async function bFY(A, q, K) {
    if (A.hook_event_name !== "PostToolUse") return {};
    let Y = p3q(A.tool_name, A.tool_input),
        z = Bc4(),
        _ = z ? {
            subagent_name: z
        } : {};
    if (Y === "session_memory") d("tengu_session_memory_accessed", {
        ..._
    });
    else if (Y === "session_transcript") d("tengu_transcript_accessed", {
        ..._
    });
    let w = F3q(A.tool_name, A.tool_input);
    if (w && fW6(w)) switch (d("tengu_memdir_accessed", {
            tool: A.tool_name,
            ..._
        }), A.tool_name) {
        case s7:
            d("tengu_memdir_file_read", {
                ..._
            });
            break;
        case R4:
            d("tengu_memdir_file_edit", {
                ..._
            });
            break;
        case _K:
            d("tengu_memdir_file_write", {
                ..._
            });
            break
    }
    if (w && g3q.isTeamMemFile(w)) switch (d("tengu_team_mem_accessed", {
            tool: A.tool_name,
            ..._
        }), A.tool_name) {
        case s7:
            d("tengu_team_mem_file_read", {
                ..._
            });
            break;
        case R4:
            d("tengu_team_mem_file_edit", {
                ..._
            }), B3q?.notifyTeamMemoryWrite();
            break;
        case _K:
            d("tengu_team_mem_file_write", {
                ..._
            }), B3q?.notifyTeamMemoryWrite();
            break
    }
    return {}
}
// @from(Ln 383424, Col 0)
function xFY() {
    let A = {
        type: "callback",
        callback: bFY,
        timeout: 1,
        internal: !0
    };
    KA6({
        PostToolUse: [{
            matcher: s7,
            hooks: [A]
        }, {
            matcher: N9,
            hooks: [A]
        }, {
            matcher: qz,
            hooks: [A]
        }, {
            matcher: R4,
            hooks: [A]
        }, {
            matcher: _K,
            hooks: [A]
        }]
    })
}
// @from(Ln 383450, Col 4)
g3q
// @from(Ln 383450, Col 9)
B3q
// @from(Ln 383451, Col 4)
dQ8 = E(() => {
    T1();
    V1();
    J_();
    uP();
    Q$();
    RI();
    KT6();
    Ll6();
    El6();
    c66();
    hP1();
    P66();
    g3q = (Rk(), k4(Ld)), B3q = (pQ8(), k4(FQ8))
})
// @from(Ln 383467, Col 0)
function U3q() {
    return !1
}
// @from(Ln 383470, Col 4)
nz6 = E(() => {
    xd();
    k8();
    A8()
})
// @from(Ln 383480, Col 0)
function Pv6() {
    if (gw6() === "remote") {
        let w = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
        if (w) {
            let O = process.env.SESSION_INGRESS_URL;
            if (!PV1(w, O)) {
                let $ = hZ(w, O);
                return {
                    commit: $,
                    pr: $
                }
            }
        }
        return {
            commit: "",
            pr: ""
        }
    }
    let A = cK(),
        q = ei6(A) !== null,
        K = s84() || q ? cQ8(A) : "Claude Opus 4.6",
        Y = `\uD83E\uDD16 Generated with [Claude Code](${XV1})`,
        z = `Co-Authored-By: ${K} <noreply@anthropic.com>`,
        _ = mA();
    if (_.attribution) return {
        commit: _.attribution.commit ?? z,
        pr: _.attribution.pr ?? Y
    };
    if (_.includeCoAuthoredBy === !1) return {
        commit: "",
        pr: ""
    };
    return {
        commit: z,
        pr: Y
    }
}
// @from(Ln 383518, Col 0)
function d3q(A) {
    for (let q of h81)
        if (A.includes(`<${q}>`)) return !0;
    return !1
}
// @from(Ln 383524, Col 0)
function BFY(A) {
    let q = 0;
    for (let K of A) {
        if (K.type !== "user") continue;
        let Y = K.message?.content;
        if (!Y) continue;
        let z = !1;
        if (typeof Y === "string") {
            if (d3q(Y)) continue;
            z = Y.trim().length > 0
        } else if (Array.isArray(Y)) z = Y.some((_) => {
            if (!_ || typeof _ !== "object" || !("type" in _)) return !1;
            return _.type === "text" && typeof _.text === "string" && !d3q(_.text) || _.type === "image" || _.type === "document"
        });
        if (z) q++
    }
    return q
}
// @from(Ln 383543, Col 0)
function gFY(A) {
    let q = A.filter((K) => K.type === "user" && !(("isSidechain" in K) && K.isSidechain));
    return BFY(q)
}
// @from(Ln 383547, Col 0)
async function FFY(A) {
    let q = A.attribution;
    if (!q) return 0;
    let K = q.fileStates,
        Y = K instanceof Map;
    if ((Y ? K.size : Object.keys(K).length) === 0) return 0;
    let _ = Y ? Array.from(K.keys()) : Object.keys(K);
    if (_.length === 0) return 0;
    try {
        return (await AA4([q], _)).summary.claudePercent
    } catch (w) {
        return _6(w), 0
    }
}
// @from(Ln 383562, Col 0)
function QFY(A) {
    let q = 0;
    for (let K of A) {
        if (K.type !== "assistant") continue;
        let Y = K.message?.content;
        if (!Array.isArray(Y)) continue;
        for (let z of Y) {
            if (z.type !== "tool_use" || !pFY.has(z.name)) continue;
            if (UQ8(z.name, z.input)) q++
        }
    }
    return q
}
// @from(Ln 383575, Col 0)
async function UFY() {
    try {
        let A = Cz(),
            q = (await mFY(A)).size,
            K = await F81(A, q),
            Y = K ? K.postBoundaryBuf : await uFY(A),
            z = cx(Y),
            _ = z.findLastIndex((O) => O.type === "system" && ("subtype" in O) && O.subtype === "compact_boundary"),
            w = _ >= 0 ? z.slice(_ + 1) : z;
        return {
            promptCount: gFY(w),
            memoryAccessCount: QFY(w)
        }
    } catch {
        return {
            promptCount: 0,
            memoryAccessCount: 0
        }
    }
}
// @from(Ln 383595, Col 0)
async function c3q(A) {
    if (gw6() === "remote") {
        let M = process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
        if (M) {
            let D = process.env.SESSION_INGRESS_URL;
            if (!PV1(M, D)) return hZ(M, D)
        }
        return ""
    }
    let q = mA();
    if (q.attribution?.pr) return q.attribution.pr;
    if (q.includeCoAuthoredBy === !1) return "";
    let K = `\uD83E\uDD16 Generated with [Claude Code](${XV1})`,
        Y = A();
    if (k(`PR Attribution: appState.attribution exists: ${!!Y.attribution}`), Y.attribution) {
        let M = Y.attribution.fileStates,
            X = M instanceof Map ? M.size : Object.keys(M).length;
        k(`PR Attribution: fileStates count: ${X}`)
    }
    let [z, {
        promptCount: _,
        memoryAccessCount: w
    }] = await Promise.all([FFY(Y), UFY()]);
    k(`PR Attribution: claudePercent: ${z}, promptCount: ${_}, memoryAccessCount: ${w}`);
    let O = IY(cK()),
        H = await t84() ? O : e84(O);
    if (z === 0 && _ === 0 && w === 0) return k("PR Attribution: returning default (no data)"), K;
    let j = w > 0 ? `, ${w} ${w===1?"memory":"memories"} recalled` : "",
        J = `\uD83E\uDD16 Generated with [Claude Code](${XV1}) (${z}% ${_}-shotted by ${H}${j})`;
    return k(`PR Attribution: returning enhanced: ${J}`), J
}
// @from(Ln 383626, Col 4)
pFY
// @from(Ln 383627, Col 4)
Ly1 = E(() => {
    T1();
    i8();
    z4();
    Oq();
    K_();
    cL6();
    xd();
    dQ8();
    k1();
    H1();
    vz();
    J_();
    uP();
    Q$();
    nz6();
    pFY = new Set([s7, N9, qz, R4, _K])
})
// @from(Ln 383646, Col 0)
function dFY() {
    let {
        commit: A
    } = Pv6();
    return `${""}## Context

- Current git status: !\`git status\`
- Current git diff (staged and unstaged changes): !\`git diff HEAD\`
- Current branch: !\`git branch --show-current\`
- Recent commits: !\`git log --oneline -10\`

## Git Safety Protocol

- NEVER update the git config
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- CRITICAL: ALWAYS create NEW commits. NEVER use git commit --amend, unless the user explicitly requests it
- Do not commit files that likely contain secrets (.env, credentials.json, etc). Warn the user if they specifically request to commit those files
- If there are no changes to commit (i.e., no untracked files and no modifications), do not create an empty commit
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported

## Your task

Based on the above changes, create a single git commit:

1. Analyze all staged changes and draft a commit message:
   - Look at the recent commits above to follow this repository's commit message style
   - Summarize the nature of the changes (new feature, enhancement, bug fix, refactoring, test, docs, etc.)
   - Ensure the message accurately reflects the changes and their purpose (i.e. "add" means a wholly new feature, "update" means an enhancement to an existing feature, "fix" means a bug fix, etc.)
   - Draft a concise (1-2 sentences) commit message that focuses on the "why" rather than the "what"

2. Stage relevant files and create the commit using HEREDOC syntax:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${A?`

${A}`:""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. Stage and create the commit using a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.`
}
// @from(Ln 383688, Col 4)
l3q
// @from(Ln 383688, Col 9)
cFY
// @from(Ln 383688, Col 14)
i3q
// @from(Ln 383689, Col 4)
n3q = E(() => {
    TW6();
    Ly1();
    nz6();
    l3q = ["Bash(git add:*)", "Bash(git status:*)", "Bash(git commit:*)"];
    cFY = {
        type: "prompt",
        name: "commit",
        description: "Create a git commit",
        allowedTools: l3q,
        contentLength: 0,
        isEnabled: () => !0,
        isHidden: !1,
        progressMessage: "creating commit",
        userFacingName() {
            return "commit"
        },
        source: "builtin",
        async getPromptForCommand(A, q) {
            let K = dFY();
            return [{
                type: "text",
                text: await uB(K, {
                    ...q,
                    getAppState() {
                        let z = q.getAppState();
                        return {
                            ...z,
                            toolPermissionContext: {
                                ...z.toolPermissionContext,
                                alwaysAllowRules: {
                                    ...z.toolPermissionContext.alwaysAllowRules,
                                    command: l3q
                                }
                            }
                        }
                    }
                }, "/commit")
            }]
        }
    }, i3q = cFY
})
// @from(Ln 383731, Col 4)
e3q = {}
// @from(Ln 383747, Col 0)
function rFY(A) {
    return A.filter((q) => q.type === "text" && q.text).map((q) => q.text).join(`

`)
}
// @from(Ln 383753, Col 0)
function oFY(A) {
    let q = l9.lexer(Ne(A)),
        K = [];
    for (let Y of q)
        if (Y.type === "code") {
            let z = Y;
            K.push({
                code: z.text,
                lang: z.lang
            })
        } return K
}
// @from(Ln 383766, Col 0)
function s3q(A) {
    if (A) {
        let q = A.replace(/[^a-zA-Z0-9]/g, "");
        if (q && q !== "plaintext") return `.${q}`
    }
    return ".txt"
}
// @from(Ln 383773, Col 0)
async function t3q(A, q) {
    let K = o3q(r3q, q);
    return await lFY(r3q, {
        recursive: !0
    }), await iFY(K, A, "utf-8"), K
}
// @from(Ln 383779, Col 0)
async function lQ8(A, q) {
    if (await ZZ(A)) {
        let Y = A.split(`
`).length;
        return `Copied to clipboard (${A.length} characters, ${Y} lines)`
    }
    try {
        let Y = await t3q(A, q);
        return `${C96()}
Written to ${Y}`
    } catch {
        return C96()
    }
}
// @from(Ln 383794, Col 0)
function aFY(A, q) {
    let K = A.split(`
`)[0] ?? "";
    if (f8(K) <= q) return K;
    let Y = "",
        z = 0,
        _ = q - 1;
    for (let w of K) {
        let O = f8(w);
        if (z + O > _) break;
        Y += w, z += O
    }
    return Y + "…"
}
// @from(Ln 383809, Col 0)
function sFY(A) {
    let q = A6(34),
        {
            fullText: K,
            codeBlocks: Y,
            onDone: z
        } = A,
        _ = TE.useRef("full"),
        w = K.length,
        O;
    if (q[0] !== K) O = K.split(`
`), q[0] = K, q[1] = O;
    else O = q[1];
    let $ = `${w} chars, ${O.length} lines`,
        H;
    if (q[2] !== $) H = {
        label: "Full response",
        value: "full",
        description: $
    }, q[2] = $, q[3] = H;
    else H = q[3];
    let j;
    if (q[4] !== Y || q[5] !== H) {
        let u;
        if (q[7] === Symbol.for("react.memo_cache_sentinel")) u = {
            label: "Always copy full response",
            value: "always",
            description: "Skip this picker in the future (revert via /config)"
        }, q[7] = u;
        else u = q[7];
        j = [H, ...Y.map(eFY), u], q[4] = Y, q[5] = H, q[6] = j
    } else j = q[6];
    let J = j,
        M;
    if (q[8] !== Y || q[9] !== K) M = function(I) {
        if (I === "full" || I === "always") return {
            text: K,
            filename: a3q
        };
        let g = Y[I];
        return {
            text: g.code,
            filename: `copy${s3q(g.lang)}`,
            blockIndex: I
        }
    }, q[8] = Y, q[9] = K, q[10] = M;
    else M = q[10];
    let D = M,
        X;
    if (q[11] !== Y.length || q[12] !== D || q[13] !== z) X = async function(I) {
        let g = D(I);
        if (I === "always") {
            if (!X1().copyFullResponse) d1(tFY);
            d("tengu_copy", {
                block_count: Y.length,
                always: !0
            });
            let b = await lQ8(g.text, g.filename);
            z(`${b}
Preference saved. Use /config to change copyFullResponse`);
            return
        }
        d("tengu_copy", {
            selected_block: g.blockIndex,
            block_count: Y.length
        });
        let B = await lQ8(g.text, g.filename);
        z(B)
    }, q[11] = Y.length, q[12] = D, q[13] = z, q[14] = X;
    else X = q[14];
    let P = X,
        W;
    if (q[15] !== Y.length || q[16] !== D || q[17] !== z) W = async function(I) {
        let g = D(I);
        d("tengu_copy", {
            selected_block: g.blockIndex,
            block_count: Y.length,
            write_shortcut: !0
        });
        try {
            let B = await t3q(g.text, g.filename);
            z(`Written to ${B}`)
        } catch (B) {
            let b = B;
            z(`Failed to write file: ${b instanceof Error?b.message:b}`)
        }
    }, q[15] = Y.length, q[16] = D, q[17] = z, q[18] = W;
    else W = q[18];
    let Z = W,
        G;
    if (q[19] !== Z) G = (u) => {
        if (u === "w") Z(_.current)
    }, q[19] = Z, q[20] = G;
    else G = q[20];
    jA(G);
    let f;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) f = TE.default.createElement(T, {
        dimColor: !0
    }, "Select content to copy:"), q[21] = f;
    else f = q[21];
    let v;
    if (q[22] === Symbol.for("react.memo_cache_sentinel")) v = (u) => {
        _.current = u
    }, q[22] = v;
    else v = q[22];
    let N;
    if (q[23] !== P) N = (u) => {
        P(u)
    }, q[23] = P, q[24] = N;
    else N = q[24];
    let V;
    if (q[25] !== z) V = () => {
        z("Copy cancelled", {
            display: "system"
        })
    }, q[25] = z, q[26] = V;
    else V = q[26];
    let L;
    if (q[27] !== J || q[28] !== N || q[29] !== V) L = TE.default.createElement(T8, {
        options: J,
        hideIndexes: !1,
        onFocus: v,
        onChange: N,
        onCancel: V
    }), q[27] = J, q[28] = N, q[29] = V, q[30] = L;
    else L = q[30];
    let h;
    if (q[31] === Symbol.for("react.memo_cache_sentinel")) h = TE.default.createElement(T, {
        dimColor: !0
    }, TE.default.createElement(C8, null, TE.default.createElement(a1, {
        shortcut: "enter",
        action: "copy"
    }), TE.default.createElement(a1, {
        shortcut: "w",
        action: "write to file"
    }), TE.default.createElement(a1, {
        shortcut: "esc",
        action: "cancel"
    }))), q[31] = h;
    else h = q[31];
    let R;
    if (q[32] !== L) R = TE.default.createElement(S3, null, TE.default.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, f, L, h)), q[32] = L, q[33] = R;
    else R = q[33];
    return R
}
// @from(Ln 383958, Col 0)
function tFY(A) {
    return {
        ...A,
        copyFullResponse: !0
    }
}
// @from(Ln 383965, Col 0)
function eFY(A, q) {
    return {
        label: aFY(A.code, 60),
        value: q,
        description: [A.lang, A.code.split(`
`).length > 1 ? `${A.code.split(`
`).length} lines` : void 0].filter(Boolean).join(", ") || void 0
    }
}
// @from(Ln 383974, Col 4)
TE
// @from(Ln 383974, Col 8)
r3q
// @from(Ln 383974, Col 13)
a3q = "response.md"
// @from(Ln 383975, Col 4)
ApY = async (A, q) => {
        let K = bX(q.messages);
        if (!K) return A("No assistant message to copy"), null;
        let Y = K.message.content;
        if (!Array.isArray(Y) || Y.length === 0) return A("No content to copy"), null;
        let z = rFY(Y);
        if (!z) return A("No text content to copy"), null;
        let _ = oFY(z),
            w = X1();
        if (_.length === 0 || w.copyFullResponse) {
            d("tengu_copy", {
                always: w.copyFullResponse,
                block_count: _.length
            });
            let O = await lQ8(z, a3q);
            return A(O), null
        }
        return TE.default.createElement(sFY, {
            fullText: z,
            codeBlocks: _,
            onDone: A
        })
    }
// @from(Ln 383998, Col 4)
A9q = E(() => {
    e6();
    i6();
    HF6();
    FJ();
    vc();
    JA();
    v3();
    Lq();
    Xq();
    q3();
    V1();
    k8();
    TE = t(P6(), 1), r3q = o3q(nFY(), "claude")
})
// @from(Ln 384013, Col 4)
qpY
// @from(Ln 384013, Col 9)
iQ8
// @from(Ln 384014, Col 4)
q9q = E(() => {
    qpY = {
        type: "local-jsx",
        name: "copy",
        description: "Copy Claude's last response or a code block to clipboard",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (A9q(), e3q)),
        userFacingName() {
            return "copy"
        }
    }, iQ8 = qpY
})
// @from(Ln 384028, Col 0)
function Ul(A) {
    let q = A6(10),
        {
            message: K,
            bold: Y,
            dimColor: z,
            subtitle: _
        } = A,
        w = Y === void 0 ? !1 : Y,
        O = z === void 0 ? !1 : z,
        $;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) $ = Wv6.default.createElement(Wq, null), q[0] = $;
    else $ = q[0];
    let H;
    if (q[1] !== w || q[2] !== O || q[3] !== K) H = Wv6.default.createElement(m, {
        flexDirection: "row"
    }, $, Wv6.default.createElement(T, {
        bold: w,
        dimColor: O
    }, " ", K)), q[1] = w, q[2] = O, q[3] = K, q[4] = H;
    else H = q[4];
    let j;
    if (q[5] !== _) j = _ && Wv6.default.createElement(T, {
        dimColor: !0
    }, _), q[5] = _, q[6] = j;
    else j = q[6];
    let J;
    if (q[7] !== H || q[8] !== j) J = Wv6.default.createElement(m, {
        flexDirection: "column"
    }, H, j), q[7] = H, q[8] = j, q[9] = J;
    else J = q[9];
    return J
}
// @from(Ln 384061, Col 4)
Wv6
// @from(Ln 384062, Col 4)
Zv6 = E(() => {
    e6();
    i6();
    LO();
    Wv6 = t(P6(), 1)
})
// @from(Ln 384075, Col 0)
function nQ8() {
    let A = [process.argv[1] || "", process.execPath || ""],
        q = ["/build-ant/", "/build-ant-native/", "/build-external/", "/build-external-native/"];
    return A.some((K) => q.some((Y) => K.includes(Y)))
}
// @from(Ln 384081, Col 0)
function _pY(A) {
    let q = nQ8() ? "claude-dev" : "claude",
        K = new URL(`${q}://resume`);
    return K.searchParams.set("session", A), K.searchParams.set("cwd", G1()), K.toString()
}
// @from(Ln 384086, Col 0)
async function K9q() {
    if (nQ8()) return !0;
    let A = process.platform;
    if (A === "darwin") return uK("/Applications/Claude.app");
    else if (A === "linux") {
        let {
            code: q,
            stdout: K
        } = await z8("xdg-mime", ["query", "default", "x-scheme-handler/claude"]);
        return q === 0 && K.trim().length > 0
    } else if (A === "win32") {
        let {
            code: q
        } = await z8("reg", ["query", "HKEY_CLASSES_ROOT\\claude", "/ve"]);
        return q === 0
    }
    return !1
}
// @from(Ln 384104, Col 0)
async function wpY() {
    let A = process.platform;
    if (A === "darwin") {
        let {
            code: q,
            stdout: K
        } = await z8("defaults", ["read", "/Applications/Claude.app/Contents/Info.plist", "CFBundleShortVersionString"]);
        if (q !== 0) return null;
        let Y = K.trim();
        return Y.length > 0 ? Y : null
    } else if (A === "win32") {
        let q = process.env.LOCALAPPDATA;
        if (!q) return null;
        let K = KpY(q, "AnthropicClaude");
        try {
            let z = (await YpY(K)).filter((_) => _.startsWith("app-")).map((_) => _.slice(4)).filter((_) => An6.coerce(_) !== null).sort((_, w) => {
                let O = An6.coerce(_),
                    $ = An6.coerce(w);
                return O.compare($)
            });
            return z.length > 0 ? z[z.length - 1] : null
        } catch {
            return null
        }
    }
    return null
}
// @from(Ln 384131, Col 0)
async function Y9q() {
    if (!await K9q()) return {
        status: "not-installed"
    };
    let q;
    try {
        q = await wpY()
    } catch {
        return {
            status: "ready",
            version: "unknown"
        }
    }
    if (!q) return {
        status: "ready",
        version: "unknown"
    };
    let K = An6.coerce(q);
    if (!K || !BM(K.version, zpY)) return {
        status: "version-too-old",
        version: q
    };
    return {
        status: "ready",
        version: q
    }
}
// @from(Ln 384158, Col 0)
async function OpY(A) {
    let q = process.platform;
    if (k(`Opening deep link: ${A}`), q === "darwin") {
        if (nQ8()) {
            let {
                code: Y
            } = await z8("osascript", ["-e", `tell application "Electron" to open location "${A}"`]);
            return Y === 0
        }
        let {
            code: K
        } = await z8("open", [A]);
        return K === 0
    } else if (q === "linux") {
        let {
            code: K
        } = await z8("xdg-open", [A]);
        return K === 0
    } else if (q === "win32") {
        let {
            code: K
        } = await z8("cmd", ["/c", "start", "", A]);
        return K === 0
    }
    return !1
}
// @from(Ln 384184, Col 0)
async function z9q() {
    let A = R1();
    if (!await K9q()) return {
        success: !1,
        error: "Claude Desktop is not installed. Install it from https://claude.ai/download"
    };
    let K = _pY(A);
    if (!await OpY(K)) return {
        success: !1,
        error: "Failed to open Claude Desktop. Please try opening it manually.",
        deepLinkUrl: K
    };
    return {
        success: !0,
        deepLinkUrl: K
    }
}
// @from(Ln 384201, Col 4)
An6
// @from(Ln 384201, Col 9)
zpY = "1.1.2396"
// @from(Ln 384202, Col 4)
_9q = E(() => {
    Z7();
    Eq();
    T1();
    lA();
    H1();
    An6 = t(lD6(), 1)
})
// @from(Ln 384211, Col 0)
function $pY() {
    switch (process.platform) {
        case "win32":
            return "https://claude.ai/api/desktop/win32/x64/exe/latest/redirect";
        default:
            return "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect"
    }
}
// @from(Ln 384220, Col 0)
function Ry1(A) {
    let q = A6(20),
        {
            onDone: K
        } = A,
        [Y, z] = TN.useState("checking"),
        [_, w] = TN.useState(null),
        [O, $] = TN.useState(""),
        H;
    if (q[0] !== _ || q[1] !== K || q[2] !== Y) H = (W) => {
        if (Y === "error") {
            K(_ ?? "Unknown error", {
                display: "system"
            });
            return
        }
        if (Y === "prompt-download") {
            if (W === "y" || W === "Y") R9($pY()).catch(jpY), K(`Starting download. Re-run /desktop once you’ve installed the app.
Learn more at ${w9q}`, {
                display: "system"
            });
            else if (W === "n" || W === "N") K(`The desktop app is required for /desktop. Learn more at ${w9q}`, {
                display: "system"
            })
        }
    }, q[0] = _, q[1] = K, q[2] = Y, q[3] = H;
    else H = q[3];
    jA(H);
    let j, J;
    if (q[4] !== K) j = () => {
        (async function() {
            z("checking");
            let G = await Y9q();
            if (G.status === "not-installed") {
                $("Claude Desktop is not installed."), z("prompt-download");
                return
            }
            if (G.status === "version-too-old") {
                $(`Claude Desktop needs to be updated (found v${G.version}, need v1.1.2396+).`), z("prompt-download");
                return
            }
            z("flushing"), await jF(), z("opening");
            let f = await z9q();
            if (!f.success) {
                w(f.error ?? "Failed to open Claude Desktop"), z("error");
                return
            }
            z("success"), setTimeout(HpY, 500, K)
        })().catch((Z) => {
            w(_1(Z)), z("error")
        })
    }, J = [K], q[4] = K, q[5] = j, q[6] = J;
    else j = q[5], J = q[6];
    if (TN.useEffect(j, J), Y === "error") {
        let W;
        if (q[7] !== _) W = TN.default.createElement(T, {
            color: "error"
        }, "Error: ", _), q[7] = _, q[8] = W;
        else W = q[8];
        let Z;
        if (q[9] === Symbol.for("react.memo_cache_sentinel")) Z = TN.default.createElement(T, {
            dimColor: !0
        }, "Press any key to continue…"), q[9] = Z;
        else Z = q[9];
        let G;
        if (q[10] !== W) G = TN.default.createElement(m, {
            flexDirection: "column",
            paddingX: 2
        }, W, Z), q[10] = W, q[11] = G;
        else G = q[11];
        return G
    }
    if (Y === "prompt-download") {
        let W;
        if (q[12] !== O) W = TN.default.createElement(T, null, O), q[12] = O, q[13] = W;
        else W = q[13];
        let Z;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) Z = TN.default.createElement(T, null, "Download now? (y/n)"), q[14] = Z;
        else Z = q[14];
        let G;
        if (q[15] !== W) G = TN.default.createElement(m, {
            flexDirection: "column",
            paddingX: 2
        }, W, Z), q[15] = W, q[16] = G;
        else G = q[16];
        return G
    }
    let M;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) M = {
        checking: "Checking for Claude Desktop…",
        flushing: "Saving session…",
        opening: "Opening Claude Desktop…",
        success: "Opening in Claude Desktop…"
    }, q[17] = M;
    else M = q[17];
    let X = M[Y],
        P;
    if (q[18] !== X) P = TN.default.createElement(Ul, {
        message: X
    }), q[18] = X, q[19] = P;
    else P = q[19];
    return P
}
// @from(Ln 384323, Col 0)
async function HpY(A) {
    A("Session transferred to Claude Desktop", {
        display: "system"
    }), await Vq(0, "other")
}
// @from(Ln 384329, Col 0)
function jpY() {}
// @from(Ln 384330, Col 4)
TN
// @from(Ln 384330, Col 8)
w9q = "https://clau.de/desktop"
// @from(Ln 384331, Col 4)
rQ8 = E(() => {
    e6();
    i6();
    Zv6();
    _9q();
    kX();
    Oq();
    c_();
    s8();
    TN = t(P6(), 1)
})
// @from(Ln 384342, Col 4)
$9q = {}
// @from(Ln 384346, Col 0)
async function JpY(A) {
    return O9q.default.createElement(Ry1, {
        onDone: A
    })
}
// @from(Ln 384351, Col 4)
O9q
// @from(Ln 384352, Col 4)
H9q = E(() => {
    rQ8();
    O9q = t(P6(), 1)
})
// @from(Ln 384357, Col 0)
function j9q() {
    if (process.platform === "darwin") return !0;
    if (process.platform === "win32" && process.arch === "x64") return !0;
    return !1
}
// @from(Ln 384362, Col 4)
MpY
// @from(Ln 384362, Col 9)
J9q
// @from(Ln 384363, Col 4)
M9q = E(() => {
    MpY = {
        type: "local-jsx",
        name: "desktop",
        aliases: ["app"],
        description: "Continue the current session in Claude Desktop",
        isEnabled: j9q,
        get isHidden() {
            return !j9q()
        },
        load: () => Promise.resolve().then(() => (H9q(), $9q)),
        userFacingName() {
            return "desktop"
        }
    }, J9q = MpY
})
// @from(Ln 384380, Col 0)
function X9q(A, q) {
    let {
        commit: K,
        pr: Y
    } = Pv6(), z = q ?? Y, _ = process.env.SAFEUSER || "", w = process.env.USER || "", O = "", $ = " and `--reviewer anthropics/claude-code`", H = " (and add `--add-reviewer anthropics/claude-code`)", j = `

## Changelog
<!-- CHANGELOG:START -->
[If this PR contains user-facing changes, add a changelog entry here. Otherwise, remove this section.]
<!-- CHANGELOG:END -->`, J = `

5. After creating/updating the PR, check if the user's CLAUDE.md mentions posting to Slack channels. If it does, use ToolSearch to search for "slack send message" tools. If ToolSearch finds a Slack tool, ask the user if they'd like you to post the PR URL to the relevant Slack channel. Only post if the user confirms. If ToolSearch returns no results or errors, skip this step silently—do not mention the failure, do not attempt workarounds, and do not try alternative approaches.`;
    return `${O}## Context

- \`SAFEUSER\`: ${_}
- \`whoami\`: ${w}
- \`git status\`: !\`git status\`
- \`git diff HEAD\`: !\`git diff HEAD\`
- \`git branch --show-current\`: !\`git branch --show-current\`
- \`git diff ${A}...HEAD\`: !\`git diff ${A}...HEAD\`
- \`gh pr view --json number 2>/dev/null || true\`: !\`gh pr view --json number 2>/dev/null || true\`

## Git Safety Protocol

- NEVER update the git config
- NEVER run destructive/irreversible git commands (like push --force, hard reset, etc) unless the user explicitly requests them
- NEVER skip hooks (--no-verify, --no-gpg-sign, etc) unless the user explicitly requests it
- NEVER run force push to main/master, warn the user if they request it
- Do not commit files that likely contain secrets (.env, credentials.json, etc)
- Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported

## Your task

Analyze all changes that will be included in the pull request, making sure to look at all relevant commits (NOT just the latest commit, but ALL commits that will be included in the pull request from the git diff ${A}...HEAD output above).

Based on the above changes:
1. Create a new branch if on ${A} (use SAFEUSER from context above for the branch name prefix, falling back to whoami if SAFEUSER is empty, e.g., \`username/feature-name\`)
2. Create a single commit with an appropriate message using heredoc syntax${K?", ending with the attribution text shown in the example below":""}:
\`\`\`
git commit -m "$(cat <<'EOF'
Commit message here.${K?`

${K}`:""}
EOF
)"
\`\`\`
3. Push the branch to origin
4. If a PR already exists for this branch (check the gh pr view output above), update the PR title and body using \`gh pr edit\` to reflect the current diff${H}. Otherwise, create a pull request using \`gh pr create\` with heredoc syntax for the body${$}.
   - IMPORTANT: Keep PR titles short (under 70 characters). Use the body for details.
\`\`\`
gh pr create --title "Short, descriptive title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
[Bulleted markdown checklist of TODOs for testing the pull request...]${j}${z?`

${z}`:""}
EOF
)"
\`\`\`

You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message.${J}

Return the PR URL when you're done, so the user can see it.`
}
// @from(Ln 384446, Col 4)
D9q
// @from(Ln 384446, Col 9)
DpY
// @from(Ln 384446, Col 14)
P9q