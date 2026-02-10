
// @from(Ln 212802, Col 4)
MJA = R((uh7) => {
    Object.defineProperty(uh7, "__esModule", {
        value: !0
    });
    var mH6 = tL(),
        wh = p5(),
        V_9 = Jp(),
        FH6 = dY(),
        N_9 = {
            message: "must NOT have additional properties",
            params: ({
                params: A
            }) => wh._`{additionalProperty: ${A.additionalProperty}}`
        },
        T_9 = {
            keyword: "additionalProperties",
            type: ["object"],
            schemaType: ["boolean", "object"],
            allowUndefined: !0,
            trackErrors: !0,
            error: N_9,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    errsCount: w,
                    it: H
                } = A;
                if (!w) throw Error("ajv implementation error");
                let {
                    allErrors: $,
                    opts: O
                } = H;
                if (H.props = !0, O.removeAdditional !== "all" && (0, FH6.alwaysValidSchema)(H, K)) return;
                let _ = (0, mH6.allSchemaProperties)(Y.properties),
                    J = (0, mH6.allSchemaProperties)(Y.patternProperties);
                X(), A.ok(wh._`${w} === ${V_9.default.errors}`);

                function X() {
                    q.forIn("key", z, (W) => {
                        if (!_.length && !J.length) M(W);
                        else q.if(D(W), () => M(W))
                    })
                }

                function D(W) {
                    let G;
                    if (_.length > 8) {
                        let f = (0, FH6.schemaRefOrVal)(H, Y.properties, "properties");
                        G = (0, mH6.isOwnProperty)(q, f, W)
                    } else if (_.length) G = (0, wh.or)(..._.map((f) => wh._`${W} === ${f}`));
                    else G = wh.nil;
                    if (J.length) G = (0, wh.or)(G, ...J.map((f) => wh._`${(0,mH6.usePattern)(A,f)}.test(${W})`));
                    return (0, wh.not)(G)
                }

                function j(W) {
                    q.code(wh._`delete ${z}[${W}]`)
                }

                function M(W) {
                    if (O.removeAdditional === "all" || O.removeAdditional && K === !1) {
                        j(W);
                        return
                    }
                    if (K === !1) {
                        if (A.setParams({
                                additionalProperty: W
                            }), A.error(), !$) q.break();
                        return
                    }
                    if (typeof K == "object" && !(0, FH6.alwaysValidSchema)(H, K)) {
                        let G = q.name("valid");
                        if (O.removeAdditional === "failing") P(W, G, !1), q.if((0, wh.not)(G), () => {
                            A.reset(), j(W)
                        });
                        else if (P(W, G), !$) q.if((0, wh.not)(G), () => q.break())
                    }
                }

                function P(W, G, f) {
                    let Z = {
                        keyword: "additionalProperties",
                        dataProp: W,
                        dataPropType: FH6.Type.Str
                    };
                    if (f === !1) Object.assign(Z, {
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    });
                    A.subschema(Z, G)
                }
            }
        };
    uh7.default = T_9
})
// @from(Ln 212901, Col 4)
Qh7 = R((Fh7) => {
    Object.defineProperty(Fh7, "__esModule", {
        value: !0
    });
    var E_9 = Pb1(),
        Bh7 = tL(),
        PJA = dY(),
        mh7 = MJA(),
        k_9 = {
            keyword: "properties",
            type: "object",
            schemaType: "object",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    it: w
                } = A;
                if (w.opts.removeAdditional === "all" && Y.additionalProperties === void 0) mh7.default.code(new E_9.KeywordCxt(w, mh7.default, "additionalProperties"));
                let H = (0, Bh7.allSchemaProperties)(K);
                for (let X of H) w.definedProperties.add(X);
                if (w.opts.unevaluated && H.length && w.props !== !0) w.props = PJA.mergeEvaluated.props(q, (0, PJA.toHash)(H), w.props);
                let $ = H.filter((X) => !(0, PJA.alwaysValidSchema)(w, K[X]));
                if ($.length === 0) return;
                let O = q.name("valid");
                for (let X of $) {
                    if (_(X)) J(X);
                    else {
                        if (q.if((0, Bh7.propertyInData)(q, z, X, w.opts.ownProperties)), J(X), !w.allErrors) q.else().var(O, !0);
                        q.endIf()
                    }
                    A.it.definedProperties.add(X), A.ok(O)
                }

                function _(X) {
                    return w.opts.useDefaults && !w.compositeRule && K[X].default !== void 0
                }

                function J(X) {
                    A.subschema({
                        keyword: "properties",
                        schemaProp: X,
                        dataProp: X
                    }, O)
                }
            }
        };
    Fh7.default = k_9
})
// @from(Ln 212952, Col 4)
ch7 = R((dh7) => {
    Object.defineProperty(dh7, "__esModule", {
        value: !0
    });
    var gh7 = tL(),
        QH6 = p5(),
        Uh7 = dY(),
        ph7 = dY(),
        R_9 = {
            keyword: "patternProperties",
            type: "object",
            schemaType: "object",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    data: Y,
                    parentSchema: z,
                    it: w
                } = A, {
                    opts: H
                } = w, $ = (0, gh7.allSchemaProperties)(K), O = $.filter((P) => (0, Uh7.alwaysValidSchema)(w, K[P]));
                if ($.length === 0 || O.length === $.length && (!w.opts.unevaluated || w.props === !0)) return;
                let _ = H.strictSchema && !H.allowMatchingProperties && z.properties,
                    J = q.name("valid");
                if (w.props !== !0 && !(w.props instanceof QH6.Name)) w.props = (0, ph7.evaluatedPropsToName)(q, w.props);
                let {
                    props: X
                } = w;
                D();

                function D() {
                    for (let P of $) {
                        if (_) j(P);
                        if (w.allErrors) M(P);
                        else q.var(J, !0), M(P), q.if(J)
                    }
                }

                function j(P) {
                    for (let W in _)
                        if (new RegExp(P).test(W))(0, Uh7.checkStrictMode)(w, `property ${W} matches pattern ${P} (use allowMatchingProperties)`)
                }

                function M(P) {
                    q.forIn("key", Y, (W) => {
                        q.if(QH6._`${(0,gh7.usePattern)(A,P)}.test(${W})`, () => {
                            let G = O.includes(P);
                            if (!G) A.subschema({
                                keyword: "patternProperties",
                                schemaProp: P,
                                dataProp: W,
                                dataPropType: ph7.Type.Str
                            }, J);
                            if (w.opts.unevaluated && X !== !0) q.assign(QH6._`${X}[${W}]`, !0);
                            else if (!G && !w.allErrors) q.if((0, QH6.not)(J), () => q.break())
                        })
                    })
                }
            }
        };
    dh7.default = R_9
})
// @from(Ln 213015, Col 4)
ih7 = R((lh7) => {
    Object.defineProperty(lh7, "__esModule", {
        value: !0
    });
    var C_9 = dY(),
        S_9 = {
            keyword: "not",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    it: Y
                } = A;
                if ((0, C_9.alwaysValidSchema)(Y, K)) {
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
    lh7.default = S_9
})
// @from(Ln 213048, Col 4)
rh7 = R((nh7) => {
    Object.defineProperty(nh7, "__esModule", {
        value: !0
    });
    var I_9 = tL(),
        x_9 = {
            keyword: "anyOf",
            schemaType: "array",
            trackErrors: !0,
            code: I_9.validateUnion,
            error: {
                message: "must match a schema in anyOf"
            }
        };
    nh7.default = x_9
})
// @from(Ln 213064, Col 4)
ah7 = R((oh7) => {
    Object.defineProperty(oh7, "__esModule", {
        value: !0
    });
    var gH6 = p5(),
        u_9 = dY(),
        B_9 = {
            message: "must match exactly one schema in oneOf",
            params: ({
                params: A
            }) => gH6._`{passingSchemas: ${A.passing}}`
        },
        m_9 = {
            keyword: "oneOf",
            schemaType: "array",
            trackErrors: !0,
            error: B_9,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    it: z
                } = A;
                if (!Array.isArray(K)) throw Error("ajv implementation error");
                if (z.opts.discriminator && Y.discriminator) return;
                let w = K,
                    H = q.let("valid", !1),
                    $ = q.let("passing", null),
                    O = q.name("_valid");
                A.setParams({
                    passing: $
                }), q.block(_), A.result(H, () => A.reset(), () => A.error(!0));

                function _() {
                    w.forEach((J, X) => {
                        let D;
                        if ((0, u_9.alwaysValidSchema)(z, J)) q.var(O, !0);
                        else D = A.subschema({
                            keyword: "oneOf",
                            schemaProp: X,
                            compositeRule: !0
                        }, O);
                        if (X > 0) q.if(gH6._`${O} && ${H}`).assign(H, !1).assign($, gH6._`[${$}, ${X}]`).else();
                        q.if(O, () => {
                            if (q.assign(H, !0), q.assign($, X), D) A.mergeEvaluated(D, gH6.Name)
                        })
                    })
                }
            }
        };
    oh7.default = m_9
})
// @from(Ln 213117, Col 4)
th7 = R((sh7) => {
    Object.defineProperty(sh7, "__esModule", {
        value: !0
    });
    var Q_9 = dY(),
        g_9 = {
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
                K.forEach((w, H) => {
                    if ((0, Q_9.alwaysValidSchema)(Y, w)) return;
                    let $ = A.subschema({
                        keyword: "allOf",
                        schemaProp: H
                    }, z);
                    A.ok(z), A.mergeEvaluated($)
                })
            }
        };
    sh7.default = g_9
})
// @from(Ln 213145, Col 4)
KI7 = R((qI7) => {
    Object.defineProperty(qI7, "__esModule", {
        value: !0
    });
    var UH6 = p5(),
        AI7 = dY(),
        p_9 = {
            message: ({
                params: A
            }) => UH6.str`must match "${A.ifClause}" schema`,
            params: ({
                params: A
            }) => UH6._`{failingKeyword: ${A.ifClause}}`
        },
        d_9 = {
            keyword: "if",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            error: p_9,
            code(A) {
                let {
                    gen: q,
                    parentSchema: K,
                    it: Y
                } = A;
                if (K.then === void 0 && K.else === void 0)(0, AI7.checkStrictMode)(Y, '"if" without "then" and "else" is ignored');
                let z = eh7(Y, "then"),
                    w = eh7(Y, "else");
                if (!z && !w) return;
                let H = q.let("valid", !0),
                    $ = q.name("_valid");
                if (O(), A.reset(), z && w) {
                    let J = q.let("ifClause");
                    A.setParams({
                        ifClause: J
                    }), q.if($, _("then", J), _("else", J))
                } else if (z) q.if($, _("then"));
                else q.if((0, UH6.not)($), _("else"));
                A.pass(H, () => A.error(!0));

                function O() {
                    let J = A.subschema({
                        keyword: "if",
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    }, $);
                    A.mergeEvaluated(J)
                }

                function _(J, X) {
                    return () => {
                        let D = A.subschema({
                            keyword: J
                        }, $);
                        if (q.assign(H, $), A.mergeValidEvaluated(D, H), X) q.assign(X, UH6._`${J}`);
                        else A.setParams({
                            ifClause: J
                        })
                    }
                }
            }
        };

    function eh7(A, q) {
        let K = A.schema[q];
        return K !== void 0 && !(0, AI7.alwaysValidSchema)(A, K)
    }
    qI7.default = d_9
})
// @from(Ln 213215, Col 4)
zI7 = R((YI7) => {
    Object.defineProperty(YI7, "__esModule", {
        value: !0
    });
    var l_9 = dY(),
        i_9 = {
            keyword: ["then", "else"],
            schemaType: ["object", "boolean"],
            code({
                keyword: A,
                parentSchema: q,
                it: K
            }) {
                if (q.if === void 0)(0, l_9.checkStrictMode)(K, `"${A}" without "if" is ignored`)
            }
        };
    YI7.default = i_9
})
// @from(Ln 213233, Col 4)
HI7 = R((wI7) => {
    Object.defineProperty(wI7, "__esModule", {
        value: !0
    });
    var r_9 = XJA(),
        o_9 = Vh7(),
        a_9 = DJA(),
        s_9 = vh7(),
        t_9 = kh7(),
        e_9 = hh7(),
        AJ9 = bh7(),
        qJ9 = MJA(),
        KJ9 = Qh7(),
        YJ9 = ch7(),
        zJ9 = ih7(),
        wJ9 = rh7(),
        HJ9 = ah7(),
        $J9 = th7(),
        OJ9 = KI7(),
        _J9 = zI7();

    function JJ9(A = !1) {
        let q = [zJ9.default, wJ9.default, HJ9.default, $J9.default, OJ9.default, _J9.default, AJ9.default, qJ9.default, e_9.default, KJ9.default, YJ9.default];
        if (A) q.push(o_9.default, s_9.default);
        else q.push(r_9.default, a_9.default);
        return q.push(t_9.default), q
    }
    wI7.default = JJ9
})
// @from(Ln 213262, Col 4)
OI7 = R(($I7) => {
    Object.defineProperty($I7, "__esModule", {
        value: !0
    });
    var GJ = p5(),
        DJ9 = {
            message: ({
                schemaCode: A
            }) => GJ.str`must match format "${A}"`,
            params: ({
                schemaCode: A
            }) => GJ._`{format: ${A}}`
        },
        jJ9 = {
            keyword: "format",
            type: ["number", "string"],
            schemaType: "string",
            $data: !0,
            error: DJ9,
            code(A, q) {
                let {
                    gen: K,
                    data: Y,
                    $data: z,
                    schema: w,
                    schemaCode: H,
                    it: $
                } = A, {
                    opts: O,
                    errSchemaPath: _,
                    schemaEnv: J,
                    self: X
                } = $;
                if (!O.validateFormats) return;
                if (z) D();
                else j();

                function D() {
                    let M = K.scopeValue("formats", {
                            ref: X.formats,
                            code: O.code.formats
                        }),
                        P = K.const("fDef", GJ._`${M}[${H}]`),
                        W = K.let("fType"),
                        G = K.let("format");
                    K.if(GJ._`typeof ${P} == "object" && !(${P} instanceof RegExp)`, () => K.assign(W, GJ._`${P}.type || "string"`).assign(G, GJ._`${P}.validate`), () => K.assign(W, GJ._`"string"`).assign(G, P)), A.fail$data((0, GJ.or)(f(), Z()));

                    function f() {
                        if (O.strictSchema === !1) return GJ.nil;
                        return GJ._`${H} && !${G}`
                    }

                    function Z() {
                        let N = J.$async ? GJ._`(${P}.async ? await ${G}(${Y}) : ${G}(${Y}))` : GJ._`${G}(${Y})`,
                            T = GJ._`(typeof ${G} == "function" ? ${N} : ${G}.test(${Y}))`;
                        return GJ._`${G} && ${G} !== true && ${W} === ${q} && !${T}`
                    }
                }

                function j() {
                    let M = X.formats[w];
                    if (!M) {
                        f();
                        return
                    }
                    if (M === !0) return;
                    let [P, W, G] = Z(M);
                    if (P === q) A.pass(N());

                    function f() {
                        if (O.strictSchema === !1) {
                            X.logger.warn(T());
                            return
                        }
                        throw Error(T());

                        function T() {
                            return `unknown format "${w}" ignored in schema at path "${_}"`
                        }
                    }

                    function Z(T) {
                        let k = T instanceof RegExp ? (0, GJ.regexpCode)(T) : O.code.formats ? GJ._`${O.code.formats}${(0,GJ.getProperty)(w)}` : void 0,
                            y = K.scopeValue("formats", {
                                key: w,
                                ref: T,
                                code: k
                            });
                        if (typeof T == "object" && !(T instanceof RegExp)) return [T.type || "string", T.validate, GJ._`${y}.validate`];
                        return ["string", T, y]
                    }

                    function N() {
                        if (typeof M == "object" && !(M instanceof RegExp) && M.async) {
                            if (!J.$async) throw Error("async format in sync schema");
                            return GJ._`await ${G}(${Y})`
                        }
                        return typeof W == "function" ? GJ._`${G}(${Y})` : GJ._`${G}.test(${Y})`
                    }
                }
            }
        };
    $I7.default = jJ9
})
// @from(Ln 213366, Col 4)
JI7 = R((_I7) => {
    Object.defineProperty(_I7, "__esModule", {
        value: !0
    });
    var PJ9 = OI7(),
        WJ9 = [PJ9.default];
    _I7.default = WJ9
})
// @from(Ln 213374, Col 4)
jI7 = R((XI7) => {
    Object.defineProperty(XI7, "__esModule", {
        value: !0
    });
    XI7.contentVocabulary = XI7.metadataVocabulary = void 0;
    XI7.metadataVocabulary = ["title", "description", "default", "deprecated", "readOnly", "writeOnly", "examples"];
    XI7.contentVocabulary = ["contentMediaType", "contentEncoding", "contentSchema"]
})
// @from(Ln 213382, Col 4)
WI7 = R((PI7) => {
    Object.defineProperty(PI7, "__esModule", {
        value: !0
    });
    var fJ9 = FS7(),
        VJ9 = Xh7(),
        NJ9 = HI7(),
        TJ9 = JI7(),
        MI7 = jI7(),
        vJ9 = [fJ9.default, VJ9.default, (0, NJ9.default)(), TJ9.default, MI7.metadataVocabulary, MI7.contentVocabulary];
    PI7.default = vJ9
})
// @from(Ln 213394, Col 4)
VI7 = R((ZI7) => {
    Object.defineProperty(ZI7, "__esModule", {
        value: !0
    });
    ZI7.DiscrError = void 0;
    var GI7;
    (function(A) {
        A.Tag = "tag", A.Mapping = "mapping"
    })(GI7 || (ZI7.DiscrError = GI7 = {}))
})
// @from(Ln 213404, Col 4)
vI7 = R((TI7) => {
    Object.defineProperty(TI7, "__esModule", {
        value: !0
    });
    var v01 = p5(),
        WJA = VI7(),
        NI7 = vH6(),
        kJ9 = Wb1(),
        LJ9 = dY(),
        RJ9 = {
            message: ({
                params: {
                    discrError: A,
                    tagName: q
                }
            }) => A === WJA.DiscrError.Tag ? `tag "${q}" must be string` : `value of tag "${q}" must be in oneOf`,
            params: ({
                params: {
                    discrError: A,
                    tag: q,
                    tagName: K
                }
            }) => v01._`{error: ${A}, tag: ${K}, tagValue: ${q}}`
        },
        yJ9 = {
            keyword: "discriminator",
            type: "object",
            schemaType: "object",
            error: RJ9,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    schema: Y,
                    parentSchema: z,
                    it: w
                } = A, {
                    oneOf: H
                } = z;
                if (!w.opts.discriminator) throw Error("discriminator: requires discriminator option");
                let $ = Y.propertyName;
                if (typeof $ != "string") throw Error("discriminator: requires propertyName");
                if (Y.mapping) throw Error("discriminator: mapping is not supported");
                if (!H) throw Error("discriminator: requires oneOf keyword");
                let O = q.let("valid", !1),
                    _ = q.const("tag", v01._`${K}${(0,v01.getProperty)($)}`);
                q.if(v01._`typeof ${_} == "string"`, () => J(), () => A.error(!1, {
                    discrError: WJA.DiscrError.Tag,
                    tag: _,
                    tagName: $
                })), A.ok(O);

                function J() {
                    let j = D();
                    q.if(!1);
                    for (let M in j) q.elseIf(v01._`${_} === ${M}`), q.assign(O, X(j[M]));
                    q.else(), A.error(!1, {
                        discrError: WJA.DiscrError.Mapping,
                        tag: _,
                        tagName: $
                    }), q.endIf()
                }

                function X(j) {
                    let M = q.name("valid"),
                        P = A.subschema({
                            keyword: "oneOf",
                            schemaProp: j
                        }, M);
                    return A.mergeEvaluated(P, v01.Name), M
                }

                function D() {
                    var j;
                    let M = {},
                        P = G(z),
                        W = !0;
                    for (let N = 0; N < H.length; N++) {
                        let T = H[N];
                        if ((T === null || T === void 0 ? void 0 : T.$ref) && !(0, LJ9.schemaHasRulesButRef)(T, w.self.RULES)) {
                            let y = T.$ref;
                            if (T = NI7.resolveRef.call(w.self, w.schemaEnv.root, w.baseId, y), T instanceof NI7.SchemaEnv) T = T.schema;
                            if (T === void 0) throw new kJ9.default(w.opts.uriResolver, w.baseId, y)
                        }
                        let k = (j = T === null || T === void 0 ? void 0 : T.properties) === null || j === void 0 ? void 0 : j[$];
                        if (typeof k != "object") throw Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${$}"`);
                        W = W && (P || G(T)), f(k, N)
                    }
                    if (!W) throw Error(`discriminator: "${$}" must be required`);
                    return M;

                    function G({
                        required: N
                    }) {
                        return Array.isArray(N) && N.includes($)
                    }

                    function f(N, T) {
                        if (N.const) Z(N.const, T);
                        else if (N.enum)
                            for (let k of N.enum) Z(k, T);
                        else throw Error(`discriminator: "properties/${$}" must have "const" or "enum"`)
                    }

                    function Z(N, T) {
                        if (typeof N != "string" || N in M) throw Error(`discriminator: "${$}" values must be unique strings`);
                        M[N] = T
                    }
                }
            }
        };
    TI7.default = yJ9
})
// @from(Ln 213517, Col 4)
EI7 = R((Uzw, SJ9) => {
    SJ9.exports = {
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
// @from(Ln 213737, Col 4)
dH6 = R((dV, GJA) => {
    Object.defineProperty(dV, "__esModule", {
        value: !0
    });
    dV.MissingRefError = dV.ValidationError = dV.CodeGen = dV.Name = dV.nil = dV.stringify = dV.str = dV._ = dV.KeywordCxt = dV.Ajv = void 0;
    var hJ9 = yS7(),
        IJ9 = WI7(),
        xJ9 = vI7(),
        kI7 = EI7(),
        bJ9 = ["/properties"],
        pH6 = "http://json-schema.org/draft-07/schema";
    class yb1 extends hJ9.default {
        _addVocabularies() {
            if (super._addVocabularies(), IJ9.default.forEach((A) => this.addVocabulary(A)), this.opts.discriminator) this.addKeyword(xJ9.default)
        }
        _addDefaultMetaSchema() {
            if (super._addDefaultMetaSchema(), !this.opts.meta) return;
            let A = this.opts.$data ? this.$dataMetaSchema(kI7, bJ9) : kI7;
            this.addMetaSchema(A, pH6, !1), this.refs["http://json-schema.org/schema"] = pH6
        }
        defaultMeta() {
            return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(pH6) ? pH6 : void 0)
        }
    }
    dV.Ajv = yb1;
    GJA.exports = dV = yb1;
    GJA.exports.Ajv = yb1;
    Object.defineProperty(dV, "__esModule", {
        value: !0
    });
    dV.default = yb1;
    var uJ9 = Pb1();
    Object.defineProperty(dV, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return uJ9.KeywordCxt
        }
    });
    var E01 = p5();
    Object.defineProperty(dV, "_", {
        enumerable: !0,
        get: function() {
            return E01._
        }
    });
    Object.defineProperty(dV, "str", {
        enumerable: !0,
        get: function() {
            return E01.str
        }
    });
    Object.defineProperty(dV, "stringify", {
        enumerable: !0,
        get: function() {
            return E01.stringify
        }
    });
    Object.defineProperty(dV, "nil", {
        enumerable: !0,
        get: function() {
            return E01.nil
        }
    });
    Object.defineProperty(dV, "Name", {
        enumerable: !0,
        get: function() {
            return E01.Name
        }
    });
    Object.defineProperty(dV, "CodeGen", {
        enumerable: !0,
        get: function() {
            return E01.CodeGen
        }
    });
    var BJ9 = NH6();
    Object.defineProperty(dV, "ValidationError", {
        enumerable: !0,
        get: function() {
            return BJ9.default
        }
    });
    var mJ9 = Wb1();
    Object.defineProperty(dV, "MissingRefError", {
        enumerable: !0,
        get: function() {
            return mJ9.default
        }
    })
})
// @from(Ln 213827, Col 4)
uI7 = R((xI7) => {
    Object.defineProperty(xI7, "__esModule", {
        value: !0
    });
    xI7.formatNames = xI7.fastFormats = xI7.fullFormats = void 0;

    function NB(A, q) {
        return {
            validate: A,
            compare: q
        }
    }
    xI7.fullFormats = {
        date: NB(CI7, NJA),
        time: NB(fJA(!0), TJA),
        "date-time": NB(LI7(!0), hI7),
        "iso-time": NB(fJA(), SI7),
        "iso-date-time": NB(LI7(), II7),
        duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
        uri: lJ9,
        "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
        "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
        url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
        email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
        hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
        ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
        ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
        regex: tJ9,
        uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
        "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
        "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
        "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
        byte: iJ9,
        int32: {
            type: "number",
            validate: oJ9
        },
        int64: {
            type: "number",
            validate: aJ9
        },
        float: {
            type: "number",
            validate: yI7
        },
        double: {
            type: "number",
            validate: yI7
        },
        password: !0,
        binary: !0
    };
    xI7.fastFormats = {
        ...xI7.fullFormats,
        date: NB(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, NJA),
        time: NB(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, TJA),
        "date-time": NB(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, hI7),
        "iso-time": NB(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, SI7),
        "iso-date-time": NB(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, II7),
        uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
        "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
        email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    xI7.formatNames = Object.keys(xI7.fullFormats);

    function gJ9(A) {
        return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }
    var UJ9 = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
        pJ9 = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function CI7(A) {
        let q = UJ9.exec(A);
        if (!q) return !1;
        let K = +q[1],
            Y = +q[2],
            z = +q[3];
        return Y >= 1 && Y <= 12 && z >= 1 && z <= (Y === 2 && gJ9(K) ? 29 : pJ9[Y])
    }

    function NJA(A, q) {
        if (!(A && q)) return;
        if (A > q) return 1;
        if (A < q) return -1;
        return 0
    }
    var ZJA = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

    function fJA(A) {
        return function(K) {
            let Y = ZJA.exec(K);
            if (!Y) return !1;
            let z = +Y[1],
                w = +Y[2],
                H = +Y[3],
                $ = Y[4],
                O = Y[5] === "-" ? -1 : 1,
                _ = +(Y[6] || 0),
                J = +(Y[7] || 0);
            if (_ > 23 || J > 59 || A && !$) return !1;
            if (z <= 23 && w <= 59 && H < 60) return !0;
            let X = w - J * O,
                D = z - _ * O - (X < 0 ? 1 : 0);
            return (D === 23 || D === -1) && (X === 59 || X === -1) && H < 61
        }
    }

    function TJA(A, q) {
        if (!(A && q)) return;
        let K = new Date("2020-01-01T" + A).valueOf(),
            Y = new Date("2020-01-01T" + q).valueOf();
        if (!(K && Y)) return;
        return K - Y
    }

    function SI7(A, q) {
        if (!(A && q)) return;
        let K = ZJA.exec(A),
            Y = ZJA.exec(q);
        if (!(K && Y)) return;
        if (A = K[1] + K[2] + K[3], q = Y[1] + Y[2] + Y[3], A > q) return 1;
        if (A < q) return -1;
        return 0
    }
    var VJA = /t|\s/i;

    function LI7(A) {
        let q = fJA(A);
        return function(Y) {
            let z = Y.split(VJA);
            return z.length === 2 && CI7(z[0]) && q(z[1])
        }
    }

    function hI7(A, q) {
        if (!(A && q)) return;
        let K = new Date(A).valueOf(),
            Y = new Date(q).valueOf();
        if (!(K && Y)) return;
        return K - Y
    }

    function II7(A, q) {
        if (!(A && q)) return;
        let [K, Y] = A.split(VJA), [z, w] = q.split(VJA), H = NJA(K, z);
        if (H === void 0) return;
        return H || TJA(Y, w)
    }
    var dJ9 = /\/|:/,
        cJ9 = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;

    function lJ9(A) {
        return dJ9.test(A) && cJ9.test(A)
    }
    var RI7 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;

    function iJ9(A) {
        return RI7.lastIndex = 0, RI7.test(A)
    }
    var nJ9 = -2147483648,
        rJ9 = 2147483647;

    function oJ9(A) {
        return Number.isInteger(A) && A <= rJ9 && A >= nJ9
    }

    function aJ9(A) {
        return Number.isInteger(A)
    }

    function yI7() {
        return !0
    }
    var sJ9 = /[^\\]\\Z/;

    function tJ9(A) {
        if (sJ9.test(A)) return !1;
        try {
            return new RegExp(A), !0
        } catch (q) {
            return !1
        }
    }
})
// @from(Ln 214011, Col 4)
mI7 = R((BI7) => {
    Object.defineProperty(BI7, "__esModule", {
        value: !0
    });
    BI7.formatLimitDefinition = void 0;
    var AX9 = dH6(),
        Hh = p5(),
        za = Hh.operators,
        cH6 = {
            formatMaximum: {
                okStr: "<=",
                ok: za.LTE,
                fail: za.GT
            },
            formatMinimum: {
                okStr: ">=",
                ok: za.GTE,
                fail: za.LT
            },
            formatExclusiveMaximum: {
                okStr: "<",
                ok: za.LT,
                fail: za.GTE
            },
            formatExclusiveMinimum: {
                okStr: ">",
                ok: za.GT,
                fail: za.LTE
            }
        },
        qX9 = {
            message: ({
                keyword: A,
                schemaCode: q
            }) => Hh.str`should be ${cH6[A].okStr} ${q}`,
            params: ({
                keyword: A,
                schemaCode: q
            }) => Hh._`{comparison: ${cH6[A].okStr}, limit: ${q}}`
        };
    BI7.formatLimitDefinition = {
        keyword: Object.keys(cH6),
        type: "string",
        schemaType: "string",
        $data: !0,
        error: qX9,
        code(A) {
            let {
                gen: q,
                data: K,
                schemaCode: Y,
                keyword: z,
                it: w
            } = A, {
                opts: H,
                self: $
            } = w;
            if (!H.validateFormats) return;
            let O = new AX9.KeywordCxt(w, $.RULES.all.format.definition, "format");
            if (O.$data) _();
            else J();

            function _() {
                let D = q.scopeValue("formats", {
                        ref: $.formats,
                        code: H.code.formats
                    }),
                    j = q.const("fmt", Hh._`${D}[${O.schemaCode}]`);
                A.fail$data((0, Hh.or)(Hh._`typeof ${j} != "object"`, Hh._`${j} instanceof RegExp`, Hh._`typeof ${j}.compare != "function"`, X(j)))
            }

            function J() {
                let D = O.schema,
                    j = $.formats[D];
                if (!j || j === !0) return;
                if (typeof j != "object" || j instanceof RegExp || typeof j.compare != "function") throw Error(`"${z}": format "${D}" does not define "compare" function`);
                let M = q.scopeValue("formats", {
                    key: D,
                    ref: j,
                    code: H.code.formats ? Hh._`${H.code.formats}${(0,Hh.getProperty)(D)}` : void 0
                });
                A.fail$data(X(M))
            }

            function X(D) {
                return Hh._`${D}.compare(${K}, ${Y}) ${cH6[z].fail} 0`
            }
        },
        dependencies: ["format"]
    };
    var KX9 = (A) => {
        return A.addKeyword(BI7.formatLimitDefinition), A
    };
    BI7.default = KX9
})
// @from(Ln 214106, Col 4)
UI7 = R((Cb1, gI7) => {
    Object.defineProperty(Cb1, "__esModule", {
        value: !0
    });
    var k01 = uI7(),
        zX9 = mI7(),
        kJA = p5(),
        FI7 = new kJA.Name("fullFormats"),
        wX9 = new kJA.Name("fastFormats"),
        LJA = (A, q = {
            keywords: !0
        }) => {
            if (Array.isArray(q)) return QI7(A, q, k01.fullFormats, FI7), A;
            let [K, Y] = q.mode === "fast" ? [k01.fastFormats, wX9] : [k01.fullFormats, FI7], z = q.formats || k01.formatNames;
            if (QI7(A, z, K, Y), q.keywords)(0, zX9.default)(A);
            return A
        };
    LJA.get = (A, q = "full") => {
        let Y = (q === "fast" ? k01.fastFormats : k01.fullFormats)[A];
        if (!Y) throw Error(`Unknown format "${A}"`);
        return Y
    };

    function QI7(A, q, K, Y) {
        var z, w;
        (z = (w = A.opts.code).formats) !== null && z !== void 0 || (w.formats = kJA._`require("ajv-formats/dist/formats").${Y}`);
        for (let H of q) A.addFormat(H, K[H])
    }
    gI7.exports = Cb1 = LJA;
    Object.defineProperty(Cb1, "__esModule", {
        value: !0
    });
    Cb1.default = LJA
})
// @from(Ln 214141, Col 0)
function HX9() {
    let A = new pI7.Ajv({
        strict: !1,
        validateFormats: !0,
        validateSchema: !1,
        allErrors: !0
    });
    return dI7.default(A), A
}
// @from(Ln 214150, Col 0)
class Sb1 {
    constructor(A) {
        this._ajv = A !== null && A !== void 0 ? A : HX9()
    }
    getValidator(A) {
        var q;
        let K = "$id" in A && typeof A.$id === "string" ? (q = this._ajv.getSchema(A.$id)) !== null && q !== void 0 ? q : this._ajv.compile(A) : this._ajv.compile(A);
        return (Y) => {
            if (K(Y)) return {
                valid: !0,
                data: Y,
                errorMessage: void 0
            };
            else return {
                valid: !1,
                data: void 0,
                errorMessage: this._ajv.errorsText(K.errors)
            }
        }
    }
}
// @from(Ln 214171, Col 4)
pI7
// @from(Ln 214171, Col 9)
dI7
// @from(Ln 214172, Col 4)
RJA = v(() => {
    pI7 = o(dH6(), 1), dI7 = o(UI7(), 1)
})
// @from(Ln 214175, Col 0)
class yJA {
    constructor(A) {
        this._client = A
    }
    async * callToolStream(A, q = ZZ, K) {
        var Y;
        let z = this._client,
            w = {
                ...K,
                task: (Y = K === null || K === void 0 ? void 0 : K.task) !== null && Y !== void 0 ? Y : z.isToolTask(A.name) ? {} : void 0
            },
            H = z.requestStream({
                method: "tools/call",
                params: A
            }, q, w),
            $ = z.getToolOutputValidator(A.name);
        for await (let O of H) {
            if (O.type === "result" && $) {
                let _ = O.result;
                if (!_.structuredContent && !_.isError) {
                    yield {
                        type: "error",
                        error: new Eq(VK.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`)
                    };
                    return
                }
                if (_.structuredContent) try {
                    let J = $(_.structuredContent);
                    if (!J.valid) {
                        yield {
                            type: "error",
                            error: new Eq(VK.InvalidParams, `Structured content does not match the tool's output schema: ${J.errorMessage}`)
                        };
                        return
                    }
                } catch (J) {
                    if (J instanceof Eq) {
                        yield {
                            type: "error",
                            error: J
                        };
                        return
                    }
                    yield {
                        type: "error",
                        error: new Eq(VK.InvalidParams, `Failed to validate structured content: ${J instanceof Error?J.message:String(J)}`)
                    };
                    return
                }
            }
            yield O
        }
    }
    async getTask(A, q) {
        return this._client.getTask({
            taskId: A
        }, q)
    }
    async getTaskResult(A, q, K) {
        return this._client.getTaskResult({
            taskId: A
        }, q, K)
    }
    async listTasks(A, q) {
        return this._client.listTasks(A ? {
            cursor: A
        } : void 0, q)
    }
    async cancelTask(A, q) {
        return this._client.cancelTask({
            taskId: A
        }, q)
    }
    requestStream(A, q, K) {
        return this._client.requestStream(A, q, K)
    }
}
// @from(Ln 214252, Col 4)
cI7 = v(() => {
    gD()
})
// @from(Ln 214256, Col 0)
function lH6(A, q, K) {
    var Y;
    if (!A) throw Error(`${K} does not support task creation (required for ${q})`);
    switch (q) {
        case "tools/call":
            if (!((Y = A.tools) === null || Y === void 0 ? void 0 : Y.call)) throw Error(`${K} does not support task creation for tools/call (required for ${q})`);
            break;
        default:
            break
    }
}
// @from(Ln 214268, Col 0)
function iH6(A, q, K) {
    var Y, z;
    if (!A) throw Error(`${K} does not support task creation (required for ${q})`);
    switch (q) {
        case "sampling/createMessage":
            if (!((Y = A.sampling) === null || Y === void 0 ? void 0 : Y.createMessage)) throw Error(`${K} does not support task creation for sampling/createMessage (required for ${q})`);
            break;
        case "elicitation/create":
            if (!((z = A.elicitation) === null || z === void 0 ? void 0 : z.create)) throw Error(`${K} does not support task creation for elicitation/create (required for ${q})`);
            break;
        default:
            break
    }
}
// @from(Ln 214283, Col 0)
function nH6(A, q) {
    if (!A || q === null || typeof q !== "object") return;
    if (A.type === "object" && A.properties && typeof A.properties === "object") {
        let K = q,
            Y = A.properties;
        for (let z of Object.keys(Y)) {
            let w = Y[z];
            if (K[z] === void 0 && Object.prototype.hasOwnProperty.call(w, "default")) K[z] = w.default;
            if (K[z] !== void 0) nH6(w, K[z])
        }
    }
    if (Array.isArray(A.anyOf))
        for (let K of A.anyOf) nH6(K, q);
    if (Array.isArray(A.oneOf))
        for (let K of A.oneOf) nH6(K, q)
}
// @from(Ln 214300, Col 0)
function $X9(A) {
    if (!A) return {
        supportsFormMode: !1,
        supportsUrlMode: !1
    };
    let q = A.form !== void 0,
        K = A.url !== void 0;
    return {
        supportsFormMode: q || !q && !K,
        supportsUrlMode: K
    }
}
// @from(Ln 214312, Col 4)
rH6
// @from(Ln 214313, Col 4)
lI7 = v(() => {
    k_A();
    gD();
    RJA();
    nx1();
    cI7();
    rH6 = class rH6 extends Hb1 {
        constructor(A, q) {
            var K, Y;
            super(q);
            this._clientInfo = A, this._cachedToolOutputValidators = new Map, this._cachedKnownTaskTools = new Set, this._cachedRequiredTaskTools = new Set, this._capabilities = (K = q === null || q === void 0 ? void 0 : q.capabilities) !== null && K !== void 0 ? K : {}, this._jsonSchemaValidator = (Y = q === null || q === void 0 ? void 0 : q.jsonSchemaValidator) !== null && Y !== void 0 ? Y : new Sb1
        }
        get experimental() {
            if (!this._experimental) this._experimental = {
                tasks: new yJA(this)
            };
            return this._experimental
        }
        registerCapabilities(A) {
            if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
            this._capabilities = HH6(this._capabilities, A)
        }
        setRequestHandler(A, q) {
            var K, Y, z;
            let w = X01(A),
                H = w === null || w === void 0 ? void 0 : w.method;
            if (!H) throw Error("Schema is missing a method literal");
            let $;
            if (oo(H)) {
                let _ = H,
                    J = (K = _._zod) === null || K === void 0 ? void 0 : K.def;
                $ = (Y = J === null || J === void 0 ? void 0 : J.value) !== null && Y !== void 0 ? Y : _.value
            } else {
                let _ = H,
                    J = _._def;
                $ = (z = J === null || J === void 0 ? void 0 : J.value) !== null && z !== void 0 ? z : _.value
            }
            if (typeof $ !== "string") throw Error("Schema method literal must be a string");
            let O = $;
            if (O === "elicitation/create") {
                let _ = async (J, X) => {
                    var D, j, M;
                    let P = GZ(vq1, J);
                    if (!P.success) {
                        let B = P.error instanceof Error ? P.error.message : String(P.error);
                        throw new Eq(VK.InvalidParams, `Invalid elicitation request: ${B}`)
                    }
                    let {
                        params: W
                    } = P.data, G = (D = W.mode) !== null && D !== void 0 ? D : "form", {
                        supportsFormMode: f,
                        supportsUrlMode: Z
                    } = $X9(this._capabilities.elicitation);
                    if (G === "form" && !f) throw new Eq(VK.InvalidParams, "Client does not support form-mode elicitation requests");
                    if (G === "url" && !Z) throw new Eq(VK.InvalidParams, "Client does not support URL-mode elicitation requests");
                    let N = await Promise.resolve(q(J, X));
                    if (W.task) {
                        let B = GZ($p, N);
                        if (!B.success) {
                            let S = B.error instanceof Error ? B.error.message : String(B.error);
                            throw new Eq(VK.InvalidParams, `Invalid task creation result: ${S}`)
                        }
                        return B.data
                    }
                    let T = GZ(M01, N);
                    if (!T.success) {
                        let B = T.error instanceof Error ? T.error.message : String(T.error);
                        throw new Eq(VK.InvalidParams, `Invalid elicitation result: ${B}`)
                    }
                    let k = T.data,
                        y = G === "form" ? W.requestedSchema : void 0;
                    if (G === "form" && k.action === "accept" && k.content && y) {
                        if ((M = (j = this._capabilities.elicitation) === null || j === void 0 ? void 0 : j.form) === null || M === void 0 ? void 0 : M.applyDefaults) try {
                            nH6(y, k.content)
                        } catch (B) {}
                    }
                    return k
                };
                return super.setRequestHandler(A, _)
            }
            if (O === "sampling/createMessage") {
                let _ = async (J, X) => {
                    let D = GZ(oOA, J);
                    if (!D.success) {
                        let W = D.error instanceof Error ? D.error.message : String(D.error);
                        throw new Eq(VK.InvalidParams, `Invalid sampling request: ${W}`)
                    }
                    let {
                        params: j
                    } = D.data, M = await Promise.resolve(q(J, X));
                    if (j.task) {
                        let W = GZ($p, M);
                        if (!W.success) {
                            let G = W.error instanceof Error ? W.error.message : String(W.error);
                            throw new Eq(VK.InvalidParams, `Invalid task creation result: ${G}`)
                        }
                        return W.data
                    }
                    let P = GZ(zb1, M);
                    if (!P.success) {
                        let W = P.error instanceof Error ? P.error.message : String(P.error);
                        throw new Eq(VK.InvalidParams, `Invalid sampling result: ${W}`)
                    }
                    return P.data
                };
                return super.setRequestHandler(A, _)
            }
            return super.setRequestHandler(A, q)
        }
        assertCapability(A, q) {
            var K;
            if (!((K = this._serverCapabilities) === null || K === void 0 ? void 0 : K[A])) throw Error(`Server does not support ${A} (required for ${q})`)
        }
        async connect(A, q) {
            if (await super.connect(A), A.sessionId !== void 0) return;
            try {
                let K = await this.request({
                    method: "initialize",
                    params: {
                        protocolVersion: ao,
                        capabilities: this._capabilities,
                        clientInfo: this._clientInfo
                    }
                }, BOA, q);
                if (K === void 0) throw Error(`Server sent invalid initialize result: ${K}`);
                if (!dw6.includes(K.protocolVersion)) throw Error(`Server's protocol version is not supported: ${K.protocolVersion}`);
                if (this._serverCapabilities = K.capabilities, this._serverVersion = K.serverInfo, A.setProtocolVersion) A.setProtocolVersion(K.protocolVersion);
                this._instructions = K.instructions, await this.notification({
                    method: "notifications/initialized"
                })
            } catch (K) {
                throw this.close(), K
            }
        }
        getServerCapabilities() {
            return this._serverCapabilities
        }
        getServerVersion() {
            return this._serverVersion
        }
        getInstructions() {
            return this._instructions
        }
        assertCapabilityForMethod(A) {
            var q, K, Y, z, w;
            switch (A) {
                case "logging/setLevel":
                    if (!((q = this._serverCapabilities) === null || q === void 0 ? void 0 : q.logging)) throw Error(`Server does not support logging (required for ${A})`);
                    break;
                case "prompts/get":
                case "prompts/list":
                    if (!((K = this._serverCapabilities) === null || K === void 0 ? void 0 : K.prompts)) throw Error(`Server does not support prompts (required for ${A})`);
                    break;
                case "resources/list":
                case "resources/templates/list":
                case "resources/read":
                case "resources/subscribe":
                case "resources/unsubscribe":
                    if (!((Y = this._serverCapabilities) === null || Y === void 0 ? void 0 : Y.resources)) throw Error(`Server does not support resources (required for ${A})`);
                    if (A === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw Error(`Server does not support resource subscriptions (required for ${A})`);
                    break;
                case "tools/call":
                case "tools/list":
                    if (!((z = this._serverCapabilities) === null || z === void 0 ? void 0 : z.tools)) throw Error(`Server does not support tools (required for ${A})`);
                    break;
                case "completion/complete":
                    if (!((w = this._serverCapabilities) === null || w === void 0 ? void 0 : w.completions)) throw Error(`Server does not support completions (required for ${A})`);
                    break;
                case "initialize":
                    break;
                case "ping":
                    break
            }
        }
        assertNotificationCapability(A) {
            var q;
            switch (A) {
                case "notifications/roots/list_changed":
                    if (!((q = this._capabilities.roots) === null || q === void 0 ? void 0 : q.listChanged)) throw Error(`Client does not support roots list changed notifications (required for ${A})`);
                    break;
                case "notifications/initialized":
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
                case "sampling/createMessage":
                    if (!this._capabilities.sampling) throw Error(`Client does not support sampling capability (required for ${A})`);
                    break;
                case "elicitation/create":
                    if (!this._capabilities.elicitation) throw Error(`Client does not support elicitation capability (required for ${A})`);
                    break;
                case "roots/list":
                    if (!this._capabilities.roots) throw Error(`Client does not support roots capability (required for ${A})`);
                    break;
                case "tasks/get":
                case "tasks/list":
                case "tasks/result":
                case "tasks/cancel":
                    if (!this._capabilities.tasks) throw Error(`Client does not support tasks capability (required for ${A})`);
                    break;
                case "ping":
                    break
            }
        }
        assertTaskCapability(A) {
            var q, K;
            lH6((K = (q = this._serverCapabilities) === null || q === void 0 ? void 0 : q.tasks) === null || K === void 0 ? void 0 : K.requests, A, "Server")
        }
        assertTaskHandlerCapability(A) {
            var q;
            if (!this._capabilities) return;
            iH6((q = this._capabilities.tasks) === null || q === void 0 ? void 0 : q.requests, A, "Client")
        }
        async ping(A) {
            return this.request({
                method: "ping"
            }, Hp, A)
        }
        async complete(A, q) {
            return this.request({
                method: "completion/complete",
                params: A
            }, sOA, q)
        }
        async setLoggingLevel(A, q) {
            return this.request({
                method: "logging/setLevel",
                params: {
                    level: A
                }
            }, Hp, q)
        }
        async getPrompt(A, q) {
            return this.request({
                method: "prompts/get",
                params: A
            }, lOA, q)
        }
        async listPrompts(A, q) {
            return this.request({
                method: "prompts/list",
                params: A
            }, Ab1, q)
        }
        async listResources(A, q) {
            return this.request({
                method: "resources/list",
                params: A
            }, Vq1, q)
        }
        async listResourceTemplates(A, q) {
            return this.request({
                method: "resources/templates/list",
                params: A
            }, FOA, q)
        }
        async readResource(A, q) {
            return this.request({
                method: "resources/read",
                params: A
            }, Nq1, q)
        }
        async subscribeResource(A, q) {
            return this.request({
                method: "resources/subscribe",
                params: A
            }, Hp, q)
        }
        async unsubscribeResource(A, q) {
            return this.request({
                method: "resources/unsubscribe",
                params: A
            }, Hp, q)
        }
        async callTool(A, q = ZZ, K) {
            if (this.isToolTaskRequired(A.name)) throw new Eq(VK.InvalidRequest, `Tool "${A.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
            let Y = await this.request({
                    method: "tools/call",
                    params: A
                }, q, K),
                z = this.getToolOutputValidator(A.name);
            if (z) {
                if (!Y.structuredContent && !Y.isError) throw new Eq(VK.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`);
                if (Y.structuredContent) try {
                    let w = z(Y.structuredContent);
                    if (!w.valid) throw new Eq(VK.InvalidParams, `Structured content does not match the tool's output schema: ${w.errorMessage}`)
                } catch (w) {
                    if (w instanceof Eq) throw w;
                    throw new Eq(VK.InvalidParams, `Failed to validate structured content: ${w instanceof Error?w.message:String(w)}`)
                }
            }
            return Y
        }
        isToolTask(A) {
            var q, K, Y, z;
            if (!((z = (Y = (K = (q = this._serverCapabilities) === null || q === void 0 ? void 0 : q.tasks) === null || K === void 0 ? void 0 : K.requests) === null || Y === void 0 ? void 0 : Y.tools) === null || z === void 0 ? void 0 : z.call)) return !1;
            return this._cachedKnownTaskTools.has(A)
        }
        isToolTaskRequired(A) {
            return this._cachedRequiredTaskTools.has(A)
        }
        cacheToolMetadata(A) {
            var q;
            this._cachedToolOutputValidators.clear(), this._cachedKnownTaskTools.clear(), this._cachedRequiredTaskTools.clear();
            for (let K of A) {
                if (K.outputSchema) {
                    let z = this._jsonSchemaValidator.getValidator(K.outputSchema);
                    this._cachedToolOutputValidators.set(K.name, z)
                }
                let Y = (q = K.execution) === null || q === void 0 ? void 0 : q.taskSupport;
                if (Y === "required" || Y === "optional") this._cachedKnownTaskTools.add(K.name);
                if (Y === "required") this._cachedRequiredTaskTools.add(K.name)
            }
        }
        getToolOutputValidator(A) {
            return this._cachedToolOutputValidators.get(A)
        }
        async listTools(A, q) {
            let K = await this.request({
                method: "tools/list",
                params: A
            }, Kb1, q);
            return this.cacheToolMetadata(K.tools), K
        }
        async sendRootsListChanged() {
            return this.notification({
                method: "notifications/roots/list_changed"
            })
        }
    }
})
// @from(Ln 214650, Col 0)
class hb1 {
    append(A) {
        this._buffer = this._buffer ? Buffer.concat([this._buffer, A]) : A
    }
    readMessage() {
        if (!this._buffer) return null;
        let A = this._buffer.indexOf(`
`);
        if (A === -1) return null;
        let q = this._buffer.toString("utf8", 0, A).replace(/\r$/, "");
        return this._buffer = this._buffer.subarray(A + 1), OX9(q)
    }
    clear() {
        this._buffer = void 0
    }
}
// @from(Ln 214667, Col 0)
function OX9(A) {
    return Ah.parse(JSON.parse(A))
}
// @from(Ln 214671, Col 0)
function oH6(A) {
    return JSON.stringify(A) + `
`
}
// @from(Ln 214675, Col 4)
CJA = v(() => {
    gD()
})
// @from(Ln 214683, Col 0)
function XX9() {
    let A = {};
    for (let q of JX9) {
        let K = aH6.env[q];
        if (K === void 0) continue;
        if (K.startsWith("()")) continue;
        A[q] = K
    }
    return A
}
// @from(Ln 214693, Col 0)
class SJA {
    constructor(A) {
        if (this._readBuffer = new hb1, this._stderrStream = null, this._serverParams = A, A.stderr === "pipe" || A.stderr === "overlapped") this._stderrStream = new _X9
    }
    async start() {
        if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        return new Promise((A, q) => {
            var K, Y, z, w, H;
            if (this._process = iI7.default(this._serverParams.command, (K = this._serverParams.args) !== null && K !== void 0 ? K : [], {
                    env: {
                        ...XX9(),
                        ...this._serverParams.env
                    },
                    stdio: ["pipe", "pipe", (Y = this._serverParams.stderr) !== null && Y !== void 0 ? Y : "inherit"],
                    shell: !1,
                    windowsHide: aH6.platform === "win32" && DX9(),
                    cwd: this._serverParams.cwd
                }), this._process.on("error", ($) => {
                    var O;
                    q($), (O = this.onerror) === null || O === void 0 || O.call(this, $)
                }), this._process.on("spawn", () => {
                    A()
                }), this._process.on("close", ($) => {
                    var O;
                    this._process = void 0, (O = this.onclose) === null || O === void 0 || O.call(this)
                }), (z = this._process.stdin) === null || z === void 0 || z.on("error", ($) => {
                    var O;
                    (O = this.onerror) === null || O === void 0 || O.call(this, $)
                }), (w = this._process.stdout) === null || w === void 0 || w.on("data", ($) => {
                    this._readBuffer.append($), this.processReadBuffer()
                }), (H = this._process.stdout) === null || H === void 0 || H.on("error", ($) => {
                    var O;
                    (O = this.onerror) === null || O === void 0 || O.call(this, $)
                }), this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream)
        })
    }
    get stderr() {
        var A, q;
        if (this._stderrStream) return this._stderrStream;
        return (q = (A = this._process) === null || A === void 0 ? void 0 : A.stderr) !== null && q !== void 0 ? q : null
    }
    get pid() {
        var A, q;
        return (q = (A = this._process) === null || A === void 0 ? void 0 : A.pid) !== null && q !== void 0 ? q : null
    }
    processReadBuffer() {
        var A, q;
        while (!0) try {
            let K = this._readBuffer.readMessage();
            if (K === null) break;
            (A = this.onmessage) === null || A === void 0 || A.call(this, K)
        } catch (K) {
            (q = this.onerror) === null || q === void 0 || q.call(this, K)
        }
    }
    async close() {
        var A;
        if (this._process) {
            let q = this._process;
            this._process = void 0;
            let K = new Promise((Y) => {
                q.once("close", () => {
                    Y()
                })
            });
            try {
                (A = q.stdin) === null || A === void 0 || A.end()
            } catch (Y) {}
            if (await Promise.race([K, new Promise((Y) => setTimeout(Y, 2000).unref())]), q.exitCode === null) {
                try {
                    q.kill("SIGTERM")
                } catch (Y) {}
                await Promise.race([K, new Promise((Y) => setTimeout(Y, 2000).unref())])
            }
            if (q.exitCode === null) try {
                q.kill("SIGKILL")
            } catch (Y) {}
        }
        this._readBuffer.clear()
    }
    send(A) {
        return new Promise((q) => {
            var K;
            if (!((K = this._process) === null || K === void 0 ? void 0 : K.stdin)) throw Error("Not connected");
            let Y = oH6(A);
            if (this._process.stdin.write(Y)) q();
            else this._process.stdin.once("drain", q)
        })
    }
}
// @from(Ln 214784, Col 0)
function DX9() {
    return "type" in aH6
}
// @from(Ln 214787, Col 4)
iI7
// @from(Ln 214787, Col 9)
JX9
// @from(Ln 214788, Col 4)
nI7 = v(() => {
    CJA();
    iI7 = o(oS6(), 1), JX9 = aH6.platform === "win32" ? ["APPDATA", "HOMEDRIVE", "HOMEPATH", "LOCALAPPDATA", "PATH", "PROCESSOR_ARCHITECTURE", "SYSTEMDRIVE", "SYSTEMROOT", "TEMP", "USERNAME", "USERPROFILE", "PROGRAMFILES"] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
})
// @from(Ln 214793, Col 0)
function hJA(A) {}
// @from(Ln 214795, Col 0)
function sH6(A) {
    if (typeof A == "function") throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
    let {
        onEvent: q = hJA,
        onError: K = hJA,
        onRetry: Y = hJA,
        onComment: z
    } = A, w = "", H = !0, $, O = "", _ = "";

    function J(P) {
        let W = H ? P.replace(/^\xEF\xBB\xBF/, "") : P,
            [G, f] = jX9(`${w}${W}`);
        for (let Z of G) X(Z);
        w = f, H = !1
    }

    function X(P) {
        if (P === "") {
            j();
            return
        }
        if (P.startsWith(":")) {
            z && z(P.slice(P.startsWith(": ") ? 2 : 1));
            return
        }
        let W = P.indexOf(":");
        if (W !== -1) {
            let G = P.slice(0, W),
                f = P[W + 1] === " " ? 2 : 1,
                Z = P.slice(W + f);
            D(G, Z, P);
            return
        }
        D(P, "", P)
    }

    function D(P, W, G) {
        switch (P) {
            case "event":
                _ = W;
                break;
            case "data":
                O = `${O}${W}
`;
                break;
            case "id":
                $ = W.includes("\x00") ? void 0 : W;
                break;
            case "retry":
                /^\d+$/.test(W) ? Y(parseInt(W, 10)) : K(new IJA(`Invalid \`retry\` value: "${W}"`, {
                    type: "invalid-retry",
                    value: W,
                    line: G
                }));
                break;
            default:
                K(new IJA(`Unknown field "${P.length>20?`${P.slice(0,20)}…`:P}"`, {
                    type: "unknown-field",
                    field: P,
                    value: W,
                    line: G
                }));
                break
        }
    }

    function j() {
        O.length > 0 && q({
            id: $,
            event: _ || void 0,
            data: O.endsWith(`
`) ? O.slice(0, -1) : O
        }), $ = void 0, O = "", _ = ""
    }

    function M(P = {}) {
        w && P.consume && X(w), H = !0, $ = void 0, O = "", _ = "", w = ""
    }
    return {
        feed: J,
        reset: M
    }
}
// @from(Ln 214879, Col 0)
function jX9(A) {
    let q = [],
        K = "",
        Y = 0;
    for (; Y < A.length;) {
        let z = A.indexOf("\r", Y),
            w = A.indexOf(`
`, Y),
            H = -1;
        if (z !== -1 && w !== -1 ? H = Math.min(z, w) : z !== -1 ? H = z : w !== -1 && (H = w), H === -1) {
            K = A.slice(Y);
            break
        } else {
            let $ = A.slice(Y, H);
            q.push($), Y = H + 1, A[Y - 1] === "\r" && A[Y] === `
` && Y++
        }
    }
    return [q, K]
}
// @from(Ln 214899, Col 4)
IJA
// @from(Ln 214900, Col 4)
xJA = v(() => {
    IJA = class IJA extends Error {
        constructor(A, q) {
            super(A), this.name = "ParseError", this.type = q.type, this.field = q.field, this.value = q.value, this.line = q.line
        }
    }
})
// @from(Ln 214908, Col 0)
function MX9(A) {
    let q = globalThis.DOMException;
    return typeof q == "function" ? new q(A, "SyntaxError") : SyntaxError(A)
}
// @from(Ln 214913, Col 0)
function uJA(A) {
    return A instanceof Error ? "errors" in A && Array.isArray(A.errors) ? A.errors.map(uJA).join(", ") : ("cause" in A) && A.cause instanceof Error ? `${A}: ${uJA(A.cause)}` : A.message : `${A}`
}
// @from(Ln 214917, Col 0)
function rI7(A) {
    return {
        type: A.type,
        message: A.message,
        code: A.code,
        defaultPrevented: A.defaultPrevented,
        cancelable: A.cancelable,
        timeStamp: A.timeStamp
    }
}
// @from(Ln 214928, Col 0)
function PX9() {
    let A = "document" in globalThis ? globalThis.document : void 0;
    return A && typeof A == "object" && "baseURI" in A && typeof A.baseURI == "string" ? A.baseURI : void 0
}
// @from(Ln 214932, Col 4)
bJA
// @from(Ln 214932, Col 9)
aI7 = (A) => {
        throw TypeError(A)
    }
// @from(Ln 214935, Col 4)
dJA = (A, q, K) => q.has(A) || aI7("Cannot " + K)
// @from(Ln 214936, Col 4)
u9 = (A, q, K) => (dJA(A, q, "read from private field"), K ? K.call(A) : q.get(A))
// @from(Ln 214937, Col 4)
UD = (A, q, K) => q.has(A) ? aI7("Cannot add the same private member more than once") : q instanceof WeakSet ? q.add(A) : q.set(A, K)
// @from(Ln 214938, Col 4)
g$ = (A, q, K, Y) => (dJA(A, q, "write to private field"), q.set(A, K), K)
// @from(Ln 214939, Col 4)
Mp = (A, q, K) => (dJA(A, q, "access private method"), K)
// @from(Ln 214940, Col 4)
cV
// @from(Ln 214940, Col 8)
Sq1
// @from(Ln 214940, Col 13)
L01
// @from(Ln 214940, Col 18)
tH6
// @from(Ln 214940, Col 23)
eH6
// @from(Ln 214940, Col 28)
bb1
// @from(Ln 214940, Col 33)
C01
// @from(Ln 214940, Col 38)
ub1
// @from(Ln 214940, Col 43)
wa
// @from(Ln 214940, Col 47)
R01
// @from(Ln 214940, Col 52)
S01
// @from(Ln 214940, Col 57)
y01
// @from(Ln 214940, Col 62)
Ib1
// @from(Ln 214940, Col 67)
$h
// @from(Ln 214940, Col 71)
BJA
// @from(Ln 214940, Col 76)
mJA
// @from(Ln 214940, Col 81)
FJA
// @from(Ln 214940, Col 86)
oI7
// @from(Ln 214940, Col 91)
QJA
// @from(Ln 214940, Col 96)
gJA
// @from(Ln 214940, Col 101)
xb1
// @from(Ln 214940, Col 106)
UJA
// @from(Ln 214940, Col 111)
pJA
// @from(Ln 214940, Col 116)
h01
// @from(Ln 214941, Col 4)
sI7 = v(() => {
    xJA();
    bJA = class bJA extends Event {
        constructor(A, q) {
            var K, Y;
            super(A), this.code = (K = q == null ? void 0 : q.code) != null ? K : void 0, this.message = (Y = q == null ? void 0 : q.message) != null ? Y : void 0
        } [Symbol.for("nodejs.util.inspect.custom")](A, q, K) {
            return K(rI7(this), q)
        } [Symbol.for("Deno.customInspect")](A, q) {
            return A(rI7(this), q)
        }
    };
    h01 = class h01 extends EventTarget {
        constructor(A, q) {
            var K, Y;
            super(), UD(this, $h), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, UD(this, cV), UD(this, Sq1), UD(this, L01), UD(this, tH6), UD(this, eH6), UD(this, bb1), UD(this, C01), UD(this, ub1, null), UD(this, wa), UD(this, R01), UD(this, S01, null), UD(this, y01, null), UD(this, Ib1, null), UD(this, mJA, async (z) => {
                var w;
                u9(this, R01).reset();
                let {
                    body: H,
                    redirected: $,
                    status: O,
                    headers: _
                } = z;
                if (O === 204) {
                    Mp(this, $h, xb1).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
                    return
                }
                if ($ ? g$(this, L01, new URL(z.url)) : g$(this, L01, void 0), O !== 200) {
                    Mp(this, $h, xb1).call(this, `Non-200 status code (${O})`, O);
                    return
                }
                if (!(_.get("content-type") || "").startsWith("text/event-stream")) {
                    Mp(this, $h, xb1).call(this, 'Invalid content type, expected "text/event-stream"', O);
                    return
                }
                if (u9(this, cV) === this.CLOSED) return;
                g$(this, cV, this.OPEN);
                let J = new Event("open");
                if ((w = u9(this, Ib1)) == null || w.call(this, J), this.dispatchEvent(J), typeof H != "object" || !H || !("getReader" in H)) {
                    Mp(this, $h, xb1).call(this, "Invalid response body, expected a web ReadableStream", O), this.close();
                    return
                }
                let X = new TextDecoder,
                    D = H.getReader(),
                    j = !0;
                do {
                    let {
                        done: M,
                        value: P
                    } = await D.read();
                    P && u9(this, R01).feed(X.decode(P, {
                        stream: !M
                    })), M && (j = !1, u9(this, R01).reset(), Mp(this, $h, UJA).call(this))
                } while (j)
            }), UD(this, FJA, (z) => {
                g$(this, wa, void 0), !(z.name === "AbortError" || z.type === "aborted") && Mp(this, $h, UJA).call(this, uJA(z))
            }), UD(this, QJA, (z) => {
                typeof z.id == "string" && g$(this, ub1, z.id);
                let w = new MessageEvent(z.event || "message", {
                    data: z.data,
                    origin: u9(this, L01) ? u9(this, L01).origin : u9(this, Sq1).origin,
                    lastEventId: z.id || ""
                });
                u9(this, y01) && (!z.event || z.event === "message") && u9(this, y01).call(this, w), this.dispatchEvent(w)
            }), UD(this, gJA, (z) => {
                g$(this, bb1, z)
            }), UD(this, pJA, () => {
                g$(this, C01, void 0), u9(this, cV) === this.CONNECTING && Mp(this, $h, BJA).call(this)
            });
            try {
                if (A instanceof URL) g$(this, Sq1, A);
                else if (typeof A == "string") g$(this, Sq1, new URL(A, PX9()));
                else throw Error("Invalid URL")
            } catch {
                throw MX9("An invalid or illegal string was specified")
            }
            g$(this, R01, sH6({
                onEvent: u9(this, QJA),
                onRetry: u9(this, gJA)
            })), g$(this, cV, this.CONNECTING), g$(this, bb1, 3000), g$(this, eH6, (K = q == null ? void 0 : q.fetch) != null ? K : globalThis.fetch), g$(this, tH6, (Y = q == null ? void 0 : q.withCredentials) != null ? Y : !1), Mp(this, $h, BJA).call(this)
        }
        get readyState() {
            return u9(this, cV)
        }
        get url() {
            return u9(this, Sq1).href
        }
        get withCredentials() {
            return u9(this, tH6)
        }
        get onerror() {
            return u9(this, S01)
        }
        set onerror(A) {
            g$(this, S01, A)
        }
        get onmessage() {
            return u9(this, y01)
        }
        set onmessage(A) {
            g$(this, y01, A)
        }
        get onopen() {
            return u9(this, Ib1)
        }
        set onopen(A) {
            g$(this, Ib1, A)
        }
        addEventListener(A, q, K) {
            let Y = q;
            super.addEventListener(A, Y, K)
        }
        removeEventListener(A, q, K) {
            let Y = q;
            super.removeEventListener(A, Y, K)
        }
        close() {
            u9(this, C01) && clearTimeout(u9(this, C01)), u9(this, cV) !== this.CLOSED && (u9(this, wa) && u9(this, wa).abort(), g$(this, cV, this.CLOSED), g$(this, wa, void 0))
        }
    };
    cV = new WeakMap, Sq1 = new WeakMap, L01 = new WeakMap, tH6 = new WeakMap, eH6 = new WeakMap, bb1 = new WeakMap, C01 = new WeakMap, ub1 = new WeakMap, wa = new WeakMap, R01 = new WeakMap, S01 = new WeakMap, y01 = new WeakMap, Ib1 = new WeakMap, $h = new WeakSet, BJA = function() {
        g$(this, cV, this.CONNECTING), g$(this, wa, new AbortController), u9(this, eH6)(u9(this, Sq1), Mp(this, $h, oI7).call(this)).then(u9(this, mJA)).catch(u9(this, FJA))
    }, mJA = new WeakMap, FJA = new WeakMap, oI7 = function() {
        var A;
        let q = {
            mode: "cors",
            redirect: "follow",
            headers: {
                Accept: "text/event-stream",
                ...u9(this, ub1) ? {
                    "Last-Event-ID": u9(this, ub1)
                } : void 0
            },
            cache: "no-store",
            signal: (A = u9(this, wa)) == null ? void 0 : A.signal
        };
        return "window" in globalThis && (q.credentials = this.withCredentials ? "include" : "same-origin"), q
    }, QJA = new WeakMap, gJA = new WeakMap, xb1 = function(A, q) {
        var K;
        u9(this, cV) !== this.CLOSED && g$(this, cV, this.CLOSED);
        let Y = new bJA("error", {
            code: q,
            message: A
        });
        (K = u9(this, S01)) == null || K.call(this, Y), this.dispatchEvent(Y)
    }, UJA = function(A, q) {
        var K;
        if (u9(this, cV) === this.CLOSED) return;
        g$(this, cV, this.CONNECTING);
        let Y = new bJA("error", {
            code: q,
            message: A
        });
        (K = u9(this, S01)) == null || K.call(this, Y), this.dispatchEvent(Y), g$(this, C01, setTimeout(u9(this, pJA), u9(this, bb1)))
    }, pJA = new WeakMap, h01.CONNECTING = 0, h01.OPEN = 1, h01.CLOSED = 2
})
// @from(Ln 215099, Col 0)
function I01(A) {
    if (!A) return {};
    if (A instanceof Headers) return Object.fromEntries(A.entries());
    if (Array.isArray(A)) return Object.fromEntries(A);
    return {
        ...A
    }
}
// @from(Ln 215108, Col 0)
function hq1(A = fetch, q) {
    if (!q) return A;
    return async (K, Y) => {
        let z = {
            ...q,
            ...Y,
            headers: (Y === null || Y === void 0 ? void 0 : Y.headers) ? {
                ...I01(q.headers),
                ...I01(Y.headers)
            } : q.headers
        };
        return A(K, z)
    }
}
// @from(Ln 215122, Col 0)
async function WX9(A) {
    return (await cJA).getRandomValues(new Uint8Array(A))
}
// @from(Ln 215125, Col 0)
async function GX9(A) {
    let K = "",
        Y = await WX9(A);
    for (let z = 0; z < A; z++) {
        let w = Y[z] % 66;
        K += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~" [w]
    }
    return K
}
// @from(Ln 215134, Col 0)
async function ZX9(A) {
    return await GX9(A)
}
// @from(Ln 215137, Col 0)
async function fX9(A) {
    let q = await (await cJA).subtle.digest("SHA-256", new TextEncoder().encode(A));
    return btoa(String.fromCharCode(...new Uint8Array(q))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
}
// @from(Ln 215141, Col 0)
async function lJA(A) {
    if (!A) A = 43;
    if (A < 43 || A > 128) throw `Expected a length between 43 and 128. Received ${A}.`;
    let q = await ZX9(A),
        K = await fX9(q);
    return {
        code_verifier: q,
        code_challenge: K
    }
}
// @from(Ln 215151, Col 4)
cJA
// @from(Ln 215152, Col 4)
tI7 = v(() => {
    cJA = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((A) => A.webcrypto)
})
// @from(Ln 215155, Col 4)
bM
// @from(Ln 215155, Col 8)
Ax7
// @from(Ln 215155, Col 13)
iJA
// @from(Ln 215155, Col 18)
VX9
// @from(Ln 215155, Col 23)
qx7
// @from(Ln 215155, Col 28)
Kx7
// @from(Ln 215155, Col 33)
A$6
// @from(Ln 215155, Col 38)
eI7
// @from(Ln 215155, Col 43)
NX9
// @from(Ln 215155, Col 48)
TX9
// @from(Ln 215155, Col 53)
Yx7
// @from(Ln 215155, Col 58)
V2w
// @from(Ln 215155, Col 63)
N2w
// @from(Ln 215156, Col 4)
q$6 = v(() => {
    i7();
    bM = Em6().superRefine((A, q) => {
        if (!URL.canParse(A)) return q.addIssue({
            code: am6.custom,
            message: "URL must be parseable",
            fatal: !0
        }), FT1
    }).refine((A) => {
        let q = new URL(A);
        return q.protocol !== "javascript:" && q.protocol !== "data:" && q.protocol !== "vbscript:"
    }, {
        message: "URL cannot use javascript:, data:, or vbscript: scheme"
    }), Ax7 = rj({
        resource: p6().url(),
        authorization_servers: B7(bM).optional(),
        jwks_uri: p6().url().optional(),
        scopes_supported: B7(p6()).optional(),
        bearer_methods_supported: B7(p6()).optional(),
        resource_signing_alg_values_supported: B7(p6()).optional(),
        resource_name: p6().optional(),
        resource_documentation: p6().optional(),
        resource_policy_uri: p6().url().optional(),
        resource_tos_uri: p6().url().optional(),
        tls_client_certificate_bound_access_tokens: c2().optional(),
        authorization_details_types_supported: B7(p6()).optional(),
        dpop_signing_alg_values_supported: B7(p6()).optional(),
        dpop_bound_access_tokens_required: c2().optional()
    }), iJA = rj({
        issuer: p6(),
        authorization_endpoint: bM,
        token_endpoint: bM,
        registration_endpoint: bM.optional(),
        scopes_supported: B7(p6()).optional(),
        response_types_supported: B7(p6()),
        response_modes_supported: B7(p6()).optional(),
        grant_types_supported: B7(p6()).optional(),
        token_endpoint_auth_methods_supported: B7(p6()).optional(),
        token_endpoint_auth_signing_alg_values_supported: B7(p6()).optional(),
        service_documentation: bM.optional(),
        revocation_endpoint: bM.optional(),
        revocation_endpoint_auth_methods_supported: B7(p6()).optional(),
        revocation_endpoint_auth_signing_alg_values_supported: B7(p6()).optional(),
        introspection_endpoint: p6().optional(),
        introspection_endpoint_auth_methods_supported: B7(p6()).optional(),
        introspection_endpoint_auth_signing_alg_values_supported: B7(p6()).optional(),
        code_challenge_methods_supported: B7(p6()).optional(),
        client_id_metadata_document_supported: c2().optional()
    }), VX9 = rj({
        issuer: p6(),
        authorization_endpoint: bM,
        token_endpoint: bM,
        userinfo_endpoint: bM.optional(),
        jwks_uri: bM,
        registration_endpoint: bM.optional(),
        scopes_supported: B7(p6()).optional(),
        response_types_supported: B7(p6()),
        response_modes_supported: B7(p6()).optional(),
        grant_types_supported: B7(p6()).optional(),
        acr_values_supported: B7(p6()).optional(),
        subject_types_supported: B7(p6()),
        id_token_signing_alg_values_supported: B7(p6()),
        id_token_encryption_alg_values_supported: B7(p6()).optional(),
        id_token_encryption_enc_values_supported: B7(p6()).optional(),
        userinfo_signing_alg_values_supported: B7(p6()).optional(),
        userinfo_encryption_alg_values_supported: B7(p6()).optional(),
        userinfo_encryption_enc_values_supported: B7(p6()).optional(),
        request_object_signing_alg_values_supported: B7(p6()).optional(),
        request_object_encryption_alg_values_supported: B7(p6()).optional(),
        request_object_encryption_enc_values_supported: B7(p6()).optional(),
        token_endpoint_auth_methods_supported: B7(p6()).optional(),
        token_endpoint_auth_signing_alg_values_supported: B7(p6()).optional(),
        display_values_supported: B7(p6()).optional(),
        claim_types_supported: B7(p6()).optional(),
        claims_supported: B7(p6()).optional(),
        service_documentation: p6().optional(),
        claims_locales_supported: B7(p6()).optional(),
        ui_locales_supported: B7(p6()).optional(),
        claims_parameter_supported: c2().optional(),
        request_parameter_supported: c2().optional(),
        request_uri_parameter_supported: c2().optional(),
        require_request_uri_registration: c2().optional(),
        op_policy_uri: bM.optional(),
        op_tos_uri: bM.optional(),
        client_id_metadata_document_supported: c2().optional()
    }), qx7 = H7({
        ...VX9.shape,
        ...iJA.pick({
            code_challenge_methods_supported: !0
        }).shape
    }), Kx7 = H7({
        access_token: p6(),
        id_token: p6().optional(),
        token_type: p6(),
        expires_in: Lv1.number().optional(),
        scope: p6().optional(),
        refresh_token: p6().optional()
    }).strip(), A$6 = H7({
        error: p6(),
        error_description: p6().optional(),
        error_uri: p6().optional()
    }), eI7 = bM.optional().or(Hq("").transform(() => {
        return
    })), NX9 = H7({
        redirect_uris: B7(bM),
        token_endpoint_auth_method: p6().optional(),
        grant_types: B7(p6()).optional(),
        response_types: B7(p6()).optional(),
        client_name: p6().optional(),
        client_uri: bM.optional(),
        logo_uri: eI7,
        scope: p6().optional(),
        contacts: B7(p6()).optional(),
        tos_uri: eI7,
        policy_uri: p6().optional(),
        jwks_uri: bM.optional(),
        jwks: Um6().optional(),
        software_id: p6().optional(),
        software_version: p6().optional(),
        software_statement: p6().optional()
    }).strip(), TX9 = H7({
        client_id: p6(),
        client_secret: p6().optional(),
        client_id_issued_at: Yz().optional(),
        client_secret_expires_at: Yz().optional()
    }).strip(), Yx7 = NX9.merge(TX9), V2w = H7({
        error: p6(),
        error_description: p6().optional()
    }).strip(), N2w = H7({
        token: p6(),
        token_type_hint: p6().optional()
    }).strip()
})
// @from(Ln 215290, Col 0)
function zx7(A) {
    let q = typeof A === "string" ? new URL(A) : new URL(A.href);
    return q.hash = "", q
}
// @from(Ln 215295, Col 0)
function wx7({
    requestedResource: A,
    configuredResource: q
}) {
    let K = typeof A === "string" ? new URL(A) : new URL(A.href),
        Y = typeof q === "string" ? new URL(q) : new URL(q.href);
    if (K.origin !== Y.origin) return !1;
    if (K.pathname.length < Y.pathname.length) return !1;
    let z = K.pathname.endsWith("/") ? K.pathname : K.pathname + "/",
        w = Y.pathname.endsWith("/") ? Y.pathname : Y.pathname + "/";
    return z.startsWith(w)
}
// @from(Ln 215307, Col 4)
xX
// @from(Ln 215307, Col 8)
K$6
// @from(Ln 215307, Col 13)
x01
// @from(Ln 215307, Col 18)
Ha
// @from(Ln 215307, Col 22)
b01
// @from(Ln 215307, Col 27)
Y$6
// @from(Ln 215307, Col 32)
z$6
// @from(Ln 215307, Col 37)
w$6
// @from(Ln 215307, Col 42)
TB
// @from(Ln 215307, Col 46)
u01
// @from(Ln 215307, Col 51)
H$6
// @from(Ln 215307, Col 56)
$$6
// @from(Ln 215307, Col 61)
O$6
// @from(Ln 215307, Col 66)
_$6
// @from(Ln 215307, Col 71)
B01
// @from(Ln 215307, Col 76)
m01
// @from(Ln 215307, Col 81)
J$6
// @from(Ln 215307, Col 86)
X$6
// @from(Ln 215307, Col 91)
Hx7
// @from(Ln 215308, Col 4)
nJA = v(() => {
    xX = class xX extends Error {
        constructor(A, q) {
            super(A);
            this.errorUri = q, this.name = this.constructor.name
        }
        toResponseObject() {
            let A = {
                error: this.errorCode,
                error_description: this.message
            };
            if (this.errorUri) A.error_uri = this.errorUri;
            return A
        }
        get errorCode() {
            return this.constructor.errorCode
        }
    };
    K$6 = class K$6 extends xX {};
    K$6.errorCode = "invalid_request";
    x01 = class x01 extends xX {};
    x01.errorCode = "invalid_client";
    Ha = class Ha extends xX {};
    Ha.errorCode = "invalid_grant";
    b01 = class b01 extends xX {};
    b01.errorCode = "unauthorized_client";
    Y$6 = class Y$6 extends xX {};
    Y$6.errorCode = "unsupported_grant_type";
    z$6 = class z$6 extends xX {};
    z$6.errorCode = "invalid_scope";
    w$6 = class w$6 extends xX {};
    w$6.errorCode = "access_denied";
    TB = class TB extends xX {};
    TB.errorCode = "server_error";
    u01 = class u01 extends xX {};
    u01.errorCode = "temporarily_unavailable";
    H$6 = class H$6 extends xX {};
    H$6.errorCode = "unsupported_response_type";
    $$6 = class $$6 extends xX {};
    $$6.errorCode = "unsupported_token_type";
    O$6 = class O$6 extends xX {};
    O$6.errorCode = "invalid_token";
    _$6 = class _$6 extends xX {};
    _$6.errorCode = "method_not_allowed";
    B01 = class B01 extends xX {};
    B01.errorCode = "too_many_requests";
    m01 = class m01 extends xX {};
    m01.errorCode = "invalid_client_metadata";
    J$6 = class J$6 extends xX {};
    J$6.errorCode = "insufficient_scope";
    X$6 = class X$6 extends xX {};
    X$6.errorCode = "invalid_target";
    Hx7 = {
        [K$6.errorCode]: K$6,
        [x01.errorCode]: x01,
        [Ha.errorCode]: Ha,
        [b01.errorCode]: b01,
        [Y$6.errorCode]: Y$6,
        [z$6.errorCode]: z$6,
        [w$6.errorCode]: w$6,
        [TB.errorCode]: TB,
        [u01.errorCode]: u01,
        [H$6.errorCode]: H$6,
        [$$6.errorCode]: $$6,
        [O$6.errorCode]: O$6,
        [_$6.errorCode]: _$6,
        [B01.errorCode]: B01,
        [m01.errorCode]: m01,
        [J$6.errorCode]: J$6,
        [X$6.errorCode]: X$6
    }
})
// @from(Ln 215381, Col 0)
function vX9(A) {
    return ["client_secret_basic", "client_secret_post", "none"].includes(A)
}
// @from(Ln 215385, Col 0)
function EX9(A, q) {
    let K = A.client_secret !== void 0;
    if (q.length === 0) return K ? "client_secret_post" : "none";
    if ("token_endpoint_auth_method" in A && A.token_endpoint_auth_method && vX9(A.token_endpoint_auth_method) && q.includes(A.token_endpoint_auth_method)) return A.token_endpoint_auth_method;
    if (K && q.includes("client_secret_basic")) return "client_secret_basic";
    if (K && q.includes("client_secret_post")) return "client_secret_post";
    if (q.includes("none")) return "none";
    return K ? "client_secret_post" : "none"
}