
// @from(Ln 12760, Col 0)
class xe6 {
    constructor(A) {
        this.counter = 0, this.metadataRegistry = A?.metadata ?? Cx, this.target = A?.target ?? "draft-2020-12", this.unrepresentable = A?.unrepresentable ?? "throw", this.override = A?.override ?? (() => {}), this.io = A?.io ?? "output", this.seen = new Map
    }
    process(A, q = {
        path: [],
        schemaPath: []
    }) {
        var K;
        let Y = A._zod.def,
            z = {
                guid: "uuid",
                url: "uri",
                datetime: "date-time",
                json_string: "json-string",
                regex: ""
            },
            _ = this.seen.get(A);
        if (_) {
            if (_.count++, q.schemaPath.includes(A)) _.cycle = q.path;
            return _.schema
        }
        let w = {
            schema: {},
            count: 1,
            cycle: void 0,
            path: q.path
        };
        this.seen.set(A, w);
        let O = A._zod.toJSONSchema?.();
        if (O) w.schema = O;
        else {
            let j = {
                    ...q,
                    schemaPath: [...q.schemaPath, A],
                    path: q.path
                },
                J = A._zod.parent;
            if (J) w.ref = J, this.process(J, j), this.seen.get(J).isParent = !0;
            else {
                let M = w.schema;
                switch (Y.type) {
                    case "string": {
                        let D = M;
                        D.type = "string";
                        let {
                            minimum: X,
                            maximum: P,
                            format: W,
                            patterns: Z,
                            contentEncoding: G
                        } = A._zod.bag;
                        if (typeof X === "number") D.minLength = X;
                        if (typeof P === "number") D.maxLength = P;
                        if (W) {
                            if (D.format = z[W] ?? W, D.format === "") delete D.format
                        }
                        if (G) D.contentEncoding = G;
                        if (Z && Z.size > 0) {
                            let f = [...Z];
                            if (f.length === 1) D.pattern = f[0].source;
                            else if (f.length > 1) w.schema.allOf = [...f.map((v) => ({
                                ...this.target === "draft-7" ? {
                                    type: "string"
                                } : {},
                                pattern: v.source
                            }))]
                        }
                        break
                    }
                    case "number": {
                        let D = M,
                            {
                                minimum: X,
                                maximum: P,
                                format: W,
                                multipleOf: Z,
                                exclusiveMaximum: G,
                                exclusiveMinimum: f
                            } = A._zod.bag;
                        if (typeof W === "string" && W.includes("int")) D.type = "integer";
                        else D.type = "number";
                        if (typeof f === "number") D.exclusiveMinimum = f;
                        if (typeof X === "number") {
                            if (D.minimum = X, typeof f === "number")
                                if (f >= X) delete D.minimum;
                                else delete D.exclusiveMinimum
                        }
                        if (typeof G === "number") D.exclusiveMaximum = G;
                        if (typeof P === "number") {
                            if (D.maximum = P, typeof G === "number")
                                if (G <= P) delete D.maximum;
                                else delete D.exclusiveMaximum
                        }
                        if (typeof Z === "number") D.multipleOf = Z;
                        break
                    }
                    case "boolean": {
                        let D = M;
                        D.type = "boolean";
                        break
                    }
                    case "bigint": {
                        if (this.unrepresentable === "throw") throw Error("BigInt cannot be represented in JSON Schema");
                        break
                    }
                    case "symbol": {
                        if (this.unrepresentable === "throw") throw Error("Symbols cannot be represented in JSON Schema");
                        break
                    }
                    case "null": {
                        M.type = "null";
                        break
                    }
                    case "any":
                        break;
                    case "unknown":
                        break;
                    case "undefined":
                    case "never": {
                        M.not = {};
                        break
                    }
                    case "void": {
                        if (this.unrepresentable === "throw") throw Error("Void cannot be represented in JSON Schema");
                        break
                    }
                    case "date": {
                        if (this.unrepresentable === "throw") throw Error("Date cannot be represented in JSON Schema");
                        break
                    }
                    case "array": {
                        let D = M,
                            {
                                minimum: X,
                                maximum: P
                            } = A._zod.bag;
                        if (typeof X === "number") D.minItems = X;
                        if (typeof P === "number") D.maxItems = P;
                        D.type = "array", D.items = this.process(Y.element, {
                            ...j,
                            path: [...j.path, "items"]
                        });
                        break
                    }
                    case "object": {
                        let D = M;
                        D.type = "object", D.properties = {};
                        let X = Y.shape;
                        for (let Z in X) D.properties[Z] = this.process(X[Z], {
                            ...j,
                            path: [...j.path, "properties", Z]
                        });
                        let P = new Set(Object.keys(X)),
                            W = new Set([...P].filter((Z) => {
                                let G = Y.shape[Z]._zod;
                                if (this.io === "input") return G.optin === void 0;
                                else return G.optout === void 0
                            }));
                        if (W.size > 0) D.required = Array.from(W);
                        if (Y.catchall?._zod.def.type === "never") D.additionalProperties = !1;
                        else if (!Y.catchall) {
                            if (this.io === "output") D.additionalProperties = !1
                        } else if (Y.catchall) D.additionalProperties = this.process(Y.catchall, {
                            ...j,
                            path: [...j.path, "additionalProperties"]
                        });
                        break
                    }
                    case "union": {
                        let D = M;
                        D.anyOf = Y.options.map((X, P) => this.process(X, {
                            ...j,
                            path: [...j.path, "anyOf", P]
                        }));
                        break
                    }
                    case "intersection": {
                        let D = M,
                            X = this.process(Y.left, {
                                ...j,
                                path: [...j.path, "allOf", 0]
                            }),
                            P = this.process(Y.right, {
                                ...j,
                                path: [...j.path, "allOf", 1]
                            }),
                            W = (G) => ("allOf" in G) && Object.keys(G).length === 1,
                            Z = [...W(X) ? X.allOf : [X], ...W(P) ? P.allOf : [P]];
                        D.allOf = Z;
                        break
                    }
                    case "tuple": {
                        let D = M;
                        D.type = "array";
                        let X = Y.items.map((Z, G) => this.process(Z, {
                            ...j,
                            path: [...j.path, "prefixItems", G]
                        }));
                        if (this.target === "draft-2020-12") D.prefixItems = X;
                        else D.items = X;
                        if (Y.rest) {
                            let Z = this.process(Y.rest, {
                                ...j,
                                path: [...j.path, "items"]
                            });
                            if (this.target === "draft-2020-12") D.items = Z;
                            else D.additionalItems = Z
                        }
                        if (Y.rest) D.items = this.process(Y.rest, {
                            ...j,
                            path: [...j.path, "items"]
                        });
                        let {
                            minimum: P,
                            maximum: W
                        } = A._zod.bag;
                        if (typeof P === "number") D.minItems = P;
                        if (typeof W === "number") D.maxItems = W;
                        break
                    }
                    case "record": {
                        let D = M;
                        D.type = "object", D.propertyNames = this.process(Y.keyType, {
                            ...j,
                            path: [...j.path, "propertyNames"]
                        }), D.additionalProperties = this.process(Y.valueType, {
                            ...j,
                            path: [...j.path, "additionalProperties"]
                        });
                        break
                    }
                    case "map": {
                        if (this.unrepresentable === "throw") throw Error("Map cannot be represented in JSON Schema");
                        break
                    }
                    case "set": {
                        if (this.unrepresentable === "throw") throw Error("Set cannot be represented in JSON Schema");
                        break
                    }
                    case "enum": {
                        let D = M,
                            X = OE6(Y.entries);
                        if (X.every((P) => typeof P === "number")) D.type = "number";
                        if (X.every((P) => typeof P === "string")) D.type = "string";
                        D.enum = X;
                        break
                    }
                    case "literal": {
                        let D = M,
                            X = [];
                        for (let P of Y.values)
                            if (P === void 0) {
                                if (this.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema")
                            } else if (typeof P === "bigint")
                            if (this.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
                            else X.push(Number(P));
                        else X.push(P);
                        if (X.length === 0);
                        else if (X.length === 1) {
                            let P = X[0];
                            D.type = P === null ? "null" : typeof P, D.const = P
                        } else {
                            if (X.every((P) => typeof P === "number")) D.type = "number";
                            if (X.every((P) => typeof P === "string")) D.type = "string";
                            if (X.every((P) => typeof P === "boolean")) D.type = "string";
                            if (X.every((P) => P === null)) D.type = "null";
                            D.enum = X
                        }
                        break
                    }
                    case "file": {
                        let D = M,
                            X = {
                                type: "string",
                                format: "binary",
                                contentEncoding: "binary"
                            },
                            {
                                minimum: P,
                                maximum: W,
                                mime: Z
                            } = A._zod.bag;
                        if (P !== void 0) X.minLength = P;
                        if (W !== void 0) X.maxLength = W;
                        if (Z)
                            if (Z.length === 1) X.contentMediaType = Z[0], Object.assign(D, X);
                            else D.anyOf = Z.map((G) => {
                                return {
                                    ...X,
                                    contentMediaType: G
                                }
                            });
                        else Object.assign(D, X);
                        break
                    }
                    case "transform": {
                        if (this.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
                        break
                    }
                    case "nullable": {
                        let D = this.process(Y.innerType, j);
                        M.anyOf = [D, {
                            type: "null"
                        }];
                        break
                    }
                    case "nonoptional": {
                        this.process(Y.innerType, j), w.ref = Y.innerType;
                        break
                    }
                    case "success": {
                        let D = M;
                        D.type = "boolean";
                        break
                    }
                    case "default": {
                        this.process(Y.innerType, j), w.ref = Y.innerType, M.default = JSON.parse(JSON.stringify(Y.defaultValue));
                        break
                    }
                    case "prefault": {
                        if (this.process(Y.innerType, j), w.ref = Y.innerType, this.io === "input") M._prefault = JSON.parse(JSON.stringify(Y.defaultValue));
                        break
                    }
                    case "catch": {
                        this.process(Y.innerType, j), w.ref = Y.innerType;
                        let D;
                        try {
                            D = Y.catchValue(void 0)
                        } catch {
                            throw Error("Dynamic catch values are not supported in JSON Schema")
                        }
                        M.default = D;
                        break
                    }
                    case "nan": {
                        if (this.unrepresentable === "throw") throw Error("NaN cannot be represented in JSON Schema");
                        break
                    }
                    case "template_literal": {
                        let D = M,
                            X = A._zod.pattern;
                        if (!X) throw Error("Pattern not found in template literal");
                        D.type = "string", D.pattern = X.source;
                        break
                    }
                    case "pipe": {
                        let D = this.io === "input" ? Y.in._zod.def.type === "transform" ? Y.out : Y.in : Y.out;
                        this.process(D, j), w.ref = D;
                        break
                    }
                    case "readonly": {
                        this.process(Y.innerType, j), w.ref = Y.innerType, M.readOnly = !0;
                        break
                    }
                    case "promise": {
                        this.process(Y.innerType, j), w.ref = Y.innerType;
                        break
                    }
                    case "optional": {
                        this.process(Y.innerType, j), w.ref = Y.innerType;
                        break
                    }
                    case "lazy": {
                        let D = A._zod.innerType;
                        this.process(D, j), w.ref = D;
                        break
                    }
                    case "custom": {
                        if (this.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
                        break
                    }
                    default:
                }
            }
        }
        let $ = this.metadataRegistry.get(A);
        if ($) Object.assign(w.schema, $);
        if (this.io === "input" && kM(A)) delete w.schema.examples, delete w.schema.default;
        if (this.io === "input" && w.schema._prefault)(K = w.schema).default ?? (K.default = w.schema._prefault);
        return delete w.schema._prefault, this.seen.get(A).schema
    }
    emit(A, q) {
        let K = {
                cycles: q?.cycles ?? "ref",
                reused: q?.reused ?? "inline",
                external: q?.external ?? void 0
            },
            Y = this.seen.get(A);
        if (!Y) throw Error("Unprocessed schema. This is a bug in Zod.");
        let z = (H) => {
                let j = this.target === "draft-2020-12" ? "$defs" : "definitions";
                if (K.external) {
                    let X = K.external.registry.get(H[0])?.id;
                    if (X) return {
                        ref: K.external.uri(X)
                    };
                    let P = H[1].defId ?? H[1].schema.id ?? `schema${this.counter++}`;
                    return H[1].defId = P, {
                        defId: P,
                        ref: `${K.external.uri("__shared")}#/${j}/${P}`
                    }
                }
                if (H[1] === Y) return {
                    ref: "#"
                };
                let M = `${"#"}/${j}/`,
                    D = H[1].schema.id ?? `__schema${this.counter++}`;
                return {
                    defId: D,
                    ref: M + D
                }
            },
            _ = (H) => {
                if (H[1].schema.$ref) return;
                let j = H[1],
                    {
                        ref: J,
                        defId: M
                    } = z(H);
                if (j.def = {
                        ...j.schema
                    }, M) j.defId = M;
                let D = j.schema;
                for (let X in D) delete D[X];
                D.$ref = J
            };
        for (let H of this.seen.entries()) {
            let j = H[1];
            if (A === H[0]) {
                _(H);
                continue
            }
            if (K.external) {
                let M = K.external.registry.get(H[0])?.id;
                if (A !== H[0] && M) {
                    _(H);
                    continue
                }
            }
            if (this.metadataRegistry.get(H[0])?.id) {
                _(H);
                continue
            }
            if (j.cycle) {
                if (K.cycles === "throw") throw Error(`Cycle detected: #/${j.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
                else if (K.cycles === "ref") _(H);
                continue
            }
            if (j.count > 1) {
                if (K.reused === "ref") {
                    _(H);
                    continue
                }
            }
        }
        let w = (H, j) => {
            let J = this.seen.get(H),
                M = J.def ?? J.schema,
                D = {
                    ...M
                };
            if (J.ref === null) return;
            let X = J.ref;
            if (J.ref = null, X) {
                w(X, j);
                let P = this.seen.get(X).schema;
                if (P.$ref && j.target === "draft-7") M.allOf = M.allOf ?? [], M.allOf.push(P);
                else Object.assign(M, P), Object.assign(M, D)
            }
            if (!J.isParent) this.override({
                zodSchema: H,
                jsonSchema: M,
                path: J.path ?? []
            })
        };
        for (let H of [...this.seen.entries()].reverse()) w(H[0], {
            target: this.target
        });
        let O = {};
        if (this.target === "draft-2020-12") O.$schema = "https://json-schema.org/draft/2020-12/schema";
        else if (this.target === "draft-7") O.$schema = "http://json-schema.org/draft-07/schema#";
        else console.warn(`Invalid target: ${this.target}`);
        Object.assign(O, Y.def);
        let $ = K.external?.defs ?? {};
        for (let H of this.seen.entries()) {
            let j = H[1];
            if (j.def && j.defId) $[j.defId] = j.def
        }
        if (!K.external && Object.keys($).length > 0)
            if (this.target === "draft-2020-12") O.$defs = $;
            else O.definitions = $;
        try {
            return JSON.parse(JSON.stringify(O))
        } catch (H) {
            throw Error("Error converting schema to JSON.")
        }
    }
}
// @from(Ln 13262, Col 0)
function Np(A, q) {
    if (A instanceof EE6) {
        let Y = new xe6(q),
            z = {};
        for (let O of A._idmap.entries()) {
            let [$, H] = O;
            Y.process(H)
        }
        let _ = {},
            w = {
                registry: A,
                uri: q?.uri || ((O) => O),
                defs: z
            };
        for (let O of A._idmap.entries()) {
            let [$, H] = O;
            _[$] = Y.emit(H, {
                ...q,
                external: w
            })
        }
        if (Object.keys(z).length > 0) {
            let O = Y.target === "draft-2020-12" ? "$defs" : "definitions";
            _.__shared = {
                [O]: z
            }
        }
        return {
            schemas: _
        }
    }
    let K = new xe6(q);
    return K.process(A), K.emit(A, q)
}
// @from(Ln 13297, Col 0)
function kM(A, q) {
    let K = q ?? {
        seen: new Set
    };
    if (K.seen.has(A)) return !1;
    K.seen.add(A);
    let z = A._zod.def;
    switch (z.type) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "date":
        case "symbol":
        case "undefined":
        case "null":
        case "any":
        case "unknown":
        case "never":
        case "void":
        case "literal":
        case "enum":
        case "nan":
        case "file":
        case "template_literal":
            return !1;
        case "array":
            return kM(z.element, K);
        case "object": {
            for (let _ in z.shape)
                if (kM(z.shape[_], K)) return !0;
            return !1
        }
        case "union": {
            for (let _ of z.options)
                if (kM(_, K)) return !0;
            return !1
        }
        case "intersection":
            return kM(z.left, K) || kM(z.right, K);
        case "tuple": {
            for (let _ of z.items)
                if (kM(_, K)) return !0;
            if (z.rest && kM(z.rest, K)) return !0;
            return !1
        }
        case "record":
            return kM(z.keyType, K) || kM(z.valueType, K);
        case "map":
            return kM(z.keyType, K) || kM(z.valueType, K);
        case "set":
            return kM(z.valueType, K);
        case "promise":
        case "optional":
        case "nonoptional":
        case "nullable":
        case "readonly":
            return kM(z.innerType, K);
        case "lazy":
            return kM(z.getter(), K);
        case "default":
            return kM(z.innerType, K);
        case "prefault":
            return kM(z.innerType, K);
        case "custom":
            return !1;
        case "transform":
            return !0;
        case "pipe":
            return kM(z.in, K) || kM(z.out, K);
        case "success":
            return !1;
        case "catch":
            return !1;
        default:
    }
    throw Error(`Unknown schema type: ${z.type}`)
}
// @from(Ln 13375, Col 4)
X4A = E(() => {
    XF1();
    QK()
})
// @from(Ln 13379, Col 4)
P4A = {}
// @from(Ln 13380, Col 4)
W4A = () => {}
// @from(Ln 13381, Col 4)
Ix = {}
// @from(Ln 13623, Col 4)
_G = E(() => {
    QK();
    qe6();
    Je6();
    W4A();
    ew6();
    et6();
    Rm1();
    VE6();
    ze6();
    VB1();
    XF1();
    D4A();
    qp1();
    X4A()
})
// @from(Ln 13639, Col 4)
zp1 = E(() => {
    _G()
})
// @from(Ln 13642, Col 4)
JO6 = {}
// @from(Ln 13654, Col 0)
function _p1(A) {
    return GF1(ue6, A)
}
// @from(Ln 13658, Col 0)
function wp1(A) {
    return fF1(me6, A)
}
// @from(Ln 13662, Col 0)
function Op1(A) {
    return TF1(Be6, A)
}
// @from(Ln 13666, Col 0)
function $p1(A) {
    return vF1(ge6, A)
}
// @from(Ln 13669, Col 4)
ue6
// @from(Ln 13669, Col 9)
me6
// @from(Ln 13669, Col 14)
Be6
// @from(Ln 13669, Col 19)
ge6
// @from(Ln 13670, Col 4)
Fe6 = E(() => {
    _G();
    pe6();
    ue6 = H8("ZodISODateTime", (A, q) => {
        mB1.init(A, q), fw.init(A, q)
    });
    me6 = H8("ZodISODate", (A, q) => {
        BB1.init(A, q), fw.init(A, q)
    });
    Be6 = H8("ZodISOTime", (A, q) => {
        gB1.init(A, q), fw.init(A, q)
    });
    ge6 = H8("ZodISODuration", (A, q) => {
        FB1.init(A, q), fw.init(A, q)
    })
})
// @from(Ln 13686, Col 4)
G4A = (A, q) => {
        DE6.init(A, q), A.name = "ZodError", Object.defineProperties(A, {
            format: {
                value: (K) => PE6(A, K)
            },
            flatten: {
                value: (K) => XE6(A, K)
            },
            addIssue: {
                value: (K) => A.issues.push(K)
            },
            addIssues: {
                value: (K) => A.issues.push(...K)
            },
            isEmpty: {
                get() {
                    return A.issues.length === 0
                }
            }
        })
    }
// @from(Ln 13707, Col 4)
aoq
// @from(Ln 13707, Col 9)
MO6
// @from(Ln 13708, Col 4)
Hp1 = E(() => {
    _G();
    _G();
    aoq = H8("ZodError", G4A), MO6 = H8("ZodError", G4A, {
        Parent: Error
    })
})
// @from(Ln 13715, Col 4)
jp1
// @from(Ln 13715, Col 9)
Jp1
// @from(Ln 13715, Col 14)
Mp1
// @from(Ln 13715, Col 19)
Dp1
// @from(Ln 13716, Col 4)
Xp1 = E(() => {
    _G();
    Hp1();
    jp1 = ot6(MO6), Jp1 = at6(MO6), Mp1 = st6(MO6), Dp1 = tt6(MO6)
})
// @from(Ln 13722, Col 0)
function x1(A) {
    return PF1(QE6, A)
}
// @from(Ln 13726, Col 0)
function toq(A) {
    return De6(Zp1, A)
}
// @from(Ln 13730, Col 0)
function eoq(A) {
    return yE6(Qe6, A)
}
// @from(Ln 13734, Col 0)
function Aaq(A) {
    return Xe6(Vp, A)
}
// @from(Ln 13738, Col 0)
function qaq(A) {
    return Pe6(Vp, A)
}
// @from(Ln 13742, Col 0)
function Kaq(A) {
    return We6(Vp, A)
}
// @from(Ln 13746, Col 0)
function Yaq(A) {
    return Ze6(Vp, A)
}
// @from(Ln 13750, Col 0)
function fp1(A) {
    return Ge6(Gp1, A)
}
// @from(Ln 13754, Col 0)
function zaq(A) {
    return fe6(Tp1, A)
}
// @from(Ln 13758, Col 0)
function _aq(A) {
    return Te6(vp1, A)
}
// @from(Ln 13762, Col 0)
function waq(A) {
    return ve6(Np1, A)
}
// @from(Ln 13766, Col 0)
function Oaq(A) {
    return Ne6(Vp1, A)
}
// @from(Ln 13770, Col 0)
function $aq(A) {
    return Ve6(kp1, A)
}
// @from(Ln 13774, Col 0)
function Haq(A) {
    return ke6(Ep1, A)
}
// @from(Ln 13778, Col 0)
function jaq(A) {
    return Ee6(yp1, A)
}
// @from(Ln 13782, Col 0)
function Jaq(A) {
    return ye6(Lp1, A)
}
// @from(Ln 13786, Col 0)
function Maq(A) {
    return Le6(Rp1, A)
}
// @from(Ln 13790, Col 0)
function Daq(A) {
    return Re6(hp1, A)
}
// @from(Ln 13794, Col 0)
function Xaq(A) {
    return he6(Sp1, A)
}
// @from(Ln 13798, Col 0)
function Paq(A) {
    return Se6(Cp1, A)
}
// @from(Ln 13802, Col 0)
function Waq(A) {
    return Ce6(Ip1, A)
}
// @from(Ln 13806, Col 0)
function Zaq(A) {
    return Ie6(bp1, A)
}
// @from(Ln 13810, Col 0)
function Gaq(A) {
    return be6(xp1, A)
}
// @from(Ln 13814, Col 0)
function faq(A, q, K = {}) {
    return Ap1(f4A, A, q, K)
}
// @from(Ln 13818, Col 0)
function NY(A) {
    return NF1(UE6, A)
}
// @from(Ln 13822, Col 0)
function Pp1(A) {
    return kF1(DO6, A)
}
// @from(Ln 13826, Col 0)
function Taq(A) {
    return EF1(DO6, A)
}
// @from(Ln 13830, Col 0)
function vaq(A) {
    return yF1(DO6, A)
}
// @from(Ln 13834, Col 0)
function Naq(A) {
    return LF1(DO6, A)
}
// @from(Ln 13838, Col 0)
function Vaq(A) {
    return RF1(DO6, A)
}
// @from(Ln 13842, Col 0)
function y_(A) {
    return hF1(dE6, A)
}
// @from(Ln 13846, Col 0)
function kaq(A) {
    return CF1(cE6, A)
}
// @from(Ln 13850, Col 0)
function Eaq(A) {
    return bF1(up1, A)
}
// @from(Ln 13854, Col 0)
function yaq(A) {
    return xF1(up1, A)
}
// @from(Ln 13858, Col 0)
function Laq(A) {
    return uF1(T4A, A)
}
// @from(Ln 13862, Col 0)
function Raq(A) {
    return mF1(v4A, A)
}
// @from(Ln 13866, Col 0)
function lE6(A) {
    return BF1(N4A, A)
}
// @from(Ln 13870, Col 0)
function mp1() {
    return gF1(V4A)
}
// @from(Ln 13874, Col 0)
function KO() {
    return OO6(k4A)
}
// @from(Ln 13878, Col 0)
function ce6(A) {
    return FF1(E4A, A)
}
// @from(Ln 13882, Col 0)
function haq(A) {
    return pF1(y4A, A)
}
// @from(Ln 13886, Col 0)
function Saq(A) {
    return QF1(le6, A)
}
// @from(Ln 13890, Col 0)
function h7(A, q) {
    return FE6(L4A, A, q)
}
// @from(Ln 13894, Col 0)
function Caq(A) {
    let q = A._zod.def.shape;
    return e4(Object.keys(q))
}
// @from(Ln 13899, Col 0)
function p7(A, q) {
    let K = {
        type: "object",
        get shape() {
            return R7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        ...R7.normalizeParams(q)
    };
    return new ie6(K)
}
// @from(Ln 13912, Col 0)
function Iaq(A, q) {
    return new ie6({
        type: "object",
        get shape() {
            return R7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        catchall: ce6(),
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 13925, Col 0)
function WJ(A, q) {
    return new ie6({
        type: "object",
        get shape() {
            return R7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        catchall: KO(),
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 13938, Col 0)
function L_(A, q) {
    return new Bp1({
        type: "union",
        options: A,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 13946, Col 0)
function ne6(A, q, K) {
    return new R4A({
        type: "union",
        options: q,
        discriminator: A,
        ...R7.normalizeParams(K)
    })
}
// @from(Ln 13955, Col 0)
function iE6(A, q) {
    return new h4A({
        type: "intersection",
        left: A,
        right: q
    })
}
// @from(Ln 13963, Col 0)
function baq(A, q, K) {
    let Y = q instanceof _5,
        z = Y ? K : q;
    return new S4A({
        type: "tuple",
        items: A,
        rest: Y ? q : null,
        ...R7.normalizeParams(z)
    })
}
// @from(Ln 13974, Col 0)
function Tw(A, q, K) {
    return new gp1({
        type: "record",
        keyType: A,
        valueType: q,
        ...R7.normalizeParams(K)
    })
}
// @from(Ln 13983, Col 0)
function xaq(A, q, K) {
    return new gp1({
        type: "record",
        keyType: L_([A, ce6()]),
        valueType: q,
        ...R7.normalizeParams(K)
    })
}
// @from(Ln 13992, Col 0)
function uaq(A, q, K) {
    return new C4A({
        type: "map",
        keyType: A,
        valueType: q,
        ...R7.normalizeParams(K)
    })
}
// @from(Ln 14001, Col 0)
function maq(A, q) {
    return new I4A({
        type: "set",
        valueType: A,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14009, Col 0)
function wG(A, q) {
    let K = Array.isArray(A) ? Object.fromEntries(A.map((Y) => [Y, Y])) : A;
    return new pE6({
        type: "enum",
        entries: K,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14018, Col 0)
function Baq(A, q) {
    return new pE6({
        type: "enum",
        entries: A,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14026, Col 0)
function e4(A, q) {
    return new b4A({
        type: "literal",
        values: Array.isArray(A) ? A : [A],
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14034, Col 0)
function gaq(A) {
    return aF1(x4A, A)
}
// @from(Ln 14038, Col 0)
function pp1(A) {
    return new Fp1({
        type: "transform",
        transform: A
    })
}
// @from(Ln 14045, Col 0)
function YO(A) {
    return new Qp1({
        type: "optional",
        innerType: A
    })
}
// @from(Ln 14052, Col 0)
function Ue6(A) {
    return new u4A({
        type: "nullable",
        innerType: A
    })
}
// @from(Ln 14059, Col 0)
function Faq(A) {
    return YO(Ue6(A))
}
// @from(Ln 14063, Col 0)
function B4A(A, q) {
    return new m4A({
        type: "default",
        innerType: A,
        get defaultValue() {
            return typeof q === "function" ? q() : q
        }
    })
}
// @from(Ln 14073, Col 0)
function F4A(A, q) {
    return new g4A({
        type: "prefault",
        innerType: A,
        get defaultValue() {
            return typeof q === "function" ? q() : q
        }
    })
}
// @from(Ln 14083, Col 0)
function p4A(A, q) {
    return new Up1({
        type: "nonoptional",
        innerType: A,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14091, Col 0)
function paq(A) {
    return new Q4A({
        type: "success",
        innerType: A
    })
}
// @from(Ln 14098, Col 0)
function d4A(A, q) {
    return new U4A({
        type: "catch",
        innerType: A,
        catchValue: typeof q === "function" ? q : () => q
    })
}
// @from(Ln 14106, Col 0)
function Qaq(A) {
    return dF1(c4A, A)
}
// @from(Ln 14110, Col 0)
function de6(A, q) {
    return new dp1({
        type: "pipe",
        in: A,
        out: q
    })
}
// @from(Ln 14118, Col 0)
function i4A(A) {
    return new l4A({
        type: "readonly",
        innerType: A
    })
}
// @from(Ln 14125, Col 0)
function Uaq(A, q) {
    return new n4A({
        type: "template_literal",
        parts: A,
        ...R7.normalizeParams(q)
    })
}
// @from(Ln 14133, Col 0)
function o4A(A) {
    return new r4A({
        type: "lazy",
        getter: A
    })
}
// @from(Ln 14140, Col 0)
function daq(A) {
    return new a4A({
        type: "promise",
        innerType: A
    })
}
// @from(Ln 14147, Col 0)
function s4A(A, q) {
    let K = new S$({
        check: "custom",
        ...R7.normalizeParams(q)
    });
    return K._zod.check = A, K
}
// @from(Ln 14155, Col 0)
function cp1(A, q) {
    return sF1(re6, A ?? (() => !0), q)
}
// @from(Ln 14159, Col 0)
function t4A(A, q = {}) {
    return tF1(re6, A, q)
}
// @from(Ln 14163, Col 0)
function e4A(A, q) {
    let K = s4A((Y) => {
        return Y.addIssue = (z) => {
            if (typeof z === "string") Y.issues.push(R7.issue(z, Y.value, K._zod.def));
            else {
                let _ = z;
                if (_.fatal) _.continue = !1;
                _.code ?? (_.code = "custom"), _.input ?? (_.input = Y.value), _.inst ?? (_.inst = K), _.continue ?? (_.continue = !K._zod.def.abort), Y.issues.push(R7.issue(_))
            }
        }, A(Y.value, Y)
    }, q);
    return K
}
// @from(Ln 14177, Col 0)
function caq(A, q = {
    error: `Input not instance of ${A.name}`
}) {
    let K = new re6({
        type: "custom",
        check: "custom",
        fn: (Y) => Y instanceof A,
        abort: !0,
        ...R7.normalizeParams(q)
    });
    return K._zod.bag.Class = A, K
}
// @from(Ln 14190, Col 0)
function iaq(A) {
    let q = o4A(() => {
        return L_([x1(A), NY(), y_(), lE6(), h7(q), Tw(x1(), q)])
    });
    return q
}
// @from(Ln 14197, Col 0)
function oe6(A, q) {
    return de6(pp1(A), q)
}
// @from(Ln 14200, Col 4)
Q3
// @from(Ln 14200, Col 8)
Wp1
// @from(Ln 14200, Col 13)
QE6
// @from(Ln 14200, Col 18)
fw
// @from(Ln 14200, Col 22)
Zp1
// @from(Ln 14200, Col 27)
Qe6
// @from(Ln 14200, Col 32)
Vp
// @from(Ln 14200, Col 36)
Gp1
// @from(Ln 14200, Col 41)
Tp1
// @from(Ln 14200, Col 46)
vp1
// @from(Ln 14200, Col 51)
Np1
// @from(Ln 14200, Col 56)
Vp1
// @from(Ln 14200, Col 61)
kp1
// @from(Ln 14200, Col 66)
Ep1
// @from(Ln 14200, Col 71)
yp1
// @from(Ln 14200, Col 76)
Lp1
// @from(Ln 14200, Col 81)
Rp1
// @from(Ln 14200, Col 86)
hp1
// @from(Ln 14200, Col 91)
Sp1
// @from(Ln 14200, Col 96)
Cp1
// @from(Ln 14200, Col 101)
Ip1
// @from(Ln 14200, Col 106)
bp1
// @from(Ln 14200, Col 111)
xp1
// @from(Ln 14200, Col 116)
f4A
// @from(Ln 14200, Col 121)
UE6
// @from(Ln 14200, Col 126)
DO6
// @from(Ln 14200, Col 131)
dE6
// @from(Ln 14200, Col 136)
cE6
// @from(Ln 14200, Col 141)
up1
// @from(Ln 14200, Col 146)
T4A
// @from(Ln 14200, Col 151)
v4A
// @from(Ln 14200, Col 156)
N4A
// @from(Ln 14200, Col 161)
V4A
// @from(Ln 14200, Col 166)
k4A
// @from(Ln 14200, Col 171)
E4A
// @from(Ln 14200, Col 176)
y4A
// @from(Ln 14200, Col 181)
le6
// @from(Ln 14200, Col 186)
L4A
// @from(Ln 14200, Col 191)
ie6
// @from(Ln 14200, Col 196)
Bp1
// @from(Ln 14200, Col 201)
R4A
// @from(Ln 14200, Col 206)
h4A
// @from(Ln 14200, Col 211)
S4A
// @from(Ln 14200, Col 216)
gp1
// @from(Ln 14200, Col 221)
C4A
// @from(Ln 14200, Col 226)
I4A
// @from(Ln 14200, Col 231)
pE6
// @from(Ln 14200, Col 236)
b4A
// @from(Ln 14200, Col 241)
x4A
// @from(Ln 14200, Col 246)
Fp1
// @from(Ln 14200, Col 251)
Qp1
// @from(Ln 14200, Col 256)
u4A
// @from(Ln 14200, Col 261)
m4A
// @from(Ln 14200, Col 266)
g4A
// @from(Ln 14200, Col 271)
Up1
// @from(Ln 14200, Col 276)
Q4A
// @from(Ln 14200, Col 281)
U4A
// @from(Ln 14200, Col 286)
c4A
// @from(Ln 14200, Col 291)
dp1
// @from(Ln 14200, Col 296)
l4A
// @from(Ln 14200, Col 301)
n4A
// @from(Ln 14200, Col 306)
r4A
// @from(Ln 14200, Col 311)
a4A
// @from(Ln 14200, Col 316)
re6
// @from(Ln 14200, Col 321)
laq = (...A) => eF1({
    Pipe: dp1,
    Boolean: dE6,
    String: QE6,
    Transform: Fp1
}, ...A)
// @from(Ln 14206, Col 4)
pe6 = E(() => {
    _G();
    _G();
    zp1();
    Fe6();
    Xp1();
    Q3 = H8("ZodType", (A, q) => {
        return _5.init(A, q), A.def = q, Object.defineProperty(A, "_def", {
            value: q
        }), A.check = (...K) => {
            return A.clone({
                ...q,
                checks: [...q.checks ?? [], ...K.map((Y) => typeof Y === "function" ? {
                    _zod: {
                        check: Y,
                        def: {
                            check: "custom"
                        },
                        onattach: []
                    }
                } : Y)]
            })
        }, A.clone = (K, Y) => JV(A, K, Y), A.brand = () => A, A.register = (K, Y) => {
            return K.add(A, Y), A
        }, A.parse = (K, Y) => jp1(A, K, Y, {
            callee: A.parse
        }), A.safeParse = (K, Y) => Mp1(A, K, Y), A.parseAsync = async (K, Y) => Jp1(A, K, Y, {
            callee: A.parseAsync
        }), A.safeParseAsync = async (K, Y) => Dp1(A, K, Y), A.spa = A.safeParseAsync, A.refine = (K, Y) => A.check(t4A(K, Y)), A.superRefine = (K) => A.check(e4A(K)), A.overwrite = (K) => A.check(vp(K)), A.optional = () => YO(A), A.nullable = () => Ue6(A), A.nullish = () => YO(Ue6(A)), A.nonoptional = (K) => p4A(A, K), A.array = () => h7(A), A.or = (K) => L_([A, K]), A.and = (K) => iE6(A, K), A.transform = (K) => de6(A, pp1(K)), A.default = (K) => B4A(A, K), A.prefault = (K) => F4A(A, K), A.catch = (K) => d4A(A, K), A.pipe = (K) => de6(A, K), A.readonly = () => i4A(A), A.describe = (K) => {
            let Y = A.clone();
            return Cx.add(Y, {
                description: K
            }), Y
        }, Object.defineProperty(A, "description", {
            get() {
                return Cx.get(A)?.description
            },
            configurable: !0
        }), A.meta = (...K) => {
            if (K.length === 0) return Cx.get(A);
            let Y = A.clone();
            return Cx.add(Y, K[0]), Y
        }, A.isOptional = () => A.safeParse(void 0).success, A.isNullable = () => A.safeParse(null).success, A
    }), Wp1 = H8("_ZodString", (A, q) => {
        DA6.init(A, q), Q3.init(A, q);
        let K = A._zod.bag;
        A.format = K.format ?? null, A.minLength = K.minimum ?? null, A.maxLength = K.maximum ?? null, A.regex = (...Y) => A.check(RE6(...Y)), A.includes = (...Y) => A.check(CE6(...Y)), A.startsWith = (...Y) => A.check(IE6(...Y)), A.endsWith = (...Y) => A.check(bE6(...Y)), A.min = (...Y) => A.check(Rn(...Y)), A.max = (...Y) => A.check(HO6(...Y)), A.length = (...Y) => A.check(jO6(...Y)), A.nonempty = (...Y) => A.check(Rn(1, ...Y)), A.lowercase = (Y) => A.check(hE6(Y)), A.uppercase = (Y) => A.check(SE6(Y)), A.trim = () => A.check(mE6()), A.normalize = (...Y) => A.check(uE6(...Y)), A.toLowerCase = () => A.check(BE6()), A.toUpperCase = () => A.check(gE6())
    }), QE6 = H8("ZodString", (A, q) => {
        DA6.init(A, q), Wp1.init(A, q), A.email = (K) => A.check(De6(Zp1, K)), A.url = (K) => A.check(Ge6(Gp1, K)), A.jwt = (K) => A.check(be6(xp1, K)), A.emoji = (K) => A.check(fe6(Tp1, K)), A.guid = (K) => A.check(yE6(Qe6, K)), A.uuid = (K) => A.check(Xe6(Vp, K)), A.uuidv4 = (K) => A.check(Pe6(Vp, K)), A.uuidv6 = (K) => A.check(We6(Vp, K)), A.uuidv7 = (K) => A.check(Ze6(Vp, K)), A.nanoid = (K) => A.check(Te6(vp1, K)), A.guid = (K) => A.check(yE6(Qe6, K)), A.cuid = (K) => A.check(ve6(Np1, K)), A.cuid2 = (K) => A.check(Ne6(Vp1, K)), A.ulid = (K) => A.check(Ve6(kp1, K)), A.base64 = (K) => A.check(Se6(Cp1, K)), A.base64url = (K) => A.check(Ce6(Ip1, K)), A.xid = (K) => A.check(ke6(Ep1, K)), A.ksuid = (K) => A.check(Ee6(yp1, K)), A.ipv4 = (K) => A.check(ye6(Lp1, K)), A.ipv6 = (K) => A.check(Le6(Rp1, K)), A.cidrv4 = (K) => A.check(Re6(hp1, K)), A.cidrv6 = (K) => A.check(he6(Sp1, K)), A.e164 = (K) => A.check(Ie6(bp1, K)), A.datetime = (K) => A.check(_p1(K)), A.date = (K) => A.check(wp1(K)), A.time = (K) => A.check(Op1(K)), A.duration = (K) => A.check($p1(K))
    });
    fw = H8("ZodStringFormat", (A, q) => {
        b2.init(A, q), Wp1.init(A, q)
    }), Zp1 = H8("ZodEmail", (A, q) => {
        LB1.init(A, q), fw.init(A, q)
    });
    Qe6 = H8("ZodGUID", (A, q) => {
        EB1.init(A, q), fw.init(A, q)
    });
    Vp = H8("ZodUUID", (A, q) => {
        yB1.init(A, q), fw.init(A, q)
    });
    Gp1 = H8("ZodURL", (A, q) => {
        RB1.init(A, q), fw.init(A, q)
    });
    Tp1 = H8("ZodEmoji", (A, q) => {
        hB1.init(A, q), fw.init(A, q)
    });
    vp1 = H8("ZodNanoID", (A, q) => {
        SB1.init(A, q), fw.init(A, q)
    });
    Np1 = H8("ZodCUID", (A, q) => {
        CB1.init(A, q), fw.init(A, q)
    });
    Vp1 = H8("ZodCUID2", (A, q) => {
        IB1.init(A, q), fw.init(A, q)
    });
    kp1 = H8("ZodULID", (A, q) => {
        bB1.init(A, q), fw.init(A, q)
    });
    Ep1 = H8("ZodXID", (A, q) => {
        xB1.init(A, q), fw.init(A, q)
    });
    yp1 = H8("ZodKSUID", (A, q) => {
        uB1.init(A, q), fw.init(A, q)
    });
    Lp1 = H8("ZodIPv4", (A, q) => {
        pB1.init(A, q), fw.init(A, q)
    });
    Rp1 = H8("ZodIPv6", (A, q) => {
        QB1.init(A, q), fw.init(A, q)
    });
    hp1 = H8("ZodCIDRv4", (A, q) => {
        UB1.init(A, q), fw.init(A, q)
    });
    Sp1 = H8("ZodCIDRv6", (A, q) => {
        dB1.init(A, q), fw.init(A, q)
    });
    Cp1 = H8("ZodBase64", (A, q) => {
        lB1.init(A, q), fw.init(A, q)
    });
    Ip1 = H8("ZodBase64URL", (A, q) => {
        iB1.init(A, q), fw.init(A, q)
    });
    bp1 = H8("ZodE164", (A, q) => {
        nB1.init(A, q), fw.init(A, q)
    });
    xp1 = H8("ZodJWT", (A, q) => {
        rB1.init(A, q), fw.init(A, q)
    });
    f4A = H8("ZodCustomStringFormat", (A, q) => {
        oB1.init(A, q), fw.init(A, q)
    });
    UE6 = H8("ZodNumber", (A, q) => {
        $e6.init(A, q), Q3.init(A, q), A.gt = (Y, z) => A.check(Tp(Y, z)), A.gte = (Y, z) => A.check(ZT(Y, z)), A.min = (Y, z) => A.check(ZT(Y, z)), A.lt = (Y, z) => A.check(fp(Y, z)), A.lte = (Y, z) => A.check(eE(Y, z)), A.max = (Y, z) => A.check(eE(Y, z)), A.int = (Y) => A.check(Pp1(Y)), A.safe = (Y) => A.check(Pp1(Y)), A.positive = (Y) => A.check(Tp(0, Y)), A.nonnegative = (Y) => A.check(ZT(0, Y)), A.negative = (Y) => A.check(fp(0, Y)), A.nonpositive = (Y) => A.check(eE(0, Y)), A.multipleOf = (Y, z) => A.check(PA6(Y, z)), A.step = (Y, z) => A.check(PA6(Y, z)), A.finite = () => A;
        let K = A._zod.bag;
        A.minValue = Math.max(K.minimum ?? Number.NEGATIVE_INFINITY, K.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, A.maxValue = Math.min(K.maximum ?? Number.POSITIVE_INFINITY, K.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, A.isInt = (K.format ?? "").includes("int") || Number.isSafeInteger(K.multipleOf ?? 0.5), A.isFinite = !0, A.format = K.format ?? null
    });
    DO6 = H8("ZodNumberFormat", (A, q) => {
        aB1.init(A, q), UE6.init(A, q)
    });
    dE6 = H8("ZodBoolean", (A, q) => {
        fE6.init(A, q), Q3.init(A, q)
    });
    cE6 = H8("ZodBigInt", (A, q) => {
        He6.init(A, q), Q3.init(A, q), A.gte = (Y, z) => A.check(ZT(Y, z)), A.min = (Y, z) => A.check(ZT(Y, z)), A.gt = (Y, z) => A.check(Tp(Y, z)), A.gte = (Y, z) => A.check(ZT(Y, z)), A.min = (Y, z) => A.check(ZT(Y, z)), A.lt = (Y, z) => A.check(fp(Y, z)), A.lte = (Y, z) => A.check(eE(Y, z)), A.max = (Y, z) => A.check(eE(Y, z)), A.positive = (Y) => A.check(Tp(BigInt(0), Y)), A.negative = (Y) => A.check(fp(BigInt(0), Y)), A.nonpositive = (Y) => A.check(eE(BigInt(0), Y)), A.nonnegative = (Y) => A.check(ZT(BigInt(0), Y)), A.multipleOf = (Y, z) => A.check(PA6(Y, z));
        let K = A._zod.bag;
        A.minValue = K.minimum ?? null, A.maxValue = K.maximum ?? null, A.format = K.format ?? null
    });
    up1 = H8("ZodBigIntFormat", (A, q) => {
        sB1.init(A, q), cE6.init(A, q)
    });
    T4A = H8("ZodSymbol", (A, q) => {
        tB1.init(A, q), Q3.init(A, q)
    });
    v4A = H8("ZodUndefined", (A, q) => {
        eB1.init(A, q), Q3.init(A, q)
    });
    N4A = H8("ZodNull", (A, q) => {
        Ag1.init(A, q), Q3.init(A, q)
    });
    V4A = H8("ZodAny", (A, q) => {
        qg1.init(A, q), Q3.init(A, q)
    });
    k4A = H8("ZodUnknown", (A, q) => {
        _O6.init(A, q), Q3.init(A, q)
    });
    E4A = H8("ZodNever", (A, q) => {
        Kg1.init(A, q), Q3.init(A, q)
    });
    y4A = H8("ZodVoid", (A, q) => {
        Yg1.init(A, q), Q3.init(A, q)
    });
    le6 = H8("ZodDate", (A, q) => {
        zg1.init(A, q), Q3.init(A, q), A.min = (Y, z) => A.check(ZT(Y, z)), A.max = (Y, z) => A.check(eE(Y, z));
        let K = A._zod.bag;
        A.minDate = K.minimum ? new Date(K.minimum) : null, A.maxDate = K.maximum ? new Date(K.maximum) : null
    });
    L4A = H8("ZodArray", (A, q) => {
        TE6.init(A, q), Q3.init(A, q), A.element = q.element, A.min = (K, Y) => A.check(Rn(K, Y)), A.nonempty = (K) => A.check(Rn(1, K)), A.max = (K, Y) => A.check(HO6(K, Y)), A.length = (K, Y) => A.check(jO6(K, Y)), A.unwrap = () => A.element
    });
    ie6 = H8("ZodObject", (A, q) => {
        _g1.init(A, q), Q3.init(A, q), R7.defineLazy(A, "shape", () => q.shape), A.keyof = () => wG(Object.keys(A._zod.def.shape)), A.catchall = (K) => A.clone({
            ...A._zod.def,
            catchall: K
        }), A.passthrough = () => A.clone({
            ...A._zod.def,
            catchall: KO()
        }), A.loose = () => A.clone({
            ...A._zod.def,
            catchall: KO()
        }), A.strict = () => A.clone({
            ...A._zod.def,
            catchall: ce6()
        }), A.strip = () => A.clone({
            ...A._zod.def,
            catchall: void 0
        }), A.extend = (K) => {
            return R7.extend(A, K)
        }, A.merge = (K) => R7.merge(A, K), A.pick = (K) => R7.pick(A, K), A.omit = (K) => R7.omit(A, K), A.partial = (...K) => R7.partial(Qp1, A, K[0]), A.required = (...K) => R7.required(Up1, A, K[0])
    });
    Bp1 = H8("ZodUnion", (A, q) => {
        je6.init(A, q), Q3.init(A, q), A.options = q.options
    });
    R4A = H8("ZodDiscriminatedUnion", (A, q) => {
        Bp1.init(A, q), wg1.init(A, q)
    });
    h4A = H8("ZodIntersection", (A, q) => {
        Og1.init(A, q), Q3.init(A, q)
    });
    S4A = H8("ZodTuple", (A, q) => {
        XA6.init(A, q), Q3.init(A, q), A.rest = (K) => A.clone({
            ...A._zod.def,
            rest: K
        })
    });
    gp1 = H8("ZodRecord", (A, q) => {
        $g1.init(A, q), Q3.init(A, q), A.keyType = q.keyType, A.valueType = q.valueType
    });
    C4A = H8("ZodMap", (A, q) => {
        Hg1.init(A, q), Q3.init(A, q), A.keyType = q.keyType, A.valueType = q.valueType
    });
    I4A = H8("ZodSet", (A, q) => {
        jg1.init(A, q), Q3.init(A, q), A.min = (...K) => A.check(WA6(...K)), A.nonempty = (K) => A.check(WA6(1, K)), A.max = (...K) => A.check($O6(...K)), A.size = (...K) => A.check(LE6(...K))
    });
    pE6 = H8("ZodEnum", (A, q) => {
        Jg1.init(A, q), Q3.init(A, q), A.enum = q.entries, A.options = Object.values(q.entries);
        let K = new Set(Object.keys(q.entries));
        A.extract = (Y, z) => {
            let _ = {};
            for (let w of Y)
                if (K.has(w)) _[w] = q.entries[w];
                else throw Error(`Key ${w} not found in enum`);
            return new pE6({
                ...q,
                checks: [],
                ...R7.normalizeParams(z),
                entries: _
            })
        }, A.exclude = (Y, z) => {
            let _ = {
                ...q.entries
            };
            for (let w of Y)
                if (K.has(w)) delete _[w];
                else throw Error(`Key ${w} not found in enum`);
            return new pE6({
                ...q,
                checks: [],
                ...R7.normalizeParams(z),
                entries: _
            })
        }
    });
    b4A = H8("ZodLiteral", (A, q) => {
        Mg1.init(A, q), Q3.init(A, q), A.values = new Set(q.values), Object.defineProperty(A, "value", {
            get() {
                if (q.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
                return q.values[0]
            }
        })
    });
    x4A = H8("ZodFile", (A, q) => {
        Dg1.init(A, q), Q3.init(A, q), A.min = (K, Y) => A.check(WA6(K, Y)), A.max = (K, Y) => A.check($O6(K, Y)), A.mime = (K, Y) => A.check(xE6(Array.isArray(K) ? K : [K], Y))
    });
    Fp1 = H8("ZodTransform", (A, q) => {
        vE6.init(A, q), Q3.init(A, q), A._zod.parse = (K, Y) => {
            K.addIssue = (_) => {
                if (typeof _ === "string") K.issues.push(R7.issue(_, K.value, q));
                else {
                    let w = _;
                    if (w.fatal) w.continue = !1;
                    w.code ?? (w.code = "custom"), w.input ?? (w.input = K.value), w.inst ?? (w.inst = A), w.continue ?? (w.continue = !0), K.issues.push(R7.issue(w))
                }
            };
            let z = q.transform(K.value, K);
            if (z instanceof Promise) return z.then((_) => {
                return K.value = _, K
            });
            return K.value = z, K
        }
    });
    Qp1 = H8("ZodOptional", (A, q) => {
        Xg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    u4A = H8("ZodNullable", (A, q) => {
        Pg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    m4A = H8("ZodDefault", (A, q) => {
        Wg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType, A.removeDefault = A.unwrap
    });
    g4A = H8("ZodPrefault", (A, q) => {
        Zg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    Up1 = H8("ZodNonOptional", (A, q) => {
        Gg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    Q4A = H8("ZodSuccess", (A, q) => {
        fg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    U4A = H8("ZodCatch", (A, q) => {
        Tg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType, A.removeCatch = A.unwrap
    });
    c4A = H8("ZodNaN", (A, q) => {
        vg1.init(A, q), Q3.init(A, q)
    });
    dp1 = H8("ZodPipe", (A, q) => {
        NE6.init(A, q), Q3.init(A, q), A.in = q.in, A.out = q.out
    });
    l4A = H8("ZodReadonly", (A, q) => {
        Ng1.init(A, q), Q3.init(A, q)
    });
    n4A = H8("ZodTemplateLiteral", (A, q) => {
        Vg1.init(A, q), Q3.init(A, q)
    });
    r4A = H8("ZodLazy", (A, q) => {
        Eg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.getter()
    });
    a4A = H8("ZodPromise", (A, q) => {
        kg1.init(A, q), Q3.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    re6 = H8("ZodCustom", (A, q) => {
        yg1.init(A, q), Q3.init(A, q)
    })
})
// @from(Ln 14511, Col 0)
function naq(A) {
    PJ({
        customError: A
    })
}
// @from(Ln 14517, Col 0)
function raq() {
    return PJ().customError
}
// @from(Ln 14520, Col 4)
lp1
// @from(Ln 14521, Col 4)
AqA = E(() => {
    _G();
    lp1 = {
        invalid_type: "invalid_type",
        too_big: "too_big",
        too_small: "too_small",
        invalid_format: "invalid_format",
        not_multiple_of: "not_multiple_of",
        unrecognized_keys: "unrecognized_keys",
        invalid_union: "invalid_union",
        invalid_key: "invalid_key",
        invalid_element: "invalid_element",
        invalid_value: "invalid_value",
        custom: "custom"
    }
})
// @from(Ln 14537, Col 4)
nE6 = {}
// @from(Ln 14546, Col 0)
function oaq(A) {
    return WF1(QE6, A)
}
// @from(Ln 14550, Col 0)
function aaq(A) {
    return VF1(UE6, A)
}
// @from(Ln 14554, Col 0)
function saq(A) {
    return SF1(dE6, A)
}
// @from(Ln 14558, Col 0)
function taq(A) {
    return IF1(cE6, A)
}
// @from(Ln 14562, Col 0)
function eaq(A) {
    return UF1(le6, A)
}
// @from(Ln 14565, Col 4)
qqA = E(() => {
    _G();
    pe6()
})
// @from(Ln 14569, Col 4)
C = {}
// @from(Ln 14779, Col 4)
ip1 = E(() => {
    _G();
    _G();
    bg1();
    _G();
    Je6();
    Fe6();
    Fe6();
    qqA();
    pe6();
    zp1();
    Hp1();
    Xp1();
    AqA();
    PJ(kE6())
})
// @from(Ln 14795, Col 4)
KqA
// @from(Ln 14796, Col 4)
np1 = E(() => {
    ip1();
    ip1();
    KqA = C
})
// @from(Ln 14801, Col 4)
y4
// @from(Ln 14802, Col 4)
K7 = E(() => {
    np1();
    np1();
    y4 = KqA
})
// @from(Ln 14807, Col 4)
hn = "2025-11-25"
// @from(Ln 14808, Col 4)
se6
// @from(Ln 14808, Col 9)
Sn = "io.modelcontextprotocol/related-task"
// @from(Ln 14809, Col 4)
te6 = "2.0"
// @from(Ln 14810, Col 4)
wP
// @from(Ln 14810, Col 8)
zqA
// @from(Ln 14810, Col 13)
_qA
// @from(Ln 14810, Col 18)
wxz
// @from(Ln 14810, Col 23)
Asq
// @from(Ln 14810, Col 28)
qsq
// @from(Ln 14810, Col 33)
rp1
// @from(Ln 14810, Col 38)
DV
// @from(Ln 14810, Col 42)
rE6
// @from(Ln 14810, Col 47)
wqA = (A) => rE6.safeParse(A).success
// @from(Ln 14811, Col 4)
OP
// @from(Ln 14811, Col 8)
Ay
// @from(Ln 14811, Col 12)
qy
// @from(Ln 14811, Col 16)
$P
// @from(Ln 14811, Col 20)
ee6
// @from(Ln 14811, Col 25)
OqA
// @from(Ln 14811, Col 30)
oE6 = (A) => OqA.safeParse(A).success
// @from(Ln 14812, Col 4)
$qA
// @from(Ln 14812, Col 9)
HqA = (A) => $qA.safeParse(A).success
// @from(Ln 14813, Col 4)
op1
// @from(Ln 14813, Col 9)
ZA6 = (A) => op1.safeParse(A).success
// @from(Ln 14814, Col 4)
Fq
// @from(Ln 14814, Col 8)
ap1
// @from(Ln 14814, Col 13)
jqA = (A) => ap1.safeParse(A).success
// @from(Ln 14815, Col 4)
PS
// @from(Ln 14815, Col 8)
Oxz
// @from(Ln 14815, Col 13)
kp
// @from(Ln 14815, Col 17)
Ksq
// @from(Ln 14815, Col 22)
A61
// @from(Ln 14815, Col 27)
Ysq
// @from(Ln 14815, Col 32)
aE6
// @from(Ln 14815, Col 37)
XO6
// @from(Ln 14815, Col 42)
JqA
// @from(Ln 14815, Col 47)
zsq
// @from(Ln 14815, Col 52)
_sq
// @from(Ln 14815, Col 57)
wsq
// @from(Ln 14815, Col 62)
Osq
// @from(Ln 14815, Col 67)
$sq
// @from(Ln 14815, Col 72)
Hsq
// @from(Ln 14815, Col 77)
sp1
// @from(Ln 14815, Col 82)
jsq
// @from(Ln 14815, Col 87)
tp1
// @from(Ln 14815, Col 92)
q61
// @from(Ln 14815, Col 97)
MqA = (A) => q61.safeParse(A).success
// @from(Ln 14816, Col 4)
K61
// @from(Ln 14816, Col 9)
Jsq
// @from(Ln 14816, Col 14)
Msq
// @from(Ln 14816, Col 19)
Y61
// @from(Ln 14816, Col 24)
Dsq
// @from(Ln 14816, Col 29)
sE6
// @from(Ln 14816, Col 34)
tE6
// @from(Ln 14816, Col 39)
Xsq
// @from(Ln 14816, Col 44)
eE6
// @from(Ln 14816, Col 49)
Ep
// @from(Ln 14816, Col 53)
Psq
// @from(Ln 14816, Col 58)
Ay6
// @from(Ln 14816, Col 63)
z61
// @from(Ln 14816, Col 68)
_61
// @from(Ln 14816, Col 73)
w61
// @from(Ln 14816, Col 78)
$xz
// @from(Ln 14816, Col 83)
O61
// @from(Ln 14816, Col 88)
$61
// @from(Ln 14816, Col 93)
H61
// @from(Ln 14816, Col 98)
DqA
// @from(Ln 14816, Col 103)
XqA
// @from(Ln 14816, Col 108)
PqA
// @from(Ln 14816, Col 113)
ep1
// @from(Ln 14816, Col 118)
WqA
// @from(Ln 14816, Col 123)
qy6
// @from(Ln 14816, Col 128)
PO6
// @from(Ln 14816, Col 133)
ZqA
// @from(Ln 14816, Col 138)
Wsq
// @from(Ln 14816, Col 143)
Zsq
// @from(Ln 14816, Col 148)
Ky6
// @from(Ln 14816, Col 153)
Gsq
// @from(Ln 14816, Col 158)
AQ1
// @from(Ln 14816, Col 163)
qQ1
// @from(Ln 14816, Col 168)
fsq
// @from(Ln 14816, Col 173)
Tsq
// @from(Ln 14816, Col 178)
Yy6
// @from(Ln 14816, Col 183)
zy6
// @from(Ln 14816, Col 188)
vsq
// @from(Ln 14816, Col 193)
Nsq
// @from(Ln 14816, Col 198)
Vsq
// @from(Ln 14816, Col 203)
ksq
// @from(Ln 14816, Col 208)
Esq
// @from(Ln 14816, Col 213)
ysq
// @from(Ln 14816, Col 218)
Lsq
// @from(Ln 14816, Col 223)
Rsq
// @from(Ln 14816, Col 228)
hsq
// @from(Ln 14816, Col 233)
_y6
// @from(Ln 14816, Col 238)
Ssq
// @from(Ln 14816, Col 243)
Csq
// @from(Ln 14816, Col 248)
KQ1
// @from(Ln 14816, Col 253)
YQ1
// @from(Ln 14816, Col 258)
zQ1
// @from(Ln 14816, Col 263)
Isq
// @from(Ln 14816, Col 268)
bsq
// @from(Ln 14816, Col 273)
xsq
// @from(Ln 14816, Col 278)
_Q1
// @from(Ln 14816, Col 283)
usq
// @from(Ln 14816, Col 288)
wQ1
// @from(Ln 14816, Col 293)
wy6
// @from(Ln 14816, Col 298)
msq
// @from(Ln 14816, Col 303)
Bsq
// @from(Ln 14816, Col 308)
GqA
// @from(Ln 14816, Col 313)
Oy6
// @from(Ln 14816, Col 318)
$y6
// @from(Ln 14816, Col 323)
bx
// @from(Ln 14816, Col 327)
Hxz
// @from(Ln 14816, Col 332)
gsq
// @from(Ln 14816, Col 337)
GA6
// @from(Ln 14816, Col 342)
Hy6
// @from(Ln 14816, Col 347)
fqA
// @from(Ln 14816, Col 352)
jy6
// @from(Ln 14816, Col 357)
Fsq
// @from(Ln 14816, Col 362)
OQ1
// @from(Ln 14816, Col 367)
psq
// @from(Ln 14816, Col 372)
Qsq
// @from(Ln 14816, Col 377)
Usq
// @from(Ln 14816, Col 382)
dsq
// @from(Ln 14816, Col 387)
csq
// @from(Ln 14816, Col 392)
lsq
// @from(Ln 14816, Col 397)
isq
// @from(Ln 14816, Col 402)
ae6
// @from(Ln 14816, Col 407)
nsq
// @from(Ln 14816, Col 412)
rsq
// @from(Ln 14816, Col 417)
$Q1
// @from(Ln 14816, Col 422)
fA6
// @from(Ln 14816, Col 427)
Jy6
// @from(Ln 14816, Col 432)
osq
// @from(Ln 14816, Col 437)
asq
// @from(Ln 14816, Col 442)
ssq
// @from(Ln 14816, Col 447)
tsq
// @from(Ln 14816, Col 452)
esq
// @from(Ln 14816, Col 457)
Atq
// @from(Ln 14816, Col 462)
qtq
// @from(Ln 14816, Col 467)
Ktq
// @from(Ln 14816, Col 472)
Ytq
// @from(Ln 14816, Col 477)
ztq
// @from(Ln 14816, Col 482)
_tq
// @from(Ln 14816, Col 487)
wtq
// @from(Ln 14816, Col 492)
Otq
// @from(Ln 14816, Col 497)
$tq
// @from(Ln 14816, Col 502)
Htq
// @from(Ln 14816, Col 507)
yp
// @from(Ln 14816, Col 511)
jtq
// @from(Ln 14816, Col 516)
My6
// @from(Ln 14816, Col 521)
Cn
// @from(Ln 14816, Col 525)
Jtq
// @from(Ln 14816, Col 530)
Mtq
// @from(Ln 14816, Col 535)
Dtq
// @from(Ln 14816, Col 540)
Xtq
// @from(Ln 14816, Col 545)
HQ1
// @from(Ln 14816, Col 550)
Ptq
// @from(Ln 14816, Col 555)
jQ1
// @from(Ln 14816, Col 560)
JQ1
// @from(Ln 14816, Col 565)
Wtq
// @from(Ln 14816, Col 570)
jxz
// @from(Ln 14816, Col 575)
Jxz
// @from(Ln 14816, Col 580)
Mxz
// @from(Ln 14816, Col 585)
Dxz
// @from(Ln 14816, Col 590)
Xxz
// @from(Ln 14816, Col 595)
Pxz
// @from(Ln 14816, Col 600)
Aq
// @from(Ln 14816, Col 604)
TqA
// @from(Ln 14817, Col 4)
hD = E(() => {
    K7();
    se6 = [hn, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"], wP = cp1((A) => A !== null && (typeof A === "object" || typeof A === "function")), zqA = L_([x1(), NY().int()]), _qA = x1(), wxz = WJ({
        ttl: L_([NY(), lE6()]).optional(),
        pollInterval: NY().optional()
    }), Asq = p7({
        ttl: NY().optional()
    }), qsq = p7({
        taskId: x1()
    }), rp1 = WJ({
        progressToken: zqA.optional(),
        [Sn]: qsq.optional()
    }), DV = p7({
        _meta: rp1.optional()
    }), rE6 = DV.extend({
        task: Asq.optional()
    }), OP = p7({
        method: x1(),
        params: DV.loose().optional()
    }), Ay = p7({
        _meta: rp1.optional()
    }), qy = p7({
        method: x1(),
        params: Ay.loose().optional()
    }), $P = WJ({
        _meta: rp1.optional()
    }), ee6 = L_([x1(), NY().int()]), OqA = p7({
        jsonrpc: e4(te6),
        id: ee6,
        ...OP.shape
    }).strict(), $qA = p7({
        jsonrpc: e4(te6),
        ...qy.shape
    }).strict(), op1 = p7({
        jsonrpc: e4(te6),
        id: ee6,
        result: $P
    }).strict();
    (function(A) {
        A[A.ConnectionClosed = -32000] = "ConnectionClosed", A[A.RequestTimeout = -32001] = "RequestTimeout", A[A.ParseError = -32700] = "ParseError", A[A.InvalidRequest = -32600] = "InvalidRequest", A[A.MethodNotFound = -32601] = "MethodNotFound", A[A.InvalidParams = -32602] = "InvalidParams", A[A.InternalError = -32603] = "InternalError", A[A.UrlElicitationRequired = -32042] = "UrlElicitationRequired"
    })(Fq || (Fq = {}));
    ap1 = p7({
        jsonrpc: e4(te6),
        id: ee6.optional(),
        error: p7({
            code: NY().int(),
            message: x1(),
            data: KO().optional()
        })
    }).strict(), PS = L_([OqA, $qA, op1, ap1]), Oxz = L_([op1, ap1]), kp = $P.strict(), Ksq = Ay.extend({
        requestId: ee6.optional(),
        reason: x1().optional()
    }), A61 = qy.extend({
        method: e4("notifications/cancelled"),
        params: Ksq
    }), Ysq = p7({
        src: x1(),
        mimeType: x1().optional(),
        sizes: h7(x1()).optional(),
        theme: wG(["light", "dark"]).optional()
    }), aE6 = p7({
        icons: h7(Ysq).optional()
    }), XO6 = p7({
        name: x1(),
        title: x1().optional()
    }), JqA = XO6.extend({
        ...XO6.shape,
        ...aE6.shape,
        version: x1(),
        websiteUrl: x1().optional(),
        description: x1().optional()
    }), zsq = iE6(p7({
        applyDefaults: y_().optional()
    }), Tw(x1(), KO())), _sq = oe6((A) => {
        if (A && typeof A === "object" && !Array.isArray(A)) {
            if (Object.keys(A).length === 0) return {
                form: {}
            }
        }
        return A
    }, iE6(p7({
        form: zsq.optional(),
        url: wP.optional()
    }), Tw(x1(), KO()).optional())), wsq = WJ({
        list: wP.optional(),
        cancel: wP.optional(),
        requests: WJ({
            sampling: WJ({
                createMessage: wP.optional()
            }).optional(),
            elicitation: WJ({
                create: wP.optional()
            }).optional()
        }).optional()
    }), Osq = WJ({
        list: wP.optional(),
        cancel: wP.optional(),
        requests: WJ({
            tools: WJ({
                call: wP.optional()
            }).optional()
        }).optional()
    }), $sq = p7({
        experimental: Tw(x1(), wP).optional(),
        sampling: p7({
            context: wP.optional(),
            tools: wP.optional()
        }).optional(),
        elicitation: _sq.optional(),
        roots: p7({
            listChanged: y_().optional()
        }).optional(),
        tasks: wsq.optional()
    }), Hsq = DV.extend({
        protocolVersion: x1(),
        capabilities: $sq,
        clientInfo: JqA
    }), sp1 = OP.extend({
        method: e4("initialize"),
        params: Hsq
    }), jsq = p7({
        experimental: Tw(x1(), wP).optional(),
        logging: wP.optional(),
        completions: wP.optional(),
        prompts: p7({
            listChanged: y_().optional()
        }).optional(),
        resources: p7({
            subscribe: y_().optional(),
            listChanged: y_().optional()
        }).optional(),
        tools: p7({
            listChanged: y_().optional()
        }).optional(),
        tasks: Osq.optional()
    }), tp1 = $P.extend({
        protocolVersion: x1(),
        capabilities: jsq,
        serverInfo: JqA,
        instructions: x1().optional()
    }), q61 = qy.extend({
        method: e4("notifications/initialized"),
        params: Ay.optional()
    }), K61 = OP.extend({
        method: e4("ping"),
        params: DV.optional()
    }), Jsq = p7({
        progress: NY(),
        total: YO(NY()),
        message: YO(x1())
    }), Msq = p7({
        ...Ay.shape,
        ...Jsq.shape,
        progressToken: zqA
    }), Y61 = qy.extend({
        method: e4("notifications/progress"),
        params: Msq
    }), Dsq = DV.extend({
        cursor: _qA.optional()
    }), sE6 = OP.extend({
        params: Dsq.optional()
    }), tE6 = $P.extend({
        nextCursor: _qA.optional()
    }), Xsq = wG(["working", "input_required", "completed", "failed", "cancelled"]), eE6 = p7({
        taskId: x1(),
        status: Xsq,
        ttl: L_([NY(), lE6()]),
        createdAt: x1(),
        lastUpdatedAt: x1(),
        pollInterval: YO(NY()),
        statusMessage: YO(x1())
    }), Ep = $P.extend({
        task: eE6
    }), Psq = Ay.merge(eE6), Ay6 = qy.extend({
        method: e4("notifications/tasks/status"),
        params: Psq
    }), z61 = OP.extend({
        method: e4("tasks/get"),
        params: DV.extend({
            taskId: x1()
        })
    }), _61 = $P.merge(eE6), w61 = OP.extend({
        method: e4("tasks/result"),
        params: DV.extend({
            taskId: x1()
        })
    }), $xz = $P.loose(), O61 = sE6.extend({
        method: e4("tasks/list")
    }), $61 = tE6.extend({
        tasks: h7(eE6)
    }), H61 = OP.extend({
        method: e4("tasks/cancel"),
        params: DV.extend({
            taskId: x1()
        })
    }), DqA = $P.merge(eE6), XqA = p7({
        uri: x1(),
        mimeType: YO(x1()),
        _meta: Tw(x1(), KO()).optional()
    }), PqA = XqA.extend({
        text: x1()
    }), ep1 = x1().refine((A) => {
        try {
            return atob(A), !0
        } catch {
            return !1
        }
    }, {
        message: "Invalid Base64 string"
    }), WqA = XqA.extend({
        blob: ep1
    }), qy6 = wG(["user", "assistant"]), PO6 = p7({
        audience: h7(qy6).optional(),
        priority: NY().min(0).max(1).optional(),
        lastModified: JO6.datetime({
            offset: !0
        }).optional()
    }), ZqA = p7({
        ...XO6.shape,
        ...aE6.shape,
        uri: x1(),
        description: YO(x1()),
        mimeType: YO(x1()),
        annotations: PO6.optional(),
        _meta: YO(WJ({}))
    }), Wsq = p7({
        ...XO6.shape,
        ...aE6.shape,
        uriTemplate: x1(),
        description: YO(x1()),
        mimeType: YO(x1()),
        annotations: PO6.optional(),
        _meta: YO(WJ({}))
    }), Zsq = sE6.extend({
        method: e4("resources/list")
    }), Ky6 = tE6.extend({
        resources: h7(ZqA)
    }), Gsq = sE6.extend({
        method: e4("resources/templates/list")
    }), AQ1 = tE6.extend({
        resourceTemplates: h7(Wsq)
    }), qQ1 = DV.extend({
        uri: x1()
    }), fsq = qQ1, Tsq = OP.extend({
        method: e4("resources/read"),
        params: fsq
    }), Yy6 = $P.extend({
        contents: h7(L_([PqA, WqA]))
    }), zy6 = qy.extend({
        method: e4("notifications/resources/list_changed"),
        params: Ay.optional()
    }), vsq = qQ1, Nsq = OP.extend({
        method: e4("resources/subscribe"),
        params: vsq
    }), Vsq = qQ1, ksq = OP.extend({
        method: e4("resources/unsubscribe"),
        params: Vsq
    }), Esq = Ay.extend({
        uri: x1()
    }), ysq = qy.extend({
        method: e4("notifications/resources/updated"),
        params: Esq
    }), Lsq = p7({
        name: x1(),
        description: YO(x1()),
        required: YO(y_())
    }), Rsq = p7({
        ...XO6.shape,
        ...aE6.shape,
        description: YO(x1()),
        arguments: YO(h7(Lsq)),
        _meta: YO(WJ({}))
    }), hsq = sE6.extend({
        method: e4("prompts/list")
    }), _y6 = tE6.extend({
        prompts: h7(Rsq)
    }), Ssq = DV.extend({
        name: x1(),
        arguments: Tw(x1(), x1()).optional()
    }), Csq = OP.extend({
        method: e4("prompts/get"),
        params: Ssq
    }), KQ1 = p7({
        type: e4("text"),
        text: x1(),
        annotations: PO6.optional(),
        _meta: Tw(x1(), KO()).optional()
    }), YQ1 = p7({
        type: e4("image"),
        data: ep1,
        mimeType: x1(),
        annotations: PO6.optional(),
        _meta: Tw(x1(), KO()).optional()
    }), zQ1 = p7({
        type: e4("audio"),
        data: ep1,
        mimeType: x1(),
        annotations: PO6.optional(),
        _meta: Tw(x1(), KO()).optional()
    }), Isq = p7({
        type: e4("tool_use"),
        name: x1(),
        id: x1(),
        input: Tw(x1(), KO()),
        _meta: Tw(x1(), KO()).optional()
    }), bsq = p7({
        type: e4("resource"),
        resource: L_([PqA, WqA]),
        annotations: PO6.optional(),
        _meta: Tw(x1(), KO()).optional()
    }), xsq = ZqA.extend({
        type: e4("resource_link")
    }), _Q1 = L_([KQ1, YQ1, zQ1, xsq, bsq]), usq = p7({
        role: qy6,
        content: _Q1
    }), wQ1 = $P.extend({
        description: x1().optional(),
        messages: h7(usq)
    }), wy6 = qy.extend({
        method: e4("notifications/prompts/list_changed"),
        params: Ay.optional()
    }), msq = p7({
        title: x1().optional(),
        readOnlyHint: y_().optional(),
        destructiveHint: y_().optional(),
        idempotentHint: y_().optional(),
        openWorldHint: y_().optional()
    }), Bsq = p7({
        taskSupport: wG(["required", "optional", "forbidden"]).optional()
    }), GqA = p7({
        ...XO6.shape,
        ...aE6.shape,
        description: x1().optional(),
        inputSchema: p7({
            type: e4("object"),
            properties: Tw(x1(), wP).optional(),
            required: h7(x1()).optional()
        }).catchall(KO()),
        outputSchema: p7({
            type: e4("object"),
            properties: Tw(x1(), wP).optional(),
            required: h7(x1()).optional()
        }).catchall(KO()).optional(),
        annotations: msq.optional(),
        execution: Bsq.optional(),
        _meta: Tw(x1(), KO()).optional()
    }), Oy6 = sE6.extend({
        method: e4("tools/list")
    }), $y6 = tE6.extend({
        tools: h7(GqA)
    }), bx = $P.extend({
        content: h7(_Q1).default([]),
        structuredContent: Tw(x1(), KO()).optional(),
        isError: y_().optional()
    }), Hxz = bx.or($P.extend({
        toolResult: KO()
    })), gsq = rE6.extend({
        name: x1(),
        arguments: Tw(x1(), KO()).optional()
    }), GA6 = OP.extend({
        method: e4("tools/call"),
        params: gsq
    }), Hy6 = qy.extend({
        method: e4("notifications/tools/list_changed"),
        params: Ay.optional()
    }), fqA = p7({
        autoRefresh: y_().default(!0),
        debounceMs: NY().int().nonnegative().default(300)
    }), jy6 = wG(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), Fsq = DV.extend({
        level: jy6
    }), OQ1 = OP.extend({
        method: e4("logging/setLevel"),
        params: Fsq
    }), psq = Ay.extend({
        level: jy6,
        logger: x1().optional(),
        data: KO()
    }), Qsq = qy.extend({
        method: e4("notifications/message"),
        params: psq
    }), Usq = p7({
        name: x1().optional()
    }), dsq = p7({
        hints: h7(Usq).optional(),
        costPriority: NY().min(0).max(1).optional(),
        speedPriority: NY().min(0).max(1).optional(),
        intelligencePriority: NY().min(0).max(1).optional()
    }), csq = p7({
        mode: wG(["auto", "required", "none"]).optional()
    }), lsq = p7({
        type: e4("tool_result"),
        toolUseId: x1().describe("The unique identifier for the corresponding tool call."),
        content: h7(_Q1).default([]),
        structuredContent: p7({}).loose().optional(),
        isError: y_().optional(),
        _meta: Tw(x1(), KO()).optional()
    }), isq = ne6("type", [KQ1, YQ1, zQ1]), ae6 = ne6("type", [KQ1, YQ1, zQ1, Isq, lsq]), nsq = p7({
        role: qy6,
        content: L_([ae6, h7(ae6)]),
        _meta: Tw(x1(), KO()).optional()
    }), rsq = rE6.extend({
        messages: h7(nsq),
        modelPreferences: dsq.optional(),
        systemPrompt: x1().optional(),
        includeContext: wG(["none", "thisServer", "allServers"]).optional(),
        temperature: NY().optional(),
        maxTokens: NY().int(),
        stopSequences: h7(x1()).optional(),
        metadata: wP.optional(),
        tools: h7(GqA).optional(),
        toolChoice: csq.optional()
    }), $Q1 = OP.extend({
        method: e4("sampling/createMessage"),
        params: rsq
    }), fA6 = $P.extend({
        model: x1(),
        stopReason: YO(wG(["endTurn", "stopSequence", "maxTokens"]).or(x1())),
        role: qy6,
        content: isq
    }), Jy6 = $P.extend({
        model: x1(),
        stopReason: YO(wG(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(x1())),
        role: qy6,
        content: L_([ae6, h7(ae6)])
    }), osq = p7({
        type: e4("boolean"),
        title: x1().optional(),
        description: x1().optional(),
        default: y_().optional()
    }), asq = p7({
        type: e4("string"),
        title: x1().optional(),
        description: x1().optional(),
        minLength: NY().optional(),
        maxLength: NY().optional(),
        format: wG(["email", "uri", "date", "date-time"]).optional(),
        default: x1().optional()
    }), ssq = p7({
        type: wG(["number", "integer"]),
        title: x1().optional(),
        description: x1().optional(),
        minimum: NY().optional(),
        maximum: NY().optional(),
        default: NY().optional()
    }), tsq = p7({
        type: e4("string"),
        title: x1().optional(),
        description: x1().optional(),
        enum: h7(x1()),
        default: x1().optional()
    }), esq = p7({
        type: e4("string"),
        title: x1().optional(),
        description: x1().optional(),
        oneOf: h7(p7({
            const: x1(),
            title: x1()
        })),
        default: x1().optional()
    }), Atq = p7({
        type: e4("string"),
        title: x1().optional(),
        description: x1().optional(),
        enum: h7(x1()),
        enumNames: h7(x1()).optional(),
        default: x1().optional()
    }), qtq = L_([tsq, esq]), Ktq = p7({
        type: e4("array"),
        title: x1().optional(),
        description: x1().optional(),
        minItems: NY().optional(),
        maxItems: NY().optional(),
        items: p7({
            type: e4("string"),
            enum: h7(x1())
        }),
        default: h7(x1()).optional()
    }), Ytq = p7({
        type: e4("array"),
        title: x1().optional(),
        description: x1().optional(),
        minItems: NY().optional(),
        maxItems: NY().optional(),
        items: p7({
            anyOf: h7(p7({
                const: x1(),
                title: x1()
            }))
        }),
        default: h7(x1()).optional()
    }), ztq = L_([Ktq, Ytq]), _tq = L_([Atq, qtq, ztq]), wtq = L_([_tq, osq, asq, ssq]), Otq = rE6.extend({
        mode: e4("form").optional(),
        message: x1(),
        requestedSchema: p7({
            type: e4("object"),
            properties: Tw(x1(), wtq),
            required: h7(x1()).optional()
        })
    }), $tq = rE6.extend({
        mode: e4("url"),
        message: x1(),
        elicitationId: x1(),
        url: x1().url()
    }), Htq = L_([Otq, $tq]), yp = OP.extend({
        method: e4("elicitation/create"),
        params: Htq
    }), jtq = Ay.extend({
        elicitationId: x1()
    }), My6 = qy.extend({
        method: e4("notifications/elicitation/complete"),
        params: jtq
    }), Cn = $P.extend({
        action: wG(["accept", "decline", "cancel"]),
        content: oe6((A) => A === null ? void 0 : A, Tw(x1(), L_([x1(), NY(), y_(), h7(x1())])).optional())
    }), Jtq = p7({
        type: e4("ref/resource"),
        uri: x1()
    }), Mtq = p7({
        type: e4("ref/prompt"),
        name: x1()
    }), Dtq = DV.extend({
        ref: L_([Mtq, Jtq]),
        argument: p7({
            name: x1(),
            value: x1()
        }),
        context: p7({
            arguments: Tw(x1(), x1()).optional()
        }).optional()
    }), Xtq = OP.extend({
        method: e4("completion/complete"),
        params: Dtq
    }), HQ1 = $P.extend({
        completion: WJ({
            values: h7(x1()).max(100),
            total: YO(NY().int()),
            hasMore: YO(y_())
        })
    }), Ptq = p7({
        uri: x1().startsWith("file://"),
        name: x1().optional(),
        _meta: Tw(x1(), KO()).optional()
    }), jQ1 = OP.extend({
        method: e4("roots/list"),
        params: DV.optional()
    }), JQ1 = $P.extend({
        roots: h7(Ptq)
    }), Wtq = qy.extend({
        method: e4("notifications/roots/list_changed"),
        params: Ay.optional()
    }), jxz = L_([K61, sp1, Xtq, OQ1, Csq, hsq, Zsq, Gsq, Tsq, Nsq, ksq, GA6, Oy6, z61, w61, O61, H61]), Jxz = L_([A61, Y61, q61, Wtq, Ay6]), Mxz = L_([kp, fA6, Jy6, Cn, JQ1, _61, $61, Ep]), Dxz = L_([K61, $Q1, yp, jQ1, z61, w61, O61, H61]), Xxz = L_([A61, Y61, Qsq, ysq, zy6, Hy6, wy6, Ay6, My6]), Pxz = L_([kp, tp1, HQ1, wQ1, _y6, Ky6, AQ1, Yy6, bx, $y6, _61, $61, Ep]);
    Aq = class Aq extends Error {
        constructor(A, q, K) {
            super(`MCP error ${A}: ${q}`);
            this.code = A, this.data = K, this.name = "McpError"
        }
        static fromError(A, q, K) {
            if (A === Fq.UrlElicitationRequired && K) {
                let Y = K;
                if (Y.elicitations) return new TqA(Y.elicitations, q)
            }
            return new Aq(A, q, K)
        }
    };
    TqA = class TqA extends Aq {
        constructor(A, q = `URL elicitation${A.length>1?"s":""} required`) {
            super(Fq.UrlElicitationRequired, q, {
                elicitations: A
            })
        }
        get elicitations() {
            return this.data?.elicitations ?? []
        }
    }
})
// @from(Ln 15392, Col 0)
class Dy6 {
    append(A) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, A]) : A
    }
    readMessage() {
        if (!this._buffer) return null;
        let A = this._buffer.indexOf(`
`);
        if (A === -1) return null;
        let q = this._buffer.toString("utf8", 0, A).replace(/\r$/, "");
        return this._buffer = this._buffer.subarray(A + 1), Ztq(q)
    }
    clear() {
        this._buffer = void 0
    }
}
// @from(Ln 15409, Col 0)
function Ztq(A) {
    return PS.parse(JSON.parse(A))
}
// @from(Ln 15413, Col 0)
function j61(A) {
    return JSON.stringify(A) + `
`
}
// @from(Ln 15417, Col 4)
MQ1 = E(() => {
    hD()
})
// @from(Ln 15421, Col 0)
class Xy6 {
    constructor(A = vqA.stdin, q = vqA.stdout) {
        this._stdin = A, this._stdout = q, this._readBuffer = new Dy6, this._started = !1, this._ondata = (K) => {
            this._readBuffer.append(K), this.processReadBuffer()
        }, this._onerror = (K) => {
            this.onerror?.(K)
        }
    }
    async start() {
        if (this._started) throw Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
        this._started = !0, this._stdin.on("data", this._ondata), this._stdin.on("error", this._onerror)
    }
    processReadBuffer() {
        while (!0) try {
            let A = this._readBuffer.readMessage();
            if (A === null) break;
            this.onmessage?.(A)
        } catch (A) {
            this.onerror?.(A)
        }
    }
    async close() {
        if (this._stdin.off("data", this._ondata), this._stdin.off("error", this._onerror), this._stdin.listenerCount("data") === 0) this._stdin.pause();
        this._readBuffer.clear(), this.onclose?.()
    }
    send(A) {
        return new Promise((q) => {
            let K = j61(A);
            if (this._stdout.write(K)) q();
            else this._stdout.once("drain", q)
        })
    }
}
// @from(Ln 15454, Col 4)
DQ1 = E(() => {
    MQ1()
})
// @from(Ln 15457, Col 4)
Lp = x((Nxz, kqA) => {
    var NqA = ["nodebuffer", "arraybuffer", "fragments"],
        VqA = typeof Blob < "u";
    if (VqA) NqA.push("blob");
    kqA.exports = {
        BINARY_TYPES: NqA,
        EMPTY_BUFFER: Buffer.alloc(0),
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        hasBlob: VqA,
        kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
        kListener: Symbol("kListener"),
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        NOOP: () => {}
    }
})
// @from(Ln 15473, Col 4)
Py6 = x((Vxz, J61) => {
    var {
        EMPTY_BUFFER: Gtq
    } = Lp(), XQ1 = Buffer[Symbol.species];

    function ftq(A, q) {
        if (A.length === 0) return Gtq;
        if (A.length === 1) return A[0];
        let K = Buffer.allocUnsafe(q),
            Y = 0;
        for (let z = 0; z < A.length; z++) {
            let _ = A[z];
            K.set(_, Y), Y += _.length
        }
        if (Y < q) return new XQ1(K.buffer, K.byteOffset, Y);
        return K
    }

    function EqA(A, q, K, Y, z) {
        for (let _ = 0; _ < z; _++) K[Y + _] = A[_] ^ q[_ & 3]
    }

    function yqA(A, q) {
        for (let K = 0; K < A.length; K++) A[K] ^= q[K & 3]
    }

    function Ttq(A) {
        if (A.length === A.buffer.byteLength) return A.buffer;
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.length)
    }

    function PQ1(A) {
        if (PQ1.readOnly = !0, Buffer.isBuffer(A)) return A;
        let q;
        if (A instanceof ArrayBuffer) q = new XQ1(A);
        else if (ArrayBuffer.isView(A)) q = new XQ1(A.buffer, A.byteOffset, A.byteLength);
        else q = Buffer.from(A), PQ1.readOnly = !1;
        return q
    }
    J61.exports = {
        concat: ftq,
        mask: EqA,
        toArrayBuffer: Ttq,
        toBuffer: PQ1,
        unmask: yqA
    };
    if (!process.env.WS_NO_BUFFER_UTIL) try {
        let A = (() => {
            throw new Error("Cannot require module " + "bufferutil");
        })();
        J61.exports.mask = function(q, K, Y, z, _) {
            if (_ < 48) EqA(q, K, Y, z, _);
            else A.mask(q, K, Y, z, _)
        }, J61.exports.unmask = function(q, K) {
            if (q.length < 32) yqA(q, K);
            else A.unmask(q, K)
        }
    } catch (A) {}
})
// @from(Ln 15532, Col 4)
SqA = x((kxz, hqA) => {
    var LqA = Symbol("kDone"),
        WQ1 = Symbol("kRun");
    class RqA {
        constructor(A) {
            this[LqA] = () => {
                this.pending--, this[WQ1]()
            }, this.concurrency = A || 1 / 0, this.jobs = [], this.pending = 0
        }
        add(A) {
            this.jobs.push(A), this[WQ1]()
        } [WQ1]() {
            if (this.pending === this.concurrency) return;
            if (this.jobs.length) {
                let A = this.jobs.shift();
                this.pending++, A(this[LqA])
            }
        }
    }
    hqA.exports = RqA
})
// @from(Ln 15553, Col 4)
Zy6 = x((Exz, uqA) => {
    var Wy6 = x6("zlib"),
        CqA = Py6(),
        vtq = SqA(),
        {
            kStatusCode: IqA
        } = Lp(),
        Ntq = Buffer[Symbol.species],
        Vtq = Buffer.from([0, 0, 255, 255]),
        D61 = Symbol("permessage-deflate"),
        Rp = Symbol("total-length"),
        WO6 = Symbol("callback"),
        In = Symbol("buffers"),
        ZO6 = Symbol("error"),
        M61;
    class bqA {
        constructor(A, q, K) {
            if (this._maxPayload = K | 0, this._options = A || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!q, this._deflate = null, this._inflate = null, this.params = null, !M61) {
                let Y = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
                M61 = new vtq(Y)
            }
        }
        static get extensionName() {
            return "permessage-deflate"
        }
        offer() {
            let A = {};
            if (this._options.serverNoContextTakeover) A.server_no_context_takeover = !0;
            if (this._options.clientNoContextTakeover) A.client_no_context_takeover = !0;
            if (this._options.serverMaxWindowBits) A.server_max_window_bits = this._options.serverMaxWindowBits;
            if (this._options.clientMaxWindowBits) A.client_max_window_bits = this._options.clientMaxWindowBits;
            else if (this._options.clientMaxWindowBits == null) A.client_max_window_bits = !0;
            return A
        }
        accept(A) {
            return A = this.normalizeParams(A), this.params = this._isServer ? this.acceptAsServer(A) : this.acceptAsClient(A), this.params
        }
        cleanup() {
            if (this._inflate) this._inflate.close(), this._inflate = null;
            if (this._deflate) {
                let A = this._deflate[WO6];
                if (this._deflate.close(), this._deflate = null, A) A(Error("The deflate stream was closed while data was being processed"))
            }
        }
        acceptAsServer(A) {
            let q = this._options,
                K = A.find((Y) => {
                    if (q.serverNoContextTakeover === !1 && Y.server_no_context_takeover || Y.server_max_window_bits && (q.serverMaxWindowBits === !1 || typeof q.serverMaxWindowBits === "number" && q.serverMaxWindowBits > Y.server_max_window_bits) || typeof q.clientMaxWindowBits === "number" && !Y.client_max_window_bits) return !1;
                    return !0
                });
            if (!K) throw Error("None of the extension offers can be accepted");
            if (q.serverNoContextTakeover) K.server_no_context_takeover = !0;
            if (q.clientNoContextTakeover) K.client_no_context_takeover = !0;
            if (typeof q.serverMaxWindowBits === "number") K.server_max_window_bits = q.serverMaxWindowBits;
            if (typeof q.clientMaxWindowBits === "number") K.client_max_window_bits = q.clientMaxWindowBits;
            else if (K.client_max_window_bits === !0 || q.clientMaxWindowBits === !1) delete K.client_max_window_bits;
            return K
        }
        acceptAsClient(A) {
            let q = A[0];
            if (this._options.clientNoContextTakeover === !1 && q.client_no_context_takeover) throw Error('Unexpected parameter "client_no_context_takeover"');
            if (!q.client_max_window_bits) {
                if (typeof this._options.clientMaxWindowBits === "number") q.client_max_window_bits = this._options.clientMaxWindowBits
            } else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits === "number" && q.client_max_window_bits > this._options.clientMaxWindowBits) throw Error('Unexpected or invalid parameter "client_max_window_bits"');
            return q
        }
        normalizeParams(A) {
            return A.forEach((q) => {
                Object.keys(q).forEach((K) => {
                    let Y = q[K];
                    if (Y.length > 1) throw Error(`Parameter "${K}" must have only a single value`);
                    if (Y = Y[0], K === "client_max_window_bits") {
                        if (Y !== !0) {
                            let z = +Y;
                            if (!Number.isInteger(z) || z < 8 || z > 15) throw TypeError(`Invalid value for parameter "${K}": ${Y}`);
                            Y = z
                        } else if (!this._isServer) throw TypeError(`Invalid value for parameter "${K}": ${Y}`)
                    } else if (K === "server_max_window_bits") {
                        let z = +Y;
                        if (!Number.isInteger(z) || z < 8 || z > 15) throw TypeError(`Invalid value for parameter "${K}": ${Y}`);
                        Y = z
                    } else if (K === "client_no_context_takeover" || K === "server_no_context_takeover") {
                        if (Y !== !0) throw TypeError(`Invalid value for parameter "${K}": ${Y}`)
                    } else throw Error(`Unknown parameter "${K}"`);
                    q[K] = Y
                })
            }), A
        }
        decompress(A, q, K) {
            M61.add((Y) => {
                this._decompress(A, q, (z, _) => {
                    Y(), K(z, _)
                })
            })
        }
        compress(A, q, K) {
            M61.add((Y) => {
                this._compress(A, q, (z, _) => {
                    Y(), K(z, _)
                })
            })
        }
        _decompress(A, q, K) {
            let Y = this._isServer ? "client" : "server";
            if (!this._inflate) {
                let z = `${Y}_max_window_bits`,
                    _ = typeof this.params[z] !== "number" ? Wy6.Z_DEFAULT_WINDOWBITS : this.params[z];
                this._inflate = Wy6.createInflateRaw({
                    ...this._options.zlibInflateOptions,
                    windowBits: _
                }), this._inflate[D61] = this, this._inflate[Rp] = 0, this._inflate[In] = [], this._inflate.on("error", Etq), this._inflate.on("data", xqA)
            }
            if (this._inflate[WO6] = K, this._inflate.write(A), q) this._inflate.write(Vtq);
            this._inflate.flush(() => {
                let z = this._inflate[ZO6];
                if (z) {
                    this._inflate.close(), this._inflate = null, K(z);
                    return
                }
                let _ = CqA.concat(this._inflate[In], this._inflate[Rp]);
                if (this._inflate._readableState.endEmitted) this._inflate.close(), this._inflate = null;
                else if (this._inflate[Rp] = 0, this._inflate[In] = [], q && this.params[`${Y}_no_context_takeover`]) this._inflate.reset();
                K(null, _)
            })
        }
        _compress(A, q, K) {
            let Y = this._isServer ? "server" : "client";
            if (!this._deflate) {
                let z = `${Y}_max_window_bits`,
                    _ = typeof this.params[z] !== "number" ? Wy6.Z_DEFAULT_WINDOWBITS : this.params[z];
                this._deflate = Wy6.createDeflateRaw({
                    ...this._options.zlibDeflateOptions,
                    windowBits: _
                }), this._deflate[Rp] = 0, this._deflate[In] = [], this._deflate.on("data", ktq)
            }
            this._deflate[WO6] = K, this._deflate.write(A), this._deflate.flush(Wy6.Z_SYNC_FLUSH, () => {
                if (!this._deflate) return;
                let z = CqA.concat(this._deflate[In], this._deflate[Rp]);
                if (q) z = new Ntq(z.buffer, z.byteOffset, z.length - 4);
                if (this._deflate[WO6] = null, this._deflate[Rp] = 0, this._deflate[In] = [], q && this.params[`${Y}_no_context_takeover`]) this._deflate.reset();
                K(null, z)
            })
        }
    }
    uqA.exports = bqA;

    function ktq(A) {
        this[In].push(A), this[Rp] += A.length
    }

    function xqA(A) {
        if (this[Rp] += A.length, this[D61]._maxPayload < 1 || this[Rp] <= this[D61]._maxPayload) {
            this[In].push(A);
            return
        }
        this[ZO6] = RangeError("Max payload size exceeded"), this[ZO6].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[ZO6][IqA] = 1009, this.removeListener("data", xqA), this.reset()
    }

    function Etq(A) {
        if (this[D61]._inflate = null, this[ZO6]) {
            this[WO6](this[ZO6]);
            return
        }
        A[IqA] = 1007, this[WO6](A)
    }
})
// @from(Ln 15719, Col 4)
GO6 = x((yxz, X61) => {
    var {
        isUtf8: mqA
    } = x6("buffer"), {
        hasBlob: ytq
    } = Lp(), Ltq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

    function Rtq(A) {
        return A >= 1000 && A <= 1014 && A !== 1004 && A !== 1005 && A !== 1006 || A >= 3000 && A <= 4999
    }

    function ZQ1(A) {
        let q = A.length,
            K = 0;
        while (K < q)
            if ((A[K] & 128) === 0) K++;
            else if ((A[K] & 224) === 192) {
            if (K + 1 === q || (A[K + 1] & 192) !== 128 || (A[K] & 254) === 192) return !1;
            K += 2
        } else if ((A[K] & 240) === 224) {
            if (K + 2 >= q || (A[K + 1] & 192) !== 128 || (A[K + 2] & 192) !== 128 || A[K] === 224 && (A[K + 1] & 224) === 128 || A[K] === 237 && (A[K + 1] & 224) === 160) return !1;
            K += 3
        } else if ((A[K] & 248) === 240) {
            if (K + 3 >= q || (A[K + 1] & 192) !== 128 || (A[K + 2] & 192) !== 128 || (A[K + 3] & 192) !== 128 || A[K] === 240 && (A[K + 1] & 240) === 128 || A[K] === 244 && A[K + 1] > 143 || A[K] > 244) return !1;
            K += 4
        } else return !1;
        return !0
    }

    function htq(A) {
        return ytq && typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && (A[Symbol.toStringTag] === "Blob" || A[Symbol.toStringTag] === "File")
    }
    X61.exports = {
        isBlob: htq,
        isValidStatusCode: Rtq,
        isValidUTF8: ZQ1,
        tokenChars: Ltq
    };
    if (mqA) X61.exports.isValidUTF8 = function(A) {
        return A.length < 24 ? ZQ1(A) : mqA(A)
    };
    else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
        let A = (() => {
            throw new Error("Cannot require module " + "utf-8-validate");
        })();
        X61.exports.isValidUTF8 = function(q) {
            return q.length < 32 ? ZQ1(q) : A(q)
        }
    } catch (A) {}
})