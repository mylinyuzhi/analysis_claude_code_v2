
// @from(Ln 55288, Col 4)
nf = R((rJ8) => {
    var $WK = Yg6(),
        OWK = (A, q, K = (Y) => Y) => A,
        _WK = (A) => {
            switch (A) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    throw Error(`Unable to parse boolean value "${A}"`)
            }
        },
        JWK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "number") {
                if (A === 0 || A === 1) $E1.warn(vt1(`Expected boolean, got ${typeof A}: ${A}`));
                if (A === 0) return !1;
                if (A === 1) return !0
            }
            if (typeof A === "string") {
                let q = A.toLowerCase();
                if (q === "false" || q === "true") $E1.warn(vt1(`Expected boolean, got ${typeof A}: ${A}`));
                if (q === "false") return !1;
                if (q === "true") return !0
            }
            if (typeof A === "boolean") return A;
            throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
        },
        wE1 = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") {
                let q = parseFloat(A);
                if (!Number.isNaN(q)) {
                    if (String(q) !== String(A)) $E1.warn(vt1(`Expected number but observed string: ${A}`));
                    return q
                }
            }
            if (typeof A === "number") return A;
            throw TypeError(`Expected number, got ${typeof A}: ${A}`)
        },
        XWK = Math.ceil(340282346638528860000000000000000000000),
        Tt1 = (A) => {
            let q = wE1(A);
            if (q !== void 0 && !Number.isNaN(q) && q !== 1 / 0 && q !== -1 / 0) {
                if (Math.abs(q) > XWK) throw TypeError(`Expected 32-bit float, got ${A}`)
            }
            return q
        },
        HE1 = (A) => {
            if (A === null || A === void 0) return;
            if (Number.isInteger(A) && !Number.isNaN(A)) return A;
            throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
        },
        DWK = HE1,
        wg6 = (A) => Og6(A, 32),
        Hg6 = (A) => Og6(A, 16),
        $g6 = (A) => Og6(A, 8),
        Og6 = (A, q) => {
            let K = HE1(A);
            if (K !== void 0 && jWK(K, q) !== K) throw TypeError(`Expected ${q}-bit integer, got ${A}`);
            return K
        },
        jWK = (A, q) => {
            switch (q) {
                case 32:
                    return Int32Array.of(A)[0];
                case 16:
                    return Int16Array.of(A)[0];
                case 8:
                    return Int8Array.of(A)[0]
            }
        },
        MWK = (A, q) => {
            if (A === null || A === void 0) {
                if (q) throw TypeError(`Expected a non-null value for ${q}`);
                throw TypeError("Expected a non-null value")
            }
            return A
        },
        UJ8 = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "object" && !Array.isArray(A)) return A;
            let q = Array.isArray(A) ? "array" : typeof A;
            throw TypeError(`Expected object, got ${q}: ${A}`)
        },
        PWK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A === "string") return A;
            if (["boolean", "number", "bigint"].includes(typeof A)) return $E1.warn(vt1(`Expected string, got ${typeof A}: ${A}`)), String(A);
            throw TypeError(`Expected string, got ${typeof A}: ${A}`)
        },
        WWK = (A) => {
            if (A === null || A === void 0) return;
            let q = UJ8(A),
                K = Object.entries(q).filter(([, Y]) => Y != null).map(([Y]) => Y);
            if (K.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
            if (K.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${K} were not null.`);
            return q
        },
        _g6 = (A) => {
            if (typeof A == "string") return wE1(fH1(A));
            return wE1(A)
        },
        GWK = _g6,
        pJ8 = (A) => {
            if (typeof A == "string") return Tt1(fH1(A));
            return Tt1(A)
        },
        ZWK = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
        fH1 = (A) => {
            let q = A.match(ZWK);
            if (q === null || q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
            return parseFloat(A)
        },
        Jg6 = (A) => {
            if (typeof A == "string") return dJ8(A);
            return wE1(A)
        },
        fWK = Jg6,
        VWK = Jg6,
        NWK = (A) => {
            if (typeof A == "string") return dJ8(A);
            return Tt1(A)
        },
        dJ8 = (A) => {
            switch (A) {
                case "NaN":
                    return NaN;
                case "Infinity":
                    return 1 / 0;
                case "-Infinity":
                    return -1 / 0;
                default:
                    throw Error(`Unable to parse float value: ${A}`)
            }
        },
        cJ8 = (A) => {
            if (typeof A === "string") return HE1(fH1(A));
            return HE1(A)
        },
        TWK = cJ8,
        vWK = (A) => {
            if (typeof A === "string") return wg6(fH1(A));
            return wg6(A)
        },
        GH1 = (A) => {
            if (typeof A === "string") return Hg6(fH1(A));
            return Hg6(A)
        },
        lJ8 = (A) => {
            if (typeof A === "string") return $g6(fH1(A));
            return $g6(A)
        },
        vt1 = (A) => {
            return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((q) => !q.includes("stackTraceWarning")).join(`
`)
        },
        $E1 = {
            warn: console.warn
        },
        EWK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        Xg6 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function kWK(A) {
        let q = A.getUTCFullYear(),
            K = A.getUTCMonth(),
            Y = A.getUTCDay(),
            z = A.getUTCDate(),
            w = A.getUTCHours(),
            H = A.getUTCMinutes(),
            $ = A.getUTCSeconds(),
            O = z < 10 ? `0${z}` : `${z}`,
            _ = w < 10 ? `0${w}` : `${w}`,
            J = H < 10 ? `0${H}` : `${H}`,
            X = $ < 10 ? `0${$}` : `${$}`;
        return `${EWK[Y]}, ${O} ${Xg6[K]} ${q} ${_}:${J}:${X} GMT`
    }
    var LWK = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
        RWK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = LWK.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, w, H, $, O, _] = q, J = GH1(ZH1(Y)), X = Yb(z, "month", 1, 12), D = Yb(w, "day", 1, 31);
            return zE1(J, X, D, {
                hours: H,
                minutes: $,
                seconds: O,
                fractionalMilliseconds: _
            })
        },
        yWK = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
        CWK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
            let q = yWK.exec(A);
            if (!q) throw TypeError("Invalid RFC-3339 date-time value");
            let [K, Y, z, w, H, $, O, _, J] = q, X = GH1(ZH1(Y)), D = Yb(z, "month", 1, 12), j = Yb(w, "day", 1, 31), M = zE1(X, D, j, {
                hours: H,
                minutes: $,
                seconds: O,
                fractionalMilliseconds: _
            });
            if (J.toUpperCase() != "Z") M.setTime(M.getTime() - pWK(J));
            return M
        },
        SWK = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        hWK = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
        IWK = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
        xWK = (A) => {
            if (A === null || A === void 0) return;
            if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
            let q = SWK.exec(A);
            if (q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return zE1(GH1(ZH1(w)), zg6(z), Yb(Y, "day", 1, 31), {
                    hours: H,
                    minutes: $,
                    seconds: O,
                    fractionalMilliseconds: _
                })
            }
            if (q = hWK.exec(A), q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return mWK(zE1(uWK(w), zg6(z), Yb(Y, "day", 1, 31), {
                    hours: H,
                    minutes: $,
                    seconds: O,
                    fractionalMilliseconds: _
                }))
            }
            if (q = IWK.exec(A), q) {
                let [K, Y, z, w, H, $, O, _] = q;
                return zE1(GH1(ZH1(_)), zg6(Y), Yb(z.trimLeft(), "day", 1, 31), {
                    hours: w,
                    minutes: H,
                    seconds: $,
                    fractionalMilliseconds: O
                })
            }
            throw TypeError("Invalid RFC-7231 date-time value")
        },
        bWK = (A) => {
            if (A === null || A === void 0) return;
            let q;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") q = _g6(A);
            else if (typeof A === "object" && A.tag === 1) q = A.value;
            else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
            if (Number.isNaN(q) || q === 1 / 0 || q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
            return new Date(Math.round(q * 1000))
        },
        zE1 = (A, q, K, Y) => {
            let z = q - 1;
            return QWK(A, z, K), new Date(Date.UTC(A, z, K, Yb(Y.hours, "hour", 0, 23), Yb(Y.minutes, "minute", 0, 59), Yb(Y.seconds, "seconds", 0, 60), UWK(Y.fractionalMilliseconds)))
        },
        uWK = (A) => {
            let q = new Date().getUTCFullYear(),
                K = Math.floor(q / 100) * 100 + GH1(ZH1(A));
            if (K < q) return K + 100;
            return K
        },
        BWK = 1576800000000,
        mWK = (A) => {
            if (A.getTime() - new Date().getTime() > BWK) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
            return A
        },
        zg6 = (A) => {
            let q = Xg6.indexOf(A);
            if (q < 0) throw TypeError(`Invalid month: ${A}`);
            return q + 1
        },
        FWK = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        QWK = (A, q, K) => {
            let Y = FWK[q];
            if (q === 1 && gWK(A)) Y = 29;
            if (K > Y) throw TypeError(`Invalid day for ${Xg6[q]} in ${A}: ${K}`)
        },
        gWK = (A) => {
            return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
        },
        Yb = (A, q, K, Y) => {
            let z = lJ8(ZH1(A));
            if (z < K || z > Y) throw TypeError(`${q} must be between ${K} and ${Y}, inclusive`);
            return z
        },
        UWK = (A) => {
            if (A === null || A === void 0) return 0;
            return pJ8("0." + A) * 1000
        },
        pWK = (A) => {
            let q = A[0],
                K = 1;
            if (q == "+") K = 1;
            else if (q == "-") K = -1;
            else throw TypeError(`Offset direction, ${q}, must be "+" or "-"`);
            let Y = Number(A.substring(1, 3)),
                z = Number(A.substring(4, 6));
            return K * (Y * 60 + z) * 60 * 1000
        },
        ZH1 = (A) => {
            let q = 0;
            while (q < A.length - 1 && A.charAt(q) === "0") q++;
            if (q === 0) return A;
            return A.slice(q)
        },
        JA1 = function(q) {
            return Object.assign(new String(q), {
                deserializeJSON() {
                    return JSON.parse(String(q))
                },
                toString() {
                    return String(q)
                },
                toJSON() {
                    return String(q)
                }
            })
        };
    JA1.from = (A) => {
        if (A && typeof A === "object" && (A instanceof JA1 || ("deserializeJSON" in A))) return A;
        else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return JA1(String(A));
        return JA1(JSON.stringify(A))
    };
    JA1.fromObject = JA1.from;

    function dWK(A) {
        if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
        return A
    }
    var Dg6 = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?",
        jg6 = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)",
        Mg6 = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?",
        iJ8 = "(\\d?\\d)",
        nJ8 = "(\\d{4})",
        cWK = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/),
        lWK = new RegExp(`^${Dg6}, ${iJ8} ${jg6} ${nJ8} ${Mg6} GMT$`),
        iWK = new RegExp(`^${Dg6}, ${iJ8}-${jg6}-(\\d\\d) ${Mg6} GMT$`),
        nWK = new RegExp(`^${Dg6} ${jg6} ( [1-9]|\\d\\d) ${Mg6} ${nJ8}$`),
        rWK = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        oWK = (A) => {
            if (A == null) return;
            let q = NaN;
            if (typeof A === "number") q = A;
            else if (typeof A === "string") {
                if (!/^-?\d*\.?\d+$/.test(A)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
                q = Number.parseFloat(A)
            } else if (typeof A === "object" && A.tag === 1) q = A.value;
            if (isNaN(q) || Math.abs(q) === 1 / 0) throw TypeError("Epoch timestamps must be valid finite numbers.");
            return new Date(Math.round(q * 1000))
        },
        aWK = (A) => {
            if (A == null) return;
            if (typeof A !== "string") throw TypeError("RFC3339 timestamps must be strings");
            let q = cWK.exec(A);
            if (!q) throw TypeError(`Invalid RFC3339 timestamp format ${A}`);
            let [, K, Y, z, w, H, $, , O, _] = q;
            pQ(Y, 1, 12), pQ(z, 1, 31), pQ(w, 0, 23), pQ(H, 0, 59), pQ($, 0, 60);
            let J = new Date(Date.UTC(Number(K), Number(Y) - 1, Number(z), Number(w), Number(H), Number($), Number(O) ? Math.round(parseFloat(`0.${O}`) * 1000) : 0));
            if (J.setUTCFullYear(Number(K)), _.toUpperCase() != "Z") {
                let [, X, D, j] = /([+-])(\d\d):(\d\d)/.exec(_) || [void 0, "+", 0, 0], M = X === "-" ? 1 : -1;
                J.setTime(J.getTime() + M * (Number(D) * 60 * 60 * 1000 + Number(j) * 60 * 1000))
            }
            return J
        },
        sWK = (A) => {
            if (A == null) return;
            if (typeof A !== "string") throw TypeError("RFC7231 timestamps must be strings.");
            let q, K, Y, z, w, H, $, O;
            if (O = lWK.exec(A))[, q, K, Y, z, w, H, $] = O;
            else if (O = iWK.exec(A))[, q, K, Y, z, w, H, $] = O, Y = (Number(Y) + 1900).toString();
            else if (O = nWK.exec(A))[, K, q, z, w, H, $, Y] = O;
            if (Y && H) {
                let _ = Date.UTC(Number(Y), rWK.indexOf(K), Number(q), Number(z), Number(w), Number(H), $ ? Math.round(parseFloat(`0.${$}`) * 1000) : 0);
                pQ(q, 1, 31), pQ(z, 0, 23), pQ(w, 0, 59), pQ(H, 0, 60);
                let J = new Date(_);
                return J.setUTCFullYear(Number(Y)), J
            }
            throw TypeError(`Invalid RFC7231 date-time value ${A}.`)
        };

    function pQ(A, q, K) {
        let Y = Number(A);
        if (Y < q || Y > K) throw Error(`Value ${Y} out of range [${q}, ${K}]`)
    }

    function tWK(A, q, K) {
        if (K <= 0 || !Number.isInteger(K)) throw Error("Invalid number of delimiters (" + K + ") for splitEvery.");
        let Y = A.split(q);
        if (K === 1) return Y;
        let z = [],
            w = "";
        for (let H = 0; H < Y.length; H++) {
            if (w === "") w = Y[H];
            else w += q + Y[H];
            if ((H + 1) % K === 0) z.push(w), w = ""
        }
        if (w !== "") z.push(w);
        return z
    }
    var eWK = (A) => {
            let q = A.length,
                K = [],
                Y = !1,
                z = void 0,
                w = 0;
            for (let H = 0; H < q; ++H) {
                let $ = A[H];
                switch ($) {
                    case '"':
                        if (z !== "\\") Y = !Y;
                        break;
                    case ",":
                        if (!Y) K.push(A.slice(w, H)), w = H + 1;
                        break
                }
                z = $
            }
            return K.push(A.slice(w)), K.map((H) => {
                H = H.trim();
                let $ = H.length;
                if ($ < 2) return H;
                if (H[0] === '"' && H[$ - 1] === '"') H = H.slice(1, $ - 1);
                return H.replace(/\\"/g, '"')
            })
        },
        gJ8 = /^-?\d*(\.\d+)?$/;
    class Et1 {
        string;
        type;
        constructor(A, q) {
            if (this.string = A, this.type = q, !gJ8.test(A)) throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".')
        }
        toString() {
            return this.string
        }
        static[Symbol.hasInstance](A) {
            if (!A || typeof A !== "object") return !1;
            let q = A;
            return Et1.prototype.isPrototypeOf(A) || q.type === "bigDecimal" && gJ8.test(q.string)
        }
    }

    function AGK(A) {
        return new Et1(String(A), "bigDecimal")
    }
    Object.defineProperty(rJ8, "generateIdempotencyToken", {
        enumerable: !0,
        get: function() {
            return $WK.v4
        }
    });
    rJ8.LazyJsonString = JA1;
    rJ8.NumericValue = Et1;
    rJ8._parseEpochTimestamp = oWK;
    rJ8._parseRfc3339DateTimeWithOffset = aWK;
    rJ8._parseRfc7231DateTime = sWK;
    rJ8.copyDocumentWithTransform = OWK;
    rJ8.dateToUtcString = kWK;
    rJ8.expectBoolean = JWK;
    rJ8.expectByte = $g6;
    rJ8.expectFloat32 = Tt1;
    rJ8.expectInt = DWK;
    rJ8.expectInt32 = wg6;
    rJ8.expectLong = HE1;
    rJ8.expectNonNull = MWK;
    rJ8.expectNumber = wE1;
    rJ8.expectObject = UJ8;
    rJ8.expectShort = Hg6;
    rJ8.expectString = PWK;
    rJ8.expectUnion = WWK;
    rJ8.handleFloat = fWK;
    rJ8.limitedParseDouble = Jg6;
    rJ8.limitedParseFloat = VWK;
    rJ8.limitedParseFloat32 = NWK;
    rJ8.logger = $E1;
    rJ8.nv = AGK;
    rJ8.parseBoolean = _WK;
    rJ8.parseEpochTimestamp = bWK;
    rJ8.parseRfc3339DateTime = RWK;
    rJ8.parseRfc3339DateTimeWithOffset = CWK;
    rJ8.parseRfc7231DateTime = xWK;
    rJ8.quoteHeader = dWK;
    rJ8.splitEvery = tWK;
    rJ8.splitHeader = eWK;
    rJ8.strictParseByte = lJ8;
    rJ8.strictParseDouble = _g6;
    rJ8.strictParseFloat = GWK;
    rJ8.strictParseFloat32 = pJ8;
    rJ8.strictParseInt = TWK;
    rJ8.strictParseInt32 = vWK;
    rJ8.strictParseLong = cJ8;
    rJ8.strictParseShort = GH1
})
// @from(Ln 55784, Col 4)
oJ8 = R((dGK) => {
    var pGK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    dGK.isArrayBuffer = pGK
})
// @from(Ln 55788, Col 4)
Wg6 = R((rGK) => {
    var lGK = oJ8(),
        Pg6 = h1("buffer"),
        iGK = (A, q = 0, K = A.byteLength - q) => {
            if (!lGK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Pg6.Buffer.from(A, q, K)
        },
        nGK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Pg6.Buffer.from(A, q) : Pg6.Buffer.from(A)
        };
    rGK.fromArrayBuffer = iGK;
    rGK.fromString = nGK
})
// @from(Ln 55802, Col 4)
tJ8 = R((aJ8) => {
    Object.defineProperty(aJ8, "__esModule", {
        value: !0
    });
    aJ8.fromBase64 = void 0;
    var sGK = Wg6(),
        tGK = /^[A-Za-z0-9+/]*={0,2}$/,
        eGK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!tGK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, sGK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    aJ8.fromBase64 = eGK
})
// @from(Ln 55817, Col 4)
qX8 = R((eJ8) => {
    Object.defineProperty(eJ8, "__esModule", {
        value: !0
    });
    eJ8.toBase64 = void 0;
    var AZK = Wg6(),
        qZK = Z2(),
        KZK = (A) => {
            let q;
            if (typeof A === "string") q = (0, qZK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, AZK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    eJ8.toBase64 = KZK
})
// @from(Ln 55833, Col 4)
Gg6 = R((OE1) => {
    var KX8 = tJ8(),
        YX8 = qX8();
    Object.keys(KX8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(OE1, A)) Object.defineProperty(OE1, A, {
            enumerable: !0,
            get: function() {
                return KX8[A]
            }
        })
    });
    Object.keys(YX8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(OE1, A)) Object.defineProperty(OE1, A, {
            enumerable: !0,
            get: function() {
                return YX8[A]
            }
        })
    })
})
// @from(Ln 55853, Col 4)
HX8 = R((YZK) => {
    var zX8 = Z2();
    class wX8 {
        marshaller;
        serializer;
        deserializer;
        serdeContext;
        defaultContentType;
        constructor({
            marshaller: A,
            serializer: q,
            deserializer: K,
            serdeContext: Y,
            defaultContentType: z
        }) {
            this.marshaller = A, this.serializer = q, this.deserializer = K, this.serdeContext = Y, this.defaultContentType = z
        }
        async serializeEventStream({
            eventStream: A,
            requestSchema: q,
            initialRequest: K
        }) {
            let Y = this.marshaller,
                z = q.getEventStreamMember(),
                w = q.getMemberSchema(z),
                H = this.serializer,
                $ = this.defaultContentType,
                O = Symbol("initialRequestMarker"),
                _ = {
                    async * [Symbol.asyncIterator]() {
                        if (K) {
                            let J = {
                                ":event-type": {
                                    type: "string",
                                    value: "initial-request"
                                },
                                ":message-type": {
                                    type: "string",
                                    value: "event"
                                },
                                ":content-type": {
                                    type: "string",
                                    value: $
                                }
                            };
                            H.write(q, K);
                            let X = H.flush();
                            yield {
                                [O]: !0, headers: J, body: X
                            }
                        }
                        for await (let J of A) yield J
                    }
                };
            return Y.serialize(_, (J) => {
                if (J[O]) return {
                    headers: J.headers,
                    body: J.body
                };
                let X = Object.keys(J).find((G) => {
                        return G !== "__type"
                    }) ?? "",
                    {
                        additionalHeaders: D,
                        body: j,
                        eventType: M,
                        explicitPayloadContentType: P
                    } = this.writeEventBody(X, w, J);
                return {
                    headers: {
                        ":event-type": {
                            type: "string",
                            value: M
                        },
                        ":message-type": {
                            type: "string",
                            value: "event"
                        },
                        ":content-type": {
                            type: "string",
                            value: P ?? $
                        },
                        ...D
                    },
                    body: j
                }
            })
        }
        async deserializeEventStream({
            response: A,
            responseSchema: q,
            initialResponseContainer: K
        }) {
            let Y = this.marshaller,
                z = q.getEventStreamMember(),
                H = q.getMemberSchema(z).getMemberSchemas(),
                $ = Symbol("initialResponseMarker"),
                O = Y.deserialize(A.body, async (X) => {
                    let D = Object.keys(X).find((M) => {
                            return M !== "__type"
                        }) ?? "",
                        j = X[D].body;
                    if (D === "initial-response") {
                        let M = await this.deserializer.read(q, j);
                        return delete M[z], {
                            [$]: !0,
                            ...M
                        }
                    } else if (D in H) {
                        let M = H[D];
                        if (M.isStructSchema()) {
                            let P = {},
                                W = !1;
                            for (let [G, f] of M.structIterator()) {
                                let {
                                    eventHeader: Z,
                                    eventPayload: N
                                } = f.getMergedTraits();
                                if (W = W || Boolean(Z || N), N) {
                                    if (f.isBlobSchema()) P[G] = j;
                                    else if (f.isStringSchema()) P[G] = (this.serdeContext?.utf8Encoder ?? zX8.toUtf8)(j);
                                    else if (f.isStructSchema()) P[G] = await this.deserializer.read(f, j)
                                } else if (Z) {
                                    let T = X[D].headers[G]?.value;
                                    if (T != null)
                                        if (f.isNumericSchema())
                                            if (T && typeof T === "object" && "bytes" in T) P[G] = BigInt(T.toString());
                                            else P[G] = Number(T);
                                    else P[G] = T
                                }
                            }
                            if (W) return {
                                [D]: P
                            }
                        }
                        return {
                            [D]: await this.deserializer.read(M, j)
                        }
                    } else return {
                        $unknown: X
                    }
                }),
                _ = O[Symbol.asyncIterator](),
                J = await _.next();
            if (J.done) return O;
            if (J.value?.[$]) {
                if (!q) throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
                for (let [X, D] of Object.entries(J.value)) K[X] = D
            }
            return {
                async * [Symbol.asyncIterator]() {
                    if (!J?.value?.[$]) yield J.value;
                    while (!0) {
                        let {
                            done: X,
                            value: D
                        } = await _.next();
                        if (X) break;
                        yield D
                    }
                }
            }
        }
        writeEventBody(A, q, K) {
            let Y = this.serializer,
                z = A,
                w = null,
                H, $ = (() => {
                    return q.getSchema()[4].includes(A)
                })(),
                O = {};
            if (!$) {
                let [X, D] = K[A];
                z = X, Y.write(15, D)
            } else {
                let X = q.getMemberSchema(A);
                if (X.isStructSchema()) {
                    for (let [D, j] of X.structIterator()) {
                        let {
                            eventHeader: M,
                            eventPayload: P
                        } = j.getMergedTraits();
                        if (P) {
                            w = D;
                            break
                        } else if (M) {
                            let W = K[A][D],
                                G = "binary";
                            if (j.isNumericSchema())
                                if (-2147483648 <= W && W <= 2147483647) G = "integer";
                                else G = "long";
                            else if (j.isTimestampSchema()) G = "timestamp";
                            else if (j.isStringSchema()) G = "string";
                            else if (j.isBooleanSchema()) G = "boolean";
                            if (W != null) O[D] = {
                                type: G,
                                value: W
                            }, delete K[A][D]
                        }
                    }
                    if (w !== null) {
                        let D = X.getMemberSchema(w);
                        if (D.isBlobSchema()) H = "application/octet-stream";
                        else if (D.isStringSchema()) H = "text/plain";
                        Y.write(D, K[A][w])
                    } else Y.write(X, K[A])
                } else throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.")
            }
            let _ = Y.flush();
            return {
                body: typeof _ === "string" ? (this.serdeContext?.utf8Decoder ?? zX8.fromUtf8)(_) : _,
                eventType: z,
                explicitPayloadContentType: H,
                additionalHeaders: O
            }
        }
    }
    YZK.EventStreamSerde = wX8
})
// @from(Ln 56072, Col 4)
rf = R((HZK) => {
    var kt1 = tQ6(),
        Zk = R$(),
        Gk = nf(),
        _E1 = ov1(),
        Lt1 = Gg6(),
        Zg6 = Z2(),
        XA1 = async (A = new Uint8Array, q) => {
            if (A instanceof Uint8Array) return kt1.Uint8ArrayBlobAdapter.mutate(A);
            if (!A) return kt1.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
            let K = q.streamCollector(A);
            return kt1.Uint8ArrayBlobAdapter.mutate(await K)
        };

    function JE1(A) {
        return encodeURIComponent(A).replace(/[!'()*]/g, function(q) {
            return "%" + q.charCodeAt(0).toString(16).toUpperCase()
        })
    }
    class VH1 {
        serdeContext;
        setSerdeContext(A) {
            this.serdeContext = A
        }
    }
    class Rt1 extends VH1 {
        options;
        constructor(A) {
            super();
            this.options = A
        }
        getRequestType() {
            return _E1.HttpRequest
        }
        getResponseType() {
            return _E1.HttpResponse
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
            let Y = Zk.NormalizedSchema.of(q.input),
                z = Zk.translateTraits(q.traits ?? {});
            if (z.endpoint) {
                let w = z.endpoint?.[0];
                if (typeof w === "string") {
                    let H = [...Y.structIterator()].filter(([, $]) => $.getMergedTraits().hostLabel);
                    for (let [$] of H) {
                        let O = K[$];
                        if (typeof O !== "string") throw Error(`@smithy/core/schema - ${$} in input must be a string as hostLabel.`);
                        w = w.replace(`{${$}}`, O)
                    }
                    A.hostname = w + A.hostname
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
            } = await Promise.resolve().then(() => o(HX8()));
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
    class $X8 extends Rt1 {
        async serializeRequest(A, q, K) {
            let Y = {
                    ...q ?? {}
                },
                z = this.serializer,
                w = {},
                H = {},
                $ = await K.endpoint(),
                O = Zk.NormalizedSchema.of(A?.input),
                _ = O.getSchema(),
                J = !1,
                X, D = new _E1.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "",
                    fragment: void 0,
                    query: w,
                    headers: H,
                    body: void 0
                });
            if ($) {
                this.updateServiceEndpoint(D, $), this.setHostPrefix(D, A, Y);
                let j = Zk.translateTraits(A.traits);
                if (j.http) {
                    D.method = j.http[0];
                    let [M, P] = j.http[1].split("?");
                    if (D.path == "/") D.path = M;
                    else D.path += M;
                    let W = new URLSearchParams(P ?? "");
                    Object.assign(w, Object.fromEntries(W))
                }
            }
            for (let [j, M] of O.structIterator()) {
                let P = M.getMergedTraits() ?? {},
                    W = Y[j];
                if (W == null && !M.isIdempotencyToken()) continue;
                if (P.httpPayload) {
                    if (M.isStreaming())
                        if (M.isStructSchema()) {
                            if (Y[j]) X = await this.serializeEventStream({
                                eventStream: Y[j],
                                requestSchema: O
                            })
                        } else X = W;
                    else z.write(M, W), X = z.flush();
                    delete Y[j]
                } else if (P.httpLabel) {
                    z.write(M, W);
                    let G = z.flush();
                    if (D.path.includes(`{${j}+}`)) D.path = D.path.replace(`{${j}+}`, G.split("/").map(JE1).join("/"));
                    else if (D.path.includes(`{${j}}`)) D.path = D.path.replace(`{${j}}`, JE1(G));
                    delete Y[j]
                } else if (P.httpHeader) z.write(M, W), H[P.httpHeader.toLowerCase()] = String(z.flush()), delete Y[j];
                else if (typeof P.httpPrefixHeaders === "string") {
                    for (let [G, f] of Object.entries(W)) {
                        let Z = P.httpPrefixHeaders + G;
                        z.write([M.getValueSchema(), {
                            httpHeader: Z
                        }], f), H[Z.toLowerCase()] = z.flush()
                    }
                    delete Y[j]
                } else if (P.httpQuery || P.httpQueryParams) this.serializeQuery(M, W, w), delete Y[j];
                else J = !0
            }
            if (J && Y) z.write(_, Y), X = z.flush();
            return D.headers = H, D.query = w, D.body = X, D
        }
        serializeQuery(A, q, K) {
            let Y = this.serializer,
                z = A.getMergedTraits();
            if (z.httpQueryParams) {
                for (let [w, H] of Object.entries(q))
                    if (!(w in K)) {
                        let $ = A.getValueSchema();
                        Object.assign($.getMergedTraits(), {
                            ...z,
                            httpQuery: w,
                            httpQueryParams: void 0
                        }), this.serializeQuery($, H, K)
                    } return
            }
            if (A.isListSchema()) {
                let w = !!A.getMergedTraits().sparse,
                    H = [];
                for (let $ of q) {
                    Y.write([A.getValueSchema(), z], $);
                    let O = Y.flush();
                    if (w || O !== void 0) H.push(O)
                }
                K[z.httpQuery] = H
            } else Y.write([A, z], q), K[z.httpQuery] = Y.flush()
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = Zk.NormalizedSchema.of(A.output),
                w = {};
            if (K.statusCode >= 300) {
                let $ = await XA1(K.body, q);
                if ($.byteLength > 0) Object.assign(w, await Y.read(15, $));
                throw await this.handleError(A, q, K, w, this.deserializeMetadata(K)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.")
            }
            for (let $ in K.headers) {
                let O = K.headers[$];
                delete K.headers[$], K.headers[$.toLowerCase()] = O
            }
            let H = await this.deserializeHttpMessage(z, q, K, w);
            if (H.length) {
                let $ = await XA1(K.body, q);
                if ($.byteLength > 0) {
                    let O = await Y.read(z, $);
                    for (let _ of H) w[_] = O[_]
                }
            } else if (H.discardResponseBody) await XA1(K.body, q);
            return w.$metadata = this.deserializeMetadata(K), w
        }
        async deserializeHttpMessage(A, q, K, Y, z) {
            let w;
            if (Y instanceof Set) w = z;
            else w = Y;
            let H = !0,
                $ = this.deserializer,
                O = Zk.NormalizedSchema.of(A),
                _ = [];
            for (let [J, X] of O.structIterator()) {
                let D = X.getMemberTraits();
                if (D.httpPayload) {
                    if (H = !1, X.isStreaming())
                        if (X.isStructSchema()) w[J] = await this.deserializeEventStream({
                            response: K,
                            responseSchema: O
                        });
                        else w[J] = kt1.sdkStreamMixin(K.body);
                    else if (K.body) {
                        let M = await XA1(K.body, q);
                        if (M.byteLength > 0) w[J] = await $.read(X, M)
                    }
                } else if (D.httpHeader) {
                    let j = String(D.httpHeader).toLowerCase(),
                        M = K.headers[j];
                    if (M != null)
                        if (X.isListSchema()) {
                            let P = X.getValueSchema();
                            P.getMergedTraits().httpHeader = j;
                            let W;
                            if (P.isTimestampSchema() && P.getSchema() === 4) W = Gk.splitEvery(M, ",", 2);
                            else W = Gk.splitHeader(M);
                            let G = [];
                            for (let f of W) G.push(await $.read(P, f.trim()));
                            w[J] = G
                        } else w[J] = await $.read(X, M)
                } else if (D.httpPrefixHeaders !== void 0) {
                    w[J] = {};
                    for (let [j, M] of Object.entries(K.headers))
                        if (j.startsWith(D.httpPrefixHeaders)) {
                            let P = X.getValueSchema();
                            P.getMergedTraits().httpHeader = j, w[J][j.slice(D.httpPrefixHeaders.length)] = await $.read(P, M)
                        }
                } else if (D.httpResponseCode) w[J] = K.statusCode;
                else _.push(J)
            }
            return _.discardResponseBody = H, _
        }
    }
    class OX8 extends Rt1 {
        async serializeRequest(A, q, K) {
            let Y = this.serializer,
                z = {},
                w = {},
                H = await K.endpoint(),
                $ = Zk.NormalizedSchema.of(A?.input),
                O = $.getSchema(),
                _, J = new _E1.HttpRequest({
                    protocol: "",
                    hostname: "",
                    port: void 0,
                    path: "/",
                    fragment: void 0,
                    query: z,
                    headers: w,
                    body: void 0
                });
            if (H) this.updateServiceEndpoint(J, H), this.setHostPrefix(J, A, q);
            let X = {
                ...q
            };
            if (q) {
                let D = $.getEventStreamMember();
                if (D) {
                    if (X[D]) {
                        let j = {};
                        for (let [M, P] of $.structIterator())
                            if (M !== D && X[M]) Y.write(P, X[M]), j[M] = Y.flush();
                        _ = await this.serializeEventStream({
                            eventStream: X[D],
                            requestSchema: $,
                            initialRequest: j
                        })
                    }
                } else Y.write(O, X), _ = Y.flush()
            }
            return J.headers = w, J.query = z, J.body = _, J.method = "POST", J
        }
        async deserializeResponse(A, q, K) {
            let Y = this.deserializer,
                z = Zk.NormalizedSchema.of(A.output),
                w = {};
            if (K.statusCode >= 300) {
                let $ = await XA1(K.body, q);
                if ($.byteLength > 0) Object.assign(w, await Y.read(15, $));
                throw await this.handleError(A, q, K, w, this.deserializeMetadata(K)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.")
            }
            for (let $ in K.headers) {
                let O = K.headers[$];
                delete K.headers[$], K.headers[$.toLowerCase()] = O
            }
            let H = z.getEventStreamMember();
            if (H) w[H] = await this.deserializeEventStream({
                response: K,
                responseSchema: z,
                initialResponseContainer: w
            });
            else {
                let $ = await XA1(K.body, q);
                if ($.byteLength > 0) Object.assign(w, await Y.read(z, $))
            }
            return w.$metadata = this.deserializeMetadata(K), w
        }
    }
    var _X8 = (A, q, K, Y, z, w) => {
        if (q != null && q[K] !== void 0) {
            let H = Y();
            if (H.length <= 0) throw Error("Empty value provided for input HTTP label: " + K + ".");
            A = A.replace(z, w ? H.split("/").map(($) => JE1($)).join("/") : JE1(H))
        } else throw Error("No value provided for input HTTP label: " + K + ".");
        return A
    };

    function wZK(A, q) {
        return new fg6(A, q)
    }
    class fg6 {
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
            return new _E1.HttpRequest({
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
                this.path = _X8(z, this.input, A, q, K, Y)
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

    function Vg6(A, q) {
        if (q.timestampFormat.useTrait) {
            if (A.isTimestampSchema() && (A.getSchema() === 5 || A.getSchema() === 6 || A.getSchema() === 7)) return A.getSchema()
        }
        let {
            httpLabel: K,
            httpPrefixHeaders: Y,
            httpHeader: z,
            httpQuery: w
        } = A.getMergedTraits();
        return (q.httpBindings ? typeof Y === "string" || Boolean(z) ? 6 : Boolean(w) || Boolean(K) ? 5 : void 0 : void 0) ?? q.timestampFormat.default
    }
    class Ng6 extends VH1 {
        settings;
        constructor(A) {
            super();
            this.settings = A
        }
        read(A, q) {
            let K = Zk.NormalizedSchema.of(A);
            if (K.isListSchema()) return Gk.splitHeader(q).map((Y) => this.read(K.getValueSchema(), Y));
            if (K.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? Lt1.fromBase64)(q);
            if (K.isTimestampSchema()) switch (Vg6(K, this.settings)) {
                case 5:
                    return Gk._parseRfc3339DateTimeWithOffset(q);
                case 6:
                    return Gk._parseRfc7231DateTime(q);
                case 7:
                    return Gk._parseEpochTimestamp(q);
                default:
                    return console.warn("Missing timestamp format, parsing value with Date constructor:", q), new Date(q)
            }
            if (K.isStringSchema()) {
                let Y = K.getMergedTraits().mediaType,
                    z = q;
                if (Y) {
                    if (K.getMergedTraits().httpHeader) z = this.base64ToUtf8(z);
                    if (Y === "application/json" || Y.endsWith("+json")) z = Gk.LazyJsonString.from(z);
                    return z
                }
            }
            if (K.isNumericSchema()) return Number(q);
            if (K.isBigIntegerSchema()) return BigInt(q);
            if (K.isBigDecimalSchema()) return new Gk.NumericValue(q, "bigDecimal");
            if (K.isBooleanSchema()) return String(q).toLowerCase() === "true";
            return q
        }
        base64ToUtf8(A) {
            return (this.serdeContext?.utf8Encoder ?? Zg6.toUtf8)((this.serdeContext?.base64Decoder ?? Lt1.fromBase64)(A))
        }
    }
    class JX8 extends VH1 {
        codecDeserializer;
        stringDeserializer;
        constructor(A, q) {
            super();
            this.codecDeserializer = A, this.stringDeserializer = new Ng6(q)
        }
        setSerdeContext(A) {
            this.stringDeserializer.setSerdeContext(A), this.codecDeserializer.setSerdeContext(A), this.serdeContext = A
        }
        read(A, q) {
            let K = Zk.NormalizedSchema.of(A),
                Y = K.getMergedTraits(),
                z = this.serdeContext?.utf8Encoder ?? Zg6.toUtf8;
            if (Y.httpHeader || Y.httpResponseCode) return this.stringDeserializer.read(K, z(q));
            if (Y.httpPayload) {
                if (K.isBlobSchema()) {
                    let w = this.serdeContext?.utf8Decoder ?? Zg6.fromUtf8;
                    if (typeof q === "string") return w(q);
                    return q
                } else if (K.isStringSchema()) {
                    if ("byteLength" in q) return z(q);
                    return q
                }
            }
            return this.codecDeserializer.read(K, q)
        }
    }
    class Tg6 extends VH1 {
        settings;
        stringBuffer = "";
        constructor(A) {
            super();
            this.settings = A
        }
        write(A, q) {
            let K = Zk.NormalizedSchema.of(A);
            switch (typeof q) {
                case "object":
                    if (q === null) {
                        this.stringBuffer = "null";
                        return
                    }
                    if (K.isTimestampSchema()) {
                        if (!(q instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${q} when schema expected Date in ${K.getName(!0)}`);
                        switch (Vg6(K, this.settings)) {
                            case 5:
                                this.stringBuffer = q.toISOString().replace(".000Z", "Z");
                                break;
                            case 6:
                                this.stringBuffer = Gk.dateToUtcString(q);
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
                        this.stringBuffer = (this.serdeContext?.base64Encoder ?? Lt1.toBase64)(q);
                        return
                    }
                    if (K.isListSchema() && Array.isArray(q)) {
                        let w = "";
                        for (let H of q) {
                            this.write([K.getValueSchema(), K.getMergedTraits()], H);
                            let $ = this.flush(),
                                O = K.getValueSchema().isTimestampSchema() ? $ : Gk.quoteHeader($);
                            if (w !== "") w += ", ";
                            w += O
                        }
                        this.stringBuffer = w;
                        return
                    }
                    this.stringBuffer = JSON.stringify(q, null, 2);
                    break;
                case "string":
                    let Y = K.getMergedTraits().mediaType,
                        z = q;
                    if (Y) {
                        if (Y === "application/json" || Y.endsWith("+json")) z = Gk.LazyJsonString.from(z);
                        if (K.getMergedTraits().httpHeader) {
                            this.stringBuffer = (this.serdeContext?.base64Encoder ?? Lt1.toBase64)(z.toString());
                            return
                        }
                    }
                    this.stringBuffer = q;
                    break;
                default:
                    if (K.isIdempotencyToken()) this.stringBuffer = Gk.generateIdempotencyToken();
                    else this.stringBuffer = String(q)
            }
        }
        flush() {
            let A = this.stringBuffer;
            return this.stringBuffer = "", A
        }
    }
    class XX8 {
        codecSerializer;
        stringSerializer;
        buffer;
        constructor(A, q, K = new Tg6(q)) {
            this.codecSerializer = A, this.stringSerializer = K
        }
        setSerdeContext(A) {
            this.codecSerializer.setSerdeContext(A), this.stringSerializer.setSerdeContext(A)
        }
        write(A, q) {
            let K = Zk.NormalizedSchema.of(A),
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
    HZK.FromStringShapeDeserializer = Ng6;
    HZK.HttpBindingProtocol = $X8;
    HZK.HttpInterceptingShapeDeserializer = JX8;
    HZK.HttpInterceptingShapeSerializer = XX8;
    HZK.HttpProtocol = Rt1;
    HZK.RequestBuilder = fg6;
    HZK.RpcProtocol = OX8;
    HZK.SerdeContext = VH1;
    HZK.ToStringShapeSerializer = Tg6;
    HZK.collectBody = XA1;
    HZK.determineTimestampFormat = Vg6;
    HZK.extendedEncodeURIComponent = JE1;
    HZK.requestBuilder = wZK;
    HZK.resolvedPath = _X8
})
// @from(Ln 56686, Col 4)
lz = R((EX8) => {
    var yt1 = MQ6(),
        DX8 = iP(),
        NZK = yQ6(),
        vg6 = ov1(),
        TZK = rf(),
        vZK = (A) => A[yt1.SMITHY_CONTEXT_KEY] || (A[yt1.SMITHY_CONTEXT_KEY] = {}),
        EZK = (A, q) => {
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

    function kZK(A) {
        let q = new Map;
        for (let K of A) q.set(K.schemeId, K);
        return q
    }
    var Eg6 = (A, q) => (K, Y) => async (z) => {
        let w = A.httpAuthSchemeProvider(await q.httpAuthSchemeParametersProvider(A, Y, z.input)),
            H = A.authSchemePreference ? await A.authSchemePreference() : [],
            $ = EZK(w, H),
            O = kZK(A.httpAuthSchemes),
            _ = DX8.getSmithyContext(Y),
            J = [];
        for (let X of $) {
            let D = O.get(X.schemeId);
            if (!D) {
                J.push(`HttpAuthScheme \`${X.schemeId}\` was not enabled for this service.`);
                continue
            }
            let j = D.identityProvider(await q.identityProviderConfigProvider(A));
            if (!j) {
                J.push(`HttpAuthScheme \`${X.schemeId}\` did not have an IdentityProvider configured.`);
                continue
            }
            let {
                identityProperties: M = {},
                signingProperties: P = {}
            } = X.propertiesExtractor?.(A, Y) || {};
            X.identityProperties = Object.assign(X.identityProperties || {}, M), X.signingProperties = Object.assign(X.signingProperties || {}, P), _.selectedHttpAuthScheme = {
                httpAuthOption: X,
                identity: await j(X.identityProperties),
                signer: D.signer
            };
            break
        }
        if (!_.selectedHttpAuthScheme) throw Error(J.join(`
`));
        return K(z)
    }, jX8 = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: "endpointV2Middleware"
    }, LZK = (A, {
        httpAuthSchemeParametersProvider: q,
        identityProviderConfigProvider: K
    }) => ({
        applyToStack: (Y) => {
            Y.addRelativeTo(Eg6(A, {
                httpAuthSchemeParametersProvider: q,
                identityProviderConfigProvider: K
            }), jX8)
        }
    }), MX8 = {
        step: "serialize",
        tags: ["HTTP_AUTH_SCHEME"],
        name: "httpAuthSchemeMiddleware",
        override: !0,
        relation: "before",
        toMiddleware: NZK.serializerMiddlewareOption.name
    }, RZK = (A, {
        httpAuthSchemeParametersProvider: q,
        identityProviderConfigProvider: K
    }) => ({
        applyToStack: (Y) => {
            Y.addRelativeTo(Eg6(A, {
                httpAuthSchemeParametersProvider: q,
                identityProviderConfigProvider: K
            }), MX8)
        }
    }), yZK = (A) => (q) => {
        throw q
    }, CZK = (A, q) => {}, PX8 = (A) => (q, K) => async (Y) => {
        if (!vg6.HttpRequest.isInstance(Y.request)) return q(Y);
        let w = DX8.getSmithyContext(K).selectedHttpAuthScheme;
        if (!w) throw Error("No HttpAuthScheme was selected: unable to sign request");
        let {
            httpAuthOption: {
                signingProperties: H = {}
            },
            identity: $,
            signer: O
        } = w, _ = await q({
            ...Y,
            request: await O.sign(Y.request, $, H)
        }).catch((O.errorHandler || yZK)(H));
        return (O.successHandler || CZK)(_.response, H), _
    }, WX8 = {
        step: "finalizeRequest",
        tags: ["HTTP_SIGNING"],
        name: "httpSigningMiddleware",
        aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
        override: !0,
        relation: "after",
        toMiddleware: "retryMiddleware"
    }, SZK = (A) => ({
        applyToStack: (q) => {
            q.addRelativeTo(PX8(), WX8)
        }
    }), hZK = (A) => {
        if (typeof A === "function") return A;
        let q = Promise.resolve(A);
        return () => q
    }, IZK = async (A, q, K, Y = (w) => w, ...z) => {
        let w = new A(K);
        return w = Y(w) ?? w, await q.send(w, ...z)
    };

    function xZK(A, q, K, Y, z) {
        return async function*(H, $, ...O) {
            let _ = $,
                J = H.startingToken ?? _[K],
                X = !0,
                D;
            while (X) {
                if (_[K] = J, z) _[z] = _[z] ?? H.pageSize;
                if (H.client instanceof A) D = await IZK(q, H.client, $, H.withCommand, ...O);
                else throw Error(`Invalid client, expected instance of ${A.name}`);
                yield D;
                let j = J;
                J = bZK(D, Y), X = !!(J && (!H.stopOnSameToken || J !== j))
            }
            return
        }
    }
    var bZK = (A, q) => {
        let K = A,
            Y = q.split(".");
        for (let z of Y) {
            if (!K || typeof K !== "object") return;
            K = K[z]
        }
        return K
    };

    function uZK(A, q, K) {
        if (!A.__smithy_context) A.__smithy_context = {
            features: {}
        };
        else if (!A.__smithy_context.features) A.__smithy_context.features = {};
        A.__smithy_context.features[q] = K
    }
    class GX8 {
        authSchemes = new Map;
        constructor(A) {
            for (let [q, K] of Object.entries(A))
                if (K !== void 0) this.authSchemes.set(q, K)
        }
        getIdentityProvider(A) {
            return this.authSchemes.get(A)
        }
    }
    class ZX8 {
        async sign(A, q, K) {
            if (!K) throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
            if (!K.name) throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
            if (!K.in) throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
            if (!q.apiKey) throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
            let Y = vg6.HttpRequest.clone(A);
            if (K.in === yt1.HttpApiKeyAuthLocation.QUERY) Y.query[K.name] = q.apiKey;
            else if (K.in === yt1.HttpApiKeyAuthLocation.HEADER) Y.headers[K.name] = K.scheme ? `${K.scheme} ${q.apiKey}` : q.apiKey;
            else throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + K.in + "`");
            return Y
        }
    }
    class fX8 {
        async sign(A, q, K) {
            let Y = vg6.HttpRequest.clone(A);
            if (!q.token) throw Error("request could not be signed with `token` since the `token` is not defined");
            return Y.headers.Authorization = `Bearer ${q.token}`, Y
        }
    }
    class VX8 {
        async sign(A, q, K) {
            return A
        }
    }
    var NX8 = (A) => function(K) {
            return vX8(K) && K.expiration.getTime() - Date.now() < A
        },
        TX8 = 300000,
        BZK = NX8(TX8),
        vX8 = (A) => A.expiration !== void 0,
        mZK = (A, q, K) => {
            if (A === void 0) return;
            let Y = typeof A !== "function" ? async () => Promise.resolve(A): A, z, w, H, $ = !1, O = async (_) => {
                if (!w) w = Y(_);
                try {
                    z = await w, H = !0, $ = !1
                } finally {
                    w = void 0
                }
                return z
            };
            if (q === void 0) return async (_) => {
                if (!H || _?.forceRefresh) z = await O(_);
                return z
            };
            return async (_) => {
                if (!H || _?.forceRefresh) z = await O(_);
                if ($) return z;
                if (!K(z)) return $ = !0, z;
                if (q(z)) return await O(_), z;
                return z
            }
        };
    Object.defineProperty(EX8, "requestBuilder", {
        enumerable: !0,
        get: function() {
            return TZK.requestBuilder
        }
    });
    EX8.DefaultIdentityProviderConfig = GX8;
    EX8.EXPIRATION_MS = TX8;
    EX8.HttpApiKeyAuthSigner = ZX8;
    EX8.HttpBearerAuthSigner = fX8;
    EX8.NoAuthSigner = VX8;
    EX8.createIsIdentityExpiredFunction = NX8;
    EX8.createPaginator = xZK;
    EX8.doesIdentityRequireRefresh = vX8;
    EX8.getHttpAuthSchemeEndpointRuleSetPlugin = LZK;
    EX8.getHttpAuthSchemePlugin = RZK;
    EX8.getHttpSigningPlugin = SZK;
    EX8.getSmithyContext = vZK;
    EX8.httpAuthSchemeEndpointRuleSetMiddlewareOptions = jX8;
    EX8.httpAuthSchemeMiddleware = Eg6;
    EX8.httpAuthSchemeMiddlewareOptions = MX8;
    EX8.httpSigningMiddleware = PX8;
    EX8.httpSigningMiddlewareOptions = WX8;
    EX8.isIdentityExpired = BZK;
    EX8.memoizeIdentityProvider = mZK;
    EX8.normalizeProvider = hZK;
    EX8.setFeature = uZK
})
// @from(Ln 56941, Col 4)
kX8 = R((JfK) => {
    JfK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(JfK.HttpAuthLocation || (JfK.HttpAuthLocation = {}));
    JfK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(JfK.HttpApiKeyAuthLocation || (JfK.HttpApiKeyAuthLocation = {}));
    JfK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(JfK.EndpointURLScheme || (JfK.EndpointURLScheme = {}));
    JfK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(JfK.AlgorithmId || (JfK.AlgorithmId = {}));
    var wfK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => JfK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => JfK.AlgorithmId.MD5,
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
        HfK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        $fK = (A) => {
            return wfK(A)
        },
        OfK = (A) => {
            return HfK(A)
        };
    JfK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(JfK.FieldPosition || (JfK.FieldPosition = {}));
    var _fK = "__smithy_context";
    JfK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(JfK.IniSectionType || (JfK.IniSectionType = {}));
    JfK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(JfK.RequestHandlerProtocol || (JfK.RequestHandlerProtocol = {}));
    JfK.SMITHY_CONTEXT_KEY = _fK;
    JfK.getDefaultClientConfiguration = $fK;
    JfK.resolveDefaultRuntimeConfig = OfK
})
// @from(Ln 57006, Col 4)
GC = R((xfK) => {
    var Ig6 = kX8();
    class LX8 {
        capacity;
        data = new Map;
        parameters = [];
        constructor({
            size: A,
            params: q
        }) {
            if (this.capacity = A ?? 50, q) this.parameters = q
        }
        get(A, q) {
            let K = this.hash(A);
            if (K === !1) return q();
            if (!this.data.has(K)) {
                if (this.data.size > this.capacity + 10) {
                    let Y = this.data.keys(),
                        z = 0;
                    while (!0) {
                        let {
                            value: w,
                            done: H
                        } = Y.next();
                        if (this.data.delete(w), H || ++z > 10) break
                    }
                }
                this.data.set(K, q())
            }
            return this.data.get(K)
        }
        size() {
            return this.data.size
        }
        hash(A) {
            let q = "",
                {
                    parameters: K
                } = this;
            if (K.length === 0) return !1;
            for (let Y of K) {
                let z = String(A[Y] ?? "");
                if (z.includes("|;")) return !1;
                q += z + "|;"
            }
            return q
        }
    }
    var MfK = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"),
        RX8 = (A) => MfK.test(A) || A.startsWith("[") && A.endsWith("]"),
        PfK = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"),
        bg6 = (A, q = !1) => {
            if (!q) return PfK.test(A);
            let K = A.split(".");
            for (let Y of K)
                if (!bg6(Y)) return !1;
            return !0
        },
        xg6 = {},
        DE1 = "endpoints";

    function Ci(A) {
        if (typeof A !== "object" || A == null) return A;
        if ("ref" in A) return `$${Ci(A.ref)}`;
        if ("fn" in A) return `${A.fn}(${(A.argv||[]).map(Ci).join(", ")})`;
        return JSON.stringify(A, null, 2)
    }
    class bG extends Error {
        constructor(A) {
            super(A);
            this.name = "EndpointError"
        }
    }
    var WfK = (A, q) => A === q,
        GfK = (A) => {
            let q = A.split("."),
                K = [];
            for (let Y of q) {
                let z = Y.indexOf("[");
                if (z !== -1) {
                    if (Y.indexOf("]") !== Y.length - 1) throw new bG(`Path: '${A}' does not end with ']'`);
                    let w = Y.slice(z + 1, -1);
                    if (Number.isNaN(parseInt(w))) throw new bG(`Invalid array index: '${w}' in path: '${A}'`);
                    if (z !== 0) K.push(Y.slice(0, z));
                    K.push(w)
                } else K.push(Y)
            }
            return K
        },
        yX8 = (A, q) => GfK(q).reduce((K, Y) => {
            if (typeof K !== "object") throw new bG(`Index '${Y}' in '${q}' not found in '${JSON.stringify(A)}'`);
            else if (Array.isArray(K)) return K[parseInt(Y)];
            return K[Y]
        }, A),
        ZfK = (A) => A != null,
        ffK = (A) => !A,
        hg6 = {
            [Ig6.EndpointURLScheme.HTTP]: 80,
            [Ig6.EndpointURLScheme.HTTPS]: 443
        },
        VfK = (A) => {
            let q = (() => {
                try {
                    if (A instanceof URL) return A;
                    if (typeof A === "object" && "hostname" in A) {
                        let {
                            hostname: D,
                            port: j,
                            protocol: M = "",
                            path: P = "",
                            query: W = {}
                        } = A, G = new URL(`${M}//${D}${j?`:${j}`:""}${P}`);
                        return G.search = Object.entries(W).map(([f, Z]) => `${f}=${Z}`).join("&"), G
                    }
                    return new URL(A)
                } catch (D) {
                    return null
                }
            })();
            if (!q) return console.error(`Unable to parse ${JSON.stringify(A)} as a whatwg URL.`), null;
            let K = q.href,
                {
                    host: Y,
                    hostname: z,
                    pathname: w,
                    protocol: H,
                    search: $
                } = q;
            if ($) return null;
            let O = H.slice(0, -1);
            if (!Object.values(Ig6.EndpointURLScheme).includes(O)) return null;
            let _ = RX8(z),
                J = K.includes(`${Y}:${hg6[O]}`) || typeof A === "string" && A.includes(`${Y}:${hg6[O]}`),
                X = `${Y}${J?`:${hg6[O]}`:""}`;
            return {
                scheme: O,
                authority: X,
                path: w,
                normalizedPath: w.endsWith("/") ? w : `${w}/`,
                isIp: _
            }
        },
        NfK = (A, q) => A === q,
        TfK = (A, q, K, Y) => {
            if (q >= K || A.length < K) return null;
            if (!Y) return A.substring(q, K);
            return A.substring(A.length - K, A.length - q)
        },
        vfK = (A) => encodeURIComponent(A).replace(/[!*'()]/g, (q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`),
        EfK = {
            booleanEquals: WfK,
            getAttr: yX8,
            isSet: ZfK,
            isValidHostLabel: bg6,
            not: ffK,
            parseURL: VfK,
            stringEquals: NfK,
            substring: TfK,
            uriEncode: vfK
        },
        CX8 = (A, q) => {
            let K = [],
                Y = {
                    ...q.endpointParams,
                    ...q.referenceRecord
                },
                z = 0;
            while (z < A.length) {
                let w = A.indexOf("{", z);
                if (w === -1) {
                    K.push(A.slice(z));
                    break
                }
                K.push(A.slice(z, w));
                let H = A.indexOf("}", w);
                if (H === -1) {
                    K.push(A.slice(w));
                    break
                }
                if (A[w + 1] === "{" && A[H + 1] === "}") K.push(A.slice(w + 1, H)), z = H + 2;
                let $ = A.substring(w + 1, H);
                if ($.includes("#")) {
                    let [O, _] = $.split("#");
                    K.push(yX8(Y[O], _))
                } else K.push(Y[$]);
                z = H + 1
            }
            return K.join("")
        },
        kfK = ({
            ref: A
        }, q) => {
            return {
                ...q.endpointParams,
                ...q.referenceRecord
            } [A]
        },
        Ct1 = (A, q, K) => {
            if (typeof A === "string") return CX8(A, K);
            else if (A.fn) return hX8.callFunction(A, K);
            else if (A.ref) return kfK(A, K);
            throw new bG(`'${q}': ${String(A)} is not a string, function or reference.`)
        },
        SX8 = ({
            fn: A,
            argv: q
        }, K) => {
            let Y = q.map((w) => ["boolean", "number"].includes(typeof w) ? w : hX8.evaluateExpression(w, "arg", K)),
                z = A.split(".");
            if (z[0] in xg6 && z[1] != null) return xg6[z[0]][z[1]](...Y);
            return EfK[A](...Y)
        },
        hX8 = {
            evaluateExpression: Ct1,
            callFunction: SX8
        },
        LfK = ({
            assign: A,
            ...q
        }, K) => {
            if (A && A in K.referenceRecord) throw new bG(`'${A}' is already defined in Reference Record.`);
            let Y = SX8(q, K);
            return K.logger?.debug?.(`${DE1} evaluateCondition: ${Ci(q)} = ${Ci(Y)}`), {
                result: Y === "" ? !0 : !!Y,
                ...A != null && {
                    toAssign: {
                        name: A,
                        value: Y
                    }
                }
            }
        },
        ug6 = (A = [], q) => {
            let K = {};
            for (let Y of A) {
                let {
                    result: z,
                    toAssign: w
                } = LfK(Y, {
                    ...q,
                    referenceRecord: {
                        ...q.referenceRecord,
                        ...K
                    }
                });
                if (!z) return {
                    result: z
                };
                if (w) K[w.name] = w.value, q.logger?.debug?.(`${DE1} assign: ${w.name} := ${Ci(w.value)}`)
            }
            return {
                result: !0,
                referenceRecord: K
            }
        },
        RfK = (A, q) => Object.entries(A).reduce((K, [Y, z]) => ({
            ...K,
            [Y]: z.map((w) => {
                let H = Ct1(w, "Header value entry", q);
                if (typeof H !== "string") throw new bG(`Header '${Y}' value '${H}' is not a string`);
                return H
            })
        }), {}),
        IX8 = (A, q) => Object.entries(A).reduce((K, [Y, z]) => ({
            ...K,
            [Y]: bX8.getEndpointProperty(z, q)
        }), {}),
        xX8 = (A, q) => {
            if (Array.isArray(A)) return A.map((K) => xX8(K, q));
            switch (typeof A) {
                case "string":
                    return CX8(A, q);
                case "object":
                    if (A === null) throw new bG(`Unexpected endpoint property: ${A}`);
                    return bX8.getEndpointProperties(A, q);
                case "boolean":
                    return A;
                default:
                    throw new bG(`Unexpected endpoint property type: ${typeof A}`)
            }
        },
        bX8 = {
            getEndpointProperty: xX8,
            getEndpointProperties: IX8
        },
        yfK = (A, q) => {
            let K = Ct1(A, "Endpoint URL", q);
            if (typeof K === "string") try {
                return new URL(K)
            } catch (Y) {
                throw console.error(`Failed to construct URL with ${K}`, Y), Y
            }
            throw new bG(`Endpoint URL must be a string, got ${typeof K}`)
        },
        CfK = (A, q) => {
            let {
                conditions: K,
                endpoint: Y
            } = A, {
                result: z,
                referenceRecord: w
            } = ug6(K, q);
            if (!z) return;
            let H = {
                    ...q,
                    referenceRecord: {
                        ...q.referenceRecord,
                        ...w
                    }
                },
                {
                    url: $,
                    properties: O,
                    headers: _
                } = Y;
            return q.logger?.debug?.(`${DE1} Resolving endpoint from template: ${Ci(Y)}`), {
                ..._ != null && {
                    headers: RfK(_, H)
                },
                ...O != null && {
                    properties: IX8(O, H)
                },
                url: yfK($, H)
            }
        },
        SfK = (A, q) => {
            let {
                conditions: K,
                error: Y
            } = A, {
                result: z,
                referenceRecord: w
            } = ug6(K, q);
            if (!z) return;
            throw new bG(Ct1(Y, "Error", {
                ...q,
                referenceRecord: {
                    ...q.referenceRecord,
                    ...w
                }
            }))
        },
        uX8 = (A, q) => {
            for (let K of A)
                if (K.type === "endpoint") {
                    let Y = CfK(K, q);
                    if (Y) return Y
                } else if (K.type === "error") SfK(K, q);
            else if (K.type === "tree") {
                let Y = BX8.evaluateTreeRule(K, q);
                if (Y) return Y
            } else throw new bG(`Unknown endpoint rule: ${K}`);
            throw new bG("Rules evaluation failed")
        },
        hfK = (A, q) => {
            let {
                conditions: K,
                rules: Y
            } = A, {
                result: z,
                referenceRecord: w
            } = ug6(K, q);
            if (!z) return;
            return BX8.evaluateRules(Y, {
                ...q,
                referenceRecord: {
                    ...q.referenceRecord,
                    ...w
                }
            })
        },
        BX8 = {
            evaluateRules: uX8,
            evaluateTreeRule: hfK
        },
        IfK = (A, q) => {
            let {
                endpointParams: K,
                logger: Y
            } = q, {
                parameters: z,
                rules: w
            } = A;
            q.logger?.debug?.(`${DE1} Initial EndpointParams: ${Ci(K)}`);
            let H = Object.entries(z).filter(([, _]) => _.default != null).map(([_, J]) => [_, J.default]);
            if (H.length > 0)
                for (let [_, J] of H) K[_] = K[_] ?? J;
            let $ = Object.entries(z).filter(([, _]) => _.required).map(([_]) => _);
            for (let _ of $)
                if (K[_] == null) throw new bG(`Missing required parameter: '${_}'`);
            let O = uX8(w, {
                endpointParams: K,
                logger: Y,
                referenceRecord: {}
            });
            return q.logger?.debug?.(`${DE1} Resolved endpoint: ${Ci(O)}`), O
        };
    xfK.EndpointCache = LX8;
    xfK.EndpointError = bG;
    xfK.customEndpointFunctions = xg6;
    xfK.isIpAddress = RX8;
    xfK.isValidHostLabel = bg6;
    xfK.resolveEndpoint = IfK
})
// @from(Ln 57410, Col 4)
mX8 = R((UfK) => {
    function gfK(A) {
        let q = {};
        if (A = A.replace(/^\?/, ""), A)
            for (let K of A.split("&")) {
                let [Y, z = null] = K.split("=");
                if (Y = decodeURIComponent(Y), z) z = decodeURIComponent(z);
                if (!(Y in q)) q[Y] = z;
                else if (Array.isArray(q[Y])) q[Y].push(z);
                else q[Y] = [q[Y], z]
            }
        return q
    }
    UfK.parseQueryString = gfK
})
// @from(Ln 57425, Col 4)
fk = R((cfK) => {
    var dfK = mX8(),
        FX8 = (A) => {
            if (typeof A === "string") return FX8(new URL(A));
            let {
                hostname: q,
                pathname: K,
                port: Y,
                protocol: z,
                search: w
            } = A, H;
            if (w) H = dfK.parseQueryString(w);
            return {
                hostname: q,
                port: Y ? parseInt(Y) : void 0,
                protocol: z,
                path: K,
                query: H
            }
        };
    cfK.parseUrl = FX8
})
// @from(Ln 57447, Col 4)
zb = R((St1) => {
    var NH1 = GC(),
        ifK = fk(),
        gX8 = (A, q = !1) => {
            if (q) {
                for (let K of A.split("."))
                    if (!gX8(K)) return !1;
                return !0
            }
            if (!NH1.isValidHostLabel(A)) return !1;
            if (A.length < 3 || A.length > 63) return !1;
            if (A !== A.toLowerCase()) return !1;
            if (NH1.isIpAddress(A)) return !1;
            return !0
        },
        QX8 = ":",
        nfK = "/",
        rfK = (A) => {
            let q = A.split(QX8);
            if (q.length < 6) return null;
            let [K, Y, z, w, H, ...$] = q;
            if (K !== "arn" || Y === "" || z === "" || $.join(QX8) === "") return null;
            let O = $.map((_) => _.split(nfK)).flat();
            return {
                partition: Y,
                service: z,
                region: w,
                accountId: H,
                resourceId: O
            }
        },
        ofK = [{
            id: "aws",
            outputs: {
                dnsSuffix: "amazonaws.com",
                dualStackDnsSuffix: "api.aws",
                implicitGlobalRegion: "us-east-1",
                name: "aws",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
            regions: {
                "af-south-1": {
                    description: "Africa (Cape Town)"
                },
                "ap-east-1": {
                    description: "Asia Pacific (Hong Kong)"
                },
                "ap-east-2": {
                    description: "Asia Pacific (Taipei)"
                },
                "ap-northeast-1": {
                    description: "Asia Pacific (Tokyo)"
                },
                "ap-northeast-2": {
                    description: "Asia Pacific (Seoul)"
                },
                "ap-northeast-3": {
                    description: "Asia Pacific (Osaka)"
                },
                "ap-south-1": {
                    description: "Asia Pacific (Mumbai)"
                },
                "ap-south-2": {
                    description: "Asia Pacific (Hyderabad)"
                },
                "ap-southeast-1": {
                    description: "Asia Pacific (Singapore)"
                },
                "ap-southeast-2": {
                    description: "Asia Pacific (Sydney)"
                },
                "ap-southeast-3": {
                    description: "Asia Pacific (Jakarta)"
                },
                "ap-southeast-4": {
                    description: "Asia Pacific (Melbourne)"
                },
                "ap-southeast-5": {
                    description: "Asia Pacific (Malaysia)"
                },
                "ap-southeast-6": {
                    description: "Asia Pacific (New Zealand)"
                },
                "ap-southeast-7": {
                    description: "Asia Pacific (Thailand)"
                },
                "aws-global": {
                    description: "aws global region"
                },
                "ca-central-1": {
                    description: "Canada (Central)"
                },
                "ca-west-1": {
                    description: "Canada West (Calgary)"
                },
                "eu-central-1": {
                    description: "Europe (Frankfurt)"
                },
                "eu-central-2": {
                    description: "Europe (Zurich)"
                },
                "eu-north-1": {
                    description: "Europe (Stockholm)"
                },
                "eu-south-1": {
                    description: "Europe (Milan)"
                },
                "eu-south-2": {
                    description: "Europe (Spain)"
                },
                "eu-west-1": {
                    description: "Europe (Ireland)"
                },
                "eu-west-2": {
                    description: "Europe (London)"
                },
                "eu-west-3": {
                    description: "Europe (Paris)"
                },
                "il-central-1": {
                    description: "Israel (Tel Aviv)"
                },
                "me-central-1": {
                    description: "Middle East (UAE)"
                },
                "me-south-1": {
                    description: "Middle East (Bahrain)"
                },
                "mx-central-1": {
                    description: "Mexico (Central)"
                },
                "sa-east-1": {
                    description: "South America (Sao Paulo)"
                },
                "us-east-1": {
                    description: "US East (N. Virginia)"
                },
                "us-east-2": {
                    description: "US East (Ohio)"
                },
                "us-west-1": {
                    description: "US West (N. California)"
                },
                "us-west-2": {
                    description: "US West (Oregon)"
                }
            }
        }, {
            id: "aws-cn",
            outputs: {
                dnsSuffix: "amazonaws.com.cn",
                dualStackDnsSuffix: "api.amazonwebservices.com.cn",
                implicitGlobalRegion: "cn-northwest-1",
                name: "aws-cn",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^cn\\-\\w+\\-\\d+$",
            regions: {
                "aws-cn-global": {
                    description: "aws-cn global region"
                },
                "cn-north-1": {
                    description: "China (Beijing)"
                },
                "cn-northwest-1": {
                    description: "China (Ningxia)"
                }
            }
        }, {
            id: "aws-eusc",
            outputs: {
                dnsSuffix: "amazonaws.eu",
                dualStackDnsSuffix: "api.amazonwebservices.eu",
                implicitGlobalRegion: "eusc-de-east-1",
                name: "aws-eusc",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
            regions: {
                "eusc-de-east-1": {
                    description: "EU (Germany)"
                }
            }
        }, {
            id: "aws-iso",
            outputs: {
                dnsSuffix: "c2s.ic.gov",
                dualStackDnsSuffix: "api.aws.ic.gov",
                implicitGlobalRegion: "us-iso-east-1",
                name: "aws-iso",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-global": {
                    description: "aws-iso global region"
                },
                "us-iso-east-1": {
                    description: "US ISO East"
                },
                "us-iso-west-1": {
                    description: "US ISO WEST"
                }
            }
        }, {
            id: "aws-iso-b",
            outputs: {
                dnsSuffix: "sc2s.sgov.gov",
                dualStackDnsSuffix: "api.aws.scloud",
                implicitGlobalRegion: "us-isob-east-1",
                name: "aws-iso-b",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-b-global": {
                    description: "aws-iso-b global region"
                },
                "us-isob-east-1": {
                    description: "US ISOB East (Ohio)"
                },
                "us-isob-west-1": {
                    description: "US ISOB West"
                }
            }
        }, {
            id: "aws-iso-e",
            outputs: {
                dnsSuffix: "cloud.adc-e.uk",
                dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
                implicitGlobalRegion: "eu-isoe-west-1",
                name: "aws-iso-e",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-e-global": {
                    description: "aws-iso-e global region"
                },
                "eu-isoe-west-1": {
                    description: "EU ISOE West"
                }
            }
        }, {
            id: "aws-iso-f",
            outputs: {
                dnsSuffix: "csp.hci.ic.gov",
                dualStackDnsSuffix: "api.aws.hci.ic.gov",
                implicitGlobalRegion: "us-isof-south-1",
                name: "aws-iso-f",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-f-global": {
                    description: "aws-iso-f global region"
                },
                "us-isof-east-1": {
                    description: "US ISOF EAST"
                },
                "us-isof-south-1": {
                    description: "US ISOF SOUTH"
                }
            }
        }, {
            id: "aws-us-gov",
            outputs: {
                dnsSuffix: "amazonaws.com",
                dualStackDnsSuffix: "api.aws",
                implicitGlobalRegion: "us-gov-west-1",
                name: "aws-us-gov",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
            regions: {
                "aws-us-gov-global": {
                    description: "aws-us-gov global region"
                },
                "us-gov-east-1": {
                    description: "AWS GovCloud (US-East)"
                },
                "us-gov-west-1": {
                    description: "AWS GovCloud (US-West)"
                }
            }
        }],
        afK = "1.1",
        UX8 = {
            partitions: ofK,
            version: afK
        },
        pX8 = UX8,
        dX8 = "",
        cX8 = (A) => {
            let {
                partitions: q
            } = pX8;
            for (let Y of q) {
                let {
                    regions: z,
                    outputs: w
                } = Y;
                for (let [H, $] of Object.entries(z))
                    if (H === A) return {
                        ...w,
                        ...$
                    }
            }
            for (let Y of q) {
                let {
                    regionRegex: z,
                    outputs: w
                } = Y;
                if (new RegExp(z).test(A)) return {
                    ...w
                }
            }
            let K = q.find((Y) => Y.id === "aws");
            if (!K) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
            return {
                ...K.outputs
            }
        },
        lX8 = (A, q = "") => {
            pX8 = A, dX8 = q
        },
        sfK = () => {
            lX8(UX8, "")
        },
        tfK = () => dX8,
        iX8 = {
            isVirtualHostableS3Bucket: gX8,
            parseArn: rfK,
            partition: cX8
        };
    NH1.customEndpointFunctions.aws = iX8;
    var efK = (A) => {
            if (typeof A.endpointProvider !== "function") throw Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
            let {
                endpoint: q
            } = A;
            if (q === void 0) A.endpoint = async () => {
                return nX8(A.endpointProvider({
                    Region: typeof A.region === "function" ? await A.region() : A.region,
                    UseDualStack: typeof A.useDualstackEndpoint === "function" ? await A.useDualstackEndpoint() : A.useDualstackEndpoint,
                    UseFIPS: typeof A.useFipsEndpoint === "function" ? await A.useFipsEndpoint() : A.useFipsEndpoint,
                    Endpoint: void 0
                }, {
                    logger: A.logger
                }))
            };
            return A
        },
        nX8 = (A) => ifK.parseUrl(A.url);
    Object.defineProperty(St1, "EndpointError", {
        enumerable: !0,
        get: function() {
            return NH1.EndpointError
        }
    });
    Object.defineProperty(St1, "isIpAddress", {
        enumerable: !0,
        get: function() {
            return NH1.isIpAddress
        }
    });
    Object.defineProperty(St1, "resolveEndpoint", {
        enumerable: !0,
        get: function() {
            return NH1.resolveEndpoint
        }
    });
    St1.awsEndpointFunctions = iX8;
    St1.getUserAgentPrefix = tfK;
    St1.partition = cX8;
    St1.resolveDefaultAwsRegionalEndpointsConfig = efK;
    St1.setPartitionInfo = lX8;
    St1.toEndpointV1 = nX8;
    St1.useDefaultPartitionInfo = sfK
})
// @from(Ln 57836, Col 4)
rX8 = R((DVK) => {
    DVK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(DVK.HttpAuthLocation || (DVK.HttpAuthLocation = {}));
    DVK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(DVK.HttpApiKeyAuthLocation || (DVK.HttpApiKeyAuthLocation = {}));
    DVK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(DVK.EndpointURLScheme || (DVK.EndpointURLScheme = {}));
    DVK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(DVK.AlgorithmId || (DVK.AlgorithmId = {}));
    var $VK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => DVK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => DVK.AlgorithmId.MD5,
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
        OVK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        _VK = (A) => {
            return $VK(A)
        },
        JVK = (A) => {
            return OVK(A)
        };
    DVK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(DVK.FieldPosition || (DVK.FieldPosition = {}));
    var XVK = "__smithy_context";
    DVK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(DVK.IniSectionType || (DVK.IniSectionType = {}));
    DVK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(DVK.RequestHandlerProtocol || (DVK.RequestHandlerProtocol = {}));
    DVK.SMITHY_CONTEXT_KEY = XVK;
    DVK.getDefaultClientConfiguration = _VK;
    DVK.resolveDefaultRuntimeConfig = JVK
})