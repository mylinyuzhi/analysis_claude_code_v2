
// @from(Ln 83687, Col 4)
Ao = p((sN3) => {
    var j5q = xJ1(),
        Gw = sj(),
        Yo = UJ1(),
        oZ = XE(),
        s0 = JE(),
        pc6 = cJ1(),
        J5q = nw(),
        Mb = iJ1();
    class Cv6 {
        queryCompat;
        constructor(q = !1) {
            this.queryCompat = q
        }
        resolveRestContentType(q, K) {
            let _ = K.getMemberSchemas(),
                z = Object.values(_).find((Y) => {
                    return !!Y.getMergedTraits().httpPayload
                });
            if (z) {
                let Y = z.getMergedTraits().mediaType;
                if (Y) return Y;
                else if (z.isStringSchema()) return "text/plain";
                else if (z.isBlobSchema()) return "application/octet-stream";
                else return q
            } else if (!K.isUnitSchema()) {
                if (Object.values(_).find((A) => {
                        let {
                            httpQuery: O,
                            httpQueryParams: w,
                            httpHeader: $,
                            httpLabel: j,
                            httpPrefixHeaders: H
                        } = A.getMergedTraits();
                        return !O && !w && !$ && !j && H === void 0
                    })) return q
            }
        }
        async getErrorSchemaOrThrowBaseException(q, K, _, z, Y, A) {
            let O = K,
                w = q;
            if (q.includes("#"))[O, w] = q.split("#");
            let $ = {
                    $metadata: Y,
                    $fault: _.statusCode < 500 ? "client" : "server"
                },
                j = Gw.TypeRegistry.for(O);
            try {
                return {
                    errorSchema: A?.(j, w) ?? j.getSchema(q),
                    errorMetadata: $
                }
            } catch (H) {
                z.message = z.message ?? z.Message ?? "UnknownError";
                let J = Gw.TypeRegistry.for("smithy.ts.sdk.synthetic." + O),
                    X = J.getBaseException();
                if (X) {
                    let M = J.getErrorCtor(X) ?? Error;
                    throw this.decorateServiceException(Object.assign(new M({
                        name: w
                    }), $), z)
                }
                throw this.decorateServiceException(Object.assign(Error(w), $), z)
            }
        }
        decorateServiceException(q, K = {}) {
            if (this.queryCompat) {
                let _ = q.Message ?? K.Message,
                    z = Yo.decorateServiceException(q, K);
                if (_) z.Message = _, z.message = _;
                return z
            }
            return Yo.decorateServiceException(q, K)
        }
        setQueryCompatError(q, K) {
            let _ = K.headers?.["x-amzn-query-error"];
            if (q !== void 0 && _ != null) {
                let [z, Y] = _.split(";"), A = Object.entries(q), O = {
                    Code: z,
                    Type: Y
                };
                Object.assign(q, O);
                for (let [w, $] of A) O[w] = $;
                delete O.__type, q.Error = O
            }
        }
        queryCompatOutput(q, K) {
            if (q.Error) K.Error = q.Error;
            if (q.Type) K.Type = q.Type;
            if (q.Code) K.Code = q.Code
        }
    }
    class X5q extends j5q.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: q,
            awsQueryCompatible: K
        }) {
            super({
                defaultNamespace: q
            });
            this.awsQueryCompatible = !!K, this.mixin = new Cv6(this.awsQueryCompatible)
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (this.awsQueryCompatible) z.headers["x-amzn-query-mode"] = "true";
            return z
        }
        async handleError(q, K, _, z, Y) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(z, _);
            let A = j5q.loadSmithyRpcV2CborErrorCode(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = Gw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(Gw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j),
                X = {};
            for (let [M, P] of $.structIterator()) X[M] = this.deserializer.readValue(P, z[M]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(z, X);
            throw this.mixin.decorateServiceException(Object.assign(J, w, {
                $fault: $.getMergedTraits().error,
                message: j
            }, X), z)
        }
    }
    var cN3 = (q) => {
            if (q == null) return q;
            if (typeof q === "number" || typeof q === "bigint") {
                let K = Error(`Received number ${q} where a string was expected.`);
                return K.name = "Warning", console.warn(K), String(q)
            }
            if (typeof q === "boolean") {
                let K = Error(`Received boolean ${q} where a string was expected.`);
                return K.name = "Warning", console.warn(K), String(q)
            }
            return q
        },
        lN3 = (q) => {
            if (q == null) return q;
            if (typeof q === "string") {
                let K = q.toLowerCase();
                if (q !== "" && K !== "false" && K !== "true") {
                    let _ = Error(`Received string "${q}" where a boolean was expected.`);
                    _.name = "Warning", console.warn(_)
                }
                return q !== "" && K !== "false"
            }
            return q
        },
        nN3 = (q) => {
            if (q == null) return q;
            if (typeof q === "string") {
                let K = Number(q);
                if (K.toString() !== q) {
                    let _ = Error(`Received string "${q}" where a number was expected.`);
                    return _.name = "Warning", console.warn(_), q
                }
                return K
            }
            return q
        };
    class T76 {
        serdeContext;
        setSerdeContext(q) {
            this.serdeContext = q
        }
    }

    function iN3(q, K, _) {
        if (_?.source) {
            let z = _.source;
            if (typeof K === "number") {
                if (K > Number.MAX_SAFE_INTEGER || K < Number.MIN_SAFE_INTEGER || z !== String(K))
                    if (z.includes(".")) return new s0.NumericValue(z, "bigDecimal");
                    else return BigInt(z)
            }
        }
        return K
    }
    var M5q = (q, K) => Yo.collectBody(q, K).then((_) => (K?.utf8Encoder ?? J5q.toUtf8)(_)),
        KM1 = (q, K) => M5q(q, K).then((_) => {
            if (_.length) try {
                return JSON.parse(_)
            } catch (z) {
                if (z?.name === "SyntaxError") Object.defineProperty(z, "$responseBodyText", {
                    value: _
                });
                throw z
            }
            return {}
        }),
        rN3 = async (q, K) => {
            let _ = await KM1(q, K);
            return _.message = _.message ?? _.Message, _
        }, _M1 = (q, K) => {
            let _ = (A, O) => Object.keys(A).find((w) => w.toLowerCase() === O.toLowerCase()),
                z = (A) => {
                    let O = A;
                    if (typeof O === "number") O = O.toString();
                    if (O.indexOf(",") >= 0) O = O.split(",")[0];
                    if (O.indexOf(":") >= 0) O = O.split(":")[0];
                    if (O.indexOf("#") >= 0) O = O.split("#")[1];
                    return O
                },
                Y = _(q.headers, "x-amzn-errortype");
            if (Y !== void 0) return z(q.headers[Y]);
            if (K && typeof K === "object") {
                let A = _(K, "code");
                if (A && K[A] !== void 0) return z(K[A]);
                if (K.__type !== void 0) return z(K.__type)
            }
        };
    class zM1 extends T76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        async read(q, K) {
            return this._read(q, typeof K === "string" ? JSON.parse(K, iN3) : await KM1(K, this.serdeContext))
        }
        readObject(q, K) {
            return this._read(q, K)
        }
        _read(q, K) {
            let _ = K !== null && typeof K === "object",
                z = Gw.NormalizedSchema.of(q);
            if (z.isListSchema() && Array.isArray(K)) {
                let A = z.getValueSchema(),
                    O = [],
                    w = !!z.getMergedTraits().sparse;
                for (let $ of K)
                    if (w || $ != null) O.push(this._read(A, $));
                return O
            } else if (z.isMapSchema() && _) {
                let A = z.getValueSchema(),
                    O = {},
                    w = !!z.getMergedTraits().sparse;
                for (let [$, j] of Object.entries(K))
                    if (w || j != null) O[$] = this._read(A, j);
                return O
            } else if (z.isStructSchema() && _) {
                let A = {};
                for (let [O, w] of z.structIterator()) {
                    let $ = this.settings.jsonName ? w.getMergedTraits().jsonName ?? O : O,
                        j = this._read(w, K[$]);
                    if (j != null) A[O] = j
                }
                return A
            }
            if (z.isBlobSchema() && typeof K === "string") return pc6.fromBase64(K);
            let Y = z.getMergedTraits().mediaType;
            if (z.isStringSchema() && typeof K === "string" && Y) {
                if (Y === "application/json" || Y.endsWith("+json")) return s0.LazyJsonString.from(K)
            }
            if (z.isTimestampSchema() && K != null) switch (oZ.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return s0.parseRfc3339DateTimeWithOffset(K);
                case 6:
                    return s0.parseRfc7231DateTime(K);
                case 7:
                    return s0.parseEpochTimestamp(K);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", K), new Date(K)
            }
            if (z.isBigIntegerSchema() && (typeof K === "number" || typeof K === "string")) return BigInt(K);
            if (z.isBigDecimalSchema() && K != null) {
                if (K instanceof s0.NumericValue) return K;
                let A = K;
                if (A.type === "bigDecimal" && "string" in A) return new s0.NumericValue(A.string, A.type);
                return new s0.NumericValue(String(K), "bigDecimal")
            }
            if (z.isNumericSchema() && typeof K === "string") switch (K) {
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                case "NaN":
                    return NaN
            }
            if (z.isDocumentSchema())
                if (_) {
                    let A = Array.isArray(K) ? [] : {};
                    for (let [O, w] of Object.entries(K))
                        if (w instanceof s0.NumericValue) A[O] = w;
                        else A[O] = this._read(z, w);
                    return A
                } else return structuredClone(K);
            return K
        }
    }
    var H5q = String.fromCharCode(925);
    class P5q {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (q, K) => {
                if (K instanceof s0.NumericValue) {
                    let _ = `${H5q+"nv"+this.counter++}_` + K.string;
                    return this.values.set(`"${_}"`, K.string), _
                }
                if (typeof K === "bigint") {
                    let _ = K.toString(),
                        z = `${H5q+"b"+this.counter++}_` + _;
                    return this.values.set(`"${z}"`, _), z
                }
                return K
            }
        }
        replaceInJson(q) {
            if (this.stage === 0) throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            if (this.stage = 2, this.counter === 0) return q;
            for (let [K, _] of this.values) q = q.replace(K, _);
            return q
        }
    }
    class YM1 extends T76 {
        settings;
        buffer;
        rootSchema;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K) {
            this.rootSchema = Gw.NormalizedSchema.of(q), this.buffer = this._write(this.rootSchema, K)
        }
        writeDiscriminatedDocument(q, K) {
            if (this.write(q, K), typeof this.buffer === "object") this.buffer.__type = Gw.NormalizedSchema.of(q).getName(!0)
        }
        flush() {
            let {
                rootSchema: q
            } = this;
            if (this.rootSchema = void 0, q?.isStructSchema() || q?.isDocumentSchema()) {
                let K = new P5q;
                return K.replaceInJson(JSON.stringify(this.buffer, K.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(q, K, _) {
            let z = K !== null && typeof K === "object",
                Y = Gw.NormalizedSchema.of(q);
            if (Y.isListSchema() && Array.isArray(K)) {
                let A = Y.getValueSchema(),
                    O = [],
                    w = !!Y.getMergedTraits().sparse;
                for (let $ of K)
                    if (w || $ != null) O.push(this._write(A, $));
                return O
            } else if (Y.isMapSchema() && z) {
                let A = Y.getValueSchema(),
                    O = {},
                    w = !!Y.getMergedTraits().sparse;
                for (let [$, j] of Object.entries(K))
                    if (w || j != null) O[$] = this._write(A, j);
                return O
            } else if (Y.isStructSchema() && z) {
                let A = {};
                for (let [O, w] of Y.structIterator()) {
                    let $ = this.settings.jsonName ? w.getMergedTraits().jsonName ?? O : O,
                        j = this._write(w, K[O], Y);
                    if (j !== void 0) A[$] = j
                }
                return A
            }
            if (K === null && _?.isStructSchema()) return;
            if (Y.isBlobSchema() && (K instanceof Uint8Array || typeof K === "string") || Y.isDocumentSchema() && K instanceof Uint8Array) {
                if (Y === this.rootSchema) return K;
                return (this.serdeContext?.base64Encoder ?? pc6.toBase64)(K)
            }
            if ((Y.isTimestampSchema() || Y.isDocumentSchema()) && K instanceof Date) switch (oZ.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return K.toISOString().replace(".000Z", "Z");
                case 6:
                    return s0.dateToUtcString(K);
                case 7:
                    return K.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", K), K.getTime() / 1000
            }
            if (Y.isNumericSchema() && typeof K === "number") {
                if (Math.abs(K) === 1 / 0 || isNaN(K)) return String(K)
            }
            if (Y.isStringSchema()) {
                if (typeof K > "u" && Y.isIdempotencyToken()) return s0.generateIdempotencyToken();
                let A = Y.getMergedTraits().mediaType;
                if (K != null && A) {
                    if (A === "application/json" || A.endsWith("+json")) return s0.LazyJsonString.from(K)
                }
            }
            if (Y.isDocumentSchema())
                if (z) {
                    let A = Array.isArray(K) ? [] : {};
                    for (let [O, w] of Object.entries(K))
                        if (w instanceof s0.NumericValue) A[O] = w;
                        else A[O] = this._write(Y, w);
                    return A
                } else return structuredClone(K);
            return K
        }
    }
    class LW8 extends T76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        createSerializer() {
            let q = new YM1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
        createDeserializer() {
            let q = new zM1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
    }
    class hW8 extends oZ.RpcProtocol {
        serializer;
        deserializer;
        serviceTarget;
        codec;
        mixin;
        awsQueryCompatible;
        constructor({
            defaultNamespace: q,
            serviceTarget: K,
            awsQueryCompatible: _
        }) {
            super({
                defaultNamespace: q
            });
            this.serviceTarget = K, this.codec = new LW8({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!_, this.mixin = new Cv6(this.awsQueryCompatible)
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (!z.path.endsWith("/")) z.path += "/";
            if (Object.assign(z.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${q.name}`
                }), this.awsQueryCompatible) z.headers["x-amzn-query-mode"] = "true";
            if (Gw.deref(q.input) === "unit" || !z.body) z.body = "{}";
            return z
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(q, K, _, z, Y) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(z, _);
            let A = _M1(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = Gw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(Gw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j),
                X = {};
            for (let [M, P] of $.structIterator()) {
                let W = P.getMergedTraits().jsonName ?? M;
                X[M] = this.codec.createDeserializer().readObject(P, z[W])
            }
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(z, X);
            throw this.mixin.decorateServiceException(Object.assign(J, w, {
                $fault: $.getMergedTraits().error,
                message: j
            }, X), z)
        }
    }
    class W5q extends hW8 {
        constructor({
            defaultNamespace: q,
            serviceTarget: K,
            awsQueryCompatible: _
        }) {
            super({
                defaultNamespace: q,
                serviceTarget: K,
                awsQueryCompatible: _
            })
        }
        getShapeId() {
            return "aws.protocols#awsJson1_0"
        }
        getJsonRpcVersion() {
            return "1.0"
        }
        getDefaultContentType() {
            return "application/x-amz-json-1.0"
        }
    }
    class D5q extends hW8 {
        constructor({
            defaultNamespace: q,
            serviceTarget: K,
            awsQueryCompatible: _
        }) {
            super({
                defaultNamespace: q,
                serviceTarget: K,
                awsQueryCompatible: _
            })
        }
        getShapeId() {
            return "aws.protocols#awsJson1_1"
        }
        getJsonRpcVersion() {
            return "1.1"
        }
        getDefaultContentType() {
            return "application/x-amz-json-1.1"
        }
    }
    class Z5q extends oZ.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new Cv6;
        constructor({
            defaultNamespace: q
        }) {
            super({
                defaultNamespace: q
            });
            let K = {
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                httpBindings: !0,
                jsonName: !0
            };
            this.codec = new LW8(K), this.serializer = new oZ.HttpInterceptingShapeSerializer(this.codec.createSerializer(), K), this.deserializer = new oZ.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), K)
        }
        getShapeId() {
            return "aws.protocols#restJson1"
        }
        getPayloadCodec() {
            return this.codec
        }
        setSerdeContext(q) {
            this.codec.setSerdeContext(q), super.setSerdeContext(q)
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _),
                Y = Gw.NormalizedSchema.of(q.input);
            if (!z.headers["content-type"]) {
                let A = this.mixin.resolveRestContentType(this.getDefaultContentType(), Y);
                if (A) z.headers["content-type"] = A
            }
            if (z.body == null && z.headers["content-type"] === this.getDefaultContentType()) z.body = "{}";
            return z
        }
        async deserializeResponse(q, K, _) {
            let z = await super.deserializeResponse(q, K, _),
                Y = Gw.NormalizedSchema.of(q.output);
            for (let [A, O] of Y.structIterator())
                if (O.getMemberTraits().httpPayload && !(A in z)) z[A] = null;
            return z
        }
        async handleError(q, K, _, z, Y) {
            let A = _M1(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = Gw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(Gw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j);
            await this.deserializeHttpMessage(O, K, _, z);
            let X = {};
            for (let [M, P] of $.structIterator()) {
                let W = P.getMergedTraits().jsonName ?? M;
                X[M] = this.codec.createDeserializer().readObject(P, z[W])
            }
            throw this.mixin.decorateServiceException(Object.assign(J, w, {
                $fault: $.getMergedTraits().error,
                message: j
            }, X), z)
        }
        getDefaultContentType() {
            return "application/json"
        }
    }
    var oN3 = (q) => {
        if (q == null) return;
        if (typeof q === "object" && "__type" in q) delete q.__type;
        return Yo.expectUnion(q)
    };
    class RW8 extends T76 {
        settings;
        stringDeserializer;
        constructor(q) {
            super();
            this.settings = q, this.stringDeserializer = new oZ.FromStringShapeDeserializer(q)
        }
        setSerdeContext(q) {
            this.serdeContext = q, this.stringDeserializer.setSerdeContext(q)
        }
        read(q, K, _) {
            let z = Gw.NormalizedSchema.of(q),
                Y = z.getMemberSchemas();
            if (z.isStructSchema() && z.isMemberSchema() && !!Object.values(Y).find(($) => {
                    return !!$.getMemberTraits().eventPayload
                })) {
                let $ = {},
                    j = Object.keys(Y)[0];
                if (Y[j].isBlobSchema()) $[j] = K;
                else $[j] = this.read(Y[j], K);
                return $
            }
            let O = (this.serdeContext?.utf8Encoder ?? J5q.toUtf8)(K),
                w = this.parseXml(O);
            return this.readSchema(q, _ ? w[_] : w)
        }
        readSchema(q, K) {
            let _ = Gw.NormalizedSchema.of(q);
            if (_.isUnitSchema()) return;
            let z = _.getMergedTraits();
            if (_.isListSchema() && !Array.isArray(K)) return this.readSchema(_, [K]);
            if (K == null) return K;
            if (typeof K === "object") {
                let Y = !!z.sparse,
                    A = !!z.xmlFlattened;
                if (_.isListSchema()) {
                    let w = _.getValueSchema(),
                        $ = [],
                        j = w.getMergedTraits().xmlName ?? "member",
                        H = A ? K : (K[0] ?? K)[j],
                        J = Array.isArray(H) ? H : [H];
                    for (let X of J)
                        if (X != null || Y) $.push(this.readSchema(w, X));
                    return $
                }
                let O = {};
                if (_.isMapSchema()) {
                    let w = _.getKeySchema(),
                        $ = _.getValueSchema(),
                        j;
                    if (A) j = Array.isArray(K) ? K : [K];
                    else j = Array.isArray(K.entry) ? K.entry : [K.entry];
                    let H = w.getMergedTraits().xmlName ?? "key",
                        J = $.getMergedTraits().xmlName ?? "value";
                    for (let X of j) {
                        let M = X[H],
                            P = X[J];
                        if (P != null || Y) O[M] = this.readSchema($, P)
                    }
                    return O
                }
                if (_.isStructSchema()) {
                    for (let [w, $] of _.structIterator()) {
                        let j = $.getMergedTraits(),
                            H = !j.httpPayload ? $.getMemberTraits().xmlName ?? w : j.xmlName ?? $.getName();
                        if (K[H] != null) O[w] = this.readSchema($, K[H])
                    }
                    return O
                }
                if (_.isDocumentSchema()) return K;
                throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${_.getName(!0)}`)
            }
            if (_.isListSchema()) return [];
            if (_.isMapSchema() || _.isStructSchema()) return {};
            return this.stringDeserializer.read(_, K)
        }
        parseXml(q) {
            if (q.length) {
                let K;
                try {
                    K = Mb.parseXML(q)
                } catch (A) {
                    if (A && typeof A === "object") Object.defineProperty(A, "$responseBodyText", {
                        value: q
                    });
                    throw A
                }
                let _ = "#text",
                    z = Object.keys(K)[0],
                    Y = K[z];
                if (Y[_]) Y[z] = Y[_], delete Y[_];
                return Yo.getValueFromTextNode(Y)
            }
            return {}
        }
    }
    class f5q extends T76 {
        settings;
        buffer;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K, _ = "") {
            if (this.buffer === void 0) this.buffer = "";
            let z = Gw.NormalizedSchema.of(q);
            if (_ && !_.endsWith(".")) _ += ".";
            if (z.isBlobSchema()) {
                if (typeof K === "string" || K instanceof Uint8Array) this.writeKey(_), this.writeValue((this.serdeContext?.base64Encoder ?? pc6.toBase64)(K))
            } else if (z.isBooleanSchema() || z.isNumericSchema() || z.isStringSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(String(K));
                else if (z.isIdempotencyToken()) this.writeKey(_), this.writeValue(s0.generateIdempotencyToken())
            } else if (z.isBigIntegerSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(String(K))
            } else if (z.isBigDecimalSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(K instanceof s0.NumericValue ? K.string : String(K))
            } else if (z.isTimestampSchema()) {
                if (K instanceof Date) switch (this.writeKey(_), oZ.determineTimestampFormat(z, this.settings)) {
                    case 5:
                        this.writeValue(K.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(Yo.dateToUtcString(K));
                        break;
                    case 7:
                        this.writeValue(String(K.getTime() / 1000));
                        break
                }
            } else if (z.isDocumentSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${z.getName(!0)}`);
            else if (z.isListSchema()) {
                if (Array.isArray(K))
                    if (K.length === 0) {
                        if (this.settings.serializeEmptyLists) this.writeKey(_), this.writeValue("")
                    } else {
                        let Y = z.getValueSchema(),
                            A = this.settings.flattenLists || z.getMergedTraits().xmlFlattened,
                            O = 1;
                        for (let w of K) {
                            if (w == null) continue;
                            let $ = this.getKey("member", Y.getMergedTraits().xmlName),
                                j = A ? `${_}${O}` : `${_}${$}.${O}`;
                            this.write(Y, w, j), ++O
                        }
                    }
            } else if (z.isMapSchema()) {
                if (K && typeof K === "object") {
                    let Y = z.getKeySchema(),
                        A = z.getValueSchema(),
                        O = z.getMergedTraits().xmlFlattened,
                        w = 1;
                    for (let [$, j] of Object.entries(K)) {
                        if (j == null) continue;
                        let H = this.getKey("key", Y.getMergedTraits().xmlName),
                            J = O ? `${_}${w}.${H}` : `${_}entry.${w}.${H}`,
                            X = this.getKey("value", A.getMergedTraits().xmlName),
                            M = O ? `${_}${w}.${X}` : `${_}entry.${w}.${X}`;
                        this.write(Y, $, J), this.write(A, j, M), ++w
                    }
                }
            } else if (z.isStructSchema()) {
                if (K && typeof K === "object")
                    for (let [Y, A] of z.structIterator()) {
                        if (K[Y] == null && !A.isIdempotencyToken()) continue;
                        let O = this.getKey(Y, A.getMergedTraits().xmlName),
                            w = `${_}${O}`;
                        this.write(A, K[Y], w)
                    }
            } else if (z.isUnitSchema());
            else throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${z.getName(!0)}`)
        }
        flush() {
            if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
            let q = this.buffer;
            return delete this.buffer, q
        }
        getKey(q, K) {
            let _ = K ?? q;
            if (this.settings.capitalizeKeys) return _[0].toUpperCase() + _.slice(1);
            return _
        }
        writeKey(q) {
            if (q.endsWith(".")) q = q.slice(0, q.length - 1);
            this.buffer += `&${oZ.extendedEncodeURIComponent(q)}=`
        }
        writeValue(q) {
            this.buffer += oZ.extendedEncodeURIComponent(q)
        }
    }
    class AM1 extends oZ.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new Cv6;
        constructor(q) {
            super({
                defaultNamespace: q.defaultNamespace
            });
            this.options = q;
            let K = {
                timestampFormat: {
                    useTrait: !0,
                    default: 5
                },
                httpBindings: !1,
                xmlNamespace: q.xmlNamespace,
                serviceNamespace: q.defaultNamespace,
                serializeEmptyLists: !0
            };
            this.serializer = new f5q(K), this.deserializer = new RW8(K)
        }
        getShapeId() {
            return "aws.protocols#awsQuery"
        }
        setSerdeContext(q) {
            this.serializer.setSerdeContext(q), this.deserializer.setSerdeContext(q)
        }
        getPayloadCodec() {
            throw Error("AWSQuery protocol has no payload codec.")
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (!z.path.endsWith("/")) z.path += "/";
            if (Object.assign(z.headers, {
                    "content-type": "application/x-www-form-urlencoded"
                }), Gw.deref(q.input) === "unit" || !z.body) z.body = "";
            let Y = q.name.split("#")[1] ?? q.name;
            if (z.body = `Action=${Y}&Version=${this.options.version}` + z.body, z.body.endsWith("&")) z.body = z.body.slice(-1);
            return z
        }
        async deserializeResponse(q, K, _) {
            let z = this.deserializer,
                Y = Gw.NormalizedSchema.of(q.output),
                A = {};
            if (_.statusCode >= 300) {
                let H = await oZ.collectBody(_.body, K);
                if (H.byteLength > 0) Object.assign(A, await z.read(15, H));
                await this.handleError(q, K, _, A, this.deserializeMetadata(_))
            }
            for (let H in _.headers) {
                let J = _.headers[H];
                delete _.headers[H], _.headers[H.toLowerCase()] = J
            }
            let O = q.name.split("#")[1] ?? q.name,
                w = Y.isStructSchema() && this.useNestedResult() ? O + "Result" : void 0,
                $ = await oZ.collectBody(_.body, K);
            if ($.byteLength > 0) Object.assign(A, await z.read(Y, $, w));
            return {
                $metadata: this.deserializeMetadata(_),
                ...A
            }
        }
        useNestedResult() {
            return !0
        }
        async handleError(q, K, _, z, Y) {
            let A = this.loadQueryErrorCode(_, z) ?? "Unknown",
                O = this.loadQueryError(z),
                w = this.loadQueryErrorMessage(z);
            O.message = w, O.Error = {
                Type: O.Type,
                Code: O.Code,
                Message: w
            };
            let {
                errorSchema: $,
                errorMetadata: j
            } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, O, Y, (P, W) => {
                try {
                    return P.getSchema(W)
                } catch (D) {
                    return P.find((Z) => Gw.NormalizedSchema.of(Z).getMergedTraits().awsQueryError?.[0] === W)
                }
            }), H = Gw.NormalizedSchema.of($), X = new(Gw.TypeRegistry.for($[1]).getErrorCtor($) ?? Error)(w), M = {
                Error: O.Error
            };
            for (let [P, W] of H.structIterator()) {
                let D = W.getMergedTraits().xmlName ?? P,
                    Z = O[D] ?? z[D];
                M[P] = this.deserializer.readSchema(W, Z)
            }
            throw this.mixin.decorateServiceException(Object.assign(X, j, {
                $fault: H.getMergedTraits().error,
                message: w
            }, M), z)
        }
        loadQueryErrorCode(q, K) {
            let _ = (K.Errors?.[0]?.Error ?? K.Errors?.Error ?? K.Error)?.Code;
            if (_ !== void 0) return _;
            if (q.statusCode == 404) return "NotFound"
        }
        loadQueryError(q) {
            return q.Errors?.[0]?.Error ?? q.Errors?.Error ?? q.Error
        }
        loadQueryErrorMessage(q) {
            let K = this.loadQueryError(q);
            return K?.message ?? K?.Message ?? q.message ?? q.Message ?? "Unknown"
        }
        getDefaultContentType() {
            return "application/x-www-form-urlencoded"
        }
    }
    class G5q extends AM1 {
        options;
        constructor(q) {
            super(q);
            this.options = q;
            let K = {
                capitalizeKeys: !0,
                flattenLists: !0,
                serializeEmptyLists: !1
            };
            Object.assign(this.serializer.settings, K)
        }
        useNestedResult() {
            return !1
        }
    }
    var v5q = (q, K) => M5q(q, K).then((_) => {
            if (_.length) {
                let z;
                try {
                    z = Mb.parseXML(_)
                } catch (w) {
                    if (w && typeof w === "object") Object.defineProperty(w, "$responseBodyText", {
                        value: _
                    });
                    throw w
                }
                let Y = "#text",
                    A = Object.keys(z)[0],
                    O = z[A];
                if (O[Y]) O[A] = O[Y], delete O[Y];
                return Yo.getValueFromTextNode(O)
            }
            return {}
        }),
        aN3 = async (q, K) => {
            let _ = await v5q(q, K);
            if (_.Error) _.Error.message = _.Error.message ?? _.Error.Message;
            return _
        }, T5q = (q, K) => {
            if (K?.Error?.Code !== void 0) return K.Error.Code;
            if (K?.Code !== void 0) return K.Code;
            if (q.statusCode == 404) return "NotFound"
        };
    class OM1 extends T76 {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K) {
            let _ = Gw.NormalizedSchema.of(q);
            if (_.isStringSchema() && typeof K === "string") this.stringBuffer = K;
            else if (_.isBlobSchema()) this.byteBuffer = "byteLength" in K ? K : (this.serdeContext?.base64Decoder ?? pc6.fromBase64)(K);
            else {
                this.buffer = this.writeStruct(_, K, void 0);
                let z = _.getMergedTraits();
                if (z.httpPayload && !z.xmlName) this.buffer.withName(_.getName())
            }
        }
        flush() {
            if (this.byteBuffer !== void 0) {
                let K = this.byteBuffer;
                return delete this.byteBuffer, K
            }
            if (this.stringBuffer !== void 0) {
                let K = this.stringBuffer;
                return delete this.stringBuffer, K
            }
            let q = this.buffer;
            if (this.settings.xmlNamespace) {
                if (!q?.attributes?.xmlns) q.addAttribute("xmlns", this.settings.xmlNamespace)
            }
            return delete this.buffer, q.toString()
        }
        writeStruct(q, K, _) {
            let z = q.getMergedTraits(),
                Y = q.isMemberSchema() && !z.httpPayload ? q.getMemberTraits().xmlName ?? q.getMemberName() : z.xmlName ?? q.getName();
            if (!Y || !q.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${q.getName(!0)}.`);
            let A = Mb.XmlNode.of(Y),
                [O, w] = this.getXmlnsAttribute(q, _);
            for (let [$, j] of q.structIterator()) {
                let H = K[$];
                if (H != null || j.isIdempotencyToken()) {
                    if (j.getMergedTraits().xmlAttribute) {
                        A.addAttribute(j.getMergedTraits().xmlName ?? $, this.writeSimple(j, H));
                        continue
                    }
                    if (j.isListSchema()) this.writeList(j, H, A, w);
                    else if (j.isMapSchema()) this.writeMap(j, H, A, w);
                    else if (j.isStructSchema()) A.addChildNode(this.writeStruct(j, H, w));
                    else {
                        let J = Mb.XmlNode.of(j.getMergedTraits().xmlName ?? j.getMemberName());
                        this.writeSimpleInto(j, H, J, w), A.addChildNode(J)
                    }
                }
            }
            if (w) A.addAttribute(O, w);
            return A
        }
        writeList(q, K, _, z) {
            if (!q.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${q.getName(!0)}`);
            let Y = q.getMergedTraits(),
                A = q.getValueSchema(),
                O = A.getMergedTraits(),
                w = !!O.sparse,
                $ = !!Y.xmlFlattened,
                [j, H] = this.getXmlnsAttribute(q, z),
                J = (X, M) => {
                    if (A.isListSchema()) this.writeList(A, Array.isArray(M) ? M : [M], X, H);
                    else if (A.isMapSchema()) this.writeMap(A, M, X, H);
                    else if (A.isStructSchema()) {
                        let P = this.writeStruct(A, M, H);
                        X.addChildNode(P.withName($ ? Y.xmlName ?? q.getMemberName() : O.xmlName ?? "member"))
                    } else {
                        let P = Mb.XmlNode.of($ ? Y.xmlName ?? q.getMemberName() : O.xmlName ?? "member");
                        this.writeSimpleInto(A, M, P, H), X.addChildNode(P)
                    }
                };
            if ($) {
                for (let X of K)
                    if (w || X != null) J(_, X)
            } else {
                let X = Mb.XmlNode.of(Y.xmlName ?? q.getMemberName());
                if (H) X.addAttribute(j, H);
                for (let M of K)
                    if (w || M != null) J(X, M);
                _.addChildNode(X)
            }
        }
        writeMap(q, K, _, z, Y = !1) {
            if (!q.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${q.getName(!0)}`);
            let A = q.getMergedTraits(),
                O = q.getKeySchema(),
                $ = O.getMergedTraits().xmlName ?? "key",
                j = q.getValueSchema(),
                H = j.getMergedTraits(),
                J = H.xmlName ?? "value",
                X = !!H.sparse,
                M = !!A.xmlFlattened,
                [P, W] = this.getXmlnsAttribute(q, z),
                D = (Z, G, f) => {
                    let v = Mb.XmlNode.of($, G),
                        [V, k] = this.getXmlnsAttribute(O, W);
                    if (k) v.addAttribute(V, k);
                    Z.addChildNode(v);
                    let N = Mb.XmlNode.of(J);
                    if (j.isListSchema()) this.writeList(j, f, N, W);
                    else if (j.isMapSchema()) this.writeMap(j, f, N, W, !0);
                    else if (j.isStructSchema()) N = this.writeStruct(j, f, W);
                    else this.writeSimpleInto(j, f, N, W);
                    Z.addChildNode(N)
                };
            if (M) {
                for (let [Z, G] of Object.entries(K))
                    if (X || G != null) {
                        let f = Mb.XmlNode.of(A.xmlName ?? q.getMemberName());
                        D(f, Z, G), _.addChildNode(f)
                    }
            } else {
                let Z;
                if (!Y) {
                    if (Z = Mb.XmlNode.of(A.xmlName ?? q.getMemberName()), W) Z.addAttribute(P, W);
                    _.addChildNode(Z)
                }
                for (let [G, f] of Object.entries(K))
                    if (X || f != null) {
                        let v = Mb.XmlNode.of("entry");
                        D(v, G, f), (Y ? _ : Z).addChildNode(v)
                    }
            }
        }
        writeSimple(q, K) {
            if (K === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let _ = Gw.NormalizedSchema.of(q),
                z = null;
            if (K && typeof K === "object")
                if (_.isBlobSchema()) z = (this.serdeContext?.base64Encoder ?? pc6.toBase64)(K);
                else if (_.isTimestampSchema() && K instanceof Date) switch (oZ.determineTimestampFormat(_, this.settings)) {
                case 5:
                    z = K.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    z = Yo.dateToUtcString(K);
                    break;
                case 7:
                    z = String(K.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", K), z = Yo.dateToUtcString(K);
                    break
            } else if (_.isBigDecimalSchema() && K) {
                if (K instanceof s0.NumericValue) return K.string;
                return String(K)
            } else if (_.isMapSchema() || _.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${_.getName(!0)}`);
            if (_.isBooleanSchema() || _.isNumericSchema() || _.isBigIntegerSchema() || _.isBigDecimalSchema()) z = String(K);
            if (_.isStringSchema())
                if (K === void 0 && _.isIdempotencyToken()) z = s0.generateIdempotencyToken();
                else z = String(K);
            if (z === null) throw Error(`Unhandled schema-value pair ${_.getName(!0)}=${K}`);
            return z
        }
        writeSimpleInto(q, K, _, z) {
            let Y = this.writeSimple(q, K),
                A = Gw.NormalizedSchema.of(q),
                O = new Mb.XmlText(Y),
                [w, $] = this.getXmlnsAttribute(A, z);
            if ($) _.addAttribute(w, $);
            _.addChildNode(O)
        }
        getXmlnsAttribute(q, K) {
            let _ = q.getMergedTraits(),
                [z, Y] = _.xmlNamespace ?? [];
            if (Y && Y !== K) return [z ? `xmlns:${z}` : "xmlns", Y];
            return [void 0, void 0]
        }
    }
    class wM1 extends T76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        createSerializer() {
            let q = new OM1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
        createDeserializer() {
            let q = new RW8(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
    }
    class V5q extends oZ.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new Cv6;
        constructor(q) {
            super(q);
            let K = {
                timestampFormat: {
                    useTrait: !0,
                    default: 5
                },
                httpBindings: !0,
                xmlNamespace: q.xmlNamespace,
                serviceNamespace: q.defaultNamespace
            };
            this.codec = new wM1(K), this.serializer = new oZ.HttpInterceptingShapeSerializer(this.codec.createSerializer(), K), this.deserializer = new oZ.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), K)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _),
                Y = Gw.NormalizedSchema.of(q.input);
            if (!z.headers["content-type"]) {
                let A = this.mixin.resolveRestContentType(this.getDefaultContentType(), Y);
                if (A) z.headers["content-type"] = A
            }
            if (z.headers["content-type"] === this.getDefaultContentType()) {
                if (typeof z.body === "string") z.body = '<?xml version="1.0" encoding="UTF-8"?>' + z.body
            }
            return z
        }
        async deserializeResponse(q, K, _) {
            return super.deserializeResponse(q, K, _)
        }
        async handleError(q, K, _, z, Y) {
            let A = T5q(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = Gw.NormalizedSchema.of(O),
                j = z.Error?.message ?? z.Error?.Message ?? z.message ?? z.Message ?? "Unknown",
                J = new(Gw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j);
            await this.deserializeHttpMessage(O, K, _, z);
            let X = {};
            for (let [M, P] of $.structIterator()) {
                let W = P.getMergedTraits().xmlName ?? M,
                    D = z.Error?.[W] ?? z[W];
                X[M] = this.codec.createDeserializer().readSchema(P, D)
            }
            throw this.mixin.decorateServiceException(Object.assign(J, w, {
                $fault: $.getMergedTraits().error,
                message: j
            }, X), z)
        }
        getDefaultContentType() {
            return "application/xml"
        }
    }
    sN3.AwsEc2QueryProtocol = G5q;
    sN3.AwsJson1_0Protocol = W5q;
    sN3.AwsJson1_1Protocol = D5q;
    sN3.AwsJsonRpcProtocol = hW8;
    sN3.AwsQueryProtocol = AM1;
    sN3.AwsRestJsonProtocol = Z5q;
    sN3.AwsRestXmlProtocol = V5q;
    sN3.AwsSmithyRpcV2CborProtocol = X5q;
    sN3.JsonCodec = LW8;
    sN3.JsonShapeDeserializer = zM1;
    sN3.JsonShapeSerializer = YM1;
    sN3.XmlCodec = wM1;
    sN3.XmlShapeDeserializer = RW8;
    sN3.XmlShapeSerializer = OM1;
    sN3._toBool = lN3;
    sN3._toNum = nN3;
    sN3._toStr = cN3;
    sN3.awsExpectUnion = oN3;
    sN3.loadRestJsonErrorCode = _M1;
    sN3.loadRestXmlErrorCode = T5q;
    sN3.parseJsonBody = KM1;
    sN3.parseJsonErrorBody = rN3;
    sN3.parseXmlBody = v5q;
    sN3.parseXmlErrorBody = aN3
})
// @from(Ln 84915, Col 4)
k5q = p((kE3) => {
    var VE3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    kE3.isArrayBuffer = VE3
})
// @from(Ln 84919, Col 4)
jM1 = p((hE3) => {
    var EE3 = k5q(),
        $M1 = d6("buffer"),
        yE3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!EE3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return $M1.Buffer.from(q, K, _)
        },
        LE3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? $M1.Buffer.from(q, K) : $M1.Buffer.from(q)
        };
    hE3.fromArrayBuffer = yE3;
    hE3.fromString = LE3
})
// @from(Ln 84933, Col 4)
y5q = p((N5q) => {
    Object.defineProperty(N5q, "__esModule", {
        value: !0
    });
    N5q.fromBase64 = void 0;
    var CE3 = jM1(),
        bE3 = /^[A-Za-z0-9+/]*={0,2}$/,
        IE3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!bE3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, CE3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    N5q.fromBase64 = IE3
})
// @from(Ln 84948, Col 4)
R5q = p((L5q) => {
    Object.defineProperty(L5q, "__esModule", {
        value: !0
    });
    L5q.toBase64 = void 0;
    var xE3 = jM1(),
        uE3 = nw(),
        mE3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, uE3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, xE3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    L5q.toBase64 = mE3
})
// @from(Ln 84964, Col 4)
SW8 = p((Fc6) => {
    var S5q = y5q(),
        C5q = R5q();
    Object.keys(S5q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Fc6, q)) Object.defineProperty(Fc6, q, {
            enumerable: !0,
            get: function() {
                return S5q[q]
            }
        })
    });
    Object.keys(C5q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Fc6, q)) Object.defineProperty(Fc6, q, {
            enumerable: !0,
            get: function() {
                return C5q[q]
            }
        })
    })
})
// @from(Ln 84984, Col 4)
r5q = p((n5q) => {
    Object.defineProperty(n5q, "__esModule", {
        value: !0
    });
    n5q.ruleSet = void 0;
    var Q5q = "required",
        Wb = "fn",
        Db = "argv",
        xv6 = "ref",
        b5q = !0,
        I5q = "isSet",
        gc6 = "booleanEquals",
        bv6 = "error",
        Iv6 = "endpoint",
        Oo = "tree",
        HM1 = "PartitionResult",
        JM1 = "getAttr",
        x5q = {
            [Q5q]: !1,
            type: "string"
        },
        u5q = {
            [Q5q]: !0,
            default: !1,
            type: "boolean"
        },
        m5q = {
            [xv6]: "Endpoint"
        },
        d5q = {
            [Wb]: gc6,
            [Db]: [{
                [xv6]: "UseFIPS"
            }, !0]
        },
        c5q = {
            [Wb]: gc6,
            [Db]: [{
                [xv6]: "UseDualStack"
            }, !0]
        },
        Pb = {},
        B5q = {
            [Wb]: JM1,
            [Db]: [{
                [xv6]: HM1
            }, "supportsFIPS"]
        },
        l5q = {
            [xv6]: HM1
        },
        p5q = {
            [Wb]: gc6,
            [Db]: [!0, {
                [Wb]: JM1,
                [Db]: [l5q, "supportsDualStack"]
            }]
        },
        F5q = [d5q],
        g5q = [c5q],
        U5q = [{
            [xv6]: "Region"
        }],
        BE3 = {
            version: "1.0",
            parameters: {
                Region: x5q,
                UseDualStack: u5q,
                UseFIPS: u5q,
                Endpoint: x5q
            },
            rules: [{
                conditions: [{
                    [Wb]: I5q,
                    [Db]: [m5q]
                }],
                rules: [{
                    conditions: F5q,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: bv6
                }, {
                    conditions: g5q,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: bv6
                }, {
                    endpoint: {
                        url: m5q,
                        properties: Pb,
                        headers: Pb
                    },
                    type: Iv6
                }],
                type: Oo
            }, {
                conditions: [{
                    [Wb]: I5q,
                    [Db]: U5q
                }],
                rules: [{
                    conditions: [{
                        [Wb]: "aws.partition",
                        [Db]: U5q,
                        assign: HM1
                    }],
                    rules: [{
                        conditions: [d5q, c5q],
                        rules: [{
                            conditions: [{
                                [Wb]: gc6,
                                [Db]: [b5q, B5q]
                            }, p5q],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Pb,
                                    headers: Pb
                                },
                                type: Iv6
                            }],
                            type: Oo
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: bv6
                        }],
                        type: Oo
                    }, {
                        conditions: F5q,
                        rules: [{
                            conditions: [{
                                [Wb]: gc6,
                                [Db]: [B5q, b5q]
                            }],
                            rules: [{
                                conditions: [{
                                    [Wb]: "stringEquals",
                                    [Db]: [{
                                        [Wb]: JM1,
                                        [Db]: [l5q, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://oidc.{Region}.amazonaws.com",
                                    properties: Pb,
                                    headers: Pb
                                },
                                type: Iv6
                            }, {
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: Pb,
                                    headers: Pb
                                },
                                type: Iv6
                            }],
                            type: Oo
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: bv6
                        }],
                        type: Oo
                    }, {
                        conditions: g5q,
                        rules: [{
                            conditions: [p5q],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Pb,
                                    headers: Pb
                                },
                                type: Iv6
                            }],
                            type: Oo
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: bv6
                        }],
                        type: Oo
                    }, {
                        endpoint: {
                            url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
                            properties: Pb,
                            headers: Pb
                        },
                        type: Iv6
                    }],
                    type: Oo
                }],
                type: Oo
            }, {
                error: "Invalid Configuration: Missing Region",
                type: bv6
            }]
        };
    n5q.ruleSet = BE3
})
// @from(Ln 85180, Col 4)
s5q = p((o5q) => {
    Object.defineProperty(o5q, "__esModule", {
        value: !0
    });
    o5q.defaultEndpointResolver = void 0;
    var pE3 = QU(),
        XM1 = dm(),
        FE3 = r5q(),
        gE3 = new XM1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        UE3 = (q, K = {}) => {
            return gE3.get(q, () => (0, XM1.resolveEndpoint)(FE3.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    o5q.defaultEndpointResolver = UE3;
    XM1.customEndpointFunctions.aws = pE3.awsEndpointFunctions
})
// @from(Ln 85201, Col 4)
_3q = p((q3q) => {
    Object.defineProperty(q3q, "__esModule", {
        value: !0
    });
    q3q.getRuntimeConfig = void 0;
    var QE3 = k$(),
        dE3 = Ao(),
        cE3 = FO(),
        lE3 = uV(),
        nE3 = jb(),
        t5q = SW8(),
        e5q = nw(),
        iE3 = aX1(),
        rE3 = s5q(),
        oE3 = (q) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: q?.base64Decoder ?? t5q.fromBase64,
                base64Encoder: q?.base64Encoder ?? t5q.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? rE3.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? iE3.defaultSSOOIDCHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new QE3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new cE3.NoAuthSigner
                }],
                logger: q?.logger ?? new lE3.NoOpLogger,
                protocol: q?.protocol ?? new dE3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.ssooidc"
                }),
                serviceId: q?.serviceId ?? "SSO OIDC",
                urlParser: q?.urlParser ?? nE3.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? e5q.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? e5q.toUtf8
            }
        };
    q3q.getRuntimeConfig = oE3
})
// @from(Ln 85245, Col 4)
wo = p(($y3) => {
    var aE3 = KM(),
        z3q = jE(),
        sE3 = jP(),
        tE3 = "AWS_EXECUTION_ENV",
        Y3q = "AWS_REGION",
        A3q = "AWS_DEFAULT_REGION",
        eE3 = "AWS_EC2_METADATA_DISABLED",
        qy3 = ["in-region", "cross-region", "mobile", "standard", "legacy"],
        Ky3 = "/latest/meta-data/placement/region",
        _y3 = "AWS_DEFAULTS_MODE",
        zy3 = "defaults_mode",
        Yy3 = {
            environmentVariableSelector: (q) => {
                return q[_y3]
            },
            configFileSelector: (q) => {
                return q[zy3]
            },
            default: "legacy"
        },
        Ay3 = ({
            region: q = z3q.loadConfig(aE3.NODE_REGION_CONFIG_OPTIONS),
            defaultsMode: K = z3q.loadConfig(Yy3)
        } = {}) => sE3.memoize(async () => {
            let _ = typeof K === "function" ? await K() : K;
            switch (_?.toLowerCase()) {
                case "auto":
                    return Oy3(q);
                case "in-region":
                case "cross-region":
                case "mobile":
                case "standard":
                case "legacy":
                    return Promise.resolve(_?.toLocaleLowerCase());
                case void 0:
                    return Promise.resolve("legacy");
                default:
                    throw Error(`Invalid parameter for "defaultsMode", expect ${qy3.join(", ")}, got ${_}`)
            }
        }),
        Oy3 = async (q) => {
            if (q) {
                let K = typeof q === "function" ? await q() : q,
                    _ = await wy3();
                if (!_) return "standard";
                if (K === _) return "in-region";
                else return "cross-region"
            }
            return "standard"
        }, wy3 = async () => {
            if (process.env[tE3] && (process.env[Y3q] || process.env[A3q])) return process.env[Y3q] ?? process.env[A3q];
            if (!process.env[eE3]) try {
                let {
                    getInstanceMetadataEndpoint: q,
                    httpRequest: K
                } = await Promise.resolve().then(() => K6(PO6())), _ = await q();
                return (await K({
                    ..._,
                    path: Ky3
                })).toString()
            } catch (q) {}
        };
    $y3.resolveDefaultsModeConfig = Ay3
})
// @from(Ln 85310, Col 4)
X3q = p((H3q) => {
    Object.defineProperty(H3q, "__esModule", {
        value: !0
    });
    H3q.getRuntimeConfig = void 0;
    var Hy3 = IV(),
        Jy3 = Hy3.__importDefault(yW8()),
        O3q = k$(),
        w3q = Ko(),
        CW8 = KM(),
        Xy3 = _o(),
        $3q = rZ(),
        kO6 = jE(),
        j3q = wE(),
        My3 = zo(),
        Py3 = lU(),
        Wy3 = _3q(),
        Dy3 = uV(),
        Zy3 = wo(),
        fy3 = uV(),
        Gy3 = (q) => {
            (0, fy3.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, Zy3.resolveDefaultsModeConfig)(q),
                _ = () => K().then(Dy3.loadConfigsForDefaultMode),
                z = (0, Wy3.getRuntimeConfig)(q);
            (0, O3q.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, kO6.loadConfig)(O3q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? My3.calculateBodyLength,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, w3q.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: Jy3.default.version
                }),
                maxAttempts: q?.maxAttempts ?? (0, kO6.loadConfig)($3q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, kO6.loadConfig)(CW8.NODE_REGION_CONFIG_OPTIONS, {
                    ...CW8.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: j3q.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, kO6.loadConfig)({
                    ...$3q.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || Py3.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? Xy3.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? j3q.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, kO6.loadConfig)(CW8.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, kO6.loadConfig)(CW8.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, kO6.loadConfig)(w3q.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    H3q.getRuntimeConfig = Gy3
})
// @from(Ln 85370, Col 4)
W3q = p((P3q) => {
    Object.defineProperty(P3q, "__esModule", {
        value: !0
    });
    P3q.warning = void 0;
    P3q.stsRegionDefaultResolver = Ty3;
    var M3q = KM(),
        vy3 = jE();

    function Ty3(q = {}) {
        return (0, vy3.loadConfig)({
            ...M3q.NODE_REGION_CONFIG_OPTIONS,
            async default () {
                if (!P3q.warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
                return "us-east-1"
            }
        }, {
            ...M3q.NODE_REGION_CONFIG_FILE_OPTIONS,
            ...q
        })
    }
    P3q.warning = {
        silence: !1
    }
})
// @from(Ln 85395, Col 4)
lm = p((V76) => {
    var Uc6 = KM(),
        D3q = W3q(),
        ky3 = (q) => {
            return {
                setRegion(K) {
                    q.region = K
                },
                region() {
                    return q.region
                }
            }
        },
        Ny3 = (q) => {
            return {
                region: q.region()
            }
        };
    Object.defineProperty(V76, "NODE_REGION_CONFIG_FILE_OPTIONS", {
        enumerable: !0,
        get: function() {
            return Uc6.NODE_REGION_CONFIG_FILE_OPTIONS
        }
    });
    Object.defineProperty(V76, "NODE_REGION_CONFIG_OPTIONS", {
        enumerable: !0,
        get: function() {
            return Uc6.NODE_REGION_CONFIG_OPTIONS
        }
    });
    Object.defineProperty(V76, "REGION_ENV_NAME", {
        enumerable: !0,
        get: function() {
            return Uc6.REGION_ENV_NAME
        }
    });
    Object.defineProperty(V76, "REGION_INI_NAME", {
        enumerable: !0,
        get: function() {
            return Uc6.REGION_INI_NAME
        }
    });
    Object.defineProperty(V76, "resolveRegionConfig", {
        enumerable: !0,
        get: function() {
            return Uc6.resolveRegionConfig
        }
    });
    V76.getAwsRegionExtensionConfiguration = ky3;
    V76.resolveAwsRegionExtensionConfiguration = Ny3;
    Object.keys(D3q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(V76, q)) Object.defineProperty(V76, q, {
            enumerable: !0,
            get: function() {
                return D3q[q]
            }
        })
    })
})
// @from(Ln 85454, Col 4)
IW8 = p((by3) => {
    var Ly3 = QX1(),
        hy3 = (q) => {
            return {
                setHttpHandler(K) {
                    q.httpHandler = K
                },
                httpHandler() {
                    return q.httpHandler
                },
                updateHttpClientConfig(K, _) {
                    q.httpHandler?.updateHttpClientConfig(K, _)
                },
                httpHandlerConfigs() {
                    return q.httpHandler.httpHandlerConfigs()
                }
            }
        },
        Ry3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class Z3q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = Ly3.FieldPosition.HEADER,
            values: _ = []
        }) {
            this.name = q, this.kind = K, this.values = _
        }
        add(q) {
            this.values.push(q)
        }
        set(q) {
            this.values = q
        }
        remove(q) {
            this.values = this.values.filter((K) => K !== q)
        }
        toString() {
            return this.values.map((q) => q.includes(",") || q.includes(" ") ? `"${q}"` : q).join(", ")
        }
        get() {
            return this.values
        }
    }
    class f3q {
        entries = {};
        encoding;
        constructor({
            fields: q = [],
            encoding: K = "utf-8"
        }) {
            q.forEach(this.setField.bind(this)), this.encoding = K
        }
        setField(q) {
            this.entries[q.name.toLowerCase()] = q
        }
        getField(q) {
            return this.entries[q.toLowerCase()]
        }
        removeField(q) {
            delete this.entries[q.toLowerCase()]
        }
        getByType(q) {
            return Object.values(this.entries).filter((K) => K.kind === q)
        }
    }
    class bW8 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(q) {
            this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
        }
        static clone(q) {
            let K = new bW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = Sy3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return bW8.clone(this)
        }
    }

    function Sy3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class G3q {
        statusCode;
        reason;
        headers;
        body;
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    }

    function Cy3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    by3.Field = Z3q;
    by3.Fields = f3q;
    by3.HttpRequest = bW8;
    by3.HttpResponse = G3q;
    by3.getHttpHandlerExtensionConfiguration = hy3;
    by3.isValidHostname = Cy3;
    by3.resolveHttpHandlerRuntimeConfig = Ry3
})
// @from(Ln 85596, Col 4)
GM1 = p((fM1) => {
    var v3q = nr(),
        gy3 = ir(),
        Uy3 = rr(),
        T3q = cU(),
        Qy3 = KM(),
        PM1 = FO(),
        bh = sj(),
        dy3 = qo(),
        y3q = cm(),
        V3q = rZ(),
        k76 = uV(),
        k3q = aX1(),
        cy3 = X3q(),
        N3q = lm(),
        E3q = IW8(),
        ly3 = (q) => {
            return Object.assign(q, {
                useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
                useFipsEndpoint: q.useFipsEndpoint ?? !1,
                defaultSigningName: "sso-oauth"
            })
        },
        ny3 = {
            UseFIPS: {
                type: "builtInParams",
                name: "useFipsEndpoint"
            },
            Endpoint: {
                type: "builtInParams",
                name: "endpoint"
            },
            Region: {
                type: "builtInParams",
                name: "region"
            },
            UseDualStack: {
                type: "builtInParams",
                name: "useDualstackEndpoint"
            }
        },
        iy3 = (q) => {
            let {
                httpAuthSchemes: K,
                httpAuthSchemeProvider: _,
                credentials: z
            } = q;
            return {
                setHttpAuthScheme(Y) {
                    let A = K.findIndex((O) => O.schemeId === Y.schemeId);
                    if (A === -1) K.push(Y);
                    else K.splice(A, 1, Y)
                },
                httpAuthSchemes() {
                    return K
                },
                setHttpAuthSchemeProvider(Y) {
                    _ = Y
                },
                httpAuthSchemeProvider() {
                    return _
                },
                setCredentials(Y) {
                    z = Y
                },
                credentials() {
                    return z
                }
            }
        },
        ry3 = (q) => {
            return {
                httpAuthSchemes: q.httpAuthSchemes(),
                httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
                credentials: q.credentials()
            }
        },
        oy3 = (q, K) => {
            let _ = Object.assign(N3q.getAwsRegionExtensionConfiguration(q), k76.getDefaultExtensionConfiguration(q), E3q.getHttpHandlerExtensionConfiguration(q), iy3(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, N3q.resolveAwsRegionExtensionConfiguration(_), k76.resolveDefaultRuntimeConfig(_), E3q.resolveHttpHandlerRuntimeConfig(_), ry3(_))
        };
    class WM1 extends k76.Client {
        config;
        constructor(...[q]) {
            let K = cy3.getRuntimeConfig(q || {});
            super(K);
            this.initConfig = K;
            let _ = ly3(K),
                z = T3q.resolveUserAgentConfig(_),
                Y = V3q.resolveRetryConfig(z),
                A = Qy3.resolveRegionConfig(Y),
                O = v3q.resolveHostHeaderConfig(A),
                w = y3q.resolveEndpointConfig(O),
                $ = k3q.resolveHttpAuthSchemeConfig(w),
                j = oy3($, q?.extensions || []);
            this.config = j, this.middlewareStack.use(bh.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(T3q.getUserAgentPlugin(this.config)), this.middlewareStack.use(V3q.getRetryPlugin(this.config)), this.middlewareStack.use(dy3.getContentLengthPlugin(this.config)), this.middlewareStack.use(v3q.getHostHeaderPlugin(this.config)), this.middlewareStack.use(gy3.getLoggerPlugin(this.config)), this.middlewareStack.use(Uy3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(PM1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: k3q.defaultSSOOIDCHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new PM1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use(PM1.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var Ih = class q extends k76.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        L3q = class q extends Ih {
            name = "AccessDeniedException";
            $fault = "client";
            error;
            reason;
            error_description;
            constructor(K) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.reason = K.reason, this.error_description = K.error_description
            }
        },
        h3q = class q extends Ih {
            name = "AuthorizationPendingException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "AuthorizationPendingException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        R3q = class q extends Ih {
            name = "ExpiredTokenException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        S3q = class q extends Ih {
            name = "InternalServerException";
            $fault = "server";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        C3q = class q extends Ih {
            name = "InvalidClientException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "InvalidClientException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        b3q = class q extends Ih {
            name = "InvalidGrantException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "InvalidGrantException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        I3q = class q extends Ih {
            name = "InvalidRequestException";
            $fault = "client";
            error;
            reason;
            error_description;
            constructor(K) {
                super({
                    name: "InvalidRequestException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.reason = K.reason, this.error_description = K.error_description
            }
        },
        x3q = class q extends Ih {
            name = "InvalidScopeException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "InvalidScopeException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        u3q = class q extends Ih {
            name = "SlowDownException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "SlowDownException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        m3q = class q extends Ih {
            name = "UnauthorizedClientException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "UnauthorizedClientException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        B3q = class q extends Ih {
            name = "UnsupportedGrantTypeException";
            $fault = "client";
            error;
            error_description;
            constructor(K) {
                super({
                    name: "UnsupportedGrantTypeException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error, this.error_description = K.error_description
            }
        },
        ay3 = "AccessDeniedException",
        sy3 = "AuthorizationPendingException",
        ty3 = "AccessToken",
        ey3 = "ClientSecret",
        qL3 = "CreateToken",
        KL3 = "CreateTokenRequest",
        _L3 = "CreateTokenResponse",
        zL3 = "CodeVerifier",
        YL3 = "ExpiredTokenException",
        AL3 = "InvalidClientException",
        OL3 = "InvalidGrantException",
        wL3 = "InvalidRequestException",
        $L3 = "InternalServerException",
        jL3 = "InvalidScopeException",
        HL3 = "IdToken",
        JL3 = "RefreshToken",
        XL3 = "SlowDownException",
        ML3 = "UnauthorizedClientException",
        PL3 = "UnsupportedGrantTypeException",
        WL3 = "accessToken",
        nU = "client",
        DL3 = "clientId",
        ZL3 = "clientSecret",
        fL3 = "codeVerifier",
        GL3 = "code",
        vL3 = "deviceCode",
        _X = "error",
        TL3 = "expiresIn",
        nm = "error_description",
        VL3 = "grantType",
        kL3 = "http",
        im = "httpError",
        NL3 = "idToken",
        p3q = "reason",
        F3q = "refreshToken",
        EL3 = "redirectUri",
        yL3 = "scope",
        LL3 = "server",
        g3q = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc",
        hL3 = "tokenType",
        gO = "com.amazonaws.ssooidc",
        RL3 = [0, gO, ty3, 8, 0],
        SL3 = [0, gO, ey3, 8, 0],
        CL3 = [0, gO, zL3, 8, 0],
        bL3 = [0, gO, HL3, 8, 0],
        U3q = [0, gO, JL3, 8, 0],
        IL3 = [-3, gO, ay3, {
                [_X]: nU,
                [im]: 400
            },
            [_X, p3q, nm],
            [0, 0, 0]
        ];
    bh.TypeRegistry.for(gO).registerError(IL3, L3q);
    var xL3 = [-3, gO, sy3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(xL3, h3q);
    var uL3 = [3, gO, KL3, 0, [DL3, ZL3, VL3, vL3, GL3, F3q, yL3, EL3, fL3],
            [0, [() => SL3, 0], 0, 0, 0, [() => U3q, 0], 64, 0, [() => CL3, 0]]
        ],
        mL3 = [3, gO, _L3, 0, [WL3, hL3, TL3, F3q, NL3],
            [
                [() => RL3, 0], 0, 1, [() => U3q, 0],
                [() => bL3, 0]
            ]
        ],
        BL3 = [-3, gO, YL3, {
                [_X]: nU,
                [im]: 400
            },
            [_X, nm],
            [0, 0]
        ];
    bh.TypeRegistry.for(gO).registerError(BL3, R3q);
    var pL3 = [-3, gO, $L3, {
            [_X]: LL3,
            [im]: 500
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(pL3, S3q);
    var FL3 = [-3, gO, AL3, {
            [_X]: nU,
            [im]: 401
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(FL3, C3q);
    var gL3 = [-3, gO, OL3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(gL3, b3q);
    var UL3 = [-3, gO, wL3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, p3q, nm],
        [0, 0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(UL3, I3q);
    var QL3 = [-3, gO, jL3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(QL3, x3q);
    var dL3 = [-3, gO, XL3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(dL3, u3q);
    var cL3 = [-3, gO, ML3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(cL3, m3q);
    var lL3 = [-3, gO, PL3, {
            [_X]: nU,
            [im]: 400
        },
        [_X, nm],
        [0, 0]
    ];
    bh.TypeRegistry.for(gO).registerError(lL3, B3q);
    var nL3 = [-3, g3q, "SSOOIDCServiceException", 0, [],
        []
    ];
    bh.TypeRegistry.for(g3q).registerError(nL3, Ih);
    var iL3 = [9, gO, qL3, {
        [kL3]: ["POST", "/token", 200]
    }, () => uL3, () => mL3];
    class DM1 extends k76.Command.classBuilder().ep(ny3).m(function(q, K, _, z) {
        return [y3q.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc(iL3).build() {}
    var rL3 = {
        CreateTokenCommand: DM1
    };
    class ZM1 extends WM1 {}
    k76.createAggregatedClient(rL3, ZM1);
    var oL3 = {
            KMS_ACCESS_DENIED: "KMS_AccessDeniedException"
        },
        aL3 = {
            KMS_DISABLED_KEY: "KMS_DisabledException",
            KMS_INVALID_KEY_USAGE: "KMS_InvalidKeyUsageException",
            KMS_INVALID_STATE: "KMS_InvalidStateException",
            KMS_KEY_NOT_FOUND: "KMS_NotFoundException"
        };
    Object.defineProperty(fM1, "$Command", {
        enumerable: !0,
        get: function() {
            return k76.Command
        }
    });
    Object.defineProperty(fM1, "__Client", {
        enumerable: !0,
        get: function() {
            return k76.Client
        }
    });
    fM1.AccessDeniedException = L3q;
    fM1.AccessDeniedExceptionReason = oL3;
    fM1.AuthorizationPendingException = h3q;
    fM1.CreateTokenCommand = DM1;
    fM1.ExpiredTokenException = R3q;
    fM1.InternalServerException = S3q;
    fM1.InvalidClientException = C3q;
    fM1.InvalidGrantException = b3q;
    fM1.InvalidRequestException = I3q;
    fM1.InvalidRequestExceptionReason = aL3;
    fM1.InvalidScopeException = x3q;
    fM1.SSOOIDC = ZM1;
    fM1.SSOOIDCClient = WM1;
    fM1.SSOOIDCServiceException = Ih;
    fM1.SlowDownException = u3q;
    fM1.UnauthorizedClientException = m3q;
    fM1.UnsupportedGrantTypeException = B3q
})
// @from(Ln 86061, Col 4)
xW8 = p((Eh3) => {
    var Ph3 = $E(),
        Wh3 = $7q(),
        xh = jP(),
        Qc6 = pU(),
        Dh3 = d6("fs"),
        Zh3 = ({
            logger: q,
            signingName: K
        } = {}) => async () => {
            if (q?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !K) throw new xh.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
                logger: q
            });
            let _ = Wh3.getBearerTokenEnvKey(K);
            if (!(_ in process.env)) throw new xh.TokenProviderError(`Token not present in '${_}' environment variable`, {
                logger: q
            });
            let z = {
                token: process.env[_]
            };
            return Ph3.setTokenFeature(z, "BEARER_SERVICE_ENV_VARS", "3"), z
        }, fh3 = 300000, vM1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.", Gh3 = async (q, K = {}) => {
            let {
                SSOOIDCClient: _
            } = await Promise.resolve().then(() => K6(GM1())), z = (A) => K.clientConfig?.[A] ?? K.parentClientConfig?.[A];
            return new _(Object.assign({}, K.clientConfig ?? {}, {
                region: q ?? K.clientConfig?.region,
                logger: z("logger"),
                userAgentAppId: z("userAgentAppId")
            }))
        }, vh3 = async (q, K, _ = {}) => {
            let {
                CreateTokenCommand: z
            } = await Promise.resolve().then(() => K6(GM1()));
            return (await Gh3(K, _)).send(new z({
                clientId: q.clientId,
                clientSecret: q.clientSecret,
                refreshToken: q.refreshToken,
                grantType: "refresh_token"
            }))
        }, Q3q = (q) => {
            if (q.expiration && q.expiration.getTime() < Date.now()) throw new xh.TokenProviderError(`Token is expired. ${vM1}`, !1)
        }, NO6 = (q, K, _ = !1) => {
            if (typeof K > "u") throw new xh.TokenProviderError(`Value not present for '${q}' in SSO Token${_?". Cannot refresh":""}. ${vM1}`, !1)
        }, {
            writeFile: Th3
        } = Dh3.promises, Vh3 = (q, K) => {
            let _ = Qc6.getSSOTokenFilepath(q),
                z = JSON.stringify(K, null, 2);
            return Th3(_, z)
        }, d3q = new Date(0), c3q = (q = {}) => async ({
            callerClientConfig: K
        } = {}) => {
            let _ = {
                ...q,
                parentClientConfig: {
                    ...K,
                    ...q.parentClientConfig
                }
            };
            _.logger?.debug("@aws-sdk/token-providers - fromSso");
            let z = await Qc6.parseKnownFiles(_),
                Y = Qc6.getProfileName({
                    profile: _.profile ?? K?.profile
                }),
                A = z[Y];
            if (!A) throw new xh.TokenProviderError(`Profile '${Y}' could not be found in shared credentials file.`, !1);
            else if (!A.sso_session) throw new xh.TokenProviderError(`Profile '${Y}' is missing required property 'sso_session'.`);
            let O = A.sso_session,
                $ = (await Qc6.loadSsoSessionData(_))[O];
            if (!$) throw new xh.TokenProviderError(`Sso session '${O}' could not be found in shared credentials file.`, !1);
            for (let P of ["sso_start_url", "sso_region"])
                if (!$[P]) throw new xh.TokenProviderError(`Sso session '${O}' is missing required property '${P}'.`, !1);
            $.sso_start_url;
            let j = $.sso_region,
                H;
            try {
                H = await Qc6.getSSOTokenFromFile(O)
            } catch (P) {
                throw new xh.TokenProviderError(`The SSO session token associated with profile=${Y} was not found or is invalid. ${vM1}`, !1)
            }
            NO6("accessToken", H.accessToken), NO6("expiresAt", H.expiresAt);
            let {
                accessToken: J,
                expiresAt: X
            } = H, M = {
                token: J,
                expiration: new Date(X)
            };
            if (M.expiration.getTime() - Date.now() > fh3) return M;
            if (Date.now() - d3q.getTime() < 30000) return Q3q(M), M;
            NO6("clientId", H.clientId, !0), NO6("clientSecret", H.clientSecret, !0), NO6("refreshToken", H.refreshToken, !0);
            try {
                d3q.setTime(Date.now());
                let P = await vh3(H, j, _);
                NO6("accessToken", P.accessToken), NO6("expiresIn", P.expiresIn);
                let W = new Date(Date.now() + P.expiresIn * 1000);
                try {
                    await Vh3(O, {
                        ...H,
                        accessToken: P.accessToken,
                        expiresAt: W.toISOString(),
                        refreshToken: P.refreshToken
                    })
                } catch (D) {}
                return {
                    token: P.accessToken,
                    expiration: W
                }
            } catch (P) {
                return Q3q(M), M
            }
        }, kh3 = ({
            token: q,
            logger: K
        }) => async () => {
            if (K?.debug("@aws-sdk/token-providers - fromStatic"), !q || !q.token) throw new xh.TokenProviderError("Please pass a valid token to fromStatic", !1);
            return q
        }, Nh3 = (q = {}) => xh.memoize(xh.chain(c3q(q), async () => {
            throw new xh.TokenProviderError("Could not load token from any providers", !1)
        }), (K) => K.expiration !== void 0 && K.expiration.getTime() - Date.now() < 300000, (K) => K.expiration !== void 0);
    Eh3.fromEnvSigningName = Zh3;
    Eh3.fromSso = c3q;
    Eh3.fromStatic = kh3;
    Eh3.nodeProvider = Nh3
})
// @from(Ln 86187, Col 4)
LM1 = p((uh3) => {
    uh3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(uh3.HttpAuthLocation || (uh3.HttpAuthLocation = {}));
    uh3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(uh3.HttpApiKeyAuthLocation || (uh3.HttpApiKeyAuthLocation = {}));
    uh3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(uh3.EndpointURLScheme || (uh3.EndpointURLScheme = {}));
    uh3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(uh3.AlgorithmId || (uh3.AlgorithmId = {}));
    var Sh3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => uh3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => uh3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        Ch3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        bh3 = (q) => {
            return Sh3(q)
        },
        Ih3 = (q) => {
            return Ch3(q)
        };
    uh3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(uh3.FieldPosition || (uh3.FieldPosition = {}));
    var xh3 = "__smithy_context";
    uh3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(uh3.IniSectionType || (uh3.IniSectionType = {}));
    uh3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(uh3.RequestHandlerProtocol || (uh3.RequestHandlerProtocol = {}));
    uh3.SMITHY_CONTEXT_KEY = xh3;
    uh3.getDefaultClientConfiguration = bh3;
    uh3.resolveDefaultRuntimeConfig = Ih3
})