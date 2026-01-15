
// @from(Ln 297884, Col 4)
UE2 = U((iSZ, Rw5) => {
  Rw5.exports = {
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
// @from(Ln 298004, Col 4)
qE2 = U((nSZ, _w5) => {
  _w5.exports = {
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
// @from(Ln 298026, Col 4)
NE2 = U((aSZ, jw5) => {
  jw5.exports = {
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
// @from(Ln 298230, Col 4)
_E2 = U((ME2) => {
  Object.defineProperty(ME2, "__esModule", {
    value: !0
  });
  ME2.addCommonProtos = ME2.loadProtosWithOptionsSync = ME2.loadProtosWithOptions = void 0;
  var wE2 = NA("fs"),
    LE2 = NA("path"),
    MFA = zX1();

  function OE2(A, Q) {
    let B = A.resolvePath;
    A.resolvePath = (G, Z) => {
      if (LE2.isAbsolute(Z)) return Z;
      for (let Y of Q) {
        let J = LE2.join(Y, Z);
        try {
          return wE2.accessSync(J, wE2.constants.R_OK), J
        } catch (X) {
          continue
        }
      }
      return process.emitWarning(`${Z} not found in any of the include paths ${Q}`), B(G, Z)
    }
  }
  async function Tw5(A, Q) {
    let B = new MFA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
      OE2(B, Q.includeDirs)
    }
    let G = await B.load(A, Q);
    return G.resolveAll(), G
  }
  ME2.loadProtosWithOptions = Tw5;

  function Pw5(A, Q) {
    let B = new MFA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) throw Error("The includeDirs option must be an array");
      OE2(B, Q.includeDirs)
    }
    let G = B.loadSync(A, Q);
    return G.resolveAll(), G
  }
  ME2.loadProtosWithOptionsSync = Pw5;

  function Sw5() {
    let A = UE2(),
      Q = PV0(),
      B = qE2(),
      G = NE2();
    MFA.common("api", A.nested.google.nested.protobuf.nested), MFA.common("descriptor", Q.nested.google.nested.protobuf.nested), MFA.common("source_context", B.nested.google.nested.protobuf.nested), MFA.common("type", G.nested.google.nested.protobuf.nested)
  }
  ME2.addCommonProtos = Sw5
})
// @from(Ln 298285, Col 4)
jE2 = U((jvA, xV0) => {
  (function (A, Q) {
    function B(G) {
      return "default" in G ? G.default : G
    }
    if (typeof define === "function" && define.amd) define([], function () {
      var G = {};
      return Q(G), B(G)
    });
    else if (typeof jvA === "object") {
      if (Q(jvA), typeof xV0 === "object") xV0.exports = B(jvA)
    } else(function () {
      var G = {};
      Q(G), A.Long = B(G)
    })()
  })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : jvA, function (A) {
    Object.defineProperty(A, "__esModule", {
      value: !0
    }), A.default = void 0;
    var Q = null;
    try {
      Q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
    } catch {}

    function B(n, y, p) {
      this.low = n | 0, this.high = y | 0, this.unsigned = !!p
    }
    B.prototype.__isLong__, Object.defineProperty(B.prototype, "__isLong__", {
      value: !0
    });

    function G(n) {
      return (n && n.__isLong__) === !0
    }

    function Z(n) {
      var y = Math.clz32(n & -n);
      return n ? 31 - y : y
    }
    B.isLong = G;
    var Y = {},
      J = {};

    function X(n, y) {
      var p, GA, WA;
      if (y) {
        if (n >>>= 0, WA = 0 <= n && n < 256) {
          if (GA = J[n], GA) return GA
        }
        if (p = D(n, 0, !0), WA) J[n] = p;
        return p
      } else {
        if (n |= 0, WA = -128 <= n && n < 128) {
          if (GA = Y[n], GA) return GA
        }
        if (p = D(n, n < 0 ? -1 : 0, !1), WA) Y[n] = p;
        return p
      }
    }
    B.fromInt = X;

    function I(n, y) {
      if (isNaN(n)) return y ? M : L;
      if (y) {
        if (n < 0) return M;
        if (n >= z) return S
      } else {
        if (n <= -$) return u;
        if (n + 1 >= $) return b
      }
      if (n < 0) return I(-n, y).neg();
      return D(n % E | 0, n / E | 0, y)
    }
    B.fromNumber = I;

    function D(n, y, p) {
      return new B(n, y, p)
    }
    B.fromBits = D;
    var W = Math.pow;

    function K(n, y, p) {
      if (n.length === 0) throw Error("empty string");
      if (typeof y === "number") p = y, y = !1;
      else y = !!y;
      if (n === "NaN" || n === "Infinity" || n === "+Infinity" || n === "-Infinity") return y ? M : L;
      if (p = p || 10, p < 2 || 36 < p) throw RangeError("radix");
      var GA;
      if ((GA = n.indexOf("-")) > 0) throw Error("interior hyphen");
      else if (GA === 0) return K(n.substring(1), y, p).neg();
      var WA = I(W(p, 8)),
        MA = L;
      for (var TA = 0; TA < n.length; TA += 8) {
        var bA = Math.min(8, n.length - TA),
          jA = parseInt(n.substring(TA, TA + bA), p);
        if (bA < 8) {
          var OA = I(W(p, bA));
          MA = MA.mul(OA).add(I(jA))
        } else MA = MA.mul(WA), MA = MA.add(I(jA))
      }
      return MA.unsigned = y, MA
    }
    B.fromString = K;

    function V(n, y) {
      if (typeof n === "number") return I(n, y);
      if (typeof n === "string") return K(n, y);
      return D(n.low, n.high, typeof y === "boolean" ? y : n.unsigned)
    }
    B.fromValue = V;
    var F = 65536,
      H = 16777216,
      E = F * F,
      z = E * E,
      $ = z / 2,
      O = X(H),
      L = X(0);
    B.ZERO = L;
    var M = X(0, !0);
    B.UZERO = M;
    var _ = X(1);
    B.ONE = _;
    var j = X(1, !0);
    B.UONE = j;
    var x = X(-1);
    B.NEG_ONE = x;
    var b = D(-1, 2147483647, !1);
    B.MAX_VALUE = b;
    var S = D(-1, -1, !0);
    B.MAX_UNSIGNED_VALUE = S;
    var u = D(0, -2147483648, !1);
    B.MIN_VALUE = u;
    var f = B.prototype;
    if (f.toInt = function () {
        return this.unsigned ? this.low >>> 0 : this.low
      }, f.toNumber = function () {
        if (this.unsigned) return (this.high >>> 0) * E + (this.low >>> 0);
        return this.high * E + (this.low >>> 0)
      }, f.toString = function (y) {
        if (y = y || 10, y < 2 || 36 < y) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative())
          if (this.eq(u)) {
            var p = I(y),
              GA = this.div(p),
              WA = GA.mul(p).sub(this);
            return GA.toString(y) + WA.toInt().toString(y)
          } else return "-" + this.neg().toString(y);
        var MA = I(W(y, 6), this.unsigned),
          TA = this,
          bA = "";
        while (!0) {
          var jA = TA.div(MA),
            OA = TA.sub(jA.mul(MA)).toInt() >>> 0,
            IA = OA.toString(y);
          if (TA = jA, TA.isZero()) return IA + bA;
          else {
            while (IA.length < 6) IA = "0" + IA;
            bA = "" + IA + bA
          }
        }
      }, f.getHighBits = function () {
        return this.high
      }, f.getHighBitsUnsigned = function () {
        return this.high >>> 0
      }, f.getLowBits = function () {
        return this.low
      }, f.getLowBitsUnsigned = function () {
        return this.low >>> 0
      }, f.getNumBitsAbs = function () {
        if (this.isNegative()) return this.eq(u) ? 64 : this.neg().getNumBitsAbs();
        var y = this.high != 0 ? this.high : this.low;
        for (var p = 31; p > 0; p--)
          if ((y & 1 << p) != 0) break;
        return this.high != 0 ? p + 33 : p + 1
      }, f.isSafeInteger = function () {
        var y = this.high >> 21;
        if (!y) return !0;
        if (this.unsigned) return !1;
        return y === -1 && !(this.low === 0 && this.high === -2097152)
      }, f.isZero = function () {
        return this.high === 0 && this.low === 0
      }, f.eqz = f.isZero, f.isNegative = function () {
        return !this.unsigned && this.high < 0
      }, f.isPositive = function () {
        return this.unsigned || this.high >= 0
      }, f.isOdd = function () {
        return (this.low & 1) === 1
      }, f.isEven = function () {
        return (this.low & 1) === 0
      }, f.equals = function (y) {
        if (!G(y)) y = V(y);
        if (this.unsigned !== y.unsigned && this.high >>> 31 === 1 && y.high >>> 31 === 1) return !1;
        return this.high === y.high && this.low === y.low
      }, f.eq = f.equals, f.notEquals = function (y) {
        return !this.eq(y)
      }, f.neq = f.notEquals, f.ne = f.notEquals, f.lessThan = function (y) {
        return this.comp(y) < 0
      }, f.lt = f.lessThan, f.lessThanOrEqual = function (y) {
        return this.comp(y) <= 0
      }, f.lte = f.lessThanOrEqual, f.le = f.lessThanOrEqual, f.greaterThan = function (y) {
        return this.comp(y) > 0
      }, f.gt = f.greaterThan, f.greaterThanOrEqual = function (y) {
        return this.comp(y) >= 0
      }, f.gte = f.greaterThanOrEqual, f.ge = f.greaterThanOrEqual, f.compare = function (y) {
        if (!G(y)) y = V(y);
        if (this.eq(y)) return 0;
        var p = this.isNegative(),
          GA = y.isNegative();
        if (p && !GA) return -1;
        if (!p && GA) return 1;
        if (!this.unsigned) return this.sub(y).isNegative() ? -1 : 1;
        return y.high >>> 0 > this.high >>> 0 || y.high === this.high && y.low >>> 0 > this.low >>> 0 ? -1 : 1
      }, f.comp = f.compare, f.negate = function () {
        if (!this.unsigned && this.eq(u)) return u;
        return this.not().add(_)
      }, f.neg = f.negate, f.add = function (y) {
        if (!G(y)) y = V(y);
        var p = this.high >>> 16,
          GA = this.high & 65535,
          WA = this.low >>> 16,
          MA = this.low & 65535,
          TA = y.high >>> 16,
          bA = y.high & 65535,
          jA = y.low >>> 16,
          OA = y.low & 65535,
          IA = 0,
          HA = 0,
          ZA = 0,
          zA = 0;
        return zA += MA + OA, ZA += zA >>> 16, zA &= 65535, ZA += WA + jA, HA += ZA >>> 16, ZA &= 65535, HA += GA + bA, IA += HA >>> 16, HA &= 65535, IA += p + TA, IA &= 65535, D(ZA << 16 | zA, IA << 16 | HA, this.unsigned)
      }, f.subtract = function (y) {
        if (!G(y)) y = V(y);
        return this.add(y.neg())
      }, f.sub = f.subtract, f.multiply = function (y) {
        if (this.isZero()) return this;
        if (!G(y)) y = V(y);
        if (Q) {
          var p = Q.mul(this.low, this.high, y.low, y.high);
          return D(p, Q.get_high(), this.unsigned)
        }
        if (y.isZero()) return this.unsigned ? M : L;
        if (this.eq(u)) return y.isOdd() ? u : L;
        if (y.eq(u)) return this.isOdd() ? u : L;
        if (this.isNegative())
          if (y.isNegative()) return this.neg().mul(y.neg());
          else return this.neg().mul(y).neg();
        else if (y.isNegative()) return this.mul(y.neg()).neg();
        if (this.lt(O) && y.lt(O)) return I(this.toNumber() * y.toNumber(), this.unsigned);
        var GA = this.high >>> 16,
          WA = this.high & 65535,
          MA = this.low >>> 16,
          TA = this.low & 65535,
          bA = y.high >>> 16,
          jA = y.high & 65535,
          OA = y.low >>> 16,
          IA = y.low & 65535,
          HA = 0,
          ZA = 0,
          zA = 0,
          wA = 0;
        return wA += TA * IA, zA += wA >>> 16, wA &= 65535, zA += MA * IA, ZA += zA >>> 16, zA &= 65535, zA += TA * OA, ZA += zA >>> 16, zA &= 65535, ZA += WA * IA, HA += ZA >>> 16, ZA &= 65535, ZA += MA * OA, HA += ZA >>> 16, ZA &= 65535, ZA += TA * jA, HA += ZA >>> 16, ZA &= 65535, HA += GA * IA + WA * OA + MA * jA + TA * bA, HA &= 65535, D(zA << 16 | wA, HA << 16 | ZA, this.unsigned)
      }, f.mul = f.multiply, f.divide = function (y) {
        if (!G(y)) y = V(y);
        if (y.isZero()) throw Error("division by zero");
        if (Q) {
          if (!this.unsigned && this.high === -2147483648 && y.low === -1 && y.high === -1) return this;
          var p = (this.unsigned ? Q.div_u : Q.div_s)(this.low, this.high, y.low, y.high);
          return D(p, Q.get_high(), this.unsigned)
        }
        if (this.isZero()) return this.unsigned ? M : L;
        var GA, WA, MA;
        if (!this.unsigned) {
          if (this.eq(u))
            if (y.eq(_) || y.eq(x)) return u;
            else if (y.eq(u)) return _;
          else {
            var TA = this.shr(1);
            if (GA = TA.div(y).shl(1), GA.eq(L)) return y.isNegative() ? _ : x;
            else return WA = this.sub(y.mul(GA)), MA = GA.add(WA.div(y)), MA
          } else if (y.eq(u)) return this.unsigned ? M : L;
          if (this.isNegative()) {
            if (y.isNegative()) return this.neg().div(y.neg());
            return this.neg().div(y).neg()
          } else if (y.isNegative()) return this.div(y.neg()).neg();
          MA = L
        } else {
          if (!y.unsigned) y = y.toUnsigned();
          if (y.gt(this)) return M;
          if (y.gt(this.shru(1))) return j;
          MA = M
        }
        WA = this;
        while (WA.gte(y)) {
          GA = Math.max(1, Math.floor(WA.toNumber() / y.toNumber()));
          var bA = Math.ceil(Math.log(GA) / Math.LN2),
            jA = bA <= 48 ? 1 : W(2, bA - 48),
            OA = I(GA),
            IA = OA.mul(y);
          while (IA.isNegative() || IA.gt(WA)) GA -= jA, OA = I(GA, this.unsigned), IA = OA.mul(y);
          if (OA.isZero()) OA = _;
          MA = MA.add(OA), WA = WA.sub(IA)
        }
        return MA
      }, f.div = f.divide, f.modulo = function (y) {
        if (!G(y)) y = V(y);
        if (Q) {
          var p = (this.unsigned ? Q.rem_u : Q.rem_s)(this.low, this.high, y.low, y.high);
          return D(p, Q.get_high(), this.unsigned)
        }
        return this.sub(this.div(y).mul(y))
      }, f.mod = f.modulo, f.rem = f.modulo, f.not = function () {
        return D(~this.low, ~this.high, this.unsigned)
      }, f.countLeadingZeros = function () {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
      }, f.clz = f.countLeadingZeros, f.countTrailingZeros = function () {
        return this.low ? Z(this.low) : Z(this.high) + 32
      }, f.ctz = f.countTrailingZeros, f.and = function (y) {
        if (!G(y)) y = V(y);
        return D(this.low & y.low, this.high & y.high, this.unsigned)
      }, f.or = function (y) {
        if (!G(y)) y = V(y);
        return D(this.low | y.low, this.high | y.high, this.unsigned)
      }, f.xor = function (y) {
        if (!G(y)) y = V(y);
        return D(this.low ^ y.low, this.high ^ y.high, this.unsigned)
      }, f.shiftLeft = function (y) {
        if (G(y)) y = y.toInt();
        if ((y &= 63) === 0) return this;
        else if (y < 32) return D(this.low << y, this.high << y | this.low >>> 32 - y, this.unsigned);
        else return D(0, this.low << y - 32, this.unsigned)
      }, f.shl = f.shiftLeft, f.shiftRight = function (y) {
        if (G(y)) y = y.toInt();
        if ((y &= 63) === 0) return this;
        else if (y < 32) return D(this.low >>> y | this.high << 32 - y, this.high >> y, this.unsigned);
        else return D(this.high >> y - 32, this.high >= 0 ? 0 : -1, this.unsigned)
      }, f.shr = f.shiftRight, f.shiftRightUnsigned = function (y) {
        if (G(y)) y = y.toInt();
        if ((y &= 63) === 0) return this;
        if (y < 32) return D(this.low >>> y | this.high << 32 - y, this.high >>> y, this.unsigned);
        if (y === 32) return D(this.high, 0, this.unsigned);
        return D(this.high >>> y - 32, 0, this.unsigned)
      }, f.shru = f.shiftRightUnsigned, f.shr_u = f.shiftRightUnsigned, f.rotateLeft = function (y) {
        var p;
        if (G(y)) y = y.toInt();
        if ((y &= 63) === 0) return this;
        if (y === 32) return D(this.high, this.low, this.unsigned);
        if (y < 32) return p = 32 - y, D(this.low << y | this.high >>> p, this.high << y | this.low >>> p, this.unsigned);
        return y -= 32, p = 32 - y, D(this.high << y | this.low >>> p, this.low << y | this.high >>> p, this.unsigned)
      }, f.rotl = f.rotateLeft, f.rotateRight = function (y) {
        var p;
        if (G(y)) y = y.toInt();
        if ((y &= 63) === 0) return this;
        if (y === 32) return D(this.high, this.low, this.unsigned);
        if (y < 32) return p = 32 - y, D(this.high << p | this.low >>> y, this.low << p | this.high >>> y, this.unsigned);
        return y -= 32, p = 32 - y, D(this.low << p | this.high >>> y, this.high << p | this.low >>> y, this.unsigned)
      }, f.rotr = f.rotateRight, f.toSigned = function () {
        if (!this.unsigned) return this;
        return D(this.low, this.high, !1)
      }, f.toUnsigned = function () {
        if (this.unsigned) return this;
        return D(this.low, this.high, !0)
      }, f.toBytes = function (y) {
        return y ? this.toBytesLE() : this.toBytesBE()
      }, f.toBytesLE = function () {
        var y = this.high,
          p = this.low;
        return [p & 255, p >>> 8 & 255, p >>> 16 & 255, p >>> 24, y & 255, y >>> 8 & 255, y >>> 16 & 255, y >>> 24]
      }, f.toBytesBE = function () {
        var y = this.high,
          p = this.low;
        return [y >>> 24, y >>> 16 & 255, y >>> 8 & 255, y & 255, p >>> 24, p >>> 16 & 255, p >>> 8 & 255, p & 255]
      }, B.fromBytes = function (y, p, GA) {
        return GA ? B.fromBytesLE(y, p) : B.fromBytesBE(y, p)
      }, B.fromBytesLE = function (y, p) {
        return new B(y[0] | y[1] << 8 | y[2] << 16 | y[3] << 24, y[4] | y[5] << 8 | y[6] << 16 | y[7] << 24, p)
      }, B.fromBytesBE = function (y, p) {
        return new B(y[4] << 24 | y[5] << 16 | y[6] << 8 | y[7], y[0] << 24 | y[1] << 16 | y[2] << 8 | y[3], p)
      }, typeof BigInt === "function") B.fromBigInt = function (y, p) {
      var GA = Number(BigInt.asIntN(32, y)),
        WA = Number(BigInt.asIntN(32, y >> BigInt(32)));
      return D(GA, WA, p)
    }, B.fromValue = function (y, p) {
      if (typeof y === "bigint") return fromBigInt(y, p);
      return V(y, p)
    }, f.toBigInt = function () {
      var y = BigInt(this.low >>> 0),
        p = BigInt(this.unsigned ? this.high >>> 0 : this.high);
      return p << BigInt(32) | y
    };
    var AA = A.default = B
  })
})
// @from(Ln 298678, Col 4)
hV0 = U((vE2) => {
  Object.defineProperty(vE2, "__esModule", {
    value: !0
  });
  vE2.loadFileDescriptorSetFromObject = vE2.loadFileDescriptorSetFromBuffer = vE2.fromJSON = vE2.loadSync = vE2.load = vE2.IdempotencyLevel = vE2.isAnyExtension = vE2.Long = void 0;
  var vw5 = KH2(),
    Gf = zX1(),
    bV0 = CE2(),
    fV0 = _E2(),
    kw5 = jE2();
  vE2.Long = kw5;

  function bw5(A) {
    return "@type" in A && typeof A["@type"] === "string"
  }
  vE2.isAnyExtension = bw5;
  var PE2;
  (function (A) {
    A.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", A.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", A.IDEMPOTENT = "IDEMPOTENT"
  })(PE2 = vE2.IdempotencyLevel || (vE2.IdempotencyLevel = {}));
  var SE2 = {
    longs: String,
    enums: String,
    bytes: String,
    defaults: !0,
    oneofs: !0,
    json: !0
  };

  function fw5(A, Q) {
    if (A === "") return Q;
    else return A + "." + Q
  }

  function hw5(A) {
    return A instanceof Gf.Service || A instanceof Gf.Type || A instanceof Gf.Enum
  }

  function gw5(A) {
    return A instanceof Gf.Namespace || A instanceof Gf.Root
  }

  function xE2(A, Q) {
    let B = fw5(Q, A.name);
    if (hw5(A)) return [
      [B, A]
    ];
    else if (gw5(A) && typeof A.nested < "u") return Object.keys(A.nested).map((G) => {
      return xE2(A.nested[G], B)
    }).reduce((G, Z) => G.concat(Z), []);
    return []
  }

  function yV0(A, Q) {
    return function (G) {
      return A.toObject(A.decode(G), Q)
    }
  }

  function vV0(A) {
    return function (B) {
      if (Array.isArray(B)) throw Error(`Failed to serialize message: expected object with ${A.name} structure, got array instead`);
      let G = A.fromObject(B);
      return A.encode(G).finish()
    }
  }

  function uw5(A) {
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
      idempotency_level: PE2.IDEMPOTENCY_UNKNOWN,
      uninterpreted_option: []
    })
  }

  function mw5(A, Q, B, G) {
    let {
      resolvedRequestType: Z,
      resolvedResponseType: Y
    } = A;
    return {
      path: "/" + Q + "/" + A.name,
      requestStream: !!A.requestStream,
      responseStream: !!A.responseStream,
      requestSerialize: vV0(Z),
      requestDeserialize: yV0(Z, B),
      responseSerialize: vV0(Y),
      responseDeserialize: yV0(Y, B),
      originalName: vw5(A.name),
      requestType: kV0(Z, B, G),
      responseType: kV0(Y, B, G),
      options: uw5(A.parsedOptions)
    }
  }

  function dw5(A, Q, B, G) {
    let Z = {};
    for (let Y of A.methodsArray) Z[Y.name] = mw5(Y, Q, B, G);
    return Z
  }

  function kV0(A, Q, B) {
    let G = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 DescriptorProto",
      type: G.$type.toObject(G, SE2),
      fileDescriptorProtos: B,
      serialize: vV0(A),
      deserialize: yV0(A, Q)
    }
  }

  function cw5(A, Q) {
    let B = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 EnumDescriptorProto",
      type: B.$type.toObject(B, SE2),
      fileDescriptorProtos: Q
    }
  }

  function pw5(A, Q, B, G) {
    if (A instanceof Gf.Service) return dw5(A, Q, B, G);
    else if (A instanceof Gf.Type) return kV0(A, B, G);
    else if (A instanceof Gf.Enum) return cw5(A, G);
    else throw Error("Type mismatch in reflection object handling")
  }

  function UX1(A, Q) {
    let B = {};
    A.resolveAll();
    let Z = A.toDescriptor("proto3").file.map((Y) => Buffer.from(bV0.FileDescriptorProto.encode(Y).finish()));
    for (let [Y, J] of xE2(A, "")) B[Y] = pw5(J, Y, Q, Z);
    return B
  }

  function yE2(A, Q) {
    Q = Q || {};
    let B = Gf.Root.fromDescriptor(A);
    return B.resolveAll(), UX1(B, Q)
  }

  function lw5(A, Q) {
    return (0, fV0.loadProtosWithOptions)(A, Q).then((B) => {
      return UX1(B, Q)
    })
  }
  vE2.load = lw5;

  function iw5(A, Q) {
    let B = (0, fV0.loadProtosWithOptionsSync)(A, Q);
    return UX1(B, Q)
  }
  vE2.loadSync = iw5;

  function nw5(A, Q) {
    Q = Q || {};
    let B = Gf.Root.fromJSON(A);
    return B.resolveAll(), UX1(B, Q)
  }
  vE2.fromJSON = nw5;

  function aw5(A, Q) {
    let B = bV0.FileDescriptorSet.decode(A);
    return yE2(B, Q)
  }
  vE2.loadFileDescriptorSetFromBuffer = aw5;

  function ow5(A, Q) {
    let B = bV0.FileDescriptorSet.fromObject(A);
    return yE2(B, Q)
  }
  vE2.loadFileDescriptorSetFromObject = ow5;
  (0, fV0.addCommonProtos)()
})
// @from(Ln 298862, Col 4)
Vs = U((oE2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2099/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(oE2, "__esModule", {
    value: !0
  });
  oE2.registerChannelzSocket = oE2.registerChannelzServer = oE2.registerChannelzSubchannel = oE2.registerChannelzChannel = oE2.ChannelzCallTrackerStub = oE2.ChannelzCallTracker = oE2.ChannelzChildrenTrackerStub = oE2.ChannelzChildrenTracker = oE2.ChannelzTrace = oE2.ChannelzTraceStub = void 0;
  oE2.unregisterChannelzRef = JL5;
  oE2.getChannelzHandlers = nE2;
  oE2.getChannelzServiceDefinition = aE2;
  oE2.setup = $L5;
  var NX1 = NA("net"),
    B6A = FF2(),
    TvA = XU(),
    PvA = j8(),
    BL5 = hN(),
    GL5 = nJ1(),
    ZL5 = oJ1();

  function gV0(A) {
    return {
      channel_id: A.id,
      name: A.name
    }
  }

  function uV0(A) {
    return {
      subchannel_id: A.id,
      name: A.name
    }
  }

  function YL5(A) {
    return {
      server_id: A.id
    }
  }

  function wX1(A) {
    return {
      socket_id: A.id,
      name: A.name
    }
  }
  var bE2 = 32,
    mV0 = 100;
  class uE2 {
    constructor() {
      this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
    }
    addTrace() {}
    getTraceMessage() {
      return {
        creation_timestamp: Zf(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: []
      }
    }
  }
  oE2.ChannelzTraceStub = uE2;
  class mE2 {
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
        }), this.events.length >= bE2 * 2) this.events = this.events.slice(bE2);
      this.eventsLogged += 1
    }
    getTraceMessage() {
      return {
        creation_timestamp: Zf(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: this.events.map((A) => {
          return {
            description: A.description,
            severity: A.severity,
            timestamp: Zf(A.timestamp),
            channel_ref: A.childChannel ? gV0(A.childChannel) : null,
            subchannel_ref: A.childSubchannel ? uV0(A.childSubchannel) : null
          }
        })
      }
    }
  }
  oE2.ChannelzTrace = mE2;
  class dV0 {
    constructor() {
      this.channelChildren = new B6A.OrderedMap, this.subchannelChildren = new B6A.OrderedMap, this.socketChildren = new B6A.OrderedMap, this.trackerMap = {
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
  oE2.ChannelzChildrenTracker = dV0;
  class dE2 extends dV0 {
    refChild() {}
    unrefChild() {}
  }
  oE2.ChannelzChildrenTrackerStub = dE2;
  class cV0 {
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
  oE2.ChannelzCallTracker = cV0;
  class cE2 extends cV0 {
    addCallStarted() {}
    addCallSucceeded() {}
    addCallFailed() {}
  }
  oE2.ChannelzCallTrackerStub = cE2;
  var od = {
      ["channel"]: new B6A.OrderedMap,
      ["subchannel"]: new B6A.OrderedMap,
      ["server"]: new B6A.OrderedMap,
      ["socket"]: new B6A.OrderedMap
    },
    LX1 = (A) => {
      let Q = 1;

      function B() {
        return Q++
      }
      let G = od[A];
      return (Z, Y, J) => {
        let X = B(),
          I = {
            id: X,
            name: Z,
            kind: A
          };
        if (J) G.setElement(X, {
          ref: I,
          getInfo: Y
        });
        return I
      }
    };
  oE2.registerChannelzChannel = LX1("channel");
  oE2.registerChannelzSubchannel = LX1("subchannel");
  oE2.registerChannelzServer = LX1("server");
  oE2.registerChannelzSocket = LX1("socket");

  function JL5(A) {
    od[A.kind].eraseElementByKey(A.id)
  }

  function XL5(A) {
    let Q = Number.parseInt(A, 16);
    return [Q / 256 | 0, Q % 256]
  }

  function fE2(A) {
    if (A === "") return [];
    let Q = A.split(":").map((G) => XL5(G));
    return [].concat(...Q)
  }

  function IL5(A) {
    return (0, NX1.isIPv6)(A) && A.toLowerCase().startsWith("::ffff:") && (0, NX1.isIPv4)(A.substring(7))
  }

  function hE2(A) {
    return Buffer.from(Uint8Array.from(A.split(".").map((Q) => Number.parseInt(Q))))
  }

  function DL5(A) {
    if ((0, NX1.isIPv4)(A)) return hE2(A);
    else if (IL5(A)) return hE2(A.substring(7));
    else if ((0, NX1.isIPv6)(A)) {
      let Q, B, G = A.indexOf("::");
      if (G === -1) Q = A, B = "";
      else Q = A.substring(0, G), B = A.substring(G + 2);
      let Z = Buffer.from(fE2(Q)),
        Y = Buffer.from(fE2(B)),
        J = Buffer.alloc(16 - Z.length - Y.length, 0);
      return Buffer.concat([Z, J, Y])
    } else return null
  }

  function pE2(A) {
    switch (A) {
      case TvA.ConnectivityState.CONNECTING:
        return {
          state: "CONNECTING"
        };
      case TvA.ConnectivityState.IDLE:
        return {
          state: "IDLE"
        };
      case TvA.ConnectivityState.READY:
        return {
          state: "READY"
        };
      case TvA.ConnectivityState.SHUTDOWN:
        return {
          state: "SHUTDOWN"
        };
      case TvA.ConnectivityState.TRANSIENT_FAILURE:
        return {
          state: "TRANSIENT_FAILURE"
        };
      default:
        return {
          state: "UNKNOWN"
        }
    }
  }

  function Zf(A) {
    if (!A) return null;
    let Q = A.getTime();
    return {
      seconds: Q / 1000 | 0,
      nanos: Q % 1000 * 1e6
    }
  }

  function lE2(A) {
    let Q = A.getInfo(),
      B = [],
      G = [];
    return Q.children.channels.forEach((Z) => {
      B.push(gV0(Z[1].ref))
    }), Q.children.subchannels.forEach((Z) => {
      G.push(uV0(Z[1].ref))
    }), {
      ref: gV0(A.ref),
      data: {
        target: Q.target,
        state: pE2(Q.state),
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Zf(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      channel_ref: B,
      subchannel_ref: G
    }
  }

  function WL5(A, Q) {
    let B = parseInt(A.request.channel_id, 10),
      G = od.channel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: PvA.Status.NOT_FOUND,
        details: "No channel data found for id " + B
      });
      return
    }
    Q(null, {
      channel: lE2(G)
    })
  }

  function KL5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || mV0,
      G = [],
      Z = parseInt(A.request.start_channel_id, 10),
      Y = od.channel,
      J;
    for (J = Y.lowerBound(Z); !J.equals(Y.end()) && G.length < B; J = J.next()) G.push(lE2(J.pointer[1]));
    Q(null, {
      channel: G,
      end: J.equals(Y.end())
    })
  }

  function iE2(A) {
    let Q = A.getInfo(),
      B = [];
    return Q.listenerChildren.sockets.forEach((G) => {
      B.push(wX1(G[1].ref))
    }), {
      ref: YL5(A.ref),
      data: {
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Zf(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      listen_socket: B
    }
  }

  function VL5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      Z = od.server.getElementByKey(B);
    if (Z === void 0) {
      Q({
        code: PvA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    Q(null, {
      server: iE2(Z)
    })
  }

  function FL5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || mV0,
      G = parseInt(A.request.start_server_id, 10),
      Z = od.server,
      Y = [],
      J;
    for (J = Z.lowerBound(G); !J.equals(Z.end()) && Y.length < B; J = J.next()) Y.push(iE2(J.pointer[1]));
    Q(null, {
      server: Y,
      end: J.equals(Z.end())
    })
  }

  function HL5(A, Q) {
    let B = parseInt(A.request.subchannel_id, 10),
      G = od.subchannel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: PvA.Status.NOT_FOUND,
        details: "No subchannel data found for id " + B
      });
      return
    }
    let Z = G.getInfo(),
      Y = [];
    Z.children.sockets.forEach((X) => {
      Y.push(wX1(X[1].ref))
    });
    let J = {
      ref: uV0(G.ref),
      data: {
        target: Z.target,
        state: pE2(Z.state),
        calls_started: Z.callTracker.callsStarted,
        calls_succeeded: Z.callTracker.callsSucceeded,
        calls_failed: Z.callTracker.callsFailed,
        last_call_started_timestamp: Zf(Z.callTracker.lastCallStartedTimestamp),
        trace: Z.trace.getTraceMessage()
      },
      socket_ref: Y
    };
    Q(null, {
      subchannel: J
    })
  }

  function gE2(A) {
    var Q;
    if ((0, BL5.isTcpSubchannelAddress)(A)) return {
      address: "tcpip_address",
      tcpip_address: {
        ip_address: (Q = DL5(A.host)) !== null && Q !== void 0 ? Q : void 0,
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

  function EL5(A, Q) {
    var B, G, Z, Y, J;
    let X = parseInt(A.request.socket_id, 10),
      I = od.socket.getElementByKey(X);
    if (I === void 0) {
      Q({
        code: PvA.Status.NOT_FOUND,
        details: "No socket data found for id " + X
      });
      return
    }
    let D = I.getInfo(),
      W = D.security ? {
        model: "tls",
        tls: {
          cipher_suite: D.security.cipherSuiteStandardName ? "standard_name" : "other_name",
          standard_name: (B = D.security.cipherSuiteStandardName) !== null && B !== void 0 ? B : void 0,
          other_name: (G = D.security.cipherSuiteOtherName) !== null && G !== void 0 ? G : void 0,
          local_certificate: (Z = D.security.localCertificate) !== null && Z !== void 0 ? Z : void 0,
          remote_certificate: (Y = D.security.remoteCertificate) !== null && Y !== void 0 ? Y : void 0
        }
      } : null,
      K = {
        ref: wX1(I.ref),
        local: D.localAddress ? gE2(D.localAddress) : null,
        remote: D.remoteAddress ? gE2(D.remoteAddress) : null,
        remote_name: (J = D.remoteName) !== null && J !== void 0 ? J : void 0,
        security: W,
        data: {
          keep_alives_sent: D.keepAlivesSent,
          streams_started: D.streamsStarted,
          streams_succeeded: D.streamsSucceeded,
          streams_failed: D.streamsFailed,
          last_local_stream_created_timestamp: Zf(D.lastLocalStreamCreatedTimestamp),
          last_remote_stream_created_timestamp: Zf(D.lastRemoteStreamCreatedTimestamp),
          messages_received: D.messagesReceived,
          messages_sent: D.messagesSent,
          last_message_received_timestamp: Zf(D.lastMessageReceivedTimestamp),
          last_message_sent_timestamp: Zf(D.lastMessageSentTimestamp),
          local_flow_control_window: D.localFlowControlWindow ? {
            value: D.localFlowControlWindow
          } : null,
          remote_flow_control_window: D.remoteFlowControlWindow ? {
            value: D.remoteFlowControlWindow
          } : null
        }
      };
    Q(null, {
      socket: K
    })
  }

  function zL5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      G = od.server.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: PvA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    let Z = parseInt(A.request.start_socket_id, 10),
      Y = parseInt(A.request.max_results, 10) || mV0,
      X = G.getInfo().sessionChildren.sockets,
      I = [],
      D;
    for (D = X.lowerBound(Z); !D.equals(X.end()) && I.length < Y; D = D.next()) I.push(wX1(D.pointer[1].ref));
    Q(null, {
      socket_ref: I,
      end: D.equals(X.end())
    })
  }

  function nE2() {
    return {
      GetChannel: WL5,
      GetTopChannels: KL5,
      GetServer: VL5,
      GetServers: FL5,
      GetSubchannel: HL5,
      GetSocket: EL5,
      GetServerSockets: zL5
    }
  }
  var qX1 = null;

  function aE2() {
    if (qX1) return qX1;
    let A = hV0().loadSync,
      Q = A("channelz.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto`]
      });
    return qX1 = (0, ZL5.loadPackageDefinition)(Q).grpc.channelz.v1.Channelz.service, qX1
  }

  function $L5() {
    (0, GL5.registerAdminService)(aE2, nE2)
  }
})
// @from(Ln 299373, Col 4)
OX1 = U((sE2) => {
  Object.defineProperty(sE2, "__esModule", {
    value: !0
  });
  sE2.getNextCallNumber = xL5;
  var SL5 = 0;

  function xL5() {
    return SL5++
  }
})
// @from(Ln 299384, Col 4)
pV0 = U((eE2) => {
  Object.defineProperty(eE2, "__esModule", {
    value: !0
  });
  eE2.CompressionAlgorithms = void 0;
  var tE2;
  (function (A) {
    A[A.identity = 0] = "identity", A[A.deflate = 1] = "deflate", A[A.gzip = 2] = "gzip"
  })(tE2 || (eE2.CompressionAlgorithms = tE2 = {}))
})
// @from(Ln 299394, Col 4)
lV0 = U((Bz2) => {
  Object.defineProperty(Bz2, "__esModule", {
    value: !0
  });
  Bz2.BaseFilter = void 0;
  class Qz2 {
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
  Bz2.BaseFilter = Qz2
})
// @from(Ln 299418, Col 4)
nV0 = U((Wz2) => {
  Object.defineProperty(Wz2, "__esModule", {
    value: !0
  });
  Wz2.CompressionFilterFactory = Wz2.CompressionFilter = void 0;
  var MX1 = NA("zlib"),
    Yz2 = pV0(),
    RFA = j8(),
    vL5 = lV0(),
    kL5 = WY(),
    bL5 = (A) => {
      return typeof A === "number" && typeof Yz2.CompressionAlgorithms[A] === "string"
    };
  class SvA {
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
  class _FA extends SvA {
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
  class Jz2 extends SvA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        MX1.deflate(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          Y = MX1.createInflate();
        Y.on("data", (J) => {
          if (Z.push(J), G += J.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) Y.destroy(), B({
            code: RFA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), Y.on("end", () => {
          Q(Buffer.concat(Z))
        }), Y.write(A), Y.end()
      })
    }
  }
  class Xz2 extends SvA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        MX1.gzip(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          Y = MX1.createGunzip();
        Y.on("data", (J) => {
          if (Z.push(J), G += J.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) Y.destroy(), B({
            code: RFA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), Y.on("end", () => {
          Q(Buffer.concat(Z))
        }), Y.write(A), Y.end()
      })
    }
  }
  class Iz2 extends SvA {
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

  function Zz2(A, Q) {
    switch (A) {
      case "identity":
        return new _FA;
      case "deflate":
        return new Jz2(Q);
      case "gzip":
        return new Xz2(Q);
      default:
        return new Iz2(A)
    }
  }
  class iV0 extends vL5.BaseFilter {
    constructor(A, Q) {
      var B, G, Z;
      super();
      this.sharedFilterConfig = Q, this.sendCompression = new _FA, this.receiveCompression = new _FA, this.currentCompressionAlgorithm = "identity";
      let Y = A["grpc.default_compression_algorithm"];
      if (this.maxReceiveMessageLength = (B = A["grpc.max_receive_message_length"]) !== null && B !== void 0 ? B : RFA.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (G = A["grpc.max_send_message_length"]) !== null && G !== void 0 ? G : RFA.DEFAULT_MAX_SEND_MESSAGE_LENGTH, Y !== void 0)
        if (bL5(Y)) {
          let J = Yz2.CompressionAlgorithms[Y],
            X = (Z = Q.serverSupportedEncodingHeader) === null || Z === void 0 ? void 0 : Z.split(",");
          if (!X || X.includes(J)) this.currentCompressionAlgorithm = J, this.sendCompression = Zz2(this.currentCompressionAlgorithm, -1)
        } else kL5.log(RFA.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${Y}`)
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
        if (typeof G === "string") this.receiveCompression = Zz2(G, this.maxReceiveMessageLength)
      }
      A.remove("grpc-encoding");
      let B = A.get("grpc-accept-encoding")[0];
      if (B) {
        if (this.sharedFilterConfig.serverSupportedEncodingHeader = B, !B.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new _FA, this.currentCompressionAlgorithm = "identity"
      }
      return A.remove("grpc-accept-encoding"), A
    }
    async sendMessage(A) {
      var Q;
      let B = await A;
      if (this.maxSendMessageLength !== -1 && B.message.length > this.maxSendMessageLength) throw {
        code: RFA.Status.RESOURCE_EXHAUSTED,
        details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
      };
      let G;
      if (this.sendCompression instanceof _FA) G = !1;
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
  Wz2.CompressionFilter = iV0;
  class Dz2 {
    constructor(A, Q) {
      this.options = Q, this.sharedFilterConfig = {}
    }
    createFilter() {
      return new iV0(this.options, this.sharedFilterConfig)
    }
  }
  Wz2.CompressionFilterFactory = Dz2
})
// @from(Ln 299602, Col 4)
xvA = U((Vz2) => {
  Object.defineProperty(Vz2, "__esModule", {
    value: !0
  });
  Vz2.restrictControlPlaneStatusCode = gL5;
  var Yf = j8(),
    hL5 = [Yf.Status.OK, Yf.Status.INVALID_ARGUMENT, Yf.Status.NOT_FOUND, Yf.Status.ALREADY_EXISTS, Yf.Status.FAILED_PRECONDITION, Yf.Status.ABORTED, Yf.Status.OUT_OF_RANGE, Yf.Status.DATA_LOSS];

  function gL5(A, Q) {
    if (hL5.includes(A)) return {
      code: Yf.Status.INTERNAL,
      details: `Invalid status from control plane: ${A} ${Yf.Status[A]} ${Q}`
    };
    else return {
      code: A,
      details: Q
    }
  }
})
// @from(Ln 299621, Col 4)
jFA = U((Fz2) => {
  Object.defineProperty(Fz2, "__esModule", {
    value: !0
  });
  Fz2.minDeadline = mL5;
  Fz2.getDeadlineTimeoutString = cL5;
  Fz2.getRelativeTimeout = lL5;
  Fz2.deadlineToString = iL5;
  Fz2.formatDateDifference = nL5;

  function mL5(...A) {
    let Q = 1 / 0;
    for (let B of A) {
      let G = B instanceof Date ? B.getTime() : B;
      if (G < Q) Q = G
    }
    return Q
  }
  var dL5 = [
    ["m", 1],
    ["S", 1000],
    ["M", 60000],
    ["H", 3600000]
  ];

  function cL5(A) {
    let Q = new Date().getTime();
    if (A instanceof Date) A = A.getTime();
    let B = Math.max(A - Q, 0);
    for (let [G, Z] of dL5) {
      let Y = B / Z;
      if (Y < 1e8) return String(Math.ceil(Y)) + G
    }
    throw Error("Deadline is too far in the future")
  }
  var pL5 = 2147483647;

  function lL5(A) {
    let Q = A instanceof Date ? A.getTime() : A,
      B = new Date().getTime(),
      G = Q - B;
    if (G < 0) return 0;
    else if (G > pL5) return 1 / 0;
    else return G
  }

  function iL5(A) {
    if (A instanceof Date) return A.toISOString();
    else {
      let Q = new Date(A);
      if (Number.isNaN(Q.getTime())) return "" + A;
      else return Q.toISOString()
    }
  }

  function nL5(A, Q) {
    return ((Q.getTime() - A.getTime()) / 1000).toFixed(3) + "s"
  }
})
// @from(Ln 299680, Col 4)
RX1 = U((Hz2) => {
  Object.defineProperty(Hz2, "__esModule", {
    value: !0
  });
  Hz2.FilterStackFactory = Hz2.FilterStack = void 0;
  class aV0 {
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
  Hz2.FilterStack = aV0;
  class oV0 {
    constructor(A) {
      this.factories = A
    }
    push(A) {
      this.factories.unshift(...A)
    }
    clone() {
      return new oV0([...this.factories])
    }
    createFilter() {
      return new aV0(this.factories.map((A) => A.createFilter()))
    }
  }
  Hz2.FilterStackFactory = oV0
})
// @from(Ln 299738, Col 4)
qz2 = U((Cz2) => {
  Object.defineProperty(Cz2, "__esModule", {
    value: !0
  });
  Cz2.SingleSubchannelChannel = void 0;
  var AO5 = OX1(),
    yvA = Vs(),
    QO5 = nV0(),
    BO5 = XU(),
    vvA = j8(),
    GO5 = xvA(),
    ZO5 = jFA(),
    YO5 = RX1(),
    rV0 = jF(),
    JO5 = gS(),
    _X1 = JU();
  class zz2 {
    constructor(A, Q, B, G, Z) {
      var Y, J;
      this.subchannel = A, this.method = Q, this.options = G, this.callNumber = Z, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
      let X = this.method.split("/"),
        I = "";
      if (X.length >= 2) I = X[1];
      let D = (J = (Y = (0, _X1.splitHostPort)(this.options.host)) === null || Y === void 0 ? void 0 : Y.host) !== null && J !== void 0 ? J : "localhost";
      this.serviceUrl = `https://${D}/${I}`;
      let W = (0, ZO5.getRelativeTimeout)(G.deadline);
      if (W !== 1 / 0)
        if (W <= 0) this.cancelWithStatus(vvA.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
        else setTimeout(() => {
          this.cancelWithStatus(vvA.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
        }, W);
      this.filterStack = B.createFilter()
    }
    cancelWithStatus(A, Q) {
      if (this.childCall) this.childCall.cancelWithStatus(A, Q);
      else this.pendingStatus = {
        code: A,
        details: Q,
        metadata: new rV0.Metadata
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
      if (this.subchannel.getConnectivityState() !== BO5.ConnectivityState.READY) {
        Q.onReceiveStatus({
          code: vvA.Status.UNAVAILABLE,
          details: "Subchannel not ready",
          metadata: new rV0.Metadata
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
      } catch (Y) {
        let J = Y,
          {
            code: X,
            details: I
          } = (0, GO5.restrictControlPlaneStatusCode)(typeof J.code === "number" ? J.code : vvA.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${J.message}`);
        Q.onReceiveStatus({
          code: X,
          details: I,
          metadata: new rV0.Metadata
        });
        return
      }
      G.merge(B);
      let Z = {
        onReceiveMetadata: async (Y) => {
          Q.onReceiveMetadata(await this.filterStack.receiveMetadata(Y))
        },
        onReceiveMessage: async (Y) => {
          this.readFilterPending = !0;
          let J = await this.filterStack.receiveMessage(Y);
          if (this.readFilterPending = !1, Q.onReceiveMessage(J), this.pendingStatus) Q.onReceiveStatus(this.pendingStatus)
        },
        onReceiveStatus: async (Y) => {
          let J = await this.filterStack.receiveTrailers(Y);
          if (this.readFilterPending) this.pendingStatus = J;
          else Q.onReceiveStatus(J)
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
  class $z2 {
    constructor(A, Q, B) {
      if (this.subchannel = A, this.target = Q, this.channelzEnabled = !1, this.channelzTrace = new yvA.ChannelzTrace, this.callTracker = new yvA.ChannelzCallTracker, this.childrenTracker = new yvA.ChannelzChildrenTracker, this.channelzEnabled = B["grpc.enable_channelz"] !== 0, this.channelzRef = (0, yvA.registerChannelzChannel)((0, _X1.uriToString)(Q), () => ({
          target: `${(0,_X1.uriToString)(Q)} (${A.getAddress()})`,
          state: this.subchannel.getConnectivityState(),
          trace: this.channelzTrace,
          callTracker: this.callTracker,
          children: this.childrenTracker.getChildLists()
        }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(A.getChannelzRef());
      this.filterStackFactory = new YO5.FilterStackFactory([new QO5.CompressionFilterFactory(this, B)])
    }
    close() {
      if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
      (0, yvA.unregisterChannelzRef)(this.channelzRef)
    }
    getTarget() {
      return (0, _X1.uriToString)(this.target)
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
        host: (0, JO5.getDefaultAuthority)(this.target),
        flags: vvA.Propagate.DEFAULTS,
        parentCall: null
      };
      return new zz2(this.subchannel, A, this.filterStackFactory, B, (0, AO5.getNextCallNumber)())
    }
  }
  Cz2.SingleSubchannelChannel = $z2
})
// @from(Ln 299907, Col 4)
Oz2 = U((wz2) => {
  Object.defineProperty(wz2, "__esModule", {
    value: !0
  });
  wz2.Subchannel = void 0;
  var fZ = XU(),
    XO5 = HFA(),
    sV0 = WY(),
    jX1 = j8(),
    IO5 = JU(),
    DO5 = hN(),
    Jf = Vs(),
    WO5 = qz2(),
    KO5 = "subchannel",
    VO5 = 2147483647;
  class Nz2 {
    constructor(A, Q, B, G, Z) {
      var Y;
      this.channelTarget = A, this.subchannelAddress = Q, this.options = B, this.connector = Z, this.connectivityState = fZ.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
      let J = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      if (this.backoffTimeout = new XO5.BackoffTimeout(() => {
          this.handleBackoffTimer()
        }, J), this.backoffTimeout.unref(), this.subchannelAddressString = (0, DO5.subchannelAddressToString)(Q), this.keepaliveTime = (Y = B["grpc.keepalive_time_ms"]) !== null && Y !== void 0 ? Y : -1, B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Jf.ChannelzTraceStub, this.callTracker = new Jf.ChannelzCallTrackerStub, this.childrenTracker = new Jf.ChannelzChildrenTrackerStub, this.streamTracker = new Jf.ChannelzCallTrackerStub;
      else this.channelzTrace = new Jf.ChannelzTrace, this.callTracker = new Jf.ChannelzCallTracker, this.childrenTracker = new Jf.ChannelzChildrenTracker, this.streamTracker = new Jf.ChannelzCallTracker;
      this.channelzRef = (0, Jf.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(B, void 0, 2)), this.secureConnector = G._createSecureConnector(A, B)
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
      sV0.trace(jX1.LogVerbosity.DEBUG, KO5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    refTrace(A) {
      sV0.trace(jX1.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    handleBackoffTimer() {
      if (this.continueConnecting) this.transitionToState([fZ.ConnectivityState.TRANSIENT_FAILURE], fZ.ConnectivityState.CONNECTING);
      else this.transitionToState([fZ.ConnectivityState.TRANSIENT_FAILURE], fZ.ConnectivityState.IDLE)
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
        let Q = Math.min(this.keepaliveTime, VO5);
        A = Object.assign(Object.assign({}, A), {
          "grpc.keepalive_time_ms": Q
        })
      }
      this.connector.connect(this.subchannelAddress, this.secureConnector, A).then((Q) => {
        if (this.transitionToState([fZ.ConnectivityState.CONNECTING], fZ.ConnectivityState.READY)) {
          if (this.transport = Q, this.channelzEnabled) this.childrenTracker.refChild(Q.getChannelzRef());
          Q.addDisconnectListener((B) => {
            if (this.transitionToState([fZ.ConnectivityState.READY], fZ.ConnectivityState.IDLE), B && this.keepaliveTime > 0) this.keepaliveTime *= 2, sV0.log(jX1.LogVerbosity.ERROR, `Connection to ${(0,IO5.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
          })
        } else Q.shutdown()
      }, (Q) => {
        this.transitionToState([fZ.ConnectivityState.CONNECTING], fZ.ConnectivityState.TRANSIENT_FAILURE, `${Q}`)
      })
    }
    transitionToState(A, Q, B) {
      var G, Z;
      if (A.indexOf(this.connectivityState) === -1) return !1;
      if (B) this.trace(fZ.ConnectivityState[this.connectivityState] + " -> " + fZ.ConnectivityState[Q] + ' with error "' + B + '"');
      else this.trace(fZ.ConnectivityState[this.connectivityState] + " -> " + fZ.ConnectivityState[Q]);
      if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + fZ.ConnectivityState[Q]);
      let Y = this.connectivityState;
      switch (this.connectivityState = Q, Q) {
        case fZ.ConnectivityState.READY:
          this.stopBackoff();
          break;
        case fZ.ConnectivityState.CONNECTING:
          this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
          break;
        case fZ.ConnectivityState.TRANSIENT_FAILURE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          if ((G = this.transport) === null || G === void 0 || G.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
            this.handleBackoffTimer()
          });
          break;
        case fZ.ConnectivityState.IDLE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          (Z = this.transport) === null || Z === void 0 || Z.shutdown(), this.transport = null;
          break;
        default:
          throw Error(`Invalid state: unknown ConnectivityState ${Q}`)
      }
      for (let J of this.stateListeners) J(this, Y, Q, this.keepaliveTime, B);
      return !0
    }
    ref() {
      this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
    }
    unref() {
      if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, Jf.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
        this.transitionToState([fZ.ConnectivityState.CONNECTING, fZ.ConnectivityState.READY], fZ.ConnectivityState.IDLE)
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
        onCallEnd: (Y) => {
          if (Y.code === jX1.Status.OK) this.callTracker.addCallSucceeded();
          else this.callTracker.addCallFailed()
        }
      };
      else Z = {};
      return this.transport.createCall(A, Q, B, G, Z)
    }
    startConnecting() {
      process.nextTick(() => {
        if (!this.transitionToState([fZ.ConnectivityState.IDLE], fZ.ConnectivityState.CONNECTING)) {
          if (this.connectivityState === fZ.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
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
        this.backoffTimeout.reset(), this.transitionToState([fZ.ConnectivityState.TRANSIENT_FAILURE], fZ.ConnectivityState.CONNECTING)
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
      if (!this.subchannelChannel) this.subchannelChannel = new WO5.SingleSubchannelChannel(this, this.channelTarget, this.options);
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
  wz2.Subchannel = Nz2
})
// @from(Ln 300097, Col 4)
_z2 = U((Mz2) => {
  var tV0;
  Object.defineProperty(Mz2, "__esModule", {
    value: !0
  });
  Mz2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
  Mz2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((tV0 = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && tV0 !== void 0 ? tV0 : "false") === "true"
})
// @from(Ln 300105, Col 4)
QF0 = U((xz2) => {
  Object.defineProperty(xz2, "__esModule", {
    value: !0
  });
  xz2.DEFAULT_PORT = void 0;
  xz2.setup = qO5;
  var jz2 = gS(),
    eV0 = NA("dns"),
    FO5 = fK0(),
    AF0 = j8(),
    TFA = r4A(),
    HO5 = jF(),
    EO5 = WY(),
    zO5 = j8(),
    Fs = JU(),
    Tz2 = NA("net"),
    $O5 = HFA(),
    Pz2 = _z2(),
    CO5 = "dns_resolver";

  function Xf(A) {
    EO5.trace(zO5.LogVerbosity.DEBUG, CO5, A)
  }
  xz2.DEFAULT_PORT = 443;
  var UO5 = 30000;
  class Sz2 {
    constructor(A, Q, B) {
      var G, Z, Y;
      if (this.target = A, this.listener = Q, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new eV0.promises.Resolver, Xf("Resolver constructed for target " + (0, Fs.uriToString)(A)), A.authority) this.alternativeResolver.setServers([A.authority]);
      let J = (0, Fs.splitHostPort)(A.path);
      if (J === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
      else if ((0, Tz2.isIPv4)(J.host) || (0, Tz2.isIPv6)(J.host)) this.ipResult = [{
        addresses: [{
          host: J.host,
          port: (G = J.port) !== null && G !== void 0 ? G : xz2.DEFAULT_PORT
        }]
      }], this.dnsHostname = null, this.port = null;
      else this.ipResult = null, this.dnsHostname = J.host, this.port = (Z = J.port) !== null && Z !== void 0 ? Z : xz2.DEFAULT_PORT;
      if (this.percentage = Math.random() * 100, B["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
      this.defaultResolutionError = {
        code: AF0.Status.UNAVAILABLE,
        details: `Name resolution failed for target ${(0,Fs.uriToString)(this.target)}`,
        metadata: new HO5.Metadata
      };
      let X = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoff = new $O5.BackoffTimeout(() => {
        if (this.continueResolving) this.startResolutionWithBackoff()
      }, X), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (Y = B["grpc.dns_min_time_between_resolutions_ms"]) !== null && Y !== void 0 ? Y : UO5, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
    }
    startResolution() {
      if (this.ipResult !== null) {
        if (!this.returnedIpResult) Xf("Returning IP address for target " + (0, Fs.uriToString)(this.target)), setImmediate(() => {
          this.listener((0, TFA.statusOrFromValue)(this.ipResult), {}, null, "")
        }), this.returnedIpResult = !0;
        this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
        return
      }
      if (this.dnsHostname === null) Xf("Failed to parse DNS address " + (0, Fs.uriToString)(this.target)), setImmediate(() => {
        this.listener((0, TFA.statusOrFromError)({
          code: AF0.Status.UNAVAILABLE,
          details: `Failed to parse DNS address ${(0,Fs.uriToString)(this.target)}`
        }), {}, null, "")
      }), this.stopNextResolutionTimer();
      else {
        if (this.pendingLookupPromise !== null) return;
        Xf("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
        let A = this.dnsHostname;
        if (this.pendingLookupPromise = this.lookup(A), this.pendingLookupPromise.then((Q) => {
            if (this.pendingLookupPromise === null) return;
            this.pendingLookupPromise = null, this.latestLookupResult = (0, TFA.statusOrFromValue)(Q.map((Z) => ({
              addresses: [Z]
            })));
            let B = "[" + Q.map((Z) => Z.host + ":" + Z.port).join(",") + "]";
            Xf("Resolved addresses for target " + (0, Fs.uriToString)(this.target) + ": " + B);
            let G = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
            this.handleHealthStatus(G)
          }, (Q) => {
            if (this.pendingLookupPromise === null) return;
            Xf("Resolution error for target " + (0, Fs.uriToString)(this.target) + ": " + Q.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, TFA.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
          }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(A), this.pendingTxtPromise.then((Q) => {
          if (this.pendingTxtPromise === null) return;
          this.pendingTxtPromise = null;
          let B;
          try {
            if (B = (0, FO5.extractAndSelectServiceConfig)(Q, this.percentage), B) this.latestServiceConfigResult = (0, TFA.statusOrFromValue)(B);
            else this.latestServiceConfigResult = null
          } catch (G) {
            this.latestServiceConfigResult = (0, TFA.statusOrFromError)({
              code: AF0.Status.UNAVAILABLE,
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
      if (Pz2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
        Xf("Using alternative DNS resolver.");
        let B = await Promise.allSettled([this.alternativeResolver.resolve4(A), this.alternativeResolver.resolve6(A)]);
        if (B.every((G) => G.status === "rejected")) throw Error(B[0].reason);
        return B.reduce((G, Z) => {
          return Z.status === "fulfilled" ? [...G, ...Z.value] : G
        }, []).map((G) => ({
          host: G,
          port: +this.port
        }))
      }
      return (await eV0.promises.lookup(A, {
        all: !0
      })).map((B) => ({
        host: B.address,
        port: +this.port
      }))
    }
    async resolveTxt(A) {
      if (Pz2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return Xf("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(A);
      return eV0.promises.resolveTxt(A)
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
          if (this.isNextResolutionTimerRunning) Xf('resolution update delayed by "min time between resolutions" rate limit');
          else Xf("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
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

  function qO5() {
    (0, jz2.registerResolver)("dns", Sz2), (0, jz2.registerDefaultScheme)("dns")
  }
})
// @from(Ln 300263, Col 4)
BF0 = U((fz2) => {
  Object.defineProperty(fz2, "__esModule", {
    value: !0
  });
  fz2.parseCIDR = kz2;
  fz2.mapProxyName = SO5;
  fz2.getProxiedConnection = xO5;
  var kvA = WY(),
    PFA = j8(),
    vz2 = NA("net"),
    wO5 = NA("http"),
    LO5 = WY(),
    yz2 = hN(),
    bvA = JU(),
    OO5 = NA("url"),
    MO5 = QF0(),
    RO5 = "proxy";

  function SFA(A) {
    LO5.trace(PFA.LogVerbosity.DEBUG, RO5, A)
  }

  function _O5() {
    let A = "",
      Q = "";
    if (process.env.grpc_proxy) Q = "grpc_proxy", A = process.env.grpc_proxy;
    else if (process.env.https_proxy) Q = "https_proxy", A = process.env.https_proxy;
    else if (process.env.http_proxy) Q = "http_proxy", A = process.env.http_proxy;
    else return {};
    let B;
    try {
      B = new OO5.URL(A)
    } catch (X) {
      return (0, kvA.log)(PFA.LogVerbosity.ERROR, `cannot parse value of "${Q}" env var`), {}
    }
    if (B.protocol !== "http:") return (0, kvA.log)(PFA.LogVerbosity.ERROR, `"${B.protocol}" scheme not supported in proxy URI`), {};
    let G = null;
    if (B.username)
      if (B.password)(0, kvA.log)(PFA.LogVerbosity.INFO, "userinfo found in proxy URI"), G = decodeURIComponent(`${B.username}:${B.password}`);
      else G = B.username;
    let {
      hostname: Z,
      port: Y
    } = B;
    if (Y === "") Y = "80";
    let J = {
      address: `${Z}:${Y}`
    };
    if (G) J.creds = G;
    return SFA("Proxy server " + J.address + " set by environment variable " + Q), J
  }

  function jO5() {
    let A = process.env.no_grpc_proxy,
      Q = "no_grpc_proxy";
    if (!A) A = process.env.no_proxy, Q = "no_proxy";
    if (A) return SFA("No proxy server list set by environment variable " + Q), A.split(",");
    else return []
  }

  function kz2(A) {
    let Q = A.split("/");
    if (Q.length !== 2) return null;
    let B = parseInt(Q[1], 10);
    if (!(0, vz2.isIPv4)(Q[0]) || Number.isNaN(B) || B < 0 || B > 32) return null;
    return {
      ip: bz2(Q[0]),
      prefixLength: B
    }
  }

  function bz2(A) {
    return A.split(".").reduce((Q, B) => (Q << 8) + parseInt(B, 10), 0)
  }

  function TO5(A, Q) {
    let B = A.ip,
      G = -1 << 32 - A.prefixLength;
    return (bz2(Q) & G) === (B & G)
  }

  function PO5(A) {
    for (let Q of jO5()) {
      let B = kz2(Q);
      if ((0, vz2.isIPv4)(A) && B && TO5(B, A)) return !0;
      else if (A.endsWith(Q)) return !0
    }
    return !1
  }

  function SO5(A, Q) {
    var B;
    let G = {
      target: A,
      extraOptions: {}
    };
    if (((B = Q["grpc.enable_http_proxy"]) !== null && B !== void 0 ? B : 1) === 0) return G;
    if (A.scheme === "unix") return G;
    let Z = _O5();
    if (!Z.address) return G;
    let Y = (0, bvA.splitHostPort)(A.path);
    if (!Y) return G;
    let J = Y.host;
    if (PO5(J)) return SFA("Not using proxy for target in no_proxy list: " + (0, bvA.uriToString)(A)), G;
    let X = {
      "grpc.http_connect_target": (0, bvA.uriToString)(A)
    };
    if (Z.creds) X["grpc.http_connect_creds"] = Z.creds;
    return {
      target: {
        scheme: "dns",
        path: Z.address
      },
      extraOptions: X
    }
  }

  function xO5(A, Q) {
    var B;
    if (!("grpc.http_connect_target" in Q)) return Promise.resolve(null);
    let G = Q["grpc.http_connect_target"],
      Z = (0, bvA.parseUri)(G);
    if (Z === null) return Promise.resolve(null);
    let Y = (0, bvA.splitHostPort)(Z.path);
    if (Y === null) return Promise.resolve(null);
    let J = `${Y.host}:${(B=Y.port)!==null&&B!==void 0?B:MO5.DEFAULT_PORT}`,
      X = {
        method: "CONNECT",
        path: J
      },
      I = {
        Host: J
      };
    if ((0, yz2.isTcpSubchannelAddress)(A)) X.host = A.host, X.port = A.port;
    else X.socketPath = A.path;
    if ("grpc.http_connect_creds" in Q) I["Proxy-Authorization"] = "Basic " + Buffer.from(Q["grpc.http_connect_creds"]).toString("base64");
    X.headers = I;
    let D = (0, yz2.subchannelAddressToString)(A);
    return SFA("Using proxy " + D + " to connect to " + X.path), new Promise((W, K) => {
      let V = wO5.request(X);
      V.once("connect", (F, H, E) => {
        if (V.removeAllListeners(), H.removeAllListeners(), F.statusCode === 200) {
          if (SFA("Successfully connected to " + X.path + " through proxy " + D), E.length > 0) H.unshift(E);
          SFA("Successfully established a plaintext connection to " + X.path + " through proxy " + D), W(H)
        } else(0, kvA.log)(PFA.LogVerbosity.ERROR, "Failed to connect to " + X.path + " through proxy " + D + " with status " + F.statusCode), K()
      }), V.once("error", (F) => {
        V.removeAllListeners(), (0, kvA.log)(PFA.LogVerbosity.ERROR, "Failed to connect to proxy " + D + " with error " + F.message), K()
      }), V.end()
    })
  }
})
// @from(Ln 300414, Col 4)
GF0 = U((gz2) => {
  Object.defineProperty(gz2, "__esModule", {
    value: !0
  });
  gz2.StreamDecoder = void 0;
  var If;
  (function (A) {
    A[A.NO_DATA = 0] = "NO_DATA", A[A.READING_SIZE = 1] = "READING_SIZE", A[A.READING_MESSAGE = 2] = "READING_MESSAGE"
  })(If || (If = {}));
  class hz2 {
    constructor(A) {
      this.maxReadMessageLength = A, this.readState = If.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
    }
    write(A) {
      let Q = 0,
        B, G = [];
      while (Q < A.length) switch (this.readState) {
        case If.NO_DATA:
          this.readCompressFlag = A.slice(Q, Q + 1), Q += 1, this.readState = If.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
          break;
        case If.READING_SIZE:
          if (B = Math.min(A.length - Q, this.readSizeRemaining), A.copy(this.readPartialSize, 4 - this.readSizeRemaining, Q, Q + B), this.readSizeRemaining -= B, Q += B, this.readSizeRemaining === 0) {
            if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
            if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = If.READING_MESSAGE;
            else {
              let Z = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
              this.readState = If.NO_DATA, G.push(Z)
            }
          }
          break;
        case If.READING_MESSAGE:
          if (B = Math.min(A.length - Q, this.readMessageRemaining), this.readPartialMessage.push(A.slice(Q, Q + B)), this.readMessageRemaining -= B, Q += B, this.readMessageRemaining === 0) {
            let Z = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
              Y = Buffer.concat(Z, this.readMessageSize + 5);
            this.readState = If.NO_DATA, G.push(Y)
          }
          break;
        default:
          throw Error("Unexpected read state")
      }
      return G
    }
  }
  gz2.StreamDecoder = hz2
})
// @from(Ln 300459, Col 4)
pz2 = U((dz2) => {
  Object.defineProperty(dz2, "__esModule", {
    value: !0
  });
  dz2.Http2SubchannelCall = void 0;
  var rd = NA("http2"),
    bO5 = NA("os"),
    hZ = j8(),
    sd = jF(),
    fO5 = GF0(),
    hO5 = WY(),
    gO5 = j8(),
    uO5 = "subchannel_call";

  function mO5(A) {
    for (let [Q, B] of Object.entries(bO5.constants.errno))
      if (B === A) return Q;
    return "Unknown system error " + A
  }

  function ZF0(A) {
    let Q = `Received HTTP status code ${A}`,
      B;
    switch (A) {
      case 400:
        B = hZ.Status.INTERNAL;
        break;
      case 401:
        B = hZ.Status.UNAUTHENTICATED;
        break;
      case 403:
        B = hZ.Status.PERMISSION_DENIED;
        break;
      case 404:
        B = hZ.Status.UNIMPLEMENTED;
        break;
      case 429:
      case 502:
      case 503:
      case 504:
        B = hZ.Status.UNAVAILABLE;
        break;
      default:
        B = hZ.Status.UNKNOWN
    }
    return {
      code: B,
      details: Q,
      metadata: new sd.Metadata
    }
  }
  class mz2 {
    constructor(A, Q, B, G, Z) {
      var Y;
      this.http2Stream = A, this.callEventTracker = Q, this.listener = B, this.transport = G, this.callId = Z, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
      let J = (Y = G.getOptions()["grpc.max_receive_message_length"]) !== null && Y !== void 0 ? Y : hZ.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
      this.decoder = new fO5.StreamDecoder(J), A.on("response", (X, I) => {
        let D = "";
        for (let W of Object.keys(X)) D += "\t\t" + W + ": " + X[W] + `
`;
        if (this.trace(`Received server headers:
` + D), this.httpStatusCode = X[":status"], I & rd.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers(X);
        else {
          let W;
          try {
            W = sd.Metadata.fromHttp2Headers(X)
          } catch (K) {
            this.endCall({
              code: hZ.Status.UNKNOWN,
              details: K.message,
              metadata: new sd.Metadata
            });
            return
          }
          this.listener.onReceiveMetadata(W)
        }
      }), A.on("trailers", (X) => {
        this.handleTrailers(X)
      }), A.on("data", (X) => {
        if (this.statusOutput) return;
        this.trace("receive HTTP/2 data frame of length " + X.length);
        let I;
        try {
          I = this.decoder.write(X)
        } catch (D) {
          if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
            let W = ZF0(this.httpStatusCode);
            this.cancelWithStatus(W.code, W.details)
          } else this.cancelWithStatus(hZ.Status.RESOURCE_EXHAUSTED, D.message);
          return
        }
        for (let D of I) this.trace("parsed message of length " + D.length), this.callEventTracker.addMessageReceived(), this.tryPush(D)
      }), A.on("end", () => {
        this.readsClosed = !0, this.maybeOutputStatus()
      }), A.on("close", () => {
        this.serverEndedCall = !0, process.nextTick(() => {
          var X;
          if (this.trace("HTTP/2 stream closed with code " + A.rstCode), ((X = this.finalStatus) === null || X === void 0 ? void 0 : X.code) === hZ.Status.OK) return;
          let I, D = "";
          switch (A.rstCode) {
            case rd.constants.NGHTTP2_NO_ERROR:
              if (this.finalStatus !== null) return;
              if (this.httpStatusCode && this.httpStatusCode !== 200) {
                let W = ZF0(this.httpStatusCode);
                I = W.code, D = W.details
              } else I = hZ.Status.INTERNAL, D = `Received RST_STREAM with code ${A.rstCode} (Call ended without gRPC status)`;
              break;
            case rd.constants.NGHTTP2_REFUSED_STREAM:
              I = hZ.Status.UNAVAILABLE, D = "Stream refused by server";
              break;
            case rd.constants.NGHTTP2_CANCEL:
              if (this.connectionDropped) I = hZ.Status.UNAVAILABLE, D = "Connection dropped";
              else I = hZ.Status.CANCELLED, D = "Call cancelled";
              break;
            case rd.constants.NGHTTP2_ENHANCE_YOUR_CALM:
              I = hZ.Status.RESOURCE_EXHAUSTED, D = "Bandwidth exhausted or memory limit exceeded";
              break;
            case rd.constants.NGHTTP2_INADEQUATE_SECURITY:
              I = hZ.Status.PERMISSION_DENIED, D = "Protocol not secure enough";
              break;
            case rd.constants.NGHTTP2_INTERNAL_ERROR:
              if (I = hZ.Status.INTERNAL, this.internalError === null) D = `Received RST_STREAM with code ${A.rstCode} (Internal server error)`;
              else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") I = hZ.Status.UNAVAILABLE, D = this.internalError.message;
              else D = `Received RST_STREAM with code ${A.rstCode} triggered by internal client error: ${this.internalError.message}`;
              break;
            default:
              I = hZ.Status.INTERNAL, D = `Received RST_STREAM with code ${A.rstCode}`
          }
          this.endCall({
            code: I,
            details: D,
            metadata: new sd.Metadata,
            rstCode: A.rstCode
          })
        })
      }), A.on("error", (X) => {
        if (X.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + X.message + " code=" + X.code + " errno=" + mO5(X.errno) + " syscall=" + X.syscall), this.internalError = X;
        this.callEventTracker.onStreamEnd(!1)
      })
    }
    getDeadlineInfo() {
      return [`remote_addr=${this.getPeer()}`]
    }
    onDisconnect() {
      this.connectionDropped = !0, setImmediate(() => {
        this.endCall({
          code: hZ.Status.UNAVAILABLE,
          details: "Connection dropped",
          metadata: new sd.Metadata
        })
      })
    }
    outputStatus() {
      if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
        this.listener.onReceiveStatus(this.finalStatus)
      }), this.http2Stream.resume()
    }
    trace(A) {
      hO5.trace(gO5.LogVerbosity.DEBUG, uO5, "[" + this.callId + "] " + A)
    }
    endCall(A) {
      if (this.finalStatus === null || this.finalStatus.code === hZ.Status.OK) this.finalStatus = A, this.maybeOutputStatus();
      this.destroyHttp2Stream()
    }
    maybeOutputStatus() {
      if (this.finalStatus !== null) {
        if (this.finalStatus.code !== hZ.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
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
      for (let Y of Object.keys(A)) Q += "\t\t" + Y + ": " + A[Y] + `
`;
      this.trace(`Received server trailers:
` + Q);
      let B;
      try {
        B = sd.Metadata.fromHttp2Headers(A)
      } catch (Y) {
        B = new sd.Metadata
      }
      let G = B.getMap(),
        Z;
      if (typeof G["grpc-status"] === "string") {
        let Y = Number(G["grpc-status"]);
        this.trace("received status code " + Y + " from server"), B.remove("grpc-status");
        let J = "";
        if (typeof G["grpc-message"] === "string") {
          try {
            J = decodeURI(G["grpc-message"])
          } catch (X) {
            J = G["grpc-message"]
          }
          B.remove("grpc-message"), this.trace('received status details string "' + J + '" from server')
        }
        Z = {
          code: Y,
          details: J,
          metadata: B
        }
      } else if (this.httpStatusCode) Z = ZF0(this.httpStatusCode), Z.metadata = B;
      else Z = {
        code: hZ.Status.UNKNOWN,
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
        if (((A = this.finalStatus) === null || A === void 0 ? void 0 : A.code) === hZ.Status.OK) Q = rd.constants.NGHTTP2_NO_ERROR;
        else Q = rd.constants.NGHTTP2_CANCEL;
        this.trace("close http2 stream with code " + Q), this.http2Stream.close(Q)
      }
    }
    cancelWithStatus(A, Q) {
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), this.endCall({
        code: A,
        details: Q,
        metadata: new sd.Metadata
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
      if (this.finalStatus !== null && this.finalStatus.code !== hZ.Status.OK) {
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
          let Y = hZ.Status.UNAVAILABLE;
          if ((G === null || G === void 0 ? void 0 : G.code) === "ERR_STREAM_WRITE_AFTER_END") Y = hZ.Status.INTERNAL;
          if (G) this.cancelWithStatus(Y, `Write error: ${G.message}`);
          (Z = A.callback) === null || Z === void 0 || Z.call(A)
        })
      };
      this.trace("sending data chunk of length " + Q.length), this.callEventTracker.addMessageSent();
      try {
        this.http2Stream.write(Q, B)
      } catch (G) {
        this.endCall({
          code: hZ.Status.UNAVAILABLE,
          details: `Write failed with error ${G.message}`,
          metadata: new sd.Metadata
        })
      }
    }
    halfClose() {
      this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
    }
  }
  dz2.Http2SubchannelCall = mz2
})