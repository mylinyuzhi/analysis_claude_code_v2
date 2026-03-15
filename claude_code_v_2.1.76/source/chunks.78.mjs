
// @from(Ln 204797, Col 4)
Tr7 = x((LM9, fr7) => {
    LM9.STATUS_MAPPING = {
        mapped: 1,
        valid: 2,
        disallowed: 3,
        deviation: 6,
        ignored: 7
    }
})
// @from(Ln 204806, Col 4)
Er7 = x((th2, kr7) => {
    var wZ8 = Pr7(),
        sL = Zr7(),
        vr7 = Gr7(),
        {
            STATUS_MAPPING: At
        } = Tr7();

    function _Z8(A) {
        return /[^\x00-\x7F]/u.test(A)
    }

    function Nr7(A) {
        let q = 0,
            K = vr7.length - 1;
        while (q <= K) {
            let Y = Math.floor((q + K) / 2),
                z = vr7[Y],
                _ = Array.isArray(z[0]) ? z[0][0] : z[0],
                w = Array.isArray(z[0]) ? z[0][1] : z[0];
            if (_ <= A && w >= A) return z.slice(1);
            else if (_ > A) K = Y - 1;
            else q = Y + 1
        }
        return null
    }

    function hM9(A, {
        transitionalProcessing: q
    }) {
        let K = "";
        for (let Y of A) {
            let [z, _] = Nr7(Y.codePointAt(0));
            switch (z) {
                case At.disallowed:
                    K += Y;
                    break;
                case At.ignored:
                    break;
                case At.mapped:
                    if (q && Y === "ẞ") K += "ss";
                    else K += _;
                    break;
                case At.deviation:
                    if (q) K += _;
                    else K += Y;
                    break;
                case At.valid:
                    K += Y;
                    break
            }
        }
        return K
    }

    function SM9(A, {
        checkHyphens: q,
        checkBidi: K,
        checkJoiners: Y,
        transitionalProcessing: z,
        useSTD3ASCIIRules: _,
        isBidi: w
    }) {
        if (A.length === 0) return !0;
        if (A.normalize("NFC") !== A) return !1;
        let O = Array.from(A);
        if (q) {
            if (O[2] === "-" && O[3] === "-" || (A.startsWith("-") || A.endsWith("-"))) return !1
        }
        if (!q) {
            if (A.startsWith("xn--")) return !1
        }
        if (A.includes(".")) return !1;
        if (sL.combiningMarks.test(O[0])) return !1;
        for (let $ of O) {
            let H = $.codePointAt(0),
                [j] = Nr7(H);
            if (z) {
                if (j !== At.valid) return !1
            } else if (j !== At.valid && j !== At.deviation) return !1;
            if (_ && H <= 127) {
                if (!/^(?:[a-z]|[0-9]|-)$/u.test($)) return !1
            }
        }
        if (Y) {
            let $ = 0;
            for (let [H, j] of O.entries())
                if (j === "‌" || j === "‍") {
                    if (H > 0) {
                        if (sL.combiningClassVirama.test(O[H - 1])) continue;
                        if (j === "‌") {
                            let J = O.indexOf("‌", H + 1),
                                M = J < 0 ? O.slice($) : O.slice($, J);
                            if (sL.validZWNJ.test(M.join(""))) {
                                $ = H + 1;
                                continue
                            }
                        }
                    }
                    return !1
                }
        }
        if (K && w) {
            let $;
            if (sL.bidiS1LTR.test(O[0])) $ = !1;
            else if (sL.bidiS1RTL.test(O[0])) $ = !0;
            else return !1;
            if ($) {
                if (!sL.bidiS2.test(A) || !sL.bidiS3.test(A) || sL.bidiS4EN.test(A) && sL.bidiS4AN.test(A)) return !1
            } else if (!sL.bidiS5.test(A) || !sL.bidiS6.test(A)) return !1
        }
        return !0
    }

    function CM9(A) {
        let q = A.map((K) => {
            if (K.startsWith("xn--")) try {
                return wZ8.decode(K.substring(4))
            } catch {
                return ""
            }
            return K
        }).join(".");
        return sL.bidiDomain.test(q)
    }

    function Vr7(A, q) {
        let K = hM9(A, q);
        K = K.normalize("NFC");
        let Y = K.split("."),
            z = CM9(Y),
            _ = !1;
        for (let [w, O] of Y.entries()) {
            let $ = O,
                H = q.transitionalProcessing;
            if ($.startsWith("xn--")) {
                if (_Z8($)) {
                    _ = !0;
                    continue
                }
                try {
                    $ = wZ8.decode($.substring(4))
                } catch {
                    if (!q.ignoreInvalidPunycode) {
                        _ = !0;
                        continue
                    }
                }
                if (Y[w] = $, $ === "" || !_Z8($)) _ = !0;
                H = !1
            }
            if (_) continue;
            if (!SM9($, {
                    ...q,
                    transitionalProcessing: H,
                    isBidi: z
                })) _ = !0
        }
        return {
            string: Y.join("."),
            error: _
        }
    }

    function IM9(A, {
        checkHyphens: q = !1,
        checkBidi: K = !1,
        checkJoiners: Y = !1,
        useSTD3ASCIIRules: z = !1,
        verifyDNSLength: _ = !1,
        transitionalProcessing: w = !1,
        ignoreInvalidPunycode: O = !1
    } = {}) {
        let $ = Vr7(A, {
                checkHyphens: q,
                checkBidi: K,
                checkJoiners: Y,
                useSTD3ASCIIRules: z,
                transitionalProcessing: w,
                ignoreInvalidPunycode: O
            }),
            H = $.string.split(".");
        if (H = H.map((j) => {
                if (_Z8(j)) try {
                    return `xn--${wZ8.encode(j)}`
                } catch {
                    $.error = !0
                }
                return j
            }), _) {
            let j = H.join(".").length;
            if (j > 253 || j === 0) $.error = !0;
            for (let J = 0; J < H.length; ++J)
                if (H[J].length > 63 || H[J].length === 0) {
                    $.error = !0;
                    break
                }
        }
        if ($.error) return null;
        return H.join(".")
    }

    function bM9(A, {
        checkHyphens: q = !1,
        checkBidi: K = !1,
        checkJoiners: Y = !1,
        useSTD3ASCIIRules: z = !1,
        transitionalProcessing: _ = !1,
        ignoreInvalidPunycode: w = !1
    } = {}) {
        let O = Vr7(A, {
            checkHyphens: q,
            checkBidi: K,
            checkJoiners: Y,
            useSTD3ASCIIRules: z,
            transitionalProcessing: _,
            ignoreInvalidPunycode: w
        });
        return {
            domain: O.string,
            error: O.error
        }
    }
    kr7.exports = {
        toASCII: IM9,
        toUnicode: bM9
    }
})
// @from(Ln 205034, Col 4)
$Z8 = x((eh2, Lr7) => {
    function OZ8(A) {
        return A >= 48 && A <= 57
    }

    function yr7(A) {
        return A >= 65 && A <= 90 || A >= 97 && A <= 122
    }

    function xM9(A) {
        return yr7(A) || OZ8(A)
    }

    function uM9(A) {
        return OZ8(A) || A >= 65 && A <= 70 || A >= 97 && A <= 102
    }
    Lr7.exports = {
        isASCIIDigit: OZ8,
        isASCIIAlpha: yr7,
        isASCIIAlphanumeric: xM9,
        isASCIIHex: uM9
    }
})
// @from(Ln 205057, Col 4)
LM1 = x((AS2, Rr7) => {
    var mM9 = new TextEncoder,
        BM9 = new TextDecoder("utf-8", {
            ignoreBOM: !0
        });

    function gM9(A) {
        return mM9.encode(A)
    }

    function FM9(A) {
        return BM9.decode(A)
    }
    Rr7.exports = {
        utf8Encode: gM9,
        utf8DecodeWithoutBOM: FM9
    }
})
// @from(Ln 205075, Col 4)
RM1 = x((qS2, ur7) => {
    var {
        isASCIIHex: hr7
    } = $Z8(), {
        utf8Encode: Sr7
    } = LM1();

    function OY(A) {
        return A.codePointAt(0)
    }

    function pM9(A) {
        let q = A.toString(16).toUpperCase();
        if (q.length === 1) q = `0${q}`;
        return `%${q}`
    }

    function Cr7(A) {
        let q = new Uint8Array(A.byteLength),
            K = 0;
        for (let Y = 0; Y < A.byteLength; ++Y) {
            let z = A[Y];
            if (z !== 37) q[K++] = z;
            else if (z === 37 && (!hr7(A[Y + 1]) || !hr7(A[Y + 2]))) q[K++] = z;
            else {
                let _ = parseInt(String.fromCodePoint(A[Y + 1], A[Y + 2]), 16);
                q[K++] = _, Y += 2
            }
        }
        return q.slice(0, K)
    }

    function QM9(A) {
        let q = Sr7(A);
        return Cr7(q)
    }

    function HZ8(A) {
        return A <= 31 || A > 126
    }
    var UM9 = new Set([OY(" "), OY('"'), OY("<"), OY(">"), OY("`")]);

    function dM9(A) {
        return HZ8(A) || UM9.has(A)
    }
    var cM9 = new Set([OY(" "), OY('"'), OY("#"), OY("<"), OY(">")]);

    function jZ8(A) {
        return HZ8(A) || cM9.has(A)
    }

    function lM9(A) {
        return jZ8(A) || A === OY("'")
    }
    var iM9 = new Set([OY("?"), OY("`"), OY("{"), OY("}"), OY("^")]);

    function Ir7(A) {
        return jZ8(A) || iM9.has(A)
    }
    var nM9 = new Set([OY("/"), OY(":"), OY(";"), OY("="), OY("@"), OY("["), OY("\\"), OY("]"), OY("|")]);

    function br7(A) {
        return Ir7(A) || nM9.has(A)
    }
    var rM9 = new Set([OY("$"), OY("%"), OY("&"), OY("+"), OY(",")]);

    function oM9(A) {
        return br7(A) || rM9.has(A)
    }
    var aM9 = new Set([OY("!"), OY("'"), OY("("), OY(")"), OY("~")]);

    function sM9(A) {
        return oM9(A) || aM9.has(A)
    }

    function xr7(A, q) {
        let K = Sr7(A),
            Y = "";
        for (let z of K)
            if (!q(z)) Y += String.fromCharCode(z);
            else Y += pM9(z);
        return Y
    }

    function tM9(A, q) {
        return xr7(String.fromCodePoint(A), q)
    }

    function eM9(A, q, K = !1) {
        let Y = "";
        for (let z of A)
            if (K && z === " ") Y += "+";
            else Y += xr7(z, q);
        return Y
    }
    ur7.exports = {
        isC0ControlPercentEncode: HZ8,
        isFragmentPercentEncode: dM9,
        isQueryPercentEncode: jZ8,
        isSpecialQueryPercentEncode: lM9,
        isPathPercentEncode: Ir7,
        isUserinfoPercentEncode: br7,
        isURLEncodedPercentEncode: sM9,
        percentDecodeString: QM9,
        percentDecodeBytes: Cr7,
        utf8PercentEncodeString: eM9,
        utf8PercentEncodeCodePoint: tM9
    }
})
// @from(Ln 205184, Col 4)
WZ8 = x((yD9, Yf) => {
    var AD9 = Er7(),
        rP = $Z8(),
        {
            utf8DecodeWithoutBOM: qD9
        } = LM1(),
        {
            percentDecodeString: KD9,
            utf8PercentEncodeCodePoint: SM1,
            utf8PercentEncodeString: CM1,
            isC0ControlPercentEncode: pr7,
            isFragmentPercentEncode: YD9,
            isQueryPercentEncode: zD9,
            isSpecialQueryPercentEncode: _D9,
            isPathPercentEncode: wD9,
            isUserinfoPercentEncode: DZ8
        } = RM1();

    function oA(A) {
        return A.codePointAt(0)
    }
    var Qr7 = {
            ftp: 21,
            file: null,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
        },
        c5 = Symbol("failure");

    function mr7(A) {
        return [...A].length
    }

    function Br7(A, q) {
        let K = A[q];
        return isNaN(K) ? void 0 : String.fromCodePoint(K)
    }

    function gr7(A) {
        return A === "." || A.toLowerCase() === "%2e"
    }

    function OD9(A) {
        return A = A.toLowerCase(), A === ".." || A === "%2e." || A === ".%2e" || A === "%2e%2e"
    }

    function $D9(A, q) {
        return rP.isASCIIAlpha(A) && (q === oA(":") || q === oA("|"))
    }

    function Ur7(A) {
        return A.length === 2 && rP.isASCIIAlpha(A.codePointAt(0)) && (A[1] === ":" || A[1] === "|")
    }

    function HD9(A) {
        return A.length === 2 && rP.isASCIIAlpha(A.codePointAt(0)) && A[1] === ":"
    }

    function dr7(A) {
        return A.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1
    }

    function jD9(A) {
        return dr7(A) || A.search(/[\u0000-\u001F]|%|\u007F/u) !== -1
    }

    function hM1(A) {
        return Qr7[A] !== void 0
    }

    function nP(A) {
        return hM1(A.scheme)
    }

    function JZ8(A) {
        return !hM1(A.scheme)
    }

    function cr7(A) {
        return Qr7[A]
    }

    function lr7(A) {
        if (A === "") return c5;
        let q = 10;
        if (A.length >= 2 && A.charAt(0) === "0" && A.charAt(1).toLowerCase() === "x") A = A.substring(2), q = 16;
        else if (A.length >= 2 && A.charAt(0) === "0") A = A.substring(1), q = 8;
        if (A === "") return 0;
        let K = /[^0-7]/u;
        if (q === 10) K = /[^0-9]/u;
        if (q === 16) K = /[^0-9A-Fa-f]/u;
        if (K.test(A)) return c5;
        return parseInt(A, q)
    }

    function JD9(A) {
        let q = A.split(".");
        if (q[q.length - 1] === "") {
            if (q.length > 1) q.pop()
        }
        if (q.length > 4) return c5;
        let K = [];
        for (let _ of q) {
            let w = lr7(_);
            if (w === c5) return c5;
            K.push(w)
        }
        for (let _ = 0; _ < K.length - 1; ++_)
            if (K[_] > 255) return c5;
        if (K[K.length - 1] >= 256 ** (5 - K.length)) return c5;
        let Y = K.pop(),
            z = 0;
        for (let _ of K) Y += _ * 256 ** (3 - z), ++z;
        return Y
    }

    function MD9(A) {
        let q = "",
            K = A;
        for (let Y = 1; Y <= 4; ++Y) {
            if (q = String(K % 256) + q, Y !== 4) q = `.${q}`;
            K = Math.floor(K / 256)
        }
        return q
    }

    function DD9(A) {
        let q = [0, 0, 0, 0, 0, 0, 0, 0],
            K = 0,
            Y = null,
            z = 0;
        if (A = Array.from(A, (_) => _.codePointAt(0)), A[z] === oA(":")) {
            if (A[z + 1] !== oA(":")) return c5;
            z += 2, ++K, Y = K
        }
        while (z < A.length) {
            if (K === 8) return c5;
            if (A[z] === oA(":")) {
                if (Y !== null) return c5;
                ++z, ++K, Y = K;
                continue
            }
            let _ = 0,
                w = 0;
            while (w < 4 && rP.isASCIIHex(A[z])) _ = _ * 16 + parseInt(Br7(A, z), 16), ++z, ++w;
            if (A[z] === oA(".")) {
                if (w === 0) return c5;
                if (z -= w, K > 6) return c5;
                let O = 0;
                while (A[z] !== void 0) {
                    let $ = null;
                    if (O > 0)
                        if (A[z] === oA(".") && O < 4) ++z;
                        else return c5;
                    if (!rP.isASCIIDigit(A[z])) return c5;
                    while (rP.isASCIIDigit(A[z])) {
                        let H = parseInt(Br7(A, z));
                        if ($ === null) $ = H;
                        else if ($ === 0) return c5;
                        else $ = $ * 10 + H;
                        if ($ > 255) return c5;
                        ++z
                    }
                    if (q[K] = q[K] * 256 + $, ++O, O === 2 || O === 4) ++K
                }
                if (O !== 4) return c5;
                break
            } else if (A[z] === oA(":")) {
                if (++z, A[z] === void 0) return c5
            } else if (A[z] !== void 0) return c5;
            q[K] = _, ++K
        }
        if (Y !== null) {
            let _ = K - Y;
            K = 7;
            while (K !== 0 && _ > 0) {
                let w = q[Y + _ - 1];
                q[Y + _ - 1] = q[K], q[K] = w, --K, --_
            }
        } else if (Y === null && K !== 8) return c5;
        return q
    }

    function XD9(A) {
        let q = "",
            K = ZD9(A),
            Y = !1;
        for (let z = 0; z <= 7; ++z) {
            if (Y && A[z] === 0) continue;
            else if (Y) Y = !1;
            if (K === z) {
                q += z === 0 ? "::" : ":", Y = !0;
                continue
            }
            if (q += A[z].toString(16), z !== 7) q += ":"
        }
        return q
    }

    function MZ8(A, q = !1) {
        if (A[0] === "[") {
            if (A[A.length - 1] !== "]") return c5;
            return DD9(A.substring(1, A.length - 1))
        }
        if (q) return WD9(A);
        let K = qD9(KD9(A)),
            Y = GD9(K);
        if (Y === c5) return c5;
        if (PD9(Y)) return JD9(Y);
        return Y
    }

    function PD9(A) {
        let q = A.split(".");
        if (q[q.length - 1] === "") {
            if (q.length === 1) return !1;
            q.pop()
        }
        let K = q[q.length - 1];
        if (lr7(K) !== c5) return !0;
        if (/^[0-9]+$/u.test(K)) return !0;
        return !1
    }

    function WD9(A) {
        if (dr7(A)) return c5;
        return CM1(A, pr7)
    }

    function ZD9(A) {
        let q = null,
            K = 1,
            Y = null,
            z = 0;
        for (let _ = 0; _ < A.length; ++_)
            if (A[_] !== 0) {
                if (z > K) q = Y, K = z;
                Y = null, z = 0
            } else {
                if (Y === null) Y = _;
                ++z
            } if (z > K) return Y;
        return q
    }

    function XZ8(A) {
        if (typeof A === "number") return MD9(A);
        if (A instanceof Array) return `[${XD9(A)}]`;
        return A
    }

    function GD9(A, q = !1) {
        let K = AD9.toASCII(A, {
            checkHyphens: q,
            checkBidi: !0,
            checkJoiners: !0,
            useSTD3ASCIIRules: q,
            transitionalProcessing: !1,
            verifyDNSLength: q,
            ignoreInvalidPunycode: !1
        });
        if (K === null) return c5;
        if (!q) {
            if (K === "") return c5;
            if (jD9(K)) return c5
        }
        return K
    }

    function fD9(A) {
        let q = 0,
            K = A.length;
        for (; q < K; ++q)
            if (A.charCodeAt(q) > 32) break;
        for (; K > q; --K)
            if (A.charCodeAt(K - 1) > 32) break;
        return A.substring(q, K)
    }

    function TD9(A) {
        return A.replace(/\u0009|\u000A|\u000D/ug, "")
    }

    function ir7(A) {
        let {
            path: q
        } = A;
        if (q.length === 0) return;
        if (A.scheme === "file" && q.length === 1 && ND9(q[0])) return;
        q.pop()
    }

    function nr7(A) {
        return A.username !== "" || A.password !== ""
    }

    function vD9(A) {
        return A.host === null || A.host === "" || A.scheme === "file"
    }

    function Rg6(A) {
        return typeof A.path === "string"
    }

    function ND9(A) {
        return /^[A-Za-z]:$/u.test(A)
    }

    function cH(A, q, K, Y, z) {
        if (this.pointer = 0, this.input = A, this.base = q || null, this.encodingOverride = K || "utf-8", this.stateOverride = z, this.url = Y, this.failure = !1, this.parseError = !1, !this.url) {
            this.url = {
                scheme: "",
                username: "",
                password: "",
                host: null,
                port: null,
                path: [],
                query: null,
                fragment: null
            };
            let w = fD9(this.input);
            if (w !== this.input) this.parseError = !0;
            this.input = w
        }
        let _ = TD9(this.input);
        if (_ !== this.input) this.parseError = !0;
        this.input = _, this.state = z || "scheme start", this.buffer = "", this.atFlag = !1, this.arrFlag = !1, this.passwordTokenSeenFlag = !1, this.input = Array.from(this.input, (w) => w.codePointAt(0));
        for (; this.pointer <= this.input.length; ++this.pointer) {
            let w = this.input[this.pointer],
                O = isNaN(w) ? void 0 : String.fromCodePoint(w),
                $ = this[`parse ${this.state}`](w, O);
            if (!$) break;
            else if ($ === c5) {
                this.failure = !0;
                break
            }
        }
    }
    cH.prototype["parse scheme start"] = function(q, K) {
        if (rP.isASCIIAlpha(q)) this.buffer += K.toLowerCase(), this.state = "scheme";
        else if (!this.stateOverride) this.state = "no scheme", --this.pointer;
        else return this.parseError = !0, c5;
        return !0
    };
    cH.prototype["parse scheme"] = function(q, K) {
        if (rP.isASCIIAlphanumeric(q) || q === oA("+") || q === oA("-") || q === oA(".")) this.buffer += K.toLowerCase();
        else if (q === oA(":")) {
            if (this.stateOverride) {
                if (nP(this.url) && !hM1(this.buffer)) return !1;
                if (!nP(this.url) && hM1(this.buffer)) return !1;
                if ((nr7(this.url) || this.url.port !== null) && this.buffer === "file") return !1;
                if (this.url.scheme === "file" && this.url.host === "") return !1
            }
            if (this.url.scheme = this.buffer, this.stateOverride) {
                if (this.url.port === cr7(this.url.scheme)) this.url.port = null;
                return !1
            }
            if (this.buffer = "", this.url.scheme === "file") {
                if (this.input[this.pointer + 1] !== oA("/") || this.input[this.pointer + 2] !== oA("/")) this.parseError = !0;
                this.state = "file"
            } else if (nP(this.url) && this.base !== null && this.base.scheme === this.url.scheme) this.state = "special relative or authority";
            else if (nP(this.url)) this.state = "special authority slashes";
            else if (this.input[this.pointer + 1] === oA("/")) this.state = "path or authority", ++this.pointer;
            else this.url.path = "", this.state = "opaque path"
        } else if (!this.stateOverride) this.buffer = "", this.state = "no scheme", this.pointer = -1;
        else return this.parseError = !0, c5;
        return !0
    };
    cH.prototype["parse no scheme"] = function(q) {
        if (this.base === null || Rg6(this.base) && q !== oA("#")) return c5;
        else if (Rg6(this.base) && q === oA("#")) this.url.scheme = this.base.scheme, this.url.path = this.base.path, this.url.query = this.base.query, this.url.fragment = "", this.state = "fragment";
        else if (this.base.scheme === "file") this.state = "file", --this.pointer;
        else this.state = "relative", --this.pointer;
        return !0
    };
    cH.prototype["parse special relative or authority"] = function(q) {
        if (q === oA("/") && this.input[this.pointer + 1] === oA("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "relative", --this.pointer;
        return !0
    };
    cH.prototype["parse path or authority"] = function(q) {
        if (q === oA("/")) this.state = "authority";
        else this.state = "path", --this.pointer;
        return !0
    };
    cH.prototype["parse relative"] = function(q) {
        if (this.url.scheme = this.base.scheme, q === oA("/")) this.state = "relative slash";
        else if (nP(this.url) && q === oA("\\")) this.parseError = !0, this.state = "relative slash";
        else if (this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.url.path = this.base.path.slice(), this.url.query = this.base.query, q === oA("?")) this.url.query = "", this.state = "query";
        else if (q === oA("#")) this.url.fragment = "", this.state = "fragment";
        else if (!isNaN(q)) this.url.query = null, this.url.path.pop(), this.state = "path", --this.pointer;
        return !0
    };
    cH.prototype["parse relative slash"] = function(q) {
        if (nP(this.url) && (q === oA("/") || q === oA("\\"))) {
            if (q === oA("\\")) this.parseError = !0;
            this.state = "special authority ignore slashes"
        } else if (q === oA("/")) this.state = "authority";
        else this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.state = "path", --this.pointer;
        return !0
    };
    cH.prototype["parse special authority slashes"] = function(q) {
        if (q === oA("/") && this.input[this.pointer + 1] === oA("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "special authority ignore slashes", --this.pointer;
        return !0
    };
    cH.prototype["parse special authority ignore slashes"] = function(q) {
        if (q !== oA("/") && q !== oA("\\")) this.state = "authority", --this.pointer;
        else this.parseError = !0;
        return !0
    };
    cH.prototype["parse authority"] = function(q, K) {
        if (q === oA("@")) {
            if (this.parseError = !0, this.atFlag) this.buffer = `%40${this.buffer}`;
            this.atFlag = !0;
            let Y = mr7(this.buffer);
            for (let z = 0; z < Y; ++z) {
                let _ = this.buffer.codePointAt(z);
                if (_ === oA(":") && !this.passwordTokenSeenFlag) {
                    this.passwordTokenSeenFlag = !0;
                    continue
                }
                let w = SM1(_, DZ8);
                if (this.passwordTokenSeenFlag) this.url.password += w;
                else this.url.username += w
            }
            this.buffer = ""
        } else if (isNaN(q) || q === oA("/") || q === oA("?") || q === oA("#") || nP(this.url) && q === oA("\\")) {
            if (this.atFlag && this.buffer === "") return this.parseError = !0, c5;
            this.pointer -= mr7(this.buffer) + 1, this.buffer = "", this.state = "host"
        } else this.buffer += K;
        return !0
    };
    cH.prototype["parse hostname"] = cH.prototype["parse host"] = function(q, K) {
        if (this.stateOverride && this.url.scheme === "file") --this.pointer, this.state = "file host";
        else if (q === oA(":") && !this.arrFlag) {
            if (this.buffer === "") return this.parseError = !0, c5;
            if (this.stateOverride === "hostname") return !1;
            let Y = MZ8(this.buffer, JZ8(this.url));
            if (Y === c5) return c5;
            this.url.host = Y, this.buffer = "", this.state = "port"
        } else if (isNaN(q) || q === oA("/") || q === oA("?") || q === oA("#") || nP(this.url) && q === oA("\\")) {
            if (--this.pointer, nP(this.url) && this.buffer === "") return this.parseError = !0, c5;
            else if (this.stateOverride && this.buffer === "" && (nr7(this.url) || this.url.port !== null)) return this.parseError = !0, !1;
            let Y = MZ8(this.buffer, JZ8(this.url));
            if (Y === c5) return c5;
            if (this.url.host = Y, this.buffer = "", this.state = "path start", this.stateOverride) return !1
        } else {
            if (q === oA("[")) this.arrFlag = !0;
            else if (q === oA("]")) this.arrFlag = !1;
            this.buffer += K
        }
        return !0
    };
    cH.prototype["parse port"] = function(q, K) {
        if (rP.isASCIIDigit(q)) this.buffer += K;
        else if (isNaN(q) || q === oA("/") || q === oA("?") || q === oA("#") || nP(this.url) && q === oA("\\") || this.stateOverride) {
            if (this.buffer !== "") {
                let Y = parseInt(this.buffer);
                if (Y > 65535) return this.parseError = !0, c5;
                this.url.port = Y === cr7(this.url.scheme) ? null : Y, this.buffer = ""
            }
            if (this.stateOverride) return !1;
            this.state = "path start", --this.pointer
        } else return this.parseError = !0, c5;
        return !0
    };
    var VD9 = new Set([oA("/"), oA("\\"), oA("?"), oA("#")]);

    function rr7(A, q) {
        let K = A.length - q;
        return K >= 2 && $D9(A[q], A[q + 1]) && (K === 2 || VD9.has(A[q + 2]))
    }
    cH.prototype["parse file"] = function(q) {
        if (this.url.scheme = "file", this.url.host = "", q === oA("/") || q === oA("\\")) {
            if (q === oA("\\")) this.parseError = !0;
            this.state = "file slash"
        } else if (this.base !== null && this.base.scheme === "file") {
            if (this.url.host = this.base.host, this.url.path = this.base.path.slice(), this.url.query = this.base.query, q === oA("?")) this.url.query = "", this.state = "query";
            else if (q === oA("#")) this.url.fragment = "", this.state = "fragment";
            else if (!isNaN(q)) {
                if (this.url.query = null, !rr7(this.input, this.pointer)) ir7(this.url);
                else this.parseError = !0, this.url.path = [];
                this.state = "path", --this.pointer
            }
        } else this.state = "path", --this.pointer;
        return !0
    };
    cH.prototype["parse file slash"] = function(q) {
        if (q === oA("/") || q === oA("\\")) {
            if (q === oA("\\")) this.parseError = !0;
            this.state = "file host"
        } else {
            if (this.base !== null && this.base.scheme === "file") {
                if (!rr7(this.input, this.pointer) && HD9(this.base.path[0])) this.url.path.push(this.base.path[0]);
                this.url.host = this.base.host
            }
            this.state = "path", --this.pointer
        }
        return !0
    };
    cH.prototype["parse file host"] = function(q, K) {
        if (isNaN(q) || q === oA("/") || q === oA("\\") || q === oA("?") || q === oA("#"))
            if (--this.pointer, !this.stateOverride && Ur7(this.buffer)) this.parseError = !0, this.state = "path";
            else if (this.buffer === "") {
            if (this.url.host = "", this.stateOverride) return !1;
            this.state = "path start"
        } else {
            let Y = MZ8(this.buffer, JZ8(this.url));
            if (Y === c5) return c5;
            if (Y === "localhost") Y = "";
            if (this.url.host = Y, this.stateOverride) return !1;
            this.buffer = "", this.state = "path start"
        } else this.buffer += K;
        return !0
    };
    cH.prototype["parse path start"] = function(q) {
        if (nP(this.url)) {
            if (q === oA("\\")) this.parseError = !0;
            if (this.state = "path", q !== oA("/") && q !== oA("\\")) --this.pointer
        } else if (!this.stateOverride && q === oA("?")) this.url.query = "", this.state = "query";
        else if (!this.stateOverride && q === oA("#")) this.url.fragment = "", this.state = "fragment";
        else if (q !== void 0) {
            if (this.state = "path", q !== oA("/")) --this.pointer
        } else if (this.stateOverride && this.url.host === null) this.url.path.push("");
        return !0
    };
    cH.prototype["parse path"] = function(q) {
        if (isNaN(q) || q === oA("/") || nP(this.url) && q === oA("\\") || !this.stateOverride && (q === oA("?") || q === oA("#"))) {
            if (nP(this.url) && q === oA("\\")) this.parseError = !0;
            if (OD9(this.buffer)) {
                if (ir7(this.url), q !== oA("/") && !(nP(this.url) && q === oA("\\"))) this.url.path.push("")
            } else if (gr7(this.buffer) && q !== oA("/") && !(nP(this.url) && q === oA("\\"))) this.url.path.push("");
            else if (!gr7(this.buffer)) {
                if (this.url.scheme === "file" && this.url.path.length === 0 && Ur7(this.buffer)) this.buffer = `${this.buffer[0]}:`;
                this.url.path.push(this.buffer)
            }
            if (this.buffer = "", q === oA("?")) this.url.query = "", this.state = "query";
            if (q === oA("#")) this.url.fragment = "", this.state = "fragment"
        } else {
            if (q === oA("%") && (!rP.isASCIIHex(this.input[this.pointer + 1]) || !rP.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += SM1(q, wD9)
        }
        return !0
    };
    cH.prototype["parse opaque path"] = function(q) {
        if (q === oA("?")) this.url.query = "", this.state = "query";
        else if (q === oA("#")) this.url.fragment = "", this.state = "fragment";
        else if (q === oA(" ")) {
            let K = this.input[this.pointer + 1];
            if (K === oA("?") || K === oA("#")) this.url.path += "%20";
            else this.url.path += " "
        } else {
            if (!isNaN(q) && q !== oA("%")) this.parseError = !0;
            if (q === oA("%") && (!rP.isASCIIHex(this.input[this.pointer + 1]) || !rP.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            if (!isNaN(q)) this.url.path += SM1(q, pr7)
        }
        return !0
    };
    cH.prototype["parse query"] = function(q, K) {
        if (!nP(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") this.encodingOverride = "utf-8";
        if (!this.stateOverride && q === oA("#") || isNaN(q)) {
            let Y = nP(this.url) ? _D9 : zD9;
            if (this.url.query += CM1(this.buffer, Y), this.buffer = "", q === oA("#")) this.url.fragment = "", this.state = "fragment"
        } else if (!isNaN(q)) {
            if (q === oA("%") && (!rP.isASCIIHex(this.input[this.pointer + 1]) || !rP.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += K
        }
        return !0
    };
    cH.prototype["parse fragment"] = function(q) {
        if (!isNaN(q)) {
            if (q === oA("%") && (!rP.isASCIIHex(this.input[this.pointer + 1]) || !rP.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.url.fragment += SM1(q, YD9)
        }
        return !0
    };

    function kD9(A, q) {
        let K = `${A.scheme}:`;
        if (A.host !== null) {
            if (K += "//", A.username !== "" || A.password !== "") {
                if (K += A.username, A.password !== "") K += `:${A.password}`;
                K += "@"
            }
            if (K += XZ8(A.host), A.port !== null) K += `:${A.port}`
        }
        if (A.host === null && !Rg6(A) && A.path.length > 1 && A.path[0] === "") K += "/.";
        if (K += PZ8(A), A.query !== null) K += `?${A.query}`;
        if (!q && A.fragment !== null) K += `#${A.fragment}`;
        return K
    }

    function ED9(A) {
        let q = `${A.scheme}://`;
        if (q += XZ8(A.host), A.port !== null) q += `:${A.port}`;
        return q
    }

    function PZ8(A) {
        if (Rg6(A)) return A.path;
        let q = "";
        for (let K of A.path) q += `/${K}`;
        return q
    }
    yD9.serializeURL = kD9;
    yD9.serializePath = PZ8;
    yD9.serializeURLOrigin = function(A) {
        switch (A.scheme) {
            case "blob": {
                let q = yD9.parseURL(PZ8(A));
                if (q === null) return "null";
                if (q.scheme !== "http" && q.scheme !== "https") return "null";
                return yD9.serializeURLOrigin(q)
            }
            case "ftp":
            case "http":
            case "https":
            case "ws":
            case "wss":
                return ED9({
                    scheme: A.scheme,
                    host: A.host,
                    port: A.port
                });
            case "file":
                return "null";
            default:
                return "null"
        }
    };
    yD9.basicURLParse = function(A, q) {
        if (q === void 0) q = {};
        let K = new cH(A, q.baseURL, q.encodingOverride, q.url, q.stateOverride);
        if (K.failure) return null;
        return K.url
    };
    yD9.setTheUsername = function(A, q) {
        A.username = CM1(q, DZ8)
    };
    yD9.setThePassword = function(A, q) {
        A.password = CM1(q, DZ8)
    };
    yD9.serializeHost = XZ8;
    yD9.cannotHaveAUsernamePasswordPort = vD9;
    yD9.hasAnOpaquePath = Rg6;
    yD9.serializeInteger = function(A) {
        return String(A)
    };
    yD9.parseURL = function(A, q) {
        if (q === void 0) q = {};
        return yD9.basicURLParse(A, {
            baseURL: q.baseURL,
            encodingOverride: q.encodingOverride
        })
    }
})
// @from(Ln 205843, Col 4)
ZZ8 = x((KS2, Ko7) => {
    var {
        utf8Encode: mD9,
        utf8DecodeWithoutBOM: ar7
    } = LM1(), {
        percentDecodeBytes: sr7,
        utf8PercentEncodeString: tr7,
        isURLEncodedPercentEncode: er7
    } = RM1();

    function Ao7(A) {
        return A.codePointAt(0)
    }

    function BD9(A) {
        let q = pD9(A, Ao7("&")),
            K = [];
        for (let Y of q) {
            if (Y.length === 0) continue;
            let z, _, w = Y.indexOf(Ao7("="));
            if (w >= 0) z = Y.slice(0, w), _ = Y.slice(w + 1);
            else z = Y, _ = new Uint8Array(0);
            z = qo7(z, 43, 32), _ = qo7(_, 43, 32);
            let O = ar7(sr7(z)),
                $ = ar7(sr7(_));
            K.push([O, $])
        }
        return K
    }

    function gD9(A) {
        return BD9(mD9(A))
    }

    function FD9(A) {
        let q = "";
        for (let [K, Y] of A.entries()) {
            let z = tr7(Y[0], er7, !0),
                _ = tr7(Y[1], er7, !0);
            if (K !== 0) q += "&";
            q += `${z}=${_}`
        }
        return q
    }

    function pD9(A, q) {
        let K = [],
            Y = 0,
            z = A.indexOf(q);
        while (z >= 0) K.push(A.slice(Y, z)), Y = z + 1, z = A.indexOf(q, Y);
        if (Y !== A.length) K.push(A.slice(Y));
        return K
    }

    function qo7(A, q, K) {
        let Y = A.indexOf(q);
        while (Y >= 0) A[Y] = K, Y = A.indexOf(q, Y + 1);
        return A
    }
    Ko7.exports = {
        parseUrlencodedString: gD9,
        serializeUrlencoded: FD9
    }
})
// @from(Ln 205907, Col 4)
zo7 = x((QD9) => {
    var Yo7 = kM1(),
        IM1 = yM1();
    QD9.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (typeof q !== "function") throw new A.TypeError(K + " is not a function");

        function Y(...z) {
            let _ = IM1.tryWrapperForImpl(this),
                w;
            for (let O = 0; O < z.length; O++) z[O] = IM1.tryWrapperForImpl(z[O]);
            return w = Reflect.apply(q, _, z), w = Yo7.any(w, {
                context: K,
                globals: A
            }), w
        }
        return Y.construct = (...z) => {
            for (let w = 0; w < z.length; w++) z[w] = IM1.tryWrapperForImpl(z[w]);
            let _ = Reflect.construct(q, z);
            return _ = Yo7.any(_, {
                context: K,
                globals: A
            }), _
        }, Y[IM1.wrapperSymbol] = q, Y.objectReference = q, Y
    }
})
// @from(Ln 205934, Col 4)
_o7 = x((dD9) => {
    var GZ8 = ZZ8();
    dD9.implementation = class {
        constructor(q, K, {
            doNotStripQMark: Y = !1
        }) {
            let z = K[0];
            if (this._list = [], this._url = null, !Y && typeof z === "string" && z[0] === "?") z = z.slice(1);
            if (Array.isArray(z))
                for (let _ of z) {
                    if (_.length !== 2) throw TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
                    this._list.push([_[0], _[1]])
                } else if (typeof z === "object" && Object.getPrototypeOf(z) === null)
                    for (let _ of Object.keys(z)) {
                        let w = z[_];
                        this._list.push([_, w])
                    } else this._list = GZ8.parseUrlencodedString(z)
        }
        _updateSteps() {
            if (this._url !== null) {
                let q = GZ8.serializeUrlencoded(this._list);
                if (q === "") q = null;
                this._url._url.query = q
            }
        }
        get size() {
            return this._list.length
        }
        append(q, K) {
            this._list.push([q, K]), this._updateSteps()
        }
        delete(q, K) {
            let Y = 0;
            while (Y < this._list.length)
                if (this._list[Y][0] === q && (K === void 0 || this._list[Y][1] === K)) this._list.splice(Y, 1);
                else Y++;
            this._updateSteps()
        }
        get(q) {
            for (let K of this._list)
                if (K[0] === q) return K[1];
            return null
        }
        getAll(q) {
            let K = [];
            for (let Y of this._list)
                if (Y[0] === q) K.push(Y[1]);
            return K
        }
        has(q, K) {
            for (let Y of this._list)
                if (Y[0] === q && (K === void 0 || Y[1] === K)) return !0;
            return !1
        }
        set(q, K) {
            let Y = !1,
                z = 0;
            while (z < this._list.length)
                if (this._list[z][0] === q)
                    if (Y) this._list.splice(z, 1);
                    else Y = !0, this._list[z][1] = K, z++;
            else z++;
            if (!Y) this._list.push([q, K]);
            this._updateSteps()
        }
        sort() {
            this._list.sort((q, K) => {
                if (q[0] < K[0]) return -1;
                if (q[0] > K[0]) return 1;
                return 0
            }), this._updateSteps()
        } [Symbol.iterator]() {
            return this._list[Symbol.iterator]()
        }
        toString() {
            return GZ8.serializeUrlencoded(this._list)
        }
    }
})
// @from(Ln 206013, Col 4)
TZ8 = x((nD9) => {
    var Sv = kM1(),
        n2 = yM1(),
        lD9 = zo7(),
        wo7 = n2.newObjectInRealm,
        Ij = n2.implSymbol,
        Oo7 = n2.ctorRegistrySymbol;
    nD9.is = (A) => {
        return n2.isObject(A) && n2.hasOwn(A, Ij) && A[Ij] instanceof qt.implementation
    };
    nD9.isImpl = (A) => {
        return n2.isObject(A) && A instanceof qt.implementation
    };
    nD9.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (nD9.is(q)) return n2.implForWrapper(q);
        throw new A.TypeError(`${K} is not of type 'URLSearchParams'.`)
    };
    nD9.createDefaultIterator = (A, q, K) => {
        let z = A[Oo7]["URLSearchParams Iterator"],
            _ = Object.create(z);
        return Object.defineProperty(_, n2.iterInternalSymbol, {
            value: {
                target: q,
                kind: K,
                index: 0
            },
            configurable: !0
        }), _
    };

    function $o7(A, q) {
        let K;
        if (q !== void 0) K = q.prototype;
        if (!n2.isObject(K)) K = A[Oo7].URLSearchParams.prototype;
        return Object.create(K)
    }
    nD9.create = (A, q, K) => {
        let Y = $o7(A);
        return nD9.setup(Y, A, q, K)
    };
    nD9.createImpl = (A, q, K) => {
        let Y = nD9.create(A, q, K);
        return n2.implForWrapper(Y)
    };
    nD9._internalSetup = (A, q) => {};
    nD9.setup = (A, q, K = [], Y = {}) => {
        if (Y.wrapper = A, nD9._internalSetup(A, q), Object.defineProperty(A, Ij, {
                value: new qt.implementation(q, K, Y),
                configurable: !0
            }), A[Ij][n2.wrapperSymbol] = A, qt.init) qt.init(A[Ij]);
        return A
    };
    nD9.new = (A, q) => {
        let K = $o7(A, q);
        if (nD9._internalSetup(K, A), Object.defineProperty(K, Ij, {
                value: Object.create(qt.implementation.prototype),
                configurable: !0
            }), K[Ij][n2.wrapperSymbol] = K, qt.init) qt.init(K[Ij]);
        return K[Ij]
    };
    var iD9 = new Set(["Window", "Worker"]);
    nD9.install = (A, q) => {
        if (!q.some((z) => iD9.has(z))) return;
        let K = n2.initCtorRegistry(A);
        class Y {
            constructor() {
                let z = [];
                {
                    let _ = arguments[0];
                    if (_ !== void 0)
                        if (n2.isObject(_))
                            if (_[Symbol.iterator] !== void 0)
                                if (!n2.isObject(_)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
                                else {
                                    let w = [],
                                        O = _;
                                    for (let $ of O) {
                                        if (!n2.isObject($)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                                        else {
                                            let H = [],
                                                j = $;
                                            for (let J of j) J = Sv.USVString(J, {
                                                context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                                                globals: A
                                            }), H.push(J);
                                            $ = H
                                        }
                                        w.push($)
                                    }
                                    _ = w
                                }
                    else if (!n2.isObject(_)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
                    else {
                        let w = Object.create(null);
                        for (let O of Reflect.ownKeys(_)) {
                            let $ = Object.getOwnPropertyDescriptor(_, O);
                            if ($ && $.enumerable) {
                                let H = O;
                                H = Sv.USVString(H, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                                    globals: A
                                });
                                let j = _[O];
                                j = Sv.USVString(j, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                                    globals: A
                                }), w[H] = j
                            }
                        }
                        _ = w
                    } else _ = Sv.USVString(_, {
                        context: "Failed to construct 'URLSearchParams': parameter 1",
                        globals: A
                    });
                    else _ = "";
                    z.push(_)
                }
                return nD9.setup(Object.create(new.target.prototype), A, z)
            }
            append(z, _) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(w)) throw new A.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let $ = arguments[0];
                    $ = Sv.USVString($, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), O.push($)
                } {
                    let $ = arguments[1];
                    $ = Sv.USVString($, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
                        globals: A
                    }), O.push($)
                }
                return n2.tryWrapperForImpl(w[Ij].append(...O))
            }
            delete(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(_)) throw new A.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let O = arguments[0];
                    O = Sv.USVString(O, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), w.push(O)
                } {
                    let O = arguments[1];
                    if (O !== void 0) O = Sv.USVString(O, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
                        globals: A
                    });
                    w.push(O)
                }
                return n2.tryWrapperForImpl(_[Ij].delete(...w))
            }
            get(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(_)) throw new A.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let O = arguments[0];
                    O = Sv.USVString(O, {
                        context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), w.push(O)
                }
                return _[Ij].get(...w)
            }
            getAll(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(_)) throw new A.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let O = arguments[0];
                    O = Sv.USVString(O, {
                        context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), w.push(O)
                }
                return n2.tryWrapperForImpl(_[Ij].getAll(...w))
            }
            has(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(_)) throw new A.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let O = arguments[0];
                    O = Sv.USVString(O, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), w.push(O)
                } {
                    let O = arguments[1];
                    if (O !== void 0) O = Sv.USVString(O, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
                        globals: A
                    });
                    w.push(O)
                }
                return _[Ij].has(...w)
            }
            set(z, _) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(w)) throw new A.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let $ = arguments[0];
                    $ = Sv.USVString($, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), O.push($)
                } {
                    let $ = arguments[1];
                    $ = Sv.USVString($, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
                        globals: A
                    }), O.push($)
                }
                return n2.tryWrapperForImpl(w[Ij].set(...O))
            }
            sort() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(z)) throw new A.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
                return n2.tryWrapperForImpl(z[Ij].sort())
            }
            toString() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
                return z[Ij].toString()
            }
            keys() {
                if (!nD9.is(this)) throw new A.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
                return nD9.createDefaultIterator(A, this, "key")
            }
            values() {
                if (!nD9.is(this)) throw new A.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
                return nD9.createDefaultIterator(A, this, "value")
            }
            entries() {
                if (!nD9.is(this)) throw new A.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
                return nD9.createDefaultIterator(A, this, "key+value")
            }
            forEach(z) {
                if (!nD9.is(this)) throw new A.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
                z = lD9.convert(A, z, {
                    context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
                });
                let _ = arguments[1],
                    w = Array.from(this[Ij]),
                    O = 0;
                while (O < w.length) {
                    let [$, H] = w[O].map(n2.tryWrapperForImpl);
                    z.call(_, H, $, this), w = Array.from(this[Ij]), O++
                }
            }
            get size() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!nD9.is(z)) throw new A.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
                return z[Ij].size
            }
        }
        Object.defineProperties(Y.prototype, {
            append: {
                enumerable: !0
            },
            delete: {
                enumerable: !0
            },
            get: {
                enumerable: !0
            },
            getAll: {
                enumerable: !0
            },
            has: {
                enumerable: !0
            },
            set: {
                enumerable: !0
            },
            sort: {
                enumerable: !0
            },
            toString: {
                enumerable: !0
            },
            keys: {
                enumerable: !0
            },
            values: {
                enumerable: !0
            },
            entries: {
                enumerable: !0
            },
            forEach: {
                enumerable: !0
            },
            size: {
                enumerable: !0
            },
            [Symbol.toStringTag]: {
                value: "URLSearchParams",
                configurable: !0
            },
            [Symbol.iterator]: {
                value: Y.prototype.entries,
                configurable: !0,
                writable: !0
            }
        }), K.URLSearchParams = Y, K["URLSearchParams Iterator"] = Object.create(K["%IteratorPrototype%"], {
            [Symbol.toStringTag]: {
                configurable: !0,
                value: "URLSearchParams Iterator"
            }
        }), n2.define(K["URLSearchParams Iterator"], {
            next() {
                let z = this && this[n2.iterInternalSymbol];
                if (!z) throw new A.TypeError("next() called on a value that is not a URLSearchParams iterator object");
                let {
                    target: _,
                    kind: w,
                    index: O
                } = z, $ = Array.from(_[Ij]), H = $.length;
                if (O >= H) return wo7(A, {
                    value: void 0,
                    done: !0
                });
                let j = $[O];
                return z.index = O + 1, wo7(A, n2.iteratorResult(j.map(n2.tryWrapperForImpl), w))
            }
        }), Object.defineProperty(A, "URLSearchParams", {
            configurable: !0,
            writable: !0,
            value: Y
        })
    };
    var qt = _o7()
})
// @from(Ln 206364, Col 4)
Mo7 = x((AX9) => {
    var D2 = WZ8(),
        Jo7 = ZZ8(),
        eD9 = TZ8();
    AX9.implementation = class A {
        constructor(q, [K, Y]) {
            let z = null;
            if (Y !== void 0) {
                if (z = D2.basicURLParse(Y), z === null) throw TypeError(`Invalid base URL: ${Y}`)
            }
            let _ = D2.basicURLParse(K, {
                baseURL: z
            });
            if (_ === null) throw TypeError(`Invalid URL: ${K}`);
            let w = _.query !== null ? _.query : "";
            this._url = _, this._query = eD9.createImpl(q, [w], {
                doNotStripQMark: !0
            }), this._query._url = this
        }
        static parse(q, K, Y) {
            try {
                return new A(q, [K, Y])
            } catch {
                return null
            }
        }
        static canParse(q, K) {
            let Y = null;
            if (K !== void 0) {
                if (Y = D2.basicURLParse(K), Y === null) return !1
            }
            if (D2.basicURLParse(q, {
                    baseURL: Y
                }) === null) return !1;
            return !0
        }
        get href() {
            return D2.serializeURL(this._url)
        }
        set href(q) {
            let K = D2.basicURLParse(q);
            if (K === null) throw TypeError(`Invalid URL: ${q}`);
            this._url = K, this._query._list.splice(0);
            let {
                query: Y
            } = K;
            if (Y !== null) this._query._list = Jo7.parseUrlencodedString(Y)
        }
        get origin() {
            return D2.serializeURLOrigin(this._url)
        }
        get protocol() {
            return `${this._url.scheme}:`
        }
        set protocol(q) {
            D2.basicURLParse(`${q}:`, {
                url: this._url,
                stateOverride: "scheme start"
            })
        }
        get username() {
            return this._url.username
        }
        set username(q) {
            if (D2.cannotHaveAUsernamePasswordPort(this._url)) return;
            D2.setTheUsername(this._url, q)
        }
        get password() {
            return this._url.password
        }
        set password(q) {
            if (D2.cannotHaveAUsernamePasswordPort(this._url)) return;
            D2.setThePassword(this._url, q)
        }
        get host() {
            let q = this._url;
            if (q.host === null) return "";
            if (q.port === null) return D2.serializeHost(q.host);
            return `${D2.serializeHost(q.host)}:${D2.serializeInteger(q.port)}`
        }
        set host(q) {
            if (D2.hasAnOpaquePath(this._url)) return;
            D2.basicURLParse(q, {
                url: this._url,
                stateOverride: "host"
            })
        }
        get hostname() {
            if (this._url.host === null) return "";
            return D2.serializeHost(this._url.host)
        }
        set hostname(q) {
            if (D2.hasAnOpaquePath(this._url)) return;
            D2.basicURLParse(q, {
                url: this._url,
                stateOverride: "hostname"
            })
        }
        get port() {
            if (this._url.port === null) return "";
            return D2.serializeInteger(this._url.port)
        }
        set port(q) {
            if (D2.cannotHaveAUsernamePasswordPort(this._url)) return;
            if (q === "") this._url.port = null;
            else D2.basicURLParse(q, {
                url: this._url,
                stateOverride: "port"
            })
        }
        get pathname() {
            return D2.serializePath(this._url)
        }
        set pathname(q) {
            if (D2.hasAnOpaquePath(this._url)) return;
            this._url.path = [], D2.basicURLParse(q, {
                url: this._url,
                stateOverride: "path start"
            })
        }
        get search() {
            if (this._url.query === null || this._url.query === "") return "";
            return `?${this._url.query}`
        }
        set search(q) {
            let K = this._url;
            if (q === "") {
                K.query = null, this._query._list = [];
                return
            }
            let Y = q[0] === "?" ? q.substring(1) : q;
            K.query = "", D2.basicURLParse(Y, {
                url: K,
                stateOverride: "query"
            }), this._query._list = Jo7.parseUrlencodedString(Y)
        }
        get searchParams() {
            return this._query
        }
        get hash() {
            if (this._url.fragment === null || this._url.fragment === "") return "";
            return `#${this._url.fragment}`
        }
        set hash(q) {
            if (q === "") {
                this._url.fragment = null;
                return
            }
            let K = q[0] === "#" ? q.substring(1) : q;
            this._url.fragment = "", D2.basicURLParse(K, {
                url: this._url,
                stateOverride: "fragment"
            })
        }
        toJSON() {
            return this.href
        }
    }
})
// @from(Ln 206523, Col 4)
Wo7 = x((zX9) => {
    var aW = kM1(),
        Cv = yM1(),
        Yz = Cv.implSymbol,
        KX9 = Cv.ctorRegistrySymbol;
    zX9.is = (A) => {
        return Cv.isObject(A) && Cv.hasOwn(A, Yz) && A[Yz] instanceof YB.implementation
    };
    zX9.isImpl = (A) => {
        return Cv.isObject(A) && A instanceof YB.implementation
    };
    zX9.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (zX9.is(q)) return Cv.implForWrapper(q);
        throw new A.TypeError(`${K} is not of type 'URL'.`)
    };

    function Do7(A, q) {
        let K;
        if (q !== void 0) K = q.prototype;
        if (!Cv.isObject(K)) K = A[KX9].URL.prototype;
        return Object.create(K)
    }
    zX9.create = (A, q, K) => {
        let Y = Do7(A);
        return zX9.setup(Y, A, q, K)
    };
    zX9.createImpl = (A, q, K) => {
        let Y = zX9.create(A, q, K);
        return Cv.implForWrapper(Y)
    };
    zX9._internalSetup = (A, q) => {};
    zX9.setup = (A, q, K = [], Y = {}) => {
        if (Y.wrapper = A, zX9._internalSetup(A, q), Object.defineProperty(A, Yz, {
                value: new YB.implementation(q, K, Y),
                configurable: !0
            }), A[Yz][Cv.wrapperSymbol] = A, YB.init) YB.init(A[Yz]);
        return A
    };
    zX9.new = (A, q) => {
        let K = Do7(A, q);
        if (zX9._internalSetup(K, A), Object.defineProperty(K, Yz, {
                value: Object.create(YB.implementation.prototype),
                configurable: !0
            }), K[Yz][Cv.wrapperSymbol] = K, YB.init) YB.init(K[Yz]);
        return K[Yz]
    };
    var YX9 = new Set(["Window", "Worker"]);
    zX9.install = (A, q) => {
        if (!q.some((z) => YX9.has(z))) return;
        let K = Cv.initCtorRegistry(A);
        class Y {
            constructor(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`);
                let _ = [];
                {
                    let w = arguments[0];
                    w = aW.USVString(w, {
                        context: "Failed to construct 'URL': parameter 1",
                        globals: A
                    }), _.push(w)
                } {
                    let w = arguments[1];
                    if (w !== void 0) w = aW.USVString(w, {
                        context: "Failed to construct 'URL': parameter 2",
                        globals: A
                    });
                    _.push(w)
                }
                return zX9.setup(Object.create(new.target.prototype), A, _)
            }
            toJSON() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
                return z[Yz].toJSON()
            }
            get href() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get href' called on an object that is not a valid instance of URL.");
                return z[Yz].href
            }
            set href(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set href' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'href' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].href = z
            }
            toString() {
                let z = this;
                if (!zX9.is(z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URL.");
                return z[Yz].href
            }
            get origin() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get origin' called on an object that is not a valid instance of URL.");
                return z[Yz].origin
            }
            get protocol() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
                return z[Yz].protocol
            }
            set protocol(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'protocol' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].protocol = z
            }
            get username() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get username' called on an object that is not a valid instance of URL.");
                return z[Yz].username
            }
            set username(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set username' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'username' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].username = z
            }
            get password() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get password' called on an object that is not a valid instance of URL.");
                return z[Yz].password
            }
            set password(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set password' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'password' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].password = z
            }
            get host() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get host' called on an object that is not a valid instance of URL.");
                return z[Yz].host
            }
            set host(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set host' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'host' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].host = z
            }
            get hostname() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
                return z[Yz].hostname
            }
            set hostname(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'hostname' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].hostname = z
            }
            get port() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get port' called on an object that is not a valid instance of URL.");
                return z[Yz].port
            }
            set port(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set port' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'port' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].port = z
            }
            get pathname() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
                return z[Yz].pathname
            }
            set pathname(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'pathname' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].pathname = z
            }
            get search() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get search' called on an object that is not a valid instance of URL.");
                return z[Yz].search
            }
            set search(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set search' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'search' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].search = z
            }
            get searchParams() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
                return Cv.getSameObject(this, "searchParams", () => {
                    return Cv.tryWrapperForImpl(z[Yz].searchParams)
                })
            }
            get hash() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(z)) throw new A.TypeError("'get hash' called on an object that is not a valid instance of URL.");
                return z[Yz].hash
            }
            set hash(z) {
                let _ = this !== null && this !== void 0 ? this : A;
                if (!zX9.is(_)) throw new A.TypeError("'set hash' called on an object that is not a valid instance of URL.");
                z = aW.USVString(z, {
                    context: "Failed to set the 'hash' property on 'URL': The provided value",
                    globals: A
                }), _[Yz].hash = z
            }
            static parse(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'parse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let _ = [];
                {
                    let w = arguments[0];
                    w = aW.USVString(w, {
                        context: "Failed to execute 'parse' on 'URL': parameter 1",
                        globals: A
                    }), _.push(w)
                } {
                    let w = arguments[1];
                    if (w !== void 0) w = aW.USVString(w, {
                        context: "Failed to execute 'parse' on 'URL': parameter 2",
                        globals: A
                    });
                    _.push(w)
                }
                return Cv.tryWrapperForImpl(YB.implementation.parse(A, ..._))
            }
            static canParse(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let _ = [];
                {
                    let w = arguments[0];
                    w = aW.USVString(w, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 1",
                        globals: A
                    }), _.push(w)
                } {
                    let w = arguments[1];
                    if (w !== void 0) w = aW.USVString(w, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 2",
                        globals: A
                    });
                    _.push(w)
                }
                return YB.implementation.canParse(..._)
            }
        }
        if (Object.defineProperties(Y.prototype, {
                toJSON: {
                    enumerable: !0
                },
                href: {
                    enumerable: !0
                },
                toString: {
                    enumerable: !0
                },
                origin: {
                    enumerable: !0
                },
                protocol: {
                    enumerable: !0
                },
                username: {
                    enumerable: !0
                },
                password: {
                    enumerable: !0
                },
                host: {
                    enumerable: !0
                },
                hostname: {
                    enumerable: !0
                },
                port: {
                    enumerable: !0
                },
                pathname: {
                    enumerable: !0
                },
                search: {
                    enumerable: !0
                },
                searchParams: {
                    enumerable: !0
                },
                hash: {
                    enumerable: !0
                },
                [Symbol.toStringTag]: {
                    value: "URL",
                    configurable: !0
                }
            }), Object.defineProperties(Y, {
                parse: {
                    enumerable: !0
                },
                canParse: {
                    enumerable: !0
                }
            }), K.URL = Y, Object.defineProperty(A, "URL", {
                configurable: !0,
                writable: !0,
                value: Y
            }), q.includes("Window")) Object.defineProperty(A, "webkitURL", {
            configurable: !0,
            writable: !0,
            value: Y
        })
    };
    var YB = Mo7()
})
// @from(Ln 206852, Col 4)
Zo7 = x((MX9) => {
    var jX9 = Wo7(),
        JX9 = TZ8();
    MX9.URL = jX9;
    MX9.URLSearchParams = JX9
})
// @from(Ln 206858, Col 4)
fo7 = x((ZX9) => {
    var {
        URL: PX9,
        URLSearchParams: WX9
    } = Zo7(), qI = WZ8(), Go7 = RM1(), xM1 = {
        Array,
        Object,
        Promise,
        String,
        TypeError
    };
    PX9.install(xM1, ["Window"]);
    WX9.install(xM1, ["Window"]);
    ZX9.URL = xM1.URL;
    ZX9.URLSearchParams = xM1.URLSearchParams;
    ZX9.parseURL = qI.parseURL;
    ZX9.basicURLParse = qI.basicURLParse;
    ZX9.serializeURL = qI.serializeURL;
    ZX9.serializePath = qI.serializePath;
    ZX9.serializeHost = qI.serializeHost;
    ZX9.serializeInteger = qI.serializeInteger;
    ZX9.serializeURLOrigin = qI.serializeURLOrigin;
    ZX9.setTheUsername = qI.setTheUsername;
    ZX9.setThePassword = qI.setThePassword;
    ZX9.cannotHaveAUsernamePasswordPort = qI.cannotHaveAUsernamePasswordPort;
    ZX9.hasAnOpaquePath = qI.hasAnOpaquePath;
    ZX9.percentDecodeString = Go7.percentDecodeString;
    ZX9.percentDecodeBytes = Go7.percentDecodeBytes
})