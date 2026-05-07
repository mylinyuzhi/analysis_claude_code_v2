
// @from(Ln 79337, Col 4)
k$ = p((dZ3) => {
    var oJ1 = iP8(),
        Z76 = FO(),
        Uqq = jP(),
        kZ3 = $E(),
        Qqq = mH1(),
        dqq = xJ1(),
        fw = sj(),
        er = UJ1(),
        iZ = XE(),
        a0 = JE(),
        Ic6 = cJ1(),
        aqq = nw(),
        Xb = iJ1(),
        rJ1 = {
            warningEmitted: !1
        },
        NZ3 = (q) => {
            if (q && !rJ1.warningEmitted && parseInt(q.substring(1, q.indexOf("."))) < 18) rJ1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function EZ3(q, K, _) {
        if (!q.$source) q.$source = {};
        return q.$source[K] = _, q
    }

    function yZ3(q, K, _) {
        if (!q.__aws_sdk_context) q.__aws_sdk_context = {
            features: {}
        };
        else if (!q.__aws_sdk_context.features) q.__aws_sdk_context.features = {};
        q.__aws_sdk_context.features[K] = _
    }

    function LZ3(q, K, _) {
        if (!q.$source) q.$source = {};
        return q.$source[K] = _, q
    }
    var cqq = (q) => oJ1.HttpResponse.isInstance(q) ? q.headers?.date ?? q.headers?.Date : void 0,
        aJ1 = (q) => new Date(Date.now() + q),
        hZ3 = (q, K) => Math.abs(aJ1(K).getTime() - q) >= 300000,
        lqq = (q, K) => {
            let _ = Date.parse(q);
            if (hZ3(_, K)) return _ - Date.now();
            return K
        },
        bc6 = (q, K) => {
            if (!K) throw Error(`Property \`${q}\` is not resolved for AWS SDK SigV4Auth`);
            return K
        },
        sJ1 = async (q) => {
            let K = bc6("context", q.context),
                _ = bc6("config", q.config),
                z = K.endpointV2?.properties?.authSchemes?.[0],
                A = await bc6("signer", _.signer)(z),
                O = q?.signingRegion,
                w = q?.signingRegionSet,
                $ = q?.signingName;
            return {
                config: _,
                signer: A,
                signingRegion: O,
                signingRegionSet: w,
                signingName: $
            }
        };
    class WW8 {
        async sign(q, K, _) {
            if (!oJ1.HttpRequest.isInstance(q)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let z = await sJ1(_),
                {
                    config: Y,
                    signer: A
                } = z,
                {
                    signingRegion: O,
                    signingName: w
                } = z,
                $ = _.context;
            if ($?.authSchemes?.length ?? !1) {
                let [H, J] = $.authSchemes;
                if (H?.name === "sigv4a" && J?.name === "sigv4") O = J?.signingRegion ?? O, w = J?.signingName ?? w
            }
            return await A.sign(q, {
                signingDate: aJ1(Y.systemClockOffset),
                signingRegion: O,
                signingService: w
            })
        }
        errorHandler(q) {
            return (K) => {
                let _ = K.ServerTime ?? cqq(K.$response);
                if (_) {
                    let z = bc6("config", q.config),
                        Y = z.systemClockOffset;
                    if (z.systemClockOffset = lqq(_, z.systemClockOffset), z.systemClockOffset !== Y && K.$metadata) K.$metadata.clockSkewCorrected = !0
                }
                throw K
            }
        }
        successHandler(q, K) {
            let _ = cqq(q);
            if (_) {
                let z = bc6("config", K.config);
                z.systemClockOffset = lqq(_, z.systemClockOffset)
            }
        }
    }
    var RZ3 = WW8;
    class sqq extends WW8 {
        async sign(q, K, _) {
            if (!oJ1.HttpRequest.isInstance(q)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: z,
                signer: Y,
                signingRegion: A,
                signingRegionSet: O,
                signingName: w
            } = await sJ1(_), j = (await z.sigv4aSigningRegionSet?.() ?? O ?? [A]).join(",");
            return await Y.sign(q, {
                signingDate: aJ1(z.systemClockOffset),
                signingRegion: j,
                signingService: w
            })
        }
    }
    var nqq = (q) => typeof q === "string" && q.length > 0 ? q.split(",").map((K) => K.trim()) : [],
        tqq = (q) => `AWS_BEARER_TOKEN_${q.replace(/[\s-]/g,"_").toUpperCase()}`,
        iqq = "AWS_AUTH_SCHEME_PREFERENCE",
        rqq = "auth_scheme_preference",
        SZ3 = {
            environmentVariableSelector: (q, K) => {
                if (K?.signingName) {
                    if (tqq(K.signingName) in q) return ["httpBearerAuth"]
                }
                if (!(iqq in q)) return;
                return nqq(q[iqq])
            },
            configFileSelector: (q) => {
                if (!(rqq in q)) return;
                return nqq(q[rqq])
            },
            default: []
        },
        CZ3 = (q) => {
            return q.sigv4aSigningRegionSet = Z76.normalizeProvider(q.sigv4aSigningRegionSet), q
        },
        bZ3 = {
            environmentVariableSelector(q) {
                if (q.AWS_SIGV4A_SIGNING_REGION_SET) return q.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((K) => K.trim());
                throw new Uqq.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(q) {
                if (q.sigv4a_signing_region_set) return (q.sigv4a_signing_region_set ?? "").split(",").map((K) => K.trim());
                throw new Uqq.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        eqq = (q) => {
            let K = q.credentials,
                _ = !!q.credentials,
                z = void 0;
            Object.defineProperty(q, "credentials", {
                set(j) {
                    if (j && j !== K && j !== z) _ = !0;
                    K = j;
                    let H = xZ3(q, {
                            credentials: K,
                            credentialDefaultProvider: q.credentialDefaultProvider
                        }),
                        J = uZ3(q, H);
                    if (_ && !J.attributed) z = async (X) => J(X).then((M) => kZ3.setCredentialFeature(M, "CREDENTIALS_CODE", "e")), z.memoized = J.memoized, z.configBound = J.configBound, z.attributed = !0;
                    else z = J
                },
                get() {
                    return z
                },
                enumerable: !0,
                configurable: !0
            }), q.credentials = K;
            let {
                signingEscapePath: Y = !0,
                systemClockOffset: A = q.systemClockOffset || 0,
                sha256: O
            } = q, w;
            if (q.signer) w = Z76.normalizeProvider(q.signer);
            else if (q.regionInfoProvider) w = () => Z76.normalizeProvider(q.region)().then(async (j) => [await q.regionInfoProvider(j, {
                useFipsEndpoint: await q.useFipsEndpoint(),
                useDualstackEndpoint: await q.useDualstackEndpoint()
            }) || {}, j]).then(([j, H]) => {
                let {
                    signingRegion: J,
                    signingService: X
                } = j;
                q.signingRegion = q.signingRegion || J || H, q.signingName = q.signingName || X || q.serviceId;
                let M = {
                    ...q,
                    credentials: q.credentials,
                    region: q.signingRegion,
                    service: q.signingName,
                    sha256: O,
                    uriEscapePath: Y
                };
                return new(q.signerConstructor || Qqq.SignatureV4)(M)
            });
            else w = async (j) => {
                j = Object.assign({}, {
                    name: "sigv4",
                    signingName: q.signingName || q.defaultSigningName,
                    signingRegion: await Z76.normalizeProvider(q.region)(),
                    properties: {}
                }, j);
                let {
                    signingRegion: H,
                    signingName: J
                } = j;
                q.signingRegion = q.signingRegion || H, q.signingName = q.signingName || J || q.serviceId;
                let X = {
                    ...q,
                    credentials: q.credentials,
                    region: q.signingRegion,
                    service: q.signingName,
                    sha256: O,
                    uriEscapePath: Y
                };
                return new(q.signerConstructor || Qqq.SignatureV4)(X)
            };
            return Object.assign(q, {
                systemClockOffset: A,
                signingEscapePath: Y,
                signer: w
            })
        },
        IZ3 = eqq;

    function xZ3(q, {
        credentials: K,
        credentialDefaultProvider: _
    }) {
        let z;
        if (K)
            if (!K?.memoized) z = Z76.memoizeIdentityProvider(K, Z76.isIdentityExpired, Z76.doesIdentityRequireRefresh);
            else z = K;
        else if (_) z = Z76.normalizeProvider(_(Object.assign({}, q, {
            parentClientConfig: q
        })));
        else z = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return z.memoized = !0, z
    }

    function uZ3(q, K) {
        if (K.configBound) return K;
        let _ = async (z) => K({
            ...z,
            callerClientConfig: q
        });
        return _.memoized = K.memoized, _.configBound = !0, _
    }
    class Nv6 {
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
                j = fw.TypeRegistry.for(O);
            try {
                return {
                    errorSchema: A?.(j, w) ?? j.getSchema(q),
                    errorMetadata: $
                }
            } catch (H) {
                z.message = z.message ?? z.Message ?? "UnknownError";
                let J = fw.TypeRegistry.for("smithy.ts.sdk.synthetic." + O),
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
                    z = er.decorateServiceException(q, K);
                if (_) z.Message = _, z.message = _;
                return z
            }
            return er.decorateServiceException(q, K)
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
    class q4q extends dqq.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: q,
            awsQueryCompatible: K
        }) {
            super({
                defaultNamespace: q
            });
            this.awsQueryCompatible = !!K, this.mixin = new Nv6(this.awsQueryCompatible)
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (this.awsQueryCompatible) z.headers["x-amzn-query-mode"] = "true";
            return z
        }
        async handleError(q, K, _, z, Y) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(z, _);
            let A = dqq.loadSmithyRpcV2CborErrorCode(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = fw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(fw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j),
                X = {};
            for (let [M, P] of $.structIterator()) X[M] = this.deserializer.readValue(P, z[M]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(z, X);
            throw this.mixin.decorateServiceException(Object.assign(J, w, {
                $fault: $.getMergedTraits().error,
                message: j
            }, X), z)
        }
    }
    var mZ3 = (q) => {
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
        BZ3 = (q) => {
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
        pZ3 = (q) => {
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
    class f76 {
        serdeContext;
        setSerdeContext(q) {
            this.serdeContext = q
        }
    }

    function FZ3(q, K, _) {
        if (_?.source) {
            let z = _.source;
            if (typeof K === "number") {
                if (K > Number.MAX_SAFE_INTEGER || K < Number.MIN_SAFE_INTEGER || z !== String(K))
                    if (z.includes(".")) return new a0.NumericValue(z, "bigDecimal");
                    else return BigInt(z)
            }
        }
        return K
    }
    var K4q = (q, K) => er.collectBody(q, K).then((_) => (K?.utf8Encoder ?? aqq.toUtf8)(_)),
        tJ1 = (q, K) => K4q(q, K).then((_) => {
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
        gZ3 = async (q, K) => {
            let _ = await tJ1(q, K);
            return _.message = _.message ?? _.Message, _
        }, eJ1 = (q, K) => {
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
    class qX1 extends f76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        async read(q, K) {
            return this._read(q, typeof K === "string" ? JSON.parse(K, FZ3) : await tJ1(K, this.serdeContext))
        }
        readObject(q, K) {
            return this._read(q, K)
        }
        _read(q, K) {
            let _ = K !== null && typeof K === "object",
                z = fw.NormalizedSchema.of(q);
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
            if (z.isBlobSchema() && typeof K === "string") return Ic6.fromBase64(K);
            let Y = z.getMergedTraits().mediaType;
            if (z.isStringSchema() && typeof K === "string" && Y) {
                if (Y === "application/json" || Y.endsWith("+json")) return a0.LazyJsonString.from(K)
            }
            if (z.isTimestampSchema() && K != null) switch (iZ.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return a0.parseRfc3339DateTimeWithOffset(K);
                case 6:
                    return a0.parseRfc7231DateTime(K);
                case 7:
                    return a0.parseEpochTimestamp(K);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", K), new Date(K)
            }
            if (z.isBigIntegerSchema() && (typeof K === "number" || typeof K === "string")) return BigInt(K);
            if (z.isBigDecimalSchema() && K != null) {
                if (K instanceof a0.NumericValue) return K;
                let A = K;
                if (A.type === "bigDecimal" && "string" in A) return new a0.NumericValue(A.string, A.type);
                return new a0.NumericValue(String(K), "bigDecimal")
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
                        if (w instanceof a0.NumericValue) A[O] = w;
                        else A[O] = this._read(z, w);
                    return A
                } else return structuredClone(K);
            return K
        }
    }
    var oqq = String.fromCharCode(925);
    class _4q {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (q, K) => {
                if (K instanceof a0.NumericValue) {
                    let _ = `${oqq+"nv"+this.counter++}_` + K.string;
                    return this.values.set(`"${_}"`, K.string), _
                }
                if (typeof K === "bigint") {
                    let _ = K.toString(),
                        z = `${oqq+"b"+this.counter++}_` + _;
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
    class KX1 extends f76 {
        settings;
        buffer;
        rootSchema;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K) {
            this.rootSchema = fw.NormalizedSchema.of(q), this.buffer = this._write(this.rootSchema, K)
        }
        writeDiscriminatedDocument(q, K) {
            if (this.write(q, K), typeof this.buffer === "object") this.buffer.__type = fw.NormalizedSchema.of(q).getName(!0)
        }
        flush() {
            let {
                rootSchema: q
            } = this;
            if (this.rootSchema = void 0, q?.isStructSchema() || q?.isDocumentSchema()) {
                let K = new _4q;
                return K.replaceInJson(JSON.stringify(this.buffer, K.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(q, K, _) {
            let z = K !== null && typeof K === "object",
                Y = fw.NormalizedSchema.of(q);
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
                return (this.serdeContext?.base64Encoder ?? Ic6.toBase64)(K)
            }
            if ((Y.isTimestampSchema() || Y.isDocumentSchema()) && K instanceof Date) switch (iZ.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return K.toISOString().replace(".000Z", "Z");
                case 6:
                    return a0.dateToUtcString(K);
                case 7:
                    return K.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", K), K.getTime() / 1000
            }
            if (Y.isNumericSchema() && typeof K === "number") {
                if (Math.abs(K) === 1 / 0 || isNaN(K)) return String(K)
            }
            if (Y.isStringSchema()) {
                if (typeof K > "u" && Y.isIdempotencyToken()) return a0.generateIdempotencyToken();
                let A = Y.getMergedTraits().mediaType;
                if (K != null && A) {
                    if (A === "application/json" || A.endsWith("+json")) return a0.LazyJsonString.from(K)
                }
            }
            if (Y.isDocumentSchema())
                if (z) {
                    let A = Array.isArray(K) ? [] : {};
                    for (let [O, w] of Object.entries(K))
                        if (w instanceof a0.NumericValue) A[O] = w;
                        else A[O] = this._write(Y, w);
                    return A
                } else return structuredClone(K);
            return K
        }
    }
    class DW8 extends f76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        createSerializer() {
            let q = new KX1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
        createDeserializer() {
            let q = new qX1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
    }
    class ZW8 extends iZ.RpcProtocol {
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
            this.serviceTarget = K, this.codec = new DW8({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!_, this.mixin = new Nv6(this.awsQueryCompatible)
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (!z.path.endsWith("/")) z.path += "/";
            if (Object.assign(z.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${q.name}`
                }), this.awsQueryCompatible) z.headers["x-amzn-query-mode"] = "true";
            if (fw.deref(q.input) === "unit" || !z.body) z.body = "{}";
            return z
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(q, K, _, z, Y) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(z, _);
            let A = eJ1(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = fw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(fw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j),
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
    class z4q extends ZW8 {
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
    class Y4q extends ZW8 {
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
    class A4q extends iZ.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new Nv6;
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
            this.codec = new DW8(K), this.serializer = new iZ.HttpInterceptingShapeSerializer(this.codec.createSerializer(), K), this.deserializer = new iZ.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), K)
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
                Y = fw.NormalizedSchema.of(q.input);
            if (!z.headers["content-type"]) {
                let A = this.mixin.resolveRestContentType(this.getDefaultContentType(), Y);
                if (A) z.headers["content-type"] = A
            }
            if (z.body == null && z.headers["content-type"] === this.getDefaultContentType()) z.body = "{}";
            return z
        }
        async deserializeResponse(q, K, _) {
            let z = await super.deserializeResponse(q, K, _),
                Y = fw.NormalizedSchema.of(q.output);
            for (let [A, O] of Y.structIterator())
                if (O.getMemberTraits().httpPayload && !(A in z)) z[A] = null;
            return z
        }
        async handleError(q, K, _, z, Y) {
            let A = eJ1(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = fw.NormalizedSchema.of(O),
                j = z.message ?? z.Message ?? "Unknown",
                J = new(fw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j);
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
    var UZ3 = (q) => {
        if (q == null) return;
        if (typeof q === "object" && "__type" in q) delete q.__type;
        return er.expectUnion(q)
    };
    class fW8 extends f76 {
        settings;
        stringDeserializer;
        constructor(q) {
            super();
            this.settings = q, this.stringDeserializer = new iZ.FromStringShapeDeserializer(q)
        }
        setSerdeContext(q) {
            this.serdeContext = q, this.stringDeserializer.setSerdeContext(q)
        }
        read(q, K, _) {
            let z = fw.NormalizedSchema.of(q),
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
            let O = (this.serdeContext?.utf8Encoder ?? aqq.toUtf8)(K),
                w = this.parseXml(O);
            return this.readSchema(q, _ ? w[_] : w)
        }
        readSchema(q, K) {
            let _ = fw.NormalizedSchema.of(q);
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
                    K = Xb.parseXML(q)
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
                return er.getValueFromTextNode(Y)
            }
            return {}
        }
    }
    class O4q extends f76 {
        settings;
        buffer;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K, _ = "") {
            if (this.buffer === void 0) this.buffer = "";
            let z = fw.NormalizedSchema.of(q);
            if (_ && !_.endsWith(".")) _ += ".";
            if (z.isBlobSchema()) {
                if (typeof K === "string" || K instanceof Uint8Array) this.writeKey(_), this.writeValue((this.serdeContext?.base64Encoder ?? Ic6.toBase64)(K))
            } else if (z.isBooleanSchema() || z.isNumericSchema() || z.isStringSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(String(K));
                else if (z.isIdempotencyToken()) this.writeKey(_), this.writeValue(a0.generateIdempotencyToken())
            } else if (z.isBigIntegerSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(String(K))
            } else if (z.isBigDecimalSchema()) {
                if (K != null) this.writeKey(_), this.writeValue(K instanceof a0.NumericValue ? K.string : String(K))
            } else if (z.isTimestampSchema()) {
                if (K instanceof Date) switch (this.writeKey(_), iZ.determineTimestampFormat(z, this.settings)) {
                    case 5:
                        this.writeValue(K.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(er.dateToUtcString(K));
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
            this.buffer += `&${iZ.extendedEncodeURIComponent(q)}=`
        }
        writeValue(q) {
            this.buffer += iZ.extendedEncodeURIComponent(q)
        }
    }
    class _X1 extends iZ.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new Nv6;
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
            this.serializer = new O4q(K), this.deserializer = new fW8(K)
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
                }), fw.deref(q.input) === "unit" || !z.body) z.body = "";
            let Y = q.name.split("#")[1] ?? q.name;
            if (z.body = `Action=${Y}&Version=${this.options.version}` + z.body, z.body.endsWith("&")) z.body = z.body.slice(-1);
            return z
        }
        async deserializeResponse(q, K, _) {
            let z = this.deserializer,
                Y = fw.NormalizedSchema.of(q.output),
                A = {};
            if (_.statusCode >= 300) {
                let H = await iZ.collectBody(_.body, K);
                if (H.byteLength > 0) Object.assign(A, await z.read(15, H));
                await this.handleError(q, K, _, A, this.deserializeMetadata(_))
            }
            for (let H in _.headers) {
                let J = _.headers[H];
                delete _.headers[H], _.headers[H.toLowerCase()] = J
            }
            let O = q.name.split("#")[1] ?? q.name,
                w = Y.isStructSchema() && this.useNestedResult() ? O + "Result" : void 0,
                $ = await iZ.collectBody(_.body, K);
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
                    return P.find((Z) => fw.NormalizedSchema.of(Z).getMergedTraits().awsQueryError?.[0] === W)
                }
            }), H = fw.NormalizedSchema.of($), X = new(fw.TypeRegistry.for($[1]).getErrorCtor($) ?? Error)(w), M = {
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
    class w4q extends _X1 {
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
    var $4q = (q, K) => K4q(q, K).then((_) => {
            if (_.length) {
                let z;
                try {
                    z = Xb.parseXML(_)
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
                return er.getValueFromTextNode(O)
            }
            return {}
        }),
        QZ3 = async (q, K) => {
            let _ = await $4q(q, K);
            if (_.Error) _.Error.message = _.Error.message ?? _.Error.Message;
            return _
        }, j4q = (q, K) => {
            if (K?.Error?.Code !== void 0) return K.Error.Code;
            if (K?.Code !== void 0) return K.Code;
            if (q.statusCode == 404) return "NotFound"
        };
    class zX1 extends f76 {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(q) {
            super();
            this.settings = q
        }
        write(q, K) {
            let _ = fw.NormalizedSchema.of(q);
            if (_.isStringSchema() && typeof K === "string") this.stringBuffer = K;
            else if (_.isBlobSchema()) this.byteBuffer = "byteLength" in K ? K : (this.serdeContext?.base64Decoder ?? Ic6.fromBase64)(K);
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
            let A = Xb.XmlNode.of(Y),
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
                        let J = Xb.XmlNode.of(j.getMergedTraits().xmlName ?? j.getMemberName());
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
                        let P = Xb.XmlNode.of($ ? Y.xmlName ?? q.getMemberName() : O.xmlName ?? "member");
                        this.writeSimpleInto(A, M, P, H), X.addChildNode(P)
                    }
                };
            if ($) {
                for (let X of K)
                    if (w || X != null) J(_, X)
            } else {
                let X = Xb.XmlNode.of(Y.xmlName ?? q.getMemberName());
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
                    let v = Xb.XmlNode.of($, G),
                        [V, k] = this.getXmlnsAttribute(O, W);
                    if (k) v.addAttribute(V, k);
                    Z.addChildNode(v);
                    let N = Xb.XmlNode.of(J);
                    if (j.isListSchema()) this.writeList(j, f, N, W);
                    else if (j.isMapSchema()) this.writeMap(j, f, N, W, !0);
                    else if (j.isStructSchema()) N = this.writeStruct(j, f, W);
                    else this.writeSimpleInto(j, f, N, W);
                    Z.addChildNode(N)
                };
            if (M) {
                for (let [Z, G] of Object.entries(K))
                    if (X || G != null) {
                        let f = Xb.XmlNode.of(A.xmlName ?? q.getMemberName());
                        D(f, Z, G), _.addChildNode(f)
                    }
            } else {
                let Z;
                if (!Y) {
                    if (Z = Xb.XmlNode.of(A.xmlName ?? q.getMemberName()), W) Z.addAttribute(P, W);
                    _.addChildNode(Z)
                }
                for (let [G, f] of Object.entries(K))
                    if (X || f != null) {
                        let v = Xb.XmlNode.of("entry");
                        D(v, G, f), (Y ? _ : Z).addChildNode(v)
                    }
            }
        }
        writeSimple(q, K) {
            if (K === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let _ = fw.NormalizedSchema.of(q),
                z = null;
            if (K && typeof K === "object")
                if (_.isBlobSchema()) z = (this.serdeContext?.base64Encoder ?? Ic6.toBase64)(K);
                else if (_.isTimestampSchema() && K instanceof Date) switch (iZ.determineTimestampFormat(_, this.settings)) {
                case 5:
                    z = K.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    z = er.dateToUtcString(K);
                    break;
                case 7:
                    z = String(K.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", K), z = er.dateToUtcString(K);
                    break
            } else if (_.isBigDecimalSchema() && K) {
                if (K instanceof a0.NumericValue) return K.string;
                return String(K)
            } else if (_.isMapSchema() || _.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${_.getName(!0)}`);
            if (_.isBooleanSchema() || _.isNumericSchema() || _.isBigIntegerSchema() || _.isBigDecimalSchema()) z = String(K);
            if (_.isStringSchema())
                if (K === void 0 && _.isIdempotencyToken()) z = a0.generateIdempotencyToken();
                else z = String(K);
            if (z === null) throw Error(`Unhandled schema-value pair ${_.getName(!0)}=${K}`);
            return z
        }
        writeSimpleInto(q, K, _, z) {
            let Y = this.writeSimple(q, K),
                A = fw.NormalizedSchema.of(q),
                O = new Xb.XmlText(Y),
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
    class YX1 extends f76 {
        settings;
        constructor(q) {
            super();
            this.settings = q
        }
        createSerializer() {
            let q = new zX1(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
        createDeserializer() {
            let q = new fW8(this.settings);
            return q.setSerdeContext(this.serdeContext), q
        }
    }
    class H4q extends iZ.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new Nv6;
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
            this.codec = new YX1(K), this.serializer = new iZ.HttpInterceptingShapeSerializer(this.codec.createSerializer(), K), this.deserializer = new iZ.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), K)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _),
                Y = fw.NormalizedSchema.of(q.input);
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
            let A = j4q(_, z) ?? "Unknown",
                {
                    errorSchema: O,
                    errorMetadata: w
                } = await this.mixin.getErrorSchemaOrThrowBaseException(A, this.options.defaultNamespace, _, z, Y),
                $ = fw.NormalizedSchema.of(O),
                j = z.Error?.message ?? z.Error?.Message ?? z.message ?? z.Message ?? "Unknown",
                J = new(fw.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)(j);
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
    dZ3.AWSSDKSigV4Signer = RZ3;
    dZ3.AwsEc2QueryProtocol = w4q;
    dZ3.AwsJson1_0Protocol = z4q;
    dZ3.AwsJson1_1Protocol = Y4q;
    dZ3.AwsJsonRpcProtocol = ZW8;
    dZ3.AwsQueryProtocol = _X1;
    dZ3.AwsRestJsonProtocol = A4q;
    dZ3.AwsRestXmlProtocol = H4q;
    dZ3.AwsSdkSigV4ASigner = sqq;
    dZ3.AwsSdkSigV4Signer = WW8;
    dZ3.AwsSmithyRpcV2CborProtocol = q4q;
    dZ3.JsonCodec = DW8;
    dZ3.JsonShapeDeserializer = qX1;
    dZ3.JsonShapeSerializer = KX1;
    dZ3.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = SZ3;
    dZ3.NODE_SIGV4A_CONFIG_OPTIONS = bZ3;
    dZ3.XmlCodec = YX1;
    dZ3.XmlShapeDeserializer = fW8;
    dZ3.XmlShapeSerializer = zX1;
    dZ3._toBool = BZ3;
    dZ3._toNum = pZ3;
    dZ3._toStr = mZ3;
    dZ3.awsExpectUnion = UZ3;
    dZ3.emitWarningIfUnsupportedVersion = NZ3;
    dZ3.getBearerTokenEnvKey = tqq;
    dZ3.loadRestJsonErrorCode = eJ1;
    dZ3.loadRestXmlErrorCode = j4q;
    dZ3.parseJsonBody = tJ1;
    dZ3.parseJsonErrorBody = gZ3;
    dZ3.parseXmlBody = $4q;
    dZ3.parseXmlErrorBody = QZ3;
    dZ3.resolveAWSSDKSigV4Config = IZ3;
    dZ3.resolveAwsSdkSigV4AConfig = CZ3;
    dZ3.resolveAwsSdkSigV4Config = eqq;
    dZ3.setCredentialFeature = EZ3;
    dZ3.setFeature = yZ3;
    dZ3.setTokenFeature = LZ3;
    dZ3.state = rJ1;
    dZ3.validateSigningProperties = sJ1
})
// @from(Ln 80841, Col 4)
cU = p((Uf3) => {
    var Rf3 = FO(),
        Sf3 = QU(),
        Cf3 = e7q(),
        dU = k$(),
        P4q = void 0;

    function bf3(q) {
        if (q === void 0) return !0;
        return typeof q === "string" && q.length <= 50
    }

    function If3(q) {
        let K = Rf3.normalizeProvider(q.userAgentAppId ?? P4q),
            {
                customUserAgent: _
            } = q;
        return Object.assign(q, {
            customUserAgent: typeof _ === "string" ? [
                [_]
            ] : _,
            userAgentAppId: async () => {
                let z = await K();
                if (!bf3(z)) {
                    let Y = q.logger?.constructor?.name === "NoOpLogger" || !q.logger ? console : q.logger;
                    if (typeof z !== "string") Y?.warn("userAgentAppId must be a string or undefined.");
                    else if (z.length > 50) Y?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
                }
                return z
            }
        })
    }
    var xf3 = /\d{12}\.ddb/;
    async function uf3(q, K, _) {
        if (_.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") dU.setFeature(q, "PROTOCOL_RPC_V2_CBOR", "M");
        if (typeof K.retryStrategy === "function") {
            let A = await K.retryStrategy();
            if (typeof A.acquireInitialRetryToken === "function")
                if (A.constructor?.name?.includes("Adaptive")) dU.setFeature(q, "RETRY_MODE_ADAPTIVE", "F");
                else dU.setFeature(q, "RETRY_MODE_STANDARD", "E");
            else dU.setFeature(q, "RETRY_MODE_LEGACY", "D")
        }
        if (typeof K.accountIdEndpointMode === "function") {
            let A = q.endpointV2;
            if (String(A?.url?.hostname).match(xf3)) dU.setFeature(q, "ACCOUNT_ID_ENDPOINT", "O");
            switch (await K.accountIdEndpointMode?.()) {
                case "disabled":
                    dU.setFeature(q, "ACCOUNT_ID_MODE_DISABLED", "Q");
                    break;
                case "preferred":
                    dU.setFeature(q, "ACCOUNT_ID_MODE_PREFERRED", "P");
                    break;
                case "required":
                    dU.setFeature(q, "ACCOUNT_ID_MODE_REQUIRED", "R");
                    break
            }
        }
        let Y = q.__smithy_context?.selectedHttpAuthScheme?.identity;
        if (Y?.$source) {
            let A = Y;
            if (A.accountId) dU.setFeature(q, "RESOLVED_ACCOUNT_ID", "T");
            for (let [O, w] of Object.entries(A.$source ?? {})) dU.setFeature(q, O, w)
        }
    }
    var J4q = "user-agent",
        AX1 = "x-amz-user-agent",
        X4q = " ",
        OX1 = "/",
        mf3 = /[^!$%&'*+\-.^_`|~\w]/g,
        Bf3 = /[^!$%&'*+\-.^_`|~\w#]/g,
        M4q = "-",
        pf3 = 1024;

    function Ff3(q) {
        let K = "";
        for (let _ in q) {
            let z = q[_];
            if (K.length + z.length + 1 <= pf3) {
                if (K.length) K += "," + z;
                else K += z;
                continue
            }
            break
        }
        return K
    }
    var W4q = (q) => (K, _) => async (z) => {
        let {
            request: Y
        } = z;
        if (!Cf3.HttpRequest.isInstance(Y)) return K(z);
        let {
            headers: A
        } = Y, O = _?.userAgent?.map(GW8) || [], w = (await q.defaultUserAgentProvider()).map(GW8);
        await uf3(_, q, z);
        let $ = _;
        w.push(`m/${Ff3(Object.assign({},_.__smithy_context?.features,$.__aws_sdk_context?.features))}`);
        let j = q?.customUserAgent?.map(GW8) || [],
            H = await q.userAgentAppId();
        if (H) w.push(GW8(["app", `${H}`]));
        let J = Sf3.getUserAgentPrefix(),
            X = (J ? [J] : []).concat([...w, ...O, ...j]).join(X4q),
            M = [...w.filter((P) => P.startsWith("aws-sdk-")), ...j].join(X4q);
        if (q.runtime !== "browser") {
            if (M) A[AX1] = A[AX1] ? `${A[J4q]} ${M}` : M;
            A[J4q] = X
        } else A[AX1] = X;
        return K({
            ...z,
            request: Y
        })
    }, GW8 = (q) => {
        let K = q[0].split(OX1).map((O) => O.replace(mf3, M4q)).join(OX1),
            _ = q[1]?.replace(Bf3, M4q),
            z = K.indexOf(OX1),
            Y = K.substring(0, z),
            A = K.substring(z + 1);
        if (Y === "api") A = A.toLowerCase();
        return [Y, A, _].filter((O) => O && O.length > 0).reduce((O, w, $) => {
            switch ($) {
                case 0:
                    return w;
                case 1:
                    return `${O}/${w}`;
                default:
                    return `${O}#${w}`
            }
        }, "")
    }, D4q = {
        name: "getUserAgentMiddleware",
        step: "build",
        priority: "low",
        tags: ["SET_USER_AGENT", "USER_AGENT"],
        override: !0
    }, gf3 = (q) => ({
        applyToStack: (K) => {
            K.add(W4q(q), D4q)
        }
    });
    Uf3.DEFAULT_UA_APP_ID = P4q;
    Uf3.getUserAgentMiddlewareOptions = D4q;
    Uf3.getUserAgentPlugin = gf3;
    Uf3.resolveUserAgentConfig = If3;
    Uf3.userAgentMiddleware = W4q
})
// @from(Ln 80986, Col 4)
Z4q = p((of3) => {
    var if3 = (q, K, _) => {
            if (!(K in q)) return;
            if (q[K] === "true") return !0;
            if (q[K] === "false") return !1;
            throw Error(`Cannot load ${_} "${K}". Expected "true" or "false", got ${q[K]}.`)
        },
        rf3 = (q, K, _) => {
            if (!(K in q)) return;
            let z = parseInt(q[K], 10);
            if (Number.isNaN(z)) throw TypeError(`Cannot load ${_} '${K}'. Expected number, got '${q[K]}'.`);
            return z
        };
    of3.SelectorType = void 0;
    (function(q) {
        q.ENV = "env", q.CONFIG = "shared config entry"
    })(of3.SelectorType || (of3.SelectorType = {}));
    of3.booleanSelector = if3;
    of3.numberSelector = rf3
})
// @from(Ln 81006, Col 4)
KM = p((WG3) => {
    var G76 = Z4q(),
        vW8 = Dv(),
        tf3 = dm(),
        v4q = "AWS_USE_DUALSTACK_ENDPOINT",
        T4q = "use_dualstack_endpoint",
        ef3 = !1,
        qG3 = {
            environmentVariableSelector: (q) => G76.booleanSelector(q, v4q, G76.SelectorType.ENV),
            configFileSelector: (q) => G76.booleanSelector(q, T4q, G76.SelectorType.CONFIG),
            default: !1
        },
        V4q = "AWS_USE_FIPS_ENDPOINT",
        k4q = "use_fips_endpoint",
        KG3 = !1,
        _G3 = {
            environmentVariableSelector: (q) => G76.booleanSelector(q, V4q, G76.SelectorType.ENV),
            configFileSelector: (q) => G76.booleanSelector(q, k4q, G76.SelectorType.CONFIG),
            default: !1
        },
        zG3 = (q) => {
            let {
                tls: K,
                endpoint: _,
                urlParser: z,
                useDualstackEndpoint: Y
            } = q;
            return Object.assign(q, {
                tls: K ?? !0,
                endpoint: vW8.normalizeProvider(typeof _ === "string" ? z(_) : _),
                isCustomEndpoint: !0,
                useDualstackEndpoint: vW8.normalizeProvider(Y ?? !1)
            })
        },
        YG3 = async (q) => {
            let {
                tls: K = !0
            } = q, _ = await q.region();
            if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(_)) throw Error("Invalid region in client config");
            let Y = await q.useDualstackEndpoint(),
                A = await q.useFipsEndpoint(),
                {
                    hostname: O
                } = await q.regionInfoProvider(_, {
                    useDualstackEndpoint: Y,
                    useFipsEndpoint: A
                }) ?? {};
            if (!O) throw Error("Cannot resolve hostname from client config");
            return q.urlParser(`${K?"https:":"http:"}//${O}`)
        }, AG3 = (q) => {
            let K = vW8.normalizeProvider(q.useDualstackEndpoint ?? !1),
                {
                    endpoint: _,
                    useFipsEndpoint: z,
                    urlParser: Y,
                    tls: A
                } = q;
            return Object.assign(q, {
                tls: A ?? !0,
                endpoint: _ ? vW8.normalizeProvider(typeof _ === "string" ? Y(_) : _) : () => YG3({
                    ...q,
                    useDualstackEndpoint: K,
                    useFipsEndpoint: z
                }),
                isCustomEndpoint: !!_,
                useDualstackEndpoint: K
            })
        }, N4q = "AWS_REGION", E4q = "region", OG3 = {
            environmentVariableSelector: (q) => q[N4q],
            configFileSelector: (q) => q[E4q],
            default: () => {
                throw Error("Region is missing")
            }
        }, wG3 = {
            preferredFile: "credentials"
        }, f4q = new Set, $G3 = (q, K = tf3.isValidHostLabel) => {
            if (!f4q.has(q) && !K(q))
                if (q === "*") console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
                else throw Error(`Region not accepted: region="${q}" is not a valid hostname component.`);
            else f4q.add(q)
        }, y4q = (q) => typeof q === "string" && (q.startsWith("fips-") || q.endsWith("-fips")), jG3 = (q) => y4q(q) ? ["fips-aws-global", "aws-fips"].includes(q) ? "us-east-1" : q.replace(/fips-(dkr-|prod-)?|-fips/, "") : q, HG3 = (q) => {
            let {
                region: K,
                useFipsEndpoint: _
            } = q;
            if (!K) throw Error("Region is missing");
            return Object.assign(q, {
                region: async () => {
                    let z = typeof K === "function" ? await K() : K,
                        Y = jG3(z);
                    return $G3(Y), Y
                },
                useFipsEndpoint: async () => {
                    let z = typeof K === "string" ? K : await K();
                    if (y4q(z)) return !0;
                    return typeof _ !== "function" ? Promise.resolve(!!_) : _()
                }
            })
        }, G4q = (q = [], {
            useFipsEndpoint: K,
            useDualstackEndpoint: _
        }) => q.find(({
            tags: z
        }) => K === z.includes("fips") && _ === z.includes("dualstack"))?.hostname, JG3 = (q, {
            regionHostname: K,
            partitionHostname: _
        }) => K ? K : _ ? _.replace("{region}", q) : void 0, XG3 = (q, {
            partitionHash: K
        }) => Object.keys(K || {}).find((_) => K[_].regions.includes(q)) ?? "aws", MG3 = (q, {
            signingRegion: K,
            regionRegex: _,
            useFipsEndpoint: z
        }) => {
            if (K) return K;
            else if (z) {
                let Y = _.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."),
                    A = q.match(Y);
                if (A) return A[0].slice(1, -1)
            }
        }, PG3 = (q, {
            useFipsEndpoint: K = !1,
            useDualstackEndpoint: _ = !1,
            signingService: z,
            regionHash: Y,
            partitionHash: A
        }) => {
            let O = XG3(q, {
                    partitionHash: A
                }),
                w = q in Y ? q : A[O]?.endpoint ?? q,
                $ = {
                    useFipsEndpoint: K,
                    useDualstackEndpoint: _
                },
                j = G4q(Y[w]?.variants, $),
                H = G4q(A[O]?.variants, $),
                J = JG3(w, {
                    regionHostname: j,
                    partitionHostname: H
                });
            if (J === void 0) throw Error(`Endpoint resolution failed for: ${{resolvedRegion:w,useFipsEndpoint:K,useDualstackEndpoint:_}}`);
            let X = MG3(J, {
                signingRegion: Y[w]?.signingRegion,
                regionRegex: A[O].regionRegex,
                useFipsEndpoint: K
            });
            return {
                partition: O,
                signingService: z,
                hostname: J,
                ...X && {
                    signingRegion: X
                },
                ...Y[w]?.signingService && {
                    signingService: Y[w].signingService
                }
            }
        };
    WG3.CONFIG_USE_DUALSTACK_ENDPOINT = T4q;
    WG3.CONFIG_USE_FIPS_ENDPOINT = k4q;
    WG3.DEFAULT_USE_DUALSTACK_ENDPOINT = ef3;
    WG3.DEFAULT_USE_FIPS_ENDPOINT = KG3;
    WG3.ENV_USE_DUALSTACK_ENDPOINT = v4q;
    WG3.ENV_USE_FIPS_ENDPOINT = V4q;
    WG3.NODE_REGION_CONFIG_FILE_OPTIONS = wG3;
    WG3.NODE_REGION_CONFIG_OPTIONS = OG3;
    WG3.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = qG3;
    WG3.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = _G3;
    WG3.REGION_ENV_NAME = N4q;
    WG3.REGION_INI_NAME = E4q;
    WG3.getRegionInfo = PG3;
    WG3.resolveCustomEndpointsConfig = zG3;
    WG3.resolveEndpointsConfig = AG3;
    WG3.resolveRegionConfig = HG3
})
// @from(Ln 81181, Col 4)
L4q = p((BG3) => {
    BG3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(BG3.HttpAuthLocation || (BG3.HttpAuthLocation = {}));
    BG3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(BG3.HttpApiKeyAuthLocation || (BG3.HttpApiKeyAuthLocation = {}));
    BG3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(BG3.EndpointURLScheme || (BG3.EndpointURLScheme = {}));
    BG3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(BG3.AlgorithmId || (BG3.AlgorithmId = {}));
    var bG3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => BG3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => BG3.AlgorithmId.MD5,
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
        IG3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        xG3 = (q) => {
            return bG3(q)
        },
        uG3 = (q) => {
            return IG3(q)
        };
    BG3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(BG3.FieldPosition || (BG3.FieldPosition = {}));
    var mG3 = "__smithy_context";
    BG3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(BG3.IniSectionType || (BG3.IniSectionType = {}));
    BG3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(BG3.RequestHandlerProtocol || (BG3.RequestHandlerProtocol = {}));
    BG3.SMITHY_CONTEXT_KEY = mG3;
    BG3.getDefaultClientConfiguration = xG3;
    BG3.resolveDefaultRuntimeConfig = uG3
})
// @from(Ln 81246, Col 4)
C4q = p((nG3) => {
    var UG3 = L4q(),
        QG3 = (q) => {
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
        dG3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class h4q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = UG3.FieldPosition.HEADER,
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
    class R4q {
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
    class TW8 {
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
            let K = new TW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = cG3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return TW8.clone(this)
        }
    }

    function cG3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class S4q {
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

    function lG3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    nG3.Field = h4q;
    nG3.Fields = R4q;
    nG3.HttpRequest = TW8;
    nG3.HttpResponse = S4q;
    nG3.getHttpHandlerExtensionConfiguration = QG3;
    nG3.isValidHostname = lG3;
    nG3.resolveHttpHandlerRuntimeConfig = dG3
})
// @from(Ln 81388, Col 4)
qo = p((_v3) => {
    var qv3 = C4q(),
        b4q = "content-length";

    function I4q(q) {
        return (K) => async (_) => {
            let z = _.request;
            if (qv3.HttpRequest.isInstance(z)) {
                let {
                    body: Y,
                    headers: A
                } = z;
                if (Y && Object.keys(A).map((O) => O.toLowerCase()).indexOf(b4q) === -1) try {
                    let O = q(Y);
                    z.headers = {
                        ...z.headers,
                        [b4q]: String(O)
                    }
                } catch (O) {}
            }
            return K({
                ..._,
                request: z
            })
        }
    }
    var x4q = {
            step: "build",
            tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
            name: "contentLengthMiddleware",
            override: !0
        },
        Kv3 = (q) => ({
            applyToStack: (K) => {
                K.add(I4q(q.bodyLengthChecker), x4q)
            }
        });
    _v3.contentLengthMiddleware = I4q;
    _v3.contentLengthMiddlewareOptions = x4q;
    _v3.getContentLengthPlugin = Kv3
})
// @from(Ln 81429, Col 4)
g4q = p((p4q) => {
    Object.defineProperty(p4q, "__esModule", {
        value: !0
    });
    p4q.getEndpointUrlConfig = void 0;
    var u4q = pU(),
        m4q = "AWS_ENDPOINT_URL",
        B4q = "endpoint_url",
        Ov3 = (q) => ({
            environmentVariableSelector: (K) => {
                let _ = q.split(" ").map((A) => A.toUpperCase()),
                    z = K[[m4q, ..._].join("_")];
                if (z) return z;
                let Y = K[m4q];
                if (Y) return Y;
                return
            },
            configFileSelector: (K, _) => {
                if (_ && K.services) {
                    let Y = _[["services", K.services].join(u4q.CONFIG_PREFIX_SEPARATOR)];
                    if (Y) {
                        let A = q.split(" ").map((w) => w.toLowerCase()),
                            O = Y[[A.join("_"), B4q].join(u4q.CONFIG_PREFIX_SEPARATOR)];
                        if (O) return O
                    }
                }
                let z = K[B4q];
                if (z) return z;
                return
            },
            default: void 0
        });
    p4q.getEndpointUrlConfig = Ov3
})
// @from(Ln 81463, Col 4)
d4q = p((U4q) => {
    Object.defineProperty(U4q, "__esModule", {
        value: !0
    });
    U4q.getEndpointFromConfig = void 0;
    var wv3 = jE(),
        $v3 = g4q(),
        jv3 = async (q) => (0, wv3.loadConfig)((0, $v3.getEndpointUrlConfig)(q ?? ""))();
    U4q.getEndpointFromConfig = jv3
})
// @from(Ln 81473, Col 4)
cm = p((Vv3) => {
    var l4q = d4q(),
        c4q = jb(),
        Hv3 = FO(),
        VW8 = Dv(),
        Jv3 = VH1(),
        Xv3 = async (q) => {
            let K = q?.Bucket || "";
            if (typeof q.Bucket === "string") q.Bucket = K.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
            if (Zv3(K)) {
                if (q.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets")
            } else if (!Dv3(K) || K.indexOf(".") !== -1 && !String(q.Endpoint).startsWith("http:") || K.toLowerCase() !== K || K.length < 3) q.ForcePathStyle = !0;
            if (q.DisableMultiRegionAccessPoints) q.disableMultiRegionAccessPoints = !0, q.DisableMRAP = !0;
            return q
        }, Mv3 = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/, Pv3 = /(\d+\.){3}\d+/, Wv3 = /\.\./, Dv3 = (q) => Mv3.test(q) && !Pv3.test(q) && !Wv3.test(q), Zv3 = (q) => {
            let [K, _, z, , , Y] = q.split(":"), A = K === "arn" && q.split(":").length >= 6, O = Boolean(A && _ && z && Y);
            if (A && !O) throw Error(`Invalid ARN: ${q} was an invalid ARN.`);
            return O
        }, fv3 = (q, K, _) => {
            let z = async () => {
                let Y = _[q] ?? _[K];
                if (typeof Y === "function") return Y();
                return Y
            };
            if (q === "credentialScope" || K === "CredentialScope") return async () => {
                let Y = typeof _.credentials === "function" ? await _.credentials() : _.credentials;
                return Y?.credentialScope ?? Y?.CredentialScope
            };
            if (q === "accountId" || K === "AccountId") return async () => {
                let Y = typeof _.credentials === "function" ? await _.credentials() : _.credentials;
                return Y?.accountId ?? Y?.AccountId
            };
            if (q === "endpoint" || K === "endpoint") return async () => {
                if (_.isCustomEndpoint === !1) return;
                let Y = await z();
                if (Y && typeof Y === "object") {
                    if ("url" in Y) return Y.url.href;
                    if ("hostname" in Y) {
                        let {
                            protocol: A,
                            hostname: O,
                            port: w,
                            path: $
                        } = Y;
                        return `${A}//${O}${w?":"+w:""}${$}`
                    }
                }
                return Y
            };
            return z
        }, PX1 = (q) => {
            if (typeof q === "object") {
                if ("url" in q) return c4q.parseUrl(q.url);
                return q
            }
            return c4q.parseUrl(q)
        }, n4q = async (q, K, _, z) => {
            if (!_.isCustomEndpoint) {
                let O;
                if (_.serviceConfiguredEndpoint) O = await _.serviceConfiguredEndpoint();
                else O = await l4q.getEndpointFromConfig(_.serviceId);
                if (O) _.endpoint = () => Promise.resolve(PX1(O)), _.isCustomEndpoint = !0
            }
            let Y = await i4q(q, K, _);
            if (typeof _.endpointProvider !== "function") throw Error("config.endpointProvider is not set.");
            return _.endpointProvider(Y, z)
        }, i4q = async (q, K, _) => {
            let z = {},
                Y = K?.getEndpointParameterInstructions?.() || {};
            for (let [A, O] of Object.entries(Y)) switch (O.type) {
                case "staticContextParams":
                    z[A] = O.value;
                    break;
                case "contextParams":
                    z[A] = q[O.name];
                    break;
                case "clientContextParams":
                case "builtInParams":
                    z[A] = await fv3(O.name, A, _)();
                    break;
                case "operationContextParams":
                    z[A] = O.get(q);
                    break;
                default:
                    throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(O))
            }
            if (Object.keys(Y).length === 0) Object.assign(z, _);
            if (String(_.serviceId).toLowerCase() === "s3") await Xv3(z);
            return z
        }, r4q = ({
            config: q,
            instructions: K
        }) => {
            return (_, z) => async (Y) => {
                if (q.isCustomEndpoint) Hv3.setFeature(z, "ENDPOINT_OVERRIDE", "N");
                let A = await n4q(Y.input, {
                    getEndpointParameterInstructions() {
                        return K
                    }
                }, {
                    ...q
                }, z);
                z.endpointV2 = A, z.authSchemes = A.properties?.authSchemes;
                let O = z.authSchemes?.[0];
                if (O) {
                    z.signing_region = O.signingRegion, z.signing_service = O.signingName;
                    let $ = VW8.getSmithyContext(z)?.selectedHttpAuthScheme?.httpAuthOption;
                    if ($) $.signingProperties = Object.assign($.signingProperties || {}, {
                        signing_region: O.signingRegion,
                        signingRegion: O.signingRegion,
                        signing_service: O.signingName,
                        signingName: O.signingName,
                        signingRegionSet: O.signingRegionSet
                    }, O.properties)
                }
                return _({
                    ...Y
                })
            }
        }, o4q = {
            step: "serialize",
            tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
            name: "endpointV2Middleware",
            override: !0,
            relation: "before",
            toMiddleware: Jv3.serializerMiddlewareOption.name
        }, Gv3 = (q, K) => ({
            applyToStack: (_) => {
                _.addRelativeTo(r4q({
                    config: q,
                    instructions: K
                }), o4q)
            }
        }), vv3 = (q) => {
            let K = q.tls ?? !0,
                {
                    endpoint: _,
                    useDualstackEndpoint: z,
                    useFipsEndpoint: Y
                } = q,
                A = _ != null ? async () => PX1(await VW8.normalizeProvider(_)()): void 0, w = Object.assign(q, {
                    endpoint: A,
                    tls: K,
                    isCustomEndpoint: !!_,
                    useDualstackEndpoint: VW8.normalizeProvider(z ?? !1),
                    useFipsEndpoint: VW8.normalizeProvider(Y ?? !1)
                }), $ = void 0;
            return w.serviceConfiguredEndpoint = async () => {
                if (q.serviceId && !$) $ = l4q.getEndpointFromConfig(q.serviceId);
                return $
            }, w
        }, Tv3 = (q) => {
            let {
                endpoint: K
            } = q;
            if (K === void 0) q.endpoint = async () => {
                throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.")
            };
            return q
        };
    Vv3.endpointMiddleware = r4q;
    Vv3.endpointMiddlewareOptions = o4q;
    Vv3.getEndpointFromInstructions = n4q;
    Vv3.getEndpointPlugin = Gv3;
    Vv3.resolveEndpointConfig = vv3;
    Vv3.resolveEndpointRequiredConfig = Tv3;
    Vv3.resolveParams = i4q;
    Vv3.toEndpointV1 = PX1
})
// @from(Ln 81642, Col 4)
DX1 = p((gv3) => {
    var Cv3 = ["AuthFailure", "InvalidSignatureException", "RequestExpired", "RequestInTheFuture", "RequestTimeTooSkewed", "SignatureDoesNotMatch"],
        bv3 = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"],
        Iv3 = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"],
        xv3 = [500, 502, 503, 504],
        uv3 = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"],
        mv3 = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"],
        a4q = (q) => q?.$retryable !== void 0,
        Bv3 = (q) => Cv3.includes(q.name),
        s4q = (q) => q.$metadata?.clockSkewCorrected,
        t4q = (q) => {
            let K = new Set(["Failed to fetch", "NetworkError when attempting to fetch resource", "The Internet connection appears to be offline", "Load failed", "Network request failed"]);
            if (!(q && q instanceof TypeError)) return !1;
            return K.has(q.message)
        },
        pv3 = (q) => q.$metadata?.httpStatusCode === 429 || bv3.includes(q.name) || q.$retryable?.throttling == !0,
        WX1 = (q, K = 0) => a4q(q) || s4q(q) || Iv3.includes(q.name) || uv3.includes(q?.code || "") || mv3.includes(q?.code || "") || xv3.includes(q.$metadata?.httpStatusCode || 0) || t4q(q) || q.cause !== void 0 && K <= 10 && WX1(q.cause, K + 1),
        Fv3 = (q) => {
            if (q.$metadata?.httpStatusCode !== void 0) {
                let K = q.$metadata.httpStatusCode;
                if (500 <= K && K <= 599 && !WX1(q)) return !0;
                return !1
            }
            return !1
        };
    gv3.isBrowserNetworkError = t4q;
    gv3.isClockSkewCorrectedError = s4q;
    gv3.isClockSkewError = Bv3;
    gv3.isRetryableByTrait = a4q;
    gv3.isServerError = Fv3;
    gv3.isThrottlingError = pv3;
    gv3.isTransientError = WX1
})