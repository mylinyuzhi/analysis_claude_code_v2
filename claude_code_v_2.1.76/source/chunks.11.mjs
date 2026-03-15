
// @from(Ln 28165, Col 4)
sU1 = x((SYA) => {
    Object.defineProperty(SYA, "__esModule", {
        value: !0
    });
    var W11 = _y(),
        RS = y3(),
        NKK = mp(),
        Z11 = nY(),
        VKK = {
            message: "must NOT have additional properties",
            params: ({
                params: A
            }) => RS._`{additionalProperty: ${A.additionalProperty}}`
        },
        kKK = {
            keyword: "additionalProperties",
            type: ["object"],
            schemaType: ["boolean", "object"],
            allowUndefined: !0,
            trackErrors: !0,
            error: VKK,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    errsCount: _,
                    it: w
                } = A;
                if (!_) throw Error("ajv implementation error");
                let {
                    allErrors: O,
                    opts: $
                } = w;
                if (w.props = !0, $.removeAdditional !== "all" && (0, Z11.alwaysValidSchema)(w, K)) return;
                let H = (0, W11.allSchemaProperties)(Y.properties),
                    j = (0, W11.allSchemaProperties)(Y.patternProperties);
                J(), A.ok(RS._`${_} === ${NKK.default.errors}`);

                function J() {
                    q.forIn("key", z, (W) => {
                        if (!H.length && !j.length) X(W);
                        else q.if(M(W), () => X(W))
                    })
                }

                function M(W) {
                    let Z;
                    if (H.length > 8) {
                        let G = (0, Z11.schemaRefOrVal)(w, Y.properties, "properties");
                        Z = (0, W11.isOwnProperty)(q, G, W)
                    } else if (H.length) Z = (0, RS.or)(...H.map((G) => RS._`${W} === ${G}`));
                    else Z = RS.nil;
                    if (j.length) Z = (0, RS.or)(Z, ...j.map((G) => RS._`${(0,W11.usePattern)(A,G)}.test(${W})`));
                    return (0, RS.not)(Z)
                }

                function D(W) {
                    q.code(RS._`delete ${z}[${W}]`)
                }

                function X(W) {
                    if ($.removeAdditional === "all" || $.removeAdditional && K === !1) {
                        D(W);
                        return
                    }
                    if (K === !1) {
                        if (A.setParams({
                                additionalProperty: W
                            }), A.error(), !O) q.break();
                        return
                    }
                    if (typeof K == "object" && !(0, Z11.alwaysValidSchema)(w, K)) {
                        let Z = q.name("valid");
                        if ($.removeAdditional === "failing") P(W, Z, !1), q.if((0, RS.not)(Z), () => {
                            A.reset(), D(W)
                        });
                        else if (P(W, Z), !O) q.if((0, RS.not)(Z), () => q.break())
                    }
                }

                function P(W, Z, G) {
                    let f = {
                        keyword: "additionalProperties",
                        dataProp: W,
                        dataPropType: Z11.Type.Str
                    };
                    if (G === !1) Object.assign(f, {
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    });
                    A.subschema(f, Z)
                }
            }
        };
    SYA.default = kKK
})
// @from(Ln 28264, Col 4)
xYA = x((bYA) => {
    Object.defineProperty(bYA, "__esModule", {
        value: !0
    });
    var yKK = dy6(),
        CYA = _y(),
        tU1 = nY(),
        IYA = sU1(),
        LKK = {
            keyword: "properties",
            type: "object",
            schemaType: "object",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    it: _
                } = A;
                if (_.opts.removeAdditional === "all" && Y.additionalProperties === void 0) IYA.default.code(new yKK.KeywordCxt(_, IYA.default, "additionalProperties"));
                let w = (0, CYA.allSchemaProperties)(K);
                for (let J of w) _.definedProperties.add(J);
                if (_.opts.unevaluated && w.length && _.props !== !0) _.props = tU1.mergeEvaluated.props(q, (0, tU1.toHash)(w), _.props);
                let O = w.filter((J) => !(0, tU1.alwaysValidSchema)(_, K[J]));
                if (O.length === 0) return;
                let $ = q.name("valid");
                for (let J of O) {
                    if (H(J)) j(J);
                    else {
                        if (q.if((0, CYA.propertyInData)(q, z, J, _.opts.ownProperties)), j(J), !_.allErrors) q.else().var($, !0);
                        q.endIf()
                    }
                    A.it.definedProperties.add(J), A.ok($)
                }

                function H(J) {
                    return _.opts.useDefaults && !_.compositeRule && K[J].default !== void 0
                }

                function j(J) {
                    A.subschema({
                        keyword: "properties",
                        schemaProp: J,
                        dataProp: J
                    }, $)
                }
            }
        };
    bYA.default = LKK
})
// @from(Ln 28315, Col 4)
FYA = x((gYA) => {
    Object.defineProperty(gYA, "__esModule", {
        value: !0
    });
    var uYA = _y(),
        G11 = y3(),
        mYA = nY(),
        BYA = nY(),
        hKK = {
            keyword: "patternProperties",
            type: "object",
            schemaType: "object",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    data: Y,
                    parentSchema: z,
                    it: _
                } = A, {
                    opts: w
                } = _, O = (0, uYA.allSchemaProperties)(K), $ = O.filter((P) => (0, mYA.alwaysValidSchema)(_, K[P]));
                if (O.length === 0 || $.length === O.length && (!_.opts.unevaluated || _.props === !0)) return;
                let H = w.strictSchema && !w.allowMatchingProperties && z.properties,
                    j = q.name("valid");
                if (_.props !== !0 && !(_.props instanceof G11.Name)) _.props = (0, BYA.evaluatedPropsToName)(q, _.props);
                let {
                    props: J
                } = _;
                M();

                function M() {
                    for (let P of O) {
                        if (H) D(P);
                        if (_.allErrors) X(P);
                        else q.var(j, !0), X(P), q.if(j)
                    }
                }

                function D(P) {
                    for (let W in H)
                        if (new RegExp(P).test(W))(0, mYA.checkStrictMode)(_, `property ${W} matches pattern ${P} (use allowMatchingProperties)`)
                }

                function X(P) {
                    q.forIn("key", Y, (W) => {
                        q.if(G11._`${(0,uYA.usePattern)(A,P)}.test(${W})`, () => {
                            let Z = $.includes(P);
                            if (!Z) A.subschema({
                                keyword: "patternProperties",
                                schemaProp: P,
                                dataProp: W,
                                dataPropType: BYA.Type.Str
                            }, j);
                            if (_.opts.unevaluated && J !== !0) q.assign(G11._`${J}[${W}]`, !0);
                            else if (!Z && !_.allErrors) q.if((0, G11.not)(j), () => q.break())
                        })
                    })
                }
            }
        };
    gYA.default = hKK
})
// @from(Ln 28378, Col 4)
QYA = x((pYA) => {
    Object.defineProperty(pYA, "__esModule", {
        value: !0
    });
    var CKK = nY(),
        IKK = {
            keyword: "not",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    it: Y
                } = A;
                if ((0, CKK.alwaysValidSchema)(Y, K)) {
                    A.fail();
                    return
                }
                let z = q.name("valid");
                A.subschema({
                    keyword: "not",
                    compositeRule: !0,
                    createErrors: !1,
                    allErrors: !1
                }, z), A.failResult(z, () => A.reset(), () => A.error())
            },
            error: {
                message: "must NOT be valid"
            }
        };
    pYA.default = IKK
})
// @from(Ln 28411, Col 4)
dYA = x((UYA) => {
    Object.defineProperty(UYA, "__esModule", {
        value: !0
    });
    var xKK = _y(),
        uKK = {
            keyword: "anyOf",
            schemaType: "array",
            trackErrors: !0,
            code: xKK.validateUnion,
            error: {
                message: "must match a schema in anyOf"
            }
        };
    UYA.default = uKK
})
// @from(Ln 28427, Col 4)
lYA = x((cYA) => {
    Object.defineProperty(cYA, "__esModule", {
        value: !0
    });
    var f11 = y3(),
        BKK = nY(),
        gKK = {
            message: "must match exactly one schema in oneOf",
            params: ({
                params: A
            }) => f11._`{passingSchemas: ${A.passing}}`
        },
        FKK = {
            keyword: "oneOf",
            schemaType: "array",
            trackErrors: !0,
            error: gKK,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    it: z
                } = A;
                if (!Array.isArray(K)) throw Error("ajv implementation error");
                if (z.opts.discriminator && Y.discriminator) return;
                let _ = K,
                    w = q.let("valid", !1),
                    O = q.let("passing", null),
                    $ = q.name("_valid");
                A.setParams({
                    passing: O
                }), q.block(H), A.result(w, () => A.reset(), () => A.error(!0));

                function H() {
                    _.forEach((j, J) => {
                        let M;
                        if ((0, BKK.alwaysValidSchema)(z, j)) q.var($, !0);
                        else M = A.subschema({
                            keyword: "oneOf",
                            schemaProp: J,
                            compositeRule: !0
                        }, $);
                        if (J > 0) q.if(f11._`${$} && ${w}`).assign(w, !1).assign(O, f11._`[${O}, ${J}]`).else();
                        q.if($, () => {
                            if (q.assign(w, !0), q.assign(O, J), M) A.mergeEvaluated(M, f11.Name)
                        })
                    })
                }
            }
        };
    cYA.default = FKK
})
// @from(Ln 28480, Col 4)
nYA = x((iYA) => {
    Object.defineProperty(iYA, "__esModule", {
        value: !0
    });
    var QKK = nY(),
        UKK = {
            keyword: "allOf",
            schemaType: "array",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    it: Y
                } = A;
                if (!Array.isArray(K)) throw Error("ajv implementation error");
                let z = q.name("valid");
                K.forEach((_, w) => {
                    if ((0, QKK.alwaysValidSchema)(Y, _)) return;
                    let O = A.subschema({
                        keyword: "allOf",
                        schemaProp: w
                    }, z);
                    A.ok(z), A.mergeEvaluated(O)
                })
            }
        };
    iYA.default = UKK
})
// @from(Ln 28508, Col 4)
sYA = x((aYA) => {
    Object.defineProperty(aYA, "__esModule", {
        value: !0
    });
    var T11 = y3(),
        oYA = nY(),
        cKK = {
            message: ({
                params: A
            }) => T11.str`must match "${A.ifClause}" schema`,
            params: ({
                params: A
            }) => T11._`{failingKeyword: ${A.ifClause}}`
        },
        lKK = {
            keyword: "if",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            error: cKK,
            code(A) {
                let {
                    gen: q,
                    parentSchema: K,
                    it: Y
                } = A;
                if (K.then === void 0 && K.else === void 0)(0, oYA.checkStrictMode)(Y, '"if" without "then" and "else" is ignored');
                let z = rYA(Y, "then"),
                    _ = rYA(Y, "else");
                if (!z && !_) return;
                let w = q.let("valid", !0),
                    O = q.name("_valid");
                if ($(), A.reset(), z && _) {
                    let j = q.let("ifClause");
                    A.setParams({
                        ifClause: j
                    }), q.if(O, H("then", j), H("else", j))
                } else if (z) q.if(O, H("then"));
                else q.if((0, T11.not)(O), H("else"));
                A.pass(w, () => A.error(!0));

                function $() {
                    let j = A.subschema({
                        keyword: "if",
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    }, O);
                    A.mergeEvaluated(j)
                }

                function H(j, J) {
                    return () => {
                        let M = A.subschema({
                            keyword: j
                        }, O);
                        if (q.assign(w, O), A.mergeValidEvaluated(M, w), J) q.assign(J, T11._`${j}`);
                        else A.setParams({
                            ifClause: j
                        })
                    }
                }
            }
        };

    function rYA(A, q) {
        let K = A.schema[q];
        return K !== void 0 && !(0, oYA.alwaysValidSchema)(A, K)
    }
    aYA.default = lKK
})
// @from(Ln 28578, Col 4)
eYA = x((tYA) => {
    Object.defineProperty(tYA, "__esModule", {
        value: !0
    });
    var nKK = nY(),
        rKK = {
            keyword: ["then", "else"],
            schemaType: ["object", "boolean"],
            code({
                keyword: A,
                parentSchema: q,
                it: K
            }) {
                if (q.if === void 0)(0, nKK.checkStrictMode)(K, `"${A}" without "if" is ignored`)
            }
        };
    tYA.default = rKK
})
// @from(Ln 28596, Col 4)
qzA = x((AzA) => {
    Object.defineProperty(AzA, "__esModule", {
        value: !0
    });
    var aKK = rU1(),
        sKK = PYA(),
        tKK = oU1(),
        eKK = GYA(),
        A5K = TYA(),
        q5K = yYA(),
        K5K = hYA(),
        Y5K = sU1(),
        z5K = xYA(),
        _5K = FYA(),
        w5K = QYA(),
        O5K = dYA(),
        $5K = lYA(),
        H5K = nYA(),
        j5K = sYA(),
        J5K = eYA();

    function M5K(A = !1) {
        let q = [w5K.default, O5K.default, $5K.default, H5K.default, j5K.default, J5K.default, K5K.default, Y5K.default, q5K.default, z5K.default, _5K.default];
        if (A) q.push(sKK.default, eKK.default);
        else q.push(aKK.default, tKK.default);
        return q.push(A5K.default), q
    }
    AzA.default = M5K
})
// @from(Ln 28625, Col 4)
YzA = x((KzA) => {
    Object.defineProperty(KzA, "__esModule", {
        value: !0
    });
    var Gj = y3(),
        X5K = {
            message: ({
                schemaCode: A
            }) => Gj.str`must match format "${A}"`,
            params: ({
                schemaCode: A
            }) => Gj._`{format: ${A}}`
        },
        P5K = {
            keyword: "format",
            type: ["number", "string"],
            schemaType: "string",
            $data: !0,
            error: X5K,
            code(A, q) {
                let {
                    gen: K,
                    data: Y,
                    $data: z,
                    schema: _,
                    schemaCode: w,
                    it: O
                } = A, {
                    opts: $,
                    errSchemaPath: H,
                    schemaEnv: j,
                    self: J
                } = O;
                if (!$.validateFormats) return;
                if (z) M();
                else D();

                function M() {
                    let X = K.scopeValue("formats", {
                            ref: J.formats,
                            code: $.code.formats
                        }),
                        P = K.const("fDef", Gj._`${X}[${w}]`),
                        W = K.let("fType"),
                        Z = K.let("format");
                    K.if(Gj._`typeof ${P} == "object" && !(${P} instanceof RegExp)`, () => K.assign(W, Gj._`${P}.type || "string"`).assign(Z, Gj._`${P}.validate`), () => K.assign(W, Gj._`"string"`).assign(Z, P)), A.fail$data((0, Gj.or)(G(), f()));

                    function G() {
                        if ($.strictSchema === !1) return Gj.nil;
                        return Gj._`${w} && !${Z}`
                    }

                    function f() {
                        let v = j.$async ? Gj._`(${P}.async ? await ${Z}(${Y}) : ${Z}(${Y}))` : Gj._`${Z}(${Y})`,
                            N = Gj._`(typeof ${Z} == "function" ? ${v} : ${Z}.test(${Y}))`;
                        return Gj._`${Z} && ${Z} !== true && ${W} === ${q} && !${N}`
                    }
                }

                function D() {
                    let X = J.formats[_];
                    if (!X) {
                        G();
                        return
                    }
                    if (X === !0) return;
                    let [P, W, Z] = f(X);
                    if (P === q) A.pass(v());

                    function G() {
                        if ($.strictSchema === !1) {
                            J.logger.warn(N());
                            return
                        }
                        throw Error(N());

                        function N() {
                            return `unknown format "${_}" ignored in schema at path "${H}"`
                        }
                    }

                    function f(N) {
                        let V = N instanceof RegExp ? (0, Gj.regexpCode)(N) : $.code.formats ? Gj._`${$.code.formats}${(0,Gj.getProperty)(_)}` : void 0,
                            L = K.scopeValue("formats", {
                                key: _,
                                ref: N,
                                code: V
                            });
                        if (typeof N == "object" && !(N instanceof RegExp)) return [N.type || "string", N.validate, Gj._`${L}.validate`];
                        return ["string", N, L]
                    }

                    function v() {
                        if (typeof X == "object" && !(X instanceof RegExp) && X.async) {
                            if (!j.$async) throw Error("async format in sync schema");
                            return Gj._`await ${Z}(${Y})`
                        }
                        return typeof W == "function" ? Gj._`${Z}(${Y})` : Gj._`${Z}.test(${Y})`
                    }
                }
            }
        };
    KzA.default = P5K
})
// @from(Ln 28729, Col 4)
_zA = x((zzA) => {
    Object.defineProperty(zzA, "__esModule", {
        value: !0
    });
    var Z5K = YzA(),
        G5K = [Z5K.default];
    zzA.default = G5K
})
// @from(Ln 28737, Col 4)
$zA = x((wzA) => {
    Object.defineProperty(wzA, "__esModule", {
        value: !0
    });
    wzA.contentVocabulary = wzA.metadataVocabulary = void 0;
    wzA.metadataVocabulary = ["title", "description", "default", "deprecated", "readOnly", "writeOnly", "examples"];
    wzA.contentVocabulary = ["contentMediaType", "contentEncoding", "contentSchema"]
})
// @from(Ln 28745, Col 4)
JzA = x((jzA) => {
    Object.defineProperty(jzA, "__esModule", {
        value: !0
    });
    var v5K = b9A(),
        N5K = wYA(),
        V5K = qzA(),
        k5K = _zA(),
        HzA = $zA(),
        E5K = [v5K.default, N5K.default, (0, V5K.default)(), k5K.default, HzA.metadataVocabulary, HzA.contentVocabulary];
    jzA.default = E5K
})
// @from(Ln 28757, Col 4)
PzA = x((DzA) => {
    Object.defineProperty(DzA, "__esModule", {
        value: !0
    });
    DzA.DiscrError = void 0;
    var MzA;
    (function(A) {
        A.Tag = "tag", A.Mapping = "mapping"
    })(MzA || (DzA.DiscrError = MzA = {}))
})
// @from(Ln 28767, Col 4)
GzA = x((ZzA) => {
    Object.defineProperty(ZzA, "__esModule", {
        value: !0
    });
    var rO6 = y3(),
        eU1 = PzA(),
        WzA = K11(),
        L5K = cy6(),
        R5K = nY(),
        h5K = {
            message: ({
                params: {
                    discrError: A,
                    tagName: q
                }
            }) => A === eU1.DiscrError.Tag ? `tag "${q}" must be string` : `value of tag "${q}" must be in oneOf`,
            params: ({
                params: {
                    discrError: A,
                    tag: q,
                    tagName: K
                }
            }) => rO6._`{error: ${A}, tag: ${K}, tagValue: ${q}}`
        },
        S5K = {
            keyword: "discriminator",
            type: "object",
            schemaType: "object",
            error: h5K,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    schema: Y,
                    parentSchema: z,
                    it: _
                } = A, {
                    oneOf: w
                } = z;
                if (!_.opts.discriminator) throw Error("discriminator: requires discriminator option");
                let O = Y.propertyName;
                if (typeof O != "string") throw Error("discriminator: requires propertyName");
                if (Y.mapping) throw Error("discriminator: mapping is not supported");
                if (!w) throw Error("discriminator: requires oneOf keyword");
                let $ = q.let("valid", !1),
                    H = q.const("tag", rO6._`${K}${(0,rO6.getProperty)(O)}`);
                q.if(rO6._`typeof ${H} == "string"`, () => j(), () => A.error(!1, {
                    discrError: eU1.DiscrError.Tag,
                    tag: H,
                    tagName: O
                })), A.ok($);

                function j() {
                    let D = M();
                    q.if(!1);
                    for (let X in D) q.elseIf(rO6._`${H} === ${X}`), q.assign($, J(D[X]));
                    q.else(), A.error(!1, {
                        discrError: eU1.DiscrError.Mapping,
                        tag: H,
                        tagName: O
                    }), q.endIf()
                }

                function J(D) {
                    let X = q.name("valid"),
                        P = A.subschema({
                            keyword: "oneOf",
                            schemaProp: D
                        }, X);
                    return A.mergeEvaluated(P, rO6.Name), X
                }

                function M() {
                    var D;
                    let X = {},
                        P = Z(z),
                        W = !0;
                    for (let v = 0; v < w.length; v++) {
                        let N = w[v];
                        if ((N === null || N === void 0 ? void 0 : N.$ref) && !(0, R5K.schemaHasRulesButRef)(N, _.self.RULES)) {
                            let L = N.$ref;
                            if (N = WzA.resolveRef.call(_.self, _.schemaEnv.root, _.baseId, L), N instanceof WzA.SchemaEnv) N = N.schema;
                            if (N === void 0) throw new L5K.default(_.opts.uriResolver, _.baseId, L)
                        }
                        let V = (D = N === null || N === void 0 ? void 0 : N.properties) === null || D === void 0 ? void 0 : D[O];
                        if (typeof V != "object") throw Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${O}"`);
                        W = W && (P || Z(N)), G(V, v)
                    }
                    if (!W) throw Error(`discriminator: "${O}" must be required`);
                    return X;

                    function Z({
                        required: v
                    }) {
                        return Array.isArray(v) && v.includes(O)
                    }

                    function G(v, N) {
                        if (v.const) f(v.const, N);
                        else if (v.enum)
                            for (let V of v.enum) f(V, N);
                        else throw Error(`discriminator: "properties/${O}" must have "const" or "enum"`)
                    }

                    function f(v, N) {
                        if (typeof v != "string" || v in X) throw Error(`discriminator: "${O}" values must be unique strings`);
                        X[v] = N
                    }
                }
            }
        };
    ZzA.default = S5K
})
// @from(Ln 28880, Col 4)
fzA = x((ppz, I5K) => {
    I5K.exports = {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "http://json-schema.org/draft-07/schema#",
        title: "Core schema meta-schema",
        definitions: {
            schemaArray: {
                type: "array",
                minItems: 1,
                items: {
                    $ref: "#"
                }
            },
            nonNegativeInteger: {
                type: "integer",
                minimum: 0
            },
            nonNegativeIntegerDefault0: {
                allOf: [{
                    $ref: "#/definitions/nonNegativeInteger"
                }, {
                    default: 0
                }]
            },
            simpleTypes: {
                enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
            },
            stringArray: {
                type: "array",
                items: {
                    type: "string"
                },
                uniqueItems: !0,
                default: []
            }
        },
        type: ["object", "boolean"],
        properties: {
            $id: {
                type: "string",
                format: "uri-reference"
            },
            $schema: {
                type: "string",
                format: "uri"
            },
            $ref: {
                type: "string",
                format: "uri-reference"
            },
            $comment: {
                type: "string"
            },
            title: {
                type: "string"
            },
            description: {
                type: "string"
            },
            default: !0,
            readOnly: {
                type: "boolean",
                default: !1
            },
            examples: {
                type: "array",
                items: !0
            },
            multipleOf: {
                type: "number",
                exclusiveMinimum: 0
            },
            maximum: {
                type: "number"
            },
            exclusiveMaximum: {
                type: "number"
            },
            minimum: {
                type: "number"
            },
            exclusiveMinimum: {
                type: "number"
            },
            maxLength: {
                $ref: "#/definitions/nonNegativeInteger"
            },
            minLength: {
                $ref: "#/definitions/nonNegativeIntegerDefault0"
            },
            pattern: {
                type: "string",
                format: "regex"
            },
            additionalItems: {
                $ref: "#"
            },
            items: {
                anyOf: [{
                    $ref: "#"
                }, {
                    $ref: "#/definitions/schemaArray"
                }],
                default: !0
            },
            maxItems: {
                $ref: "#/definitions/nonNegativeInteger"
            },
            minItems: {
                $ref: "#/definitions/nonNegativeIntegerDefault0"
            },
            uniqueItems: {
                type: "boolean",
                default: !1
            },
            contains: {
                $ref: "#"
            },
            maxProperties: {
                $ref: "#/definitions/nonNegativeInteger"
            },
            minProperties: {
                $ref: "#/definitions/nonNegativeIntegerDefault0"
            },
            required: {
                $ref: "#/definitions/stringArray"
            },
            additionalProperties: {
                $ref: "#"
            },
            definitions: {
                type: "object",
                additionalProperties: {
                    $ref: "#"
                },
                default: {}
            },
            properties: {
                type: "object",
                additionalProperties: {
                    $ref: "#"
                },
                default: {}
            },
            patternProperties: {
                type: "object",
                additionalProperties: {
                    $ref: "#"
                },
                propertyNames: {
                    format: "regex"
                },
                default: {}
            },
            dependencies: {
                type: "object",
                additionalProperties: {
                    anyOf: [{
                        $ref: "#"
                    }, {
                        $ref: "#/definitions/stringArray"
                    }]
                }
            },
            propertyNames: {
                $ref: "#"
            },
            const: !0,
            enum: {
                type: "array",
                items: !0,
                minItems: 1,
                uniqueItems: !0
            },
            type: {
                anyOf: [{
                    $ref: "#/definitions/simpleTypes"
                }, {
                    type: "array",
                    items: {
                        $ref: "#/definitions/simpleTypes"
                    },
                    minItems: 1,
                    uniqueItems: !0
                }]
            },
            format: {
                type: "string"
            },
            contentMediaType: {
                type: "string"
            },
            contentEncoding: {
                type: "string"
            },
            if: {
                $ref: "#"
            },
            then: {
                $ref: "#"
            },
            else: {
                $ref: "#"
            },
            allOf: {
                $ref: "#/definitions/schemaArray"
            },
            anyOf: {
                $ref: "#/definitions/schemaArray"
            },
            oneOf: {
                $ref: "#/definitions/schemaArray"
            },
            not: {
                $ref: "#"
            }
        },
        default: !0
    }
})
// @from(Ln 29100, Col 4)
N11 = x((NT, Ad1) => {
    Object.defineProperty(NT, "__esModule", {
        value: !0
    });
    NT.MissingRefError = NT.ValidationError = NT.CodeGen = NT.Name = NT.nil = NT.stringify = NT.str = NT._ = NT.KeywordCxt = NT.Ajv = void 0;
    var b5K = V9A(),
        x5K = JzA(),
        u5K = GzA(),
        TzA = fzA(),
        m5K = ["/properties"],
        v11 = "http://json-schema.org/draft-07/schema";
    class KL6 extends b5K.default {
        _addVocabularies() {
            if (super._addVocabularies(), x5K.default.forEach((A) => this.addVocabulary(A)), this.opts.discriminator) this.addKeyword(u5K.default)
        }
        _addDefaultMetaSchema() {
            if (super._addDefaultMetaSchema(), !this.opts.meta) return;
            let A = this.opts.$data ? this.$dataMetaSchema(TzA, m5K) : TzA;
            this.addMetaSchema(A, v11, !1), this.refs["http://json-schema.org/schema"] = v11
        }
        defaultMeta() {
            return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(v11) ? v11 : void 0)
        }
    }
    NT.Ajv = KL6;
    Ad1.exports = NT = KL6;
    Ad1.exports.Ajv = KL6;
    Object.defineProperty(NT, "__esModule", {
        value: !0
    });
    NT.default = KL6;
    var B5K = dy6();
    Object.defineProperty(NT, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return B5K.KeywordCxt
        }
    });
    var oO6 = y3();
    Object.defineProperty(NT, "_", {
        enumerable: !0,
        get: function() {
            return oO6._
        }
    });
    Object.defineProperty(NT, "str", {
        enumerable: !0,
        get: function() {
            return oO6.str
        }
    });
    Object.defineProperty(NT, "stringify", {
        enumerable: !0,
        get: function() {
            return oO6.stringify
        }
    });
    Object.defineProperty(NT, "nil", {
        enumerable: !0,
        get: function() {
            return oO6.nil
        }
    });
    Object.defineProperty(NT, "Name", {
        enumerable: !0,
        get: function() {
            return oO6.Name
        }
    });
    Object.defineProperty(NT, "CodeGen", {
        enumerable: !0,
        get: function() {
            return oO6.CodeGen
        }
    });
    var g5K = A11();
    Object.defineProperty(NT, "ValidationError", {
        enumerable: !0,
        get: function() {
            return g5K.default
        }
    });
    var F5K = cy6();
    Object.defineProperty(NT, "MissingRefError", {
        enumerable: !0,
        get: function() {
            return F5K.default
        }
    })
})
// @from(Ln 29190, Col 4)
SzA = x((RzA) => {
    Object.defineProperty(RzA, "__esModule", {
        value: !0
    });
    RzA.formatNames = RzA.fastFormats = RzA.fullFormats = void 0;

    function px(A, q) {
        return {
            validate: A,
            compare: q
        }
    }
    RzA.fullFormats = {
        date: px(kzA, zd1),
        time: px(Kd1(!0), _d1),
        "date-time": px(vzA(!0), yzA),
        "iso-time": px(Kd1(), EzA),
        "iso-date-time": px(vzA(), LzA),
        duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
        uri: n5K,
        "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
        url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
        email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
        ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
        ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
        regex: A3K,
        uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
        "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
        "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
        "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
        byte: r5K,
        int32: {
            type: "number",
            validate: s5K
        },
        int64: {
            type: "number",
            validate: t5K
        },
        float: {
            type: "number",
            validate: VzA
        },
        double: {
            type: "number",
            validate: VzA
        },
        password: !0,
        binary: !0
    };
    RzA.fastFormats = {
        ...RzA.fullFormats,
        date: px(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, zd1),
        time: px(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, _d1),
        "date-time": px(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, yzA),
        "iso-time": px(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, EzA),
        "iso-date-time": px(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, LzA),
        uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
        "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
        email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    RzA.formatNames = Object.keys(RzA.fullFormats);

    function U5K(A) {
        return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }
    var d5K = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
        c5K = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function kzA(A) {
        let q = d5K.exec(A);
        if (!q) return !1;
        let K = +q[1],
            Y = +q[2],
            z = +q[3];
        return Y >= 1 && Y <= 12 && z >= 1 && z <= (Y === 2 && U5K(K) ? 29 : c5K[Y])
    }

    function zd1(A, q) {
        if (!(A && q)) return;
        if (A > q) return 1;
        if (A < q) return -1;
        return 0
    }
    var qd1 = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

    function Kd1(A) {
        return function(K) {
            let Y = qd1.exec(K);
            if (!Y) return !1;
            let z = +Y[1],
                _ = +Y[2],
                w = +Y[3],
                O = Y[4],
                $ = Y[5] === "-" ? -1 : 1,
                H = +(Y[6] || 0),
                j = +(Y[7] || 0);
            if (H > 23 || j > 59 || A && !O) return !1;
            if (z <= 23 && _ <= 59 && w < 60) return !0;
            let J = _ - j * $,
                M = z - H * $ - (J < 0 ? 1 : 0);
            return (M === 23 || M === -1) && (J === 59 || J === -1) && w < 61
        }
    }

    function _d1(A, q) {
        if (!(A && q)) return;
        let K = new Date("2020-01-01T" + A).valueOf(),
            Y = new Date("2020-01-01T" + q).valueOf();
        if (!(K && Y)) return;
        return K - Y
    }

    function EzA(A, q) {
        if (!(A && q)) return;
        let K = qd1.exec(A),
            Y = qd1.exec(q);
        if (!(K && Y)) return;
        if (A = K[1] + K[2] + K[3], q = Y[1] + Y[2] + Y[3], A > q) return 1;
        if (A < q) return -1;
        return 0
    }
    var Yd1 = /t|\s/i;

    function vzA(A) {
        let q = Kd1(A);
        return function(Y) {
            let z = Y.split(Yd1);
            return z.length === 2 && kzA(z[0]) && q(z[1])
        }
    }

    function yzA(A, q) {
        if (!(A && q)) return;
        let K = new Date(A).valueOf(),
            Y = new Date(q).valueOf();
        if (!(K && Y)) return;
        return K - Y
    }

    function LzA(A, q) {
        if (!(A && q)) return;
        let [K, Y] = A.split(Yd1), [z, _] = q.split(Yd1), w = zd1(K, z);
        if (w === void 0) return;
        return w || _d1(Y, _)
    }
    var l5K = /\/|:/,
        i5K = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;

    function n5K(A) {
        return l5K.test(A) && i5K.test(A)
    }
    var NzA = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;

    function r5K(A) {
        return NzA.lastIndex = 0, NzA.test(A)
    }
    var o5K = -2147483648,
        a5K = 2147483647;

    function s5K(A) {
        return Number.isInteger(A) && A <= a5K && A >= o5K
    }

    function t5K(A) {
        return Number.isInteger(A)
    }

    function VzA() {
        return !0
    }
    var e5K = /[^\\]\\Z/;

    function A3K(A) {
        if (e5K.test(A)) return !1;
        try {
            return new RegExp(A), !0
        } catch (q) {
            return !1
        }
    }
})
// @from(Ln 29374, Col 4)
IzA = x((CzA) => {
    Object.defineProperty(CzA, "__esModule", {
        value: !0
    });
    CzA.formatLimitDefinition = void 0;
    var K3K = N11(),
        hS = y3(),
        an = hS.operators,
        V11 = {
            formatMaximum: {
                okStr: "<=",
                ok: an.LTE,
                fail: an.GT
            },
            formatMinimum: {
                okStr: ">=",
                ok: an.GTE,
                fail: an.LT
            },
            formatExclusiveMaximum: {
                okStr: "<",
                ok: an.LT,
                fail: an.GTE
            },
            formatExclusiveMinimum: {
                okStr: ">",
                ok: an.GT,
                fail: an.LTE
            }
        },
        Y3K = {
            message: ({
                keyword: A,
                schemaCode: q
            }) => hS.str`should be ${V11[A].okStr} ${q}`,
            params: ({
                keyword: A,
                schemaCode: q
            }) => hS._`{comparison: ${V11[A].okStr}, limit: ${q}}`
        };
    CzA.formatLimitDefinition = {
        keyword: Object.keys(V11),
        type: "string",
        schemaType: "string",
        $data: !0,
        error: Y3K,
        code(A) {
            let {
                gen: q,
                data: K,
                schemaCode: Y,
                keyword: z,
                it: _
            } = A, {
                opts: w,
                self: O
            } = _;
            if (!w.validateFormats) return;
            let $ = new K3K.KeywordCxt(_, O.RULES.all.format.definition, "format");
            if ($.$data) H();
            else j();

            function H() {
                let M = q.scopeValue("formats", {
                        ref: O.formats,
                        code: w.code.formats
                    }),
                    D = q.const("fmt", hS._`${M}[${$.schemaCode}]`);
                A.fail$data((0, hS.or)(hS._`typeof ${D} != "object"`, hS._`${D} instanceof RegExp`, hS._`typeof ${D}.compare != "function"`, J(D)))
            }

            function j() {
                let M = $.schema,
                    D = O.formats[M];
                if (!D || D === !0) return;
                if (typeof D != "object" || D instanceof RegExp || typeof D.compare != "function") throw Error(`"${z}": format "${M}" does not define "compare" function`);
                let X = q.scopeValue("formats", {
                    key: M,
                    ref: D,
                    code: w.code.formats ? hS._`${w.code.formats}${(0,hS.getProperty)(M)}` : void 0
                });
                A.fail$data(J(X))
            }

            function J(M) {
                return hS._`${M}.compare(${K}, ${Y}) ${V11[z].fail} 0`
            }
        },
        dependencies: ["format"]
    };
    var z3K = (A) => {
        return A.addKeyword(CzA.formatLimitDefinition), A
    };
    CzA.default = z3K
})
// @from(Ln 29469, Col 4)
mzA = x((YL6, uzA) => {
    Object.defineProperty(YL6, "__esModule", {
        value: !0
    });
    var aO6 = SzA(),
        w3K = IzA(),
        $d1 = y3(),
        bzA = new $d1.Name("fullFormats"),
        O3K = new $d1.Name("fastFormats"),
        Hd1 = (A, q = {
            keywords: !0
        }) => {
            if (Array.isArray(q)) return xzA(A, q, aO6.fullFormats, bzA), A;
            let [K, Y] = q.mode === "fast" ? [aO6.fastFormats, O3K] : [aO6.fullFormats, bzA], z = q.formats || aO6.formatNames;
            if (xzA(A, z, K, Y), q.keywords)(0, w3K.default)(A);
            return A
        };
    Hd1.get = (A, q = "full") => {
        let Y = (q === "fast" ? aO6.fastFormats : aO6.fullFormats)[A];
        if (!Y) throw Error(`Unknown format "${A}"`);
        return Y
    };

    function xzA(A, q, K, Y) {
        var z, _;
        (z = (_ = A.opts.code).formats) !== null && z !== void 0 || (_.formats = $d1._`require("ajv-formats/dist/formats").${Y}`);
        for (let w of q) A.addFormat(w, K[w])
    }
    uzA.exports = YL6 = Hd1;
    Object.defineProperty(YL6, "__esModule", {
        value: !0
    });
    YL6.default = Hd1
})
// @from(Ln 29504, Col 0)
function $3K() {
    let A = new BzA.default({
        strict: !1,
        validateFormats: !0,
        validateSchema: !1,
        allErrors: !0
    });
    return gzA.default(A), A
}
// @from(Ln 29513, Col 0)
class zL6 {
    constructor(A) {
        this._ajv = A ?? $3K()
    }
    getValidator(A) {
        let q = "$id" in A && typeof A.$id === "string" ? this._ajv.getSchema(A.$id) ?? this._ajv.compile(A) : this._ajv.compile(A);
        return (K) => {
            if (q(K)) return {
                valid: !0,
                data: K,
                errorMessage: void 0
            };
            else return {
                valid: !1,
                data: void 0,
                errorMessage: this._ajv.errorsText(q.errors)
            }
        }
    }
}
// @from(Ln 29533, Col 4)
BzA
// @from(Ln 29533, Col 9)
gzA
// @from(Ln 29534, Col 4)
jd1 = E(() => {
    BzA = t(N11(), 1), gzA = t(mzA(), 1)
})
// @from(Ln 29537, Col 0)
class Jd1 {
    constructor(A) {
        this._server = A
    }
    requestStream(A, q, K) {
        return this._server.requestStream(A, q, K)
    }
    createMessageStream(A, q) {
        let K = this._server.getClientCapabilities();
        if ((A.tools || A.toolChoice) && !K?.sampling?.tools) throw Error("Client does not support sampling tools capability.");
        if (A.messages.length > 0) {
            let Y = A.messages[A.messages.length - 1],
                z = Array.isArray(Y.content) ? Y.content : [Y.content],
                _ = z.some((H) => H.type === "tool_result"),
                w = A.messages.length > 1 ? A.messages[A.messages.length - 2] : void 0,
                O = w ? Array.isArray(w.content) ? w.content : [w.content] : [],
                $ = O.some((H) => H.type === "tool_use");
            if (_) {
                if (z.some((H) => H.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
                if (!$) throw Error("tool_result blocks are not matching any tool_use from the previous message")
            }
            if ($) {
                let H = new Set(O.filter((J) => J.type === "tool_use").map((J) => J.id)),
                    j = new Set(z.filter((J) => J.type === "tool_result").map((J) => J.toolUseId));
                if (H.size !== j.size || ![...H].every((J) => j.has(J))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
            }
        }
        return this.requestStream({
            method: "sampling/createMessage",
            params: A
        }, fA6, q)
    }
    elicitInputStream(A, q) {
        let K = this._server.getClientCapabilities(),
            Y = A.mode ?? "form";
        switch (Y) {
            case "url": {
                if (!K?.elicitation?.url) throw Error("Client does not support url elicitation.");
                break
            }
            case "form": {
                if (!K?.elicitation?.form) throw Error("Client does not support form elicitation.");
                break
            }
        }
        let z = Y === "form" && A.mode === void 0 ? {
            ...A,
            mode: "form"
        } : A;
        return this.requestStream({
            method: "elicitation/create",
            params: z
        }, Cn, q)
    }
    async getTask(A, q) {
        return this._server.getTask({
            taskId: A
        }, q)
    }
    async getTaskResult(A, q, K) {
        return this._server.getTaskResult({
            taskId: A
        }, q, K)
    }
    async listTasks(A, q) {
        return this._server.listTasks(A ? {
            cursor: A
        } : void 0, q)
    }
    async cancelTask(A, q) {
        return this._server.cancelTask({
            taskId: A
        }, q)
    }
}
// @from(Ln 29612, Col 4)
FzA = E(() => {
    hD()
})
// @from(Ln 29616, Col 0)
function k11(A, q, K) {
    if (!A) throw Error(`${K} does not support task creation (required for ${q})`);
    switch (q) {
        case "tools/call":
            if (!A.tools?.call) throw Error(`${K} does not support task creation for tools/call (required for ${q})`);
            break;
        default:
            break
    }
}
// @from(Ln 29627, Col 0)
function E11(A, q, K) {
    if (!A) throw Error(`${K} does not support task creation (required for ${q})`);
    switch (q) {
        case "sampling/createMessage":
            if (!A.sampling?.createMessage) throw Error(`${K} does not support task creation for sampling/createMessage (required for ${q})`);
            break;
        case "elicitation/create":
            if (!A.elicitation?.create) throw Error(`${K} does not support task creation for elicitation/create (required for ${q})`);
            break;
        default:
            break
    }
}
// @from(Ln 29640, Col 4)
_L6
// @from(Ln 29641, Col 4)
Md1 = E(() => {
    $U1();
    hD();
    jd1();
    Iy6();
    FzA();
    _L6 = class _L6 extends xy6 {
        constructor(A, q) {
            super(q);
            if (this._serverInfo = A, this._loggingLevels = new Map, this.LOG_LEVEL_SEVERITY = new Map(jy6.options.map((K, Y) => [K, Y])), this.isMessageIgnored = (K, Y) => {
                    let z = this._loggingLevels.get(Y);
                    return z ? this.LOG_LEVEL_SEVERITY.get(K) < this.LOG_LEVEL_SEVERITY.get(z) : !1
                }, this._capabilities = q?.capabilities ?? {}, this._instructions = q?.instructions, this._jsonSchemaValidator = q?.jsonSchemaValidator ?? new zL6, this.setRequestHandler(sp1, (K) => this._oninitialize(K)), this.setNotificationHandler(q61, () => this.oninitialized?.()), this._capabilities.logging) this.setRequestHandler(OQ1, async (K, Y) => {
                let z = Y.sessionId || Y.requestInfo?.headers["mcp-session-id"] || void 0,
                    {
                        level: _
                    } = K.params,
                    w = jy6.safeParse(_);
                if (w.success) this._loggingLevels.set(z, w.data);
                return {}
            })
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new Jd1(this)
            };
            return this._experimental
        }
        registerCapabilities(A) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = F61(this._capabilities, A)
        }
        setRequestHandler(A, q) {
            let Y = FO6(A)?.method;
            if (!Y) throw Error("Schema is missing a method literal");
            let z;
            if (Qn(Y)) {
                let w = Y;
                z = w._zod?.def?.value ?? w.value
            } else {
                let w = Y;
                z = w._def?.value ?? w.value
            }
            if (typeof z !== "string") throw Error("Schema method literal must be a string");
            if (z === "tools/call") {
                let w = async (O, $) => {
                    let H = $G(GA6, O);
                    if (!H.success) {
                        let D = H.error instanceof Error ? H.error.message : String(H.error);
                        throw new Aq(Fq.InvalidParams, `Invalid tools/call request: ${D}`)
                    }
                    let {
                        params: j
                    } = H.data, J = await Promise.resolve(q(O, $));
                    if (j.task) {
                        let D = $G(Ep, J);
                        if (!D.success) {
                            let X = D.error instanceof Error ? D.error.message : String(D.error);
                            throw new Aq(Fq.InvalidParams, `Invalid task creation result: ${X}`)
                        }
                        return D.data
                    }
                    let M = $G(bx, J);
                    if (!M.success) {
                        let D = M.error instanceof Error ? M.error.message : String(M.error);
                        throw new Aq(Fq.InvalidParams, `Invalid tools/call result: ${D}`)
                    }
                    return M.data
                };
                return super.setRequestHandler(A, w)
            }
            return super.setRequestHandler(A, q)
        }
        assertCapabilityForMethod(A) {
            switch (A) {
                case "sampling/createMessage":
                    if (!this._clientCapabilities?.sampling) throw Error(`Client does not support sampling (required for ${A})`);
                    break;
                case "elicitation/create":
                    if (!this._clientCapabilities?.elicitation) throw Error(`Client does not support elicitation (required for ${A})`);
                    break;
                case "roots/list":
                    if (!this._clientCapabilities?.roots) throw Error(`Client does not support listing roots (required for ${A})`);
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(A) {
            switch (A) {
                case "notifications/message":
                    if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${A})`);
                    break;
                case "notifications/resources/updated":
                case "notifications/resources/list_changed":
                    if (!this._capabilities.resources) throw Error(`Server does not support notifying about resources (required for ${A})`);
                    break;
                case "notifications/tools/list_changed":
                    if (!this._capabilities.tools) throw Error(`Server does not support notifying of tool list changes (required for ${A})`);
                    break;
                case "notifications/prompts/list_changed":
                    if (!this._capabilities.prompts) throw Error(`Server does not support notifying of prompt list changes (required for ${A})`);
                    break;
                case "notifications/elicitation/complete":
                    if (!this._clientCapabilities?.elicitation?.url) throw Error(`Client does not support URL elicitation (required for ${A})`);
                    break;
                case "notifications/cancelled":
                    break;
                case "notifications/progress":
                    break
            }
        }
        assertRequestHandlerCapability(A) {
            if (!this._capabilities) return;
            switch (A) {
                case "completion/complete":
                    if (!this._capabilities.completions) throw Error(`Server does not support completions (required for ${A})`);
                    break;
                case "logging/setLevel":
                    if (!this._capabilities.logging) throw Error(`Server does not support logging (required for ${A})`);
                    break;
                case "prompts/get":
                case "prompts/list":
                    if (!this._capabilities.prompts) throw Error(`Server does not support prompts (required for ${A})`);
                    break;
                case "resources/list":
                case "resources/templates/list":
                case "resources/read":
                    if (!this._capabilities.resources) throw Error(`Server does not support resources (required for ${A})`);
                    break;
                case "tools/call":
                case "tools/list":
                    if (!this._capabilities.tools) throw Error(`Server does not support tools (required for ${A})`);
                    break;
                case "tasks/get":
                case "tasks/list":
                case "tasks/result":
                case "tasks/cancel":
                    if (!this._capabilities.tasks) throw Error(`Server does not support tasks capability (required for ${A})`);
                    break;
                case "ping":
                case "initialize":
                    break
            }
        }
        assertTaskCapability(A) {
            E11(this._clientCapabilities?.tasks?.requests, A, "Client")
        }
        assertTaskHandlerCapability(A) {
            if (!this._capabilities) return;
            k11(this._capabilities.tasks?.requests, A, "Server")
        }
        async _oninitialize(A) {
            let q = A.params.protocolVersion;
            return this._clientCapabilities = A.params.capabilities, this._clientVersion = A.params.clientInfo, {
                protocolVersion: se6.includes(q) ? q : hn,
                capabilities: this.getCapabilities(),
                serverInfo: this._serverInfo,
                ...this._instructions && {
                    instructions: this._instructions
                }
            }
        }
        getClientCapabilities() {
            return this._clientCapabilities
        }
        getClientVersion() {
            return this._clientVersion
        }
        getCapabilities() {
            return this._capabilities
        }
        async ping() {
            return this.request({
                method: "ping"
            }, kp)
        }
        async createMessage(A, q) {
            if (A.tools || A.toolChoice) {
                if (!this._clientCapabilities?.sampling?.tools) throw Error("Client does not support sampling tools capability.")
            }
            if (A.messages.length > 0) {
                let K = A.messages[A.messages.length - 1],
                    Y = Array.isArray(K.content) ? K.content : [K.content],
                    z = Y.some(($) => $.type === "tool_result"),
                    _ = A.messages.length > 1 ? A.messages[A.messages.length - 2] : void 0,
                    w = _ ? Array.isArray(_.content) ? _.content : [_.content] : [],
                    O = w.some(($) => $.type === "tool_use");
                if (z) {
                    if (Y.some(($) => $.type !== "tool_result")) throw Error("The last message must contain only tool_result content if any is present");
                    if (!O) throw Error("tool_result blocks are not matching any tool_use from the previous message")
                }
                if (O) {
                    let $ = new Set(w.filter((j) => j.type === "tool_use").map((j) => j.id)),
                        H = new Set(Y.filter((j) => j.type === "tool_result").map((j) => j.toolUseId));
                    if ($.size !== H.size || ![...$].every((j) => H.has(j))) throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match")
                }
            }
            if (A.tools) return this.request({
                method: "sampling/createMessage",
                params: A
            }, Jy6, q);
            return this.request({
                method: "sampling/createMessage",
                params: A
            }, fA6, q)
        }
        async elicitInput(A, q) {
            switch (A.mode ?? "form") {
                case "url": {
                    if (!this._clientCapabilities?.elicitation?.url) throw Error("Client does not support url elicitation.");
                    let Y = A;
                    return this.request({
                        method: "elicitation/create",
                        params: Y
                    }, Cn, q)
                }
                case "form": {
                    if (!this._clientCapabilities?.elicitation?.form) throw Error("Client does not support form elicitation.");
                    let Y = A.mode === "form" ? A : {
                            ...A,
                            mode: "form"
                        },
                        z = await this.request({
                            method: "elicitation/create",
                            params: Y
                        }, Cn, q);
                    if (z.action === "accept" && z.content && Y.requestedSchema) try {
                        let w = this._jsonSchemaValidator.getValidator(Y.requestedSchema)(z.content);
                        if (!w.valid) throw new Aq(Fq.InvalidParams, `Elicitation response content does not match requested schema: ${w.errorMessage}`)
                    } catch (_) {
                        if (_ instanceof Aq) throw _;
                        throw new Aq(Fq.InternalError, `Error validating elicitation response: ${_ instanceof Error?_.message:String(_)}`)
                    }
                    return z
                }
            }
        }
        createElicitationCompletionNotifier(A, q) {
            if (!this._clientCapabilities?.elicitation?.url) throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
            return () => this.notification({
                method: "notifications/elicitation/complete",
                params: {
                    elicitationId: A
                }
            }, q)
        }
        async listRoots(A, q) {
            return this.request({
                method: "roots/list",
                params: A
            }, JQ1, q)
        }
        async sendLoggingMessage(A, q) {
            if (this._capabilities.logging) {
                if (!this.isMessageIgnored(A.level, q)) return this.notification({
                    method: "notifications/message",
                    params: A
                })
            }
        }
        async sendResourceUpdated(A) {
            return this.notification({
                method: "notifications/resources/updated",
                params: A
            })
        }
        async sendResourceListChanged() {
            return this.notification({
                method: "notifications/resources/list_changed"
            })
        }
        async sendToolListChanged() {
            return this.notification({
                method: "notifications/tools/list_changed"
            })
        }
        async sendPromptListChanged() {
            return this.notification({
                method: "notifications/prompts/list_changed"
            })
        }
    }
})
// @from(Ln 29925, Col 0)
class pzA {
    clients = new Map;
    tabRoutes = new Map;
    context;
    notificationHandler = null;
    constructor(A) {
        this.context = A
    }
    setNotificationHandler(A) {
        this.notificationHandler = A;
        for (let q of this.clients.values()) q.setNotificationHandler(A)
    }
    async ensureConnected() {
        let {
            logger: A,
            serverName: q
        } = this.context;
        this.refreshClients();
        let K = [];
        for (let z of this.clients.values())
            if (!z.isConnected()) K.push(z.ensureConnected().catch(() => !1));
        if (K.length > 0) await Promise.all(K);
        let Y = this.getConnectedClients().length;
        if (Y === 0) return A.info(`[${q}] No connected sockets in pool`), !1;
        return A.info(`[${q}] Socket pool: ${Y} connected`), !0
    }
    async callTool(A, q, K) {
        if (A === "tabs_context_mcp") return this.callTabsContext(q);
        let Y = q.tabId;
        if (Y !== void 0) {
            let _ = this.tabRoutes.get(Y);
            if (_) {
                let w = this.clients.get(_);
                if (w?.isConnected()) return w.callTool(A, q)
            }
        }
        let z = this.getConnectedClients();
        if (z.length === 0) throw new OG(`[${this.context.serverName}] No connected sockets available`);
        return z[0].callTool(A, q)
    }
    async setPermissionMode(A, q) {
        let K = this.getConnectedClients();
        await Promise.all(K.map((Y) => Y.setPermissionMode(A, q)))
    }
    isConnected() {
        return this.getConnectedClients().length > 0
    }
    disconnect() {
        for (let A of this.clients.values()) A.disconnect();
        this.clients.clear(), this.tabRoutes.clear()
    }
    getConnectedClients() {
        return [...this.clients.values()].filter((A) => A.isConnected())
    }
    async callTabsContext(A) {
        let {
            logger: q,
            serverName: K
        } = this.context, Y = this.getConnectedClients();
        if (Y.length === 0) throw new OG(`[${K}] No connected sockets available`);
        if (Y.length === 1) {
            let w = await Y[0].callTool("tabs_context_mcp", A);
            return this.updateTabRoutes(w, this.getSocketPathForClient(Y[0])), w
        }
        let z = await Promise.allSettled(Y.map(async (w) => {
                let O = await w.callTool("tabs_context_mcp", A),
                    $ = this.getSocketPathForClient(w);
                return {
                    result: O,
                    socketPath: $
                }
            })),
            _ = [];
        this.tabRoutes.clear();
        for (let w of z) {
            if (w.status !== "fulfilled") {
                q.info(`[${K}] tabs_context_mcp failed on one socket: ${w.reason}`);
                continue
            }
            let {
                result: O,
                socketPath: $
            } = w.value;
            this.updateTabRoutes(O, $);
            let H = this.extractTabs(O);
            if (H) _.push(...H)
        }
        if (_.length > 0) {
            let w = _.map((O) => {
                let $ = O;
                return `  • tabId ${$.tabId}: "${$.title}" (${$.url})`
            }).join(`
`);
            return {
                result: {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            availableTabs: _
                        })
                    }, {
                        type: "text",
                        text: `

Tab Context:
- Available tabs:
${w}`
                    }]
                }
            }
        }
        for (let w of z)
            if (w.status === "fulfilled") return w.value.result;
        throw new OG(`[${K}] All sockets failed for tabs_context_mcp`)
    }
    updateTabRoutes(A, q) {
        let K = this.extractTabs(A);
        if (!K) return;
        for (let Y of K)
            if (typeof Y === "object" && Y !== null && "tabId" in Y) {
                let z = Y.tabId;
                this.tabRoutes.set(z, q)
            }
    }
    extractTabs(A) {
        if (!A || typeof A !== "object") return null;
        let K = A.result?.content;
        if (!K || !Array.isArray(K)) return null;
        for (let Y of K)
            if (Y.type === "text" && Y.text) try {
                let z = JSON.parse(Y.text);
                if (Array.isArray(z)) return z;
                if (z && Array.isArray(z.availableTabs)) return z.availableTabs
            } catch {}
        return null
    }
    getSocketPathForClient(A) {
        for (let [q, K] of this.clients.entries())
            if (K === A) return q;
        return ""
    }
    refreshClients() {
        let A = this.getAvailableSocketPaths(),
            {
                logger: q,
                serverName: K
            } = this.context;
        for (let Y of A)
            if (!this.clients.has(Y)) {
                q.info(`[${K}] Adding socket to pool: ${Y}`);
                let z = {
                        ...this.context,
                        socketPath: Y,
                        getSocketPath: void 0,
                        getSocketPaths: void 0
                    },
                    _ = k61(z);
                if (_.disableAutoReconnect = !0, this.notificationHandler) _.setNotificationHandler(this.notificationHandler);
                this.clients.set(Y, _)
            } for (let [Y, z] of this.clients.entries())
            if (!A.includes(Y)) {
                q.info(`[${K}] Removing stale socket from pool: ${Y}`), z.disconnect(), this.clients.delete(Y);
                for (let [_, w] of this.tabRoutes.entries())
                    if (w === Y) this.tabRoutes.delete(_)
            }
    }
    getAvailableSocketPaths() {
        return this.context.getSocketPaths?.() ?? []
    }
}
// @from(Ln 30096, Col 0)
function QzA(A) {
    return new pzA(A)
}
// @from(Ln 30099, Col 4)
UzA = E(() => {
    Vy6()
})
// @from(Ln 30102, Col 0)
async function H3K(A, q, K, Y, z) {
    let _ = await q.callTool(K, Y, z);
    if (A.logger.silly(`[${A.serverName}] Received result from socket bridge: ${JSON.stringify(_)}`), _ === null || _ === void 0) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    let {
        result: w,
        error: O
    } = _, $ = O || w, H = !!O;
    if (!$) return {
        content: [{
            type: "text",
            text: "Tool execution completed"
        }]
    };
    if (H && M3K($.content)) A.onAuthenticationError();
    let {
        content: j
    } = $;
    if (j && Array.isArray(j)) {
        if (H) return {
            content: j.map((M) => {
                if (typeof M === "object" && M !== null && "type" in M) return M;
                return {
                    type: "text",
                    text: String(M)
                }
            }),
            isError: !0
        };
        return {
            content: j.map((M) => {
                if (typeof M === "object" && M !== null && "type" in M && "source" in M) {
                    let D = M;
                    if (D.type === "image" && typeof D.source === "object" && D.source !== null && "data" in D.source) return {
                        type: "image",
                        data: D.source.data,
                        mimeType: "media_type" in D.source ? D.source.media_type || "image/png" : "image/png"
                    }
                }
                if (typeof M === "object" && M !== null && "type" in M) return M;
                return {
                    type: "text",
                    text: String(M)
                }
            }),
            isError: H
        }
    }
    if (typeof j === "string") return {
        content: [{
            type: "text",
            text: j
        }],
        isError: H
    };
    return A.logger.warn(`[${A.serverName}] Unexpected result format from socket bridge`, _), {
        content: [{
            type: "text",
            text: JSON.stringify(_)
        }],
        isError: H
    }
}
// @from(Ln 30170, Col 0)
function Dd1(A) {
    return {
        content: [{
            type: "text",
            text: A.onToolCallDisconnected()
        }]
    }
}
// @from(Ln 30178, Col 0)
async function j3K(A, q) {
    let K = ["ask", "skip_all_permission_checks", "follow_a_plan"],
        Y = q.mode,
        z = Y && K.includes(Y) ? Y : "ask";
    if (A.setPermissionMode) await A.setPermissionMode(z, q.allowed_domains);
    return {
        content: [{
            type: "text",
            text: `Permission mode set to: ${z}`
        }]
    }
}
// @from(Ln 30190, Col 0)
async function J3K(A, q) {
    if (!A.bridgeConfig) return {
        content: [{
            type: "text",
            text: "Browser switching is only available with bridge connections."
        }],
        isError: !0
    };
    if (!await q.ensureConnected()) return Dd1(A);
    let Y = await q.switchBrowser?.() ?? null;
    if (Y === "no_other_browsers") return {
        content: [{
            type: "text",
            text: "No other browsers available to switch to. Open Chrome with the Claude extension in another browser to switch."
        }],
        isError: !0
    };
    if (Y) return {
        content: [{
            type: "text",
            text: `Connected to browser "${Y.name}".`
        }]
    };
    return {
        content: [{
            type: "text",
            text: "No browser responded within the timeout. Make sure Chrome is open with the Claude extension installed, then try again."
        }],
        isError: !0
    }
}
// @from(Ln 30222, Col 0)
function M3K(A) {
    return (Array.isArray(A) ? A.map((K) => {
        if (typeof K === "string") return K;
        if (typeof K === "object" && K !== null && "text" in K && typeof K.text === "string") return K.text;
        return ""
    }).join(" ") : String(A)).toLowerCase().includes("re-authenticated")
}
// @from(Ln 30229, Col 4)
dzA = async (A, q, K, Y, z) => {
    if (K === "set_permission_mode") return j3K(q, Y);
    if (K === "switch_browser") return J3K(A, q);
    try {
        let _ = await q.ensureConnected();
        if (A.logger.silly(`[${A.serverName}] Server is connected: ${_}. Received tool call: ${K} with args: ${JSON.stringify(Y)}.`), _) return await H3K(A, q, K, Y, z);
        return Dd1(A)
    } catch (_) {
        if (A.logger.info(`[${A.serverName}] Error calling tool:`, _), _ instanceof OG) return Dd1(A);
        return {
            content: [{
                type: "text",
                text: `Error calling tool, please try again. : ${_ instanceof Error?_.message:String(_)}`
            }],
            isError: !0
        }
    }
}
// @from(Ln 30247, Col 4)
czA = E(() => {
    Vy6()
})
// @from(Ln 30251, Col 0)
function Xd1(A) {
    return A.bridgeConfig ? L61(A) : A.getSocketPaths ? QzA(A) : k61(A)
}
// @from(Ln 30255, Col 0)
function y11(A, q) {
    let {
        serverName: K,
        logger: Y
    } = A, z = q ?? Xd1(A), _ = new _L6({
        name: K,
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {},
            logging: {}
        }
    });
    return _.setRequestHandler(Oy6, async () => {
        if (A.isDisabled?.()) return {
            tools: []
        };
        return {
            tools: A.bridgeConfig ? Sp : Sp.filter((w) => w.name !== "switch_browser")
        }
    }), _.setRequestHandler(GA6, async (w) => {
        return Y.info(`[${K}] Executing tool: ${w.params.name}`), dzA(A, z, w.params.name, w.params.arguments || {})
    }), z.setNotificationHandler((w) => {
        Y.info(`[${K}] Forwarding MCP notification: ${w.method}`), _.notification({
            method: w.method,
            params: w.params
        }).catch((O) => {
            Y.info(`[${K}] Failed to forward MCP notification: ${O.message}`)
        })
    }), _
}
// @from(Ln 30286, Col 4)
lzA = E(() => {
    Md1();
    hD();
    hQ1();
    SQ1();
    Vy6();
    UzA();
    czA()
})
// @from(Ln 30295, Col 4)
izA = {}
// @from(Ln 30304, Col 4)
wL6 = E(() => {
    hQ1();
    SQ1();
    lzA()
})
// @from(Ln 30309, Col 4)
szA = x((kQz, azA) => {
    azA.exports = ozA;
    ozA.sync = X3K;
    var nzA = x6("fs");

    function D3K(A, q) {
        var K = q.pathExt !== void 0 ? q.pathExt : process.env.PATHEXT;
        if (!K) return !0;
        if (K = K.split(";"), K.indexOf("") !== -1) return !0;
        for (var Y = 0; Y < K.length; Y++) {
            var z = K[Y].toLowerCase();
            if (z && A.substr(-z.length).toLowerCase() === z) return !0
        }
        return !1
    }

    function rzA(A, q, K) {
        if (!A.isSymbolicLink() && !A.isFile()) return !1;
        return D3K(q, K)
    }

    function ozA(A, q, K) {
        nzA.stat(A, function(Y, z) {
            K(Y, Y ? !1 : rzA(z, A, q))
        })
    }

    function X3K(A, q) {
        return rzA(nzA.statSync(A), A, q)
    }
})
// @from(Ln 30340, Col 4)
K_A = x((EQz, q_A) => {
    q_A.exports = ezA;
    ezA.sync = P3K;
    var tzA = x6("fs");

    function ezA(A, q, K) {
        tzA.stat(A, function(Y, z) {
            K(Y, Y ? !1 : A_A(z, q))
        })
    }

    function P3K(A, q) {
        return A_A(tzA.statSync(A), q)
    }

    function A_A(A, q) {
        return A.isFile() && W3K(A, q)
    }

    function W3K(A, q) {
        var {
            mode: K,
            uid: Y,
            gid: z
        } = A, _ = q.uid !== void 0 ? q.uid : process.getuid && process.getuid(), w = q.gid !== void 0 ? q.gid : process.getgid && process.getgid(), O = parseInt("100", 8), $ = parseInt("010", 8), H = parseInt("001", 8), j = O | $, J = K & H || K & $ && z === w || K & O && Y === _ || K & j && _ === 0;
        return J
    }
})
// @from(Ln 30368, Col 4)
z_A = x((LQz, Y_A) => {
    var yQz = x6("fs"),
        L11;
    if (process.platform === "win32" || global.TESTING_WINDOWS) L11 = szA();
    else L11 = K_A();
    Y_A.exports = Pd1;
    Pd1.sync = Z3K;

    function Pd1(A, q, K) {
        if (typeof q === "function") K = q, q = {};
        if (!K) {
            if (typeof Promise !== "function") throw TypeError("callback not provided");
            return new Promise(function(Y, z) {
                Pd1(A, q || {}, function(_, w) {
                    if (_) z(_);
                    else Y(w)
                })
            })
        }
        L11(A, q || {}, function(Y, z) {
            if (Y) {
                if (Y.code === "EACCES" || q && q.ignoreErrors) Y = null, z = !1
            }
            K(Y, z)
        })
    }

    function Z3K(A, q) {
        try {
            return L11.sync(A, q || {})
        } catch (K) {
            if (q && q.ignoreErrors || K.code === "EACCES") return !1;
            else throw K
        }
    }
})
// @from(Ln 30404, Col 4)
J_A = x((RQz, j_A) => {
    var sO6 = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys",
        __A = x6("path"),
        G3K = sO6 ? ";" : ":",
        w_A = z_A(),
        O_A = (A) => Object.assign(Error(`not found: ${A}`), {
            code: "ENOENT"
        }),
        $_A = (A, q) => {
            let K = q.colon || G3K,
                Y = A.match(/\//) || sO6 && A.match(/\\/) ? [""] : [...sO6 ? [process.cwd()] : [], ...(q.path || process.env.PATH || "").split(K)],
                z = sO6 ? q.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "",
                _ = sO6 ? z.split(K) : [""];
            if (sO6) {
                if (A.indexOf(".") !== -1 && _[0] !== "") _.unshift("")
            }
            return {
                pathEnv: Y,
                pathExt: _,
                pathExtExe: z
            }
        },
        H_A = (A, q, K) => {
            if (typeof q === "function") K = q, q = {};
            if (!q) q = {};
            let {
                pathEnv: Y,
                pathExt: z,
                pathExtExe: _
            } = $_A(A, q), w = [], O = (H) => new Promise((j, J) => {
                if (H === Y.length) return q.all && w.length ? j(w) : J(O_A(A));
                let M = Y[H],
                    D = /^".*"$/.test(M) ? M.slice(1, -1) : M,
                    X = __A.join(D, A),
                    P = !D && /^\.[\\\/]/.test(A) ? A.slice(0, 2) + X : X;
                j($(P, H, 0))
            }), $ = (H, j, J) => new Promise((M, D) => {
                if (J === z.length) return M(O(j + 1));
                let X = z[J];
                w_A(H + X, {
                    pathExt: _
                }, (P, W) => {
                    if (!P && W)
                        if (q.all) w.push(H + X);
                        else return M(H + X);
                    return M($(H, j, J + 1))
                })
            });
            return K ? O(0).then((H) => K(null, H), K) : O(0)
        },
        f3K = (A, q) => {
            q = q || {};
            let {
                pathEnv: K,
                pathExt: Y,
                pathExtExe: z
            } = $_A(A, q), _ = [];
            for (let w = 0; w < K.length; w++) {
                let O = K[w],
                    $ = /^".*"$/.test(O) ? O.slice(1, -1) : O,
                    H = __A.join($, A),
                    j = !$ && /^\.[\\\/]/.test(A) ? A.slice(0, 2) + H : H;
                for (let J = 0; J < Y.length; J++) {
                    let M = j + Y[J];
                    try {
                        if (w_A.sync(M, {
                                pathExt: z
                            }))
                            if (q.all) _.push(M);
                            else return M
                    } catch (D) {}
                }
            }
            if (q.all && _.length) return _;
            if (q.nothrow) return null;
            throw O_A(A)
        };
    j_A.exports = H_A;
    H_A.sync = f3K
})
// @from(Ln 30484, Col 4)
D_A = x((hQz, Wd1) => {
    var M_A = (A = {}) => {
        let q = A.env || process.env;
        if ((A.platform || process.platform) !== "win32") return "PATH";
        return Object.keys(q).reverse().find((Y) => Y.toUpperCase() === "PATH") || "Path"
    };
    Wd1.exports = M_A;
    Wd1.exports.default = M_A
})
// @from(Ln 30493, Col 4)
Z_A = x((SQz, W_A) => {
    var X_A = x6("path"),
        T3K = J_A(),
        v3K = D_A();

    function P_A(A, q) {
        let K = A.options.env || process.env,
            Y = process.cwd(),
            z = A.options.cwd != null,
            _ = z && process.chdir !== void 0 && !process.chdir.disabled;
        if (_) try {
            process.chdir(A.options.cwd)
        } catch (O) {}
        let w;
        try {
            w = T3K.sync(A.command, {
                path: K[v3K({
                    env: K
                })],
                pathExt: q ? X_A.delimiter : void 0
            })
        } catch (O) {} finally {
            if (_) process.chdir(Y)
        }
        if (w) w = X_A.resolve(z ? A.options.cwd : "", w);
        return w
    }

    function N3K(A) {
        return P_A(A) || P_A(A, !0)
    }
    W_A.exports = N3K
})
// @from(Ln 30526, Col 4)
G_A = x((E3K, Gd1) => {
    var Zd1 = /([()\][%!^"`<>&|;, *?])/g;

    function V3K(A) {
        return A = A.replace(Zd1, "^$1"), A
    }

    function k3K(A, q) {
        if (A = `${A}`, A = A.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\""), A = A.replace(/(?=(\\+?)?)\1$/, "$1$1"), A = `"${A}"`, A = A.replace(Zd1, "^$1"), q) A = A.replace(Zd1, "^$1");
        return A
    }
    E3K.command = V3K;
    E3K.argument = k3K
})
// @from(Ln 30540, Col 4)
T_A = x((CQz, f_A) => {
    f_A.exports = /^#!(.*)/
})
// @from(Ln 30543, Col 4)
N_A = x((IQz, v_A) => {
    var R3K = T_A();
    v_A.exports = (A = "") => {
        let q = A.match(R3K);
        if (!q) return null;
        let [K, Y] = q[0].replace(/#! ?/, "").split(" "), z = K.split("/").pop();
        if (z === "env") return Y;
        return Y ? `${z} ${Y}` : z
    }
})
// @from(Ln 30553, Col 4)
k_A = x((bQz, V_A) => {
    var fd1 = x6("fs"),
        h3K = N_A();

    function S3K(A) {
        let K = Buffer.alloc(150),
            Y;
        try {
            Y = fd1.openSync(A, "r"), fd1.readSync(Y, K, 0, 150, 0), fd1.closeSync(Y)
        } catch (z) {}
        return h3K(K.toString())
    }
    V_A.exports = S3K
})
// @from(Ln 30567, Col 4)
R_A = x((xQz, L_A) => {
    var C3K = x6("path"),
        E_A = Z_A(),
        y_A = G_A(),
        I3K = k_A(),
        b3K = process.platform === "win32",
        x3K = /\.(?:com|exe)$/i,
        u3K = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

    function m3K(A) {
        A.file = E_A(A);
        let q = A.file && I3K(A.file);
        if (q) return A.args.unshift(A.file), A.command = q, E_A(A);
        return A.file
    }

    function B3K(A) {
        if (!b3K) return A;
        let q = m3K(A),
            K = !x3K.test(q);
        if (A.options.forceShell || K) {
            let Y = u3K.test(q);
            A.command = C3K.normalize(A.command), A.command = y_A.command(A.command), A.args = A.args.map((_) => y_A.argument(_, Y));
            let z = [A.command].concat(A.args).join(" ");
            A.args = ["/d", "/s", "/c", `"${z}"`], A.command = process.env.comspec || "cmd.exe", A.options.windowsVerbatimArguments = !0
        }
        return A
    }

    function g3K(A, q, K) {
        if (q && !Array.isArray(q)) K = q, q = null;
        q = q ? q.slice(0) : [], K = Object.assign({}, K);
        let Y = {
            command: A,
            args: q,
            options: K,
            file: void 0,
            original: {
                command: A,
                args: q
            }
        };
        return K.shell ? Y : B3K(Y)
    }
    L_A.exports = g3K
})
// @from(Ln 30613, Col 4)
C_A = x((uQz, S_A) => {
    var Td1 = process.platform === "win32";

    function vd1(A, q) {
        return Object.assign(Error(`${q} ${A.command} ENOENT`), {
            code: "ENOENT",
            errno: "ENOENT",
            syscall: `${q} ${A.command}`,
            path: A.command,
            spawnargs: A.args
        })
    }

    function F3K(A, q) {
        if (!Td1) return;
        let K = A.emit;
        A.emit = function(Y, z) {
            if (Y === "exit") {
                let _ = h_A(z, q);
                if (_) return K.call(A, "error", _)
            }
            return K.apply(A, arguments)
        }
    }

    function h_A(A, q) {
        if (Td1 && A === 1 && !q.file) return vd1(q.original, "spawn");
        return null
    }

    function p3K(A, q) {
        if (Td1 && A === 1 && !q.file) return vd1(q.original, "spawnSync");
        return null
    }
    S_A.exports = {
        hookChildProcess: F3K,
        verifyENOENT: h_A,
        verifyENOENTSync: p3K,
        notFoundError: vd1
    }
})
// @from(Ln 30654, Col 4)
kd1 = x((mQz, tO6) => {
    var I_A = x6("child_process"),
        Nd1 = R_A(),
        Vd1 = C_A();

    function b_A(A, q, K) {
        let Y = Nd1(A, q, K),
            z = I_A.spawn(Y.command, Y.args, Y.options);
        return Vd1.hookChildProcess(z, Y), z
    }

    function Q3K(A, q, K) {
        let Y = Nd1(A, q, K),
            z = I_A.spawnSync(Y.command, Y.args, Y.options);
        return z.error = z.error || Vd1.verifyENOENTSync(z.status, Y), z
    }
    tO6.exports = b_A;
    tO6.exports.spawn = b_A;
    tO6.exports.sync = Q3K;
    tO6.exports._parse = Nd1;
    tO6.exports._enoent = Vd1
})
// @from(Ln 30677, Col 0)
function Ed1(A) {
    let q = typeof A === "string" ? `
` : `
`.charCodeAt(),
        K = typeof A === "string" ? "\r" : "\r".charCodeAt();
    if (A[A.length - 1] === q) A = A.slice(0, -1);
    if (A[A.length - 1] === K) A = A.slice(0, -1);
    return A
}
// @from(Ln 30687, Col 0)
function R11(A = {}) {
    let {
        env: q = process.env,
        platform: K = process.platform
    } = A;
    if (K !== "win32") return "PATH";
    return Object.keys(q).reverse().find((Y) => Y.toUpperCase() === "PATH") || "Path"
}
// @from(Ln 30700, Col 4)
U3K = ({
        cwd: A = h11.cwd(),
        path: q = h11.env[R11()],
        preferLocal: K = !0,
        execPath: Y = h11.execPath,
        addExecPath: z = !0
    } = {}) => {
        let _ = A instanceof URL ? x_A(A) : A,
            w = OL6.resolve(_),
            O = [];
        if (K) d3K(O, w);
        if (z) c3K(O, Y, w);
        return [...O, q].join(OL6.delimiter)
    }
// @from(Ln 30714, Col 4)
d3K = (A, q) => {
        let K;
        while (K !== q) A.push(OL6.join(q, "node_modules/.bin")), K = q, q = OL6.resolve(q, "..")
    }
// @from(Ln 30718, Col 4)
c3K = (A, q, K) => {
        let Y = q instanceof URL ? x_A(q) : q;
        A.push(OL6.resolve(K, Y, ".."))
    }
// @from(Ln 30722, Col 4)
u_A = ({
        env: A = h11.env,
        ...q
    } = {}) => {
        A = {
            ...A
        };
        let K = R11({
            env: A
        });
        return q.path = A[K], A[K] = U3K(q), A
    }
// @from(Ln 30734, Col 4)
m_A = () => {}
// @from(Ln 30736, Col 0)
function yd1(A, q, {
    ignoreNonConfigurable: K = !1
} = {}) {
    let {
        name: Y
    } = A;
    for (let z of Reflect.ownKeys(q)) l3K(A, q, z, K);
    return n3K(A, q), s3K(A, q, Y), A
}
// @from(Ln 30745, Col 4)
l3K = (A, q, K, Y) => {
        if (K === "length" || K === "prototype") return;
        if (K === "arguments" || K === "caller") return;
        let z = Object.getOwnPropertyDescriptor(A, K),
            _ = Object.getOwnPropertyDescriptor(q, K);
        if (!i3K(z, _) && Y) return;
        Object.defineProperty(A, K, _)
    }
// @from(Ln 30753, Col 4)
i3K = function(A, q) {
        return A === void 0 || A.configurable || A.writable === q.writable && A.enumerable === q.enumerable && A.configurable === q.configurable && (A.writable || A.value === q.value)
    }
// @from(Ln 30756, Col 4)
n3K = (A, q) => {
        let K = Object.getPrototypeOf(q);
        if (K === Object.getPrototypeOf(A)) return;
        Object.setPrototypeOf(A, K)
    }
// @from(Ln 30761, Col 4)
r3K = (A, q) => `/* Wrapped ${A}*/
${q}`
// @from(Ln 30763, Col 4)
o3K
// @from(Ln 30763, Col 9)
a3K
// @from(Ln 30763, Col 14)
s3K = (A, q, K) => {
        let Y = K === "" ? "" : `with ${K.trim()}() `,
            z = r3K.bind(null, Y, q.toString());
        Object.defineProperty(z, "name", a3K), Object.defineProperty(A, "toString", {
            ...o3K,
            value: z
        })
    }
// @from(Ln 30771, Col 4)
B_A = E(() => {
    o3K = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), a3K = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name")
})
// @from(Ln 30774, Col 4)
S11
// @from(Ln 30774, Col 9)
g_A = (A, q = {}) => {
        if (typeof A !== "function") throw TypeError("Expected a function");
        let K, Y = 0,
            z = A.displayName || A.name || "<anonymous>",
            _ = function(...w) {
                if (S11.set(_, ++Y), Y === 1) K = A.apply(this, w), A = null;
                else if (q.throw === !0) throw Error(`Function \`${z}\` can only be called once`);
                return K
            };
        return yd1(_, A), S11.set(_, Y), _
    }
// @from(Ln 30785, Col 4)
F_A
// @from(Ln 30786, Col 4)
p_A = E(() => {
    B_A();
    S11 = new WeakMap;
    g_A.callCount = (A) => {
        if (!S11.has(A)) throw Error(`The given function \`${A.name}\` is not wrapped by the \`onetime\` package`);
        return S11.get(A)
    };
    F_A = g_A
})
// @from(Ln 30795, Col 4)
Q_A = () => {
        let A = Ld1 - U_A + 1;
        return Array.from({
            length: A
        }, t3K)
    }
// @from(Ln 30801, Col 4)
t3K = (A, q) => ({
        name: `SIGRT${q+1}`,
        number: U_A + q,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
    })
// @from(Ln 30808, Col 4)
U_A = 34
// @from(Ln 30809, Col 4)
Ld1 = 64
// @from(Ln 30810, Col 4)
d_A