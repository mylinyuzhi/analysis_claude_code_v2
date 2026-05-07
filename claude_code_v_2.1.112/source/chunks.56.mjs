
// @from(Ln 146000, Col 4)
nxq = p((FK_, lxq) => {
    FK_.STATUS_MAPPING = {
        mapped: 1,
        valid: 2,
        disallowed: 3,
        deviation: 6,
        ignored: 7
    }
})
// @from(Ln 146009, Col 4)
sxq = p((fFO, axq) => {
    var ML1 = Uxq(),
        qI = dxq(),
        ixq = cxq(),
        {
            STATUS_MAPPING: Uq6
        } = nxq();

    function XL1(q) {
        return /[^\x00-\x7F]/u.test(q)
    }

    function rxq(q) {
        let K = 0,
            _ = ixq.length - 1;
        while (K <= _) {
            let z = Math.floor((K + _) / 2),
                Y = ixq[z],
                A = Array.isArray(Y[0]) ? Y[0][0] : Y[0],
                O = Array.isArray(Y[0]) ? Y[0][1] : Y[0];
            if (A <= q && O >= q) return Y.slice(1);
            else if (A > q) _ = z - 1;
            else K = z + 1
        }
        return null
    }

    function UK_(q, {
        transitionalProcessing: K
    }) {
        let _ = "";
        for (let z of q) {
            let [Y, A] = rxq(z.codePointAt(0));
            switch (Y) {
                case Uq6.disallowed:
                    _ += z;
                    break;
                case Uq6.ignored:
                    break;
                case Uq6.mapped:
                    if (K && z === "ẞ") _ += "ss";
                    else _ += A;
                    break;
                case Uq6.deviation:
                    if (K) _ += A;
                    else _ += z;
                    break;
                case Uq6.valid:
                    _ += z;
                    break
            }
        }
        return _
    }

    function QK_(q, {
        checkHyphens: K,
        checkBidi: _,
        checkJoiners: z,
        transitionalProcessing: Y,
        useSTD3ASCIIRules: A,
        isBidi: O
    }) {
        if (q.length === 0) return !0;
        if (q.normalize("NFC") !== q) return !1;
        let w = Array.from(q);
        if (K) {
            if (w[2] === "-" && w[3] === "-" || (q.startsWith("-") || q.endsWith("-"))) return !1
        }
        if (!K) {
            if (q.startsWith("xn--")) return !1
        }
        if (q.includes(".")) return !1;
        if (qI.combiningMarks.test(w[0])) return !1;
        for (let $ of w) {
            let j = $.codePointAt(0),
                [H] = rxq(j);
            if (Y) {
                if (H !== Uq6.valid) return !1
            } else if (H !== Uq6.valid && H !== Uq6.deviation) return !1;
            if (A && j <= 127) {
                if (!/^(?:[a-z]|[0-9]|-)$/u.test($)) return !1
            }
        }
        if (z) {
            let $ = 0;
            for (let [j, H] of w.entries())
                if (H === "‌" || H === "‍") {
                    if (j > 0) {
                        if (qI.combiningClassVirama.test(w[j - 1])) continue;
                        if (H === "‌") {
                            let J = w.indexOf("‌", j + 1),
                                X = J < 0 ? w.slice($) : w.slice($, J);
                            if (qI.validZWNJ.test(X.join(""))) {
                                $ = j + 1;
                                continue
                            }
                        }
                    }
                    return !1
                }
        }
        if (_ && O) {
            let $;
            if (qI.bidiS1LTR.test(w[0])) $ = !1;
            else if (qI.bidiS1RTL.test(w[0])) $ = !0;
            else return !1;
            if ($) {
                if (!qI.bidiS2.test(q) || !qI.bidiS3.test(q) || qI.bidiS4EN.test(q) && qI.bidiS4AN.test(q)) return !1
            } else if (!qI.bidiS5.test(q) || !qI.bidiS6.test(q)) return !1
        }
        return !0
    }

    function dK_(q) {
        let K = q.map((_) => {
            if (_.startsWith("xn--")) try {
                return ML1.decode(_.substring(4))
            } catch {
                return ""
            }
            return _
        }).join(".");
        return qI.bidiDomain.test(K)
    }

    function oxq(q, K) {
        let _ = UK_(q, K);
        _ = _.normalize("NFC");
        let z = _.split("."),
            Y = dK_(z),
            A = !1;
        for (let [O, w] of z.entries()) {
            let $ = w,
                j = K.transitionalProcessing;
            if ($.startsWith("xn--")) {
                if (XL1($)) {
                    A = !0;
                    continue
                }
                try {
                    $ = ML1.decode($.substring(4))
                } catch {
                    if (!K.ignoreInvalidPunycode) {
                        A = !0;
                        continue
                    }
                }
                if (z[O] = $, $ === "" || !XL1($)) A = !0;
                j = !1
            }
            if (A) continue;
            if (!QK_($, {
                    ...K,
                    transitionalProcessing: j,
                    isBidi: Y
                })) A = !0
        }
        return {
            string: z.join("."),
            error: A
        }
    }

    function cK_(q, {
        checkHyphens: K = !1,
        checkBidi: _ = !1,
        checkJoiners: z = !1,
        useSTD3ASCIIRules: Y = !1,
        verifyDNSLength: A = !1,
        transitionalProcessing: O = !1,
        ignoreInvalidPunycode: w = !1
    } = {}) {
        let $ = oxq(q, {
                checkHyphens: K,
                checkBidi: _,
                checkJoiners: z,
                useSTD3ASCIIRules: Y,
                transitionalProcessing: O,
                ignoreInvalidPunycode: w
            }),
            j = $.string.split(".");
        if (j = j.map((H) => {
                if (XL1(H)) try {
                    return `xn--${ML1.encode(H)}`
                } catch {
                    $.error = !0
                }
                return H
            }), A) {
            let H = j.join(".").length;
            if (H > 253 || H === 0) $.error = !0;
            for (let J = 0; J < j.length; ++J)
                if (j[J].length > 63 || j[J].length === 0) {
                    $.error = !0;
                    break
                }
        }
        if ($.error) return null;
        return j.join(".")
    }

    function lK_(q, {
        checkHyphens: K = !1,
        checkBidi: _ = !1,
        checkJoiners: z = !1,
        useSTD3ASCIIRules: Y = !1,
        transitionalProcessing: A = !1,
        ignoreInvalidPunycode: O = !1
    } = {}) {
        let w = oxq(q, {
            checkHyphens: K,
            checkBidi: _,
            checkJoiners: z,
            useSTD3ASCIIRules: Y,
            transitionalProcessing: A,
            ignoreInvalidPunycode: O
        });
        return {
            domain: w.string,
            error: w.error
        }
    }
    axq.exports = {
        toASCII: cK_,
        toUnicode: lK_
    }
})
// @from(Ln 146237, Col 4)
WL1 = p((GFO, exq) => {
    function PL1(q) {
        return q >= 48 && q <= 57
    }

    function txq(q) {
        return q >= 65 && q <= 90 || q >= 97 && q <= 122
    }

    function nK_(q) {
        return txq(q) || PL1(q)
    }

    function iK_(q) {
        return PL1(q) || q >= 65 && q <= 70 || q >= 97 && q <= 102
    }
    exq.exports = {
        isASCIIDigit: PL1,
        isASCIIAlpha: txq,
        isASCIIAlphanumeric: nK_,
        isASCIIHex: iK_
    }
})
// @from(Ln 146260, Col 4)
RT8 = p((vFO, quq) => {
    var rK_ = new TextEncoder,
        oK_ = new TextDecoder("utf-8", {
            ignoreBOM: !0
        });

    function aK_(q) {
        return rK_.encode(q)
    }

    function sK_(q) {
        return oK_.decode(q)
    }
    quq.exports = {
        utf8Encode: aK_,
        utf8DecodeWithoutBOM: sK_
    }
})
// @from(Ln 146278, Col 4)
ST8 = p((TFO, wuq) => {
    var {
        isASCIIHex: Kuq
    } = WL1(), {
        utf8Encode: _uq
    } = RT8();

    function TY(q) {
        return q.codePointAt(0)
    }

    function tK_(q) {
        let K = q.toString(16).toUpperCase();
        if (K.length === 1) K = `0${K}`;
        return `%${K}`
    }

    function zuq(q) {
        let K = new Uint8Array(q.byteLength),
            _ = 0;
        for (let z = 0; z < q.byteLength; ++z) {
            let Y = q[z];
            if (Y !== 37) K[_++] = Y;
            else if (Y === 37 && (!Kuq(q[z + 1]) || !Kuq(q[z + 2]))) K[_++] = Y;
            else {
                let A = parseInt(String.fromCodePoint(q[z + 1], q[z + 2]), 16);
                K[_++] = A, z += 2
            }
        }
        return K.slice(0, _)
    }

    function eK_(q) {
        let K = _uq(q);
        return zuq(K)
    }

    function DL1(q) {
        return q <= 31 || q > 126
    }
    var q5_ = new Set([TY(" "), TY('"'), TY("<"), TY(">"), TY("`")]);

    function K5_(q) {
        return DL1(q) || q5_.has(q)
    }
    var _5_ = new Set([TY(" "), TY('"'), TY("#"), TY("<"), TY(">")]);

    function ZL1(q) {
        return DL1(q) || _5_.has(q)
    }

    function z5_(q) {
        return ZL1(q) || q === TY("'")
    }
    var Y5_ = new Set([TY("?"), TY("`"), TY("{"), TY("}"), TY("^")]);

    function Yuq(q) {
        return ZL1(q) || Y5_.has(q)
    }
    var A5_ = new Set([TY("/"), TY(":"), TY(";"), TY("="), TY("@"), TY("["), TY("\\"), TY("]"), TY("|")]);

    function Auq(q) {
        return Yuq(q) || A5_.has(q)
    }
    var O5_ = new Set([TY("$"), TY("%"), TY("&"), TY("+"), TY(",")]);

    function w5_(q) {
        return Auq(q) || O5_.has(q)
    }
    var $5_ = new Set([TY("!"), TY("'"), TY("("), TY(")"), TY("~")]);

    function j5_(q) {
        return w5_(q) || $5_.has(q)
    }

    function Ouq(q, K) {
        let _ = _uq(q),
            z = "";
        for (let Y of _)
            if (!K(Y)) z += String.fromCharCode(Y);
            else z += tK_(Y);
        return z
    }

    function H5_(q, K) {
        return Ouq(String.fromCodePoint(q), K)
    }

    function J5_(q, K, _ = !1) {
        let z = "";
        for (let Y of q)
            if (_ && Y === " ") z += "+";
            else z += Ouq(Y, K);
        return z
    }
    wuq.exports = {
        isC0ControlPercentEncode: DL1,
        isFragmentPercentEncode: K5_,
        isQueryPercentEncode: ZL1,
        isSpecialQueryPercentEncode: z5_,
        isPathPercentEncode: Yuq,
        isUserinfoPercentEncode: Auq,
        isURLEncodedPercentEncode: j5_,
        percentDecodeString: eK_,
        percentDecodeBytes: zuq,
        utf8PercentEncodeString: J5_,
        utf8PercentEncodeCodePoint: H5_
    }
})
// @from(Ln 146387, Col 4)
kL1 = p((p5_, aV) => {
    var X5_ = sxq(),
        Mf = WL1(),
        {
            utf8DecodeWithoutBOM: M5_
        } = RT8(),
        {
            percentDecodeString: P5_,
            utf8PercentEncodeCodePoint: bT8,
            utf8PercentEncodeString: IT8,
            isC0ControlPercentEncode: Xuq,
            isFragmentPercentEncode: W5_,
            isQueryPercentEncode: D5_,
            isSpecialQueryPercentEncode: Z5_,
            isPathPercentEncode: f5_,
            isUserinfoPercentEncode: vL1
        } = ST8();

    function kq(q) {
        return q.codePointAt(0)
    }
    var Muq = {
            ftp: 21,
            file: null,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
        },
        i9 = Symbol("failure");

    function $uq(q) {
        return [...q].length
    }

    function juq(q, K) {
        let _ = q[K];
        return isNaN(_) ? void 0 : String.fromCodePoint(_)
    }

    function Huq(q) {
        return q === "." || q.toLowerCase() === "%2e"
    }

    function G5_(q) {
        return q = q.toLowerCase(), q === ".." || q === "%2e." || q === ".%2e" || q === "%2e%2e"
    }

    function v5_(q, K) {
        return Mf.isASCIIAlpha(q) && (K === kq(":") || K === kq("|"))
    }

    function Puq(q) {
        return q.length === 2 && Mf.isASCIIAlpha(q.codePointAt(0)) && (q[1] === ":" || q[1] === "|")
    }

    function T5_(q) {
        return q.length === 2 && Mf.isASCIIAlpha(q.codePointAt(0)) && q[1] === ":"
    }

    function Wuq(q) {
        return q.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1
    }

    function V5_(q) {
        return Wuq(q) || q.search(/[\u0000-\u001F]|%|\u007F/u) !== -1
    }

    function CT8(q) {
        return Muq[q] !== void 0
    }

    function Xf(q) {
        return CT8(q.scheme)
    }

    function fL1(q) {
        return !CT8(q.scheme)
    }

    function Duq(q) {
        return Muq[q]
    }

    function Zuq(q) {
        if (q === "") return i9;
        let K = 10;
        if (q.length >= 2 && q.charAt(0) === "0" && q.charAt(1).toLowerCase() === "x") q = q.substring(2), K = 16;
        else if (q.length >= 2 && q.charAt(0) === "0") q = q.substring(1), K = 8;
        if (q === "") return 0;
        let _ = /[^0-7]/u;
        if (K === 10) _ = /[^0-9]/u;
        if (K === 16) _ = /[^0-9A-Fa-f]/u;
        if (_.test(q)) return i9;
        return parseInt(q, K)
    }

    function k5_(q) {
        let K = q.split(".");
        if (K[K.length - 1] === "") {
            if (K.length > 1) K.pop()
        }
        if (K.length > 4) return i9;
        let _ = [];
        for (let A of K) {
            let O = Zuq(A);
            if (O === i9) return i9;
            _.push(O)
        }
        for (let A = 0; A < _.length - 1; ++A)
            if (_[A] > 255) return i9;
        if (_[_.length - 1] >= 256 ** (5 - _.length)) return i9;
        let z = _.pop(),
            Y = 0;
        for (let A of _) z += A * 256 ** (3 - Y), ++Y;
        return z
    }

    function N5_(q) {
        let K = "",
            _ = q;
        for (let z = 1; z <= 4; ++z) {
            if (K = String(_ % 256) + K, z !== 4) K = `.${K}`;
            _ = Math.floor(_ / 256)
        }
        return K
    }

    function E5_(q) {
        let K = [0, 0, 0, 0, 0, 0, 0, 0],
            _ = 0,
            z = null,
            Y = 0;
        if (q = Array.from(q, (A) => A.codePointAt(0)), q[Y] === kq(":")) {
            if (q[Y + 1] !== kq(":")) return i9;
            Y += 2, ++_, z = _
        }
        while (Y < q.length) {
            if (_ === 8) return i9;
            if (q[Y] === kq(":")) {
                if (z !== null) return i9;
                ++Y, ++_, z = _;
                continue
            }
            let A = 0,
                O = 0;
            while (O < 4 && Mf.isASCIIHex(q[Y])) A = A * 16 + parseInt(juq(q, Y), 16), ++Y, ++O;
            if (q[Y] === kq(".")) {
                if (O === 0) return i9;
                if (Y -= O, _ > 6) return i9;
                let w = 0;
                while (q[Y] !== void 0) {
                    let $ = null;
                    if (w > 0)
                        if (q[Y] === kq(".") && w < 4) ++Y;
                        else return i9;
                    if (!Mf.isASCIIDigit(q[Y])) return i9;
                    while (Mf.isASCIIDigit(q[Y])) {
                        let j = parseInt(juq(q, Y));
                        if ($ === null) $ = j;
                        else if ($ === 0) return i9;
                        else $ = $ * 10 + j;
                        if ($ > 255) return i9;
                        ++Y
                    }
                    if (K[_] = K[_] * 256 + $, ++w, w === 2 || w === 4) ++_
                }
                if (w !== 4) return i9;
                break
            } else if (q[Y] === kq(":")) {
                if (++Y, q[Y] === void 0) return i9
            } else if (q[Y] !== void 0) return i9;
            K[_] = A, ++_
        }
        if (z !== null) {
            let A = _ - z;
            _ = 7;
            while (_ !== 0 && A > 0) {
                let O = K[z + A - 1];
                K[z + A - 1] = K[_], K[_] = O, --_, --A
            }
        } else if (z === null && _ !== 8) return i9;
        return K
    }

    function y5_(q) {
        let K = "",
            _ = R5_(q),
            z = !1;
        for (let Y = 0; Y <= 7; ++Y) {
            if (z && q[Y] === 0) continue;
            else if (z) z = !1;
            if (_ === Y) {
                K += Y === 0 ? "::" : ":", z = !0;
                continue
            }
            if (K += q[Y].toString(16), Y !== 7) K += ":"
        }
        return K
    }

    function GL1(q, K = !1) {
        if (q[0] === "[") {
            if (q[q.length - 1] !== "]") return i9;
            return E5_(q.substring(1, q.length - 1))
        }
        if (K) return h5_(q);
        let _ = M5_(P5_(q)),
            z = S5_(_);
        if (z === i9) return i9;
        if (L5_(z)) return k5_(z);
        return z
    }

    function L5_(q) {
        let K = q.split(".");
        if (K[K.length - 1] === "") {
            if (K.length === 1) return !1;
            K.pop()
        }
        let _ = K[K.length - 1];
        if (Zuq(_) !== i9) return !0;
        if (/^[0-9]+$/u.test(_)) return !0;
        return !1
    }

    function h5_(q) {
        if (Wuq(q)) return i9;
        return IT8(q, Xuq)
    }

    function R5_(q) {
        let K = null,
            _ = 1,
            z = null,
            Y = 0;
        for (let A = 0; A < q.length; ++A)
            if (q[A] !== 0) {
                if (Y > _) K = z, _ = Y;
                z = null, Y = 0
            } else {
                if (z === null) z = A;
                ++Y
            } if (Y > _) return z;
        return K
    }

    function TL1(q) {
        if (typeof q === "number") return N5_(q);
        if (q instanceof Array) return `[${y5_(q)}]`;
        return q
    }

    function S5_(q, K = !1) {
        let _ = X5_.toASCII(q, {
            checkHyphens: K,
            checkBidi: !0,
            checkJoiners: !0,
            useSTD3ASCIIRules: K,
            transitionalProcessing: !1,
            verifyDNSLength: K,
            ignoreInvalidPunycode: !1
        });
        if (_ === null) return i9;
        if (!K) {
            if (_ === "") return i9;
            if (V5_(_)) return i9
        }
        return _
    }

    function C5_(q) {
        let K = 0,
            _ = q.length;
        for (; K < _; ++K)
            if (q.charCodeAt(K) > 32) break;
        for (; _ > K; --_)
            if (q.charCodeAt(_ - 1) > 32) break;
        return q.substring(K, _)
    }

    function b5_(q) {
        return q.replace(/\u0009|\u000A|\u000D/ug, "")
    }

    function fuq(q) {
        let {
            path: K
        } = q;
        if (K.length === 0) return;
        if (q.scheme === "file" && K.length === 1 && x5_(K[0])) return;
        K.pop()
    }

    function Guq(q) {
        return q.username !== "" || q.password !== ""
    }

    function I5_(q) {
        return q.host === null || q.host === "" || q.scheme === "file"
    }

    function rr6(q) {
        return typeof q.path === "string"
    }

    function x5_(q) {
        return /^[A-Za-z]:$/u.test(q)
    }

    function $X(q, K, _, z, Y) {
        if (this.pointer = 0, this.input = q, this.base = K || null, this.encodingOverride = _ || "utf-8", this.stateOverride = Y, this.url = z, this.failure = !1, this.parseError = !1, !this.url) {
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
            let O = C5_(this.input);
            if (O !== this.input) this.parseError = !0;
            this.input = O
        }
        let A = b5_(this.input);
        if (A !== this.input) this.parseError = !0;
        this.input = A, this.state = Y || "scheme start", this.buffer = "", this.atFlag = !1, this.arrFlag = !1, this.passwordTokenSeenFlag = !1, this.input = Array.from(this.input, (O) => O.codePointAt(0));
        for (; this.pointer <= this.input.length; ++this.pointer) {
            let O = this.input[this.pointer],
                w = isNaN(O) ? void 0 : String.fromCodePoint(O),
                $ = this[`parse ${this.state}`](O, w);
            if (!$) break;
            else if ($ === i9) {
                this.failure = !0;
                break
            }
        }
    }
    $X.prototype["parse scheme start"] = function(K, _) {
        if (Mf.isASCIIAlpha(K)) this.buffer += _.toLowerCase(), this.state = "scheme";
        else if (!this.stateOverride) this.state = "no scheme", --this.pointer;
        else return this.parseError = !0, i9;
        return !0
    };
    $X.prototype["parse scheme"] = function(K, _) {
        if (Mf.isASCIIAlphanumeric(K) || K === kq("+") || K === kq("-") || K === kq(".")) this.buffer += _.toLowerCase();
        else if (K === kq(":")) {
            if (this.stateOverride) {
                if (Xf(this.url) && !CT8(this.buffer)) return !1;
                if (!Xf(this.url) && CT8(this.buffer)) return !1;
                if ((Guq(this.url) || this.url.port !== null) && this.buffer === "file") return !1;
                if (this.url.scheme === "file" && this.url.host === "") return !1
            }
            if (this.url.scheme = this.buffer, this.stateOverride) {
                if (this.url.port === Duq(this.url.scheme)) this.url.port = null;
                return !1
            }
            if (this.buffer = "", this.url.scheme === "file") {
                if (this.input[this.pointer + 1] !== kq("/") || this.input[this.pointer + 2] !== kq("/")) this.parseError = !0;
                this.state = "file"
            } else if (Xf(this.url) && this.base !== null && this.base.scheme === this.url.scheme) this.state = "special relative or authority";
            else if (Xf(this.url)) this.state = "special authority slashes";
            else if (this.input[this.pointer + 1] === kq("/")) this.state = "path or authority", ++this.pointer;
            else this.url.path = "", this.state = "opaque path"
        } else if (!this.stateOverride) this.buffer = "", this.state = "no scheme", this.pointer = -1;
        else return this.parseError = !0, i9;
        return !0
    };
    $X.prototype["parse no scheme"] = function(K) {
        if (this.base === null || rr6(this.base) && K !== kq("#")) return i9;
        else if (rr6(this.base) && K === kq("#")) this.url.scheme = this.base.scheme, this.url.path = this.base.path, this.url.query = this.base.query, this.url.fragment = "", this.state = "fragment";
        else if (this.base.scheme === "file") this.state = "file", --this.pointer;
        else this.state = "relative", --this.pointer;
        return !0
    };
    $X.prototype["parse special relative or authority"] = function(K) {
        if (K === kq("/") && this.input[this.pointer + 1] === kq("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "relative", --this.pointer;
        return !0
    };
    $X.prototype["parse path or authority"] = function(K) {
        if (K === kq("/")) this.state = "authority";
        else this.state = "path", --this.pointer;
        return !0
    };
    $X.prototype["parse relative"] = function(K) {
        if (this.url.scheme = this.base.scheme, K === kq("/")) this.state = "relative slash";
        else if (Xf(this.url) && K === kq("\\")) this.parseError = !0, this.state = "relative slash";
        else if (this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.url.path = this.base.path.slice(), this.url.query = this.base.query, K === kq("?")) this.url.query = "", this.state = "query";
        else if (K === kq("#")) this.url.fragment = "", this.state = "fragment";
        else if (!isNaN(K)) this.url.query = null, this.url.path.pop(), this.state = "path", --this.pointer;
        return !0
    };
    $X.prototype["parse relative slash"] = function(K) {
        if (Xf(this.url) && (K === kq("/") || K === kq("\\"))) {
            if (K === kq("\\")) this.parseError = !0;
            this.state = "special authority ignore slashes"
        } else if (K === kq("/")) this.state = "authority";
        else this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.state = "path", --this.pointer;
        return !0
    };
    $X.prototype["parse special authority slashes"] = function(K) {
        if (K === kq("/") && this.input[this.pointer + 1] === kq("/")) this.state = "special authority ignore slashes", ++this.pointer;
        else this.parseError = !0, this.state = "special authority ignore slashes", --this.pointer;
        return !0
    };
    $X.prototype["parse special authority ignore slashes"] = function(K) {
        if (K !== kq("/") && K !== kq("\\")) this.state = "authority", --this.pointer;
        else this.parseError = !0;
        return !0
    };
    $X.prototype["parse authority"] = function(K, _) {
        if (K === kq("@")) {
            if (this.parseError = !0, this.atFlag) this.buffer = `%40${this.buffer}`;
            this.atFlag = !0;
            let z = $uq(this.buffer);
            for (let Y = 0; Y < z; ++Y) {
                let A = this.buffer.codePointAt(Y);
                if (A === kq(":") && !this.passwordTokenSeenFlag) {
                    this.passwordTokenSeenFlag = !0;
                    continue
                }
                let O = bT8(A, vL1);
                if (this.passwordTokenSeenFlag) this.url.password += O;
                else this.url.username += O
            }
            this.buffer = ""
        } else if (isNaN(K) || K === kq("/") || K === kq("?") || K === kq("#") || Xf(this.url) && K === kq("\\")) {
            if (this.atFlag && this.buffer === "") return this.parseError = !0, i9;
            this.pointer -= $uq(this.buffer) + 1, this.buffer = "", this.state = "host"
        } else this.buffer += _;
        return !0
    };
    $X.prototype["parse hostname"] = $X.prototype["parse host"] = function(K, _) {
        if (this.stateOverride && this.url.scheme === "file") --this.pointer, this.state = "file host";
        else if (K === kq(":") && !this.arrFlag) {
            if (this.buffer === "") return this.parseError = !0, i9;
            if (this.stateOverride === "hostname") return !1;
            let z = GL1(this.buffer, fL1(this.url));
            if (z === i9) return i9;
            this.url.host = z, this.buffer = "", this.state = "port"
        } else if (isNaN(K) || K === kq("/") || K === kq("?") || K === kq("#") || Xf(this.url) && K === kq("\\")) {
            if (--this.pointer, Xf(this.url) && this.buffer === "") return this.parseError = !0, i9;
            else if (this.stateOverride && this.buffer === "" && (Guq(this.url) || this.url.port !== null)) return this.parseError = !0, !1;
            let z = GL1(this.buffer, fL1(this.url));
            if (z === i9) return i9;
            if (this.url.host = z, this.buffer = "", this.state = "path start", this.stateOverride) return !1
        } else {
            if (K === kq("[")) this.arrFlag = !0;
            else if (K === kq("]")) this.arrFlag = !1;
            this.buffer += _
        }
        return !0
    };
    $X.prototype["parse port"] = function(K, _) {
        if (Mf.isASCIIDigit(K)) this.buffer += _;
        else if (isNaN(K) || K === kq("/") || K === kq("?") || K === kq("#") || Xf(this.url) && K === kq("\\") || this.stateOverride) {
            if (this.buffer !== "") {
                let z = parseInt(this.buffer);
                if (z > 65535) return this.parseError = !0, i9;
                this.url.port = z === Duq(this.url.scheme) ? null : z, this.buffer = ""
            }
            if (this.stateOverride) return !1;
            this.state = "path start", --this.pointer
        } else return this.parseError = !0, i9;
        return !0
    };
    var u5_ = new Set([kq("/"), kq("\\"), kq("?"), kq("#")]);

    function vuq(q, K) {
        let _ = q.length - K;
        return _ >= 2 && v5_(q[K], q[K + 1]) && (_ === 2 || u5_.has(q[K + 2]))
    }
    $X.prototype["parse file"] = function(K) {
        if (this.url.scheme = "file", this.url.host = "", K === kq("/") || K === kq("\\")) {
            if (K === kq("\\")) this.parseError = !0;
            this.state = "file slash"
        } else if (this.base !== null && this.base.scheme === "file") {
            if (this.url.host = this.base.host, this.url.path = this.base.path.slice(), this.url.query = this.base.query, K === kq("?")) this.url.query = "", this.state = "query";
            else if (K === kq("#")) this.url.fragment = "", this.state = "fragment";
            else if (!isNaN(K)) {
                if (this.url.query = null, !vuq(this.input, this.pointer)) fuq(this.url);
                else this.parseError = !0, this.url.path = [];
                this.state = "path", --this.pointer
            }
        } else this.state = "path", --this.pointer;
        return !0
    };
    $X.prototype["parse file slash"] = function(K) {
        if (K === kq("/") || K === kq("\\")) {
            if (K === kq("\\")) this.parseError = !0;
            this.state = "file host"
        } else {
            if (this.base !== null && this.base.scheme === "file") {
                if (!vuq(this.input, this.pointer) && T5_(this.base.path[0])) this.url.path.push(this.base.path[0]);
                this.url.host = this.base.host
            }
            this.state = "path", --this.pointer
        }
        return !0
    };
    $X.prototype["parse file host"] = function(K, _) {
        if (isNaN(K) || K === kq("/") || K === kq("\\") || K === kq("?") || K === kq("#"))
            if (--this.pointer, !this.stateOverride && Puq(this.buffer)) this.parseError = !0, this.state = "path";
            else if (this.buffer === "") {
            if (this.url.host = "", this.stateOverride) return !1;
            this.state = "path start"
        } else {
            let z = GL1(this.buffer, fL1(this.url));
            if (z === i9) return i9;
            if (z === "localhost") z = "";
            if (this.url.host = z, this.stateOverride) return !1;
            this.buffer = "", this.state = "path start"
        } else this.buffer += _;
        return !0
    };
    $X.prototype["parse path start"] = function(K) {
        if (Xf(this.url)) {
            if (K === kq("\\")) this.parseError = !0;
            if (this.state = "path", K !== kq("/") && K !== kq("\\")) --this.pointer
        } else if (!this.stateOverride && K === kq("?")) this.url.query = "", this.state = "query";
        else if (!this.stateOverride && K === kq("#")) this.url.fragment = "", this.state = "fragment";
        else if (K !== void 0) {
            if (this.state = "path", K !== kq("/")) --this.pointer
        } else if (this.stateOverride && this.url.host === null) this.url.path.push("");
        return !0
    };
    $X.prototype["parse path"] = function(K) {
        if (isNaN(K) || K === kq("/") || Xf(this.url) && K === kq("\\") || !this.stateOverride && (K === kq("?") || K === kq("#"))) {
            if (Xf(this.url) && K === kq("\\")) this.parseError = !0;
            if (G5_(this.buffer)) {
                if (fuq(this.url), K !== kq("/") && !(Xf(this.url) && K === kq("\\"))) this.url.path.push("")
            } else if (Huq(this.buffer) && K !== kq("/") && !(Xf(this.url) && K === kq("\\"))) this.url.path.push("");
            else if (!Huq(this.buffer)) {
                if (this.url.scheme === "file" && this.url.path.length === 0 && Puq(this.buffer)) this.buffer = `${this.buffer[0]}:`;
                this.url.path.push(this.buffer)
            }
            if (this.buffer = "", K === kq("?")) this.url.query = "", this.state = "query";
            if (K === kq("#")) this.url.fragment = "", this.state = "fragment"
        } else {
            if (K === kq("%") && (!Mf.isASCIIHex(this.input[this.pointer + 1]) || !Mf.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += bT8(K, f5_)
        }
        return !0
    };
    $X.prototype["parse opaque path"] = function(K) {
        if (K === kq("?")) this.url.query = "", this.state = "query";
        else if (K === kq("#")) this.url.fragment = "", this.state = "fragment";
        else if (K === kq(" ")) {
            let _ = this.input[this.pointer + 1];
            if (_ === kq("?") || _ === kq("#")) this.url.path += "%20";
            else this.url.path += " "
        } else {
            if (!isNaN(K) && K !== kq("%")) this.parseError = !0;
            if (K === kq("%") && (!Mf.isASCIIHex(this.input[this.pointer + 1]) || !Mf.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            if (!isNaN(K)) this.url.path += bT8(K, Xuq)
        }
        return !0
    };
    $X.prototype["parse query"] = function(K, _) {
        if (!Xf(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") this.encodingOverride = "utf-8";
        if (!this.stateOverride && K === kq("#") || isNaN(K)) {
            let z = Xf(this.url) ? Z5_ : D5_;
            if (this.url.query += IT8(this.buffer, z), this.buffer = "", K === kq("#")) this.url.fragment = "", this.state = "fragment"
        } else if (!isNaN(K)) {
            if (K === kq("%") && (!Mf.isASCIIHex(this.input[this.pointer + 1]) || !Mf.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.buffer += _
        }
        return !0
    };
    $X.prototype["parse fragment"] = function(K) {
        if (!isNaN(K)) {
            if (K === kq("%") && (!Mf.isASCIIHex(this.input[this.pointer + 1]) || !Mf.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
            this.url.fragment += bT8(K, W5_)
        }
        return !0
    };

    function m5_(q, K) {
        let _ = `${q.scheme}:`;
        if (q.host !== null) {
            if (_ += "//", q.username !== "" || q.password !== "") {
                if (_ += q.username, q.password !== "") _ += `:${q.password}`;
                _ += "@"
            }
            if (_ += TL1(q.host), q.port !== null) _ += `:${q.port}`
        }
        if (q.host === null && !rr6(q) && q.path.length > 1 && q.path[0] === "") _ += "/.";
        if (_ += VL1(q), q.query !== null) _ += `?${q.query}`;
        if (!K && q.fragment !== null) _ += `#${q.fragment}`;
        return _
    }

    function B5_(q) {
        let K = `${q.scheme}://`;
        if (K += TL1(q.host), q.port !== null) K += `:${q.port}`;
        return K
    }

    function VL1(q) {
        if (rr6(q)) return q.path;
        let K = "";
        for (let _ of q.path) K += `/${_}`;
        return K
    }
    p5_.serializeURL = m5_;
    p5_.serializePath = VL1;
    p5_.serializeURLOrigin = function(q) {
        switch (q.scheme) {
            case "blob": {
                let K = p5_.parseURL(VL1(q));
                if (K === null) return "null";
                if (K.scheme !== "http" && K.scheme !== "https") return "null";
                return p5_.serializeURLOrigin(K)
            }
            case "ftp":
            case "http":
            case "https":
            case "ws":
            case "wss":
                return B5_({
                    scheme: q.scheme,
                    host: q.host,
                    port: q.port
                });
            case "file":
                return "null";
            default:
                return "null"
        }
    };
    p5_.basicURLParse = function(q, K) {
        if (K === void 0) K = {};
        let _ = new $X(q, K.baseURL, K.encodingOverride, K.url, K.stateOverride);
        if (_.failure) return null;
        return _.url
    };
    p5_.setTheUsername = function(q, K) {
        q.username = IT8(K, vL1)
    };
    p5_.setThePassword = function(q, K) {
        q.password = IT8(K, vL1)
    };
    p5_.serializeHost = TL1;
    p5_.cannotHaveAUsernamePasswordPort = I5_;
    p5_.hasAnOpaquePath = rr6;
    p5_.serializeInteger = function(q) {
        return String(q)
    };
    p5_.parseURL = function(q, K) {
        if (K === void 0) K = {};
        return p5_.basicURLParse(q, {
            baseURL: K.baseURL,
            encodingOverride: K.encodingOverride
        })
    }
})
// @from(Ln 147046, Col 4)
NL1 = p((VFO, huq) => {
    var {
        utf8Encode: r5_,
        utf8DecodeWithoutBOM: Vuq
    } = RT8(), {
        percentDecodeBytes: kuq,
        utf8PercentEncodeString: Nuq,
        isURLEncodedPercentEncode: Euq
    } = ST8();

    function yuq(q) {
        return q.codePointAt(0)
    }

    function o5_(q) {
        let K = t5_(q, yuq("&")),
            _ = [];
        for (let z of K) {
            if (z.length === 0) continue;
            let Y, A, O = z.indexOf(yuq("="));
            if (O >= 0) Y = z.slice(0, O), A = z.slice(O + 1);
            else Y = z, A = new Uint8Array(0);
            Y = Luq(Y, 43, 32), A = Luq(A, 43, 32);
            let w = Vuq(kuq(Y)),
                $ = Vuq(kuq(A));
            _.push([w, $])
        }
        return _
    }

    function a5_(q) {
        return o5_(r5_(q))
    }

    function s5_(q) {
        let K = "";
        for (let [_, z] of q.entries()) {
            let Y = Nuq(z[0], Euq, !0),
                A = Nuq(z[1], Euq, !0);
            if (_ !== 0) K += "&";
            K += `${Y}=${A}`
        }
        return K
    }

    function t5_(q, K) {
        let _ = [],
            z = 0,
            Y = q.indexOf(K);
        while (Y >= 0) _.push(q.slice(z, Y)), z = Y + 1, Y = q.indexOf(K, z);
        if (z !== q.length) _.push(q.slice(z));
        return _
    }

    function Luq(q, K, _) {
        let z = q.indexOf(K);
        while (z >= 0) q[z] = _, z = q.indexOf(K, z + 1);
        return q
    }
    huq.exports = {
        parseUrlencodedString: a5_,
        serializeUrlencoded: s5_
    }
})
// @from(Ln 147110, Col 4)
Suq = p((e5_) => {
    var Ruq = yT8(),
        xT8 = hT8();
    e5_.convert = (q, K, {
        context: _ = "The provided value"
    } = {}) => {
        if (typeof K !== "function") throw new q.TypeError(_ + " is not a function");

        function z(...Y) {
            let A = xT8.tryWrapperForImpl(this),
                O;
            for (let w = 0; w < Y.length; w++) Y[w] = xT8.tryWrapperForImpl(Y[w]);
            return O = Reflect.apply(K, A, Y), O = Ruq.any(O, {
                context: _,
                globals: q
            }), O
        }
        return z.construct = (...Y) => {
            for (let O = 0; O < Y.length; O++) Y[O] = xT8.tryWrapperForImpl(Y[O]);
            let A = Reflect.construct(K, Y);
            return A = Ruq.any(A, {
                context: _,
                globals: q
            }), A
        }, z[xT8.wrapperSymbol] = K, z.objectReference = K, z
    }
})
// @from(Ln 147137, Col 4)
Cuq = p((K3_) => {
    var EL1 = NL1();
    K3_.implementation = class {
        constructor(K, _, {
            doNotStripQMark: z = !1
        }) {
            let Y = _[0];
            if (this._list = [], this._url = null, !z && typeof Y === "string" && Y[0] === "?") Y = Y.slice(1);
            if (Array.isArray(Y))
                for (let A of Y) {
                    if (A.length !== 2) throw TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
                    this._list.push([A[0], A[1]])
                } else if (typeof Y === "object" && Object.getPrototypeOf(Y) === null)
                    for (let A of Object.keys(Y)) {
                        let O = Y[A];
                        this._list.push([A, O])
                    } else this._list = EL1.parseUrlencodedString(Y)
        }
        _updateSteps() {
            if (this._url !== null) {
                let K = EL1.serializeUrlencoded(this._list);
                if (K === "") K = null;
                this._url._url.query = K
            }
        }
        get size() {
            return this._list.length
        }
        append(K, _) {
            this._list.push([K, _]), this._updateSteps()
        }
        delete(K, _) {
            let z = 0;
            while (z < this._list.length)
                if (this._list[z][0] === K && (_ === void 0 || this._list[z][1] === _)) this._list.splice(z, 1);
                else z++;
            this._updateSteps()
        }
        get(K) {
            for (let _ of this._list)
                if (_[0] === K) return _[1];
            return null
        }
        getAll(K) {
            let _ = [];
            for (let z of this._list)
                if (z[0] === K) _.push(z[1]);
            return _
        }
        has(K, _) {
            for (let z of this._list)
                if (z[0] === K && (_ === void 0 || z[1] === _)) return !0;
            return !1
        }
        set(K, _) {
            let z = !1,
                Y = 0;
            while (Y < this._list.length)
                if (this._list[Y][0] === K)
                    if (z) this._list.splice(Y, 1);
                    else z = !0, this._list[Y][1] = _, Y++;
            else Y++;
            if (!z) this._list.push([K, _]);
            this._updateSteps()
        }
        sort() {
            this._list.sort((K, _) => {
                if (K[0] < _[0]) return -1;
                if (K[0] > _[0]) return 1;
                return 0
            }), this._updateSteps()
        } [Symbol.iterator]() {
            return this._list[Symbol.iterator]()
        }
        toString() {
            return EL1.serializeUrlencoded(this._list)
        }
    }
})
// @from(Ln 147216, Col 4)
LL1 = p((A3_) => {
    var FE = yT8(),
        I2 = hT8(),
        z3_ = Suq(),
        buq = I2.newObjectInRealm,
        jM = I2.implSymbol,
        Iuq = I2.ctorRegistrySymbol;
    A3_.is = (q) => {
        return I2.isObject(q) && I2.hasOwn(q, jM) && q[jM] instanceof Qq6.implementation
    };
    A3_.isImpl = (q) => {
        return I2.isObject(q) && q instanceof Qq6.implementation
    };
    A3_.convert = (q, K, {
        context: _ = "The provided value"
    } = {}) => {
        if (A3_.is(K)) return I2.implForWrapper(K);
        throw new q.TypeError(`${_} is not of type 'URLSearchParams'.`)
    };
    A3_.createDefaultIterator = (q, K, _) => {
        let Y = q[Iuq]["URLSearchParams Iterator"],
            A = Object.create(Y);
        return Object.defineProperty(A, I2.iterInternalSymbol, {
            value: {
                target: K,
                kind: _,
                index: 0
            },
            configurable: !0
        }), A
    };

    function xuq(q, K) {
        let _;
        if (K !== void 0) _ = K.prototype;
        if (!I2.isObject(_)) _ = q[Iuq].URLSearchParams.prototype;
        return Object.create(_)
    }
    A3_.create = (q, K, _) => {
        let z = xuq(q);
        return A3_.setup(z, q, K, _)
    };
    A3_.createImpl = (q, K, _) => {
        let z = A3_.create(q, K, _);
        return I2.implForWrapper(z)
    };
    A3_._internalSetup = (q, K) => {};
    A3_.setup = (q, K, _ = [], z = {}) => {
        if (z.wrapper = q, A3_._internalSetup(q, K), Object.defineProperty(q, jM, {
                value: new Qq6.implementation(K, _, z),
                configurable: !0
            }), q[jM][I2.wrapperSymbol] = q, Qq6.init) Qq6.init(q[jM]);
        return q
    };
    A3_.new = (q, K) => {
        let _ = xuq(q, K);
        if (A3_._internalSetup(_, q), Object.defineProperty(_, jM, {
                value: Object.create(Qq6.implementation.prototype),
                configurable: !0
            }), _[jM][I2.wrapperSymbol] = _, Qq6.init) Qq6.init(_[jM]);
        return _[jM]
    };
    var Y3_ = new Set(["Window", "Worker"]);
    A3_.install = (q, K) => {
        if (!K.some((Y) => Y3_.has(Y))) return;
        let _ = I2.initCtorRegistry(q);
        class z {
            constructor() {
                let Y = [];
                {
                    let A = arguments[0];
                    if (A !== void 0)
                        if (I2.isObject(A))
                            if (A[Symbol.iterator] !== void 0)
                                if (!I2.isObject(A)) throw new q.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
                                else {
                                    let O = [],
                                        w = A;
                                    for (let $ of w) {
                                        if (!I2.isObject($)) throw new q.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                                        else {
                                            let j = [],
                                                H = $;
                                            for (let J of H) J = FE.USVString(J, {
                                                context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                                                globals: q
                                            }), j.push(J);
                                            $ = j
                                        }
                                        O.push($)
                                    }
                                    A = O
                                }
                    else if (!I2.isObject(A)) throw new q.TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
                    else {
                        let O = Object.create(null);
                        for (let w of Reflect.ownKeys(A)) {
                            let $ = Object.getOwnPropertyDescriptor(A, w);
                            if ($ && $.enumerable) {
                                let j = w;
                                j = FE.USVString(j, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                                    globals: q
                                });
                                let H = A[w];
                                H = FE.USVString(H, {
                                    context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                                    globals: q
                                }), O[j] = H
                            }
                        }
                        A = O
                    } else A = FE.USVString(A, {
                        context: "Failed to construct 'URLSearchParams': parameter 1",
                        globals: q
                    });
                    else A = "";
                    Y.push(A)
                }
                return A3_.setup(Object.create(new.target.prototype), q, Y)
            }
            append(Y, A) {
                let O = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(O)) throw new q.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new q.TypeError(`Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let $ = arguments[0];
                    $ = FE.USVString($, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), w.push($)
                } {
                    let $ = arguments[1];
                    $ = FE.USVString($, {
                        context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
                        globals: q
                    }), w.push($)
                }
                return I2.tryWrapperForImpl(O[jM].append(...w))
            }
            delete(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(A)) throw new q.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let w = arguments[0];
                    w = FE.USVString(w, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), O.push(w)
                } {
                    let w = arguments[1];
                    if (w !== void 0) w = FE.USVString(w, {
                        context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
                        globals: q
                    });
                    O.push(w)
                }
                return I2.tryWrapperForImpl(A[jM].delete(...O))
            }
            get(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(A)) throw new q.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let w = arguments[0];
                    w = FE.USVString(w, {
                        context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), O.push(w)
                }
                return A[jM].get(...O)
            }
            getAll(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(A)) throw new q.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let w = arguments[0];
                    w = FE.USVString(w, {
                        context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), O.push(w)
                }
                return I2.tryWrapperForImpl(A[jM].getAll(...O))
            }
            has(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(A)) throw new q.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
                let O = [];
                {
                    let w = arguments[0];
                    w = FE.USVString(w, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), O.push(w)
                } {
                    let w = arguments[1];
                    if (w !== void 0) w = FE.USVString(w, {
                        context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
                        globals: q
                    });
                    O.push(w)
                }
                return A[jM].has(...O)
            }
            set(Y, A) {
                let O = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(O)) throw new q.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 2) throw new q.TypeError(`Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
                let w = [];
                {
                    let $ = arguments[0];
                    $ = FE.USVString($, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
                        globals: q
                    }), w.push($)
                } {
                    let $ = arguments[1];
                    $ = FE.USVString($, {
                        context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
                        globals: q
                    }), w.push($)
                }
                return I2.tryWrapperForImpl(O[jM].set(...w))
            }
            sort() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(Y)) throw new q.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
                return I2.tryWrapperForImpl(Y[jM].sort())
            }
            toString() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(Y)) throw new q.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
                return Y[jM].toString()
            }
            keys() {
                if (!A3_.is(this)) throw new q.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
                return A3_.createDefaultIterator(q, this, "key")
            }
            values() {
                if (!A3_.is(this)) throw new q.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
                return A3_.createDefaultIterator(q, this, "value")
            }
            entries() {
                if (!A3_.is(this)) throw new q.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
                return A3_.createDefaultIterator(q, this, "key+value")
            }
            forEach(Y) {
                if (!A3_.is(this)) throw new q.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
                if (arguments.length < 1) throw new q.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
                Y = z3_.convert(q, Y, {
                    context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
                });
                let A = arguments[1],
                    O = Array.from(this[jM]),
                    w = 0;
                while (w < O.length) {
                    let [$, j] = O[w].map(I2.tryWrapperForImpl);
                    Y.call(A, j, $, this), O = Array.from(this[jM]), w++
                }
            }
            get size() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!A3_.is(Y)) throw new q.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
                return Y[jM].size
            }
        }
        Object.defineProperties(z.prototype, {
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
                value: z.prototype.entries,
                configurable: !0,
                writable: !0
            }
        }), _.URLSearchParams = z, _["URLSearchParams Iterator"] = Object.create(_["%IteratorPrototype%"], {
            [Symbol.toStringTag]: {
                configurable: !0,
                value: "URLSearchParams Iterator"
            }
        }), I2.define(_["URLSearchParams Iterator"], {
            next() {
                let Y = this && this[I2.iterInternalSymbol];
                if (!Y) throw new q.TypeError("next() called on a value that is not a URLSearchParams iterator object");
                let {
                    target: A,
                    kind: O,
                    index: w
                } = Y, $ = Array.from(A[jM]), j = $.length;
                if (w >= j) return buq(q, {
                    value: void 0,
                    done: !0
                });
                let H = $[w];
                return Y.index = w + 1, buq(q, I2.iteratorResult(H.map(I2.tryWrapperForImpl), O))
            }
        }), Object.defineProperty(q, "URLSearchParams", {
            configurable: !0,
            writable: !0,
            value: z
        })
    };
    var Qq6 = Cuq()
})
// @from(Ln 147567, Col 4)
puq = p((X3_) => {
    var tw = kL1(),
        Buq = NL1(),
        J3_ = LL1();
    X3_.implementation = class q {
        constructor(K, [_, z]) {
            let Y = null;
            if (z !== void 0) {
                if (Y = tw.basicURLParse(z), Y === null) throw TypeError(`Invalid base URL: ${z}`)
            }
            let A = tw.basicURLParse(_, {
                baseURL: Y
            });
            if (A === null) throw TypeError(`Invalid URL: ${_}`);
            let O = A.query !== null ? A.query : "";
            this._url = A, this._query = J3_.createImpl(K, [O], {
                doNotStripQMark: !0
            }), this._query._url = this
        }
        static parse(K, _, z) {
            try {
                return new q(K, [_, z])
            } catch {
                return null
            }
        }
        static canParse(K, _) {
            let z = null;
            if (_ !== void 0) {
                if (z = tw.basicURLParse(_), z === null) return !1
            }
            if (tw.basicURLParse(K, {
                    baseURL: z
                }) === null) return !1;
            return !0
        }
        get href() {
            return tw.serializeURL(this._url)
        }
        set href(K) {
            let _ = tw.basicURLParse(K);
            if (_ === null) throw TypeError(`Invalid URL: ${K}`);
            this._url = _, this._query._list.splice(0);
            let {
                query: z
            } = _;
            if (z !== null) this._query._list = Buq.parseUrlencodedString(z)
        }
        get origin() {
            return tw.serializeURLOrigin(this._url)
        }
        get protocol() {
            return `${this._url.scheme}:`
        }
        set protocol(K) {
            tw.basicURLParse(`${K}:`, {
                url: this._url,
                stateOverride: "scheme start"
            })
        }
        get username() {
            return this._url.username
        }
        set username(K) {
            if (tw.cannotHaveAUsernamePasswordPort(this._url)) return;
            tw.setTheUsername(this._url, K)
        }
        get password() {
            return this._url.password
        }
        set password(K) {
            if (tw.cannotHaveAUsernamePasswordPort(this._url)) return;
            tw.setThePassword(this._url, K)
        }
        get host() {
            let K = this._url;
            if (K.host === null) return "";
            if (K.port === null) return tw.serializeHost(K.host);
            return `${tw.serializeHost(K.host)}:${tw.serializeInteger(K.port)}`
        }
        set host(K) {
            if (tw.hasAnOpaquePath(this._url)) return;
            tw.basicURLParse(K, {
                url: this._url,
                stateOverride: "host"
            })
        }
        get hostname() {
            if (this._url.host === null) return "";
            return tw.serializeHost(this._url.host)
        }
        set hostname(K) {
            if (tw.hasAnOpaquePath(this._url)) return;
            tw.basicURLParse(K, {
                url: this._url,
                stateOverride: "hostname"
            })
        }
        get port() {
            if (this._url.port === null) return "";
            return tw.serializeInteger(this._url.port)
        }
        set port(K) {
            if (tw.cannotHaveAUsernamePasswordPort(this._url)) return;
            if (K === "") this._url.port = null;
            else tw.basicURLParse(K, {
                url: this._url,
                stateOverride: "port"
            })
        }
        get pathname() {
            return tw.serializePath(this._url)
        }
        set pathname(K) {
            if (tw.hasAnOpaquePath(this._url)) return;
            this._url.path = [], tw.basicURLParse(K, {
                url: this._url,
                stateOverride: "path start"
            })
        }
        get search() {
            if (this._url.query === null || this._url.query === "") return "";
            return `?${this._url.query}`
        }
        set search(K) {
            let _ = this._url;
            if (K === "") {
                _.query = null, this._query._list = [];
                return
            }
            let z = K[0] === "?" ? K.substring(1) : K;
            _.query = "", tw.basicURLParse(z, {
                url: _,
                stateOverride: "query"
            }), this._query._list = Buq.parseUrlencodedString(z)
        }
        get searchParams() {
            return this._query
        }
        get hash() {
            if (this._url.fragment === null || this._url.fragment === "") return "";
            return `#${this._url.fragment}`
        }
        set hash(K) {
            if (K === "") {
                this._url.fragment = null;
                return
            }
            let _ = K[0] === "#" ? K.substring(1) : K;
            this._url.fragment = "", tw.basicURLParse(_, {
                url: this._url,
                stateOverride: "fragment"
            })
        }
        toJSON() {
            return this.href
        }
    }
})
// @from(Ln 147726, Col 4)
Quq = p((D3_) => {
    var mv = yT8(),
        gE = hT8(),
        NA = gE.implSymbol,
        P3_ = gE.ctorRegistrySymbol;
    D3_.is = (q) => {
        return gE.isObject(q) && gE.hasOwn(q, NA) && q[NA] instanceof nQ.implementation
    };
    D3_.isImpl = (q) => {
        return gE.isObject(q) && q instanceof nQ.implementation
    };
    D3_.convert = (q, K, {
        context: _ = "The provided value"
    } = {}) => {
        if (D3_.is(K)) return gE.implForWrapper(K);
        throw new q.TypeError(`${_} is not of type 'URL'.`)
    };

    function Fuq(q, K) {
        let _;
        if (K !== void 0) _ = K.prototype;
        if (!gE.isObject(_)) _ = q[P3_].URL.prototype;
        return Object.create(_)
    }
    D3_.create = (q, K, _) => {
        let z = Fuq(q);
        return D3_.setup(z, q, K, _)
    };
    D3_.createImpl = (q, K, _) => {
        let z = D3_.create(q, K, _);
        return gE.implForWrapper(z)
    };
    D3_._internalSetup = (q, K) => {};
    D3_.setup = (q, K, _ = [], z = {}) => {
        if (z.wrapper = q, D3_._internalSetup(q, K), Object.defineProperty(q, NA, {
                value: new nQ.implementation(K, _, z),
                configurable: !0
            }), q[NA][gE.wrapperSymbol] = q, nQ.init) nQ.init(q[NA]);
        return q
    };
    D3_.new = (q, K) => {
        let _ = Fuq(q, K);
        if (D3_._internalSetup(_, q), Object.defineProperty(_, NA, {
                value: Object.create(nQ.implementation.prototype),
                configurable: !0
            }), _[NA][gE.wrapperSymbol] = _, nQ.init) nQ.init(_[NA]);
        return _[NA]
    };
    var W3_ = new Set(["Window", "Worker"]);
    D3_.install = (q, K) => {
        if (!K.some((Y) => W3_.has(Y))) return;
        let _ = gE.initCtorRegistry(q);
        class z {
            constructor(Y) {
                if (arguments.length < 1) throw new q.TypeError(`Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`);
                let A = [];
                {
                    let O = arguments[0];
                    O = mv.USVString(O, {
                        context: "Failed to construct 'URL': parameter 1",
                        globals: q
                    }), A.push(O)
                } {
                    let O = arguments[1];
                    if (O !== void 0) O = mv.USVString(O, {
                        context: "Failed to construct 'URL': parameter 2",
                        globals: q
                    });
                    A.push(O)
                }
                return D3_.setup(Object.create(new.target.prototype), q, A)
            }
            toJSON() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
                return Y[NA].toJSON()
            }
            get href() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get href' called on an object that is not a valid instance of URL.");
                return Y[NA].href
            }
            set href(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set href' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'href' property on 'URL': The provided value",
                    globals: q
                }), A[NA].href = Y
            }
            toString() {
                let Y = this;
                if (!D3_.is(Y)) throw new q.TypeError("'toString' called on an object that is not a valid instance of URL.");
                return Y[NA].href
            }
            get origin() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get origin' called on an object that is not a valid instance of URL.");
                return Y[NA].origin
            }
            get protocol() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
                return Y[NA].protocol
            }
            set protocol(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'protocol' property on 'URL': The provided value",
                    globals: q
                }), A[NA].protocol = Y
            }
            get username() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get username' called on an object that is not a valid instance of URL.");
                return Y[NA].username
            }
            set username(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set username' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'username' property on 'URL': The provided value",
                    globals: q
                }), A[NA].username = Y
            }
            get password() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get password' called on an object that is not a valid instance of URL.");
                return Y[NA].password
            }
            set password(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set password' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'password' property on 'URL': The provided value",
                    globals: q
                }), A[NA].password = Y
            }
            get host() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get host' called on an object that is not a valid instance of URL.");
                return Y[NA].host
            }
            set host(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set host' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'host' property on 'URL': The provided value",
                    globals: q
                }), A[NA].host = Y
            }
            get hostname() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
                return Y[NA].hostname
            }
            set hostname(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'hostname' property on 'URL': The provided value",
                    globals: q
                }), A[NA].hostname = Y
            }
            get port() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get port' called on an object that is not a valid instance of URL.");
                return Y[NA].port
            }
            set port(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set port' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'port' property on 'URL': The provided value",
                    globals: q
                }), A[NA].port = Y
            }
            get pathname() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
                return Y[NA].pathname
            }
            set pathname(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'pathname' property on 'URL': The provided value",
                    globals: q
                }), A[NA].pathname = Y
            }
            get search() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get search' called on an object that is not a valid instance of URL.");
                return Y[NA].search
            }
            set search(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set search' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'search' property on 'URL': The provided value",
                    globals: q
                }), A[NA].search = Y
            }
            get searchParams() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
                return gE.getSameObject(this, "searchParams", () => {
                    return gE.tryWrapperForImpl(Y[NA].searchParams)
                })
            }
            get hash() {
                let Y = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(Y)) throw new q.TypeError("'get hash' called on an object that is not a valid instance of URL.");
                return Y[NA].hash
            }
            set hash(Y) {
                let A = this !== null && this !== void 0 ? this : q;
                if (!D3_.is(A)) throw new q.TypeError("'set hash' called on an object that is not a valid instance of URL.");
                Y = mv.USVString(Y, {
                    context: "Failed to set the 'hash' property on 'URL': The provided value",
                    globals: q
                }), A[NA].hash = Y
            }
            static parse(Y) {
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'parse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let A = [];
                {
                    let O = arguments[0];
                    O = mv.USVString(O, {
                        context: "Failed to execute 'parse' on 'URL': parameter 1",
                        globals: q
                    }), A.push(O)
                } {
                    let O = arguments[1];
                    if (O !== void 0) O = mv.USVString(O, {
                        context: "Failed to execute 'parse' on 'URL': parameter 2",
                        globals: q
                    });
                    A.push(O)
                }
                return gE.tryWrapperForImpl(nQ.implementation.parse(q, ...A))
            }
            static canParse(Y) {
                if (arguments.length < 1) throw new q.TypeError(`Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
                let A = [];
                {
                    let O = arguments[0];
                    O = mv.USVString(O, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 1",
                        globals: q
                    }), A.push(O)
                } {
                    let O = arguments[1];
                    if (O !== void 0) O = mv.USVString(O, {
                        context: "Failed to execute 'canParse' on 'URL': parameter 2",
                        globals: q
                    });
                    A.push(O)
                }
                return nQ.implementation.canParse(...A)
            }
        }
        if (Object.defineProperties(z.prototype, {
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
            }), Object.defineProperties(z, {
                parse: {
                    enumerable: !0
                },
                canParse: {
                    enumerable: !0
                }
            }), _.URL = z, Object.defineProperty(q, "URL", {
                configurable: !0,
                writable: !0,
                value: z
            }), K.includes("Window")) Object.defineProperty(q, "webkitURL", {
            configurable: !0,
            writable: !0,
            value: z
        })
    };
    var nQ = puq()
})
// @from(Ln 148055, Col 4)
duq = p((N3_) => {
    var V3_ = Quq(),
        k3_ = LL1();
    N3_.URL = V3_;
    N3_.URLSearchParams = k3_
})
// @from(Ln 148061, Col 4)
luq = p((R3_) => {
    var {
        URL: L3_,
        URLSearchParams: h3_
    } = duq(), NB = kL1(), cuq = ST8(), mT8 = {
        Array,
        Object,
        Promise,
        String,
        TypeError
    };
    L3_.install(mT8, ["Window"]);
    h3_.install(mT8, ["Window"]);
    R3_.URL = mT8.URL;
    R3_.URLSearchParams = mT8.URLSearchParams;
    R3_.parseURL = NB.parseURL;
    R3_.basicURLParse = NB.basicURLParse;
    R3_.serializeURL = NB.serializeURL;
    R3_.serializePath = NB.serializePath;
    R3_.serializeHost = NB.serializeHost;
    R3_.serializeInteger = NB.serializeInteger;
    R3_.serializeURLOrigin = NB.serializeURLOrigin;
    R3_.setTheUsername = NB.setTheUsername;
    R3_.setThePassword = NB.setThePassword;
    R3_.cannotHaveAUsernamePasswordPort = NB.cannotHaveAUsernamePasswordPort;
    R3_.hasAnOpaquePath = NB.hasAnOpaquePath;
    R3_.percentDecodeString = cuq.percentDecodeString;
    R3_.percentDecodeBytes = cuq.percentDecodeBytes
})