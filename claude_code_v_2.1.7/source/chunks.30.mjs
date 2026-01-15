
// @from(Ln 76176, Col 4)
Oq = U((cNQ) => {
  var Rs4 = sS1(),
    _s4 = (A, Q, B = (G) => G) => A,
    js4 = (A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    },
    Ts4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) mNA.warn(taA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") mNA.warn(taA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    },
    gNA = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) mNA.warn(taA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    },
    Ps4 = Math.ceil(340282346638528860000000000000000000000),
    saA = (A) => {
      let Q = gNA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > Ps4) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    },
    uNA = (A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    },
    Ss4 = uNA,
    eS1 = (A) => Bx1(A, 32),
    Ax1 = (A) => Bx1(A, 16),
    Qx1 = (A) => Bx1(A, 8),
    Bx1 = (A, Q) => {
      let B = uNA(A);
      if (B !== void 0 && xs4(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    },
    xs4 = (A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    },
    ys4 = (A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    },
    bNQ = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    },
    vs4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return mNA.warn(taA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    },
    ks4 = (A) => {
      if (A === null || A === void 0) return;
      let Q = bNQ(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    },
    Gx1 = (A) => {
      if (typeof A == "string") return gNA(oZA(A));
      return gNA(A)
    },
    bs4 = Gx1,
    fNQ = (A) => {
      if (typeof A == "string") return saA(oZA(A));
      return saA(A)
    },
    fs4 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    oZA = (A) => {
      let Q = A.match(fs4);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    },
    Zx1 = (A) => {
      if (typeof A == "string") return hNQ(A);
      return gNA(A)
    },
    hs4 = Zx1,
    gs4 = Zx1,
    us4 = (A) => {
      if (typeof A == "string") return hNQ(A);
      return saA(A)
    },
    hNQ = (A) => {
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
    gNQ = (A) => {
      if (typeof A === "string") return uNA(oZA(A));
      return uNA(A)
    },
    ms4 = gNQ,
    ds4 = (A) => {
      if (typeof A === "string") return eS1(oZA(A));
      return eS1(A)
    },
    nZA = (A) => {
      if (typeof A === "string") return Ax1(oZA(A));
      return Ax1(A)
    },
    uNQ = (A) => {
      if (typeof A === "string") return Qx1(oZA(A));
      return Qx1(A)
    },
    taA = (A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    },
    mNA = {
      warn: console.warn
    },
    cs4 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    Yx1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function ps4(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      Y = A.getUTCHours(),
      J = A.getUTCMinutes(),
      X = A.getUTCSeconds(),
      I = Z < 10 ? `0${Z}` : `${Z}`,
      D = Y < 10 ? `0${Y}` : `${Y}`,
      W = J < 10 ? `0${J}` : `${J}`,
      K = X < 10 ? `0${X}` : `${X}`;
    return `${cs4[G]}, ${I} ${Yx1[B]} ${Q} ${D}:${W}:${K} GMT`
  }
  var ls4 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    is4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = ls4.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, Y, J, X, I, D] = Q, W = nZA(aZA(G)), K = Fv(Z, "month", 1, 12), V = Fv(Y, "day", 1, 31);
      return hNA(W, K, V, {
        hours: J,
        minutes: X,
        seconds: I,
        fractionalMilliseconds: D
      })
    },
    ns4 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    as4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = ns4.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, Y, J, X, I, D, W] = Q, K = nZA(aZA(G)), V = Fv(Z, "month", 1, 12), F = Fv(Y, "day", 1, 31), H = hNA(K, V, F, {
        hours: J,
        minutes: X,
        seconds: I,
        fractionalMilliseconds: D
      });
      if (W.toUpperCase() != "Z") H.setTime(H.getTime() - Xt4(W));
      return H
    },
    os4 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    rs4 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    ss4 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    ts4 = (A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = os4.exec(A);
      if (Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return hNA(nZA(aZA(Y)), tS1(Z), Fv(G, "day", 1, 31), {
          hours: J,
          minutes: X,
          seconds: I,
          fractionalMilliseconds: D
        })
      }
      if (Q = rs4.exec(A), Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return Bt4(hNA(At4(Y), tS1(Z), Fv(G, "day", 1, 31), {
          hours: J,
          minutes: X,
          seconds: I,
          fractionalMilliseconds: D
        }))
      }
      if (Q = ss4.exec(A), Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return hNA(nZA(aZA(D)), tS1(G), Fv(Z.trimLeft(), "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: X,
          fractionalMilliseconds: I
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    },
    es4 = (A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = Gx1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    },
    hNA = (A, Q, B, G) => {
      let Z = Q - 1;
      return Zt4(A, Z, B), new Date(Date.UTC(A, Z, B, Fv(G.hours, "hour", 0, 23), Fv(G.minutes, "minute", 0, 59), Fv(G.seconds, "seconds", 0, 60), Jt4(G.fractionalMilliseconds)))
    },
    At4 = (A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + nZA(aZA(A));
      if (B < Q) return B + 100;
      return B
    },
    Qt4 = 1576800000000,
    Bt4 = (A) => {
      if (A.getTime() - new Date().getTime() > Qt4) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    },
    tS1 = (A) => {
      let Q = Yx1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    },
    Gt4 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    Zt4 = (A, Q, B) => {
      let G = Gt4[Q];
      if (Q === 1 && Yt4(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${Yx1[Q]} in ${A}: ${B}`)
    },
    Yt4 = (A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    },
    Fv = (A, Q, B, G) => {
      let Z = uNQ(aZA(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    },
    Jt4 = (A) => {
      if (A === null || A === void 0) return 0;
      return fNQ("0." + A) * 1000
    },
    Xt4 = (A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    },
    aZA = (A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    },
    Y0A = function (Q) {
      return Object.assign(new String(Q), {
        deserializeJSON() {
          return JSON.parse(String(Q))
        },
        toString() {
          return String(Q)
        },
        toJSON() {
          return String(Q)
        }
      })
    };
  Y0A.from = (A) => {
    if (A && typeof A === "object" && (A instanceof Y0A || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return Y0A(String(A));
    return Y0A(JSON.stringify(A))
  };
  Y0A.fromObject = Y0A.from;

  function It4(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  var Jx1 = "(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[ne|u?r]?s?day)?",
    Xx1 = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)",
    Ix1 = "(\\d?\\d):(\\d{2}):(\\d{2})(?:\\.(\\d+))?",
    mNQ = "(\\d?\\d)",
    dNQ = "(\\d{4})",
    Dt4 = new RegExp(/^(\d{4})-(\d\d)-(\d\d)[tT](\d\d):(\d\d):(\d\d)(\.(\d+))?(([-+]\d\d:\d\d)|[zZ])$/),
    Wt4 = new RegExp(`^${Jx1}, ${mNQ} ${Xx1} ${dNQ} ${Ix1} GMT$`),
    Kt4 = new RegExp(`^${Jx1}, ${mNQ}-${Xx1}-(\\d\\d) ${Ix1} GMT$`),
    Vt4 = new RegExp(`^${Jx1} ${Xx1} ( [1-9]|\\d\\d) ${Ix1} ${dNQ}$`),
    Ft4 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    Ht4 = (A) => {
      if (A == null) return;
      let Q = NaN;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") {
        if (!/^-?\d*\.?\d+$/.test(A)) throw TypeError("parseEpochTimestamp - numeric string invalid.");
        Q = Number.parseFloat(A)
      } else if (typeof A === "object" && A.tag === 1) Q = A.value;
      if (isNaN(Q) || Math.abs(Q) === 1 / 0) throw TypeError("Epoch timestamps must be valid finite numbers.");
      return new Date(Math.round(Q * 1000))
    },
    Et4 = (A) => {
      if (A == null) return;
      if (typeof A !== "string") throw TypeError("RFC3339 timestamps must be strings");
      let Q = Dt4.exec(A);
      if (!Q) throw TypeError(`Invalid RFC3339 timestamp format ${A}`);
      let [, B, G, Z, Y, J, X, , I, D] = Q;
      dg(G, 1, 12), dg(Z, 1, 31), dg(Y, 0, 23), dg(J, 0, 59), dg(X, 0, 60);
      let W = new Date(Date.UTC(Number(B), Number(G) - 1, Number(Z), Number(Y), Number(J), Number(X), Number(I) ? Math.round(parseFloat(`0.${I}`) * 1000) : 0));
      if (W.setUTCFullYear(Number(B)), D.toUpperCase() != "Z") {
        let [, K, V, F] = /([+-])(\d\d):(\d\d)/.exec(D) || [void 0, "+", 0, 0], H = K === "-" ? 1 : -1;
        W.setTime(W.getTime() + H * (Number(V) * 60 * 60 * 1000 + Number(F) * 60 * 1000))
      }
      return W
    },
    zt4 = (A) => {
      if (A == null) return;
      if (typeof A !== "string") throw TypeError("RFC7231 timestamps must be strings.");
      let Q, B, G, Z, Y, J, X, I;
      if (I = Wt4.exec(A))[, Q, B, G, Z, Y, J, X] = I;
      else if (I = Kt4.exec(A))[, Q, B, G, Z, Y, J, X] = I, G = (Number(G) + 1900).toString();
      else if (I = Vt4.exec(A))[, B, Q, Z, Y, J, X, G] = I;
      if (G && J) {
        let D = Date.UTC(Number(G), Ft4.indexOf(B), Number(Q), Number(Z), Number(Y), Number(J), X ? Math.round(parseFloat(`0.${X}`) * 1000) : 0);
        dg(Q, 1, 31), dg(Z, 0, 23), dg(Y, 0, 59), dg(J, 0, 60);
        let W = new Date(D);
        return W.setUTCFullYear(Number(G)), W
      }
      throw TypeError(`Invalid RFC7231 date-time value ${A}.`)
    };

  function dg(A, Q, B) {
    let G = Number(A);
    if (G < Q || G > B) throw Error(`Value ${G} out of range [${Q}, ${B}]`)
  }

  function $t4(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      Y = "";
    for (let J = 0; J < G.length; J++) {
      if (Y === "") Y = G[J];
      else Y += Q + G[J];
      if ((J + 1) % B === 0) Z.push(Y), Y = ""
    }
    if (Y !== "") Z.push(Y);
    return Z
  }
  var Ct4 = (A) => {
      let Q = A.length,
        B = [],
        G = !1,
        Z = void 0,
        Y = 0;
      for (let J = 0; J < Q; ++J) {
        let X = A[J];
        switch (X) {
          case '"':
            if (Z !== "\\") G = !G;
            break;
          case ",":
            if (!G) B.push(A.slice(Y, J)), Y = J + 1;
            break
        }
        Z = X
      }
      return B.push(A.slice(Y)), B.map((J) => {
        J = J.trim();
        let X = J.length;
        if (X < 2) return J;
        if (J[0] === '"' && J[X - 1] === '"') J = J.slice(1, X - 1);
        return J.replace(/\\"/g, '"')
      })
    },
    kNQ = /^-?\d*(\.\d+)?$/;
  class eaA {
    string;
    type;
    constructor(A, Q) {
      if (this.string = A, this.type = Q, !kNQ.test(A)) throw Error('@smithy/core/serde - NumericValue must only contain [0-9], at most one decimal point ".", and an optional negation prefix "-".')
    }
    toString() {
      return this.string
    }
    static[Symbol.hasInstance](A) {
      if (!A || typeof A !== "object") return !1;
      let Q = A;
      return eaA.prototype.isPrototypeOf(A) || Q.type === "bigDecimal" && kNQ.test(Q.string)
    }
  }

  function Ut4(A) {
    return new eaA(String(A), "bigDecimal")
  }
  Object.defineProperty(cNQ, "generateIdempotencyToken", {
    enumerable: !0,
    get: function () {
      return Rs4.v4
    }
  });
  cNQ.LazyJsonString = Y0A;
  cNQ.NumericValue = eaA;
  cNQ._parseEpochTimestamp = Ht4;
  cNQ._parseRfc3339DateTimeWithOffset = Et4;
  cNQ._parseRfc7231DateTime = zt4;
  cNQ.copyDocumentWithTransform = _s4;
  cNQ.dateToUtcString = ps4;
  cNQ.expectBoolean = Ts4;
  cNQ.expectByte = Qx1;
  cNQ.expectFloat32 = saA;
  cNQ.expectInt = Ss4;
  cNQ.expectInt32 = eS1;
  cNQ.expectLong = uNA;
  cNQ.expectNonNull = ys4;
  cNQ.expectNumber = gNA;
  cNQ.expectObject = bNQ;
  cNQ.expectShort = Ax1;
  cNQ.expectString = vs4;
  cNQ.expectUnion = ks4;
  cNQ.handleFloat = hs4;
  cNQ.limitedParseDouble = Zx1;
  cNQ.limitedParseFloat = gs4;
  cNQ.limitedParseFloat32 = us4;
  cNQ.logger = mNA;
  cNQ.nv = Ut4;
  cNQ.parseBoolean = js4;
  cNQ.parseEpochTimestamp = es4;
  cNQ.parseRfc3339DateTime = is4;
  cNQ.parseRfc3339DateTimeWithOffset = as4;
  cNQ.parseRfc7231DateTime = ts4;
  cNQ.quoteHeader = It4;
  cNQ.splitEvery = $t4;
  cNQ.splitHeader = Ct4;
  cNQ.strictParseByte = uNQ;
  cNQ.strictParseDouble = Gx1;
  cNQ.strictParseFloat = bs4;
  cNQ.strictParseFloat32 = fNQ;
  cNQ.strictParseInt = ms4;
  cNQ.strictParseInt32 = ds4;
  cNQ.strictParseLong = gNQ;
  cNQ.strictParseShort = nZA
})
// @from(Ln 76672, Col 4)
pNQ = U((Ie4) => {
  var Xe4 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  Ie4.isArrayBuffer = Xe4
})
// @from(Ln 76676, Col 4)
Wx1 = U((Fe4) => {
  var We4 = pNQ(),
    Dx1 = NA("buffer"),
    Ke4 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!We4.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Dx1.Buffer.from(A, Q, B)
    },
    Ve4 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Dx1.Buffer.from(A, Q) : Dx1.Buffer.from(A)
    };
  Fe4.fromArrayBuffer = Ke4;
  Fe4.fromString = Ve4
})
// @from(Ln 76690, Col 4)
nNQ = U((lNQ) => {
  Object.defineProperty(lNQ, "__esModule", {
    value: !0
  });
  lNQ.fromBase64 = void 0;
  var ze4 = Wx1(),
    $e4 = /^[A-Za-z0-9+/]*={0,2}$/,
    Ce4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!$e4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, ze4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  lNQ.fromBase64 = Ce4
})
// @from(Ln 76705, Col 4)
rNQ = U((aNQ) => {
  Object.defineProperty(aNQ, "__esModule", {
    value: !0
  });
  aNQ.toBase64 = void 0;
  var Ue4 = Wx1(),
    qe4 = oG(),
    Ne4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, qe4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, Ue4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  aNQ.toBase64 = Ne4
})
// @from(Ln 76721, Col 4)
Kx1 = U((dNA) => {
  var sNQ = nNQ(),
    tNQ = rNQ();
  Object.keys(sNQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(dNA, A)) Object.defineProperty(dNA, A, {
      enumerable: !0,
      get: function () {
        return sNQ[A]
      }
    })
  });
  Object.keys(tNQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(dNA, A)) Object.defineProperty(dNA, A, {
      enumerable: !0,
      get: function () {
        return tNQ[A]
      }
    })
  })
})
// @from(Ln 76741, Col 4)
QwQ = U((we4) => {
  var eNQ = oG();
  class AwQ {
    marshaller;
    serializer;
    deserializer;
    serdeContext;
    defaultContentType;
    constructor({
      marshaller: A,
      serializer: Q,
      deserializer: B,
      serdeContext: G,
      defaultContentType: Z
    }) {
      this.marshaller = A, this.serializer = Q, this.deserializer = B, this.serdeContext = G, this.defaultContentType = Z
    }
    async serializeEventStream({
      eventStream: A,
      requestSchema: Q,
      initialRequest: B
    }) {
      let G = this.marshaller,
        Z = Q.getEventStreamMember(),
        Y = Q.getMemberSchema(Z),
        J = this.serializer,
        X = this.defaultContentType,
        I = Symbol("initialRequestMarker"),
        D = {
          async * [Symbol.asyncIterator]() {
            if (B) {
              let W = {
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
                  value: X
                }
              };
              J.write(Q, B);
              let K = J.flush();
              yield {
                [I]: !0, headers: W, body: K
              }
            }
            for await (let W of A) yield W
          }
        };
      return G.serialize(D, (W) => {
        if (W[I]) return {
          headers: W.headers,
          body: W.body
        };
        let K = Object.keys(W).find(($) => {
            return $ !== "__type"
          }) ?? "",
          {
            additionalHeaders: V,
            body: F,
            eventType: H,
            explicitPayloadContentType: E
          } = this.writeEventBody(K, Y, W);
        return {
          headers: {
            ":event-type": {
              type: "string",
              value: H
            },
            ":message-type": {
              type: "string",
              value: "event"
            },
            ":content-type": {
              type: "string",
              value: E ?? X
            },
            ...V
          },
          body: F
        }
      })
    }
    async deserializeEventStream({
      response: A,
      responseSchema: Q,
      initialResponseContainer: B
    }) {
      let G = this.marshaller,
        Z = Q.getEventStreamMember(),
        J = Q.getMemberSchema(Z).getMemberSchemas(),
        X = Symbol("initialResponseMarker"),
        I = G.deserialize(A.body, async (K) => {
          let V = Object.keys(K).find((H) => {
              return H !== "__type"
            }) ?? "",
            F = K[V].body;
          if (V === "initial-response") {
            let H = await this.deserializer.read(Q, F);
            return delete H[Z], {
              [X]: !0,
              ...H
            }
          } else if (V in J) {
            let H = J[V];
            if (H.isStructSchema()) {
              let E = {},
                z = !1;
              for (let [$, O] of H.structIterator()) {
                let {
                  eventHeader: L,
                  eventPayload: M
                } = O.getMergedTraits();
                if (z = z || Boolean(L || M), M) {
                  if (O.isBlobSchema()) E[$] = F;
                  else if (O.isStringSchema()) E[$] = (this.serdeContext?.utf8Encoder ?? eNQ.toUtf8)(F);
                  else if (O.isStructSchema()) E[$] = await this.deserializer.read(O, F)
                } else if (L) {
                  let _ = K[V].headers[$]?.value;
                  if (_ != null)
                    if (O.isNumericSchema())
                      if (_ && typeof _ === "object" && "bytes" in _) E[$] = BigInt(_.toString());
                      else E[$] = Number(_);
                  else E[$] = _
                }
              }
              if (z) return {
                [V]: E
              }
            }
            return {
              [V]: await this.deserializer.read(H, F)
            }
          } else return {
            $unknown: K
          }
        }),
        D = I[Symbol.asyncIterator](),
        W = await D.next();
      if (W.done) return I;
      if (W.value?.[X]) {
        if (!Q) throw Error("@smithy::core/protocols - initial-response event encountered in event stream but no response schema given.");
        for (let [K, V] of Object.entries(W.value)) B[K] = V
      }
      return {
        async * [Symbol.asyncIterator]() {
          if (!W?.value?.[X]) yield W.value;
          while (!0) {
            let {
              done: K,
              value: V
            } = await D.next();
            if (K) break;
            yield V
          }
        }
      }
    }
    writeEventBody(A, Q, B) {
      let G = this.serializer,
        Z = A,
        Y = null,
        J, X = (() => {
          return Q.getSchema()[4].includes(A)
        })(),
        I = {};
      if (!X) {
        let [K, V] = B[A];
        Z = K, G.write(15, V)
      } else {
        let K = Q.getMemberSchema(A);
        if (K.isStructSchema()) {
          for (let [V, F] of K.structIterator()) {
            let {
              eventHeader: H,
              eventPayload: E
            } = F.getMergedTraits();
            if (E) {
              Y = V;
              break
            } else if (H) {
              let z = B[A][V],
                $ = "binary";
              if (F.isNumericSchema())
                if (-2147483648 <= z && z <= 2147483647) $ = "integer";
                else $ = "long";
              else if (F.isTimestampSchema()) $ = "timestamp";
              else if (F.isStringSchema()) $ = "string";
              else if (F.isBooleanSchema()) $ = "boolean";
              if (z != null) I[V] = {
                type: $,
                value: z
              }, delete B[A][V]
            }
          }
          if (Y !== null) {
            let V = K.getMemberSchema(Y);
            if (V.isBlobSchema()) J = "application/octet-stream";
            else if (V.isStringSchema()) J = "text/plain";
            G.write(V, B[A][Y])
          } else G.write(K, B[A])
        } else throw Error("@smithy/core/event-streams - non-struct member not supported in event stream union.")
      }
      let D = G.flush();
      return {
        body: typeof D === "string" ? (this.serdeContext?.utf8Decoder ?? eNQ.fromUtf8)(D) : D,
        eventType: Z,
        explicitPayloadContentType: J,
        additionalHeaders: I
      }
    }
  }
  we4.EventStreamSerde = AwQ
})
// @from(Ln 76960, Col 4)
Mq = U((Me4) => {
  var AoA = iS1(),
    aM = WX(),
    nM = Oq(),
    cNA = TNA(),
    QoA = Kx1(),
    Vx1 = oG(),
    J0A = async (A = new Uint8Array, Q) => {
      if (A instanceof Uint8Array) return AoA.Uint8ArrayBlobAdapter.mutate(A);
      if (!A) return AoA.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
      let B = Q.streamCollector(A);
      return AoA.Uint8ArrayBlobAdapter.mutate(await B)
    };

  function pNA(A) {
    return encodeURIComponent(A).replace(/[!'()*]/g, function (Q) {
      return "%" + Q.charCodeAt(0).toString(16).toUpperCase()
    })
  }
  class rZA {
    serdeContext;
    setSerdeContext(A) {
      this.serdeContext = A
    }
  }
  class BoA extends rZA {
    options;
    constructor(A) {
      super();
      this.options = A
    }
    getRequestType() {
      return cNA.HttpRequest
    }
    getResponseType() {
      return cNA.HttpResponse
    }
    setSerdeContext(A) {
      if (this.serdeContext = A, this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A), this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(A)
    }
    updateServiceEndpoint(A, Q) {
      if ("url" in Q) {
        if (A.protocol = Q.url.protocol, A.hostname = Q.url.hostname, A.port = Q.url.port ? Number(Q.url.port) : void 0, A.path = Q.url.pathname, A.fragment = Q.url.hash || void 0, A.username = Q.url.username || void 0, A.password = Q.url.password || void 0, !A.query) A.query = {};
        for (let [B, G] of Q.url.searchParams.entries()) A.query[B] = G;
        return A
      } else return A.protocol = Q.protocol, A.hostname = Q.hostname, A.port = Q.port ? Number(Q.port) : void 0, A.path = Q.path, A.query = {
        ...Q.query
      }, A
    }
    setHostPrefix(A, Q, B) {
      let G = aM.NormalizedSchema.of(Q.input),
        Z = aM.translateTraits(Q.traits ?? {});
      if (Z.endpoint) {
        let Y = Z.endpoint?.[0];
        if (typeof Y === "string") {
          let J = [...G.structIterator()].filter(([, X]) => X.getMergedTraits().hostLabel);
          for (let [X] of J) {
            let I = B[X];
            if (typeof I !== "string") throw Error(`@smithy/core/schema - ${X} in input must be a string as hostLabel.`);
            Y = Y.replace(`{${X}}`, I)
          }
          A.hostname = Y + A.hostname
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
      requestSchema: Q,
      initialRequest: B
    }) {
      return (await this.loadEventStreamCapability()).serializeEventStream({
        eventStream: A,
        requestSchema: Q,
        initialRequest: B
      })
    }
    async deserializeEventStream({
      response: A,
      responseSchema: Q,
      initialResponseContainer: B
    }) {
      return (await this.loadEventStreamCapability()).deserializeEventStream({
        response: A,
        responseSchema: Q,
        initialResponseContainer: B
      })
    }
    async loadEventStreamCapability() {
      let {
        EventStreamSerde: A
      } = await Promise.resolve().then(() => c(QwQ()));
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
    async deserializeHttpMessage(A, Q, B, G, Z) {
      return []
    }
    getEventStreamMarshaller() {
      let A = this.serdeContext;
      if (!A.eventStreamMarshaller) throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
      return A.eventStreamMarshaller
    }
  }
  class BwQ extends BoA {
    async serializeRequest(A, Q, B) {
      let G = {
          ...Q ?? {}
        },
        Z = this.serializer,
        Y = {},
        J = {},
        X = await B.endpoint(),
        I = aM.NormalizedSchema.of(A?.input),
        D = I.getSchema(),
        W = !1,
        K, V = new cNA.HttpRequest({
          protocol: "",
          hostname: "",
          port: void 0,
          path: "",
          fragment: void 0,
          query: Y,
          headers: J,
          body: void 0
        });
      if (X) {
        this.updateServiceEndpoint(V, X), this.setHostPrefix(V, A, G);
        let F = aM.translateTraits(A.traits);
        if (F.http) {
          V.method = F.http[0];
          let [H, E] = F.http[1].split("?");
          if (V.path == "/") V.path = H;
          else V.path += H;
          let z = new URLSearchParams(E ?? "");
          Object.assign(Y, Object.fromEntries(z))
        }
      }
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits() ?? {},
          z = G[F];
        if (z == null && !H.isIdempotencyToken()) continue;
        if (E.httpPayload) {
          if (H.isStreaming())
            if (H.isStructSchema()) {
              if (G[F]) K = await this.serializeEventStream({
                eventStream: G[F],
                requestSchema: I
              })
            } else K = z;
          else Z.write(H, z), K = Z.flush();
          delete G[F]
        } else if (E.httpLabel) {
          Z.write(H, z);
          let $ = Z.flush();
          if (V.path.includes(`{${F}+}`)) V.path = V.path.replace(`{${F}+}`, $.split("/").map(pNA).join("/"));
          else if (V.path.includes(`{${F}}`)) V.path = V.path.replace(`{${F}}`, pNA($));
          delete G[F]
        } else if (E.httpHeader) Z.write(H, z), J[E.httpHeader.toLowerCase()] = String(Z.flush()), delete G[F];
        else if (typeof E.httpPrefixHeaders === "string") {
          for (let [$, O] of Object.entries(z)) {
            let L = E.httpPrefixHeaders + $;
            Z.write([H.getValueSchema(), {
              httpHeader: L
            }], O), J[L.toLowerCase()] = Z.flush()
          }
          delete G[F]
        } else if (E.httpQuery || E.httpQueryParams) this.serializeQuery(H, z, Y), delete G[F];
        else W = !0
      }
      if (W && G) Z.write(D, G), K = Z.flush();
      return V.headers = J, V.query = Y, V.body = K, V
    }
    serializeQuery(A, Q, B) {
      let G = this.serializer,
        Z = A.getMergedTraits();
      if (Z.httpQueryParams) {
        for (let [Y, J] of Object.entries(Q))
          if (!(Y in B)) {
            let X = A.getValueSchema();
            Object.assign(X.getMergedTraits(), {
              ...Z,
              httpQuery: Y,
              httpQueryParams: void 0
            }), this.serializeQuery(X, J, B)
          } return
      }
      if (A.isListSchema()) {
        let Y = !!A.getMergedTraits().sparse,
          J = [];
        for (let X of Q) {
          G.write([A.getValueSchema(), Z], X);
          let I = G.flush();
          if (Y || I !== void 0) J.push(I)
        }
        B[Z.httpQuery] = J
      } else G.write([A, Z], Q), B[Z.httpQuery] = G.flush()
    }
    async deserializeResponse(A, Q, B) {
      let G = this.deserializer,
        Z = aM.NormalizedSchema.of(A.output),
        Y = {};
      if (B.statusCode >= 300) {
        let X = await J0A(B.body, Q);
        if (X.byteLength > 0) Object.assign(Y, await G.read(15, X));
        throw await this.handleError(A, Q, B, Y, this.deserializeMetadata(B)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.")
      }
      for (let X in B.headers) {
        let I = B.headers[X];
        delete B.headers[X], B.headers[X.toLowerCase()] = I
      }
      let J = await this.deserializeHttpMessage(Z, Q, B, Y);
      if (J.length) {
        let X = await J0A(B.body, Q);
        if (X.byteLength > 0) {
          let I = await G.read(Z, X);
          for (let D of J) Y[D] = I[D]
        }
      } else if (J.discardResponseBody) await J0A(B.body, Q);
      return Y.$metadata = this.deserializeMetadata(B), Y
    }
    async deserializeHttpMessage(A, Q, B, G, Z) {
      let Y;
      if (G instanceof Set) Y = Z;
      else Y = G;
      let J = !0,
        X = this.deserializer,
        I = aM.NormalizedSchema.of(A),
        D = [];
      for (let [W, K] of I.structIterator()) {
        let V = K.getMemberTraits();
        if (V.httpPayload) {
          if (J = !1, K.isStreaming())
            if (K.isStructSchema()) Y[W] = await this.deserializeEventStream({
              response: B,
              responseSchema: I
            });
            else Y[W] = AoA.sdkStreamMixin(B.body);
          else if (B.body) {
            let H = await J0A(B.body, Q);
            if (H.byteLength > 0) Y[W] = await X.read(K, H)
          }
        } else if (V.httpHeader) {
          let F = String(V.httpHeader).toLowerCase(),
            H = B.headers[F];
          if (H != null)
            if (K.isListSchema()) {
              let E = K.getValueSchema();
              E.getMergedTraits().httpHeader = F;
              let z;
              if (E.isTimestampSchema() && E.getSchema() === 4) z = nM.splitEvery(H, ",", 2);
              else z = nM.splitHeader(H);
              let $ = [];
              for (let O of z) $.push(await X.read(E, O.trim()));
              Y[W] = $
            } else Y[W] = await X.read(K, H)
        } else if (V.httpPrefixHeaders !== void 0) {
          Y[W] = {};
          for (let [F, H] of Object.entries(B.headers))
            if (F.startsWith(V.httpPrefixHeaders)) {
              let E = K.getValueSchema();
              E.getMergedTraits().httpHeader = F, Y[W][F.slice(V.httpPrefixHeaders.length)] = await X.read(E, H)
            }
        } else if (V.httpResponseCode) Y[W] = B.statusCode;
        else D.push(W)
      }
      return D.discardResponseBody = J, D
    }
  }
  class GwQ extends BoA {
    async serializeRequest(A, Q, B) {
      let G = this.serializer,
        Z = {},
        Y = {},
        J = await B.endpoint(),
        X = aM.NormalizedSchema.of(A?.input),
        I = X.getSchema(),
        D, W = new cNA.HttpRequest({
          protocol: "",
          hostname: "",
          port: void 0,
          path: "/",
          fragment: void 0,
          query: Z,
          headers: Y,
          body: void 0
        });
      if (J) this.updateServiceEndpoint(W, J), this.setHostPrefix(W, A, Q);
      let K = {
        ...Q
      };
      if (Q) {
        let V = X.getEventStreamMember();
        if (V) {
          if (K[V]) {
            let F = {};
            for (let [H, E] of X.structIterator())
              if (H !== V && K[H]) G.write(E, K[H]), F[H] = G.flush();
            D = await this.serializeEventStream({
              eventStream: K[V],
              requestSchema: X,
              initialRequest: F
            })
          }
        } else G.write(I, K), D = G.flush()
      }
      return W.headers = Y, W.query = Z, W.body = D, W.method = "POST", W
    }
    async deserializeResponse(A, Q, B) {
      let G = this.deserializer,
        Z = aM.NormalizedSchema.of(A.output),
        Y = {};
      if (B.statusCode >= 300) {
        let X = await J0A(B.body, Q);
        if (X.byteLength > 0) Object.assign(Y, await G.read(15, X));
        throw await this.handleError(A, Q, B, Y, this.deserializeMetadata(B)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.")
      }
      for (let X in B.headers) {
        let I = B.headers[X];
        delete B.headers[X], B.headers[X.toLowerCase()] = I
      }
      let J = Z.getEventStreamMember();
      if (J) Y[J] = await this.deserializeEventStream({
        response: B,
        responseSchema: Z,
        initialResponseContainer: Y
      });
      else {
        let X = await J0A(B.body, Q);
        if (X.byteLength > 0) Object.assign(Y, await G.read(Z, X))
      }
      return Y.$metadata = this.deserializeMetadata(B), Y
    }
  }
  var ZwQ = (A, Q, B, G, Z, Y) => {
    if (Q != null && Q[B] !== void 0) {
      let J = G();
      if (J.length <= 0) throw Error("Empty value provided for input HTTP label: " + B + ".");
      A = A.replace(Z, Y ? J.split("/").map((X) => pNA(X)).join("/") : pNA(J))
    } else throw Error("No value provided for input HTTP label: " + B + ".");
    return A
  };

  function Oe4(A, Q) {
    return new Fx1(A, Q)
  }
  class Fx1 {
    input;
    context;
    query = {};
    method = "";
    headers = {};
    path = "";
    body = null;
    hostname = "";
    resolvePathStack = [];
    constructor(A, Q) {
      this.input = A, this.context = Q
    }
    async build() {
      let {
        hostname: A,
        protocol: Q = "https",
        port: B,
        path: G
      } = await this.context.endpoint();
      this.path = G;
      for (let Z of this.resolvePathStack) Z(this.path);
      return new cNA.HttpRequest({
        protocol: Q,
        hostname: this.hostname || A,
        port: B,
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
      return this.resolvePathStack.push((Q) => {
        this.path = `${Q?.endsWith("/")?Q.slice(0,-1):Q||""}` + A
      }), this
    }
    p(A, Q, B, G) {
      return this.resolvePathStack.push((Z) => {
        this.path = ZwQ(Z, this.input, A, Q, B, G)
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

  function Hx1(A, Q) {
    if (Q.timestampFormat.useTrait) {
      if (A.isTimestampSchema() && (A.getSchema() === 5 || A.getSchema() === 6 || A.getSchema() === 7)) return A.getSchema()
    }
    let {
      httpLabel: B,
      httpPrefixHeaders: G,
      httpHeader: Z,
      httpQuery: Y
    } = A.getMergedTraits();
    return (Q.httpBindings ? typeof G === "string" || Boolean(Z) ? 6 : Boolean(Y) || Boolean(B) ? 5 : void 0 : void 0) ?? Q.timestampFormat.default
  }
  class Ex1 extends rZA {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    read(A, Q) {
      let B = aM.NormalizedSchema.of(A);
      if (B.isListSchema()) return nM.splitHeader(Q).map((G) => this.read(B.getValueSchema(), G));
      if (B.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? QoA.fromBase64)(Q);
      if (B.isTimestampSchema()) switch (Hx1(B, this.settings)) {
        case 5:
          return nM._parseRfc3339DateTimeWithOffset(Q);
        case 6:
          return nM._parseRfc7231DateTime(Q);
        case 7:
          return nM._parseEpochTimestamp(Q);
        default:
          return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
      }
      if (B.isStringSchema()) {
        let G = B.getMergedTraits().mediaType,
          Z = Q;
        if (G) {
          if (B.getMergedTraits().httpHeader) Z = this.base64ToUtf8(Z);
          if (G === "application/json" || G.endsWith("+json")) Z = nM.LazyJsonString.from(Z);
          return Z
        }
      }
      if (B.isNumericSchema()) return Number(Q);
      if (B.isBigIntegerSchema()) return BigInt(Q);
      if (B.isBigDecimalSchema()) return new nM.NumericValue(Q, "bigDecimal");
      if (B.isBooleanSchema()) return String(Q).toLowerCase() === "true";
      return Q
    }
    base64ToUtf8(A) {
      return (this.serdeContext?.utf8Encoder ?? Vx1.toUtf8)((this.serdeContext?.base64Decoder ?? QoA.fromBase64)(A))
    }
  }
  class YwQ extends rZA {
    codecDeserializer;
    stringDeserializer;
    constructor(A, Q) {
      super();
      this.codecDeserializer = A, this.stringDeserializer = new Ex1(Q)
    }
    setSerdeContext(A) {
      this.stringDeserializer.setSerdeContext(A), this.codecDeserializer.setSerdeContext(A), this.serdeContext = A
    }
    read(A, Q) {
      let B = aM.NormalizedSchema.of(A),
        G = B.getMergedTraits(),
        Z = this.serdeContext?.utf8Encoder ?? Vx1.toUtf8;
      if (G.httpHeader || G.httpResponseCode) return this.stringDeserializer.read(B, Z(Q));
      if (G.httpPayload) {
        if (B.isBlobSchema()) {
          let Y = this.serdeContext?.utf8Decoder ?? Vx1.fromUtf8;
          if (typeof Q === "string") return Y(Q);
          return Q
        } else if (B.isStringSchema()) {
          if ("byteLength" in Q) return Z(Q);
          return Q
        }
      }
      return this.codecDeserializer.read(B, Q)
    }
  }
  class zx1 extends rZA {
    settings;
    stringBuffer = "";
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q) {
      let B = aM.NormalizedSchema.of(A);
      switch (typeof Q) {
        case "object":
          if (Q === null) {
            this.stringBuffer = "null";
            return
          }
          if (B.isTimestampSchema()) {
            if (!(Q instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${Q} when schema expected Date in ${B.getName(!0)}`);
            switch (Hx1(B, this.settings)) {
              case 5:
                this.stringBuffer = Q.toISOString().replace(".000Z", "Z");
                break;
              case 6:
                this.stringBuffer = nM.dateToUtcString(Q);
                break;
              case 7:
                this.stringBuffer = String(Q.getTime() / 1000);
                break;
              default:
                console.warn("Missing timestamp format, using epoch seconds", Q), this.stringBuffer = String(Q.getTime() / 1000)
            }
            return
          }
          if (B.isBlobSchema() && "byteLength" in Q) {
            this.stringBuffer = (this.serdeContext?.base64Encoder ?? QoA.toBase64)(Q);
            return
          }
          if (B.isListSchema() && Array.isArray(Q)) {
            let Y = "";
            for (let J of Q) {
              this.write([B.getValueSchema(), B.getMergedTraits()], J);
              let X = this.flush(),
                I = B.getValueSchema().isTimestampSchema() ? X : nM.quoteHeader(X);
              if (Y !== "") Y += ", ";
              Y += I
            }
            this.stringBuffer = Y;
            return
          }
          this.stringBuffer = JSON.stringify(Q, null, 2);
          break;
        case "string":
          let G = B.getMergedTraits().mediaType,
            Z = Q;
          if (G) {
            if (G === "application/json" || G.endsWith("+json")) Z = nM.LazyJsonString.from(Z);
            if (B.getMergedTraits().httpHeader) {
              this.stringBuffer = (this.serdeContext?.base64Encoder ?? QoA.toBase64)(Z.toString());
              return
            }
          }
          this.stringBuffer = Q;
          break;
        default:
          if (B.isIdempotencyToken()) this.stringBuffer = nM.generateIdempotencyToken();
          else this.stringBuffer = String(Q)
      }
    }
    flush() {
      let A = this.stringBuffer;
      return this.stringBuffer = "", A
    }
  }
  class JwQ {
    codecSerializer;
    stringSerializer;
    buffer;
    constructor(A, Q, B = new zx1(Q)) {
      this.codecSerializer = A, this.stringSerializer = B
    }
    setSerdeContext(A) {
      this.codecSerializer.setSerdeContext(A), this.stringSerializer.setSerdeContext(A)
    }
    write(A, Q) {
      let B = aM.NormalizedSchema.of(A),
        G = B.getMergedTraits();
      if (G.httpHeader || G.httpLabel || G.httpQuery) {
        this.stringSerializer.write(B, Q), this.buffer = this.stringSerializer.flush();
        return
      }
      return this.codecSerializer.write(B, Q)
    }
    flush() {
      if (this.buffer !== void 0) {
        let A = this.buffer;
        return this.buffer = void 0, A
      }
      return this.codecSerializer.flush()
    }
  }
  Me4.FromStringShapeDeserializer = Ex1;
  Me4.HttpBindingProtocol = BwQ;
  Me4.HttpInterceptingShapeDeserializer = YwQ;
  Me4.HttpInterceptingShapeSerializer = JwQ;
  Me4.HttpProtocol = BoA;
  Me4.RequestBuilder = Fx1;
  Me4.RpcProtocol = GwQ;
  Me4.SerdeContext = rZA;
  Me4.ToStringShapeSerializer = zx1;
  Me4.collectBody = J0A;
  Me4.determineTimestampFormat = Hx1;
  Me4.extendedEncodeURIComponent = pNA;
  Me4.requestBuilder = Oe4;
  Me4.resolvedPath = ZwQ
})
// @from(Ln 77574, Col 4)
rG = U((UwQ) => {
  var GoA = IS1(),
    XwQ = Jz(),
    ue4 = wS1(),
    $x1 = TNA(),
    me4 = Mq(),
    de4 = (A) => A[GoA.SMITHY_CONTEXT_KEY] || (A[GoA.SMITHY_CONTEXT_KEY] = {}),
    ce4 = (A, Q) => {
      if (!Q || Q.length === 0) return A;
      let B = [];
      for (let G of Q)
        for (let Z of A)
          if (Z.schemeId.split("#")[1] === G) B.push(Z);
      for (let G of A)
        if (!B.find(({
            schemeId: Z
          }) => Z === G.schemeId)) B.push(G);
      return B
    };

  function pe4(A) {
    let Q = new Map;
    for (let B of A) Q.set(B.schemeId, B);
    return Q
  }
  var Cx1 = (A, Q) => (B, G) => async (Z) => {
    let Y = A.httpAuthSchemeProvider(await Q.httpAuthSchemeParametersProvider(A, G, Z.input)),
      J = A.authSchemePreference ? await A.authSchemePreference() : [],
      X = ce4(Y, J),
      I = pe4(A.httpAuthSchemes),
      D = XwQ.getSmithyContext(G),
      W = [];
    for (let K of X) {
      let V = I.get(K.schemeId);
      if (!V) {
        W.push(`HttpAuthScheme \`${K.schemeId}\` was not enabled for this service.`);
        continue
      }
      let F = V.identityProvider(await Q.identityProviderConfigProvider(A));
      if (!F) {
        W.push(`HttpAuthScheme \`${K.schemeId}\` did not have an IdentityProvider configured.`);
        continue
      }
      let {
        identityProperties: H = {},
        signingProperties: E = {}
      } = K.propertiesExtractor?.(A, G) || {};
      K.identityProperties = Object.assign(K.identityProperties || {}, H), K.signingProperties = Object.assign(K.signingProperties || {}, E), D.selectedHttpAuthScheme = {
        httpAuthOption: K,
        identity: await F(K.identityProperties),
        signer: V.signer
      };
      break
    }
    if (!D.selectedHttpAuthScheme) throw Error(W.join(`
`));
    return B(Z)
  }, IwQ = {
    step: "serialize",
    tags: ["HTTP_AUTH_SCHEME"],
    name: "httpAuthSchemeMiddleware",
    override: !0,
    relation: "before",
    toMiddleware: "endpointV2Middleware"
  }, le4 = (A, {
    httpAuthSchemeParametersProvider: Q,
    identityProviderConfigProvider: B
  }) => ({
    applyToStack: (G) => {
      G.addRelativeTo(Cx1(A, {
        httpAuthSchemeParametersProvider: Q,
        identityProviderConfigProvider: B
      }), IwQ)
    }
  }), DwQ = {
    step: "serialize",
    tags: ["HTTP_AUTH_SCHEME"],
    name: "httpAuthSchemeMiddleware",
    override: !0,
    relation: "before",
    toMiddleware: ue4.serializerMiddlewareOption.name
  }, ie4 = (A, {
    httpAuthSchemeParametersProvider: Q,
    identityProviderConfigProvider: B
  }) => ({
    applyToStack: (G) => {
      G.addRelativeTo(Cx1(A, {
        httpAuthSchemeParametersProvider: Q,
        identityProviderConfigProvider: B
      }), DwQ)
    }
  }), ne4 = (A) => (Q) => {
    throw Q
  }, ae4 = (A, Q) => {}, WwQ = (A) => (Q, B) => async (G) => {
    if (!$x1.HttpRequest.isInstance(G.request)) return Q(G);
    let Y = XwQ.getSmithyContext(B).selectedHttpAuthScheme;
    if (!Y) throw Error("No HttpAuthScheme was selected: unable to sign request");
    let {
      httpAuthOption: {
        signingProperties: J = {}
      },
      identity: X,
      signer: I
    } = Y, D = await Q({
      ...G,
      request: await I.sign(G.request, X, J)
    }).catch((I.errorHandler || ne4)(J));
    return (I.successHandler || ae4)(D.response, J), D
  }, KwQ = {
    step: "finalizeRequest",
    tags: ["HTTP_SIGNING"],
    name: "httpSigningMiddleware",
    aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
    override: !0,
    relation: "after",
    toMiddleware: "retryMiddleware"
  }, oe4 = (A) => ({
    applyToStack: (Q) => {
      Q.addRelativeTo(WwQ(), KwQ)
    }
  }), re4 = (A) => {
    if (typeof A === "function") return A;
    let Q = Promise.resolve(A);
    return () => Q
  }, se4 = async (A, Q, B, G = (Y) => Y, ...Z) => {
    let Y = new A(B);
    return Y = G(Y) ?? Y, await Q.send(Y, ...Z)
  };

  function te4(A, Q, B, G, Z) {
    return async function* (J, X, ...I) {
      let D = X,
        W = J.startingToken ?? D[B],
        K = !0,
        V;
      while (K) {
        if (D[B] = W, Z) D[Z] = D[Z] ?? J.pageSize;
        if (J.client instanceof A) V = await se4(Q, J.client, X, J.withCommand, ...I);
        else throw Error(`Invalid client, expected instance of ${A.name}`);
        yield V;
        let F = W;
        W = ee4(V, G), K = !!(W && (!J.stopOnSameToken || W !== F))
      }
      return
    }
  }
  var ee4 = (A, Q) => {
    let B = A,
      G = Q.split(".");
    for (let Z of G) {
      if (!B || typeof B !== "object") return;
      B = B[Z]
    }
    return B
  };

  function AA6(A, Q, B) {
    if (!A.__smithy_context) A.__smithy_context = {
      features: {}
    };
    else if (!A.__smithy_context.features) A.__smithy_context.features = {};
    A.__smithy_context.features[Q] = B
  }
  class VwQ {
    authSchemes = new Map;
    constructor(A) {
      for (let [Q, B] of Object.entries(A))
        if (B !== void 0) this.authSchemes.set(Q, B)
    }
    getIdentityProvider(A) {
      return this.authSchemes.get(A)
    }
  }
  class FwQ {
    async sign(A, Q, B) {
      if (!B) throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
      if (!B.name) throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
      if (!B.in) throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
      if (!Q.apiKey) throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
      let G = $x1.HttpRequest.clone(A);
      if (B.in === GoA.HttpApiKeyAuthLocation.QUERY) G.query[B.name] = Q.apiKey;
      else if (B.in === GoA.HttpApiKeyAuthLocation.HEADER) G.headers[B.name] = B.scheme ? `${B.scheme} ${Q.apiKey}` : Q.apiKey;
      else throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + B.in + "`");
      return G
    }
  }
  class HwQ {
    async sign(A, Q, B) {
      let G = $x1.HttpRequest.clone(A);
      if (!Q.token) throw Error("request could not be signed with `token` since the `token` is not defined");
      return G.headers.Authorization = `Bearer ${Q.token}`, G
    }
  }
  class EwQ {
    async sign(A, Q, B) {
      return A
    }
  }
  var zwQ = (A) => function (B) {
      return CwQ(B) && B.expiration.getTime() - Date.now() < A
    },
    $wQ = 300000,
    QA6 = zwQ($wQ),
    CwQ = (A) => A.expiration !== void 0,
    BA6 = (A, Q, B) => {
      if (A === void 0) return;
      let G = typeof A !== "function" ? async () => Promise.resolve(A): A, Z, Y, J, X = !1, I = async (D) => {
        if (!Y) Y = G(D);
        try {
          Z = await Y, J = !0, X = !1
        } finally {
          Y = void 0
        }
        return Z
      };
      if (Q === void 0) return async (D) => {
        if (!J || D?.forceRefresh) Z = await I(D);
        return Z
      };
      return async (D) => {
        if (!J || D?.forceRefresh) Z = await I(D);
        if (X) return Z;
        if (!B(Z)) return X = !0, Z;
        if (Q(Z)) return await I(D), Z;
        return Z
      }
    };
  Object.defineProperty(UwQ, "requestBuilder", {
    enumerable: !0,
    get: function () {
      return me4.requestBuilder
    }
  });
  UwQ.DefaultIdentityProviderConfig = VwQ;
  UwQ.EXPIRATION_MS = $wQ;
  UwQ.HttpApiKeyAuthSigner = FwQ;
  UwQ.HttpBearerAuthSigner = HwQ;
  UwQ.NoAuthSigner = EwQ;
  UwQ.createIsIdentityExpiredFunction = zwQ;
  UwQ.createPaginator = te4;
  UwQ.doesIdentityRequireRefresh = CwQ;
  UwQ.getHttpAuthSchemeEndpointRuleSetPlugin = le4;
  UwQ.getHttpAuthSchemePlugin = ie4;
  UwQ.getHttpSigningPlugin = oe4;
  UwQ.getSmithyContext = de4;
  UwQ.httpAuthSchemeEndpointRuleSetMiddlewareOptions = IwQ;
  UwQ.httpAuthSchemeMiddleware = Cx1;
  UwQ.httpAuthSchemeMiddlewareOptions = DwQ;
  UwQ.httpSigningMiddleware = WwQ;
  UwQ.httpSigningMiddlewareOptions = KwQ;
  UwQ.isIdentityExpired = QA6;
  UwQ.memoizeIdentityProvider = BA6;
  UwQ.normalizeProvider = re4;
  UwQ.setFeature = AA6
})
// @from(Ln 77829, Col 4)
qwQ = U((TA6) => {
  TA6.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(TA6.HttpAuthLocation || (TA6.HttpAuthLocation = {}));
  TA6.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(TA6.HttpApiKeyAuthLocation || (TA6.HttpApiKeyAuthLocation = {}));
  TA6.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(TA6.EndpointURLScheme || (TA6.EndpointURLScheme = {}));
  TA6.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(TA6.AlgorithmId || (TA6.AlgorithmId = {}));
  var OA6 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => TA6.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => TA6.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    MA6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    RA6 = (A) => {
      return OA6(A)
    },
    _A6 = (A) => {
      return MA6(A)
    };
  TA6.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(TA6.FieldPosition || (TA6.FieldPosition = {}));
  var jA6 = "__smithy_context";
  TA6.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(TA6.IniSectionType || (TA6.IniSectionType = {}));
  TA6.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(TA6.RequestHandlerProtocol || (TA6.RequestHandlerProtocol = {}));
  TA6.SMITHY_CONTEXT_KEY = jA6;
  TA6.getDefaultClientConfiguration = RA6;
  TA6.resolveDefaultRuntimeConfig = _A6
})
// @from(Ln 77894, Col 4)
xT = U((tA6) => {
  var Rx1 = qwQ();
  class NwQ {
    capacity;
    data = new Map;
    parameters = [];
    constructor({
      size: A,
      params: Q
    }) {
      if (this.capacity = A ?? 50, Q) this.parameters = Q
    }
    get(A, Q) {
      let B = this.hash(A);
      if (B === !1) return Q();
      if (!this.data.has(B)) {
        if (this.data.size > this.capacity + 10) {
          let G = this.data.keys(),
            Z = 0;
          while (!0) {
            let {
              value: Y,
              done: J
            } = G.next();
            if (this.data.delete(Y), J || ++Z > 10) break
          }
        }
        this.data.set(B, Q())
      }
      return this.data.get(B)
    }
    size() {
      return this.data.size
    }
    hash(A) {
      let Q = "",
        {
          parameters: B
        } = this;
      if (B.length === 0) return !1;
      for (let G of B) {
        let Z = String(A[G] ?? "");
        if (Z.includes("|;")) return !1;
        Q += Z + "|;"
      }
      return Q
    }
  }
  var yA6 = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"),
    wwQ = (A) => yA6.test(A) || A.startsWith("[") && A.endsWith("]"),
    vA6 = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"),
    jx1 = (A, Q = !1) => {
      if (!Q) return vA6.test(A);
      let B = A.split(".");
      for (let G of B)
        if (!jx1(G)) return !1;
      return !0
    },
    _x1 = {},
    iNA = "endpoints";

  function ui(A) {
    if (typeof A !== "object" || A == null) return A;
    if ("ref" in A) return `$${ui(A.ref)}`;
    if ("fn" in A) return `${A.fn}(${(A.argv||[]).map(ui).join(", ")})`;
    return JSON.stringify(A, null, 2)
  }
  class ZC extends Error {
    constructor(A) {
      super(A);
      this.name = "EndpointError"
    }
  }
  var kA6 = (A, Q) => A === Q,
    bA6 = (A) => {
      let Q = A.split("."),
        B = [];
      for (let G of Q) {
        let Z = G.indexOf("[");
        if (Z !== -1) {
          if (G.indexOf("]") !== G.length - 1) throw new ZC(`Path: '${A}' does not end with ']'`);
          let Y = G.slice(Z + 1, -1);
          if (Number.isNaN(parseInt(Y))) throw new ZC(`Invalid array index: '${Y}' in path: '${A}'`);
          if (Z !== 0) B.push(G.slice(0, Z));
          B.push(Y)
        } else B.push(G)
      }
      return B
    },
    LwQ = (A, Q) => bA6(Q).reduce((B, G) => {
      if (typeof B !== "object") throw new ZC(`Index '${G}' in '${Q}' not found in '${JSON.stringify(A)}'`);
      else if (Array.isArray(B)) return B[parseInt(G)];
      return B[G]
    }, A),
    fA6 = (A) => A != null,
    hA6 = (A) => !A,
    Mx1 = {
      [Rx1.EndpointURLScheme.HTTP]: 80,
      [Rx1.EndpointURLScheme.HTTPS]: 443
    },
    gA6 = (A) => {
      let Q = (() => {
        try {
          if (A instanceof URL) return A;
          if (typeof A === "object" && "hostname" in A) {
            let {
              hostname: V,
              port: F,
              protocol: H = "",
              path: E = "",
              query: z = {}
            } = A, $ = new URL(`${H}//${V}${F?`:${F}`:""}${E}`);
            return $.search = Object.entries(z).map(([O, L]) => `${O}=${L}`).join("&"), $
          }
          return new URL(A)
        } catch (V) {
          return null
        }
      })();
      if (!Q) return console.error(`Unable to parse ${JSON.stringify(A)} as a whatwg URL.`), null;
      let B = Q.href,
        {
          host: G,
          hostname: Z,
          pathname: Y,
          protocol: J,
          search: X
        } = Q;
      if (X) return null;
      let I = J.slice(0, -1);
      if (!Object.values(Rx1.EndpointURLScheme).includes(I)) return null;
      let D = wwQ(Z),
        W = B.includes(`${G}:${Mx1[I]}`) || typeof A === "string" && A.includes(`${G}:${Mx1[I]}`),
        K = `${G}${W?`:${Mx1[I]}`:""}`;
      return {
        scheme: I,
        authority: K,
        path: Y,
        normalizedPath: Y.endsWith("/") ? Y : `${Y}/`,
        isIp: D
      }
    },
    uA6 = (A, Q) => A === Q,
    mA6 = (A, Q, B, G) => {
      if (Q >= B || A.length < B) return null;
      if (!G) return A.substring(Q, B);
      return A.substring(A.length - B, A.length - Q)
    },
    dA6 = (A) => encodeURIComponent(A).replace(/[!*'()]/g, (Q) => `%${Q.charCodeAt(0).toString(16).toUpperCase()}`),
    cA6 = {
      booleanEquals: kA6,
      getAttr: LwQ,
      isSet: fA6,
      isValidHostLabel: jx1,
      not: hA6,
      parseURL: gA6,
      stringEquals: uA6,
      substring: mA6,
      uriEncode: dA6
    },
    OwQ = (A, Q) => {
      let B = [],
        G = {
          ...Q.endpointParams,
          ...Q.referenceRecord
        },
        Z = 0;
      while (Z < A.length) {
        let Y = A.indexOf("{", Z);
        if (Y === -1) {
          B.push(A.slice(Z));
          break
        }
        B.push(A.slice(Z, Y));
        let J = A.indexOf("}", Y);
        if (J === -1) {
          B.push(A.slice(Y));
          break
        }
        if (A[Y + 1] === "{" && A[J + 1] === "}") B.push(A.slice(Y + 1, J)), Z = J + 2;
        let X = A.substring(Y + 1, J);
        if (X.includes("#")) {
          let [I, D] = X.split("#");
          B.push(LwQ(G[I], D))
        } else B.push(G[X]);
        Z = J + 1
      }
      return B.join("")
    },
    pA6 = ({
      ref: A
    }, Q) => {
      return {
        ...Q.endpointParams,
        ...Q.referenceRecord
      } [A]
    },
    ZoA = (A, Q, B) => {
      if (typeof A === "string") return OwQ(A, B);
      else if (A.fn) return RwQ.callFunction(A, B);
      else if (A.ref) return pA6(A, B);
      throw new ZC(`'${Q}': ${String(A)} is not a string, function or reference.`)
    },
    MwQ = ({
      fn: A,
      argv: Q
    }, B) => {
      let G = Q.map((Y) => ["boolean", "number"].includes(typeof Y) ? Y : RwQ.evaluateExpression(Y, "arg", B)),
        Z = A.split(".");
      if (Z[0] in _x1 && Z[1] != null) return _x1[Z[0]][Z[1]](...G);
      return cA6[A](...G)
    },
    RwQ = {
      evaluateExpression: ZoA,
      callFunction: MwQ
    },
    lA6 = ({
      assign: A,
      ...Q
    }, B) => {
      if (A && A in B.referenceRecord) throw new ZC(`'${A}' is already defined in Reference Record.`);
      let G = MwQ(Q, B);
      return B.logger?.debug?.(`${iNA} evaluateCondition: ${ui(Q)} = ${ui(G)}`), {
        result: G === "" ? !0 : !!G,
        ...A != null && {
          toAssign: {
            name: A,
            value: G
          }
        }
      }
    },
    Tx1 = (A = [], Q) => {
      let B = {};
      for (let G of A) {
        let {
          result: Z,
          toAssign: Y
        } = lA6(G, {
          ...Q,
          referenceRecord: {
            ...Q.referenceRecord,
            ...B
          }
        });
        if (!Z) return {
          result: Z
        };
        if (Y) B[Y.name] = Y.value, Q.logger?.debug?.(`${iNA} assign: ${Y.name} := ${ui(Y.value)}`)
      }
      return {
        result: !0,
        referenceRecord: B
      }
    },
    iA6 = (A, Q) => Object.entries(A).reduce((B, [G, Z]) => ({
      ...B,
      [G]: Z.map((Y) => {
        let J = ZoA(Y, "Header value entry", Q);
        if (typeof J !== "string") throw new ZC(`Header '${G}' value '${J}' is not a string`);
        return J
      })
    }), {}),
    _wQ = (A, Q) => Object.entries(A).reduce((B, [G, Z]) => ({
      ...B,
      [G]: TwQ.getEndpointProperty(Z, Q)
    }), {}),
    jwQ = (A, Q) => {
      if (Array.isArray(A)) return A.map((B) => jwQ(B, Q));
      switch (typeof A) {
        case "string":
          return OwQ(A, Q);
        case "object":
          if (A === null) throw new ZC(`Unexpected endpoint property: ${A}`);
          return TwQ.getEndpointProperties(A, Q);
        case "boolean":
          return A;
        default:
          throw new ZC(`Unexpected endpoint property type: ${typeof A}`)
      }
    },
    TwQ = {
      getEndpointProperty: jwQ,
      getEndpointProperties: _wQ
    },
    nA6 = (A, Q) => {
      let B = ZoA(A, "Endpoint URL", Q);
      if (typeof B === "string") try {
        return new URL(B)
      } catch (G) {
        throw console.error(`Failed to construct URL with ${B}`, G), G
      }
      throw new ZC(`Endpoint URL must be a string, got ${typeof B}`)
    },
    aA6 = (A, Q) => {
      let {
        conditions: B,
        endpoint: G
      } = A, {
        result: Z,
        referenceRecord: Y
      } = Tx1(B, Q);
      if (!Z) return;
      let J = {
          ...Q,
          referenceRecord: {
            ...Q.referenceRecord,
            ...Y
          }
        },
        {
          url: X,
          properties: I,
          headers: D
        } = G;
      return Q.logger?.debug?.(`${iNA} Resolving endpoint from template: ${ui(G)}`), {
        ...D != null && {
          headers: iA6(D, J)
        },
        ...I != null && {
          properties: _wQ(I, J)
        },
        url: nA6(X, J)
      }
    },
    oA6 = (A, Q) => {
      let {
        conditions: B,
        error: G
      } = A, {
        result: Z,
        referenceRecord: Y
      } = Tx1(B, Q);
      if (!Z) return;
      throw new ZC(ZoA(G, "Error", {
        ...Q,
        referenceRecord: {
          ...Q.referenceRecord,
          ...Y
        }
      }))
    },
    PwQ = (A, Q) => {
      for (let B of A)
        if (B.type === "endpoint") {
          let G = aA6(B, Q);
          if (G) return G
        } else if (B.type === "error") oA6(B, Q);
      else if (B.type === "tree") {
        let G = SwQ.evaluateTreeRule(B, Q);
        if (G) return G
      } else throw new ZC(`Unknown endpoint rule: ${B}`);
      throw new ZC("Rules evaluation failed")
    },
    rA6 = (A, Q) => {
      let {
        conditions: B,
        rules: G
      } = A, {
        result: Z,
        referenceRecord: Y
      } = Tx1(B, Q);
      if (!Z) return;
      return SwQ.evaluateRules(G, {
        ...Q,
        referenceRecord: {
          ...Q.referenceRecord,
          ...Y
        }
      })
    },
    SwQ = {
      evaluateRules: PwQ,
      evaluateTreeRule: rA6
    },
    sA6 = (A, Q) => {
      let {
        endpointParams: B,
        logger: G
      } = Q, {
        parameters: Z,
        rules: Y
      } = A;
      Q.logger?.debug?.(`${iNA} Initial EndpointParams: ${ui(B)}`);
      let J = Object.entries(Z).filter(([, D]) => D.default != null).map(([D, W]) => [D, W.default]);
      if (J.length > 0)
        for (let [D, W] of J) B[D] = B[D] ?? W;
      let X = Object.entries(Z).filter(([, D]) => D.required).map(([D]) => D);
      for (let D of X)
        if (B[D] == null) throw new ZC(`Missing required parameter: '${D}'`);
      let I = PwQ(Y, {
        endpointParams: B,
        logger: G,
        referenceRecord: {}
      });
      return Q.logger?.debug?.(`${iNA} Resolved endpoint: ${ui(I)}`), I
    };
  tA6.EndpointCache = NwQ;
  tA6.EndpointError = ZC;
  tA6.customEndpointFunctions = _x1;
  tA6.isIpAddress = wwQ;
  tA6.isValidHostLabel = jx1;
  tA6.resolveEndpoint = sA6
})
// @from(Ln 78298, Col 4)
xwQ = U((J16) => {
  function Y16(A) {
    let Q = {};
    if (A = A.replace(/^\?/, ""), A)
      for (let B of A.split("&")) {
        let [G, Z = null] = B.split("=");
        if (G = decodeURIComponent(G), Z) Z = decodeURIComponent(Z);
        if (!(G in Q)) Q[G] = Z;
        else if (Array.isArray(Q[G])) Q[G].push(Z);
        else Q[G] = [Q[G], Z]
      }
    return Q
  }
  J16.parseQueryString = Y16
})
// @from(Ln 78313, Col 4)
oM = U((D16) => {
  var I16 = xwQ(),
    ywQ = (A) => {
      if (typeof A === "string") return ywQ(new URL(A));
      let {
        hostname: Q,
        pathname: B,
        port: G,
        protocol: Z,
        search: Y
      } = A, J;
      if (Y) J = I16.parseQueryString(Y);
      return {
        hostname: Q,
        port: G ? parseInt(G) : void 0,
        protocol: Z,
        path: B,
        query: J
      }
    };
  D16.parseUrl = ywQ
})
// @from(Ln 78335, Col 4)
Hv = U((YoA) => {
  var sZA = xT(),
    K16 = oM(),
    kwQ = (A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!kwQ(B)) return !1;
        return !0
      }
      if (!sZA.isValidHostLabel(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if (sZA.isIpAddress(A)) return !1;
      return !0
    },
    vwQ = ":",
    V16 = "/",
    F16 = (A) => {
      let Q = A.split(vwQ);
      if (Q.length < 6) return null;
      let [B, G, Z, Y, J, ...X] = Q;
      if (B !== "arn" || G === "" || Z === "" || X.join(vwQ) === "") return null;
      let I = X.map((D) => D.split(V16)).flat();
      return {
        partition: G,
        service: Z,
        region: Y,
        accountId: J,
        resourceId: I
      }
    },
    H16 = [{
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
    E16 = "1.1",
    bwQ = {
      partitions: H16,
      version: E16
    },
    fwQ = bwQ,
    hwQ = "",
    gwQ = (A) => {
      let {
        partitions: Q
      } = fwQ;
      for (let G of Q) {
        let {
          regions: Z,
          outputs: Y
        } = G;
        for (let [J, X] of Object.entries(Z))
          if (J === A) return {
            ...Y,
            ...X
          }
      }
      for (let G of Q) {
        let {
          regionRegex: Z,
          outputs: Y
        } = G;
        if (new RegExp(Z).test(A)) return {
          ...Y
        }
      }
      let B = Q.find((G) => G.id === "aws");
      if (!B) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
      return {
        ...B.outputs
      }
    },
    uwQ = (A, Q = "") => {
      fwQ = A, hwQ = Q
    },
    z16 = () => {
      uwQ(bwQ, "")
    },
    $16 = () => hwQ,
    mwQ = {
      isVirtualHostableS3Bucket: kwQ,
      parseArn: F16,
      partition: gwQ
    };
  sZA.customEndpointFunctions.aws = mwQ;
  var C16 = (A) => {
      if (typeof A.endpointProvider !== "function") throw Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
      let {
        endpoint: Q
      } = A;
      if (Q === void 0) A.endpoint = async () => {
        return dwQ(A.endpointProvider({
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
    dwQ = (A) => K16.parseUrl(A.url);
  Object.defineProperty(YoA, "EndpointError", {
    enumerable: !0,
    get: function () {
      return sZA.EndpointError
    }
  });
  Object.defineProperty(YoA, "isIpAddress", {
    enumerable: !0,
    get: function () {
      return sZA.isIpAddress
    }
  });
  Object.defineProperty(YoA, "resolveEndpoint", {
    enumerable: !0,
    get: function () {
      return sZA.resolveEndpoint
    }
  });
  YoA.awsEndpointFunctions = mwQ;
  YoA.getUserAgentPrefix = $16;
  YoA.partition = gwQ;
  YoA.resolveDefaultAwsRegionalEndpointsConfig = C16;
  YoA.setPartitionInfo = uwQ;
  YoA.toEndpointV1 = dwQ;
  YoA.useDefaultPartitionInfo = z16
})
// @from(Ln 78724, Col 4)
cwQ = U((S16) => {
  S16.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(S16.HttpAuthLocation || (S16.HttpAuthLocation = {}));
  S16.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(S16.HttpApiKeyAuthLocation || (S16.HttpApiKeyAuthLocation = {}));
  S16.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(S16.EndpointURLScheme || (S16.EndpointURLScheme = {}));
  S16.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(S16.AlgorithmId || (S16.AlgorithmId = {}));
  var R16 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => S16.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => S16.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    _16 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    j16 = (A) => {
      return R16(A)
    },
    T16 = (A) => {
      return _16(A)
    };
  S16.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(S16.FieldPosition || (S16.FieldPosition = {}));
  var P16 = "__smithy_context";
  S16.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(S16.IniSectionType || (S16.IniSectionType = {}));
  S16.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(S16.RequestHandlerProtocol || (S16.RequestHandlerProtocol = {}));
  S16.SMITHY_CONTEXT_KEY = P16;
  S16.getDefaultClientConfiguration = j16;
  S16.resolveDefaultRuntimeConfig = T16
})
// @from(Ln 78789, Col 4)
nwQ = U((u16) => {
  var k16 = cwQ(),
    b16 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    f16 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class pwQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = k16.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class lwQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
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
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class JoA {
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
      let Q = new JoA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = h16(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return JoA.clone(this)
    }
  }

  function h16(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class iwQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function g16(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  u16.Field = pwQ;
  u16.Fields = lwQ;
  u16.HttpRequest = JoA;
  u16.HttpResponse = iwQ;
  u16.getHttpHandlerExtensionConfiguration = b16;
  u16.isValidHostname = g16;
  u16.resolveHttpHandlerRuntimeConfig = f16
})
// @from(Ln 78931, Col 4)
dx1 = U((e16) => {
  e16.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(e16.HttpAuthLocation || (e16.HttpAuthLocation = {}));
  e16.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(e16.HttpApiKeyAuthLocation || (e16.HttpApiKeyAuthLocation = {}));
  e16.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(e16.EndpointURLScheme || (e16.EndpointURLScheme = {}));
  e16.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(e16.AlgorithmId || (e16.AlgorithmId = {}));
  var a16 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => e16.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => e16.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    o16 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    r16 = (A) => {
      return a16(A)
    },
    s16 = (A) => {
      return o16(A)
    };
  e16.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(e16.FieldPosition || (e16.FieldPosition = {}));
  var t16 = "__smithy_context";
  e16.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(e16.IniSectionType || (e16.IniSectionType = {}));
  e16.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(e16.RequestHandlerProtocol || (e16.RequestHandlerProtocol = {}));
  e16.SMITHY_CONTEXT_KEY = t16;
  e16.getDefaultClientConfiguration = r16;
  e16.resolveDefaultRuntimeConfig = s16
})
// @from(Ln 78996, Col 4)
IoA = U((I06) => {
  var G06 = dx1(),
    Z06 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    Y06 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class awQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = G06.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class owQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
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
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class XoA {
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
      let Q = new XoA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = J06(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return XoA.clone(this)
    }
  }

  function J06(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class rwQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function X06(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  I06.Field = awQ;
  I06.Fields = owQ;
  I06.HttpRequest = XoA;
  I06.HttpResponse = rwQ;
  I06.getHttpHandlerExtensionConfiguration = Z06;
  I06.isValidHostname = X06;
  I06.resolveHttpHandlerRuntimeConfig = Y06
})
// @from(Ln 79138, Col 4)
PW = U((U06) => {
  class tZA extends Error {
    name = "ProviderError";
    tryNextLink;
    constructor(A, Q = !0) {
      let B, G = !0;
      if (typeof Q === "boolean") B = void 0, G = Q;
      else if (Q != null && typeof Q === "object") B = Q.logger, G = Q.tryNextLink ?? !0;
      super(A);
      this.tryNextLink = G, Object.setPrototypeOf(this, tZA.prototype), B?.debug?.(`@smithy/property-provider ${G?"->":"(!)"} ${A}`)
    }
    static from(A, Q = !0) {
      return Object.assign(new this(A.message, Q), A)
    }
  }
  class cx1 extends tZA {
    name = "CredentialsProviderError";
    constructor(A, Q = !0) {
      super(A, Q);
      Object.setPrototypeOf(this, cx1.prototype)
    }
  }
  class px1 extends tZA {
    name = "TokenProviderError";
    constructor(A, Q = !0) {
      super(A, Q);
      Object.setPrototypeOf(this, px1.prototype)
    }
  }
  var z06 = (...A) => async () => {
    if (A.length === 0) throw new tZA("No providers in chain");
    let Q;
    for (let B of A) try {
      return await B()
    } catch (G) {
      if (Q = G, G?.tryNextLink) continue;
      throw G
    }
    throw Q
  }, $06 = (A) => () => Promise.resolve(A), C06 = (A, Q, B) => {
    let G, Z, Y, J = !1,
      X = async () => {
        if (!Z) Z = A();
        try {
          G = await Z, Y = !0, J = !1
        } finally {
          Z = void 0
        }
        return G
      };
    if (Q === void 0) return async (I) => {
      if (!Y || I?.forceRefresh) G = await X();
      return G
    };
    return async (I) => {
      if (!Y || I?.forceRefresh) G = await X();
      if (J) return G;
      if (B && !B(G)) return J = !0, G;
      if (Q(G)) return await X(), G;
      return G
    }
  };
  U06.CredentialsProviderError = cx1;
  U06.ProviderError = tZA;
  U06.TokenProviderError = px1;
  U06.chain = z06;
  U06.fromStatic = $06;
  U06.memoize = C06
})
// @from(Ln 79207, Col 4)
Rq = U((P06) => {
  var lx1 = {
      warningEmitted: !1
    },
    R06 = (A) => {
      if (A && !lx1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) lx1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    };

  function _06(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }

  function j06(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }

  function T06(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  P06.emitWarningIfUnsupportedVersion = R06;
  P06.setCredentialFeature = _06;
  P06.setFeature = j06;
  P06.setTokenFeature = T06;
  P06.state = lx1
})
// @from(Ln 79244, Col 4)
twQ = U((h06) => {
  var swQ = {},
    ix1 = {};
  for (let A = 0; A < 256; A++) {
    let Q = A.toString(16).toLowerCase();
    if (Q.length === 1) Q = `0${Q}`;
    swQ[A] = Q, ix1[Q] = A
  }

  function b06(A) {
    if (A.length % 2 !== 0) throw Error("Hex encoded strings must have an even number length");
    let Q = new Uint8Array(A.length / 2);
    for (let B = 0; B < A.length; B += 2) {
      let G = A.slice(B, B + 2).toLowerCase();
      if (G in ix1) Q[B / 2] = ix1[G];
      else throw Error(`Cannot decode unrecognized sequence ${G} as hexadecimal`)
    }
    return Q
  }

  function f06(A) {
    let Q = "";
    for (let B = 0; B < A.byteLength; B++) Q += swQ[A[B]];
    return Q
  }
  h06.fromHex = b06;
  h06.toHex = f06
})
// @from(Ln 79272, Col 4)
ewQ = U((d06) => {
  var m06 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  d06.isArrayBuffer = m06
})
// @from(Ln 79276, Col 4)
QLQ = U((i06) => {
  var ALQ = (A) => encodeURIComponent(A).replace(/[!'()*]/g, p06),
    p06 = (A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`,
    l06 = (A) => A.split("/").map(ALQ).join("/");
  i06.escapeUri = ALQ;
  i06.escapeUriPath = l06
})