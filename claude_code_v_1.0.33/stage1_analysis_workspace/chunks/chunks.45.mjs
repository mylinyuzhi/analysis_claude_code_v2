
// @from(Start 4112667, End 4114489)
rS = z((VT7, $gQ) => {
  var {
    defineProperty: AcA,
    getOwnPropertyDescriptor: D$8,
    getOwnPropertyNames: H$8
  } = Object, C$8 = Object.prototype.hasOwnProperty, DS1 = (A, Q) => AcA(A, "name", {
    value: Q,
    configurable: !0
  }), E$8 = (A, Q) => {
    for (var B in Q) AcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, z$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of H$8(Q))
        if (!C$8.call(A, Z) && Z !== B) AcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = D$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, U$8 = (A) => z$8(AcA({}, "__esModule", {
    value: !0
  }), A), EgQ = {};
  E$8(EgQ, {
    emitWarningIfUnsupportedVersion: () => $$8,
    setCredentialFeature: () => zgQ,
    setFeature: () => UgQ,
    state: () => KS1
  });
  $gQ.exports = U$8(EgQ);
  var KS1 = {
      warningEmitted: !1
    },
    $$8 = DS1((A) => {
      if (A && !KS1.warningEmitted && parseInt(A.substring(1, A.indexOf("."))) < 18) KS1.warningEmitted = !0, process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`)
    }, "emitWarningIfUnsupportedVersion");

  function zgQ(A, Q, B) {
    if (!A.$source) A.$source = {};
    return A.$source[Q] = B, A
  }
  DS1(zgQ, "setCredentialFeature");

  function UgQ(A, Q, B) {
    if (!A.__aws_sdk_context) A.__aws_sdk_context = {
      features: {}
    };
    else if (!A.__aws_sdk_context.features) A.__aws_sdk_context.features = {};
    A.__aws_sdk_context.features[Q] = B
  }
  DS1(UgQ, "setFeature")
})
// @from(Start 4114495, End 4116568)
HS1 = z((FT7, TgQ) => {
  var {
    defineProperty: QcA,
    getOwnPropertyDescriptor: w$8,
    getOwnPropertyNames: q$8
  } = Object, N$8 = Object.prototype.hasOwnProperty, L$8 = (A, Q) => QcA(A, "name", {
    value: Q,
    configurable: !0
  }), M$8 = (A, Q) => {
    for (var B in Q) QcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, O$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of q$8(Q))
        if (!N$8.call(A, Z) && Z !== B) QcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = w$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, R$8 = (A) => O$8(QcA({}, "__esModule", {
    value: !0
  }), A), wgQ = {};
  M$8(wgQ, {
    ENV_ACCOUNT_ID: () => RgQ,
    ENV_CREDENTIAL_SCOPE: () => OgQ,
    ENV_EXPIRATION: () => MgQ,
    ENV_KEY: () => qgQ,
    ENV_SECRET: () => NgQ,
    ENV_SESSION: () => LgQ,
    fromEnv: () => j$8
  });
  TgQ.exports = R$8(wgQ);
  var T$8 = rS(),
    P$8 = j2(),
    qgQ = "AWS_ACCESS_KEY_ID",
    NgQ = "AWS_SECRET_ACCESS_KEY",
    LgQ = "AWS_SESSION_TOKEN",
    MgQ = "AWS_CREDENTIAL_EXPIRATION",
    OgQ = "AWS_CREDENTIAL_SCOPE",
    RgQ = "AWS_ACCOUNT_ID",
    j$8 = L$8((A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[qgQ],
        B = process.env[NgQ],
        G = process.env[LgQ],
        Z = process.env[MgQ],
        I = process.env[OgQ],
        Y = process.env[RgQ];
      if (Q && B) {
        let J = {
          accessKeyId: Q,
          secretAccessKey: B,
          ...G && {
            sessionToken: G
          },
          ...Z && {
            expiration: new Date(Z)
          },
          ...I && {
            credentialScope: I
          },
          ...Y && {
            accountId: Y
          }
        };
        return (0, T$8.setCredentialFeature)(J, "CREDENTIALS_ENV_VARS", "g"), J
      }
      throw new P$8.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    }, "fromEnv")
})
// @from(Start 4116574, End 4133830)
BuQ = z((KT7, ZcA) => {
  var PgQ, jgQ, SgQ, _gQ, kgQ, ygQ, xgQ, vgQ, bgQ, fgQ, hgQ, ggQ, ugQ, BcA, CS1, mgQ, dgQ, cgQ, A5A, pgQ, lgQ, igQ, ngQ, agQ, sgQ, rgQ, ogQ, tgQ, GcA, egQ, AuQ, QuQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof ZcA === "object" && typeof KT7 === "object") A(B(Q, B(KT7)));
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
    PgQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, jgQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, SgQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, _gQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, kgQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, ygQ = function(I, Y, J, W, X, V) {
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
    }, xgQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, vgQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, bgQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, fgQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, hgQ = function(I, Y, J, W) {
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
    }, ggQ = function(I, Y) {
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
    }, ugQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) GcA(Y, I, J)
    }, GcA = Object.create ? function(I, Y, J, W) {
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
    }, BcA = function(I) {
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
    }, CS1 = function(I, Y) {
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
    }, mgQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(CS1(arguments[Y]));
      return I
    }, dgQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, cgQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, A5A = function(I) {
      return this instanceof A5A ? (this.v = I, this) : new A5A(I)
    }, pgQ = function(I, Y, J) {
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
        q.value instanceof A5A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, lgQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: A5A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, igQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof BcA === "function" ? BcA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, ngQ = function(I, Y) {
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
    agQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") GcA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, sgQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, rgQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, ogQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, tgQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, egQ = function(I, Y, J) {
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
    AuQ = function(I) {
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
    }, QuQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", PgQ), A("__assign", jgQ), A("__rest", SgQ), A("__decorate", _gQ), A("__param", kgQ), A("__esDecorate", ygQ), A("__runInitializers", xgQ), A("__propKey", vgQ), A("__setFunctionName", bgQ), A("__metadata", fgQ), A("__awaiter", hgQ), A("__generator", ggQ), A("__exportStar", ugQ), A("__createBinding", GcA), A("__values", BcA), A("__read", CS1), A("__spread", mgQ), A("__spreadArrays", dgQ), A("__spreadArray", cgQ), A("__await", A5A), A("__asyncGenerator", pgQ), A("__asyncDelegator", lgQ), A("__asyncValues", igQ), A("__makeTemplateObject", ngQ), A("__importStar", agQ), A("__importDefault", sgQ), A("__classPrivateFieldGet", rgQ), A("__classPrivateFieldSet", ogQ), A("__classPrivateFieldIn", tgQ), A("__addDisposableResource", egQ), A("__disposeResources", AuQ), A("__rewriteRelativeImportExtension", QuQ)
  })
})
// @from(Start 4133836, End 4134959)
IuQ = z((GuQ) => {
  Object.defineProperty(GuQ, "__esModule", {
    value: !0
  });
  GuQ.checkUrl = void 0;
  var S$8 = j2(),
    _$8 = "169.254.170.2",
    k$8 = "169.254.170.23",
    y$8 = "[fd00:ec2::23]",
    x$8 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === _$8 || A.hostname === k$8 || A.hostname === y$8) return;
      if (A.hostname.includes("[")) {
        if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
      } else {
        if (A.hostname === "localhost") return;
        let B = A.hostname.split("."),
          G = (Z) => {
            let I = parseInt(Z, 10);
            return 0 <= I && I <= 255
          };
        if (B[0] === "127" && G(B[1]) && G(B[2]) && G(B[3]) && B.length === 4) return
      }
      throw new S$8.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  GuQ.checkUrl = x$8
})
// @from(Start 4134965, End 4137748)
ES1 = z((HT7, HuQ) => {
  var {
    defineProperty: IcA,
    getOwnPropertyDescriptor: v$8,
    getOwnPropertyNames: b$8
  } = Object, f$8 = Object.prototype.hasOwnProperty, YcA = (A, Q) => IcA(A, "name", {
    value: Q,
    configurable: !0
  }), h$8 = (A, Q) => {
    for (var B in Q) IcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, g$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of b$8(Q))
        if (!f$8.call(A, Z) && Z !== B) IcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = v$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, u$8 = (A) => g$8(IcA({}, "__esModule", {
    value: !0
  }), A), YuQ = {};
  h$8(YuQ, {
    AlgorithmId: () => VuQ,
    EndpointURLScheme: () => XuQ,
    FieldPosition: () => FuQ,
    HttpApiKeyAuthLocation: () => WuQ,
    HttpAuthLocation: () => JuQ,
    IniSectionType: () => KuQ,
    RequestHandlerProtocol: () => DuQ,
    SMITHY_CONTEXT_KEY: () => l$8,
    getDefaultClientConfiguration: () => c$8,
    resolveDefaultRuntimeConfig: () => p$8
  });
  HuQ.exports = u$8(YuQ);
  var JuQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(JuQ || {}),
    WuQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(WuQ || {}),
    XuQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(XuQ || {}),
    VuQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(VuQ || {}),
    m$8 = YcA((A) => {
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
    d$8 = YcA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    c$8 = YcA((A) => {
      return m$8(A)
    }, "getDefaultClientConfiguration"),
    p$8 = YcA((A) => {
      return d$8(A)
    }, "resolveDefaultRuntimeConfig"),
    FuQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(FuQ || {}),
    l$8 = "__smithy_context",
    KuQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(KuQ || {}),
    DuQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(DuQ || {})
})
// @from(Start 4137754, End 4142261)
wuQ = z((CT7, $uQ) => {
  var {
    defineProperty: JcA,
    getOwnPropertyDescriptor: i$8,
    getOwnPropertyNames: n$8
  } = Object, a$8 = Object.prototype.hasOwnProperty, td = (A, Q) => JcA(A, "name", {
    value: Q,
    configurable: !0
  }), s$8 = (A, Q) => {
    for (var B in Q) JcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, r$8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of n$8(Q))
        if (!a$8.call(A, Z) && Z !== B) JcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = i$8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, o$8 = (A) => r$8(JcA({}, "__esModule", {
    value: !0
  }), A), CuQ = {};
  s$8(CuQ, {
    Field: () => Aw8,
    Fields: () => Qw8,
    HttpRequest: () => Bw8,
    HttpResponse: () => Gw8,
    IHttpRequest: () => EuQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => t$8,
    isValidHostname: () => UuQ,
    resolveHttpHandlerRuntimeConfig: () => e$8
  });
  $uQ.exports = o$8(CuQ);
  var t$8 = td((A) => {
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
    e$8 = td((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    EuQ = ES1(),
    Aw8 = class {
      static {
        td(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = EuQ.FieldPosition.HEADER,
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
    Qw8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        td(this, "Fields")
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
    Bw8 = class A {
      static {
        td(this, "HttpRequest")
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
        if (B.query) B.query = zuQ(B.query);
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

  function zuQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  td(zuQ, "cloneQuery");
  var Gw8 = class {
    static {
      td(this, "HttpResponse")
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

  function UuQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  td(UuQ, "isValidHostname")
})
// @from(Start 4142267, End 4170722)
guQ = z(($T7, huQ) => {
  var {
    defineProperty: VcA,
    getOwnPropertyDescriptor: Zw8,
    getOwnPropertyNames: Iw8
  } = Object, Yw8 = Object.prototype.hasOwnProperty, KB = (A, Q) => VcA(A, "name", {
    value: Q,
    configurable: !0
  }), Jw8 = (A, Q) => {
    for (var B in Q) VcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Ww8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Iw8(Q))
        if (!Yw8.call(A, Z) && Z !== B) VcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Zw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Xw8 = (A) => Ww8(VcA({}, "__esModule", {
    value: !0
  }), A), NuQ = {};
  Jw8(NuQ, {
    Client: () => Vw8,
    Command: () => MuQ,
    LazyJsonString: () => Oo,
    NoOpLogger: () => Yq8,
    SENSITIVE_STRING: () => Kw8,
    ServiceException: () => nw8,
    _json: () => LS1,
    collectBody: () => zS1.collectBody,
    convertMap: () => Jq8,
    createAggregatedClient: () => Dw8,
    dateToUtcString: () => SuQ,
    decorateServiceException: () => _uQ,
    emitWarningIfUnsupportedVersion: () => ow8,
    expectBoolean: () => Cw8,
    expectByte: () => NS1,
    expectFloat32: () => WcA,
    expectInt: () => zw8,
    expectInt32: () => wS1,
    expectLong: () => mCA,
    expectNonNull: () => $w8,
    expectNumber: () => uCA,
    expectObject: () => OuQ,
    expectShort: () => qS1,
    expectString: () => ww8,
    expectUnion: () => qw8,
    extendedEncodeURIComponent: () => zS1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => Zq8,
    getDefaultClientConfiguration: () => Bq8,
    getDefaultExtensionConfiguration: () => yuQ,
    getValueFromTextNode: () => xuQ,
    handleFloat: () => Mw8,
    isSerializableHeaderValue: () => Iq8,
    limitedParseDouble: () => RS1,
    limitedParseFloat: () => Ow8,
    limitedParseFloat32: () => Rw8,
    loadConfigsForDefaultMode: () => rw8,
    logger: () => dCA,
    map: () => PS1,
    parseBoolean: () => Hw8,
    parseEpochTimestamp: () => hw8,
    parseRfc3339DateTime: () => _w8,
    parseRfc3339DateTimeWithOffset: () => yw8,
    parseRfc7231DateTime: () => fw8,
    quoteHeader: () => buQ,
    resolveDefaultRuntimeConfig: () => Gq8,
    resolvedPath: () => zS1.resolvedPath,
    serializeDateTime: () => Dq8,
    serializeFloat: () => Kq8,
    splitEvery: () => fuQ,
    splitHeader: () => Hq8,
    strictParseByte: () => juQ,
    strictParseDouble: () => OS1,
    strictParseFloat: () => Nw8,
    strictParseFloat32: () => RuQ,
    strictParseInt: () => Tw8,
    strictParseInt32: () => Pw8,
    strictParseLong: () => PuQ,
    strictParseShort: () => Q5A,
    take: () => Wq8,
    throwDefaultError: () => kuQ,
    withBaseException: () => aw8
  });
  huQ.exports = Xw8(NuQ);
  var LuQ = uR(),
    Vw8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, LuQ.constructStack)()
      }
      static {
        KB(this, "Client")
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
    zS1 = w5(),
    $S1 = ES1(),
    MuQ = class {
      constructor() {
        this.middlewareStack = (0, LuQ.constructStack)()
      }
      static {
        KB(this, "Command")
      }
      static classBuilder() {
        return new Fw8
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
            [$S1.SMITHY_CONTEXT_KEY]: {
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
    Fw8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        KB(this, "ClassBuilder")
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
      build() {
        let A = this,
          Q;
        return Q = class extends MuQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this)
          }
          static {
            KB(this, "CommandRef")
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
    Kw8 = "***SensitiveInformation***",
    Dw8 = KB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = KB(async function(Y, J, W) {
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
    Hw8 = KB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    Cw8 = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) dCA.warn(XcA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") dCA.warn(XcA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    uCA = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) dCA.warn(XcA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    Ew8 = Math.ceil(340282346638528860000000000000000000000),
    WcA = KB((A) => {
      let Q = uCA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > Ew8) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    mCA = KB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    zw8 = mCA,
    wS1 = KB((A) => MS1(A, 32), "expectInt32"),
    qS1 = KB((A) => MS1(A, 16), "expectShort"),
    NS1 = KB((A) => MS1(A, 8), "expectByte"),
    MS1 = KB((A, Q) => {
      let B = mCA(A);
      if (B !== void 0 && Uw8(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    Uw8 = KB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    $w8 = KB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    OuQ = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    ww8 = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return dCA.warn(XcA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    qw8 = KB((A) => {
      if (A === null || A === void 0) return;
      let Q = OuQ(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    OS1 = KB((A) => {
      if (typeof A == "string") return uCA(G5A(A));
      return uCA(A)
    }, "strictParseDouble"),
    Nw8 = OS1,
    RuQ = KB((A) => {
      if (typeof A == "string") return WcA(G5A(A));
      return WcA(A)
    }, "strictParseFloat32"),
    Lw8 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    G5A = KB((A) => {
      let Q = A.match(Lw8);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    RS1 = KB((A) => {
      if (typeof A == "string") return TuQ(A);
      return uCA(A)
    }, "limitedParseDouble"),
    Mw8 = RS1,
    Ow8 = RS1,
    Rw8 = KB((A) => {
      if (typeof A == "string") return TuQ(A);
      return WcA(A)
    }, "limitedParseFloat32"),
    TuQ = KB((A) => {
      switch (A) {
        case "NaN":
          return NaN;
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        default:
          throw Error(`Unable to parse float value: ${A}`)
      }
    }, "parseFloatString"),
    PuQ = KB((A) => {
      if (typeof A === "string") return mCA(G5A(A));
      return mCA(A)
    }, "strictParseLong"),
    Tw8 = PuQ,
    Pw8 = KB((A) => {
      if (typeof A === "string") return wS1(G5A(A));
      return wS1(A)
    }, "strictParseInt32"),
    Q5A = KB((A) => {
      if (typeof A === "string") return qS1(G5A(A));
      return qS1(A)
    }, "strictParseShort"),
    juQ = KB((A) => {
      if (typeof A === "string") return NS1(G5A(A));
      return NS1(A)
    }, "strictParseByte"),
    XcA = KB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    dCA = {
      warn: console.warn
    },
    jw8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    TS1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function SuQ(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      I = A.getUTCHours(),
      Y = A.getUTCMinutes(),
      J = A.getUTCSeconds(),
      W = Z < 10 ? `0${Z}` : `${Z}`,
      X = I < 10 ? `0${I}` : `${I}`,
      V = Y < 10 ? `0${Y}` : `${Y}`,
      F = J < 10 ? `0${J}` : `${J}`;
    return `${jw8[G]}, ${W} ${TS1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  KB(SuQ, "dateToUtcString");
  var Sw8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    _w8 = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = Sw8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = Q5A(B5A(G)), F = oS(Z, "month", 1, 12), K = oS(I, "day", 1, 31);
      return gCA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    kw8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    yw8 = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = kw8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = Q5A(B5A(G)), K = oS(Z, "month", 1, 12), D = oS(I, "day", 1, 31), H = gCA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - iw8(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    xw8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    vw8 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    bw8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    fw8 = KB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = xw8.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return gCA(Q5A(B5A(I)), US1(Z), oS(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = vw8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return mw8(gCA(gw8(I), US1(Z), oS(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = bw8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return gCA(Q5A(B5A(X)), US1(G), oS(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    hw8 = KB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = OS1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    gCA = KB((A, Q, B, G) => {
      let Z = Q - 1;
      return cw8(A, Z, B), new Date(Date.UTC(A, Z, B, oS(G.hours, "hour", 0, 23), oS(G.minutes, "minute", 0, 59), oS(G.seconds, "seconds", 0, 60), lw8(G.fractionalMilliseconds)))
    }, "buildDate"),
    gw8 = KB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + Q5A(B5A(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    uw8 = 1576800000000,
    mw8 = KB((A) => {
      if (A.getTime() - new Date().getTime() > uw8) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    US1 = KB((A) => {
      let Q = TS1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    dw8 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    cw8 = KB((A, Q, B) => {
      let G = dw8[Q];
      if (Q === 1 && pw8(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${TS1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    pw8 = KB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    oS = KB((A, Q, B, G) => {
      let Z = juQ(B5A(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    lw8 = KB((A) => {
      if (A === null || A === void 0) return 0;
      return RuQ("0." + A) * 1000
    }, "parseMilliseconds"),
    iw8 = KB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    B5A = KB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    nw8 = class A extends Error {
      static {
        KB(this, "ServiceException")
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
    _uQ = KB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    kuQ = KB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = sw8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw _uQ(Y, Q)
    }, "throwDefaultError"),
    aw8 = KB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        kuQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    sw8 = KB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    rw8 = KB((A) => {
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
    quQ = !1,
    ow8 = KB((A) => {
      if (A && !quQ && parseInt(A.substring(1, A.indexOf("."))) < 16) quQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    tw8 = KB((A) => {
      let Q = [];
      for (let B in $S1.AlgorithmId) {
        let G = $S1.AlgorithmId[B];
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
    ew8 = KB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Aq8 = KB((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Qq8 = KB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    yuQ = KB((A) => {
      return Object.assign(tw8(A), Aq8(A))
    }, "getDefaultExtensionConfiguration"),
    Bq8 = yuQ,
    Gq8 = KB((A) => {
      return Object.assign(ew8(A), Qq8(A))
    }, "resolveDefaultRuntimeConfig"),
    Zq8 = KB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    xuQ = KB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = xuQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    Iq8 = KB((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    Oo = KB(function(Q) {
      return Object.assign(new String(Q), {
        deserializeJSON() {
          return JSON.parse(String(Q))
        },
        toString() {
          return String(Q)
        },
        toJSON() {
          return String(Q)
        }
      })
    }, "LazyJsonString");
  Oo.from = (A) => {
    if (A && typeof A === "object" && (A instanceof Oo || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return Oo(String(A));
    return Oo(JSON.stringify(A))
  };
  Oo.fromObject = Oo.from;
  var Yq8 = class {
    static {
      KB(this, "NoOpLogger")
    }
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };

  function PS1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, Xq8(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      vuQ(G, null, I, Y)
    }
    return G
  }
  KB(PS1, "map");
  var Jq8 = KB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    Wq8 = KB((A, Q) => {
      let B = {};
      for (let G in Q) vuQ(B, A, Q, G);
      return B
    }, "take"),
    Xq8 = KB((A, Q, B) => {
      return PS1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    vuQ = KB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = Vq8, W = Fq8, X = G] = Y;
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
    Vq8 = KB((A) => A != null, "nonNullish"),
    Fq8 = KB((A) => A, "pass");

  function buQ(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  KB(buQ, "quoteHeader");
  var Kq8 = KB((A) => {
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
    Dq8 = KB((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    LS1 = KB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(LS1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = LS1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function fuQ(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      I = "";
    for (let Y = 0; Y < G.length; Y++) {
      if (I === "") I = G[Y];
      else I += Q + G[Y];
      if ((Y + 1) % B === 0) Z.push(I), I = ""
    }
    if (I !== "") Z.push(I);
    return Z
  }
  KB(fuQ, "splitEvery");
  var Hq8 = KB((A) => {
    let Q = A.length,
      B = [],
      G = !1,
      Z = void 0,
      I = 0;
    for (let Y = 0; Y < Q; ++Y) {
      let J = A[Y];
      switch (J) {
        case '"':
          if (Z !== "\\") G = !G;
          break;
        case ",":
          if (!G) B.push(A.slice(I, Y)), I = Y + 1;
          break;
        default:
      }
      Z = J
    }
    return B.push(A.slice(I)), B.map((Y) => {
      Y = Y.trim();
      let J = Y.length;
      if (J < 2) return Y;
      if (Y[0] === '"' && Y[J - 1] === '"') Y = Y.slice(1, J - 1);
      return Y.replace(/\\"/g, '"')
    })
  }, "splitHeader")
})
// @from(Start 4170728, End 4172524)
duQ = z((uuQ) => {
  Object.defineProperty(uuQ, "__esModule", {
    value: !0
  });
  uuQ.getCredentials = uuQ.createGetRequest = void 0;
  var jS1 = j2(),
    Cq8 = wuQ(),
    Eq8 = guQ(),
    zq8 = Xd();

  function Uq8(A) {
    return new Cq8.HttpRequest({
      protocol: A.protocol,
      hostname: A.hostname,
      port: Number(A.port),
      path: A.pathname,
      query: Array.from(A.searchParams.entries()).reduce((Q, [B, G]) => {
        return Q[B] = G, Q
      }, {}),
      fragment: A.hash
    })
  }
  uuQ.createGetRequest = Uq8;
  async function $q8(A, Q) {
    let G = await (0, zq8.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new jS1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, Eq8.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (I) {}
      throw Object.assign(new jS1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new jS1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
  uuQ.getCredentials = $q8
})
// @from(Start 4172530, End 4172900)
luQ = z((cuQ) => {
  Object.defineProperty(cuQ, "__esModule", {
    value: !0
  });
  cuQ.retryWrapper = void 0;
  var qq8 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((I) => setTimeout(I, B))
      }
      return await A()
    }
  };
  cuQ.retryWrapper = qq8
})
// @from(Start 4172906, End 4175394)
ruQ = z((auQ) => {
  Object.defineProperty(auQ, "__esModule", {
    value: !0
  });
  auQ.fromHttp = void 0;
  var Nq8 = BuQ(),
    Lq8 = rS(),
    Mq8 = IZ(),
    iuQ = j2(),
    Oq8 = Nq8.__importDefault(UA("fs/promises")),
    Rq8 = IuQ(),
    nuQ = duQ(),
    Tq8 = luQ(),
    Pq8 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    jq8 = "http://169.254.170.2",
    Sq8 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    _q8 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    kq8 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    yq8 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[Pq8],
        G = A.awsContainerCredentialsFullUri ?? process.env[Sq8],
        Z = A.awsContainerAuthorizationToken ?? process.env[kq8],
        I = A.awsContainerAuthorizationTokenFile ?? process.env[_q8],
        Y = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console.warn : A.logger.warn;
      if (B && G) Y("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), Y("awsContainerCredentialsFullUri will take precedence.");
      if (Z && I) Y("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), Y("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${jq8}${B}`;
      else throw new iuQ.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let J = new URL(Q);
      (0, Rq8.checkUrl)(J, A.logger);
      let W = new Mq8.NodeHttpHandler({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, Tq8.retryWrapper)(async () => {
        let X = (0, nuQ.createGetRequest)(J);
        if (Z) X.headers.Authorization = Z;
        else if (I) X.headers.Authorization = (await Oq8.default.readFile(I)).toString();
        try {
          let V = await W.handle(X);
          return (0, nuQ.getCredentials)(V.response).then((F) => (0, Lq8.setCredentialFeature)(F, "CREDENTIALS_HTTP", "z"))
        } catch (V) {
          throw new iuQ.CredentialsProviderError(String(V), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  auQ.fromHttp = yq8
})
// @from(Start 4175400, End 4175652)
_S1 = z((SS1) => {
  Object.defineProperty(SS1, "__esModule", {
    value: !0
  });
  SS1.fromHttp = void 0;
  var xq8 = ruQ();
  Object.defineProperty(SS1, "fromHttp", {
    enumerable: !0,
    get: function() {
      return xq8.fromHttp
    }
  })
})
// @from(Start 4175658, End 4178441)
YmQ = z((jT7, ImQ) => {
  var {
    defineProperty: FcA,
    getOwnPropertyDescriptor: bq8,
    getOwnPropertyNames: fq8
  } = Object, hq8 = Object.prototype.hasOwnProperty, KcA = (A, Q) => FcA(A, "name", {
    value: Q,
    configurable: !0
  }), gq8 = (A, Q) => {
    for (var B in Q) FcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uq8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of fq8(Q))
        if (!hq8.call(A, Z) && Z !== B) FcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = bq8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mq8 = (A) => uq8(FcA({}, "__esModule", {
    value: !0
  }), A), ouQ = {};
  gq8(ouQ, {
    AlgorithmId: () => QmQ,
    EndpointURLScheme: () => AmQ,
    FieldPosition: () => BmQ,
    HttpApiKeyAuthLocation: () => euQ,
    HttpAuthLocation: () => tuQ,
    IniSectionType: () => GmQ,
    RequestHandlerProtocol: () => ZmQ,
    SMITHY_CONTEXT_KEY: () => iq8,
    getDefaultClientConfiguration: () => pq8,
    resolveDefaultRuntimeConfig: () => lq8
  });
  ImQ.exports = mq8(ouQ);
  var tuQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(tuQ || {}),
    euQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(euQ || {}),
    AmQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(AmQ || {}),
    QmQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(QmQ || {}),
    dq8 = KcA((A) => {
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
    cq8 = KcA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    pq8 = KcA((A) => {
      return dq8(A)
    }, "getDefaultClientConfiguration"),
    lq8 = KcA((A) => {
      return cq8(A)
    }, "resolveDefaultRuntimeConfig"),
    BmQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(BmQ || {}),
    iq8 = "__smithy_context",
    GmQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(GmQ || {}),
    ZmQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(ZmQ || {})
})
// @from(Start 4178447, End 4182954)
KmQ = z((ST7, FmQ) => {
  var {
    defineProperty: DcA,
    getOwnPropertyDescriptor: nq8,
    getOwnPropertyNames: aq8
  } = Object, sq8 = Object.prototype.hasOwnProperty, ed = (A, Q) => DcA(A, "name", {
    value: Q,
    configurable: !0
  }), rq8 = (A, Q) => {
    for (var B in Q) DcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, oq8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of aq8(Q))
        if (!sq8.call(A, Z) && Z !== B) DcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = nq8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, tq8 = (A) => oq8(DcA({}, "__esModule", {
    value: !0
  }), A), JmQ = {};
  rq8(JmQ, {
    Field: () => QN8,
    Fields: () => BN8,
    HttpRequest: () => GN8,
    HttpResponse: () => ZN8,
    IHttpRequest: () => WmQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => eq8,
    isValidHostname: () => VmQ,
    resolveHttpHandlerRuntimeConfig: () => AN8
  });
  FmQ.exports = tq8(JmQ);
  var eq8 = ed((A) => {
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
    AN8 = ed((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    WmQ = YmQ(),
    QN8 = class {
      static {
        ed(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = WmQ.FieldPosition.HEADER,
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
    BN8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        ed(this, "Fields")
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
    GN8 = class A {
      static {
        ed(this, "HttpRequest")
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
        if (B.query) B.query = XmQ(B.query);
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

  function XmQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  ed(XmQ, "cloneQuery");
  var ZN8 = class {
    static {
      ed(this, "HttpResponse")
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

  function VmQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  ed(VmQ, "isValidHostname")
})
// @from(Start 4182960, End 4184824)
cCA = z((xT7, zmQ) => {
  var {
    defineProperty: CcA,
    getOwnPropertyDescriptor: IN8,
    getOwnPropertyNames: YN8
  } = Object, JN8 = Object.prototype.hasOwnProperty, HcA = (A, Q) => CcA(A, "name", {
    value: Q,
    configurable: !0
  }), WN8 = (A, Q) => {
    for (var B in Q) CcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, XN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of YN8(Q))
        if (!JN8.call(A, Z) && Z !== B) CcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = IN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, VN8 = (A) => XN8(CcA({}, "__esModule", {
    value: !0
  }), A), DmQ = {};
  WN8(DmQ, {
    getHostHeaderPlugin: () => KN8,
    hostHeaderMiddleware: () => CmQ,
    hostHeaderMiddlewareOptions: () => EmQ,
    resolveHostHeaderConfig: () => HmQ
  });
  zmQ.exports = VN8(DmQ);
  var FN8 = KmQ();

  function HmQ(A) {
    return A
  }
  HcA(HmQ, "resolveHostHeaderConfig");
  var CmQ = HcA((A) => (Q) => async (B) => {
      if (!FN8.HttpRequest.isInstance(B.request)) return Q(B);
      let {
        request: G
      } = B, {
        handlerProtocol: Z = ""
      } = A.requestHandler.metadata || {};
      if (Z.indexOf("h2") >= 0 && !G.headers[":authority"]) delete G.headers.host, G.headers[":authority"] = G.hostname + (G.port ? ":" + G.port : "");
      else if (!G.headers.host) {
        let I = G.hostname;
        if (G.port != null) I += `:${G.port}`;
        G.headers.host = I
      }
      return Q(B)
    }, "hostHeaderMiddleware"),
    EmQ = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: !0
    },
    KN8 = HcA((A) => ({
      applyToStack: HcA((Q) => {
        Q.add(CmQ(A), EmQ)
      }, "applyToStack")
    }), "getHostHeaderPlugin")
})
// @from(Start 4184830, End 4187130)
pCA = z((vT7, qmQ) => {
  var {
    defineProperty: EcA,
    getOwnPropertyDescriptor: DN8,
    getOwnPropertyNames: HN8
  } = Object, CN8 = Object.prototype.hasOwnProperty, kS1 = (A, Q) => EcA(A, "name", {
    value: Q,
    configurable: !0
  }), EN8 = (A, Q) => {
    for (var B in Q) EcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HN8(Q))
        if (!CN8.call(A, Z) && Z !== B) EcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, UN8 = (A) => zN8(EcA({}, "__esModule", {
    value: !0
  }), A), UmQ = {};
  EN8(UmQ, {
    getLoggerPlugin: () => $N8,
    loggerMiddleware: () => $mQ,
    loggerMiddlewareOptions: () => wmQ
  });
  qmQ.exports = UN8(UmQ);
  var $mQ = kS1(() => (A, Q) => async (B) => {
      try {
        let G = await A(B),
          {
            clientName: Z,
            commandName: I,
            logger: Y,
            dynamoDbDocumentClientOptions: J = {}
          } = Q,
          {
            overrideInputFilterSensitiveLog: W,
            overrideOutputFilterSensitiveLog: X
          } = J,
          V = W ?? Q.inputFilterSensitiveLog,
          F = X ?? Q.outputFilterSensitiveLog,
          {
            $metadata: K,
            ...D
          } = G.output;
        return Y?.info?.({
          clientName: Z,
          commandName: I,
          input: V(B.input),
          output: F(D),
          metadata: K
        }), G
      } catch (G) {
        let {
          clientName: Z,
          commandName: I,
          logger: Y,
          dynamoDbDocumentClientOptions: J = {}
        } = Q, {
          overrideInputFilterSensitiveLog: W
        } = J, X = W ?? Q.inputFilterSensitiveLog;
        throw Y?.error?.({
          clientName: Z,
          commandName: I,
          input: X(B.input),
          error: G,
          metadata: G.$metadata
        }), G
      }
    }, "loggerMiddleware"),
    wmQ = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: !0
    },
    $N8 = kS1((A) => ({
      applyToStack: kS1((Q) => {
        Q.add($mQ(), wmQ)
      }, "applyToStack")
    }), "getLoggerPlugin")
})
// @from(Start 4187136, End 4189919)
_mQ = z((bT7, SmQ) => {
  var {
    defineProperty: zcA,
    getOwnPropertyDescriptor: wN8,
    getOwnPropertyNames: qN8
  } = Object, NN8 = Object.prototype.hasOwnProperty, UcA = (A, Q) => zcA(A, "name", {
    value: Q,
    configurable: !0
  }), LN8 = (A, Q) => {
    for (var B in Q) zcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, MN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qN8(Q))
        if (!NN8.call(A, Z) && Z !== B) zcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ON8 = (A) => MN8(zcA({}, "__esModule", {
    value: !0
  }), A), NmQ = {};
  LN8(NmQ, {
    AlgorithmId: () => RmQ,
    EndpointURLScheme: () => OmQ,
    FieldPosition: () => TmQ,
    HttpApiKeyAuthLocation: () => MmQ,
    HttpAuthLocation: () => LmQ,
    IniSectionType: () => PmQ,
    RequestHandlerProtocol: () => jmQ,
    SMITHY_CONTEXT_KEY: () => SN8,
    getDefaultClientConfiguration: () => PN8,
    resolveDefaultRuntimeConfig: () => jN8
  });
  SmQ.exports = ON8(NmQ);
  var LmQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(LmQ || {}),
    MmQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(MmQ || {}),
    OmQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(OmQ || {}),
    RmQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(RmQ || {}),
    RN8 = UcA((A) => {
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
    TN8 = UcA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    PN8 = UcA((A) => {
      return RN8(A)
    }, "getDefaultClientConfiguration"),
    jN8 = UcA((A) => {
      return TN8(A)
    }, "resolveDefaultRuntimeConfig"),
    TmQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(TmQ || {}),
    SN8 = "__smithy_context",
    PmQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(PmQ || {}),
    jmQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(jmQ || {})
})
// @from(Start 4189925, End 4194432)
fmQ = z((fT7, bmQ) => {
  var {
    defineProperty: $cA,
    getOwnPropertyDescriptor: _N8,
    getOwnPropertyNames: kN8
  } = Object, yN8 = Object.prototype.hasOwnProperty, Ac = (A, Q) => $cA(A, "name", {
    value: Q,
    configurable: !0
  }), xN8 = (A, Q) => {
    for (var B in Q) $cA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kN8(Q))
        if (!yN8.call(A, Z) && Z !== B) $cA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _N8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bN8 = (A) => vN8($cA({}, "__esModule", {
    value: !0
  }), A), kmQ = {};
  xN8(kmQ, {
    Field: () => gN8,
    Fields: () => uN8,
    HttpRequest: () => mN8,
    HttpResponse: () => dN8,
    IHttpRequest: () => ymQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => fN8,
    isValidHostname: () => vmQ,
    resolveHttpHandlerRuntimeConfig: () => hN8
  });
  bmQ.exports = bN8(kmQ);
  var fN8 = Ac((A) => {
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
    hN8 = Ac((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    ymQ = _mQ(),
    gN8 = class {
      static {
        Ac(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = ymQ.FieldPosition.HEADER,
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
    uN8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Ac(this, "Fields")
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
    mN8 = class A {
      static {
        Ac(this, "HttpRequest")
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
        if (B.query) B.query = xmQ(B.query);
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

  function xmQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Ac(xmQ, "cloneQuery");
  var dN8 = class {
    static {
      Ac(this, "HttpResponse")
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

  function vmQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Ac(vmQ, "isValidHostname")
})
// @from(Start 4194438, End 4196371)
lCA = z((mT7, mmQ) => {
  var {
    defineProperty: qcA,
    getOwnPropertyDescriptor: cN8,
    getOwnPropertyNames: pN8
  } = Object, lN8 = Object.prototype.hasOwnProperty, wcA = (A, Q) => qcA(A, "name", {
    value: Q,
    configurable: !0
  }), iN8 = (A, Q) => {
    for (var B in Q) qcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nN8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of pN8(Q))
        if (!lN8.call(A, Z) && Z !== B) qcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = cN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, aN8 = (A) => nN8(qcA({}, "__esModule", {
    value: !0
  }), A), hmQ = {};
  iN8(hmQ, {
    addRecursionDetectionMiddlewareOptions: () => umQ,
    getRecursionDetectionPlugin: () => tN8,
    recursionDetectionMiddleware: () => gmQ
  });
  mmQ.exports = aN8(hmQ);
  var sN8 = fmQ(),
    yS1 = "X-Amzn-Trace-Id",
    rN8 = "AWS_LAMBDA_FUNCTION_NAME",
    oN8 = "_X_AMZN_TRACE_ID",
    gmQ = wcA((A) => (Q) => async (B) => {
      let {
        request: G
      } = B;
      if (!sN8.HttpRequest.isInstance(G) || A.runtime !== "node") return Q(B);
      let Z = Object.keys(G.headers ?? {}).find((W) => W.toLowerCase() === yS1.toLowerCase()) ?? yS1;
      if (G.headers.hasOwnProperty(Z)) return Q(B);
      let I = process.env[rN8],
        Y = process.env[oN8],
        J = wcA((W) => typeof W === "string" && W.length > 0, "nonEmptyString");
      if (J(I) && J(Y)) G.headers[yS1] = Y;
      return Q({
        ...B,
        request: G
      })
    }, "recursionDetectionMiddleware"),
    umQ = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    tN8 = wcA((A) => ({
      applyToStack: wcA((Q) => {
        Q.add(gmQ(A), umQ)
      }, "applyToStack")
    }), "getRecursionDetectionPlugin")
})
// @from(Start 4196377, End 4207748)
I5A = z((dT7, omQ) => {
  var {
    defineProperty: NcA,
    getOwnPropertyDescriptor: eN8,
    getOwnPropertyNames: AL8
  } = Object, QL8 = Object.prototype.hasOwnProperty, Z5A = (A, Q) => NcA(A, "name", {
    value: Q,
    configurable: !0
  }), BL8 = (A, Q) => {
    for (var B in Q) NcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, GL8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of AL8(Q))
        if (!QL8.call(A, Z) && Z !== B) NcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = eN8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ZL8 = (A) => GL8(NcA({}, "__esModule", {
    value: !0
  }), A), cmQ = {};
  BL8(cmQ, {
    ConditionObject: () => kZ.ConditionObject,
    DeprecatedObject: () => kZ.DeprecatedObject,
    EndpointError: () => kZ.EndpointError,
    EndpointObject: () => kZ.EndpointObject,
    EndpointObjectHeaders: () => kZ.EndpointObjectHeaders,
    EndpointObjectProperties: () => kZ.EndpointObjectProperties,
    EndpointParams: () => kZ.EndpointParams,
    EndpointResolverOptions: () => kZ.EndpointResolverOptions,
    EndpointRuleObject: () => kZ.EndpointRuleObject,
    ErrorRuleObject: () => kZ.ErrorRuleObject,
    EvaluateOptions: () => kZ.EvaluateOptions,
    Expression: () => kZ.Expression,
    FunctionArgv: () => kZ.FunctionArgv,
    FunctionObject: () => kZ.FunctionObject,
    FunctionReturn: () => kZ.FunctionReturn,
    ParameterObject: () => kZ.ParameterObject,
    ReferenceObject: () => kZ.ReferenceObject,
    ReferenceRecord: () => kZ.ReferenceRecord,
    RuleSetObject: () => kZ.RuleSetObject,
    RuleSetRules: () => kZ.RuleSetRules,
    TreeRuleObject: () => kZ.TreeRuleObject,
    awsEndpointFunctions: () => rmQ,
    getUserAgentPrefix: () => WL8,
    isIpAddress: () => kZ.isIpAddress,
    partition: () => amQ,
    resolveEndpoint: () => kZ.resolveEndpoint,
    setPartitionInfo: () => smQ,
    useDefaultPartitionInfo: () => JL8
  });
  omQ.exports = ZL8(cmQ);
  var kZ = FI(),
    pmQ = Z5A((A, Q = !1) => {
      if (Q) {
        for (let B of A.split("."))
          if (!pmQ(B)) return !1;
        return !0
      }
      if (!(0, kZ.isValidHostLabel)(A)) return !1;
      if (A.length < 3 || A.length > 63) return !1;
      if (A !== A.toLowerCase()) return !1;
      if ((0, kZ.isIpAddress)(A)) return !1;
      return !0
    }, "isVirtualHostableS3Bucket"),
    dmQ = ":",
    IL8 = "/",
    YL8 = Z5A((A) => {
      let Q = A.split(dmQ);
      if (Q.length < 6) return null;
      let [B, G, Z, I, Y, ...J] = Q;
      if (B !== "arn" || G === "" || Z === "" || J.join(dmQ) === "") return null;
      let W = J.map((X) => X.split(IL8)).flat();
      return {
        partition: G,
        service: Z,
        region: I,
        accountId: Y,
        resourceId: W
      }
    }, "parseArn"),
    lmQ = {
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
    imQ = lmQ,
    nmQ = "",
    amQ = Z5A((A) => {
      let {
        partitions: Q
      } = imQ;
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
    smQ = Z5A((A, Q = "") => {
      imQ = A, nmQ = Q
    }, "setPartitionInfo"),
    JL8 = Z5A(() => {
      smQ(lmQ, "")
    }, "useDefaultPartitionInfo"),
    WL8 = Z5A(() => nmQ, "getUserAgentPrefix"),
    rmQ = {
      isVirtualHostableS3Bucket: pmQ,
      parseArn: YL8,
      partition: amQ
    };
  kZ.customEndpointFunctions.aws = rmQ
})
// @from(Start 4207754, End 4210537)
JdQ = z((cT7, YdQ) => {
  var {
    defineProperty: LcA,
    getOwnPropertyDescriptor: XL8,
    getOwnPropertyNames: VL8
  } = Object, FL8 = Object.prototype.hasOwnProperty, McA = (A, Q) => LcA(A, "name", {
    value: Q,
    configurable: !0
  }), KL8 = (A, Q) => {
    for (var B in Q) LcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, DL8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of VL8(Q))
        if (!FL8.call(A, Z) && Z !== B) LcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = XL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, HL8 = (A) => DL8(LcA({}, "__esModule", {
    value: !0
  }), A), tmQ = {};
  KL8(tmQ, {
    AlgorithmId: () => BdQ,
    EndpointURLScheme: () => QdQ,
    FieldPosition: () => GdQ,
    HttpApiKeyAuthLocation: () => AdQ,
    HttpAuthLocation: () => emQ,
    IniSectionType: () => ZdQ,
    RequestHandlerProtocol: () => IdQ,
    SMITHY_CONTEXT_KEY: () => $L8,
    getDefaultClientConfiguration: () => zL8,
    resolveDefaultRuntimeConfig: () => UL8
  });
  YdQ.exports = HL8(tmQ);
  var emQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(emQ || {}),
    AdQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(AdQ || {}),
    QdQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(QdQ || {}),
    BdQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(BdQ || {}),
    CL8 = McA((A) => {
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
    EL8 = McA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    zL8 = McA((A) => {
      return CL8(A)
    }, "getDefaultClientConfiguration"),
    UL8 = McA((A) => {
      return EL8(A)
    }, "resolveDefaultRuntimeConfig"),
    GdQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(GdQ || {}),
    $L8 = "__smithy_context",
    ZdQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(ZdQ || {}),
    IdQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(IdQ || {})
})