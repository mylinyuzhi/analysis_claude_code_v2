
// @from(Start 2374936, End 2395794)
w5 = z((CC7, j0Q) => {
  var {
    defineProperty: sU1,
    getOwnPropertyDescriptor: Dz4,
    getOwnPropertyNames: Hz4
  } = Object, Cz4 = Object.prototype.hasOwnProperty, Ez4 = (A, Q) => {
    for (var B in Q) sU1(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zz4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Hz4(Q))
        if (!Cz4.call(A, Z) && Z !== B) sU1(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Dz4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Uz4 = (A) => zz4(sU1({}, "__esModule", {
    value: !0
  }), A), L0Q = {};
  Ez4(L0Q, {
    FromStringShapeDeserializer: () => T0Q,
    HttpBindingProtocol: () => qz4,
    HttpInterceptingShapeDeserializer: () => Pz4,
    HttpInterceptingShapeSerializer: () => Sz4,
    RequestBuilder: () => R0Q,
    RpcProtocol: () => Lz4,
    ToStringShapeSerializer: () => P0Q,
    collectBody: () => d4A,
    determineTimestampFormat: () => rU1,
    extendedEncodeURIComponent: () => lDA,
    requestBuilder: () => Oz4,
    resolvedPath: () => O0Q
  });
  j0Q.exports = Uz4(L0Q);
  var iU1 = Xd(),
    d4A = async (A = new Uint8Array, Q) => {
      if (A instanceof Uint8Array) return iU1.Uint8ArrayBlobAdapter.mutate(A);
      if (!A) return iU1.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
      let B = Q.streamCollector(A);
      return iU1.Uint8ArrayBlobAdapter.mutate(await B)
    };

  function lDA(A) {
    return encodeURIComponent(A).replace(/[!'()*]/g, function(Q) {
      return "%" + Q.charCodeAt(0).toString(16).toUpperCase()
    })
  }
  var cDA = b4(),
    $z4 = Sr(),
    hfA = b4(),
    U0Q = s6(),
    $0Q = Sr(),
    wz4 = Xd(),
    M0Q = class {
      constructor(A) {
        this.options = A
      }
      getRequestType() {
        return $0Q.HttpRequest
      }
      getResponseType() {
        return $0Q.HttpResponse
      }
      setSerdeContext(A) {
        if (this.serdeContext = A, this.serializer.setSerdeContext(A), this.deserializer.setSerdeContext(A), this.getPayloadCodec()) this.getPayloadCodec().setSerdeContext(A)
      }
      updateServiceEndpoint(A, Q) {
        if ("url" in Q) {
          A.protocol = Q.url.protocol, A.hostname = Q.url.hostname, A.port = Q.url.port ? Number(Q.url.port) : void 0, A.path = Q.url.pathname, A.fragment = Q.url.hash || void 0, A.username = Q.url.username || void 0, A.password = Q.url.password || void 0;
          for (let [B, G] of Q.url.searchParams.entries()) {
            if (!A.query) A.query = {};
            A.query[B] = G
          }
          return A
        } else return A.protocol = Q.protocol, A.hostname = Q.hostname, A.port = Q.port ? Number(Q.port) : void 0, A.path = Q.path, A.query = {
          ...Q.query
        }, A
      }
      setHostPrefix(A, Q, B) {
        let G = hfA.NormalizedSchema.of(Q),
          Z = hfA.NormalizedSchema.of(Q.input);
        if (G.getMergedTraits().endpoint) {
          let I = G.getMergedTraits().endpoint?.[0];
          if (typeof I === "string") {
            let Y = [...Z.structIterator()].filter(([, J]) => J.getMergedTraits().hostLabel);
            for (let [J] of Y) {
              let W = B[J];
              if (typeof W !== "string") throw Error(`@smithy/core/schema - ${J} in input must be a string as hostLabel.`);
              I = I.replace(`{${J}}`, W)
            }
            A.hostname = I + A.hostname
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
      async deserializeHttpMessage(A, Q, B, G, Z) {
        let I;
        if (G instanceof Set) I = Z;
        else I = G;
        let Y = this.deserializer,
          J = hfA.NormalizedSchema.of(A),
          W = [];
        for (let [X, V] of J.structIterator()) {
          let F = V.getMemberTraits();
          if (F.httpPayload) {
            if (V.isStreaming())
              if (V.isStructSchema()) {
                let H = this.serdeContext;
                if (!H.eventStreamMarshaller) throw Error("@smithy/core - HttpProtocol: eventStreamMarshaller missing in serdeContext.");
                let C = V.getMemberSchemas();
                I[X] = H.eventStreamMarshaller.deserialize(B.body, async (E) => {
                  let U = Object.keys(E).find((q) => {
                    return q !== "__type"
                  }) ?? "";
                  if (U in C) {
                    let q = C[U];
                    return {
                      [U]: await Y.read(q, E[U].body)
                    }
                  } else return {
                    $unknown: E
                  }
                })
              } else I[X] = (0, wz4.sdkStreamMixin)(B.body);
            else if (B.body) {
              let D = await d4A(B.body, Q);
              if (D.byteLength > 0) I[X] = await Y.read(V, D)
            }
          } else if (F.httpHeader) {
            let K = String(F.httpHeader).toLowerCase(),
              D = B.headers[K];
            if (D != null)
              if (V.isListSchema()) {
                let H = V.getValueSchema(),
                  C;
                if (H.isTimestampSchema() && H.getSchema() === hfA.SCHEMA.TIMESTAMP_DEFAULT) C = (0, U0Q.splitEvery)(D, ",", 2);
                else C = (0, U0Q.splitHeader)(D);
                let E = [];
                for (let U of C) E.push(await Y.read([H, {
                  httpHeader: K
                }], U.trim()));
                I[X] = E
              } else I[X] = await Y.read(V, D)
          } else if (F.httpPrefixHeaders !== void 0) {
            I[X] = {};
            for (let [K, D] of Object.entries(B.headers))
              if (K.startsWith(F.httpPrefixHeaders)) I[X][K.slice(F.httpPrefixHeaders.length)] = await Y.read([V.getValueSchema(), {
                httpHeader: K
              }], D)
          } else if (F.httpResponseCode) I[X] = B.statusCode;
          else W.push(X)
        }
        return W
      }
    },
    qz4 = class extends M0Q {
      async serializeRequest(A, Q, B) {
        let G = this.serializer,
          Z = {},
          I = {},
          Y = await B.endpoint(),
          J = cDA.NormalizedSchema.of(A?.input),
          W = J.getSchema(),
          X = !1,
          V, F = new $z4.HttpRequest({
            protocol: "",
            hostname: "",
            port: void 0,
            path: "",
            fragment: void 0,
            query: Z,
            headers: I,
            body: void 0
          });
        if (Y) {
          this.updateServiceEndpoint(F, Y), this.setHostPrefix(F, A, Q);
          let D = cDA.NormalizedSchema.translateTraits(A.traits);
          if (D.http) {
            F.method = D.http[0];
            let [H, C] = D.http[1].split("?");
            if (F.path == "/") F.path = H;
            else F.path += H;
            let E = new URLSearchParams(C ?? "");
            Object.assign(Z, Object.fromEntries(E))
          }
        }
        let K = {
          ...Q
        };
        for (let D of Object.keys(K)) {
          let H = J.getMemberSchema(D);
          if (H === void 0) continue;
          let C = H.getMergedTraits(),
            E = K[D];
          if (C.httpPayload)
            if (H.isStreaming())
              if (H.isStructSchema()) throw Error("serialization of event streams is not yet implemented");
              else V = E;
          else G.write(H, E), V = G.flush();
          else if (C.httpLabel) {
            G.write(H, E);
            let U = G.flush();
            if (F.path.includes(`{${D}+}`)) F.path = F.path.replace(`{${D}+}`, U.split("/").map(lDA).join("/"));
            else if (F.path.includes(`{${D}}`)) F.path = F.path.replace(`{${D}}`, lDA(U));
            delete K[D]
          } else if (C.httpHeader) G.write(H, E), I[C.httpHeader.toLowerCase()] = String(G.flush()), delete K[D];
          else if (typeof C.httpPrefixHeaders === "string") {
            for (let [U, q] of Object.entries(E)) {
              let w = C.httpPrefixHeaders + U;
              G.write([H.getValueSchema(), {
                httpHeader: w
              }], q), I[w.toLowerCase()] = G.flush()
            }
            delete K[D]
          } else if (C.httpQuery || C.httpQueryParams) this.serializeQuery(H, E, Z), delete K[D];
          else X = !0
        }
        if (X && Q) G.write(W, K), V = G.flush();
        return F.headers = I, F.query = Z, F.body = V, F
      }
      serializeQuery(A, Q, B) {
        let G = this.serializer,
          Z = A.getMergedTraits();
        if (Z.httpQueryParams) {
          for (let [I, Y] of Object.entries(Q))
            if (!(I in B)) this.serializeQuery(cDA.NormalizedSchema.of([A.getValueSchema(), {
              ...Z,
              httpQuery: I,
              httpQueryParams: void 0
            }]), Y, B);
          return
        }
        if (A.isListSchema()) {
          let I = !!A.getMergedTraits().sparse,
            Y = [];
          for (let J of Q) {
            G.write([A.getValueSchema(), Z], J);
            let W = G.flush();
            if (I || W !== void 0) Y.push(W)
          }
          B[Z.httpQuery] = Y
        } else G.write([A, Z], Q), B[Z.httpQuery] = G.flush()
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = cDA.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let W = await d4A(B.body, Q);
          if (W.byteLength > 0) Object.assign(I, await G.read(cDA.SCHEMA.DOCUMENT, W));
          throw await this.handleError(A, Q, B, I, this.deserializeMetadata(B)), Error("@smithy/core/protocols - HTTP Protocol error handler failed to throw.")
        }
        for (let W in B.headers) {
          let X = B.headers[W];
          delete B.headers[W], B.headers[W.toLowerCase()] = X
        }
        let Y = await this.deserializeHttpMessage(Z, Q, B, I);
        if (Y.length) {
          let W = await d4A(B.body, Q);
          if (W.byteLength > 0) {
            let X = await G.read(Z, W);
            for (let V of Y) I[V] = X[V]
          }
        }
        return {
          $metadata: this.deserializeMetadata(B),
          ...I
        }
      }
    },
    nU1 = b4(),
    Nz4 = Sr(),
    Lz4 = class extends M0Q {
      async serializeRequest(A, Q, B) {
        let G = this.serializer,
          Z = {},
          I = {},
          Y = await B.endpoint(),
          W = nU1.NormalizedSchema.of(A?.input).getSchema(),
          X, V = new Nz4.HttpRequest({
            protocol: "",
            hostname: "",
            port: void 0,
            path: "/",
            fragment: void 0,
            query: Z,
            headers: I,
            body: void 0
          });
        if (Y) this.updateServiceEndpoint(V, Y), this.setHostPrefix(V, A, Q);
        let F = {
          ...Q
        };
        if (Q) G.write(W, F), X = G.flush();
        return V.headers = I, V.query = Z, V.body = X, V.method = "POST", V
      }
      async deserializeResponse(A, Q, B) {
        let G = this.deserializer,
          Z = nU1.NormalizedSchema.of(A.output),
          I = {};
        if (B.statusCode >= 300) {
          let W = await d4A(B.body, Q);
          if (W.byteLength > 0) Object.assign(I, await G.read(nU1.SCHEMA.DOCUMENT, W));
          throw await this.handleError(A, Q, B, I, this.deserializeMetadata(B)), Error("@smithy/core/protocols - RPC Protocol error handler failed to throw.")
        }
        for (let W in B.headers) {
          let X = B.headers[W];
          delete B.headers[W], B.headers[W.toLowerCase()] = X
        }
        let Y = await d4A(B.body, Q);
        if (Y.byteLength > 0) Object.assign(I, await G.read(Z, Y));
        return {
          $metadata: this.deserializeMetadata(B),
          ...I
        }
      }
    },
    Mz4 = Sr(),
    O0Q = (A, Q, B, G, Z, I) => {
      if (Q != null && Q[B] !== void 0) {
        let Y = G();
        if (Y.length <= 0) throw Error("Empty value provided for input HTTP label: " + B + ".");
        A = A.replace(Z, I ? Y.split("/").map((J) => lDA(J)).join("/") : lDA(Y))
      } else throw Error("No value provided for input HTTP label: " + B + ".");
      return A
    };

  function Oz4(A, Q) {
    return new R0Q(A, Q)
  }
  var R0Q = class {
      constructor(A, Q) {
        this.input = A, this.context = Q, this.query = {}, this.method = "", this.headers = {}, this.path = "", this.body = null, this.hostname = "", this.resolvePathStack = []
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
        return new Mz4.HttpRequest({
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
          this.path = O0Q(Z, this.input, A, Q, B, G)
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
    },
    gfA = b4(),
    m4A = s6(),
    w0Q = lU1(),
    Rz4 = O2(),
    pDA = b4();

  function rU1(A, Q) {
    if (Q.timestampFormat.useTrait) {
      if (A.isTimestampSchema() && (A.getSchema() === pDA.SCHEMA.TIMESTAMP_DATE_TIME || A.getSchema() === pDA.SCHEMA.TIMESTAMP_HTTP_DATE || A.getSchema() === pDA.SCHEMA.TIMESTAMP_EPOCH_SECONDS)) return A.getSchema()
    }
    let {
      httpLabel: B,
      httpPrefixHeaders: G,
      httpHeader: Z,
      httpQuery: I
    } = A.getMergedTraits();
    return (Q.httpBindings ? typeof G === "string" || Boolean(Z) ? pDA.SCHEMA.TIMESTAMP_HTTP_DATE : Boolean(I) || Boolean(B) ? pDA.SCHEMA.TIMESTAMP_DATE_TIME : void 0 : void 0) ?? Q.timestampFormat.default
  }
  var T0Q = class {
      constructor(A) {
        this.settings = A
      }
      setSerdeContext(A) {
        this.serdeContext = A
      }
      read(A, Q) {
        let B = gfA.NormalizedSchema.of(A);
        if (B.isListSchema()) return (0, m4A.splitHeader)(Q).map((G) => this.read(B.getValueSchema(), G));
        if (B.isBlobSchema()) return (this.serdeContext?.base64Decoder ?? w0Q.fromBase64)(Q);
        if (B.isTimestampSchema()) switch (rU1(B, this.settings)) {
          case gfA.SCHEMA.TIMESTAMP_DATE_TIME:
            return (0, m4A.parseRfc3339DateTimeWithOffset)(Q);
          case gfA.SCHEMA.TIMESTAMP_HTTP_DATE:
            return (0, m4A.parseRfc7231DateTime)(Q);
          case gfA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
            return (0, m4A.parseEpochTimestamp)(Q);
          default:
            return console.warn("Missing timestamp format, parsing value with Date constructor:", Q), new Date(Q)
        }
        if (B.isStringSchema()) {
          let G = B.getMergedTraits().mediaType,
            Z = Q;
          if (G) {
            if (B.getMergedTraits().httpHeader) Z = this.base64ToUtf8(Z);
            if (G === "application/json" || G.endsWith("+json")) Z = m4A.LazyJsonString.from(Z);
            return Z
          }
        }
        switch (!0) {
          case B.isNumericSchema():
            return Number(Q);
          case B.isBigIntegerSchema():
            return BigInt(Q);
          case B.isBigDecimalSchema():
            return new m4A.NumericValue(Q, "bigDecimal");
          case B.isBooleanSchema():
            return String(Q).toLowerCase() === "true"
        }
        return Q
      }
      base64ToUtf8(A) {
        return (this.serdeContext?.utf8Encoder ?? Rz4.toUtf8)((this.serdeContext?.base64Decoder ?? w0Q.fromBase64)(A))
      }
    },
    Tz4 = b4(),
    q0Q = O2(),
    Pz4 = class {
      constructor(A, Q) {
        this.codecDeserializer = A, this.stringDeserializer = new T0Q(Q)
      }
      setSerdeContext(A) {
        this.stringDeserializer.setSerdeContext(A), this.codecDeserializer.setSerdeContext(A), this.serdeContext = A
      }
      read(A, Q) {
        let B = Tz4.NormalizedSchema.of(A),
          G = B.getMergedTraits(),
          Z = this.serdeContext?.utf8Encoder ?? q0Q.toUtf8;
        if (G.httpHeader || G.httpResponseCode) return this.stringDeserializer.read(B, Z(Q));
        if (G.httpPayload) {
          if (B.isBlobSchema()) {
            let I = this.serdeContext?.utf8Decoder ?? q0Q.fromUtf8;
            if (typeof Q === "string") return I(Q);
            return Q
          } else if (B.isStringSchema()) {
            if ("byteLength" in Q) return Z(Q);
            return Q
          }
        }
        return this.codecDeserializer.read(B, Q)
      }
    },
    jz4 = b4(),
    ufA = b4(),
    aU1 = s6(),
    N0Q = lU1(),
    P0Q = class {
      constructor(A) {
        this.settings = A, this.stringBuffer = "", this.serdeContext = void 0
      }
      setSerdeContext(A) {
        this.serdeContext = A
      }
      write(A, Q) {
        let B = ufA.NormalizedSchema.of(A);
        switch (typeof Q) {
          case "object":
            if (Q === null) {
              this.stringBuffer = "null";
              return
            }
            if (B.isTimestampSchema()) {
              if (!(Q instanceof Date)) throw Error(`@smithy/core/protocols - received non-Date value ${Q} when schema expected Date in ${B.getName(!0)}`);
              switch (rU1(B, this.settings)) {
                case ufA.SCHEMA.TIMESTAMP_DATE_TIME:
                  this.stringBuffer = Q.toISOString().replace(".000Z", "Z");
                  break;
                case ufA.SCHEMA.TIMESTAMP_HTTP_DATE:
                  this.stringBuffer = (0, aU1.dateToUtcString)(Q);
                  break;
                case ufA.SCHEMA.TIMESTAMP_EPOCH_SECONDS:
                  this.stringBuffer = String(Q.getTime() / 1000);
                  break;
                default:
                  console.warn("Missing timestamp format, using epoch seconds", Q), this.stringBuffer = String(Q.getTime() / 1000)
              }
              return
            }
            if (B.isBlobSchema() && "byteLength" in Q) {
              this.stringBuffer = (this.serdeContext?.base64Encoder ?? N0Q.toBase64)(Q);
              return
            }
            if (B.isListSchema() && Array.isArray(Q)) {
              let I = "";
              for (let Y of Q) {
                this.write([B.getValueSchema(), B.getMergedTraits()], Y);
                let J = this.flush(),
                  W = B.getValueSchema().isTimestampSchema() ? J : (0, aU1.quoteHeader)(J);
                if (I !== "") I += ", ";
                I += W
              }
              this.stringBuffer = I;
              return
            }
            this.stringBuffer = JSON.stringify(Q, null, 2);
            break;
          case "string":
            let G = B.getMergedTraits().mediaType,
              Z = Q;
            if (G) {
              if (G === "application/json" || G.endsWith("+json")) Z = aU1.LazyJsonString.from(Z);
              if (B.getMergedTraits().httpHeader) {
                this.stringBuffer = (this.serdeContext?.base64Encoder ?? N0Q.toBase64)(Z.toString());
                return
              }
            }
            this.stringBuffer = Q;
            break;
          default:
            this.stringBuffer = String(Q)
        }
      }
      flush() {
        let A = this.stringBuffer;
        return this.stringBuffer = "", A
      }
    },
    Sz4 = class {
      constructor(A, Q, B = new P0Q(Q)) {
        this.codecSerializer = A, this.stringSerializer = B
      }
      setSerdeContext(A) {
        this.codecSerializer.setSerdeContext(A), this.stringSerializer.setSerdeContext(A)
      }
      write(A, Q) {
        let B = jz4.NormalizedSchema.of(A),
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
})
// @from(Start 2395800, End 2405799)
iB = z((MC7, d0Q) => {
  var {
    defineProperty: dfA,
    getOwnPropertyDescriptor: _z4,
    getOwnPropertyNames: kz4
  } = Object, yz4 = Object.prototype.hasOwnProperty, gI = (A, Q) => dfA(A, "name", {
    value: Q,
    configurable: !0
  }), xz4 = (A, Q) => {
    for (var B in Q) dfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vz4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kz4(Q))
        if (!yz4.call(A, Z) && Z !== B) dfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _z4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bz4 = (A) => vz4(dfA({}, "__esModule", {
    value: !0
  }), A), S0Q = {};
  xz4(S0Q, {
    DefaultIdentityProviderConfig: () => sz4,
    EXPIRATION_MS: () => u0Q,
    HttpApiKeyAuthSigner: () => rz4,
    HttpBearerAuthSigner: () => oz4,
    NoAuthSigner: () => tz4,
    createIsIdentityExpiredFunction: () => g0Q,
    createPaginator: () => f0Q,
    doesIdentityRequireRefresh: () => m0Q,
    getHttpAuthSchemeEndpointRuleSetPlugin: () => gz4,
    getHttpAuthSchemePlugin: () => mz4,
    getHttpSigningPlugin: () => pz4,
    getSmithyContext: () => fz4,
    httpAuthSchemeEndpointRuleSetMiddlewareOptions: () => y0Q,
    httpAuthSchemeMiddleware: () => oU1,
    httpAuthSchemeMiddlewareOptions: () => x0Q,
    httpSigningMiddleware: () => v0Q,
    httpSigningMiddlewareOptions: () => b0Q,
    isIdentityExpired: () => ez4,
    memoizeIdentityProvider: () => AU4,
    normalizeProvider: () => lz4,
    requestBuilder: () => az4.requestBuilder,
    setFeature: () => h0Q
  });
  d0Q.exports = bz4(S0Q);
  var mfA = WU1(),
    fz4 = gI((A) => A[mfA.SMITHY_CONTEXT_KEY] || (A[mfA.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
    _0Q = w7(),
    hz4 = gI((A, Q) => {
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
    }, "resolveAuthOptions");

  function k0Q(A) {
    let Q = new Map;
    for (let B of A) Q.set(B.schemeId, B);
    return Q
  }
  gI(k0Q, "convertHttpAuthSchemesToMap");
  var oU1 = gI((A, Q) => (B, G) => async (Z) => {
      let I = A.httpAuthSchemeProvider(await Q.httpAuthSchemeParametersProvider(A, G, Z.input)),
        Y = A.authSchemePreference ? await A.authSchemePreference() : [],
        J = hz4(I, Y),
        W = k0Q(A.httpAuthSchemes),
        X = (0, _0Q.getSmithyContext)(G),
        V = [];
      for (let F of J) {
        let K = W.get(F.schemeId);
        if (!K) {
          V.push(`HttpAuthScheme \`${F.schemeId}\` was not enabled for this service.`);
          continue
        }
        let D = K.identityProvider(await Q.identityProviderConfigProvider(A));
        if (!D) {
          V.push(`HttpAuthScheme \`${F.schemeId}\` did not have an IdentityProvider configured.`);
          continue
        }
        let {
          identityProperties: H = {},
          signingProperties: C = {}
        } = F.propertiesExtractor?.(A, G) || {};
        F.identityProperties = Object.assign(F.identityProperties || {}, H), F.signingProperties = Object.assign(F.signingProperties || {}, C), X.selectedHttpAuthScheme = {
          httpAuthOption: F,
          identity: await D(F.identityProperties),
          signer: K.signer
        };
        break
      }
      if (!X.selectedHttpAuthScheme) throw Error(V.join(`
`));
      return B(Z)
    }, "httpAuthSchemeMiddleware"),
    y0Q = {
      step: "serialize",
      tags: ["HTTP_AUTH_SCHEME"],
      name: "httpAuthSchemeMiddleware",
      override: !0,
      relation: "before",
      toMiddleware: "endpointV2Middleware"
    },
    gz4 = gI((A, {
      httpAuthSchemeParametersProvider: Q,
      identityProviderConfigProvider: B
    }) => ({
      applyToStack: (G) => {
        G.addRelativeTo(oU1(A, {
          httpAuthSchemeParametersProvider: Q,
          identityProviderConfigProvider: B
        }), y0Q)
      }
    }), "getHttpAuthSchemeEndpointRuleSetPlugin"),
    uz4 = GZ(),
    x0Q = {
      step: "serialize",
      tags: ["HTTP_AUTH_SCHEME"],
      name: "httpAuthSchemeMiddleware",
      override: !0,
      relation: "before",
      toMiddleware: uz4.serializerMiddlewareOption.name
    },
    mz4 = gI((A, {
      httpAuthSchemeParametersProvider: Q,
      identityProviderConfigProvider: B
    }) => ({
      applyToStack: (G) => {
        G.addRelativeTo(oU1(A, {
          httpAuthSchemeParametersProvider: Q,
          identityProviderConfigProvider: B
        }), x0Q)
      }
    }), "getHttpAuthSchemePlugin"),
    tU1 = Sr(),
    dz4 = gI((A) => (Q) => {
      throw Q
    }, "defaultErrorHandler"),
    cz4 = gI((A, Q) => {}, "defaultSuccessHandler"),
    v0Q = gI((A) => (Q, B) => async (G) => {
      if (!tU1.HttpRequest.isInstance(G.request)) return Q(G);
      let I = (0, _0Q.getSmithyContext)(B).selectedHttpAuthScheme;
      if (!I) throw Error("No HttpAuthScheme was selected: unable to sign request");
      let {
        httpAuthOption: {
          signingProperties: Y = {}
        },
        identity: J,
        signer: W
      } = I, X = await Q({
        ...G,
        request: await W.sign(G.request, J, Y)
      }).catch((W.errorHandler || dz4)(Y));
      return (W.successHandler || cz4)(X.response, Y), X
    }, "httpSigningMiddleware"),
    b0Q = {
      step: "finalizeRequest",
      tags: ["HTTP_SIGNING"],
      name: "httpSigningMiddleware",
      aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
      override: !0,
      relation: "after",
      toMiddleware: "retryMiddleware"
    },
    pz4 = gI((A) => ({
      applyToStack: (Q) => {
        Q.addRelativeTo(v0Q(A), b0Q)
      }
    }), "getHttpSigningPlugin"),
    lz4 = gI((A) => {
      if (typeof A === "function") return A;
      let Q = Promise.resolve(A);
      return () => Q
    }, "normalizeProvider"),
    iz4 = gI(async (A, Q, B, G = (I) => I, ...Z) => {
      let I = new A(B);
      return I = G(I) ?? I, await Q.send(I, ...Z)
    }, "makePagedClientRequest");

  function f0Q(A, Q, B, G, Z) {
    return gI(async function*(Y, J, ...W) {
      let X = J,
        V = Y.startingToken ?? X[B],
        F = !0,
        K;
      while (F) {
        if (X[B] = V, Z) X[Z] = X[Z] ?? Y.pageSize;
        if (Y.client instanceof A) K = await iz4(Q, Y.client, J, Y.withCommand, ...W);
        else throw Error(`Invalid client, expected instance of ${A.name}`);
        yield K;
        let D = V;
        V = nz4(K, G), F = !!(V && (!Y.stopOnSameToken || V !== D))
      }
      return
    }, "paginateOperation")
  }
  gI(f0Q, "createPaginator");
  var nz4 = gI((A, Q) => {
      let B = A,
        G = Q.split(".");
      for (let Z of G) {
        if (!B || typeof B !== "object") return;
        B = B[Z]
      }
      return B
    }, "get"),
    az4 = w5();

  function h0Q(A, Q, B) {
    if (!A.__smithy_context) A.__smithy_context = {
      features: {}
    };
    else if (!A.__smithy_context.features) A.__smithy_context.features = {};
    A.__smithy_context.features[Q] = B
  }
  gI(h0Q, "setFeature");
  var sz4 = class {
      constructor(A) {
        this.authSchemes = new Map;
        for (let [Q, B] of Object.entries(A))
          if (B !== void 0) this.authSchemes.set(Q, B)
      }
      static {
        gI(this, "DefaultIdentityProviderConfig")
      }
      getIdentityProvider(A) {
        return this.authSchemes.get(A)
      }
    },
    rz4 = class {
      static {
        gI(this, "HttpApiKeyAuthSigner")
      }
      async sign(A, Q, B) {
        if (!B) throw Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
        if (!B.name) throw Error("request could not be signed with `apiKey` since the `name` signer property is missing");
        if (!B.in) throw Error("request could not be signed with `apiKey` since the `in` signer property is missing");
        if (!Q.apiKey) throw Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
        let G = tU1.HttpRequest.clone(A);
        if (B.in === mfA.HttpApiKeyAuthLocation.QUERY) G.query[B.name] = Q.apiKey;
        else if (B.in === mfA.HttpApiKeyAuthLocation.HEADER) G.headers[B.name] = B.scheme ? `${B.scheme} ${Q.apiKey}` : Q.apiKey;
        else throw Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + B.in + "`");
        return G
      }
    },
    oz4 = class {
      static {
        gI(this, "HttpBearerAuthSigner")
      }
      async sign(A, Q, B) {
        let G = tU1.HttpRequest.clone(A);
        if (!Q.token) throw Error("request could not be signed with `token` since the `token` is not defined");
        return G.headers.Authorization = `Bearer ${Q.token}`, G
      }
    },
    tz4 = class {
      static {
        gI(this, "NoAuthSigner")
      }
      async sign(A, Q, B) {
        return A
      }
    },
    g0Q = gI((A) => (Q) => m0Q(Q) && Q.expiration.getTime() - Date.now() < A, "createIsIdentityExpiredFunction"),
    u0Q = 300000,
    ez4 = g0Q(u0Q),
    m0Q = gI((A) => A.expiration !== void 0, "doesIdentityRequireRefresh"),
    AU4 = gI((A, Q, B) => {
      if (A === void 0) return;
      let G = typeof A !== "function" ? async () => Promise.resolve(A): A, Z, I, Y, J = !1, W = gI(async (X) => {
        if (!I) I = G(X);
        try {
          Z = await I, Y = !0, J = !1
        } finally {
          I = void 0
        }
        return Z
      }, "coalesceProvider");
      if (Q === void 0) return async (X) => {
        if (!Y || X?.forceRefresh) Z = await W(X);
        return Z
      };
      return async (X) => {
        if (!Y || X?.forceRefresh) Z = await W(X);
        if (J) return Z;
        if (!B(Z)) return J = !0, Z;
        if (Q(Z)) return await W(X), Z;
        return Z
      }
    }, "memoizeIdentityProvider")
})
// @from(Start 2405805, End 2408588)
t0Q = z((jC7, o0Q) => {
  var {
    defineProperty: cfA,
    getOwnPropertyDescriptor: QU4,
    getOwnPropertyNames: BU4
  } = Object, GU4 = Object.prototype.hasOwnProperty, pfA = (A, Q) => cfA(A, "name", {
    value: Q,
    configurable: !0
  }), ZU4 = (A, Q) => {
    for (var B in Q) cfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, IU4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of BU4(Q))
        if (!GU4.call(A, Z) && Z !== B) cfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = QU4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, YU4 = (A) => IU4(cfA({}, "__esModule", {
    value: !0
  }), A), c0Q = {};
  ZU4(c0Q, {
    AlgorithmId: () => n0Q,
    EndpointURLScheme: () => i0Q,
    FieldPosition: () => a0Q,
    HttpApiKeyAuthLocation: () => l0Q,
    HttpAuthLocation: () => p0Q,
    IniSectionType: () => s0Q,
    RequestHandlerProtocol: () => r0Q,
    SMITHY_CONTEXT_KEY: () => FU4,
    getDefaultClientConfiguration: () => XU4,
    resolveDefaultRuntimeConfig: () => VU4
  });
  o0Q.exports = YU4(c0Q);
  var p0Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(p0Q || {}),
    l0Q = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(l0Q || {}),
    i0Q = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(i0Q || {}),
    n0Q = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(n0Q || {}),
    JU4 = pfA((A) => {
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
    WU4 = pfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    XU4 = pfA((A) => {
      return JU4(A)
    }, "getDefaultClientConfiguration"),
    VU4 = pfA((A) => {
      return WU4(A)
    }, "resolveDefaultRuntimeConfig"),
    a0Q = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(a0Q || {}),
    FU4 = "__smithy_context",
    s0Q = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(s0Q || {}),
    r0Q = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(r0Q || {})
})
// @from(Start 2408594, End 2420809)
FI = z((SC7, JQQ) => {
  var {
    defineProperty: lfA,
    getOwnPropertyDescriptor: KU4,
    getOwnPropertyNames: DU4
  } = Object, HU4 = Object.prototype.hasOwnProperty, YG = (A, Q) => lfA(A, "name", {
    value: Q,
    configurable: !0
  }), CU4 = (A, Q) => {
    for (var B in Q) lfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, EU4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of DU4(Q))
        if (!HU4.call(A, Z) && Z !== B) lfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = KU4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, zU4 = (A) => EU4(lfA({}, "__esModule", {
    value: !0
  }), A), e0Q = {};
  CU4(e0Q, {
    EndpointCache: () => UU4,
    EndpointError: () => lz,
    customEndpointFunctions: () => A$1,
    isIpAddress: () => AQQ,
    isValidHostLabel: () => B$1,
    resolveEndpoint: () => fU4
  });
  JQQ.exports = zU4(e0Q);
  var UU4 = class {
      constructor({
        size: A,
        params: Q
      }) {
        if (this.data = new Map, this.parameters = [], this.capacity = A ?? 50, Q) this.parameters = Q
      }
      static {
        YG(this, "EndpointCache")
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
                value: I,
                done: Y
              } = G.next();
              if (this.data.delete(I), Y || ++Z > 10) break
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
    },
    $U4 = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"),
    AQQ = YG((A) => $U4.test(A) || A.startsWith("[") && A.endsWith("]"), "isIpAddress"),
    wU4 = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"),
    B$1 = YG((A, Q = !1) => {
      if (!Q) return wU4.test(A);
      let B = A.split(".");
      for (let G of B)
        if (!B$1(G)) return !1;
      return !0
    }, "isValidHostLabel"),
    A$1 = {},
    iDA = "endpoints";

  function Nv(A) {
    if (typeof A !== "object" || A == null) return A;
    if ("ref" in A) return `$${Nv(A.ref)}`;
    if ("fn" in A) return `${A.fn}(${(A.argv||[]).map(Nv).join(", ")})`;
    return JSON.stringify(A, null, 2)
  }
  YG(Nv, "toDebugString");
  var lz = class extends Error {
      static {
        YG(this, "EndpointError")
      }
      constructor(A) {
        super(A);
        this.name = "EndpointError"
      }
    },
    qU4 = YG((A, Q) => A === Q, "booleanEquals"),
    NU4 = YG((A) => {
      let Q = A.split("."),
        B = [];
      for (let G of Q) {
        let Z = G.indexOf("[");
        if (Z !== -1) {
          if (G.indexOf("]") !== G.length - 1) throw new lz(`Path: '${A}' does not end with ']'`);
          let I = G.slice(Z + 1, -1);
          if (Number.isNaN(parseInt(I))) throw new lz(`Invalid array index: '${I}' in path: '${A}'`);
          if (Z !== 0) B.push(G.slice(0, Z));
          B.push(I)
        } else B.push(G)
      }
      return B
    }, "getAttrPathList"),
    QQQ = YG((A, Q) => NU4(Q).reduce((B, G) => {
      if (typeof B !== "object") throw new lz(`Index '${G}' in '${Q}' not found in '${JSON.stringify(A)}'`);
      else if (Array.isArray(B)) return B[parseInt(G)];
      return B[G]
    }, A), "getAttr"),
    LU4 = YG((A) => A != null, "isSet"),
    MU4 = YG((A) => !A, "not"),
    Q$1 = t0Q(),
    eU1 = {
      [Q$1.EndpointURLScheme.HTTP]: 80,
      [Q$1.EndpointURLScheme.HTTPS]: 443
    },
    OU4 = YG((A) => {
      let Q = (() => {
        try {
          if (A instanceof URL) return A;
          if (typeof A === "object" && "hostname" in A) {
            let {
              hostname: K,
              port: D,
              protocol: H = "",
              path: C = "",
              query: E = {}
            } = A, U = new URL(`${H}//${K}${D?`:${D}`:""}${C}`);
            return U.search = Object.entries(E).map(([q, w]) => `${q}=${w}`).join("&"), U
          }
          return new URL(A)
        } catch (K) {
          return null
        }
      })();
      if (!Q) return console.error(`Unable to parse ${JSON.stringify(A)} as a whatwg URL.`), null;
      let B = Q.href,
        {
          host: G,
          hostname: Z,
          pathname: I,
          protocol: Y,
          search: J
        } = Q;
      if (J) return null;
      let W = Y.slice(0, -1);
      if (!Object.values(Q$1.EndpointURLScheme).includes(W)) return null;
      let X = AQQ(Z),
        V = B.includes(`${G}:${eU1[W]}`) || typeof A === "string" && A.includes(`${G}:${eU1[W]}`),
        F = `${G}${V?`:${eU1[W]}`:""}`;
      return {
        scheme: W,
        authority: F,
        path: I,
        normalizedPath: I.endsWith("/") ? I : `${I}/`,
        isIp: X
      }
    }, "parseURL"),
    RU4 = YG((A, Q) => A === Q, "stringEquals"),
    TU4 = YG((A, Q, B, G) => {
      if (Q >= B || A.length < B) return null;
      if (!G) return A.substring(Q, B);
      return A.substring(A.length - B, A.length - Q)
    }, "substring"),
    PU4 = YG((A) => encodeURIComponent(A).replace(/[!*'()]/g, (Q) => `%${Q.charCodeAt(0).toString(16).toUpperCase()}`), "uriEncode"),
    jU4 = {
      booleanEquals: qU4,
      getAttr: QQQ,
      isSet: LU4,
      isValidHostLabel: B$1,
      not: MU4,
      parseURL: OU4,
      stringEquals: RU4,
      substring: TU4,
      uriEncode: PU4
    },
    BQQ = YG((A, Q) => {
      let B = [],
        G = {
          ...Q.endpointParams,
          ...Q.referenceRecord
        },
        Z = 0;
      while (Z < A.length) {
        let I = A.indexOf("{", Z);
        if (I === -1) {
          B.push(A.slice(Z));
          break
        }
        B.push(A.slice(Z, I));
        let Y = A.indexOf("}", I);
        if (Y === -1) {
          B.push(A.slice(I));
          break
        }
        if (A[I + 1] === "{" && A[Y + 1] === "}") B.push(A.slice(I + 1, Y)), Z = Y + 2;
        let J = A.substring(I + 1, Y);
        if (J.includes("#")) {
          let [W, X] = J.split("#");
          B.push(QQQ(G[W], X))
        } else B.push(G[J]);
        Z = Y + 1
      }
      return B.join("")
    }, "evaluateTemplate"),
    SU4 = YG(({
      ref: A
    }, Q) => {
      return {
        ...Q.endpointParams,
        ...Q.referenceRecord
      } [A]
    }, "getReferenceValue"),
    ifA = YG((A, Q, B) => {
      if (typeof A === "string") return BQQ(A, B);
      else if (A.fn) return GQQ(A, B);
      else if (A.ref) return SU4(A, B);
      throw new lz(`'${Q}': ${String(A)} is not a string, function or reference.`)
    }, "evaluateExpression"),
    GQQ = YG(({
      fn: A,
      argv: Q
    }, B) => {
      let G = Q.map((I) => ["boolean", "number"].includes(typeof I) ? I : ifA(I, "arg", B)),
        Z = A.split(".");
      if (Z[0] in A$1 && Z[1] != null) return A$1[Z[0]][Z[1]](...G);
      return jU4[A](...G)
    }, "callFunction"),
    _U4 = YG(({
      assign: A,
      ...Q
    }, B) => {
      if (A && A in B.referenceRecord) throw new lz(`'${A}' is already defined in Reference Record.`);
      let G = GQQ(Q, B);
      return B.logger?.debug?.(`${iDA} evaluateCondition: ${Nv(Q)} = ${Nv(G)}`), {
        result: G === "" ? !0 : !!G,
        ...A != null && {
          toAssign: {
            name: A,
            value: G
          }
        }
      }
    }, "evaluateCondition"),
    G$1 = YG((A = [], Q) => {
      let B = {};
      for (let G of A) {
        let {
          result: Z,
          toAssign: I
        } = _U4(G, {
          ...Q,
          referenceRecord: {
            ...Q.referenceRecord,
            ...B
          }
        });
        if (!Z) return {
          result: Z
        };
        if (I) B[I.name] = I.value, Q.logger?.debug?.(`${iDA} assign: ${I.name} := ${Nv(I.value)}`)
      }
      return {
        result: !0,
        referenceRecord: B
      }
    }, "evaluateConditions"),
    kU4 = YG((A, Q) => Object.entries(A).reduce((B, [G, Z]) => ({
      ...B,
      [G]: Z.map((I) => {
        let Y = ifA(I, "Header value entry", Q);
        if (typeof Y !== "string") throw new lz(`Header '${G}' value '${Y}' is not a string`);
        return Y
      })
    }), {}), "getEndpointHeaders"),
    ZQQ = YG((A, Q) => {
      if (Array.isArray(A)) return A.map((B) => ZQQ(B, Q));
      switch (typeof A) {
        case "string":
          return BQQ(A, Q);
        case "object":
          if (A === null) throw new lz(`Unexpected endpoint property: ${A}`);
          return IQQ(A, Q);
        case "boolean":
          return A;
        default:
          throw new lz(`Unexpected endpoint property type: ${typeof A}`)
      }
    }, "getEndpointProperty"),
    IQQ = YG((A, Q) => Object.entries(A).reduce((B, [G, Z]) => ({
      ...B,
      [G]: ZQQ(Z, Q)
    }), {}), "getEndpointProperties"),
    yU4 = YG((A, Q) => {
      let B = ifA(A, "Endpoint URL", Q);
      if (typeof B === "string") try {
        return new URL(B)
      } catch (G) {
        throw console.error(`Failed to construct URL with ${B}`, G), G
      }
      throw new lz(`Endpoint URL must be a string, got ${typeof B}`)
    }, "getEndpointUrl"),
    xU4 = YG((A, Q) => {
      let {
        conditions: B,
        endpoint: G
      } = A, {
        result: Z,
        referenceRecord: I
      } = G$1(B, Q);
      if (!Z) return;
      let Y = {
          ...Q,
          referenceRecord: {
            ...Q.referenceRecord,
            ...I
          }
        },
        {
          url: J,
          properties: W,
          headers: X
        } = G;
      return Q.logger?.debug?.(`${iDA} Resolving endpoint from template: ${Nv(G)}`), {
        ...X != null && {
          headers: kU4(X, Y)
        },
        ...W != null && {
          properties: IQQ(W, Y)
        },
        url: yU4(J, Y)
      }
    }, "evaluateEndpointRule"),
    vU4 = YG((A, Q) => {
      let {
        conditions: B,
        error: G
      } = A, {
        result: Z,
        referenceRecord: I
      } = G$1(B, Q);
      if (!Z) return;
      throw new lz(ifA(G, "Error", {
        ...Q,
        referenceRecord: {
          ...Q.referenceRecord,
          ...I
        }
      }))
    }, "evaluateErrorRule"),
    bU4 = YG((A, Q) => {
      let {
        conditions: B,
        rules: G
      } = A, {
        result: Z,
        referenceRecord: I
      } = G$1(B, Q);
      if (!Z) return;
      return YQQ(G, {
        ...Q,
        referenceRecord: {
          ...Q.referenceRecord,
          ...I
        }
      })
    }, "evaluateTreeRule"),
    YQQ = YG((A, Q) => {
      for (let B of A)
        if (B.type === "endpoint") {
          let G = xU4(B, Q);
          if (G) return G
        } else if (B.type === "error") vU4(B, Q);
      else if (B.type === "tree") {
        let G = bU4(B, Q);
        if (G) return G
      } else throw new lz(`Unknown endpoint rule: ${B}`);
      throw new lz("Rules evaluation failed")
    }, "evaluateRules"),
    fU4 = YG((A, Q) => {
      let {
        endpointParams: B,
        logger: G
      } = Q, {
        parameters: Z,
        rules: I
      } = A;
      Q.logger?.debug?.(`${iDA} Initial EndpointParams: ${Nv(B)}`);
      let Y = Object.entries(Z).filter(([, X]) => X.default != null).map(([X, V]) => [X, V.default]);
      if (Y.length > 0)
        for (let [X, V] of Y) B[X] = B[X] ?? V;
      let J = Object.entries(Z).filter(([, X]) => X.required).map(([X]) => X);
      for (let X of J)
        if (B[X] == null) throw new lz(`Missing required parameter: '${X}'`);
      let W = YQQ(I, {
        endpointParams: B,
        logger: G,
        referenceRecord: {}
      });
      return Q.logger?.debug?.(`${iDA} Resolved endpoint: ${Nv(W)}`), W
    }, "resolveEndpoint")
})
// @from(Start 2420815, End 2432273)
p4A = z((yC7, zQQ) => {
  var {
    defineProperty: nfA,
    getOwnPropertyDescriptor: hU4,
    getOwnPropertyNames: gU4
  } = Object, uU4 = Object.prototype.hasOwnProperty, c4A = (A, Q) => nfA(A, "name", {
    value: Q,
    configurable: !0
  }), mU4 = (A, Q) => {
    for (var B in Q) nfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, dU4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gU4(Q))
        if (!uU4.call(A, Z) && Z !== B) nfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hU4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, cU4 = (A) => dU4(nfA({}, "__esModule", {
    value: !0
  }), A), XQQ = {};
  mU4(XQQ, {
    ConditionObject: () => PZ.ConditionObject,
    DeprecatedObject: () => PZ.DeprecatedObject,
    EndpointError: () => PZ.EndpointError,
    EndpointObject: () => PZ.EndpointObject,
    EndpointObjectHeaders: () => PZ.EndpointObjectHeaders,
    EndpointObjectProperties: () => PZ.EndpointObjectProperties,
    EndpointParams: () => PZ.EndpointParams,
    EndpointResolverOptions: () => PZ.EndpointResolverOptions,
    EndpointRuleObject: () => PZ.EndpointRuleObject,
    ErrorRuleObject: () => PZ.ErrorRuleObject,
    EvaluateOptions: () => PZ.EvaluateOptions,
    Expression: () => PZ.Expression,
    FunctionArgv: () => PZ.FunctionArgv,
    FunctionObject: () => PZ.FunctionObject,
    FunctionReturn: () => PZ.FunctionReturn,
    ParameterObject: () => PZ.ParameterObject,
    ReferenceObject: () => PZ.ReferenceObject,
    ReferenceRecord: () => PZ.ReferenceRecord,
    RuleSetObject: () => PZ.RuleSetObject,
    RuleSetRules: () => PZ.RuleSetRules,
    TreeRuleObject: () => PZ.TreeRuleObject,
    awsEndpointFunctions: () => EQQ,
    getUserAgentPrefix: () => nU4,
    isIpAddress: () => PZ.isIpAddress,
    partition: () => HQQ,
    resolveEndpoint: () => PZ.resolveEndpoint,
    setPartitionInfo: () => CQQ,
    useDefaultPartitionInfo: () => iU4
  });
  zQQ.exports = cU4(XQQ);
  var PZ = FI(),
    VQQ = c4A((A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!VQQ(B)) return !1;
        return !0
      }
      if (!(0, PZ.isValidHostLabel)(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if ((0, PZ.isIpAddress)(A)) return !1;
      return !0
    }, "isVirtualHostableS3Bucket"),
    WQQ = ":",
    pU4 = "/",
    lU4 = c4A((A) => {
      let Q = A.split(WQQ);
      if (Q.length < 6) return null;
      let [B, G, Z, I, Y, ...J] = Q;
      if (B !== "arn" || G === "" || Z === "" || J.join(WQQ) === "") return null;
      let W = J.map((X) => X.split(pU4)).flat();
      return {
        partition: G,
        service: Z,
        region: I,
        accountId: Y,
        resourceId: W
      }
    }, "parseArn"),
    FQQ = {
      partitions: [{
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
          "ap-southeast-7": {
            description: "Asia Pacific (Thailand)"
          },
          "aws-global": {
            description: "AWS Standard global region"
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
            description: "AWS China global region"
          },
          "cn-north-1": {
            description: "China (Beijing)"
          },
          "cn-northwest-1": {
            description: "China (Ningxia)"
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
            description: "AWS GovCloud (US) global region"
          },
          "us-gov-east-1": {
            description: "AWS GovCloud (US-East)"
          },
          "us-gov-west-1": {
            description: "AWS GovCloud (US-West)"
          }
        }
      }, {
        id: "aws-iso",
        outputs: {
          dnsSuffix: "c2s.ic.gov",
          dualStackDnsSuffix: "c2s.ic.gov",
          implicitGlobalRegion: "us-iso-east-1",
          name: "aws-iso",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-global": {
            description: "AWS ISO (US) global region"
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
          dualStackDnsSuffix: "sc2s.sgov.gov",
          implicitGlobalRegion: "us-isob-east-1",
          name: "aws-iso-b",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-b-global": {
            description: "AWS ISOB (US) global region"
          },
          "us-isob-east-1": {
            description: "US ISOB East (Ohio)"
          }
        }
      }, {
        id: "aws-iso-e",
        outputs: {
          dnsSuffix: "cloud.adc-e.uk",
          dualStackDnsSuffix: "cloud.adc-e.uk",
          implicitGlobalRegion: "eu-isoe-west-1",
          name: "aws-iso-e",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-e-global": {
            description: "AWS ISOE (Europe) global region"
          },
          "eu-isoe-west-1": {
            description: "EU ISOE West"
          }
        }
      }, {
        id: "aws-iso-f",
        outputs: {
          dnsSuffix: "csp.hci.ic.gov",
          dualStackDnsSuffix: "csp.hci.ic.gov",
          implicitGlobalRegion: "us-isof-south-1",
          name: "aws-iso-f",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
        regions: {
          "aws-iso-f-global": {
            description: "AWS ISOF global region"
          },
          "us-isof-east-1": {
            description: "US ISOF EAST"
          },
          "us-isof-south-1": {
            description: "US ISOF SOUTH"
          }
        }
      }, {
        id: "aws-eusc",
        outputs: {
          dnsSuffix: "amazonaws.eu",
          dualStackDnsSuffix: "amazonaws.eu",
          implicitGlobalRegion: "eusc-de-east-1",
          name: "aws-eusc",
          supportsDualStack: !1,
          supportsFIPS: !0
        },
        regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
        regions: {
          "eusc-de-east-1": {
            description: "EU (Germany)"
          }
        }
      }],
      version: "1.1"
    },
    KQQ = FQQ,
    DQQ = "",
    HQQ = c4A((A) => {
      let {
        partitions: Q
      } = KQQ;
      for (let G of Q) {
        let {
          regions: Z,
          outputs: I
        } = G;
        for (let [Y, J] of Object.entries(Z))
          if (Y === A) return {
            ...I,
            ...J
          }
      }
      for (let G of Q) {
        let {
          regionRegex: Z,
          outputs: I
        } = G;
        if (new RegExp(Z).test(A)) return {
          ...I
        }
      }
      let B = Q.find((G) => G.id === "aws");
      if (!B) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
      return {
        ...B.outputs
      }
    }, "partition"),
    CQQ = c4A((A, Q = "") => {
      KQQ = A, DQQ = Q
    }, "setPartitionInfo"),
    iU4 = c4A(() => {
      CQQ(FQQ, "")
    }, "useDefaultPartitionInfo"),
    nU4 = c4A(() => DQQ, "getUserAgentPrefix"),
    EQQ = {
      isVirtualHostableS3Bucket: VQQ,
      parseArn: lU4,
      partition: HQQ
    };
  PZ.customEndpointFunctions.aws = EQQ
})
// @from(Start 2432279, End 2449534)
yr = z((xC7, rfA) => {
  var UQQ, $QQ, wQQ, qQQ, NQQ, LQQ, MQQ, OQQ, RQQ, TQQ, PQQ, jQQ, SQQ, afA, Z$1, _QQ, kQQ, yQQ, l4A, xQQ, vQQ, bQQ, fQQ, hQQ, gQQ, uQQ, mQQ, dQQ, sfA, cQQ, pQQ, lQQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof rfA === "object" && typeof xC7 === "object") A(B(Q, B(xC7)));
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
    UQQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, $QQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, wQQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, qQQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, NQQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, LQQ = function(I, Y, J, W, X, V) {
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
    }, MQQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, OQQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, RQQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, TQQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, PQQ = function(I, Y, J, W) {
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
    }, jQQ = function(I, Y) {
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
    }, SQQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) sfA(Y, I, J)
    }, sfA = Object.create ? function(I, Y, J, W) {
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
    }, afA = function(I) {
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
    }, Z$1 = function(I, Y) {
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
    }, _QQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(Z$1(arguments[Y]));
      return I
    }, kQQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, yQQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, l4A = function(I) {
      return this instanceof l4A ? (this.v = I, this) : new l4A(I)
    }, xQQ = function(I, Y, J) {
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
        q.value instanceof l4A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, vQQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: l4A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, bQQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof afA === "function" ? afA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, fQQ = function(I, Y) {
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
    hQQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") sfA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, gQQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, uQQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, mQQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, dQQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, cQQ = function(I, Y, J) {
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
    pQQ = function(I) {
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
    }, lQQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", UQQ), A("__assign", $QQ), A("__rest", wQQ), A("__decorate", qQQ), A("__param", NQQ), A("__esDecorate", LQQ), A("__runInitializers", MQQ), A("__propKey", OQQ), A("__setFunctionName", RQQ), A("__metadata", TQQ), A("__awaiter", PQQ), A("__generator", jQQ), A("__exportStar", SQQ), A("__createBinding", sfA), A("__values", afA), A("__read", Z$1), A("__spread", _QQ), A("__spreadArrays", kQQ), A("__spreadArray", yQQ), A("__await", l4A), A("__asyncGenerator", xQQ), A("__asyncDelegator", vQQ), A("__asyncValues", bQQ), A("__makeTemplateObject", fQQ), A("__importStar", hQQ), A("__importDefault", gQQ), A("__classPrivateFieldGet", uQQ), A("__classPrivateFieldSet", mQQ), A("__classPrivateFieldIn", dQQ), A("__addDisposableResource", cQQ), A("__disposeResources", pQQ), A("__rewriteRelativeImportExtension", lQQ)
  })
})
// @from(Start 2449540, End 2451523)
QL = z((vC7, rQQ) => {
  var {
    defineProperty: ofA,
    getOwnPropertyDescriptor: aU4,
    getOwnPropertyNames: sU4
  } = Object, rU4 = Object.prototype.hasOwnProperty, tfA = (A, Q) => ofA(A, "name", {
    value: Q,
    configurable: !0
  }), oU4 = (A, Q) => {
    for (var B in Q) ofA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, tU4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of sU4(Q))
        if (!rU4.call(A, Z) && Z !== B) ofA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = aU4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, eU4 = (A) => tU4(ofA({}, "__esModule", {
    value: !0
  }), A), iQQ = {};
  oU4(iQQ, {
    emitWarningIfUnsupportedVersion: () => A$4,
    setCredentialFeature: () => nQQ,
    setFeature: () => aQQ,
    setTokenFeature: () => sQQ,
    state: () => I$1
  });
  rQQ.exports = eU4(iQQ);
  var I$1 = {
      warningEmitted: !1
    },
    A$4 = tfA((A) => {
      if (A && !I$1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) I$1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    }, "emitWarningIfUnsupportedVersion");

  function nQQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  tfA(nQQ, "setCredentialFeature");

  function aQQ(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }
  tfA(aQQ, "setFeature");

  function sQQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  tfA(sQQ, "setTokenFeature")
})
// @from(Start 2451529, End 2454521)
j2 = z((bC7, tQQ) => {
  var {
    defineProperty: efA,
    getOwnPropertyDescriptor: Q$4,
    getOwnPropertyNames: B$4
  } = Object, G$4 = Object.prototype.hasOwnProperty, xr = (A, Q) => efA(A, "name", {
    value: Q,
    configurable: !0
  }), Z$4 = (A, Q) => {
    for (var B in Q) efA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, I$4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of B$4(Q))
        if (!G$4.call(A, Z) && Z !== B) efA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Q$4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Y$4 = (A) => I$4(efA({}, "__esModule", {
    value: !0
  }), A), oQQ = {};
  Z$4(oQQ, {
    CredentialsProviderError: () => J$4,
    ProviderError: () => AhA,
    TokenProviderError: () => W$4,
    chain: () => X$4,
    fromStatic: () => V$4,
    memoize: () => F$4
  });
  tQQ.exports = Y$4(oQQ);
  var AhA = class A extends Error {
      constructor(Q, B = !0) {
        let G, Z = !0;
        if (typeof B === "boolean") G = void 0, Z = B;
        else if (B != null && typeof B === "object") G = B.logger, Z = B.tryNextLink ?? !0;
        super(Q);
        this.name = "ProviderError", this.tryNextLink = Z, Object.setPrototypeOf(this, A.prototype), G?.debug?.(`@smithy/property-provider ${Z?"->":"(!)"} ${Q}`)
      }
      static {
        xr(this, "ProviderError")
      }
      static from(Q, B = !0) {
        return Object.assign(new this(Q.message, B), Q)
      }
    },
    J$4 = class A extends AhA {
      constructor(Q, B = !0) {
        super(Q, B);
        this.name = "CredentialsProviderError", Object.setPrototypeOf(this, A.prototype)
      }
      static {
        xr(this, "CredentialsProviderError")
      }
    },
    W$4 = class A extends AhA {
      constructor(Q, B = !0) {
        super(Q, B);
        this.name = "TokenProviderError", Object.setPrototypeOf(this, A.prototype)
      }
      static {
        xr(this, "TokenProviderError")
      }
    },
    X$4 = xr((...A) => async () => {
      if (A.length === 0) throw new AhA("No providers in chain");
      let Q;
      for (let B of A) try {
        return await B()
      } catch (G) {
        if (Q = G, G?.tryNextLink) continue;
        throw G
      }
      throw Q
    }, "chain"),
    V$4 = xr((A) => () => Promise.resolve(A), "fromStatic"),
    F$4 = xr((A, Q, B) => {
      let G, Z, I, Y = !1,
        J = xr(async () => {
          if (!Z) Z = A();
          try {
            G = await Z, I = !0, Y = !1
          } finally {
            Z = void 0
          }
          return G
        }, "coalesceProvider");
      if (Q === void 0) return async (W) => {
        if (!I || W?.forceRefresh) G = await J();
        return G
      };
      return async (W) => {
        if (!I || W?.forceRefresh) G = await J();
        if (Y) return G;
        if (B && !B(G)) return Y = !0, G;
        if (Q(G)) return await J(), G;
        return G
      }
    }, "memoize")
})
// @from(Start 2454527, End 2455480)
QBQ = z((fC7, ABQ) => {
  var {
    defineProperty: QhA,
    getOwnPropertyDescriptor: K$4,
    getOwnPropertyNames: D$4
  } = Object, H$4 = Object.prototype.hasOwnProperty, C$4 = (A, Q) => QhA(A, "name", {
    value: Q,
    configurable: !0
  }), E$4 = (A, Q) => {
    for (var B in Q) QhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, z$4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of D$4(Q))
        if (!H$4.call(A, Z) && Z !== B) QhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = K$4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, U$4 = (A) => z$4(QhA({}, "__esModule", {
    value: !0
  }), A), eQQ = {};
  E$4(eQQ, {
    isArrayBuffer: () => $$4
  });
  ABQ.exports = U$4(eQQ);
  var $$4 = C$4((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 2455486, End 2456539)
IBQ = z((hC7, ZBQ) => {
  var {
    defineProperty: BhA,
    getOwnPropertyDescriptor: w$4,
    getOwnPropertyNames: q$4
  } = Object, N$4 = Object.prototype.hasOwnProperty, Y$1 = (A, Q) => BhA(A, "name", {
    value: Q,
    configurable: !0
  }), L$4 = (A, Q) => {
    for (var B in Q) BhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, M$4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of q$4(Q))
        if (!N$4.call(A, Z) && Z !== B) BhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = w$4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, O$4 = (A) => M$4(BhA({}, "__esModule", {
    value: !0
  }), A), BBQ = {};
  L$4(BBQ, {
    escapeUri: () => GBQ,
    escapeUriPath: () => T$4
  });
  ZBQ.exports = O$4(BBQ);
  var GBQ = Y$1((A) => encodeURIComponent(A).replace(/[!'()*]/g, R$4), "escapeUri"),
    R$4 = Y$1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    T$4 = Y$1((A) => A.split("/").map(GBQ).join("/"), "escapeUriPath")
})
// @from(Start 2456545, End 2473458)
yBQ = z((gC7, kBQ) => {
  var {
    defineProperty: XhA,
    getOwnPropertyDescriptor: P$4,
    getOwnPropertyNames: j$4
  } = Object, S$4 = Object.prototype.hasOwnProperty, rK = (A, Q) => XhA(A, "name", {
    value: Q,
    configurable: !0
  }), _$4 = (A, Q) => {
    for (var B in Q) XhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, k$4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of j$4(Q))
        if (!S$4.call(A, Z) && Z !== B) XhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = P$4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, y$4 = (A) => k$4(XhA({}, "__esModule", {
    value: !0
  }), A), VBQ = {};
  _$4(VBQ, {
    ALGORITHM_IDENTIFIER: () => GhA,
    ALGORITHM_IDENTIFIER_V4A: () => f$4,
    ALGORITHM_QUERY_PARAM: () => FBQ,
    ALWAYS_UNSIGNABLE_HEADERS: () => $BQ,
    AMZ_DATE_HEADER: () => H$1,
    AMZ_DATE_QUERY_PARAM: () => V$1,
    AUTH_HEADER: () => D$1,
    CREDENTIAL_QUERY_PARAM: () => KBQ,
    DATE_HEADER: () => CBQ,
    EVENT_ALGORITHM_IDENTIFIER: () => NBQ,
    EXPIRES_QUERY_PARAM: () => HBQ,
    GENERATED_HEADERS: () => EBQ,
    HOST_HEADER: () => v$4,
    KEY_TYPE_IDENTIFIER: () => C$1,
    MAX_CACHE_SIZE: () => MBQ,
    MAX_PRESIGNED_TTL: () => OBQ,
    PROXY_HEADER_PATTERN: () => wBQ,
    REGION_SET_PARAM: () => x$4,
    SEC_HEADER_PATTERN: () => qBQ,
    SHA256_HEADER: () => WhA,
    SIGNATURE_HEADER: () => zBQ,
    SIGNATURE_QUERY_PARAM: () => F$1,
    SIGNED_HEADERS_QUERY_PARAM: () => DBQ,
    SignatureV4: () => a$4,
    SignatureV4Base: () => _BQ,
    TOKEN_HEADER: () => UBQ,
    TOKEN_QUERY_PARAM: () => K$1,
    UNSIGNABLE_PATTERNS: () => b$4,
    UNSIGNED_PAYLOAD: () => LBQ,
    clearCredentialCache: () => g$4,
    createScope: () => IhA,
    getCanonicalHeaders: () => J$1,
    getCanonicalQuery: () => SBQ,
    getPayloadHash: () => YhA,
    getSigningKey: () => RBQ,
    hasHeader: () => TBQ,
    moveHeadersToQuery: () => jBQ,
    prepareRequest: () => X$1,
    signatureV4aContainer: () => s$4
  });
  kBQ.exports = y$4(VBQ);
  var YBQ = O2(),
    FBQ = "X-Amz-Algorithm",
    KBQ = "X-Amz-Credential",
    V$1 = "X-Amz-Date",
    DBQ = "X-Amz-SignedHeaders",
    HBQ = "X-Amz-Expires",
    F$1 = "X-Amz-Signature",
    K$1 = "X-Amz-Security-Token",
    x$4 = "X-Amz-Region-Set",
    D$1 = "authorization",
    H$1 = V$1.toLowerCase(),
    CBQ = "date",
    EBQ = [D$1, H$1, CBQ],
    zBQ = F$1.toLowerCase(),
    WhA = "x-amz-content-sha256",
    UBQ = K$1.toLowerCase(),
    v$4 = "host",
    $BQ = {
      authorization: !0,
      "cache-control": !0,
      connection: !0,
      expect: !0,
      from: !0,
      "keep-alive": !0,
      "max-forwards": !0,
      pragma: !0,
      referer: !0,
      te: !0,
      trailer: !0,
      "transfer-encoding": !0,
      upgrade: !0,
      "user-agent": !0,
      "x-amzn-trace-id": !0
    },
    wBQ = /^proxy-/,
    qBQ = /^sec-/,
    b$4 = [/^proxy-/i, /^sec-/i],
    GhA = "AWS4-HMAC-SHA256",
    f$4 = "AWS4-ECDSA-P256-SHA256",
    NBQ = "AWS4-HMAC-SHA256-PAYLOAD",
    LBQ = "UNSIGNED-PAYLOAD",
    MBQ = 50,
    C$1 = "aws4_request",
    OBQ = 604800,
    Vd = Jd(),
    h$4 = O2(),
    i4A = {},
    ZhA = [],
    IhA = rK((A, Q, B) => `${A}/${Q}/${B}/${C$1}`, "createScope"),
    RBQ = rK(async (A, Q, B, G, Z) => {
      let I = await JBQ(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,Vd.toHex)(I)}:${Q.sessionToken}`;
      if (Y in i4A) return i4A[Y];
      ZhA.push(Y);
      while (ZhA.length > MBQ) delete i4A[ZhA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, C$1]) J = await JBQ(A, J, W);
      return i4A[Y] = J
    }, "getSigningKey"),
    g$4 = rK(() => {
      ZhA.length = 0, Object.keys(i4A).forEach((A) => {
        delete i4A[A]
      })
    }, "clearCredentialCache"),
    JBQ = rK((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, h$4.toUint8Array)(B)), G.digest()
    }, "hmac"),
    J$1 = rK(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in $BQ || Q?.has(I) || wBQ.test(I) || qBQ.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    u$4 = QBQ(),
    m$4 = O2(),
    YhA = rK(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === WhA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, u$4.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, m$4.toUint8Array)(Q)), (0, Vd.toHex)(await G.digest())
      }
      return LBQ
    }, "getPayloadHash"),
    WBQ = O2(),
    d$4 = class {
      static {
        rK(this, "HeaderFormatter")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = (0, WBQ.fromUtf8)(Z);
          Q.push(Uint8Array.from([I.byteLength]), I, this.formatHeaderValue(A[Z]))
        }
        let B = new Uint8Array(Q.reduce((Z, I) => Z + I.byteLength, 0)),
          G = 0;
        for (let Z of Q) B.set(Z, G), G += Z.byteLength;
        return B
      }
      formatHeaderValue(A) {
        switch (A.type) {
          case "boolean":
            return Uint8Array.from([A.value ? 0 : 1]);
          case "byte":
            return Uint8Array.from([2, A.value]);
          case "short":
            let Q = new DataView(new ArrayBuffer(3));
            return Q.setUint8(0, 3), Q.setInt16(1, A.value, !1), new Uint8Array(Q.buffer);
          case "integer":
            let B = new DataView(new ArrayBuffer(5));
            return B.setUint8(0, 4), B.setInt32(1, A.value, !1), new Uint8Array(B.buffer);
          case "long":
            let G = new Uint8Array(9);
            return G[0] = 5, G.set(A.value.bytes, 1), G;
          case "binary":
            let Z = new DataView(new ArrayBuffer(3 + A.value.byteLength));
            Z.setUint8(0, 6), Z.setUint16(1, A.value.byteLength, !1);
            let I = new Uint8Array(Z.buffer);
            return I.set(A.value, 3), I;
          case "string":
            let Y = (0, WBQ.fromUtf8)(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(p$4.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!c$4.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, Vd.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
    },
    c$4 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    p$4 = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        rK(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) W$1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) W$1(Q);
        return parseInt((0, Vd.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function W$1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  rK(W$1, "negate");
  var TBQ = rK((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    PBQ = nC(),
    jBQ = rK((A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = PBQ.HttpRequest.clone(A);
      for (let Z of Object.keys(B)) {
        let I = Z.toLowerCase();
        if (I.slice(0, 6) === "x-amz-" && !Q.unhoistableHeaders?.has(I) || Q.hoistableHeaders?.has(I)) G[Z] = B[Z], delete B[Z]
      }
      return {
        ...A,
        headers: B,
        query: G
      }
    }, "moveHeadersToQuery"),
    X$1 = rK((A) => {
      A = PBQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (EBQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    XBQ = w7(),
    l$4 = O2(),
    JhA = IBQ(),
    SBQ = rK(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === zBQ) continue;
        let Z = (0, JhA.escapeUri)(G);
        Q.push(Z);
        let I = A[G];
        if (typeof I === "string") B[Z] = `${Z}=${(0,JhA.escapeUri)(I)}`;
        else if (Array.isArray(I)) B[Z] = I.slice(0).reduce((Y, J) => Y.concat([`${Z}=${(0,JhA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    i$4 = rK((A) => n$4(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    n$4 = rK((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    _BQ = class {
      static {
        rK(this, "SignatureV4Base")
      }
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        this.service = G, this.sha256 = Z, this.uriEscapePath = I, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = (0, XBQ.normalizeProvider)(B), this.credentialProvider = (0, XBQ.normalizeProvider)(Q)
      }
      createCanonicalRequest(A, Q, B) {
        let G = Object.keys(Q).sort();
        return `${A.method}
${this.getCanonicalPath(A)}
${SBQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
      }
      async createStringToSign(A, Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, l$4.toUint8Array)(B));
        let I = await Z.digest();
        return `${G}
${A}
${Q}
${(0,Vd.toHex)(I)}`
      }
      getCanonicalPath({
        path: A
      }) {
        if (this.uriEscapePath) {
          let Q = [];
          for (let Z of A.split("/")) {
            if (Z?.length === 0) continue;
            if (Z === ".") continue;
            if (Z === "..") Q.pop();
            else Q.push(Z)
          }
          let B = `${A?.startsWith("/")?"/":""}${Q.join("/")}${Q.length>0&&A?.endsWith("/")?"/":""}`;
          return (0, JhA.escapeUri)(B).replace(/%2F/g, "/")
        }
        return A
      }
      validateResolvedCredentials(A) {
        if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
      formatDate(A) {
        let Q = i$4(A).replace(/[\-:]/g, "");
        return {
          longDate: Q,
          shortDate: Q.slice(0, 8)
        }
      }
      getCanonicalHeaderList(A) {
        return Object.keys(A).sort().join(";")
      }
    },
    a$4 = class extends _BQ {
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        super({
          applyChecksum: A,
          credentials: Q,
          region: B,
          service: G,
          sha256: Z,
          uriEscapePath: I
        });
        this.headerFormatter = new d$4
      }
      static {
        rK(this, "SignatureV4")
      }
      async presign(A, Q = {}) {
        let {
          signingDate: B = new Date,
          expiresIn: G = 3600,
          unsignableHeaders: Z,
          unhoistableHeaders: I,
          signableHeaders: Y,
          hoistableHeaders: J,
          signingRegion: W,
          signingService: X
        } = Q, V = await this.credentialProvider();
        this.validateResolvedCredentials(V);
        let F = W ?? await this.regionProvider(),
          {
            longDate: K,
            shortDate: D
          } = this.formatDate(B);
        if (G > OBQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = IhA(D, F, X ?? this.service),
          C = jBQ(X$1(A), {
            unhoistableHeaders: I,
            hoistableHeaders: J
          });
        if (V.sessionToken) C.query[K$1] = V.sessionToken;
        C.query[FBQ] = GhA, C.query[KBQ] = `${V.accessKeyId}/${H}`, C.query[V$1] = K, C.query[HBQ] = G.toString(10);
        let E = J$1(C, Z, Y);
        return C.query[DBQ] = this.getCanonicalHeaderList(E), C.query[F$1] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await YhA(A, this.sha256))), C
      }
      async sign(A, Q) {
        if (typeof A === "string") return this.signString(A, Q);
        else if (A.headers && A.payload) return this.signEvent(A, Q);
        else if (A.message) return this.signMessage(A, Q);
        else return this.signRequest(A, Q)
      }
      async signEvent({
        headers: A,
        payload: Q
      }, {
        signingDate: B = new Date,
        priorSignature: G,
        signingRegion: Z,
        signingService: I
      }) {
        let Y = Z ?? await this.regionProvider(),
          {
            shortDate: J,
            longDate: W
          } = this.formatDate(B),
          X = IhA(J, Y, I ?? this.service),
          V = await YhA({
            headers: {},
            body: Q
          }, this.sha256),
          F = new this.sha256;
        F.update(A);
        let K = (0, Vd.toHex)(await F.digest()),
          D = [NBQ, W, X, G, K, V].join(`
`);
        return this.signString(D, {
          signingDate: B,
          signingRegion: Y,
          signingService: I
        })
      }
      async signMessage(A, {
        signingDate: Q = new Date,
        signingRegion: B,
        signingService: G
      }) {
        return this.signEvent({
          headers: this.headerFormatter.format(A.message.headers),
          payload: A.message.body
        }, {
          signingDate: Q,
          signingRegion: B,
          signingService: G,
          priorSignature: A.priorSignature
        }).then((I) => {
          return {
            message: A.message,
            signature: I
          }
        })
      }
      async signString(A, {
        signingDate: Q = new Date,
        signingRegion: B,
        signingService: G
      } = {}) {
        let Z = await this.credentialProvider();
        this.validateResolvedCredentials(Z);
        let I = B ?? await this.regionProvider(),
          {
            shortDate: Y
          } = this.formatDate(Q),
          J = new this.sha256(await this.getSigningKey(Z, I, Y, G));
        return J.update((0, YBQ.toUint8Array)(A)), (0, Vd.toHex)(await J.digest())
      }
      async signRequest(A, {
        signingDate: Q = new Date,
        signableHeaders: B,
        unsignableHeaders: G,
        signingRegion: Z,
        signingService: I
      } = {}) {
        let Y = await this.credentialProvider();
        this.validateResolvedCredentials(Y);
        let J = Z ?? await this.regionProvider(),
          W = X$1(A),
          {
            longDate: X,
            shortDate: V
          } = this.formatDate(Q),
          F = IhA(V, J, I ?? this.service);
        if (W.headers[H$1] = X, Y.sessionToken) W.headers[UBQ] = Y.sessionToken;
        let K = await YhA(W, this.sha256);
        if (!TBQ(WhA, W.headers) && this.applyChecksum) W.headers[WhA] = K;
        let D = J$1(W, G, B),
          H = await this.getSignature(X, F, this.getSigningKey(Y, J, V, I), this.createCanonicalRequest(W, D, K));
        return W.headers[D$1] = `${GhA} Credential=${Y.accessKeyId}/${F}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${H}`, W
      }
      async getSignature(A, Q, B, G) {
        let Z = await this.createStringToSign(A, Q, G, GhA),
          I = new this.sha256(await B);
        return I.update((0, YBQ.toUint8Array)(Z)), (0, Vd.toHex)(await I.digest())
      }
      getSigningKey(A, Q, B, G) {
        return RBQ(this.sha256, A, B, Q, G || this.service)
      }
    },
    s$4 = {
      SignatureV4a: null
    }
})