
// @from(Start 10802909, End 10805977)
Fz2 = z((HpG, mR5) => {
  mR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              Api: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  methods: {
                    rule: "repeated",
                    type: "Method",
                    id: 2
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  },
                  version: {
                    type: "string",
                    id: 4
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 5
                  },
                  mixins: {
                    rule: "repeated",
                    type: "Mixin",
                    id: 6
                  },
                  syntax: {
                    type: "Syntax",
                    id: 7
                  }
                }
              },
              Method: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  requestTypeUrl: {
                    type: "string",
                    id: 2
                  },
                  requestStreaming: {
                    type: "bool",
                    id: 3
                  },
                  responseTypeUrl: {
                    type: "string",
                    id: 4
                  },
                  responseStreaming: {
                    type: "bool",
                    id: 5
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 6
                  },
                  syntax: {
                    type: "Syntax",
                    id: 7
                  }
                }
              },
              Mixin: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  root: {
                    type: "string",
                    id: 2
                  }
                }
              },
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              },
              Option: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "Any",
                    id: 2
                  }
                }
              },
              Syntax: {
                values: {
                  SYNTAX_PROTO2: 0,
                  SYNTAX_PROTO3: 1
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10805983, End 10806376)
Kz2 = z((CpG, dR5) => {
  dR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10806382, End 10812007)
Dz2 = z((EpG, cR5) => {
  cR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              Type: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  fields: {
                    rule: "repeated",
                    type: "Field",
                    id: 2
                  },
                  oneofs: {
                    rule: "repeated",
                    type: "string",
                    id: 3
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 4
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 5
                  },
                  syntax: {
                    type: "Syntax",
                    id: 6
                  }
                }
              },
              Field: {
                fields: {
                  kind: {
                    type: "Kind",
                    id: 1
                  },
                  cardinality: {
                    type: "Cardinality",
                    id: 2
                  },
                  number: {
                    type: "int32",
                    id: 3
                  },
                  name: {
                    type: "string",
                    id: 4
                  },
                  typeUrl: {
                    type: "string",
                    id: 6
                  },
                  oneofIndex: {
                    type: "int32",
                    id: 7
                  },
                  packed: {
                    type: "bool",
                    id: 8
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 9
                  },
                  jsonName: {
                    type: "string",
                    id: 10
                  },
                  defaultValue: {
                    type: "string",
                    id: 11
                  }
                },
                nested: {
                  Kind: {
                    values: {
                      TYPE_UNKNOWN: 0,
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
                  Cardinality: {
                    values: {
                      CARDINALITY_UNKNOWN: 0,
                      CARDINALITY_OPTIONAL: 1,
                      CARDINALITY_REQUIRED: 2,
                      CARDINALITY_REPEATED: 3
                    }
                  }
                }
              },
              Enum: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  enumvalue: {
                    rule: "repeated",
                    type: "EnumValue",
                    id: 2
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 4
                  },
                  syntax: {
                    type: "Syntax",
                    id: 5
                  }
                }
              },
              EnumValue: {
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
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  }
                }
              },
              Option: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "Any",
                    id: 2
                  }
                }
              },
              Syntax: {
                values: {
                  SYNTAX_PROTO2: 0,
                  SYNTAX_PROTO3: 1
                }
              },
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
              },
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10812013, End 10813707)
$z2 = z((zz2) => {
  Object.defineProperty(zz2, "__esModule", {
    value: !0
  });
  zz2.addCommonProtos = zz2.loadProtosWithOptionsSync = zz2.loadProtosWithOptions = void 0;
  var Hz2 = UA("fs"),
    Cz2 = UA("path"),
    KJA = Z81();

  function Ez2(A, Q) {
    let B = A.resolvePath;
    A.resolvePath = (G, Z) => {
      if (Cz2.isAbsolute(Z)) return Z;
      for (let I of Q) {
        let Y = Cz2.join(I, Z);
        try {
          return Hz2.accessSync(Y, Hz2.constants.R_OK), Y
        } catch (J) {
          continue
        }
      }
      return process.emitWarning(`${Z} not found in any of the include paths ${Q}`), B(G, Z)
    }
  }
  async function pR5(A, Q) {
    let B = new KJA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
      Ez2(B, Q.includeDirs)
    }
    let G = await B.load(A, Q);
    return G.resolveAll(), G
  }
  zz2.loadProtosWithOptions = pR5;

  function lR5(A, Q) {
    let B = new KJA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) throw Error("The includeDirs option must be an array");
      Ez2(B, Q.includeDirs)
    }
    let G = B.loadSync(A, Q);
    return G.resolveAll(), G
  }
  zz2.loadProtosWithOptionsSync = lR5;

  function iR5() {
    let A = Fz2(),
      Q = Y90(),
      B = Kz2(),
      G = Dz2();
    KJA.common("api", A.nested.google.nested.protobuf.nested), KJA.common("descriptor", Q.nested.google.nested.protobuf.nested), KJA.common("source_context", B.nested.google.nested.protobuf.nested), KJA.common("type", G.nested.google.nested.protobuf.nested)
  }
  zz2.addCommonProtos = iR5
})
// @from(Start 10813713, End 10830625)
wz2 = z((vOA, W90) => {
  (function(A, Q) {
    function B(G) {
      return "default" in G ? G.default : G
    }
    if (typeof define === "function" && define.amd) define([], function() {
      var G = {};
      return Q(G), B(G)
    });
    else if (typeof vOA === "object") {
      if (Q(vOA), typeof W90 === "object") W90.exports = B(vOA)
    } else(function() {
      var G = {};
      Q(G), A.Long = B(G)
    })()
  })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : vOA, function(A) {
    Object.defineProperty(A, "__esModule", {
      value: !0
    }), A.default = void 0;
    var Q = null;
    try {
      Q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
    } catch {}

    function B(l, k, m) {
      this.low = l | 0, this.high = k | 0, this.unsigned = !!m
    }
    B.prototype.__isLong__, Object.defineProperty(B.prototype, "__isLong__", {
      value: !0
    });

    function G(l) {
      return (l && l.__isLong__) === !0
    }

    function Z(l) {
      var k = Math.clz32(l & -l);
      return l ? 31 - k : k
    }
    B.isLong = G;
    var I = {},
      Y = {};

    function J(l, k) {
      var m, o, IA;
      if (k) {
        if (l >>>= 0, IA = 0 <= l && l < 256) {
          if (o = Y[l], o) return o
        }
        if (m = X(l, 0, !0), IA) Y[l] = m;
        return m
      } else {
        if (l |= 0, IA = -128 <= l && l < 128) {
          if (o = I[l], o) return o
        }
        if (m = X(l, l < 0 ? -1 : 0, !1), IA) I[l] = m;
        return m
      }
    }
    B.fromInt = J;

    function W(l, k) {
      if (isNaN(l)) return k ? N : w;
      if (k) {
        if (l < 0) return N;
        if (l >= E) return x
      } else {
        if (l <= -U) return p;
        if (l + 1 >= U) return v
      }
      if (l < 0) return W(-l, k).neg();
      return X(l % C | 0, l / C | 0, k)
    }
    B.fromNumber = W;

    function X(l, k, m) {
      return new B(l, k, m)
    }
    B.fromBits = X;
    var V = Math.pow;

    function F(l, k, m) {
      if (l.length === 0) throw Error("empty string");
      if (typeof k === "number") m = k, k = !1;
      else k = !!k;
      if (l === "NaN" || l === "Infinity" || l === "+Infinity" || l === "-Infinity") return k ? N : w;
      if (m = m || 10, m < 2 || 36 < m) throw RangeError("radix");
      var o;
      if ((o = l.indexOf("-")) > 0) throw Error("interior hyphen");
      else if (o === 0) return F(l.substring(1), k, m).neg();
      var IA = W(V(m, 8)),
        FA = w;
      for (var zA = 0; zA < l.length; zA += 8) {
        var NA = Math.min(8, l.length - zA),
          OA = parseInt(l.substring(zA, zA + NA), m);
        if (NA < 8) {
          var mA = W(V(m, NA));
          FA = FA.mul(mA).add(W(OA))
        } else FA = FA.mul(IA), FA = FA.add(W(OA))
      }
      return FA.unsigned = k, FA
    }
    B.fromString = F;

    function K(l, k) {
      if (typeof l === "number") return W(l, k);
      if (typeof l === "string") return F(l, k);
      return X(l.low, l.high, typeof k === "boolean" ? k : l.unsigned)
    }
    B.fromValue = K;
    var D = 65536,
      H = 16777216,
      C = D * D,
      E = C * C,
      U = E / 2,
      q = J(H),
      w = J(0);
    B.ZERO = w;
    var N = J(0, !0);
    B.UZERO = N;
    var R = J(1);
    B.ONE = R;
    var T = J(1, !0);
    B.UONE = T;
    var y = J(-1);
    B.NEG_ONE = y;
    var v = X(-1, 2147483647, !1);
    B.MAX_VALUE = v;
    var x = X(-1, -1, !0);
    B.MAX_UNSIGNED_VALUE = x;
    var p = X(0, -2147483648, !1);
    B.MIN_VALUE = p;
    var u = B.prototype;
    if (u.toInt = function() {
        return this.unsigned ? this.low >>> 0 : this.low
      }, u.toNumber = function() {
        if (this.unsigned) return (this.high >>> 0) * C + (this.low >>> 0);
        return this.high * C + (this.low >>> 0)
      }, u.toString = function(k) {
        if (k = k || 10, k < 2 || 36 < k) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative())
          if (this.eq(p)) {
            var m = W(k),
              o = this.div(m),
              IA = o.mul(m).sub(this);
            return o.toString(k) + IA.toInt().toString(k)
          } else return "-" + this.neg().toString(k);
        var FA = W(V(k, 6), this.unsigned),
          zA = this,
          NA = "";
        while (!0) {
          var OA = zA.div(FA),
            mA = zA.sub(OA.mul(FA)).toInt() >>> 0,
            wA = mA.toString(k);
          if (zA = OA, zA.isZero()) return wA + NA;
          else {
            while (wA.length < 6) wA = "0" + wA;
            NA = "" + wA + NA
          }
        }
      }, u.getHighBits = function() {
        return this.high
      }, u.getHighBitsUnsigned = function() {
        return this.high >>> 0
      }, u.getLowBits = function() {
        return this.low
      }, u.getLowBitsUnsigned = function() {
        return this.low >>> 0
      }, u.getNumBitsAbs = function() {
        if (this.isNegative()) return this.eq(p) ? 64 : this.neg().getNumBitsAbs();
        var k = this.high != 0 ? this.high : this.low;
        for (var m = 31; m > 0; m--)
          if ((k & 1 << m) != 0) break;
        return this.high != 0 ? m + 33 : m + 1
      }, u.isSafeInteger = function() {
        var k = this.high >> 21;
        if (!k) return !0;
        if (this.unsigned) return !1;
        return k === -1 && !(this.low === 0 && this.high === -2097152)
      }, u.isZero = function() {
        return this.high === 0 && this.low === 0
      }, u.eqz = u.isZero, u.isNegative = function() {
        return !this.unsigned && this.high < 0
      }, u.isPositive = function() {
        return this.unsigned || this.high >= 0
      }, u.isOdd = function() {
        return (this.low & 1) === 1
      }, u.isEven = function() {
        return (this.low & 1) === 0
      }, u.equals = function(k) {
        if (!G(k)) k = K(k);
        if (this.unsigned !== k.unsigned && this.high >>> 31 === 1 && k.high >>> 31 === 1) return !1;
        return this.high === k.high && this.low === k.low
      }, u.eq = u.equals, u.notEquals = function(k) {
        return !this.eq(k)
      }, u.neq = u.notEquals, u.ne = u.notEquals, u.lessThan = function(k) {
        return this.comp(k) < 0
      }, u.lt = u.lessThan, u.lessThanOrEqual = function(k) {
        return this.comp(k) <= 0
      }, u.lte = u.lessThanOrEqual, u.le = u.lessThanOrEqual, u.greaterThan = function(k) {
        return this.comp(k) > 0
      }, u.gt = u.greaterThan, u.greaterThanOrEqual = function(k) {
        return this.comp(k) >= 0
      }, u.gte = u.greaterThanOrEqual, u.ge = u.greaterThanOrEqual, u.compare = function(k) {
        if (!G(k)) k = K(k);
        if (this.eq(k)) return 0;
        var m = this.isNegative(),
          o = k.isNegative();
        if (m && !o) return -1;
        if (!m && o) return 1;
        if (!this.unsigned) return this.sub(k).isNegative() ? -1 : 1;
        return k.high >>> 0 > this.high >>> 0 || k.high === this.high && k.low >>> 0 > this.low >>> 0 ? -1 : 1
      }, u.comp = u.compare, u.negate = function() {
        if (!this.unsigned && this.eq(p)) return p;
        return this.not().add(R)
      }, u.neg = u.negate, u.add = function(k) {
        if (!G(k)) k = K(k);
        var m = this.high >>> 16,
          o = this.high & 65535,
          IA = this.low >>> 16,
          FA = this.low & 65535,
          zA = k.high >>> 16,
          NA = k.high & 65535,
          OA = k.low >>> 16,
          mA = k.low & 65535,
          wA = 0,
          qA = 0,
          KA = 0,
          yA = 0;
        return yA += FA + mA, KA += yA >>> 16, yA &= 65535, KA += IA + OA, qA += KA >>> 16, KA &= 65535, qA += o + NA, wA += qA >>> 16, qA &= 65535, wA += m + zA, wA &= 65535, X(KA << 16 | yA, wA << 16 | qA, this.unsigned)
      }, u.subtract = function(k) {
        if (!G(k)) k = K(k);
        return this.add(k.neg())
      }, u.sub = u.subtract, u.multiply = function(k) {
        if (this.isZero()) return this;
        if (!G(k)) k = K(k);
        if (Q) {
          var m = Q.mul(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        if (k.isZero()) return this.unsigned ? N : w;
        if (this.eq(p)) return k.isOdd() ? p : w;
        if (k.eq(p)) return this.isOdd() ? p : w;
        if (this.isNegative())
          if (k.isNegative()) return this.neg().mul(k.neg());
          else return this.neg().mul(k).neg();
        else if (k.isNegative()) return this.mul(k.neg()).neg();
        if (this.lt(q) && k.lt(q)) return W(this.toNumber() * k.toNumber(), this.unsigned);
        var o = this.high >>> 16,
          IA = this.high & 65535,
          FA = this.low >>> 16,
          zA = this.low & 65535,
          NA = k.high >>> 16,
          OA = k.high & 65535,
          mA = k.low >>> 16,
          wA = k.low & 65535,
          qA = 0,
          KA = 0,
          yA = 0,
          oA = 0;
        return oA += zA * wA, yA += oA >>> 16, oA &= 65535, yA += FA * wA, KA += yA >>> 16, yA &= 65535, yA += zA * mA, KA += yA >>> 16, yA &= 65535, KA += IA * wA, qA += KA >>> 16, KA &= 65535, KA += FA * mA, qA += KA >>> 16, KA &= 65535, KA += zA * OA, qA += KA >>> 16, KA &= 65535, qA += o * wA + IA * mA + FA * OA + zA * NA, qA &= 65535, X(yA << 16 | oA, qA << 16 | KA, this.unsigned)
      }, u.mul = u.multiply, u.divide = function(k) {
        if (!G(k)) k = K(k);
        if (k.isZero()) throw Error("division by zero");
        if (Q) {
          if (!this.unsigned && this.high === -2147483648 && k.low === -1 && k.high === -1) return this;
          var m = (this.unsigned ? Q.div_u : Q.div_s)(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        if (this.isZero()) return this.unsigned ? N : w;
        var o, IA, FA;
        if (!this.unsigned) {
          if (this.eq(p))
            if (k.eq(R) || k.eq(y)) return p;
            else if (k.eq(p)) return R;
          else {
            var zA = this.shr(1);
            if (o = zA.div(k).shl(1), o.eq(w)) return k.isNegative() ? R : y;
            else return IA = this.sub(k.mul(o)), FA = o.add(IA.div(k)), FA
          } else if (k.eq(p)) return this.unsigned ? N : w;
          if (this.isNegative()) {
            if (k.isNegative()) return this.neg().div(k.neg());
            return this.neg().div(k).neg()
          } else if (k.isNegative()) return this.div(k.neg()).neg();
          FA = w
        } else {
          if (!k.unsigned) k = k.toUnsigned();
          if (k.gt(this)) return N;
          if (k.gt(this.shru(1))) return T;
          FA = N
        }
        IA = this;
        while (IA.gte(k)) {
          o = Math.max(1, Math.floor(IA.toNumber() / k.toNumber()));
          var NA = Math.ceil(Math.log(o) / Math.LN2),
            OA = NA <= 48 ? 1 : V(2, NA - 48),
            mA = W(o),
            wA = mA.mul(k);
          while (wA.isNegative() || wA.gt(IA)) o -= OA, mA = W(o, this.unsigned), wA = mA.mul(k);
          if (mA.isZero()) mA = R;
          FA = FA.add(mA), IA = IA.sub(wA)
        }
        return FA
      }, u.div = u.divide, u.modulo = function(k) {
        if (!G(k)) k = K(k);
        if (Q) {
          var m = (this.unsigned ? Q.rem_u : Q.rem_s)(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        return this.sub(this.div(k).mul(k))
      }, u.mod = u.modulo, u.rem = u.modulo, u.not = function() {
        return X(~this.low, ~this.high, this.unsigned)
      }, u.countLeadingZeros = function() {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
      }, u.clz = u.countLeadingZeros, u.countTrailingZeros = function() {
        return this.low ? Z(this.low) : Z(this.high) + 32
      }, u.ctz = u.countTrailingZeros, u.and = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low & k.low, this.high & k.high, this.unsigned)
      }, u.or = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low | k.low, this.high | k.high, this.unsigned)
      }, u.xor = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low ^ k.low, this.high ^ k.high, this.unsigned)
      }, u.shiftLeft = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        else if (k < 32) return X(this.low << k, this.high << k | this.low >>> 32 - k, this.unsigned);
        else return X(0, this.low << k - 32, this.unsigned)
      }, u.shl = u.shiftLeft, u.shiftRight = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        else if (k < 32) return X(this.low >>> k | this.high << 32 - k, this.high >> k, this.unsigned);
        else return X(this.high >> k - 32, this.high >= 0 ? 0 : -1, this.unsigned)
      }, u.shr = u.shiftRight, u.shiftRightUnsigned = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k < 32) return X(this.low >>> k | this.high << 32 - k, this.high >>> k, this.unsigned);
        if (k === 32) return X(this.high, 0, this.unsigned);
        return X(this.high >>> k - 32, 0, this.unsigned)
      }, u.shru = u.shiftRightUnsigned, u.shr_u = u.shiftRightUnsigned, u.rotateLeft = function(k) {
        var m;
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k === 32) return X(this.high, this.low, this.unsigned);
        if (k < 32) return m = 32 - k, X(this.low << k | this.high >>> m, this.high << k | this.low >>> m, this.unsigned);
        return k -= 32, m = 32 - k, X(this.high << k | this.low >>> m, this.low << k | this.high >>> m, this.unsigned)
      }, u.rotl = u.rotateLeft, u.rotateRight = function(k) {
        var m;
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k === 32) return X(this.high, this.low, this.unsigned);
        if (k < 32) return m = 32 - k, X(this.high << m | this.low >>> k, this.low << m | this.high >>> k, this.unsigned);
        return k -= 32, m = 32 - k, X(this.low << m | this.high >>> k, this.high << m | this.low >>> k, this.unsigned)
      }, u.rotr = u.rotateRight, u.toSigned = function() {
        if (!this.unsigned) return this;
        return X(this.low, this.high, !1)
      }, u.toUnsigned = function() {
        if (this.unsigned) return this;
        return X(this.low, this.high, !0)
      }, u.toBytes = function(k) {
        return k ? this.toBytesLE() : this.toBytesBE()
      }, u.toBytesLE = function() {
        var k = this.high,
          m = this.low;
        return [m & 255, m >>> 8 & 255, m >>> 16 & 255, m >>> 24, k & 255, k >>> 8 & 255, k >>> 16 & 255, k >>> 24]
      }, u.toBytesBE = function() {
        var k = this.high,
          m = this.low;
        return [k >>> 24, k >>> 16 & 255, k >>> 8 & 255, k & 255, m >>> 24, m >>> 16 & 255, m >>> 8 & 255, m & 255]
      }, B.fromBytes = function(k, m, o) {
        return o ? B.fromBytesLE(k, m) : B.fromBytesBE(k, m)
      }, B.fromBytesLE = function(k, m) {
        return new B(k[0] | k[1] << 8 | k[2] << 16 | k[3] << 24, k[4] | k[5] << 8 | k[6] << 16 | k[7] << 24, m)
      }, B.fromBytesBE = function(k, m) {
        return new B(k[4] << 24 | k[5] << 16 | k[6] << 8 | k[7], k[0] << 24 | k[1] << 16 | k[2] << 8 | k[3], m)
      }, typeof BigInt === "function") B.fromBigInt = function(k, m) {
      var o = Number(BigInt.asIntN(32, k)),
        IA = Number(BigInt.asIntN(32, k >> BigInt(32)));
      return X(o, IA, m)
    }, B.fromValue = function(k, m) {
      if (typeof k === "bigint") return fromBigInt(k, m);
      return K(k, m)
    }, u.toBigInt = function() {
      var k = BigInt(this.low >>> 0),
        m = BigInt(this.unsigned ? this.high >>> 0 : this.high);
      return m << BigInt(32) | k
    };
    var e = A.default = B
  })
})
// @from(Start 10830631, End 10835245)
H90 = z((Rz2) => {
  Object.defineProperty(Rz2, "__esModule", {
    value: !0
  });
  Rz2.loadFileDescriptorSetFromObject = Rz2.loadFileDescriptorSetFromBuffer = Rz2.fromJSON = Rz2.loadSync = Rz2.load = Rz2.IdempotencyLevel = Rz2.isAnyExtension = Rz2.Long = void 0;
  var sR5 = GE2(),
    Iy = Z81(),
    K90 = Vz2(),
    D90 = $z2(),
    rR5 = wz2();
  Rz2.Long = rR5;

  function oR5(A) {
    return "@type" in A && typeof A["@type"] === "string"
  }
  Rz2.isAnyExtension = oR5;
  var Nz2;
  (function(A) {
    A.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", A.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", A.IDEMPOTENT = "IDEMPOTENT"
  })(Nz2 = Rz2.IdempotencyLevel || (Rz2.IdempotencyLevel = {}));
  var Lz2 = {
    longs: String,
    enums: String,
    bytes: String,
    defaults: !0,
    oneofs: !0,
    json: !0
  };

  function tR5(A, Q) {
    if (A === "") return Q;
    else return A + "." + Q
  }

  function eR5(A) {
    return A instanceof Iy.Service || A instanceof Iy.Type || A instanceof Iy.Enum
  }

  function AT5(A) {
    return A instanceof Iy.Namespace || A instanceof Iy.Root
  }

  function Mz2(A, Q) {
    let B = tR5(Q, A.name);
    if (eR5(A)) return [
      [B, A]
    ];
    else if (AT5(A) && typeof A.nested < "u") return Object.keys(A.nested).map((G) => {
      return Mz2(A.nested[G], B)
    }).reduce((G, Z) => G.concat(Z), []);
    return []
  }

  function X90(A, Q) {
    return function(G) {
      return A.toObject(A.decode(G), Q)
    }
  }

  function V90(A) {
    return function(B) {
      if (Array.isArray(B)) throw Error(`Failed to serialize message: expected object with ${A.name} structure, got array instead`);
      let G = A.fromObject(B);
      return A.encode(G).finish()
    }
  }

  function QT5(A) {
    return (A || []).reduce((Q, B) => {
      for (let [G, Z] of Object.entries(B)) switch (G) {
        case "uninterpreted_option":
          Q.uninterpreted_option.push(B.uninterpreted_option);
          break;
        default:
          Q[G] = Z
      }
      return Q
    }, {
      deprecated: !1,
      idempotency_level: Nz2.IDEMPOTENCY_UNKNOWN,
      uninterpreted_option: []
    })
  }

  function BT5(A, Q, B, G) {
    let {
      resolvedRequestType: Z,
      resolvedResponseType: I
    } = A;
    return {
      path: "/" + Q + "/" + A.name,
      requestStream: !!A.requestStream,
      responseStream: !!A.responseStream,
      requestSerialize: V90(Z),
      requestDeserialize: X90(Z, B),
      responseSerialize: V90(I),
      responseDeserialize: X90(I, B),
      originalName: sR5(A.name),
      requestType: F90(Z, B, G),
      responseType: F90(I, B, G),
      options: QT5(A.parsedOptions)
    }
  }

  function GT5(A, Q, B, G) {
    let Z = {};
    for (let I of A.methodsArray) Z[I.name] = BT5(I, Q, B, G);
    return Z
  }

  function F90(A, Q, B) {
    let G = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 DescriptorProto",
      type: G.$type.toObject(G, Lz2),
      fileDescriptorProtos: B,
      serialize: V90(A),
      deserialize: X90(A, Q)
    }
  }

  function ZT5(A, Q) {
    let B = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 EnumDescriptorProto",
      type: B.$type.toObject(B, Lz2),
      fileDescriptorProtos: Q
    }
  }

  function IT5(A, Q, B, G) {
    if (A instanceof Iy.Service) return GT5(A, Q, B, G);
    else if (A instanceof Iy.Type) return F90(A, B, G);
    else if (A instanceof Iy.Enum) return ZT5(A, G);
    else throw Error("Type mismatch in reflection object handling")
  }

  function J81(A, Q) {
    let B = {};
    A.resolveAll();
    let Z = A.toDescriptor("proto3").file.map((I) => Buffer.from(K90.FileDescriptorProto.encode(I).finish()));
    for (let [I, Y] of Mz2(A, "")) B[I] = IT5(Y, I, Q, Z);
    return B
  }

  function Oz2(A, Q) {
    Q = Q || {};
    let B = Iy.Root.fromDescriptor(A);
    return B.resolveAll(), J81(B, Q)
  }

  function YT5(A, Q) {
    return (0, D90.loadProtosWithOptions)(A, Q).then((B) => {
      return J81(B, Q)
    })
  }
  Rz2.load = YT5;

  function JT5(A, Q) {
    let B = (0, D90.loadProtosWithOptionsSync)(A, Q);
    return J81(B, Q)
  }
  Rz2.loadSync = JT5;

  function WT5(A, Q) {
    Q = Q || {};
    let B = Iy.Root.fromJSON(A);
    return B.resolveAll(), J81(B, Q)
  }
  Rz2.fromJSON = WT5;

  function XT5(A, Q) {
    let B = K90.FileDescriptorSet.decode(A);
    return Oz2(B, Q)
  }
  Rz2.loadFileDescriptorSetFromBuffer = XT5;

  function VT5(A, Q) {
    let B = K90.FileDescriptorSet.fromObject(A);
    return Oz2(B, Q)
  }
  Rz2.loadFileDescriptorSetFromObject = VT5;
  (0, D90.addCommonProtos)()
})
// @from(Start 10835251, End 10849061)
ti = z((mz2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2204/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(mz2, "__esModule", {
    value: !0
  });
  mz2.registerChannelzSocket = mz2.registerChannelzServer = mz2.registerChannelzSubchannel = mz2.registerChannelzChannel = mz2.ChannelzCallTrackerStub = mz2.ChannelzCallTracker = mz2.ChannelzChildrenTrackerStub = mz2.ChannelzChildrenTracker = mz2.ChannelzTrace = mz2.ChannelzTraceStub = void 0;
  mz2.unregisterChannelzRef = qT5;
  mz2.getChannelzHandlers = gz2;
  mz2.getChannelzServiceDefinition = uz2;
  mz2.setup = kT5;
  var X81 = UA("net"),
    G0A = IC2(),
    bOA = mE(),
    fOA = E6(),
    zT5 = eU(),
    UT5 = v41(),
    $T5 = f41();

  function C90(A) {
    return {
      channel_id: A.id,
      name: A.name
    }
  }

  function E90(A) {
    return {
      subchannel_id: A.id,
      name: A.name
    }
  }

  function wT5(A) {
    return {
      server_id: A.id
    }
  }

  function V81(A) {
    return {
      socket_id: A.id,
      name: A.name
    }
  }
  var Pz2 = 32,
    z90 = 100;
  class kz2 {
    constructor() {
      this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
    }
    addTrace() {}
    getTraceMessage() {
      return {
        creation_timestamp: Yy(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: []
      }
    }
  }
  mz2.ChannelzTraceStub = kz2;
  class yz2 {
    constructor() {
      this.events = [], this.eventsLogged = 0, this.creationTimestamp = new Date
    }
    addTrace(A, Q, B) {
      let G = new Date;
      if (this.events.push({
          description: Q,
          severity: A,
          timestamp: G,
          childChannel: (B === null || B === void 0 ? void 0 : B.kind) === "channel" ? B : void 0,
          childSubchannel: (B === null || B === void 0 ? void 0 : B.kind) === "subchannel" ? B : void 0
        }), this.events.length >= Pz2 * 2) this.events = this.events.slice(Pz2);
      this.eventsLogged += 1
    }
    getTraceMessage() {
      return {
        creation_timestamp: Yy(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: this.events.map((A) => {
          return {
            description: A.description,
            severity: A.severity,
            timestamp: Yy(A.timestamp),
            channel_ref: A.childChannel ? C90(A.childChannel) : null,
            subchannel_ref: A.childSubchannel ? E90(A.childSubchannel) : null
          }
        })
      }
    }
  }
  mz2.ChannelzTrace = yz2;
  class U90 {
    constructor() {
      this.channelChildren = new G0A.OrderedMap, this.subchannelChildren = new G0A.OrderedMap, this.socketChildren = new G0A.OrderedMap, this.trackerMap = {
        ["channel"]: this.channelChildren,
        ["subchannel"]: this.subchannelChildren,
        ["socket"]: this.socketChildren
      }
    }
    refChild(A) {
      let Q = this.trackerMap[A.kind],
        B = Q.find(A.id);
      if (B.equals(Q.end())) Q.setElement(A.id, {
        ref: A,
        count: 1
      }, B);
      else B.pointer[1].count += 1
    }
    unrefChild(A) {
      let Q = this.trackerMap[A.kind],
        B = Q.getElementByKey(A.id);
      if (B !== void 0) {
        if (B.count -= 1, B.count === 0) Q.eraseElementByKey(A.id)
      }
    }
    getChildLists() {
      return {
        channels: this.channelChildren,
        subchannels: this.subchannelChildren,
        sockets: this.socketChildren
      }
    }
  }
  mz2.ChannelzChildrenTracker = U90;
  class xz2 extends U90 {
    refChild() {}
    unrefChild() {}
  }
  mz2.ChannelzChildrenTrackerStub = xz2;
  class $90 {
    constructor() {
      this.callsStarted = 0, this.callsSucceeded = 0, this.callsFailed = 0, this.lastCallStartedTimestamp = null
    }
    addCallStarted() {
      this.callsStarted += 1, this.lastCallStartedTimestamp = new Date
    }
    addCallSucceeded() {
      this.callsSucceeded += 1
    }
    addCallFailed() {
      this.callsFailed += 1
    }
  }
  mz2.ChannelzCallTracker = $90;
  class vz2 extends $90 {
    addCallStarted() {}
    addCallSucceeded() {}
    addCallFailed() {}
  }
  mz2.ChannelzCallTrackerStub = vz2;
  var vh = {
      ["channel"]: new G0A.OrderedMap,
      ["subchannel"]: new G0A.OrderedMap,
      ["server"]: new G0A.OrderedMap,
      ["socket"]: new G0A.OrderedMap
    },
    F81 = (A) => {
      let Q = 1;

      function B() {
        return Q++
      }
      let G = vh[A];
      return (Z, I, Y) => {
        let J = B(),
          W = {
            id: J,
            name: Z,
            kind: A
          };
        if (Y) G.setElement(J, {
          ref: W,
          getInfo: I
        });
        return W
      }
    };
  mz2.registerChannelzChannel = F81("channel");
  mz2.registerChannelzSubchannel = F81("subchannel");
  mz2.registerChannelzServer = F81("server");
  mz2.registerChannelzSocket = F81("socket");

  function qT5(A) {
    vh[A.kind].eraseElementByKey(A.id)
  }

  function NT5(A) {
    let Q = Number.parseInt(A, 16);
    return [Q / 256 | 0, Q % 256]
  }

  function jz2(A) {
    if (A === "") return [];
    let Q = A.split(":").map((G) => NT5(G));
    return [].concat(...Q)
  }

  function LT5(A) {
    return (0, X81.isIPv6)(A) && A.toLowerCase().startsWith("::ffff:") && (0, X81.isIPv4)(A.substring(7))
  }

  function Sz2(A) {
    return Buffer.from(Uint8Array.from(A.split(".").map((Q) => Number.parseInt(Q))))
  }

  function MT5(A) {
    if ((0, X81.isIPv4)(A)) return Sz2(A);
    else if (LT5(A)) return Sz2(A.substring(7));
    else if ((0, X81.isIPv6)(A)) {
      let Q, B, G = A.indexOf("::");
      if (G === -1) Q = A, B = "";
      else Q = A.substring(0, G), B = A.substring(G + 2);
      let Z = Buffer.from(jz2(Q)),
        I = Buffer.from(jz2(B)),
        Y = Buffer.alloc(16 - Z.length - I.length, 0);
      return Buffer.concat([Z, Y, I])
    } else return null
  }

  function bz2(A) {
    switch (A) {
      case bOA.ConnectivityState.CONNECTING:
        return {
          state: "CONNECTING"
        };
      case bOA.ConnectivityState.IDLE:
        return {
          state: "IDLE"
        };
      case bOA.ConnectivityState.READY:
        return {
          state: "READY"
        };
      case bOA.ConnectivityState.SHUTDOWN:
        return {
          state: "SHUTDOWN"
        };
      case bOA.ConnectivityState.TRANSIENT_FAILURE:
        return {
          state: "TRANSIENT_FAILURE"
        };
      default:
        return {
          state: "UNKNOWN"
        }
    }
  }

  function Yy(A) {
    if (!A) return null;
    let Q = A.getTime();
    return {
      seconds: Q / 1000 | 0,
      nanos: Q % 1000 * 1e6
    }
  }

  function fz2(A) {
    let Q = A.getInfo(),
      B = [],
      G = [];
    return Q.children.channels.forEach((Z) => {
      B.push(C90(Z[1].ref))
    }), Q.children.subchannels.forEach((Z) => {
      G.push(E90(Z[1].ref))
    }), {
      ref: C90(A.ref),
      data: {
        target: Q.target,
        state: bz2(Q.state),
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      channel_ref: B,
      subchannel_ref: G
    }
  }

  function OT5(A, Q) {
    let B = parseInt(A.request.channel_id, 10),
      G = vh.channel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No channel data found for id " + B
      });
      return
    }
    Q(null, {
      channel: fz2(G)
    })
  }

  function RT5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || z90,
      G = [],
      Z = parseInt(A.request.start_channel_id, 10),
      I = vh.channel,
      Y;
    for (Y = I.lowerBound(Z); !Y.equals(I.end()) && G.length < B; Y = Y.next()) G.push(fz2(Y.pointer[1]));
    Q(null, {
      channel: G,
      end: Y.equals(I.end())
    })
  }

  function hz2(A) {
    let Q = A.getInfo(),
      B = [];
    return Q.listenerChildren.sockets.forEach((G) => {
      B.push(V81(G[1].ref))
    }), {
      ref: wT5(A.ref),
      data: {
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      listen_socket: B
    }
  }

  function TT5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      Z = vh.server.getElementByKey(B);
    if (Z === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    Q(null, {
      server: hz2(Z)
    })
  }

  function PT5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || z90,
      G = parseInt(A.request.start_server_id, 10),
      Z = vh.server,
      I = [],
      Y;
    for (Y = Z.lowerBound(G); !Y.equals(Z.end()) && I.length < B; Y = Y.next()) I.push(hz2(Y.pointer[1]));
    Q(null, {
      server: I,
      end: Y.equals(Z.end())
    })
  }

  function jT5(A, Q) {
    let B = parseInt(A.request.subchannel_id, 10),
      G = vh.subchannel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No subchannel data found for id " + B
      });
      return
    }
    let Z = G.getInfo(),
      I = [];
    Z.children.sockets.forEach((J) => {
      I.push(V81(J[1].ref))
    });
    let Y = {
      ref: E90(G.ref),
      data: {
        target: Z.target,
        state: bz2(Z.state),
        calls_started: Z.callTracker.callsStarted,
        calls_succeeded: Z.callTracker.callsSucceeded,
        calls_failed: Z.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Z.callTracker.lastCallStartedTimestamp),
        trace: Z.trace.getTraceMessage()
      },
      socket_ref: I
    };
    Q(null, {
      subchannel: Y
    })
  }

  function _z2(A) {
    var Q;
    if ((0, zT5.isTcpSubchannelAddress)(A)) return {
      address: "tcpip_address",
      tcpip_address: {
        ip_address: (Q = MT5(A.host)) !== null && Q !== void 0 ? Q : void 0,
        port: A.port
      }
    };
    else return {
      address: "uds_address",
      uds_address: {
        filename: A.path
      }
    }
  }

  function ST5(A, Q) {
    var B, G, Z, I, Y;
    let J = parseInt(A.request.socket_id, 10),
      W = vh.socket.getElementByKey(J);
    if (W === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No socket data found for id " + J
      });
      return
    }
    let X = W.getInfo(),
      V = X.security ? {
        model: "tls",
        tls: {
          cipher_suite: X.security.cipherSuiteStandardName ? "standard_name" : "other_name",
          standard_name: (B = X.security.cipherSuiteStandardName) !== null && B !== void 0 ? B : void 0,
          other_name: (G = X.security.cipherSuiteOtherName) !== null && G !== void 0 ? G : void 0,
          local_certificate: (Z = X.security.localCertificate) !== null && Z !== void 0 ? Z : void 0,
          remote_certificate: (I = X.security.remoteCertificate) !== null && I !== void 0 ? I : void 0
        }
      } : null,
      F = {
        ref: V81(W.ref),
        local: X.localAddress ? _z2(X.localAddress) : null,
        remote: X.remoteAddress ? _z2(X.remoteAddress) : null,
        remote_name: (Y = X.remoteName) !== null && Y !== void 0 ? Y : void 0,
        security: V,
        data: {
          keep_alives_sent: X.keepAlivesSent,
          streams_started: X.streamsStarted,
          streams_succeeded: X.streamsSucceeded,
          streams_failed: X.streamsFailed,
          last_local_stream_created_timestamp: Yy(X.lastLocalStreamCreatedTimestamp),
          last_remote_stream_created_timestamp: Yy(X.lastRemoteStreamCreatedTimestamp),
          messages_received: X.messagesReceived,
          messages_sent: X.messagesSent,
          last_message_received_timestamp: Yy(X.lastMessageReceivedTimestamp),
          last_message_sent_timestamp: Yy(X.lastMessageSentTimestamp),
          local_flow_control_window: X.localFlowControlWindow ? {
            value: X.localFlowControlWindow
          } : null,
          remote_flow_control_window: X.remoteFlowControlWindow ? {
            value: X.remoteFlowControlWindow
          } : null
        }
      };
    Q(null, {
      socket: F
    })
  }

  function _T5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      G = vh.server.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    let Z = parseInt(A.request.start_socket_id, 10),
      I = parseInt(A.request.max_results, 10) || z90,
      J = G.getInfo().sessionChildren.sockets,
      W = [],
      X;
    for (X = J.lowerBound(Z); !X.equals(J.end()) && W.length < I; X = X.next()) W.push(V81(X.pointer[1].ref));
    Q(null, {
      socket_ref: W,
      end: X.equals(J.end())
    })
  }

  function gz2() {
    return {
      GetChannel: OT5,
      GetTopChannels: RT5,
      GetServer: TT5,
      GetServers: PT5,
      GetSubchannel: jT5,
      GetSocket: ST5,
      GetServerSockets: _T5
    }
  }
  var W81 = null;

  function uz2() {
    if (W81) return W81;
    let A = H90().loadSync,
      Q = A("channelz.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto`]
      });
    return W81 = (0, $T5.loadPackageDefinition)(Q).grpc.channelz.v1.Channelz.service, W81
  }

  function kT5() {
    (0, UT5.registerAdminService)(uz2, gz2)
  }
})
// @from(Start 10849067, End 10849240)
K81 = z((cz2) => {
  Object.defineProperty(cz2, "__esModule", {
    value: !0
  });
  cz2.getNextCallNumber = nT5;
  var iT5 = 0;

  function nT5() {
    return iT5++
  }
})
// @from(Start 10849246, End 10849539)
w90 = z((lz2) => {
  Object.defineProperty(lz2, "__esModule", {
    value: !0
  });
  lz2.CompressionAlgorithms = void 0;
  var pz2;
  (function(A) {
    A[A.identity = 0] = "identity", A[A.deflate = 1] = "deflate", A[A.gzip = 2] = "gzip"
  })(pz2 || (lz2.CompressionAlgorithms = pz2 = {}))
})
// @from(Start 10849545, End 10849939)
q90 = z((az2) => {
  Object.defineProperty(az2, "__esModule", {
    value: !0
  });
  az2.BaseFilter = void 0;
  class nz2 {
    async sendMetadata(A) {
      return A
    }
    receiveMetadata(A) {
      return A
    }
    async sendMessage(A) {
      return A
    }
    async receiveMessage(A) {
      return A
    }
    receiveTrailers(A) {
      return A
    }
  }
  az2.BaseFilter = nz2
})
// @from(Start 10849945, End 10856301)
L90 = z((BU2) => {
  Object.defineProperty(BU2, "__esModule", {
    value: !0
  });
  BU2.CompressionFilterFactory = BU2.CompressionFilter = void 0;
  var D81 = UA("zlib"),
    oz2 = w90(),
    DJA = E6(),
    sT5 = q90(),
    rT5 = zZ(),
    oT5 = (A) => {
      return typeof A === "number" && typeof oz2.CompressionAlgorithms[A] === "string"
    };
  class hOA {
    async writeMessage(A, Q) {
      let B = A;
      if (Q) B = await this.compressMessage(B);
      let G = Buffer.allocUnsafe(B.length + 5);
      return G.writeUInt8(Q ? 1 : 0, 0), G.writeUInt32BE(B.length, 1), B.copy(G, 5), G
    }
    async readMessage(A) {
      let Q = A.readUInt8(0) === 1,
        B = A.slice(5);
      if (Q) B = await this.decompressMessage(B);
      return B
    }
  }
  class HJA extends hOA {
    async compressMessage(A) {
      return A
    }
    async writeMessage(A, Q) {
      let B = Buffer.allocUnsafe(A.length + 5);
      return B.writeUInt8(0, 0), B.writeUInt32BE(A.length, 1), A.copy(B, 5), B
    }
    decompressMessage(A) {
      return Promise.reject(Error('Received compressed message but "grpc-encoding" header was identity'))
    }
  }
  class tz2 extends hOA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        D81.deflate(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          I = D81.createInflate();
        I.on("data", (Y) => {
          if (Z.push(Y), G += Y.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) I.destroy(), B({
            code: DJA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), I.on("end", () => {
          Q(Buffer.concat(Z))
        }), I.write(A), I.end()
      })
    }
  }
  class ez2 extends hOA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        D81.gzip(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          I = D81.createGunzip();
        I.on("data", (Y) => {
          if (Z.push(Y), G += Y.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) I.destroy(), B({
            code: DJA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), I.on("end", () => {
          Q(Buffer.concat(Z))
        }), I.write(A), I.end()
      })
    }
  }
  class AU2 extends hOA {
    constructor(A) {
      super();
      this.compressionName = A
    }
    compressMessage(A) {
      return Promise.reject(Error(`Received message compressed with unsupported compression method ${this.compressionName}`))
    }
    decompressMessage(A) {
      return Promise.reject(Error(`Compression method not supported: ${this.compressionName}`))
    }
  }

  function rz2(A, Q) {
    switch (A) {
      case "identity":
        return new HJA;
      case "deflate":
        return new tz2(Q);
      case "gzip":
        return new ez2(Q);
      default:
        return new AU2(A)
    }
  }
  class N90 extends sT5.BaseFilter {
    constructor(A, Q) {
      var B, G, Z;
      super();
      this.sharedFilterConfig = Q, this.sendCompression = new HJA, this.receiveCompression = new HJA, this.currentCompressionAlgorithm = "identity";
      let I = A["grpc.default_compression_algorithm"];
      if (this.maxReceiveMessageLength = (B = A["grpc.max_receive_message_length"]) !== null && B !== void 0 ? B : DJA.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (G = A["grpc.max_send_message_length"]) !== null && G !== void 0 ? G : DJA.DEFAULT_MAX_SEND_MESSAGE_LENGTH, I !== void 0)
        if (oT5(I)) {
          let Y = oz2.CompressionAlgorithms[I],
            J = (Z = Q.serverSupportedEncodingHeader) === null || Z === void 0 ? void 0 : Z.split(",");
          if (!J || J.includes(Y)) this.currentCompressionAlgorithm = Y, this.sendCompression = rz2(this.currentCompressionAlgorithm, -1)
        } else rT5.log(DJA.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${I}`)
    }
    async sendMetadata(A) {
      let Q = await A;
      if (Q.set("grpc-accept-encoding", "identity,deflate,gzip"), Q.set("accept-encoding", "identity"), this.currentCompressionAlgorithm === "identity") Q.remove("grpc-encoding");
      else Q.set("grpc-encoding", this.currentCompressionAlgorithm);
      return Q
    }
    receiveMetadata(A) {
      let Q = A.get("grpc-encoding");
      if (Q.length > 0) {
        let G = Q[0];
        if (typeof G === "string") this.receiveCompression = rz2(G, this.maxReceiveMessageLength)
      }
      A.remove("grpc-encoding");
      let B = A.get("grpc-accept-encoding")[0];
      if (B) {
        if (this.sharedFilterConfig.serverSupportedEncodingHeader = B, !B.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new HJA, this.currentCompressionAlgorithm = "identity"
      }
      return A.remove("grpc-accept-encoding"), A
    }
    async sendMessage(A) {
      var Q;
      let B = await A;
      if (this.maxSendMessageLength !== -1 && B.message.length > this.maxSendMessageLength) throw {
        code: DJA.Status.RESOURCE_EXHAUSTED,
        details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
      };
      let G;
      if (this.sendCompression instanceof HJA) G = !1;
      else G = (((Q = B.flags) !== null && Q !== void 0 ? Q : 0) & 2) === 0;
      return {
        message: await this.sendCompression.writeMessage(B.message, G),
        flags: B.flags
      }
    }
    async receiveMessage(A) {
      return this.receiveCompression.readMessage(await A)
    }
  }
  BU2.CompressionFilter = N90;
  class QU2 {
    constructor(A, Q) {
      this.options = Q, this.sharedFilterConfig = {}
    }
    createFilter() {
      return new N90(this.options, this.sharedFilterConfig)
    }
  }
  BU2.CompressionFilterFactory = QU2
})
// @from(Start 10856307, End 10856885)
gOA = z((ZU2) => {
  Object.defineProperty(ZU2, "__esModule", {
    value: !0
  });
  ZU2.restrictControlPlaneStatusCode = AP5;
  var Jy = E6(),
    eT5 = [Jy.Status.OK, Jy.Status.INVALID_ARGUMENT, Jy.Status.NOT_FOUND, Jy.Status.ALREADY_EXISTS, Jy.Status.FAILED_PRECONDITION, Jy.Status.ABORTED, Jy.Status.OUT_OF_RANGE, Jy.Status.DATA_LOSS];

  function AP5(A, Q) {
    if (eT5.includes(A)) return {
      code: Jy.Status.INTERNAL,
      details: `Invalid status from control plane: ${A} ${Jy.Status[A]} ${Q}`
    };
    else return {
      code: A,
      details: Q
    }
  }
})
// @from(Start 10856891, End 10858207)
CJA = z((IU2) => {
  Object.defineProperty(IU2, "__esModule", {
    value: !0
  });
  IU2.minDeadline = BP5;
  IU2.getDeadlineTimeoutString = ZP5;
  IU2.getRelativeTimeout = YP5;
  IU2.deadlineToString = JP5;
  IU2.formatDateDifference = WP5;

  function BP5(...A) {
    let Q = 1 / 0;
    for (let B of A) {
      let G = B instanceof Date ? B.getTime() : B;
      if (G < Q) Q = G
    }
    return Q
  }
  var GP5 = [
    ["m", 1],
    ["S", 1000],
    ["M", 60000],
    ["H", 3600000]
  ];

  function ZP5(A) {
    let Q = new Date().getTime();
    if (A instanceof Date) A = A.getTime();
    let B = Math.max(A - Q, 0);
    for (let [G, Z] of GP5) {
      let I = B / Z;
      if (I < 1e8) return String(Math.ceil(I)) + G
    }
    throw Error("Deadline is too far in the future")
  }
  var IP5 = 2147483647;

  function YP5(A) {
    let Q = A instanceof Date ? A.getTime() : A,
      B = new Date().getTime(),
      G = Q - B;
    if (G < 0) return 0;
    else if (G > IP5) return 1 / 0;
    else return G
  }

  function JP5(A) {
    if (A instanceof Date) return A.toISOString();
    else {
      let Q = new Date(A);
      if (Number.isNaN(Q.getTime())) return "" + A;
      else return Q.toISOString()
    }
  }

  function WP5(A, Q) {
    return ((Q.getTime() - A.getTime()) / 1000).toFixed(3) + "s"
  }
})
// @from(Start 10858213, End 10859634)
H81 = z((YU2) => {
  Object.defineProperty(YU2, "__esModule", {
    value: !0
  });
  YU2.FilterStackFactory = YU2.FilterStack = void 0;
  class M90 {
    constructor(A) {
      this.filters = A
    }
    sendMetadata(A) {
      let Q = A;
      for (let B = 0; B < this.filters.length; B++) Q = this.filters[B].sendMetadata(Q);
      return Q
    }
    receiveMetadata(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveMetadata(Q);
      return Q
    }
    sendMessage(A) {
      let Q = A;
      for (let B = 0; B < this.filters.length; B++) Q = this.filters[B].sendMessage(Q);
      return Q
    }
    receiveMessage(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveMessage(Q);
      return Q
    }
    receiveTrailers(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveTrailers(Q);
      return Q
    }
    push(A) {
      this.filters.unshift(...A)
    }
    getFilters() {
      return this.filters
    }
  }
  YU2.FilterStack = M90;
  class O90 {
    constructor(A) {
      this.factories = A
    }
    push(A) {
      this.factories.unshift(...A)
    }
    clone() {
      return new O90([...this.factories])
    }
    createFilter() {
      return new M90(this.factories.map((A) => A.createFilter()))
    }
  }
  YU2.FilterStackFactory = O90
})
// @from(Start 10859640, End 10866066)
KU2 = z((VU2) => {
  Object.defineProperty(VU2, "__esModule", {
    value: !0
  });
  VU2.SingleSubchannelChannel = void 0;
  var CP5 = K81(),
    uOA = ti(),
    EP5 = L90(),
    zP5 = mE(),
    mOA = E6(),
    UP5 = gOA(),
    $P5 = CJA(),
    wP5 = H81(),
    R90 = YK(),
    qP5 = CP(),
    C81 = uE();
  class WU2 {
    constructor(A, Q, B, G, Z) {
      var I, Y;
      this.subchannel = A, this.method = Q, this.options = G, this.callNumber = Z, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
      let J = this.method.split("/"),
        W = "";
      if (J.length >= 2) W = J[1];
      let X = (Y = (I = (0, C81.splitHostPort)(this.options.host)) === null || I === void 0 ? void 0 : I.host) !== null && Y !== void 0 ? Y : "localhost";
      this.serviceUrl = `https://${X}/${W}`;
      let V = (0, $P5.getRelativeTimeout)(G.deadline);
      if (V !== 1 / 0)
        if (V <= 0) this.cancelWithStatus(mOA.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
        else setTimeout(() => {
          this.cancelWithStatus(mOA.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
        }, V);
      this.filterStack = B.createFilter()
    }
    cancelWithStatus(A, Q) {
      if (this.childCall) this.childCall.cancelWithStatus(A, Q);
      else this.pendingStatus = {
        code: A,
        details: Q,
        metadata: new R90.Metadata
      }
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.childCall) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.subchannel.getAddress()
    }
    async start(A, Q) {
      if (this.pendingStatus) {
        Q.onReceiveStatus(this.pendingStatus);
        return
      }
      if (this.subchannel.getConnectivityState() !== zP5.ConnectivityState.READY) {
        Q.onReceiveStatus({
          code: mOA.Status.UNAVAILABLE,
          details: "Subchannel not ready",
          metadata: new R90.Metadata
        });
        return
      }
      let B = await this.filterStack.sendMetadata(Promise.resolve(A)),
        G;
      try {
        G = await this.subchannel.getCallCredentials().generateMetadata({
          method_name: this.method,
          service_url: this.serviceUrl
        })
      } catch (I) {
        let Y = I,
          {
            code: J,
            details: W
          } = (0, UP5.restrictControlPlaneStatusCode)(typeof Y.code === "number" ? Y.code : mOA.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${Y.message}`);
        Q.onReceiveStatus({
          code: J,
          details: W,
          metadata: new R90.Metadata
        });
        return
      }
      G.merge(B);
      let Z = {
        onReceiveMetadata: async (I) => {
          Q.onReceiveMetadata(await this.filterStack.receiveMetadata(I))
        },
        onReceiveMessage: async (I) => {
          this.readFilterPending = !0;
          let Y = await this.filterStack.receiveMessage(I);
          if (this.readFilterPending = !1, Q.onReceiveMessage(Y), this.pendingStatus) Q.onReceiveStatus(this.pendingStatus)
        },
        onReceiveStatus: async (I) => {
          let Y = await this.filterStack.receiveTrailers(I);
          if (this.readFilterPending) this.pendingStatus = Y;
          else Q.onReceiveStatus(Y)
        }
      };
      if (this.childCall = this.subchannel.createCall(G, this.options.host, this.method, Z), this.readPending) this.childCall.startRead();
      if (this.pendingMessage) this.childCall.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
      if (this.halfClosePending && !this.writeFilterPending) this.childCall.halfClose()
    }
    async sendMessageWithContext(A, Q) {
      this.writeFilterPending = !0;
      let B = await this.filterStack.sendMessage(Promise.resolve({
        message: Q,
        flags: A.flags
      }));
      if (this.writeFilterPending = !1, this.childCall) {
        if (this.childCall.sendMessageWithContext(A, B.message), this.halfClosePending) this.childCall.halfClose()
      } else this.pendingMessage = {
        context: A,
        message: B.message
      }
    }
    startRead() {
      if (this.childCall) this.childCall.startRead();
      else this.readPending = !0
    }
    halfClose() {
      if (this.childCall && !this.writeFilterPending) this.childCall.halfClose();
      else this.halfClosePending = !0
    }
    getCallNumber() {
      return this.callNumber
    }
    setCredentials(A) {
      throw Error("Method not implemented.")
    }
    getAuthContext() {
      if (this.childCall) return this.childCall.getAuthContext();
      else return null
    }
  }
  class XU2 {
    constructor(A, Q, B) {
      if (this.subchannel = A, this.target = Q, this.channelzEnabled = !1, this.channelzTrace = new uOA.ChannelzTrace, this.callTracker = new uOA.ChannelzCallTracker, this.childrenTracker = new uOA.ChannelzChildrenTracker, this.channelzEnabled = B["grpc.enable_channelz"] !== 0, this.channelzRef = (0, uOA.registerChannelzChannel)((0, C81.uriToString)(Q), () => ({
          target: `${(0,C81.uriToString)(Q)} (${A.getAddress()})`,
          state: this.subchannel.getConnectivityState(),
          trace: this.channelzTrace,
          callTracker: this.callTracker,
          children: this.childrenTracker.getChildLists()
        }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(A.getChannelzRef());
      this.filterStackFactory = new wP5.FilterStackFactory([new EP5.CompressionFilterFactory(this, B)])
    }
    close() {
      if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
      (0, uOA.unregisterChannelzRef)(this.channelzRef)
    }
    getTarget() {
      return (0, C81.uriToString)(this.target)
    }
    getConnectivityState(A) {
      throw Error("Method not implemented.")
    }
    watchConnectivityState(A, Q, B) {
      throw Error("Method not implemented.")
    }
    getChannelzRef() {
      return this.channelzRef
    }
    createCall(A, Q) {
      let B = {
        deadline: Q,
        host: (0, qP5.getDefaultAuthority)(this.target),
        flags: mOA.Propagate.DEFAULTS,
        parentCall: null
      };
      return new WU2(this.subchannel, A, this.filterStackFactory, B, (0, CP5.getNextCallNumber)())
    }
  }
  VU2.SingleSubchannelChannel = XU2
})
// @from(Start 10866072, End 10874803)
EU2 = z((HU2) => {
  Object.defineProperty(HU2, "__esModule", {
    value: !0
  });
  HU2.Subchannel = void 0;
  var dG = mE(),
    NP5 = QJA(),
    T90 = zZ(),
    E81 = E6(),
    LP5 = uE(),
    MP5 = eU(),
    Wy = ti(),
    OP5 = KU2(),
    RP5 = "subchannel",
    TP5 = 2147483647;
  class DU2 {
    constructor(A, Q, B, G, Z) {
      var I;
      this.channelTarget = A, this.subchannelAddress = Q, this.options = B, this.connector = Z, this.connectivityState = dG.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
      let Y = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      if (this.backoffTimeout = new NP5.BackoffTimeout(() => {
          this.handleBackoffTimer()
        }, Y), this.backoffTimeout.unref(), this.subchannelAddressString = (0, MP5.subchannelAddressToString)(Q), this.keepaliveTime = (I = B["grpc.keepalive_time_ms"]) !== null && I !== void 0 ? I : -1, B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Wy.ChannelzTraceStub, this.callTracker = new Wy.ChannelzCallTrackerStub, this.childrenTracker = new Wy.ChannelzChildrenTrackerStub, this.streamTracker = new Wy.ChannelzCallTrackerStub;
      else this.channelzTrace = new Wy.ChannelzTrace, this.callTracker = new Wy.ChannelzCallTracker, this.childrenTracker = new Wy.ChannelzChildrenTracker, this.streamTracker = new Wy.ChannelzCallTracker;
      this.channelzRef = (0, Wy.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(B, void 0, 2)), this.secureConnector = G._createSecureConnector(A, B)
    }
    getChannelzInfo() {
      return {
        state: this.connectivityState,
        trace: this.channelzTrace,
        callTracker: this.callTracker,
        children: this.childrenTracker.getChildLists(),
        target: this.subchannelAddressString
      }
    }
    trace(A) {
      T90.trace(E81.LogVerbosity.DEBUG, RP5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    refTrace(A) {
      T90.trace(E81.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    handleBackoffTimer() {
      if (this.continueConnecting) this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.CONNECTING);
      else this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.IDLE)
    }
    startBackoff() {
      this.backoffTimeout.runOnce()
    }
    stopBackoff() {
      this.backoffTimeout.stop(), this.backoffTimeout.reset()
    }
    startConnectingInternal() {
      let A = this.options;
      if (A["grpc.keepalive_time_ms"]) {
        let Q = Math.min(this.keepaliveTime, TP5);
        A = Object.assign(Object.assign({}, A), {
          "grpc.keepalive_time_ms": Q
        })
      }
      this.connector.connect(this.subchannelAddress, this.secureConnector, A).then((Q) => {
        if (this.transitionToState([dG.ConnectivityState.CONNECTING], dG.ConnectivityState.READY)) {
          if (this.transport = Q, this.channelzEnabled) this.childrenTracker.refChild(Q.getChannelzRef());
          Q.addDisconnectListener((B) => {
            if (this.transitionToState([dG.ConnectivityState.READY], dG.ConnectivityState.IDLE), B && this.keepaliveTime > 0) this.keepaliveTime *= 2, T90.log(E81.LogVerbosity.ERROR, `Connection to ${(0,LP5.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
          })
        } else Q.shutdown()
      }, (Q) => {
        this.transitionToState([dG.ConnectivityState.CONNECTING], dG.ConnectivityState.TRANSIENT_FAILURE, `${Q}`)
      })
    }
    transitionToState(A, Q, B) {
      var G, Z;
      if (A.indexOf(this.connectivityState) === -1) return !1;
      if (B) this.trace(dG.ConnectivityState[this.connectivityState] + " -> " + dG.ConnectivityState[Q] + ' with error "' + B + '"');
      else this.trace(dG.ConnectivityState[this.connectivityState] + " -> " + dG.ConnectivityState[Q]);
      if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + dG.ConnectivityState[Q]);
      let I = this.connectivityState;
      switch (this.connectivityState = Q, Q) {
        case dG.ConnectivityState.READY:
          this.stopBackoff();
          break;
        case dG.ConnectivityState.CONNECTING:
          this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
          break;
        case dG.ConnectivityState.TRANSIENT_FAILURE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          if ((G = this.transport) === null || G === void 0 || G.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
            this.handleBackoffTimer()
          });
          break;
        case dG.ConnectivityState.IDLE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          (Z = this.transport) === null || Z === void 0 || Z.shutdown(), this.transport = null;
          break;
        default:
          throw Error(`Invalid state: unknown ConnectivityState ${Q}`)
      }
      for (let Y of this.stateListeners) Y(this, I, Q, this.keepaliveTime, B);
      return !0
    }
    ref() {
      this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
    }
    unref() {
      if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, Wy.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
        this.transitionToState([dG.ConnectivityState.CONNECTING, dG.ConnectivityState.READY], dG.ConnectivityState.IDLE)
      })
    }
    unrefIfOneRef() {
      if (this.refcount === 1) return this.unref(), !0;
      return !1
    }
    createCall(A, Q, B, G) {
      if (!this.transport) throw Error("Cannot create call, subchannel not READY");
      let Z;
      if (this.channelzEnabled) this.callTracker.addCallStarted(), this.streamTracker.addCallStarted(), Z = {
        onCallEnd: (I) => {
          if (I.code === E81.Status.OK) this.callTracker.addCallSucceeded();
          else this.callTracker.addCallFailed()
        }
      };
      else Z = {};
      return this.transport.createCall(A, Q, B, G, Z)
    }
    startConnecting() {
      process.nextTick(() => {
        if (!this.transitionToState([dG.ConnectivityState.IDLE], dG.ConnectivityState.CONNECTING)) {
          if (this.connectivityState === dG.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
        }
      })
    }
    getConnectivityState() {
      return this.connectivityState
    }
    addConnectivityStateListener(A) {
      this.stateListeners.add(A)
    }
    removeConnectivityStateListener(A) {
      this.stateListeners.delete(A)
    }
    resetBackoff() {
      process.nextTick(() => {
        this.backoffTimeout.reset(), this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.CONNECTING)
      })
    }
    getAddress() {
      return this.subchannelAddressString
    }
    getChannelzRef() {
      return this.channelzRef
    }
    isHealthy() {
      return !0
    }
    addHealthStateWatcher(A) {}
    removeHealthStateWatcher(A) {}
    getRealSubchannel() {
      return this
    }
    realSubchannelEquals(A) {
      return A.getRealSubchannel() === this
    }
    throttleKeepalive(A) {
      if (A > this.keepaliveTime) this.keepaliveTime = A
    }
    getCallCredentials() {
      return this.secureConnector.getCallCredentials()
    }
    getChannel() {
      if (!this.subchannelChannel) this.subchannelChannel = new OP5.SingleSubchannelChannel(this, this.channelTarget, this.options);
      return this.subchannelChannel
    }
    addDataWatcher(A) {
      throw Error("Not implemented")
    }
    getOrCreateDataProducer(A, Q) {
      let B = this.dataProducers.get(A);
      if (B) return B;
      let G = Q(this);
      return this.dataProducers.set(A, G), G
    }
    removeDataProducer(A) {
      this.dataProducers.delete(A)
    }
  }
  HU2.Subchannel = DU2
})
// @from(Start 10874809, End 10875111)
$U2 = z((zU2) => {
  var P90;
  Object.defineProperty(zU2, "__esModule", {
    value: !0
  });
  zU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
  zU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((P90 = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && P90 !== void 0 ? P90 : "false") === "true"
})
// @from(Start 10875117, End 10883122)
_90 = z((MU2) => {
  Object.defineProperty(MU2, "__esModule", {
    value: !0
  });
  MU2.DEFAULT_PORT = void 0;
  MU2.setup = vP5;
  var wU2 = CP(),
    j90 = UA("dns"),
    PP5 = D20(),
    S90 = E6(),
    EJA = o1A(),
    jP5 = YK(),
    SP5 = zZ(),
    _P5 = E6(),
    ei = uE(),
    qU2 = UA("net"),
    kP5 = QJA(),
    NU2 = $U2(),
    yP5 = "dns_resolver";

  function Xy(A) {
    SP5.trace(_P5.LogVerbosity.DEBUG, yP5, A)
  }
  MU2.DEFAULT_PORT = 443;
  var xP5 = 30000;
  class LU2 {
    constructor(A, Q, B) {
      var G, Z, I;
      if (this.target = A, this.listener = Q, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new j90.promises.Resolver, Xy("Resolver constructed for target " + (0, ei.uriToString)(A)), A.authority) this.alternativeResolver.setServers([A.authority]);
      let Y = (0, ei.splitHostPort)(A.path);
      if (Y === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
      else if ((0, qU2.isIPv4)(Y.host) || (0, qU2.isIPv6)(Y.host)) this.ipResult = [{
        addresses: [{
          host: Y.host,
          port: (G = Y.port) !== null && G !== void 0 ? G : MU2.DEFAULT_PORT
        }]
      }], this.dnsHostname = null, this.port = null;
      else this.ipResult = null, this.dnsHostname = Y.host, this.port = (Z = Y.port) !== null && Z !== void 0 ? Z : MU2.DEFAULT_PORT;
      if (this.percentage = Math.random() * 100, B["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
      this.defaultResolutionError = {
        code: S90.Status.UNAVAILABLE,
        details: `Name resolution failed for target ${(0,ei.uriToString)(this.target)}`,
        metadata: new jP5.Metadata
      };
      let J = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoff = new kP5.BackoffTimeout(() => {
        if (this.continueResolving) this.startResolutionWithBackoff()
      }, J), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (I = B["grpc.dns_min_time_between_resolutions_ms"]) !== null && I !== void 0 ? I : xP5, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
    }
    startResolution() {
      if (this.ipResult !== null) {
        if (!this.returnedIpResult) Xy("Returning IP address for target " + (0, ei.uriToString)(this.target)), setImmediate(() => {
          this.listener((0, EJA.statusOrFromValue)(this.ipResult), {}, null, "")
        }), this.returnedIpResult = !0;
        this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
        return
      }
      if (this.dnsHostname === null) Xy("Failed to parse DNS address " + (0, ei.uriToString)(this.target)), setImmediate(() => {
        this.listener((0, EJA.statusOrFromError)({
          code: S90.Status.UNAVAILABLE,
          details: `Failed to parse DNS address ${(0,ei.uriToString)(this.target)}`
        }), {}, null, "")
      }), this.stopNextResolutionTimer();
      else {
        if (this.pendingLookupPromise !== null) return;
        Xy("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
        let A = this.dnsHostname;
        if (this.pendingLookupPromise = this.lookup(A), this.pendingLookupPromise.then((Q) => {
            if (this.pendingLookupPromise === null) return;
            this.pendingLookupPromise = null, this.latestLookupResult = (0, EJA.statusOrFromValue)(Q.map((Z) => ({
              addresses: [Z]
            })));
            let B = "[" + Q.map((Z) => Z.host + ":" + Z.port).join(",") + "]";
            Xy("Resolved addresses for target " + (0, ei.uriToString)(this.target) + ": " + B);
            let G = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
            this.handleHealthStatus(G)
          }, (Q) => {
            if (this.pendingLookupPromise === null) return;
            Xy("Resolution error for target " + (0, ei.uriToString)(this.target) + ": " + Q.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, EJA.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
          }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(A), this.pendingTxtPromise.then((Q) => {
          if (this.pendingTxtPromise === null) return;
          this.pendingTxtPromise = null;
          let B;
          try {
            if (B = (0, PP5.extractAndSelectServiceConfig)(Q, this.percentage), B) this.latestServiceConfigResult = (0, EJA.statusOrFromValue)(B);
            else this.latestServiceConfigResult = null
          } catch (G) {
            this.latestServiceConfigResult = (0, EJA.statusOrFromError)({
              code: S90.Status.UNAVAILABLE,
              details: `Parsing service config failed with error ${G.message}`
            })
          }
          if (this.latestLookupResult !== null) this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "")
        }, (Q) => {})
      }
    }
    handleHealthStatus(A) {
      if (A) this.backoff.stop(), this.backoff.reset();
      else this.continueResolving = !0
    }
    async lookup(A) {
      if (NU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
        Xy("Using alternative DNS resolver.");
        let B = await Promise.allSettled([this.alternativeResolver.resolve4(A), this.alternativeResolver.resolve6(A)]);
        if (B.every((G) => G.status === "rejected")) throw Error(B[0].reason);
        return B.reduce((G, Z) => {
          return Z.status === "fulfilled" ? [...G, ...Z.value] : G
        }, []).map((G) => ({
          host: G,
          port: +this.port
        }))
      }
      return (await j90.promises.lookup(A, {
        all: !0
      })).map((B) => ({
        host: B.address,
        port: +this.port
      }))
    }
    async resolveTxt(A) {
      if (NU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return Xy("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(A);
      return j90.promises.resolveTxt(A)
    }
    startNextResolutionTimer() {
      var A, Q;
      clearTimeout(this.nextResolutionTimer), this.nextResolutionTimer = setTimeout(() => {
        if (this.stopNextResolutionTimer(), this.continueResolving) this.startResolutionWithBackoff()
      }, this.minTimeBetweenResolutionsMs), (Q = (A = this.nextResolutionTimer).unref) === null || Q === void 0 || Q.call(A), this.isNextResolutionTimerRunning = !0
    }
    stopNextResolutionTimer() {
      clearTimeout(this.nextResolutionTimer), this.isNextResolutionTimerRunning = !1
    }
    startResolutionWithBackoff() {
      if (this.pendingLookupPromise === null) this.continueResolving = !1, this.backoff.runOnce(), this.startNextResolutionTimer(), this.startResolution()
    }
    updateResolution() {
      if (this.pendingLookupPromise === null)
        if (this.isNextResolutionTimerRunning || this.backoff.isRunning()) {
          if (this.isNextResolutionTimerRunning) Xy('resolution update delayed by "min time between resolutions" rate limit');
          else Xy("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
          this.continueResolving = !0
        } else this.startResolutionWithBackoff()
    }
    destroy() {
      this.continueResolving = !1, this.backoff.reset(), this.backoff.stop(), this.stopNextResolutionTimer(), this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.returnedIpResult = !1
    }
    static getDefaultAuthority(A) {
      return A.path
    }
  }

  function vP5() {
    (0, wU2.registerResolver)("dns", LU2), (0, wU2.registerDefaultScheme)("dns")
  }
})
// @from(Start 10883128, End 10887906)
k90 = z((jU2) => {
  Object.defineProperty(jU2, "__esModule", {
    value: !0
  });
  jU2.parseCIDR = TU2;
  jU2.mapProxyName = iP5;
  jU2.getProxiedConnection = nP5;
  var dOA = zZ(),
    zJA = E6(),
    RU2 = UA("net"),
    fP5 = UA("http"),
    hP5 = zZ(),
    OU2 = eU(),
    cOA = uE(),
    gP5 = UA("url"),
    uP5 = _90(),
    mP5 = "proxy";

  function UJA(A) {
    hP5.trace(zJA.LogVerbosity.DEBUG, mP5, A)
  }

  function dP5() {
    let A = "",
      Q = "";
    if (process.env.grpc_proxy) Q = "grpc_proxy", A = process.env.grpc_proxy;
    else if (process.env.https_proxy) Q = "https_proxy", A = process.env.https_proxy;
    else if (process.env.http_proxy) Q = "http_proxy", A = process.env.http_proxy;
    else return {};
    let B;
    try {
      B = new gP5.URL(A)
    } catch (J) {
      return (0, dOA.log)(zJA.LogVerbosity.ERROR, `cannot parse value of "${Q}" env var`), {}
    }
    if (B.protocol !== "http:") return (0, dOA.log)(zJA.LogVerbosity.ERROR, `"${B.protocol}" scheme not supported in proxy URI`), {};
    let G = null;
    if (B.username)
      if (B.password)(0, dOA.log)(zJA.LogVerbosity.INFO, "userinfo found in proxy URI"), G = decodeURIComponent(`${B.username}:${B.password}`);
      else G = B.username;
    let {
      hostname: Z,
      port: I
    } = B;
    if (I === "") I = "80";
    let Y = {
      address: `${Z}:${I}`
    };
    if (G) Y.creds = G;
    return UJA("Proxy server " + Y.address + " set by environment variable " + Q), Y
  }

  function cP5() {
    let A = process.env.no_grpc_proxy,
      Q = "no_grpc_proxy";
    if (!A) A = process.env.no_proxy, Q = "no_proxy";
    if (A) return UJA("No proxy server list set by environment variable " + Q), A.split(",");
    else return []
  }

  function TU2(A) {
    let Q = A.split("/");
    if (Q.length !== 2) return null;
    let B = parseInt(Q[1], 10);
    if (!(0, RU2.isIPv4)(Q[0]) || Number.isNaN(B) || B < 0 || B > 32) return null;
    return {
      ip: PU2(Q[0]),
      prefixLength: B
    }
  }

  function PU2(A) {
    return A.split(".").reduce((Q, B) => (Q << 8) + parseInt(B, 10), 0)
  }

  function pP5(A, Q) {
    let B = A.ip,
      G = -1 << 32 - A.prefixLength;
    return (PU2(Q) & G) === (B & G)
  }

  function lP5(A) {
    for (let Q of cP5()) {
      let B = TU2(Q);
      if ((0, RU2.isIPv4)(A) && B && pP5(B, A)) return !0;
      else if (A.endsWith(Q)) return !0
    }
    return !1
  }

  function iP5(A, Q) {
    var B;
    let G = {
      target: A,
      extraOptions: {}
    };
    if (((B = Q["grpc.enable_http_proxy"]) !== null && B !== void 0 ? B : 1) === 0) return G;
    if (A.scheme === "unix") return G;
    let Z = dP5();
    if (!Z.address) return G;
    let I = (0, cOA.splitHostPort)(A.path);
    if (!I) return G;
    let Y = I.host;
    if (lP5(Y)) return UJA("Not using proxy for target in no_proxy list: " + (0, cOA.uriToString)(A)), G;
    let J = {
      "grpc.http_connect_target": (0, cOA.uriToString)(A)
    };
    if (Z.creds) J["grpc.http_connect_creds"] = Z.creds;
    return {
      target: {
        scheme: "dns",
        path: Z.address
      },
      extraOptions: J
    }
  }

  function nP5(A, Q) {
    var B;
    if (!("grpc.http_connect_target" in Q)) return Promise.resolve(null);
    let G = Q["grpc.http_connect_target"],
      Z = (0, cOA.parseUri)(G);
    if (Z === null) return Promise.resolve(null);
    let I = (0, cOA.splitHostPort)(Z.path);
    if (I === null) return Promise.resolve(null);
    let Y = `${I.host}:${(B=I.port)!==null&&B!==void 0?B:uP5.DEFAULT_PORT}`,
      J = {
        method: "CONNECT",
        path: Y
      },
      W = {
        Host: Y
      };
    if ((0, OU2.isTcpSubchannelAddress)(A)) J.host = A.host, J.port = A.port;
    else J.socketPath = A.path;
    if ("grpc.http_connect_creds" in Q) W["Proxy-Authorization"] = "Basic " + Buffer.from(Q["grpc.http_connect_creds"]).toString("base64");
    J.headers = W;
    let X = (0, OU2.subchannelAddressToString)(A);
    return UJA("Using proxy " + X + " to connect to " + J.path), new Promise((V, F) => {
      let K = fP5.request(J);
      K.once("connect", (D, H, C) => {
        if (K.removeAllListeners(), H.removeAllListeners(), D.statusCode === 200) {
          if (UJA("Successfully connected to " + J.path + " through proxy " + X), C.length > 0) H.unshift(C);
          UJA("Successfully established a plaintext connection to " + J.path + " through proxy " + X), V(H)
        } else(0, dOA.log)(zJA.LogVerbosity.ERROR, "Failed to connect to " + J.path + " through proxy " + X + " with status " + D.statusCode), F()
      }), K.once("error", (D) => {
        K.removeAllListeners(), (0, dOA.log)(zJA.LogVerbosity.ERROR, "Failed to connect to proxy " + X + " with error " + D.message), F()
      }), K.end()
    })
  }
})
// @from(Start 10887912, End 10890314)
y90 = z((_U2) => {
  Object.defineProperty(_U2, "__esModule", {
    value: !0
  });
  _U2.StreamDecoder = void 0;
  var Vy;
  (function(A) {
    A[A.NO_DATA = 0] = "NO_DATA", A[A.READING_SIZE = 1] = "READING_SIZE", A[A.READING_MESSAGE = 2] = "READING_MESSAGE"
  })(Vy || (Vy = {}));
  class SU2 {
    constructor(A) {
      this.maxReadMessageLength = A, this.readState = Vy.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
    }
    write(A) {
      let Q = 0,
        B, G = [];
      while (Q < A.length) switch (this.readState) {
        case Vy.NO_DATA:
          this.readCompressFlag = A.slice(Q, Q + 1), Q += 1, this.readState = Vy.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
          break;
        case Vy.READING_SIZE:
          if (B = Math.min(A.length - Q, this.readSizeRemaining), A.copy(this.readPartialSize, 4 - this.readSizeRemaining, Q, Q + B), this.readSizeRemaining -= B, Q += B, this.readSizeRemaining === 0) {
            if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
            if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = Vy.READING_MESSAGE;
            else {
              let Z = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
              this.readState = Vy.NO_DATA, G.push(Z)
            }
          }
          break;
        case Vy.READING_MESSAGE:
          if (B = Math.min(A.length - Q, this.readMessageRemaining), this.readPartialMessage.push(A.slice(Q, Q + B)), this.readMessageRemaining -= B, Q += B, this.readMessageRemaining === 0) {
            let Z = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
              I = Buffer.concat(Z, this.readMessageSize + 5);
            this.readState = Vy.NO_DATA, G.push(I)
          }
          break;
        default:
          throw Error("Unexpected read state")
      }
      return G
    }
  }
  _U2.StreamDecoder = SU2
})
// @from(Start 10890320, End 10901275)
bU2 = z((xU2) => {
  Object.defineProperty(xU2, "__esModule", {
    value: !0
  });
  xU2.Http2SubchannelCall = void 0;
  var bh = UA("http2"),
    oP5 = UA("os"),
    cG = E6(),
    fh = YK(),
    tP5 = y90(),
    eP5 = zZ(),
    Aj5 = E6(),
    Qj5 = "subchannel_call";

  function Bj5(A) {
    for (let [Q, B] of Object.entries(oP5.constants.errno))
      if (B === A) return Q;
    return "Unknown system error " + A
  }

  function x90(A) {
    let Q = `Received HTTP status code ${A}`,
      B;
    switch (A) {
      case 400:
        B = cG.Status.INTERNAL;
        break;
      case 401:
        B = cG.Status.UNAUTHENTICATED;
        break;
      case 403:
        B = cG.Status.PERMISSION_DENIED;
        break;
      case 404:
        B = cG.Status.UNIMPLEMENTED;
        break;
      case 429:
      case 502:
      case 503:
      case 504:
        B = cG.Status.UNAVAILABLE;
        break;
      default:
        B = cG.Status.UNKNOWN
    }
    return {
      code: B,
      details: Q,
      metadata: new fh.Metadata
    }
  }
  class yU2 {
    constructor(A, Q, B, G, Z) {
      var I;
      this.http2Stream = A, this.callEventTracker = Q, this.listener = B, this.transport = G, this.callId = Z, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
      let Y = (I = G.getOptions()["grpc.max_receive_message_length"]) !== null && I !== void 0 ? I : cG.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
      this.decoder = new tP5.StreamDecoder(Y), A.on("response", (J, W) => {
        let X = "";
        for (let V of Object.keys(J)) X += "\t\t" + V + ": " + J[V] + `
`;
        if (this.trace(`Received server headers:
` + X), this.httpStatusCode = J[":status"], W & bh.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers(J);
        else {
          let V;
          try {
            V = fh.Metadata.fromHttp2Headers(J)
          } catch (F) {
            this.endCall({
              code: cG.Status.UNKNOWN,
              details: F.message,
              metadata: new fh.Metadata
            });
            return
          }
          this.listener.onReceiveMetadata(V)
        }
      }), A.on("trailers", (J) => {
        this.handleTrailers(J)
      }), A.on("data", (J) => {
        if (this.statusOutput) return;
        this.trace("receive HTTP/2 data frame of length " + J.length);
        let W;
        try {
          W = this.decoder.write(J)
        } catch (X) {
          if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
            let V = x90(this.httpStatusCode);
            this.cancelWithStatus(V.code, V.details)
          } else this.cancelWithStatus(cG.Status.RESOURCE_EXHAUSTED, X.message);
          return
        }
        for (let X of W) this.trace("parsed message of length " + X.length), this.callEventTracker.addMessageReceived(), this.tryPush(X)
      }), A.on("end", () => {
        this.readsClosed = !0, this.maybeOutputStatus()
      }), A.on("close", () => {
        this.serverEndedCall = !0, process.nextTick(() => {
          var J;
          if (this.trace("HTTP/2 stream closed with code " + A.rstCode), ((J = this.finalStatus) === null || J === void 0 ? void 0 : J.code) === cG.Status.OK) return;
          let W, X = "";
          switch (A.rstCode) {
            case bh.constants.NGHTTP2_NO_ERROR:
              if (this.finalStatus !== null) return;
              if (this.httpStatusCode && this.httpStatusCode !== 200) {
                let V = x90(this.httpStatusCode);
                W = V.code, X = V.details
              } else W = cG.Status.INTERNAL, X = `Received RST_STREAM with code ${A.rstCode} (Call ended without gRPC status)`;
              break;
            case bh.constants.NGHTTP2_REFUSED_STREAM:
              W = cG.Status.UNAVAILABLE, X = "Stream refused by server";
              break;
            case bh.constants.NGHTTP2_CANCEL:
              if (this.connectionDropped) W = cG.Status.UNAVAILABLE, X = "Connection dropped";
              else W = cG.Status.CANCELLED, X = "Call cancelled";
              break;
            case bh.constants.NGHTTP2_ENHANCE_YOUR_CALM:
              W = cG.Status.RESOURCE_EXHAUSTED, X = "Bandwidth exhausted or memory limit exceeded";
              break;
            case bh.constants.NGHTTP2_INADEQUATE_SECURITY:
              W = cG.Status.PERMISSION_DENIED, X = "Protocol not secure enough";
              break;
            case bh.constants.NGHTTP2_INTERNAL_ERROR:
              if (W = cG.Status.INTERNAL, this.internalError === null) X = `Received RST_STREAM with code ${A.rstCode} (Internal server error)`;
              else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") W = cG.Status.UNAVAILABLE, X = this.internalError.message;
              else X = `Received RST_STREAM with code ${A.rstCode} triggered by internal client error: ${this.internalError.message}`;
              break;
            default:
              W = cG.Status.INTERNAL, X = `Received RST_STREAM with code ${A.rstCode}`
          }
          this.endCall({
            code: W,
            details: X,
            metadata: new fh.Metadata,
            rstCode: A.rstCode
          })
        })
      }), A.on("error", (J) => {
        if (J.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + J.message + " code=" + J.code + " errno=" + Bj5(J.errno) + " syscall=" + J.syscall), this.internalError = J;
        this.callEventTracker.onStreamEnd(!1)
      })
    }
    getDeadlineInfo() {
      return [`remote_addr=${this.getPeer()}`]
    }
    onDisconnect() {
      this.connectionDropped = !0, setImmediate(() => {
        this.endCall({
          code: cG.Status.UNAVAILABLE,
          details: "Connection dropped",
          metadata: new fh.Metadata
        })
      })
    }
    outputStatus() {
      if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
        this.listener.onReceiveStatus(this.finalStatus)
      }), this.http2Stream.resume()
    }
    trace(A) {
      eP5.trace(Aj5.LogVerbosity.DEBUG, Qj5, "[" + this.callId + "] " + A)
    }
    endCall(A) {
      if (this.finalStatus === null || this.finalStatus.code === cG.Status.OK) this.finalStatus = A, this.maybeOutputStatus();
      this.destroyHttp2Stream()
    }
    maybeOutputStatus() {
      if (this.finalStatus !== null) {
        if (this.finalStatus.code !== cG.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
      }
    }
    push(A) {
      this.trace("pushing to reader message of length " + (A instanceof Buffer ? A.length : null)), this.canPush = !1, this.isPushPending = !0, process.nextTick(() => {
        if (this.isPushPending = !1, this.statusOutput) return;
        this.listener.onReceiveMessage(A), this.maybeOutputStatus()
      })
    }
    tryPush(A) {
      if (this.canPush) this.http2Stream.pause(), this.push(A);
      else this.trace("unpushedReadMessages.push message of length " + A.length), this.unpushedReadMessages.push(A)
    }
    handleTrailers(A) {
      this.serverEndedCall = !0, this.callEventTracker.onStreamEnd(!0);
      let Q = "";
      for (let I of Object.keys(A)) Q += "\t\t" + I + ": " + A[I] + `
`;
      this.trace(`Received server trailers:
` + Q);
      let B;
      try {
        B = fh.Metadata.fromHttp2Headers(A)
      } catch (I) {
        B = new fh.Metadata
      }
      let G = B.getMap(),
        Z;
      if (typeof G["grpc-status"] === "string") {
        let I = Number(G["grpc-status"]);
        this.trace("received status code " + I + " from server"), B.remove("grpc-status");
        let Y = "";
        if (typeof G["grpc-message"] === "string") {
          try {
            Y = decodeURI(G["grpc-message"])
          } catch (J) {
            Y = G["grpc-message"]
          }
          B.remove("grpc-message"), this.trace('received status details string "' + Y + '" from server')
        }
        Z = {
          code: I,
          details: Y,
          metadata: B
        }
      } else if (this.httpStatusCode) Z = x90(this.httpStatusCode), Z.metadata = B;
      else Z = {
        code: cG.Status.UNKNOWN,
        details: "No status information received",
        metadata: B
      };
      this.endCall(Z)
    }
    destroyHttp2Stream() {
      var A;
      if (this.http2Stream.destroyed) return;
      if (this.serverEndedCall) this.http2Stream.end();
      else {
        let Q;
        if (((A = this.finalStatus) === null || A === void 0 ? void 0 : A.code) === cG.Status.OK) Q = bh.constants.NGHTTP2_NO_ERROR;
        else Q = bh.constants.NGHTTP2_CANCEL;
        this.trace("close http2 stream with code " + Q), this.http2Stream.close(Q)
      }
    }
    cancelWithStatus(A, Q) {
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), this.endCall({
        code: A,
        details: Q,
        metadata: new fh.Metadata
      })
    }
    getStatus() {
      return this.finalStatus
    }
    getPeer() {
      return this.transport.getPeerName()
    }
    getCallNumber() {
      return this.callId
    }
    getAuthContext() {
      return this.transport.getAuthContext()
    }
    startRead() {
      if (this.finalStatus !== null && this.finalStatus.code !== cG.Status.OK) {
        this.readsClosed = !0, this.maybeOutputStatus();
        return
      }
      if (this.canPush = !0, this.unpushedReadMessages.length > 0) {
        let A = this.unpushedReadMessages.shift();
        this.push(A);
        return
      }
      this.http2Stream.resume()
    }
    sendMessageWithContext(A, Q) {
      this.trace("write() called with message of length " + Q.length);
      let B = (G) => {
        process.nextTick(() => {
          var Z;
          let I = cG.Status.UNAVAILABLE;
          if ((G === null || G === void 0 ? void 0 : G.code) === "ERR_STREAM_WRITE_AFTER_END") I = cG.Status.INTERNAL;
          if (G) this.cancelWithStatus(I, `Write error: ${G.message}`);
          (Z = A.callback) === null || Z === void 0 || Z.call(A)
        })
      };
      this.trace("sending data chunk of length " + Q.length), this.callEventTracker.addMessageSent();
      try {
        this.http2Stream.write(Q, B)
      } catch (G) {
        this.endCall({
          code: cG.Status.UNAVAILABLE,
          details: `Write failed with error ${G.message}`,
          metadata: new fh.Metadata
        })
      }
    }
    halfClose() {
      this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
    }
  }
  xU2.Http2SubchannelCall = yU2
})