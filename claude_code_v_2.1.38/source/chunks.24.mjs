
// @from(Ln 68487, Col 4)
eQ = R((XmK) => {
    var CW8 = vU6(),
        V2 = R$(),
        tQ = hU6(),
        KM = rf(),
        E0 = nf(),
        bE1 = bU6(),
        hW8 = Z2(),
        Nk = mU6();
    class UH1 {
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
                if (Object.values(K).find((w) => {
                        let {
                            httpQuery: H,
                            httpQueryParams: $,
                            httpHeader: O,
                            httpLabel: _,
                            httpPrefixHeaders: J
                        } = w.getMergedTraits();
                        return !H && !$ && !O && !_ && J === void 0
                    })) return A
            }
        }
        async getErrorSchemaOrThrowBaseException(A, q, K, Y, z, w) {
            let H = q,
                $ = A;
            if (A.includes("#"))[H, $] = A.split("#");
            let O = {
                    $metadata: z,
                    $fault: K.statusCode < 500 ? "client" : "server"
                },
                _ = V2.TypeRegistry.for(H);
            try {
                return {
                    errorSchema: w?.(_, $) ?? _.getSchema(A),
                    errorMetadata: O
                }
            } catch (J) {
                Y.message = Y.message ?? Y.Message ?? "UnknownError";
                let X = V2.TypeRegistry.for("smithy.ts.sdk.synthetic." + H),
                    D = X.getBaseException();
                if (D) {
                    let j = X.getErrorCtor(D) ?? Error;
                    throw this.decorateServiceException(Object.assign(new j({
                        name: $
                    }), O), Y)
                }
                throw this.decorateServiceException(Object.assign(Error($), O), Y)
            }
        }
        decorateServiceException(A, q = {}) {
            if (this.queryCompat) {
                let K = A.Message ?? q.Message,
                    Y = tQ.decorateServiceException(A, q);
                if (K) Y.Message = K, Y.message = K;
                return Y
            }
            return tQ.decorateServiceException(A, q)
        }
        setQueryCompatError(A, q) {
            let K = q.headers?.["x-amzn-query-error"];
            if (A !== void 0 && K != null) {
                let [Y, z] = K.split(";"), w = Object.entries(A), H = {
                    Code: Y,
                    Type: z
                };
                Object.assign(A, H);
                for (let [$, O] of w) H[$] = O;
                delete H.__type, A.Error = H
            }
        }
        queryCompatOutput(A, q) {
            if (A.Error) q.Error = A.Error;
            if (A.Type) q.Type = A.Type;
            if (A.Code) q.Code = A.Code
        }
    }
    class IW8 extends CW8.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: A,
            awsQueryCompatible: q
        }) {
            super({
                defaultNamespace: A
            });
            this.awsQueryCompatible = !!q, this.mixin = new UH1(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            return Y
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let w = CW8.loadSmithyRpcV2CborErrorCode(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = V2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(V2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_),
                D = {};
            for (let [j, M] of O.structIterator()) D[j] = this.deserializer.readValue(M, Y[j]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, D);
            throw this.mixin.decorateServiceException(Object.assign(X, $, {
                $fault: O.getMergedTraits().error,
                message: _
            }, D), Y)
        }
    }
    var zmK = (A) => {
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
        wmK = (A) => {
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
        HmK = (A) => {
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
    class Qi {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }

    function $mK(A, q, K) {
        if (K?.source) {
            let Y = K.source;
            if (typeof q === "number") {
                if (q > Number.MAX_SAFE_INTEGER || q < Number.MIN_SAFE_INTEGER || Y !== String(q))
                    if (Y.includes(".")) return new E0.NumericValue(Y, "bigDecimal");
                    else return BigInt(Y)
            }
        }
        return q
    }
    var xW8 = (A, q) => tQ.collectBody(A, q).then((K) => (q?.utf8Encoder ?? hW8.toUtf8)(K)),
        ld6 = (A, q) => xW8(A, q).then((K) => {
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
        OmK = async (A, q) => {
            let K = await ld6(A, q);
            return K.message = K.message ?? K.Message, K
        }, id6 = (A, q) => {
            let K = (w, H) => Object.keys(w).find(($) => $.toLowerCase() === H.toLowerCase()),
                Y = (w) => {
                    let H = w;
                    if (typeof H === "number") H = H.toString();
                    if (H.indexOf(",") >= 0) H = H.split(",")[0];
                    if (H.indexOf(":") >= 0) H = H.split(":")[0];
                    if (H.indexOf("#") >= 0) H = H.split("#")[1];
                    return H
                },
                z = K(A.headers, "x-amzn-errortype");
            if (z !== void 0) return Y(A.headers[z]);
            if (q && typeof q === "object") {
                let w = K(q, "code");
                if (w && q[w] !== void 0) return Y(q[w]);
                if (q.__type !== void 0) return Y(q.__type)
            }
        };
    class nd6 extends Qi {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        async read(A, q) {
            return this._read(A, typeof q === "string" ? JSON.parse(q, $mK) : await ld6(q, this.serdeContext))
        }
        readObject(A, q) {
            return this._read(A, q)
        }
        _read(A, q) {
            let K = q !== null && typeof q === "object",
                Y = V2.NormalizedSchema.of(A);
            if (Y.isListSchema() && Array.isArray(q)) {
                let w = Y.getValueSchema(),
                    H = [],
                    $ = !!Y.getMergedTraits().sparse;
                for (let O of q)
                    if ($ || O != null) H.push(this._read(w, O));
                return H
            } else if (Y.isMapSchema() && K) {
                let w = Y.getValueSchema(),
                    H = {},
                    $ = !!Y.getMergedTraits().sparse;
                for (let [O, _] of Object.entries(q))
                    if ($ || _ != null) H[O] = this._read(w, _);
                return H
            } else if (Y.isStructSchema() && K) {
                let w = {};
                for (let [H, $] of Y.structIterator()) {
                    let O = this.settings.jsonName ? $.getMergedTraits().jsonName ?? H : H,
                        _ = this._read($, q[O]);
                    if (_ != null) w[H] = _
                }
                return w
            }
            if (Y.isBlobSchema() && typeof q === "string") return bE1.fromBase64(q);
            let z = Y.getMergedTraits().mediaType;
            if (Y.isStringSchema() && typeof q === "string" && z) {
                if (z === "application/json" || z.endsWith("+json")) return E0.LazyJsonString.from(q)
            }
            if (Y.isTimestampSchema() && q != null) switch (KM.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return E0.parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return E0.parseRfc7231DateTime(q);
                case 7:
                    return E0.parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (Y.isBigIntegerSchema() && (typeof q === "number" || typeof q === "string")) return BigInt(q);
            if (Y.isBigDecimalSchema() && q != null) {
                if (q instanceof E0.NumericValue) return q;
                let w = q;
                if (w.type === "bigDecimal" && "string" in w) return new E0.NumericValue(w.string, w.type);
                return new E0.NumericValue(String(q), "bigDecimal")
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
                    let w = Array.isArray(q) ? [] : {};
                    for (let [H, $] of Object.entries(q))
                        if ($ instanceof E0.NumericValue) w[H] = $;
                        else w[H] = this._read(Y, $);
                    return w
                } else return structuredClone(q);
            return q
        }
    }
    var SW8 = String.fromCharCode(925);
    class bW8 {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (A, q) => {
                if (q instanceof E0.NumericValue) {
                    let K = `${SW8+"nv"+this.counter++}_` + q.string;
                    return this.values.set(`"${K}"`, q.string), K
                }
                if (typeof q === "bigint") {
                    let K = q.toString(),
                        Y = `${SW8+"b"+this.counter++}_` + K;
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
    class rd6 extends Qi {
        settings;
        buffer;
        rootSchema;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            this.rootSchema = V2.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, q)
        }
        writeDiscriminatedDocument(A, q) {
            if (this.write(A, q), typeof this.buffer === "object") this.buffer.__type = V2.NormalizedSchema.of(A).getName(!0)
        }
        flush() {
            let {
                rootSchema: A
            } = this;
            if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
                let q = new bW8;
                return q.replaceInJson(JSON.stringify(this.buffer, q.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(A, q, K) {
            let Y = q !== null && typeof q === "object",
                z = V2.NormalizedSchema.of(A);
            if (z.isListSchema() && Array.isArray(q)) {
                let w = z.getValueSchema(),
                    H = [],
                    $ = !!z.getMergedTraits().sparse;
                for (let O of q)
                    if ($ || O != null) H.push(this._write(w, O));
                return H
            } else if (z.isMapSchema() && Y) {
                let w = z.getValueSchema(),
                    H = {},
                    $ = !!z.getMergedTraits().sparse;
                for (let [O, _] of Object.entries(q))
                    if ($ || _ != null) H[O] = this._write(w, _);
                return H
            } else if (z.isStructSchema() && Y) {
                let w = {};
                for (let [H, $] of z.structIterator()) {
                    let O = this.settings.jsonName ? $.getMergedTraits().jsonName ?? H : H,
                        _ = this._write($, q[H], z);
                    if (_ !== void 0) w[O] = _
                }
                return w
            }
            if (q === null && K?.isStructSchema()) return;
            if (z.isBlobSchema() && (q instanceof Uint8Array || typeof q === "string") || z.isDocumentSchema() && q instanceof Uint8Array) {
                if (z === this.rootSchema) return q;
                return (this.serdeContext?.base64Encoder ?? bE1.toBase64)(q)
            }
            if ((z.isTimestampSchema() || z.isDocumentSchema()) && q instanceof Date) switch (KM.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return q.toISOString().replace(".000Z", "Z");
                case 6:
                    return E0.dateToUtcString(q);
                case 7:
                    return q.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", q), q.getTime() / 1000
            }
            if (z.isNumericSchema() && typeof q === "number") {
                if (Math.abs(q) === 1 / 0 || isNaN(q)) return String(q)
            }
            if (z.isStringSchema()) {
                if (typeof q > "u" && z.isIdempotencyToken()) return E0.generateIdempotencyToken();
                let w = z.getMergedTraits().mediaType;
                if (q != null && w) {
                    if (w === "application/json" || w.endsWith("+json")) return E0.LazyJsonString.from(q)
                }
            }
            if (z.isDocumentSchema())
                if (Y) {
                    let w = Array.isArray(q) ? [] : {};
                    for (let [H, $] of Object.entries(q))
                        if ($ instanceof E0.NumericValue) w[H] = $;
                        else w[H] = this._write(z, $);
                    return w
                } else return structuredClone(q);
            return q
        }
    }
    class je1 extends Qi {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new rd6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new nd6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class Me1 extends KM.RpcProtocol {
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
            this.serviceTarget = q, this.codec = new je1({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!K, this.mixin = new UH1(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (!Y.path.endsWith("/")) Y.path += "/";
            if (Object.assign(Y.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${A.name}`
                }), this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            if (V2.deref(A.input) === "unit" || !Y.body) Y.body = "{}";
            return Y
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let w = id6(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = V2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(V2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_),
                D = {};
            for (let [j, M] of O.structIterator()) {
                let P = M.getMergedTraits().jsonName ?? j;
                D[j] = this.codec.createDeserializer().readObject(M, Y[P])
            }
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, D);
            throw this.mixin.decorateServiceException(Object.assign(X, $, {
                $fault: O.getMergedTraits().error,
                message: _
            }, D), Y)
        }
    }
    class uW8 extends Me1 {
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
    class BW8 extends Me1 {
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
    class mW8 extends KM.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new UH1;
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
            this.codec = new je1(q), this.serializer = new KM.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new KM.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
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
                z = V2.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let w = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (w) Y.headers["content-type"] = w
            }
            if (Y.body == null && Y.headers["content-type"] === this.getDefaultContentType()) Y.body = "{}";
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = await super.deserializeResponse(A, q, K),
                z = V2.NormalizedSchema.of(A.output);
            for (let [w, H] of z.structIterator())
                if (H.getMemberTraits().httpPayload && !(w in Y)) Y[w] = null;
            return Y
        }
        async handleError(A, q, K, Y, z) {
            let w = id6(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = V2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(V2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_);
            await this.deserializeHttpMessage(H, q, K, Y);
            let D = {};
            for (let [j, M] of O.structIterator()) {
                let P = M.getMergedTraits().jsonName ?? j;
                D[j] = this.codec.createDeserializer().readObject(M, Y[P])
            }
            throw this.mixin.decorateServiceException(Object.assign(X, $, {
                $fault: O.getMergedTraits().error,
                message: _
            }, D), Y)
        }
        getDefaultContentType() {
            return "application/json"
        }
    }
    var _mK = (A) => {
        if (A == null) return;
        if (typeof A === "object" && "__type" in A) delete A.__type;
        return tQ.expectUnion(A)
    };
    class Pe1 extends Qi {
        settings;
        stringDeserializer;
        constructor(A) {
            super();
            this.settings = A, this.stringDeserializer = new KM.FromStringShapeDeserializer(A)
        }
        setSerdeContext(A) {
            this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
        }
        read(A, q, K) {
            let Y = V2.NormalizedSchema.of(A),
                z = Y.getMemberSchemas();
            if (Y.isStructSchema() && Y.isMemberSchema() && !!Object.values(z).find((O) => {
                    return !!O.getMemberTraits().eventPayload
                })) {
                let O = {},
                    _ = Object.keys(z)[0];
                if (z[_].isBlobSchema()) O[_] = q;
                else O[_] = this.read(z[_], q);
                return O
            }
            let H = (this.serdeContext?.utf8Encoder ?? hW8.toUtf8)(q),
                $ = this.parseXml(H);
            return this.readSchema(A, K ? $[K] : $)
        }
        readSchema(A, q) {
            let K = V2.NormalizedSchema.of(A);
            if (K.isUnitSchema()) return;
            let Y = K.getMergedTraits();
            if (K.isListSchema() && !Array.isArray(q)) return this.readSchema(K, [q]);
            if (q == null) return q;
            if (typeof q === "object") {
                let z = !!Y.sparse,
                    w = !!Y.xmlFlattened;
                if (K.isListSchema()) {
                    let $ = K.getValueSchema(),
                        O = [],
                        _ = $.getMergedTraits().xmlName ?? "member",
                        J = w ? q : (q[0] ?? q)[_],
                        X = Array.isArray(J) ? J : [J];
                    for (let D of X)
                        if (D != null || z) O.push(this.readSchema($, D));
                    return O
                }
                let H = {};
                if (K.isMapSchema()) {
                    let $ = K.getKeySchema(),
                        O = K.getValueSchema(),
                        _;
                    if (w) _ = Array.isArray(q) ? q : [q];
                    else _ = Array.isArray(q.entry) ? q.entry : [q.entry];
                    let J = $.getMergedTraits().xmlName ?? "key",
                        X = O.getMergedTraits().xmlName ?? "value";
                    for (let D of _) {
                        let j = D[J],
                            M = D[X];
                        if (M != null || z) H[j] = this.readSchema(O, M)
                    }
                    return H
                }
                if (K.isStructSchema()) {
                    for (let [$, O] of K.structIterator()) {
                        let _ = O.getMergedTraits(),
                            J = !_.httpPayload ? O.getMemberTraits().xmlName ?? $ : _.xmlName ?? O.getName();
                        if (q[J] != null) H[$] = this.readSchema(O, q[J])
                    }
                    return H
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
                    q = Nk.parseXML(A)
                } catch (w) {
                    if (w && typeof w === "object") Object.defineProperty(w, "$responseBodyText", {
                        value: A
                    });
                    throw w
                }
                let K = "#text",
                    Y = Object.keys(q)[0],
                    z = q[Y];
                if (z[K]) z[Y] = z[K], delete z[K];
                return tQ.getValueFromTextNode(z)
            }
            return {}
        }
    }
    class FW8 extends Qi {
        settings;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q, K = "") {
            if (this.buffer === void 0) this.buffer = "";
            let Y = V2.NormalizedSchema.of(A);
            if (K && !K.endsWith(".")) K += ".";
            if (Y.isBlobSchema()) {
                if (typeof q === "string" || q instanceof Uint8Array) this.writeKey(K), this.writeValue((this.serdeContext?.base64Encoder ?? bE1.toBase64)(q))
            } else if (Y.isBooleanSchema() || Y.isNumericSchema() || Y.isStringSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q));
                else if (Y.isIdempotencyToken()) this.writeKey(K), this.writeValue(E0.generateIdempotencyToken())
            } else if (Y.isBigIntegerSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q))
            } else if (Y.isBigDecimalSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(q instanceof E0.NumericValue ? q.string : String(q))
            } else if (Y.isTimestampSchema()) {
                if (q instanceof Date) switch (this.writeKey(K), KM.determineTimestampFormat(Y, this.settings)) {
                    case 5:
                        this.writeValue(q.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(tQ.dateToUtcString(q));
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
                            w = this.settings.flattenLists || Y.getMergedTraits().xmlFlattened,
                            H = 1;
                        for (let $ of q) {
                            if ($ == null) continue;
                            let O = this.getKey("member", z.getMergedTraits().xmlName),
                                _ = w ? `${K}${H}` : `${K}${O}.${H}`;
                            this.write(z, $, _), ++H
                        }
                    }
            } else if (Y.isMapSchema()) {
                if (q && typeof q === "object") {
                    let z = Y.getKeySchema(),
                        w = Y.getValueSchema(),
                        H = Y.getMergedTraits().xmlFlattened,
                        $ = 1;
                    for (let [O, _] of Object.entries(q)) {
                        if (_ == null) continue;
                        let J = this.getKey("key", z.getMergedTraits().xmlName),
                            X = H ? `${K}${$}.${J}` : `${K}entry.${$}.${J}`,
                            D = this.getKey("value", w.getMergedTraits().xmlName),
                            j = H ? `${K}${$}.${D}` : `${K}entry.${$}.${D}`;
                        this.write(z, O, X), this.write(w, _, j), ++$
                    }
                }
            } else if (Y.isStructSchema()) {
                if (q && typeof q === "object")
                    for (let [z, w] of Y.structIterator()) {
                        if (q[z] == null && !w.isIdempotencyToken()) continue;
                        let H = this.getKey(z, w.getMergedTraits().xmlName),
                            $ = `${K}${H}`;
                        this.write(w, q[z], $)
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
            this.buffer += `&${KM.extendedEncodeURIComponent(A)}=`
        }
        writeValue(A) {
            this.buffer += KM.extendedEncodeURIComponent(A)
        }
    }
    class od6 extends KM.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new UH1;
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
            this.serializer = new FW8(q), this.deserializer = new Pe1(q)
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
                }), V2.deref(A.input) === "unit" || !Y.body) Y.body = "";
            let z = A.name.split("#")[1] ?? A.name;
            if (Y.body = `Action=${z}&Version=${this.options.version}` + Y.body, Y.body.endsWith("&")) Y.body = Y.body.slice(-1);
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = V2.NormalizedSchema.of(A.output),
                w = {};
            if (K.statusCode >= 300) {
                let J = await KM.collectBody(K.body, q);
                if (J.byteLength > 0) Object.assign(w, await Y.read(15, J));
                await this.handleError(A, q, K, w, this.deserializeMetadata(K))
            }
            for (let J in K.headers) {
                let X = K.headers[J];
                delete K.headers[J], K.headers[J.toLowerCase()] = X
            }
            let H = A.name.split("#")[1] ?? A.name,
                $ = z.isStructSchema() && this.useNestedResult() ? H + "Result" : void 0,
                O = await KM.collectBody(K.body, q);
            if (O.byteLength > 0) Object.assign(w, await Y.read(z, O, $));
            return {
                $metadata: this.deserializeMetadata(K),
                ...w
            }
        }
        useNestedResult() {
            return !0
        }
        async handleError(A, q, K, Y, z) {
            let w = this.loadQueryErrorCode(K, Y) ?? "Unknown",
                H = this.loadQueryError(Y),
                $ = this.loadQueryErrorMessage(Y);
            H.message = $, H.Error = {
                Type: H.Type,
                Code: H.Code,
                Message: $
            };
            let {
                errorSchema: O,
                errorMetadata: _
            } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, H, z, (M, P) => {
                try {
                    return M.getSchema(P)
                } catch (W) {
                    return M.find((G) => V2.NormalizedSchema.of(G).getMergedTraits().awsQueryError?.[0] === P)
                }
            }), J = V2.NormalizedSchema.of(O), D = new(V2.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)($), j = {
                Error: H.Error
            };
            for (let [M, P] of J.structIterator()) {
                let W = P.getMergedTraits().xmlName ?? M,
                    G = H[W] ?? Y[W];
                j[M] = this.deserializer.readSchema(P, G)
            }
            throw this.mixin.decorateServiceException(Object.assign(D, _, {
                $fault: J.getMergedTraits().error,
                message: $
            }, j), Y)
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
    class QW8 extends od6 {
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
    var gW8 = (A, q) => xW8(A, q).then((K) => {
            if (K.length) {
                let Y;
                try {
                    Y = Nk.parseXML(K)
                } catch ($) {
                    if ($ && typeof $ === "object") Object.defineProperty($, "$responseBodyText", {
                        value: K
                    });
                    throw $
                }
                let z = "#text",
                    w = Object.keys(Y)[0],
                    H = Y[w];
                if (H[z]) H[w] = H[z], delete H[z];
                return tQ.getValueFromTextNode(H)
            }
            return {}
        }),
        JmK = async (A, q) => {
            let K = await gW8(A, q);
            if (K.Error) K.Error.message = K.Error.message ?? K.Error.Message;
            return K
        }, UW8 = (A, q) => {
            if (q?.Error?.Code !== void 0) return q.Error.Code;
            if (q?.Code !== void 0) return q.Code;
            if (A.statusCode == 404) return "NotFound"
        };
    class ad6 extends Qi {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = V2.NormalizedSchema.of(A);
            if (K.isStringSchema() && typeof q === "string") this.stringBuffer = q;
            else if (K.isBlobSchema()) this.byteBuffer = "byteLength" in q ? q : (this.serdeContext?.base64Decoder ?? bE1.fromBase64)(q);
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
            let w = Nk.XmlNode.of(z),
                [H, $] = this.getXmlnsAttribute(A, K);
            for (let [O, _] of A.structIterator()) {
                let J = q[O];
                if (J != null || _.isIdempotencyToken()) {
                    if (_.getMergedTraits().xmlAttribute) {
                        w.addAttribute(_.getMergedTraits().xmlName ?? O, this.writeSimple(_, J));
                        continue
                    }
                    if (_.isListSchema()) this.writeList(_, J, w, $);
                    else if (_.isMapSchema()) this.writeMap(_, J, w, $);
                    else if (_.isStructSchema()) w.addChildNode(this.writeStruct(_, J, $));
                    else {
                        let X = Nk.XmlNode.of(_.getMergedTraits().xmlName ?? _.getMemberName());
                        this.writeSimpleInto(_, J, X, $), w.addChildNode(X)
                    }
                }
            }
            if ($) w.addAttribute(H, $);
            return w
        }
        writeList(A, q, K, Y) {
            if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
            let z = A.getMergedTraits(),
                w = A.getValueSchema(),
                H = w.getMergedTraits(),
                $ = !!H.sparse,
                O = !!z.xmlFlattened,
                [_, J] = this.getXmlnsAttribute(A, Y),
                X = (D, j) => {
                    if (w.isListSchema()) this.writeList(w, Array.isArray(j) ? j : [j], D, J);
                    else if (w.isMapSchema()) this.writeMap(w, j, D, J);
                    else if (w.isStructSchema()) {
                        let M = this.writeStruct(w, j, J);
                        D.addChildNode(M.withName(O ? z.xmlName ?? A.getMemberName() : H.xmlName ?? "member"))
                    } else {
                        let M = Nk.XmlNode.of(O ? z.xmlName ?? A.getMemberName() : H.xmlName ?? "member");
                        this.writeSimpleInto(w, j, M, J), D.addChildNode(M)
                    }
                };
            if (O) {
                for (let D of q)
                    if ($ || D != null) X(K, D)
            } else {
                let D = Nk.XmlNode.of(z.xmlName ?? A.getMemberName());
                if (J) D.addAttribute(_, J);
                for (let j of q)
                    if ($ || j != null) X(D, j);
                K.addChildNode(D)
            }
        }
        writeMap(A, q, K, Y, z = !1) {
            if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
            let w = A.getMergedTraits(),
                H = A.getKeySchema(),
                O = H.getMergedTraits().xmlName ?? "key",
                _ = A.getValueSchema(),
                J = _.getMergedTraits(),
                X = J.xmlName ?? "value",
                D = !!J.sparse,
                j = !!w.xmlFlattened,
                [M, P] = this.getXmlnsAttribute(A, Y),
                W = (G, f, Z) => {
                    let N = Nk.XmlNode.of(O, f),
                        [T, k] = this.getXmlnsAttribute(H, P);
                    if (k) N.addAttribute(T, k);
                    G.addChildNode(N);
                    let y = Nk.XmlNode.of(X);
                    if (_.isListSchema()) this.writeList(_, Z, y, P);
                    else if (_.isMapSchema()) this.writeMap(_, Z, y, P, !0);
                    else if (_.isStructSchema()) y = this.writeStruct(_, Z, P);
                    else this.writeSimpleInto(_, Z, y, P);
                    G.addChildNode(y)
                };
            if (j) {
                for (let [G, f] of Object.entries(q))
                    if (D || f != null) {
                        let Z = Nk.XmlNode.of(w.xmlName ?? A.getMemberName());
                        W(Z, G, f), K.addChildNode(Z)
                    }
            } else {
                let G;
                if (!z) {
                    if (G = Nk.XmlNode.of(w.xmlName ?? A.getMemberName()), P) G.addAttribute(M, P);
                    K.addChildNode(G)
                }
                for (let [f, Z] of Object.entries(q))
                    if (D || Z != null) {
                        let N = Nk.XmlNode.of("entry");
                        W(N, f, Z), (z ? K : G).addChildNode(N)
                    }
            }
        }
        writeSimple(A, q) {
            if (q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let K = V2.NormalizedSchema.of(A),
                Y = null;
            if (q && typeof q === "object")
                if (K.isBlobSchema()) Y = (this.serdeContext?.base64Encoder ?? bE1.toBase64)(q);
                else if (K.isTimestampSchema() && q instanceof Date) switch (KM.determineTimestampFormat(K, this.settings)) {
                case 5:
                    Y = q.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    Y = tQ.dateToUtcString(q);
                    break;
                case 7:
                    Y = String(q.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", q), Y = tQ.dateToUtcString(q);
                    break
            } else if (K.isBigDecimalSchema() && q) {
                if (q instanceof E0.NumericValue) return q.string;
                return String(q)
            } else if (K.isMapSchema() || K.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${K.getName(!0)}`);
            if (K.isBooleanSchema() || K.isNumericSchema() || K.isBigIntegerSchema() || K.isBigDecimalSchema()) Y = String(q);
            if (K.isStringSchema())
                if (q === void 0 && K.isIdempotencyToken()) Y = E0.generateIdempotencyToken();
                else Y = String(q);
            if (Y === null) throw Error(`Unhandled schema-value pair ${K.getName(!0)}=${q}`);
            return Y
        }
        writeSimpleInto(A, q, K, Y) {
            let z = this.writeSimple(A, q),
                w = V2.NormalizedSchema.of(A),
                H = new Nk.XmlText(z),
                [$, O] = this.getXmlnsAttribute(w, Y);
            if (O) K.addAttribute($, O);
            K.addChildNode(H)
        }
        getXmlnsAttribute(A, q) {
            let K = A.getMergedTraits(),
                [Y, z] = K.xmlNamespace ?? [];
            if (z && z !== q) return [Y ? `xmlns:${Y}` : "xmlns", z];
            return [void 0, void 0]
        }
    }
    class sd6 extends Qi {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new ad6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new Pe1(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class pW8 extends KM.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new UH1;
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
            this.codec = new sd6(q), this.serializer = new KM.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new KM.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K),
                z = V2.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let w = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (w) Y.headers["content-type"] = w
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
            let w = UW8(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = V2.NormalizedSchema.of(H),
                _ = Y.Error?.message ?? Y.Error?.Message ?? Y.message ?? Y.Message ?? "Unknown",
                X = new(V2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_);
            await this.deserializeHttpMessage(H, q, K, Y);
            let D = {};
            for (let [j, M] of O.structIterator()) {
                let P = M.getMergedTraits().xmlName ?? j,
                    W = Y.Error?.[P] ?? Y[P];
                D[j] = this.codec.createDeserializer().readSchema(M, W)
            }
            throw this.mixin.decorateServiceException(Object.assign(X, $, {
                $fault: O.getMergedTraits().error,
                message: _
            }, D), Y)
        }
        getDefaultContentType() {
            return "application/xml"
        }
    }
    XmK.AwsEc2QueryProtocol = QW8;
    XmK.AwsJson1_0Protocol = uW8;
    XmK.AwsJson1_1Protocol = BW8;
    XmK.AwsJsonRpcProtocol = Me1;
    XmK.AwsQueryProtocol = od6;
    XmK.AwsRestJsonProtocol = mW8;
    XmK.AwsRestXmlProtocol = pW8;
    XmK.AwsSmithyRpcV2CborProtocol = IW8;
    XmK.JsonCodec = je1;
    XmK.JsonShapeDeserializer = nd6;
    XmK.JsonShapeSerializer = rd6;
    XmK.XmlCodec = sd6;
    XmK.XmlShapeDeserializer = Pe1;
    XmK.XmlShapeSerializer = ad6;
    XmK._toBool = wmK;
    XmK._toNum = HmK;
    XmK._toStr = zmK;
    XmK.awsExpectUnion = _mK;
    XmK.loadRestJsonErrorCode = id6;
    XmK.loadRestXmlErrorCode = UW8;
    XmK.parseJsonBody = ld6;
    XmK.parseJsonErrorBody = OmK;
    XmK.parseXmlBody = gW8;
    XmK.parseXmlErrorBody = JmK
})
// @from(Ln 69715, Col 4)
dW8 = R((mmK) => {
    var BmK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    mmK.isArrayBuffer = BmK
})
// @from(Ln 69719, Col 4)
ed6 = R((pmK) => {
    var QmK = dW8(),
        td6 = h1("buffer"),
        gmK = (A, q = 0, K = A.byteLength - q) => {
            if (!QmK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return td6.Buffer.from(A, q, K)
        },
        UmK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? td6.Buffer.from(A, q) : td6.Buffer.from(A)
        };
    pmK.fromArrayBuffer = gmK;
    pmK.fromString = UmK
})
// @from(Ln 69733, Col 4)
iW8 = R((cW8) => {
    Object.defineProperty(cW8, "__esModule", {
        value: !0
    });
    cW8.fromBase64 = void 0;
    var lmK = ed6(),
        imK = /^[A-Za-z0-9+/]*={0,2}$/,
        nmK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!imK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, lmK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    cW8.fromBase64 = nmK
})
// @from(Ln 69748, Col 4)
oW8 = R((nW8) => {
    Object.defineProperty(nW8, "__esModule", {
        value: !0
    });
    nW8.toBase64 = void 0;
    var rmK = ed6(),
        omK = Z2(),
        amK = (A) => {
            let q;
            if (typeof A === "string") q = (0, omK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, rmK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    nW8.toBase64 = amK
})
// @from(Ln 69764, Col 4)
We1 = R((uE1) => {
    var aW8 = iW8(),
        sW8 = oW8();
    Object.keys(aW8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(uE1, A)) Object.defineProperty(uE1, A, {
            enumerable: !0,
            get: function() {
                return aW8[A]
            }
        })
    });
    Object.keys(sW8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(uE1, A)) Object.defineProperty(uE1, A, {
            enumerable: !0,
            get: function() {
                return sW8[A]
            }
        })
    })
})
// @from(Ln 69784, Col 4)
MG8 = R((DG8) => {
    Object.defineProperty(DG8, "__esModule", {
        value: !0
    });
    DG8.ruleSet = void 0;
    var OG8 = "required",
        vk = "fn",
        Ek = "argv",
        cH1 = "ref",
        tW8 = !0,
        eW8 = "isSet",
        BE1 = "booleanEquals",
        pH1 = "error",
        dH1 = "endpoint",
        Ag = "tree",
        Ac6 = "PartitionResult",
        qc6 = "getAttr",
        AG8 = {
            [OG8]: !1,
            type: "string"
        },
        qG8 = {
            [OG8]: !0,
            default: !1,
            type: "boolean"
        },
        KG8 = {
            [cH1]: "Endpoint"
        },
        _G8 = {
            [vk]: BE1,
            [Ek]: [{
                [cH1]: "UseFIPS"
            }, !0]
        },
        JG8 = {
            [vk]: BE1,
            [Ek]: [{
                [cH1]: "UseDualStack"
            }, !0]
        },
        Tk = {},
        YG8 = {
            [vk]: qc6,
            [Ek]: [{
                [cH1]: Ac6
            }, "supportsFIPS"]
        },
        XG8 = {
            [cH1]: Ac6
        },
        zG8 = {
            [vk]: BE1,
            [Ek]: [!0, {
                [vk]: qc6,
                [Ek]: [XG8, "supportsDualStack"]
            }]
        },
        wG8 = [_G8],
        HG8 = [JG8],
        $G8 = [{
            [cH1]: "Region"
        }],
        smK = {
            version: "1.0",
            parameters: {
                Region: AG8,
                UseDualStack: qG8,
                UseFIPS: qG8,
                Endpoint: AG8
            },
            rules: [{
                conditions: [{
                    [vk]: eW8,
                    [Ek]: [KG8]
                }],
                rules: [{
                    conditions: wG8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: pH1
                }, {
                    conditions: HG8,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: pH1
                }, {
                    endpoint: {
                        url: KG8,
                        properties: Tk,
                        headers: Tk
                    },
                    type: dH1
                }],
                type: Ag
            }, {
                conditions: [{
                    [vk]: eW8,
                    [Ek]: $G8
                }],
                rules: [{
                    conditions: [{
                        [vk]: "aws.partition",
                        [Ek]: $G8,
                        assign: Ac6
                    }],
                    rules: [{
                        conditions: [_G8, JG8],
                        rules: [{
                            conditions: [{
                                [vk]: BE1,
                                [Ek]: [tW8, YG8]
                            }, zG8],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Tk,
                                    headers: Tk
                                },
                                type: dH1
                            }],
                            type: Ag
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: pH1
                        }],
                        type: Ag
                    }, {
                        conditions: wG8,
                        rules: [{
                            conditions: [{
                                [vk]: BE1,
                                [Ek]: [YG8, tW8]
                            }],
                            rules: [{
                                conditions: [{
                                    [vk]: "stringEquals",
                                    [Ek]: [{
                                        [vk]: qc6,
                                        [Ek]: [XG8, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://oidc.{Region}.amazonaws.com",
                                    properties: Tk,
                                    headers: Tk
                                },
                                type: dH1
                            }, {
                                endpoint: {
                                    url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: Tk,
                                    headers: Tk
                                },
                                type: dH1
                            }],
                            type: Ag
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: pH1
                        }],
                        type: Ag
                    }, {
                        conditions: HG8,
                        rules: [{
                            conditions: [zG8],
                            rules: [{
                                endpoint: {
                                    url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Tk,
                                    headers: Tk
                                },
                                type: dH1
                            }],
                            type: Ag
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: pH1
                        }],
                        type: Ag
                    }, {
                        endpoint: {
                            url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
                            properties: Tk,
                            headers: Tk
                        },
                        type: dH1
                    }],
                    type: Ag
                }],
                type: Ag
            }, {
                error: "Invalid Configuration: Missing Region",
                type: pH1
            }]
        };
    DG8.ruleSet = smK
})
// @from(Ln 69980, Col 4)
GG8 = R((PG8) => {
    Object.defineProperty(PG8, "__esModule", {
        value: !0
    });
    PG8.defaultEndpointResolver = void 0;
    var tmK = zb(),
        Kc6 = GC(),
        emK = MG8(),
        AFK = new Kc6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        qFK = (A, q = {}) => {
            return AFK.get(A, () => (0, Kc6.resolveEndpoint)(emK.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    PG8.defaultEndpointResolver = qFK;
    Kc6.customEndpointFunctions.aws = tmK.awsEndpointFunctions
})
// @from(Ln 70001, Col 4)
TG8 = R((VG8) => {
    Object.defineProperty(VG8, "__esModule", {
        value: !0
    });
    VG8.getRuntimeConfig = void 0;
    var KFK = YH(),
        YFK = eQ(),
        zFK = lz(),
        wFK = uG(),
        HFK = fk(),
        ZG8 = We1(),
        fG8 = Z2(),
        $FK = gd6(),
        OFK = GG8(),
        _FK = (A) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: A?.base64Decoder ?? ZG8.fromBase64,
                base64Encoder: A?.base64Encoder ?? ZG8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? OFK.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? $FK.defaultSSOOIDCHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new KFK.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new zFK.NoAuthSigner
                }],
                logger: A?.logger ?? new wFK.NoOpLogger,
                protocol: A?.protocol ?? new YFK.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.ssooidc"
                }),
                serviceId: A?.serviceId ?? "SSO OIDC",
                urlParser: A?.urlParser ?? HFK.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? fG8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? fG8.toUtf8
            }
        };
    VG8.getRuntimeConfig = _FK
})
// @from(Ln 70045, Col 4)
qg = R((TFK) => {
    var JFK = YJ(),
        vG8 = af(),
        XFK = wX(),
        DFK = "AWS_EXECUTION_ENV",
        EG8 = "AWS_REGION",
        kG8 = "AWS_DEFAULT_REGION",
        jFK = "AWS_EC2_METADATA_DISABLED",
        MFK = ["in-region", "cross-region", "mobile", "standard", "legacy"],
        PFK = "/latest/meta-data/placement/region",
        WFK = "AWS_DEFAULTS_MODE",
        GFK = "defaults_mode",
        ZFK = {
            environmentVariableSelector: (A) => {
                return A[WFK]
            },
            configFileSelector: (A) => {
                return A[GFK]
            },
            default: "legacy"
        },
        fFK = ({
            region: A = vG8.loadConfig(JFK.NODE_REGION_CONFIG_OPTIONS),
            defaultsMode: q = vG8.loadConfig(ZFK)
        } = {}) => XFK.memoize(async () => {
            let K = typeof q === "function" ? await q() : q;
            switch (K?.toLowerCase()) {
                case "auto":
                    return VFK(A);
                case "in-region":
                case "cross-region":
                case "mobile":
                case "standard":
                case "legacy":
                    return Promise.resolve(K?.toLocaleLowerCase());
                case void 0:
                    return Promise.resolve("legacy");
                default:
                    throw Error(`Invalid parameter for "defaultsMode", expect ${MFK.join(", ")}, got ${K}`)
            }
        }),
        VFK = async (A) => {
            if (A) {
                let q = typeof A === "function" ? await A() : A,
                    K = await NFK();
                if (!K) return "standard";
                if (q === K) return "in-region";
                else return "cross-region"
            }
            return "standard"
        }, NFK = async () => {
            if (process.env[DFK] && (process.env[EG8] || process.env[kG8])) return process.env[EG8] ?? process.env[kG8];
            if (!process.env[jFK]) try {
                let {
                    getInstanceMetadataEndpoint: A,
                    httpRequest: q
                } = await Promise.resolve().then(() => o(VA1())), K = await A();
                return (await q({
                    ...K,
                    path: PFK
                })).toString()
            } catch (A) {}
        };
    TFK.resolveDefaultsModeConfig = fFK
})
// @from(Ln 70110, Col 4)
IG8 = R((SG8) => {
    Object.defineProperty(SG8, "__esModule", {
        value: !0
    });
    SG8.getRuntimeConfig = void 0;
    var EFK = n2(),
        kFK = EFK.__importDefault(De1()),
        LG8 = YH(),
        RG8 = oQ(),
        Ge1 = YJ(),
        LFK = aQ(),
        yG8 = qM(),
        NA1 = af(),
        CG8 = cf(),
        RFK = sQ(),
        yFK = _b(),
        CFK = TG8(),
        SFK = uG(),
        hFK = qg(),
        IFK = uG(),
        xFK = (A) => {
            (0, IFK.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, hFK.resolveDefaultsModeConfig)(A),
                K = () => q().then(SFK.loadConfigsForDefaultMode),
                Y = (0, CFK.getRuntimeConfig)(A);
            (0, LG8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, NA1.loadConfig)(LG8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? RFK.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, RG8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: kFK.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, NA1.loadConfig)(yG8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, NA1.loadConfig)(Ge1.NODE_REGION_CONFIG_OPTIONS, {
                    ...Ge1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: CG8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, NA1.loadConfig)({
                    ...yG8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || yFK.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? LFK.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? CG8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, NA1.loadConfig)(Ge1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, NA1.loadConfig)(Ge1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, NA1.loadConfig)(RG8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    SG8.getRuntimeConfig = xFK
})
// @from(Ln 70170, Col 4)
uG8 = R((bG8) => {
    Object.defineProperty(bG8, "__esModule", {
        value: !0
    });
    bG8.warning = void 0;
    bG8.stsRegionDefaultResolver = uFK;
    var xG8 = YJ(),
        bFK = af();

    function uFK(A = {}) {
        return (0, bFK.loadConfig)({
            ...xG8.NODE_REGION_CONFIG_OPTIONS,
            async default () {
                if (!bG8.warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
                return "us-east-1"
            }
        }, {
            ...xG8.NODE_REGION_CONFIG_FILE_OPTIONS,
            ...A
        })
    }
    bG8.warning = {
        silence: !1
    }
})
// @from(Ln 70195, Col 4)
fC = R((gi) => {
    var mE1 = YJ(),
        BG8 = uG8(),
        mFK = (A) => {
            return {
                setRegion(q) {
                    A.region = q
                },
                region() {
                    return A.region
                }
            }
        },
        FFK = (A) => {
            return {
                region: A.region()
            }
        };
    Object.defineProperty(gi, "NODE_REGION_CONFIG_FILE_OPTIONS", {
        enumerable: !0,
        get: function() {
            return mE1.NODE_REGION_CONFIG_FILE_OPTIONS
        }
    });
    Object.defineProperty(gi, "NODE_REGION_CONFIG_OPTIONS", {
        enumerable: !0,
        get: function() {
            return mE1.NODE_REGION_CONFIG_OPTIONS
        }
    });
    Object.defineProperty(gi, "REGION_ENV_NAME", {
        enumerable: !0,
        get: function() {
            return mE1.REGION_ENV_NAME
        }
    });
    Object.defineProperty(gi, "REGION_INI_NAME", {
        enumerable: !0,
        get: function() {
            return mE1.REGION_INI_NAME
        }
    });
    Object.defineProperty(gi, "resolveRegionConfig", {
        enumerable: !0,
        get: function() {
            return mE1.resolveRegionConfig
        }
    });
    gi.getAwsRegionExtensionConfiguration = mFK;
    gi.resolveAwsRegionExtensionConfiguration = FFK;
    Object.keys(BG8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(gi, A)) Object.defineProperty(gi, A, {
            enumerable: !0,
            get: function() {
                return BG8[A]
            }
        })
    })
})
// @from(Ln 70254, Col 4)
fe1 = R((iFK) => {
    var UFK = Id6(),
        pFK = (A) => {
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
        dFK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class mG8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = UFK.FieldPosition.HEADER,
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
    class FG8 {
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
    class Ze1 {
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
            let q = new Ze1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = cFK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Ze1.clone(this)
        }
    }

    function cFK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class QG8 {
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

    function lFK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    iFK.Field = mG8;
    iFK.Fields = FG8;
    iFK.HttpRequest = Ze1;
    iFK.HttpResponse = QG8;
    iFK.getHttpHandlerExtensionConfiguration = pFK;
    iFK.isValidHostname = lFK;
    iFK.resolveHttpHandlerRuntimeConfig = dFK
})
// @from(Ln 70396, Col 4)
_c6 = R((Oc6) => {
    var gG8 = BQ(),
        AQK = mQ(),
        qQK = FQ(),
        UG8 = $b(),
        KQK = YJ(),
        zc6 = lz(),
        ET = R$(),
        YQK = rQ(),
        iG8 = ZC(),
        pG8 = qM(),
        Ui = uG(),
        dG8 = gd6(),
        zQK = IG8(),
        cG8 = fC(),
        lG8 = fe1(),
        wQK = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "sso-oauth"
            })
        },
        HQK = {
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
        $QK = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let w = q.findIndex((H) => H.schemeId === z.schemeId);
                    if (w === -1) q.push(z);
                    else q.splice(w, 1, z)
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
        OQK = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        _QK = (A, q) => {
            let K = Object.assign(cG8.getAwsRegionExtensionConfiguration(A), Ui.getDefaultExtensionConfiguration(A), lG8.getHttpHandlerExtensionConfiguration(A), $QK(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, cG8.resolveAwsRegionExtensionConfiguration(K), Ui.resolveDefaultRuntimeConfig(K), lG8.resolveHttpHandlerRuntimeConfig(K), OQK(K))
        };
    class wc6 extends Ui.Client {
        config;
        constructor(...[A]) {
            let q = zQK.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = wQK(q),
                Y = UG8.resolveUserAgentConfig(K),
                z = pG8.resolveRetryConfig(Y),
                w = KQK.resolveRegionConfig(z),
                H = gG8.resolveHostHeaderConfig(w),
                $ = iG8.resolveEndpointConfig(H),
                O = dG8.resolveHttpAuthSchemeConfig($),
                _ = _QK(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use(ET.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(UG8.getUserAgentPlugin(this.config)), this.middlewareStack.use(pG8.getRetryPlugin(this.config)), this.middlewareStack.use(YQK.getContentLengthPlugin(this.config)), this.middlewareStack.use(gG8.getHostHeaderPlugin(this.config)), this.middlewareStack.use(AQK.getLoggerPlugin(this.config)), this.middlewareStack.use(qQK.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(zc6.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: dG8.defaultSSOOIDCHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new zc6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use(zc6.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var kT = class A extends Ui.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        nG8 = class A extends kT {
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
        rG8 = class A extends kT {
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
        oG8 = class A extends kT {
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
        aG8 = class A extends kT {
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
        sG8 = class A extends kT {
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
        tG8 = class A extends kT {
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
        eG8 = class A extends kT {
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
        AZ8 = class A extends kT {
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
        qZ8 = class A extends kT {
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
        KZ8 = class A extends kT {
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
        YZ8 = class A extends kT {
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
        JQK = "AccessDeniedException",
        XQK = "AuthorizationPendingException",
        DQK = "AccessToken",
        jQK = "ClientSecret",
        MQK = "CreateToken",
        PQK = "CreateTokenRequest",
        WQK = "CreateTokenResponse",
        GQK = "CodeVerifier",
        ZQK = "ExpiredTokenException",
        fQK = "InvalidClientException",
        VQK = "InvalidGrantException",
        NQK = "InvalidRequestException",
        TQK = "InternalServerException",
        vQK = "InvalidScopeException",
        EQK = "IdToken",
        kQK = "RefreshToken",
        LQK = "SlowDownException",
        RQK = "UnauthorizedClientException",
        yQK = "UnsupportedGrantTypeException",
        CQK = "accessToken",
        Xb = "client",
        SQK = "clientId",
        hQK = "clientSecret",
        IQK = "codeVerifier",
        xQK = "code",
        bQK = "deviceCode",
        G_ = "error",
        uQK = "expiresIn",
        VC = "error_description",
        BQK = "grantType",
        mQK = "http",
        NC = "httpError",
        FQK = "idToken",
        zZ8 = "reason",
        wZ8 = "refreshToken",
        QQK = "redirectUri",
        gQK = "scope",
        UQK = "server",
        HZ8 = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc",
        pQK = "tokenType",
        iz = "com.amazonaws.ssooidc",
        dQK = [0, iz, DQK, 8, 0],
        cQK = [0, iz, jQK, 8, 0],
        lQK = [0, iz, GQK, 8, 0],
        iQK = [0, iz, EQK, 8, 0],
        $Z8 = [0, iz, kQK, 8, 0],
        nQK = [-3, iz, JQK, {
                [G_]: Xb,
                [NC]: 400
            },
            [G_, zZ8, VC],
            [0, 0, 0]
        ];
    ET.TypeRegistry.for(iz).registerError(nQK, nG8);
    var rQK = [-3, iz, XQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(rQK, rG8);
    var oQK = [3, iz, PQK, 0, [SQK, hQK, BQK, bQK, xQK, wZ8, gQK, QQK, IQK],
            [0, [() => cQK, 0], 0, 0, 0, [() => $Z8, 0], 64, 0, [() => lQK, 0]]
        ],
        aQK = [3, iz, WQK, 0, [CQK, pQK, uQK, wZ8, FQK],
            [
                [() => dQK, 0], 0, 1, [() => $Z8, 0],
                [() => iQK, 0]
            ]
        ],
        sQK = [-3, iz, ZQK, {
                [G_]: Xb,
                [NC]: 400
            },
            [G_, VC],
            [0, 0]
        ];
    ET.TypeRegistry.for(iz).registerError(sQK, oG8);
    var tQK = [-3, iz, TQK, {
            [G_]: UQK,
            [NC]: 500
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(tQK, aG8);
    var eQK = [-3, iz, fQK, {
            [G_]: Xb,
            [NC]: 401
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(eQK, sG8);
    var AgK = [-3, iz, VQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(AgK, tG8);
    var qgK = [-3, iz, NQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, zZ8, VC],
        [0, 0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(qgK, eG8);
    var KgK = [-3, iz, vQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(KgK, AZ8);
    var YgK = [-3, iz, LQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(YgK, qZ8);
    var zgK = [-3, iz, RQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(zgK, KZ8);
    var wgK = [-3, iz, yQK, {
            [G_]: Xb,
            [NC]: 400
        },
        [G_, VC],
        [0, 0]
    ];
    ET.TypeRegistry.for(iz).registerError(wgK, YZ8);
    var HgK = [-3, HZ8, "SSOOIDCServiceException", 0, [],
        []
    ];
    ET.TypeRegistry.for(HZ8).registerError(HgK, kT);
    var $gK = [9, iz, MQK, {
        [mQK]: ["POST", "/token", 200]
    }, () => oQK, () => aQK];
    class Hc6 extends Ui.Command.classBuilder().ep(HQK).m(function(A, q, K, Y) {
        return [iG8.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc($gK).build() {}
    var OgK = {
        CreateTokenCommand: Hc6
    };
    class $c6 extends wc6 {}
    Ui.createAggregatedClient(OgK, $c6);
    var _gK = {
            KMS_ACCESS_DENIED: "KMS_AccessDeniedException"
        },
        JgK = {
            KMS_DISABLED_KEY: "KMS_DisabledException",
            KMS_INVALID_KEY_USAGE: "KMS_InvalidKeyUsageException",
            KMS_INVALID_STATE: "KMS_InvalidStateException",
            KMS_KEY_NOT_FOUND: "KMS_NotFoundException"
        };
    Object.defineProperty(Oc6, "$Command", {
        enumerable: !0,
        get: function() {
            return Ui.Command
        }
    });
    Object.defineProperty(Oc6, "__Client", {
        enumerable: !0,
        get: function() {
            return Ui.Client
        }
    });
    Oc6.AccessDeniedException = nG8;
    Oc6.AccessDeniedExceptionReason = _gK;
    Oc6.AuthorizationPendingException = rG8;
    Oc6.CreateTokenCommand = Hc6;
    Oc6.ExpiredTokenException = oG8;
    Oc6.InternalServerException = aG8;
    Oc6.InvalidClientException = sG8;
    Oc6.InvalidGrantException = tG8;
    Oc6.InvalidRequestException = eG8;
    Oc6.InvalidRequestExceptionReason = JgK;
    Oc6.InvalidScopeException = AZ8;
    Oc6.SSOOIDC = $c6;
    Oc6.SSOOIDCClient = wc6;
    Oc6.SSOOIDCServiceException = kT;
    Oc6.SlowDownException = qZ8;
    Oc6.UnauthorizedClientException = KZ8;
    Oc6.UnsupportedGrantTypeException = YZ8
})
// @from(Ln 70861, Col 4)
Ve1 = R((QgK) => {
    var ygK = of(),
        CgK = zW8(),
        LT = wX(),
        FE1 = Ob(),
        SgK = h1("fs"),
        hgK = ({
            logger: A,
            signingName: q
        } = {}) => async () => {
            if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !q) throw new LT.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
                logger: A
            });
            let K = CgK.getBearerTokenEnvKey(q);
            if (!(K in process.env)) throw new LT.TokenProviderError(`Token not present in '${K}' environment variable`, {
                logger: A
            });
            let Y = {
                token: process.env[K]
            };
            return ygK.setTokenFeature(Y, "BEARER_SERVICE_ENV_VARS", "3"), Y
        }, IgK = 300000, Jc6 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.", xgK = async (A, q = {}) => {
            let {
                SSOOIDCClient: K
            } = await Promise.resolve().then(() => o(_c6())), Y = (w) => q.clientConfig?.[w] ?? q.parentClientConfig?.[w];
            return new K(Object.assign({}, q.clientConfig ?? {}, {
                region: A ?? q.clientConfig?.region,
                logger: Y("logger"),
                userAgentAppId: Y("userAgentAppId")
            }))
        }, bgK = async (A, q, K = {}) => {
            let {
                CreateTokenCommand: Y
            } = await Promise.resolve().then(() => o(_c6()));
            return (await xgK(q, K)).send(new Y({
                clientId: A.clientId,
                clientSecret: A.clientSecret,
                refreshToken: A.refreshToken,
                grantType: "refresh_token"
            }))
        }, OZ8 = (A) => {
            if (A.expiration && A.expiration.getTime() < Date.now()) throw new LT.TokenProviderError(`Token is expired. ${Jc6}`, !1)
        }, TA1 = (A, q, K = !1) => {
            if (typeof q > "u") throw new LT.TokenProviderError(`Value not present for '${A}' in SSO Token${K?". Cannot refresh":""}. ${Jc6}`, !1)
        }, {
            writeFile: ugK
        } = SgK.promises, BgK = (A, q) => {
            let K = FE1.getSSOTokenFilepath(A),
                Y = JSON.stringify(q, null, 2);
            return ugK(K, Y)
        }, _Z8 = new Date(0), JZ8 = (A = {}) => async ({
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
            let Y = await FE1.parseKnownFiles(K),
                z = FE1.getProfileName({
                    profile: K.profile ?? q?.profile
                }),
                w = Y[z];
            if (!w) throw new LT.TokenProviderError(`Profile '${z}' could not be found in shared credentials file.`, !1);
            else if (!w.sso_session) throw new LT.TokenProviderError(`Profile '${z}' is missing required property 'sso_session'.`);
            let H = w.sso_session,
                O = (await FE1.loadSsoSessionData(K))[H];
            if (!O) throw new LT.TokenProviderError(`Sso session '${H}' could not be found in shared credentials file.`, !1);
            for (let M of ["sso_start_url", "sso_region"])
                if (!O[M]) throw new LT.TokenProviderError(`Sso session '${H}' is missing required property '${M}'.`, !1);
            O.sso_start_url;
            let _ = O.sso_region,
                J;
            try {
                J = await FE1.getSSOTokenFromFile(H)
            } catch (M) {
                throw new LT.TokenProviderError(`The SSO session token associated with profile=${z} was not found or is invalid. ${Jc6}`, !1)
            }
            TA1("accessToken", J.accessToken), TA1("expiresAt", J.expiresAt);
            let {
                accessToken: X,
                expiresAt: D
            } = J, j = {
                token: X,
                expiration: new Date(D)
            };
            if (j.expiration.getTime() - Date.now() > IgK) return j;
            if (Date.now() - _Z8.getTime() < 30000) return OZ8(j), j;
            TA1("clientId", J.clientId, !0), TA1("clientSecret", J.clientSecret, !0), TA1("refreshToken", J.refreshToken, !0);
            try {
                _Z8.setTime(Date.now());
                let M = await bgK(J, _, K);
                TA1("accessToken", M.accessToken), TA1("expiresIn", M.expiresIn);
                let P = new Date(Date.now() + M.expiresIn * 1000);
                try {
                    await BgK(H, {
                        ...J,
                        accessToken: M.accessToken,
                        expiresAt: P.toISOString(),
                        refreshToken: M.refreshToken
                    })
                } catch (W) {}
                return {
                    token: M.accessToken,
                    expiration: P
                }
            } catch (M) {
                return OZ8(j), j
            }
        }, mgK = ({
            token: A,
            logger: q
        }) => async () => {
            if (q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new LT.TokenProviderError("Please pass a valid token to fromStatic", !1);
            return A
        }, FgK = (A = {}) => LT.memoize(LT.chain(JZ8(A), async () => {
            throw new LT.TokenProviderError("Could not load token from any providers", !1)
        }), (q) => q.expiration !== void 0 && q.expiration.getTime() - Date.now() < 300000, (q) => q.expiration !== void 0);
    QgK.fromEnvSigningName = hgK;
    QgK.fromSso = JZ8;
    QgK.fromStatic = mgK;
    QgK.nodeProvider = FgK
})
// @from(Ln 70987, Col 4)
Gc6 = R((ogK) => {
    ogK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ogK.HttpAuthLocation || (ogK.HttpAuthLocation = {}));
    ogK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ogK.HttpApiKeyAuthLocation || (ogK.HttpApiKeyAuthLocation = {}));
    ogK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ogK.EndpointURLScheme || (ogK.EndpointURLScheme = {}));
    ogK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ogK.AlgorithmId || (ogK.AlgorithmId = {}));
    var cgK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ogK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ogK.AlgorithmId.MD5,
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
        lgK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        igK = (A) => {
            return cgK(A)
        },
        ngK = (A) => {
            return lgK(A)
        };
    ogK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ogK.FieldPosition || (ogK.FieldPosition = {}));
    var rgK = "__smithy_context";
    ogK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ogK.IniSectionType || (ogK.IniSectionType = {}));
    ogK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ogK.RequestHandlerProtocol || (ogK.RequestHandlerProtocol = {}));
    ogK.SMITHY_CONTEXT_KEY = rgK;
    ogK.getDefaultClientConfiguration = igK;
    ogK.resolveDefaultRuntimeConfig = ngK
})