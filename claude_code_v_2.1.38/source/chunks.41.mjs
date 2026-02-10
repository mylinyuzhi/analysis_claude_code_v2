
// @from(Ln 108747, Col 4)
T76 = R((Qw5) => {
    var N76 = kY(),
        z6A = bn(),
        Bw5 = MX(),
        mw5 = mn();

    function zn8(A, q) {
        if (N76.isSeq(A))
            for (let K = 0; K < A.items.length; ++K) {
                let Y = A.items[K];
                if (N76.isPair(Y)) continue;
                else if (N76.isMap(Y)) {
                    if (Y.items.length > 1) q("Each pair must have its own sequence indicator");
                    let z = Y.items[0] || new z6A.Pair(new Bw5.Scalar(null));
                    if (Y.commentBefore) z.key.commentBefore = z.key.commentBefore ? `${Y.commentBefore}
${z.key.commentBefore}` : Y.commentBefore;
                    if (Y.comment) {
                        let w = z.value ?? z.key;
                        w.comment = w.comment ? `${Y.comment}
${w.comment}` : Y.comment
                    }
                    Y = z
                }
                A.items[K] = N76.isPair(Y) ? Y : new z6A.Pair(Y)
            } else q("Expected a sequence for this tag");
        return A
    }

    function wn8(A, q, K) {
        let {
            replacer: Y
        } = K, z = new mw5.YAMLSeq(A);
        z.tag = "tag:yaml.org,2002:pairs";
        let w = 0;
        if (q && Symbol.iterator in Object(q))
            for (let H of q) {
                if (typeof Y === "function") H = Y.call(q, String(w++), H);
                let $, O;
                if (Array.isArray(H))
                    if (H.length === 2) $ = H[0], O = H[1];
                    else throw TypeError(`Expected [key, value] tuple: ${H}`);
                else if (H && H instanceof Object) {
                    let _ = Object.keys(H);
                    if (_.length === 1) $ = _[0], O = H[$];
                    else throw TypeError(`Expected tuple with one key, not ${_.length} keys`)
                } else $ = H;
                z.items.push(z6A.createPair($, O, K))
            }
        return z
    }
    var Fw5 = {
        collection: "seq",
        default: !1,
        tag: "tag:yaml.org,2002:pairs",
        resolve: zn8,
        createNode: wn8
    };
    Qw5.createPairs = wn8;
    Qw5.pairs = Fw5;
    Qw5.resolvePairs = zn8
})
// @from(Ln 108808, Col 4)
H6A = R((lw5) => {
    var Hn8 = kY(),
        w6A = hn(),
        SR1 = Bn(),
        dw5 = mn(),
        $n8 = T76();
    class y81 extends dw5.YAMLSeq {
        constructor() {
            super();
            this.add = SR1.YAMLMap.prototype.add.bind(this), this.delete = SR1.YAMLMap.prototype.delete.bind(this), this.get = SR1.YAMLMap.prototype.get.bind(this), this.has = SR1.YAMLMap.prototype.has.bind(this), this.set = SR1.YAMLMap.prototype.set.bind(this), this.tag = y81.tag
        }
        toJSON(A, q) {
            if (!q) return super.toJSON(A);
            let K = new Map;
            if (q?.onCreate) q.onCreate(K);
            for (let Y of this.items) {
                let z, w;
                if (Hn8.isPair(Y)) z = w6A.toJS(Y.key, "", q), w = w6A.toJS(Y.value, z, q);
                else z = w6A.toJS(Y, "", q);
                if (K.has(z)) throw Error("Ordered maps must not include duplicate keys");
                K.set(z, w)
            }
            return K
        }
        static from(A, q, K) {
            let Y = $n8.createPairs(A, q, K),
                z = new this;
            return z.items = Y.items, z
        }
    }
    y81.tag = "tag:yaml.org,2002:omap";
    var cw5 = {
        collection: "seq",
        identify: (A) => A instanceof Map,
        nodeClass: y81,
        default: !1,
        tag: "tag:yaml.org,2002:omap",
        resolve(A, q) {
            let K = $n8.resolvePairs(A, q),
                Y = [];
            for (let {
                    key: z
                }
                of K.items)
                if (Hn8.isScalar(z))
                    if (Y.includes(z.value)) q(`Ordered maps must not include duplicate keys: ${z.value}`);
                    else Y.push(z.value);
            return Object.assign(new y81, K)
        },
        createNode: (A, q, K) => y81.from(A, q, K)
    };
    lw5.YAMLOMap = y81;
    lw5.omap = cw5
})
// @from(Ln 108862, Col 4)
Dn8 = R((rw5) => {
    var On8 = MX();

    function _n8({
        value: A,
        source: q
    }, K) {
        if (q && (A ? Jn8 : Xn8).test.test(q)) return q;
        return A ? K.options.trueStr : K.options.falseStr
    }
    var Jn8 = {
            identify: (A) => A === !0,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
            resolve: () => new On8.Scalar(!0),
            stringify: _n8
        },
        Xn8 = {
            identify: (A) => A === !1,
            default: !0,
            tag: "tag:yaml.org,2002:bool",
            test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
            resolve: () => new On8.Scalar(!1),
            stringify: _n8
        };
    rw5.falseTag = Xn8;
    rw5.trueTag = Jn8
})
// @from(Ln 108891, Col 4)
jn8 = R((qH5) => {
    var sw5 = MX(),
        $6A = uO1(),
        tw5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
            resolve: (A) => A.slice(-3).toLowerCase() === "nan" ? NaN : A[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
            stringify: $6A.stringifyNumber
        },
        ew5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "EXP",
            test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
            resolve: (A) => parseFloat(A.replace(/_/g, "")),
            stringify(A) {
                let q = Number(A.value);
                return isFinite(q) ? q.toExponential() : $6A.stringifyNumber(A)
            }
        },
        AH5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
            resolve(A) {
                let q = new sw5.Scalar(parseFloat(A.replace(/_/g, ""))),
                    K = A.indexOf(".");
                if (K !== -1) {
                    let Y = A.substring(K + 1).replace(/_/g, "");
                    if (Y[Y.length - 1] === "0") q.minFractionDigits = Y.length
                }
                return q
            },
            stringify: $6A.stringifyNumber
        };
    qH5.float = AH5;
    qH5.floatExp = ew5;
    qH5.floatNaN = tw5
})
// @from(Ln 108934, Col 4)
Pn8 = R((_H5) => {
    var Mn8 = uO1(),
        hR1 = (A) => typeof A === "bigint" || Number.isInteger(A);

    function v76(A, q, K, {
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
            let H = BigInt(A);
            return z === "-" ? BigInt(-1) * H : H
        }
        let w = parseInt(A, K);
        return z === "-" ? -1 * w : w
    }

    function O6A(A, q, K) {
        let {
            value: Y
        } = A;
        if (hR1(Y)) {
            let z = Y.toString(q);
            return Y < 0 ? "-" + K + z.substr(1) : K + z
        }
        return Mn8.stringifyNumber(A)
    }
    var wH5 = {
            identify: hR1,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "BIN",
            test: /^[-+]?0b[0-1_]+$/,
            resolve: (A, q, K) => v76(A, 2, 2, K),
            stringify: (A) => O6A(A, 2, "0b")
        },
        HH5 = {
            identify: hR1,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "OCT",
            test: /^[-+]?0[0-7_]+$/,
            resolve: (A, q, K) => v76(A, 1, 8, K),
            stringify: (A) => O6A(A, 8, "0")
        },
        $H5 = {
            identify: hR1,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            test: /^[-+]?[0-9][0-9_]*$/,
            resolve: (A, q, K) => v76(A, 0, 10, K),
            stringify: Mn8.stringifyNumber
        },
        OH5 = {
            identify: hR1,
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "HEX",
            test: /^[-+]?0x[0-9a-fA-F_]+$/,
            resolve: (A, q, K) => v76(A, 2, 16, K),
            stringify: (A) => O6A(A, 16, "0x")
        };
    _H5.int = $H5;
    _H5.intBin = wH5;
    _H5.intHex = OH5;
    _H5.intOct = HH5
})
// @from(Ln 109012, Col 4)
_6A = R((PH5) => {
    var L76 = kY(),
        E76 = bn(),
        k76 = Bn();
    class C81 extends k76.YAMLMap {
        constructor(A) {
            super(A);
            this.tag = C81.tag
        }
        add(A) {
            let q;
            if (L76.isPair(A)) q = A;
            else if (A && typeof A === "object" && "key" in A && "value" in A && A.value === null) q = new E76.Pair(A.key, null);
            else q = new E76.Pair(A, null);
            if (!k76.findPair(this.items, q.key)) this.items.push(q)
        }
        get(A, q) {
            let K = k76.findPair(this.items, A);
            return !q && L76.isPair(K) ? L76.isScalar(K.key) ? K.key.value : K.key : K
        }
        set(A, q) {
            if (typeof q !== "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof q}`);
            let K = k76.findPair(this.items, A);
            if (K && !q) this.items.splice(this.items.indexOf(K), 1);
            else if (!K && q) this.items.push(new E76.Pair(A))
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
                for (let w of q) {
                    if (typeof Y === "function") w = Y.call(q, w, w);
                    z.items.push(E76.createPair(w, null, K))
                }
            return z
        }
    }
    C81.tag = "tag:yaml.org,2002:set";
    var MH5 = {
        collection: "map",
        identify: (A) => A instanceof Set,
        nodeClass: C81,
        default: !1,
        tag: "tag:yaml.org,2002:set",
        createNode: (A, q, K) => C81.from(A, q, K),
        resolve(A, q) {
            if (L76.isMap(A))
                if (A.hasAllNullValues(!0)) return Object.assign(new C81, A);
                else q("Set items must all have null values");
            else q("Expected a mapping for this tag");
            return A
        }
    };
    PH5.YAMLSet = C81;
    PH5.set = MH5
})
// @from(Ln 109079, Col 4)
X6A = R((NH5) => {
    var ZH5 = uO1();

    function J6A(A, q) {
        let K = A[0],
            Y = K === "-" || K === "+" ? A.substring(1) : A,
            z = (H) => q ? BigInt(H) : Number(H),
            w = Y.replace(/_/g, "").split(":").reduce((H, $) => H * z(60) + z($), z(0));
        return K === "-" ? z(-1) * w : w
    }

    function Wn8(A) {
        let {
            value: q
        } = A, K = (H) => H;
        if (typeof q === "bigint") K = (H) => BigInt(H);
        else if (isNaN(q) || !isFinite(q)) return ZH5.stringifyNumber(A);
        let Y = "";
        if (q < 0) Y = "-", q *= K(-1);
        let z = K(60),
            w = [q % z];
        if (q < 60) w.unshift(0);
        else if (q = (q - w[0]) / z, w.unshift(q % z), q >= 60) q = (q - w[0]) / z, w.unshift(q);
        return Y + w.map((H) => String(H).padStart(2, "0")).join(":").replace(/000000\d*$/, "")
    }
    var fH5 = {
            identify: (A) => typeof A === "bigint" || Number.isInteger(A),
            default: !0,
            tag: "tag:yaml.org,2002:int",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
            resolve: (A, q, {
                intAsBigInt: K
            }) => J6A(A, K),
            stringify: Wn8
        },
        VH5 = {
            identify: (A) => typeof A === "number",
            default: !0,
            tag: "tag:yaml.org,2002:float",
            format: "TIME",
            test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
            resolve: (A) => J6A(A, !1),
            stringify: Wn8
        },
        Gn8 = {
            identify: (A) => A instanceof Date,
            default: !0,
            tag: "tag:yaml.org,2002:timestamp",
            test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
            resolve(A) {
                let q = A.match(Gn8.test);
                if (!q) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
                let [, K, Y, z, w, H, $] = q.map(Number), O = q[7] ? Number((q[7] + "00").substr(1, 3)) : 0, _ = Date.UTC(K, Y - 1, z, w || 0, H || 0, $ || 0, O), J = q[8];
                if (J && J !== "Z") {
                    let X = J6A(J, !1);
                    if (Math.abs(X) < 30) X *= 60;
                    _ -= 60000 * X
                }
                return new Date(_)
            },
            stringify: ({
                value: A
            }) => A?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
        };
    NH5.floatTime = VH5;
    NH5.intTime = fH5;
    NH5.timestamp = Gn8
})
// @from(Ln 109148, Col 4)
fn8 = R((uH5) => {
    var kH5 = xO1(),
        LH5 = Z76(),
        RH5 = bO1(),
        yH5 = yR1(),
        CH5 = Y6A(),
        Zn8 = Dn8(),
        D6A = jn8(),
        R76 = Pn8(),
        SH5 = J76(),
        hH5 = H6A(),
        IH5 = T76(),
        xH5 = _6A(),
        j6A = X6A(),
        bH5 = [kH5.map, RH5.seq, yH5.string, LH5.nullTag, Zn8.trueTag, Zn8.falseTag, R76.intBin, R76.intOct, R76.int, R76.intHex, D6A.floatNaN, D6A.floatExp, D6A.float, CH5.binary, SH5.merge, hH5.omap, IH5.pairs, xH5.set, j6A.intTime, j6A.floatTime, j6A.timestamp];
    uH5.schema = bH5
})
// @from(Ln 109165, Col 4)
Cn8 = R((cH5) => {
    var vn8 = xO1(),
        mH5 = Z76(),
        En8 = bO1(),
        FH5 = yR1(),
        QH5 = o1A(),
        M6A = s1A(),
        P6A = e1A(),
        gH5 = qn8(),
        UH5 = Yn8(),
        kn8 = Y6A(),
        IR1 = J76(),
        Ln8 = H6A(),
        Rn8 = T76(),
        Vn8 = fn8(),
        yn8 = _6A(),
        y76 = X6A(),
        Nn8 = new Map([
            ["core", gH5.schema],
            ["failsafe", [vn8.map, En8.seq, FH5.string]],
            ["json", UH5.schema],
            ["yaml11", Vn8.schema],
            ["yaml-1.1", Vn8.schema]
        ]),
        Tn8 = {
            binary: kn8.binary,
            bool: QH5.boolTag,
            float: M6A.float,
            floatExp: M6A.floatExp,
            floatNaN: M6A.floatNaN,
            floatTime: y76.floatTime,
            int: P6A.int,
            intHex: P6A.intHex,
            intOct: P6A.intOct,
            intTime: y76.intTime,
            map: vn8.map,
            merge: IR1.merge,
            null: mH5.nullTag,
            omap: Ln8.omap,
            pairs: Rn8.pairs,
            seq: En8.seq,
            set: yn8.set,
            timestamp: y76.timestamp
        },
        pH5 = {
            "tag:yaml.org,2002:binary": kn8.binary,
            "tag:yaml.org,2002:merge": IR1.merge,
            "tag:yaml.org,2002:omap": Ln8.omap,
            "tag:yaml.org,2002:pairs": Rn8.pairs,
            "tag:yaml.org,2002:set": yn8.set,
            "tag:yaml.org,2002:timestamp": y76.timestamp
        };

    function dH5(A, q, K) {
        let Y = Nn8.get(q);
        if (Y && !A) return K && !Y.includes(IR1.merge) ? Y.concat(IR1.merge) : Y.slice();
        let z = Y;
        if (!z)
            if (Array.isArray(A)) z = [];
            else {
                let w = Array.from(Nn8.keys()).filter((H) => H !== "yaml11").map((H) => JSON.stringify(H)).join(", ");
                throw Error(`Unknown schema "${q}"; use one of ${w} or define customTags array`)
            } if (Array.isArray(A))
            for (let w of A) z = z.concat(w);
        else if (typeof A === "function") z = A(z.slice());
        if (K) z = z.concat(IR1.merge);
        return z.reduce((w, H) => {
            let $ = typeof H === "string" ? Tn8[H] : H;
            if (!$) {
                let O = JSON.stringify(H),
                    _ = Object.keys(Tn8).map((J) => JSON.stringify(J)).join(", ");
                throw Error(`Unknown custom tag ${O}; use one of ${_}`)
            }
            if (!w.includes($)) w.push($);
            return w
        }, [])
    }
    cH5.coreKnownTags = pH5;
    cH5.getTags = dH5
})
// @from(Ln 109245, Col 4)
Z6A = R((sH5) => {
    var W6A = kY(),
        nH5 = xO1(),
        rH5 = bO1(),
        oH5 = yR1(),
        C76 = Cn8(),
        aH5 = (A, q) => A.key < q.key ? -1 : A.key > q.key ? 1 : 0;
    class G6A {
        constructor({
            compat: A,
            customTags: q,
            merge: K,
            resolveKnownTags: Y,
            schema: z,
            sortMapEntries: w,
            toStringDefaults: H
        }) {
            this.compat = Array.isArray(A) ? C76.getTags(A, "compat") : A ? C76.getTags(null, A) : null, this.name = typeof z === "string" && z || "core", this.knownTags = Y ? C76.coreKnownTags : {}, this.tags = C76.getTags(q, this.name, K), this.toStringOptions = H ?? null, Object.defineProperty(this, W6A.MAP, {
                value: nH5.map
            }), Object.defineProperty(this, W6A.SCALAR, {
                value: oH5.string
            }), Object.defineProperty(this, W6A.SEQ, {
                value: rH5.seq
            }), this.sortMapEntries = typeof w === "function" ? w : w === !0 ? aH5 : null
        }
        clone() {
            let A = Object.create(G6A.prototype, Object.getOwnPropertyDescriptors(this));
            return A.tags = this.tags.slice(), A
        }
    }
    sH5.Schema = G6A
})
// @from(Ln 109277, Col 4)
Sn8 = R((q$5) => {
    var eH5 = kY(),
        f6A = ER1(),
        xR1 = NR1();

    function A$5(A, q) {
        let K = [],
            Y = q.directives === !0;
        if (q.directives !== !1 && A.directives) {
            let O = A.directives.toString(A);
            if (O) K.push(O), Y = !0;
            else if (A.directives.docStart) Y = !0
        }
        if (Y) K.push("---");
        let z = f6A.createStringifyContext(A, q),
            {
                commentString: w
            } = z.options;
        if (A.commentBefore) {
            if (K.length !== 1) K.unshift("");
            let O = w(A.commentBefore);
            K.unshift(xR1.indentComment(O, ""))
        }
        let H = !1,
            $ = null;
        if (A.contents) {
            if (eH5.isNode(A.contents)) {
                if (A.contents.spaceBefore && Y) K.push("");
                if (A.contents.commentBefore) {
                    let J = w(A.contents.commentBefore);
                    K.push(xR1.indentComment(J, ""))
                }
                z.forceBlockIndent = !!A.comment, $ = A.contents.comment
            }
            let O = $ ? void 0 : () => H = !0,
                _ = f6A.stringify(A.contents, z, () => $ = null, O);
            if ($) _ += xR1.lineComment(_, "", w($));
            if ((_[0] === "|" || _[0] === ">") && K[K.length - 1] === "---") K[K.length - 1] = `--- ${_}`;
            else K.push(_)
        } else K.push(f6A.stringify(A.contents, z));
        if (A.directives?.docEnd)
            if (A.comment) {
                let O = w(A.comment);
                if (O.includes(`
`)) K.push("..."), K.push(xR1.indentComment(O, ""));
                else K.push(`... ${O}`)
            } else K.push("...");
        else {
            let O = A.comment;
            if (O && H) O = O.replace(/^\n+/, "");
            if (O) {
                if ((!H || $) && K[K.length - 1] !== "") K.push("");
                K.push(xR1.indentComment(w(O), ""))
            }
        }
        return K.join(`
`) + `
`
    }
    q$5.stringifyDocument = A$5
})
// @from(Ln 109338, Col 4)
bR1 = R((J$5) => {
    var Y$5 = fR1(),
        BO1 = z76(),
        qL = kY(),
        z$5 = bn(),
        w$5 = hn(),
        H$5 = Z6A(),
        $$5 = Sn8(),
        V6A = q76(),
        O$5 = Q1A(),
        _$5 = VR1(),
        N6A = F1A();
    class T6A {
        constructor(A, q, K) {
            this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, qL.NODE_TYPE, {
                value: qL.DOC
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
                version: w
            } = z;
            if (K?._directives) {
                if (this.directives = K._directives.atDocument(), this.directives.yaml.explicit) w = this.directives.yaml.version
            } else this.directives = new N6A.Directives({
                version: w
            });
            this.setSchema(w, K), this.contents = A === void 0 ? null : this.createNode(A, Y, K)
        }
        clone() {
            let A = Object.create(T6A.prototype, {
                [qL.NODE_TYPE]: {
                    value: qL.DOC
                }
            });
            if (A.commentBefore = this.commentBefore, A.comment = this.comment, A.errors = this.errors.slice(), A.warnings = this.warnings.slice(), A.options = Object.assign({}, this.options), this.directives) A.directives = this.directives.clone();
            if (A.schema = this.schema.clone(), A.contents = qL.isNode(this.contents) ? this.contents.clone(A.schema) : this.contents, this.range) A.range = this.range.slice();
            return A
        }
        add(A) {
            if (mO1(this.contents)) this.contents.add(A)
        }
        addIn(A, q) {
            if (mO1(this.contents)) this.contents.addIn(A, q)
        }
        createAlias(A, q) {
            if (!A.anchor) {
                let K = V6A.anchorNames(this);
                A.anchor = !q || K.has(q) ? V6A.findNewAnchor(q || "a", K) : q
            }
            return new Y$5.Alias(A.anchor)
        }
        createNode(A, q, K) {
            let Y = void 0;
            if (typeof q === "function") A = q.call({
                "": A
            }, "", A), Y = q;
            else if (Array.isArray(q)) {
                let P = (G) => typeof G === "number" || G instanceof String || G instanceof Number,
                    W = q.filter(P).map(String);
                if (W.length > 0) q = q.concat(W);
                Y = q
            } else if (K === void 0 && q) K = q, q = void 0;
            let {
                aliasDuplicateObjects: z,
                anchorPrefix: w,
                flow: H,
                keepUndefined: $,
                onTagObj: O,
                tag: _
            } = K ?? {}, {
                onAnchor: J,
                setAnchors: X,
                sourceObjects: D
            } = V6A.createNodeAnchors(this, w || "a"), j = {
                aliasDuplicateObjects: z ?? !0,
                keepUndefined: $ ?? !1,
                onAnchor: J,
                onTagObj: O,
                replacer: Y,
                schema: this.schema,
                sourceObjects: D
            }, M = _$5.createNode(A, _, j);
            if (H && qL.isCollection(M)) M.flow = !0;
            return X(), M
        }
        createPair(A, q, K = {}) {
            let Y = this.createNode(A, null, K),
                z = this.createNode(q, null, K);
            return new z$5.Pair(Y, z)
        }
        delete(A) {
            return mO1(this.contents) ? this.contents.delete(A) : !1
        }
        deleteIn(A) {
            if (BO1.isEmptyPath(A)) {
                if (this.contents == null) return !1;
                return this.contents = null, !0
            }
            return mO1(this.contents) ? this.contents.deleteIn(A) : !1
        }
        get(A, q) {
            return qL.isCollection(this.contents) ? this.contents.get(A, q) : void 0
        }
        getIn(A, q) {
            if (BO1.isEmptyPath(A)) return !q && qL.isScalar(this.contents) ? this.contents.value : this.contents;
            return qL.isCollection(this.contents) ? this.contents.getIn(A, q) : void 0
        }
        has(A) {
            return qL.isCollection(this.contents) ? this.contents.has(A) : !1
        }
        hasIn(A) {
            if (BO1.isEmptyPath(A)) return this.contents !== void 0;
            return qL.isCollection(this.contents) ? this.contents.hasIn(A) : !1
        }
        set(A, q) {
            if (this.contents == null) this.contents = BO1.collectionFromPath(this.schema, [A], q);
            else if (mO1(this.contents)) this.contents.set(A, q)
        }
        setIn(A, q) {
            if (BO1.isEmptyPath(A)) this.contents = q;
            else if (this.contents == null) this.contents = BO1.collectionFromPath(this.schema, Array.from(A), q);
            else if (mO1(this.contents)) this.contents.setIn(A, q)
        }
        setSchema(A, q = {}) {
            if (typeof A === "number") A = String(A);
            let K;
            switch (A) {
                case "1.1":
                    if (this.directives) this.directives.yaml.version = "1.1";
                    else this.directives = new N6A.Directives({
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
                    else this.directives = new N6A.Directives({
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
            else if (K) this.schema = new H$5.Schema(Object.assign(K, q));
            else throw Error("With a null YAML version, the { schema: Schema } option is required")
        }
        toJS({
            json: A,
            jsonArg: q,
            mapAsMap: K,
            maxAliasCount: Y,
            onAnchor: z,
            reviver: w
        } = {}) {
            let H = {
                    anchors: new Map,
                    doc: this,
                    keep: !A,
                    mapAsMap: K === !0,
                    mapKeyWarned: !1,
                    maxAliasCount: typeof Y === "number" ? Y : 100
                },
                $ = w$5.toJS(this.contents, q ?? "", H);
            if (typeof z === "function")
                for (let {
                        count: O,
                        res: _
                    }
                    of H.anchors.values()) z(_, O);
            return typeof w === "function" ? O$5.applyReviver(w, {
                "": $
            }, "", $) : $
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
            return $$5.stringifyDocument(this, A)
        }
    }

    function mO1(A) {
        if (qL.isCollection(A)) return !0;
        throw Error("Expected a YAML collection as document contents")
    }
    J$5.Document = T6A
})
// @from(Ln 109563, Col 4)
uR1 = R((j$5) => {
    class S76 extends Error {
        constructor(A, q, K, Y) {
            super();
            this.name = A, this.code = K, this.message = Y, this.pos = q
        }
    }
    class hn8 extends S76 {
        constructor(A, q, K) {
            super("YAMLParseError", A, q, K)
        }
    }
    class In8 extends S76 {
        constructor(A, q, K) {
            super("YAMLWarning", A, q, K)
        }
    }
    var D$5 = (A, q) => (K) => {
        if (K.pos[0] === -1) return;
        K.linePos = K.pos.map(($) => q.linePos($));
        let {
            line: Y,
            col: z
        } = K.linePos[0];
        K.message += ` at line ${Y}, column ${z}`;
        let w = z - 1,
            H = A.substring(q.lineStarts[Y - 1], q.lineStarts[Y]).replace(/[\n\r]+$/, "");
        if (w >= 60 && H.length > 80) {
            let $ = Math.min(w - 39, H.length - 79);
            H = "…" + H.substring($), w -= $ - 1
        }
        if (H.length > 80) H = H.substring(0, 79) + "…";
        if (Y > 1 && /^ *$/.test(H.substring(0, w))) {
            let $ = A.substring(q.lineStarts[Y - 2], q.lineStarts[Y - 1]);
            if ($.length > 80) $ = $.substring(0, 79) + `…
`;
            H = $ + H
        }
        if (/[^ ]/.test(H)) {
            let $ = 1,
                O = K.linePos[1];
            if (O && O.line === Y && O.col > z) $ = Math.max(1, Math.min(O.col - z, 80 - w));
            let _ = " ".repeat(w) + "^".repeat($);
            K.message += `:

${H}
${_}
`
        }
    };
    j$5.YAMLError = S76;
    j$5.YAMLParseError = hn8;
    j$5.YAMLWarning = In8;
    j$5.prettifyError = D$5
})
// @from(Ln 109618, Col 4)
BR1 = R((f$5) => {
    function Z$5(A, {
        flow: q,
        indicator: K,
        next: Y,
        offset: z,
        onError: w,
        parentIndent: H,
        startOnNewline: $
    }) {
        let O = !1,
            _ = $,
            J = $,
            X = "",
            D = "",
            j = !1,
            M = !1,
            P = null,
            W = null,
            G = null,
            f = null,
            Z = null,
            N = null,
            T = null;
        for (let B of A) {
            if (M) {
                if (B.type !== "space" && B.type !== "newline" && B.type !== "comma") w(B.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
                M = !1
            }
            if (P) {
                if (_ && B.type !== "comment" && B.type !== "newline") w(P, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
                P = null
            }
            switch (B.type) {
                case "space":
                    if (!q && (K !== "doc-start" || Y?.type !== "flow-collection") && B.source.includes("\t")) P = B;
                    J = !0;
                    break;
                case "comment": {
                    if (!J) w(B, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    let S = B.source.substring(1) || " ";
                    if (!X) X = S;
                    else X += D + S;
                    D = "", _ = !1;
                    break
                }
                case "newline":
                    if (_) {
                        if (X) X += B.source;
                        else if (!N || K !== "seq-item-ind") O = !0
                    } else D += B.source;
                    if (_ = !0, j = !0, W || G) f = B;
                    J = !0;
                    break;
                case "anchor":
                    if (W) w(B, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
                    if (B.source.endsWith(":")) w(B.offset + B.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0);
                    W = B, T ?? (T = B.offset), _ = !1, J = !1, M = !0;
                    break;
                case "tag": {
                    if (G) w(B, "MULTIPLE_TAGS", "A node can have at most one tag");
                    G = B, T ?? (T = B.offset), _ = !1, J = !1, M = !0;
                    break
                }
                case K:
                    if (W || G) w(B, "BAD_PROP_ORDER", `Anchors and tags must be after the ${B.source} indicator`);
                    if (N) w(B, "UNEXPECTED_TOKEN", `Unexpected ${B.source} in ${q??"collection"}`);
                    N = B, _ = K === "seq-item-ind" || K === "explicit-key-ind", J = !1;
                    break;
                case "comma":
                    if (q) {
                        if (Z) w(B, "UNEXPECTED_TOKEN", `Unexpected , in ${q}`);
                        Z = B, _ = !1, J = !1;
                        break
                    }
                default:
                    w(B, "UNEXPECTED_TOKEN", `Unexpected ${B.type} token`), _ = !1, J = !1
            }
        }
        let k = A[A.length - 1],
            y = k ? k.offset + k.source.length : z;
        if (M && Y && Y.type !== "space" && Y.type !== "newline" && Y.type !== "comma" && (Y.type !== "scalar" || Y.source !== "")) w(Y.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        if (P && (_ && P.indent <= H || Y?.type === "block-map" || Y?.type === "block-seq")) w(P, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        return {
            comma: Z,
            found: N,
            spaceBefore: O,
            comment: X,
            hasNewline: j,
            anchor: W,
            tag: G,
            newlineAfterProp: f,
            end: y,
            start: T ?? y
        }
    }
    f$5.resolveProps = Z$5
})
// @from(Ln 109716, Col 4)
h76 = R((N$5) => {
    function v6A(A) {
        if (!A) return null;
        switch (A.type) {
            case "alias":
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                if (A.source.includes(`
`)) return !0;
                if (A.end) {
                    for (let q of A.end)
                        if (q.type === "newline") return !0
                }
                return !1;
            case "flow-collection":
                for (let q of A.items) {
                    for (let K of q.start)
                        if (K.type === "newline") return !0;
                    if (q.sep) {
                        for (let K of q.sep)
                            if (K.type === "newline") return !0
                    }
                    if (v6A(q.key) || v6A(q.value)) return !0
                }
                return !1;
            default:
                return !0
        }
    }
    N$5.containsNewline = v6A
})
// @from(Ln 109748, Col 4)
E6A = R((k$5) => {
    var v$5 = h76();

    function E$5(A, q, K) {
        if (q?.type === "flow-collection") {
            let Y = q.end[0];
            if (Y.indent === A && (Y.source === "]" || Y.source === "}") && v$5.containsNewline(q)) K(Y, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0)
        }
    }
    k$5.flowIndentCheck = E$5
})
// @from(Ln 109759, Col 4)
k6A = R((y$5) => {
    var xn8 = kY();

    function R$5(A, q, K) {
        let {
            uniqueKeys: Y
        } = A.options;
        if (Y === !1) return !1;
        let z = typeof Y === "function" ? Y : (w, H) => w === H || xn8.isScalar(w) && xn8.isScalar(H) && w.value === H.value;
        return q.some((w) => z(w.key, K))
    }
    y$5.mapIncludes = R$5
})
// @from(Ln 109772, Col 4)
Fn8 = R((b$5) => {
    var bn8 = bn(),
        S$5 = Bn(),
        un8 = BR1(),
        h$5 = h76(),
        Bn8 = E6A(),
        I$5 = k6A(),
        mn8 = "All mapping items must start at the same column";

    function x$5({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, w) {
        let $ = new(w?.nodeClass ?? S$5.YAMLMap)(K.schema);
        if (K.atRoot) K.atRoot = !1;
        let O = Y.offset,
            _ = null;
        for (let J of Y.items) {
            let {
                start: X,
                key: D,
                sep: j,
                value: M
            } = J, P = un8.resolveProps(X, {
                indicator: "explicit-key-ind",
                next: D ?? j?.[0],
                offset: O,
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !0
            }), W = !P.found;
            if (W) {
                if (D) {
                    if (D.type === "block-seq") z(O, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
                    else if ("indent" in D && D.indent !== Y.indent) z(O, "BAD_INDENT", mn8)
                }
                if (!P.anchor && !P.tag && !j) {
                    if (_ = P.end, P.comment)
                        if ($.comment) $.comment += `
` + P.comment;
                        else $.comment = P.comment;
                    continue
                }
                if (P.newlineAfterProp || h$5.containsNewline(D)) z(D ?? X[X.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line")
            } else if (P.found?.indent !== Y.indent) z(O, "BAD_INDENT", mn8);
            K.atKey = !0;
            let G = P.end,
                f = D ? A(K, D, P, z) : q(K, G, X, null, P, z);
            if (K.schema.compat) Bn8.flowIndentCheck(Y.indent, D, z);
            if (K.atKey = !1, I$5.mapIncludes(K, $.items, f)) z(G, "DUPLICATE_KEY", "Map keys must be unique");
            let Z = un8.resolveProps(j ?? [], {
                indicator: "map-value-ind",
                next: M,
                offset: f.range[2],
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !D || D.type === "block-scalar"
            });
            if (O = Z.end, Z.found) {
                if (W) {
                    if (M?.type === "block-map" && !Z.hasNewline) z(O, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
                    if (K.options.strict && P.start < Z.found.offset - 1024) z(f.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key")
                }
                let N = M ? A(K, M, Z, z) : q(K, O, j, null, Z, z);
                if (K.schema.compat) Bn8.flowIndentCheck(Y.indent, M, z);
                O = N.range[2];
                let T = new bn8.Pair(f, N);
                if (K.options.keepSourceTokens) T.srcToken = J;
                $.items.push(T)
            } else {
                if (W) z(f.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
                if (Z.comment)
                    if (f.comment) f.comment += `
` + Z.comment;
                    else f.comment = Z.comment;
                let N = new bn8.Pair(f);
                if (K.options.keepSourceTokens) N.srcToken = J;
                $.items.push(N)
            }
        }
        if (_ && _ < O) z(_, "IMPOSSIBLE", "Map comment with trailing content");
        return $.range = [Y.offset, O, _ ?? O], $
    }
    b$5.resolveBlockMap = x$5
})
// @from(Ln 109857, Col 4)
Qn8 = R((g$5) => {
    var B$5 = mn(),
        m$5 = BR1(),
        F$5 = E6A();

    function Q$5({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, w) {
        let $ = new(w?.nodeClass ?? B$5.YAMLSeq)(K.schema);
        if (K.atRoot) K.atRoot = !1;
        if (K.atKey) K.atKey = !1;
        let O = Y.offset,
            _ = null;
        for (let {
                start: J,
                value: X
            }
            of Y.items) {
            let D = m$5.resolveProps(J, {
                indicator: "seq-item-ind",
                next: X,
                offset: O,
                onError: z,
                parentIndent: Y.indent,
                startOnNewline: !0
            });
            if (!D.found)
                if (D.anchor || D.tag || X)
                    if (X && X.type === "block-seq") z(D.end, "BAD_INDENT", "All sequence items must start at the same column");
                    else z(O, "MISSING_CHAR", "Sequence item without - indicator");
            else {
                if (_ = D.end, D.comment) $.comment = D.comment;
                continue
            }
            let j = X ? A(K, X, D, z) : q(K, D.end, J, null, D, z);
            if (K.schema.compat) F$5.flowIndentCheck(Y.indent, X, z);
            O = j.range[2], $.items.push(j)
        }
        return $.range = [Y.offset, O, _ ?? O], $
    }
    g$5.resolveBlockSeq = Q$5
})
// @from(Ln 109900, Col 4)
FO1 = R((d$5) => {
    function p$5(A, q, K, Y) {
        let z = "";
        if (A) {
            let w = !1,
                H = "";
            for (let $ of A) {
                let {
                    source: O,
                    type: _
                } = $;
                switch (_) {
                    case "space":
                        w = !0;
                        break;
                    case "comment": {
                        if (K && !w) Y($, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                        let J = O.substring(1) || " ";
                        if (!z) z = J;
                        else z += H + J;
                        H = "";
                        break
                    }
                    case "newline":
                        if (z) H += O;
                        w = !0;
                        break;
                    default:
                        Y($, "UNEXPECTED_TOKEN", `Unexpected ${_} at node end`)
                }
                q += O.length
            }
        }
        return {
            comment: z,
            offset: q
        }
    }
    d$5.resolveEnd = p$5
})
// @from(Ln 109940, Col 4)
pn8 = R((t$5) => {
    var l$5 = kY(),
        i$5 = bn(),
        gn8 = Bn(),
        n$5 = mn(),
        r$5 = FO1(),
        Un8 = BR1(),
        o$5 = h76(),
        a$5 = k6A(),
        L6A = "Block collections are not allowed within flow collections",
        R6A = (A) => A && (A.type === "block-map" || A.type === "block-seq");

    function s$5({
        composeNode: A,
        composeEmptyNode: q
    }, K, Y, z, w) {
        let H = Y.start.source === "{",
            $ = H ? "flow map" : "flow sequence",
            _ = new(w?.nodeClass ?? (H ? gn8.YAMLMap : n$5.YAMLSeq))(K.schema);
        _.flow = !0;
        let J = K.atRoot;
        if (J) K.atRoot = !1;
        if (K.atKey) K.atKey = !1;
        let X = Y.offset + Y.start.source.length;
        for (let W = 0; W < Y.items.length; ++W) {
            let G = Y.items[W],
                {
                    start: f,
                    key: Z,
                    sep: N,
                    value: T
                } = G,
                k = Un8.resolveProps(f, {
                    flow: $,
                    indicator: "explicit-key-ind",
                    next: Z ?? N?.[0],
                    offset: X,
                    onError: z,
                    parentIndent: Y.indent,
                    startOnNewline: !1
                });
            if (!k.found) {
                if (!k.anchor && !k.tag && !N && !T) {
                    if (W === 0 && k.comma) z(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${$}`);
                    else if (W < Y.items.length - 1) z(k.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${$}`);
                    if (k.comment)
                        if (_.comment) _.comment += `
` + k.comment;
                        else _.comment = k.comment;
                    X = k.end;
                    continue
                }
                if (!H && K.options.strict && o$5.containsNewline(Z)) z(Z, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line")
            }
            if (W === 0) {
                if (k.comma) z(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${$}`)
            } else {
                if (!k.comma) z(k.start, "MISSING_CHAR", `Missing , between ${$} items`);
                if (k.comment) {
                    let y = "";
                    A: for (let B of f) switch (B.type) {
                        case "comma":
                        case "space":
                            break;
                        case "comment":
                            y = B.source.substring(1);
                            break A;
                        default:
                            break A
                    }
                    if (y) {
                        let B = _.items[_.items.length - 1];
                        if (l$5.isPair(B)) B = B.value ?? B.key;
                        if (B.comment) B.comment += `
` + y;
                        else B.comment = y;
                        k.comment = k.comment.substring(y.length + 1)
                    }
                }
            }
            if (!H && !N && !k.found) {
                let y = T ? A(K, T, k, z) : q(K, k.end, N, null, k, z);
                if (_.items.push(y), X = y.range[2], R6A(T)) z(y.range, "BLOCK_IN_FLOW", L6A)
            } else {
                K.atKey = !0;
                let y = k.end,
                    B = Z ? A(K, Z, k, z) : q(K, y, f, null, k, z);
                if (R6A(Z)) z(B.range, "BLOCK_IN_FLOW", L6A);
                K.atKey = !1;
                let S = Un8.resolveProps(N ?? [], {
                    flow: $,
                    indicator: "map-value-ind",
                    next: T,
                    offset: B.range[2],
                    onError: z,
                    parentIndent: Y.indent,
                    startOnNewline: !1
                });
                if (S.found) {
                    if (!H && !k.found && K.options.strict) {
                        if (N)
                            for (let g of N) {
                                if (g === S.found) break;
                                if (g.type === "newline") {
                                    z(g, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                                    break
                                }
                            }
                        if (k.start < S.found.offset - 1024) z(S.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")
                    }
                } else if (T)
                    if ("source" in T && T.source && T.source[0] === ":") z(T, "MISSING_CHAR", `Missing space after : in ${$}`);
                    else z(S.start, "MISSING_CHAR", `Missing , or : between ${$} items`);
                let m = T ? A(K, T, S, z) : S.found ? q(K, S.end, N, null, S, z) : null;
                if (m) {
                    if (R6A(T)) z(m.range, "BLOCK_IN_FLOW", L6A)
                } else if (S.comment)
                    if (B.comment) B.comment += `
` + S.comment;
                    else B.comment = S.comment;
                let b = new i$5.Pair(B, m);
                if (K.options.keepSourceTokens) b.srcToken = G;
                if (H) {
                    let g = _;
                    if (a$5.mapIncludes(K, g.items, B)) z(y, "DUPLICATE_KEY", "Map keys must be unique");
                    g.items.push(b)
                } else {
                    let g = new gn8.YAMLMap(K.schema);
                    g.flow = !0, g.items.push(b);
                    let U = (m ?? B).range;
                    g.range = [B.range[0], U[1], U[2]], _.items.push(g)
                }
                X = m ? m.range[2] : S.end
            }
        }
        let D = H ? "}" : "]",
            [j, ...M] = Y.end,
            P = X;
        if (j && j.source === D) P = j.offset + j.source.length;
        else {
            let W = $[0].toUpperCase() + $.substring(1),
                G = J ? `${W} must end with a ${D}` : `${W} in block collection must be sufficiently indented and end with a ${D}`;
            if (z(X, J ? "MISSING_CHAR" : "BAD_INDENT", G), j && j.source.length !== 1) M.unshift(j)
        }
        if (M.length > 0) {
            let W = r$5.resolveEnd(M, P, K.options.strict, z);
            if (W.comment)
                if (_.comment) _.comment += `
` + W.comment;
                else _.comment = W.comment;
            _.range = [Y.offset, P, W.offset]
        } else _.range = [Y.offset, P, P];
        return _
    }
    t$5.resolveFlowCollection = s$5
})
// @from(Ln 110096, Col 4)
dn8 = R((OO5) => {
    var AO5 = kY(),
        qO5 = MX(),
        KO5 = Bn(),
        YO5 = mn(),
        zO5 = Fn8(),
        wO5 = Qn8(),
        HO5 = pn8();

    function y6A(A, q, K, Y, z, w) {
        let H = K.type === "block-map" ? zO5.resolveBlockMap(A, q, K, Y, w) : K.type === "block-seq" ? wO5.resolveBlockSeq(A, q, K, Y, w) : HO5.resolveFlowCollection(A, q, K, Y, w),
            $ = H.constructor;
        if (z === "!" || z === $.tagName) return H.tag = $.tagName, H;
        if (z) H.tag = z;
        return H
    }

    function $O5(A, q, K, Y, z) {
        let w = Y.tag,
            H = !w ? null : q.directives.tagName(w.source, (D) => z(w, "TAG_RESOLVE_FAILED", D));
        if (K.type === "block-seq") {
            let {
                anchor: D,
                newlineAfterProp: j
            } = Y, M = D && w ? D.offset > w.offset ? D : w : D ?? w;
            if (M && (!j || j.offset < M.offset)) z(M, "MISSING_CHAR", "Missing newline after block sequence props")
        }
        let $ = K.type === "block-map" ? "map" : K.type === "block-seq" ? "seq" : K.start.source === "{" ? "map" : "seq";
        if (!w || !H || H === "!" || H === KO5.YAMLMap.tagName && $ === "map" || H === YO5.YAMLSeq.tagName && $ === "seq") return y6A(A, q, K, z, H);
        let O = q.schema.tags.find((D) => D.tag === H && D.collection === $);
        if (!O) {
            let D = q.schema.knownTags[H];
            if (D && D.collection === $) q.schema.tags.push(Object.assign({}, D, {
                default: !1
            })), O = D;
            else {
                if (D) z(w, "BAD_COLLECTION_TYPE", `${D.tag} used for ${$} collection, but expects ${D.collection??"scalar"}`, !0);
                else z(w, "TAG_RESOLVE_FAILED", `Unresolved tag: ${H}`, !0);
                return y6A(A, q, K, z, H)
            }
        }
        let _ = y6A(A, q, K, z, H, O),
            J = O.resolve?.(_, (D) => z(w, "TAG_RESOLVE_FAILED", D), q.options) ?? _,
            X = AO5.isNode(J) ? J : new qO5.Scalar(J);
        if (X.range = _.range, X.tag = H, O?.format) X.format = O.format;
        return X
    }
    OO5.composeCollection = $O5
})
// @from(Ln 110145, Col 4)
S6A = R((jO5) => {
    var C6A = MX();

    function JO5(A, q, K) {
        let Y = q.offset,
            z = XO5(q, A.options.strict, K);
        if (!z) return {
            value: "",
            type: null,
            comment: "",
            range: [Y, Y, Y]
        };
        let w = z.mode === ">" ? C6A.Scalar.BLOCK_FOLDED : C6A.Scalar.BLOCK_LITERAL,
            H = q.source ? DO5(q.source) : [],
            $ = H.length;
        for (let P = H.length - 1; P >= 0; --P) {
            let W = H[P][1];
            if (W === "" || W === "\r") $ = P;
            else break
        }
        if ($ === 0) {
            let P = z.chomp === "+" && H.length > 0 ? `
`.repeat(Math.max(1, H.length - 1)) : "",
                W = Y + z.length;
            if (q.source) W += q.source.length;
            return {
                value: P,
                type: w,
                comment: z.comment,
                range: [Y, W, W]
            }
        }
        let O = q.indent + z.indent,
            _ = q.offset + z.length,
            J = 0;
        for (let P = 0; P < $; ++P) {
            let [W, G] = H[P];
            if (G === "" || G === "\r") {
                if (z.indent === 0 && W.length > O) O = W.length
            } else {
                if (W.length < O) K(_ + W.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
                if (z.indent === 0) O = W.length;
                if (J = P, O === 0 && !A.atRoot) K(_, "BAD_INDENT", "Block scalar values in collections must be indented");
                break
            }
            _ += W.length + G.length + 1
        }
        for (let P = H.length - 1; P >= $; --P)
            if (H[P][0].length > O) $ = P + 1;
        let X = "",
            D = "",
            j = !1;
        for (let P = 0; P < J; ++P) X += H[P][0].slice(O) + `
`;
        for (let P = J; P < $; ++P) {
            let [W, G] = H[P];
            _ += W.length + G.length + 1;
            let f = G[G.length - 1] === "\r";
            if (f) G = G.slice(0, -1);
            if (G && W.length < O) {
                let N = `Block scalar lines must not be less indented than their ${z.indent?"explicit indentation indicator":"first line"}`;
                K(_ - G.length - (f ? 2 : 1), "BAD_INDENT", N), W = ""
            }
            if (w === C6A.Scalar.BLOCK_LITERAL) X += D + W.slice(O) + G, D = `
`;
            else if (W.length > O || G[0] === "\t") {
                if (D === " ") D = `
`;
                else if (!j && D === `
`) D = `

`;
                X += D + W.slice(O) + G, D = `
`, j = !0
            } else if (G === "")
                if (D === `
`) X += `
`;
                else D = `
`;
            else X += D + G, D = " ", j = !1
        }
        switch (z.chomp) {
            case "-":
                break;
            case "+":
                for (let P = $; P < H.length; ++P) X += `
` + H[P][0].slice(O);
                if (X[X.length - 1] !== `
`) X += `
`;
                break;
            default:
                X += `
`
        }
        let M = Y + z.length + q.source.length;
        return {
            value: X,
            type: w,
            comment: z.comment,
            range: [Y, M, M]
        }
    }

    function XO5({
        offset: A,
        props: q
    }, K, Y) {
        if (q[0].type !== "block-scalar-header") return Y(q[0], "IMPOSSIBLE", "Block scalar header not found"), null;
        let {
            source: z
        } = q[0], w = z[0], H = 0, $ = "", O = -1;
        for (let D = 1; D < z.length; ++D) {
            let j = z[D];
            if (!$ && (j === "-" || j === "+")) $ = j;
            else {
                let M = Number(j);
                if (!H && M) H = M;
                else if (O === -1) O = A + D
            }
        }
        if (O !== -1) Y(O, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${z}`);
        let _ = !1,
            J = "",
            X = z.length;
        for (let D = 1; D < q.length; ++D) {
            let j = q[D];
            switch (j.type) {
                case "space":
                    _ = !0;
                case "newline":
                    X += j.source.length;
                    break;
                case "comment":
                    if (K && !_) Y(j, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
                    X += j.source.length, J = j.source.substring(1);
                    break;
                case "error":
                    Y(j, "UNEXPECTED_TOKEN", j.message), X += j.source.length;
                    break;
                default: {
                    let M = `Unexpected token in block scalar header: ${j.type}`;
                    Y(j, "UNEXPECTED_TOKEN", M);
                    let P = j.source;
                    if (P && typeof P === "string") X += P.length
                }
            }
        }
        return {
            mode: w,
            indent: H,
            chomp: $,
            comment: J,
            length: X
        }
    }

    function DO5(A) {
        let q = A.split(/\n( *)/),
            K = q[0],
            Y = K.match(/^( *)/),
            w = [Y?.[1] ? [Y[1], K.slice(Y[1].length)] : ["", K]];
        for (let H = 1; H < q.length; H += 2) w.push([q[H], q[H + 1]]);
        return w
    }
    jO5.resolveBlockScalar = JO5
})
// @from(Ln 110313, Col 4)
I6A = R((vO5) => {
    var h6A = MX(),
        PO5 = FO1();

    function WO5(A, q, K) {
        let {
            offset: Y,
            type: z,
            source: w,
            end: H
        } = A, $, O, _ = (D, j, M) => K(Y + D, j, M);
        switch (z) {
            case "scalar":
                $ = h6A.Scalar.PLAIN, O = GO5(w, _);
                break;
            case "single-quoted-scalar":
                $ = h6A.Scalar.QUOTE_SINGLE, O = ZO5(w, _);
                break;
            case "double-quoted-scalar":
                $ = h6A.Scalar.QUOTE_DOUBLE, O = fO5(w, _);
                break;
            default:
                return K(A, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${z}`), {
                    value: "",
                    type: null,
                    comment: "",
                    range: [Y, Y + w.length, Y + w.length]
                }
        }
        let J = Y + w.length,
            X = PO5.resolveEnd(H, J, q, K);
        return {
            value: O,
            type: $,
            comment: X.comment,
            range: [Y, J, X.offset]
        }
    }

    function GO5(A, q) {
        let K = "";
        switch (A[0]) {
            case "\t":
                K = "a tab character";
                break;
            case ",":
                K = "flow indicator character ,";
                break;
            case "%":
                K = "directive indicator character %";
                break;
            case "|":
            case ">": {
                K = `block scalar indicator ${A[0]}`;
                break
            }
            case "@":
            case "`": {
                K = `reserved character ${A[0]}`;
                break
            }
        }
        if (K) q(0, "BAD_SCALAR_START", `Plain value cannot start with ${K}`);
        return cn8(A)
    }

    function ZO5(A, q) {
        if (A[A.length - 1] !== "'" || A.length === 1) q(A.length, "MISSING_CHAR", "Missing closing 'quote");
        return cn8(A.slice(1, -1)).replace(/''/g, "'")
    }

    function cn8(A) {
        let q, K;
        try {
            q = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), K = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy")
        } catch {
            q = /(.*?)[ \t]*\r?\n/sy, K = /[ \t]*(.*?)[ \t]*\r?\n/sy
        }
        let Y = q.exec(A);
        if (!Y) return A;
        let z = Y[1],
            w = " ",
            H = q.lastIndex;
        K.lastIndex = H;
        while (Y = K.exec(A)) {
            if (Y[1] === "")
                if (w === `
`) z += w;
                else w = `
`;
            else z += w + Y[1], w = " ";
            H = K.lastIndex
        }
        let $ = /[ \t]*(.*)/sy;
        return $.lastIndex = H, Y = $.exec(A), z + w + (Y?.[1] ?? "")
    }

    function fO5(A, q) {
        let K = "";
        for (let Y = 1; Y < A.length - 1; ++Y) {
            let z = A[Y];
            if (z === "\r" && A[Y + 1] === `
`) continue;
            if (z === `
`) {
                let {
                    fold: w,
                    offset: H
                } = VO5(A, Y);
                K += w, Y = H
            } else if (z === "\\") {
                let w = A[++Y],
                    H = NO5[w];
                if (H) K += H;
                else if (w === `
`) {
                    w = A[Y + 1];
                    while (w === " " || w === "\t") w = A[++Y + 1]
                } else if (w === "\r" && A[Y + 1] === `
`) {
                    w = A[++Y + 1];
                    while (w === " " || w === "\t") w = A[++Y + 1]
                } else if (w === "x" || w === "u" || w === "U") {
                    let $ = {
                        x: 2,
                        u: 4,
                        U: 8
                    } [w];
                    K += TO5(A, Y + 1, $, q), Y += $
                } else {
                    let $ = A.substr(Y - 1, 2);
                    q(Y - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${$}`), K += $
                }
            } else if (z === " " || z === "\t") {
                let w = Y,
                    H = A[Y + 1];
                while (H === " " || H === "\t") H = A[++Y + 1];
                if (H !== `
` && !(H === "\r" && A[Y + 2] === `
`)) K += Y > w ? A.slice(w, Y + 1) : z
            } else K += z
        }
        if (A[A.length - 1] !== '"' || A.length === 1) q(A.length, "MISSING_CHAR", 'Missing closing "quote');
        return K
    }

    function VO5(A, q) {
        let K = "",
            Y = A[q + 1];
        while (Y === " " || Y === "\t" || Y === `
` || Y === "\r") {
            if (Y === "\r" && A[q + 2] !== `
`) break;
            if (Y === `
`) K += `
`;
            q += 1, Y = A[q + 1]
        }
        if (!K) K = " ";
        return {
            fold: K,
            offset: q
        }
    }
    var NO5 = {
        "0": "\x00",
        a: "\x07",
        b: "\b",
        e: "\x1B",
        f: "\f",
        n: `
`,
        r: "\r",
        t: "\t",
        v: "\v",
        N: "",
        _: " ",
        L: "\u2028",
        P: "\u2029",
        " ": " ",
        '"': '"',
        "/": "/",
        "\\": "\\",
        "\t": "\t"
    };

    function TO5(A, q, K, Y) {
        let z = A.substr(q, K),
            H = z.length === K && /^[0-9a-fA-F]+$/.test(z) ? parseInt(z, 16) : NaN;
        if (isNaN(H)) {
            let $ = A.substr(q - 2, K + 2);
            return Y(q - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${$}`), $
        }
        return String.fromCodePoint(H)
    }
    vO5.resolveFlowScalar = WO5
})
// @from(Ln 110512, Col 4)
in8 = R((SO5) => {
    var S81 = kY(),
        ln8 = MX(),
        kO5 = S6A(),
        LO5 = I6A();

    function RO5(A, q, K, Y) {
        let {
            value: z,
            type: w,
            comment: H,
            range: $
        } = q.type === "block-scalar" ? kO5.resolveBlockScalar(A, q, Y) : LO5.resolveFlowScalar(q, A.options.strict, Y), O = K ? A.directives.tagName(K.source, (X) => Y(K, "TAG_RESOLVE_FAILED", X)) : null, _;
        if (A.options.stringKeys && A.atKey) _ = A.schema[S81.SCALAR];
        else if (O) _ = yO5(A.schema, z, O, K, Y);
        else if (q.type === "scalar") _ = CO5(A, z, q, Y);
        else _ = A.schema[S81.SCALAR];
        let J;
        try {
            let X = _.resolve(z, (D) => Y(K ?? q, "TAG_RESOLVE_FAILED", D), A.options);
            J = S81.isScalar(X) ? X : new ln8.Scalar(X)
        } catch (X) {
            let D = X instanceof Error ? X.message : String(X);
            Y(K ?? q, "TAG_RESOLVE_FAILED", D), J = new ln8.Scalar(z)
        }
        if (J.range = $, J.source = z, w) J.type = w;
        if (O) J.tag = O;
        if (_.format) J.format = _.format;
        if (H) J.comment = H;
        return J
    }

    function yO5(A, q, K, Y, z) {
        if (K === "!") return A[S81.SCALAR];
        let w = [];
        for (let $ of A.tags)
            if (!$.collection && $.tag === K)
                if ($.default && $.test) w.push($);
                else return $;
        for (let $ of w)
            if ($.test?.test(q)) return $;
        let H = A.knownTags[K];
        if (H && !H.collection) return A.tags.push(Object.assign({}, H, {
            default: !1,
            test: void 0
        })), H;
        return z(Y, "TAG_RESOLVE_FAILED", `Unresolved tag: ${K}`, K !== "tag:yaml.org,2002:str"), A[S81.SCALAR]
    }

    function CO5({
        atKey: A,
        directives: q,
        schema: K
    }, Y, z, w) {
        let H = K.tags.find(($) => ($.default === !0 || A && $.default === "key") && $.test?.test(Y)) || K[S81.SCALAR];
        if (K.compat) {
            let $ = K.compat.find((O) => O.default && O.test?.test(Y)) ?? K[S81.SCALAR];
            if (H.tag !== $.tag) {
                let O = q.tagString(H.tag),
                    _ = q.tagString($.tag),
                    J = `Value may be parsed as either ${O} or ${_}`;
                w(z, "TAG_RESOLVE_FAILED", J, !0)
            }
        }
        return H
    }
    SO5.composeScalar = RO5
})
// @from(Ln 110580, Col 4)
nn8 = R((xO5) => {
    function IO5(A, q, K) {
        if (q) {
            K ?? (K = q.length);
            for (let Y = K - 1; Y >= 0; --Y) {
                let z = q[Y];
                switch (z.type) {
                    case "space":
                    case "comment":
                    case "newline":
                        A -= z.source.length;
                        continue
                }
                z = q[++Y];
                while (z?.type === "space") A += z.source.length, z = q[++Y];
                break
            }
        }
        return A
    }
    xO5.emptyScalarPosition = IO5
})
// @from(Ln 110602, Col 4)
an8 = R((pO5) => {
    var uO5 = fR1(),
        BO5 = kY(),
        mO5 = dn8(),
        rn8 = in8(),
        FO5 = FO1(),
        QO5 = nn8(),
        gO5 = {
            composeNode: on8,
            composeEmptyNode: x6A
        };

    function on8(A, q, K, Y) {
        let z = A.atKey,
            {
                spaceBefore: w,
                comment: H,
                anchor: $,
                tag: O
            } = K,
            _, J = !0;
        switch (q.type) {
            case "alias":
                if (_ = UO5(A, q, Y), $ || O) Y(q, "ALIAS_PROPS", "An alias node must not specify any properties");
                break;
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar":
            case "block-scalar":
                if (_ = rn8.composeScalar(A, q, O, Y), $) _.anchor = $.source.substring(1);
                break;
            case "block-map":
            case "block-seq":
            case "flow-collection":
                if (_ = mO5.composeCollection(gO5, A, q, K, Y), $) _.anchor = $.source.substring(1);
                break;
            default: {
                let X = q.type === "error" ? q.message : `Unsupported token (type: ${q.type})`;
                Y(q, "UNEXPECTED_TOKEN", X), _ = x6A(A, q.offset, void 0, null, K, Y), J = !1
            }
        }
        if ($ && _.anchor === "") Y($, "BAD_ALIAS", "Anchor cannot be an empty string");
        if (z && A.options.stringKeys && (!BO5.isScalar(_) || typeof _.value !== "string" || _.tag && _.tag !== "tag:yaml.org,2002:str")) Y(O ?? q, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
        if (w) _.spaceBefore = !0;
        if (H)
            if (q.type === "scalar" && q.source === "") _.comment = H;
            else _.commentBefore = H;
        if (A.options.keepSourceTokens && J) _.srcToken = q;
        return _
    }

    function x6A(A, q, K, Y, {
        spaceBefore: z,
        comment: w,
        anchor: H,
        tag: $,
        end: O
    }, _) {
        let J = {
                type: "scalar",
                offset: QO5.emptyScalarPosition(q, K, Y),
                indent: -1,
                source: ""
            },
            X = rn8.composeScalar(A, J, $, _);
        if (H) {
            if (X.anchor = H.source.substring(1), X.anchor === "") _(H, "BAD_ALIAS", "Anchor cannot be an empty string")
        }
        if (z) X.spaceBefore = !0;
        if (w) X.comment = w, X.range[2] = O;
        return X
    }

    function UO5({
        options: A
    }, {
        offset: q,
        source: K,
        end: Y
    }, z) {
        let w = new uO5.Alias(K.substring(1));
        if (w.source === "") z(q, "BAD_ALIAS", "Alias cannot be an empty string");
        if (w.source.endsWith(":")) z(q + K.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
        let H = q + K.length,
            $ = FO5.resolveEnd(Y, H, A.strict, z);
        if (w.range = [q, H, $.offset], $.comment) w.comment = $.comment;
        return w
    }
    pO5.composeEmptyNode = x6A;
    pO5.composeNode = on8
})
// @from(Ln 110693, Col 4)
tn8 = R((oO5) => {
    var lO5 = bR1(),
        sn8 = an8(),
        iO5 = FO1(),
        nO5 = BR1();

    function rO5(A, q, {
        offset: K,
        start: Y,
        value: z,
        end: w
    }, H) {
        let $ = Object.assign({
                _directives: q
            }, A),
            O = new lO5.Document(void 0, $),
            _ = {
                atKey: !1,
                atRoot: !0,
                directives: O.directives,
                options: O.options,
                schema: O.schema
            },
            J = nO5.resolveProps(Y, {
                indicator: "doc-start",
                next: z ?? w?.[0],
                offset: K,
                onError: H,
                parentIndent: 0,
                startOnNewline: !0
            });
        if (J.found) {
            if (O.directives.docStart = !0, z && (z.type === "block-map" || z.type === "block-seq") && !J.hasNewline) H(J.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")
        }
        O.contents = z ? sn8.composeNode(_, z, J, H) : sn8.composeEmptyNode(_, J.end, Y, null, J, H);
        let X = O.contents.range[2],
            D = iO5.resolveEnd(w, X, !1, H);
        if (D.comment) O.comment = D.comment;
        return O.range = [K, X, D.offset], O
    }
    oO5.composeDoc = rO5
})
// @from(Ln 110735, Col 4)
b6A = R((K_5) => {
    var sO5 = h1("process"),
        tO5 = F1A(),
        eO5 = bR1(),
        mR1 = uR1(),
        en8 = kY(),
        A_5 = tn8(),
        q_5 = FO1();

    function FR1(A) {
        if (typeof A === "number") return [A, A + 1];
        if (Array.isArray(A)) return A.length === 2 ? A : [A[0], A[1]];
        let {
            offset: q,
            source: K
        } = A;
        return [q, q + (typeof K === "string" ? K.length : 1)]
    }

    function Ar8(A) {
        let q = "",
            K = !1,
            Y = !1;
        for (let z = 0; z < A.length; ++z) {
            let w = A[z];
            switch (w[0]) {
                case "#":
                    q += (q === "" ? "" : Y ? `

` : `
`) + (w.substring(1) || " "), K = !0, Y = !1;
                    break;
                case "%":
                    if (A[z + 1]?.[0] !== "#") z += 1;
                    K = !1;
                    break;
                default:
                    if (!K) Y = !0;
                    K = !1
            }
        }
        return {
            comment: q,
            afterEmptyLine: Y
        }
    }
    class qr8 {
        constructor(A = {}) {
            this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (q, K, Y, z) => {
                let w = FR1(q);
                if (z) this.warnings.push(new mR1.YAMLWarning(w, K, Y));
                else this.errors.push(new mR1.YAMLParseError(w, K, Y))
            }, this.directives = new tO5.Directives({
                version: A.version || "1.2"
            }), this.options = A
        }
        decorate(A, q) {
            let {
                comment: K,
                afterEmptyLine: Y
            } = Ar8(this.prelude);
            if (K) {
                let z = A.contents;
                if (q) A.comment = A.comment ? `${A.comment}
${K}` : K;
                else if (Y || A.directives.docStart || !z) A.commentBefore = K;
                else if (en8.isCollection(z) && !z.flow && z.items.length > 0) {
                    let w = z.items[0];
                    if (en8.isPair(w)) w = w.key;
                    let H = w.commentBefore;
                    w.commentBefore = H ? `${K}
${H}` : K
                } else {
                    let w = z.commentBefore;
                    z.commentBefore = w ? `${K}
${w}` : K
                }
            }
            if (q) Array.prototype.push.apply(A.errors, this.errors), Array.prototype.push.apply(A.warnings, this.warnings);
            else A.errors = this.errors, A.warnings = this.warnings;
            this.prelude = [], this.errors = [], this.warnings = []
        }
        streamInfo() {
            return {
                comment: Ar8(this.prelude).comment,
                directives: this.directives,
                errors: this.errors,
                warnings: this.warnings
            }
        }* compose(A, q = !1, K = -1) {
            for (let Y of A) yield* this.next(Y);
            yield* this.end(q, K)
        }* next(A) {
            if (sO5.env.LOG_STREAM) console.dir(A, {
                depth: null
            });
            switch (A.type) {
                case "directive":
                    this.directives.add(A.source, (q, K, Y) => {
                        let z = FR1(A);
                        z[0] += q, this.onError(z, "BAD_DIRECTIVE", K, Y)
                    }), this.prelude.push(A.source), this.atDirectives = !0;
                    break;
                case "document": {
                    let q = A_5.composeDoc(this.options, this.directives, A, this.onError);
                    if (this.atDirectives && !q.directives.docStart) this.onError(A, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
                    if (this.decorate(q, !1), this.doc) yield this.doc;
                    this.doc = q, this.atDirectives = !1;
                    break
                }
                case "byte-order-mark":
                case "space":
                    break;
                case "comment":
                case "newline":
                    this.prelude.push(A.source);
                    break;
                case "error": {
                    let q = A.source ? `${A.message}: ${JSON.stringify(A.source)}` : A.message,
                        K = new mR1.YAMLParseError(FR1(A), "UNEXPECTED_TOKEN", q);
                    if (this.atDirectives || !this.doc) this.errors.push(K);
                    else this.doc.errors.push(K);
                    break
                }
                case "doc-end": {
                    if (!this.doc) {
                        this.errors.push(new mR1.YAMLParseError(FR1(A), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
                        break
                    }
                    this.doc.directives.docEnd = !0;
                    let q = q_5.resolveEnd(A.end, A.offset + A.source.length, this.doc.options.strict, this.onError);
                    if (this.decorate(this.doc, !0), q.comment) {
                        let K = this.doc.comment;
                        this.doc.comment = K ? `${K}
${q.comment}` : q.comment
                    }
                    this.doc.range[2] = q.offset;
                    break
                }
                default:
                    this.errors.push(new mR1.YAMLParseError(FR1(A), "UNEXPECTED_TOKEN", `Unsupported token ${A.type}`))
            }
        }* end(A = !1, q = -1) {
            if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
            else if (A) {
                let K = Object.assign({
                        _directives: this.directives
                    }, this.options),
                    Y = new eO5.Document(void 0, K);
                if (this.atDirectives) this.onError(q, "MISSING_CHAR", "Missing directives-end indicator line");
                Y.range = [0, q, q], this.decorate(Y, !1), yield Y
            }
        }
    }
    K_5.Composer = qr8
})
// @from(Ln 110891, Col 4)
zr8 = R((X_5) => {
    var z_5 = S6A(),
        w_5 = I6A(),
        H_5 = uR1(),
        Kr8 = vR1();

    function $_5(A, q = !0, K) {
        if (A) {
            let Y = (z, w, H) => {
                let $ = typeof z === "number" ? z : Array.isArray(z) ? z[0] : z.offset;
                if (K) K($, w, H);
                else throw new H_5.YAMLParseError([$, $ + 1], w, H)
            };
            switch (A.type) {
                case "scalar":
                case "single-quoted-scalar":
                case "double-quoted-scalar":
                    return w_5.resolveFlowScalar(A, q, Y);
                case "block-scalar":
                    return z_5.resolveBlockScalar({
                        options: {
                            strict: q
                        }
                    }, A, Y)
            }
        }
        return null
    }

    function O_5(A, q) {
        let {
            implicitKey: K = !1,
            indent: Y,
            inFlow: z = !1,
            offset: w = -1,
            type: H = "PLAIN"
        } = q, $ = Kr8.stringifyString({
            type: H,
            value: A
        }, {
            implicitKey: K,
            indent: Y > 0 ? " ".repeat(Y) : "",
            inFlow: z,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        }), O = q.end ?? [{
            type: "newline",
            offset: -1,
            indent: Y,
            source: `
`
        }];
        switch ($[0]) {
            case "|":
            case ">": {
                let _ = $.indexOf(`
`),
                    J = $.substring(0, _),
                    X = $.substring(_ + 1) + `
`,
                    D = [{
                        type: "block-scalar-header",
                        offset: w,
                        indent: Y,
                        source: J
                    }];
                if (!Yr8(D, O)) D.push({
                    type: "newline",
                    offset: -1,
                    indent: Y,
                    source: `
`
                });
                return {
                    type: "block-scalar",
                    offset: w,
                    indent: Y,
                    props: D,
                    source: X
                }
            }
            case '"':
                return {
                    type: "double-quoted-scalar", offset: w, indent: Y, source: $, end: O
                };
            case "'":
                return {
                    type: "single-quoted-scalar", offset: w, indent: Y, source: $, end: O
                };
            default:
                return {
                    type: "scalar", offset: w, indent: Y, source: $, end: O
                }
        }
    }

    function __5(A, q, K = {}) {
        let {
            afterKey: Y = !1,
            implicitKey: z = !1,
            inFlow: w = !1,
            type: H
        } = K, $ = "indent" in A ? A.indent : null;
        if (Y && typeof $ === "number") $ += 2;
        if (!H) switch (A.type) {
            case "single-quoted-scalar":
                H = "QUOTE_SINGLE";
                break;
            case "double-quoted-scalar":
                H = "QUOTE_DOUBLE";
                break;
            case "block-scalar": {
                let _ = A.props[0];
                if (_.type !== "block-scalar-header") throw Error("Invalid block scalar header");
                H = _.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
                break
            }
            default:
                H = "PLAIN"
        }
        let O = Kr8.stringifyString({
            type: H,
            value: q
        }, {
            implicitKey: z || $ === null,
            indent: $ !== null && $ > 0 ? " ".repeat($) : "",
            inFlow: w,
            options: {
                blockQuote: !0,
                lineWidth: -1
            }
        });
        switch (O[0]) {
            case "|":
            case ">":
                J_5(A, O);
                break;
            case '"':
                u6A(A, O, "double-quoted-scalar");
                break;
            case "'":
                u6A(A, O, "single-quoted-scalar");
                break;
            default:
                u6A(A, O, "scalar")
        }
    }

    function J_5(A, q) {
        let K = q.indexOf(`
`),
            Y = q.substring(0, K),
            z = q.substring(K + 1) + `
`;
        if (A.type === "block-scalar") {
            let w = A.props[0];
            if (w.type !== "block-scalar-header") throw Error("Invalid block scalar header");
            w.source = Y, A.source = z
        } else {
            let {
                offset: w
            } = A, H = "indent" in A ? A.indent : -1, $ = [{
                type: "block-scalar-header",
                offset: w,
                indent: H,
                source: Y
            }];
            if (!Yr8($, "end" in A ? A.end : void 0)) $.push({
                type: "newline",
                offset: -1,
                indent: H,
                source: `
`
            });
            for (let O of Object.keys(A))
                if (O !== "type" && O !== "offset") delete A[O];
            Object.assign(A, {
                type: "block-scalar",
                indent: H,
                props: $,
                source: z
            })
        }
    }

    function Yr8(A, q) {
        if (q)
            for (let K of q) switch (K.type) {
                case "space":
                case "comment":
                    A.push(K);
                    break;
                case "newline":
                    return A.push(K), !0
            }
        return !1
    }

    function u6A(A, q, K) {
        switch (A.type) {
            case "scalar":
            case "double-quoted-scalar":
            case "single-quoted-scalar":
                A.type = K, A.source = q;
                break;
            case "block-scalar": {
                let Y = A.props.slice(1),
                    z = q.length;
                if (A.props[0].type === "block-scalar-header") z -= A.props[0].source.length;
                for (let w of Y) w.offset += z;
                delete A.props, Object.assign(A, {
                    type: K,
                    source: q,
                    end: Y
                });
                break
            }
            case "block-map":
            case "block-seq": {
                let z = {
                    type: "newline",
                    offset: A.offset + q.length,
                    indent: A.indent,
                    source: `
`
                };
                delete A.items, Object.assign(A, {
                    type: K,
                    source: q,
                    end: [z]
                });
                break
            }
            default: {
                let Y = "indent" in A ? A.indent : -1,
                    z = "end" in A && Array.isArray(A.end) ? A.end.filter((w) => w.type === "space" || w.type === "comment" || w.type === "newline") : [];
                for (let w of Object.keys(A))
                    if (w !== "type" && w !== "offset") delete A[w];
                Object.assign(A, {
                    type: K,
                    indent: Y,
                    source: q,
                    end: z
                })
            }
        }
    }
    X_5.createScalarToken = O_5;
    X_5.resolveAsScalar = $_5;
    X_5.setScalarValue = __5
})
// @from(Ln 111144, Col 4)
wr8 = R((W_5) => {
    var P_5 = (A) => ("type" in A) ? x76(A) : I76(A);

    function x76(A) {
        switch (A.type) {
            case "block-scalar": {
                let q = "";
                for (let K of A.props) q += x76(K);
                return q + A.source
            }
            case "block-map":
            case "block-seq": {
                let q = "";
                for (let K of A.items) q += I76(K);
                return q
            }
            case "flow-collection": {
                let q = A.start.source;
                for (let K of A.items) q += I76(K);
                for (let K of A.end) q += K.source;
                return q
            }
            case "document": {
                let q = I76(A);
                if (A.end)
                    for (let K of A.end) q += K.source;
                return q
            }
            default: {
                let q = A.source;
                if ("end" in A && A.end)
                    for (let K of A.end) q += K.source;
                return q
            }
        }
    }

    function I76({
        start: A,
        key: q,
        sep: K,
        value: Y
    }) {
        let z = "";
        for (let w of A) z += w.source;
        if (q) z += x76(q);
        if (K)
            for (let w of K) z += w.source;
        if (Y) z += x76(Y);
        return z
    }
    W_5.stringify = P_5
})
// @from(Ln 111197, Col 4)
Or8 = R((f_5) => {
    var B6A = Symbol("break visit"),
        Z_5 = Symbol("skip children"),
        Hr8 = Symbol("remove item");

    function h81(A, q) {
        if ("type" in A && A.type === "document") A = {
            start: A.start,
            value: A.value
        };
        $r8(Object.freeze([]), A, q)
    }
    h81.BREAK = B6A;
    h81.SKIP = Z_5;
    h81.REMOVE = Hr8;
    h81.itemAtPath = (A, q) => {
        let K = A;
        for (let [Y, z] of q) {
            let w = K?.[Y];
            if (w && "items" in w) K = w.items[z];
            else return
        }
        return K
    };
    h81.parentCollection = (A, q) => {
        let K = h81.itemAtPath(A, q.slice(0, -1)),
            Y = q[q.length - 1][0],
            z = K?.[Y];
        if (z && "items" in z) return z;
        throw Error("Parent collection not found")
    };

    function $r8(A, q, K) {
        let Y = K(q, A);
        if (typeof Y === "symbol") return Y;
        for (let z of ["key", "value"]) {
            let w = q[z];
            if (w && "items" in w) {
                for (let H = 0; H < w.items.length; ++H) {
                    let $ = $r8(Object.freeze(A.concat([
                        [z, H]
                    ])), w.items[H], K);
                    if (typeof $ === "number") H = $ - 1;
                    else if ($ === B6A) return B6A;
                    else if ($ === Hr8) w.items.splice(H, 1), H -= 1
                }
                if (typeof Y === "function" && z === "key") Y = Y(q, A)
            }
        }
        return typeof Y === "function" ? Y(q, A) : Y
    }
    f_5.visit = h81
})
// @from(Ln 111250, Col 4)
b76 = R((R_5) => {
    var m6A = zr8(),
        N_5 = wr8(),
        T_5 = Or8(),
        F6A = "\uFEFF",
        Q6A = "\x02",
        g6A = "\x18",
        U6A = "\x1F",
        v_5 = (A) => !!A && ("items" in A),
        E_5 = (A) => !!A && (A.type === "scalar" || A.type === "single-quoted-scalar" || A.type === "double-quoted-scalar" || A.type === "block-scalar");

    function k_5(A) {
        switch (A) {
            case F6A:
                return "<BOM>";
            case Q6A:
                return "<DOC>";
            case g6A:
                return "<FLOW_END>";
            case U6A:
                return "<SCALAR>";
            default:
                return JSON.stringify(A)
        }
    }

    function L_5(A) {
        switch (A) {
            case F6A:
                return "byte-order-mark";
            case Q6A:
                return "doc-mode";
            case g6A:
                return "flow-error-end";
            case U6A:
                return "scalar";
            case "---":
                return "doc-start";
            case "...":
                return "doc-end";
            case "":
            case `
`:
            case `\r
`:
                return "newline";
            case "-":
                return "seq-item-ind";
            case "?":
                return "explicit-key-ind";
            case ":":
                return "map-value-ind";
            case "{":
                return "flow-map-start";
            case "}":
                return "flow-map-end";
            case "[":
                return "flow-seq-start";
            case "]":
                return "flow-seq-end";
            case ",":
                return "comma"
        }
        switch (A[0]) {
            case " ":
            case "\t":
                return "space";
            case "#":
                return "comment";
            case "%":
                return "directive-line";
            case "*":
                return "alias";
            case "&":
                return "anchor";
            case "!":
                return "tag";
            case "'":
                return "single-quoted-scalar";
            case '"':
                return "double-quoted-scalar";
            case "|":
            case ">":
                return "block-scalar-header"
        }
        return null
    }
    R_5.createScalarToken = m6A.createScalarToken;
    R_5.resolveAsScalar = m6A.resolveAsScalar;
    R_5.setScalarValue = m6A.setScalarValue;
    R_5.stringify = N_5.stringify;
    R_5.visit = T_5.visit;
    R_5.BOM = F6A;
    R_5.DOCUMENT = Q6A;
    R_5.FLOW_END = g6A;
    R_5.SCALAR = U6A;
    R_5.isCollection = v_5;
    R_5.isScalar = E_5;
    R_5.prettyToken = k_5;
    R_5.tokenType = L_5
})