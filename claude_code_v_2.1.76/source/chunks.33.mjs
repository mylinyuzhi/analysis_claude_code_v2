
// @from(Ln 79592, Col 4)
RQ = x((rz5) => {
    var GiA = le1(),
        b_ = dO(),
        LQ = te1(),
        EP = pT(),
        UD = FT(),
        TS6 = q68(),
        TiA = C_(),
        by = z68();
    class yj6 {
        queryCompat;
        constructor(A = !1) {
            this.queryCompat = A
        }
        resolveRestContentType(A, q) {
            let K = q.getMemberSchemas(),
                Y = Object.values(K).find((z) => {
                    return !!z.getMergedTraits().httpPayload
                });
            if (Y) {
                let z = Y.getMergedTraits().mediaType;
                if (z) return z;
                else if (Y.isStringSchema()) return "text/plain";
                else if (Y.isBlobSchema()) return "application/octet-stream";
                else return A
            } else if (!q.isUnitSchema()) {
                if (Object.values(K).find((_) => {
                        let {
                            httpQuery: w,
                            httpQueryParams: O,
                            httpHeader: $,
                            httpLabel: H,
                            httpPrefixHeaders: j
                        } = _.getMergedTraits();
                        return !w && !O && !$ && !H && j === void 0
                    })) return A
            }
        }
        async getErrorSchemaOrThrowBaseException(A, q, K, Y, z, _) {
            let w = q,
                O = A;
            if (A.includes("#"))[w, O] = A.split("#");
            let $ = {
                    $metadata: z,
                    $fault: K.statusCode < 500 ? "client" : "server"
                },
                H = b_.TypeRegistry.for(w);
            try {
                return {
                    errorSchema: _?.(H, O) ?? H.getSchema(A),
                    errorMetadata: $
                }
            } catch (j) {
                Y.message = Y.message ?? Y.Message ?? "UnknownError";
                let J = b_.TypeRegistry.for("smithy.ts.sdk.synthetic." + w),
                    M = J.getBaseException();
                if (M) {
                    let D = J.getErrorCtor(M) ?? Error;
                    throw this.decorateServiceException(Object.assign(new D({
                        name: O
                    }), $), Y)
                }
                throw this.decorateServiceException(Object.assign(Error(O), $), Y)
            }
        }
        decorateServiceException(A, q = {}) {
            if (this.queryCompat) {
                let K = A.Message ?? q.Message,
                    Y = LQ.decorateServiceException(A, q);
                if (K) Y.Message = K, Y.message = K;
                return Y
            }
            return LQ.decorateServiceException(A, q)
        }
        setQueryCompatError(A, q) {
            let K = q.headers?.["x-amzn-query-error"];
            if (A !== void 0 && K != null) {
                let [Y, z] = K.split(";"), _ = Object.entries(A), w = {
                    Code: Y,
                    Type: z
                };
                Object.assign(A, w);
                for (let [O, $] of _) w[O] = $;
                delete w.__type, A.Error = w
            }
        }
        queryCompatOutput(A, q) {
            if (A.Error) q.Error = A.Error;
            if (A.Type) q.Type = A.Type;
            if (A.Code) q.Code = A.Code
        }
    }
    class viA extends GiA.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: A,
            awsQueryCompatible: q
        }) {
            super({
                defaultNamespace: A
            });
            this.awsQueryCompatible = !!q, this.mixin = new yj6(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            return Y
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let _ = GiA.loadSmithyRpcV2CborErrorCode(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = b_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(b_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H),
                M = {};
            for (let [D, X] of $.structIterator()) M[D] = this.deserializer.readValue(X, Y[D]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, M);
            throw this.mixin.decorateServiceException(Object.assign(J, O, {
                $fault: $.getMergedTraits().error,
                message: H
            }, M), Y)
        }
    }
    var Qz5 = (A) => {
            if (A == null) return A;
            if (typeof A === "number" || typeof A === "bigint") {
                let q = Error(`Received number ${A} where a string was expected.`);
                return q.name = "Warning", console.warn(q), String(A)
            }
            if (typeof A === "boolean") {
                let q = Error(`Received boolean ${A} where a string was expected.`);
                return q.name = "Warning", console.warn(q), String(A)
            }
            return A
        },
        Uz5 = (A) => {
            if (A == null) return A;
            if (typeof A === "string") {
                let q = A.toLowerCase();
                if (A !== "" && q !== "false" && q !== "true") {
                    let K = Error(`Received string "${A}" where a boolean was expected.`);
                    K.name = "Warning", console.warn(K)
                }
                return A !== "" && q !== "false"
            }
            return A
        },
        dz5 = (A) => {
            if (A == null) return A;
            if (typeof A === "string") {
                let q = Number(A);
                if (q.toString() !== A) {
                    let K = Error(`Received string "${A}" where a number was expected.`);
                    return K.name = "Warning", console.warn(K), A
                }
                return q
            }
            return A
        };
    class sr {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }

    function cz5(A, q, K) {
        if (K?.source) {
            let Y = K.source;
            if (typeof q === "number") {
                if (q > Number.MAX_SAFE_INTEGER || q < Number.MIN_SAFE_INTEGER || Y !== String(q))
                    if (Y.includes(".")) return new UD.NumericValue(Y, "bigDecimal");
                    else return BigInt(Y)
            }
        }
        return q
    }
    var NiA = (A, q) => LQ.collectBody(A, q).then((K) => (q?.utf8Encoder ?? TiA.toUtf8)(K)),
        M18 = (A, q) => NiA(A, q).then((K) => {
            if (K.length) try {
                return JSON.parse(K)
            } catch (Y) {
                if (Y?.name === "SyntaxError") Object.defineProperty(Y, "$responseBodyText", {
                    value: K
                });
                throw Y
            }
            return {}
        }),
        lz5 = async (A, q) => {
            let K = await M18(A, q);
            return K.message = K.message ?? K.Message, K
        }, D18 = (A, q) => {
            let K = (_, w) => Object.keys(_).find((O) => O.toLowerCase() === w.toLowerCase()),
                Y = (_) => {
                    let w = _;
                    if (typeof w === "number") w = w.toString();
                    if (w.indexOf(",") >= 0) w = w.split(",")[0];
                    if (w.indexOf(":") >= 0) w = w.split(":")[0];
                    if (w.indexOf("#") >= 0) w = w.split("#")[1];
                    return w
                },
                z = K(A.headers, "x-amzn-errortype");
            if (z !== void 0) return Y(A.headers[z]);
            if (q && typeof q === "object") {
                let _ = K(q, "code");
                if (_ && q[_] !== void 0) return Y(q[_]);
                if (q.__type !== void 0) return Y(q.__type)
            }
        };
    class X18 extends sr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        async read(A, q) {
            return this._read(A, typeof q === "string" ? JSON.parse(q, cz5) : await M18(q, this.serdeContext))
        }
        readObject(A, q) {
            return this._read(A, q)
        }
        _read(A, q) {
            let K = q !== null && typeof q === "object",
                Y = b_.NormalizedSchema.of(A);
            if (Y.isListSchema() && Array.isArray(q)) {
                let _ = Y.getValueSchema(),
                    w = [],
                    O = !!Y.getMergedTraits().sparse;
                for (let $ of q)
                    if (O || $ != null) w.push(this._read(_, $));
                return w
            } else if (Y.isMapSchema() && K) {
                let _ = Y.getValueSchema(),
                    w = {},
                    O = !!Y.getMergedTraits().sparse;
                for (let [$, H] of Object.entries(q))
                    if (O || H != null) w[$] = this._read(_, H);
                return w
            } else if (Y.isStructSchema() && K) {
                let _ = {};
                for (let [w, O] of Y.structIterator()) {
                    let $ = this.settings.jsonName ? O.getMergedTraits().jsonName ?? w : w,
                        H = this._read(O, q[$]);
                    if (H != null) _[w] = H
                }
                return _
            }
            if (Y.isBlobSchema() && typeof q === "string") return TS6.fromBase64(q);
            let z = Y.getMergedTraits().mediaType;
            if (Y.isStringSchema() && typeof q === "string" && z) {
                if (z === "application/json" || z.endsWith("+json")) return UD.LazyJsonString.from(q)
            }
            if (Y.isTimestampSchema() && q != null) switch (EP.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return UD.parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return UD.parseRfc7231DateTime(q);
                case 7:
                    return UD.parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (Y.isBigIntegerSchema() && (typeof q === "number" || typeof q === "string")) return BigInt(q);
            if (Y.isBigDecimalSchema() && q != null) {
                if (q instanceof UD.NumericValue) return q;
                let _ = q;
                if (_.type === "bigDecimal" && "string" in _) return new UD.NumericValue(_.string, _.type);
                return new UD.NumericValue(String(q), "bigDecimal")
            }
            if (Y.isNumericSchema() && typeof q === "string") switch (q) {
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                case "NaN":
                    return NaN
            }
            if (Y.isDocumentSchema())
                if (K) {
                    let _ = Array.isArray(q) ? [] : {};
                    for (let [w, O] of Object.entries(q))
                        if (O instanceof UD.NumericValue) _[w] = O;
                        else _[w] = this._read(Y, O);
                    return _
                } else return structuredClone(q);
            return q
        }
    }
    var fiA = String.fromCharCode(925);
    class ViA {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (A, q) => {
                if (q instanceof UD.NumericValue) {
                    let K = `${fiA+"nv"+this.counter++}_` + q.string;
                    return this.values.set(`"${K}"`, q.string), K
                }
                if (typeof q === "bigint") {
                    let K = q.toString(),
                        Y = `${fiA+"b"+this.counter++}_` + K;
                    return this.values.set(`"${Y}"`, K), Y
                }
                return q
            }
        }
        replaceInJson(A) {
            if (this.stage === 0) throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            if (this.stage = 2, this.counter === 0) return A;
            for (let [q, K] of this.values) A = A.replace(q, K);
            return A
        }
    }
    class P18 extends sr {
        settings;
        buffer;
        rootSchema;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            this.rootSchema = b_.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, q)
        }
        writeDiscriminatedDocument(A, q) {
            if (this.write(A, q), typeof this.buffer === "object") this.buffer.__type = b_.NormalizedSchema.of(A).getName(!0)
        }
        flush() {
            let {
                rootSchema: A
            } = this;
            if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
                let q = new ViA;
                return q.replaceInJson(JSON.stringify(this.buffer, q.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(A, q, K) {
            let Y = q !== null && typeof q === "object",
                z = b_.NormalizedSchema.of(A);
            if (z.isListSchema() && Array.isArray(q)) {
                let _ = z.getValueSchema(),
                    w = [],
                    O = !!z.getMergedTraits().sparse;
                for (let $ of q)
                    if (O || $ != null) w.push(this._write(_, $));
                return w
            } else if (z.isMapSchema() && Y) {
                let _ = z.getValueSchema(),
                    w = {},
                    O = !!z.getMergedTraits().sparse;
                for (let [$, H] of Object.entries(q))
                    if (O || H != null) w[$] = this._write(_, H);
                return w
            } else if (z.isStructSchema() && Y) {
                let _ = {};
                for (let [w, O] of z.structIterator()) {
                    let $ = this.settings.jsonName ? O.getMergedTraits().jsonName ?? w : w,
                        H = this._write(O, q[w], z);
                    if (H !== void 0) _[$] = H
                }
                return _
            }
            if (q === null && K?.isStructSchema()) return;
            if (z.isBlobSchema() && (q instanceof Uint8Array || typeof q === "string") || z.isDocumentSchema() && q instanceof Uint8Array) {
                if (z === this.rootSchema) return q;
                return (this.serdeContext?.base64Encoder ?? TS6.toBase64)(q)
            }
            if ((z.isTimestampSchema() || z.isDocumentSchema()) && q instanceof Date) switch (EP.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return q.toISOString().replace(".000Z", "Z");
                case 6:
                    return UD.dateToUtcString(q);
                case 7:
                    return q.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", q), q.getTime() / 1000
            }
            if (z.isNumericSchema() && typeof q === "number") {
                if (Math.abs(q) === 1 / 0 || isNaN(q)) return String(q)
            }
            if (z.isStringSchema()) {
                if (typeof q > "u" && z.isIdempotencyToken()) return UD.generateIdempotencyToken();
                let _ = z.getMergedTraits().mediaType;
                if (q != null && _) {
                    if (_ === "application/json" || _.endsWith("+json")) return UD.LazyJsonString.from(q)
                }
            }
            if (z.isDocumentSchema())
                if (Y) {
                    let _ = Array.isArray(q) ? [] : {};
                    for (let [w, O] of Object.entries(q))
                        if (O instanceof UD.NumericValue) _[w] = O;
                        else _[w] = this._write(z, O);
                    return _
                } else return structuredClone(q);
            return q
        }
    }
    class rq1 extends sr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new P18(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new X18(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class oq1 extends EP.RpcProtocol {
        serializer;
        deserializer;
        serviceTarget;
        codec;
        mixin;
        awsQueryCompatible;
        constructor({
            defaultNamespace: A,
            serviceTarget: q,
            awsQueryCompatible: K
        }) {
            super({
                defaultNamespace: A
            });
            this.serviceTarget = q, this.codec = new rq1({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!K, this.mixin = new yj6(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (!Y.path.endsWith("/")) Y.path += "/";
            if (Object.assign(Y.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${A.name}`
                }), this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            if (b_.deref(A.input) === "unit" || !Y.body) Y.body = "{}";
            return Y
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let _ = D18(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = b_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(b_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H),
                M = {};
            for (let [D, X] of $.structIterator()) {
                let P = X.getMergedTraits().jsonName ?? D;
                M[D] = this.codec.createDeserializer().readObject(X, Y[P])
            }
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, M);
            throw this.mixin.decorateServiceException(Object.assign(J, O, {
                $fault: $.getMergedTraits().error,
                message: H
            }, M), Y)
        }
    }
    class kiA extends oq1 {
        constructor({
            defaultNamespace: A,
            serviceTarget: q,
            awsQueryCompatible: K
        }) {
            super({
                defaultNamespace: A,
                serviceTarget: q,
                awsQueryCompatible: K
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
    class EiA extends oq1 {
        constructor({
            defaultNamespace: A,
            serviceTarget: q,
            awsQueryCompatible: K
        }) {
            super({
                defaultNamespace: A,
                serviceTarget: q,
                awsQueryCompatible: K
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
    class yiA extends EP.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new yj6;
        constructor({
            defaultNamespace: A
        }) {
            super({
                defaultNamespace: A
            });
            let q = {
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                httpBindings: !0,
                jsonName: !0
            };
            this.codec = new rq1(q), this.serializer = new EP.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new EP.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
        }
        getShapeId() {
            return "aws.protocols#restJson1"
        }
        getPayloadCodec() {
            return this.codec
        }
        setSerdeContext(A) {
            this.codec.setSerdeContext(A), super.setSerdeContext(A)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K),
                z = b_.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let _ = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (_) Y.headers["content-type"] = _
            }
            if (Y.body == null && Y.headers["content-type"] === this.getDefaultContentType()) Y.body = "{}";
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = await super.deserializeResponse(A, q, K),
                z = b_.NormalizedSchema.of(A.output);
            for (let [_, w] of z.structIterator())
                if (w.getMemberTraits().httpPayload && !(_ in Y)) Y[_] = null;
            return Y
        }
        async handleError(A, q, K, Y, z) {
            let _ = D18(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = b_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(b_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H);
            await this.deserializeHttpMessage(w, q, K, Y);
            let M = {};
            for (let [D, X] of $.structIterator()) {
                let P = X.getMergedTraits().jsonName ?? D;
                M[D] = this.codec.createDeserializer().readObject(X, Y[P])
            }
            throw this.mixin.decorateServiceException(Object.assign(J, O, {
                $fault: $.getMergedTraits().error,
                message: H
            }, M), Y)
        }
        getDefaultContentType() {
            return "application/json"
        }
    }
    var iz5 = (A) => {
        if (A == null) return;
        if (typeof A === "object" && "__type" in A) delete A.__type;
        return LQ.expectUnion(A)
    };
    class aq1 extends sr {
        settings;
        stringDeserializer;
        constructor(A) {
            super();
            this.settings = A, this.stringDeserializer = new EP.FromStringShapeDeserializer(A)
        }
        setSerdeContext(A) {
            this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
        }
        read(A, q, K) {
            let Y = b_.NormalizedSchema.of(A),
                z = Y.getMemberSchemas();
            if (Y.isStructSchema() && Y.isMemberSchema() && !!Object.values(z).find(($) => {
                    return !!$.getMemberTraits().eventPayload
                })) {
                let $ = {},
                    H = Object.keys(z)[0];
                if (z[H].isBlobSchema()) $[H] = q;
                else $[H] = this.read(z[H], q);
                return $
            }
            let w = (this.serdeContext?.utf8Encoder ?? TiA.toUtf8)(q),
                O = this.parseXml(w);
            return this.readSchema(A, K ? O[K] : O)
        }
        readSchema(A, q) {
            let K = b_.NormalizedSchema.of(A);
            if (K.isUnitSchema()) return;
            let Y = K.getMergedTraits();
            if (K.isListSchema() && !Array.isArray(q)) return this.readSchema(K, [q]);
            if (q == null) return q;
            if (typeof q === "object") {
                let z = !!Y.sparse,
                    _ = !!Y.xmlFlattened;
                if (K.isListSchema()) {
                    let O = K.getValueSchema(),
                        $ = [],
                        H = O.getMergedTraits().xmlName ?? "member",
                        j = _ ? q : (q[0] ?? q)[H],
                        J = Array.isArray(j) ? j : [j];
                    for (let M of J)
                        if (M != null || z) $.push(this.readSchema(O, M));
                    return $
                }
                let w = {};
                if (K.isMapSchema()) {
                    let O = K.getKeySchema(),
                        $ = K.getValueSchema(),
                        H;
                    if (_) H = Array.isArray(q) ? q : [q];
                    else H = Array.isArray(q.entry) ? q.entry : [q.entry];
                    let j = O.getMergedTraits().xmlName ?? "key",
                        J = $.getMergedTraits().xmlName ?? "value";
                    for (let M of H) {
                        let D = M[j],
                            X = M[J];
                        if (X != null || z) w[D] = this.readSchema($, X)
                    }
                    return w
                }
                if (K.isStructSchema()) {
                    for (let [O, $] of K.structIterator()) {
                        let H = $.getMergedTraits(),
                            j = !H.httpPayload ? $.getMemberTraits().xmlName ?? O : H.xmlName ?? $.getName();
                        if (q[j] != null) w[O] = this.readSchema($, q[j])
                    }
                    return w
                }
                if (K.isDocumentSchema()) return q;
                throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${K.getName(!0)}`)
            }
            if (K.isListSchema()) return [];
            if (K.isMapSchema() || K.isStructSchema()) return {};
            return this.stringDeserializer.read(K, q)
        }
        parseXml(A) {
            if (A.length) {
                let q;
                try {
                    q = by.parseXML(A)
                } catch (_) {
                    if (_ && typeof _ === "object") Object.defineProperty(_, "$responseBodyText", {
                        value: A
                    });
                    throw _
                }
                let K = "#text",
                    Y = Object.keys(q)[0],
                    z = q[Y];
                if (z[K]) z[Y] = z[K], delete z[K];
                return LQ.getValueFromTextNode(z)
            }
            return {}
        }
    }
    class LiA extends sr {
        settings;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q, K = "") {
            if (this.buffer === void 0) this.buffer = "";
            let Y = b_.NormalizedSchema.of(A);
            if (K && !K.endsWith(".")) K += ".";
            if (Y.isBlobSchema()) {
                if (typeof q === "string" || q instanceof Uint8Array) this.writeKey(K), this.writeValue((this.serdeContext?.base64Encoder ?? TS6.toBase64)(q))
            } else if (Y.isBooleanSchema() || Y.isNumericSchema() || Y.isStringSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q));
                else if (Y.isIdempotencyToken()) this.writeKey(K), this.writeValue(UD.generateIdempotencyToken())
            } else if (Y.isBigIntegerSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q))
            } else if (Y.isBigDecimalSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(q instanceof UD.NumericValue ? q.string : String(q))
            } else if (Y.isTimestampSchema()) {
                if (q instanceof Date) switch (this.writeKey(K), EP.determineTimestampFormat(Y, this.settings)) {
                    case 5:
                        this.writeValue(q.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(LQ.dateToUtcString(q));
                        break;
                    case 7:
                        this.writeValue(String(q.getTime() / 1000));
                        break
                }
            } else if (Y.isDocumentSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${Y.getName(!0)}`);
            else if (Y.isListSchema()) {
                if (Array.isArray(q))
                    if (q.length === 0) {
                        if (this.settings.serializeEmptyLists) this.writeKey(K), this.writeValue("")
                    } else {
                        let z = Y.getValueSchema(),
                            _ = this.settings.flattenLists || Y.getMergedTraits().xmlFlattened,
                            w = 1;
                        for (let O of q) {
                            if (O == null) continue;
                            let $ = this.getKey("member", z.getMergedTraits().xmlName),
                                H = _ ? `${K}${w}` : `${K}${$}.${w}`;
                            this.write(z, O, H), ++w
                        }
                    }
            } else if (Y.isMapSchema()) {
                if (q && typeof q === "object") {
                    let z = Y.getKeySchema(),
                        _ = Y.getValueSchema(),
                        w = Y.getMergedTraits().xmlFlattened,
                        O = 1;
                    for (let [$, H] of Object.entries(q)) {
                        if (H == null) continue;
                        let j = this.getKey("key", z.getMergedTraits().xmlName),
                            J = w ? `${K}${O}.${j}` : `${K}entry.${O}.${j}`,
                            M = this.getKey("value", _.getMergedTraits().xmlName),
                            D = w ? `${K}${O}.${M}` : `${K}entry.${O}.${M}`;
                        this.write(z, $, J), this.write(_, H, D), ++O
                    }
                }
            } else if (Y.isStructSchema()) {
                if (q && typeof q === "object")
                    for (let [z, _] of Y.structIterator()) {
                        if (q[z] == null && !_.isIdempotencyToken()) continue;
                        let w = this.getKey(z, _.getMergedTraits().xmlName),
                            O = `${K}${w}`;
                        this.write(_, q[z], O)
                    }
            } else if (Y.isUnitSchema());
            else throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${Y.getName(!0)}`)
        }
        flush() {
            if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
            let A = this.buffer;
            return delete this.buffer, A
        }
        getKey(A, q) {
            let K = q ?? A;
            if (this.settings.capitalizeKeys) return K[0].toUpperCase() + K.slice(1);
            return K
        }
        writeKey(A) {
            if (A.endsWith(".")) A = A.slice(0, A.length - 1);
            this.buffer += `&${EP.extendedEncodeURIComponent(A)}=`
        }
        writeValue(A) {
            this.buffer += EP.extendedEncodeURIComponent(A)
        }
    }
    class W18 extends EP.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new yj6;
        constructor(A) {
            super({
                defaultNamespace: A.defaultNamespace
            });
            this.options = A;
            let q = {
                timestampFormat: {
                    useTrait: !0,
                    default: 5
                },
                httpBindings: !1,
                xmlNamespace: A.xmlNamespace,
                serviceNamespace: A.defaultNamespace,
                serializeEmptyLists: !0
            };
            this.serializer = new LiA(q), this.deserializer = new aq1(q)
        }
        getShapeId() {
            return "aws.protocols#awsQuery"
        }
        setSerdeContext(A) {
            this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A)
        }
        getPayloadCodec() {
            throw Error("AWSQuery protocol has no payload codec.")
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (!Y.path.endsWith("/")) Y.path += "/";
            if (Object.assign(Y.headers, {
                    "content-type": "application/x-www-form-urlencoded"
                }), b_.deref(A.input) === "unit" || !Y.body) Y.body = "";
            let z = A.name.split("#")[1] ?? A.name;
            if (Y.body = `Action=${z}&Version=${this.options.version}` + Y.body, Y.body.endsWith("&")) Y.body = Y.body.slice(-1);
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = b_.NormalizedSchema.of(A.output),
                _ = {};
            if (K.statusCode >= 300) {
                let j = await EP.collectBody(K.body, q);
                if (j.byteLength > 0) Object.assign(_, await Y.read(15, j));
                await this.handleError(A, q, K, _, this.deserializeMetadata(K))
            }
            for (let j in K.headers) {
                let J = K.headers[j];
                delete K.headers[j], K.headers[j.toLowerCase()] = J
            }
            let w = A.name.split("#")[1] ?? A.name,
                O = z.isStructSchema() && this.useNestedResult() ? w + "Result" : void 0,
                $ = await EP.collectBody(K.body, q);
            if ($.byteLength > 0) Object.assign(_, await Y.read(z, $, O));
            return {
                $metadata: this.deserializeMetadata(K),
                ..._
            }
        }
        useNestedResult() {
            return !0
        }
        async handleError(A, q, K, Y, z) {
            let _ = this.loadQueryErrorCode(K, Y) ?? "Unknown",
                w = this.loadQueryError(Y),
                O = this.loadQueryErrorMessage(Y);
            w.message = O, w.Error = {
                Type: w.Type,
                Code: w.Code,
                Message: O
            };
            let {
                errorSchema: $,
                errorMetadata: H
            } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, w, z, (X, P) => {
                try {
                    return X.getSchema(P)
                } catch (W) {
                    return X.find((Z) => b_.NormalizedSchema.of(Z).getMergedTraits().awsQueryError?.[0] === P)
                }
            }), j = b_.NormalizedSchema.of($), M = new(b_.TypeRegistry.for($[1]).getErrorCtor($) ?? Error)(O), D = {
                Error: w.Error
            };
            for (let [X, P] of j.structIterator()) {
                let W = P.getMergedTraits().xmlName ?? X,
                    Z = w[W] ?? Y[W];
                D[X] = this.deserializer.readSchema(P, Z)
            }
            throw this.mixin.decorateServiceException(Object.assign(M, H, {
                $fault: j.getMergedTraits().error,
                message: O
            }, D), Y)
        }
        loadQueryErrorCode(A, q) {
            let K = (q.Errors?.[0]?.Error ?? q.Errors?.Error ?? q.Error)?.Code;
            if (K !== void 0) return K;
            if (A.statusCode == 404) return "NotFound"
        }
        loadQueryError(A) {
            return A.Errors?.[0]?.Error ?? A.Errors?.Error ?? A.Error
        }
        loadQueryErrorMessage(A) {
            let q = this.loadQueryError(A);
            return q?.message ?? q?.Message ?? A.message ?? A.Message ?? "Unknown"
        }
        getDefaultContentType() {
            return "application/x-www-form-urlencoded"
        }
    }
    class RiA extends W18 {
        options;
        constructor(A) {
            super(A);
            this.options = A;
            let q = {
                capitalizeKeys: !0,
                flattenLists: !0,
                serializeEmptyLists: !1
            };
            Object.assign(this.serializer.settings, q)
        }
        useNestedResult() {
            return !1
        }
    }
    var hiA = (A, q) => NiA(A, q).then((K) => {
            if (K.length) {
                let Y;
                try {
                    Y = by.parseXML(K)
                } catch (O) {
                    if (O && typeof O === "object") Object.defineProperty(O, "$responseBodyText", {
                        value: K
                    });
                    throw O
                }
                let z = "#text",
                    _ = Object.keys(Y)[0],
                    w = Y[_];
                if (w[z]) w[_] = w[z], delete w[z];
                return LQ.getValueFromTextNode(w)
            }
            return {}
        }),
        nz5 = async (A, q) => {
            let K = await hiA(A, q);
            if (K.Error) K.Error.message = K.Error.message ?? K.Error.Message;
            return K
        }, SiA = (A, q) => {
            if (q?.Error?.Code !== void 0) return q.Error.Code;
            if (q?.Code !== void 0) return q.Code;
            if (A.statusCode == 404) return "NotFound"
        };
    class Z18 extends sr {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = b_.NormalizedSchema.of(A);
            if (K.isStringSchema() && typeof q === "string") this.stringBuffer = q;
            else if (K.isBlobSchema()) this.byteBuffer = "byteLength" in q ? q : (this.serdeContext?.base64Decoder ?? TS6.fromBase64)(q);
            else {
                this.buffer = this.writeStruct(K, q, void 0);
                let Y = K.getMergedTraits();
                if (Y.httpPayload && !Y.xmlName) this.buffer.withName(K.getName())
            }
        }
        flush() {
            if (this.byteBuffer !== void 0) {
                let q = this.byteBuffer;
                return delete this.byteBuffer, q
            }
            if (this.stringBuffer !== void 0) {
                let q = this.stringBuffer;
                return delete this.stringBuffer, q
            }
            let A = this.buffer;
            if (this.settings.xmlNamespace) {
                if (!A?.attributes?.xmlns) A.addAttribute("xmlns", this.settings.xmlNamespace)
            }
            return delete this.buffer, A.toString()
        }
        writeStruct(A, q, K) {
            let Y = A.getMergedTraits(),
                z = A.isMemberSchema() && !Y.httpPayload ? A.getMemberTraits().xmlName ?? A.getMemberName() : Y.xmlName ?? A.getName();
            if (!z || !A.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${A.getName(!0)}.`);
            let _ = by.XmlNode.of(z),
                [w, O] = this.getXmlnsAttribute(A, K);
            for (let [$, H] of A.structIterator()) {
                let j = q[$];
                if (j != null || H.isIdempotencyToken()) {
                    if (H.getMergedTraits().xmlAttribute) {
                        _.addAttribute(H.getMergedTraits().xmlName ?? $, this.writeSimple(H, j));
                        continue
                    }
                    if (H.isListSchema()) this.writeList(H, j, _, O);
                    else if (H.isMapSchema()) this.writeMap(H, j, _, O);
                    else if (H.isStructSchema()) _.addChildNode(this.writeStruct(H, j, O));
                    else {
                        let J = by.XmlNode.of(H.getMergedTraits().xmlName ?? H.getMemberName());
                        this.writeSimpleInto(H, j, J, O), _.addChildNode(J)
                    }
                }
            }
            if (O) _.addAttribute(w, O);
            return _
        }
        writeList(A, q, K, Y) {
            if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
            let z = A.getMergedTraits(),
                _ = A.getValueSchema(),
                w = _.getMergedTraits(),
                O = !!w.sparse,
                $ = !!z.xmlFlattened,
                [H, j] = this.getXmlnsAttribute(A, Y),
                J = (M, D) => {
                    if (_.isListSchema()) this.writeList(_, Array.isArray(D) ? D : [D], M, j);
                    else if (_.isMapSchema()) this.writeMap(_, D, M, j);
                    else if (_.isStructSchema()) {
                        let X = this.writeStruct(_, D, j);
                        M.addChildNode(X.withName($ ? z.xmlName ?? A.getMemberName() : w.xmlName ?? "member"))
                    } else {
                        let X = by.XmlNode.of($ ? z.xmlName ?? A.getMemberName() : w.xmlName ?? "member");
                        this.writeSimpleInto(_, D, X, j), M.addChildNode(X)
                    }
                };
            if ($) {
                for (let M of q)
                    if (O || M != null) J(K, M)
            } else {
                let M = by.XmlNode.of(z.xmlName ?? A.getMemberName());
                if (j) M.addAttribute(H, j);
                for (let D of q)
                    if (O || D != null) J(M, D);
                K.addChildNode(M)
            }
        }
        writeMap(A, q, K, Y, z = !1) {
            if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
            let _ = A.getMergedTraits(),
                w = A.getKeySchema(),
                $ = w.getMergedTraits().xmlName ?? "key",
                H = A.getValueSchema(),
                j = H.getMergedTraits(),
                J = j.xmlName ?? "value",
                M = !!j.sparse,
                D = !!_.xmlFlattened,
                [X, P] = this.getXmlnsAttribute(A, Y),
                W = (Z, G, f) => {
                    let v = by.XmlNode.of($, G),
                        [N, V] = this.getXmlnsAttribute(w, P);
                    if (V) v.addAttribute(N, V);
                    Z.addChildNode(v);
                    let L = by.XmlNode.of(J);
                    if (H.isListSchema()) this.writeList(H, f, L, P);
                    else if (H.isMapSchema()) this.writeMap(H, f, L, P, !0);
                    else if (H.isStructSchema()) L = this.writeStruct(H, f, P);
                    else this.writeSimpleInto(H, f, L, P);
                    Z.addChildNode(L)
                };
            if (D) {
                for (let [Z, G] of Object.entries(q))
                    if (M || G != null) {
                        let f = by.XmlNode.of(_.xmlName ?? A.getMemberName());
                        W(f, Z, G), K.addChildNode(f)
                    }
            } else {
                let Z;
                if (!z) {
                    if (Z = by.XmlNode.of(_.xmlName ?? A.getMemberName()), P) Z.addAttribute(X, P);
                    K.addChildNode(Z)
                }
                for (let [G, f] of Object.entries(q))
                    if (M || f != null) {
                        let v = by.XmlNode.of("entry");
                        W(v, G, f), (z ? K : Z).addChildNode(v)
                    }
            }
        }
        writeSimple(A, q) {
            if (q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let K = b_.NormalizedSchema.of(A),
                Y = null;
            if (q && typeof q === "object")
                if (K.isBlobSchema()) Y = (this.serdeContext?.base64Encoder ?? TS6.toBase64)(q);
                else if (K.isTimestampSchema() && q instanceof Date) switch (EP.determineTimestampFormat(K, this.settings)) {
                case 5:
                    Y = q.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    Y = LQ.dateToUtcString(q);
                    break;
                case 7:
                    Y = String(q.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", q), Y = LQ.dateToUtcString(q);
                    break
            } else if (K.isBigDecimalSchema() && q) {
                if (q instanceof UD.NumericValue) return q.string;
                return String(q)
            } else if (K.isMapSchema() || K.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${K.getName(!0)}`);
            if (K.isBooleanSchema() || K.isNumericSchema() || K.isBigIntegerSchema() || K.isBigDecimalSchema()) Y = String(q);
            if (K.isStringSchema())
                if (q === void 0 && K.isIdempotencyToken()) Y = UD.generateIdempotencyToken();
                else Y = String(q);
            if (Y === null) throw Error(`Unhandled schema-value pair ${K.getName(!0)}=${q}`);
            return Y
        }
        writeSimpleInto(A, q, K, Y) {
            let z = this.writeSimple(A, q),
                _ = b_.NormalizedSchema.of(A),
                w = new by.XmlText(z),
                [O, $] = this.getXmlnsAttribute(_, Y);
            if ($) K.addAttribute(O, $);
            K.addChildNode(w)
        }
        getXmlnsAttribute(A, q) {
            let K = A.getMergedTraits(),
                [Y, z] = K.xmlNamespace ?? [];
            if (z && z !== q) return [Y ? `xmlns:${Y}` : "xmlns", z];
            return [void 0, void 0]
        }
    }
    class G18 extends sr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new Z18(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new aq1(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class CiA extends EP.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new yj6;
        constructor(A) {
            super(A);
            let q = {
                timestampFormat: {
                    useTrait: !0,
                    default: 5
                },
                httpBindings: !0,
                xmlNamespace: A.xmlNamespace,
                serviceNamespace: A.defaultNamespace
            };
            this.codec = new G18(q), this.serializer = new EP.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new EP.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K),
                z = b_.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let _ = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (_) Y.headers["content-type"] = _
            }
            if (Y.headers["content-type"] === this.getDefaultContentType()) {
                if (typeof Y.body === "string") Y.body = '<?xml version="1.0" encoding="UTF-8"?>' + Y.body
            }
            return Y
        }
        async deserializeResponse(A, q, K) {
            return super.deserializeResponse(A, q, K)
        }
        async handleError(A, q, K, Y, z) {
            let _ = SiA(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = b_.NormalizedSchema.of(w),
                H = Y.Error?.message ?? Y.Error?.Message ?? Y.message ?? Y.Message ?? "Unknown",
                J = new(b_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H);
            await this.deserializeHttpMessage(w, q, K, Y);
            let M = {};
            for (let [D, X] of $.structIterator()) {
                let P = X.getMergedTraits().xmlName ?? D,
                    W = Y.Error?.[P] ?? Y[P];
                M[D] = this.codec.createDeserializer().readSchema(X, W)
            }
            throw this.mixin.decorateServiceException(Object.assign(J, O, {
                $fault: $.getMergedTraits().error,
                message: H
            }, M), Y)
        }
        getDefaultContentType() {
            return "application/xml"
        }
    }
    rz5.AwsEc2QueryProtocol = RiA;
    rz5.AwsJson1_0Protocol = kiA;
    rz5.AwsJson1_1Protocol = EiA;
    rz5.AwsJsonRpcProtocol = oq1;
    rz5.AwsQueryProtocol = W18;
    rz5.AwsRestJsonProtocol = yiA;
    rz5.AwsRestXmlProtocol = CiA;
    rz5.AwsSmithyRpcV2CborProtocol = viA;
    rz5.JsonCodec = rq1;
    rz5.JsonShapeDeserializer = X18;
    rz5.JsonShapeSerializer = P18;
    rz5.XmlCodec = G18;
    rz5.XmlShapeDeserializer = aq1;
    rz5.XmlShapeSerializer = Z18;
    rz5._toBool = Uz5;
    rz5._toNum = dz5;
    rz5._toStr = Qz5;
    rz5.awsExpectUnion = iz5;
    rz5.loadRestJsonErrorCode = D18;
    rz5.loadRestXmlErrorCode = SiA;
    rz5.parseJsonBody = M18;
    rz5.parseJsonErrorBody = lz5;
    rz5.parseXmlBody = hiA;
    rz5.parseXmlErrorBody = nz5
})
// @from(Ln 80820, Col 4)
IiA = x((T_5) => {
    var f_5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    T_5.isArrayBuffer = f_5
})
// @from(Ln 80824, Col 4)
T18 = x((E_5) => {
    var N_5 = IiA(),
        f18 = x6("buffer"),
        V_5 = (A, q = 0, K = A.byteLength - q) => {
            if (!N_5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return f18.Buffer.from(A, q, K)
        },
        k_5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? f18.Buffer.from(A, q) : f18.Buffer.from(A)
        };
    E_5.fromArrayBuffer = V_5;
    E_5.fromString = k_5
})
// @from(Ln 80838, Col 4)
uiA = x((biA) => {
    Object.defineProperty(biA, "__esModule", {
        value: !0
    });
    biA.fromBase64 = void 0;
    var R_5 = T18(),
        h_5 = /^[A-Za-z0-9+/]*={0,2}$/,
        S_5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!h_5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, R_5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    biA.fromBase64 = S_5
})
// @from(Ln 80853, Col 4)
giA = x((miA) => {
    Object.defineProperty(miA, "__esModule", {
        value: !0
    });
    miA.toBase64 = void 0;
    var C_5 = T18(),
        I_5 = C_(),
        b_5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, I_5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, C_5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    miA.toBase64 = b_5
})
// @from(Ln 80869, Col 4)
sq1 = x((vS6) => {
    var FiA = uiA(),
        piA = giA();
    Object.keys(FiA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(vS6, A)) Object.defineProperty(vS6, A, {
            enumerable: !0,
            get: function() {
                return FiA[A]
            }
        })
    });
    Object.keys(piA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(vS6, A)) Object.defineProperty(vS6, A, {
            enumerable: !0,
            get: function() {
                return piA[A]
            }
        })
    })
})
// @from(Ln 80889, Col 4)
YnA = x((qnA) => {
    Object.defineProperty(qnA, "__esModule", {
        value: !0
    });
    qnA.ruleSet = void 0;
    var siA = "required",
        uy = "fn",
        my = "argv",
        hj6 = "ref",
        QiA = !0,
        UiA = "isSet",
        NS6 = "booleanEquals",
        Lj6 = "error",
        Rj6 = "endpoint",
        hQ = "tree",
        v18 = "PartitionResult",
        N18 = "getAttr",
        diA = {
            [siA]: !1,
            type: "string"
        },
        ciA = {
            [siA]: !0,
            default: !1,
            type: "boolean"
        },
        liA = {
            [hj6]: "Endpoint"
        },
        tiA = {
            [uy]: NS6,
            [my]: [{
                [hj6]: "UseFIPS"
            }, !0]
        },
        eiA = {
            [uy]: NS6,
            [my]: [{
                [hj6]: "UseDualStack"
            }, !0]
        },
        xy = {},
        iiA = {
            [uy]: N18,
            [my]: [{
                [hj6]: v18
            }, "supportsFIPS"]
        },
        AnA = {
            [hj6]: v18
        },
        niA = {
            [uy]: NS6,
            [my]: [!0, {
                [uy]: N18,
                [my]: [AnA, "supportsDualStack"]
            }]
        },
        riA = [tiA],
        oiA = [eiA],
        aiA = [{
            [hj6]: "Region"
        }],
        x_5 = {
            version: "1.0",
            parameters: {
                Region: diA,
                UseDualStack: ciA,
                UseFIPS: ciA,
                Endpoint: diA
            },
            rules: [{
                conditions: [{
                    [uy]: UiA,
                    [my]: [liA]
                }],
                rules: [{
                    conditions: riA,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: Lj6
                }, {
                    conditions: oiA,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: Lj6
                }, {
                    endpoint: {
                        url: liA,
                        properties: xy,
                        headers: xy
                    },
                    type: Rj6
                }],
                type: hQ
            }, {
                conditions: [{
                    [uy]: UiA,
                    [my]: aiA
                }],
                rules: [{
                    conditions: [{
                        [uy]: "aws.partition",
                        [my]: aiA,
                        assign: v18
                    }],
                    rules: [{
                        conditions: [tiA, eiA],
                        rules: [{
                            conditions: [{
                                [uy]: NS6,
                                [my]: [QiA, iiA]
                            }, niA],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: xy,
                                    headers: xy
                                },
                                type: Rj6
                            }],
                            type: hQ
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: Lj6
                        }],
                        type: hQ
                    }, {
                        conditions: riA,
                        rules: [{
                            conditions: [{
                                [uy]: NS6,
                                [my]: [iiA, QiA]
                            }],
                            rules: [{
                                conditions: [{
                                    [uy]: "stringEquals",
                                    [my]: [{
                                        [uy]: N18,
                                        [my]: [AnA, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://oidc.{Region}.amazonaws.com",
                                    properties: xy,
                                    headers: xy
                                },
                                type: Rj6
                            }, {
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: xy,
                                    headers: xy
                                },
                                type: Rj6
                            }],
                            type: hQ
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: Lj6
                        }],
                        type: hQ
                    }, {
                        conditions: oiA,
                        rules: [{
                            conditions: [niA],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: xy,
                                    headers: xy
                                },
                                type: Rj6
                            }],
                            type: hQ
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: Lj6
                        }],
                        type: hQ
                    }, {
                        endpoint: {
                            url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
                            properties: xy,
                            headers: xy
                        },
                        type: Rj6
                    }],
                    type: hQ
                }],
                type: hQ
            }, {
                error: "Invalid Configuration: Missing Region",
                type: Lj6
            }]
        };
    qnA.ruleSet = x_5
})
// @from(Ln 81085, Col 4)
wnA = x((znA) => {
    Object.defineProperty(znA, "__esModule", {
        value: !0
    });
    znA.defaultEndpointResolver = void 0;
    var u_5 = Zu(),
        V18 = nS(),
        m_5 = YnA(),
        B_5 = new V18.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        g_5 = (A, q = {}) => {
            return B_5.get(A, () => (0, V18.resolveEndpoint)(m_5.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    znA.defaultEndpointResolver = g_5;
    V18.customEndpointFunctions.aws = u_5.awsEndpointFunctions
})
// @from(Ln 81106, Col 4)
JnA = x((HnA) => {
    Object.defineProperty(HnA, "__esModule", {
        value: !0
    });
    HnA.getRuntimeConfig = void 0;
    var F_5 = Nw(),
        p_5 = RQ(),
        Q_5 = w_(),
        U_5 = fG(),
        d_5 = hy(),
        OnA = sq1(),
        $nA = C_(),
        c_5 = O18(),
        l_5 = wnA(),
        i_5 = (A) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: A?.base64Decoder ?? OnA.fromBase64,
                base64Encoder: A?.base64Encoder ?? OnA.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? l_5.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? c_5.defaultSSOOIDCHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new F_5.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new Q_5.NoAuthSigner
                }],
                logger: A?.logger ?? new U_5.NoOpLogger,
                protocol: A?.protocol ?? new p_5.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.ssooidc"
                }),
                serviceId: A?.serviceId ?? "SSO OIDC",
                urlParser: A?.urlParser ?? d_5.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? $nA.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? $nA.toUtf8
            }
        };
    HnA.getRuntimeConfig = i_5
})
// @from(Ln 81150, Col 4)
SQ = x((_25) => {
    var n_5 = Nj(),
        MnA = BT(),
        r_5 = vJ(),
        o_5 = "AWS_EXECUTION_ENV",
        DnA = "AWS_REGION",
        XnA = "AWS_DEFAULT_REGION",
        a_5 = "AWS_EC2_METADATA_DISABLED",
        s_5 = ["in-region", "cross-region", "mobile", "standard", "legacy"],
        t_5 = "/latest/meta-data/placement/region",
        e_5 = "AWS_DEFAULTS_MODE",
        A25 = "defaults_mode",
        q25 = {
            environmentVariableSelector: (A) => {
                return A[e_5]
            },
            configFileSelector: (A) => {
                return A[A25]
            },
            default: "legacy"
        },
        K25 = ({
            region: A = MnA.loadConfig(n_5.NODE_REGION_CONFIG_OPTIONS),
            defaultsMode: q = MnA.loadConfig(q25)
        } = {}) => r_5.memoize(async () => {
            let K = typeof q === "function" ? await q() : q;
            switch (K?.toLowerCase()) {
                case "auto":
                    return Y25(A);
                case "in-region":
                case "cross-region":
                case "mobile":
                case "standard":
                case "legacy":
                    return Promise.resolve(K?.toLocaleLowerCase());
                case void 0:
                    return Promise.resolve("legacy");
                default:
                    throw Error(`Invalid parameter for "defaultsMode", expect ${s_5.join(", ")}, got ${K}`)
            }
        }),
        Y25 = async (A) => {
            if (A) {
                let q = typeof A === "function" ? await A() : A,
                    K = await z25();
                if (!K) return "standard";
                if (q === K) return "in-region";
                else return "cross-region"
            }
            return "standard"
        }, z25 = async () => {
            if (process.env[o_5] && (process.env[DnA] || process.env[XnA])) return process.env[DnA] ?? process.env[XnA];
            if (!process.env[a_5]) try {
                let {
                    getInstanceMetadataEndpoint: A,
                    httpRequest: q
                } = await Promise.resolve().then(() => t(o76())), K = await A();
                return (await q({
                    ...K,
                    path: t_5
                })).toString()
            } catch (A) {}
        };
    _25.resolveDefaultsModeConfig = K25
})
// @from(Ln 81215, Col 4)
vnA = x((fnA) => {
    Object.defineProperty(fnA, "__esModule", {
        value: !0
    });
    fnA.getRuntimeConfig = void 0;
    var O25 = _2(),
        $25 = O25.__importDefault(nq1()),
        PnA = Nw(),
        WnA = kQ(),
        tq1 = Nj(),
        H25 = EQ(),
        ZnA = kP(),
        Y46 = BT(),
        GnA = uT(),
        j25 = yQ(),
        J25 = Tu(),
        M25 = JnA(),
        D25 = fG(),
        X25 = SQ(),
        P25 = fG(),
        W25 = (A) => {
            (0, P25.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, X25.resolveDefaultsModeConfig)(A),
                K = () => q().then(D25.loadConfigsForDefaultMode),
                Y = (0, M25.getRuntimeConfig)(A);
            (0, PnA.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, Y46.loadConfig)(PnA.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? j25.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, WnA.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: $25.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, Y46.loadConfig)(ZnA.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, Y46.loadConfig)(tq1.NODE_REGION_CONFIG_OPTIONS, {
                    ...tq1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: GnA.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, Y46.loadConfig)({
                    ...ZnA.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || J25.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? H25.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? GnA.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Y46.loadConfig)(tq1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, Y46.loadConfig)(tq1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, Y46.loadConfig)(WnA.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    fnA.getRuntimeConfig = W25
})
// @from(Ln 81275, Col 4)
knA = x((VnA) => {
    Object.defineProperty(VnA, "__esModule", {
        value: !0
    });
    VnA.warning = void 0;
    VnA.stsRegionDefaultResolver = G25;
    var NnA = Nj(),
        Z25 = BT();

    function G25(A = {}) {
        return (0, Z25.loadConfig)({
            ...NnA.NODE_REGION_CONFIG_OPTIONS,
            async default () {
                if (!VnA.warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
                return "us-east-1"
            }
        }, {
            ...NnA.NODE_REGION_CONFIG_FILE_OPTIONS,
            ...A
        })
    }
    VnA.warning = {
        silence: !1
    }
})
// @from(Ln 81300, Col 4)
oS = x((tr) => {
    var VS6 = Nj(),
        EnA = knA(),
        T25 = (A) => {
            return {
                setRegion(q) {
                    A.region = q
                },
                region() {
                    return A.region
                }
            }
        },
        v25 = (A) => {
            return {
                region: A.region()
            }
        };
    Object.defineProperty(tr, "NODE_REGION_CONFIG_FILE_OPTIONS", {
        enumerable: !0,
        get: function() {
            return VS6.NODE_REGION_CONFIG_FILE_OPTIONS
        }
    });
    Object.defineProperty(tr, "NODE_REGION_CONFIG_OPTIONS", {
        enumerable: !0,
        get: function() {
            return VS6.NODE_REGION_CONFIG_OPTIONS
        }
    });
    Object.defineProperty(tr, "REGION_ENV_NAME", {
        enumerable: !0,
        get: function() {
            return VS6.REGION_ENV_NAME
        }
    });
    Object.defineProperty(tr, "REGION_INI_NAME", {
        enumerable: !0,
        get: function() {
            return VS6.REGION_INI_NAME
        }
    });
    Object.defineProperty(tr, "resolveRegionConfig", {
        enumerable: !0,
        get: function() {
            return VS6.resolveRegionConfig
        }
    });
    tr.getAwsRegionExtensionConfiguration = T25;
    tr.resolveAwsRegionExtensionConfiguration = v25;
    Object.keys(EnA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(tr, A)) Object.defineProperty(tr, A, {
            enumerable: !0,
            get: function() {
                return EnA[A]
            }
        })
    })
})
// @from(Ln 81359, Col 4)
AK1 = x((h25) => {
    var k25 = e68(),
        E25 = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        y25 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class ynA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = k25.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class LnA {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class eq1 {
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
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new eq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = L25(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return eq1.clone(this)
        }
    }

    function L25(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class RnA {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function R25(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    h25.Field = ynA;
    h25.Fields = LnA;
    h25.HttpRequest = eq1;
    h25.HttpResponse = RnA;
    h25.getHttpHandlerExtensionConfiguration = E25;
    h25.isValidHostname = R25;
    h25.resolveHttpHandlerRuntimeConfig = y25
})
// @from(Ln 81501, Col 4)
S18 = x((h18) => {
    var hnA = PQ(),
        B25 = WQ(),
        g25 = ZQ(),
        SnA = fu(),
        F25 = Nj(),
        E18 = w_(),
        gV = dO(),
        p25 = VQ(),
        unA = rS(),
        CnA = kP(),
        er = fG(),
        InA = O18(),
        Q25 = vnA(),
        bnA = oS(),
        xnA = AK1(),
        U25 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "sso-oauth"
            })
        },
        d25 = {
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
        c25 = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let _ = q.findIndex((w) => w.schemeId === z.schemeId);
                    if (_ === -1) q.push(z);
                    else q.splice(_, 1, z)
                },
                httpAuthSchemes() {
                    return q
                },
                setHttpAuthSchemeProvider(z) {
                    K = z
                },
                httpAuthSchemeProvider() {
                    return K
                },
                setCredentials(z) {
                    Y = z
                },
                credentials() {
                    return Y
                }
            }
        },
        l25 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        i25 = (A, q) => {
            let K = Object.assign(bnA.getAwsRegionExtensionConfiguration(A), er.getDefaultExtensionConfiguration(A), xnA.getHttpHandlerExtensionConfiguration(A), c25(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, bnA.resolveAwsRegionExtensionConfiguration(K), er.resolveDefaultRuntimeConfig(K), xnA.resolveHttpHandlerRuntimeConfig(K), l25(K))
        };
    class y18 extends er.Client {
        config;
        constructor(...[A]) {
            let q = Q25.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = U25(q),
                Y = SnA.resolveUserAgentConfig(K),
                z = CnA.resolveRetryConfig(Y),
                _ = F25.resolveRegionConfig(z),
                w = hnA.resolveHostHeaderConfig(_),
                O = unA.resolveEndpointConfig(w),
                $ = InA.resolveHttpAuthSchemeConfig(O),
                H = i25($, A?.extensions || []);
            this.config = H, this.middlewareStack.use(gV.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(SnA.getUserAgentPlugin(this.config)), this.middlewareStack.use(CnA.getRetryPlugin(this.config)), this.middlewareStack.use(p25.getContentLengthPlugin(this.config)), this.middlewareStack.use(hnA.getHostHeaderPlugin(this.config)), this.middlewareStack.use(B25.getLoggerPlugin(this.config)), this.middlewareStack.use(g25.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(E18.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: InA.defaultSSOOIDCHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new E18.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use(E18.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var FV = class A extends er.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        mnA = class A extends FV {
            name = "AccessDeniedException";
            $fault = "client";
            error;
            reason;
            error_description;
            constructor(q) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.reason = q.reason, this.error_description = q.error_description
            }
        },
        BnA = class A extends FV {
            name = "AuthorizationPendingException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "AuthorizationPendingException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        gnA = class A extends FV {
            name = "ExpiredTokenException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "ExpiredTokenException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        FnA = class A extends FV {
            name = "InternalServerException";
            $fault = "server";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        pnA = class A extends FV {
            name = "InvalidClientException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "InvalidClientException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        QnA = class A extends FV {
            name = "InvalidGrantException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "InvalidGrantException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        UnA = class A extends FV {
            name = "InvalidRequestException";
            $fault = "client";
            error;
            reason;
            error_description;
            constructor(q) {
                super({
                    name: "InvalidRequestException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.reason = q.reason, this.error_description = q.error_description
            }
        },
        dnA = class A extends FV {
            name = "InvalidScopeException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "InvalidScopeException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        cnA = class A extends FV {
            name = "SlowDownException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "SlowDownException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        lnA = class A extends FV {
            name = "UnauthorizedClientException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "UnauthorizedClientException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        inA = class A extends FV {
            name = "UnsupportedGrantTypeException";
            $fault = "client";
            error;
            error_description;
            constructor(q) {
                super({
                    name: "UnsupportedGrantTypeException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error, this.error_description = q.error_description
            }
        },
        n25 = "AccessDeniedException",
        r25 = "AuthorizationPendingException",
        o25 = "AccessToken",
        a25 = "ClientSecret",
        s25 = "CreateToken",
        t25 = "CreateTokenRequest",
        e25 = "CreateTokenResponse",
        Aw5 = "CodeVerifier",
        qw5 = "ExpiredTokenException",
        Kw5 = "InvalidClientException",
        Yw5 = "InvalidGrantException",
        zw5 = "InvalidRequestException",
        _w5 = "InternalServerException",
        ww5 = "InvalidScopeException",
        Ow5 = "IdToken",
        $w5 = "RefreshToken",
        Hw5 = "SlowDownException",
        jw5 = "UnauthorizedClientException",
        Jw5 = "UnsupportedGrantTypeException",
        Mw5 = "accessToken",
        vu = "client",
        Dw5 = "clientId",
        Xw5 = "clientSecret",
        Pw5 = "codeVerifier",
        Ww5 = "code",
        Zw5 = "deviceCode",
        hH = "error",
        Gw5 = "expiresIn",
        aS = "error_description",
        fw5 = "grantType",
        Tw5 = "http",
        sS = "httpError",
        vw5 = "idToken",
        nnA = "reason",
        rnA = "refreshToken",
        Nw5 = "redirectUri",
        Vw5 = "scope",
        kw5 = "server",
        onA = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc",
        Ew5 = "tokenType",
        O_ = "com.amazonaws.ssooidc",
        yw5 = [0, O_, o25, 8, 0],
        Lw5 = [0, O_, a25, 8, 0],
        Rw5 = [0, O_, Aw5, 8, 0],
        hw5 = [0, O_, Ow5, 8, 0],
        anA = [0, O_, $w5, 8, 0],
        Sw5 = [-3, O_, n25, {
                [hH]: vu,
                [sS]: 400
            },
            [hH, nnA, aS],
            [0, 0, 0]
        ];
    gV.TypeRegistry.for(O_).registerError(Sw5, mnA);
    var Cw5 = [-3, O_, r25, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(Cw5, BnA);
    var Iw5 = [3, O_, t25, 0, [Dw5, Xw5, fw5, Zw5, Ww5, rnA, Vw5, Nw5, Pw5],
            [0, [() => Lw5, 0], 0, 0, 0, [() => anA, 0], 64, 0, [() => Rw5, 0]]
        ],
        bw5 = [3, O_, e25, 0, [Mw5, Ew5, Gw5, rnA, vw5],
            [
                [() => yw5, 0], 0, 1, [() => anA, 0],
                [() => hw5, 0]
            ]
        ],
        xw5 = [-3, O_, qw5, {
                [hH]: vu,
                [sS]: 400
            },
            [hH, aS],
            [0, 0]
        ];
    gV.TypeRegistry.for(O_).registerError(xw5, gnA);
    var uw5 = [-3, O_, _w5, {
            [hH]: kw5,
            [sS]: 500
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(uw5, FnA);
    var mw5 = [-3, O_, Kw5, {
            [hH]: vu,
            [sS]: 401
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(mw5, pnA);
    var Bw5 = [-3, O_, Yw5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(Bw5, QnA);
    var gw5 = [-3, O_, zw5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, nnA, aS],
        [0, 0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(gw5, UnA);
    var Fw5 = [-3, O_, ww5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(Fw5, dnA);
    var pw5 = [-3, O_, Hw5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(pw5, cnA);
    var Qw5 = [-3, O_, jw5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(Qw5, lnA);
    var Uw5 = [-3, O_, Jw5, {
            [hH]: vu,
            [sS]: 400
        },
        [hH, aS],
        [0, 0]
    ];
    gV.TypeRegistry.for(O_).registerError(Uw5, inA);
    var dw5 = [-3, onA, "SSOOIDCServiceException", 0, [],
        []
    ];
    gV.TypeRegistry.for(onA).registerError(dw5, FV);
    var cw5 = [9, O_, s25, {
        [Tw5]: ["POST", "/token", 200]
    }, () => Iw5, () => bw5];
    class L18 extends er.Command.classBuilder().ep(d25).m(function(A, q, K, Y) {
        return [unA.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc(cw5).build() {}
    var lw5 = {
        CreateTokenCommand: L18
    };
    class R18 extends y18 {}
    er.createAggregatedClient(lw5, R18);
    var iw5 = {
            KMS_ACCESS_DENIED: "KMS_AccessDeniedException"
        },
        nw5 = {
            KMS_DISABLED_KEY: "KMS_DisabledException",
            KMS_INVALID_KEY_USAGE: "KMS_InvalidKeyUsageException",
            KMS_INVALID_STATE: "KMS_InvalidStateException",
            KMS_KEY_NOT_FOUND: "KMS_NotFoundException"
        };
    Object.defineProperty(h18, "$Command", {
        enumerable: !0,
        get: function() {
            return er.Command
        }
    });
    Object.defineProperty(h18, "__Client", {
        enumerable: !0,
        get: function() {
            return er.Client
        }
    });
    h18.AccessDeniedException = mnA;
    h18.AccessDeniedExceptionReason = iw5;
    h18.AuthorizationPendingException = BnA;
    h18.CreateTokenCommand = L18;
    h18.ExpiredTokenException = gnA;
    h18.InternalServerException = FnA;
    h18.InvalidClientException = pnA;
    h18.InvalidGrantException = QnA;
    h18.InvalidRequestException = UnA;
    h18.InvalidRequestExceptionReason = nw5;
    h18.InvalidScopeException = dnA;
    h18.SSOOIDC = R18;
    h18.SSOOIDCClient = y18;
    h18.SSOOIDCServiceException = FV;
    h18.SlowDownException = cnA;
    h18.UnauthorizedClientException = lnA;
    h18.UnsupportedGrantTypeException = inA
})
// @from(Ln 81966, Col 4)
qK1 = x((NO5) => {
    var JO5 = mT(),
        MO5 = ZUA(),
        pV = vJ(),
        kS6 = Du(),
        DO5 = x6("fs"),
        XO5 = ({
            logger: A,
            signingName: q
        } = {}) => async () => {
            if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !q) throw new pV.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
                logger: A
            });
            let K = MO5.getBearerTokenEnvKey(q);
            if (!(K in process.env)) throw new pV.TokenProviderError(`Token not present in '${K}' environment variable`, {
                logger: A
            });
            let Y = {
                token: process.env[K]
            };
            return JO5.setTokenFeature(Y, "BEARER_SERVICE_ENV_VARS", "3"), Y
        }, PO5 = 300000, C18 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.", WO5 = async (A, q = {}) => {
            let {
                SSOOIDCClient: K
            } = await Promise.resolve().then(() => t(S18())), Y = (_) => q.clientConfig?.[_] ?? q.parentClientConfig?.[_];
            return new K(Object.assign({}, q.clientConfig ?? {}, {
                region: A ?? q.clientConfig?.region,
                logger: Y("logger"),
                userAgentAppId: Y("userAgentAppId")
            }))
        }, ZO5 = async (A, q, K = {}) => {
            let {
                CreateTokenCommand: Y
            } = await Promise.resolve().then(() => t(S18()));
            return (await WO5(q, K)).send(new Y({
                clientId: A.clientId,
                clientSecret: A.clientSecret,
                refreshToken: A.refreshToken,
                grantType: "refresh_token"
            }))
        }, snA = (A) => {
            if (A.expiration && A.expiration.getTime() < Date.now()) throw new pV.TokenProviderError(`Token is expired. ${C18}`, !1)
        }, z46 = (A, q, K = !1) => {
            if (typeof q > "u") throw new pV.TokenProviderError(`Value not present for '${A}' in SSO Token${K?". Cannot refresh":""}. ${C18}`, !1)
        }, {
            writeFile: GO5
        } = DO5.promises, fO5 = (A, q) => {
            let K = kS6.getSSOTokenFilepath(A),
                Y = JSON.stringify(q, null, 2);
            return GO5(K, Y)
        }, tnA = new Date(0), enA = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            let K = {
                ...A,
                parentClientConfig: {
                    ...q,
                    ...A.parentClientConfig
                }
            };
            K.logger?.debug("@aws-sdk/token-providers - fromSso");
            let Y = await kS6.parseKnownFiles(K),
                z = kS6.getProfileName({
                    profile: K.profile ?? q?.profile
                }),
                _ = Y[z];
            if (!_) throw new pV.TokenProviderError(`Profile '${z}' could not be found in shared credentials file.`, !1);
            else if (!_.sso_session) throw new pV.TokenProviderError(`Profile '${z}' is missing required property 'sso_session'.`);
            let w = _.sso_session,
                $ = (await kS6.loadSsoSessionData(K))[w];
            if (!$) throw new pV.TokenProviderError(`Sso session '${w}' could not be found in shared credentials file.`, !1);
            for (let X of ["sso_start_url", "sso_region"])
                if (!$[X]) throw new pV.TokenProviderError(`Sso session '${w}' is missing required property '${X}'.`, !1);
            $.sso_start_url;
            let H = $.sso_region,
                j;
            try {
                j = await kS6.getSSOTokenFromFile(w)
            } catch (X) {
                throw new pV.TokenProviderError(`The SSO session token associated with profile=${z} was not found or is invalid. ${C18}`, !1)
            }
            z46("accessToken", j.accessToken), z46("expiresAt", j.expiresAt);
            let {
                accessToken: J,
                expiresAt: M
            } = j, D = {
                token: J,
                expiration: new Date(M)
            };
            if (D.expiration.getTime() - Date.now() > PO5) return D;
            if (Date.now() - tnA.getTime() < 30000) return snA(D), D;
            z46("clientId", j.clientId, !0), z46("clientSecret", j.clientSecret, !0), z46("refreshToken", j.refreshToken, !0);
            try {
                tnA.setTime(Date.now());
                let X = await ZO5(j, H, K);
                z46("accessToken", X.accessToken), z46("expiresIn", X.expiresIn);
                let P = new Date(Date.now() + X.expiresIn * 1000);
                try {
                    await fO5(w, {
                        ...j,
                        accessToken: X.accessToken,
                        expiresAt: P.toISOString(),
                        refreshToken: X.refreshToken
                    })
                } catch (W) {}
                return {
                    token: X.accessToken,
                    expiration: P
                }
            } catch (X) {
                return snA(D), D
            }
        }, TO5 = ({
            token: A,
            logger: q
        }) => async () => {
            if (q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new pV.TokenProviderError("Please pass a valid token to fromStatic", !1);
            return A
        }, vO5 = (A = {}) => pV.memoize(pV.chain(enA(A), async () => {
            throw new pV.TokenProviderError("Could not load token from any providers", !1)
        }), (q) => q.expiration !== void 0 && q.expiration.getTime() - Date.now() < 300000, (q) => q.expiration !== void 0);
    NO5.fromEnvSigningName = XO5;
    NO5.fromSso = enA;
    NO5.fromStatic = TO5;
    NO5.nodeProvider = vO5
})
// @from(Ln 82092, Col 4)
g18 = x((IO5) => {
    IO5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(IO5.HttpAuthLocation || (IO5.HttpAuthLocation = {}));
    IO5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(IO5.HttpApiKeyAuthLocation || (IO5.HttpApiKeyAuthLocation = {}));
    IO5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(IO5.EndpointURLScheme || (IO5.EndpointURLScheme = {}));
    IO5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(IO5.AlgorithmId || (IO5.AlgorithmId = {}));
    var LO5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => IO5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => IO5.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        RO5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        hO5 = (A) => {
            return LO5(A)
        },
        SO5 = (A) => {
            return RO5(A)
        };
    IO5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(IO5.FieldPosition || (IO5.FieldPosition = {}));
    var CO5 = "__smithy_context";
    IO5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(IO5.IniSectionType || (IO5.IniSectionType = {}));
    IO5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(IO5.RequestHandlerProtocol || (IO5.RequestHandlerProtocol = {}));
    IO5.SMITHY_CONTEXT_KEY = CO5;
    IO5.getDefaultClientConfiguration = hO5;
    IO5.resolveDefaultRuntimeConfig = SO5
})