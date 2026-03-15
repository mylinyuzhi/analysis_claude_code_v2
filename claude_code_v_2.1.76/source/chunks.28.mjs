
// @from(Ln 68264, Col 4)
pT = x((_aK) => {
    var Hq1 = Rs1(),
        Cy = dO(),
        Sy = FT(),
        th6 = Qh6(),
        jq1 = _t1(),
        wt1 = C_(),
        t76 = async (A = new Uint8Array, q) => {
            if (A instanceof Uint8Array) return Hq1.Uint8ArrayBlobAdapter.mutate(A);
            if (!A) return Hq1.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let K = q.streamCollector(A);
            return Hq1.Uint8ArrayBlobAdapter.mutate(await K)
        };

    function eh6(A) {
        return encodeURIComponent(A).replace(/[!'()*]/g, function(q) {
            return "%" + q.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    class jj6 {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }
    class Jq1 extends jj6 {
        options;
        constructor(A) {
            super();
            this.options = A
        }
        getRequestType() {
            return th6.HttpRequest
        }
        getResponseType() {
            return th6.HttpResponse
        }
        setSerdeContext(A) {
            if (this.serdeContext = A, this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A), this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(A)
        }
        updateServiceEndpoint(A, q) {
            if ("url" in q) {
                if (A.protocol = q.url.protocol, A.hostname = q.url.hostname, A.port = q.url.port ? Number(q.url.port) : void 0, A.path = q.url.pathname, A.fragment = q.url.hash || void 0, A.username = q.url.username || void 0, A.password = q.url.password || void 0, !A.query) A.query = {};
                for (let [K, Y] of q.url.searchParams.entries()) A.query[K] = Y;
                return A
            } else return A.protocol = q.protocol, A.hostname = q.hostname, A.port = q.port ? Number(q.port) : void 0, A.path = q.path, A.query = {
                ...q.query
            }, A
        }
        setHostPrefix(A, q, K) {
            let Y = Cy.NormalizedSchema.of(q.input),
                z = Cy.translateTraits(q.traits ?? {});
            if (z.endpoint) {
                let _ = z.endpoint?.[0];
                if (typeof _ === "string") {
                    let w = [...Y.structIterator()].filter(([, O]) => O.getMergedTraits().hostLabel);
                    for (let [O] of w) {
                        let $ = K[O];
                        if (typeof $ !== "string") throw Error(`@smithy/core/schema - ${O} in input must be a string as hostLabel.`);
                        _ = _.replace(`{${O}}`, $)
                    }
                    A.hostname = _ + A.hostname
                }
            }
        }
        deserializeMetadata(A) {
            return {
                httpStatusCode: A.statusCode,
                requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
                extendedRequestId: A.headers["x-amz-id-2"],
                cfId: A.headers["x-amz-cf-id"]
            }
        }
        async serializeEventStream({
            eventStream: A,
            requestSchema: q,
            initialRequest: K
        }) {
            return (await this.loadEventStreamCapability()).serializeEventStream({
                eventStream: A,
                requestSchema: q,
                initialRequest: K
            })
        }
        async deserializeEventStream({
            response: A,
            responseSchema: q,
            initialResponseContainer: K
        }) {
            return (await this.loadEventStreamCapability()).deserializeEventStream({
                response: A,
                responseSchema: q,
                initialResponseContainer: K
            })
        }
        async loadEventStreamCapability() {
            let {
                EventStreamSerde: A
            } = await Promise.resolve().then(() => t(CpA()));
            return new A({
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
        async deserializeHttpMessage(A, q, K, Y, z) {
            return []
        }
        getEventStreamMarshaller() {
            let A = this.serdeContext;
            if (!A.eventStreamMarshaller) throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
            return A.eventStreamMarshaller
        }
    }
    class IpA extends Jq1 {
        async serializeRequest(A, q, K) {
            let Y = {
                    ...q ?? {}
                },
                z = this.serializer,
                _ = {},
                w = {},
                O = await K.endpoint(),
                $ = Cy.NormalizedSchema.of(A?.input),
                H = $.getSchema(),
                j = !1,
                J, M = new th6.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "",
                    fragment: void 0,
                    query: _,
                    headers: w,
                    body: void 0
                });
            if (O) {
                this.updateServiceEndpoint(M, O), this.setHostPrefix(M, A, Y);
                let D = Cy.translateTraits(A.traits);
                if (D.http) {
                    M.method = D.http[0];
                    let [X, P] = D.http[1].split("?");
                    if (M.path == "/") M.path = X;
                    else M.path += X;
                    let W = new URLSearchParams(P ?? "");
                    Object.assign(_, Object.fromEntries(W))
                }
            }
            for (let [D, X] of $.structIterator()) {
                let P = X.getMergedTraits() ?? {},
                    W = Y[D];
                if (W == null && !X.isIdempotencyToken()) continue;
                if (P.httpPayload) {
                    if (X.isStreaming())
                        if (X.isStructSchema()) {
                            if (Y[D]) J = await this.serializeEventStream({
                                eventStream: Y[D],
                                requestSchema: $
                            })
                        } else J = W;
                    else z.write(X, W), J = z.flush();
                    delete Y[D]
                } else if (P.httpLabel) {
                    z.write(X, W);
                    let Z = z.flush();
                    if (M.path.includes(`{${D}+}`)) M.path = M.path.replace(`{${D}+}`, Z.split("/").map(eh6).join("/"));
                    else if (M.path.includes(`{${D}}`)) M.path = M.path.replace(`{${D}}`, eh6(Z));
                    delete Y[D]
                } else if (P.httpHeader) z.write(X, W), w[P.httpHeader.toLowerCase()] = String(z.flush()), delete Y[D];
                else if (typeof P.httpPrefixHeaders === "string") {
                    for (let [Z, G] of Object.entries(W)) {
                        let f = P.httpPrefixHeaders + Z;
                        z.write([X.getValueSchema(), {
                            httpHeader: f
                        }], G), w[f.toLowerCase()] = z.flush()
                    }
                    delete Y[D]
                } else if (P.httpQuery || P.httpQueryParams) this.serializeQuery(X, W, _), delete Y[D];
                else j = !0
            }
            if (j && Y) z.write(H, Y), J = z.flush();
            return M.headers = w, M.query = _, M.body = J, M
        }
        serializeQuery(A, q, K) {
            let Y = this.serializer,
                z = A.getMergedTraits();
            if (z.httpQueryParams) {
                for (let [_, w] of Object.entries(q))
                    if (!(_ in K)) {
                        let O = A.getValueSchema();
                        Object.assign(O.getMergedTraits(), {
                            ...z,
                            httpQuery: _,
                            httpQueryParams: void 0
                        }), this.serializeQuery(O, w, K)
                    } return
            }
            if (A.isListSchema()) {
                let _ = !!A.getMergedTraits().sparse,
                    w = [];
                for (let O of q) {
                    Y.write([A.getValueSchema(), z], O);
                    let $ = Y.flush();
                    if (_ || $ !== void 0) w.push($)
                }
                K[z.httpQuery] = w
            } else Y.write([A, z], q), K[z.httpQuery] = Y.flush()
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = Cy.NormalizedSchema.of(A.output),
                _ = {};
            if (K.statusCode >= 300) {
                let O = await t76(K.body, q);
                if (O.byteLength > 0) Object.assign(_, await Y.read(15, O));
                throw await this.handleError(A, q, K, _, this.deserializeMetadata(K)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.")
            }
            for (let O in K.headers) {
                let $ = K.headers[O];
                delete K.headers[O], K.headers[O.toLowerCase()] = $
            }
            let w = await this.deserializeHttpMessage(z, q, K, _);
            if (w.length) {
                let O = await t76(K.body, q);
                if (O.byteLength > 0) {
                    let $ = await Y.read(z, O);
                    for (let H of w) _[H] = $[H]
                }
            } else if (w.discardResponseBody) await t76(K.body, q);
            return _.$metadata = this.deserializeMetadata(K), _
        }
        async deserializeHttpMessage(A, q, K, Y, z) {
            let _;
            if (Y instanceof Set) _ = z;
            else _ = Y;
            let w = !0,
                O = this.deserializer,
                $ = Cy.NormalizedSchema.of(A),
                H = [];
            for (let [j, J] of $.structIterator()) {
                let M = J.getMemberTraits();
                if (M.httpPayload) {
                    if (w = !1, J.isStreaming())
                        if (J.isStructSchema()) _[j] = await this.deserializeEventStream({
                            response: K,
                            responseSchema: $
                        });
                        else _[j] = Hq1.sdkStreamMixin(K.body);
                    else if (K.body) {
                        let X = await t76(K.body, q);
                        if (X.byteLength > 0) _[j] = await O.read(J, X)
                    }
                } else if (M.httpHeader) {
                    let D = String(M.httpHeader).toLowerCase(),
                        X = K.headers[D];
                    if (X != null)
                        if (J.isListSchema()) {
                            let P = J.getValueSchema();
                            P.getMergedTraits().httpHeader = D;
                            let W;
                            if (P.isTimestampSchema() && P.getSchema() === 4) W = Sy.splitEvery(X, ",", 2);
                            else W = Sy.splitHeader(X);
                            let Z = [];
                            for (let G of W) Z.push(await O.read(P, G.trim()));
                            _[j] = Z
                        } else _[j] = await O.read(J, X)
                } else if (M.httpPrefixHeaders !== void 0) {
                    _[j] = {};
                    for (let [D, X] of Object.entries(K.headers))
                        if (D.startsWith(M.httpPrefixHeaders)) {
                            let P = J.getValueSchema();
                            P.getMergedTraits().httpHeader = D, _[j][D.slice(M.httpPrefixHeaders.length)] = await O.read(P, X)
                        }
                } else if (M.httpResponseCode) _[j] = K.statusCode;
                else H.push(j)
            }
            return H.discardResponseBody = w, H
        }
    }
    class bpA extends Jq1 {
        async serializeRequest(A, q, K) {
            let Y = this.serializer,
                z = {},
                _ = {},
                w = await K.endpoint(),
                O = Cy.NormalizedSchema.of(A?.input),
                $ = O.getSchema(),
                H, j = new th6.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "/",
                    fragment: void 0,
                    query: z,
                    headers: _,
                    body: void 0
                });
            if (w) this.updateServiceEndpoint(j, w), this.setHostPrefix(j, A, q);
            let J = {
                ...q
            };
            if (q) {
                let M = O.getEventStreamMember();
                if (M) {
                    if (J[M]) {
                        let D = {};
                        for (let [X, P] of O.structIterator())
                            if (X !== M && J[X]) Y.write(P, J[X]), D[X] = Y.flush();
                        H = await this.serializeEventStream({
                            eventStream: J[M],
                            requestSchema: O,
                            initialRequest: D
                        })
                    }
                } else Y.write($, J), H = Y.flush()
            }
            return j.headers = _, j.query = z, j.body = H, j.method = "POST", j
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = Cy.NormalizedSchema.of(A.output),
                _ = {};
            if (K.statusCode >= 300) {
                let O = await t76(K.body, q);
                if (O.byteLength > 0) Object.assign(_, await Y.read(15, O));
                throw await this.handleError(A, q, K, _, this.deserializeMetadata(K)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.")
            }
            for (let O in K.headers) {
                let $ = K.headers[O];
                delete K.headers[O], K.headers[O.toLowerCase()] = $
            }
            let w = z.getEventStreamMember();
            if (w) _[w] = await this.deserializeEventStream({
                response: K,
                responseSchema: z,
                initialResponseContainer: _
            });
            else {
                let O = await t76(K.body, q);
                if (O.byteLength > 0) Object.assign(_, await Y.read(z, O))
            }
            return _.$metadata = this.deserializeMetadata(K), _
        }
    }
    var xpA = (A, q, K, Y, z, _) => {
        if (q != null && q[K] !== void 0) {
            let w = Y();
            if (w.length <= 0) throw Error("Empty value provided for input HTTP label: " + K + ".");
            A = A.replace(z, _ ? w.split("/").map((O) => eh6(O)).join("/") : eh6(w))
        } else throw Error("No value provided for input HTTP label: " + K + ".");
        return A
    };

    function zaK(A, q) {
        return new Ot1(A, q)
    }
    class Ot1 {
        input;
        context;
        query = {};
        method = "";
        headers = {};
        path = "";
        body = null;
        hostname = "";
        resolvePathStack = [];
        constructor(A, q) {
            this.input = A, this.context = q
        }
        async build() {
            let {
                hostname: A,
                protocol: q = "https",
                port: K,
                path: Y
            } = await this.context.endpoint();
            this.path = Y;
            for (let z of this.resolvePathStack) z(this.path);
            return new th6.HttpRequest({
                protocol: q,
                hostname: this.hostname || A,
                port: K,
                method: this.method,
                path: this.path,
                query: this.query,
                body: this.body,
                headers: this.headers
            })
        }
        hn(A) {
            return this.hostname = A, this
        }
        bp(A) {
            return this.resolvePathStack.push((q) => {
                this.path = `${q?.endsWith("/")?q.slice(0,-1):q||""}` + A
            }), this
        }
        p(A, q, K, Y) {
            return this.resolvePathStack.push((z) => {
                this.path = xpA(z, this.input, A, q, K, Y)
            }), this
        }
        h(A) {
            return this.headers = A, this
        }
        q(A) {
            return this.query = A, this
        }
        b(A) {
            return this.body = A, this
        }
        m(A) {
            return this.method = A, this
        }
    }

    function $t1(A, q) {
        if (q.timestampFormat.useTrait) {
            if (A.isTimestampSchema() && (A.getSchema() === 5 || A.getSchema() === 6 || A.getSchema() === 7)) return A.getSchema()
        }
        let {
            httpLabel: K,
            httpPrefixHeaders: Y,
            httpHeader: z,
            httpQuery: _
        } = A.getMergedTraits();
        return (q.httpBindings ? typeof Y === "string" || Boolean(z) ? 6 : Boolean(_) || Boolean(K) ? 5 : void 0 : void 0) ?? q.timestampFormat.default
    }
    class Ht1 extends jj6 {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        read(A, q) {
            let K = Cy.NormalizedSchema.of(A);
            if (K.isListSchema()) return Sy.splitHeader(q).map((Y) => this.read(K.getValueSchema(), Y));
            if (K.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? jq1.fromBase64)(q);
            if (K.isTimestampSchema()) switch ($t1(K, this.settings)) {
                case 5:
                    return Sy._parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return Sy._parseRfc7231DateTime(q);
                case 7:
                    return Sy._parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (K.isStringSchema()) {
                let Y = K.getMergedTraits().mediaType,
                    z = q;
                if (Y) {
                    if (K.getMergedTraits().httpHeader) z = this.base64ToUtf8(z);
                    if (Y === "application/json" || Y.endsWith("+json")) z = Sy.LazyJsonString.from(z);
                    return z
                }
            }
            if (K.isNumericSchema()) return Number(q);
            if (K.isBigIntegerSchema()) return BigInt(q);
            if (K.isBigDecimalSchema()) return new Sy.NumericValue(q, "bigDecimal");
            if (K.isBooleanSchema()) return String(q).toLowerCase() === "true";
            return q
        }
        base64ToUtf8(A) {
            return (this.serdeContext?.utf8Encoder ?? wt1.toUtf8)((this.serdeContext?.base64Decoder ?? jq1.fromBase64)(A))
        }
    }
    class upA extends jj6 {
        codecDeserializer;
        stringDeserializer;
        constructor(A, q) {
            super();
            this.codecDeserializer = A, this.stringDeserializer = new Ht1(q)
        }
        setSerdeContext(A) {
            this.stringDeserializer.setSerdeContext(A), this.codecDeserializer.setSerdeContext(A), this.serdeContext = A
        }
        read(A, q) {
            let K = Cy.NormalizedSchema.of(A),
                Y = K.getMergedTraits(),
                z = this.serdeContext?.utf8Encoder ?? wt1.toUtf8;
            if (Y.httpHeader || Y.httpResponseCode) return this.stringDeserializer.read(K, z(q));
            if (Y.httpPayload) {
                if (K.isBlobSchema()) {
                    let _ = this.serdeContext?.utf8Decoder ?? wt1.fromUtf8;
                    if (typeof q === "string") return _(q);
                    return q
                } else if (K.isStringSchema()) {
                    if ("byteLength" in q) return z(q);
                    return q
                }
            }
            return this.codecDeserializer.read(K, q)
        }
    }
    class jt1 extends jj6 {
        settings;
        stringBuffer = "";
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = Cy.NormalizedSchema.of(A);
            switch (typeof q) {
                case "object":
                    if (q === null) {
                        this.stringBuffer = "null";
                        return
                    }
                    if (K.isTimestampSchema()) {
                        if (!(q instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${q} when schema expected Date in ${K.getName(!0)}`);
                        switch ($t1(K, this.settings)) {
                            case 5:
                                this.stringBuffer = q.toISOString().replace(".000Z", "Z");
                                break;
                            case 6:
                                this.stringBuffer = Sy.dateToUtcString(q);
                                break;
                            case 7:
                                this.stringBuffer = String(q.getTime() / 1000);
                                break;
                            default:
                                console.warn("Missing timestamp format, using epoch seconds", q), this.stringBuffer = String(q.getTime() / 1000)
                        }
                        return
                    }
                    if (K.isBlobSchema() && "byteLength" in q) {
                        this.stringBuffer = (this.serdeContext?.base64Encoder ?? jq1.toBase64)(q);
                        return
                    }
                    if (K.isListSchema() && Array.isArray(q)) {
                        let _ = "";
                        for (let w of q) {
                            this.write([K.getValueSchema(), K.getMergedTraits()], w);
                            let O = this.flush(),
                                $ = K.getValueSchema().isTimestampSchema() ? O : Sy.quoteHeader(O);
                            if (_ !== "") _ += ", ";
                            _ += $
                        }
                        this.stringBuffer = _;
                        return
                    }
                    this.stringBuffer = JSON.stringify(q, null, 2);
                    break;
                case "string":
                    let Y = K.getMergedTraits().mediaType,
                        z = q;
                    if (Y) {
                        if (Y === "application/json" || Y.endsWith("+json")) z = Sy.LazyJsonString.from(z);
                        if (K.getMergedTraits().httpHeader) {
                            this.stringBuffer = (this.serdeContext?.base64Encoder ?? jq1.toBase64)(z.toString());
                            return
                        }
                    }
                    this.stringBuffer = q;
                    break;
                default:
                    if (K.isIdempotencyToken()) this.stringBuffer = Sy.generateIdempotencyToken();
                    else this.stringBuffer = String(q)
            }
        }
        flush() {
            let A = this.stringBuffer;
            return this.stringBuffer = "", A
        }
    }
    class mpA {
        codecSerializer;
        stringSerializer;
        buffer;
        constructor(A, q, K = new jt1(q)) {
            this.codecSerializer = A, this.stringSerializer = K
        }
        setSerdeContext(A) {
            this.codecSerializer.setSerdeContext(A), this.stringSerializer.setSerdeContext(A)
        }
        write(A, q) {
            let K = Cy.NormalizedSchema.of(A),
                Y = K.getMergedTraits();
            if (Y.httpHeader || Y.httpLabel || Y.httpQuery) {
                this.stringSerializer.write(K, q), this.buffer = this.stringSerializer.flush();
                return
            }
            return this.codecSerializer.write(K, q)
        }
        flush() {
            if (this.buffer !== void 0) {
                let A = this.buffer;
                return this.buffer = void 0, A
            }
            return this.codecSerializer.flush()
        }
    }
    _aK.FromStringShapeDeserializer = Ht1;
    _aK.HttpBindingProtocol = IpA;
    _aK.HttpInterceptingShapeDeserializer = upA;
    _aK.HttpInterceptingShapeSerializer = mpA;
    _aK.HttpProtocol = Jq1;
    _aK.RequestBuilder = Ot1;
    _aK.RpcProtocol = bpA;
    _aK.SerdeContext = jj6;
    _aK.ToStringShapeSerializer = jt1;
    _aK.collectBody = t76;
    _aK.determineTimestampFormat = $t1;
    _aK.extendedEncodeURIComponent = eh6;
    _aK.requestBuilder = zaK;
    _aK.resolvedPath = xpA
})
// @from(Ln 68878, Col 4)
opA = x((Mj6) => {
    var FpA = Pu(),
        Pt1 = pT(),
        Mt1 = Ms1(),
        TaK = dO(),
        BpA = FT();
    class ppA {
        config;
        middlewareStack = FpA.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var Jt1 = "***SensitiveInformation***";

    function Dt1(A, q) {
        if (q == null) return q;
        let K = TaK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Jt1;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Jt1
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Jt1
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = Dt1(w, Y[_]);
            return z
        }
        return q
    }
    class Wt1 {
        middlewareStack = FpA.constructStack();
        schema;
        static classBuilder() {
            return new QpA
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [Mt1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class QpA {
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
        init(A) {
            this._init = A
        }
        ep(A) {
            return this._ep = A, this
        }
        m(A) {
            return this._middlewareFn = A, this
        }
        s(A, q, K = {}) {
            return this._smithyContext = {
                service: A,
                operation: q,
                ...K
            }, this
        }
        c(A = {}) {
            return this._additionalContext = A, this
        }
        n(A, q) {
            return this._clientName = A, this._commandName = q, this
        }
        f(A = (K) => K, q = (K) => K) {
            return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = q, this
        }
        ser(A) {
            return this._serializer = A, this
        }
        de(A) {
            return this._deserializer = A, this
        }
        sc(A) {
            return this._operationSchema = A, this._smithyContext.operationSchema = A, this
        }
        build() {
            let A = this,
                q;
            return q = class extends Wt1 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? Dt1.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? Dt1.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var vaK = "***SensitiveInformation***",
        NaK = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class Jj6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(A) {
            super(A.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return Jj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === Jj6) return Jj6.isInstance(A);
            if (Jj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var UpA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        dpA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = kaK(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw UpA(w, q)
        },
        VaK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                dpA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        kaK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        EaK = (A) => {
            switch (A) {
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
        gpA = !1,
        yaK = (A) => {
            if (A && !gpA && parseInt(A.substring(1, A.indexOf("."))) < 16) gpA = !0
        },
        LaK = (A) => {
            let q = [];
            for (let K in Mt1.AlgorithmId) {
                let Y = Mt1.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        RaK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        haK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        SaK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        cpA = (A) => {
            return Object.assign(LaK(A), haK(A))
        },
        CaK = cpA,
        IaK = (A) => {
            return Object.assign(RaK(A), SaK(A))
        },
        baK = (A) => Array.isArray(A) ? A : [A],
        lpA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = lpA(A[K]);
            return A
        },
        xaK = (A) => {
            return A != null
        };
    class ipA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function npA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, BaK(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            rpA(Y, null, _, w)
        }
        return Y
    }
    var uaK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        maK = (A, q) => {
            let K = {};
            for (let Y in q) rpA(K, A, q, Y);
            return K
        },
        BaK = (A, q, K) => {
            return npA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        rpA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = gaK, $ = FaK, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        gaK = (A) => A != null,
        FaK = (A) => A,
        paK = (A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        },
        QaK = (A) => A.toISOString().replace(".000Z", "Z"),
        Xt1 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Xt1);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Xt1(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Mj6, "collectBody", {
        enumerable: !0,
        get: function() {
            return Pt1.collectBody
        }
    });
    Object.defineProperty(Mj6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Pt1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Mj6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Pt1.resolvedPath
        }
    });
    Mj6.Client = ppA;
    Mj6.Command = Wt1;
    Mj6.NoOpLogger = ipA;
    Mj6.SENSITIVE_STRING = vaK;
    Mj6.ServiceException = Jj6;
    Mj6._json = Xt1;
    Mj6.convertMap = uaK;
    Mj6.createAggregatedClient = NaK;
    Mj6.decorateServiceException = UpA;
    Mj6.emitWarningIfUnsupportedVersion = yaK;
    Mj6.getArrayIfSingleItem = baK;
    Mj6.getDefaultClientConfiguration = CaK;
    Mj6.getDefaultExtensionConfiguration = cpA;
    Mj6.getValueFromTextNode = lpA;
    Mj6.isSerializableHeaderValue = xaK;
    Mj6.loadConfigsForDefaultMode = EaK;
    Mj6.map = npA;
    Mj6.resolveDefaultRuntimeConfig = IaK;
    Mj6.serializeDateTime = QaK;
    Mj6.serializeFloat = paK;
    Mj6.take = maK;
    Mj6.throwDefaultError = dpA;
    Mj6.withBaseException = VaK;
    Object.keys(BpA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Mj6, A)) Object.defineProperty(Mj6, A, {
            enumerable: !0,
            get: function() {
                return BpA[A]
            }
        })
    })
})
// @from(Ln 69348, Col 4)
spA = x((apA) => {
    Object.defineProperty(apA, "__esModule", {
        value: !0
    });
    apA.createGetRequest = XsK;
    apA.getCredentials = PsK;
    var Zt1 = vJ(),
        JsK = PgA(),
        MsK = opA(),
        DsK = Rs1();

    function XsK(A) {
        return new JsK.HttpRequest({
            protocol: A.protocol,
            hostname: A.hostname,
            port: Number(A.port),
            path: A.pathname,
            query: Array.from(A.searchParams.entries()).reduce((q, [K, Y]) => {
                return q[K] = Y, q
            }, {}),
            fragment: A.hash
        })
    }
    async function PsK(A, q) {
        let Y = await (0, DsK.sdkStreamMixin)(A.body).transformToString();
        if (A.statusCode === 200) {
            let z = JSON.parse(Y);
            if (typeof z.AccessKeyId !== "string" || typeof z.SecretAccessKey !== "string" || typeof z.Token !== "string" || typeof z.Expiration !== "string") throw new Zt1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
                logger: q
            });
            return {
                accessKeyId: z.AccessKeyId,
                secretAccessKey: z.SecretAccessKey,
                sessionToken: z.Token,
                expiration: (0, MsK.parseRfc3339DateTime)(z.Expiration)
            }
        }
        if (A.statusCode >= 400 && A.statusCode < 500) {
            let z = {};
            try {
                z = JSON.parse(Y)
            } catch (_) {}
            throw Object.assign(new Zt1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
                logger: q
            }), {
                Code: z.Code,
                Message: z.Message
            })
        }
        throw new Zt1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
            logger: q
        })
    }
})
// @from(Ln 69402, Col 4)
AQA = x((tpA) => {
    Object.defineProperty(tpA, "__esModule", {
        value: !0
    });
    tpA.retryWrapper = void 0;
    var GsK = (A, q, K) => {
        return async () => {
            for (let Y = 0; Y < q; ++Y) try {
                return await A()
            } catch (z) {
                await new Promise((_) => setTimeout(_, K))
            }
            return await A()
        }
    };
    tpA.retryWrapper = GsK
})
// @from(Ln 69419, Col 4)
_QA = x((YQA) => {
    Object.defineProperty(YQA, "__esModule", {
        value: !0
    });
    YQA.fromHttp = void 0;
    var fsK = _2(),
        TsK = mT(),
        vsK = uT(),
        qQA = vJ(),
        NsK = fsK.__importDefault(x6("fs/promises")),
        VsK = JgA(),
        KQA = spA(),
        ksK = AQA(),
        EsK = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        ysK = "http://169.254.170.2",
        LsK = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        RsK = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
        hsK = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        SsK = (A = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
            let q, K = A.awsContainerCredentialsRelativeUri ?? process.env[EsK],
                Y = A.awsContainerCredentialsFullUri ?? process.env[LsK],
                z = A.awsContainerAuthorizationToken ?? process.env[hsK],
                _ = A.awsContainerAuthorizationTokenFile ?? process.env[RsK],
                w = A.logger?.constructor?.name === "NoOpLogger" || !A.logger?.warn ? console.warn : A.logger.warn.bind(A.logger);
            if (K && Y) w("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), w("awsContainerCredentialsFullUri will take precedence.");
            if (z && _) w("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), w("awsContainerAuthorizationToken will take precedence.");
            if (Y) q = Y;
            else if (K) q = `${ysK}${K}`;
            else throw new qQA.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
                logger: A.logger
            });
            let O = new URL(q);
            (0, VsK.checkUrl)(O, A.logger);
            let $ = vsK.NodeHttpHandler.create({
                requestTimeout: A.timeout ?? 1000,
                connectionTimeout: A.timeout ?? 1000
            });
            return (0, ksK.retryWrapper)(async () => {
                let H = (0, KQA.createGetRequest)(O);
                if (z) H.headers.Authorization = z;
                else if (_) H.headers.Authorization = (await NsK.default.readFile(_)).toString();
                try {
                    let j = await $.handle(H);
                    return (0, KQA.getCredentials)(j.response).then((J) => (0, TsK.setCredentialFeature)(J, "CREDENTIALS_HTTP", "z"))
                } catch (j) {
                    throw new qQA.CredentialsProviderError(String(j), {
                        logger: A.logger
                    })
                }
            }, A.maxRetries ?? 3, A.timeout ?? 1000)
        };
    YQA.fromHttp = SsK
})
// @from(Ln 69474, Col 4)
Mq1 = x((Gt1) => {
    Object.defineProperty(Gt1, "__esModule", {
        value: !0
    });
    Gt1.fromHttp = void 0;
    var CsK = _QA();
    Object.defineProperty(Gt1, "fromHttp", {
        enumerable: !0,
        get: function() {
            return CsK.fromHttp
        }
    })
})
// @from(Ln 69487, Col 4)
Et1 = x((gsK) => {
    gsK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(gsK.HttpAuthLocation || (gsK.HttpAuthLocation = {}));
    gsK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(gsK.HttpApiKeyAuthLocation || (gsK.HttpApiKeyAuthLocation = {}));
    gsK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(gsK.EndpointURLScheme || (gsK.EndpointURLScheme = {}));
    gsK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(gsK.AlgorithmId || (gsK.AlgorithmId = {}));
    var bsK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => gsK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => gsK.AlgorithmId.MD5,
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
        xsK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        usK = (A) => {
            return bsK(A)
        },
        msK = (A) => {
            return xsK(A)
        };
    gsK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(gsK.FieldPosition || (gsK.FieldPosition = {}));
    var BsK = "__smithy_context";
    gsK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(gsK.IniSectionType || (gsK.IniSectionType = {}));
    gsK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(gsK.RequestHandlerProtocol || (gsK.RequestHandlerProtocol = {}));
    gsK.SMITHY_CONTEXT_KEY = BsK;
    gsK.getDefaultClientConfiguration = usK;
    gsK.resolveDefaultRuntimeConfig = msK
})
// @from(Ln 69552, Col 4)
Xq1 = x((nsK) => {
    var UsK = Et1(),
        dsK = (A) => {
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
        csK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class wQA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = UsK.FieldPosition.HEADER,
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
    class OQA {
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
    class Dq1 {
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
            let q = new Dq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = lsK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Dq1.clone(this)
        }
    }

    function lsK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class $QA {
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

    function isK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    nsK.Field = wQA;
    nsK.Fields = OQA;
    nsK.HttpRequest = Dq1;
    nsK.HttpResponse = $QA;
    nsK.getHttpHandlerExtensionConfiguration = dsK;
    nsK.isValidHostname = isK;
    nsK.resolveHttpHandlerRuntimeConfig = csK
})
// @from(Ln 69694, Col 4)
HQA = x((wtK) => {
    wtK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(wtK.HttpAuthLocation || (wtK.HttpAuthLocation = {}));
    wtK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(wtK.HttpApiKeyAuthLocation || (wtK.HttpApiKeyAuthLocation = {}));
    wtK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(wtK.EndpointURLScheme || (wtK.EndpointURLScheme = {}));
    wtK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(wtK.AlgorithmId || (wtK.AlgorithmId = {}));
    var qtK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => wtK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => wtK.AlgorithmId.MD5,
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
        KtK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        YtK = (A) => {
            return qtK(A)
        },
        ztK = (A) => {
            return KtK(A)
        };
    wtK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(wtK.FieldPosition || (wtK.FieldPosition = {}));
    var _tK = "__smithy_context";
    wtK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(wtK.IniSectionType || (wtK.IniSectionType = {}));
    wtK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(wtK.RequestHandlerProtocol || (wtK.RequestHandlerProtocol = {}));
    wtK.SMITHY_CONTEXT_KEY = _tK;
    wtK.getDefaultClientConfiguration = YtK;
    wtK.resolveDefaultRuntimeConfig = ztK
})
// @from(Ln 69759, Col 4)
DQA = x((PtK) => {
    var jtK = HQA(),
        JtK = (A) => {
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
        MtK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class jQA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = jtK.FieldPosition.HEADER,
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
    class JQA {
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
    class Pq1 {
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
            let q = new Pq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = DtK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Pq1.clone(this)
        }
    }

    function DtK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class MQA {
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

    function XtK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    PtK.Field = jQA;
    PtK.Fields = JQA;
    PtK.HttpRequest = Pq1;
    PtK.HttpResponse = MQA;
    PtK.getHttpHandlerExtensionConfiguration = JtK;
    PtK.isValidHostname = XtK;
    PtK.resolveHttpHandlerRuntimeConfig = MtK
})
// @from(Ln 69901, Col 4)
bt1 = x((EtK) => {
    var VtK = DQA(),
        XQA = (A, q) => (K, Y) => async (z) => {
            let {
                response: _
            } = await K(z);
            try {
                let w = await q(_, A);
                return {
                    response: _,
                    output: w
                }
            } catch (w) {
                if (Object.defineProperty(w, "$response", {
                        value: _,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in w)) {
                    try {
                        w.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch ($) {
                        if (!Y.logger || Y.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else Y.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof w.$responseBodyText < "u") {
                        if (w.$response) w.$response.body = w.$responseBodyText
                    }
                    try {
                        if (VtK.HttpResponse.isInstance(_)) {
                            let {
                                headers: $ = {}
                            } = _, H = Object.entries($);
                            w.$metadata = {
                                httpStatusCode: _.statusCode,
                                requestId: It1(/^x-[\w-]+-request-?id$/, H),
                                extendedRequestId: It1(/^x-[\w-]+-id-2$/, H),
                                cfId: It1(/^x-[\w-]+-cf-id$/, H)
                            }
                        }
                    } catch ($) {}
                }
                throw w
            }
        }, It1 = (A, q) => {
            return (q.find(([K]) => {
                return K.match(A)
            }) || [void 0, void 0])[1]
        }, PQA = (A, q) => (K, Y) => async (z) => {
            let _ = A,
                w = Y.endpointV2?.url && _.urlParser ? async () => _.urlParser(Y.endpointV2.url): _.endpoint;
            if (!w) throw Error("No valid endpoint provider available.");
            let O = await q(z.input, {
                ...A,
                endpoint: w
            });
            return K({
                ...z,
                request: O
            })
        }, WQA = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, ZQA = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function ktK(A, q, K) {
        return {
            applyToStack: (Y) => {
                Y.add(XQA(A, K), WQA), Y.add(PQA(A, q), ZQA)
            }
        }
    }
    EtK.deserializerMiddleware = XQA;
    EtK.deserializerMiddlewareOption = WQA;
    EtK.getSerdePlugin = ktK;
    EtK.serializerMiddleware = PQA;
    EtK.serializerMiddlewareOption = ZQA
})
// @from(Ln 69987, Col 4)
w_ = x((SQA) => {
    var Wq1 = us1(),
        GQA = VW(),
        CtK = bt1(),
        xt1 = Qh6(),
        ItK = pT(),
        btK = (A) => A[Wq1.SMITHY_CONTEXT_KEY] || (A[Wq1.SMITHY_CONTEXT_KEY] = {}),
        xtK = (A, q) => {
            if (!q || q.length === 0) return A;
            let K = [];
            for (let Y of q)
                for (let z of A)
                    if (z.schemeId.split("#")[1] === Y) K.push(z);
            for (let Y of A)
                if (!K.find(({
                        schemeId: z
                    }) => z === Y.schemeId)) K.push(Y);
            return K
        };

    function utK(A) {
        let q = new Map;
        for (let K of A) q.set(K.schemeId, K);
        return q
    }
    var ut1 = (A, q) => (K, Y) => async (z) => {
        let _ = A.httpAuthSchemeProvider(await q.httpAuthSchemeParametersProvider(A, Y, z.input)),
            w = A.authSchemePreference ? await A.authSchemePreference() : [],
            O = xtK(_, w),
            $ = utK(A.httpAuthSchemes),
            H = GQA.getSmithyContext(Y),
            j = [];
        for (let J of O) {
            let M = $.get(J.schemeId);
            if (!M) {
                j.push(`HttpAuthScheme \`${J.schemeId}\` was not enabled for this service.`);
                continue
            }
            let D = M.identityProvider(await q.identityProviderConfigProvider(A));
            if (!D) {
                j.push(`HttpAuthScheme \`${J.schemeId}\` did not have an IdentityProvider configured.`);
                continue
            }
            let {
                identityProperties: X = {},
                signingProperties: P = {}
            } = J.propertiesExtractor?.(A, Y) || {};
            J.identityProperties = Object.assign(J.identityProperties || {}, X), J.signingProperties = Object.assign(J.signingProperties || {}, P), H.selectedHttpAuthScheme = {
                httpAuthOption: J,
                identity: await D(J.identityProperties),
                signer: M.signer
            };
            break
        }
        if (!H.selectedHttpAuthScheme) throw Error(j.join(`
`));
        return K(z)
    }, fQA = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: "endpointV2Middleware"
    }, mtK = (A, {
        httpAuthSchemeParametersProvider: q,
        identityProviderConfigProvider: K
    }) => ({
        applyToStack: (Y) => {
            Y.addRelativeTo(ut1(A, {
                httpAuthSchemeParametersProvider: q,
                identityProviderConfigProvider: K
            }), fQA)
        }
    }), TQA = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: CtK.serializerMiddlewareOption.name
    }, BtK = (A, {
        httpAuthSchemeParametersProvider: q,
        identityProviderConfigProvider: K
    }) => ({
        applyToStack: (Y) => {
            Y.addRelativeTo(ut1(A, {
                httpAuthSchemeParametersProvider: q,
                identityProviderConfigProvider: K
            }), TQA)
        }
    }), gtK = (A) => (q) => {
        throw q
    }, FtK = (A, q) => {}, vQA = (A) => (q, K) => async (Y) => {
        if (!xt1.HttpRequest.isInstance(Y.request)) return q(Y);
        let _ = GQA.getSmithyContext(K).selectedHttpAuthScheme;
        if (!_) throw Error("No HttpAuthScheme was selected: unable to sign request");
        let {
            httpAuthOption: {
                signingProperties: w = {}
            },
            identity: O,
            signer: $
        } = _, H = await q({
            ...Y,
            request: await $.sign(Y.request, O, w)
        }).catch(($.errorHandler || gtK)(w));
        return ($.successHandler || FtK)(H.response, w), H
    }, NQA = {
        step: "finalizeRequest",
        tags: ["HTTP_SIGNING"],
        name: "httpSigningMiddleware",
        aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
        override: !0,
        relation: "after",
        toMiddleware: "retryMiddleware"
    }, ptK = (A) => ({
        applyToStack: (q) => {
            q.addRelativeTo(vQA(), NQA)
        }
    }), QtK = (A) => {
        if (typeof A === "function") return A;
        let q = Promise.resolve(A);
        return () => q
    }, UtK = async (A, q, K, Y = (_) => _, ...z) => {
        let _ = new A(K);
        return _ = Y(_) ?? _, await q.send(_, ...z)
    };

    function dtK(A, q, K, Y, z) {
        return async function*(w, O, ...$) {
            let H = O,
                j = w.startingToken ?? H[K],
                J = !0,
                M;
            while (J) {
                if (H[K] = j, z) H[z] = H[z] ?? w.pageSize;
                if (w.client instanceof A) M = await UtK(q, w.client, O, w.withCommand, ...$);
                else throw Error(`Invalid client, expected instance of ${A.name}`);
                yield M;
                let D = j;
                j = ctK(M, Y), J = !!(j && (!w.stopOnSameToken || j !== D))
            }
            return
        }
    }
    var ctK = (A, q) => {
        let K = A,
            Y = q.split(".");
        for (let z of Y) {
            if (!K || typeof K !== "object") return;
            K = K[z]
        }
        return K
    };

    function ltK(A, q, K) {
        if (!A.__smithy_context) A.__smithy_context = {
            features: {}
        };
        else if (!A.__smithy_context.features) A.__smithy_context.features = {};
        A.__smithy_context.features[q] = K
    }
    class VQA {
        authSchemes = new Map;
        constructor(A) {
            for (let [q, K] of Object.entries(A))
                if (K !== void 0) this.authSchemes.set(q, K)
        }
        getIdentityProvider(A) {
            return this.authSchemes.get(A)
        }
    }
    class kQA {
        async sign(A, q, K) {
            if (!K) throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
            if (!K.name) throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
            if (!K.in) throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
            if (!q.apiKey) throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
            let Y = xt1.HttpRequest.clone(A);
            if (K.in === Wq1.HttpApiKeyAuthLocation.QUERY) Y.query[K.name] = q.apiKey;
            else if (K.in === Wq1.HttpApiKeyAuthLocation.HEADER) Y.headers[K.name] = K.scheme ? `${K.scheme} ${q.apiKey}` : q.apiKey;
            else throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + K.in + "`");
            return Y
        }
    }
    class EQA {
        async sign(A, q, K) {
            let Y = xt1.HttpRequest.clone(A);
            if (!q.token) throw Error("request could not be signed with `token` since the `token` is not defined");
            return Y.headers.Authorization = `Bearer ${q.token}`, Y
        }
    }
    class yQA {
        async sign(A, q, K) {
            return A
        }
    }
    var LQA = (A) => function(K) {
            return hQA(K) && K.expiration.getTime() - Date.now() < A
        },
        RQA = 300000,
        itK = LQA(RQA),
        hQA = (A) => A.expiration !== void 0,
        ntK = (A, q, K) => {
            if (A === void 0) return;
            let Y = typeof A !== "function" ? async () => Promise.resolve(A): A, z, _, w, O = !1, $ = async (H) => {
                if (!_) _ = Y(H);
                try {
                    z = await _, w = !0, O = !1
                } finally {
                    _ = void 0
                }
                return z
            };
            if (q === void 0) return async (H) => {
                if (!w || H?.forceRefresh) z = await $(H);
                return z
            };
            return async (H) => {
                if (!w || H?.forceRefresh) z = await $(H);
                if (O) return z;
                if (!K(z)) return O = !0, z;
                if (q(z)) return await $(H), z;
                return z
            }
        };
    Object.defineProperty(SQA, "requestBuilder", {
        enumerable: !0,
        get: function() {
            return ItK.requestBuilder
        }
    });
    SQA.DefaultIdentityProviderConfig = VQA;
    SQA.EXPIRATION_MS = RQA;
    SQA.HttpApiKeyAuthSigner = kQA;
    SQA.HttpBearerAuthSigner = EQA;
    SQA.NoAuthSigner = yQA;
    SQA.createIsIdentityExpiredFunction = LQA;
    SQA.createPaginator = dtK;
    SQA.doesIdentityRequireRefresh = hQA;
    SQA.getHttpAuthSchemeEndpointRuleSetPlugin = mtK;
    SQA.getHttpAuthSchemePlugin = BtK;
    SQA.getHttpSigningPlugin = ptK;
    SQA.getSmithyContext = btK;
    SQA.httpAuthSchemeEndpointRuleSetMiddlewareOptions = fQA;
    SQA.httpAuthSchemeMiddleware = ut1;
    SQA.httpAuthSchemeMiddlewareOptions = TQA;
    SQA.httpSigningMiddleware = vQA;
    SQA.httpSigningMiddlewareOptions = NQA;
    SQA.isIdentityExpired = itK;
    SQA.memoizeIdentityProvider = ntK;
    SQA.normalizeProvider = QtK;
    SQA.setFeature = ltK
})
// @from(Ln 70242, Col 4)
IQA = x((ZeK) => {
    var CQA = {},
        mt1 = {};
    for (let A = 0; A < 256; A++) {
        let q = A.toString(16).toLowerCase();
        if (q.length === 1) q = `0${q}`;
        CQA[A] = q, mt1[q] = A
    }

    function PeK(A) {
        if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
        let q = new Uint8Array(A.length / 2);
        for (let K = 0; K < A.length; K += 2) {
            let Y = A.slice(K, K + 2).toLowerCase();
            if (Y in mt1) q[K / 2] = mt1[Y];
            else throw Error(`Cannot decode unrecognized sequence ${Y} as hexadecimal`)
        }
        return q
    }

    function WeK(A) {
        let q = "";
        for (let K = 0; K < A.byteLength; K++) q += CQA[A[K]];
        return q
    }
    ZeK.fromHex = PeK;
    ZeK.toHex = WeK
})
// @from(Ln 70270, Col 4)
bQA = x((veK) => {
    var TeK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    veK.isArrayBuffer = TeK
})
// @from(Ln 70274, Col 4)
uQA = x((EeK) => {
    var xQA = (A) => encodeURIComponent(A).replace(/[!'()*]/g, VeK),
        VeK = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
        keK = (A) => A.split("/").map(xQA).join("/");
    EeK.escapeUri = xQA;
    EeK.escapeUriPath = keK
})
// @from(Ln 70281, Col 4)
nt1 = x((geK) => {
    var Ur = IQA(),
        e76 = C_(),
        ReK = bQA(),
        FQA = Xq1(),
        mQA = VW(),
        Zq1 = uQA(),
        pQA = "X-Amz-Algorithm",
        QQA = "X-Amz-Credential",
        Ft1 = "X-Amz-Date",
        UQA = "X-Amz-SignedHeaders",
        dQA = "X-Amz-Expires",
        pt1 = "X-Amz-Signature",
        Qt1 = "X-Amz-Security-Token",
        heK = "X-Amz-Region-Set",
        Ut1 = "authorization",
        dt1 = Ft1.toLowerCase(),
        cQA = "date",
        lQA = [Ut1, dt1, cQA],
        iQA = pt1.toLowerCase(),
        Nq1 = "x-amz-content-sha256",
        nQA = Qt1.toLowerCase(),
        SeK = "host",
        rQA = {
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
        oQA = /^proxy-/,
        aQA = /^sec-/,
        CeK = [/^proxy-/i, /^sec-/i],
        Gq1 = "AWS4-HMAC-SHA256",
        IeK = "AWS4-ECDSA-P256-SHA256",
        sQA = "AWS4-HMAC-SHA256-PAYLOAD",
        tQA = "UNSIGNED-PAYLOAD",
        eQA = 50,
        ct1 = "aws4_request",
        AUA = 604800,
        Dj6 = {},
        fq1 = [],
        Tq1 = (A, q, K) => `${A}/${q}/${K}/${ct1}`,
        qUA = async (A, q, K, Y, z) => {
            let _ = await BQA(A, q.secretAccessKey, q.accessKeyId),
                w = `${K}:${Y}:${z}:${Ur.toHex(_)}:${q.sessionToken}`;
            if (w in Dj6) return Dj6[w];
            fq1.push(w);
            while (fq1.length > eQA) delete Dj6[fq1.shift()];
            let O = `AWS4${q.secretAccessKey}`;
            for (let $ of [K, Y, z, ct1]) O = await BQA(A, O, $);
            return Dj6[w] = O
        }, beK = () => {
            fq1.length = 0, Object.keys(Dj6).forEach((A) => {
                delete Dj6[A]
            })
        }, BQA = (A, q, K) => {
            let Y = new A(q);
            return Y.update(e76.toUint8Array(K)), Y.digest()
        }, Bt1 = ({
            headers: A
        }, q, K) => {
            let Y = {};
            for (let z of Object.keys(A).sort()) {
                if (A[z] == null) continue;
                let _ = z.toLowerCase();
                if (_ in rQA || q?.has(_) || oQA.test(_) || aQA.test(_)) {
                    if (!K || K && !K.has(_)) continue
                }
                Y[_] = A[z].trim().replace(/\s+/g, " ")
            }
            return Y
        }, vq1 = async ({
            headers: A,
            body: q
        }, K) => {
            for (let Y of Object.keys(A))
                if (Y.toLowerCase() === Nq1) return A[Y];
            if (q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
            else if (typeof q === "string" || ArrayBuffer.isView(q) || ReK.isArrayBuffer(q)) {
                let Y = new K;
                return Y.update(e76.toUint8Array(q)), Ur.toHex(await Y.digest())
            }
            return tQA
        };
    class KUA {
        format(A) {
            let q = [];
            for (let z of Object.keys(A)) {
                let _ = e76.fromUtf8(z);
                q.push(Uint8Array.from([_.byteLength]), _, this.formatHeaderValue(A[z]))
            }
            let K = new Uint8Array(q.reduce((z, _) => z + _.byteLength, 0)),
                Y = 0;
            for (let z of q) K.set(z, Y), Y += z.byteLength;
            return K
        }
        formatHeaderValue(A) {
            switch (A.type) {
                case "boolean":
                    return Uint8Array.from([A.value ? 0 : 1]);
                case "byte":
                    return Uint8Array.from([2, A.value]);
                case "short":
                    let q = new DataView(new ArrayBuffer(3));
                    return q.setUint8(0, 3), q.setInt16(1, A.value, !1), new Uint8Array(q.buffer);
                case "integer":
                    let K = new DataView(new ArrayBuffer(5));
                    return K.setUint8(0, 4), K.setInt32(1, A.value, !1), new Uint8Array(K.buffer);
                case "long":
                    let Y = new Uint8Array(9);
                    return Y[0] = 5, Y.set(A.value.bytes, 1), Y;
                case "binary":
                    let z = new DataView(new ArrayBuffer(3 + A.value.byteLength));
                    z.setUint8(0, 6), z.setUint16(1, A.value.byteLength, !1);
                    let _ = new Uint8Array(z.buffer);
                    return _.set(A.value, 3), _;
                case "string":
                    let w = e76.fromUtf8(A.value),
                        O = new DataView(new ArrayBuffer(3 + w.byteLength));
                    O.setUint8(0, 7), O.setUint16(1, w.byteLength, !1);
                    let $ = new Uint8Array(O.buffer);
                    return $.set(w, 3), $;
                case "timestamp":
                    let H = new Uint8Array(9);
                    return H[0] = 8, H.set(lt1.fromNumber(A.value.valueOf()).bytes, 1), H;
                case "uuid":
                    if (!xeK.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
                    let j = new Uint8Array(17);
                    return j[0] = 9, j.set(Ur.fromHex(A.value.replace(/\-/g, "")), 1), j
            }
        }
    }
    var xeK = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
    class lt1 {
        bytes;
        constructor(A) {
            if (this.bytes = A, A.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
        }
        static fromNumber(A) {
            if (A > 9223372036854776000 || A < -9223372036854776000) throw Error(`${A} is too large (or, if negative, too small) to represent as an Int64`);
            let q = new Uint8Array(8);
            for (let K = 7, Y = Math.abs(Math.round(A)); K > -1 && Y > 0; K--, Y /= 256) q[K] = Y;
            if (A < 0) gQA(q);
            return new lt1(q)
        }
        valueOf() {
            let A = this.bytes.slice(0),
                q = A[0] & 128;
            if (q) gQA(A);
            return parseInt(Ur.toHex(A), 16) * (q ? -1 : 1)
        }
        toString() {
            return String(this.valueOf())
        }
    }

    function gQA(A) {
        for (let q = 0; q < 8; q++) A[q] ^= 255;
        for (let q = 7; q > -1; q--)
            if (A[q]++, A[q] !== 0) break
    }
    var YUA = (A, q) => {
            A = A.toLowerCase();
            for (let K of Object.keys(q))
                if (A === K.toLowerCase()) return !0;
            return !1
        },
        zUA = (A, q = {}) => {
            let {
                headers: K,
                query: Y = {}
            } = FQA.HttpRequest.clone(A);
            for (let z of Object.keys(K)) {
                let _ = z.toLowerCase();
                if (_.slice(0, 6) === "x-amz-" && !q.unhoistableHeaders?.has(_) || q.hoistableHeaders?.has(_)) Y[z] = K[z], delete K[z]
            }
            return {
                ...A,
                headers: K,
                query: Y
            }
        },
        gt1 = (A) => {
            A = FQA.HttpRequest.clone(A);
            for (let q of Object.keys(A.headers))
                if (lQA.indexOf(q.toLowerCase()) > -1) delete A.headers[q];
            return A
        },
        _UA = ({
            query: A = {}
        }) => {
            let q = [],
                K = {};
            for (let Y of Object.keys(A)) {
                if (Y.toLowerCase() === iQA) continue;
                let z = Zq1.escapeUri(Y);
                q.push(z);
                let _ = A[Y];
                if (typeof _ === "string") K[z] = `${z}=${Zq1.escapeUri(_)}`;
                else if (Array.isArray(_)) K[z] = _.slice(0).reduce((w, O) => w.concat([`${z}=${Zq1.escapeUri(O)}`]), []).sort().join("&")
            }
            return q.sort().map((Y) => K[Y]).filter((Y) => Y).join("&")
        },
        ueK = (A) => meK(A).toISOString().replace(/\.\d{3}Z$/, "Z"),
        meK = (A) => {
            if (typeof A === "number") return new Date(A * 1000);
            if (typeof A === "string") {
                if (Number(A)) return new Date(Number(A) * 1000);
                return new Date(A)
            }
            return A
        };
    class it1 {
        service;
        regionProvider;
        credentialProvider;
        sha256;
        uriEscapePath;
        applyChecksum;
        constructor({
            applyChecksum: A,
            credentials: q,
            region: K,
            service: Y,
            sha256: z,
            uriEscapePath: _ = !0
        }) {
            this.service = Y, this.sha256 = z, this.uriEscapePath = _, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = mQA.normalizeProvider(K), this.credentialProvider = mQA.normalizeProvider(q)
        }
        createCanonicalRequest(A, q, K) {
            let Y = Object.keys(q).sort();
            return `${A.method}
${this.getCanonicalPath(A)}
${_UA(A)}
${Y.map((z)=>`${z}:${q[z]}`).join(`
`)}

${Y.join(";")}
${K}`
        }
        async createStringToSign(A, q, K, Y) {
            let z = new this.sha256;
            z.update(e76.toUint8Array(K));
            let _ = await z.digest();
            return `${Y}
${A}
${q}
${Ur.toHex(_)}`
        }
        getCanonicalPath({
            path: A
        }) {
            if (this.uriEscapePath) {
                let q = [];
                for (let z of A.split("/")) {
                    if (z?.length === 0) continue;
                    if (z === ".") continue;
                    if (z === "..") q.pop();
                    else q.push(z)
                }
                let K = `${A?.startsWith("/")?"/":""}${q.join("/")}${q.length>0&&A?.endsWith("/")?"/":""}`;
                return Zq1.escapeUri(K).replace(/%2F/g, "/")
            }
            return A
        }
        validateResolvedCredentials(A) {
            if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
        }
        formatDate(A) {
            let q = ueK(A).replace(/[\-:]/g, "");
            return {
                longDate: q,
                shortDate: q.slice(0, 8)
            }
        }
        getCanonicalHeaderList(A) {
            return Object.keys(A).sort().join(";")
        }
    }
    class wUA extends it1 {
        headerFormatter = new KUA;
        constructor({
            applyChecksum: A,
            credentials: q,
            region: K,
            service: Y,
            sha256: z,
            uriEscapePath: _ = !0
        }) {
            super({
                applyChecksum: A,
                credentials: q,
                region: K,
                service: Y,
                sha256: z,
                uriEscapePath: _
            })
        }
        async presign(A, q = {}) {
            let {
                signingDate: K = new Date,
                expiresIn: Y = 3600,
                unsignableHeaders: z,
                unhoistableHeaders: _,
                signableHeaders: w,
                hoistableHeaders: O,
                signingRegion: $,
                signingService: H
            } = q, j = await this.credentialProvider();
            this.validateResolvedCredentials(j);
            let J = $ ?? await this.regionProvider(),
                {
                    longDate: M,
                    shortDate: D
                } = this.formatDate(K);
            if (Y > AUA) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
            let X = Tq1(D, J, H ?? this.service),
                P = zUA(gt1(A), {
                    unhoistableHeaders: _,
                    hoistableHeaders: O
                });
            if (j.sessionToken) P.query[Qt1] = j.sessionToken;
            P.query[pQA] = Gq1, P.query[QQA] = `${j.accessKeyId}/${X}`, P.query[Ft1] = M, P.query[dQA] = Y.toString(10);
            let W = Bt1(P, z, w);
            return P.query[UQA] = this.getCanonicalHeaderList(W), P.query[pt1] = await this.getSignature(M, X, this.getSigningKey(j, J, D, H), this.createCanonicalRequest(P, W, await vq1(A, this.sha256))), P
        }
        async sign(A, q) {
            if (typeof A === "string") return this.signString(A, q);
            else if (A.headers && A.payload) return this.signEvent(A, q);
            else if (A.message) return this.signMessage(A, q);
            else return this.signRequest(A, q)
        }
        async signEvent({
            headers: A,
            payload: q
        }, {
            signingDate: K = new Date,
            priorSignature: Y,
            signingRegion: z,
            signingService: _
        }) {
            let w = z ?? await this.regionProvider(),
                {
                    shortDate: O,
                    longDate: $
                } = this.formatDate(K),
                H = Tq1(O, w, _ ?? this.service),
                j = await vq1({
                    headers: {},
                    body: q
                }, this.sha256),
                J = new this.sha256;
            J.update(A);
            let M = Ur.toHex(await J.digest()),
                D = [sQA, $, H, Y, M, j].join(`
`);
            return this.signString(D, {
                signingDate: K,
                signingRegion: w,
                signingService: _
            })
        }
        async signMessage(A, {
            signingDate: q = new Date,
            signingRegion: K,
            signingService: Y
        }) {
            return this.signEvent({
                headers: this.headerFormatter.format(A.message.headers),
                payload: A.message.body
            }, {
                signingDate: q,
                signingRegion: K,
                signingService: Y,
                priorSignature: A.priorSignature
            }).then((_) => {
                return {
                    message: A.message,
                    signature: _
                }
            })
        }
        async signString(A, {
            signingDate: q = new Date,
            signingRegion: K,
            signingService: Y
        } = {}) {
            let z = await this.credentialProvider();
            this.validateResolvedCredentials(z);
            let _ = K ?? await this.regionProvider(),
                {
                    shortDate: w
                } = this.formatDate(q),
                O = new this.sha256(await this.getSigningKey(z, _, w, Y));
            return O.update(e76.toUint8Array(A)), Ur.toHex(await O.digest())
        }
        async signRequest(A, {
            signingDate: q = new Date,
            signableHeaders: K,
            unsignableHeaders: Y,
            signingRegion: z,
            signingService: _
        } = {}) {
            let w = await this.credentialProvider();
            this.validateResolvedCredentials(w);
            let O = z ?? await this.regionProvider(),
                $ = gt1(A),
                {
                    longDate: H,
                    shortDate: j
                } = this.formatDate(q),
                J = Tq1(j, O, _ ?? this.service);
            if ($.headers[dt1] = H, w.sessionToken) $.headers[nQA] = w.sessionToken;
            let M = await vq1($, this.sha256);
            if (!YUA(Nq1, $.headers) && this.applyChecksum) $.headers[Nq1] = M;
            let D = Bt1($, Y, K),
                X = await this.getSignature(H, J, this.getSigningKey(w, O, j, _), this.createCanonicalRequest($, D, M));
            return $.headers[Ut1] = `${Gq1} Credential=${w.accessKeyId}/${J}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${X}`, $
        }
        async getSignature(A, q, K, Y) {
            let z = await this.createStringToSign(A, q, Y, Gq1),
                _ = new this.sha256(await K);
            return _.update(e76.toUint8Array(z)), Ur.toHex(await _.digest())
        }
        getSigningKey(A, q, K, Y) {
            return qUA(this.sha256, A, K, q, Y || this.service)
        }
    }
    var BeK = {
        SignatureV4a: null
    };
    geK.ALGORITHM_IDENTIFIER = Gq1;
    geK.ALGORITHM_IDENTIFIER_V4A = IeK;
    geK.ALGORITHM_QUERY_PARAM = pQA;
    geK.ALWAYS_UNSIGNABLE_HEADERS = rQA;
    geK.AMZ_DATE_HEADER = dt1;
    geK.AMZ_DATE_QUERY_PARAM = Ft1;
    geK.AUTH_HEADER = Ut1;
    geK.CREDENTIAL_QUERY_PARAM = QQA;
    geK.DATE_HEADER = cQA;
    geK.EVENT_ALGORITHM_IDENTIFIER = sQA;
    geK.EXPIRES_QUERY_PARAM = dQA;
    geK.GENERATED_HEADERS = lQA;
    geK.HOST_HEADER = SeK;
    geK.KEY_TYPE_IDENTIFIER = ct1;
    geK.MAX_CACHE_SIZE = eQA;
    geK.MAX_PRESIGNED_TTL = AUA;
    geK.PROXY_HEADER_PATTERN = oQA;
    geK.REGION_SET_PARAM = heK;
    geK.SEC_HEADER_PATTERN = aQA;
    geK.SHA256_HEADER = Nq1;
    geK.SIGNATURE_HEADER = iQA;
    geK.SIGNATURE_QUERY_PARAM = pt1;
    geK.SIGNED_HEADERS_QUERY_PARAM = UQA;
    geK.SignatureV4 = wUA;
    geK.SignatureV4Base = it1;
    geK.TOKEN_HEADER = nQA;
    geK.TOKEN_QUERY_PARAM = Qt1;
    geK.UNSIGNABLE_PATTERNS = CeK;
    geK.UNSIGNED_PAYLOAD = tQA;
    geK.clearCredentialCache = beK;
    geK.createScope = Tq1;
    geK.getCanonicalHeaders = Bt1;
    geK.getCanonicalQuery = _UA;
    geK.getPayloadHash = vq1;
    geK.getSigningKey = qUA;
    geK.hasHeader = YUA;
    geK.moveHeadersToQuery = zUA;
    geK.prepareRequest = gt1;
    geK.signatureV4aContainer = BeK
})