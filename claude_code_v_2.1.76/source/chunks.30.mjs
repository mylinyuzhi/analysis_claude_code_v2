
// @from(Ln 73461, Col 4)
te1 = x((Gj6) => {
    var ydA = Pu(),
        ae1 = pT(),
        ne1 = Et1(),
        w75 = dO(),
        kdA = FT();
    class LdA {
        config;
        middlewareStack = ydA.constructStack();
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
    var ie1 = "***SensitiveInformation***";

    function re1(A, q) {
        if (q == null) return q;
        let K = w75.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return ie1;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return ie1
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return ie1
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = re1(w, Y[_]);
            return z
        }
        return q
    }
    class se1 {
        middlewareStack = ydA.constructStack();
        schema;
        static classBuilder() {
            return new RdA
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
                    [ne1.SMITHY_CONTEXT_KEY]: {
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
    class RdA {
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
            return q = class extends se1 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? re1.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? re1.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var O75 = "***SensitiveInformation***",
        $75 = (A, q) => {
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
    class Zj6 extends Error {
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
            return Zj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === Zj6) return Zj6.isInstance(A);
            if (Zj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var hdA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        SdA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = j75(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw hdA(w, q)
        },
        H75 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                SdA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        j75 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        J75 = (A) => {
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
        EdA = !1,
        M75 = (A) => {
            if (A && !EdA && parseInt(A.substring(1, A.indexOf("."))) < 16) EdA = !0
        },
        D75 = (A) => {
            let q = [];
            for (let K in ne1.AlgorithmId) {
                let Y = ne1.AlgorithmId[K];
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
        X75 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        P75 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        W75 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        CdA = (A) => {
            return Object.assign(D75(A), P75(A))
        },
        Z75 = CdA,
        G75 = (A) => {
            return Object.assign(X75(A), W75(A))
        },
        f75 = (A) => Array.isArray(A) ? A : [A],
        IdA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = IdA(A[K]);
            return A
        },
        T75 = (A) => {
            return A != null
        };
    class bdA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function xdA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, V75(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            udA(Y, null, _, w)
        }
        return Y
    }
    var v75 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        N75 = (A, q) => {
            let K = {};
            for (let Y in q) udA(K, A, q, Y);
            return K
        },
        V75 = (A, q, K) => {
            return xdA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        udA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = k75, $ = E75, H = Y] = w;
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
        k75 = (A) => A != null,
        E75 = (A) => A,
        y75 = (A) => {
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
        L75 = (A) => A.toISOString().replace(".000Z", "Z"),
        oe1 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(oe1);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = oe1(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Gj6, "collectBody", {
        enumerable: !0,
        get: function() {
            return ae1.collectBody
        }
    });
    Object.defineProperty(Gj6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return ae1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Gj6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return ae1.resolvedPath
        }
    });
    Gj6.Client = LdA;
    Gj6.Command = se1;
    Gj6.NoOpLogger = bdA;
    Gj6.SENSITIVE_STRING = O75;
    Gj6.ServiceException = Zj6;
    Gj6._json = oe1;
    Gj6.convertMap = v75;
    Gj6.createAggregatedClient = $75;
    Gj6.decorateServiceException = hdA;
    Gj6.emitWarningIfUnsupportedVersion = M75;
    Gj6.getArrayIfSingleItem = f75;
    Gj6.getDefaultClientConfiguration = Z75;
    Gj6.getDefaultExtensionConfiguration = CdA;
    Gj6.getValueFromTextNode = IdA;
    Gj6.isSerializableHeaderValue = T75;
    Gj6.loadConfigsForDefaultMode = J75;
    Gj6.map = xdA;
    Gj6.resolveDefaultRuntimeConfig = G75;
    Gj6.serializeDateTime = L75;
    Gj6.serializeFloat = y75;
    Gj6.take = N75;
    Gj6.throwDefaultError = SdA;
    Gj6.withBaseException = H75;
    Object.keys(kdA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Gj6, A)) Object.defineProperty(Gj6, A, {
            enumerable: !0,
            get: function() {
                return kdA[A]
            }
        })
    })
})
// @from(Ln 73931, Col 4)
mdA = x((t75) => {
    var s75 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    t75.isArrayBuffer = s75
})
// @from(Ln 73935, Col 4)
A68 = x((Y45) => {
    var A45 = mdA(),
        ee1 = x6("buffer"),
        q45 = (A, q = 0, K = A.byteLength - q) => {
            if (!A45.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return ee1.Buffer.from(A, q, K)
        },
        K45 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? ee1.Buffer.from(A, q) : ee1.Buffer.from(A)
        };
    Y45.fromArrayBuffer = q45;
    Y45.fromString = K45
})
// @from(Ln 73949, Col 4)
FdA = x((BdA) => {
    Object.defineProperty(BdA, "__esModule", {
        value: !0
    });
    BdA.fromBase64 = void 0;
    var w45 = A68(),
        O45 = /^[A-Za-z0-9+/]*={0,2}$/,
        $45 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!O45.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, w45.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    BdA.fromBase64 = $45
})
// @from(Ln 73964, Col 4)
UdA = x((pdA) => {
    Object.defineProperty(pdA, "__esModule", {
        value: !0
    });
    pdA.toBase64 = void 0;
    var H45 = A68(),
        j45 = C_(),
        J45 = (A) => {
            let q;
            if (typeof A === "string") q = (0, j45.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, H45.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    pdA.toBase64 = J45
})
// @from(Ln 73980, Col 4)
q68 = x((MS6) => {
    var ddA = FdA(),
        cdA = UdA();
    Object.keys(ddA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(MS6, A)) Object.defineProperty(MS6, A, {
            enumerable: !0,
            get: function() {
                return ddA[A]
            }
        })
    });
    Object.keys(cdA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(MS6, A)) Object.defineProperty(MS6, A, {
            enumerable: !0,
            get: function() {
                return cdA[A]
            }
        })
    })
})
// @from(Ln 74000, Col 4)
idA = x((bj_, ldA) => {
    (() => {
        var A = {
                d: (j6, W6) => {
                    for (var n6 in W6) A.o(W6, n6) && !A.o(j6, n6) && Object.defineProperty(j6, n6, {
                        enumerable: !0,
                        get: W6[n6]
                    })
                },
                o: (j6, W6) => Object.prototype.hasOwnProperty.call(j6, W6),
                r: (j6) => {
                    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(j6, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(j6, "__esModule", {
                        value: !0
                    })
                }
            },
            q = {};
        A.r(q), A.d(q, {
            XMLBuilder: () => b6,
            XMLParser: () => D6,
            XMLValidator: () => K1
        });
        let K = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
            Y = new RegExp("^[" + K + "][" + K + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");

        function z(j6, W6) {
            let n6 = [],
                d6 = W6.exec(j6);
            for (; d6;) {
                let S6 = [];
                S6.startIndex = W6.lastIndex - d6[0].length;
                let g6 = d6.length;
                for (let D1 = 0; D1 < g6; D1++) S6.push(d6[D1]);
                n6.push(S6), d6 = W6.exec(j6)
            }
            return n6
        }
        let _ = function(j6) {
                return Y.exec(j6) != null
            },
            w = {
                allowBooleanAttributes: !1,
                unpairedTags: []
            };

        function O(j6, W6) {
            W6 = Object.assign({}, w, W6);
            let n6 = [],
                d6 = !1,
                S6 = !1;
            j6[0] === "\uFEFF" && (j6 = j6.substr(1));
            for (let g6 = 0; g6 < j6.length; g6++)
                if (j6[g6] === "<" && j6[g6 + 1] === "?") {
                    if (g6 += 2, g6 = H(j6, g6), g6.err) return g6
                } else {
                    if (j6[g6] !== "<") {
                        if ($(j6[g6])) continue;
                        return Z("InvalidChar", "char '" + j6[g6] + "' is not expected.", f(j6, g6))
                    } {
                        let D1 = g6;
                        if (g6++, j6[g6] === "!") {
                            g6 = j(j6, g6);
                            continue
                        } {
                            let J1 = !1;
                            j6[g6] === "/" && (J1 = !0, g6++);
                            let E1 = "";
                            for (; g6 < j6.length && j6[g6] !== ">" && j6[g6] !== " " && j6[g6] !== "\t" && j6[g6] !== `
` && j6[g6] !== "\r"; g6++) E1 += j6[g6];
                            if (E1 = E1.trim(), E1[E1.length - 1] === "/" && (E1 = E1.substring(0, E1.length - 1), g6--), !_(E1)) {
                                let n8;
                                return n8 = E1.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + E1 + "' is an invalid name.", Z("InvalidTag", n8, f(j6, g6))
                            }
                            let K8 = D(j6, g6);
                            if (K8 === !1) return Z("InvalidAttr", "Attributes for '" + E1 + "' have open quote.", f(j6, g6));
                            let e8 = K8.value;
                            if (g6 = K8.index, e8[e8.length - 1] === "/") {
                                let n8 = g6 - e8.length;
                                e8 = e8.substring(0, e8.length - 1);
                                let H7 = P(e8, W6);
                                if (H7 !== !0) return Z(H7.err.code, H7.err.msg, f(j6, n8 + H7.err.line));
                                d6 = !0
                            } else if (J1) {
                                if (!K8.tagClosed) return Z("InvalidTag", "Closing tag '" + E1 + "' doesn't have proper closing.", f(j6, g6));
                                if (e8.trim().length > 0) return Z("InvalidTag", "Closing tag '" + E1 + "' can't have attributes or invalid starting.", f(j6, D1));
                                if (n6.length === 0) return Z("InvalidTag", "Closing tag '" + E1 + "' has not been opened.", f(j6, D1));
                                {
                                    let n8 = n6.pop();
                                    if (E1 !== n8.tagName) {
                                        let H7 = f(j6, n8.tagStartPos);
                                        return Z("InvalidTag", "Expected closing tag '" + n8.tagName + "' (opened in line " + H7.line + ", col " + H7.col + ") instead of closing tag '" + E1 + "'.", f(j6, D1))
                                    }
                                    n6.length == 0 && (S6 = !0)
                                }
                            } else {
                                let n8 = P(e8, W6);
                                if (n8 !== !0) return Z(n8.err.code, n8.err.msg, f(j6, g6 - e8.length + n8.err.line));
                                if (S6 === !0) return Z("InvalidXml", "Multiple possible root nodes found.", f(j6, g6));
                                W6.unpairedTags.indexOf(E1) !== -1 || n6.push({
                                    tagName: E1,
                                    tagStartPos: D1
                                }), d6 = !0
                            }
                            for (g6++; g6 < j6.length; g6++)
                                if (j6[g6] === "<") {
                                    if (j6[g6 + 1] === "!") {
                                        g6++, g6 = j(j6, g6);
                                        continue
                                    }
                                    if (j6[g6 + 1] !== "?") break;
                                    if (g6 = H(j6, ++g6), g6.err) return g6
                                } else if (j6[g6] === "&") {
                                let n8 = W(j6, g6);
                                if (n8 == -1) return Z("InvalidChar", "char '&' is not expected.", f(j6, g6));
                                g6 = n8
                            } else if (S6 === !0 && !$(j6[g6])) return Z("InvalidXml", "Extra text at the end", f(j6, g6));
                            j6[g6] === "<" && g6--
                        }
                    }
                } return d6 ? n6.length == 1 ? Z("InvalidTag", "Unclosed tag '" + n6[0].tagName + "'.", f(j6, n6[0].tagStartPos)) : !(n6.length > 0) || Z("InvalidXml", "Invalid '" + JSON.stringify(n6.map((g6) => g6.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
                line: 1,
                col: 1
            }) : Z("InvalidXml", "Start tag expected.", 1)
        }

        function $(j6) {
            return j6 === " " || j6 === "\t" || j6 === `
` || j6 === "\r"
        }

        function H(j6, W6) {
            let n6 = W6;
            for (; W6 < j6.length; W6++)
                if (j6[W6] != "?" && j6[W6] != " ");
                else {
                    let d6 = j6.substr(n6, W6 - n6);
                    if (W6 > 5 && d6 === "xml") return Z("InvalidXml", "XML declaration allowed only at the start of the document.", f(j6, W6));
                    if (j6[W6] == "?" && j6[W6 + 1] == ">") {
                        W6++;
                        break
                    }
                } return W6
        }

        function j(j6, W6) {
            if (j6.length > W6 + 5 && j6[W6 + 1] === "-" && j6[W6 + 2] === "-") {
                for (W6 += 3; W6 < j6.length; W6++)
                    if (j6[W6] === "-" && j6[W6 + 1] === "-" && j6[W6 + 2] === ">") {
                        W6 += 2;
                        break
                    }
            } else if (j6.length > W6 + 8 && j6[W6 + 1] === "D" && j6[W6 + 2] === "O" && j6[W6 + 3] === "C" && j6[W6 + 4] === "T" && j6[W6 + 5] === "Y" && j6[W6 + 6] === "P" && j6[W6 + 7] === "E") {
                let n6 = 1;
                for (W6 += 8; W6 < j6.length; W6++)
                    if (j6[W6] === "<") n6++;
                    else if (j6[W6] === ">" && (n6--, n6 === 0)) break
            } else if (j6.length > W6 + 9 && j6[W6 + 1] === "[" && j6[W6 + 2] === "C" && j6[W6 + 3] === "D" && j6[W6 + 4] === "A" && j6[W6 + 5] === "T" && j6[W6 + 6] === "A" && j6[W6 + 7] === "[") {
                for (W6 += 8; W6 < j6.length; W6++)
                    if (j6[W6] === "]" && j6[W6 + 1] === "]" && j6[W6 + 2] === ">") {
                        W6 += 2;
                        break
                    }
            }
            return W6
        }
        let J = '"',
            M = "'";

        function D(j6, W6) {
            let n6 = "",
                d6 = "",
                S6 = !1;
            for (; W6 < j6.length; W6++) {
                if (j6[W6] === J || j6[W6] === M) d6 === "" ? d6 = j6[W6] : d6 !== j6[W6] || (d6 = "");
                else if (j6[W6] === ">" && d6 === "") {
                    S6 = !0;
                    break
                }
                n6 += j6[W6]
            }
            return d6 === "" && {
                value: n6,
                index: W6,
                tagClosed: S6
            }
        }
        let X = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");

        function P(j6, W6) {
            let n6 = z(j6, X),
                d6 = {};
            for (let S6 = 0; S6 < n6.length; S6++) {
                if (n6[S6][1].length === 0) return Z("InvalidAttr", "Attribute '" + n6[S6][2] + "' has no space in starting.", v(n6[S6]));
                if (n6[S6][3] !== void 0 && n6[S6][4] === void 0) return Z("InvalidAttr", "Attribute '" + n6[S6][2] + "' is without value.", v(n6[S6]));
                if (n6[S6][3] === void 0 && !W6.allowBooleanAttributes) return Z("InvalidAttr", "boolean attribute '" + n6[S6][2] + "' is not allowed.", v(n6[S6]));
                let g6 = n6[S6][2];
                if (!G(g6)) return Z("InvalidAttr", "Attribute '" + g6 + "' is an invalid name.", v(n6[S6]));
                if (d6.hasOwnProperty(g6)) return Z("InvalidAttr", "Attribute '" + g6 + "' is repeated.", v(n6[S6]));
                d6[g6] = 1
            }
            return !0
        }

        function W(j6, W6) {
            if (j6[++W6] === ";") return -1;
            if (j6[W6] === "#") return function(d6, S6) {
                let g6 = /\d/;
                for (d6[S6] === "x" && (S6++, g6 = /[\da-fA-F]/); S6 < d6.length; S6++) {
                    if (d6[S6] === ";") return S6;
                    if (!d6[S6].match(g6)) break
                }
                return -1
            }(j6, ++W6);
            let n6 = 0;
            for (; W6 < j6.length; W6++, n6++)
                if (!(j6[W6].match(/\w/) && n6 < 20)) {
                    if (j6[W6] === ";") break;
                    return -1
                } return W6
        }

        function Z(j6, W6, n6) {
            return {
                err: {
                    code: j6,
                    msg: W6,
                    line: n6.line || n6,
                    col: n6.col
                }
            }
        }

        function G(j6) {
            return _(j6)
        }

        function f(j6, W6) {
            let n6 = j6.substring(0, W6).split(/\r?\n/);
            return {
                line: n6.length,
                col: n6[n6.length - 1].length + 1
            }
        }

        function v(j6) {
            return j6.startIndex + j6[1].length
        }
        let N = {
                preserveOrder: !1,
                attributeNamePrefix: "@_",
                attributesGroupName: !1,
                textNodeName: "#text",
                ignoreAttributes: !0,
                removeNSPrefix: !1,
                allowBooleanAttributes: !1,
                parseTagValue: !0,
                parseAttributeValue: !1,
                trimValues: !0,
                cdataPropName: !1,
                numberParseOptions: {
                    hex: !0,
                    leadingZeros: !0,
                    eNotation: !0
                },
                tagValueProcessor: function(j6, W6) {
                    return W6
                },
                attributeValueProcessor: function(j6, W6) {
                    return W6
                },
                stopNodes: [],
                alwaysCreateTextNode: !1,
                isArray: () => !1,
                commentPropName: !1,
                unpairedTags: [],
                processEntities: !0,
                htmlEntities: !1,
                ignoreDeclaration: !1,
                ignorePiTags: !1,
                transformTagName: !1,
                transformAttributeName: !1,
                updateTag: function(j6, W6, n6) {
                    return j6
                },
                captureMetaData: !1
            },
            V;
        V = typeof Symbol != "function" ? "@@xmlMetadata" : Symbol("XML Node Metadata");
        class L {
            constructor(j6) {
                this.tagname = j6, this.child = [], this[":@"] = {}
            }
            add(j6, W6) {
                j6 === "__proto__" && (j6 = "#__proto__"), this.child.push({
                    [j6]: W6
                })
            }
            addChild(j6, W6) {
                j6.tagname === "__proto__" && (j6.tagname = "#__proto__"), j6[":@"] && Object.keys(j6[":@"]).length > 0 ? this.child.push({
                    [j6.tagname]: j6.child,
                    ":@": j6[":@"]
                }) : this.child.push({
                    [j6.tagname]: j6.child
                }), W6 !== void 0 && (this.child[this.child.length - 1][V] = {
                    startIndex: W6
                })
            }
            static getMetaDataSymbol() {
                return V
            }
        }

        function h(j6, W6) {
            let n6 = {};
            if (j6[W6 + 3] !== "O" || j6[W6 + 4] !== "C" || j6[W6 + 5] !== "T" || j6[W6 + 6] !== "Y" || j6[W6 + 7] !== "P" || j6[W6 + 8] !== "E") throw Error("Invalid Tag instead of DOCTYPE");
            {
                W6 += 9;
                let d6 = 1,
                    S6 = !1,
                    g6 = !1,
                    D1 = "";
                for (; W6 < j6.length; W6++)
                    if (j6[W6] !== "<" || g6)
                        if (j6[W6] === ">") {
                            if (g6 ? j6[W6 - 1] === "-" && j6[W6 - 2] === "-" && (g6 = !1, d6--) : d6--, d6 === 0) break
                        } else j6[W6] === "[" ? S6 = !0 : D1 += j6[W6];
                else {
                    if (S6 && b(j6, "!ENTITY", W6)) {
                        let J1, E1;
                        W6 += 7, [J1, E1, W6] = u(j6, W6 + 1), E1.indexOf("&") === -1 && (n6[J1] = {
                            regx: RegExp(`&${J1};`, "g"),
                            val: E1
                        })
                    } else if (S6 && b(j6, "!ELEMENT", W6)) {
                        W6 += 8;
                        let {
                            index: J1
                        } = B(j6, W6 + 1);
                        W6 = J1
                    } else if (S6 && b(j6, "!ATTLIST", W6)) W6 += 8;
                    else if (S6 && b(j6, "!NOTATION", W6)) {
                        W6 += 9;
                        let {
                            index: J1
                        } = I(j6, W6 + 1);
                        W6 = J1
                    } else {
                        if (!b(j6, "!--", W6)) throw Error("Invalid DOCTYPE");
                        g6 = !0
                    }
                    d6++, D1 = ""
                }
                if (d6 !== 0) throw Error("Unclosed DOCTYPE")
            }
            return {
                entities: n6,
                i: W6
            }
        }
        let R = (j6, W6) => {
            for (; W6 < j6.length && /\s/.test(j6[W6]);) W6++;
            return W6
        };

        function u(j6, W6) {
            W6 = R(j6, W6);
            let n6 = "";
            for (; W6 < j6.length && !/\s/.test(j6[W6]) && j6[W6] !== '"' && j6[W6] !== "'";) n6 += j6[W6], W6++;
            if (p(n6), W6 = R(j6, W6), j6.substring(W6, W6 + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
            if (j6[W6] === "%") throw Error("Parameter entities are not supported");
            let d6 = "";
            return [W6, d6] = g(j6, W6, "entity"), [n6, d6, --W6]
        }

        function I(j6, W6) {
            W6 = R(j6, W6);
            let n6 = "";
            for (; W6 < j6.length && !/\s/.test(j6[W6]);) n6 += j6[W6], W6++;
            p(n6), W6 = R(j6, W6);
            let d6 = j6.substring(W6, W6 + 6).toUpperCase();
            if (d6 !== "SYSTEM" && d6 !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${d6}"`);
            W6 += d6.length, W6 = R(j6, W6);
            let S6 = null,
                g6 = null;
            if (d6 === "PUBLIC")[W6, S6] = g(j6, W6, "publicIdentifier"), j6[W6 = R(j6, W6)] !== '"' && j6[W6] !== "'" || ([W6, g6] = g(j6, W6, "systemIdentifier"));
            else if (d6 === "SYSTEM" && ([W6, g6] = g(j6, W6, "systemIdentifier"), !g6)) throw Error("Missing mandatory system identifier for SYSTEM notation");
            return {
                notationName: n6,
                publicIdentifier: S6,
                systemIdentifier: g6,
                index: --W6
            }
        }

        function g(j6, W6, n6) {
            let d6 = "",
                S6 = j6[W6];
            if (S6 !== '"' && S6 !== "'") throw Error(`Expected quoted string, found "${S6}"`);
            for (W6++; W6 < j6.length && j6[W6] !== S6;) d6 += j6[W6], W6++;
            if (j6[W6] !== S6) throw Error(`Unterminated ${n6} value`);
            return [++W6, d6]
        }

        function B(j6, W6) {
            W6 = R(j6, W6);
            let n6 = "";
            for (; W6 < j6.length && !/\s/.test(j6[W6]);) n6 += j6[W6], W6++;
            if (!p(n6)) throw Error(`Invalid element name: "${n6}"`);
            let d6 = "";
            if (j6[W6 = R(j6, W6)] === "E" && b(j6, "MPTY", W6)) W6 += 4;
            else if (j6[W6] === "A" && b(j6, "NY", W6)) W6 += 2;
            else {
                if (j6[W6] !== "(") throw Error(`Invalid Element Expression, found "${j6[W6]}"`);
                for (W6++; W6 < j6.length && j6[W6] !== ")";) d6 += j6[W6], W6++;
                if (j6[W6] !== ")") throw Error("Unterminated content model")
            }
            return {
                elementName: n6,
                contentModel: d6.trim(),
                index: W6
            }
        }

        function b(j6, W6, n6) {
            for (let d6 = 0; d6 < W6.length; d6++)
                if (W6[d6] !== j6[n6 + d6 + 1]) return !1;
            return !0
        }

        function p(j6) {
            if (_(j6)) return j6;
            throw Error(`Invalid entity name ${j6}`)
        }
        let Q = /^[-+]?0x[a-fA-F0-9]+$/,
            U = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/,
            r = {
                hex: !0,
                leadingZeros: !0,
                decimalPoint: ".",
                eNotation: !0
            },
            e = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;

        function Y6(j6) {
            return typeof j6 == "function" ? j6 : Array.isArray(j6) ? (W6) => {
                for (let n6 of j6) {
                    if (typeof n6 == "string" && W6 === n6) return !0;
                    if (n6 instanceof RegExp && n6.test(W6)) return !0
                }
            } : () => !1
        }
        class H6 {
            constructor(j6) {
                this.options = j6, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
                    apos: {
                        regex: /&(apos|#39|#x27);/g,
                        val: "'"
                    },
                    gt: {
                        regex: /&(gt|#62|#x3E);/g,
                        val: ">"
                    },
                    lt: {
                        regex: /&(lt|#60|#x3C);/g,
                        val: "<"
                    },
                    quot: {
                        regex: /&(quot|#34|#x22);/g,
                        val: '"'
                    }
                }, this.ampEntity = {
                    regex: /&(amp|#38|#x26);/g,
                    val: "&"
                }, this.htmlEntities = {
                    space: {
                        regex: /&(nbsp|#160);/g,
                        val: " "
                    },
                    cent: {
                        regex: /&(cent|#162);/g,
                        val: "¢"
                    },
                    pound: {
                        regex: /&(pound|#163);/g,
                        val: "£"
                    },
                    yen: {
                        regex: /&(yen|#165);/g,
                        val: "¥"
                    },
                    euro: {
                        regex: /&(euro|#8364);/g,
                        val: "€"
                    },
                    copyright: {
                        regex: /&(copy|#169);/g,
                        val: "©"
                    },
                    reg: {
                        regex: /&(reg|#174);/g,
                        val: "®"
                    },
                    inr: {
                        regex: /&(inr|#8377);/g,
                        val: "₹"
                    },
                    num_dec: {
                        regex: /&#([0-9]{1,7});/g,
                        val: (W6, n6) => String.fromCodePoint(Number.parseInt(n6, 10))
                    },
                    num_hex: {
                        regex: /&#x([0-9a-fA-F]{1,6});/g,
                        val: (W6, n6) => String.fromCodePoint(Number.parseInt(n6, 16))
                    }
                }, this.addExternalEntities = J6, this.parseXml = N6, this.parseTextData = K6, this.resolveNameSpace = s, this.buildAttributesMap = z6, this.isItStopNode = a, this.replaceEntitiesValue = n, this.readStopNodeData = q6, this.saveTextToParentTag = o, this.addChild = $6, this.ignoreAttributesFn = Y6(this.options.ignoreAttributes)
            }
        }

        function J6(j6) {
            let W6 = Object.keys(j6);
            for (let n6 = 0; n6 < W6.length; n6++) {
                let d6 = W6[n6];
                this.lastEntities[d6] = {
                    regex: new RegExp("&" + d6 + ";", "g"),
                    val: j6[d6]
                }
            }
        }

        function K6(j6, W6, n6, d6, S6, g6, D1) {
            if (j6 !== void 0 && (this.options.trimValues && !d6 && (j6 = j6.trim()), j6.length > 0)) {
                D1 || (j6 = this.replaceEntitiesValue(j6));
                let J1 = this.options.tagValueProcessor(W6, j6, n6, S6, g6);
                return J1 == null ? j6 : typeof J1 != typeof j6 || J1 !== j6 ? J1 : this.options.trimValues || j6.trim() === j6 ? w6(j6, this.options.parseTagValue, this.options.numberParseOptions) : j6
            }
        }

        function s(j6) {
            if (this.options.removeNSPrefix) {
                let W6 = j6.split(":"),
                    n6 = j6.charAt(0) === "/" ? "/" : "";
                if (W6[0] === "xmlns") return "";
                W6.length === 2 && (j6 = n6 + W6[1])
            }
            return j6
        }
        let X6 = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");

        function z6(j6, W6, n6) {
            if (this.options.ignoreAttributes !== !0 && typeof j6 == "string") {
                let d6 = z(j6, X6),
                    S6 = d6.length,
                    g6 = {};
                for (let D1 = 0; D1 < S6; D1++) {
                    let J1 = this.resolveNameSpace(d6[D1][1]);
                    if (this.ignoreAttributesFn(J1, W6)) continue;
                    let E1 = d6[D1][4],
                        K8 = this.options.attributeNamePrefix + J1;
                    if (J1.length)
                        if (this.options.transformAttributeName && (K8 = this.options.transformAttributeName(K8)), K8 === "__proto__" && (K8 = "#__proto__"), E1 !== void 0) {
                            this.options.trimValues && (E1 = E1.trim()), E1 = this.replaceEntitiesValue(E1);
                            let e8 = this.options.attributeValueProcessor(J1, E1, W6);
                            g6[K8] = e8 == null ? E1 : typeof e8 != typeof E1 || e8 !== E1 ? e8 : w6(E1, this.options.parseAttributeValue, this.options.numberParseOptions)
                        } else this.options.allowBooleanAttributes && (g6[K8] = !0)
                }
                if (!Object.keys(g6).length) return;
                if (this.options.attributesGroupName) {
                    let D1 = {};
                    return D1[this.options.attributesGroupName] = g6, D1
                }
                return g6
            }
        }
        let N6 = function(j6) {
            j6 = j6.replace(/\r\n?/g, `
`);
            let W6 = new L("!xml"),
                n6 = W6,
                d6 = "",
                S6 = "";
            for (let g6 = 0; g6 < j6.length; g6++)
                if (j6[g6] === "<")
                    if (j6[g6 + 1] === "/") {
                        let D1 = i(j6, ">", g6, "Closing Tag is not closed."),
                            J1 = j6.substring(g6 + 2, D1).trim();
                        if (this.options.removeNSPrefix) {
                            let e8 = J1.indexOf(":");
                            e8 !== -1 && (J1 = J1.substr(e8 + 1))
                        }
                        this.options.transformTagName && (J1 = this.options.transformTagName(J1)), n6 && (d6 = this.saveTextToParentTag(d6, n6, S6));
                        let E1 = S6.substring(S6.lastIndexOf(".") + 1);
                        if (J1 && this.options.unpairedTags.indexOf(J1) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${J1}>`);
                        let K8 = 0;
                        E1 && this.options.unpairedTags.indexOf(E1) !== -1 ? (K8 = S6.lastIndexOf(".", S6.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : K8 = S6.lastIndexOf("."), S6 = S6.substring(0, K8), n6 = this.tagsNodeStack.pop(), d6 = "", g6 = D1
                    } else if (j6[g6 + 1] === "?") {
                let D1 = l(j6, g6, !1, "?>");
                if (!D1) throw Error("Pi Tag is not closed.");
                if (d6 = this.saveTextToParentTag(d6, n6, S6), this.options.ignoreDeclaration && D1.tagName === "?xml" || this.options.ignorePiTags);
                else {
                    let J1 = new L(D1.tagName);
                    J1.add(this.options.textNodeName, ""), D1.tagName !== D1.tagExp && D1.attrExpPresent && (J1[":@"] = this.buildAttributesMap(D1.tagExp, S6, D1.tagName)), this.addChild(n6, J1, S6, g6)
                }
                g6 = D1.closeIndex + 1
            } else if (j6.substr(g6 + 1, 3) === "!--") {
                let D1 = i(j6, "-->", g6 + 4, "Comment is not closed.");
                if (this.options.commentPropName) {
                    let J1 = j6.substring(g6 + 4, D1 - 2);
                    d6 = this.saveTextToParentTag(d6, n6, S6), n6.add(this.options.commentPropName, [{
                        [this.options.textNodeName]: J1
                    }])
                }
                g6 = D1
            } else if (j6.substr(g6 + 1, 2) === "!D") {
                let D1 = h(j6, g6);
                this.docTypeEntities = D1.entities, g6 = D1.i
            } else if (j6.substr(g6 + 1, 2) === "![") {
                let D1 = i(j6, "]]>", g6, "CDATA is not closed.") - 2,
                    J1 = j6.substring(g6 + 9, D1);
                d6 = this.saveTextToParentTag(d6, n6, S6);
                let E1 = this.parseTextData(J1, n6.tagname, S6, !0, !1, !0, !0);
                E1 == null && (E1 = ""), this.options.cdataPropName ? n6.add(this.options.cdataPropName, [{
                    [this.options.textNodeName]: J1
                }]) : n6.add(this.options.textNodeName, E1), g6 = D1 + 2
            } else {
                let D1 = l(j6, g6, this.options.removeNSPrefix),
                    J1 = D1.tagName,
                    E1 = D1.rawTagName,
                    K8 = D1.tagExp,
                    e8 = D1.attrExpPresent,
                    n8 = D1.closeIndex;
                this.options.transformTagName && (J1 = this.options.transformTagName(J1)), n6 && d6 && n6.tagname !== "!xml" && (d6 = this.saveTextToParentTag(d6, n6, S6, !1));
                let H7 = n6;
                H7 && this.options.unpairedTags.indexOf(H7.tagname) !== -1 && (n6 = this.tagsNodeStack.pop(), S6 = S6.substring(0, S6.lastIndexOf("."))), J1 !== W6.tagname && (S6 += S6 ? "." + J1 : J1);
                let GA = g6;
                if (this.isItStopNode(this.options.stopNodes, S6, J1)) {
                    let h8 = "";
                    if (K8.length > 0 && K8.lastIndexOf("/") === K8.length - 1) J1[J1.length - 1] === "/" ? (J1 = J1.substr(0, J1.length - 1), S6 = S6.substr(0, S6.length - 1), K8 = J1) : K8 = K8.substr(0, K8.length - 1), g6 = D1.closeIndex;
                    else if (this.options.unpairedTags.indexOf(J1) !== -1) g6 = D1.closeIndex;
                    else {
                        let P4 = this.readStopNodeData(j6, E1, n8 + 1);
                        if (!P4) throw Error(`Unexpected end of ${E1}`);
                        g6 = P4.i, h8 = P4.tagContent
                    }
                    let U8 = new L(J1);
                    J1 !== K8 && e8 && (U8[":@"] = this.buildAttributesMap(K8, S6, J1)), h8 && (h8 = this.parseTextData(h8, J1, S6, !0, e8, !0, !0)), S6 = S6.substr(0, S6.lastIndexOf(".")), U8.add(this.options.textNodeName, h8), this.addChild(n6, U8, S6, GA)
                } else {
                    if (K8.length > 0 && K8.lastIndexOf("/") === K8.length - 1) {
                        J1[J1.length - 1] === "/" ? (J1 = J1.substr(0, J1.length - 1), S6 = S6.substr(0, S6.length - 1), K8 = J1) : K8 = K8.substr(0, K8.length - 1), this.options.transformTagName && (J1 = this.options.transformTagName(J1));
                        let h8 = new L(J1);
                        J1 !== K8 && e8 && (h8[":@"] = this.buildAttributesMap(K8, S6, J1)), this.addChild(n6, h8, S6, GA), S6 = S6.substr(0, S6.lastIndexOf("."))
                    } else {
                        let h8 = new L(J1);
                        this.tagsNodeStack.push(n6), J1 !== K8 && e8 && (h8[":@"] = this.buildAttributesMap(K8, S6, J1)), this.addChild(n6, h8, S6, GA), n6 = h8
                    }
                    d6 = "", g6 = n8
                }
            } else d6 += j6[g6];
            return W6.child
        };

        function $6(j6, W6, n6, d6) {
            this.options.captureMetaData || (d6 = void 0);
            let S6 = this.options.updateTag(W6.tagname, n6, W6[":@"]);
            S6 === !1 || (typeof S6 == "string" ? (W6.tagname = S6, j6.addChild(W6, d6)) : j6.addChild(W6, d6))
        }
        let n = function(j6) {
            if (this.options.processEntities) {
                for (let W6 in this.docTypeEntities) {
                    let n6 = this.docTypeEntities[W6];
                    j6 = j6.replace(n6.regx, n6.val)
                }
                for (let W6 in this.lastEntities) {
                    let n6 = this.lastEntities[W6];
                    j6 = j6.replace(n6.regex, n6.val)
                }
                if (this.options.htmlEntities)
                    for (let W6 in this.htmlEntities) {
                        let n6 = this.htmlEntities[W6];
                        j6 = j6.replace(n6.regex, n6.val)
                    }
                j6 = j6.replace(this.ampEntity.regex, this.ampEntity.val)
            }
            return j6
        };

        function o(j6, W6, n6, d6) {
            return j6 && (d6 === void 0 && (d6 = W6.child.length === 0), (j6 = this.parseTextData(j6, W6.tagname, n6, !1, !!W6[":@"] && Object.keys(W6[":@"]).length !== 0, d6)) !== void 0 && j6 !== "" && W6.add(this.options.textNodeName, j6), j6 = ""), j6
        }

        function a(j6, W6, n6) {
            let d6 = "*." + n6;
            for (let S6 in j6) {
                let g6 = j6[S6];
                if (d6 === g6 || W6 === g6) return !0
            }
            return !1
        }

        function i(j6, W6, n6, d6) {
            let S6 = j6.indexOf(W6, n6);
            if (S6 === -1) throw Error(d6);
            return S6 + W6.length - 1
        }

        function l(j6, W6, n6, d6 = ">") {
            let S6 = function(n8, H7, GA = ">") {
                let h8, U8 = "";
                for (let P4 = H7; P4 < n8.length; P4++) {
                    let T4 = n8[P4];
                    if (h8) T4 === h8 && (h8 = "");
                    else if (T4 === '"' || T4 === "'") h8 = T4;
                    else if (T4 === GA[0]) {
                        if (!GA[1]) return {
                            data: U8,
                            index: P4
                        };
                        if (n8[P4 + 1] === GA[1]) return {
                            data: U8,
                            index: P4
                        }
                    } else T4 === "\t" && (T4 = " ");
                    U8 += T4
                }
            }(j6, W6 + 1, d6);
            if (!S6) return;
            let {
                data: g6,
                index: D1
            } = S6, J1 = g6.search(/\s/), E1 = g6, K8 = !0;
            J1 !== -1 && (E1 = g6.substring(0, J1), g6 = g6.substring(J1 + 1).trimStart());
            let e8 = E1;
            if (n6) {
                let n8 = E1.indexOf(":");
                n8 !== -1 && (E1 = E1.substr(n8 + 1), K8 = E1 !== S6.data.substr(n8 + 1))
            }
            return {
                tagName: E1,
                tagExp: g6,
                closeIndex: D1,
                attrExpPresent: K8,
                rawTagName: e8
            }
        }

        function q6(j6, W6, n6) {
            let d6 = n6,
                S6 = 1;
            for (; n6 < j6.length; n6++)
                if (j6[n6] === "<")
                    if (j6[n6 + 1] === "/") {
                        let g6 = i(j6, ">", n6, `${W6} is not closed`);
                        if (j6.substring(n6 + 2, g6).trim() === W6 && (S6--, S6 === 0)) return {
                            tagContent: j6.substring(d6, n6),
                            i: g6
                        };
                        n6 = g6
                    } else if (j6[n6 + 1] === "?") n6 = i(j6, "?>", n6 + 1, "StopNode is not closed.");
            else if (j6.substr(n6 + 1, 3) === "!--") n6 = i(j6, "-->", n6 + 3, "StopNode is not closed.");
            else if (j6.substr(n6 + 1, 2) === "![") n6 = i(j6, "]]>", n6, "StopNode is not closed.") - 2;
            else {
                let g6 = l(j6, n6, ">");
                g6 && ((g6 && g6.tagName) === W6 && g6.tagExp[g6.tagExp.length - 1] !== "/" && S6++, n6 = g6.closeIndex)
            }
        }

        function w6(j6, W6, n6) {
            if (W6 && typeof j6 == "string") {
                let d6 = j6.trim();
                return d6 === "true" || d6 !== "false" && function(S6, g6 = {}) {
                    if (g6 = Object.assign({}, r, g6), !S6 || typeof S6 != "string") return S6;
                    let D1 = S6.trim();
                    if (g6.skipLike !== void 0 && g6.skipLike.test(D1)) return S6;
                    if (S6 === "0") return 0;
                    if (g6.hex && Q.test(D1)) return function(E1) {
                        if (parseInt) return parseInt(E1, 16);
                        if (Number.parseInt) return Number.parseInt(E1, 16);
                        if (window && window.parseInt) return window.parseInt(E1, 16);
                        throw Error("parseInt, Number.parseInt, window.parseInt are not supported")
                    }(D1);
                    if (D1.search(/.+[eE].+/) !== -1) return function(E1, K8, e8) {
                        if (!e8.eNotation) return E1;
                        let n8 = K8.match(e);
                        if (n8) {
                            let H7 = n8[1] || "",
                                GA = n8[3].indexOf("e") === -1 ? "E" : "e",
                                h8 = n8[2],
                                U8 = H7 ? E1[h8.length + 1] === GA : E1[h8.length] === GA;
                            return h8.length > 1 && U8 ? E1 : h8.length !== 1 || !n8[3].startsWith(`.${GA}`) && n8[3][0] !== GA ? e8.leadingZeros && !U8 ? (K8 = (n8[1] || "") + n8[3], Number(K8)) : E1 : Number(K8)
                        }
                        return E1
                    }(S6, D1, g6);
                    {
                        let E1 = U.exec(D1);
                        if (E1) {
                            let K8 = E1[1] || "",
                                e8 = E1[2],
                                n8 = (J1 = E1[3]) && J1.indexOf(".") !== -1 ? ((J1 = J1.replace(/0+$/, "")) === "." ? J1 = "0" : J1[0] === "." ? J1 = "0" + J1 : J1[J1.length - 1] === "." && (J1 = J1.substring(0, J1.length - 1)), J1) : J1,
                                H7 = K8 ? S6[e8.length + 1] === "." : S6[e8.length] === ".";
                            if (!g6.leadingZeros && (e8.length > 1 || e8.length === 1 && !H7)) return S6;
                            {
                                let GA = Number(D1),
                                    h8 = String(GA);
                                if (GA === 0 || GA === -0) return GA;
                                if (h8.search(/[eE]/) !== -1) return g6.eNotation ? GA : S6;
                                if (D1.indexOf(".") !== -1) return h8 === "0" || h8 === n8 || h8 === `${K8}${n8}` ? GA : S6;
                                let U8 = e8 ? n8 : D1;
                                return e8 ? U8 === h8 || K8 + U8 === h8 ? GA : S6 : U8 === h8 || U8 === K8 + h8 ? GA : S6
                            }
                        }
                        return S6
                    }
                    var J1
                }(j6, n6)
            }
            return j6 !== void 0 ? j6 : ""
        }
        let O6 = L.getMetaDataSymbol();

        function L6(j6, W6) {
            return y6(j6, W6)
        }

        function y6(j6, W6, n6) {
            let d6, S6 = {};
            for (let g6 = 0; g6 < j6.length; g6++) {
                let D1 = j6[g6],
                    J1 = G6(D1),
                    E1 = "";
                if (E1 = n6 === void 0 ? J1 : n6 + "." + J1, J1 === W6.textNodeName) d6 === void 0 ? d6 = D1[J1] : d6 += "" + D1[J1];
                else {
                    if (J1 === void 0) continue;
                    if (D1[J1]) {
                        let K8 = y6(D1[J1], W6, E1),
                            e8 = T6(K8, W6);
                        D1[O6] !== void 0 && (K8[O6] = D1[O6]), D1[":@"] ? R6(K8, D1[":@"], E1, W6) : Object.keys(K8).length !== 1 || K8[W6.textNodeName] === void 0 || W6.alwaysCreateTextNode ? Object.keys(K8).length === 0 && (W6.alwaysCreateTextNode ? K8[W6.textNodeName] = "" : K8 = "") : K8 = K8[W6.textNodeName], S6[J1] !== void 0 && S6.hasOwnProperty(J1) ? (Array.isArray(S6[J1]) || (S6[J1] = [S6[J1]]), S6[J1].push(K8)) : W6.isArray(J1, E1, e8) ? S6[J1] = [K8] : S6[J1] = K8
                    }
                }
            }
            return typeof d6 == "string" ? d6.length > 0 && (S6[W6.textNodeName] = d6) : d6 !== void 0 && (S6[W6.textNodeName] = d6), S6
        }

        function G6(j6) {
            let W6 = Object.keys(j6);
            for (let n6 = 0; n6 < W6.length; n6++) {
                let d6 = W6[n6];
                if (d6 !== ":@") return d6
            }
        }

        function R6(j6, W6, n6, d6) {
            if (W6) {
                let S6 = Object.keys(W6),
                    g6 = S6.length;
                for (let D1 = 0; D1 < g6; D1++) {
                    let J1 = S6[D1];
                    d6.isArray(J1, n6 + "." + J1, !0, !0) ? j6[J1] = [W6[J1]] : j6[J1] = W6[J1]
                }
            }
        }

        function T6(j6, W6) {
            let {
                textNodeName: n6
            } = W6, d6 = Object.keys(j6).length;
            return d6 === 0 || !(d6 !== 1 || !j6[n6] && typeof j6[n6] != "boolean" && j6[n6] !== 0)
        }
        class D6 {
            constructor(j6) {
                this.externalEntities = {}, this.options = function(W6) {
                    return Object.assign({}, N, W6)
                }(j6)
            }
            parse(j6, W6) {
                if (typeof j6 == "string");
                else {
                    if (!j6.toString) throw Error("XML data is accepted in String or Bytes[] form.");
                    j6 = j6.toString()
                }
                if (W6) {
                    W6 === !0 && (W6 = {});
                    let S6 = O(j6, W6);
                    if (S6 !== !0) throw Error(`${S6.err.msg}:${S6.err.line}:${S6.err.col}`)
                }
                let n6 = new H6(this.options);
                n6.addExternalEntities(this.externalEntities);
                let d6 = n6.parseXml(j6);
                return this.options.preserveOrder || d6 === void 0 ? d6 : L6(d6, this.options)
            }
            addEntity(j6, W6) {
                if (W6.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
                if (j6.indexOf("&") !== -1 || j6.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
                if (W6 === "&") throw Error("An entity with value '&' is not permitted");
                this.externalEntities[j6] = W6
            }
            static getMetaDataSymbol() {
                return L.getMetaDataSymbol()
            }
        }

        function Q6(j6, W6) {
            let n6 = "";
            return W6.format && W6.indentBy.length > 0 && (n6 = `
`), k6(j6, W6, "", n6)
        }

        function k6(j6, W6, n6, d6) {
            let S6 = "",
                g6 = !1;
            for (let D1 = 0; D1 < j6.length; D1++) {
                let J1 = j6[D1],
                    E1 = Z6(J1);
                if (E1 === void 0) continue;
                let K8 = "";
                if (K8 = n6.length === 0 ? E1 : `${n6}.${E1}`, E1 === W6.textNodeName) {
                    let GA = J1[E1];
                    C6(K8, W6) || (GA = W6.tagValueProcessor(E1, GA), GA = o6(GA, W6)), g6 && (S6 += d6), S6 += GA, g6 = !1;
                    continue
                }
                if (E1 === W6.cdataPropName) {
                    g6 && (S6 += d6), S6 += `<![CDATA[${J1[E1][0][W6.textNodeName]}]]>`, g6 = !1;
                    continue
                }
                if (E1 === W6.commentPropName) {
                    S6 += d6 + `<!--${J1[E1][0][W6.textNodeName]}-->`, g6 = !0;
                    continue
                }
                if (E1[0] === "?") {
                    let GA = u6(J1[":@"], W6),
                        h8 = E1 === "?xml" ? "" : d6,
                        U8 = J1[E1][0][W6.textNodeName];
                    U8 = U8.length !== 0 ? " " + U8 : "", S6 += h8 + `<${E1}${U8}${GA}?>`, g6 = !0;
                    continue
                }
                let e8 = d6;
                e8 !== "" && (e8 += W6.indentBy);
                let n8 = d6 + `<${E1}${u6(J1[":@"],W6)}`,
                    H7 = k6(J1[E1], W6, K8, e8);
                W6.unpairedTags.indexOf(E1) !== -1 ? W6.suppressUnpairedNode ? S6 += n8 + ">" : S6 += n8 + "/>" : H7 && H7.length !== 0 || !W6.suppressEmptyNode ? H7 && H7.endsWith(">") ? S6 += n8 + `>${H7}${d6}</${E1}>` : (S6 += n8 + ">", H7 && d6 !== "" && (H7.includes("/>") || H7.includes("</")) ? S6 += d6 + W6.indentBy + H7 + d6 : S6 += H7, S6 += `</${E1}>`) : S6 += n8 + "/>", g6 = !0
            }
            return S6
        }

        function Z6(j6) {
            let W6 = Object.keys(j6);
            for (let n6 = 0; n6 < W6.length; n6++) {
                let d6 = W6[n6];
                if (j6.hasOwnProperty(d6) && d6 !== ":@") return d6
            }
        }

        function u6(j6, W6) {
            let n6 = "";
            if (j6 && !W6.ignoreAttributes)
                for (let d6 in j6) {
                    if (!j6.hasOwnProperty(d6)) continue;
                    let S6 = W6.attributeValueProcessor(d6, j6[d6]);
                    S6 = o6(S6, W6), S6 === !0 && W6.suppressBooleanAttributes ? n6 += ` ${d6.substr(W6.attributeNamePrefix.length)}` : n6 += ` ${d6.substr(W6.attributeNamePrefix.length)}="${S6}"`
                }
            return n6
        }

        function C6(j6, W6) {
            let n6 = (j6 = j6.substr(0, j6.length - W6.textNodeName.length - 1)).substr(j6.lastIndexOf(".") + 1);
            for (let d6 in W6.stopNodes)
                if (W6.stopNodes[d6] === j6 || W6.stopNodes[d6] === "*." + n6) return !0;
            return !1
        }

        function o6(j6, W6) {
            if (j6 && j6.length > 0 && W6.processEntities)
                for (let n6 = 0; n6 < W6.entities.length; n6++) {
                    let d6 = W6.entities[n6];
                    j6 = j6.replace(d6.regex, d6.val)
                }
            return j6
        }
        let V6 = {
            attributeNamePrefix: "@_",
            attributesGroupName: !1,
            textNodeName: "#text",
            ignoreAttributes: !0,
            cdataPropName: !1,
            format: !1,
            indentBy: "  ",
            suppressEmptyNode: !1,
            suppressUnpairedNode: !0,
            suppressBooleanAttributes: !0,
            tagValueProcessor: function(j6, W6) {
                return W6
            },
            attributeValueProcessor: function(j6, W6) {
                return W6
            },
            preserveOrder: !1,
            commentPropName: !1,
            unpairedTags: [],
            entities: [{
                regex: new RegExp("&", "g"),
                val: "&amp;"
            }, {
                regex: new RegExp(">", "g"),
                val: "&gt;"
            }, {
                regex: new RegExp("<", "g"),
                val: "&lt;"
            }, {
                regex: new RegExp("'", "g"),
                val: "&apos;"
            }, {
                regex: new RegExp('"', "g"),
                val: "&quot;"
            }],
            processEntities: !0,
            stopNodes: [],
            oneListGroup: !1
        };

        function b6(j6) {
            this.options = Object.assign({}, V6, j6), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
                return !1
            } : (this.ignoreAttributesFn = Y6(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = c6), this.processTextOrObjNode = E6, this.options.format ? (this.indentate = U6, this.tagEndChar = `>
`, this.newLine = `
`) : (this.indentate = function() {
                return ""
            }, this.tagEndChar = ">", this.newLine = "")
        }

        function E6(j6, W6, n6, d6) {
            let S6 = this.j2x(j6, n6 + 1, d6.concat(W6));
            return j6[this.options.textNodeName] !== void 0 && Object.keys(j6).length === 1 ? this.buildTextValNode(j6[this.options.textNodeName], W6, S6.attrStr, n6) : this.buildObjectNode(S6.val, W6, S6.attrStr, n6)
        }

        function U6(j6) {
            return this.options.indentBy.repeat(j6)
        }

        function c6(j6) {
            return !(!j6.startsWith(this.options.attributeNamePrefix) || j6 === this.options.textNodeName) && j6.substr(this.attrPrefixLen)
        }
        b6.prototype.build = function(j6) {
            return this.options.preserveOrder ? Q6(j6, this.options) : (Array.isArray(j6) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (j6 = {
                [this.options.arrayNodeName]: j6
            }), this.j2x(j6, 0, []).val)
        }, b6.prototype.j2x = function(j6, W6, n6) {
            let d6 = "",
                S6 = "",
                g6 = n6.join(".");
            for (let D1 in j6)
                if (Object.prototype.hasOwnProperty.call(j6, D1))
                    if (j6[D1] === void 0) this.isAttribute(D1) && (S6 += "");
                    else if (j6[D1] === null) this.isAttribute(D1) || D1 === this.options.cdataPropName ? S6 += "" : D1[0] === "?" ? S6 += this.indentate(W6) + "<" + D1 + "?" + this.tagEndChar : S6 += this.indentate(W6) + "<" + D1 + "/" + this.tagEndChar;
            else if (j6[D1] instanceof Date) S6 += this.buildTextValNode(j6[D1], D1, "", W6);
            else if (typeof j6[D1] != "object") {
                let J1 = this.isAttribute(D1);
                if (J1 && !this.ignoreAttributesFn(J1, g6)) d6 += this.buildAttrPairStr(J1, "" + j6[D1]);
                else if (!J1)
                    if (D1 === this.options.textNodeName) {
                        let E1 = this.options.tagValueProcessor(D1, "" + j6[D1]);
                        S6 += this.replaceEntitiesValue(E1)
                    } else S6 += this.buildTextValNode(j6[D1], D1, "", W6)
            } else if (Array.isArray(j6[D1])) {
                let J1 = j6[D1].length,
                    E1 = "",
                    K8 = "";
                for (let e8 = 0; e8 < J1; e8++) {
                    let n8 = j6[D1][e8];
                    if (n8 === void 0);
                    else if (n8 === null) D1[0] === "?" ? S6 += this.indentate(W6) + "<" + D1 + "?" + this.tagEndChar : S6 += this.indentate(W6) + "<" + D1 + "/" + this.tagEndChar;
                    else if (typeof n8 == "object")
                        if (this.options.oneListGroup) {
                            let H7 = this.j2x(n8, W6 + 1, n6.concat(D1));
                            E1 += H7.val, this.options.attributesGroupName && n8.hasOwnProperty(this.options.attributesGroupName) && (K8 += H7.attrStr)
                        } else E1 += this.processTextOrObjNode(n8, D1, W6, n6);
                    else if (this.options.oneListGroup) {
                        let H7 = this.options.tagValueProcessor(D1, n8);
                        H7 = this.replaceEntitiesValue(H7), E1 += H7
                    } else E1 += this.buildTextValNode(n8, D1, "", W6)
                }
                this.options.oneListGroup && (E1 = this.buildObjectNode(E1, D1, K8, W6)), S6 += E1
            } else if (this.options.attributesGroupName && D1 === this.options.attributesGroupName) {
                let J1 = Object.keys(j6[D1]),
                    E1 = J1.length;
                for (let K8 = 0; K8 < E1; K8++) d6 += this.buildAttrPairStr(J1[K8], "" + j6[D1][J1[K8]])
            } else S6 += this.processTextOrObjNode(j6[D1], D1, W6, n6);
            return {
                attrStr: d6,
                val: S6
            }
        }, b6.prototype.buildAttrPairStr = function(j6, W6) {
            return W6 = this.options.attributeValueProcessor(j6, "" + W6), W6 = this.replaceEntitiesValue(W6), this.options.suppressBooleanAttributes && W6 === "true" ? " " + j6 : " " + j6 + '="' + W6 + '"'
        }, b6.prototype.buildObjectNode = function(j6, W6, n6, d6) {
            if (j6 === "") return W6[0] === "?" ? this.indentate(d6) + "<" + W6 + n6 + "?" + this.tagEndChar : this.indentate(d6) + "<" + W6 + n6 + this.closeTag(W6) + this.tagEndChar;
            {
                let S6 = "</" + W6 + this.tagEndChar,
                    g6 = "";
                return W6[0] === "?" && (g6 = "?", S6 = ""), !n6 && n6 !== "" || j6.indexOf("<") !== -1 ? this.options.commentPropName !== !1 && W6 === this.options.commentPropName && g6.length === 0 ? this.indentate(d6) + `<!--${j6}-->` + this.newLine : this.indentate(d6) + "<" + W6 + n6 + g6 + this.tagEndChar + j6 + this.indentate(d6) + S6 : this.indentate(d6) + "<" + W6 + n6 + g6 + ">" + j6 + S6
            }
        }, b6.prototype.closeTag = function(j6) {
            let W6 = "";
            return this.options.unpairedTags.indexOf(j6) !== -1 ? this.options.suppressUnpairedNode || (W6 = "/") : W6 = this.options.suppressEmptyNode ? "/" : `></${j6}`, W6
        }, b6.prototype.buildTextValNode = function(j6, W6, n6, d6) {
            if (this.options.cdataPropName !== !1 && W6 === this.options.cdataPropName) return this.indentate(d6) + `<![CDATA[${j6}]]>` + this.newLine;
            if (this.options.commentPropName !== !1 && W6 === this.options.commentPropName) return this.indentate(d6) + `<!--${j6}-->` + this.newLine;
            if (W6[0] === "?") return this.indentate(d6) + "<" + W6 + n6 + "?" + this.tagEndChar;
            {
                let S6 = this.options.tagValueProcessor(W6, j6);
                return S6 = this.replaceEntitiesValue(S6), S6 === "" ? this.indentate(d6) + "<" + W6 + n6 + this.closeTag(W6) + this.tagEndChar : this.indentate(d6) + "<" + W6 + n6 + ">" + S6 + "</" + W6 + this.tagEndChar
            }
        }, b6.prototype.replaceEntitiesValue = function(j6) {
            if (j6 && j6.length > 0 && this.options.processEntities)
                for (let W6 = 0; W6 < this.options.entities.length; W6++) {
                    let n6 = this.options.entities[W6];
                    j6 = j6.replace(n6.regex, n6.val)
                }
            return j6
        };
        let K1 = {
            validate: O
        };
        ldA.exports = q
    })()
})
// @from(Ln 75124, Col 4)
rdA = x((ndA) => {
    Object.defineProperty(ndA, "__esModule", {
        value: !0
    });
    ndA.parseXML = D45;
    var M45 = idA(),
        K68 = new M45.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: (A, q) => q.trim() === "" && q.includes(`
`) ? "" : void 0
        });
    K68.addEntity("#xD", "\r");
    K68.addEntity("#10", `
`);

    function D45(A) {
        return K68.parse(A, !0)
    }
})
// @from(Ln 75148, Col 4)
z68 = x((odA) => {
    var P45 = rdA();

    function W45(A) {
        return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }

    function Z45(A) {
        return A.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;")
    }
    class Y68 {
        value;
        constructor(A) {
            this.value = A
        }
        toString() {
            return Z45("" + this.value)
        }
    }
    class DS6 {
        name;
        children;
        attributes = {};
        static of (A, q, K) {
            let Y = new DS6(A);
            if (q !== void 0) Y.addChildNode(new Y68(q));
            if (K !== void 0) Y.withName(K);
            return Y
        }
        constructor(A, q = []) {
            this.name = A, this.children = q
        }
        withName(A) {
            return this.name = A, this
        }
        addAttribute(A, q) {
            return this.attributes[A] = q, this
        }
        addChildNode(A) {
            return this.children.push(A), this
        }
        removeAttribute(A) {
            return delete this.attributes[A], this
        }
        n(A) {
            return this.name = A, this
        }
        c(A) {
            return this.children.push(A), this
        }
        a(A, q) {
            if (q != null) this.attributes[A] = q;
            return this
        }
        cc(A, q, K = q) {
            if (A[q] != null) {
                let Y = DS6.of(q, A[q]).withName(K);
                this.c(Y)
            }
        }
        l(A, q, K, Y) {
            if (A[q] != null) Y().map((_) => {
                _.withName(K), this.c(_)
            })
        }
        lc(A, q, K, Y) {
            if (A[q] != null) {
                let z = Y(),
                    _ = new DS6(K);
                z.map((w) => {
                    _.c(w)
                }), this.c(_)
            }
        }
        toString() {
            let A = Boolean(this.children.length),
                q = `<${this.name}`,
                K = this.attributes;
            for (let Y of Object.keys(K)) {
                let z = K[Y];
                if (z != null) q += ` ${Y}="${W45(""+z)}"`
            }
            return q += !A ? "/>" : `>${this.children.map((Y)=>Y.toString()).join("")}</${this.name}>`
        }
    }
    Object.defineProperty(odA, "parseXML", {
        enumerable: !0,
        get: function() {
            return P45.parseXML
        }
    });
    odA.XmlNode = DS6;
    odA.XmlText = Y68
})