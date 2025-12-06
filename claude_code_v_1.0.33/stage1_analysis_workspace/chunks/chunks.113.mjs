
// @from(Start 10705479, End 10711072)
ni = z((GpG, xE2) => {
  xE2.exports = WK;
  var _OA = ai();
  ((WK.prototype = Object.create(_OA.prototype)).constructor = WK).className = "Field";
  var yE2 = UP(),
    e20 = Q0A(),
    tX = JK(),
    SOA, rO5 = /^required|optional|repeated$/;
  WK.fromJSON = function(Q, B) {
    var G = new WK(Q, B.id, B.type, B.rule, B.extend, B.options, B.comment);
    if (B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };

  function WK(A, Q, B, G, Z, I, Y) {
    if (tX.isObject(G)) Y = Z, I = G, G = Z = void 0;
    else if (tX.isObject(Z)) Y = I, I = Z, Z = void 0;
    if (_OA.call(this, A, I), !tX.isInteger(Q) || Q < 0) throw TypeError("id must be a non-negative integer");
    if (!tX.isString(B)) throw TypeError("type must be a string");
    if (G !== void 0 && !rO5.test(G = G.toString().toLowerCase())) throw TypeError("rule must be a string rule");
    if (Z !== void 0 && !tX.isString(Z)) throw TypeError("extend must be a string");
    if (G === "proto3_optional") G = "optional";
    this.rule = G && G !== "optional" ? G : void 0, this.type = B, this.id = Q, this.extend = Z || void 0, this.repeated = G === "repeated", this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = tX.Long ? e20.long[B] !== void 0 : !1, this.bytes = B === "bytes", this.resolvedType = null, this.extensionField = null, this.declaringField = null, this.comment = Y
  }
  Object.defineProperty(WK.prototype, "required", {
    get: function() {
      return this._features.field_presence === "LEGACY_REQUIRED"
    }
  });
  Object.defineProperty(WK.prototype, "optional", {
    get: function() {
      return !this.required
    }
  });
  Object.defineProperty(WK.prototype, "delimited", {
    get: function() {
      return this.resolvedType instanceof SOA && this._features.message_encoding === "DELIMITED"
    }
  });
  Object.defineProperty(WK.prototype, "packed", {
    get: function() {
      return this._features.repeated_field_encoding === "PACKED"
    }
  });
  Object.defineProperty(WK.prototype, "hasPresence", {
    get: function() {
      if (this.repeated || this.map) return !1;
      return this.partOf || this.declaringField || this.extensionField || this._features.field_presence !== "IMPLICIT"
    }
  });
  WK.prototype.setOption = function(Q, B, G) {
    return _OA.prototype.setOption.call(this, Q, B, G)
  };
  WK.prototype.toJSON = function(Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return tX.toObject(["edition", this._editionToJSON(), "rule", this.rule !== "optional" && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", B ? this.comment : void 0])
  };
  WK.prototype.resolve = function() {
    if (this.resolved) return this;
    if ((this.typeDefault = e20.defaults[this.type]) === void 0)
      if (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof SOA) this.typeDefault = null;
      else this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
    else if (this.options && this.options.proto3_optional) this.typeDefault = null;
    if (this.options && this.options.default != null) {
      if (this.typeDefault = this.options.default, this.resolvedType instanceof yE2 && typeof this.typeDefault === "string") this.typeDefault = this.resolvedType.values[this.typeDefault]
    }
    if (this.options) {
      if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof yE2)) delete this.options.packed;
      if (!Object.keys(this.options).length) this.options = void 0
    }
    if (this.long) {
      if (this.typeDefault = tX.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u"), Object.freeze) Object.freeze(this.typeDefault)
    } else if (this.bytes && typeof this.typeDefault === "string") {
      var Q;
      if (tX.base64.test(this.typeDefault)) tX.base64.decode(this.typeDefault, Q = tX.newBuffer(tX.base64.length(this.typeDefault)), 0);
      else tX.utf8.write(this.typeDefault, Q = tX.newBuffer(tX.utf8.length(this.typeDefault)), 0);
      this.typeDefault = Q
    }
    if (this.map) this.defaultValue = tX.emptyObject;
    else if (this.repeated) this.defaultValue = tX.emptyArray;
    else this.defaultValue = this.typeDefault;
    if (this.parent instanceof SOA) this.parent.ctor.prototype[this.name] = this.defaultValue;
    return _OA.prototype.resolve.call(this)
  };
  WK.prototype._inferLegacyProtoFeatures = function(Q) {
    if (Q !== "proto2" && Q !== "proto3") return {};
    var B = {};
    if (this.rule === "required") B.field_presence = "LEGACY_REQUIRED";
    if (this.parent && e20.defaults[this.type] === void 0) {
      var G = this.parent.get(this.type.split(".").pop());
      if (G && G instanceof SOA && G.group) B.message_encoding = "DELIMITED"
    }
    if (this.getOption("packed") === !0) B.repeated_field_encoding = "PACKED";
    else if (this.getOption("packed") === !1) B.repeated_field_encoding = "EXPANDED";
    return B
  };
  WK.prototype._resolveFeatures = function(Q) {
    return _OA.prototype._resolveFeatures.call(this, this._edition || Q)
  };
  WK.d = function(Q, B, G, Z) {
    if (typeof B === "function") B = tX.decorateType(B).name;
    else if (B && typeof B === "object") B = tX.decorateEnum(B).name;
    return function(Y, J) {
      tX.decorateType(Y.constructor).add(new WK(J, Q, B, G, {
        default: Z
      }))
    }
  };
  WK._configure = function(Q) {
    SOA = Q
  }
})
// @from(Start 10711078, End 10713690)
A0A = z((ZpG, fE2) => {
  fE2.exports = Lq;
  var Q81 = ai();
  ((Lq.prototype = Object.create(Q81.prototype)).constructor = Lq).className = "OneOf";
  var vE2 = ni(),
    A81 = JK();

  function Lq(A, Q, B, G) {
    if (!Array.isArray(Q)) B = Q, Q = void 0;
    if (Q81.call(this, A, B), !(Q === void 0 || Array.isArray(Q))) throw TypeError("fieldNames must be an Array");
    this.oneof = Q || [], this.fieldsArray = [], this.comment = G
  }
  Lq.fromJSON = function(Q, B) {
    return new Lq(Q, B.oneof, B.options, B.comment)
  };
  Lq.prototype.toJSON = function(Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return A81.toObject(["options", this.options, "oneof", this.oneof, "comment", B ? this.comment : void 0])
  };

  function bE2(A) {
    if (A.parent) {
      for (var Q = 0; Q < A.fieldsArray.length; ++Q)
        if (!A.fieldsArray[Q].parent) A.parent.add(A.fieldsArray[Q])
    }
  }
  Lq.prototype.add = function(Q) {
    if (!(Q instanceof vE2)) throw TypeError("field must be a Field");
    if (Q.parent && Q.parent !== this.parent) Q.parent.remove(Q);
    return this.oneof.push(Q.name), this.fieldsArray.push(Q), Q.partOf = this, bE2(this), this
  };
  Lq.prototype.remove = function(Q) {
    if (!(Q instanceof vE2)) throw TypeError("field must be a Field");
    var B = this.fieldsArray.indexOf(Q);
    if (B < 0) throw Error(Q + " is not a member of " + this);
    if (this.fieldsArray.splice(B, 1), B = this.oneof.indexOf(Q.name), B > -1) this.oneof.splice(B, 1);
    return Q.partOf = null, this
  };
  Lq.prototype.onAdd = function(Q) {
    Q81.prototype.onAdd.call(this, Q);
    var B = this;
    for (var G = 0; G < this.oneof.length; ++G) {
      var Z = Q.get(this.oneof[G]);
      if (Z && !Z.partOf) Z.partOf = B, B.fieldsArray.push(Z)
    }
    bE2(this)
  };
  Lq.prototype.onRemove = function(Q) {
    for (var B = 0, G; B < this.fieldsArray.length; ++B)
      if ((G = this.fieldsArray[B]).parent) G.parent.remove(G);
    Q81.prototype.onRemove.call(this, Q)
  };
  Object.defineProperty(Lq.prototype, "isProto3Optional", {
    get: function() {
      if (this.fieldsArray == null || this.fieldsArray.length !== 1) return !1;
      var A = this.fieldsArray[0];
      return A.options != null && A.options.proto3_optional === !0
    }
  });
  Lq.d = function() {
    var Q = Array(arguments.length),
      B = 0;
    while (B < arguments.length) Q[B] = arguments[B++];
    return function(Z, I) {
      A81.decorateType(Z.constructor).add(new Lq(I, Q)), Object.defineProperty(Z, I, {
        get: A81.oneOfGetter(Q),
        set: A81.oneOfSetter(Q)
      })
    }
  }
})
// @from(Start 10713696, End 10718613)
ai = z((IpG, hE2) => {
  hE2.exports = mD;
  mD.className = "ReflectionObject";
  var oO5 = A0A(),
    kOA = JK(),
    B81, tO5 = {
      enum_type: "OPEN",
      field_presence: "EXPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY"
    },
    eO5 = {
      enum_type: "CLOSED",
      field_presence: "EXPLICIT",
      json_format: "LEGACY_BEST_EFFORT",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "EXPANDED",
      utf8_validation: "NONE"
    },
    AR5 = {
      enum_type: "OPEN",
      field_presence: "IMPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY"
    };

  function mD(A, Q) {
    if (!kOA.isString(A)) throw TypeError("name must be a string");
    if (Q && !kOA.isObject(Q)) throw TypeError("options must be an object");
    this.options = Q, this.parsedOptions = null, this.name = A, this._edition = null, this._defaultEdition = "proto2", this._features = {}, this._featuresResolved = !1, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
  }
  Object.defineProperties(mD.prototype, {
    root: {
      get: function() {
        var A = this;
        while (A.parent !== null) A = A.parent;
        return A
      }
    },
    fullName: {
      get: function() {
        var A = [this.name],
          Q = this.parent;
        while (Q) A.unshift(Q.name), Q = Q.parent;
        return A.join(".")
      }
    }
  });
  mD.prototype.toJSON = function() {
    throw Error()
  };
  mD.prototype.onAdd = function(Q) {
    if (this.parent && this.parent !== Q) this.parent.remove(this);
    this.parent = Q, this.resolved = !1;
    var B = Q.root;
    if (B instanceof B81) B._handleAdd(this)
  };
  mD.prototype.onRemove = function(Q) {
    var B = Q.root;
    if (B instanceof B81) B._handleRemove(this);
    this.parent = null, this.resolved = !1
  };
  mD.prototype.resolve = function() {
    if (this.resolved) return this;
    if (this.root instanceof B81) this.resolved = !0;
    return this
  };
  mD.prototype._resolveFeaturesRecursive = function(Q) {
    return this._resolveFeatures(this._edition || Q)
  };
  mD.prototype._resolveFeatures = function(Q) {
    if (this._featuresResolved) return;
    var B = {};
    if (!Q) throw Error("Unknown edition for " + this.fullName);
    var G = Object.assign(this.options ? Object.assign({}, this.options.features) : {}, this._inferLegacyProtoFeatures(Q));
    if (this._edition) {
      if (Q === "proto2") B = Object.assign({}, eO5);
      else if (Q === "proto3") B = Object.assign({}, AR5);
      else if (Q === "2023") B = Object.assign({}, tO5);
      else throw Error("Unknown edition: " + Q);
      this._features = Object.assign(B, G || {}), this._featuresResolved = !0;
      return
    }
    if (this.partOf instanceof oO5) {
      var Z = Object.assign({}, this.partOf._features);
      this._features = Object.assign(Z, G || {})
    } else if (this.declaringField);
    else if (this.parent) {
      var I = Object.assign({}, this.parent._features);
      this._features = Object.assign(I, G || {})
    } else throw Error("Unable to find a parent for " + this.fullName);
    if (this.extensionField) this.extensionField._features = this._features;
    this._featuresResolved = !0
  };
  mD.prototype._inferLegacyProtoFeatures = function() {
    return {}
  };
  mD.prototype.getOption = function(Q) {
    if (this.options) return this.options[Q];
    return
  };
  mD.prototype.setOption = function(Q, B, G) {
    if (!this.options) this.options = {};
    if (/^features\./.test(Q)) kOA.setProperty(this.options, Q, B, G);
    else if (!G || this.options[Q] === void 0) {
      if (this.getOption(Q) !== B) this.resolved = !1;
      this.options[Q] = B
    }
    return this
  };
  mD.prototype.setParsedOption = function(Q, B, G) {
    if (!this.parsedOptions) this.parsedOptions = [];
    var Z = this.parsedOptions;
    if (G) {
      var I = Z.find(function(W) {
        return Object.prototype.hasOwnProperty.call(W, Q)
      });
      if (I) {
        var Y = I[Q];
        kOA.setProperty(Y, G, B)
      } else I = {}, I[Q] = kOA.setProperty({}, G, B), Z.push(I)
    } else {
      var J = {};
      J[Q] = B, Z.push(J)
    }
    return this
  };
  mD.prototype.setOptions = function(Q, B) {
    if (Q)
      for (var G = Object.keys(Q), Z = 0; Z < G.length; ++Z) this.setOption(G[Z], Q[G[Z]], B);
    return this
  };
  mD.prototype.toString = function() {
    var Q = this.constructor.className,
      B = this.fullName;
    if (B.length) return Q + " " + B;
    return Q
  };
  mD.prototype._editionToJSON = function() {
    if (!this._edition || this._edition === "proto3") return;
    return this._edition
  };
  mD._configure = function(A) {
    B81 = A
  }
})
// @from(Start 10718619, End 10721673)
UP = z((YpG, uE2) => {
  uE2.exports = $P;
  var A90 = ai();
  (($P.prototype = Object.create(A90.prototype)).constructor = $P).className = "Enum";
  var gE2 = WJA(),
    G81 = JK();

  function $P(A, Q, B, G, Z, I) {
    if (A90.call(this, A, B), Q && typeof Q !== "object") throw TypeError("values must be an object");
    if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = G, this.comments = Z || {}, this.valuesOptions = I, this._valuesFeatures = {}, this.reserved = void 0, Q) {
      for (var Y = Object.keys(Q), J = 0; J < Y.length; ++J)
        if (typeof Q[Y[J]] === "number") this.valuesById[this.values[Y[J]] = Q[Y[J]]] = Y[J]
    }
  }
  $P.prototype._resolveFeatures = function(Q) {
    return Q = this._edition || Q, A90.prototype._resolveFeatures.call(this, Q), Object.keys(this.values).forEach((B) => {
      var G = Object.assign({}, this._features);
      this._valuesFeatures[B] = Object.assign(G, this.valuesOptions && this.valuesOptions[B] && this.valuesOptions[B].features)
    }), this
  };
  $P.fromJSON = function(Q, B) {
    var G = new $P(Q, B.values, B.options, B.comment, B.comments);
    if (G.reserved = B.reserved, B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };
  $P.prototype.toJSON = function(Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return G81.toObject(["edition", this._editionToJSON(), "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", B ? this.comment : void 0, "comments", B ? this.comments : void 0])
  };
  $P.prototype.add = function(Q, B, G, Z) {
    if (!G81.isString(Q)) throw TypeError("name must be a string");
    if (!G81.isInteger(B)) throw TypeError("id must be an integer");
    if (this.values[Q] !== void 0) throw Error("duplicate name '" + Q + "' in " + this);
    if (this.isReservedId(B)) throw Error("id " + B + " is reserved in " + this);
    if (this.isReservedName(Q)) throw Error("name '" + Q + "' is reserved in " + this);
    if (this.valuesById[B] !== void 0) {
      if (!(this.options && this.options.allow_alias)) throw Error("duplicate id " + B + " in " + this);
      this.values[Q] = B
    } else this.valuesById[this.values[Q] = B] = Q;
    if (Z) {
      if (this.valuesOptions === void 0) this.valuesOptions = {};
      this.valuesOptions[Q] = Z || null
    }
    return this.comments[Q] = G || null, this
  };
  $P.prototype.remove = function(Q) {
    if (!G81.isString(Q)) throw TypeError("name must be a string");
    var B = this.values[Q];
    if (B == null) throw Error("name '" + Q + "' does not exist in " + this);
    if (delete this.valuesById[B], delete this.values[Q], delete this.comments[Q], this.valuesOptions) delete this.valuesOptions[Q];
    return this
  };
  $P.prototype.isReservedId = function(Q) {
    return gE2.isReservedId(this.reserved, Q)
  };
  $P.prototype.isReservedName = function(Q) {
    return gE2.isReservedName(this.reserved, Q)
  }
})
// @from(Start 10721679, End 10723539)
n20 = z((JpG, dE2) => {
  dE2.exports = BR5;
  var QR5 = UP(),
    Q90 = Q0A(),
    B90 = JK();

  function mE2(A, Q, B, G) {
    return Q.delimited ? A("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", B, G, (Q.id << 3 | 3) >>> 0, (Q.id << 3 | 4) >>> 0) : A("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", B, G, (Q.id << 3 | 2) >>> 0)
  }

  function BR5(A) {
    var Q = B90.codegen(["m", "w"], A.name + "$encode")("if(!w)")("w=Writer.create()"),
      B, G, Z = A.fieldsArray.slice().sort(B90.compareFieldsById);
    for (var B = 0; B < Z.length; ++B) {
      var I = Z[B].resolve(),
        Y = A._fieldsArray.indexOf(I),
        J = I.resolvedType instanceof QR5 ? "int32" : I.type,
        W = Q90.basic[J];
      if (G = "m" + B90.safeProp(I.name), I.map) {
        if (Q("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", G, I.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", G)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (I.id << 3 | 2) >>> 0, 8 | Q90.mapKey[I.keyType], I.keyType), W === void 0) Q("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", Y, G);
        else Q(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | W, J, G);
        Q("}")("}")
      } else if (I.repeated) {
        if (Q("if(%s!=null&&%s.length){", G, G), I.packed && Q90.packed[J] !== void 0) Q("w.uint32(%i).fork()", (I.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", G)("w.%s(%s[i])", J, G)("w.ldelim()");
        else if (Q("for(var i=0;i<%s.length;++i)", G), W === void 0) mE2(Q, I, Y, G + "[i]");
        else Q("w.uint32(%i).%s(%s[i])", (I.id << 3 | W) >>> 0, J, G);
        Q("}")
      } else {
        if (I.optional) Q("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", G, I.name);
        if (W === void 0) mE2(Q, I, Y, G);
        else Q("w.uint32(%i).%s(%s)", (I.id << 3 | W) >>> 0, J, G)
      }
    }
    return Q("return w")
  }
})
// @from(Start 10723545, End 10724442)
pE2 = z((WpG, cE2) => {
  var C3 = cE2.exports = OB0();
  C3.build = "light";

  function GR5(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = new C3.Root;
    else if (!Q) Q = new C3.Root;
    return Q.load(A, B)
  }
  C3.load = GR5;

  function ZR5(A, Q) {
    if (!Q) Q = new C3.Root;
    return Q.loadSync(A)
  }
  C3.loadSync = ZR5;
  C3.encoder = n20();
  C3.decoder = b20();
  C3.verifier = g20();
  C3.converter = d20();
  C3.ReflectionObject = ai();
  C3.Namespace = WJA();
  C3.Root = e41();
  C3.Enum = UP();
  C3.Type = s41();
  C3.Field = ni();
  C3.OneOf = A0A();
  C3.MapField = c41();
  C3.Service = l41();
  C3.Method = p41();
  C3.Message = i41();
  C3.wrappers = c20();
  C3.types = Q0A();
  C3.util = JK();
  C3.ReflectionObject._configure(C3.Root);
  C3.Namespace._configure(C3.Type, C3.Service, C3.Enum);
  C3.Root._configure(C3.Type);
  C3.Field._configure(C3.Type)
})
// @from(Start 10724448, End 10728825)
Z90 = z((XpG, nE2) => {
  nE2.exports = iE2;
  var G90 = /[\s{}=;:[\],'"()<>]/g,
    IR5 = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
    YR5 = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
    JR5 = /^ *[*/]+ */,
    WR5 = /^\s*\*?\/*/,
    XR5 = /\n/g,
    VR5 = /\s/,
    FR5 = /\\(.?)/g,
    KR5 = {
      "0": "\x00",
      r: "\r",
      n: `
`,
      t: "\t"
    };

  function lE2(A) {
    return A.replace(FR5, function(Q, B) {
      switch (B) {
        case "\\":
        case "":
          return B;
        default:
          return KR5[B] || ""
      }
    })
  }
  iE2.unescape = lE2;

  function iE2(A, Q) {
    A = A.toString();
    var B = 0,
      G = A.length,
      Z = 1,
      I = 0,
      Y = {},
      J = [],
      W = null;

    function X(N) {
      return Error("illegal " + N + " (line " + Z + ")")
    }

    function V() {
      var N = W === "'" ? YR5 : IR5;
      N.lastIndex = B - 1;
      var R = N.exec(A);
      if (!R) throw X("string");
      return B = N.lastIndex, E(W), W = null, lE2(R[1])
    }

    function F(N) {
      return A.charAt(N)
    }

    function K(N, R, T) {
      var y = {
          type: A.charAt(N++),
          lineEmpty: !1,
          leading: T
        },
        v;
      if (Q) v = 2;
      else v = 3;
      var x = N - v,
        p;
      do
        if (--x < 0 || (p = A.charAt(x)) === `
`) {
          y.lineEmpty = !0;
          break
        } while (p === " " || p === "\t");
      var u = A.substring(N, R).split(XR5);
      for (var e = 0; e < u.length; ++e) u[e] = u[e].replace(Q ? WR5 : JR5, "").trim();
      y.text = u.join(`
`).trim(), Y[Z] = y, I = Z
    }

    function D(N) {
      var R = H(N),
        T = A.substring(N, R),
        y = /^\s*\/\//.test(T);
      return y
    }

    function H(N) {
      var R = N;
      while (R < G && F(R) !== `
`) R++;
      return R
    }

    function C() {
      if (J.length > 0) return J.shift();
      if (W) return V();
      var N, R, T, y, v, x = B === 0;
      do {
        if (B === G) return null;
        N = !1;
        while (VR5.test(T = F(B))) {
          if (T === `
`) x = !0, ++Z;
          if (++B === G) return null
        }
        if (F(B) === "/") {
          if (++B === G) throw X("comment");
          if (F(B) === "/")
            if (!Q) {
              v = F(y = B + 1) === "/";
              while (F(++B) !== `
`)
                if (B === G) return null;
              if (++B, v) K(y, B - 1, x), x = !0;
              ++Z, N = !0
            } else {
              if (y = B, v = !1, D(B - 1)) {
                v = !0;
                do {
                  if (B = H(B), B === G) break;
                  if (B++, !x) break
                } while (D(B))
              } else B = Math.min(G, H(B) + 1);
              if (v) K(y, B, x), x = !0;
              Z++, N = !0
            }
          else if ((T = F(B)) === "*") {
            y = B + 1, v = Q || F(y) === "*";
            do {
              if (T === `
`) ++Z;
              if (++B === G) throw X("comment");
              R = T, T = F(B)
            } while (R !== "*" || T !== "/");
            if (++B, v) K(y, B - 2, x), x = !0;
            N = !0
          } else return "/"
        }
      } while (N);
      var p = B;
      G90.lastIndex = 0;
      var u = G90.test(F(p++));
      if (!u)
        while (p < G && !G90.test(F(p))) ++p;
      var e = A.substring(B, B = p);
      if (e === '"' || e === "'") W = e;
      return e
    }

    function E(N) {
      J.push(N)
    }

    function U() {
      if (!J.length) {
        var N = C();
        if (N === null) return null;
        E(N)
      }
      return J[0]
    }

    function q(N, R) {
      var T = U(),
        y = T === N;
      if (y) return C(), !0;
      if (!R) throw X("token '" + T + "', '" + N + "' expected");
      return !1
    }

    function w(N) {
      var R = null,
        T;
      if (N === void 0) {
        if (T = Y[Z - 1], delete Y[Z - 1], T && (Q || T.type === "*" || T.lineEmpty)) R = T.leading ? T.text : null
      } else {
        if (I < N) U();
        if (T = Y[N], delete Y[N], T && !T.lineEmpty && (Q || T.type === "/")) R = T.leading ? null : T.text
      }
      return R
    }
    return Object.defineProperty({
      next: C,
      peek: U,
      push: E,
      skip: q,
      cmnt: w
    }, "line", {
      get: function() {
        return Z
      }
    })
  }
})
// @from(Start 10728831, End 10743022)
eE2 = z((VpG, tE2) => {
  tE2.exports = yh;
  yh.filename = null;
  yh.defaults = {
    keepCase: !1
  };
  var DR5 = Z90(),
    aE2 = e41(),
    sE2 = s41(),
    rE2 = ni(),
    HR5 = c41(),
    oE2 = A0A(),
    CR5 = UP(),
    ER5 = l41(),
    zR5 = p41(),
    UR5 = ai(),
    $R5 = Q0A(),
    I90 = JK(),
    wR5 = /^[1-9][0-9]*$/,
    qR5 = /^-?[1-9][0-9]*$/,
    NR5 = /^0[x][0-9a-fA-F]+$/,
    LR5 = /^-?0[x][0-9a-fA-F]+$/,
    MR5 = /^0[0-7]+$/,
    OR5 = /^-?0[0-7]+$/,
    RR5 = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
    By = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
    Gy = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;

  function yh(A, Q, B) {
    if (!(Q instanceof aE2)) B = Q, Q = new aE2;
    if (!B) B = yh.defaults;
    var G = B.preferTrailingComment || !1,
      Z = DR5(A, B.alternateCommentMode || !1),
      I = Z.next,
      Y = Z.push,
      J = Z.peek,
      W = Z.skip,
      X = Z.cmnt,
      V = !0,
      F, K, D, H = "proto2",
      C = Q,
      E = [],
      U = {},
      q = B.keepCase ? function(DA) {
        return DA
      } : I90.camelCase;

    function w() {
      E.forEach((DA) => {
        DA._edition = H, Object.keys(U).forEach(($A) => {
          if (DA.getOption($A) !== void 0) return;
          DA.setOption($A, U[$A], !0)
        })
      })
    }

    function N(DA, $A, TA) {
      var rA = yh.filename;
      if (!TA) yh.filename = null;
      return Error("illegal " + ($A || "token") + " '" + DA + "' (" + (rA ? rA + ", " : "") + "line " + Z.line + ")")
    }

    function R() {
      var DA = [],
        $A;
      do {
        if (($A = I()) !== '"' && $A !== "'") throw N($A);
        DA.push(I()), W($A), $A = J()
      } while ($A === '"' || $A === "'");
      return DA.join("")
    }

    function T(DA) {
      var $A = I();
      switch ($A) {
        case "'":
        case '"':
          return Y($A), R();
        case "true":
        case "TRUE":
          return !0;
        case "false":
        case "FALSE":
          return !1
      }
      try {
        return v($A, !0)
      } catch (TA) {
        if (DA && Gy.test($A)) return $A;
        throw N($A, "value")
      }
    }

    function y(DA, $A) {
      var TA, rA;
      do
        if ($A && ((TA = J()) === '"' || TA === "'")) {
          var iA = R();
          if (DA.push(iA), H >= 2023) throw N(iA, "id")
        } else try {
          DA.push([rA = x(I()), W("to", !0) ? x(I()) : rA])
        } catch (w1) {
          if ($A && Gy.test(TA) && H >= 2023) DA.push(TA);
          else throw w1
        }
      while (W(",", !0));
      var J1 = {
        options: void 0
      };
      J1.setOption = function(w1, jA) {
        if (this.options === void 0) this.options = {};
        this.options[w1] = jA
      }, m(J1, function(jA) {
        if (jA === "option") wA(J1, jA), W(";");
        else throw N(jA)
      }, function() {
        oA(J1)
      })
    }

    function v(DA, $A) {
      var TA = 1;
      if (DA.charAt(0) === "-") TA = -1, DA = DA.substring(1);
      switch (DA) {
        case "inf":
        case "INF":
        case "Inf":
          return TA * (1 / 0);
        case "nan":
        case "NAN":
        case "Nan":
        case "NaN":
          return NaN;
        case "0":
          return 0
      }
      if (wR5.test(DA)) return TA * parseInt(DA, 10);
      if (NR5.test(DA)) return TA * parseInt(DA, 16);
      if (MR5.test(DA)) return TA * parseInt(DA, 8);
      if (RR5.test(DA)) return TA * parseFloat(DA);
      throw N(DA, "number", $A)
    }

    function x(DA, $A) {
      switch (DA) {
        case "max":
        case "MAX":
        case "Max":
          return 536870911;
        case "0":
          return 0
      }
      if (!$A && DA.charAt(0) === "-") throw N(DA, "id");
      if (qR5.test(DA)) return parseInt(DA, 10);
      if (LR5.test(DA)) return parseInt(DA, 16);
      if (OR5.test(DA)) return parseInt(DA, 8);
      throw N(DA, "id")
    }

    function p() {
      if (F !== void 0) throw N("package");
      if (F = I(), !Gy.test(F)) throw N(F, "name");
      C = C.define(F), W(";")
    }

    function u() {
      var DA = J(),
        $A;
      switch (DA) {
        case "weak":
          $A = D || (D = []), I();
          break;
        case "public":
          I();
        default:
          $A = K || (K = []);
          break
      }
      DA = R(), W(";"), $A.push(DA)
    }

    function e() {
      if (W("="), H = R(), H < 2023) throw N(H, "syntax");
      W(";")
    }

    function l() {
      if (W("="), H = R(), !["2023"].includes(H)) throw N(H, "edition");
      W(";")
    }

    function k(DA, $A) {
      switch ($A) {
        case "option":
          return wA(DA, $A), W(";"), !0;
        case "message":
          return o(DA, $A), !0;
        case "enum":
          return OA(DA, $A), !0;
        case "service":
          return X1(DA, $A), !0;
        case "extend":
          return EA(DA, $A), !0
      }
      return !1
    }

    function m(DA, $A, TA) {
      var rA = Z.line;
      if (DA) {
        if (typeof DA.comment !== "string") DA.comment = X();
        DA.filename = yh.filename
      }
      if (W("{", !0)) {
        var iA;
        while ((iA = I()) !== "}") $A(iA);
        W(";", !0)
      } else {
        if (TA) TA();
        if (W(";"), DA && (typeof DA.comment !== "string" || G)) DA.comment = X(rA) || DA.comment
      }
    }

    function o(DA, $A) {
      if (!By.test($A = I())) throw N($A, "type name");
      var TA = new sE2($A);
      if (m(TA, function(iA) {
          if (k(TA, iA)) return;
          switch (iA) {
            case "map":
              zA(TA, iA);
              break;
            case "required":
              if (H !== "proto2") throw N(iA);
            case "repeated":
              IA(TA, iA);
              break;
            case "optional":
              if (H === "proto3") IA(TA, "proto3_optional");
              else if (H !== "proto2") throw N(iA);
              else IA(TA, "optional");
              break;
            case "oneof":
              NA(TA, iA);
              break;
            case "extensions":
              y(TA.extensions || (TA.extensions = []));
              break;
            case "reserved":
              y(TA.reserved || (TA.reserved = []), !0);
              break;
            default:
              if (H === "proto2" || !Gy.test(iA)) throw N(iA);
              Y(iA), IA(TA, "optional");
              break
          }
        }), DA.add(TA), DA === C) E.push(TA)
    }

    function IA(DA, $A, TA) {
      var rA = I();
      if (rA === "group") {
        FA(DA, $A);
        return
      }
      while (rA.endsWith(".") || J().startsWith(".")) rA += I();
      if (!Gy.test(rA)) throw N(rA, "type");
      var iA = I();
      if (!By.test(iA)) throw N(iA, "name");
      iA = q(iA), W("=");
      var J1 = new rE2(iA, x(I()), rA, $A, TA);
      if (m(J1, function(eA) {
          if (eA === "option") wA(J1, eA), W(";");
          else throw N(eA)
        }, function() {
          oA(J1)
        }), $A === "proto3_optional") {
        var w1 = new oE2("_" + iA);
        J1.setOption("proto3_optional", !0), w1.add(J1), DA.add(w1)
      } else DA.add(J1);
      if (DA === C) E.push(J1)
    }

    function FA(DA, $A) {
      if (H >= 2023) throw N("group");
      var TA = I();
      if (!By.test(TA)) throw N(TA, "name");
      var rA = I90.lcFirst(TA);
      if (TA === rA) TA = I90.ucFirst(TA);
      W("=");
      var iA = x(I()),
        J1 = new sE2(TA);
      J1.group = !0;
      var w1 = new rE2(rA, iA, TA, $A);
      w1.filename = yh.filename, m(J1, function(eA) {
        switch (eA) {
          case "option":
            wA(J1, eA), W(";");
            break;
          case "required":
          case "repeated":
            IA(J1, eA);
            break;
          case "optional":
            if (H === "proto3") IA(J1, "proto3_optional");
            else IA(J1, "optional");
            break;
          case "message":
            o(J1, eA);
            break;
          case "enum":
            OA(J1, eA);
            break;
          case "reserved":
            y(J1.reserved || (J1.reserved = []), !0);
            break;
          default:
            throw N(eA)
        }
      }), DA.add(J1).add(w1)
    }

    function zA(DA) {
      W("<");
      var $A = I();
      if ($R5.mapKey[$A] === void 0) throw N($A, "type");
      W(",");
      var TA = I();
      if (!Gy.test(TA)) throw N(TA, "type");
      W(">");
      var rA = I();
      if (!By.test(rA)) throw N(rA, "name");
      W("=");
      var iA = new HR5(q(rA), x(I()), $A, TA);
      m(iA, function(w1) {
        if (w1 === "option") wA(iA, w1), W(";");
        else throw N(w1)
      }, function() {
        oA(iA)
      }), DA.add(iA)
    }

    function NA(DA, $A) {
      if (!By.test($A = I())) throw N($A, "name");
      var TA = new oE2(q($A));
      m(TA, function(iA) {
        if (iA === "option") wA(TA, iA), W(";");
        else Y(iA), IA(TA, "optional")
      }), DA.add(TA)
    }

    function OA(DA, $A) {
      if (!By.test($A = I())) throw N($A, "name");
      var TA = new CR5($A);
      if (m(TA, function(iA) {
          switch (iA) {
            case "option":
              wA(TA, iA), W(";");
              break;
            case "reserved":
              if (y(TA.reserved || (TA.reserved = []), !0), TA.reserved === void 0) TA.reserved = [];
              break;
            default:
              mA(TA, iA)
          }
        }), DA.add(TA), DA === C) E.push(TA)
    }

    function mA(DA, $A) {
      if (!By.test($A)) throw N($A, "name");
      W("=");
      var TA = x(I(), !0),
        rA = {
          options: void 0
        };
      rA.getOption = function(iA) {
        return this.options[iA]
      }, rA.setOption = function(iA, J1) {
        UR5.prototype.setOption.call(rA, iA, J1)
      }, rA.setParsedOption = function() {
        return
      }, m(rA, function(J1) {
        if (J1 === "option") wA(rA, J1), W(";");
        else throw N(J1)
      }, function() {
        oA(rA)
      }), DA.add($A, TA, rA.comment, rA.parsedOptions || rA.options)
    }

    function wA(DA, $A) {
      var TA, rA, iA = !0;
      if ($A === "option") $A = I();
      while ($A !== "=") {
        if ($A === "(") {
          var J1 = I();
          W(")"), $A = "(" + J1 + ")"
        }
        if (iA) {
          if (iA = !1, $A.includes(".") && !$A.includes("(")) {
            var w1 = $A.split(".");
            TA = w1[0] + ".", $A = w1[1];
            continue
          }
          TA = $A
        } else rA = rA ? rA += $A : $A;
        $A = I()
      }
      var jA = rA ? TA.concat(rA) : TA,
        eA = qA(DA, jA);
      rA = rA && rA[0] === "." ? rA.slice(1) : rA, TA = TA && TA[TA.length - 1] === "." ? TA.slice(0, -1) : TA, yA(DA, TA, eA, rA)
    }

    function qA(DA, $A) {
      if (W("{", !0)) {
        var TA = {};
        while (!W("}", !0)) {
          if (!By.test(MA = I())) throw N(MA, "name");
          if (MA === null) throw N(MA, "end of input");
          var rA, iA = MA;
          if (W(":", !0), J() === "{") rA = qA(DA, $A + "." + MA);
          else if (J() === "[") {
            rA = [];
            var J1;
            if (W("[", !0)) {
              do J1 = T(!0), rA.push(J1); while (W(",", !0));
              if (W("]"), typeof J1 < "u") KA(DA, $A + "." + MA, J1)
            }
          } else rA = T(!0), KA(DA, $A + "." + MA, rA);
          var w1 = TA[iA];
          if (w1) rA = [].concat(w1).concat(rA);
          TA[iA] = rA, W(",", !0), W(";", !0)
        }
        return TA
      }
      var jA = T(!0);
      return KA(DA, $A, jA), jA
    }

    function KA(DA, $A, TA) {
      if (C === DA && /^features\./.test($A)) {
        U[$A] = TA;
        return
      }
      if (DA.setOption) DA.setOption($A, TA)
    }

    function yA(DA, $A, TA, rA) {
      if (DA.setParsedOption) DA.setParsedOption($A, TA, rA)
    }

    function oA(DA) {
      if (W("[", !0)) {
        do wA(DA, "option"); while (W(",", !0));
        W("]")
      }
      return DA
    }

    function X1(DA, $A) {
      if (!By.test($A = I())) throw N($A, "service name");
      var TA = new ER5($A);
      if (m(TA, function(iA) {
          if (k(TA, iA)) return;
          if (iA === "rpc") WA(TA, iA);
          else throw N(iA)
        }), DA.add(TA), DA === C) E.push(TA)
    }

    function WA(DA, $A) {
      var TA = X(),
        rA = $A;
      if (!By.test($A = I())) throw N($A, "name");
      var iA = $A,
        J1, w1, jA, eA;
      if (W("("), W("stream", !0)) w1 = !0;
      if (!Gy.test($A = I())) throw N($A);
      if (J1 = $A, W(")"), W("returns"), W("("), W("stream", !0)) eA = !0;
      if (!Gy.test($A = I())) throw N($A);
      jA = $A, W(")");
      var t1 = new zR5(iA, rA, J1, jA, w1, eA);
      t1.comment = TA, m(t1, function(F0) {
        if (F0 === "option") wA(t1, F0), W(";");
        else throw N(F0)
      }), DA.add(t1)
    }

    function EA(DA, $A) {
      if (!Gy.test($A = I())) throw N($A, "reference");
      var TA = $A;
      m(null, function(iA) {
        switch (iA) {
          case "required":
          case "repeated":
            IA(DA, iA, TA);
            break;
          case "optional":
            if (H === "proto3") IA(DA, "proto3_optional", TA);
            else IA(DA, "optional", TA);
            break;
          default:
            if (H === "proto2" || !Gy.test(iA)) throw N(iA);
            Y(iA), IA(DA, "optional", TA);
            break
        }
      })
    }
    var MA;
    while ((MA = I()) !== null) switch (MA) {
      case "package":
        if (!V) throw N(MA);
        p();
        break;
      case "import":
        if (!V) throw N(MA);
        u();
        break;
      case "syntax":
        if (!V) throw N(MA);
        e();
        break;
      case "edition":
        if (!V) throw N(MA);
        l();
        break;
      case "option":
        wA(C, MA), W(";", !0);
        break;
      default:
        if (k(C, MA)) {
          V = !1;
          continue
        }
        throw N(MA)
    }
    return w(), yh.filename = null, {
      package: F,
      imports: K,
      weakImports: D,
      root: Q
    }
  }
})
// @from(Start 10743028, End 10746226)
Bz2 = z((FpG, Qz2) => {
  Qz2.exports = wP;
  var TR5 = /\/|\./;

  function wP(A, Q) {
    if (!TR5.test(A)) A = "google/protobuf/" + A + ".proto", Q = {
      nested: {
        google: {
          nested: {
            protobuf: {
              nested: Q
            }
          }
        }
      }
    };
    wP[A] = Q
  }
  wP("any", {
    Any: {
      fields: {
        type_url: {
          type: "string",
          id: 1
        },
        value: {
          type: "bytes",
          id: 2
        }
      }
    }
  });
  var Az2;
  wP("duration", {
    Duration: Az2 = {
      fields: {
        seconds: {
          type: "int64",
          id: 1
        },
        nanos: {
          type: "int32",
          id: 2
        }
      }
    }
  });
  wP("timestamp", {
    Timestamp: Az2
  });
  wP("empty", {
    Empty: {
      fields: {}
    }
  });
  wP("struct", {
    Struct: {
      fields: {
        fields: {
          keyType: "string",
          type: "Value",
          id: 1
        }
      }
    },
    Value: {
      oneofs: {
        kind: {
          oneof: ["nullValue", "numberValue", "stringValue", "boolValue", "structValue", "listValue"]
        }
      },
      fields: {
        nullValue: {
          type: "NullValue",
          id: 1
        },
        numberValue: {
          type: "double",
          id: 2
        },
        stringValue: {
          type: "string",
          id: 3
        },
        boolValue: {
          type: "bool",
          id: 4
        },
        structValue: {
          type: "Struct",
          id: 5
        },
        listValue: {
          type: "ListValue",
          id: 6
        }
      }
    },
    NullValue: {
      values: {
        NULL_VALUE: 0
      }
    },
    ListValue: {
      fields: {
        values: {
          rule: "repeated",
          type: "Value",
          id: 1
        }
      }
    }
  });
  wP("wrappers", {
    DoubleValue: {
      fields: {
        value: {
          type: "double",
          id: 1
        }
      }
    },
    FloatValue: {
      fields: {
        value: {
          type: "float",
          id: 1
        }
      }
    },
    Int64Value: {
      fields: {
        value: {
          type: "int64",
          id: 1
        }
      }
    },
    UInt64Value: {
      fields: {
        value: {
          type: "uint64",
          id: 1
        }
      }
    },
    Int32Value: {
      fields: {
        value: {
          type: "int32",
          id: 1
        }
      }
    },
    UInt32Value: {
      fields: {
        value: {
          type: "uint32",
          id: 1
        }
      }
    },
    BoolValue: {
      fields: {
        value: {
          type: "bool",
          id: 1
        }
      }
    },
    StringValue: {
      fields: {
        value: {
          type: "string",
          id: 1
        }
      }
    },
    BytesValue: {
      fields: {
        value: {
          type: "bytes",
          id: 1
        }
      }
    }
  });
  wP("field_mask", {
    FieldMask: {
      fields: {
        paths: {
          rule: "repeated",
          type: "string",
          id: 1
        }
      }
    }
  });
  wP.get = function(Q) {
    return wP[Q] || null
  }
})
// @from(Start 10746232, End 10746426)
Z81 = z((KpG, Gz2) => {
  var ri = Gz2.exports = pE2();
  ri.build = "full";
  ri.tokenize = Z90();
  ri.parse = eE2();
  ri.common = Bz2();
  ri.Root._configure(ri.Type, ri.parse, ri.common)
})
// @from(Start 10746432, End 10787110)
Y90 = z((DpG, PR5) => {
  PR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            options: {
              go_package: "google.golang.org/protobuf/types/descriptorpb",
              java_package: "com.google.protobuf",
              java_outer_classname: "DescriptorProtos",
              csharp_namespace: "Google.Protobuf.Reflection",
              objc_class_prefix: "GPB",
              cc_enable_arenas: !0,
              optimize_for: "SPEED"
            },
            nested: {
              FileDescriptorSet: {
                edition: "proto2",
                fields: {
                  file: {
                    rule: "repeated",
                    type: "FileDescriptorProto",
                    id: 1
                  }
                },
                extensions: [
                  [536000000, 536000000]
                ]
              },
              Edition: {
                edition: "proto2",
                values: {
                  EDITION_UNKNOWN: 0,
                  EDITION_LEGACY: 900,
                  EDITION_PROTO2: 998,
                  EDITION_PROTO3: 999,
                  EDITION_2023: 1000,
                  EDITION_2024: 1001,
                  EDITION_1_TEST_ONLY: 1,
                  EDITION_2_TEST_ONLY: 2,
                  EDITION_99997_TEST_ONLY: 99997,
                  EDITION_99998_TEST_ONLY: 99998,
                  EDITION_99999_TEST_ONLY: 99999,
                  EDITION_MAX: 2147483647
                }
              },
              FileDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  package: {
                    type: "string",
                    id: 2
                  },
                  dependency: {
                    rule: "repeated",
                    type: "string",
                    id: 3
                  },
                  publicDependency: {
                    rule: "repeated",
                    type: "int32",
                    id: 10
                  },
                  weakDependency: {
                    rule: "repeated",
                    type: "int32",
                    id: 11
                  },
                  optionDependency: {
                    rule: "repeated",
                    type: "string",
                    id: 15
                  },
                  messageType: {
                    rule: "repeated",
                    type: "DescriptorProto",
                    id: 4
                  },
                  enumType: {
                    rule: "repeated",
                    type: "EnumDescriptorProto",
                    id: 5
                  },
                  service: {
                    rule: "repeated",
                    type: "ServiceDescriptorProto",
                    id: 6
                  },
                  extension: {
                    rule: "repeated",
                    type: "FieldDescriptorProto",
                    id: 7
                  },
                  options: {
                    type: "FileOptions",
                    id: 8
                  },
                  sourceCodeInfo: {
                    type: "SourceCodeInfo",
                    id: 9
                  },
                  syntax: {
                    type: "string",
                    id: 12
                  },
                  edition: {
                    type: "Edition",
                    id: 14
                  }
                }
              },
              DescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  field: {
                    rule: "repeated",
                    type: "FieldDescriptorProto",
                    id: 2
                  },
                  extension: {
                    rule: "repeated",
                    type: "FieldDescriptorProto",
                    id: 6
                  },
                  nestedType: {
                    rule: "repeated",
                    type: "DescriptorProto",
                    id: 3
                  },
                  enumType: {
                    rule: "repeated",
                    type: "EnumDescriptorProto",
                    id: 4
                  },
                  extensionRange: {
                    rule: "repeated",
                    type: "ExtensionRange",
                    id: 5
                  },
                  oneofDecl: {
                    rule: "repeated",
                    type: "OneofDescriptorProto",
                    id: 8
                  },
                  options: {
                    type: "MessageOptions",
                    id: 7
                  },
                  reservedRange: {
                    rule: "repeated",
                    type: "ReservedRange",
                    id: 9
                  },
                  reservedName: {
                    rule: "repeated",
                    type: "string",
                    id: 10
                  },
                  visibility: {
                    type: "SymbolVisibility",
                    id: 11
                  }
                },
                nested: {
                  ExtensionRange: {
                    fields: {
                      start: {
                        type: "int32",
                        id: 1
                      },
                      end: {
                        type: "int32",
                        id: 2
                      },
                      options: {
                        type: "ExtensionRangeOptions",
                        id: 3
                      }
                    }
                  },
                  ReservedRange: {
                    fields: {
                      start: {
                        type: "int32",
                        id: 1
                      },
                      end: {
                        type: "int32",
                        id: 2
                      }
                    }
                  }
                }
              },
              ExtensionRangeOptions: {
                edition: "proto2",
                fields: {
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  },
                  declaration: {
                    rule: "repeated",
                    type: "Declaration",
                    id: 2,
                    options: {
                      retention: "RETENTION_SOURCE"
                    }
                  },
                  features: {
                    type: "FeatureSet",
                    id: 50
                  },
                  verification: {
                    type: "VerificationState",
                    id: 3,
                    options: {
                      default: "UNVERIFIED",
                      retention: "RETENTION_SOURCE"
                    }
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                nested: {
                  Declaration: {
                    fields: {
                      number: {
                        type: "int32",
                        id: 1
                      },
                      fullName: {
                        type: "string",
                        id: 2
                      },
                      type: {
                        type: "string",
                        id: 3
                      },
                      reserved: {
                        type: "bool",
                        id: 5
                      },
                      repeated: {
                        type: "bool",
                        id: 6
                      }
                    },
                    reserved: [
                      [4, 4]
                    ]
                  },
                  VerificationState: {
                    values: {
                      DECLARATION: 0,
                      UNVERIFIED: 1
                    }
                  }
                }
              },
              FieldDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  number: {
                    type: "int32",
                    id: 3
                  },
                  label: {
                    type: "Label",
                    id: 4
                  },
                  type: {
                    type: "Type",
                    id: 5
                  },
                  typeName: {
                    type: "string",
                    id: 6
                  },
                  extendee: {
                    type: "string",
                    id: 2
                  },
                  defaultValue: {
                    type: "string",
                    id: 7
                  },
                  oneofIndex: {
                    type: "int32",
                    id: 9
                  },
                  jsonName: {
                    type: "string",
                    id: 10
                  },
                  options: {
                    type: "FieldOptions",
                    id: 8
                  },
                  proto3Optional: {
                    type: "bool",
                    id: 17
                  }
                },
                nested: {
                  Type: {
                    values: {
                      TYPE_DOUBLE: 1,
                      TYPE_FLOAT: 2,
                      TYPE_INT64: 3,
                      TYPE_UINT64: 4,
                      TYPE_INT32: 5,
                      TYPE_FIXED64: 6,
                      TYPE_FIXED32: 7,
                      TYPE_BOOL: 8,
                      TYPE_STRING: 9,
                      TYPE_GROUP: 10,
                      TYPE_MESSAGE: 11,
                      TYPE_BYTES: 12,
                      TYPE_UINT32: 13,
                      TYPE_ENUM: 14,
                      TYPE_SFIXED32: 15,
                      TYPE_SFIXED64: 16,
                      TYPE_SINT32: 17,
                      TYPE_SINT64: 18
                    }
                  },
                  Label: {
                    values: {
                      LABEL_OPTIONAL: 1,
                      LABEL_REPEATED: 3,
                      LABEL_REQUIRED: 2
                    }
                  }
                }
              },
              OneofDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  options: {
                    type: "OneofOptions",
                    id: 2
                  }
                }
              },
              EnumDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    rule: "repeated",
                    type: "EnumValueDescriptorProto",
                    id: 2
                  },
                  options: {
                    type: "EnumOptions",
                    id: 3
                  },
                  reservedRange: {
                    rule: "repeated",
                    type: "EnumReservedRange",
                    id: 4
                  },
                  reservedName: {
                    rule: "repeated",
                    type: "string",
                    id: 5
                  },
                  visibility: {
                    type: "SymbolVisibility",
                    id: 6
                  }
                },
                nested: {
                  EnumReservedRange: {
                    fields: {
                      start: {
                        type: "int32",
                        id: 1
                      },
                      end: {
                        type: "int32",
                        id: 2
                      }
                    }
                  }
                }
              },
              EnumValueDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  number: {
                    type: "int32",
                    id: 2
                  },
                  options: {
                    type: "EnumValueOptions",
                    id: 3
                  }
                }
              },
              ServiceDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  method: {
                    rule: "repeated",
                    type: "MethodDescriptorProto",
                    id: 2
                  },
                  options: {
                    type: "ServiceOptions",
                    id: 3
                  }
                }
              },
              MethodDescriptorProto: {
                edition: "proto2",
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  inputType: {
                    type: "string",
                    id: 2
                  },
                  outputType: {
                    type: "string",
                    id: 3
                  },
                  options: {
                    type: "MethodOptions",
                    id: 4
                  },
                  clientStreaming: {
                    type: "bool",
                    id: 5
                  },
                  serverStreaming: {
                    type: "bool",
                    id: 6
                  }
                }
              },
              FileOptions: {
                edition: "proto2",
                fields: {
                  javaPackage: {
                    type: "string",
                    id: 1
                  },
                  javaOuterClassname: {
                    type: "string",
                    id: 8
                  },
                  javaMultipleFiles: {
                    type: "bool",
                    id: 10
                  },
                  javaGenerateEqualsAndHash: {
                    type: "bool",
                    id: 20,
                    options: {
                      deprecated: !0
                    }
                  },
                  javaStringCheckUtf8: {
                    type: "bool",
                    id: 27
                  },
                  optimizeFor: {
                    type: "OptimizeMode",
                    id: 9,
                    options: {
                      default: "SPEED"
                    }
                  },
                  goPackage: {
                    type: "string",
                    id: 11
                  },
                  ccGenericServices: {
                    type: "bool",
                    id: 16
                  },
                  javaGenericServices: {
                    type: "bool",
                    id: 17
                  },
                  pyGenericServices: {
                    type: "bool",
                    id: 18
                  },
                  deprecated: {
                    type: "bool",
                    id: 23
                  },
                  ccEnableArenas: {
                    type: "bool",
                    id: 31,
                    options: {
                      default: !0
                    }
                  },
                  objcClassPrefix: {
                    type: "string",
                    id: 36
                  },
                  csharpNamespace: {
                    type: "string",
                    id: 37
                  },
                  swiftPrefix: {
                    type: "string",
                    id: 39
                  },
                  phpClassPrefix: {
                    type: "string",
                    id: 40
                  },
                  phpNamespace: {
                    type: "string",
                    id: 41
                  },
                  phpMetadataNamespace: {
                    type: "string",
                    id: 44
                  },
                  rubyPackage: {
                    type: "string",
                    id: 45
                  },
                  features: {
                    type: "FeatureSet",
                    id: 50
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                reserved: [
                  [42, 42],
                  [38, 38], "php_generic_services"
                ],
                nested: {
                  OptimizeMode: {
                    values: {
                      SPEED: 1,
                      CODE_SIZE: 2,
                      LITE_RUNTIME: 3
                    }
                  }
                }
              },
              MessageOptions: {
                edition: "proto2",
                fields: {
                  messageSetWireFormat: {
                    type: "bool",
                    id: 1
                  },
                  noStandardDescriptorAccessor: {
                    type: "bool",
                    id: 2
                  },
                  deprecated: {
                    type: "bool",
                    id: 3
                  },
                  mapEntry: {
                    type: "bool",
                    id: 7
                  },
                  deprecatedLegacyJsonFieldConflicts: {
                    type: "bool",
                    id: 11,
                    options: {
                      deprecated: !0
                    }
                  },
                  features: {
                    type: "FeatureSet",
                    id: 12
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                reserved: [
                  [4, 4],
                  [5, 5],
                  [6, 6],
                  [8, 8],
                  [9, 9]
                ]
              },
              FieldOptions: {
                edition: "proto2",
                fields: {
                  ctype: {
                    type: "CType",
                    id: 1,
                    options: {
                      default: "STRING"
                    }
                  },
                  packed: {
                    type: "bool",
                    id: 2
                  },
                  jstype: {
                    type: "JSType",
                    id: 6,
                    options: {
                      default: "JS_NORMAL"
                    }
                  },
                  lazy: {
                    type: "bool",
                    id: 5
                  },
                  unverifiedLazy: {
                    type: "bool",
                    id: 15
                  },
                  deprecated: {
                    type: "bool",
                    id: 3
                  },
                  weak: {
                    type: "bool",
                    id: 10,
                    options: {
                      deprecated: !0
                    }
                  },
                  debugRedact: {
                    type: "bool",
                    id: 16
                  },
                  retention: {
                    type: "OptionRetention",
                    id: 17
                  },
                  targets: {
                    rule: "repeated",
                    type: "OptionTargetType",
                    id: 19
                  },
                  editionDefaults: {
                    rule: "repeated",
                    type: "EditionDefault",
                    id: 20
                  },
                  features: {
                    type: "FeatureSet",
                    id: 21
                  },
                  featureSupport: {
                    type: "FeatureSupport",
                    id: 22
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                reserved: [
                  [4, 4],
                  [18, 18]
                ],
                nested: {
                  CType: {
                    values: {
                      STRING: 0,
                      CORD: 1,
                      STRING_PIECE: 2
                    }
                  },
                  JSType: {
                    values: {
                      JS_NORMAL: 0,
                      JS_STRING: 1,
                      JS_NUMBER: 2
                    }
                  },
                  OptionRetention: {
                    values: {
                      RETENTION_UNKNOWN: 0,
                      RETENTION_RUNTIME: 1,
                      RETENTION_SOURCE: 2
                    }
                  },
                  OptionTargetType: {
                    values: {
                      TARGET_TYPE_UNKNOWN: 0,
                      TARGET_TYPE_FILE: 1,
                      TARGET_TYPE_EXTENSION_RANGE: 2,
                      TARGET_TYPE_MESSAGE: 3,
                      TARGET_TYPE_FIELD: 4,
                      TARGET_TYPE_ONEOF: 5,
                      TARGET_TYPE_ENUM: 6,
                      TARGET_TYPE_ENUM_ENTRY: 7,
                      TARGET_TYPE_SERVICE: 8,
                      TARGET_TYPE_METHOD: 9
                    }
                  },
                  EditionDefault: {
                    fields: {
                      edition: {
                        type: "Edition",
                        id: 3
                      },
                      value: {
                        type: "string",
                        id: 2
                      }
                    }
                  },
                  FeatureSupport: {
                    fields: {
                      editionIntroduced: {
                        type: "Edition",
                        id: 1
                      },
                      editionDeprecated: {
                        type: "Edition",
                        id: 2
                      },
                      deprecationWarning: {
                        type: "string",
                        id: 3
                      },
                      editionRemoved: {
                        type: "Edition",
                        id: 4
                      }
                    }
                  }
                }
              },
              OneofOptions: {
                edition: "proto2",
                fields: {
                  features: {
                    type: "FeatureSet",
                    id: 1
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ]
              },
              EnumOptions: {
                edition: "proto2",
                fields: {
                  allowAlias: {
                    type: "bool",
                    id: 2
                  },
                  deprecated: {
                    type: "bool",
                    id: 3
                  },
                  deprecatedLegacyJsonFieldConflicts: {
                    type: "bool",
                    id: 6,
                    options: {
                      deprecated: !0
                    }
                  },
                  features: {
                    type: "FeatureSet",
                    id: 7
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                reserved: [
                  [5, 5]
                ]
              },
              EnumValueOptions: {
                edition: "proto2",
                fields: {
                  deprecated: {
                    type: "bool",
                    id: 1
                  },
                  features: {
                    type: "FeatureSet",
                    id: 2
                  },
                  debugRedact: {
                    type: "bool",
                    id: 3
                  },
                  featureSupport: {
                    type: "FieldOptions.FeatureSupport",
                    id: 4
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ]
              },
              ServiceOptions: {
                edition: "proto2",
                fields: {
                  features: {
                    type: "FeatureSet",
                    id: 34
                  },
                  deprecated: {
                    type: "bool",
                    id: 33
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ]
              },
              MethodOptions: {
                edition: "proto2",
                fields: {
                  deprecated: {
                    type: "bool",
                    id: 33
                  },
                  idempotencyLevel: {
                    type: "IdempotencyLevel",
                    id: 34,
                    options: {
                      default: "IDEMPOTENCY_UNKNOWN"
                    }
                  },
                  features: {
                    type: "FeatureSet",
                    id: 35
                  },
                  uninterpretedOption: {
                    rule: "repeated",
                    type: "UninterpretedOption",
                    id: 999
                  }
                },
                extensions: [
                  [1000, 536870911]
                ],
                nested: {
                  IdempotencyLevel: {
                    values: {
                      IDEMPOTENCY_UNKNOWN: 0,
                      NO_SIDE_EFFECTS: 1,
                      IDEMPOTENT: 2
                    }
                  }
                }
              },
              UninterpretedOption: {
                edition: "proto2",
                fields: {
                  name: {
                    rule: "repeated",
                    type: "NamePart",
                    id: 2
                  },
                  identifierValue: {
                    type: "string",
                    id: 3
                  },
                  positiveIntValue: {
                    type: "uint64",
                    id: 4
                  },
                  negativeIntValue: {
                    type: "int64",
                    id: 5
                  },
                  doubleValue: {
                    type: "double",
                    id: 6
                  },
                  stringValue: {
                    type: "bytes",
                    id: 7
                  },
                  aggregateValue: {
                    type: "string",
                    id: 8
                  }
                },
                nested: {
                  NamePart: {
                    fields: {
                      namePart: {
                        rule: "required",
                        type: "string",
                        id: 1
                      },
                      isExtension: {
                        rule: "required",
                        type: "bool",
                        id: 2
                      }
                    }
                  }
                }
              },
              FeatureSet: {
                edition: "proto2",
                fields: {
                  fieldPresence: {
                    type: "FieldPresence",
                    id: 1,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_2023",
                      "edition_defaults.value": "EXPLICIT"
                    }
                  },
                  enumType: {
                    type: "EnumType",
                    id: 2,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_PROTO3",
                      "edition_defaults.value": "OPEN"
                    }
                  },
                  repeatedFieldEncoding: {
                    type: "RepeatedFieldEncoding",
                    id: 3,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_PROTO3",
                      "edition_defaults.value": "PACKED"
                    }
                  },
                  utf8Validation: {
                    type: "Utf8Validation",
                    id: 4,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_PROTO3",
                      "edition_defaults.value": "VERIFY"
                    }
                  },
                  messageEncoding: {
                    type: "MessageEncoding",
                    id: 5,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_LEGACY",
                      "edition_defaults.value": "LENGTH_PREFIXED"
                    }
                  },
                  jsonFormat: {
                    type: "JsonFormat",
                    id: 6,
                    options: {
                      retention: "RETENTION_RUNTIME",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2023",
                      "edition_defaults.edition": "EDITION_PROTO3",
                      "edition_defaults.value": "ALLOW"
                    }
                  },
                  enforceNamingStyle: {
                    type: "EnforceNamingStyle",
                    id: 7,
                    options: {
                      retention: "RETENTION_SOURCE",
                      targets: "TARGET_TYPE_METHOD",
                      "feature_support.edition_introduced": "EDITION_2024",
                      "edition_defaults.edition": "EDITION_2024",
                      "edition_defaults.value": "STYLE2024"
                    }
                  },
                  defaultSymbolVisibility: {
                    type: "VisibilityFeature.DefaultSymbolVisibility",
                    id: 8,
                    options: {
                      retention: "RETENTION_SOURCE",
                      targets: "TARGET_TYPE_FILE",
                      "feature_support.edition_introduced": "EDITION_2024",
                      "edition_defaults.edition": "EDITION_2024",
                      "edition_defaults.value": "EXPORT_TOP_LEVEL"
                    }
                  }
                },
                extensions: [
                  [1000, 9994],
                  [9995, 9999],
                  [1e4, 1e4]
                ],
                reserved: [
                  [999, 999]
                ],
                nested: {
                  FieldPresence: {
                    values: {
                      FIELD_PRESENCE_UNKNOWN: 0,
                      EXPLICIT: 1,
                      IMPLICIT: 2,
                      LEGACY_REQUIRED: 3
                    }
                  },
                  EnumType: {
                    values: {
                      ENUM_TYPE_UNKNOWN: 0,
                      OPEN: 1,
                      CLOSED: 2
                    }
                  },
                  RepeatedFieldEncoding: {
                    values: {
                      REPEATED_FIELD_ENCODING_UNKNOWN: 0,
                      PACKED: 1,
                      EXPANDED: 2
                    }
                  },
                  Utf8Validation: {
                    values: {
                      UTF8_VALIDATION_UNKNOWN: 0,
                      VERIFY: 2,
                      NONE: 3
                    }
                  },
                  MessageEncoding: {
                    values: {
                      MESSAGE_ENCODING_UNKNOWN: 0,
                      LENGTH_PREFIXED: 1,
                      DELIMITED: 2
                    }
                  },
                  JsonFormat: {
                    values: {
                      JSON_FORMAT_UNKNOWN: 0,
                      ALLOW: 1,
                      LEGACY_BEST_EFFORT: 2
                    }
                  },
                  EnforceNamingStyle: {
                    values: {
                      ENFORCE_NAMING_STYLE_UNKNOWN: 0,
                      STYLE2024: 1,
                      STYLE_LEGACY: 2
                    }
                  },
                  VisibilityFeature: {
                    fields: {},
                    reserved: [
                      [1, 536870911]
                    ],
                    nested: {
                      DefaultSymbolVisibility: {
                        values: {
                          DEFAULT_SYMBOL_VISIBILITY_UNKNOWN: 0,
                          EXPORT_ALL: 1,
                          EXPORT_TOP_LEVEL: 2,
                          LOCAL_ALL: 3,
                          STRICT: 4
                        }
                      }
                    }
                  }
                }
              },
              FeatureSetDefaults: {
                edition: "proto2",
                fields: {
                  defaults: {
                    rule: "repeated",
                    type: "FeatureSetEditionDefault",
                    id: 1
                  },
                  minimumEdition: {
                    type: "Edition",
                    id: 4
                  },
                  maximumEdition: {
                    type: "Edition",
                    id: 5
                  }
                },
                nested: {
                  FeatureSetEditionDefault: {
                    fields: {
                      edition: {
                        type: "Edition",
                        id: 3
                      },
                      overridableFeatures: {
                        type: "FeatureSet",
                        id: 4
                      },
                      fixedFeatures: {
                        type: "FeatureSet",
                        id: 5
                      }
                    },
                    reserved: [
                      [1, 1],
                      [2, 2], "features"
                    ]
                  }
                }
              },
              SourceCodeInfo: {
                edition: "proto2",
                fields: {
                  location: {
                    rule: "repeated",
                    type: "Location",
                    id: 1
                  }
                },
                extensions: [
                  [536000000, 536000000]
                ],
                nested: {
                  Location: {
                    fields: {
                      path: {
                        rule: "repeated",
                        type: "int32",
                        id: 1,
                        options: {
                          packed: !0
                        }
                      },
                      span: {
                        rule: "repeated",
                        type: "int32",
                        id: 2,
                        options: {
                          packed: !0
                        }
                      },
                      leadingComments: {
                        type: "string",
                        id: 3
                      },
                      trailingComments: {
                        type: "string",
                        id: 4
                      },
                      leadingDetachedComments: {
                        rule: "repeated",
                        type: "string",
                        id: 6
                      }
                    }
                  }
                }
              },
              GeneratedCodeInfo: {
                edition: "proto2",
                fields: {
                  annotation: {
                    rule: "repeated",
                    type: "Annotation",
                    id: 1
                  }
                },
                nested: {
                  Annotation: {
                    fields: {
                      path: {
                        rule: "repeated",
                        type: "int32",
                        id: 1,
                        options: {
                          packed: !0
                        }
                      },
                      sourceFile: {
                        type: "string",
                        id: 2
                      },
                      begin: {
                        type: "int32",
                        id: 3
                      },
                      end: {
                        type: "int32",
                        id: 4
                      },
                      semantic: {
                        type: "Semantic",
                        id: 5
                      }
                    },
                    nested: {
                      Semantic: {
                        values: {
                          NONE: 0,
                          SET: 1,
                          ALIAS: 2
                        }
                      }
                    }
                  }
                }
              },
              SymbolVisibility: {
                edition: "proto2",
                values: {
                  VISIBILITY_UNSET: 0,
                  VISIBILITY_LOCAL: 1,
                  VISIBILITY_EXPORT: 2
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10787116, End 10802903)
Vz2 = z((G6, Xz2) => {
  var Mq = Z81();
  Xz2.exports = G6 = Mq.descriptor = Mq.Root.fromJSON(Y90()).lookup(".google.protobuf");
  var {
    Namespace: Zz2,
    Root: yOA,
    Enum: xh,
    Type: Zy,
    Field: oi,
    MapField: jR5,
    OneOf: I81,
    Service: xOA,
    Method: Y81
  } = Mq;
  yOA.fromDescriptor = function(Q) {
    if (typeof Q.length === "number") Q = G6.FileDescriptorSet.decode(Q);
    var B = new yOA;
    if (Q.file) {
      var G, Z;
      for (var I = 0, Y; I < Q.file.length; ++I) {
        if (Z = B, (G = Q.file[I]).package && G.package.length) Z = B.define(G.package);
        var J = gR5(G);
        if (G.name && G.name.length) B.files.push(Z.filename = G.name);
        if (G.messageType)
          for (Y = 0; Y < G.messageType.length; ++Y) Z.add(Zy.fromDescriptor(G.messageType[Y], J));
        if (G.enumType)
          for (Y = 0; Y < G.enumType.length; ++Y) Z.add(xh.fromDescriptor(G.enumType[Y], J));
        if (G.extension)
          for (Y = 0; Y < G.extension.length; ++Y) Z.add(oi.fromDescriptor(G.extension[Y], J));
        if (G.service)
          for (Y = 0; Y < G.service.length; ++Y) Z.add(xOA.fromDescriptor(G.service[Y], J));
        var W = VJA(G.options, G6.FileOptions);
        if (W) {
          var X = Object.keys(W);
          for (Y = 0; Y < X.length; ++Y) Z.setOption(X[Y], W[X[Y]])
        }
      }
    }
    return B.resolveAll()
  };
  yOA.prototype.toDescriptor = function(Q) {
    var B = G6.FileDescriptorSet.create();
    return Iz2(this, B.file, Q), B
  };

  function Iz2(A, Q, B) {
    var G = G6.FileDescriptorProto.create({
      name: A.filename || (A.fullName.substring(1).replace(/\./g, "_") || "root") + ".proto"
    });
    if (uR5(B, G), !(A instanceof yOA)) G.package = A.fullName.substring(1);
    for (var Z = 0, I; Z < A.nestedArray.length; ++Z)
      if ((I = A._nestedArray[Z]) instanceof Zy) G.messageType.push(I.toDescriptor(B));
      else if (I instanceof xh) G.enumType.push(I.toDescriptor());
    else if (I instanceof oi) G.extension.push(I.toDescriptor(B));
    else if (I instanceof xOA) G.service.push(I.toDescriptor());
    else if (I instanceof Zz2) Iz2(I, Q, B);
    if (G.options = FJA(A.options, G6.FileOptions), G.messageType.length + G.enumType.length + G.extension.length + G.service.length) Q.push(G)
  }
  var SR5 = 0;
  Zy.fromDescriptor = function(Q, B, G) {
    if (typeof Q.length === "number") Q = G6.DescriptorProto.decode(Q);
    var Z = new Zy(Q.name.length ? Q.name : "Type" + SR5++, VJA(Q.options, G6.MessageOptions)),
      I;
    if (!G) Z._edition = B;
    if (Q.oneofDecl)
      for (I = 0; I < Q.oneofDecl.length; ++I) Z.add(I81.fromDescriptor(Q.oneofDecl[I]));
    if (Q.field)
      for (I = 0; I < Q.field.length; ++I) {
        var Y = oi.fromDescriptor(Q.field[I], B, !0);
        if (Z.add(Y), Q.field[I].hasOwnProperty("oneofIndex")) Z.oneofsArray[Q.field[I].oneofIndex].add(Y)
      }
    if (Q.extension)
      for (I = 0; I < Q.extension.length; ++I) Z.add(oi.fromDescriptor(Q.extension[I], B, !0));
    if (Q.nestedType) {
      for (I = 0; I < Q.nestedType.length; ++I)
        if (Z.add(Zy.fromDescriptor(Q.nestedType[I], B, !0)), Q.nestedType[I].options && Q.nestedType[I].options.mapEntry) Z.setOption("map_entry", !0)
    }
    if (Q.enumType)
      for (I = 0; I < Q.enumType.length; ++I) Z.add(xh.fromDescriptor(Q.enumType[I], B, !0));
    if (Q.extensionRange && Q.extensionRange.length) {
      Z.extensions = [];
      for (I = 0; I < Q.extensionRange.length; ++I) Z.extensions.push([Q.extensionRange[I].start, Q.extensionRange[I].end])
    }
    if (Q.reservedRange && Q.reservedRange.length || Q.reservedName && Q.reservedName.length) {
      if (Z.reserved = [], Q.reservedRange)
        for (I = 0; I < Q.reservedRange.length; ++I) Z.reserved.push([Q.reservedRange[I].start, Q.reservedRange[I].end]);
      if (Q.reservedName)
        for (I = 0; I < Q.reservedName.length; ++I) Z.reserved.push(Q.reservedName[I])
    }
    return Z
  };
  Zy.prototype.toDescriptor = function(Q) {
    var B = G6.DescriptorProto.create({
        name: this.name
      }),
      G;
    for (G = 0; G < this.fieldsArray.length; ++G) {
      var Z;
      if (B.field.push(Z = this._fieldsArray[G].toDescriptor(Q)), this._fieldsArray[G] instanceof jR5) {
        var I = J90(this._fieldsArray[G].keyType, this._fieldsArray[G].resolvedKeyType, !1),
          Y = J90(this._fieldsArray[G].type, this._fieldsArray[G].resolvedType, !1),
          J = Y === 11 || Y === 14 ? this._fieldsArray[G].resolvedType && Wz2(this.parent, this._fieldsArray[G].resolvedType) || this._fieldsArray[G].type : void 0;
        B.nestedType.push(G6.DescriptorProto.create({
          name: Z.typeName,
          field: [G6.FieldDescriptorProto.create({
            name: "key",
            number: 1,
            label: 1,
            type: I
          }), G6.FieldDescriptorProto.create({
            name: "value",
            number: 2,
            label: 1,
            type: Y,
            typeName: J
          })],
          options: G6.MessageOptions.create({
            mapEntry: !0
          })
        }))
      }
    }
    for (G = 0; G < this.oneofsArray.length; ++G) B.oneofDecl.push(this._oneofsArray[G].toDescriptor());
    for (G = 0; G < this.nestedArray.length; ++G)
      if (this._nestedArray[G] instanceof oi) B.field.push(this._nestedArray[G].toDescriptor(Q));
      else if (this._nestedArray[G] instanceof Zy) B.nestedType.push(this._nestedArray[G].toDescriptor(Q));
    else if (this._nestedArray[G] instanceof xh) B.enumType.push(this._nestedArray[G].toDescriptor());
    if (this.extensions)
      for (G = 0; G < this.extensions.length; ++G) B.extensionRange.push(G6.DescriptorProto.ExtensionRange.create({
        start: this.extensions[G][0],
        end: this.extensions[G][1]
      }));
    if (this.reserved)
      for (G = 0; G < this.reserved.length; ++G)
        if (typeof this.reserved[G] === "string") B.reservedName.push(this.reserved[G]);
        else B.reservedRange.push(G6.DescriptorProto.ReservedRange.create({
          start: this.reserved[G][0],
          end: this.reserved[G][1]
        }));
    return B.options = FJA(this.options, G6.MessageOptions), B
  };
  var _R5 = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
  oi.fromDescriptor = function(Q, B, G) {
    if (typeof Q.length === "number") Q = G6.DescriptorProto.decode(Q);
    if (typeof Q.number !== "number") throw Error("missing field id");
    var Z;
    if (Q.typeName && Q.typeName.length) Z = Q.typeName;
    else Z = bR5(Q.type);
    var I;
    switch (Q.label) {
      case 1:
        I = void 0;
        break;
      case 2:
        I = "required";
        break;
      case 3:
        I = "repeated";
        break;
      default:
        throw Error("illegal label: " + Q.label)
    }
    var Y = Q.extendee;
    if (Q.extendee !== void 0) Y = Y.length ? Y : void 0;
    var J = new oi(Q.name.length ? Q.name : "field" + Q.number, Q.number, Z, I, Y);
    if (!G) J._edition = B;
    if (J.options = VJA(Q.options, G6.FieldOptions), Q.proto3_optional) J.options.proto3_optional = !0;
    if (Q.defaultValue && Q.defaultValue.length) {
      var W = Q.defaultValue;
      switch (W) {
        case "true":
        case "TRUE":
          W = !0;
          break;
        case "false":
        case "FALSE":
          W = !1;
          break;
        default:
          var X = _R5.exec(W);
          if (X) W = parseInt(W);
          break
      }
      J.setOption("default", W)
    }
    if (fR5(Q.type)) {
      if (B === "proto3") {
        if (Q.options && !Q.options.packed) J.setOption("packed", !1)
      } else if ((!B || B === "proto2") && Q.options && Q.options.packed) J.setOption("packed", !0)
    }
    return J
  };
  oi.prototype.toDescriptor = function(Q) {
    var B = G6.FieldDescriptorProto.create({
      name: this.name,
      number: this.id
    });
    if (this.map) B.type = 11, B.typeName = Mq.util.ucFirst(this.name), B.label = 3;
    else {
      switch (B.type = J90(this.type, this.resolve().resolvedType, this.delimited)) {
        case 10:
        case 11:
        case 14:
          B.typeName = this.resolvedType ? Wz2(this.parent, this.resolvedType) : this.type;
          break
      }
      if (this.rule === "repeated") B.label = 3;
      else if (this.required && Q === "proto2") B.label = 2;
      else B.label = 1
    }
    if (B.extendee = this.extensionField ? this.extensionField.parent.fullName : this.extend, this.partOf) {
      if ((B.oneofIndex = this.parent.oneofsArray.indexOf(this.partOf)) < 0) throw Error("missing oneof")
    }
    if (this.options) {
      if (B.options = FJA(this.options, G6.FieldOptions), this.options.default != null) B.defaultValue = String(this.options.default);
      if (this.options.proto3_optional) B.proto3_optional = !0
    }
    if (Q === "proto3") {
      if (!this.packed)(B.options || (B.options = G6.FieldOptions.create())).packed = !1
    } else if ((!Q || Q === "proto2") && this.packed)(B.options || (B.options = G6.FieldOptions.create())).packed = !0;
    return B
  };
  var kR5 = 0;
  xh.fromDescriptor = function(Q, B, G) {
    if (typeof Q.length === "number") Q = G6.EnumDescriptorProto.decode(Q);
    var Z = {};
    if (Q.value)
      for (var I = 0; I < Q.value.length; ++I) {
        var Y = Q.value[I].name,
          J = Q.value[I].number || 0;
        Z[Y && Y.length ? Y : "NAME" + J] = J
      }
    var W = new xh(Q.name && Q.name.length ? Q.name : "Enum" + kR5++, Z, VJA(Q.options, G6.EnumOptions));
    if (!G) W._edition = B;
    return W
  };
  xh.prototype.toDescriptor = function() {
    var Q = [];
    for (var B = 0, G = Object.keys(this.values); B < G.length; ++B) Q.push(G6.EnumValueDescriptorProto.create({
      name: G[B],
      number: this.values[G[B]]
    }));
    return G6.EnumDescriptorProto.create({
      name: this.name,
      value: Q,
      options: FJA(this.options, G6.EnumOptions)
    })
  };
  var yR5 = 0;
  I81.fromDescriptor = function(Q) {
    if (typeof Q.length === "number") Q = G6.OneofDescriptorProto.decode(Q);
    return new I81(Q.name && Q.name.length ? Q.name : "oneof" + yR5++)
  };
  I81.prototype.toDescriptor = function() {
    return G6.OneofDescriptorProto.create({
      name: this.name
    })
  };
  var xR5 = 0;
  xOA.fromDescriptor = function(Q, B, G) {
    if (typeof Q.length === "number") Q = G6.ServiceDescriptorProto.decode(Q);
    var Z = new xOA(Q.name && Q.name.length ? Q.name : "Service" + xR5++, VJA(Q.options, G6.ServiceOptions));
    if (!G) Z._edition = B;
    if (Q.method)
      for (var I = 0; I < Q.method.length; ++I) Z.add(Y81.fromDescriptor(Q.method[I]));
    return Z
  };
  xOA.prototype.toDescriptor = function() {
    var Q = [];
    for (var B = 0; B < this.methodsArray.length; ++B) Q.push(this._methodsArray[B].toDescriptor());
    return G6.ServiceDescriptorProto.create({
      name: this.name,
      method: Q,
      options: FJA(this.options, G6.ServiceOptions)
    })
  };
  var vR5 = 0;
  Y81.fromDescriptor = function(Q) {
    if (typeof Q.length === "number") Q = G6.MethodDescriptorProto.decode(Q);
    return new Y81(Q.name && Q.name.length ? Q.name : "Method" + vR5++, "rpc", Q.inputType, Q.outputType, Boolean(Q.clientStreaming), Boolean(Q.serverStreaming), VJA(Q.options, G6.MethodOptions))
  };
  Y81.prototype.toDescriptor = function() {
    return G6.MethodDescriptorProto.create({
      name: this.name,
      inputType: this.resolvedRequestType ? this.resolvedRequestType.fullName : this.requestType,
      outputType: this.resolvedResponseType ? this.resolvedResponseType.fullName : this.responseType,
      clientStreaming: this.requestStream,
      serverStreaming: this.responseStream,
      options: FJA(this.options, G6.MethodOptions)
    })
  };

  function bR5(A) {
    switch (A) {
      case 1:
        return "double";
      case 2:
        return "float";
      case 3:
        return "int64";
      case 4:
        return "uint64";
      case 5:
        return "int32";
      case 6:
        return "fixed64";
      case 7:
        return "fixed32";
      case 8:
        return "bool";
      case 9:
        return "string";
      case 12:
        return "bytes";
      case 13:
        return "uint32";
      case 15:
        return "sfixed32";
      case 16:
        return "sfixed64";
      case 17:
        return "sint32";
      case 18:
        return "sint64"
    }
    throw Error("illegal type: " + A)
  }

  function fR5(A) {
    switch (A) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
        return !0
    }
    return !1
  }

  function J90(A, Q, B) {
    switch (A) {
      case "double":
        return 1;
      case "float":
        return 2;
      case "int64":
        return 3;
      case "uint64":
        return 4;
      case "int32":
        return 5;
      case "fixed64":
        return 6;
      case "fixed32":
        return 7;
      case "bool":
        return 8;
      case "string":
        return 9;
      case "bytes":
        return 12;
      case "uint32":
        return 13;
      case "sfixed32":
        return 15;
      case "sfixed64":
        return 16;
      case "sint32":
        return 17;
      case "sint64":
        return 18
    }
    if (Q instanceof xh) return 14;
    if (Q instanceof Zy) return B ? 10 : 11;
    throw Error("illegal type: " + A)
  }

  function Yz2(A, Q) {
    var B = {};
    for (var G = 0, Z, I; G < Q.fieldsArray.length; ++G) {
      if ((I = (Z = Q._fieldsArray[G]).name) === "uninterpretedOption") continue;
      if (!Object.prototype.hasOwnProperty.call(A, I)) continue;
      var Y = hR5(I);
      if (Z.resolvedType instanceof Zy) B[Y] = Yz2(A[I], Z.resolvedType);
      else if (Z.resolvedType instanceof xh) B[Y] = Z.resolvedType.valuesById[A[I]];
      else B[Y] = A[I]
    }
    return B
  }

  function VJA(A, Q) {
    if (!A) return;
    return Yz2(Q.toObject(A), Q)
  }

  function Jz2(A, Q) {
    var B = {},
      G = Object.keys(A);
    for (var Z = 0; Z < G.length; ++Z) {
      var I = G[Z],
        Y = Mq.util.camelCase(I);
      if (!Object.prototype.hasOwnProperty.call(Q.fields, Y)) continue;
      var J = Q.fields[Y];
      if (J.resolvedType instanceof Zy) B[Y] = Jz2(A[I], J.resolvedType);
      else B[Y] = A[I];
      if (J.repeated && !Array.isArray(B[Y])) B[Y] = [B[Y]]
    }
    return B
  }

  function FJA(A, Q) {
    if (!A) return;
    return Q.fromObject(Jz2(A, Q))
  }

  function Wz2(A, Q) {
    var B = A.fullName.split("."),
      G = Q.fullName.split("."),
      Z = 0,
      I = 0,
      Y = G.length - 1;
    if (!(A instanceof yOA) && Q instanceof Zz2)
      while (Z < B.length && I < Y && B[Z] === G[I]) {
        var J = Q.lookup(B[Z++], !0);
        if (J !== null && J !== Q) break;
        ++I
      } else
        for (; Z < B.length && I < Y && B[Z] === G[I]; ++Z, ++I);
    return G.slice(I).join(".")
  }

  function hR5(A) {
    return A.substring(0, 1) + A.substring(1).replace(/([A-Z])(?=[a-z]|$)/g, function(Q, B) {
      return "_" + B.toLowerCase()
    })
  }

  function gR5(A) {
    if (A.syntax === "editions") switch (A.edition) {
      case G6.Edition.EDITION_2023:
        return "2023";
      default:
        throw Error("Unsupported edition " + A.edition)
    }
    if (A.syntax === "proto3") return "proto3";
    return "proto2"
  }

  function uR5(A, Q) {
    if (!A) return;
    if (A === "proto2" || A === "proto3") Q.syntax = A;
    else switch (Q.syntax = "editions", A) {
      case "2023":
        Q.edition = G6.Edition.EDITION_2023;
        break;
      default:
        throw Error("Unsupported edition " + A)
    }
  }
})