
// @from(Ln 208121, Col 4)
$t6 = p((Tr_) => {
    var Mp = uP(),
        $K6 = hJ4(),
        UL8 = (q, K) => ({
            indentAtStart: K ? q.indent.length : q.indentAtStart,
            lineWidth: q.options.lineWidth,
            minContentWidth: q.options.minContentWidth
        }),
        QL8 = (q) => /^(%|---|\.\.\.)/m.test(q);

    function fr_(q, K, _) {
        if (!K || K < 0) return !1;
        let z = K - _,
            Y = q.length;
        if (Y <= z) return !1;
        for (let A = 0, O = 0; A < Y; ++A)
            if (q[A] === `
`) {
                if (A - O > z) return !0;
                if (O = A + 1, Y - O <= z) return !1
            } return !0
    }

    function wt6(q, K) {
        let _ = JSON.stringify(q);
        if (K.options.doubleQuotedAsJSON) return _;
        let {
            implicitKey: z
        } = K, Y = K.options.doubleQuotedMinMultiLineLength, A = K.indent || (QL8(q) ? "  " : ""), O = "", w = 0;
        for (let $ = 0, j = _[$]; j; j = _[++$]) {
            if (j === " " && _[$ + 1] === "\\" && _[$ + 2] === "n") O += _.slice(w, $) + "\\ ", $ += 1, w = $, j = "\\";
            if (j === "\\") switch (_[$ + 1]) {
                case "u": {
                    O += _.slice(w, $);
                    let H = _.substr($ + 2, 4);
                    switch (H) {
                        case "0000":
                            O += "\\0";
                            break;
                        case "0007":
                            O += "\\a";
                            break;
                        case "000b":
                            O += "\\v";
                            break;
                        case "001b":
                            O += "\\e";
                            break;
                        case "0085":
                            O += "\\N";
                            break;
                        case "00a0":
                            O += "\\_";
                            break;
                        case "2028":
                            O += "\\L";
                            break;
                        case "2029":
                            O += "\\P";
                            break;
                        default:
                            if (H.substr(0, 2) === "00") O += "\\x" + H.substr(2);
                            else O += _.substr($, 6)
                    }
                    $ += 5, w = $ + 1
                }
                break;
                case "n":
                    if (z || _[$ + 2] === '"' || _.length < Y) $ += 1;
                    else {
                        O += _.slice(w, $) + `

`;
                        while (_[$ + 2] === "\\" && _[$ + 3] === "n" && _[$ + 4] !== '"') O += `
`, $ += 2;
                        if (O += A, _[$ + 2] === " ") O += "\\";
                        $ += 1, w = $ + 1
                    }
                    break;
                default:
                    $ += 1
            }
        }
        return O = w ? O + _.slice(w) : _, z ? O : $K6.foldFlowLines(O, A, $K6.FOLD_QUOTED, UL8(K, !1))
    }

    function Np1(q, K) {
        if (K.options.singleQuote === !1 || K.implicitKey && q.includes(`
`) || /[ \t]\n|\n[ \t]/.test(q)) return wt6(q, K);
        let _ = K.indent || (QL8(q) ? "  " : ""),
            z = "'" + q.replace(/'/g, "''").replace(/\n+/g, `$&
${_}`) + "'";
        return K.implicitKey ? z : $K6.foldFlowLines(z, _, $K6.FOLD_FLOW, UL8(K, !1))
    }

    function oE6(q, K) {
        let {
            singleQuote: _
        } = K.options, z;
        if (_ === !1) z = wt6;
        else {
            let Y = q.includes('"'),
                A = q.includes("'");
            if (Y && !A) z = Np1;
            else if (A && !Y) z = wt6;
            else z = _ ? Np1 : wt6
        }
        return z(q, K)
    }
    var Ep1;
    try {
        Ep1 = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g")
    } catch {
        Ep1 = /\n+(?!\n|$)/g
    }

    function gL8({
        comment: q,
        type: K,
        value: _
    }, z, Y, A) {
        let {
            blockQuote: O,
            commentString: w,
            lineWidth: $
        } = z.options;
        if (!O || /\n[\t ]+$/.test(_)) return oE6(_, z);
        let j = z.indent || (z.forceBlockIndent || QL8(_) ? "  " : ""),
            H = O === "literal" ? !0 : O === "folded" || K === Mp.Scalar.BLOCK_FOLDED ? !1 : K === Mp.Scalar.BLOCK_LITERAL ? !0 : !fr_(_, $, j.length);
        if (!_) return H ? `|
` : `>
`;
        let J, X;
        for (X = _.length; X > 0; --X) {
            let V = _[X - 1];
            if (V !== `
` && V !== "\t" && V !== " ") break
        }
        let M = _.substring(X),
            P = M.indexOf(`
`);
        if (P === -1) J = "-";
        else if (_ === M || P !== M.length - 1) {
            if (J = "+", A) A()
        } else J = "";
        if (M) {
            if (_ = _.slice(0, -M.length), M[M.length - 1] === `
`) M = M.slice(0, -1);
            M = M.replace(Ep1, `$&${j}`)
        }
        let W = !1,
            D, Z = -1;
        for (D = 0; D < _.length; ++D) {
            let V = _[D];
            if (V === " ") W = !0;
            else if (V === `
`) Z = D;
            else break
        }
        let G = _.substring(0, Z < D ? Z + 1 : D);
        if (G) _ = _.substring(G.length), G = G.replace(/\n+/g, `$&${j}`);
        let v = (W ? j ? "2" : "1" : "") + J;
        if (q) {
            if (v += " " + w(q.replace(/ ?[\r\n]+/g, " ")), Y) Y()
        }
        if (!H) {
            let V = _.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${j}`),
                k = !1,
                N = UL8(z, !0);
            if (O !== "folded" && K !== Mp.Scalar.BLOCK_FOLDED) N.onOverflow = () => {
                k = !0
            };
            let R = $K6.foldFlowLines(`${G}${V}${M}`, j, $K6.FOLD_BLOCK, N);
            if (!k) return `>${v}
${j}${R}`
        }
        return _ = _.replace(/\n+/g, `$&${j}`), `|${v}
${j}${G}${_}${M}`
    }

    function Gr_(q, K, _, z) {
        let {
            type: Y,
            value: A
        } = q, {
            actualString: O,
            implicitKey: w,
            indent: $,
            indentStep: j,
            inFlow: H
        } = K;
        if (w && A.includes(`
`) || H && /[[\]{},]/.test(A)) return oE6(A, K);
        if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(A)) return w || H || !A.includes(`
`) ? oE6(A, K) : gL8(q, K, _, z);
        if (!w && !H && Y !== Mp.Scalar.PLAIN && A.includes(`
`)) return gL8(q, K, _, z);
        if (QL8(A)) {
            if ($ === "") return K.forceBlockIndent = !0, gL8(q, K, _, z);
            else if (w && $ === j) return oE6(A, K)
        }
        let J = A.replace(/\n+/g, `$&
${$}`);
        if (O) {
            let X = (W) => W.default && W.tag !== "tag:yaml.org,2002:str" && W.test?.test(J),
                {
                    compat: M,
                    tags: P
                } = K.doc.schema;
            if (P.some(X) || M?.some(X)) return oE6(A, K)
        }
        return w ? J : $K6.foldFlowLines(J, $, $K6.FOLD_FLOW, UL8(K, !1))
    }

    function vr_(q, K, _, z) {
        let {
            implicitKey: Y,
            inFlow: A
        } = K, O = typeof q.value === "string" ? q : Object.assign({}, q, {
            value: String(q.value)
        }), {
            type: w
        } = q;
        if (w !== Mp.Scalar.QUOTE_DOUBLE) {
            if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(O.value)) w = Mp.Scalar.QUOTE_DOUBLE
        }
        let $ = (H) => {
                switch (H) {
                    case Mp.Scalar.BLOCK_FOLDED:
                    case Mp.Scalar.BLOCK_LITERAL:
                        return Y || A ? oE6(O.value, K) : gL8(O, K, _, z);
                    case Mp.Scalar.QUOTE_DOUBLE:
                        return wt6(O.value, K);
                    case Mp.Scalar.QUOTE_SINGLE:
                        return Np1(O.value, K);
                    case Mp.Scalar.PLAIN:
                        return Gr_(O, K, _, z);
                    default:
                        return null
                }
            },
            j = $(w);
        if (j === null) {
            let {
                defaultKeyType: H,
                defaultStringType: J
            } = K.options, X = Y && H || J;
            if (j = $(X), j === null) throw Error(`Unsupported default string type ${X}`)
        }
        return j
    }
    Tr_.stringifyString = vr_
})
// @from(Ln 208378, Col 4)
jt6 = p((Sr_) => {
    var kr_ = mL8(),
        jK6 = YA(),
        Nr_ = Ot6(),
        Er_ = $t6();

    function yr_(q, K) {
        let _ = Object.assign({
                blockQuote: !0,
                commentString: Nr_.stringifyComment,
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
            }, q.schema.toStringOptions, K),
            z;
        switch (_.collectionStyle) {
            case "block":
                z = !1;
                break;
            case "flow":
                z = !0;
                break;
            default:
                z = null
        }
        return {
            anchors: new Set,
            doc: q,
            flowCollectionPadding: _.flowCollectionPadding ? " " : "",
            indent: "",
            indentStep: typeof _.indent === "number" ? " ".repeat(_.indent) : "  ",
            inFlow: z,
            options: _
        }
    }

    function Lr_(q, K) {
        if (K.tag) {
            let Y = q.filter((A) => A.tag === K.tag);
            if (Y.length > 0) return Y.find((A) => A.format === K.format) ?? Y[0]
        }
        let _ = void 0,
            z;
        if (jK6.isScalar(K)) {
            z = K.value;
            let Y = q.filter((A) => A.identify?.(z));
            if (Y.length > 1) {
                let A = Y.filter((O) => O.test);
                if (A.length > 0) Y = A
            }
            _ = Y.find((A) => A.format === K.format) ?? Y.find((A) => !A.format)
        } else z = K, _ = q.find((Y) => Y.nodeClass && z instanceof Y.nodeClass);
        if (!_) {
            let Y = z?.constructor?.name ?? (z === null ? "null" : typeof z);
            throw Error(`Tag not resolved for ${Y} value`)
        }
        return _
    }

    function hr_(q, K, {
        anchors: _,
        doc: z
    }) {
        if (!z.directives) return "";
        let Y = [],
            A = (jK6.isScalar(q) || jK6.isCollection(q)) && q.anchor;
        if (A && kr_.anchorIsValid(A)) _.add(A), Y.push(`&${A}`);
        let O = q.tag ?? (K.default ? null : K.tag);
        if (O) Y.push(z.directives.tagString(O));
        return Y.join(" ")
    }

    function Rr_(q, K, _, z) {
        if (jK6.isPair(q)) return q.toString(K, _, z);
        if (jK6.isAlias(q)) {
            if (K.doc.directives) return q.toString(K);
            if (K.resolvedAliases?.has(q)) throw TypeError("Cannot stringify circular structure without alias nodes");
            else {
                if (K.resolvedAliases) K.resolvedAliases.add(q);
                else K.resolvedAliases = new Set([q]);
                q = q.resolve(K.doc)
            }
        }
        let Y = void 0,
            A = jK6.isNode(q) ? q : K.doc.createNode(q, {
                onTagObj: ($) => Y = $
            });
        Y ?? (Y = Lr_(K.doc.schema.tags, A));
        let O = hr_(A, Y, K);
        if (O.length > 0) K.indentAtStart = (K.indentAtStart ?? 0) + O.length + 1;
        let w = typeof Y.stringify === "function" ? Y.stringify(A, K, _, z) : jK6.isScalar(A) ? Er_.stringifyString(A, K, _, z) : A.toString(K, _, z);
        if (!O) return w;
        return jK6.isScalar(A) || w[0] === "{" || w[0] === "[" ? `${O} ${w}` : `${O}
${K.indent}${w}`
    }
    Sr_.createStringifyContext = yr_;
    Sr_.stringify = Rr_
})
// @from(Ln 208488, Col 4)
CJ4 = p((xr_) => {
    var Ms = YA(),
        RJ4 = uP(),
        SJ4 = jt6(),
        Ht6 = Ot6();

    function Ir_({
        key: q,
        value: K
    }, _, z, Y) {
        let {
            allNullValues: A,
            doc: O,
            indent: w,
            indentStep: $,
            options: {
                commentString: j,
                indentSeq: H,
                simpleKeys: J
            }
        } = _, X = Ms.isNode(q) && q.comment || null;
        if (J) {
            if (X) throw Error("With simple keys, key nodes cannot have comments");
            if (Ms.isCollection(q) || !Ms.isNode(q) && typeof q === "object") throw Error("With simple keys, collection cannot be used as a key value")
        }
        let M = !J && (!q || X && K == null && !_.inFlow || Ms.isCollection(q) || (Ms.isScalar(q) ? q.type === RJ4.Scalar.BLOCK_FOLDED || q.type === RJ4.Scalar.BLOCK_LITERAL : typeof q === "object"));
        _ = Object.assign({}, _, {
            allNullValues: !1,
            implicitKey: !M && (J || !A),
            indent: w + $
        });
        let P = !1,
            W = !1,
            D = SJ4.stringify(q, _, () => P = !0, () => W = !0);
        if (!M && !_.inFlow && D.length > 1024) {
            if (J) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
            M = !0
        }
        if (_.inFlow) {
            if (A || K == null) {
                if (P && z) z();
                return D === "" ? "?" : M ? `? ${D}` : D
            }
        } else if (A && !J || K == null && M) {
            if (D = `? ${D}`, X && !P) D += Ht6.lineComment(D, _.indent, j(X));
            else if (W && Y) Y();
            return D
        }
        if (P) X = null;
        if (M) {
            if (X) D += Ht6.lineComment(D, _.indent, j(X));
            D = `? ${D}
${w}:`
        } else if (D = `${D}:`, X) D += Ht6.lineComment(D, _.indent, j(X));
        let Z, G, f;
        if (Ms.isNode(K)) Z = !!K.spaceBefore, G = K.commentBefore, f = K.comment;
        else if (Z = !1, G = null, f = null, K && typeof K === "object") K = O.createNode(K);
        if (_.implicitKey = !1, !M && !X && Ms.isScalar(K)) _.indentAtStart = D.length + 1;
        if (W = !1, !H && $.length >= 2 && !_.inFlow && !M && Ms.isSeq(K) && !K.flow && !K.tag && !K.anchor) _.indent = _.indent.substring(2);
        let v = !1,
            V = SJ4.stringify(K, _, () => v = !0, () => W = !0),
            k = " ";
        if (X || Z || G) {
            if (k = Z ? `
` : "", G) {
                let N = j(G);
                k += `
${Ht6.indentComment(N,_.indent)}`
            }
            if (V === "" && !_.inFlow) {
                if (k === `
`) k = `

`
            } else k += `
${_.indent}`
        } else if (!M && Ms.isCollection(K)) {
            let N = V[0],
                R = V.indexOf(`
`),
                h = R !== -1,
                C = _.inFlow ?? K.flow ?? K.items.length === 0;
            if (h || !C) {
                let x = !1;
                if (h && (N === "&" || N === "!")) {
                    let B = V.indexOf(" ");
                    if (N === "&" && B !== -1 && B < R && V[B + 1] === "!") B = V.indexOf(" ", B + 1);
                    if (B === -1 || R < B) x = !0
                }
                if (!x) k = `
${_.indent}`
            }
        } else if (V === "" || V[0] === `
`) k = "";
        if (D += k + V, _.inFlow) {
            if (v && z) z()
        } else if (f && !v) D += Ht6.lineComment(D, _.indent, j(f));
        else if (W && Y) Y();
        return D
    }
    xr_.stringifyPair = Ir_
})
// @from(Ln 208590, Col 4)
yp1 = p((pr_) => {
    var bJ4 = d6("process");

    function mr_(q, ...K) {
        if (q === "debug") console.log(...K)
    }

    function Br_(q, K) {
        if (q === "debug" || q === "warn")
            if (typeof bJ4.emitWarning === "function") bJ4.emitWarning(K);
            else console.warn(K)
    }
    pr_.debug = mr_;
    pr_.warn = Br_
})
// @from(Ln 208605, Col 4)
lL8 = p((Qr_) => {
    var Jt6 = YA(),
        IJ4 = uP(),
        dL8 = "<<",
        cL8 = {
            identify: (q) => q === dL8 || typeof q === "symbol" && q.description === dL8,
            default: "key",
            tag: "tag:yaml.org,2002:merge",
            test: /^<<$/,
            resolve: () => Object.assign(new IJ4.Scalar(Symbol(dL8)), {
                addToJSMap: xJ4
            }),
            stringify: () => dL8
        },
        Ur_ = (q, K) => (cL8.identify(K) || Jt6.isScalar(K) && (!K.type || K.type === IJ4.Scalar.PLAIN) && cL8.identify(K.value)) && q?.doc.schema.tags.some((_) => _.tag === cL8.tag && _.default);

    function xJ4(q, K, _) {
        if (_ = q && Jt6.isAlias(_) ? _.resolve(q.doc) : _, Jt6.isSeq(_))
            for (let z of _.items) Lp1(q, K, z);
        else if (Array.isArray(_))
            for (let z of _) Lp1(q, K, z);
        else Lp1(q, K, _)
    }

    function Lp1(q, K, _) {
        let z = q && Jt6.isAlias(_) ? _.resolve(q.doc) : _;
        if (!Jt6.isMap(z)) throw Error("Merge sources must be maps or map aliases");
        let Y = z.toJSON(null, q, Map);
        for (let [A, O] of Y)
            if (K instanceof Map) {
                if (!K.has(A)) K.set(A, O)
            } else if (K instanceof Set) K.add(A);
        else if (!Object.prototype.hasOwnProperty.call(K, A)) Object.defineProperty(K, A, {
            value: O,
            writable: !0,
            enumerable: !0,
            configurable: !0
        });
        return K
    }
    Qr_.addMergeToJSMap = xJ4;
    Qr_.isMergeKey = Ur_;
    Qr_.merge = cL8
})
// @from(Ln 208649, Col 4)
Rp1 = p((ar_) => {
    var nr_ = yp1(),
        uJ4 = lL8(),
        ir_ = jt6(),
        mJ4 = YA(),
        hp1 = wK6();

    function rr_(q, K, {
        key: _,
        value: z
    }) {
        if (mJ4.isNode(_) && _.addToJSMap) _.addToJSMap(q, K, z);
        else if (uJ4.isMergeKey(q, _)) uJ4.addMergeToJSMap(q, K, z);
        else {
            let Y = hp1.toJS(_, "", q);
            if (K instanceof Map) K.set(Y, hp1.toJS(z, Y, q));
            else if (K instanceof Set) K.add(Y);
            else {
                let A = or_(_, Y, q),
                    O = hp1.toJS(z, A, q);
                if (A in K) Object.defineProperty(K, A, {
                    value: O,
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                });
                else K[A] = O
            }
        }
        return K
    }

    function or_(q, K, _) {
        if (K === null) return "";
        if (typeof K !== "object") return String(K);
        if (mJ4.isNode(q) && _?.doc) {
            let z = ir_.createStringifyContext(_.doc, {});
            z.anchors = new Set;
            for (let A of _.anchors.keys()) z.anchors.add(A.anchor);
            z.inFlow = !0, z.inStringifyKey = !0;
            let Y = q.toString(z);
            if (!_.mapKeyWarned) {
                let A = JSON.stringify(Y);
                if (A.length > 40) A = A.substring(0, 36) + '..."';
                nr_.warn(_.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${A}. Set mapAsMap: true to use object keys.`), _.mapKeyWarned = !0
            }
            return Y
        }
        return JSON.stringify(K)
    }
    ar_.addPairToJSMap = rr_
})
// @from(Ln 208701, Col 4)
HK6 = p((Ko_) => {
    var BJ4 = At6(),
        tr_ = CJ4(),
        er_ = Rp1(),
        nL8 = YA();

    function qo_(q, K, _) {
        let z = BJ4.createNode(q, void 0, _),
            Y = BJ4.createNode(K, void 0, _);
        return new iL8(z, Y)
    }
    class iL8 {
        constructor(q, K = null) {
            Object.defineProperty(this, nL8.NODE_TYPE, {
                value: nL8.PAIR
            }), this.key = q, this.value = K
        }
        clone(q) {
            let {
                key: K,
                value: _
            } = this;
            if (nL8.isNode(K)) K = K.clone(q);
            if (nL8.isNode(_)) _ = _.clone(q);
            return new iL8(K, _)
        }
        toJSON(q, K) {
            let _ = K?.mapAsMap ? new Map : {};
            return er_.addPairToJSMap(K, _, this)
        }
        toString(q, K, _) {
            return q?.doc ? tr_.stringifyPair(this, q, K, _) : JSON.stringify(this)
        }
    }
    Ko_.Pair = iL8;
    Ko_.createPair = qo_
})
// @from(Ln 208738, Col 4)
Sp1 = p((wo_) => {
    var Xj6 = YA(),
        pJ4 = jt6(),
        rL8 = Ot6();

    function Yo_(q, K, _) {
        return (K.inFlow ?? q.flow ? Oo_ : Ao_)(q, K, _)
    }

    function Ao_({
        comment: q,
        items: K
    }, _, {
        blockItemPrefix: z,
        flowChars: Y,
        itemIndent: A,
        onChompKeep: O,
        onComment: w
    }) {
        let {
            indent: $,
            options: {
                commentString: j
            }
        } = _, H = Object.assign({}, _, {
            indent: A,
            type: null
        }), J = !1, X = [];
        for (let P = 0; P < K.length; ++P) {
            let W = K[P],
                D = null;
            if (Xj6.isNode(W)) {
                if (!J && W.spaceBefore) X.push("");
                if (oL8(_, X, W.commentBefore, J), W.comment) D = W.comment
            } else if (Xj6.isPair(W)) {
                let G = Xj6.isNode(W.key) ? W.key : null;
                if (G) {
                    if (!J && G.spaceBefore) X.push("");
                    oL8(_, X, G.commentBefore, J)
                }
            }
            J = !1;
            let Z = pJ4.stringify(W, H, () => D = null, () => J = !0);
            if (D) Z += rL8.lineComment(Z, A, j(D));
            if (J && D) J = !1;
            X.push(z + Z)
        }
        let M;
        if (X.length === 0) M = Y.start + Y.end;
        else {
            M = X[0];
            for (let P = 1; P < X.length; ++P) {
                let W = X[P];
                M += W ? `
${$}${W}` : `
`
            }
        }
        if (q) {
            if (M += `
` + rL8.indentComment(j(q), $), w) w()
        } else if (J && O) O();
        return M
    }

    function Oo_({
        items: q
    }, K, {
        flowChars: _,
        itemIndent: z
    }) {
        let {
            indent: Y,
            indentStep: A,
            flowCollectionPadding: O,
            options: {
                commentString: w
            }
        } = K;
        z += A;
        let $ = Object.assign({}, K, {
                indent: z,
                inFlow: !0,
                type: null
            }),
            j = !1,
            H = 0,
            J = [];
        for (let P = 0; P < q.length; ++P) {
            let W = q[P],
                D = null;
            if (Xj6.isNode(W)) {
                if (W.spaceBefore) J.push("");
                if (oL8(K, J, W.commentBefore, !1), W.comment) D = W.comment
            } else if (Xj6.isPair(W)) {
                let G = Xj6.isNode(W.key) ? W.key : null;
                if (G) {
                    if (G.spaceBefore) J.push("");
                    if (oL8(K, J, G.commentBefore, !1), G.comment) j = !0
                }
                let f = Xj6.isNode(W.value) ? W.value : null;
                if (f) {
                    if (f.comment) D = f.comment;
                    if (f.commentBefore) j = !0
                } else if (W.value == null && G?.comment) D = G.comment
            }
            if (D) j = !0;
            let Z = pJ4.stringify(W, $, () => D = null);
            if (P < q.length - 1) Z += ",";
            if (D) Z += rL8.lineComment(Z, z, w(D));
            if (!j && (J.length > H || Z.includes(`
`))) j = !0;
            J.push(Z), H = J.length
        }
        let {
            start: X,
            end: M
        } = _;
        if (J.length === 0) return X + M;
        else {
            if (!j) {
                let P = J.reduce((W, D) => W + D.length + 2, 2);
                j = K.options.lineWidth > 0 && P > K.options.lineWidth
            }
            if (j) {
                let P = X;
                for (let W of J) P += W ? `
${A}${Y}${W}` : `
`;
                return `${P}
${Y}${M}`
            } else return `${X}${O}${J.join(" ")}${O}${M}`
        }
    }

    function oL8({
        indent: q,
        options: {
            commentString: K
        }
    }, _, z, Y) {
        if (z && Y) z = z.replace(/^\n+/, "");
        if (z) {
            let A = rL8.indentComment(K(z), q);
            _.push(A.trimStart())
        }
    }
    wo_.stringifyCollection = Yo_
})
// @from(Ln 208887, Col 4)
XK6 = p((Mo_) => {
    var jo_ = Sp1(),
        Ho_ = Rp1(),
        Jo_ = FL8(),
        JK6 = YA(),
        aL8 = HK6(),
        Xo_ = uP();

    function Xt6(q, K) {
        let _ = JK6.isScalar(K) ? K.value : K;
        for (let z of q)
            if (JK6.isPair(z)) {
                if (z.key === K || z.key === _) return z;
                if (JK6.isScalar(z.key) && z.key.value === _) return z
            } return
    }
    class FJ4 extends Jo_.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:map"
        }
        constructor(q) {
            super(JK6.MAP, q);
            this.items = []
        }
        static from(q, K, _) {
            let {
                keepUndefined: z,
                replacer: Y
            } = _, A = new this(q), O = (w, $) => {
                if (typeof Y === "function") $ = Y.call(K, w, $);
                else if (Array.isArray(Y) && !Y.includes(w)) return;
                if ($ !== void 0 || z) A.items.push(aL8.createPair(w, $, _))
            };
            if (K instanceof Map)
                for (let [w, $] of K) O(w, $);
            else if (K && typeof K === "object")
                for (let w of Object.keys(K)) O(w, K[w]);
            if (typeof q.sortMapEntries === "function") A.items.sort(q.sortMapEntries);
            return A
        }
        add(q, K) {
            let _;
            if (JK6.isPair(q)) _ = q;
            else if (!q || typeof q !== "object" || !("key" in q)) _ = new aL8.Pair(q, q?.value);
            else _ = new aL8.Pair(q.key, q.value);
            let z = Xt6(this.items, _.key),
                Y = this.schema?.sortMapEntries;
            if (z) {
                if (!K) throw Error(`Key ${_.key} already set`);
                if (JK6.isScalar(z.value) && Xo_.isScalarValue(_.value)) z.value.value = _.value;
                else z.value = _.value
            } else if (Y) {
                let A = this.items.findIndex((O) => Y(_, O) < 0);
                if (A === -1) this.items.push(_);
                else this.items.splice(A, 0, _)
            } else this.items.push(_)
        }
        delete(q) {
            let K = Xt6(this.items, q);
            if (!K) return !1;
            return this.items.splice(this.items.indexOf(K), 1).length > 0
        }
        get(q, K) {
            let z = Xt6(this.items, q)?.value;
            return (!K && JK6.isScalar(z) ? z.value : z) ?? void 0
        }
        has(q) {
            return !!Xt6(this.items, q)
        }
        set(q, K) {
            this.add(new aL8.Pair(q, K), !0)
        }
        toJSON(q, K, _) {
            let z = _ ? new _ : K?.mapAsMap ? new Map : {};
            if (K?.onCreate) K.onCreate(z);
            for (let Y of this.items) Ho_.addPairToJSMap(K, z, Y);
            return z
        }
        toString(q, K, _) {
            if (!q) return JSON.stringify(this);
            for (let z of this.items)
                if (!JK6.isPair(z)) throw Error(`Map items must all be pairs; found ${JSON.stringify(z)} instead`);
            if (!q.allNullValues && this.hasAllNullValues(!1)) q = Object.assign({}, q, {
                allNullValues: !0
            });
            return jo_.stringifyCollection(this, q, {
                blockItemPrefix: "",
                flowChars: {
                    start: "{",
                    end: "}"
                },
                itemIndent: q.indent || "",
                onChompKeep: _,
                onComment: K
            })
        }
    }
    Mo_.YAMLMap = FJ4;
    Mo_.findPair = Xt6
})
// @from(Ln 208987, Col 4)
aE6 = p((fo_) => {
    var Do_ = YA(),
        gJ4 = XK6(),
        Zo_ = {
            collection: "map",
            default: !0,
            nodeClass: gJ4.YAMLMap,
            tag: "tag:yaml.org,2002:map",
            resolve(q, K) {
                if (!Do_.isMap(q)) K("Expected a mapping for this tag");
                return q
            },
            createNode: (q, K, _) => gJ4.YAMLMap.from(q, K, _)
        };
    fo_.map = Zo_
})
// @from(Ln 209003, Col 4)
MK6 = p((Eo_) => {
    var vo_ = At6(),
        To_ = Sp1(),
        Vo_ = FL8(),
        tL8 = YA(),
        ko_ = uP(),
        No_ = wK6();
    class UJ4 extends Vo_.Collection {
        static get tagName() {
            return "tag:yaml.org,2002:seq"
        }
        constructor(q) {
            super(tL8.SEQ, q);
            this.items = []
        }
        add(q) {
            this.items.push(q)
        }
        delete(q) {
            let K = sL8(q);
            if (typeof K !== "number") return !1;
            return this.items.splice(K, 1).length > 0
        }
        get(q, K) {
            let _ = sL8(q);
            if (typeof _ !== "number") return;
            let z = this.items[_];
            return !K && tL8.isScalar(z) ? z.value : z
        }
        has(q) {
            let K = sL8(q);
            return typeof K === "number" && K < this.items.length
        }
        set(q, K) {
            let _ = sL8(q);
            if (typeof _ !== "number") throw Error(`Expected a valid index, not ${q}.`);
            let z = this.items[_];
            if (tL8.isScalar(z) && ko_.isScalarValue(K)) z.value = K;
            else this.items[_] = K
        }
        toJSON(q, K) {
            let _ = [];
            if (K?.onCreate) K.onCreate(_);
            let z = 0;
            for (let Y of this.items) _.push(No_.toJS(Y, String(z++), K));
            return _
        }
        toString(q, K, _) {
            if (!q) return JSON.stringify(this);
            return To_.stringifyCollection(this, q, {
                blockItemPrefix: "- ",
                flowChars: {
                    start: "[",
                    end: "]"
                },
                itemIndent: (q.indent || "") + "  ",
                onChompKeep: _,
                onComment: K
            })
        }
        static from(q, K, _) {
            let {
                replacer: z
            } = _, Y = new this(q);
            if (K && Symbol.iterator in Object(K)) {
                let A = 0;
                for (let O of K) {
                    if (typeof z === "function") {
                        let w = K instanceof Set ? O : String(A++);
                        O = z.call(K, w, O)
                    }
                    Y.items.push(vo_.createNode(O, void 0, _))
                }
            }
            return Y
        }
    }

    function sL8(q) {
        let K = tL8.isScalar(q) ? q.value : q;
        if (K && typeof K === "string") K = Number(K);
        return typeof K === "number" && Number.isInteger(K) && K >= 0 ? K : null
    }
    Eo_.YAMLSeq = UJ4
})
// @from(Ln 209088, Col 4)
sE6 = p((Ro_) => {
    var Lo_ = YA(),
        QJ4 = MK6(),
        ho_ = {
            collection: "seq",
            default: !0,
            nodeClass: QJ4.YAMLSeq,
            tag: "tag:yaml.org,2002:seq",
            resolve(q, K) {
                if (!Lo_.isSeq(q)) K("Expected a sequence for this tag");
                return q
            },
            createNode: (q, K, _) => QJ4.YAMLSeq.from(q, K, _)
        };
    Ro_.seq = ho_
})
// @from(Ln 209104, Col 4)
Mt6 = p((Io_) => {
    var Co_ = $t6(),
        bo_ = {
            identify: (q) => typeof q === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (q) => q,
            stringify(q, K, _, z) {
                return K = Object.assign({
                    actualString: !0
                }, K), Co_.stringifyString(q, K, _, z)
            }
        };
    Io_.string = bo_
})
// @from(Ln 209119, Col 4)
eL8 = p((uo_) => {
    var dJ4 = uP(),
        cJ4 = {
            identify: (q) => q == null,
            createNode: () => new dJ4.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^(?:~|[Nn]ull|NULL)?$/,
            resolve: () => new dJ4.Scalar(null),
            stringify: ({
                source: q
            }, K) => typeof q === "string" && cJ4.test.test(q) ? q : K.options.nullStr
        };
    uo_.nullTag = cJ4
})
// @from(Ln 209134, Col 4)
Cp1 = p((po_) => {
    var Bo_ = uP(),
        lJ4 = {
            identify: (q) => typeof q === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
            resolve: (q) => new Bo_.Scalar(q[0] === "t" || q[0] === "T"),
            stringify({
                source: q,
                value: K
            }, _) {
                if (q && lJ4.test.test(q)) {
                    let z = q[0] === "t" || q[0] === "T";
                    if (K === z) return q
                }
                return K ? _.options.trueStr : _.options.falseStr
            }
        };
    po_.boolTag = lJ4
})
// @from(Ln 209155, Col 4)
tE6 = p((Uo_) => {
    function go_({
        format: q,
        minFractionDigits: K,
        tag: _,
        value: z
    }) {
        if (typeof z === "bigint") return String(z);
        let Y = typeof z === "number" ? z : Number(z);
        if (!isFinite(Y)) return isNaN(Y) ? ".nan" : Y < 0 ? "-.inf" : ".inf";
        let A = JSON.stringify(z);
        if (!q && K && (!_ || _ === "tag:yaml.org,2002:float") && /^\d/.test(A)) {
            let O = A.indexOf(".");
            if (O < 0) O = A.length, A += ".";
            let w = K - (A.length - O - 1);
            while (w-- > 0) A += "0"
        }
        return A
    }
    Uo_.stringifyNumber = go_
})
// @from(Ln 209176, Col 4)
Ip1 = p((io_) => {
    var do_ = uP(),
        bp1 = tE6(),
        co_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (q) => q.slice(-3).toLowerCase() === "nan" ? NaN : q[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: bp1.stringifyNumber
        },
        lo_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
            resolve: (q) => parseFloat(q),
            stringify(q) {
                let K = Number(q.value);
                return isFinite(K) ? K.toExponential() : bp1.stringifyNumber(q)
            }
        },
        no_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
            resolve(q) {
                let K = new do_.Scalar(parseFloat(q)),
                    _ = q.indexOf(".");
                if (_ !== -1 && q[q.length - 1] === "0") K.minFractionDigits = q.length - _ - 1;
                return K
            },
            stringify: bp1.stringifyNumber
        };
    io_.float = no_;
    io_.floatExp = lo_;
    io_.floatNaN = co_
})
// @from(Ln 209216, Col 4)
up1 = p((qa_) => {
    var nJ4 = tE6(),
        qh8 = (q) => typeof q === "bigint" || Number.isInteger(q),
        xp1 = (q, K, _, {
            intAsBigInt: z
        }) => z ? BigInt(q) : parseInt(q.substring(K), _);

    function iJ4(q, K, _) {
        let {
            value: z
        } = q;
        if (qh8(z) && z >= 0) return _ + z.toString(K);
        return nJ4.stringifyNumber(q)
    }
    var so_ = {
            identify: (q) => qh8(q) && q >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^0o[0-7]+$/,
            resolve: (q, K, _) => xp1(q, 2, 8, _),
            stringify: (q) => iJ4(q, 8, "0o")
        },
        to_ = {
            identify: qh8,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9]+$/,
            resolve: (q, K, _) => xp1(q, 0, 10, _),
            stringify: nJ4.stringifyNumber
        },
        eo_ = {
            identify: (q) => qh8(q) && q >= 0,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^0x[0-9a-fA-F]+$/,
            resolve: (q, K, _) => xp1(q, 2, 16, _),
            stringify: (q) => iJ4(q, 16, "0x")
        };
    qa_.int = to_;
    qa_.intHex = eo_;
    qa_.intOct = so_
})
// @from(Ln 209260, Col 4)
rJ4 = p((Ha_) => {
    var Ya_ = aE6(),
        Aa_ = eL8(),
        Oa_ = sE6(),
        wa_ = Mt6(),
        $a_ = Cp1(),
        mp1 = Ip1(),
        Bp1 = up1(),
        ja_ = [Ya_.map, Oa_.seq, wa_.string, Aa_.nullTag, $a_.boolTag, Bp1.intOct, Bp1.int, Bp1.intHex, mp1.floatNaN, mp1.floatExp, mp1.float];
    Ha_.schema = ja_
})
// @from(Ln 209271, Col 4)
aJ4 = p((fa_) => {
    var Xa_ = uP(),
        Ma_ = aE6(),
        Pa_ = sE6();

    function oJ4(q) {
        return typeof q === "bigint" || Number.isInteger(q)
    }
    var Kh8 = ({
            value: q
        }) => JSON.stringify(q),
        Wa_ = [{
            identify: (q) => typeof q === "string",
            default: !0,
            tag: "tag:yaml.org,2002:str",
            resolve: (q) => q,
            stringify: Kh8
        }, {
            identify: (q) => q == null,
            createNode: () => new Xa_.Scalar(null),
            default: !0,
            tag: "tag:yaml.org,2002:null",
            test: /^null$/,
            resolve: () => null,
            stringify: Kh8
        }, {
            identify: (q) => typeof q === "boolean",
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^true$|^false$/,
            resolve: (q) => q === "true",
            stringify: Kh8
        }, {
            identify: oJ4,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^-?(?:0|[1-9][0-9]*)$/,
            resolve: (q, K, {
                intAsBigInt: _
            }) => _ ? BigInt(q) : parseInt(q, 10),
            stringify: ({
                value: q
            }) => oJ4(q) ? q.toString() : JSON.stringify(q)
        }, {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
            resolve: (q) => parseFloat(q),
            stringify: Kh8
        }],
        Da_ = {
            default: !0,
            tag: "",
            test: /^/,
            resolve(q, K) {
                return K(`Unresolved plain scalar ${JSON.stringify(q)}`), q
            }
        },
        Za_ = [Ma_.map, Pa_.seq].concat(Wa_, Da_);
    fa_.schema = Za_
})
// @from(Ln 209333, Col 4)
Fp1 = p((Va_) => {
    var Pt6 = d6("buffer"),
        pp1 = uP(),
        va_ = $t6(),
        Ta_ = {
            identify: (q) => q instanceof Uint8Array,
            default: !1,
            tag: "tag:yaml.org,2002:binary",
            resolve(q, K) {
                if (typeof Pt6.Buffer === "function") return Pt6.Buffer.from(q, "base64");
                else if (typeof atob === "function") {
                    let _ = atob(q.replace(/[\n\r]/g, "")),
                        z = new Uint8Array(_.length);
                    for (let Y = 0; Y < _.length; ++Y) z[Y] = _.charCodeAt(Y);
                    return z
                } else return K("This environment does not support reading binary tags; either Buffer or atob is required"), q
            },
            stringify({
                comment: q,
                type: K,
                value: _
            }, z, Y, A) {
                if (!_) return "";
                let O = _,
                    w;
                if (typeof Pt6.Buffer === "function") w = O instanceof Pt6.Buffer ? O.toString("base64") : Pt6.Buffer.from(O.buffer).toString("base64");
                else if (typeof btoa === "function") {
                    let $ = "";
                    for (let j = 0; j < O.length; ++j) $ += String.fromCharCode(O[j]);
                    w = btoa($)
                } else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
                if (K ?? (K = pp1.Scalar.BLOCK_LITERAL), K !== pp1.Scalar.QUOTE_DOUBLE) {
                    let $ = Math.max(z.options.lineWidth - z.indent.length, z.options.minContentWidth),
                        j = Math.ceil(w.length / $),
                        H = Array(j);
                    for (let J = 0, X = 0; J < j; ++J, X += $) H[J] = w.substr(X, $);
                    w = H.join(K === pp1.Scalar.BLOCK_LITERAL ? `
` : " ")
                }
                return va_.stringifyString({
                    comment: q,
                    type: K,
                    value: w
                }, z, Y, A)
            }
        };
    Va_.binary = Ta_
})
// @from(Ln 209381, Col 4)
zh8 = p((La_) => {
    var _h8 = YA(),
        gp1 = HK6(),
        Na_ = uP(),
        Ea_ = MK6();

    function sJ4(q, K) {
        if (_h8.isSeq(q))
            for (let _ = 0; _ < q.items.length; ++_) {
                let z = q.items[_];
                if (_h8.isPair(z)) continue;
                else if (_h8.isMap(z)) {
                    if (z.items.length > 1) K("Each pair must have its own sequence indicator");
                    let Y = z.items[0] || new gp1.Pair(new Na_.Scalar(null));
                    if (z.commentBefore) Y.key.commentBefore = Y.key.commentBefore ? `${z.commentBefore}
${Y.key.commentBefore}` : z.commentBefore;
                    if (z.comment) {
                        let A = Y.value ?? Y.key;
                        A.comment = A.comment ? `${z.comment}
${A.comment}` : z.comment
                    }
                    z = Y
                }
                q.items[_] = _h8.isPair(z) ? z : new gp1.Pair(z)
            } else K("Expected a sequence for this tag");
        return q
    }

    function tJ4(q, K, _) {
        let {
            replacer: z
        } = _, Y = new Ea_.YAMLSeq(q);
        Y.tag = "tag:yaml.org,2002:pairs";
        let A = 0;
        if (K && Symbol.iterator in Object(K))
            for (let O of K) {
                if (typeof z === "function") O = z.call(K, String(A++), O);
                let w, $;
                if (Array.isArray(O))
                    if (O.length === 2) w = O[0], $ = O[1];
                    else throw TypeError(`Expected [key, value] tuple: ${O}`);
                else if (O && O instanceof Object) {
                    let j = Object.keys(O);
                    if (j.length === 1) w = j[0], $ = O[w];
                    else throw TypeError(`Expected tuple with one key, not ${j.length} keys`)
                } else w = O;
                Y.items.push(gp1.createPair(w, $, _))
            }
        return Y
    }
    var ya_ = {
        collection: "seq",
        default: !1,
        tag: "tag:yaml.org,2002:pairs",
        resolve: sJ4,
        createNode: tJ4
    };
    La_.createPairs = tJ4;
    La_.pairs = ya_;
    La_.resolvePairs = sJ4
})
// @from(Ln 209442, Col 4)
Qp1 = p((Ia_) => {
    var eJ4 = YA(),
        Up1 = wK6(),
        Wt6 = XK6(),
        Ca_ = MK6(),
        qX4 = zh8();
    class Mj6 extends Ca_.YAMLSeq {
        constructor() {
            super();
            this.add = Wt6.YAMLMap.prototype.add.bind(this), this.delete = Wt6.YAMLMap.prototype.delete.bind(this), this.get = Wt6.YAMLMap.prototype.get.bind(this), this.has = Wt6.YAMLMap.prototype.has.bind(this), this.set = Wt6.YAMLMap.prototype.set.bind(this), this.tag = Mj6.tag
        }
        toJSON(q, K) {
            if (!K) return super.toJSON(q);
            let _ = new Map;
            if (K?.onCreate) K.onCreate(_);
            for (let z of this.items) {
                let Y, A;
                if (eJ4.isPair(z)) Y = Up1.toJS(z.key, "", K), A = Up1.toJS(z.value, Y, K);
                else Y = Up1.toJS(z, "", K);
                if (_.has(Y)) throw Error("Ordered maps must not include duplicate keys");
                _.set(Y, A)
            }
            return _
        }
        static from(q, K, _) {
            let z = qX4.createPairs(q, K, _),
                Y = new this;
            return Y.items = z.items, Y
        }
    }
    Mj6.tag = "tag:yaml.org,2002:omap";
    var ba_ = {
        collection: "seq",
        identify: (q) => q instanceof Map,
        nodeClass: Mj6,
        default: !1,
        tag: "tag:yaml.org,2002:omap",
        resolve(q, K) {
            let _ = qX4.resolvePairs(q, K),
                z = [];
            for (let {
                    key: Y
                }
                of _.items)
                if (eJ4.isScalar(Y))
                    if (z.includes(Y.value)) K(`Ordered maps must not include duplicate keys: ${Y.value}`);
                    else z.push(Y.value);
            return Object.assign(new Mj6, _)
        },
        createNode: (q, K, _) => Mj6.from(q, K, _)
    };
    Ia_.YAMLOMap = Mj6;
    Ia_.omap = ba_
})
// @from(Ln 209496, Col 4)
AX4 = p((ma_) => {
    var KX4 = uP();

    function _X4({
        value: q,
        source: K
    }, _) {
        if (K && (q ? zX4 : YX4).test.test(K)) return K;
        return q ? _.options.trueStr : _.options.falseStr
    }
    var zX4 = {
            identify: (q) => q === !0,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
            resolve: () => new KX4.Scalar(!0),
            stringify: _X4
        },
        YX4 = {
            identify: (q) => q === !1,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
            resolve: () => new KX4.Scalar(!1),
            stringify: _X4
        };
    ma_.falseTag = YX4;
    ma_.trueTag = zX4
})
// @from(Ln 209525, Col 4)
OX4 = p((da_) => {
    var Fa_ = uP(),
        dp1 = tE6(),
        ga_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (q) => q.slice(-3).toLowerCase() === "nan" ? NaN : q[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: dp1.stringifyNumber
        },
        Ua_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
            resolve: (q) => parseFloat(q.replace(/_/g, "")),
            stringify(q) {
                let K = Number(q.value);
                return isFinite(K) ? K.toExponential() : dp1.stringifyNumber(q)
            }
        },
        Qa_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
            resolve(q) {
                let K = new Fa_.Scalar(parseFloat(q.replace(/_/g, ""))),
                    _ = q.indexOf(".");
                if (_ !== -1) {
                    let z = q.substring(_ + 1).replace(/_/g, "");
                    if (z[z.length - 1] === "0") K.minFractionDigits = z.length
                }
                return K
            },
            stringify: dp1.stringifyNumber
        };
    da_.float = Qa_;
    da_.floatExp = Ua_;
    da_.floatNaN = ga_
})
// @from(Ln 209568, Col 4)
$X4 = p((sa_) => {
    var wX4 = tE6(),
        Dt6 = (q) => typeof q === "bigint" || Number.isInteger(q);

    function Yh8(q, K, _, {
        intAsBigInt: z
    }) {
        let Y = q[0];
        if (Y === "-" || Y === "+") K += 1;
        if (q = q.substring(K).replace(/_/g, ""), z) {
            switch (_) {
                case 2:
                    q = `0b${q}`;
                    break;
                case 8:
                    q = `0o${q}`;
                    break;
                case 16:
                    q = `0x${q}`;
                    break
            }
            let O = BigInt(q);
            return Y === "-" ? BigInt(-1) * O : O
        }
        let A = parseInt(q, _);
        return Y === "-" ? -1 * A : A
    }

    function cp1(q, K, _) {
        let {
            value: z
        } = q;
        if (Dt6(z)) {
            let Y = z.toString(K);
            return z < 0 ? "-" + _ + Y.substr(1) : _ + Y
        }
        return wX4.stringifyNumber(q)
    }
    var ia_ = {
            identify: Dt6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "BIN",
            test: /^[-+]?0b[0-1_]+$/,
            resolve: (q, K, _) => Yh8(q, 2, 2, _),
            stringify: (q) => cp1(q, 2, "0b")
        },
        ra_ = {
            identify: Dt6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^[-+]?0[0-7_]+$/,
            resolve: (q, K, _) => Yh8(q, 1, 8, _),
            stringify: (q) => cp1(q, 8, "0")
        },
        oa_ = {
            identify: Dt6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9][0-9_]*$/,
            resolve: (q, K, _) => Yh8(q, 0, 10, _),
            stringify: wX4.stringifyNumber
        },
        aa_ = {
            identify: Dt6,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^[-+]?0x[0-9a-fA-F_]+$/,
            resolve: (q, K, _) => Yh8(q, 2, 16, _),
            stringify: (q) => cp1(q, 16, "0x")
        };
    sa_.int = oa_;
    sa_.intBin = ia_;
    sa_.intHex = aa_;
    sa_.intOct = ra_
})
// @from(Ln 209646, Col 4)
lp1 = p((zs_) => {
    var wh8 = YA(),
        Ah8 = HK6(),
        Oh8 = XK6();
    class Pj6 extends Oh8.YAMLMap {
        constructor(q) {
            super(q);
            this.tag = Pj6.tag
        }
        add(q) {
            let K;
            if (wh8.isPair(q)) K = q;
            else if (q && typeof q === "object" && "key" in q && "value" in q && q.value === null) K = new Ah8.Pair(q.key, null);
            else K = new Ah8.Pair(q, null);
            if (!Oh8.findPair(this.items, K.key)) this.items.push(K)
        }
        get(q, K) {
            let _ = Oh8.findPair(this.items, q);
            return !K && wh8.isPair(_) ? wh8.isScalar(_.key) ? _.key.value : _.key : _
        }
        set(q, K) {
            if (typeof K !== "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof K}`);
            let _ = Oh8.findPair(this.items, q);
            if (_ && !K) this.items.splice(this.items.indexOf(_), 1);
            else if (!_ && K) this.items.push(new Ah8.Pair(q))
        }
        toJSON(q, K) {
            return super.toJSON(q, K, Set)
        }
        toString(q, K, _) {
            if (!q) return JSON.stringify(this);
            if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, q, {
                allNullValues: !0
            }), K, _);
            else throw Error("Set items must all have null values")
        }
        static from(q, K, _) {
            let {
                replacer: z
            } = _, Y = new this(q);
            if (K && Symbol.iterator in Object(K))
                for (let A of K) {
                    if (typeof z === "function") A = z.call(K, A, A);
                    Y.items.push(Ah8.createPair(A, null, _))
                }
            return Y
        }
    }
    Pj6.tag = "tag:yaml.org,2002:set";
    var _s_ = {
        collection: "map",
        identify: (q) => q instanceof Set,
        nodeClass: Pj6,
        default: !1,
        tag: "tag:yaml.org,2002:set",
        createNode: (q, K, _) => Pj6.from(q, K, _),
        resolve(q, K) {
            if (wh8.isMap(q))
                if (q.hasAllNullValues(!0)) return Object.assign(new Pj6, q);
                else K("Set items must all have null values");
            else K("Expected a mapping for this tag");
            return q
        }
    };
    zs_.YAMLSet = Pj6;
    zs_.set = _s_
})
// @from(Ln 209713, Col 4)
ip1 = p((js_) => {
    var Os_ = tE6();

    function np1(q, K) {
        let _ = q[0],
            z = _ === "-" || _ === "+" ? q.substring(1) : q,
            Y = (O) => K ? BigInt(O) : Number(O),
            A = z.replace(/_/g, "").split(":").reduce((O, w) => O * Y(60) + Y(w), Y(0));
        return _ === "-" ? Y(-1) * A : A
    }

    function jX4(q) {
        let {
            value: K
        } = q, _ = (O) => O;
        if (typeof K === "bigint") _ = (O) => BigInt(O);
        else if (isNaN(K) || !isFinite(K)) return Os_.stringifyNumber(q);
        let z = "";
        if (K < 0) z = "-", K *= _(-1);
        let Y = _(60),
            A = [K % Y];
        if (K < 60) A.unshift(0);
        else if (K = (K - A[0]) / Y, A.unshift(K % Y), K >= 60) K = (K - A[0]) / Y, A.unshift(K);
        return z + A.map((O) => String(O).padStart(2, "0")).join(":").replace(/000000\d*$/, "")
    }
    var ws_ = {
            identify: (q) => typeof q === "bigint" || Number.isInteger(q),
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
            resolve: (q, K, {
                intAsBigInt: _
            }) => np1(q, _),
            stringify: jX4
        },
        $s_ = {
            identify: (q) => typeof q === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
            resolve: (q) => np1(q, !1),
            stringify: jX4
        },
        HX4 = {
            identify: (q) => q instanceof Date,
            default: !0,
            tag: "tag:yaml.org,2002:timestamp",
            test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
            resolve(q) {
                let K = q.match(HX4.test);
                if (!K) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
                let [, _, z, Y, A, O, w] = K.map(Number), $ = K[7] ? Number((K[7] + "00").substr(1, 3)) : 0, j = Date.UTC(_, z - 1, Y, A || 0, O || 0, w || 0, $), H = K[8];
                if (H && H !== "Z") {
                    let J = np1(H, !1);
                    if (Math.abs(J) < 30) J *= 60;
                    j -= 60000 * J
                }
                return new Date(j)
            },
            stringify: ({
                value: q
            }) => q?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
        };
    js_.floatTime = $s_;
    js_.intTime = ws_;
    js_.timestamp = HX4
})
// @from(Ln 209782, Col 4)
XX4 = p((ks_) => {
    var Ms_ = aE6(),
        Ps_ = eL8(),
        Ws_ = sE6(),
        Ds_ = Mt6(),
        Zs_ = Fp1(),
        JX4 = AX4(),
        rp1 = OX4(),
        $h8 = $X4(),
        fs_ = lL8(),
        Gs_ = Qp1(),
        vs_ = zh8(),
        Ts_ = lp1(),
        op1 = ip1(),
        Vs_ = [Ms_.map, Ws_.seq, Ds_.string, Ps_.nullTag, JX4.trueTag, JX4.falseTag, $h8.intBin, $h8.intOct, $h8.int, $h8.intHex, rp1.floatNaN, rp1.floatExp, rp1.float, Zs_.binary, fs_.merge, Gs_.omap, vs_.pairs, Ts_.set, op1.intTime, op1.floatTime, op1.timestamp];
    ks_.schema = Vs_
})
// @from(Ln 209799, Col 4)
VX4 = p((bs_) => {
    var DX4 = aE6(),
        Es_ = eL8(),
        ZX4 = sE6(),
        ys_ = Mt6(),
        Ls_ = Cp1(),
        ap1 = Ip1(),
        sp1 = up1(),
        hs_ = rJ4(),
        Rs_ = aJ4(),
        fX4 = Fp1(),
        Zt6 = lL8(),
        GX4 = Qp1(),
        vX4 = zh8(),
        MX4 = XX4(),
        TX4 = lp1(),
        jh8 = ip1(),
        PX4 = new Map([
            ["core", hs_.schema],
            ["failsafe", [DX4.map, ZX4.seq, ys_.string]],
            ["json", Rs_.schema],
            ["yaml11", MX4.schema],
            ["yaml-1.1", MX4.schema]
        ]),
        WX4 = {
            binary: fX4.binary,
            bool: Ls_.boolTag,
            float: ap1.float,
            floatExp: ap1.floatExp,
            floatNaN: ap1.floatNaN,
            floatTime: jh8.floatTime,
            int: sp1.int,
            intHex: sp1.intHex,
            intOct: sp1.intOct,
            intTime: jh8.intTime,
            map: DX4.map,
            merge: Zt6.merge,
            null: Es_.nullTag,
            omap: GX4.omap,
            pairs: vX4.pairs,
            seq: ZX4.seq,
            set: TX4.set,
            timestamp: jh8.timestamp
        },
        Ss_ = {
            "tag:yaml.org,2002:binary": fX4.binary,
            "tag:yaml.org,2002:merge": Zt6.merge,
            "tag:yaml.org,2002:omap": GX4.omap,
            "tag:yaml.org,2002:pairs": vX4.pairs,
            "tag:yaml.org,2002:set": TX4.set,
            "tag:yaml.org,2002:timestamp": jh8.timestamp
        };

    function Cs_(q, K, _) {
        let z = PX4.get(K);
        if (z && !q) return _ && !z.includes(Zt6.merge) ? z.concat(Zt6.merge) : z.slice();
        let Y = z;
        if (!Y)
            if (Array.isArray(q)) Y = [];
            else {
                let A = Array.from(PX4.keys()).filter((O) => O !== "yaml11").map((O) => JSON.stringify(O)).join(", ");
                throw Error(`Unknown schema "${K}"; use one of ${A} or define customTags array`)
            } if (Array.isArray(q))
            for (let A of q) Y = Y.concat(A);
        else if (typeof q === "function") Y = q(Y.slice());
        if (_) Y = Y.concat(Zt6.merge);
        return Y.reduce((A, O) => {
            let w = typeof O === "string" ? WX4[O] : O;
            if (!w) {
                let $ = JSON.stringify(O),
                    j = Object.keys(WX4).map((H) => JSON.stringify(H)).join(", ");
                throw Error(`Unknown custom tag ${$}; use one of ${j}`)
            }
            if (!A.includes(w)) A.push(w);
            return A
        }, [])
    }
    bs_.coreKnownTags = Ss_;
    bs_.getTags = Cs_
})
// @from(Ln 209879, Col 4)
qF1 = p((Fs_) => {
    var tp1 = YA(),
        us_ = aE6(),
        ms_ = sE6(),
        Bs_ = Mt6(),
        Hh8 = VX4(),
        ps_ = (q, K) => q.key < K.key ? -1 : q.key > K.key ? 1 : 0;
    class ep1 {
        constructor({
            compat: q,
            customTags: K,
            merge: _,
            resolveKnownTags: z,
            schema: Y,
            sortMapEntries: A,
            toStringDefaults: O
        }) {
            this.compat = Array.isArray(q) ? Hh8.getTags(q, "compat") : q ? Hh8.getTags(null, q) : null, this.name = typeof Y === "string" && Y || "core", this.knownTags = z ? Hh8.coreKnownTags : {}, this.tags = Hh8.getTags(K, this.name, _), this.toStringOptions = O ?? null, Object.defineProperty(this, tp1.MAP, {
                value: us_.map
            }), Object.defineProperty(this, tp1.SCALAR, {
                value: Bs_.string
            }), Object.defineProperty(this, tp1.SEQ, {
                value: ms_.seq
            }), this.sortMapEntries = typeof A === "function" ? A : A === !0 ? ps_ : null
        }
        clone() {
            let q = Object.create(ep1.prototype, Object.getOwnPropertyDescriptors(this));
            return q.tags = this.tags.slice(), q
        }
    }
    Fs_.Schema = ep1
})
// @from(Ln 209911, Col 4)
kX4 = p((ds_) => {
    var Us_ = YA(),
        KF1 = jt6(),
        ft6 = Ot6();

    function Qs_(q, K) {
        let _ = [],
            z = K.directives === !0;
        if (K.directives !== !1 && q.directives) {
            let $ = q.directives.toString(q);
            if ($) _.push($), z = !0;
            else if (q.directives.docStart) z = !0
        }
        if (z) _.push("---");
        let Y = KF1.createStringifyContext(q, K),
            {
                commentString: A
            } = Y.options;
        if (q.commentBefore) {
            if (_.length !== 1) _.unshift("");
            let $ = A(q.commentBefore);
            _.unshift(ft6.indentComment($, ""))
        }
        let O = !1,
            w = null;
        if (q.contents) {
            if (Us_.isNode(q.contents)) {
                if (q.contents.spaceBefore && z) _.push("");
                if (q.contents.commentBefore) {
                    let H = A(q.contents.commentBefore);
                    _.push(ft6.indentComment(H, ""))
                }
                Y.forceBlockIndent = !!q.comment, w = q.contents.comment
            }
            let $ = w ? void 0 : () => O = !0,
                j = KF1.stringify(q.contents, Y, () => w = null, $);
            if (w) j += ft6.lineComment(j, "", A(w));
            if ((j[0] === "|" || j[0] === ">") && _[_.length - 1] === "---") _[_.length - 1] = `--- ${j}`;
            else _.push(j)
        } else _.push(KF1.stringify(q.contents, Y));
        if (q.directives?.docEnd)
            if (q.comment) {
                let $ = A(q.comment);
                if ($.includes(`
`)) _.push("..."), _.push(ft6.indentComment($, ""));
                else _.push(`... ${$}`)
            } else _.push("...");
        else {
            let $ = q.comment;
            if ($ && O) $ = $.replace(/^\n+/, "");
            if ($) {
                if ((!O || w) && _[_.length - 1] !== "") _.push("");
                _.push(ft6.indentComment(A($), ""))
            }
        }
        return _.join(`
`) + `
`
    }
    ds_.stringifyDocument = Qs_
})
// @from(Ln 209972, Col 4)
Gt6 = p((ts_) => {
    var ls_ = Yt6(),
        eE6 = FL8(),
        gI = YA(),
        ns_ = HK6(),
        is_ = wK6(),
        rs_ = qF1(),
        os_ = kX4(),
        _F1 = mL8(),
        as_ = Tp1(),
        ss_ = At6(),
        zF1 = vp1();
    class YF1 {
        constructor(q, K, _) {
            this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, gI.NODE_TYPE, {
                value: gI.DOC
            });
            let z = null;
            if (typeof K === "function" || Array.isArray(K)) z = K;
            else if (_ === void 0 && K) _ = K, K = void 0;
            let Y = Object.assign({
                intAsBigInt: !1,
                keepSourceTokens: !1,
                logLevel: "warn",
                prettyErrors: !0,
                strict: !0,
                stringKeys: !1,
                uniqueKeys: !0,
                version: "1.2"
            }, _);
            this.options = Y;
            let {
                version: A
            } = Y;
            if (_?._directives) {
                if (this.directives = _._directives.atDocument(), this.directives.yaml.explicit) A = this.directives.yaml.version
            } else this.directives = new zF1.Directives({
                version: A
            });
            this.setSchema(A, _), this.contents = q === void 0 ? null : this.createNode(q, z, _)
        }
        clone() {
            let q = Object.create(YF1.prototype, {
                [gI.NODE_TYPE]: {
                    value: gI.DOC
                }
            });
            if (q.commentBefore = this.commentBefore, q.comment = this.comment, q.errors = this.errors.slice(), q.warnings = this.warnings.slice(), q.options = Object.assign({}, this.options), this.directives) q.directives = this.directives.clone();
            if (q.schema = this.schema.clone(), q.contents = gI.isNode(this.contents) ? this.contents.clone(q.schema) : this.contents, this.range) q.range = this.range.slice();
            return q
        }
        add(q) {
            if (qy6(this.contents)) this.contents.add(q)
        }
        addIn(q, K) {
            if (qy6(this.contents)) this.contents.addIn(q, K)
        }
        createAlias(q, K) {
            if (!q.anchor) {
                let _ = _F1.anchorNames(this);
                q.anchor = !K || _.has(K) ? _F1.findNewAnchor(K || "a", _) : K
            }
            return new ls_.Alias(q.anchor)
        }
        createNode(q, K, _) {
            let z = void 0;
            if (typeof K === "function") q = K.call({
                "": q
            }, "", q), z = K;
            else if (Array.isArray(K)) {
                let W = (Z) => typeof Z === "number" || Z instanceof String || Z instanceof Number,
                    D = K.filter(W).map(String);
                if (D.length > 0) K = K.concat(D);
                z = K
            } else if (_ === void 0 && K) _ = K, K = void 0;
            let {
                aliasDuplicateObjects: Y,
                anchorPrefix: A,
                flow: O,
                keepUndefined: w,
                onTagObj: $,
                tag: j
            } = _ ?? {}, {
                onAnchor: H,
                setAnchors: J,
                sourceObjects: X
            } = _F1.createNodeAnchors(this, A || "a"), M = {
                aliasDuplicateObjects: Y ?? !0,
                keepUndefined: w ?? !1,
                onAnchor: H,
                onTagObj: $,
                replacer: z,
                schema: this.schema,
                sourceObjects: X
            }, P = ss_.createNode(q, j, M);
            if (O && gI.isCollection(P)) P.flow = !0;
            return J(), P
        }
        createPair(q, K, _ = {}) {
            let z = this.createNode(q, null, _),
                Y = this.createNode(K, null, _);
            return new ns_.Pair(z, Y)
        }
        delete(q) {
            return qy6(this.contents) ? this.contents.delete(q) : !1
        }
        deleteIn(q) {
            if (eE6.isEmptyPath(q)) {
                if (this.contents == null) return !1;
                return this.contents = null, !0
            }
            return qy6(this.contents) ? this.contents.deleteIn(q) : !1
        }
        get(q, K) {
            return gI.isCollection(this.contents) ? this.contents.get(q, K) : void 0
        }
        getIn(q, K) {
            if (eE6.isEmptyPath(q)) return !K && gI.isScalar(this.contents) ? this.contents.value : this.contents;
            return gI.isCollection(this.contents) ? this.contents.getIn(q, K) : void 0
        }
        has(q) {
            return gI.isCollection(this.contents) ? this.contents.has(q) : !1
        }
        hasIn(q) {
            if (eE6.isEmptyPath(q)) return this.contents !== void 0;
            return gI.isCollection(this.contents) ? this.contents.hasIn(q) : !1
        }
        set(q, K) {
            if (this.contents == null) this.contents = eE6.collectionFromPath(this.schema, [q], K);
            else if (qy6(this.contents)) this.contents.set(q, K)
        }
        setIn(q, K) {
            if (eE6.isEmptyPath(q)) this.contents = K;
            else if (this.contents == null) this.contents = eE6.collectionFromPath(this.schema, Array.from(q), K);
            else if (qy6(this.contents)) this.contents.setIn(q, K)
        }
        setSchema(q, K = {}) {
            if (typeof q === "number") q = String(q);
            let _;
            switch (q) {
                case "1.1":
                    if (this.directives) this.directives.yaml.version = "1.1";
                    else this.directives = new zF1.Directives({
                        version: "1.1"
                    });
                    _ = {
                        resolveKnownTags: !1,
                        schema: "yaml-1.1"
                    };
                    break;
                case "1.2":
                case "next":
                    if (this.directives) this.directives.yaml.version = q;
                    else this.directives = new zF1.Directives({
                        version: q
                    });
                    _ = {
                        resolveKnownTags: !0,
                        schema: "core"
                    };
                    break;
                case null:
                    if (this.directives) delete this.directives;
                    _ = null;
                    break;
                default: {
                    let z = JSON.stringify(q);
                    throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${z}`)
                }
            }
            if (K.schema instanceof Object) this.schema = K.schema;
            else if (_) this.schema = new rs_.Schema(Object.assign(_, K));
            else throw Error("With a null YAML version, the { schema: Schema } option is required")
        }
        toJS({
            json: q,
            jsonArg: K,
            mapAsMap: _,
            maxAliasCount: z,
            onAnchor: Y,
            reviver: A
        } = {}) {
            let O = {
                    anchors: new Map,
                    doc: this,
                    keep: !q,
                    mapAsMap: _ === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof z === "number" ? z : 100
                },
                w = is_.toJS(this.contents, K ?? "", O);
            if (typeof Y === "function")
                for (let {
                        count: $,
                        res: j
                    }
                    of O.anchors.values()) Y(j, $);
            return typeof A === "function" ? as_.applyReviver(A, {
                "": w
            }, "", w) : w
        }
        toJSON(q, K) {
            return this.toJS({
                json: !0,
                jsonArg: q,
                mapAsMap: !1,
                onAnchor: K
            })
        }
        toString(q = {}) {
            if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
            if ("indent" in q && (!Number.isInteger(q.indent) || Number(q.indent) <= 0)) {
                let K = JSON.stringify(q.indent);
                throw Error(`"indent" option must be a positive integer, not ${K}`)
            }
            return os_.stringifyDocument(this, q)
        }
    }

    function qy6(q) {
        if (gI.isCollection(q)) return !0;
        throw Error("Expected a YAML collection as document contents")
    }
    ts_.Document = YF1
})
// @from(Ln 210197, Col 4)
vt6 = p((Kt_) => {
    class Jh8 extends Error {
        constructor(q, K, _, z) {
            super();
            this.name = q, this.code = _, this.message = z, this.pos = K
        }
    }
    class NX4 extends Jh8 {
        constructor(q, K, _) {
            super("YAMLParseError", q, K, _)
        }
    }
    class EX4 extends Jh8 {
        constructor(q, K, _) {
            super("YAMLWarning", q, K, _)
        }
    }
    var qt_ = (q, K) => (_) => {
        if (_.pos[0] === -1) return;
        _.linePos = _.pos.map((w) => K.linePos(w));
        let {
            line: z,
            col: Y
        } = _.linePos[0];
        _.message += ` at line ${z}, column ${Y}`;
        let A = Y - 1,
            O = q.substring(K.lineStarts[z - 1], K.lineStarts[z]).replace(/[\n\r]+$/, "");
        if (A >= 60 && O.length > 80) {
            let w = Math.min(A - 39, O.length - 79);
            O = "…" + O.substring(w), A -= w - 1
        }
        if (O.length > 80) O = O.substring(0, 79) + "…";
        if (z > 1 && /^ *$/.test(O.substring(0, A))) {
            let w = q.substring(K.lineStarts[z - 2], K.lineStarts[z - 1]);
            if (w.length > 80) w = w.substring(0, 79) + `…
`;
            O = w + O
        }
        if (/[^ ]/.test(O)) {
            let w = 1,
                $ = _.linePos[1];
            if ($ && $.line === z && $.col > Y) w = Math.max(1, Math.min($.col - Y, 80 - A));
            let j = " ".repeat(A) + "^".repeat(w);
            _.message += `:

${O}
${j}
`
        }
    };
    Kt_.YAMLError = Jh8;
    Kt_.YAMLParseError = NX4;
    Kt_.YAMLWarning = EX4;
    Kt_.prettifyError = qt_
})
// @from(Ln 210252, Col 4)
Tt6 = p((wt_) => {
    function Ot_(q, {
        flow: K,
        indicator: _,
        next: z,
        offset: Y,
        onError: A,
        parentIndent: O,
        startOnNewline: w
    }) {
        let $ = !1,
            j = w,
            H = w,
            J = "",
            X = "",
            M = !1,
            P = !1,
            W = null,
            D = null,
            Z = null,
            G = null,
            f = null,
            v = null,
            V = null;
        for (let R of q) {
            if (P) {
                if (R.type !== "space" && R.type !== "newline" && R.type !== "comma") A(R.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
                P = !1
            }
            if (W) {
                if (j && R.type !== "comment" && R.type !== "newline") A(W, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
                W = null
            }
            switch (R.type) {
                case "space":
                    if (!K && (_ !== "doc-start" || z?.type !== "flow-collection") && R.source.includes("\t")) W = R;
                    H = !0;
                    break;
                case "comment": {
                    if (!H) A(R, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    let h = R.source.substring(1) || " ";
                    if (!J) J = h;
                    else J += X + h;
                    X = "", j = !1;
                    break
                }
                case "newline":
                    if (j) {
                        if (J) J += R.source;
                        else if (!v || _ !== "seq-item-ind") $ = !0
                    } else X += R.source;
                    if (j = !0, M = !0, D || Z) G = R;
                    H = !0;
                    break;
                case "anchor":
                    if (D) A(R, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
                    if (R.source.endsWith(":")) A(R.offset + R.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0);
                    D = R, V ?? (V = R.offset), j = !1, H = !1, P = !0;
                    break;
                case "tag": {
                    if (Z) A(R, "MULTIPLE_TAGS", "A node can have at most one tag");
                    Z = R, V ?? (V = R.offset), j = !1, H = !1, P = !0;
                    break
                }
                case _:
                    if (D || Z) A(R, "BAD_PROP_ORDER", `Anchors and tags must be after the ${R.source} indicator`);
                    if (v) A(R, "UNEXPECTED_TOKEN", `Unexpected ${R.source} in ${K??"collection"}`);
                    v = R, j = _ === "seq-item-ind" || _ === "explicit-key-ind", H = !1;
                    break;
                case "comma":
                    if (K) {
                        if (f) A(R, "UNEXPECTED_TOKEN", `Unexpected , in ${K}`);
                        f = R, j = !1, H = !1;
                        break
                    }
                default:
                    A(R, "UNEXPECTED_TOKEN", `Unexpected ${R.type} token`), j = !1, H = !1
            }
        }
        let k = q[q.length - 1],
            N = k ? k.offset + k.source.length : Y;
        if (P && z && z.type !== "space" && z.type !== "newline" && z.type !== "comma" && (z.type !== "scalar" || z.source !== "")) A(z.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        if (W && (j && W.indent <= O || z?.type === "block-map" || z?.type === "block-seq")) A(W, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        return {
            comma: f,
            found: v,
            spaceBefore: $,
            comment: J,
            hasNewline: M,
            anchor: D,
            tag: Z,
            newlineAfterProp: G,
            end: N,
            start: V ?? N
        }
    }
    wt_.resolveProps = Ot_
})
// @from(Ln 210350, Col 4)
Xh8 = p((jt_) => {
    function AF1(q) {
        if (!q) return null;
        switch (q.type) {
            case "alias":
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                if (q.source.includes(`
`)) return !0;
                if (q.end) {
                    for (let K of q.end)
                        if (K.type === "newline") return !0
                }
                return !1;
            case "flow-collection":
                for (let K of q.items) {
                    for (let _ of K.start)
                        if (_.type === "newline") return !0;
                    if (K.sep) {
                        for (let _ of K.sep)
                            if (_.type === "newline") return !0
                    }
                    if (AF1(K.key) || AF1(K.value)) return !0
                }
                return !1;
            default:
                return !0
        }
    }
    jt_.containsNewline = AF1
})
// @from(Ln 210382, Col 4)
OF1 = p((Mt_) => {
    var Jt_ = Xh8();

    function Xt_(q, K, _) {
        if (K?.type === "flow-collection") {
            let z = K.end[0];
            if (z.indent === q && (z.source === "]" || z.source === "}") && Jt_.containsNewline(K)) _(z, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0)
        }
    }
    Mt_.flowIndentCheck = Xt_
})
// @from(Ln 210393, Col 4)
wF1 = p((Dt_) => {
    var yX4 = YA();

    function Wt_(q, K, _) {
        let {
            uniqueKeys: z
        } = q.options;
        if (z === !1) return !1;
        let Y = typeof z === "function" ? z : (A, O) => A === O || yX4.isScalar(A) && yX4.isScalar(O) && A.value === O.value;
        return K.some((A) => Y(A.key, _))
    }
    Dt_.mapIncludes = Wt_
})
// @from(Ln 210406, Col 4)
CX4 = p((Vt_) => {
    var LX4 = HK6(),
        ft_ = XK6(),
        hX4 = Tt6(),
        Gt_ = Xh8(),
        RX4 = OF1(),
        vt_ = wF1(),
        SX4 = "All mapping items must start at the same column";

    function Tt_({
        composeNode: q,
        composeEmptyNode: K
    }, _, z, Y, A) {
        let w = new(A?.nodeClass ?? ft_.YAMLMap)(_.schema);
        if (_.atRoot) _.atRoot = !1;
        let $ = z.offset,
            j = null;
        for (let H of z.items) {
            let {
                start: J,
                key: X,
                sep: M,
                value: P
            } = H, W = hX4.resolveProps(J, {
                indicator: "explicit-key-ind",
                next: X ?? M?.[0],
                offset: $,
                onError: Y,
                parentIndent: z.indent,
                startOnNewline: !0
            }), D = !W.found;
            if (D) {
                if (X) {
                    if (X.type === "block-seq") Y($, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
                    else if ("indent" in X && X.indent !== z.indent) Y($, "BAD_INDENT", SX4)
                }
                if (!W.anchor && !W.tag && !M) {
                    if (j = W.end, W.comment)
                        if (w.comment) w.comment += `
` + W.comment;
                        else w.comment = W.comment;
                    continue
                }
                if (W.newlineAfterProp || Gt_.containsNewline(X)) Y(X ?? J[J.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line")
            } else if (W.found?.indent !== z.indent) Y($, "BAD_INDENT", SX4);
            _.atKey = !0;
            let Z = W.end,
                G = X ? q(_, X, W, Y) : K(_, Z, J, null, W, Y);
            if (_.schema.compat) RX4.flowIndentCheck(z.indent, X, Y);
            if (_.atKey = !1, vt_.mapIncludes(_, w.items, G)) Y(Z, "DUPLICATE_KEY", "Map keys must be unique");
            let f = hX4.resolveProps(M ?? [], {
                indicator: "map-value-ind",
                next: P,
                offset: G.range[2],
                onError: Y,
                parentIndent: z.indent,
                startOnNewline: !X || X.type === "block-scalar"
            });
            if ($ = f.end, f.found) {
                if (D) {
                    if (P?.type === "block-map" && !f.hasNewline) Y($, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
                    if (_.options.strict && W.start < f.found.offset - 1024) Y(G.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key")
                }
                let v = P ? q(_, P, f, Y) : K(_, $, M, null, f, Y);
                if (_.schema.compat) RX4.flowIndentCheck(z.indent, P, Y);
                $ = v.range[2];
                let V = new LX4.Pair(G, v);
                if (_.options.keepSourceTokens) V.srcToken = H;
                w.items.push(V)
            } else {
                if (D) Y(G.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
                if (f.comment)
                    if (G.comment) G.comment += `
` + f.comment;
                    else G.comment = f.comment;
                let v = new LX4.Pair(G);
                if (_.options.keepSourceTokens) v.srcToken = H;
                w.items.push(v)
            }
        }
        if (j && j < $) Y(j, "IMPOSSIBLE", "Map comment with trailing content");
        return w.range = [z.offset, $, j ?? $], w
    }
    Vt_.resolveBlockMap = Tt_
})
// @from(Ln 210491, Col 4)
bX4 = p((ht_) => {
    var Nt_ = MK6(),
        Et_ = Tt6(),
        yt_ = OF1();

    function Lt_({
        composeNode: q,
        composeEmptyNode: K
    }, _, z, Y, A) {
        let w = new(A?.nodeClass ?? Nt_.YAMLSeq)(_.schema);
        if (_.atRoot) _.atRoot = !1;
        if (_.atKey) _.atKey = !1;
        let $ = z.offset,
            j = null;
        for (let {
                start: H,
                value: J
            }
            of z.items) {
            let X = Et_.resolveProps(H, {
                indicator: "seq-item-ind",
                next: J,
                offset: $,
                onError: Y,
                parentIndent: z.indent,
                startOnNewline: !0
            });
            if (!X.found)
                if (X.anchor || X.tag || J)
                    if (J && J.type === "block-seq") Y(X.end, "BAD_INDENT", "All sequence items must start at the same column");
                    else Y($, "MISSING_CHAR", "Sequence item without - indicator");
            else {
                if (j = X.end, X.comment) w.comment = X.comment;
                continue
            }
            let M = J ? q(_, J, X, Y) : K(_, X.end, H, null, X, Y);
            if (_.schema.compat) yt_.flowIndentCheck(z.indent, J, Y);
            $ = M.range[2], w.items.push(M)
        }
        return w.range = [z.offset, $, j ?? $], w
    }
    ht_.resolveBlockSeq = Lt_
})
// @from(Ln 210534, Col 4)
Ky6 = p((Ct_) => {
    function St_(q, K, _, z) {
        let Y = "";
        if (q) {
            let A = !1,
                O = "";
            for (let w of q) {
                let {
                    source: $,
                    type: j
                } = w;
                switch (j) {
                    case "space":
                        A = !0;
                        break;
                    case "comment": {
                        if (_ && !A) z(w, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                        let H = $.substring(1) || " ";
                        if (!Y) Y = H;
                        else Y += O + H;
                        O = "";
                        break
                    }
                    case "newline":
                        if (Y) O += $;
                        A = !0;
                        break;
                    default:
                        z(w, "UNEXPECTED_TOKEN", `Unexpected ${j} at node end`)
                }
                K += $.length
            }
        }
        return {
            comment: Y,
            offset: K
        }
    }
    Ct_.resolveEnd = St_
})
// @from(Ln 210574, Col 4)
uX4 = p((gt_) => {
    var It_ = YA(),
        xt_ = HK6(),
        IX4 = XK6(),
        ut_ = MK6(),
        mt_ = Ky6(),
        xX4 = Tt6(),
        Bt_ = Xh8(),
        pt_ = wF1(),
        $F1 = "Block collections are not allowed within flow collections",
        jF1 = (q) => q && (q.type === "block-map" || q.type === "block-seq");

    function Ft_({
        composeNode: q,
        composeEmptyNode: K
    }, _, z, Y, A) {
        let O = z.start.source === "{",
            w = O ? "flow map" : "flow sequence",
            j = new(A?.nodeClass ?? (O ? IX4.YAMLMap : ut_.YAMLSeq))(_.schema);
        j.flow = !0;
        let H = _.atRoot;
        if (H) _.atRoot = !1;
        if (_.atKey) _.atKey = !1;
        let J = z.offset + z.start.source.length;
        for (let D = 0; D < z.items.length; ++D) {
            let Z = z.items[D],
                {
                    start: G,
                    key: f,
                    sep: v,
                    value: V
                } = Z,
                k = xX4.resolveProps(G, {
                    flow: w,
                    indicator: "explicit-key-ind",
                    next: f ?? v?.[0],
                    offset: J,
                    onError: Y,
                    parentIndent: z.indent,
                    startOnNewline: !1
                });
            if (!k.found) {
                if (!k.anchor && !k.tag && !v && !V) {
                    if (D === 0 && k.comma) Y(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${w}`);
                    else if (D < z.items.length - 1) Y(k.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${w}`);
                    if (k.comment)
                        if (j.comment) j.comment += `
` + k.comment;
                        else j.comment = k.comment;
                    J = k.end;
                    continue
                }
                if (!O && _.options.strict && Bt_.containsNewline(f)) Y(f, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line")
            }
            if (D === 0) {
                if (k.comma) Y(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${w}`)
            } else {
                if (!k.comma) Y(k.start, "MISSING_CHAR", `Missing , between ${w} items`);
                if (k.comment) {
                    let N = "";
                    q: for (let R of G) switch (R.type) {
                        case "comma":
                        case "space":
                            break;
                        case "comment":
                            N = R.source.substring(1);
                            break q;
                        default:
                            break q
                    }
                    if (N) {
                        let R = j.items[j.items.length - 1];
                        if (It_.isPair(R)) R = R.value ?? R.key;
                        if (R.comment) R.comment += `
` + N;
                        else R.comment = N;
                        k.comment = k.comment.substring(N.length + 1)
                    }
                }
            }
            if (!O && !v && !k.found) {
                let N = V ? q(_, V, k, Y) : K(_, k.end, v, null, k, Y);
                if (j.items.push(N), J = N.range[2], jF1(V)) Y(N.range, "BLOCK_IN_FLOW", $F1)
            } else {
                _.atKey = !0;
                let N = k.end,
                    R = f ? q(_, f, k, Y) : K(_, N, G, null, k, Y);
                if (jF1(f)) Y(R.range, "BLOCK_IN_FLOW", $F1);
                _.atKey = !1;
                let h = xX4.resolveProps(v ?? [], {
                    flow: w,
                    indicator: "map-value-ind",
                    next: V,
                    offset: R.range[2],
                    onError: Y,
                    parentIndent: z.indent,
                    startOnNewline: !1
                });
                if (h.found) {
                    if (!O && !k.found && _.options.strict) {
                        if (v)
                            for (let B of v) {
                                if (B === h.found) break;
                                if (B.type === "newline") {
                                    Y(B, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                                    break
                                }
                            }
                        if (k.start < h.found.offset - 1024) Y(h.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")
                    }
                } else if (V)
                    if ("source" in V && V.source && V.source[0] === ":") Y(V, "MISSING_CHAR", `Missing space after : in ${w}`);
                    else Y(h.start, "MISSING_CHAR", `Missing , or : between ${w} items`);
                let C = V ? q(_, V, h, Y) : h.found ? K(_, h.end, v, null, h, Y) : null;
                if (C) {
                    if (jF1(V)) Y(C.range, "BLOCK_IN_FLOW", $F1)
                } else if (h.comment)
                    if (R.comment) R.comment += `
` + h.comment;
                    else R.comment = h.comment;
                let x = new xt_.Pair(R, C);
                if (_.options.keepSourceTokens) x.srcToken = Z;
                if (O) {
                    let B = j;
                    if (pt_.mapIncludes(_, B.items, R)) Y(N, "DUPLICATE_KEY", "Map keys must be unique");
                    B.items.push(x)
                } else {
                    let B = new IX4.YAMLMap(_.schema);
                    B.flow = !0, B.items.push(x);
                    let m = (C ?? R).range;
                    B.range = [R.range[0], m[1], m[2]], j.items.push(B)
                }
                J = C ? C.range[2] : h.end
            }
        }
        let X = O ? "}" : "]",
            [M, ...P] = z.end,
            W = J;
        if (M && M.source === X) W = M.offset + M.source.length;
        else {
            let D = w[0].toUpperCase() + w.substring(1),
                Z = H ? `${D} must end with a ${X}` : `${D} in block collection must be sufficiently indented and end with a ${X}`;
            if (Y(J, H ? "MISSING_CHAR" : "BAD_INDENT", Z), M && M.source.length !== 1) P.unshift(M)
        }
        if (P.length > 0) {
            let D = mt_.resolveEnd(P, W, _.options.strict, Y);
            if (D.comment)
                if (j.comment) j.comment += `
` + D.comment;
                else j.comment = D.comment;
            j.range = [z.offset, W, D.offset]
        } else j.range = [z.offset, W, W];
        return j
    }
    gt_.resolveFlowCollection = Ft_
})
// @from(Ln 210730, Col 4)
mX4 = p((at_) => {
    var Qt_ = YA(),
        dt_ = uP(),
        ct_ = XK6(),
        lt_ = MK6(),
        nt_ = CX4(),
        it_ = bX4(),
        rt_ = uX4();

    function HF1(q, K, _, z, Y, A) {
        let O = _.type === "block-map" ? nt_.resolveBlockMap(q, K, _, z, A) : _.type === "block-seq" ? it_.resolveBlockSeq(q, K, _, z, A) : rt_.resolveFlowCollection(q, K, _, z, A),
            w = O.constructor;
        if (Y === "!" || Y === w.tagName) return O.tag = w.tagName, O;
        if (Y) O.tag = Y;
        return O
    }

    function ot_(q, K, _, z, Y) {
        let A = z.tag,
            O = !A ? null : K.directives.tagName(A.source, (X) => Y(A, "TAG_RESOLVE_FAILED", X));
        if (_.type === "block-seq") {
            let {
                anchor: X,
                newlineAfterProp: M
            } = z, P = X && A ? X.offset > A.offset ? X : A : X ?? A;
            if (P && (!M || M.offset < P.offset)) Y(P, "MISSING_CHAR", "Missing newline after block sequence props")
        }
        let w = _.type === "block-map" ? "map" : _.type === "block-seq" ? "seq" : _.start.source === "{" ? "map" : "seq";
        if (!A || !O || O === "!" || O === ct_.YAMLMap.tagName && w === "map" || O === lt_.YAMLSeq.tagName && w === "seq") return HF1(q, K, _, Y, O);
        let $ = K.schema.tags.find((X) => X.tag === O && X.collection === w);
        if (!$) {
            let X = K.schema.knownTags[O];
            if (X && X.collection === w) K.schema.tags.push(Object.assign({}, X, {
                default: !1
            })), $ = X;
            else {
                if (X) Y(A, "BAD_COLLECTION_TYPE", `${X.tag} used for ${w} collection, but expects ${X.collection??"scalar"}`, !0);
                else Y(A, "TAG_RESOLVE_FAILED", `Unresolved tag: ${O}`, !0);
                return HF1(q, K, _, Y, O)
            }
        }
        let j = HF1(q, K, _, Y, O, $),
            H = $.resolve?.(j, (X) => Y(A, "TAG_RESOLVE_FAILED", X), K.options) ?? j,
            J = Qt_.isNode(H) ? H : new dt_.Scalar(H);
        if (J.range = j.range, J.tag = O, $?.format) J.format = $.format;
        return J
    }
    at_.composeCollection = ot_
})
// @from(Ln 210779, Col 4)
XF1 = p((Ke_) => {
    var JF1 = uP();

    function tt_(q, K, _) {
        let z = K.offset,
            Y = et_(K, q.options.strict, _);
        if (!Y) return {
            value: "",
            type: null,
            comment: "",
            range: [z, z, z]
        };
        let A = Y.mode === ">" ? JF1.Scalar.BLOCK_FOLDED : JF1.Scalar.BLOCK_LITERAL,
            O = K.source ? qe_(K.source) : [],
            w = O.length;
        for (let W = O.length - 1; W >= 0; --W) {
            let D = O[W][1];
            if (D === "" || D === "\r") w = W;
            else break
        }
        if (w === 0) {
            let W = Y.chomp === "+" && O.length > 0 ? `
`.repeat(Math.max(1, O.length - 1)) : "",
                D = z + Y.length;
            if (K.source) D += K.source.length;
            return {
                value: W,
                type: A,
                comment: Y.comment,
                range: [z, D, D]
            }
        }
        let $ = K.indent + Y.indent,
            j = K.offset + Y.length,
            H = 0;
        for (let W = 0; W < w; ++W) {
            let [D, Z] = O[W];
            if (Z === "" || Z === "\r") {
                if (Y.indent === 0 && D.length > $) $ = D.length
            } else {
                if (D.length < $) _(j + D.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
                if (Y.indent === 0) $ = D.length;
                if (H = W, $ === 0 && !q.atRoot) _(j, "BAD_INDENT", "Block scalar values in collections must be indented");
                break
            }
            j += D.length + Z.length + 1
        }
        for (let W = O.length - 1; W >= w; --W)
            if (O[W][0].length > $) w = W + 1;
        let J = "",
            X = "",
            M = !1;
        for (let W = 0; W < H; ++W) J += O[W][0].slice($) + `
`;
        for (let W = H; W < w; ++W) {
            let [D, Z] = O[W];
            j += D.length + Z.length + 1;
            let G = Z[Z.length - 1] === "\r";
            if (G) Z = Z.slice(0, -1);
            if (Z && D.length < $) {
                let v = `Block scalar lines must not be less indented than their ${Y.indent?"explicit indentation indicator":"first line"}`;
                _(j - Z.length - (G ? 2 : 1), "BAD_INDENT", v), D = ""
            }
            if (A === JF1.Scalar.BLOCK_LITERAL) J += X + D.slice($) + Z, X = `
`;
            else if (D.length > $ || Z[0] === "\t") {
                if (X === " ") X = `
`;
                else if (!M && X === `
`) X = `

`;
                J += X + D.slice($) + Z, X = `
`, M = !0
            } else if (Z === "")
                if (X === `
`) J += `
`;
                else X = `
`;
            else J += X + Z, X = " ", M = !1
        }
        switch (Y.chomp) {
            case "-":
                break;
            case "+":
                for (let W = w; W < O.length; ++W) J += `
` + O[W][0].slice($);
                if (J[J.length - 1] !== `
`) J += `
`;
                break;
            default:
                J += `
`
        }
        let P = z + Y.length + K.source.length;
        return {
            value: J,
            type: A,
            comment: Y.comment,
            range: [z, P, P]
        }
    }

    function et_({
        offset: q,
        props: K
    }, _, z) {
        if (K[0].type !== "block-scalar-header") return z(K[0], "IMPOSSIBLE", "Block scalar header not found"), null;
        let {
            source: Y
        } = K[0], A = Y[0], O = 0, w = "", $ = -1;
        for (let X = 1; X < Y.length; ++X) {
            let M = Y[X];
            if (!w && (M === "-" || M === "+")) w = M;
            else {
                let P = Number(M);
                if (!O && P) O = P;
                else if ($ === -1) $ = q + X
            }
        }
        if ($ !== -1) z($, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${Y}`);
        let j = !1,
            H = "",
            J = Y.length;
        for (let X = 1; X < K.length; ++X) {
            let M = K[X];
            switch (M.type) {
                case "space":
                    j = !0;
                case "newline":
                    J += M.source.length;
                    break;
                case "comment":
                    if (_ && !j) z(M, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    J += M.source.length, H = M.source.substring(1);
                    break;
                case "error":
                    z(M, "UNEXPECTED_TOKEN", M.message), J += M.source.length;
                    break;
                default: {
                    let P = `Unexpected token in block scalar header: ${M.type}`;
                    z(M, "UNEXPECTED_TOKEN", P);
                    let W = M.source;
                    if (W && typeof W === "string") J += W.length
                }
            }
        }
        return {
            mode: A,
            indent: O,
            chomp: w,
            comment: H,
            length: J
        }
    }

    function qe_(q) {
        let K = q.split(/\n( *)/),
            _ = K[0],
            z = _.match(/^( *)/),
            A = [z?.[1] ? [z[1], _.slice(z[1].length)] : ["", _]];
        for (let O = 1; O < K.length; O += 2) A.push([K[O], K[O + 1]]);
        return A
    }
    Ke_.resolveBlockScalar = tt_
})