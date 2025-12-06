
// @from(Start 3627121, End 3644376)
Co = z((IM7, AdA) => {
  var mTQ, dTQ, cTQ, pTQ, lTQ, iTQ, nTQ, aTQ, sTQ, rTQ, oTQ, tTQ, eTQ, tmA, UT1, APQ, QPQ, BPQ, P6A, GPQ, ZPQ, IPQ, YPQ, JPQ, WPQ, XPQ, VPQ, FPQ, emA, KPQ, DPQ, HPQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof AdA === "object" && typeof IM7 === "object") A(B(Q, B(IM7)));
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
    mTQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, dTQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, cTQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, pTQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, lTQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, iTQ = function(I, Y, J, W, X, V) {
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
    }, nTQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, aTQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, sTQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, rTQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, oTQ = function(I, Y, J, W) {
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
    }, tTQ = function(I, Y) {
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
    }, eTQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) emA(Y, I, J)
    }, emA = Object.create ? function(I, Y, J, W) {
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
    }, tmA = function(I) {
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
    }, UT1 = function(I, Y) {
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
    }, APQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(UT1(arguments[Y]));
      return I
    }, QPQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, BPQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, P6A = function(I) {
      return this instanceof P6A ? (this.v = I, this) : new P6A(I)
    }, GPQ = function(I, Y, J) {
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
        q.value instanceof P6A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, ZPQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: P6A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, IPQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof tmA === "function" ? tmA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, YPQ = function(I, Y) {
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
    JPQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") emA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, WPQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, XPQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, VPQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, FPQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, KPQ = function(I, Y, J) {
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
    DPQ = function(I) {
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
    }, HPQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", mTQ), A("__assign", dTQ), A("__rest", cTQ), A("__decorate", pTQ), A("__param", lTQ), A("__esDecorate", iTQ), A("__runInitializers", nTQ), A("__propKey", aTQ), A("__setFunctionName", sTQ), A("__metadata", rTQ), A("__awaiter", oTQ), A("__generator", tTQ), A("__exportStar", eTQ), A("__createBinding", emA), A("__values", tmA), A("__read", UT1), A("__spread", APQ), A("__spreadArrays", QPQ), A("__spreadArray", BPQ), A("__await", P6A), A("__asyncGenerator", GPQ), A("__asyncDelegator", ZPQ), A("__asyncValues", IPQ), A("__makeTemplateObject", YPQ), A("__importStar", JPQ), A("__importDefault", WPQ), A("__classPrivateFieldGet", XPQ), A("__classPrivateFieldSet", VPQ), A("__classPrivateFieldIn", FPQ), A("__addDisposableResource", KPQ), A("__disposeResources", DPQ), A("__rewriteRelativeImportExtension", HPQ)
  })
})
// @from(Start 3644382, End 3646365)
aR = z((YM7, $PQ) => {
  var {
    defineProperty: QdA,
    getOwnPropertyDescriptor: h78,
    getOwnPropertyNames: g78
  } = Object, u78 = Object.prototype.hasOwnProperty, BdA = (A, Q) => QdA(A, "name", {
    value: Q,
    configurable: !0
  }), m78 = (A, Q) => {
    for (var B in Q) QdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, d78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of g78(Q))
        if (!u78.call(A, Z) && Z !== B) QdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = h78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, c78 = (A) => d78(QdA({}, "__esModule", {
    value: !0
  }), A), CPQ = {};
  m78(CPQ, {
    emitWarningIfUnsupportedVersion: () => p78,
    setCredentialFeature: () => EPQ,
    setFeature: () => zPQ,
    setTokenFeature: () => UPQ,
    state: () => $T1
  });
  $PQ.exports = c78(CPQ);
  var $T1 = {
      warningEmitted: !1
    },
    p78 = BdA((A) => {
      if (A && !$T1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) $T1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    }, "emitWarningIfUnsupportedVersion");

  function EPQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  BdA(EPQ, "setCredentialFeature");

  function zPQ(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }
  BdA(zPQ, "setFeature");

  function UPQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  BdA(UPQ, "setTokenFeature")
})
// @from(Start 3646371, End 3647324)
NPQ = z((JM7, qPQ) => {
  var {
    defineProperty: GdA,
    getOwnPropertyDescriptor: l78,
    getOwnPropertyNames: i78
  } = Object, n78 = Object.prototype.hasOwnProperty, a78 = (A, Q) => GdA(A, "name", {
    value: Q,
    configurable: !0
  }), s78 = (A, Q) => {
    for (var B in Q) GdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, r78 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of i78(Q))
        if (!n78.call(A, Z) && Z !== B) GdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = l78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, o78 = (A) => r78(GdA({}, "__esModule", {
    value: !0
  }), A), wPQ = {};
  s78(wPQ, {
    isArrayBuffer: () => t78
  });
  qPQ.exports = o78(wPQ);
  var t78 = a78((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 3647330, End 3648383)
RPQ = z((WM7, OPQ) => {
  var {
    defineProperty: ZdA,
    getOwnPropertyDescriptor: e78,
    getOwnPropertyNames: AG8
  } = Object, QG8 = Object.prototype.hasOwnProperty, wT1 = (A, Q) => ZdA(A, "name", {
    value: Q,
    configurable: !0
  }), BG8 = (A, Q) => {
    for (var B in Q) ZdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, GG8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of AG8(Q))
        if (!QG8.call(A, Z) && Z !== B) ZdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = e78(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ZG8 = (A) => GG8(ZdA({}, "__esModule", {
    value: !0
  }), A), LPQ = {};
  BG8(LPQ, {
    escapeUri: () => MPQ,
    escapeUriPath: () => YG8
  });
  OPQ.exports = ZG8(LPQ);
  var MPQ = wT1((A) => encodeURIComponent(A).replace(/[!'()*]/g, IG8), "escapeUri"),
    IG8 = wT1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    YG8 = wT1((A) => A.split("/").map(MPQ).join("/"), "escapeUriPath")
})
// @from(Start 3648389, End 3665302)
AjQ = z((XM7, ePQ) => {
  var {
    defineProperty: FdA,
    getOwnPropertyDescriptor: JG8,
    getOwnPropertyNames: WG8
  } = Object, XG8 = Object.prototype.hasOwnProperty, VD = (A, Q) => FdA(A, "name", {
    value: Q,
    configurable: !0
  }), VG8 = (A, Q) => {
    for (var B in Q) FdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, FG8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of WG8(Q))
        if (!XG8.call(A, Z) && Z !== B) FdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = JG8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, KG8 = (A) => FG8(FdA({}, "__esModule", {
    value: !0
  }), A), _PQ = {};
  VG8(_PQ, {
    ALGORITHM_IDENTIFIER: () => IdA,
    ALGORITHM_IDENTIFIER_V4A: () => EG8,
    ALGORITHM_QUERY_PARAM: () => kPQ,
    ALWAYS_UNSIGNABLE_HEADERS: () => uPQ,
    AMZ_DATE_HEADER: () => PT1,
    AMZ_DATE_QUERY_PARAM: () => MT1,
    AUTH_HEADER: () => TT1,
    CREDENTIAL_QUERY_PARAM: () => yPQ,
    DATE_HEADER: () => bPQ,
    EVENT_ALGORITHM_IDENTIFIER: () => cPQ,
    EXPIRES_QUERY_PARAM: () => vPQ,
    GENERATED_HEADERS: () => fPQ,
    HOST_HEADER: () => HG8,
    KEY_TYPE_IDENTIFIER: () => jT1,
    MAX_CACHE_SIZE: () => lPQ,
    MAX_PRESIGNED_TTL: () => iPQ,
    PROXY_HEADER_PATTERN: () => mPQ,
    REGION_SET_PARAM: () => DG8,
    SEC_HEADER_PATTERN: () => dPQ,
    SHA256_HEADER: () => VdA,
    SIGNATURE_HEADER: () => hPQ,
    SIGNATURE_QUERY_PARAM: () => OT1,
    SIGNED_HEADERS_QUERY_PARAM: () => xPQ,
    SignatureV4: () => TG8,
    SignatureV4Base: () => tPQ,
    TOKEN_HEADER: () => gPQ,
    TOKEN_QUERY_PARAM: () => RT1,
    UNSIGNABLE_PATTERNS: () => CG8,
    UNSIGNED_PAYLOAD: () => pPQ,
    clearCredentialCache: () => UG8,
    createScope: () => JdA,
    getCanonicalHeaders: () => qT1,
    getCanonicalQuery: () => oPQ,
    getPayloadHash: () => WdA,
    getSigningKey: () => nPQ,
    hasHeader: () => aPQ,
    moveHeadersToQuery: () => rPQ,
    prepareRequest: () => LT1,
    signatureV4aContainer: () => PG8
  });
  ePQ.exports = KG8(_PQ);
  var TPQ = O2(),
    kPQ = "X-Amz-Algorithm",
    yPQ = "X-Amz-Credential",
    MT1 = "X-Amz-Date",
    xPQ = "X-Amz-SignedHeaders",
    vPQ = "X-Amz-Expires",
    OT1 = "X-Amz-Signature",
    RT1 = "X-Amz-Security-Token",
    DG8 = "X-Amz-Region-Set",
    TT1 = "authorization",
    PT1 = MT1.toLowerCase(),
    bPQ = "date",
    fPQ = [TT1, PT1, bPQ],
    hPQ = OT1.toLowerCase(),
    VdA = "x-amz-content-sha256",
    gPQ = RT1.toLowerCase(),
    HG8 = "host",
    uPQ = {
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
    mPQ = /^proxy-/,
    dPQ = /^sec-/,
    CG8 = [/^proxy-/i, /^sec-/i],
    IdA = "AWS4-HMAC-SHA256",
    EG8 = "AWS4-ECDSA-P256-SHA256",
    cPQ = "AWS4-HMAC-SHA256-PAYLOAD",
    pPQ = "UNSIGNED-PAYLOAD",
    lPQ = 50,
    jT1 = "aws4_request",
    iPQ = 604800,
    pd = Jd(),
    zG8 = O2(),
    j6A = {},
    YdA = [],
    JdA = VD((A, Q, B) => `${A}/${Q}/${B}/${jT1}`, "createScope"),
    nPQ = VD(async (A, Q, B, G, Z) => {
      let I = await PPQ(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,pd.toHex)(I)}:${Q.sessionToken}`;
      if (Y in j6A) return j6A[Y];
      YdA.push(Y);
      while (YdA.length > lPQ) delete j6A[YdA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, jT1]) J = await PPQ(A, J, W);
      return j6A[Y] = J
    }, "getSigningKey"),
    UG8 = VD(() => {
      YdA.length = 0, Object.keys(j6A).forEach((A) => {
        delete j6A[A]
      })
    }, "clearCredentialCache"),
    PPQ = VD((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, zG8.toUint8Array)(B)), G.digest()
    }, "hmac"),
    qT1 = VD(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in uPQ || Q?.has(I) || mPQ.test(I) || dPQ.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    $G8 = NPQ(),
    wG8 = O2(),
    WdA = VD(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === VdA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, $G8.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, wG8.toUint8Array)(Q)), (0, pd.toHex)(await G.digest())
      }
      return pPQ
    }, "getPayloadHash"),
    jPQ = O2(),
    qG8 = class {
      static {
        VD(this, "HeaderFormatter")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = (0, jPQ.fromUtf8)(Z);
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
            let Y = (0, jPQ.fromUtf8)(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(LG8.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!NG8.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, pd.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
    },
    NG8 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    LG8 = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        VD(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) NT1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) NT1(Q);
        return parseInt((0, pd.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function NT1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  VD(NT1, "negate");
  var aPQ = VD((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    sPQ = az(),
    rPQ = VD((A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = sPQ.HttpRequest.clone(A);
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
    LT1 = VD((A) => {
      A = sPQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (fPQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    SPQ = w7(),
    MG8 = O2(),
    XdA = RPQ(),
    oPQ = VD(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === hPQ) continue;
        let Z = (0, XdA.escapeUri)(G);
        Q.push(Z);
        let I = A[G];
        if (typeof I === "string") B[Z] = `${Z}=${(0,XdA.escapeUri)(I)}`;
        else if (Array.isArray(I)) B[Z] = I.slice(0).reduce((Y, J) => Y.concat([`${Z}=${(0,XdA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    OG8 = VD((A) => RG8(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    RG8 = VD((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    tPQ = class {
      static {
        VD(this, "SignatureV4Base")
      }
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        this.service = G, this.sha256 = Z, this.uriEscapePath = I, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = (0, SPQ.normalizeProvider)(B), this.credentialProvider = (0, SPQ.normalizeProvider)(Q)
      }
      createCanonicalRequest(A, Q, B) {
        let G = Object.keys(Q).sort();
        return `${A.method}
${this.getCanonicalPath(A)}
${oPQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
      }
      async createStringToSign(A, Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, MG8.toUint8Array)(B));
        let I = await Z.digest();
        return `${G}
${A}
${Q}
${(0,pd.toHex)(I)}`
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
          return (0, XdA.escapeUri)(B).replace(/%2F/g, "/")
        }
        return A
      }
      validateResolvedCredentials(A) {
        if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
      formatDate(A) {
        let Q = OG8(A).replace(/[\-:]/g, "");
        return {
          longDate: Q,
          shortDate: Q.slice(0, 8)
        }
      }
      getCanonicalHeaderList(A) {
        return Object.keys(A).sort().join(";")
      }
    },
    TG8 = class extends tPQ {
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
        this.headerFormatter = new qG8
      }
      static {
        VD(this, "SignatureV4")
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
        if (G > iPQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = JdA(D, F, X ?? this.service),
          C = rPQ(LT1(A), {
            unhoistableHeaders: I,
            hoistableHeaders: J
          });
        if (V.sessionToken) C.query[RT1] = V.sessionToken;
        C.query[kPQ] = IdA, C.query[yPQ] = `${V.accessKeyId}/${H}`, C.query[MT1] = K, C.query[vPQ] = G.toString(10);
        let E = qT1(C, Z, Y);
        return C.query[xPQ] = this.getCanonicalHeaderList(E), C.query[OT1] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await WdA(A, this.sha256))), C
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
          X = JdA(J, Y, I ?? this.service),
          V = await WdA({
            headers: {},
            body: Q
          }, this.sha256),
          F = new this.sha256;
        F.update(A);
        let K = (0, pd.toHex)(await F.digest()),
          D = [cPQ, W, X, G, K, V].join(`
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
        return J.update((0, TPQ.toUint8Array)(A)), (0, pd.toHex)(await J.digest())
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
          W = LT1(A),
          {
            longDate: X,
            shortDate: V
          } = this.formatDate(Q),
          F = JdA(V, J, I ?? this.service);
        if (W.headers[PT1] = X, Y.sessionToken) W.headers[gPQ] = Y.sessionToken;
        let K = await WdA(W, this.sha256);
        if (!aPQ(VdA, W.headers) && this.applyChecksum) W.headers[VdA] = K;
        let D = qT1(W, G, B),
          H = await this.getSignature(X, F, this.getSigningKey(Y, J, V, I), this.createCanonicalRequest(W, D, K));
        return W.headers[TT1] = `${IdA} Credential=${Y.accessKeyId}/${F}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${H}`, W
      }
      async getSignature(A, Q, B, G) {
        let Z = await this.createStringToSign(A, Q, G, IdA),
          I = new this.sha256(await B);
        return I.update((0, TPQ.toUint8Array)(Z)), (0, pd.toHex)(await I.digest())
      }
      getSigningKey(A, Q, B, G) {
        return nPQ(this.sha256, A, B, Q, G || this.service)
      }
    },
    PG8 = {
      SignatureV4a: null
    }
})
// @from(Start 3665308, End 3674722)
yT1 = z((DM7, DjQ) => {
  var {
    defineProperty: KdA,
    getOwnPropertyDescriptor: jG8,
    getOwnPropertyNames: SG8
  } = Object, _G8 = Object.prototype.hasOwnProperty, $W = (A, Q) => KdA(A, "name", {
    value: Q,
    configurable: !0
  }), kG8 = (A, Q) => {
    for (var B in Q) KdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, yG8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of SG8(Q))
        if (!_G8.call(A, Z) && Z !== B) KdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = jG8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, xG8 = (A) => yG8(KdA({}, "__esModule", {
    value: !0
  }), A), WjQ = {};
  kG8(WjQ, {
    AWSSDKSigV4Signer: () => hG8,
    AwsSdkSigV4ASigner: () => uG8,
    AwsSdkSigV4Signer: () => kT1,
    NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => mG8,
    NODE_SIGV4A_CONFIG_OPTIONS: () => pG8,
    getBearerTokenEnvKey: () => XjQ,
    resolveAWSSDKSigV4Config: () => iG8,
    resolveAwsSdkSigV4AConfig: () => cG8,
    resolveAwsSdkSigV4Config: () => VjQ,
    validateSigningProperties: () => _T1
  });
  DjQ.exports = xG8(WjQ);
  var vG8 = az(),
    bG8 = az(),
    QjQ = $W((A) => bG8.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0, "getDateHeader"),
    ST1 = $W((A) => new Date(Date.now() + A), "getSkewCorrectedDate"),
    fG8 = $W((A, Q) => Math.abs(ST1(Q).getTime() - A) >= 300000, "isClockSkewed"),
    BjQ = $W((A, Q) => {
      let B = Date.parse(A);
      if (fG8(B, Q)) return B - Date.now();
      return Q
    }, "getUpdatedSystemClockOffset"),
    UCA = $W((A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    }, "throwSigningPropertyError"),
    _T1 = $W(async (A) => {
      let Q = UCA("context", A.context),
        B = UCA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        I = await UCA("signer", B.signer)(G),
        Y = A?.signingRegion,
        J = A?.signingRegionSet,
        W = A?.signingName;
      return {
        config: B,
        signer: I,
        signingRegion: Y,
        signingRegionSet: J,
        signingName: W
      }
    }, "validateSigningProperties"),
    kT1 = class {
      static {
        $W(this, "AwsSdkSigV4Signer")
      }
      async sign(A, Q, B) {
        if (!vG8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let G = await _T1(B),
          {
            config: Z,
            signer: I
          } = G,
          {
            signingRegion: Y,
            signingName: J
          } = G,
          W = B.context;
        if (W?.authSchemes?.length ?? !1) {
          let [V, F] = W.authSchemes;
          if (V?.name === "sigv4a" && F?.name === "sigv4") Y = F?.signingRegion ?? Y, J = F?.signingName ?? J
        }
        return await I.sign(A, {
          signingDate: ST1(Z.systemClockOffset),
          signingRegion: Y,
          signingService: J
        })
      }
      errorHandler(A) {
        return (Q) => {
          let B = Q.ServerTime ?? QjQ(Q.$response);
          if (B) {
            let G = UCA("config", A.config),
              Z = G.systemClockOffset;
            if (G.systemClockOffset = BjQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
          }
          throw Q
        }
      }
      successHandler(A, Q) {
        let B = QjQ(A);
        if (B) {
          let G = UCA("config", Q.config);
          G.systemClockOffset = BjQ(B, G.systemClockOffset)
        }
      }
    },
    hG8 = kT1,
    gG8 = az(),
    uG8 = class extends kT1 {
      static {
        $W(this, "AwsSdkSigV4ASigner")
      }
      async sign(A, Q, B) {
        if (!gG8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let {
          config: G,
          signer: Z,
          signingRegion: I,
          signingRegionSet: Y,
          signingName: J
        } = await _T1(B), X = (await G.sigv4aSigningRegionSet?.() ?? Y ?? [I]).join(",");
        return await Z.sign(A, {
          signingDate: ST1(G.systemClockOffset),
          signingRegion: X,
          signingService: J
        })
      }
    },
    GjQ = $W((A) => typeof A === "string" && A.length > 0 ? A.split(",").map((Q) => Q.trim()) : [], "getArrayForCommaSeparatedString"),
    XjQ = $W((A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`, "getBearerTokenEnvKey"),
    ZjQ = "AWS_AUTH_SCHEME_PREFERENCE",
    IjQ = "auth_scheme_preference",
    mG8 = {
      environmentVariableSelector: $W((A, Q) => {
        if (Q?.signingName) {
          if (XjQ(Q.signingName) in A) return ["httpBearerAuth"]
        }
        if (!(ZjQ in A)) return;
        return GjQ(A[ZjQ])
      }, "environmentVariableSelector"),
      configFileSelector: $W((A) => {
        if (!(IjQ in A)) return;
        return GjQ(A[IjQ])
      }, "configFileSelector"),
      default: []
    },
    dG8 = iB(),
    YjQ = j2(),
    cG8 = $W((A) => {
      return A.sigv4aSigningRegionSet = (0, dG8.normalizeProvider)(A.sigv4aSigningRegionSet), A
    }, "resolveAwsSdkSigV4AConfig"),
    pG8 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new YjQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new YjQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    lG8 = aR(),
    Eo = iB(),
    JjQ = AjQ(),
    VjQ = $W((A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(X) {
          if (X && X !== Q && X !== G) B = !0;
          Q = X;
          let V = FjQ(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            F = KjQ(A, V);
          if (B && !F.attributed) G = $W(async (K) => F(K).then((D) => (0, lG8.setCredentialFeature)(D, "CREDENTIALS_CODE", "e")), "resolvedCredentials"), G.memoized = F.memoized, G.configBound = F.configBound, G.attributed = !0;
          else G = F
        },
        get() {
          return G
        },
        enumerable: !0,
        configurable: !0
      }), A.credentials = Q;
      let {
        signingEscapePath: Z = !0,
        systemClockOffset: I = A.systemClockOffset || 0,
        sha256: Y
      } = A, J;
      if (A.signer) J = (0, Eo.normalizeProvider)(A.signer);
      else if (A.regionInfoProvider) J = $W(() => (0, Eo.normalizeProvider)(A.region)().then(async (X) => [await A.regionInfoProvider(X, {
        useFipsEndpoint: await A.useFipsEndpoint(),
        useDualstackEndpoint: await A.useDualstackEndpoint()
      }) || {}, X]).then(([X, V]) => {
        let {
          signingRegion: F,
          signingService: K
        } = X;
        A.signingRegion = A.signingRegion || F || V, A.signingName = A.signingName || K || A.serviceId;
        let D = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || JjQ.SignatureV4)(D)
      }), "signer");
      else J = $W(async (X) => {
        X = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await (0, Eo.normalizeProvider)(A.region)(),
          properties: {}
        }, X);
        let {
          signingRegion: V,
          signingName: F
        } = X;
        A.signingRegion = A.signingRegion || V, A.signingName = A.signingName || F || A.serviceId;
        let K = {
          ...A,
          credentials: A.credentials,
          region: A.signingRegion,
          service: A.signingName,
          sha256: Y,
          uriEscapePath: Z
        };
        return new(A.signerConstructor || JjQ.SignatureV4)(K)
      }, "signer");
      return Object.assign(A, {
        systemClockOffset: I,
        signingEscapePath: Z,
        signer: J
      })
    }, "resolveAwsSdkSigV4Config"),
    iG8 = VjQ;

  function FjQ(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = (0, Eo.memoizeIdentityProvider)(Q, Eo.isIdentityExpired, Eo.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = (0, Eo.normalizeProvider)(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = $W(async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    }, "credentialsProvider");
    return G.memoized = !0, G
  }
  $W(FjQ, "normalizeCredentialProvider");

  function KjQ(A, Q) {
    if (Q.configBound) return Q;
    let B = $W(async (G) => Q({
      ...G,
      callerClientConfig: A
    }), "fn");
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  $W(KjQ, "bindCallerConfig")
})
// @from(Start 3674728, End 3675215)
EjQ = z((HjQ) => {
  Object.defineProperty(HjQ, "__esModule", {
    value: !0
  });
  HjQ.fromBase64 = void 0;
  var nG8 = hI(),
    aG8 = /^[A-Za-z0-9+/]*={0,2}$/,
    sG8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!aG8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, nG8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  HjQ.fromBase64 = sG8
})
// @from(Start 3675221, End 3675800)
$jQ = z((zjQ) => {
  Object.defineProperty(zjQ, "__esModule", {
    value: !0
  });
  zjQ.toBase64 = void 0;
  var rG8 = hI(),
    oG8 = O2(),
    tG8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, oG8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, rG8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  zjQ.toBase64 = tG8
})
// @from(Start 3675806, End 3676501)
ld = z((UM7, DdA) => {
  var {
    defineProperty: wjQ,
    getOwnPropertyDescriptor: eG8,
    getOwnPropertyNames: AZ8
  } = Object, QZ8 = Object.prototype.hasOwnProperty, xT1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of AZ8(Q))
        if (!QZ8.call(A, Z) && Z !== B) wjQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = eG8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, qjQ = (A, Q, B) => (xT1(A, Q, "default"), B && xT1(B, Q, "default")), BZ8 = (A) => xT1(wjQ({}, "__esModule", {
    value: !0
  }), A), vT1 = {};
  DdA.exports = BZ8(vT1);
  qjQ(vT1, EjQ(), DdA.exports);
  qjQ(vT1, $jQ(), DdA.exports)
})
// @from(Start 3676507, End 3690531)
o6 = z(($M7, dT1) => {
  var {
    defineProperty: HdA,
    getOwnPropertyDescriptor: GZ8,
    getOwnPropertyNames: ZZ8
  } = Object, IZ8 = Object.prototype.hasOwnProperty, _3 = (A, Q) => HdA(A, "name", {
    value: Q,
    configurable: !0
  }), YZ8 = (A, Q) => {
    for (var B in Q) HdA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, fT1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ZZ8(Q))
        if (!IZ8.call(A, Z) && Z !== B) HdA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = GZ8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, JZ8 = (A, Q, B) => (fT1(A, Q, "default"), B && fT1(B, Q, "default")), WZ8 = (A) => fT1(HdA({}, "__esModule", {
    value: !0
  }), A), uT1 = {};
  YZ8(uT1, {
    Client: () => XZ8,
    Command: () => MjQ,
    NoOpLogger: () => RZ8,
    SENSITIVE_STRING: () => FZ8,
    ServiceException: () => DZ8,
    _json: () => gT1,
    collectBody: () => bT1.collectBody,
    convertMap: () => TZ8,
    createAggregatedClient: () => KZ8,
    decorateServiceException: () => OjQ,
    emitWarningIfUnsupportedVersion: () => zZ8,
    extendedEncodeURIComponent: () => bT1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => MZ8,
    getDefaultClientConfiguration: () => NZ8,
    getDefaultExtensionConfiguration: () => TjQ,
    getValueFromTextNode: () => PjQ,
    isSerializableHeaderValue: () => OZ8,
    loadConfigsForDefaultMode: () => EZ8,
    map: () => mT1,
    resolveDefaultRuntimeConfig: () => LZ8,
    resolvedPath: () => bT1.resolvedPath,
    serializeDateTime: () => yZ8,
    serializeFloat: () => kZ8,
    take: () => PZ8,
    throwDefaultError: () => RjQ,
    withBaseException: () => HZ8
  });
  dT1.exports = WZ8(uT1);
  var LjQ = uR(),
    XZ8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, LjQ.constructStack)()
      }
      static {
        _3(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    bT1 = w5(),
    hT1 = CT1(),
    MjQ = class {
      constructor() {
        this.middlewareStack = (0, LjQ.constructStack)()
      }
      static {
        _3(this, "Command")
      }
      static classBuilder() {
        return new VZ8
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [hT1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    VZ8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        _3(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
      }
      ser(A) {
        return this._serializer = A, this
      }
      de(A) {
        return this._deserializer = A, this
      }
      sc(A) {
        return this._operationSchema = A, this._smithyContext.operationSchema = A, this
      }
      build() {
        let A = this,
          Q;
        return Q = class extends MjQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
          }
          static {
            _3(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    FZ8 = "***SensitiveInformation***",
    KZ8 = _3((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = _3(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    DZ8 = class A extends Error {
      static {
        _3(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    OjQ = _3((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    RjQ = _3(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = CZ8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw OjQ(Y, Q)
    }, "throwDefaultError"),
    HZ8 = _3((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        RjQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    CZ8 = _3((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    EZ8 = _3((A) => {
      switch (A) {
        case "standard":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "in-region":
          return {
            retryMode: "standard", connectionTimeout: 1100
          };
        case "cross-region":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "mobile":
          return {
            retryMode: "standard", connectionTimeout: 30000
          };
        default:
          return {}
      }
    }, "loadConfigsForDefaultMode"),
    NjQ = !1,
    zZ8 = _3((A) => {
      if (A && !NjQ && parseInt(A.substring(1, A.indexOf("."))) < 16) NjQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    UZ8 = _3((A) => {
      let Q = [];
      for (let B in hT1.AlgorithmId) {
        let G = hT1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    $Z8 = _3((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    wZ8 = _3((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    qZ8 = _3((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    TjQ = _3((A) => {
      return Object.assign(UZ8(A), wZ8(A))
    }, "getDefaultExtensionConfiguration"),
    NZ8 = TjQ,
    LZ8 = _3((A) => {
      return Object.assign($Z8(A), qZ8(A))
    }, "resolveDefaultRuntimeConfig"),
    MZ8 = _3((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    PjQ = _3((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = PjQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    OZ8 = _3((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    RZ8 = class {
      static {
        _3(this, "NoOpLogger")
      }
      trace() {}
      debug() {}
      info() {}
      warn() {}
      error() {}
    };

  function mT1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, jZ8(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      jjQ(G, null, I, Y)
    }
    return G
  }
  _3(mT1, "map");
  var TZ8 = _3((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    PZ8 = _3((A, Q) => {
      let B = {};
      for (let G in Q) jjQ(B, A, Q, G);
      return B
    }, "take"),
    jZ8 = _3((A, Q, B) => {
      return mT1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    jjQ = _3((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = SZ8, W = _Z8, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    SZ8 = _3((A) => A != null, "nonNullish"),
    _Z8 = _3((A) => A, "pass"),
    kZ8 = _3((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    yZ8 = _3((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    gT1 = _3((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(gT1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = gT1(A[B])
        }
        return Q
      }
      return A
    }, "_json");
  JZ8(uT1, s6(), dT1.exports)
})