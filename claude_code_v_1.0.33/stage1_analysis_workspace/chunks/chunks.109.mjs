
// @from(Start 10168482, End 10169803)
sk = z((bi) => {
  Object.defineProperty(bi, "__esModule", {
    value: !0
  });
  bi.createOtlpNetworkExportDelegate = bi.CompressionAlgorithm = bi.getSharedConfigurationDefaults = bi.mergeOtlpSharedConfigurationWithDefaults = bi.OTLPExporterError = bi.OTLPExporterBase = void 0;
  var EU5 = zV2();
  Object.defineProperty(bi, "OTLPExporterBase", {
    enumerable: !0,
    get: function() {
      return EU5.OTLPExporterBase
    }
  });
  var zU5 = J41();
  Object.defineProperty(bi, "OTLPExporterError", {
    enumerable: !0,
    get: function() {
      return zU5.OTLPExporterError
    }
  });
  var gV2 = JOA();
  Object.defineProperty(bi, "mergeOtlpSharedConfigurationWithDefaults", {
    enumerable: !0,
    get: function() {
      return gV2.mergeOtlpSharedConfigurationWithDefaults
    }
  });
  Object.defineProperty(bi, "getSharedConfigurationDefaults", {
    enumerable: !0,
    get: function() {
      return gV2.getSharedConfigurationDefaults
    }
  });
  var UU5 = OV2();
  Object.defineProperty(bi, "CompressionAlgorithm", {
    enumerable: !0,
    get: function() {
      return UU5.CompressionAlgorithm
    }
  });
  var $U5 = hV2();
  Object.defineProperty(bi, "createOtlpNetworkExportDelegate", {
    enumerable: !0,
    get: function() {
      return $U5.createOtlpNetworkExportDelegate
    }
  })
})
// @from(Start 10169809, End 10172725)
WB0 = z((dV2) => {
  Object.defineProperty(dV2, "__esModule", {
    value: !0
  });
  dV2.OTLPMetricExporterBase = dV2.LowMemoryTemporalitySelector = dV2.DeltaTemporalitySelector = dV2.CumulativeTemporalitySelector = void 0;
  var qU5 = e6(),
    oX = vi(),
    uV2 = BB0(),
    NU5 = sk(),
    LU5 = K9(),
    MU5 = () => oX.AggregationTemporality.CUMULATIVE;
  dV2.CumulativeTemporalitySelector = MU5;
  var OU5 = (A) => {
    switch (A) {
      case oX.InstrumentType.COUNTER:
      case oX.InstrumentType.OBSERVABLE_COUNTER:
      case oX.InstrumentType.GAUGE:
      case oX.InstrumentType.HISTOGRAM:
      case oX.InstrumentType.OBSERVABLE_GAUGE:
        return oX.AggregationTemporality.DELTA;
      case oX.InstrumentType.UP_DOWN_COUNTER:
      case oX.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
        return oX.AggregationTemporality.CUMULATIVE
    }
  };
  dV2.DeltaTemporalitySelector = OU5;
  var RU5 = (A) => {
    switch (A) {
      case oX.InstrumentType.COUNTER:
      case oX.InstrumentType.HISTOGRAM:
        return oX.AggregationTemporality.DELTA;
      case oX.InstrumentType.GAUGE:
      case oX.InstrumentType.UP_DOWN_COUNTER:
      case oX.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
      case oX.InstrumentType.OBSERVABLE_COUNTER:
      case oX.InstrumentType.OBSERVABLE_GAUGE:
        return oX.AggregationTemporality.CUMULATIVE
    }
  };
  dV2.LowMemoryTemporalitySelector = RU5;

  function TU5() {
    let A = ((0, qU5.getStringFromEnv)("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
    if (A === "cumulative") return dV2.CumulativeTemporalitySelector;
    if (A === "delta") return dV2.DeltaTemporalitySelector;
    if (A === "lowmemory") return dV2.LowMemoryTemporalitySelector;
    return LU5.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${A}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`), dV2.CumulativeTemporalitySelector
  }

  function PU5(A) {
    if (A != null) {
      if (A === uV2.AggregationTemporalityPreference.DELTA) return dV2.DeltaTemporalitySelector;
      else if (A === uV2.AggregationTemporalityPreference.LOWMEMORY) return dV2.LowMemoryTemporalitySelector;
      return dV2.CumulativeTemporalitySelector
    }
    return TU5()
  }
  var jU5 = Object.freeze({
    type: oX.AggregationType.DEFAULT
  });

  function SU5(A) {
    return A?.aggregationPreference ?? (() => jU5)
  }
  class mV2 extends NU5.OTLPExporterBase {
    _aggregationTemporalitySelector;
    _aggregationSelector;
    constructor(A, Q) {
      super(A);
      this._aggregationSelector = SU5(Q), this._aggregationTemporalitySelector = PU5(Q?.temporalityPreference)
    }
    selectAggregation(A) {
      return this._aggregationSelector(A)
    }
    selectAggregationTemporality(A) {
      return this._aggregationTemporalitySelector(A)
    }
  }
  dV2.OTLPMetricExporterBase = mV2
})
// @from(Start 10172731, End 10173356)
XB0 = z((rmG, pV2) => {
  pV2.exports = _U5;

  function _U5(A, Q) {
    var B = Array(arguments.length - 1),
      G = 0,
      Z = 2,
      I = !0;
    while (Z < arguments.length) B[G++] = arguments[Z++];
    return new Promise(function(J, W) {
      B[G] = function(V) {
        if (I)
          if (I = !1, V) W(V);
          else {
            var F = Array(arguments.length - 1),
              K = 0;
            while (K < F.length) F[K++] = arguments[K];
            J.apply(null, F)
          }
      };
      try {
        A.apply(Q || null, B)
      } catch (X) {
        if (I) I = !1, W(X)
      }
    })
  }
})
// @from(Start 10173362, End 10175356)
aV2 = z((nV2) => {
  var X41 = nV2;
  X41.length = function(Q) {
    var B = Q.length;
    if (!B) return 0;
    var G = 0;
    while (--B % 4 > 1 && Q.charAt(B) === "=") ++G;
    return Math.ceil(Q.length * 3) / 4 - G
  };
  var nYA = Array(64),
    iV2 = Array(123);
  for (JO = 0; JO < 64;) iV2[nYA[JO] = JO < 26 ? JO + 65 : JO < 52 ? JO + 71 : JO < 62 ? JO - 4 : JO - 59 | 43] = JO++;
  var JO;
  X41.encode = function(Q, B, G) {
    var Z = null,
      I = [],
      Y = 0,
      J = 0,
      W;
    while (B < G) {
      var X = Q[B++];
      switch (J) {
        case 0:
          I[Y++] = nYA[X >> 2], W = (X & 3) << 4, J = 1;
          break;
        case 1:
          I[Y++] = nYA[W | X >> 4], W = (X & 15) << 2, J = 2;
          break;
        case 2:
          I[Y++] = nYA[W | X >> 6], I[Y++] = nYA[X & 63], J = 0;
          break
      }
      if (Y > 8191)(Z || (Z = [])).push(String.fromCharCode.apply(String, I)), Y = 0
    }
    if (J) {
      if (I[Y++] = nYA[W], I[Y++] = 61, J === 1) I[Y++] = 61
    }
    if (Z) {
      if (Y) Z.push(String.fromCharCode.apply(String, I.slice(0, Y)));
      return Z.join("")
    }
    return String.fromCharCode.apply(String, I.slice(0, Y))
  };
  var lV2 = "invalid encoding";
  X41.decode = function(Q, B, G) {
    var Z = G,
      I = 0,
      Y;
    for (var J = 0; J < Q.length;) {
      var W = Q.charCodeAt(J++);
      if (W === 61 && I > 1) break;
      if ((W = iV2[W]) === void 0) throw Error(lV2);
      switch (I) {
        case 0:
          Y = W, I = 1;
          break;
        case 1:
          B[G++] = Y << 2 | (W & 48) >> 4, Y = W, I = 2;
          break;
        case 2:
          B[G++] = (Y & 15) << 4 | (W & 60) >> 2, Y = W, I = 3;
          break;
        case 3:
          B[G++] = (Y & 3) << 6 | W, I = 0;
          break
      }
    }
    if (I === 1) throw Error(lV2);
    return G - Z
  };
  X41.test = function(Q) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(Q)
  }
})
// @from(Start 10175362, End 10176186)
rV2 = z((tmG, sV2) => {
  sV2.exports = V41;

  function V41() {
    this._listeners = {}
  }
  V41.prototype.on = function(Q, B, G) {
    return (this._listeners[Q] || (this._listeners[Q] = [])).push({
      fn: B,
      ctx: G || this
    }), this
  };
  V41.prototype.off = function(Q, B) {
    if (Q === void 0) this._listeners = {};
    else if (B === void 0) this._listeners[Q] = [];
    else {
      var G = this._listeners[Q];
      for (var Z = 0; Z < G.length;)
        if (G[Z].fn === B) G.splice(Z, 1);
        else ++Z
    }
    return this
  };
  V41.prototype.emit = function(Q) {
    var B = this._listeners[Q];
    if (B) {
      var G = [],
        Z = 1;
      for (; Z < arguments.length;) G.push(arguments[Z++]);
      for (Z = 0; Z < B.length;) B[Z].fn.apply(B[Z++].ctx, G)
    }
    return this
  }
})
// @from(Start 10176192, End 10182289)
GF2 = z((emG, BF2) => {
  BF2.exports = oV2(oV2);

  function oV2(A) {
    if (typeof Float32Array < "u")(function() {
      var Q = new Float32Array([-0]),
        B = new Uint8Array(Q.buffer),
        G = B[3] === 128;

      function Z(W, X, V) {
        Q[0] = W, X[V] = B[0], X[V + 1] = B[1], X[V + 2] = B[2], X[V + 3] = B[3]
      }

      function I(W, X, V) {
        Q[0] = W, X[V] = B[3], X[V + 1] = B[2], X[V + 2] = B[1], X[V + 3] = B[0]
      }
      A.writeFloatLE = G ? Z : I, A.writeFloatBE = G ? I : Z;

      function Y(W, X) {
        return B[0] = W[X], B[1] = W[X + 1], B[2] = W[X + 2], B[3] = W[X + 3], Q[0]
      }

      function J(W, X) {
        return B[3] = W[X], B[2] = W[X + 1], B[1] = W[X + 2], B[0] = W[X + 3], Q[0]
      }
      A.readFloatLE = G ? Y : J, A.readFloatBE = G ? J : Y
    })();
    else(function() {
      function Q(G, Z, I, Y) {
        var J = Z < 0 ? 1 : 0;
        if (J) Z = -Z;
        if (Z === 0) G(1 / Z > 0 ? 0 : 2147483648, I, Y);
        else if (isNaN(Z)) G(2143289344, I, Y);
        else if (Z > 340282346638528860000000000000000000000) G((J << 31 | 2139095040) >>> 0, I, Y);
        else if (Z < 0.000000000000000000000000000000000000011754943508222875) G((J << 31 | Math.round(Z / 0.000000000000000000000000000000000000000000001401298464324817)) >>> 0, I, Y);
        else {
          var W = Math.floor(Math.log(Z) / Math.LN2),
            X = Math.round(Z * Math.pow(2, -W) * 8388608) & 8388607;
          G((J << 31 | W + 127 << 23 | X) >>> 0, I, Y)
        }
      }
      A.writeFloatLE = Q.bind(null, tV2), A.writeFloatBE = Q.bind(null, eV2);

      function B(G, Z, I) {
        var Y = G(Z, I),
          J = (Y >> 31) * 2 + 1,
          W = Y >>> 23 & 255,
          X = Y & 8388607;
        return W === 255 ? X ? NaN : J * (1 / 0) : W === 0 ? J * 0.000000000000000000000000000000000000000000001401298464324817 * X : J * Math.pow(2, W - 150) * (X + 8388608)
      }
      A.readFloatLE = B.bind(null, AF2), A.readFloatBE = B.bind(null, QF2)
    })();
    if (typeof Float64Array < "u")(function() {
      var Q = new Float64Array([-0]),
        B = new Uint8Array(Q.buffer),
        G = B[7] === 128;

      function Z(W, X, V) {
        Q[0] = W, X[V] = B[0], X[V + 1] = B[1], X[V + 2] = B[2], X[V + 3] = B[3], X[V + 4] = B[4], X[V + 5] = B[5], X[V + 6] = B[6], X[V + 7] = B[7]
      }

      function I(W, X, V) {
        Q[0] = W, X[V] = B[7], X[V + 1] = B[6], X[V + 2] = B[5], X[V + 3] = B[4], X[V + 4] = B[3], X[V + 5] = B[2], X[V + 6] = B[1], X[V + 7] = B[0]
      }
      A.writeDoubleLE = G ? Z : I, A.writeDoubleBE = G ? I : Z;

      function Y(W, X) {
        return B[0] = W[X], B[1] = W[X + 1], B[2] = W[X + 2], B[3] = W[X + 3], B[4] = W[X + 4], B[5] = W[X + 5], B[6] = W[X + 6], B[7] = W[X + 7], Q[0]
      }

      function J(W, X) {
        return B[7] = W[X], B[6] = W[X + 1], B[5] = W[X + 2], B[4] = W[X + 3], B[3] = W[X + 4], B[2] = W[X + 5], B[1] = W[X + 6], B[0] = W[X + 7], Q[0]
      }
      A.readDoubleLE = G ? Y : J, A.readDoubleBE = G ? J : Y
    })();
    else(function() {
      function Q(G, Z, I, Y, J, W) {
        var X = Y < 0 ? 1 : 0;
        if (X) Y = -Y;
        if (Y === 0) G(0, J, W + Z), G(1 / Y > 0 ? 0 : 2147483648, J, W + I);
        else if (isNaN(Y)) G(0, J, W + Z), G(2146959360, J, W + I);
        else if (Y > 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) G(0, J, W + Z), G((X << 31 | 2146435072) >>> 0, J, W + I);
        else {
          var V;
          if (Y < 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022250738585072014) V = Y / 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005, G(V >>> 0, J, W + Z), G((X << 31 | V / 4294967296) >>> 0, J, W + I);
          else {
            var F = Math.floor(Math.log(Y) / Math.LN2);
            if (F === 1024) F = 1023;
            V = Y * Math.pow(2, -F), G(V * 4503599627370496 >>> 0, J, W + Z), G((X << 31 | F + 1023 << 20 | V * 1048576 & 1048575) >>> 0, J, W + I)
          }
        }
      }
      A.writeDoubleLE = Q.bind(null, tV2, 0, 4), A.writeDoubleBE = Q.bind(null, eV2, 4, 0);

      function B(G, Z, I, Y, J) {
        var W = G(Y, J + Z),
          X = G(Y, J + I),
          V = (X >> 31) * 2 + 1,
          F = X >>> 20 & 2047,
          K = 4294967296 * (X & 1048575) + W;
        return F === 2047 ? K ? NaN : V * (1 / 0) : F === 0 ? V * 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005 * K : V * Math.pow(2, F - 1075) * (K + 4503599627370496)
      }
      A.readDoubleLE = B.bind(null, AF2, 0, 4), A.readDoubleBE = B.bind(null, QF2, 4, 0)
    })();
    return A
  }

  function tV2(A, Q, B) {
    Q[B] = A & 255, Q[B + 1] = A >>> 8 & 255, Q[B + 2] = A >>> 16 & 255, Q[B + 3] = A >>> 24
  }

  function eV2(A, Q, B) {
    Q[B] = A >>> 24, Q[B + 1] = A >>> 16 & 255, Q[B + 2] = A >>> 8 & 255, Q[B + 3] = A & 255
  }

  function AF2(A, Q) {
    return (A[Q] | A[Q + 1] << 8 | A[Q + 2] << 16 | A[Q + 3] << 24) >>> 0
  }

  function QF2(A, Q) {
    return (A[Q] << 24 | A[Q + 1] << 16 | A[Q + 2] << 8 | A[Q + 3]) >>> 0
  }
})
// @from(Start 10182295, End 10182552)
FB0 = z((ZF2, VB0) => {
  VB0.exports = kU5;

  function kU5(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length)) return mod
    } catch (A) {}
    return null
  }
})
// @from(Start 10182558, End 10184254)
YF2 = z((IF2) => {
  var KB0 = IF2;
  KB0.length = function(Q) {
    var B = 0,
      G = 0;
    for (var Z = 0; Z < Q.length; ++Z)
      if (G = Q.charCodeAt(Z), G < 128) B += 1;
      else if (G < 2048) B += 2;
    else if ((G & 64512) === 55296 && (Q.charCodeAt(Z + 1) & 64512) === 56320) ++Z, B += 4;
    else B += 3;
    return B
  };
  KB0.read = function(Q, B, G) {
    var Z = G - B;
    if (Z < 1) return "";
    var I = null,
      Y = [],
      J = 0,
      W;
    while (B < G) {
      if (W = Q[B++], W < 128) Y[J++] = W;
      else if (W > 191 && W < 224) Y[J++] = (W & 31) << 6 | Q[B++] & 63;
      else if (W > 239 && W < 365) W = ((W & 7) << 18 | (Q[B++] & 63) << 12 | (Q[B++] & 63) << 6 | Q[B++] & 63) - 65536, Y[J++] = 55296 + (W >> 10), Y[J++] = 56320 + (W & 1023);
      else Y[J++] = (W & 15) << 12 | (Q[B++] & 63) << 6 | Q[B++] & 63;
      if (J > 8191)(I || (I = [])).push(String.fromCharCode.apply(String, Y)), J = 0
    }
    if (I) {
      if (J) I.push(String.fromCharCode.apply(String, Y.slice(0, J)));
      return I.join("")
    }
    return String.fromCharCode.apply(String, Y.slice(0, J))
  };
  KB0.write = function(Q, B, G) {
    var Z = G,
      I, Y;
    for (var J = 0; J < Q.length; ++J)
      if (I = Q.charCodeAt(J), I < 128) B[G++] = I;
      else if (I < 2048) B[G++] = I >> 6 | 192, B[G++] = I & 63 | 128;
    else if ((I & 64512) === 55296 && ((Y = Q.charCodeAt(J + 1)) & 64512) === 56320) I = 65536 + ((I & 1023) << 10) + (Y & 1023), ++J, B[G++] = I >> 18 | 240, B[G++] = I >> 12 & 63 | 128, B[G++] = I >> 6 & 63 | 128, B[G++] = I & 63 | 128;
    else B[G++] = I >> 12 | 224, B[G++] = I >> 6 & 63 | 128, B[G++] = I & 63 | 128;
    return G - Z
  }
})
// @from(Start 10184260, End 10184602)
WF2 = z((QdG, JF2) => {
  JF2.exports = yU5;

  function yU5(A, Q, B) {
    var G = B || 8192,
      Z = G >>> 1,
      I = null,
      Y = G;
    return function(W) {
      if (W < 1 || W > Z) return A(W);
      if (Y + W > G) I = A(G), Y = 0;
      var X = Q.call(I, Y, Y += W);
      if (Y & 7) Y = (Y | 7) + 1;
      return X
    }
  }
})
// @from(Start 10184608, End 10187215)
VF2 = z((BdG, XF2) => {
  XF2.exports = IK;
  var WOA = rk();

  function IK(A, Q) {
    this.lo = A >>> 0, this.hi = Q >>> 0
  }
  var n1A = IK.zero = new IK(0, 0);
  n1A.toNumber = function() {
    return 0
  };
  n1A.zzEncode = n1A.zzDecode = function() {
    return this
  };
  n1A.length = function() {
    return 1
  };
  var xU5 = IK.zeroHash = "\x00\x00\x00\x00\x00\x00\x00\x00";
  IK.fromNumber = function(Q) {
    if (Q === 0) return n1A;
    var B = Q < 0;
    if (B) Q = -Q;
    var G = Q >>> 0,
      Z = (Q - G) / 4294967296 >>> 0;
    if (B) {
      if (Z = ~Z >>> 0, G = ~G >>> 0, ++G > 4294967295) {
        if (G = 0, ++Z > 4294967295) Z = 0
      }
    }
    return new IK(G, Z)
  };
  IK.from = function(Q) {
    if (typeof Q === "number") return IK.fromNumber(Q);
    if (WOA.isString(Q))
      if (WOA.Long) Q = WOA.Long.fromString(Q);
      else return IK.fromNumber(parseInt(Q, 10));
    return Q.low || Q.high ? new IK(Q.low >>> 0, Q.high >>> 0) : n1A
  };
  IK.prototype.toNumber = function(Q) {
    if (!Q && this.hi >>> 31) {
      var B = ~this.lo + 1 >>> 0,
        G = ~this.hi >>> 0;
      if (!B) G = G + 1 >>> 0;
      return -(B + G * 4294967296)
    }
    return this.lo + this.hi * 4294967296
  };
  IK.prototype.toLong = function(Q) {
    return WOA.Long ? new WOA.Long(this.lo | 0, this.hi | 0, Boolean(Q)) : {
      low: this.lo | 0,
      high: this.hi | 0,
      unsigned: Boolean(Q)
    }
  };
  var fi = String.prototype.charCodeAt;
  IK.fromHash = function(Q) {
    if (Q === xU5) return n1A;
    return new IK((fi.call(Q, 0) | fi.call(Q, 1) << 8 | fi.call(Q, 2) << 16 | fi.call(Q, 3) << 24) >>> 0, (fi.call(Q, 4) | fi.call(Q, 5) << 8 | fi.call(Q, 6) << 16 | fi.call(Q, 7) << 24) >>> 0)
  };
  IK.prototype.toHash = function() {
    return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
  };
  IK.prototype.zzEncode = function() {
    var Q = this.hi >> 31;
    return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ Q) >>> 0, this.lo = (this.lo << 1 ^ Q) >>> 0, this
  };
  IK.prototype.zzDecode = function() {
    var Q = -(this.lo & 1);
    return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ Q) >>> 0, this.hi = (this.hi >>> 1 ^ Q) >>> 0, this
  };
  IK.prototype.length = function() {
    var Q = this.lo,
      B = (this.lo >>> 28 | this.hi << 4) >>> 0,
      G = this.hi >>> 24;
    return G === 0 ? B === 0 ? Q < 16384 ? Q < 128 ? 1 : 2 : Q < 2097152 ? 3 : 4 : B < 16384 ? B < 128 ? 5 : 6 : B < 2097152 ? 7 : 8 : G < 128 ? 9 : 10
  }
})
// @from(Start 10187221, End 10191437)
rk = z((DB0) => {
  var H9 = DB0;
  H9.asPromise = XB0();
  H9.base64 = aV2();
  H9.EventEmitter = rV2();
  H9.float = GF2();
  H9.inquire = FB0();
  H9.utf8 = YF2();
  H9.pool = WF2();
  H9.LongBits = VF2();
  H9.isNode = Boolean(typeof global < "u" && global && global.process && global.process.versions && global.process.versions.node);
  H9.global = H9.isNode && global || typeof window < "u" && window || typeof self < "u" && self || DB0;
  H9.emptyArray = Object.freeze ? Object.freeze([]) : [];
  H9.emptyObject = Object.freeze ? Object.freeze({}) : {};
  H9.isInteger = Number.isInteger || function(Q) {
    return typeof Q === "number" && isFinite(Q) && Math.floor(Q) === Q
  };
  H9.isString = function(Q) {
    return typeof Q === "string" || Q instanceof String
  };
  H9.isObject = function(Q) {
    return Q && typeof Q === "object"
  };
  H9.isset = H9.isSet = function(Q, B) {
    var G = Q[B];
    if (G != null && Q.hasOwnProperty(B)) return typeof G !== "object" || (Array.isArray(G) ? G.length : Object.keys(G).length) > 0;
    return !1
  };
  H9.Buffer = function() {
    try {
      var A = H9.inquire("buffer").Buffer;
      return A.prototype.utf8Write ? A : null
    } catch (Q) {
      return null
    }
  }();
  H9._Buffer_from = null;
  H9._Buffer_allocUnsafe = null;
  H9.newBuffer = function(Q) {
    return typeof Q === "number" ? H9.Buffer ? H9._Buffer_allocUnsafe(Q) : new H9.Array(Q) : H9.Buffer ? H9._Buffer_from(Q) : typeof Uint8Array > "u" ? Q : new Uint8Array(Q)
  };
  H9.Array = typeof Uint8Array < "u" ? Uint8Array : Array;
  H9.Long = H9.global.dcodeIO && H9.global.dcodeIO.Long || H9.global.Long || H9.inquire("long");
  H9.key2Re = /^true|false|0|1$/;
  H9.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
  H9.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
  H9.longToHash = function(Q) {
    return Q ? H9.LongBits.from(Q).toHash() : H9.LongBits.zeroHash
  };
  H9.longFromHash = function(Q, B) {
    var G = H9.LongBits.fromHash(Q);
    if (H9.Long) return H9.Long.fromBits(G.lo, G.hi, B);
    return G.toNumber(Boolean(B))
  };

  function FF2(A, Q, B) {
    for (var G = Object.keys(Q), Z = 0; Z < G.length; ++Z)
      if (A[G[Z]] === void 0 || !B) A[G[Z]] = Q[G[Z]];
    return A
  }
  H9.merge = FF2;
  H9.lcFirst = function(Q) {
    return Q.charAt(0).toLowerCase() + Q.substring(1)
  };

  function KF2(A) {
    function Q(B, G) {
      if (!(this instanceof Q)) return new Q(B, G);
      if (Object.defineProperty(this, "message", {
          get: function() {
            return B
          }
        }), Error.captureStackTrace) Error.captureStackTrace(this, Q);
      else Object.defineProperty(this, "stack", {
        value: Error().stack || ""
      });
      if (G) FF2(this, G)
    }
    return Q.prototype = Object.create(Error.prototype, {
      constructor: {
        value: Q,
        writable: !0,
        enumerable: !1,
        configurable: !0
      },
      name: {
        get: function() {
          return A
        },
        set: void 0,
        enumerable: !1,
        configurable: !0
      },
      toString: {
        value: function() {
          return this.name + ": " + this.message
        },
        writable: !0,
        enumerable: !1,
        configurable: !0
      }
    }), Q
  }
  H9.newError = KF2;
  H9.ProtocolError = KF2("ProtocolError");
  H9.oneOfGetter = function(Q) {
    var B = {};
    for (var G = 0; G < Q.length; ++G) B[Q[G]] = 1;
    return function() {
      for (var Z = Object.keys(this), I = Z.length - 1; I > -1; --I)
        if (B[Z[I]] === 1 && this[Z[I]] !== void 0 && this[Z[I]] !== null) return Z[I]
    }
  };
  H9.oneOfSetter = function(Q) {
    return function(B) {
      for (var G = 0; G < Q.length; ++G)
        if (Q[G] !== B) delete this[Q[G]]
    }
  };
  H9.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: !0
  };
  H9._configure = function() {
    var A = H9.Buffer;
    if (!A) {
      H9._Buffer_from = H9._Buffer_allocUnsafe = null;
      return
    }
    H9._Buffer_from = A.from !== Uint8Array.from && A.from || function(B, G) {
      return new A(B, G)
    }, H9._Buffer_allocUnsafe = A.allocUnsafe || function(B) {
      return new A(B)
    }
  }
})
// @from(Start 10191443, End 10195760)
K41 = z((ZdG, EF2) => {
  EF2.exports = b3;
  var WO = rk(),
    HB0, F41 = WO.LongBits,
    DF2 = WO.base64,
    HF2 = WO.utf8;

  function XOA(A, Q, B) {
    this.fn = A, this.len = Q, this.next = void 0, this.val = B
  }

  function EB0() {}

  function vU5(A) {
    this.head = A.head, this.tail = A.tail, this.len = A.len, this.next = A.states
  }

  function b3() {
    this.len = 0, this.head = new XOA(EB0, 0, 0), this.tail = this.head, this.states = null
  }
  var CF2 = function() {
    return WO.Buffer ? function() {
      return (b3.create = function() {
        return new HB0
      })()
    } : function() {
      return new b3
    }
  };
  b3.create = CF2();
  b3.alloc = function(Q) {
    return new WO.Array(Q)
  };
  if (WO.Array !== Array) b3.alloc = WO.pool(b3.alloc, WO.Array.prototype.subarray);
  b3.prototype._push = function(Q, B, G) {
    return this.tail = this.tail.next = new XOA(Q, B, G), this.len += B, this
  };

  function zB0(A, Q, B) {
    Q[B] = A & 255
  }

  function bU5(A, Q, B) {
    while (A > 127) Q[B++] = A & 127 | 128, A >>>= 7;
    Q[B] = A
  }

  function UB0(A, Q) {
    this.len = A, this.next = void 0, this.val = Q
  }
  UB0.prototype = Object.create(XOA.prototype);
  UB0.prototype.fn = bU5;
  b3.prototype.uint32 = function(Q) {
    return this.len += (this.tail = this.tail.next = new UB0((Q = Q >>> 0) < 128 ? 1 : Q < 16384 ? 2 : Q < 2097152 ? 3 : Q < 268435456 ? 4 : 5, Q)).len, this
  };
  b3.prototype.int32 = function(Q) {
    return Q < 0 ? this._push($B0, 10, F41.fromNumber(Q)) : this.uint32(Q)
  };
  b3.prototype.sint32 = function(Q) {
    return this.uint32((Q << 1 ^ Q >> 31) >>> 0)
  };

  function $B0(A, Q, B) {
    while (A.hi) Q[B++] = A.lo & 127 | 128, A.lo = (A.lo >>> 7 | A.hi << 25) >>> 0, A.hi >>>= 7;
    while (A.lo > 127) Q[B++] = A.lo & 127 | 128, A.lo = A.lo >>> 7;
    Q[B++] = A.lo
  }
  b3.prototype.uint64 = function(Q) {
    var B = F41.from(Q);
    return this._push($B0, B.length(), B)
  };
  b3.prototype.int64 = b3.prototype.uint64;
  b3.prototype.sint64 = function(Q) {
    var B = F41.from(Q).zzEncode();
    return this._push($B0, B.length(), B)
  };
  b3.prototype.bool = function(Q) {
    return this._push(zB0, 1, Q ? 1 : 0)
  };

  function CB0(A, Q, B) {
    Q[B] = A & 255, Q[B + 1] = A >>> 8 & 255, Q[B + 2] = A >>> 16 & 255, Q[B + 3] = A >>> 24
  }
  b3.prototype.fixed32 = function(Q) {
    return this._push(CB0, 4, Q >>> 0)
  };
  b3.prototype.sfixed32 = b3.prototype.fixed32;
  b3.prototype.fixed64 = function(Q) {
    var B = F41.from(Q);
    return this._push(CB0, 4, B.lo)._push(CB0, 4, B.hi)
  };
  b3.prototype.sfixed64 = b3.prototype.fixed64;
  b3.prototype.float = function(Q) {
    return this._push(WO.float.writeFloatLE, 4, Q)
  };
  b3.prototype.double = function(Q) {
    return this._push(WO.float.writeDoubleLE, 8, Q)
  };
  var fU5 = WO.Array.prototype.set ? function(Q, B, G) {
    B.set(Q, G)
  } : function(Q, B, G) {
    for (var Z = 0; Z < Q.length; ++Z) B[G + Z] = Q[Z]
  };
  b3.prototype.bytes = function(Q) {
    var B = Q.length >>> 0;
    if (!B) return this._push(zB0, 1, 0);
    if (WO.isString(Q)) {
      var G = b3.alloc(B = DF2.length(Q));
      DF2.decode(Q, G, 0), Q = G
    }
    return this.uint32(B)._push(fU5, B, Q)
  };
  b3.prototype.string = function(Q) {
    var B = HF2.length(Q);
    return B ? this.uint32(B)._push(HF2.write, B, Q) : this._push(zB0, 1, 0)
  };
  b3.prototype.fork = function() {
    return this.states = new vU5(this), this.head = this.tail = new XOA(EB0, 0, 0), this.len = 0, this
  };
  b3.prototype.reset = function() {
    if (this.states) this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next;
    else this.head = this.tail = new XOA(EB0, 0, 0), this.len = 0;
    return this
  };
  b3.prototype.ldelim = function() {
    var Q = this.head,
      B = this.tail,
      G = this.len;
    if (this.reset().uint32(G), G) this.tail.next = Q.next, this.tail = B, this.len += G;
    return this
  };
  b3.prototype.finish = function() {
    var Q = this.head.next,
      B = this.constructor.alloc(this.len),
      G = 0;
    while (Q) Q.fn(Q.val, B, G), G += Q.len, Q = Q.next;
    return B
  };
  b3._configure = function(A) {
    HB0 = A, b3.create = CF2(), HB0._configure()
  }
})
// @from(Start 10195766, End 10196855)
$F2 = z((IdG, UF2) => {
  UF2.exports = ok;
  var zF2 = K41();
  (ok.prototype = Object.create(zF2.prototype)).constructor = ok;
  var hi = rk();

  function ok() {
    zF2.call(this)
  }
  ok._configure = function() {
    ok.alloc = hi._Buffer_allocUnsafe, ok.writeBytesBuffer = hi.Buffer && hi.Buffer.prototype instanceof Uint8Array && hi.Buffer.prototype.set.name === "set" ? function(Q, B, G) {
      B.set(Q, G)
    } : function(Q, B, G) {
      if (Q.copy) Q.copy(B, G, 0, Q.length);
      else
        for (var Z = 0; Z < Q.length;) B[G++] = Q[Z++]
    }
  };
  ok.prototype.bytes = function(Q) {
    if (hi.isString(Q)) Q = hi._Buffer_from(Q, "base64");
    var B = Q.length >>> 0;
    if (this.uint32(B), B) this._push(ok.writeBytesBuffer, B, Q);
    return this
  };

  function hU5(A, Q, B) {
    if (A.length < 40) hi.utf8.write(A, Q, B);
    else if (Q.utf8Write) Q.utf8Write(A, B);
    else Q.write(A, B)
  }
  ok.prototype.string = function(Q) {
    var B = hi.Buffer.byteLength(Q);
    if (this.uint32(B), B) this._push(hU5, B, Q);
    return this
  };
  ok._configure()
})
// @from(Start 10196861, End 10202432)
H41 = z((YdG, MF2) => {
  MF2.exports = yW;
  var DP = rk(),
    qB0, NF2 = DP.LongBits,
    gU5 = DP.utf8;

  function HP(A, Q) {
    return RangeError("index out of range: " + A.pos + " + " + (Q || 1) + " > " + A.len)
  }

  function yW(A) {
    this.buf = A, this.pos = 0, this.len = A.length
  }
  var wF2 = typeof Uint8Array < "u" ? function(Q) {
      if (Q instanceof Uint8Array || Array.isArray(Q)) return new yW(Q);
      throw Error("illegal buffer")
    } : function(Q) {
      if (Array.isArray(Q)) return new yW(Q);
      throw Error("illegal buffer")
    },
    LF2 = function() {
      return DP.Buffer ? function(B) {
        return (yW.create = function(Z) {
          return DP.Buffer.isBuffer(Z) ? new qB0(Z) : wF2(Z)
        })(B)
      } : wF2
    };
  yW.create = LF2();
  yW.prototype._slice = DP.Array.prototype.subarray || DP.Array.prototype.slice;
  yW.prototype.uint32 = function() {
    var Q = 4294967295;
    return function() {
      if (Q = (this.buf[this.pos] & 127) >>> 0, this.buf[this.pos++] < 128) return Q;
      if (Q = (Q | (this.buf[this.pos] & 127) << 7) >>> 0, this.buf[this.pos++] < 128) return Q;
      if (Q = (Q | (this.buf[this.pos] & 127) << 14) >>> 0, this.buf[this.pos++] < 128) return Q;
      if (Q = (Q | (this.buf[this.pos] & 127) << 21) >>> 0, this.buf[this.pos++] < 128) return Q;
      if (Q = (Q | (this.buf[this.pos] & 15) << 28) >>> 0, this.buf[this.pos++] < 128) return Q;
      if ((this.pos += 5) > this.len) throw this.pos = this.len, HP(this, 10);
      return Q
    }
  }();
  yW.prototype.int32 = function() {
    return this.uint32() | 0
  };
  yW.prototype.sint32 = function() {
    var Q = this.uint32();
    return Q >>> 1 ^ -(Q & 1) | 0
  };

  function wB0() {
    var A = new NF2(0, 0),
      Q = 0;
    if (this.len - this.pos > 4) {
      for (; Q < 4; ++Q)
        if (A.lo = (A.lo | (this.buf[this.pos] & 127) << Q * 7) >>> 0, this.buf[this.pos++] < 128) return A;
      if (A.lo = (A.lo | (this.buf[this.pos] & 127) << 28) >>> 0, A.hi = (A.hi | (this.buf[this.pos] & 127) >> 4) >>> 0, this.buf[this.pos++] < 128) return A;
      Q = 0
    } else {
      for (; Q < 3; ++Q) {
        if (this.pos >= this.len) throw HP(this);
        if (A.lo = (A.lo | (this.buf[this.pos] & 127) << Q * 7) >>> 0, this.buf[this.pos++] < 128) return A
      }
      return A.lo = (A.lo | (this.buf[this.pos++] & 127) << Q * 7) >>> 0, A
    }
    if (this.len - this.pos > 4) {
      for (; Q < 5; ++Q)
        if (A.hi = (A.hi | (this.buf[this.pos] & 127) << Q * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return A
    } else
      for (; Q < 5; ++Q) {
        if (this.pos >= this.len) throw HP(this);
        if (A.hi = (A.hi | (this.buf[this.pos] & 127) << Q * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return A
      }
    throw Error("invalid varint encoding")
  }
  yW.prototype.bool = function() {
    return this.uint32() !== 0
  };

  function D41(A, Q) {
    return (A[Q - 4] | A[Q - 3] << 8 | A[Q - 2] << 16 | A[Q - 1] << 24) >>> 0
  }
  yW.prototype.fixed32 = function() {
    if (this.pos + 4 > this.len) throw HP(this, 4);
    return D41(this.buf, this.pos += 4)
  };
  yW.prototype.sfixed32 = function() {
    if (this.pos + 4 > this.len) throw HP(this, 4);
    return D41(this.buf, this.pos += 4) | 0
  };

  function qF2() {
    if (this.pos + 8 > this.len) throw HP(this, 8);
    return new NF2(D41(this.buf, this.pos += 4), D41(this.buf, this.pos += 4))
  }
  yW.prototype.float = function() {
    if (this.pos + 4 > this.len) throw HP(this, 4);
    var Q = DP.float.readFloatLE(this.buf, this.pos);
    return this.pos += 4, Q
  };
  yW.prototype.double = function() {
    if (this.pos + 8 > this.len) throw HP(this, 4);
    var Q = DP.float.readDoubleLE(this.buf, this.pos);
    return this.pos += 8, Q
  };
  yW.prototype.bytes = function() {
    var Q = this.uint32(),
      B = this.pos,
      G = this.pos + Q;
    if (G > this.len) throw HP(this, Q);
    if (this.pos += Q, Array.isArray(this.buf)) return this.buf.slice(B, G);
    if (B === G) {
      var Z = DP.Buffer;
      return Z ? Z.alloc(0) : new this.buf.constructor(0)
    }
    return this._slice.call(this.buf, B, G)
  };
  yW.prototype.string = function() {
    var Q = this.bytes();
    return gU5.read(Q, 0, Q.length)
  };
  yW.prototype.skip = function(Q) {
    if (typeof Q === "number") {
      if (this.pos + Q > this.len) throw HP(this, Q);
      this.pos += Q
    } else
      do
        if (this.pos >= this.len) throw HP(this); while (this.buf[this.pos++] & 128);
    return this
  };
  yW.prototype.skipType = function(A) {
    switch (A) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((A = this.uint32() & 7) !== 4) this.skipType(A);
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw Error("invalid wire type " + A + " at offset " + this.pos)
    }
    return this
  };
  yW._configure = function(A) {
    qB0 = A, yW.create = LF2(), qB0._configure();
    var Q = DP.Long ? "toLong" : "toNumber";
    DP.merge(yW.prototype, {
      int64: function() {
        return wB0.call(this)[Q](!1)
      },
      uint64: function() {
        return wB0.call(this)[Q](!0)
      },
      sint64: function() {
        return wB0.call(this).zzDecode()[Q](!1)
      },
      fixed64: function() {
        return qF2.call(this)[Q](!0)
      },
      sfixed64: function() {
        return qF2.call(this)[Q](!1)
      }
    })
  }
})
// @from(Start 10202438, End 10203023)
PF2 = z((JdG, TF2) => {
  TF2.exports = a1A;
  var RF2 = H41();
  (a1A.prototype = Object.create(RF2.prototype)).constructor = a1A;
  var OF2 = rk();

  function a1A(A) {
    RF2.call(this, A)
  }
  a1A._configure = function() {
    if (OF2.Buffer) a1A.prototype._slice = OF2.Buffer.prototype.slice
  };
  a1A.prototype.string = function() {
    var Q = this.uint32();
    return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + Q, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + Q, this.len))
  };
  a1A._configure()
})
// @from(Start 10203029, End 10204498)
SF2 = z((WdG, jF2) => {
  jF2.exports = VOA;
  var NB0 = rk();
  (VOA.prototype = Object.create(NB0.EventEmitter.prototype)).constructor = VOA;

  function VOA(A, Q, B) {
    if (typeof A !== "function") throw TypeError("rpcImpl must be a function");
    NB0.EventEmitter.call(this), this.rpcImpl = A, this.requestDelimited = Boolean(Q), this.responseDelimited = Boolean(B)
  }
  VOA.prototype.rpcCall = function A(Q, B, G, Z, I) {
    if (!Z) throw TypeError("request must be specified");
    var Y = this;
    if (!I) return NB0.asPromise(A, Y, Q, B, G, Z);
    if (!Y.rpcImpl) {
      setTimeout(function() {
        I(Error("already ended"))
      }, 0);
      return
    }
    try {
      return Y.rpcImpl(Q, B[Y.requestDelimited ? "encodeDelimited" : "encode"](Z).finish(), function(W, X) {
        if (W) return Y.emit("error", W, Q), I(W);
        if (X === null) {
          Y.end(!0);
          return
        }
        if (!(X instanceof G)) try {
          X = G[Y.responseDelimited ? "decodeDelimited" : "decode"](X)
        } catch (V) {
          return Y.emit("error", V, Q), I(V)
        }
        return Y.emit("data", X, Q), I(null, X)
      })
    } catch (J) {
      Y.emit("error", J, Q), setTimeout(function() {
        I(J)
      }, 0);
      return
    }
  };
  VOA.prototype.end = function(Q) {
    if (this.rpcImpl) {
      if (!Q) this.rpcImpl(null, null, null);
      this.rpcImpl = null, this.emit("end").off()
    }
    return this
  }
})
// @from(Start 10204504, End 10204564)
LB0 = z((_F2) => {
  var uU5 = _F2;
  uU5.Service = SF2()
})
// @from(Start 10204570, End 10204615)
MB0 = z((VdG, kF2) => {
  kF2.exports = {}
})
// @from(Start 10204621, End 10204991)
OB0 = z((xF2) => {
  var oU = xF2;
  oU.build = "minimal";
  oU.Writer = K41();
  oU.BufferWriter = $F2();
  oU.Reader = H41();
  oU.BufferReader = PF2();
  oU.util = rk();
  oU.rpc = LB0();
  oU.roots = MB0();
  oU.configure = yF2;

  function yF2() {
    oU.util._configure(), oU.Writer._configure(oU.BufferWriter), oU.Reader._configure(oU.BufferReader)
  }
  yF2()
})