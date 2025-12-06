
// @from(Start 8767463, End 8768528)
JQ2 = z((pLG, YQ2) => {
  var IQ2 = bt1();
  YQ2.exports = {
    $id: "https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js",
    definitions: {
      simpleTypes: IQ2.definitions.simpleTypes
    },
    type: "object",
    dependencies: {
      schema: ["validate"],
      $data: ["validate"],
      statements: ["inline"],
      valid: {
        not: {
          required: ["macro"]
        }
      }
    },
    properties: {
      type: IQ2.properties.type,
      schema: {
        type: "boolean"
      },
      statements: {
        type: "boolean"
      },
      dependencies: {
        type: "array",
        items: {
          type: "string"
        }
      },
      metaSchema: {
        type: "object"
      },
      modifying: {
        type: "boolean"
      },
      valid: {
        type: "boolean"
      },
      $data: {
        type: "boolean"
      },
      async: {
        type: "boolean"
      },
      errors: {
        anyOf: [{
          type: "boolean"
        }, {
          const: "full"
        }]
      }
    }
  }
})
// @from(Start 8768534, End 8770639)
XQ2 = z((lLG, WQ2) => {
  var LB5 = /^[a-z_$][a-z0-9_$-]*$/i,
    MB5 = ZQ2(),
    OB5 = JQ2();
  WQ2.exports = {
    add: RB5,
    get: TB5,
    remove: PB5,
    validate: ft1
  };

  function RB5(A, Q) {
    var B = this.RULES;
    if (B.keywords[A]) throw Error("Keyword " + A + " is already defined");
    if (!LB5.test(A)) throw Error("Keyword " + A + " is not a valid identifier");
    if (Q) {
      this.validateKeyword(Q, !0);
      var G = Q.type;
      if (Array.isArray(G))
        for (var Z = 0; Z < G.length; Z++) Y(A, G[Z], Q);
      else Y(A, G, Q);
      var I = Q.metaSchema;
      if (I) {
        if (Q.$data && this._opts.$data) I = {
          anyOf: [I, {
            $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
          }]
        };
        Q.validateSchema = this.compile(I, !0)
      }
    }
    B.keywords[A] = B.all[A] = !0;

    function Y(J, W, X) {
      var V;
      for (var F = 0; F < B.length; F++) {
        var K = B[F];
        if (K.type == W) {
          V = K;
          break
        }
      }
      if (!V) V = {
        type: W,
        rules: []
      }, B.push(V);
      var D = {
        keyword: J,
        definition: X,
        custom: !0,
        code: MB5,
        implements: X.implements
      };
      V.rules.push(D), B.custom[J] = D
    }
    return this
  }

  function TB5(A) {
    var Q = this.RULES.custom[A];
    return Q ? Q.definition : this.RULES.keywords[A] || !1
  }

  function PB5(A) {
    var Q = this.RULES;
    delete Q.keywords[A], delete Q.all[A], delete Q.custom[A];
    for (var B = 0; B < Q.length; B++) {
      var G = Q[B].rules;
      for (var Z = 0; Z < G.length; Z++)
        if (G[Z].keyword == A) {
          G.splice(Z, 1);
          break
        }
    }
    return this
  }

  function ft1(A, Q) {
    ft1.errors = null;
    var B = this._validateKeyword = this._validateKeyword || this.compile(OB5, !0);
    if (B(A)) return !0;
    if (ft1.errors = B.errors, Q) throw Error("custom keyword definition is invalid: " + this.errorsText(B.errors));
    else return !1
  }
})
// @from(Start 8770645, End 8771188)
VQ2 = z((iLG, jB5) => {
  jB5.exports = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
    description: "Meta-schema for $data reference (JSON Schema extension proposal)",
    type: "object",
    required: ["$data"],
    properties: {
      $data: {
        type: "string",
        anyOf: [{
          format: "relative-json-pointer"
        }, {
          format: "json-pointer"
        }]
      }
    },
    additionalProperties: !1
  }
})
// @from(Start 8771194, End 8780047)
QQ1 = z((nLG, $Q2) => {
  var KQ2 = c12(),
    mAA = l01(),
    SB5 = l12(),
    DQ2 = Nt1(),
    _B5 = Pt1(),
    kB5 = G02(),
    yB5 = r02(),
    HQ2 = e02(),
    CQ2 = uAA();
  $Q2.exports = xJ;
  xJ.prototype.validate = vB5;
  xJ.prototype.compile = bB5;
  xJ.prototype.addSchema = fB5;
  xJ.prototype.addMetaSchema = hB5;
  xJ.prototype.validateSchema = gB5;
  xJ.prototype.getSchema = mB5;
  xJ.prototype.removeSchema = cB5;
  xJ.prototype.addFormat = oB5;
  xJ.prototype.errorsText = rB5;
  xJ.prototype._addSchema = pB5;
  xJ.prototype._compile = lB5;
  xJ.prototype.compileAsync = BQ2();
  var AQ1 = XQ2();
  xJ.prototype.addKeyword = AQ1.add;
  xJ.prototype.getKeyword = AQ1.get;
  xJ.prototype.removeKeyword = AQ1.remove;
  xJ.prototype.validateKeyword = AQ1.validate;
  var EQ2 = i01();
  xJ.ValidationError = EQ2.Validation;
  xJ.MissingRefError = EQ2.MissingRef;
  xJ.$dataMetaSchema = HQ2;
  var e01 = "http://json-schema.org/draft-07/schema",
    FQ2 = ["removeAdditional", "useDefaults", "coerceTypes", "strictDefaults"],
    xB5 = ["/properties"];

  function xJ(A) {
    if (!(this instanceof xJ)) return new xJ(A);
    if (A = this._opts = CQ2.copy(A) || {}, G25(this), this._schemas = {}, this._refs = {}, this._fragments = {}, this._formats = kB5(A.format), this._cache = A.cache || new SB5, this._loadingSchemas = {}, this._compilations = [], this.RULES = yB5(), this._getId = iB5(A), A.loopRequired = A.loopRequired || 1 / 0, A.errorDataPath == "property") A._errorDataPathProperty = !0;
    if (A.serialize === void 0) A.serialize = _B5;
    if (this._metaOpts = B25(this), A.formats) A25(this);
    if (A.keywords) Q25(this);
    if (tB5(this), typeof A.meta == "object") this.addMetaSchema(A.meta);
    if (A.nullable) this.addKeyword("nullable", {
      metaSchema: {
        type: "boolean"
      }
    });
    eB5(this)
  }

  function vB5(A, Q) {
    var B;
    if (typeof A == "string") {
      if (B = this.getSchema(A), !B) throw Error('no schema with key or ref "' + A + '"')
    } else {
      var G = this._addSchema(A);
      B = G.validate || this._compile(G)
    }
    var Z = B(Q);
    if (B.$async !== !0) this.errors = B.errors;
    return Z
  }

  function bB5(A, Q) {
    var B = this._addSchema(A, void 0, Q);
    return B.validate || this._compile(B)
  }

  function fB5(A, Q, B, G) {
    if (Array.isArray(A)) {
      for (var Z = 0; Z < A.length; Z++) this.addSchema(A[Z], void 0, B, G);
      return this
    }
    var I = this._getId(A);
    if (I !== void 0 && typeof I != "string") throw Error("schema id must be string");
    return Q = mAA.normalizeId(Q || I), UQ2(this, Q), this._schemas[Q] = this._addSchema(A, B, G, !0), this
  }

  function hB5(A, Q, B) {
    return this.addSchema(A, Q, B, !0), this
  }

  function gB5(A, Q) {
    var B = A.$schema;
    if (B !== void 0 && typeof B != "string") throw Error("$schema must be a string");
    if (B = B || this._opts.defaultMeta || uB5(this), !B) return this.logger.warn("meta-schema not available"), this.errors = null, !0;
    var G = this.validate(B, A);
    if (!G && Q) {
      var Z = "schema is invalid: " + this.errorsText();
      if (this._opts.validateSchema == "log") this.logger.error(Z);
      else throw Error(Z)
    }
    return G
  }

  function uB5(A) {
    var Q = A._opts.meta;
    return A._opts.defaultMeta = typeof Q == "object" ? A._getId(Q) || Q : A.getSchema(e01) ? e01 : void 0, A._opts.defaultMeta
  }

  function mB5(A) {
    var Q = zQ2(this, A);
    switch (typeof Q) {
      case "object":
        return Q.validate || this._compile(Q);
      case "string":
        return this.getSchema(Q);
      case "undefined":
        return dB5(this, A)
    }
  }

  function dB5(A, Q) {
    var B = mAA.schema.call(A, {
      schema: {}
    }, Q);
    if (B) {
      var {
        schema: G,
        root: Z,
        baseId: I
      } = B, Y = KQ2.call(A, G, Z, void 0, I);
      return A._fragments[Q] = new DQ2({
        ref: Q,
        fragment: !0,
        schema: G,
        root: Z,
        baseId: I,
        validate: Y
      }), Y
    }
  }

  function zQ2(A, Q) {
    return Q = mAA.normalizeId(Q), A._schemas[Q] || A._refs[Q] || A._fragments[Q]
  }

  function cB5(A) {
    if (A instanceof RegExp) return t01(this, this._schemas, A), t01(this, this._refs, A), this;
    switch (typeof A) {
      case "undefined":
        return t01(this, this._schemas), t01(this, this._refs), this._cache.clear(), this;
      case "string":
        var Q = zQ2(this, A);
        if (Q) this._cache.del(Q.cacheKey);
        return delete this._schemas[A], delete this._refs[A], this;
      case "object":
        var B = this._opts.serialize,
          G = B ? B(A) : A;
        this._cache.del(G);
        var Z = this._getId(A);
        if (Z) Z = mAA.normalizeId(Z), delete this._schemas[Z], delete this._refs[Z]
    }
    return this
  }

  function t01(A, Q, B) {
    for (var G in Q) {
      var Z = Q[G];
      if (!Z.meta && (!B || B.test(G))) A._cache.del(Z.cacheKey), delete Q[G]
    }
  }

  function pB5(A, Q, B, G) {
    if (typeof A != "object" && typeof A != "boolean") throw Error("schema should be object or boolean");
    var Z = this._opts.serialize,
      I = Z ? Z(A) : A,
      Y = this._cache.get(I);
    if (Y) return Y;
    G = G || this._opts.addUsedSchema !== !1;
    var J = mAA.normalizeId(this._getId(A));
    if (J && G) UQ2(this, J);
    var W = this._opts.validateSchema !== !1 && !Q,
      X;
    if (W && !(X = J && J == mAA.normalizeId(A.$schema))) this.validateSchema(A, !0);
    var V = mAA.ids.call(this, A),
      F = new DQ2({
        id: J,
        schema: A,
        localRefs: V,
        cacheKey: I,
        meta: B
      });
    if (J[0] != "#" && G) this._refs[J] = F;
    if (this._cache.put(I, F), W && X) this.validateSchema(A, !0);
    return F
  }

  function lB5(A, Q) {
    if (A.compiling) {
      if (A.validate = Z, Z.schema = A.schema, Z.errors = null, Z.root = Q ? Q : Z, A.schema.$async === !0) Z.$async = !0;
      return Z
    }
    A.compiling = !0;
    var B;
    if (A.meta) B = this._opts, this._opts = this._metaOpts;
    var G;
    try {
      G = KQ2.call(this, A.schema, Q, A.localRefs)
    } catch (I) {
      throw delete A.validate, I
    } finally {
      if (A.compiling = !1, A.meta) this._opts = B
    }
    return A.validate = G, A.refs = G.refs, A.refVal = G.refVal, A.root = G.root, G;

    function Z() {
      var I = A.validate,
        Y = I.apply(this, arguments);
      return Z.errors = I.errors, Y
    }
  }

  function iB5(A) {
    switch (A.schemaId) {
      case "auto":
        return sB5;
      case "id":
        return nB5;
      default:
        return aB5
    }
  }

  function nB5(A) {
    if (A.$id) this.logger.warn("schema $id ignored", A.$id);
    return A.id
  }

  function aB5(A) {
    if (A.id) this.logger.warn("schema id ignored", A.id);
    return A.$id
  }

  function sB5(A) {
    if (A.$id && A.id && A.$id != A.id) throw Error("schema $id is different from id");
    return A.$id || A.id
  }

  function rB5(A, Q) {
    if (A = A || this.errors, !A) return "No errors";
    Q = Q || {};
    var B = Q.separator === void 0 ? ", " : Q.separator,
      G = Q.dataVar === void 0 ? "data" : Q.dataVar,
      Z = "";
    for (var I = 0; I < A.length; I++) {
      var Y = A[I];
      if (Y) Z += G + Y.dataPath + " " + Y.message + B
    }
    return Z.slice(0, -B.length)
  }

  function oB5(A, Q) {
    if (typeof Q == "string") Q = new RegExp(Q);
    return this._formats[A] = Q, this
  }

  function tB5(A) {
    var Q;
    if (A._opts.$data) Q = VQ2(), A.addMetaSchema(Q, Q.$id, !0);
    if (A._opts.meta === !1) return;
    var B = bt1();
    if (A._opts.$data) B = HQ2(B, xB5);
    A.addMetaSchema(B, e01, !0), A._refs["http://json-schema.org/schema"] = e01
  }

  function eB5(A) {
    var Q = A._opts.schemas;
    if (!Q) return;
    if (Array.isArray(Q)) A.addSchema(Q);
    else
      for (var B in Q) A.addSchema(Q[B], B)
  }

  function A25(A) {
    for (var Q in A._opts.formats) {
      var B = A._opts.formats[Q];
      A.addFormat(Q, B)
    }
  }

  function Q25(A) {
    for (var Q in A._opts.keywords) {
      var B = A._opts.keywords[Q];
      A.addKeyword(Q, B)
    }
  }

  function UQ2(A, Q) {
    if (A._schemas[Q] || A._refs[Q]) throw Error('schema with key or id "' + Q + '" already exists')
  }

  function B25(A) {
    var Q = CQ2.copy(A._opts);
    for (var B = 0; B < FQ2.length; B++) delete Q[FQ2[B]];
    return Q
  }

  function G25(A) {
    var Q = A._opts.logger;
    if (Q === !1) A.logger = {
      log: ht1,
      warn: ht1,
      error: ht1
    };
    else {
      if (Q === void 0) Q = console;
      if (!(typeof Q == "object" && Q.log && Q.warn && Q.error)) throw Error("logger must implement log, warn and error methods");
      A.logger = Q
    }
  }

  function ht1() {}
})
// @from(Start 8780053, End 8780056)
wQ2
// @from(Start 8780058, End 8780061)
BQ1
// @from(Start 8780067, End 8787537)
qQ2 = L(() => {
  Ht1();
  SD();
  wQ2 = BA(QQ1(), 1);
  BQ1 = class BQ1 extends QLA {
    constructor(A, Q) {
      var B;
      super(Q);
      this._clientInfo = A, this._cachedToolOutputValidators = new Map, this._capabilities = (B = Q === null || Q === void 0 ? void 0 : Q.capabilities) !== null && B !== void 0 ? B : {}, this._ajv = new wQ2.default
    }
    registerCapabilities(A) {
      if (this.transport) throw Error("Cannot register capabilities after connecting to transport");
      this._capabilities = b01(this._capabilities, A)
    }
    assertCapability(A, Q) {
      var B;
      if (!((B = this._serverCapabilities) === null || B === void 0 ? void 0 : B[A])) throw Error(`Server does not support ${A} (required for ${Q})`)
    }
    async connect(A, Q) {
      if (await super.connect(A), A.sessionId !== void 0) return;
      try {
        let B = await this.request({
          method: "initialize",
          params: {
            protocolVersion: hl,
            capabilities: this._capabilities,
            clientInfo: this._clientInfo
          }
        }, At1, Q);
        if (B === void 0) throw Error(`Server sent invalid initialize result: ${B}`);
        if (!R01.includes(B.protocolVersion)) throw Error(`Server's protocol version is not supported: ${B.protocolVersion}`);
        if (this._serverCapabilities = B.capabilities, this._serverVersion = B.serverInfo, A.setProtocolVersion) A.setProtocolVersion(B.protocolVersion);
        this._instructions = B.instructions, await this.notification({
          method: "notifications/initialized"
        })
      } catch (B) {
        throw this.close(), B
      }
    }
    getServerCapabilities() {
      return this._serverCapabilities
    }
    getServerVersion() {
      return this._serverVersion
    }
    getInstructions() {
      return this._instructions
    }
    assertCapabilityForMethod(A) {
      var Q, B, G, Z, I;
      switch (A) {
        case "logging/setLevel":
          if (!((Q = this._serverCapabilities) === null || Q === void 0 ? void 0 : Q.logging)) throw Error(`Server does not support logging (required for ${A})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!((B = this._serverCapabilities) === null || B === void 0 ? void 0 : B.prompts)) throw Error(`Server does not support prompts (required for ${A})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
        case "resources/subscribe":
        case "resources/unsubscribe":
          if (!((G = this._serverCapabilities) === null || G === void 0 ? void 0 : G.resources)) throw Error(`Server does not support resources (required for ${A})`);
          if (A === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw Error(`Server does not support resource subscriptions (required for ${A})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!((Z = this._serverCapabilities) === null || Z === void 0 ? void 0 : Z.tools)) throw Error(`Server does not support tools (required for ${A})`);
          break;
        case "completion/complete":
          if (!((I = this._serverCapabilities) === null || I === void 0 ? void 0 : I.completions)) throw Error(`Server does not support completions (required for ${A})`);
          break;
        case "initialize":
          break;
        case "ping":
          break
      }
    }
    assertNotificationCapability(A) {
      var Q;
      switch (A) {
        case "notifications/roots/list_changed":
          if (!((Q = this._capabilities.roots) === null || Q === void 0 ? void 0 : Q.listChanged)) throw Error(`Client does not support roots list changed notifications (required for ${A})`);
          break;
        case "notifications/initialized":
          break;
        case "notifications/cancelled":
          break;
        case "notifications/progress":
          break
      }
    }
    assertRequestHandlerCapability(A) {
      switch (A) {
        case "sampling/createMessage":
          if (!this._capabilities.sampling) throw Error(`Client does not support sampling capability (required for ${A})`);
          break;
        case "elicitation/create":
          if (!this._capabilities.elicitation) throw Error(`Client does not support elicitation capability (required for ${A})`);
          break;
        case "roots/list":
          if (!this._capabilities.roots) throw Error(`Client does not support roots capability (required for ${A})`);
          break;
        case "ping":
          break
      }
    }
    async ping(A) {
      return this.request({
        method: "ping"
      }, Ih, A)
    }
    async complete(A, Q) {
      return this.request({
        method: "completion/complete",
        params: A
      }, Ft1, Q)
    }
    async setLoggingLevel(A, Q) {
      return this.request({
        method: "logging/setLevel",
        params: {
          level: A
        }
      }, Ih, Q)
    }
    async getPrompt(A, Q) {
      return this.request({
        method: "prompts/get",
        params: A
      }, Yt1, Q)
    }
    async listPrompts(A, Q) {
      return this.request({
        method: "prompts/list",
        params: A
      }, eNA, Q)
    }
    async listResources(A, Q) {
      return this.request({
        method: "resources/list",
        params: A
      }, gAA, Q)
    }
    async listResourceTemplates(A, Q) {
      return this.request({
        method: "resources/templates/list",
        params: A
      }, Bt1, Q)
    }
    async readResource(A, Q) {
      return this.request({
        method: "resources/read",
        params: A
      }, gl, Q)
    }
    async subscribeResource(A, Q) {
      return this.request({
        method: "resources/subscribe",
        params: A
      }, Ih, Q)
    }
    async unsubscribeResource(A, Q) {
      return this.request({
        method: "resources/unsubscribe",
        params: A
      }, Ih, Q)
    }
    async callTool(A, Q = aT, B) {
      let G = await this.request({
          method: "tools/call",
          params: A
        }, Q, B),
        Z = this.getToolOutputValidator(A.name);
      if (Z) {
        if (!G.structuredContent && !G.isError) throw new ME(LE.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`);
        if (G.structuredContent) try {
          if (!Z(G.structuredContent)) throw new ME(LE.InvalidParams, `Structured content does not match the tool's output schema: ${this._ajv.errorsText(Z.errors)}`)
        } catch (I) {
          if (I instanceof ME) throw I;
          throw new ME(LE.InvalidParams, `Failed to validate structured content: ${I instanceof Error?I.message:String(I)}`)
        }
      }
      return G
    }
    cacheToolOutputSchemas(A) {
      this._cachedToolOutputValidators.clear();
      for (let Q of A)
        if (Q.outputSchema) try {
          let B = this._ajv.compile(Q.outputSchema);
          this._cachedToolOutputValidators.set(Q.name, B)
        } catch (B) {}
    }
    getToolOutputValidator(A) {
      return this._cachedToolOutputValidators.get(A)
    }
    async listTools(A, Q) {
      let B = await this.request({
        method: "tools/list",
        params: A
      }, ALA, Q);
      return this.cacheToolOutputSchemas(B.tools), B
    }
    async sendRootsListChanged() {
      return this.notification({
        method: "notifications/roots/list_changed"
      })
    }
  }
})
// @from(Start 8787539, End 8787942)
class GLA {
  append(A) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, A]) : A
  }
  readMessage() {
    if (!this._buffer) return null;
    let A = this._buffer.indexOf(`
`);
    if (A === -1) return null;
    let Q = this._buffer.toString("utf8", 0, A).replace(/\r$/, "");
    return this._buffer = this._buffer.subarray(A + 1), Z25(Q)
  }
  clear() {
    this._buffer = void 0
  }
}
// @from(Start 8787944, End 8787996)
function Z25(A) {
  return Mk.parse(JSON.parse(A))
}
// @from(Start 8787998, End 8788050)
function GQ1(A) {
  return JSON.stringify(A) + `
`
}
// @from(Start 8788055, End 8788080)
gt1 = L(() => {
  SD()
})
// @from(Start 8788167, End 8788344)
function J25() {
  let A = {};
  for (let Q of Y25) {
    let B = ZQ1.env[Q];
    if (B === void 0) continue;
    if (B.startsWith("()")) continue;
    A[Q] = B
  }
  return A
}
// @from(Start 8788345, End 8791503)
class ut1 {
  constructor(A) {
    if (this._abortController = new AbortController, this._readBuffer = new GLA, this._stderrStream = null, this._serverParams = A, A.stderr === "pipe" || A.stderr === "overlapped") this._stderrStream = new I25
  }
  async start() {
    if (this._process) throw Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return new Promise((A, Q) => {
      var B, G, Z, I, Y;
      if (this._process = NQ2.default(this._serverParams.command, (B = this._serverParams.args) !== null && B !== void 0 ? B : [], {
          env: {
            ...J25(),
            ...this._serverParams.env
          },
          stdio: ["pipe", "pipe", (G = this._serverParams.stderr) !== null && G !== void 0 ? G : "inherit"],
          shell: !1,
          signal: this._abortController.signal,
          windowsHide: ZQ1.platform === "win32" && W25(),
          cwd: this._serverParams.cwd
        }), this._process.on("error", (J) => {
          var W, X;
          if (J.name === "AbortError") {
            (W = this.onclose) === null || W === void 0 || W.call(this);
            return
          }
          Q(J), (X = this.onerror) === null || X === void 0 || X.call(this, J)
        }), this._process.on("spawn", () => {
          A()
        }), this._process.on("close", (J) => {
          var W;
          this._process = void 0, (W = this.onclose) === null || W === void 0 || W.call(this)
        }), (Z = this._process.stdin) === null || Z === void 0 || Z.on("error", (J) => {
          var W;
          (W = this.onerror) === null || W === void 0 || W.call(this, J)
        }), (I = this._process.stdout) === null || I === void 0 || I.on("data", (J) => {
          this._readBuffer.append(J), this.processReadBuffer()
        }), (Y = this._process.stdout) === null || Y === void 0 || Y.on("error", (J) => {
          var W;
          (W = this.onerror) === null || W === void 0 || W.call(this, J)
        }), this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream)
    })
  }
  get stderr() {
    var A, Q;
    if (this._stderrStream) return this._stderrStream;
    return (Q = (A = this._process) === null || A === void 0 ? void 0 : A.stderr) !== null && Q !== void 0 ? Q : null
  }
  get pid() {
    var A, Q;
    return (Q = (A = this._process) === null || A === void 0 ? void 0 : A.pid) !== null && Q !== void 0 ? Q : null
  }
  processReadBuffer() {
    var A, Q;
    while (!0) try {
      let B = this._readBuffer.readMessage();
      if (B === null) break;
      (A = this.onmessage) === null || A === void 0 || A.call(this, B)
    } catch (B) {
      (Q = this.onerror) === null || Q === void 0 || Q.call(this, B)
    }
  }
  async close() {
    this._abortController.abort(), this._process = void 0, this._readBuffer.clear()
  }
  send(A) {
    return new Promise((Q) => {
      var B;
      if (!((B = this._process) === null || B === void 0 ? void 0 : B.stdin)) throw Error("Not connected");
      let G = GQ1(A);
      if (this._process.stdin.write(G)) Q();
      else this._process.stdin.once("drain", Q)
    })
  }
}
// @from(Start 8791505, End 8791546)
function W25() {
  return "type" in ZQ1
}
// @from(Start 8791551, End 8791554)
NQ2
// @from(Start 8791556, End 8791559)
Y25
// @from(Start 8791565, End 8791869)
LQ2 = L(() => {
  gt1();
  NQ2 = BA(lK1(), 1), Y25 = ZQ1.platform === "win32" ? ["APPDATA", "HOMEDRIVE", "HOMEPATH", "LOCALAPPDATA", "PATH", "PROCESSOR_ARCHITECTURE", "SYSTEMDRIVE", "SYSTEMROOT", "TEMP", "USERNAME", "USERPROFILE", "PROGRAMFILES"] : ["HOME", "LOGNAME", "PATH", "SHELL", "TERM", "USER"]
})
// @from(Start 8791872, End 8791890)
function mt1(A) {}
// @from(Start 8791892, End 8793670)
function IQ1(A) {
  if (typeof A == "function") throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
  let {
    onEvent: Q = mt1,
    onError: B = mt1,
    onRetry: G = mt1,
    onComment: Z
  } = A, I = "", Y = !0, J, W = "", X = "";

  function V(C) {
    let E = Y ? C.replace(/^\xEF\xBB\xBF/, "") : C,
      [U, q] = X25(`${I}${E}`);
    for (let w of U) F(w);
    I = q, Y = !1
  }

  function F(C) {
    if (C === "") {
      D();
      return
    }
    if (C.startsWith(":")) {
      Z && Z(C.slice(C.startsWith(": ") ? 2 : 1));
      return
    }
    let E = C.indexOf(":");
    if (E !== -1) {
      let U = C.slice(0, E),
        q = C[E + 1] === " " ? 2 : 1,
        w = C.slice(E + q);
      K(U, w, C);
      return
    }
    K(C, "", C)
  }

  function K(C, E, U) {
    switch (C) {
      case "event":
        X = E;
        break;
      case "data":
        W = `${W}${E}
`;
        break;
      case "id":
        J = E.includes("\x00") ? void 0 : E;
        break;
      case "retry":
        /^\d+$/.test(E) ? G(parseInt(E, 10)) : B(new dt1(`Invalid \`retry\` value: "${E}"`, {
          type: "invalid-retry",
          value: E,
          line: U
        }));
        break;
      default:
        B(new dt1(`Unknown field "${C.length>20?`${C.slice(0,20)}…`:C}"`, {
          type: "unknown-field",
          field: C,
          value: E,
          line: U
        }));
        break
    }
  }

  function D() {
    W.length > 0 && Q({
      id: J,
      event: X || void 0,
      data: W.endsWith(`
`) ? W.slice(0, -1) : W
    }), J = void 0, W = "", X = ""
  }

  function H(C = {}) {
    I && C.consume && F(I), Y = !0, J = void 0, W = "", X = "", I = ""
  }
  return {
    feed: V,
    reset: H
  }
}
// @from(Start 8793672, End 8794104)
function X25(A) {
  let Q = [],
    B = "",
    G = 0;
  for (; G < A.length;) {
    let Z = A.indexOf("\r", G),
      I = A.indexOf(`
`, G),
      Y = -1;
    if (Z !== -1 && I !== -1 ? Y = Math.min(Z, I) : Z !== -1 ? Y = Z : I !== -1 && (Y = I), Y === -1) {
      B = A.slice(G);
      break
    } else {
      let J = A.slice(G, Y);
      Q.push(J), G = Y + 1, A[G - 1] === "\r" && A[G] === `
` && G++
    }
  }
  return [Q, B]
}
// @from(Start 8794109, End 8794112)
dt1
// @from(Start 8794118, End 8794329)
ct1 = L(() => {
  dt1 = class dt1 extends Error {
    constructor(A, Q) {
      super(A), this.name = "ParseError", this.type = Q.type, this.field = Q.field, this.value = Q.value, this.line = Q.line
    }
  }
})
// @from(Start 8794332, End 8794461)
function V25(A) {
  let Q = globalThis.DOMException;
  return typeof Q == "function" ? new Q(A, "SyntaxError") : SyntaxError(A)
}
// @from(Start 8794463, End 8794676)
function lt1(A) {
  return A instanceof Error ? "errors" in A && Array.isArray(A.errors) ? A.errors.map(lt1).join(", ") : ("cause" in A) && A.cause instanceof Error ? `${A}: ${lt1(A.cause)}` : A.message : `${A}`
}
// @from(Start 8794678, End 8794871)
function MQ2(A) {
  return {
    type: A.type,
    message: A.message,
    code: A.code,
    defaultPrevented: A.defaultPrevented,
    cancelable: A.cancelable,
    timeStamp: A.timeStamp
  }
}
// @from(Start 8794873, End 8795064)
function F25() {
  let A = "document" in globalThis ? globalThis.document : void 0;
  return A && typeof A == "object" && "baseURI" in A && typeof A.baseURI == "string" ? A.baseURI : void 0
}
// @from(Start 8795069, End 8795072)
pt1
// @from(Start 8795074, End 8795115)
RQ2 = (A) => {
    throw TypeError(A)
  }
