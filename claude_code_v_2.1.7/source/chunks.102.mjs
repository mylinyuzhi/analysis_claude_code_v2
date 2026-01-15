
// @from(Ln 294705, Col 4)
Xs = U((kSZ, dH2) => {
  dH2.exports = PF;
  var OvA = Is();
  ((PF.prototype = Object.create(OvA.prototype)).constructor = PF).className = "Field";
  var mH2 = dS(),
    LV0 = A6A(),
    DK = TF(),
    LvA, kN5 = /^required|optional|repeated$/;
  PF.fromJSON = function (Q, B) {
    var G = new PF(Q, B.id, B.type, B.rule, B.extend, B.options, B.comment);
    if (B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };

  function PF(A, Q, B, G, Z, Y, J) {
    if (DK.isObject(G)) J = Z, Y = G, G = Z = void 0;
    else if (DK.isObject(Z)) J = Y, Y = Z, Z = void 0;
    if (OvA.call(this, A, Y), !DK.isInteger(Q) || Q < 0) throw TypeError("id must be a non-negative integer");
    if (!DK.isString(B)) throw TypeError("type must be a string");
    if (G !== void 0 && !kN5.test(G = G.toString().toLowerCase())) throw TypeError("rule must be a string rule");
    if (Z !== void 0 && !DK.isString(Z)) throw TypeError("extend must be a string");
    if (G === "proto3_optional") G = "optional";
    this.rule = G && G !== "optional" ? G : void 0, this.type = B, this.id = Q, this.extend = Z || void 0, this.repeated = G === "repeated", this.map = !1, this.message = null, this.partOf = null, this.typeDefault = null, this.defaultValue = null, this.long = DK.Long ? LV0.long[B] !== void 0 : !1, this.bytes = B === "bytes", this.resolvedType = null, this.extensionField = null, this.declaringField = null, this.comment = J
  }
  Object.defineProperty(PF.prototype, "required", {
    get: function () {
      return this._features.field_presence === "LEGACY_REQUIRED"
    }
  });
  Object.defineProperty(PF.prototype, "optional", {
    get: function () {
      return !this.required
    }
  });
  Object.defineProperty(PF.prototype, "delimited", {
    get: function () {
      return this.resolvedType instanceof LvA && this._features.message_encoding === "DELIMITED"
    }
  });
  Object.defineProperty(PF.prototype, "packed", {
    get: function () {
      return this._features.repeated_field_encoding === "PACKED"
    }
  });
  Object.defineProperty(PF.prototype, "hasPresence", {
    get: function () {
      if (this.repeated || this.map) return !1;
      return this.partOf || this.declaringField || this.extensionField || this._features.field_presence !== "IMPLICIT"
    }
  });
  PF.prototype.setOption = function (Q, B, G) {
    return OvA.prototype.setOption.call(this, Q, B, G)
  };
  PF.prototype.toJSON = function (Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return DK.toObject(["edition", this._editionToJSON(), "rule", this.rule !== "optional" && this.rule || void 0, "type", this.type, "id", this.id, "extend", this.extend, "options", this.options, "comment", B ? this.comment : void 0])
  };
  PF.prototype.resolve = function () {
    if (this.resolved) return this;
    if ((this.typeDefault = LV0.defaults[this.type]) === void 0)
      if (this.resolvedType = (this.declaringField ? this.declaringField.parent : this.parent).lookupTypeOrEnum(this.type), this.resolvedType instanceof LvA) this.typeDefault = null;
      else this.typeDefault = this.resolvedType.values[Object.keys(this.resolvedType.values)[0]];
    else if (this.options && this.options.proto3_optional) this.typeDefault = null;
    if (this.options && this.options.default != null) {
      if (this.typeDefault = this.options.default, this.resolvedType instanceof mH2 && typeof this.typeDefault === "string") this.typeDefault = this.resolvedType.values[this.typeDefault]
    }
    if (this.options) {
      if (this.options.packed !== void 0 && this.resolvedType && !(this.resolvedType instanceof mH2)) delete this.options.packed;
      if (!Object.keys(this.options).length) this.options = void 0
    }
    if (this.long) {
      if (this.typeDefault = DK.Long.fromNumber(this.typeDefault, this.type.charAt(0) === "u"), Object.freeze) Object.freeze(this.typeDefault)
    } else if (this.bytes && typeof this.typeDefault === "string") {
      var Q;
      if (DK.base64.test(this.typeDefault)) DK.base64.decode(this.typeDefault, Q = DK.newBuffer(DK.base64.length(this.typeDefault)), 0);
      else DK.utf8.write(this.typeDefault, Q = DK.newBuffer(DK.utf8.length(this.typeDefault)), 0);
      this.typeDefault = Q
    }
    if (this.map) this.defaultValue = DK.emptyObject;
    else if (this.repeated) this.defaultValue = DK.emptyArray;
    else this.defaultValue = this.typeDefault;
    if (this.parent instanceof LvA) this.parent.ctor.prototype[this.name] = this.defaultValue;
    return OvA.prototype.resolve.call(this)
  };
  PF.prototype._inferLegacyProtoFeatures = function (Q) {
    if (Q !== "proto2" && Q !== "proto3") return {};
    var B = {};
    if (this.rule === "required") B.field_presence = "LEGACY_REQUIRED";
    if (this.parent && LV0.defaults[this.type] === void 0) {
      var G = this.parent.get(this.type.split(".").pop());
      if (G && G instanceof LvA && G.group) B.message_encoding = "DELIMITED"
    }
    if (this.getOption("packed") === !0) B.repeated_field_encoding = "PACKED";
    else if (this.getOption("packed") === !1) B.repeated_field_encoding = "EXPANDED";
    return B
  };
  PF.prototype._resolveFeatures = function (Q) {
    return OvA.prototype._resolveFeatures.call(this, this._edition || Q)
  };
  PF.d = function (Q, B, G, Z) {
    if (typeof B === "function") B = DK.decorateType(B).name;
    else if (B && typeof B === "object") B = DK.decorateEnum(B).name;
    return function (J, X) {
      DK.decorateType(J.constructor).add(new PF(X, Q, B, G, {
        default: Z
      }))
    }
  };
  PF._configure = function (Q) {
    LvA = Q
  }
})
// @from(Ln 294817, Col 4)
e4A = U((bSZ, lH2) => {
  lH2.exports = UO;
  var FX1 = Is();
  ((UO.prototype = Object.create(FX1.prototype)).constructor = UO).className = "OneOf";
  var cH2 = Xs(),
    VX1 = TF();

  function UO(A, Q, B, G) {
    if (!Array.isArray(Q)) B = Q, Q = void 0;
    if (FX1.call(this, A, B), !(Q === void 0 || Array.isArray(Q))) throw TypeError("fieldNames must be an Array");
    this.oneof = Q || [], this.fieldsArray = [], this.comment = G
  }
  UO.fromJSON = function (Q, B) {
    return new UO(Q, B.oneof, B.options, B.comment)
  };
  UO.prototype.toJSON = function (Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return VX1.toObject(["options", this.options, "oneof", this.oneof, "comment", B ? this.comment : void 0])
  };

  function pH2(A) {
    if (A.parent) {
      for (var Q = 0; Q < A.fieldsArray.length; ++Q)
        if (!A.fieldsArray[Q].parent) A.parent.add(A.fieldsArray[Q])
    }
  }
  UO.prototype.add = function (Q) {
    if (!(Q instanceof cH2)) throw TypeError("field must be a Field");
    if (Q.parent && Q.parent !== this.parent) Q.parent.remove(Q);
    return this.oneof.push(Q.name), this.fieldsArray.push(Q), Q.partOf = this, pH2(this), this
  };
  UO.prototype.remove = function (Q) {
    if (!(Q instanceof cH2)) throw TypeError("field must be a Field");
    var B = this.fieldsArray.indexOf(Q);
    if (B < 0) throw Error(Q + " is not a member of " + this);
    if (this.fieldsArray.splice(B, 1), B = this.oneof.indexOf(Q.name), B > -1) this.oneof.splice(B, 1);
    return Q.partOf = null, this
  };
  UO.prototype.onAdd = function (Q) {
    FX1.prototype.onAdd.call(this, Q);
    var B = this;
    for (var G = 0; G < this.oneof.length; ++G) {
      var Z = Q.get(this.oneof[G]);
      if (Z && !Z.partOf) Z.partOf = B, B.fieldsArray.push(Z)
    }
    pH2(this)
  };
  UO.prototype.onRemove = function (Q) {
    for (var B = 0, G; B < this.fieldsArray.length; ++B)
      if ((G = this.fieldsArray[B]).parent) G.parent.remove(G);
    FX1.prototype.onRemove.call(this, Q)
  };
  Object.defineProperty(UO.prototype, "isProto3Optional", {
    get: function () {
      if (this.fieldsArray == null || this.fieldsArray.length !== 1) return !1;
      var A = this.fieldsArray[0];
      return A.options != null && A.options.proto3_optional === !0
    }
  });
  UO.d = function () {
    var Q = Array(arguments.length),
      B = 0;
    while (B < arguments.length) Q[B] = arguments[B++];
    return function (Z, Y) {
      VX1.decorateType(Z.constructor).add(new UO(Y, Q)), Object.defineProperty(Z, Y, {
        get: VX1.oneOfGetter(Q),
        set: VX1.oneOfSetter(Q)
      })
    }
  }
})
// @from(Ln 294888, Col 4)
Is = U((fSZ, iH2) => {
  iH2.exports = HE;
  HE.className = "ReflectionObject";
  var bN5 = e4A(),
    MvA = TF(),
    HX1, fN5 = {
      enum_type: "OPEN",
      field_presence: "EXPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY"
    },
    hN5 = {
      enum_type: "CLOSED",
      field_presence: "EXPLICIT",
      json_format: "LEGACY_BEST_EFFORT",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "EXPANDED",
      utf8_validation: "NONE"
    },
    gN5 = {
      enum_type: "OPEN",
      field_presence: "IMPLICIT",
      json_format: "ALLOW",
      message_encoding: "LENGTH_PREFIXED",
      repeated_field_encoding: "PACKED",
      utf8_validation: "VERIFY"
    };

  function HE(A, Q) {
    if (!MvA.isString(A)) throw TypeError("name must be a string");
    if (Q && !MvA.isObject(Q)) throw TypeError("options must be an object");
    this.options = Q, this.parsedOptions = null, this.name = A, this._edition = null, this._defaultEdition = "proto2", this._features = {}, this._featuresResolved = !1, this.parent = null, this.resolved = !1, this.comment = null, this.filename = null
  }
  Object.defineProperties(HE.prototype, {
    root: {
      get: function () {
        var A = this;
        while (A.parent !== null) A = A.parent;
        return A
      }
    },
    fullName: {
      get: function () {
        var A = [this.name],
          Q = this.parent;
        while (Q) A.unshift(Q.name), Q = Q.parent;
        return A.join(".")
      }
    }
  });
  HE.prototype.toJSON = function () {
    throw Error()
  };
  HE.prototype.onAdd = function (Q) {
    if (this.parent && this.parent !== Q) this.parent.remove(this);
    this.parent = Q, this.resolved = !1;
    var B = Q.root;
    if (B instanceof HX1) B._handleAdd(this)
  };
  HE.prototype.onRemove = function (Q) {
    var B = Q.root;
    if (B instanceof HX1) B._handleRemove(this);
    this.parent = null, this.resolved = !1
  };
  HE.prototype.resolve = function () {
    if (this.resolved) return this;
    if (this.root instanceof HX1) this.resolved = !0;
    return this
  };
  HE.prototype._resolveFeaturesRecursive = function (Q) {
    return this._resolveFeatures(this._edition || Q)
  };
  HE.prototype._resolveFeatures = function (Q) {
    if (this._featuresResolved) return;
    var B = {};
    if (!Q) throw Error("Unknown edition for " + this.fullName);
    var G = Object.assign(this.options ? Object.assign({}, this.options.features) : {}, this._inferLegacyProtoFeatures(Q));
    if (this._edition) {
      if (Q === "proto2") B = Object.assign({}, hN5);
      else if (Q === "proto3") B = Object.assign({}, gN5);
      else if (Q === "2023") B = Object.assign({}, fN5);
      else throw Error("Unknown edition: " + Q);
      this._features = Object.assign(B, G || {}), this._featuresResolved = !0;
      return
    }
    if (this.partOf instanceof bN5) {
      var Z = Object.assign({}, this.partOf._features);
      this._features = Object.assign(Z, G || {})
    } else if (this.declaringField);
    else if (this.parent) {
      var Y = Object.assign({}, this.parent._features);
      this._features = Object.assign(Y, G || {})
    } else throw Error("Unable to find a parent for " + this.fullName);
    if (this.extensionField) this.extensionField._features = this._features;
    this._featuresResolved = !0
  };
  HE.prototype._inferLegacyProtoFeatures = function () {
    return {}
  };
  HE.prototype.getOption = function (Q) {
    if (this.options) return this.options[Q];
    return
  };
  HE.prototype.setOption = function (Q, B, G) {
    if (!this.options) this.options = {};
    if (/^features\./.test(Q)) MvA.setProperty(this.options, Q, B, G);
    else if (!G || this.options[Q] === void 0) {
      if (this.getOption(Q) !== B) this.resolved = !1;
      this.options[Q] = B
    }
    return this
  };
  HE.prototype.setParsedOption = function (Q, B, G) {
    if (!this.parsedOptions) this.parsedOptions = [];
    var Z = this.parsedOptions;
    if (G) {
      var Y = Z.find(function (I) {
        return Object.prototype.hasOwnProperty.call(I, Q)
      });
      if (Y) {
        var J = Y[Q];
        MvA.setProperty(J, G, B)
      } else Y = {}, Y[Q] = MvA.setProperty({}, G, B), Z.push(Y)
    } else {
      var X = {};
      X[Q] = B, Z.push(X)
    }
    return this
  };
  HE.prototype.setOptions = function (Q, B) {
    if (Q)
      for (var G = Object.keys(Q), Z = 0; Z < G.length; ++Z) this.setOption(G[Z], Q[G[Z]], B);
    return this
  };
  HE.prototype.toString = function () {
    var Q = this.constructor.className,
      B = this.fullName;
    if (B.length) return Q + " " + B;
    return Q
  };
  HE.prototype._editionToJSON = function () {
    if (!this._edition || this._edition === "proto3") return;
    return this._edition
  };
  HE._configure = function (A) {
    HX1 = A
  }
})
// @from(Ln 295038, Col 4)
dS = U((hSZ, aH2) => {
  aH2.exports = cS;
  var OV0 = Is();
  ((cS.prototype = Object.create(OV0.prototype)).constructor = cS).className = "Enum";
  var nH2 = NFA(),
    EX1 = TF();

  function cS(A, Q, B, G, Z, Y) {
    if (OV0.call(this, A, B), Q && typeof Q !== "object") throw TypeError("values must be an object");
    if (this.valuesById = {}, this.values = Object.create(this.valuesById), this.comment = G, this.comments = Z || {}, this.valuesOptions = Y, this._valuesFeatures = {}, this.reserved = void 0, Q) {
      for (var J = Object.keys(Q), X = 0; X < J.length; ++X)
        if (typeof Q[J[X]] === "number") this.valuesById[this.values[J[X]] = Q[J[X]]] = J[X]
    }
  }
  cS.prototype._resolveFeatures = function (Q) {
    return Q = this._edition || Q, OV0.prototype._resolveFeatures.call(this, Q), Object.keys(this.values).forEach((B) => {
      var G = Object.assign({}, this._features);
      this._valuesFeatures[B] = Object.assign(G, this.valuesOptions && this.valuesOptions[B] && this.valuesOptions[B].features)
    }), this
  };
  cS.fromJSON = function (Q, B) {
    var G = new cS(Q, B.values, B.options, B.comment, B.comments);
    if (G.reserved = B.reserved, B.edition) G._edition = B.edition;
    return G._defaultEdition = "proto3", G
  };
  cS.prototype.toJSON = function (Q) {
    var B = Q ? Boolean(Q.keepComments) : !1;
    return EX1.toObject(["edition", this._editionToJSON(), "options", this.options, "valuesOptions", this.valuesOptions, "values", this.values, "reserved", this.reserved && this.reserved.length ? this.reserved : void 0, "comment", B ? this.comment : void 0, "comments", B ? this.comments : void 0])
  };
  cS.prototype.add = function (Q, B, G, Z) {
    if (!EX1.isString(Q)) throw TypeError("name must be a string");
    if (!EX1.isInteger(B)) throw TypeError("id must be an integer");
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
  cS.prototype.remove = function (Q) {
    if (!EX1.isString(Q)) throw TypeError("name must be a string");
    var B = this.values[Q];
    if (B == null) throw Error("name '" + Q + "' does not exist in " + this);
    if (delete this.valuesById[B], delete this.values[Q], delete this.comments[Q], this.valuesOptions) delete this.valuesOptions[Q];
    return this
  };
  cS.prototype.isReservedId = function (Q) {
    return nH2.isReservedId(this.reserved, Q)
  };
  cS.prototype.isReservedName = function (Q) {
    return nH2.isReservedName(this.reserved, Q)
  }
})
// @from(Ln 295097, Col 4)
$V0 = U((gSZ, rH2) => {
  rH2.exports = mN5;
  var uN5 = dS(),
    MV0 = A6A(),
    RV0 = TF();

  function oH2(A, Q, B, G) {
    return Q.delimited ? A("types[%i].encode(%s,w.uint32(%i)).uint32(%i)", B, G, (Q.id << 3 | 3) >>> 0, (Q.id << 3 | 4) >>> 0) : A("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()", B, G, (Q.id << 3 | 2) >>> 0)
  }

  function mN5(A) {
    var Q = RV0.codegen(["m", "w"], A.name + "$encode")("if(!w)")("w=Writer.create()"),
      B, G, Z = A.fieldsArray.slice().sort(RV0.compareFieldsById);
    for (var B = 0; B < Z.length; ++B) {
      var Y = Z[B].resolve(),
        J = A._fieldsArray.indexOf(Y),
        X = Y.resolvedType instanceof uN5 ? "int32" : Y.type,
        I = MV0.basic[X];
      if (G = "m" + RV0.safeProp(Y.name), Y.map) {
        if (Q("if(%s!=null&&Object.hasOwnProperty.call(m,%j)){", G, Y.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){", G)("w.uint32(%i).fork().uint32(%i).%s(ks[i])", (Y.id << 3 | 2) >>> 0, 8 | MV0.mapKey[Y.keyType], Y.keyType), I === void 0) Q("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()", J, G);
        else Q(".uint32(%i).%s(%s[ks[i]]).ldelim()", 16 | I, X, G);
        Q("}")("}")
      } else if (Y.repeated) {
        if (Q("if(%s!=null&&%s.length){", G, G), Y.packed && MV0.packed[X] !== void 0) Q("w.uint32(%i).fork()", (Y.id << 3 | 2) >>> 0)("for(var i=0;i<%s.length;++i)", G)("w.%s(%s[i])", X, G)("w.ldelim()");
        else if (Q("for(var i=0;i<%s.length;++i)", G), I === void 0) oH2(Q, Y, J, G + "[i]");
        else Q("w.uint32(%i).%s(%s[i])", (Y.id << 3 | I) >>> 0, X, G);
        Q("}")
      } else {
        if (Y.optional) Q("if(%s!=null&&Object.hasOwnProperty.call(m,%j))", G, Y.name);
        if (I === void 0) oH2(Q, Y, J, G);
        else Q("w.uint32(%i).%s(%s)", (Y.id << 3 | I) >>> 0, X, G)
      }
    }
    return Q("return w")
  }
})
// @from(Ln 295133, Col 4)
tH2 = U((uSZ, sH2) => {
  var J7 = sH2.exports = sW0();
  J7.build = "light";

  function dN5(A, Q, B) {
    if (typeof Q === "function") B = Q, Q = new J7.Root;
    else if (!Q) Q = new J7.Root;
    return Q.load(A, B)
  }
  J7.load = dN5;

  function cN5(A, Q) {
    if (!Q) Q = new J7.Root;
    return Q.loadSync(A)
  }
  J7.loadSync = cN5;
  J7.encoder = $V0();
  J7.decoder = JV0();
  J7.verifier = DV0();
  J7.converter = VV0();
  J7.ReflectionObject = Is();
  J7.Namespace = NFA();
  J7.Root = KX1();
  J7.Enum = dS();
  J7.Type = XX1();
  J7.Field = Xs();
  J7.OneOf = e4A();
  J7.MapField = QX1();
  J7.Service = GX1();
  J7.Method = BX1();
  J7.Message = ZX1();
  J7.wrappers = FV0();
  J7.types = A6A();
  J7.util = TF();
  J7.ReflectionObject._configure(J7.Root);
  J7.Namespace._configure(J7.Type, J7.Service, J7.Enum);
  J7.Root._configure(J7.Type);
  J7.Field._configure(J7.Type)
})
// @from(Ln 295172, Col 4)
jV0 = U((mSZ, QE2) => {
  QE2.exports = AE2;
  var _V0 = /[\s{}=;:[\],'"()<>]/g,
    pN5 = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
    lN5 = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
    iN5 = /^ *[*/]+ */,
    nN5 = /^\s*\*?\/*/,
    aN5 = /\n/g,
    oN5 = /\s/,
    rN5 = /\\(.?)/g,
    sN5 = {
      "0": "\x00",
      r: "\r",
      n: `
`,
      t: "\t"
    };

  function eH2(A) {
    return A.replace(rN5, function (Q, B) {
      switch (B) {
        case "\\":
        case "":
          return B;
        default:
          return sN5[B] || ""
      }
    })
  }
  AE2.unescape = eH2;

  function AE2(A, Q) {
    A = A.toString();
    var B = 0,
      G = A.length,
      Z = 1,
      Y = 0,
      J = {},
      X = [],
      I = null;

    function D(M) {
      return Error("illegal " + M + " (line " + Z + ")")
    }

    function W() {
      var M = I === "'" ? lN5 : pN5;
      M.lastIndex = B - 1;
      var _ = M.exec(A);
      if (!_) throw D("string");
      return B = M.lastIndex, z(I), I = null, eH2(_[1])
    }

    function K(M) {
      return A.charAt(M)
    }

    function V(M, _, j) {
      var x = {
          type: A.charAt(M++),
          lineEmpty: !1,
          leading: j
        },
        b;
      if (Q) b = 2;
      else b = 3;
      var S = M - b,
        u;
      do
        if (--S < 0 || (u = A.charAt(S)) === `
`) {
          x.lineEmpty = !0;
          break
        } while (u === " " || u === "\t");
      var f = A.substring(M, _).split(aN5);
      for (var AA = 0; AA < f.length; ++AA) f[AA] = f[AA].replace(Q ? nN5 : iN5, "").trim();
      x.text = f.join(`
`).trim(), J[Z] = x, Y = Z
    }

    function F(M) {
      var _ = H(M),
        j = A.substring(M, _),
        x = /^\s*\/\//.test(j);
      return x
    }

    function H(M) {
      var _ = M;
      while (_ < G && K(_) !== `
`) _++;
      return _
    }

    function E() {
      if (X.length > 0) return X.shift();
      if (I) return W();
      var M, _, j, x, b, S = B === 0;
      do {
        if (B === G) return null;
        M = !1;
        while (oN5.test(j = K(B))) {
          if (j === `
`) S = !0, ++Z;
          if (++B === G) return null
        }
        if (K(B) === "/") {
          if (++B === G) throw D("comment");
          if (K(B) === "/")
            if (!Q) {
              b = K(x = B + 1) === "/";
              while (K(++B) !== `
`)
                if (B === G) return null;
              if (++B, b) V(x, B - 1, S), S = !0;
              ++Z, M = !0
            } else {
              if (x = B, b = !1, F(B - 1)) {
                b = !0;
                do {
                  if (B = H(B), B === G) break;
                  if (B++, !S) break
                } while (F(B))
              } else B = Math.min(G, H(B) + 1);
              if (b) V(x, B, S), S = !0;
              Z++, M = !0
            }
          else if ((j = K(B)) === "*") {
            x = B + 1, b = Q || K(x) === "*";
            do {
              if (j === `
`) ++Z;
              if (++B === G) throw D("comment");
              _ = j, j = K(B)
            } while (_ !== "*" || j !== "/");
            if (++B, b) V(x, B - 2, S), S = !0;
            M = !0
          } else return "/"
        }
      } while (M);
      var u = B;
      _V0.lastIndex = 0;
      var f = _V0.test(K(u++));
      if (!f)
        while (u < G && !_V0.test(K(u))) ++u;
      var AA = A.substring(B, B = u);
      if (AA === '"' || AA === "'") I = AA;
      return AA
    }

    function z(M) {
      X.push(M)
    }

    function $() {
      if (!X.length) {
        var M = E();
        if (M === null) return null;
        z(M)
      }
      return X[0]
    }

    function O(M, _) {
      var j = $(),
        x = j === M;
      if (x) return E(), !0;
      if (!_) throw D("token '" + j + "', '" + M + "' expected");
      return !1
    }

    function L(M) {
      var _ = null,
        j;
      if (M === void 0) {
        if (j = J[Z - 1], delete J[Z - 1], j && (Q || j.type === "*" || j.lineEmpty)) _ = j.leading ? j.text : null
      } else {
        if (Y < M) $();
        if (j = J[M], delete J[M], j && !j.lineEmpty && (Q || j.type === "/")) _ = j.leading ? null : j.text
      }
      return _
    }
    return Object.defineProperty({
      next: E,
      peek: $,
      push: z,
      skip: O,
      cmnt: L
    }, "line", {
      get: function () {
        return Z
      }
    })
  }
})
// @from(Ln 295367, Col 4)
XE2 = U((dSZ, JE2) => {
  JE2.exports = nd;
  nd.filename = null;
  nd.defaults = {
    keepCase: !1
  };
  var tN5 = jV0(),
    BE2 = KX1(),
    GE2 = XX1(),
    ZE2 = Xs(),
    eN5 = QX1(),
    YE2 = e4A(),
    Aw5 = dS(),
    Qw5 = GX1(),
    Bw5 = BX1(),
    Gw5 = Is(),
    Zw5 = A6A(),
    TV0 = TF(),
    Yw5 = /^[1-9][0-9]*$/,
    Jw5 = /^-?[1-9][0-9]*$/,
    Xw5 = /^0[x][0-9a-fA-F]+$/,
    Iw5 = /^-?0[x][0-9a-fA-F]+$/,
    Dw5 = /^0[0-7]+$/,
    Ww5 = /^-?0[0-7]+$/,
    Kw5 = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,
    Af = /^[a-zA-Z_][a-zA-Z_0-9]*$/,
    Qf = /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)(?:\.[a-zA-Z_][a-zA-Z_0-9]*)*$/;

  function nd(A, Q, B) {
    if (!(Q instanceof BE2)) B = Q, Q = new BE2;
    if (!B) B = nd.defaults;
    var G = B.preferTrailingComment || !1,
      Z = tN5(A, B.alternateCommentMode || !1),
      Y = Z.next,
      J = Z.push,
      X = Z.peek,
      I = Z.skip,
      D = Z.cmnt,
      W = !0,
      K, V, F, H = "proto2",
      E = Q,
      z = [],
      $ = {},
      O = B.keepCase ? function (DA) {
        return DA
      } : TV0.camelCase;

    function L() {
      z.forEach((DA) => {
        DA._edition = H, Object.keys($).forEach((CA) => {
          if (DA.getOption(CA) !== void 0) return;
          DA.setOption(CA, $[CA], !0)
        })
      })
    }

    function M(DA, CA, FA) {
      var xA = nd.filename;
      if (!FA) nd.filename = null;
      return Error("illegal " + (CA || "token") + " '" + DA + "' (" + (xA ? xA + ", " : "") + "line " + Z.line + ")")
    }

    function _() {
      var DA = [],
        CA;
      do {
        if ((CA = Y()) !== '"' && CA !== "'") throw M(CA);
        DA.push(Y()), I(CA), CA = X()
      } while (CA === '"' || CA === "'");
      return DA.join("")
    }

    function j(DA) {
      var CA = Y();
      switch (CA) {
        case "'":
        case '"':
          return J(CA), _();
        case "true":
        case "TRUE":
          return !0;
        case "false":
        case "FALSE":
          return !1
      }
      try {
        return b(CA, !0)
      } catch (FA) {
        if (DA && Qf.test(CA)) return CA;
        throw M(CA, "value")
      }
    }

    function x(DA, CA) {
      var FA, xA;
      do
        if (CA && ((FA = X()) === '"' || FA === "'")) {
          var mA = _();
          if (DA.push(mA), H >= 2023) throw M(mA, "id")
        } else try {
          DA.push([xA = S(Y()), I("to", !0) ? S(Y()) : xA])
        } catch (J1) {
          if (CA && Qf.test(FA) && H >= 2023) DA.push(FA);
          else throw J1
        }
      while (I(",", !0));
      var G1 = {
        options: void 0
      };
      G1.setOption = function (J1, SA) {
        if (this.options === void 0) this.options = {};
        this.options[J1] = SA
      }, p(G1, function (SA) {
        if (SA === "option") IA(G1, SA), I(";");
        else throw M(SA)
      }, function () {
        wA(G1)
      })
    }

    function b(DA, CA) {
      var FA = 1;
      if (DA.charAt(0) === "-") FA = -1, DA = DA.substring(1);
      switch (DA) {
        case "inf":
        case "INF":
        case "Inf":
          return FA * (1 / 0);
        case "nan":
        case "NAN":
        case "Nan":
        case "NaN":
          return NaN;
        case "0":
          return 0
      }
      if (Yw5.test(DA)) return FA * parseInt(DA, 10);
      if (Xw5.test(DA)) return FA * parseInt(DA, 16);
      if (Dw5.test(DA)) return FA * parseInt(DA, 8);
      if (Kw5.test(DA)) return FA * parseFloat(DA);
      throw M(DA, "number", CA)
    }

    function S(DA, CA) {
      switch (DA) {
        case "max":
        case "MAX":
        case "Max":
          return 536870911;
        case "0":
          return 0
      }
      if (!CA && DA.charAt(0) === "-") throw M(DA, "id");
      if (Jw5.test(DA)) return parseInt(DA, 10);
      if (Iw5.test(DA)) return parseInt(DA, 16);
      if (Ww5.test(DA)) return parseInt(DA, 8);
      throw M(DA, "id")
    }

    function u() {
      if (K !== void 0) throw M("package");
      if (K = Y(), !Qf.test(K)) throw M(K, "name");
      E = E.define(K), I(";")
    }

    function f() {
      var DA = X(),
        CA;
      switch (DA) {
        case "weak":
          CA = F || (F = []), Y();
          break;
        case "public":
          Y();
        default:
          CA = V || (V = []);
          break
      }
      DA = _(), I(";"), CA.push(DA)
    }

    function AA() {
      if (I("="), H = _(), H < 2023) throw M(H, "syntax");
      I(";")
    }

    function n() {
      if (I("="), H = _(), !["2023"].includes(H)) throw M(H, "edition");
      I(";")
    }

    function y(DA, CA) {
      switch (CA) {
        case "option":
          return IA(DA, CA), I(";"), !0;
        case "message":
          return GA(DA, CA), !0;
        case "enum":
          return jA(DA, CA), !0;
        case "service":
          return _A(DA, CA), !0;
        case "extend":
          return t(DA, CA), !0
      }
      return !1
    }

    function p(DA, CA, FA) {
      var xA = Z.line;
      if (DA) {
        if (typeof DA.comment !== "string") DA.comment = D();
        DA.filename = nd.filename
      }
      if (I("{", !0)) {
        var mA;
        while ((mA = Y()) !== "}") CA(mA);
        I(";", !0)
      } else {
        if (FA) FA();
        if (I(";"), DA && (typeof DA.comment !== "string" || G)) DA.comment = D(xA) || DA.comment
      }
    }

    function GA(DA, CA) {
      if (!Af.test(CA = Y())) throw M(CA, "type name");
      var FA = new GE2(CA);
      if (p(FA, function (mA) {
          if (y(FA, mA)) return;
          switch (mA) {
            case "map":
              TA(FA, mA);
              break;
            case "required":
              if (H !== "proto2") throw M(mA);
            case "repeated":
              WA(FA, mA);
              break;
            case "optional":
              if (H === "proto3") WA(FA, "proto3_optional");
              else if (H !== "proto2") throw M(mA);
              else WA(FA, "optional");
              break;
            case "oneof":
              bA(FA, mA);
              break;
            case "extensions":
              x(FA.extensions || (FA.extensions = []));
              break;
            case "reserved":
              x(FA.reserved || (FA.reserved = []), !0);
              break;
            default:
              if (H === "proto2" || !Qf.test(mA)) throw M(mA);
              J(mA), WA(FA, "optional");
              break
          }
        }), DA.add(FA), DA === E) z.push(FA)
    }

    function WA(DA, CA, FA) {
      var xA = Y();
      if (xA === "group") {
        MA(DA, CA);
        return
      }
      while (xA.endsWith(".") || X().startsWith(".")) xA += Y();
      if (!Qf.test(xA)) throw M(xA, "type");
      var mA = Y();
      if (!Af.test(mA)) throw M(mA, "name");
      mA = O(mA), I("=");
      var G1 = new ZE2(mA, S(Y()), xA, CA, FA);
      if (p(G1, function (A1) {
          if (A1 === "option") IA(G1, A1), I(";");
          else throw M(A1)
        }, function () {
          wA(G1)
        }), CA === "proto3_optional") {
        var J1 = new YE2("_" + mA);
        G1.setOption("proto3_optional", !0), J1.add(G1), DA.add(J1)
      } else DA.add(G1);
      if (DA === E) z.push(G1)
    }

    function MA(DA, CA) {
      if (H >= 2023) throw M("group");
      var FA = Y();
      if (!Af.test(FA)) throw M(FA, "name");
      var xA = TV0.lcFirst(FA);
      if (FA === xA) FA = TV0.ucFirst(FA);
      I("=");
      var mA = S(Y()),
        G1 = new GE2(FA);
      G1.group = !0;
      var J1 = new ZE2(xA, mA, FA, CA);
      J1.filename = nd.filename, p(G1, function (A1) {
        switch (A1) {
          case "option":
            IA(G1, A1), I(";");
            break;
          case "required":
          case "repeated":
            WA(G1, A1);
            break;
          case "optional":
            if (H === "proto3") WA(G1, "proto3_optional");
            else WA(G1, "optional");
            break;
          case "message":
            GA(G1, A1);
            break;
          case "enum":
            jA(G1, A1);
            break;
          case "reserved":
            x(G1.reserved || (G1.reserved = []), !0);
            break;
          default:
            throw M(A1)
        }
      }), DA.add(G1).add(J1)
    }

    function TA(DA) {
      I("<");
      var CA = Y();
      if (Zw5.mapKey[CA] === void 0) throw M(CA, "type");
      I(",");
      var FA = Y();
      if (!Qf.test(FA)) throw M(FA, "type");
      I(">");
      var xA = Y();
      if (!Af.test(xA)) throw M(xA, "name");
      I("=");
      var mA = new eN5(O(xA), S(Y()), CA, FA);
      p(mA, function (J1) {
        if (J1 === "option") IA(mA, J1), I(";");
        else throw M(J1)
      }, function () {
        wA(mA)
      }), DA.add(mA)
    }

    function bA(DA, CA) {
      if (!Af.test(CA = Y())) throw M(CA, "name");
      var FA = new YE2(O(CA));
      p(FA, function (mA) {
        if (mA === "option") IA(FA, mA), I(";");
        else J(mA), WA(FA, "optional")
      }), DA.add(FA)
    }

    function jA(DA, CA) {
      if (!Af.test(CA = Y())) throw M(CA, "name");
      var FA = new Aw5(CA);
      if (p(FA, function (mA) {
          switch (mA) {
            case "option":
              IA(FA, mA), I(";");
              break;
            case "reserved":
              if (x(FA.reserved || (FA.reserved = []), !0), FA.reserved === void 0) FA.reserved = [];
              break;
            default:
              OA(FA, mA)
          }
        }), DA.add(FA), DA === E) z.push(FA)
    }

    function OA(DA, CA) {
      if (!Af.test(CA)) throw M(CA, "name");
      I("=");
      var FA = S(Y(), !0),
        xA = {
          options: void 0
        };
      xA.getOption = function (mA) {
        return this.options[mA]
      }, xA.setOption = function (mA, G1) {
        Gw5.prototype.setOption.call(xA, mA, G1)
      }, xA.setParsedOption = function () {
        return
      }, p(xA, function (G1) {
        if (G1 === "option") IA(xA, G1), I(";");
        else throw M(G1)
      }, function () {
        wA(xA)
      }), DA.add(CA, FA, xA.comment, xA.parsedOptions || xA.options)
    }

    function IA(DA, CA) {
      var FA, xA, mA = !0;
      if (CA === "option") CA = Y();
      while (CA !== "=") {
        if (CA === "(") {
          var G1 = Y();
          I(")"), CA = "(" + G1 + ")"
        }
        if (mA) {
          if (mA = !1, CA.includes(".") && !CA.includes("(")) {
            var J1 = CA.split(".");
            FA = J1[0] + ".", CA = J1[1];
            continue
          }
          FA = CA
        } else xA = xA ? xA += CA : CA;
        CA = Y()
      }
      var SA = xA ? FA.concat(xA) : FA,
        A1 = HA(DA, SA);
      xA = xA && xA[0] === "." ? xA.slice(1) : xA, FA = FA && FA[FA.length - 1] === "." ? FA.slice(0, -1) : FA, zA(DA, FA, A1, xA)
    }

    function HA(DA, CA) {
      if (I("{", !0)) {
        var FA = {};
        while (!I("}", !0)) {
          if (!Af.test(BA = Y())) throw M(BA, "name");
          if (BA === null) throw M(BA, "end of input");
          var xA, mA = BA;
          if (I(":", !0), X() === "{") xA = HA(DA, CA + "." + BA);
          else if (X() === "[") {
            xA = [];
            var G1;
            if (I("[", !0)) {
              do G1 = j(!0), xA.push(G1); while (I(",", !0));
              if (I("]"), typeof G1 < "u") ZA(DA, CA + "." + BA, G1)
            }
          } else xA = j(!0), ZA(DA, CA + "." + BA, xA);
          var J1 = FA[mA];
          if (J1) xA = [].concat(J1).concat(xA);
          FA[mA] = xA, I(",", !0), I(";", !0)
        }
        return FA
      }
      var SA = j(!0);
      return ZA(DA, CA, SA), SA
    }

    function ZA(DA, CA, FA) {
      if (E === DA && /^features\./.test(CA)) {
        $[CA] = FA;
        return
      }
      if (DA.setOption) DA.setOption(CA, FA)
    }

    function zA(DA, CA, FA, xA) {
      if (DA.setParsedOption) DA.setParsedOption(CA, FA, xA)
    }

    function wA(DA) {
      if (I("[", !0)) {
        do IA(DA, "option"); while (I(",", !0));
        I("]")
      }
      return DA
    }

    function _A(DA, CA) {
      if (!Af.test(CA = Y())) throw M(CA, "service name");
      var FA = new Qw5(CA);
      if (p(FA, function (mA) {
          if (y(FA, mA)) return;
          if (mA === "rpc") s(FA, mA);
          else throw M(mA)
        }), DA.add(FA), DA === E) z.push(FA)
    }

    function s(DA, CA) {
      var FA = D(),
        xA = CA;
      if (!Af.test(CA = Y())) throw M(CA, "name");
      var mA = CA,
        G1, J1, SA, A1;
      if (I("("), I("stream", !0)) J1 = !0;
      if (!Qf.test(CA = Y())) throw M(CA);
      if (G1 = CA, I(")"), I("returns"), I("("), I("stream", !0)) A1 = !0;
      if (!Qf.test(CA = Y())) throw M(CA);
      SA = CA, I(")");
      var n1 = new Bw5(mA, xA, G1, SA, J1, A1);
      n1.comment = FA, p(n1, function (L0) {
        if (L0 === "option") IA(n1, L0), I(";");
        else throw M(L0)
      }), DA.add(n1)
    }

    function t(DA, CA) {
      if (!Qf.test(CA = Y())) throw M(CA, "reference");
      var FA = CA;
      p(null, function (mA) {
        switch (mA) {
          case "required":
          case "repeated":
            WA(DA, mA, FA);
            break;
          case "optional":
            if (H === "proto3") WA(DA, "proto3_optional", FA);
            else WA(DA, "optional", FA);
            break;
          default:
            if (H === "proto2" || !Qf.test(mA)) throw M(mA);
            J(mA), WA(DA, "optional", FA);
            break
        }
      })
    }
    var BA;
    while ((BA = Y()) !== null) switch (BA) {
      case "package":
        if (!W) throw M(BA);
        u();
        break;
      case "import":
        if (!W) throw M(BA);
        f();
        break;
      case "syntax":
        if (!W) throw M(BA);
        AA();
        break;
      case "edition":
        if (!W) throw M(BA);
        n();
        break;
      case "option":
        IA(E, BA), I(";", !0);
        break;
      default:
        if (y(E, BA)) {
          W = !1;
          continue
        }
        throw M(BA)
    }
    return L(), nd.filename = null, {
      package: K,
      imports: V,
      weakImports: F,
      root: Q
    }
  }
})
// @from(Ln 295909, Col 4)
WE2 = U((cSZ, DE2) => {
  DE2.exports = pS;
  var Vw5 = /\/|\./;

  function pS(A, Q) {
    if (!Vw5.test(A)) A = "google/protobuf/" + A + ".proto", Q = {
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
    pS[A] = Q
  }
  pS("any", {
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
  var IE2;
  pS("duration", {
    Duration: IE2 = {
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
  pS("timestamp", {
    Timestamp: IE2
  });
  pS("empty", {
    Empty: {
      fields: {}
    }
  });
  pS("struct", {
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
  pS("wrappers", {
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
  pS("field_mask", {
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
  pS.get = function (Q) {
    return pS[Q] || null
  }
})
// @from(Ln 296111, Col 4)
zX1 = U((pSZ, KE2) => {
  var Ws = KE2.exports = tH2();
  Ws.build = "full";
  Ws.tokenize = jV0();
  Ws.parse = XE2();
  Ws.common = WE2();
  Ws.Root._configure(Ws.Type, Ws.parse, Ws.common)
})
// @from(Ln 296119, Col 4)
PV0 = U((lSZ, Fw5) => {
  Fw5.exports = {
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
// @from(Ln 297414, Col 4)
CE2 = U((V8, $E2) => {
  var qO = zX1();
  $E2.exports = V8 = qO.descriptor = qO.Root.fromJSON(PV0()).lookup(".google.protobuf");
  var {
    Namespace: VE2,
    Root: RvA,
    Enum: ad,
    Type: Bf,
    Field: Ks,
    MapField: Hw5,
    OneOf: $X1,
    Service: _vA,
    Method: CX1
  } = qO;
  RvA.fromDescriptor = function (Q) {
    if (typeof Q.length === "number") Q = V8.FileDescriptorSet.decode(Q);
    var B = new RvA;
    if (Q.file) {
      var G, Z;
      for (var Y = 0, J; Y < Q.file.length; ++Y) {
        if (Z = B, (G = Q.file[Y]).package && G.package.length) Z = B.define(G.package);
        var X = Ow5(G);
        if (G.name && G.name.length) B.files.push(Z.filename = G.name);
        if (G.messageType)
          for (J = 0; J < G.messageType.length; ++J) Z.add(Bf.fromDescriptor(G.messageType[J], X));
        if (G.enumType)
          for (J = 0; J < G.enumType.length; ++J) Z.add(ad.fromDescriptor(G.enumType[J], X));
        if (G.extension)
          for (J = 0; J < G.extension.length; ++J) Z.add(Ks.fromDescriptor(G.extension[J], X));
        if (G.service)
          for (J = 0; J < G.service.length; ++J) Z.add(_vA.fromDescriptor(G.service[J], X));
        var I = LFA(G.options, V8.FileOptions);
        if (I) {
          var D = Object.keys(I);
          for (J = 0; J < D.length; ++J) Z.setOption(D[J], I[D[J]])
        }
      }
    }
    return B.resolveAll()
  };
  RvA.prototype.toDescriptor = function (Q) {
    var B = V8.FileDescriptorSet.create();
    return FE2(this, B.file, Q), B
  };

  function FE2(A, Q, B) {
    var G = V8.FileDescriptorProto.create({
      name: A.filename || (A.fullName.substring(1).replace(/\./g, "_") || "root") + ".proto"
    });
    if (Mw5(B, G), !(A instanceof RvA)) G.package = A.fullName.substring(1);
    for (var Z = 0, Y; Z < A.nestedArray.length; ++Z)
      if ((Y = A._nestedArray[Z]) instanceof Bf) G.messageType.push(Y.toDescriptor(B));
      else if (Y instanceof ad) G.enumType.push(Y.toDescriptor());
    else if (Y instanceof Ks) G.extension.push(Y.toDescriptor(B));
    else if (Y instanceof _vA) G.service.push(Y.toDescriptor());
    else if (Y instanceof VE2) FE2(Y, Q, B);
    if (G.options = OFA(A.options, V8.FileOptions), G.messageType.length + G.enumType.length + G.extension.length + G.service.length) Q.push(G)
  }
  var Ew5 = 0;
  Bf.fromDescriptor = function (Q, B, G) {
    if (typeof Q.length === "number") Q = V8.DescriptorProto.decode(Q);
    var Z = new Bf(Q.name.length ? Q.name : "Type" + Ew5++, LFA(Q.options, V8.MessageOptions)),
      Y;
    if (!G) Z._edition = B;
    if (Q.oneofDecl)
      for (Y = 0; Y < Q.oneofDecl.length; ++Y) Z.add($X1.fromDescriptor(Q.oneofDecl[Y]));
    if (Q.field)
      for (Y = 0; Y < Q.field.length; ++Y) {
        var J = Ks.fromDescriptor(Q.field[Y], B, !0);
        if (Z.add(J), Q.field[Y].hasOwnProperty("oneofIndex")) Z.oneofsArray[Q.field[Y].oneofIndex].add(J)
      }
    if (Q.extension)
      for (Y = 0; Y < Q.extension.length; ++Y) Z.add(Ks.fromDescriptor(Q.extension[Y], B, !0));
    if (Q.nestedType) {
      for (Y = 0; Y < Q.nestedType.length; ++Y)
        if (Z.add(Bf.fromDescriptor(Q.nestedType[Y], B, !0)), Q.nestedType[Y].options && Q.nestedType[Y].options.mapEntry) Z.setOption("map_entry", !0)
    }
    if (Q.enumType)
      for (Y = 0; Y < Q.enumType.length; ++Y) Z.add(ad.fromDescriptor(Q.enumType[Y], B, !0));
    if (Q.extensionRange && Q.extensionRange.length) {
      Z.extensions = [];
      for (Y = 0; Y < Q.extensionRange.length; ++Y) Z.extensions.push([Q.extensionRange[Y].start, Q.extensionRange[Y].end])
    }
    if (Q.reservedRange && Q.reservedRange.length || Q.reservedName && Q.reservedName.length) {
      if (Z.reserved = [], Q.reservedRange)
        for (Y = 0; Y < Q.reservedRange.length; ++Y) Z.reserved.push([Q.reservedRange[Y].start, Q.reservedRange[Y].end]);
      if (Q.reservedName)
        for (Y = 0; Y < Q.reservedName.length; ++Y) Z.reserved.push(Q.reservedName[Y])
    }
    return Z
  };
  Bf.prototype.toDescriptor = function (Q) {
    var B = V8.DescriptorProto.create({
        name: this.name
      }),
      G;
    for (G = 0; G < this.fieldsArray.length; ++G) {
      var Z;
      if (B.field.push(Z = this._fieldsArray[G].toDescriptor(Q)), this._fieldsArray[G] instanceof Hw5) {
        var Y = SV0(this._fieldsArray[G].keyType, this._fieldsArray[G].resolvedKeyType, !1),
          J = SV0(this._fieldsArray[G].type, this._fieldsArray[G].resolvedType, !1),
          X = J === 11 || J === 14 ? this._fieldsArray[G].resolvedType && zE2(this.parent, this._fieldsArray[G].resolvedType) || this._fieldsArray[G].type : void 0;
        B.nestedType.push(V8.DescriptorProto.create({
          name: Z.typeName,
          field: [V8.FieldDescriptorProto.create({
            name: "key",
            number: 1,
            label: 1,
            type: Y
          }), V8.FieldDescriptorProto.create({
            name: "value",
            number: 2,
            label: 1,
            type: J,
            typeName: X
          })],
          options: V8.MessageOptions.create({
            mapEntry: !0
          })
        }))
      }
    }
    for (G = 0; G < this.oneofsArray.length; ++G) B.oneofDecl.push(this._oneofsArray[G].toDescriptor());
    for (G = 0; G < this.nestedArray.length; ++G)
      if (this._nestedArray[G] instanceof Ks) B.field.push(this._nestedArray[G].toDescriptor(Q));
      else if (this._nestedArray[G] instanceof Bf) B.nestedType.push(this._nestedArray[G].toDescriptor(Q));
    else if (this._nestedArray[G] instanceof ad) B.enumType.push(this._nestedArray[G].toDescriptor());
    if (this.extensions)
      for (G = 0; G < this.extensions.length; ++G) B.extensionRange.push(V8.DescriptorProto.ExtensionRange.create({
        start: this.extensions[G][0],
        end: this.extensions[G][1]
      }));
    if (this.reserved)
      for (G = 0; G < this.reserved.length; ++G)
        if (typeof this.reserved[G] === "string") B.reservedName.push(this.reserved[G]);
        else B.reservedRange.push(V8.DescriptorProto.ReservedRange.create({
          start: this.reserved[G][0],
          end: this.reserved[G][1]
        }));
    return B.options = OFA(this.options, V8.MessageOptions), B
  };
  var zw5 = /^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/;
  Ks.fromDescriptor = function (Q, B, G) {
    if (typeof Q.length === "number") Q = V8.DescriptorProto.decode(Q);
    if (typeof Q.number !== "number") throw Error("missing field id");
    var Z;
    if (Q.typeName && Q.typeName.length) Z = Q.typeName;
    else Z = Nw5(Q.type);
    var Y;
    switch (Q.label) {
      case 1:
        Y = void 0;
        break;
      case 2:
        Y = "required";
        break;
      case 3:
        Y = "repeated";
        break;
      default:
        throw Error("illegal label: " + Q.label)
    }
    var J = Q.extendee;
    if (Q.extendee !== void 0) J = J.length ? J : void 0;
    var X = new Ks(Q.name.length ? Q.name : "field" + Q.number, Q.number, Z, Y, J);
    if (!G) X._edition = B;
    if (X.options = LFA(Q.options, V8.FieldOptions), Q.proto3_optional) X.options.proto3_optional = !0;
    if (Q.defaultValue && Q.defaultValue.length) {
      var I = Q.defaultValue;
      switch (I) {
        case "true":
        case "TRUE":
          I = !0;
          break;
        case "false":
        case "FALSE":
          I = !1;
          break;
        default:
          var D = zw5.exec(I);
          if (D) I = parseInt(I);
          break
      }
      X.setOption("default", I)
    }
    if (ww5(Q.type)) {
      if (B === "proto3") {
        if (Q.options && !Q.options.packed) X.setOption("packed", !1)
      } else if ((!B || B === "proto2") && Q.options && Q.options.packed) X.setOption("packed", !0)
    }
    return X
  };
  Ks.prototype.toDescriptor = function (Q) {
    var B = V8.FieldDescriptorProto.create({
      name: this.name,
      number: this.id
    });
    if (this.map) B.type = 11, B.typeName = qO.util.ucFirst(this.name), B.label = 3;
    else {
      switch (B.type = SV0(this.type, this.resolve().resolvedType, this.delimited)) {
        case 10:
        case 11:
        case 14:
          B.typeName = this.resolvedType ? zE2(this.parent, this.resolvedType) : this.type;
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
      if (B.options = OFA(this.options, V8.FieldOptions), this.options.default != null) B.defaultValue = String(this.options.default);
      if (this.options.proto3_optional) B.proto3_optional = !0
    }
    if (Q === "proto3") {
      if (!this.packed)(B.options || (B.options = V8.FieldOptions.create())).packed = !1
    } else if ((!Q || Q === "proto2") && this.packed)(B.options || (B.options = V8.FieldOptions.create())).packed = !0;
    return B
  };
  var $w5 = 0;
  ad.fromDescriptor = function (Q, B, G) {
    if (typeof Q.length === "number") Q = V8.EnumDescriptorProto.decode(Q);
    var Z = {};
    if (Q.value)
      for (var Y = 0; Y < Q.value.length; ++Y) {
        var J = Q.value[Y].name,
          X = Q.value[Y].number || 0;
        Z[J && J.length ? J : "NAME" + X] = X
      }
    var I = new ad(Q.name && Q.name.length ? Q.name : "Enum" + $w5++, Z, LFA(Q.options, V8.EnumOptions));
    if (!G) I._edition = B;
    return I
  };
  ad.prototype.toDescriptor = function () {
    var Q = [];
    for (var B = 0, G = Object.keys(this.values); B < G.length; ++B) Q.push(V8.EnumValueDescriptorProto.create({
      name: G[B],
      number: this.values[G[B]]
    }));
    return V8.EnumDescriptorProto.create({
      name: this.name,
      value: Q,
      options: OFA(this.options, V8.EnumOptions)
    })
  };
  var Cw5 = 0;
  $X1.fromDescriptor = function (Q) {
    if (typeof Q.length === "number") Q = V8.OneofDescriptorProto.decode(Q);
    return new $X1(Q.name && Q.name.length ? Q.name : "oneof" + Cw5++)
  };
  $X1.prototype.toDescriptor = function () {
    return V8.OneofDescriptorProto.create({
      name: this.name
    })
  };
  var Uw5 = 0;
  _vA.fromDescriptor = function (Q, B, G) {
    if (typeof Q.length === "number") Q = V8.ServiceDescriptorProto.decode(Q);
    var Z = new _vA(Q.name && Q.name.length ? Q.name : "Service" + Uw5++, LFA(Q.options, V8.ServiceOptions));
    if (!G) Z._edition = B;
    if (Q.method)
      for (var Y = 0; Y < Q.method.length; ++Y) Z.add(CX1.fromDescriptor(Q.method[Y]));
    return Z
  };
  _vA.prototype.toDescriptor = function () {
    var Q = [];
    for (var B = 0; B < this.methodsArray.length; ++B) Q.push(this._methodsArray[B].toDescriptor());
    return V8.ServiceDescriptorProto.create({
      name: this.name,
      method: Q,
      options: OFA(this.options, V8.ServiceOptions)
    })
  };
  var qw5 = 0;
  CX1.fromDescriptor = function (Q) {
    if (typeof Q.length === "number") Q = V8.MethodDescriptorProto.decode(Q);
    return new CX1(Q.name && Q.name.length ? Q.name : "Method" + qw5++, "rpc", Q.inputType, Q.outputType, Boolean(Q.clientStreaming), Boolean(Q.serverStreaming), LFA(Q.options, V8.MethodOptions))
  };
  CX1.prototype.toDescriptor = function () {
    return V8.MethodDescriptorProto.create({
      name: this.name,
      inputType: this.resolvedRequestType ? this.resolvedRequestType.fullName : this.requestType,
      outputType: this.resolvedResponseType ? this.resolvedResponseType.fullName : this.responseType,
      clientStreaming: this.requestStream,
      serverStreaming: this.responseStream,
      options: OFA(this.options, V8.MethodOptions)
    })
  };

  function Nw5(A) {
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

  function ww5(A) {
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

  function SV0(A, Q, B) {
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
    if (Q instanceof ad) return 14;
    if (Q instanceof Bf) return B ? 10 : 11;
    throw Error("illegal type: " + A)
  }

  function HE2(A, Q) {
    var B = {};
    for (var G = 0, Z, Y; G < Q.fieldsArray.length; ++G) {
      if ((Y = (Z = Q._fieldsArray[G]).name) === "uninterpretedOption") continue;
      if (!Object.prototype.hasOwnProperty.call(A, Y)) continue;
      var J = Lw5(Y);
      if (Z.resolvedType instanceof Bf) B[J] = HE2(A[Y], Z.resolvedType);
      else if (Z.resolvedType instanceof ad) B[J] = Z.resolvedType.valuesById[A[Y]];
      else B[J] = A[Y]
    }
    return B
  }

  function LFA(A, Q) {
    if (!A) return;
    return HE2(Q.toObject(A), Q)
  }

  function EE2(A, Q) {
    var B = {},
      G = Object.keys(A);
    for (var Z = 0; Z < G.length; ++Z) {
      var Y = G[Z],
        J = qO.util.camelCase(Y);
      if (!Object.prototype.hasOwnProperty.call(Q.fields, J)) continue;
      var X = Q.fields[J];
      if (X.resolvedType instanceof Bf) B[J] = EE2(A[Y], X.resolvedType);
      else B[J] = A[Y];
      if (X.repeated && !Array.isArray(B[J])) B[J] = [B[J]]
    }
    return B
  }

  function OFA(A, Q) {
    if (!A) return;
    return Q.fromObject(EE2(A, Q))
  }

  function zE2(A, Q) {
    var B = A.fullName.split("."),
      G = Q.fullName.split("."),
      Z = 0,
      Y = 0,
      J = G.length - 1;
    if (!(A instanceof RvA) && Q instanceof VE2)
      while (Z < B.length && Y < J && B[Z] === G[Y]) {
        var X = Q.lookup(B[Z++], !0);
        if (X !== null && X !== Q) break;
        ++Y
      } else
        for (; Z < B.length && Y < J && B[Z] === G[Y]; ++Z, ++Y);
    return G.slice(Y).join(".")
  }

  function Lw5(A) {
    return A.substring(0, 1) + A.substring(1).replace(/([A-Z])(?=[a-z]|$)/g, function (Q, B) {
      return "_" + B.toLowerCase()
    })
  }

  function Ow5(A) {
    if (A.syntax === "editions") switch (A.edition) {
      case V8.Edition.EDITION_2023:
        return "2023";
      default:
        throw Error("Unsupported edition " + A.edition)
    }
    if (A.syntax === "proto3") return "proto3";
    return "proto2"
  }

  function Mw5(A, Q) {
    if (!A) return;
    if (A === "proto2" || A === "proto3") Q.syntax = A;
    else switch (Q.syntax = "editions", A) {
      case "2023":
        Q.edition = V8.Edition.EDITION_2023;
        break;
      default:
        throw Error("Unsupported edition " + A)
    }
  }
})