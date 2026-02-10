
// @from(Ln 179594, Col 4)
KM7 = R((Zn5, qM7) => {
    Zn5.STATUS_MAPPING = {
        mapped: 1,
        valid: 2,
        disallowed: 3,
        deviation: 6,
        ignored: 7
    }
})
// @from(Ln 179603, Col 4)
$M7 = R((Yc2, HM7) => {
    var $2A = sj7(),
        uL = ej7(),
        YM7 = AM7(),
        {
            STATUS_MAPPING: Do
        } = KM7();

    function H2A(A) {
        return /[^\x00-\x7F]/u.test(A)
    }

    function zM7(A) {
        let q = 0,
            K = YM7.length - 1;
        while (q <= K) {
            let Y = Math.floor((q + K) / 2),
                z = YM7[Y],
                w = Array.isArray(z[0]) ? z[0][0] : z[0],
                H = Array.isArray(z[0]) ? z[0][1] : z[0];
            if (w <= A && H >= A) return z.slice(1);
            else if (w > A) K = Y - 1;
            else q = Y + 1
        }
        return null
    }

    function Vn5(A, {
        transitionalProcessing: q
    }) {
        let K = "";
        for (let Y of A) {
            let [z, w] = zM7(Y.codePointAt(0));
            switch (z) {
                case Do.disallowed:
                    K += Y;
                    break;
                case Do.ignored:
                    break;
                case Do.mapped:
                    if (q && Y === "ẞ") K += "ss";
                    else K += w;
                    break;
                case Do.deviation:
                    if (q) K += w;
                    else K += Y;
                    break;
                case Do.valid:
                    K += Y;
                    break
            }
        }
        return K
    }

    function Nn5(A, {
        checkHyphens: q,
        checkBidi: K,
        checkJoiners: Y,
        transitionalProcessing: z,
        useSTD3ASCIIRules: w,
        isBidi: H
    }) {
        if (A.length === 0) return !0;
        if (A.normalize("NFC") !== A) return !1;
        let $ = Array.from(A);
        if (q) {
            if ($[2] === "-" && $[3] === "-" || (A.startsWith("-") || A.endsWith("-"))) return !1
        }
        if (!q) {
            if (A.startsWith("xn--")) return !1
        }
        if (A.includes(".")) return !1;
        if (uL.combiningMarks.test($[0])) return !1;
        for (let O of $) {
            let _ = O.codePointAt(0),
                [J] = zM7(_);
            if (z) {
                if (J !== Do.valid) return !1
            } else if (J !== Do.valid && J !== Do.deviation) return !1;
            if (w && _ <= 127) {
                if (!/^(?:[a-z]|[0-9]|-)$/u.test(O)) return !1
            }
        }
        if (Y) {
            let O = 0;
            for (let [_, J] of $.entries())
                if (J === "‌" || J === "‍") {
                    if (_ > 0) {
                        if (uL.combiningClassVirama.test($[_ - 1])) continue;
                        if (J === "‌") {
                            let X = $.indexOf("‌", _ + 1),
                                D = X < 0 ? $.slice(O) : $.slice(O, X);
                            if (uL.validZWNJ.test(D.join(""))) {
                                O = _ + 1;
                                continue
                            }
                        }
                    }
                    return !1
                }
        }
        if (K && H) {
            let O;
            if (uL.bidiS1LTR.test($[0])) O = !1;
            else if (uL.bidiS1RTL.test($[0])) O = !0;
            else return !1;
            if (O) {
                if (!uL.bidiS2.test(A) || !uL.bidiS3.test(A) || uL.bidiS4EN.test(A) && uL.bidiS4AN.test(A)) return !1
            } else if (!uL.bidiS5.test(A) || !uL.bidiS6.test(A)) return !1
        }
        return !0
    }

    function Tn5(A) {
        let q = A.map((K) => {
            if (K.startsWith("xn--")) try {
                return $2A.decode(K.substring(4))
            } catch {
                return ""
            }
            return K
        }).join(".");
        return uL.bidiDomain.test(q)
    }

    function wM7(A, q) {
        let K = Vn5(A, q);
        K = K.normalize("NFC");
        let Y = K.split("."),
            z = Tn5(Y),
            w = !1;
        for (let [H, $] of Y.entries()) {
            let O = $,
                _ = q.transitionalProcessing;
            if (O.startsWith("xn--")) {
                if (H2A(O)) {
                    w = !0;
                    continue
                }
                try {
                    O = $2A.decode(O.substring(4))
                } catch {
                    if (!q.ignoreInvalidPunycode) {
                        w = !0;
                        continue
                    }
                }
                if (Y[H] = O, O === "" || !H2A(O)) w = !0;
                _ = !1
            }
            if (w) continue;
            if (!Nn5(O, {
                    ...q,
                    transitionalProcessing: _,
                    isBidi: z
                })) w = !0
        }
        return {
            string: Y.join("."),
            error: w
        }
    }

    function vn5(A, {
        checkHyphens: q = !1,
        checkBidi: K = !1,
        checkJoiners: Y = !1,
        useSTD3ASCIIRules: z = !1,
        verifyDNSLength: w = !1,
        transitionalProcessing: H = !1,
        ignoreInvalidPunycode: $ = !1
    } = {}) {
        let O = wM7(A, {
                checkHyphens: q,
                checkBidi: K,
                checkJoiners: Y,
                useSTD3ASCIIRules: z,
                transitionalProcessing: H,
                ignoreInvalidPunycode: $
            }),
            _ = O.string.split(".");
        if (_ = _.map((J) => {
                if (H2A(J)) try {
                    return `xn--${$2A.encode(J)}`
                } catch {
                    O.error = !0
                }
                return J
            }), w) {
            let J = _.join(".").length;
            if (J > 253 || J === 0) O.error = !0;
            for (let X = 0; X < _.length; ++X)
                if (_[X].length > 63 || _[X].length === 0) {
                    O.error = !0;
                    break
                }
        }
        if (O.error) return null;
        return _.join(".")
    }

    function En5(A, {
        checkHyphens: q = !1,
        checkBidi: K = !1,
        checkJoiners: Y = !1,
        useSTD3ASCIIRules: z = !1,
        transitionalProcessing: w = !1,
        ignoreInvalidPunycode: H = !1
    } = {}) {
        let $ = wM7(A, {
            checkHyphens: q,
            checkBidi: K,
            checkJoiners: Y,
            useSTD3ASCIIRules: z,
            transitionalProcessing: w,
            ignoreInvalidPunycode: H
        });
        return {
            domain: $.string,
            error: $.error
        }
    }
    HM7.exports = {
        toASCII: vn5,
        toUnicode: En5
    }
})
// @from(Ln 179831, Col 4)
_2A = R((zc2, _M7) => {
    function O2A(A) {
        return A >= 48 && A <= 57
    }

    function OM7(A) {
        return A >= 65 && A <= 90 || A >= 97 && A <= 122
    }

    function kn5(A) {
        return OM7(A) || O2A(A)
    }

    function Ln5(A) {
        return O2A(A) || A >= 65 && A <= 70 || A >= 97 && A <= 102
    }
    _M7.exports = {
        isASCIIDigit: O2A,
        isASCIIAlpha: OM7,
        isASCIIAlphanumeric: kn5,
        isASCIIHex: Ln5
    }
})
// @from(Ln 179854, Col 4)
qz6 = R((wc2, JM7) => {
    var Rn5 = new TextEncoder,
        yn5 = new TextDecoder("utf-8", {
            ignoreBOM: !0
        });

    function Cn5(A) {
        return Rn5.encode(A)
    }

    function Sn5(A) {
        return yn5.decode(A)
    }
    JM7.exports = {
        utf8Encode: Cn5,
        utf8DecodeWithoutBOM: Sn5
    }
})
// @from(Ln 179872, Col 4)
Kz6 = R((Hc2, GM7) => {
    var {
        isASCIIHex: XM7
    } = _2A(), {
        utf8Encode: DM7
    } = qz6();

    function jY(A) {
        return A.codePointAt(0)
    }

    function hn5(A) {
        let q = A.toString(16).toUpperCase();
        if (q.length === 1) q = `0${q}`;
        return `%${q}`
    }

    function jM7(A) {
        let q = new Uint8Array(A.byteLength),
            K = 0;
        for (let Y = 0; Y < A.byteLength; ++Y) {
            let z = A[Y];
            if (z !== 37) q[K++] = z;
            else if (z === 37 && (!XM7(A[Y + 1]) || !XM7(A[Y + 2]))) q[K++] = z;
            else {
                let w = parseInt(String.fromCodePoint(A[Y + 1], A[Y + 2]), 16);
                q[K++] = w, Y += 2
            }
        }
        return q.slice(0, K)
    }

    function In5(A) {
        let q = DM7(A);
        return jM7(q)
    }

    function J2A(A) {
        return A <= 31 || A > 126
    }
    var xn5 = new Set([jY(" "), jY('"'), jY("<"), jY(">"), jY("`")]);

    function bn5(A) {
        return J2A(A) || xn5.has(A)
    }
    var un5 = new Set([jY(" "), jY('"'), jY("#"), jY("<"), jY(">")]);

    function X2A(A) {
        return J2A(A) || un5.has(A)
    }

    function Bn5(A) {
        return X2A(A) || A === jY("'")
    }
    var mn5 = new Set([jY("?"), jY("`"), jY("{"), jY("}"), jY("^")]);

    function MM7(A) {
        return X2A(A) || mn5.has(A)
    }
    var Fn5 = new Set([jY("/"), jY(":"), jY(";"), jY("="), jY("@"), jY("["), jY("\\"), jY("]"), jY("|")]);

    function PM7(A) {
        return MM7(A) || Fn5.has(A)
    }
    var Qn5 = new Set([jY("$"), jY("%"), jY("&"), jY("+"), jY(",")]);

    function gn5(A) {
        return PM7(A) || Qn5.has(A)
    }
    var Un5 = new Set([jY("!"), jY("'"), jY("("), jY(")"), jY("~")]);

    function pn5(A) {
        return gn5(A) || Un5.has(A)
    }

    function WM7(A, q) {
        let K = DM7(A),
            Y = "";
        for (let z of K)
            if (!q(z)) Y += String.fromCharCode(z);
            else Y += hn5(z);
        return Y
    }

    function dn5(A, q) {
        return WM7(String.fromCodePoint(A), q)
    }

    function cn5(A, q, K = !1) {
        let Y = "";
        for (let z of A)
            if (K && z === " ") Y += "+";
            else Y += WM7(z, q);
        return Y
    }
    GM7.exports = {
        isC0ControlPercentEncode: J2A,
        isFragmentPercentEncode: bn5,
        isQueryPercentEncode: X2A,
        isSpecialQueryPercentEncode: Bn5,
        isPathPercentEncode: MM7,
        isUserinfoPercentEncode: PM7,
        isURLEncodedPercentEncode: pn5,
        percentDecodeString: In5,
        percentDecodeBytes: jM7,
        utf8PercentEncodeString: cn5,
        utf8PercentEncodeCodePoint: dn5
    }
})
// @from(Ln 179981, Col 4)
G2A = R((Gr5, KZ) => {
    var ln5 = $M7(),
        EM = _2A(),
        {
            utf8DecodeWithoutBOM: in5
        } = qz6(),
        {
            percentDecodeString: nn5,
            utf8PercentEncodeCodePoint: zz6,
            utf8PercentEncodeString: wz6,
            isC0ControlPercentEncode: TM7,
            isFragmentPercentEncode: rn5,
            isQueryPercentEncode: on5,
            isSpecialQueryPercentEncode: an5,
            isPathPercentEncode: sn5,
            isUserinfoPercentEncode: M2A
        } = Kz6();

    function q7(A) {
        return A.codePointAt(0)
    }
    var vM7 = {
            ftp: 21,
            file: null,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
        },
        K5 = Symbol("failure");

    function ZM7(A) {
        return [...A].length
    }

    function fM7(A, q) {
        let K = A[q];
        return isNaN(K) ? void 0 : String.fromCodePoint(K)
    }

    function VM7(A) {
        return A === "." || A.toLowerCase() === "%2e"
    }

    function tn5(A) {
        return A = A.toLowerCase(), A === ".." || A === "%2e." || A === ".%2e" || A === "%2e%2e"
    }

    function en5(A, q) {
        return EM.isASCIIAlpha(A) && (q === q7(":") || q === q7("|"))
    }

    function EM7(A) {
        return A.length === 2 && EM.isASCIIAlpha(A.codePointAt(0)) && (A[1] === ":" || A[1] === "|")
    }

    function Ar5(A) {
        return A.length === 2 && EM.isASCIIAlpha(A.codePointAt(0)) && A[1] === ":"
    }

    function kM7(A) {
        return A.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1
    }

    function qr5(A) {
        return kM7(A) || A.search(/[\u0000-\u001F]|%|\u007F/u) !== -1
    }

    function Yz6(A) {
        return vM7[A] !== void 0
    }

    function vM(A) {
        return Yz6(A.scheme)
    }

    function D2A(A) {
        return !Yz6(A.scheme)
    }

    function LM7(A) {
        return vM7[A]
    }

    function RM7(A) {
        if (A === "") return K5;
        let q = 10;
        if (A.length >= 2 && A.charAt(0) === "0" && A.charAt(1).toLowerCase() === "x") A = A.substring(2), q = 16;
        else if (A.length >= 2 && A.charAt(0) === "0") A = A.substring(1), q = 8;
        if (A === "") return 0;
        let K = /[^0-7]/u;
        if (q === 10) K = /[^0-9]/u;
        if (q === 16) K = /[^0-9A-Fa-f]/u;
        if (K.test(A)) return K5;
        return parseInt(A, q)
    }

    function Kr5(A) {
        let q = A.split(".");
        if (q[q.length - 1] === "") {
            if (q.length > 1) q.pop()
        }
        if (q.length > 4) return K5;
        let K = [];
        for (let w of q) {
            let H = RM7(w);
            if (H === K5) return K5;
            K.push(H)
        }
        for (let w = 0; w < K.length - 1; ++w)
            if (K[w] > 255) return K5;
        if (K[K.length - 1] >= 256 ** (5 - K.length)) return K5;
        let Y = K.pop(),
            z = 0;
        for (let w of K) Y += w * 256 ** (3 - z), ++z;
        return Y
    }

    function Yr5(A) {
        let q = "",
            K = A;
        for (let Y = 1; Y <= 4; ++Y) {
            if (q = String(K % 256) + q, Y !== 4) q = `.${q}`;
            K = Math.floor(K / 256)
        }
        return q
    }

    function zr5(A) {
        let q = [0, 0, 0, 0, 0, 0, 0, 0],
            K = 0,
            Y = null,
            z = 0;
        if (A = Array.from(A, (w) => w.codePointAt(0)), A[z] === q7(":")) {
            if (A[z + 1] !== q7(":")) return K5;
            z += 2, ++K, Y = K
        }
        while (z < A.length) {
            if (K === 8) return K5;
            if (A[z] === q7(":")) {
                if (Y !== null) return K5;
                ++z, ++K, Y = K;
                continue
            }
            let w = 0,
                H = 0;
            while (H < 4 && EM.isASCIIHex(A[z])) w = w * 16 + parseInt(fM7(A, z), 16), ++z, ++H;
            if (A[z] === q7(".")) {
                if (H === 0) return K5;
                if (z -= H, K > 6) return K5;
                let $ = 0;
                while (A[z] !== void 0) {
                    let O = null;
                    if ($ > 0)
                        if (A[z] === q7(".") && $ < 4) ++z;
                        else return K5;
                    if (!EM.isASCIIDigit(A[z])) return K5;
                    while (EM.isASCIIDigit(A[z])) {
                        let _ = parseInt(fM7(A, z));
                        if (O === null) O = _;
                        else if (O === 0) return K5;
                        else O = O * 10 + _;
                        if (O > 255) return K5;
                        ++z
                    }
                    if (q[K] = q[K] * 256 + O, ++$, $ === 2 || $ === 4) ++K
                }
                if ($ !== 4) return K5;
                break
            } else if (A[z] === q7(":")) {
                if (++z, A[z] === void 0) return K5
            } else if (A[z] !== void 0) return K5;
            q[K] = w, ++K
        }
        if (Y !== null) {
            let w = K - Y;
            K = 7;
            while (K !== 0 && w > 0) {
                let H = q[Y + w - 1];
                q[Y + w - 1] = q[K], q[K] = H, --K, --w
            }
        } else if (Y === null && K !== 8) return K5;
        return q
    }

    function wr5(A) {
        let q = "",
            K = Or5(A),
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

    function j2A(A, q = !1) {
        if (A[0] === "[") {
            if (A[A.length - 1] !== "]") return K5;
            return zr5(A.substring(1, A.length - 1))
        }
        if (q) return $r5(A);
        let K = in5(nn5(A)),
            Y = _r5(K);
        if (Y === K5) return K5;
        if (Hr5(Y)) return Kr5(Y);
        return Y
    }

    function Hr5(A) {
        let q = A.split(".");
        if (q[q.length - 1] === "") {
            if (q.length === 1) return !1;
            q.pop()
        }
        let K = q[q.length - 1];
        if (RM7(K) !== K5) return !0;
        if (/^[0-9]+$/u.test(K)) return !0;
        return !1
    }

    function $r5(A) {
        if (kM7(A)) return K5;
        return wz6(A, TM7)
    }

    function Or5(A) {
        let q = null,
            K = 1,
            Y = null,
            z = 0;
        for (let w = 0; w < A.length; ++w)
            if (A[w] !== 0) {
                if (z > K) q = Y, K = z;
                Y = null, z = 0
            } else {
                if (Y === null) Y = w;
                ++z
            } if (z > K) return Y;
        return q
    }

    function P2A(A) {
        if (typeof A === "number") return Yr5(A);
        if (A instanceof Array) return `[${wr5(A)}]`;
        return A
    }

    function _r5(A, q = !1) {
        let K = ln5.toASCII(A, {
            checkHyphens: q,
            checkBidi: !0,
            checkJoiners: !0,
            useSTD3ASCIIRules: q,
            transitionalProcessing: !1,
            verifyDNSLength: q,
            ignoreInvalidPunycode: !1
        });
        if (K === null) return K5;
        if (!q) {
            if (K === "") return K5;
            if (qr5(K)) return K5
        }
        return K
    }

    function Jr5(A) {
        let q = 0,
            K = A.length;
        for (; q < K; ++q)
            if (A.charCodeAt(q) > 32) break;
        for (; K > q; --K)
            if (A.charCodeAt(K - 1) > 32) break;
        return A.substring(q, K)
    }

    function Xr5(A) {
        return A.replace(/\u0009|\u000A|\u000D/ug, "")
    }

    function yM7(A) {
        let {
            path: q
        } = A;
        if (q.length === 0) return;
        if (A.scheme === "file" && q.length === 1 && jr5(q[0])) return;
        q.pop()
    }

    function CM7(A) {
        return A.username !== "" || A.password !== ""
    }

    function Dr5(A) {
        return A.host === null || A.host === "" || A.scheme === "file"
    }

    function II1(A) {
        return typeof A.path === "string"
    }

    function jr5(A) {
        return /^[A-Za-z]:$/u.test(A)
    }

    function y_(A, q, K, Y, z) {
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
            let H = Jr5(this.input);
            if (H !== this.input) this.parseError = !0;
            this.input = H
        }
        let w = Xr5(this.input);
        if (w !== this.input) this.parseError = !0;
        this.input = w, this.state = z || "scheme start", this.buffer = "", this.atFlag = !1, this.arrFlag = !1, this.passwordTokenSeenFlag = !1, this.input = Array.from(this.input, (H) => H.codePointAt(0));
        for (; this.pointer <= this.input.length; ++this.pointer) {
            let H = this.input[this.pointer],
                $ = isNaN(H) ? void 0 : String.fromCodePoint(H),
                O = this[`parse ${this.state}`](H, $);
            if (!O) break;
            else if (O === K5) {
                this.failure = !0;
                break
            }
        }
    }
    y_.prototype["parse scheme start"] = function(q, K) {
        if (EM.isASCIIAlpha(q)) this.buffer += K.toLowerCase(), this.state = "scheme";
        else if (!this.stateOverride) this.state = "no scheme", --this.pointer;
        else return this.parseError = !0, K5;
        return !0
    };
    y_.prototype["parse scheme"] = function(q, K) {
        if (EM.isASCIIAlphanumeric(q) || q === q7("+") || q === q7("-") || q === q7(".")) this.buffer += K.toLowerCase();
        else if (q === q7(":")) {
            if (this.stateOverride) {
                if (vM(this.url) && !Yz6(this.buffer)) return !1;
                if (!vM(this.url) && Yz6(this.buffer)) return !1;
                if ((CM7(this.url) || this.url.port !== null) && this.buffer === "file") return !1;
                if (this.url.scheme === "file" && this.url.host === "") return !1
            }
            if (this.url.scheme = this.buffer, this.stateOverride) {
                if (this.url.port === LM7(this.url.scheme)) this.url.port = null;
                return !1
            }
            if (this.buffer = "", this.url.scheme === "file") {
                if (this.input[this.pointer + 1] !== q7("/") || this.input[this.pointer + 2] !== q7("/")) this.parseError = !0;
                this.state = "file"
            } else if (vM(this.url) && this.base !== null && this.base.scheme === this.url.scheme) this.state = "special relative or authority";
            else if (vM(this.url)) this.state = "special authority slashes";
            else if (this.input[this.pointer + 1] === q7("/")) this.state = "path or authority", ++this.pointer;
            else this.url.path = "", this.state = "opaque path"
        } else if (!this.stateOverride) this.buffer = "", this.state = "no scheme", this.pointer = -1;
        else return this.parseError = !0, K5;
        return !0
    };
    y_.prototype["parse no scheme"] = function(q) {
        if (this.base === null || II1(this.base) && q !== q7("#")) return K5;
        else if (II1(this.base) && q === q7("#")) this.url.scheme = this.base.scheme, this.url.path = this.base.path, this.url.query = this.base.query, this.url.fragment = "", this.state = "fragment";
        else if (this.base.scheme === "file") this.state = "file", --this.pointer;
        else this.state = "relative", --this.pointer;
        return !0
    };
    y_.prototype["parse special relative or authority"] = function(q) {
        if (q === q7("/") && this.input[this.pointer + 1] === q7("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "relative", --this.pointer;
        return !0
    };
    y_.prototype["parse path or authority"] = function(q) {
        if (q === q7("/")) this.state = "authority";
        else this.state = "path", --this.pointer;
        return !0
    };
    y_.prototype["parse relative"] = function(q) {
        if (this.url.scheme = this.base.scheme, q === q7("/")) this.state = "relative slash";
        else if (vM(this.url) && q === q7("\\")) this.parseError = !0, this.state = "relative slash";
        else if (this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.url.path = this.base.path.slice(), this.url.query = this.base.query, q === q7("?")) this.url.query = "", this.state = "query";
        else if (q === q7("#")) this.url.fragment = "", this.state = "fragment";
        else if (!isNaN(q)) this.url.query = null, this.url.path.pop(), this.state = "path", --this.pointer;
        return !0
    };
    y_.prototype["parse relative slash"] = function(q) {
        if (vM(this.url) && (q === q7("/") || q === q7("\\"))) {
            if (q === q7("\\")) this.parseError = !0;
            this.state = "special authority ignore slashes"
        } else if (q === q7("/")) this.state = "authority";
        else this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.state = "path", --this.pointer;
        return !0
    };
    y_.prototype["parse special authority slashes"] = function(q) {
        if (q === q7("/") && this.input[this.pointer + 1] === q7("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "special authority ignore slashes", --this.pointer;
        return !0
    };
    y_.prototype["parse special authority ignore slashes"] = function(q) {
        if (q !== q7("/") && q !== q7("\\")) this.state = "authority", --this.pointer;
        else this.parseError = !0;
        return !0
    };
    y_.prototype["parse authority"] = function(q, K) {
        if (q === q7("@")) {
            if (this.parseError = !0, this.atFlag) this.buffer = `%40${this.buffer}`;
            this.atFlag = !0;
            let Y = ZM7(this.buffer);
            for (let z = 0; z < Y; ++z) {
                let w = this.buffer.codePointAt(z);
                if (w === q7(":") && !this.passwordTokenSeenFlag) {
                    this.passwordTokenSeenFlag = !0;
                    continue
                }
                let H = zz6(w, M2A);
                if (this.passwordTokenSeenFlag) this.url.password += H;
                else this.url.username += H
            }
            this.buffer = ""
        } else if (isNaN(q) || q === q7("/") || q === q7("?") || q === q7("#") || vM(this.url) && q === q7("\\")) {
            if (this.atFlag && this.buffer === "") return this.parseError = !0, K5;
            this.pointer -= ZM7(this.buffer) + 1, this.buffer = "", this.state = "host"
        } else this.buffer += K;
        return !0
    };
    y_.prototype["parse hostname"] = y_.prototype["parse host"] = function(q, K) {
        if (this.stateOverride && this.url.scheme === "file") --this.pointer, this.state = "file host";
        else if (q === q7(":") && !this.arrFlag) {
            if (this.buffer === "") return this.parseError = !0, K5;
            if (this.stateOverride === "hostname") return !1;
            let Y = j2A(this.buffer, D2A(this.url));
            if (Y === K5) return K5;
            this.url.host = Y, this.buffer = "", this.state = "port"
        } else if (isNaN(q) || q === q7("/") || q === q7("?") || q === q7("#") || vM(this.url) && q === q7("\\")) {
            if (--this.pointer, vM(this.url) && this.buffer === "") return this.parseError = !0, K5;
            else if (this.stateOverride && this.buffer === "" && (CM7(this.url) || this.url.port !== null)) return this.parseError = !0, !1;
            let Y = j2A(this.buffer, D2A(this.url));
            if (Y === K5) return K5;
            if (this.url.host = Y, this.buffer = "", this.state = "path start", this.stateOverride) return !1
        } else {
            if (q === q7("[")) this.arrFlag = !0;
            else if (q === q7("]")) this.arrFlag = !1;
            this.buffer += K
        }
        return !0
    };
    y_.prototype["parse port"] = function(q, K) {
        if (EM.isASCIIDigit(q)) this.buffer += K;
        else if (isNaN(q) || q === q7("/") || q === q7("?") || q === q7("#") || vM(this.url) && q === q7("\\") || this.stateOverride) {
            if (this.buffer !== "") {
                let Y = parseInt(this.buffer);
                if (Y > 65535) return this.parseError = !0, K5;
                this.url.port = Y === LM7(this.url.scheme) ? null : Y, this.buffer = ""
            }
            if (this.stateOverride) return !1;
            this.state = "path start", --this.pointer
        } else return this.parseError = !0, K5;
        return !0
    };
    var Mr5 = new Set([q7("/"), q7("\\"), q7("?"), q7("#")]);

    function SM7(A, q) {
        let K = A.length - q;
        return K >= 2 && en5(A[q], A[q + 1]) && (K === 2 || Mr5.has(A[q + 2]))
    }
    y_.prototype["parse file"] = function(q) {
        if (this.url.scheme = "file", this.url.host = "", q === q7("/") || q === q7("\\")) {
            if (q === q7("\\")) this.parseError = !0;
            this.state = "file slash"
        } else if (this.base !== null && this.base.scheme === "file") {
            if (this.url.host = this.base.host, this.url.path = this.base.path.slice(), this.url.query = this.base.query, q === q7("?")) this.url.query = "", this.state = "query";
            else if (q === q7("#")) this.url.fragment = "", this.state = "fragment";
            else if (!isNaN(q)) {
                if (this.url.query = null, !SM7(this.input, this.pointer)) yM7(this.url);
                else this.parseError = !0, this.url.path = [];
                this.state = "path", --this.pointer
            }
        } else this.state = "path", --this.pointer;
        return !0
    };
    y_.prototype["parse file slash"] = function(q) {
        if (q === q7("/") || q === q7("\\")) {
            if (q === q7("\\")) this.parseError = !0;
            this.state = "file host"
        } else {
            if (this.base !== null && this.base.scheme === "file") {
                if (!SM7(this.input, this.pointer) && Ar5(this.base.path[0])) this.url.path.push(this.base.path[0]);
                this.url.host = this.base.host
            }
            this.state = "path", --this.pointer
        }
        return !0
    };
    y_.prototype["parse file host"] = function(q, K) {
        if (isNaN(q) || q === q7("/") || q === q7("\\") || q === q7("?") || q === q7("#"))
            if (--this.pointer, !this.stateOverride && EM7(this.buffer)) this.parseError = !0, this.state = "path";
            else if (this.buffer === "") {
            if (this.url.host = "", this.stateOverride) return !1;
            this.state = "path start"
        } else {
            let Y = j2A(this.buffer, D2A(this.url));
            if (Y === K5) return K5;
            if (Y === "localhost") Y = "";
            if (this.url.host = Y, this.stateOverride) return !1;
            this.buffer = "", this.state = "path start"
        } else this.buffer += K;
        return !0
    };
    y_.prototype["parse path start"] = function(q) {
        if (vM(this.url)) {
            if (q === q7("\\")) this.parseError = !0;
            if (this.state = "path", q !== q7("/") && q !== q7("\\")) --this.pointer
        } else if (!this.stateOverride && q === q7("?")) this.url.query = "", this.state = "query";
        else if (!this.stateOverride && q === q7("#")) this.url.fragment = "", this.state = "fragment";
        else if (q !== void 0) {
            if (this.state = "path", q !== q7("/")) --this.pointer
        } else if (this.stateOverride && this.url.host === null) this.url.path.push("");
        return !0
    };
    y_.prototype["parse path"] = function(q) {
        if (isNaN(q) || q === q7("/") || vM(this.url) && q === q7("\\") || !this.stateOverride && (q === q7("?") || q === q7("#"))) {
            if (vM(this.url) && q === q7("\\")) this.parseError = !0;
            if (tn5(this.buffer)) {
                if (yM7(this.url), q !== q7("/") && !(vM(this.url) && q === q7("\\"))) this.url.path.push("")
            } else if (VM7(this.buffer) && q !== q7("/") && !(vM(this.url) && q === q7("\\"))) this.url.path.push("");
            else if (!VM7(this.buffer)) {
                if (this.url.scheme === "file" && this.url.path.length === 0 && EM7(this.buffer)) this.buffer = `${this.buffer[0]}:`;
                this.url.path.push(this.buffer)
            }
            if (this.buffer = "", q === q7("?")) this.url.query = "", this.state = "query";
            if (q === q7("#")) this.url.fragment = "", this.state = "fragment"
        } else {
            if (q === q7("%") && (!EM.isASCIIHex(this.input[this.pointer + 1]) || !EM.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += zz6(q, sn5)
        }
        return !0
    };
    y_.prototype["parse opaque path"] = function(q) {
        if (q === q7("?")) this.url.query = "", this.state = "query";
        else if (q === q7("#")) this.url.fragment = "", this.state = "fragment";
        else if (q === q7(" ")) {
            let K = this.input[this.pointer + 1];
            if (K === q7("?") || K === q7("#")) this.url.path += "%20";
            else this.url.path += " "
        } else {
            if (!isNaN(q) && q !== q7("%")) this.parseError = !0;
            if (q === q7("%") && (!EM.isASCIIHex(this.input[this.pointer + 1]) || !EM.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            if (!isNaN(q)) this.url.path += zz6(q, TM7)
        }
        return !0
    };
    y_.prototype["parse query"] = function(q, K) {
        if (!vM(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") this.encodingOverride = "utf-8";
        if (!this.stateOverride && q === q7("#") || isNaN(q)) {
            let Y = vM(this.url) ? an5 : on5;
            if (this.url.query += wz6(this.buffer, Y), this.buffer = "", q === q7("#")) this.url.fragment = "", this.state = "fragment"
        } else if (!isNaN(q)) {
            if (q === q7("%") && (!EM.isASCIIHex(this.input[this.pointer + 1]) || !EM.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += K
        }
        return !0
    };
    y_.prototype["parse fragment"] = function(q) {
        if (!isNaN(q)) {
            if (q === q7("%") && (!EM.isASCIIHex(this.input[this.pointer + 1]) || !EM.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.url.fragment += zz6(q, rn5)
        }
        return !0
    };

    function Pr5(A, q) {
        let K = `${A.scheme}:`;
        if (A.host !== null) {
            if (K += "//", A.username !== "" || A.password !== "") {
                if (K += A.username, A.password !== "") K += `:${A.password}`;
                K += "@"
            }
            if (K += P2A(A.host), A.port !== null) K += `:${A.port}`
        }
        if (A.host === null && !II1(A) && A.path.length > 1 && A.path[0] === "") K += "/.";
        if (K += W2A(A), A.query !== null) K += `?${A.query}`;
        if (!q && A.fragment !== null) K += `#${A.fragment}`;
        return K
    }

    function Wr5(A) {
        let q = `${A.scheme}://`;
        if (q += P2A(A.host), A.port !== null) q += `:${A.port}`;
        return q
    }

    function W2A(A) {
        if (II1(A)) return A.path;
        let q = "";
        for (let K of A.path) q += `/${K}`;
        return q
    }
    Gr5.serializeURL = Pr5;
    Gr5.serializePath = W2A;
    Gr5.serializeURLOrigin = function(A) {
        switch (A.scheme) {
            case "blob": {
                let q = Gr5.parseURL(W2A(A));
                if (q === null) return "null";
                if (q.scheme !== "http" && q.scheme !== "https") return "null";
                return Gr5.serializeURLOrigin(q)
            }
            case "ftp":
            case "http":
            case "https":
            case "ws":
            case "wss":
                return Wr5({
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
    Gr5.basicURLParse = function(A, q) {
        if (q === void 0) q = {};
        let K = new y_(A, q.baseURL, q.encodingOverride, q.url, q.stateOverride);
        if (K.failure) return null;
        return K.url
    };
    Gr5.setTheUsername = function(A, q) {
        A.username = wz6(q, M2A)
    };
    Gr5.setThePassword = function(A, q) {
        A.password = wz6(q, M2A)
    };
    Gr5.serializeHost = P2A;
    Gr5.cannotHaveAUsernamePasswordPort = Dr5;
    Gr5.hasAnOpaquePath = II1;
    Gr5.serializeInteger = function(A) {
        return String(A)
    };
    Gr5.parseURL = function(A, q) {
        if (q === void 0) q = {};
        return Gr5.basicURLParse(A, {
            baseURL: q.baseURL,
            encodingOverride: q.encodingOverride
        })
    }
})
// @from(Ln 180640, Col 4)
Z2A = R(($c2, FM7) => {
    var {
        utf8Encode: Rr5,
        utf8DecodeWithoutBOM: IM7
    } = qz6(), {
        percentDecodeBytes: xM7,
        utf8PercentEncodeString: bM7,
        isURLEncodedPercentEncode: uM7
    } = Kz6();

    function BM7(A) {
        return A.codePointAt(0)
    }

    function yr5(A) {
        let q = hr5(A, BM7("&")),
            K = [];
        for (let Y of q) {
            if (Y.length === 0) continue;
            let z, w, H = Y.indexOf(BM7("="));
            if (H >= 0) z = Y.slice(0, H), w = Y.slice(H + 1);
            else z = Y, w = new Uint8Array(0);
            z = mM7(z, 43, 32), w = mM7(w, 43, 32);
            let $ = IM7(xM7(z)),
                O = IM7(xM7(w));
            K.push([$, O])
        }
        return K
    }

    function Cr5(A) {
        return yr5(Rr5(A))
    }

    function Sr5(A) {
        let q = "";
        for (let [K, Y] of A.entries()) {
            let z = bM7(Y[0], uM7, !0),
                w = bM7(Y[1], uM7, !0);
            if (K !== 0) q += "&";
            q += `${z}=${w}`
        }
        return q
    }

    function hr5(A, q) {
        let K = [],
            Y = 0,
            z = A.indexOf(q);
        while (z >= 0) K.push(A.slice(Y, z)), Y = z + 1, z = A.indexOf(q, Y);
        if (Y !== A.length) K.push(A.slice(Y));
        return K
    }

    function mM7(A, q, K) {
        let Y = A.indexOf(q);
        while (Y >= 0) A[Y] = K, Y = A.indexOf(q, Y + 1);
        return A
    }
    FM7.exports = {
        parseUrlencodedString: Cr5,
        serializeUrlencoded: Sr5
    }
})
// @from(Ln 180704, Col 4)
gM7 = R((Ir5) => {
    var QM7 = tY6(),
        Hz6 = Az6();
    Ir5.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (typeof q !== "function") throw new A.TypeError(K + " is not a function");

        function Y(...z) {
            let w = Hz6.tryWrapperForImpl(this),
                H;
            for (let $ = 0; $ < z.length; $++) z[$] = Hz6.tryWrapperForImpl(z[$]);
            return H = Reflect.apply(q, w, z), H = QM7.any(H, {
                context: K,
                globals: A
            }), H
        }
        return Y.construct = (...z) => {
            for (let H = 0; H < z.length; H++) z[H] = Hz6.tryWrapperForImpl(z[H]);
            let w = Reflect.construct(q, z);
            return w = QM7.any(w, {
                context: K,
                globals: A
            }), w
        }, Y[Hz6.wrapperSymbol] = q, Y.objectReference = q, Y
    }
})
// @from(Ln 180731, Col 4)
UM7 = R((br5) => {
    var f2A = Z2A();
    br5.implementation = class {
        constructor(q, K, {
            doNotStripQMark: Y = !1
        }) {
            let z = K[0];
            if (this._list = [], this._url = null, !Y && typeof z === "string" && z[0] === "?") z = z.slice(1);
            if (Array.isArray(z))
                for (let w of z) {
                    if (w.length !== 2) throw TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
                    this._list.push([w[0], w[1]])
                } else if (typeof z === "object" && Object.getPrototypeOf(z) === null)
                    for (let w of Object.keys(z)) {
                        let H = z[w];
                        this._list.push([w, H])
                    } else this._list = f2A.parseUrlencodedString(z)
        }
        _updateSteps() {
            if (this._url !== null) {
                let q = f2A.serializeUrlencoded(this._list);
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
            return f2A.serializeUrlencoded(this._list)
        }
    }
})
// @from(Ln 180810, Col 4)
N2A = R((Fr5) => {
    var bV = tY6(),
        Lw = Az6(),
        Br5 = gM7(),
        pM7 = Lw.newObjectInRealm,
        jJ = Lw.implSymbol,
        dM7 = Lw.ctorRegistrySymbol;
    Fr5.is = (A) => {
        return Lw.isObject(A) && Lw.hasOwn(A, jJ) && A[jJ] instanceof jo.implementation
    };
    Fr5.isImpl = (A) => {
        return Lw.isObject(A) && A instanceof jo.implementation
    };
    Fr5.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (Fr5.is(q)) return Lw.implForWrapper(q);
        throw new A.TypeError(`${K} is not of type 'URLSearchParams'.`)
    };
    Fr5.createDefaultIterator = (A, q, K) => {
        let z = A[dM7]["URLSearchParams Iterator"],
            w = Object.create(z);
        return Object.defineProperty(w, Lw.iterInternalSymbol, {
            value: {
                target: q,
                kind: K,
                index: 0
            },
            configurable: !0
        }), w
    };

    function cM7(A, q) {
        let K;
        if (q !== void 0) K = q.prototype;
        if (!Lw.isObject(K)) K = A[dM7].URLSearchParams.prototype;
        return Object.create(K)
    }
    Fr5.create = (A, q, K) => {
        let Y = cM7(A);
        return Fr5.setup(Y, A, q, K)
    };
    Fr5.createImpl = (A, q, K) => {
        let Y = Fr5.create(A, q, K);
        return Lw.implForWrapper(Y)
    };
    Fr5._internalSetup = (A, q) => {};
    Fr5.setup = (A, q, K = [], Y = {}) => {
        if (Y.wrapper = A, Fr5._internalSetup(A, q), Object.defineProperty(A, jJ, {
                value: new jo.implementation(q, K, Y),
                configurable: !0
            }), A[jJ][Lw.wrapperSymbol] = A, jo.init) jo.init(A[jJ]);
        return A
    };
    Fr5.new = (A, q) => {
        let K = cM7(A, q);
        if (Fr5._internalSetup(K, A), Object.defineProperty(K, jJ, {
                value: Object.create(jo.implementation.prototype),
                configurable: !0
            }), K[jJ][Lw.wrapperSymbol] = K, jo.init) jo.init(K[jJ]);
        return K[jJ]
    };
    var mr5 = new Set(["Window", "Worker"]);
    Fr5.install = (A, q) => {
        if (!q.some((z) => mr5.has(z))) return;
        let K = Lw.initCtorRegistry(A);
        class Y {
            constructor() {
                let z = [];
                {
                    let w = arguments[0];
                    if (w !== void 0)
                        if (Lw.isObject(w))
                            if (w[Symbol.iterator] !== void 0)
                                if (!Lw.isObject(w)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
                                else {
                                    let H = [],
                                        $ = w;
                                    for (let O of $) {
                                        if (!Lw.isObject(O)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                                        else {
                                            let _ = [],
                                                J = O;
                                            for (let X of J) X = bV.USVString(X, {
                                                context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                                                globals: A
                                            }), _.push(X);
                                            O = _
                                        }
                                        H.push(O)
                                    }
                                    w = H
                                }
                    else if (!Lw.isObject(w)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
                    else {
                        let H = Object.create(null);
                        for (let $ of Reflect.ownKeys(w)) {
                            let O = Object.getOwnPropertyDescriptor(w, $);
                            if (O && O.enumerable) {
                                let _ = $;
                                _ = bV.USVString(_, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                                    globals: A
                                });
                                let J = w[$];
                                J = bV.USVString(J, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                                    globals: A
                                }), H[_] = J
                            }
                        }
                        w = H
                    } else w = bV.USVString(w, {
                        context: "Failed to construct 'URLSearchParams': parameter 1",
                        globals: A
                    });
                    else w = "";
                    z.push(w)
                }
                return Fr5.setup(Object.create(new.target.prototype), A, z)
            }
            append(z, w) {
                let H = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(H)) throw new A.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let $ = [];
                {
                    let O = arguments[0];
                    O = bV.USVString(O, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), $.push(O)
                } {
                    let O = arguments[1];
                    O = bV.USVString(O, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
                        globals: A
                    }), $.push(O)
                }
                return Lw.tryWrapperForImpl(H[jJ].append(...$))
            }
            delete(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(w)) throw new A.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let H = [];
                {
                    let $ = arguments[0];
                    $ = bV.USVString($, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), H.push($)
                } {
                    let $ = arguments[1];
                    if ($ !== void 0) $ = bV.USVString($, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
                        globals: A
                    });
                    H.push($)
                }
                return Lw.tryWrapperForImpl(w[jJ].delete(...H))
            }
            get(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(w)) throw new A.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let H = [];
                {
                    let $ = arguments[0];
                    $ = bV.USVString($, {
                        context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), H.push($)
                }
                return w[jJ].get(...H)
            }
            getAll(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(w)) throw new A.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let H = [];
                {
                    let $ = arguments[0];
                    $ = bV.USVString($, {
                        context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), H.push($)
                }
                return Lw.tryWrapperForImpl(w[jJ].getAll(...H))
            }
            has(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(w)) throw new A.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let H = [];
                {
                    let $ = arguments[0];
                    $ = bV.USVString($, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), H.push($)
                } {
                    let $ = arguments[1];
                    if ($ !== void 0) $ = bV.USVString($, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
                        globals: A
                    });
                    H.push($)
                }
                return w[jJ].has(...H)
            }
            set(z, w) {
                let H = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(H)) throw new A.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let $ = [];
                {
                    let O = arguments[0];
                    O = bV.USVString(O, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
                        globals: A
                    }), $.push(O)
                } {
                    let O = arguments[1];
                    O = bV.USVString(O, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
                        globals: A
                    }), $.push(O)
                }
                return Lw.tryWrapperForImpl(H[jJ].set(...$))
            }
            sort() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(z)) throw new A.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
                return Lw.tryWrapperForImpl(z[jJ].sort())
            }
            toString() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
                return z[jJ].toString()
            }
            keys() {
                if (!Fr5.is(this)) throw new A.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
                return Fr5.createDefaultIterator(A, this, "key")
            }
            values() {
                if (!Fr5.is(this)) throw new A.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
                return Fr5.createDefaultIterator(A, this, "value")
            }
            entries() {
                if (!Fr5.is(this)) throw new A.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
                return Fr5.createDefaultIterator(A, this, "key+value")
            }
            forEach(z) {
                if (!Fr5.is(this)) throw new A.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new A.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
                z = Br5.convert(A, z, {
                    context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
                });
                let w = arguments[1],
                    H = Array.from(this[jJ]),
                    $ = 0;
                while ($ < H.length) {
                    let [O, _] = H[$].map(Lw.tryWrapperForImpl);
                    z.call(w, _, O, this), H = Array.from(this[jJ]), $++
                }
            }
            get size() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!Fr5.is(z)) throw new A.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
                return z[jJ].size
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
        }), Lw.define(K["URLSearchParams Iterator"], {
            next() {
                let z = this && this[Lw.iterInternalSymbol];
                if (!z) throw new A.TypeError("next() called on a value that is not a URLSearchParams iterator object");
                let {
                    target: w,
                    kind: H,
                    index: $
                } = z, O = Array.from(w[jJ]), _ = O.length;
                if ($ >= _) return pM7(A, {
                    value: void 0,
                    done: !0
                });
                let J = O[$];
                return z.index = $ + 1, pM7(A, Lw.iteratorResult(J.map(Lw.tryWrapperForImpl), H))
            }
        }), Object.defineProperty(A, "URLSearchParams", {
            configurable: !0,
            writable: !0,
            value: Y
        })
    };
    var jo = UM7()
})
// @from(Ln 181161, Col 4)
rM7 = R((lr5) => {
    var Kw = G2A(),
        nM7 = Z2A(),
        cr5 = N2A();
    lr5.implementation = class A {
        constructor(q, [K, Y]) {
            let z = null;
            if (Y !== void 0) {
                if (z = Kw.basicURLParse(Y), z === null) throw TypeError(`Invalid base URL: ${Y}`)
            }
            let w = Kw.basicURLParse(K, {
                baseURL: z
            });
            if (w === null) throw TypeError(`Invalid URL: ${K}`);
            let H = w.query !== null ? w.query : "";
            this._url = w, this._query = cr5.createImpl(q, [H], {
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
                if (Y = Kw.basicURLParse(K), Y === null) return !1
            }
            if (Kw.basicURLParse(q, {
                    baseURL: Y
                }) === null) return !1;
            return !0
        }
        get href() {
            return Kw.serializeURL(this._url)
        }
        set href(q) {
            let K = Kw.basicURLParse(q);
            if (K === null) throw TypeError(`Invalid URL: ${q}`);
            this._url = K, this._query._list.splice(0);
            let {
                query: Y
            } = K;
            if (Y !== null) this._query._list = nM7.parseUrlencodedString(Y)
        }
        get origin() {
            return Kw.serializeURLOrigin(this._url)
        }
        get protocol() {
            return `${this._url.scheme}:`
        }
        set protocol(q) {
            Kw.basicURLParse(`${q}:`, {
                url: this._url,
                stateOverride: "scheme start"
            })
        }
        get username() {
            return this._url.username
        }
        set username(q) {
            if (Kw.cannotHaveAUsernamePasswordPort(this._url)) return;
            Kw.setTheUsername(this._url, q)
        }
        get password() {
            return this._url.password
        }
        set password(q) {
            if (Kw.cannotHaveAUsernamePasswordPort(this._url)) return;
            Kw.setThePassword(this._url, q)
        }
        get host() {
            let q = this._url;
            if (q.host === null) return "";
            if (q.port === null) return Kw.serializeHost(q.host);
            return `${Kw.serializeHost(q.host)}:${Kw.serializeInteger(q.port)}`
        }
        set host(q) {
            if (Kw.hasAnOpaquePath(this._url)) return;
            Kw.basicURLParse(q, {
                url: this._url,
                stateOverride: "host"
            })
        }
        get hostname() {
            if (this._url.host === null) return "";
            return Kw.serializeHost(this._url.host)
        }
        set hostname(q) {
            if (Kw.hasAnOpaquePath(this._url)) return;
            Kw.basicURLParse(q, {
                url: this._url,
                stateOverride: "hostname"
            })
        }
        get port() {
            if (this._url.port === null) return "";
            return Kw.serializeInteger(this._url.port)
        }
        set port(q) {
            if (Kw.cannotHaveAUsernamePasswordPort(this._url)) return;
            if (q === "") this._url.port = null;
            else Kw.basicURLParse(q, {
                url: this._url,
                stateOverride: "port"
            })
        }
        get pathname() {
            return Kw.serializePath(this._url)
        }
        set pathname(q) {
            if (Kw.hasAnOpaquePath(this._url)) return;
            this._url.path = [], Kw.basicURLParse(q, {
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
            K.query = "", Kw.basicURLParse(Y, {
                url: K,
                stateOverride: "query"
            }), this._query._list = nM7.parseUrlencodedString(Y)
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
            this._url.fragment = "", Kw.basicURLParse(K, {
                url: this._url,
                stateOverride: "fragment"
            })
        }
        toJSON() {
            return this.href
        }
    }
})
// @from(Ln 181320, Col 4)
tM7 = R((or5) => {
    var vW = tY6(),
        uV = Az6(),
        UY = uV.implSymbol,
        nr5 = uV.ctorRegistrySymbol;
    or5.is = (A) => {
        return uV.isObject(A) && uV.hasOwn(A, UY) && A[UY] instanceof pu.implementation
    };
    or5.isImpl = (A) => {
        return uV.isObject(A) && A instanceof pu.implementation
    };
    or5.convert = (A, q, {
        context: K = "The provided value"
    } = {}) => {
        if (or5.is(q)) return uV.implForWrapper(q);
        throw new A.TypeError(`${K} is not of type 'URL'.`)
    };

    function oM7(A, q) {
        let K;
        if (q !== void 0) K = q.prototype;
        if (!uV.isObject(K)) K = A[nr5].URL.prototype;
        return Object.create(K)
    }
    or5.create = (A, q, K) => {
        let Y = oM7(A);
        return or5.setup(Y, A, q, K)
    };
    or5.createImpl = (A, q, K) => {
        let Y = or5.create(A, q, K);
        return uV.implForWrapper(Y)
    };
    or5._internalSetup = (A, q) => {};
    or5.setup = (A, q, K = [], Y = {}) => {
        if (Y.wrapper = A, or5._internalSetup(A, q), Object.defineProperty(A, UY, {
                value: new pu.implementation(q, K, Y),
                configurable: !0
            }), A[UY][uV.wrapperSymbol] = A, pu.init) pu.init(A[UY]);
        return A
    };
    or5.new = (A, q) => {
        let K = oM7(A, q);
        if (or5._internalSetup(K, A), Object.defineProperty(K, UY, {
                value: Object.create(pu.implementation.prototype),
                configurable: !0
            }), K[UY][uV.wrapperSymbol] = K, pu.init) pu.init(K[UY]);
        return K[UY]
    };
    var rr5 = new Set(["Window", "Worker"]);
    or5.install = (A, q) => {
        if (!q.some((z) => rr5.has(z))) return;
        let K = uV.initCtorRegistry(A);
        class Y {
            constructor(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let H = arguments[0];
                    H = vW.USVString(H, {
                        context: "Failed to construct 'URL': parameter 1",
                        globals: A
                    }), w.push(H)
                } {
                    let H = arguments[1];
                    if (H !== void 0) H = vW.USVString(H, {
                        context: "Failed to construct 'URL': parameter 2",
                        globals: A
                    });
                    w.push(H)
                }
                return or5.setup(Object.create(new.target.prototype), A, w)
            }
            toJSON() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
                return z[UY].toJSON()
            }
            get href() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get href' called on an object that is not a valid instance of URL.");
                return z[UY].href
            }
            set href(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set href' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'href' property on 'URL': The provided value",
                    globals: A
                }), w[UY].href = z
            }
            toString() {
                let z = this;
                if (!or5.is(z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URL.");
                return z[UY].href
            }
            get origin() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get origin' called on an object that is not a valid instance of URL.");
                return z[UY].origin
            }
            get protocol() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
                return z[UY].protocol
            }
            set protocol(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'protocol' property on 'URL': The provided value",
                    globals: A
                }), w[UY].protocol = z
            }
            get username() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get username' called on an object that is not a valid instance of URL.");
                return z[UY].username
            }
            set username(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set username' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'username' property on 'URL': The provided value",
                    globals: A
                }), w[UY].username = z
            }
            get password() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get password' called on an object that is not a valid instance of URL.");
                return z[UY].password
            }
            set password(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set password' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'password' property on 'URL': The provided value",
                    globals: A
                }), w[UY].password = z
            }
            get host() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get host' called on an object that is not a valid instance of URL.");
                return z[UY].host
            }
            set host(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set host' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'host' property on 'URL': The provided value",
                    globals: A
                }), w[UY].host = z
            }
            get hostname() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
                return z[UY].hostname
            }
            set hostname(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'hostname' property on 'URL': The provided value",
                    globals: A
                }), w[UY].hostname = z
            }
            get port() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get port' called on an object that is not a valid instance of URL.");
                return z[UY].port
            }
            set port(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set port' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'port' property on 'URL': The provided value",
                    globals: A
                }), w[UY].port = z
            }
            get pathname() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
                return z[UY].pathname
            }
            set pathname(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'pathname' property on 'URL': The provided value",
                    globals: A
                }), w[UY].pathname = z
            }
            get search() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get search' called on an object that is not a valid instance of URL.");
                return z[UY].search
            }
            set search(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set search' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'search' property on 'URL': The provided value",
                    globals: A
                }), w[UY].search = z
            }
            get searchParams() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
                return uV.getSameObject(this, "searchParams", () => {
                    return uV.tryWrapperForImpl(z[UY].searchParams)
                })
            }
            get hash() {
                let z = this !== null && this !== void 0 ? this : A;
                if (!or5.is(z)) throw new A.TypeError("'get hash' called on an object that is not a valid instance of URL.");
                return z[UY].hash
            }
            set hash(z) {
                let w = this !== null && this !== void 0 ? this : A;
                if (!or5.is(w)) throw new A.TypeError("'set hash' called on an object that is not a valid instance of URL.");
                z = vW.USVString(z, {
                    context: "Failed to set the 'hash' property on 'URL': The provided value",
                    globals: A
                }), w[UY].hash = z
            }
            static parse(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'parse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let H = arguments[0];
                    H = vW.USVString(H, {
                        context: "Failed to execute 'parse' on 'URL': parameter 1",
                        globals: A
                    }), w.push(H)
                } {
                    let H = arguments[1];
                    if (H !== void 0) H = vW.USVString(H, {
                        context: "Failed to execute 'parse' on 'URL': parameter 2",
                        globals: A
                    });
                    w.push(H)
                }
                return uV.tryWrapperForImpl(pu.implementation.parse(A, ...w))
            }
            static canParse(z) {
                if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let H = arguments[0];
                    H = vW.USVString(H, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 1",
                        globals: A
                    }), w.push(H)
                } {
                    let H = arguments[1];
                    if (H !== void 0) H = vW.USVString(H, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 2",
                        globals: A
                    });
                    w.push(H)
                }
                return pu.implementation.canParse(...w)
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
    var pu = rM7()
})
// @from(Ln 181649, Col 4)
eM7 = R((Yo5) => {
    var qo5 = tM7(),
        Ko5 = N2A();
    Yo5.URL = qo5;
    Yo5.URLSearchParams = Ko5
})
// @from(Ln 181655, Col 4)
qP7 = R((Oo5) => {
    var {
        URL: Ho5,
        URLSearchParams: $o5
    } = eM7(), SS = G2A(), AP7 = Kz6(), Oz6 = {
        Array,
        Object,
        Promise,
        String,
        TypeError
    };
    Ho5.install(Oz6, ["Window"]);
    $o5.install(Oz6, ["Window"]);
    Oo5.URL = Oz6.URL;
    Oo5.URLSearchParams = Oz6.URLSearchParams;
    Oo5.parseURL = SS.parseURL;
    Oo5.basicURLParse = SS.basicURLParse;
    Oo5.serializeURL = SS.serializeURL;
    Oo5.serializePath = SS.serializePath;
    Oo5.serializeHost = SS.serializeHost;
    Oo5.serializeInteger = SS.serializeInteger;
    Oo5.serializeURLOrigin = SS.serializeURLOrigin;
    Oo5.setTheUsername = SS.setTheUsername;
    Oo5.setThePassword = SS.setThePassword;
    Oo5.cannotHaveAUsernamePasswordPort = SS.cannotHaveAUsernamePasswordPort;
    Oo5.hasAnOpaquePath = SS.hasAnOpaquePath;
    Oo5.percentDecodeString = AP7.percentDecodeString;
    Oo5.percentDecodeBytes = AP7.percentDecodeBytes
})