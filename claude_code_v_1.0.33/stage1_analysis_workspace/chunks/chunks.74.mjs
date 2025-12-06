
// @from(Start 6926723, End 6954251)
jkB = z((NBG, PkB) => {
  var {
    defineProperty: hoA,
    getOwnPropertyDescriptor: GT6,
    getOwnPropertyNames: ZT6
  } = Object, IT6 = Object.prototype.hasOwnProperty, EB = (A, Q) => hoA(A, "name", {
    value: Q,
    configurable: !0
  }), YT6 = (A, Q) => {
    for (var B in Q) hoA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, JT6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ZT6(Q))
        if (!IT6.call(A, Z) && Z !== B) hoA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = GT6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, WT6 = (A) => JT6(hoA({}, "__esModule", {
    value: !0
  }), A), JkB = {};
  YT6(JkB, {
    Client: () => VT6,
    Command: () => KkB,
    LazyJsonString: () => YP6,
    NoOpLogger: () => XT6,
    SENSITIVE_STRING: () => DT6,
    ServiceException: () => aT6,
    StringWrapper: () => ZwA,
    _json: () => Cc1,
    collectBody: () => FT6,
    convertMap: () => JP6,
    createAggregatedClient: () => HT6,
    dateToUtcString: () => $kB,
    decorateServiceException: () => qkB,
    emitWarningIfUnsupportedVersion: () => tT6,
    expectBoolean: () => ET6,
    expectByte: () => Hc1,
    expectFloat32: () => voA,
    expectInt: () => UT6,
    expectInt32: () => Kc1,
    expectLong: () => BwA,
    expectNonNull: () => wT6,
    expectNumber: () => QwA,
    expectObject: () => HkB,
    expectShort: () => Dc1,
    expectString: () => qT6,
    expectUnion: () => NT6,
    extendedEncodeURIComponent: () => foA,
    getArrayIfSingleItem: () => IP6,
    getDefaultClientConfiguration: () => GP6,
    getDefaultExtensionConfiguration: () => LkB,
    getValueFromTextNode: () => MkB,
    handleFloat: () => OT6,
    limitedParseDouble: () => Uc1,
    limitedParseFloat: () => RT6,
    limitedParseFloat32: () => TT6,
    loadConfigsForDefaultMode: () => oT6,
    logger: () => GwA,
    map: () => wc1,
    parseBoolean: () => CT6,
    parseEpochTimestamp: () => gT6,
    parseRfc3339DateTime: () => kT6,
    parseRfc3339DateTimeWithOffset: () => xT6,
    parseRfc7231DateTime: () => hT6,
    resolveDefaultRuntimeConfig: () => ZP6,
    resolvedPath: () => KP6,
    serializeFloat: () => DP6,
    splitEvery: () => TkB,
    strictParseByte: () => UkB,
    strictParseDouble: () => zc1,
    strictParseFloat: () => LT6,
    strictParseFloat32: () => CkB,
    strictParseInt: () => PT6,
    strictParseInt32: () => jT6,
    strictParseLong: () => zkB,
    strictParseShort: () => $GA,
    take: () => WP6,
    throwDefaultError: () => NkB,
    withBaseException: () => sT6
  });
  PkB.exports = WT6(JkB);
  var WkB = class {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };
  EB(WkB, "NoOpLogger");
  var XT6 = WkB,
    XkB = V_B(),
    VkB = class {
      constructor(Q) {
        this.middlewareStack = (0, XkB.constructStack)(), this.config = Q
      }
      send(Q, B, G) {
        let Z = typeof B !== "function" ? B : void 0,
          I = typeof B === "function" ? B : G,
          Y = Q.resolveMiddleware(this.middlewareStack, this.config, Z);
        if (I) Y(Q).then((J) => I(null, J.output), (J) => I(J)).catch(() => {});
        else return Y(Q).then((J) => J.output)
      }
      destroy() {
        if (this.config.requestHandler.destroy) this.config.requestHandler.destroy()
      }
    };
  EB(VkB, "Client");
  var VT6 = VkB,
    Xc1 = IkB(),
    FT6 = EB(async (A = new Uint8Array, Q) => {
      if (A instanceof Uint8Array) return Xc1.Uint8ArrayBlobAdapter.mutate(A);
      if (!A) return Xc1.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
      let B = Q.streamCollector(A);
      return Xc1.Uint8ArrayBlobAdapter.mutate(await B)
    }, "collectBody"),
    Fc1 = Md1(),
    FkB = class {
      constructor() {
        this.middlewareStack = (0, XkB.constructStack)()
      }
      static classBuilder() {
        return new KT6
      }
      resolveMiddlewareWithContext(Q, B, G, {
        middlewareFn: Z,
        clientName: I,
        commandName: Y,
        inputFilterSensitiveLog: J,
        outputFilterSensitiveLog: W,
        smithyContext: X,
        additionalContext: V,
        CommandCtor: F
      }) {
        for (let E of Z.bind(this)(F, Q, B, G)) this.middlewareStack.use(E);
        let K = Q.concat(this.middlewareStack),
          {
            logger: D
          } = B,
          H = {
            logger: D,
            clientName: I,
            commandName: Y,
            inputFilterSensitiveLog: J,
            outputFilterSensitiveLog: W,
            [Fc1.SMITHY_CONTEXT_KEY]: {
              ...X
            },
            ...V
          },
          {
            requestHandler: C
          } = B;
        return K.resolve((E) => C.handle(E.request, G || {}), H)
      }
    };
  EB(FkB, "Command");
  var KkB = FkB,
    DkB = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (Q) => Q, this._outputFilterSensitiveLog = (Q) => Q, this._serializer = null, this._deserializer = null
      }
      init(Q) {
        this._init = Q
      }
      ep(Q) {
        return this._ep = Q, this
      }
      m(Q) {
        return this._middlewareFn = Q, this
      }
      s(Q, B, G = {}) {
        return this._smithyContext = {
          service: Q,
          operation: B,
          ...G
        }, this
      }
      c(Q = {}) {
        return this._additionalContext = Q, this
      }
      n(Q, B) {
        return this._clientName = Q, this._commandName = B, this
      }
      f(Q = (G) => G, B = (G) => G) {
        return this._inputFilterSensitiveLog = Q, this._outputFilterSensitiveLog = B, this
      }
      ser(Q) {
        return this._serializer = Q, this
      }
      de(Q) {
        return this._deserializer = Q, this
      }
      build() {
        var Q;
        let B = this,
          G;
        return G = (Q = class extends KkB {
          constructor(...[Z]) {
            super();
            this.serialize = B._serializer, this.deserialize = B._deserializer, this.input = Z ?? {}, B._init(this)
          }
          static getEndpointParameterInstructions() {
            return B._ep
          }
          resolveMiddleware(Z, I, Y) {
            return this.resolveMiddlewareWithContext(Z, I, Y, {
              CommandCtor: G,
              middlewareFn: B._middlewareFn,
              clientName: B._clientName,
              commandName: B._commandName,
              inputFilterSensitiveLog: B._inputFilterSensitiveLog,
              outputFilterSensitiveLog: B._outputFilterSensitiveLog,
              smithyContext: B._smithyContext,
              additionalContext: B._additionalContext
            })
          }
        }, EB(Q, "CommandRef"), Q)
      }
    };
  EB(DkB, "ClassBuilder");
  var KT6 = DkB,
    DT6 = "***SensitiveInformation***",
    HT6 = EB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = EB(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    CT6 = EB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    ET6 = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) GwA.warn(boA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") GwA.warn(boA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    QwA = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) GwA.warn(boA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    zT6 = Math.ceil(340282346638528860000000000000000000000),
    voA = EB((A) => {
      let Q = QwA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > zT6) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    BwA = EB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    UT6 = BwA,
    Kc1 = EB((A) => Ec1(A, 32), "expectInt32"),
    Dc1 = EB((A) => Ec1(A, 16), "expectShort"),
    Hc1 = EB((A) => Ec1(A, 8), "expectByte"),
    Ec1 = EB((A, Q) => {
      let B = BwA(A);
      if (B !== void 0 && $T6(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    $T6 = EB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    wT6 = EB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    HkB = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    qT6 = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return GwA.warn(boA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    NT6 = EB((A) => {
      if (A === null || A === void 0) return;
      let Q = HkB(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    zc1 = EB((A) => {
      if (typeof A == "string") return QwA(qGA(A));
      return QwA(A)
    }, "strictParseDouble"),
    LT6 = zc1,
    CkB = EB((A) => {
      if (typeof A == "string") return voA(qGA(A));
      return voA(A)
    }, "strictParseFloat32"),
    MT6 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    qGA = EB((A) => {
      let Q = A.match(MT6);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    Uc1 = EB((A) => {
      if (typeof A == "string") return EkB(A);
      return QwA(A)
    }, "limitedParseDouble"),
    OT6 = Uc1,
    RT6 = Uc1,
    TT6 = EB((A) => {
      if (typeof A == "string") return EkB(A);
      return voA(A)
    }, "limitedParseFloat32"),
    EkB = EB((A) => {
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
    }, "parseFloatString"),
    zkB = EB((A) => {
      if (typeof A === "string") return BwA(qGA(A));
      return BwA(A)
    }, "strictParseLong"),
    PT6 = zkB,
    jT6 = EB((A) => {
      if (typeof A === "string") return Kc1(qGA(A));
      return Kc1(A)
    }, "strictParseInt32"),
    $GA = EB((A) => {
      if (typeof A === "string") return Dc1(qGA(A));
      return Dc1(A)
    }, "strictParseShort"),
    UkB = EB((A) => {
      if (typeof A === "string") return Hc1(qGA(A));
      return Hc1(A)
    }, "strictParseByte"),
    boA = EB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    GwA = {
      warn: console.warn
    },
    ST6 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    $c1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function $kB(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      I = A.getUTCHours(),
      Y = A.getUTCMinutes(),
      J = A.getUTCSeconds(),
      W = Z < 10 ? `0${Z}` : `${Z}`,
      X = I < 10 ? `0${I}` : `${I}`,
      V = Y < 10 ? `0${Y}` : `${Y}`,
      F = J < 10 ? `0${J}` : `${J}`;
    return `${ST6[G]}, ${W} ${$c1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  EB($kB, "dateToUtcString");
  var _T6 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    kT6 = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = _T6.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = $GA(wGA(G)), F = l_(Z, "month", 1, 12), K = l_(I, "day", 1, 31);
      return AwA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    yT6 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    xT6 = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = yT6.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = $GA(wGA(G)), K = l_(Z, "month", 1, 12), D = l_(I, "day", 1, 31), H = AwA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - nT6(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    vT6 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    bT6 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    fT6 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    hT6 = EB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = vT6.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return AwA($GA(wGA(I)), Vc1(Z), l_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = bT6.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return dT6(AwA(uT6(I), Vc1(Z), l_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = fT6.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return AwA($GA(wGA(X)), Vc1(G), l_(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    gT6 = EB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = zc1(A);
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    AwA = EB((A, Q, B, G) => {
      let Z = Q - 1;
      return pT6(A, Z, B), new Date(Date.UTC(A, Z, B, l_(G.hours, "hour", 0, 23), l_(G.minutes, "minute", 0, 59), l_(G.seconds, "seconds", 0, 60), iT6(G.fractionalMilliseconds)))
    }, "buildDate"),
    uT6 = EB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + $GA(wGA(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    mT6 = 1576800000000,
    dT6 = EB((A) => {
      if (A.getTime() - new Date().getTime() > mT6) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    Vc1 = EB((A) => {
      let Q = $c1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    cT6 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    pT6 = EB((A, Q, B) => {
      let G = cT6[Q];
      if (Q === 1 && lT6(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${$c1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    lT6 = EB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    l_ = EB((A, Q, B, G) => {
      let Z = UkB(wGA(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    iT6 = EB((A) => {
      if (A === null || A === void 0) return 0;
      return CkB("0." + A) * 1000
    }, "parseMilliseconds"),
    nT6 = EB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    wGA = EB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    wkB = class A extends Error {
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, A.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
    };
  EB(wkB, "ServiceException");
  var aT6 = wkB,
    qkB = EB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    NkB = EB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = rT6(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: (Q == null ? void 0 : Q.code) || (Q == null ? void 0 : Q.Code) || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw qkB(Y, Q)
    }, "throwDefaultError"),
    sT6 = EB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        NkB({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    rT6 = EB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    oT6 = EB((A) => {
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
    }, "loadConfigsForDefaultMode"),
    YkB = !1,
    tT6 = EB((A) => {
      if (A && !YkB && parseInt(A.substring(1, A.indexOf("."))) < 14) YkB = !0
    }, "emitWarningIfUnsupportedVersion"),
    eT6 = EB((A) => {
      let Q = [];
      for (let B in Fc1.AlgorithmId) {
        let G = Fc1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    AP6 = EB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    QP6 = EB((A) => {
      let Q = A.retryStrategy;
      return {
        setRetryStrategy(B) {
          Q = B
        },
        retryStrategy() {
          return Q
        }
      }
    }, "getRetryConfiguration"),
    BP6 = EB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    LkB = EB((A) => {
      return {
        ...eT6(A),
        ...QP6(A)
      }
    }, "getDefaultExtensionConfiguration"),
    GP6 = LkB,
    ZP6 = EB((A) => {
      return {
        ...AP6(A),
        ...BP6(A)
      }
    }, "resolveDefaultRuntimeConfig");

  function foA(A) {
    return encodeURIComponent(A).replace(/[!'()*]/g, function(Q) {
      return "%" + Q.charCodeAt(0).toString(16).toUpperCase()
    })
  }
  EB(foA, "extendedEncodeURIComponent");
  var IP6 = EB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    MkB = EB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = MkB(A[B]);
      return A
    }, "getValueFromTextNode"),
    ZwA = EB(function() {
      let A = Object.getPrototypeOf(this).constructor,
        B = new(Function.bind.apply(String, [null, ...arguments]));
      return Object.setPrototypeOf(B, A.prototype), B
    }, "StringWrapper");
  ZwA.prototype = Object.create(String.prototype, {
    constructor: {
      value: ZwA,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
  Object.setPrototypeOf(ZwA, String);
  var OkB = class A extends ZwA {
    deserializeJSON() {
      return JSON.parse(super.toString())
    }
    toJSON() {
      return super.toString()
    }
    static fromObject(Q) {
      if (Q instanceof A) return Q;
      else if (Q instanceof String || typeof Q === "string") return new A(Q);
      return new A(JSON.stringify(Q))
    }
  };
  EB(OkB, "LazyJsonString");
  var YP6 = OkB;

  function wc1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, XP6(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      RkB(G, null, I, Y)
    }
    return G
  }
  EB(wc1, "map");
  var JP6 = EB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    WP6 = EB((A, Q) => {
      let B = {};
      for (let G in Q) RkB(B, A, Q, G);
      return B
    }, "take"),
    XP6 = EB((A, Q, B) => {
      return wc1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    RkB = EB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = VP6, W = FP6, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    VP6 = EB((A) => A != null, "nonNullish"),
    FP6 = EB((A) => A, "pass"),
    KP6 = EB((A, Q, B, G, Z, I) => {
      if (Q != null && Q[B] !== void 0) {
        let Y = G();
        if (Y.length <= 0) throw Error("Empty value provided for input HTTP label: " + B + ".");
        A = A.replace(Z, I ? Y.split("/").map((J) => foA(J)).join("/") : foA(Y))
      } else throw Error("No value provided for input HTTP label: " + B + ".");
      return A
    }, "resolvedPath"),
    DP6 = EB((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    Cc1 = EB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Cc1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Cc1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function TkB(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      I = "";
    for (let Y = 0; Y < G.length; Y++) {
      if (I === "") I = G[Y];
      else I += Q + G[Y];
      if ((Y + 1) % B === 0) Z.push(I), I = ""
    }
    if (I !== "") Z.push(I);
    return Z
  }
  EB(TkB, "splitEvery")
})
// @from(Start 6954257, End 6957040)
gkB = z((MBG, hkB) => {
  var {
    defineProperty: goA,
    getOwnPropertyDescriptor: HP6,
    getOwnPropertyNames: CP6
  } = Object, EP6 = Object.prototype.hasOwnProperty, uoA = (A, Q) => goA(A, "name", {
    value: Q,
    configurable: !0
  }), zP6 = (A, Q) => {
    for (var B in Q) goA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, UP6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of CP6(Q))
        if (!EP6.call(A, Z) && Z !== B) goA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = HP6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $P6 = (A) => UP6(goA({}, "__esModule", {
    value: !0
  }), A), SkB = {};
  zP6(SkB, {
    AlgorithmId: () => xkB,
    EndpointURLScheme: () => ykB,
    FieldPosition: () => vkB,
    HttpApiKeyAuthLocation: () => kkB,
    HttpAuthLocation: () => _kB,
    IniSectionType: () => bkB,
    RequestHandlerProtocol: () => fkB,
    SMITHY_CONTEXT_KEY: () => MP6,
    getDefaultClientConfiguration: () => NP6,
    resolveDefaultRuntimeConfig: () => LP6
  });
  hkB.exports = $P6(SkB);
  var _kB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(_kB || {}),
    kkB = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(kkB || {}),
    ykB = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(ykB || {}),
    xkB = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(xkB || {}),
    wP6 = uoA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
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
    }, "getChecksumConfiguration"),
    qP6 = uoA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    NP6 = uoA((A) => {
      return wP6(A)
    }, "getDefaultClientConfiguration"),
    LP6 = uoA((A) => {
      return qP6(A)
    }, "resolveDefaultRuntimeConfig"),
    vkB = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(vkB || {}),
    MP6 = "__smithy_context",
    bkB = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(bkB || {}),
    fkB = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(fkB || {})
})
// @from(Start 6957046, End 6961553)
lkB = z((OBG, pkB) => {
  var {
    defineProperty: moA,
    getOwnPropertyDescriptor: OP6,
    getOwnPropertyNames: RP6
  } = Object, TP6 = Object.prototype.hasOwnProperty, yp = (A, Q) => moA(A, "name", {
    value: Q,
    configurable: !0
  }), PP6 = (A, Q) => {
    for (var B in Q) moA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, jP6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of RP6(Q))
        if (!TP6.call(A, Z) && Z !== B) moA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = OP6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, SP6 = (A) => jP6(moA({}, "__esModule", {
    value: !0
  }), A), ukB = {};
  PP6(ukB, {
    Field: () => yP6,
    Fields: () => xP6,
    HttpRequest: () => vP6,
    HttpResponse: () => bP6,
    IHttpRequest: () => mkB.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => _P6,
    isValidHostname: () => ckB,
    resolveHttpHandlerRuntimeConfig: () => kP6
  });
  pkB.exports = SP6(ukB);
  var _P6 = yp((A) => {
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
    }, "getHttpHandlerExtensionConfiguration"),
    kP6 = yp((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    mkB = gkB(),
    yP6 = class {
      static {
        yp(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = mkB.FieldPosition.HEADER,
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
    },
    xP6 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        yp(this, "Fields")
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
    },
    vP6 = class A {
      static {
        yp(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = dkB(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function dkB(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  yp(dkB, "cloneQuery");
  var bP6 = class {
    static {
      yp(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function ckB(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  yp(ckB, "isValidHostname")
})
// @from(Start 6961559, End 6964114)
AyB = z((jBG, ekB) => {
  var {
    defineProperty: doA,
    getOwnPropertyDescriptor: fP6,
    getOwnPropertyNames: hP6
  } = Object, gP6 = Object.prototype.hasOwnProperty, IwA = (A, Q) => doA(A, "name", {
    value: Q,
    configurable: !0
  }), uP6 = (A, Q) => {
    for (var B in Q) doA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, mP6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of hP6(Q))
        if (!gP6.call(A, Z) && Z !== B) doA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = fP6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, dP6 = (A) => mP6(doA({}, "__esModule", {
    value: !0
  }), A), ikB = {};
  uP6(ikB, {
    eventStreamHandlingMiddleware: () => skB,
    eventStreamHandlingMiddlewareOptions: () => rkB,
    eventStreamHeaderMiddleware: () => okB,
    eventStreamHeaderMiddlewareOptions: () => tkB,
    getEventStreamPlugin: () => cP6,
    resolveEventStreamConfig: () => nkB
  });
  ekB.exports = dP6(ikB);

  function nkB(A) {
    let {
      signer: Q,
      signer: B
    } = A, G = Object.assign(A, {
      eventSigner: Q,
      messageSigner: B
    }), Z = G.eventStreamPayloadHandlerProvider(G);
    return Object.assign(G, {
      eventStreamPayloadHandler: Z
    })
  }
  IwA(nkB, "resolveEventStreamConfig");
  var akB = lkB(),
    skB = IwA((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!akB.HttpRequest.isInstance(Z)) return Q(G);
      return A.eventStreamPayloadHandler.handle(Q, G, B)
    }, "eventStreamHandlingMiddleware"),
    rkB = {
      tags: ["EVENT_STREAM", "SIGNATURE", "HANDLE"],
      name: "eventStreamHandlingMiddleware",
      relation: "after",
      toMiddleware: "awsAuthMiddleware",
      override: !0
    },
    okB = IwA((A) => async (Q) => {
      let {
        request: B
      } = Q;
      if (!akB.HttpRequest.isInstance(B)) return A(Q);
      return B.headers = {
        ...B.headers,
        "content-type": "application/vnd.amazon.eventstream",
        "x-amz-content-sha256": "STREAMING-AWS4-HMAC-SHA256-EVENTS"
      }, A({
        ...Q,
        request: B
      })
    }, "eventStreamHeaderMiddleware"),
    tkB = {
      step: "build",
      tags: ["EVENT_STREAM", "HEADER", "CONTENT_TYPE", "CONTENT_SHA256"],
      name: "eventStreamHeaderMiddleware",
      override: !0
    },
    cP6 = IwA((A) => ({
      applyToStack: IwA((Q) => {
        Q.addRelativeTo(skB(A), rkB), Q.add(okB, tkB)
      }, "applyToStack")
    }), "getEventStreamPlugin")
})
// @from(Start 6964120, End 6965060)
GyB = z((SBG, ByB) => {
  var {
    defineProperty: coA,
    getOwnPropertyDescriptor: pP6,
    getOwnPropertyNames: lP6
  } = Object, iP6 = Object.prototype.hasOwnProperty, nP6 = (A, Q) => coA(A, "name", {
    value: Q,
    configurable: !0
  }), aP6 = (A, Q) => {
    for (var B in Q) coA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sP6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lP6(Q))
        if (!iP6.call(A, Z) && Z !== B) coA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pP6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rP6 = (A) => sP6(coA({}, "__esModule", {
    value: !0
  }), A), QyB = {};
  aP6(QyB, {
    resolveEventStreamSerdeConfig: () => oP6
  });
  ByB.exports = rP6(QyB);
  var oP6 = nP6((A) => Object.assign(A, {
    eventStreamMarshaller: A.eventStreamSerdeProvider(A)
  }), "resolveEventStreamSerdeConfig")
})
// @from(Start 6965066, End 6966409)
Nc1 = z((ZyB) => {
  Object.defineProperty(ZyB, "__esModule", {
    value: !0
  });
  ZyB.resolveHttpAuthSchemeConfig = ZyB.defaultBedrockRuntimeHttpAuthSchemeProvider = ZyB.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = void 0;
  var tP6 = jF(),
    qc1 = w7(),
    eP6 = async (A, Q, B) => {
      return {
        operation: (0, qc1.getSmithyContext)(Q).operation,
        region: await (0, qc1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  ZyB.defaultBedrockRuntimeHttpAuthSchemeParametersProvider = eP6;

  function Aj6(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "bedrock",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }
  var Qj6 = (A) => {
    let Q = [];
    switch (A.operation) {
      default:
        Q.push(Aj6(A))
    }
    return Q
  };
  ZyB.defaultBedrockRuntimeHttpAuthSchemeProvider = Qj6;
  var Bj6 = (A) => {
    let Q = (0, tP6.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, qc1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  ZyB.resolveHttpAuthSchemeConfig = Bj6
})
// @from(Start 6966415, End 6983671)
xyB = z((kBG, ioA) => {
  var YyB, JyB, WyB, XyB, VyB, FyB, KyB, DyB, HyB, CyB, EyB, zyB, UyB, poA, Lc1, $yB, wyB, qyB, NGA, NyB, LyB, MyB, OyB, RyB, TyB, PyB, jyB, SyB, loA, _yB, kyB, yyB;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof ioA === "object" && typeof kBG === "object") A(B(Q, B(kBG)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function(I, Y) {
        return G[I] = Z ? Z(I, Y) : Y
      }
    }
  })(function(A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    YyB = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, JyB = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, WyB = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, XyB = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, VyB = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, FyB = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, KyB = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, DyB = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, HyB = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, CyB = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, EyB = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, zyB = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, UyB = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) loA(Y, I, J)
    }, loA = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, poA = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, Lc1 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, $yB = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(Lc1(arguments[Y]));
      return I
    }, wyB = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, qyB = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, NGA = function(I) {
      return this instanceof NGA ? (this.v = I, this) : new NGA(I)
    }, NyB = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof NGA ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, LyB = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: NGA(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, MyB = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof poA === "function" ? poA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, OyB = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    RyB = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") loA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, TyB = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, PyB = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, jyB = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, SyB = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, _yB = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    kyB = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, yyB = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", YyB), A("__assign", JyB), A("__rest", WyB), A("__decorate", XyB), A("__param", VyB), A("__esDecorate", FyB), A("__runInitializers", KyB), A("__propKey", DyB), A("__setFunctionName", HyB), A("__metadata", CyB), A("__awaiter", EyB), A("__generator", zyB), A("__exportStar", UyB), A("__createBinding", loA), A("__values", poA), A("__read", Lc1), A("__spread", $yB), A("__spreadArrays", wyB), A("__spreadArray", qyB), A("__await", NGA), A("__asyncGenerator", NyB), A("__asyncDelegator", LyB), A("__asyncValues", MyB), A("__makeTemplateObject", OyB), A("__importStar", RyB), A("__importDefault", TyB), A("__classPrivateFieldGet", PyB), A("__classPrivateFieldSet", jyB), A("__classPrivateFieldIn", SyB), A("__addDisposableResource", _yB), A("__disposeResources", kyB), A("__rewriteRelativeImportExtension", yyB)
  })
})
// @from(Start 6983677, End 6987749)
vyB = z((yBG, Ij6) => {
  Ij6.exports = {
    name: "@aws-sdk/client-bedrock-runtime",
    description: "AWS SDK for JavaScript Bedrock Runtime Client for Node.js, Browser and React Native",
    version: "3.797.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-bedrock-runtime",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock-runtime"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.796.0",
      "@aws-sdk/credential-provider-node": "3.797.0",
      "@aws-sdk/eventstream-handler-node": "3.775.0",
      "@aws-sdk/middleware-eventstream": "3.775.0",
      "@aws-sdk/middleware-host-header": "3.775.0",
      "@aws-sdk/middleware-logger": "3.775.0",
      "@aws-sdk/middleware-recursion-detection": "3.775.0",
      "@aws-sdk/middleware-user-agent": "3.796.0",
      "@aws-sdk/region-config-resolver": "3.775.0",
      "@aws-sdk/types": "3.775.0",
      "@aws-sdk/util-endpoints": "3.787.0",
      "@aws-sdk/util-user-agent-browser": "3.775.0",
      "@aws-sdk/util-user-agent-node": "3.796.0",
      "@smithy/config-resolver": "^4.1.0",
      "@smithy/core": "^3.2.0",
      "@smithy/eventstream-serde-browser": "^4.0.2",
      "@smithy/eventstream-serde-config-resolver": "^4.1.0",
      "@smithy/eventstream-serde-node": "^4.0.2",
      "@smithy/fetch-http-handler": "^5.0.2",
      "@smithy/hash-node": "^4.0.2",
      "@smithy/invalid-dependency": "^4.0.2",
      "@smithy/middleware-content-length": "^4.0.2",
      "@smithy/middleware-endpoint": "^4.1.0",
      "@smithy/middleware-retry": "^4.1.0",
      "@smithy/middleware-serde": "^4.0.3",
      "@smithy/middleware-stack": "^4.0.2",
      "@smithy/node-config-provider": "^4.0.2",
      "@smithy/node-http-handler": "^4.0.4",
      "@smithy/protocol-http": "^5.1.0",
      "@smithy/smithy-client": "^4.2.0",
      "@smithy/types": "^4.2.0",
      "@smithy/url-parser": "^4.0.2",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.8",
      "@smithy/util-defaults-mode-node": "^4.0.8",
      "@smithy/util-endpoints": "^3.0.2",
      "@smithy/util-middleware": "^4.0.2",
      "@smithy/util-retry": "^4.0.2",
      "@smithy/util-stream": "^4.2.0",
      "@smithy/util-utf8": "^4.0.0",
      "@types/uuid": "^9.0.1",
      tslib: "^2.6.2",
      uuid: "^9.0.1"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.2.2"
    },
    engines: {
      node: ">=18.0.0"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["dist-*/**"],
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    browser: {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
    },
    "react-native": {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
    },
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock-runtime",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-bedrock-runtime"
    }
  }
})
// @from(Start 6987755, End 7005011)
Oc1 = z((xBG, soA) => {
  var byB, fyB, hyB, gyB, uyB, myB, dyB, cyB, pyB, lyB, iyB, nyB, ayB, noA, Mc1, syB, ryB, oyB, LGA, tyB, eyB, AxB, QxB, BxB, GxB, ZxB, IxB, YxB, aoA, JxB, WxB, XxB;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof soA === "object" && typeof xBG === "object") A(B(Q, B(xBG)));
    else A(B(Q));

    function B(G, Z) {
      if (G !== Q)
        if (typeof Object.create === "function") Object.defineProperty(G, "__esModule", {
          value: !0
        });
        else G.__esModule = !0;
      return function(I, Y) {
        return G[I] = Z ? Z(I, Y) : Y
      }
    }
  })(function(A) {
    var Q = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function(I, Y) {
      I.__proto__ = Y
    } || function(I, Y) {
      for (var J in Y)
        if (Object.prototype.hasOwnProperty.call(Y, J)) I[J] = Y[J]
    };
    byB = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, fyB = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, hyB = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, gyB = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, uyB = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, myB = function(I, Y, J, W, X, V) {
      function F(T) {
        if (T !== void 0 && typeof T !== "function") throw TypeError("Function expected");
        return T
      }
      var K = W.kind,
        D = K === "getter" ? "get" : K === "setter" ? "set" : "value",
        H = !Y && I ? W.static ? I : I.prototype : null,
        C = Y || (H ? Object.getOwnPropertyDescriptor(H, W.name) : {}),
        E, U = !1;
      for (var q = J.length - 1; q >= 0; q--) {
        var w = {};
        for (var N in W) w[N] = N === "access" ? {} : W[N];
        for (var N in W.access) w.access[N] = W.access[N];
        w.addInitializer = function(T) {
          if (U) throw TypeError("Cannot add initializers after decoration has completed");
          V.push(F(T || null))
        };
        var R = (0, J[q])(K === "accessor" ? {
          get: C.get,
          set: C.set
        } : C[D], w);
        if (K === "accessor") {
          if (R === void 0) continue;
          if (R === null || typeof R !== "object") throw TypeError("Object expected");
          if (E = F(R.get)) C.get = E;
          if (E = F(R.set)) C.set = E;
          if (E = F(R.init)) X.unshift(E)
        } else if (E = F(R))
          if (K === "field") X.unshift(E);
          else C[D] = E
      }
      if (H) Object.defineProperty(H, W.name, C);
      U = !0
    }, dyB = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, cyB = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, pyB = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, lyB = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, iyB = function(I, Y, J, W) {
      function X(V) {
        return V instanceof J ? V : new J(function(F) {
          F(V)
        })
      }
      return new(J || (J = Promise))(function(V, F) {
        function K(C) {
          try {
            H(W.next(C))
          } catch (E) {
            F(E)
          }
        }

        function D(C) {
          try {
            H(W.throw(C))
          } catch (E) {
            F(E)
          }
        }

        function H(C) {
          C.done ? V(C.value) : X(C.value).then(K, D)
        }
        H((W = W.apply(I, Y || [])).next())
      })
    }, nyB = function(I, Y) {
      var J = {
          label: 0,
          sent: function() {
            if (V[0] & 1) throw V[1];
            return V[1]
          },
          trys: [],
          ops: []
        },
        W, X, V, F = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return F.next = K(0), F.throw = K(1), F.return = K(2), typeof Symbol === "function" && (F[Symbol.iterator] = function() {
        return this
      }), F;

      function K(H) {
        return function(C) {
          return D([H, C])
        }
      }

      function D(H) {
        if (W) throw TypeError("Generator is already executing.");
        while (F && (F = 0, H[0] && (J = 0)), J) try {
          if (W = 1, X && (V = H[0] & 2 ? X.return : H[0] ? X.throw || ((V = X.return) && V.call(X), 0) : X.next) && !(V = V.call(X, H[1])).done) return V;
          if (X = 0, V) H = [H[0] & 2, V.value];
          switch (H[0]) {
            case 0:
            case 1:
              V = H;
              break;
            case 4:
              return J.label++, {
                value: H[1],
                done: !1
              };
            case 5:
              J.label++, X = H[1], H = [0];
              continue;
            case 7:
              H = J.ops.pop(), J.trys.pop();
              continue;
            default:
              if ((V = J.trys, !(V = V.length > 0 && V[V.length - 1])) && (H[0] === 6 || H[0] === 2)) {
                J = 0;
                continue
              }
              if (H[0] === 3 && (!V || H[1] > V[0] && H[1] < V[3])) {
                J.label = H[1];
                break
              }
              if (H[0] === 6 && J.label < V[1]) {
                J.label = V[1], V = H;
                break
              }
              if (V && J.label < V[2]) {
                J.label = V[2], J.ops.push(H);
                break
              }
              if (V[2]) J.ops.pop();
              J.trys.pop();
              continue
          }
          H = Y.call(I, J)
        } catch (C) {
          H = [6, C], X = 0
        } finally {
          W = V = 0
        }
        if (H[0] & 5) throw H[1];
        return {
          value: H[0] ? H[1] : void 0,
          done: !0
        }
      }
    }, ayB = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) aoA(Y, I, J)
    }, aoA = Object.create ? function(I, Y, J, W) {
      if (W === void 0) W = J;
      var X = Object.getOwnPropertyDescriptor(Y, J);
      if (!X || ("get" in X ? !Y.__esModule : X.writable || X.configurable)) X = {
        enumerable: !0,
        get: function() {
          return Y[J]
        }
      };
      Object.defineProperty(I, W, X)
    } : function(I, Y, J, W) {
      if (W === void 0) W = J;
      I[W] = Y[J]
    }, noA = function(I) {
      var Y = typeof Symbol === "function" && Symbol.iterator,
        J = Y && I[Y],
        W = 0;
      if (J) return J.call(I);
      if (I && typeof I.length === "number") return {
        next: function() {
          if (I && W >= I.length) I = void 0;
          return {
            value: I && I[W++],
            done: !I
          }
        }
      };
      throw TypeError(Y ? "Object is not iterable." : "Symbol.iterator is not defined.")
    }, Mc1 = function(I, Y) {
      var J = typeof Symbol === "function" && I[Symbol.iterator];
      if (!J) return I;
      var W = J.call(I),
        X, V = [],
        F;
      try {
        while ((Y === void 0 || Y-- > 0) && !(X = W.next()).done) V.push(X.value)
      } catch (K) {
        F = {
          error: K
        }
      } finally {
        try {
          if (X && !X.done && (J = W.return)) J.call(W)
        } finally {
          if (F) throw F.error
        }
      }
      return V
    }, syB = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(Mc1(arguments[Y]));
      return I
    }, ryB = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, oyB = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, LGA = function(I) {
      return this instanceof LGA ? (this.v = I, this) : new LGA(I)
    }, tyB = function(I, Y, J) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var W = J.apply(I, Y || []),
        X, V = [];
      return X = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), K("next"), K("throw"), K("return", F), X[Symbol.asyncIterator] = function() {
        return this
      }, X;

      function F(q) {
        return function(w) {
          return Promise.resolve(w).then(q, E)
        }
      }

      function K(q, w) {
        if (W[q]) {
          if (X[q] = function(N) {
              return new Promise(function(R, T) {
                V.push([q, N, R, T]) > 1 || D(q, N)
              })
            }, w) X[q] = w(X[q])
        }
      }

      function D(q, w) {
        try {
          H(W[q](w))
        } catch (N) {
          U(V[0][3], N)
        }
      }

      function H(q) {
        q.value instanceof LGA ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
      }

      function C(q) {
        D("next", q)
      }

      function E(q) {
        D("throw", q)
      }

      function U(q, w) {
        if (q(w), V.shift(), V.length) D(V[0][0], V[0][1])
      }
    }, eyB = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: LGA(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, AxB = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof noA === "function" ? noA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
        return this
      }, J);

      function W(V) {
        J[V] = I[V] && function(F) {
          return new Promise(function(K, D) {
            F = I[V](F), X(K, D, F.done, F.value)
          })
        }
      }

      function X(V, F, K, D) {
        Promise.resolve(D).then(function(H) {
          V({
            value: H,
            done: K
          })
        }, F)
      }
    }, QxB = function(I, Y) {
      if (Object.defineProperty) Object.defineProperty(I, "raw", {
        value: Y
      });
      else I.raw = Y;
      return I
    };
    var B = Object.create ? function(I, Y) {
        Object.defineProperty(I, "default", {
          enumerable: !0,
          value: Y
        })
      } : function(I, Y) {
        I.default = Y
      },
      G = function(I) {
        return G = Object.getOwnPropertyNames || function(Y) {
          var J = [];
          for (var W in Y)
            if (Object.prototype.hasOwnProperty.call(Y, W)) J[J.length] = W;
          return J
        }, G(I)
      };
    BxB = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") aoA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, GxB = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, ZxB = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, IxB = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, YxB = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, JxB = function(I, Y, J) {
      if (Y !== null && Y !== void 0) {
        if (typeof Y !== "object" && typeof Y !== "function") throw TypeError("Object expected.");
        var W, X;
        if (J) {
          if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
          W = Y[Symbol.asyncDispose]
        }
        if (W === void 0) {
          if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
          if (W = Y[Symbol.dispose], J) X = W
        }
        if (typeof W !== "function") throw TypeError("Object not disposable.");
        if (X) W = function() {
          try {
            X.call(this)
          } catch (V) {
            return Promise.reject(V)
          }
        };
        I.stack.push({
          value: Y,
          dispose: W,
          async: J
        })
      } else if (J) I.stack.push({
        async: !0
      });
      return Y
    };
    var Z = typeof SuppressedError === "function" ? SuppressedError : function(I, Y, J) {
      var W = Error(J);
      return W.name = "SuppressedError", W.error = I, W.suppressed = Y, W
    };
    WxB = function(I) {
      function Y(V) {
        I.error = I.hasError ? new Z(V, I.error, "An error was suppressed during disposal.") : V, I.hasError = !0
      }
      var J, W = 0;

      function X() {
        while (J = I.stack.pop()) try {
          if (!J.async && W === 1) return W = 0, I.stack.push(J), Promise.resolve().then(X);
          if (J.dispose) {
            var V = J.dispose.call(J.value);
            if (J.async) return W |= 2, Promise.resolve(V).then(X, function(F) {
              return Y(F), X()
            })
          } else W |= 1
        } catch (F) {
          Y(F)
        }
        if (W === 1) return I.hasError ? Promise.reject(I.error) : Promise.resolve();
        if (I.hasError) throw I.error
      }
      return X()
    }, XxB = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", byB), A("__assign", fyB), A("__rest", hyB), A("__decorate", gyB), A("__param", uyB), A("__esDecorate", myB), A("__runInitializers", dyB), A("__propKey", cyB), A("__setFunctionName", pyB), A("__metadata", lyB), A("__awaiter", iyB), A("__generator", nyB), A("__exportStar", ayB), A("__createBinding", aoA), A("__values", noA), A("__read", Mc1), A("__spread", syB), A("__spreadArrays", ryB), A("__spreadArray", oyB), A("__await", LGA), A("__asyncGenerator", tyB), A("__asyncDelegator", eyB), A("__asyncValues", AxB), A("__makeTemplateObject", QxB), A("__importStar", BxB), A("__importDefault", GxB), A("__classPrivateFieldGet", ZxB), A("__classPrivateFieldSet", IxB), A("__classPrivateFieldIn", YxB), A("__addDisposableResource", JxB), A("__disposeResources", WxB), A("__rewriteRelativeImportExtension", XxB)
  })
})
// @from(Start 7005017, End 7005970)
KxB = z((vBG, FxB) => {
  var {
    defineProperty: roA,
    getOwnPropertyDescriptor: Yj6,
    getOwnPropertyNames: Jj6
  } = Object, Wj6 = Object.prototype.hasOwnProperty, Xj6 = (A, Q) => roA(A, "name", {
    value: Q,
    configurable: !0
  }), Vj6 = (A, Q) => {
    for (var B in Q) roA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Fj6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Jj6(Q))
        if (!Wj6.call(A, Z) && Z !== B) roA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Yj6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Kj6 = (A) => Fj6(roA({}, "__esModule", {
    value: !0
  }), A), VxB = {};
  Vj6(VxB, {
    isArrayBuffer: () => Dj6
  });
  FxB.exports = Kj6(VxB);
  var Dj6 = Xj6((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 7005976, End 7007322)
ExB = z((bBG, CxB) => {
  var {
    defineProperty: ooA,
    getOwnPropertyDescriptor: Hj6,
    getOwnPropertyNames: Cj6
  } = Object, Ej6 = Object.prototype.hasOwnProperty, DxB = (A, Q) => ooA(A, "name", {
    value: Q,
    configurable: !0
  }), zj6 = (A, Q) => {
    for (var B in Q) ooA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Uj6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Cj6(Q))
        if (!Ej6.call(A, Z) && Z !== B) ooA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Hj6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $j6 = (A) => Uj6(ooA({}, "__esModule", {
    value: !0
  }), A), HxB = {};
  zj6(HxB, {
    fromArrayBuffer: () => qj6,
    fromString: () => Nj6
  });
  CxB.exports = $j6(HxB);
  var wj6 = KxB(),
    Rc1 = UA("buffer"),
    qj6 = DxB((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, wj6.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return Rc1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    Nj6 = DxB((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? Rc1.Buffer.from(A, Q) : Rc1.Buffer.from(A)
    }, "fromString")
})
// @from(Start 7007328, End 7008991)
qxB = z((fBG, wxB) => {
  var {
    defineProperty: toA,
    getOwnPropertyDescriptor: Lj6,
    getOwnPropertyNames: Mj6
  } = Object, Oj6 = Object.prototype.hasOwnProperty, Tc1 = (A, Q) => toA(A, "name", {
    value: Q,
    configurable: !0
  }), Rj6 = (A, Q) => {
    for (var B in Q) toA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Tj6 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Mj6(Q))
        if (!Oj6.call(A, Z) && Z !== B) toA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Lj6(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Pj6 = (A) => Tj6(toA({}, "__esModule", {
    value: !0
  }), A), zxB = {};
  Rj6(zxB, {
    fromUtf8: () => $xB,
    toUint8Array: () => jj6,
    toUtf8: () => Sj6
  });
  wxB.exports = Pj6(zxB);
  var UxB = ExB(),
    $xB = Tc1((A) => {
      let Q = (0, UxB.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    jj6 = Tc1((A) => {
      if (typeof A === "string") return $xB(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    Sj6 = Tc1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, UxB.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Start 7008997, End 7009547)
MxB = z((NxB) => {
  Object.defineProperty(NxB, "__esModule", {
    value: !0
  });
  NxB.convertToBuffer = void 0;
  var _j6 = qxB(),
    kj6 = typeof Buffer < "u" && Buffer.from ? function(A) {
      return Buffer.from(A, "utf8")
    } : _j6.fromUtf8;

  function yj6(A) {
    if (A instanceof Uint8Array) return A;
    if (typeof A === "string") return kj6(A);
    if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    return new Uint8Array(A)
  }
  NxB.convertToBuffer = yj6
})
// @from(Start 7009553, End 7009800)
TxB = z((OxB) => {
  Object.defineProperty(OxB, "__esModule", {
    value: !0
  });
  OxB.isEmptyData = void 0;

  function xj6(A) {
    if (typeof A === "string") return A.length === 0;
    return A.byteLength === 0
  }
  OxB.isEmptyData = xj6
})
// @from(Start 7009806, End 7010068)
SxB = z((PxB) => {
  Object.defineProperty(PxB, "__esModule", {
    value: !0
  });
  PxB.numToUint8 = void 0;

  function vj6(A) {
    return new Uint8Array([(A & 4278190080) >> 24, (A & 16711680) >> 16, (A & 65280) >> 8, A & 255])
  }
  PxB.numToUint8 = vj6
})
// @from(Start 7010074, End 7010430)
yxB = z((_xB) => {
  Object.defineProperty(_xB, "__esModule", {
    value: !0
  });
  _xB.uint32ArrayFrom = void 0;

  function bj6(A) {
    if (!Uint32Array.from) {
      var Q = new Uint32Array(A.length),
        B = 0;
      while (B < A.length) Q[B] = A[B], B += 1;
      return Q
    }
    return Uint32Array.from(A)
  }
  _xB.uint32ArrayFrom = bj6
})
// @from(Start 7010436, End 7011216)
Pc1 = z((MGA) => {
  Object.defineProperty(MGA, "__esModule", {
    value: !0
  });
  MGA.uint32ArrayFrom = MGA.numToUint8 = MGA.isEmptyData = MGA.convertToBuffer = void 0;
  var fj6 = MxB();
  Object.defineProperty(MGA, "convertToBuffer", {
    enumerable: !0,
    get: function() {
      return fj6.convertToBuffer
    }
  });
  var hj6 = TxB();
  Object.defineProperty(MGA, "isEmptyData", {
    enumerable: !0,
    get: function() {
      return hj6.isEmptyData
    }
  });
  var gj6 = SxB();
  Object.defineProperty(MGA, "numToUint8", {
    enumerable: !0,
    get: function() {
      return gj6.numToUint8
    }
  });
  var uj6 = yxB();
  Object.defineProperty(MGA, "uint32ArrayFrom", {
    enumerable: !0,
    get: function() {
      return uj6.uint32ArrayFrom
    }
  })
})
// @from(Start 7011222, End 7011988)
hxB = z((bxB) => {
  Object.defineProperty(bxB, "__esModule", {
    value: !0
  });
  bxB.AwsCrc32 = void 0;
  var xxB = Oc1(),
    jc1 = Pc1(),
    vxB = eoA(),
    dj6 = function() {
      function A() {
        this.crc32 = new vxB.Crc32
      }
      return A.prototype.update = function(Q) {
        if ((0, jc1.isEmptyData)(Q)) return;
        this.crc32.update((0, jc1.convertToBuffer)(Q))
      }, A.prototype.digest = function() {
        return xxB.__awaiter(this, void 0, void 0, function() {
          return xxB.__generator(this, function(Q) {
            return [2, (0, jc1.numToUint8)(this.crc32.digest())]
          })
        })
      }, A.prototype.reset = function() {
        this.crc32 = new vxB.Crc32
      }, A
    }();
  bxB.AwsCrc32 = dj6
})
// @from(Start 7011994, End 7016154)
eoA = z((Sc1) => {
  Object.defineProperty(Sc1, "__esModule", {
    value: !0
  });
  Sc1.AwsCrc32 = Sc1.Crc32 = Sc1.crc32 = void 0;
  var cj6 = Oc1(),
    pj6 = Pc1();

  function lj6(A) {
    return new gxB().update(A).digest()
  }
  Sc1.crc32 = lj6;
  var gxB = function() {
    function A() {
      this.checksum = 4294967295
    }
    return A.prototype.update = function(Q) {
      var B, G;
      try {
        for (var Z = cj6.__values(Q), I = Z.next(); !I.done; I = Z.next()) {
          var Y = I.value;
          this.checksum = this.checksum >>> 8 ^ nj6[(this.checksum ^ Y) & 255]
        }
      } catch (J) {
        B = {
          error: J
        }
      } finally {
        try {
          if (I && !I.done && (G = Z.return)) G.call(Z)
        } finally {
          if (B) throw B.error
        }
      }
      return this
    }, A.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0
    }, A
  }();
  Sc1.Crc32 = gxB;
  var ij6 = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
    nj6 = (0, pj6.uint32ArrayFrom)(ij6),
    aj6 = hxB();
  Object.defineProperty(Sc1, "AwsCrc32", {
    enumerable: !0,
    get: function() {
      return aj6.AwsCrc32
    }
  })
})