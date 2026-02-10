
// @from(Ln 61603, Col 4)
YH = R((nEK) => {
    var QU6 = xt1(),
        bi = lz(),
        N08 = wX(),
        REK = of(),
        T08 = _U6(),
        v08 = vU6(),
        f2 = R$(),
        nQ = hU6(),
        AM = rf(),
        v0 = nf(),
        NE1 = bU6(),
        S08 = Z2(),
        Vk = mU6(),
        FU6 = {
            warningEmitted: !1
        },
        yEK = (A) => {
            if (A && !FU6.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) FU6.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
        };

    function CEK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }

    function SEK(A, q, K) {
        if (!A.__aws_sdk_context) A.__aws_sdk_context = {
            features: {}
        };
        else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
        A.__aws_sdk_context.features[q] = K
    }

    function hEK(A, q, K) {
        if (!A.$source) A.$source = {};
        return A.$source[q] = K, A
    }
    var E08 = (A) => QU6.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
        gU6 = (A) => new Date(Date.now() + A),
        IEK = (A, q) => Math.abs(gU6(q).getTime() - A) >= 300000,
        k08 = (A, q) => {
            let K = Date.parse(A);
            if (IEK(K, q)) return K - Date.now();
            return q
        },
        VE1 = (A, q) => {
            if (!q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
            return q
        },
        UU6 = async (A) => {
            let q = VE1("context", A.context),
                K = VE1("config", A.config),
                Y = q.endpointV2?.properties?.authSchemes?.[0],
                w = await VE1("signer", K.signer)(Y),
                H = A?.signingRegion,
                $ = A?.signingRegionSet,
                O = A?.signingName;
            return {
                config: K,
                signer: w,
                signingRegion: H,
                signingRegionSet: $,
                signingName: O
            }
        };
    class it1 {
        async sign(A, q, K) {
            if (!QU6.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let Y = await UU6(K),
                {
                    config: z,
                    signer: w
                } = Y,
                {
                    signingRegion: H,
                    signingName: $
                } = Y,
                O = K.context;
            if (O?.authSchemes?.length ?? !1) {
                let [J, X] = O.authSchemes;
                if (J?.name === "sigv4a" && X?.name === "sigv4") H = X?.signingRegion ?? H, $ = X?.signingName ?? $
            }
            return await w.sign(A, {
                signingDate: gU6(z.systemClockOffset),
                signingRegion: H,
                signingService: $
            })
        }
        errorHandler(A) {
            return (q) => {
                let K = q.ServerTime ?? E08(q.$response);
                if (K) {
                    let Y = VE1("config", A.config),
                        z = Y.systemClockOffset;
                    if (Y.systemClockOffset = k08(K, Y.systemClockOffset), Y.systemClockOffset !== z && q.$metadata) q.$metadata.clockSkewCorrected = !0
                }
                throw q
            }
        }
        successHandler(A, q) {
            let K = E08(A);
            if (K) {
                let Y = VE1("config", q.config);
                Y.systemClockOffset = k08(K, Y.systemClockOffset)
            }
        }
    }
    var xEK = it1;
    class h08 extends it1 {
        async sign(A, q, K) {
            if (!QU6.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: Y,
                signer: z,
                signingRegion: w,
                signingRegionSet: H,
                signingName: $
            } = await UU6(K), _ = (await Y.sigv4aSigningRegionSet?.() ?? H ?? [w]).join(",");
            return await z.sign(A, {
                signingDate: gU6(Y.systemClockOffset),
                signingRegion: _,
                signingService: $
            })
        }
    }
    var L08 = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((q) => q.trim()) : [],
        I08 = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
        R08 = "AWS_AUTH_SCHEME_PREFERENCE",
        y08 = "auth_scheme_preference",
        bEK = {
            environmentVariableSelector: (A, q) => {
                if (q?.signingName) {
                    if (I08(q.signingName) in A) return ["httpBearerAuth"]
                }
                if (!(R08 in A)) return;
                return L08(A[R08])
            },
            configFileSelector: (A) => {
                if (!(y08 in A)) return;
                return L08(A[y08])
            },
            default: []
        },
        uEK = (A) => {
            return A.sigv4aSigningRegionSet = bi.normalizeProvider(A.sigv4aSigningRegionSet), A
        },
        BEK = {
            environmentVariableSelector(A) {
                if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((q) => q.trim());
                throw new N08.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(A) {
                if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((q) => q.trim());
                throw new N08.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        x08 = (A) => {
            let q = A.credentials,
                K = !!A.credentials,
                Y = void 0;
            Object.defineProperty(A, "credentials", {
                set(_) {
                    if (_ && _ !== q && _ !== Y) K = !0;
                    q = _;
                    let J = FEK(A, {
                            credentials: q,
                            credentialDefaultProvider: A.credentialDefaultProvider
                        }),
                        X = QEK(A, J);
                    if (K && !X.attributed) Y = async (D) => X(D).then((j) => REK.setCredentialFeature(j, "CREDENTIALS_CODE", "e")), Y.memoized = X.memoized, Y.configBound = X.configBound, Y.attributed = !0;
                    else Y = X
                },
                get() {
                    return Y
                },
                enumerable: !0,
                configurable: !0
            }), A.credentials = q;
            let {
                signingEscapePath: z = !0,
                systemClockOffset: w = A.systemClockOffset || 0,
                sha256: H
            } = A, $;
            if (A.signer) $ = bi.normalizeProvider(A.signer);
            else if (A.regionInfoProvider) $ = () => bi.normalizeProvider(A.region)().then(async (_) => [await A.regionInfoProvider(_, {
                useFipsEndpoint: await A.useFipsEndpoint(),
                useDualstackEndpoint: await A.useDualstackEndpoint()
            }) || {}, _]).then(([_, J]) => {
                let {
                    signingRegion: X,
                    signingService: D
                } = _;
                A.signingRegion = A.signingRegion || X || J, A.signingName = A.signingName || D || A.serviceId;
                let j = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: H,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || T08.SignatureV4)(j)
            });
            else $ = async (_) => {
                _ = Object.assign({}, {
                    name: "sigv4",
                    signingName: A.signingName || A.defaultSigningName,
                    signingRegion: await bi.normalizeProvider(A.region)(),
                    properties: {}
                }, _);
                let {
                    signingRegion: J,
                    signingName: X
                } = _;
                A.signingRegion = A.signingRegion || J, A.signingName = A.signingName || X || A.serviceId;
                let D = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: H,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || T08.SignatureV4)(D)
            };
            return Object.assign(A, {
                systemClockOffset: w,
                signingEscapePath: z,
                signer: $
            })
        },
        mEK = x08;

    function FEK(A, {
        credentials: q,
        credentialDefaultProvider: K
    }) {
        let Y;
        if (q)
            if (!q?.memoized) Y = bi.memoizeIdentityProvider(q, bi.isIdentityExpired, bi.doesIdentityRequireRefresh);
            else Y = q;
        else if (K) Y = bi.normalizeProvider(K(Object.assign({}, A, {
            parentClientConfig: A
        })));
        else Y = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return Y.memoized = !0, Y
    }

    function QEK(A, q) {
        if (q.configBound) return q;
        let K = async (Y) => q({
            ...Y,
            callerClientConfig: A
        });
        return K.memoized = q.memoized, K.configBound = !0, K
    }
    class yH1 {
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
                _ = f2.TypeRegistry.for(H);
            try {
                return {
                    errorSchema: w?.(_, $) ?? _.getSchema(A),
                    errorMetadata: O
                }
            } catch (J) {
                Y.message = Y.message ?? Y.Message ?? "UnknownError";
                let X = f2.TypeRegistry.for("smithy.ts.sdk.synthetic." + H),
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
                    Y = nQ.decorateServiceException(A, q);
                if (K) Y.Message = K, Y.message = K;
                return Y
            }
            return nQ.decorateServiceException(A, q)
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
    class b08 extends v08.SmithyRpcV2CborProtocol {
        awsQueryCompatible;
        mixin;
        constructor({
            defaultNamespace: A,
            awsQueryCompatible: q
        }) {
            super({
                defaultNamespace: A
            });
            this.awsQueryCompatible = !!q, this.mixin = new yH1(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            return Y
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let w = v08.loadSmithyRpcV2CborErrorCode(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = f2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(f2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_),
                D = {};
            for (let [j, M] of O.structIterator()) D[j] = this.deserializer.readValue(M, Y[j]);
            if (this.awsQueryCompatible) this.mixin.queryCompatOutput(Y, D);
            throw this.mixin.decorateServiceException(Object.assign(X, $, {
                $fault: O.getMergedTraits().error,
                message: _
            }, D), Y)
        }
    }
    var gEK = (A) => {
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
        UEK = (A) => {
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
        pEK = (A) => {
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
    class ui {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }

    function dEK(A, q, K) {
        if (K?.source) {
            let Y = K.source;
            if (typeof q === "number") {
                if (q > Number.MAX_SAFE_INTEGER || q < Number.MIN_SAFE_INTEGER || Y !== String(q))
                    if (Y.includes(".")) return new v0.NumericValue(Y, "bigDecimal");
                    else return BigInt(Y)
            }
        }
        return q
    }
    var u08 = (A, q) => nQ.collectBody(A, q).then((K) => (q?.utf8Encoder ?? S08.toUtf8)(K)),
        pU6 = (A, q) => u08(A, q).then((K) => {
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
        cEK = async (A, q) => {
            let K = await pU6(A, q);
            return K.message = K.message ?? K.Message, K
        }, dU6 = (A, q) => {
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
    class cU6 extends ui {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        async read(A, q) {
            return this._read(A, typeof q === "string" ? JSON.parse(q, dEK) : await pU6(q, this.serdeContext))
        }
        readObject(A, q) {
            return this._read(A, q)
        }
        _read(A, q) {
            let K = q !== null && typeof q === "object",
                Y = f2.NormalizedSchema.of(A);
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
            if (Y.isBlobSchema() && typeof q === "string") return NE1.fromBase64(q);
            let z = Y.getMergedTraits().mediaType;
            if (Y.isStringSchema() && typeof q === "string" && z) {
                if (z === "application/json" || z.endsWith("+json")) return v0.LazyJsonString.from(q)
            }
            if (Y.isTimestampSchema() && q != null) switch (AM.determineTimestampFormat(Y, this.settings)) {
                case 5:
                    return v0.parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return v0.parseRfc7231DateTime(q);
                case 7:
                    return v0.parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (Y.isBigIntegerSchema() && (typeof q === "number" || typeof q === "string")) return BigInt(q);
            if (Y.isBigDecimalSchema() && q != null) {
                if (q instanceof v0.NumericValue) return q;
                let w = q;
                if (w.type === "bigDecimal" && "string" in w) return new v0.NumericValue(w.string, w.type);
                return new v0.NumericValue(String(q), "bigDecimal")
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
                        if ($ instanceof v0.NumericValue) w[H] = $;
                        else w[H] = this._read(Y, $);
                    return w
                } else return structuredClone(q);
            return q
        }
    }
    var C08 = String.fromCharCode(925);
    class B08 {
        values = new Map;
        counter = 0;
        stage = 0;
        createReplacer() {
            if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
            if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
            return this.stage = 1, (A, q) => {
                if (q instanceof v0.NumericValue) {
                    let K = `${C08+"nv"+this.counter++}_` + q.string;
                    return this.values.set(`"${K}"`, q.string), K
                }
                if (typeof q === "bigint") {
                    let K = q.toString(),
                        Y = `${C08+"b"+this.counter++}_` + K;
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
    class lU6 extends ui {
        settings;
        buffer;
        rootSchema;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            this.rootSchema = f2.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, q)
        }
        writeDiscriminatedDocument(A, q) {
            if (this.write(A, q), typeof this.buffer === "object") this.buffer.__type = f2.NormalizedSchema.of(A).getName(!0)
        }
        flush() {
            let {
                rootSchema: A
            } = this;
            if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
                let q = new B08;
                return q.replaceInJson(JSON.stringify(this.buffer, q.createReplacer(), 0))
            }
            return this.buffer
        }
        _write(A, q, K) {
            let Y = q !== null && typeof q === "object",
                z = f2.NormalizedSchema.of(A);
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
                return (this.serdeContext?.base64Encoder ?? NE1.toBase64)(q)
            }
            if ((z.isTimestampSchema() || z.isDocumentSchema()) && q instanceof Date) switch (AM.determineTimestampFormat(z, this.settings)) {
                case 5:
                    return q.toISOString().replace(".000Z", "Z");
                case 6:
                    return v0.dateToUtcString(q);
                case 7:
                    return q.getTime() / 1000;
                default:
                    return console.warn("Missing timestamp format, using epoch seconds", q), q.getTime() / 1000
            }
            if (z.isNumericSchema() && typeof q === "number") {
                if (Math.abs(q) === 1 / 0 || isNaN(q)) return String(q)
            }
            if (z.isStringSchema()) {
                if (typeof q > "u" && z.isIdempotencyToken()) return v0.generateIdempotencyToken();
                let w = z.getMergedTraits().mediaType;
                if (q != null && w) {
                    if (w === "application/json" || w.endsWith("+json")) return v0.LazyJsonString.from(q)
                }
            }
            if (z.isDocumentSchema())
                if (Y) {
                    let w = Array.isArray(q) ? [] : {};
                    for (let [H, $] of Object.entries(q))
                        if ($ instanceof v0.NumericValue) w[H] = $;
                        else w[H] = this._write(z, $);
                    return w
                } else return structuredClone(q);
            return q
        }
    }
    class nt1 extends ui {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new lU6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new cU6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class rt1 extends AM.RpcProtocol {
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
            this.serviceTarget = q, this.codec = new nt1({
                timestampFormat: {
                    useTrait: !0,
                    default: 7
                },
                jsonName: !1
            }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!K, this.mixin = new yH1(this.awsQueryCompatible)
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (!Y.path.endsWith("/")) Y.path += "/";
            if (Object.assign(Y.headers, {
                    "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
                    "x-amz-target": `${this.serviceTarget}.${A.name}`
                }), this.awsQueryCompatible) Y.headers["x-amzn-query-mode"] = "true";
            if (f2.deref(A.input) === "unit" || !Y.body) Y.body = "{}";
            return Y
        }
        getPayloadCodec() {
            return this.codec
        }
        async handleError(A, q, K, Y, z) {
            if (this.awsQueryCompatible) this.mixin.setQueryCompatError(Y, K);
            let w = dU6(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = f2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(f2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_),
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
    class m08 extends rt1 {
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
    class F08 extends rt1 {
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
    class Q08 extends AM.HttpBindingProtocol {
        serializer;
        deserializer;
        codec;
        mixin = new yH1;
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
            this.codec = new nt1(q), this.serializer = new AM.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new AM.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
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
                z = f2.NormalizedSchema.of(A.input);
            if (!Y.headers["content-type"]) {
                let w = this.mixin.resolveRestContentType(this.getDefaultContentType(), z);
                if (w) Y.headers["content-type"] = w
            }
            if (Y.body == null && Y.headers["content-type"] === this.getDefaultContentType()) Y.body = "{}";
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = await super.deserializeResponse(A, q, K),
                z = f2.NormalizedSchema.of(A.output);
            for (let [w, H] of z.structIterator())
                if (H.getMemberTraits().httpPayload && !(w in Y)) Y[w] = null;
            return Y
        }
        async handleError(A, q, K, Y, z) {
            let w = dU6(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = f2.NormalizedSchema.of(H),
                _ = Y.message ?? Y.Message ?? "Unknown",
                X = new(f2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_);
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
    var lEK = (A) => {
        if (A == null) return;
        if (typeof A === "object" && "__type" in A) delete A.__type;
        return nQ.expectUnion(A)
    };
    class ot1 extends ui {
        settings;
        stringDeserializer;
        constructor(A) {
            super();
            this.settings = A, this.stringDeserializer = new AM.FromStringShapeDeserializer(A)
        }
        setSerdeContext(A) {
            this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
        }
        read(A, q, K) {
            let Y = f2.NormalizedSchema.of(A),
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
            let H = (this.serdeContext?.utf8Encoder ?? S08.toUtf8)(q),
                $ = this.parseXml(H);
            return this.readSchema(A, K ? $[K] : $)
        }
        readSchema(A, q) {
            let K = f2.NormalizedSchema.of(A);
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
                    q = Vk.parseXML(A)
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
                return nQ.getValueFromTextNode(z)
            }
            return {}
        }
    }
    class g08 extends ui {
        settings;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q, K = "") {
            if (this.buffer === void 0) this.buffer = "";
            let Y = f2.NormalizedSchema.of(A);
            if (K && !K.endsWith(".")) K += ".";
            if (Y.isBlobSchema()) {
                if (typeof q === "string" || q instanceof Uint8Array) this.writeKey(K), this.writeValue((this.serdeContext?.base64Encoder ?? NE1.toBase64)(q))
            } else if (Y.isBooleanSchema() || Y.isNumericSchema() || Y.isStringSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q));
                else if (Y.isIdempotencyToken()) this.writeKey(K), this.writeValue(v0.generateIdempotencyToken())
            } else if (Y.isBigIntegerSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(String(q))
            } else if (Y.isBigDecimalSchema()) {
                if (q != null) this.writeKey(K), this.writeValue(q instanceof v0.NumericValue ? q.string : String(q))
            } else if (Y.isTimestampSchema()) {
                if (q instanceof Date) switch (this.writeKey(K), AM.determineTimestampFormat(Y, this.settings)) {
                    case 5:
                        this.writeValue(q.toISOString().replace(".000Z", "Z"));
                        break;
                    case 6:
                        this.writeValue(nQ.dateToUtcString(q));
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
            this.buffer += `&${AM.extendedEncodeURIComponent(A)}=`
        }
        writeValue(A) {
            this.buffer += AM.extendedEncodeURIComponent(A)
        }
    }
    class iU6 extends AM.RpcProtocol {
        options;
        serializer;
        deserializer;
        mixin = new yH1;
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
            this.serializer = new g08(q), this.deserializer = new ot1(q)
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
                }), f2.deref(A.input) === "unit" || !Y.body) Y.body = "";
            let z = A.name.split("#")[1] ?? A.name;
            if (Y.body = `Action=${z}&Version=${this.options.version}` + Y.body, Y.body.endsWith("&")) Y.body = Y.body.slice(-1);
            return Y
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = f2.NormalizedSchema.of(A.output),
                w = {};
            if (K.statusCode >= 300) {
                let J = await AM.collectBody(K.body, q);
                if (J.byteLength > 0) Object.assign(w, await Y.read(15, J));
                await this.handleError(A, q, K, w, this.deserializeMetadata(K))
            }
            for (let J in K.headers) {
                let X = K.headers[J];
                delete K.headers[J], K.headers[J.toLowerCase()] = X
            }
            let H = A.name.split("#")[1] ?? A.name,
                $ = z.isStructSchema() && this.useNestedResult() ? H + "Result" : void 0,
                O = await AM.collectBody(K.body, q);
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
                    return M.find((G) => f2.NormalizedSchema.of(G).getMergedTraits().awsQueryError?.[0] === P)
                }
            }), J = f2.NormalizedSchema.of(O), D = new(f2.TypeRegistry.for(O[1]).getErrorCtor(O) ?? Error)($), j = {
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
    class U08 extends iU6 {
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
    var p08 = (A, q) => u08(A, q).then((K) => {
            if (K.length) {
                let Y;
                try {
                    Y = Vk.parseXML(K)
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
                return nQ.getValueFromTextNode(H)
            }
            return {}
        }),
        iEK = async (A, q) => {
            let K = await p08(A, q);
            if (K.Error) K.Error.message = K.Error.message ?? K.Error.Message;
            return K
        }, d08 = (A, q) => {
            if (q?.Error?.Code !== void 0) return q.Error.Code;
            if (q?.Code !== void 0) return q.Code;
            if (A.statusCode == 404) return "NotFound"
        };
    class nU6 extends ui {
        settings;
        stringBuffer;
        byteBuffer;
        buffer;
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = f2.NormalizedSchema.of(A);
            if (K.isStringSchema() && typeof q === "string") this.stringBuffer = q;
            else if (K.isBlobSchema()) this.byteBuffer = "byteLength" in q ? q : (this.serdeContext?.base64Decoder ?? NE1.fromBase64)(q);
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
            let w = Vk.XmlNode.of(z),
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
                        let X = Vk.XmlNode.of(_.getMergedTraits().xmlName ?? _.getMemberName());
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
                        let M = Vk.XmlNode.of(O ? z.xmlName ?? A.getMemberName() : H.xmlName ?? "member");
                        this.writeSimpleInto(w, j, M, J), D.addChildNode(M)
                    }
                };
            if (O) {
                for (let D of q)
                    if ($ || D != null) X(K, D)
            } else {
                let D = Vk.XmlNode.of(z.xmlName ?? A.getMemberName());
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
                    let N = Vk.XmlNode.of(O, f),
                        [T, k] = this.getXmlnsAttribute(H, P);
                    if (k) N.addAttribute(T, k);
                    G.addChildNode(N);
                    let y = Vk.XmlNode.of(X);
                    if (_.isListSchema()) this.writeList(_, Z, y, P);
                    else if (_.isMapSchema()) this.writeMap(_, Z, y, P, !0);
                    else if (_.isStructSchema()) y = this.writeStruct(_, Z, P);
                    else this.writeSimpleInto(_, Z, y, P);
                    G.addChildNode(y)
                };
            if (j) {
                for (let [G, f] of Object.entries(q))
                    if (D || f != null) {
                        let Z = Vk.XmlNode.of(w.xmlName ?? A.getMemberName());
                        W(Z, G, f), K.addChildNode(Z)
                    }
            } else {
                let G;
                if (!z) {
                    if (G = Vk.XmlNode.of(w.xmlName ?? A.getMemberName()), P) G.addAttribute(M, P);
                    K.addChildNode(G)
                }
                for (let [f, Z] of Object.entries(q))
                    if (D || Z != null) {
                        let N = Vk.XmlNode.of("entry");
                        W(N, f, Z), (z ? K : G).addChildNode(N)
                    }
            }
        }
        writeSimple(A, q) {
            if (q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
            let K = f2.NormalizedSchema.of(A),
                Y = null;
            if (q && typeof q === "object")
                if (K.isBlobSchema()) Y = (this.serdeContext?.base64Encoder ?? NE1.toBase64)(q);
                else if (K.isTimestampSchema() && q instanceof Date) switch (AM.determineTimestampFormat(K, this.settings)) {
                case 5:
                    Y = q.toISOString().replace(".000Z", "Z");
                    break;
                case 6:
                    Y = nQ.dateToUtcString(q);
                    break;
                case 7:
                    Y = String(q.getTime() / 1000);
                    break;
                default:
                    console.warn("Missing timestamp format, using http date", q), Y = nQ.dateToUtcString(q);
                    break
            } else if (K.isBigDecimalSchema() && q) {
                if (q instanceof v0.NumericValue) return q.string;
                return String(q)
            } else if (K.isMapSchema() || K.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
            else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${K.getName(!0)}`);
            if (K.isBooleanSchema() || K.isNumericSchema() || K.isBigIntegerSchema() || K.isBigDecimalSchema()) Y = String(q);
            if (K.isStringSchema())
                if (q === void 0 && K.isIdempotencyToken()) Y = v0.generateIdempotencyToken();
                else Y = String(q);
            if (Y === null) throw Error(`Unhandled schema-value pair ${K.getName(!0)}=${q}`);
            return Y
        }
        writeSimpleInto(A, q, K, Y) {
            let z = this.writeSimple(A, q),
                w = f2.NormalizedSchema.of(A),
                H = new Vk.XmlText(z),
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
    class rU6 extends ui {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        createSerializer() {
            let A = new nU6(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new ot1(this.settings);
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class c08 extends AM.HttpBindingProtocol {
        codec;
        serializer;
        deserializer;
        mixin = new yH1;
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
            this.codec = new rU6(q), this.serializer = new AM.HttpInterceptingShapeSerializer(this.codec.createSerializer(), q), this.deserializer = new AM.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), q)
        }
        getPayloadCodec() {
            return this.codec
        }
        getShapeId() {
            return "aws.protocols#restXml"
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K),
                z = f2.NormalizedSchema.of(A.input);
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
            let w = d08(K, Y) ?? "Unknown",
                {
                    errorSchema: H,
                    errorMetadata: $
                } = await this.mixin.getErrorSchemaOrThrowBaseException(w, this.options.defaultNamespace, K, Y, z),
                O = f2.NormalizedSchema.of(H),
                _ = Y.Error?.message ?? Y.Error?.Message ?? Y.message ?? Y.Message ?? "Unknown",
                X = new(f2.TypeRegistry.for(H[1]).getErrorCtor(H) ?? Error)(_);
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
    nEK.AWSSDKSigV4Signer = xEK;
    nEK.AwsEc2QueryProtocol = U08;
    nEK.AwsJson1_0Protocol = m08;
    nEK.AwsJson1_1Protocol = F08;
    nEK.AwsJsonRpcProtocol = rt1;
    nEK.AwsQueryProtocol = iU6;
    nEK.AwsRestJsonProtocol = Q08;
    nEK.AwsRestXmlProtocol = c08;
    nEK.AwsSdkSigV4ASigner = h08;
    nEK.AwsSdkSigV4Signer = it1;
    nEK.AwsSmithyRpcV2CborProtocol = b08;
    nEK.JsonCodec = nt1;
    nEK.JsonShapeDeserializer = cU6;
    nEK.JsonShapeSerializer = lU6;
    nEK.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = bEK;
    nEK.NODE_SIGV4A_CONFIG_OPTIONS = BEK;
    nEK.XmlCodec = rU6;
    nEK.XmlShapeDeserializer = ot1;
    nEK.XmlShapeSerializer = nU6;
    nEK._toBool = UEK;
    nEK._toNum = pEK;
    nEK._toStr = gEK;
    nEK.awsExpectUnion = lEK;
    nEK.emitWarningIfUnsupportedVersion = yEK;
    nEK.getBearerTokenEnvKey = I08;
    nEK.loadRestJsonErrorCode = dU6;
    nEK.loadRestXmlErrorCode = d08;
    nEK.parseJsonBody = pU6;
    nEK.parseJsonErrorBody = cEK;
    nEK.parseXmlBody = p08;
    nEK.parseXmlErrorBody = iEK;
    nEK.resolveAWSSDKSigV4Config = mEK;
    nEK.resolveAwsSdkSigV4AConfig = uEK;
    nEK.resolveAwsSdkSigV4Config = x08;
    nEK.setCredentialFeature = CEK;
    nEK.setFeature = SEK;
    nEK.setTokenFeature = hEK;
    nEK.state = FU6;
    nEK.validateSigningProperties = UU6
})
// @from(Ln 63107, Col 4)
$b = R((lkK) => {
    var xkK = lz(),
        bkK = zb(),
        ukK = tX8(),
        Hb = YH(),
        r08 = void 0;

    function BkK(A) {
        if (A === void 0) return !0;
        return typeof A === "string" && A.length <= 50
    }

    function mkK(A) {
        let q = xkK.normalizeProvider(A.userAgentAppId ?? r08),
            {
                customUserAgent: K
            } = A;
        return Object.assign(A, {
            customUserAgent: typeof K === "string" ? [
                [K]
            ] : K,
            userAgentAppId: async () => {
                let Y = await q();
                if (!BkK(Y)) {
                    let z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
                    if (typeof Y !== "string") z?.warn("userAgentAppId must be a string or undefined.");
                    else if (Y.length > 50) z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
                }
                return Y
            }
        })
    }
    var FkK = /\d{12}\.ddb/;
    async function QkK(A, q, K) {
        if (K.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") Hb.setFeature(A, "PROTOCOL_RPC_V2_CBOR", "M");
        if (typeof q.retryStrategy === "function") {
            let w = await q.retryStrategy();
            if (typeof w.acquireInitialRetryToken === "function")
                if (w.constructor?.name?.includes("Adaptive")) Hb.setFeature(A, "RETRY_MODE_ADAPTIVE", "F");
                else Hb.setFeature(A, "RETRY_MODE_STANDARD", "E");
            else Hb.setFeature(A, "RETRY_MODE_LEGACY", "D")
        }
        if (typeof q.accountIdEndpointMode === "function") {
            let w = A.endpointV2;
            if (String(w?.url?.hostname).match(FkK)) Hb.setFeature(A, "ACCOUNT_ID_ENDPOINT", "O");
            switch (await q.accountIdEndpointMode?.()) {
                case "disabled":
                    Hb.setFeature(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
                    break;
                case "preferred":
                    Hb.setFeature(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
                    break;
                case "required":
                    Hb.setFeature(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
                    break
            }
        }
        let z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
        if (z?.$source) {
            let w = z;
            if (w.accountId) Hb.setFeature(A, "RESOLVED_ACCOUNT_ID", "T");
            for (let [H, $] of Object.entries(w.$source ?? {})) Hb.setFeature(A, H, $)
        }
    }
    var l08 = "user-agent",
        oU6 = "x-amz-user-agent",
        i08 = " ",
        aU6 = "/",
        gkK = /[^!$%&'*+\-.^_`|~\w]/g,
        UkK = /[^!$%&'*+\-.^_`|~\w#]/g,
        n08 = "-",
        pkK = 1024;

    function dkK(A) {
        let q = "";
        for (let K in A) {
            let Y = A[K];
            if (q.length + Y.length + 1 <= pkK) {
                if (q.length) q += "," + Y;
                else q += Y;
                continue
            }
            break
        }
        return q
    }
    var o08 = (A) => (q, K) => async (Y) => {
        let {
            request: z
        } = Y;
        if (!ukK.HttpRequest.isInstance(z)) return q(Y);
        let {
            headers: w
        } = z, H = K?.userAgent?.map(at1) || [], $ = (await A.defaultUserAgentProvider()).map(at1);
        await QkK(K, A, Y);
        let O = K;
        $.push(`m/${dkK(Object.assign({},K.__smithy_context?.features,O.__aws_sdk_context?.features))}`);
        let _ = A?.customUserAgent?.map(at1) || [],
            J = await A.userAgentAppId();
        if (J) $.push(at1(["app", `${J}`]));
        let X = bkK.getUserAgentPrefix(),
            D = (X ? [X] : []).concat([...$, ...H, ..._]).join(i08),
            j = [...$.filter((M) => M.startsWith("aws-sdk-")), ..._].join(i08);
        if (A.runtime !== "browser") {
            if (j) w[oU6] = w[oU6] ? `${w[l08]} ${j}` : j;
            w[l08] = D
        } else w[oU6] = D;
        return q({
            ...Y,
            request: z
        })
    }, at1 = (A) => {
        let q = A[0].split(aU6).map((H) => H.replace(gkK, n08)).join(aU6),
            K = A[1]?.replace(UkK, n08),
            Y = q.indexOf(aU6),
            z = q.substring(0, Y),
            w = q.substring(Y + 1);
        if (z === "api") w = w.toLowerCase();
        return [z, w, K].filter((H) => H && H.length > 0).reduce((H, $, O) => {
            switch (O) {
                case 0:
                    return $;
                case 1:
                    return `${H}/${$}`;
                default:
                    return `${H}#${$}`
            }
        }, "")
    }, a08 = {
        name: "getUserAgentMiddleware",
        step: "build",
        priority: "low",
        tags: ["SET_USER_AGENT", "USER_AGENT"],
        override: !0
    }, ckK = (A) => ({
        applyToStack: (q) => {
            q.add(o08(A), a08)
        }
    });
    lkK.DEFAULT_UA_APP_ID = r08;
    lkK.getUserAgentMiddlewareOptions = a08;
    lkK.getUserAgentPlugin = ckK;
    lkK.resolveUserAgentConfig = mkK;
    lkK.userAgentMiddleware = o08
})
// @from(Ln 63252, Col 4)
s08 = R((ekK) => {
    var skK = (A, q, K) => {
            if (!(q in A)) return;
            if (A[q] === "true") return !0;
            if (A[q] === "false") return !1;
            throw Error(`Cannot load ${K} "${q}". Expected "true" or "false", got ${A[q]}.`)
        },
        tkK = (A, q, K) => {
            if (!(q in A)) return;
            let Y = parseInt(A[q], 10);
            if (Number.isNaN(Y)) throw TypeError(`Cannot load ${K} '${q}'. Expected number, got '${A[q]}'.`);
            return Y
        };
    ekK.SelectorType = void 0;
    (function(A) {
        A.ENV = "env", A.CONFIG = "shared config entry"
    })(ekK.SelectorType || (ekK.SelectorType = {}));
    ekK.booleanSelector = skK;
    ekK.numberSelector = tkK
})
// @from(Ln 63272, Col 4)
YJ = R((fLK) => {
    var Bi = s08(),
        st1 = iP(),
        KLK = GC(),
        Aj8 = "AWS_USE_DUALSTACK_ENDPOINT",
        qj8 = "use_dualstack_endpoint",
        YLK = !1,
        zLK = {
            environmentVariableSelector: (A) => Bi.booleanSelector(A, Aj8, Bi.SelectorType.ENV),
            configFileSelector: (A) => Bi.booleanSelector(A, qj8, Bi.SelectorType.CONFIG),
            default: !1
        },
        Kj8 = "AWS_USE_FIPS_ENDPOINT",
        Yj8 = "use_fips_endpoint",
        wLK = !1,
        HLK = {
            environmentVariableSelector: (A) => Bi.booleanSelector(A, Kj8, Bi.SelectorType.ENV),
            configFileSelector: (A) => Bi.booleanSelector(A, Yj8, Bi.SelectorType.CONFIG),
            default: !1
        },
        $LK = (A) => {
            let {
                tls: q,
                endpoint: K,
                urlParser: Y,
                useDualstackEndpoint: z
            } = A;
            return Object.assign(A, {
                tls: q ?? !0,
                endpoint: st1.normalizeProvider(typeof K === "string" ? Y(K) : K),
                isCustomEndpoint: !0,
                useDualstackEndpoint: st1.normalizeProvider(z ?? !1)
            })
        },
        OLK = async (A) => {
            let {
                tls: q = !0
            } = A, K = await A.region();
            if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(K)) throw Error("Invalid region in client config");
            let z = await A.useDualstackEndpoint(),
                w = await A.useFipsEndpoint(),
                {
                    hostname: H
                } = await A.regionInfoProvider(K, {
                    useDualstackEndpoint: z,
                    useFipsEndpoint: w
                }) ?? {};
            if (!H) throw Error("Cannot resolve hostname from client config");
            return A.urlParser(`${q?"https:":"http:"}//${H}`)
        }, _LK = (A) => {
            let q = st1.normalizeProvider(A.useDualstackEndpoint ?? !1),
                {
                    endpoint: K,
                    useFipsEndpoint: Y,
                    urlParser: z,
                    tls: w
                } = A;
            return Object.assign(A, {
                tls: w ?? !0,
                endpoint: K ? st1.normalizeProvider(typeof K === "string" ? z(K) : K) : () => OLK({
                    ...A,
                    useDualstackEndpoint: q,
                    useFipsEndpoint: Y
                }),
                isCustomEndpoint: !!K,
                useDualstackEndpoint: q
            })
        }, zj8 = "AWS_REGION", wj8 = "region", JLK = {
            environmentVariableSelector: (A) => A[zj8],
            configFileSelector: (A) => A[wj8],
            default: () => {
                throw Error("Region is missing")
            }
        }, XLK = {
            preferredFile: "credentials"
        }, t08 = new Set, DLK = (A, q = KLK.isValidHostLabel) => {
            if (!t08.has(A) && !q(A))
                if (A === "*") console.warn('@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.');
                else throw Error(`Region not accepted: region="${A}" is not a valid hostname component.`);
            else t08.add(A)
        }, Hj8 = (A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), jLK = (A) => Hj8(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, MLK = (A) => {
            let {
                region: q,
                useFipsEndpoint: K
            } = A;
            if (!q) throw Error("Region is missing");
            return Object.assign(A, {
                region: async () => {
                    let Y = typeof q === "function" ? await q() : q,
                        z = jLK(Y);
                    return DLK(z), z
                },
                useFipsEndpoint: async () => {
                    let Y = typeof q === "string" ? q : await q();
                    if (Hj8(Y)) return !0;
                    return typeof K !== "function" ? Promise.resolve(!!K) : K()
                }
            })
        }, e08 = (A = [], {
            useFipsEndpoint: q,
            useDualstackEndpoint: K
        }) => A.find(({
            tags: Y
        }) => q === Y.includes("fips") && K === Y.includes("dualstack"))?.hostname, PLK = (A, {
            regionHostname: q,
            partitionHostname: K
        }) => q ? q : K ? K.replace("{region}", A) : void 0, WLK = (A, {
            partitionHash: q
        }) => Object.keys(q || {}).find((K) => q[K].regions.includes(A)) ?? "aws", GLK = (A, {
            signingRegion: q,
            regionRegex: K,
            useFipsEndpoint: Y
        }) => {
            if (q) return q;
            else if (Y) {
                let z = K.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."),
                    w = A.match(z);
                if (w) return w[0].slice(1, -1)
            }
        }, ZLK = (A, {
            useFipsEndpoint: q = !1,
            useDualstackEndpoint: K = !1,
            signingService: Y,
            regionHash: z,
            partitionHash: w
        }) => {
            let H = WLK(A, {
                    partitionHash: w
                }),
                $ = A in z ? A : w[H]?.endpoint ?? A,
                O = {
                    useFipsEndpoint: q,
                    useDualstackEndpoint: K
                },
                _ = e08(z[$]?.variants, O),
                J = e08(w[H]?.variants, O),
                X = PLK($, {
                    regionHostname: _,
                    partitionHostname: J
                });
            if (X === void 0) throw Error(`Endpoint resolution failed for: ${{resolvedRegion:$,useFipsEndpoint:q,useDualstackEndpoint:K}}`);
            let D = GLK(X, {
                signingRegion: z[$]?.signingRegion,
                regionRegex: w[H].regionRegex,
                useFipsEndpoint: q
            });
            return {
                partition: H,
                signingService: Y,
                hostname: X,
                ...D && {
                    signingRegion: D
                },
                ...z[$]?.signingService && {
                    signingService: z[$].signingService
                }
            }
        };
    fLK.CONFIG_USE_DUALSTACK_ENDPOINT = qj8;
    fLK.CONFIG_USE_FIPS_ENDPOINT = Yj8;
    fLK.DEFAULT_USE_DUALSTACK_ENDPOINT = YLK;
    fLK.DEFAULT_USE_FIPS_ENDPOINT = wLK;
    fLK.ENV_USE_DUALSTACK_ENDPOINT = Aj8;
    fLK.ENV_USE_FIPS_ENDPOINT = Kj8;
    fLK.NODE_REGION_CONFIG_FILE_OPTIONS = XLK;
    fLK.NODE_REGION_CONFIG_OPTIONS = JLK;
    fLK.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = zLK;
    fLK.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = HLK;
    fLK.REGION_ENV_NAME = zj8;
    fLK.REGION_INI_NAME = wj8;
    fLK.getRegionInfo = ZLK;
    fLK.resolveCustomEndpointsConfig = $LK;
    fLK.resolveEndpointsConfig = _LK;
    fLK.resolveRegionConfig = MLK
})
// @from(Ln 63447, Col 4)
$j8 = R((ULK) => {
    ULK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ULK.HttpAuthLocation || (ULK.HttpAuthLocation = {}));
    ULK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ULK.HttpApiKeyAuthLocation || (ULK.HttpApiKeyAuthLocation = {}));
    ULK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ULK.EndpointURLScheme || (ULK.EndpointURLScheme = {}));
    ULK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ULK.AlgorithmId || (ULK.AlgorithmId = {}));
    var BLK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ULK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ULK.AlgorithmId.MD5,
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
        mLK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        FLK = (A) => {
            return BLK(A)
        },
        QLK = (A) => {
            return mLK(A)
        };
    ULK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ULK.FieldPosition || (ULK.FieldPosition = {}));
    var gLK = "__smithy_context";
    ULK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ULK.IniSectionType || (ULK.IniSectionType = {}));
    ULK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ULK.RequestHandlerProtocol || (ULK.RequestHandlerProtocol = {}));
    ULK.SMITHY_CONTEXT_KEY = gLK;
    ULK.getDefaultClientConfiguration = FLK;
    ULK.resolveDefaultRuntimeConfig = QLK
})
// @from(Ln 63512, Col 4)
Xj8 = R((aLK) => {
    var lLK = $j8(),
        iLK = (A) => {
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
        nLK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class Oj8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = lLK.FieldPosition.HEADER,
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
    class _j8 {
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
    class tt1 {
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
            let q = new tt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = rLK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return tt1.clone(this)
        }
    }

    function rLK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class Jj8 {
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

    function oLK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    aLK.Field = Oj8;
    aLK.Fields = _j8;
    aLK.HttpRequest = tt1;
    aLK.HttpResponse = Jj8;
    aLK.getHttpHandlerExtensionConfiguration = iLK;
    aLK.isValidHostname = oLK;
    aLK.resolveHttpHandlerRuntimeConfig = nLK
})
// @from(Ln 63654, Col 4)
rQ = R((HRK) => {
    var zRK = Xj8(),
        Dj8 = "content-length";

    function jj8(A) {
        return (q) => async (K) => {
            let Y = K.request;
            if (zRK.HttpRequest.isInstance(Y)) {
                let {
                    body: z,
                    headers: w
                } = Y;
                if (z && Object.keys(w).map((H) => H.toLowerCase()).indexOf(Dj8) === -1) try {
                    let H = A(z);
                    Y.headers = {
                        ...Y.headers,
                        [Dj8]: String(H)
                    }
                } catch (H) {}
            }
            return q({
                ...K,
                request: Y
            })
        }
    }
    var Mj8 = {
            step: "build",
            tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
            name: "contentLengthMiddleware",
            override: !0
        },
        wRK = (A) => ({
            applyToStack: (q) => {
                q.add(jj8(A.bodyLengthChecker), Mj8)
            }
        });
    HRK.contentLengthMiddleware = jj8;
    HRK.contentLengthMiddlewareOptions = Mj8;
    HRK.getContentLengthPlugin = wRK
})
// @from(Ln 63695, Col 4)
wp6 = R((Pj8) => {
    Object.defineProperty(Pj8, "__esModule", {
        value: !0
    });
    Pj8.getHomeDir = void 0;
    var JRK = h1("os"),
        XRK = h1("path"),
        zp6 = {},
        DRK = () => {
            if (process && process.geteuid) return `${process.geteuid()}`;
            return "DEFAULT"
        },
        jRK = () => {
            let {
                HOME: A,
                USERPROFILE: q,
                HOMEPATH: K,
                HOMEDRIVE: Y = `C:${XRK.sep}`
            } = process.env;
            if (A) return A;
            if (q) return q;
            if (K) return `${Y}${K}`;
            let z = DRK();
            if (!zp6[z]) zp6[z] = (0, JRK.homedir)();
            return zp6[z]
        };
    Pj8.getHomeDir = jRK
})
// @from(Ln 63723, Col 4)
Hp6 = R((Gj8) => {
    Object.defineProperty(Gj8, "__esModule", {
        value: !0
    });
    Gj8.getSSOTokenFilepath = void 0;
    var MRK = h1("crypto"),
        PRK = h1("path"),
        WRK = wp6(),
        GRK = (A) => {
            let K = (0, MRK.createHash)("sha1").update(A).digest("hex");
            return (0, PRK.join)((0, WRK.getHomeDir)(), ".aws", "sso", "cache", `${K}.json`)
        };
    Gj8.getSSOTokenFilepath = GRK
})
// @from(Ln 63737, Col 4)
Nj8 = R((fj8) => {
    Object.defineProperty(fj8, "__esModule", {
        value: !0
    });
    fj8.getSSOTokenFromFile = fj8.tokenIntercept = void 0;
    var ZRK = h1("fs/promises"),
        fRK = Hp6();
    fj8.tokenIntercept = {};
    var VRK = async (A) => {
        if (fj8.tokenIntercept[A]) return fj8.tokenIntercept[A];
        let q = (0, fRK.getSSOTokenFilepath)(A),
            K = await (0, ZRK.readFile)(q, "utf8");
        return JSON.parse(K)
    };
    fj8.getSSOTokenFromFile = VRK
})
// @from(Ln 63753, Col 4)
Tj8 = R((LRK) => {
    LRK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LRK.HttpAuthLocation || (LRK.HttpAuthLocation = {}));
    LRK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(LRK.HttpApiKeyAuthLocation || (LRK.HttpApiKeyAuthLocation = {}));
    LRK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(LRK.EndpointURLScheme || (LRK.EndpointURLScheme = {}));
    LRK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(LRK.AlgorithmId || (LRK.AlgorithmId = {}));
    var NRK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => LRK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => LRK.AlgorithmId.MD5,
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
        TRK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        vRK = (A) => {
            return NRK(A)
        },
        ERK = (A) => {
            return TRK(A)
        };
    LRK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(LRK.FieldPosition || (LRK.FieldPosition = {}));
    var kRK = "__smithy_context";
    LRK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(LRK.IniSectionType || (LRK.IniSectionType = {}));
    LRK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(LRK.RequestHandlerProtocol || (LRK.RequestHandlerProtocol = {}));
    LRK.SMITHY_CONTEXT_KEY = kRK;
    LRK.getDefaultClientConfiguration = vRK;
    LRK.resolveDefaultRuntimeConfig = ERK
})
// @from(Ln 63818, Col 4)
kj8 = R((vj8) => {
    Object.defineProperty(vj8, "__esModule", {
        value: !0
    });
    vj8.readFile = vj8.fileIntercept = vj8.filePromises = void 0;
    var SRK = h1("node:fs/promises");
    vj8.filePromises = {};
    vj8.fileIntercept = {};
    var hRK = (A, q) => {
        if (vj8.fileIntercept[A] !== void 0) return vj8.fileIntercept[A];
        if (!vj8.filePromises[A] || q?.ignoreCache) vj8.filePromises[A] = (0, SRK.readFile)(A, "utf8");
        return vj8.filePromises[A]
    };
    vj8.readFile = hRK
})
// @from(Ln 63833, Col 4)
Ob = R((ZA1) => {
    var EE1 = wp6(),
        Lj8 = Hp6(),
        Pp6 = Nj8(),
        Ae1 = h1("path"),
        qe1 = Tj8(),
        CH1 = kj8(),
        yj8 = "AWS_PROFILE",
        Cj8 = "default",
        IRK = (A) => A.profile || process.env[yj8] || Cj8,
        GA1 = ".",
        xRK = (A) => Object.entries(A).filter(([q]) => {
            let K = q.indexOf(GA1);
            if (K === -1) return !1;
            return Object.values(qe1.IniSectionType).includes(q.substring(0, K))
        }).reduce((q, [K, Y]) => {
            let z = K.indexOf(GA1),
                w = K.substring(0, z) === qe1.IniSectionType.PROFILE ? K.substring(z + 1) : K;
            return q[w] = Y, q
        }, {
            ...A.default && {
                default: A.default
            }
        }),
        bRK = "AWS_CONFIG_FILE",
        Sj8 = () => process.env[bRK] || Ae1.join(EE1.getHomeDir(), ".aws", "config"),
        uRK = "AWS_SHARED_CREDENTIALS_FILE",
        BRK = () => process.env[uRK] || Ae1.join(EE1.getHomeDir(), ".aws", "credentials"),
        mRK = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/,
        FRK = ["__proto__", "profile __proto__"],
        Wp6 = (A) => {
            let q = {},
                K, Y;
            for (let z of A.split(/\r?\n/)) {
                let w = z.split(/(^|\s)[;#]/)[0].trim();
                if (w[0] === "[" && w[w.length - 1] === "]") {
                    K = void 0, Y = void 0;
                    let $ = w.substring(1, w.length - 1),
                        O = mRK.exec($);
                    if (O) {
                        let [, _, , J] = O;
                        if (Object.values(qe1.IniSectionType).includes(_)) K = [_, J].join(GA1)
                    } else K = $;
                    if (FRK.includes($)) throw Error(`Found invalid profile name "${$}"`)
                } else if (K) {
                    let $ = w.indexOf("=");
                    if (![0, -1].includes($)) {
                        let [O, _] = [w.substring(0, $).trim(), w.substring($ + 1).trim()];
                        if (_ === "") Y = O;
                        else {
                            if (Y && z.trimStart() === z) Y = void 0;
                            q[K] = q[K] || {};
                            let J = Y ? [Y, O].join(GA1) : O;
                            q[K][J] = _
                        }
                    }
                }
            }
            return q
        },
        Rj8 = () => ({}),
        hj8 = async (A = {}) => {
            let {
                filepath: q = BRK(),
                configFilepath: K = Sj8()
            } = A, Y = EE1.getHomeDir(), z = "~/", w = q;
            if (q.startsWith("~/")) w = Ae1.join(Y, q.slice(2));
            let H = K;
            if (K.startsWith("~/")) H = Ae1.join(Y, K.slice(2));
            let $ = await Promise.all([CH1.readFile(H, {
                ignoreCache: A.ignoreCache
            }).then(Wp6).then(xRK).catch(Rj8), CH1.readFile(w, {
                ignoreCache: A.ignoreCache
            }).then(Wp6).catch(Rj8)]);
            return {
                configFile: $[0],
                credentialsFile: $[1]
            }
        }, QRK = (A) => Object.entries(A).filter(([q]) => q.startsWith(qe1.IniSectionType.SSO_SESSION + GA1)).reduce((q, [K, Y]) => ({
            ...q,
            [K.substring(K.indexOf(GA1) + 1)]: Y
        }), {}), gRK = () => ({}), URK = async (A = {}) => CH1.readFile(A.configFilepath ?? Sj8()).then(Wp6).then(QRK).catch(gRK), pRK = (...A) => {
            let q = {};
            for (let K of A)
                for (let [Y, z] of Object.entries(K))
                    if (q[Y] !== void 0) Object.assign(q[Y], z);
                    else q[Y] = z;
            return q
        }, dRK = async (A) => {
            let q = await hj8(A);
            return pRK(q.configFile, q.credentialsFile)
        }, cRK = {
            getFileRecord() {
                return CH1.fileIntercept
            },
            interceptFile(A, q) {
                CH1.fileIntercept[A] = Promise.resolve(q)
            },
            getTokenRecord() {
                return Pp6.tokenIntercept
            },
            interceptToken(A, q) {
                Pp6.tokenIntercept[A] = q
            }
        };
    Object.defineProperty(ZA1, "getSSOTokenFromFile", {
        enumerable: !0,
        get: function() {
            return Pp6.getSSOTokenFromFile
        }
    });
    Object.defineProperty(ZA1, "readFile", {
        enumerable: !0,
        get: function() {
            return CH1.readFile
        }
    });
    ZA1.CONFIG_PREFIX_SEPARATOR = GA1;
    ZA1.DEFAULT_PROFILE = Cj8;
    ZA1.ENV_PROFILE = yj8;
    ZA1.externalDataInterceptor = cRK;
    ZA1.getProfileName = IRK;
    ZA1.loadSharedConfigFiles = hj8;
    ZA1.loadSsoSessionData = URK;
    ZA1.parseKnownFiles = dRK;
    Object.keys(EE1).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZA1, A)) Object.defineProperty(ZA1, A, {
            enumerable: !0,
            get: function() {
                return EE1[A]
            }
        })
    });
    Object.keys(Lj8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZA1, A)) Object.defineProperty(ZA1, A, {
            enumerable: !0,
            get: function() {
                return Lj8[A]
            }
        })
    })
})
// @from(Ln 63975, Col 4)
af = R((zyK) => {
    var kE1 = wX(),
        Ij8 = Ob();

    function xj8(A) {
        try {
            let q = new Set(Array.from(A.match(/([A-Z_]){3,}/g) ?? []));
            return q.delete("CONFIG"), q.delete("CONFIG_PREFIX_SEPARATOR"), q.delete("ENV"), [...q].join(", ")
        } catch (q) {
            return A
        }
    }
    var eRK = (A, q) => async () => {
        try {
            let K = A(process.env, q);
            if (K === void 0) throw Error();
            return K
        } catch (K) {
            throw new kE1.CredentialsProviderError(K.message || `Not found in ENV: ${xj8(A.toString())}`, {
                logger: q?.logger
            })
        }
    }, AyK = (A, {
        preferredFile: q = "config",
        ...K
    } = {}) => async () => {
        let Y = Ij8.getProfileName(K),
            {
                configFile: z,
                credentialsFile: w
            } = await Ij8.loadSharedConfigFiles(K),
            H = w[Y] || {},
            $ = z[Y] || {},
            O = q === "config" ? {
                ...H,
                ...$
            } : {
                ...$,
                ...H
            };
        try {
            let J = A(O, q === "config" ? z : w);
            if (J === void 0) throw Error();
            return J
        } catch (_) {
            throw new kE1.CredentialsProviderError(_.message || `Not found in config files w/ profile [${Y}]: ${xj8(A.toString())}`, {
                logger: K.logger
            })
        }
    }, qyK = (A) => typeof A === "function", KyK = (A) => qyK(A) ? async () => await A(): kE1.fromStatic(A), YyK = ({
        environmentVariableSelector: A,
        configFileSelector: q,
        default: K
    }, Y = {}) => {
        let {
            signingName: z,
            logger: w
        } = Y, H = {
            signingName: z,
            logger: w
        };
        return kE1.memoize(kE1.chain(eRK(A, H), AyK(q, Y), KyK(K)))
    };
    zyK.loadConfig = YyK
})
// @from(Ln 64040, Col 4)
Qj8 = R((mj8) => {
    Object.defineProperty(mj8, "__esModule", {
        value: !0
    });
    mj8.getEndpointUrlConfig = void 0;
    var bj8 = Ob(),
        uj8 = "AWS_ENDPOINT_URL",
        Bj8 = "endpoint_url",
        HyK = (A) => ({
            environmentVariableSelector: (q) => {
                let K = A.split(" ").map((w) => w.toUpperCase()),
                    Y = q[[uj8, ...K].join("_")];
                if (Y) return Y;
                let z = q[uj8];
                if (z) return z;
                return
            },
            configFileSelector: (q, K) => {
                if (K && q.services) {
                    let z = K[["services", q.services].join(bj8.CONFIG_PREFIX_SEPARATOR)];
                    if (z) {
                        let w = A.split(" ").map(($) => $.toLowerCase()),
                            H = z[[w.join("_"), Bj8].join(bj8.CONFIG_PREFIX_SEPARATOR)];
                        if (H) return H
                    }
                }
                let Y = q[Bj8];
                if (Y) return Y;
                return
            },
            default: void 0
        });
    mj8.getEndpointUrlConfig = HyK
})
// @from(Ln 64074, Col 4)
pj8 = R((gj8) => {
    Object.defineProperty(gj8, "__esModule", {
        value: !0
    });
    gj8.getEndpointFromConfig = void 0;
    var $yK = af(),
        OyK = Qj8(),
        _yK = async (A) => (0, $yK.loadConfig)((0, OyK.getEndpointUrlConfig)(A ?? ""))();
    gj8.getEndpointFromConfig = _yK
})