
// @from(Ln 113716, Col 4)
jkq = p((iJO, $kq) => {
    var {
        defineProperty: Ff8,
        getOwnPropertyDescriptor: wl9,
        getOwnPropertyNames: $l9
    } = Object, jl9 = Object.prototype.hasOwnProperty, E4 = (q, K) => Ff8(q, "name", {
        value: K,
        configurable: !0
    }), Hl9 = (q, K) => {
        for (var _ in K) Ff8(q, _, {
            get: K[_],
            enumerable: !0
        })
    }, Jl9 = (q, K, _, z) => {
        if (K && typeof K === "object" || typeof K === "function") {
            for (let Y of $l9(K))
                if (!jl9.call(q, Y) && Y !== _) Ff8(q, Y, {
                    get: () => K[Y],
                    enumerable: !(z = wl9(K, Y)) || z.enumerable
                })
        }
        return q
    }, Xl9 = (q) => Jl9(Ff8({}, "__esModule", {
        value: !0
    }), q), UVq = {};
    Hl9(UVq, {
        Client: () => Pl9,
        Command: () => nVq,
        LazyJsonString: () => Hn9,
        NoOpLogger: () => Ml9,
        SENSITIVE_STRING: () => Zl9,
        ServiceException: () => tl9,
        StringWrapper: () => Nn6,
        _json: () => zV1,
        collectBody: () => Wl9,
        convertMap: () => Jn9,
        createAggregatedClient: () => fl9,
        dateToUtcString: () => eVq,
        decorateServiceException: () => Kkq,
        emitWarningIfUnsupportedVersion: () => _n9,
        expectBoolean: () => vl9,
        expectByte: () => _V1,
        expectFloat32: () => mf8,
        expectInt: () => Vl9,
        expectInt32: () => qV1,
        expectLong: () => Vn6,
        expectNonNull: () => Nl9,
        expectNumber: () => Tn6,
        expectObject: () => rVq,
        expectShort: () => KV1,
        expectString: () => El9,
        expectUnion: () => yl9,
        extendedEncodeURIComponent: () => pf8,
        getArrayIfSingleItem: () => jn9,
        getDefaultClientConfiguration: () => wn9,
        getDefaultExtensionConfiguration: () => zkq,
        getValueFromTextNode: () => Ykq,
        handleFloat: () => Rl9,
        limitedParseDouble: () => OV1,
        limitedParseFloat: () => Sl9,
        limitedParseFloat32: () => Cl9,
        loadConfigsForDefaultMode: () => Kn9,
        logger: () => kn6,
        map: () => $V1,
        parseBoolean: () => Gl9,
        parseEpochTimestamp: () => dl9,
        parseRfc3339DateTime: () => ml9,
        parseRfc3339DateTimeWithOffset: () => pl9,
        parseRfc7231DateTime: () => Ql9,
        resolveDefaultRuntimeConfig: () => $n9,
        resolvedPath: () => Dn9,
        serializeFloat: () => Zn9,
        splitEvery: () => wkq,
        strictParseByte: () => tVq,
        strictParseDouble: () => AV1,
        strictParseFloat: () => Ll9,
        strictParseFloat32: () => oVq,
        strictParseInt: () => bl9,
        strictParseInt32: () => Il9,
        strictParseLong: () => sVq,
        strictParseShort: () => cT6,
        take: () => Xn9,
        throwDefaultError: () => _kq,
        withBaseException: () => el9
    });
    $kq.exports = Xl9(UVq);
    var QVq = class {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    };
    E4(QVq, "NoOpLogger");
    var Ml9 = QVq,
        dVq = aTq(),
        cVq = class {
            constructor(K) {
                this.middlewareStack = (0, dVq.constructStack)(), this.config = K
            }
            send(K, _, z) {
                let Y = typeof _ !== "function" ? _ : void 0,
                    A = typeof _ === "function" ? _ : z,
                    O = K.resolveMiddleware(this.middlewareStack, this.config, Y);
                if (A) O(K).then((w) => A(null, w.output), (w) => A(w)).catch(() => {});
                else return O(K).then((w) => w.output)
            }
            destroy() {
                if (this.config.requestHandler.destroy) this.config.requestHandler.destroy()
            }
        };
    E4(cVq, "Client");
    var Pl9 = cVq,
        sT1 = FVq(),
        Wl9 = E4(async (q = new Uint8Array, K) => {
            if (q instanceof Uint8Array) return sT1.Uint8ArrayBlobAdapter.mutate(q);
            if (!q) return sT1.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let _ = K.streamCollector(q);
            return sT1.Uint8ArrayBlobAdapter.mutate(await _)
        }, "collectBody"),
        eT1 = DT1(),
        lVq = class {
            constructor() {
                this.middlewareStack = (0, dVq.constructStack)()
            }
            static classBuilder() {
                return new Dl9
            }
            resolveMiddlewareWithContext(K, _, z, {
                middlewareFn: Y,
                clientName: A,
                commandName: O,
                inputFilterSensitiveLog: w,
                outputFilterSensitiveLog: $,
                smithyContext: j,
                additionalContext: H,
                CommandCtor: J
            }) {
                for (let D of Y.bind(this)(J, K, _, z)) this.middlewareStack.use(D);
                let X = K.concat(this.middlewareStack),
                    {
                        logger: M
                    } = _,
                    P = {
                        logger: M,
                        clientName: A,
                        commandName: O,
                        inputFilterSensitiveLog: w,
                        outputFilterSensitiveLog: $,
                        [eT1.SMITHY_CONTEXT_KEY]: {
                            ...j
                        },
                        ...H
                    },
                    {
                        requestHandler: W
                    } = _;
                return X.resolve((D) => W.handle(D.request, z || {}), P)
            }
        };
    E4(lVq, "Command");
    var nVq = lVq,
        iVq = class {
            constructor() {
                this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (K) => K, this._outputFilterSensitiveLog = (K) => K, this._serializer = null, this._deserializer = null
            }
            init(K) {
                this._init = K
            }
            ep(K) {
                return this._ep = K, this
            }
            m(K) {
                return this._middlewareFn = K, this
            }
            s(K, _, z = {}) {
                return this._smithyContext = {
                    service: K,
                    operation: _,
                    ...z
                }, this
            }
            c(K = {}) {
                return this._additionalContext = K, this
            }
            n(K, _) {
                return this._clientName = K, this._commandName = _, this
            }
            f(K = (z) => z, _ = (z) => z) {
                return this._inputFilterSensitiveLog = K, this._outputFilterSensitiveLog = _, this
            }
            ser(K) {
                return this._serializer = K, this
            }
            de(K) {
                return this._deserializer = K, this
            }
            build() {
                var K;
                let _ = this,
                    z;
                return z = (K = class extends nVq {
                    constructor(...[Y]) {
                        super();
                        this.serialize = _._serializer, this.deserialize = _._deserializer, this.input = Y ?? {}, _._init(this)
                    }
                    static getEndpointParameterInstructions() {
                        return _._ep
                    }
                    resolveMiddleware(Y, A, O) {
                        return this.resolveMiddlewareWithContext(Y, A, O, {
                            CommandCtor: z,
                            middlewareFn: _._middlewareFn,
                            clientName: _._clientName,
                            commandName: _._commandName,
                            inputFilterSensitiveLog: _._inputFilterSensitiveLog,
                            outputFilterSensitiveLog: _._outputFilterSensitiveLog,
                            smithyContext: _._smithyContext,
                            additionalContext: _._additionalContext
                        })
                    }
                }, E4(K, "CommandRef"), K)
            }
        };
    E4(iVq, "ClassBuilder");
    var Dl9 = iVq,
        Zl9 = "***SensitiveInformation***",
        fl9 = E4((q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = E4(async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, "methodImpl"),
                    A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        }, "createAggregatedClient"),
        Gl9 = E4((q) => {
            switch (q) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${q}"`)
            }
        }, "parseBoolean"),
        vl9 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "number") {
                if (q === 0 || q === 1) kn6.warn(Bf8(`Expected boolean, got ${typeof q}: ${q}`));
                if (q === 0) return !1;
                if (q === 1) return !0
            }
            if (typeof q === "string") {
                let K = q.toLowerCase();
                if (K === "false" || K === "true") kn6.warn(Bf8(`Expected boolean, got ${typeof q}: ${q}`));
                if (K === "false") return !1;
                if (K === "true") return !0
            }
            if (typeof q === "boolean") return q;
            throw TypeError(`Expected boolean, got ${typeof q}: ${q}`)
        }, "expectBoolean"),
        Tn6 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "string") {
                let K = parseFloat(q);
                if (!Number.isNaN(K)) {
                    if (String(K) !== String(q)) kn6.warn(Bf8(`Expected number but observed string: ${q}`));
                    return K
                }
            }
            if (typeof q === "number") return q;
            throw TypeError(`Expected number, got ${typeof q}: ${q}`)
        }, "expectNumber"),
        Tl9 = Math.ceil(340282346638528860000000000000000000000),
        mf8 = E4((q) => {
            let K = Tn6(q);
            if (K !== void 0 && !Number.isNaN(K) && K !== 1 / 0 && K !== -1 / 0) {
                if (Math.abs(K) > Tl9) throw TypeError(`Expected 32-bit float, got ${q}`)
            }
            return K
        }, "expectFloat32"),
        Vn6 = E4((q) => {
            if (q === null || q === void 0) return;
            if (Number.isInteger(q) && !Number.isNaN(q)) return q;
            throw TypeError(`Expected integer, got ${typeof q}: ${q}`)
        }, "expectLong"),
        Vl9 = Vn6,
        qV1 = E4((q) => YV1(q, 32), "expectInt32"),
        KV1 = E4((q) => YV1(q, 16), "expectShort"),
        _V1 = E4((q) => YV1(q, 8), "expectByte"),
        YV1 = E4((q, K) => {
            let _ = Vn6(q);
            if (_ !== void 0 && kl9(_, K) !== _) throw TypeError(`Expected ${K}-bit integer, got ${q}`);
            return _
        }, "expectSizedInt"),
        kl9 = E4((q, K) => {
            switch (K) {
                case 32:
                    return Int32Array.of(q)[0];
                case 16:
                    return Int16Array.of(q)[0];
                case 8:
                    return Int8Array.of(q)[0]
            }
        }, "castInt"),
        Nl9 = E4((q, K) => {
            if (q === null || q === void 0) {
                if (K) throw TypeError(`Expected a non-null value for ${K}`);
                throw TypeError("Expected a non-null value")
            }
            return q
        }, "expectNonNull"),
        rVq = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "object" && !Array.isArray(q)) return q;
            let K = Array.isArray(q) ? "array" : typeof q;
            throw TypeError(`Expected object, got ${K}: ${q}`)
        }, "expectObject"),
        El9 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q === "string") return q;
            if (["boolean", "number", "bigint"].includes(typeof q)) return kn6.warn(Bf8(`Expected string, got ${typeof q}: ${q}`)), String(q);
            throw TypeError(`Expected string, got ${typeof q}: ${q}`)
        }, "expectString"),
        yl9 = E4((q) => {
            if (q === null || q === void 0) return;
            let K = rVq(q),
                _ = Object.entries(K).filter(([, z]) => z != null).map(([z]) => z);
            if (_.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (_.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${_} were not null.`);
            return K
        }, "expectUnion"),
        AV1 = E4((q) => {
            if (typeof q == "string") return Tn6(nT6(q));
            return Tn6(q)
        }, "strictParseDouble"),
        Ll9 = AV1,
        oVq = E4((q) => {
            if (typeof q == "string") return mf8(nT6(q));
            return mf8(q)
        }, "strictParseFloat32"),
        hl9 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        nT6 = E4((q) => {
            let K = q.match(hl9);
            if (K === null || K[0].length !== q.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(q)
        }, "parseNumber"),
        OV1 = E4((q) => {
            if (typeof q == "string") return aVq(q);
            return Tn6(q)
        }, "limitedParseDouble"),
        Rl9 = OV1,
        Sl9 = OV1,
        Cl9 = E4((q) => {
            if (typeof q == "string") return aVq(q);
            return mf8(q)
        }, "limitedParseFloat32"),
        aVq = E4((q) => {
            switch (q) {
                case "NaN":
                    return NaN;
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                default:
                    throw Error(`Unable to parse float value: ${q}`)
            }
        }, "parseFloatString"),
        sVq = E4((q) => {
            if (typeof q === "string") return Vn6(nT6(q));
            return Vn6(q)
        }, "strictParseLong"),
        bl9 = sVq,
        Il9 = E4((q) => {
            if (typeof q === "string") return qV1(nT6(q));
            return qV1(q)
        }, "strictParseInt32"),
        cT6 = E4((q) => {
            if (typeof q === "string") return KV1(nT6(q));
            return KV1(q)
        }, "strictParseShort"),
        tVq = E4((q) => {
            if (typeof q === "string") return _V1(nT6(q));
            return _V1(q)
        }, "strictParseByte"),
        Bf8 = E4((q) => {
            return String(TypeError(q).stack || q).split(`
`).slice(0, 5).filter((K) => !K.includes("stackTraceWarning")).join(`
`)
        }, "stackTraceWarning"),
        kn6 = {
            warn: console.warn
        },
        xl9 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        wV1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function eVq(q) {
        let K = q.getUTCFullYear(),
            _ = q.getUTCMonth(),
            z = q.getUTCDay(),
            Y = q.getUTCDate(),
            A = q.getUTCHours(),
            O = q.getUTCMinutes(),
            w = q.getUTCSeconds(),
            $ = Y < 10 ? `0${Y}` : `${Y}`,
            j = A < 10 ? `0${A}` : `${A}`,
            H = O < 10 ? `0${O}` : `${O}`,
            J = w < 10 ? `0${w}` : `${w}`;
        return `${xl9[z]}, ${$} ${wV1[_]} ${K} ${j}:${H}:${J} GMT`
    }
    E4(eVq, "dateToUtcString");
    var ul9 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        ml9 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let K = ul9.exec(q);
            if (!K) throw TypeError("Invalid RFC-3339 date-time value");
            let [_, z, Y, A, O, w, $, j] = K, H = cT6(lT6(z)), J = EQ(Y, "month", 1, 12), X = EQ(A, "day", 1, 31);
            return vn6(H, J, X, {
                hours: O,
                minutes: w,
                seconds: $,
                fractionalMilliseconds: j
            })
        }, "parseRfc3339DateTime"),
        Bl9 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        pl9 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let K = Bl9.exec(q);
            if (!K) throw TypeError("Invalid RFC-3339 date-time value");
            let [_, z, Y, A, O, w, $, j, H] = K, J = cT6(lT6(z)), X = EQ(Y, "month", 1, 12), M = EQ(A, "day", 1, 31), P = vn6(J, X, M, {
                hours: O,
                minutes: w,
                seconds: $,
                fractionalMilliseconds: j
            });
            if (H.toUpperCase() != "Z") P.setTime(P.getTime() - sl9(H));
            return P
        }, "parseRfc3339DateTimeWithOffset"),
        Fl9 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        gl9 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        Ul9 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        Ql9 = E4((q) => {
            if (q === null || q === void 0) return;
            if (typeof q !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let K = Fl9.exec(q);
            if (K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return vn6(cT6(lT6(A)), tT1(Y), EQ(z, "day", 1, 31), {
                    hours: O,
                    minutes: w,
                    seconds: $,
                    fractionalMilliseconds: j
                })
            }
            if (K = gl9.exec(q), K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return nl9(vn6(cl9(A), tT1(Y), EQ(z, "day", 1, 31), {
                    hours: O,
                    minutes: w,
                    seconds: $,
                    fractionalMilliseconds: j
                }))
            }
            if (K = Ul9.exec(q), K) {
                let [_, z, Y, A, O, w, $, j] = K;
                return vn6(cT6(lT6(j)), tT1(z), EQ(Y.trimLeft(), "day", 1, 31), {
                    hours: A,
                    minutes: O,
                    seconds: w,
                    fractionalMilliseconds: $
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        }, "parseRfc7231DateTime"),
        dl9 = E4((q) => {
            if (q === null || q === void 0) return;
            let K;
            if (typeof q === "number") K = q;
            else if (typeof q === "string") K = AV1(q);
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(K) || K === 1 / 0 || K === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(K * 1000))
        }, "parseEpochTimestamp"),
        vn6 = E4((q, K, _, z) => {
            let Y = K - 1;
            return rl9(q, Y, _), new Date(Date.UTC(q, Y, _, EQ(z.hours, "hour", 0, 23), EQ(z.minutes, "minute", 0, 59), EQ(z.seconds, "seconds", 0, 60), al9(z.fractionalMilliseconds)))
        }, "buildDate"),
        cl9 = E4((q) => {
            let K = new Date().getUTCFullYear(),
                _ = Math.floor(K / 100) * 100 + cT6(lT6(q));
            if (_ < K) return _ + 100;
            return _
        }, "parseTwoDigitYear"),
        ll9 = 1576800000000,
        nl9 = E4((q) => {
            if (q.getTime() - new Date().getTime() > ll9) return new Date(Date.UTC(q.getUTCFullYear() - 100, q.getUTCMonth(), q.getUTCDate(), q.getUTCHours(), q.getUTCMinutes(), q.getUTCSeconds(), q.getUTCMilliseconds()));
            return q
        }, "adjustRfc850Year"),
        tT1 = E4((q) => {
            let K = wV1.indexOf(q);
            if (K < 0) throw TypeError(`Invalid month: ${q}`);
            return K + 1
        }, "parseMonthByShortName"),
        il9 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        rl9 = E4((q, K, _) => {
            let z = il9[K];
            if (K === 1 && ol9(q)) z = 29;
            if (_ > z) throw TypeError(`Invalid day for ${wV1[K]} in ${q}: ${_}`)
        }, "validateDayOfMonth"),
        ol9 = E4((q) => {
            return q % 4 === 0 && (q % 100 !== 0 || q % 400 === 0)
        }, "isLeapYear"),
        EQ = E4((q, K, _, z) => {
            let Y = tVq(lT6(q));
            if (Y < _ || Y > z) throw TypeError(`${K} must be between ${_} and ${z}, inclusive`);
            return Y
        }, "parseDateValue"),
        al9 = E4((q) => {
            if (q === null || q === void 0) return 0;
            return oVq("0." + q) * 1000
        }, "parseMilliseconds"),
        sl9 = E4((q) => {
            let K = q[0],
                _ = 1;
            if (K == "+") _ = 1;
            else if (K == "-") _ = -1;
            else throw TypeError(`Offset direction, ${K}, must be "+" or "-"`);
            let z = Number(q.substring(1, 3)),
                Y = Number(q.substring(4, 6));
            return _ * (z * 60 + Y) * 60 * 1000
        }, "parseOffsetToMilliseconds"),
        lT6 = E4((q) => {
            let K = 0;
            while (K < q.length - 1 && q.charAt(K) === "0") K++;
            if (K === 0) return q;
            return q.slice(K)
        }, "stripLeadingZeroes"),
        qkq = class q extends Error {
            constructor(K) {
                super(K.message);
                Object.setPrototypeOf(this, q.prototype), this.name = K.name, this.$fault = K.$fault, this.$metadata = K.$metadata
            }
        };
    E4(qkq, "ServiceException");
    var tl9 = qkq,
        Kkq = E4((q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        }, "decorateServiceException"),
        _kq = E4(({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = qn9(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: (K == null ? void 0 : K.code) || (K == null ? void 0 : K.Code) || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw Kkq(O, K)
        }, "throwDefaultError"),
        el9 = E4((q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                _kq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        }, "withBaseException"),
        qn9 = E4((q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }), "deserializeMetadata"),
        Kn9 = E4((q) => {
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
        }, "loadConfigsForDefaultMode"),
        gVq = !1,
        _n9 = E4((q) => {
            if (q && !gVq && parseInt(q.substring(1, q.indexOf("."))) < 14) gVq = !0
        }, "emitWarningIfUnsupportedVersion"),
        zn9 = E4((q) => {
            let K = [];
            for (let _ in eT1.AlgorithmId) {
                let z = eT1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                _checksumAlgorithms: K,
                addChecksumAlgorithm(_) {
                    this._checksumAlgorithms.push(_)
                },
                checksumAlgorithms() {
                    return this._checksumAlgorithms
                }
            }
        }, "getChecksumConfiguration"),
        Yn9 = E4((q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        }, "resolveChecksumRuntimeConfig"),
        An9 = E4((q) => {
            let K = q.retryStrategy;
            return {
                setRetryStrategy(_) {
                    K = _
                },
                retryStrategy() {
                    return K
                }
            }
        }, "getRetryConfiguration"),
        On9 = E4((q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        }, "resolveRetryRuntimeConfig"),
        zkq = E4((q) => {
            return {
                ...zn9(q),
                ...An9(q)
            }
        }, "getDefaultExtensionConfiguration"),
        wn9 = zkq,
        $n9 = E4((q) => {
            return {
                ...Yn9(q),
                ...On9(q)
            }
        }, "resolveDefaultRuntimeConfig");

    function pf8(q) {
        return encodeURIComponent(q).replace(/[!'()*]/g, function(K) {
            return "%" + K.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    E4(pf8, "extendedEncodeURIComponent");
    var jn9 = E4((q) => Array.isArray(q) ? q : [q], "getArrayIfSingleItem"),
        Ykq = E4((q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = Ykq(q[_]);
            return q
        }, "getValueFromTextNode"),
        Nn6 = E4(function() {
            let q = Object.getPrototypeOf(this).constructor,
                _ = new(Function.bind.apply(String, [null, ...arguments]));
            return Object.setPrototypeOf(_, q.prototype), _
        }, "StringWrapper");
    Nn6.prototype = Object.create(String.prototype, {
        constructor: {
            value: Nn6,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
    Object.setPrototypeOf(Nn6, String);
    var Akq = class q extends Nn6 {
        deserializeJSON() {
            return JSON.parse(super.toString())
        }
        toJSON() {
            return super.toString()
        }
        static fromObject(K) {
            if (K instanceof q) return K;
            else if (K instanceof String || typeof K === "string") return new q(K);
            return new q(JSON.stringify(K))
        }
    };
    E4(Akq, "LazyJsonString");
    var Hn9 = Akq;

    function $V1(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, Mn9(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            Okq(z, null, A, O)
        }
        return z
    }
    E4($V1, "map");
    var Jn9 = E4((q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        }, "convertMap"),
        Xn9 = E4((q, K) => {
            let _ = {};
            for (let z in K) Okq(_, q, K, z);
            return _
        }, "take"),
        Mn9 = E4((q, K, _) => {
            return $V1(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        }, "mapWithFilter"),
        Okq = E4((q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = Pn9, $ = Wn9, j = z] = O;
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
        }, "applyInstruction"),
        Pn9 = E4((q) => q != null, "nonNullish"),
        Wn9 = E4((q) => q, "pass"),
        Dn9 = E4((q, K, _, z, Y, A) => {
            if (K != null && K[_] !== void 0) {
                let O = z();
                if (O.length <= 0) throw Error("Empty value provided for input HTTP label: " + _ + ".");
                q = q.replace(Y, A ? O.split("/").map((w) => pf8(w)).join("/") : pf8(O))
            } else throw Error("No value provided for input HTTP label: " + _ + ".");
            return q
        }, "resolvedPath"),
        Zn9 = E4((q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        }, "serializeFloat"),
        zV1 = E4((q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(zV1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = zV1(q[_])
                }
                return K
            }
            return q
        }, "_json");

    function wkq(q, K, _) {
        if (_ <= 0 || !Number.isInteger(_)) throw Error("Invalid number of delimiters (" + _ + ") for splitEvery.");
        let z = q.split(K);
        if (_ === 1) return z;
        let Y = [],
            A = "";
        for (let O = 0; O < z.length; O++) {
            if (A === "") A = z[O];
            else A += K + z[O];
            if ((O + 1) % _ === 0) Y.push(A), A = ""
        }
        if (A !== "") Y.push(A);
        return Y
    }
    E4(wkq, "splitEvery")
})
// @from(Ln 114541, Col 4)
E$
// @from(Ln 114541, Col 8)
jq6
// @from(Ln 114541, Col 13)
fn9 = async (q, K) => {
    let _ = E$.map({}),
        z = q.body,
        Y = E$.take(z, {
            message: E$.expectString
        });
    Object.assign(_, Y);
    let A = new jq6.InternalServerException({
        $metadata: gf8(q),
        ..._
    });
    return E$.decorateServiceException(A, q.body)
}
// @from(Ln 114553, Col 3)
Gn9 = async (q, K) => {
    let _ = E$.map({}),
        z = q.body,
        Y = E$.take(z, {
            message: E$.expectString,
            originalMessage: E$.expectString,
            originalStatusCode: E$.expectInt32
        });
    Object.assign(_, Y);
    let A = new jq6.ModelStreamErrorException({
        $metadata: gf8(q),
        ..._
    });
    return E$.decorateServiceException(A, q.body)
}
// @from(Ln 114567, Col 3)
vn9 = async (q, K) => {
    let _ = E$.map({}),
        z = q.body,
        Y = E$.take(z, {
            message: E$.expectString
        });
    Object.assign(_, Y);
    let A = new jq6.ThrottlingException({
        $metadata: gf8(q),
        ..._
    });
    return E$.decorateServiceException(A, q.body)
}
// @from(Ln 114579, Col 3)
Tn9 = async (q, K) => {
    let _ = E$.map({}),
        z = q.body,
        Y = E$.take(z, {
            message: E$.expectString
        });
    Object.assign(_, Y);
    let A = new jq6.ValidationException({
        $metadata: gf8(q),
        ..._
    });
    return E$.decorateServiceException(A, q.body)
}
// @from(Ln 114591, Col 3)
Hkq = (q, K) => {
    return K.eventStreamMarshaller.deserialize(q, async (_) => {
        if (_.chunk != null) return {
            chunk: await Nn9(_.chunk, K)
        };
        if (_.internalServerException != null) return {
            internalServerException: await Vn9(_.internalServerException, K)
        };
        if (_.modelStreamErrorException != null) return {
            modelStreamErrorException: await kn9(_.modelStreamErrorException, K)
        };
        if (_.validationException != null) return {
            validationException: await yn9(_.validationException, K)
        };
        if (_.throttlingException != null) return {
            throttlingException: await En9(_.throttlingException, K)
        };
        return {
            $unknown: q
        }
    })
}
// @from(Ln 114612, Col 3)
Vn9 = async (q, K) => {
    let _ = {
        ...q,
        body: await En6(q.body, K)
    };
    return fn9(_, K)
}
// @from(Ln 114618, Col 3)
kn9 = async (q, K) => {
    let _ = {
        ...q,
        body: await En6(q.body, K)
    };
    return Gn9(_, K)
}
// @from(Ln 114624, Col 3)
Nn9 = async (q, K) => {
    let _ = {},
        z = await En6(q.body, K);
    return Object.assign(_, Ln9(z, K)), _
}
// @from(Ln 114628, Col 3)
En9 = async (q, K) => {
    let _ = {
        ...q,
        body: await En6(q.body, K)
    };
    return vn9(_, K)
}
// @from(Ln 114634, Col 3)
yn9 = async (q, K) => {
    let _ = {
        ...q,
        body: await En6(q.body, K)
    };
    return Tn9(_, K)
}
// @from(Ln 114640, Col 3)
Ln9 = (q, K) => {
    return E$.take(q, {
        bytes: K.base64Decoder
    })
}
// @from(Ln 114644, Col 3)
gf8 = (q) => ({
    httpStatusCode: q.statusCode,
    requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"] ?? "",
    extendedRequestId: q.headers["x-amz-id-2"] ?? "",
    cfId: q.headers["x-amz-cf-id"] ?? ""
})
// @from(Ln 114649, Col 4)
hn9 = (q, K) => E$.collectBody(q, K).then((_) => K.utf8Encoder(_))
// @from(Ln 114649, Col 72)
En6 = (q, K) => hn9(q, K).then((_) => {
    if (_.length) return JSON.parse(_);
    return {}
})
// @from(Ln 114653, Col 4)
Jkq = L(() => {
    E$ = K6(jkq(), 1), jq6 = K6(aD8(), 1)
})
// @from(Ln 114657, Col 0)
function Xkq(q) {
    if (q[Symbol.asyncIterator]) return q;
    let K = q.getReader();
    return {
        async next() {
            try {
                let _ = await K.read();
                if (_?.done) K.releaseLock();
                return _
            } catch (_) {
                throw K.releaseLock(), _
            }
        },
        async return () {
            let _ = K.cancel();
            return K.releaseLock(), await _, {
                done: !0,
                value: void 0
            }
        },
        [Symbol.asyncIterator]() {
            return this
        }
    }
}
// @from(Ln 114682, Col 4)
Uf8 = L(() => {
    m0()
})
// @from(Ln 114686, Col 0)
function Qf8(q) {
    return q != null && typeof q === "object" && !Array.isArray(q)
}
// @from(Ln 114689, Col 4)
jV1 = (q) => (jV1 = Array.isArray, jV1(q))
// @from(Ln 114690, Col 4)
HV1
// @from(Ln 114690, Col 9)
Mkq = (q) => {
        try {
            return JSON.parse(q)
        } catch (K) {
            return
        }
    }
// @from(Ln 114697, Col 4)
yn6 = L(() => {
    Uf8();
    HV1 = jV1
})
// @from(Ln 114702, Col 0)
function Ln6() {}
// @from(Ln 114704, Col 0)
function df8(q, K, _) {
    if (!K || Pkq[q] > Pkq[_]) return Ln6;
    else return K[q].bind(K)
}
// @from(Ln 114709, Col 0)
function cf8(q) {
    let K = q.logger,
        _ = q.logLevel ?? "off";
    if (!K) return Sn9;
    let z = Wkq.get(K);
    if (z && z[0] === _) return z[1];
    let Y = {
        error: df8("error", K, _),
        warn: df8("warn", K, _),
        info: df8("info", K, _),
        debug: df8("debug", K, _)
    };
    return Wkq.set(K, [_, Y]), Y
}
// @from(Ln 114723, Col 4)
Pkq
// @from(Ln 114723, Col 9)
Sn9
// @from(Ln 114723, Col 14)
Wkq
// @from(Ln 114724, Col 4)
JV1 = L(() => {
    yn6();
    Pkq = {
        off: 0,
        error: 200,
        warn: 300,
        info: 400,
        debug: 500
    };
    Sn9 = {
        error: Ln6,
        warn: Ln6,
        info: Ln6,
        debug: Ln6
    }, Wkq = new WeakMap
})
// @from(Ln 114741, Col 0)
function bn9(q) {
    return typeof q === "object" && q !== null && (("name" in q) && q.name === "AbortError" || ("message" in q) && String(q.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 114744, Col 4)
Zkq
// @from(Ln 114744, Col 9)
lf8
// @from(Ln 114744, Col 14)
fkq
// @from(Ln 114744, Col 19)
XV1 = (q) => new TextDecoder("utf-8").decode(q)
// @from(Ln 114745, Col 4)
Dkq = (q) => new TextEncoder().encode(q)
// @from(Ln 114746, Col 4)
Cn9 = () => {
        let q = new Zkq.EventStreamMarshaller({
            utf8Encoder: XV1,
            utf8Decoder: Dkq
        });
        return {
            base64Decoder: lf8.fromBase64,
            base64Encoder: lf8.toBase64,
            utf8Decoder: Dkq,
            utf8Encoder: XV1,
            eventStreamMarshaller: q,
            streamCollector: fkq.streamCollector
        }
    }
// @from(Ln 114760, Col 4)
nf8
// @from(Ln 114761, Col 4)
Gkq = L(() => {
    Gw8();
    Fi();
    eG();
    Jkq();
    yn6();
    JV1();
    Zkq = K6(bTq(), 1), lf8 = K6(FT1(), 1), fkq = K6(DO6(), 1);
    nf8 = class nf8 extends $V {
        static fromSSEResponse(q, K, _) {
            let z = !1,
                Y = _ ? cf8(_) : console;
            async function* A() {
                if (!q.body) throw K.abort(), new bq("Attempted to iterate over a response with no body");
                let w = Xkq(q.body),
                    $ = Hkq(w, Cn9());
                for await (let j of $) if (j.chunk && j.chunk.bytes) yield {
                    event: "chunk",
                    data: XV1(j.chunk.bytes),
                    raw: []
                };
                else if (j.internalServerException) yield {
                    event: "error",
                    data: "InternalServerException",
                    raw: []
                };
                else if (j.modelStreamErrorException) yield {
                    event: "error",
                    data: "ModelStreamErrorException",
                    raw: []
                };
                else if (j.validationException) yield {
                    event: "error",
                    data: "ValidationException",
                    raw: []
                };
                else if (j.throttlingException) yield {
                    event: "error",
                    data: "ThrottlingException",
                    raw: []
                }
            }
            async function* O() {
                if (z) throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
                z = !0;
                let w = !1;
                try {
                    for await (let $ of A()) {
                        if ($.event === "chunk") try {
                            yield JSON.parse($.data)
                        } catch (j) {
                            throw Y.error("Could not parse message into JSON:", $.data), Y.error("From chunk:", $.raw), j
                        }
                        if ($.event === "error") {
                            let j = $.data,
                                H = Mkq(j),
                                J = H ? void 0 : j;
                            throw vq.generate(void 0, H, J, q.headers)
                        }
                    }
                    w = !0
                } catch ($) {
                    if (bn9($)) return;
                    throw $
                } finally {
                    if (!w) K.abort()
                }
            }
            return new nf8(O, K)
        }
    }
})
// @from(Ln 114833, Col 4)
Vo = (q) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[q]?.trim() || void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(q)?.trim() || void 0;
    return
}
// @from(Ln 114839, Col 0)
function* In9(q) {
    if (!q) return;
    if (vkq in q) {
        let {
            values: z,
            nulls: Y
        } = q;
        yield* z.entries();
        for (let A of Y) yield [A, null];
        return
    }
    let K = !1,
        _;
    if (q instanceof Headers) _ = q.entries();
    else if (HV1(q)) _ = q;
    else K = !0, _ = Object.entries(q ?? {});
    for (let z of _) {
        let Y = z[0];
        if (typeof Y !== "string") throw TypeError("expected header name to be a string");
        let A = HV1(z[1]) ? z[1] : [z[1]],
            O = !1;
        for (let w of A) {
            if (w === void 0) continue;
            if (K && !O) O = !0, yield [Y, null];
            yield [Y, w]
        }
    }
}
// @from(Ln 114867, Col 4)
vkq
// @from(Ln 114867, Col 9)
hn6 = (q) => {
    let K = new Headers,
        _ = new Set;
    for (let z of q) {
        let Y = new Set;
        for (let [A, O] of In9(z)) {
            let w = A.toLowerCase();
            if (!Y.has(w)) K.delete(A), Y.add(w);
            if (O === null) K.delete(A), _.add(w);
            else K.append(A, O), _.delete(w)
        }
    }
    return {
        [vkq]: !0,
        values: K,
        nulls: _
    }
}
// @from(Ln 114885, Col 4)
MV1 = L(() => {
    yn6();
    vkq = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 114890, Col 0)
function Vkq(q) {
    return q.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 114893, Col 4)
Tkq
// @from(Ln 114893, Col 9)
xn9 = (q = Vkq) => function(_, ...z) {
        if (_.length === 1) return _[0];
        let Y = !1,
            A = [],
            O = _.reduce((H, J, X) => {
                if (/[?#]/.test(J)) Y = !0;
                let M = z[X],
                    P = (Y ? encodeURIComponent : q)("" + M);
                if (X !== z.length && (M == null || typeof M === "object" && M.toString === Object.getPrototypeOf(Object.getPrototypeOf(M.hasOwnProperty ?? Tkq) ?? Tkq)?.toString)) P = M + "", A.push({
                    start: H.length + J.length,
                    length: P.length,
                    error: `Value of type ${Object.prototype.toString.call(M).slice(8,-1)} is not a valid path parameter`
                });
                return H + J + (X === z.length ? "" : P)
            }, ""),
            w = O.split(/[?#]/, 1)[0],
            $ = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
            j;
        while ((j = $.exec(w)) !== null) A.push({
            start: j.index,
            length: j[0].length,
            error: `Value "${j[0]}" can't be safely passed as a path parameter`
        });
        if (A.sort((H, J) => H.start - J.start), A.length > 0) {
            let H = 0,
                J = A.reduce((X, M) => {
                    let P = " ".repeat(M.start - H),
                        W = "^".repeat(M.length);
                    return H = M.start + M.length, X + P + W
                }, "");
            throw new bq(`Path parameters result in path with invalid segments:
${A.map((X)=>X.error).join(`
`)}
${O}
${J}`)
        }
        return O
    }
// @from(Ln 114931, Col 4)
PV1
// @from(Ln 114932, Col 4)
kkq = L(() => {
    Uf8();
    Tkq = Object.freeze(Object.create(null)), PV1 = xn9(Vkq)
})
// @from(Ln 114937, Col 0)
function Bn9(q) {
    let K = new jV(q);
    return delete K.batches, delete K.countTokens, K
}
// @from(Ln 114942, Col 0)
function pn9(q) {
    let K = new p0(q);
    return delete K.promptCaching, delete K.messages.batches, delete K.messages.countTokens, K
}
// @from(Ln 114946, Col 4)
un9 = "bedrock-2023-05-31"
// @from(Ln 114947, Col 4)
mn9
// @from(Ln 114947, Col 9)
WV1
// @from(Ln 114948, Col 4)
DV1 = L(() => {
    yC();
    nD6();
    Pvq();
    Gkq();
    yn6();
    MV1();
    kkq();
    JV1();
    yC();
    mn9 = new Set(["/v1/complete", "/v1/messages", "/v1/messages?beta=true"]);
    WV1 = class WV1 extends az {
        constructor({
            awsRegion: q = Vo("AWS_REGION") ?? "us-east-1",
            baseURL: K = Vo("ANTHROPIC_BEDROCK_BASE_URL") ?? `https://bedrock-runtime.${q}.amazonaws.com`,
            apiKey: _ = Vo("AWS_BEARER_TOKEN_BEDROCK"),
            awsSecretKey: z = null,
            awsAccessKey: Y = null,
            awsSessionToken: A = null,
            providerChainResolver: O = null,
            ...w
        } = {}) {
            super({
                baseURL: K,
                authToken: _,
                ...w
            });
            this.skipAuth = !1, this.messages = Bn9(this), this.completions = new m86(this), this.beta = pn9(this);
            let $ = Y != null,
                j = z != null;
            if ($ !== j) cf8(this).warn("Warning: Passing only one of `awsAccessKey` or `awsSecretKey` is deprecated. Please provide both keys, or provide neither and rely on the AWS credential provider chain.");
            this.awsSecretKey = z, this.awsAccessKey = Y, this.awsRegion = q, this.awsSessionToken = A, this.skipAuth = w.skipAuth ?? !1, this.providerChainResolver = O
        }
        validateHeaders() {}
        async prepareRequest(q, {
            url: K,
            options: _
        }) {
            if (this.skipAuth) {
                q.headers.delete("Authorization");
                return
            }
            if (this.authToken) return;
            let z = this.awsRegion;
            if (!z) throw Error("Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present");
            let Y = await Mvq(q, {
                url: K,
                regionName: z,
                awsAccessKey: this.awsAccessKey,
                awsSecretKey: this.awsSecretKey,
                awsSessionToken: this.awsSessionToken,
                fetchOptions: this.fetchOptions,
                providerChainResolver: this.providerChainResolver
            });
            q.headers = hn6([Y, q.headers]).values
        }
        async buildRequest(q) {
            if (q.__streamClass = nf8, Qf8(q.body)) q.body = {
                ...q.body
            };
            if (Qf8(q.body)) {
                if (!q.body.anthropic_version) q.body.anthropic_version = un9;
                if (q.headers && !q.body.anthropic_beta) {
                    let K = hn6([q.headers]).values.get("anthropic-beta");
                    if (K != null) q.body.anthropic_beta = K.split(",")
                }
            }
            if (mn9.has(q.path) && q.method === "post") {
                if (!Qf8(q.body)) throw Error("Expected request body to be an object for post /v1/messages");
                let K = q.body.model;
                q.body.model = void 0;
                let _ = q.body.stream;
                if (q.body.stream = void 0, _) q.path = PV1`/model/${K}/invoke-with-response-stream`;
                else q.path = PV1`/model/${K}/invoke`
            }
            return super.buildRequest(q)
        }
    }
})
// @from(Ln 115028, Col 4)
Nkq
// @from(Ln 115028, Col 9)
Ekq
// @from(Ln 115028, Col 14)
ykq
// @from(Ln 115028, Col 19)
Lkq
// @from(Ln 115028, Col 24)
gn9 = (q) => Promise.resolve().then(() => K6(LT6(), 1)).then(({
        fromNodeProviderChain: K
    }) => K({
        ...q != null ? {
            profile: q
        } : {},
        clientConfig: {
            requestHandler: new Ekq.FetchHttpHandler({
                requestInit: (_) => {
                    return {
                        ..._
                    }
                }
            })
        }
    })).catch((K) => {
        throw Error(`Failed to import '@aws-sdk/credential-providers'. You can provide a custom \`providerChainResolver\` in the client options if your runtime does not have access to '@aws-sdk/credential-providers': \`new AnthropicAws({ providerChainResolver })\` Original error: ${K.message}`)
    })
// @from(Ln 115046, Col 4)
hkq = async (q, K) => {
        Fn9(q.method, "Expected request method property to be set");
        let _;
        if (K.awsAccessKey && K.awsSecretAccessKey) _ = {
            accessKeyId: K.awsAccessKey,
            secretAccessKey: K.awsSecretAccessKey,
            ...K.awsSessionToken != null && {
                sessionToken: K.awsSessionToken
            }
        };
        else if (K.providerChainResolver) _ = await (await K.providerChainResolver())();
        else _ = await (await gn9(K.awsProfile))();
        let z = new Lkq.SignatureV4({
                service: K.serviceName,
                region: K.regionName,
                credentials: _,
                sha256: Nkq.Sha256
            }),
            Y = new URL(K.url),
            A = !q.headers ? {} : (Symbol.iterator in q.headers) ? Object.fromEntries(Array.from(q.headers).map((j) => [...j])) : {
                ...q.headers
            };
        delete A.connection, A.host = Y.hostname;
        let O = {};
        Y.searchParams.forEach((j, H) => {
            O[H] = j
        });
        let w = new ykq.HttpRequest({
            method: q.method.toUpperCase(),
            protocol: Y.protocol,
            path: Y.pathname,
            query: O,
            headers: A,
            body: q.body
        });
        return (await z.sign(w)).headers
    }
// @from(Ln 115083, Col 4)
Rkq = L(() => {
    Nkq = K6(Kf8(), 1), Ekq = K6(DO6(), 1), ykq = K6(Wn6(), 1), Lkq = K6(ff8(), 1)
})
// @from(Ln 115087, Col 0)
function Qn9(q) {
    let {
        messages: K
    } = new p0(q);
    return {
        messages: K
    }
}
// @from(Ln 115095, Col 4)
Un9 = "bedrock-mantle"
// @from(Ln 115096, Col 4)
ZV1
// @from(Ln 115097, Col 4)
Skq = L(() => {
    MV1();
    Uf8();
    yC();
    nD6();
    Rkq();
    ZV1 = class ZV1 extends az {
        constructor({
            awsRegion: q,
            baseURL: K,
            apiKey: _,
            awsAccessKey: z = null,
            awsSecretAccessKey: Y = null,
            awsSessionToken: A = null,
            awsProfile: O,
            providerChainResolver: w = null,
            skipAuth: $ = !1,
            ...j
        } = {}) {
            let H = q ?? Vo("AWS_REGION") ?? Vo("AWS_DEFAULT_REGION"),
                J = K ?? Vo("ANTHROPIC_BEDROCK_MANTLE_BASE_URL") ?? (H ? `https://bedrock-mantle.${H}.api.aws/anthropic` : void 0);
            if (!J) throw new bq("No AWS region or base URL found. Set `awsRegion` in the constructor, the `AWS_REGION` / `AWS_DEFAULT_REGION` environment variable, or provide a `baseURL` / `ANTHROPIC_BEDROCK_MANTLE_BASE_URL` environment variable.");
            let X = _ != null;
            if (z != null !== (Y != null)) throw new bq("`awsAccessKey` and `awsSecretAccessKey` must be provided together. You provided only one.");
            let P = z != null && Y != null,
                W = O != null,
                D;
            if (X) D = _;
            else if (!P && !W) D = Vo("AWS_BEARER_TOKEN_BEDROCK") ?? void 0;
            super({
                apiKey: D,
                baseURL: J,
                ...j
            });
            this.messages = new jV(this), this.beta = Qn9(this), this.skipAuth = !1, this.awsRegion = H, this.awsAccessKey = z, this.awsSecretAccessKey = Y, this.awsSessionToken = A, this.awsProfile = O ?? null, this.providerChainResolver = w, this.skipAuth = $, this._useSigV4 = D == null
        }
        async authHeaders(q) {
            if (this.skipAuth) return;
            if (!this._useSigV4) return super.authHeaders(q);
            return
        }
        validateHeaders() {}
        async prepareRequest(q, {
            url: K,
            options: _
        }) {
            if (this.skipAuth || !this._useSigV4) return;
            let z = this.awsRegion;
            if (!z) throw new bq("No AWS region found. Set `awsRegion` in the constructor or the `AWS_REGION` / `AWS_DEFAULT_REGION` environment variable.");
            let Y = await hkq(q, {
                url: K,
                regionName: z,
                serviceName: Un9,
                awsAccessKey: this.awsAccessKey,
                awsSecretAccessKey: this.awsSecretAccessKey,
                awsSessionToken: this.awsSessionToken,
                awsProfile: this.awsProfile,
                providerChainResolver: this.providerChainResolver
            });
            q.headers = hn6([Y, q.headers]).values
        }
    }
})
// @from(Ln 115160, Col 4)
Rn6 = {}
// @from(Ln 115167, Col 4)
Sn6 = L(() => {
    DV1();
    Skq();
    DV1()
})
// @from(Ln 115172, Col 4)
if8 = L(() => {
    m0()
})
// @from(Ln 115175, Col 4)
fV1 = (q) => (fV1 = Array.isArray, fV1(q))
// @from(Ln 115176, Col 4)
GV1
// @from(Ln 115177, Col 4)
rf8 = L(() => {
    if8();
    GV1 = fV1
})
// @from(Ln 115182, Col 0)
function* cn9(q) {
    if (!q) return;
    if (Ckq in q) {
        let {
            values: z,
            nulls: Y
        } = q;
        yield* z.entries();
        for (let A of Y) yield [A, null];
        return
    }
    let K = !1,
        _;
    if (q instanceof Headers) _ = q.entries();
    else if (GV1(q)) _ = q;
    else K = !0, _ = Object.entries(q ?? {});
    for (let z of _) {
        let Y = z[0];
        if (typeof Y !== "string") throw TypeError("expected header name to be a string");
        let A = GV1(z[1]) ? z[1] : [z[1]],
            O = !1;
        for (let w of A) {
            if (w === void 0) continue;
            if (K && !O) O = !0, yield [Y, null];
            yield [Y, w]
        }
    }
}
// @from(Ln 115210, Col 4)
Ckq
// @from(Ln 115210, Col 9)
vV1 = (q) => {
    let K = new Headers,
        _ = new Set;
    for (let z of q) {
        let Y = new Set;
        for (let [A, O] of cn9(z)) {
            let w = A.toLowerCase();
            if (!Y.has(w)) K.delete(A), Y.add(w);
            if (O === null) K.delete(A), _.add(w);
            else K.append(A, O), _.delete(w)
        }
    }
    return {
        [Ckq]: !0,
        values: K,
        nulls: _
    }
}
// @from(Ln 115228, Col 4)
bkq = L(() => {
    rf8();
    Ckq = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 115232, Col 4)
Ikq = L(() => {
    if8()
})
// @from(Ln 115235, Col 4)
of8 = (q) => {
    if (typeof globalThis.process < "u") return globalThis.process.env?.[q]?.trim() ?? void 0;
    if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(q)?.trim();
    return
}
// @from(Ln 115240, Col 4)
xkq = L(() => {
    rf8()
})
// @from(Ln 115243, Col 4)
ukq = L(() => {
    rf8();
    Ikq();
    xkq()
})
// @from(Ln 115249, Col 0)
function ln9(q) {
    let K = new jV(q);
    return delete K.batches, K
}
// @from(Ln 115254, Col 0)
function nn9(q) {
    let K = new p0(q);
    return delete K.messages.batches, K
}
// @from(Ln 115258, Col 4)
TV1
// @from(Ln 115259, Col 4)
VV1 = L(() => {
    bkq();
    if8();
    ukq();
    yC();
    yC();
    nD6();
    TV1 = class TV1 extends qh {
        constructor({
            baseURL: q = of8("ANTHROPIC_FOUNDRY_BASE_URL"),
            apiKey: K = of8("ANTHROPIC_FOUNDRY_API_KEY"),
            resource: _ = of8("ANTHROPIC_FOUNDRY_RESOURCE"),
            azureADTokenProvider: z,
            dangerouslyAllowBrowser: Y,
            ...A
        } = {}) {
            if (typeof z === "function") Y = !0;
            if (!z && !K) throw new bq("Missing credentials. Please pass one of `apiKey` and `azureTokenProvider`, or set the `ANTHROPIC_FOUNDRY_API_KEY` environment variable.");
            if (z && K) throw new bq("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
            if (!q) {
                if (!_) throw new bq("Must provide one of the `baseURL` or `resource` arguments, or the `ANTHROPIC_FOUNDRY_RESOURCE` environment variable");
                q = `https://${_}.services.ai.azure.com/anthropic/`
            } else if (_) throw new bq("baseURL and resource are mutually exclusive");
            super({
                apiKey: z ?? K,
                baseURL: q,
                ...A,
                ...Y !== void 0 ? {
                    dangerouslyAllowBrowser: Y
                } : {}
            });
            this.resource = null, this.messages = ln9(this), this.beta = nn9(this), this.models = void 0
        }
        async authHeaders() {
            if (typeof this._options.apiKey === "function") {
                let q;
                try {
                    q = await this._options.apiKey()
                } catch (K) {
                    if (K instanceof bq) throw K;
                    throw new bq(`Failed to get token from azureADTokenProvider: ${K.message}`, {
                        cause: K
                    })
                }
                if (typeof q !== "string" || !q) throw new bq(`Expected azureADTokenProvider function argument to return a string but it returned ${q}`);
                return vV1([{
                    Authorization: `Bearer ${q}`
                }])
            }
            if (typeof this._options.apiKey === "string") return vV1([{
                "x-api-key": this.apiKey
            }]);
            return
        }
        validateHeaders() {
            return
        }
    }
})
// @from(Ln 115318, Col 4)
mkq = {}
// @from(Ln 115324, Col 4)
Bkq = L(() => {
    VV1();
    VV1()
})
// @from(Ln 115328, Col 4)
af8 = "4.10.1"
// @from(Ln 115329, Col 4)
Hw6 = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"
// @from(Ln 115330, Col 4)
pkq = "common"
// @from(Ln 115331, Col 4)
yQ
// @from(Ln 115331, Col 8)
Cn6
// @from(Ln 115331, Col 13)
Fkq = "login.microsoftonline.com"
// @from(Ln 115332, Col 4)
gkq
// @from(Ln 115332, Col 9)
Ukq = "cae"
// @from(Ln 115333, Col 4)
Qkq = "nocae"
// @from(Ln 115334, Col 4)
dkq = "msal.cache"
// @from(Ln 115335, Col 4)
LQ = L(() => {
    (function(q) {
        q.AzureChina = "https://login.chinacloudapi.cn", q.AzureGermany = "https://login.microsoftonline.de", q.AzureGovernment = "https://login.microsoftonline.us", q.AzurePublicCloud = "https://login.microsoftonline.com"
    })(yQ || (yQ = {}));
    Cn6 = yQ.AzurePublicCloud, gkq = ["*"]
})
// @from(Ln 115342, Col 0)
function in9(q) {
    var K, _, z, Y, A, O, w;
    let $ = {
        cache: {},
        broker: {
            isEnabled: (_ = (K = q.brokerOptions) === null || K === void 0 ? void 0 : K.enabled) !== null && _ !== void 0 ? _ : !1,
            enableMsaPassthrough: (Y = (z = q.brokerOptions) === null || z === void 0 ? void 0 : z.legacyEnableMsaPassthrough) !== null && Y !== void 0 ? Y : !1,
            parentWindowHandle: (A = q.brokerOptions) === null || A === void 0 ? void 0 : A.parentWindowHandle
        }
    };
    if ((O = q.tokenCachePersistenceOptions) === null || O === void 0 ? void 0 : O.enabled) {
        if (sf8 === void 0) throw Error(["Persistent token caching was requested, but no persistence provider was configured.", "You must install the identity-cache-persistence plugin package (`npm install --save @azure/identity-cache-persistence`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(cachePersistencePlugin)` before using `tokenCachePersistenceOptions`."].join(" "));
        let j = q.tokenCachePersistenceOptions.name || dkq;
        $.cache.cachePlugin = sf8(Object.assign({
            name: `${j}.${Qkq}`
        }, q.tokenCachePersistenceOptions)), $.cache.cachePluginCae = sf8(Object.assign({
            name: `${j}.${Ukq}`
        }, q.tokenCachePersistenceOptions))
    }
    if ((w = q.brokerOptions) === null || w === void 0 ? void 0 : w.enabled) {
        if (kV1 === void 0) throw Error(["Broker for WAM was requested to be enabled, but no native broker was configured.", "You must install the identity-broker plugin package (`npm install --save @azure/identity-broker`)", "and enable it by importing `useIdentityPlugin` from `@azure/identity` and calling", "`useIdentityPlugin(createNativeBrokerPlugin())` before using `enableBroker`."].join(" "));
        $.broker.nativeBrokerPlugin = kV1.broker
    }
    return $
}
// @from(Ln 115367, Col 4)
sf8 = void 0
// @from(Ln 115368, Col 4)
ckq
// @from(Ln 115368, Col 9)
kV1 = void 0
// @from(Ln 115369, Col 4)
lkq
// @from(Ln 115369, Col 9)
nkq
// @from(Ln 115370, Col 4)
NV1 = L(() => {
    LQ();
    ckq = {
        setPersistence(q) {
            sf8 = q
        }
    }, lkq = {
        setNativeBroker(q) {
            kV1 = {
                broker: q
            }
        }
    };
    nkq = {
        generatePluginConfiguration: in9
    }
})
// @from(Ln 115393, Col 0)
function rkq(q, ...K) {
    ikq.stderr.write(`${on9.format(q,...K)}${rn9}`)
}
// @from(Ln 115396, Col 4)
okq = () => {}
// @from(Ln 115398, Col 0)
function LV1(q) {
    skq = q, EV1 = [], yV1 = [];
    let K = /\*/g,
        _ = q.split(",").map((z) => z.trim().replace(K, ".*?"));
    for (let z of _)
        if (z.startsWith("-")) yV1.push(new RegExp(`^${z.substr(1)}$`));
        else EV1.push(new RegExp(`^${z}$`));
    for (let z of tf8) z.enabled = hV1(z.namespace)
}
// @from(Ln 115408, Col 0)
function hV1(q) {
    if (q.endsWith("*")) return !0;
    for (let K of yV1)
        if (K.test(q)) return !1;
    for (let K of EV1)
        if (K.test(q)) return !0;
    return !1
}
// @from(Ln 115417, Col 0)
function an9() {
    let q = skq || "";
    return LV1(""), q
}
// @from(Ln 115422, Col 0)
function ekq(q) {
    let K = Object.assign(_, {
        enabled: hV1(q),
        destroy: sn9,
        log: tkq.log,
        namespace: q,
        extend: tn9
    });

    function _(...z) {
        if (!K.enabled) return;
        if (z.length > 0) z[0] = `${q} ${z[0]}`;
        K.log(...z)
    }
    return tf8.push(K), K
}
// @from(Ln 115439, Col 0)
function sn9() {
    let q = tf8.indexOf(this);
    if (q >= 0) return tf8.splice(q, 1), !0;
    return !1
}
// @from(Ln 115445, Col 0)
function tn9(q) {
    let K = ekq(`${this.namespace}:${q}`);
    return K.log = this.log, K
}
// @from(Ln 115449, Col 4)
akq
// @from(Ln 115449, Col 9)
skq
// @from(Ln 115449, Col 14)
EV1
// @from(Ln 115449, Col 19)
yV1
// @from(Ln 115449, Col 24)
tf8
// @from(Ln 115449, Col 29)
tkq
// @from(Ln 115449, Col 34)
iT6
// @from(Ln 115450, Col 4)
qNq = L(() => {
    okq();
    akq = typeof process < "u" && process.env && process.env.DEBUG || void 0, EV1 = [], yV1 = [], tf8 = [];
    if (akq) LV1(akq);
    tkq = Object.assign((q) => {
        return ekq(q)
    }, {
        enable: LV1,
        enabled: hV1,
        disable: an9,
        log: rkq
    });
    iT6 = tkq
})
// @from(Ln 115465, Col 0)
function _Nq(q, K) {
    K.log = (..._) => {
        q.log(..._)
    }
}
// @from(Ln 115471, Col 0)
function zNq(q) {
    return RV1.includes(q)
}
// @from(Ln 115475, Col 0)
function ef8(q) {
    let K = new Set,
        _ = typeof process < "u" && process.env && process.env[q.logLevelEnvVarName] || void 0,
        z, Y = iT6(q.namespace);
    Y.log = (...H) => {
        iT6.log(...H)
    };

    function A(H) {
        if (H && !zNq(H)) throw Error(`Unknown log level '${H}'. Acceptable values: ${RV1.join(",")}`);
        z = H;
        let J = [];
        for (let X of K)
            if (O(X)) J.push(X.namespace);
        iT6.enable(J.join(","))
    }
    if (_)
        if (zNq(_)) A(_);
        else console.error(`${q.logLevelEnvVarName} set to unknown log level '${_}'; logging is not enabled. Acceptable values: ${RV1.join(", ")}.`);

    function O(H) {
        return Boolean(z && KNq[H.level] <= KNq[z])
    }

    function w(H, J) {
        let X = Object.assign(H.extend(J), {
            level: J
        });
        if (_Nq(H, X), O(X)) {
            let M = iT6.disable();
            iT6.enable(M + "," + X.namespace)
        }
        return K.add(X), X
    }

    function $() {
        return z
    }

    function j(H) {
        let J = Y.extend(H);
        return _Nq(Y, J), {
            error: w(J, "error"),
            warning: w(J, "warning"),
            info: w(J, "info"),
            verbose: w(J, "verbose")
        }
    }
    return {
        setLogLevel: A,
        getLogLevel: $,
        createClientLogger: j,
        logger: Y
    }
}
// @from(Ln 115531, Col 0)
function qG8(q) {
    return YNq.createClientLogger(q)
}
// @from(Ln 115534, Col 4)
RV1
// @from(Ln 115534, Col 9)
KNq
// @from(Ln 115534, Col 14)
YNq
// @from(Ln 115534, Col 19)
TMO
// @from(Ln 115535, Col 4)
KG8 = L(() => {
    qNq();
    RV1 = ["verbose", "info", "warning", "error"], KNq = {
        verbose: 400,
        info: 300,
        warning: 200,
        error: 100
    };
    YNq = ef8({
        logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
        namespace: "typeSpecRuntime"
    }), TMO = YNq.logger
})
// @from(Ln 115548, Col 4)
ANq = L(() => {
    KG8()
})
// @from(Ln 115552, Col 0)
function _G8() {
    return SV1.getLogLevel()
}
// @from(Ln 115556, Col 0)
function Hq6(q) {
    return SV1.createClientLogger(q)
}
// @from(Ln 115559, Col 4)
SV1
// @from(Ln 115559, Col 9)
yMO
// @from(Ln 115560, Col 4)
Jw6 = L(() => {
    ANq();
    SV1 = ef8({
        logLevelEnvVarName: "AZURE_LOG_LEVEL",
        namespace: "azure"
    }), yMO = SV1.logger
})
// @from(Ln 115568, Col 0)
function zG8(q) {
    return q.reduce((K, _) => {
        if (process.env[_]) K.assigned.push(_);
        else K.missing.push(_);
        return K
    }, {
        missing: [],
        assigned: []
    })
}
// @from(Ln 115579, Col 0)
function GP(q) {
    return `SUCCESS. Scopes: ${Array.isArray(q)?q.join(", "):q}.`
}
// @from(Ln 115583, Col 0)
function YY(q, K) {
    let _ = "ERROR.";
    if (q === null || q === void 0 ? void 0 : q.length) _ += ` Scopes: ${Array.isArray(q)?q.join(", "):q}.`;
    return `${_} Error message: ${typeof K==="string"?K:K.message}.`
}
// @from(Ln 115589, Col 0)
function ONq(q, K, _ = RE) {
    let z = K ? `${K.fullTitle} ${q}` : q;

    function Y($) {
        _.info(`${z} =>`, $)
    }

    function A($) {
        _.warning(`${z} =>`, $)
    }

    function O($) {
        _.verbose(`${z} =>`, $)
    }

    function w($) {
        _.error(`${z} =>`, $)
    }
    return {
        title: q,
        fullTitle: z,
        info: Y,
        warning: A,
        verbose: O,
        error: w
    }
}
// @from(Ln 115617, Col 0)
function u9(q, K = RE) {
    let _ = ONq(q, void 0, K);
    return Object.assign(Object.assign({}, _), {
        parent: K,
        getToken: ONq("=> getToken()", _, K)
    })
}
// @from(Ln 115624, Col 4)
RE
// @from(Ln 115625, Col 4)
rw = L(() => {
    Jw6();
    RE = Hq6("identity")
})
// @from(Ln 115630, Col 0)
function en9(q) {
    return q && typeof q.error === "string" && typeof q.error_description === "string"
}
// @from(Ln 115634, Col 0)
function wNq(q) {
    return {
        error: q.error,
        errorDescription: q.error_description,
        correlationId: q.correlation_id,
        errorCodes: q.error_codes,
        timestamp: q.timestamp,
        traceId: q.trace_id
    }
}
// @from(Ln 115644, Col 4)
CV1 = "CredentialUnavailableError"
// @from(Ln 115645, Col 4)
c4
// @from(Ln 115645, Col 8)
bn6 = "AuthenticationError"
// @from(Ln 115646, Col 4)
XB
// @from(Ln 115646, Col 8)
bV1 = "AggregateAuthenticationError"
// @from(Ln 115647, Col 4)
In6
// @from(Ln 115647, Col 9)
MB
// @from(Ln 115648, Col 4)
BW = L(() => {
    c4 = class c4 extends Error {
        constructor(q, K) {
            super(q, K);
            this.name = CV1
        }
    };
    XB = class XB extends Error {
        constructor(q, K, _) {
            let z = {
                error: "unknown",
                errorDescription: "An unknown error occurred and no additional details are available."
            };
            if (en9(K)) z = wNq(K);
            else if (typeof K === "string") try {
                let Y = JSON.parse(K);
                z = wNq(Y)
            } catch (Y) {
                if (q === 400) z = {
                    error: "invalid_request",
                    errorDescription: `The service indicated that the request was invalid.

${K}`
                };
                else z = {
                    error: "unknown_error",
                    errorDescription: `An unknown error has occurred. Response body:

${K}`
                }
            } else z = {
                error: "unknown_error",
                errorDescription: "An unknown error occurred and no additional details are available."
            };
            super(`${z.error} Status code: ${q}
More details:
${z.errorDescription},`, _);
            this.statusCode = q, this.errorResponse = z, this.name = bn6
        }
    };
    In6 = class In6 extends Error {
        constructor(q, K) {
            let _ = q.join(`
`);
            super(`${K}
${_}`);
            this.errors = q, this.name = bV1
        }
    };
    MB = class MB extends Error {
        constructor(q) {
            super(q.message, q.cause ? {
                cause: q.cause
            } : void 0);
            this.scopes = q.scopes, this.getTokenOptions = q.getTokenOptions, this.name = "AuthenticationRequiredError"
        }
    }
})
// @from(Ln 115707, Col 0)
function qi9(q) {
    return `The current credential is not configured to acquire tokens for tenant ${q}. To enable acquiring tokens for this tenant add it to the AdditionallyAllowedTenants on the credential options, or add "*" to AdditionallyAllowedTenants to allow acquiring tokens for any tenant.`
}
// @from(Ln 115711, Col 0)
function Oj(q, K, _ = [], z) {
    var Y;
    let A;
    if (process.env.AZURE_IDENTITY_DISABLE_MULTITENANTAUTH) A = q;
    else if (q === "adfs") A = q;
    else A = (Y = K === null || K === void 0 ? void 0 : K.tenantId) !== null && Y !== void 0 ? Y : q;
    if (q && A !== q && !_.includes("*") && !_.some((O) => O.localeCompare(A) === 0)) {
        let O = qi9(A);
        throw z === null || z === void 0 || z.info(O), new c4(O)
    }
    return A
}
// @from(Ln 115723, Col 4)
$Nq = L(() => {
    BW()
})
// @from(Ln 115727, Col 0)
function vP(q, K) {
    if (!K.match(/^[0-9a-zA-Z-.]+$/)) {
        let _ = Error("Invalid tenant id provided. You can locate your tenant id by following the instructions listed here: https://learn.microsoft.com/partner-center/find-ids-and-domain-names.");
        throw q.info(YY("", _)), _
    }
}
// @from(Ln 115734, Col 0)
function rT6(q, K, _) {
    if (K) return vP(q, K), K;
    if (!_) _ = Hw6;
    if (_ !== Hw6) return "common";
    return "organizations"
}
// @from(Ln 115741, Col 0)
function _H(q) {
    if (!q || q.length === 0) return [];
    if (q.includes("*")) return gkq;
    return q
}
// @from(Ln 115746, Col 4)
pW = L(() => {
    LQ();
    rw();
    $Nq()
})
// @from(Ln 115752, Col 0)
function YG8(q) {
    return q.toLowerCase()
}
// @from(Ln 115756, Col 0)
function* Ki9(q) {
    for (let K of q.values()) yield [K.name, K.value]
}
// @from(Ln 115760, Col 0)
function hQ(q) {
    return new jNq(q)
}
// @from(Ln 115763, Col 4)
jNq
// @from(Ln 115764, Col 4)
xn6 = L(() => {
    jNq = class jNq {
        constructor(q) {
            if (this._headersMap = new Map, q)
                for (let K of Object.keys(q)) this.set(K, q[K])
        }
        set(q, K) {
            this._headersMap.set(YG8(q), {
                name: q,
                value: String(K).trim()
            })
        }
        get(q) {
            var K;
            return (K = this._headersMap.get(YG8(q))) === null || K === void 0 ? void 0 : K.value
        }
        has(q) {
            return this._headersMap.has(YG8(q))
        }
        delete(q) {
            this._headersMap.delete(YG8(q))
        }
        toJSON(q = {}) {
            let K = {};
            if (q.preserveCase)
                for (let _ of this._headersMap.values()) K[_.name] = _.value;
            else
                for (let [_, z] of this._headersMap) K[_] = z.value;
            return K
        }
        toString() {
            return JSON.stringify(this.toJSON({
                preserveCase: !0
            }))
        } [Symbol.iterator]() {
            return Ki9(this._headersMap)
        }
    }
})
// @from(Ln 115803, Col 4)
HNq = () => {}
// @from(Ln 115804, Col 4)
JNq = () => {}
// @from(Ln 115809, Col 0)
function un6() {
    return zi9()
}
// @from(Ln 115812, Col 4)
IV1
// @from(Ln 115812, Col 9)
zi9
// @from(Ln 115813, Col 4)
xV1 = L(() => {
    zi9 = typeof((IV1 = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || IV1 === void 0 ? void 0 : IV1.randomUUID) === "function" ? globalThis.crypto.randomUUID.bind(globalThis.crypto) : _i9
})
// @from(Ln 115816, Col 0)
class XNq {
    constructor(q) {
        var K, _, z, Y, A, O, w;
        this.url = q.url, this.body = q.body, this.headers = (K = q.headers) !== null && K !== void 0 ? K : hQ(), this.method = (_ = q.method) !== null && _ !== void 0 ? _ : "GET", this.timeout = (z = q.timeout) !== null && z !== void 0 ? z : 0, this.multipartBody = q.multipartBody, this.formData = q.formData, this.disableKeepAlive = (Y = q.disableKeepAlive) !== null && Y !== void 0 ? Y : !1, this.proxySettings = q.proxySettings, this.streamResponseStatusCodes = q.streamResponseStatusCodes, this.withCredentials = (A = q.withCredentials) !== null && A !== void 0 ? A : !1, this.abortSignal = q.abortSignal, this.onUploadProgress = q.onUploadProgress, this.onDownloadProgress = q.onDownloadProgress, this.requestId = q.requestId || un6(), this.allowInsecureConnection = (O = q.allowInsecureConnection) !== null && O !== void 0 ? O : !1, this.enableBrowserStreams = (w = q.enableBrowserStreams) !== null && w !== void 0 ? w : !1, this.requestOverrides = q.requestOverrides, this.authSchemes = q.authSchemes
    }
}
// @from(Ln 115823, Col 0)
function uV1(q) {
    return new XNq(q)
}
// @from(Ln 115826, Col 4)
MNq = L(() => {
    xn6();
    xV1()
})
// @from(Ln 115830, Col 0)
class AG8 {
    constructor(q) {
        var K;
        this._policies = [], this._policies = (K = q === null || q === void 0 ? void 0 : q.slice(0)) !== null && K !== void 0 ? K : [], this._orderedPolicies = void 0
    }
    addPolicy(q, K = {}) {
        if (K.phase && K.afterPhase) throw Error("Policies inside a phase cannot specify afterPhase.");
        if (K.phase && !PNq.has(K.phase)) throw Error(`Invalid phase name: ${K.phase}`);
        if (K.afterPhase && !PNq.has(K.afterPhase)) throw Error(`Invalid afterPhase name: ${K.afterPhase}`);
        this._policies.push({
            policy: q,
            options: K
        }), this._orderedPolicies = void 0
    }
    removePolicy(q) {
        let K = [];
        return this._policies = this._policies.filter((_) => {
            if (q.name && _.policy.name === q.name || q.phase && _.options.phase === q.phase) return K.push(_.policy), !1;
            else return !0
        }), this._orderedPolicies = void 0, K
    }
    sendRequest(q, K) {
        return this.getOrderedPolicies().reduceRight((Y, A) => {
            return (O) => {
                return A.sendRequest(O, Y)
            }
        }, (Y) => q.sendRequest(Y))(K)
    }
    getOrderedPolicies() {
        if (!this._orderedPolicies) this._orderedPolicies = this.orderPolicies();
        return this._orderedPolicies
    }
    clone() {
        return new AG8(this._policies)
    }
    static create() {
        return new AG8
    }
    orderPolicies() {
        let q = [],
            K = new Map;

        function _(M) {
            return {
                name: M,
                policies: new Set,
                hasRun: !1,
                hasAfterPolicies: !1
            }
        }
        let z = _("Serialize"),
            Y = _("None"),
            A = _("Deserialize"),
            O = _("Retry"),
            w = _("Sign"),
            $ = [z, Y, A, O, w];

        function j(M) {
            if (M === "Retry") return O;
            else if (M === "Serialize") return z;
            else if (M === "Deserialize") return A;
            else if (M === "Sign") return w;
            else return Y
        }
        for (let M of this._policies) {
            let {
                policy: P,
                options: W
            } = M, D = P.name;
            if (K.has(D)) throw Error("Duplicate policy names not allowed in pipeline");
            let Z = {
                policy: P,
                dependsOn: new Set,
                dependants: new Set
            };
            if (W.afterPhase) Z.afterPhase = j(W.afterPhase), Z.afterPhase.hasAfterPolicies = !0;
            K.set(D, Z), j(W.phase).policies.add(Z)
        }
        for (let M of this._policies) {
            let {
                policy: P,
                options: W
            } = M, D = P.name, Z = K.get(D);
            if (!Z) throw Error(`Missing node for policy ${D}`);
            if (W.afterPolicies)
                for (let G of W.afterPolicies) {
                    let f = K.get(G);
                    if (f) Z.dependsOn.add(f), f.dependants.add(Z)
                }
            if (W.beforePolicies)
                for (let G of W.beforePolicies) {
                    let f = K.get(G);
                    if (f) f.dependsOn.add(Z), Z.dependants.add(f)
                }
        }

        function H(M) {
            M.hasRun = !0;
            for (let P of M.policies) {
                if (P.afterPhase && (!P.afterPhase.hasRun || P.afterPhase.policies.size)) continue;
                if (P.dependsOn.size === 0) {
                    q.push(P.policy);
                    for (let W of P.dependants) W.dependsOn.delete(P);
                    K.delete(P.policy.name), M.policies.delete(P)
                }
            }
        }

        function J() {
            for (let M of $) {
                if (H(M), M.policies.size > 0 && M !== Y) {
                    if (!Y.hasRun) H(Y);
                    return
                }
                if (M.hasAfterPolicies) H(Y)
            }
        }
        let X = 0;
        while (K.size > 0) {
            X++;
            let M = q.length;
            if (J(), q.length <= M && X > 1) throw Error("Cannot satisfy policy dependencies due to requirements cycle.")
        }
        return q
    }
}
// @from(Ln 115957, Col 0)
function mV1() {
    return AG8.create()
}
// @from(Ln 115960, Col 4)
PNq
// @from(Ln 115961, Col 4)
WNq = L(() => {
    PNq = new Set(["Deserialize", "Serialize", "Retry", "Sign"])
})
// @from(Ln 115965, Col 0)
function mn6(q) {
    return typeof q === "object" && q !== null && !Array.isArray(q) && !(q instanceof RegExp) && !(q instanceof Date)
}
// @from(Ln 115969, Col 0)
function Xw6(q) {
    if (mn6(q)) {
        let K = typeof q.name === "string",
            _ = typeof q.message === "string";
        return K && _
    }
    return !1
}
// @from(Ln 115977, Col 4)
BV1 = () => {}
// @from(Ln 115981, Col 4)
DNq
// @from(Ln 115982, Col 4)
ZNq = L(() => {
    DNq = Yi9.custom
})
// @from(Ln 115985, Col 0)
class RQ {
    constructor({
        additionalAllowedHeaderNames: q = [],
        additionalAllowedQueryParameters: K = []
    } = {}) {
        q = Ai9.concat(q), K = Oi9.concat(K), this.allowedHeaderNames = new Set(q.map((_) => _.toLowerCase())), this.allowedQueryParameters = new Set(K.map((_) => _.toLowerCase()))
    }
    sanitize(q) {
        let K = new Set;
        return JSON.stringify(q, (_, z) => {
            if (z instanceof Error) return Object.assign(Object.assign({}, z), {
                name: z.name,
                message: z.message
            });
            if (_ === "headers") return this.sanitizeHeaders(z);
            else if (_ === "url") return this.sanitizeUrl(z);
            else if (_ === "query") return this.sanitizeQuery(z);
            else if (_ === "body") return;
            else if (_ === "response") return;
            else if (_ === "operationSpec") return;
            else if (Array.isArray(z) || mn6(z)) {
                if (K.has(z)) return "[Circular]";
                K.add(z)
            }
            return z
        }, 2)
    }
    sanitizeUrl(q) {
        if (typeof q !== "string" || q === null || q === "") return q;
        let K = new URL(q);
        if (!K.search) return q;
        for (let [_] of K.searchParams)
            if (!this.allowedQueryParameters.has(_.toLowerCase())) K.searchParams.set(_, pV1);
        return K.toString()
    }
    sanitizeHeaders(q) {
        let K = {};
        for (let _ of Object.keys(q))
            if (this.allowedHeaderNames.has(_.toLowerCase())) K[_] = q[_];
            else K[_] = pV1;
        return K
    }
    sanitizeQuery(q) {
        if (typeof q !== "object" || q === null) return q;
        let K = {};
        for (let _ of Object.keys(q))
            if (this.allowedQueryParameters.has(_.toLowerCase())) K[_] = q[_];
            else K[_] = pV1;
        return K
    }
}
// @from(Ln 116036, Col 4)
pV1 = "REDACTED"
// @from(Ln 116037, Col 4)
Ai9
// @from(Ln 116037, Col 9)
Oi9
// @from(Ln 116038, Col 4)
Bn6 = L(() => {
    Ai9 = ["x-ms-client-request-id", "x-ms-return-client-request-id", "x-ms-useragent", "x-ms-correlation-request-id", "x-ms-request-id", "client-request-id", "ms-cv", "return-client-request-id", "traceparent", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Expose-Headers", "Access-Control-Max-Age", "Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin", "Accept", "Accept-Encoding", "Cache-Control", "Connection", "Content-Length", "Content-Type", "Date", "ETag", "Expires", "If-Match", "If-Modified-Since", "If-None-Match", "If-Unmodified-Since", "Last-Modified", "Pragma", "Request-Id", "Retry-After", "Server", "Transfer-Encoding", "User-Agent", "WWW-Authenticate"], Oi9 = ["api-version"]
})
// @from(Ln 116042, Col 0)
function FV1(q) {
    if (q instanceof SE) return !0;
    return Xw6(q) && q.name === "RestError"
}
// @from(Ln 116046, Col 4)
wi9
// @from(Ln 116046, Col 9)
SE
// @from(Ln 116047, Col 4)
gV1 = L(() => {
    BV1();
    ZNq();
    Bn6();
    wi9 = new RQ;
    SE = class SE extends Error {
        constructor(q, K = {}) {
            super(q);
            this.name = "RestError", this.code = K.code, this.statusCode = K.statusCode, Object.defineProperty(this, "request", {
                value: K.request,
                enumerable: !1
            }), Object.defineProperty(this, "response", {
                value: K.response,
                enumerable: !1
            }), Object.defineProperty(this, DNq, {
                value: () => {
                    return `RestError: ${this.message} 
 ${wi9.sanitize(Object.assign(Object.assign({},this),{request:this.request,response:this.response}))}`
                },
                enumerable: !1
            }), Object.setPrototypeOf(this, SE.prototype)
        }
    };
    SE.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
    SE.PARSE_ERROR = "PARSE_ERROR"
})
// @from(Ln 116073, Col 4)
Jq6
// @from(Ln 116074, Col 4)
OG8 = L(() => {
    Jq6 = class Jq6 extends Error {
        constructor(q) {
            super(q);
            this.name = "AbortError"
        }
    }
})
// @from(Ln 116082, Col 4)
PB
// @from(Ln 116083, Col 4)
wG8 = L(() => {
    KG8();
    PB = qG8("ts-http-runtime")
})
// @from(Ln 116094, Col 0)
function pn6(q) {
    return q && typeof q.pipe === "function"
}
// @from(Ln 116098, Col 0)
function fNq(q) {
    if (q.readable === !1) return Promise.resolve();
    return new Promise((K) => {
        let _ = () => {
            K(), q.removeListener("close", _), q.removeListener("end", _), q.removeListener("error", _)
        };
        q.on("close", _), q.on("end", _), q.on("error", _)
    })
}
// @from(Ln 116108, Col 0)
function GNq(q) {
    return q && typeof q.byteLength === "number"
}
// @from(Ln 116111, Col 0)
class vNq {
    constructor() {
        this.cachedHttpsAgents = new WeakMap
    }
    async sendRequest(q) {
        var K, _, z;
        let Y = new AbortController,
            A;
        if (q.abortSignal) {
            if (q.abortSignal.aborted) throw new Jq6("The operation was aborted. Request has already been canceled.");
            A = (J) => {
                if (J.type === "abort") Y.abort()
            }, q.abortSignal.addEventListener("abort", A)
        }
        let O;
        if (q.timeout > 0) O = setTimeout(() => {
            let J = new RQ;
            PB.info(`request to '${J.sanitizeUrl(q.url)}' timed out. canceling...`), Y.abort()
        }, q.timeout);
        let w = q.headers.get("Accept-Encoding"),
            $ = (w === null || w === void 0 ? void 0 : w.includes("gzip")) || (w === null || w === void 0 ? void 0 : w.includes("deflate")),
            j = typeof q.body === "function" ? q.body() : q.body;
        if (j && !q.headers.has("Content-Length")) {
            let J = Mi9(j);
            if (J !== null) q.headers.set("Content-Length", J)
        }
        let H;
        try {
            if (j && q.onUploadProgress) {
                let D = q.onUploadProgress,
                    Z = new UV1(D);
                if (Z.on("error", (G) => {
                        PB.error("Error in upload progress", G)
                    }), pn6(j)) j.pipe(Z);
                else Z.end(j);
                j = Z
            }
            let J = await this.makeRequest(q, Y, j);
            if (O !== void 0) clearTimeout(O);
            let X = Hi9(J),
                P = {
                    status: (K = J.statusCode) !== null && K !== void 0 ? K : 0,
                    headers: X,
                    request: q
                };
            if (q.method === "HEAD") return J.resume(), P;
            H = $ ? Ji9(J, X) : J;
            let W = q.onDownloadProgress;
            if (W) {
                let D = new UV1(W);
                D.on("error", (Z) => {
                    PB.error("Error in download progress", Z)
                }), H.pipe(D), H = D
            }
            if (((_ = q.streamResponseStatusCodes) === null || _ === void 0 ? void 0 : _.has(Number.POSITIVE_INFINITY)) || ((z = q.streamResponseStatusCodes) === null || z === void 0 ? void 0 : z.has(P.status))) P.readableStreamBody = H;
            else P.bodyAsText = await Xi9(H);
            return P
        } finally {
            if (q.abortSignal && A) {
                let J = Promise.resolve();
                if (pn6(j)) J = fNq(j);
                let X = Promise.resolve();
                if (pn6(H)) X = fNq(H);
                Promise.all([J, X]).then(() => {
                    var M;
                    if (A)(M = q.abortSignal) === null || M === void 0 || M.removeEventListener("abort", A)
                }).catch((M) => {
                    PB.warning("Error when cleaning up abortListener on httpRequest", M)
                })
            }
        }
    }
    makeRequest(q, K, _) {
        var z;
        let Y = new URL(q.url),
            A = Y.protocol !== "https:";
        if (A && !q.allowInsecureConnection) throw Error(`Cannot connect to ${q.url} while allowInsecureConnection is false.`);
        let O = (z = q.agent) !== null && z !== void 0 ? z : this.getOrCreateAgent(q, A),
            w = Object.assign({
                agent: O,
                hostname: Y.hostname,
                path: `${Y.pathname}${Y.search}`,
                port: Y.port,
                method: q.method,
                headers: q.headers.toJSON({
                    preserveCase: !0
                })
            }, q.requestOverrides);
        return new Promise(($, j) => {
            let H = A ? oT6.request(w, $) : aT6.request(w, $);
            if (H.once("error", (J) => {
                    var X;
                    j(new SE(J.message, {
                        code: (X = J.code) !== null && X !== void 0 ? X : SE.REQUEST_SEND_ERROR,
                        request: q
                    }))
                }), K.signal.addEventListener("abort", () => {
                    let J = new Jq6("The operation was aborted. Rejecting from abort signal callback while making request.");
                    H.destroy(J), j(J)
                }), _ && pn6(_)) _.pipe(H);
            else if (_)
                if (typeof _ === "string" || Buffer.isBuffer(_)) H.end(_);
                else if (GNq(_)) H.end(ArrayBuffer.isView(_) ? Buffer.from(_.buffer) : Buffer.from(_));
            else PB.error("Unrecognized body type", _), j(new SE("Unrecognized body type"));
            else H.end()
        })
    }
    getOrCreateAgent(q, K) {
        var _;
        let z = q.disableKeepAlive;
        if (K) {
            if (z) return oT6.globalAgent;
            if (!this.cachedHttpAgent) this.cachedHttpAgent = new oT6.Agent({
                keepAlive: !0
            });
            return this.cachedHttpAgent
        } else {
            if (z && !q.tlsSettings) return aT6.globalAgent;
            let Y = (_ = q.tlsSettings) !== null && _ !== void 0 ? _ : ji9,
                A = this.cachedHttpsAgents.get(Y);
            if (A && A.options.keepAlive === !z) return A;
            return PB.info("No cached TLS Agent exist, creating a new Agent"), A = new aT6.Agent(Object.assign({
                keepAlive: !z
            }, Y)), this.cachedHttpsAgents.set(Y, A), A
        }
    }
}
// @from(Ln 116239, Col 0)
function Hi9(q) {
    let K = hQ();
    for (let _ of Object.keys(q.headers)) {
        let z = q.headers[_];
        if (Array.isArray(z)) {
            if (z.length > 0) K.set(_, z[0])
        } else if (z) K.set(_, z)
    }
    return K
}
// @from(Ln 116250, Col 0)
function Ji9(q, K) {
    let _ = K.get("Content-Encoding");
    if (_ === "gzip") {
        let z = $G8.createGunzip();
        return q.pipe(z), z
    } else if (_ === "deflate") {
        let z = $G8.createInflate();
        return q.pipe(z), z
    }
    return q
}
// @from(Ln 116262, Col 0)
function Xi9(q) {
    return new Promise((K, _) => {
        let z = [];
        q.on("data", (Y) => {
            if (Buffer.isBuffer(Y)) z.push(Y);
            else z.push(Buffer.from(Y))
        }), q.on("end", () => {
            K(Buffer.concat(z).toString("utf8"))
        }), q.on("error", (Y) => {
            if (Y && (Y === null || Y === void 0 ? void 0 : Y.name) === "AbortError") _(Y);
            else _(new SE(`Error reading response as text: ${Y.message}`, {
                code: SE.PARSE_ERROR
            }))
        })
    })
}
// @from(Ln 116279, Col 0)
function Mi9(q) {
    if (!q) return 0;
    else if (Buffer.isBuffer(q)) return q.length;
    else if (pn6(q)) return null;
    else if (GNq(q)) return q.byteLength;
    else if (typeof q === "string") return Buffer.from(q).length;
    else return null
}
// @from(Ln 116288, Col 0)
function TNq() {
    return new vNq
}
// @from(Ln 116291, Col 4)
ji9
// @from(Ln 116291, Col 9)
UV1
// @from(Ln 116292, Col 4)
VNq = L(() => {
    OG8();
    xn6();
    gV1();
    wG8();
    Bn6();
    ji9 = {};
    UV1 = class UV1 extends $i9 {
        _transform(q, K, _) {
            this.push(q), this.loadedBytes += q.length;
            try {
                this.progressCallback({
                    loadedBytes: this.loadedBytes
                }), _()
            } catch (z) {
                _(z)
            }
        }
        constructor(q) {
            super();
            this.loadedBytes = 0, this.progressCallback = q
        }
    }
})
// @from(Ln 116317, Col 0)
function QV1() {
    return TNq()
}
// @from(Ln 116320, Col 4)
kNq = L(() => {
    VNq()
})
// @from(Ln 116323, Col 4)
sT6 = L(() => {
    xn6();
    MNq();
    WNq();
    gV1();
    kNq();
    HNq();
    JNq()
})
// @from(Ln 116333, Col 0)
function Fn6() {
    return mV1()
}
// @from(Ln 116336, Col 4)
dV1 = L(() => {
    sT6()
})
// @from(Ln 116339, Col 4)
ko
// @from(Ln 116340, Col 4)
jG8 = L(() => {
    Jw6();
    ko = Hq6("core-rest-pipeline")
})
// @from(Ln 116345, Col 0)
function cV1(q) {
    return {
        name: "agentPolicy",
        sendRequest: async (K, _) => {
            if (!K.agent) K.agent = q;
            return _(K)
        }
    }
}
// @from(Ln 116355, Col 0)
function lV1() {
    return {
        name: "decompressResponsePolicy",
        async sendRequest(q, K) {
            if (q.method !== "HEAD") q.headers.set("Accept-Encoding", "gzip,deflate");
            return K(q)
        }
    }
}
// @from(Ln 116365, Col 0)
function nV1(q, K) {
    return q = Math.ceil(q), K = Math.floor(K), Math.floor(Math.random() * (K - q + 1)) + q
}
// @from(Ln 116369, Col 0)
function gn6(q, K) {
    let _ = K.retryDelayInMs * Math.pow(2, q),
        z = Math.min(K.maxRetryDelayInMs, _);
    return {
        retryAfterInMs: z / 2 + nV1(0, z / 2)
    }
}
// @from(Ln 116376, Col 4)
iV1 = () => {}
// @from(Ln 116378, Col 0)
function NNq(q, K, _) {
    return new Promise((z, Y) => {
        let A = void 0,
            O = void 0,
            w = () => {
                return Y(new Jq6((_ === null || _ === void 0 ? void 0 : _.abortErrorMsg) ? _ === null || _ === void 0 ? void 0 : _.abortErrorMsg : Pi9))
            },
            $ = () => {
                if ((_ === null || _ === void 0 ? void 0 : _.abortSignal) && O) _.abortSignal.removeEventListener("abort", O)
            };
        if (O = () => {
                if (A) clearTimeout(A);
                return $(), w()
            }, (_ === null || _ === void 0 ? void 0 : _.abortSignal) && _.abortSignal.aborted) return w();
        if (A = setTimeout(() => {
                $(), z(K)
            }, q), _ === null || _ === void 0 ? void 0 : _.abortSignal) _.abortSignal.addEventListener("abort", O)
    })
}
// @from(Ln 116398, Col 0)
function ENq(q, K) {
    let _ = q.headers.get(K);
    if (!_) return;
    let z = Number(_);
    if (Number.isNaN(z)) return;
    return z
}
// @from(Ln 116405, Col 4)
Pi9 = "The operation was aborted."
// @from(Ln 116406, Col 4)
rV1 = L(() => {
    OG8()
})
// @from(Ln 116410, Col 0)
function yNq(q) {
    if (!(q && [429, 503].includes(q.status))) return;
    try {
        for (let Y of Wi9) {
            let A = ENq(q, Y);
            if (A === 0 || A) return A * (Y === oV1 ? 1000 : 1)
        }
        let K = q.headers.get(oV1);
        if (!K) return;
        let z = Date.parse(K) - Date.now();
        return Number.isFinite(z) ? Math.max(0, z) : void 0
    } catch (K) {
        return
    }
}
// @from(Ln 116426, Col 0)
function LNq(q) {
    return Number.isFinite(yNq(q))
}
// @from(Ln 116430, Col 0)
function hNq() {
    return {
        name: "throttlingRetryStrategy",
        retry({
            response: q
        }) {
            let K = yNq(q);
            if (!Number.isFinite(K)) return {
                skipStrategy: !0
            };
            return {
                retryAfterInMs: K
            }
        }
    }
}
// @from(Ln 116446, Col 4)
oV1 = "Retry-After"
// @from(Ln 116447, Col 4)
Wi9
// @from(Ln 116448, Col 4)
aV1 = L(() => {
    rV1();
    Wi9 = ["retry-after-ms", "x-ms-retry-after-ms", oV1]
})
// @from(Ln 116453, Col 0)
function RNq(q = {}) {
    var K, _;
    let z = (K = q.retryDelayInMs) !== null && K !== void 0 ? K : Di9,
        Y = (_ = q.maxRetryDelayInMs) !== null && _ !== void 0 ? _ : Zi9;
    return {
        name: "exponentialRetryStrategy",
        retry({
            retryCount: A,
            response: O,
            responseError: w
        }) {
            let $ = Gi9(w),
                j = $ && q.ignoreSystemErrors,
                H = fi9(O),
                J = H && q.ignoreHttpStatusCodes;
            if (O && (LNq(O) || !H) || J || j) return {
                skipStrategy: !0
            };
            if (w && !$ && !H) return {
                errorToThrow: w
            };
            return gn6(A, {
                retryDelayInMs: z,
                maxRetryDelayInMs: Y
            })
        }
    }
}
// @from(Ln 116482, Col 0)
function fi9(q) {
    return Boolean(q && q.status !== void 0 && (q.status >= 500 || q.status === 408) && q.status !== 501 && q.status !== 505)
}
// @from(Ln 116486, Col 0)
function Gi9(q) {
    if (!q) return !1;
    return q.code === "ETIMEDOUT" || q.code === "ESOCKETTIMEDOUT" || q.code === "ECONNREFUSED" || q.code === "ECONNRESET" || q.code === "ENOENT" || q.code === "ENOTFOUND"
}
// @from(Ln 116490, Col 4)
Di9 = 1000
// @from(Ln 116491, Col 4)
Zi9 = 64000
// @from(Ln 116492, Col 4)
SNq = L(() => {
    iV1();
    aV1()
})
// @from(Ln 116496, Col 4)
Un6 = 3