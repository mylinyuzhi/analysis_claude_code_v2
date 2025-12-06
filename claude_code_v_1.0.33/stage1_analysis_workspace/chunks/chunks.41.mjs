
// @from(Start 3690537, End 3735728)
ljQ = z((OM7, pjQ) => {
  var {
    defineProperty: EdA,
    getOwnPropertyDescriptor: xZ8,
    getOwnPropertyNames: vZ8
  } = Object, bZ8 = Object.prototype.hasOwnProperty, W3 = (A, Q) => EdA(A, "name", {
    value: Q,
    configurable: !0
  }), fZ8 = (A, Q) => {
    for (var B in Q) EdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, hZ8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of vZ8(Q))
        if (!bZ8.call(A, Z) && Z !== B) EdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xZ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gZ8 = (A) => hZ8(EdA({}, "__esModule", {
    value: !0
  }), A), xjQ = {};
  fZ8(xjQ, {
    AwsEc2QueryProtocol: () => HI8,
    AwsJson1_0Protocol: () => eZ8,
    AwsJson1_1Protocol: () => AI8,
    AwsJsonRpcProtocol: () => rT1,
    AwsQueryProtocol: () => gjQ,
    AwsRestJsonProtocol: () => BI8,
    AwsRestXmlProtocol: () => wI8,
    JsonCodec: () => sT1,
    JsonShapeDeserializer: () => fjQ,
    JsonShapeSerializer: () => hjQ,
    XmlCodec: () => cjQ,
    XmlShapeDeserializer: () => oT1,
    XmlShapeSerializer: () => djQ,
    _toBool: () => mZ8,
    _toNum: () => dZ8,
    _toStr: () => uZ8,
    awsExpectUnion: () => ZI8,
    loadRestJsonErrorCode: () => aT1,
    loadRestXmlErrorCode: () => mjQ,
    parseJsonBody: () => nT1,
    parseJsonErrorBody: () => aZ8,
    parseXmlBody: () => ujQ,
    parseXmlErrorBody: () => UI8
  });
  pjQ.exports = gZ8(xjQ);
  var uZ8 = W3((A) => {
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
    }, "_toStr"),
    mZ8 = W3((A) => {
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
    }, "_toBool"),
    dZ8 = W3((A) => {
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
    }, "_toNum"),
    cZ8 = w5(),
    S6A = b4(),
    pZ8 = oK(),
    Uo = class {
      static {
        W3(this, "SerdeContextConfig")
      }
      serdeContext;
      setSerdeContext(A) {
        this.serdeContext = A
      }
    },
    $CA = b4(),
    _6A = s6(),
    lZ8 = ld(),
    iZ8 = s6();

  function vjQ(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new iZ8.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  W3(vjQ, "jsonReviver");
  var nZ8 = o6(),
    bjQ = W3((A, Q) => (0, nZ8.collectBody)(A, Q).then((B) => Q.utf8Encoder(B)), "collectBodyString"),
    nT1 = W3((A, Q) => bjQ(A, Q).then((B) => {
      if (B.length) try {
        return JSON.parse(B)
      } catch (G) {
        if (G?.name === "SyntaxError") Object.defineProperty(G, "$responseBodyText", {
          value: B
        });
        throw G
      }
      return {}
    }), "parseJsonBody"),
    aZ8 = W3(async (A, Q) => {
      let B = await nT1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, "parseJsonErrorBody"),
    aT1 = W3((A, Q) => {
      let B = W3((I, Y) => Object.keys(I).find((J) => J.toLowerCase() === Y.toLowerCase()), "findKey"),
        G = W3((I) => {
          let Y = I;
          if (typeof Y === "number") Y = Y.toString();
          if (Y.indexOf(",") >= 0) Y = Y.split(",")[0];
          if (Y.indexOf(":") >= 0) Y = Y.split(":")[0];
          if (Y.indexOf("#") >= 0) Y = Y.split("#")[1];
          return Y
        }, "sanitizeErrorCode"),
        Z = B(A.headers, "x-amzn-errortype");
      if (Z !== void 0) return G(A.headers[Z]);
      if (Q && typeof Q === "object") {
        let I = B(Q, "code");
        if (I && Q[I] !== void 0) return G(Q[I]);
        if (Q.__type !== void 0) return G(Q.__type)
      }
    }, "loadRestJsonErrorCode"),
    fjQ = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "JsonShapeDeserializer")
      }
      async read(A, Q) {
        return this._read(A, typeof Q === "string" ? JSON.parse(Q, vjQ) : await nT1(Q, this.serdeContext))
      }
      readObject(A, Q) {
        return this._read(A, Q)
      }
      _read(A, Q) {
        let B = Q !== null && typeof Q === "object",
          G = $CA.NormalizedSchema.of(A);
        if (G.isListSchema() && Array.isArray(Q)) {
          let I = G.getValueSchema(),
            Y = [],
            J = !!G.getMergedTraits().sparse;
          for (let W of Q)
            if (J || W != null) Y.push(this._read(I, W));
          return Y
        } else if (G.isMapSchema() && B) {
          let I = G.getValueSchema(),
            Y = {},
            J = !!G.getMergedTraits().sparse;
          for (let [W, X] of Object.entries(Q))
            if (J || X != null) Y[W] = this._read(I, X);
          return Y
        } else if (G.isStructSchema() && B) {
          let I = {};
          for (let [Y, J] of G.structIterator()) {
            let W = this.settings.jsonName ? J.getMergedTraits().jsonName ?? Y : Y,
              X = this._read(J, Q[W]);
            if (X != null) I[Y] = X
          }
          return I
        }
        if (G.isBlobSchema() && typeof Q === "string") return (0, lZ8.fromBase64)(Q);
        let Z = G.getMergedTraits().mediaType;
        if (G.isStringSchema() && typeof Q === "string" && Z) {
          if (Z === "application/json" || Z.endsWith("+json")) return _6A.LazyJsonString.from(Q)
        }
        if (G.isTimestampSchema()) {
          let I = this.settings.timestampFormat;
          switch (I.useTrait ? G.getSchema() === $CA.SCHEMA.TIMESTAMP_DEFAULT ? I.default : G.getSchema() ?? I.default : I.default) {
            case $CA.SCHEMA.TIMESTAMP_DATE_TIME:
              return (0, _6A.parseRfc3339DateTimeWithOffset)(Q);
            case $CA.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, _6A.parseRfc7231DateTime)(Q);
            case $CA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return (0, _6A.parseEpochTimestamp)(Q);
            default:
              return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
          }
        }
        if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
        if (G.isBigDecimalSchema() && Q != null) {
          if (Q instanceof _6A.NumericValue) return Q;
          return new _6A.NumericValue(String(Q), "bigDecimal")
        }
        if (G.isNumericSchema() && typeof Q === "string") switch (Q) {
          case "Infinity":
            return 1 / 0;
          case "-Infinity":
            return -1 / 0;
          case "NaN":
            return NaN
        }
        return Q
      }
    },
    k6A = b4(),
    sZ8 = s6(),
    rZ8 = s6(),
    oZ8 = s6(),
    SjQ = String.fromCharCode(925),
    tZ8 = class {
      static {
        W3(this, "JsonReplacer")
      }
      values = new Map;
      counter = 0;
      stage = 0;
      createReplacer() {
        if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
        if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
        return this.stage = 1, (A, Q) => {
          if (Q instanceof oZ8.NumericValue) {
            let B = `${SjQ+NaN+this.counter++}_` + Q.string;
            return this.values.set(`"${B}"`, Q.string), B
          }
          if (typeof Q === "bigint") {
            let B = Q.toString(),
              G = `${SjQ+"b"+this.counter++}_` + B;
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
    },
    hjQ = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "JsonShapeSerializer")
      }
      buffer;
      rootSchema;
      write(A, Q) {
        this.rootSchema = k6A.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
      }
      flush() {
        if (this.rootSchema?.isStructSchema() || this.rootSchema?.isDocumentSchema()) {
          let A = new tZ8;
          return A.replaceInJson(JSON.stringify(this.buffer, A.createReplacer(), 0))
        }
        return this.buffer
      }
      _write(A, Q, B) {
        let G = Q !== null && typeof Q === "object",
          Z = k6A.NormalizedSchema.of(A);
        if (Z.isListSchema() && Array.isArray(Q)) {
          let Y = Z.getValueSchema(),
            J = [],
            W = !!Z.getMergedTraits().sparse;
          for (let X of Q)
            if (W || X != null) J.push(this._write(Y, X));
          return J
        } else if (Z.isMapSchema() && G) {
          let Y = Z.getValueSchema(),
            J = {},
            W = !!Z.getMergedTraits().sparse;
          for (let [X, V] of Object.entries(Q))
            if (W || V != null) J[X] = this._write(Y, V);
          return J
        } else if (Z.isStructSchema() && G) {
          let Y = {};
          for (let [J, W] of Z.structIterator()) {
            let X = this.settings.jsonName ? W.getMergedTraits().jsonName ?? J : J,
              V = this._write(W, Q[J], Z);
            if (V !== void 0) Y[X] = V
          }
          return Y
        }
        if (Q === null && B?.isStructSchema()) return;
        if (Z.isBlobSchema() && (Q instanceof Uint8Array || typeof Q === "string")) {
          if (Z === this.rootSchema) return Q;
          if (!this.serdeContext?.base64Encoder) throw Error("Missing base64Encoder in serdeContext");
          return this.serdeContext?.base64Encoder(Q)
        }
        if (Z.isTimestampSchema() && Q instanceof Date) {
          let Y = this.settings.timestampFormat;
          switch (Y.useTrait ? Z.getSchema() === k6A.SCHEMA.TIMESTAMP_DEFAULT ? Y.default : Z.getSchema() ?? Y.default : Y.default) {
            case k6A.SCHEMA.TIMESTAMP_DATE_TIME:
              return Q.toISOString().replace(".000Z", "Z");
            case k6A.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, sZ8.dateToUtcString)(Q);
            case k6A.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return Q.getTime() / 1000;
            default:
              return console.warn("Missing timestamp format, using epoch seconds", Q), Q.getTime() / 1000
          }
        }
        if (Z.isNumericSchema() && typeof Q === "number") {
          if (Math.abs(Q) === 1 / 0 || isNaN(Q)) return String(Q)
        }
        let I = Z.getMergedTraits().mediaType;
        if (Z.isStringSchema() && typeof Q === "string" && I) {
          if (I === "application/json" || I.endsWith("+json")) return rZ8.LazyJsonString.from(Q)
        }
        return Q
      }
    },
    sT1 = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "JsonCodec")
      }
      createSerializer() {
        let A = new hjQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new fjQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    rT1 = class extends cZ8.RpcProtocol {
      static {
        W3(this, "AwsJsonRpcProtocol")
      }
      serializer;
      deserializer;
      codec;
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        });
        this.codec = new sT1({
          timestampFormat: {
            useTrait: !0,
            default: S6A.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          jsonName: !1
        }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer()
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B);
        if (!G.path.endsWith("/")) G.path += "/";
        if (Object.assign(G.headers, {
            "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
            "x-amz-target": (this.getJsonRpcVersion() === "1.0" ? "JsonRpc10." : "JsonProtocol.") + S6A.NormalizedSchema.of(A).getName()
          }), (0, S6A.deref)(A.input) === "unit" || !G.body) G.body = "{}";
        try {
          G.headers["content-length"] = String((0, pZ8.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      getPayloadCodec() {
        return this.codec
      }
      async handleError(A, Q, B, G, Z) {
        let I = aT1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = S6A.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = S6A.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = S6A.NormalizedSchema.of(X),
          F = G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().jsonName ?? H;
          D[H] = this.codec.createDeserializer().readObject(C, G[E])
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    },
    eZ8 = class extends rT1 {
      static {
        W3(this, "AwsJson1_0Protocol")
      }
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        })
      }
      getShapeId() {
        return "aws.protocols#awsJson1_0"
      }
      getJsonRpcVersion() {
        return "1.0"
      }
    },
    AI8 = class extends rT1 {
      static {
        W3(this, "AwsJson1_1Protocol")
      }
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        })
      }
      getShapeId() {
        return "aws.protocols#awsJson1_1"
      }
      getJsonRpcVersion() {
        return "1.1"
      }
    },
    cT1 = w5(),
    wCA = b4(),
    QI8 = oK(),
    BI8 = class extends cT1.HttpBindingProtocol {
      static {
        W3(this, "AwsRestJsonProtocol")
      }
      serializer;
      deserializer;
      codec;
      constructor({
        defaultNamespace: A
      }) {
        super({
          defaultNamespace: A
        });
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: wCA.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          httpBindings: !0,
          jsonName: !0
        };
        this.codec = new sT1(Q), this.serializer = new cT1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new cT1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
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
          Z = wCA.NormalizedSchema.of(A.input),
          I = Z.getMemberSchemas();
        if (!G.headers["content-type"]) {
          let Y = Object.values(I).find((J) => {
            return !!J.getMergedTraits().httpPayload
          });
          if (Y) {
            let J = Y.getMergedTraits().mediaType;
            if (J) G.headers["content-type"] = J;
            else if (Y.isStringSchema()) G.headers["content-type"] = "text/plain";
            else if (Y.isBlobSchema()) G.headers["content-type"] = "application/octet-stream";
            else G.headers["content-type"] = "application/json"
          } else if (!Z.isUnitSchema()) {
            if (Object.values(I).find((W) => {
                let {
                  httpQuery: X,
                  httpQueryParams: V,
                  httpHeader: F,
                  httpLabel: K,
                  httpPrefixHeaders: D
                } = W.getMergedTraits();
                return !X && !V && !F && !K && D === void 0
              })) G.headers["content-type"] = "application/json"
          }
        }
        if (G.headers["content-type"] && !G.body) G.body = "{}";
        if (G.body) try {
          G.headers["content-length"] = String((0, QI8.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async handleError(A, Q, B, G, Z) {
        let I = aT1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = wCA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = wCA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = wCA.NormalizedSchema.of(X),
          F = G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().jsonName ?? H;
          D[H] = this.codec.createDeserializer().readObject(C, G[E])
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    },
    GI8 = o6(),
    ZI8 = W3((A) => {
      if (A == null) return;
      if (typeof A === "object" && "__type" in A) delete A.__type;
      return (0, GI8.expectUnion)(A)
    }, "awsExpectUnion"),
    pT1 = w5(),
    id = b4(),
    II8 = oK(),
    YI8 = w5(),
    _jQ = b4(),
    JI8 = o6(),
    WI8 = O2(),
    XI8 = wS(),
    oT1 = class extends Uo {
      constructor(A) {
        super();
        this.settings = A, this.stringDeserializer = new YI8.FromStringShapeDeserializer(A)
      }
      static {
        W3(this, "XmlShapeDeserializer")
      }
      stringDeserializer;
      setSerdeContext(A) {
        this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
      }
      read(A, Q, B) {
        let G = _jQ.NormalizedSchema.of(A),
          Z = G.getMemberSchemas();
        if (G.isStructSchema() && G.isMemberSchema() && !!Object.values(Z).find((W) => {
            return !!W.getMemberTraits().eventPayload
          })) {
          let W = {},
            X = Object.keys(Z)[0];
          if (Z[X].isBlobSchema()) W[X] = Q;
          else W[X] = this.read(Z[X], Q);
          return W
        }
        let Y = (this.serdeContext?.utf8Encoder ?? WI8.toUtf8)(Q),
          J = this.parseXml(Y);
        return this.readSchema(A, B ? J[B] : J)
      }
      readSchema(A, Q) {
        let B = _jQ.NormalizedSchema.of(A),
          G = B.getMergedTraits(),
          Z = B.getSchema();
        if (B.isListSchema() && !Array.isArray(Q)) return this.readSchema(Z, [Q]);
        if (Q == null) return Q;
        if (typeof Q === "object") {
          let I = !!G.sparse,
            Y = !!G.xmlFlattened;
          if (B.isListSchema()) {
            let W = B.getValueSchema(),
              X = [],
              V = W.getMergedTraits().xmlName ?? "member",
              F = Y ? Q : (Q[0] ?? Q)[V],
              K = Array.isArray(F) ? F : [F];
            for (let D of K)
              if (D != null || I) X.push(this.readSchema(W, D));
            return X
          }
          let J = {};
          if (B.isMapSchema()) {
            let W = B.getKeySchema(),
              X = B.getValueSchema(),
              V;
            if (Y) V = Array.isArray(Q) ? Q : [Q];
            else V = Array.isArray(Q.entry) ? Q.entry : [Q.entry];
            let F = W.getMergedTraits().xmlName ?? "key",
              K = X.getMergedTraits().xmlName ?? "value";
            for (let D of V) {
              let H = D[F],
                C = D[K];
              if (C != null || I) J[H] = this.readSchema(X, C)
            }
            return J
          }
          if (B.isStructSchema()) {
            for (let [W, X] of B.structIterator()) {
              let V = X.getMergedTraits(),
                F = !V.httpPayload ? X.getMemberTraits().xmlName ?? W : V.xmlName ?? X.getName();
              if (Q[F] != null) J[W] = this.readSchema(X, Q[F])
            }
            return J
          }
          if (B.isDocumentSchema()) return Q;
          throw Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${B.getName(!0)}`)
        } else {
          if (B.isListSchema()) return [];
          else if (B.isMapSchema() || B.isStructSchema()) return {};
          return this.stringDeserializer.read(B, Q)
        }
      }
      parseXml(A) {
        if (A.length) {
          let Q = new XI8.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: W3((Y, J) => J.trim() === "" && J.includes(`
`) ? "" : void 0, "tagValueProcessor")
          });
          Q.addEntity("#xD", "\r"), Q.addEntity("#10", `
`);
          let B;
          try {
            B = Q.parse(A, !0)
          } catch (Y) {
            if (Y && typeof Y === "object") Object.defineProperty(Y, "$responseBodyText", {
              value: A
            });
            throw Y
          }
          let G = "#text",
            Z = Object.keys(B)[0],
            I = B[Z];
          if (I[G]) I[Z] = I[G], delete I[G];
          return (0, JI8.getValueFromTextNode)(I)
        }
        return {}
      }
    },
    lT1 = w5(),
    CdA = b4(),
    VI8 = s6(),
    FI8 = o6(),
    KI8 = ld(),
    DI8 = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "QueryShapeSerializer")
      }
      buffer;
      write(A, Q, B = "") {
        if (this.buffer === void 0) this.buffer = "";
        let G = CdA.NormalizedSchema.of(A);
        if (B && !B.endsWith(".")) B += ".";
        if (G.isBlobSchema()) {
          if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? KI8.toBase64)(Q))
        } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigIntegerSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigDecimalSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(Q instanceof VI8.NumericValue ? Q.string : String(Q))
        } else if (G.isTimestampSchema()) {
          if (Q instanceof Date) switch (this.writeKey(B), (0, lT1.determineTimestampFormat)(G, this.settings)) {
            case CdA.SCHEMA.TIMESTAMP_DATE_TIME:
              this.writeValue(Q.toISOString().replace(".000Z", "Z"));
              break;
            case CdA.SCHEMA.TIMESTAMP_HTTP_DATE:
              this.writeValue((0, FI8.dateToUtcString)(Q));
              break;
            case CdA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
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
                I = this.settings.flattenLists || G.getMergedTraits().xmlFlattened,
                Y = 1;
              for (let J of Q) {
                if (J == null) continue;
                let W = this.getKey("member", Z.getMergedTraits().xmlName),
                  X = I ? `${B}${Y}` : `${B}${W}.${Y}`;
                this.write(Z, J, X), ++Y
              }
            }
        } else if (G.isMapSchema()) {
          if (Q && typeof Q === "object") {
            let Z = G.getKeySchema(),
              I = G.getValueSchema(),
              Y = G.getMergedTraits().xmlFlattened,
              J = 1;
            for (let [W, X] of Object.entries(Q)) {
              if (X == null) continue;
              let V = this.getKey("key", Z.getMergedTraits().xmlName),
                F = Y ? `${B}${J}.${V}` : `${B}entry.${J}.${V}`,
                K = this.getKey("value", I.getMergedTraits().xmlName),
                D = Y ? `${B}${J}.${K}` : `${B}entry.${J}.${K}`;
              this.write(Z, W, F), this.write(I, X, D), ++J
            }
          }
        } else if (G.isStructSchema()) {
          if (Q && typeof Q === "object")
            for (let [Z, I] of G.structIterator()) {
              if (Q[Z] == null) continue;
              let Y = this.getKey(Z, I.getMergedTraits().xmlName),
                J = `${B}${Y}`;
              this.write(I, Q[Z], J)
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
        this.buffer += `&${(0,lT1.extendedEncodeURIComponent)(A)}=`
      }
      writeValue(A) {
        this.buffer += (0, lT1.extendedEncodeURIComponent)(A)
      }
    },
    gjQ = class extends pT1.RpcProtocol {
      constructor(A) {
        super({
          defaultNamespace: A.defaultNamespace
        });
        this.options = A;
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: id.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !1,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace,
          serializeEmptyLists: !0
        };
        this.serializer = new DI8(Q), this.deserializer = new oT1(Q)
      }
      static {
        W3(this, "AwsQueryProtocol")
      }
      serializer;
      deserializer;
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
          }), (0, id.deref)(A.input) === "unit" || !G.body) G.body = "";
        if (G.body = `Action=${A.name.split("#")[1]}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
        try {
          G.headers["content-length"] = String((0, II8.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = id.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let X = await (0, pT1.collectBody)(B.body, Q);
          if (X.byteLength > 0) Object.assign(I, await G.read(id.SCHEMA.DOCUMENT, X));
          await this.handleError(A, Q, B, I, this.deserializeMetadata(B))
        }
        for (let X in B.headers) {
          let V = B.headers[X];
          delete B.headers[X], B.headers[X.toLowerCase()] = V
        }
        let Y = Z.isStructSchema() && this.useNestedResult() ? A.name.split("#")[1] + "Result" : void 0,
          J = await (0, pT1.collectBody)(B.body, Q);
        if (J.byteLength > 0) Object.assign(I, await G.read(Z, J, Y));
        return {
          $metadata: this.deserializeMetadata(B),
          ...I
        }
      }
      useNestedResult() {
        return !0
      }
      async handleError(A, Q, B, G, Z) {
        let I = this.loadQueryErrorCode(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = this.loadQueryError(G),
          X = id.TypeRegistry.for(Y),
          V;
        try {
          if (V = X.find((C) => id.NormalizedSchema.of(C).getMergedTraits().awsQueryError?.[0] === J), !V) V = X.getSchema(I)
        } catch (C) {
          let E = id.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (E) {
            let U = E.ctor;
            throw Object.assign(new U(J), W)
          }
          throw Error(J)
        }
        let F = id.NormalizedSchema.of(V),
          K = this.loadQueryErrorMessage(G),
          D = new V.ctor(K),
          H = {};
        for (let [C, E] of F.structIterator()) {
          let U = E.getMergedTraits().xmlName ?? C,
            q = W[U] ?? G[U];
          H[C] = this.deserializer.readSchema(E, q)
        }
        throw Object.assign(D, {
          $metadata: Z,
          $response: B,
          $fault: F.getMergedTraits().error,
          message: K,
          ...H
        }), D
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
    },
    HI8 = class extends gjQ {
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
      static {
        W3(this, "AwsEc2QueryProtocol")
      }
      useNestedResult() {
        return !1
      }
    },
    iT1 = w5(),
    qCA = b4(),
    CI8 = oK(),
    EI8 = o6(),
    zI8 = wS(),
    ujQ = W3((A, Q) => bjQ(A, Q).then((B) => {
      if (B.length) {
        let G = new zI8.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: !0,
          ignoreAttributes: !1,
          ignoreDeclaration: !0,
          parseTagValue: !1,
          trimValues: !1,
          tagValueProcessor: W3((W, X) => X.trim() === "" && X.includes(`
`) ? "" : void 0, "tagValueProcessor")
        });
        G.addEntity("#xD", "\r"), G.addEntity("#10", `
`);
        let Z;
        try {
          Z = G.parse(B, !0)
        } catch (W) {
          if (W && typeof W === "object") Object.defineProperty(W, "$responseBodyText", {
            value: B
          });
          throw W
        }
        let I = "#text",
          Y = Object.keys(Z)[0],
          J = Z[Y];
        if (J[I]) J[Y] = J[I], delete J[I];
        return (0, EI8.getValueFromTextNode)(J)
      }
      return {}
    }), "parseXmlBody"),
    UI8 = W3(async (A, Q) => {
      let B = await ujQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, "parseXmlErrorBody"),
    mjQ = W3((A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadRestXmlErrorCode"),
    dS = rDA(),
    zo = b4(),
    $I8 = s6(),
    kjQ = o6(),
    yjQ = ld(),
    djQ = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "XmlShapeSerializer")
      }
      stringBuffer;
      byteBuffer;
      buffer;
      write(A, Q) {
        let B = zo.NormalizedSchema.of(A);
        if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
        else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? yjQ.fromBase64)(Q);
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
        let I = dS.XmlNode.of(Z),
          [Y, J] = this.getXmlnsAttribute(A, B);
        if (J) I.addAttribute(Y, J);
        for (let [W, X] of A.structIterator()) {
          let V = Q[W];
          if (V != null) {
            if (X.getMergedTraits().xmlAttribute) {
              I.addAttribute(X.getMergedTraits().xmlName ?? W, this.writeSimple(X, V));
              continue
            }
            if (X.isListSchema()) this.writeList(X, V, I, J);
            else if (X.isMapSchema()) this.writeMap(X, V, I, J);
            else if (X.isStructSchema()) I.addChildNode(this.writeStruct(X, V, J));
            else {
              let F = dS.XmlNode.of(X.getMergedTraits().xmlName ?? X.getMemberName());
              this.writeSimpleInto(X, V, F, J), I.addChildNode(F)
            }
          }
        }
        return I
      }
      writeList(A, Q, B, G) {
        if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${A.getName(!0)}`);
        let Z = A.getMergedTraits(),
          I = A.getValueSchema(),
          Y = I.getMergedTraits(),
          J = !!Y.sparse,
          W = !!Z.xmlFlattened,
          [X, V] = this.getXmlnsAttribute(A, G),
          F = W3((K, D) => {
            if (I.isListSchema()) this.writeList(I, Array.isArray(D) ? D : [D], K, V);
            else if (I.isMapSchema()) this.writeMap(I, D, K, V);
            else if (I.isStructSchema()) {
              let H = this.writeStruct(I, D, V);
              K.addChildNode(H.withName(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member"))
            } else {
              let H = dS.XmlNode.of(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member");
              this.writeSimpleInto(I, D, H, V), K.addChildNode(H)
            }
          }, "writeItem");
        if (W) {
          for (let K of Q)
            if (J || K != null) F(B, K)
        } else {
          let K = dS.XmlNode.of(Z.xmlName ?? A.getMemberName());
          if (V) K.addAttribute(X, V);
          for (let D of Q)
            if (J || D != null) F(K, D);
          B.addChildNode(K)
        }
      }
      writeMap(A, Q, B, G, Z = !1) {
        if (!A.isMemberSchema()) throw Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${A.getName(!0)}`);
        let I = A.getMergedTraits(),
          Y = A.getKeySchema(),
          W = Y.getMergedTraits().xmlName ?? "key",
          X = A.getValueSchema(),
          V = X.getMergedTraits(),
          F = V.xmlName ?? "value",
          K = !!V.sparse,
          D = !!I.xmlFlattened,
          [H, C] = this.getXmlnsAttribute(A, G),
          E = W3((U, q, w) => {
            let N = dS.XmlNode.of(W, q),
              [R, T] = this.getXmlnsAttribute(Y, C);
            if (T) N.addAttribute(R, T);
            U.addChildNode(N);
            let y = dS.XmlNode.of(F);
            if (X.isListSchema()) this.writeList(X, w, y, C);
            else if (X.isMapSchema()) this.writeMap(X, w, y, C, !0);
            else if (X.isStructSchema()) y = this.writeStruct(X, w, C);
            else this.writeSimpleInto(X, w, y, C);
            U.addChildNode(y)
          }, "addKeyValue");
        if (D) {
          for (let [U, q] of Object.entries(Q))
            if (K || q != null) {
              let w = dS.XmlNode.of(I.xmlName ?? A.getMemberName());
              E(w, U, q), B.addChildNode(w)
            }
        } else {
          let U;
          if (!Z) {
            if (U = dS.XmlNode.of(I.xmlName ?? A.getMemberName()), C) U.addAttribute(H, C);
            B.addChildNode(U)
          }
          for (let [q, w] of Object.entries(Q))
            if (K || w != null) {
              let N = dS.XmlNode.of("entry");
              E(N, q, w), (Z ? B : U).addChildNode(N)
            }
        }
      }
      writeSimple(A, Q) {
        if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
        let B = zo.NormalizedSchema.of(A),
          G = null;
        if (Q && typeof Q === "object")
          if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? yjQ.toBase64)(Q);
          else if (B.isTimestampSchema() && Q instanceof Date) {
          let Z = this.settings.timestampFormat;
          switch (Z.useTrait ? B.getSchema() === zo.SCHEMA.TIMESTAMP_DEFAULT ? Z.default : B.getSchema() ?? Z.default : Z.default) {
            case zo.SCHEMA.TIMESTAMP_DATE_TIME:
              G = Q.toISOString().replace(".000Z", "Z");
              break;
            case zo.SCHEMA.TIMESTAMP_HTTP_DATE:
              G = (0, kjQ.dateToUtcString)(Q);
              break;
            case zo.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              G = String(Q.getTime() / 1000);
              break;
            default:
              console.warn("Missing timestamp format, using http date", Q), G = (0, kjQ.dateToUtcString)(Q);
              break
          }
        } else if (B.isBigDecimalSchema() && Q) {
          if (Q instanceof $I8.NumericValue) return Q.string;
          return String(Q)
        } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
        else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
        if (B.isStringSchema() || B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
        if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
        return G
      }
      writeSimpleInto(A, Q, B, G) {
        let Z = this.writeSimple(A, Q),
          I = zo.NormalizedSchema.of(A),
          Y = new dS.XmlText(Z),
          [J, W] = this.getXmlnsAttribute(I, G);
        if (W) B.addAttribute(J, W);
        B.addChildNode(Y)
      }
      getXmlnsAttribute(A, Q) {
        let B = A.getMergedTraits(),
          [G, Z] = B.xmlNamespace ?? [];
        if (Z && Z !== Q) return [G ? `xmlns:${G}` : "xmlns", Z];
        return [void 0, void 0]
      }
    },
    cjQ = class extends Uo {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        W3(this, "XmlCodec")
      }
      createSerializer() {
        let A = new djQ(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new oT1(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    wI8 = class extends iT1.HttpBindingProtocol {
      static {
        W3(this, "AwsRestXmlProtocol")
      }
      codec;
      serializer;
      deserializer;
      constructor(A) {
        super(A);
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: qCA.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !0,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace
        };
        this.codec = new cjQ(Q), this.serializer = new iT1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new iT1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
      }
      getPayloadCodec() {
        return this.codec
      }
      getShapeId() {
        return "aws.protocols#restXml"
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B),
          Z = qCA.NormalizedSchema.of(A.input),
          I = Z.getMemberSchemas();
        if (G.path = String(G.path).split("/").filter((Y) => {
            return Y !== "{Bucket}"
          }).join("/") || "/", !G.headers["content-type"]) {
          let Y = Object.values(I).find((J) => {
            return !!J.getMergedTraits().httpPayload
          });
          if (Y) {
            let J = Y.getMergedTraits().mediaType;
            if (J) G.headers["content-type"] = J;
            else if (Y.isStringSchema()) G.headers["content-type"] = "text/plain";
            else if (Y.isBlobSchema()) G.headers["content-type"] = "application/octet-stream";
            else G.headers["content-type"] = "application/xml"
          } else if (!Z.isUnitSchema()) {
            if (Object.values(I).find((W) => {
                let {
                  httpQuery: X,
                  httpQueryParams: V,
                  httpHeader: F,
                  httpLabel: K,
                  httpPrefixHeaders: D
                } = W.getMergedTraits();
                return !X && !V && !F && !K && D === void 0
              })) G.headers["content-type"] = "application/xml"
          }
        }
        if (G.headers["content-type"] === "application/xml") {
          if (typeof G.body === "string") G.body = '<?xml version="1.0" encoding="UTF-8"?>' + G.body
        }
        if (G.body) try {
          G.headers["content-length"] = String((0, CI8.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        return super.deserializeResponse(A, Q, B)
      }
      async handleError(A, Q, B, G, Z) {
        let I = mjQ(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = qCA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = qCA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = qCA.NormalizedSchema.of(X),
          F = G.Error?.message ?? G.Error?.Message ?? G.message ?? G.Message ?? "Unknown",
          K = new X.ctor(F);
        await this.deserializeHttpMessage(X, Q, B, G);
        let D = {};
        for (let [H, C] of V.structIterator()) {
          let E = C.getMergedTraits().xmlName ?? H,
            U = G.Error?.[E] ?? G[E];
          D[H] = this.codec.createDeserializer().readSchema(C, U)
        }
        throw Object.assign(K, {
          $metadata: Z,
          $response: B,
          $fault: V.getMergedTraits().error,
          message: F,
          ...D
        }), K
      }
    }
})
// @from(Start 3735734, End 3735931)
PF = z((NCA) => {
  Object.defineProperty(NCA, "__esModule", {
    value: !0
  });
  var tT1 = Co();
  tT1.__exportStar(aR(), NCA);
  tT1.__exportStar(yT1(), NCA);
  tT1.__exportStar(ljQ(), NCA)
})
// @from(Start 3735937, End 3741591)
y6A = z((cM7, GSQ) => {
  var {
    defineProperty: UdA,
    getOwnPropertyDescriptor: qI8,
    getOwnPropertyNames: NI8
  } = Object, LI8 = Object.prototype.hasOwnProperty, Wb = (A, Q) => UdA(A, "name", {
    value: Q,
    configurable: !0
  }), MI8 = (A, Q) => {
    for (var B in Q) UdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, OI8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NI8(Q))
        if (!LI8.call(A, Z) && Z !== B) UdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qI8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, RI8 = (A) => OI8(UdA({}, "__esModule", {
    value: !0
  }), A), sjQ = {};
  MI8(sjQ, {
    DEFAULT_UA_APP_ID: () => rjQ,
    getUserAgentMiddlewareOptions: () => BSQ,
    getUserAgentPlugin: () => xI8,
    resolveUserAgentConfig: () => tjQ,
    userAgentMiddleware: () => QSQ
  });
  GSQ.exports = RI8(sjQ);
  var TI8 = iB(),
    rjQ = void 0;

  function ojQ(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }
  Wb(ojQ, "isValidUserAgentAppId");

  function tjQ(A) {
    let Q = (0, TI8.normalizeProvider)(A.userAgentAppId ?? rjQ),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: Wb(async () => {
        let G = await Q();
        if (!ojQ(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }, "userAgentAppId")
    })
  }
  Wb(tjQ, "resolveUserAgentConfig");
  var PI8 = T6A(),
    jI8 = az(),
    cS = PF(),
    SI8 = /\d{12}\.ddb/;
  async function ejQ(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")(0, cS.setFeature)(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let I = await Q.retryStrategy();
      if (typeof I.acquireInitialRetryToken === "function")
        if (I.constructor?.name?.includes("Adaptive"))(0, cS.setFeature)(A, "RETRY_MODE_ADAPTIVE", "F");
        else(0, cS.setFeature)(A, "RETRY_MODE_STANDARD", "E");
      else(0, cS.setFeature)(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let I = A.endpointV2;
      if (String(I?.url?.hostname).match(SI8))(0, cS.setFeature)(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          (0, cS.setFeature)(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          (0, cS.setFeature)(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          (0, cS.setFeature)(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let I = Z;
      if (I.accountId)(0, cS.setFeature)(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [Y, J] of Object.entries(I.$source ?? {}))(0, cS.setFeature)(A, Y, J)
    }
  }
  Wb(ejQ, "checkFeatures");
  var ijQ = "user-agent",
    eT1 = "x-amz-user-agent",
    njQ = " ",
    AP1 = "/",
    _I8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g,
    kI8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g,
    ajQ = "-",
    yI8 = 1024;

  function ASQ(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= yI8) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  Wb(ASQ, "encodeFeatures");
  var QSQ = Wb((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!jI8.HttpRequest.isInstance(Z)) return Q(G);
      let {
        headers: I
      } = Z, Y = B?.userAgent?.map(zdA) || [], J = (await A.defaultUserAgentProvider()).map(zdA);
      await ejQ(B, A, G);
      let W = B;
      J.push(`m/${ASQ(Object.assign({},B.__smithy_context?.features,W.__aws_sdk_context?.features))}`);
      let X = A?.customUserAgent?.map(zdA) || [],
        V = await A.userAgentAppId();
      if (V) J.push(zdA([`app/${V}`]));
      let F = (0, PI8.getUserAgentPrefix)(),
        K = (F ? [F] : []).concat([...J, ...Y, ...X]).join(njQ),
        D = [...J.filter((H) => H.startsWith("aws-sdk-")), ...X].join(njQ);
      if (A.runtime !== "browser") {
        if (D) I[eT1] = I[eT1] ? `${I[ijQ]} ${D}` : D;
        I[ijQ] = K
      } else I[eT1] = K;
      return Q({
        ...G,
        request: Z
      })
    }, "userAgentMiddleware"),
    zdA = Wb((A) => {
      let Q = A[0].split(AP1).map((Y) => Y.replace(_I8, ajQ)).join(AP1),
        B = A[1]?.replace(kI8, ajQ),
        G = Q.indexOf(AP1),
        Z = Q.substring(0, G),
        I = Q.substring(G + 1);
      if (Z === "api") I = I.toLowerCase();
      return [Z, I, B].filter((Y) => Y && Y.length > 0).reduce((Y, J, W) => {
        switch (W) {
          case 0:
            return J;
          case 1:
            return `${Y}/${J}`;
          default:
            return `${Y}#${J}`
        }
      }, "")
    }, "escapeUserAgent"),
    BSQ = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: !0
    },
    xI8 = Wb((A) => ({
      applyToStack: Wb((Q) => {
        Q.add(QSQ(A), BSQ)
      }, "applyToStack")
    }), "getUserAgentPlugin")
})
// @from(Start 3741597, End 3743444)
GP1 = z((ZSQ) => {
  Object.defineProperty(ZSQ, "__esModule", {
    value: !0
  });
  ZSQ.resolveHttpAuthSchemeConfig = ZSQ.defaultBedrockHttpAuthSchemeProvider = ZSQ.defaultBedrockHttpAuthSchemeParametersProvider = void 0;
  var vI8 = PF(),
    QP1 = iB(),
    BP1 = w7(),
    bI8 = async (A, Q, B) => {
      return {
        operation: (0, BP1.getSmithyContext)(Q).operation,
        region: await (0, BP1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  ZSQ.defaultBedrockHttpAuthSchemeParametersProvider = bI8;

  function fI8(A) {
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

  function hI8(A) {
    return {
      schemeId: "smithy.api#httpBearerAuth",
      propertiesExtractor: ({
        profile: Q,
        filepath: B,
        configFilepath: G,
        ignoreCache: Z
      }, I) => ({
        identityProperties: {
          profile: Q,
          filepath: B,
          configFilepath: G,
          ignoreCache: Z
        }
      })
    }
  }
  var gI8 = (A) => {
    let Q = [];
    switch (A.operation) {
      default:
        Q.push(fI8(A)), Q.push(hI8(A))
    }
    return Q
  };
  ZSQ.defaultBedrockHttpAuthSchemeProvider = gI8;
  var uI8 = (A) => {
    let Q = (0, QP1.memoizeIdentityProvider)(A.token, QP1.isIdentityExpired, QP1.doesIdentityRequireRefresh),
      B = (0, vI8.resolveAwsSdkSigV4Config)(A);
    return Object.assign(B, {
      authSchemePreference: (0, BP1.normalizeProvider)(A.authSchemePreference ?? []),
      token: Q
    })
  };
  ZSQ.resolveHttpAuthSchemeConfig = uI8
})
// @from(Start 3743450, End 3747214)
YSQ = z((lM7, cI8) => {
  cI8.exports = {
    name: "@aws-sdk/client-bedrock",
    description: "AWS SDK for JavaScript Bedrock Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-bedrock",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/credential-provider-node": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/token-providers": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
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
      typescript: "~5.8.3"
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-bedrock"
    }
  }
})
// @from(Start 3747220, End 3749293)
ZP1 = z((iM7, HSQ) => {
  var {
    defineProperty: $dA,
    getOwnPropertyDescriptor: pI8,
    getOwnPropertyNames: lI8
  } = Object, iI8 = Object.prototype.hasOwnProperty, nI8 = (A, Q) => $dA(A, "name", {
    value: Q,
    configurable: !0
  }), aI8 = (A, Q) => {
    for (var B in Q) $dA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sI8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lI8(Q))
        if (!iI8.call(A, Z) && Z !== B) $dA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pI8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rI8 = (A) => sI8($dA({}, "__esModule", {
    value: !0
  }), A), JSQ = {};
  aI8(JSQ, {
    ENV_ACCOUNT_ID: () => DSQ,
    ENV_CREDENTIAL_SCOPE: () => KSQ,
    ENV_EXPIRATION: () => FSQ,
    ENV_KEY: () => WSQ,
    ENV_SECRET: () => XSQ,
    ENV_SESSION: () => VSQ,
    fromEnv: () => eI8
  });
  HSQ.exports = rI8(JSQ);
  var oI8 = aR(),
    tI8 = j2(),
    WSQ = "AWS_ACCESS_KEY_ID",
    XSQ = "AWS_SECRET_ACCESS_KEY",
    VSQ = "AWS_SESSION_TOKEN",
    FSQ = "AWS_CREDENTIAL_EXPIRATION",
    KSQ = "AWS_CREDENTIAL_SCOPE",
    DSQ = "AWS_ACCOUNT_ID",
    eI8 = nI8((A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[WSQ],
        B = process.env[XSQ],
        G = process.env[VSQ],
        Z = process.env[FSQ],
        I = process.env[KSQ],
        Y = process.env[DSQ];
      if (Q && B) {
        let J = {
          accessKeyId: Q,
          secretAccessKey: B,
          ...G && {
            sessionToken: G
          },
          ...Z && {
            expiration: new Date(Z)
          },
          ...I && {
            credentialScope: I
          },
          ...Y && {
            accountId: Y
          }
        };
        return (0, oI8.setCredentialFeature)(J, "CREDENTIALS_ENV_VARS", "g"), J
      }
      throw new tI8.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    }, "fromEnv")
})
// @from(Start 3749299, End 3750422)
zSQ = z((CSQ) => {
  Object.defineProperty(CSQ, "__esModule", {
    value: !0
  });
  CSQ.checkUrl = void 0;
  var AY8 = j2(),
    QY8 = "169.254.170.2",
    BY8 = "169.254.170.23",
    GY8 = "[fd00:ec2::23]",
    ZY8 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === QY8 || A.hostname === BY8 || A.hostname === GY8) return;
      if (A.hostname.includes("[")) {
        if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
      } else {
        if (A.hostname === "localhost") return;
        let B = A.hostname.split("."),
          G = (Z) => {
            let I = parseInt(Z, 10);
            return 0 <= I && I <= 255
          };
        if (B[0] === "127" && G(B[1]) && G(B[2]) && G(B[3]) && B.length === 4) return
      }
      throw new AY8.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  CSQ.checkUrl = ZY8
})
// @from(Start 3750428, End 3752169)
$SQ = z((USQ) => {
  Object.defineProperty(USQ, "__esModule", {
    value: !0
  });
  USQ.createGetRequest = WY8;
  USQ.getCredentials = XY8;
  var IP1 = j2(),
    IY8 = az(),
    YY8 = o6(),
    JY8 = Xd();

  function WY8(A) {
    return new IY8.HttpRequest({
      protocol: A.protocol,
      hostname: A.hostname,
      port: Number(A.port),
      path: A.pathname,
      query: Array.from(A.searchParams.entries()).reduce((Q, [B, G]) => {
        return Q[B] = G, Q
      }, {}),
      fragment: A.hash
    })
  }
  async function XY8(A, Q) {
    let G = await (0, JY8.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new IP1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, YY8.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (I) {}
      throw Object.assign(new IP1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new IP1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
})
// @from(Start 3752175, End 3752545)
NSQ = z((wSQ) => {
  Object.defineProperty(wSQ, "__esModule", {
    value: !0
  });
  wSQ.retryWrapper = void 0;
  var KY8 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((I) => setTimeout(I, B))
      }
      return await A()
    }
  };
  wSQ.retryWrapper = KY8
})
// @from(Start 3752551, End 3755038)
TSQ = z((OSQ) => {
  Object.defineProperty(OSQ, "__esModule", {
    value: !0
  });
  OSQ.fromHttp = void 0;
  var DY8 = Co(),
    HY8 = aR(),
    CY8 = IZ(),
    LSQ = j2(),
    EY8 = DY8.__importDefault(UA("fs/promises")),
    zY8 = zSQ(),
    MSQ = $SQ(),
    UY8 = NSQ(),
    $Y8 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    wY8 = "http://169.254.170.2",
    qY8 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    NY8 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    LY8 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    MY8 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[$Y8],
        G = A.awsContainerCredentialsFullUri ?? process.env[qY8],
        Z = A.awsContainerAuthorizationToken ?? process.env[LY8],
        I = A.awsContainerAuthorizationTokenFile ?? process.env[NY8],
        Y = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console.warn : A.logger.warn;
      if (B && G) Y("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), Y("awsContainerCredentialsFullUri will take precedence.");
      if (Z && I) Y("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), Y("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${wY8}${B}`;
      else throw new LSQ.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let J = new URL(Q);
      (0, zY8.checkUrl)(J, A.logger);
      let W = new CY8.NodeHttpHandler({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, UY8.retryWrapper)(async () => {
        let X = (0, MSQ.createGetRequest)(J);
        if (Z) X.headers.Authorization = Z;
        else if (I) X.headers.Authorization = (await EY8.default.readFile(I)).toString();
        try {
          let V = await W.handle(X);
          return (0, MSQ.getCredentials)(V.response).then((F) => (0, HY8.setCredentialFeature)(F, "CREDENTIALS_HTTP", "z"))
        } catch (V) {
          throw new LSQ.CredentialsProviderError(String(V), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  OSQ.fromHttp = MY8
})
// @from(Start 3755044, End 3755296)
JP1 = z((YP1) => {
  Object.defineProperty(YP1, "__esModule", {
    value: !0
  });
  YP1.fromHttp = void 0;
  var OY8 = TSQ();
  Object.defineProperty(YP1, "fromHttp", {
    enumerable: !0,
    get: function() {
      return OY8.fromHttp
    }
  })
})
// @from(Start 3755302, End 3756990)
XP1 = z((PSQ) => {
  Object.defineProperty(PSQ, "__esModule", {
    value: !0
  });
  PSQ.resolveHttpAuthSchemeConfig = PSQ.defaultSSOHttpAuthSchemeProvider = PSQ.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var TY8 = PF(),
    WP1 = w7(),
    PY8 = async (A, Q, B) => {
      return {
        operation: (0, WP1.getSmithyContext)(Q).operation,
        region: await (0, WP1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  PSQ.defaultSSOHttpAuthSchemeParametersProvider = PY8;

  function jY8(A) {
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

  function wdA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var SY8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(wdA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(wdA(A));
        break
      }
      case "ListAccounts": {
        Q.push(wdA(A));
        break
      }
      case "Logout": {
        Q.push(wdA(A));
        break
      }
      default:
        Q.push(jY8(A))
    }
    return Q
  };
  PSQ.defaultSSOHttpAuthSchemeProvider = SY8;
  var _Y8 = (A) => {
    let Q = (0, TY8.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, WP1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  PSQ.resolveHttpAuthSchemeConfig = _Y8
})
// @from(Start 3756996, End 3760584)
SSQ = z((eM7, xY8) => {
  xY8.exports = {
    name: "@aws-sdk/client-sso",
    description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sso",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
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
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sso"
    }
  }
})
// @from(Start 3760590, End 3762766)
LCA = z((AO7, fSQ) => {
  var {
    defineProperty: NdA,
    getOwnPropertyDescriptor: vY8,
    getOwnPropertyNames: bY8
  } = Object, fY8 = Object.prototype.hasOwnProperty, qdA = (A, Q) => NdA(A, "name", {
    value: Q,
    configurable: !0
  }), hY8 = (A, Q) => {
    for (var B in Q) NdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, gY8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bY8(Q))
        if (!fY8.call(A, Z) && Z !== B) NdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vY8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, uY8 = (A) => gY8(NdA({}, "__esModule", {
    value: !0
  }), A), kSQ = {};
  hY8(kSQ, {
    NODE_APP_ID_CONFIG_OPTIONS: () => lY8,
    UA_APP_ID_ENV_NAME: () => vSQ,
    UA_APP_ID_INI_NAME: () => bSQ,
    createDefaultUserAgentProvider: () => xSQ,
    crtAvailability: () => ySQ,
    defaultUserAgent: () => dY8
  });
  fSQ.exports = uY8(kSQ);
  var _SQ = UA("os"),
    VP1 = UA("process"),
    ySQ = {
      isCrtAvailable: !1
    },
    mY8 = qdA(() => {
      if (ySQ.isCrtAvailable) return ["md/crt-avail"];
      return null
    }, "isCrtAvailable"),
    xSQ = qdA(({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${(0,_SQ.platform)()}`, (0, _SQ.release)()],
            ["lang/js"],
            ["md/nodejs", `${VP1.versions.node}`]
          ],
          Z = mY8();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (VP1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${VP1.env.AWS_EXECUTION_ENV}`]);
        let I = await B?.userAgentAppId?.();
        return I ? [...G, [`app/${I}`]] : [...G]
      }
    }, "createDefaultUserAgentProvider"),
    dY8 = xSQ,
    cY8 = y6A(),
    vSQ = "AWS_SDK_UA_APP_ID",
    bSQ = "sdk_ua_app_id",
    pY8 = "sdk-ua-app-id",
    lY8 = {
      environmentVariableSelector: qdA((A) => A[vSQ], "environmentVariableSelector"),
      configFileSelector: qdA((A) => A[bSQ] ?? A[pY8], "configFileSelector"),
      default: cY8.DEFAULT_UA_APP_ID
    }
})
// @from(Start 3762772, End 3767469)
A_Q = z((tSQ) => {
  Object.defineProperty(tSQ, "__esModule", {
    value: !0
  });
  tSQ.ruleSet = void 0;
  var aSQ = "required",
    kL = "fn",
    yL = "argv",
    b6A = "ref",
    hSQ = !0,
    gSQ = "isSet",
    MCA = "booleanEquals",
    x6A = "error",
    v6A = "endpoint",
    Xb = "tree",
    FP1 = "PartitionResult",
    KP1 = "getAttr",
    uSQ = {
      [aSQ]: !1,
      type: "String"
    },
    mSQ = {
      [aSQ]: !0,
      default: !1,
      type: "Boolean"
    },
    dSQ = {
      [b6A]: "Endpoint"
    },
    sSQ = {
      [kL]: MCA,
      [yL]: [{
        [b6A]: "UseFIPS"
      }, !0]
    },
    rSQ = {
      [kL]: MCA,
      [yL]: [{
        [b6A]: "UseDualStack"
      }, !0]
    },
    _L = {},
    cSQ = {
      [kL]: KP1,
      [yL]: [{
        [b6A]: FP1
      }, "supportsFIPS"]
    },
    oSQ = {
      [b6A]: FP1
    },
    pSQ = {
      [kL]: MCA,
      [yL]: [!0, {
        [kL]: KP1,
        [yL]: [oSQ, "supportsDualStack"]
      }]
    },
    lSQ = [sSQ],
    iSQ = [rSQ],
    nSQ = [{
      [b6A]: "Region"
    }],
    iY8 = {
      version: "1.0",
      parameters: {
        Region: uSQ,
        UseDualStack: mSQ,
        UseFIPS: mSQ,
        Endpoint: uSQ
      },
      rules: [{
        conditions: [{
          [kL]: gSQ,
          [yL]: [dSQ]
        }],
        rules: [{
          conditions: lSQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: x6A
        }, {
          conditions: iSQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: x6A
        }, {
          endpoint: {
            url: dSQ,
            properties: _L,
            headers: _L
          },
          type: v6A
        }],
        type: Xb
      }, {
        conditions: [{
          [kL]: gSQ,
          [yL]: nSQ
        }],
        rules: [{
          conditions: [{
            [kL]: "aws.partition",
            [yL]: nSQ,
            assign: FP1
          }],
          rules: [{
            conditions: [sSQ, rSQ],
            rules: [{
              conditions: [{
                [kL]: MCA,
                [yL]: [hSQ, cSQ]
              }, pSQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: _L,
                  headers: _L
                },
                type: v6A
              }],
              type: Xb
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: x6A
            }],
            type: Xb
          }, {
            conditions: lSQ,
            rules: [{
              conditions: [{
                [kL]: MCA,
                [yL]: [cSQ, hSQ]
              }],
              rules: [{
                conditions: [{
                  [kL]: "stringEquals",
                  [yL]: [{
                    [kL]: KP1,
                    [yL]: [oSQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: _L,
                  headers: _L
                },
                type: v6A
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: _L,
                  headers: _L
                },
                type: v6A
              }],
              type: Xb
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: x6A
            }],
            type: Xb
          }, {
            conditions: iSQ,
            rules: [{
              conditions: [pSQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: _L,
                  headers: _L
                },
                type: v6A
              }],
              type: Xb
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: x6A
            }],
            type: Xb
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: _L,
              headers: _L
            },
            type: v6A
          }],
          type: Xb
        }],
        type: Xb
      }, {
        error: "Invalid Configuration: Missing Region",
        type: x6A
      }]
    };
  tSQ.ruleSet = iY8
})
// @from(Start 3767475, End 3768039)
G_Q = z((Q_Q) => {
  Object.defineProperty(Q_Q, "__esModule", {
    value: !0
  });
  Q_Q.defaultEndpointResolver = void 0;
  var nY8 = T6A(),
    DP1 = FI(),
    aY8 = A_Q(),
    sY8 = new DP1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    rY8 = (A, Q = {}) => {
      return sY8.get(A, () => (0, DP1.resolveEndpoint)(aY8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  Q_Q.defaultEndpointResolver = rY8;
  DP1.customEndpointFunctions.aws = nY8.awsEndpointFunctions
})
// @from(Start 3768045, End 3769454)
W_Q = z((Y_Q) => {
  Object.defineProperty(Y_Q, "__esModule", {
    value: !0
  });
  Y_Q.getRuntimeConfig = void 0;
  var oY8 = PF(),
    tY8 = iB(),
    eY8 = o6(),
    AJ8 = NJ(),
    Z_Q = ld(),
    I_Q = O2(),
    QJ8 = XP1(),
    BJ8 = G_Q(),
    GJ8 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? Z_Q.fromBase64,
        base64Encoder: A?.base64Encoder ?? Z_Q.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? BJ8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? QJ8.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new oY8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new tY8.NoAuthSigner
        }],
        logger: A?.logger ?? new eY8.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? AJ8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? I_Q.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? I_Q.toUtf8
      }
    };
  Y_Q.getRuntimeConfig = GJ8
})
// @from(Start 3769460, End 3771759)
C_Q = z((D_Q) => {
  Object.defineProperty(D_Q, "__esModule", {
    value: !0
  });
  D_Q.getRuntimeConfig = void 0;
  var ZJ8 = Co(),
    IJ8 = ZJ8.__importDefault(SSQ()),
    X_Q = PF(),
    V_Q = LCA(),
    LdA = f8(),
    YJ8 = RX(),
    F_Q = D6(),
    $o = uI(),
    K_Q = IZ(),
    JJ8 = TX(),
    WJ8 = KW(),
    XJ8 = W_Q(),
    VJ8 = o6(),
    FJ8 = PX(),
    KJ8 = o6(),
    DJ8 = (A) => {
      (0, KJ8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, FJ8.resolveDefaultsModeConfig)(A),
        B = () => Q().then(VJ8.loadConfigsForDefaultMode),
        G = (0, XJ8.getRuntimeConfig)(A);
      (0, X_Q.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, $o.loadConfig)(X_Q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? JJ8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, V_Q.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: IJ8.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, $o.loadConfig)(F_Q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, $o.loadConfig)(LdA.NODE_REGION_CONFIG_OPTIONS, {
          ...LdA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: K_Q.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, $o.loadConfig)({
          ...F_Q.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || WJ8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? YJ8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? K_Q.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, $o.loadConfig)(LdA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, $o.loadConfig)(LdA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, $o.loadConfig)(V_Q.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  D_Q.getRuntimeConfig = DJ8
})
// @from(Start 3771765, End 3774368)
OCA = z((IO7, q_Q) => {
  var {
    defineProperty: MdA,
    getOwnPropertyDescriptor: HJ8,
    getOwnPropertyNames: CJ8
  } = Object, EJ8 = Object.prototype.hasOwnProperty, pS = (A, Q) => MdA(A, "name", {
    value: Q,
    configurable: !0
  }), zJ8 = (A, Q) => {
    for (var B in Q) MdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, UJ8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of CJ8(Q))
        if (!EJ8.call(A, Z) && Z !== B) MdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = HJ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, $J8 = (A) => UJ8(MdA({}, "__esModule", {
    value: !0
  }), A), z_Q = {};
  zJ8(z_Q, {
    NODE_REGION_CONFIG_FILE_OPTIONS: () => LJ8,
    NODE_REGION_CONFIG_OPTIONS: () => NJ8,
    REGION_ENV_NAME: () => U_Q,
    REGION_INI_NAME: () => $_Q,
    getAwsRegionExtensionConfiguration: () => wJ8,
    resolveAwsRegionExtensionConfiguration: () => qJ8,
    resolveRegionConfig: () => MJ8
  });
  q_Q.exports = $J8(z_Q);
  var wJ8 = pS((A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    }, "getAwsRegionExtensionConfiguration"),
    qJ8 = pS((A) => {
      return {
        region: A.region()
      }
    }, "resolveAwsRegionExtensionConfiguration"),
    U_Q = "AWS_REGION",
    $_Q = "region",
    NJ8 = {
      environmentVariableSelector: pS((A) => A[U_Q], "environmentVariableSelector"),
      configFileSelector: pS((A) => A[$_Q], "configFileSelector"),
      default: pS(() => {
        throw Error("Region is missing")
      }, "default")
    },
    LJ8 = {
      preferredFile: "credentials"
    },
    w_Q = pS((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    E_Q = pS((A) => w_Q(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    MJ8 = pS((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: pS(async () => {
          if (typeof Q === "string") return E_Q(Q);
          let G = await Q();
          return E_Q(G)
        }, "region"),
        useFipsEndpoint: pS(async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (w_Q(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }, "useFipsEndpoint")
      })
    }, "resolveRegionConfig")
})