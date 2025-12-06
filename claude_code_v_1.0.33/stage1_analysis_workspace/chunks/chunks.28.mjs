
// @from(Start 2551768, End 2596959)
H9Q = z((zE7, D9Q) => {
  var {
    defineProperty: $hA,
    getOwnPropertyDescriptor: cN4,
    getOwnPropertyNames: pN4
  } = Object, lN4 = Object.prototype.hasOwnProperty, Z3 = (A, Q) => $hA(A, "name", {
    value: Q,
    configurable: !0
  }), iN4 = (A, Q) => {
    for (var B in Q) $hA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nN4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of pN4(Q))
        if (!lN4.call(A, Z) && Z !== B) $hA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = cN4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, aN4 = (A) => nN4($hA({}, "__esModule", {
    value: !0
  }), A), G9Q = {};
  iN4(G9Q, {
    AwsEc2QueryProtocol: () => LL4,
    AwsJson1_0Protocol: () => WL4,
    AwsJson1_1Protocol: () => XL4,
    AwsJsonRpcProtocol: () => m$1,
    AwsQueryProtocol: () => W9Q,
    AwsRestJsonProtocol: () => FL4,
    AwsRestXmlProtocol: () => jL4,
    JsonCodec: () => u$1,
    JsonShapeDeserializer: () => Y9Q,
    JsonShapeSerializer: () => J9Q,
    XmlCodec: () => K9Q,
    XmlShapeDeserializer: () => d$1,
    XmlShapeSerializer: () => F9Q,
    _toBool: () => rN4,
    _toNum: () => oN4,
    _toStr: () => sN4,
    awsExpectUnion: () => DL4,
    loadRestJsonErrorCode: () => g$1,
    loadRestXmlErrorCode: () => V9Q,
    parseJsonBody: () => h$1,
    parseJsonErrorBody: () => GL4,
    parseXmlBody: () => X9Q,
    parseXmlErrorBody: () => TL4
  });
  D9Q.exports = aN4(G9Q);
  var sN4 = Z3((A) => {
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
    rN4 = Z3((A) => {
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
    oN4 = Z3((A) => {
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
    tN4 = w5(),
    n4A = b4(),
    eN4 = oK(),
    gr = class {
      static {
        Z3(this, "SerdeContextConfig")
      }
      serdeContext;
      setSerdeContext(A) {
        this.serdeContext = A
      }
    },
    oDA = b4(),
    a4A = s6(),
    AL4 = Fd(),
    QL4 = s6();

  function Z9Q(A, Q, B) {
    if (B?.source) {
      let G = B.source;
      if (typeof Q === "number") {
        if (Q > Number.MAX_SAFE_INTEGER || Q < Number.MIN_SAFE_INTEGER || G !== String(Q))
          if (G.includes(".")) return new QL4.NumericValue(G, "bigDecimal");
          else return BigInt(G)
      }
    }
    return Q
  }
  Z3(Z9Q, "jsonReviver");
  var BL4 = K6(),
    I9Q = Z3((A, Q) => (0, BL4.collectBody)(A, Q).then((B) => Q.utf8Encoder(B)), "collectBodyString"),
    h$1 = Z3((A, Q) => I9Q(A, Q).then((B) => {
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
    GL4 = Z3(async (A, Q) => {
      let B = await h$1(A, Q);
      return B.message = B.message ?? B.Message, B
    }, "parseJsonErrorBody"),
    g$1 = Z3((A, Q) => {
      let B = Z3((I, Y) => Object.keys(I).find((J) => J.toLowerCase() === Y.toLowerCase()), "findKey"),
        G = Z3((I) => {
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
    Y9Q = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "JsonShapeDeserializer")
      }
      async read(A, Q) {
        return this._read(A, typeof Q === "string" ? JSON.parse(Q, Z9Q) : await h$1(Q, this.serdeContext))
      }
      readObject(A, Q) {
        return this._read(A, Q)
      }
      _read(A, Q) {
        let B = Q !== null && typeof Q === "object",
          G = oDA.NormalizedSchema.of(A);
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
        if (G.isBlobSchema() && typeof Q === "string") return (0, AL4.fromBase64)(Q);
        let Z = G.getMergedTraits().mediaType;
        if (G.isStringSchema() && typeof Q === "string" && Z) {
          if (Z === "application/json" || Z.endsWith("+json")) return a4A.LazyJsonString.from(Q)
        }
        if (G.isTimestampSchema()) {
          let I = this.settings.timestampFormat;
          switch (I.useTrait ? G.getSchema() === oDA.SCHEMA.TIMESTAMP_DEFAULT ? I.default : G.getSchema() ?? I.default : I.default) {
            case oDA.SCHEMA.TIMESTAMP_DATE_TIME:
              return (0, a4A.parseRfc3339DateTimeWithOffset)(Q);
            case oDA.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, a4A.parseRfc7231DateTime)(Q);
            case oDA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              return (0, a4A.parseEpochTimestamp)(Q);
            default:
              return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
          }
        }
        if (G.isBigIntegerSchema() && (typeof Q === "number" || typeof Q === "string")) return BigInt(Q);
        if (G.isBigDecimalSchema() && Q != null) {
          if (Q instanceof a4A.NumericValue) return Q;
          return new a4A.NumericValue(String(Q), "bigDecimal")
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
    s4A = b4(),
    ZL4 = s6(),
    IL4 = s6(),
    YL4 = s6(),
    e2Q = String.fromCharCode(925),
    JL4 = class {
      static {
        Z3(this, "JsonReplacer")
      }
      values = new Map;
      counter = 0;
      stage = 0;
      createReplacer() {
        if (this.stage === 1) throw Error("@aws-sdk/core/protocols - JsonReplacer already created.");
        if (this.stage === 2) throw Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
        return this.stage = 1, (A, Q) => {
          if (Q instanceof YL4.NumericValue) {
            let B = `${e2Q+NaN+this.counter++}_` + Q.string;
            return this.values.set(`"${B}"`, Q.string), B
          }
          if (typeof Q === "bigint") {
            let B = Q.toString(),
              G = `${e2Q+"b"+this.counter++}_` + B;
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
    J9Q = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "JsonShapeSerializer")
      }
      buffer;
      rootSchema;
      write(A, Q) {
        this.rootSchema = s4A.NormalizedSchema.of(A), this.buffer = this._write(this.rootSchema, Q)
      }
      flush() {
        if (this.rootSchema?.isStructSchema() || this.rootSchema?.isDocumentSchema()) {
          let A = new JL4;
          return A.replaceInJson(JSON.stringify(this.buffer, A.createReplacer(), 0))
        }
        return this.buffer
      }
      _write(A, Q, B) {
        let G = Q !== null && typeof Q === "object",
          Z = s4A.NormalizedSchema.of(A);
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
          switch (Y.useTrait ? Z.getSchema() === s4A.SCHEMA.TIMESTAMP_DEFAULT ? Y.default : Z.getSchema() ?? Y.default : Y.default) {
            case s4A.SCHEMA.TIMESTAMP_DATE_TIME:
              return Q.toISOString().replace(".000Z", "Z");
            case s4A.SCHEMA.TIMESTAMP_HTTP_DATE:
              return (0, ZL4.dateToUtcString)(Q);
            case s4A.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
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
          if (I === "application/json" || I.endsWith("+json")) return IL4.LazyJsonString.from(Q)
        }
        return Q
      }
    },
    u$1 = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "JsonCodec")
      }
      createSerializer() {
        let A = new J9Q(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new Y9Q(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    m$1 = class extends tN4.RpcProtocol {
      static {
        Z3(this, "AwsJsonRpcProtocol")
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
        this.codec = new u$1({
          timestampFormat: {
            useTrait: !0,
            default: n4A.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          jsonName: !1
        }), this.serializer = this.codec.createSerializer(), this.deserializer = this.codec.createDeserializer()
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B);
        if (!G.path.endsWith("/")) G.path += "/";
        if (Object.assign(G.headers, {
            "content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
            "x-amz-target": (this.getJsonRpcVersion() === "1.0" ? "JsonRpc10." : "JsonProtocol.") + n4A.NormalizedSchema.of(A).getName()
          }), (0, n4A.deref)(A.input) === "unit" || !G.body) G.body = "{}";
        try {
          G.headers["content-length"] = String((0, eN4.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      getPayloadCodec() {
        return this.codec
      }
      async handleError(A, Q, B, G, Z) {
        let I = g$1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = n4A.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = n4A.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = n4A.NormalizedSchema.of(X),
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
    WL4 = class extends m$1 {
      static {
        Z3(this, "AwsJson1_0Protocol")
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
    XL4 = class extends m$1 {
      static {
        Z3(this, "AwsJson1_1Protocol")
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
    x$1 = w5(),
    tDA = b4(),
    VL4 = oK(),
    FL4 = class extends x$1.HttpBindingProtocol {
      static {
        Z3(this, "AwsRestJsonProtocol")
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
            default: tDA.SCHEMA.TIMESTAMP_EPOCH_SECONDS
          },
          httpBindings: !0,
          jsonName: !0
        };
        this.codec = new u$1(Q), this.serializer = new x$1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new x$1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
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
          Z = tDA.NormalizedSchema.of(A.input),
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
          G.headers["content-length"] = String((0, VL4.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async handleError(A, Q, B, G, Z) {
        let I = g$1(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = tDA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = tDA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = tDA.NormalizedSchema.of(X),
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
    KL4 = K6(),
    DL4 = Z3((A) => {
      if (A == null) return;
      if (typeof A === "object" && "__type" in A) delete A.__type;
      return (0, KL4.expectUnion)(A)
    }, "awsExpectUnion"),
    v$1 = w5(),
    Hd = b4(),
    HL4 = oK(),
    CL4 = w5(),
    A9Q = b4(),
    EL4 = K6(),
    zL4 = O2(),
    UL4 = wS(),
    d$1 = class extends gr {
      constructor(A) {
        super();
        this.settings = A, this.stringDeserializer = new CL4.FromStringShapeDeserializer(A)
      }
      static {
        Z3(this, "XmlShapeDeserializer")
      }
      stringDeserializer;
      setSerdeContext(A) {
        this.serdeContext = A, this.stringDeserializer.setSerdeContext(A)
      }
      read(A, Q, B) {
        let G = A9Q.NormalizedSchema.of(A),
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
        let Y = (this.serdeContext?.utf8Encoder ?? zL4.toUtf8)(Q),
          J = this.parseXml(Y);
        return this.readSchema(A, B ? J[B] : J)
      }
      readSchema(A, Q) {
        let B = A9Q.NormalizedSchema.of(A),
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
          let Q = new UL4.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: !0,
            ignoreAttributes: !1,
            ignoreDeclaration: !0,
            parseTagValue: !1,
            trimValues: !1,
            tagValueProcessor: Z3((Y, J) => J.trim() === "" && J.includes(`
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
          return (0, EL4.getValueFromTextNode)(I)
        }
        return {}
      }
    },
    b$1 = w5(),
    UhA = b4(),
    $L4 = s6(),
    wL4 = K6(),
    qL4 = Fd(),
    NL4 = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "QueryShapeSerializer")
      }
      buffer;
      write(A, Q, B = "") {
        if (this.buffer === void 0) this.buffer = "";
        let G = UhA.NormalizedSchema.of(A);
        if (B && !B.endsWith(".")) B += ".";
        if (G.isBlobSchema()) {
          if (typeof Q === "string" || Q instanceof Uint8Array) this.writeKey(B), this.writeValue((this.serdeContext?.base64Encoder ?? qL4.toBase64)(Q))
        } else if (G.isBooleanSchema() || G.isNumericSchema() || G.isStringSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigIntegerSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(String(Q))
        } else if (G.isBigDecimalSchema()) {
          if (Q != null) this.writeKey(B), this.writeValue(Q instanceof $L4.NumericValue ? Q.string : String(Q))
        } else if (G.isTimestampSchema()) {
          if (Q instanceof Date) switch (this.writeKey(B), (0, b$1.determineTimestampFormat)(G, this.settings)) {
            case UhA.SCHEMA.TIMESTAMP_DATE_TIME:
              this.writeValue(Q.toISOString().replace(".000Z", "Z"));
              break;
            case UhA.SCHEMA.TIMESTAMP_HTTP_DATE:
              this.writeValue((0, wL4.dateToUtcString)(Q));
              break;
            case UhA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
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
        this.buffer += `&${(0,b$1.extendedEncodeURIComponent)(A)}=`
      }
      writeValue(A) {
        this.buffer += (0, b$1.extendedEncodeURIComponent)(A)
      }
    },
    W9Q = class extends v$1.RpcProtocol {
      constructor(A) {
        super({
          defaultNamespace: A.defaultNamespace
        });
        this.options = A;
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: Hd.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !1,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace,
          serializeEmptyLists: !0
        };
        this.serializer = new NL4(Q), this.deserializer = new d$1(Q)
      }
      static {
        Z3(this, "AwsQueryProtocol")
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
          }), (0, Hd.deref)(A.input) === "unit" || !G.body) G.body = "";
        if (G.body = `Action=${A.name.split("#")[1]}&Version=${this.options.version}` + G.body, G.body.endsWith("&")) G.body = G.body.slice(-1);
        try {
          G.headers["content-length"] = String((0, HL4.calculateBodyLength)(G.body))
        } catch (Z) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = Hd.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let X = await (0, v$1.collectBody)(B.body, Q);
          if (X.byteLength > 0) Object.assign(I, await G.read(Hd.SCHEMA.DOCUMENT, X));
          await this.handleError(A, Q, B, I, this.deserializeMetadata(B))
        }
        for (let X in B.headers) {
          let V = B.headers[X];
          delete B.headers[X], B.headers[X.toLowerCase()] = V
        }
        let Y = Z.isStructSchema() && this.useNestedResult() ? A.name.split("#")[1] + "Result" : void 0,
          J = await (0, v$1.collectBody)(B.body, Q);
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
          X = Hd.TypeRegistry.for(Y),
          V;
        try {
          if (V = X.find((C) => Hd.NormalizedSchema.of(C).getMergedTraits().awsQueryError?.[0] === J), !V) V = X.getSchema(I)
        } catch (C) {
          let E = Hd.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (E) {
            let U = E.ctor;
            throw Object.assign(new U(J), W)
          }
          throw Error(J)
        }
        let F = Hd.NormalizedSchema.of(V),
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
    LL4 = class extends W9Q {
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
        Z3(this, "AwsEc2QueryProtocol")
      }
      useNestedResult() {
        return !1
      }
    },
    f$1 = w5(),
    eDA = b4(),
    ML4 = oK(),
    OL4 = K6(),
    RL4 = wS(),
    X9Q = Z3((A, Q) => I9Q(A, Q).then((B) => {
      if (B.length) {
        let G = new RL4.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: !0,
          ignoreAttributes: !1,
          ignoreDeclaration: !0,
          parseTagValue: !1,
          trimValues: !1,
          tagValueProcessor: Z3((W, X) => X.trim() === "" && X.includes(`
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
        return (0, OL4.getValueFromTextNode)(J)
      }
      return {}
    }), "parseXmlBody"),
    TL4 = Z3(async (A, Q) => {
      let B = await X9Q(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, "parseXmlErrorBody"),
    V9Q = Z3((A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadRestXmlErrorCode"),
    qS = rDA(),
    hr = b4(),
    PL4 = s6(),
    Q9Q = K6(),
    B9Q = Fd(),
    F9Q = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "XmlShapeSerializer")
      }
      stringBuffer;
      byteBuffer;
      buffer;
      write(A, Q) {
        let B = hr.NormalizedSchema.of(A);
        if (B.isStringSchema() && typeof Q === "string") this.stringBuffer = Q;
        else if (B.isBlobSchema()) this.byteBuffer = "byteLength" in Q ? Q : (this.serdeContext?.base64Decoder ?? B9Q.fromBase64)(Q);
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
        let I = qS.XmlNode.of(Z),
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
              let F = qS.XmlNode.of(X.getMergedTraits().xmlName ?? X.getMemberName());
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
          F = Z3((K, D) => {
            if (I.isListSchema()) this.writeList(I, Array.isArray(D) ? D : [D], K, V);
            else if (I.isMapSchema()) this.writeMap(I, D, K, V);
            else if (I.isStructSchema()) {
              let H = this.writeStruct(I, D, V);
              K.addChildNode(H.withName(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member"))
            } else {
              let H = qS.XmlNode.of(W ? Z.xmlName ?? A.getMemberName() : Y.xmlName ?? "member");
              this.writeSimpleInto(I, D, H, V), K.addChildNode(H)
            }
          }, "writeItem");
        if (W) {
          for (let K of Q)
            if (J || K != null) F(B, K)
        } else {
          let K = qS.XmlNode.of(Z.xmlName ?? A.getMemberName());
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
          E = Z3((U, q, w) => {
            let N = qS.XmlNode.of(W, q),
              [R, T] = this.getXmlnsAttribute(Y, C);
            if (T) N.addAttribute(R, T);
            U.addChildNode(N);
            let y = qS.XmlNode.of(F);
            if (X.isListSchema()) this.writeList(X, w, y, C);
            else if (X.isMapSchema()) this.writeMap(X, w, y, C, !0);
            else if (X.isStructSchema()) y = this.writeStruct(X, w, C);
            else this.writeSimpleInto(X, w, y, C);
            U.addChildNode(y)
          }, "addKeyValue");
        if (D) {
          for (let [U, q] of Object.entries(Q))
            if (K || q != null) {
              let w = qS.XmlNode.of(I.xmlName ?? A.getMemberName());
              E(w, U, q), B.addChildNode(w)
            }
        } else {
          let U;
          if (!Z) {
            if (U = qS.XmlNode.of(I.xmlName ?? A.getMemberName()), C) U.addAttribute(H, C);
            B.addChildNode(U)
          }
          for (let [q, w] of Object.entries(Q))
            if (K || w != null) {
              let N = qS.XmlNode.of("entry");
              E(N, q, w), (Z ? B : U).addChildNode(N)
            }
        }
      }
      writeSimple(A, Q) {
        if (Q === null) throw Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
        let B = hr.NormalizedSchema.of(A),
          G = null;
        if (Q && typeof Q === "object")
          if (B.isBlobSchema()) G = (this.serdeContext?.base64Encoder ?? B9Q.toBase64)(Q);
          else if (B.isTimestampSchema() && Q instanceof Date) {
          let Z = this.settings.timestampFormat;
          switch (Z.useTrait ? B.getSchema() === hr.SCHEMA.TIMESTAMP_DEFAULT ? Z.default : B.getSchema() ?? Z.default : Z.default) {
            case hr.SCHEMA.TIMESTAMP_DATE_TIME:
              G = Q.toISOString().replace(".000Z", "Z");
              break;
            case hr.SCHEMA.TIMESTAMP_HTTP_DATE:
              G = (0, Q9Q.dateToUtcString)(Q);
              break;
            case hr.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
              G = String(Q.getTime() / 1000);
              break;
            default:
              console.warn("Missing timestamp format, using http date", Q), G = (0, Q9Q.dateToUtcString)(Q);
              break
          }
        } else if (B.isBigDecimalSchema() && Q) {
          if (Q instanceof PL4.NumericValue) return Q.string;
          return String(Q)
        } else if (B.isMapSchema() || B.isListSchema()) throw Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
        else throw Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${B.getName(!0)}`);
        if (B.isStringSchema() || B.isBooleanSchema() || B.isNumericSchema() || B.isBigIntegerSchema() || B.isBigDecimalSchema()) G = String(Q);
        if (G === null) throw Error(`Unhandled schema-value pair ${B.getName(!0)}=${Q}`);
        return G
      }
      writeSimpleInto(A, Q, B, G) {
        let Z = this.writeSimple(A, Q),
          I = hr.NormalizedSchema.of(A),
          Y = new qS.XmlText(Z),
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
    K9Q = class extends gr {
      constructor(A) {
        super();
        this.settings = A
      }
      static {
        Z3(this, "XmlCodec")
      }
      createSerializer() {
        let A = new F9Q(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
      createDeserializer() {
        let A = new d$1(this.settings);
        return A.setSerdeContext(this.serdeContext), A
      }
    },
    jL4 = class extends f$1.HttpBindingProtocol {
      static {
        Z3(this, "AwsRestXmlProtocol")
      }
      codec;
      serializer;
      deserializer;
      constructor(A) {
        super(A);
        let Q = {
          timestampFormat: {
            useTrait: !0,
            default: eDA.SCHEMA.TIMESTAMP_DATE_TIME
          },
          httpBindings: !0,
          xmlNamespace: A.xmlNamespace,
          serviceNamespace: A.defaultNamespace
        };
        this.codec = new K9Q(Q), this.serializer = new f$1.HttpInterceptingShapeSerializer(this.codec.createSerializer(), Q), this.deserializer = new f$1.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), Q)
      }
      getPayloadCodec() {
        return this.codec
      }
      getShapeId() {
        return "aws.protocols#restXml"
      }
      async serializeRequest(A, Q, B) {
        let G = await super.serializeRequest(A, Q, B),
          Z = eDA.NormalizedSchema.of(A.input),
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
          G.headers["content-length"] = String((0, ML4.calculateBodyLength)(G.body))
        } catch (Y) {}
        return G
      }
      async deserializeResponse(A, Q, B) {
        return super.deserializeResponse(A, Q, B)
      }
      async handleError(A, Q, B, G, Z) {
        let I = V9Q(B, G) ?? "Unknown",
          Y = this.options.defaultNamespace,
          J = I;
        if (I.includes("#"))[Y, J] = I.split("#");
        let W = eDA.TypeRegistry.for(Y),
          X;
        try {
          X = W.getSchema(I)
        } catch (H) {
          let C = eDA.TypeRegistry.for("smithy.ts.sdk.synthetic." + Y).getBaseException();
          if (C) {
            let E = C.ctor;
            throw Object.assign(new E(J), G)
          }
          throw Error(J)
        }
        let V = eDA.NormalizedSchema.of(X),
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
// @from(Start 2596965, End 2597162)
MF = z((AHA) => {
  Object.defineProperty(AHA, "__esModule", {
    value: !0
  });
  var c$1 = yr();
  c$1.__exportStar(QL(), AHA);
  c$1.__exportStar($$1(), AHA);
  c$1.__exportStar(H9Q(), AHA)
})
// @from(Start 2597168, End 2602822)
r4A = z((vE7, R9Q) => {
  var {
    defineProperty: qhA,
    getOwnPropertyDescriptor: SL4,
    getOwnPropertyNames: _L4
  } = Object, kL4 = Object.prototype.hasOwnProperty, Lv = (A, Q) => qhA(A, "name", {
    value: Q,
    configurable: !0
  }), yL4 = (A, Q) => {
    for (var B in Q) qhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, xL4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of _L4(Q))
        if (!kL4.call(A, Z) && Z !== B) qhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = SL4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, vL4 = (A) => xL4(qhA({}, "__esModule", {
    value: !0
  }), A), U9Q = {};
  yL4(U9Q, {
    DEFAULT_UA_APP_ID: () => $9Q,
    getUserAgentMiddlewareOptions: () => O9Q,
    getUserAgentPlugin: () => cL4,
    resolveUserAgentConfig: () => q9Q,
    userAgentMiddleware: () => M9Q
  });
  R9Q.exports = vL4(U9Q);
  var bL4 = iB(),
    $9Q = void 0;

  function w9Q(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }
  Lv(w9Q, "isValidUserAgentAppId");

  function q9Q(A) {
    let Q = (0, bL4.normalizeProvider)(A.userAgentAppId ?? $9Q),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: Lv(async () => {
        let G = await Q();
        if (!w9Q(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }, "userAgentAppId")
    })
  }
  Lv(q9Q, "resolveUserAgentConfig");
  var fL4 = p4A(),
    hL4 = nC(),
    NS = MF(),
    gL4 = /\d{12}\.ddb/;
  async function N9Q(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")(0, NS.setFeature)(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let I = await Q.retryStrategy();
      if (typeof I.acquireInitialRetryToken === "function")
        if (I.constructor?.name?.includes("Adaptive"))(0, NS.setFeature)(A, "RETRY_MODE_ADAPTIVE", "F");
        else(0, NS.setFeature)(A, "RETRY_MODE_STANDARD", "E");
      else(0, NS.setFeature)(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let I = A.endpointV2;
      if (String(I?.url?.hostname).match(gL4))(0, NS.setFeature)(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          (0, NS.setFeature)(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          (0, NS.setFeature)(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          (0, NS.setFeature)(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let I = Z;
      if (I.accountId)(0, NS.setFeature)(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [Y, J] of Object.entries(I.$source ?? {}))(0, NS.setFeature)(A, Y, J)
    }
  }
  Lv(N9Q, "checkFeatures");
  var C9Q = "user-agent",
    p$1 = "x-amz-user-agent",
    E9Q = " ",
    l$1 = "/",
    uL4 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g,
    mL4 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g,
    z9Q = "-",
    dL4 = 1024;

  function L9Q(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= dL4) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  Lv(L9Q, "encodeFeatures");
  var M9Q = Lv((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!hL4.HttpRequest.isInstance(Z)) return Q(G);
      let {
        headers: I
      } = Z, Y = B?.userAgent?.map(whA) || [], J = (await A.defaultUserAgentProvider()).map(whA);
      await N9Q(B, A, G);
      let W = B;
      J.push(`m/${L9Q(Object.assign({},B.__smithy_context?.features,W.__aws_sdk_context?.features))}`);
      let X = A?.customUserAgent?.map(whA) || [],
        V = await A.userAgentAppId();
      if (V) J.push(whA([`app/${V}`]));
      let F = (0, fL4.getUserAgentPrefix)(),
        K = (F ? [F] : []).concat([...J, ...Y, ...X]).join(E9Q),
        D = [...J.filter((H) => H.startsWith("aws-sdk-")), ...X].join(E9Q);
      if (A.runtime !== "browser") {
        if (D) I[p$1] = I[p$1] ? `${I[C9Q]} ${D}` : D;
        I[C9Q] = K
      } else I[p$1] = K;
      return Q({
        ...G,
        request: Z
      })
    }, "userAgentMiddleware"),
    whA = Lv((A) => {
      let Q = A[0].split(l$1).map((Y) => Y.replace(uL4, z9Q)).join(l$1),
        B = A[1]?.replace(mL4, z9Q),
        G = Q.indexOf(l$1),
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
    O9Q = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: !0
    },
    cL4 = Lv((A) => ({
      applyToStack: Lv((Q) => {
        Q.add(M9Q(A), O9Q)
      }, "applyToStack")
    }), "getUserAgentPlugin")
})
// @from(Start 2602828, End 2604266)
_9Q = z((bE7, S9Q) => {
  var {
    defineProperty: NhA,
    getOwnPropertyDescriptor: pL4,
    getOwnPropertyNames: lL4
  } = Object, iL4 = Object.prototype.hasOwnProperty, T9Q = (A, Q) => NhA(A, "name", {
    value: Q,
    configurable: !0
  }), nL4 = (A, Q) => {
    for (var B in Q) NhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, aL4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lL4(Q))
        if (!iL4.call(A, Z) && Z !== B) NhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pL4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, sL4 = (A) => aL4(NhA({}, "__esModule", {
    value: !0
  }), A), P9Q = {};
  nL4(P9Q, {
    SelectorType: () => j9Q,
    booleanSelector: () => rL4,
    numberSelector: () => oL4
  });
  S9Q.exports = sL4(P9Q);
  var rL4 = T9Q((A, Q, B) => {
      if (!(Q in A)) return;
      if (A[Q] === "true") return !0;
      if (A[Q] === "false") return !1;
      throw Error(`Cannot load ${B} "${Q}". Expected "true" or "false", got ${A[Q]}.`)
    }, "booleanSelector"),
    oL4 = T9Q((A, Q, B) => {
      if (!(Q in A)) return;
      let G = parseInt(A[Q], 10);
      if (Number.isNaN(G)) throw TypeError(`Cannot load ${B} '${Q}'. Expected number, got '${A[Q]}'.`);
      return G
    }, "numberSelector"),
    j9Q = ((A) => {
      return A.ENV = "env", A.CONFIG = "shared config entry", A
    })(j9Q || {})
})
// @from(Start 2604272, End 2611016)
f8 = z((fE7, d9Q) => {
  var {
    defineProperty: MhA,
    getOwnPropertyDescriptor: tL4,
    getOwnPropertyNames: eL4
  } = Object, AM4 = Object.prototype.hasOwnProperty, mR = (A, Q) => MhA(A, "name", {
    value: Q,
    configurable: !0
  }), QM4 = (A, Q) => {
    for (var B in Q) MhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, BM4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of eL4(Q))
        if (!AM4.call(A, Z) && Z !== B) MhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = tL4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, GM4 = (A) => BM4(MhA({}, "__esModule", {
    value: !0
  }), A), x9Q = {};
  QM4(x9Q, {
    CONFIG_USE_DUALSTACK_ENDPOINT: () => b9Q,
    CONFIG_USE_FIPS_ENDPOINT: () => h9Q,
    DEFAULT_USE_DUALSTACK_ENDPOINT: () => ZM4,
    DEFAULT_USE_FIPS_ENDPOINT: () => YM4,
    ENV_USE_DUALSTACK_ENDPOINT: () => v9Q,
    ENV_USE_FIPS_ENDPOINT: () => f9Q,
    NODE_REGION_CONFIG_FILE_OPTIONS: () => KM4,
    NODE_REGION_CONFIG_OPTIONS: () => FM4,
    NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS: () => IM4,
    NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS: () => JM4,
    REGION_ENV_NAME: () => g9Q,
    REGION_INI_NAME: () => u9Q,
    getRegionInfo: () => zM4,
    resolveCustomEndpointsConfig: () => WM4,
    resolveEndpointsConfig: () => VM4,
    resolveRegionConfig: () => DM4
  });
  d9Q.exports = GM4(x9Q);
  var Cd = _9Q(),
    v9Q = "AWS_USE_DUALSTACK_ENDPOINT",
    b9Q = "use_dualstack_endpoint",
    ZM4 = !1,
    IM4 = {
      environmentVariableSelector: (A) => (0, Cd.booleanSelector)(A, v9Q, Cd.SelectorType.ENV),
      configFileSelector: (A) => (0, Cd.booleanSelector)(A, b9Q, Cd.SelectorType.CONFIG),
      default: !1
    },
    f9Q = "AWS_USE_FIPS_ENDPOINT",
    h9Q = "use_fips_endpoint",
    YM4 = !1,
    JM4 = {
      environmentVariableSelector: (A) => (0, Cd.booleanSelector)(A, f9Q, Cd.SelectorType.ENV),
      configFileSelector: (A) => (0, Cd.booleanSelector)(A, h9Q, Cd.SelectorType.CONFIG),
      default: !1
    },
    LhA = w7(),
    WM4 = mR((A) => {
      let {
        tls: Q,
        endpoint: B,
        urlParser: G,
        useDualstackEndpoint: Z
      } = A;
      return Object.assign(A, {
        tls: Q ?? !0,
        endpoint: (0, LhA.normalizeProvider)(typeof B === "string" ? G(B) : B),
        isCustomEndpoint: !0,
        useDualstackEndpoint: (0, LhA.normalizeProvider)(Z ?? !1)
      })
    }, "resolveCustomEndpointsConfig"),
    XM4 = mR(async (A) => {
      let {
        tls: Q = !0
      } = A, B = await A.region();
      if (!new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/).test(B)) throw Error("Invalid region in client config");
      let Z = await A.useDualstackEndpoint(),
        I = await A.useFipsEndpoint(),
        {
          hostname: Y
        } = await A.regionInfoProvider(B, {
          useDualstackEndpoint: Z,
          useFipsEndpoint: I
        }) ?? {};
      if (!Y) throw Error("Cannot resolve hostname from client config");
      return A.urlParser(`${Q?"https:":"http:"}//${Y}`)
    }, "getEndpointFromRegion"),
    VM4 = mR((A) => {
      let Q = (0, LhA.normalizeProvider)(A.useDualstackEndpoint ?? !1),
        {
          endpoint: B,
          useFipsEndpoint: G,
          urlParser: Z,
          tls: I
        } = A;
      return Object.assign(A, {
        tls: I ?? !0,
        endpoint: B ? (0, LhA.normalizeProvider)(typeof B === "string" ? Z(B) : B) : () => XM4({
          ...A,
          useDualstackEndpoint: Q,
          useFipsEndpoint: G
        }),
        isCustomEndpoint: !!B,
        useDualstackEndpoint: Q
      })
    }, "resolveEndpointsConfig"),
    g9Q = "AWS_REGION",
    u9Q = "region",
    FM4 = {
      environmentVariableSelector: (A) => A[g9Q],
      configFileSelector: (A) => A[u9Q],
      default: () => {
        throw Error("Region is missing")
      }
    },
    KM4 = {
      preferredFile: "credentials"
    },
    m9Q = mR((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    k9Q = mR((A) => m9Q(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    DM4 = mR((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: async () => {
          if (typeof Q === "string") return k9Q(Q);
          let G = await Q();
          return k9Q(G)
        },
        useFipsEndpoint: async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (m9Q(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }
      })
    }, "resolveRegionConfig"),
    y9Q = mR((A = [], {
      useFipsEndpoint: Q,
      useDualstackEndpoint: B
    }) => A.find(({
      tags: G
    }) => Q === G.includes("fips") && B === G.includes("dualstack"))?.hostname, "getHostnameFromVariants"),
    HM4 = mR((A, {
      regionHostname: Q,
      partitionHostname: B
    }) => Q ? Q : B ? B.replace("{region}", A) : void 0, "getResolvedHostname"),
    CM4 = mR((A, {
      partitionHash: Q
    }) => Object.keys(Q || {}).find((B) => Q[B].regions.includes(A)) ?? "aws", "getResolvedPartition"),
    EM4 = mR((A, {
      signingRegion: Q,
      regionRegex: B,
      useFipsEndpoint: G
    }) => {
      if (Q) return Q;
      else if (G) {
        let Z = B.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\."),
          I = A.match(Z);
        if (I) return I[0].slice(1, -1)
      }
    }, "getResolvedSigningRegion"),
    zM4 = mR((A, {
      useFipsEndpoint: Q = !1,
      useDualstackEndpoint: B = !1,
      signingService: G,
      regionHash: Z,
      partitionHash: I
    }) => {
      let Y = CM4(A, {
          partitionHash: I
        }),
        J = A in Z ? A : I[Y]?.endpoint ?? A,
        W = {
          useFipsEndpoint: Q,
          useDualstackEndpoint: B
        },
        X = y9Q(Z[J]?.variants, W),
        V = y9Q(I[Y]?.variants, W),
        F = HM4(J, {
          regionHostname: X,
          partitionHostname: V
        });
      if (F === void 0) throw Error(`Endpoint resolution failed for: ${{resolvedRegion:J,useFipsEndpoint:Q,useDualstackEndpoint:B}}`);
      let K = EM4(F, {
        signingRegion: Z[J]?.signingRegion,
        regionRegex: I[Y].regionRegex,
        useFipsEndpoint: Q
      });
      return {
        partition: Y,
        signingService: G,
        hostname: F,
        ...K && {
          signingRegion: K
        },
        ...Z[J]?.signingService && {
          signingService: Z[J].signingService
        }
      }
    }, "getRegionInfo")
})
// @from(Start 2611022, End 2613805)
t9Q = z((hE7, o9Q) => {
  var {
    defineProperty: OhA,
    getOwnPropertyDescriptor: UM4,
    getOwnPropertyNames: $M4
  } = Object, wM4 = Object.prototype.hasOwnProperty, RhA = (A, Q) => OhA(A, "name", {
    value: Q,
    configurable: !0
  }), qM4 = (A, Q) => {
    for (var B in Q) OhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, NM4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $M4(Q))
        if (!wM4.call(A, Z) && Z !== B) OhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = UM4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, LM4 = (A) => NM4(OhA({}, "__esModule", {
    value: !0
  }), A), c9Q = {};
  qM4(c9Q, {
    AlgorithmId: () => n9Q,
    EndpointURLScheme: () => i9Q,
    FieldPosition: () => a9Q,
    HttpApiKeyAuthLocation: () => l9Q,
    HttpAuthLocation: () => p9Q,
    IniSectionType: () => s9Q,
    RequestHandlerProtocol: () => r9Q,
    SMITHY_CONTEXT_KEY: () => PM4,
    getDefaultClientConfiguration: () => RM4,
    resolveDefaultRuntimeConfig: () => TM4
  });
  o9Q.exports = LM4(c9Q);
  var p9Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(p9Q || {}),
    l9Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(l9Q || {}),
    i9Q = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(i9Q || {}),
    n9Q = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(n9Q || {}),
    MM4 = RhA((A) => {
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
    OM4 = RhA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    RM4 = RhA((A) => {
      return MM4(A)
    }, "getDefaultClientConfiguration"),
    TM4 = RhA((A) => {
      return OM4(A)
    }, "resolveDefaultRuntimeConfig"),
    a9Q = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(a9Q || {}),
    PM4 = "__smithy_context",
    s9Q = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(s9Q || {}),
    r9Q = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(r9Q || {})
})
// @from(Start 2613811, End 2618318)
Z4Q = z((gE7, G4Q) => {
  var {
    defineProperty: ThA,
    getOwnPropertyDescriptor: jM4,
    getOwnPropertyNames: SM4
  } = Object, _M4 = Object.prototype.hasOwnProperty, Ed = (A, Q) => ThA(A, "name", {
    value: Q,
    configurable: !0
  }), kM4 = (A, Q) => {
    for (var B in Q) ThA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, yM4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of SM4(Q))
        if (!_M4.call(A, Z) && Z !== B) ThA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = jM4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, xM4 = (A) => yM4(ThA({}, "__esModule", {
    value: !0
  }), A), e9Q = {};
  kM4(e9Q, {
    Field: () => fM4,
    Fields: () => hM4,
    HttpRequest: () => gM4,
    HttpResponse: () => uM4,
    IHttpRequest: () => A4Q.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => vM4,
    isValidHostname: () => B4Q,
    resolveHttpHandlerRuntimeConfig: () => bM4
  });
  G4Q.exports = xM4(e9Q);
  var vM4 = Ed((A) => {
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
    bM4 = Ed((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    A4Q = t9Q(),
    fM4 = class {
      static {
        Ed(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = A4Q.FieldPosition.HEADER,
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
    hM4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Ed(this, "Fields")
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
    gM4 = class A {
      static {
        Ed(this, "HttpRequest")
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
        if (B.query) B.query = Q4Q(B.query);
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

  function Q4Q(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Ed(Q4Q, "cloneQuery");
  var uM4 = class {
    static {
      Ed(this, "HttpResponse")
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

  function B4Q(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Ed(B4Q, "isValidHostname")
})
// @from(Start 2618324, End 2620078)
LX = z((cE7, X4Q) => {
  var {
    defineProperty: PhA,
    getOwnPropertyDescriptor: mM4,
    getOwnPropertyNames: dM4
  } = Object, cM4 = Object.prototype.hasOwnProperty, Y4Q = (A, Q) => PhA(A, "name", {
    value: Q,
    configurable: !0
  }), pM4 = (A, Q) => {
    for (var B in Q) PhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, lM4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of dM4(Q))
        if (!cM4.call(A, Z) && Z !== B) PhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = mM4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, iM4 = (A) => lM4(PhA({}, "__esModule", {
    value: !0
  }), A), J4Q = {};
  pM4(J4Q, {
    contentLengthMiddleware: () => i$1,
    contentLengthMiddlewareOptions: () => W4Q,
    getContentLengthPlugin: () => aM4
  });
  X4Q.exports = iM4(J4Q);
  var nM4 = Z4Q(),
    I4Q = "content-length";

  function i$1(A) {
    return (Q) => async (B) => {
      let G = B.request;
      if (nM4.HttpRequest.isInstance(G)) {
        let {
          body: Z,
          headers: I
        } = G;
        if (Z && Object.keys(I).map((Y) => Y.toLowerCase()).indexOf(I4Q) === -1) try {
          let Y = A(Z);
          G.headers = {
            ...G.headers,
            [I4Q]: String(Y)
          }
        } catch (Y) {}
      }
      return Q({
        ...B,
        request: G
      })
    }
  }
  Y4Q(i$1, "contentLengthMiddleware");
  var W4Q = {
      step: "build",
      tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
      name: "contentLengthMiddleware",
      override: !0
    },
    aM4 = Y4Q((A) => ({
      applyToStack: (Q) => {
        Q.add(i$1(A.bodyLengthChecker), W4Q)
      }
    }), "getContentLengthPlugin")
})
// @from(Start 2620084, End 2620722)
o4A = z((V4Q) => {
  Object.defineProperty(V4Q, "__esModule", {
    value: !0
  });
  V4Q.getHomeDir = void 0;
  var sM4 = UA("os"),
    rM4 = UA("path"),
    n$1 = {},
    oM4 = () => {
      if (process && process.geteuid) return `${process.geteuid()}`;
      return "DEFAULT"
    },
    tM4 = () => {
      let {
        HOME: A,
        USERPROFILE: Q,
        HOMEPATH: B,
        HOMEDRIVE: G = `C:${rM4.sep}`
      } = process.env;
      if (A) return A;
      if (Q) return Q;
      if (B) return `${G}${B}`;
      let Z = oM4();
      if (!n$1[Z]) n$1[Z] = (0, sM4.homedir)();
      return n$1[Z]
    };
  V4Q.getHomeDir = tM4
})
// @from(Start 2620728, End 2621127)
a$1 = z((K4Q) => {
  Object.defineProperty(K4Q, "__esModule", {
    value: !0
  });
  K4Q.getSSOTokenFilepath = void 0;
  var eM4 = UA("crypto"),
    AO4 = UA("path"),
    QO4 = o4A(),
    BO4 = (A) => {
      let B = (0, eM4.createHash)("sha1").update(A).digest("hex");
      return (0, AO4.join)((0, QO4.getHomeDir)(), ".aws", "sso", "cache", `${B}.json`)
    };
  K4Q.getSSOTokenFilepath = BO4
})
// @from(Start 2621133, End 2621514)
E4Q = z((H4Q) => {
  Object.defineProperty(H4Q, "__esModule", {
    value: !0
  });
  H4Q.getSSOTokenFromFile = void 0;
  var GO4 = UA("fs"),
    ZO4 = a$1(),
    {
      readFile: IO4
    } = GO4.promises,
    YO4 = async (A) => {
      let Q = (0, ZO4.getSSOTokenFilepath)(A),
        B = await IO4(Q, "utf8");
      return JSON.parse(B)
    };
  H4Q.getSSOTokenFromFile = YO4
})
// @from(Start 2621520, End 2624303)
R4Q = z((nE7, O4Q) => {
  var {
    defineProperty: jhA,
    getOwnPropertyDescriptor: JO4,
    getOwnPropertyNames: WO4
  } = Object, XO4 = Object.prototype.hasOwnProperty, ShA = (A, Q) => jhA(A, "name", {
    value: Q,
    configurable: !0
  }), VO4 = (A, Q) => {
    for (var B in Q) jhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, FO4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of WO4(Q))
        if (!XO4.call(A, Z) && Z !== B) jhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = JO4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, KO4 = (A) => FO4(jhA({}, "__esModule", {
    value: !0
  }), A), z4Q = {};
  VO4(z4Q, {
    AlgorithmId: () => q4Q,
    EndpointURLScheme: () => w4Q,
    FieldPosition: () => N4Q,
    HttpApiKeyAuthLocation: () => $4Q,
    HttpAuthLocation: () => U4Q,
    IniSectionType: () => L4Q,
    RequestHandlerProtocol: () => M4Q,
    SMITHY_CONTEXT_KEY: () => zO4,
    getDefaultClientConfiguration: () => CO4,
    resolveDefaultRuntimeConfig: () => EO4
  });
  O4Q.exports = KO4(z4Q);
  var U4Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(U4Q || {}),
    $4Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })($4Q || {}),
    w4Q = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(w4Q || {}),
    q4Q = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(q4Q || {}),
    DO4 = ShA((A) => {
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
    HO4 = ShA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    CO4 = ShA((A) => {
      return DO4(A)
    }, "getDefaultClientConfiguration"),
    EO4 = ShA((A) => {
      return HO4(A)
    }, "resolveDefaultRuntimeConfig"),
    N4Q = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(N4Q || {}),
    zO4 = "__smithy_context",
    L4Q = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(L4Q || {}),
    M4Q = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(M4Q || {})
})
// @from(Start 2624309, End 2624677)
r$1 = z((T4Q) => {
  Object.defineProperty(T4Q, "__esModule", {
    value: !0
  });
  T4Q.slurpFile = void 0;
  var UO4 = UA("fs"),
    {
      readFile: $O4
    } = UO4.promises,
    s$1 = {},
    wO4 = (A, Q) => {
      if (!s$1[A] || (Q === null || Q === void 0 ? void 0 : Q.ignoreCache)) s$1[A] = $O4(A, "utf8");
      return s$1[A]
    };
  T4Q.slurpFile = wO4
})
// @from(Start 2624683, End 2629436)
SG = z((sE7, BHA) => {
  var {
    defineProperty: yhA,
    getOwnPropertyDescriptor: qO4,
    getOwnPropertyNames: NO4
  } = Object, LO4 = Object.prototype.hasOwnProperty, GL = (A, Q) => yhA(A, "name", {
    value: Q,
    configurable: !0
  }), MO4 = (A, Q) => {
    for (var B in Q) yhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, o$1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NO4(Q))
        if (!LO4.call(A, Z) && Z !== B) yhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qO4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, e$1 = (A, Q, B) => (o$1(A, Q, "default"), B && o$1(B, Q, "default")), OO4 = (A) => o$1(yhA({}, "__esModule", {
    value: !0
  }), A), QHA = {};
  MO4(QHA, {
    CONFIG_PREFIX_SEPARATOR: () => ur,
    DEFAULT_PROFILE: () => k4Q,
    ENV_PROFILE: () => _4Q,
    getProfileName: () => RO4,
    loadSharedConfigFiles: () => x4Q,
    loadSsoSessionData: () => gO4,
    parseKnownFiles: () => mO4
  });
  BHA.exports = OO4(QHA);
  e$1(QHA, o4A(), BHA.exports);
  var _4Q = "AWS_PROFILE",
    k4Q = "default",
    RO4 = GL((A) => A.profile || process.env[_4Q] || k4Q, "getProfileName");
  e$1(QHA, a$1(), BHA.exports);
  e$1(QHA, E4Q(), BHA.exports);
  var _hA = R4Q(),
    TO4 = GL((A) => Object.entries(A).filter(([Q]) => {
      let B = Q.indexOf(ur);
      if (B === -1) return !1;
      return Object.values(_hA.IniSectionType).includes(Q.substring(0, B))
    }).reduce((Q, [B, G]) => {
      let Z = B.indexOf(ur),
        I = B.substring(0, Z) === _hA.IniSectionType.PROFILE ? B.substring(Z + 1) : B;
      return Q[I] = G, Q
    }, {
      ...A.default && {
        default: A.default
      }
    }), "getConfigData"),
    khA = UA("path"),
    PO4 = o4A(),
    jO4 = "AWS_CONFIG_FILE",
    y4Q = GL(() => process.env[jO4] || (0, khA.join)((0, PO4.getHomeDir)(), ".aws", "config"), "getConfigFilepath"),
    SO4 = o4A(),
    _O4 = "AWS_SHARED_CREDENTIALS_FILE",
    kO4 = GL(() => process.env[_O4] || (0, khA.join)((0, SO4.getHomeDir)(), ".aws", "credentials"), "getCredentialsFilepath"),
    yO4 = o4A(),
    xO4 = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/,
    vO4 = ["__proto__", "profile __proto__"],
    t$1 = GL((A) => {
      let Q = {},
        B, G;
      for (let Z of A.split(/\r?\n/)) {
        let I = Z.split(/(^|\s)[;#]/)[0].trim();
        if (I[0] === "[" && I[I.length - 1] === "]") {
          B = void 0, G = void 0;
          let J = I.substring(1, I.length - 1),
            W = xO4.exec(J);
          if (W) {
            let [, X, , V] = W;
            if (Object.values(_hA.IniSectionType).includes(X)) B = [X, V].join(ur)
          } else B = J;
          if (vO4.includes(J)) throw Error(`Found invalid profile name "${J}"`)
        } else if (B) {
          let J = I.indexOf("=");
          if (![0, -1].includes(J)) {
            let [W, X] = [I.substring(0, J).trim(), I.substring(J + 1).trim()];
            if (X === "") G = W;
            else {
              if (G && Z.trimStart() === Z) G = void 0;
              Q[B] = Q[B] || {};
              let V = G ? [G, W].join(ur) : W;
              Q[B][V] = X
            }
          }
        }
      }
      return Q
    }, "parseIni"),
    j4Q = r$1(),
    S4Q = GL(() => ({}), "swallowError"),
    ur = ".",
    x4Q = GL(async (A = {}) => {
      let {
        filepath: Q = kO4(),
        configFilepath: B = y4Q()
      } = A, G = (0, yO4.getHomeDir)(), Z = "~/", I = Q;
      if (Q.startsWith("~/")) I = (0, khA.join)(G, Q.slice(2));
      let Y = B;
      if (B.startsWith("~/")) Y = (0, khA.join)(G, B.slice(2));
      let J = await Promise.all([(0, j4Q.slurpFile)(Y, {
        ignoreCache: A.ignoreCache
      }).then(t$1).then(TO4).catch(S4Q), (0, j4Q.slurpFile)(I, {
        ignoreCache: A.ignoreCache
      }).then(t$1).catch(S4Q)]);
      return {
        configFile: J[0],
        credentialsFile: J[1]
      }
    }, "loadSharedConfigFiles"),
    bO4 = GL((A) => Object.entries(A).filter(([Q]) => Q.startsWith(_hA.IniSectionType.SSO_SESSION + ur)).reduce((Q, [B, G]) => ({
      ...Q,
      [B.substring(B.indexOf(ur) + 1)]: G
    }), {}), "getSsoSessionData"),
    fO4 = r$1(),
    hO4 = GL(() => ({}), "swallowError"),
    gO4 = GL(async (A = {}) => (0, fO4.slurpFile)(A.configFilepath ?? y4Q()).then(t$1).then(bO4).catch(hO4), "loadSsoSessionData"),
    uO4 = GL((...A) => {
      let Q = {};
      for (let B of A)
        for (let [G, Z] of Object.entries(B))
          if (Q[G] !== void 0) Object.assign(Q[G], Z);
          else Q[G] = Z;
      return Q
    }, "mergeConfigFiles"),
    mO4 = GL(async (A) => {
      let Q = await x4Q(A);
      return uO4(Q.configFile, Q.credentialsFile)
    }, "parseKnownFiles")
})
// @from(Start 2629442, End 2632131)
uI = z((rE7, f4Q) => {
  var {
    defineProperty: xhA,
    getOwnPropertyDescriptor: dO4,
    getOwnPropertyNames: cO4
  } = Object, pO4 = Object.prototype.hasOwnProperty, t4A = (A, Q) => xhA(A, "name", {
    value: Q,
    configurable: !0
  }), lO4 = (A, Q) => {
    for (var B in Q) xhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, iO4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of cO4(Q))
        if (!pO4.call(A, Z) && Z !== B) xhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = dO4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, nO4 = (A) => iO4(xhA({}, "__esModule", {
    value: !0
  }), A), b4Q = {};
  lO4(b4Q, {
    loadConfig: () => tO4
  });
  f4Q.exports = nO4(b4Q);
  var GHA = j2();

  function Aw1(A) {
    try {
      let Q = new Set(Array.from(A.match(/([A-Z_]){3,}/g) ?? []));
      return Q.delete("CONFIG"), Q.delete("CONFIG_PREFIX_SEPARATOR"), Q.delete("ENV"), [...Q].join(", ")
    } catch (Q) {
      return A
    }
  }
  t4A(Aw1, "getSelectorName");
  var aO4 = t4A((A, Q) => async () => {
      try {
        let B = A(process.env, Q);
        if (B === void 0) throw Error();
        return B
      } catch (B) {
        throw new GHA.CredentialsProviderError(B.message || `Not found in ENV: ${Aw1(A.toString())}`, {
          logger: Q?.logger
        })
      }
    }, "fromEnv"),
    v4Q = SG(),
    sO4 = t4A((A, {
      preferredFile: Q = "config",
      ...B
    } = {}) => async () => {
      let G = (0, v4Q.getProfileName)(B),
        {
          configFile: Z,
          credentialsFile: I
        } = await (0, v4Q.loadSharedConfigFiles)(B),
        Y = I[G] || {},
        J = Z[G] || {},
        W = Q === "config" ? {
          ...Y,
          ...J
        } : {
          ...J,
          ...Y
        };
      try {
        let V = A(W, Q === "config" ? Z : I);
        if (V === void 0) throw Error();
        return V
      } catch (X) {
        throw new GHA.CredentialsProviderError(X.message || `Not found in config files w/ profile [${G}]: ${Aw1(A.toString())}`, {
          logger: B.logger
        })
      }
    }, "fromSharedConfigFiles"),
    rO4 = t4A((A) => typeof A === "function", "isFunction"),
    oO4 = t4A((A) => rO4(A) ? async () => await A(): (0, GHA.fromStatic)(A), "fromStatic"),
    tO4 = t4A(({
      environmentVariableSelector: A,
      configFileSelector: Q,
      default: B
    }, G = {}) => {
      let {
        signingName: Z,
        logger: I
      } = G, Y = {
        signingName: Z,
        logger: I
      };
      return (0, GHA.memoize)((0, GHA.chain)(aO4(A, Y), sO4(Q, G), oO4(B)))
    }, "loadConfig")
})
// @from(Start 2632137, End 2633086)
c4Q = z((m4Q) => {
  Object.defineProperty(m4Q, "__esModule", {
    value: !0
  });
  m4Q.getEndpointUrlConfig = void 0;
  var h4Q = SG(),
    g4Q = "AWS_ENDPOINT_URL",
    u4Q = "endpoint_url",
    eO4 = (A) => ({
      environmentVariableSelector: (Q) => {
        let B = A.split(" ").map((I) => I.toUpperCase()),
          G = Q[[g4Q, ...B].join("_")];
        if (G) return G;
        let Z = Q[g4Q];
        if (Z) return Z;
        return
      },
      configFileSelector: (Q, B) => {
        if (B && Q.services) {
          let Z = B[["services", Q.services].join(h4Q.CONFIG_PREFIX_SEPARATOR)];
          if (Z) {
            let I = A.split(" ").map((J) => J.toLowerCase()),
              Y = Z[[I.join("_"), u4Q].join(h4Q.CONFIG_PREFIX_SEPARATOR)];
            if (Y) return Y
          }
        }
        let G = Q[u4Q];
        if (G) return G;
        return
      },
      default: void 0
    });
  m4Q.getEndpointUrlConfig = eO4
})
// @from(Start 2633092, End 2633399)
Qw1 = z((p4Q) => {
  Object.defineProperty(p4Q, "__esModule", {
    value: !0
  });
  p4Q.getEndpointFromConfig = void 0;
  var AR4 = uI(),
    QR4 = c4Q(),
    BR4 = async (A) => (0, AR4.loadConfig)((0, QR4.getEndpointUrlConfig)(A !== null && A !== void 0 ? A : ""))();
  p4Q.getEndpointFromConfig = BR4
})
// @from(Start 2633405, End 2634586)
s4Q = z((eE7, a4Q) => {
  var {
    defineProperty: vhA,
    getOwnPropertyDescriptor: GR4,
    getOwnPropertyNames: ZR4
  } = Object, IR4 = Object.prototype.hasOwnProperty, YR4 = (A, Q) => vhA(A, "name", {
    value: Q,
    configurable: !0
  }), JR4 = (A, Q) => {
    for (var B in Q) vhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, WR4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ZR4(Q))
        if (!IR4.call(A, Z) && Z !== B) vhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = GR4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, XR4 = (A) => WR4(vhA({}, "__esModule", {
    value: !0
  }), A), i4Q = {};
  JR4(i4Q, {
    parseQueryString: () => n4Q
  });
  a4Q.exports = XR4(i4Q);

  function n4Q(A) {
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
  YR4(n4Q, "parseQueryString")
})
// @from(Start 2634592, End 2635802)
NJ = z((Az7, t4Q) => {
  var {
    defineProperty: bhA,
    getOwnPropertyDescriptor: VR4,
    getOwnPropertyNames: FR4
  } = Object, KR4 = Object.prototype.hasOwnProperty, DR4 = (A, Q) => bhA(A, "name", {
    value: Q,
    configurable: !0
  }), HR4 = (A, Q) => {
    for (var B in Q) bhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, CR4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of FR4(Q))
        if (!KR4.call(A, Z) && Z !== B) bhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = VR4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ER4 = (A) => CR4(bhA({}, "__esModule", {
    value: !0
  }), A), r4Q = {};
  HR4(r4Q, {
    parseUrl: () => o4Q
  });
  t4Q.exports = ER4(r4Q);
  var zR4 = s4Q(),
    o4Q = DR4((A) => {
      if (typeof A === "string") return o4Q(new URL(A));
      let {
        hostname: Q,
        pathname: B,
        port: G,
        protocol: Z,
        search: I
      } = A, Y;
      if (I) Y = (0, zR4.parseQueryString)(I);
      return {
        hostname: Q,
        port: G ? parseInt(G) : void 0,
        protocol: Z,
        path: B,
        query: Y
      }
    }, "parseUrl")
})
// @from(Start 2635808, End 2643198)
q5 = z((Qz7, I8Q) => {
  var {
    defineProperty: hhA,
    getOwnPropertyDescriptor: UR4,
    getOwnPropertyNames: $R4
  } = Object, wR4 = Object.prototype.hasOwnProperty, ZL = (A, Q) => hhA(A, "name", {
    value: Q,
    configurable: !0
  }), qR4 = (A, Q) => {
    for (var B in Q) hhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, NR4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $R4(Q))
        if (!wR4.call(A, Z) && Z !== B) hhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = UR4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, LR4 = (A) => NR4(hhA({}, "__esModule", {
    value: !0
  }), A), A8Q = {};
  qR4(A8Q, {
    endpointMiddleware: () => G8Q,
    endpointMiddlewareOptions: () => Z8Q,
    getEndpointFromInstructions: () => Q8Q,
    getEndpointPlugin: () => xR4,
    resolveEndpointConfig: () => bR4,
    resolveEndpointRequiredConfig: () => fR4,
    resolveParams: () => B8Q,
    toEndpointV1: () => Bw1
  });
  I8Q.exports = LR4(A8Q);
  var MR4 = ZL(async (A) => {
      let Q = A?.Bucket || "";
      if (typeof A.Bucket === "string") A.Bucket = Q.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
      if (jR4(Q)) {
        if (A.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets")
      } else if (!PR4(Q) || Q.indexOf(".") !== -1 && !String(A.Endpoint).startsWith("http:") || Q.toLowerCase() !== Q || Q.length < 3) A.ForcePathStyle = !0;
      if (A.DisableMultiRegionAccessPoints) A.disableMultiRegionAccessPoints = !0, A.DisableMRAP = !0;
      return A
    }, "resolveParamsForS3"),
    OR4 = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/,
    RR4 = /(\d+\.){3}\d+/,
    TR4 = /\.\./,
    PR4 = ZL((A) => OR4.test(A) && !RR4.test(A) && !TR4.test(A), "isDnsCompatibleBucketName"),
    jR4 = ZL((A) => {
      let [Q, B, G, , , Z] = A.split(":"), I = Q === "arn" && A.split(":").length >= 6, Y = Boolean(I && B && G && Z);
      if (I && !Y) throw Error(`Invalid ARN: ${A} was an invalid ARN.`);
      return Y
    }, "isArnBucketName"),
    SR4 = ZL((A, Q, B) => {
      let G = ZL(async () => {
        let Z = B[A] ?? B[Q];
        if (typeof Z === "function") return Z();
        return Z
      }, "configProvider");
      if (A === "credentialScope" || Q === "CredentialScope") return async () => {
        let Z = typeof B.credentials === "function" ? await B.credentials() : B.credentials;
        return Z?.credentialScope ?? Z?.CredentialScope
      };
      if (A === "accountId" || Q === "AccountId") return async () => {
        let Z = typeof B.credentials === "function" ? await B.credentials() : B.credentials;
        return Z?.accountId ?? Z?.AccountId
      };
      if (A === "endpoint" || Q === "endpoint") return async () => {
        let Z = await G();
        if (Z && typeof Z === "object") {
          if ("url" in Z) return Z.url.href;
          if ("hostname" in Z) {
            let {
              protocol: I,
              hostname: Y,
              port: J,
              path: W
            } = Z;
            return `${I}//${Y}${J?":"+J:""}${W}`
          }
        }
        return Z
      };
      return G
    }, "createConfigValueProvider"),
    _R4 = Qw1(),
    e4Q = NJ(),
    Bw1 = ZL((A) => {
      if (typeof A === "object") {
        if ("url" in A) return (0, e4Q.parseUrl)(A.url);
        return A
      }
      return (0, e4Q.parseUrl)(A)
    }, "toEndpointV1"),
    Q8Q = ZL(async (A, Q, B, G) => {
      if (!B.endpoint) {
        let Y;
        if (B.serviceConfiguredEndpoint) Y = await B.serviceConfiguredEndpoint();
        else Y = await (0, _R4.getEndpointFromConfig)(B.serviceId);
        if (Y) B.endpoint = () => Promise.resolve(Bw1(Y))
      }
      let Z = await B8Q(A, Q, B);
      if (typeof B.endpointProvider !== "function") throw Error("config.endpointProvider is not set.");
      return B.endpointProvider(Z, G)
    }, "getEndpointFromInstructions"),
    B8Q = ZL(async (A, Q, B) => {
      let G = {},
        Z = Q?.getEndpointParameterInstructions?.() || {};
      for (let [I, Y] of Object.entries(Z)) switch (Y.type) {
        case "staticContextParams":
          G[I] = Y.value;
          break;
        case "contextParams":
          G[I] = A[Y.name];
          break;
        case "clientContextParams":
        case "builtInParams":
          G[I] = await SR4(Y.name, I, B)();
          break;
        case "operationContextParams":
          G[I] = Y.get(A);
          break;
        default:
          throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(Y))
      }
      if (Object.keys(Z).length === 0) Object.assign(G, B);
      if (String(B.serviceId).toLowerCase() === "s3") await MR4(G);
      return G
    }, "resolveParams"),
    kR4 = iB(),
    fhA = w7(),
    G8Q = ZL(({
      config: A,
      instructions: Q
    }) => {
      return (B, G) => async (Z) => {
        if (A.endpoint)(0, kR4.setFeature)(G, "ENDPOINT_OVERRIDE", "N");
        let I = await Q8Q(Z.input, {
          getEndpointParameterInstructions() {
            return Q
          }
        }, {
          ...A
        }, G);
        G.endpointV2 = I, G.authSchemes = I.properties?.authSchemes;
        let Y = G.authSchemes?.[0];
        if (Y) {
          G.signing_region = Y.signingRegion, G.signing_service = Y.signingName;
          let W = (0, fhA.getSmithyContext)(G)?.selectedHttpAuthScheme?.httpAuthOption;
          if (W) W.signingProperties = Object.assign(W.signingProperties || {}, {
            signing_region: Y.signingRegion,
            signingRegion: Y.signingRegion,
            signing_service: Y.signingName,
            signingName: Y.signingName,
            signingRegionSet: Y.signingRegionSet
          }, Y.properties)
        }
        return B({
          ...Z
        })
      }
    }, "endpointMiddleware"),
    yR4 = GZ(),
    Z8Q = {
      step: "serialize",
      tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
      name: "endpointV2Middleware",
      override: !0,
      relation: "before",
      toMiddleware: yR4.serializerMiddlewareOption.name
    },
    xR4 = ZL((A, Q) => ({
      applyToStack: (B) => {
        B.addRelativeTo(G8Q({
          config: A,
          instructions: Q
        }), Z8Q)
      }
    }), "getEndpointPlugin"),
    vR4 = Qw1(),
    bR4 = ZL((A) => {
      let Q = A.tls ?? !0,
        {
          endpoint: B,
          useDualstackEndpoint: G,
          useFipsEndpoint: Z
        } = A,
        I = B != null ? async () => Bw1(await (0, fhA.normalizeProvider)(B)()): void 0, J = Object.assign(A, {
          endpoint: I,
          tls: Q,
          isCustomEndpoint: !!B,
          useDualstackEndpoint: (0, fhA.normalizeProvider)(G ?? !1),
          useFipsEndpoint: (0, fhA.normalizeProvider)(Z ?? !1)
        }), W = void 0;
      return J.serviceConfiguredEndpoint = async () => {
        if (A.serviceId && !W) W = (0, vR4.getEndpointFromConfig)(A.serviceId);
        return W
      }, J
    }, "resolveEndpointConfig"),
    fR4 = ZL((A) => {
      let {
        endpoint: Q
      } = A;
      if (Q === void 0) A.endpoint = async () => {
        throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.")
      };
      return A
    }, "resolveEndpointRequiredConfig")
})
// @from(Start 2643204, End 2645987)
Gw1 = z((Bz7, H8Q) => {
  var {
    defineProperty: ghA,
    getOwnPropertyDescriptor: hR4,
    getOwnPropertyNames: gR4
  } = Object, uR4 = Object.prototype.hasOwnProperty, uhA = (A, Q) => ghA(A, "name", {
    value: Q,
    configurable: !0
  }), mR4 = (A, Q) => {
    for (var B in Q) ghA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dR4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gR4(Q))
        if (!uR4.call(A, Z) && Z !== B) ghA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hR4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cR4 = (A) => dR4(ghA({}, "__esModule", {
    value: !0
  }), A), Y8Q = {};
  mR4(Y8Q, {
    AlgorithmId: () => V8Q,
    EndpointURLScheme: () => X8Q,
    FieldPosition: () => F8Q,
    HttpApiKeyAuthLocation: () => W8Q,
    HttpAuthLocation: () => J8Q,
    IniSectionType: () => K8Q,
    RequestHandlerProtocol: () => D8Q,
    SMITHY_CONTEXT_KEY: () => aR4,
    getDefaultClientConfiguration: () => iR4,
    resolveDefaultRuntimeConfig: () => nR4
  });
  H8Q.exports = cR4(Y8Q);
  var J8Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(J8Q || {}),
    W8Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(W8Q || {}),
    X8Q = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(X8Q || {}),
    V8Q = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(V8Q || {}),
    pR4 = uhA((A) => {
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
    lR4 = uhA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    iR4 = uhA((A) => {
      return pR4(A)
    }, "getDefaultClientConfiguration"),
    nR4 = uhA((A) => {
      return lR4(A)
    }, "resolveDefaultRuntimeConfig"),
    F8Q = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(F8Q || {}),
    aR4 = "__smithy_context",
    K8Q = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(K8Q || {}),
    D8Q = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(D8Q || {})
})
// @from(Start 2645993, End 2650500)
w8Q = z((Gz7, $8Q) => {
  var {
    defineProperty: mhA,
    getOwnPropertyDescriptor: sR4,
    getOwnPropertyNames: rR4
  } = Object, oR4 = Object.prototype.hasOwnProperty, zd = (A, Q) => mhA(A, "name", {
    value: Q,
    configurable: !0
  }), tR4 = (A, Q) => {
    for (var B in Q) mhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, eR4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of rR4(Q))
        if (!oR4.call(A, Z) && Z !== B) mhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = sR4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, AT4 = (A) => eR4(mhA({}, "__esModule", {
    value: !0
  }), A), C8Q = {};
  tR4(C8Q, {
    Field: () => GT4,
    Fields: () => ZT4,
    HttpRequest: () => IT4,
    HttpResponse: () => YT4,
    IHttpRequest: () => E8Q.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => QT4,
    isValidHostname: () => U8Q,
    resolveHttpHandlerRuntimeConfig: () => BT4
  });
  $8Q.exports = AT4(C8Q);
  var QT4 = zd((A) => {
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
    BT4 = zd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    E8Q = Gw1(),
    GT4 = class {
      static {
        zd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = E8Q.FieldPosition.HEADER,
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
    ZT4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        zd(this, "Fields")
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
    IT4 = class A {
      static {
        zd(this, "HttpRequest")
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
        if (B.query) B.query = z8Q(B.query);
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

  function z8Q(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  zd(z8Q, "cloneQuery");
  var YT4 = class {
    static {
      zd(this, "HttpResponse")
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

  function U8Q(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  zd(U8Q, "isValidHostname")
})
// @from(Start 2650506, End 2650918)
Zw1 = z((q8Q) => {
  Object.defineProperty(q8Q, "__esModule", {
    value: !0
  });
  q8Q.default = XT4;
  var JT4 = WT4(UA("crypto"));

  function WT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var chA = new Uint8Array(256),
    dhA = chA.length;

  function XT4() {
    if (dhA > chA.length - 16) JT4.default.randomFillSync(chA), dhA = 0;
    return chA.slice(dhA, dhA += 16)
  }
})