// @from(Start 8795119, End 8795168)
et1 = (A, Q, B) => Q.has(A) || RQ2("Cannot " + B)
// @from(Start 8795172, End 8795254)
B5 = (A, Q, B) => (et1(A, Q, "read from private field"), B ? B.call(A) : Q.get(A))
// @from(Start 8795258, End 8795391)
xV = (A, Q, B) => Q.has(A) ? RQ2("Cannot add the same private member more than once") : Q instanceof WeakSet ? Q.add(A) : Q.set(A, B)
// @from(Start 8795395, End 8795469)
VY = (A, Q, B, G) => (et1(A, Q, "write to private field"), Q.set(A, B), B)
// @from(Start 8795473, End 8795530)
Yh = (A, Q, B) => (et1(A, Q, "access private method"), B)
// @from(Start 8795534, End 8795536)
gU
// @from(Start 8795538, End 8795541)
dAA
// @from(Start 8795543, End 8795546)
XIA
// @from(Start 8795548, End 8795551)
YQ1
// @from(Start 8795553, End 8795556)
JQ1
// @from(Start 8795558, End 8795561)
YLA
// @from(Start 8795563, End 8795566)
KIA
// @from(Start 8795568, End 8795571)
JLA
// @from(Start 8795573, End 8795575)
cl
// @from(Start 8795577, End 8795580)
VIA
// @from(Start 8795582, End 8795585)
DIA
// @from(Start 8795587, End 8795590)
FIA
// @from(Start 8795592, End 8795595)
ZLA
// @from(Start 8795597, End 8795599)
sT
// @from(Start 8795601, End 8795604)
it1
// @from(Start 8795606, End 8795609)
nt1
// @from(Start 8795611, End 8795614)
at1
// @from(Start 8795616, End 8795619)
OQ2
// @from(Start 8795621, End 8795624)
st1
// @from(Start 8795626, End 8795629)
rt1
// @from(Start 8795631, End 8795634)
ILA
// @from(Start 8795636, End 8795639)
ot1
// @from(Start 8795641, End 8795644)
tt1
// @from(Start 8795646, End 8795649)
HIA
// @from(Start 8795655, End 8801804)
TQ2 = L(() => {
  ct1();
  pt1 = class pt1 extends Event {
    constructor(A, Q) {
      var B, G;
      super(A), this.code = (B = Q == null ? void 0 : Q.code) != null ? B : void 0, this.message = (G = Q == null ? void 0 : Q.message) != null ? G : void 0
    } [Symbol.for("nodejs.util.inspect.custom")](A, Q, B) {
      return B(MQ2(this), Q)
    } [Symbol.for("Deno.customInspect")](A, Q) {
      return A(MQ2(this), Q)
    }
  };
  HIA = class HIA extends EventTarget {
    constructor(A, Q) {
      var B, G;
      super(), xV(this, sT), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, xV(this, gU), xV(this, dAA), xV(this, XIA), xV(this, YQ1), xV(this, JQ1), xV(this, YLA), xV(this, KIA), xV(this, JLA, null), xV(this, cl), xV(this, VIA), xV(this, DIA, null), xV(this, FIA, null), xV(this, ZLA, null), xV(this, nt1, async (Z) => {
        var I;
        B5(this, VIA).reset();
        let {
          body: Y,
          redirected: J,
          status: W,
          headers: X
        } = Z;
        if (W === 204) {
          Yh(this, sT, ILA).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
          return
        }
        if (J ? VY(this, XIA, new URL(Z.url)) : VY(this, XIA, void 0), W !== 200) {
          Yh(this, sT, ILA).call(this, `Non-200 status code (${W})`, W);
          return
        }
        if (!(X.get("content-type") || "").startsWith("text/event-stream")) {
          Yh(this, sT, ILA).call(this, 'Invalid content type, expected "text/event-stream"', W);
          return
        }
        if (B5(this, gU) === this.CLOSED) return;
        VY(this, gU, this.OPEN);
        let V = new Event("open");
        if ((I = B5(this, ZLA)) == null || I.call(this, V), this.dispatchEvent(V), typeof Y != "object" || !Y || !("getReader" in Y)) {
          Yh(this, sT, ILA).call(this, "Invalid response body, expected a web ReadableStream", W), this.close();
          return
        }
        let F = new TextDecoder,
          K = Y.getReader(),
          D = !0;
        do {
          let {
            done: H,
            value: C
          } = await K.read();
          C && B5(this, VIA).feed(F.decode(C, {
            stream: !H
          })), H && (D = !1, B5(this, VIA).reset(), Yh(this, sT, ot1).call(this))
        } while (D)
      }), xV(this, at1, (Z) => {
        VY(this, cl, void 0), !(Z.name === "AbortError" || Z.type === "aborted") && Yh(this, sT, ot1).call(this, lt1(Z))
      }), xV(this, st1, (Z) => {
        typeof Z.id == "string" && VY(this, JLA, Z.id);
        let I = new MessageEvent(Z.event || "message", {
          data: Z.data,
          origin: B5(this, XIA) ? B5(this, XIA).origin : B5(this, dAA).origin,
          lastEventId: Z.id || ""
        });
        B5(this, FIA) && (!Z.event || Z.event === "message") && B5(this, FIA).call(this, I), this.dispatchEvent(I)
      }), xV(this, rt1, (Z) => {
        VY(this, YLA, Z)
      }), xV(this, tt1, () => {
        VY(this, KIA, void 0), B5(this, gU) === this.CONNECTING && Yh(this, sT, it1).call(this)
      });
      try {
        if (A instanceof URL) VY(this, dAA, A);
        else if (typeof A == "string") VY(this, dAA, new URL(A, F25()));
        else throw Error("Invalid URL")
      } catch {
        throw V25("An invalid or illegal string was specified")
      }
      VY(this, VIA, IQ1({
        onEvent: B5(this, st1),
        onRetry: B5(this, rt1)
      })), VY(this, gU, this.CONNECTING), VY(this, YLA, 3000), VY(this, JQ1, (B = Q == null ? void 0 : Q.fetch) != null ? B : globalThis.fetch), VY(this, YQ1, (G = Q == null ? void 0 : Q.withCredentials) != null ? G : !1), Yh(this, sT, it1).call(this)
    }
    get readyState() {
      return B5(this, gU)
    }
    get url() {
      return B5(this, dAA).href
    }
    get withCredentials() {
      return B5(this, YQ1)
    }
    get onerror() {
      return B5(this, DIA)
    }
    set onerror(A) {
      VY(this, DIA, A)
    }
    get onmessage() {
      return B5(this, FIA)
    }
    set onmessage(A) {
      VY(this, FIA, A)
    }
    get onopen() {
      return B5(this, ZLA)
    }
    set onopen(A) {
      VY(this, ZLA, A)
    }
    addEventListener(A, Q, B) {
      let G = Q;
      super.addEventListener(A, G, B)
    }
    removeEventListener(A, Q, B) {
      let G = Q;
      super.removeEventListener(A, G, B)
    }
    close() {
      B5(this, KIA) && clearTimeout(B5(this, KIA)), B5(this, gU) !== this.CLOSED && (B5(this, cl) && B5(this, cl).abort(), VY(this, gU, this.CLOSED), VY(this, cl, void 0))
    }
  };
  gU = new WeakMap, dAA = new WeakMap, XIA = new WeakMap, YQ1 = new WeakMap, JQ1 = new WeakMap, YLA = new WeakMap, KIA = new WeakMap, JLA = new WeakMap, cl = new WeakMap, VIA = new WeakMap, DIA = new WeakMap, FIA = new WeakMap, ZLA = new WeakMap, sT = new WeakSet, it1 = function() {
    VY(this, gU, this.CONNECTING), VY(this, cl, new AbortController), B5(this, JQ1)(B5(this, dAA), Yh(this, sT, OQ2).call(this)).then(B5(this, nt1)).catch(B5(this, at1))
  }, nt1 = new WeakMap, at1 = new WeakMap, OQ2 = function() {
    var A;
    let Q = {
      mode: "cors",
      redirect: "follow",
      headers: {
        Accept: "text/event-stream",
        ...B5(this, JLA) ? {
          "Last-Event-ID": B5(this, JLA)
        } : void 0
      },
      cache: "no-store",
      signal: (A = B5(this, cl)) == null ? void 0 : A.signal
    };
    return "window" in globalThis && (Q.credentials = this.withCredentials ? "include" : "same-origin"), Q
  }, st1 = new WeakMap, rt1 = new WeakMap, ILA = function(A, Q) {
    var B;
    B5(this, gU) !== this.CLOSED && VY(this, gU, this.CLOSED);
    let G = new pt1("error", {
      code: Q,
      message: A
    });
    (B = B5(this, DIA)) == null || B.call(this, G), this.dispatchEvent(G)
  }, ot1 = function(A, Q) {
    var B;
    if (B5(this, gU) === this.CLOSED) return;
    VY(this, gU, this.CONNECTING);
    let G = new pt1("error", {
      code: Q,
      message: A
    });
    (B = B5(this, DIA)) == null || B.call(this, G), this.dispatchEvent(G), VY(this, KIA, setTimeout(B5(this, tt1), B5(this, YLA)))
  }, tt1 = new WeakMap, HIA.CONNECTING = 0, HIA.OPEN = 1, HIA.CLOSED = 2
})
// @from(Start 8801806, End 8801887)
async function K25(A) {
  return (await Ae1).getRandomValues(new Uint8Array(A))
}
// @from(Start 8801888, End 8802101)
async function D25(A) {
  let B = "",
    G = await K25(A);
  for (let Z = 0; Z < A; Z++) {
    let I = G[Z] % 66;
    B += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~" [I]
  }
  return B
}
// @from(Start 8802102, End 8802149)
async function H25(A) {
  return await D25(A)
}
// @from(Start 8802150, End 8802373)
async function C25(A) {
  let Q = await (await Ae1).subtle.digest("SHA-256", new TextEncoder().encode(A));
  return btoa(String.fromCharCode(...new Uint8Array(Q))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "")
}
// @from(Start 8802374, End 8802609)
async function Qe1(A) {
  if (!A) A = 43;
  if (A < 43 || A > 128) throw `Expected a length between 43 and 128. Received ${A}.`;
  let Q = await H25(A),
    B = await C25(Q);
  return {
    code_verifier: Q,
    code_challenge: B
  }
}
// @from(Start 8802614, End 8802617)
Ae1
// @from(Start 8802623, End 8802749)
PQ2 = L(() => {
  Ae1 = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((A) => A.webcrypto)
})
// @from(Start 8802755, End 8802757)
iF
// @from(Start 8802759, End 8802762)
jQ2
// @from(Start 8802764, End 8802767)
Be1
// @from(Start 8802769, End 8802772)
E25
// @from(Start 8802774, End 8802777)
SQ2
// @from(Start 8802779, End 8802782)
Ge1
// @from(Start 8802784, End 8802787)
WQ1
// @from(Start 8802789, End 8802792)
z25
// @from(Start 8802794, End 8802797)
U25
// @from(Start 8802799, End 8802802)
_Q2
// @from(Start 8802804, End 8802807)
WMG
// @from(Start 8802809, End 8802812)
XMG
// @from(Start 8802818, End 8808769)
XQ1 = L(() => {
  Q2();
  iF = j.string().url().superRefine((A, Q) => {
    if (!URL.canParse(A)) return Q.addIssue({
      code: j.ZodIssueCode.custom,
      message: "URL must be parseable",
      fatal: !0
    }), j.NEVER
  }).refine((A) => {
    let Q = new URL(A);
    return Q.protocol !== "javascript:" && Q.protocol !== "data:" && Q.protocol !== "vbscript:"
  }, {
    message: "URL cannot use javascript:, data:, or vbscript: scheme"
  }), jQ2 = j.object({
    resource: j.string().url(),
    authorization_servers: j.array(iF).optional(),
    jwks_uri: j.string().url().optional(),
    scopes_supported: j.array(j.string()).optional(),
    bearer_methods_supported: j.array(j.string()).optional(),
    resource_signing_alg_values_supported: j.array(j.string()).optional(),
    resource_name: j.string().optional(),
    resource_documentation: j.string().optional(),
    resource_policy_uri: j.string().url().optional(),
    resource_tos_uri: j.string().url().optional(),
    tls_client_certificate_bound_access_tokens: j.boolean().optional(),
    authorization_details_types_supported: j.array(j.string()).optional(),
    dpop_signing_alg_values_supported: j.array(j.string()).optional(),
    dpop_bound_access_tokens_required: j.boolean().optional()
  }).passthrough(), Be1 = j.object({
    issuer: j.string(),
    authorization_endpoint: iF,
    token_endpoint: iF,
    registration_endpoint: iF.optional(),
    scopes_supported: j.array(j.string()).optional(),
    response_types_supported: j.array(j.string()),
    response_modes_supported: j.array(j.string()).optional(),
    grant_types_supported: j.array(j.string()).optional(),
    token_endpoint_auth_methods_supported: j.array(j.string()).optional(),
    token_endpoint_auth_signing_alg_values_supported: j.array(j.string()).optional(),
    service_documentation: iF.optional(),
    revocation_endpoint: iF.optional(),
    revocation_endpoint_auth_methods_supported: j.array(j.string()).optional(),
    revocation_endpoint_auth_signing_alg_values_supported: j.array(j.string()).optional(),
    introspection_endpoint: j.string().optional(),
    introspection_endpoint_auth_methods_supported: j.array(j.string()).optional(),
    introspection_endpoint_auth_signing_alg_values_supported: j.array(j.string()).optional(),
    code_challenge_methods_supported: j.array(j.string()).optional()
  }).passthrough(), E25 = j.object({
    issuer: j.string(),
    authorization_endpoint: iF,
    token_endpoint: iF,
    userinfo_endpoint: iF.optional(),
    jwks_uri: iF,
    registration_endpoint: iF.optional(),
    scopes_supported: j.array(j.string()).optional(),
    response_types_supported: j.array(j.string()),
    response_modes_supported: j.array(j.string()).optional(),
    grant_types_supported: j.array(j.string()).optional(),
    acr_values_supported: j.array(j.string()).optional(),
    subject_types_supported: j.array(j.string()),
    id_token_signing_alg_values_supported: j.array(j.string()),
    id_token_encryption_alg_values_supported: j.array(j.string()).optional(),
    id_token_encryption_enc_values_supported: j.array(j.string()).optional(),
    userinfo_signing_alg_values_supported: j.array(j.string()).optional(),
    userinfo_encryption_alg_values_supported: j.array(j.string()).optional(),
    userinfo_encryption_enc_values_supported: j.array(j.string()).optional(),
    request_object_signing_alg_values_supported: j.array(j.string()).optional(),
    request_object_encryption_alg_values_supported: j.array(j.string()).optional(),
    request_object_encryption_enc_values_supported: j.array(j.string()).optional(),
    token_endpoint_auth_methods_supported: j.array(j.string()).optional(),
    token_endpoint_auth_signing_alg_values_supported: j.array(j.string()).optional(),
    display_values_supported: j.array(j.string()).optional(),
    claim_types_supported: j.array(j.string()).optional(),
    claims_supported: j.array(j.string()).optional(),
    service_documentation: j.string().optional(),
    claims_locales_supported: j.array(j.string()).optional(),
    ui_locales_supported: j.array(j.string()).optional(),
    claims_parameter_supported: j.boolean().optional(),
    request_parameter_supported: j.boolean().optional(),
    request_uri_parameter_supported: j.boolean().optional(),
    require_request_uri_registration: j.boolean().optional(),
    op_policy_uri: iF.optional(),
    op_tos_uri: iF.optional()
  }).passthrough(), SQ2 = E25.merge(Be1.pick({
    code_challenge_methods_supported: !0
  })), Ge1 = j.object({
    access_token: j.string(),
    id_token: j.string().optional(),
    token_type: j.string(),
    expires_in: j.number().optional(),
    scope: j.string().optional(),
    refresh_token: j.string().optional()
  }).strip(), WQ1 = j.object({
    error: j.string(),
    error_description: j.string().optional(),
    error_uri: j.string().optional()
  }), z25 = j.object({
    redirect_uris: j.array(iF),
    token_endpoint_auth_method: j.string().optional(),
    grant_types: j.array(j.string()).optional(),
    response_types: j.array(j.string()).optional(),
    client_name: j.string().optional(),
    client_uri: iF.optional(),
    logo_uri: iF.optional(),
    scope: j.string().optional(),
    contacts: j.array(j.string()).optional(),
    tos_uri: iF.optional(),
    policy_uri: j.string().optional(),
    jwks_uri: iF.optional(),
    jwks: j.any().optional(),
    software_id: j.string().optional(),
    software_version: j.string().optional(),
    software_statement: j.string().optional()
  }).strip(), U25 = j.object({
    client_id: j.string(),
    client_secret: j.string().optional(),
    client_id_issued_at: j.number().optional(),
    client_secret_expires_at: j.number().optional()
  }).strip(), _Q2 = z25.merge(U25), WMG = j.object({
    error: j.string(),
    error_description: j.string().optional()
  }).strip(), XMG = j.object({
    token: j.string(),
    token_type_hint: j.string().optional()
  }).strip()
})
// @from(Start 8808772, End 8808879)
function kQ2(A) {
  let Q = typeof A === "string" ? new URL(A) : new URL(A.href);
  return Q.hash = "", Q
}
// @from(Start 8808881, End 8809331)
function yQ2({
  requestedResource: A,
  configuredResource: Q
}) {
  let B = typeof A === "string" ? new URL(A) : new URL(A.href),
    G = typeof Q === "string" ? new URL(Q) : new URL(Q.href);
  if (B.origin !== G.origin) return !1;
  if (B.pathname.length < G.pathname.length) return !1;
  let Z = B.pathname.endsWith("/") ? B.pathname : B.pathname + "/",
    I = G.pathname.endsWith("/") ? G.pathname : G.pathname + "/";
  return Z.startsWith(I)
}
// @from(Start 8809336, End 8809338)
vV
// @from(Start 8809340, End 8809343)
VQ1
// @from(Start 8809345, End 8809348)
CIA
// @from(Start 8809350, End 8809353)
EIA
// @from(Start 8809355, End 8809358)
zIA
// @from(Start 8809360, End 8809363)
FQ1
// @from(Start 8809365, End 8809368)
KQ1
// @from(Start 8809370, End 8809373)
DQ1
// @from(Start 8809375, End 8809377)
pl
// @from(Start 8809379, End 8809382)
HQ1
// @from(Start 8809384, End 8809387)
CQ1
// @from(Start 8809389, End 8809392)
EQ1
// @from(Start 8809394, End 8809397)
zQ1
// @from(Start 8809399, End 8809402)
UQ1
// @from(Start 8809404, End 8809407)
$Q1
// @from(Start 8809409, End 8809412)
wQ1
// @from(Start 8809414, End 8809417)
qQ1
// @from(Start 8809419, End 8809422)
xQ2
// @from(Start 8809428, End 8811436)
vQ2 = L(() => {
  vV = class vV extends Error {
    constructor(A, Q) {
      super(A);
      this.errorUri = Q, this.name = this.constructor.name
    }
    toResponseObject() {
      let A = {
        error: this.errorCode,
        error_description: this.message
      };
      if (this.errorUri) A.error_uri = this.errorUri;
      return A
    }
    get errorCode() {
      return this.constructor.errorCode
    }
  };
  VQ1 = class VQ1 extends vV {};
  VQ1.errorCode = "invalid_request";
  CIA = class CIA extends vV {};
  CIA.errorCode = "invalid_client";
  EIA = class EIA extends vV {};
  EIA.errorCode = "invalid_grant";
  zIA = class zIA extends vV {};
  zIA.errorCode = "unauthorized_client";
  FQ1 = class FQ1 extends vV {};
  FQ1.errorCode = "unsupported_grant_type";
  KQ1 = class KQ1 extends vV {};
  KQ1.errorCode = "invalid_scope";
  DQ1 = class DQ1 extends vV {};
  DQ1.errorCode = "access_denied";
  pl = class pl extends vV {};
  pl.errorCode = "server_error";
  HQ1 = class HQ1 extends vV {};
  HQ1.errorCode = "temporarily_unavailable";
  CQ1 = class CQ1 extends vV {};
  CQ1.errorCode = "unsupported_response_type";
  EQ1 = class EQ1 extends vV {};
  EQ1.errorCode = "unsupported_token_type";
  zQ1 = class zQ1 extends vV {};
  zQ1.errorCode = "invalid_token";
  UQ1 = class UQ1 extends vV {};
  UQ1.errorCode = "method_not_allowed";
  $Q1 = class $Q1 extends vV {};
  $Q1.errorCode = "too_many_requests";
  wQ1 = class wQ1 extends vV {};
  wQ1.errorCode = "invalid_client_metadata";
  qQ1 = class qQ1 extends vV {};
  qQ1.errorCode = "insufficient_scope";
  xQ2 = {
    [VQ1.errorCode]: VQ1,
    [CIA.errorCode]: CIA,
    [EIA.errorCode]: EIA,
    [zIA.errorCode]: zIA,
    [FQ1.errorCode]: FQ1,
    [KQ1.errorCode]: KQ1,
    [DQ1.errorCode]: DQ1,
    [pl.errorCode]: pl,
    [HQ1.errorCode]: HQ1,
    [CQ1.errorCode]: CQ1,
    [EQ1.errorCode]: EQ1,
    [zQ1.errorCode]: zQ1,
    [UQ1.errorCode]: UQ1,
    [$Q1.errorCode]: $Q1,
    [wQ1.errorCode]: wQ1,
    [qQ1.errorCode]: qQ1
  }
})
// @from(Start 8811439, End 8811797)
function fQ2(A, Q) {
  let B = A.client_secret !== void 0;
  if (Q.length === 0) return B ? "client_secret_post" : "none";
  if (B && Q.includes("client_secret_basic")) return "client_secret_basic";
  if (B && Q.includes("client_secret_post")) return "client_secret_post";
  if (Q.includes("none")) return "none";
  return B ? "client_secret_post" : "none"
}
// @from(Start 8811799, End 8812162)
function hQ2(A, Q, B, G) {
  let {
    client_id: Z,
    client_secret: I
  } = Q;
  switch (A) {
    case "client_secret_basic":
      $25(Z, I, B);
      return;
    case "client_secret_post":
      w25(Z, I, G);
      return;
    case "none":
      q25(Z, G);
      return;
    default:
      throw Error(`Unsupported client authentication method: ${A}`)
  }
}
// @from(Start 8812164, End 8812343)
function $25(A, Q, B) {
  if (!Q) throw Error("client_secret_basic authentication requires a client_secret");
  let G = btoa(`${A}:${Q}`);
  B.set("Authorization", `Basic ${G}`)
}
// @from(Start 8812345, End 8812428)
function w25(A, Q, B) {
  if (B.set("client_id", A), Q) B.set("client_secret", Q)
}
// @from(Start 8812430, End 8812476)
function q25(A, Q) {
  Q.set("client_id", A)
}
// @from(Start 8812477, End 8812912)
async function Ie1(A) {
  let Q = A instanceof Response ? A.status : void 0,
    B = A instanceof Response ? await A.text() : A;
  try {
    let G = WQ1.parse(JSON.parse(B)),
      {
        error: Z,
        error_description: I,
        error_uri: Y
      } = G;
    return new(xQ2[Z] || pl)(I || "", Y)
  } catch (G) {
    let Z = `${Q?`HTTP ${Q}: `:""}Invalid OAuth error response: ${G}. Raw body: ${B}`;
    return new pl(Z)
  }
}
// @from(Start 8812913, End 8813331)
async function rT(A, Q) {
  var B, G;
  try {
    return await Ze1(A, Q)
  } catch (Z) {
    if (Z instanceof CIA || Z instanceof zIA) return await ((B = A.invalidateCredentials) === null || B === void 0 ? void 0 : B.call(A, "all")), await Ze1(A, Q);
    else if (Z instanceof EIA) return await ((G = A.invalidateCredentials) === null || G === void 0 ? void 0 : G.call(A, "tokens")), await Ze1(A, Q);
    throw Z
  }
}
// @from(Start 8813332, End 8815414)
async function Ze1(A, {
  serverUrl: Q,
  authorizationCode: B,
  scope: G,
  resourceMetadataUrl: Z,
  fetchFn: I
}) {
  let Y, J;
  try {
    if (Y = await L25(Q, {
        resourceMetadataUrl: Z
      }, I), Y.authorization_servers && Y.authorization_servers.length > 0) J = Y.authorization_servers[0]
  } catch (C) {}
  if (!J) J = Q;
  let W = await N25(Q, A, Y),
    X = await XLA(J, {
      fetchFn: I
    }),
    V = await Promise.resolve(A.clientInformation());
  if (!V) {
    if (B !== void 0) throw Error("Existing OAuth client information is required when exchanging an authorization code");
    if (!A.saveClientInformation) throw Error("OAuth client information must be saveable for dynamic registration");
    let C = await S25(J, {
      metadata: X,
      clientMetadata: A.clientMetadata,
      fetchFn: I
    });
    await A.saveClientInformation(C), V = C
  }
  if (B !== void 0) {
    let C = await A.codeVerifier(),
      E = await j25(J, {
        metadata: X,
        clientInformation: V,
        authorizationCode: B,
        codeVerifier: C,
        redirectUri: A.redirectUrl,
        resource: W,
        addClientAuthentication: A.addClientAuthentication,
        fetchFn: I
      });
    return await A.saveTokens(E), "AUTHORIZED"
  }
  let F = await A.tokens();
  if (F === null || F === void 0 ? void 0 : F.refresh_token) try {
    let C = await Je1(J, {
      metadata: X,
      clientInformation: V,
      refreshToken: F.refresh_token,
      resource: W,
      addClientAuthentication: A.addClientAuthentication,
      fetchFn: I
    });
    return await A.saveTokens(C), "AUTHORIZED"
  } catch (C) {
    if (!(C instanceof vV) || C instanceof pl);
    else throw C
  }
  let K = A.state ? await A.state() : void 0,
    {
      authorizationUrl: D,
      codeVerifier: H
    } = await P25(J, {
      metadata: X,
      clientInformation: V,
      state: K,
      redirectUrl: A.redirectUrl,
      scope: G || A.clientMetadata.scope,
      resource: W
    });
  return await A.saveCodeVerifier(H), await A.redirectToAuthorization(D), "REDIRECT"
}
// @from(Start 8815415, End 8815805)
async function N25(A, Q, B) {
  let G = kQ2(A);
  if (Q.validateResourceURL) return await Q.validateResourceURL(G, B === null || B === void 0 ? void 0 : B.resource);
  if (!B) return;
  if (!yQ2({
      requestedResource: G,
      configuredResource: B.resource
    })) throw Error(`Protected resource ${B.resource} does not match expected ${G} (or origin)`);
  return new URL(B.resource)
}
// @from(Start 8815807, End 8816099)
function WLA(A) {
  let Q = A.headers.get("WWW-Authenticate");
  if (!Q) return;
  let [B, G] = Q.split(" ");
  if (B.toLowerCase() !== "bearer" || !G) return;
  let I = /resource_metadata="([^"]*)"/.exec(Q);
  if (!I) return;
  try {
    return new URL(I[1])
  } catch (Y) {
    return
  }
}
// @from(Start 8816100, End 8816618)
async function L25(A, Q, B = fetch) {
  let G = await R25(A, "oauth-protected-resource", B, {
    protocolVersion: Q === null || Q === void 0 ? void 0 : Q.protocolVersion,
    metadataUrl: Q === null || Q === void 0 ? void 0 : Q.resourceMetadataUrl
  });
  if (!G || G.status === 404) throw Error("Resource server does not implement OAuth 2.0 Protected Resource Metadata.");
  if (!G.ok) throw Error(`HTTP ${G.status} trying to load well-known OAuth protected resource metadata.`);
  return jQ2.parse(await G.json())
}
// @from(Start 8816619, End 8816836)
async function Ye1(A, Q, B = fetch) {
  try {
    return await B(A, {
      headers: Q
    })
  } catch (G) {
    if (G instanceof TypeError)
      if (Q) return Ye1(A, void 0, B);
      else return;
    throw G
  }
}
// @from(Start 8816838, End 8816995)
function M25(A, Q = "", B = {}) {
  if (Q.endsWith("/")) Q = Q.slice(0, -1);
  return B.prependPathname ? `${Q}/.well-known/${A}` : `/.well-known/${A}${Q}`
}
// @from(Start 8816996, End 8817097)
async function bQ2(A, Q, B = fetch) {
  return await Ye1(A, {
    "MCP-Protocol-Version": Q
  }, B)
}
// @from(Start 8817099, End 8817183)
function O25(A, Q) {
  return !A || A.status >= 400 && A.status < 500 && Q !== "/"
}
// @from(Start 8817184, End 8817837)
async function R25(A, Q, B, G) {
  var Z, I;
  let Y = new URL(A),
    J = (Z = G === null || G === void 0 ? void 0 : G.protocolVersion) !== null && Z !== void 0 ? Z : hl,
    W;
  if (G === null || G === void 0 ? void 0 : G.metadataUrl) W = new URL(G.metadataUrl);
  else {
    let V = M25(Q, Y.pathname);
    W = new URL(V, (I = G === null || G === void 0 ? void 0 : G.metadataServerUrl) !== null && I !== void 0 ? I : Y), W.search = Y.search
  }
  let X = await bQ2(W, J, B);
  if (!(G === null || G === void 0 ? void 0 : G.metadataUrl) && O25(X, Y.pathname)) {
    let V = new URL(`/.well-known/${Q}`, Y);
    X = await bQ2(V, J, B)
  }
  return X
}
// @from(Start 8817839, End 8818659)
function T25(A) {
  let Q = typeof A === "string" ? new URL(A) : A,
    B = Q.pathname !== "/",
    G = [];
  if (!B) return G.push({
    url: new URL("/.well-known/oauth-authorization-server", Q.origin),
    type: "oauth"
  }), G.push({
    url: new URL("/.well-known/openid-configuration", Q.origin),
    type: "oidc"
  }), G;
  let Z = Q.pathname;
  if (Z.endsWith("/")) Z = Z.slice(0, -1);
  return G.push({
    url: new URL(`/.well-known/oauth-authorization-server${Z}`, Q.origin),
    type: "oauth"
  }), G.push({
    url: new URL("/.well-known/oauth-authorization-server", Q.origin),
    type: "oauth"
  }), G.push({
    url: new URL(`/.well-known/openid-configuration${Z}`, Q.origin),
    type: "oidc"
  }), G.push({
    url: new URL(`${Z}/.well-known/openid-configuration`, Q.origin),
    type: "oidc"
  }), G
}
// @from(Start 8818660, End 8819502)
async function XLA(A, {
  fetchFn: Q = fetch,
  protocolVersion: B = hl
} = {}) {
  var G;
  let Z = {
      "MCP-Protocol-Version": B
    },
    I = T25(A);
  for (let {
      url: Y,
      type: J
    }
    of I) {
    let W = await Ye1(Y, Z, Q);
    if (!W) continue;
    if (!W.ok) {
      if (W.status >= 400 && W.status < 500) continue;
      throw Error(`HTTP ${W.status} trying to load ${J==="oauth"?"OAuth":"OpenID provider"} metadata from ${Y}`)
    }
    if (J === "oauth") return Be1.parse(await W.json());
    else {
      let X = SQ2.parse(await W.json());
      if (!((G = X.code_challenge_methods_supported) === null || G === void 0 ? void 0 : G.includes("S256"))) throw Error(`Incompatible OIDC provider at ${Y}: does not support S256 code challenge method required by MCP specification`);
      return X
    }
  }
  return
}
// @from(Start 8819503, End 8820659)
async function P25(A, {
  metadata: Q,
  clientInformation: B,
  redirectUrl: G,
  scope: Z,
  state: I,
  resource: Y
}) {
  let X;
  if (Q) {
    if (X = new URL(Q.authorization_endpoint), !Q.response_types_supported.includes("code")) throw Error("Incompatible auth server: does not support response type code");
    if (!Q.code_challenge_methods_supported || !Q.code_challenge_methods_supported.includes("S256")) throw Error("Incompatible auth server: does not support code challenge method S256")
  } else X = new URL("/authorize", A);
  let V = await Qe1(),
    F = V.code_verifier,
    K = V.code_challenge;
  if (X.searchParams.set("response_type", "code"), X.searchParams.set("client_id", B.client_id), X.searchParams.set("code_challenge", K), X.searchParams.set("code_challenge_method", "S256"), X.searchParams.set("redirect_uri", String(G)), I) X.searchParams.set("state", I);
  if (Z) X.searchParams.set("scope", Z);
  if (Z === null || Z === void 0 ? void 0 : Z.includes("offline_access")) X.searchParams.append("prompt", "consent");
  if (Y) X.searchParams.set("resource", Y.href);
  return {
    authorizationUrl: X,
    codeVerifier: F
  }
}
// @from(Start 8820660, End 8821925)
async function j25(A, {
  metadata: Q,
  clientInformation: B,
  authorizationCode: G,
  codeVerifier: Z,
  redirectUri: I,
  resource: Y,
  addClientAuthentication: J,
  fetchFn: W
}) {
  var X;
  let V = "authorization_code",
    F = (Q === null || Q === void 0 ? void 0 : Q.token_endpoint) ? new URL(Q.token_endpoint) : new URL("/token", A);
  if ((Q === null || Q === void 0 ? void 0 : Q.grant_types_supported) && !Q.grant_types_supported.includes("authorization_code")) throw Error("Incompatible auth server: does not support grant type authorization_code");
  let K = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    }),
    D = new URLSearchParams({
      grant_type: "authorization_code",
      code: G,
      code_verifier: Z,
      redirect_uri: String(I)
    });
  if (J) J(K, D, A, Q);
  else {
    let C = (X = Q === null || Q === void 0 ? void 0 : Q.token_endpoint_auth_methods_supported) !== null && X !== void 0 ? X : [],
      E = fQ2(B, C);
    hQ2(E, B, K, D)
  }
  if (Y) D.set("resource", Y.href);
  let H = await (W !== null && W !== void 0 ? W : fetch)(F, {
    method: "POST",
    headers: K,
    body: D
  });
  if (!H.ok) throw await Ie1(H);
  return Ge1.parse(await H.json())
}
// @from(Start 8821926, End 8823012)
async function Je1(A, {
  metadata: Q,
  clientInformation: B,
  refreshToken: G,
  resource: Z,
  addClientAuthentication: I,
  fetchFn: Y
}) {
  var J;
  let W = "refresh_token",
    X;
  if (Q) {
    if (X = new URL(Q.token_endpoint), Q.grant_types_supported && !Q.grant_types_supported.includes("refresh_token")) throw Error("Incompatible auth server: does not support grant type refresh_token")
  } else X = new URL("/token", A);
  let V = new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    }),
    F = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: G
    });
  if (I) I(V, F, A, Q);
  else {
    let D = (J = Q === null || Q === void 0 ? void 0 : Q.token_endpoint_auth_methods_supported) !== null && J !== void 0 ? J : [],
      H = fQ2(B, D);
    hQ2(H, B, V, F)
  }
  if (Z) F.set("resource", Z.href);
  let K = await (Y !== null && Y !== void 0 ? Y : fetch)(X, {
    method: "POST",
    headers: V,
    body: F
  });
  if (!K.ok) throw await Ie1(K);
  return Ge1.parse({
    refresh_token: G,
    ...await K.json()
  })
}
// @from(Start 8823013, End 8823559)
async function S25(A, {
  metadata: Q,
  clientMetadata: B,
  fetchFn: G
}) {
  let Z;
  if (Q) {
    if (!Q.registration_endpoint) throw Error("Incompatible auth server: does not support dynamic client registration");
    Z = new URL(Q.registration_endpoint)
  } else Z = new URL("/register", A);
  let I = await (G !== null && G !== void 0 ? G : fetch)(Z, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(B)
  });
  if (!I.ok) throw await Ie1(I);
  return _Q2.parse(await I.json())
}
// @from(Start 8823564, End 8823566)
rH
// @from(Start 8823572, End 8823758)
VLA = L(() => {
  PQ2();
  SD();
  XQ1();
  XQ1();
  vQ2();
  rH = class rH extends Error {
    constructor(A) {
      super(A !== null && A !== void 0 ? A : "Unauthorized")
    }
  }
})
// @from(Start 8823760, End 8828934)
class NQ1 {
  constructor(A, Q) {
    this._url = A, this._resourceMetadataUrl = void 0, this._eventSourceInit = Q === null || Q === void 0 ? void 0 : Q.eventSourceInit, this._requestInit = Q === null || Q === void 0 ? void 0 : Q.requestInit, this._authProvider = Q === null || Q === void 0 ? void 0 : Q.authProvider, this._fetch = Q === null || Q === void 0 ? void 0 : Q.fetch
  }
  async _authThenStart() {
    var A;
    if (!this._authProvider) throw new rH("No auth provider");
    let Q;
    try {
      Q = await rT(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        fetchFn: this._fetch
      })
    } catch (B) {
      throw (A = this.onerror) === null || A === void 0 || A.call(this, B), B
    }
    if (Q !== "AUTHORIZED") throw new rH;
    return await this._startOrAuth()
  }
  async _commonHeaders() {
    var A;
    let Q = {};
    if (this._authProvider) {
      let B = await this._authProvider.tokens();
      if (B) Q.Authorization = `Bearer ${B.access_token}`
    }
    if (this._protocolVersion) Q["mcp-protocol-version"] = this._protocolVersion;
    return new Headers({
      ...Q,
      ...(A = this._requestInit) === null || A === void 0 ? void 0 : A.headers
    })
  }
  _startOrAuth() {
    var A, Q, B;
    let G = (B = (Q = (A = this === null || this === void 0 ? void 0 : this._eventSourceInit) === null || A === void 0 ? void 0 : A.fetch) !== null && Q !== void 0 ? Q : this._fetch) !== null && B !== void 0 ? B : fetch;
    return new Promise((Z, I) => {
      this._eventSource = new HIA(this._url.href, {
        ...this._eventSourceInit,
        fetch: async (Y, J) => {
          let W = await this._commonHeaders();
          W.set("Accept", "text/event-stream");
          let X = await G(Y, {
            ...J,
            headers: W
          });
          if (X.status === 401 && X.headers.has("www-authenticate")) this._resourceMetadataUrl = WLA(X);
          return X
        }
      }), this._abortController = new AbortController, this._eventSource.onerror = (Y) => {
        var J;
        if (Y.code === 401 && this._authProvider) {
          this._authThenStart().then(Z, I);
          return
        }
        let W = new gQ2(Y.code, Y.message, Y);
        I(W), (J = this.onerror) === null || J === void 0 || J.call(this, W)
      }, this._eventSource.onopen = () => {}, this._eventSource.addEventListener("endpoint", (Y) => {
        var J;
        let W = Y;
        try {
          if (this._endpoint = new URL(W.data, this._url), this._endpoint.origin !== this._url.origin) throw Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)
        } catch (X) {
          I(X), (J = this.onerror) === null || J === void 0 || J.call(this, X), this.close();
          return
        }
        Z()
      }), this._eventSource.onmessage = (Y) => {
        var J, W;
        let X = Y,
          V;
        try {
          V = Mk.parse(JSON.parse(X.data))
        } catch (F) {
          (J = this.onerror) === null || J === void 0 || J.call(this, F);
          return
        }(W = this.onmessage) === null || W === void 0 || W.call(this, V)
      }
    })
  }
  async start() {
    if (this._eventSource) throw Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    return await this._startOrAuth()
  }
  async finishAuth(A) {
    if (!this._authProvider) throw new rH("No auth provider");
    if (await rT(this._authProvider, {
        serverUrl: this._url,
        authorizationCode: A,
        resourceMetadataUrl: this._resourceMetadataUrl,
        fetchFn: this._fetch
      }) !== "AUTHORIZED") throw new rH("Failed to authorize")
  }
  async close() {
    var A, Q, B;
    (A = this._abortController) === null || A === void 0 || A.abort(), (Q = this._eventSource) === null || Q === void 0 || Q.close(), (B = this.onclose) === null || B === void 0 || B.call(this)
  }
  async send(A) {
    var Q, B, G;
    if (!this._endpoint) throw Error("Not connected");
    try {
      let Z = await this._commonHeaders();
      Z.set("content-type", "application/json");
      let I = {
          ...this._requestInit,
          method: "POST",
          headers: Z,
          body: JSON.stringify(A),
          signal: (Q = this._abortController) === null || Q === void 0 ? void 0 : Q.signal
        },
        Y = await ((B = this._fetch) !== null && B !== void 0 ? B : fetch)(this._endpoint, I);
      if (!Y.ok) {
        if (Y.status === 401 && this._authProvider) {
          if (this._resourceMetadataUrl = WLA(Y), await rT(this._authProvider, {
              serverUrl: this._url,
              resourceMetadataUrl: this._resourceMetadataUrl,
              fetchFn: this._fetch
            }) !== "AUTHORIZED") throw new rH;
          return this.send(A)
        }
        let J = await Y.text().catch(() => null);
        throw Error(`Error POSTing to endpoint (HTTP ${Y.status}): ${J}`)
      }
    } catch (Z) {
      throw (G = this.onerror) === null || G === void 0 || G.call(this, Z), Z
    }
  }
  setProtocolVersion(A) {
    this._protocolVersion = A
  }
}
// @from(Start 8828939, End 8828942)
gQ2
// @from(Start 8828948, End 8829131)
uQ2 = L(() => {
  TQ2();
  SD();
  VLA();
  gQ2 = class gQ2 extends Error {
    constructor(A, Q, B) {
      super(`SSE error: ${Q}`);
      this.code = A, this.event = B
    }
  }
})
// @from(Start 8829137, End 8829140)
We1
// @from(Start 8829146, End 8829705)
mQ2 = L(() => {
  ct1();
  We1 = class We1 extends TransformStream {
    constructor({
      onError: A,
      onRetry: Q,
      onComment: B
    } = {}) {
      let G;
      super({
        start(Z) {
          G = IQ1({
            onEvent: (I) => {
              Z.enqueue(I)
            },
            onError(I) {
              A === "terminate" ? Z.error(I) : typeof A == "function" && A(I)
            },
            onRetry: Q,
            onComment: B
          })
        },
        transform(Z) {
          G.feed(Z)
        }
      })
    }
  }
})
// @from(Start 8829707, End 8838675)
class Xe1 {
  constructor(A, Q) {
    var B;
    this._url = A, this._resourceMetadataUrl = void 0, this._requestInit = Q === null || Q === void 0 ? void 0 : Q.requestInit, this._authProvider = Q === null || Q === void 0 ? void 0 : Q.authProvider, this._fetch = Q === null || Q === void 0 ? void 0 : Q.fetch, this._sessionId = Q === null || Q === void 0 ? void 0 : Q.sessionId, this._reconnectionOptions = (B = Q === null || Q === void 0 ? void 0 : Q.reconnectionOptions) !== null && B !== void 0 ? B : _25
  }
  async _authThenStart() {
    var A;
    if (!this._authProvider) throw new rH("No auth provider");
    let Q;
    try {
      Q = await rT(this._authProvider, {
        serverUrl: this._url,
        resourceMetadataUrl: this._resourceMetadataUrl,
        fetchFn: this._fetch
      })
    } catch (B) {
      throw (A = this.onerror) === null || A === void 0 || A.call(this, B), B
    }
    if (Q !== "AUTHORIZED") throw new rH;
    return await this._startOrAuthSse({
      resumptionToken: void 0
    })
  }
  async _commonHeaders() {
    var A;
    let Q = {};
    if (this._authProvider) {
      let G = await this._authProvider.tokens();
      if (G) Q.Authorization = `Bearer ${G.access_token}`
    }
    if (this._sessionId) Q["mcp-session-id"] = this._sessionId;
    if (this._protocolVersion) Q["mcp-protocol-version"] = this._protocolVersion;
    let B = this._normalizeHeaders((A = this._requestInit) === null || A === void 0 ? void 0 : A.headers);
    return new Headers({
      ...Q,
      ...B
    })
  }
  async _startOrAuthSse(A) {
    var Q, B, G;
    let {
      resumptionToken: Z
    } = A;
    try {
      let I = await this._commonHeaders();
      if (I.set("Accept", "text/event-stream"), Z) I.set("last-event-id", Z);
      let Y = await ((Q = this._fetch) !== null && Q !== void 0 ? Q : fetch)(this._url, {
        method: "GET",
        headers: I,
        signal: (B = this._abortController) === null || B === void 0 ? void 0 : B.signal
      });
      if (!Y.ok) {
        if (Y.status === 401 && this._authProvider) return await this._authThenStart();
        if (Y.status === 405) return;
        throw new LQ1(Y.status, `Failed to open SSE stream: ${Y.statusText}`)
      }
      this._handleSseStream(Y.body, A, !0)
    } catch (I) {
      throw (G = this.onerror) === null || G === void 0 || G.call(this, I), I
    }
  }
  _getNextReconnectionDelay(A) {
    let Q = this._reconnectionOptions.initialReconnectionDelay,
      B = this._reconnectionOptions.reconnectionDelayGrowFactor,
      G = this._reconnectionOptions.maxReconnectionDelay;
    return Math.min(Q * Math.pow(B, A), G)
  }
  _normalizeHeaders(A) {
    if (!A) return {};
    if (A instanceof Headers) return Object.fromEntries(A.entries());
    if (Array.isArray(A)) return Object.fromEntries(A);
    return {
      ...A
    }
  }
  _scheduleReconnection(A, Q = 0) {
    var B;
    let G = this._reconnectionOptions.maxRetries;
    if (G > 0 && Q >= G) {
      (B = this.onerror) === null || B === void 0 || B.call(this, Error(`Maximum reconnection attempts (${G}) exceeded.`));
      return
    }
    let Z = this._getNextReconnectionDelay(Q);
    setTimeout(() => {
      this._startOrAuthSse(A).catch((I) => {
        var Y;
        (Y = this.onerror) === null || Y === void 0 || Y.call(this, Error(`Failed to reconnect SSE stream: ${I instanceof Error?I.message:String(I)}`)), this._scheduleReconnection(A, Q + 1)
      })
    }, Z)
  }
  _handleSseStream(A, Q, B) {
    if (!A) return;
    let {
      onresumptiontoken: G,
      replayMessageId: Z
    } = Q, I;
    (async () => {
      var J, W, X, V;
      try {
        let F = A.pipeThrough(new TextDecoderStream).pipeThrough(new We1).getReader();
        while (!0) {
          let {
            value: K,
            done: D
          } = await F.read();
          if (D) break;
          if (K.id) I = K.id, G === null || G === void 0 || G(K.id);
          if (!K.event || K.event === "message") try {
            let H = Mk.parse(JSON.parse(K.data));
            if (Z !== void 0 && oNA(H)) H.id = Z;
            (J = this.onmessage) === null || J === void 0 || J.call(this, H)
          } catch (H) {
            (W = this.onerror) === null || W === void 0 || W.call(this, H)
          }
        }
      } catch (F) {
        if ((X = this.onerror) === null || X === void 0 || X.call(this, Error(`SSE stream disconnected: ${F}`)), B && this._abortController && !this._abortController.signal.aborted) try {
          this._scheduleReconnection({
            resumptionToken: I,
            onresumptiontoken: G,
            replayMessageId: Z
          }, 0)
        } catch (K) {
          (V = this.onerror) === null || V === void 0 || V.call(this, Error(`Failed to reconnect: ${K instanceof Error?K.message:String(K)}`))
        }
      }
    })()
  }
  async start() {
    if (this._abortController) throw Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
    this._abortController = new AbortController
  }
  async finishAuth(A) {
    if (!this._authProvider) throw new rH("No auth provider");
    if (await rT(this._authProvider, {
        serverUrl: this._url,
        authorizationCode: A,
        resourceMetadataUrl: this._resourceMetadataUrl,
        fetchFn: this._fetch
      }) !== "AUTHORIZED") throw new rH("Failed to authorize")
  }
  async close() {
    var A, Q;
    (A = this._abortController) === null || A === void 0 || A.abort(), (Q = this.onclose) === null || Q === void 0 || Q.call(this)
  }
  async send(A, Q) {
    var B, G, Z, I;
    try {
      let {
        resumptionToken: Y,
        onresumptiontoken: J
      } = Q || {};
      if (Y) {
        this._startOrAuthSse({
          resumptionToken: Y,
          replayMessageId: j01(A) ? A.id : void 0
        }).catch((C) => {
          var E;
          return (E = this.onerror) === null || E === void 0 ? void 0 : E.call(this, C)
        });
        return
      }
      let W = await this._commonHeaders();
      W.set("content-type", "application/json"), W.set("accept", "application/json, text/event-stream");
      let X = {
          ...this._requestInit,
          method: "POST",
          headers: W,
          body: JSON.stringify(A),
          signal: (B = this._abortController) === null || B === void 0 ? void 0 : B.signal
        },
        V = await ((G = this._fetch) !== null && G !== void 0 ? G : fetch)(this._url, X),
        F = V.headers.get("mcp-session-id");
      if (F) this._sessionId = F;
      if (!V.ok) {
        if (V.status === 401 && this._authProvider) {
          if (this._resourceMetadataUrl = WLA(V), await rT(this._authProvider, {
              serverUrl: this._url,
              resourceMetadataUrl: this._resourceMetadataUrl,
              fetchFn: this._fetch
            }) !== "AUTHORIZED") throw new rH;
          return this.send(A)
        }
        let C = await V.text().catch(() => null);
        throw Error(`Error POSTing to endpoint (HTTP ${V.status}): ${C}`)
      }
      if (V.status === 202) {
        if (K12(A)) this._startOrAuthSse({
          resumptionToken: void 0
        }).catch((C) => {
          var E;
          return (E = this.onerror) === null || E === void 0 ? void 0 : E.call(this, C)
        });
        return
      }
      let D = (Array.isArray(A) ? A : [A]).filter((C) => ("method" in C) && ("id" in C) && C.id !== void 0).length > 0,
        H = V.headers.get("content-type");
      if (D)
        if (H === null || H === void 0 ? void 0 : H.includes("text/event-stream")) this._handleSseStream(V.body, {
          onresumptiontoken: J
        }, !1);
        else if (H === null || H === void 0 ? void 0 : H.includes("application/json")) {
        let C = await V.json(),
          E = Array.isArray(C) ? C.map((U) => Mk.parse(U)) : [Mk.parse(C)];
        for (let U of E)(Z = this.onmessage) === null || Z === void 0 || Z.call(this, U)
      } else throw new LQ1(-1, `Unexpected content type: ${H}`)
    } catch (Y) {
      throw (I = this.onerror) === null || I === void 0 || I.call(this, Y), Y
    }
  }
  get sessionId() {
    return this._sessionId
  }
  async terminateSession() {
    var A, Q, B;
    if (!this._sessionId) return;
    try {
      let G = await this._commonHeaders(),
        Z = {
          ...this._requestInit,
          method: "DELETE",
          headers: G,
          signal: (A = this._abortController) === null || A === void 0 ? void 0 : A.signal
        },
        I = await ((Q = this._fetch) !== null && Q !== void 0 ? Q : fetch)(this._url, Z);
      if (!I.ok && I.status !== 405) throw new LQ1(I.status, `Failed to terminate session: ${I.statusText}`);
      this._sessionId = void 0
    } catch (G) {
      throw (B = this.onerror) === null || B === void 0 || B.call(this, G), G
    }
  }
  setProtocolVersion(A) {
    this._protocolVersion = A
  }
  get protocolVersion() {
    return this._protocolVersion
  }
}
// @from(Start 8838680, End 8838683)
_25
// @from(Start 8838685, End 8838688)
LQ1
// @from(Start 8838694, End 8839010)
dQ2 = L(() => {
  SD();
  VLA();
  mQ2();
  _25 = {
    initialReconnectionDelay: 1000,
    maxReconnectionDelay: 30000,
    reconnectionDelayGrowFactor: 1.5,
    maxRetries: 2
  };
  LQ1 = class LQ1 extends Error {
    constructor(A, Q) {
      super(`Streamable HTTP error: ${Q}`);
      this.code = A
    }
  }
})
// @from(Start 8839068, End 8840076)
function y25(A) {
  let Q = FLA.homedir(),
    B = [],
    G = pQ2[A.toLowerCase()];
  if (!G) return B;
  let Z = process.env.APPDATA || nF.join(Q, "AppData", "Roaming"),
    I = process.env.LOCALAPPDATA || nF.join(Q, "AppData", "Local");
  switch (FLA.platform()) {
    case "darwin":
      if (B.push(nF.join(Q, "Library", "Application Support", "JetBrains"), nF.join(Q, "Library", "Application Support")), A.toLowerCase() === "androidstudio") B.push(nF.join(Q, "Library", "Application Support", "Google"));
      break;
    case "win32":
      if (B.push(nF.join(Z, "JetBrains"), nF.join(I, "JetBrains"), nF.join(Z)), A.toLowerCase() === "androidstudio") B.push(nF.join(I, "Google"));
      break;
    case "linux":
      B.push(nF.join(Q, ".config", "JetBrains"), nF.join(Q, ".local", "share", "JetBrains"));
      for (let Y of G) B.push(nF.join(Q, "." + Y));
      if (A.toLowerCase() === "androidstudio") B.push(nF.join(Q, ".config", "Google"));
      break;
    default:
      break
  }
  return B
}
// @from(Start 8840078, End 8840655)
function x25(A) {
  let Q = [],
    B = RA(),
    G = y25(A),
    Z = pQ2[A.toLowerCase()];
  if (!Z) return Q;
  for (let I of G) {
    if (!B.existsSync(I)) continue;
    for (let Y of Z) {
      let J = new RegExp("^" + Y + ".*$"),
        W = B.readdirSync(I).filter((X) => J.test(X.name) && B.statSync(nF.join(I, X.name)).isDirectory()).map((X) => nF.join(I, X.name));
      for (let X of W) {
        let V = FLA.platform() === "linux" ? X : nF.join(X, "plugins");
        if (B.existsSync(V)) Q.push(V)
      }
    }
  }
  return Q.filter((I, Y) => Q.indexOf(I) === Y)
}
// @from(Start 8840657, End 8840798)
function Ve1(A) {
  let Q = x25(A);
  for (let B of Q) {
    let G = nF.join(B, k25);
    if (RA().existsSync(G)) return !0
  }
  return !1
}
// @from(Start 8840800, End 8840873)
function lQ2(A, Q = !1) {
  if (Q) cQ2.cache.delete(A);
  return cQ2(A)
}
// @from(Start 8840878, End 8840914)
k25 = "claude-code-jetbrains-plugin"
// @from(Start 8840918, End 8840921)
pQ2
// @from(Start 8840923, End 8840926)
cQ2
// @from(Start 8840932, End 8841406)
Fe1 = L(() => {
  AQ();
  l2();
  pQ2 = {
    pycharm: ["PyCharm"],
    intellij: ["IntelliJIdea", "IdeaIC"],
    webstorm: ["WebStorm"],
    phpstorm: ["PhpStorm"],
    rubymine: ["RubyMine"],
    clion: ["CLion"],
    goland: ["GoLand"],
    rider: ["Rider"],
    datagrip: ["DataGrip"],
    appcode: ["AppCode"],
    dataspell: ["DataSpell"],
    aqua: ["Aqua"],
    gateway: ["Gateway"],
    fleet: ["Fleet"],
    androidstudio: ["AndroidStudio"]
  };
  cQ2 = s1(Ve1)
})
// @from(Start 8841409, End 8843614)
function iQ2({
  onDone: A,
  installationStatus: Q
}) {
  let B = EQ();
  v25(), f1((X, V) => {
    if (V.escape || V.return) A()
  });
  let G = Q?.ideType ?? UIA(),
    Z = oT(G),
    I = aF(G),
    Y = Q?.installedVersion,
    J = Z ? "plugin" : "extension",
    W = d0.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K";
  return DG.default.createElement(DG.default.Fragment, null, DG.default.createElement(S, {
    flexDirection: "column"
  }, DG.default.createElement(S, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "ide",
    paddingLeft: 1,
    paddingRight: 1,
    gap: 1
  }, DG.default.createElement(S, null, DG.default.createElement($, {
    color: "claude"
  }, "✻ "), DG.default.createElement(S, {
    flexDirection: "column"
  }, DG.default.createElement($, null, "Welcome to ", DG.default.createElement($, {
    bold: !0
  }, "Claude Code"), " for", " ", DG.default.createElement($, {
    color: "ide",
    bold: !0
  }, I)), Y && DG.default.createElement($, {
    dimColor: !0
  }, "installed ", J, " v", Y))), DG.default.createElement(S, {
    flexDirection: "column",
    paddingLeft: 1,
    gap: 1
  }, DG.default.createElement($, null, "• Claude has context of", " ", DG.default.createElement($, {
    color: "suggestion"
  }, "⧉ open files"), " and", " ", DG.default.createElement($, {
    color: "suggestion"
  }, "⧉ selected lines")), DG.default.createElement($, null, "• Review Claude Code's changes", " ", DG.default.createElement($, {
    color: "diffAddedWord"
  }, "+11"), " ", DG.default.createElement($, {
    color: "diffRemovedWord"
  }, "-22"), " in the comfort of your IDE"), DG.default.createElement($, null, "• Cmd+Esc", DG.default.createElement($, {
    dimColor: !0
  }, " for Quick Launch")), DG.default.createElement($, null, "• ", W, DG.default.createElement($, {
    dimColor: !0
  }, " to reference files or lines in your input")))), DG.default.createElement(S, {
    marginLeft: 3
  }, DG.default.createElement($, {
    dimColor: !0
  }, B.pending ? DG.default.createElement(DG.default.Fragment, null, "Press ", B.keyName, " again to exit") : DG.default.createElement(DG.default.Fragment, null, "Press Enter to continue")))))
}
// @from(Start 8843616, End 8843733)
function MQ1() {
  let A = N1(),
    Q = WU.terminal || "unknown";
  return A.hasIdeOnboardingBeenShown?.[Q] === !0
}
// @from(Start 8843735, End 8843937)
function v25() {
  if (MQ1()) return;
  let A = WU.terminal || "unknown",
    Q = N1();
  c0({
    ...Q,
    hasIdeOnboardingBeenShown: {
      ...Q.hasIdeOnboardingBeenShown,
      [A]: !0
    }
  })
}
// @from(Start 8843942, End 8843944)
DG
// @from(Start 8843950, End 8844035)
Ke1 = L(() => {
  hA();
  nY();
  c5();
  Q4();
  jQ();
  It();
  DG = BA(VA(), 1)
})
// @from(Start 8844097, End 8844841)
class $IA {
  wslDistroName;
  constructor(A) {
    this.wslDistroName = A
  }
  toLocalPath(A) {
    if (!A) return A;
    if (this.wslDistroName) {
      let Q = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
      if (Q && Q[1] !== this.wslDistroName) return A
    }
    try {
      return nQ2("wslpath", ["-u", A], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim()
    } catch {
      return A.replace(/\\/g, "/").replace(/^([A-Z]):/i, (Q, B) => `/mnt/${B.toLowerCase()}`)
    }
  }
  toIDEPath(A) {
    if (!A) return A;
    try {
      return nQ2("wslpath", ["-w", A], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim()
    } catch {
      return A
    }
  }
}
// @from(Start 8844843, End 8844969)
function aQ2(A, Q) {
  let B = A.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
  if (B) return B[1] === Q;
  return !0
}
// @from(Start 8844974, End 8844988)
De1 = () => {}
// @from(Start 8845226, End 8845317)
function AB2(A) {
  try {
    return process.kill(A, 0), !0
  } catch {
    return !1
  }
}
// @from(Start 8845319, End 8845680)
function u25(A) {
  if (!AB2(A)) return !1;
  if (!bV()) return !0;
  try {
    let Q = process.ppid;
    for (let B = 0; B < 10; B++) {
      if (Q === A) return !0;
      if (Q === 0 || Q === 1) break;
      let G = kiA(Q),
        Z = G ? parseInt(G) : null;
      if (!Z || Z === Q) break;
      Q = Z
    }
    return !1
  } catch (Q) {
    return !1
  }
}
// @from(Start 8845682, End 8845777)
function PQ1(A) {
  if (!A) return !1;
  let Q = wIA[A];
  return Q && Q.ideKind === "vscode"
}
// @from(Start 8845779, End 8845876)
function oT(A) {
  if (!A) return !1;
  let Q = wIA[A];
  return Q && Q.ideKind === "jetbrains"
}
// @from(Start 8845878, End 8845943)
function UIA() {
  if (!bV()) return null;
  return d0.terminal
}
// @from(Start 8845945, End 8846418)
function jQ1() {
  try {
    return m25().flatMap((B) => {
      try {
        return RA().readdirSync(B).filter((G) => G.name.endsWith(".lock")).map((G) => {
          let Z = He1(B, G.name);
          return {
            path: Z,
            mtime: RA().statSync(Z).mtime
          }
        })
      } catch (G) {
        return AA(G), []
      }
    }).sort((B, G) => G.mtime.getTime() - B.mtime.getTime()).map((B) => B.path)
  } catch (A) {
    return AA(A), []
  }
}
// @from(Start 8846420, End 8847149)
function QB2(A) {
  try {
    let Q = RA().readFileSync(A, {
        encoding: "utf-8"
      }),
      B = [],
      G, Z, I = !1,
      Y = !1,
      J;
    try {
      let V = JSON.parse(Q);
      if (V.workspaceFolders) B = V.workspaceFolders;
      G = V.pid, Z = V.ideName, I = V.transport === "ws", Y = V.runningInWindows === !0, J = V.authToken
    } catch (V) {
      B = Q.split(`
`).map((F) => F.trim())
    }
    let W = A.split(RQ1).pop();
    if (!W) return null;
    let X = W.replace(".lock", "");
    return {
      workspaceFolders: B,
      port: parseInt(X),
      pid: G,
      ideName: Z,
      useWebSocket: I,
      runningInWindows: Y,
      authToken: J
    }
  } catch (Q) {
    return AA(Q), null
  }
}
// @from(Start 8847150, End 8847524)
async function Ce1(A, Q, B = 500) {
  try {
    return new Promise((G) => {
      let Z = g25({
        host: A,
        port: Q,
        timeout: B
      });
      Z.on("connect", () => {
        Z.destroy(), G(!0)
      }), Z.on("error", () => {
        G(!1)
      }), Z.on("timeout", () => {
        Z.destroy(), G(!1)
      })
    })
  } catch (G) {
    return !1
  }
}
// @from(Start 8847526, End 8848508)
function m25() {
  let A = [],
    Q = RA(),
    B = dQ(),
    G = He1(MQ(), "ide");
  if (Q.existsSync(G)) A.push(G);
  if (B !== "wsl") return A;
  let Z = process.env.USERPROFILE;
  if (!Z) try {
    let I = tG("powershell.exe -Command '$env:USERPROFILE'");
    if (I) Z = I.trim()
  } catch {
    g("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete")
  }
  if (Z) {
    let Y = new $IA(process.env.WSL_DISTRO_NAME).toLocalPath(Z),
      J = TQ1(Y, ".claude", "ide");
    if (Q.existsSync(J)) A.push(J)
  }
  try {
    if (Q.existsSync("/mnt/c/Users")) {
      let Y = Q.readdirSync("/mnt/c/Users");
      for (let J of Y) {
        if (J.name === "Public" || J.name === "Default" || J.name === "Default User" || J.name === "All Users") continue;
        let W = He1("/mnt/c/Users", J.name, ".claude", "ide");
        if (Q.existsSync(W)) A.push(W)
      }
    }
  } catch (I) {
    AA(I instanceof Error ? I : Error(String(I)))
  }
  return A
}
// @from(Start 8848509, End 8849121)
async function d25() {
  try {
    let A = jQ1();
    for (let Q of A) {
      let B = QB2(Q);
      if (!B) {
        try {
          RA().unlinkSync(Q)
        } catch (I) {
          AA(I)
        }
        continue
      }
      let G = await XB2(B.runningInWindows, B.port),
        Z = !1;
      if (B.pid) {
        if (!AB2(B.pid)) {
          if (dQ() !== "wsl") Z = !0;
          else if (!await Ce1(G, B.port)) Z = !0
        }
      } else if (!await Ce1(G, B.port)) Z = !0;
      if (Z) try {
        RA().unlinkSync(Q)
      } catch (I) {
        AA(I)
      }
    }
  } catch (A) {
    AA(A)
  }
}
// @from(Start 8849122, End 8849631)
async function p25(A) {
  try {
    let Q = await i25(A);
    GA("tengu_ext_installed", {});
    let B = N1();
    if (!B.diffTool) c0({
      ...B,
      diffTool: "auto"
    });
    return {
      installed: !0,
      error: null,
      installedVersion: Q,
      ideType: A
    }
  } catch (Q) {
    GA("tengu_ext_install_error", {});
    let B = Q instanceof Error ? Q.message : String(Q);
    return AA(Q), {
      installed: !1,
      error: B,
      installedVersion: null,
      ideType: A
    }
  }
}
// @from(Start 8849632, End 8849966)
async function sQ2() {
  if (OQ1) OQ1.abort();
  OQ1 = o9();
  let A = OQ1.signal;
  await d25();
  let Q = Date.now();
  while (Date.now() - Q < 30000 && !A.aborted) {
    let B = await HLA(!1);
    if (A.aborted) return null;
    if (B.length === 1) return B[0];
    await new Promise((G) => setTimeout(G, 1000))
  }
  return null
}
// @from(Start 8849967, End 8851746)
async function HLA(A) {
  let Q = [];
  try {
    let B = process.env.CLAUDE_CODE_SSE_PORT,
      G = B ? parseInt(B) : null,
      Z = uQ(),
      I = jQ1();
    for (let Y of I) {
      let J = QB2(Y);
      if (!J) continue;
      if (dQ() !== "wsl" && bV() && (!J.pid || !u25(J.pid))) continue;
      let W = !1;
      if (process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK === "true") W = !0;
      else if (J.port === G) W = !0;
      else W = J.workspaceFolders.some((K) => {
        if (!K) return !1;
        let D = K;
        if (dQ() === "wsl" && J.runningInWindows && process.env.WSL_DISTRO_NAME) {
          if (!aQ2(K, process.env.WSL_DISTRO_NAME)) return !1;
          let C = TQ1(D);
          if (Z === C || Z.startsWith(C + RQ1)) return !0;
          D = new $IA(process.env.WSL_DISTRO_NAME).toLocalPath(K)
        }
        let H = TQ1(D);
        if (dQ() === "windows") {
          let C = Z.replace(/^[a-zA-Z]:/, (U) => U.toUpperCase()),
            E = H.replace(/^[a-zA-Z]:/, (U) => U.toUpperCase());
          return C === E || C.startsWith(E + RQ1)
        }
        return Z === H || Z.startsWith(H + RQ1)
      });
      if (!W && !A) continue;
      let X = J.ideName ?? (bV() ? aF(WU.terminal) : "IDE"),
        V = await XB2(J.runningInWindows, J.port),
        F;
      if (J.useWebSocket) F = `ws://${V}:${J.port}`;
      else F = `http://${V}:${J.port}/sse`;
      Q.push({
        url: F,
        name: X,
        workspaceFolders: J.workspaceFolders,
        port: J.port,
        isValid: W,
        authToken: J.authToken,
        ideRunningInWindows: J.runningInWindows
      })
    }
    if (!A && G) {
      let Y = Q.filter((J) => J.isValid && J.port === G);
      if (Y.length === 1) return Y
    }
  } catch (B) {
    AA(B)
  }
  return Q
}
// @from(Start 8851747, End 8851874)
async function BB2(A) {
  await A.notification({
    method: "ide_connected",
    params: {
      pid: process.pid
    }
  })
}
// @from(Start 8851876, End 8851962)
function SQ1(A) {
  return A.some((Q) => Q.type === "connected" && Q.name === "ide")
}
// @from(Start 8851963, End 8852217)
async function rQ2(A) {
  if (PQ1(A)) {
    let Q = GB2(A);
    if (Q) try {
      if ((await A3(Q, ["--list-extensions"], {
          env: Ee1()
        })).stdout?.includes(l25)) return !0
    } catch {}
  } else if (oT(A)) return Ve1(A);
  return !1
}
// @from(Start 8852218, End 8852697)
async function i25(A) {
  if (PQ1(A)) {
    let Q = GB2(A);
    if (Q) {
      let B = await n25(Q);
      if (!B || eQ2.lt(B, oQ2())) {
        await new Promise((Z) => {
          setTimeout(Z, 500)
        });
        let G = await A3(Q, ["--force", "--install-extension", "anthropic.claude-code"], {
          env: Ee1()
        });
        if (G.code !== 0) throw Error(`${G.code}: ${G.error} ${G.stderr}`);
        B = oQ2()
      }
      return B
    }
  }
  return null
}
// @from(Start 8852699, End 8852800)
function Ee1() {
  if (dQ() === "linux") return {
    ...process.env,
    DISPLAY: ""
  };
  return
}
// @from(Start 8852802, End 8853139)
function oQ2() {
  return {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION
}
// @from(Start 8853140, End 8853418)
async function n25(A) {
  let {
    stdout: Q
  } = await QQ(A, ["--list-extensions", "--show-versions"], {
    env: Ee1()
  }), B = Q?.split(`
`) || [];
  for (let G of B) {
    let [Z, I] = G.split("@");
    if (Z === "anthropic.claude-code" && I) return I
  }
  return null
}
// @from(Start 8853420, End 8854371)
function a25() {
  try {
    if (dQ() !== "macos") return null;
    let Q = process.ppid;
    for (let B = 0; B < 10; B++) {
      if (!Q || Q === 0 || Q === 1) break;
      let G = tG(`ps -o command= -p ${Q}`)?.trim();
      if (G) {
        let I = {
            "Visual Studio Code.app": "code",
            "Cursor.app": "cursor",
            "Windsurf.app": "windsurf",
            "Visual Studio Code - Insiders.app": "code",
            "VSCodium.app": "codium"
          },
          Y = "/Contents/MacOS/Electron";
        for (let [J, W] of Object.entries(I)) {
          let X = G.indexOf(J + "/Contents/MacOS/Electron");
          if (X !== -1) {
            let V = X + J.length;
            return G.substring(0, V) + "/Contents/Resources/app/bin/" + W
          }
        }
      }
      let Z = tG(`ps -o ppid= -p ${Q}`)?.trim();
      if (!Z) break;
      Q = parseInt(Z.trim())
    }
    return null
  } catch {
    return null
  }
}
// @from(Start 8854373, End 8854647)
function GB2(A) {
  let Q = a25();
  if (Q) {
    if (RA().existsSync(Q)) return Q
  }
  switch (A) {
    case "vscode":
      return "code";
    case "cursor":
      return "cursor";
    case "windsurf":
      return "windsurf";
    default:
      break
  }
  return null
}
// @from(Start 8854649, End 8856317)
function _Q1() {
  let A = [];
  try {
    let Q = dQ();
    if (Q === "macos") {
      let B = tG('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep') ?? "";
      for (let [G, Z] of Object.entries(wIA))
        for (let I of Z.processKeywordsMac)
          if (B.includes(I)) {
            A.push(G);
            break
          }
    } else if (Q === "windows") {
      let G = (tG('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"') ?? "").toLowerCase();
      for (let [Z, I] of Object.entries(wIA))
        for (let Y of I.processKeywordsWindows)
          if (G.includes(Y.toLowerCase())) {
            A.push(Z);
            break
          }
    } else if (Q === "linux") {
      let G = (tG('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep') ?? "").toLowerCase();
      for (let [Z, I] of Object.entries(wIA))
        for (let Y of I.processKeywordsLinux)
          if (G.includes(Y)) {
            if (Z !== "vscode") {
              A.push(Z);
              break
            } else if (!G.includes("cursor") && !G.includes("appcode")) {
              A.push(Z);
              break
            }
          }
    }
  } catch (Q) {
    AA(Q)
  }
  return A
}
// @from(Start 8856319, End 8856423)
function kQ1(A) {
  let Q = A.find((B) => B.type === "connected" && B.name === "ide");
  return ze1(Q)
}
// @from(Start 8856425, End 8856564)
function ze1(A) {
  let Q = A?.config;
  return Q?.type === "sse-ide" || Q?.type === "ws-ide" ? Q.ideName : bV() ? aF(WU.terminal) : null
}
// @from(Start 8856566, End 8856873)
function aF(A) {
  if (!A) return "IDE";
  let Q = wIA[A];
  if (Q) return Q.displayName;
  let B = tQ2[A.toLowerCase().trim()];
  if (B) return B;
  let G = A.split(" ")[0],
    Z = G ? f25(G).toLowerCase() : null;
  if (Z) {
    let I = tQ2[Z];
    if (I) return I;
    return IKA(Z)
  }
  return IKA(A)
}
// @from(Start 8856875, End 8857026)
function uU(A) {
  if (!A) return;
  let Q = A.find((B) => B.type === "connected" && B.name === "ide");
  return Q?.type === "connected" ? Q : void 0
}
// @from(Start 8857027, End 8857117)
async function JB2(A) {
  try {
    await Jh("closeAllDiffTabs", {}, A)
  } catch (Q) {}
}
// @from(Start 8857118, End 8857817)
async function WB2(A, Q, B, G) {
  sQ2().then(A);
  let Z = N1().autoInstallIdeExtension ?? !0;
  if (process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL !== "true" && Z) {
    let I = Q ?? UIA();
    if (I) {
      if (PQ1(I)) rQ2(I).then(async (Y) => {
        p25(I).catch((J) => {
          return {
            installed: !1,
            error: J.message || "Installation failed",
            installedVersion: null,
            ideType: I
          }
        }).then((J) => {
          if (G(J), J?.installed) sQ2().then(A);
          if (!Y && J?.installed === !0 && !MQ1()) B()
        })
      });
      else if (oT(I) && !MQ1()) rQ2(I).then(async (Y) => {
        if (Y) B()
      })
    }
  }
}
// @from(Start 8857822, End 8857825)
eQ2
// @from(Start 8857827, End 8857830)
wIA
// @from(Start 8857832, End 8857835)
KLA
// @from(Start 8857837, End 8857840)
DLA
// @from(Start 8857842, End 8857844)
bV
// @from(Start 8857846, End 8857849)
c25
// @from(Start 8857851, End 8857854)
FOG
// @from(Start 8857856, End 8857866)
OQ1 = null
// @from(Start 8857870, End 8857899)
l25 = "anthropic.claude-code"
// @from(Start 8857903, End 8857906)
ZB2
// @from(Start 8857908, End 8857911)
IB2
// @from(Start 8857913, End 8857916)
YB2
// @from(Start 8857918, End 8857921)
tQ2
// @from(Start 8857923, End 8857926)
XB2