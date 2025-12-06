
// @from(Start 7497160, End 7497296)
IgB = z((Ah6, ZgB) => {
  Ah6.STATUS_MAPPING = {
    mapped: 1,
    valid: 2,
    disallowed: 3,
    deviation: 6,
    ignored: 7
  }
})
// @from(Start 7497302, End 7502568)
VgB = z((A4G, XgB) => {
  var vp1 = AgB(),
    $M = BgB(),
    YgB = GgB(),
    {
      STATUS_MAPPING: hp
    } = IgB();

  function xp1(A) {
    return /[^\x00-\x7F]/u.test(A)
  }

  function JgB(A) {
    let Q = 0,
      B = YgB.length - 1;
    while (Q <= B) {
      let G = Math.floor((Q + B) / 2),
        Z = YgB[G],
        I = Array.isArray(Z[0]) ? Z[0][0] : Z[0],
        Y = Array.isArray(Z[0]) ? Z[0][1] : Z[0];
      if (I <= A && Y >= A) return Z.slice(1);
      else if (I > A) B = G - 1;
      else Q = G + 1
    }
    return null
  }

  function Bh6(A, {
    transitionalProcessing: Q
  }) {
    let B = "";
    for (let G of A) {
      let [Z, I] = JgB(G.codePointAt(0));
      switch (Z) {
        case hp.disallowed:
          B += G;
          break;
        case hp.ignored:
          break;
        case hp.mapped:
          if (Q && G === "ẞ") B += "ss";
          else B += I;
          break;
        case hp.deviation:
          if (Q) B += I;
          else B += G;
          break;
        case hp.valid:
          B += G;
          break
      }
    }
    return B
  }

  function Gh6(A, {
    checkHyphens: Q,
    checkBidi: B,
    checkJoiners: G,
    transitionalProcessing: Z,
    useSTD3ASCIIRules: I,
    isBidi: Y
  }) {
    if (A.length === 0) return !0;
    if (A.normalize("NFC") !== A) return !1;
    let J = Array.from(A);
    if (Q) {
      if (J[2] === "-" && J[3] === "-" || (A.startsWith("-") || A.endsWith("-"))) return !1
    }
    if (!Q) {
      if (A.startsWith("xn--")) return !1
    }
    if (A.includes(".")) return !1;
    if ($M.combiningMarks.test(J[0])) return !1;
    for (let W of J) {
      let X = W.codePointAt(0),
        [V] = JgB(X);
      if (Z) {
        if (V !== hp.valid) return !1
      } else if (V !== hp.valid && V !== hp.deviation) return !1;
      if (I && X <= 127) {
        if (!/^(?:[a-z]|[0-9]|-)$/u.test(W)) return !1
      }
    }
    if (G) {
      let W = 0;
      for (let [X, V] of J.entries())
        if (V === "‌" || V === "‍") {
          if (X > 0) {
            if ($M.combiningClassVirama.test(J[X - 1])) continue;
            if (V === "‌") {
              let F = J.indexOf("‌", X + 1),
                K = F < 0 ? J.slice(W) : J.slice(W, F);
              if ($M.validZWNJ.test(K.join(""))) {
                W = X + 1;
                continue
              }
            }
          }
          return !1
        }
    }
    if (B && Y) {
      let W;
      if ($M.bidiS1LTR.test(J[0])) W = !1;
      else if ($M.bidiS1RTL.test(J[0])) W = !0;
      else return !1;
      if (W) {
        if (!$M.bidiS2.test(A) || !$M.bidiS3.test(A) || $M.bidiS4EN.test(A) && $M.bidiS4AN.test(A)) return !1
      } else if (!$M.bidiS5.test(A) || !$M.bidiS6.test(A)) return !1
    }
    return !0
  }

  function Zh6(A) {
    let Q = A.map((B) => {
      if (B.startsWith("xn--")) try {
        return vp1.decode(B.substring(4))
      } catch {
        return ""
      }
      return B
    }).join(".");
    return $M.bidiDomain.test(Q)
  }

  function WgB(A, Q) {
    let B = Bh6(A, Q);
    B = B.normalize("NFC");
    let G = B.split("."),
      Z = Zh6(G),
      I = !1;
    for (let [Y, J] of G.entries()) {
      let W = J,
        X = Q.transitionalProcessing;
      if (W.startsWith("xn--")) {
        if (xp1(W)) {
          I = !0;
          continue
        }
        try {
          W = vp1.decode(W.substring(4))
        } catch {
          if (!Q.ignoreInvalidPunycode) {
            I = !0;
            continue
          }
        }
        if (G[Y] = W, W === "" || !xp1(W)) I = !0;
        X = !1
      }
      if (I) continue;
      if (!Gh6(W, {
          ...Q,
          transitionalProcessing: X,
          isBidi: Z
        })) I = !0
    }
    return {
      string: G.join("."),
      error: I
    }
  }

  function Ih6(A, {
    checkHyphens: Q = !1,
    checkBidi: B = !1,
    checkJoiners: G = !1,
    useSTD3ASCIIRules: Z = !1,
    verifyDNSLength: I = !1,
    transitionalProcessing: Y = !1,
    ignoreInvalidPunycode: J = !1
  } = {}) {
    let W = WgB(A, {
        checkHyphens: Q,
        checkBidi: B,
        checkJoiners: G,
        useSTD3ASCIIRules: Z,
        transitionalProcessing: Y,
        ignoreInvalidPunycode: J
      }),
      X = W.string.split(".");
    if (X = X.map((V) => {
        if (xp1(V)) try {
          return `xn--${vp1.encode(V)}`
        } catch {
          W.error = !0
        }
        return V
      }), I) {
      let V = X.join(".").length;
      if (V > 253 || V === 0) W.error = !0;
      for (let F = 0; F < X.length; ++F)
        if (X[F].length > 63 || X[F].length === 0) {
          W.error = !0;
          break
        }
    }
    if (W.error) return null;
    return X.join(".")
  }

  function Yh6(A, {
    checkHyphens: Q = !1,
    checkBidi: B = !1,
    checkJoiners: G = !1,
    useSTD3ASCIIRules: Z = !1,
    transitionalProcessing: I = !1,
    ignoreInvalidPunycode: Y = !1
  } = {}) {
    let J = WgB(A, {
      checkHyphens: Q,
      checkBidi: B,
      checkJoiners: G,
      useSTD3ASCIIRules: Z,
      transitionalProcessing: I,
      ignoreInvalidPunycode: Y
    });
    return {
      domain: J.string,
      error: J.error
    }
  }
  XgB.exports = {
    toASCII: Ih6,
    toUnicode: Yh6
  }
})
// @from(Start 7502574, End 7502991)
fp1 = z((Q4G, KgB) => {
  function bp1(A) {
    return A >= 48 && A <= 57
  }

  function FgB(A) {
    return A >= 65 && A <= 90 || A >= 97 && A <= 122
  }

  function Jh6(A) {
    return FgB(A) || bp1(A)
  }

  function Wh6(A) {
    return bp1(A) || A >= 65 && A <= 70 || A >= 97 && A <= 102
  }
  KgB.exports = {
    isASCIIDigit: bp1,
    isASCIIAlpha: FgB,
    isASCIIAlphanumeric: Jh6,
    isASCIIHex: Wh6
  }
})
// @from(Start 7502997, End 7503290)
rtA = z((B4G, DgB) => {
  var Xh6 = new TextEncoder,
    Vh6 = new TextDecoder("utf-8", {
      ignoreBOM: !0
    });

  function Fh6(A) {
    return Xh6.encode(A)
  }

  function Kh6(A) {
    return Vh6.decode(A)
  }
  DgB.exports = {
    utf8Encode: Fh6,
    utf8DecodeWithoutBOM: Kh6
  }
})
// @from(Start 7503296, End 7505716)
otA = z((G4G, wgB) => {
  var {
    isASCIIHex: HgB
  } = fp1(), {
    utf8Encode: CgB
  } = rtA();

  function p5(A) {
    return A.codePointAt(0)
  }

  function Dh6(A) {
    let Q = A.toString(16).toUpperCase();
    if (Q.length === 1) Q = `0${Q}`;
    return `%${Q}`
  }

  function EgB(A) {
    let Q = new Uint8Array(A.byteLength),
      B = 0;
    for (let G = 0; G < A.byteLength; ++G) {
      let Z = A[G];
      if (Z !== 37) Q[B++] = Z;
      else if (Z === 37 && (!HgB(A[G + 1]) || !HgB(A[G + 2]))) Q[B++] = Z;
      else {
        let I = parseInt(String.fromCodePoint(A[G + 1], A[G + 2]), 16);
        Q[B++] = I, G += 2
      }
    }
    return Q.slice(0, B)
  }

  function Hh6(A) {
    let Q = CgB(A);
    return EgB(Q)
  }

  function hp1(A) {
    return A <= 31 || A > 126
  }
  var Ch6 = new Set([p5(" "), p5('"'), p5("<"), p5(">"), p5("`")]);

  function Eh6(A) {
    return hp1(A) || Ch6.has(A)
  }
  var zh6 = new Set([p5(" "), p5('"'), p5("#"), p5("<"), p5(">")]);

  function gp1(A) {
    return hp1(A) || zh6.has(A)
  }

  function Uh6(A) {
    return gp1(A) || A === p5("'")
  }
  var $h6 = new Set([p5("?"), p5("`"), p5("{"), p5("}"), p5("^")]);

  function zgB(A) {
    return gp1(A) || $h6.has(A)
  }
  var wh6 = new Set([p5("/"), p5(":"), p5(";"), p5("="), p5("@"), p5("["), p5("\\"), p5("]"), p5("|")]);

  function UgB(A) {
    return zgB(A) || wh6.has(A)
  }
  var qh6 = new Set([p5("$"), p5("%"), p5("&"), p5("+"), p5(",")]);

  function Nh6(A) {
    return UgB(A) || qh6.has(A)
  }
  var Lh6 = new Set([p5("!"), p5("'"), p5("("), p5(")"), p5("~")]);

  function Mh6(A) {
    return Nh6(A) || Lh6.has(A)
  }

  function $gB(A, Q) {
    let B = CgB(A),
      G = "";
    for (let Z of B)
      if (!Q(Z)) G += String.fromCharCode(Z);
      else G += Dh6(Z);
    return G
  }

  function Oh6(A, Q) {
    return $gB(String.fromCodePoint(A), Q)
  }

  function Rh6(A, Q, B = !1) {
    let G = "";
    for (let Z of A)
      if (B && Z === " ") G += "+";
      else G += $gB(Z, Q);
    return G
  }
  wgB.exports = {
    isC0ControlPercentEncode: hp1,
    isFragmentPercentEncode: Eh6,
    isQueryPercentEncode: gp1,
    isSpecialQueryPercentEncode: Uh6,
    isPathPercentEncode: zgB,
    isUserinfoPercentEncode: UgB,
    isURLEncodedPercentEncode: Mh6,
    percentDecodeString: Hh6,
    percentDecodeBytes: EgB,
    utf8PercentEncodeString: Rh6,
    utf8PercentEncodeCodePoint: Oh6
  }
})
// @from(Start 7505722, End 7528374)
lp1 = z((eh6, XE) => {
  var Th6 = VgB(),
    qD = fp1(),
    {
      utf8DecodeWithoutBOM: Ph6
    } = rtA(),
    {
      percentDecodeString: jh6,
      utf8PercentEncodeCodePoint: etA,
      utf8PercentEncodeString: AeA,
      isC0ControlPercentEncode: OgB,
      isFragmentPercentEncode: Sh6,
      isQueryPercentEncode: _h6,
      isSpecialQueryPercentEncode: kh6,
      isPathPercentEncode: yh6,
      isUserinfoPercentEncode: dp1
    } = otA();

  function SQ(A) {
    return A.codePointAt(0)
  }
  var RgB = {
      ftp: 21,
      file: null,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    },
    $8 = Symbol("failure");

  function qgB(A) {
    return [...A].length
  }

  function NgB(A, Q) {
    let B = A[Q];
    return isNaN(B) ? void 0 : String.fromCodePoint(B)
  }

  function LgB(A) {
    return A === "." || A.toLowerCase() === "%2e"
  }

  function xh6(A) {
    return A = A.toLowerCase(), A === ".." || A === "%2e." || A === ".%2e" || A === "%2e%2e"
  }

  function vh6(A, Q) {
    return qD.isASCIIAlpha(A) && (Q === SQ(":") || Q === SQ("|"))
  }

  function TgB(A) {
    return A.length === 2 && qD.isASCIIAlpha(A.codePointAt(0)) && (A[1] === ":" || A[1] === "|")
  }

  function bh6(A) {
    return A.length === 2 && qD.isASCIIAlpha(A.codePointAt(0)) && A[1] === ":"
  }

  function PgB(A) {
    return A.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1
  }

  function fh6(A) {
    return PgB(A) || A.search(/[\u0000-\u001F]|%|\u007F/u) !== -1
  }

  function ttA(A) {
    return RgB[A] !== void 0
  }

  function wD(A) {
    return ttA(A.scheme)
  }

  function up1(A) {
    return !ttA(A.scheme)
  }

  function jgB(A) {
    return RgB[A]
  }

  function SgB(A) {
    if (A === "") return $8;
    let Q = 10;
    if (A.length >= 2 && A.charAt(0) === "0" && A.charAt(1).toLowerCase() === "x") A = A.substring(2), Q = 16;
    else if (A.length >= 2 && A.charAt(0) === "0") A = A.substring(1), Q = 8;
    if (A === "") return 0;
    let B = /[^0-7]/u;
    if (Q === 10) B = /[^0-9]/u;
    if (Q === 16) B = /[^0-9A-Fa-f]/u;
    if (B.test(A)) return $8;
    return parseInt(A, Q)
  }

  function hh6(A) {
    let Q = A.split(".");
    if (Q[Q.length - 1] === "") {
      if (Q.length > 1) Q.pop()
    }
    if (Q.length > 4) return $8;
    let B = [];
    for (let I of Q) {
      let Y = SgB(I);
      if (Y === $8) return $8;
      B.push(Y)
    }
    for (let I = 0; I < B.length - 1; ++I)
      if (B[I] > 255) return $8;
    if (B[B.length - 1] >= 256 ** (5 - B.length)) return $8;
    let G = B.pop(),
      Z = 0;
    for (let I of B) G += I * 256 ** (3 - Z), ++Z;
    return G
  }

  function gh6(A) {
    let Q = "",
      B = A;
    for (let G = 1; G <= 4; ++G) {
      if (Q = String(B % 256) + Q, G !== 4) Q = `.${Q}`;
      B = Math.floor(B / 256)
    }
    return Q
  }

  function uh6(A) {
    let Q = [0, 0, 0, 0, 0, 0, 0, 0],
      B = 0,
      G = null,
      Z = 0;
    if (A = Array.from(A, (I) => I.codePointAt(0)), A[Z] === SQ(":")) {
      if (A[Z + 1] !== SQ(":")) return $8;
      Z += 2, ++B, G = B
    }
    while (Z < A.length) {
      if (B === 8) return $8;
      if (A[Z] === SQ(":")) {
        if (G !== null) return $8;
        ++Z, ++B, G = B;
        continue
      }
      let I = 0,
        Y = 0;
      while (Y < 4 && qD.isASCIIHex(A[Z])) I = I * 16 + parseInt(NgB(A, Z), 16), ++Z, ++Y;
      if (A[Z] === SQ(".")) {
        if (Y === 0) return $8;
        if (Z -= Y, B > 6) return $8;
        let J = 0;
        while (A[Z] !== void 0) {
          let W = null;
          if (J > 0)
            if (A[Z] === SQ(".") && J < 4) ++Z;
            else return $8;
          if (!qD.isASCIIDigit(A[Z])) return $8;
          while (qD.isASCIIDigit(A[Z])) {
            let X = parseInt(NgB(A, Z));
            if (W === null) W = X;
            else if (W === 0) return $8;
            else W = W * 10 + X;
            if (W > 255) return $8;
            ++Z
          }
          if (Q[B] = Q[B] * 256 + W, ++J, J === 2 || J === 4) ++B
        }
        if (J !== 4) return $8;
        break
      } else if (A[Z] === SQ(":")) {
        if (++Z, A[Z] === void 0) return $8
      } else if (A[Z] !== void 0) return $8;
      Q[B] = I, ++B
    }
    if (G !== null) {
      let I = B - G;
      B = 7;
      while (B !== 0 && I > 0) {
        let Y = Q[G + I - 1];
        Q[G + I - 1] = Q[B], Q[B] = Y, --B, --I
      }
    } else if (G === null && B !== 8) return $8;
    return Q
  }

  function mh6(A) {
    let Q = "",
      B = ph6(A),
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

  function mp1(A, Q = !1) {
    if (A[0] === "[") {
      if (A[A.length - 1] !== "]") return $8;
      return uh6(A.substring(1, A.length - 1))
    }
    if (Q) return ch6(A);
    let B = Ph6(jh6(A)),
      G = lh6(B);
    if (G === $8) return $8;
    if (dh6(G)) return hh6(G);
    return G
  }

  function dh6(A) {
    let Q = A.split(".");
    if (Q[Q.length - 1] === "") {
      if (Q.length === 1) return !1;
      Q.pop()
    }
    let B = Q[Q.length - 1];
    if (SgB(B) !== $8) return !0;
    if (/^[0-9]+$/u.test(B)) return !0;
    return !1
  }

  function ch6(A) {
    if (PgB(A)) return $8;
    return AeA(A, OgB)
  }

  function ph6(A) {
    let Q = null,
      B = 1,
      G = null,
      Z = 0;
    for (let I = 0; I < A.length; ++I)
      if (A[I] !== 0) {
        if (Z > B) Q = G, B = Z;
        G = null, Z = 0
      } else {
        if (G === null) G = I;
        ++Z
      } if (Z > B) return G;
    return Q
  }

  function cp1(A) {
    if (typeof A === "number") return gh6(A);
    if (A instanceof Array) return `[${mh6(A)}]`;
    return A
  }

  function lh6(A, Q = !1) {
    let B = Th6.toASCII(A, {
      checkHyphens: Q,
      checkBidi: !0,
      checkJoiners: !0,
      useSTD3ASCIIRules: Q,
      transitionalProcessing: !1,
      verifyDNSLength: Q,
      ignoreInvalidPunycode: !1
    });
    if (B === null) return $8;
    if (!Q) {
      if (B === "") return $8;
      if (fh6(B)) return $8
    }
    return B
  }

  function ih6(A) {
    let Q = 0,
      B = A.length;
    for (; Q < B; ++Q)
      if (A.charCodeAt(Q) > 32) break;
    for (; B > Q; --B)
      if (A.charCodeAt(B - 1) > 32) break;
    return A.substring(Q, B)
  }

  function nh6(A) {
    return A.replace(/\u0009|\u000A|\u000D/ug, "")
  }

  function _gB(A) {
    let {
      path: Q
    } = A;
    if (Q.length === 0) return;
    if (A.scheme === "file" && Q.length === 1 && sh6(Q[0])) return;
    Q.pop()
  }

  function kgB(A) {
    return A.username !== "" || A.password !== ""
  }

  function ah6(A) {
    return A.host === null || A.host === "" || A.scheme === "file"
  }

  function $wA(A) {
    return typeof A.path === "string"
  }

  function sh6(A) {
    return /^[A-Za-z]:$/u.test(A)
  }

  function jJ(A, Q, B, G, Z) {
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
      let Y = ih6(this.input);
      if (Y !== this.input) this.parseError = !0;
      this.input = Y
    }
    let I = nh6(this.input);
    if (I !== this.input) this.parseError = !0;
    this.input = I, this.state = Z || "scheme start", this.buffer = "", this.atFlag = !1, this.arrFlag = !1, this.passwordTokenSeenFlag = !1, this.input = Array.from(this.input, (Y) => Y.codePointAt(0));
    for (; this.pointer <= this.input.length; ++this.pointer) {
      let Y = this.input[this.pointer],
        J = isNaN(Y) ? void 0 : String.fromCodePoint(Y),
        W = this[`parse ${this.state}`](Y, J);
      if (!W) break;
      else if (W === $8) {
        this.failure = !0;
        break
      }
    }
  }
  jJ.prototype["parse scheme start"] = function(Q, B) {
    if (qD.isASCIIAlpha(Q)) this.buffer += B.toLowerCase(), this.state = "scheme";
    else if (!this.stateOverride) this.state = "no scheme", --this.pointer;
    else return this.parseError = !0, $8;
    return !0
  };
  jJ.prototype["parse scheme"] = function(Q, B) {
    if (qD.isASCIIAlphanumeric(Q) || Q === SQ("+") || Q === SQ("-") || Q === SQ(".")) this.buffer += B.toLowerCase();
    else if (Q === SQ(":")) {
      if (this.stateOverride) {
        if (wD(this.url) && !ttA(this.buffer)) return !1;
        if (!wD(this.url) && ttA(this.buffer)) return !1;
        if ((kgB(this.url) || this.url.port !== null) && this.buffer === "file") return !1;
        if (this.url.scheme === "file" && this.url.host === "") return !1
      }
      if (this.url.scheme = this.buffer, this.stateOverride) {
        if (this.url.port === jgB(this.url.scheme)) this.url.port = null;
        return !1
      }
      if (this.buffer = "", this.url.scheme === "file") {
        if (this.input[this.pointer + 1] !== SQ("/") || this.input[this.pointer + 2] !== SQ("/")) this.parseError = !0;
        this.state = "file"
      } else if (wD(this.url) && this.base !== null && this.base.scheme === this.url.scheme) this.state = "special relative or authority";
      else if (wD(this.url)) this.state = "special authority slashes";
      else if (this.input[this.pointer + 1] === SQ("/")) this.state = "path or authority", ++this.pointer;
      else this.url.path = "", this.state = "opaque path"
    } else if (!this.stateOverride) this.buffer = "", this.state = "no scheme", this.pointer = -1;
    else return this.parseError = !0, $8;
    return !0
  };
  jJ.prototype["parse no scheme"] = function(Q) {
    if (this.base === null || $wA(this.base) && Q !== SQ("#")) return $8;
    else if ($wA(this.base) && Q === SQ("#")) this.url.scheme = this.base.scheme, this.url.path = this.base.path, this.url.query = this.base.query, this.url.fragment = "", this.state = "fragment";
    else if (this.base.scheme === "file") this.state = "file", --this.pointer;
    else this.state = "relative", --this.pointer;
    return !0
  };
  jJ.prototype["parse special relative or authority"] = function(Q) {
    if (Q === SQ("/") && this.input[this.pointer + 1] === SQ("/")) this.state = "special authority ignore slashes", ++this.pointer;
    else this.parseError = !0, this.state = "relative", --this.pointer;
    return !0
  };
  jJ.prototype["parse path or authority"] = function(Q) {
    if (Q === SQ("/")) this.state = "authority";
    else this.state = "path", --this.pointer;
    return !0
  };
  jJ.prototype["parse relative"] = function(Q) {
    if (this.url.scheme = this.base.scheme, Q === SQ("/")) this.state = "relative slash";
    else if (wD(this.url) && Q === SQ("\\")) this.parseError = !0, this.state = "relative slash";
    else if (this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.url.path = this.base.path.slice(), this.url.query = this.base.query, Q === SQ("?")) this.url.query = "", this.state = "query";
    else if (Q === SQ("#")) this.url.fragment = "", this.state = "fragment";
    else if (!isNaN(Q)) this.url.query = null, this.url.path.pop(), this.state = "path", --this.pointer;
    return !0
  };
  jJ.prototype["parse relative slash"] = function(Q) {
    if (wD(this.url) && (Q === SQ("/") || Q === SQ("\\"))) {
      if (Q === SQ("\\")) this.parseError = !0;
      this.state = "special authority ignore slashes"
    } else if (Q === SQ("/")) this.state = "authority";
    else this.url.username = this.base.username, this.url.password = this.base.password, this.url.host = this.base.host, this.url.port = this.base.port, this.state = "path", --this.pointer;
    return !0
  };
  jJ.prototype["parse special authority slashes"] = function(Q) {
    if (Q === SQ("/") && this.input[this.pointer + 1] === SQ("/")) this.state = "special authority ignore slashes", ++this.pointer;
    else this.parseError = !0, this.state = "special authority ignore slashes", --this.pointer;
    return !0
  };
  jJ.prototype["parse special authority ignore slashes"] = function(Q) {
    if (Q !== SQ("/") && Q !== SQ("\\")) this.state = "authority", --this.pointer;
    else this.parseError = !0;
    return !0
  };
  jJ.prototype["parse authority"] = function(Q, B) {
    if (Q === SQ("@")) {
      if (this.parseError = !0, this.atFlag) this.buffer = `%40${this.buffer}`;
      this.atFlag = !0;
      let G = qgB(this.buffer);
      for (let Z = 0; Z < G; ++Z) {
        let I = this.buffer.codePointAt(Z);
        if (I === SQ(":") && !this.passwordTokenSeenFlag) {
          this.passwordTokenSeenFlag = !0;
          continue
        }
        let Y = etA(I, dp1);
        if (this.passwordTokenSeenFlag) this.url.password += Y;
        else this.url.username += Y
      }
      this.buffer = ""
    } else if (isNaN(Q) || Q === SQ("/") || Q === SQ("?") || Q === SQ("#") || wD(this.url) && Q === SQ("\\")) {
      if (this.atFlag && this.buffer === "") return this.parseError = !0, $8;
      this.pointer -= qgB(this.buffer) + 1, this.buffer = "", this.state = "host"
    } else this.buffer += B;
    return !0
  };
  jJ.prototype["parse hostname"] = jJ.prototype["parse host"] = function(Q, B) {
    if (this.stateOverride && this.url.scheme === "file") --this.pointer, this.state = "file host";
    else if (Q === SQ(":") && !this.arrFlag) {
      if (this.buffer === "") return this.parseError = !0, $8;
      if (this.stateOverride === "hostname") return !1;
      let G = mp1(this.buffer, up1(this.url));
      if (G === $8) return $8;
      this.url.host = G, this.buffer = "", this.state = "port"
    } else if (isNaN(Q) || Q === SQ("/") || Q === SQ("?") || Q === SQ("#") || wD(this.url) && Q === SQ("\\")) {
      if (--this.pointer, wD(this.url) && this.buffer === "") return this.parseError = !0, $8;
      else if (this.stateOverride && this.buffer === "" && (kgB(this.url) || this.url.port !== null)) return this.parseError = !0, !1;
      let G = mp1(this.buffer, up1(this.url));
      if (G === $8) return $8;
      if (this.url.host = G, this.buffer = "", this.state = "path start", this.stateOverride) return !1
    } else {
      if (Q === SQ("[")) this.arrFlag = !0;
      else if (Q === SQ("]")) this.arrFlag = !1;
      this.buffer += B
    }
    return !0
  };
  jJ.prototype["parse port"] = function(Q, B) {
    if (qD.isASCIIDigit(Q)) this.buffer += B;
    else if (isNaN(Q) || Q === SQ("/") || Q === SQ("?") || Q === SQ("#") || wD(this.url) && Q === SQ("\\") || this.stateOverride) {
      if (this.buffer !== "") {
        let G = parseInt(this.buffer);
        if (G > 65535) return this.parseError = !0, $8;
        this.url.port = G === jgB(this.url.scheme) ? null : G, this.buffer = ""
      }
      if (this.stateOverride) return !1;
      this.state = "path start", --this.pointer
    } else return this.parseError = !0, $8;
    return !0
  };
  var rh6 = new Set([SQ("/"), SQ("\\"), SQ("?"), SQ("#")]);

  function ygB(A, Q) {
    let B = A.length - Q;
    return B >= 2 && vh6(A[Q], A[Q + 1]) && (B === 2 || rh6.has(A[Q + 2]))
  }
  jJ.prototype["parse file"] = function(Q) {
    if (this.url.scheme = "file", this.url.host = "", Q === SQ("/") || Q === SQ("\\")) {
      if (Q === SQ("\\")) this.parseError = !0;
      this.state = "file slash"
    } else if (this.base !== null && this.base.scheme === "file") {
      if (this.url.host = this.base.host, this.url.path = this.base.path.slice(), this.url.query = this.base.query, Q === SQ("?")) this.url.query = "", this.state = "query";
      else if (Q === SQ("#")) this.url.fragment = "", this.state = "fragment";
      else if (!isNaN(Q)) {
        if (this.url.query = null, !ygB(this.input, this.pointer)) _gB(this.url);
        else this.parseError = !0, this.url.path = [];
        this.state = "path", --this.pointer
      }
    } else this.state = "path", --this.pointer;
    return !0
  };
  jJ.prototype["parse file slash"] = function(Q) {
    if (Q === SQ("/") || Q === SQ("\\")) {
      if (Q === SQ("\\")) this.parseError = !0;
      this.state = "file host"
    } else {
      if (this.base !== null && this.base.scheme === "file") {
        if (!ygB(this.input, this.pointer) && bh6(this.base.path[0])) this.url.path.push(this.base.path[0]);
        this.url.host = this.base.host
      }
      this.state = "path", --this.pointer
    }
    return !0
  };
  jJ.prototype["parse file host"] = function(Q, B) {
    if (isNaN(Q) || Q === SQ("/") || Q === SQ("\\") || Q === SQ("?") || Q === SQ("#"))
      if (--this.pointer, !this.stateOverride && TgB(this.buffer)) this.parseError = !0, this.state = "path";
      else if (this.buffer === "") {
      if (this.url.host = "", this.stateOverride) return !1;
      this.state = "path start"
    } else {
      let G = mp1(this.buffer, up1(this.url));
      if (G === $8) return $8;
      if (G === "localhost") G = "";
      if (this.url.host = G, this.stateOverride) return !1;
      this.buffer = "", this.state = "path start"
    } else this.buffer += B;
    return !0
  };
  jJ.prototype["parse path start"] = function(Q) {
    if (wD(this.url)) {
      if (Q === SQ("\\")) this.parseError = !0;
      if (this.state = "path", Q !== SQ("/") && Q !== SQ("\\")) --this.pointer
    } else if (!this.stateOverride && Q === SQ("?")) this.url.query = "", this.state = "query";
    else if (!this.stateOverride && Q === SQ("#")) this.url.fragment = "", this.state = "fragment";
    else if (Q !== void 0) {
      if (this.state = "path", Q !== SQ("/")) --this.pointer
    } else if (this.stateOverride && this.url.host === null) this.url.path.push("");
    return !0
  };
  jJ.prototype["parse path"] = function(Q) {
    if (isNaN(Q) || Q === SQ("/") || wD(this.url) && Q === SQ("\\") || !this.stateOverride && (Q === SQ("?") || Q === SQ("#"))) {
      if (wD(this.url) && Q === SQ("\\")) this.parseError = !0;
      if (xh6(this.buffer)) {
        if (_gB(this.url), Q !== SQ("/") && !(wD(this.url) && Q === SQ("\\"))) this.url.path.push("")
      } else if (LgB(this.buffer) && Q !== SQ("/") && !(wD(this.url) && Q === SQ("\\"))) this.url.path.push("");
      else if (!LgB(this.buffer)) {
        if (this.url.scheme === "file" && this.url.path.length === 0 && TgB(this.buffer)) this.buffer = `${this.buffer[0]}:`;
        this.url.path.push(this.buffer)
      }
      if (this.buffer = "", Q === SQ("?")) this.url.query = "", this.state = "query";
      if (Q === SQ("#")) this.url.fragment = "", this.state = "fragment"
    } else {
      if (Q === SQ("%") && (!qD.isASCIIHex(this.input[this.pointer + 1]) || !qD.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.buffer += etA(Q, yh6)
    }
    return !0
  };
  jJ.prototype["parse opaque path"] = function(Q) {
    if (Q === SQ("?")) this.url.query = "", this.state = "query";
    else if (Q === SQ("#")) this.url.fragment = "", this.state = "fragment";
    else if (Q === SQ(" ")) {
      let B = this.input[this.pointer + 1];
      if (B === SQ("?") || B === SQ("#")) this.url.path += "%20";
      else this.url.path += " "
    } else {
      if (!isNaN(Q) && Q !== SQ("%")) this.parseError = !0;
      if (Q === SQ("%") && (!qD.isASCIIHex(this.input[this.pointer + 1]) || !qD.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      if (!isNaN(Q)) this.url.path += etA(Q, OgB)
    }
    return !0
  };
  jJ.prototype["parse query"] = function(Q, B) {
    if (!wD(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") this.encodingOverride = "utf-8";
    if (!this.stateOverride && Q === SQ("#") || isNaN(Q)) {
      let G = wD(this.url) ? kh6 : _h6;
      if (this.url.query += AeA(this.buffer, G), this.buffer = "", Q === SQ("#")) this.url.fragment = "", this.state = "fragment"
    } else if (!isNaN(Q)) {
      if (Q === SQ("%") && (!qD.isASCIIHex(this.input[this.pointer + 1]) || !qD.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.buffer += B
    }
    return !0
  };
  jJ.prototype["parse fragment"] = function(Q) {
    if (!isNaN(Q)) {
      if (Q === SQ("%") && (!qD.isASCIIHex(this.input[this.pointer + 1]) || !qD.isASCIIHex(this.input[this.pointer + 2]))) this.parseError = !0;
      this.url.fragment += etA(Q, Sh6)
    }
    return !0
  };

  function oh6(A, Q) {
    let B = `${A.scheme}:`;
    if (A.host !== null) {
      if (B += "//", A.username !== "" || A.password !== "") {
        if (B += A.username, A.password !== "") B += `:${A.password}`;
        B += "@"
      }
      if (B += cp1(A.host), A.port !== null) B += `:${A.port}`
    }
    if (A.host === null && !$wA(A) && A.path.length > 1 && A.path[0] === "") B += "/.";
    if (B += pp1(A), A.query !== null) B += `?${A.query}`;
    if (!Q && A.fragment !== null) B += `#${A.fragment}`;
    return B
  }

  function th6(A) {
    let Q = `${A.scheme}://`;
    if (Q += cp1(A.host), A.port !== null) Q += `:${A.port}`;
    return Q
  }

  function pp1(A) {
    if ($wA(A)) return A.path;
    let Q = "";
    for (let B of A.path) Q += `/${B}`;
    return Q
  }
  eh6.serializeURL = oh6;
  eh6.serializePath = pp1;
  eh6.serializeURLOrigin = function(A) {
    switch (A.scheme) {
      case "blob": {
        let Q = eh6.parseURL(pp1(A));
        if (Q === null) return "null";
        if (Q.scheme !== "http" && Q.scheme !== "https") return "null";
        return eh6.serializeURLOrigin(Q)
      }
      case "ftp":
      case "http":
      case "https":
      case "ws":
      case "wss":
        return th6({
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
  eh6.basicURLParse = function(A, Q) {
    if (Q === void 0) Q = {};
    let B = new jJ(A, Q.baseURL, Q.encodingOverride, Q.url, Q.stateOverride);
    if (B.failure) return null;
    return B.url
  };
  eh6.setTheUsername = function(A, Q) {
    A.username = AeA(Q, dp1)
  };
  eh6.setThePassword = function(A, Q) {
    A.password = AeA(Q, dp1)
  };
  eh6.serializeHost = cp1;
  eh6.cannotHaveAUsernamePasswordPort = ah6;
  eh6.hasAnOpaquePath = $wA;
  eh6.serializeInteger = function(A) {
    return String(A)
  };
  eh6.parseURL = function(A, Q) {
    if (Q === void 0) Q = {};
    return eh6.basicURLParse(A, {
      baseURL: Q.baseURL,
      encodingOverride: Q.encodingOverride
    })
  }
})
// @from(Start 7528380, End 7529732)
ip1 = z((Z4G, mgB) => {
  var {
    utf8Encode: Xg6,
    utf8DecodeWithoutBOM: vgB
  } = rtA(), {
    percentDecodeBytes: bgB,
    utf8PercentEncodeString: fgB,
    isURLEncodedPercentEncode: hgB
  } = otA();

  function ggB(A) {
    return A.codePointAt(0)
  }

  function Vg6(A) {
    let Q = Dg6(A, ggB("&")),
      B = [];
    for (let G of Q) {
      if (G.length === 0) continue;
      let Z, I, Y = G.indexOf(ggB("="));
      if (Y >= 0) Z = G.slice(0, Y), I = G.slice(Y + 1);
      else Z = G, I = new Uint8Array(0);
      Z = ugB(Z, 43, 32), I = ugB(I, 43, 32);
      let J = vgB(bgB(Z)),
        W = vgB(bgB(I));
      B.push([J, W])
    }
    return B
  }

  function Fg6(A) {
    return Vg6(Xg6(A))
  }

  function Kg6(A) {
    let Q = "";
    for (let [B, G] of A.entries()) {
      let Z = fgB(G[0], hgB, !0),
        I = fgB(G[1], hgB, !0);
      if (B !== 0) Q += "&";
      Q += `${Z}=${I}`
    }
    return Q
  }

  function Dg6(A, Q) {
    let B = [],
      G = 0,
      Z = A.indexOf(Q);
    while (Z >= 0) B.push(A.slice(G, Z)), G = Z + 1, Z = A.indexOf(Q, G);
    if (G !== A.length) B.push(A.slice(G));
    return B
  }

  function ugB(A, Q, B) {
    let G = A.indexOf(Q);
    while (G >= 0) A[G] = B, G = A.indexOf(Q, G + 1);
    return A
  }
  mgB.exports = {
    parseUrlencodedString: Fg6,
    serializeUrlencoded: Kg6
  }
})
// @from(Start 7529738, End 7530521)
cgB = z((Hg6) => {
  var dgB = ntA(),
    QeA = stA();
  Hg6.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (typeof Q !== "function") throw new A.TypeError(B + " is not a function");

    function G(...Z) {
      let I = QeA.tryWrapperForImpl(this),
        Y;
      for (let J = 0; J < Z.length; J++) Z[J] = QeA.tryWrapperForImpl(Z[J]);
      return Y = Reflect.apply(Q, I, Z), Y = dgB.any(Y, {
        context: B,
        globals: A
      }), Y
    }
    return G.construct = (...Z) => {
      for (let Y = 0; Y < Z.length; Y++) Z[Y] = QeA.tryWrapperForImpl(Z[Y]);
      let I = Reflect.construct(Q, Z);
      return I = dgB.any(I, {
        context: B,
        globals: A
      }), I
    }, G[QeA.wrapperSymbol] = Q, G.objectReference = Q, G
  }
})
// @from(Start 7530527, End 7532817)
pgB = z((Eg6) => {
  var np1 = ip1();
  Eg6.implementation = class {
    constructor(Q, B, {
      doNotStripQMark: G = !1
    }) {
      let Z = B[0];
      if (this._list = [], this._url = null, !G && typeof Z === "string" && Z[0] === "?") Z = Z.slice(1);
      if (Array.isArray(Z))
        for (let I of Z) {
          if (I.length !== 2) throw TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not contain exactly two elements.");
          this._list.push([I[0], I[1]])
        } else if (typeof Z === "object" && Object.getPrototypeOf(Z) === null)
          for (let I of Object.keys(Z)) {
            let Y = Z[I];
            this._list.push([I, Y])
          } else this._list = np1.parseUrlencodedString(Z)
    }
    _updateSteps() {
      if (this._url !== null) {
        let Q = np1.serializeUrlencoded(this._list);
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
      return np1.serializeUrlencoded(this._list)
    }
  }
})
// @from(Start 7532823, End 7545747)
sp1 = z((wg6) => {
  var $U = ntA(),
    XZ = stA(),
    Ug6 = cgB(),
    lgB = XZ.newObjectInRealm,
    TW = XZ.implSymbol,
    igB = XZ.ctorRegistrySymbol;
  wg6.is = (A) => {
    return XZ.isObject(A) && XZ.hasOwn(A, TW) && A[TW] instanceof gp.implementation
  };
  wg6.isImpl = (A) => {
    return XZ.isObject(A) && A instanceof gp.implementation
  };
  wg6.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (wg6.is(Q)) return XZ.implForWrapper(Q);
    throw new A.TypeError(`${B} is not of type 'URLSearchParams'.`)
  };
  wg6.createDefaultIterator = (A, Q, B) => {
    let Z = A[igB]["URLSearchParams Iterator"],
      I = Object.create(Z);
    return Object.defineProperty(I, XZ.iterInternalSymbol, {
      value: {
        target: Q,
        kind: B,
        index: 0
      },
      configurable: !0
    }), I
  };

  function ngB(A, Q) {
    let B;
    if (Q !== void 0) B = Q.prototype;
    if (!XZ.isObject(B)) B = A[igB].URLSearchParams.prototype;
    return Object.create(B)
  }
  wg6.create = (A, Q, B) => {
    let G = ngB(A);
    return wg6.setup(G, A, Q, B)
  };
  wg6.createImpl = (A, Q, B) => {
    let G = wg6.create(A, Q, B);
    return XZ.implForWrapper(G)
  };
  wg6._internalSetup = (A, Q) => {};
  wg6.setup = (A, Q, B = [], G = {}) => {
    if (G.wrapper = A, wg6._internalSetup(A, Q), Object.defineProperty(A, TW, {
        value: new gp.implementation(Q, B, G),
        configurable: !0
      }), A[TW][XZ.wrapperSymbol] = A, gp.init) gp.init(A[TW]);
    return A
  };
  wg6.new = (A, Q) => {
    let B = ngB(A, Q);
    if (wg6._internalSetup(B, A), Object.defineProperty(B, TW, {
        value: Object.create(gp.implementation.prototype),
        configurable: !0
      }), B[TW][XZ.wrapperSymbol] = B, gp.init) gp.init(B[TW]);
    return B[TW]
  };
  var $g6 = new Set(["Window", "Worker"]);
  wg6.install = (A, Q) => {
    if (!Q.some((Z) => $g6.has(Z))) return;
    let B = XZ.initCtorRegistry(A);
    class G {
      constructor() {
        let Z = [];
        {
          let I = arguments[0];
          if (I !== void 0)
            if (XZ.isObject(I))
              if (I[Symbol.iterator] !== void 0)
                if (!XZ.isObject(I)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence is not an iterable object.");
                else {
                  let Y = [],
                    J = I;
                  for (let W of J) {
                    if (!XZ.isObject(W)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element is not an iterable object.");
                    else {
                      let X = [],
                        V = W;
                      for (let F of V) F = $U.USVString(F, {
                        context: "Failed to construct 'URLSearchParams': parameter 1 sequence's element's element",
                        globals: A
                      }), X.push(F);
                      W = X
                    }
                    Y.push(W)
                  }
                  I = Y
                }
          else if (!XZ.isObject(I)) throw new A.TypeError("Failed to construct 'URLSearchParams': parameter 1 record is not an object.");
          else {
            let Y = Object.create(null);
            for (let J of Reflect.ownKeys(I)) {
              let W = Object.getOwnPropertyDescriptor(I, J);
              if (W && W.enumerable) {
                let X = J;
                X = $U.USVString(X, {
                  context: "Failed to construct 'URLSearchParams': parameter 1 record's key",
                  globals: A
                });
                let V = I[J];
                V = $U.USVString(V, {
                  context: "Failed to construct 'URLSearchParams': parameter 1 record's value",
                  globals: A
                }), Y[X] = V
              }
            }
            I = Y
          } else I = $U.USVString(I, {
            context: "Failed to construct 'URLSearchParams': parameter 1",
            globals: A
          });
          else I = "";
          Z.push(I)
        }
        return wg6.setup(Object.create(new.target.prototype), A, Z)
      }
      append(Z, I) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(Y)) throw new A.TypeError("'append' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
        let J = [];
        {
          let W = arguments[0];
          W = $U.USVString(W, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(W)
        } {
          let W = arguments[1];
          W = $U.USVString(W, {
            context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
            globals: A
          }), J.push(W)
        }
        return XZ.tryWrapperForImpl(Y[TW].append(...J))
      }
      delete(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(I)) throw new A.TypeError("'delete' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = $U.USVString(J, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
            globals: A
          }), Y.push(J)
        } {
          let J = arguments[1];
          if (J !== void 0) J = $U.USVString(J, {
            context: "Failed to execute 'delete' on 'URLSearchParams': parameter 2",
            globals: A
          });
          Y.push(J)
        }
        return XZ.tryWrapperForImpl(I[TW].delete(...Y))
      }
      get(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(I)) throw new A.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = $U.USVString(J, {
            context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
            globals: A
          }), Y.push(J)
        }
        return I[TW].get(...Y)
      }
      getAll(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(I)) throw new A.TypeError("'getAll' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = $U.USVString(J, {
            context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
            globals: A
          }), Y.push(J)
        }
        return XZ.tryWrapperForImpl(I[TW].getAll(...Y))
      }
      has(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(I)) throw new A.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`);
        let Y = [];
        {
          let J = arguments[0];
          J = $U.USVString(J, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
            globals: A
          }), Y.push(J)
        } {
          let J = arguments[1];
          if (J !== void 0) J = $U.USVString(J, {
            context: "Failed to execute 'has' on 'URLSearchParams': parameter 2",
            globals: A
          });
          Y.push(J)
        }
        return I[TW].has(...Y)
      }
      set(Z, I) {
        let Y = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(Y)) throw new A.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 2) throw new A.TypeError(`Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`);
        let J = [];
        {
          let W = arguments[0];
          W = $U.USVString(W, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
            globals: A
          }), J.push(W)
        } {
          let W = arguments[1];
          W = $U.USVString(W, {
            context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
            globals: A
          }), J.push(W)
        }
        return XZ.tryWrapperForImpl(Y[TW].set(...J))
      }
      sort() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(Z)) throw new A.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
        return XZ.tryWrapperForImpl(Z[TW].sort())
      }
      toString() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(Z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URLSearchParams.");
        return Z[TW].toString()
      }
      keys() {
        if (!wg6.is(this)) throw new A.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
        return wg6.createDefaultIterator(A, this, "key")
      }
      values() {
        if (!wg6.is(this)) throw new A.TypeError("'values' called on an object that is not a valid instance of URLSearchParams.");
        return wg6.createDefaultIterator(A, this, "value")
      }
      entries() {
        if (!wg6.is(this)) throw new A.TypeError("'entries' called on an object that is not a valid instance of URLSearchParams.");
        return wg6.createDefaultIterator(A, this, "key+value")
      }
      forEach(Z) {
        if (!wg6.is(this)) throw new A.TypeError("'forEach' called on an object that is not a valid instance of URLSearchParams.");
        if (arguments.length < 1) throw new A.TypeError("Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present.");
        Z = Ug6.convert(A, Z, {
          context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
        });
        let I = arguments[1],
          Y = Array.from(this[TW]),
          J = 0;
        while (J < Y.length) {
          let [W, X] = Y[J].map(XZ.tryWrapperForImpl);
          Z.call(I, X, W, this), Y = Array.from(this[TW]), J++
        }
      }
      get size() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!wg6.is(Z)) throw new A.TypeError("'get size' called on an object that is not a valid instance of URLSearchParams.");
        return Z[TW].size
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
    }), XZ.define(B["URLSearchParams Iterator"], {
      next() {
        let Z = this && this[XZ.iterInternalSymbol];
        if (!Z) throw new A.TypeError("next() called on a value that is not a URLSearchParams iterator object");
        let {
          target: I,
          kind: Y,
          index: J
        } = Z, W = Array.from(I[TW]), X = W.length;
        if (J >= X) return lgB(A, {
          value: void 0,
          done: !0
        });
        let V = W[J];
        return Z.index = J + 1, lgB(A, XZ.iteratorResult(V.map(XZ.tryWrapperForImpl), Y))
      }
    }), Object.defineProperty(A, "URLSearchParams", {
      configurable: !0,
      writable: !0,
      value: G
    })
  };
  var gp = pgB()
})
// @from(Start 7545753, End 7549970)
ogB = z((Tg6) => {
  var vG = lp1(),
    rgB = ip1(),
    Rg6 = sp1();
  Tg6.implementation = class A {
    constructor(Q, [B, G]) {
      let Z = null;
      if (G !== void 0) {
        if (Z = vG.basicURLParse(G), Z === null) throw TypeError(`Invalid base URL: ${G}`)
      }
      let I = vG.basicURLParse(B, {
        baseURL: Z
      });
      if (I === null) throw TypeError(`Invalid URL: ${B}`);
      let Y = I.query !== null ? I.query : "";
      this._url = I, this._query = Rg6.createImpl(Q, [Y], {
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
        if (G = vG.basicURLParse(B), G === null) return !1
      }
      if (vG.basicURLParse(Q, {
          baseURL: G
        }) === null) return !1;
      return !0
    }
    get href() {
      return vG.serializeURL(this._url)
    }
    set href(Q) {
      let B = vG.basicURLParse(Q);
      if (B === null) throw TypeError(`Invalid URL: ${Q}`);
      this._url = B, this._query._list.splice(0);
      let {
        query: G
      } = B;
      if (G !== null) this._query._list = rgB.parseUrlencodedString(G)
    }
    get origin() {
      return vG.serializeURLOrigin(this._url)
    }
    get protocol() {
      return `${this._url.scheme}:`
    }
    set protocol(Q) {
      vG.basicURLParse(`${Q}:`, {
        url: this._url,
        stateOverride: "scheme start"
      })
    }
    get username() {
      return this._url.username
    }
    set username(Q) {
      if (vG.cannotHaveAUsernamePasswordPort(this._url)) return;
      vG.setTheUsername(this._url, Q)
    }
    get password() {
      return this._url.password
    }
    set password(Q) {
      if (vG.cannotHaveAUsernamePasswordPort(this._url)) return;
      vG.setThePassword(this._url, Q)
    }
    get host() {
      let Q = this._url;
      if (Q.host === null) return "";
      if (Q.port === null) return vG.serializeHost(Q.host);
      return `${vG.serializeHost(Q.host)}:${vG.serializeInteger(Q.port)}`
    }
    set host(Q) {
      if (vG.hasAnOpaquePath(this._url)) return;
      vG.basicURLParse(Q, {
        url: this._url,
        stateOverride: "host"
      })
    }
    get hostname() {
      if (this._url.host === null) return "";
      return vG.serializeHost(this._url.host)
    }
    set hostname(Q) {
      if (vG.hasAnOpaquePath(this._url)) return;
      vG.basicURLParse(Q, {
        url: this._url,
        stateOverride: "hostname"
      })
    }
    get port() {
      if (this._url.port === null) return "";
      return vG.serializeInteger(this._url.port)
    }
    set port(Q) {
      if (vG.cannotHaveAUsernamePasswordPort(this._url)) return;
      if (Q === "") this._url.port = null;
      else vG.basicURLParse(Q, {
        url: this._url,
        stateOverride: "port"
      })
    }
    get pathname() {
      return vG.serializePath(this._url)
    }
    set pathname(Q) {
      if (vG.hasAnOpaquePath(this._url)) return;
      this._url.path = [], vG.basicURLParse(Q, {
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
      B.query = "", vG.basicURLParse(G, {
        url: B,
        stateOverride: "query"
      }), this._query._list = rgB.parseUrlencodedString(G)
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
      this._url.fragment = "", vG.basicURLParse(B, {
        url: this._url,
        stateOverride: "fragment"
      })
    }
    toJSON() {
      return this.href
    }
  }
})
// @from(Start 7549976, End 7562180)
QuB = z((_g6) => {
  var lH = ntA(),
    wU = stA(),
    y3 = wU.implSymbol,
    jg6 = wU.ctorRegistrySymbol;
  _g6.is = (A) => {
    return wU.isObject(A) && wU.hasOwn(A, y3) && A[y3] instanceof t_.implementation
  };
  _g6.isImpl = (A) => {
    return wU.isObject(A) && A instanceof t_.implementation
  };
  _g6.convert = (A, Q, {
    context: B = "The provided value"
  } = {}) => {
    if (_g6.is(Q)) return wU.implForWrapper(Q);
    throw new A.TypeError(`${B} is not of type 'URL'.`)
  };

  function tgB(A, Q) {
    let B;
    if (Q !== void 0) B = Q.prototype;
    if (!wU.isObject(B)) B = A[jg6].URL.prototype;
    return Object.create(B)
  }
  _g6.create = (A, Q, B) => {
    let G = tgB(A);
    return _g6.setup(G, A, Q, B)
  };
  _g6.createImpl = (A, Q, B) => {
    let G = _g6.create(A, Q, B);
    return wU.implForWrapper(G)
  };
  _g6._internalSetup = (A, Q) => {};
  _g6.setup = (A, Q, B = [], G = {}) => {
    if (G.wrapper = A, _g6._internalSetup(A, Q), Object.defineProperty(A, y3, {
        value: new t_.implementation(Q, B, G),
        configurable: !0
      }), A[y3][wU.wrapperSymbol] = A, t_.init) t_.init(A[y3]);
    return A
  };
  _g6.new = (A, Q) => {
    let B = tgB(A, Q);
    if (_g6._internalSetup(B, A), Object.defineProperty(B, y3, {
        value: Object.create(t_.implementation.prototype),
        configurable: !0
      }), B[y3][wU.wrapperSymbol] = B, t_.init) t_.init(B[y3]);
    return B[y3]
  };
  var Sg6 = new Set(["Window", "Worker"]);
  _g6.install = (A, Q) => {
    if (!Q.some((Z) => Sg6.has(Z))) return;
    let B = wU.initCtorRegistry(A);
    class G {
      constructor(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`);
        let I = [];
        {
          let Y = arguments[0];
          Y = lH.USVString(Y, {
            context: "Failed to construct 'URL': parameter 1",
            globals: A
          }), I.push(Y)
        } {
          let Y = arguments[1];
          if (Y !== void 0) Y = lH.USVString(Y, {
            context: "Failed to construct 'URL': parameter 2",
            globals: A
          });
          I.push(Y)
        }
        return _g6.setup(Object.create(new.target.prototype), A, I)
      }
      toJSON() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
        return Z[y3].toJSON()
      }
      get href() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get href' called on an object that is not a valid instance of URL.");
        return Z[y3].href
      }
      set href(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set href' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'href' property on 'URL': The provided value",
          globals: A
        }), I[y3].href = Z
      }
      toString() {
        let Z = this;
        if (!_g6.is(Z)) throw new A.TypeError("'toString' called on an object that is not a valid instance of URL.");
        return Z[y3].href
      }
      get origin() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get origin' called on an object that is not a valid instance of URL.");
        return Z[y3].origin
      }
      get protocol() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
        return Z[y3].protocol
      }
      set protocol(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'protocol' property on 'URL': The provided value",
          globals: A
        }), I[y3].protocol = Z
      }
      get username() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get username' called on an object that is not a valid instance of URL.");
        return Z[y3].username
      }
      set username(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set username' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'username' property on 'URL': The provided value",
          globals: A
        }), I[y3].username = Z
      }
      get password() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get password' called on an object that is not a valid instance of URL.");
        return Z[y3].password
      }
      set password(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set password' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'password' property on 'URL': The provided value",
          globals: A
        }), I[y3].password = Z
      }
      get host() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get host' called on an object that is not a valid instance of URL.");
        return Z[y3].host
      }
      set host(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set host' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'host' property on 'URL': The provided value",
          globals: A
        }), I[y3].host = Z
      }
      get hostname() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
        return Z[y3].hostname
      }
      set hostname(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'hostname' property on 'URL': The provided value",
          globals: A
        }), I[y3].hostname = Z
      }
      get port() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get port' called on an object that is not a valid instance of URL.");
        return Z[y3].port
      }
      set port(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set port' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'port' property on 'URL': The provided value",
          globals: A
        }), I[y3].port = Z
      }
      get pathname() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
        return Z[y3].pathname
      }
      set pathname(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'pathname' property on 'URL': The provided value",
          globals: A
        }), I[y3].pathname = Z
      }
      get search() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get search' called on an object that is not a valid instance of URL.");
        return Z[y3].search
      }
      set search(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set search' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'search' property on 'URL': The provided value",
          globals: A
        }), I[y3].search = Z
      }
      get searchParams() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
        return wU.getSameObject(this, "searchParams", () => {
          return wU.tryWrapperForImpl(Z[y3].searchParams)
        })
      }
      get hash() {
        let Z = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(Z)) throw new A.TypeError("'get hash' called on an object that is not a valid instance of URL.");
        return Z[y3].hash
      }
      set hash(Z) {
        let I = this !== null && this !== void 0 ? this : A;
        if (!_g6.is(I)) throw new A.TypeError("'set hash' called on an object that is not a valid instance of URL.");
        Z = lH.USVString(Z, {
          context: "Failed to set the 'hash' property on 'URL': The provided value",
          globals: A
        }), I[y3].hash = Z
      }
      static parse(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'parse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
        let I = [];
        {
          let Y = arguments[0];
          Y = lH.USVString(Y, {
            context: "Failed to execute 'parse' on 'URL': parameter 1",
            globals: A
          }), I.push(Y)
        } {
          let Y = arguments[1];
          if (Y !== void 0) Y = lH.USVString(Y, {
            context: "Failed to execute 'parse' on 'URL': parameter 2",
            globals: A
          });
          I.push(Y)
        }
        return wU.tryWrapperForImpl(t_.implementation.parse(A, ...I))
      }
      static canParse(Z) {
        if (arguments.length < 1) throw new A.TypeError(`Failed to execute 'canParse' on 'URL': 1 argument required, but only ${arguments.length} present.`);
        let I = [];
        {
          let Y = arguments[0];
          Y = lH.USVString(Y, {
            context: "Failed to execute 'canParse' on 'URL': parameter 1",
            globals: A
          }), I.push(Y)
        } {
          let Y = arguments[1];
          if (Y !== void 0) Y = lH.USVString(Y, {
            context: "Failed to execute 'canParse' on 'URL': parameter 2",
            globals: A
          });
          I.push(Y)
        }
        return t_.implementation.canParse(...I)
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
  var t_ = ogB()
})
// @from(Start 7562186, End 7562288)
BuB = z((gg6) => {
  var fg6 = QuB(),
    hg6 = sp1();
  gg6.URL = fg6;
  gg6.URLSearchParams = hg6
})
// @from(Start 7562294, End 7563196)
ZuB = z((pg6) => {
  var {
    URL: dg6,
    URLSearchParams: cg6
  } = BuB(), OT = lp1(), GuB = otA(), GeA = {
    Array,
    Object,
    Promise,
    String,
    TypeError
  };
  dg6.install(GeA, ["Window"]);
  cg6.install(GeA, ["Window"]);
  pg6.URL = GeA.URL;
  pg6.URLSearchParams = GeA.URLSearchParams;
  pg6.parseURL = OT.parseURL;
  pg6.basicURLParse = OT.basicURLParse;
  pg6.serializeURL = OT.serializeURL;
  pg6.serializePath = OT.serializePath;
  pg6.serializeHost = OT.serializeHost;
  pg6.serializeInteger = OT.serializeInteger;
  pg6.serializeURLOrigin = OT.serializeURLOrigin;
  pg6.setTheUsername = OT.setTheUsername;
  pg6.setThePassword = OT.setThePassword;
  pg6.cannotHaveAUsernamePasswordPort = OT.cannotHaveAUsernamePasswordPort;
  pg6.hasAnOpaquePath = OT.hasAnOpaquePath;
  pg6.percentDecodeString = GuB.percentDecodeString;
  pg6.percentDecodeBytes = GuB.percentDecodeBytes
})
// @from(Start 7563202, End 7591223)
Yl1 = z((TT, CuB) => {
  Object.defineProperty(TT, "__esModule", {
    value: !0
  });

  function mGA(A) {
    return A && typeof A === "object" && "default" in A ? A.default : A
  }
  var RT = mGA(UA("stream")),
    WuB = mGA(UA("http")),
    IeA = mGA(UA("url")),
    XuB = mGA(ZuB()),
    Yu6 = mGA(UA("https")),
    He = mGA(UA("zlib")),
    Ju6 = RT.Readable,
    wf = Symbol("buffer"),
    op1 = Symbol("type");
  class gGA {
    constructor() {
      this[op1] = "";
      let A = arguments[0],
        Q = arguments[1],
        B = [],
        G = 0;
      if (A) {
        let I = A,
          Y = Number(I.length);
        for (let J = 0; J < Y; J++) {
          let W = I[J],
            X;
          if (W instanceof Buffer) X = W;
          else if (ArrayBuffer.isView(W)) X = Buffer.from(W.buffer, W.byteOffset, W.byteLength);
          else if (W instanceof ArrayBuffer) X = Buffer.from(W);
          else if (W instanceof gGA) X = W[wf];
          else X = Buffer.from(typeof W === "string" ? W : String(W));
          G += X.length, B.push(X)
        }
      }
      this[wf] = Buffer.concat(B);
      let Z = Q && Q.type !== void 0 && String(Q.type).toLowerCase();
      if (Z && !/[^\u0020-\u007E]/.test(Z)) this[op1] = Z
    }
    get size() {
      return this[wf].length
    }
    get type() {
      return this[op1]
    }
    text() {
      return Promise.resolve(this[wf].toString())
    }
    arrayBuffer() {
      let A = this[wf],
        Q = A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength);
      return Promise.resolve(Q)
    }
    stream() {
      let A = new Ju6;
      return A._read = function() {}, A.push(this[wf]), A.push(null), A
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
      let I = Math.max(Z - G, 0),
        J = this[wf].slice(G, G + I),
        W = new gGA([], {
          type: arguments[2]
        });
      return W[wf] = J, W
    }
  }
  Object.defineProperties(gGA.prototype, {
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
  Object.defineProperty(gGA.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });

  function ND(A, Q, B) {
    if (Error.call(this, A), this.message = A, this.type = Q, B) this.code = this.errno = B.code;
    Error.captureStackTrace(this, this.constructor)
  }
  ND.prototype = Object.create(Error.prototype);
  ND.prototype.constructor = ND;
  ND.prototype.name = "FetchError";
  var Ql1;
  try {
    Ql1 = (() => {
      throw new Error("Cannot require module " + "encoding");
    })().convert
  } catch (A) {}
  var Nf = Symbol("Body internals"),
    IuB = RT.PassThrough;

  function gF(A) {
    var Q = this,
      B = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      G = B.size;
    let Z = G === void 0 ? 0 : G;
    var I = B.timeout;
    let Y = I === void 0 ? 0 : I;
    if (A == null) A = null;
    else if (VuB(A)) A = Buffer.from(A.toString());
    else if (NwA(A));
    else if (Buffer.isBuffer(A));
    else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") A = Buffer.from(A);
    else if (ArrayBuffer.isView(A)) A = Buffer.from(A.buffer, A.byteOffset, A.byteLength);
    else if (A instanceof RT);
    else A = Buffer.from(String(A));
    if (this[Nf] = {
        body: A,
        disturbed: !1,
        error: null
      }, this.size = Z, this.timeout = Y, A instanceof RT) A.on("error", function(J) {
      let W = J.name === "AbortError" ? J : new ND(`Invalid response body while trying to fetch ${Q.url}: ${J.message}`, "system", J);
      Q[Nf].error = W
    })
  }
  gF.prototype = {
    get body() {
      return this[Nf].body
    },
    get bodyUsed() {
      return this[Nf].disturbed
    },
    arrayBuffer() {
      return fGA.call(this).then(function(A) {
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
      })
    },
    blob() {
      let A = this.headers && this.headers.get("content-type") || "";
      return fGA.call(this).then(function(Q) {
        return Object.assign(new gGA([], {
          type: A.toLowerCase()
        }), {
          [wf]: Q
        })
      })
    },
    json() {
      var A = this;
      return fGA.call(this).then(function(Q) {
        try {
          return JSON.parse(Q.toString())
        } catch (B) {
          return gF.Promise.reject(new ND(`invalid json response body at ${A.url} reason: ${B.message}`, "invalid-json"))
        }
      })
    },
    text() {
      return fGA.call(this).then(function(A) {
        return A.toString()
      })
    },
    buffer() {
      return fGA.call(this)
    },
    textConverted() {
      var A = this;
      return fGA.call(this).then(function(Q) {
        return Wu6(Q, A.headers)
      })
    }
  };
  Object.defineProperties(gF.prototype, {
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
  gF.mixIn = function(A) {
    for (let Q of Object.getOwnPropertyNames(gF.prototype))
      if (!(Q in A)) {
        let B = Object.getOwnPropertyDescriptor(gF.prototype, Q);
        Object.defineProperty(A, Q, B)
      }
  };

  function fGA() {
    var A = this;
    if (this[Nf].disturbed) return gF.Promise.reject(TypeError(`body used already for: ${this.url}`));
    if (this[Nf].disturbed = !0, this[Nf].error) return gF.Promise.reject(this[Nf].error);
    let Q = this.body;
    if (Q === null) return gF.Promise.resolve(Buffer.alloc(0));
    if (NwA(Q)) Q = Q.stream();
    if (Buffer.isBuffer(Q)) return gF.Promise.resolve(Q);
    if (!(Q instanceof RT)) return gF.Promise.resolve(Buffer.alloc(0));
    let B = [],
      G = 0,
      Z = !1;
    return new gF.Promise(function(I, Y) {
      let J;
      if (A.timeout) J = setTimeout(function() {
        Z = !0, Y(new ND(`Response timeout while trying to fetch ${A.url} (over ${A.timeout}ms)`, "body-timeout"))
      }, A.timeout);
      Q.on("error", function(W) {
        if (W.name === "AbortError") Z = !0, Y(W);
        else Y(new ND(`Invalid response body while trying to fetch ${A.url}: ${W.message}`, "system", W))
      }), Q.on("data", function(W) {
        if (Z || W === null) return;
        if (A.size && G + W.length > A.size) {
          Z = !0, Y(new ND(`content size at ${A.url} over limit: ${A.size}`, "max-size"));
          return
        }
        G += W.length, B.push(W)
      }), Q.on("end", function() {
        if (Z) return;
        clearTimeout(J);
        try {
          I(Buffer.concat(B, G))
        } catch (W) {
          Y(new ND(`Could not create Buffer from response body for ${A.url}: ${W.message}`, "system", W))
        }
      })
    })
  }

  function Wu6(A, Q) {
    if (typeof Ql1 !== "function") throw Error("The package `encoding` must be installed to use the textConverted() function");
    let B = Q.get("content-type"),
      G = "utf-8",
      Z, I;
    if (B) Z = /charset=([^;]*)/i.exec(B);
    if (I = A.slice(0, 1024).toString(), !Z && I) Z = /<meta.+?charset=(['"])(.+?)\1/i.exec(I);
    if (!Z && I) {
      if (Z = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(I), !Z) {
        if (Z = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(I), Z) Z.pop()
      }
      if (Z) Z = /charset=(.*)/i.exec(Z.pop())
    }
    if (!Z && I) Z = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(I);
    if (Z) {
      if (G = Z.pop(), G === "gb2312" || G === "gbk") G = "gb18030"
    }
    return Ql1(A, "UTF-8", G).toString()
  }

  function VuB(A) {
    if (typeof A !== "object" || typeof A.append !== "function" || typeof A.delete !== "function" || typeof A.get !== "function" || typeof A.getAll !== "function" || typeof A.has !== "function" || typeof A.set !== "function") return !1;
    return A.constructor.name === "URLSearchParams" || Object.prototype.toString.call(A) === "[object URLSearchParams]" || typeof A.sort === "function"
  }

  function NwA(A) {
    return typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && typeof A.constructor === "function" && typeof A.constructor.name === "string" && /^(Blob|File)$/.test(A.constructor.name) && /^(Blob|File)$/.test(A[Symbol.toStringTag])
  }

  function FuB(A) {
    let Q, B, G = A.body;
    if (A.bodyUsed) throw Error("cannot clone body after it is used");
    if (G instanceof RT && typeof G.getBoundary !== "function") Q = new IuB, B = new IuB, G.pipe(Q), G.pipe(B), A[Nf].body = Q, G = B;
    return G
  }

  function KuB(A) {
    if (A === null) return null;
    else if (typeof A === "string") return "text/plain;charset=UTF-8";
    else if (VuB(A)) return "application/x-www-form-urlencoded;charset=UTF-8";
    else if (NwA(A)) return A.type || null;
    else if (Buffer.isBuffer(A)) return null;
    else if (Object.prototype.toString.call(A) === "[object ArrayBuffer]") return null;
    else if (ArrayBuffer.isView(A)) return null;
    else if (typeof A.getBoundary === "function") return `multipart/form-data;boundary=${A.getBoundary()}`;
    else if (A instanceof RT) return null;
    else return "text/plain;charset=UTF-8"
  }

  function DuB(A) {
    let Q = A.body;
    if (Q === null) return 0;
    else if (NwA(Q)) return Q.size;
    else if (Buffer.isBuffer(Q)) return Q.length;
    else if (Q && typeof Q.getLengthSync === "function") {
      if (Q._lengthRetrievers && Q._lengthRetrievers.length == 0 || Q.hasKnownLength && Q.hasKnownLength()) return Q.getLengthSync();
      return null
    } else return null
  }

  function Xu6(A, Q) {
    let B = Q.body;
    if (B === null) A.end();
    else if (NwA(B)) B.stream().pipe(A);
    else if (Buffer.isBuffer(B)) A.write(B), A.end();
    else B.pipe(A)
  }
  gF.Promise = global.Promise;
  var HuB = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,
    Bl1 = /[^\t\x20-\x7e\x80-\xff]/;

  function wwA(A) {
    if (A = `${A}`, HuB.test(A) || A === "") throw TypeError(`${A} is not a legal HTTP header name`)
  }

  function YuB(A) {
    if (A = `${A}`, Bl1.test(A)) throw TypeError(`${A} is not a legal HTTP header value`)
  }

  function hGA(A, Q) {
    Q = Q.toLowerCase();
    for (let B in A)
      if (B.toLowerCase() === Q) return B;
    return
  }
  var PW = Symbol("map");
  class qM {
    constructor() {
      let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
      if (this[PW] = Object.create(null), A instanceof qM) {
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
      A = `${A}`, wwA(A);
      let Q = hGA(this[PW], A);
      if (Q === void 0) return null;
      return this[PW][Q].join(", ")
    }
    forEach(A) {
      let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0,
        B = Gl1(this),
        G = 0;
      while (G < B.length) {
        var Z = B[G];
        let I = Z[0],
          Y = Z[1];
        A.call(Q, Y, I, this), B = Gl1(this), G++
      }
    }
    set(A, Q) {
      A = `${A}`, Q = `${Q}`, wwA(A), YuB(Q);
      let B = hGA(this[PW], A);
      this[PW][B !== void 0 ? B : A] = [Q]
    }
    append(A, Q) {
      A = `${A}`, Q = `${Q}`, wwA(A), YuB(Q);
      let B = hGA(this[PW], A);
      if (B !== void 0) this[PW][B].push(Q);
      else this[PW][A] = [Q]
    }
    has(A) {
      return A = `${A}`, wwA(A), hGA(this[PW], A) !== void 0
    }
    delete(A) {
      A = `${A}`, wwA(A);
      let Q = hGA(this[PW], A);
      if (Q !== void 0) delete this[PW][Q]
    }
    raw() {
      return this[PW]
    }
    keys() {
      return tp1(this, "key")
    }
    values() {
      return tp1(this, "value")
    } [Symbol.iterator]() {
      return tp1(this, "key+value")
    }
  }
  qM.prototype.entries = qM.prototype[Symbol.iterator];
  Object.defineProperty(qM.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperties(qM.prototype, {
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

  function Gl1(A) {
    let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
    return Object.keys(A[PW]).sort().map(Q === "key" ? function(G) {
      return G.toLowerCase()
    } : Q === "value" ? function(G) {
      return A[PW][G].join(", ")
    } : function(G) {
      return [G.toLowerCase(), A[PW][G].join(", ")]
    })
  }
  var Zl1 = Symbol("internal");

  function tp1(A, Q) {
    let B = Object.create(Il1);
    return B[Zl1] = {
      target: A,
      kind: Q,
      index: 0
    }, B
  }
  var Il1 = Object.setPrototypeOf({
    next() {
      if (!this || Object.getPrototypeOf(this) !== Il1) throw TypeError("Value of `this` is not a HeadersIterator");
      var A = this[Zl1];
      let {
        target: Q,
        kind: B,
        index: G
      } = A, Z = Gl1(Q, B), I = Z.length;
      if (G >= I) return {
        value: void 0,
        done: !0
      };
      return this[Zl1].index = G + 1, {
        value: Z[G],
        done: !1
      }
    }
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
  Object.defineProperty(Il1, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });

  function Vu6(A) {
    let Q = Object.assign({
        __proto__: null
      }, A[PW]),
      B = hGA(A[PW], "Host");
    if (B !== void 0) Q[B] = Q[B][0];
    return Q
  }

  function Fu6(A) {
    let Q = new qM;
    for (let B of Object.keys(A)) {
      if (HuB.test(B)) continue;
      if (Array.isArray(A[B]))
        for (let G of A[B]) {
          if (Bl1.test(G)) continue;
          if (Q[PW][B] === void 0) Q[PW][B] = [G];
          else Q[PW][B].push(G)
        } else if (!Bl1.test(A[B])) Q[PW][B] = [A[B]]
    }
    return Q
  }
  var up = Symbol("Response internals"),
    Ku6 = WuB.STATUS_CODES;
  class wM {
    constructor() {
      let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null,
        Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      gF.call(this, A, Q);
      let B = Q.status || 200,
        G = new qM(Q.headers);
      if (A != null && !G.has("Content-Type")) {
        let Z = KuB(A);
        if (Z) G.append("Content-Type", Z)
      }
      this[up] = {
        url: Q.url,
        status: B,
        statusText: Q.statusText || Ku6[B],
        headers: G,
        counter: Q.counter
      }
    }
    get url() {
      return this[up].url || ""
    }
    get status() {
      return this[up].status
    }
    get ok() {
      return this[up].status >= 200 && this[up].status < 300
    }
    get redirected() {
      return this[up].counter > 0
    }
    get statusText() {
      return this[up].statusText
    }
    get headers() {
      return this[up].headers
    }
    clone() {
      return new wM(FuB(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected
      })
    }
  }
  gF.mixIn(wM.prototype);
  Object.defineProperties(wM.prototype, {
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
  Object.defineProperty(wM.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  var qf = Symbol("Request internals"),
    Du6 = IeA.URL || XuB.URL,
    Hu6 = IeA.parse,
    Cu6 = IeA.format;

  function ep1(A) {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(A)) A = new Du6(A).toString();
    return Hu6(A)
  }
  var Eu6 = "destroy" in RT.Readable.prototype;

  function ZeA(A) {
    return typeof A === "object" && typeof A[qf] === "object"
  }

  function zu6(A) {
    let Q = A && typeof A === "object" && Object.getPrototypeOf(A);
    return !!(Q && Q.constructor.name === "AbortSignal")
  }
  class dp {
    constructor(A) {
      let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        B;
      if (!ZeA(A)) {
        if (A && A.href) B = ep1(A.href);
        else B = ep1(`${A}`);
        A = {}
      } else B = ep1(A.url);
      let G = Q.method || A.method || "GET";
      if (G = G.toUpperCase(), (Q.body != null || ZeA(A) && A.body !== null) && (G === "GET" || G === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body");
      let Z = Q.body != null ? Q.body : ZeA(A) && A.body !== null ? FuB(A) : null;
      gF.call(this, Z, {
        timeout: Q.timeout || A.timeout || 0,
        size: Q.size || A.size || 0
      });
      let I = new qM(Q.headers || A.headers || {});
      if (Z != null && !I.has("Content-Type")) {
        let J = KuB(Z);
        if (J) I.append("Content-Type", J)
      }
      let Y = ZeA(A) ? A.signal : null;
      if ("signal" in Q) Y = Q.signal;
      if (Y != null && !zu6(Y)) throw TypeError("Expected signal to be an instanceof AbortSignal");
      this[qf] = {
        method: G,
        redirect: Q.redirect || A.redirect || "follow",
        headers: I,
        parsedURL: B,
        signal: Y
      }, this.follow = Q.follow !== void 0 ? Q.follow : A.follow !== void 0 ? A.follow : 20, this.compress = Q.compress !== void 0 ? Q.compress : A.compress !== void 0 ? A.compress : !0, this.counter = Q.counter || A.counter || 0, this.agent = Q.agent || A.agent
    }
    get method() {
      return this[qf].method
    }
    get url() {
      return Cu6(this[qf].parsedURL)
    }
    get headers() {
      return this[qf].headers
    }
    get redirect() {
      return this[qf].redirect
    }
    get signal() {
      return this[qf].signal
    }
    clone() {
      return new dp(this)
    }
  }
  gF.mixIn(dp.prototype);
  Object.defineProperty(dp.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: !1,
    enumerable: !1,
    configurable: !0
  });
  Object.defineProperties(dp.prototype, {
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

  function Uu6(A) {
    let Q = A[qf].parsedURL,
      B = new qM(A[qf].headers);
    if (!B.has("Accept")) B.set("Accept", "*/*");
    if (!Q.protocol || !Q.hostname) throw TypeError("Only absolute URLs are supported");
    if (!/^https?:$/.test(Q.protocol)) throw TypeError("Only HTTP(S) protocols are supported");
    if (A.signal && A.body instanceof RT.Readable && !Eu6) throw Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    let G = null;
    if (A.body == null && /^(POST|PUT)$/i.test(A.method)) G = "0";
    if (A.body != null) {
      let I = DuB(A);
      if (typeof I === "number") G = String(I)
    }
    if (G) B.set("Content-Length", G);
    if (!B.has("User-Agent")) B.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    if (A.compress && !B.has("Accept-Encoding")) B.set("Accept-Encoding", "gzip,deflate");
    let Z = A.agent;
    if (typeof Z === "function") Z = Z(Q);
    return Object.assign({}, Q, {
      method: A.method,
      headers: Vu6(B),
      agent: Z
    })
  }

  function uGA(A) {
    Error.call(this, A), this.type = "aborted", this.message = A, Error.captureStackTrace(this, this.constructor)
  }
  uGA.prototype = Object.create(Error.prototype);
  uGA.prototype.constructor = uGA;
  uGA.prototype.name = "AbortError";
  var qwA = IeA.URL || XuB.URL,
    JuB = RT.PassThrough,
    $u6 = function(Q, B) {
      let G = new qwA(B).hostname,
        Z = new qwA(Q).hostname;
      return G === Z || G[G.length - Z.length - 1] === "." && G.endsWith(Z)
    },
    wu6 = function(Q, B) {
      let G = new qwA(B).protocol,
        Z = new qwA(Q).protocol;
      return G === Z
    };

  function mp(A, Q) {
    if (!mp.Promise) throw Error("native promise missing, set fetch.Promise to your favorite alternative");
    return gF.Promise = mp.Promise, new mp.Promise(function(B, G) {
      let Z = new dp(A, Q),
        I = Uu6(Z),
        Y = (I.protocol === "https:" ? Yu6 : WuB).request,
        J = Z.signal,
        W = null,
        X = function() {
          let C = new uGA("The user aborted a request.");
          if (G(C), Z.body && Z.body instanceof RT.Readable) Al1(Z.body, C);
          if (!W || !W.body) return;
          W.body.emit("error", C)
        };
      if (J && J.aborted) {
        X();
        return
      }
      let V = function() {
          X(), D()
        },
        F = Y(I),
        K;
      if (J) J.addEventListener("abort", V);

      function D() {
        if (F.abort(), J) J.removeEventListener("abort", V);
        clearTimeout(K)
      }
      if (Z.timeout) F.once("socket", function(H) {
        K = setTimeout(function() {
          G(new ND(`network timeout at: ${Z.url}`, "request-timeout")), D()
        }, Z.timeout)
      });
      if (F.on("error", function(H) {
          if (G(new ND(`request to ${Z.url} failed, reason: ${H.message}`, "system", H)), W && W.body) Al1(W.body, H);
          D()
        }), qu6(F, function(H) {
          if (J && J.aborted) return;
          if (W && W.body) Al1(W.body, H)
        }), parseInt(process.version.substring(1)) < 14) F.on("socket", function(H) {
        H.addListener("close", function(C) {
          let E = H.listenerCount("data") > 0;
          if (W && E && !C && !(J && J.aborted)) {
            let U = Error("Premature close");
            U.code = "ERR_STREAM_PREMATURE_CLOSE", W.body.emit("error", U)
          }
        })
      });
      F.on("response", function(H) {
        clearTimeout(K);
        let C = Fu6(H.headers);
        if (mp.isRedirect(H.statusCode)) {
          let N = C.get("Location"),
            R = null;
          try {
            R = N === null ? null : new qwA(N, Z.url).toString()
          } catch (T) {
            if (Z.redirect !== "manual") {
              G(new ND(`uri requested responds with an invalid redirect URL: ${N}`, "invalid-redirect")), D();
              return
            }
          }
          switch (Z.redirect) {
            case "error":
              G(new ND(`uri requested responds with a redirect, redirect mode is set to error: ${Z.url}`, "no-redirect")), D();
              return;
            case "manual":
              if (R !== null) try {
                C.set("Location", R)
              } catch (y) {
                G(y)
              }
              break;
            case "follow":
              if (R === null) break;
              if (Z.counter >= Z.follow) {
                G(new ND(`maximum redirect reached at: ${Z.url}`, "max-redirect")), D();
                return
              }
              let T = {
                headers: new qM(Z.headers),
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
              if (!$u6(Z.url, R) || !wu6(Z.url, R))
                for (let y of ["authorization", "www-authenticate", "cookie", "cookie2"]) T.headers.delete(y);
              if (H.statusCode !== 303 && Z.body && DuB(Z) === null) {
                G(new ND("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), D();
                return
              }
              if (H.statusCode === 303 || (H.statusCode === 301 || H.statusCode === 302) && Z.method === "POST") T.method = "GET", T.body = void 0, T.headers.delete("content-length");
              B(mp(new dp(R, T))), D();
              return
          }
        }
        H.once("end", function() {
          if (J) J.removeEventListener("abort", V)
        });
        let E = H.pipe(new JuB),
          U = {
            url: Z.url,
            status: H.statusCode,
            statusText: H.statusMessage,
            headers: C,
            size: Z.size,
            timeout: Z.timeout,
            counter: Z.counter
          },
          q = C.get("Content-Encoding");
        if (!Z.compress || Z.method === "HEAD" || q === null || H.statusCode === 204 || H.statusCode === 304) {
          W = new wM(E, U), B(W);
          return
        }
        let w = {
          flush: He.Z_SYNC_FLUSH,
          finishFlush: He.Z_SYNC_FLUSH
        };
        if (q == "gzip" || q == "x-gzip") {
          E = E.pipe(He.createGunzip(w)), W = new wM(E, U), B(W);
          return
        }
        if (q == "deflate" || q == "x-deflate") {
          let N = H.pipe(new JuB);
          N.once("data", function(R) {
            if ((R[0] & 15) === 8) E = E.pipe(He.createInflate());
            else E = E.pipe(He.createInflateRaw());
            W = new wM(E, U), B(W)
          }), N.on("end", function() {
            if (!W) W = new wM(E, U), B(W)
          });
          return
        }
        if (q == "br" && typeof He.createBrotliDecompress === "function") {
          E = E.pipe(He.createBrotliDecompress()), W = new wM(E, U), B(W);
          return
        }
        W = new wM(E, U), B(W)
      }), Xu6(F, Z)
    })
  }

  function qu6(A, Q) {
    let B;
    A.on("socket", function(G) {
      B = G
    }), A.on("response", function(G) {
      let Z = G.headers;
      if (Z["transfer-encoding"] === "chunked" && !Z["content-length"]) G.once("close", function(I) {
        if (B && B.listenerCount("data") > 0 && !I) {
          let J = Error("Premature close");
          J.code = "ERR_STREAM_PREMATURE_CLOSE", Q(J)
        }
      })
    })
  }

  function Al1(A, Q) {
    if (A.destroy) A.destroy(Q);
    else A.emit("error", Q), A.end()
  }
  mp.isRedirect = function(A) {
    return A === 301 || A === 302 || A === 303 || A === 307 || A === 308
  };
  mp.Promise = global.Promise;
  CuB.exports = TT = mp;
  Object.defineProperty(TT, "__esModule", {
    value: !0
  });
  TT.default = TT;
  TT.Headers = qM;
  TT.Request = dp;
  TT.Response = wM;
  TT.FetchError = ND;
  TT.AbortError = uGA
})
// @from(Start 7591229, End 7591741)
zuB = z((K4G, EuB) => {
  var e_ = (A) => A !== null && typeof A === "object" && typeof A.pipe === "function";
  e_.writable = (A) => e_(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object";
  e_.readable = (A) => e_(A) && A.readable !== !1 && typeof A._read === "function" && typeof A._readableState === "object";
  e_.duplex = (A) => e_.writable(A) && e_.readable(A);
  e_.transform = (A) => e_.duplex(A) && typeof A._transform === "function";
  EuB.exports = e_
})
// @from(Start 7591747, End 7594573)
UuB = z((D4G, Nu6) => {
  Nu6.exports = {
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
// @from(Start 7594579, End 7594703)
quB = z(($uB) => {
  Object.defineProperty($uB, "__esModule", {
    value: !0
  });
  $uB.pkg = void 0;
  $uB.pkg = UuB()
})