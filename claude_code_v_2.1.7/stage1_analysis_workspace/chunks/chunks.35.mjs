
// @from(Ln 89340, Col 4)
eg = U((_I6) => {
  var qjQ = $y1(),
    tG = WX(),
    tg = My1(),
    _H = Mq(),
    aV = Oq(),
    EwA = jy1(),
    wjQ = oG(),
    sM = Sy1();
  class $YA {
    queryCompat;
    constructor(A = !1) {
      this.queryCompat = A
    }
    resolveRestContentType(A, Q) {
      let B = Q.getMemberSchemas(),
        G = Object.values(B).find((Z) => {
          return !!Z.getMergedTraits().httpPayload
        });
      if (G) {
        let Z = G.getMergedTraits().mediaType;
        if (Z) return Z;
        else if (G.isStringSchema()) return "text/plain";
        else if (G.isBlobSchema()) return "application/octet-stream";
        else return A
      } else if (!Q.isUnitSchema()) {
        if (Object.values(B).find((Y) => {
            let {
              httpQuery: J,
              httpQueryParams: X,
              httpHeader: I,
              httpLabel: D,
              httpPrefixHeaders: W
            } = Y.getMergedTraits();
            return !J && !X && !I && !D && W === void 0
          })) return A
      }
    }
    async getErrorSchemaOrThrowBaseException(A, Q, B, G, Z, Y) {
      let J = Q,
        X = A;
      if (A.includes("#"))[J, X] = A.split("#");
      let I = {
          $metadata: Z,
          $fault: B.statusCode < 500 ? "client" : "server"
        },
        D = tG.TypeRegistry.for(J);
      try {
        return {
          errorSchema: Y?.(D, X) ?? D.getSchema(A),
          errorMetadata: I
        }
      } catch (W) {
        G.message = G.message ?? G.Message ?? "UnknownError";
        let K = tG.TypeRegistry.for("smithy.ts.sdk.synthetic." + J),
          V = K.getBaseException();
        if (V) {
          let F = K.getErrorCtor(V) ?? Error;
          throw this.decorateServiceException(Object.assign(new F({
            name: X
          }), I), G)
        }
        throw this.decorateServiceException(Object.assign(Error(X), I), G)
      }
    }
    decorateServiceException(A, Q = {}) {
      if (this.queryCompat) {
        let B = A.Message ?? Q.Message,
          G = tg.decorateServiceException(A, Q);
        if (B) G.Message = B, G.message = B;
        return G
      }
      return tg.decorateServiceException(A, Q)
    }
    setQueryCompatError(A, Q) {
      let B = Q.headers?.["x-amzn-query-error"];
      if (A !== void 0 && B != null) {
        let [G, Z] = B.split(";"), Y = Object.entries(A), J = {
          Code: G,
          Type: Z
        };
        Object.assign(A, J);
        for (let [X, I] of Y) J[X] = I;
        delete J.__type, A.Error = J
      }
    }
    queryCompatOutput(A, Q) {
      if (A.Error) Q.Error = A.Error;
      if (A.Type) Q.Type = A.Type;
      if (A.Code) Q.Code = A.Code
    }
  }
  class LjQ extends qjQ.SmithyRpcV2CborProtocol {
    awsQueryCompatible;
    mixin;
    constructor({
      defaultNamespace: A,
      awsQueryCompatible: Q
    }) {
      super({
        defaultNamespace: A
      });
      this.awsQueryCompatible = !!Q, this.mixin = new $YA(this.awsQueryCompatible)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (this.awsQueryCompatible) G.headers["x-amzn-query-mode"] = "true";
      return G
    }
    async handleError(A, Q, B, G, Z) {
      if (this.awsQueryCompatible) this.mixin.setQueryCompatError(G, B);
      let Y = qjQ.loadSmithyRpcV2CborErrorCode(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = tG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(tG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D),
        V = {};
      for (let [F, H] of I.structIterator()) V[F] = this.deserializer.readValue(H, G[F]);
      if (this.awsQueryCompatible) this.mixin.queryCompatOutput(G, V);
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
  }
  var qI6 = (A) => {
      if (A == null) return A;
      if (typeof A === "number" || typeof A === "bigint") {
        let Q = Error(`Received number ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      if (typeof A === "boolean") {
        let Q = Error(`Received boolean ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      return A
    },
    NI6 = (A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (A !== "" && Q !== "false" && Q !== "true") {
          let B = Error(`Received string "${A}" where a boolean was expected.`);
          B.name = "Warning", console.warn(B)
        }
        return A !== "" && Q !== "false"
      }
      return A
    },
    wI6 = (A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = Number(A);
        if (Q.toString() !== A) {
          let B = Error(`Received string "${A}" where a number was expected.`);
          return B.name = "Warning", console.warn(B), A
        }
        return Q
      }
      return A
    };
  class ri {
    serdeContext;
    setSerdeContext(A) {
      this.serdeContext = A
    }
  }

  function LI6(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new aV.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  var OjQ = (A, Q) => tg.collectBody(A, Q).then((B) => (Q?.utf8Encoder ?? wjQ.toUtf8)(B)),
    hk1 = (A, Q) => OjQ(A, Q).then((B) => {
      if (B.length) try {
        return JSON.parse(B)
      } catch (G) {
        if (G?.name === "SyntaxError") Object.defineProperty(G, "$responseBodyText", {
          value: B
        });
        throw G
      }
      return {}
    }),
    OI6 = async (A, Q) => {
      let B = await hk1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, gk1 = (A, Q) => {
      let B = (Y, J) => Object.keys(Y).find((X) => X.toLowerCase() === J.toLowerCase()),
        G = (Y) => {
          let J = Y;
          if (typeof J === "number") J = J.toString();
          if (J.indexOf(",") >= 0) J = J.split(",")[0];
          if (J.indexOf(":") >= 0) J = J.split(":")[0];
          if (J.indexOf("#") >= 0) J = J.split("#")[1];
          return J
        },
        Z = B(A.headers, "x-amzn-errortype");
      if (Z !== void 0) return G(A.headers[Z]);
      if (Q && typeof Q === "object") {
        let Y = B(Q, "code");
        if (Y && Q[Y] !== void 0) return G(Q[Y]);
        if (Q.__type !== void 0) return G(Q.__type)
      }
    };
  class uk1 extends ri {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    async read(A, Q) {
      return this._read(A, typeof Q === "string" ? JSON.parse(Q, LI6) : await hk1(Q, this.serdeContext))
    }
    readObject(A, Q) {
      return this._read(A, Q)
    }
    _read(A, Q) {
      let B = Q !== null && typeof Q === "object",
        G = tG.NormalizedSchema.of(A);
      if (G.isListSchema() && Array.isArray(Q)) {
        let Y = G.getValueSchema(),
          J = [],
          X = !!G.getMergedTraits().sparse;
        for (let I of Q)
          if (X || I != null) J.push(this._read(Y, I));
        return J
      } else if (G.isMapSchema() && B) {
        let Y = G.getValueSchema(),
          J = {},
          X = !!G.getMergedTraits().sparse;
        for (let [I, D] of Object.entries(Q))
          if (X || D != null) J[I] = this._read(Y, D);
        return J
      } else if (G.isStructSchema() && B) {
        let Y = {};
        for (let [J, X] of G.structIterator()) {
          let I = this.settings.jsonName ? X.getMergedTraits().jsonName ?? J : J,
            D = this._read(X, Q[I]);
          if (D != null) Y[J] = D
        }
        return Y
      }
      if (G.isBlobSchema() && typeof Q === "string") return EwA.fromBase64(Q);
      let Z = G.getMergedTraits().mediaType;
      if (G.isStringSchema() && typeof Q === "string" && Z) {
        if (Z === "application/json" || Z.endsWith("+json")) return aV.LazyJsonString.from(Q)
      }
      if (G.isTimestampSchema() && Q != null) switch (_H.determineTimestampFormat(G, this.settings)) {
        case 5:
          return aV.parseRfc3339DateTimeWithOffset(Q);
        case 6:
          return aV.parseRfc7231DateTime(Q);
        case 7:
          return aV.parseEpochTimestamp(Q);
        default:
          return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
      }
      if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
      if (G.isBigDecimalSchema() && Q != null) {
        if (Q instanceof aV.NumericValue) return Q;
        let Y = Q;
        if (Y.type === "bigDecimal" && "string" in Y) return new aV.NumericValue(Y.string, Y.type);
        return new aV.NumericValue(String(Q), "bigDecimal")
      }
      if (G.isNumericSchema() && typeof Q === "string") switch (Q) {
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        case "NaN":
          return NaN
      }
      if (G.isDocumentSchema())
        if (B) {
          let Y = Array.isArray(Q) ? [] : {};
          for (let [J, X] of Object.entries(Q))
            if (X instanceof aV.NumericValue) Y[J] = X;
            else Y[J] = this._read(G, X);
          return Y
        } else return structuredClone(Q);
      return Q
    }
  }
  var NjQ = String.fromCharCode(925);
  class MjQ {
    values = new Map;
    counter = 0;
    stage = 0;
    createReplacer() {
      if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
      if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      return this.stage = 1, (A, Q) => {
        if (Q instanceof aV.NumericValue) {
          let B = `${NjQ+"nv"+this.counter++}_` + Q.string;
          return this.values.set(`"${B}"`, Q.string), B
        }
        if (typeof Q === "bigint") {
          let B = Q.toString(),
            G = `${NjQ+"b"+this.counter++}_` + B;
          return this.values.set(`"${G}"`, B), G
        }
        return Q
      }
    }
    replaceInJson(A) {
      if (this.stage === 0) throw Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
      if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
      if (this.stage = 2, this.counter === 0) return A;
      for (let [Q, B] of this.values) A = A.replace(Q, B);
      return A
    }
  }
  class mk1 extends ri {
    settings;
    buffer;
    rootSchema;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q) {
      this.rootSchema = tG.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
    }
    writeDiscriminatedDocument(A, Q) {
      if (this.write(A, Q), typeof this.buffer === "object") this.buffer.__type = tG.NormalizedSchema.of(A).getName(!0)
    }
    flush() {
      let {
        rootSchema: A
      } = this;
      if (this.rootSchema = void 0, A?.isStructSchema() || A?.isDocumentSchema()) {
        let Q = new MjQ;
        return Q.replaceInJson(JSON.stringify(this.buffer, Q.createReplacer(), 0))
      }
      return this.buffer
    }
    _write(A, Q, B) {
      let G = Q !== null && typeof Q === "object",
        Z = tG.NormalizedSchema.of(A);
      if (Z.isListSchema() && Array.isArray(Q)) {
        let Y = Z.getValueSchema(),
          J = [],
          X = !!Z.getMergedTraits().sparse;
        for (let I of Q)
          if (X || I != null) J.push(this._write(Y, I));
        return J
      } else if (Z.isMapSchema() && G) {
        let Y = Z.getValueSchema(),
          J = {},
          X = !!Z.getMergedTraits().sparse;
        for (let [I, D] of Object.entries(Q))
          if (X || D != null) J[I] = this._write(Y, D);
        return J
      } else if (Z.isStructSchema() && G) {
        let Y = {};
        for (let [J, X] of Z.structIterator()) {
          let I = this.settings.jsonName ? X.getMergedTraits().jsonName ?? J : J,
            D = this._write(X, Q[J], Z);
          if (D !== void 0) Y[I] = D
        }
        return Y
      }
      if (Q === null && B?.isStructSchema()) return;
      if (Z.isBlobSchema() && (Q instanceof Uint8Array || typeof Q === "string") || Z.isDocumentSchema() && Q instanceof Uint8Array) {
        if (Z === this.rootSchema) return Q;
        return (this.serdeContext?.base64Encoder ?? EwA.toBase64)(Q)
      }
      if ((Z.isTimestampSchema() || Z.isDocumentSchema()) && Q instanceof Date) switch (_H.determineTimestampFormat(Z, this.settings)) {
        case 5:
          return Q.toISOString().replace(".000Z", "Z");
        case 6:
          return aV.dateToUtcString(Q);
        case 7:
          return Q.getTime() / 1000;
        default:
          return console.warn("Missing timestamp format, using epoch seconds", Q), Q.getTime() / 1000
      }
      if (Z.isNumericSchema() && typeof Q === "number") {
        if (Math.abs(Q) === 1 / 0 || isNaN(Q)) return String(Q)
      }
      if (Z.isStringSchema()) {
        if (typeof Q > "u" && Z.isIdempotencyToken()) return aV.generateIdempotencyToken();
        let Y = Z.getMergedTraits().mediaType;
        if (Q != null && Y) {
          if (Y === "application/json" || Y.endsWith("+json")) return aV.LazyJsonString.from(Q)
        }
      }
      if (Z.isDocumentSchema())
        if (G) {
          let Y = Array.isArray(Q) ? [] : {};
          for (let [J, X] of Object.entries(Q))
            if (X instanceof aV.NumericValue) Y[J] = X;
            else Y[J] = this._write(Z, X);
          return Y
        } else return structuredClone(Q);
      return Q
    }
  }
  class doA extends ri {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    createSerializer() {
      let A = new mk1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
    createDeserializer() {
      let A = new uk1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
  }
  class coA extends _H.RpcProtocol {
    serializer;
    deserializer;
    serviceTarget;
    codec;
    mixin;
    awsQueryCompatible;
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A
      });
      this.serviceTarget = Q, this.codec = new doA({
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        jsonName: !1
      }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer(), this.awsQueryCompatible = !!B, this.mixin = new $YA(this.awsQueryCompatible)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (!G.path.endsWith("/")) G.path += "/";
      if (Object.assign(G.headers, {
          "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
          "x-amz-target": `${this.serviceTarget}.${A.name}`
        }), this.awsQueryCompatible) G.headers["x-amzn-query-mode"] = "true";
      if (tG.deref(A.input) === "unit" || !G.body) G.body = "{}";
      return G
    }
    getPayloadCodec() {
      return this.codec
    }
    async handleError(A, Q, B, G, Z) {
      if (this.awsQueryCompatible) this.mixin.setQueryCompatError(G, B);
      let Y = gk1(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = tG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(tG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D),
        V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().jsonName ?? F;
        V[F] = this.codec.createDeserializer().readObject(H, G[E])
      }
      if (this.awsQueryCompatible) this.mixin.queryCompatOutput(G, V);
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
  }
  class RjQ extends coA {
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A,
        serviceTarget: Q,
        awsQueryCompatible: B
      })
    }
    getShapeId() {
      return "aws.protocols#awsJson1_0"
    }
    getJsonRpcVersion() {
      return "1.0"
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.0"
    }
  }
  class _jQ extends coA {
    constructor({
      defaultNamespace: A,
      serviceTarget: Q,
      awsQueryCompatible: B
    }) {
      super({
        defaultNamespace: A,
        serviceTarget: Q,
        awsQueryCompatible: B
      })
    }
    getShapeId() {
      return "aws.protocols#awsJson1_1"
    }
    getJsonRpcVersion() {
      return "1.1"
    }
    getDefaultContentType() {
      return "application/x-amz-json-1.1"
    }
  }
  class jjQ extends _H.HttpBindingProtocol {
    serializer;
    deserializer;
    codec;
    mixin = new $YA;
    constructor({
      defaultNamespace: A
    }) {
      super({
        defaultNamespace: A
      });
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 7
        },
        httpBindings: !0,
        jsonName: !0
      };
      this.codec = new doA(Q), this.serializer = new _H.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new _H.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
    }
    getShapeId() {
      return "aws.protocols#restJson1"
    }
    getPayloadCodec() {
      return this.codec
    }
    setSerdeContext(A) {
      this.codec.setSerdeContext(A), super.setSerdeContext(A)
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B),
        Z = tG.NormalizedSchema.of(A.input);
      if (!G.headers["content-type"]) {
        let Y = this.mixin.resolveRestContentType(this.getDefaultContentType(), Z);
        if (Y) G.headers["content-type"] = Y
      }
      if (G.body == null && G.headers["content-type"] === this.getDefaultContentType()) G.body = "{}";
      return G
    }
    async deserializeResponse(A, Q, B) {
      let G = await super.deserializeResponse(A, Q, B),
        Z = tG.NormalizedSchema.of(A.output);
      for (let [Y, J] of Z.structIterator())
        if (J.getMemberTraits().httpPayload && !(Y in G)) G[Y] = null;
      return G
    }
    async handleError(A, Q, B, G, Z) {
      let Y = gk1(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = tG.NormalizedSchema.of(J),
        D = G.message ?? G.Message ?? "Unknown",
        K = new(tG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D);
      await this.deserializeHttpMessage(J, Q, B, G);
      let V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().jsonName ?? F;
        V[F] = this.codec.createDeserializer().readObject(H, G[E])
      }
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
    getDefaultContentType() {
      return "application/json"
    }
  }
  var MI6 = (A) => {
    if (A == null) return;
    if (typeof A === "object" && "__type" in A) delete A.__type;
    return tg.expectUnion(A)
  };
  class poA extends ri {
    settings;
    stringDeserializer;
    constructor(A) {
      super();
      this.settings = A, this.stringDeserializer = new _H.FromStringShapeDeserializer(A)
    }
    setSerdeContext(A) {
      this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
    }
    read(A, Q, B) {
      let G = tG.NormalizedSchema.of(A),
        Z = G.getMemberSchemas();
      if (G.isStructSchema() && G.isMemberSchema() && !!Object.values(Z).find((I) => {
          return !!I.getMemberTraits().eventPayload
        })) {
        let I = {},
          D = Object.keys(Z)[0];
        if (Z[D].isBlobSchema()) I[D] = Q;
        else I[D] = this.read(Z[D], Q);
        return I
      }
      let J = (this.serdeContext?.utf8Encoder ?? wjQ.toUtf8)(Q),
        X = this.parseXml(J);
      return this.readSchema(A, B ? X[B] : X)
    }
    readSchema(A, Q) {
      let B = tG.NormalizedSchema.of(A);
      if (B.isUnitSchema()) return;
      let G = B.getMergedTraits();
      if (B.isListSchema() && !Array.isArray(Q)) return this.readSchema(B, [Q]);
      if (Q == null) return Q;
      if (typeof Q === "object") {
        let Z = !!G.sparse,
          Y = !!G.xmlFlattened;
        if (B.isListSchema()) {
          let X = B.getValueSchema(),
            I = [],
            D = X.getMergedTraits().xmlName ?? "member",
            W = Y ? Q : (Q[0] ?? Q)[D],
            K = Array.isArray(W) ? W : [W];
          for (let V of K)
            if (V != null || Z) I.push(this.readSchema(X, V));
          return I
        }
        let J = {};
        if (B.isMapSchema()) {
          let X = B.getKeySchema(),
            I = B.getValueSchema(),
            D;
          if (Y) D = Array.isArray(Q) ? Q : [Q];
          else D = Array.isArray(Q.entry) ? Q.entry : [Q.entry];
          let W = X.getMergedTraits().xmlName ?? "key",
            K = I.getMergedTraits().xmlName ?? "value";
          for (let V of D) {
            let F = V[W],
              H = V[K];
            if (H != null || Z) J[F] = this.readSchema(I, H)
          }
          return J
        }
        if (B.isStructSchema()) {
          for (let [X, I] of B.structIterator()) {
            let D = I.getMergedTraits(),
              W = !D.httpPayload ? I.getMemberTraits().xmlName ?? X : D.xmlName ?? I.getName();
            if (Q[W] != null) J[X] = this.readSchema(I, Q[W])
          }
          return J
        }
        if (B.isDocumentSchema()) return Q;
        throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${B.getName(!0)}`)
      }
      if (B.isListSchema()) return [];
      if (B.isMapSchema() || B.isStructSchema()) return {};
      return this.stringDeserializer.read(B, Q)
    }
    parseXml(A) {
      if (A.length) {
        let Q;
        try {
          Q = sM.parseXML(A)
        } catch (Y) {
          if (Y && typeof Y === "object") Object.defineProperty(Y, "$responseBodyText", {
            value: A
          });
          throw Y
        }
        let B = "#text",
          G = Object.keys(Q)[0],
          Z = Q[G];
        if (Z[B]) Z[G] = Z[B], delete Z[B];
        return tg.getValueFromTextNode(Z)
      }
      return {}
    }
  }
  class TjQ extends ri {
    settings;
    buffer;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q, B = "") {
      if (this.buffer === void 0) this.buffer = "";
      let G = tG.NormalizedSchema.of(A);
      if (B && !B.endsWith(".")) B += ".";
      if (G.isBlobSchema()) {
        if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? EwA.toBase64)(Q))
      } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(String(Q));
        else if (G.isIdempotencyToken()) this.writeKey(B), this.writeValue(aV.generateIdempotencyToken())
      } else if (G.isBigIntegerSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(String(Q))
      } else if (G.isBigDecimalSchema()) {
        if (Q != null) this.writeKey(B), this.writeValue(Q instanceof aV.NumericValue ? Q.string : String(Q))
      } else if (G.isTimestampSchema()) {
        if (Q instanceof Date) switch (this.writeKey(B), _H.determineTimestampFormat(G, this.settings)) {
          case 5:
            this.writeValue(Q.toISOString().replace(".000Z", "Z"));
            break;
          case 6:
            this.writeValue(tg.dateToUtcString(Q));
            break;
          case 7:
            this.writeValue(String(Q.getTime() / 1000));
            break
        }
      } else if (G.isDocumentSchema()) throw Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${G.getName(!0)}`);
      else if (G.isListSchema()) {
        if (Array.isArray(Q))
          if (Q.length === 0) {
            if (this.settings.serializeEmptyLists) this.writeKey(B), this.writeValue("")
          } else {
            let Z = G.getValueSchema(),
              Y = this.settings.flattenLists || G.getMergedTraits().xmlFlattened,
              J = 1;
            for (let X of Q) {
              if (X == null) continue;
              let I = this.getKey("member", Z.getMergedTraits().xmlName),
                D = Y ? `${B}${J}` : `${B}${I}.${J}`;
              this.write(Z, X, D), ++J
            }
          }
      } else if (G.isMapSchema()) {
        if (Q && typeof Q === "object") {
          let Z = G.getKeySchema(),
            Y = G.getValueSchema(),
            J = G.getMergedTraits().xmlFlattened,
            X = 1;
          for (let [I, D] of Object.entries(Q)) {
            if (D == null) continue;
            let W = this.getKey("key", Z.getMergedTraits().xmlName),
              K = J ? `${B}${X}.${W}` : `${B}entry.${X}.${W}`,
              V = this.getKey("value", Y.getMergedTraits().xmlName),
              F = J ? `${B}${X}.${V}` : `${B}entry.${X}.${V}`;
            this.write(Z, I, K), this.write(Y, D, F), ++X
          }
        }
      } else if (G.isStructSchema()) {
        if (Q && typeof Q === "object")
          for (let [Z, Y] of G.structIterator()) {
            if (Q[Z] == null && !Y.isIdempotencyToken()) continue;
            let J = this.getKey(Z, Y.getMergedTraits().xmlName),
              X = `${B}${J}`;
            this.write(Y, Q[Z], X)
          }
      } else if (G.isUnitSchema());
      else throw Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${G.getName(!0)}`)
    }
    flush() {
      if (this.buffer === void 0) throw Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
      let A = this.buffer;
      return delete this.buffer, A
    }
    getKey(A, Q) {
      let B = Q ?? A;
      if (this.settings.capitalizeKeys) return B[0].toUpperCase() + B.slice(1);
      return B
    }
    writeKey(A) {
      if (A.endsWith(".")) A = A.slice(0, A.length - 1);
      this.buffer += `&${_H.extendedEncodeURIComponent(A)}=`
    }
    writeValue(A) {
      this.buffer += _H.extendedEncodeURIComponent(A)
    }
  }
  class dk1 extends _H.RpcProtocol {
    options;
    serializer;
    deserializer;
    mixin = new $YA;
    constructor(A) {
      super({
        defaultNamespace: A.defaultNamespace
      });
      this.options = A;
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !1,
        xmlNamespace: A.xmlNamespace,
        serviceNamespace: A.defaultNamespace,
        serializeEmptyLists: !0
      };
      this.serializer = new TjQ(Q), this.deserializer = new poA(Q)
    }
    getShapeId() {
      return "aws.protocols#awsQuery"
    }
    setSerdeContext(A) {
      this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A)
    }
    getPayloadCodec() {
      throw Error("AWSQuery protocol has no payload codec.")
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B);
      if (!G.path.endsWith("/")) G.path += "/";
      if (Object.assign(G.headers, {
          "content-type": "application/x-www-form-urlencoded"
        }), tG.deref(A.input) === "unit" || !G.body) G.body = "";
      let Z = A.name.split("#")[1] ?? A.name;
      if (G.body = `Action=${Z}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
      return G
    }
    async deserializeResponse(A, Q, B) {
      let G = this.deserializer,
        Z = tG.NormalizedSchema.of(A.output),
        Y = {};
      if (B.statusCode >= 300) {
        let W = await _H.collectBody(B.body, Q);
        if (W.byteLength > 0) Object.assign(Y, await G.read(15, W));
        await this.handleError(A, Q, B, Y, this.deserializeMetadata(B))
      }
      for (let W in B.headers) {
        let K = B.headers[W];
        delete B.headers[W], B.headers[W.toLowerCase()] = K
      }
      let J = A.name.split("#")[1] ?? A.name,
        X = Z.isStructSchema() && this.useNestedResult() ? J + "Result" : void 0,
        I = await _H.collectBody(B.body, Q);
      if (I.byteLength > 0) Object.assign(Y, await G.read(Z, I, X));
      return {
        $metadata: this.deserializeMetadata(B),
        ...Y
      }
    }
    useNestedResult() {
      return !0
    }
    async handleError(A, Q, B, G, Z) {
      let Y = this.loadQueryErrorCode(B, G) ?? "Unknown",
        J = this.loadQueryError(G),
        X = this.loadQueryErrorMessage(G);
      J.message = X, J.Error = {
        Type: J.Type,
        Code: J.Code,
        Message: X
      };
      let {
        errorSchema: I,
        errorMetadata: D
      } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, J, Z, (H, E) => {
        try {
          return H.getSchema(E)
        } catch (z) {
          return H.find(($) => tG.NormalizedSchema.of($).getMergedTraits().awsQueryError?.[0] === E)
        }
      }), W = tG.NormalizedSchema.of(I), V = new(tG.TypeRegistry.for(I[1]).getErrorCtor(I) ?? Error)(X), F = {
        Error: J.Error
      };
      for (let [H, E] of W.structIterator()) {
        let z = E.getMergedTraits().xmlName ?? H,
          $ = J[z] ?? G[z];
        F[H] = this.deserializer.readSchema(E, $)
      }
      throw this.mixin.decorateServiceException(Object.assign(V, D, {
        $fault: W.getMergedTraits().error,
        message: X
      }, F), G)
    }
    loadQueryErrorCode(A, Q) {
      let B = (Q.Errors?.[0]?.Error ?? Q.Errors?.Error ?? Q.Error)?.Code;
      if (B !== void 0) return B;
      if (A.statusCode == 404) return "NotFound"
    }
    loadQueryError(A) {
      return A.Errors?.[0]?.Error ?? A.Errors?.Error ?? A.Error
    }
    loadQueryErrorMessage(A) {
      let Q = this.loadQueryError(A);
      return Q?.message ?? Q?.Message ?? A.message ?? A.Message ?? "Unknown"
    }
    getDefaultContentType() {
      return "application/x-www-form-urlencoded"
    }
  }
  class PjQ extends dk1 {
    options;
    constructor(A) {
      super(A);
      this.options = A;
      let Q = {
        capitalizeKeys: !0,
        flattenLists: !0,
        serializeEmptyLists: !1
      };
      Object.assign(this.serializer.settings, Q)
    }
    useNestedResult() {
      return !1
    }
  }
  var SjQ = (A, Q) => OjQ(A, Q).then((B) => {
      if (B.length) {
        let G;
        try {
          G = sM.parseXML(B)
        } catch (X) {
          if (X && typeof X === "object") Object.defineProperty(X, "$responseBodyText", {
            value: B
          });
          throw X
        }
        let Z = "#text",
          Y = Object.keys(G)[0],
          J = G[Y];
        if (J[Z]) J[Y] = J[Z], delete J[Z];
        return tg.getValueFromTextNode(J)
      }
      return {}
    }),
    RI6 = async (A, Q) => {
      let B = await SjQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, xjQ = (A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    };
  class ck1 extends ri {
    settings;
    stringBuffer;
    byteBuffer;
    buffer;
    constructor(A) {
      super();
      this.settings = A
    }
    write(A, Q) {
      let B = tG.NormalizedSchema.of(A);
      if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
      else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? EwA.fromBase64)(Q);
      else {
        this.buffer = this.writeStruct(B, Q, void 0);
        let G = B.getMergedTraits();
        if (G.httpPayload && !G.xmlName) this.buffer.withName(B.getName())
      }
    }
    flush() {
      if (this.byteBuffer !== void 0) {
        let Q = this.byteBuffer;
        return delete this.byteBuffer, Q
      }
      if (this.stringBuffer !== void 0) {
        let Q = this.stringBuffer;
        return delete this.stringBuffer, Q
      }
      let A = this.buffer;
      if (this.settings.xmlNamespace) {
        if (!A?.attributes?.xmlns) A.addAttribute("xmlns", this.settings.xmlNamespace)
      }
      return delete this.buffer, A.toString()
    }
    writeStruct(A, Q, B) {
      let G = A.getMergedTraits(),
        Z = A.isMemberSchema() && !G.httpPayload ? A.getMemberTraits().xmlName ?? A.getMemberName() : G.xmlName ?? A.getName();
      if (!Z || !A.isStructSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${A.getName(!0)}.`);
      let Y = sM.XmlNode.of(Z),
        [J, X] = this.getXmlnsAttribute(A, B);
      for (let [I, D] of A.structIterator()) {
        let W = Q[I];
        if (W != null || D.isIdempotencyToken()) {
          if (D.getMergedTraits().xmlAttribute) {
            Y.addAttribute(D.getMergedTraits().xmlName ?? I, this.writeSimple(D, W));
            continue
          }
          if (D.isListSchema()) this.writeList(D, W, Y, X);
          else if (D.isMapSchema()) this.writeMap(D, W, Y, X);
          else if (D.isStructSchema()) Y.addChildNode(this.writeStruct(D, W, X));
          else {
            let K = sM.XmlNode.of(D.getMergedTraits().xmlName ?? D.getMemberName());
            this.writeSimpleInto(D, W, K, X), Y.addChildNode(K)
          }
        }
      }
      if (X) Y.addAttribute(J, X);
      return Y
    }
    writeList(A, Q, B, G) {
      if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
      let Z = A.getMergedTraits(),
        Y = A.getValueSchema(),
        J = Y.getMergedTraits(),
        X = !!J.sparse,
        I = !!Z.xmlFlattened,
        [D, W] = this.getXmlnsAttribute(A, G),
        K = (V, F) => {
          if (Y.isListSchema()) this.writeList(Y, Array.isArray(F) ? F : [F], V, W);
          else if (Y.isMapSchema()) this.writeMap(Y, F, V, W);
          else if (Y.isStructSchema()) {
            let H = this.writeStruct(Y, F, W);
            V.addChildNode(H.withName(I ? Z.xmlName ?? A.getMemberName() : J.xmlName ?? "member"))
          } else {
            let H = sM.XmlNode.of(I ? Z.xmlName ?? A.getMemberName() : J.xmlName ?? "member");
            this.writeSimpleInto(Y, F, H, W), V.addChildNode(H)
          }
        };
      if (I) {
        for (let V of Q)
          if (X || V != null) K(B, V)
      } else {
        let V = sM.XmlNode.of(Z.xmlName ?? A.getMemberName());
        if (W) V.addAttribute(D, W);
        for (let F of Q)
          if (X || F != null) K(V, F);
        B.addChildNode(V)
      }
    }
    writeMap(A, Q, B, G, Z = !1) {
      if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
      let Y = A.getMergedTraits(),
        J = A.getKeySchema(),
        I = J.getMergedTraits().xmlName ?? "key",
        D = A.getValueSchema(),
        W = D.getMergedTraits(),
        K = W.xmlName ?? "value",
        V = !!W.sparse,
        F = !!Y.xmlFlattened,
        [H, E] = this.getXmlnsAttribute(A, G),
        z = ($, O, L) => {
          let M = sM.XmlNode.of(I, O),
            [_, j] = this.getXmlnsAttribute(J, E);
          if (j) M.addAttribute(_, j);
          $.addChildNode(M);
          let x = sM.XmlNode.of(K);
          if (D.isListSchema()) this.writeList(D, L, x, E);
          else if (D.isMapSchema()) this.writeMap(D, L, x, E, !0);
          else if (D.isStructSchema()) x = this.writeStruct(D, L, E);
          else this.writeSimpleInto(D, L, x, E);
          $.addChildNode(x)
        };
      if (F) {
        for (let [$, O] of Object.entries(Q))
          if (V || O != null) {
            let L = sM.XmlNode.of(Y.xmlName ?? A.getMemberName());
            z(L, $, O), B.addChildNode(L)
          }
      } else {
        let $;
        if (!Z) {
          if ($ = sM.XmlNode.of(Y.xmlName ?? A.getMemberName()), E) $.addAttribute(H, E);
          B.addChildNode($)
        }
        for (let [O, L] of Object.entries(Q))
          if (V || L != null) {
            let M = sM.XmlNode.of("entry");
            z(M, O, L), (Z ? B : $).addChildNode(M)
          }
      }
    }
    writeSimple(A, Q) {
      if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
      let B = tG.NormalizedSchema.of(A),
        G = null;
      if (Q && typeof Q === "object")
        if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? EwA.toBase64)(Q);
        else if (B.isTimestampSchema() && Q instanceof Date) switch (_H.determineTimestampFormat(B, this.settings)) {
        case 5:
          G = Q.toISOString().replace(".000Z", "Z");
          break;
        case 6:
          G = tg.dateToUtcString(Q);
          break;
        case 7:
          G = String(Q.getTime() / 1000);
          break;
        default:
          console.warn("Missing timestamp format, using http date", Q), G = tg.dateToUtcString(Q);
          break
      } else if (B.isBigDecimalSchema() && Q) {
        if (Q instanceof aV.NumericValue) return Q.string;
        return String(Q)
      } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
      else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
      if (B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
      if (B.isStringSchema())
        if (Q === void 0 && B.isIdempotencyToken()) G = aV.generateIdempotencyToken();
        else G = String(Q);
      if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
      return G
    }
    writeSimpleInto(A, Q, B, G) {
      let Z = this.writeSimple(A, Q),
        Y = tG.NormalizedSchema.of(A),
        J = new sM.XmlText(Z),
        [X, I] = this.getXmlnsAttribute(Y, G);
      if (I) B.addAttribute(X, I);
      B.addChildNode(J)
    }
    getXmlnsAttribute(A, Q) {
      let B = A.getMergedTraits(),
        [G, Z] = B.xmlNamespace ?? [];
      if (Z && Z !== Q) return [G ? `xmlns:${G}` : "xmlns", Z];
      return [void 0, void 0]
    }
  }
  class pk1 extends ri {
    settings;
    constructor(A) {
      super();
      this.settings = A
    }
    createSerializer() {
      let A = new ck1(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
    createDeserializer() {
      let A = new poA(this.settings);
      return A.setSerdeContext(this.serdeContext), A
    }
  }
  class yjQ extends _H.HttpBindingProtocol {
    codec;
    serializer;
    deserializer;
    mixin = new $YA;
    constructor(A) {
      super(A);
      let Q = {
        timestampFormat: {
          useTrait: !0,
          default: 5
        },
        httpBindings: !0,
        xmlNamespace: A.xmlNamespace,
        serviceNamespace: A.defaultNamespace
      };
      this.codec = new pk1(Q), this.serializer = new _H.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new _H.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
    }
    getPayloadCodec() {
      return this.codec
    }
    getShapeId() {
      return "aws.protocols#restXml"
    }
    async serializeRequest(A, Q, B) {
      let G = await super.serializeRequest(A, Q, B),
        Z = tG.NormalizedSchema.of(A.input);
      if (!G.headers["content-type"]) {
        let Y = this.mixin.resolveRestContentType(this.getDefaultContentType(), Z);
        if (Y) G.headers["content-type"] = Y
      }
      if (G.headers["content-type"] === this.getDefaultContentType()) {
        if (typeof G.body === "string") G.body = '<?xml version="1.0" encoding="UTF-8"?>' + G.body
      }
      return G
    }
    async deserializeResponse(A, Q, B) {
      return super.deserializeResponse(A, Q, B)
    }
    async handleError(A, Q, B, G, Z) {
      let Y = xjQ(B, G) ?? "Unknown",
        {
          errorSchema: J,
          errorMetadata: X
        } = await this.mixin.getErrorSchemaOrThrowBaseException(Y, this.options.defaultNamespace, B, G, Z),
        I = tG.NormalizedSchema.of(J),
        D = G.Error?.message ?? G.Error?.Message ?? G.message ?? G.Message ?? "Unknown",
        K = new(tG.TypeRegistry.for(J[1]).getErrorCtor(J) ?? Error)(D);
      await this.deserializeHttpMessage(J, Q, B, G);
      let V = {};
      for (let [F, H] of I.structIterator()) {
        let E = H.getMergedTraits().xmlName ?? F,
          z = G.Error?.[E] ?? G[E];
        V[F] = this.codec.createDeserializer().readSchema(H, z)
      }
      throw this.mixin.decorateServiceException(Object.assign(K, X, {
        $fault: I.getMergedTraits().error,
        message: D
      }, V), G)
    }
    getDefaultContentType() {
      return "application/xml"
    }
  }
  _I6.AwsEc2QueryProtocol = PjQ;
  _I6.AwsJson1_0Protocol = RjQ;
  _I6.AwsJson1_1Protocol = _jQ;
  _I6.AwsJsonRpcProtocol = coA;
  _I6.AwsQueryProtocol = dk1;
  _I6.AwsRestJsonProtocol = jjQ;
  _I6.AwsRestXmlProtocol = yjQ;
  _I6.AwsSmithyRpcV2CborProtocol = LjQ;
  _I6.JsonCodec = doA;
  _I6.JsonShapeDeserializer = uk1;
  _I6.JsonShapeSerializer = mk1;
  _I6.XmlCodec = pk1;
  _I6.XmlShapeDeserializer = poA;
  _I6.XmlShapeSerializer = ck1;
  _I6._toBool = NI6;
  _I6._toNum = wI6;
  _I6._toStr = qI6;
  _I6.awsExpectUnion = MI6;
  _I6.loadRestJsonErrorCode = gk1;
  _I6.loadRestXmlErrorCode = xjQ;
  _I6.parseJsonBody = hk1;
  _I6.parseJsonErrorBody = OI6;
  _I6.parseXmlBody = SjQ;
  _I6.parseXmlErrorBody = RI6
})
// @from(Ln 90568, Col 4)
vjQ = U((eI6) => {
  var tI6 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  eI6.isArrayBuffer = tI6
})
// @from(Ln 90572, Col 4)
ik1 = U((ZD6) => {
  var QD6 = vjQ(),
    lk1 = NA("buffer"),
    BD6 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!QD6.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return lk1.Buffer.from(A, Q, B)
    },
    GD6 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? lk1.Buffer.from(A, Q) : lk1.Buffer.from(A)
    };
  ZD6.fromArrayBuffer = BD6;
  ZD6.fromString = GD6
})
// @from(Ln 90586, Col 4)
fjQ = U((kjQ) => {
  Object.defineProperty(kjQ, "__esModule", {
    value: !0
  });
  kjQ.fromBase64 = void 0;
  var XD6 = ik1(),
    ID6 = /^[A-Za-z0-9+/]*={0,2}$/,
    DD6 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!ID6.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, XD6.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  kjQ.fromBase64 = DD6
})
// @from(Ln 90601, Col 4)
ujQ = U((hjQ) => {
  Object.defineProperty(hjQ, "__esModule", {
    value: !0
  });
  hjQ.toBase64 = void 0;
  var WD6 = ik1(),
    KD6 = oG(),
    VD6 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, KD6.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, WD6.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  hjQ.toBase64 = VD6
})
// @from(Ln 90617, Col 4)
loA = U((zwA) => {
  var mjQ = fjQ(),
    djQ = ujQ();
  Object.keys(mjQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(zwA, A)) Object.defineProperty(zwA, A, {
      enumerable: !0,
      get: function () {
        return mjQ[A]
      }
    })
  });
  Object.keys(djQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(zwA, A)) Object.defineProperty(zwA, A, {
      enumerable: !0,
      get: function () {
        return djQ[A]
      }
    })
  })
})
// @from(Ln 90637, Col 4)
YTQ = U((GTQ) => {
  Object.defineProperty(GTQ, "__esModule", {
    value: !0
  });
  GTQ.ruleSet = void 0;
  var ejQ = "required",
    eM = "fn",
    AR = "argv",
    qYA = "ref",
    cjQ = !0,
    pjQ = "isSet",
    $wA = "booleanEquals",
    CYA = "error",
    UYA = "endpoint",
    Au = "tree",
    nk1 = "PartitionResult",
    ak1 = "getAttr",
    ljQ = {
      [ejQ]: !1,
      type: "string"
    },
    ijQ = {
      [ejQ]: !0,
      default: !1,
      type: "boolean"
    },
    njQ = {
      [qYA]: "Endpoint"
    },
    ATQ = {
      [eM]: $wA,
      [AR]: [{
        [qYA]: "UseFIPS"
      }, !0]
    },
    QTQ = {
      [eM]: $wA,
      [AR]: [{
        [qYA]: "UseDualStack"
      }, !0]
    },
    tM = {},
    ajQ = {
      [eM]: ak1,
      [AR]: [{
        [qYA]: nk1
      }, "supportsFIPS"]
    },
    BTQ = {
      [qYA]: nk1
    },
    ojQ = {
      [eM]: $wA,
      [AR]: [!0, {
        [eM]: ak1,
        [AR]: [BTQ, "supportsDualStack"]
      }]
    },
    rjQ = [ATQ],
    sjQ = [QTQ],
    tjQ = [{
      [qYA]: "Region"
    }],
    FD6 = {
      version: "1.0",
      parameters: {
        Region: ljQ,
        UseDualStack: ijQ,
        UseFIPS: ijQ,
        Endpoint: ljQ
      },
      rules: [{
        conditions: [{
          [eM]: pjQ,
          [AR]: [njQ]
        }],
        rules: [{
          conditions: rjQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: CYA
        }, {
          conditions: sjQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: CYA
        }, {
          endpoint: {
            url: njQ,
            properties: tM,
            headers: tM
          },
          type: UYA
        }],
        type: Au
      }, {
        conditions: [{
          [eM]: pjQ,
          [AR]: tjQ
        }],
        rules: [{
          conditions: [{
            [eM]: "aws.partition",
            [AR]: tjQ,
            assign: nk1
          }],
          rules: [{
            conditions: [ATQ, QTQ],
            rules: [{
              conditions: [{
                [eM]: $wA,
                [AR]: [cjQ, ajQ]
              }, ojQ],
              rules: [{
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: tM,
                  headers: tM
                },
                type: UYA
              }],
              type: Au
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: CYA
            }],
            type: Au
          }, {
            conditions: rjQ,
            rules: [{
              conditions: [{
                [eM]: $wA,
                [AR]: [ajQ, cjQ]
              }],
              rules: [{
                conditions: [{
                  [eM]: "stringEquals",
                  [AR]: [{
                    [eM]: ak1,
                    [AR]: [BTQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://oidc.{Region}.amazonaws.com",
                  properties: tM,
                  headers: tM
                },
                type: UYA
              }, {
                endpoint: {
                  url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: tM,
                  headers: tM
                },
                type: UYA
              }],
              type: Au
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: CYA
            }],
            type: Au
          }, {
            conditions: sjQ,
            rules: [{
              conditions: [ojQ],
              rules: [{
                endpoint: {
                  url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: tM,
                  headers: tM
                },
                type: UYA
              }],
              type: Au
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: CYA
            }],
            type: Au
          }, {
            endpoint: {
              url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
              properties: tM,
              headers: tM
            },
            type: UYA
          }],
          type: Au
        }],
        type: Au
      }, {
        error: "Invalid Configuration: Missing Region",
        type: CYA
      }]
    };
  GTQ.ruleSet = FD6
})
// @from(Ln 90833, Col 4)
ITQ = U((JTQ) => {
  Object.defineProperty(JTQ, "__esModule", {
    value: !0
  });
  JTQ.defaultEndpointResolver = void 0;
  var HD6 = Hv(),
    ok1 = xT(),
    ED6 = YTQ(),
    zD6 = new ok1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    $D6 = (A, Q = {}) => {
      return zD6.get(A, () => (0, ok1.resolveEndpoint)(ED6.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  JTQ.defaultEndpointResolver = $D6;
  ok1.customEndpointFunctions.aws = HD6.awsEndpointFunctions
})
// @from(Ln 90854, Col 4)
FTQ = U((KTQ) => {
  Object.defineProperty(KTQ, "__esModule", {
    value: !0
  });
  KTQ.getRuntimeConfig = void 0;
  var CD6 = hY(),
    UD6 = eg(),
    qD6 = rG(),
    ND6 = YC(),
    wD6 = oM(),
    DTQ = loA(),
    WTQ = oG(),
    LD6 = yk1(),
    OD6 = ITQ(),
    MD6 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? DTQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? DTQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? OD6.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? LD6.defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new CD6.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new qD6.NoAuthSigner
        }],
        logger: A?.logger ?? new ND6.NoOpLogger,
        protocol: A?.protocol ?? new UD6.AwsRestJsonProtocol({
          defaultNamespace: "com.amazonaws.ssooidc"
        }),
        serviceId: A?.serviceId ?? "SSO OIDC",
        urlParser: A?.urlParser ?? wD6.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? WTQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? WTQ.toUtf8
      }
    };
  KTQ.getRuntimeConfig = MD6
})
// @from(Ln 90898, Col 4)
Qu = U((hD6) => {
  var RD6 = RD(),
    HTQ = _q(),
    _D6 = PW(),
    jD6 = "AWS_EXECUTION_ENV",
    ETQ = "AWS_REGION",
    zTQ = "AWS_DEFAULT_REGION",
    TD6 = "AWS_EC2_METADATA_DISABLED",
    PD6 = ["in-region", "cross-region", "mobile", "standard", "legacy"],
    SD6 = "/latest/meta-data/placement/region",
    xD6 = "AWS_DEFAULTS_MODE",
    yD6 = "defaults_mode",
    vD6 = {
      environmentVariableSelector: (A) => {
        return A[xD6]
      },
      configFileSelector: (A) => {
        return A[yD6]
      },
      default: "legacy"
    },
    kD6 = ({
      region: A = HTQ.loadConfig(RD6.NODE_REGION_CONFIG_OPTIONS),
      defaultsMode: Q = HTQ.loadConfig(vD6)
    } = {}) => _D6.memoize(async () => {
      let B = typeof Q === "function" ? await Q() : Q;
      switch (B?.toLowerCase()) {
        case "auto":
          return bD6(A);
        case "in-region":
        case "cross-region":
        case "mobile":
        case "standard":
        case "legacy":
          return Promise.resolve(B?.toLocaleLowerCase());
        case void 0:
          return Promise.resolve("legacy");
        default:
          throw Error(`Invalid parameter for "defaultsMode", expect ${PD6.join(", ")}, got ${B}`)
      }
    }),
    bD6 = async (A) => {
      if (A) {
        let Q = typeof A === "function" ? await A() : A,
          B = await fD6();
        if (!B) return "standard";
        if (Q === B) return "in-region";
        else return "cross-region"
      }
      return "standard"
    }, fD6 = async () => {
      if (process.env[jD6] && (process.env[ETQ] || process.env[zTQ])) return process.env[ETQ] ?? process.env[zTQ];
      if (!process.env[TD6]) try {
        let {
          getInstanceMetadataEndpoint: A,
          httpRequest: Q
        } = await Promise.resolve().then(() => c(H0A())), B = await A();
        return (await Q({
          ...B,
          path: SD6
        })).toString()
      } catch (A) {}
    };
  hD6.resolveDefaultsModeConfig = kD6
})
// @from(Ln 90963, Col 4)
LTQ = U((NTQ) => {
  Object.defineProperty(NTQ, "__esModule", {
    value: !0
  });
  NTQ.getRuntimeConfig = void 0;
  var uD6 = LZ(),
    mD6 = uD6.__importDefault(moA()),
    $TQ = hY(),
    CTQ = og(),
    ioA = RD(),
    dD6 = rg(),
    UTQ = RH(),
    E0A = _q(),
    qTQ = XL(),
    cD6 = sg(),
    pD6 = Uv(),
    lD6 = FTQ(),
    iD6 = YC(),
    nD6 = Qu(),
    aD6 = YC(),
    oD6 = (A) => {
      (0, aD6.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, nD6.resolveDefaultsModeConfig)(A),
        B = () => Q().then(iD6.loadConfigsForDefaultMode),
        G = (0, lD6.getRuntimeConfig)(A);
      (0, $TQ.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, E0A.loadConfig)($TQ.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? cD6.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, CTQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: mD6.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, E0A.loadConfig)(UTQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, E0A.loadConfig)(ioA.NODE_REGION_CONFIG_OPTIONS, {
          ...ioA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: qTQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, E0A.loadConfig)({
          ...UTQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || pD6.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? dD6.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? qTQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, E0A.loadConfig)(ioA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, E0A.loadConfig)(ioA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, E0A.loadConfig)(CTQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  NTQ.getRuntimeConfig = oD6
})
// @from(Ln 91023, Col 4)
RTQ = U((MTQ) => {
  Object.defineProperty(MTQ, "__esModule", {
    value: !0
  });
  MTQ.warning = void 0;
  MTQ.stsRegionDefaultResolver = sD6;
  var OTQ = RD(),
    rD6 = _q();

  function sD6(A = {}) {
    return (0, rD6.loadConfig)({
      ...OTQ.NODE_REGION_CONFIG_OPTIONS,
      async default () {
        if (!MTQ.warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
        return "us-east-1"
      }
    }, {
      ...OTQ.NODE_REGION_CONFIG_FILE_OPTIONS,
      ...A
    })
  }
  MTQ.warning = {
    silence: !1
  }
})
// @from(Ln 91048, Col 4)
vT = U((si) => {
  var CwA = RD(),
    _TQ = RTQ(),
    eD6 = (A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    },
    AW6 = (A) => {
      return {
        region: A.region()
      }
    };
  Object.defineProperty(si, "NODE_REGION_CONFIG_FILE_OPTIONS", {
    enumerable: !0,
    get: function () {
      return CwA.NODE_REGION_CONFIG_FILE_OPTIONS
    }
  });
  Object.defineProperty(si, "NODE_REGION_CONFIG_OPTIONS", {
    enumerable: !0,
    get: function () {
      return CwA.NODE_REGION_CONFIG_OPTIONS
    }
  });
  Object.defineProperty(si, "REGION_ENV_NAME", {
    enumerable: !0,
    get: function () {
      return CwA.REGION_ENV_NAME
    }
  });
  Object.defineProperty(si, "REGION_INI_NAME", {
    enumerable: !0,
    get: function () {
      return CwA.REGION_INI_NAME
    }
  });
  Object.defineProperty(si, "resolveRegionConfig", {
    enumerable: !0,
    get: function () {
      return CwA.resolveRegionConfig
    }
  });
  si.getAwsRegionExtensionConfiguration = eD6;
  si.resolveAwsRegionExtensionConfiguration = AW6;
  Object.keys(_TQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(si, A)) Object.defineProperty(si, A, {
      enumerable: !0,
      get: function () {
        return _TQ[A]
      }
    })
  })
})
// @from(Ln 91107, Col 4)
aoA = U((IW6) => {
  var GW6 = Mk1(),
    ZW6 = (A) => {
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
    YW6 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class jTQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = GW6.FieldPosition.HEADER,
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
  class TTQ {
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
  class noA {
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
      let Q = new noA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = JW6(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return noA.clone(this)
    }
  }

  function JW6(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class PTQ {
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

  function XW6(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  IW6.Field = jTQ;
  IW6.Fields = TTQ;
  IW6.HttpRequest = noA;
  IW6.HttpResponse = PTQ;
  IW6.getHttpHandlerExtensionConfiguration = ZW6;
  IW6.isValidHostname = XW6;
  IW6.resolveHttpHandlerRuntimeConfig = YW6
})
// @from(Ln 91249, Col 4)
Bb1 = U((Qb1) => {
  var STQ = bg(),
    zW6 = fg(),
    $W6 = hg(),
    xTQ = $v(),
    CW6 = RD(),
    sk1 = rG(),
    IL = WX(),
    UW6 = ag(),
    fTQ = yT(),
    yTQ = RH(),
    ti = YC(),
    vTQ = yk1(),
    qW6 = LTQ(),
    kTQ = vT(),
    bTQ = aoA(),
    NW6 = (A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "sso-oauth"
      })
    },
    wW6 = {
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
    LW6 = (A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G
      } = A;
      return {
        setHttpAuthScheme(Z) {
          let Y = Q.findIndex((J) => J.schemeId === Z.schemeId);
          if (Y === -1) Q.push(Z);
          else Q.splice(Y, 1, Z)
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
    },
    OW6 = (A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    },
    MW6 = (A, Q) => {
      let B = Object.assign(kTQ.getAwsRegionExtensionConfiguration(A), ti.getDefaultExtensionConfiguration(A), bTQ.getHttpHandlerExtensionConfiguration(A), LW6(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, kTQ.resolveAwsRegionExtensionConfiguration(B), ti.resolveDefaultRuntimeConfig(B), bTQ.resolveHttpHandlerRuntimeConfig(B), OW6(B))
    };
  class tk1 extends ti.Client {
    config;
    constructor(...[A]) {
      let Q = qW6.getRuntimeConfig(A || {});
      super(Q);
      this.initConfig = Q;
      let B = NW6(Q),
        G = xTQ.resolveUserAgentConfig(B),
        Z = yTQ.resolveRetryConfig(G),
        Y = CW6.resolveRegionConfig(Z),
        J = STQ.resolveHostHeaderConfig(Y),
        X = fTQ.resolveEndpointConfig(J),
        I = vTQ.resolveHttpAuthSchemeConfig(X),
        D = MW6(I, A?.extensions || []);
      this.config = D, this.middlewareStack.use(IL.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(xTQ.getUserAgentPlugin(this.config)), this.middlewareStack.use(yTQ.getRetryPlugin(this.config)), this.middlewareStack.use(UW6.getContentLengthPlugin(this.config)), this.middlewareStack.use(STQ.getHostHeaderPlugin(this.config)), this.middlewareStack.use(zW6.getLoggerPlugin(this.config)), this.middlewareStack.use($W6.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(sk1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
        httpAuthSchemeParametersProvider: vTQ.defaultSSOOIDCHttpAuthSchemeParametersProvider,
        identityProviderConfigProvider: async (W) => new sk1.DefaultIdentityProviderConfig({
          "aws.auth#sigv4": W.credentials
        })
      })), this.middlewareStack.use(sk1.getHttpSigningPlugin(this.config))
    }
    destroy() {
      super.destroy()
    }
  }
  var DL = class A extends ti.ServiceException {
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    hTQ = class A extends DL {
      name = "AccessDeniedException";
      $fault = "client";
      error;
      reason;
      error_description;
      constructor(Q) {
        super({
          name: "AccessDeniedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.reason = Q.reason, this.error_description = Q.error_description
      }
    },
    gTQ = class A extends DL {
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
    uTQ = class A extends DL {
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
    mTQ = class A extends DL {
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
    dTQ = class A extends DL {
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
    cTQ = class A extends DL {
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
    pTQ = class A extends DL {
      name = "InvalidRequestException";
      $fault = "client";
      error;
      reason;
      error_description;
      constructor(Q) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype), this.error = Q.error, this.reason = Q.reason, this.error_description = Q.error_description
      }
    },
    lTQ = class A extends DL {
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
    iTQ = class A extends DL {
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
    nTQ = class A extends DL {
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
    aTQ = class A extends DL {
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
    RW6 = "AccessDeniedException",
    _W6 = "AuthorizationPendingException",
    jW6 = "AccessToken",
    TW6 = "ClientSecret",
    PW6 = "CreateToken",
    SW6 = "CreateTokenRequest",
    xW6 = "CreateTokenResponse",
    yW6 = "CodeVerifier",
    vW6 = "ExpiredTokenException",
    kW6 = "InvalidClientException",
    bW6 = "InvalidGrantException",
    fW6 = "InvalidRequestException",
    hW6 = "InternalServerException",
    gW6 = "InvalidScopeException",
    uW6 = "IdToken",
    mW6 = "RefreshToken",
    dW6 = "SlowDownException",
    cW6 = "UnauthorizedClientException",
    pW6 = "UnsupportedGrantTypeException",
    lW6 = "accessToken",
    Nv = "client",
    iW6 = "clientId",
    nW6 = "clientSecret",
    aW6 = "codeVerifier",
    oW6 = "code",
    rW6 = "deviceCode",
    hI = "error",
    sW6 = "expiresIn",
    kT = "error_description",
    tW6 = "grantType",
    eW6 = "http",
    bT = "httpError",
    AK6 = "idToken",
    oTQ = "reason",
    rTQ = "refreshToken",
    QK6 = "redirectUri",
    BK6 = "scope",
    GK6 = "server",
    sTQ = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc",
    ZK6 = "tokenType",
    MG = "com.amazonaws.ssooidc",
    YK6 = [0, MG, jW6, 8, 0],
    JK6 = [0, MG, TW6, 8, 0],
    XK6 = [0, MG, yW6, 8, 0],
    IK6 = [0, MG, uW6, 8, 0],
    tTQ = [0, MG, mW6, 8, 0],
    DK6 = [-3, MG, RW6, {
        [hI]: Nv,
        [bT]: 400
      },
      [hI, oTQ, kT],
      [0, 0, 0]
    ];
  IL.TypeRegistry.for(MG).registerError(DK6, hTQ);
  var WK6 = [-3, MG, _W6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(WK6, gTQ);
  var KK6 = [3, MG, SW6, 0, [iW6, nW6, tW6, rW6, oW6, rTQ, BK6, QK6, aW6],
      [0, [() => JK6, 0], 0, 0, 0, [() => tTQ, 0], 64, 0, [() => XK6, 0]]
    ],
    VK6 = [3, MG, xW6, 0, [lW6, ZK6, sW6, rTQ, AK6],
      [
        [() => YK6, 0], 0, 1, [() => tTQ, 0],
        [() => IK6, 0]
      ]
    ],
    FK6 = [-3, MG, vW6, {
        [hI]: Nv,
        [bT]: 400
      },
      [hI, kT],
      [0, 0]
    ];
  IL.TypeRegistry.for(MG).registerError(FK6, uTQ);
  var HK6 = [-3, MG, hW6, {
      [hI]: GK6,
      [bT]: 500
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(HK6, mTQ);
  var EK6 = [-3, MG, kW6, {
      [hI]: Nv,
      [bT]: 401
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(EK6, dTQ);
  var zK6 = [-3, MG, bW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(zK6, cTQ);
  var $K6 = [-3, MG, fW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, oTQ, kT],
    [0, 0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError($K6, pTQ);
  var CK6 = [-3, MG, gW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(CK6, lTQ);
  var UK6 = [-3, MG, dW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(UK6, iTQ);
  var qK6 = [-3, MG, cW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(qK6, nTQ);
  var NK6 = [-3, MG, pW6, {
      [hI]: Nv,
      [bT]: 400
    },
    [hI, kT],
    [0, 0]
  ];
  IL.TypeRegistry.for(MG).registerError(NK6, aTQ);
  var wK6 = [-3, sTQ, "SSOOIDCServiceException", 0, [],
    []
  ];
  IL.TypeRegistry.for(sTQ).registerError(wK6, DL);
  var LK6 = [9, MG, PW6, {
    [eW6]: ["POST", "/token", 200]
  }, () => KK6, () => VK6];
  class ek1 extends ti.Command.classBuilder().ep(wW6).m(function (A, Q, B, G) {
    return [fTQ.getEndpointPlugin(B, A.getEndpointParameterInstructions())]
  }).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc(LK6).build() {}
  var OK6 = {
    CreateTokenCommand: ek1
  };
  class Ab1 extends tk1 {}
  ti.createAggregatedClient(OK6, Ab1);
  var MK6 = {
      KMS_ACCESS_DENIED: "KMS_AccessDeniedException"
    },
    RK6 = {
      KMS_DISABLED_KEY: "KMS_DisabledException",
      KMS_INVALID_KEY_USAGE: "KMS_InvalidKeyUsageException",
      KMS_INVALID_STATE: "KMS_InvalidStateException",
      KMS_KEY_NOT_FOUND: "KMS_NotFoundException"
    };
  Object.defineProperty(Qb1, "$Command", {
    enumerable: !0,
    get: function () {
      return ti.Command
    }
  });
  Object.defineProperty(Qb1, "__Client", {
    enumerable: !0,
    get: function () {
      return ti.Client
    }
  });
  Qb1.AccessDeniedException = hTQ;
  Qb1.AccessDeniedExceptionReason = MK6;
  Qb1.AuthorizationPendingException = gTQ;
  Qb1.CreateTokenCommand = ek1;
  Qb1.ExpiredTokenException = uTQ;
  Qb1.InternalServerException = mTQ;
  Qb1.InvalidClientException = dTQ;
  Qb1.InvalidGrantException = cTQ;
  Qb1.InvalidRequestException = pTQ;
  Qb1.InvalidRequestExceptionReason = RK6;
  Qb1.InvalidScopeException = lTQ;
  Qb1.SSOOIDC = Ab1;
  Qb1.SSOOIDCClient = tk1;
  Qb1.SSOOIDCServiceException = DL;
  Qb1.SlowDownException = iTQ;
  Qb1.UnauthorizedClientException = nTQ;
  Qb1.UnsupportedGrantTypeException = aTQ
})
// @from(Ln 91714, Col 4)
ooA = U((QV6) => {
  var pK6 = Rq(),
    lK6 = o_Q(),
    WL = PW(),
    UwA = Cv(),
    iK6 = NA("fs"),
    nK6 = ({
      logger: A,
      signingName: Q
    } = {}) => async () => {
      if (A?.debug?.("@aws-sdk/token-providers - fromEnvSigningName"), !Q) throw new WL.TokenProviderError("Please pass 'signingName' to compute environment variable key", {
        logger: A
      });
      let B = lK6.getBearerTokenEnvKey(Q);
      if (!(B in process.env)) throw new WL.TokenProviderError(`Token not present in '${B}' environment variable`, {
        logger: A
      });
      let G = {
        token: process.env[B]
      };
      return pK6.setTokenFeature(G, "BEARER_SERVICE_ENV_VARS", "3"), G
    }, aK6 = 300000, Gb1 = "To refresh this SSO session run 'aws sso login' with the corresponding profile.", oK6 = async (A, Q = {}) => {
      let {
        SSOOIDCClient: B
      } = await Promise.resolve().then(() => c(Bb1())), G = (Y) => Q.clientConfig?.[Y] ?? Q.parentClientConfig?.[Y];
      return new B(Object.assign({}, Q.clientConfig ?? {}, {
        region: A ?? Q.clientConfig?.region,
        logger: G("logger"),
        userAgentAppId: G("userAgentAppId")
      }))
    }, rK6 = async (A, Q, B = {}) => {
      let {
        CreateTokenCommand: G
      } = await Promise.resolve().then(() => c(Bb1()));
      return (await oK6(Q, B)).send(new G({
        clientId: A.clientId,
        clientSecret: A.clientSecret,
        refreshToken: A.refreshToken,
        grantType: "refresh_token"
      }))
    }, eTQ = (A) => {
      if (A.expiration && A.expiration.getTime() < Date.now()) throw new WL.TokenProviderError(`Token is expired. ${Gb1}`, !1)
    }, z0A = (A, Q, B = !1) => {
      if (typeof Q > "u") throw new WL.TokenProviderError(`Value not present for '${A}' in SSO Token${B?". Cannot refresh":""}. ${Gb1}`, !1)
    }, {
      writeFile: sK6
    } = iK6.promises, tK6 = (A, Q) => {
      let B = UwA.getSSOTokenFilepath(A),
        G = JSON.stringify(Q, null, 2);
      return sK6(B, G)
    }, APQ = new Date(0), QPQ = (A = {}) => async ({
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
      let G = await UwA.parseKnownFiles(B),
        Z = UwA.getProfileName({
          profile: B.profile ?? Q?.profile
        }),
        Y = G[Z];
      if (!Y) throw new WL.TokenProviderError(`Profile '${Z}' could not be found in shared credentials file.`, !1);
      else if (!Y.sso_session) throw new WL.TokenProviderError(`Profile '${Z}' is missing required property 'sso_session'.`);
      let J = Y.sso_session,
        I = (await UwA.loadSsoSessionData(B))[J];
      if (!I) throw new WL.TokenProviderError(`Sso session '${J}' could not be found in shared credentials file.`, !1);
      for (let H of ["sso_start_url", "sso_region"])
        if (!I[H]) throw new WL.TokenProviderError(`Sso session '${J}' is missing required property '${H}'.`, !1);
      I.sso_start_url;
      let D = I.sso_region,
        W;
      try {
        W = await UwA.getSSOTokenFromFile(J)
      } catch (H) {
        throw new WL.TokenProviderError(`The SSO session token associated with profile=${Z} was not found or is invalid. ${Gb1}`, !1)
      }
      z0A("accessToken", W.accessToken), z0A("expiresAt", W.expiresAt);
      let {
        accessToken: K,
        expiresAt: V
      } = W, F = {
        token: K,
        expiration: new Date(V)
      };
      if (F.expiration.getTime() - Date.now() > aK6) return F;
      if (Date.now() - APQ.getTime() < 30000) return eTQ(F), F;
      z0A("clientId", W.clientId, !0), z0A("clientSecret", W.clientSecret, !0), z0A("refreshToken", W.refreshToken, !0);
      try {
        APQ.setTime(Date.now());
        let H = await rK6(W, D, B);
        z0A("accessToken", H.accessToken), z0A("expiresIn", H.expiresIn);
        let E = new Date(Date.now() + H.expiresIn * 1000);
        try {
          await tK6(J, {
            ...W,
            accessToken: H.accessToken,
            expiresAt: E.toISOString(),
            refreshToken: H.refreshToken
          })
        } catch (z) {}
        return {
          token: H.accessToken,
          expiration: E
        }
      } catch (H) {
        return eTQ(F), F
      }
    }, eK6 = ({
      token: A,
      logger: Q
    }) => async () => {
      if (Q?.debug("@aws-sdk/token-providers - fromStatic"), !A || !A.token) throw new WL.TokenProviderError("Please pass a valid token to fromStatic", !1);
      return A
    }, AV6 = (A = {}) => WL.memoize(WL.chain(QPQ(A), async () => {
      throw new WL.TokenProviderError("Could not load token from any providers", !1)
    }), (Q) => Q.expiration !== void 0 && Q.expiration.getTime() - Date.now() < 300000, (Q) => Q.expiration !== void 0);
  QV6.fromEnvSigningName = nK6;
  QV6.fromSso = QPQ;
  QV6.fromStatic = eK6;
  QV6.nodeProvider = AV6
})
// @from(Ln 91840, Col 4)
Wb1 = U((KV6) => {
  KV6.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(KV6.HttpAuthLocation || (KV6.HttpAuthLocation = {}));
  KV6.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(KV6.HttpApiKeyAuthLocation || (KV6.HttpApiKeyAuthLocation = {}));
  KV6.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(KV6.EndpointURLScheme || (KV6.EndpointURLScheme = {}));
  KV6.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(KV6.AlgorithmId || (KV6.AlgorithmId = {}));
  var JV6 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => KV6.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => KV6.AlgorithmId.MD5,
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
    XV6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    IV6 = (A) => {
      return JV6(A)
    },
    DV6 = (A) => {
      return XV6(A)
    };
  KV6.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(KV6.FieldPosition || (KV6.FieldPosition = {}));
  var WV6 = "__smithy_context";
  KV6.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(KV6.IniSectionType || (KV6.IniSectionType = {}));
  KV6.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(KV6.RequestHandlerProtocol || (KV6.RequestHandlerProtocol = {}));
  KV6.SMITHY_CONTEXT_KEY = WV6;
  KV6.getDefaultClientConfiguration = IV6;
  KV6.resolveDefaultRuntimeConfig = DV6
})
// @from(Ln 91905, Col 4)
NwA = U((wYA) => {
  var ZPQ = Ev(),
    Eb1 = Mq(),
    Vb1 = Wb1(),
    EV6 = WX(),
    BPQ = Oq();
  class YPQ {
    config;
    middlewareStack = ZPQ.constructStack();
    initConfig;
    handlers;
    constructor(A) {
      this.config = A
    }
    send(A, Q, B) {
      let G = typeof Q !== "function" ? Q : void 0,
        Z = typeof Q === "function" ? Q : B,
        Y = G === void 0 && this.config.cacheMiddleware === !0,
        J;
      if (Y) {
        if (!this.handlers) this.handlers = new WeakMap;
        let X = this.handlers;
        if (X.has(A.constructor)) J = X.get(A.constructor);
        else J = A.resolveMiddleware(this.middlewareStack, this.config, G), X.set(A.constructor, J)
      } else delete this.handlers, J = A.resolveMiddleware(this.middlewareStack, this.config, G);
      if (Z) J(A).then((X) => Z(null, X.output), (X) => Z(X)).catch(() => {});
      else return J(A).then((X) => X.output)
    }
    destroy() {
      this.config?.requestHandler?.destroy?.(), delete this.handlers
    }
  }
  var Kb1 = "***SensitiveInformation***";

  function Fb1(A, Q) {
    if (Q == null) return Q;
    let B = EV6.NormalizedSchema.of(A);
    if (B.getMergedTraits().sensitive) return Kb1;
    if (B.isListSchema()) {
      if (!!B.getValueSchema().getMergedTraits().sensitive) return Kb1
    } else if (B.isMapSchema()) {
      if (!!B.getKeySchema().getMergedTraits().sensitive || !!B.getValueSchema().getMergedTraits().sensitive) return Kb1
    } else if (B.isStructSchema() && typeof Q === "object") {
      let G = Q,
        Z = {};
      for (let [Y, J] of B.structIterator())
        if (G[Y] != null) Z[Y] = Fb1(J, G[Y]);
      return Z
    }
    return Q
  }
  class zb1 {
    middlewareStack = ZPQ.constructStack();
    schema;
    static classBuilder() {
      return new JPQ
    }
    resolveMiddlewareWithContext(A, Q, B, {
      middlewareFn: G,
      clientName: Z,
      commandName: Y,
      inputFilterSensitiveLog: J,
      outputFilterSensitiveLog: X,
      smithyContext: I,
      additionalContext: D,
      CommandCtor: W
    }) {
      for (let E of G.bind(this)(W, A, Q, B)) this.middlewareStack.use(E);
      let K = A.concat(this.middlewareStack),
        {
          logger: V
        } = Q,
        F = {
          logger: V,
          clientName: Z,
          commandName: Y,
          inputFilterSensitiveLog: J,
          outputFilterSensitiveLog: X,
          [Vb1.SMITHY_CONTEXT_KEY]: {
            commandInstance: this,
            ...I
          },
          ...D
        },
        {
          requestHandler: H
        } = Q;
      return K.resolve((E) => H.handle(E.request, B || {}), F)
    }
  }
  class JPQ {
    _init = () => {};
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = void 0;
    _outputFilterSensitiveLog = void 0;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
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
    sc(A) {
      return this._operationSchema = A, this._smithyContext.operationSchema = A, this
    }
    build() {
      let A = this,
        Q;
      return Q = class extends zb1 {
        input;
        static getEndpointParameterInstructions() {
          return A._ep
        }
        constructor(...[B]) {
          super();
          this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
        }
        resolveMiddleware(B, G, Z) {
          let Y = A._operationSchema,
            J = Y?.[4] ?? Y?.input,
            X = Y?.[5] ?? Y?.output;
          return this.resolveMiddlewareWithContext(B, G, Z, {
            CommandCtor: Q,
            middlewareFn: A._middlewareFn,
            clientName: A._clientName,
            commandName: A._commandName,
            inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (Y ? Fb1.bind(null, J) : (I) => I),
            outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (Y ? Fb1.bind(null, X) : (I) => I),
            smithyContext: A._smithyContext,
            additionalContext: A._additionalContext
          })
        }
        serialize = A._serializer;
        deserialize = A._deserializer
      }
    }
  }
  var zV6 = "***SensitiveInformation***",
    $V6 = (A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = async function (J, X, I) {
            let D = new G(J);
            if (typeof X === "function") this.send(D, X);
            else if (typeof I === "function") {
              if (typeof X !== "object") throw Error(`Expected http options but got ${typeof X}`);
              this.send(D, X || {}, I)
            } else return this.send(D, X)
          }, Y = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[Y] = Z
      }
    };
  class NYA extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(A) {
      super(A.message);
      Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return NYA.prototype.isPrototypeOf(Q) || Boolean(Q.$fault) && Boolean(Q.$metadata) && (Q.$fault === "client" || Q.$fault === "server")
    }
    static[Symbol.hasInstance](A) {
      if (!A) return !1;
      let Q = A;
      if (this === NYA) return NYA.isInstance(A);
      if (NYA.isInstance(A)) {
        if (Q.name && this.name) return this.prototype.isPrototypeOf(A) || Q.name === this.name;
        return this.prototype.isPrototypeOf(A)
      }
      return !1
    }
  }
  var XPQ = (A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    },
    IPQ = ({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = UV6(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: Q?.code || Q?.Code || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw XPQ(J, Q)
    },
    CV6 = (A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        IPQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    },
    UV6 = (A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }),
    qV6 = (A) => {
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
    },
    GPQ = !1,
    NV6 = (A) => {
      if (A && !GPQ && parseInt(A.substring(1, A.indexOf("."))) < 16) GPQ = !0
    },
    wV6 = (A) => {
      let Q = [];
      for (let B in Vb1.AlgorithmId) {
        let G = Vb1.AlgorithmId[B];
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
    },
    LV6 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    OV6 = (A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    },
    MV6 = (A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    },
    DPQ = (A) => {
      return Object.assign(wV6(A), OV6(A))
    },
    RV6 = DPQ,
    _V6 = (A) => {
      return Object.assign(LV6(A), MV6(A))
    },
    jV6 = (A) => Array.isArray(A) ? A : [A],
    WPQ = (A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = WPQ(A[B]);
      return A
    },
    TV6 = (A) => {
      return A != null
    };
  class KPQ {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  }

  function VPQ(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, xV6(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      FPQ(G, null, Y, J)
    }
    return G
  }
  var PV6 = (A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    },
    SV6 = (A, Q) => {
      let B = {};
      for (let G in Q) FPQ(B, A, Q, G);
      return B
    },
    xV6 = (A, Q, B) => {
      return VPQ(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    },
    FPQ = (A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = yV6, I = vV6, D = G] = J;
        if (typeof X === "function" && X(Q[D]) || typeof X !== "function" && !!X) A[G] = I(Q[D]);
        return
      }
      let [Z, Y] = B[G];
      if (typeof Y === "function") {
        let J, X = Z === void 0 && (J = Y()) != null,
          I = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (X) A[G] = J;
        else if (I) A[G] = Y()
      } else {
        let J = Z === void 0 && Y != null,
          X = typeof Z === "function" && !!Z(Y) || typeof Z !== "function" && !!Z;
        if (J || X) A[G] = Y
      }
    },
    yV6 = (A) => A != null,
    vV6 = (A) => A,
    kV6 = (A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    },
    bV6 = (A) => A.toISOString().replace(".000Z", "Z"),
    Hb1 = (A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Hb1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Hb1(A[B])
        }
        return Q
      }
      return A
    };
  Object.defineProperty(wYA, "collectBody", {
    enumerable: !0,
    get: function () {
      return Eb1.collectBody
    }
  });
  Object.defineProperty(wYA, "extendedEncodeURIComponent", {
    enumerable: !0,
    get: function () {
      return Eb1.extendedEncodeURIComponent
    }
  });
  Object.defineProperty(wYA, "resolvedPath", {
    enumerable: !0,
    get: function () {
      return Eb1.resolvedPath
    }
  });
  wYA.Client = YPQ;
  wYA.Command = zb1;
  wYA.NoOpLogger = KPQ;
  wYA.SENSITIVE_STRING = zV6;
  wYA.ServiceException = NYA;
  wYA._json = Hb1;
  wYA.convertMap = PV6;
  wYA.createAggregatedClient = $V6;
  wYA.decorateServiceException = XPQ;
  wYA.emitWarningIfUnsupportedVersion = NV6;
  wYA.getArrayIfSingleItem = jV6;
  wYA.getDefaultClientConfiguration = RV6;
  wYA.getDefaultExtensionConfiguration = DPQ;
  wYA.getValueFromTextNode = WPQ;
  wYA.isSerializableHeaderValue = TV6;
  wYA.loadConfigsForDefaultMode = qV6;
  wYA.map = VPQ;
  wYA.resolveDefaultRuntimeConfig = _V6;
  wYA.serializeDateTime = bV6;
  wYA.serializeFloat = kV6;
  wYA.take = SV6;
  wYA.throwDefaultError = IPQ;
  wYA.withBaseException = CV6;
  Object.keys(BPQ).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(wYA, A)) Object.defineProperty(wYA, A, {
      enumerable: !0,
      get: function () {
        return BPQ[A]
      }
    })
  })
})
// @from(Ln 92375, Col 4)
Cb1 = U((HPQ) => {
  Object.defineProperty(HPQ, "__esModule", {
    value: !0
  });
  HPQ.resolveHttpAuthSchemeConfig = HPQ.defaultSSOHttpAuthSchemeProvider = HPQ.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var JF6 = hY(),
    $b1 = Jz(),
    XF6 = async (A, Q, B) => {
      return {
        operation: (0, $b1.getSmithyContext)(Q).operation,
        region: await (0, $b1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  HPQ.defaultSSOHttpAuthSchemeParametersProvider = XF6;

  function IF6(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "awsssoportal",
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

  function roA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var DF6 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(roA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(roA(A));
        break
      }
      case "ListAccounts": {
        Q.push(roA(A));
        break
      }
      case "Logout": {
        Q.push(roA(A));
        break
      }
      default:
        Q.push(IF6(A))
    }
    return Q
  };
  HPQ.defaultSSOHttpAuthSchemeProvider = DF6;
  var WF6 = (A) => {
    let Q = (0, JF6.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, $b1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  HPQ.resolveHttpAuthSchemeConfig = WF6
})