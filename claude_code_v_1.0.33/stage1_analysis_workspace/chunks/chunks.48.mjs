
// @from(Start 4399637, End 4428091)
LJ = z((sP7, unQ) => {
  var {
    defineProperty: qpA,
    getOwnPropertyDescriptor: MS8,
    getOwnPropertyNames: OS8
  } = Object, RS8 = Object.prototype.hasOwnProperty, CB = (A, Q) => qpA(A, "name", {
    value: Q,
    configurable: !0
  }), TS8 = (A, Q) => {
    for (var B in Q) qpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, PS8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of OS8(Q))
        if (!RS8.call(A, Z) && Z !== B) qpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = MS8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, jS8 = (A) => PS8(qpA({}, "__esModule", {
    value: !0
  }), A), MnQ = {};
  TS8(MnQ, {
    Client: () => SS8,
    Command: () => RnQ,
    LazyJsonString: () => jo,
    NoOpLogger: () => R_8,
    SENSITIVE_STRING: () => kS8,
    ServiceException: () => D_8,
    _json: () => m_1,
    collectBody: () => v_1.collectBody,
    convertMap: () => T_8,
    createAggregatedClient: () => yS8,
    dateToUtcString: () => knQ,
    decorateServiceException: () => ynQ,
    emitWarningIfUnsupportedVersion: () => z_8,
    expectBoolean: () => vS8,
    expectByte: () => u_1,
    expectFloat32: () => $pA,
    expectInt: () => fS8,
    expectInt32: () => h_1,
    expectLong: () => FEA,
    expectNonNull: () => gS8,
    expectNumber: () => VEA,
    expectObject: () => TnQ,
    expectShort: () => g_1,
    expectString: () => uS8,
    expectUnion: () => mS8,
    extendedEncodeURIComponent: () => v_1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => M_8,
    getDefaultClientConfiguration: () => N_8,
    getDefaultExtensionConfiguration: () => vnQ,
    getValueFromTextNode: () => bnQ,
    handleFloat: () => pS8,
    isSerializableHeaderValue: () => O_8,
    limitedParseDouble: () => p_1,
    limitedParseFloat: () => lS8,
    limitedParseFloat32: () => iS8,
    loadConfigsForDefaultMode: () => E_8,
    logger: () => KEA,
    map: () => i_1,
    parseBoolean: () => xS8,
    parseEpochTimestamp: () => Z_8,
    parseRfc3339DateTime: () => oS8,
    parseRfc3339DateTimeWithOffset: () => eS8,
    parseRfc7231DateTime: () => G_8,
    quoteHeader: () => hnQ,
    resolveDefaultRuntimeConfig: () => L_8,
    resolvedPath: () => v_1.resolvedPath,
    serializeDateTime: () => y_8,
    serializeFloat: () => k_8,
    splitEvery: () => gnQ,
    splitHeader: () => x_8,
    strictParseByte: () => _nQ,
    strictParseDouble: () => c_1,
    strictParseFloat: () => dS8,
    strictParseFloat32: () => PnQ,
    strictParseInt: () => nS8,
    strictParseInt32: () => aS8,
    strictParseLong: () => SnQ,
    strictParseShort: () => q5A,
    take: () => P_8,
    throwDefaultError: () => xnQ,
    withBaseException: () => H_8
  });
  unQ.exports = jS8(MnQ);
  var OnQ = uR(),
    SS8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, OnQ.constructStack)()
      }
      static {
        CB(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    v_1 = w5(),
    f_1 = x_1(),
    RnQ = class {
      constructor() {
        this.middlewareStack = (0, OnQ.constructStack)()
      }
      static {
        CB(this, "Command")
      }
      static classBuilder() {
        return new _S8
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [f_1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    _S8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        CB(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
      }
      ser(A) {
        return this._serializer = A, this
      }
      de(A) {
        return this._deserializer = A, this
      }
      build() {
        let A = this,
          Q;
        return Q = class extends RnQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this)
          }
          static {
            CB(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    kS8 = "***SensitiveInformation***",
    yS8 = CB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = CB(async function(Y, J, W) {
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
    xS8 = CB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    vS8 = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) KEA.warn(wpA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") KEA.warn(wpA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    VEA = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) KEA.warn(wpA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    bS8 = Math.ceil(340282346638528860000000000000000000000),
    $pA = CB((A) => {
      let Q = VEA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > bS8) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    FEA = CB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    fS8 = FEA,
    h_1 = CB((A) => d_1(A, 32), "expectInt32"),
    g_1 = CB((A) => d_1(A, 16), "expectShort"),
    u_1 = CB((A) => d_1(A, 8), "expectByte"),
    d_1 = CB((A, Q) => {
      let B = FEA(A);
      if (B !== void 0 && hS8(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    hS8 = CB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    gS8 = CB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    TnQ = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    uS8 = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return KEA.warn(wpA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    mS8 = CB((A) => {
      if (A === null || A === void 0) return;
      let Q = TnQ(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    c_1 = CB((A) => {
      if (typeof A == "string") return VEA(L5A(A));
      return VEA(A)
    }, "strictParseDouble"),
    dS8 = c_1,
    PnQ = CB((A) => {
      if (typeof A == "string") return $pA(L5A(A));
      return $pA(A)
    }, "strictParseFloat32"),
    cS8 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    L5A = CB((A) => {
      let Q = A.match(cS8);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    p_1 = CB((A) => {
      if (typeof A == "string") return jnQ(A);
      return VEA(A)
    }, "limitedParseDouble"),
    pS8 = p_1,
    lS8 = p_1,
    iS8 = CB((A) => {
      if (typeof A == "string") return jnQ(A);
      return $pA(A)
    }, "limitedParseFloat32"),
    jnQ = CB((A) => {
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
    SnQ = CB((A) => {
      if (typeof A === "string") return FEA(L5A(A));
      return FEA(A)
    }, "strictParseLong"),
    nS8 = SnQ,
    aS8 = CB((A) => {
      if (typeof A === "string") return h_1(L5A(A));
      return h_1(A)
    }, "strictParseInt32"),
    q5A = CB((A) => {
      if (typeof A === "string") return g_1(L5A(A));
      return g_1(A)
    }, "strictParseShort"),
    _nQ = CB((A) => {
      if (typeof A === "string") return u_1(L5A(A));
      return u_1(A)
    }, "strictParseByte"),
    wpA = CB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    KEA = {
      warn: console.warn
    },
    sS8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    l_1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function knQ(A) {
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
    return `${sS8[G]}, ${W} ${l_1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  CB(knQ, "dateToUtcString");
  var rS8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    oS8 = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = rS8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = q5A(N5A(G)), F = B_(Z, "month", 1, 12), K = B_(I, "day", 1, 31);
      return XEA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    tS8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    eS8 = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = tS8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = q5A(N5A(G)), K = B_(Z, "month", 1, 12), D = B_(I, "day", 1, 31), H = XEA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - K_8(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    A_8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    Q_8 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    B_8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    G_8 = CB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = A_8.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return XEA(q5A(N5A(I)), b_1(Z), B_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = Q_8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return J_8(XEA(I_8(I), b_1(Z), B_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = B_8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return XEA(q5A(N5A(X)), b_1(G), B_(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    Z_8 = CB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = c_1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    XEA = CB((A, Q, B, G) => {
      let Z = Q - 1;
      return X_8(A, Z, B), new Date(Date.UTC(A, Z, B, B_(G.hours, "hour", 0, 23), B_(G.minutes, "minute", 0, 59), B_(G.seconds, "seconds", 0, 60), F_8(G.fractionalMilliseconds)))
    }, "buildDate"),
    I_8 = CB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + q5A(N5A(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    Y_8 = 1576800000000,
    J_8 = CB((A) => {
      if (A.getTime() - new Date().getTime() > Y_8) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    b_1 = CB((A) => {
      let Q = l_1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    W_8 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    X_8 = CB((A, Q, B) => {
      let G = W_8[Q];
      if (Q === 1 && V_8(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${l_1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    V_8 = CB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    B_ = CB((A, Q, B, G) => {
      let Z = _nQ(N5A(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    F_8 = CB((A) => {
      if (A === null || A === void 0) return 0;
      return PnQ("0." + A) * 1000
    }, "parseMilliseconds"),
    K_8 = CB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    N5A = CB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    D_8 = class A extends Error {
      static {
        CB(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    ynQ = CB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    xnQ = CB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = C_8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw ynQ(Y, Q)
    }, "throwDefaultError"),
    H_8 = CB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        xnQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    C_8 = CB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    E_8 = CB((A) => {
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
    LnQ = !1,
    z_8 = CB((A) => {
      if (A && !LnQ && parseInt(A.substring(1, A.indexOf("."))) < 16) LnQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    U_8 = CB((A) => {
      let Q = [];
      for (let B in f_1.AlgorithmId) {
        let G = f_1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    $_8 = CB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    w_8 = CB((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    q_8 = CB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    vnQ = CB((A) => {
      return Object.assign(U_8(A), w_8(A))
    }, "getDefaultExtensionConfiguration"),
    N_8 = vnQ,
    L_8 = CB((A) => {
      return Object.assign($_8(A), q_8(A))
    }, "resolveDefaultRuntimeConfig"),
    M_8 = CB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    bnQ = CB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = bnQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    O_8 = CB((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    jo = CB(function(Q) {
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
    }, "LazyJsonString");
  jo.from = (A) => {
    if (A && typeof A === "object" && (A instanceof jo || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return jo(String(A));
    return jo(JSON.stringify(A))
  };
  jo.fromObject = jo.from;
  var R_8 = class {
    static {
      CB(this, "NoOpLogger")
    }
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };

  function i_1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, j_8(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      fnQ(G, null, I, Y)
    }
    return G
  }
  CB(i_1, "map");
  var T_8 = CB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    P_8 = CB((A, Q) => {
      let B = {};
      for (let G in Q) fnQ(B, A, Q, G);
      return B
    }, "take"),
    j_8 = CB((A, Q, B) => {
      return i_1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    fnQ = CB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = S_8, W = __8, X = G] = Y;
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
    S_8 = CB((A) => A != null, "nonNullish"),
    __8 = CB((A) => A, "pass");

  function hnQ(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  CB(hnQ, "quoteHeader");
  var k_8 = CB((A) => {
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
    y_8 = CB((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    m_1 = CB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(m_1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = m_1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function gnQ(A, Q, B) {
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
  CB(gnQ, "splitEvery");
  var x_8 = CB((A) => {
    let Q = A.length,
      B = [],
      G = !1,
      Z = void 0,
      I = 0;
    for (let Y = 0; Y < Q; ++Y) {
      let J = A[Y];
      switch (J) {
        case '"':
          if (Z !== "\\") G = !G;
          break;
        case ",":
          if (!G) B.push(A.slice(I, Y)), I = Y + 1;
          break;
        default:
      }
      Z = J
    }
    return B.push(A.slice(I)), B.map((Y) => {
      Y = Y.trim();
      let J = Y.length;
      if (J < 2) return Y;
      if (Y[0] === '"' && Y[J - 1] === '"') Y = Y.slice(1, J - 1);
      return Y.replace(/\\"/g, '"')
    })
  }, "splitHeader")
})
// @from(Start 4428097, End 4429568)
a_1 = z((mnQ) => {
  Object.defineProperty(mnQ, "__esModule", {
    value: !0
  });
  mnQ.resolveHttpAuthSchemeConfig = mnQ.defaultSSOOIDCHttpAuthSchemeProvider = mnQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
  var v_8 = jF(),
    n_1 = w7(),
    b_8 = async (A, Q, B) => {
      return {
        operation: (0, n_1.getSmithyContext)(Q).operation,
        region: await (0, n_1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  mnQ.defaultSSOOIDCHttpAuthSchemeParametersProvider = b_8;

  function f_8(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sso-oauth",
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

  function h_8(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var g_8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "CreateToken": {
        Q.push(h_8(A));
        break
      }
      default:
        Q.push(f_8(A))
    }
    return Q
  };
  mnQ.defaultSSOOIDCHttpAuthSchemeProvider = g_8;
  var u_8 = (A) => {
    let Q = (0, v_8.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, n_1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  mnQ.resolveHttpAuthSchemeConfig = u_8
})
// @from(Start 4429574, End 4446830)
r_1 = z((Bj7, MpA) => {
  var cnQ, pnQ, lnQ, inQ, nnQ, anQ, snQ, rnQ, onQ, tnQ, enQ, AaQ, QaQ, NpA, s_1, BaQ, GaQ, ZaQ, M5A, IaQ, YaQ, JaQ, WaQ, XaQ, VaQ, FaQ, KaQ, DaQ, LpA, HaQ, CaQ, EaQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof MpA === "object" && typeof Bj7 === "object") A(B(Q, B(Bj7)));
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
    cnQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, pnQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, lnQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, inQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, nnQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, anQ = function(I, Y, J, W, X, V) {
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
    }, snQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, rnQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, onQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, tnQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, enQ = function(I, Y, J, W) {
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
    }, AaQ = function(I, Y) {
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
    }, QaQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) LpA(Y, I, J)
    }, LpA = Object.create ? function(I, Y, J, W) {
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
    }, NpA = function(I) {
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
    }, s_1 = function(I, Y) {
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
    }, BaQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(s_1(arguments[Y]));
      return I
    }, GaQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, ZaQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, M5A = function(I) {
      return this instanceof M5A ? (this.v = I, this) : new M5A(I)
    }, IaQ = function(I, Y, J) {
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
        q.value instanceof M5A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, YaQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: M5A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, JaQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof NpA === "function" ? NpA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, WaQ = function(I, Y) {
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
    XaQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") LpA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, VaQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, FaQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, KaQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, DaQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, HaQ = function(I, Y, J) {
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
    CaQ = function(I) {
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
    }, EaQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", cnQ), A("__assign", pnQ), A("__rest", lnQ), A("__decorate", inQ), A("__param", nnQ), A("__esDecorate", anQ), A("__runInitializers", snQ), A("__propKey", rnQ), A("__setFunctionName", onQ), A("__metadata", tnQ), A("__awaiter", enQ), A("__generator", AaQ), A("__exportStar", QaQ), A("__createBinding", LpA), A("__values", NpA), A("__read", s_1), A("__spread", BaQ), A("__spreadArrays", GaQ), A("__spreadArray", ZaQ), A("__await", M5A), A("__asyncGenerator", IaQ), A("__asyncDelegator", YaQ), A("__asyncValues", JaQ), A("__makeTemplateObject", WaQ), A("__importStar", XaQ), A("__importDefault", VaQ), A("__classPrivateFieldGet", FaQ), A("__classPrivateFieldSet", KaQ), A("__classPrivateFieldIn", DaQ), A("__addDisposableResource", HaQ), A("__disposeResources", CaQ), A("__rewriteRelativeImportExtension", EaQ)
  })
})
// @from(Start 4446836, End 4451117)
o_1 = z((Gj7, c_8) => {
  c_8.exports = {
    name: "@aws-sdk/nested-clients",
    version: "3.797.0",
    description: "Nested clients for AWS SDK packages.",
    main: "./dist-cjs/index.js",
    module: "./dist-es/index.js",
    types: "./dist-types/index.d.ts",
    scripts: {
      build: "yarn lint && concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline nested-clients",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
      test: "yarn g:vitest run",
      "test:watch": "yarn g:vitest watch"
    },
    engines: {
      node: ">=18.0.0"
    },
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.796.0",
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
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.2.2"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
    browser: {
      "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
      "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
    },
    "react-native": {},
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "packages/nested-clients"
    },
    exports: {
      "./sso-oidc": {
        types: "./dist-types/submodules/sso-oidc/index.d.ts",
        module: "./dist-es/submodules/sso-oidc/index.js",
        node: "./dist-cjs/submodules/sso-oidc/index.js",
        import: "./dist-es/submodules/sso-oidc/index.js",
        require: "./dist-cjs/submodules/sso-oidc/index.js"
      },
      "./sts": {
        types: "./dist-types/submodules/sts/index.d.ts",
        module: "./dist-es/submodules/sts/index.js",
        node: "./dist-cjs/submodules/sts/index.js",
        import: "./dist-es/submodules/sts/index.js",
        require: "./dist-cjs/submodules/sts/index.js"
      }
    }
  }
})
// @from(Start 4451123, End 4451610)
$aQ = z((zaQ) => {
  Object.defineProperty(zaQ, "__esModule", {
    value: !0
  });
  zaQ.fromBase64 = void 0;
  var p_8 = hI(),
    l_8 = /^[A-Za-z0-9+/]*={0,2}$/,
    i_8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!l_8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, p_8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  zaQ.fromBase64 = i_8
})
// @from(Start 4451616, End 4452195)
NaQ = z((waQ) => {
  Object.defineProperty(waQ, "__esModule", {
    value: !0
  });
  waQ.toBase64 = void 0;
  var n_8 = hI(),
    a_8 = O2(),
    s_8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, a_8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, n_8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  waQ.toBase64 = s_8
})
// @from(Start 4452201, End 4452897)
Ak1 = z((Yj7, OpA) => {
  var {
    defineProperty: LaQ,
    getOwnPropertyDescriptor: r_8,
    getOwnPropertyNames: o_8
  } = Object, t_8 = Object.prototype.hasOwnProperty, t_1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of o_8(Q))
        if (!t_8.call(A, Z) && Z !== B) LaQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = r_8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, MaQ = (A, Q, B) => (t_1(A, Q, "default"), B && t_1(B, Q, "default")), e_8 = (A) => t_1(LaQ({}, "__esModule", {
    value: !0
  }), A), e_1 = {};
  OpA.exports = e_8(e_1);
  MaQ(e_1, $aQ(), OpA.exports);
  MaQ(e_1, NaQ(), OpA.exports)
})
// @from(Start 4452903, End 4457570)
maQ = z((gaQ) => {
  Object.defineProperty(gaQ, "__esModule", {
    value: !0
  });
  gaQ.ruleSet = void 0;
  var vaQ = "required",
    pL = "fn",
    lL = "argv",
    T5A = "ref",
    OaQ = !0,
    RaQ = "isSet",
    DEA = "booleanEquals",
    O5A = "error",
    R5A = "endpoint",
    $b = "tree",
    Qk1 = "PartitionResult",
    Bk1 = "getAttr",
    TaQ = {
      [vaQ]: !1,
      type: "String"
    },
    PaQ = {
      [vaQ]: !0,
      default: !1,
      type: "Boolean"
    },
    jaQ = {
      [T5A]: "Endpoint"
    },
    baQ = {
      [pL]: DEA,
      [lL]: [{
        [T5A]: "UseFIPS"
      }, !0]
    },
    faQ = {
      [pL]: DEA,
      [lL]: [{
        [T5A]: "UseDualStack"
      }, !0]
    },
    cL = {},
    SaQ = {
      [pL]: Bk1,
      [lL]: [{
        [T5A]: Qk1
      }, "supportsFIPS"]
    },
    haQ = {
      [T5A]: Qk1
    },
    _aQ = {
      [pL]: DEA,
      [lL]: [!0, {
        [pL]: Bk1,
        [lL]: [haQ, "supportsDualStack"]
      }]
    },
    kaQ = [baQ],
    yaQ = [faQ],
    xaQ = [{
      [T5A]: "Region"
    }],
    Ak8 = {
      version: "1.0",
      parameters: {
        Region: TaQ,
        UseDualStack: PaQ,
        UseFIPS: PaQ,
        Endpoint: TaQ
      },
      rules: [{
        conditions: [{
          [pL]: RaQ,
          [lL]: [jaQ]
        }],
        rules: [{
          conditions: kaQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: O5A
        }, {
          conditions: yaQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: O5A
        }, {
          endpoint: {
            url: jaQ,
            properties: cL,
            headers: cL
          },
          type: R5A
        }],
        type: $b
      }, {
        conditions: [{
          [pL]: RaQ,
          [lL]: xaQ
        }],
        rules: [{
          conditions: [{
            [pL]: "aws.partition",
            [lL]: xaQ,
            assign: Qk1
          }],
          rules: [{
            conditions: [baQ, faQ],
            rules: [{
              conditions: [{
                [pL]: DEA,
                [lL]: [OaQ, SaQ]
              }, _aQ],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: cL,
                  headers: cL
                },
                type: R5A
              }],
              type: $b
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: O5A
            }],
            type: $b
          }, {
            conditions: kaQ,
            rules: [{
              conditions: [{
                [pL]: DEA,
                [lL]: [SaQ, OaQ]
              }],
              rules: [{
                conditions: [{
                  [pL]: "stringEquals",
                  [lL]: [{
                    [pL]: Bk1,
                    [lL]: [haQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: cL,
                  headers: cL
                },
                type: R5A
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: cL,
                  headers: cL
                },
                type: R5A
              }],
              type: $b
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: O5A
            }],
            type: $b
          }, {
            conditions: yaQ,
            rules: [{
              conditions: [_aQ],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: cL,
                  headers: cL
                },
                type: R5A
              }],
              type: $b
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: O5A
            }],
            type: $b
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: cL,
              headers: cL
            },
            type: R5A
          }],
          type: $b
        }],
        type: $b
      }, {
        error: "Invalid Configuration: Missing Region",
        type: O5A
      }]
    };
  gaQ.ruleSet = Ak8
})
// @from(Start 4457576, End 4458140)
paQ = z((daQ) => {
  Object.defineProperty(daQ, "__esModule", {
    value: !0
  });
  daQ.defaultEndpointResolver = void 0;
  var Qk8 = I5A(),
    Gk1 = FI(),
    Bk8 = maQ(),
    Gk8 = new Gk1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    Zk8 = (A, Q = {}) => {
      return Gk8.get(A, () => (0, Gk1.resolveEndpoint)(Bk8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  daQ.defaultEndpointResolver = Zk8;
  Gk1.customEndpointFunctions.aws = Qk8.awsEndpointFunctions
})
// @from(Start 4458146, End 4459565)
saQ = z((naQ) => {
  Object.defineProperty(naQ, "__esModule", {
    value: !0
  });
  naQ.getRuntimeConfig = void 0;
  var Ik8 = jF(),
    Yk8 = iB(),
    Jk8 = LJ(),
    Wk8 = NJ(),
    laQ = Ak1(),
    iaQ = O2(),
    Xk8 = a_1(),
    Vk8 = paQ(),
    Fk8 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? laQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? laQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Vk8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Xk8.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Ik8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Yk8.NoAuthSigner
        }],
        logger: A?.logger ?? new Jk8.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? Wk8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? iaQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? iaQ.toUtf8
      }
    };
  naQ.getRuntimeConfig = Fk8
})
// @from(Start 4459571, End 4461731)
QsQ = z((eaQ) => {
  Object.defineProperty(eaQ, "__esModule", {
    value: !0
  });
  eaQ.getRuntimeConfig = void 0;
  var Kk8 = r_1(),
    Dk8 = Kk8.__importDefault(o_1()),
    Hk8 = jF(),
    raQ = eCA(),
    RpA = f8(),
    Ck8 = RX(),
    oaQ = D6(),
    P5A = uI(),
    taQ = IZ(),
    Ek8 = TX(),
    zk8 = KW(),
    Uk8 = saQ(),
    $k8 = LJ(),
    wk8 = PX(),
    qk8 = LJ(),
    Nk8 = (A) => {
      (0, qk8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, wk8.resolveDefaultsModeConfig)(A),
        B = () => Q().then($k8.loadConfigsForDefaultMode),
        G = (0, Uk8.getRuntimeConfig)(A);
      (0, Hk8.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        bodyLengthChecker: A?.bodyLengthChecker ?? Ek8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, raQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Dk8.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, P5A.loadConfig)(oaQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, P5A.loadConfig)(RpA.NODE_REGION_CONFIG_OPTIONS, {
          ...RpA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: taQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, P5A.loadConfig)({
          ...oaQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || zk8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Ck8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? taQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, P5A.loadConfig)(RpA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, P5A.loadConfig)(RpA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, P5A.loadConfig)(raQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  eaQ.getRuntimeConfig = Nk8
})
// @from(Start 4461737, End 4466244)
PpA = z((Fj7, YsQ) => {
  var {
    defineProperty: TpA,
    getOwnPropertyDescriptor: Lk8,
    getOwnPropertyNames: Mk8
  } = Object, Ok8 = Object.prototype.hasOwnProperty, Yc = (A, Q) => TpA(A, "name", {
    value: Q,
    configurable: !0
  }), Rk8 = (A, Q) => {
    for (var B in Q) TpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Tk8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Mk8(Q))
        if (!Ok8.call(A, Z) && Z !== B) TpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Lk8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Pk8 = (A) => Tk8(TpA({}, "__esModule", {
    value: !0
  }), A), BsQ = {};
  Rk8(BsQ, {
    Field: () => _k8,
    Fields: () => kk8,
    HttpRequest: () => yk8,
    HttpResponse: () => xk8,
    IHttpRequest: () => GsQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => jk8,
    isValidHostname: () => IsQ,
    resolveHttpHandlerRuntimeConfig: () => Sk8
  });
  YsQ.exports = Pk8(BsQ);
  var jk8 = Yc((A) => {
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
    Sk8 = Yc((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    GsQ = x_1(),
    _k8 = class {
      static {
        Yc(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = GsQ.FieldPosition.HEADER,
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
    kk8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Yc(this, "Fields")
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
    yk8 = class A {
      static {
        Yc(this, "HttpRequest")
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
        if (B.query) B.query = ZsQ(B.query);
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

  function ZsQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Yc(ZsQ, "cloneQuery");
  var xk8 = class {
    static {
      Yc(this, "HttpResponse")
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

  function IsQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Yc(IsQ, "isValidHostname")
})
// @from(Start 4466250, End 4486078)
Yk1 = z((Cj7, ysQ) => {
  var {
    defineProperty: jpA,
    getOwnPropertyDescriptor: vk8,
    getOwnPropertyNames: bk8
  } = Object, fk8 = Object.prototype.hasOwnProperty, j6 = (A, Q) => jpA(A, "name", {
    value: Q,
    configurable: !0
  }), hk8 = (A, Q) => {
    for (var B in Q) jpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, gk8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bk8(Q))
        if (!fk8.call(A, Z) && Z !== B) jpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vk8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, uk8 = (A) => gk8(jpA({}, "__esModule", {
    value: !0
  }), A), HsQ = {};
  hk8(HsQ, {
    $Command: () => zsQ.Command,
    AccessDeniedException: () => UsQ,
    AuthorizationPendingException: () => $sQ,
    CreateTokenCommand: () => _sQ,
    CreateTokenRequestFilterSensitiveLog: () => wsQ,
    CreateTokenResponseFilterSensitiveLog: () => qsQ,
    ExpiredTokenException: () => NsQ,
    InternalServerException: () => LsQ,
    InvalidClientException: () => MsQ,
    InvalidGrantException: () => OsQ,
    InvalidRequestException: () => RsQ,
    InvalidScopeException: () => TsQ,
    SSOOIDC: () => ksQ,
    SSOOIDCClient: () => EsQ,
    SSOOIDCServiceException: () => _w,
    SlowDownException: () => PsQ,
    UnauthorizedClientException: () => jsQ,
    UnsupportedGrantTypeException: () => SsQ,
    __Client: () => CsQ.Client
  });
  ysQ.exports = uk8(HsQ);
  var JsQ = cCA(),
    mk8 = pCA(),
    dk8 = lCA(),
    WsQ = F5A(),
    ck8 = f8(),
    Zk1 = iB(),
    pk8 = LX(),
    lk8 = q5(),
    XsQ = D6(),
    CsQ = LJ(),
    VsQ = a_1(),
    ik8 = j6((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    }, "resolveClientEndpointParameters"),
    nk8 = {
      UseFIPS: {
        type: "builtInParams",
        name: "useFipsEndpoint"
      },
      Endpoint: {
        type: "builtInParams",
        name: "endpoint"
      },
      Region: {
        type: "builtInParams",
        name: "region"
      },
      UseDualStack: {
        type: "builtInParams",
        name: "useDualstackEndpoint"
      }
    },
    ak8 = QsQ(),
    FsQ = YEA(),
    KsQ = PpA(),
    DsQ = LJ(),
    sk8 = j6((A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G
      } = A;
      return {
        setHttpAuthScheme(Z) {
          let I = Q.findIndex((Y) => Y.schemeId === Z.schemeId);
          if (I === -1) Q.push(Z);
          else Q.splice(I, 1, Z)
        },
        httpAuthSchemes() {
          return Q
        },
        setHttpAuthSchemeProvider(Z) {
          B = Z
        },
        httpAuthSchemeProvider() {
          return B
        },
        setCredentials(Z) {
          G = Z
        },
        credentials() {
          return G
        }
      }
    }, "getHttpAuthExtensionConfiguration"),
    rk8 = j6((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    ok8 = j6((A, Q) => {
      let B = Object.assign((0, FsQ.getAwsRegionExtensionConfiguration)(A), (0, DsQ.getDefaultExtensionConfiguration)(A), (0, KsQ.getHttpHandlerExtensionConfiguration)(A), sk8(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, FsQ.resolveAwsRegionExtensionConfiguration)(B), (0, DsQ.resolveDefaultRuntimeConfig)(B), (0, KsQ.resolveHttpHandlerRuntimeConfig)(B), rk8(B))
    }, "resolveRuntimeExtensions"),
    EsQ = class extends CsQ.Client {
      static {
        j6(this, "SSOOIDCClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, ak8.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = ik8(Q),
          G = (0, WsQ.resolveUserAgentConfig)(B),
          Z = (0, XsQ.resolveRetryConfig)(G),
          I = (0, ck8.resolveRegionConfig)(Z),
          Y = (0, JsQ.resolveHostHeaderConfig)(I),
          J = (0, lk8.resolveEndpointConfig)(Y),
          W = (0, VsQ.resolveHttpAuthSchemeConfig)(J),
          X = ok8(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, WsQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, XsQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, pk8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, JsQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, mk8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, dk8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Zk1.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: VsQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: j6(async (V) => new Zk1.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Zk1.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    tk8 = LJ(),
    ek8 = q5(),
    Ay8 = GZ(),
    zsQ = LJ(),
    j5A = LJ(),
    Qy8 = LJ(),
    _w = class A extends Qy8.ServiceException {
      static {
        j6(this, "SSOOIDCServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    UsQ = class A extends _w {
      static {
        j6(this, "AccessDeniedException")
      }
      name = "AccessDeniedException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "AccessDeniedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    $sQ = class A extends _w {
      static {
        j6(this, "AuthorizationPendingException")
      }
      name = "AuthorizationPendingException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "AuthorizationPendingException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    wsQ = j6((A) => ({
      ...A,
      ...A.clientSecret && {
        clientSecret: j5A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: j5A.SENSITIVE_STRING
      },
      ...A.codeVerifier && {
        codeVerifier: j5A.SENSITIVE_STRING
      }
    }), "CreateTokenRequestFilterSensitiveLog"),
    qsQ = j6((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: j5A.SENSITIVE_STRING
      },
      ...A.refreshToken && {
        refreshToken: j5A.SENSITIVE_STRING
      },
      ...A.idToken && {
        idToken: j5A.SENSITIVE_STRING
      }
    }), "CreateTokenResponseFilterSensitiveLog"),
    NsQ = class A extends _w {
      static {
        j6(this, "ExpiredTokenException")
      }
      name = "ExpiredTokenException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "ExpiredTokenException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    LsQ = class A extends _w {
      static {
        j6(this, "InternalServerException")
      }
      name = "InternalServerException";
      $fault = "server";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InternalServerException",
          $fault: "server",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    MsQ = class A extends _w {
      static {
        j6(this, "InvalidClientException")
      }
      name = "InvalidClientException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidClientException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    OsQ = class A extends _w {
      static {
        j6(this, "InvalidGrantException")
      }
      name = "InvalidGrantException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidGrantException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    RsQ = class A extends _w {
      static {
        j6(this, "InvalidRequestException")
      }
      name = "InvalidRequestException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    TsQ = class A extends _w {
      static {
        j6(this, "InvalidScopeException")
      }
      name = "InvalidScopeException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidScopeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    PsQ = class A extends _w {
      static {
        j6(this, "SlowDownException")
      }
      name = "SlowDownException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "SlowDownException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    jsQ = class A extends _w {
      static {
        j6(this, "UnauthorizedClientException")
      }
      name = "UnauthorizedClientException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "UnauthorizedClientException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    SsQ = class A extends _w {
      static {
        j6(this, "UnsupportedGrantTypeException")
      }
      name = "UnsupportedGrantTypeException";
      $fault = "client";
      error;
      error_description;
      constructor(Q) {
        super({
          name: "UnsupportedGrantTypeException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.error_description = Q.error_description
      }
    },
    Ik1 = jF(),
    By8 = iB(),
    J2 = LJ(),
    Gy8 = j6(async (A, Q) => {
      let B = (0, By8.requestBuilder)(A, Q),
        G = {
          "content-type": "application/json"
        };
      B.bp("/token");
      let Z;
      return Z = JSON.stringify((0, J2.take)(A, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: j6((I) => (0, J2._json)(I), "scope")
      })), B.m("POST").h(G).b(Z), B.build()
    }, "se_CreateTokenCommand"),
    Zy8 = j6(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return Iy8(A, Q);
      let B = (0, J2.map)({
          $metadata: iL(A)
        }),
        G = (0, J2.expectNonNull)((0, J2.expectObject)(await (0, Ik1.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, J2.take)(G, {
          accessToken: J2.expectString,
          expiresIn: J2.expectInt32,
          idToken: J2.expectString,
          refreshToken: J2.expectString,
          tokenType: J2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_CreateTokenCommand"),
    Iy8 = j6(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, Ik1.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, Ik1.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
          throw await Jy8(B, Q);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
          throw await Wy8(B, Q);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
          throw await Xy8(B, Q);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
          throw await Vy8(B, Q);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
          throw await Fy8(B, Q);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
          throw await Ky8(B, Q);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
          throw await Dy8(B, Q);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
          throw await Hy8(B, Q);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
          throw await Cy8(B, Q);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
          throw await Ey8(B, Q);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
          throw await zy8(B, Q);
        default:
          let Z = B.body;
          return Yy8({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    Yy8 = (0, J2.withBaseException)(_w),
    Jy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new UsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_AccessDeniedExceptionRes"),
    Wy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new $sQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_AuthorizationPendingExceptionRes"),
    Xy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new NsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_ExpiredTokenExceptionRes"),
    Vy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new LsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_InternalServerExceptionRes"),
    Fy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new MsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_InvalidClientExceptionRes"),
    Ky8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new OsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_InvalidGrantExceptionRes"),
    Dy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new RsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    Hy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new TsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_InvalidScopeExceptionRes"),
    Cy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new PsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_SlowDownExceptionRes"),
    Ey8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new jsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedClientExceptionRes"),
    zy8 = j6(async (A, Q) => {
      let B = (0, J2.map)({}),
        G = A.body,
        Z = (0, J2.take)(G, {
          error: J2.expectString,
          error_description: J2.expectString
        });
      Object.assign(B, Z);
      let I = new SsQ({
        $metadata: iL(A),
        ...B
      });
      return (0, J2.decorateServiceException)(I, A.body)
    }, "de_UnsupportedGrantTypeExceptionRes"),
    iL = j6((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    _sQ = class extends zsQ.Command.classBuilder().ep(nk8).m(function(A, Q, B, G) {
      return [(0, Ay8.getSerdePlugin)(B, this.serialize, this.deserialize), (0, ek8.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").f(wsQ, qsQ).ser(Gy8).de(Zy8).build() {
      static {
        j6(this, "CreateTokenCommand")
      }
    },
    Uy8 = {
      CreateTokenCommand: _sQ
    },
    ksQ = class extends EsQ {
      static {
        j6(this, "SSOOIDC")
      }
    };
  (0, tk8.createAggregatedClient)(Uy8, ksQ)
})
// @from(Start 4486084, End 4491546)
msQ = z(($j7, usQ) => {
  var {
    create: $y8,
    defineProperty: CEA,
    getOwnPropertyDescriptor: wy8,
    getOwnPropertyNames: qy8,
    getPrototypeOf: Ny8
  } = Object, Ly8 = Object.prototype.hasOwnProperty, Jc = (A, Q) => CEA(A, "name", {
    value: Q,
    configurable: !0
  }), My8 = (A, Q) => {
    for (var B in Q) CEA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bsQ = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qy8(Q))
        if (!Ly8.call(A, Z) && Z !== B) CEA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wy8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, fsQ = (A, Q, B) => (B = A != null ? $y8(Ny8(A)) : {}, bsQ(Q || !A || !A.__esModule ? CEA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Oy8 = (A) => bsQ(CEA({}, "__esModule", {
    value: !0
  }), A), hsQ = {};
  My8(hsQ, {
    fromSso: () => gsQ,
    fromStatic: () => ky8,
    nodeProvider: () => yy8
  });
  usQ.exports = Oy8(hsQ);
  var Ry8 = 300000,
    Jk1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.",
    Ty8 = Jc(async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => fsQ(Yk1()));
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: Q.clientConfig?.logger ?? Q.parentClientConfig?.logger
      }))
    }, "getSsoOidcClient"),
    Py8 = Jc(async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => fsQ(Yk1()));
      return (await Ty8(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, "getNewSsoOidcToken"),
    eR = j2(),
    xsQ = Jc((A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new eR.TokenProviderError(`Token is expired. ${Jk1}`, !1)
    }, "validateTokenExpiry"),
    So = Jc((A, Q, B = !1) => {
      if (typeof Q > "u") throw new eR.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${Jk1}`, !1)
    }, "validateTokenKey"),
    HEA = SG(),
    jy8 = UA("fs"),
    {
      writeFile: Sy8
    } = jy8.promises,
    _y8 = Jc((A, Q) => {
      let B = (0, HEA.getSSOTokenFilepath)(A),
        G = JSON.stringify(Q, null, 2);
      return Sy8(B, G)
    }, "writeSSOTokenToFile"),
    vsQ = new Date(0),
    gsQ = Jc((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      let B = {
        ...A,
        parentClientConfig: {
          ...Q,
          ...A.parentClientConfig
        }
      };
      B.logger?.debug("@aws-sdk/token-providers - fromSso");
      let G = await (0, HEA.parseKnownFiles)(B),
        Z = (0, HEA.getProfileName)({
          profile: B.profile ?? Q?.profile
        }),
        I = G[Z];
      if (!I) throw new eR.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!I.sso_session) throw new eR.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let Y = I.sso_session,
        W = (await (0, HEA.loadSsoSessionData)(B))[Y];
      if (!W) throw new eR.TokenProviderError(`Sso session '${Y}' could not be found in shared credentials file.`, !1);
      for (let C of ["sso_start_url", "sso_region"])
        if (!W[C]) throw new eR.TokenProviderError(`Sso session '${Y}' is missing required property '${C}'.`, !1);
      let {
        sso_start_url: X,
        sso_region: V
      } = W, F;
      try {
        F = await (0, HEA.getSSOTokenFromFile)(Y)
      } catch (C) {
        throw new eR.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${Jk1}`, !1)
      }
      So("accessToken", F.accessToken), So("expiresAt", F.expiresAt);
      let {
        accessToken: K,
        expiresAt: D
      } = F, H = {
        token: K,
        expiration: new Date(D)
      };
      if (H.expiration.getTime() - Date.now() > Ry8) return H;
      if (Date.now() - vsQ.getTime() < 30000) return xsQ(H), H;
      So("clientId", F.clientId, !0), So("clientSecret", F.clientSecret, !0), So("refreshToken", F.refreshToken, !0);
      try {
        vsQ.setTime(Date.now());
        let C = await Py8(F, V, B);
        So("accessToken", C.accessToken), So("expiresIn", C.expiresIn);
        let E = new Date(Date.now() + C.expiresIn * 1000);
        try {
          await _y8(Y, {
            ...F,
            accessToken: C.accessToken,
            expiresAt: E.toISOString(),
            refreshToken: C.refreshToken
          })
        } catch (U) {}
        return {
          token: C.accessToken,
          expiration: E
        }
      } catch (C) {
        return xsQ(H), H
      }
    }, "fromSso"),
    ky8 = Jc(({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new eR.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, "fromStatic"),
    yy8 = Jc((A = {}) => (0, eR.memoize)((0, eR.chain)(gsQ(A), async () => {
      throw new eR.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0), "nodeProvider")
})
// @from(Start 4491552, End 4498794)
Xk1 = z((wj7, rsQ) => {
  var {
    defineProperty: _pA,
    getOwnPropertyDescriptor: xy8,
    getOwnPropertyNames: psQ
  } = Object, vy8 = Object.prototype.hasOwnProperty, kpA = (A, Q) => _pA(A, "name", {
    value: Q,
    configurable: !0
  }), by8 = (A, Q) => function() {
    return A && (Q = (0, A[psQ(A)[0]])(A = 0)), Q
  }, lsQ = (A, Q) => {
    for (var B in Q) _pA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, fy8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of psQ(Q))
        if (!vy8.call(A, Z) && Z !== B) _pA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xy8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, hy8 = (A) => fy8(_pA({}, "__esModule", {
    value: !0
  }), A), isQ = {};
  lsQ(isQ, {
    GetRoleCredentialsCommand: () => Wk1.GetRoleCredentialsCommand,
    SSOClient: () => Wk1.SSOClient
  });
  var Wk1, gy8 = by8({
      "src/loadSso.ts"() {
        Wk1 = DnQ()
      }
    }),
    nsQ = {};
  lsQ(nsQ, {
    fromSSO: () => my8,
    isSsoProfile: () => asQ,
    validateSsoProfile: () => ssQ
  });
  rsQ.exports = hy8(nsQ);
  var asQ = kpA((A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"), "isSsoProfile"),
    dsQ = rS(),
    uy8 = msQ(),
    AT = j2(),
    SpA = SG(),
    EEA = !1,
    csQ = kpA(async ({
      ssoStartUrl: A,
      ssoSession: Q,
      ssoAccountId: B,
      ssoRegion: G,
      ssoRoleName: Z,
      ssoClient: I,
      clientConfig: Y,
      parentClientConfig: J,
      profile: W,
      logger: X
    }) => {
      let V, F = "To refresh this SSO session run aws sso login with the corresponding profile.";
      if (Q) try {
        let v = await (0, uy8.fromSso)({
          profile: W
        })();
        V = {
          accessToken: v.token,
          expiresAt: new Date(v.expiration).toISOString()
        }
      } catch (v) {
        throw new AT.CredentialsProviderError(v.message, {
          tryNextLink: EEA,
          logger: X
        })
      } else try {
        V = await (0, SpA.getSSOTokenFromFile)(A)
      } catch (v) {
        throw new AT.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
          tryNextLink: EEA,
          logger: X
        })
      }
      if (new Date(V.expiresAt).getTime() - Date.now() <= 0) throw new AT.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
        tryNextLink: EEA,
        logger: X
      });
      let {
        accessToken: K
      } = V, {
        SSOClient: D,
        GetRoleCredentialsCommand: H
      } = await Promise.resolve().then(() => (gy8(), isQ)), C = I || new D(Object.assign({}, Y ?? {}, {
        logger: Y?.logger ?? J?.logger,
        region: Y?.region ?? G
      })), E;
      try {
        E = await C.send(new H({
          accountId: B,
          roleName: Z,
          accessToken: K
        }))
      } catch (v) {
        throw new AT.CredentialsProviderError(v, {
          tryNextLink: EEA,
          logger: X
        })
      }
      let {
        roleCredentials: {
          accessKeyId: U,
          secretAccessKey: q,
          sessionToken: w,
          expiration: N,
          credentialScope: R,
          accountId: T
        } = {}
      } = E;
      if (!U || !q || !w || !N) throw new AT.CredentialsProviderError("SSO returns an invalid temporary credential.", {
        tryNextLink: EEA,
        logger: X
      });
      let y = {
        accessKeyId: U,
        secretAccessKey: q,
        sessionToken: w,
        expiration: new Date(N),
        ...R && {
          credentialScope: R
        },
        ...T && {
          accountId: T
        }
      };
      if (Q)(0, dsQ.setCredentialFeature)(y, "CREDENTIALS_SSO", "s");
      else(0, dsQ.setCredentialFeature)(y, "CREDENTIALS_SSO_LEGACY", "u");
      return y
    }, "resolveSSOCredentials"),
    ssQ = kpA((A, Q) => {
      let {
        sso_start_url: B,
        sso_account_id: G,
        sso_region: Z,
        sso_role_name: I
      } = A;
      if (!B || !G || !Z || !I) throw new AT.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
        tryNextLink: !1,
        logger: Q
      });
      return A
    }, "validateSsoProfile"),
    my8 = kpA((A = {}) => async ({
      callerClientConfig: Q
    } = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
      let {
        ssoStartUrl: B,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: I,
        ssoSession: Y
      } = A, {
        ssoClient: J
      } = A, W = (0, SpA.getProfileName)({
        profile: A.profile ?? Q?.profile
      });
      if (!B && !G && !Z && !I && !Y) {
        let V = (await (0, SpA.parseKnownFiles)(A))[W];
        if (!V) throw new AT.CredentialsProviderError(`Profile ${W} was not found.`, {
          logger: A.logger
        });
        if (!asQ(V)) throw new AT.CredentialsProviderError(`Profile ${W} is not configured with SSO credentials.`, {
          logger: A.logger
        });
        if (V?.sso_session) {
          let U = (await (0, SpA.loadSsoSessionData)(A))[V.sso_session],
            q = ` configurations in profile ${W} and sso-session ${V.sso_session}`;
          if (Z && Z !== U.sso_region) throw new AT.CredentialsProviderError("Conflicting SSO region" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          if (B && B !== U.sso_start_url) throw new AT.CredentialsProviderError("Conflicting SSO start_url" + q, {
            tryNextLink: !1,
            logger: A.logger
          });
          V.sso_region = U.sso_region, V.sso_start_url = U.sso_start_url
        }
        let {
          sso_start_url: F,
          sso_account_id: K,
          sso_region: D,
          sso_role_name: H,
          sso_session: C
        } = ssQ(V, A.logger);
        return csQ({
          ssoStartUrl: F,
          ssoSession: C,
          ssoAccountId: K,
          ssoRegion: D,
          ssoRoleName: H,
          ssoClient: J,
          clientConfig: A.clientConfig,
          parentClientConfig: A.parentClientConfig,
          profile: W
        })
      } else if (!B || !G || !Z || !I) throw new AT.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
        tryNextLink: !1,
        logger: A.logger
      });
      else return csQ({
        ssoStartUrl: B,
        ssoSession: Y,
        ssoAccountId: G,
        ssoRegion: Z,
        ssoRoleName: I,
        ssoClient: J,
        clientConfig: A.clientConfig,
        parentClientConfig: A.parentClientConfig,
        profile: W
      })
    }, "fromSSO")
})