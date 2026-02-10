
// @from(Ln 209909, Col 4)
Pb1 = R((dC7) => {
    Object.defineProperty(dC7, "__esModule", {
        value: !0
    });
    dC7.getData = dC7.KeywordCxt = dC7.validateFunctionCode = void 0;
    var xC7 = iy7(),
        CC7 = Xb1(),
        a_A = g_A(),
        VH6 = Xb1(),
        tw9 = $C7(),
        Mb1 = WC7(),
        o_A = VC7(),
        Sq = p5(),
        R3 = Jp(),
        ew9 = Db1(),
        Xp = dY(),
        jb1 = Jb1();

    function AH9(A) {
        if (BC7(A)) {
            if (mC7(A), uC7(A)) {
                YH9(A);
                return
            }
        }
        bC7(A, () => (0, xC7.topBoolOrEmptySchema)(A))
    }
    dC7.validateFunctionCode = AH9;

    function bC7({
        gen: A,
        validateName: q,
        schema: K,
        schemaEnv: Y,
        opts: z
    }, w) {
        if (z.code.es5) A.func(q, Sq._`${R3.default.data}, ${R3.default.valCxt}`, Y.$async, () => {
            A.code(Sq._`"use strict"; ${SC7(K,z)}`), KH9(A, z), A.code(w)
        });
        else A.func(q, Sq._`${R3.default.data}, ${qH9(z)}`, Y.$async, () => A.code(SC7(K, z)).code(w))
    }

    function qH9(A) {
        return Sq._`{${R3.default.instancePath}="", ${R3.default.parentData}, ${R3.default.parentDataProperty}, ${R3.default.rootData}=${R3.default.data}${A.dynamicRef?Sq._`, ${R3.default.dynamicAnchors}={}`:Sq.nil}}={}`
    }

    function KH9(A, q) {
        A.if(R3.default.valCxt, () => {
            if (A.var(R3.default.instancePath, Sq._`${R3.default.valCxt}.${R3.default.instancePath}`), A.var(R3.default.parentData, Sq._`${R3.default.valCxt}.${R3.default.parentData}`), A.var(R3.default.parentDataProperty, Sq._`${R3.default.valCxt}.${R3.default.parentDataProperty}`), A.var(R3.default.rootData, Sq._`${R3.default.valCxt}.${R3.default.rootData}`), q.dynamicRef) A.var(R3.default.dynamicAnchors, Sq._`${R3.default.valCxt}.${R3.default.dynamicAnchors}`)
        }, () => {
            if (A.var(R3.default.instancePath, Sq._`""`), A.var(R3.default.parentData, Sq._`undefined`), A.var(R3.default.parentDataProperty, Sq._`undefined`), A.var(R3.default.rootData, R3.default.data), q.dynamicRef) A.var(R3.default.dynamicAnchors, Sq._`{}`)
        })
    }

    function YH9(A) {
        let {
            schema: q,
            opts: K,
            gen: Y
        } = A;
        bC7(A, () => {
            if (K.$comment && q.$comment) QC7(A);
            if (OH9(A), Y.let(R3.default.vErrors, null), Y.let(R3.default.errors, 0), K.unevaluated) zH9(A);
            FC7(A), XH9(A)
        });
        return
    }

    function zH9(A) {
        let {
            gen: q,
            validateName: K
        } = A;
        A.evaluated = q.const("evaluated", Sq._`${K}.evaluated`), q.if(Sq._`${A.evaluated}.dynamicProps`, () => q.assign(Sq._`${A.evaluated}.props`, Sq._`undefined`)), q.if(Sq._`${A.evaluated}.dynamicItems`, () => q.assign(Sq._`${A.evaluated}.items`, Sq._`undefined`))
    }

    function SC7(A, q) {
        let K = typeof A == "object" && A[q.schemaId];
        return K && (q.code.source || q.code.process) ? Sq._`/*# sourceURL=${K} */` : Sq.nil
    }

    function wH9(A, q) {
        if (BC7(A)) {
            if (mC7(A), uC7(A)) {
                HH9(A, q);
                return
            }
        }(0, xC7.boolOrEmptySchema)(A, q)
    }

    function uC7({
        schema: A,
        self: q
    }) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (q.RULES.all[K]) return !0;
        return !1
    }

    function BC7(A) {
        return typeof A.schema != "boolean"
    }

    function HH9(A, q) {
        let {
            schema: K,
            gen: Y,
            opts: z
        } = A;
        if (z.$comment && K.$comment) QC7(A);
        _H9(A), JH9(A);
        let w = Y.const("_errs", R3.default.errors);
        FC7(A, w), Y.var(q, Sq._`${w} === ${R3.default.errors}`)
    }

    function mC7(A) {
        (0, Xp.checkUnknownRules)(A), $H9(A)
    }

    function FC7(A, q) {
        if (A.opts.jtd) return hC7(A, [], !1, q);
        let K = (0, CC7.getSchemaTypes)(A.schema),
            Y = (0, CC7.coerceAndCheckDataType)(A, K);
        hC7(A, K, !Y, q)
    }

    function $H9(A) {
        let {
            schema: q,
            errSchemaPath: K,
            opts: Y,
            self: z
        } = A;
        if (q.$ref && Y.ignoreKeywordsWithRef && (0, Xp.schemaHasRulesButRef)(q, z.RULES)) z.logger.warn(`$ref: keywords ignored in schema at path "${K}"`)
    }

    function OH9(A) {
        let {
            schema: q,
            opts: K
        } = A;
        if (q.default !== void 0 && K.useDefaults && K.strictSchema)(0, Xp.checkStrictMode)(A, "default is ignored in the schema root")
    }

    function _H9(A) {
        let q = A.schema[A.opts.schemaId];
        if (q) A.baseId = (0, ew9.resolveUrl)(A.opts.uriResolver, A.baseId, q)
    }

    function JH9(A) {
        if (A.schema.$async && !A.schemaEnv.$async) throw Error("async schema in sync schema")
    }

    function QC7({
        gen: A,
        schemaEnv: q,
        schema: K,
        errSchemaPath: Y,
        opts: z
    }) {
        let w = K.$comment;
        if (z.$comment === !0) A.code(Sq._`${R3.default.self}.logger.log(${w})`);
        else if (typeof z.$comment == "function") {
            let H = Sq.str`${Y}/$comment`,
                $ = A.scopeValue("root", {
                    ref: q.root
                });
            A.code(Sq._`${R3.default.self}.opts.$comment(${w}, ${H}, ${$}.schema)`)
        }
    }

    function XH9(A) {
        let {
            gen: q,
            schemaEnv: K,
            validateName: Y,
            ValidationError: z,
            opts: w
        } = A;
        if (K.$async) q.if(Sq._`${R3.default.errors} === 0`, () => q.return(R3.default.data), () => q.throw(Sq._`new ${z}(${R3.default.vErrors})`));
        else {
            if (q.assign(Sq._`${Y}.errors`, R3.default.vErrors), w.unevaluated) DH9(A);
            q.return(Sq._`${R3.default.errors} === 0`)
        }
    }

    function DH9({
        gen: A,
        evaluated: q,
        props: K,
        items: Y
    }) {
        if (K instanceof Sq.Name) A.assign(Sq._`${q}.props`, K);
        if (Y instanceof Sq.Name) A.assign(Sq._`${q}.items`, Y)
    }

    function hC7(A, q, K, Y) {
        let {
            gen: z,
            schema: w,
            data: H,
            allErrors: $,
            opts: O,
            self: _
        } = A, {
            RULES: J
        } = _;
        if (w.$ref && (O.ignoreKeywordsWithRef || !(0, Xp.schemaHasRulesButRef)(w, J))) {
            z.block(() => UC7(A, "$ref", J.all.$ref.definition));
            return
        }
        if (!O.jtd) jH9(A, q);
        z.block(() => {
            for (let D of J.rules) X(D);
            X(J.post)
        });

        function X(D) {
            if (!(0, a_A.shouldUseGroup)(w, D)) return;
            if (D.type) {
                if (z.if((0, VH6.checkDataType)(D.type, H, O.strictNumbers)), IC7(A, D), q.length === 1 && q[0] === D.type && K) z.else(), (0, VH6.reportTypeError)(A);
                z.endIf()
            } else IC7(A, D);
            if (!$) z.if(Sq._`${R3.default.errors} === ${Y||0}`)
        }
    }

    function IC7(A, q) {
        let {
            gen: K,
            schema: Y,
            opts: {
                useDefaults: z
            }
        } = A;
        if (z)(0, tw9.assignDefaults)(A, q.type);
        K.block(() => {
            for (let w of q.rules)
                if ((0, a_A.shouldUseRule)(Y, w)) UC7(A, w.keyword, w.definition, q.type)
        })
    }

    function jH9(A, q) {
        if (A.schemaEnv.meta || !A.opts.strictTypes) return;
        if (MH9(A, q), !A.opts.allowUnionTypes) PH9(A, q);
        WH9(A, A.dataTypes)
    }

    function MH9(A, q) {
        if (!q.length) return;
        if (!A.dataTypes.length) {
            A.dataTypes = q;
            return
        }
        q.forEach((K) => {
            if (!gC7(A.dataTypes, K)) s_A(A, `type "${K}" not allowed by context "${A.dataTypes.join(",")}"`)
        }), ZH9(A, q)
    }

    function PH9(A, q) {
        if (q.length > 1 && !(q.length === 2 && q.includes("null"))) s_A(A, "use allowUnionTypes to allow union type keyword")
    }

    function WH9(A, q) {
        let K = A.self.RULES.all;
        for (let Y in K) {
            let z = K[Y];
            if (typeof z == "object" && (0, a_A.shouldUseRule)(A.schema, z)) {
                let {
                    type: w
                } = z.definition;
                if (w.length && !w.some((H) => GH9(q, H))) s_A(A, `missing type "${w.join(",")}" for keyword "${Y}"`)
            }
        }
    }

    function GH9(A, q) {
        return A.includes(q) || q === "number" && A.includes("integer")
    }

    function gC7(A, q) {
        return A.includes(q) || q === "integer" && A.includes("number")
    }

    function ZH9(A, q) {
        let K = [];
        for (let Y of A.dataTypes)
            if (gC7(q, Y)) K.push(Y);
            else if (q.includes("integer") && Y === "number") K.push("integer");
        A.dataTypes = K
    }

    function s_A(A, q) {
        let K = A.schemaEnv.baseId + A.errSchemaPath;
        q += ` at "${K}" (strictTypes)`, (0, Xp.checkStrictMode)(A, q, A.opts.strictTypes)
    }
    class t_A {
        constructor(A, q, K) {
            if ((0, Mb1.validateKeywordUsage)(A, q, K), this.gen = A.gen, this.allErrors = A.allErrors, this.keyword = K, this.data = A.data, this.schema = A.schema[K], this.$data = q.$data && A.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Xp.schemaRefOrVal)(A, this.schema, K, this.$data), this.schemaType = q.schemaType, this.parentSchema = A.schema, this.params = {}, this.it = A, this.def = q, this.$data) this.schemaCode = A.gen.const("vSchema", pC7(this.$data, A));
            else if (this.schemaCode = this.schemaValue, !(0, Mb1.validSchemaType)(this.schema, q.schemaType, q.allowUndefined)) throw Error(`${K} value must be ${JSON.stringify(q.schemaType)}`);
            if ("code" in q ? q.trackErrors : q.errors !== !1) this.errsCount = A.gen.const("_errs", R3.default.errors)
        }
        result(A, q, K) {
            this.failResult((0, Sq.not)(A), q, K)
        }
        failResult(A, q, K) {
            if (this.gen.if(A), K) K();
            else this.error();
            if (q) {
                if (this.gen.else(), q(), this.allErrors) this.gen.endIf()
            } else if (this.allErrors) this.gen.endIf();
            else this.gen.else()
        }
        pass(A, q) {
            this.failResult((0, Sq.not)(A), void 0, q)
        }
        fail(A) {
            if (A === void 0) {
                if (this.error(), !this.allErrors) this.gen.if(!1);
                return
            }
            if (this.gen.if(A), this.error(), this.allErrors) this.gen.endIf();
            else this.gen.else()
        }
        fail$data(A) {
            if (!this.$data) return this.fail(A);
            let {
                schemaCode: q
            } = this;
            this.fail(Sq._`${q} !== undefined && (${(0,Sq.or)(this.invalid$data(),A)})`)
        }
        error(A, q, K) {
            if (q) {
                this.setParams(q), this._error(A, K), this.setParams({});
                return
            }
            this._error(A, K)
        }
        _error(A, q) {
            (A ? jb1.reportExtraError : jb1.reportError)(this, this.def.error, q)
        }
        $dataError() {
            (0, jb1.reportError)(this, this.def.$dataError || jb1.keyword$DataError)
        }
        reset() {
            if (this.errsCount === void 0) throw Error('add "trackErrors" to keyword definition');
            (0, jb1.resetErrorsCount)(this.gen, this.errsCount)
        }
        ok(A) {
            if (!this.allErrors) this.gen.if(A)
        }
        setParams(A, q) {
            if (q) Object.assign(this.params, A);
            else this.params = A
        }
        block$data(A, q, K = Sq.nil) {
            this.gen.block(() => {
                this.check$data(A, K), q()
            })
        }
        check$data(A = Sq.nil, q = Sq.nil) {
            if (!this.$data) return;
            let {
                gen: K,
                schemaCode: Y,
                schemaType: z,
                def: w
            } = this;
            if (K.if((0, Sq.or)(Sq._`${Y} === undefined`, q)), A !== Sq.nil) K.assign(A, !0);
            if (z.length || w.validateSchema) {
                if (K.elseIf(this.invalid$data()), this.$dataError(), A !== Sq.nil) K.assign(A, !1)
            }
            K.else()
        }
        invalid$data() {
            let {
                gen: A,
                schemaCode: q,
                schemaType: K,
                def: Y,
                it: z
            } = this;
            return (0, Sq.or)(w(), H());

            function w() {
                if (K.length) {
                    if (!(q instanceof Sq.Name)) throw Error("ajv implementation error");
                    let $ = Array.isArray(K) ? K : [K];
                    return Sq._`${(0,VH6.checkDataTypes)($,q,z.opts.strictNumbers,VH6.DataType.Wrong)}`
                }
                return Sq.nil
            }

            function H() {
                if (Y.validateSchema) {
                    let $ = A.scopeValue("validate$data", {
                        ref: Y.validateSchema
                    });
                    return Sq._`!${$}(${q})`
                }
                return Sq.nil
            }
        }
        subschema(A, q) {
            let K = (0, o_A.getSubschema)(this.it, A);
            (0, o_A.extendSubschemaData)(K, this.it, A), (0, o_A.extendSubschemaMode)(K, A);
            let Y = {
                ...this.it,
                ...K,
                items: void 0,
                props: void 0
            };
            return wH9(Y, q), Y
        }
        mergeEvaluated(A, q) {
            let {
                it: K,
                gen: Y
            } = this;
            if (!K.opts.unevaluated) return;
            if (K.props !== !0 && A.props !== void 0) K.props = Xp.mergeEvaluated.props(Y, A.props, K.props, q);
            if (K.items !== !0 && A.items !== void 0) K.items = Xp.mergeEvaluated.items(Y, A.items, K.items, q)
        }
        mergeValidEvaluated(A, q) {
            let {
                it: K,
                gen: Y
            } = this;
            if (K.opts.unevaluated && (K.props !== !0 || K.items !== !0)) return Y.if(q, () => this.mergeEvaluated(A, Sq.Name)), !0
        }
    }
    dC7.KeywordCxt = t_A;

    function UC7(A, q, K, Y) {
        let z = new t_A(A, K, q);
        if ("code" in K) K.code(z, Y);
        else if (z.$data && K.validate)(0, Mb1.funcKeywordCode)(z, K);
        else if ("macro" in K)(0, Mb1.macroKeywordCode)(z, K);
        else if (K.compile || K.validate)(0, Mb1.funcKeywordCode)(z, K)
    }
    var fH9 = /^\/(?:[^~]|~0|~1)*$/,
        VH9 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;

    function pC7(A, {
        dataLevel: q,
        dataNames: K,
        dataPathArr: Y
    }) {
        let z, w;
        if (A === "") return R3.default.rootData;
        if (A[0] === "/") {
            if (!fH9.test(A)) throw Error(`Invalid JSON-pointer: ${A}`);
            z = A, w = R3.default.rootData
        } else {
            let _ = VH9.exec(A);
            if (!_) throw Error(`Invalid JSON-pointer: ${A}`);
            let J = +_[1];
            if (z = _[2], z === "#") {
                if (J >= q) throw Error(O("property/index", J));
                return Y[q - J]
            }
            if (J > q) throw Error(O("data", J));
            if (w = K[q - J], !z) return w
        }
        let H = w,
            $ = z.split("/");
        for (let _ of $)
            if (_) w = Sq._`${w}${(0,Sq.getProperty)((0,Xp.unescapeJsonPointer)(_))}`, H = Sq._`${H} && ${w}`;
        return H;

        function O(_, J) {
            return `Cannot access ${_} ${J} levels up, current level is ${q}`
        }
    }
    dC7.getData = pC7
})
// @from(Ln 210386, Col 4)
NH6 = R((iC7) => {
    Object.defineProperty(iC7, "__esModule", {
        value: !0
    });
    class lC7 extends Error {
        constructor(A) {
            super("validation failed");
            this.errors = A, this.ajv = this.validation = !0
        }
    }
    iC7.default = lC7
})
// @from(Ln 210398, Col 4)
Wb1 = R((rC7) => {
    Object.defineProperty(rC7, "__esModule", {
        value: !0
    });
    var e_A = Db1();
    class nC7 extends Error {
        constructor(A, q, K, Y) {
            super(Y || `can't resolve reference ${K} from id ${q}`);
            this.missingRef = (0, e_A.resolveUrl)(A, q, K), this.missingSchema = (0, e_A.normalizeId)((0, e_A.getFullPath)(A, this.missingRef))
        }
    }
    rC7.default = nC7
})
// @from(Ln 210411, Col 4)
vH6 = R((sC7) => {
    Object.defineProperty(sC7, "__esModule", {
        value: !0
    });
    sC7.resolveSchema = sC7.getCompilingSchema = sC7.resolveRef = sC7.compileSchema = sC7.SchemaEnv = void 0;
    var Yh = p5(),
        kH9 = NH6(),
        Rq1 = Jp(),
        zh = Db1(),
        oC7 = dY(),
        LH9 = Pb1();
    class Gb1 {
        constructor(A) {
            var q;
            this.refs = {}, this.dynamicAnchors = {};
            let K;
            if (typeof A.schema == "object") K = A.schema;
            this.schema = A.schema, this.schemaId = A.schemaId, this.root = A.root || this, this.baseId = (q = A.baseId) !== null && q !== void 0 ? q : (0, zh.normalizeId)(K === null || K === void 0 ? void 0 : K[A.schemaId || "$id"]), this.schemaPath = A.schemaPath, this.localRefs = A.localRefs, this.meta = A.meta, this.$async = K === null || K === void 0 ? void 0 : K.$async, this.refs = {}
        }
    }
    sC7.SchemaEnv = Gb1;

    function qJA(A) {
        let q = aC7.call(this, A);
        if (q) return q;
        let K = (0, zh.getFullPath)(this.opts.uriResolver, A.root.baseId),
            {
                es5: Y,
                lines: z
            } = this.opts.code,
            {
                ownProperties: w
            } = this.opts,
            H = new Yh.CodeGen(this.scope, {
                es5: Y,
                lines: z,
                ownProperties: w
            }),
            $;
        if (A.$async) $ = H.scopeValue("Error", {
            ref: kH9.default,
            code: Yh._`require("ajv/dist/runtime/validation_error").default`
        });
        let O = H.scopeName("validate");
        A.validateName = O;
        let _ = {
                gen: H,
                allErrors: this.opts.allErrors,
                data: Rq1.default.data,
                parentData: Rq1.default.parentData,
                parentDataProperty: Rq1.default.parentDataProperty,
                dataNames: [Rq1.default.data],
                dataPathArr: [Yh.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set,
                topSchemaRef: H.scopeValue("schema", this.opts.code.source === !0 ? {
                    ref: A.schema,
                    code: (0, Yh.stringify)(A.schema)
                } : {
                    ref: A.schema
                }),
                validateName: O,
                ValidationError: $,
                schema: A.schema,
                schemaEnv: A,
                rootId: K,
                baseId: A.baseId || K,
                schemaPath: Yh.nil,
                errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
                errorPath: Yh._`""`,
                opts: this.opts,
                self: this
            },
            J;
        try {
            this._compilations.add(A), (0, LH9.validateFunctionCode)(_), H.optimize(this.opts.code.optimize);
            let X = H.toString();
            if (J = `${H.scopeRefs(Rq1.default.scope)}return ${X}`, this.opts.code.process) J = this.opts.code.process(J, A);
            let j = Function(`${Rq1.default.self}`, `${Rq1.default.scope}`, J)(this, this.scope.get());
            if (this.scope.value(O, {
                    ref: j
                }), j.errors = null, j.schema = A.schema, j.schemaEnv = A, A.$async) j.$async = !0;
            if (this.opts.code.source === !0) j.source = {
                validateName: O,
                validateCode: X,
                scopeValues: H._values
            };
            if (this.opts.unevaluated) {
                let {
                    props: M,
                    items: P
                } = _;
                if (j.evaluated = {
                        props: M instanceof Yh.Name ? void 0 : M,
                        items: P instanceof Yh.Name ? void 0 : P,
                        dynamicProps: M instanceof Yh.Name,
                        dynamicItems: P instanceof Yh.Name
                    }, j.source) j.source.evaluated = (0, Yh.stringify)(j.evaluated)
            }
            return A.validate = j, A
        } catch (X) {
            if (delete A.validate, delete A.validateName, J) this.logger.error("Error compiling schema, function code:", J);
            throw X
        } finally {
            this._compilations.delete(A)
        }
    }
    sC7.compileSchema = qJA;

    function RH9(A, q, K) {
        var Y;
        K = (0, zh.resolveUrl)(this.opts.uriResolver, q, K);
        let z = A.refs[K];
        if (z) return z;
        let w = SH9.call(this, A, K);
        if (w === void 0) {
            let H = (Y = A.localRefs) === null || Y === void 0 ? void 0 : Y[K],
                {
                    schemaId: $
                } = this.opts;
            if (H) w = new Gb1({
                schema: H,
                schemaId: $,
                root: A,
                baseId: q
            })
        }
        if (w === void 0) return;
        return A.refs[K] = yH9.call(this, w)
    }
    sC7.resolveRef = RH9;

    function yH9(A) {
        if ((0, zh.inlineRef)(A.schema, this.opts.inlineRefs)) return A.schema;
        return A.validate ? A : qJA.call(this, A)
    }

    function aC7(A) {
        for (let q of this._compilations)
            if (CH9(q, A)) return q
    }
    sC7.getCompilingSchema = aC7;

    function CH9(A, q) {
        return A.schema === q.schema && A.root === q.root && A.baseId === q.baseId
    }

    function SH9(A, q) {
        let K;
        while (typeof(K = this.refs[q]) == "string") q = K;
        return K || this.schemas[q] || TH6.call(this, A, q)
    }

    function TH6(A, q) {
        let K = this.opts.uriResolver.parse(q),
            Y = (0, zh._getFullPath)(this.opts.uriResolver, K),
            z = (0, zh.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
        if (Object.keys(A.schema).length > 0 && Y === z) return AJA.call(this, K, A);
        let w = (0, zh.normalizeId)(Y),
            H = this.refs[w] || this.schemas[w];
        if (typeof H == "string") {
            let $ = TH6.call(this, A, H);
            if (typeof($ === null || $ === void 0 ? void 0 : $.schema) !== "object") return;
            return AJA.call(this, K, $)
        }
        if (typeof(H === null || H === void 0 ? void 0 : H.schema) !== "object") return;
        if (!H.validate) qJA.call(this, H);
        if (w === (0, zh.normalizeId)(q)) {
            let {
                schema: $
            } = H, {
                schemaId: O
            } = this.opts, _ = $[O];
            if (_) z = (0, zh.resolveUrl)(this.opts.uriResolver, z, _);
            return new Gb1({
                schema: $,
                schemaId: O,
                root: A,
                baseId: z
            })
        }
        return AJA.call(this, K, H)
    }
    sC7.resolveSchema = TH6;
    var hH9 = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);

    function AJA(A, {
        baseId: q,
        schema: K,
        root: Y
    }) {
        var z;
        if (((z = A.fragment) === null || z === void 0 ? void 0 : z[0]) !== "/") return;
        for (let $ of A.fragment.slice(1).split("/")) {
            if (typeof K === "boolean") return;
            let O = K[(0, oC7.unescapeFragment)($)];
            if (O === void 0) return;
            K = O;
            let _ = typeof K === "object" && K[this.opts.schemaId];
            if (!hH9.has($) && _) q = (0, zh.resolveUrl)(this.opts.uriResolver, q, _)
        }
        let w;
        if (typeof K != "boolean" && K.$ref && !(0, oC7.schemaHasRulesButRef)(K, this.RULES)) {
            let $ = (0, zh.resolveUrl)(this.opts.uriResolver, q, K.$ref);
            w = TH6.call(this, Y, $)
        }
        let {
            schemaId: H
        } = this.opts;
        if (w = w || new Gb1({
                schema: K,
                schemaId: H,
                root: Y,
                baseId: q
            }), w.schema !== w.root.schema) return w;
        return
    }
})
// @from(Ln 210630, Col 4)
eC7 = R((dYw, BH9) => {
    BH9.exports = {
        $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
        description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
        type: "object",
        required: ["$data"],
        properties: {
            $data: {
                type: "string",
                anyOf: [{
                    format: "relative-json-pointer"
                }, {
                    format: "json-pointer"
                }]
            }
        },
        additionalProperties: !1
    }
})
// @from(Ln 210649, Col 4)
qS7 = R((cYw, AS7) => {
    var mH9 = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        A: 10,
        b: 11,
        B: 11,
        c: 12,
        C: 12,
        d: 13,
        D: 13,
        e: 14,
        E: 14,
        f: 15,
        F: 15
    };
    AS7.exports = {
        HEX: mH9
    }
})
// @from(Ln 210678, Col 4)
_S7 = R((lYw, OS7) => {
    var {
        HEX: FH9
    } = qS7(), QH9 = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;

    function wS7(A) {
        if ($S7(A, ".") < 3) return {
            host: A,
            isIPV4: !1
        };
        let q = A.match(QH9) || [],
            [K] = q;
        if (K) return {
            host: UH9(K, "."),
            isIPV4: !0
        };
        else return {
            host: A,
            isIPV4: !1
        }
    }

    function KJA(A, q = !1) {
        let K = "",
            Y = !0;
        for (let z of A) {
            if (FH9[z] === void 0) return;
            if (z !== "0" && Y === !0) Y = !1;
            if (!Y) K += z
        }
        if (q && K.length === 0) K = "0";
        return K
    }

    function gH9(A) {
        let q = 0,
            K = {
                error: !1,
                address: "",
                zone: ""
            },
            Y = [],
            z = [],
            w = !1,
            H = !1,
            $ = !1;

        function O() {
            if (z.length) {
                if (w === !1) {
                    let _ = KJA(z);
                    if (_ !== void 0) Y.push(_);
                    else return K.error = !0, !1
                }
                z.length = 0
            }
            return !0
        }
        for (let _ = 0; _ < A.length; _++) {
            let J = A[_];
            if (J === "[" || J === "]") continue;
            if (J === ":") {
                if (H === !0) $ = !0;
                if (!O()) break;
                if (q++, Y.push(":"), q > 7) {
                    K.error = !0;
                    break
                }
                if (_ - 1 >= 0 && A[_ - 1] === ":") H = !0;
                continue
            } else if (J === "%") {
                if (!O()) break;
                w = !0
            } else {
                z.push(J);
                continue
            }
        }
        if (z.length)
            if (w) K.zone = z.join("");
            else if ($) Y.push(z.join(""));
        else Y.push(KJA(z));
        return K.address = Y.join(""), K
    }

    function HS7(A) {
        if ($S7(A, ":") < 2) return {
            host: A,
            isIPV6: !1
        };
        let q = gH9(A);
        if (!q.error) {
            let {
                address: K,
                address: Y
            } = q;
            if (q.zone) K += "%" + q.zone, Y += "%25" + q.zone;
            return {
                host: K,
                escapedHost: Y,
                isIPV6: !0
            }
        } else return {
            host: A,
            isIPV6: !1
        }
    }

    function UH9(A, q) {
        let K = "",
            Y = !0,
            z = A.length;
        for (let w = 0; w < z; w++) {
            let H = A[w];
            if (H === "0" && Y) {
                if (w + 1 <= z && A[w + 1] === q || w + 1 === z) K += H, Y = !1
            } else {
                if (H === q) Y = !0;
                else Y = !1;
                K += H
            }
        }
        return K
    }

    function $S7(A, q) {
        let K = 0;
        for (let Y = 0; Y < A.length; Y++)
            if (A[Y] === q) K++;
        return K
    }
    var KS7 = /^\.\.?\//u,
        YS7 = /^\/\.(?:\/|$)/u,
        zS7 = /^\/\.\.(?:\/|$)/u,
        pH9 = /^\/?(?:.|\n)*?(?=\/|$)/u;

    function dH9(A) {
        let q = [];
        while (A.length)
            if (A.match(KS7)) A = A.replace(KS7, "");
            else if (A.match(YS7)) A = A.replace(YS7, "/");
        else if (A.match(zS7)) A = A.replace(zS7, "/"), q.pop();
        else if (A === "." || A === "..") A = "";
        else {
            let K = A.match(pH9);
            if (K) {
                let Y = K[0];
                A = A.slice(Y.length), q.push(Y)
            } else throw Error("Unexpected dot segment condition")
        }
        return q.join("")
    }

    function cH9(A, q) {
        let K = q !== !0 ? escape : unescape;
        if (A.scheme !== void 0) A.scheme = K(A.scheme);
        if (A.userinfo !== void 0) A.userinfo = K(A.userinfo);
        if (A.host !== void 0) A.host = K(A.host);
        if (A.path !== void 0) A.path = K(A.path);
        if (A.query !== void 0) A.query = K(A.query);
        if (A.fragment !== void 0) A.fragment = K(A.fragment);
        return A
    }

    function lH9(A) {
        let q = [];
        if (A.userinfo !== void 0) q.push(A.userinfo), q.push("@");
        if (A.host !== void 0) {
            let K = unescape(A.host),
                Y = wS7(K);
            if (Y.isIPV4) K = Y.host;
            else {
                let z = HS7(Y.host);
                if (z.isIPV6 === !0) K = `[${z.escapedHost}]`;
                else K = A.host
            }
            q.push(K)
        }
        if (typeof A.port === "number" || typeof A.port === "string") q.push(":"), q.push(String(A.port));
        return q.length ? q.join("") : void 0
    }
    OS7.exports = {
        recomposeAuthority: lH9,
        normalizeComponentEncoding: cH9,
        removeDotSegments: dH9,
        normalizeIPv4: wS7,
        normalizeIPv6: HS7,
        stringArrayToHexStripped: KJA
    }
})
// @from(Ln 210868, Col 4)
PS7 = R((iYw, MS7) => {
    var iH9 = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu,
        nH9 = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;

    function JS7(A) {
        return typeof A.secure === "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss"
    }

    function XS7(A) {
        if (!A.host) A.error = A.error || "HTTP URIs must have a host.";
        return A
    }

    function DS7(A) {
        let q = String(A.scheme).toLowerCase() === "https";
        if (A.port === (q ? 443 : 80) || A.port === "") A.port = void 0;
        if (!A.path) A.path = "/";
        return A
    }

    function rH9(A) {
        return A.secure = JS7(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A
    }

    function oH9(A) {
        if (A.port === (JS7(A) ? 443 : 80) || A.port === "") A.port = void 0;
        if (typeof A.secure === "boolean") A.scheme = A.secure ? "wss" : "ws", A.secure = void 0;
        if (A.resourceName) {
            let [q, K] = A.resourceName.split("?");
            A.path = q && q !== "/" ? q : void 0, A.query = K, A.resourceName = void 0
        }
        return A.fragment = void 0, A
    }

    function aH9(A, q) {
        if (!A.path) return A.error = "URN can not be parsed", A;
        let K = A.path.match(nH9);
        if (K) {
            let Y = q.scheme || A.scheme || "urn";
            A.nid = K[1].toLowerCase(), A.nss = K[2];
            let z = `${Y}:${q.nid||A.nid}`,
                w = YJA[z];
            if (A.path = void 0, w) A = w.parse(A, q)
        } else A.error = A.error || "URN can not be parsed.";
        return A
    }

    function sH9(A, q) {
        let K = q.scheme || A.scheme || "urn",
            Y = A.nid.toLowerCase(),
            z = `${K}:${q.nid||Y}`,
            w = YJA[z];
        if (w) A = w.serialize(A, q);
        let H = A,
            $ = A.nss;
        return H.path = `${Y||q.nid}:${$}`, q.skipEscape = !0, H
    }

    function tH9(A, q) {
        let K = A;
        if (K.uuid = K.nss, K.nss = void 0, !q.tolerant && (!K.uuid || !iH9.test(K.uuid))) K.error = K.error || "UUID is not valid.";
        return K
    }

    function eH9(A) {
        let q = A;
        return q.nss = (A.uuid || "").toLowerCase(), q
    }
    var jS7 = {
            scheme: "http",
            domainHost: !0,
            parse: XS7,
            serialize: DS7
        },
        A$9 = {
            scheme: "https",
            domainHost: jS7.domainHost,
            parse: XS7,
            serialize: DS7
        },
        EH6 = {
            scheme: "ws",
            domainHost: !0,
            parse: rH9,
            serialize: oH9
        },
        q$9 = {
            scheme: "wss",
            domainHost: EH6.domainHost,
            parse: EH6.parse,
            serialize: EH6.serialize
        },
        K$9 = {
            scheme: "urn",
            parse: aH9,
            serialize: sH9,
            skipNormalize: !0
        },
        Y$9 = {
            scheme: "urn:uuid",
            parse: tH9,
            serialize: eH9,
            skipNormalize: !0
        },
        YJA = {
            http: jS7,
            https: A$9,
            ws: EH6,
            wss: q$9,
            urn: K$9,
            "urn:uuid": Y$9
        };
    MS7.exports = YJA
})
// @from(Ln 210982, Col 4)
GS7 = R((nYw, LH6) => {
    var {
        normalizeIPv6: z$9,
        normalizeIPv4: w$9,
        removeDotSegments: Zb1,
        recomposeAuthority: H$9,
        normalizeComponentEncoding: kH6
    } = _S7(), zJA = PS7();

    function $$9(A, q) {
        if (typeof A === "string") A = VB(Dp(A, q), q);
        else if (typeof A === "object") A = Dp(VB(A, q), q);
        return A
    }

    function O$9(A, q, K) {
        let Y = Object.assign({
                scheme: "null"
            }, K),
            z = WS7(Dp(A, Y), Dp(q, Y), Y, !0);
        return VB(z, {
            ...Y,
            skipEscape: !0
        })
    }

    function WS7(A, q, K, Y) {
        let z = {};
        if (!Y) A = Dp(VB(A, K), K), q = Dp(VB(q, K), K);
        if (K = K || {}, !K.tolerant && q.scheme) z.scheme = q.scheme, z.userinfo = q.userinfo, z.host = q.host, z.port = q.port, z.path = Zb1(q.path || ""), z.query = q.query;
        else {
            if (q.userinfo !== void 0 || q.host !== void 0 || q.port !== void 0) z.userinfo = q.userinfo, z.host = q.host, z.port = q.port, z.path = Zb1(q.path || ""), z.query = q.query;
            else {
                if (!q.path)
                    if (z.path = A.path, q.query !== void 0) z.query = q.query;
                    else z.query = A.query;
                else {
                    if (q.path.charAt(0) === "/") z.path = Zb1(q.path);
                    else {
                        if ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path) z.path = "/" + q.path;
                        else if (!A.path) z.path = q.path;
                        else z.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + q.path;
                        z.path = Zb1(z.path)
                    }
                    z.query = q.query
                }
                z.userinfo = A.userinfo, z.host = A.host, z.port = A.port
            }
            z.scheme = A.scheme
        }
        return z.fragment = q.fragment, z
    }

    function _$9(A, q, K) {
        if (typeof A === "string") A = unescape(A), A = VB(kH6(Dp(A, K), !0), {
            ...K,
            skipEscape: !0
        });
        else if (typeof A === "object") A = VB(kH6(A, !0), {
            ...K,
            skipEscape: !0
        });
        if (typeof q === "string") q = unescape(q), q = VB(kH6(Dp(q, K), !0), {
            ...K,
            skipEscape: !0
        });
        else if (typeof q === "object") q = VB(kH6(q, !0), {
            ...K,
            skipEscape: !0
        });
        return A.toLowerCase() === q.toLowerCase()
    }

    function VB(A, q) {
        let K = {
                host: A.host,
                scheme: A.scheme,
                userinfo: A.userinfo,
                port: A.port,
                path: A.path,
                query: A.query,
                nid: A.nid,
                nss: A.nss,
                uuid: A.uuid,
                fragment: A.fragment,
                reference: A.reference,
                resourceName: A.resourceName,
                secure: A.secure,
                error: ""
            },
            Y = Object.assign({}, q),
            z = [],
            w = zJA[(Y.scheme || K.scheme || "").toLowerCase()];
        if (w && w.serialize) w.serialize(K, Y);
        if (K.path !== void 0)
            if (!Y.skipEscape) {
                if (K.path = escape(K.path), K.scheme !== void 0) K.path = K.path.split("%3A").join(":")
            } else K.path = unescape(K.path);
        if (Y.reference !== "suffix" && K.scheme) z.push(K.scheme, ":");
        let H = H$9(K);
        if (H !== void 0) {
            if (Y.reference !== "suffix") z.push("//");
            if (z.push(H), K.path && K.path.charAt(0) !== "/") z.push("/")
        }
        if (K.path !== void 0) {
            let $ = K.path;
            if (!Y.absolutePath && (!w || !w.absolutePath)) $ = Zb1($);
            if (H === void 0) $ = $.replace(/^\/\//u, "/%2F");
            z.push($)
        }
        if (K.query !== void 0) z.push("?", K.query);
        if (K.fragment !== void 0) z.push("#", K.fragment);
        return z.join("")
    }
    var J$9 = Array.from({
        length: 127
    }, (A, q) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(q)));

    function X$9(A) {
        let q = 0;
        for (let K = 0, Y = A.length; K < Y; ++K)
            if (q = A.charCodeAt(K), q > 126 || J$9[q]) return !0;
        return !1
    }
    var D$9 = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;

    function Dp(A, q) {
        let K = Object.assign({}, q),
            Y = {
                scheme: void 0,
                userinfo: void 0,
                host: "",
                port: void 0,
                path: "",
                query: void 0,
                fragment: void 0
            },
            z = A.indexOf("%") !== -1,
            w = !1;
        if (K.reference === "suffix") A = (K.scheme ? K.scheme + ":" : "") + "//" + A;
        let H = A.match(D$9);
        if (H) {
            if (Y.scheme = H[1], Y.userinfo = H[3], Y.host = H[4], Y.port = parseInt(H[5], 10), Y.path = H[6] || "", Y.query = H[7], Y.fragment = H[8], isNaN(Y.port)) Y.port = H[5];
            if (Y.host) {
                let O = w$9(Y.host);
                if (O.isIPV4 === !1) {
                    let _ = z$9(O.host);
                    Y.host = _.host.toLowerCase(), w = _.isIPV6
                } else Y.host = O.host, w = !0
            }
            if (Y.scheme === void 0 && Y.userinfo === void 0 && Y.host === void 0 && Y.port === void 0 && Y.query === void 0 && !Y.path) Y.reference = "same-document";
            else if (Y.scheme === void 0) Y.reference = "relative";
            else if (Y.fragment === void 0) Y.reference = "absolute";
            else Y.reference = "uri";
            if (K.reference && K.reference !== "suffix" && K.reference !== Y.reference) Y.error = Y.error || "URI is not a " + K.reference + " reference.";
            let $ = zJA[(K.scheme || Y.scheme || "").toLowerCase()];
            if (!K.unicodeSupport && (!$ || !$.unicodeSupport)) {
                if (Y.host && (K.domainHost || $ && $.domainHost) && w === !1 && X$9(Y.host)) try {
                    Y.host = URL.domainToASCII(Y.host.toLowerCase())
                } catch (O) {
                    Y.error = Y.error || "Host's domain name can not be converted to ASCII: " + O
                }
            }
            if (!$ || $ && !$.skipNormalize) {
                if (z && Y.scheme !== void 0) Y.scheme = unescape(Y.scheme);
                if (z && Y.host !== void 0) Y.host = unescape(Y.host);
                if (Y.path) Y.path = escape(unescape(Y.path));
                if (Y.fragment) Y.fragment = encodeURI(decodeURIComponent(Y.fragment))
            }
            if ($ && $.parse) $.parse(Y, K)
        } else Y.error = Y.error || "URI can not be parsed.";
        return Y
    }
    var wJA = {
        SCHEMES: zJA,
        normalize: $$9,
        resolve: O$9,
        resolveComponents: WS7,
        equal: _$9,
        serialize: VB,
        parse: Dp
    };
    LH6.exports = wJA;
    LH6.exports.default = wJA;
    LH6.exports.fastUri = wJA
})
// @from(Ln 211168, Col 4)
VS7 = R((fS7) => {
    Object.defineProperty(fS7, "__esModule", {
        value: !0
    });
    var ZS7 = GS7();
    ZS7.code = 'require("ajv/dist/runtime/uri").default';
    fS7.default = ZS7
})
// @from(Ln 211176, Col 4)
yS7 = R((jp) => {
    Object.defineProperty(jp, "__esModule", {
        value: !0
    });
    jp.CodeGen = jp.Name = jp.nil = jp.stringify = jp.str = jp._ = jp.KeywordCxt = void 0;
    var M$9 = Pb1();
    Object.defineProperty(jp, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return M$9.KeywordCxt
        }
    });
    var N01 = p5();
    Object.defineProperty(jp, "_", {
        enumerable: !0,
        get: function() {
            return N01._
        }
    });
    Object.defineProperty(jp, "str", {
        enumerable: !0,
        get: function() {
            return N01.str
        }
    });
    Object.defineProperty(jp, "stringify", {
        enumerable: !0,
        get: function() {
            return N01.stringify
        }
    });
    Object.defineProperty(jp, "nil", {
        enumerable: !0,
        get: function() {
            return N01.nil
        }
    });
    Object.defineProperty(jp, "Name", {
        enumerable: !0,
        get: function() {
            return N01.Name
        }
    });
    Object.defineProperty(jp, "CodeGen", {
        enumerable: !0,
        get: function() {
            return N01.CodeGen
        }
    });
    var P$9 = NH6(),
        kS7 = Wb1(),
        W$9 = Q_A(),
        fb1 = vH6(),
        G$9 = p5(),
        Vb1 = Db1(),
        RH6 = Xb1(),
        $JA = dY(),
        NS7 = eC7(),
        Z$9 = VS7(),
        LS7 = (A, q) => new RegExp(A, q);
    LS7.code = "new RegExp";
    var f$9 = ["removeAdditional", "useDefaults", "coerceTypes"],
        V$9 = new Set(["validate", "serialize", "parse", "wrapper", "root", "schema", "keyword", "pattern", "formats", "validate$data", "func", "obj", "Error"]),
        N$9 = {
            errorDataPath: "",
            format: "`validateFormats: false` can be used instead.",
            nullable: '"nullable" keyword is supported by default.',
            jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
            extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
            missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
            processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
            sourceCode: "Use option `code: {source: true}`",
            strictDefaults: "It is default now, see option `strict`.",
            strictKeywords: "It is default now, see option `strict`.",
            uniqueItems: '"uniqueItems" keyword is always validated.',
            unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
            cache: "Map is used as cache, schema object as key.",
            serialize: "Map is used as cache, schema object as key.",
            ajvErrors: "It is default now."
        },
        T$9 = {
            ignoreKeywordsWithRef: "",
            jsPropertySyntax: "",
            unicode: '"minLength"/"maxLength" account for unicode characters by default.'
        },
        TS7 = 200;

    function v$9(A) {
        var q, K, Y, z, w, H, $, O, _, J, X, D, j, M, P, W, G, f, Z, N, T, k, y, B, S;
        let m = A.strict,
            b = (q = A.code) === null || q === void 0 ? void 0 : q.optimize,
            g = b === !0 || b === void 0 ? 1 : b || 0,
            U = (Y = (K = A.code) === null || K === void 0 ? void 0 : K.regExp) !== null && Y !== void 0 ? Y : LS7,
            x = (z = A.uriResolver) !== null && z !== void 0 ? z : Z$9.default;
        return {
            strictSchema: (H = (w = A.strictSchema) !== null && w !== void 0 ? w : m) !== null && H !== void 0 ? H : !0,
            strictNumbers: (O = ($ = A.strictNumbers) !== null && $ !== void 0 ? $ : m) !== null && O !== void 0 ? O : !0,
            strictTypes: (J = (_ = A.strictTypes) !== null && _ !== void 0 ? _ : m) !== null && J !== void 0 ? J : "log",
            strictTuples: (D = (X = A.strictTuples) !== null && X !== void 0 ? X : m) !== null && D !== void 0 ? D : "log",
            strictRequired: (M = (j = A.strictRequired) !== null && j !== void 0 ? j : m) !== null && M !== void 0 ? M : !1,
            code: A.code ? {
                ...A.code,
                optimize: g,
                regExp: U
            } : {
                optimize: g,
                regExp: U
            },
            loopRequired: (P = A.loopRequired) !== null && P !== void 0 ? P : TS7,
            loopEnum: (W = A.loopEnum) !== null && W !== void 0 ? W : TS7,
            meta: (G = A.meta) !== null && G !== void 0 ? G : !0,
            messages: (f = A.messages) !== null && f !== void 0 ? f : !0,
            inlineRefs: (Z = A.inlineRefs) !== null && Z !== void 0 ? Z : !0,
            schemaId: (N = A.schemaId) !== null && N !== void 0 ? N : "$id",
            addUsedSchema: (T = A.addUsedSchema) !== null && T !== void 0 ? T : !0,
            validateSchema: (k = A.validateSchema) !== null && k !== void 0 ? k : !0,
            validateFormats: (y = A.validateFormats) !== null && y !== void 0 ? y : !0,
            unicodeRegExp: (B = A.unicodeRegExp) !== null && B !== void 0 ? B : !0,
            int32range: (S = A.int32range) !== null && S !== void 0 ? S : !0,
            uriResolver: x
        }
    }
    class yH6 {
        constructor(A = {}) {
            this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = new Set, this._loading = {}, this._cache = new Map, A = this.opts = {
                ...A,
                ...v$9(A)
            };
            let {
                es5: q,
                lines: K
            } = this.opts.code;
            this.scope = new G$9.ValueScope({
                scope: {},
                prefixes: V$9,
                es5: q,
                lines: K
            }), this.logger = C$9(A.logger);
            let Y = A.validateFormats;
            if (A.validateFormats = !1, this.RULES = (0, W$9.getRules)(), vS7.call(this, N$9, A, "NOT SUPPORTED"), vS7.call(this, T$9, A, "DEPRECATED", "warn"), this._metaOpts = R$9.call(this), A.formats) k$9.call(this);
            if (this._addVocabularies(), this._addDefaultMetaSchema(), A.keywords) L$9.call(this, A.keywords);
            if (typeof A.meta == "object") this.addMetaSchema(A.meta);
            E$9.call(this), A.validateFormats = Y
        }
        _addVocabularies() {
            this.addKeyword("$async")
        }
        _addDefaultMetaSchema() {
            let {
                $data: A,
                meta: q,
                schemaId: K
            } = this.opts, Y = NS7;
            if (K === "id") Y = {
                ...NS7
            }, Y.id = Y.$id, delete Y.$id;
            if (q && A) this.addMetaSchema(Y, Y[K], !1)
        }
        defaultMeta() {
            let {
                meta: A,
                schemaId: q
            } = this.opts;
            return this.opts.defaultMeta = typeof A == "object" ? A[q] || A : void 0
        }
        validate(A, q) {
            let K;
            if (typeof A == "string") {
                if (K = this.getSchema(A), !K) throw Error(`no schema with key or ref "${A}"`)
            } else K = this.compile(A);
            let Y = K(q);
            if (!("$async" in K)) this.errors = K.errors;
            return Y
        }
        compile(A, q) {
            let K = this._addSchema(A, q);
            return K.validate || this._compileSchemaEnv(K)
        }
        compileAsync(A, q) {
            if (typeof this.opts.loadSchema != "function") throw Error("options.loadSchema should be a function");
            let {
                loadSchema: K
            } = this.opts;
            return Y.call(this, A, q);
            async function Y(_, J) {
                await z.call(this, _.$schema);
                let X = this._addSchema(_, J);
                return X.validate || w.call(this, X)
            }
            async function z(_) {
                if (_ && !this.getSchema(_)) await Y.call(this, {
                    $ref: _
                }, !0)
            }
            async function w(_) {
                try {
                    return this._compileSchemaEnv(_)
                } catch (J) {
                    if (!(J instanceof kS7.default)) throw J;
                    return H.call(this, J), await $.call(this, J.missingSchema), w.call(this, _)
                }
            }

            function H({
                missingSchema: _,
                missingRef: J
            }) {
                if (this.refs[_]) throw Error(`AnySchema ${_} is loaded but ${J} cannot be resolved`)
            }
            async function $(_) {
                let J = await O.call(this, _);
                if (!this.refs[_]) await z.call(this, J.$schema);
                if (!this.refs[_]) this.addSchema(J, _, q)
            }
            async function O(_) {
                let J = this._loading[_];
                if (J) return J;
                try {
                    return await (this._loading[_] = K(_))
                } finally {
                    delete this._loading[_]
                }
            }
        }
        addSchema(A, q, K, Y = this.opts.validateSchema) {
            if (Array.isArray(A)) {
                for (let w of A) this.addSchema(w, void 0, K, Y);
                return this
            }
            let z;
            if (typeof A === "object") {
                let {
                    schemaId: w
                } = this.opts;
                if (z = A[w], z !== void 0 && typeof z != "string") throw Error(`schema ${w} must be string`)
            }
            return q = (0, Vb1.normalizeId)(q || z), this._checkUnique(q), this.schemas[q] = this._addSchema(A, K, q, Y, !0), this
        }
        addMetaSchema(A, q, K = this.opts.validateSchema) {
            return this.addSchema(A, q, !0, K), this
        }
        validateSchema(A, q) {
            if (typeof A == "boolean") return !0;
            let K;
            if (K = A.$schema, K !== void 0 && typeof K != "string") throw Error("$schema must be a string");
            if (K = K || this.opts.defaultMeta || this.defaultMeta(), !K) return this.logger.warn("meta-schema not available"), this.errors = null, !0;
            let Y = this.validate(K, A);
            if (!Y && q) {
                let z = "schema is invalid: " + this.errorsText();
                if (this.opts.validateSchema === "log") this.logger.error(z);
                else throw Error(z)
            }
            return Y
        }
        getSchema(A) {
            let q;
            while (typeof(q = ES7.call(this, A)) == "string") A = q;
            if (q === void 0) {
                let {
                    schemaId: K
                } = this.opts, Y = new fb1.SchemaEnv({
                    schema: {},
                    schemaId: K
                });
                if (q = fb1.resolveSchema.call(this, Y, A), !q) return;
                this.refs[A] = q
            }
            return q.validate || this._compileSchemaEnv(q)
        }
        removeSchema(A) {
            if (A instanceof RegExp) return this._removeAllSchemas(this.schemas, A), this._removeAllSchemas(this.refs, A), this;
            switch (typeof A) {
                case "undefined":
                    return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
                case "string": {
                    let q = ES7.call(this, A);
                    if (typeof q == "object") this._cache.delete(q.schema);
                    return delete this.schemas[A], delete this.refs[A], this
                }
                case "object": {
                    let q = A;
                    this._cache.delete(q);
                    let K = A[this.opts.schemaId];
                    if (K) K = (0, Vb1.normalizeId)(K), delete this.schemas[K], delete this.refs[K];
                    return this
                }
                default:
                    throw Error("ajv.removeSchema: invalid parameter")
            }
        }
        addVocabulary(A) {
            for (let q of A) this.addKeyword(q);
            return this
        }
        addKeyword(A, q) {
            let K;
            if (typeof A == "string") {
                if (K = A, typeof q == "object") this.logger.warn("these parameters are deprecated, see docs for addKeyword"), q.keyword = K
            } else if (typeof A == "object" && q === void 0) {
                if (q = A, K = q.keyword, Array.isArray(K) && !K.length) throw Error("addKeywords: keyword must be string or non-empty array")
            } else throw Error("invalid addKeywords parameters");
            if (h$9.call(this, K, q), !q) return (0, $JA.eachItem)(K, (z) => HJA.call(this, z)), this;
            x$9.call(this, q);
            let Y = {
                ...q,
                type: (0, RH6.getJSONTypes)(q.type),
                schemaType: (0, RH6.getJSONTypes)(q.schemaType)
            };
            return (0, $JA.eachItem)(K, Y.type.length === 0 ? (z) => HJA.call(this, z, Y) : (z) => Y.type.forEach((w) => HJA.call(this, z, Y, w))), this
        }
        getKeyword(A) {
            let q = this.RULES.all[A];
            return typeof q == "object" ? q.definition : !!q
        }
        removeKeyword(A) {
            let {
                RULES: q
            } = this;
            delete q.keywords[A], delete q.all[A];
            for (let K of q.rules) {
                let Y = K.rules.findIndex((z) => z.keyword === A);
                if (Y >= 0) K.rules.splice(Y, 1)
            }
            return this
        }
        addFormat(A, q) {
            if (typeof q == "string") q = new RegExp(q);
            return this.formats[A] = q, this
        }
        errorsText(A = this.errors, {
            separator: q = ", ",
            dataVar: K = "data"
        } = {}) {
            if (!A || A.length === 0) return "No errors";
            return A.map((Y) => `${K}${Y.instancePath} ${Y.message}`).reduce((Y, z) => Y + q + z)
        }
        $dataMetaSchema(A, q) {
            let K = this.RULES.all;
            A = JSON.parse(JSON.stringify(A));
            for (let Y of q) {
                let z = Y.split("/").slice(1),
                    w = A;
                for (let H of z) w = w[H];
                for (let H in K) {
                    let $ = K[H];
                    if (typeof $ != "object") continue;
                    let {
                        $data: O
                    } = $.definition, _ = w[H];
                    if (O && _) w[H] = RS7(_)
                }
            }
            return A
        }
        _removeAllSchemas(A, q) {
            for (let K in A) {
                let Y = A[K];
                if (!q || q.test(K)) {
                    if (typeof Y == "string") delete A[K];
                    else if (Y && !Y.meta) this._cache.delete(Y.schema), delete A[K]
                }
            }
        }
        _addSchema(A, q, K, Y = this.opts.validateSchema, z = this.opts.addUsedSchema) {
            let w, {
                schemaId: H
            } = this.opts;
            if (typeof A == "object") w = A[H];
            else if (this.opts.jtd) throw Error("schema must be object");
            else if (typeof A != "boolean") throw Error("schema must be object or boolean");
            let $ = this._cache.get(A);
            if ($ !== void 0) return $;
            K = (0, Vb1.normalizeId)(w || K);
            let O = Vb1.getSchemaRefs.call(this, A, K);
            if ($ = new fb1.SchemaEnv({
                    schema: A,
                    schemaId: H,
                    meta: q,
                    baseId: K,
                    localRefs: O
                }), this._cache.set($.schema, $), z && !K.startsWith("#")) {
                if (K) this._checkUnique(K);
                this.refs[K] = $
            }
            if (Y) this.validateSchema(A, !0);
            return $
        }
        _checkUnique(A) {
            if (this.schemas[A] || this.refs[A]) throw Error(`schema with key or id "${A}" already exists`)
        }
        _compileSchemaEnv(A) {
            if (A.meta) this._compileMetaSchema(A);
            else fb1.compileSchema.call(this, A);
            if (!A.validate) throw Error("ajv implementation error");
            return A.validate
        }
        _compileMetaSchema(A) {
            let q = this.opts;
            this.opts = this._metaOpts;
            try {
                fb1.compileSchema.call(this, A)
            } finally {
                this.opts = q
            }
        }
    }
    yH6.ValidationError = P$9.default;
    yH6.MissingRefError = kS7.default;
    jp.default = yH6;

    function vS7(A, q, K, Y = "error") {
        for (let z in A) {
            let w = z;
            if (w in q) this.logger[Y](`${K}: option ${z}. ${A[w]}`)
        }
    }

    function ES7(A) {
        return A = (0, Vb1.normalizeId)(A), this.schemas[A] || this.refs[A]
    }

    function E$9() {
        let A = this.opts.schemas;
        if (!A) return;
        if (Array.isArray(A)) this.addSchema(A);
        else
            for (let q in A) this.addSchema(A[q], q)
    }

    function k$9() {
        for (let A in this.opts.formats) {
            let q = this.opts.formats[A];
            if (q) this.addFormat(A, q)
        }
    }

    function L$9(A) {
        if (Array.isArray(A)) {
            this.addVocabulary(A);
            return
        }
        this.logger.warn("keywords option as map is deprecated, pass array");
        for (let q in A) {
            let K = A[q];
            if (!K.keyword) K.keyword = q;
            this.addKeyword(K)
        }
    }

    function R$9() {
        let A = {
            ...this.opts
        };
        for (let q of f$9) delete A[q];
        return A
    }
    var y$9 = {
        log() {},
        warn() {},
        error() {}
    };

    function C$9(A) {
        if (A === !1) return y$9;
        if (A === void 0) return console;
        if (A.log && A.warn && A.error) return A;
        throw Error("logger must implement log, warn and error methods")
    }
    var S$9 = /^[a-z_$][a-z0-9_$:-]*$/i;

    function h$9(A, q) {
        let {
            RULES: K
        } = this;
        if ((0, $JA.eachItem)(A, (Y) => {
                if (K.keywords[Y]) throw Error(`Keyword ${Y} is already defined`);
                if (!S$9.test(Y)) throw Error(`Keyword ${Y} has invalid name`)
            }), !q) return;
        if (q.$data && !(("code" in q) || ("validate" in q))) throw Error('$data keyword must have "code" or "validate" function')
    }

    function HJA(A, q, K) {
        var Y;
        let z = q === null || q === void 0 ? void 0 : q.post;
        if (K && z) throw Error('keyword with "post" flag cannot have "type"');
        let {
            RULES: w
        } = this, H = z ? w.post : w.rules.find(({
            type: O
        }) => O === K);
        if (!H) H = {
            type: K,
            rules: []
        }, w.rules.push(H);
        if (w.keywords[A] = !0, !q) return;
        let $ = {
            keyword: A,
            definition: {
                ...q,
                type: (0, RH6.getJSONTypes)(q.type),
                schemaType: (0, RH6.getJSONTypes)(q.schemaType)
            }
        };
        if (q.before) I$9.call(this, H, $, q.before);
        else H.rules.push($);
        w.all[A] = $, (Y = q.implements) === null || Y === void 0 || Y.forEach((O) => this.addKeyword(O))
    }

    function I$9(A, q, K) {
        let Y = A.rules.findIndex((z) => z.keyword === K);
        if (Y >= 0) A.rules.splice(Y, 0, q);
        else A.rules.push(q), this.logger.warn(`rule ${K} is not defined`)
    }

    function x$9(A) {
        let {
            metaSchema: q
        } = A;
        if (q === void 0) return;
        if (A.$data && this.opts.$data) q = RS7(q);
        A.validateSchema = this.compile(q, !0)
    }
    var b$9 = {
        $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };

    function RS7(A) {
        return {
            anyOf: [A, b$9]
        }
    }
})
// @from(Ln 211708, Col 4)
SS7 = R((CS7) => {
    Object.defineProperty(CS7, "__esModule", {
        value: !0
    });
    var m$9 = {
        keyword: "id",
        code() {
            throw Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')
        }
    };
    CS7.default = m$9
})
// @from(Ln 211720, Col 4)
BS7 = R((bS7) => {
    Object.defineProperty(bS7, "__esModule", {
        value: !0
    });
    bS7.callRef = bS7.getValidate = void 0;
    var Q$9 = Wb1(),
        hS7 = tL(),
        pV = p5(),
        T01 = Jp(),
        IS7 = vH6(),
        CH6 = dY(),
        g$9 = {
            keyword: "$ref",
            schemaType: "string",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    it: Y
                } = A, {
                    baseId: z,
                    schemaEnv: w,
                    validateName: H,
                    opts: $,
                    self: O
                } = Y, {
                    root: _
                } = w;
                if ((K === "#" || K === "#/") && z === _.baseId) return X();
                let J = IS7.resolveRef.call(O, _, z, K);
                if (J === void 0) throw new Q$9.default(Y.opts.uriResolver, z, K);
                if (J instanceof IS7.SchemaEnv) return D(J);
                return j(J);

                function X() {
                    if (w === _) return SH6(A, H, w, w.$async);
                    let M = q.scopeValue("root", {
                        ref: _
                    });
                    return SH6(A, pV._`${M}.validate`, _, _.$async)
                }

                function D(M) {
                    let P = xS7(A, M);
                    SH6(A, P, M, M.$async)
                }

                function j(M) {
                    let P = q.scopeValue("schema", $.code.source === !0 ? {
                            ref: M,
                            code: (0, pV.stringify)(M)
                        } : {
                            ref: M
                        }),
                        W = q.name("valid"),
                        G = A.subschema({
                            schema: M,
                            dataTypes: [],
                            schemaPath: pV.nil,
                            topSchemaRef: P,
                            errSchemaPath: K
                        }, W);
                    A.mergeEvaluated(G), A.ok(W)
                }
            }
        };

    function xS7(A, q) {
        let {
            gen: K
        } = A;
        return q.validate ? K.scopeValue("validate", {
            ref: q.validate
        }) : pV._`${K.scopeValue("wrapper",{ref:q})}.validate`
    }
    bS7.getValidate = xS7;

    function SH6(A, q, K, Y) {
        let {
            gen: z,
            it: w
        } = A, {
            allErrors: H,
            schemaEnv: $,
            opts: O
        } = w, _ = O.passContext ? T01.default.this : pV.nil;
        if (Y) J();
        else X();

        function J() {
            if (!$.$async) throw Error("async schema referenced by sync schema");
            let M = z.let("valid");
            z.try(() => {
                if (z.code(pV._`await ${(0,hS7.callValidateCode)(A,q,_)}`), j(q), !H) z.assign(M, !0)
            }, (P) => {
                if (z.if(pV._`!(${P} instanceof ${w.ValidationError})`, () => z.throw(P)), D(P), !H) z.assign(M, !1)
            }), A.ok(M)
        }

        function X() {
            A.result((0, hS7.callValidateCode)(A, q, _), () => j(q), () => D(q))
        }

        function D(M) {
            let P = pV._`${M}.errors`;
            z.assign(T01.default.vErrors, pV._`${T01.default.vErrors} === null ? ${P} : ${T01.default.vErrors}.concat(${P})`), z.assign(T01.default.errors, pV._`${T01.default.vErrors}.length`)
        }

        function j(M) {
            var P;
            if (!w.opts.unevaluated) return;
            let W = (P = K === null || K === void 0 ? void 0 : K.validate) === null || P === void 0 ? void 0 : P.evaluated;
            if (w.props !== !0)
                if (W && !W.dynamicProps) {
                    if (W.props !== void 0) w.props = CH6.mergeEvaluated.props(z, W.props, w.props)
                } else {
                    let G = z.var("props", pV._`${M}.evaluated.props`);
                    w.props = CH6.mergeEvaluated.props(z, G, w.props, pV.Name)
                } if (w.items !== !0)
                if (W && !W.dynamicItems) {
                    if (W.items !== void 0) w.items = CH6.mergeEvaluated.items(z, W.items, w.items)
                } else {
                    let G = z.var("items", pV._`${M}.evaluated.items`);
                    w.items = CH6.mergeEvaluated.items(z, G, w.items, pV.Name)
                }
        }
    }
    bS7.callRef = SH6;
    bS7.default = g$9
})
// @from(Ln 211850, Col 4)
FS7 = R((mS7) => {
    Object.defineProperty(mS7, "__esModule", {
        value: !0
    });
    var d$9 = SS7(),
        c$9 = BS7(),
        l$9 = ["$schema", "$id", "$defs", "$vocabulary", {
            keyword: "$comment"
        }, "definitions", d$9.default, c$9.default];
    mS7.default = l$9
})
// @from(Ln 211861, Col 4)
gS7 = R((QS7) => {
    Object.defineProperty(QS7, "__esModule", {
        value: !0
    });
    var hH6 = p5(),
        Ya = hH6.operators,
        IH6 = {
            maximum: {
                okStr: "<=",
                ok: Ya.LTE,
                fail: Ya.GT
            },
            minimum: {
                okStr: ">=",
                ok: Ya.GTE,
                fail: Ya.LT
            },
            exclusiveMaximum: {
                okStr: "<",
                ok: Ya.LT,
                fail: Ya.GTE
            },
            exclusiveMinimum: {
                okStr: ">",
                ok: Ya.GT,
                fail: Ya.LTE
            }
        },
        n$9 = {
            message: ({
                keyword: A,
                schemaCode: q
            }) => hH6.str`must be ${IH6[A].okStr} ${q}`,
            params: ({
                keyword: A,
                schemaCode: q
            }) => hH6._`{comparison: ${IH6[A].okStr}, limit: ${q}}`
        },
        r$9 = {
            keyword: Object.keys(IH6),
            type: "number",
            schemaType: "number",
            $data: !0,
            error: n$9,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A;
                A.fail$data(hH6._`${K} ${IH6[q].fail} ${Y} || isNaN(${K})`)
            }
        };
    QS7.default = r$9
})
// @from(Ln 211916, Col 4)
pS7 = R((US7) => {
    Object.defineProperty(US7, "__esModule", {
        value: !0
    });
    var Nb1 = p5(),
        a$9 = {
            message: ({
                schemaCode: A
            }) => Nb1.str`must be multiple of ${A}`,
            params: ({
                schemaCode: A
            }) => Nb1._`{multipleOf: ${A}}`
        },
        s$9 = {
            keyword: "multipleOf",
            type: "number",
            schemaType: "number",
            $data: !0,
            error: a$9,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    schemaCode: Y,
                    it: z
                } = A, w = z.opts.multipleOfPrecision, H = q.let("res"), $ = w ? Nb1._`Math.abs(Math.round(${H}) - ${H}) > 1e-${w}` : Nb1._`${H} !== parseInt(${H})`;
                A.fail$data(Nb1._`(${Y} === 0 || (${H} = ${K}/${Y}, ${$}))`)
            }
        };
    US7.default = s$9
})
// @from(Ln 211947, Col 4)
lS7 = R((cS7) => {
    Object.defineProperty(cS7, "__esModule", {
        value: !0
    });

    function dS7(A) {
        let q = A.length,
            K = 0,
            Y = 0,
            z;
        while (Y < q)
            if (K++, z = A.charCodeAt(Y++), z >= 55296 && z <= 56319 && Y < q) {
                if (z = A.charCodeAt(Y), (z & 64512) === 56320) Y++
            } return K
    }
    cS7.default = dS7;
    dS7.code = 'require("ajv/dist/runtime/ucs2length").default'
})
// @from(Ln 211965, Col 4)
nS7 = R((iS7) => {
    Object.defineProperty(iS7, "__esModule", {
        value: !0
    });
    var yq1 = p5(),
        AO9 = dY(),
        qO9 = lS7(),
        KO9 = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxLength" ? "more" : "fewer";
                return yq1.str`must NOT have ${K} than ${q} characters`
            },
            params: ({
                schemaCode: A
            }) => yq1._`{limit: ${A}}`
        },
        YO9 = {
            keyword: ["maxLength", "minLength"],
            type: "string",
            schemaType: "number",
            $data: !0,
            error: KO9,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y,
                    it: z
                } = A, w = q === "maxLength" ? yq1.operators.GT : yq1.operators.LT, H = z.opts.unicode === !1 ? yq1._`${K}.length` : yq1._`${(0,AO9.useFunc)(A.gen,qO9.default)}(${K})`;
                A.fail$data(yq1._`${H} ${w} ${Y}`)
            }
        };
    iS7.default = YO9
})
// @from(Ln 212002, Col 4)
oS7 = R((rS7) => {
    Object.defineProperty(rS7, "__esModule", {
        value: !0
    });
    var wO9 = tL(),
        xH6 = p5(),
        HO9 = {
            message: ({
                schemaCode: A
            }) => xH6.str`must match pattern "${A}"`,
            params: ({
                schemaCode: A
            }) => xH6._`{pattern: ${A}}`
        },
        $O9 = {
            keyword: "pattern",
            type: "string",
            schemaType: "string",
            $data: !0,
            error: HO9,
            code(A) {
                let {
                    data: q,
                    $data: K,
                    schema: Y,
                    schemaCode: z,
                    it: w
                } = A, H = w.opts.unicodeRegExp ? "u" : "", $ = K ? xH6._`(new RegExp(${z}, ${H}))` : (0, wO9.usePattern)(A, Y);
                A.fail$data(xH6._`!${$}.test(${q})`)
            }
        };
    rS7.default = $O9
})
// @from(Ln 212035, Col 4)
sS7 = R((aS7) => {
    Object.defineProperty(aS7, "__esModule", {
        value: !0
    });
    var Tb1 = p5(),
        _O9 = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxProperties" ? "more" : "fewer";
                return Tb1.str`must NOT have ${K} than ${q} properties`
            },
            params: ({
                schemaCode: A
            }) => Tb1._`{limit: ${A}}`
        },
        JO9 = {
            keyword: ["maxProperties", "minProperties"],
            type: "object",
            schemaType: "number",
            $data: !0,
            error: _O9,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A, z = q === "maxProperties" ? Tb1.operators.GT : Tb1.operators.LT;
                A.fail$data(Tb1._`Object.keys(${K}).length ${z} ${Y}`)
            }
        };
    aS7.default = JO9
})
// @from(Ln 212069, Col 4)
eS7 = R((tS7) => {
    Object.defineProperty(tS7, "__esModule", {
        value: !0
    });
    var vb1 = tL(),
        Eb1 = p5(),
        DO9 = dY(),
        jO9 = {
            message: ({
                params: {
                    missingProperty: A
                }
            }) => Eb1.str`must have required property '${A}'`,
            params: ({
                params: {
                    missingProperty: A
                }
            }) => Eb1._`{missingProperty: ${A}}`
        },
        MO9 = {
            keyword: "required",
            type: "object",
            schemaType: "array",
            $data: !0,
            error: jO9,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    schemaCode: Y,
                    data: z,
                    $data: w,
                    it: H
                } = A, {
                    opts: $
                } = H;
                if (!w && K.length === 0) return;
                let O = K.length >= $.loopRequired;
                if (H.allErrors) _();
                else J();
                if ($.strictRequired) {
                    let j = A.parentSchema.properties,
                        {
                            definedProperties: M
                        } = A.it;
                    for (let P of K)
                        if ((j === null || j === void 0 ? void 0 : j[P]) === void 0 && !M.has(P)) {
                            let W = H.schemaEnv.baseId + H.errSchemaPath,
                                G = `required property "${P}" is not defined at "${W}" (strictRequired)`;
                            (0, DO9.checkStrictMode)(H, G, H.opts.strictRequired)
                        }
                }

                function _() {
                    if (O || w) A.block$data(Eb1.nil, X);
                    else
                        for (let j of K)(0, vb1.checkReportMissingProp)(A, j)
                }

                function J() {
                    let j = q.let("missing");
                    if (O || w) {
                        let M = q.let("valid", !0);
                        A.block$data(M, () => D(j, M)), A.ok(M)
                    } else q.if((0, vb1.checkMissingProp)(A, K, j)), (0, vb1.reportMissingProp)(A, j), q.else()
                }

                function X() {
                    q.forOf("prop", Y, (j) => {
                        A.setParams({
                            missingProperty: j
                        }), q.if((0, vb1.noPropertyInData)(q, z, j, $.ownProperties), () => A.error())
                    })
                }

                function D(j, M) {
                    A.setParams({
                        missingProperty: j
                    }), q.forOf(j, Y, () => {
                        q.assign(M, (0, vb1.propertyInData)(q, z, j, $.ownProperties)), q.if((0, Eb1.not)(M), () => {
                            A.error(), q.break()
                        })
                    }, Eb1.nil)
                }
            }
        };
    tS7.default = MO9
})
// @from(Ln 212157, Col 4)
qh7 = R((Ah7) => {
    Object.defineProperty(Ah7, "__esModule", {
        value: !0
    });
    var kb1 = p5(),
        WO9 = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxItems" ? "more" : "fewer";
                return kb1.str`must NOT have ${K} than ${q} items`
            },
            params: ({
                schemaCode: A
            }) => kb1._`{limit: ${A}}`
        },
        GO9 = {
            keyword: ["maxItems", "minItems"],
            type: "array",
            schemaType: "number",
            $data: !0,
            error: WO9,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A, z = q === "maxItems" ? kb1.operators.GT : kb1.operators.LT;
                A.fail$data(kb1._`${K}.length ${z} ${Y}`)
            }
        };
    Ah7.default = GO9
})
// @from(Ln 212191, Col 4)
bH6 = R((Yh7) => {
    Object.defineProperty(Yh7, "__esModule", {
        value: !0
    });
    var Kh7 = n_A();
    Kh7.code = 'require("ajv/dist/runtime/equal").default';
    Yh7.default = Kh7
})
// @from(Ln 212199, Col 4)
wh7 = R((zh7) => {
    Object.defineProperty(zh7, "__esModule", {
        value: !0
    });
    var OJA = Xb1(),
        xM = p5(),
        VO9 = dY(),
        NO9 = bH6(),
        TO9 = {
            message: ({
                params: {
                    i: A,
                    j: q
                }
            }) => xM.str`must NOT have duplicate items (items ## ${q} and ${A} are identical)`,
            params: ({
                params: {
                    i: A,
                    j: q
                }
            }) => xM._`{i: ${A}, j: ${q}}`
        },
        vO9 = {
            keyword: "uniqueItems",
            type: "array",
            schemaType: "boolean",
            $data: !0,
            error: TO9,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schema: z,
                    parentSchema: w,
                    schemaCode: H,
                    it: $
                } = A;
                if (!Y && !z) return;
                let O = q.let("valid"),
                    _ = w.items ? (0, OJA.getSchemaTypes)(w.items) : [];
                A.block$data(O, J, xM._`${H} === false`), A.ok(O);

                function J() {
                    let M = q.let("i", xM._`${K}.length`),
                        P = q.let("j");
                    A.setParams({
                        i: M,
                        j: P
                    }), q.assign(O, !0), q.if(xM._`${M} > 1`, () => (X() ? D : j)(M, P))
                }

                function X() {
                    return _.length > 0 && !_.some((M) => M === "object" || M === "array")
                }

                function D(M, P) {
                    let W = q.name("item"),
                        G = (0, OJA.checkDataTypes)(_, W, $.opts.strictNumbers, OJA.DataType.Wrong),
                        f = q.const("indices", xM._`{}`);
                    q.for(xM._`;${M}--;`, () => {
                        if (q.let(W, xM._`${K}[${M}]`), q.if(G, xM._`continue`), _.length > 1) q.if(xM._`typeof ${W} == "string"`, xM._`${W} += "_"`);
                        q.if(xM._`typeof ${f}[${W}] == "number"`, () => {
                            q.assign(P, xM._`${f}[${W}]`), A.error(), q.assign(O, !1).break()
                        }).code(xM._`${f}[${W}] = ${M}`)
                    })
                }

                function j(M, P) {
                    let W = (0, VO9.useFunc)(q, NO9.default),
                        G = q.name("outer");
                    q.label(G).for(xM._`;${M}--;`, () => q.for(xM._`${P} = ${M}; ${P}--;`, () => q.if(xM._`${W}(${K}[${M}], ${K}[${P}])`, () => {
                        A.error(), q.assign(O, !1).break(G)
                    })))
                }
            }
        };
    zh7.default = vO9
})
// @from(Ln 212278, Col 4)
$h7 = R((Hh7) => {
    Object.defineProperty(Hh7, "__esModule", {
        value: !0
    });
    var _JA = p5(),
        kO9 = dY(),
        LO9 = bH6(),
        RO9 = {
            message: "must be equal to constant",
            params: ({
                schemaCode: A
            }) => _JA._`{allowedValue: ${A}}`
        },
        yO9 = {
            keyword: "const",
            $data: !0,
            error: RO9,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schemaCode: z,
                    schema: w
                } = A;
                if (Y || w && typeof w == "object") A.fail$data(_JA._`!${(0,kO9.useFunc)(q,LO9.default)}(${K}, ${z})`);
                else A.fail(_JA._`${w} !== ${K}`)
            }
        };
    Hh7.default = yO9
})
// @from(Ln 212309, Col 4)
_h7 = R((Oh7) => {
    Object.defineProperty(Oh7, "__esModule", {
        value: !0
    });
    var Lb1 = p5(),
        SO9 = dY(),
        hO9 = bH6(),
        IO9 = {
            message: "must be equal to one of the allowed values",
            params: ({
                schemaCode: A
            }) => Lb1._`{allowedValues: ${A}}`
        },
        xO9 = {
            keyword: "enum",
            schemaType: "array",
            $data: !0,
            error: IO9,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schema: z,
                    schemaCode: w,
                    it: H
                } = A;
                if (!Y && z.length === 0) throw Error("enum must have non-empty array");
                let $ = z.length >= H.opts.loopEnum,
                    O, _ = () => O !== null && O !== void 0 ? O : O = (0, SO9.useFunc)(q, hO9.default),
                    J;
                if ($ || Y) J = q.let("valid"), A.block$data(J, X);
                else {
                    if (!Array.isArray(z)) throw Error("ajv implementation error");
                    let j = q.const("vSchema", w);
                    J = (0, Lb1.or)(...z.map((M, P) => D(j, P)))
                }
                A.pass(J);

                function X() {
                    q.assign(J, !1), q.forOf("v", w, (j) => q.if(Lb1._`${_()}(${K}, ${j})`, () => q.assign(J, !0).break()))
                }

                function D(j, M) {
                    let P = z[M];
                    return typeof P === "object" && P !== null ? Lb1._`${_()}(${K}, ${j}[${M}])` : Lb1._`${K} === ${P}`
                }
            }
        };
    Oh7.default = xO9
})
// @from(Ln 212360, Col 4)
Xh7 = R((Jh7) => {
    Object.defineProperty(Jh7, "__esModule", {
        value: !0
    });
    var uO9 = gS7(),
        BO9 = pS7(),
        mO9 = nS7(),
        FO9 = oS7(),
        QO9 = sS7(),
        gO9 = eS7(),
        UO9 = qh7(),
        pO9 = wh7(),
        dO9 = $h7(),
        cO9 = _h7(),
        lO9 = [uO9.default, BO9.default, mO9.default, FO9.default, QO9.default, gO9.default, UO9.default, pO9.default, {
            keyword: "type",
            schemaType: ["string", "array"]
        }, {
            keyword: "nullable",
            schemaType: "boolean"
        }, dO9.default, cO9.default];
    Jh7.default = lO9
})
// @from(Ln 212383, Col 4)
XJA = R((jh7) => {
    Object.defineProperty(jh7, "__esModule", {
        value: !0
    });
    jh7.validateAdditionalItems = void 0;
    var Cq1 = p5(),
        JJA = dY(),
        nO9 = {
            message: ({
                params: {
                    len: A
                }
            }) => Cq1.str`must NOT have more than ${A} items`,
            params: ({
                params: {
                    len: A
                }
            }) => Cq1._`{limit: ${A}}`
        },
        rO9 = {
            keyword: "additionalItems",
            type: "array",
            schemaType: ["boolean", "object"],
            before: "uniqueItems",
            error: nO9,
            code(A) {
                let {
                    parentSchema: q,
                    it: K
                } = A, {
                    items: Y
                } = q;
                if (!Array.isArray(Y)) {
                    (0, JJA.checkStrictMode)(K, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return
                }
                Dh7(A, Y)
            }
        };

    function Dh7(A, q) {
        let {
            gen: K,
            schema: Y,
            data: z,
            keyword: w,
            it: H
        } = A;
        H.items = !0;
        let $ = K.const("len", Cq1._`${z}.length`);
        if (Y === !1) A.setParams({
            len: q.length
        }), A.pass(Cq1._`${$} <= ${q.length}`);
        else if (typeof Y == "object" && !(0, JJA.alwaysValidSchema)(H, Y)) {
            let _ = K.var("valid", Cq1._`${$} <= ${q.length}`);
            K.if((0, Cq1.not)(_), () => O(_)), A.ok(_)
        }

        function O(_) {
            K.forRange("i", q.length, $, (J) => {
                if (A.subschema({
                        keyword: w,
                        dataProp: J,
                        dataPropType: JJA.Type.Num
                    }, _), !H.allErrors) K.if((0, Cq1.not)(_), () => K.break())
            })
        }
    }
    jh7.validateAdditionalItems = Dh7;
    jh7.default = rO9
})
// @from(Ln 212454, Col 4)
DJA = R((Gh7) => {
    Object.defineProperty(Gh7, "__esModule", {
        value: !0
    });
    Gh7.validateTuple = void 0;
    var Ph7 = p5(),
        uH6 = dY(),
        aO9 = tL(),
        sO9 = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "array", "boolean"],
            before: "uniqueItems",
            code(A) {
                let {
                    schema: q,
                    it: K
                } = A;
                if (Array.isArray(q)) return Wh7(A, "additionalItems", q);
                if (K.items = !0, (0, uH6.alwaysValidSchema)(K, q)) return;
                A.ok((0, aO9.validateArray)(A))
            }
        };

    function Wh7(A, q, K = A.schema) {
        let {
            gen: Y,
            parentSchema: z,
            data: w,
            keyword: H,
            it: $
        } = A;
        if (J(z), $.opts.unevaluated && K.length && $.items !== !0) $.items = uH6.mergeEvaluated.items(Y, K.length, $.items);
        let O = Y.name("valid"),
            _ = Y.const("len", Ph7._`${w}.length`);
        K.forEach((X, D) => {
            if ((0, uH6.alwaysValidSchema)($, X)) return;
            Y.if(Ph7._`${_} > ${D}`, () => A.subschema({
                keyword: H,
                schemaProp: D,
                dataProp: D
            }, O)), A.ok(O)
        });

        function J(X) {
            let {
                opts: D,
                errSchemaPath: j
            } = $, M = K.length, P = M === X.minItems && (M === X.maxItems || X[q] === !1);
            if (D.strictTuples && !P) {
                let W = `"${H}" is ${M}-tuple, but minItems or maxItems/${q} are not specified or different at path "${j}"`;
                (0, uH6.checkStrictMode)($, W, D.strictTuples)
            }
        }
    }
    Gh7.validateTuple = Wh7;
    Gh7.default = sO9
})
// @from(Ln 212512, Col 4)
Vh7 = R((fh7) => {
    Object.defineProperty(fh7, "__esModule", {
        value: !0
    });
    var eO9 = DJA(),
        A_9 = {
            keyword: "prefixItems",
            type: "array",
            schemaType: ["array"],
            before: "uniqueItems",
            code: (A) => (0, eO9.validateTuple)(A, "items")
        };
    fh7.default = A_9
})
// @from(Ln 212526, Col 4)
vh7 = R((Th7) => {
    Object.defineProperty(Th7, "__esModule", {
        value: !0
    });
    var Nh7 = p5(),
        K_9 = dY(),
        Y_9 = tL(),
        z_9 = XJA(),
        w_9 = {
            message: ({
                params: {
                    len: A
                }
            }) => Nh7.str`must NOT have more than ${A} items`,
            params: ({
                params: {
                    len: A
                }
            }) => Nh7._`{limit: ${A}}`
        },
        H_9 = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            error: w_9,
            code(A) {
                let {
                    schema: q,
                    parentSchema: K,
                    it: Y
                } = A, {
                    prefixItems: z
                } = K;
                if (Y.items = !0, (0, K_9.alwaysValidSchema)(Y, q)) return;
                if (z)(0, z_9.validateAdditionalItems)(A, z);
                else A.ok((0, Y_9.validateArray)(A))
            }
        };
    Th7.default = H_9
})
// @from(Ln 212567, Col 4)
kh7 = R((Eh7) => {
    Object.defineProperty(Eh7, "__esModule", {
        value: !0
    });
    var eL = p5(),
        BH6 = dY(),
        O_9 = {
            message: ({
                params: {
                    min: A,
                    max: q
                }
            }) => q === void 0 ? eL.str`must contain at least ${A} valid item(s)` : eL.str`must contain at least ${A} and no more than ${q} valid item(s)`,
            params: ({
                params: {
                    min: A,
                    max: q
                }
            }) => q === void 0 ? eL._`{minContains: ${A}}` : eL._`{minContains: ${A}, maxContains: ${q}}`
        },
        __9 = {
            keyword: "contains",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            trackErrors: !0,
            error: O_9,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    it: w
                } = A, H, $, {
                    minContains: O,
                    maxContains: _
                } = Y;
                if (w.opts.next) H = O === void 0 ? 1 : O, $ = _;
                else H = 1;
                let J = q.const("len", eL._`${z}.length`);
                if (A.setParams({
                        min: H,
                        max: $
                    }), $ === void 0 && H === 0) {
                    (0, BH6.checkStrictMode)(w, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return
                }
                if ($ !== void 0 && H > $) {
                    (0, BH6.checkStrictMode)(w, '"minContains" > "maxContains" is always invalid'), A.fail();
                    return
                }
                if ((0, BH6.alwaysValidSchema)(w, K)) {
                    let P = eL._`${J} >= ${H}`;
                    if ($ !== void 0) P = eL._`${P} && ${J} <= ${$}`;
                    A.pass(P);
                    return
                }
                w.items = !0;
                let X = q.name("valid");
                if ($ === void 0 && H === 1) j(X, () => q.if(X, () => q.break()));
                else if (H === 0) {
                    if (q.let(X, !0), $ !== void 0) q.if(eL._`${z}.length > 0`, D)
                } else q.let(X, !1), D();
                A.result(X, () => A.reset());

                function D() {
                    let P = q.name("_valid"),
                        W = q.let("count", 0);
                    j(P, () => q.if(P, () => M(W)))
                }

                function j(P, W) {
                    q.forRange("i", 0, J, (G) => {
                        A.subschema({
                            keyword: "contains",
                            dataProp: G,
                            dataPropType: BH6.Type.Num,
                            compositeRule: !0
                        }, P), W()
                    })
                }

                function M(P) {
                    if (q.code(eL._`${P}++`), $ === void 0) q.if(eL._`${P} >= ${H}`, () => q.assign(X, !0).break());
                    else if (q.if(eL._`${P} > ${$}`, () => q.assign(X, !1).break()), H === 1) q.assign(X, !0);
                    else q.if(eL._`${P} >= ${H}`, () => q.assign(X, !0))
                }
            }
        };
    Eh7.default = __9
})
// @from(Ln 212659, Col 4)
hh7 = R((yh7) => {
    Object.defineProperty(yh7, "__esModule", {
        value: !0
    });
    yh7.validateSchemaDeps = yh7.validatePropertyDeps = yh7.error = void 0;
    var jJA = p5(),
        X_9 = dY(),
        Rb1 = tL();
    yh7.error = {
        message: ({
            params: {
                property: A,
                depsCount: q,
                deps: K
            }
        }) => {
            let Y = q === 1 ? "property" : "properties";
            return jJA.str`must have ${Y} ${K} when property ${A} is present`
        },
        params: ({
            params: {
                property: A,
                depsCount: q,
                deps: K,
                missingProperty: Y
            }
        }) => jJA._`{property: ${A},
    missingProperty: ${Y},
    depsCount: ${q},
    deps: ${K}}`
    };
    var D_9 = {
        keyword: "dependencies",
        type: "object",
        schemaType: "object",
        error: yh7.error,
        code(A) {
            let [q, K] = j_9(A);
            Lh7(A, q), Rh7(A, K)
        }
    };

    function j_9({
        schema: A
    }) {
        let q = {},
            K = {};
        for (let Y in A) {
            if (Y === "__proto__") continue;
            let z = Array.isArray(A[Y]) ? q : K;
            z[Y] = A[Y]
        }
        return [q, K]
    }

    function Lh7(A, q = A.schema) {
        let {
            gen: K,
            data: Y,
            it: z
        } = A;
        if (Object.keys(q).length === 0) return;
        let w = K.let("missing");
        for (let H in q) {
            let $ = q[H];
            if ($.length === 0) continue;
            let O = (0, Rb1.propertyInData)(K, Y, H, z.opts.ownProperties);
            if (A.setParams({
                    property: H,
                    depsCount: $.length,
                    deps: $.join(", ")
                }), z.allErrors) K.if(O, () => {
                for (let _ of $)(0, Rb1.checkReportMissingProp)(A, _)
            });
            else K.if(jJA._`${O} && (${(0,Rb1.checkMissingProp)(A,$,w)})`), (0, Rb1.reportMissingProp)(A, w), K.else()
        }
    }
    yh7.validatePropertyDeps = Lh7;

    function Rh7(A, q = A.schema) {
        let {
            gen: K,
            data: Y,
            keyword: z,
            it: w
        } = A, H = K.name("valid");
        for (let $ in q) {
            if ((0, X_9.alwaysValidSchema)(w, q[$])) continue;
            K.if((0, Rb1.propertyInData)(K, Y, $, w.opts.ownProperties), () => {
                let O = A.subschema({
                    keyword: z,
                    schemaProp: $
                }, H);
                A.mergeValidEvaluated(O, H)
            }, () => K.var(H, !0)), A.ok(H)
        }
    }
    yh7.validateSchemaDeps = Rh7;
    yh7.default = D_9
})
// @from(Ln 212759, Col 4)
bh7 = R((xh7) => {
    Object.defineProperty(xh7, "__esModule", {
        value: !0
    });
    var Ih7 = p5(),
        W_9 = dY(),
        G_9 = {
            message: "property name must be valid",
            params: ({
                params: A
            }) => Ih7._`{propertyName: ${A.propertyName}}`
        },
        Z_9 = {
            keyword: "propertyNames",
            type: "object",
            schemaType: ["object", "boolean"],
            error: G_9,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    data: Y,
                    it: z
                } = A;
                if ((0, W_9.alwaysValidSchema)(z, K)) return;
                let w = q.name("valid");
                q.forIn("key", Y, (H) => {
                    A.setParams({
                        propertyName: H
                    }), A.subschema({
                        keyword: "propertyNames",
                        data: H,
                        dataTypes: ["string"],
                        propertyName: H,
                        compositeRule: !0
                    }, w), q.if((0, Ih7.not)(w), () => {
                        if (A.error(!0), !z.allErrors) q.break()
                    })
                }), A.ok(w)
            }
        };
    xh7.default = Z_9
})