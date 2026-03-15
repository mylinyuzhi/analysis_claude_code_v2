
// @from(Ln 125532, Col 4)
Ab6 = x((Zf3) => {
    var CM = CY(),
        zv = Symbol("break visit"),
        KM7 = Symbol("skip children"),
        Am = Symbol("remove node");

    function Mz1(A, q) {
        let K = YM7(q);
        if (CM.isDocument(A)) {
            if (yM6(null, A.contents, K, Object.freeze([A])) === Am) A.contents = null
        } else yM6(null, A, K, Object.freeze([]))
    }
    Mz1.BREAK = zv;
    Mz1.SKIP = KM7;
    Mz1.REMOVE = Am;

    function yM6(A, q, K, Y) {
        let z = zM7(A, q, K, Y);
        if (CM.isNode(z) || CM.isPair(z)) return _M7(A, Y, z), yM6(A, z, K, Y);
        if (typeof z !== "symbol") {
            if (CM.isCollection(q)) {
                Y = Object.freeze(Y.concat(q));
                for (let _ = 0; _ < q.items.length; ++_) {
                    let w = yM6(_, q.items[_], K, Y);
                    if (typeof w === "number") _ = w - 1;
                    else if (w === zv) return zv;
                    else if (w === Am) q.items.splice(_, 1), _ -= 1
                }
            } else if (CM.isPair(q)) {
                Y = Object.freeze(Y.concat(q));
                let _ = yM6("key", q.key, K, Y);
                if (_ === zv) return zv;
                else if (_ === Am) q.key = null;
                let w = yM6("value", q.value, K, Y);
                if (w === zv) return zv;
                else if (w === Am) q.value = null
            }
        }
        return z
    }
    async function Dz1(A, q) {
        let K = YM7(q);
        if (CM.isDocument(A)) {
            if (await LM6(null, A.contents, K, Object.freeze([A])) === Am) A.contents = null
        } else await LM6(null, A, K, Object.freeze([]))
    }
    Dz1.BREAK = zv;
    Dz1.SKIP = KM7;
    Dz1.REMOVE = Am;
    async function LM6(A, q, K, Y) {
        let z = await zM7(A, q, K, Y);
        if (CM.isNode(z) || CM.isPair(z)) return _M7(A, Y, z), LM6(A, z, K, Y);
        if (typeof z !== "symbol") {
            if (CM.isCollection(q)) {
                Y = Object.freeze(Y.concat(q));
                for (let _ = 0; _ < q.items.length; ++_) {
                    let w = await LM6(_, q.items[_], K, Y);
                    if (typeof w === "number") _ = w - 1;
                    else if (w === zv) return zv;
                    else if (w === Am) q.items.splice(_, 1), _ -= 1
                }
            } else if (CM.isPair(q)) {
                Y = Object.freeze(Y.concat(q));
                let _ = await LM6("key", q.key, K, Y);
                if (_ === zv) return zv;
                else if (_ === Am) q.key = null;
                let w = await LM6("value", q.value, K, Y);
                if (w === zv) return zv;
                else if (w === Am) q.value = null
            }
        }
        return z
    }

    function YM7(A) {
        if (typeof A === "object" && (A.Collection || A.Node || A.Value)) return Object.assign({
            Alias: A.Node,
            Map: A.Node,
            Scalar: A.Node,
            Seq: A.Node
        }, A.Value && {
            Map: A.Value,
            Scalar: A.Value,
            Seq: A.Value
        }, A.Collection && {
            Map: A.Collection,
            Seq: A.Collection
        }, A);
        return A
    }

    function zM7(A, q, K, Y) {
        if (typeof K === "function") return K(A, q, Y);
        if (CM.isMap(q)) return K.Map?.(A, q, Y);
        if (CM.isSeq(q)) return K.Seq?.(A, q, Y);
        if (CM.isPair(q)) return K.Pair?.(A, q, Y);
        if (CM.isScalar(q)) return K.Scalar?.(A, q, Y);
        if (CM.isAlias(q)) return K.Alias?.(A, q, Y);
        return
    }

    function _M7(A, q, K) {
        let Y = q[q.length - 1];
        if (CM.isCollection(Y)) Y.items[A] = K;
        else if (CM.isPair(Y))
            if (A === "key") Y.key = K;
            else Y.value = K;
        else if (CM.isDocument(Y)) Y.contents = K;
        else {
            let z = CM.isAlias(Y) ? "alias" : "scalar";
            throw Error(`Cannot replace node with ${z} parent`)
        }
    }
    Zf3.visit = Mz1;
    Zf3.visitAsync = Dz1
})
// @from(Ln 125648, Col 4)
uz8 = x((Vf3) => {
    var wM7 = CY(),
        Tf3 = Ab6(),
        vf3 = {
            "!": "%21",
            ",": "%2C",
            "[": "%5B",
            "]": "%5D",
            "{": "%7B",
            "}": "%7D"
        },
        Nf3 = (A) => A.replace(/[!,[\]{}]/g, (q) => vf3[q]);
    class TL {
        constructor(A, q) {
            this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, TL.defaultYaml, A), this.tags = Object.assign({}, TL.defaultTags, q)
        }
        clone() {
            let A = new TL(this.yaml, this.tags);
            return A.docStart = this.docStart, A
        }
        atDocument() {
            let A = new TL(this.yaml, this.tags);
            switch (this.yaml.version) {
                case "1.1":
                    this.atNextDocument = !0;
                    break;
                case "1.2":
                    this.atNextDocument = !1, this.yaml = {
                        explicit: TL.defaultYaml.explicit,
                        version: "1.2"
                    }, this.tags = Object.assign({}, TL.defaultTags);
                    break
            }
            return A
        }
        add(A, q) {
            if (this.atNextDocument) this.yaml = {
                explicit: TL.defaultYaml.explicit,
                version: "1.1"
            }, this.tags = Object.assign({}, TL.defaultTags), this.atNextDocument = !1;
            let K = A.trim().split(/[ \t]+/),
                Y = K.shift();
            switch (Y) {
                case "%TAG": {
                    if (K.length !== 2) {
                        if (q(0, "%TAG directive should contain exactly two parts"), K.length < 2) return !1
                    }
                    let [z, _] = K;
                    return this.tags[z] = _, !0
                }
                case "%YAML": {
                    if (this.yaml.explicit = !0, K.length !== 1) return q(0, "%YAML directive should contain exactly one part"), !1;
                    let [z] = K;
                    if (z === "1.1" || z === "1.2") return this.yaml.version = z, !0;
                    else {
                        let _ = /^\d+\.\d+$/.test(z);
                        return q(6, `Unsupported YAML version ${z}`, _), !1
                    }
                }
                default:
                    return q(0, `Unknown directive ${Y}`, !0), !1
            }
        }
        tagName(A, q) {
            if (A === "!") return "!";
            if (A[0] !== "!") return q(`Not a valid tag: ${A}`), null;
            if (A[1] === "<") {
                let _ = A.slice(2, -1);
                if (_ === "!" || _ === "!!") return q(`Verbatim tags aren't resolved, so ${A} is invalid.`), null;
                if (A[A.length - 1] !== ">") q("Verbatim tags must end with a >");
                return _
            }
            let [, K, Y] = A.match(/^(.*!)([^!]*)$/s);
            if (!Y) q(`The ${A} tag has no suffix`);
            let z = this.tags[K];
            if (z) try {
                return z + decodeURIComponent(Y)
            } catch (_) {
                return q(String(_)), null
            }
            if (K === "!") return A;
            return q(`Could not resolve tag: ${A}`), null
        }
        tagString(A) {
            for (let [q, K] of Object.entries(this.tags))
                if (A.startsWith(K)) return q + Nf3(A.substring(K.length));
            return A[0] === "!" ? A : `!<${A}>`
        }
        toString(A) {
            let q = this.yaml.explicit ? [`%YAML ${this.yaml.version||"1.2"}`] : [],
                K = Object.entries(this.tags),
                Y;
            if (A && K.length > 0 && wM7.isNode(A.contents)) {
                let z = {};
                Tf3.visit(A.contents, (_, w) => {
                    if (wM7.isNode(w) && w.tag) z[w.tag] = !0
                }), Y = Object.keys(z)
            } else Y = [];
            for (let [z, _] of K) {
                if (z === "!!" && _ === "tag:yaml.org,2002:") continue;
                if (!A || Y.some((w) => w.startsWith(_))) q.push(`%TAG ${z} ${_}`)
            }
            return q.join(`
`)
        }
    }
    TL.defaultYaml = {
        explicit: !1,
        version: "1.2"
    };
    TL.defaultTags = {
        "!!": "tag:yaml.org,2002:"
    };
    Vf3.Directives = TL
})
// @from(Ln 125763, Col 4)
Xz1 = x((Rf3) => {
    var OM7 = CY(),
        Ef3 = Ab6();

    function yf3(A) {
        if (/[\x00-\x19\s,[\]{}]/.test(A)) {
            let K = `Anchor must not contain whitespace or control characters: ${JSON.stringify(A)}`;
            throw Error(K)
        }
        return !0
    }

    function $M7(A) {
        let q = new Set;
        return Ef3.visit(A, {
            Value(K, Y) {
                if (Y.anchor) q.add(Y.anchor)
            }
        }), q
    }

    function HM7(A, q) {
        for (let K = 1;; ++K) {
            let Y = `${A}${K}`;
            if (!q.has(Y)) return Y
        }
    }

    function Lf3(A, q) {
        let K = [],
            Y = new Map,
            z = null;
        return {
            onAnchor: (_) => {
                K.push(_), z ?? (z = $M7(A));
                let w = HM7(q, z);
                return z.add(w), w
            },
            setAnchors: () => {
                for (let _ of K) {
                    let w = Y.get(_);
                    if (typeof w === "object" && w.anchor && (OM7.isScalar(w.node) || OM7.isCollection(w.node))) w.node.anchor = w.anchor;
                    else {
                        let O = Error("Failed to resolve repeated object (this should not happen)");
                        throw O.source = _, O
                    }
                }
            },
            sourceObjects: Y
        }
    }
    Rf3.anchorIsValid = yf3;
    Rf3.anchorNames = $M7;
    Rf3.createNodeAnchors = Lf3;
    Rf3.findNewAnchor = HM7
})
// @from(Ln 125819, Col 4)
mz8 = x((bf3) => {
    function qb6(A, q, K, Y) {
        if (Y && typeof Y === "object")
            if (Array.isArray(Y))
                for (let z = 0, _ = Y.length; z < _; ++z) {
                    let w = Y[z],
                        O = qb6(A, Y, String(z), w);
                    if (O === void 0) delete Y[z];
                    else if (O !== w) Y[z] = O
                } else if (Y instanceof Map)
                    for (let z of Array.from(Y.keys())) {
                        let _ = Y.get(z),
                            w = qb6(A, Y, z, _);
                        if (w === void 0) Y.delete(z);
                        else if (w !== _) Y.set(z, w)
                    } else if (Y instanceof Set)
                        for (let z of Array.from(Y)) {
                            let _ = qb6(A, Y, z, z);
                            if (_ === void 0) Y.delete(z);
                            else if (_ !== z) Y.delete(z), Y.add(_)
                        } else
                            for (let [z, _] of Object.entries(Y)) {
                                let w = qb6(A, Y, z, _);
                                if (w === void 0) delete Y[z];
                                else if (w !== _) Y[z] = w
                            }
        return A.call(q, K, Y)
    }
    bf3.applyReviver = qb6
})
// @from(Ln 125849, Col 4)
Pa = x((mf3) => {
    var uf3 = CY();

    function jM7(A, q, K) {
        if (Array.isArray(A)) return A.map((Y, z) => jM7(Y, String(z), K));
        if (A && typeof A.toJSON === "function") {
            if (!K || !uf3.hasAnchor(A)) return A.toJSON(q, K);
            let Y = {
                aliasCount: 0,
                count: 1,
                res: void 0
            };
            K.anchors.set(A, Y), K.onCreate = (_) => {
                Y.res = _, delete K.onCreate
            };
            let z = A.toJSON(q, K);
            if (K.onCreate) K.onCreate(z);
            return z
        }
        if (typeof A === "bigint" && !K?.keep) return Number(A);
        return A
    }
    mf3.toJS = jM7
})
// @from(Ln 125873, Col 4)
Pz1 = x((pf3) => {
    var gf3 = mz8(),
        JM7 = CY(),
        Ff3 = Pa();
    class MM7 {
        constructor(A) {
            Object.defineProperty(this, JM7.NODE_TYPE, {
                value: A
            })
        }
        clone() {
            let A = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (this.range) A.range = this.range.slice();
            return A
        }
        toJS(A, {
            mapAsMap: q,
            maxAliasCount: K,
            onAnchor: Y,
            reviver: z
        } = {}) {
            if (!JM7.isDocument(A)) throw TypeError("A document argument is required");
            let _ = {
                    anchors: new Map,
                    doc: A,
                    keep: !0,
                    mapAsMap: q === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof K === "number" ? K : 100
                },
                w = Ff3.toJS(this, "", _);
            if (typeof Y === "function")
                for (let {
                        count: O,
                        res: $
                    }
                    of _.anchors.values()) Y($, O);
            return typeof z === "function" ? gf3.applyReviver(z, {
                "": w
            }, "", w) : w
        }
    }
    pf3.NodeBase = MM7
})
// @from(Ln 125917, Col 4)
Kb6 = x((if3) => {
    var Uf3 = Xz1(),
        df3 = Ab6(),
        RM6 = CY(),
        cf3 = Pz1(),
        lf3 = Pa();
    class DM7 extends cf3.NodeBase {
        constructor(A) {
            super(RM6.ALIAS);
            this.source = A, Object.defineProperty(this, "tag", {
                set() {
                    throw Error("Alias nodes cannot have tags")
                }
            })
        }
        resolve(A, q) {
            let K;
            if (q?.aliasResolveCache) K = q.aliasResolveCache;
            else if (K = [], df3.visit(A, {
                    Node: (z, _) => {
                        if (RM6.isAlias(_) || RM6.hasAnchor(_)) K.push(_)
                    }
                }), q) q.aliasResolveCache = K;
            let Y = void 0;
            for (let z of K) {
                if (z === this) break;
                if (z.anchor === this.source) Y = z
            }
            return Y
        }
        toJSON(A, q) {
            if (!q) return {
                source: this.source
            };
            let {
                anchors: K,
                doc: Y,
                maxAliasCount: z
            } = q, _ = this.resolve(Y, q);
            if (!_) {
                let O = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw ReferenceError(O)
            }
            let w = K.get(_);
            if (!w) lf3.toJS(_, null, q), w = K.get(_);
            if (!w || w.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
            if (z >= 0) {
                if (w.count += 1, w.aliasCount === 0) w.aliasCount = Wz1(Y, _, K);
                if (w.count * w.aliasCount > z) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack")
            }
            return w.res
        }
        toString(A, q, K) {
            let Y = `*${this.source}`;
            if (A) {
                if (Uf3.anchorIsValid(this.source), A.options.verifyAliasOrder && !A.anchors.has(this.source)) {
                    let z = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                    throw Error(z)
                }
                if (A.implicitKey) return `${Y} `
            }
            return Y
        }
    }

    function Wz1(A, q, K) {
        if (RM6.isAlias(q)) {
            let Y = q.resolve(A),
                z = K && Y && K.get(Y);
            return z ? z.count * z.aliasCount : 0
        } else if (RM6.isCollection(q)) {
            let Y = 0;
            for (let z of q.items) {
                let _ = Wz1(A, z, K);
                if (_ > Y) Y = _
            }
            return Y
        } else if (RM6.isPair(q)) {
            let Y = Wz1(A, q.key, K),
                z = Wz1(A, q.value, K);
            return Math.max(Y, z)
        }
        return 1
    }
    if3.Alias = DM7
})
// @from(Ln 126003, Col 4)
SJ = x((tf3) => {
    var rf3 = CY(),
        of3 = Pz1(),
        af3 = Pa(),
        sf3 = (A) => !A || typeof A !== "function" && typeof A !== "object";
    class fq6 extends of3.NodeBase {
        constructor(A) {
            super(rf3.SCALAR);
            this.value = A
        }
        toJSON(A, q) {
            return q?.keep ? this.value : af3.toJS(this.value, A, q)
        }
        toString() {
            return String(this.value)
        }
    }
    fq6.BLOCK_FOLDED = "BLOCK_FOLDED";
    fq6.BLOCK_LITERAL = "BLOCK_LITERAL";
    fq6.PLAIN = "PLAIN";
    fq6.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    fq6.QUOTE_SINGLE = "QUOTE_SINGLE";
    tf3.Scalar = fq6;
    tf3.isScalarValue = sf3
})
// @from(Ln 126028, Col 4)
Yb6 = x((_T3) => {
    var qT3 = Kb6(),
        Tq6 = CY(),
        XM7 = SJ(),
        KT3 = "tag:yaml.org,2002:";

    function YT3(A, q, K) {
        if (q) {
            let Y = K.filter((_) => _.tag === q),
                z = Y.find((_) => !_.format) ?? Y[0];
            if (!z) throw Error(`Tag ${q} not found`);
            return z
        }
        return K.find((Y) => Y.identify?.(A) && !Y.format)
    }

    function zT3(A, q, K) {
        if (Tq6.isDocument(A)) A = A.contents;
        if (Tq6.isNode(A)) return A;
        if (Tq6.isPair(A)) {
            let J = K.schema[Tq6.MAP].createNode?.(K.schema, null, K);
            return J.items.push(A), J
        }
        if (A instanceof String || A instanceof Number || A instanceof Boolean || typeof BigInt < "u" && A instanceof BigInt) A = A.valueOf();
        let {
            aliasDuplicateObjects: Y,
            onAnchor: z,
            onTagObj: _,
            schema: w,
            sourceObjects: O
        } = K, $ = void 0;
        if (Y && A && typeof A === "object")
            if ($ = O.get(A), $) return $.anchor ?? ($.anchor = z(A)), new qT3.Alias($.anchor);
            else $ = {
                anchor: null,
                node: null
            }, O.set(A, $);
        if (q?.startsWith("!!")) q = KT3 + q.slice(2);
        let H = YT3(A, q, w.tags);
        if (!H) {
            if (A && typeof A.toJSON === "function") A = A.toJSON();
            if (!A || typeof A !== "object") {
                let J = new XM7.Scalar(A);
                if ($) $.node = J;
                return J
            }
            H = A instanceof Map ? w[Tq6.MAP] : (Symbol.iterator in Object(A)) ? w[Tq6.SEQ] : w[Tq6.MAP]
        }
        if (_) _(H), delete K.onTagObj;
        let j = H?.createNode ? H.createNode(K.schema, A, K) : typeof H?.nodeClass?.from === "function" ? H.nodeClass.from(K.schema, A, K) : new XM7.Scalar(A);
        if (q) j.tag = q;
        else if (!H.default) j.tag = H.tag;
        if ($) $.node = j;
        return j
    }
    _T3.createNode = zT3
})
// @from(Ln 126085, Col 4)
Zz1 = x((HT3) => {
    var OT3 = Yb6(),
        qm = CY(),
        $T3 = Pz1();

    function Bz8(A, q, K) {
        let Y = K;
        for (let z = q.length - 1; z >= 0; --z) {
            let _ = q[z];
            if (typeof _ === "number" && Number.isInteger(_) && _ >= 0) {
                let w = [];
                w[_] = Y, Y = w
            } else Y = new Map([
                [_, Y]
            ])
        }
        return OT3.createNode(Y, void 0, {
            aliasDuplicateObjects: !1,
            keepUndefined: !1,
            onAnchor: () => {
                throw Error("This should not happen, please report a bug.")
            },
            schema: A,
            sourceObjects: new Map
        })
    }
    var PM7 = (A) => A == null || typeof A === "object" && !!A[Symbol.iterator]().next().done;
    class WM7 extends $T3.NodeBase {
        constructor(A, q) {
            super(A);
            Object.defineProperty(this, "schema", {
                value: q,
                configurable: !0,
                enumerable: !1,
                writable: !0
            })
        }
        clone(A) {
            let q = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            if (A) q.schema = A;
            if (q.items = q.items.map((K) => qm.isNode(K) || qm.isPair(K) ? K.clone(A) : K), this.range) q.range = this.range.slice();
            return q
        }
        addIn(A, q) {
            if (PM7(A)) this.add(q);
            else {
                let [K, ...Y] = A, z = this.get(K, !0);
                if (qm.isCollection(z)) z.addIn(Y, q);
                else if (z === void 0 && this.schema) this.set(K, Bz8(this.schema, Y, q));
                else throw Error(`Expected YAML collection at ${K}. Remaining path: ${Y}`)
            }
        }
        deleteIn(A) {
            let [q, ...K] = A;
            if (K.length === 0) return this.delete(q);
            let Y = this.get(q, !0);
            if (qm.isCollection(Y)) return Y.deleteIn(K);
            else throw Error(`Expected YAML collection at ${q}. Remaining path: ${K}`)
        }
        getIn(A, q) {
            let [K, ...Y] = A, z = this.get(K, !0);
            if (Y.length === 0) return !q && qm.isScalar(z) ? z.value : z;
            else return qm.isCollection(z) ? z.getIn(Y, q) : void 0
        }
        hasAllNullValues(A) {
            return this.items.every((q) => {
                if (!qm.isPair(q)) return !1;
                let K = q.value;
                return K == null || A && qm.isScalar(K) && K.value == null && !K.commentBefore && !K.comment && !K.tag
            })
        }
        hasIn(A) {
            let [q, ...K] = A;
            if (K.length === 0) return this.has(q);
            let Y = this.get(q, !0);
            return qm.isCollection(Y) ? Y.hasIn(K) : !1
        }
        setIn(A, q) {
            let [K, ...Y] = A;
            if (Y.length === 0) this.set(K, q);
            else {
                let z = this.get(K, !0);
                if (qm.isCollection(z)) z.setIn(Y, q);
                else if (z === void 0 && this.schema) this.set(K, Bz8(this.schema, Y, q));
                else throw Error(`Expected YAML collection at ${K}. Remaining path: ${Y}`)
            }
        }
    }
    HT3.Collection = WM7;
    HT3.collectionFromPath = Bz8;
    HT3.isEmptyPath = PM7
})
// @from(Ln 126177, Col 4)
zb6 = x((PT3) => {
    var DT3 = (A) => A.replace(/^(?!$)(?: $)?/gm, "#");

    function gz8(A, q) {
        if (/^\n+$/.test(A)) return A.substring(1);
        return q ? A.replace(/^(?! *$)/gm, q) : A
    }
    var XT3 = (A, q, K) => A.endsWith(`
`) ? gz8(K, q) : K.includes(`
`) ? `
` + gz8(K, q) : (A.endsWith(" ") ? "" : " ") + K;
    PT3.indentComment = gz8;
    PT3.lineComment = XT3;
    PT3.stringifyComment = DT3
})
// @from(Ln 126192, Col 4)
GM7 = x((TT3) => {
    function fT3(A, q, K = "flow", {
        indentAtStart: Y,
        lineWidth: z = 80,
        minContentWidth: _ = 20,
        onFold: w,
        onOverflow: O
    } = {}) {
        if (!z || z < 0) return A;
        if (z < _) _ = 0;
        let $ = Math.max(1 + _, 1 + z - q.length);
        if (A.length <= $) return A;
        let H = [],
            j = {},
            J = z - q.length;
        if (typeof Y === "number")
            if (Y > z - Math.max(2, _)) H.push(0);
            else J = z - Y;
        let M = void 0,
            D = void 0,
            X = !1,
            P = -1,
            W = -1,
            Z = -1;
        if (K === "block") {
            if (P = ZM7(A, P, q.length), P !== -1) J = P + $
        }
        for (let f; f = A[P += 1];) {
            if (K === "quoted" && f === "\\") {
                switch (W = P, A[P + 1]) {
                    case "x":
                        P += 3;
                        break;
                    case "u":
                        P += 5;
                        break;
                    case "U":
                        P += 9;
                        break;
                    default:
                        P += 1
                }
                Z = P
            }
            if (f === `
`) {
                if (K === "block") P = ZM7(A, P, q.length);
                J = P + q.length + $, M = void 0
            } else {
                if (f === " " && D && D !== " " && D !== `
` && D !== "\t") {
                    let v = A[P + 1];
                    if (v && v !== " " && v !== `
` && v !== "\t") M = P
                }
                if (P >= J)
                    if (M) H.push(M), J = M + $, M = void 0;
                    else if (K === "quoted") {
                    while (D === " " || D === "\t") D = f, f = A[P += 1], X = !0;
                    let v = P > Z + 1 ? P - 2 : W - 1;
                    if (j[v]) return A;
                    H.push(v), j[v] = !0, J = v + $, M = void 0
                } else X = !0
            }
            D = f
        }
        if (X && O) O();
        if (H.length === 0) return A;
        if (w) w();
        let G = A.slice(0, H[0]);
        for (let f = 0; f < H.length; ++f) {
            let v = H[f],
                N = H[f + 1] || A.length;
            if (v === 0) G = `
${q}${A.slice(0,N)}`;
            else {
                if (K === "quoted" && j[v]) G += `${A[v]}\\`;
                G += `
${q}${A.slice(v+1,N)}`
            }
        }
        return G
    }

    function ZM7(A, q, K) {
        let Y = q,
            z = q + 1,
            _ = A[z];
        while (_ === " " || _ === "\t")
            if (q < z + K) _ = A[++q];
            else {
                do _ = A[++q]; while (_ && _ !== `
`);
                Y = q, z = q + 1, _ = A[z]
            } return Y
    }
    TT3.FOLD_BLOCK = "block";
    TT3.FOLD_FLOW = "flow";
    TT3.FOLD_QUOTED = "quoted";
    TT3.foldFlowLines = fT3
})
// @from(Ln 126293, Col 4)
wb6 = x((RT3) => {
    var TC = SJ(),
        Wa = GM7(),
        fz1 = (A, q) => ({
            indentAtStart: q ? A.indent.length : A.indentAtStart,
            lineWidth: A.options.lineWidth,
            minContentWidth: A.options.minContentWidth
        }),
        Tz1 = (A) => /^(%|---|\.\.\.)/m.test(A);

    function ET3(A, q, K) {
        if (!q || q < 0) return !1;
        let Y = q - K,
            z = A.length;
        if (z <= Y) return !1;
        for (let _ = 0, w = 0; _ < z; ++_)
            if (A[_] === `
`) {
                if (_ - w > Y) return !0;
                if (w = _ + 1, z - w <= Y) return !1
            } return !0
    }

    function _b6(A, q) {
        let K = JSON.stringify(A);
        if (q.options.doubleQuotedAsJSON) return K;
        let {
            implicitKey: Y
        } = q, z = q.options.doubleQuotedMinMultiLineLength, _ = q.indent || (Tz1(A) ? "  " : ""), w = "", O = 0;
        for (let $ = 0, H = K[$]; H; H = K[++$]) {
            if (H === " " && K[$ + 1] === "\\" && K[$ + 2] === "n") w += K.slice(O, $) + "\\ ", $ += 1, O = $, H = "\\";
            if (H === "\\") switch (K[$ + 1]) {
                case "u": {
                    w += K.slice(O, $);
                    let j = K.substr($ + 2, 4);
                    switch (j) {
                        case "0000":
                            w += "\\0";
                            break;
                        case "0007":
                            w += "\\a";
                            break;
                        case "000b":
                            w += "\\v";
                            break;
                        case "001b":
                            w += "\\e";
                            break;
                        case "0085":
                            w += "\\N";
                            break;
                        case "00a0":
                            w += "\\_";
                            break;
                        case "2028":
                            w += "\\L";
                            break;
                        case "2029":
                            w += "\\P";
                            break;
                        default:
                            if (j.substr(0, 2) === "00") w += "\\x" + j.substr(2);
                            else w += K.substr($, 6)
                    }
                    $ += 5, O = $ + 1
                }
                break;
                case "n":
                    if (Y || K[$ + 2] === '"' || K.length < z) $ += 1;
                    else {
                        w += K.slice(O, $) + `

`;
                        while (K[$ + 2] === "\\" && K[$ + 3] === "n" && K[$ + 4] !== '"') w += `
`, $ += 2;
                        if (w += _, K[$ + 2] === " ") w += "\\";
                        $ += 1, O = $ + 1
                    }
                    break;
                default:
                    $ += 1
            }
        }
        return w = O ? w + K.slice(O) : K, Y ? w : Wa.foldFlowLines(w, _, Wa.FOLD_QUOTED, fz1(q, !1))
    }

    function Fz8(A, q) {
        if (q.options.singleQuote === !1 || q.implicitKey && A.includes(`
`) || /[ \t]\n|\n[ \t]/.test(A)) return _b6(A, q);
        let K = q.indent || (Tz1(A) ? "  " : ""),
            Y = "'" + A.replace(/'/g, "''").replace(/\n+/g, `$&
${K}`) + "'";
        return q.implicitKey ? Y : Wa.foldFlowLines(Y, K, Wa.FOLD_FLOW, fz1(q, !1))
    }

    function hM6(A, q) {
        let {
            singleQuote: K
        } = q.options, Y;
        if (K === !1) Y = _b6;
        else {
            let z = A.includes('"'),
                _ = A.includes("'");
            if (z && !_) Y = Fz8;
            else if (_ && !z) Y = _b6;
            else Y = K ? Fz8 : _b6
        }
        return Y(A, q)
    }
    var pz8;
    try {
        pz8 = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g")
    } catch {
        pz8 = /\n+(?!\n|$)/g
    }

    function Gz1({
        comment: A,
        type: q,
        value: K
    }, Y, z, _) {
        let {
            blockQuote: w,
            commentString: O,
            lineWidth: $
        } = Y.options;
        if (!w || /\n[\t ]+$/.test(K)) return hM6(K, Y);
        let H = Y.indent || (Y.forceBlockIndent || Tz1(K) ? "  " : ""),
            j = w === "literal" ? !0 : w === "folded" || q === TC.Scalar.BLOCK_FOLDED ? !1 : q === TC.Scalar.BLOCK_LITERAL ? !0 : !ET3(K, $, H.length);
        if (!K) return j ? `|
` : `>
`;
        let J, M;
        for (M = K.length; M > 0; --M) {
            let N = K[M - 1];
            if (N !== `
` && N !== "\t" && N !== " ") break
        }
        let D = K.substring(M),
            X = D.indexOf(`
`);
        if (X === -1) J = "-";
        else if (K === D || X !== D.length - 1) {
            if (J = "+", _) _()
        } else J = "";
        if (D) {
            if (K = K.slice(0, -D.length), D[D.length - 1] === `
`) D = D.slice(0, -1);
            D = D.replace(pz8, `$&${H}`)
        }
        let P = !1,
            W, Z = -1;
        for (W = 0; W < K.length; ++W) {
            let N = K[W];
            if (N === " ") P = !0;
            else if (N === `
`) Z = W;
            else break
        }
        let G = K.substring(0, Z < W ? Z + 1 : W);
        if (G) K = K.substring(G.length), G = G.replace(/\n+/g, `$&${H}`);
        let v = (P ? H ? "2" : "1" : "") + J;
        if (A) {
            if (v += " " + O(A.replace(/ ?[\r\n]+/g, " ")), z) z()
        }
        if (!j) {
            let N = K.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${H}`),
                V = !1,
                L = fz1(Y, !0);
            if (w !== "folded" && q !== TC.Scalar.BLOCK_FOLDED) L.onOverflow = () => {
                V = !0
            };
            let h = Wa.foldFlowLines(`${G}${N}${D}`, H, Wa.FOLD_BLOCK, L);
            if (!V) return `>${v}
${H}${h}`
        }
        return K = K.replace(/\n+/g, `$&${H}`), `|${v}
${H}${G}${K}${D}`
    }

    function yT3(A, q, K, Y) {
        let {
            type: z,
            value: _
        } = A, {
            actualString: w,
            implicitKey: O,
            indent: $,
            indentStep: H,
            inFlow: j
        } = q;
        if (O && _.includes(`
`) || j && /[[\]{},]/.test(_)) return hM6(_, q);
        if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(_)) return O || j || !_.includes(`
`) ? hM6(_, q) : Gz1(A, q, K, Y);
        if (!O && !j && z !== TC.Scalar.PLAIN && _.includes(`
`)) return Gz1(A, q, K, Y);
        if (Tz1(_)) {
            if ($ === "") return q.forceBlockIndent = !0, Gz1(A, q, K, Y);
            else if (O && $ === H) return hM6(_, q)
        }
        let J = _.replace(/\n+/g, `$&
${$}`);
        if (w) {
            let M = (P) => P.default && P.tag !== "tag:yaml.org,2002:str" && P.test?.test(J),
                {
                    compat: D,
                    tags: X
                } = q.doc.schema;
            if (X.some(M) || D?.some(M)) return hM6(_, q)
        }
        return O ? J : Wa.foldFlowLines(J, $, Wa.FOLD_FLOW, fz1(q, !1))
    }

    function LT3(A, q, K, Y) {
        let {
            implicitKey: z,
            inFlow: _
        } = q, w = typeof A.value === "string" ? A : Object.assign({}, A, {
            value: String(A.value)
        }), {
            type: O
        } = A;
        if (O !== TC.Scalar.QUOTE_DOUBLE) {
            if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(w.value)) O = TC.Scalar.QUOTE_DOUBLE
        }
        let $ = (j) => {
                switch (j) {
                    case TC.Scalar.BLOCK_FOLDED:
                    case TC.Scalar.BLOCK_LITERAL:
                        return z || _ ? hM6(w.value, q) : Gz1(w, q, K, Y);
                    case TC.Scalar.QUOTE_DOUBLE:
                        return _b6(w.value, q);
                    case TC.Scalar.QUOTE_SINGLE:
                        return Fz8(w.value, q);
                    case TC.Scalar.PLAIN:
                        return yT3(w, q, K, Y);
                    default:
                        return null
                }
            },
            H = $(O);
        if (H === null) {
            let {
                defaultKeyType: j,
                defaultStringType: J
            } = q.options, M = z && j || J;
            if (H = $(M), H === null) throw Error(`Unsupported default string type ${M}`)
        }
        return H
    }
    RT3.stringifyString = LT3
})
// @from(Ln 126550, Col 4)
Ob6 = x((BT3) => {
    var ST3 = Xz1(),
        Za = CY(),
        CT3 = zb6(),
        IT3 = wb6();

    function bT3(A, q) {
        let K = Object.assign({
                blockQuote: !0,
                commentString: CT3.stringifyComment,
                defaultKeyType: null,
                defaultStringType: "PLAIN",
                directives: null,
                doubleQuotedAsJSON: !1,
                doubleQuotedMinMultiLineLength: 40,
                falseStr: "false",
                flowCollectionPadding: !0,
                indentSeq: !0,
                lineWidth: 80,
                minContentWidth: 20,
                nullStr: "null",
                simpleKeys: !1,
                singleQuote: null,
                trueStr: "true",
                verifyAliasOrder: !0
            }, A.schema.toStringOptions, q),
            Y;
        switch (K.collectionStyle) {
            case "block":
                Y = !1;
                break;
            case "flow":
                Y = !0;
                break;
            default:
                Y = null
        }
        return {
            anchors: new Set,
            doc: A,
            flowCollectionPadding: K.flowCollectionPadding ? " " : "",
            indent: "",
            indentStep: typeof K.indent === "number" ? " ".repeat(K.indent) : "  ",
            inFlow: Y,
            options: K
        }
    }

    function xT3(A, q) {
        if (q.tag) {
            let z = A.filter((_) => _.tag === q.tag);
            if (z.length > 0) return z.find((_) => _.format === q.format) ?? z[0]
        }
        let K = void 0,
            Y;
        if (Za.isScalar(q)) {
            Y = q.value;
            let z = A.filter((_) => _.identify?.(Y));
            if (z.length > 1) {
                let _ = z.filter((w) => w.test);
                if (_.length > 0) z = _
            }
            K = z.find((_) => _.format === q.format) ?? z.find((_) => !_.format)
        } else Y = q, K = A.find((z) => z.nodeClass && Y instanceof z.nodeClass);
        if (!K) {
            let z = Y?.constructor?.name ?? (Y === null ? "null" : typeof Y);
            throw Error(`Tag not resolved for ${z} value`)
        }
        return K
    }

    function uT3(A, q, {
        anchors: K,
        doc: Y
    }) {
        if (!Y.directives) return "";
        let z = [],
            _ = (Za.isScalar(A) || Za.isCollection(A)) && A.anchor;
        if (_ && ST3.anchorIsValid(_)) K.add(_), z.push(`&${_}`);
        let w = A.tag ?? (q.default ? null : q.tag);
        if (w) z.push(Y.directives.tagString(w));
        return z.join(" ")
    }

    function mT3(A, q, K, Y) {
        if (Za.isPair(A)) return A.toString(q, K, Y);
        if (Za.isAlias(A)) {
            if (q.doc.directives) return A.toString(q);
            if (q.resolvedAliases?.has(A)) throw TypeError("Cannot stringify circular structure without alias nodes");
            else {
                if (q.resolvedAliases) q.resolvedAliases.add(A);
                else q.resolvedAliases = new Set([A]);
                A = A.resolve(q.doc)
            }
        }
        let z = void 0,
            _ = Za.isNode(A) ? A : q.doc.createNode(A, {
                onTagObj: ($) => z = $
            });
        z ?? (z = xT3(q.doc.schema.tags, _));
        let w = uT3(_, z, q);
        if (w.length > 0) q.indentAtStart = (q.indentAtStart ?? 0) + w.length + 1;
        let O = typeof z.stringify === "function" ? z.stringify(_, q, K, Y) : Za.isScalar(_) ? IT3.stringifyString(_, q, K, Y) : _.toString(q, K, Y);
        if (!w) return O;
        return Za.isScalar(_) || O[0] === "{" || O[0] === "[" ? `${w} ${O}` : `${w}
${q.indent}${O}`
    }
    BT3.createStringifyContext = bT3;
    BT3.stringify = mT3
})
// @from(Ln 126660, Col 4)
vM7 = x((QT3) => {
    var YU = CY(),
        fM7 = SJ(),
        TM7 = Ob6(),
        $b6 = zb6();

    function pT3({
        key: A,
        value: q
    }, K, Y, z) {
        let {
            allNullValues: _,
            doc: w,
            indent: O,
            indentStep: $,
            options: {
                commentString: H,
                indentSeq: j,
                simpleKeys: J
            }
        } = K, M = YU.isNode(A) && A.comment || null;
        if (J) {
            if (M) throw Error("With simple keys, key nodes cannot have comments");
            if (YU.isCollection(A) || !YU.isNode(A) && typeof A === "object") throw Error("With simple keys, collection cannot be used as a key value")
        }
        let D = !J && (!A || M && q == null && !K.inFlow || YU.isCollection(A) || (YU.isScalar(A) ? A.type === fM7.Scalar.BLOCK_FOLDED || A.type === fM7.Scalar.BLOCK_LITERAL : typeof A === "object"));
        K = Object.assign({}, K, {
            allNullValues: !1,
            implicitKey: !D && (J || !_),
            indent: O + $
        });
        let X = !1,
            P = !1,
            W = TM7.stringify(A, K, () => X = !0, () => P = !0);
        if (!D && !K.inFlow && W.length > 1024) {
            if (J) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
            D = !0
        }
        if (K.inFlow) {
            if (_ || q == null) {
                if (X && Y) Y();
                return W === "" ? "?" : D ? `? ${W}` : W
            }
        } else if (_ && !J || q == null && D) {
            if (W = `? ${W}`, M && !X) W += $b6.lineComment(W, K.indent, H(M));
            else if (P && z) z();
            return W
        }
        if (X) M = null;
        if (D) {
            if (M) W += $b6.lineComment(W, K.indent, H(M));
            W = `? ${W}
${O}:`
        } else if (W = `${W}:`, M) W += $b6.lineComment(W, K.indent, H(M));
        let Z, G, f;
        if (YU.isNode(q)) Z = !!q.spaceBefore, G = q.commentBefore, f = q.comment;
        else if (Z = !1, G = null, f = null, q && typeof q === "object") q = w.createNode(q);
        if (K.implicitKey = !1, !D && !M && YU.isScalar(q)) K.indentAtStart = W.length + 1;
        if (P = !1, !j && $.length >= 2 && !K.inFlow && !D && YU.isSeq(q) && !q.flow && !q.tag && !q.anchor) K.indent = K.indent.substring(2);
        let v = !1,
            N = TM7.stringify(q, K, () => v = !0, () => P = !0),
            V = " ";
        if (M || Z || G) {
            if (V = Z ? `
` : "", G) {
                let L = H(G);
                V += `
${$b6.indentComment(L,K.indent)}`
            }
            if (N === "" && !K.inFlow) {
                if (V === `
`) V = `

`
            } else V += `
${K.indent}`
        } else if (!D && YU.isCollection(q)) {
            let L = N[0],
                h = N.indexOf(`
`),
                R = h !== -1,
                u = K.inFlow ?? q.flow ?? q.items.length === 0;
            if (R || !u) {
                let I = !1;
                if (R && (L === "&" || L === "!")) {
                    let g = N.indexOf(" ");
                    if (L === "&" && g !== -1 && g < h && N[g + 1] === "!") g = N.indexOf(" ", g + 1);
                    if (g === -1 || h < g) I = !0
                }
                if (!I) V = `
${K.indent}`
            }
        } else if (N === "" || N[0] === `
`) V = "";
        if (W += V + N, K.inFlow) {
            if (v && Y) Y()
        } else if (f && !v) W += $b6.lineComment(W, K.indent, H(f));
        else if (P && z) z();
        return W
    }
    QT3.stringifyPair = pT3
})
// @from(Ln 126762, Col 4)
Qz8 = x((lT3) => {
    var NM7 = x6("process");

    function dT3(A, ...q) {
        if (A === "debug") console.log(...q)
    }

    function cT3(A, q) {
        if (A === "debug" || A === "warn")
            if (typeof NM7.emitWarning === "function") NM7.emitWarning(q);
            else console.warn(q)
    }
    lT3.debug = dT3;
    lT3.warn = cT3
})
// @from(Ln 126777, Col 4)
Vz1 = x((oT3) => {
    var Hb6 = CY(),
        VM7 = SJ(),
        vz1 = "<<",
        Nz1 = {
            identify: (A) => A === vz1 || typeof A === "symbol" && A.description === vz1,
            default: "key",
            tag: "tag:yaml.org,2002:merge",
            test: /^<<$/,
            resolve: () => Object.assign(new VM7.Scalar(Symbol(vz1)), {
                addToJSMap: kM7
            }),
            stringify: () => vz1
        },
        rT3 = (A, q) => (Nz1.identify(q) || Hb6.isScalar(q) && (!q.type || q.type === VM7.Scalar.PLAIN) && Nz1.identify(q.value)) && A?.doc.schema.tags.some((K) => K.tag === Nz1.tag && K.default);

    function kM7(A, q, K) {
        if (K = A && Hb6.isAlias(K) ? K.resolve(A.doc) : K, Hb6.isSeq(K))
            for (let Y of K.items) Uz8(A, q, Y);
        else if (Array.isArray(K))
            for (let Y of K) Uz8(A, q, Y);
        else Uz8(A, q, K)
    }

    function Uz8(A, q, K) {
        let Y = A && Hb6.isAlias(K) ? K.resolve(A.doc) : K;
        if (!Hb6.isMap(Y)) throw Error("Merge sources must be maps or map aliases");
        let z = Y.toJSON(null, A, Map);
        for (let [_, w] of z)
            if (q instanceof Map) {
                if (!q.has(_)) q.set(_, w)
            } else if (q instanceof Set) q.add(_);
        else if (!Object.prototype.hasOwnProperty.call(q, _)) Object.defineProperty(q, _, {
            value: w,
            writable: !0,
            enumerable: !0,
            configurable: !0
        });
        return q
    }
    oT3.addMergeToJSMap = kM7;
    oT3.isMergeKey = rT3;
    oT3.merge = Nz1
})
// @from(Ln 126821, Col 4)
cz8 = x((Yv3) => {
    var eT3 = Qz8(),
        EM7 = Vz1(),
        Av3 = Ob6(),
        yM7 = CY(),
        dz8 = Pa();

    function qv3(A, q, {
        key: K,
        value: Y
    }) {
        if (yM7.isNode(K) && K.addToJSMap) K.addToJSMap(A, q, Y);
        else if (EM7.isMergeKey(A, K)) EM7.addMergeToJSMap(A, q, Y);
        else {
            let z = dz8.toJS(K, "", A);
            if (q instanceof Map) q.set(z, dz8.toJS(Y, z, A));
            else if (q instanceof Set) q.add(z);
            else {
                let _ = Kv3(K, z, A),
                    w = dz8.toJS(Y, _, A);
                if (_ in q) Object.defineProperty(q, _, {
                    value: w,
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                });
                else q[_] = w
            }
        }
        return q
    }

    function Kv3(A, q, K) {
        if (q === null) return "";
        if (typeof q !== "object") return String(q);
        if (yM7.isNode(A) && K?.doc) {
            let Y = Av3.createStringifyContext(K.doc, {});
            Y.anchors = new Set;
            for (let _ of K.anchors.keys()) Y.anchors.add(_.anchor);
            Y.inFlow = !0, Y.inStringifyKey = !0;
            let z = A.toString(Y);
            if (!K.mapKeyWarned) {
                let _ = JSON.stringify(z);
                if (_.length > 40) _ = _.substring(0, 36) + '..."';
                eT3.warn(K.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${_}. Set mapAsMap: true to use object keys.`), K.mapKeyWarned = !0
            }
            return z
        }
        return JSON.stringify(q)
    }
    Yv3.addPairToJSMap = qv3
})
// @from(Ln 126873, Col 4)
Ga = x(($v3) => {
    var LM7 = Yb6(),
        _v3 = vM7(),
        wv3 = cz8(),
        kz1 = CY();

    function Ov3(A, q, K) {
        let Y = LM7.createNode(A, void 0, K),
            z = LM7.createNode(q, void 0, K);
        return new Ez1(Y, z)
    }
    class Ez1 {
        constructor(A, q = null) {
            Object.defineProperty(this, kz1.NODE_TYPE, {
                value: kz1.PAIR
            }), this.key = A, this.value = q
        }
        clone(A) {
            let {
                key: q,
                value: K
            } = this;
            if (kz1.isNode(q)) q = q.clone(A);
            if (kz1.isNode(K)) K = K.clone(A);
            return new Ez1(q, K)
        }
        toJSON(A, q) {
            let K = q?.mapAsMap ? new Map : {};
            return wv3.addPairToJSMap(q, K, this)
        }
        toString(A, q, K) {
            return A?.doc ? _v3.stringifyPair(this, A, q, K) : JSON.stringify(this)
        }
    }
    $v3.Pair = Ez1;
    $v3.createPair = Ov3
})
// @from(Ln 126910, Col 4)
lz8 = x((Xv3) => {
    var vq6 = CY(),
        RM7 = Ob6(),
        yz1 = zb6();

    function Jv3(A, q, K) {
        return (q.inFlow ?? A.flow ? Dv3 : Mv3)(A, q, K)
    }

    function Mv3({
        comment: A,
        items: q
    }, K, {
        blockItemPrefix: Y,
        flowChars: z,
        itemIndent: _,
        onChompKeep: w,
        onComment: O
    }) {
        let {
            indent: $,
            options: {
                commentString: H
            }
        } = K, j = Object.assign({}, K, {
            indent: _,
            type: null
        }), J = !1, M = [];
        for (let X = 0; X < q.length; ++X) {
            let P = q[X],
                W = null;
            if (vq6.isNode(P)) {
                if (!J && P.spaceBefore) M.push("");
                if (Lz1(K, M, P.commentBefore, J), P.comment) W = P.comment
            } else if (vq6.isPair(P)) {
                let G = vq6.isNode(P.key) ? P.key : null;
                if (G) {
                    if (!J && G.spaceBefore) M.push("");
                    Lz1(K, M, G.commentBefore, J)
                }
            }
            J = !1;
            let Z = RM7.stringify(P, j, () => W = null, () => J = !0);
            if (W) Z += yz1.lineComment(Z, _, H(W));
            if (J && W) J = !1;
            M.push(Y + Z)
        }
        let D;
        if (M.length === 0) D = z.start + z.end;
        else {
            D = M[0];
            for (let X = 1; X < M.length; ++X) {
                let P = M[X];
                D += P ? `
${$}${P}` : `
`
            }
        }
        if (A) {
            if (D += `
` + yz1.indentComment(H(A), $), O) O()
        } else if (J && w) w();
        return D
    }

    function Dv3({
        items: A
    }, q, {
        flowChars: K,
        itemIndent: Y
    }) {
        let {
            indent: z,
            indentStep: _,
            flowCollectionPadding: w,
            options: {
                commentString: O
            }
        } = q;
        Y += _;
        let $ = Object.assign({}, q, {
                indent: Y,
                inFlow: !0,
                type: null
            }),
            H = !1,
            j = 0,
            J = [];
        for (let X = 0; X < A.length; ++X) {
            let P = A[X],
                W = null;
            if (vq6.isNode(P)) {
                if (P.spaceBefore) J.push("");
                if (Lz1(q, J, P.commentBefore, !1), P.comment) W = P.comment
            } else if (vq6.isPair(P)) {
                let G = vq6.isNode(P.key) ? P.key : null;
                if (G) {
                    if (G.spaceBefore) J.push("");
                    if (Lz1(q, J, G.commentBefore, !1), G.comment) H = !0
                }
                let f = vq6.isNode(P.value) ? P.value : null;
                if (f) {
                    if (f.comment) W = f.comment;
                    if (f.commentBefore) H = !0
                } else if (P.value == null && G?.comment) W = G.comment
            }
            if (W) H = !0;
            let Z = RM7.stringify(P, $, () => W = null);
            if (X < A.length - 1) Z += ",";
            if (W) Z += yz1.lineComment(Z, Y, O(W));
            if (!H && (J.length > j || Z.includes(`
`))) H = !0;
            J.push(Z), j = J.length
        }
        let {
            start: M,
            end: D
        } = K;
        if (J.length === 0) return M + D;
        else {
            if (!H) {
                let X = J.reduce((P, W) => P + W.length + 2, 2);
                H = q.options.lineWidth > 0 && X > q.options.lineWidth
            }
            if (H) {
                let X = M;
                for (let P of J) X += P ? `
${_}${z}${P}` : `
`;
                return `${X}
${z}${D}`
            } else return `${M}${w}${J.join(" ")}${w}${D}`
        }
    }

    function Lz1({
        indent: A,
        options: {
            commentString: q
        }
    }, K, Y, z) {
        if (Y && z) Y = Y.replace(/^\n+/, "");
        if (Y) {
            let _ = yz1.indentComment(q(Y), A);
            K.push(_.trimStart())
        }
    }
    Xv3.stringifyCollection = Jv3
})
// @from(Ln 127059, Col 4)
Ta = x((Tv3) => {
    var Wv3 = lz8(),
        Zv3 = cz8(),
        Gv3 = Zz1(),
        fa = CY(),
        Rz1 = Ga(),
        fv3 = SJ();

    function jb6(A, q) {
        let K = fa.isScalar(q) ? q.value : q;
        for (let Y of A)
            if (fa.isPair(Y)) {
                if (Y.key === q || Y.key === K) return Y;
                if (fa.isScalar(Y.key) && Y.key.value === K) return Y
            } return
    }
    class hM7 extends Gv3.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:map"
        }
        constructor(A) {
            super(fa.MAP, A);
            this.items = []
        }
        static from(A, q, K) {
            let {
                keepUndefined: Y,
                replacer: z
            } = K, _ = new this(A), w = (O, $) => {
                if (typeof z === "function") $ = z.call(q, O, $);
                else if (Array.isArray(z) && !z.includes(O)) return;
                if ($ !== void 0 || Y) _.items.push(Rz1.createPair(O, $, K))
            };
            if (q instanceof Map)
                for (let [O, $] of q) w(O, $);
            else if (q && typeof q === "object")
                for (let O of Object.keys(q)) w(O, q[O]);
            if (typeof A.sortMapEntries === "function") _.items.sort(A.sortMapEntries);
            return _
        }
        add(A, q) {
            let K;
            if (fa.isPair(A)) K = A;
            else if (!A || typeof A !== "object" || !("key" in A)) K = new Rz1.Pair(A, A?.value);
            else K = new Rz1.Pair(A.key, A.value);
            let Y = jb6(this.items, K.key),
                z = this.schema?.sortMapEntries;
            if (Y) {
                if (!q) throw Error(`Key ${K.key} already set`);
                if (fa.isScalar(Y.value) && fv3.isScalarValue(K.value)) Y.value.value = K.value;
                else Y.value = K.value
            } else if (z) {
                let _ = this.items.findIndex((w) => z(K, w) < 0);
                if (_ === -1) this.items.push(K);
                else this.items.splice(_, 0, K)
            } else this.items.push(K)
        }
        delete(A) {
            let q = jb6(this.items, A);
            if (!q) return !1;
            return this.items.splice(this.items.indexOf(q), 1).length > 0
        }
        get(A, q) {
            let Y = jb6(this.items, A)?.value;
            return (!q && fa.isScalar(Y) ? Y.value : Y) ?? void 0
        }
        has(A) {
            return !!jb6(this.items, A)
        }
        set(A, q) {
            this.add(new Rz1.Pair(A, q), !0)
        }
        toJSON(A, q, K) {
            let Y = K ? new K : q?.mapAsMap ? new Map : {};
            if (q?.onCreate) q.onCreate(Y);
            for (let z of this.items) Zv3.addPairToJSMap(q, Y, z);
            return Y
        }
        toString(A, q, K) {
            if (!A) return JSON.stringify(this);
            for (let Y of this.items)
                if (!fa.isPair(Y)) throw Error(`Map items must all be pairs; found ${JSON.stringify(Y)} instead`);
            if (!A.allNullValues && this.hasAllNullValues(!1)) A = Object.assign({}, A, {
                allNullValues: !0
            });
            return Wv3.stringifyCollection(this, A, {
                blockItemPrefix: "",
                flowChars: {
                    start: "{",
                    end: "}"
                },
                itemIndent: A.indent || "",
                onChompKeep: K,
                onComment: q
            })
        }
    }
    Tv3.YAMLMap = hM7;
    Tv3.findPair = jb6
})
// @from(Ln 127159, Col 4)
SM6 = x((Ev3) => {
    var Vv3 = CY(),
        SM7 = Ta(),
        kv3 = {
            collection: "map",
            default: !0,
            nodeClass: SM7.YAMLMap,
            tag: "tag:yaml.org,2002:map",
            resolve(A, q) {
                if (!Vv3.isMap(A)) q("Expected a mapping for this tag");
                return A
            },
            createNode: (A, q, K) => SM7.YAMLMap.from(A, q, K)
        };
    Ev3.map = kv3
})
// @from(Ln 127175, Col 4)
va = x((Iv3) => {
    var Lv3 = Yb6(),
        Rv3 = lz8(),
        hv3 = Zz1(),
        Sz1 = CY(),
        Sv3 = SJ(),
        Cv3 = Pa();
    class CM7 extends hv3.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:seq"
        }
        constructor(A) {
            super(Sz1.SEQ, A);
            this.items = []
        }
        add(A) {
            this.items.push(A)
        }
        delete(A) {
            let q = hz1(A);
            if (typeof q !== "number") return !1;
            return this.items.splice(q, 1).length > 0
        }
        get(A, q) {
            let K = hz1(A);
            if (typeof K !== "number") return;
            let Y = this.items[K];
            return !q && Sz1.isScalar(Y) ? Y.value : Y
        }
        has(A) {
            let q = hz1(A);
            return typeof q === "number" && q < this.items.length
        }
        set(A, q) {
            let K = hz1(A);
            if (typeof K !== "number") throw Error(`Expected a valid index, not ${A}.`);
            let Y = this.items[K];
            if (Sz1.isScalar(Y) && Sv3.isScalarValue(q)) Y.value = q;
            else this.items[K] = q
        }
        toJSON(A, q) {
            let K = [];
            if (q?.onCreate) q.onCreate(K);
            let Y = 0;
            for (let z of this.items) K.push(Cv3.toJS(z, String(Y++), q));
            return K
        }
        toString(A, q, K) {
            if (!A) return JSON.stringify(this);
            return Rv3.stringifyCollection(this, A, {
                blockItemPrefix: "- ",
                flowChars: {
                    start: "[",
                    end: "]"
                },
                itemIndent: (A.indent || "") + "  ",
                onChompKeep: K,
                onComment: q
            })
        }
        static from(A, q, K) {
            let {
                replacer: Y
            } = K, z = new this(A);
            if (q && Symbol.iterator in Object(q)) {
                let _ = 0;
                for (let w of q) {
                    if (typeof Y === "function") {
                        let O = q instanceof Set ? w : String(_++);
                        w = Y.call(q, O, w)
                    }
                    z.items.push(Lv3.createNode(w, void 0, K))
                }
            }
            return z
        }
    }

    function hz1(A) {
        let q = Sz1.isScalar(A) ? A.value : A;
        if (q && typeof q === "string") q = Number(q);
        return typeof q === "number" && Number.isInteger(q) && q >= 0 ? q : null
    }
    Iv3.YAMLSeq = CM7
})
// @from(Ln 127260, Col 4)
CM6 = x((mv3) => {
    var xv3 = CY(),
        IM7 = va(),
        uv3 = {
            collection: "seq",
            default: !0,
            nodeClass: IM7.YAMLSeq,
            tag: "tag:yaml.org,2002:seq",
            resolve(A, q) {
                if (!xv3.isSeq(A)) q("Expected a sequence for this tag");
                return A
            },
            createNode: (A, q, K) => IM7.YAMLSeq.from(A, q, K)
        };
    mv3.seq = uv3
})
// @from(Ln 127276, Col 4)
Jb6 = x((pv3) => {
    var gv3 = wb6(),
        Fv3 = {
            identify: (A) => typeof A === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (A) => A,
            stringify(A, q, K, Y) {
                return q = Object.assign({
                    actualString: !0
                }, q), gv3.stringifyString(A, q, K, Y)
            }
        };
    pv3.string = Fv3
})
// @from(Ln 127291, Col 4)
Cz1 = x((Uv3) => {
    var bM7 = SJ(),
        xM7 = {
            identify: (A) => A == null,
            createNode: () => new bM7.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^(?:~|[Nn]ull|NULL)?$/,
            resolve: () => new bM7.Scalar(null),
            stringify: ({
                source: A
            }, q) => typeof A === "string" && xM7.test.test(A) ? A : q.options.nullStr
        };
    Uv3.nullTag = xM7
})
// @from(Ln 127306, Col 4)
iz8 = x((lv3) => {
    var cv3 = SJ(),
        uM7 = {
            identify: (A) => typeof A === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
            resolve: (A) => new cv3.Scalar(A[0] === "t" || A[0] === "T"),
            stringify({
                source: A,
                value: q
            }, K) {
                if (A && uM7.test.test(A)) {
                    let Y = A[0] === "t" || A[0] === "T";
                    if (q === Y) return A
                }
                return q ? K.options.trueStr : K.options.falseStr
            }
        };
    lv3.boolTag = uM7
})
// @from(Ln 127327, Col 4)
IM6 = x((rv3) => {
    function nv3({
        format: A,
        minFractionDigits: q,
        tag: K,
        value: Y
    }) {
        if (typeof Y === "bigint") return String(Y);
        let z = typeof Y === "number" ? Y : Number(Y);
        if (!isFinite(z)) return isNaN(z) ? ".nan" : z < 0 ? "-.inf" : ".inf";
        let _ = JSON.stringify(Y);
        if (!A && q && (!K || K === "tag:yaml.org,2002:float") && /^\d/.test(_)) {
            let w = _.indexOf(".");
            if (w < 0) w = _.length, _ += ".";
            let O = q - (_.length - w - 1);
            while (O-- > 0) _ += "0"
        }
        return _
    }
    rv3.stringifyNumber = nv3
})
// @from(Ln 127348, Col 4)
rz8 = x((AN3) => {
    var av3 = SJ(),
        nz8 = IM6(),
        sv3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (A) => A.slice(-3).toLowerCase() === "nan" ? NaN : A[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: nz8.stringifyNumber
        },
        tv3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
            resolve: (A) => parseFloat(A),
            stringify(A) {
                let q = Number(A.value);
                return isFinite(q) ? q.toExponential() : nz8.stringifyNumber(A)
            }
        },
        ev3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
            resolve(A) {
                let q = new av3.Scalar(parseFloat(A)),
                    K = A.indexOf(".");
                if (K !== -1 && A[A.length - 1] === "0") q.minFractionDigits = A.length - K - 1;
                return q
            },
            stringify: nz8.stringifyNumber
        };
    AN3.float = ev3;
    AN3.floatExp = tv3;
    AN3.floatNaN = sv3
})
// @from(Ln 127388, Col 4)
az8 = x((ON3) => {
    var mM7 = IM6(),
        Iz1 = (A) => typeof A === "bigint" || Number.isInteger(A),
        oz8 = (A, q, K, {
            intAsBigInt: Y
        }) => Y ? BigInt(A) : parseInt(A.substring(q), K);

    function BM7(A, q, K) {
        let {
            value: Y
        } = A;
        if (Iz1(Y) && Y >= 0) return K + Y.toString(q);
        return mM7.stringifyNumber(A)
    }
    var zN3 = {
            identify: (A) => Iz1(A) && A >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^0o[0-7]+$/,
            resolve: (A, q, K) => oz8(A, 2, 8, K),
            stringify: (A) => BM7(A, 8, "0o")
        },
        _N3 = {
            identify: Iz1,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9]+$/,
            resolve: (A, q, K) => oz8(A, 0, 10, K),
            stringify: mM7.stringifyNumber
        },
        wN3 = {
            identify: (A) => Iz1(A) && A >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^0x[0-9a-fA-F]+$/,
            resolve: (A, q, K) => oz8(A, 2, 16, K),
            stringify: (A) => BM7(A, 16, "0x")
        };
    ON3.int = _N3;
    ON3.intHex = wN3;
    ON3.intOct = zN3
})
// @from(Ln 127432, Col 4)
gM7 = x((ZN3) => {
    var JN3 = SM6(),
        MN3 = Cz1(),
        DN3 = CM6(),
        XN3 = Jb6(),
        PN3 = iz8(),
        sz8 = rz8(),
        tz8 = az8(),
        WN3 = [JN3.map, DN3.seq, XN3.string, MN3.nullTag, PN3.boolTag, tz8.intOct, tz8.int, tz8.intHex, sz8.floatNaN, sz8.floatExp, sz8.float];
    ZN3.schema = WN3
})
// @from(Ln 127443, Col 4)
pM7 = x((EN3) => {
    var fN3 = SJ(),
        TN3 = SM6(),
        vN3 = CM6();

    function FM7(A) {
        return typeof A === "bigint" || Number.isInteger(A)
    }
    var bz1 = ({
            value: A
        }) => JSON.stringify(A),
        NN3 = [{
            identify: (A) => typeof A === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (A) => A,
            stringify: bz1
        }, {
            identify: (A) => A == null,
            createNode: () => new fN3.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^null$/,
            resolve: () => null,
            stringify: bz1
        }, {
            identify: (A) => typeof A === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^true$|^false$/,
            resolve: (A) => A === "true",
            stringify: bz1
        }, {
            identify: FM7,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^-?(?:0|[1-9][0-9]*)$/,
            resolve: (A, q, {
                intAsBigInt: K
            }) => K ? BigInt(A) : parseInt(A, 10),
            stringify: ({
                value: A
            }) => FM7(A) ? A.toString() : JSON.stringify(A)
        }, {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
            resolve: (A) => parseFloat(A),
            stringify: bz1
        }],
        VN3 = {
            default: !0,
            tag: "",
            test: /^/,
            resolve(A, q) {
                return q(`Unresolved plain scalar ${JSON.stringify(A)}`), A
            }
        },
        kN3 = [TN3.map, vN3.seq].concat(NN3, VN3);
    EN3.schema = kN3
})
// @from(Ln 127505, Col 4)
A_8 = x((hN3) => {
    var Mb6 = x6("buffer"),
        ez8 = SJ(),
        LN3 = wb6(),
        RN3 = {
            identify: (A) => A instanceof Uint8Array,
            default: !1,
            tag: "tag:yaml.org,2002:binary",
            resolve(A, q) {
                if (typeof Mb6.Buffer === "function") return Mb6.Buffer.from(A, "base64");
                else if (typeof atob === "function") {
                    let K = atob(A.replace(/[\n\r]/g, "")),
                        Y = new Uint8Array(K.length);
                    for (let z = 0; z < K.length; ++z) Y[z] = K.charCodeAt(z);
                    return Y
                } else return q("This environment does not support reading binary tags; either Buffer or atob is required"), A
            },
            stringify({
                comment: A,
                type: q,
                value: K
            }, Y, z, _) {
                if (!K) return "";
                let w = K,
                    O;
                if (typeof Mb6.Buffer === "function") O = w instanceof Mb6.Buffer ? w.toString("base64") : Mb6.Buffer.from(w.buffer).toString("base64");
                else if (typeof btoa === "function") {
                    let $ = "";
                    for (let H = 0; H < w.length; ++H) $ += String.fromCharCode(w[H]);
                    O = btoa($)
                } else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
                if (q ?? (q = ez8.Scalar.BLOCK_LITERAL), q !== ez8.Scalar.QUOTE_DOUBLE) {
                    let $ = Math.max(Y.options.lineWidth - Y.indent.length, Y.options.minContentWidth),
                        H = Math.ceil(O.length / $),
                        j = Array(H);
                    for (let J = 0, M = 0; J < H; ++J, M += $) j[J] = O.substr(M, $);
                    O = j.join(q === ez8.Scalar.BLOCK_LITERAL ? `
` : " ")
                }
                return LN3.stringifyString({
                    comment: A,
                    type: q,
                    value: O
                }, Y, z, _)
            }
        };
    hN3.binary = RN3
})
// @from(Ln 127553, Col 4)
uz1 = x((xN3) => {
    var xz1 = CY(),
        q_8 = Ga(),
        CN3 = SJ(),
        IN3 = va();

    function QM7(A, q) {
        if (xz1.isSeq(A))
            for (let K = 0; K < A.items.length; ++K) {
                let Y = A.items[K];
                if (xz1.isPair(Y)) continue;
                else if (xz1.isMap(Y)) {
                    if (Y.items.length > 1) q("Each pair must have its own sequence indicator");
                    let z = Y.items[0] || new q_8.Pair(new CN3.Scalar(null));
                    if (Y.commentBefore) z.key.commentBefore = z.key.commentBefore ? `${Y.commentBefore}
${z.key.commentBefore}` : Y.commentBefore;
                    if (Y.comment) {
                        let _ = z.value ?? z.key;
                        _.comment = _.comment ? `${Y.comment}
${_.comment}` : Y.comment
                    }
                    Y = z
                }
                A.items[K] = xz1.isPair(Y) ? Y : new q_8.Pair(Y)
            } else q("Expected a sequence for this tag");
        return A
    }

    function UM7(A, q, K) {
        let {
            replacer: Y
        } = K, z = new IN3.YAMLSeq(A);
        z.tag = "tag:yaml.org,2002:pairs";
        let _ = 0;
        if (q && Symbol.iterator in Object(q))
            for (let w of q) {
                if (typeof Y === "function") w = Y.call(q, String(_++), w);
                let O, $;
                if (Array.isArray(w))
                    if (w.length === 2) O = w[0], $ = w[1];
                    else throw TypeError(`Expected [key, value] tuple: ${w}`);
                else if (w && w instanceof Object) {
                    let H = Object.keys(w);
                    if (H.length === 1) O = H[0], $ = w[O];
                    else throw TypeError(`Expected tuple with one key, not ${H.length} keys`)
                } else O = w;
                z.items.push(q_8.createPair(O, $, K))
            }
        return z
    }
    var bN3 = {
        collection: "seq",
        default: !1,
        tag: "tag:yaml.org,2002:pairs",
        resolve: QM7,
        createNode: UM7
    };
    xN3.createPairs = UM7;
    xN3.pairs = bN3;
    xN3.resolvePairs = QM7
})
// @from(Ln 127614, Col 4)
Y_8 = x((pN3) => {
    var dM7 = CY(),
        K_8 = Pa(),
        Db6 = Ta(),
        gN3 = va(),
        cM7 = uz1();
    class Nq6 extends gN3.YAMLSeq {
        constructor() {
            super();
            this.add = Db6.YAMLMap.prototype.add.bind(this), this.delete = Db6.YAMLMap.prototype.delete.bind(this), this.get = Db6.YAMLMap.prototype.get.bind(this), this.has = Db6.YAMLMap.prototype.has.bind(this), this.set = Db6.YAMLMap.prototype.set.bind(this), this.tag = Nq6.tag
        }
        toJSON(A, q) {
            if (!q) return super.toJSON(A);
            let K = new Map;
            if (q?.onCreate) q.onCreate(K);
            for (let Y of this.items) {
                let z, _;
                if (dM7.isPair(Y)) z = K_8.toJS(Y.key, "", q), _ = K_8.toJS(Y.value, z, q);
                else z = K_8.toJS(Y, "", q);
                if (K.has(z)) throw Error("Ordered maps must not include duplicate keys");
                K.set(z, _)
            }
            return K
        }
        static from(A, q, K) {
            let Y = cM7.createPairs(A, q, K),
                z = new this;
            return z.items = Y.items, z
        }
    }
    Nq6.tag = "tag:yaml.org,2002:omap";
    var FN3 = {
        collection: "seq",
        identify: (A) => A instanceof Map,
        nodeClass: Nq6,
        default: !1,
        tag: "tag:yaml.org,2002:omap",
        resolve(A, q) {
            let K = cM7.resolvePairs(A, q),
                Y = [];
            for (let {
                    key: z
                }
                of K.items)
                if (dM7.isScalar(z))
                    if (Y.includes(z.value)) q(`Ordered maps must not include duplicate keys: ${z.value}`);
                    else Y.push(z.value);
            return Object.assign(new Nq6, K)
        },
        createNode: (A, q, K) => Nq6.from(A, q, K)
    };
    pN3.YAMLOMap = Nq6;
    pN3.omap = FN3
})
// @from(Ln 127668, Col 4)
oM7 = x((dN3) => {
    var lM7 = SJ();

    function iM7({
        value: A,
        source: q
    }, K) {
        if (q && (A ? nM7 : rM7).test.test(q)) return q;
        return A ? K.options.trueStr : K.options.falseStr
    }
    var nM7 = {
            identify: (A) => A === !0,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
            resolve: () => new lM7.Scalar(!0),
            stringify: iM7
        },
        rM7 = {
            identify: (A) => A === !1,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
            resolve: () => new lM7.Scalar(!1),
            stringify: iM7
        };
    dN3.falseTag = rM7;
    dN3.trueTag = nM7
})
// @from(Ln 127697, Col 4)
aM7 = x((aN3) => {
    var iN3 = SJ(),
        z_8 = IM6(),
        nN3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (A) => A.slice(-3).toLowerCase() === "nan" ? NaN : A[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: z_8.stringifyNumber
        },
        rN3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
            resolve: (A) => parseFloat(A.replace(/_/g, "")),
            stringify(A) {
                let q = Number(A.value);
                return isFinite(q) ? q.toExponential() : z_8.stringifyNumber(A)
            }
        },
        oN3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
            resolve(A) {
                let q = new iN3.Scalar(parseFloat(A.replace(/_/g, ""))),
                    K = A.indexOf(".");
                if (K !== -1) {
                    let Y = A.substring(K + 1).replace(/_/g, "");
                    if (Y[Y.length - 1] === "0") q.minFractionDigits = Y.length
                }
                return q
            },
            stringify: z_8.stringifyNumber
        };
    aN3.float = oN3;
    aN3.floatExp = rN3;
    aN3.floatNaN = nN3
})
// @from(Ln 127740, Col 4)
tM7 = x((zV3) => {
    var sM7 = IM6(),
        Xb6 = (A) => typeof A === "bigint" || Number.isInteger(A);

    function mz1(A, q, K, {
        intAsBigInt: Y
    }) {
        let z = A[0];
        if (z === "-" || z === "+") q += 1;
        if (A = A.substring(q).replace(/_/g, ""), Y) {
            switch (K) {
                case 2:
                    A = `0b${A}`;
                    break;
                case 8:
                    A = `0o${A}`;
                    break;
                case 16:
                    A = `0x${A}`;
                    break
            }
            let w = BigInt(A);
            return z === "-" ? BigInt(-1) * w : w
        }
        let _ = parseInt(A, K);
        return z === "-" ? -1 * _ : _
    }

    function __8(A, q, K) {
        let {
            value: Y
        } = A;
        if (Xb6(Y)) {
            let z = Y.toString(q);
            return Y < 0 ? "-" + K + z.substr(1) : K + z
        }
        return sM7.stringifyNumber(A)
    }
    var AV3 = {
            identify: Xb6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "BIN",
            test: /^[-+]?0b[0-1_]+$/,
            resolve: (A, q, K) => mz1(A, 2, 2, K),
            stringify: (A) => __8(A, 2, "0b")
        },
        qV3 = {
            identify: Xb6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^[-+]?0[0-7_]+$/,
            resolve: (A, q, K) => mz1(A, 1, 8, K),
            stringify: (A) => __8(A, 8, "0")
        },
        KV3 = {
            identify: Xb6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9][0-9_]*$/,
            resolve: (A, q, K) => mz1(A, 0, 10, K),
            stringify: sM7.stringifyNumber
        },
        YV3 = {
            identify: Xb6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^[-+]?0x[0-9a-fA-F_]+$/,
            resolve: (A, q, K) => mz1(A, 2, 16, K),
            stringify: (A) => __8(A, 16, "0x")
        };
    zV3.int = KV3;
    zV3.intBin = AV3;
    zV3.intHex = YV3;
    zV3.intOct = qV3
})
// @from(Ln 127818, Col 4)
w_8 = x((jV3) => {
    var Fz1 = CY(),
        Bz1 = Ga(),
        gz1 = Ta();
    class Vq6 extends gz1.YAMLMap {
        constructor(A) {
            super(A);
            this.tag = Vq6.tag
        }
        add(A) {
            let q;
            if (Fz1.isPair(A)) q = A;
            else if (A && typeof A === "object" && "key" in A && "value" in A && A.value === null) q = new Bz1.Pair(A.key, null);
            else q = new Bz1.Pair(A, null);
            if (!gz1.findPair(this.items, q.key)) this.items.push(q)
        }
        get(A, q) {
            let K = gz1.findPair(this.items, A);
            return !q && Fz1.isPair(K) ? Fz1.isScalar(K.key) ? K.key.value : K.key : K
        }
        set(A, q) {
            if (typeof q !== "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof q}`);
            let K = gz1.findPair(this.items, A);
            if (K && !q) this.items.splice(this.items.indexOf(K), 1);
            else if (!K && q) this.items.push(new Bz1.Pair(A))
        }
        toJSON(A, q) {
            return super.toJSON(A, q, Set)
        }
        toString(A, q, K) {
            if (!A) return JSON.stringify(this);
            if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, A, {
                allNullValues: !0
            }), q, K);
            else throw Error("Set items must all have null values")
        }
        static from(A, q, K) {
            let {
                replacer: Y
            } = K, z = new this(A);
            if (q && Symbol.iterator in Object(q))
                for (let _ of q) {
                    if (typeof Y === "function") _ = Y.call(q, _, _);
                    z.items.push(Bz1.createPair(_, null, K))
                }
            return z
        }
    }
    Vq6.tag = "tag:yaml.org,2002:set";
    var HV3 = {
        collection: "map",
        identify: (A) => A instanceof Set,
        nodeClass: Vq6,
        default: !1,
        tag: "tag:yaml.org,2002:set",
        createNode: (A, q, K) => Vq6.from(A, q, K),
        resolve(A, q) {
            if (Fz1.isMap(A))
                if (A.hasAllNullValues(!0)) return Object.assign(new Vq6, A);
                else q("Set items must all have null values");
            else q("Expected a mapping for this tag");
            return A
        }
    };
    jV3.YAMLSet = Vq6;
    jV3.set = HV3
})
// @from(Ln 127885, Col 4)
$_8 = x((WV3) => {
    var DV3 = IM6();

    function O_8(A, q) {
        let K = A[0],
            Y = K === "-" || K === "+" ? A.substring(1) : A,
            z = (w) => q ? BigInt(w) : Number(w),
            _ = Y.replace(/_/g, "").split(":").reduce((w, O) => w * z(60) + z(O), z(0));
        return K === "-" ? z(-1) * _ : _
    }

    function eM7(A) {
        let {
            value: q
        } = A, K = (w) => w;
        if (typeof q === "bigint") K = (w) => BigInt(w);
        else if (isNaN(q) || !isFinite(q)) return DV3.stringifyNumber(A);
        let Y = "";
        if (q < 0) Y = "-", q *= K(-1);
        let z = K(60),
            _ = [q % z];
        if (q < 60) _.unshift(0);
        else if (q = (q - _[0]) / z, _.unshift(q % z), q >= 60) q = (q - _[0]) / z, _.unshift(q);
        return Y + _.map((w) => String(w).padStart(2, "0")).join(":").replace(/000000\d*$/, "")
    }
    var XV3 = {
            identify: (A) => typeof A === "bigint" || Number.isInteger(A),
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
            resolve: (A, q, {
                intAsBigInt: K
            }) => O_8(A, K),
            stringify: eM7
        },
        PV3 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
            resolve: (A) => O_8(A, !1),
            stringify: eM7
        },
        AD7 = {
            identify: (A) => A instanceof Date,
            default: !0,
            tag: "tag:yaml.org,2002:timestamp",
            test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
            resolve(A) {
                let q = A.match(AD7.test);
                if (!q) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
                let [, K, Y, z, _, w, O] = q.map(Number), $ = q[7] ? Number((q[7] + "00").substr(1, 3)) : 0, H = Date.UTC(K, Y - 1, z, _ || 0, w || 0, O || 0, $), j = q[8];
                if (j && j !== "Z") {
                    let J = O_8(j, !1);
                    if (Math.abs(J) < 30) J *= 60;
                    H -= 60000 * J
                }
                return new Date(H)
            },
            stringify: ({
                value: A
            }) => A?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
        };
    WV3.floatTime = PV3;
    WV3.intTime = XV3;
    WV3.timestamp = AD7
})
// @from(Ln 127954, Col 4)
KD7 = x((SV3) => {
    var TV3 = SM6(),
        vV3 = Cz1(),
        NV3 = CM6(),
        VV3 = Jb6(),
        kV3 = A_8(),
        qD7 = oM7(),
        H_8 = aM7(),
        pz1 = tM7(),
        EV3 = Vz1(),
        yV3 = Y_8(),
        LV3 = uz1(),
        RV3 = w_8(),
        j_8 = $_8(),
        hV3 = [TV3.map, NV3.seq, VV3.string, vV3.nullTag, qD7.trueTag, qD7.falseTag, pz1.intBin, pz1.intOct, pz1.int, pz1.intHex, H_8.floatNaN, H_8.floatExp, H_8.float, kV3.binary, EV3.merge, yV3.omap, LV3.pairs, RV3.set, j_8.intTime, j_8.floatTime, j_8.timestamp];
    SV3.schema = hV3
})
// @from(Ln 127971, Col 4)
MD7 = x((FV3) => {
    var wD7 = SM6(),
        IV3 = Cz1(),
        OD7 = CM6(),
        bV3 = Jb6(),
        xV3 = iz8(),
        J_8 = rz8(),
        M_8 = az8(),
        uV3 = gM7(),
        mV3 = pM7(),
        $D7 = A_8(),
        Pb6 = Vz1(),
        HD7 = Y_8(),
        jD7 = uz1(),
        YD7 = KD7(),
        JD7 = w_8(),
        Qz1 = $_8(),
        zD7 = new Map([
            ["core", uV3.schema],
            ["failsafe", [wD7.map, OD7.seq, bV3.string]],
            ["json", mV3.schema],
            ["yaml11", YD7.schema],
            ["yaml-1.1", YD7.schema]
        ]),
        _D7 = {
            binary: $D7.binary,
            bool: xV3.boolTag,
            float: J_8.float,
            floatExp: J_8.floatExp,
            floatNaN: J_8.floatNaN,
            floatTime: Qz1.floatTime,
            int: M_8.int,
            intHex: M_8.intHex,
            intOct: M_8.intOct,
            intTime: Qz1.intTime,
            map: wD7.map,
            merge: Pb6.merge,
            null: IV3.nullTag,
            omap: HD7.omap,
            pairs: jD7.pairs,
            seq: OD7.seq,
            set: JD7.set,
            timestamp: Qz1.timestamp
        },
        BV3 = {
            "tag:yaml.org,2002:binary": $D7.binary,
            "tag:yaml.org,2002:merge": Pb6.merge,
            "tag:yaml.org,2002:omap": HD7.omap,
            "tag:yaml.org,2002:pairs": jD7.pairs,
            "tag:yaml.org,2002:set": JD7.set,
            "tag:yaml.org,2002:timestamp": Qz1.timestamp
        };

    function gV3(A, q, K) {
        let Y = zD7.get(q);
        if (Y && !A) return K && !Y.includes(Pb6.merge) ? Y.concat(Pb6.merge) : Y.slice();
        let z = Y;
        if (!z)
            if (Array.isArray(A)) z = [];
            else {
                let _ = Array.from(zD7.keys()).filter((w) => w !== "yaml11").map((w) => JSON.stringify(w)).join(", ");
                throw Error(`Unknown schema "${q}"; use one of ${_} or define customTags array`)
            } if (Array.isArray(A))
            for (let _ of A) z = z.concat(_);
        else if (typeof A === "function") z = A(z.slice());
        if (K) z = z.concat(Pb6.merge);
        return z.reduce((_, w) => {
            let O = typeof w === "string" ? _D7[w] : w;
            if (!O) {
                let $ = JSON.stringify(w),
                    H = Object.keys(_D7).map((j) => JSON.stringify(j)).join(", ");
                throw Error(`Unknown custom tag ${$}; use one of ${H}`)
            }
            if (!_.includes(O)) _.push(O);
            return _
        }, [])
    }
    FV3.coreKnownTags = BV3;
    FV3.getTags = gV3
})
// @from(Ln 128051, Col 4)
P_8 = x((iV3) => {
    var D_8 = CY(),
        UV3 = SM6(),
        dV3 = CM6(),
        cV3 = Jb6(),
        Uz1 = MD7(),
        lV3 = (A, q) => A.key < q.key ? -1 : A.key > q.key ? 1 : 0;
    class X_8 {
        constructor({
            compat: A,
            customTags: q,
            merge: K,
            resolveKnownTags: Y,
            schema: z,
            sortMapEntries: _,
            toStringDefaults: w
        }) {
            this.compat = Array.isArray(A) ? Uz1.getTags(A, "compat") : A ? Uz1.getTags(null, A) : null, this.name = typeof z === "string" && z || "core", this.knownTags = Y ? Uz1.coreKnownTags : {}, this.tags = Uz1.getTags(q, this.name, K), this.toStringOptions = w ?? null, Object.defineProperty(this, D_8.MAP, {
                value: UV3.map
            }), Object.defineProperty(this, D_8.SCALAR, {
                value: cV3.string
            }), Object.defineProperty(this, D_8.SEQ, {
                value: dV3.seq
            }), this.sortMapEntries = typeof _ === "function" ? _ : _ === !0 ? lV3 : null
        }
        clone() {
            let A = Object.create(X_8.prototype, Object.getOwnPropertyDescriptors(this));
            return A.tags = this.tags.slice(), A
        }
    }
    iV3.Schema = X_8
})
// @from(Ln 128083, Col 4)
DD7 = x((aV3) => {
    var rV3 = CY(),
        W_8 = Ob6(),
        Wb6 = zb6();

    function oV3(A, q) {
        let K = [],
            Y = q.directives === !0;
        if (q.directives !== !1 && A.directives) {
            let $ = A.directives.toString(A);
            if ($) K.push($), Y = !0;
            else if (A.directives.docStart) Y = !0
        }
        if (Y) K.push("---");
        let z = W_8.createStringifyContext(A, q),
            {
                commentString: _
            } = z.options;
        if (A.commentBefore) {
            if (K.length !== 1) K.unshift("");
            let $ = _(A.commentBefore);
            K.unshift(Wb6.indentComment($, ""))
        }
        let w = !1,
            O = null;
        if (A.contents) {
            if (rV3.isNode(A.contents)) {
                if (A.contents.spaceBefore && Y) K.push("");
                if (A.contents.commentBefore) {
                    let j = _(A.contents.commentBefore);
                    K.push(Wb6.indentComment(j, ""))
                }
                z.forceBlockIndent = !!A.comment, O = A.contents.comment
            }
            let $ = O ? void 0 : () => w = !0,
                H = W_8.stringify(A.contents, z, () => O = null, $);
            if (O) H += Wb6.lineComment(H, "", _(O));
            if ((H[0] === "|" || H[0] === ">") && K[K.length - 1] === "---") K[K.length - 1] = `--- ${H}`;
            else K.push(H)
        } else K.push(W_8.stringify(A.contents, z));
        if (A.directives?.docEnd)
            if (A.comment) {
                let $ = _(A.comment);
                if ($.includes(`
`)) K.push("..."), K.push(Wb6.indentComment($, ""));
                else K.push(`... ${$}`)
            } else K.push("...");
        else {
            let $ = A.comment;
            if ($ && w) $ = $.replace(/^\n+/, "");
            if ($) {
                if ((!w || O) && K[K.length - 1] !== "") K.push("");
                K.push(Wb6.indentComment(_($), ""))
            }
        }
        return K.join(`
`) + `
`
    }
    aV3.stringifyDocument = oV3
})
// @from(Ln 128144, Col 4)
Zb6 = x((_k3) => {
    var tV3 = Kb6(),
        bM6 = Zz1(),
        vL = CY(),
        eV3 = Ga(),
        Ak3 = Pa(),
        qk3 = P_8(),
        Kk3 = DD7(),
        Z_8 = Xz1(),
        Yk3 = mz8(),
        zk3 = Yb6(),
        G_8 = uz8();
    class f_8 {
        constructor(A, q, K) {
            this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, vL.NODE_TYPE, {
                value: vL.DOC
            });
            let Y = null;
            if (typeof q === "function" || Array.isArray(q)) Y = q;
            else if (K === void 0 && q) K = q, q = void 0;
            let z = Object.assign({
                intAsBigInt: !1,
                keepSourceTokens: !1,
                logLevel: "warn",
                prettyErrors: !0,
                strict: !0,
                stringKeys: !1,
                uniqueKeys: !0,
                version: "1.2"
            }, K);
            this.options = z;
            let {
                version: _
            } = z;
            if (K?._directives) {
                if (this.directives = K._directives.atDocument(), this.directives.yaml.explicit) _ = this.directives.yaml.version
            } else this.directives = new G_8.Directives({
                version: _
            });
            this.setSchema(_, K), this.contents = A === void 0 ? null : this.createNode(A, Y, K)
        }
        clone() {
            let A = Object.create(f_8.prototype, {
                [vL.NODE_TYPE]: {
                    value: vL.DOC
                }
            });
            if (A.commentBefore = this.commentBefore, A.comment = this.comment, A.errors = this.errors.slice(), A.warnings = this.warnings.slice(), A.options = Object.assign({}, this.options), this.directives) A.directives = this.directives.clone();
            if (A.schema = this.schema.clone(), A.contents = vL.isNode(this.contents) ? this.contents.clone(A.schema) : this.contents, this.range) A.range = this.range.slice();
            return A
        }
        add(A) {
            if (xM6(this.contents)) this.contents.add(A)
        }
        addIn(A, q) {
            if (xM6(this.contents)) this.contents.addIn(A, q)
        }
        createAlias(A, q) {
            if (!A.anchor) {
                let K = Z_8.anchorNames(this);
                A.anchor = !q || K.has(q) ? Z_8.findNewAnchor(q || "a", K) : q
            }
            return new tV3.Alias(A.anchor)
        }
        createNode(A, q, K) {
            let Y = void 0;
            if (typeof q === "function") A = q.call({
                "": A
            }, "", A), Y = q;
            else if (Array.isArray(q)) {
                let P = (Z) => typeof Z === "number" || Z instanceof String || Z instanceof Number,
                    W = q.filter(P).map(String);
                if (W.length > 0) q = q.concat(W);
                Y = q
            } else if (K === void 0 && q) K = q, q = void 0;
            let {
                aliasDuplicateObjects: z,
                anchorPrefix: _,
                flow: w,
                keepUndefined: O,
                onTagObj: $,
                tag: H
            } = K ?? {}, {
                onAnchor: j,
                setAnchors: J,
                sourceObjects: M
            } = Z_8.createNodeAnchors(this, _ || "a"), D = {
                aliasDuplicateObjects: z ?? !0,
                keepUndefined: O ?? !1,
                onAnchor: j,
                onTagObj: $,
                replacer: Y,
                schema: this.schema,
                sourceObjects: M
            }, X = zk3.createNode(A, H, D);
            if (w && vL.isCollection(X)) X.flow = !0;
            return J(), X
        }
        createPair(A, q, K = {}) {
            let Y = this.createNode(A, null, K),
                z = this.createNode(q, null, K);
            return new eV3.Pair(Y, z)
        }
        delete(A) {
            return xM6(this.contents) ? this.contents.delete(A) : !1
        }
        deleteIn(A) {
            if (bM6.isEmptyPath(A)) {
                if (this.contents == null) return !1;
                return this.contents = null, !0
            }
            return xM6(this.contents) ? this.contents.deleteIn(A) : !1
        }
        get(A, q) {
            return vL.isCollection(this.contents) ? this.contents.get(A, q) : void 0
        }
        getIn(A, q) {
            if (bM6.isEmptyPath(A)) return !q && vL.isScalar(this.contents) ? this.contents.value : this.contents;
            return vL.isCollection(this.contents) ? this.contents.getIn(A, q) : void 0
        }
        has(A) {
            return vL.isCollection(this.contents) ? this.contents.has(A) : !1
        }
        hasIn(A) {
            if (bM6.isEmptyPath(A)) return this.contents !== void 0;
            return vL.isCollection(this.contents) ? this.contents.hasIn(A) : !1
        }
        set(A, q) {
            if (this.contents == null) this.contents = bM6.collectionFromPath(this.schema, [A], q);
            else if (xM6(this.contents)) this.contents.set(A, q)
        }
        setIn(A, q) {
            if (bM6.isEmptyPath(A)) this.contents = q;
            else if (this.contents == null) this.contents = bM6.collectionFromPath(this.schema, Array.from(A), q);
            else if (xM6(this.contents)) this.contents.setIn(A, q)
        }
        setSchema(A, q = {}) {
            if (typeof A === "number") A = String(A);
            let K;
            switch (A) {
                case "1.1":
                    if (this.directives) this.directives.yaml.version = "1.1";
                    else this.directives = new G_8.Directives({
                        version: "1.1"
                    });
                    K = {
                        resolveKnownTags: !1,
                        schema: "yaml-1.1"
                    };
                    break;
                case "1.2":
                case "next":
                    if (this.directives) this.directives.yaml.version = A;
                    else this.directives = new G_8.Directives({
                        version: A
                    });
                    K = {
                        resolveKnownTags: !0,
                        schema: "core"
                    };
                    break;
                case null:
                    if (this.directives) delete this.directives;
                    K = null;
                    break;
                default: {
                    let Y = JSON.stringify(A);
                    throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${Y}`)
                }
            }
            if (q.schema instanceof Object) this.schema = q.schema;
            else if (K) this.schema = new qk3.Schema(Object.assign(K, q));
            else throw Error("With a null YAML version, the { schema: Schema } option is required")
        }
        toJS({
            json: A,
            jsonArg: q,
            mapAsMap: K,
            maxAliasCount: Y,
            onAnchor: z,
            reviver: _
        } = {}) {
            let w = {
                    anchors: new Map,
                    doc: this,
                    keep: !A,
                    mapAsMap: K === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof Y === "number" ? Y : 100
                },
                O = Ak3.toJS(this.contents, q ?? "", w);
            if (typeof z === "function")
                for (let {
                        count: $,
                        res: H
                    }
                    of w.anchors.values()) z(H, $);
            return typeof _ === "function" ? Yk3.applyReviver(_, {
                "": O
            }, "", O) : O
        }
        toJSON(A, q) {
            return this.toJS({
                json: !0,
                jsonArg: A,
                mapAsMap: !1,
                onAnchor: q
            })
        }
        toString(A = {}) {
            if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
            if ("indent" in A && (!Number.isInteger(A.indent) || Number(A.indent) <= 0)) {
                let q = JSON.stringify(A.indent);
                throw Error(`"indent" option must be a positive integer, not ${q}`)
            }
            return Kk3.stringifyDocument(this, A)
        }
    }

    function xM6(A) {
        if (vL.isCollection(A)) return !0;
        throw Error("Expected a YAML collection as document contents")
    }
    _k3.Document = f_8
})
// @from(Ln 128369, Col 4)
Gb6 = x(($k3) => {
    class dz1 extends Error {
        constructor(A, q, K, Y) {
            super();
            this.name = A, this.code = K, this.message = Y, this.pos = q
        }
    }
    class XD7 extends dz1 {
        constructor(A, q, K) {
            super("YAMLParseError", A, q, K)
        }
    }
    class PD7 extends dz1 {
        constructor(A, q, K) {
            super("YAMLWarning", A, q, K)
        }
    }
    var Ok3 = (A, q) => (K) => {
        if (K.pos[0] === -1) return;
        K.linePos = K.pos.map((O) => q.linePos(O));
        let {
            line: Y,
            col: z
        } = K.linePos[0];
        K.message += ` at line ${Y}, column ${z}`;
        let _ = z - 1,
            w = A.substring(q.lineStarts[Y - 1], q.lineStarts[Y]).replace(/[\n\r]+$/, "");
        if (_ >= 60 && w.length > 80) {
            let O = Math.min(_ - 39, w.length - 79);
            w = "…" + w.substring(O), _ -= O - 1
        }
        if (w.length > 80) w = w.substring(0, 79) + "…";
        if (Y > 1 && /^ *$/.test(w.substring(0, _))) {
            let O = A.substring(q.lineStarts[Y - 2], q.lineStarts[Y - 1]);
            if (O.length > 80) O = O.substring(0, 79) + `…
`;
            w = O + w
        }
        if (/[^ ]/.test(w)) {
            let O = 1,
                $ = K.linePos[1];
            if ($ && $.line === Y && $.col > z) O = Math.max(1, Math.min($.col - z, 80 - _));
            let H = " ".repeat(_) + "^".repeat(O);
            K.message += `:

${w}
${H}
`
        }
    };
    $k3.YAMLError = dz1;
    $k3.YAMLParseError = XD7;
    $k3.YAMLWarning = PD7;
    $k3.prettifyError = Ok3
})