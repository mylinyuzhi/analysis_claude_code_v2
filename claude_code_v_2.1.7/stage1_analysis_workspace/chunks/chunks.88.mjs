
// @from(Ln 255982, Col 4)
RB2 = U(($d) => {
  Object.defineProperty($d, "__esModule", {
    value: !0
  });
  $d.CodeGen = $d.Name = $d.nil = $d.stringify = $d.str = $d._ = $d.KeywordCxt = void 0;
  var R25 = LxA();
  Object.defineProperty($d, "KeywordCxt", {
    enumerable: !0,
    get: function () {
      return R25.KeywordCxt
    }
  });
  var bKA = D8();
  Object.defineProperty($d, "_", {
    enumerable: !0,
    get: function () {
      return bKA._
    }
  });
  Object.defineProperty($d, "str", {
    enumerable: !0,
    get: function () {
      return bKA.str
    }
  });
  Object.defineProperty($d, "stringify", {
    enumerable: !0,
    get: function () {
      return bKA.stringify
    }
  });
  Object.defineProperty($d, "nil", {
    enumerable: !0,
    get: function () {
      return bKA.nil
    }
  });
  Object.defineProperty($d, "Name", {
    enumerable: !0,
    get: function () {
      return bKA.Name
    }
  });
  Object.defineProperty($d, "CodeGen", {
    enumerable: !0,
    get: function () {
      return bKA.CodeGen
    }
  });
  var _25 = GG1(),
    LB2 = OxA(),
    j25 = qJ0(),
    _xA = YG1(),
    T25 = D8(),
    jxA = qxA(),
    DG1 = UxA(),
    dJ0 = L7(),
    UB2 = sQ2(),
    P25 = CB2(),
    OB2 = (A, Q) => new RegExp(A, Q);
  OB2.code = "new RegExp";
  var S25 = ["removeAdditional", "useDefaults", "coerceTypes"],
    x25 = new Set(["validate", "serialize", "parse", "wrapper", "root", "schema", "keyword", "pattern", "formats", "validate$data", "func", "obj", "Error"]),
    y25 = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    },
    v25 = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    },
    qB2 = 200;

  function k25(A) {
    var Q, B, G, Z, Y, J, X, I, D, W, K, V, F, H, E, z, $, O, L, M, _, j, x, b, S;
    let u = A.strict,
      f = (Q = A.code) === null || Q === void 0 ? void 0 : Q.optimize,
      AA = f === !0 || f === void 0 ? 1 : f || 0,
      n = (G = (B = A.code) === null || B === void 0 ? void 0 : B.regExp) !== null && G !== void 0 ? G : OB2,
      y = (Z = A.uriResolver) !== null && Z !== void 0 ? Z : P25.default;
    return {
      strictSchema: (J = (Y = A.strictSchema) !== null && Y !== void 0 ? Y : u) !== null && J !== void 0 ? J : !0,
      strictNumbers: (I = (X = A.strictNumbers) !== null && X !== void 0 ? X : u) !== null && I !== void 0 ? I : !0,
      strictTypes: (W = (D = A.strictTypes) !== null && D !== void 0 ? D : u) !== null && W !== void 0 ? W : "log",
      strictTuples: (V = (K = A.strictTuples) !== null && K !== void 0 ? K : u) !== null && V !== void 0 ? V : "log",
      strictRequired: (H = (F = A.strictRequired) !== null && F !== void 0 ? F : u) !== null && H !== void 0 ? H : !1,
      code: A.code ? {
        ...A.code,
        optimize: AA,
        regExp: n
      } : {
        optimize: AA,
        regExp: n
      },
      loopRequired: (E = A.loopRequired) !== null && E !== void 0 ? E : qB2,
      loopEnum: (z = A.loopEnum) !== null && z !== void 0 ? z : qB2,
      meta: ($ = A.meta) !== null && $ !== void 0 ? $ : !0,
      messages: (O = A.messages) !== null && O !== void 0 ? O : !0,
      inlineRefs: (L = A.inlineRefs) !== null && L !== void 0 ? L : !0,
      schemaId: (M = A.schemaId) !== null && M !== void 0 ? M : "$id",
      addUsedSchema: (_ = A.addUsedSchema) !== null && _ !== void 0 ? _ : !0,
      validateSchema: (j = A.validateSchema) !== null && j !== void 0 ? j : !0,
      validateFormats: (x = A.validateFormats) !== null && x !== void 0 ? x : !0,
      unicodeRegExp: (b = A.unicodeRegExp) !== null && b !== void 0 ? b : !0,
      int32range: (S = A.int32range) !== null && S !== void 0 ? S : !0,
      uriResolver: y
    }
  }
  class WG1 {
    constructor(A = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = new Set, this._loading = {}, this._cache = new Map, A = this.opts = {
        ...A,
        ...k25(A)
      };
      let {
        es5: Q,
        lines: B
      } = this.opts.code;
      this.scope = new T25.ValueScope({
        scope: {},
        prefixes: x25,
        es5: Q,
        lines: B
      }), this.logger = m25(A.logger);
      let G = A.validateFormats;
      if (A.validateFormats = !1, this.RULES = (0, j25.getRules)(), NB2.call(this, y25, A, "NOT SUPPORTED"), NB2.call(this, v25, A, "DEPRECATED", "warn"), this._metaOpts = g25.call(this), A.formats) f25.call(this);
      if (this._addVocabularies(), this._addDefaultMetaSchema(), A.keywords) h25.call(this, A.keywords);
      if (typeof A.meta == "object") this.addMetaSchema(A.meta);
      b25.call(this), A.validateFormats = G
    }
    _addVocabularies() {
      this.addKeyword("$async")
    }
    _addDefaultMetaSchema() {
      let {
        $data: A,
        meta: Q,
        schemaId: B
      } = this.opts, G = UB2;
      if (B === "id") G = {
        ...UB2
      }, G.id = G.$id, delete G.$id;
      if (Q && A) this.addMetaSchema(G, G[B], !1)
    }
    defaultMeta() {
      let {
        meta: A,
        schemaId: Q
      } = this.opts;
      return this.opts.defaultMeta = typeof A == "object" ? A[Q] || A : void 0
    }
    validate(A, Q) {
      let B;
      if (typeof A == "string") {
        if (B = this.getSchema(A), !B) throw Error(`no schema with key or ref "${A}"`)
      } else B = this.compile(A);
      let G = B(Q);
      if (!("$async" in B)) this.errors = B.errors;
      return G
    }
    compile(A, Q) {
      let B = this._addSchema(A, Q);
      return B.validate || this._compileSchemaEnv(B)
    }
    compileAsync(A, Q) {
      if (typeof this.opts.loadSchema != "function") throw Error("options.loadSchema should be a function");
      let {
        loadSchema: B
      } = this.opts;
      return G.call(this, A, Q);
      async function G(D, W) {
        await Z.call(this, D.$schema);
        let K = this._addSchema(D, W);
        return K.validate || Y.call(this, K)
      }
      async function Z(D) {
        if (D && !this.getSchema(D)) await G.call(this, {
          $ref: D
        }, !0)
      }
      async function Y(D) {
        try {
          return this._compileSchemaEnv(D)
        } catch (W) {
          if (!(W instanceof LB2.default)) throw W;
          return J.call(this, W), await X.call(this, W.missingSchema), Y.call(this, D)
        }
      }

      function J({
        missingSchema: D,
        missingRef: W
      }) {
        if (this.refs[D]) throw Error(`AnySchema ${D} is loaded but ${W} cannot be resolved`)
      }
      async function X(D) {
        let W = await I.call(this, D);
        if (!this.refs[D]) await Z.call(this, W.$schema);
        if (!this.refs[D]) this.addSchema(W, D, Q)
      }
      async function I(D) {
        let W = this._loading[D];
        if (W) return W;
        try {
          return await (this._loading[D] = B(D))
        } finally {
          delete this._loading[D]
        }
      }
    }
    addSchema(A, Q, B, G = this.opts.validateSchema) {
      if (Array.isArray(A)) {
        for (let Y of A) this.addSchema(Y, void 0, B, G);
        return this
      }
      let Z;
      if (typeof A === "object") {
        let {
          schemaId: Y
        } = this.opts;
        if (Z = A[Y], Z !== void 0 && typeof Z != "string") throw Error(`schema ${Y} must be string`)
      }
      return Q = (0, jxA.normalizeId)(Q || Z), this._checkUnique(Q), this.schemas[Q] = this._addSchema(A, B, Q, G, !0), this
    }
    addMetaSchema(A, Q, B = this.opts.validateSchema) {
      return this.addSchema(A, Q, !0, B), this
    }
    validateSchema(A, Q) {
      if (typeof A == "boolean") return !0;
      let B;
      if (B = A.$schema, B !== void 0 && typeof B != "string") throw Error("$schema must be a string");
      if (B = B || this.opts.defaultMeta || this.defaultMeta(), !B) return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      let G = this.validate(B, A);
      if (!G && Q) {
        let Z = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log") this.logger.error(Z);
        else throw Error(Z)
      }
      return G
    }
    getSchema(A) {
      let Q;
      while (typeof (Q = wB2.call(this, A)) == "string") A = Q;
      if (Q === void 0) {
        let {
          schemaId: B
        } = this.opts, G = new _xA.SchemaEnv({
          schema: {},
          schemaId: B
        });
        if (Q = _xA.resolveSchema.call(this, G, A), !Q) return;
        this.refs[A] = Q
      }
      return Q.validate || this._compileSchemaEnv(Q)
    }
    removeSchema(A) {
      if (A instanceof RegExp) return this._removeAllSchemas(this.schemas, A), this._removeAllSchemas(this.refs, A), this;
      switch (typeof A) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          let Q = wB2.call(this, A);
          if (typeof Q == "object") this._cache.delete(Q.schema);
          return delete this.schemas[A], delete this.refs[A], this
        }
        case "object": {
          let Q = A;
          this._cache.delete(Q);
          let B = A[this.opts.schemaId];
          if (B) B = (0, jxA.normalizeId)(B), delete this.schemas[B], delete this.refs[B];
          return this
        }
        default:
          throw Error("ajv.removeSchema: invalid parameter")
      }
    }
    addVocabulary(A) {
      for (let Q of A) this.addKeyword(Q);
      return this
    }
    addKeyword(A, Q) {
      let B;
      if (typeof A == "string") {
        if (B = A, typeof Q == "object") this.logger.warn("these parameters are deprecated, see docs for addKeyword"), Q.keyword = B
      } else if (typeof A == "object" && Q === void 0) {
        if (Q = A, B = Q.keyword, Array.isArray(B) && !B.length) throw Error("addKeywords: keyword must be string or non-empty array")
      } else throw Error("invalid addKeywords parameters");
      if (c25.call(this, B, Q), !Q) return (0, dJ0.eachItem)(B, (Z) => mJ0.call(this, Z)), this;
      l25.call(this, Q);
      let G = {
        ...Q,
        type: (0, DG1.getJSONTypes)(Q.type),
        schemaType: (0, DG1.getJSONTypes)(Q.schemaType)
      };
      return (0, dJ0.eachItem)(B, G.type.length === 0 ? (Z) => mJ0.call(this, Z, G) : (Z) => G.type.forEach((Y) => mJ0.call(this, Z, G, Y))), this
    }
    getKeyword(A) {
      let Q = this.RULES.all[A];
      return typeof Q == "object" ? Q.definition : !!Q
    }
    removeKeyword(A) {
      let {
        RULES: Q
      } = this;
      delete Q.keywords[A], delete Q.all[A];
      for (let B of Q.rules) {
        let G = B.rules.findIndex((Z) => Z.keyword === A);
        if (G >= 0) B.rules.splice(G, 1)
      }
      return this
    }
    addFormat(A, Q) {
      if (typeof Q == "string") Q = new RegExp(Q);
      return this.formats[A] = Q, this
    }
    errorsText(A = this.errors, {
      separator: Q = ", ",
      dataVar: B = "data"
    } = {}) {
      if (!A || A.length === 0) return "No errors";
      return A.map((G) => `${B}${G.instancePath} ${G.message}`).reduce((G, Z) => G + Q + Z)
    }
    $dataMetaSchema(A, Q) {
      let B = this.RULES.all;
      A = JSON.parse(JSON.stringify(A));
      for (let G of Q) {
        let Z = G.split("/").slice(1),
          Y = A;
        for (let J of Z) Y = Y[J];
        for (let J in B) {
          let X = B[J];
          if (typeof X != "object") continue;
          let {
            $data: I
          } = X.definition, D = Y[J];
          if (I && D) Y[J] = MB2(D)
        }
      }
      return A
    }
    _removeAllSchemas(A, Q) {
      for (let B in A) {
        let G = A[B];
        if (!Q || Q.test(B)) {
          if (typeof G == "string") delete A[B];
          else if (G && !G.meta) this._cache.delete(G.schema), delete A[B]
        }
      }
    }
    _addSchema(A, Q, B, G = this.opts.validateSchema, Z = this.opts.addUsedSchema) {
      let Y, {
        schemaId: J
      } = this.opts;
      if (typeof A == "object") Y = A[J];
      else if (this.opts.jtd) throw Error("schema must be object");
      else if (typeof A != "boolean") throw Error("schema must be object or boolean");
      let X = this._cache.get(A);
      if (X !== void 0) return X;
      B = (0, jxA.normalizeId)(Y || B);
      let I = jxA.getSchemaRefs.call(this, A, B);
      if (X = new _xA.SchemaEnv({
          schema: A,
          schemaId: J,
          meta: Q,
          baseId: B,
          localRefs: I
        }), this._cache.set(X.schema, X), Z && !B.startsWith("#")) {
        if (B) this._checkUnique(B);
        this.refs[B] = X
      }
      if (G) this.validateSchema(A, !0);
      return X
    }
    _checkUnique(A) {
      if (this.schemas[A] || this.refs[A]) throw Error(`schema with key or id "${A}" already exists`)
    }
    _compileSchemaEnv(A) {
      if (A.meta) this._compileMetaSchema(A);
      else _xA.compileSchema.call(this, A);
      if (!A.validate) throw Error("ajv implementation error");
      return A.validate
    }
    _compileMetaSchema(A) {
      let Q = this.opts;
      this.opts = this._metaOpts;
      try {
        _xA.compileSchema.call(this, A)
      } finally {
        this.opts = Q
      }
    }
  }
  WG1.ValidationError = _25.default;
  WG1.MissingRefError = LB2.default;
  $d.default = WG1;

  function NB2(A, Q, B, G = "error") {
    for (let Z in A) {
      let Y = Z;
      if (Y in Q) this.logger[G](`${B}: option ${Z}. ${A[Y]}`)
    }
  }

  function wB2(A) {
    return A = (0, jxA.normalizeId)(A), this.schemas[A] || this.refs[A]
  }

  function b25() {
    let A = this.opts.schemas;
    if (!A) return;
    if (Array.isArray(A)) this.addSchema(A);
    else
      for (let Q in A) this.addSchema(A[Q], Q)
  }

  function f25() {
    for (let A in this.opts.formats) {
      let Q = this.opts.formats[A];
      if (Q) this.addFormat(A, Q)
    }
  }

  function h25(A) {
    if (Array.isArray(A)) {
      this.addVocabulary(A);
      return
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (let Q in A) {
      let B = A[Q];
      if (!B.keyword) B.keyword = Q;
      this.addKeyword(B)
    }
  }

  function g25() {
    let A = {
      ...this.opts
    };
    for (let Q of S25) delete A[Q];
    return A
  }
  var u25 = {
    log() {},
    warn() {},
    error() {}
  };

  function m25(A) {
    if (A === !1) return u25;
    if (A === void 0) return console;
    if (A.log && A.warn && A.error) return A;
    throw Error("logger must implement log, warn and error methods")
  }
  var d25 = /^[a-z_$][a-z0-9_$:-]*$/i;

  function c25(A, Q) {
    let {
      RULES: B
    } = this;
    if ((0, dJ0.eachItem)(A, (G) => {
        if (B.keywords[G]) throw Error(`Keyword ${G} is already defined`);
        if (!d25.test(G)) throw Error(`Keyword ${G} has invalid name`)
      }), !Q) return;
    if (Q.$data && !(("code" in Q) || ("validate" in Q))) throw Error('$data keyword must have "code" or "validate" function')
  }

  function mJ0(A, Q, B) {
    var G;
    let Z = Q === null || Q === void 0 ? void 0 : Q.post;
    if (B && Z) throw Error('keyword with "post" flag cannot have "type"');
    let {
      RULES: Y
    } = this, J = Z ? Y.post : Y.rules.find(({
      type: I
    }) => I === B);
    if (!J) J = {
      type: B,
      rules: []
    }, Y.rules.push(J);
    if (Y.keywords[A] = !0, !Q) return;
    let X = {
      keyword: A,
      definition: {
        ...Q,
        type: (0, DG1.getJSONTypes)(Q.type),
        schemaType: (0, DG1.getJSONTypes)(Q.schemaType)
      }
    };
    if (Q.before) p25.call(this, J, X, Q.before);
    else J.rules.push(X);
    Y.all[A] = X, (G = Q.implements) === null || G === void 0 || G.forEach((I) => this.addKeyword(I))
  }

  function p25(A, Q, B) {
    let G = A.rules.findIndex((Z) => Z.keyword === B);
    if (G >= 0) A.rules.splice(G, 0, Q);
    else A.rules.push(Q), this.logger.warn(`rule ${B} is not defined`)
  }

  function l25(A) {
    let {
      metaSchema: Q
    } = A;
    if (Q === void 0) return;
    if (A.$data && this.opts.$data) Q = MB2(Q);
    A.validateSchema = this.compile(Q, !0)
  }
  var i25 = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };

  function MB2(A) {
    return {
      anyOf: [A, i25]
    }
  }
})
// @from(Ln 256514, Col 4)
jB2 = U((_B2) => {
  Object.defineProperty(_B2, "__esModule", {
    value: !0
  });
  var o25 = {
    keyword: "id",
    code() {
      throw Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')
    }
  };
  _B2.default = o25
})
// @from(Ln 256526, Col 4)
vB2 = U((xB2) => {
  Object.defineProperty(xB2, "__esModule", {
    value: !0
  });
  xB2.callRef = xB2.getValidate = void 0;
  var s25 = OxA(),
    TB2 = x_(),
    MN = D8(),
    fKA = Hd(),
    PB2 = YG1(),
    KG1 = L7(),
    t25 = {
      keyword: "$ref",
      schemaType: "string",
      code(A) {
        let {
          gen: Q,
          schema: B,
          it: G
        } = A, {
          baseId: Z,
          schemaEnv: Y,
          validateName: J,
          opts: X,
          self: I
        } = G, {
          root: D
        } = Y;
        if ((B === "#" || B === "#/") && Z === D.baseId) return K();
        let W = PB2.resolveRef.call(I, D, Z, B);
        if (W === void 0) throw new s25.default(G.opts.uriResolver, Z, B);
        if (W instanceof PB2.SchemaEnv) return V(W);
        return F(W);

        function K() {
          if (Y === D) return VG1(A, J, Y, Y.$async);
          let H = Q.scopeValue("root", {
            ref: D
          });
          return VG1(A, MN._`${H}.validate`, D, D.$async)
        }

        function V(H) {
          let E = SB2(A, H);
          VG1(A, E, H, H.$async)
        }

        function F(H) {
          let E = Q.scopeValue("schema", X.code.source === !0 ? {
              ref: H,
              code: (0, MN.stringify)(H)
            } : {
              ref: H
            }),
            z = Q.name("valid"),
            $ = A.subschema({
              schema: H,
              dataTypes: [],
              schemaPath: MN.nil,
              topSchemaRef: E,
              errSchemaPath: B
            }, z);
          A.mergeEvaluated($), A.ok(z)
        }
      }
    };

  function SB2(A, Q) {
    let {
      gen: B
    } = A;
    return Q.validate ? B.scopeValue("validate", {
      ref: Q.validate
    }) : MN._`${B.scopeValue("wrapper",{ref:Q})}.validate`
  }
  xB2.getValidate = SB2;

  function VG1(A, Q, B, G) {
    let {
      gen: Z,
      it: Y
    } = A, {
      allErrors: J,
      schemaEnv: X,
      opts: I
    } = Y, D = I.passContext ? fKA.default.this : MN.nil;
    if (G) W();
    else K();

    function W() {
      if (!X.$async) throw Error("async schema referenced by sync schema");
      let H = Z.let("valid");
      Z.try(() => {
        if (Z.code(MN._`await ${(0,TB2.callValidateCode)(A,Q,D)}`), F(Q), !J) Z.assign(H, !0)
      }, (E) => {
        if (Z.if(MN._`!(${E} instanceof ${Y.ValidationError})`, () => Z.throw(E)), V(E), !J) Z.assign(H, !1)
      }), A.ok(H)
    }

    function K() {
      A.result((0, TB2.callValidateCode)(A, Q, D), () => F(Q), () => V(Q))
    }

    function V(H) {
      let E = MN._`${H}.errors`;
      Z.assign(fKA.default.vErrors, MN._`${fKA.default.vErrors} === null ? ${E} : ${fKA.default.vErrors}.concat(${E})`), Z.assign(fKA.default.errors, MN._`${fKA.default.vErrors}.length`)
    }

    function F(H) {
      var E;
      if (!Y.opts.unevaluated) return;
      let z = (E = B === null || B === void 0 ? void 0 : B.validate) === null || E === void 0 ? void 0 : E.evaluated;
      if (Y.props !== !0)
        if (z && !z.dynamicProps) {
          if (z.props !== void 0) Y.props = KG1.mergeEvaluated.props(Z, z.props, Y.props)
        } else {
          let $ = Z.var("props", MN._`${H}.evaluated.props`);
          Y.props = KG1.mergeEvaluated.props(Z, $, Y.props, MN.Name)
        } if (Y.items !== !0)
        if (z && !z.dynamicItems) {
          if (z.items !== void 0) Y.items = KG1.mergeEvaluated.items(Z, z.items, Y.items)
        } else {
          let $ = Z.var("items", MN._`${H}.evaluated.items`);
          Y.items = KG1.mergeEvaluated.items(Z, $, Y.items, MN.Name)
        }
    }
  }
  xB2.callRef = VG1;
  xB2.default = t25
})
// @from(Ln 256656, Col 4)
bB2 = U((kB2) => {
  Object.defineProperty(kB2, "__esModule", {
    value: !0
  });
  var Q95 = jB2(),
    B95 = vB2(),
    G95 = ["$schema", "$id", "$defs", "$vocabulary", {
      keyword: "$comment"
    }, "definitions", Q95.default, B95.default];
  kB2.default = G95
})
// @from(Ln 256667, Col 4)
hB2 = U((fB2) => {
  Object.defineProperty(fB2, "__esModule", {
    value: !0
  });
  var FG1 = D8(),
    $r = FG1.operators,
    HG1 = {
      maximum: {
        okStr: "<=",
        ok: $r.LTE,
        fail: $r.GT
      },
      minimum: {
        okStr: ">=",
        ok: $r.GTE,
        fail: $r.LT
      },
      exclusiveMaximum: {
        okStr: "<",
        ok: $r.LT,
        fail: $r.GTE
      },
      exclusiveMinimum: {
        okStr: ">",
        ok: $r.GT,
        fail: $r.LTE
      }
    },
    Y95 = {
      message: ({
        keyword: A,
        schemaCode: Q
      }) => FG1.str`must be ${HG1[A].okStr} ${Q}`,
      params: ({
        keyword: A,
        schemaCode: Q
      }) => FG1._`{comparison: ${HG1[A].okStr}, limit: ${Q}}`
    },
    J95 = {
      keyword: Object.keys(HG1),
      type: "number",
      schemaType: "number",
      $data: !0,
      error: Y95,
      code(A) {
        let {
          keyword: Q,
          data: B,
          schemaCode: G
        } = A;
        A.fail$data(FG1._`${B} ${HG1[Q].fail} ${G} || isNaN(${B})`)
      }
    };
  fB2.default = J95
})
// @from(Ln 256722, Col 4)
uB2 = U((gB2) => {
  Object.defineProperty(gB2, "__esModule", {
    value: !0
  });
  var TxA = D8(),
    I95 = {
      message: ({
        schemaCode: A
      }) => TxA.str`must be multiple of ${A}`,
      params: ({
        schemaCode: A
      }) => TxA._`{multipleOf: ${A}}`
    },
    D95 = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: !0,
      error: I95,
      code(A) {
        let {
          gen: Q,
          data: B,
          schemaCode: G,
          it: Z
        } = A, Y = Z.opts.multipleOfPrecision, J = Q.let("res"), X = Y ? TxA._`Math.abs(Math.round(${J}) - ${J}) > 1e-${Y}` : TxA._`${J} !== parseInt(${J})`;
        A.fail$data(TxA._`(${G} === 0 || (${J} = ${B}/${G}, ${X}))`)
      }
    };
  gB2.default = D95
})
// @from(Ln 256753, Col 4)
cB2 = U((dB2) => {
  Object.defineProperty(dB2, "__esModule", {
    value: !0
  });

  function mB2(A) {
    let Q = A.length,
      B = 0,
      G = 0,
      Z;
    while (G < Q)
      if (B++, Z = A.charCodeAt(G++), Z >= 55296 && Z <= 56319 && G < Q) {
        if (Z = A.charCodeAt(G), (Z & 64512) === 56320) G++
      } return B
  }
  dB2.default = mB2;
  mB2.code = 'require("ajv/dist/runtime/ucs2length").default'
})
// @from(Ln 256771, Col 4)
lB2 = U((pB2) => {
  Object.defineProperty(pB2, "__esModule", {
    value: !0
  });
  var t9A = D8(),
    V95 = L7(),
    F95 = cB2(),
    H95 = {
      message({
        keyword: A,
        schemaCode: Q
      }) {
        let B = A === "maxLength" ? "more" : "fewer";
        return t9A.str`must NOT have ${B} than ${Q} characters`
      },
      params: ({
        schemaCode: A
      }) => t9A._`{limit: ${A}}`
    },
    E95 = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: !0,
      error: H95,
      code(A) {
        let {
          keyword: Q,
          data: B,
          schemaCode: G,
          it: Z
        } = A, Y = Q === "maxLength" ? t9A.operators.GT : t9A.operators.LT, J = Z.opts.unicode === !1 ? t9A._`${B}.length` : t9A._`${(0,V95.useFunc)(A.gen,F95.default)}(${B})`;
        A.fail$data(t9A._`${J} ${Y} ${G}`)
      }
    };
  pB2.default = E95
})
// @from(Ln 256808, Col 4)
nB2 = U((iB2) => {
  Object.defineProperty(iB2, "__esModule", {
    value: !0
  });
  var $95 = x_(),
    EG1 = D8(),
    C95 = {
      message: ({
        schemaCode: A
      }) => EG1.str`must match pattern "${A}"`,
      params: ({
        schemaCode: A
      }) => EG1._`{pattern: ${A}}`
    },
    U95 = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: !0,
      error: C95,
      code(A) {
        let {
          data: Q,
          $data: B,
          schema: G,
          schemaCode: Z,
          it: Y
        } = A, J = Y.opts.unicodeRegExp ? "u" : "", X = B ? EG1._`(new RegExp(${Z}, ${J}))` : (0, $95.usePattern)(A, G);
        A.fail$data(EG1._`!${X}.test(${Q})`)
      }
    };
  iB2.default = U95
})
// @from(Ln 256841, Col 4)
oB2 = U((aB2) => {
  Object.defineProperty(aB2, "__esModule", {
    value: !0
  });
  var PxA = D8(),
    N95 = {
      message({
        keyword: A,
        schemaCode: Q
      }) {
        let B = A === "maxProperties" ? "more" : "fewer";
        return PxA.str`must NOT have ${B} than ${Q} properties`
      },
      params: ({
        schemaCode: A
      }) => PxA._`{limit: ${A}}`
    },
    w95 = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: !0,
      error: N95,
      code(A) {
        let {
          keyword: Q,
          data: B,
          schemaCode: G
        } = A, Z = Q === "maxProperties" ? PxA.operators.GT : PxA.operators.LT;
        A.fail$data(PxA._`Object.keys(${B}).length ${Z} ${G}`)
      }
    };
  aB2.default = w95
})
// @from(Ln 256875, Col 4)
sB2 = U((rB2) => {
  Object.defineProperty(rB2, "__esModule", {
    value: !0
  });
  var SxA = x_(),
    xxA = D8(),
    O95 = L7(),
    M95 = {
      message: ({
        params: {
          missingProperty: A
        }
      }) => xxA.str`must have required property '${A}'`,
      params: ({
        params: {
          missingProperty: A
        }
      }) => xxA._`{missingProperty: ${A}}`
    },
    R95 = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: !0,
      error: M95,
      code(A) {
        let {
          gen: Q,
          schema: B,
          schemaCode: G,
          data: Z,
          $data: Y,
          it: J
        } = A, {
          opts: X
        } = J;
        if (!Y && B.length === 0) return;
        let I = B.length >= X.loopRequired;
        if (J.allErrors) D();
        else W();
        if (X.strictRequired) {
          let F = A.parentSchema.properties,
            {
              definedProperties: H
            } = A.it;
          for (let E of B)
            if ((F === null || F === void 0 ? void 0 : F[E]) === void 0 && !H.has(E)) {
              let z = J.schemaEnv.baseId + J.errSchemaPath,
                $ = `required property "${E}" is not defined at "${z}" (strictRequired)`;
              (0, O95.checkStrictMode)(J, $, J.opts.strictRequired)
            }
        }

        function D() {
          if (I || Y) A.block$data(xxA.nil, K);
          else
            for (let F of B)(0, SxA.checkReportMissingProp)(A, F)
        }

        function W() {
          let F = Q.let("missing");
          if (I || Y) {
            let H = Q.let("valid", !0);
            A.block$data(H, () => V(F, H)), A.ok(H)
          } else Q.if((0, SxA.checkMissingProp)(A, B, F)), (0, SxA.reportMissingProp)(A, F), Q.else()
        }

        function K() {
          Q.forOf("prop", G, (F) => {
            A.setParams({
              missingProperty: F
            }), Q.if((0, SxA.noPropertyInData)(Q, Z, F, X.ownProperties), () => A.error())
          })
        }

        function V(F, H) {
          A.setParams({
            missingProperty: F
          }), Q.forOf(F, G, () => {
            Q.assign(H, (0, SxA.propertyInData)(Q, Z, F, X.ownProperties)), Q.if((0, xxA.not)(H), () => {
              A.error(), Q.break()
            })
          }, xxA.nil)
        }
      }
    };
  rB2.default = R95
})
// @from(Ln 256963, Col 4)
eB2 = U((tB2) => {
  Object.defineProperty(tB2, "__esModule", {
    value: !0
  });
  var yxA = D8(),
    j95 = {
      message({
        keyword: A,
        schemaCode: Q
      }) {
        let B = A === "maxItems" ? "more" : "fewer";
        return yxA.str`must NOT have ${B} than ${Q} items`
      },
      params: ({
        schemaCode: A
      }) => yxA._`{limit: ${A}}`
    },
    T95 = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: !0,
      error: j95,
      code(A) {
        let {
          keyword: Q,
          data: B,
          schemaCode: G
        } = A, Z = Q === "maxItems" ? yxA.operators.GT : yxA.operators.LT;
        A.fail$data(yxA._`${B}.length ${Z} ${G}`)
      }
    };
  tB2.default = T95
})
// @from(Ln 256997, Col 4)
zG1 = U((Q22) => {
  Object.defineProperty(Q22, "__esModule", {
    value: !0
  });
  var A22 = jJ0();
  A22.code = 'require("ajv/dist/runtime/equal").default';
  Q22.default = A22
})
// @from(Ln 257005, Col 4)
G22 = U((B22) => {
  Object.defineProperty(B22, "__esModule", {
    value: !0
  });
  var cJ0 = UxA(),
    GE = D8(),
    x95 = L7(),
    y95 = zG1(),
    v95 = {
      message: ({
        params: {
          i: A,
          j: Q
        }
      }) => GE.str`must NOT have duplicate items (items ## ${Q} and ${A} are identical)`,
      params: ({
        params: {
          i: A,
          j: Q
        }
      }) => GE._`{i: ${A}, j: ${Q}}`
    },
    k95 = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: !0,
      error: v95,
      code(A) {
        let {
          gen: Q,
          data: B,
          $data: G,
          schema: Z,
          parentSchema: Y,
          schemaCode: J,
          it: X
        } = A;
        if (!G && !Z) return;
        let I = Q.let("valid"),
          D = Y.items ? (0, cJ0.getSchemaTypes)(Y.items) : [];
        A.block$data(I, W, GE._`${J} === false`), A.ok(I);

        function W() {
          let H = Q.let("i", GE._`${B}.length`),
            E = Q.let("j");
          A.setParams({
            i: H,
            j: E
          }), Q.assign(I, !0), Q.if(GE._`${H} > 1`, () => (K() ? V : F)(H, E))
        }

        function K() {
          return D.length > 0 && !D.some((H) => H === "object" || H === "array")
        }

        function V(H, E) {
          let z = Q.name("item"),
            $ = (0, cJ0.checkDataTypes)(D, z, X.opts.strictNumbers, cJ0.DataType.Wrong),
            O = Q.const("indices", GE._`{}`);
          Q.for(GE._`;${H}--;`, () => {
            if (Q.let(z, GE._`${B}[${H}]`), Q.if($, GE._`continue`), D.length > 1) Q.if(GE._`typeof ${z} == "string"`, GE._`${z} += "_"`);
            Q.if(GE._`typeof ${O}[${z}] == "number"`, () => {
              Q.assign(E, GE._`${O}[${z}]`), A.error(), Q.assign(I, !1).break()
            }).code(GE._`${O}[${z}] = ${H}`)
          })
        }

        function F(H, E) {
          let z = (0, x95.useFunc)(Q, y95.default),
            $ = Q.name("outer");
          Q.label($).for(GE._`;${H}--;`, () => Q.for(GE._`${E} = ${H}; ${E}--;`, () => Q.if(GE._`${z}(${B}[${H}], ${B}[${E}])`, () => {
            A.error(), Q.assign(I, !1).break($)
          })))
        }
      }
    };
  B22.default = k95
})
// @from(Ln 257084, Col 4)
Y22 = U((Z22) => {
  Object.defineProperty(Z22, "__esModule", {
    value: !0
  });
  var pJ0 = D8(),
    f95 = L7(),
    h95 = zG1(),
    g95 = {
      message: "must be equal to constant",
      params: ({
        schemaCode: A
      }) => pJ0._`{allowedValue: ${A}}`
    },
    u95 = {
      keyword: "const",
      $data: !0,
      error: g95,
      code(A) {
        let {
          gen: Q,
          data: B,
          $data: G,
          schemaCode: Z,
          schema: Y
        } = A;
        if (G || Y && typeof Y == "object") A.fail$data(pJ0._`!${(0,f95.useFunc)(Q,h95.default)}(${B}, ${Z})`);
        else A.fail(pJ0._`${Y} !== ${B}`)
      }
    };
  Z22.default = u95
})
// @from(Ln 257115, Col 4)
X22 = U((J22) => {
  Object.defineProperty(J22, "__esModule", {
    value: !0
  });
  var vxA = D8(),
    d95 = L7(),
    c95 = zG1(),
    p95 = {
      message: "must be equal to one of the allowed values",
      params: ({
        schemaCode: A
      }) => vxA._`{allowedValues: ${A}}`
    },
    l95 = {
      keyword: "enum",
      schemaType: "array",
      $data: !0,
      error: p95,
      code(A) {
        let {
          gen: Q,
          data: B,
          $data: G,
          schema: Z,
          schemaCode: Y,
          it: J
        } = A;
        if (!G && Z.length === 0) throw Error("enum must have non-empty array");
        let X = Z.length >= J.opts.loopEnum,
          I, D = () => I !== null && I !== void 0 ? I : I = (0, d95.useFunc)(Q, c95.default),
          W;
        if (X || G) W = Q.let("valid"), A.block$data(W, K);
        else {
          if (!Array.isArray(Z)) throw Error("ajv implementation error");
          let F = Q.const("vSchema", Y);
          W = (0, vxA.or)(...Z.map((H, E) => V(F, E)))
        }
        A.pass(W);

        function K() {
          Q.assign(W, !1), Q.forOf("v", Y, (F) => Q.if(vxA._`${D()}(${B}, ${F})`, () => Q.assign(W, !0).break()))
        }

        function V(F, H) {
          let E = Z[H];
          return typeof E === "object" && E !== null ? vxA._`${D()}(${B}, ${F}[${H}])` : vxA._`${B} === ${E}`
        }
      }
    };
  J22.default = l95
})
// @from(Ln 257166, Col 4)
D22 = U((I22) => {
  Object.defineProperty(I22, "__esModule", {
    value: !0
  });
  var n95 = hB2(),
    a95 = uB2(),
    o95 = lB2(),
    r95 = nB2(),
    s95 = oB2(),
    t95 = sB2(),
    e95 = eB2(),
    A45 = G22(),
    Q45 = Y22(),
    B45 = X22(),
    G45 = [n95.default, a95.default, o95.default, r95.default, s95.default, t95.default, e95.default, A45.default, {
      keyword: "type",
      schemaType: ["string", "array"]
    }, {
      keyword: "nullable",
      schemaType: "boolean"
    }, Q45.default, B45.default];
  I22.default = G45
})
// @from(Ln 257189, Col 4)
iJ0 = U((K22) => {
  Object.defineProperty(K22, "__esModule", {
    value: !0
  });
  K22.validateAdditionalItems = void 0;
  var e9A = D8(),
    lJ0 = L7(),
    Y45 = {
      message: ({
        params: {
          len: A
        }
      }) => e9A.str`must NOT have more than ${A} items`,
      params: ({
        params: {
          len: A
        }
      }) => e9A._`{limit: ${A}}`
    },
    J45 = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: Y45,
      code(A) {
        let {
          parentSchema: Q,
          it: B
        } = A, {
          items: G
        } = Q;
        if (!Array.isArray(G)) {
          (0, lJ0.checkStrictMode)(B, '"additionalItems" is ignored when "items" is not an array of schemas');
          return
        }
        W22(A, G)
      }
    };

  function W22(A, Q) {
    let {
      gen: B,
      schema: G,
      data: Z,
      keyword: Y,
      it: J
    } = A;
    J.items = !0;
    let X = B.const("len", e9A._`${Z}.length`);
    if (G === !1) A.setParams({
      len: Q.length
    }), A.pass(e9A._`${X} <= ${Q.length}`);
    else if (typeof G == "object" && !(0, lJ0.alwaysValidSchema)(J, G)) {
      let D = B.var("valid", e9A._`${X} <= ${Q.length}`);
      B.if((0, e9A.not)(D), () => I(D)), A.ok(D)
    }

    function I(D) {
      B.forRange("i", Q.length, X, (W) => {
        if (A.subschema({
            keyword: Y,
            dataProp: W,
            dataPropType: lJ0.Type.Num
          }, D), !J.allErrors) B.if((0, e9A.not)(D), () => B.break())
      })
    }
  }
  K22.validateAdditionalItems = W22;
  K22.default = J45
})
// @from(Ln 257260, Col 4)
nJ0 = U((E22) => {
  Object.defineProperty(E22, "__esModule", {
    value: !0
  });
  E22.validateTuple = void 0;
  var F22 = D8(),
    $G1 = L7(),
    I45 = x_(),
    D45 = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(A) {
        let {
          schema: Q,
          it: B
        } = A;
        if (Array.isArray(Q)) return H22(A, "additionalItems", Q);
        if (B.items = !0, (0, $G1.alwaysValidSchema)(B, Q)) return;
        A.ok((0, I45.validateArray)(A))
      }
    };

  function H22(A, Q, B = A.schema) {
    let {
      gen: G,
      parentSchema: Z,
      data: Y,
      keyword: J,
      it: X
    } = A;
    if (W(Z), X.opts.unevaluated && B.length && X.items !== !0) X.items = $G1.mergeEvaluated.items(G, B.length, X.items);
    let I = G.name("valid"),
      D = G.const("len", F22._`${Y}.length`);
    B.forEach((K, V) => {
      if ((0, $G1.alwaysValidSchema)(X, K)) return;
      G.if(F22._`${D} > ${V}`, () => A.subschema({
        keyword: J,
        schemaProp: V,
        dataProp: V
      }, I)), A.ok(I)
    });

    function W(K) {
      let {
        opts: V,
        errSchemaPath: F
      } = X, H = B.length, E = H === K.minItems && (H === K.maxItems || K[Q] === !1);
      if (V.strictTuples && !E) {
        let z = `"${J}" is ${H}-tuple, but minItems or maxItems/${Q} are not specified or different at path "${F}"`;
        (0, $G1.checkStrictMode)(X, z, V.strictTuples)
      }
    }
  }
  E22.validateTuple = H22;
  E22.default = D45
})
// @from(Ln 257318, Col 4)
C22 = U(($22) => {
  Object.defineProperty($22, "__esModule", {
    value: !0
  });
  var K45 = nJ0(),
    V45 = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (A) => (0, K45.validateTuple)(A, "items")
    };
  $22.default = V45
})
// @from(Ln 257332, Col 4)
N22 = U((q22) => {
  Object.defineProperty(q22, "__esModule", {
    value: !0
  });
  var U22 = D8(),
    H45 = L7(),
    E45 = x_(),
    z45 = iJ0(),
    $45 = {
      message: ({
        params: {
          len: A
        }
      }) => U22.str`must NOT have more than ${A} items`,
      params: ({
        params: {
          len: A
        }
      }) => U22._`{limit: ${A}}`
    },
    C45 = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: $45,
      code(A) {
        let {
          schema: Q,
          parentSchema: B,
          it: G
        } = A, {
          prefixItems: Z
        } = B;
        if (G.items = !0, (0, H45.alwaysValidSchema)(G, Q)) return;
        if (Z)(0, z45.validateAdditionalItems)(A, Z);
        else A.ok((0, E45.validateArray)(A))
      }
    };
  q22.default = C45
})
// @from(Ln 257373, Col 4)
L22 = U((w22) => {
  Object.defineProperty(w22, "__esModule", {
    value: !0
  });
  var y_ = D8(),
    CG1 = L7(),
    q45 = {
      message: ({
        params: {
          min: A,
          max: Q
        }
      }) => Q === void 0 ? y_.str`must contain at least ${A} valid item(s)` : y_.str`must contain at least ${A} and no more than ${Q} valid item(s)`,
      params: ({
        params: {
          min: A,
          max: Q
        }
      }) => Q === void 0 ? y_._`{minContains: ${A}}` : y_._`{minContains: ${A}, maxContains: ${Q}}`
    },
    N45 = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: !0,
      error: q45,
      code(A) {
        let {
          gen: Q,
          schema: B,
          parentSchema: G,
          data: Z,
          it: Y
        } = A, J, X, {
          minContains: I,
          maxContains: D
        } = G;
        if (Y.opts.next) J = I === void 0 ? 1 : I, X = D;
        else J = 1;
        let W = Q.const("len", y_._`${Z}.length`);
        if (A.setParams({
            min: J,
            max: X
          }), X === void 0 && J === 0) {
          (0, CG1.checkStrictMode)(Y, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
          return
        }
        if (X !== void 0 && J > X) {
          (0, CG1.checkStrictMode)(Y, '"minContains" > "maxContains" is always invalid'), A.fail();
          return
        }
        if ((0, CG1.alwaysValidSchema)(Y, B)) {
          let E = y_._`${W} >= ${J}`;
          if (X !== void 0) E = y_._`${E} && ${W} <= ${X}`;
          A.pass(E);
          return
        }
        Y.items = !0;
        let K = Q.name("valid");
        if (X === void 0 && J === 1) F(K, () => Q.if(K, () => Q.break()));
        else if (J === 0) {
          if (Q.let(K, !0), X !== void 0) Q.if(y_._`${Z}.length > 0`, V)
        } else Q.let(K, !1), V();
        A.result(K, () => A.reset());

        function V() {
          let E = Q.name("_valid"),
            z = Q.let("count", 0);
          F(E, () => Q.if(E, () => H(z)))
        }

        function F(E, z) {
          Q.forRange("i", 0, W, ($) => {
            A.subschema({
              keyword: "contains",
              dataProp: $,
              dataPropType: CG1.Type.Num,
              compositeRule: !0
            }, E), z()
          })
        }

        function H(E) {
          if (Q.code(y_._`${E}++`), X === void 0) Q.if(y_._`${E} >= ${J}`, () => Q.assign(K, !0).break());
          else if (Q.if(y_._`${E} > ${X}`, () => Q.assign(K, !1).break()), J === 1) Q.assign(K, !0);
          else Q.if(y_._`${E} >= ${J}`, () => Q.assign(K, !0))
        }
      }
    };
  w22.default = N45
})
// @from(Ln 257465, Col 4)
T22 = U((R22) => {
  Object.defineProperty(R22, "__esModule", {
    value: !0
  });
  R22.validateSchemaDeps = R22.validatePropertyDeps = R22.error = void 0;
  var aJ0 = D8(),
    L45 = L7(),
    kxA = x_();
  R22.error = {
    message: ({
      params: {
        property: A,
        depsCount: Q,
        deps: B
      }
    }) => {
      let G = Q === 1 ? "property" : "properties";
      return aJ0.str`must have ${G} ${B} when property ${A} is present`
    },
    params: ({
      params: {
        property: A,
        depsCount: Q,
        deps: B,
        missingProperty: G
      }
    }) => aJ0._`{property: ${A},
    missingProperty: ${G},
    depsCount: ${Q},
    deps: ${B}}`
  };
  var O45 = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: R22.error,
    code(A) {
      let [Q, B] = M45(A);
      O22(A, Q), M22(A, B)
    }
  };

  function M45({
    schema: A
  }) {
    let Q = {},
      B = {};
    for (let G in A) {
      if (G === "__proto__") continue;
      let Z = Array.isArray(A[G]) ? Q : B;
      Z[G] = A[G]
    }
    return [Q, B]
  }

  function O22(A, Q = A.schema) {
    let {
      gen: B,
      data: G,
      it: Z
    } = A;
    if (Object.keys(Q).length === 0) return;
    let Y = B.let("missing");
    for (let J in Q) {
      let X = Q[J];
      if (X.length === 0) continue;
      let I = (0, kxA.propertyInData)(B, G, J, Z.opts.ownProperties);
      if (A.setParams({
          property: J,
          depsCount: X.length,
          deps: X.join(", ")
        }), Z.allErrors) B.if(I, () => {
        for (let D of X)(0, kxA.checkReportMissingProp)(A, D)
      });
      else B.if(aJ0._`${I} && (${(0,kxA.checkMissingProp)(A,X,Y)})`), (0, kxA.reportMissingProp)(A, Y), B.else()
    }
  }
  R22.validatePropertyDeps = O22;

  function M22(A, Q = A.schema) {
    let {
      gen: B,
      data: G,
      keyword: Z,
      it: Y
    } = A, J = B.name("valid");
    for (let X in Q) {
      if ((0, L45.alwaysValidSchema)(Y, Q[X])) continue;
      B.if((0, kxA.propertyInData)(B, G, X, Y.opts.ownProperties), () => {
        let I = A.subschema({
          keyword: Z,
          schemaProp: X
        }, J);
        A.mergeValidEvaluated(I, J)
      }, () => B.var(J, !0)), A.ok(J)
    }
  }
  R22.validateSchemaDeps = M22;
  R22.default = O45
})
// @from(Ln 257565, Col 4)
x22 = U((S22) => {
  Object.defineProperty(S22, "__esModule", {
    value: !0
  });
  var P22 = D8(),
    j45 = L7(),
    T45 = {
      message: "property name must be valid",
      params: ({
        params: A
      }) => P22._`{propertyName: ${A.propertyName}}`
    },
    P45 = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: T45,
      code(A) {
        let {
          gen: Q,
          schema: B,
          data: G,
          it: Z
        } = A;
        if ((0, j45.alwaysValidSchema)(Z, B)) return;
        let Y = Q.name("valid");
        Q.forIn("key", G, (J) => {
          A.setParams({
            propertyName: J
          }), A.subschema({
            keyword: "propertyNames",
            data: J,
            dataTypes: ["string"],
            propertyName: J,
            compositeRule: !0
          }, Y), Q.if((0, P22.not)(Y), () => {
            if (A.error(!0), !Z.allErrors) Q.break()
          })
        }), A.ok(Y)
      }
    };
  S22.default = P45
})
// @from(Ln 257608, Col 4)
oJ0 = U((y22) => {
  Object.defineProperty(y22, "__esModule", {
    value: !0
  });
  var UG1 = x_(),
    CS = D8(),
    x45 = Hd(),
    qG1 = L7(),
    y45 = {
      message: "must NOT have additional properties",
      params: ({
        params: A
      }) => CS._`{additionalProperty: ${A.additionalProperty}}`
    },
    v45 = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: !0,
      trackErrors: !0,
      error: y45,
      code(A) {
        let {
          gen: Q,
          schema: B,
          parentSchema: G,
          data: Z,
          errsCount: Y,
          it: J
        } = A;
        if (!Y) throw Error("ajv implementation error");
        let {
          allErrors: X,
          opts: I
        } = J;
        if (J.props = !0, I.removeAdditional !== "all" && (0, qG1.alwaysValidSchema)(J, B)) return;
        let D = (0, UG1.allSchemaProperties)(G.properties),
          W = (0, UG1.allSchemaProperties)(G.patternProperties);
        K(), A.ok(CS._`${Y} === ${x45.default.errors}`);

        function K() {
          Q.forIn("key", Z, (z) => {
            if (!D.length && !W.length) H(z);
            else Q.if(V(z), () => H(z))
          })
        }

        function V(z) {
          let $;
          if (D.length > 8) {
            let O = (0, qG1.schemaRefOrVal)(J, G.properties, "properties");
            $ = (0, UG1.isOwnProperty)(Q, O, z)
          } else if (D.length) $ = (0, CS.or)(...D.map((O) => CS._`${z} === ${O}`));
          else $ = CS.nil;
          if (W.length) $ = (0, CS.or)($, ...W.map((O) => CS._`${(0,UG1.usePattern)(A,O)}.test(${z})`));
          return (0, CS.not)($)
        }

        function F(z) {
          Q.code(CS._`delete ${Z}[${z}]`)
        }

        function H(z) {
          if (I.removeAdditional === "all" || I.removeAdditional && B === !1) {
            F(z);
            return
          }
          if (B === !1) {
            if (A.setParams({
                additionalProperty: z
              }), A.error(), !X) Q.break();
            return
          }
          if (typeof B == "object" && !(0, qG1.alwaysValidSchema)(J, B)) {
            let $ = Q.name("valid");
            if (I.removeAdditional === "failing") E(z, $, !1), Q.if((0, CS.not)($), () => {
              A.reset(), F(z)
            });
            else if (E(z, $), !X) Q.if((0, CS.not)($), () => Q.break())
          }
        }

        function E(z, $, O) {
          let L = {
            keyword: "additionalProperties",
            dataProp: z,
            dataPropType: qG1.Type.Str
          };
          if (O === !1) Object.assign(L, {
            compositeRule: !0,
            createErrors: !1,
            allErrors: !1
          });
          A.subschema(L, $)
        }
      }
    };
  y22.default = v45
})
// @from(Ln 257707, Col 4)
f22 = U((b22) => {
  Object.defineProperty(b22, "__esModule", {
    value: !0
  });
  var b45 = LxA(),
    v22 = x_(),
    rJ0 = L7(),
    k22 = oJ0(),
    f45 = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(A) {
        let {
          gen: Q,
          schema: B,
          parentSchema: G,
          data: Z,
          it: Y
        } = A;
        if (Y.opts.removeAdditional === "all" && G.additionalProperties === void 0) k22.default.code(new b45.KeywordCxt(Y, k22.default, "additionalProperties"));
        let J = (0, v22.allSchemaProperties)(B);
        for (let K of J) Y.definedProperties.add(K);
        if (Y.opts.unevaluated && J.length && Y.props !== !0) Y.props = rJ0.mergeEvaluated.props(Q, (0, rJ0.toHash)(J), Y.props);
        let X = J.filter((K) => !(0, rJ0.alwaysValidSchema)(Y, B[K]));
        if (X.length === 0) return;
        let I = Q.name("valid");
        for (let K of X) {
          if (D(K)) W(K);
          else {
            if (Q.if((0, v22.propertyInData)(Q, Z, K, Y.opts.ownProperties)), W(K), !Y.allErrors) Q.else().var(I, !0);
            Q.endIf()
          }
          A.it.definedProperties.add(K), A.ok(I)
        }

        function D(K) {
          return Y.opts.useDefaults && !Y.compositeRule && B[K].default !== void 0
        }

        function W(K) {
          A.subschema({
            keyword: "properties",
            schemaProp: K,
            dataProp: K
          }, I)
        }
      }
    };
  b22.default = f45
})
// @from(Ln 257758, Col 4)
d22 = U((m22) => {
  Object.defineProperty(m22, "__esModule", {
    value: !0
  });
  var h22 = x_(),
    NG1 = D8(),
    g22 = L7(),
    u22 = L7(),
    g45 = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(A) {
        let {
          gen: Q,
          schema: B,
          data: G,
          parentSchema: Z,
          it: Y
        } = A, {
          opts: J
        } = Y, X = (0, h22.allSchemaProperties)(B), I = X.filter((E) => (0, g22.alwaysValidSchema)(Y, B[E]));
        if (X.length === 0 || I.length === X.length && (!Y.opts.unevaluated || Y.props === !0)) return;
        let D = J.strictSchema && !J.allowMatchingProperties && Z.properties,
          W = Q.name("valid");
        if (Y.props !== !0 && !(Y.props instanceof NG1.Name)) Y.props = (0, u22.evaluatedPropsToName)(Q, Y.props);
        let {
          props: K
        } = Y;
        V();

        function V() {
          for (let E of X) {
            if (D) F(E);
            if (Y.allErrors) H(E);
            else Q.var(W, !0), H(E), Q.if(W)
          }
        }

        function F(E) {
          for (let z in D)
            if (new RegExp(E).test(z))(0, g22.checkStrictMode)(Y, `property ${z} matches pattern ${E} (use allowMatchingProperties)`)
        }

        function H(E) {
          Q.forIn("key", G, (z) => {
            Q.if(NG1._`${(0,h22.usePattern)(A,E)}.test(${z})`, () => {
              let $ = I.includes(E);
              if (!$) A.subschema({
                keyword: "patternProperties",
                schemaProp: E,
                dataProp: z,
                dataPropType: u22.Type.Str
              }, W);
              if (Y.opts.unevaluated && K !== !0) Q.assign(NG1._`${K}[${z}]`, !0);
              else if (!$ && !Y.allErrors) Q.if((0, NG1.not)(W), () => Q.break())
            })
          })
        }
      }
    };
  m22.default = g45
})
// @from(Ln 257821, Col 4)
p22 = U((c22) => {
  Object.defineProperty(c22, "__esModule", {
    value: !0
  });
  var m45 = L7(),
    d45 = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: !0,
      code(A) {
        let {
          gen: Q,
          schema: B,
          it: G
        } = A;
        if ((0, m45.alwaysValidSchema)(G, B)) {
          A.fail();
          return
        }
        let Z = Q.name("valid");
        A.subschema({
          keyword: "not",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, Z), A.failResult(Z, () => A.reset(), () => A.error())
      },
      error: {
        message: "must NOT be valid"
      }
    };
  c22.default = d45
})
// @from(Ln 257854, Col 4)
i22 = U((l22) => {
  Object.defineProperty(l22, "__esModule", {
    value: !0
  });
  var p45 = x_(),
    l45 = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: !0,
      code: p45.validateUnion,
      error: {
        message: "must match a schema in anyOf"
      }
    };
  l22.default = l45
})
// @from(Ln 257870, Col 4)
a22 = U((n22) => {
  Object.defineProperty(n22, "__esModule", {
    value: !0
  });
  var wG1 = D8(),
    n45 = L7(),
    a45 = {
      message: "must match exactly one schema in oneOf",
      params: ({
        params: A
      }) => wG1._`{passingSchemas: ${A.passing}}`
    },
    o45 = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: !0,
      error: a45,
      code(A) {
        let {
          gen: Q,
          schema: B,
          parentSchema: G,
          it: Z
        } = A;
        if (!Array.isArray(B)) throw Error("ajv implementation error");
        if (Z.opts.discriminator && G.discriminator) return;
        let Y = B,
          J = Q.let("valid", !1),
          X = Q.let("passing", null),
          I = Q.name("_valid");
        A.setParams({
          passing: X
        }), Q.block(D), A.result(J, () => A.reset(), () => A.error(!0));

        function D() {
          Y.forEach((W, K) => {
            let V;
            if ((0, n45.alwaysValidSchema)(Z, W)) Q.var(I, !0);
            else V = A.subschema({
              keyword: "oneOf",
              schemaProp: K,
              compositeRule: !0
            }, I);
            if (K > 0) Q.if(wG1._`${I} && ${J}`).assign(J, !1).assign(X, wG1._`[${X}, ${K}]`).else();
            Q.if(I, () => {
              if (Q.assign(J, !0), Q.assign(X, K), V) A.mergeEvaluated(V, wG1.Name)
            })
          })
        }
      }
    };
  n22.default = o45
})
// @from(Ln 257923, Col 4)
r22 = U((o22) => {
  Object.defineProperty(o22, "__esModule", {
    value: !0
  });
  var s45 = L7(),
    t45 = {
      keyword: "allOf",
      schemaType: "array",
      code(A) {
        let {
          gen: Q,
          schema: B,
          it: G
        } = A;
        if (!Array.isArray(B)) throw Error("ajv implementation error");
        let Z = Q.name("valid");
        B.forEach((Y, J) => {
          if ((0, s45.alwaysValidSchema)(G, Y)) return;
          let X = A.subschema({
            keyword: "allOf",
            schemaProp: J
          }, Z);
          A.ok(Z), A.mergeEvaluated(X)
        })
      }
    };
  o22.default = t45
})
// @from(Ln 257951, Col 4)
A92 = U((e22) => {
  Object.defineProperty(e22, "__esModule", {
    value: !0
  });
  var LG1 = D8(),
    t22 = L7(),
    A65 = {
      message: ({
        params: A
      }) => LG1.str`must match "${A.ifClause}" schema`,
      params: ({
        params: A
      }) => LG1._`{failingKeyword: ${A.ifClause}}`
    },
    Q65 = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: !0,
      error: A65,
      code(A) {
        let {
          gen: Q,
          parentSchema: B,
          it: G
        } = A;
        if (B.then === void 0 && B.else === void 0)(0, t22.checkStrictMode)(G, '"if" without "then" and "else" is ignored');
        let Z = s22(G, "then"),
          Y = s22(G, "else");
        if (!Z && !Y) return;
        let J = Q.let("valid", !0),
          X = Q.name("_valid");
        if (I(), A.reset(), Z && Y) {
          let W = Q.let("ifClause");
          A.setParams({
            ifClause: W
          }), Q.if(X, D("then", W), D("else", W))
        } else if (Z) Q.if(X, D("then"));
        else Q.if((0, LG1.not)(X), D("else"));
        A.pass(J, () => A.error(!0));

        function I() {
          let W = A.subschema({
            keyword: "if",
            compositeRule: !0,
            createErrors: !1,
            allErrors: !1
          }, X);
          A.mergeEvaluated(W)
        }

        function D(W, K) {
          return () => {
            let V = A.subschema({
              keyword: W
            }, X);
            if (Q.assign(J, X), A.mergeValidEvaluated(V, J), K) Q.assign(K, LG1._`${W}`);
            else A.setParams({
              ifClause: W
            })
          }
        }
      }
    };

  function s22(A, Q) {
    let B = A.schema[Q];
    return B !== void 0 && !(0, t22.alwaysValidSchema)(A, B)
  }
  e22.default = Q65
})
// @from(Ln 258021, Col 4)
B92 = U((Q92) => {
  Object.defineProperty(Q92, "__esModule", {
    value: !0
  });
  var G65 = L7(),
    Z65 = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({
        keyword: A,
        parentSchema: Q,
        it: B
      }) {
        if (Q.if === void 0)(0, G65.checkStrictMode)(B, `"${A}" without "if" is ignored`)
      }
    };
  Q92.default = Z65
})
// @from(Ln 258039, Col 4)
Z92 = U((G92) => {
  Object.defineProperty(G92, "__esModule", {
    value: !0
  });
  var J65 = iJ0(),
    X65 = C22(),
    I65 = nJ0(),
    D65 = N22(),
    W65 = L22(),
    K65 = T22(),
    V65 = x22(),
    F65 = oJ0(),
    H65 = f22(),
    E65 = d22(),
    z65 = p22(),
    $65 = i22(),
    C65 = a22(),
    U65 = r22(),
    q65 = A92(),
    N65 = B92();

  function w65(A = !1) {
    let Q = [z65.default, $65.default, C65.default, U65.default, q65.default, N65.default, V65.default, F65.default, K65.default, H65.default, E65.default];
    if (A) Q.push(X65.default, D65.default);
    else Q.push(J65.default, I65.default);
    return Q.push(W65.default), Q
  }
  G92.default = w65
})
// @from(Ln 258068, Col 4)
J92 = U((Y92) => {
  Object.defineProperty(Y92, "__esModule", {
    value: !0
  });
  var pD = D8(),
    O65 = {
      message: ({
        schemaCode: A
      }) => pD.str`must match format "${A}"`,
      params: ({
        schemaCode: A
      }) => pD._`{format: ${A}}`
    },
    M65 = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: !0,
      error: O65,
      code(A, Q) {
        let {
          gen: B,
          data: G,
          $data: Z,
          schema: Y,
          schemaCode: J,
          it: X
        } = A, {
          opts: I,
          errSchemaPath: D,
          schemaEnv: W,
          self: K
        } = X;
        if (!I.validateFormats) return;
        if (Z) V();
        else F();

        function V() {
          let H = B.scopeValue("formats", {
              ref: K.formats,
              code: I.code.formats
            }),
            E = B.const("fDef", pD._`${H}[${J}]`),
            z = B.let("fType"),
            $ = B.let("format");
          B.if(pD._`typeof ${E} == "object" && !(${E} instanceof RegExp)`, () => B.assign(z, pD._`${E}.type || "string"`).assign($, pD._`${E}.validate`), () => B.assign(z, pD._`"string"`).assign($, E)), A.fail$data((0, pD.or)(O(), L()));

          function O() {
            if (I.strictSchema === !1) return pD.nil;
            return pD._`${J} && !${$}`
          }

          function L() {
            let M = W.$async ? pD._`(${E}.async ? await ${$}(${G}) : ${$}(${G}))` : pD._`${$}(${G})`,
              _ = pD._`(typeof ${$} == "function" ? ${M} : ${$}.test(${G}))`;
            return pD._`${$} && ${$} !== true && ${z} === ${Q} && !${_}`
          }
        }

        function F() {
          let H = K.formats[Y];
          if (!H) {
            O();
            return
          }
          if (H === !0) return;
          let [E, z, $] = L(H);
          if (E === Q) A.pass(M());

          function O() {
            if (I.strictSchema === !1) {
              K.logger.warn(_());
              return
            }
            throw Error(_());

            function _() {
              return `unknown format "${Y}" ignored in schema at path "${D}"`
            }
          }

          function L(_) {
            let j = _ instanceof RegExp ? (0, pD.regexpCode)(_) : I.code.formats ? pD._`${I.code.formats}${(0,pD.getProperty)(Y)}` : void 0,
              x = B.scopeValue("formats", {
                key: Y,
                ref: _,
                code: j
              });
            if (typeof _ == "object" && !(_ instanceof RegExp)) return [_.type || "string", _.validate, pD._`${x}.validate`];
            return ["string", _, x]
          }

          function M() {
            if (typeof H == "object" && !(H instanceof RegExp) && H.async) {
              if (!W.$async) throw Error("async format in sync schema");
              return pD._`await ${$}(${G})`
            }
            return typeof z == "function" ? pD._`${$}(${G})` : pD._`${$}.test(${G})`
          }
        }
      }
    };
  Y92.default = M65
})
// @from(Ln 258172, Col 4)
I92 = U((X92) => {
  Object.defineProperty(X92, "__esModule", {
    value: !0
  });
  var _65 = J92(),
    j65 = [_65.default];
  X92.default = j65
})
// @from(Ln 258180, Col 4)
K92 = U((D92) => {
  Object.defineProperty(D92, "__esModule", {
    value: !0
  });
  D92.contentVocabulary = D92.metadataVocabulary = void 0;
  D92.metadataVocabulary = ["title", "description", "default", "deprecated", "readOnly", "writeOnly", "examples"];
  D92.contentVocabulary = ["contentMediaType", "contentEncoding", "contentSchema"]
})
// @from(Ln 258188, Col 4)
H92 = U((F92) => {
  Object.defineProperty(F92, "__esModule", {
    value: !0
  });
  var S65 = bB2(),
    x65 = D22(),
    y65 = Z92(),
    v65 = I92(),
    V92 = K92(),
    k65 = [S65.default, x65.default, (0, y65.default)(), v65.default, V92.metadataVocabulary, V92.contentVocabulary];
  F92.default = k65
})
// @from(Ln 258200, Col 4)
C92 = U((z92) => {
  Object.defineProperty(z92, "__esModule", {
    value: !0
  });
  z92.DiscrError = void 0;
  var E92;
  (function (A) {
    A.Tag = "tag", A.Mapping = "mapping"
  })(E92 || (z92.DiscrError = E92 = {}))
})
// @from(Ln 258210, Col 4)
N92 = U((q92) => {
  Object.defineProperty(q92, "__esModule", {
    value: !0
  });
  var hKA = D8(),
    sJ0 = C92(),
    U92 = YG1(),
    f65 = OxA(),
    h65 = L7(),
    g65 = {
      message: ({
        params: {
          discrError: A,
          tagName: Q
        }
      }) => A === sJ0.DiscrError.Tag ? `tag "${Q}" must be string` : `value of tag "${Q}" must be in oneOf`,
      params: ({
        params: {
          discrError: A,
          tag: Q,
          tagName: B
        }
      }) => hKA._`{error: ${A}, tag: ${B}, tagValue: ${Q}}`
    },
    u65 = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error: g65,
      code(A) {
        let {
          gen: Q,
          data: B,
          schema: G,
          parentSchema: Z,
          it: Y
        } = A, {
          oneOf: J
        } = Z;
        if (!Y.opts.discriminator) throw Error("discriminator: requires discriminator option");
        let X = G.propertyName;
        if (typeof X != "string") throw Error("discriminator: requires propertyName");
        if (G.mapping) throw Error("discriminator: mapping is not supported");
        if (!J) throw Error("discriminator: requires oneOf keyword");
        let I = Q.let("valid", !1),
          D = Q.const("tag", hKA._`${B}${(0,hKA.getProperty)(X)}`);
        Q.if(hKA._`typeof ${D} == "string"`, () => W(), () => A.error(!1, {
          discrError: sJ0.DiscrError.Tag,
          tag: D,
          tagName: X
        })), A.ok(I);

        function W() {
          let F = V();
          Q.if(!1);
          for (let H in F) Q.elseIf(hKA._`${D} === ${H}`), Q.assign(I, K(F[H]));
          Q.else(), A.error(!1, {
            discrError: sJ0.DiscrError.Mapping,
            tag: D,
            tagName: X
          }), Q.endIf()
        }

        function K(F) {
          let H = Q.name("valid"),
            E = A.subschema({
              keyword: "oneOf",
              schemaProp: F
            }, H);
          return A.mergeEvaluated(E, hKA.Name), H
        }

        function V() {
          var F;
          let H = {},
            E = $(Z),
            z = !0;
          for (let M = 0; M < J.length; M++) {
            let _ = J[M];
            if ((_ === null || _ === void 0 ? void 0 : _.$ref) && !(0, h65.schemaHasRulesButRef)(_, Y.self.RULES)) {
              let x = _.$ref;
              if (_ = U92.resolveRef.call(Y.self, Y.schemaEnv.root, Y.baseId, x), _ instanceof U92.SchemaEnv) _ = _.schema;
              if (_ === void 0) throw new f65.default(Y.opts.uriResolver, Y.baseId, x)
            }
            let j = (F = _ === null || _ === void 0 ? void 0 : _.properties) === null || F === void 0 ? void 0 : F[X];
            if (typeof j != "object") throw Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${X}"`);
            z = z && (E || $(_)), O(j, M)
          }
          if (!z) throw Error(`discriminator: "${X}" must be required`);
          return H;

          function $({
            required: M
          }) {
            return Array.isArray(M) && M.includes(X)
          }

          function O(M, _) {
            if (M.const) L(M.const, _);
            else if (M.enum)
              for (let j of M.enum) L(j, _);
            else throw Error(`discriminator: "properties/${X}" must have "const" or "enum"`)
          }

          function L(M, _) {
            if (typeof M != "string" || M in H) throw Error(`discriminator: "${X}" values must be unique strings`);
            H[M] = _
          }
        }
      }
    };
  q92.default = u65
})
// @from(Ln 258323, Col 4)
w92 = U((YEZ, d65) => {
  d65.exports = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://json-schema.org/draft-07/schema#",
    title: "Core schema meta-schema",
    definitions: {
      schemaArray: {
        type: "array",
        minItems: 1,
        items: {
          $ref: "#"
        }
      },
      nonNegativeInteger: {
        type: "integer",
        minimum: 0
      },
      nonNegativeIntegerDefault0: {
        allOf: [{
          $ref: "#/definitions/nonNegativeInteger"
        }, {
          default: 0
        }]
      },
      simpleTypes: {
        enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
      },
      stringArray: {
        type: "array",
        items: {
          type: "string"
        },
        uniqueItems: !0,
        default: []
      }
    },
    type: ["object", "boolean"],
    properties: {
      $id: {
        type: "string",
        format: "uri-reference"
      },
      $schema: {
        type: "string",
        format: "uri"
      },
      $ref: {
        type: "string",
        format: "uri-reference"
      },
      $comment: {
        type: "string"
      },
      title: {
        type: "string"
      },
      description: {
        type: "string"
      },
      default: !0,
      readOnly: {
        type: "boolean",
        default: !1
      },
      examples: {
        type: "array",
        items: !0
      },
      multipleOf: {
        type: "number",
        exclusiveMinimum: 0
      },
      maximum: {
        type: "number"
      },
      exclusiveMaximum: {
        type: "number"
      },
      minimum: {
        type: "number"
      },
      exclusiveMinimum: {
        type: "number"
      },
      maxLength: {
        $ref: "#/definitions/nonNegativeInteger"
      },
      minLength: {
        $ref: "#/definitions/nonNegativeIntegerDefault0"
      },
      pattern: {
        type: "string",
        format: "regex"
      },
      additionalItems: {
        $ref: "#"
      },
      items: {
        anyOf: [{
          $ref: "#"
        }, {
          $ref: "#/definitions/schemaArray"
        }],
        default: !0
      },
      maxItems: {
        $ref: "#/definitions/nonNegativeInteger"
      },
      minItems: {
        $ref: "#/definitions/nonNegativeIntegerDefault0"
      },
      uniqueItems: {
        type: "boolean",
        default: !1
      },
      contains: {
        $ref: "#"
      },
      maxProperties: {
        $ref: "#/definitions/nonNegativeInteger"
      },
      minProperties: {
        $ref: "#/definitions/nonNegativeIntegerDefault0"
      },
      required: {
        $ref: "#/definitions/stringArray"
      },
      additionalProperties: {
        $ref: "#"
      },
      definitions: {
        type: "object",
        additionalProperties: {
          $ref: "#"
        },
        default: {}
      },
      properties: {
        type: "object",
        additionalProperties: {
          $ref: "#"
        },
        default: {}
      },
      patternProperties: {
        type: "object",
        additionalProperties: {
          $ref: "#"
        },
        propertyNames: {
          format: "regex"
        },
        default: {}
      },
      dependencies: {
        type: "object",
        additionalProperties: {
          anyOf: [{
            $ref: "#"
          }, {
            $ref: "#/definitions/stringArray"
          }]
        }
      },
      propertyNames: {
        $ref: "#"
      },
      const: !0,
      enum: {
        type: "array",
        items: !0,
        minItems: 1,
        uniqueItems: !0
      },
      type: {
        anyOf: [{
          $ref: "#/definitions/simpleTypes"
        }, {
          type: "array",
          items: {
            $ref: "#/definitions/simpleTypes"
          },
          minItems: 1,
          uniqueItems: !0
        }]
      },
      format: {
        type: "string"
      },
      contentMediaType: {
        type: "string"
      },
      contentEncoding: {
        type: "string"
      },
      if: {
        $ref: "#"
      },
      then: {
        $ref: "#"
      },
      else: {
        $ref: "#"
      },
      allOf: {
        $ref: "#/definitions/schemaArray"
      },
      anyOf: {
        $ref: "#/definitions/schemaArray"
      },
      oneOf: {
        $ref: "#/definitions/schemaArray"
      },
      not: {
        $ref: "#"
      }
    },
    default: !0
  }
})
// @from(Ln 258543, Col 4)
MG1 = U((RN, tJ0) => {
  Object.defineProperty(RN, "__esModule", {
    value: !0
  });
  RN.MissingRefError = RN.ValidationError = RN.CodeGen = RN.Name = RN.nil = RN.stringify = RN.str = RN._ = RN.KeywordCxt = RN.Ajv = void 0;
  var c65 = RB2(),
    p65 = H92(),
    l65 = N92(),
    L92 = w92(),
    i65 = ["/properties"],
    OG1 = "http://json-schema.org/draft-07/schema";
  class bxA extends c65.default {
    _addVocabularies() {
      if (super._addVocabularies(), p65.default.forEach((A) => this.addVocabulary(A)), this.opts.discriminator) this.addKeyword(l65.default)
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta) return;
      let A = this.opts.$data ? this.$dataMetaSchema(L92, i65) : L92;
      this.addMetaSchema(A, OG1, !1), this.refs["http://json-schema.org/schema"] = OG1
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(OG1) ? OG1 : void 0)
    }
  }
  RN.Ajv = bxA;
  tJ0.exports = RN = bxA;
  tJ0.exports.Ajv = bxA;
  Object.defineProperty(RN, "__esModule", {
    value: !0
  });
  RN.default = bxA;
  var n65 = LxA();
  Object.defineProperty(RN, "KeywordCxt", {
    enumerable: !0,
    get: function () {
      return n65.KeywordCxt
    }
  });
  var gKA = D8();
  Object.defineProperty(RN, "_", {
    enumerable: !0,
    get: function () {
      return gKA._
    }
  });
  Object.defineProperty(RN, "str", {
    enumerable: !0,
    get: function () {
      return gKA.str
    }
  });
  Object.defineProperty(RN, "stringify", {
    enumerable: !0,
    get: function () {
      return gKA.stringify
    }
  });
  Object.defineProperty(RN, "nil", {
    enumerable: !0,
    get: function () {
      return gKA.nil
    }
  });
  Object.defineProperty(RN, "Name", {
    enumerable: !0,
    get: function () {
      return gKA.Name
    }
  });
  Object.defineProperty(RN, "CodeGen", {
    enumerable: !0,
    get: function () {
      return gKA.CodeGen
    }
  });
  var a65 = GG1();
  Object.defineProperty(RN, "ValidationError", {
    enumerable: !0,
    get: function () {
      return a65.default
    }
  });
  var o65 = OxA();
  Object.defineProperty(RN, "MissingRefError", {
    enumerable: !0,
    get: function () {
      return o65.default
    }
  })
})
// @from(Ln 258633, Col 4)
y92 = U((S92) => {
  Object.defineProperty(S92, "__esModule", {
    value: !0
  });
  S92.formatNames = S92.fastFormats = S92.fullFormats = void 0;

  function Ob(A, Q) {
    return {
      validate: A,
      compare: Q
    }
  }
  S92.fullFormats = {
    date: Ob(_92, BX0),
    time: Ob(AX0(!0), GX0),
    "date-time": Ob(O92(!0), T92),
    "iso-time": Ob(AX0(), j92),
    "iso-date-time": Ob(O92(), P92),
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: G35,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: W35,
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    byte: Z35,
    int32: {
      type: "number",
      validate: X35
    },
    int64: {
      type: "number",
      validate: I35
    },
    float: {
      type: "number",
      validate: R92
    },
    double: {
      type: "number",
      validate: R92
    },
    password: !0,
    binary: !0
  };
  S92.fastFormats = {
    ...S92.fullFormats,
    date: Ob(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, BX0),
    time: Ob(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, GX0),
    "date-time": Ob(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, T92),
    "iso-time": Ob(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, j92),
    "iso-date-time": Ob(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, P92),
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  };
  S92.formatNames = Object.keys(S92.fullFormats);

  function t65(A) {
    return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
  }
  var e65 = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    A35 = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function _92(A) {
    let Q = e65.exec(A);
    if (!Q) return !1;
    let B = +Q[1],
      G = +Q[2],
      Z = +Q[3];
    return G >= 1 && G <= 12 && Z >= 1 && Z <= (G === 2 && t65(B) ? 29 : A35[G])
  }

  function BX0(A, Q) {
    if (!(A && Q)) return;
    if (A > Q) return 1;
    if (A < Q) return -1;
    return 0
  }
  var eJ0 = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;

  function AX0(A) {
    return function (B) {
      let G = eJ0.exec(B);
      if (!G) return !1;
      let Z = +G[1],
        Y = +G[2],
        J = +G[3],
        X = G[4],
        I = G[5] === "-" ? -1 : 1,
        D = +(G[6] || 0),
        W = +(G[7] || 0);
      if (D > 23 || W > 59 || A && !X) return !1;
      if (Z <= 23 && Y <= 59 && J < 60) return !0;
      let K = Y - W * I,
        V = Z - D * I - (K < 0 ? 1 : 0);
      return (V === 23 || V === -1) && (K === 59 || K === -1) && J < 61
    }
  }

  function GX0(A, Q) {
    if (!(A && Q)) return;
    let B = new Date("2020-01-01T" + A).valueOf(),
      G = new Date("2020-01-01T" + Q).valueOf();
    if (!(B && G)) return;
    return B - G
  }

  function j92(A, Q) {
    if (!(A && Q)) return;
    let B = eJ0.exec(A),
      G = eJ0.exec(Q);
    if (!(B && G)) return;
    if (A = B[1] + B[2] + B[3], Q = G[1] + G[2] + G[3], A > Q) return 1;
    if (A < Q) return -1;
    return 0
  }
  var QX0 = /t|\s/i;

  function O92(A) {
    let Q = AX0(A);
    return function (G) {
      let Z = G.split(QX0);
      return Z.length === 2 && _92(Z[0]) && Q(Z[1])
    }
  }

  function T92(A, Q) {
    if (!(A && Q)) return;
    let B = new Date(A).valueOf(),
      G = new Date(Q).valueOf();
    if (!(B && G)) return;
    return B - G
  }

  function P92(A, Q) {
    if (!(A && Q)) return;
    let [B, G] = A.split(QX0), [Z, Y] = Q.split(QX0), J = BX0(B, Z);
    if (J === void 0) return;
    return J || GX0(G, Y)
  }
  var Q35 = /\/|:/,
    B35 = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;

  function G35(A) {
    return Q35.test(A) && B35.test(A)
  }
  var M92 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;

  function Z35(A) {
    return M92.lastIndex = 0, M92.test(A)
  }
  var Y35 = -2147483648,
    J35 = 2147483647;

  function X35(A) {
    return Number.isInteger(A) && A <= J35 && A >= Y35
  }

  function I35(A) {
    return Number.isInteger(A)
  }

  function R92() {
    return !0
  }
  var D35 = /[^\\]\\Z/;

  function W35(A) {
    if (D35.test(A)) return !1;
    try {
      return new RegExp(A), !0
    } catch (Q) {
      return !1
    }
  }
})
// @from(Ln 258817, Col 4)
k92 = U((v92) => {
  Object.defineProperty(v92, "__esModule", {
    value: !0
  });
  v92.formatLimitDefinition = void 0;
  var V35 = MG1(),
    US = D8(),
    Cr = US.operators,
    RG1 = {
      formatMaximum: {
        okStr: "<=",
        ok: Cr.LTE,
        fail: Cr.GT
      },
      formatMinimum: {
        okStr: ">=",
        ok: Cr.GTE,
        fail: Cr.LT
      },
      formatExclusiveMaximum: {
        okStr: "<",
        ok: Cr.LT,
        fail: Cr.GTE
      },
      formatExclusiveMinimum: {
        okStr: ">",
        ok: Cr.GT,
        fail: Cr.LTE
      }
    },
    F35 = {
      message: ({
        keyword: A,
        schemaCode: Q
      }) => US.str`should be ${RG1[A].okStr} ${Q}`,
      params: ({
        keyword: A,
        schemaCode: Q
      }) => US._`{comparison: ${RG1[A].okStr}, limit: ${Q}}`
    };
  v92.formatLimitDefinition = {
    keyword: Object.keys(RG1),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: F35,
    code(A) {
      let {
        gen: Q,
        data: B,
        schemaCode: G,
        keyword: Z,
        it: Y
      } = A, {
        opts: J,
        self: X
      } = Y;
      if (!J.validateFormats) return;
      let I = new V35.KeywordCxt(Y, X.RULES.all.format.definition, "format");
      if (I.$data) D();
      else W();

      function D() {
        let V = Q.scopeValue("formats", {
            ref: X.formats,
            code: J.code.formats
          }),
          F = Q.const("fmt", US._`${V}[${I.schemaCode}]`);
        A.fail$data((0, US.or)(US._`typeof ${F} != "object"`, US._`${F} instanceof RegExp`, US._`typeof ${F}.compare != "function"`, K(F)))
      }

      function W() {
        let V = I.schema,
          F = X.formats[V];
        if (!F || F === !0) return;
        if (typeof F != "object" || F instanceof RegExp || typeof F.compare != "function") throw Error(`"${Z}": format "${V}" does not define "compare" function`);
        let H = Q.scopeValue("formats", {
          key: V,
          ref: F,
          code: J.code.formats ? US._`${J.code.formats}${(0,US.getProperty)(V)}` : void 0
        });
        A.fail$data(K(H))
      }

      function K(V) {
        return US._`${V}.compare(${B}, ${G}) ${RG1[Z].fail} 0`
      }
    },
    dependencies: ["format"]
  };
  var H35 = (A) => {
    return A.addKeyword(v92.formatLimitDefinition), A
  };
  v92.default = H35
})
// @from(Ln 258912, Col 4)
g92 = U((fxA, h92) => {
  Object.defineProperty(fxA, "__esModule", {
    value: !0
  });
  var uKA = y92(),
    z35 = k92(),
    JX0 = D8(),
    b92 = new JX0.Name("fullFormats"),
    $35 = new JX0.Name("fastFormats"),
    XX0 = (A, Q = {
      keywords: !0
    }) => {
      if (Array.isArray(Q)) return f92(A, Q, uKA.fullFormats, b92), A;
      let [B, G] = Q.mode === "fast" ? [uKA.fastFormats, $35] : [uKA.fullFormats, b92], Z = Q.formats || uKA.formatNames;
      if (f92(A, Z, B, G), Q.keywords)(0, z35.default)(A);
      return A
    };
  XX0.get = (A, Q = "full") => {
    let G = (Q === "fast" ? uKA.fastFormats : uKA.fullFormats)[A];
    if (!G) throw Error(`Unknown format "${A}"`);
    return G
  };

  function f92(A, Q, B, G) {
    var Z, Y;
    (Z = (Y = A.opts.code).formats) !== null && Z !== void 0 || (Y.formats = JX0._`require("ajv-formats/dist/formats").${G}`);
    for (let J of Q) A.addFormat(J, B[J])
  }
  h92.exports = fxA = XX0;
  Object.defineProperty(fxA, "__esModule", {
    value: !0
  });
  fxA.default = XX0
})
// @from(Ln 258947, Col 0)
function C35() {
  let A = new u92.Ajv({
    strict: !1,
    validateFormats: !0,
    validateSchema: !1,
    allErrors: !0
  });
  return m92.default(A), A
}
// @from(Ln 258956, Col 0)
class hxA {
  constructor(A) {
    this._ajv = A !== null && A !== void 0 ? A : C35()
  }
  getValidator(A) {
    var Q;
    let B = "$id" in A && typeof A.$id === "string" ? (Q = this._ajv.getSchema(A.$id)) !== null && Q !== void 0 ? Q : this._ajv.compile(A) : this._ajv.compile(A);
    return (G) => {
      if (B(G)) return {
        valid: !0,
        data: G,
        errorMessage: void 0
      };
      else return {
        valid: !1,
        data: void 0,
        errorMessage: this._ajv.errorsText(B.errors)
      }
    }
  }
}
// @from(Ln 258977, Col 4)
u92
// @from(Ln 258977, Col 9)
m92
// @from(Ln 258978, Col 4)
IX0 = w(() => {
  u92 = c(MG1(), 1), m92 = c(g92(), 1)
})
// @from(Ln 258981, Col 0)
class DX0 {
  constructor(A) {
    this._client = A
  }
  async * callToolStream(A, Q = iC, B) {
    var G;
    let Z = this._client,
      Y = {
        ...B,
        task: (G = B === null || B === void 0 ? void 0 : B.task) !== null && G !== void 0 ? G : Z.isToolTask(A.name) ? {} : void 0
      },
      J = Z.requestStream({
        method: "tools/call",
        params: A
      }, Q, Y),
      X = Z.getToolOutputValidator(A.name);
    for await (let I of J) {
      if (I.type === "result" && X) {
        let D = I.result;
        if (!D.structuredContent && !D.isError) {
          yield {
            type: "error",
            error: new P9(q4.InvalidRequest, `Tool ${A.name} has an output schema but did not return structured content`)
          };
          return
        }
        if (D.structuredContent) try {
          let W = X(D.structuredContent);
          if (!W.valid) {
            yield {
              type: "error",
              error: new P9(q4.InvalidParams, `Structured content does not match the tool's output schema: ${W.errorMessage}`)
            };
            return
          }
        } catch (W) {
          if (W instanceof P9) {
            yield {
              type: "error",
              error: W
            };
            return
          }
          yield {
            type: "error",
            error: new P9(q4.InvalidParams, `Failed to validate structured content: ${W instanceof Error?W.message:String(W)}`)
          };
          return
        }
      }
      yield I
    }
  }
  async getTask(A, Q) {
    return this._client.getTask({
      taskId: A
    }, Q)
  }
  async getTaskResult(A, Q, B) {
    return this._client.getTaskResult({
      taskId: A
    }, Q, B)
  }
  async listTasks(A, Q) {
    return this._client.listTasks(A ? {
      cursor: A
    } : void 0, Q)
  }
  async cancelTask(A, Q) {
    return this._client.cancelTask({
      taskId: A
    }, Q)
  }
  requestStream(A, Q, B) {
    return this._client.requestStream(A, Q, B)
  }
}
// @from(Ln 259058, Col 4)
d92 = w(() => {
  eK()
})
// @from(Ln 259062, Col 0)
function _G1(A, Q, B) {
  var G;
  if (!A) throw Error(`${B} does not support task creation (required for ${Q})`);
  switch (Q) {
    case "tools/call":
      if (!((G = A.tools) === null || G === void 0 ? void 0 : G.call)) throw Error(`${B} does not support task creation for tools/call (required for ${Q})`);
      break;
    default:
      break
  }
}
// @from(Ln 259074, Col 0)
function jG1(A, Q, B) {
  var G, Z;
  if (!A) throw Error(`${B} does not support task creation (required for ${Q})`);
  switch (Q) {
    case "sampling/createMessage":
      if (!((G = A.sampling) === null || G === void 0 ? void 0 : G.createMessage)) throw Error(`${B} does not support task creation for sampling/createMessage (required for ${Q})`);
      break;
    case "elicitation/create":
      if (!((Z = A.elicitation) === null || Z === void 0 ? void 0 : Z.create)) throw Error(`${B} does not support task creation for elicitation/create (required for ${Q})`);
      break;
    default:
      break
  }
}
// @from(Ln 259089, Col 0)
function TG1(A, Q) {
  if (!A || Q === null || typeof Q !== "object") return;
  if (A.type === "object" && A.properties && typeof A.properties === "object") {
    let B = Q,
      G = A.properties;
    for (let Z of Object.keys(G)) {
      let Y = G[Z];
      if (B[Z] === void 0 && Object.prototype.hasOwnProperty.call(Y, "default")) B[Z] = Y.default;
      if (B[Z] !== void 0) TG1(Y, B[Z])
    }
  }
  if (Array.isArray(A.anyOf))
    for (let B of A.anyOf) TG1(B, Q);
  if (Array.isArray(A.oneOf))
    for (let B of A.oneOf) TG1(B, Q)
}
// @from(Ln 259106, Col 0)
function U35(A) {
  if (!A) return {
    supportsFormMode: !1,
    supportsUrlMode: !1
  };
  let Q = A.form !== void 0,
    B = A.url !== void 0;
  return {
    supportsFormMode: Q || !Q && !B,
    supportsUrlMode: B
  }
}
// @from(Ln 259118, Col 4)
PG1