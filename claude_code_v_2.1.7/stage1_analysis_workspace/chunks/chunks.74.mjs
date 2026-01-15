
// @from(Ln 215158, Col 4)
CvB = U((jR8, $vB) => {
  jR8.STATUS_MAPPING = {
    mapped: 1,
    valid: 2,
    disallowed: 3,
    deviation: 6,
    ignored: 7
  }
})
// @from(Ln 215167, Col 4)
LvB = U((OcG, wvB) => {
  var B40 = FvB(),
    W_ = EvB(),
    UvB = zvB(),
    {
      STATUS_MAPPING: Zo
    } = CvB();

  function Q40(A) {
    return /[^\x00-\x7F]/u.test(A)
  }

  function qvB(A) {
    let Q = 0,
      B = UvB.length - 1;
    while (Q <= B) {
      let G = Math.floor((Q + B) / 2),
        Z = UvB[G],
        Y = Array.isArray(Z[0]) ? Z[0][0] : Z[0],
        J = Array.isArray(Z[0]) ? Z[0][1] : Z[0];
      if (Y <= A && J >= A) return Z.slice(1);
      else if (Y > A) B = G - 1;
      else Q = G + 1
    }
    return null
  }

  function PR8(A, {
    transitionalProcessing: Q
  }) {
    let B = "";
    for (let G of A) {
      let [Z, Y] = qvB(G.codePointAt(0));
      switch (Z) {
        case Zo.disallowed:
          B += G;
          break;
        case Zo.ignored:
          break;
        case Zo.mapped:
          if (Q && G === "ẞ") B += "ss";
          else B += Y;
          break;
        case Zo.deviation:
          if (Q) B += Y;
          else B += G;
          break;
        case Zo.valid:
          B += G;
          break
      }
    }
    return B
  }

  function SR8(A, {
    checkHyphens: Q,
    checkBidi: B,
    checkJoiners: G,
    transitionalProcessing: Z,
    useSTD3ASCIIRules: Y,
    isBidi: J
  }) {
    if (A.length === 0) return !0;
    if (A.normalize("NFC") !== A) return !1;
    let X = Array.from(A);
    if (Q) {
      if (X[2] === "-" && X[3] === "-" || (A.startsWith("-") || A.endsWith("-"))) return !1
    }
    if (!Q) {
      if (A.startsWith("xn--")) return !1
    }
    if (A.includes(".")) return !1;
    if (W_.combiningMarks.test(X[0])) return !1;
    for (let I of X) {
      let D = I.codePointAt(0),
        [W] = qvB(D);
      if (Z) {
        if (W !== Zo.valid) return !1
      } else if (W !== Zo.valid && W !== Zo.deviation) return !1;
      if (Y && D <= 127) {
        if (!/^(?:[a-z]|[0-9]|-)$/u.test(I)) return !1
      }
    }
    if (G) {
      let I = 0;
      for (let [D, W] of X.entries())
        if (W === "‌" || W === "‍") {
          if (D > 0) {
            if (W_.combiningClassVirama.test(X[D - 1])) continue;
            if (W === "‌") {
              let K = X.indexOf("‌", D + 1),
                V = K < 0 ? X.slice(I) : X.slice(I, K);
              if (W_.validZWNJ.test(V.join(""))) {
                I = D + 1;
                continue
              }
            }
          }
          return !1
        }
    }
    if (B && J) {
      let I;
      if (W_.bidiS1LTR.test(X[0])) I = !1;
      else if (W_.bidiS1RTL.test(X[0])) I = !0;
      else return !1;
      if (I) {
        if (!W_.bidiS2.test(A) || !W_.bidiS3.test(A) || W_.bidiS4EN.test(A) && W_.bidiS4AN.test(A)) return !1
      } else if (!W_.bidiS5.test(A) || !W_.bidiS6.test(A)) return !1
    }
    return !0
  }

  function xR8(A) {
    let Q = A.map((B) => {
      if (B.startsWith("xn--")) try {
        return B40.decode(B.substring(4))
      } catch {
        return ""
      }
      return B
    }).join(".");
    return W_.bidiDomain.test(Q)
  }

  function NvB(A, Q) {
    let B = PR8(A, Q);
    B = B.normalize("NFC");
    let G = B.split("."),
      Z = xR8(G),
      Y = !1;
    for (let [J, X] of G.entries()) {
      let I = X,
        D = Q.transitionalProcessing;
      if (I.startsWith("xn--")) {
        if (Q40(I)) {
          Y = !0;
          continue
        }
        try {
          I = B40.decode(I.substring(4))
        } catch {
          if (!Q.ignoreInvalidPunycode) {
            Y = !0;
            continue
          }
        }
        if (G[J] = I, I === "" || !Q40(I)) Y = !0;
        D = !1
      }
      if (Y) continue;
      if (!SR8(I, {
          ...Q,
          transitionalProcessing: D,
          isBidi: Z
        })) Y = !0
    }
    return {
      string: G.join("."),
      error: Y
    }
  }

  function yR8(A, {
    checkHyphens: Q = !1,
    checkBidi: B = !1,
    checkJoiners: G = !1,
    useSTD3ASCIIRules: Z = !1,
    verifyDNSLength: Y = !1,
    transitionalProcessing: J = !1,
    ignoreInvalidPunycode: X = !1
  } = {}) {
    let I = NvB(A, {
        checkHyphens: Q,
        checkBidi: B,
        checkJoiners: G,
        useSTD3ASCIIRules: Z,
        transitionalProcessing: J,
        ignoreInvalidPunycode: X
      }),
      D = I.string.split(".");
    if (D = D.map((W) => {
        if (Q40(W)) try {
          return `xn--${B40.encode(W)}`
        } catch {
          I.error = !0
        }
        return W
      }), Y) {
      let W = D.join(".").length;
      if (W > 253 || W === 0) I.error = !0;
      for (let K = 0; K < D.length; ++K)
        if (D[K].length > 63 || D[K].length === 0) {
          I.error = !0;
          break
        }
    }
    if (I.error) return null;
    return D.join(".")
  }

  function vR8(A, {
    checkHyphens: Q = !1,
    checkBidi: B = !1,
    checkJoiners: G = !1,
    useSTD3ASCIIRules: Z = !1,
    transitionalProcessing: Y = !1,
    ignoreInvalidPunycode: J = !1
  } = {}) {
    let X = NvB(A, {
      checkHyphens: Q,
      checkBidi: B,
      checkJoiners: G,
      useSTD3ASCIIRules: Z,
      transitionalProcessing: Y,
      ignoreInvalidPunycode: J
    });
    return {
      domain: X.string,
      error: X.error
    }
  }
  wvB.exports = {
    toASCII: yR8,
    toUnicode: vR8
  }
})
// @from(Ln 215395, Col 4)
Z40 = U((McG, MvB) => {
  function G40(A) {
    return A >= 48 && A <= 57
  }

  function OvB(A) {
    return A >= 65 && A <= 90 || A >= 97 && A <= 122
  }

  function kR8(A) {
    return OvB(A) || G40(A)
  }

  function bR8(A) {
    return G40(A) || A >= 65 && A <= 70 || A >= 97 && A <= 102
  }
  MvB.exports = {
    isASCIIDigit: G40,
    isASCIIAlpha: OvB,
    isASCIIAlphanumeric: kR8,
    isASCIIHex: bR8
  }
})
// @from(Ln 215418, Col 4)
i41 = U((RcG, RvB) => {
  var fR8 = new TextEncoder,
    hR8 = new TextDecoder("utf-8", {
      ignoreBOM: !0
    });

  function gR8(A) {
    return fR8.encode(A)
  }

  function uR8(A) {
    return hR8.decode(A)
  }
  RvB.exports = {
    utf8Encode: gR8,
    utf8DecodeWithoutBOM: uR8
  }
})
// @from(Ln 215436, Col 4)
n41 = U((_cG, yvB) => {
  var {
    isASCIIHex: _vB
  } = Z40(), {
    utf8Encode: jvB
  } = i41();

  function p5(A) {
    return A.codePointAt(0)
  }

  function mR8(A) {
    let Q = A.toString(16).toUpperCase();
    if (Q.length === 1) Q = `0${Q}`;
    return `%${Q}`
  }

  function TvB(A) {
    let Q = new Uint8Array(A.byteLength),
      B = 0;
    for (let G = 0; G < A.byteLength; ++G) {
      let Z = A[G];
      if (Z !== 37) Q[B++] = Z;
      else if (Z === 37 && (!_vB(A[G + 1]) || !_vB(A[G + 2]))) Q[B++] = Z;
      else {
        let Y = parseInt(String.fromCodePoint(A[G + 1], A[G + 2]), 16);
        Q[B++] = Y, G += 2
      }
    }
    return Q.slice(0, B)
  }

  function dR8(A) {
    let Q = jvB(A);
    return TvB(Q)
  }

  function Y40(A) {
    return A <= 31 || A > 126
  }
  var cR8 = new Set([p5(" "), p5('"'), p5("<"), p5(">"), p5("`")]);

  function pR8(A) {
    return Y40(A) || cR8.has(A)
  }
  var lR8 = new Set([p5(" "), p5('"'), p5("#"), p5("<"), p5(">")]);

  function J40(A) {
    return Y40(A) || lR8.has(A)
  }

  function iR8(A) {
    return J40(A) || A === p5("'")
  }
  var nR8 = new Set([p5("?"), p5("`"), p5("{"), p5("}"), p5("^")]);

  function PvB(A) {
    return J40(A) || nR8.has(A)
  }
  var aR8 = new Set([p5("/"), p5(":"), p5(";"), p5("="), p5("@"), p5("["), p5("\\"), p5("]"), p5("|")]);

  function SvB(A) {
    return PvB(A) || aR8.has(A)
  }
  var oR8 = new Set([p5("$"), p5("%"), p5("&"), p5("+"), p5(",")]);

  function rR8(A) {
    return SvB(A) || oR8.has(A)
  }
  var sR8 = new Set([p5("!"), p5("'"), p5("("), p5(")"), p5("~")]);

  function tR8(A) {
    return rR8(A) || sR8.has(A)
  }

  function xvB(A, Q) {
    let B = jvB(A),
      G = "";
    for (let Z of B)
      if (!Q(Z)) G += String.fromCharCode(Z);
      else G += mR8(Z);
    return G
  }

  function eR8(A, Q) {
    return xvB(String.fromCodePoint(A), Q)
  }

  function A_8(A, Q, B = !1) {
    let G = "";
    for (let Z of A)
      if (B && Z === " ") G += "+";
      else G += xvB(Z, Q);
    return G
  }
  yvB.exports = {
    isC0ControlPercentEncode: Y40,
    isFragmentPercentEncode: pR8,
    isQueryPercentEncode: J40,
    isSpecialQueryPercentEncode: iR8,
    isPathPercentEncode: PvB,
    isUserinfoPercentEncode: SvB,
    isURLEncodedPercentEncode: tR8,
    percentDecodeString: dR8,
    percentDecodeBytes: TvB,
    utf8PercentEncodeString: A_8,
    utf8PercentEncodeCodePoint: eR8
  }
})
// @from(Ln 215545, Col 4)
V40 = U((__8, wC) => {
  var Q_8 = LvB(),
    pH = Z40(),
    {
      utf8DecodeWithoutBOM: B_8
    } = i41(),
    {
      percentDecodeString: G_8,
      utf8PercentEncodeCodePoint: o41,
      utf8PercentEncodeString: r41,
      isC0ControlPercentEncode: hvB,
      isFragmentPercentEncode: Z_8,
      isQueryPercentEncode: Y_8,
      isSpecialQueryPercentEncode: J_8,
      isPathPercentEncode: X_8,
      isUserinfoPercentEncode: D40
    } = n41();

  function EB(A) {
    return A.codePointAt(0)
  }
  var gvB = {
      ftp: 21,
      file: null,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    },
    C3 = Symbol("failure");

  function vvB(A) {
    return [...A].length
  }

  function kvB(A, Q) {
    let B = A[Q];
    return isNaN(B) ? void 0 : String.fromCodePoint(B)
  }

  function bvB(A) {
    return A === "." || A.toLowerCase() === "%2e"
  }

  function I_8(A) {
    return A = A.toLowerCase(), A === ".." || A === "%2e." || A === ".%2e" || A === "%2e%2e"
  }

  function D_8(A, Q) {
    return pH.isASCIIAlpha(A) && (Q === EB(":") || Q === EB("|"))
  }

  function uvB(A) {
    return A.length === 2 && pH.isASCIIAlpha(A.codePointAt(0)) && (A[1] === ":" || A[1] === "|")
  }

  function W_8(A) {
    return A.length === 2 && pH.isASCIIAlpha(A.codePointAt(0)) && A[1] === ":"
  }

  function mvB(A) {
    return A.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1
  }

  function K_8(A) {
    return mvB(A) || A.search(/[\u0000-\u001F]|%|\u007F/u) !== -1
  }

  function a41(A) {
    return gvB[A] !== void 0
  }

  function cH(A) {
    return a41(A.scheme)
  }

  function X40(A) {
    return !a41(A.scheme)
  }

  function dvB(A) {
    return gvB[A]
  }

  function cvB(A) {
    if (A === "") return C3;
    let Q = 10;
    if (A.length >= 2 && A.charAt(0) === "0" && A.charAt(1).toLowerCase() === "x") A = A.substring(2), Q = 16;
    else if (A.length >= 2 && A.charAt(0) === "0") A = A.substring(1), Q = 8;
    if (A === "") return 0;
    let B = /[^0-7]/u;
    if (Q === 10) B = /[^0-9]/u;
    if (Q === 16) B = /[^0-9A-Fa-f]/u;
    if (B.test(A)) return C3;
    return parseInt(A, Q)
  }

  function V_8(A) {
    let Q = A.split(".");
    if (Q[Q.length - 1] === "") {
      if (Q.length > 1) Q.pop()
    }
    if (Q.length > 4) return C3;
    let B = [];
    for (let Y of Q) {
      let J = cvB(Y);
      if (J === C3) return C3;
      B.push(J)
    }
    for (let Y = 0; Y < B.length - 1; ++Y)
      if (B[Y] > 255) return C3;
    if (B[B.length - 1] >= 256 ** (5 - B.length)) return C3;
    let G = B.pop(),
      Z = 0;
    for (let Y of B) G += Y * 256 ** (3 - Z), ++Z;
    return G
  }

  function F_8(A) {
    let Q = "",
      B = A;
    for (let G = 1; G <= 4; ++G) {
      if (Q = String(B % 256) + Q, G !== 4) Q = `.${Q}`;
      B = Math.floor(B / 256)
    }
    return Q
  }

  function H_8(A) {
    let Q = [0, 0, 0, 0, 0, 0, 0, 0],
      B = 0,
      G = null,
      Z = 0;
    if (A = Array.from(A, (Y) => Y.codePointAt(0)), A[Z] === EB(":")) {
      if (A[Z + 1] !== EB(":")) return C3;
      Z += 2, ++B, G = B
    }
    while (Z < A.length) {
      if (B === 8) return C3;
      if (A[Z] === EB(":")) {
        if (G !== null) return C3;
        ++Z, ++B, G = B;
        continue
      }
      let Y = 0,
        J = 0;
      while (J < 4 && pH.isASCIIHex(A[Z])) Y = Y * 16 + parseInt(kvB(A, Z), 16), ++Z, ++J;
      if (A[Z] === EB(".")) {
        if (J === 0) return C3;
        if (Z -= J, B > 6) return C3;
        let X = 0;
        while (A[Z] !== void 0) {
          let I = null;
          if (X > 0)
            if (A[Z] === EB(".") && X < 4) ++Z;
            else return C3;
          if (!pH.isASCIIDigit(A[Z])) return C3;
          while (pH.isASCIIDigit(A[Z])) {
            let D = parseInt(kvB(A, Z));
            if (I === null) I = D;
            else if (I === 0) return C3;
            else I = I * 10 + D;
            if (I > 255) return C3;
            ++Z
          }
          if (Q[B] = Q[B] * 256 + I, ++X, X === 2 || X === 4) ++B
        }
        if (X !== 4) return C3;
        break
      } else if (A[Z] === EB(":")) {
        if (++Z, A[Z] === void 0) return C3
      } else if (A[Z] !== void 0) return C3;
      Q[B] = Y, ++B
    }
    if (G !== null) {
      let Y = B - G;
      B = 7;
      while (B !== 0 && Y > 0) {
        let J = Q[G + Y - 1];
        Q[G + Y - 1] = Q[B], Q[B] = J, --B, --Y
      }
    } else if (G === null && B !== 8) return C3;
    return Q
  }

  function E_8(A) {
    let Q = "",
      B = C_8(A),
      G = !1;
    for (let Z = 0; Z <= 7; ++Z) {
      if (G && A[Z] === 0) continue;
      else if (G) G = !1;
      if (B === Z) {
        Q += Z === 0 ? "::" : ":", G = !0;
        continue
      }
      if (Q += A[Z].toString(16), Z !== 7) Q += ":"
    }
    return Q
  }

  function I40(A, Q = !1) {
    if (A[0] === "[") {
      if (A[A.length - 1] !== "]") return C3;
      return H_8(A.substring(1, A.length - 1))
    }
    if (Q) return $_8(A);
    let B = B_8(G_8(A)),
      G = U_8(B);
    if (G === C3) return C3;
    if (z_8(G)) return V_8(G);
    return G
  }

  function z_8(A) {
    let Q = A.split(".");
    if (Q[Q.length - 1] === "") {
      if (Q.length === 1) return !1;
      Q.pop()
    }
    let B = Q[Q.length - 1];
    if (cvB(B) !== C3) return !0;
    if (/^[0-9]+$/u.test(B)) return !0;
    return !1
  }

  function $_8(A) {
    if (mvB(A)) return C3;
    return r41(A, hvB)
  }

  function C_8(A) {
    let Q = null,
      B = 1,
      G = null,
      Z = 0;
    for (let Y = 0; Y < A.length; ++Y)
      if (A[Y] !== 0) {
        if (Z > B) Q = G, B = Z;
        G = null, Z = 0
      } else {
        if (G === null) G = Y;
        ++Z
      } if (Z > B) return G;
    return Q
  }

  function W40(A) {
    if (typeof A === "number") return F_8(A);
    if (A instanceof Array) return `[${E_8(A)}]`;
    return A
  }

  function U_8(A, Q = !1) {
    let B = Q_8.toASCII(A, {
      checkHyphens: Q,
      checkBidi: !0,
      checkJoiners: !0,
      useSTD3ASCIIRules: Q,
      transitionalProcessing: !1,
      verifyDNSLength: Q,
      ignoreInvalidPunycode: !1
    });
    if (B === null) return C3;
    if (!Q) {
      if (B === "") return C3;
      if (K_8(B)) return C3
    }
    return B
  }

  function q_8(A) {
    let Q = 0,
      B = A.length;
    for (; Q < B; ++Q)
      if (A.charCodeAt(Q) > 32) break;
    for (; B > Q; --B)
      if (A.charCodeAt(B - 1) > 32) break;
    return A.substring(Q, B)
  }

  function N_8(A) {
    return A.replace(/\u0009|\u000A|\u000D/ug, "")
  }

  function pvB(A) {
    let {
      path: Q
    } = A;
    if (Q.length === 0) return;
    if (A.scheme === "file" && Q.length === 1 && L_8(Q[0])) return;
    Q.pop()
  }

  function lvB(A) {
    return A.username !== "" || A.password !== ""
  }

  function w_8(A) {
    return A.host === null || A.host === "" || A.scheme === "file"
  }

  function sjA(A) {
    return typeof A.path === "string"
  }

  function L_8(A) {
    return /^[A-Za-z]:$/u.test(A)
  }

  function nI(A, Q, B, G, Z) {
    if (this.pointer = 0, this.input = A, this.base = Q || null, this.encodingOverride = B || "utf-8", this.stateOverride = Z, this.url = G, this.failure = !1, this.parseError = !1, !this.url) {
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
      let J = q_8(this.input);
      if (J !== this.input) this.parseError = !0;
      this.input = J
    }
    let Y = N_8(this.input);
    if (Y !== this.input) this.parseError = !0;
    this.input = Y, this.state = Z || "scheme start", this.buffer = "", this.atFlag = !1, this.arrFlag = !1, this.passwordTokenSeenFlag = !1, this.input = Array.from(this.input, (J) => J.codePointAt(0));
    for (; this.pointer <= this.input.length; ++this.pointer) {
      let J = this.input[this.pointer],
        X = isNaN(J) ? void 0 : String.fromCodePoint(J),
        I = this[`parse ${this.state}`](J, X);
      if (!I) break;
      else if (I === C3) {
        this.failure = !0;
        break
      }
    }
  }
  nI.prototype["parse scheme start"] = function (Q, B) {
    if (pH.isASCIIAlpha(Q)) this.buffer += B.toLowerCase(), this.state = "scheme";
    else if (!this.stateOverride) this.state = "no scheme", --this.pointer;
    else return this.parseError = !0, C3;
    return !0
  };
  nI.prototype["parse scheme"] = function (Q, B) {
    if (pH.isASCIIAlphanumeric(Q) || Q === EB("+") || Q === EB("-") || Q === EB(".")) this.buffer += B.toLowerCase();
    else if (Q === EB(":")) {
      if (this.stateOverride) {
        if (cH(this.url) && !a41(this.buffer)) return !1;
        if (!cH(this.url) && a41(this.buffer)) return !1;
        if ((lvB(this.url) || this.url.port !== null) && this.buffer === "file") return !1;
        if (this.url.scheme === "file" && this.url.host === "") return !1
      }
      if (this.url.scheme = this.buffer, this.stateOverride) {
        if (this.url.port === dvB(this.url.scheme)) this.url.port = null;
        return !1
      }
      if (this.buffer = "", this.url.scheme === "file") {
        if (this.input[this.pointer + 1] !== EB("/") || this.input[this.pointer + 2] !== EB("/")) this.parseError = !0;
        this.state = "file"
      } else if (cH(this.url) && this.base !== null && this.base.scheme === this.url.scheme) this.state = "special relative or authority";
      else if (cH(this.url)) this.state = "special authority slashes";
      else if (this.input[this.pointer + 1] === EB("/")) this.state = "path or authority", ++this.pointer;
      else this.url.path = "", this.state = "opaque path"
    } else if (!this.stateOverride) this.buffer = "", this.state = "no scheme", this.pointer = -1;
    else return this.parseError = !0, C3;
    return !0
  };
  nI.prototype["parse no scheme"] = function (Q) {
    if (this.base === null || sjA(this.base) && Q !== EB("#")) return C3;
    else if (sjA(this.base) && Q === EB("#")) this.url.scheme = this.base.scheme, this.url.path = this.base.path, this.url.query = this.base.query, this.url.fragment = "", this.state = "fragment";
    else if (this.base.scheme === "file") this.state = "file", --this.pointer;
    else this.state = "relative", --this.pointer;
    return !0
  };
  nI.prototype["parse special relative or authority"] = function (Q) {
    if (Q === EB("/") && this.input[this.pointer + 1] === EB("/")) this.state = "special authority ignore slashes", ++this.pointer;
    else this.parseError = !0, this.state = "relative", --this.pointer;
    return !0
  };
  nI.prototype["parse path or authority"] = function (Q) {
    if (Q === EB("/")) this.state = "authority";
    else this.state = "path", --this.pointer;
    return !0
  };
  nI.prototype["parse relative"] = function (Q) {
    if (this.url.scheme = this.base.scheme, Q === EB("/")) this.state = "relative slash";
    else if (cH(this.url) && Q === EB("\\")) this.parseError = !0, this.state = "relative slash";
    else if (this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.url.path = this.base.path.slice(), this.url.query = this.base.query, Q === EB("?")) this.url.query = "", this.state = "query";
    else if (Q === EB("#")) this.url.fragment = "", this.state = "fragment";
    else if (!isNaN(Q)) this.url.query = null, this.url.path.pop(), this.state = "path", --this.pointer;
    return !0
  };
  nI.prototype["parse relative slash"] = function (Q) {
    if (cH(this.url) && (Q === EB("/") || Q === EB("\\"))) {
      if (Q === EB("\\")) this.parseError = !0;
      this.state = "special authority ignore slashes"
    } else if (Q === EB("/")) this.state = "authority";
    else this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.state = "path", --this.pointer;
    return !0
  };
  nI.prototype["parse special authority slashes"] = function (Q) {
    if (Q === EB("/") && this.input[this.pointer + 1] === EB("/")) this.state = "special authority ignore slashes", ++this.pointer;
    else this.parseError = !0, this.state = "special authority ignore slashes", --this.pointer;
    return !0
  };
  nI.prototype["parse special authority ignore slashes"] = function (Q) {
    if (Q !== EB("/") && Q !== EB("\\")) this.state = "authority", --this.pointer;
    else this.parseError = !0;
    return !0
  };
  nI.prototype["parse authority"] = function (Q, B) {
    if (Q === EB("@")) {
      if (this.parseError = !0, this.atFlag) this.buffer = `%40${this.buffer}`;
      this.atFlag = !0;
      let G = vvB(this.buffer);
      for (let Z = 0; Z < G; ++Z) {
        let Y = this.buffer.codePointAt(Z);
        if (Y === EB(":") && !this.passwordTokenSeenFlag) {
          this.passwordTokenSeenFlag = !0;
          continue
        }
        let J = o41(Y, D40);
        if (this.passwordTokenSeenFlag) this.url.password += J;
        else this.url.username += J
      }
      this.buffer = ""
    } else if (isNaN(Q) || Q === EB("/") || Q === EB("?") || Q === EB("#") || cH(this.url) && Q === EB("\\")) {
      if (this.atFlag && this.buffer === "") return this.parseError = !0, C3;
      this.pointer -= vvB(this.buffer) + 1, this.buffer = "", this.state = "host"
    } else this.buffer += B;
    return !0
  };
  nI.prototype["parse hostname"] = nI.prototype["parse host"] = function (Q, B) {
    if (this.stateOverride && this.url.scheme === "file") --this.pointer, this.state = "file host";
    else if (Q === EB(":") && !this.arrFlag) {
      if (this.buffer === "") return this.parseError = !0, C3;
      if (this.stateOverride === "hostname") return !1;
      let G = I40(this.buffer, X40(this.url));
      if (G === C3) return C3;
      this.url.host = G, this.buffer = "", this.state = "port"
    } else if (isNaN(Q) || Q === EB("/") || Q === EB("?") || Q === EB("#") || cH(this.url) && Q === EB("\\")) {
      if (--this.pointer, cH(this.url) && this.buffer === "") return this.parseError = !0, C3;
      else if (this.stateOverride && this.buffer === "" && (lvB(this.url) || this.url.port !== null)) return this.parseError = !0, !1;
      let G = I40(this.buffer, X40(this.url));
      if (G === C3) return C3;
      if (this.url.host = G, this.buffer = "", this.state = "path start", this.stateOverride) return !1
    } else {
      if (Q === EB("[")) this.arrFlag = !0;
      else if (Q === EB("]")) this.arrFlag = !1;
      this.buffer += B
    }
    return !0
  };
  nI.prototype["parse port"] = function (Q, B) {
    if (pH.isASCIIDigit(Q)) this.buffer += B;
    else if (isNaN(Q) || Q === EB("/") || Q === EB("?") || Q === EB("#") || cH(this.url) && Q === EB("\\") || this.stateOverride) {
      if (this.buffer !== "") {
        let G = parseInt(this.buffer);
        if (G > 65535) return this.parseError = !0, C3;
        this.url.port = G === dvB(this.url.scheme) ? null : G, this.buffer = ""
      }
      if (this.stateOverride) return !1;
      this.state = "path start", --this.pointer
    } else return this.parseError = !0, C3;
    return !0
  };
  var O_8 = new Set([EB("/"), EB("\\"), EB("?"), EB("#")]);

  function ivB(A, Q) {
    let B = A.length - Q;
    return B >= 2 && D_8(A[Q], A[Q + 1]) && (B === 2 || O_8.has(A[Q + 2]))
  }
  nI.prototype["parse file"] = function (Q) {
    if (this.url.scheme = "file", this.url.host = "", Q === EB("/") || Q === EB("\\")) {
      if (Q === EB("\\")) this.parseError = !0;
      this.state = "file slash"
    } else if (this.base !== null && this.base.scheme === "file") {
      if (this.url.host = this.base.host, this.url.path = this.base.path.slice(), this.url.query = this.base.query, Q === EB("?")) this.url.query = "", this.state = "query";
      else if (Q === EB("#")) this.url.fragment = "", this.state = "fragment";
      else if (!isNaN(Q)) {
        if (this.url.query = null, !ivB(this.input, this.pointer)) pvB(this.url);
        else this.parseError = !0, this.url.path = [];
        this.state = "path", --this.pointer
      }
    } else this.state = "path", --this.pointer;
    return !0
  };
  nI.prototype["parse file slash"] = function (Q) {
    if (Q === EB("/") || Q === EB("\\")) {
      if (Q === EB("\\")) this.parseError = !0;
      this.state = "file host"
    } else {
      if (this.base !== null && this.base.scheme === "file") {
        if (!ivB(this.input, this.pointer) && W_8(this.base.path[0])) this.url.path.push(this.base.path[0]);
        this.url.host = this.base.host
      }
      this.state = "path", --this.pointer
    }
    return !0
  };
  nI.prototype["parse file host"] = function (Q, B) {
    if (isNaN(Q) || Q === EB("/") || Q === EB("\\") || Q === EB("?") || Q === EB("#"))
      if (--this.pointer, !this.stateOverride && uvB(this.buffer)) this.parseError = !0, this.state = "path";
      else if (this.buffer === "") {
      if (this.url.host = "", this.stateOverride) return !1;
      this.state = "path start"
    } else {
      let G = I40(this.buffer, X40(this.url));
      if (G === C3) return C3;
      if (G === "localhost") G = "";
      if (this.url.host = G, this.stateOverride) return !1;
      this.buffer = "", this.state = "path start"
    } else this.buffer += B;
    return !0
  };
  nI.prototype["parse path start"] = function (Q) {
    if (cH(this.url)) {
      if (Q === EB("\\")) this.parseError = !0;
      if (this.state = "path", Q !== EB("/") && Q !== EB("\\")) --this.pointer
    } else if (!this.stateOverride && Q === EB("?")) this.url.query = "", this.state = "query";
    else if (!this.stateOverride && Q === EB("#")) this.url.fragment = "", this.state = "fragment";
    else if (Q !== void 0) {
      if (this.state = "path", Q !== EB("/")) --this.pointer
    } else if (this.stateOverride && this.url.host === null) this.url.path.push("");
    return !0
  };
  nI.prototype["parse path"] = function (Q) {
    if (isNaN(Q) || Q === EB("/") || cH(this.url) && Q === EB("\\") || !this.stateOverride && (Q === EB("?") || Q === EB("#"))) {
      if (cH(this.url) && Q === EB("\\")) this.parseError = !0;
      if (I_8(this.buffer)) {
        if (pvB(this.url), Q !== EB("/") && !(cH(this.url) && Q === EB("\\"))) this.url.path.push("")
      } else if (bvB(this.buffer) && Q !== EB("/") && !(cH(this.url) && Q === EB("\\"))) this.url.path.push("");
      else if (!bvB(this.buffer)) {
        if (this.url.scheme === "file" && this.url.path.length === 0 && uvB(this.buffer)) this.buffer = `${this.buffer[0]}:`;
        this.url.path.push(this.buffer)
      }
      if (this.buffer = "", Q === EB("?")) this.url.query = "", this.state = "query";
      if (Q === EB("#")) this.url.fragment = "", this.state = "fragment"
    } else {
      if (Q === EB("%") && (!pH.isASCIIHex(this.input[this.pointer + 1]) || !pH.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.buffer += o41(Q, X_8)
    }
    return !0
  };
  nI.prototype["parse opaque path"] = function (Q) {
    if (Q === EB("?")) this.url.query = "", this.state = "query";
    else if (Q === EB("#")) this.url.fragment = "", this.state = "fragment";
    else if (Q === EB(" ")) {
      let B = this.input[this.pointer + 1];
      if (B === EB("?") || B === EB("#")) this.url.path += "%20";
      else this.url.path += " "
    } else {
      if (!isNaN(Q) && Q !== EB("%")) this.parseError = !0;
      if (Q === EB("%") && (!pH.isASCIIHex(this.input[this.pointer + 1]) || !pH.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      if (!isNaN(Q)) this.url.path += o41(Q, hvB)
    }
    return !0
  };
  nI.prototype["parse query"] = function (Q, B) {
    if (!cH(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") this.encodingOverride = "utf-8";
    if (!this.stateOverride && Q === EB("#") || isNaN(Q)) {
      let G = cH(this.url) ? J_8 : Y_8;
      if (this.url.query += r41(this.buffer, G), this.buffer = "", Q === EB("#")) this.url.fragment = "", this.state = "fragment"
    } else if (!isNaN(Q)) {
      if (Q === EB("%") && (!pH.isASCIIHex(this.input[this.pointer + 1]) || !pH.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.buffer += B
    }
    return !0
  };
  nI.prototype["parse fragment"] = function (Q) {
    if (!isNaN(Q)) {
      if (Q === EB("%") && (!pH.isASCIIHex(this.input[this.pointer + 1]) || !pH.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.url.fragment += o41(Q, Z_8)
    }
    return !0
  };

  function M_8(A, Q) {
    let B = `${A.scheme}:`;
    if (A.host !== null) {
      if (B += "//", A.username !== "" || A.password !== "") {
        if (B += A.username, A.password !== "") B += `:${A.password}`;
        B += "@"
      }
      if (B += W40(A.host), A.port !== null) B += `:${A.port}`
    }
    if (A.host === null && !sjA(A) && A.path.length > 1 && A.path[0] === "") B += "/.";
    if (B += K40(A), A.query !== null) B += `?${A.query}`;
    if (!Q && A.fragment !== null) B += `#${A.fragment}`;
    return B
  }

  function R_8(A) {
    let Q = `${A.scheme}://`;
    if (Q += W40(A.host), A.port !== null) Q += `:${A.port}`;
    return Q
  }

  function K40(A) {
    if (sjA(A)) return A.path;
    let Q = "";
    for (let B of A.path) Q += `/${B}`;
    return Q
  }
  __8.serializeURL = M_8;
  __8.serializePath = K40;
  __8.serializeURLOrigin = function (A) {
    switch (A.scheme) {
      case "blob": {
        let Q = __8.parseURL(K40(A));
        if (Q === null) return "null";
        if (Q.scheme !== "http" && Q.scheme !== "https") return "null";
        return __8.serializeURLOrigin(Q)
      }
      case "ftp":
      case "http":
      case "https":
      case "ws":
      case "wss":
        return R_8({
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
  __8.basicURLParse = function (A, Q) {
    if (Q === void 0) Q = {};
    let B = new nI(A, Q.baseURL, Q.encodingOverride, Q.url, Q.stateOverride);
    if (B.failure) return null;
    return B.url
  };
  __8.setTheUsername = function (A, Q) {
    A.username = r41(Q, D40)
  };
  __8.setThePassword = function (A, Q) {
    A.password = r41(Q, D40)
  };
  __8.serializeHost = W40;
  __8.cannotHaveAUsernamePasswordPort = w_8;
  __8.hasAnOpaquePath = sjA;
  __8.serializeInteger = function (A) {
    return String(A)
  };
  __8.parseURL = function (A, Q) {
    if (Q === void 0) Q = {};
    return __8.basicURLParse(A, {
      baseURL: Q.baseURL,
      encodingOverride: Q.encodingOverride
    })
  }
})
// @from(Ln 216204, Col 4)
F40 = U((jcG, AkB) => {
  var {
    utf8Encode: f_8,
    utf8DecodeWithoutBOM: avB
  } = i41(), {
    percentDecodeBytes: ovB,
    utf8PercentEncodeString: rvB,
    isURLEncodedPercentEncode: svB
  } = n41();

  function tvB(A) {
    return A.codePointAt(0)
  }

  function h_8(A) {
    let Q = m_8(A, tvB("&")),
      B = [];
    for (let G of Q) {
      if (G.length === 0) continue;
      let Z, Y, J = G.indexOf(tvB("="));
      if (J >= 0) Z = G.slice(0, J), Y = G.slice(J + 1);
      else Z = G, Y = new Uint8Array(0);
      Z = evB(Z, 43, 32), Y = evB(Y, 43, 32);
      let X = avB(ovB(Z)),
        I = avB(ovB(Y));
      B.push([X, I])
    }
    return B
  }

  function g_8(A) {
    return h_8(f_8(A))
  }

  function u_8(A) {
    let Q = "";
    for (let [B, G] of A.entries()) {
      let Z = rvB(G[0], svB, !0),
        Y = rvB(G[1], svB, !0);
      if (B !== 0) Q += "&";
      Q += `${Z}=${Y}`
    }
    return Q
  }

  function m_8(A, Q) {
    let B = [],
      G = 0,
      Z = A.indexOf(Q);
    while (Z >= 0) B.push(A.slice(G, Z)), G = Z + 1, Z = A.indexOf(Q, G);
    if (G !== A.length) B.push(A.slice(G));
    return B
  }

  function evB(A, Q, B) {
    let G = A.indexOf(Q);
    while (G >= 0) A[G] = B, G = A.indexOf(Q, G + 1);
    return A
  }
  AkB.exports = {
    parseUrlencodedString: g_8,
    serializeUrlencoded: u_8
  }
})
// @from(Ln 216268, Col 4)
BkB = U((d_8) => {
  var QkB = c41(),
    s41 = l41();
  d_8.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (typeof Q !== "function") throw new A.TypeError(B + " is not a function");

    function G(...Z) {
      let Y = s41.tryWrapperForImpl(this),
        J;
      for (let X = 0; X < Z.length; X++) Z[X] = s41.tryWrapperForImpl(Z[X]);
      return J = Reflect.apply(Q, Y, Z), J = QkB.any(J, {
        context: B,
        globals: A
      }), J
    }
    return G.construct = (...Z) => {
      for (let J = 0; J < Z.length; J++) Z[J] = s41.tryWrapperForImpl(Z[J]);
      let Y = Reflect.construct(Q, Z);
      return Y = QkB.any(Y, {
        context: B,
        globals: A
      }), Y
    }, G[s41.wrapperSymbol] = Q, G.objectReference = Q, G
  }
})
// @from(Ln 216295, Col 4)
GkB = U((p_8) => {
  var H40 = F40();
  p_8.implementation = class {
    constructor(Q, B, {
      doNotStripQMark: G = !1
    }) {
      let Z = B[0];
      if (this._list = [], this._url = null, !G && typeof Z === "string" && Z[0] === "?") Z = Z.slice(1);
      if (Array.isArray(Z))
        for (let Y of Z) {
          if (Y.length !== 2) throw TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
          this._list.push([Y[0], Y[1]])
        } else if (typeof Z === "object" && Object.getPrototypeOf(Z) === null)
          for (let Y of Object.keys(Z)) {
            let J = Z[Y];
            this._list.push([Y, J])
          } else this._list = H40.parseUrlencodedString(Z)
    }
    _updateSteps() {
      if (this._url !== null) {
        let Q = H40.serializeUrlencoded(this._list);
        if (Q === "") Q = null;
        this._url._url.query = Q
      }
    }
    get size() {
      return this._list.length
    }
    append(Q, B) {
      this._list.push([Q, B]), this._updateSteps()
    }
    delete(Q, B) {
      let G = 0;
      while (G < this._list.length)
        if (this._list[G][0] === Q && (B === void 0 || this._list[G][1] === B)) this._list.splice(G, 1);
        else G++;
      this._updateSteps()
    }
    get(Q) {
      for (let B of this._list)
        if (B[0] === Q) return B[1];
      return null
    }
    getAll(Q) {
      let B = [];
      for (let G of this._list)
        if (G[0] === Q) B.push(G[1]);
      return B
    }
    has(Q, B) {
      for (let G of this._list)
        if (G[0] === Q && (B === void 0 || G[1] === B)) return !0;
      return !1
    }
    set(Q, B) {
      let G = !1,
        Z = 0;
      while (Z < this._list.length)
        if (this._list[Z][0] === Q)
          if (G) this._list.splice(Z, 1);
          else G = !0, this._list[Z][1] = B, Z++;
      else Z++;
      if (!G) this._list.push([Q, B]);
      this._updateSteps()
    }
    sort() {
      this._list.sort((Q, B) => {
        if (Q[0] < B[0]) return -1;
        if (Q[0] > B[0]) return 1;
        return 0
      }), this._updateSteps()
    } [Symbol.iterator]() {
      return this._list[Symbol.iterator]()
    }
    toString() {
      return H40.serializeUrlencoded(this._list)
    }
  }
})
// @from(Ln 216374, Col 4)
z40 = U((a_8) => {
  var JN = c41(),
    GY = l41(),
    i_8 = BkB(),
    ZkB = GY.newObjectInRealm,
    hD = GY.implSymbol,
    YkB = GY.ctorRegistrySymbol;
  a_8.is = (A) => {
    return GY.isObject(A) && GY.hasOwn(A, hD) && A[hD] instanceof Yo.implementation
  };
  a_8.isImpl = (A) => {
    return GY.isObject(A) && A instanceof Yo.implementation
  };
  a_8.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (a_8.is(Q)) return GY.implForWrapper(Q);
    throw new A.TypeError(`${B} is not of type 'URLSearchParams'.`)
  };
  a_8.createDefaultIterator = (A, Q, B) => {
    let Z = A[YkB]["URLSearchParams Iterator"],
      Y = Object.create(Z);
    return Object.defineProperty(Y, GY.iterInternalSymbol, {
      value: {
        target: Q,
        kind: B,
        index: 0
      },
      configurable: !0
    }), Y
  };

  function JkB(A, Q) {
    let B;
    if (Q !== void 0) B = Q.prototype;
    if (!GY.isObject(B)) B = A[YkB].URLSearchParams.prototype;
    return Object.create(B)
  }
  a_8.create = (A, Q, B) => {
    let G = JkB(A);
    return a_8.setup(G, A, Q, B)
  };
  a_8.createImpl = (A, Q, B) => {
    let G = a_8.create(A, Q, B);
    return GY.implForWrapper(G)
  };
  a_8._internalSetup = (A, Q) => {};
  a_8.setup = (A, Q, B = [], G = {}) => {
    if (G.wrapper = A, a_8._internalSetup(A, Q), Object.defineProperty(A, hD, {
        value: new Yo.implementation(Q, B, G),
        configurable: !0
      }), A[hD][GY.wrapperSymbol] = A, Yo.init) Yo.init(A[hD]);
    return A
  };
  a_8.new = (A, Q) => {
    let B = JkB(A, Q);
    if (a_8._internalSetup(B, A), Object.defineProperty(B, hD, {
        value: Object.create(Yo.implementation.prototype),
        configurable: !0
      }), B[hD][GY.wrapperSymbol] = B, Yo.init) Yo.init(B[hD]);
    return B[hD]
  };
  var n_8 = new Set(["Window", "Worker"]);
  a_8.install = (A, Q) => {
    if (!Q.some((Z) => n_8.has(Z))) return;
    let B = GY.initCtorRegistry(A);
    class G {
      constructor() {
        let Z = [];
        {
          let Y = arguments[0];
          if (Y !== void 0)
            if (GY.isObject(Y))
              if (Y[Symbol.iterator] !== void 0)
                if (!GY.isObject(Y)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
                else {
                  let J = [],
                    X = Y;
                  for (let I of X) {
                    if (!GY.isObject(I)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                    else {
                      let D = [],
                        W = I;
                      for (let K of W) K = JN.USVString(K, {
                        context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                        globals: A
                      }), D.push(K);
                      I = D
                    }
                    J.push(I)
                  }
                  Y = J
                }
          else if (!GY.isObject(Y)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
          else {
            let J = Object.create(null);
            for (let X of Reflect.ownKeys(Y)) {
              let I = Object.getOwnPropertyDescriptor(Y, X);
              if (I && I.enumerable) {
                let D = X;
                D = JN.USVString(D, {
                  context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                  globals: A
                });
                let W = Y[X];
                W = JN.USVString(W, {
                  context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                  globals: A
                }), J[D] = W
              }
            }
            Y = J
          } else Y = JN.USVString(Y, {
            context: "Failed to construct 'URLSearchParams': parameter 1",
            globals: A
          });
          else Y = "";
          Z.push(Y)
        }
        return a_8.setup(Object.create(new.target.prototype), A, Z)
      }
      append(Z, Y) {
        let J = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(J)) throw new A.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
        let X = [];
        {
          let I = arguments[0];
          I = JN.USVString(I, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
            globals: A
          }), X.push(I)
        } {
          let I = arguments[1];
          I = JN.USVString(I, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
            globals: A
          }), X.push(I)
        }
        return GY.tryWrapperForImpl(J[hD].append(...X))
      }
      delete(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Y)) throw new A.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let J = [];
        {
          let X = arguments[0];
          X = JN.USVString(X, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(X)
        } {
          let X = arguments[1];
          if (X !== void 0) X = JN.USVString(X, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
            globals: A
          });
          J.push(X)
        }
        return GY.tryWrapperForImpl(Y[hD].delete(...J))
      }
      get(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Y)) throw new A.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let J = [];
        {
          let X = arguments[0];
          X = JN.USVString(X, {
            context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(X)
        }
        return Y[hD].get(...J)
      }
      getAll(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Y)) throw new A.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let J = [];
        {
          let X = arguments[0];
          X = JN.USVString(X, {
            context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(X)
        }
        return GY.tryWrapperForImpl(Y[hD].getAll(...J))
      }
      has(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Y)) throw new A.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let J = [];
        {
          let X = arguments[0];
          X = JN.USVString(X, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(X)
        } {
          let X = arguments[1];
          if (X !== void 0) X = JN.USVString(X, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
            globals: A
          });
          J.push(X)
        }
        return Y[hD].has(...J)
      }
      set(Z, Y) {
        let J = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(J)) throw new A.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
        let X = [];
        {
          let I = arguments[0];
          I = JN.USVString(I, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
            globals: A
          }), X.push(I)
        } {
          let I = arguments[1];
          I = JN.USVString(I, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
            globals: A
          }), X.push(I)
        }
        return GY.tryWrapperForImpl(J[hD].set(...X))
      }
      sort() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Z)) throw new A.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
        return GY.tryWrapperForImpl(Z[hD].sort())
      }
      toString() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
        return Z[hD].toString()
      }
      keys() {
        if (!a_8.is(this)) throw new A.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
        return a_8.createDefaultIterator(A, this, "key")
      }
      values() {
        if (!a_8.is(this)) throw new A.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
        return a_8.createDefaultIterator(A, this, "value")
      }
      entries() {
        if (!a_8.is(this)) throw new A.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
        return a_8.createDefaultIterator(A, this, "key+value")
      }
      forEach(Z) {
        if (!a_8.is(this)) throw new A.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
        Z = i_8.convert(A, Z, {
          context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
        });
        let Y = arguments[1],
          J = Array.from(this[hD]),
          X = 0;
        while (X < J.length) {
          let [I, D] = J[X].map(GY.tryWrapperForImpl);
          Z.call(Y, D, I, this), J = Array.from(this[hD]), X++
        }
      }
      get size() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!a_8.is(Z)) throw new A.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
        return Z[hD].size
      }
    }
    Object.defineProperties(G.prototype, {
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
        value: G.prototype.entries,
        configurable: !0,
        writable: !0
      }
    }), B.URLSearchParams = G, B["URLSearchParams Iterator"] = Object.create(B["%IteratorPrototype%"], {
      [Symbol.toStringTag]: {
        configurable: !0,
        value: "URLSearchParams Iterator"
      }
    }), GY.define(B["URLSearchParams Iterator"], {
      next() {
        let Z = this && this[GY.iterInternalSymbol];
        if (!Z) throw new A.TypeError("next() called on a value that is not a URLSearchParams iterator object");
        let {
          target: Y,
          kind: J,
          index: X
        } = Z, I = Array.from(Y[hD]), D = I.length;
        if (X >= D) return ZkB(A, {
          value: void 0,
          done: !0
        });
        let W = I[X];
        return Z.index = X + 1, ZkB(A, GY.iteratorResult(W.map(GY.tryWrapperForImpl), J))
      }
    }), Object.defineProperty(A, "URLSearchParams", {
      configurable: !0,
      writable: !0,
      value: G
    })
  };
  var Yo = GkB()
})
// @from(Ln 216725, Col 4)
WkB = U((Qj8) => {
  var PZ = V40(),
    DkB = F40(),
    Aj8 = z40();
  Qj8.implementation = class A {
    constructor(Q, [B, G]) {
      let Z = null;
      if (G !== void 0) {
        if (Z = PZ.basicURLParse(G), Z === null) throw TypeError(`Invalid base URL: ${G}`)
      }
      let Y = PZ.basicURLParse(B, {
        baseURL: Z
      });
      if (Y === null) throw TypeError(`Invalid URL: ${B}`);
      let J = Y.query !== null ? Y.query : "";
      this._url = Y, this._query = Aj8.createImpl(Q, [J], {
        doNotStripQMark: !0
      }), this._query._url = this
    }
    static parse(Q, B, G) {
      try {
        return new A(Q, [B, G])
      } catch {
        return null
      }
    }
    static canParse(Q, B) {
      let G = null;
      if (B !== void 0) {
        if (G = PZ.basicURLParse(B), G === null) return !1
      }
      if (PZ.basicURLParse(Q, {
          baseURL: G
        }) === null) return !1;
      return !0
    }
    get href() {
      return PZ.serializeURL(this._url)
    }
    set href(Q) {
      let B = PZ.basicURLParse(Q);
      if (B === null) throw TypeError(`Invalid URL: ${Q}`);
      this._url = B, this._query._list.splice(0);
      let {
        query: G
      } = B;
      if (G !== null) this._query._list = DkB.parseUrlencodedString(G)
    }
    get origin() {
      return PZ.serializeURLOrigin(this._url)
    }
    get protocol() {
      return `${this._url.scheme}:`
    }
    set protocol(Q) {
      PZ.basicURLParse(`${Q}:`, {
        url: this._url,
        stateOverride: "scheme start"
      })
    }
    get username() {
      return this._url.username
    }
    set username(Q) {
      if (PZ.cannotHaveAUsernamePasswordPort(this._url)) return;
      PZ.setTheUsername(this._url, Q)
    }
    get password() {
      return this._url.password
    }
    set password(Q) {
      if (PZ.cannotHaveAUsernamePasswordPort(this._url)) return;
      PZ.setThePassword(this._url, Q)
    }
    get host() {
      let Q = this._url;
      if (Q.host === null) return "";
      if (Q.port === null) return PZ.serializeHost(Q.host);
      return `${PZ.serializeHost(Q.host)}:${PZ.serializeInteger(Q.port)}`
    }
    set host(Q) {
      if (PZ.hasAnOpaquePath(this._url)) return;
      PZ.basicURLParse(Q, {
        url: this._url,
        stateOverride: "host"
      })
    }
    get hostname() {
      if (this._url.host === null) return "";
      return PZ.serializeHost(this._url.host)
    }
    set hostname(Q) {
      if (PZ.hasAnOpaquePath(this._url)) return;
      PZ.basicURLParse(Q, {
        url: this._url,
        stateOverride: "hostname"
      })
    }
    get port() {
      if (this._url.port === null) return "";
      return PZ.serializeInteger(this._url.port)
    }
    set port(Q) {
      if (PZ.cannotHaveAUsernamePasswordPort(this._url)) return;
      if (Q === "") this._url.port = null;
      else PZ.basicURLParse(Q, {
        url: this._url,
        stateOverride: "port"
      })
    }
    get pathname() {
      return PZ.serializePath(this._url)
    }
    set pathname(Q) {
      if (PZ.hasAnOpaquePath(this._url)) return;
      this._url.path = [], PZ.basicURLParse(Q, {
        url: this._url,
        stateOverride: "path start"
      })
    }
    get search() {
      if (this._url.query === null || this._url.query === "") return "";
      return `?${this._url.query}`
    }
    set search(Q) {
      let B = this._url;
      if (Q === "") {
        B.query = null, this._query._list = [];
        return
      }
      let G = Q[0] === "?" ? Q.substring(1) : Q;
      B.query = "", PZ.basicURLParse(G, {
        url: B,
        stateOverride: "query"
      }), this._query._list = DkB.parseUrlencodedString(G)
    }
    get searchParams() {
      return this._query
    }
    get hash() {
      if (this._url.fragment === null || this._url.fragment === "") return "";
      return `#${this._url.fragment}`
    }
    set hash(Q) {
      if (Q === "") {
        this._url.fragment = null;
        return
      }
      let B = Q[0] === "#" ? Q.substring(1) : Q;
      this._url.fragment = "", PZ.basicURLParse(B, {
        url: this._url,
        stateOverride: "fragment"
      })
    }
    toJSON() {
      return this.href
    }
  }
})
// @from(Ln 216884, Col 4)
HkB = U((Yj8) => {
  var Sz = c41(),
    XN = l41(),
    N7 = XN.implSymbol,
    Gj8 = XN.ctorRegistrySymbol;
  Yj8.is = (A) => {
    return XN.isObject(A) && XN.hasOwn(A, N7) && A[N7] instanceof hk.implementation
  };
  Yj8.isImpl = (A) => {
    return XN.isObject(A) && A instanceof hk.implementation
  };
  Yj8.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (Yj8.is(Q)) return XN.implForWrapper(Q);
    throw new A.TypeError(`${B} is not of type 'URL'.`)
  };

  function KkB(A, Q) {
    let B;
    if (Q !== void 0) B = Q.prototype;
    if (!XN.isObject(B)) B = A[Gj8].URL.prototype;
    return Object.create(B)
  }
  Yj8.create = (A, Q, B) => {
    let G = KkB(A);
    return Yj8.setup(G, A, Q, B)
  };
  Yj8.createImpl = (A, Q, B) => {
    let G = Yj8.create(A, Q, B);
    return XN.implForWrapper(G)
  };
  Yj8._internalSetup = (A, Q) => {};
  Yj8.setup = (A, Q, B = [], G = {}) => {
    if (G.wrapper = A, Yj8._internalSetup(A, Q), Object.defineProperty(A, N7, {
        value: new hk.implementation(Q, B, G),
        configurable: !0
      }), A[N7][XN.wrapperSymbol] = A, hk.init) hk.init(A[N7]);
    return A
  };
  Yj8.new = (A, Q) => {
    let B = KkB(A, Q);
    if (Yj8._internalSetup(B, A), Object.defineProperty(B, N7, {
        value: Object.create(hk.implementation.prototype),
        configurable: !0
      }), B[N7][XN.wrapperSymbol] = B, hk.init) hk.init(B[N7]);
    return B[N7]
  };
  var Zj8 = new Set(["Window", "Worker"]);
  Yj8.install = (A, Q) => {
    if (!Q.some((Z) => Zj8.has(Z))) return;
    let B = XN.initCtorRegistry(A);
    class G {
      constructor(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = Sz.USVString(J, {
            context: "Failed to construct 'URL': parameter 1",
            globals: A
          }), Y.push(J)
        } {
          let J = arguments[1];
          if (J !== void 0) J = Sz.USVString(J, {
            context: "Failed to construct 'URL': parameter 2",
            globals: A
          });
          Y.push(J)
        }
        return Yj8.setup(Object.create(new.target.prototype), A, Y)
      }
      toJSON() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
        return Z[N7].toJSON()
      }
      get href() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get href' called on an object that is not a valid instance of URL.");
        return Z[N7].href
      }
      set href(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set href' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'href' property on 'URL': The provided value",
          globals: A
        }), Y[N7].href = Z
      }
      toString() {
        let Z = this;
        if (!Yj8.is(Z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URL.");
        return Z[N7].href
      }
      get origin() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get origin' called on an object that is not a valid instance of URL.");
        return Z[N7].origin
      }
      get protocol() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
        return Z[N7].protocol
      }
      set protocol(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'protocol' property on 'URL': The provided value",
          globals: A
        }), Y[N7].protocol = Z
      }
      get username() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get username' called on an object that is not a valid instance of URL.");
        return Z[N7].username
      }
      set username(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set username' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'username' property on 'URL': The provided value",
          globals: A
        }), Y[N7].username = Z
      }
      get password() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get password' called on an object that is not a valid instance of URL.");
        return Z[N7].password
      }
      set password(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set password' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'password' property on 'URL': The provided value",
          globals: A
        }), Y[N7].password = Z
      }
      get host() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get host' called on an object that is not a valid instance of URL.");
        return Z[N7].host
      }
      set host(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set host' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'host' property on 'URL': The provided value",
          globals: A
        }), Y[N7].host = Z
      }
      get hostname() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
        return Z[N7].hostname
      }
      set hostname(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'hostname' property on 'URL': The provided value",
          globals: A
        }), Y[N7].hostname = Z
      }
      get port() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get port' called on an object that is not a valid instance of URL.");
        return Z[N7].port
      }
      set port(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set port' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'port' property on 'URL': The provided value",
          globals: A
        }), Y[N7].port = Z
      }
      get pathname() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
        return Z[N7].pathname
      }
      set pathname(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'pathname' property on 'URL': The provided value",
          globals: A
        }), Y[N7].pathname = Z
      }
      get search() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get search' called on an object that is not a valid instance of URL.");
        return Z[N7].search
      }
      set search(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set search' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'search' property on 'URL': The provided value",
          globals: A
        }), Y[N7].search = Z
      }
      get searchParams() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
        return XN.getSameObject(this, "searchParams", () => {
          return XN.tryWrapperForImpl(Z[N7].searchParams)
        })
      }
      get hash() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Z)) throw new A.TypeError("'get hash' called on an object that is not a valid instance of URL.");
        return Z[N7].hash
      }
      set hash(Z) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!Yj8.is(Y)) throw new A.TypeError("'set hash' called on an object that is not a valid instance of URL.");
        Z = Sz.USVString(Z, {
          context: "Failed to set the 'hash' property on 'URL': The provided value",
          globals: A
        }), Y[N7].hash = Z
      }
      static parse(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'parse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = Sz.USVString(J, {
            context: "Failed to execute 'parse' on 'URL': parameter 1",
            globals: A
          }), Y.push(J)
        } {
          let J = arguments[1];
          if (J !== void 0) J = Sz.USVString(J, {
            context: "Failed to execute 'parse' on 'URL': parameter 2",
            globals: A
          });
          Y.push(J)
        }
        return XN.tryWrapperForImpl(hk.implementation.parse(A, ...Y))
      }
      static canParse(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = Sz.USVString(J, {
            context: "Failed to execute 'canParse' on 'URL': parameter 1",
            globals: A
          }), Y.push(J)
        } {
          let J = arguments[1];
          if (J !== void 0) J = Sz.USVString(J, {
            context: "Failed to execute 'canParse' on 'URL': parameter 2",
            globals: A
          });
          Y.push(J)
        }
        return hk.implementation.canParse(...Y)
      }
    }
    if (Object.defineProperties(G.prototype, {
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
      }), Object.defineProperties(G, {
        parse: {
          enumerable: !0
        },
        canParse: {
          enumerable: !0
        }
      }), B.URL = G, Object.defineProperty(A, "URL", {
        configurable: !0,
        writable: !0,
        value: G
      }), Q.includes("Window")) Object.defineProperty(A, "webkitURL", {
      configurable: !0,
      writable: !0,
      value: G
    })
  };
  var hk = WkB()
})
// @from(Ln 217213, Col 4)
EkB = U((Fj8) => {
  var Kj8 = HkB(),
    Vj8 = z40();
  Fj8.URL = Kj8;
  Fj8.URLSearchParams = Vj8
})
// @from(Ln 217219, Col 4)
$kB = U((Cj8) => {
  var {
    URL: zj8,
    URLSearchParams: $j8
  } = EkB(), gP = V40(), zkB = n41(), e41 = {
    Array,
    Object,
    Promise,
    String,
    TypeError
  };
  zj8.install(e41, ["Window"]);
  $j8.install(e41, ["Window"]);
  Cj8.URL = e41.URL;
  Cj8.URLSearchParams = e41.URLSearchParams;
  Cj8.parseURL = gP.parseURL;
  Cj8.basicURLParse = gP.basicURLParse;
  Cj8.serializeURL = gP.serializeURL;
  Cj8.serializePath = gP.serializePath;
  Cj8.serializeHost = gP.serializeHost;
  Cj8.serializeInteger = gP.serializeInteger;
  Cj8.serializeURLOrigin = gP.serializeURLOrigin;
  Cj8.setTheUsername = gP.setTheUsername;
  Cj8.setThePassword = gP.setThePassword;
  Cj8.cannotHaveAUsernamePasswordPort = gP.cannotHaveAUsernamePasswordPort;
  Cj8.hasAnOpaquePath = gP.hasAnOpaquePath;
  Cj8.percentDecodeString = zkB.percentDecodeString;
  Cj8.percentDecodeBytes = zkB.percentDecodeBytes
})
// @from(Ln 217248, Col 4)
_40 = U((mP, jkB) => {
  Object.defineProperty(mP, "__esModule", {
    value: !0
  });

  function dDA(A) {
    return A && typeof A === "object" && "default" in A ? A.default : A
  }
  var uP = dDA(NA("stream")),
    NkB = dDA(NA("http")),
    Q61 = dDA(NA("url")),
    wkB = dDA($kB()),
    vj8 = dDA(NA("https")),
    W2A = dDA(NA("zlib")),
    kj8 = uP.Readable,
    Um = Symbol("buffer"),
    C40 = Symbol("type");
  class uDA {
    constructor() {
      this[C40] = "";
      let A = arguments[0],
        Q = arguments[1],
        B = [],
        G = 0;
      if (A) {
        let Y = A,
          J = Number(Y.length);
        for (let X = 0; X < J; X++) {
          let I = Y[X],
            D;
          if (I instanceof Buffer) D = I;
          else if (ArrayBuffer.isView(I)) D = Buffer.from(I.buffer, I.byteOffset, I.byteLength);
          else if (I instanceof ArrayBuffer) D = Buffer.from(I);
          else if (I instanceof uDA) D = I[Um];
          else D = Buffer.from(typeof I === "string" ? I : String(I));
          G += D.length, B.push(D)
        }
      }
      this[Um] = Buffer.concat(B);
      let Z = Q && Q.type !== void 0 && String(Q.type).toLowerCase();
      if (Z && !/[^\u0020-\u007E]/.test(Z)) this[C40] = Z
    }
    get size() {
      return this[Um].length
    }
    get type() {
      return this[C40]
    }
    text() {
      return Promise.resolve(this[Um].toString())
    }
    arrayBuffer() {
      let A = this[Um],
        Q = A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength);
      return Promise.resolve(Q)
    }
    stream() {
      let A = new kj8;
      return A._read = function () {}, A.push(this[Um]), A.push(null), A
    }
    toString() {
      return "[object Blob]"
    }
    slice() {
      let A = this.size,
        Q = arguments[0],
        B = arguments[1],
        G, Z;
      if (Q === void 0) G = 0;
      else if (Q < 0) G = Math.max(A + Q, 0);
      else G = Math.min(Q, A);
      if (B === void 0) Z = A;
      else if (B < 0) Z = Math.max(A + B, 0);
      else Z = Math.min(B, A);
      let Y = Math.max(Z - G, 0),
        X = this[Um].slice(G, G + Y),
        I = new uDA([], {
          type: arguments[2]
        });
      return I[Um] = X, I
    }
  }
  Object.defineProperties(uDA.prototype, {
    size: {
      enumerable: !0
    },
    type: {
      enumerable: !0
    },
    slice: {
      enumerable: !0
    }
  });
  Object.defineProperty(uDA.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });

  function lH(A, Q, B) {
    if (Error.call(this, A), this.message = A, this.type = Q, B) this.code = this.errno = B.code;
    Error.captureStackTrace(this, this.constructor)
  }
  lH.prototype = Object.create(Error.prototype);
  lH.prototype.constructor = lH;
  lH.prototype.name = "FetchError";
  var w40;
  try {
    w40 = (() => {
      throw new Error("Cannot require module " + "encoding");
    })().convert
  } catch (A) {}
  var Nm = Symbol("Body internals"),
    CkB = uP.PassThrough;

  function VF(A) {
    var Q = this,
      B = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      G = B.size;
    let Z = G === void 0 ? 0 : G;
    var Y = B.timeout;
    let J = Y === void 0 ? 0 : Y;
    if (A == null) A = null;
    else if (LkB(A)) A = Buffer.from(A.toString());
    else if (ATA(A));
    else if (Buffer.isBuffer(A));
    else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") A = Buffer.from(A);
    else if (ArrayBuffer.isView(A)) A = Buffer.from(A.buffer, A.byteOffset, A.byteLength);
    else if (A instanceof uP);
    else A = Buffer.from(String(A));
    if (this[Nm] = {
        body: A,
        disturbed: !1,
        error: null
      }, this.size = Z, this.timeout = J, A instanceof uP) A.on("error", function (X) {
      let I = X.name === "AbortError" ? X : new lH(`Invalid response body while trying to fetch ${Q.url}: ${X.message}`, "system", X);
      Q[Nm].error = I
    })
  }
  VF.prototype = {
    get body() {
      return this[Nm].body
    },
    get bodyUsed() {
      return this[Nm].disturbed
    },
    arrayBuffer() {
      return hDA.call(this).then(function (A) {
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
      })
    },
    blob() {
      let A = this.headers && this.headers.get("content-type") || "";
      return hDA.call(this).then(function (Q) {
        return Object.assign(new uDA([], {
          type: A.toLowerCase()
        }), {
          [Um]: Q
        })
      })
    },
    json() {
      var A = this;
      return hDA.call(this).then(function (Q) {
        try {
          return JSON.parse(Q.toString())
        } catch (B) {
          return VF.Promise.reject(new lH(`invalid json response body at ${A.url} reason: ${B.message}`, "invalid-json"))
        }
      })
    },
    text() {
      return hDA.call(this).then(function (A) {
        return A.toString()
      })
    },
    buffer() {
      return hDA.call(this)
    },
    textConverted() {
      var A = this;
      return hDA.call(this).then(function (Q) {
        return bj8(Q, A.headers)
      })
    }
  };
  Object.defineProperties(VF.prototype, {
    body: {
      enumerable: !0
    },
    bodyUsed: {
      enumerable: !0
    },
    arrayBuffer: {
      enumerable: !0
    },
    blob: {
      enumerable: !0
    },
    json: {
      enumerable: !0
    },
    text: {
      enumerable: !0
    }
  });
  VF.mixIn = function (A) {
    for (let Q of Object.getOwnPropertyNames(VF.prototype))
      if (!(Q in A)) {
        let B = Object.getOwnPropertyDescriptor(VF.prototype, Q);
        Object.defineProperty(A, Q, B)
      }
  };

  function hDA() {
    var A = this;
    if (this[Nm].disturbed) return VF.Promise.reject(TypeError(`body used already for: ${this.url}`));
    if (this[Nm].disturbed = !0, this[Nm].error) return VF.Promise.reject(this[Nm].error);
    let Q = this.body;
    if (Q === null) return VF.Promise.resolve(Buffer.alloc(0));
    if (ATA(Q)) Q = Q.stream();
    if (Buffer.isBuffer(Q)) return VF.Promise.resolve(Q);
    if (!(Q instanceof uP)) return VF.Promise.resolve(Buffer.alloc(0));
    let B = [],
      G = 0,
      Z = !1;
    return new VF.Promise(function (Y, J) {
      let X;
      if (A.timeout) X = setTimeout(function () {
        Z = !0, J(new lH(`Response timeout while trying to fetch ${A.url} (over ${A.timeout}ms)`, "body-timeout"))
      }, A.timeout);
      Q.on("error", function (I) {
        if (I.name === "AbortError") Z = !0, J(I);
        else J(new lH(`Invalid response body while trying to fetch ${A.url}: ${I.message}`, "system", I))
      }), Q.on("data", function (I) {
        if (Z || I === null) return;
        if (A.size && G + I.length > A.size) {
          Z = !0, J(new lH(`content size at ${A.url} over limit: ${A.size}`, "max-size"));
          return
        }
        G += I.length, B.push(I)
      }), Q.on("end", function () {
        if (Z) return;
        clearTimeout(X);
        try {
          Y(Buffer.concat(B, G))
        } catch (I) {
          J(new lH(`Could not create Buffer from response body for ${A.url}: ${I.message}`, "system", I))
        }
      })
    })
  }

  function bj8(A, Q) {
    if (typeof w40 !== "function") throw Error("The package `encoding` must be installed to use the textConverted() function");
    let B = Q.get("content-type"),
      G = "utf-8",
      Z, Y;
    if (B) Z = /charset=([^;]*)/i.exec(B);
    if (Y = A.slice(0, 1024).toString(), !Z && Y) Z = /<meta.+?charset=(['"])(.+?)\1/i.exec(Y);
    if (!Z && Y) {
      if (Z = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(Y), !Z) {
        if (Z = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(Y), Z) Z.pop()
      }
      if (Z) Z = /charset=(.*)/i.exec(Z.pop())
    }
    if (!Z && Y) Z = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(Y);
    if (Z) {
      if (G = Z.pop(), G === "gb2312" || G === "gbk") G = "gb18030"
    }
    return w40(A, "UTF-8", G).toString()
  }

  function LkB(A) {
    if (typeof A !== "object" || typeof A.append !== "function" || typeof A.delete !== "function" || typeof A.get !== "function" || typeof A.getAll !== "function" || typeof A.has !== "function" || typeof A.set !== "function") return !1;
    return A.constructor.name === "URLSearchParams" || Object.prototype.toString.call(A) === "[object URLSearchParams]" || typeof A.sort === "function"
  }

  function ATA(A) {
    return typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && typeof A.constructor === "function" && typeof A.constructor.name === "string" && /^(Blob|File)$/.test(A.constructor.name) && /^(Blob|File)$/.test(A[Symbol.toStringTag])
  }

  function OkB(A) {
    let Q, B, G = A.body;
    if (A.bodyUsed) throw Error("cannot clone body after it is used");
    if (G instanceof uP && typeof G.getBoundary !== "function") Q = new CkB, B = new CkB, G.pipe(Q), G.pipe(B), A[Nm].body = Q, G = B;
    return G
  }

  function MkB(A) {
    if (A === null) return null;
    else if (typeof A === "string") return "text/plain;charset=UTF-8";
    else if (LkB(A)) return "application/x-www-form-urlencoded;charset=UTF-8";
    else if (ATA(A)) return A.type || null;
    else if (Buffer.isBuffer(A)) return null;
    else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") return null;
    else if (ArrayBuffer.isView(A)) return null;
    else if (typeof A.getBoundary === "function") return `multipart/form-data;boundary=${A.getBoundary()}`;
    else if (A instanceof uP) return null;
    else return "text/plain;charset=UTF-8"
  }

  function RkB(A) {
    let Q = A.body;
    if (Q === null) return 0;
    else if (ATA(Q)) return Q.size;
    else if (Buffer.isBuffer(Q)) return Q.length;
    else if (Q && typeof Q.getLengthSync === "function") {
      if (Q._lengthRetrievers && Q._lengthRetrievers.length == 0 || Q.hasKnownLength && Q.hasKnownLength()) return Q.getLengthSync();
      return null
    } else return null
  }

  function fj8(A, Q) {
    let B = Q.body;
    if (B === null) A.end();
    else if (ATA(B)) B.stream().pipe(A);
    else if (Buffer.isBuffer(B)) A.write(B), A.end();
    else B.pipe(A)
  }
  VF.Promise = global.Promise;
  var _kB = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
    L40 = /[^\t\x20-\x7e\x80-\xff]/;

  function tjA(A) {
    if (A = `${A}`, _kB.test(A) || A === "") throw TypeError(`${A} is not a legal HTTP header name`)
  }

  function UkB(A) {
    if (A = `${A}`, L40.test(A)) throw TypeError(`${A} is not a legal HTTP header value`)
  }

  function gDA(A, Q) {
    Q = Q.toLowerCase();
    for (let B in A)
      if (B.toLowerCase() === Q) return B;
    return
  }
  var gD = Symbol("map");
  class V_ {
    constructor() {
      let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
      if (this[gD] = Object.create(null), A instanceof V_) {
        let Q = A.raw(),
          B = Object.keys(Q);
        for (let G of B)
          for (let Z of Q[G]) this.append(G, Z);
        return
      }
      if (A == null);
      else if (typeof A === "object") {
        let Q = A[Symbol.iterator];
        if (Q != null) {
          if (typeof Q !== "function") throw TypeError("Header pairs must be iterable");
          let B = [];
          for (let G of A) {
            if (typeof G !== "object" || typeof G[Symbol.iterator] !== "function") throw TypeError("Each header pair must be iterable");
            B.push(Array.from(G))
          }
          for (let G of B) {
            if (G.length !== 2) throw TypeError("Each header pair must be a name/value tuple");
            this.append(G[0], G[1])
          }
        } else
          for (let B of Object.keys(A)) {
            let G = A[B];
            this.append(B, G)
          }
      } else throw TypeError("Provided initializer must be an object")
    }
    get(A) {
      A = `${A}`, tjA(A);
      let Q = gDA(this[gD], A);
      if (Q === void 0) return null;
      return this[gD][Q].join(", ")
    }
    forEach(A) {
      let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0,
        B = O40(this),
        G = 0;
      while (G < B.length) {
        var Z = B[G];
        let Y = Z[0],
          J = Z[1];
        A.call(Q, J, Y, this), B = O40(this), G++
      }
    }
    set(A, Q) {
      A = `${A}`, Q = `${Q}`, tjA(A), UkB(Q);
      let B = gDA(this[gD], A);
      this[gD][B !== void 0 ? B : A] = [Q]
    }
    append(A, Q) {
      A = `${A}`, Q = `${Q}`, tjA(A), UkB(Q);
      let B = gDA(this[gD], A);
      if (B !== void 0) this[gD][B].push(Q);
      else this[gD][A] = [Q]
    }
    has(A) {
      return A = `${A}`, tjA(A), gDA(this[gD], A) !== void 0
    }
    delete(A) {
      A = `${A}`, tjA(A);
      let Q = gDA(this[gD], A);
      if (Q !== void 0) delete this[gD][Q]
    }
    raw() {
      return this[gD]
    }
    keys() {
      return U40(this, "key")
    }
    values() {
      return U40(this, "value")
    } [Symbol.iterator]() {
      return U40(this, "key+value")
    }
  }
  V_.prototype.entries = V_.prototype[Symbol.iterator];
  Object.defineProperty(V_.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperties(V_.prototype, {
    get: {
      enumerable: !0
    },
    forEach: {
      enumerable: !0
    },
    set: {
      enumerable: !0
    },
    append: {
      enumerable: !0
    },
    has: {
      enumerable: !0
    },
    delete: {
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
    }
  });

  function O40(A) {
    let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
    return Object.keys(A[gD]).sort().map(Q === "key" ? function (G) {
      return G.toLowerCase()
    } : Q === "value" ? function (G) {
      return A[gD][G].join(", ")
    } : function (G) {
      return [G.toLowerCase(), A[gD][G].join(", ")]
    })
  }
  var M40 = Symbol("internal");

  function U40(A, Q) {
    let B = Object.create(R40);
    return B[M40] = {
      target: A,
      kind: Q,
      index: 0
    }, B
  }
  var R40 = Object.setPrototypeOf({
    next() {
      if (!this || Object.getPrototypeOf(this) !== R40) throw TypeError("Value of `this` is not a HeadersIterator");
      var A = this[M40];
      let {
        target: Q,
        kind: B,
        index: G
      } = A, Z = O40(Q, B), Y = Z.length;
      if (G >= Y) return {
        value: void 0,
        done: !0
      };
      return this[M40].index = G + 1, {
        value: Z[G],
        done: !1
      }
    }
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
  Object.defineProperty(R40, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });

  function hj8(A) {
    let Q = Object.assign({
        __proto__: null
      }, A[gD]),
      B = gDA(A[gD], "Host");
    if (B !== void 0) Q[B] = Q[B][0];
    return Q
  }

  function gj8(A) {
    let Q = new V_;
    for (let B of Object.keys(A)) {
      if (_kB.test(B)) continue;
      if (Array.isArray(A[B]))
        for (let G of A[B]) {
          if (L40.test(G)) continue;
          if (Q[gD][B] === void 0) Q[gD][B] = [G];
          else Q[gD][B].push(G)
        } else if (!L40.test(A[B])) Q[gD][B] = [A[B]]
    }
    return Q
  }
  var Jo = Symbol("Response internals"),
    uj8 = NkB.STATUS_CODES;
  class K_ {
    constructor() {
      let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null,
        Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      VF.call(this, A, Q);
      let B = Q.status || 200,
        G = new V_(Q.headers);
      if (A != null && !G.has("Content-Type")) {
        let Z = MkB(A);
        if (Z) G.append("Content-Type", Z)
      }
      this[Jo] = {
        url: Q.url,
        status: B,
        statusText: Q.statusText || uj8[B],
        headers: G,
        counter: Q.counter
      }
    }
    get url() {
      return this[Jo].url || ""
    }
    get status() {
      return this[Jo].status
    }
    get ok() {
      return this[Jo].status >= 200 && this[Jo].status < 300
    }
    get redirected() {
      return this[Jo].counter > 0
    }
    get statusText() {
      return this[Jo].statusText
    }
    get headers() {
      return this[Jo].headers
    }
    clone() {
      return new K_(OkB(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected
      })
    }
  }
  VF.mixIn(K_.prototype);
  Object.defineProperties(K_.prototype, {
    url: {
      enumerable: !0
    },
    status: {
      enumerable: !0
    },
    ok: {
      enumerable: !0
    },
    redirected: {
      enumerable: !0
    },
    statusText: {
      enumerable: !0
    },
    headers: {
      enumerable: !0
    },
    clone: {
      enumerable: !0
    }
  });
  Object.defineProperty(K_.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  var qm = Symbol("Request internals"),
    mj8 = Q61.URL || wkB.URL,
    dj8 = Q61.parse,
    cj8 = Q61.format;

  function q40(A) {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(A)) A = new mj8(A).toString();
    return dj8(A)
  }
  var pj8 = "destroy" in uP.Readable.prototype;

  function A61(A) {
    return typeof A === "object" && typeof A[qm] === "object"
  }

  function lj8(A) {
    let Q = A && typeof A === "object" && Object.getPrototypeOf(A);
    return !!(Q && Q.constructor.name === "AbortSignal")
  }
  class Io {
    constructor(A) {
      let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        B;
      if (!A61(A)) {
        if (A && A.href) B = q40(A.href);
        else B = q40(`${A}`);
        A = {}
      } else B = q40(A.url);
      let G = Q.method || A.method || "GET";
      if (G = G.toUpperCase(), (Q.body != null || A61(A) && A.body !== null) && (G === "GET" || G === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body");
      let Z = Q.body != null ? Q.body : A61(A) && A.body !== null ? OkB(A) : null;
      VF.call(this, Z, {
        timeout: Q.timeout || A.timeout || 0,
        size: Q.size || A.size || 0
      });
      let Y = new V_(Q.headers || A.headers || {});
      if (Z != null && !Y.has("Content-Type")) {
        let X = MkB(Z);
        if (X) Y.append("Content-Type", X)
      }
      let J = A61(A) ? A.signal : null;
      if ("signal" in Q) J = Q.signal;
      if (J != null && !lj8(J)) throw TypeError("Expected signal to be an instanceof AbortSignal");
      this[qm] = {
        method: G,
        redirect: Q.redirect || A.redirect || "follow",
        headers: Y,
        parsedURL: B,
        signal: J
      }, this.follow = Q.follow !== void 0 ? Q.follow : A.follow !== void 0 ? A.follow : 20, this.compress = Q.compress !== void 0 ? Q.compress : A.compress !== void 0 ? A.compress : !0, this.counter = Q.counter || A.counter || 0, this.agent = Q.agent || A.agent
    }
    get method() {
      return this[qm].method
    }
    get url() {
      return cj8(this[qm].parsedURL)
    }
    get headers() {
      return this[qm].headers
    }
    get redirect() {
      return this[qm].redirect
    }
    get signal() {
      return this[qm].signal
    }
    clone() {
      return new Io(this)
    }
  }
  VF.mixIn(Io.prototype);
  Object.defineProperty(Io.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperties(Io.prototype, {
    method: {
      enumerable: !0
    },
    url: {
      enumerable: !0
    },
    headers: {
      enumerable: !0
    },
    redirect: {
      enumerable: !0
    },
    clone: {
      enumerable: !0
    },
    signal: {
      enumerable: !0
    }
  });

  function ij8(A) {
    let Q = A[qm].parsedURL,
      B = new V_(A[qm].headers);
    if (!B.has("Accept")) B.set("Accept", "*/*");
    if (!Q.protocol || !Q.hostname) throw TypeError("Only absolute URLs are supported");
    if (!/^https?:$/.test(Q.protocol)) throw TypeError("Only HTTP(S) protocols are supported");
    if (A.signal && A.body instanceof uP.Readable && !pj8) throw Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    let G = null;
    if (A.body == null && /^(POST|PUT)$/i.test(A.method)) G = "0";
    if (A.body != null) {
      let Y = RkB(A);
      if (typeof Y === "number") G = String(Y)
    }
    if (G) B.set("Content-Length", G);
    if (!B.has("User-Agent")) B.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    if (A.compress && !B.has("Accept-Encoding")) B.set("Accept-Encoding", "gzip,deflate");
    let Z = A.agent;
    if (typeof Z === "function") Z = Z(Q);
    return Object.assign({}, Q, {
      method: A.method,
      headers: hj8(B),
      agent: Z
    })
  }

  function mDA(A) {
    Error.call(this, A), this.type = "aborted", this.message = A, Error.captureStackTrace(this, this.constructor)
  }
  mDA.prototype = Object.create(Error.prototype);
  mDA.prototype.constructor = mDA;
  mDA.prototype.name = "AbortError";
  var ejA = Q61.URL || wkB.URL,
    qkB = uP.PassThrough,
    nj8 = function (Q, B) {
      let G = new ejA(B).hostname,
        Z = new ejA(Q).hostname;
      return G === Z || G[G.length - Z.length - 1] === "." && G.endsWith(Z)
    },
    aj8 = function (Q, B) {
      let G = new ejA(B).protocol,
        Z = new ejA(Q).protocol;
      return G === Z
    };

  function Xo(A, Q) {
    if (!Xo.Promise) throw Error("native promise missing, set fetch.Promise to your favorite alternative");
    return VF.Promise = Xo.Promise, new Xo.Promise(function (B, G) {
      let Z = new Io(A, Q),
        Y = ij8(Z),
        J = (Y.protocol === "https:" ? vj8 : NkB).request,
        X = Z.signal,
        I = null,
        D = function () {
          let E = new mDA("The user aborted a request.");
          if (G(E), Z.body && Z.body instanceof uP.Readable) N40(Z.body, E);
          if (!I || !I.body) return;
          I.body.emit("error", E)
        };
      if (X && X.aborted) {
        D();
        return
      }
      let W = function () {
          D(), F()
        },
        K = J(Y),
        V;
      if (X) X.addEventListener("abort", W);

      function F() {
        if (K.abort(), X) X.removeEventListener("abort", W);
        clearTimeout(V)
      }
      if (Z.timeout) K.once("socket", function (H) {
        V = setTimeout(function () {
          G(new lH(`network timeout at: ${Z.url}`, "request-timeout")), F()
        }, Z.timeout)
      });
      if (K.on("error", function (H) {
          if (G(new lH(`request to ${Z.url} failed, reason: ${H.message}`, "system", H)), I && I.body) N40(I.body, H);
          F()
        }), oj8(K, function (H) {
          if (X && X.aborted) return;
          if (I && I.body) N40(I.body, H)
        }), parseInt(process.version.substring(1)) < 14) K.on("socket", function (H) {
        H.addListener("close", function (E) {
          let z = H.listenerCount("data") > 0;
          if (I && z && !E && !(X && X.aborted)) {
            let $ = Error("Premature close");
            $.code = "ERR_STREAM_PREMATURE_CLOSE", I.body.emit("error", $)
          }
        })
      });
      K.on("response", function (H) {
        clearTimeout(V);
        let E = gj8(H.headers);
        if (Xo.isRedirect(H.statusCode)) {
          let M = E.get("Location"),
            _ = null;
          try {
            _ = M === null ? null : new ejA(M, Z.url).toString()
          } catch (j) {
            if (Z.redirect !== "manual") {
              G(new lH(`uri requested responds with an invalid redirect URL: ${M}`, "invalid-redirect")), F();
              return
            }
          }
          switch (Z.redirect) {
            case "error":
              G(new lH(`uri requested responds with a redirect, redirect mode is set to error: ${Z.url}`, "no-redirect")), F();
              return;
            case "manual":
              if (_ !== null) try {
                E.set("Location", _)
              } catch (x) {
                G(x)
              }
              break;
            case "follow":
              if (_ === null) break;
              if (Z.counter >= Z.follow) {
                G(new lH(`maximum redirect reached at: ${Z.url}`, "max-redirect")), F();
                return
              }
              let j = {
                headers: new V_(Z.headers),
                follow: Z.follow,
                counter: Z.counter + 1,
                agent: Z.agent,
                compress: Z.compress,
                method: Z.method,
                body: Z.body,
                signal: Z.signal,
                timeout: Z.timeout,
                size: Z.size
              };
              if (!nj8(Z.url, _) || !aj8(Z.url, _))
                for (let x of ["authorization", "www-authenticate", "cookie", "cookie2"]) j.headers.delete(x);
              if (H.statusCode !== 303 && Z.body && RkB(Z) === null) {
                G(new lH("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), F();
                return
              }
              if (H.statusCode === 303 || (H.statusCode === 301 || H.statusCode === 302) && Z.method === "POST") j.method = "GET", j.body = void 0, j.headers.delete("content-length");
              B(Xo(new Io(_, j))), F();
              return
          }
        }
        H.once("end", function () {
          if (X) X.removeEventListener("abort", W)
        });
        let z = H.pipe(new qkB),
          $ = {
            url: Z.url,
            status: H.statusCode,
            statusText: H.statusMessage,
            headers: E,
            size: Z.size,
            timeout: Z.timeout,
            counter: Z.counter
          },
          O = E.get("Content-Encoding");
        if (!Z.compress || Z.method === "HEAD" || O === null || H.statusCode === 204 || H.statusCode === 304) {
          I = new K_(z, $), B(I);
          return
        }
        let L = {
          flush: W2A.Z_SYNC_FLUSH,
          finishFlush: W2A.Z_SYNC_FLUSH
        };
        if (O == "gzip" || O == "x-gzip") {
          z = z.pipe(W2A.createGunzip(L)), I = new K_(z, $), B(I);
          return
        }
        if (O == "deflate" || O == "x-deflate") {
          let M = H.pipe(new qkB);
          M.once("data", function (_) {
            if ((_[0] & 15) === 8) z = z.pipe(W2A.createInflate());
            else z = z.pipe(W2A.createInflateRaw());
            I = new K_(z, $), B(I)
          }), M.on("end", function () {
            if (!I) I = new K_(z, $), B(I)
          });
          return
        }
        if (O == "br" && typeof W2A.createBrotliDecompress === "function") {
          z = z.pipe(W2A.createBrotliDecompress()), I = new K_(z, $), B(I);
          return
        }
        I = new K_(z, $), B(I)
      }), fj8(K, Z)
    })
  }

  function oj8(A, Q) {
    let B;
    A.on("socket", function (G) {
      B = G
    }), A.on("response", function (G) {
      let Z = G.headers;
      if (Z["transfer-encoding"] === "chunked" && !Z["content-length"]) G.once("close", function (Y) {
        if (B && B.listenerCount("data") > 0 && !Y) {
          let X = Error("Premature close");
          X.code = "ERR_STREAM_PREMATURE_CLOSE", Q(X)
        }
      })
    })
  }

  function N40(A, Q) {
    if (A.destroy) A.destroy(Q);
    else A.emit("error", Q), A.end()
  }
  Xo.isRedirect = function (A) {
    return A === 301 || A === 302 || A === 303 || A === 307 || A === 308
  };
  Xo.Promise = global.Promise;
  jkB.exports = mP = Xo;
  Object.defineProperty(mP, "__esModule", {
    value: !0
  });
  mP.default = mP;
  mP.Headers = V_;
  mP.Request = Io;
  mP.Response = K_;
  mP.FetchError = lH;
  mP.AbortError = mDA
})
// @from(Ln 218177, Col 4)
PkB = U((bcG, TkB) => {
  var gk = (A) => A !== null && typeof A === "object" && typeof A.pipe === "function";
  gk.writable = (A) => gk(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object";
  gk.readable = (A) => gk(A) && A.readable !== !1 && typeof A._read === "function" && typeof A._readableState === "object";
  gk.duplex = (A) => gk.writable(A) && gk.readable(A);
  gk.transform = (A) => gk.duplex(A) && typeof A._transform === "function";
  TkB.exports = gk
})
// @from(Ln 218185, Col 4)
SkB = U((fcG, rj8) => {
  rj8.exports = {
    name: "gaxios",
    version: "6.7.1",
    description: "A simple common HTTP client specifically for Google APIs and services.",
    main: "build/src/index.js",
    types: "build/src/index.d.ts",
    files: ["build/src"],
    scripts: {
      lint: "gts check",
      test: "c8 mocha build/test",
      "presystem-test": "npm run compile",
      "system-test": "mocha build/system-test --timeout 80000",
      compile: "tsc -p .",
      fix: "gts fix",
      prepare: "npm run compile",
      pretest: "npm run compile",
      webpack: "webpack",
      "prebrowser-test": "npm run compile",
      "browser-test": "node build/browser-test/browser-test-runner.js",
      docs: "compodoc src/",
      "docs-test": "linkinator docs",
      "predocs-test": "npm run docs",
      "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
      prelint: "cd samples; npm link ../; npm install",
      clean: "gts clean",
      precompile: "gts clean"
    },
    repository: "googleapis/gaxios",
    keywords: ["google"],
    engines: {
      node: ">=14"
    },
    author: "Google, LLC",
    license: "Apache-2.0",
    devDependencies: {
      "@babel/plugin-proposal-private-methods": "^7.18.6",
      "@compodoc/compodoc": "1.1.19",
      "@types/cors": "^2.8.6",
      "@types/express": "^4.16.1",
      "@types/extend": "^3.0.1",
      "@types/mocha": "^9.0.0",
      "@types/multiparty": "0.0.36",
      "@types/mv": "^2.1.0",
      "@types/ncp": "^2.0.1",
      "@types/node": "^20.0.0",
      "@types/node-fetch": "^2.5.7",
      "@types/sinon": "^17.0.0",
      "@types/tmp": "0.2.6",
      "@types/uuid": "^10.0.0",
      "abort-controller": "^3.0.0",
      assert: "^2.0.0",
      browserify: "^17.0.0",
      c8: "^8.0.0",
      cheerio: "1.0.0-rc.10",
      cors: "^2.8.5",
      execa: "^5.0.0",
      express: "^4.16.4",
      "form-data": "^4.0.0",
      gts: "^5.0.0",
      "is-docker": "^2.0.0",
      karma: "^6.0.0",
      "karma-chrome-launcher": "^3.0.0",
      "karma-coverage": "^2.0.0",
      "karma-firefox-launcher": "^2.0.0",
      "karma-mocha": "^2.0.0",
      "karma-remap-coverage": "^0.1.5",
      "karma-sourcemap-loader": "^0.4.0",
      "karma-webpack": "5.0.0",
      linkinator: "^3.0.0",
      mocha: "^8.0.0",
      multiparty: "^4.2.1",
      mv: "^2.1.1",
      ncp: "^2.0.0",
      nock: "^13.0.0",
      "null-loader": "^4.0.0",
      puppeteer: "^19.0.0",
      sinon: "^18.0.0",
      "stream-browserify": "^3.0.0",
      tmp: "0.2.3",
      "ts-loader": "^8.0.0",
      typescript: "^5.1.6",
      webpack: "^5.35.0",
      "webpack-cli": "^4.0.0"
    },
    dependencies: {
      extend: "^3.0.2",
      "https-proxy-agent": "^7.0.1",
      "is-stream": "^2.0.0",
      "node-fetch": "^2.6.9",
      uuid: "^9.0.1"
    }
  }
})
// @from(Ln 218279, Col 4)
vkB = U((xkB) => {
  Object.defineProperty(xkB, "__esModule", {
    value: !0
  });
  xkB.pkg = void 0;
  xkB.pkg = SkB()
})