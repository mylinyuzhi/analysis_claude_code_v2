
// @from(Ln 25272, Col 4)
dy6 = x((g3A) => {
    Object.defineProperty(g3A, "__esModule", {
        value: !0
    });
    g3A.getData = g3A.KeywordCxt = g3A.validateFunctionCode = void 0;
    var R3A = Q5A(),
        k3A = Fy6(),
        bU1 = VU1(),
        e61 = Fy6(),
        A7K = K3A(),
        Uy6 = J3A(),
        IU1 = P3A(),
        Gq = y3(),
        w5 = mp(),
        q7K = py6(),
        Bp = nY(),
        Qy6 = gy6();

    function K7K(A) {
        if (C3A(A)) {
            if (I3A(A), S3A(A)) {
                _7K(A);
                return
            }
        }
        h3A(A, () => (0, R3A.topBoolOrEmptySchema)(A))
    }
    g3A.validateFunctionCode = K7K;

    function h3A({
        gen: A,
        validateName: q,
        schema: K,
        schemaEnv: Y,
        opts: z
    }, _) {
        if (z.code.es5) A.func(q, Gq._`${w5.default.data}, ${w5.default.valCxt}`, Y.$async, () => {
            A.code(Gq._`"use strict"; ${E3A(K,z)}`), z7K(A, z), A.code(_)
        });
        else A.func(q, Gq._`${w5.default.data}, ${Y7K(z)}`, Y.$async, () => A.code(E3A(K, z)).code(_))
    }

    function Y7K(A) {
        return Gq._`{${w5.default.instancePath}="", ${w5.default.parentData}, ${w5.default.parentDataProperty}, ${w5.default.rootData}=${w5.default.data}${A.dynamicRef?Gq._`, ${w5.default.dynamicAnchors}={}`:Gq.nil}}={}`
    }

    function z7K(A, q) {
        A.if(w5.default.valCxt, () => {
            if (A.var(w5.default.instancePath, Gq._`${w5.default.valCxt}.${w5.default.instancePath}`), A.var(w5.default.parentData, Gq._`${w5.default.valCxt}.${w5.default.parentData}`), A.var(w5.default.parentDataProperty, Gq._`${w5.default.valCxt}.${w5.default.parentDataProperty}`), A.var(w5.default.rootData, Gq._`${w5.default.valCxt}.${w5.default.rootData}`), q.dynamicRef) A.var(w5.default.dynamicAnchors, Gq._`${w5.default.valCxt}.${w5.default.dynamicAnchors}`)
        }, () => {
            if (A.var(w5.default.instancePath, Gq._`""`), A.var(w5.default.parentData, Gq._`undefined`), A.var(w5.default.parentDataProperty, Gq._`undefined`), A.var(w5.default.rootData, w5.default.data), q.dynamicRef) A.var(w5.default.dynamicAnchors, Gq._`{}`)
        })
    }

    function _7K(A) {
        let {
            schema: q,
            opts: K,
            gen: Y
        } = A;
        h3A(A, () => {
            if (K.$comment && q.$comment) x3A(A);
            if (j7K(A), Y.let(w5.default.vErrors, null), Y.let(w5.default.errors, 0), K.unevaluated) w7K(A);
            b3A(A), D7K(A)
        });
        return
    }

    function w7K(A) {
        let {
            gen: q,
            validateName: K
        } = A;
        A.evaluated = q.const("evaluated", Gq._`${K}.evaluated`), q.if(Gq._`${A.evaluated}.dynamicProps`, () => q.assign(Gq._`${A.evaluated}.props`, Gq._`undefined`)), q.if(Gq._`${A.evaluated}.dynamicItems`, () => q.assign(Gq._`${A.evaluated}.items`, Gq._`undefined`))
    }

    function E3A(A, q) {
        let K = typeof A == "object" && A[q.schemaId];
        return K && (q.code.source || q.code.process) ? Gq._`/*# sourceURL=${K} */` : Gq.nil
    }

    function O7K(A, q) {
        if (C3A(A)) {
            if (I3A(A), S3A(A)) {
                $7K(A, q);
                return
            }
        }(0, R3A.boolOrEmptySchema)(A, q)
    }

    function S3A({
        schema: A,
        self: q
    }) {
        if (typeof A == "boolean") return !A;
        for (let K in A)
            if (q.RULES.all[K]) return !0;
        return !1
    }

    function C3A(A) {
        return typeof A.schema != "boolean"
    }

    function $7K(A, q) {
        let {
            schema: K,
            gen: Y,
            opts: z
        } = A;
        if (z.$comment && K.$comment) x3A(A);
        J7K(A), M7K(A);
        let _ = Y.const("_errs", w5.default.errors);
        b3A(A, _), Y.var(q, Gq._`${_} === ${w5.default.errors}`)
    }

    function I3A(A) {
        (0, Bp.checkUnknownRules)(A), H7K(A)
    }

    function b3A(A, q) {
        if (A.opts.jtd) return y3A(A, [], !1, q);
        let K = (0, k3A.getSchemaTypes)(A.schema),
            Y = (0, k3A.coerceAndCheckDataType)(A, K);
        y3A(A, K, !Y, q)
    }

    function H7K(A) {
        let {
            schema: q,
            errSchemaPath: K,
            opts: Y,
            self: z
        } = A;
        if (q.$ref && Y.ignoreKeywordsWithRef && (0, Bp.schemaHasRulesButRef)(q, z.RULES)) z.logger.warn(`$ref: keywords ignored in schema at path "${K}"`)
    }

    function j7K(A) {
        let {
            schema: q,
            opts: K
        } = A;
        if (q.default !== void 0 && K.useDefaults && K.strictSchema)(0, Bp.checkStrictMode)(A, "default is ignored in the schema root")
    }

    function J7K(A) {
        let q = A.schema[A.opts.schemaId];
        if (q) A.baseId = (0, q7K.resolveUrl)(A.opts.uriResolver, A.baseId, q)
    }

    function M7K(A) {
        if (A.schema.$async && !A.schemaEnv.$async) throw Error("async schema in sync schema")
    }

    function x3A({
        gen: A,
        schemaEnv: q,
        schema: K,
        errSchemaPath: Y,
        opts: z
    }) {
        let _ = K.$comment;
        if (z.$comment === !0) A.code(Gq._`${w5.default.self}.logger.log(${_})`);
        else if (typeof z.$comment == "function") {
            let w = Gq.str`${Y}/$comment`,
                O = A.scopeValue("root", {
                    ref: q.root
                });
            A.code(Gq._`${w5.default.self}.opts.$comment(${_}, ${w}, ${O}.schema)`)
        }
    }

    function D7K(A) {
        let {
            gen: q,
            schemaEnv: K,
            validateName: Y,
            ValidationError: z,
            opts: _
        } = A;
        if (K.$async) q.if(Gq._`${w5.default.errors} === 0`, () => q.return(w5.default.data), () => q.throw(Gq._`new ${z}(${w5.default.vErrors})`));
        else {
            if (q.assign(Gq._`${Y}.errors`, w5.default.vErrors), _.unevaluated) X7K(A);
            q.return(Gq._`${w5.default.errors} === 0`)
        }
    }

    function X7K({
        gen: A,
        evaluated: q,
        props: K,
        items: Y
    }) {
        if (K instanceof Gq.Name) A.assign(Gq._`${q}.props`, K);
        if (Y instanceof Gq.Name) A.assign(Gq._`${q}.items`, Y)
    }

    function y3A(A, q, K, Y) {
        let {
            gen: z,
            schema: _,
            data: w,
            allErrors: O,
            opts: $,
            self: H
        } = A, {
            RULES: j
        } = H;
        if (_.$ref && ($.ignoreKeywordsWithRef || !(0, Bp.schemaHasRulesButRef)(_, j))) {
            z.block(() => m3A(A, "$ref", j.all.$ref.definition));
            return
        }
        if (!$.jtd) P7K(A, q);
        z.block(() => {
            for (let M of j.rules) J(M);
            J(j.post)
        });

        function J(M) {
            if (!(0, bU1.shouldUseGroup)(_, M)) return;
            if (M.type) {
                if (z.if((0, e61.checkDataType)(M.type, w, $.strictNumbers)), L3A(A, M), q.length === 1 && q[0] === M.type && K) z.else(), (0, e61.reportTypeError)(A);
                z.endIf()
            } else L3A(A, M);
            if (!O) z.if(Gq._`${w5.default.errors} === ${Y||0}`)
        }
    }

    function L3A(A, q) {
        let {
            gen: K,
            schema: Y,
            opts: {
                useDefaults: z
            }
        } = A;
        if (z)(0, A7K.assignDefaults)(A, q.type);
        K.block(() => {
            for (let _ of q.rules)
                if ((0, bU1.shouldUseRule)(Y, _)) m3A(A, _.keyword, _.definition, q.type)
        })
    }

    function P7K(A, q) {
        if (A.schemaEnv.meta || !A.opts.strictTypes) return;
        if (W7K(A, q), !A.opts.allowUnionTypes) Z7K(A, q);
        G7K(A, A.dataTypes)
    }

    function W7K(A, q) {
        if (!q.length) return;
        if (!A.dataTypes.length) {
            A.dataTypes = q;
            return
        }
        q.forEach((K) => {
            if (!u3A(A.dataTypes, K)) xU1(A, `type "${K}" not allowed by context "${A.dataTypes.join(",")}"`)
        }), T7K(A, q)
    }

    function Z7K(A, q) {
        if (q.length > 1 && !(q.length === 2 && q.includes("null"))) xU1(A, "use allowUnionTypes to allow union type keyword")
    }

    function G7K(A, q) {
        let K = A.self.RULES.all;
        for (let Y in K) {
            let z = K[Y];
            if (typeof z == "object" && (0, bU1.shouldUseRule)(A.schema, z)) {
                let {
                    type: _
                } = z.definition;
                if (_.length && !_.some((w) => f7K(q, w))) xU1(A, `missing type "${_.join(",")}" for keyword "${Y}"`)
            }
        }
    }

    function f7K(A, q) {
        return A.includes(q) || q === "number" && A.includes("integer")
    }

    function u3A(A, q) {
        return A.includes(q) || q === "integer" && A.includes("number")
    }

    function T7K(A, q) {
        let K = [];
        for (let Y of A.dataTypes)
            if (u3A(q, Y)) K.push(Y);
            else if (q.includes("integer") && Y === "number") K.push("integer");
        A.dataTypes = K
    }

    function xU1(A, q) {
        let K = A.schemaEnv.baseId + A.errSchemaPath;
        q += ` at "${K}" (strictTypes)`, (0, Bp.checkStrictMode)(A, q, A.opts.strictTypes)
    }
    class uU1 {
        constructor(A, q, K) {
            if ((0, Uy6.validateKeywordUsage)(A, q, K), this.gen = A.gen, this.allErrors = A.allErrors, this.keyword = K, this.data = A.data, this.schema = A.schema[K], this.$data = q.$data && A.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Bp.schemaRefOrVal)(A, this.schema, K, this.$data), this.schemaType = q.schemaType, this.parentSchema = A.schema, this.params = {}, this.it = A, this.def = q, this.$data) this.schemaCode = A.gen.const("vSchema", B3A(this.$data, A));
            else if (this.schemaCode = this.schemaValue, !(0, Uy6.validSchemaType)(this.schema, q.schemaType, q.allowUndefined)) throw Error(`${K} value must be ${JSON.stringify(q.schemaType)}`);
            if ("code" in q ? q.trackErrors : q.errors !== !1) this.errsCount = A.gen.const("_errs", w5.default.errors)
        }
        result(A, q, K) {
            this.failResult((0, Gq.not)(A), q, K)
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
            this.failResult((0, Gq.not)(A), void 0, q)
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
            this.fail(Gq._`${q} !== undefined && (${(0,Gq.or)(this.invalid$data(),A)})`)
        }
        error(A, q, K) {
            if (q) {
                this.setParams(q), this._error(A, K), this.setParams({});
                return
            }
            this._error(A, K)
        }
        _error(A, q) {
            (A ? Qy6.reportExtraError : Qy6.reportError)(this, this.def.error, q)
        }
        $dataError() {
            (0, Qy6.reportError)(this, this.def.$dataError || Qy6.keyword$DataError)
        }
        reset() {
            if (this.errsCount === void 0) throw Error('add "trackErrors" to keyword definition');
            (0, Qy6.resetErrorsCount)(this.gen, this.errsCount)
        }
        ok(A) {
            if (!this.allErrors) this.gen.if(A)
        }
        setParams(A, q) {
            if (q) Object.assign(this.params, A);
            else this.params = A
        }
        block$data(A, q, K = Gq.nil) {
            this.gen.block(() => {
                this.check$data(A, K), q()
            })
        }
        check$data(A = Gq.nil, q = Gq.nil) {
            if (!this.$data) return;
            let {
                gen: K,
                schemaCode: Y,
                schemaType: z,
                def: _
            } = this;
            if (K.if((0, Gq.or)(Gq._`${Y} === undefined`, q)), A !== Gq.nil) K.assign(A, !0);
            if (z.length || _.validateSchema) {
                if (K.elseIf(this.invalid$data()), this.$dataError(), A !== Gq.nil) K.assign(A, !1)
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
            return (0, Gq.or)(_(), w());

            function _() {
                if (K.length) {
                    if (!(q instanceof Gq.Name)) throw Error("ajv implementation error");
                    let O = Array.isArray(K) ? K : [K];
                    return Gq._`${(0,e61.checkDataTypes)(O,q,z.opts.strictNumbers,e61.DataType.Wrong)}`
                }
                return Gq.nil
            }

            function w() {
                if (Y.validateSchema) {
                    let O = A.scopeValue("validate$data", {
                        ref: Y.validateSchema
                    });
                    return Gq._`!${O}(${q})`
                }
                return Gq.nil
            }
        }
        subschema(A, q) {
            let K = (0, IU1.getSubschema)(this.it, A);
            (0, IU1.extendSubschemaData)(K, this.it, A), (0, IU1.extendSubschemaMode)(K, A);
            let Y = {
                ...this.it,
                ...K,
                items: void 0,
                props: void 0
            };
            return O7K(Y, q), Y
        }
        mergeEvaluated(A, q) {
            let {
                it: K,
                gen: Y
            } = this;
            if (!K.opts.unevaluated) return;
            if (K.props !== !0 && A.props !== void 0) K.props = Bp.mergeEvaluated.props(Y, A.props, K.props, q);
            if (K.items !== !0 && A.items !== void 0) K.items = Bp.mergeEvaluated.items(Y, A.items, K.items, q)
        }
        mergeValidEvaluated(A, q) {
            let {
                it: K,
                gen: Y
            } = this;
            if (K.opts.unevaluated && (K.props !== !0 || K.items !== !0)) return Y.if(q, () => this.mergeEvaluated(A, Gq.Name)), !0
        }
    }
    g3A.KeywordCxt = uU1;

    function m3A(A, q, K, Y) {
        let z = new uU1(A, K, q);
        if ("code" in K) K.code(z, Y);
        else if (z.$data && K.validate)(0, Uy6.funcKeywordCode)(z, K);
        else if ("macro" in K)(0, Uy6.macroKeywordCode)(z, K);
        else if (K.compile || K.validate)(0, Uy6.funcKeywordCode)(z, K)
    }
    var v7K = /^\/(?:[^~]|~0|~1)*$/,
        N7K = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;

    function B3A(A, {
        dataLevel: q,
        dataNames: K,
        dataPathArr: Y
    }) {
        let z, _;
        if (A === "") return w5.default.rootData;
        if (A[0] === "/") {
            if (!v7K.test(A)) throw Error(`Invalid JSON-pointer: ${A}`);
            z = A, _ = w5.default.rootData
        } else {
            let H = N7K.exec(A);
            if (!H) throw Error(`Invalid JSON-pointer: ${A}`);
            let j = +H[1];
            if (z = H[2], z === "#") {
                if (j >= q) throw Error($("property/index", j));
                return Y[q - j]
            }
            if (j > q) throw Error($("data", j));
            if (_ = K[q - j], !z) return _
        }
        let w = _,
            O = z.split("/");
        for (let H of O)
            if (H) _ = Gq._`${_}${(0,Gq.getProperty)((0,Bp.unescapeJsonPointer)(H))}`, w = Gq._`${w} && ${_}`;
        return w;

        function $(H, j) {
            return `Cannot access ${H} ${j} levels up, current level is ${q}`
        }
    }
    g3A.getData = B3A
})
// @from(Ln 25749, Col 4)
A11 = x((Q3A) => {
    Object.defineProperty(Q3A, "__esModule", {
        value: !0
    });
    class p3A extends Error {
        constructor(A) {
            super("validation failed");
            this.errors = A, this.ajv = this.validation = !0
        }
    }
    Q3A.default = p3A
})
// @from(Ln 25761, Col 4)
cy6 = x((d3A) => {
    Object.defineProperty(d3A, "__esModule", {
        value: !0
    });
    var mU1 = py6();
    class U3A extends Error {
        constructor(A, q, K, Y) {
            super(Y || `can't resolve reference ${K} from id ${q}`);
            this.missingRef = (0, mU1.resolveUrl)(A, q, K), this.missingSchema = (0, mU1.normalizeId)((0, mU1.getFullPath)(A, this.missingRef))
        }
    }
    d3A.default = U3A
})
// @from(Ln 25774, Col 4)
K11 = x((i3A) => {
    Object.defineProperty(i3A, "__esModule", {
        value: !0
    });
    i3A.resolveSchema = i3A.getCompilingSchema = i3A.resolveRef = i3A.compileSchema = i3A.SchemaEnv = void 0;
    var yS = y3(),
        L7K = A11(),
        bA6 = mp(),
        LS = py6(),
        c3A = nY(),
        R7K = dy6();
    class ly6 {
        constructor(A) {
            var q;
            this.refs = {}, this.dynamicAnchors = {};
            let K;
            if (typeof A.schema == "object") K = A.schema;
            this.schema = A.schema, this.schemaId = A.schemaId, this.root = A.root || this, this.baseId = (q = A.baseId) !== null && q !== void 0 ? q : (0, LS.normalizeId)(K === null || K === void 0 ? void 0 : K[A.schemaId || "$id"]), this.schemaPath = A.schemaPath, this.localRefs = A.localRefs, this.meta = A.meta, this.$async = K === null || K === void 0 ? void 0 : K.$async, this.refs = {}
        }
    }
    i3A.SchemaEnv = ly6;

    function gU1(A) {
        let q = l3A.call(this, A);
        if (q) return q;
        let K = (0, LS.getFullPath)(this.opts.uriResolver, A.root.baseId),
            {
                es5: Y,
                lines: z
            } = this.opts.code,
            {
                ownProperties: _
            } = this.opts,
            w = new yS.CodeGen(this.scope, {
                es5: Y,
                lines: z,
                ownProperties: _
            }),
            O;
        if (A.$async) O = w.scopeValue("Error", {
            ref: L7K.default,
            code: yS._`require("ajv/dist/runtime/validation_error").default`
        });
        let $ = w.scopeName("validate");
        A.validateName = $;
        let H = {
                gen: w,
                allErrors: this.opts.allErrors,
                data: bA6.default.data,
                parentData: bA6.default.parentData,
                parentDataProperty: bA6.default.parentDataProperty,
                dataNames: [bA6.default.data],
                dataPathArr: [yS.nil],
                dataLevel: 0,
                dataTypes: [],
                definedProperties: new Set,
                topSchemaRef: w.scopeValue("schema", this.opts.code.source === !0 ? {
                    ref: A.schema,
                    code: (0, yS.stringify)(A.schema)
                } : {
                    ref: A.schema
                }),
                validateName: $,
                ValidationError: O,
                schema: A.schema,
                schemaEnv: A,
                rootId: K,
                baseId: A.baseId || K,
                schemaPath: yS.nil,
                errSchemaPath: A.schemaPath || (this.opts.jtd ? "" : "#"),
                errorPath: yS._`""`,
                opts: this.opts,
                self: this
            },
            j;
        try {
            this._compilations.add(A), (0, R7K.validateFunctionCode)(H), w.optimize(this.opts.code.optimize);
            let J = w.toString();
            if (j = `${w.scopeRefs(bA6.default.scope)}return ${J}`, this.opts.code.process) j = this.opts.code.process(j, A);
            let D = Function(`${bA6.default.self}`, `${bA6.default.scope}`, j)(this, this.scope.get());
            if (this.scope.value($, {
                    ref: D
                }), D.errors = null, D.schema = A.schema, D.schemaEnv = A, A.$async) D.$async = !0;
            if (this.opts.code.source === !0) D.source = {
                validateName: $,
                validateCode: J,
                scopeValues: w._values
            };
            if (this.opts.unevaluated) {
                let {
                    props: X,
                    items: P
                } = H;
                if (D.evaluated = {
                        props: X instanceof yS.Name ? void 0 : X,
                        items: P instanceof yS.Name ? void 0 : P,
                        dynamicProps: X instanceof yS.Name,
                        dynamicItems: P instanceof yS.Name
                    }, D.source) D.source.evaluated = (0, yS.stringify)(D.evaluated)
            }
            return A.validate = D, A
        } catch (J) {
            if (delete A.validate, delete A.validateName, j) this.logger.error("Error compiling schema, function code:", j);
            throw J
        } finally {
            this._compilations.delete(A)
        }
    }
    i3A.compileSchema = gU1;

    function h7K(A, q, K) {
        var Y;
        K = (0, LS.resolveUrl)(this.opts.uriResolver, q, K);
        let z = A.refs[K];
        if (z) return z;
        let _ = I7K.call(this, A, K);
        if (_ === void 0) {
            let w = (Y = A.localRefs) === null || Y === void 0 ? void 0 : Y[K],
                {
                    schemaId: O
                } = this.opts;
            if (w) _ = new ly6({
                schema: w,
                schemaId: O,
                root: A,
                baseId: q
            })
        }
        if (_ === void 0) return;
        return A.refs[K] = S7K.call(this, _)
    }
    i3A.resolveRef = h7K;

    function S7K(A) {
        if ((0, LS.inlineRef)(A.schema, this.opts.inlineRefs)) return A.schema;
        return A.validate ? A : gU1.call(this, A)
    }

    function l3A(A) {
        for (let q of this._compilations)
            if (C7K(q, A)) return q
    }
    i3A.getCompilingSchema = l3A;

    function C7K(A, q) {
        return A.schema === q.schema && A.root === q.root && A.baseId === q.baseId
    }

    function I7K(A, q) {
        let K;
        while (typeof(K = this.refs[q]) == "string") q = K;
        return K || this.schemas[q] || q11.call(this, A, q)
    }

    function q11(A, q) {
        let K = this.opts.uriResolver.parse(q),
            Y = (0, LS._getFullPath)(this.opts.uriResolver, K),
            z = (0, LS.getFullPath)(this.opts.uriResolver, A.baseId, void 0);
        if (Object.keys(A.schema).length > 0 && Y === z) return BU1.call(this, K, A);
        let _ = (0, LS.normalizeId)(Y),
            w = this.refs[_] || this.schemas[_];
        if (typeof w == "string") {
            let O = q11.call(this, A, w);
            if (typeof(O === null || O === void 0 ? void 0 : O.schema) !== "object") return;
            return BU1.call(this, K, O)
        }
        if (typeof(w === null || w === void 0 ? void 0 : w.schema) !== "object") return;
        if (!w.validate) gU1.call(this, w);
        if (_ === (0, LS.normalizeId)(q)) {
            let {
                schema: O
            } = w, {
                schemaId: $
            } = this.opts, H = O[$];
            if (H) z = (0, LS.resolveUrl)(this.opts.uriResolver, z, H);
            return new ly6({
                schema: O,
                schemaId: $,
                root: A,
                baseId: z
            })
        }
        return BU1.call(this, K, w)
    }
    i3A.resolveSchema = q11;
    var b7K = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);

    function BU1(A, {
        baseId: q,
        schema: K,
        root: Y
    }) {
        var z;
        if (((z = A.fragment) === null || z === void 0 ? void 0 : z[0]) !== "/") return;
        for (let O of A.fragment.slice(1).split("/")) {
            if (typeof K === "boolean") return;
            let $ = K[(0, c3A.unescapeFragment)(O)];
            if ($ === void 0) return;
            K = $;
            let H = typeof K === "object" && K[this.opts.schemaId];
            if (!b7K.has(O) && H) q = (0, LS.resolveUrl)(this.opts.uriResolver, q, H)
        }
        let _;
        if (typeof K != "boolean" && K.$ref && !(0, c3A.schemaHasRulesButRef)(K, this.RULES)) {
            let O = (0, LS.resolveUrl)(this.opts.uriResolver, q, K.$ref);
            _ = q11.call(this, Y, O)
        }
        let {
            schemaId: w
        } = this.opts;
        if (_ = _ || new ly6({
                schema: K,
                schemaId: w,
                root: Y,
                baseId: q
            }), _.schema !== _.root.schema) return _;
        return
    }
})
// @from(Ln 25993, Col 4)
r3A = x((UFz, g7K) => {
    g7K.exports = {
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
// @from(Ln 26012, Col 4)
a3A = x((dFz, o3A) => {
    var F7K = {
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
    o3A.exports = {
        HEX: F7K
    }
})
// @from(Ln 26041, Col 4)
z9A = x((cFz, Y9A) => {
    var {
        HEX: p7K
    } = a3A(), Q7K = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;

    function A9A(A) {
        if (K9A(A, ".") < 3) return {
            host: A,
            isIPV4: !1
        };
        let q = A.match(Q7K) || [],
            [K] = q;
        if (K) return {
            host: d7K(K, "."),
            isIPV4: !0
        };
        else return {
            host: A,
            isIPV4: !1
        }
    }

    function FU1(A, q = !1) {
        let K = "",
            Y = !0;
        for (let z of A) {
            if (p7K[z] === void 0) return;
            if (z !== "0" && Y === !0) Y = !1;
            if (!Y) K += z
        }
        if (q && K.length === 0) K = "0";
        return K
    }

    function U7K(A) {
        let q = 0,
            K = {
                error: !1,
                address: "",
                zone: ""
            },
            Y = [],
            z = [],
            _ = !1,
            w = !1,
            O = !1;

        function $() {
            if (z.length) {
                if (_ === !1) {
                    let H = FU1(z);
                    if (H !== void 0) Y.push(H);
                    else return K.error = !0, !1
                }
                z.length = 0
            }
            return !0
        }
        for (let H = 0; H < A.length; H++) {
            let j = A[H];
            if (j === "[" || j === "]") continue;
            if (j === ":") {
                if (w === !0) O = !0;
                if (!$()) break;
                if (q++, Y.push(":"), q > 7) {
                    K.error = !0;
                    break
                }
                if (H - 1 >= 0 && A[H - 1] === ":") w = !0;
                continue
            } else if (j === "%") {
                if (!$()) break;
                _ = !0
            } else {
                z.push(j);
                continue
            }
        }
        if (z.length)
            if (_) K.zone = z.join("");
            else if (O) Y.push(z.join(""));
        else Y.push(FU1(z));
        return K.address = Y.join(""), K
    }

    function q9A(A) {
        if (K9A(A, ":") < 2) return {
            host: A,
            isIPV6: !1
        };
        let q = U7K(A);
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

    function d7K(A, q) {
        let K = "",
            Y = !0,
            z = A.length;
        for (let _ = 0; _ < z; _++) {
            let w = A[_];
            if (w === "0" && Y) {
                if (_ + 1 <= z && A[_ + 1] === q || _ + 1 === z) K += w, Y = !1
            } else {
                if (w === q) Y = !0;
                else Y = !1;
                K += w
            }
        }
        return K
    }

    function K9A(A, q) {
        let K = 0;
        for (let Y = 0; Y < A.length; Y++)
            if (A[Y] === q) K++;
        return K
    }
    var s3A = /^\.\.?\//u,
        t3A = /^\/\.(?:\/|$)/u,
        e3A = /^\/\.\.(?:\/|$)/u,
        c7K = /^\/?(?:.|\n)*?(?=\/|$)/u;

    function l7K(A) {
        let q = [];
        while (A.length)
            if (A.match(s3A)) A = A.replace(s3A, "");
            else if (A.match(t3A)) A = A.replace(t3A, "/");
        else if (A.match(e3A)) A = A.replace(e3A, "/"), q.pop();
        else if (A === "." || A === "..") A = "";
        else {
            let K = A.match(c7K);
            if (K) {
                let Y = K[0];
                A = A.slice(Y.length), q.push(Y)
            } else throw Error("Unexpected dot segment condition")
        }
        return q.join("")
    }

    function i7K(A, q) {
        let K = q !== !0 ? escape : unescape;
        if (A.scheme !== void 0) A.scheme = K(A.scheme);
        if (A.userinfo !== void 0) A.userinfo = K(A.userinfo);
        if (A.host !== void 0) A.host = K(A.host);
        if (A.path !== void 0) A.path = K(A.path);
        if (A.query !== void 0) A.query = K(A.query);
        if (A.fragment !== void 0) A.fragment = K(A.fragment);
        return A
    }

    function n7K(A) {
        let q = [];
        if (A.userinfo !== void 0) q.push(A.userinfo), q.push("@");
        if (A.host !== void 0) {
            let K = unescape(A.host),
                Y = A9A(K);
            if (Y.isIPV4) K = Y.host;
            else {
                let z = q9A(Y.host);
                if (z.isIPV6 === !0) K = `[${z.escapedHost}]`;
                else K = A.host
            }
            q.push(K)
        }
        if (typeof A.port === "number" || typeof A.port === "string") q.push(":"), q.push(String(A.port));
        return q.length ? q.join("") : void 0
    }
    Y9A.exports = {
        recomposeAuthority: n7K,
        normalizeComponentEncoding: i7K,
        removeDotSegments: l7K,
        normalizeIPv4: A9A,
        normalizeIPv6: q9A,
        stringArrayToHexStripped: FU1
    }
})
// @from(Ln 26231, Col 4)
j9A = x((lFz, H9A) => {
    var r7K = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu,
        o7K = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;

    function _9A(A) {
        return typeof A.secure === "boolean" ? A.secure : String(A.scheme).toLowerCase() === "wss"
    }

    function w9A(A) {
        if (!A.host) A.error = A.error || "HTTP URIs must have a host.";
        return A
    }

    function O9A(A) {
        let q = String(A.scheme).toLowerCase() === "https";
        if (A.port === (q ? 443 : 80) || A.port === "") A.port = void 0;
        if (!A.path) A.path = "/";
        return A
    }

    function a7K(A) {
        return A.secure = _9A(A), A.resourceName = (A.path || "/") + (A.query ? "?" + A.query : ""), A.path = void 0, A.query = void 0, A
    }

    function s7K(A) {
        if (A.port === (_9A(A) ? 443 : 80) || A.port === "") A.port = void 0;
        if (typeof A.secure === "boolean") A.scheme = A.secure ? "wss" : "ws", A.secure = void 0;
        if (A.resourceName) {
            let [q, K] = A.resourceName.split("?");
            A.path = q && q !== "/" ? q : void 0, A.query = K, A.resourceName = void 0
        }
        return A.fragment = void 0, A
    }

    function t7K(A, q) {
        if (!A.path) return A.error = "URN can not be parsed", A;
        let K = A.path.match(o7K);
        if (K) {
            let Y = q.scheme || A.scheme || "urn";
            A.nid = K[1].toLowerCase(), A.nss = K[2];
            let z = `${Y}:${q.nid||A.nid}`,
                _ = pU1[z];
            if (A.path = void 0, _) A = _.parse(A, q)
        } else A.error = A.error || "URN can not be parsed.";
        return A
    }

    function e7K(A, q) {
        let K = q.scheme || A.scheme || "urn",
            Y = A.nid.toLowerCase(),
            z = `${K}:${q.nid||Y}`,
            _ = pU1[z];
        if (_) A = _.serialize(A, q);
        let w = A,
            O = A.nss;
        return w.path = `${Y||q.nid}:${O}`, q.skipEscape = !0, w
    }

    function A4K(A, q) {
        let K = A;
        if (K.uuid = K.nss, K.nss = void 0, !q.tolerant && (!K.uuid || !r7K.test(K.uuid))) K.error = K.error || "UUID is not valid.";
        return K
    }

    function q4K(A) {
        let q = A;
        return q.nss = (A.uuid || "").toLowerCase(), q
    }
    var $9A = {
            scheme: "http",
            domainHost: !0,
            parse: w9A,
            serialize: O9A
        },
        K4K = {
            scheme: "https",
            domainHost: $9A.domainHost,
            parse: w9A,
            serialize: O9A
        },
        Y11 = {
            scheme: "ws",
            domainHost: !0,
            parse: a7K,
            serialize: s7K
        },
        Y4K = {
            scheme: "wss",
            domainHost: Y11.domainHost,
            parse: Y11.parse,
            serialize: Y11.serialize
        },
        z4K = {
            scheme: "urn",
            parse: t7K,
            serialize: e7K,
            skipNormalize: !0
        },
        _4K = {
            scheme: "urn:uuid",
            parse: A4K,
            serialize: q4K,
            skipNormalize: !0
        },
        pU1 = {
            http: $9A,
            https: K4K,
            ws: Y11,
            wss: Y4K,
            urn: z4K,
            "urn:uuid": _4K
        };
    H9A.exports = pU1
})
// @from(Ln 26345, Col 4)
M9A = x((iFz, _11) => {
    var {
        normalizeIPv6: w4K,
        normalizeIPv4: O4K,
        removeDotSegments: iy6,
        recomposeAuthority: $4K,
        normalizeComponentEncoding: z11
    } = z9A(), QU1 = j9A();

    function H4K(A, q) {
        if (typeof A === "string") A = Fx(gp(A, q), q);
        else if (typeof A === "object") A = gp(Fx(A, q), q);
        return A
    }

    function j4K(A, q, K) {
        let Y = Object.assign({
                scheme: "null"
            }, K),
            z = J9A(gp(A, Y), gp(q, Y), Y, !0);
        return Fx(z, {
            ...Y,
            skipEscape: !0
        })
    }

    function J9A(A, q, K, Y) {
        let z = {};
        if (!Y) A = gp(Fx(A, K), K), q = gp(Fx(q, K), K);
        if (K = K || {}, !K.tolerant && q.scheme) z.scheme = q.scheme, z.userinfo = q.userinfo, z.host = q.host, z.port = q.port, z.path = iy6(q.path || ""), z.query = q.query;
        else {
            if (q.userinfo !== void 0 || q.host !== void 0 || q.port !== void 0) z.userinfo = q.userinfo, z.host = q.host, z.port = q.port, z.path = iy6(q.path || ""), z.query = q.query;
            else {
                if (!q.path)
                    if (z.path = A.path, q.query !== void 0) z.query = q.query;
                    else z.query = A.query;
                else {
                    if (q.path.charAt(0) === "/") z.path = iy6(q.path);
                    else {
                        if ((A.userinfo !== void 0 || A.host !== void 0 || A.port !== void 0) && !A.path) z.path = "/" + q.path;
                        else if (!A.path) z.path = q.path;
                        else z.path = A.path.slice(0, A.path.lastIndexOf("/") + 1) + q.path;
                        z.path = iy6(z.path)
                    }
                    z.query = q.query
                }
                z.userinfo = A.userinfo, z.host = A.host, z.port = A.port
            }
            z.scheme = A.scheme
        }
        return z.fragment = q.fragment, z
    }

    function J4K(A, q, K) {
        if (typeof A === "string") A = unescape(A), A = Fx(z11(gp(A, K), !0), {
            ...K,
            skipEscape: !0
        });
        else if (typeof A === "object") A = Fx(z11(A, !0), {
            ...K,
            skipEscape: !0
        });
        if (typeof q === "string") q = unescape(q), q = Fx(z11(gp(q, K), !0), {
            ...K,
            skipEscape: !0
        });
        else if (typeof q === "object") q = Fx(z11(q, !0), {
            ...K,
            skipEscape: !0
        });
        return A.toLowerCase() === q.toLowerCase()
    }

    function Fx(A, q) {
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
            _ = QU1[(Y.scheme || K.scheme || "").toLowerCase()];
        if (_ && _.serialize) _.serialize(K, Y);
        if (K.path !== void 0)
            if (!Y.skipEscape) {
                if (K.path = escape(K.path), K.scheme !== void 0) K.path = K.path.split("%3A").join(":")
            } else K.path = unescape(K.path);
        if (Y.reference !== "suffix" && K.scheme) z.push(K.scheme, ":");
        let w = $4K(K);
        if (w !== void 0) {
            if (Y.reference !== "suffix") z.push("//");
            if (z.push(w), K.path && K.path.charAt(0) !== "/") z.push("/")
        }
        if (K.path !== void 0) {
            let O = K.path;
            if (!Y.absolutePath && (!_ || !_.absolutePath)) O = iy6(O);
            if (w === void 0) O = O.replace(/^\/\//u, "/%2F");
            z.push(O)
        }
        if (K.query !== void 0) z.push("?", K.query);
        if (K.fragment !== void 0) z.push("#", K.fragment);
        return z.join("")
    }
    var M4K = Array.from({
        length: 127
    }, (A, q) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(q)));

    function D4K(A) {
        let q = 0;
        for (let K = 0, Y = A.length; K < Y; ++K)
            if (q = A.charCodeAt(K), q > 126 || M4K[q]) return !0;
        return !1
    }
    var X4K = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;

    function gp(A, q) {
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
            _ = !1;
        if (K.reference === "suffix") A = (K.scheme ? K.scheme + ":" : "") + "//" + A;
        let w = A.match(X4K);
        if (w) {
            if (Y.scheme = w[1], Y.userinfo = w[3], Y.host = w[4], Y.port = parseInt(w[5], 10), Y.path = w[6] || "", Y.query = w[7], Y.fragment = w[8], isNaN(Y.port)) Y.port = w[5];
            if (Y.host) {
                let $ = O4K(Y.host);
                if ($.isIPV4 === !1) {
                    let H = w4K($.host);
                    Y.host = H.host.toLowerCase(), _ = H.isIPV6
                } else Y.host = $.host, _ = !0
            }
            if (Y.scheme === void 0 && Y.userinfo === void 0 && Y.host === void 0 && Y.port === void 0 && Y.query === void 0 && !Y.path) Y.reference = "same-document";
            else if (Y.scheme === void 0) Y.reference = "relative";
            else if (Y.fragment === void 0) Y.reference = "absolute";
            else Y.reference = "uri";
            if (K.reference && K.reference !== "suffix" && K.reference !== Y.reference) Y.error = Y.error || "URI is not a " + K.reference + " reference.";
            let O = QU1[(K.scheme || Y.scheme || "").toLowerCase()];
            if (!K.unicodeSupport && (!O || !O.unicodeSupport)) {
                if (Y.host && (K.domainHost || O && O.domainHost) && _ === !1 && D4K(Y.host)) try {
                    Y.host = URL.domainToASCII(Y.host.toLowerCase())
                } catch ($) {
                    Y.error = Y.error || "Host's domain name can not be converted to ASCII: " + $
                }
            }
            if (!O || O && !O.skipNormalize) {
                if (z && Y.scheme !== void 0) Y.scheme = unescape(Y.scheme);
                if (z && Y.host !== void 0) Y.host = unescape(Y.host);
                if (Y.path) Y.path = escape(unescape(Y.path));
                if (Y.fragment) Y.fragment = encodeURI(decodeURIComponent(Y.fragment))
            }
            if (O && O.parse) O.parse(Y, K)
        } else Y.error = Y.error || "URI can not be parsed.";
        return Y
    }
    var UU1 = {
        SCHEMES: QU1,
        normalize: H4K,
        resolve: j4K,
        resolveComponents: J9A,
        equal: J4K,
        serialize: Fx,
        parse: gp
    };
    _11.exports = UU1;
    _11.exports.default = UU1;
    _11.exports.fastUri = UU1
})
// @from(Ln 26531, Col 4)
P9A = x((X9A) => {
    Object.defineProperty(X9A, "__esModule", {
        value: !0
    });
    var D9A = M9A();
    D9A.code = 'require("ajv/dist/runtime/uri").default';
    X9A.default = D9A
})
// @from(Ln 26539, Col 4)
V9A = x((Fp) => {
    Object.defineProperty(Fp, "__esModule", {
        value: !0
    });
    Fp.CodeGen = Fp.Name = Fp.nil = Fp.stringify = Fp.str = Fp._ = Fp.KeywordCxt = void 0;
    var W4K = dy6();
    Object.defineProperty(Fp, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return W4K.KeywordCxt
        }
    });
    var iO6 = y3();
    Object.defineProperty(Fp, "_", {
        enumerable: !0,
        get: function() {
            return iO6._
        }
    });
    Object.defineProperty(Fp, "str", {
        enumerable: !0,
        get: function() {
            return iO6.str
        }
    });
    Object.defineProperty(Fp, "stringify", {
        enumerable: !0,
        get: function() {
            return iO6.stringify
        }
    });
    Object.defineProperty(Fp, "nil", {
        enumerable: !0,
        get: function() {
            return iO6.nil
        }
    });
    Object.defineProperty(Fp, "Name", {
        enumerable: !0,
        get: function() {
            return iO6.Name
        }
    });
    Object.defineProperty(Fp, "CodeGen", {
        enumerable: !0,
        get: function() {
            return iO6.CodeGen
        }
    });
    var Z4K = A11(),
        T9A = cy6(),
        G4K = NU1(),
        ny6 = K11(),
        f4K = y3(),
        ry6 = py6(),
        w11 = Fy6(),
        cU1 = nY(),
        W9A = r3A(),
        T4K = P9A(),
        v9A = (A, q) => new RegExp(A, q);
    v9A.code = "new RegExp";
    var v4K = ["removeAdditional", "useDefaults", "coerceTypes"],
        N4K = new Set(["validate", "serialize", "parse", "wrapper", "root", "schema", "keyword", "pattern", "formats", "validate$data", "func", "obj", "Error"]),
        V4K = {
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
        k4K = {
            ignoreKeywordsWithRef: "",
            jsPropertySyntax: "",
            unicode: '"minLength"/"maxLength" account for unicode characters by default.'
        },
        Z9A = 200;

    function E4K(A) {
        var q, K, Y, z, _, w, O, $, H, j, J, M, D, X, P, W, Z, G, f, v, N, V, L, h, R;
        let u = A.strict,
            I = (q = A.code) === null || q === void 0 ? void 0 : q.optimize,
            g = I === !0 || I === void 0 ? 1 : I || 0,
            B = (Y = (K = A.code) === null || K === void 0 ? void 0 : K.regExp) !== null && Y !== void 0 ? Y : v9A,
            b = (z = A.uriResolver) !== null && z !== void 0 ? z : T4K.default;
        return {
            strictSchema: (w = (_ = A.strictSchema) !== null && _ !== void 0 ? _ : u) !== null && w !== void 0 ? w : !0,
            strictNumbers: ($ = (O = A.strictNumbers) !== null && O !== void 0 ? O : u) !== null && $ !== void 0 ? $ : !0,
            strictTypes: (j = (H = A.strictTypes) !== null && H !== void 0 ? H : u) !== null && j !== void 0 ? j : "log",
            strictTuples: (M = (J = A.strictTuples) !== null && J !== void 0 ? J : u) !== null && M !== void 0 ? M : "log",
            strictRequired: (X = (D = A.strictRequired) !== null && D !== void 0 ? D : u) !== null && X !== void 0 ? X : !1,
            code: A.code ? {
                ...A.code,
                optimize: g,
                regExp: B
            } : {
                optimize: g,
                regExp: B
            },
            loopRequired: (P = A.loopRequired) !== null && P !== void 0 ? P : Z9A,
            loopEnum: (W = A.loopEnum) !== null && W !== void 0 ? W : Z9A,
            meta: (Z = A.meta) !== null && Z !== void 0 ? Z : !0,
            messages: (G = A.messages) !== null && G !== void 0 ? G : !0,
            inlineRefs: (f = A.inlineRefs) !== null && f !== void 0 ? f : !0,
            schemaId: (v = A.schemaId) !== null && v !== void 0 ? v : "$id",
            addUsedSchema: (N = A.addUsedSchema) !== null && N !== void 0 ? N : !0,
            validateSchema: (V = A.validateSchema) !== null && V !== void 0 ? V : !0,
            validateFormats: (L = A.validateFormats) !== null && L !== void 0 ? L : !0,
            unicodeRegExp: (h = A.unicodeRegExp) !== null && h !== void 0 ? h : !0,
            int32range: (R = A.int32range) !== null && R !== void 0 ? R : !0,
            uriResolver: b
        }
    }
    class O11 {
        constructor(A = {}) {
            this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = new Set, this._loading = {}, this._cache = new Map, A = this.opts = {
                ...A,
                ...E4K(A)
            };
            let {
                es5: q,
                lines: K
            } = this.opts.code;
            this.scope = new f4K.ValueScope({
                scope: {},
                prefixes: N4K,
                es5: q,
                lines: K
            }), this.logger = C4K(A.logger);
            let Y = A.validateFormats;
            if (A.validateFormats = !1, this.RULES = (0, G4K.getRules)(), G9A.call(this, V4K, A, "NOT SUPPORTED"), G9A.call(this, k4K, A, "DEPRECATED", "warn"), this._metaOpts = h4K.call(this), A.formats) L4K.call(this);
            if (this._addVocabularies(), this._addDefaultMetaSchema(), A.keywords) R4K.call(this, A.keywords);
            if (typeof A.meta == "object") this.addMetaSchema(A.meta);
            y4K.call(this), A.validateFormats = Y
        }
        _addVocabularies() {
            this.addKeyword("$async")
        }
        _addDefaultMetaSchema() {
            let {
                $data: A,
                meta: q,
                schemaId: K
            } = this.opts, Y = W9A;
            if (K === "id") Y = {
                ...W9A
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
            async function Y(H, j) {
                await z.call(this, H.$schema);
                let J = this._addSchema(H, j);
                return J.validate || _.call(this, J)
            }
            async function z(H) {
                if (H && !this.getSchema(H)) await Y.call(this, {
                    $ref: H
                }, !0)
            }
            async function _(H) {
                try {
                    return this._compileSchemaEnv(H)
                } catch (j) {
                    if (!(j instanceof T9A.default)) throw j;
                    return w.call(this, j), await O.call(this, j.missingSchema), _.call(this, H)
                }
            }

            function w({
                missingSchema: H,
                missingRef: j
            }) {
                if (this.refs[H]) throw Error(`AnySchema ${H} is loaded but ${j} cannot be resolved`)
            }
            async function O(H) {
                let j = await $.call(this, H);
                if (!this.refs[H]) await z.call(this, j.$schema);
                if (!this.refs[H]) this.addSchema(j, H, q)
            }
            async function $(H) {
                let j = this._loading[H];
                if (j) return j;
                try {
                    return await (this._loading[H] = K(H))
                } finally {
                    delete this._loading[H]
                }
            }
        }
        addSchema(A, q, K, Y = this.opts.validateSchema) {
            if (Array.isArray(A)) {
                for (let _ of A) this.addSchema(_, void 0, K, Y);
                return this
            }
            let z;
            if (typeof A === "object") {
                let {
                    schemaId: _
                } = this.opts;
                if (z = A[_], z !== void 0 && typeof z != "string") throw Error(`schema ${_} must be string`)
            }
            return q = (0, ry6.normalizeId)(q || z), this._checkUnique(q), this.schemas[q] = this._addSchema(A, K, q, Y, !0), this
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
            while (typeof(q = f9A.call(this, A)) == "string") A = q;
            if (q === void 0) {
                let {
                    schemaId: K
                } = this.opts, Y = new ny6.SchemaEnv({
                    schema: {},
                    schemaId: K
                });
                if (q = ny6.resolveSchema.call(this, Y, A), !q) return;
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
                    let q = f9A.call(this, A);
                    if (typeof q == "object") this._cache.delete(q.schema);
                    return delete this.schemas[A], delete this.refs[A], this
                }
                case "object": {
                    let q = A;
                    this._cache.delete(q);
                    let K = A[this.opts.schemaId];
                    if (K) K = (0, ry6.normalizeId)(K), delete this.schemas[K], delete this.refs[K];
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
            if (b4K.call(this, K, q), !q) return (0, cU1.eachItem)(K, (z) => dU1.call(this, z)), this;
            u4K.call(this, q);
            let Y = {
                ...q,
                type: (0, w11.getJSONTypes)(q.type),
                schemaType: (0, w11.getJSONTypes)(q.schemaType)
            };
            return (0, cU1.eachItem)(K, Y.type.length === 0 ? (z) => dU1.call(this, z, Y) : (z) => Y.type.forEach((_) => dU1.call(this, z, Y, _))), this
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
                    _ = A;
                for (let w of z) _ = _[w];
                for (let w in K) {
                    let O = K[w];
                    if (typeof O != "object") continue;
                    let {
                        $data: $
                    } = O.definition, H = _[w];
                    if ($ && H) _[w] = N9A(H)
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
            let _, {
                schemaId: w
            } = this.opts;
            if (typeof A == "object") _ = A[w];
            else if (this.opts.jtd) throw Error("schema must be object");
            else if (typeof A != "boolean") throw Error("schema must be object or boolean");
            let O = this._cache.get(A);
            if (O !== void 0) return O;
            K = (0, ry6.normalizeId)(_ || K);
            let $ = ry6.getSchemaRefs.call(this, A, K);
            if (O = new ny6.SchemaEnv({
                    schema: A,
                    schemaId: w,
                    meta: q,
                    baseId: K,
                    localRefs: $
                }), this._cache.set(O.schema, O), z && !K.startsWith("#")) {
                if (K) this._checkUnique(K);
                this.refs[K] = O
            }
            if (Y) this.validateSchema(A, !0);
            return O
        }
        _checkUnique(A) {
            if (this.schemas[A] || this.refs[A]) throw Error(`schema with key or id "${A}" already exists`)
        }
        _compileSchemaEnv(A) {
            if (A.meta) this._compileMetaSchema(A);
            else ny6.compileSchema.call(this, A);
            if (!A.validate) throw Error("ajv implementation error");
            return A.validate
        }
        _compileMetaSchema(A) {
            let q = this.opts;
            this.opts = this._metaOpts;
            try {
                ny6.compileSchema.call(this, A)
            } finally {
                this.opts = q
            }
        }
    }
    O11.ValidationError = Z4K.default;
    O11.MissingRefError = T9A.default;
    Fp.default = O11;

    function G9A(A, q, K, Y = "error") {
        for (let z in A) {
            let _ = z;
            if (_ in q) this.logger[Y](`${K}: option ${z}. ${A[_]}`)
        }
    }

    function f9A(A) {
        return A = (0, ry6.normalizeId)(A), this.schemas[A] || this.refs[A]
    }

    function y4K() {
        let A = this.opts.schemas;
        if (!A) return;
        if (Array.isArray(A)) this.addSchema(A);
        else
            for (let q in A) this.addSchema(A[q], q)
    }

    function L4K() {
        for (let A in this.opts.formats) {
            let q = this.opts.formats[A];
            if (q) this.addFormat(A, q)
        }
    }

    function R4K(A) {
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

    function h4K() {
        let A = {
            ...this.opts
        };
        for (let q of v4K) delete A[q];
        return A
    }
    var S4K = {
        log() {},
        warn() {},
        error() {}
    };

    function C4K(A) {
        if (A === !1) return S4K;
        if (A === void 0) return console;
        if (A.log && A.warn && A.error) return A;
        throw Error("logger must implement log, warn and error methods")
    }
    var I4K = /^[a-z_$][a-z0-9_$:-]*$/i;

    function b4K(A, q) {
        let {
            RULES: K
        } = this;
        if ((0, cU1.eachItem)(A, (Y) => {
                if (K.keywords[Y]) throw Error(`Keyword ${Y} is already defined`);
                if (!I4K.test(Y)) throw Error(`Keyword ${Y} has invalid name`)
            }), !q) return;
        if (q.$data && !(("code" in q) || ("validate" in q))) throw Error('$data keyword must have "code" or "validate" function')
    }

    function dU1(A, q, K) {
        var Y;
        let z = q === null || q === void 0 ? void 0 : q.post;
        if (K && z) throw Error('keyword with "post" flag cannot have "type"');
        let {
            RULES: _
        } = this, w = z ? _.post : _.rules.find(({
            type: $
        }) => $ === K);
        if (!w) w = {
            type: K,
            rules: []
        }, _.rules.push(w);
        if (_.keywords[A] = !0, !q) return;
        let O = {
            keyword: A,
            definition: {
                ...q,
                type: (0, w11.getJSONTypes)(q.type),
                schemaType: (0, w11.getJSONTypes)(q.schemaType)
            }
        };
        if (q.before) x4K.call(this, w, O, q.before);
        else w.rules.push(O);
        _.all[A] = O, (Y = q.implements) === null || Y === void 0 || Y.forEach(($) => this.addKeyword($))
    }

    function x4K(A, q, K) {
        let Y = A.rules.findIndex((z) => z.keyword === K);
        if (Y >= 0) A.rules.splice(Y, 0, q);
        else A.rules.push(q), this.logger.warn(`rule ${K} is not defined`)
    }

    function u4K(A) {
        let {
            metaSchema: q
        } = A;
        if (q === void 0) return;
        if (A.$data && this.opts.$data) q = N9A(q);
        A.validateSchema = this.compile(q, !0)
    }
    var m4K = {
        $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };

    function N9A(A) {
        return {
            anyOf: [A, m4K]
        }
    }
})
// @from(Ln 27071, Col 4)
E9A = x((k9A) => {
    Object.defineProperty(k9A, "__esModule", {
        value: !0
    });
    var F4K = {
        keyword: "id",
        code() {
            throw Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')
        }
    };
    k9A.default = F4K
})
// @from(Ln 27083, Col 4)
C9A = x((h9A) => {
    Object.defineProperty(h9A, "__esModule", {
        value: !0
    });
    h9A.callRef = h9A.getValidate = void 0;
    var Q4K = cy6(),
        y9A = _y(),
        vT = y3(),
        nO6 = mp(),
        L9A = K11(),
        $11 = nY(),
        U4K = {
            keyword: "$ref",
            schemaType: "string",
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    it: Y
                } = A, {
                    baseId: z,
                    schemaEnv: _,
                    validateName: w,
                    opts: O,
                    self: $
                } = Y, {
                    root: H
                } = _;
                if ((K === "#" || K === "#/") && z === H.baseId) return J();
                let j = L9A.resolveRef.call($, H, z, K);
                if (j === void 0) throw new Q4K.default(Y.opts.uriResolver, z, K);
                if (j instanceof L9A.SchemaEnv) return M(j);
                return D(j);

                function J() {
                    if (_ === H) return H11(A, w, _, _.$async);
                    let X = q.scopeValue("root", {
                        ref: H
                    });
                    return H11(A, vT._`${X}.validate`, H, H.$async)
                }

                function M(X) {
                    let P = R9A(A, X);
                    H11(A, P, X, X.$async)
                }

                function D(X) {
                    let P = q.scopeValue("schema", O.code.source === !0 ? {
                            ref: X,
                            code: (0, vT.stringify)(X)
                        } : {
                            ref: X
                        }),
                        W = q.name("valid"),
                        Z = A.subschema({
                            schema: X,
                            dataTypes: [],
                            schemaPath: vT.nil,
                            topSchemaRef: P,
                            errSchemaPath: K
                        }, W);
                    A.mergeEvaluated(Z), A.ok(W)
                }
            }
        };

    function R9A(A, q) {
        let {
            gen: K
        } = A;
        return q.validate ? K.scopeValue("validate", {
            ref: q.validate
        }) : vT._`${K.scopeValue("wrapper",{ref:q})}.validate`
    }
    h9A.getValidate = R9A;

    function H11(A, q, K, Y) {
        let {
            gen: z,
            it: _
        } = A, {
            allErrors: w,
            schemaEnv: O,
            opts: $
        } = _, H = $.passContext ? nO6.default.this : vT.nil;
        if (Y) j();
        else J();

        function j() {
            if (!O.$async) throw Error("async schema referenced by sync schema");
            let X = z.let("valid");
            z.try(() => {
                if (z.code(vT._`await ${(0,y9A.callValidateCode)(A,q,H)}`), D(q), !w) z.assign(X, !0)
            }, (P) => {
                if (z.if(vT._`!(${P} instanceof ${_.ValidationError})`, () => z.throw(P)), M(P), !w) z.assign(X, !1)
            }), A.ok(X)
        }

        function J() {
            A.result((0, y9A.callValidateCode)(A, q, H), () => D(q), () => M(q))
        }

        function M(X) {
            let P = vT._`${X}.errors`;
            z.assign(nO6.default.vErrors, vT._`${nO6.default.vErrors} === null ? ${P} : ${nO6.default.vErrors}.concat(${P})`), z.assign(nO6.default.errors, vT._`${nO6.default.vErrors}.length`)
        }

        function D(X) {
            var P;
            if (!_.opts.unevaluated) return;
            let W = (P = K === null || K === void 0 ? void 0 : K.validate) === null || P === void 0 ? void 0 : P.evaluated;
            if (_.props !== !0)
                if (W && !W.dynamicProps) {
                    if (W.props !== void 0) _.props = $11.mergeEvaluated.props(z, W.props, _.props)
                } else {
                    let Z = z.var("props", vT._`${X}.evaluated.props`);
                    _.props = $11.mergeEvaluated.props(z, Z, _.props, vT.Name)
                } if (_.items !== !0)
                if (W && !W.dynamicItems) {
                    if (W.items !== void 0) _.items = $11.mergeEvaluated.items(z, W.items, _.items)
                } else {
                    let Z = z.var("items", vT._`${X}.evaluated.items`);
                    _.items = $11.mergeEvaluated.items(z, Z, _.items, vT.Name)
                }
        }
    }
    h9A.callRef = H11;
    h9A.default = U4K
})
// @from(Ln 27213, Col 4)
b9A = x((I9A) => {
    Object.defineProperty(I9A, "__esModule", {
        value: !0
    });
    var l4K = E9A(),
        i4K = C9A(),
        n4K = ["$schema", "$id", "$defs", "$vocabulary", {
            keyword: "$comment"
        }, "definitions", l4K.default, i4K.default];
    I9A.default = n4K
})
// @from(Ln 27224, Col 4)
u9A = x((x9A) => {
    Object.defineProperty(x9A, "__esModule", {
        value: !0
    });
    var j11 = y3(),
        on = j11.operators,
        J11 = {
            maximum: {
                okStr: "<=",
                ok: on.LTE,
                fail: on.GT
            },
            minimum: {
                okStr: ">=",
                ok: on.GTE,
                fail: on.LT
            },
            exclusiveMaximum: {
                okStr: "<",
                ok: on.LT,
                fail: on.GTE
            },
            exclusiveMinimum: {
                okStr: ">",
                ok: on.GT,
                fail: on.LTE
            }
        },
        o4K = {
            message: ({
                keyword: A,
                schemaCode: q
            }) => j11.str`must be ${J11[A].okStr} ${q}`,
            params: ({
                keyword: A,
                schemaCode: q
            }) => j11._`{comparison: ${J11[A].okStr}, limit: ${q}}`
        },
        a4K = {
            keyword: Object.keys(J11),
            type: "number",
            schemaType: "number",
            $data: !0,
            error: o4K,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A;
                A.fail$data(j11._`${K} ${J11[q].fail} ${Y} || isNaN(${K})`)
            }
        };
    x9A.default = a4K
})
// @from(Ln 27279, Col 4)
B9A = x((m9A) => {
    Object.defineProperty(m9A, "__esModule", {
        value: !0
    });
    var oy6 = y3(),
        t4K = {
            message: ({
                schemaCode: A
            }) => oy6.str`must be multiple of ${A}`,
            params: ({
                schemaCode: A
            }) => oy6._`{multipleOf: ${A}}`
        },
        e4K = {
            keyword: "multipleOf",
            type: "number",
            schemaType: "number",
            $data: !0,
            error: t4K,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    schemaCode: Y,
                    it: z
                } = A, _ = z.opts.multipleOfPrecision, w = q.let("res"), O = _ ? oy6._`Math.abs(Math.round(${w}) - ${w}) > 1e-${_}` : oy6._`${w} !== parseInt(${w})`;
                A.fail$data(oy6._`(${Y} === 0 || (${w} = ${K}/${Y}, ${O}))`)
            }
        };
    m9A.default = e4K
})
// @from(Ln 27310, Col 4)
p9A = x((F9A) => {
    Object.defineProperty(F9A, "__esModule", {
        value: !0
    });

    function g9A(A) {
        let q = A.length,
            K = 0,
            Y = 0,
            z;
        while (Y < q)
            if (K++, z = A.charCodeAt(Y++), z >= 55296 && z <= 56319 && Y < q) {
                if (z = A.charCodeAt(Y), (z & 64512) === 56320) Y++
            } return K
    }
    F9A.default = g9A;
    g9A.code = 'require("ajv/dist/runtime/ucs2length").default'
})
// @from(Ln 27328, Col 4)
U9A = x((Q9A) => {
    Object.defineProperty(Q9A, "__esModule", {
        value: !0
    });
    var xA6 = y3(),
        KqK = nY(),
        YqK = p9A(),
        zqK = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxLength" ? "more" : "fewer";
                return xA6.str`must NOT have ${K} than ${q} characters`
            },
            params: ({
                schemaCode: A
            }) => xA6._`{limit: ${A}}`
        },
        _qK = {
            keyword: ["maxLength", "minLength"],
            type: "string",
            schemaType: "number",
            $data: !0,
            error: zqK,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y,
                    it: z
                } = A, _ = q === "maxLength" ? xA6.operators.GT : xA6.operators.LT, w = z.opts.unicode === !1 ? xA6._`${K}.length` : xA6._`${(0,KqK.useFunc)(A.gen,YqK.default)}(${K})`;
                A.fail$data(xA6._`${w} ${_} ${Y}`)
            }
        };
    Q9A.default = _qK
})
// @from(Ln 27365, Col 4)
c9A = x((d9A) => {
    Object.defineProperty(d9A, "__esModule", {
        value: !0
    });
    var OqK = _y(),
        M11 = y3(),
        $qK = {
            message: ({
                schemaCode: A
            }) => M11.str`must match pattern "${A}"`,
            params: ({
                schemaCode: A
            }) => M11._`{pattern: ${A}}`
        },
        HqK = {
            keyword: "pattern",
            type: "string",
            schemaType: "string",
            $data: !0,
            error: $qK,
            code(A) {
                let {
                    data: q,
                    $data: K,
                    schema: Y,
                    schemaCode: z,
                    it: _
                } = A, w = _.opts.unicodeRegExp ? "u" : "", O = K ? M11._`(new RegExp(${z}, ${w}))` : (0, OqK.usePattern)(A, Y);
                A.fail$data(M11._`!${O}.test(${q})`)
            }
        };
    d9A.default = HqK
})
// @from(Ln 27398, Col 4)
i9A = x((l9A) => {
    Object.defineProperty(l9A, "__esModule", {
        value: !0
    });
    var ay6 = y3(),
        JqK = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxProperties" ? "more" : "fewer";
                return ay6.str`must NOT have ${K} than ${q} properties`
            },
            params: ({
                schemaCode: A
            }) => ay6._`{limit: ${A}}`
        },
        MqK = {
            keyword: ["maxProperties", "minProperties"],
            type: "object",
            schemaType: "number",
            $data: !0,
            error: JqK,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A, z = q === "maxProperties" ? ay6.operators.GT : ay6.operators.LT;
                A.fail$data(ay6._`Object.keys(${K}).length ${z} ${Y}`)
            }
        };
    l9A.default = MqK
})
// @from(Ln 27432, Col 4)
r9A = x((n9A) => {
    Object.defineProperty(n9A, "__esModule", {
        value: !0
    });
    var sy6 = _y(),
        ty6 = y3(),
        XqK = nY(),
        PqK = {
            message: ({
                params: {
                    missingProperty: A
                }
            }) => ty6.str`must have required property '${A}'`,
            params: ({
                params: {
                    missingProperty: A
                }
            }) => ty6._`{missingProperty: ${A}}`
        },
        WqK = {
            keyword: "required",
            type: "object",
            schemaType: "array",
            $data: !0,
            error: PqK,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    schemaCode: Y,
                    data: z,
                    $data: _,
                    it: w
                } = A, {
                    opts: O
                } = w;
                if (!_ && K.length === 0) return;
                let $ = K.length >= O.loopRequired;
                if (w.allErrors) H();
                else j();
                if (O.strictRequired) {
                    let D = A.parentSchema.properties,
                        {
                            definedProperties: X
                        } = A.it;
                    for (let P of K)
                        if ((D === null || D === void 0 ? void 0 : D[P]) === void 0 && !X.has(P)) {
                            let W = w.schemaEnv.baseId + w.errSchemaPath,
                                Z = `required property "${P}" is not defined at "${W}" (strictRequired)`;
                            (0, XqK.checkStrictMode)(w, Z, w.opts.strictRequired)
                        }
                }

                function H() {
                    if ($ || _) A.block$data(ty6.nil, J);
                    else
                        for (let D of K)(0, sy6.checkReportMissingProp)(A, D)
                }

                function j() {
                    let D = q.let("missing");
                    if ($ || _) {
                        let X = q.let("valid", !0);
                        A.block$data(X, () => M(D, X)), A.ok(X)
                    } else q.if((0, sy6.checkMissingProp)(A, K, D)), (0, sy6.reportMissingProp)(A, D), q.else()
                }

                function J() {
                    q.forOf("prop", Y, (D) => {
                        A.setParams({
                            missingProperty: D
                        }), q.if((0, sy6.noPropertyInData)(q, z, D, O.ownProperties), () => A.error())
                    })
                }

                function M(D, X) {
                    A.setParams({
                        missingProperty: D
                    }), q.forOf(D, Y, () => {
                        q.assign(X, (0, sy6.propertyInData)(q, z, D, O.ownProperties)), q.if((0, ty6.not)(X), () => {
                            A.error(), q.break()
                        })
                    }, ty6.nil)
                }
            }
        };
    n9A.default = WqK
})
// @from(Ln 27520, Col 4)
a9A = x((o9A) => {
    Object.defineProperty(o9A, "__esModule", {
        value: !0
    });
    var ey6 = y3(),
        GqK = {
            message({
                keyword: A,
                schemaCode: q
            }) {
                let K = A === "maxItems" ? "more" : "fewer";
                return ey6.str`must NOT have ${K} than ${q} items`
            },
            params: ({
                schemaCode: A
            }) => ey6._`{limit: ${A}}`
        },
        fqK = {
            keyword: ["maxItems", "minItems"],
            type: "array",
            schemaType: "number",
            $data: !0,
            error: GqK,
            code(A) {
                let {
                    keyword: q,
                    data: K,
                    schemaCode: Y
                } = A, z = q === "maxItems" ? ey6.operators.GT : ey6.operators.LT;
                A.fail$data(ey6._`${K}.length ${z} ${Y}`)
            }
        };
    o9A.default = fqK
})
// @from(Ln 27554, Col 4)
D11 = x((t9A) => {
    Object.defineProperty(t9A, "__esModule", {
        value: !0
    });
    var s9A = SU1();
    s9A.code = 'require("ajv/dist/runtime/equal").default';
    t9A.default = s9A
})
// @from(Ln 27562, Col 4)
AYA = x((e9A) => {
    Object.defineProperty(e9A, "__esModule", {
        value: !0
    });
    var lU1 = Fy6(),
        MP = y3(),
        NqK = nY(),
        VqK = D11(),
        kqK = {
            message: ({
                params: {
                    i: A,
                    j: q
                }
            }) => MP.str`must NOT have duplicate items (items ## ${q} and ${A} are identical)`,
            params: ({
                params: {
                    i: A,
                    j: q
                }
            }) => MP._`{i: ${A}, j: ${q}}`
        },
        EqK = {
            keyword: "uniqueItems",
            type: "array",
            schemaType: "boolean",
            $data: !0,
            error: kqK,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schema: z,
                    parentSchema: _,
                    schemaCode: w,
                    it: O
                } = A;
                if (!Y && !z) return;
                let $ = q.let("valid"),
                    H = _.items ? (0, lU1.getSchemaTypes)(_.items) : [];
                A.block$data($, j, MP._`${w} === false`), A.ok($);

                function j() {
                    let X = q.let("i", MP._`${K}.length`),
                        P = q.let("j");
                    A.setParams({
                        i: X,
                        j: P
                    }), q.assign($, !0), q.if(MP._`${X} > 1`, () => (J() ? M : D)(X, P))
                }

                function J() {
                    return H.length > 0 && !H.some((X) => X === "object" || X === "array")
                }

                function M(X, P) {
                    let W = q.name("item"),
                        Z = (0, lU1.checkDataTypes)(H, W, O.opts.strictNumbers, lU1.DataType.Wrong),
                        G = q.const("indices", MP._`{}`);
                    q.for(MP._`;${X}--;`, () => {
                        if (q.let(W, MP._`${K}[${X}]`), q.if(Z, MP._`continue`), H.length > 1) q.if(MP._`typeof ${W} == "string"`, MP._`${W} += "_"`);
                        q.if(MP._`typeof ${G}[${W}] == "number"`, () => {
                            q.assign(P, MP._`${G}[${W}]`), A.error(), q.assign($, !1).break()
                        }).code(MP._`${G}[${W}] = ${X}`)
                    })
                }

                function D(X, P) {
                    let W = (0, NqK.useFunc)(q, VqK.default),
                        Z = q.name("outer");
                    q.label(Z).for(MP._`;${X}--;`, () => q.for(MP._`${P} = ${X}; ${P}--;`, () => q.if(MP._`${W}(${K}[${X}], ${K}[${P}])`, () => {
                        A.error(), q.assign($, !1).break(Z)
                    })))
                }
            }
        };
    e9A.default = EqK
})
// @from(Ln 27641, Col 4)
KYA = x((qYA) => {
    Object.defineProperty(qYA, "__esModule", {
        value: !0
    });
    var iU1 = y3(),
        LqK = nY(),
        RqK = D11(),
        hqK = {
            message: "must be equal to constant",
            params: ({
                schemaCode: A
            }) => iU1._`{allowedValue: ${A}}`
        },
        SqK = {
            keyword: "const",
            $data: !0,
            error: hqK,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schemaCode: z,
                    schema: _
                } = A;
                if (Y || _ && typeof _ == "object") A.fail$data(iU1._`!${(0,LqK.useFunc)(q,RqK.default)}(${K}, ${z})`);
                else A.fail(iU1._`${_} !== ${K}`)
            }
        };
    qYA.default = SqK
})
// @from(Ln 27672, Col 4)
zYA = x((YYA) => {
    Object.defineProperty(YYA, "__esModule", {
        value: !0
    });
    var AL6 = y3(),
        IqK = nY(),
        bqK = D11(),
        xqK = {
            message: "must be equal to one of the allowed values",
            params: ({
                schemaCode: A
            }) => AL6._`{allowedValues: ${A}}`
        },
        uqK = {
            keyword: "enum",
            schemaType: "array",
            $data: !0,
            error: xqK,
            code(A) {
                let {
                    gen: q,
                    data: K,
                    $data: Y,
                    schema: z,
                    schemaCode: _,
                    it: w
                } = A;
                if (!Y && z.length === 0) throw Error("enum must have non-empty array");
                let O = z.length >= w.opts.loopEnum,
                    $, H = () => $ !== null && $ !== void 0 ? $ : $ = (0, IqK.useFunc)(q, bqK.default),
                    j;
                if (O || Y) j = q.let("valid"), A.block$data(j, J);
                else {
                    if (!Array.isArray(z)) throw Error("ajv implementation error");
                    let D = q.const("vSchema", _);
                    j = (0, AL6.or)(...z.map((X, P) => M(D, P)))
                }
                A.pass(j);

                function J() {
                    q.assign(j, !1), q.forOf("v", _, (D) => q.if(AL6._`${H()}(${K}, ${D})`, () => q.assign(j, !0).break()))
                }

                function M(D, X) {
                    let P = z[X];
                    return typeof P === "object" && P !== null ? AL6._`${H()}(${K}, ${D}[${X}])` : AL6._`${K} === ${P}`
                }
            }
        };
    YYA.default = uqK
})
// @from(Ln 27723, Col 4)
wYA = x((_YA) => {
    Object.defineProperty(_YA, "__esModule", {
        value: !0
    });
    var BqK = u9A(),
        gqK = B9A(),
        FqK = U9A(),
        pqK = c9A(),
        QqK = i9A(),
        UqK = r9A(),
        dqK = a9A(),
        cqK = AYA(),
        lqK = KYA(),
        iqK = zYA(),
        nqK = [BqK.default, gqK.default, FqK.default, pqK.default, QqK.default, UqK.default, dqK.default, cqK.default, {
            keyword: "type",
            schemaType: ["string", "array"]
        }, {
            keyword: "nullable",
            schemaType: "boolean"
        }, lqK.default, iqK.default];
    _YA.default = nqK
})
// @from(Ln 27746, Col 4)
rU1 = x(($YA) => {
    Object.defineProperty($YA, "__esModule", {
        value: !0
    });
    $YA.validateAdditionalItems = void 0;
    var uA6 = y3(),
        nU1 = nY(),
        oqK = {
            message: ({
                params: {
                    len: A
                }
            }) => uA6.str`must NOT have more than ${A} items`,
            params: ({
                params: {
                    len: A
                }
            }) => uA6._`{limit: ${A}}`
        },
        aqK = {
            keyword: "additionalItems",
            type: "array",
            schemaType: ["boolean", "object"],
            before: "uniqueItems",
            error: oqK,
            code(A) {
                let {
                    parentSchema: q,
                    it: K
                } = A, {
                    items: Y
                } = q;
                if (!Array.isArray(Y)) {
                    (0, nU1.checkStrictMode)(K, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return
                }
                OYA(A, Y)
            }
        };

    function OYA(A, q) {
        let {
            gen: K,
            schema: Y,
            data: z,
            keyword: _,
            it: w
        } = A;
        w.items = !0;
        let O = K.const("len", uA6._`${z}.length`);
        if (Y === !1) A.setParams({
            len: q.length
        }), A.pass(uA6._`${O} <= ${q.length}`);
        else if (typeof Y == "object" && !(0, nU1.alwaysValidSchema)(w, Y)) {
            let H = K.var("valid", uA6._`${O} <= ${q.length}`);
            K.if((0, uA6.not)(H), () => $(H)), A.ok(H)
        }

        function $(H) {
            K.forRange("i", q.length, O, (j) => {
                if (A.subschema({
                        keyword: _,
                        dataProp: j,
                        dataPropType: nU1.Type.Num
                    }, H), !w.allErrors) K.if((0, uA6.not)(H), () => K.break())
            })
        }
    }
    $YA.validateAdditionalItems = OYA;
    $YA.default = aqK
})
// @from(Ln 27817, Col 4)
oU1 = x((MYA) => {
    Object.defineProperty(MYA, "__esModule", {
        value: !0
    });
    MYA.validateTuple = void 0;
    var jYA = y3(),
        X11 = nY(),
        tqK = _y(),
        eqK = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "array", "boolean"],
            before: "uniqueItems",
            code(A) {
                let {
                    schema: q,
                    it: K
                } = A;
                if (Array.isArray(q)) return JYA(A, "additionalItems", q);
                if (K.items = !0, (0, X11.alwaysValidSchema)(K, q)) return;
                A.ok((0, tqK.validateArray)(A))
            }
        };

    function JYA(A, q, K = A.schema) {
        let {
            gen: Y,
            parentSchema: z,
            data: _,
            keyword: w,
            it: O
        } = A;
        if (j(z), O.opts.unevaluated && K.length && O.items !== !0) O.items = X11.mergeEvaluated.items(Y, K.length, O.items);
        let $ = Y.name("valid"),
            H = Y.const("len", jYA._`${_}.length`);
        K.forEach((J, M) => {
            if ((0, X11.alwaysValidSchema)(O, J)) return;
            Y.if(jYA._`${H} > ${M}`, () => A.subschema({
                keyword: w,
                schemaProp: M,
                dataProp: M
            }, $)), A.ok($)
        });

        function j(J) {
            let {
                opts: M,
                errSchemaPath: D
            } = O, X = K.length, P = X === J.minItems && (X === J.maxItems || J[q] === !1);
            if (M.strictTuples && !P) {
                let W = `"${w}" is ${X}-tuple, but minItems or maxItems/${q} are not specified or different at path "${D}"`;
                (0, X11.checkStrictMode)(O, W, M.strictTuples)
            }
        }
    }
    MYA.validateTuple = JYA;
    MYA.default = eqK
})
// @from(Ln 27875, Col 4)
PYA = x((XYA) => {
    Object.defineProperty(XYA, "__esModule", {
        value: !0
    });
    var qKK = oU1(),
        KKK = {
            keyword: "prefixItems",
            type: "array",
            schemaType: ["array"],
            before: "uniqueItems",
            code: (A) => (0, qKK.validateTuple)(A, "items")
        };
    XYA.default = KKK
})
// @from(Ln 27889, Col 4)
GYA = x((ZYA) => {
    Object.defineProperty(ZYA, "__esModule", {
        value: !0
    });
    var WYA = y3(),
        zKK = nY(),
        _KK = _y(),
        wKK = rU1(),
        OKK = {
            message: ({
                params: {
                    len: A
                }
            }) => WYA.str`must NOT have more than ${A} items`,
            params: ({
                params: {
                    len: A
                }
            }) => WYA._`{limit: ${A}}`
        },
        $KK = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            error: OKK,
            code(A) {
                let {
                    schema: q,
                    parentSchema: K,
                    it: Y
                } = A, {
                    prefixItems: z
                } = K;
                if (Y.items = !0, (0, zKK.alwaysValidSchema)(Y, q)) return;
                if (z)(0, wKK.validateAdditionalItems)(A, z);
                else A.ok((0, _KK.validateArray)(A))
            }
        };
    ZYA.default = $KK
})
// @from(Ln 27930, Col 4)
TYA = x((fYA) => {
    Object.defineProperty(fYA, "__esModule", {
        value: !0
    });
    var wy = y3(),
        P11 = nY(),
        jKK = {
            message: ({
                params: {
                    min: A,
                    max: q
                }
            }) => q === void 0 ? wy.str`must contain at least ${A} valid item(s)` : wy.str`must contain at least ${A} and no more than ${q} valid item(s)`,
            params: ({
                params: {
                    min: A,
                    max: q
                }
            }) => q === void 0 ? wy._`{minContains: ${A}}` : wy._`{minContains: ${A}, maxContains: ${q}}`
        },
        JKK = {
            keyword: "contains",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            trackErrors: !0,
            error: jKK,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    parentSchema: Y,
                    data: z,
                    it: _
                } = A, w, O, {
                    minContains: $,
                    maxContains: H
                } = Y;
                if (_.opts.next) w = $ === void 0 ? 1 : $, O = H;
                else w = 1;
                let j = q.const("len", wy._`${z}.length`);
                if (A.setParams({
                        min: w,
                        max: O
                    }), O === void 0 && w === 0) {
                    (0, P11.checkStrictMode)(_, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return
                }
                if (O !== void 0 && w > O) {
                    (0, P11.checkStrictMode)(_, '"minContains" > "maxContains" is always invalid'), A.fail();
                    return
                }
                if ((0, P11.alwaysValidSchema)(_, K)) {
                    let P = wy._`${j} >= ${w}`;
                    if (O !== void 0) P = wy._`${P} && ${j} <= ${O}`;
                    A.pass(P);
                    return
                }
                _.items = !0;
                let J = q.name("valid");
                if (O === void 0 && w === 1) D(J, () => q.if(J, () => q.break()));
                else if (w === 0) {
                    if (q.let(J, !0), O !== void 0) q.if(wy._`${z}.length > 0`, M)
                } else q.let(J, !1), M();
                A.result(J, () => A.reset());

                function M() {
                    let P = q.name("_valid"),
                        W = q.let("count", 0);
                    D(P, () => q.if(P, () => X(W)))
                }

                function D(P, W) {
                    q.forRange("i", 0, j, (Z) => {
                        A.subschema({
                            keyword: "contains",
                            dataProp: Z,
                            dataPropType: P11.Type.Num,
                            compositeRule: !0
                        }, P), W()
                    })
                }

                function X(P) {
                    if (q.code(wy._`${P}++`), O === void 0) q.if(wy._`${P} >= ${w}`, () => q.assign(J, !0).break());
                    else if (q.if(wy._`${P} > ${O}`, () => q.assign(J, !1).break()), w === 1) q.assign(J, !0);
                    else q.if(wy._`${P} >= ${w}`, () => q.assign(J, !0))
                }
            }
        };
    fYA.default = JKK
})
// @from(Ln 28022, Col 4)
yYA = x((VYA) => {
    Object.defineProperty(VYA, "__esModule", {
        value: !0
    });
    VYA.validateSchemaDeps = VYA.validatePropertyDeps = VYA.error = void 0;
    var aU1 = y3(),
        DKK = nY(),
        qL6 = _y();
    VYA.error = {
        message: ({
            params: {
                property: A,
                depsCount: q,
                deps: K
            }
        }) => {
            let Y = q === 1 ? "property" : "properties";
            return aU1.str`must have ${Y} ${K} when property ${A} is present`
        },
        params: ({
            params: {
                property: A,
                depsCount: q,
                deps: K,
                missingProperty: Y
            }
        }) => aU1._`{property: ${A},
    missingProperty: ${Y},
    depsCount: ${q},
    deps: ${K}}`
    };
    var XKK = {
        keyword: "dependencies",
        type: "object",
        schemaType: "object",
        error: VYA.error,
        code(A) {
            let [q, K] = PKK(A);
            vYA(A, q), NYA(A, K)
        }
    };

    function PKK({
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

    function vYA(A, q = A.schema) {
        let {
            gen: K,
            data: Y,
            it: z
        } = A;
        if (Object.keys(q).length === 0) return;
        let _ = K.let("missing");
        for (let w in q) {
            let O = q[w];
            if (O.length === 0) continue;
            let $ = (0, qL6.propertyInData)(K, Y, w, z.opts.ownProperties);
            if (A.setParams({
                    property: w,
                    depsCount: O.length,
                    deps: O.join(", ")
                }), z.allErrors) K.if($, () => {
                for (let H of O)(0, qL6.checkReportMissingProp)(A, H)
            });
            else K.if(aU1._`${$} && (${(0,qL6.checkMissingProp)(A,O,_)})`), (0, qL6.reportMissingProp)(A, _), K.else()
        }
    }
    VYA.validatePropertyDeps = vYA;

    function NYA(A, q = A.schema) {
        let {
            gen: K,
            data: Y,
            keyword: z,
            it: _
        } = A, w = K.name("valid");
        for (let O in q) {
            if ((0, DKK.alwaysValidSchema)(_, q[O])) continue;
            K.if((0, qL6.propertyInData)(K, Y, O, _.opts.ownProperties), () => {
                let $ = A.subschema({
                    keyword: z,
                    schemaProp: O
                }, w);
                A.mergeValidEvaluated($, w)
            }, () => K.var(w, !0)), A.ok(w)
        }
    }
    VYA.validateSchemaDeps = NYA;
    VYA.default = XKK
})
// @from(Ln 28122, Col 4)
hYA = x((RYA) => {
    Object.defineProperty(RYA, "__esModule", {
        value: !0
    });
    var LYA = y3(),
        GKK = nY(),
        fKK = {
            message: "property name must be valid",
            params: ({
                params: A
            }) => LYA._`{propertyName: ${A.propertyName}}`
        },
        TKK = {
            keyword: "propertyNames",
            type: "object",
            schemaType: ["object", "boolean"],
            error: fKK,
            code(A) {
                let {
                    gen: q,
                    schema: K,
                    data: Y,
                    it: z
                } = A;
                if ((0, GKK.alwaysValidSchema)(z, K)) return;
                let _ = q.name("valid");
                q.forIn("key", Y, (w) => {
                    A.setParams({
                        propertyName: w
                    }), A.subschema({
                        keyword: "propertyNames",
                        data: w,
                        dataTypes: ["string"],
                        propertyName: w,
                        compositeRule: !0
                    }, _), q.if((0, LYA.not)(_), () => {
                        if (A.error(!0), !z.allErrors) q.break()
                    })
                }), A.ok(_)
            }
        };
    RYA.default = TKK
})