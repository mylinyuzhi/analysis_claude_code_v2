
// @from(Ln 75242, Col 4)
Nw = x((p45) => {
    var w68 = Xq1(),
        nr = w_(),
        adA = vJ(),
        T45 = mT(),
        sdA = nt1(),
        tdA = le1(),
        I_ = dO(),
        NQ = te1(),
        VP = pT(),
        QD = FT(),
        PS6 = q68(),
        _cA = C_(),
        Iy = z68(),
        _68 = {
            warningEmitted: !1
        },
        v45 = (A) => {
            if (A && !_68.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) _68.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function N45(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }

    function V45(A, q, K) {
        if (!A.__aws_sdk_context) A.__aws_sdk_context = {
            features: {}
        };
        else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
        A.__aws_sdk_context.features[q] = K
    }

    function k45(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }
    var edA = (A) => w68.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
        O68 = (A) => new Date(Date.now() + A),
        E45 = (A, q) => Math.abs(O68(q).getTime() - A) >= 300000,
        AcA = (A, q) => {
            let K = Date.parse(A);
            if (E45(K, q)) return K - Date.now();
            return q
        },
        XS6 = (A, q) => {
            if (!q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
            return q
        },
        $68 = async (A) => {
            let q = XS6("context", A.context),
                K = XS6("config", A.config),
                Y = q.endpointV2?.properties?.authSchemes?.[0],
                _ = await XS6("signer", K.signer)(Y),
                w = A?.signingRegion,
                O = A?.signingRegionSet,
                $ = A?.signingName;
            return {
                config: K,
                signer: _,
                signingRegion: w,
                signingRegionSet: O,
                signingName: $
            }
        };
    class mq1 {
        async sign(A, q, K) {
            if (!w68.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let Y = await $68(K),
                {
                    config: z,
                    signer: _
                } = Y,
                {
                    signingRegion: w,
                    signingName: O
                } = Y,
                $ = K.context;
            if ($?.authSchemes?.length ?? !1) {
                let [j, J] = $.authSchemes;
                if (j?.name === "sigv4a" && J?.name === "sigv4") w = J?.signingRegion ?? w, O = J?.signingName ?? O
            }
            return await _.sign(A, {
                signingDate: O68(z.systemClockOffset),
                signingRegion: w,
                signingService: O
            })
        }
        errorHandler(A) {
            return (q) => {
                let K = q.ServerTime ?? edA(q.$response);
                if (K) {
                    let Y = XS6("config", A.config),
                        z = Y.systemClockOffset;
                    if (Y.systemClockOffset = AcA(K, Y.systemClockOffset), Y.systemClockOffset !== z && q.$metadata) q.$metadata.clockSkewCorrected = !0
                }
                throw q
            }
        }
        successHandler(A, q) {
            let K = edA(A);
            if (K) {
                let Y = XS6("config", q.config);
                Y.systemClockOffset = AcA(K, Y.systemClockOffset)
            }
        }
    }
    var y45 = mq1;
    class wcA extends mq1 {
        async sign(A, q, K) {
            if (!w68.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: Y,
                signer: z,
                signingRegion: _,
                signingRegionSet: w,
                signingName: O
            } = await $68(K), H = (await Y.sigv4aSigningRegionSet?.() ?? w ?? [_]).join(",");
            return await z.sign(A, {
                signingDate: O68(Y.systemClockOffset),
                signingRegion: H,
                signingService: O
            })
        }
    }
    var qcA = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((q) => q.trim()) : [],
        OcA = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
        KcA = "AWS_AUTH_SCHEME_PREFERENCE",
        YcA = "auth_scheme_preference",
        L45 = {
            environmentVariableSelector: (A, q) => {
                if (q?.signingName) {
                    if (OcA(q.signingName) in A) return ["httpBearerAuth"]
                }
                if (!(KcA in A)) return;
                return qcA(A[KcA])
            },
            configFileSelector: (A) => {
                if (!(YcA in A)) return;
                return qcA(A[YcA])
            },
            default: []
        },
        R45 = (A) => {
            return A.sigv4aSigningRegionSet = nr.normalizeProvider(A.sigv4aSigningRegionSet), A
        },
        h45 = {
            environmentVariableSelector(A) {
                if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((q) => q.trim());
                throw new adA.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(A) {
                if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((q) => q.trim());
                throw new adA.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        $cA = (A) => {
            let q = A.credentials,
                K = !!A.credentials,
                Y = void 0;
            Object.defineProperty(A, "credentials", {
                set(H) {
                    if (H && H !== q && H !== Y) K = !0;
                    q = H;
                    let j = C45(A, {
                            credentials: q,
                            credentialDefaultProvider: A.credentialDefaultProvider
                        }),
                        J = I45(A, j);
                    if (K && !J.attributed) Y = async (M) => J(M).then((D) => T45.setCredentialFeature(D, "CREDENTIALS_CODE", "e")), Y.memoized = J.memoized, Y.configBound = J.configBound, Y.attributed = !0;
                    else Y = J
                },
                get() {
                    return Y
                },
                enumerable: !0,
                configurable: !0
            }), A.credentials = q;
            let {
                signingEscapePath: z = !0,
                systemClockOffset: _ = A.systemClockOffset || 0,
                sha256: w
            } = A, O;
            if (A.signer) O = nr.normalizeProvider(A.signer);
            else if (A.regionInfoProvider) O = () => nr.normalizeProvider(A.region)().then(async (H) => [await A.regionInfoProvider(H, {
                useFipsEndpoint: await A.useFipsEndpoint(),
                useDualstackEndpoint: await A.useDualstackEndpoint()
            }) || {}, H]).then(([H, j]) => {
                let {
                    signingRegion: J,
                    signingService: M
                } = H;
                A.signingRegion = A.signingRegion || J || j, A.signingName = A.signingName || M || A.serviceId;
                let D = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: w,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || sdA.SignatureV4)(D)
            });
            else O = async (H) => {
                H = Object.assign({}, {
                    name: "sigv4",
                    signingName: A.signingName || A.defaultSigningName,
                    signingRegion: await nr.normalizeProvider(A.region)(),
                    properties: {}
                }, H);
                let {
                    signingRegion: j,
                    signingName: J
                } = H;
                A.signingRegion = A.signingRegion || j, A.signingName = A.signingName || J || A.serviceId;
                let M = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: w,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || sdA.SignatureV4)(M)
            };
            return Object.assign(A, {
                systemClockOffset: _,
                signingEscapePath: z,
                signer: O
            })
        },
        S45 = $cA;

    function C45(A, {
        credentials: q,
        credentialDefaultProvider: K
    }) {
        let Y;
        if (q)
            if (!q?.memoized) Y = nr.memoizeIdentityProvider(q, nr.isIdentityExpired, nr.doesIdentityRequireRefresh);
            else Y = q;
        else if (K) Y = nr.normalizeProvider(K(Object.assign({}, A, {
            parentClientConfig: A
        })));
        else Y = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return Y.memoized = !0, Y
    }

    function I45(A, q) {
        if (q.configBound) return q;
        let K = async (Y) => q({
            ...Y,
            callerClientConfig: A
        });
        return K.memoized = q.memoized, K.configBound = !0, K
    }
    class fj6 {
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
                H = I_.TypeRegistry.for(w);
            try {
                return {
                    errorSchema: _?.(H, O) ?? H.getSchema(A),
                    errorMetadata: $
                }
            } catch (j) {
                Y.message = Y.message ?? Y.Message ?? "UnknownError";
                let J = I_.TypeRegistry.for("smithy.ts.sdk.synthetic." + w),
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
                    Y = NQ.decorateServiceException(A, q);
                if (K) Y.Message = K, Y.message = K;
                return Y
            }
            return NQ.decorateServiceException(A, q)
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
    class HcA extends tdA.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: A,
            awsQueryCompatible: q
        }) {
            super({
                defaultNamespace: A
            });
            this.awsQueryCompatible = !!q, this.mixin = new fj6(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            return Y
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let _ = tdA.loadSmithyRpcV2CborErrorCode(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = I_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(I_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H),
                M = {};
            for (let [D, X] of $.structIterator()) M[D] = this.deserializer.readValue(X, Y[D]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, M);
            throw this.mixin.decorateServiceException(Object.assign(J, O, {
                $fault: $.getMergedTraits().error,
                message: H
            }, M), Y)
        }
    }
    var b45 = (A) => {
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
        x45 = (A) => {
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
        u45 = (A) => {
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
    class rr {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }

    function m45(A, q, K) {
        if (K?.source) {
            let Y = K.source;
            if (typeof q === "number") {
                if (q > Number.MAX_SAFE_INTEGER || q < Number.MIN_SAFE_INTEGER || Y !== String(q))
                    if (Y.includes(".")) return new QD.NumericValue(Y, "bigDecimal");
                    else return BigInt(Y)
            }
        }
        return q
    }
    var jcA = (A, q) => NQ.collectBody(A, q).then((K) => (q?.utf8Encoder ?? _cA.toUtf8)(K)),
        H68 = (A, q) => jcA(A, q).then((K) => {
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
        B45 = async (A, q) => {
            let K = await H68(A, q);
            return K.message = K.message ?? K.Message, K
        }, j68 = (A, q) => {
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
    class J68 extends rr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        async read(A, q) {
            return this._read(A, typeof q === "string" ? JSON.parse(q, m45) : await H68(q, this.serdeContext))
        }
        readObject(A, q) {
            return this._read(A, q)
        }
        _read(A, q) {
            let K = q !== null && typeof q === "object",
                Y = I_.NormalizedSchema.of(A);
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
            if (Y.isBlobSchema() && typeof q === "string") return PS6.fromBase64(q);
            let z = Y.getMergedTraits().mediaType;
            if (Y.isStringSchema() && typeof q === "string" && z) {
                if (z === "application/json" || z.endsWith("+json")) return QD.LazyJsonString.from(q)
            }
            if (Y.isTimestampSchema() && q != null) switch (VP.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return QD.parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return QD.parseRfc7231DateTime(q);
                case 7:
                    return QD.parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (Y.isBigIntegerSchema() && (typeof q === "number" || typeof q === "string")) return BigInt(q);
            if (Y.isBigDecimalSchema() && q != null) {
                if (q instanceof QD.NumericValue) return q;
                let _ = q;
                if (_.type === "bigDecimal" && "string" in _) return new QD.NumericValue(_.string, _.type);
                return new QD.NumericValue(String(q), "bigDecimal")
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
                        if (O instanceof QD.NumericValue) _[w] = O;
                        else _[w] = this._read(Y, O);
                    return _
                } else return structuredClone(q);
            return q
        }
    }
    var zcA = String.fromCharCode(925);
    class JcA {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (A, q) => {
                if (q instanceof QD.NumericValue) {
                    let K = `${zcA+"nv"+this.counter++}_` + q.string;
                    return this.values.set(`"${K}"`, q.string), K
                }
                if (typeof q === "bigint") {
                    let K = q.toString(),
                        Y = `${zcA+"b"+this.counter++}_` + K;
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
    class M68 extends rr {
        settings;
        buffer;
        rootSchema;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            this.rootSchema = I_.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, q)
        }
        writeDiscriminatedDocument(A, q) {
            if (this.write(A, q), typeof this.buffer === "object") this.buffer.__type = I_.NormalizedSchema.of(A).getName(!0)
        }
        flush() {
            let {
                rootSchema: A
            } = this;
            if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
                let q = new JcA;
                return q.replaceInJson(JSON.stringify(this.buffer, q.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(A, q, K) {
            let Y = q !== null && typeof q === "object",
                z = I_.NormalizedSchema.of(A);
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
                return (this.serdeContext?.base64Encoder ?? PS6.toBase64)(q)
            }
            if ((z.isTimestampSchema() || z.isDocumentSchema()) && q instanceof Date) switch (VP.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return q.toISOString().replace(".000Z", "Z");
                case 6:
                    return QD.dateToUtcString(q);
                case 7:
                    return q.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", q), q.getTime() / 1000
            }
            if (z.isNumericSchema() && typeof q === "number") {
                if (Math.abs(q) === 1 / 0 || isNaN(q)) return String(q)
            }
            if (z.isStringSchema()) {
                if (typeof q > "u" && z.isIdempotencyToken()) return QD.generateIdempotencyToken();
                let _ = z.getMergedTraits().mediaType;
                if (q != null && _) {
                    if (_ === "application/json" || _.endsWith("+json")) return QD.LazyJsonString.from(q)
                }
            }
            if (z.isDocumentSchema())
                if (Y) {
                    let _ = Array.isArray(q) ? [] : {};
                    for (let [w, O] of Object.entries(q))
                        if (O instanceof QD.NumericValue) _[w] = O;
                        else _[w] = this._write(z, O);
                    return _
                } else return structuredClone(q);
            return q
        }
    }
    class Bq1 extends rr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new M68(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new J68(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class gq1 extends VP.RpcProtocol {
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
            this.serviceTarget = q, this.codec = new Bq1({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!K, this.mixin = new fj6(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (!Y.path.endsWith("/")) Y.path += "/";
            if (Object.assign(Y.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${A.name}`
                }), this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            if (I_.deref(A.input) === "unit" || !Y.body) Y.body = "{}";
            return Y
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let _ = j68(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = I_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(I_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H),
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
    class McA extends gq1 {
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
    class DcA extends gq1 {
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
    class XcA extends VP.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new fj6;
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
            this.codec = new Bq1(q), this.serializer = new VP.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new VP.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
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
                z = I_.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let _ = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (_) Y.headers["content-type"] = _
            }
            if (Y.body == null && Y.headers["content-type"] === this.getDefaultContentType()) Y.body = "{}";
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = await super.deserializeResponse(A, q, K),
                z = I_.NormalizedSchema.of(A.output);
            for (let [_, w] of z.structIterator())
                if (w.getMemberTraits().httpPayload && !(_ in Y)) Y[_] = null;
            return Y
        }
        async handleError(A, q, K, Y, z) {
            let _ = j68(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = I_.NormalizedSchema.of(w),
                H = Y.message ?? Y.Message ?? "Unknown",
                J = new(I_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H);
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
    var g45 = (A) => {
        if (A == null) return;
        if (typeof A === "object" && "__type" in A) delete A.__type;
        return NQ.expectUnion(A)
    };
    class Fq1 extends rr {
        settings;
        stringDeserializer;
        constructor(A) {
            super();
            this.settings = A, this.stringDeserializer = new VP.FromStringShapeDeserializer(A)
        }
        setSerdeContext(A) {
            this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
        }
        read(A, q, K) {
            let Y = I_.NormalizedSchema.of(A),
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
            let w = (this.serdeContext?.utf8Encoder ?? _cA.toUtf8)(q),
                O = this.parseXml(w);
            return this.readSchema(A, K ? O[K] : O)
        }
        readSchema(A, q) {
            let K = I_.NormalizedSchema.of(A);
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
                    q = Iy.parseXML(A)
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
                return NQ.getValueFromTextNode(z)
            }
            return {}
        }
    }
    class PcA extends rr {
        settings;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q, K = "") {
            if (this.buffer === void 0) this.buffer = "";
            let Y = I_.NormalizedSchema.of(A);
            if (K && !K.endsWith(".")) K += ".";
            if (Y.isBlobSchema()) {
                if (typeof q === "string" || q instanceof Uint8Array) this.writeKey(K), this.writeValue((this.serdeContext?.base64Encoder ?? PS6.toBase64)(q))
            } else if (Y.isBooleanSchema() || Y.isNumericSchema() || Y.isStringSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q));
                else if (Y.isIdempotencyToken()) this.writeKey(K), this.writeValue(QD.generateIdempotencyToken())
            } else if (Y.isBigIntegerSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q))
            } else if (Y.isBigDecimalSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(q instanceof QD.NumericValue ? q.string : String(q))
            } else if (Y.isTimestampSchema()) {
                if (q instanceof Date) switch (this.writeKey(K), VP.determineTimestampFormat(Y, this.settings)) {
                    case 5:
                        this.writeValue(q.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(NQ.dateToUtcString(q));
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
            this.buffer += `&${VP.extendedEncodeURIComponent(A)}=`
        }
        writeValue(A) {
            this.buffer += VP.extendedEncodeURIComponent(A)
        }
    }
    class D68 extends VP.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new fj6;
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
            this.serializer = new PcA(q), this.deserializer = new Fq1(q)
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
                }), I_.deref(A.input) === "unit" || !Y.body) Y.body = "";
            let z = A.name.split("#")[1] ?? A.name;
            if (Y.body = `Action=${z}&Version=${this.options.version}` + Y.body, Y.body.endsWith("&")) Y.body = Y.body.slice(-1);
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = I_.NormalizedSchema.of(A.output),
                _ = {};
            if (K.statusCode >= 300) {
                let j = await VP.collectBody(K.body, q);
                if (j.byteLength > 0) Object.assign(_, await Y.read(15, j));
                await this.handleError(A, q, K, _, this.deserializeMetadata(K))
            }
            for (let j in K.headers) {
                let J = K.headers[j];
                delete K.headers[j], K.headers[j.toLowerCase()] = J
            }
            let w = A.name.split("#")[1] ?? A.name,
                O = z.isStructSchema() && this.useNestedResult() ? w + "Result" : void 0,
                $ = await VP.collectBody(K.body, q);
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
                    return X.find((Z) => I_.NormalizedSchema.of(Z).getMergedTraits().awsQueryError?.[0] === P)
                }
            }), j = I_.NormalizedSchema.of($), M = new(I_.TypeRegistry.for($[1]).getErrorCtor($) ?? Error)(O), D = {
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
    class WcA extends D68 {
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
    var ZcA = (A, q) => jcA(A, q).then((K) => {
            if (K.length) {
                let Y;
                try {
                    Y = Iy.parseXML(K)
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
                return NQ.getValueFromTextNode(w)
            }
            return {}
        }),
        F45 = async (A, q) => {
            let K = await ZcA(A, q);
            if (K.Error) K.Error.message = K.Error.message ?? K.Error.Message;
            return K
        }, GcA = (A, q) => {
            if (q?.Error?.Code !== void 0) return q.Error.Code;
            if (q?.Code !== void 0) return q.Code;
            if (A.statusCode == 404) return "NotFound"
        };
    class X68 extends rr {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = I_.NormalizedSchema.of(A);
            if (K.isStringSchema() && typeof q === "string") this.stringBuffer = q;
            else if (K.isBlobSchema()) this.byteBuffer = "byteLength" in q ? q : (this.serdeContext?.base64Decoder ?? PS6.fromBase64)(q);
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
            let _ = Iy.XmlNode.of(z),
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
                        let J = Iy.XmlNode.of(H.getMergedTraits().xmlName ?? H.getMemberName());
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
                        let X = Iy.XmlNode.of($ ? z.xmlName ?? A.getMemberName() : w.xmlName ?? "member");
                        this.writeSimpleInto(_, D, X, j), M.addChildNode(X)
                    }
                };
            if ($) {
                for (let M of q)
                    if (O || M != null) J(K, M)
            } else {
                let M = Iy.XmlNode.of(z.xmlName ?? A.getMemberName());
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
                    let v = Iy.XmlNode.of($, G),
                        [N, V] = this.getXmlnsAttribute(w, P);
                    if (V) v.addAttribute(N, V);
                    Z.addChildNode(v);
                    let L = Iy.XmlNode.of(J);
                    if (H.isListSchema()) this.writeList(H, f, L, P);
                    else if (H.isMapSchema()) this.writeMap(H, f, L, P, !0);
                    else if (H.isStructSchema()) L = this.writeStruct(H, f, P);
                    else this.writeSimpleInto(H, f, L, P);
                    Z.addChildNode(L)
                };
            if (D) {
                for (let [Z, G] of Object.entries(q))
                    if (M || G != null) {
                        let f = Iy.XmlNode.of(_.xmlName ?? A.getMemberName());
                        W(f, Z, G), K.addChildNode(f)
                    }
            } else {
                let Z;
                if (!z) {
                    if (Z = Iy.XmlNode.of(_.xmlName ?? A.getMemberName()), P) Z.addAttribute(X, P);
                    K.addChildNode(Z)
                }
                for (let [G, f] of Object.entries(q))
                    if (M || f != null) {
                        let v = Iy.XmlNode.of("entry");
                        W(v, G, f), (z ? K : Z).addChildNode(v)
                    }
            }
        }
        writeSimple(A, q) {
            if (q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let K = I_.NormalizedSchema.of(A),
                Y = null;
            if (q && typeof q === "object")
                if (K.isBlobSchema()) Y = (this.serdeContext?.base64Encoder ?? PS6.toBase64)(q);
                else if (K.isTimestampSchema() && q instanceof Date) switch (VP.determineTimestampFormat(K, this.settings)) {
                case 5:
                    Y = q.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    Y = NQ.dateToUtcString(q);
                    break;
                case 7:
                    Y = String(q.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", q), Y = NQ.dateToUtcString(q);
                    break
            } else if (K.isBigDecimalSchema() && q) {
                if (q instanceof QD.NumericValue) return q.string;
                return String(q)
            } else if (K.isMapSchema() || K.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${K.getName(!0)}`);
            if (K.isBooleanSchema() || K.isNumericSchema() || K.isBigIntegerSchema() || K.isBigDecimalSchema()) Y = String(q);
            if (K.isStringSchema())
                if (q === void 0 && K.isIdempotencyToken()) Y = QD.generateIdempotencyToken();
                else Y = String(q);
            if (Y === null) throw Error(`Unhandled schema-value pair ${K.getName(!0)}=${q}`);
            return Y
        }
        writeSimpleInto(A, q, K, Y) {
            let z = this.writeSimple(A, q),
                _ = I_.NormalizedSchema.of(A),
                w = new Iy.XmlText(z),
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
    class P68 extends rr {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new X68(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new Fq1(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class fcA extends VP.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new fj6;
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
            this.codec = new P68(q), this.serializer = new VP.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new VP.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K),
                z = I_.NormalizedSchema.of(A.input);
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
            let _ = GcA(K, Y) ?? "Unknown",
                {
                    errorSchema: w,
                    errorMetadata: O
                } = await this.mixin.getErrorSchemaOrThrowBaseException(_, this.options.defaultNamespace, K, Y, z),
                $ = I_.NormalizedSchema.of(w),
                H = Y.Error?.message ?? Y.Error?.Message ?? Y.message ?? Y.Message ?? "Unknown",
                J = new(I_.TypeRegistry.for(w[1]).getErrorCtor(w) ?? Error)(H);
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
    p45.AWSSDKSigV4Signer = y45;
    p45.AwsEc2QueryProtocol = WcA;
    p45.AwsJson1_0Protocol = McA;
    p45.AwsJson1_1Protocol = DcA;
    p45.AwsJsonRpcProtocol = gq1;
    p45.AwsQueryProtocol = D68;
    p45.AwsRestJsonProtocol = XcA;
    p45.AwsRestXmlProtocol = fcA;
    p45.AwsSdkSigV4ASigner = wcA;
    p45.AwsSdkSigV4Signer = mq1;
    p45.AwsSmithyRpcV2CborProtocol = HcA;
    p45.JsonCodec = Bq1;
    p45.JsonShapeDeserializer = J68;
    p45.JsonShapeSerializer = M68;
    p45.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = L45;
    p45.NODE_SIGV4A_CONFIG_OPTIONS = h45;
    p45.XmlCodec = P68;
    p45.XmlShapeDeserializer = Fq1;
    p45.XmlShapeSerializer = X68;
    p45._toBool = x45;
    p45._toNum = u45;
    p45._toStr = b45;
    p45.awsExpectUnion = g45;
    p45.emitWarningIfUnsupportedVersion = v45;
    p45.getBearerTokenEnvKey = OcA;
    p45.loadRestJsonErrorCode = j68;
    p45.loadRestXmlErrorCode = GcA;
    p45.parseJsonBody = H68;
    p45.parseJsonErrorBody = B45;
    p45.parseXmlBody = ZcA;
    p45.parseXmlErrorBody = F45;
    p45.resolveAWSSDKSigV4Config = S45;
    p45.resolveAwsSdkSigV4AConfig = R45;
    p45.resolveAwsSdkSigV4Config = $cA;
    p45.setCredentialFeature = N45;
    p45.setFeature = V45;
    p45.setTokenFeature = k45;
    p45.state = _68;
    p45.validateSigningProperties = $68
})
// @from(Ln 76746, Col 4)
fu = x((gq5) => {
    var yq5 = w_(),
        Lq5 = Zu(),
        Rq5 = $dA(),
        Gu = Nw(),
        VcA = void 0;

    function hq5(A) {
        if (A === void 0) return !0;
        return typeof A === "string" && A.length <= 50
    }

    function Sq5(A) {
        let q = yq5.normalizeProvider(A.userAgentAppId ?? VcA),
            {
                customUserAgent: K
            } = A;
        return Object.assign(A, {
            customUserAgent: typeof K === "string" ? [
                [K]
            ] : K,
            userAgentAppId: async () => {
                let Y = await q();
                if (!hq5(Y)) {
                    let z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
                    if (typeof Y !== "string") z?.warn("userAgentAppId must be a string or undefined.");
                    else if (Y.length > 50) z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
                }
                return Y
            }
        })
    }
    var Cq5 = /\d{12}\.ddb/;
    async function Iq5(A, q, K) {
        if (K.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") Gu.setFeature(A, "PROTOCOL_RPC_V2_CBOR", "M");
        if (typeof q.retryStrategy === "function") {
            let _ = await q.retryStrategy();
            if (typeof _.acquireInitialRetryToken === "function")
                if (_.constructor?.name?.includes("Adaptive")) Gu.setFeature(A, "RETRY_MODE_ADAPTIVE", "F");
                else Gu.setFeature(A, "RETRY_MODE_STANDARD", "E");
            else Gu.setFeature(A, "RETRY_MODE_LEGACY", "D")
        }
        if (typeof q.accountIdEndpointMode === "function") {
            let _ = A.endpointV2;
            if (String(_?.url?.hostname).match(Cq5)) Gu.setFeature(A, "ACCOUNT_ID_ENDPOINT", "O");
            switch (await q.accountIdEndpointMode?.()) {
                case "disabled":
                    Gu.setFeature(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
                    break;
                case "preferred":
                    Gu.setFeature(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
                    break;
                case "required":
                    Gu.setFeature(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
                    break
            }
        }
        let z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
        if (z?.$source) {
            let _ = z;
            if (_.accountId) Gu.setFeature(A, "RESOLVED_ACCOUNT_ID", "T");
            for (let [w, O] of Object.entries(_.$source ?? {})) Gu.setFeature(A, w, O)
        }
    }
    var TcA = "user-agent",
        W68 = "x-amz-user-agent",
        vcA = " ",
        Z68 = "/",
        bq5 = /[^!$%&'*+\-.^_`|~\w]/g,
        xq5 = /[^!$%&'*+\-.^_`|~\w#]/g,
        NcA = "-",
        uq5 = 1024;

    function mq5(A) {
        let q = "";
        for (let K in A) {
            let Y = A[K];
            if (q.length + Y.length + 1 <= uq5) {
                if (q.length) q += "," + Y;
                else q += Y;
                continue
            }
            break
        }
        return q
    }
    var kcA = (A) => (q, K) => async (Y) => {
        let {
            request: z
        } = Y;
        if (!Rq5.HttpRequest.isInstance(z)) return q(Y);
        let {
            headers: _
        } = z, w = K?.userAgent?.map(pq1) || [], O = (await A.defaultUserAgentProvider()).map(pq1);
        await Iq5(K, A, Y);
        let $ = K;
        O.push(`m/${mq5(Object.assign({},K.__smithy_context?.features,$.__aws_sdk_context?.features))}`);
        let H = A?.customUserAgent?.map(pq1) || [],
            j = await A.userAgentAppId();
        if (j) O.push(pq1(["app", `${j}`]));
        let J = Lq5.getUserAgentPrefix(),
            M = (J ? [J] : []).concat([...O, ...w, ...H]).join(vcA),
            D = [...O.filter((X) => X.startsWith("aws-sdk-")), ...H].join(vcA);
        if (A.runtime !== "browser") {
            if (D) _[W68] = _[W68] ? `${_[TcA]} ${D}` : D;
            _[TcA] = M
        } else _[W68] = M;
        return q({
            ...Y,
            request: z
        })
    }, pq1 = (A) => {
        let q = A[0].split(Z68).map((w) => w.replace(bq5, NcA)).join(Z68),
            K = A[1]?.replace(xq5, NcA),
            Y = q.indexOf(Z68),
            z = q.substring(0, Y),
            _ = q.substring(Y + 1);
        if (z === "api") _ = _.toLowerCase();
        return [z, _, K].filter((w) => w && w.length > 0).reduce((w, O, $) => {
            switch ($) {
                case 0:
                    return O;
                case 1:
                    return `${w}/${O}`;
                default:
                    return `${w}#${O}`
            }
        }, "")
    }, EcA = {
        name: "getUserAgentMiddleware",
        step: "build",
        priority: "low",
        tags: ["SET_USER_AGENT", "USER_AGENT"],
        override: !0
    }, Bq5 = (A) => ({
        applyToStack: (q) => {
            q.add(kcA(A), EcA)
        }
    });
    gq5.DEFAULT_UA_APP_ID = VcA;
    gq5.getUserAgentMiddlewareOptions = EcA;
    gq5.getUserAgentPlugin = Bq5;
    gq5.resolveUserAgentConfig = Sq5;
    gq5.userAgentMiddleware = kcA
})
// @from(Ln 76891, Col 4)
ycA = x((iq5) => {
    var cq5 = (A, q, K) => {
            if (!(q in A)) return;
            if (A[q] === "true") return !0;
            if (A[q] === "false") return !1;
            throw Error(`Cannot load ${K} "${q}". Expected "true" or "false", got ${A[q]}.`)
        },
        lq5 = (A, q, K) => {
            if (!(q in A)) return;
            let Y = parseInt(A[q], 10);
            if (Number.isNaN(Y)) throw TypeError(`Cannot load ${K} '${q}'. Expected number, got '${A[q]}'.`);
            return Y
        };
    iq5.SelectorType = void 0;
    (function(A) {
        A.ENV = "env", A.CONFIG = "shared config entry"
    })(iq5.SelectorType || (iq5.SelectorType = {}));
    iq5.booleanSelector = cq5;
    iq5.numberSelector = lq5
})
// @from(Ln 76911, Col 4)
Nj = x((MK5) => {
    var or = ycA(),
        Qq1 = VW(),
        oq5 = nS(),
        hcA = "AWS_USE_DUALSTACK_ENDPOINT",
        ScA = "use_dualstack_endpoint",
        aq5 = !1,
        sq5 = {
            environmentVariableSelector: (A) => or.booleanSelector(A, hcA, or.SelectorType.ENV),
            configFileSelector: (A) => or.booleanSelector(A, ScA, or.SelectorType.CONFIG),
            default: !1
        },
        CcA = "AWS_USE_FIPS_ENDPOINT",
        IcA = "use_fips_endpoint",
        tq5 = !1,
        eq5 = {
            environmentVariableSelector: (A) => or.booleanSelector(A, CcA, or.SelectorType.ENV),
            configFileSelector: (A) => or.booleanSelector(A, IcA, or.SelectorType.CONFIG),
            default: !1
        },
        AK5 = (A) => {
            let {
                tls: q,
                endpoint: K,
                urlParser: Y,
                useDualstackEndpoint: z
            } = A;
            return Object.assign(A, {
                tls: q ?? !0,
                endpoint: Qq1.normalizeProvider(typeof K === "string" ? Y(K) : K),
                isCustomEndpoint: !0,
                useDualstackEndpoint: Qq1.normalizeProvider(z ?? !1)
            })
        },
        qK5 = async (A) => {
            let {
                tls: q = !0
            } = A, K = await A.region();
            if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(K)) throw Error("Invalid region in client config");
            let z = await A.useDualstackEndpoint(),
                _ = await A.useFipsEndpoint(),
                {
                    hostname: w
                } = await A.regionInfoProvider(K, {
                    useDualstackEndpoint: z,
                    useFipsEndpoint: _
                }) ?? {};
            if (!w) throw Error("Cannot resolve hostname from client config");
            return A.urlParser(`${q?"https:":"http:"}//${w}`)
        }, KK5 = (A) => {
            let q = Qq1.normalizeProvider(A.useDualstackEndpoint ?? !1),
                {
                    endpoint: K,
                    useFipsEndpoint: Y,
                    urlParser: z,
                    tls: _
                } = A;
            return Object.assign(A, {
                tls: _ ?? !0,
                endpoint: K ? Qq1.normalizeProvider(typeof K === "string" ? z(K) : K) : () => qK5({
                    ...A,
                    useDualstackEndpoint: q,
                    useFipsEndpoint: Y
                }),
                isCustomEndpoint: !!K,
                useDualstackEndpoint: q
            })
        }, bcA = "AWS_REGION", xcA = "region", YK5 = {
            environmentVariableSelector: (A) => A[bcA],
            configFileSelector: (A) => A[xcA],
            default: () => {
                throw Error("Region is missing")
            }
        }, zK5 = {
            preferredFile: "credentials"
        }, LcA = new Set, _K5 = (A, q = oq5.isValidHostLabel) => {
            if (!LcA.has(A) && !q(A))
                if (A === "*") console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
                else throw Error(`Region not accepted: region="${A}" is not a valid hostname component.`);
            else LcA.add(A)
        }, ucA = (A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), wK5 = (A) => ucA(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, OK5 = (A) => {
            let {
                region: q,
                useFipsEndpoint: K
            } = A;
            if (!q) throw Error("Region is missing");
            return Object.assign(A, {
                region: async () => {
                    let Y = typeof q === "function" ? await q() : q,
                        z = wK5(Y);
                    return _K5(z), z
                },
                useFipsEndpoint: async () => {
                    let Y = typeof q === "string" ? q : await q();
                    if (ucA(Y)) return !0;
                    return typeof K !== "function" ? Promise.resolve(!!K) : K()
                }
            })
        }, RcA = (A = [], {
            useFipsEndpoint: q,
            useDualstackEndpoint: K
        }) => A.find(({
            tags: Y
        }) => q === Y.includes("fips") && K === Y.includes("dualstack"))?.hostname, $K5 = (A, {
            regionHostname: q,
            partitionHostname: K
        }) => q ? q : K ? K.replace("{region}", A) : void 0, HK5 = (A, {
            partitionHash: q
        }) => Object.keys(q || {}).find((K) => q[K].regions.includes(A)) ?? "aws", jK5 = (A, {
            signingRegion: q,
            regionRegex: K,
            useFipsEndpoint: Y
        }) => {
            if (q) return q;
            else if (Y) {
                let z = K.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."),
                    _ = A.match(z);
                if (_) return _[0].slice(1, -1)
            }
        }, JK5 = (A, {
            useFipsEndpoint: q = !1,
            useDualstackEndpoint: K = !1,
            signingService: Y,
            regionHash: z,
            partitionHash: _
        }) => {
            let w = HK5(A, {
                    partitionHash: _
                }),
                O = A in z ? A : _[w]?.endpoint ?? A,
                $ = {
                    useFipsEndpoint: q,
                    useDualstackEndpoint: K
                },
                H = RcA(z[O]?.variants, $),
                j = RcA(_[w]?.variants, $),
                J = $K5(O, {
                    regionHostname: H,
                    partitionHostname: j
                });
            if (J === void 0) throw Error(`Endpoint resolution failed for: ${{resolvedRegion:O,useFipsEndpoint:q,useDualstackEndpoint:K}}`);
            let M = jK5(J, {
                signingRegion: z[O]?.signingRegion,
                regionRegex: _[w].regionRegex,
                useFipsEndpoint: q
            });
            return {
                partition: w,
                signingService: Y,
                hostname: J,
                ...M && {
                    signingRegion: M
                },
                ...z[O]?.signingService && {
                    signingService: z[O].signingService
                }
            }
        };
    MK5.CONFIG_USE_DUALSTACK_ENDPOINT = ScA;
    MK5.CONFIG_USE_FIPS_ENDPOINT = IcA;
    MK5.DEFAULT_USE_DUALSTACK_ENDPOINT = aq5;
    MK5.DEFAULT_USE_FIPS_ENDPOINT = tq5;
    MK5.ENV_USE_DUALSTACK_ENDPOINT = hcA;
    MK5.ENV_USE_FIPS_ENDPOINT = CcA;
    MK5.NODE_REGION_CONFIG_FILE_OPTIONS = zK5;
    MK5.NODE_REGION_CONFIG_OPTIONS = YK5;
    MK5.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = sq5;
    MK5.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = eq5;
    MK5.REGION_ENV_NAME = bcA;
    MK5.REGION_INI_NAME = xcA;
    MK5.getRegionInfo = JK5;
    MK5.resolveCustomEndpointsConfig = AK5;
    MK5.resolveEndpointsConfig = KK5;
    MK5.resolveRegionConfig = OK5
})
// @from(Ln 77086, Col 4)
mcA = x((xK5) => {
    xK5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(xK5.HttpAuthLocation || (xK5.HttpAuthLocation = {}));
    xK5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(xK5.HttpApiKeyAuthLocation || (xK5.HttpApiKeyAuthLocation = {}));
    xK5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(xK5.EndpointURLScheme || (xK5.EndpointURLScheme = {}));
    xK5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(xK5.AlgorithmId || (xK5.AlgorithmId = {}));
    var hK5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => xK5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => xK5.AlgorithmId.MD5,
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
        SK5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        CK5 = (A) => {
            return hK5(A)
        },
        IK5 = (A) => {
            return SK5(A)
        };
    xK5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(xK5.FieldPosition || (xK5.FieldPosition = {}));
    var bK5 = "__smithy_context";
    xK5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(xK5.IniSectionType || (xK5.IniSectionType = {}));
    xK5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(xK5.RequestHandlerProtocol || (xK5.RequestHandlerProtocol = {}));
    xK5.SMITHY_CONTEXT_KEY = bK5;
    xK5.getDefaultClientConfiguration = CK5;
    xK5.resolveDefaultRuntimeConfig = IK5
})
// @from(Ln 77151, Col 4)
pcA = x((dK5) => {
    var gK5 = mcA(),
        FK5 = (A) => {
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
        pK5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class BcA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = gK5.FieldPosition.HEADER,
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
    class gcA {
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
    class Uq1 {
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
            let q = new Uq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = QK5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Uq1.clone(this)
        }
    }

    function QK5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class FcA {
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

    function UK5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    dK5.Field = BcA;
    dK5.Fields = gcA;
    dK5.HttpRequest = Uq1;
    dK5.HttpResponse = FcA;
    dK5.getHttpHandlerExtensionConfiguration = FK5;
    dK5.isValidHostname = UK5;
    dK5.resolveHttpHandlerRuntimeConfig = pK5
})
// @from(Ln 77293, Col 4)
VQ = x((eK5) => {
    var sK5 = pcA(),
        QcA = "content-length";

    function UcA(A) {
        return (q) => async (K) => {
            let Y = K.request;
            if (sK5.HttpRequest.isInstance(Y)) {
                let {
                    body: z,
                    headers: _
                } = Y;
                if (z && Object.keys(_).map((w) => w.toLowerCase()).indexOf(QcA) === -1) try {
                    let w = A(z);
                    Y.headers = {
                        ...Y.headers,
                        [QcA]: String(w)
                    }
                } catch (w) {}
            }
            return q({
                ...K,
                request: Y
            })
        }
    }
    var dcA = {
            step: "build",
            tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
            name: "contentLengthMiddleware",
            override: !0
        },
        tK5 = (A) => ({
            applyToStack: (q) => {
                q.add(UcA(A.bodyLengthChecker), dcA)
            }
        });
    eK5.contentLengthMiddleware = UcA;
    eK5.contentLengthMiddlewareOptions = dcA;
    eK5.getContentLengthPlugin = tK5
})
// @from(Ln 77334, Col 4)
ocA = x((ncA) => {
    Object.defineProperty(ncA, "__esModule", {
        value: !0
    });
    ncA.getEndpointUrlConfig = void 0;
    var ccA = Du(),
        lcA = "AWS_ENDPOINT_URL",
        icA = "endpoint_url",
        Y55 = (A) => ({
            environmentVariableSelector: (q) => {
                let K = A.split(" ").map((_) => _.toUpperCase()),
                    Y = q[[lcA, ...K].join("_")];
                if (Y) return Y;
                let z = q[lcA];
                if (z) return z;
                return
            },
            configFileSelector: (q, K) => {
                if (K && q.services) {
                    let z = K[["services", q.services].join(ccA.CONFIG_PREFIX_SEPARATOR)];
                    if (z) {
                        let _ = A.split(" ").map((O) => O.toLowerCase()),
                            w = z[[_.join("_"), icA].join(ccA.CONFIG_PREFIX_SEPARATOR)];
                        if (w) return w
                    }
                }
                let Y = q[icA];
                if (Y) return Y;
                return
            },
            default: void 0
        });
    ncA.getEndpointUrlConfig = Y55
})
// @from(Ln 77368, Col 4)
tcA = x((acA) => {
    Object.defineProperty(acA, "__esModule", {
        value: !0
    });
    acA.getEndpointFromConfig = void 0;
    var z55 = BT(),
        _55 = ocA(),
        w55 = async (A) => (0, z55.loadConfig)((0, _55.getEndpointUrlConfig)(A ?? ""))();
    acA.getEndpointFromConfig = w55
})
// @from(Ln 77378, Col 4)
rS = x((f55) => {
    var AlA = tcA(),
        ecA = hy(),
        O55 = w_(),
        dq1 = VW(),
        $55 = bt1(),
        H55 = async (A) => {
            let q = A?.Bucket || "";
            if (typeof A.Bucket === "string") A.Bucket = q.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
            if (X55(q)) {
                if (A.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets")
            } else if (!D55(q) || q.indexOf(".") !== -1 && !String(A.Endpoint).startsWith("http:") || q.toLowerCase() !== q || q.length < 3) A.ForcePathStyle = !0;
            if (A.DisableMultiRegionAccessPoints) A.disableMultiRegionAccessPoints = !0, A.DisableMRAP = !0;
            return A
        }, j55 = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/, J55 = /(\d+\.){3}\d+/, M55 = /\.\./, D55 = (A) => j55.test(A) && !J55.test(A) && !M55.test(A), X55 = (A) => {
            let [q, K, Y, , , z] = A.split(":"), _ = q === "arn" && A.split(":").length >= 6, w = Boolean(_ && K && Y && z);
            if (_ && !w) throw Error(`Invalid ARN: ${A} was an invalid ARN.`);
            return w
        }, P55 = (A, q, K) => {
            let Y = async () => {
                let z = K[A] ?? K[q];
                if (typeof z === "function") return z();
                return z
            };
            if (A === "credentialScope" || q === "CredentialScope") return async () => {
                let z = typeof K.credentials === "function" ? await K.credentials() : K.credentials;
                return z?.credentialScope ?? z?.CredentialScope
            };
            if (A === "accountId" || q === "AccountId") return async () => {
                let z = typeof K.credentials === "function" ? await K.credentials() : K.credentials;
                return z?.accountId ?? z?.AccountId
            };
            if (A === "endpoint" || q === "endpoint") return async () => {
                if (K.isCustomEndpoint === !1) return;
                let z = await Y();
                if (z && typeof z === "object") {
                    if ("url" in z) return z.url.href;
                    if ("hostname" in z) {
                        let {
                            protocol: _,
                            hostname: w,
                            port: O,
                            path: $
                        } = z;
                        return `${_}//${w}${O?":"+O:""}${$}`
                    }
                }
                return z
            };
            return Y
        }, E68 = (A) => {
            if (typeof A === "object") {
                if ("url" in A) return ecA.parseUrl(A.url);
                return A
            }
            return ecA.parseUrl(A)
        }, qlA = async (A, q, K, Y) => {
            if (!K.isCustomEndpoint) {
                let w;
                if (K.serviceConfiguredEndpoint) w = await K.serviceConfiguredEndpoint();
                else w = await AlA.getEndpointFromConfig(K.serviceId);
                if (w) K.endpoint = () => Promise.resolve(E68(w)), K.isCustomEndpoint = !0
            }
            let z = await KlA(A, q, K);
            if (typeof K.endpointProvider !== "function") throw Error("config.endpointProvider is not set.");
            return K.endpointProvider(z, Y)
        }, KlA = async (A, q, K) => {
            let Y = {},
                z = q?.getEndpointParameterInstructions?.() || {};
            for (let [_, w] of Object.entries(z)) switch (w.type) {
                case "staticContextParams":
                    Y[_] = w.value;
                    break;
                case "contextParams":
                    Y[_] = A[w.name];
                    break;
                case "clientContextParams":
                case "builtInParams":
                    Y[_] = await P55(w.name, _, K)();
                    break;
                case "operationContextParams":
                    Y[_] = w.get(A);
                    break;
                default:
                    throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(w))
            }
            if (Object.keys(z).length === 0) Object.assign(Y, K);
            if (String(K.serviceId).toLowerCase() === "s3") await H55(Y);
            return Y
        }, YlA = ({
            config: A,
            instructions: q
        }) => {
            return (K, Y) => async (z) => {
                if (A.isCustomEndpoint) O55.setFeature(Y, "ENDPOINT_OVERRIDE", "N");
                let _ = await qlA(z.input, {
                    getEndpointParameterInstructions() {
                        return q
                    }
                }, {
                    ...A
                }, Y);
                Y.endpointV2 = _, Y.authSchemes = _.properties?.authSchemes;
                let w = Y.authSchemes?.[0];
                if (w) {
                    Y.signing_region = w.signingRegion, Y.signing_service = w.signingName;
                    let $ = dq1.getSmithyContext(Y)?.selectedHttpAuthScheme?.httpAuthOption;
                    if ($) $.signingProperties = Object.assign($.signingProperties || {}, {
                        signing_region: w.signingRegion,
                        signingRegion: w.signingRegion,
                        signing_service: w.signingName,
                        signingName: w.signingName,
                        signingRegionSet: w.signingRegionSet
                    }, w.properties)
                }
                return K({
                    ...z
                })
            }
        }, zlA = {
            step: "serialize",
            tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
            name: "endpointV2Middleware",
            override: !0,
            relation: "before",
            toMiddleware: $55.serializerMiddlewareOption.name
        }, W55 = (A, q) => ({
            applyToStack: (K) => {
                K.addRelativeTo(YlA({
                    config: A,
                    instructions: q
                }), zlA)
            }
        }), Z55 = (A) => {
            let q = A.tls ?? !0,
                {
                    endpoint: K,
                    useDualstackEndpoint: Y,
                    useFipsEndpoint: z
                } = A,
                _ = K != null ? async () => E68(await dq1.normalizeProvider(K)()): void 0, O = Object.assign(A, {
                    endpoint: _,
                    tls: q,
                    isCustomEndpoint: !!K,
                    useDualstackEndpoint: dq1.normalizeProvider(Y ?? !1),
                    useFipsEndpoint: dq1.normalizeProvider(z ?? !1)
                }), $ = void 0;
            return O.serviceConfiguredEndpoint = async () => {
                if (A.serviceId && !$) $ = AlA.getEndpointFromConfig(A.serviceId);
                return $
            }, O
        }, G55 = (A) => {
            let {
                endpoint: q
            } = A;
            if (q === void 0) A.endpoint = async () => {
                throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.")
            };
            return A
        };
    f55.endpointMiddleware = YlA;
    f55.endpointMiddlewareOptions = zlA;
    f55.getEndpointFromInstructions = qlA;
    f55.getEndpointPlugin = W55;
    f55.resolveEndpointConfig = Z55;
    f55.resolveEndpointRequiredConfig = G55;
    f55.resolveParams = KlA;
    f55.toEndpointV1 = E68
})
// @from(Ln 77547, Col 4)
L68 = x((B55) => {
    var R55 = ["AuthFailure", "InvalidSignatureException", "RequestExpired", "RequestInTheFuture", "RequestTimeTooSkewed", "SignatureDoesNotMatch"],
        h55 = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"],
        S55 = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"],
        C55 = [500, 502, 503, 504],
        I55 = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"],
        b55 = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"],
        _lA = (A) => A?.$retryable !== void 0,
        x55 = (A) => R55.includes(A.name),
        wlA = (A) => A.$metadata?.clockSkewCorrected,
        OlA = (A) => {
            let q = new Set(["Failed to fetch", "NetworkError when attempting to fetch resource", "The Internet connection appears to be offline", "Load failed", "Network request failed"]);
            if (!(A && A instanceof TypeError)) return !1;
            return q.has(A.message)
        },
        u55 = (A) => A.$metadata?.httpStatusCode === 429 || h55.includes(A.name) || A.$retryable?.throttling == !0,
        y68 = (A, q = 0) => _lA(A) || wlA(A) || S55.includes(A.name) || I55.includes(A?.code || "") || b55.includes(A?.code || "") || C55.includes(A.$metadata?.httpStatusCode || 0) || OlA(A) || A.cause !== void 0 && q <= 10 && y68(A.cause, q + 1),
        m55 = (A) => {
            if (A.$metadata?.httpStatusCode !== void 0) {
                let q = A.$metadata.httpStatusCode;
                if (500 <= q && q <= 599 && !y68(A)) return !0;
                return !1
            }
            return !1
        };
    B55.isBrowserNetworkError = OlA;
    B55.isClockSkewCorrectedError = wlA;
    B55.isClockSkewError = x55;
    B55.isRetryableByTrait = _lA;
    B55.isServerError = m55;
    B55.isThrottlingError = u55;
    B55.isTransientError = y68
})