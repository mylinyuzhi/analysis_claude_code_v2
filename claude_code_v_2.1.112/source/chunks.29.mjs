
// @from(Ln 71727, Col 4)
XE = p(($j3) => {
    var QP8 = Zj1(),
        Jb = sj(),
        Hb = JE(),
        Dc6 = Ac6(),
        dP8 = rj1(),
        oj1 = nw(),
        fO6 = async (q = new Uint8Array, K) => {
            if (q instanceof Uint8Array) return QP8.Uint8ArrayBlobAdapter.mutate(q);
            if (!q) return QP8.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let _ = K.streamCollector(q);
            return QP8.Uint8ArrayBlobAdapter.mutate(await _)
        };

    function Zc6(q) {
        return encodeURIComponent(q).replace(/[!'()*]/g, function(K) {
            return "%" + K.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    class Wv6 {
        serdeContext;
        setSerdeContext(q) {
            this.serdeContext = q
        }
    }
    class cP8 extends Wv6 {
        options;
        constructor(q) {
            super();
            this.options = q
        }
        getRequestType() {
            return Dc6.HttpRequest
        }
        getResponseType() {
            return Dc6.HttpResponse
        }
        setSerdeContext(q) {
            if (this.serdeContext = q, this.serializer.setSerdeContext(q), this.deserializer.setSerdeContext(q), this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(q)
        }
        updateServiceEndpoint(q, K) {
            if ("url" in K) {
                if (q.protocol = K.url.protocol, q.hostname = K.url.hostname, q.port = K.url.port ? Number(K.url.port) : void 0, q.path = K.url.pathname, q.fragment = K.url.hash || void 0, q.username = K.url.username || void 0, q.password = K.url.password || void 0, !q.query) q.query = {};
                for (let [_, z] of K.url.searchParams.entries()) q.query[_] = z;
                return q
            } else return q.protocol = K.protocol, q.hostname = K.hostname, q.port = K.port ? Number(K.port) : void 0, q.path = K.path, q.query = {
                ...K.query
            }, q
        }
        setHostPrefix(q, K, _) {
            let z = Jb.NormalizedSchema.of(K.input),
                Y = Jb.translateTraits(K.traits ?? {});
            if (Y.endpoint) {
                let A = Y.endpoint?.[0];
                if (typeof A === "string") {
                    let O = [...z.structIterator()].filter(([, w]) => w.getMergedTraits().hostLabel);
                    for (let [w] of O) {
                        let $ = _[w];
                        if (typeof $ !== "string") throw Error(`@smithy/core/schema - ${w} in input must be a string as hostLabel.`);
                        A = A.replace(`{${w}}`, $)
                    }
                    q.hostname = A + q.hostname
                }
            }
        }
        deserializeMetadata(q) {
            return {
                httpStatusCode: q.statusCode,
                requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
                extendedRequestId: q.headers["x-amz-id-2"],
                cfId: q.headers["x-amz-cf-id"]
            }
        }
        async serializeEventStream({
            eventStream: q,
            requestSchema: K,
            initialRequest: _
        }) {
            return (await this.loadEventStreamCapability()).serializeEventStream({
                eventStream: q,
                requestSchema: K,
                initialRequest: _
            })
        }
        async deserializeEventStream({
            response: q,
            responseSchema: K,
            initialResponseContainer: _
        }) {
            return (await this.loadEventStreamCapability()).deserializeEventStream({
                response: q,
                responseSchema: K,
                initialResponseContainer: _
            })
        }
        async loadEventStreamCapability() {
            let {
                EventStreamSerde: q
            } = await Promise.resolve().then(() => K6(V8q()));
            return new q({
                marshaller: this.getEventStreamMarshaller(),
                serializer: this.serializer,
                deserializer: this.deserializer,
                serdeContext: this.serdeContext,
                defaultContentType: this.getDefaultContentType()
            })
        }
        getDefaultContentType() {
            throw Error(`@smithy/core/protocols - ${this.constructor.name} getDefaultContentType() implementation missing.`)
        }
        async deserializeHttpMessage(q, K, _, z, Y) {
            return []
        }
        getEventStreamMarshaller() {
            let q = this.serdeContext;
            if (!q.eventStreamMarshaller) throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
            return q.eventStreamMarshaller
        }
    }
    class k8q extends cP8 {
        async serializeRequest(q, K, _) {
            let z = {
                    ...K ?? {}
                },
                Y = this.serializer,
                A = {},
                O = {},
                w = await _.endpoint(),
                $ = Jb.NormalizedSchema.of(q?.input),
                j = $.getSchema(),
                H = !1,
                J, X = new Dc6.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "",
                    fragment: void 0,
                    query: A,
                    headers: O,
                    body: void 0
                });
            if (w) {
                this.updateServiceEndpoint(X, w), this.setHostPrefix(X, q, z);
                let M = Jb.translateTraits(q.traits);
                if (M.http) {
                    X.method = M.http[0];
                    let [P, W] = M.http[1].split("?");
                    if (X.path == "/") X.path = P;
                    else X.path += P;
                    let D = new URLSearchParams(W ?? "");
                    Object.assign(A, Object.fromEntries(D))
                }
            }
            for (let [M, P] of $.structIterator()) {
                let W = P.getMergedTraits() ?? {},
                    D = z[M];
                if (D == null && !P.isIdempotencyToken()) continue;
                if (W.httpPayload) {
                    if (P.isStreaming())
                        if (P.isStructSchema()) {
                            if (z[M]) J = await this.serializeEventStream({
                                eventStream: z[M],
                                requestSchema: $
                            })
                        } else J = D;
                    else Y.write(P, D), J = Y.flush();
                    delete z[M]
                } else if (W.httpLabel) {
                    Y.write(P, D);
                    let Z = Y.flush();
                    if (X.path.includes(`{${M}+}`)) X.path = X.path.replace(`{${M}+}`, Z.split("/").map(Zc6).join("/"));
                    else if (X.path.includes(`{${M}}`)) X.path = X.path.replace(`{${M}}`, Zc6(Z));
                    delete z[M]
                } else if (W.httpHeader) Y.write(P, D), O[W.httpHeader.toLowerCase()] = String(Y.flush()), delete z[M];
                else if (typeof W.httpPrefixHeaders === "string") {
                    for (let [Z, G] of Object.entries(D)) {
                        let f = W.httpPrefixHeaders + Z;
                        Y.write([P.getValueSchema(), {
                            httpHeader: f
                        }], G), O[f.toLowerCase()] = Y.flush()
                    }
                    delete z[M]
                } else if (W.httpQuery || W.httpQueryParams) this.serializeQuery(P, D, A), delete z[M];
                else H = !0
            }
            if (H && z) Y.write(j, z), J = Y.flush();
            return X.headers = O, X.query = A, X.body = J, X
        }
        serializeQuery(q, K, _) {
            let z = this.serializer,
                Y = q.getMergedTraits();
            if (Y.httpQueryParams) {
                for (let [A, O] of Object.entries(K))
                    if (!(A in _)) {
                        let w = q.getValueSchema();
                        Object.assign(w.getMergedTraits(), {
                            ...Y,
                            httpQuery: A,
                            httpQueryParams: void 0
                        }), this.serializeQuery(w, O, _)
                    } return
            }
            if (q.isListSchema()) {
                let A = !!q.getMergedTraits().sparse,
                    O = [];
                for (let w of K) {
                    z.write([q.getValueSchema(), Y], w);
                    let $ = z.flush();
                    if (A || $ !== void 0) O.push($)
                }
                _[Y.httpQuery] = O
            } else z.write([q, Y], K), _[Y.httpQuery] = z.flush()
        }
        async deserializeResponse(q, K, _) {
            let z = this.deserializer,
                Y = Jb.NormalizedSchema.of(q.output),
                A = {};
            if (_.statusCode >= 300) {
                let w = await fO6(_.body, K);
                if (w.byteLength > 0) Object.assign(A, await z.read(15, w));
                throw await this.handleError(q, K, _, A, this.deserializeMetadata(_)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.")
            }
            for (let w in _.headers) {
                let $ = _.headers[w];
                delete _.headers[w], _.headers[w.toLowerCase()] = $
            }
            let O = await this.deserializeHttpMessage(Y, K, _, A);
            if (O.length) {
                let w = await fO6(_.body, K);
                if (w.byteLength > 0) {
                    let $ = await z.read(Y, w);
                    for (let j of O) A[j] = $[j]
                }
            } else if (O.discardResponseBody) await fO6(_.body, K);
            return A.$metadata = this.deserializeMetadata(_), A
        }
        async deserializeHttpMessage(q, K, _, z, Y) {
            let A;
            if (z instanceof Set) A = Y;
            else A = z;
            let O = !0,
                w = this.deserializer,
                $ = Jb.NormalizedSchema.of(q),
                j = [];
            for (let [H, J] of $.structIterator()) {
                let X = J.getMemberTraits();
                if (X.httpPayload) {
                    if (O = !1, J.isStreaming())
                        if (J.isStructSchema()) A[H] = await this.deserializeEventStream({
                            response: _,
                            responseSchema: $
                        });
                        else A[H] = QP8.sdkStreamMixin(_.body);
                    else if (_.body) {
                        let P = await fO6(_.body, K);
                        if (P.byteLength > 0) A[H] = await w.read(J, P)
                    }
                } else if (X.httpHeader) {
                    let M = String(X.httpHeader).toLowerCase(),
                        P = _.headers[M];
                    if (P != null)
                        if (J.isListSchema()) {
                            let W = J.getValueSchema();
                            W.getMergedTraits().httpHeader = M;
                            let D;
                            if (W.isTimestampSchema() && W.getSchema() === 4) D = Hb.splitEvery(P, ",", 2);
                            else D = Hb.splitHeader(P);
                            let Z = [];
                            for (let G of D) Z.push(await w.read(W, G.trim()));
                            A[H] = Z
                        } else A[H] = await w.read(J, P)
                } else if (X.httpPrefixHeaders !== void 0) {
                    A[H] = {};
                    for (let [M, P] of Object.entries(_.headers))
                        if (M.startsWith(X.httpPrefixHeaders)) {
                            let W = J.getValueSchema();
                            W.getMergedTraits().httpHeader = M, A[H][M.slice(X.httpPrefixHeaders.length)] = await w.read(W, P)
                        }
                } else if (X.httpResponseCode) A[H] = _.statusCode;
                else j.push(H)
            }
            return j.discardResponseBody = O, j
        }
    }
    class N8q extends cP8 {
        async serializeRequest(q, K, _) {
            let z = this.serializer,
                Y = {},
                A = {},
                O = await _.endpoint(),
                w = Jb.NormalizedSchema.of(q?.input),
                $ = w.getSchema(),
                j, H = new Dc6.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "/",
                    fragment: void 0,
                    query: Y,
                    headers: A,
                    body: void 0
                });
            if (O) this.updateServiceEndpoint(H, O), this.setHostPrefix(H, q, K);
            let J = {
                ...K
            };
            if (K) {
                let X = w.getEventStreamMember();
                if (X) {
                    if (J[X]) {
                        let M = {};
                        for (let [P, W] of w.structIterator())
                            if (P !== X && J[P]) z.write(W, J[P]), M[P] = z.flush();
                        j = await this.serializeEventStream({
                            eventStream: J[X],
                            requestSchema: w,
                            initialRequest: M
                        })
                    }
                } else z.write($, J), j = z.flush()
            }
            return H.headers = A, H.query = Y, H.body = j, H.method = "POST", H
        }
        async deserializeResponse(q, K, _) {
            let z = this.deserializer,
                Y = Jb.NormalizedSchema.of(q.output),
                A = {};
            if (_.statusCode >= 300) {
                let w = await fO6(_.body, K);
                if (w.byteLength > 0) Object.assign(A, await z.read(15, w));
                throw await this.handleError(q, K, _, A, this.deserializeMetadata(_)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.")
            }
            for (let w in _.headers) {
                let $ = _.headers[w];
                delete _.headers[w], _.headers[w.toLowerCase()] = $
            }
            let O = Y.getEventStreamMember();
            if (O) A[O] = await this.deserializeEventStream({
                response: _,
                responseSchema: Y,
                initialResponseContainer: A
            });
            else {
                let w = await fO6(_.body, K);
                if (w.byteLength > 0) Object.assign(A, await z.read(Y, w))
            }
            return A.$metadata = this.deserializeMetadata(_), A
        }
    }
    var E8q = (q, K, _, z, Y, A) => {
        if (K != null && K[_] !== void 0) {
            let O = z();
            if (O.length <= 0) throw Error("Empty value provided for input HTTP label: " + _ + ".");
            q = q.replace(Y, A ? O.split("/").map((w) => Zc6(w)).join("/") : Zc6(O))
        } else throw Error("No value provided for input HTTP label: " + _ + ".");
        return q
    };

    function wj3(q, K) {
        return new aj1(q, K)
    }
    class aj1 {
        input;
        context;
        query = {};
        method = "";
        headers = {};
        path = "";
        body = null;
        hostname = "";
        resolvePathStack = [];
        constructor(q, K) {
            this.input = q, this.context = K
        }
        async build() {
            let {
                hostname: q,
                protocol: K = "https",
                port: _,
                path: z
            } = await this.context.endpoint();
            this.path = z;
            for (let Y of this.resolvePathStack) Y(this.path);
            return new Dc6.HttpRequest({
                protocol: K,
                hostname: this.hostname || q,
                port: _,
                method: this.method,
                path: this.path,
                query: this.query,
                body: this.body,
                headers: this.headers
            })
        }
        hn(q) {
            return this.hostname = q, this
        }
        bp(q) {
            return this.resolvePathStack.push((K) => {
                this.path = `${K?.endsWith("/")?K.slice(0,-1):K||""}` + q
            }), this
        }
        p(q, K, _, z) {
            return this.resolvePathStack.push((Y) => {
                this.path = E8q(Y, this.input, q, K, _, z)
            }), this
        }
        h(q) {
            return this.headers = q, this
        }
        q(q) {
            return this.query = q, this
        }
        b(q) {
            return this.body = q, this
        }
        m(q) {
            return this.method = q, this
        }
    }

    function sj1(q, K) {
        if (K.timestampFormat.useTrait) {
            if (q.isTimestampSchema() && (q.getSchema() === 5 || q.getSchema() === 6 || q.getSchema() === 7)) return q.getSchema()
        }
        let {
            httpLabel: _,
            httpPrefixHeaders: z,
            httpHeader: Y,
            httpQuery: A
        } = q.getMergedTraits();
        return (K.httpBindings ? typeof z === "string" || Boolean(Y) ? 6 : Boolean(A) || Boolean(_) ? 5 : void 0 : void 0) ?? K.timestampFormat.default
    }
    class tj1 extends Wv6 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        read(q, K) {
            let _ = Jb.NormalizedSchema.of(q);
            if (_.isListSchema()) return Hb.splitHeader(K).map((z) => this.read(_.getValueSchema(), z));
            if (_.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? dP8.fromBase64)(K);
            if (_.isTimestampSchema()) switch (sj1(_, this.settings)) {
                case 5:
                    return Hb._parseRfc3339DateTimeWithOffset(K);
                case 6:
                    return Hb._parseRfc7231DateTime(K);
                case 7:
                    return Hb._parseEpochTimestamp(K);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", K), new Date(K)
            }
            if (_.isStringSchema()) {
                let z = _.getMergedTraits().mediaType,
                    Y = K;
                if (z) {
                    if (_.getMergedTraits().httpHeader) Y = this.base64ToUtf8(Y);
                    if (z === "application/json" || z.endsWith("+json")) Y = Hb.LazyJsonString.from(Y);
                    return Y
                }
            }
            if (_.isNumericSchema()) return Number(K);
            if (_.isBigIntegerSchema()) return BigInt(K);
            if (_.isBigDecimalSchema()) return new Hb.NumericValue(K, "bigDecimal");
            if (_.isBooleanSchema()) return String(K).toLowerCase() === "true";
            return K
        }
        base64ToUtf8(q) {
            return (this.serdeContext?.utf8Encoder ?? oj1.toUtf8)((this.serdeContext?.base64Decoder ?? dP8.fromBase64)(q))
        }
    }
    class y8q extends Wv6 {
        codecDeserializer;
        stringDeserializer;
        constructor(q, K) {
            super();
            this.codecDeserializer = q, this.stringDeserializer = new tj1(K)
        }
        setSerdeContext(q) {
            this.stringDeserializer.setSerdeContext(q), this.codecDeserializer.setSerdeContext(q), this.serdeContext = q
        }
        read(q, K) {
            let _ = Jb.NormalizedSchema.of(q),
                z = _.getMergedTraits(),
                Y = this.serdeContext?.utf8Encoder ?? oj1.toUtf8;
            if (z.httpHeader || z.httpResponseCode) return this.stringDeserializer.read(_, Y(K));
            if (z.httpPayload) {
                if (_.isBlobSchema()) {
                    let A = this.serdeContext?.utf8Decoder ?? oj1.fromUtf8;
                    if (typeof K === "string") return A(K);
                    return K
                } else if (_.isStringSchema()) {
                    if ("byteLength" in K) return Y(K);
                    return K
                }
            }
            return this.codecDeserializer.read(_, K)
        }
    }
    class ej1 extends Wv6 {
        settings;
        stringBuffer = "";
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K) {
            let _ = Jb.NormalizedSchema.of(q);
            switch (typeof K) {
                case "object":
                    if (K === null) {
                        this.stringBuffer = "null";
                        return
                    }
                    if (_.isTimestampSchema()) {
                        if (!(K instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${K} when schema expected Date in ${_.getName(!0)}`);
                        switch (sj1(_, this.settings)) {
                            case 5:
                                this.stringBuffer = K.toISOString().replace(".000Z", "Z");
                                break;
                            case 6:
                                this.stringBuffer = Hb.dateToUtcString(K);
                                break;
                            case 7:
                                this.stringBuffer = String(K.getTime() / 1000);
                                break;
                            default:
                                console.warn("Missing timestamp format, using epoch seconds", K), this.stringBuffer = String(K.getTime() / 1000)
                        }
                        return
                    }
                    if (_.isBlobSchema() && "byteLength" in K) {
                        this.stringBuffer = (this.serdeContext?.base64Encoder ?? dP8.toBase64)(K);
                        return
                    }
                    if (_.isListSchema() && Array.isArray(K)) {
                        let A = "";
                        for (let O of K) {
                            this.write([_.getValueSchema(), _.getMergedTraits()], O);
                            let w = this.flush(),
                                $ = _.getValueSchema().isTimestampSchema() ? w : Hb.quoteHeader(w);
                            if (A !== "") A += ", ";
                            A += $
                        }
                        this.stringBuffer = A;
                        return
                    }
                    this.stringBuffer = JSON.stringify(K, null, 2);
                    break;
                case "string":
                    let z = _.getMergedTraits().mediaType,
                        Y = K;
                    if (z) {
                        if (z === "application/json" || z.endsWith("+json")) Y = Hb.LazyJsonString.from(Y);
                        if (_.getMergedTraits().httpHeader) {
                            this.stringBuffer = (this.serdeContext?.base64Encoder ?? dP8.toBase64)(Y.toString());
                            return
                        }
                    }
                    this.stringBuffer = K;
                    break;
                default:
                    if (_.isIdempotencyToken()) this.stringBuffer = Hb.generateIdempotencyToken();
                    else this.stringBuffer = String(K)
            }
        }
        flush() {
            let q = this.stringBuffer;
            return this.stringBuffer = "", q
        }
    }
    class L8q {
        codecSerializer;
        stringSerializer;
        buffer;
        constructor(q, K, _ = new ej1(K)) {
            this.codecSerializer = q, this.stringSerializer = _
        }
        setSerdeContext(q) {
            this.codecSerializer.setSerdeContext(q), this.stringSerializer.setSerdeContext(q)
        }
        write(q, K) {
            let _ = Jb.NormalizedSchema.of(q),
                z = _.getMergedTraits();
            if (z.httpHeader || z.httpLabel || z.httpQuery) {
                this.stringSerializer.write(_, K), this.buffer = this.stringSerializer.flush();
                return
            }
            return this.codecSerializer.write(_, K)
        }
        flush() {
            if (this.buffer !== void 0) {
                let q = this.buffer;
                return this.buffer = void 0, q
            }
            return this.codecSerializer.flush()
        }
    }
    $j3.FromStringShapeDeserializer = tj1;
    $j3.HttpBindingProtocol = k8q;
    $j3.HttpInterceptingShapeDeserializer = y8q;
    $j3.HttpInterceptingShapeSerializer = L8q;
    $j3.HttpProtocol = cP8;
    $j3.RequestBuilder = aj1;
    $j3.RpcProtocol = N8q;
    $j3.SerdeContext = Wv6;
    $j3.ToStringShapeSerializer = ej1;
    $j3.collectBody = fO6;
    $j3.determineTimestampFormat = sj1;
    $j3.extendedEncodeURIComponent = Zc6;
    $j3.requestBuilder = wj3;
    $j3.resolvedPath = E8q
})
// @from(Ln 72341, Col 4)
g8q = p((Zv6) => {
    var S8q = gU(),
        YH1 = XE(),
        KH1 = qj1(),
        kj3 = sj(),
        h8q = JE();
    class C8q {
        config;
        middlewareStack = S8q.constructStack();
        initConfig;
        handlers;
        constructor(q) {
            this.config = q
        }
        send(q, K, _) {
            let z = typeof K !== "function" ? K : void 0,
                Y = typeof K === "function" ? K : _,
                A = z === void 0 && this.config.cacheMiddleware === !0,
                O;
            if (A) {
                if (!this.handlers) this.handlers = new WeakMap;
                let w = this.handlers;
                if (w.has(q.constructor)) O = w.get(q.constructor);
                else O = q.resolveMiddleware(this.middlewareStack, this.config, z), w.set(q.constructor, O)
            } else delete this.handlers, O = q.resolveMiddleware(this.middlewareStack, this.config, z);
            if (Y) O(q).then((w) => Y(null, w.output), (w) => Y(w)).catch(() => {});
            else return O(q).then((w) => w.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var qH1 = "***SensitiveInformation***";

    function _H1(q, K) {
        if (K == null) return K;
        let _ = kj3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return qH1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return qH1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return qH1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = _H1(O, z[A]);
            return Y
        }
        return K
    }
    class AH1 {
        middlewareStack = S8q.constructStack();
        schema;
        static classBuilder() {
            return new b8q
        }
        resolveMiddlewareWithContext(q, K, _, {
            middlewareFn: z,
            clientName: Y,
            commandName: A,
            inputFilterSensitiveLog: O,
            outputFilterSensitiveLog: w,
            smithyContext: $,
            additionalContext: j,
            CommandCtor: H
        }) {
            for (let W of z.bind(this)(H, q, K, _)) this.middlewareStack.use(W);
            let J = q.concat(this.middlewareStack),
                {
                    logger: X
                } = K,
                M = {
                    logger: X,
                    clientName: Y,
                    commandName: A,
                    inputFilterSensitiveLog: O,
                    outputFilterSensitiveLog: w,
                    [KH1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...j
                },
                {
                    requestHandler: P
                } = K;
            return J.resolve((W) => P.handle(W.request, _ || {}), M)
        }
    }
    class b8q {
        _init = () => {};
        _ep = {};
        _middlewareFn = () => [];
        _commandName = "";
        _clientName = "";
        _additionalContext = {};
        _smithyContext = {};
        _inputFilterSensitiveLog = void 0;
        _outputFilterSensitiveLog = void 0;
        _serializer = null;
        _deserializer = null;
        _operationSchema;
        init(q) {
            this._init = q
        }
        ep(q) {
            return this._ep = q, this
        }
        m(q) {
            return this._middlewareFn = q, this
        }
        s(q, K, _ = {}) {
            return this._smithyContext = {
                service: q,
                operation: K,
                ..._
            }, this
        }
        c(q = {}) {
            return this._additionalContext = q, this
        }
        n(q, K) {
            return this._clientName = q, this._commandName = K, this
        }
        f(q = (_) => _, K = (_) => _) {
            return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
        }
        ser(q) {
            return this._serializer = q, this
        }
        de(q) {
            return this._deserializer = q, this
        }
        sc(q) {
            return this._operationSchema = q, this._smithyContext.operationSchema = q, this
        }
        build() {
            let q = this,
                K;
            return K = class extends AH1 {
                input;
                static getEndpointParameterInstructions() {
                    return q._ep
                }
                constructor(...[_]) {
                    super();
                    this.input = _ ?? {}, q._init(this), this.schema = q._operationSchema
                }
                resolveMiddleware(_, z, Y) {
                    let A = q._operationSchema,
                        O = A?.[4] ?? A?.input,
                        w = A?.[5] ?? A?.output;
                    return this.resolveMiddlewareWithContext(_, z, Y, {
                        CommandCtor: K,
                        middlewareFn: q._middlewareFn,
                        clientName: q._clientName,
                        commandName: q._commandName,
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? _H1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? _H1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var Nj3 = "***SensitiveInformation***",
        Ej3 = (q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        };
    class Dv6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(q) {
            super(q.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return Dv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === Dv6) return Dv6.isInstance(q);
            if (Dv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var I8q = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        x8q = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = Lj3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw I8q(O, K)
        },
        yj3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                x8q({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        Lj3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        hj3 = (q) => {
            switch (q) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        },
        R8q = !1,
        Rj3 = (q) => {
            if (q && !R8q && parseInt(q.substring(1, q.indexOf("."))) < 16) R8q = !0
        },
        Sj3 = (q) => {
            let K = [];
            for (let _ in KH1.AlgorithmId) {
                let z = KH1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        Cj3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        bj3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        Ij3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        u8q = (q) => {
            return Object.assign(Sj3(q), bj3(q))
        },
        xj3 = u8q,
        uj3 = (q) => {
            return Object.assign(Cj3(q), Ij3(q))
        },
        mj3 = (q) => Array.isArray(q) ? q : [q],
        m8q = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = m8q(q[_]);
            return q
        },
        Bj3 = (q) => {
            return q != null
        };
    class B8q {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function p8q(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, gj3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            F8q(z, null, A, O)
        }
        return z
    }
    var pj3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        Fj3 = (q, K) => {
            let _ = {};
            for (let z in K) F8q(_, q, K, z);
            return _
        },
        gj3 = (q, K, _) => {
            return p8q(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        F8q = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = Uj3, $ = Qj3, j = z] = O;
                if (typeof w === "function" && w(K[j]) || typeof w !== "function" && !!w) q[z] = $(K[j]);
                return
            }
            let [Y, A] = _[z];
            if (typeof A === "function") {
                let O, w = Y === void 0 && (O = A()) != null,
                    $ = typeof Y === "function" && !!Y(void 0) || typeof Y !== "function" && !!Y;
                if (w) q[z] = O;
                else if ($) q[z] = A()
            } else {
                let O = Y === void 0 && A != null,
                    w = typeof Y === "function" && !!Y(A) || typeof Y !== "function" && !!Y;
                if (O || w) q[z] = A
            }
        },
        Uj3 = (q) => q != null,
        Qj3 = (q) => q,
        dj3 = (q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        },
        cj3 = (q) => q.toISOString().replace(".000Z", "Z"),
        zH1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(zH1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = zH1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(Zv6, "collectBody", {
        enumerable: !0,
        get: function() {
            return YH1.collectBody
        }
    });
    Object.defineProperty(Zv6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return YH1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Zv6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return YH1.resolvedPath
        }
    });
    Zv6.Client = C8q;
    Zv6.Command = AH1;
    Zv6.NoOpLogger = B8q;
    Zv6.SENSITIVE_STRING = Nj3;
    Zv6.ServiceException = Dv6;
    Zv6._json = zH1;
    Zv6.convertMap = pj3;
    Zv6.createAggregatedClient = Ej3;
    Zv6.decorateServiceException = I8q;
    Zv6.emitWarningIfUnsupportedVersion = Rj3;
    Zv6.getArrayIfSingleItem = mj3;
    Zv6.getDefaultClientConfiguration = xj3;
    Zv6.getDefaultExtensionConfiguration = u8q;
    Zv6.getValueFromTextNode = m8q;
    Zv6.isSerializableHeaderValue = Bj3;
    Zv6.loadConfigsForDefaultMode = hj3;
    Zv6.map = p8q;
    Zv6.resolveDefaultRuntimeConfig = uj3;
    Zv6.serializeDateTime = cj3;
    Zv6.serializeFloat = dj3;
    Zv6.take = Fj3;
    Zv6.throwDefaultError = x8q;
    Zv6.withBaseException = yj3;
    Object.keys(h8q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Zv6, q)) Object.defineProperty(Zv6, q, {
            enumerable: !0,
            get: function() {
                return h8q[q]
            }
        })
    })
})
// @from(Ln 72811, Col 4)
Q8q = p((U8q) => {
    Object.defineProperty(U8q, "__esModule", {
        value: !0
    });
    U8q.createGetRequest = ZH3;
    U8q.getCredentials = fH3;
    var OH1 = jP(),
        PH3 = qe7(),
        WH3 = g8q(),
        DH3 = Zj1();

    function ZH3(q) {
        return new PH3.HttpRequest({
            protocol: q.protocol,
            hostname: q.hostname,
            port: Number(q.port),
            path: q.pathname,
            query: Array.from(q.searchParams.entries()).reduce((K, [_, z]) => {
                return K[_] = z, K
            }, {}),
            fragment: q.hash
        })
    }
    async function fH3(q, K) {
        let z = await (0, DH3.sdkStreamMixin)(q.body).transformToString();
        if (q.statusCode === 200) {
            let Y = JSON.parse(z);
            if (typeof Y.AccessKeyId !== "string" || typeof Y.SecretAccessKey !== "string" || typeof Y.Token !== "string" || typeof Y.Expiration !== "string") throw new OH1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
                logger: K
            });
            return {
                accessKeyId: Y.AccessKeyId,
                secretAccessKey: Y.SecretAccessKey,
                sessionToken: Y.Token,
                expiration: (0, WH3.parseRfc3339DateTime)(Y.Expiration)
            }
        }
        if (q.statusCode >= 400 && q.statusCode < 500) {
            let Y = {};
            try {
                Y = JSON.parse(z)
            } catch (A) {}
            throw Object.assign(new OH1.CredentialsProviderError(`Server responded with status: ${q.statusCode}`, {
                logger: K
            }), {
                Code: Y.Code,
                Message: Y.Message
            })
        }
        throw new OH1.CredentialsProviderError(`Server responded with status: ${q.statusCode}`, {
            logger: K
        })
    }
})
// @from(Ln 72865, Col 4)
l8q = p((d8q) => {
    Object.defineProperty(d8q, "__esModule", {
        value: !0
    });
    d8q.retryWrapper = void 0;
    var TH3 = (q, K, _) => {
        return async () => {
            for (let z = 0; z < K; ++z) try {
                return await q()
            } catch (Y) {
                await new Promise((A) => setTimeout(A, _))
            }
            return await q()
        }
    };
    d8q.retryWrapper = TH3
})
// @from(Ln 72882, Col 4)
a8q = p((r8q) => {
    Object.defineProperty(r8q, "__esModule", {
        value: !0
    });
    r8q.fromHttp = void 0;
    var VH3 = IV(),
        kH3 = $E(),
        NH3 = wE(),
        n8q = jP(),
        EH3 = VH3.__importDefault(d6("fs/promises")),
        yH3 = at7(),
        i8q = Q8q(),
        LH3 = l8q(),
        hH3 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        RH3 = "http://169.254.170.2",
        SH3 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        CH3 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
        bH3 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        IH3 = (q = {}) => {
            q.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
            let K, _ = q.awsContainerCredentialsRelativeUri ?? process.env[hH3],
                z = q.awsContainerCredentialsFullUri ?? process.env[SH3],
                Y = q.awsContainerAuthorizationToken ?? process.env[bH3],
                A = q.awsContainerAuthorizationTokenFile ?? process.env[CH3],
                O = q.logger?.constructor?.name === "NoOpLogger" || !q.logger?.warn ? console.warn : q.logger.warn.bind(q.logger);
            if (_ && z) O("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), O("awsContainerCredentialsFullUri will take precedence.");
            if (Y && A) O("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), O("awsContainerAuthorizationToken will take precedence.");
            if (z) K = z;
            else if (_) K = `${RH3}${_}`;
            else throw new n8q.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
                logger: q.logger
            });
            let w = new URL(K);
            (0, yH3.checkUrl)(w, q.logger);
            let $ = NH3.NodeHttpHandler.create({
                requestTimeout: q.timeout ?? 1000,
                connectionTimeout: q.timeout ?? 1000
            });
            return (0, LH3.retryWrapper)(async () => {
                let j = (0, i8q.createGetRequest)(w);
                if (Y) j.headers.Authorization = Y;
                else if (A) j.headers.Authorization = (await EH3.default.readFile(A)).toString();
                try {
                    let H = await $.handle(j);
                    return (0, i8q.getCredentials)(H.response).then((J) => (0, kH3.setCredentialFeature)(J, "CREDENTIALS_HTTP", "z"))
                } catch (H) {
                    throw new n8q.CredentialsProviderError(String(H), {
                        logger: q.logger
                    })
                }
            }, q.maxRetries ?? 3, q.timeout ?? 1000)
        };
    r8q.fromHttp = IH3
})
// @from(Ln 72937, Col 4)
lP8 = p((wH1) => {
    Object.defineProperty(wH1, "__esModule", {
        value: !0
    });
    wH1.fromHttp = void 0;
    var xH3 = a8q();
    Object.defineProperty(wH1, "fromHttp", {
        enumerable: !0,
        get: function() {
            return xH3.fromHttp
        }
    })
})
// @from(Ln 72950, Col 4)
PH1 = p((UH3) => {
    UH3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(UH3.HttpAuthLocation || (UH3.HttpAuthLocation = {}));
    UH3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(UH3.HttpApiKeyAuthLocation || (UH3.HttpApiKeyAuthLocation = {}));
    UH3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(UH3.EndpointURLScheme || (UH3.EndpointURLScheme = {}));
    UH3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(UH3.AlgorithmId || (UH3.AlgorithmId = {}));
    var mH3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => UH3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => UH3.AlgorithmId.MD5,
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
        BH3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        pH3 = (q) => {
            return mH3(q)
        },
        FH3 = (q) => {
            return BH3(q)
        };
    UH3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(UH3.FieldPosition || (UH3.FieldPosition = {}));
    var gH3 = "__smithy_context";
    UH3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(UH3.IniSectionType || (UH3.IniSectionType = {}));
    UH3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(UH3.RequestHandlerProtocol || (UH3.RequestHandlerProtocol = {}));
    UH3.SMITHY_CONTEXT_KEY = gH3;
    UH3.getDefaultClientConfiguration = pH3;
    UH3.resolveDefaultRuntimeConfig = FH3
})
// @from(Ln 73015, Col 4)
iP8 = p((aH3) => {
    var lH3 = PH1(),
        nH3 = (q) => {
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
        iH3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class s8q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = lH3.FieldPosition.HEADER,
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
    class t8q {
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
    class nP8 {
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
            let K = new nP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = rH3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return nP8.clone(this)
        }
    }

    function rH3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class e8q {
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

    function oH3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    aH3.Field = s8q;
    aH3.Fields = t8q;
    aH3.HttpRequest = nP8;
    aH3.HttpResponse = e8q;
    aH3.getHttpHandlerExtensionConfiguration = nH3;
    aH3.isValidHostname = oH3;
    aH3.resolveHttpHandlerRuntimeConfig = iH3
})
// @from(Ln 73157, Col 4)
q1q = p((jJ3) => {
    jJ3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(jJ3.HttpAuthLocation || (jJ3.HttpAuthLocation = {}));
    jJ3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(jJ3.HttpApiKeyAuthLocation || (jJ3.HttpApiKeyAuthLocation = {}));
    jJ3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(jJ3.EndpointURLScheme || (jJ3.EndpointURLScheme = {}));
    jJ3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(jJ3.AlgorithmId || (jJ3.AlgorithmId = {}));
    var YJ3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => jJ3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => jJ3.AlgorithmId.MD5,
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
        AJ3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        OJ3 = (q) => {
            return YJ3(q)
        },
        wJ3 = (q) => {
            return AJ3(q)
        };
    jJ3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(jJ3.FieldPosition || (jJ3.FieldPosition = {}));
    var $J3 = "__smithy_context";
    jJ3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(jJ3.IniSectionType || (jJ3.IniSectionType = {}));
    jJ3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(jJ3.RequestHandlerProtocol || (jJ3.RequestHandlerProtocol = {}));
    jJ3.SMITHY_CONTEXT_KEY = $J3;
    jJ3.getDefaultClientConfiguration = OJ3;
    jJ3.resolveDefaultRuntimeConfig = wJ3
})
// @from(Ln 73222, Col 4)
Y1q = p((fJ3) => {
    var MJ3 = q1q(),
        PJ3 = (q) => {
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
        WJ3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class K1q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = MJ3.FieldPosition.HEADER,
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
    class _1q {
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
    class rP8 {
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
            let K = new rP8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = DJ3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return rP8.clone(this)
        }
    }

    function DJ3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class z1q {
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

    function ZJ3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    fJ3.Field = K1q;
    fJ3.Fields = _1q;
    fJ3.HttpRequest = rP8;
    fJ3.HttpResponse = z1q;
    fJ3.getHttpHandlerExtensionConfiguration = PJ3;
    fJ3.isValidHostname = ZJ3;
    fJ3.resolveHttpHandlerRuntimeConfig = WJ3
})
// @from(Ln 73364, Col 4)
VH1 = p((hJ3) => {
    var yJ3 = Y1q(),
        A1q = (q, K) => (_, z) => async (Y) => {
            let {
                response: A
            } = await _(Y);
            try {
                let O = await K(A, q);
                return {
                    response: A,
                    output: O
                }
            } catch (O) {
                if (Object.defineProperty(O, "$response", {
                        value: A,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in O)) {
                    try {
                        O.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch ($) {
                        if (!z.logger || z.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else z.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof O.$responseBodyText < "u") {
                        if (O.$response) O.$response.body = O.$responseBodyText
                    }
                    try {
                        if (yJ3.HttpResponse.isInstance(A)) {
                            let {
                                headers: $ = {}
                            } = A, j = Object.entries($);
                            O.$metadata = {
                                httpStatusCode: A.statusCode,
                                requestId: TH1(/^x-[\w-]+-request-?id$/, j),
                                extendedRequestId: TH1(/^x-[\w-]+-id-2$/, j),
                                cfId: TH1(/^x-[\w-]+-cf-id$/, j)
                            }
                        }
                    } catch ($) {}
                }
                throw O
            }
        }, TH1 = (q, K) => {
            return (K.find(([_]) => {
                return _.match(q)
            }) || [void 0, void 0])[1]
        }, O1q = (q, K) => (_, z) => async (Y) => {
            let A = q,
                O = z.endpointV2?.url && A.urlParser ? async () => A.urlParser(z.endpointV2.url): A.endpoint;
            if (!O) throw Error("No valid endpoint provider available.");
            let w = await K(Y.input, {
                ...q,
                endpoint: O
            });
            return _({
                ...Y,
                request: w
            })
        }, w1q = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, $1q = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function LJ3(q, K, _) {
        return {
            applyToStack: (z) => {
                z.add(A1q(q, _), w1q), z.add(O1q(q, K), $1q)
            }
        }
    }
    hJ3.deserializerMiddleware = A1q;
    hJ3.deserializerMiddlewareOption = w1q;
    hJ3.getSerdePlugin = LJ3;
    hJ3.serializerMiddleware = O1q;
    hJ3.serializerMiddlewareOption = $1q
})
// @from(Ln 73450, Col 4)
FO = p((T1q) => {
    var oP8 = Nj1(),
        j1q = Dv(),
        xJ3 = VH1(),
        kH1 = Ac6(),
        uJ3 = XE(),
        mJ3 = (q) => q[oP8.SMITHY_CONTEXT_KEY] || (q[oP8.SMITHY_CONTEXT_KEY] = {}),
        BJ3 = (q, K) => {
            if (!K || K.length === 0) return q;
            let _ = [];
            for (let z of K)
                for (let Y of q)
                    if (Y.schemeId.split("#")[1] === z) _.push(Y);
            for (let z of q)
                if (!_.find(({
                        schemeId: Y
                    }) => Y === z.schemeId)) _.push(z);
            return _
        };

    function pJ3(q) {
        let K = new Map;
        for (let _ of q) K.set(_.schemeId, _);
        return K
    }
    var NH1 = (q, K) => (_, z) => async (Y) => {
        let A = q.httpAuthSchemeProvider(await K.httpAuthSchemeParametersProvider(q, z, Y.input)),
            O = q.authSchemePreference ? await q.authSchemePreference() : [],
            w = BJ3(A, O),
            $ = pJ3(q.httpAuthSchemes),
            j = j1q.getSmithyContext(z),
            H = [];
        for (let J of w) {
            let X = $.get(J.schemeId);
            if (!X) {
                H.push(`HttpAuthScheme \`${J.schemeId}\` was not enabled for this service.`);
                continue
            }
            let M = X.identityProvider(await K.identityProviderConfigProvider(q));
            if (!M) {
                H.push(`HttpAuthScheme \`${J.schemeId}\` did not have an IdentityProvider configured.`);
                continue
            }
            let {
                identityProperties: P = {},
                signingProperties: W = {}
            } = J.propertiesExtractor?.(q, z) || {};
            J.identityProperties = Object.assign(J.identityProperties || {}, P), J.signingProperties = Object.assign(J.signingProperties || {}, W), j.selectedHttpAuthScheme = {
                httpAuthOption: J,
                identity: await M(J.identityProperties),
                signer: X.signer
            };
            break
        }
        if (!j.selectedHttpAuthScheme) throw Error(H.join(`
`));
        return _(Y)
    }, H1q = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: "endpointV2Middleware"
    }, FJ3 = (q, {
        httpAuthSchemeParametersProvider: K,
        identityProviderConfigProvider: _
    }) => ({
        applyToStack: (z) => {
            z.addRelativeTo(NH1(q, {
                httpAuthSchemeParametersProvider: K,
                identityProviderConfigProvider: _
            }), H1q)
        }
    }), J1q = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: xJ3.serializerMiddlewareOption.name
    }, gJ3 = (q, {
        httpAuthSchemeParametersProvider: K,
        identityProviderConfigProvider: _
    }) => ({
        applyToStack: (z) => {
            z.addRelativeTo(NH1(q, {
                httpAuthSchemeParametersProvider: K,
                identityProviderConfigProvider: _
            }), J1q)
        }
    }), UJ3 = (q) => (K) => {
        throw K
    }, QJ3 = (q, K) => {}, X1q = (q) => (K, _) => async (z) => {
        if (!kH1.HttpRequest.isInstance(z.request)) return K(z);
        let A = j1q.getSmithyContext(_).selectedHttpAuthScheme;
        if (!A) throw Error("No HttpAuthScheme was selected: unable to sign request");
        let {
            httpAuthOption: {
                signingProperties: O = {}
            },
            identity: w,
            signer: $
        } = A, j = await K({
            ...z,
            request: await $.sign(z.request, w, O)
        }).catch(($.errorHandler || UJ3)(O));
        return ($.successHandler || QJ3)(j.response, O), j
    }, M1q = {
        step: "finalizeRequest",
        tags: ["HTTP_SIGNING"],
        name: "httpSigningMiddleware",
        aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
        override: !0,
        relation: "after",
        toMiddleware: "retryMiddleware"
    }, dJ3 = (q) => ({
        applyToStack: (K) => {
            K.addRelativeTo(X1q(), M1q)
        }
    }), cJ3 = (q) => {
        if (typeof q === "function") return q;
        let K = Promise.resolve(q);
        return () => K
    }, lJ3 = async (q, K, _, z = (A) => A, ...Y) => {
        let A = new q(_);
        return A = z(A) ?? A, await K.send(A, ...Y)
    };

    function nJ3(q, K, _, z, Y) {
        return async function*(O, w, ...$) {
            let j = w,
                H = O.startingToken ?? j[_],
                J = !0,
                X;
            while (J) {
                if (j[_] = H, Y) j[Y] = j[Y] ?? O.pageSize;
                if (O.client instanceof q) X = await lJ3(K, O.client, w, O.withCommand, ...$);
                else throw Error(`Invalid client, expected instance of ${q.name}`);
                yield X;
                let M = H;
                H = iJ3(X, z), J = !!(H && (!O.stopOnSameToken || H !== M))
            }
            return
        }
    }
    var iJ3 = (q, K) => {
        let _ = q,
            z = K.split(".");
        for (let Y of z) {
            if (!_ || typeof _ !== "object") return;
            _ = _[Y]
        }
        return _
    };

    function rJ3(q, K, _) {
        if (!q.__smithy_context) q.__smithy_context = {
            features: {}
        };
        else if (!q.__smithy_context.features) q.__smithy_context.features = {};
        q.__smithy_context.features[K] = _
    }
    class P1q {
        authSchemes = new Map;
        constructor(q) {
            for (let [K, _] of Object.entries(q))
                if (_ !== void 0) this.authSchemes.set(K, _)
        }
        getIdentityProvider(q) {
            return this.authSchemes.get(q)
        }
    }
    class W1q {
        async sign(q, K, _) {
            if (!_) throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
            if (!_.name) throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
            if (!_.in) throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
            if (!K.apiKey) throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
            let z = kH1.HttpRequest.clone(q);
            if (_.in === oP8.HttpApiKeyAuthLocation.QUERY) z.query[_.name] = K.apiKey;
            else if (_.in === oP8.HttpApiKeyAuthLocation.HEADER) z.headers[_.name] = _.scheme ? `${_.scheme} ${K.apiKey}` : K.apiKey;
            else throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + _.in + "`");
            return z
        }
    }
    class D1q {
        async sign(q, K, _) {
            let z = kH1.HttpRequest.clone(q);
            if (!K.token) throw Error("request could not be signed with `token` since the `token` is not defined");
            return z.headers.Authorization = `Bearer ${K.token}`, z
        }
    }
    class Z1q {
        async sign(q, K, _) {
            return q
        }
    }
    var f1q = (q) => function(_) {
            return v1q(_) && _.expiration.getTime() - Date.now() < q
        },
        G1q = 300000,
        oJ3 = f1q(G1q),
        v1q = (q) => q.expiration !== void 0,
        aJ3 = (q, K, _) => {
            if (q === void 0) return;
            let z = typeof q !== "function" ? async () => Promise.resolve(q): q, Y, A, O, w = !1, $ = async (j) => {
                if (!A) A = z(j);
                try {
                    Y = await A, O = !0, w = !1
                } finally {
                    A = void 0
                }
                return Y
            };
            if (K === void 0) return async (j) => {
                if (!O || j?.forceRefresh) Y = await $(j);
                return Y
            };
            return async (j) => {
                if (!O || j?.forceRefresh) Y = await $(j);
                if (w) return Y;
                if (!_(Y)) return w = !0, Y;
                if (K(Y)) return await $(j), Y;
                return Y
            }
        };
    Object.defineProperty(T1q, "requestBuilder", {
        enumerable: !0,
        get: function() {
            return uJ3.requestBuilder
        }
    });
    T1q.DefaultIdentityProviderConfig = P1q;
    T1q.EXPIRATION_MS = G1q;
    T1q.HttpApiKeyAuthSigner = W1q;
    T1q.HttpBearerAuthSigner = D1q;
    T1q.NoAuthSigner = Z1q;
    T1q.createIsIdentityExpiredFunction = f1q;
    T1q.createPaginator = nJ3;
    T1q.doesIdentityRequireRefresh = v1q;
    T1q.getHttpAuthSchemeEndpointRuleSetPlugin = FJ3;
    T1q.getHttpAuthSchemePlugin = gJ3;
    T1q.getHttpSigningPlugin = dJ3;
    T1q.getSmithyContext = mJ3;
    T1q.httpAuthSchemeEndpointRuleSetMiddlewareOptions = H1q;
    T1q.httpAuthSchemeMiddleware = NH1;
    T1q.httpAuthSchemeMiddlewareOptions = J1q;
    T1q.httpSigningMiddleware = X1q;
    T1q.httpSigningMiddlewareOptions = M1q;
    T1q.isIdentityExpired = oJ3;
    T1q.memoizeIdentityProvider = aJ3;
    T1q.normalizeProvider = cJ3;
    T1q.setFeature = rJ3
})
// @from(Ln 73705, Col 4)
k1q = p((vX3) => {
    var V1q = {},
        EH1 = {};
    for (let q = 0; q < 256; q++) {
        let K = q.toString(16).toLowerCase();
        if (K.length === 1) K = `0${K}`;
        V1q[q] = K, EH1[K] = q
    }

    function fX3(q) {
        if (q.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let K = new Uint8Array(q.length / 2);
        for (let _ = 0; _ < q.length; _ += 2) {
            let z = q.slice(_, _ + 2).toLowerCase();
            if (z in EH1) K[_ / 2] = EH1[z];
            else throw Error(`Cannot decode unrecognized sequence ${z} as hexadecimal`)
        }
        return K
    }

    function GX3(q) {
        let K = "";
        for (let _ = 0; _ < q.byteLength; _++) K += V1q[q[_]];
        return K
    }
    vX3.fromHex = fX3;
    vX3.toHex = GX3
})
// @from(Ln 73733, Col 4)
N1q = p((NX3) => {
    var kX3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    NX3.isArrayBuffer = kX3
})
// @from(Ln 73737, Col 4)
y1q = p((hX3) => {
    var E1q = (q) => encodeURIComponent(q).replace(/[!'()*]/g, yX3),
        yX3 = (q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`,
        LX3 = (q) => q.split("/").map(E1q).join("/");
    hX3.escapeUri = E1q;
    hX3.escapeUriPath = LX3
})
// @from(Ln 73744, Col 4)
mH1 = p((UX3) => {
    var X76 = k1q(),
        GO6 = nw(),
        CX3 = N1q(),
        S1q = iP8(),
        L1q = Dv(),
        aP8 = y1q(),
        C1q = "X-Amz-Algorithm",
        b1q = "X-Amz-Credential",
        hH1 = "X-Amz-Date",
        I1q = "X-Amz-SignedHeaders",
        x1q = "X-Amz-Expires",
        RH1 = "X-Amz-Signature",
        SH1 = "X-Amz-Security-Token",
        bX3 = "X-Amz-Region-Set",
        CH1 = "authorization",
        bH1 = hH1.toLowerCase(),
        u1q = "date",
        m1q = [CH1, bH1, u1q],
        B1q = RH1.toLowerCase(),
        KW8 = "x-amz-content-sha256",
        p1q = SH1.toLowerCase(),
        IX3 = "host",
        F1q = {
            authorization: !0,
            "cache-control": !0,
            connection: !0,
            expect: !0,
            from: !0,
            "keep-alive": !0,
            "max-forwards": !0,
            pragma: !0,
            referer: !0,
            te: !0,
            trailer: !0,
            "transfer-encoding": !0,
            upgrade: !0,
            "user-agent": !0,
            "x-amzn-trace-id": !0
        },
        g1q = /^proxy-/,
        U1q = /^sec-/,
        xX3 = [/^proxy-/i, /^sec-/i],
        sP8 = "AWS4-HMAC-SHA256",
        uX3 = "AWS4-ECDSA-P256-SHA256",
        Q1q = "AWS4-HMAC-SHA256-PAYLOAD",
        d1q = "UNSIGNED-PAYLOAD",
        c1q = 50,
        IH1 = "aws4_request",
        l1q = 604800,
        fv6 = {},
        tP8 = [],
        eP8 = (q, K, _) => `${q}/${K}/${_}/${IH1}`,
        n1q = async (q, K, _, z, Y) => {
            let A = await h1q(q, K.secretAccessKey, K.accessKeyId),
                O = `${_}:${z}:${Y}:${X76.toHex(A)}:${K.sessionToken}`;
            if (O in fv6) return fv6[O];
            tP8.push(O);
            while (tP8.length > c1q) delete fv6[tP8.shift()];
            let w = `AWS4${K.secretAccessKey}`;
            for (let $ of [_, z, Y, IH1]) w = await h1q(q, w, $);
            return fv6[O] = w
        }, mX3 = () => {
            tP8.length = 0, Object.keys(fv6).forEach((q) => {
                delete fv6[q]
            })
        }, h1q = (q, K, _) => {
            let z = new q(K);
            return z.update(GO6.toUint8Array(_)), z.digest()
        }, yH1 = ({
            headers: q
        }, K, _) => {
            let z = {};
            for (let Y of Object.keys(q).sort()) {
                if (q[Y] == null) continue;
                let A = Y.toLowerCase();
                if (A in F1q || K?.has(A) || g1q.test(A) || U1q.test(A)) {
                    if (!_ || _ && !_.has(A)) continue
                }
                z[A] = q[Y].trim().replace(/\s+/g, " ")
            }
            return z
        }, qW8 = async ({
            headers: q,
            body: K
        }, _) => {
            for (let z of Object.keys(q))
                if (z.toLowerCase() === KW8) return q[z];
            if (K == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof K === "string" || ArrayBuffer.isView(K) || CX3.isArrayBuffer(K)) {
                let z = new _;
                return z.update(GO6.toUint8Array(K)), X76.toHex(await z.digest())
            }
            return d1q
        };
    class i1q {
        format(q) {
            let K = [];
            for (let Y of Object.keys(q)) {
                let A = GO6.fromUtf8(Y);
                K.push(Uint8Array.from([A.byteLength]), A, this.formatHeaderValue(q[Y]))
            }
            let _ = new Uint8Array(K.reduce((Y, A) => Y + A.byteLength, 0)),
                z = 0;
            for (let Y of K) _.set(Y, z), z += Y.byteLength;
            return _
        }
        formatHeaderValue(q) {
            switch (q.type) {
                case "boolean":
                    return Uint8Array.from([q.value ? 0 : 1]);
                case "byte":
                    return Uint8Array.from([2, q.value]);
                case "short":
                    let K = new DataView(new ArrayBuffer(3));
                    return K.setUint8(0, 3), K.setInt16(1, q.value, !1), new Uint8Array(K.buffer);
                case "integer":
                    let _ = new DataView(new ArrayBuffer(5));
                    return _.setUint8(0, 4), _.setInt32(1, q.value, !1), new Uint8Array(_.buffer);
                case "long":
                    let z = new Uint8Array(9);
                    return z[0] = 5, z.set(q.value.bytes, 1), z;
                case "binary":
                    let Y = new DataView(new ArrayBuffer(3 + q.value.byteLength));
                    Y.setUint8(0, 6), Y.setUint16(1, q.value.byteLength, !1);
                    let A = new Uint8Array(Y.buffer);
                    return A.set(q.value, 3), A;
                case "string":
                    let O = GO6.fromUtf8(q.value),
                        w = new DataView(new ArrayBuffer(3 + O.byteLength));
                    w.setUint8(0, 7), w.setUint16(1, O.byteLength, !1);
                    let $ = new Uint8Array(w.buffer);
                    return $.set(O, 3), $;
                case "timestamp":
                    let j = new Uint8Array(9);
                    return j[0] = 8, j.set(xH1.fromNumber(q.value.valueOf()).bytes, 1), j;
                case "uuid":
                    if (!BX3.test(q.value)) throw Error(`Invalid UUID received: ${q.value}`);
                    let H = new Uint8Array(17);
                    return H[0] = 9, H.set(X76.fromHex(q.value.replace(/\-/g, "")), 1), H
            }
        }
    }
    var BX3 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    class xH1 {
        bytes;
        constructor(q) {
            if (this.bytes = q, q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(q) {
            if (q > 9223372036854776000 || q < -9223372036854776000) throw Error(`${q} is too large (or, if negative, too small) to represent as an Int64`);
            let K = new Uint8Array(8);
            for (let _ = 7, z = Math.abs(Math.round(q)); _ > -1 && z > 0; _--, z /= 256) K[_] = z;
            if (q < 0) R1q(K);
            return new xH1(K)
        }
        valueOf() {
            let q = this.bytes.slice(0),
                K = q[0] & 128;
            if (K) R1q(q);
            return parseInt(X76.toHex(q), 16) * (K ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function R1q(q) {
        for (let K = 0; K < 8; K++) q[K] ^= 255;
        for (let K = 7; K > -1; K--)
            if (q[K]++, q[K] !== 0) break
    }
    var r1q = (q, K) => {
            q = q.toLowerCase();
            for (let _ of Object.keys(K))
                if (q === _.toLowerCase()) return !0;
            return !1
        },
        o1q = (q, K = {}) => {
            let {
                headers: _,
                query: z = {}
            } = S1q.HttpRequest.clone(q);
            for (let Y of Object.keys(_)) {
                let A = Y.toLowerCase();
                if (A.slice(0, 6) === "x-amz-" && !K.unhoistableHeaders?.has(A) || K.hoistableHeaders?.has(A)) z[Y] = _[Y], delete _[Y]
            }
            return {
                ...q,
                headers: _,
                query: z
            }
        },
        LH1 = (q) => {
            q = S1q.HttpRequest.clone(q);
            for (let K of Object.keys(q.headers))
                if (m1q.indexOf(K.toLowerCase()) > -1) delete q.headers[K];
            return q
        },
        a1q = ({
            query: q = {}
        }) => {
            let K = [],
                _ = {};
            for (let z of Object.keys(q)) {
                if (z.toLowerCase() === B1q) continue;
                let Y = aP8.escapeUri(z);
                K.push(Y);
                let A = q[z];
                if (typeof A === "string") _[Y] = `${Y}=${aP8.escapeUri(A)}`;
                else if (Array.isArray(A)) _[Y] = A.slice(0).reduce((O, w) => O.concat([`${Y}=${aP8.escapeUri(w)}`]), []).sort().join("&")
            }
            return K.sort().map((z) => _[z]).filter((z) => z).join("&")
        },
        pX3 = (q) => FX3(q).toISOString().replace(/\.\d{3}Z$/, "Z"),
        FX3 = (q) => {
            if (typeof q === "number") return new Date(q * 1000);
            if (typeof q === "string") {
                if (Number(q)) return new Date(Number(q) * 1000);
                return new Date(q)
            }
            return q
        };
    class uH1 {
        service;
        regionProvider;
        credentialProvider;
        sha256;
        uriEscapePath;
        applyChecksum;
        constructor({
            applyChecksum: q,
            credentials: K,
            region: _,
            service: z,
            sha256: Y,
            uriEscapePath: A = !0
        }) {
            this.service = z, this.sha256 = Y, this.uriEscapePath = A, this.applyChecksum = typeof q === "boolean" ? q : !0, this.regionProvider = L1q.normalizeProvider(_), this.credentialProvider = L1q.normalizeProvider(K)
        }
        createCanonicalRequest(q, K, _) {
            let z = Object.keys(K).sort();
            return `${q.method}
${this.getCanonicalPath(q)}
${a1q(q)}
${z.map((Y)=>`${Y}:${K[Y]}`).join(`
`)}

${z.join(";")}
${_}`
        }
        async createStringToSign(q, K, _, z) {
            let Y = new this.sha256;
            Y.update(GO6.toUint8Array(_));
            let A = await Y.digest();
            return `${z}
${q}
${K}
${X76.toHex(A)}`
        }
        getCanonicalPath({
            path: q
        }) {
            if (this.uriEscapePath) {
                let K = [];
                for (let Y of q.split("/")) {
                    if (Y?.length === 0) continue;
                    if (Y === ".") continue;
                    if (Y === "..") K.pop();
                    else K.push(Y)
                }
                let _ = `${q?.startsWith("/")?"/":""}${K.join("/")}${K.length>0&&q?.endsWith("/")?"/":""}`;
                return aP8.escapeUri(_).replace(/%2F/g, "/")
            }
            return q
        }
        validateResolvedCredentials(q) {
            if (typeof q !== "object" || typeof q.accessKeyId !== "string" || typeof q.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
        }
        formatDate(q) {
            let K = pX3(q).replace(/[\-:]/g, "");
            return {
                longDate: K,
                shortDate: K.slice(0, 8)
            }
        }
        getCanonicalHeaderList(q) {
            return Object.keys(q).sort().join(";")
        }
    }
    class s1q extends uH1 {
        headerFormatter = new i1q;
        constructor({
            applyChecksum: q,
            credentials: K,
            region: _,
            service: z,
            sha256: Y,
            uriEscapePath: A = !0
        }) {
            super({
                applyChecksum: q,
                credentials: K,
                region: _,
                service: z,
                sha256: Y,
                uriEscapePath: A
            })
        }
        async presign(q, K = {}) {
            let {
                signingDate: _ = new Date,
                expiresIn: z = 3600,
                unsignableHeaders: Y,
                unhoistableHeaders: A,
                signableHeaders: O,
                hoistableHeaders: w,
                signingRegion: $,
                signingService: j
            } = K, H = await this.credentialProvider();
            this.validateResolvedCredentials(H);
            let J = $ ?? await this.regionProvider(),
                {
                    longDate: X,
                    shortDate: M
                } = this.formatDate(_);
            if (z > l1q) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
            let P = eP8(M, J, j ?? this.service),
                W = o1q(LH1(q), {
                    unhoistableHeaders: A,
                    hoistableHeaders: w
                });
            if (H.sessionToken) W.query[SH1] = H.sessionToken;
            W.query[C1q] = sP8, W.query[b1q] = `${H.accessKeyId}/${P}`, W.query[hH1] = X, W.query[x1q] = z.toString(10);
            let D = yH1(W, Y, O);
            return W.query[I1q] = this.getCanonicalHeaderList(D), W.query[RH1] = await this.getSignature(X, P, this.getSigningKey(H, J, M, j), this.createCanonicalRequest(W, D, await qW8(q, this.sha256))), W
        }
        async sign(q, K) {
            if (typeof q === "string") return this.signString(q, K);
            else if (q.headers && q.payload) return this.signEvent(q, K);
            else if (q.message) return this.signMessage(q, K);
            else return this.signRequest(q, K)
        }
        async signEvent({
            headers: q,
            payload: K
        }, {
            signingDate: _ = new Date,
            priorSignature: z,
            signingRegion: Y,
            signingService: A
        }) {
            let O = Y ?? await this.regionProvider(),
                {
                    shortDate: w,
                    longDate: $
                } = this.formatDate(_),
                j = eP8(w, O, A ?? this.service),
                H = await qW8({
                    headers: {},
                    body: K
                }, this.sha256),
                J = new this.sha256;
            J.update(q);
            let X = X76.toHex(await J.digest()),
                M = [Q1q, $, j, z, X, H].join(`
`);
            return this.signString(M, {
                signingDate: _,
                signingRegion: O,
                signingService: A
            })
        }
        async signMessage(q, {
            signingDate: K = new Date,
            signingRegion: _,
            signingService: z
        }) {
            return this.signEvent({
                headers: this.headerFormatter.format(q.message.headers),
                payload: q.message.body
            }, {
                signingDate: K,
                signingRegion: _,
                signingService: z,
                priorSignature: q.priorSignature
            }).then((A) => {
                return {
                    message: q.message,
                    signature: A
                }
            })
        }
        async signString(q, {
            signingDate: K = new Date,
            signingRegion: _,
            signingService: z
        } = {}) {
            let Y = await this.credentialProvider();
            this.validateResolvedCredentials(Y);
            let A = _ ?? await this.regionProvider(),
                {
                    shortDate: O
                } = this.formatDate(K),
                w = new this.sha256(await this.getSigningKey(Y, A, O, z));
            return w.update(GO6.toUint8Array(q)), X76.toHex(await w.digest())
        }
        async signRequest(q, {
            signingDate: K = new Date,
            signableHeaders: _,
            unsignableHeaders: z,
            signingRegion: Y,
            signingService: A
        } = {}) {
            let O = await this.credentialProvider();
            this.validateResolvedCredentials(O);
            let w = Y ?? await this.regionProvider(),
                $ = LH1(q),
                {
                    longDate: j,
                    shortDate: H
                } = this.formatDate(K),
                J = eP8(H, w, A ?? this.service);
            if ($.headers[bH1] = j, O.sessionToken) $.headers[p1q] = O.sessionToken;
            let X = await qW8($, this.sha256);
            if (!r1q(KW8, $.headers) && this.applyChecksum) $.headers[KW8] = X;
            let M = yH1($, z, _),
                P = await this.getSignature(j, J, this.getSigningKey(O, w, H, A), this.createCanonicalRequest($, M, X));
            return $.headers[CH1] = `${sP8} Credential=${O.accessKeyId}/${J}, SignedHeaders=${this.getCanonicalHeaderList(M)}, Signature=${P}`, $
        }
        async getSignature(q, K, _, z) {
            let Y = await this.createStringToSign(q, K, z, sP8),
                A = new this.sha256(await _);
            return A.update(GO6.toUint8Array(Y)), X76.toHex(await A.digest())
        }
        getSigningKey(q, K, _, z) {
            return n1q(this.sha256, q, _, K, z || this.service)
        }
    }
    var gX3 = {
        SignatureV4a: null
    };
    UX3.ALGORITHM_IDENTIFIER = sP8;
    UX3.ALGORITHM_IDENTIFIER_V4A = uX3;
    UX3.ALGORITHM_QUERY_PARAM = C1q;
    UX3.ALWAYS_UNSIGNABLE_HEADERS = F1q;
    UX3.AMZ_DATE_HEADER = bH1;
    UX3.AMZ_DATE_QUERY_PARAM = hH1;
    UX3.AUTH_HEADER = CH1;
    UX3.CREDENTIAL_QUERY_PARAM = b1q;
    UX3.DATE_HEADER = u1q;
    UX3.EVENT_ALGORITHM_IDENTIFIER = Q1q;
    UX3.EXPIRES_QUERY_PARAM = x1q;
    UX3.GENERATED_HEADERS = m1q;
    UX3.HOST_HEADER = IX3;
    UX3.KEY_TYPE_IDENTIFIER = IH1;
    UX3.MAX_CACHE_SIZE = c1q;
    UX3.MAX_PRESIGNED_TTL = l1q;
    UX3.PROXY_HEADER_PATTERN = g1q;
    UX3.REGION_SET_PARAM = bX3;
    UX3.SEC_HEADER_PATTERN = U1q;
    UX3.SHA256_HEADER = KW8;
    UX3.SIGNATURE_HEADER = B1q;
    UX3.SIGNATURE_QUERY_PARAM = RH1;
    UX3.SIGNED_HEADERS_QUERY_PARAM = I1q;
    UX3.SignatureV4 = s1q;
    UX3.SignatureV4Base = uH1;
    UX3.TOKEN_HEADER = p1q;
    UX3.TOKEN_QUERY_PARAM = SH1;
    UX3.UNSIGNABLE_PATTERNS = xX3;
    UX3.UNSIGNED_PAYLOAD = d1q;
    UX3.clearCredentialCache = mX3;
    UX3.createScope = eP8;
    UX3.getCanonicalHeaders = yH1;
    UX3.getCanonicalQuery = a1q;
    UX3.getPayloadHash = qW8;
    UX3.getSigningKey = n1q;
    UX3.hasHeader = r1q;
    UX3.moveHeadersToQuery = o1q;
    UX3.prepareRequest = LH1;
    UX3.signatureV4aContainer = gX3
})