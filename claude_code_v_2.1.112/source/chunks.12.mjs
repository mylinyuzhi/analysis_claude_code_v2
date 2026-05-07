
// @from(Ln 30861, Col 4)
mL7 = p((sIA, Dj8) => {
    var {
        normalizeIPv6: QC5,
        normalizeIPv4: dC5,
        removeDotSegments: ag6,
        recomposeAuthority: cC5,
        normalizeComponentEncoding: Wj8
    } = hL7(), e91 = xL7();

    function lC5(q, K) {
        if (typeof q === "string") q = OU(Mr(q, K), K);
        else if (typeof q === "object") q = Mr(OU(q, K), K);
        return q
    }

    function nC5(q, K, _) {
        let z = Object.assign({
                scheme: "null"
            }, _),
            Y = uL7(Mr(q, z), Mr(K, z), z, !0);
        return OU(Y, {
            ...z,
            skipEscape: !0
        })
    }

    function uL7(q, K, _, z) {
        let Y = {};
        if (!z) q = Mr(OU(q, _), _), K = Mr(OU(K, _), _);
        if (_ = _ || {}, !_.tolerant && K.scheme) Y.scheme = K.scheme, Y.userinfo = K.userinfo, Y.host = K.host, Y.port = K.port, Y.path = ag6(K.path || ""), Y.query = K.query;
        else {
            if (K.userinfo !== void 0 || K.host !== void 0 || K.port !== void 0) Y.userinfo = K.userinfo, Y.host = K.host, Y.port = K.port, Y.path = ag6(K.path || ""), Y.query = K.query;
            else {
                if (!K.path)
                    if (Y.path = q.path, K.query !== void 0) Y.query = K.query;
                    else Y.query = q.query;
                else {
                    if (K.path.charAt(0) === "/") Y.path = ag6(K.path);
                    else {
                        if ((q.userinfo !== void 0 || q.host !== void 0 || q.port !== void 0) && !q.path) Y.path = "/" + K.path;
                        else if (!q.path) Y.path = K.path;
                        else Y.path = q.path.slice(0, q.path.lastIndexOf("/") + 1) + K.path;
                        Y.path = ag6(Y.path)
                    }
                    Y.query = K.query
                }
                Y.userinfo = q.userinfo, Y.host = q.host, Y.port = q.port
            }
            Y.scheme = q.scheme
        }
        return Y.fragment = K.fragment, Y
    }

    function iC5(q, K, _) {
        if (typeof q === "string") q = unescape(q), q = OU(Wj8(Mr(q, _), !0), {
            ..._,
            skipEscape: !0
        });
        else if (typeof q === "object") q = OU(Wj8(q, !0), {
            ..._,
            skipEscape: !0
        });
        if (typeof K === "string") K = unescape(K), K = OU(Wj8(Mr(K, _), !0), {
            ..._,
            skipEscape: !0
        });
        else if (typeof K === "object") K = OU(Wj8(K, !0), {
            ..._,
            skipEscape: !0
        });
        return q.toLowerCase() === K.toLowerCase()
    }

    function OU(q, K) {
        let _ = {
                host: q.host,
                scheme: q.scheme,
                userinfo: q.userinfo,
                port: q.port,
                path: q.path,
                query: q.query,
                nid: q.nid,
                nss: q.nss,
                uuid: q.uuid,
                fragment: q.fragment,
                reference: q.reference,
                resourceName: q.resourceName,
                secure: q.secure,
                error: ""
            },
            z = Object.assign({}, K),
            Y = [],
            A = e91[(z.scheme || _.scheme || "").toLowerCase()];
        if (A && A.serialize) A.serialize(_, z);
        if (_.path !== void 0)
            if (!z.skipEscape) {
                if (_.path = escape(_.path), _.scheme !== void 0) _.path = _.path.split("%3A").join(":")
            } else _.path = unescape(_.path);
        if (z.reference !== "suffix" && _.scheme) Y.push(_.scheme, ":");
        let O = cC5(_);
        if (O !== void 0) {
            if (z.reference !== "suffix") Y.push("//");
            if (Y.push(O), _.path && _.path.charAt(0) !== "/") Y.push("/")
        }
        if (_.path !== void 0) {
            let w = _.path;
            if (!z.absolutePath && (!A || !A.absolutePath)) w = ag6(w);
            if (O === void 0) w = w.replace(/^\/\//u, "/%2F");
            Y.push(w)
        }
        if (_.query !== void 0) Y.push("?", _.query);
        if (_.fragment !== void 0) Y.push("#", _.fragment);
        return Y.join("")
    }
    var rC5 = Array.from({
        length: 127
    }, (q, K) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(K)));

    function oC5(q) {
        let K = 0;
        for (let _ = 0, z = q.length; _ < z; ++_)
            if (K = q.charCodeAt(_), K > 126 || rC5[K]) return !0;
        return !1
    }
    var aC5 = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;

    function Mr(q, K) {
        let _ = Object.assign({}, K),
            z = {
                scheme: void 0,
                userinfo: void 0,
                host: "",
                port: void 0,
                path: "",
                query: void 0,
                fragment: void 0
            },
            Y = q.indexOf("%") !== -1,
            A = !1;
        if (_.reference === "suffix") q = (_.scheme ? _.scheme + ":" : "") + "//" + q;
        let O = q.match(aC5);
        if (O) {
            if (z.scheme = O[1], z.userinfo = O[3], z.host = O[4], z.port = parseInt(O[5], 10), z.path = O[6] || "", z.query = O[7], z.fragment = O[8], isNaN(z.port)) z.port = O[5];
            if (z.host) {
                let $ = dC5(z.host);
                if ($.isIPV4 === !1) {
                    let j = QC5($.host);
                    z.host = j.host.toLowerCase(), A = j.isIPV6
                } else z.host = $.host, A = !0
            }
            if (z.scheme === void 0 && z.userinfo === void 0 && z.host === void 0 && z.port === void 0 && z.query === void 0 && !z.path) z.reference = "same-document";
            else if (z.scheme === void 0) z.reference = "relative";
            else if (z.fragment === void 0) z.reference = "absolute";
            else z.reference = "uri";
            if (_.reference && _.reference !== "suffix" && _.reference !== z.reference) z.error = z.error || "URI is not a " + _.reference + " reference.";
            let w = e91[(_.scheme || z.scheme || "").toLowerCase()];
            if (!_.unicodeSupport && (!w || !w.unicodeSupport)) {
                if (z.host && (_.domainHost || w && w.domainHost) && A === !1 && oC5(z.host)) try {
                    z.host = URL.domainToASCII(z.host.toLowerCase())
                } catch ($) {
                    z.error = z.error || "Host's domain name can not be converted to ASCII: " + $
                }
            }
            if (!w || w && !w.skipNormalize) {
                if (Y && z.scheme !== void 0) z.scheme = unescape(z.scheme);
                if (Y && z.host !== void 0) z.host = unescape(z.host);
                if (z.path) z.path = escape(unescape(z.path));
                if (z.fragment) z.fragment = encodeURI(decodeURIComponent(z.fragment))
            }
            if (w && w.parse) w.parse(z, _)
        } else z.error = z.error || "URI can not be parsed.";
        return z
    }
    var q_1 = {
        SCHEMES: e91,
        normalize: lC5,
        resolve: nC5,
        resolveComponents: uL7,
        equal: iC5,
        serialize: OU,
        parse: Mr
    };
    Dj8.exports = q_1;
    Dj8.exports.default = q_1;
    Dj8.exports.fastUri = q_1
})
// @from(Ln 31047, Col 4)
FL7 = p((pL7) => {
    Object.defineProperty(pL7, "__esModule", {
        value: !0
    });
    var BL7 = mL7();
    BL7.code = 'require("ajv/dist/runtime/uri").default';
    pL7.default = BL7
})
// @from(Ln 31055, Col 4)
iL7 = p((Pr) => {
    Object.defineProperty(Pr, "__esModule", {
        value: !0
    });
    Pr.CodeGen = Pr.Name = Pr.nil = Pr.stringify = Pr.str = Pr._ = Pr.KeywordCxt = void 0;
    var tC5 = ig6();
    Object.defineProperty(Pr, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return tC5.KeywordCxt
        }
    });
    var lZ6 = B_();
    Object.defineProperty(Pr, "_", {
        enumerable: !0,
        get: function() {
            return lZ6._
        }
    });
    Object.defineProperty(Pr, "str", {
        enumerable: !0,
        get: function() {
            return lZ6.str
        }
    });
    Object.defineProperty(Pr, "stringify", {
        enumerable: !0,
        get: function() {
            return lZ6.stringify
        }
    });
    Object.defineProperty(Pr, "nil", {
        enumerable: !0,
        get: function() {
            return lZ6.nil
        }
    });
    Object.defineProperty(Pr, "Name", {
        enumerable: !0,
        get: function() {
            return lZ6.Name
        }
    });
    Object.defineProperty(Pr, "CodeGen", {
        enumerable: !0,
        get: function() {
            return lZ6.CodeGen
        }
    });
    var eC5 = Jj8(),
        cL7 = rg6(),
        qb5 = x91(),
        sg6 = Mj8(),
        Kb5 = B_(),
        tg6 = cg6(),
        Zj8 = dg6(),
        __1 = nY(),
        gL7 = fL7(),
        _b5 = FL7(),
        lL7 = (q, K) => new RegExp(q, K);
    lL7.code = "new RegExp";
    var zb5 = ["removeAdditional", "useDefaults", "coerceTypes"],
        Yb5 = new Set(["validate", "serialize", "parse", "wrapper", "root", "schema", "keyword", "pattern", "formats", "validate$data", "func", "obj", "Error"]),
        Ab5 = {
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
        Ob5 = {
            ignoreKeywordsWithRef: "",
            jsPropertySyntax: "",
            unicode: '"minLength"/"maxLength" account for unicode characters by default.'
        },
        UL7 = 200;

    function wb5(q) {
        var K, _, z, Y, A, O, w, $, j, H, J, X, M, P, W, D, Z, G, f, v, V, k, N, R, h;
        let C = q.strict,
            x = (K = q.code) === null || K === void 0 ? void 0 : K.optimize,
            B = x === !0 || x === void 0 ? 1 : x || 0,
            m = (z = (_ = q.code) === null || _ === void 0 ? void 0 : _.regExp) !== null && z !== void 0 ? z : lL7,
            S = (Y = q.uriResolver) !== null && Y !== void 0 ? Y : _b5.default;
        return {
            strictSchema: (O = (A = q.strictSchema) !== null && A !== void 0 ? A : C) !== null && O !== void 0 ? O : !0,
            strictNumbers: ($ = (w = q.strictNumbers) !== null && w !== void 0 ? w : C) !== null && $ !== void 0 ? $ : !0,
            strictTypes: (H = (j = q.strictTypes) !== null && j !== void 0 ? j : C) !== null && H !== void 0 ? H : "log",
            strictTuples: (X = (J = q.strictTuples) !== null && J !== void 0 ? J : C) !== null && X !== void 0 ? X : "log",
            strictRequired: (P = (M = q.strictRequired) !== null && M !== void 0 ? M : C) !== null && P !== void 0 ? P : !1,
            code: q.code ? {
                ...q.code,
                optimize: B,
                regExp: m
            } : {
                optimize: B,
                regExp: m
            },
            loopRequired: (W = q.loopRequired) !== null && W !== void 0 ? W : UL7,
            loopEnum: (D = q.loopEnum) !== null && D !== void 0 ? D : UL7,
            meta: (Z = q.meta) !== null && Z !== void 0 ? Z : !0,
            messages: (G = q.messages) !== null && G !== void 0 ? G : !0,
            inlineRefs: (f = q.inlineRefs) !== null && f !== void 0 ? f : !0,
            schemaId: (v = q.schemaId) !== null && v !== void 0 ? v : "$id",
            addUsedSchema: (V = q.addUsedSchema) !== null && V !== void 0 ? V : !0,
            validateSchema: (k = q.validateSchema) !== null && k !== void 0 ? k : !0,
            validateFormats: (N = q.validateFormats) !== null && N !== void 0 ? N : !0,
            unicodeRegExp: (R = q.unicodeRegExp) !== null && R !== void 0 ? R : !0,
            int32range: (h = q.int32range) !== null && h !== void 0 ? h : !0,
            uriResolver: S
        }
    }
    class fj8 {
        constructor(q = {}) {
            this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = new Set, this._loading = {}, this._cache = new Map, q = this.opts = {
                ...q,
                ...wb5(q)
            };
            let {
                es5: K,
                lines: _
            } = this.opts.code;
            this.scope = new Kb5.ValueScope({
                scope: {},
                prefixes: Yb5,
                es5: K,
                lines: _
            }), this.logger = Mb5(q.logger);
            let z = q.validateFormats;
            if (q.validateFormats = !1, this.RULES = (0, qb5.getRules)(), QL7.call(this, Ab5, q, "NOT SUPPORTED"), QL7.call(this, Ob5, q, "DEPRECATED", "warn"), this._metaOpts = Jb5.call(this), q.formats) jb5.call(this);
            if (this._addVocabularies(), this._addDefaultMetaSchema(), q.keywords) Hb5.call(this, q.keywords);
            if (typeof q.meta == "object") this.addMetaSchema(q.meta);
            $b5.call(this), q.validateFormats = z
        }
        _addVocabularies() {
            this.addKeyword("$async")
        }
        _addDefaultMetaSchema() {
            let {
                $data: q,
                meta: K,
                schemaId: _
            } = this.opts, z = gL7;
            if (_ === "id") z = {
                ...gL7
            }, z.id = z.$id, delete z.$id;
            if (K && q) this.addMetaSchema(z, z[_], !1)
        }
        defaultMeta() {
            let {
                meta: q,
                schemaId: K
            } = this.opts;
            return this.opts.defaultMeta = typeof q == "object" ? q[K] || q : void 0
        }
        validate(q, K) {
            let _;
            if (typeof q == "string") {
                if (_ = this.getSchema(q), !_) throw Error(`no schema with key or ref "${q}"`)
            } else _ = this.compile(q);
            let z = _(K);
            if (!("$async" in _)) this.errors = _.errors;
            return z
        }
        compile(q, K) {
            let _ = this._addSchema(q, K);
            return _.validate || this._compileSchemaEnv(_)
        }
        compileAsync(q, K) {
            if (typeof this.opts.loadSchema != "function") throw Error("options.loadSchema should be a function");
            let {
                loadSchema: _
            } = this.opts;
            return z.call(this, q, K);
            async function z(j, H) {
                await Y.call(this, j.$schema);
                let J = this._addSchema(j, H);
                return J.validate || A.call(this, J)
            }
            async function Y(j) {
                if (j && !this.getSchema(j)) await z.call(this, {
                    $ref: j
                }, !0)
            }
            async function A(j) {
                try {
                    return this._compileSchemaEnv(j)
                } catch (H) {
                    if (!(H instanceof cL7.default)) throw H;
                    return O.call(this, H), await w.call(this, H.missingSchema), A.call(this, j)
                }
            }

            function O({
                missingSchema: j,
                missingRef: H
            }) {
                if (this.refs[j]) throw Error(`AnySchema ${j} is loaded but ${H} cannot be resolved`)
            }
            async function w(j) {
                let H = await $.call(this, j);
                if (!this.refs[j]) await Y.call(this, H.$schema);
                if (!this.refs[j]) this.addSchema(H, j, K)
            }
            async function $(j) {
                let H = this._loading[j];
                if (H) return H;
                try {
                    return await (this._loading[j] = _(j))
                } finally {
                    delete this._loading[j]
                }
            }
        }
        addSchema(q, K, _, z = this.opts.validateSchema) {
            if (Array.isArray(q)) {
                for (let A of q) this.addSchema(A, void 0, _, z);
                return this
            }
            let Y;
            if (typeof q === "object") {
                let {
                    schemaId: A
                } = this.opts;
                if (Y = q[A], Y !== void 0 && typeof Y != "string") throw Error(`schema ${A} must be string`)
            }
            return K = (0, tg6.normalizeId)(K || Y), this._checkUnique(K), this.schemas[K] = this._addSchema(q, _, K, z, !0), this
        }
        addMetaSchema(q, K, _ = this.opts.validateSchema) {
            return this.addSchema(q, K, !0, _), this
        }
        validateSchema(q, K) {
            if (typeof q == "boolean") return !0;
            let _;
            if (_ = q.$schema, _ !== void 0 && typeof _ != "string") throw Error("$schema must be a string");
            if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_) return this.logger.warn("meta-schema not available"), this.errors = null, !0;
            let z = this.validate(_, q);
            if (!z && K) {
                let Y = "schema is invalid: " + this.errorsText();
                if (this.opts.validateSchema === "log") this.logger.error(Y);
                else throw Error(Y)
            }
            return z
        }
        getSchema(q) {
            let K;
            while (typeof(K = dL7.call(this, q)) == "string") q = K;
            if (K === void 0) {
                let {
                    schemaId: _
                } = this.opts, z = new sg6.SchemaEnv({
                    schema: {},
                    schemaId: _
                });
                if (K = sg6.resolveSchema.call(this, z, q), !K) return;
                this.refs[q] = K
            }
            return K.validate || this._compileSchemaEnv(K)
        }
        removeSchema(q) {
            if (q instanceof RegExp) return this._removeAllSchemas(this.schemas, q), this._removeAllSchemas(this.refs, q), this;
            switch (typeof q) {
                case "undefined":
                    return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
                case "string": {
                    let K = dL7.call(this, q);
                    if (typeof K == "object") this._cache.delete(K.schema);
                    return delete this.schemas[q], delete this.refs[q], this
                }
                case "object": {
                    let K = q;
                    this._cache.delete(K);
                    let _ = q[this.opts.schemaId];
                    if (_) _ = (0, tg6.normalizeId)(_), delete this.schemas[_], delete this.refs[_];
                    return this
                }
                default:
                    throw Error("ajv.removeSchema: invalid parameter")
            }
        }
        addVocabulary(q) {
            for (let K of q) this.addKeyword(K);
            return this
        }
        addKeyword(q, K) {
            let _;
            if (typeof q == "string") {
                if (_ = q, typeof K == "object") this.logger.warn("these parameters are deprecated, see docs for addKeyword"), K.keyword = _
            } else if (typeof q == "object" && K === void 0) {
                if (K = q, _ = K.keyword, Array.isArray(_) && !_.length) throw Error("addKeywords: keyword must be string or non-empty array")
            } else throw Error("invalid addKeywords parameters");
            if (Wb5.call(this, _, K), !K) return (0, __1.eachItem)(_, (Y) => K_1.call(this, Y)), this;
            Zb5.call(this, K);
            let z = {
                ...K,
                type: (0, Zj8.getJSONTypes)(K.type),
                schemaType: (0, Zj8.getJSONTypes)(K.schemaType)
            };
            return (0, __1.eachItem)(_, z.type.length === 0 ? (Y) => K_1.call(this, Y, z) : (Y) => z.type.forEach((A) => K_1.call(this, Y, z, A))), this
        }
        getKeyword(q) {
            let K = this.RULES.all[q];
            return typeof K == "object" ? K.definition : !!K
        }
        removeKeyword(q) {
            let {
                RULES: K
            } = this;
            delete K.keywords[q], delete K.all[q];
            for (let _ of K.rules) {
                let z = _.rules.findIndex((Y) => Y.keyword === q);
                if (z >= 0) _.rules.splice(z, 1)
            }
            return this
        }
        addFormat(q, K) {
            if (typeof K == "string") K = new RegExp(K);
            return this.formats[q] = K, this
        }
        errorsText(q = this.errors, {
            separator: K = ", ",
            dataVar: _ = "data"
        } = {}) {
            if (!q || q.length === 0) return "No errors";
            return q.map((z) => `${_}${z.instancePath} ${z.message}`).reduce((z, Y) => z + K + Y)
        }
        $dataMetaSchema(q, K) {
            let _ = this.RULES.all;
            q = JSON.parse(JSON.stringify(q));
            for (let z of K) {
                let Y = z.split("/").slice(1),
                    A = q;
                for (let O of Y) A = A[O];
                for (let O in _) {
                    let w = _[O];
                    if (typeof w != "object") continue;
                    let {
                        $data: $
                    } = w.definition, j = A[O];
                    if ($ && j) A[O] = nL7(j)
                }
            }
            return q
        }
        _removeAllSchemas(q, K) {
            for (let _ in q) {
                let z = q[_];
                if (!K || K.test(_)) {
                    if (typeof z == "string") delete q[_];
                    else if (z && !z.meta) this._cache.delete(z.schema), delete q[_]
                }
            }
        }
        _addSchema(q, K, _, z = this.opts.validateSchema, Y = this.opts.addUsedSchema) {
            let A, {
                schemaId: O
            } = this.opts;
            if (typeof q == "object") A = q[O];
            else if (this.opts.jtd) throw Error("schema must be object");
            else if (typeof q != "boolean") throw Error("schema must be object or boolean");
            let w = this._cache.get(q);
            if (w !== void 0) return w;
            _ = (0, tg6.normalizeId)(A || _);
            let $ = tg6.getSchemaRefs.call(this, q, _);
            if (w = new sg6.SchemaEnv({
                    schema: q,
                    schemaId: O,
                    meta: K,
                    baseId: _,
                    localRefs: $
                }), this._cache.set(w.schema, w), Y && !_.startsWith("#")) {
                if (_) this._checkUnique(_);
                this.refs[_] = w
            }
            if (z) this.validateSchema(q, !0);
            return w
        }
        _checkUnique(q) {
            if (this.schemas[q] || this.refs[q]) throw Error(`schema with key or id "${q}" already exists`)
        }
        _compileSchemaEnv(q) {
            if (q.meta) this._compileMetaSchema(q);
            else sg6.compileSchema.call(this, q);
            if (!q.validate) throw Error("ajv implementation error");
            return q.validate
        }
        _compileMetaSchema(q) {
            let K = this.opts;
            this.opts = this._metaOpts;
            try {
                sg6.compileSchema.call(this, q)
            } finally {
                this.opts = K
            }
        }
    }
    fj8.ValidationError = eC5.default;
    fj8.MissingRefError = cL7.default;
    Pr.default = fj8;

    function QL7(q, K, _, z = "error") {
        for (let Y in q) {
            let A = Y;
            if (A in K) this.logger[z](`${_}: option ${Y}. ${q[A]}`)
        }
    }

    function dL7(q) {
        return q = (0, tg6.normalizeId)(q), this.schemas[q] || this.refs[q]
    }

    function $b5() {
        let q = this.opts.schemas;
        if (!q) return;
        if (Array.isArray(q)) this.addSchema(q);
        else
            for (let K in q) this.addSchema(q[K], K)
    }

    function jb5() {
        for (let q in this.opts.formats) {
            let K = this.opts.formats[q];
            if (K) this.addFormat(q, K)
        }
    }

    function Hb5(q) {
        if (Array.isArray(q)) {
            this.addVocabulary(q);
            return
        }
        this.logger.warn("keywords option as map is deprecated, pass array");
        for (let K in q) {
            let _ = q[K];
            if (!_.keyword) _.keyword = K;
            this.addKeyword(_)
        }
    }

    function Jb5() {
        let q = {
            ...this.opts
        };
        for (let K of zb5) delete q[K];
        return q
    }
    var Xb5 = {
        log() {},
        warn() {},
        error() {}
    };

    function Mb5(q) {
        if (q === !1) return Xb5;
        if (q === void 0) return console;
        if (q.log && q.warn && q.error) return q;
        throw Error("logger must implement log, warn and error methods")
    }
    var Pb5 = /^[a-z_$][a-z0-9_$:-]*$/i;

    function Wb5(q, K) {
        let {
            RULES: _
        } = this;
        if ((0, __1.eachItem)(q, (z) => {
                if (_.keywords[z]) throw Error(`Keyword ${z} is already defined`);
                if (!Pb5.test(z)) throw Error(`Keyword ${z} has invalid name`)
            }), !K) return;
        if (K.$data && !(("code" in K) || ("validate" in K))) throw Error('$data keyword must have "code" or "validate" function')
    }

    function K_1(q, K, _) {
        var z;
        let Y = K === null || K === void 0 ? void 0 : K.post;
        if (_ && Y) throw Error('keyword with "post" flag cannot have "type"');
        let {
            RULES: A
        } = this, O = Y ? A.post : A.rules.find(({
            type: $
        }) => $ === _);
        if (!O) O = {
            type: _,
            rules: []
        }, A.rules.push(O);
        if (A.keywords[q] = !0, !K) return;
        let w = {
            keyword: q,
            definition: {
                ...K,
                type: (0, Zj8.getJSONTypes)(K.type),
                schemaType: (0, Zj8.getJSONTypes)(K.schemaType)
            }
        };
        if (K.before) Db5.call(this, O, w, K.before);
        else O.rules.push(w);
        A.all[q] = w, (z = K.implements) === null || z === void 0 || z.forEach(($) => this.addKeyword($))
    }

    function Db5(q, K, _) {
        let z = q.rules.findIndex((Y) => Y.keyword === _);
        if (z >= 0) q.rules.splice(z, 0, K);
        else q.rules.push(K), this.logger.warn(`rule ${_} is not defined`)
    }

    function Zb5(q) {
        let {
            metaSchema: K
        } = q;
        if (K === void 0) return;
        if (q.$data && this.opts.$data) K = nL7(K);
        q.validateSchema = this.compile(K, !0)
    }
    var fb5 = {
        $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };

    function nL7(q) {
        return {
            anyOf: [q, fb5]
        }
    }
})
// @from(Ln 31587, Col 4)
oL7 = p((rL7) => {
    Object.defineProperty(rL7, "__esModule", {
        value: !0
    });
    var Tb5 = {
        keyword: "id",
        code() {
            throw Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')
        }
    };
    rL7.default = Tb5
})
// @from(Ln 31599, Col 4)
Kh7 = p((eL7) => {
    Object.defineProperty(eL7, "__esModule", {
        value: !0
    });
    eL7.callRef = eL7.getValidate = void 0;
    var kb5 = rg6(),
        aL7 = pC(),
        QN = B_(),
        nZ6 = Jr(),
        sL7 = Mj8(),
        Gj8 = nY(),
        Nb5 = {
            keyword: "$ref",
            schemaType: "string",
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    it: z
                } = q, {
                    baseId: Y,
                    schemaEnv: A,
                    validateName: O,
                    opts: w,
                    self: $
                } = z, {
                    root: j
                } = A;
                if ((_ === "#" || _ === "#/") && Y === j.baseId) return J();
                let H = sL7.resolveRef.call($, j, Y, _);
                if (H === void 0) throw new kb5.default(z.opts.uriResolver, Y, _);
                if (H instanceof sL7.SchemaEnv) return X(H);
                return M(H);

                function J() {
                    if (A === j) return vj8(q, O, A, A.$async);
                    let P = K.scopeValue("root", {
                        ref: j
                    });
                    return vj8(q, QN._`${P}.validate`, j, j.$async)
                }

                function X(P) {
                    let W = tL7(q, P);
                    vj8(q, W, P, P.$async)
                }

                function M(P) {
                    let W = K.scopeValue("schema", w.code.source === !0 ? {
                            ref: P,
                            code: (0, QN.stringify)(P)
                        } : {
                            ref: P
                        }),
                        D = K.name("valid"),
                        Z = q.subschema({
                            schema: P,
                            dataTypes: [],
                            schemaPath: QN.nil,
                            topSchemaRef: W,
                            errSchemaPath: _
                        }, D);
                    q.mergeEvaluated(Z), q.ok(D)
                }
            }
        };

    function tL7(q, K) {
        let {
            gen: _
        } = q;
        return K.validate ? _.scopeValue("validate", {
            ref: K.validate
        }) : QN._`${_.scopeValue("wrapper",{ref:K})}.validate`
    }
    eL7.getValidate = tL7;

    function vj8(q, K, _, z) {
        let {
            gen: Y,
            it: A
        } = q, {
            allErrors: O,
            schemaEnv: w,
            opts: $
        } = A, j = $.passContext ? nZ6.default.this : QN.nil;
        if (z) H();
        else J();

        function H() {
            if (!w.$async) throw Error("async schema referenced by sync schema");
            let P = Y.let("valid");
            Y.try(() => {
                if (Y.code(QN._`await ${(0,aL7.callValidateCode)(q,K,j)}`), M(K), !O) Y.assign(P, !0)
            }, (W) => {
                if (Y.if(QN._`!(${W} instanceof ${A.ValidationError})`, () => Y.throw(W)), X(W), !O) Y.assign(P, !1)
            }), q.ok(P)
        }

        function J() {
            q.result((0, aL7.callValidateCode)(q, K, j), () => M(K), () => X(K))
        }

        function X(P) {
            let W = QN._`${P}.errors`;
            Y.assign(nZ6.default.vErrors, QN._`${nZ6.default.vErrors} === null ? ${W} : ${nZ6.default.vErrors}.concat(${W})`), Y.assign(nZ6.default.errors, QN._`${nZ6.default.vErrors}.length`)
        }

        function M(P) {
            var W;
            if (!A.opts.unevaluated) return;
            let D = (W = _ === null || _ === void 0 ? void 0 : _.validate) === null || W === void 0 ? void 0 : W.evaluated;
            if (A.props !== !0)
                if (D && !D.dynamicProps) {
                    if (D.props !== void 0) A.props = Gj8.mergeEvaluated.props(Y, D.props, A.props)
                } else {
                    let Z = Y.var("props", QN._`${P}.evaluated.props`);
                    A.props = Gj8.mergeEvaluated.props(Y, Z, A.props, QN.Name)
                } if (A.items !== !0)
                if (D && !D.dynamicItems) {
                    if (D.items !== void 0) A.items = Gj8.mergeEvaluated.items(Y, D.items, A.items)
                } else {
                    let Z = Y.var("items", QN._`${P}.evaluated.items`);
                    A.items = Gj8.mergeEvaluated.items(Y, Z, A.items, QN.Name)
                }
        }
    }
    eL7.callRef = vj8;
    eL7.default = Nb5
})
// @from(Ln 31729, Col 4)
zh7 = p((_h7) => {
    Object.defineProperty(_h7, "__esModule", {
        value: !0
    });
    var Lb5 = oL7(),
        hb5 = Kh7(),
        Rb5 = ["$schema", "$id", "$defs", "$vocabulary", {
            keyword: "$comment"
        }, "definitions", Lb5.default, hb5.default];
    _h7.default = Rb5
})
// @from(Ln 31740, Col 4)
Ah7 = p((Yh7) => {
    Object.defineProperty(Yh7, "__esModule", {
        value: !0
    });
    var Tj8 = B_(),
        H16 = Tj8.operators,
        Vj8 = {
            maximum: {
                okStr: "<=",
                ok: H16.LTE,
                fail: H16.GT
            },
            minimum: {
                okStr: ">=",
                ok: H16.GTE,
                fail: H16.LT
            },
            exclusiveMaximum: {
                okStr: "<",
                ok: H16.LT,
                fail: H16.GTE
            },
            exclusiveMinimum: {
                okStr: ">",
                ok: H16.GT,
                fail: H16.LTE
            }
        },
        Cb5 = {
            message: ({
                keyword: q,
                schemaCode: K
            }) => Tj8.str`must be ${Vj8[q].okStr} ${K}`,
            params: ({
                keyword: q,
                schemaCode: K
            }) => Tj8._`{comparison: ${Vj8[q].okStr}, limit: ${K}}`
        },
        bb5 = {
            keyword: Object.keys(Vj8),
            type: "number",
            schemaType: "number",
            $data: !0,
            error: Cb5,
            code(q) {
                let {
                    keyword: K,
                    data: _,
                    schemaCode: z
                } = q;
                q.fail$data(Tj8._`${_} ${Vj8[K].fail} ${z} || isNaN(${_})`)
            }
        };
    Yh7.default = bb5
})
// @from(Ln 31795, Col 4)
wh7 = p((Oh7) => {
    Object.defineProperty(Oh7, "__esModule", {
        value: !0
    });
    var eg6 = B_(),
        xb5 = {
            message: ({
                schemaCode: q
            }) => eg6.str`must be multiple of ${q}`,
            params: ({
                schemaCode: q
            }) => eg6._`{multipleOf: ${q}}`
        },
        ub5 = {
            keyword: "multipleOf",
            type: "number",
            schemaType: "number",
            $data: !0,
            error: xb5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    schemaCode: z,
                    it: Y
                } = q, A = Y.opts.multipleOfPrecision, O = K.let("res"), w = A ? eg6._`Math.abs(Math.round(${O}) - ${O}) > 1e-${A}` : eg6._`${O} !== parseInt(${O})`;
                q.fail$data(eg6._`(${z} === 0 || (${O} = ${_}/${z}, ${w}))`)
            }
        };
    Oh7.default = ub5
})
// @from(Ln 31826, Col 4)
Hh7 = p((jh7) => {
    Object.defineProperty(jh7, "__esModule", {
        value: !0
    });

    function $h7(q) {
        let K = q.length,
            _ = 0,
            z = 0,
            Y;
        while (z < K)
            if (_++, Y = q.charCodeAt(z++), Y >= 55296 && Y <= 56319 && z < K) {
                if (Y = q.charCodeAt(z), (Y & 64512) === 56320) z++
            } return _
    }
    jh7.default = $h7;
    $h7.code = 'require("ajv/dist/runtime/ucs2length").default'
})
// @from(Ln 31844, Col 4)
Xh7 = p((Jh7) => {
    Object.defineProperty(Jh7, "__esModule", {
        value: !0
    });
    var KA6 = B_(),
        pb5 = nY(),
        Fb5 = Hh7(),
        gb5 = {
            message({
                keyword: q,
                schemaCode: K
            }) {
                let _ = q === "maxLength" ? "more" : "fewer";
                return KA6.str`must NOT have ${_} than ${K} characters`
            },
            params: ({
                schemaCode: q
            }) => KA6._`{limit: ${q}}`
        },
        Ub5 = {
            keyword: ["maxLength", "minLength"],
            type: "string",
            schemaType: "number",
            $data: !0,
            error: gb5,
            code(q) {
                let {
                    keyword: K,
                    data: _,
                    schemaCode: z,
                    it: Y
                } = q, A = K === "maxLength" ? KA6.operators.GT : KA6.operators.LT, O = Y.opts.unicode === !1 ? KA6._`${_}.length` : KA6._`${(0,pb5.useFunc)(q.gen,Fb5.default)}(${_})`;
                q.fail$data(KA6._`${O} ${A} ${z}`)
            }
        };
    Jh7.default = Ub5
})
// @from(Ln 31881, Col 4)
Ph7 = p((Mh7) => {
    Object.defineProperty(Mh7, "__esModule", {
        value: !0
    });
    var db5 = pC(),
        cb5 = nY(),
        iZ6 = B_(),
        lb5 = {
            message: ({
                schemaCode: q
            }) => iZ6.str`must match pattern "${q}"`,
            params: ({
                schemaCode: q
            }) => iZ6._`{pattern: ${q}}`
        },
        nb5 = {
            keyword: "pattern",
            type: "string",
            schemaType: "string",
            $data: !0,
            error: lb5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    $data: z,
                    schema: Y,
                    schemaCode: A,
                    it: O
                } = q, w = O.opts.unicodeRegExp ? "u" : "";
                if (z) {
                    let {
                        regExp: $
                    } = O.opts.code, j = $.code === "new RegExp" ? iZ6._`new RegExp` : (0, cb5.useFunc)(K, $), H = K.let("valid");
                    K.try(() => K.assign(H, iZ6._`${j}(${A}, ${w}).test(${_})`), () => K.assign(H, !1)), q.fail$data(iZ6._`!${H}`)
                } else {
                    let $ = (0, db5.usePattern)(q, Y);
                    q.fail$data(iZ6._`!${$}.test(${_})`)
                }
            }
        };
    Mh7.default = nb5
})
// @from(Ln 31924, Col 4)
Dh7 = p((Wh7) => {
    Object.defineProperty(Wh7, "__esModule", {
        value: !0
    });
    var qU6 = B_(),
        rb5 = {
            message({
                keyword: q,
                schemaCode: K
            }) {
                let _ = q === "maxProperties" ? "more" : "fewer";
                return qU6.str`must NOT have ${_} than ${K} properties`
            },
            params: ({
                schemaCode: q
            }) => qU6._`{limit: ${q}}`
        },
        ob5 = {
            keyword: ["maxProperties", "minProperties"],
            type: "object",
            schemaType: "number",
            $data: !0,
            error: rb5,
            code(q) {
                let {
                    keyword: K,
                    data: _,
                    schemaCode: z
                } = q, Y = K === "maxProperties" ? qU6.operators.GT : qU6.operators.LT;
                q.fail$data(qU6._`Object.keys(${_}).length ${Y} ${z}`)
            }
        };
    Wh7.default = ob5
})
// @from(Ln 31958, Col 4)
fh7 = p((Zh7) => {
    Object.defineProperty(Zh7, "__esModule", {
        value: !0
    });
    var KU6 = pC(),
        _U6 = B_(),
        sb5 = nY(),
        tb5 = {
            message: ({
                params: {
                    missingProperty: q
                }
            }) => _U6.str`must have required property '${q}'`,
            params: ({
                params: {
                    missingProperty: q
                }
            }) => _U6._`{missingProperty: ${q}}`
        },
        eb5 = {
            keyword: "required",
            type: "object",
            schemaType: "array",
            $data: !0,
            error: tb5,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    schemaCode: z,
                    data: Y,
                    $data: A,
                    it: O
                } = q, {
                    opts: w
                } = O;
                if (!A && _.length === 0) return;
                let $ = _.length >= w.loopRequired;
                if (O.allErrors) j();
                else H();
                if (w.strictRequired) {
                    let M = q.parentSchema.properties,
                        {
                            definedProperties: P
                        } = q.it;
                    for (let W of _)
                        if ((M === null || M === void 0 ? void 0 : M[W]) === void 0 && !P.has(W)) {
                            let D = O.schemaEnv.baseId + O.errSchemaPath,
                                Z = `required property "${W}" is not defined at "${D}" (strictRequired)`;
                            (0, sb5.checkStrictMode)(O, Z, O.opts.strictRequired)
                        }
                }

                function j() {
                    if ($ || A) q.block$data(_U6.nil, J);
                    else
                        for (let M of _)(0, KU6.checkReportMissingProp)(q, M)
                }

                function H() {
                    let M = K.let("missing");
                    if ($ || A) {
                        let P = K.let("valid", !0);
                        q.block$data(P, () => X(M, P)), q.ok(P)
                    } else K.if((0, KU6.checkMissingProp)(q, _, M)), (0, KU6.reportMissingProp)(q, M), K.else()
                }

                function J() {
                    K.forOf("prop", z, (M) => {
                        q.setParams({
                            missingProperty: M
                        }), K.if((0, KU6.noPropertyInData)(K, Y, M, w.ownProperties), () => q.error())
                    })
                }

                function X(M, P) {
                    q.setParams({
                        missingProperty: M
                    }), K.forOf(M, z, () => {
                        K.assign(P, (0, KU6.propertyInData)(K, Y, M, w.ownProperties)), K.if((0, _U6.not)(P), () => {
                            q.error(), K.break()
                        })
                    }, _U6.nil)
                }
            }
        };
    Zh7.default = eb5
})
// @from(Ln 32046, Col 4)
vh7 = p((Gh7) => {
    Object.defineProperty(Gh7, "__esModule", {
        value: !0
    });
    var zU6 = B_(),
        KI5 = {
            message({
                keyword: q,
                schemaCode: K
            }) {
                let _ = q === "maxItems" ? "more" : "fewer";
                return zU6.str`must NOT have ${_} than ${K} items`
            },
            params: ({
                schemaCode: q
            }) => zU6._`{limit: ${q}}`
        },
        _I5 = {
            keyword: ["maxItems", "minItems"],
            type: "array",
            schemaType: "number",
            $data: !0,
            error: KI5,
            code(q) {
                let {
                    keyword: K,
                    data: _,
                    schemaCode: z
                } = q, Y = K === "maxItems" ? zU6.operators.GT : zU6.operators.LT;
                q.fail$data(zU6._`${_}.length ${Y} ${z}`)
            }
        };
    Gh7.default = _I5
})
// @from(Ln 32080, Col 4)
kj8 = p((Vh7) => {
    Object.defineProperty(Vh7, "__esModule", {
        value: !0
    });
    var Th7 = Q91();
    Th7.code = 'require("ajv/dist/runtime/equal").default';
    Vh7.default = Th7
})
// @from(Ln 32088, Col 4)
Nh7 = p((kh7) => {
    Object.defineProperty(kh7, "__esModule", {
        value: !0
    });
    var z_1 = dg6(),
        FZ = B_(),
        AI5 = nY(),
        OI5 = kj8(),
        wI5 = {
            message: ({
                params: {
                    i: q,
                    j: K
                }
            }) => FZ.str`must NOT have duplicate items (items ## ${K} and ${q} are identical)`,
            params: ({
                params: {
                    i: q,
                    j: K
                }
            }) => FZ._`{i: ${q}, j: ${K}}`
        },
        $I5 = {
            keyword: "uniqueItems",
            type: "array",
            schemaType: "boolean",
            $data: !0,
            error: wI5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    $data: z,
                    schema: Y,
                    parentSchema: A,
                    schemaCode: O,
                    it: w
                } = q;
                if (!z && !Y) return;
                let $ = K.let("valid"),
                    j = A.items ? (0, z_1.getSchemaTypes)(A.items) : [];
                q.block$data($, H, FZ._`${O} === false`), q.ok($);

                function H() {
                    let P = K.let("i", FZ._`${_}.length`),
                        W = K.let("j");
                    q.setParams({
                        i: P,
                        j: W
                    }), K.assign($, !0), K.if(FZ._`${P} > 1`, () => (J() ? X : M)(P, W))
                }

                function J() {
                    return j.length > 0 && !j.some((P) => P === "object" || P === "array")
                }

                function X(P, W) {
                    let D = K.name("item"),
                        Z = (0, z_1.checkDataTypes)(j, D, w.opts.strictNumbers, z_1.DataType.Wrong),
                        G = K.const("indices", FZ._`{}`);
                    K.for(FZ._`;${P}--;`, () => {
                        if (K.let(D, FZ._`${_}[${P}]`), K.if(Z, FZ._`continue`), j.length > 1) K.if(FZ._`typeof ${D} == "string"`, FZ._`${D} += "_"`);
                        K.if(FZ._`typeof ${G}[${D}] == "number"`, () => {
                            K.assign(W, FZ._`${G}[${D}]`), q.error(), K.assign($, !1).break()
                        }).code(FZ._`${G}[${D}] = ${P}`)
                    })
                }

                function M(P, W) {
                    let D = (0, AI5.useFunc)(K, OI5.default),
                        Z = K.name("outer");
                    K.label(Z).for(FZ._`;${P}--;`, () => K.for(FZ._`${W} = ${P}; ${W}--;`, () => K.if(FZ._`${D}(${_}[${P}], ${_}[${W}])`, () => {
                        q.error(), K.assign($, !1).break(Z)
                    })))
                }
            }
        };
    kh7.default = $I5
})
// @from(Ln 32167, Col 4)
yh7 = p((Eh7) => {
    Object.defineProperty(Eh7, "__esModule", {
        value: !0
    });
    var Y_1 = B_(),
        HI5 = nY(),
        JI5 = kj8(),
        XI5 = {
            message: "must be equal to constant",
            params: ({
                schemaCode: q
            }) => Y_1._`{allowedValue: ${q}}`
        },
        MI5 = {
            keyword: "const",
            $data: !0,
            error: XI5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    $data: z,
                    schemaCode: Y,
                    schema: A
                } = q;
                if (z || A && typeof A == "object") q.fail$data(Y_1._`!${(0,HI5.useFunc)(K,JI5.default)}(${_}, ${Y})`);
                else q.fail(Y_1._`${A} !== ${_}`)
            }
        };
    Eh7.default = MI5
})
// @from(Ln 32198, Col 4)
hh7 = p((Lh7) => {
    Object.defineProperty(Lh7, "__esModule", {
        value: !0
    });
    var YU6 = B_(),
        WI5 = nY(),
        DI5 = kj8(),
        ZI5 = {
            message: "must be equal to one of the allowed values",
            params: ({
                schemaCode: q
            }) => YU6._`{allowedValues: ${q}}`
        },
        fI5 = {
            keyword: "enum",
            schemaType: "array",
            $data: !0,
            error: ZI5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    $data: z,
                    schema: Y,
                    schemaCode: A,
                    it: O
                } = q;
                if (!z && Y.length === 0) throw Error("enum must have non-empty array");
                let w = Y.length >= O.opts.loopEnum,
                    $, j = () => $ !== null && $ !== void 0 ? $ : $ = (0, WI5.useFunc)(K, DI5.default),
                    H;
                if (w || z) H = K.let("valid"), q.block$data(H, J);
                else {
                    if (!Array.isArray(Y)) throw Error("ajv implementation error");
                    let M = K.const("vSchema", A);
                    H = (0, YU6.or)(...Y.map((P, W) => X(M, W)))
                }
                q.pass(H);

                function J() {
                    K.assign(H, !1), K.forOf("v", A, (M) => K.if(YU6._`${j()}(${_}, ${M})`, () => K.assign(H, !0).break()))
                }

                function X(M, P) {
                    let W = Y[P];
                    return typeof W === "object" && W !== null ? YU6._`${j()}(${_}, ${M}[${P}])` : YU6._`${_} === ${W}`
                }
            }
        };
    Lh7.default = fI5
})
// @from(Ln 32249, Col 4)
Sh7 = p((Rh7) => {
    Object.defineProperty(Rh7, "__esModule", {
        value: !0
    });
    var vI5 = Ah7(),
        TI5 = wh7(),
        VI5 = Xh7(),
        kI5 = Ph7(),
        NI5 = Dh7(),
        EI5 = fh7(),
        yI5 = vh7(),
        LI5 = Nh7(),
        hI5 = yh7(),
        RI5 = hh7(),
        SI5 = [vI5.default, TI5.default, VI5.default, kI5.default, NI5.default, EI5.default, yI5.default, LI5.default, {
            keyword: "type",
            schemaType: ["string", "array"]
        }, {
            keyword: "nullable",
            schemaType: "boolean"
        }, hI5.default, RI5.default];
    Rh7.default = SI5
})
// @from(Ln 32272, Col 4)
O_1 = p((bh7) => {
    Object.defineProperty(bh7, "__esModule", {
        value: !0
    });
    bh7.validateAdditionalItems = void 0;
    var _A6 = B_(),
        A_1 = nY(),
        bI5 = {
            message: ({
                params: {
                    len: q
                }
            }) => _A6.str`must NOT have more than ${q} items`,
            params: ({
                params: {
                    len: q
                }
            }) => _A6._`{limit: ${q}}`
        },
        II5 = {
            keyword: "additionalItems",
            type: "array",
            schemaType: ["boolean", "object"],
            before: "uniqueItems",
            error: bI5,
            code(q) {
                let {
                    parentSchema: K,
                    it: _
                } = q, {
                    items: z
                } = K;
                if (!Array.isArray(z)) {
                    (0, A_1.checkStrictMode)(_, '"additionalItems" is ignored when "items" is not an array of schemas');
                    return
                }
                Ch7(q, z)
            }
        };

    function Ch7(q, K) {
        let {
            gen: _,
            schema: z,
            data: Y,
            keyword: A,
            it: O
        } = q;
        O.items = !0;
        let w = _.const("len", _A6._`${Y}.length`);
        if (z === !1) q.setParams({
            len: K.length
        }), q.pass(_A6._`${w} <= ${K.length}`);
        else if (typeof z == "object" && !(0, A_1.alwaysValidSchema)(O, z)) {
            let j = _.var("valid", _A6._`${w} <= ${K.length}`);
            _.if((0, _A6.not)(j), () => $(j)), q.ok(j)
        }

        function $(j) {
            _.forRange("i", K.length, w, (H) => {
                if (q.subschema({
                        keyword: A,
                        dataProp: H,
                        dataPropType: A_1.Type.Num
                    }, j), !O.allErrors) _.if((0, _A6.not)(j), () => _.break())
            })
        }
    }
    bh7.validateAdditionalItems = Ch7;
    bh7.default = II5
})
// @from(Ln 32343, Col 4)
w_1 = p((mh7) => {
    Object.defineProperty(mh7, "__esModule", {
        value: !0
    });
    mh7.validateTuple = void 0;
    var xh7 = B_(),
        Nj8 = nY(),
        uI5 = pC(),
        mI5 = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "array", "boolean"],
            before: "uniqueItems",
            code(q) {
                let {
                    schema: K,
                    it: _
                } = q;
                if (Array.isArray(K)) return uh7(q, "additionalItems", K);
                if (_.items = !0, (0, Nj8.alwaysValidSchema)(_, K)) return;
                q.ok((0, uI5.validateArray)(q))
            }
        };

    function uh7(q, K, _ = q.schema) {
        let {
            gen: z,
            parentSchema: Y,
            data: A,
            keyword: O,
            it: w
        } = q;
        if (H(Y), w.opts.unevaluated && _.length && w.items !== !0) w.items = Nj8.mergeEvaluated.items(z, _.length, w.items);
        let $ = z.name("valid"),
            j = z.const("len", xh7._`${A}.length`);
        _.forEach((J, X) => {
            if ((0, Nj8.alwaysValidSchema)(w, J)) return;
            z.if(xh7._`${j} > ${X}`, () => q.subschema({
                keyword: O,
                schemaProp: X,
                dataProp: X
            }, $)), q.ok($)
        });

        function H(J) {
            let {
                opts: X,
                errSchemaPath: M
            } = w, P = _.length, W = P === J.minItems && (P === J.maxItems || J[K] === !1);
            if (X.strictTuples && !W) {
                let D = `"${O}" is ${P}-tuple, but minItems or maxItems/${K} are not specified or different at path "${M}"`;
                (0, Nj8.checkStrictMode)(w, D, X.strictTuples)
            }
        }
    }
    mh7.validateTuple = uh7;
    mh7.default = mI5
})
// @from(Ln 32401, Col 4)
Fh7 = p((ph7) => {
    Object.defineProperty(ph7, "__esModule", {
        value: !0
    });
    var pI5 = w_1(),
        FI5 = {
            keyword: "prefixItems",
            type: "array",
            schemaType: ["array"],
            before: "uniqueItems",
            code: (q) => (0, pI5.validateTuple)(q, "items")
        };
    ph7.default = FI5
})
// @from(Ln 32415, Col 4)
Qh7 = p((Uh7) => {
    Object.defineProperty(Uh7, "__esModule", {
        value: !0
    });
    var gh7 = B_(),
        UI5 = nY(),
        QI5 = pC(),
        dI5 = O_1(),
        cI5 = {
            message: ({
                params: {
                    len: q
                }
            }) => gh7.str`must NOT have more than ${q} items`,
            params: ({
                params: {
                    len: q
                }
            }) => gh7._`{limit: ${q}}`
        },
        lI5 = {
            keyword: "items",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            error: cI5,
            code(q) {
                let {
                    schema: K,
                    parentSchema: _,
                    it: z
                } = q, {
                    prefixItems: Y
                } = _;
                if (z.items = !0, (0, UI5.alwaysValidSchema)(z, K)) return;
                if (Y)(0, dI5.validateAdditionalItems)(q, Y);
                else q.ok((0, QI5.validateArray)(q))
            }
        };
    Uh7.default = lI5
})
// @from(Ln 32456, Col 4)
ch7 = p((dh7) => {
    Object.defineProperty(dh7, "__esModule", {
        value: !0
    });
    var FC = B_(),
        Ej8 = nY(),
        iI5 = {
            message: ({
                params: {
                    min: q,
                    max: K
                }
            }) => K === void 0 ? FC.str`must contain at least ${q} valid item(s)` : FC.str`must contain at least ${q} and no more than ${K} valid item(s)`,
            params: ({
                params: {
                    min: q,
                    max: K
                }
            }) => K === void 0 ? FC._`{minContains: ${q}}` : FC._`{minContains: ${q}, maxContains: ${K}}`
        },
        rI5 = {
            keyword: "contains",
            type: "array",
            schemaType: ["object", "boolean"],
            before: "uniqueItems",
            trackErrors: !0,
            error: iI5,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    parentSchema: z,
                    data: Y,
                    it: A
                } = q, O, w, {
                    minContains: $,
                    maxContains: j
                } = z;
                if (A.opts.next) O = $ === void 0 ? 1 : $, w = j;
                else O = 1;
                let H = K.const("len", FC._`${Y}.length`);
                if (q.setParams({
                        min: O,
                        max: w
                    }), w === void 0 && O === 0) {
                    (0, Ej8.checkStrictMode)(A, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
                    return
                }
                if (w !== void 0 && O > w) {
                    (0, Ej8.checkStrictMode)(A, '"minContains" > "maxContains" is always invalid'), q.fail();
                    return
                }
                if ((0, Ej8.alwaysValidSchema)(A, _)) {
                    let W = FC._`${H} >= ${O}`;
                    if (w !== void 0) W = FC._`${W} && ${H} <= ${w}`;
                    q.pass(W);
                    return
                }
                A.items = !0;
                let J = K.name("valid");
                if (w === void 0 && O === 1) M(J, () => K.if(J, () => K.break()));
                else if (O === 0) {
                    if (K.let(J, !0), w !== void 0) K.if(FC._`${Y}.length > 0`, X)
                } else K.let(J, !1), X();
                q.result(J, () => q.reset());

                function X() {
                    let W = K.name("_valid"),
                        D = K.let("count", 0);
                    M(W, () => K.if(W, () => P(D)))
                }

                function M(W, D) {
                    K.forRange("i", 0, H, (Z) => {
                        q.subschema({
                            keyword: "contains",
                            dataProp: Z,
                            dataPropType: Ej8.Type.Num,
                            compositeRule: !0
                        }, W), D()
                    })
                }

                function P(W) {
                    if (K.code(FC._`${W}++`), w === void 0) K.if(FC._`${W} >= ${O}`, () => K.assign(J, !0).break());
                    else if (K.if(FC._`${W} > ${w}`, () => K.assign(J, !1).break()), O === 1) K.assign(J, !0);
                    else K.if(FC._`${W} >= ${O}`, () => K.assign(J, !0))
                }
            }
        };
    dh7.default = rI5
})
// @from(Ln 32548, Col 4)
ah7 = p((ih7) => {
    Object.defineProperty(ih7, "__esModule", {
        value: !0
    });
    ih7.validateSchemaDeps = ih7.validatePropertyDeps = ih7.error = void 0;
    var $_1 = B_(),
        aI5 = nY(),
        AU6 = pC();
    ih7.error = {
        message: ({
            params: {
                property: q,
                depsCount: K,
                deps: _
            }
        }) => {
            let z = K === 1 ? "property" : "properties";
            return $_1.str`must have ${z} ${_} when property ${q} is present`
        },
        params: ({
            params: {
                property: q,
                depsCount: K,
                deps: _,
                missingProperty: z
            }
        }) => $_1._`{property: ${q},
    missingProperty: ${z},
    depsCount: ${K},
    deps: ${_}}`
    };
    var sI5 = {
        keyword: "dependencies",
        type: "object",
        schemaType: "object",
        error: ih7.error,
        code(q) {
            let [K, _] = tI5(q);
            lh7(q, K), nh7(q, _)
        }
    };

    function tI5({
        schema: q
    }) {
        let K = {},
            _ = {};
        for (let z in q) {
            if (z === "__proto__") continue;
            let Y = Array.isArray(q[z]) ? K : _;
            Y[z] = q[z]
        }
        return [K, _]
    }

    function lh7(q, K = q.schema) {
        let {
            gen: _,
            data: z,
            it: Y
        } = q;
        if (Object.keys(K).length === 0) return;
        let A = _.let("missing");
        for (let O in K) {
            let w = K[O];
            if (w.length === 0) continue;
            let $ = (0, AU6.propertyInData)(_, z, O, Y.opts.ownProperties);
            if (q.setParams({
                    property: O,
                    depsCount: w.length,
                    deps: w.join(", ")
                }), Y.allErrors) _.if($, () => {
                for (let j of w)(0, AU6.checkReportMissingProp)(q, j)
            });
            else _.if($_1._`${$} && (${(0,AU6.checkMissingProp)(q,w,A)})`), (0, AU6.reportMissingProp)(q, A), _.else()
        }
    }
    ih7.validatePropertyDeps = lh7;

    function nh7(q, K = q.schema) {
        let {
            gen: _,
            data: z,
            keyword: Y,
            it: A
        } = q, O = _.name("valid");
        for (let w in K) {
            if ((0, aI5.alwaysValidSchema)(A, K[w])) continue;
            _.if((0, AU6.propertyInData)(_, z, w, A.opts.ownProperties), () => {
                let $ = q.subschema({
                    keyword: Y,
                    schemaProp: w
                }, O);
                q.mergeValidEvaluated($, O)
            }, () => _.var(O, !0)), q.ok(O)
        }
    }
    ih7.validateSchemaDeps = nh7;
    ih7.default = sI5
})
// @from(Ln 32648, Col 4)
eh7 = p((th7) => {
    Object.defineProperty(th7, "__esModule", {
        value: !0
    });
    var sh7 = B_(),
        Kx5 = nY(),
        _x5 = {
            message: "property name must be valid",
            params: ({
                params: q
            }) => sh7._`{propertyName: ${q.propertyName}}`
        },
        zx5 = {
            keyword: "propertyNames",
            type: "object",
            schemaType: ["object", "boolean"],
            error: _x5,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    data: z,
                    it: Y
                } = q;
                if ((0, Kx5.alwaysValidSchema)(Y, _)) return;
                let A = K.name("valid");
                K.forIn("key", z, (O) => {
                    q.setParams({
                        propertyName: O
                    }), q.subschema({
                        keyword: "propertyNames",
                        data: O,
                        dataTypes: ["string"],
                        propertyName: O,
                        compositeRule: !0
                    }, A), K.if((0, sh7.not)(A), () => {
                        if (q.error(!0), !Y.allErrors) K.break()
                    })
                }), q.ok(A)
            }
        };
    th7.default = zx5
})
// @from(Ln 32691, Col 4)
j_1 = p((qR7) => {
    Object.defineProperty(qR7, "__esModule", {
        value: !0
    });
    var yj8 = pC(),
        Gm = B_(),
        Ax5 = Jr(),
        Lj8 = nY(),
        Ox5 = {
            message: "must NOT have additional properties",
            params: ({
                params: q
            }) => Gm._`{additionalProperty: ${q.additionalProperty}}`
        },
        wx5 = {
            keyword: "additionalProperties",
            type: ["object"],
            schemaType: ["boolean", "object"],
            allowUndefined: !0,
            trackErrors: !0,
            error: Ox5,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    parentSchema: z,
                    data: Y,
                    errsCount: A,
                    it: O
                } = q;
                if (!A) throw Error("ajv implementation error");
                let {
                    allErrors: w,
                    opts: $
                } = O;
                if (O.props = !0, $.removeAdditional !== "all" && (0, Lj8.alwaysValidSchema)(O, _)) return;
                let j = (0, yj8.allSchemaProperties)(z.properties),
                    H = (0, yj8.allSchemaProperties)(z.patternProperties);
                J(), q.ok(Gm._`${A} === ${Ax5.default.errors}`);

                function J() {
                    K.forIn("key", Y, (D) => {
                        if (!j.length && !H.length) P(D);
                        else K.if(X(D), () => P(D))
                    })
                }

                function X(D) {
                    let Z;
                    if (j.length > 8) {
                        let G = (0, Lj8.schemaRefOrVal)(O, z.properties, "properties");
                        Z = (0, yj8.isOwnProperty)(K, G, D)
                    } else if (j.length) Z = (0, Gm.or)(...j.map((G) => Gm._`${D} === ${G}`));
                    else Z = Gm.nil;
                    if (H.length) Z = (0, Gm.or)(Z, ...H.map((G) => Gm._`${(0,yj8.usePattern)(q,G)}.test(${D})`));
                    return (0, Gm.not)(Z)
                }

                function M(D) {
                    K.code(Gm._`delete ${Y}[${D}]`)
                }

                function P(D) {
                    if ($.removeAdditional === "all" || $.removeAdditional && _ === !1) {
                        M(D);
                        return
                    }
                    if (_ === !1) {
                        if (q.setParams({
                                additionalProperty: D
                            }), q.error(), !w) K.break();
                        return
                    }
                    if (typeof _ == "object" && !(0, Lj8.alwaysValidSchema)(O, _)) {
                        let Z = K.name("valid");
                        if ($.removeAdditional === "failing") W(D, Z, !1), K.if((0, Gm.not)(Z), () => {
                            q.reset(), M(D)
                        });
                        else if (W(D, Z), !w) K.if((0, Gm.not)(Z), () => K.break())
                    }
                }

                function W(D, Z, G) {
                    let f = {
                        keyword: "additionalProperties",
                        dataProp: D,
                        dataPropType: Lj8.Type.Str
                    };
                    if (G === !1) Object.assign(f, {
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    });
                    q.subschema(f, Z)
                }
            }
        };
    qR7.default = wx5
})
// @from(Ln 32790, Col 4)
YR7 = p((zR7) => {
    Object.defineProperty(zR7, "__esModule", {
        value: !0
    });
    var jx5 = ig6(),
        KR7 = pC(),
        H_1 = nY(),
        _R7 = j_1(),
        Hx5 = {
            keyword: "properties",
            type: "object",
            schemaType: "object",
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    parentSchema: z,
                    data: Y,
                    it: A
                } = q;
                if (A.opts.removeAdditional === "all" && z.additionalProperties === void 0) _R7.default.code(new jx5.KeywordCxt(A, _R7.default, "additionalProperties"));
                let O = (0, KR7.allSchemaProperties)(_);
                for (let J of O) A.definedProperties.add(J);
                if (A.opts.unevaluated && O.length && A.props !== !0) A.props = H_1.mergeEvaluated.props(K, (0, H_1.toHash)(O), A.props);
                let w = O.filter((J) => !(0, H_1.alwaysValidSchema)(A, _[J]));
                if (w.length === 0) return;
                let $ = K.name("valid");
                for (let J of w) {
                    if (j(J)) H(J);
                    else {
                        if (K.if((0, KR7.propertyInData)(K, Y, J, A.opts.ownProperties)), H(J), !A.allErrors) K.else().var($, !0);
                        K.endIf()
                    }
                    q.it.definedProperties.add(J), q.ok($)
                }

                function j(J) {
                    return A.opts.useDefaults && !A.compositeRule && _[J].default !== void 0
                }

                function H(J) {
                    q.subschema({
                        keyword: "properties",
                        schemaProp: J,
                        dataProp: J
                    }, $)
                }
            }
        };
    zR7.default = Hx5
})
// @from(Ln 32841, Col 4)
jR7 = p(($R7) => {
    Object.defineProperty($R7, "__esModule", {
        value: !0
    });
    var AR7 = pC(),
        hj8 = B_(),
        OR7 = nY(),
        wR7 = nY(),
        Xx5 = {
            keyword: "patternProperties",
            type: "object",
            schemaType: "object",
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    data: z,
                    parentSchema: Y,
                    it: A
                } = q, {
                    opts: O
                } = A, w = (0, AR7.allSchemaProperties)(_), $ = w.filter((W) => (0, OR7.alwaysValidSchema)(A, _[W]));
                if (w.length === 0 || $.length === w.length && (!A.opts.unevaluated || A.props === !0)) return;
                let j = O.strictSchema && !O.allowMatchingProperties && Y.properties,
                    H = K.name("valid");
                if (A.props !== !0 && !(A.props instanceof hj8.Name)) A.props = (0, wR7.evaluatedPropsToName)(K, A.props);
                let {
                    props: J
                } = A;
                X();

                function X() {
                    for (let W of w) {
                        if (j) M(W);
                        if (A.allErrors) P(W);
                        else K.var(H, !0), P(W), K.if(H)
                    }
                }

                function M(W) {
                    for (let D in j)
                        if (new RegExp(W).test(D))(0, OR7.checkStrictMode)(A, `property ${D} matches pattern ${W} (use allowMatchingProperties)`)
                }

                function P(W) {
                    K.forIn("key", z, (D) => {
                        K.if(hj8._`${(0,AR7.usePattern)(q,W)}.test(${D})`, () => {
                            let Z = $.includes(W);
                            if (!Z) q.subschema({
                                keyword: "patternProperties",
                                schemaProp: W,
                                dataProp: D,
                                dataPropType: wR7.Type.Str
                            }, H);
                            if (A.opts.unevaluated && J !== !0) K.assign(hj8._`${J}[${D}]`, !0);
                            else if (!Z && !A.allErrors) K.if((0, hj8.not)(H), () => K.break())
                        })
                    })
                }
            }
        };
    $R7.default = Xx5
})
// @from(Ln 32904, Col 4)
JR7 = p((HR7) => {
    Object.defineProperty(HR7, "__esModule", {
        value: !0
    });
    var Px5 = nY(),
        Wx5 = {
            keyword: "not",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    it: z
                } = q;
                if ((0, Px5.alwaysValidSchema)(z, _)) {
                    q.fail();
                    return
                }
                let Y = K.name("valid");
                q.subschema({
                    keyword: "not",
                    compositeRule: !0,
                    createErrors: !1,
                    allErrors: !1
                }, Y), q.failResult(Y, () => q.reset(), () => q.error())
            },
            error: {
                message: "must NOT be valid"
            }
        };
    HR7.default = Wx5
})
// @from(Ln 32937, Col 4)
MR7 = p((XR7) => {
    Object.defineProperty(XR7, "__esModule", {
        value: !0
    });
    var Zx5 = pC(),
        fx5 = {
            keyword: "anyOf",
            schemaType: "array",
            trackErrors: !0,
            code: Zx5.validateUnion,
            error: {
                message: "must match a schema in anyOf"
            }
        };
    XR7.default = fx5
})
// @from(Ln 32953, Col 4)
WR7 = p((PR7) => {
    Object.defineProperty(PR7, "__esModule", {
        value: !0
    });
    var Rj8 = B_(),
        vx5 = nY(),
        Tx5 = {
            message: "must match exactly one schema in oneOf",
            params: ({
                params: q
            }) => Rj8._`{passingSchemas: ${q.passing}}`
        },
        Vx5 = {
            keyword: "oneOf",
            schemaType: "array",
            trackErrors: !0,
            error: Tx5,
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    parentSchema: z,
                    it: Y
                } = q;
                if (!Array.isArray(_)) throw Error("ajv implementation error");
                if (Y.opts.discriminator && z.discriminator) return;
                let A = _,
                    O = K.let("valid", !1),
                    w = K.let("passing", null),
                    $ = K.name("_valid");
                q.setParams({
                    passing: w
                }), K.block(j), q.result(O, () => q.reset(), () => q.error(!0));

                function j() {
                    A.forEach((H, J) => {
                        let X;
                        if ((0, vx5.alwaysValidSchema)(Y, H)) K.var($, !0);
                        else X = q.subschema({
                            keyword: "oneOf",
                            schemaProp: J,
                            compositeRule: !0
                        }, $);
                        if (J > 0) K.if(Rj8._`${$} && ${O}`).assign(O, !1).assign(w, Rj8._`[${w}, ${J}]`).else();
                        K.if($, () => {
                            if (K.assign(O, !0), K.assign(w, J), X) q.mergeEvaluated(X, Rj8.Name)
                        })
                    })
                }
            }
        };
    PR7.default = Vx5
})
// @from(Ln 33006, Col 4)
ZR7 = p((DR7) => {
    Object.defineProperty(DR7, "__esModule", {
        value: !0
    });
    var Nx5 = nY(),
        Ex5 = {
            keyword: "allOf",
            schemaType: "array",
            code(q) {
                let {
                    gen: K,
                    schema: _,
                    it: z
                } = q;
                if (!Array.isArray(_)) throw Error("ajv implementation error");
                let Y = K.name("valid");
                _.forEach((A, O) => {
                    if ((0, Nx5.alwaysValidSchema)(z, A)) return;
                    let w = q.subschema({
                        keyword: "allOf",
                        schemaProp: O
                    }, Y);
                    q.ok(Y), q.mergeEvaluated(w)
                })
            }
        };
    DR7.default = Ex5
})
// @from(Ln 33034, Col 4)
TR7 = p((vR7) => {
    Object.defineProperty(vR7, "__esModule", {
        value: !0
    });
    var Sj8 = B_(),
        GR7 = nY(),
        Lx5 = {
            message: ({
                params: q
            }) => Sj8.str`must match "${q.ifClause}" schema`,
            params: ({
                params: q
            }) => Sj8._`{failingKeyword: ${q.ifClause}}`
        },
        hx5 = {
            keyword: "if",
            schemaType: ["object", "boolean"],
            trackErrors: !0,
            error: Lx5,
            code(q) {
                let {
                    gen: K,
                    parentSchema: _,
                    it: z
                } = q;
                if (_.then === void 0 && _.else === void 0)(0, GR7.checkStrictMode)(z, '"if" without "then" and "else" is ignored');
                let Y = fR7(z, "then"),
                    A = fR7(z, "else");
                if (!Y && !A) return;
                let O = K.let("valid", !0),
                    w = K.name("_valid");
                if ($(), q.reset(), Y && A) {
                    let H = K.let("ifClause");
                    q.setParams({
                        ifClause: H
                    }), K.if(w, j("then", H), j("else", H))
                } else if (Y) K.if(w, j("then"));
                else K.if((0, Sj8.not)(w), j("else"));
                q.pass(O, () => q.error(!0));

                function $() {
                    let H = q.subschema({
                        keyword: "if",
                        compositeRule: !0,
                        createErrors: !1,
                        allErrors: !1
                    }, w);
                    q.mergeEvaluated(H)
                }

                function j(H, J) {
                    return () => {
                        let X = q.subschema({
                            keyword: H
                        }, w);
                        if (K.assign(O, w), q.mergeValidEvaluated(X, O), J) K.assign(J, Sj8._`${H}`);
                        else q.setParams({
                            ifClause: H
                        })
                    }
                }
            }
        };

    function fR7(q, K) {
        let _ = q.schema[K];
        return _ !== void 0 && !(0, GR7.alwaysValidSchema)(q, _)
    }
    vR7.default = hx5
})
// @from(Ln 33104, Col 4)
kR7 = p((VR7) => {
    Object.defineProperty(VR7, "__esModule", {
        value: !0
    });
    var Sx5 = nY(),
        Cx5 = {
            keyword: ["then", "else"],
            schemaType: ["object", "boolean"],
            code({
                keyword: q,
                parentSchema: K,
                it: _
            }) {
                if (K.if === void 0)(0, Sx5.checkStrictMode)(_, `"${q}" without "if" is ignored`)
            }
        };
    VR7.default = Cx5
})
// @from(Ln 33122, Col 4)
ER7 = p((NR7) => {
    Object.defineProperty(NR7, "__esModule", {
        value: !0
    });
    var Ix5 = O_1(),
        xx5 = Fh7(),
        ux5 = w_1(),
        mx5 = Qh7(),
        Bx5 = ch7(),
        px5 = ah7(),
        Fx5 = eh7(),
        gx5 = j_1(),
        Ux5 = YR7(),
        Qx5 = jR7(),
        dx5 = JR7(),
        cx5 = MR7(),
        lx5 = WR7(),
        nx5 = ZR7(),
        ix5 = TR7(),
        rx5 = kR7();

    function ox5(q = !1) {
        let K = [dx5.default, cx5.default, lx5.default, nx5.default, ix5.default, rx5.default, Fx5.default, gx5.default, px5.default, Ux5.default, Qx5.default];
        if (q) K.push(xx5.default, mx5.default);
        else K.push(Ix5.default, ux5.default);
        return K.push(Bx5.default), K
    }
    NR7.default = ox5
})
// @from(Ln 33151, Col 4)
LR7 = p((yR7) => {
    Object.defineProperty(yR7, "__esModule", {
        value: !0
    });
    var iX = B_(),
        sx5 = {
            message: ({
                schemaCode: q
            }) => iX.str`must match format "${q}"`,
            params: ({
                schemaCode: q
            }) => iX._`{format: ${q}}`
        },
        tx5 = {
            keyword: "format",
            type: ["number", "string"],
            schemaType: "string",
            $data: !0,
            error: sx5,
            code(q, K) {
                let {
                    gen: _,
                    data: z,
                    $data: Y,
                    schema: A,
                    schemaCode: O,
                    it: w
                } = q, {
                    opts: $,
                    errSchemaPath: j,
                    schemaEnv: H,
                    self: J
                } = w;
                if (!$.validateFormats) return;
                if (Y) X();
                else M();

                function X() {
                    let P = _.scopeValue("formats", {
                            ref: J.formats,
                            code: $.code.formats
                        }),
                        W = _.const("fDef", iX._`${P}[${O}]`),
                        D = _.let("fType"),
                        Z = _.let("format");
                    _.if(iX._`typeof ${W} == "object" && !(${W} instanceof RegExp)`, () => _.assign(D, iX._`${W}.type || "string"`).assign(Z, iX._`${W}.validate`), () => _.assign(D, iX._`"string"`).assign(Z, W)), q.fail$data((0, iX.or)(G(), f()));

                    function G() {
                        if ($.strictSchema === !1) return iX.nil;
                        return iX._`${O} && !${Z}`
                    }

                    function f() {
                        let v = H.$async ? iX._`(${W}.async ? await ${Z}(${z}) : ${Z}(${z}))` : iX._`${Z}(${z})`,
                            V = iX._`(typeof ${Z} == "function" ? ${v} : ${Z}.test(${z}))`;
                        return iX._`${Z} && ${Z} !== true && ${D} === ${K} && !${V}`
                    }
                }

                function M() {
                    let P = J.formats[A];
                    if (!P) {
                        G();
                        return
                    }
                    if (P === !0) return;
                    let [W, D, Z] = f(P);
                    if (W === K) q.pass(v());

                    function G() {
                        if ($.strictSchema === !1) {
                            J.logger.warn(V());
                            return
                        }
                        throw Error(V());

                        function V() {
                            return `unknown format "${A}" ignored in schema at path "${j}"`
                        }
                    }

                    function f(V) {
                        let k = V instanceof RegExp ? (0, iX.regexpCode)(V) : $.code.formats ? iX._`${$.code.formats}${(0,iX.getProperty)(A)}` : void 0,
                            N = _.scopeValue("formats", {
                                key: A,
                                ref: V,
                                code: k
                            });
                        if (typeof V == "object" && !(V instanceof RegExp)) return [V.type || "string", V.validate, iX._`${N}.validate`];
                        return ["string", V, N]
                    }

                    function v() {
                        if (typeof P == "object" && !(P instanceof RegExp) && P.async) {
                            if (!H.$async) throw Error("async format in sync schema");
                            return iX._`await ${Z}(${z})`
                        }
                        return typeof D == "function" ? iX._`${Z}(${z})` : iX._`${Z}.test(${z})`
                    }
                }
            }
        };
    yR7.default = tx5
})
// @from(Ln 33255, Col 4)
RR7 = p((hR7) => {
    Object.defineProperty(hR7, "__esModule", {
        value: !0
    });
    var qu5 = LR7(),
        Ku5 = [qu5.default];
    hR7.default = Ku5
})
// @from(Ln 33263, Col 4)
bR7 = p((SR7) => {
    Object.defineProperty(SR7, "__esModule", {
        value: !0
    });
    SR7.contentVocabulary = SR7.metadataVocabulary = void 0;
    SR7.metadataVocabulary = ["title", "description", "default", "deprecated", "readOnly", "writeOnly", "examples"];
    SR7.contentVocabulary = ["contentMediaType", "contentEncoding", "contentSchema"]
})
// @from(Ln 33271, Col 4)
uR7 = p((xR7) => {
    Object.defineProperty(xR7, "__esModule", {
        value: !0
    });
    var Yu5 = zh7(),
        Au5 = Sh7(),
        Ou5 = ER7(),
        wu5 = RR7(),
        IR7 = bR7(),
        $u5 = [Yu5.default, Au5.default, (0, Ou5.default)(), wu5.default, IR7.metadataVocabulary, IR7.contentVocabulary];
    xR7.default = $u5
})
// @from(Ln 33283, Col 4)
FR7 = p((BR7) => {
    Object.defineProperty(BR7, "__esModule", {
        value: !0
    });
    BR7.DiscrError = void 0;
    var mR7;
    (function(q) {
        q.Tag = "tag", q.Mapping = "mapping"
    })(mR7 || (BR7.DiscrError = mR7 = {}))
})
// @from(Ln 33293, Col 4)
QR7 = p((UR7) => {
    Object.defineProperty(UR7, "__esModule", {
        value: !0
    });
    var rZ6 = B_(),
        J_1 = FR7(),
        gR7 = Mj8(),
        Hu5 = rg6(),
        Ju5 = nY(),
        Xu5 = {
            message: ({
                params: {
                    discrError: q,
                    tagName: K
                }
            }) => q === J_1.DiscrError.Tag ? `tag "${K}" must be string` : `value of tag "${K}" must be in oneOf`,
            params: ({
                params: {
                    discrError: q,
                    tag: K,
                    tagName: _
                }
            }) => rZ6._`{error: ${q}, tag: ${_}, tagValue: ${K}}`
        },
        Mu5 = {
            keyword: "discriminator",
            type: "object",
            schemaType: "object",
            error: Xu5,
            code(q) {
                let {
                    gen: K,
                    data: _,
                    schema: z,
                    parentSchema: Y,
                    it: A
                } = q, {
                    oneOf: O
                } = Y;
                if (!A.opts.discriminator) throw Error("discriminator: requires discriminator option");
                let w = z.propertyName;
                if (typeof w != "string") throw Error("discriminator: requires propertyName");
                if (z.mapping) throw Error("discriminator: mapping is not supported");
                if (!O) throw Error("discriminator: requires oneOf keyword");
                let $ = K.let("valid", !1),
                    j = K.const("tag", rZ6._`${_}${(0,rZ6.getProperty)(w)}`);
                K.if(rZ6._`typeof ${j} == "string"`, () => H(), () => q.error(!1, {
                    discrError: J_1.DiscrError.Tag,
                    tag: j,
                    tagName: w
                })), q.ok($);

                function H() {
                    let M = X();
                    K.if(!1);
                    for (let P in M) K.elseIf(rZ6._`${j} === ${P}`), K.assign($, J(M[P]));
                    K.else(), q.error(!1, {
                        discrError: J_1.DiscrError.Mapping,
                        tag: j,
                        tagName: w
                    }), K.endIf()
                }

                function J(M) {
                    let P = K.name("valid"),
                        W = q.subschema({
                            keyword: "oneOf",
                            schemaProp: M
                        }, P);
                    return q.mergeEvaluated(W, rZ6.Name), P
                }

                function X() {
                    var M;
                    let P = {},
                        W = Z(Y),
                        D = !0;
                    for (let v = 0; v < O.length; v++) {
                        let V = O[v];
                        if ((V === null || V === void 0 ? void 0 : V.$ref) && !(0, Ju5.schemaHasRulesButRef)(V, A.self.RULES)) {
                            let N = V.$ref;
                            if (V = gR7.resolveRef.call(A.self, A.schemaEnv.root, A.baseId, N), V instanceof gR7.SchemaEnv) V = V.schema;
                            if (V === void 0) throw new Hu5.default(A.opts.uriResolver, A.baseId, N)
                        }
                        let k = (M = V === null || V === void 0 ? void 0 : V.properties) === null || M === void 0 ? void 0 : M[w];
                        if (typeof k != "object") throw Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${w}"`);
                        D = D && (W || Z(V)), G(k, v)
                    }
                    if (!D) throw Error(`discriminator: "${w}" must be required`);
                    return P;

                    function Z({
                        required: v
                    }) {
                        return Array.isArray(v) && v.includes(w)
                    }

                    function G(v, V) {
                        if (v.const) f(v.const, V);
                        else if (v.enum)
                            for (let k of v.enum) f(k, V);
                        else throw Error(`discriminator: "properties/${w}" must have "const" or "enum"`)
                    }

                    function f(v, V) {
                        if (typeof v != "string" || v in P) throw Error(`discriminator: "${w}" values must be unique strings`);
                        P[v] = V
                    }
                }
            }
        };
    UR7.default = Mu5
})
// @from(Ln 33406, Col 4)
dR7 = p((lxA, Wu5) => {
    Wu5.exports = {
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
// @from(Ln 33626, Col 4)
bj8 = p((dN, X_1) => {
    Object.defineProperty(dN, "__esModule", {
        value: !0
    });
    dN.MissingRefError = dN.ValidationError = dN.CodeGen = dN.Name = dN.nil = dN.stringify = dN.str = dN._ = dN.KeywordCxt = dN.Ajv = void 0;
    var Du5 = iL7(),
        Zu5 = uR7(),
        fu5 = QR7(),
        cR7 = dR7(),
        Gu5 = ["/properties"],
        Cj8 = "http://json-schema.org/draft-07/schema";
    class OU6 extends Du5.default {
        _addVocabularies() {
            if (super._addVocabularies(), Zu5.default.forEach((q) => this.addVocabulary(q)), this.opts.discriminator) this.addKeyword(fu5.default)
        }
        _addDefaultMetaSchema() {
            if (super._addDefaultMetaSchema(), !this.opts.meta) return;
            let q = this.opts.$data ? this.$dataMetaSchema(cR7, Gu5) : cR7;
            this.addMetaSchema(q, Cj8, !1), this.refs["http://json-schema.org/schema"] = Cj8
        }
        defaultMeta() {
            return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(Cj8) ? Cj8 : void 0)
        }
    }
    dN.Ajv = OU6;
    X_1.exports = dN = OU6;
    X_1.exports.Ajv = OU6;
    Object.defineProperty(dN, "__esModule", {
        value: !0
    });
    dN.default = OU6;
    var vu5 = ig6();
    Object.defineProperty(dN, "KeywordCxt", {
        enumerable: !0,
        get: function() {
            return vu5.KeywordCxt
        }
    });
    var oZ6 = B_();
    Object.defineProperty(dN, "_", {
        enumerable: !0,
        get: function() {
            return oZ6._
        }
    });
    Object.defineProperty(dN, "str", {
        enumerable: !0,
        get: function() {
            return oZ6.str
        }
    });
    Object.defineProperty(dN, "stringify", {
        enumerable: !0,
        get: function() {
            return oZ6.stringify
        }
    });
    Object.defineProperty(dN, "nil", {
        enumerable: !0,
        get: function() {
            return oZ6.nil
        }
    });
    Object.defineProperty(dN, "Name", {
        enumerable: !0,
        get: function() {
            return oZ6.Name
        }
    });
    Object.defineProperty(dN, "CodeGen", {
        enumerable: !0,
        get: function() {
            return oZ6.CodeGen
        }
    });
    var Tu5 = Jj8();
    Object.defineProperty(dN, "ValidationError", {
        enumerable: !0,
        get: function() {
            return Tu5.default
        }
    });
    var Vu5 = rg6();
    Object.defineProperty(dN, "MissingRefError", {
        enumerable: !0,
        get: function() {
            return Vu5.default
        }
    })
})