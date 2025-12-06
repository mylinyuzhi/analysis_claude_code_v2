
// @from(Start 4308248, End 4325504)
YlQ = z(($P7, tcA) => {
  var kpQ, ypQ, xpQ, vpQ, bpQ, fpQ, hpQ, gpQ, upQ, mpQ, dpQ, cpQ, ppQ, rcA, K_1, lpQ, ipQ, npQ, K5A, apQ, spQ, rpQ, opQ, tpQ, epQ, AlQ, QlQ, BlQ, ocA, GlQ, ZlQ, IlQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof tcA === "object" && typeof $P7 === "object") A(B(Q, B($P7)));
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
    kpQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, ypQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, xpQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, vpQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, bpQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, fpQ = function(I, Y, J, W, X, V) {
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
    }, hpQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, gpQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, upQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, mpQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, dpQ = function(I, Y, J, W) {
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
    }, cpQ = function(I, Y) {
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
    }, ppQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) ocA(Y, I, J)
    }, ocA = Object.create ? function(I, Y, J, W) {
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
    }, rcA = function(I) {
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
    }, K_1 = function(I, Y) {
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
    }, lpQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(K_1(arguments[Y]));
      return I
    }, ipQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, npQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, K5A = function(I) {
      return this instanceof K5A ? (this.v = I, this) : new K5A(I)
    }, apQ = function(I, Y, J) {
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
        q.value instanceof K5A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, spQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: K5A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, rpQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof rcA === "function" ? rcA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, opQ = function(I, Y) {
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
    tpQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") ocA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, epQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, AlQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, QlQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, BlQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, GlQ = function(I, Y, J) {
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
    ZlQ = function(I) {
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
    }, IlQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", kpQ), A("__assign", ypQ), A("__rest", xpQ), A("__decorate", vpQ), A("__param", bpQ), A("__esDecorate", fpQ), A("__runInitializers", hpQ), A("__propKey", gpQ), A("__setFunctionName", upQ), A("__metadata", mpQ), A("__awaiter", dpQ), A("__generator", cpQ), A("__exportStar", ppQ), A("__createBinding", ocA), A("__values", rcA), A("__read", K_1), A("__spread", lpQ), A("__spreadArrays", ipQ), A("__spreadArray", npQ), A("__await", K5A), A("__asyncGenerator", apQ), A("__asyncDelegator", spQ), A("__asyncValues", rpQ), A("__makeTemplateObject", opQ), A("__importStar", tpQ), A("__importDefault", epQ), A("__classPrivateFieldGet", AlQ), A("__classPrivateFieldSet", QlQ), A("__classPrivateFieldIn", BlQ), A("__addDisposableResource", GlQ), A("__disposeResources", ZlQ), A("__rewriteRelativeImportExtension", IlQ)
  })
})
// @from(Start 4325510, End 4329094)
JlQ = z((wP7, tR8) => {
  tR8.exports = {
    name: "@aws-sdk/client-sso",
    description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
    version: "3.797.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sso",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.796.0",
      "@aws-sdk/middleware-host-header": "3.775.0",
      "@aws-sdk/middleware-logger": "3.775.0",
      "@aws-sdk/middleware-recursion-detection": "3.775.0",
      "@aws-sdk/middleware-user-agent": "3.796.0",
      "@aws-sdk/region-config-resolver": "3.775.0",
      "@aws-sdk/types": "3.775.0",
      "@aws-sdk/util-endpoints": "3.787.0",
      "@aws-sdk/util-user-agent-browser": "3.775.0",
      "@aws-sdk/util-user-agent-node": "3.796.0",
      "@smithy/config-resolver": "^4.1.0",
      "@smithy/core": "^3.2.0",
      "@smithy/fetch-http-handler": "^5.0.2",
      "@smithy/hash-node": "^4.0.2",
      "@smithy/invalid-dependency": "^4.0.2",
      "@smithy/middleware-content-length": "^4.0.2",
      "@smithy/middleware-endpoint": "^4.1.0",
      "@smithy/middleware-retry": "^4.1.0",
      "@smithy/middleware-serde": "^4.0.3",
      "@smithy/middleware-stack": "^4.0.2",
      "@smithy/node-config-provider": "^4.0.2",
      "@smithy/node-http-handler": "^4.0.4",
      "@smithy/protocol-http": "^5.1.0",
      "@smithy/smithy-client": "^4.2.0",
      "@smithy/types": "^4.2.0",
      "@smithy/url-parser": "^4.0.2",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.8",
      "@smithy/util-defaults-mode-node": "^4.0.8",
      "@smithy/util-endpoints": "^3.0.2",
      "@smithy/util-middleware": "^4.0.2",
      "@smithy/util-retry": "^4.0.2",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.2.2"
    },
    engines: {
      node: ">=18.0.0"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["dist-*/**"],
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    browser: {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
    },
    "react-native": {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
    },
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sso"
    }
  }
})
// @from(Start 4329100, End 4331276)
eCA = z((qP7, HlQ) => {
  var {
    defineProperty: ApA,
    getOwnPropertyDescriptor: eR8,
    getOwnPropertyNames: AT8
  } = Object, QT8 = Object.prototype.hasOwnProperty, ecA = (A, Q) => ApA(A, "name", {
    value: Q,
    configurable: !0
  }), BT8 = (A, Q) => {
    for (var B in Q) ApA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, GT8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of AT8(Q))
        if (!QT8.call(A, Z) && Z !== B) ApA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = eR8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, ZT8 = (A) => GT8(ApA({}, "__esModule", {
    value: !0
  }), A), XlQ = {};
  BT8(XlQ, {
    NODE_APP_ID_CONFIG_OPTIONS: () => XT8,
    UA_APP_ID_ENV_NAME: () => KlQ,
    UA_APP_ID_INI_NAME: () => DlQ,
    createDefaultUserAgentProvider: () => FlQ,
    crtAvailability: () => VlQ,
    defaultUserAgent: () => YT8
  });
  HlQ.exports = ZT8(XlQ);
  var WlQ = UA("os"),
    D_1 = UA("process"),
    VlQ = {
      isCrtAvailable: !1
    },
    IT8 = ecA(() => {
      if (VlQ.isCrtAvailable) return ["md/crt-avail"];
      return null
    }, "isCrtAvailable"),
    FlQ = ecA(({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${(0,WlQ.platform)()}`, (0, WlQ.release)()],
            ["lang/js"],
            ["md/nodejs", `${D_1.versions.node}`]
          ],
          Z = IT8();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (D_1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${D_1.env.AWS_EXECUTION_ENV}`]);
        let I = await B?.userAgentAppId?.();
        return I ? [...G, [`app/${I}`]] : [...G]
      }
    }, "createDefaultUserAgentProvider"),
    YT8 = FlQ,
    JT8 = F5A(),
    KlQ = "AWS_SDK_UA_APP_ID",
    DlQ = "sdk_ua_app_id",
    WT8 = "sdk-ua-app-id",
    XT8 = {
      environmentVariableSelector: ecA((A) => A[KlQ], "environmentVariableSelector"),
      configFileSelector: ecA((A) => A[DlQ] ?? A[WT8], "configFileSelector"),
      default: JT8.DEFAULT_UA_APP_ID
    }
})
// @from(Start 4331282, End 4334065)
H_1 = z((NP7, LlQ) => {
  var {
    defineProperty: QpA,
    getOwnPropertyDescriptor: VT8,
    getOwnPropertyNames: FT8
  } = Object, KT8 = Object.prototype.hasOwnProperty, BpA = (A, Q) => QpA(A, "name", {
    value: Q,
    configurable: !0
  }), DT8 = (A, Q) => {
    for (var B in Q) QpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HT8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of FT8(Q))
        if (!KT8.call(A, Z) && Z !== B) QpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = VT8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, CT8 = (A) => HT8(QpA({}, "__esModule", {
    value: !0
  }), A), ClQ = {};
  DT8(ClQ, {
    AlgorithmId: () => $lQ,
    EndpointURLScheme: () => UlQ,
    FieldPosition: () => wlQ,
    HttpApiKeyAuthLocation: () => zlQ,
    HttpAuthLocation: () => ElQ,
    IniSectionType: () => qlQ,
    RequestHandlerProtocol: () => NlQ,
    SMITHY_CONTEXT_KEY: () => wT8,
    getDefaultClientConfiguration: () => UT8,
    resolveDefaultRuntimeConfig: () => $T8
  });
  LlQ.exports = CT8(ClQ);
  var ElQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(ElQ || {}),
    zlQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(zlQ || {}),
    UlQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(UlQ || {}),
    $lQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })($lQ || {}),
    ET8 = BpA((A) => {
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
    zT8 = BpA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    UT8 = BpA((A) => {
      return ET8(A)
    }, "getDefaultClientConfiguration"),
    $T8 = BpA((A) => {
      return zT8(A)
    }, "resolveDefaultRuntimeConfig"),
    wlQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(wlQ || {}),
    wT8 = "__smithy_context",
    qlQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(qlQ || {}),
    NlQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(NlQ || {})
})
// @from(Start 4334071, End 4362526)
ZEA = z((LP7, mlQ) => {
  var {
    defineProperty: IpA,
    getOwnPropertyDescriptor: qT8,
    getOwnPropertyNames: NT8
  } = Object, LT8 = Object.prototype.hasOwnProperty, HB = (A, Q) => IpA(A, "name", {
    value: Q,
    configurable: !0
  }), MT8 = (A, Q) => {
    for (var B in Q) IpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, OT8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NT8(Q))
        if (!LT8.call(A, Z) && Z !== B) IpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qT8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, RT8 = (A) => OT8(IpA({}, "__esModule", {
    value: !0
  }), A), OlQ = {};
  MT8(OlQ, {
    Client: () => TT8,
    Command: () => TlQ,
    LazyJsonString: () => Po,
    NoOpLogger: () => LP8,
    SENSITIVE_STRING: () => jT8,
    ServiceException: () => VP8,
    _json: () => q_1,
    collectBody: () => C_1.collectBody,
    convertMap: () => MP8,
    createAggregatedClient: () => ST8,
    dateToUtcString: () => ylQ,
    decorateServiceException: () => xlQ,
    emitWarningIfUnsupportedVersion: () => HP8,
    expectBoolean: () => kT8,
    expectByte: () => w_1,
    expectFloat32: () => GpA,
    expectInt: () => xT8,
    expectInt32: () => U_1,
    expectLong: () => BEA,
    expectNonNull: () => bT8,
    expectNumber: () => QEA,
    expectObject: () => PlQ,
    expectShort: () => $_1,
    expectString: () => fT8,
    expectUnion: () => hT8,
    extendedEncodeURIComponent: () => C_1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => qP8,
    getDefaultClientConfiguration: () => $P8,
    getDefaultExtensionConfiguration: () => blQ,
    getValueFromTextNode: () => flQ,
    handleFloat: () => mT8,
    isSerializableHeaderValue: () => NP8,
    limitedParseDouble: () => M_1,
    limitedParseFloat: () => dT8,
    limitedParseFloat32: () => cT8,
    loadConfigsForDefaultMode: () => DP8,
    logger: () => GEA,
    map: () => R_1,
    parseBoolean: () => _T8,
    parseEpochTimestamp: () => QP8,
    parseRfc3339DateTime: () => aT8,
    parseRfc3339DateTimeWithOffset: () => rT8,
    parseRfc7231DateTime: () => AP8,
    quoteHeader: () => glQ,
    resolveDefaultRuntimeConfig: () => wP8,
    resolvedPath: () => C_1.resolvedPath,
    serializeDateTime: () => SP8,
    serializeFloat: () => jP8,
    splitEvery: () => ulQ,
    splitHeader: () => _P8,
    strictParseByte: () => klQ,
    strictParseDouble: () => L_1,
    strictParseFloat: () => gT8,
    strictParseFloat32: () => jlQ,
    strictParseInt: () => pT8,
    strictParseInt32: () => lT8,
    strictParseLong: () => _lQ,
    strictParseShort: () => D5A,
    take: () => OP8,
    throwDefaultError: () => vlQ,
    withBaseException: () => FP8
  });
  mlQ.exports = RT8(OlQ);
  var RlQ = uR(),
    TT8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, RlQ.constructStack)()
      }
      static {
        HB(this, "Client")
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
    C_1 = w5(),
    z_1 = H_1(),
    TlQ = class {
      constructor() {
        this.middlewareStack = (0, RlQ.constructStack)()
      }
      static {
        HB(this, "Command")
      }
      static classBuilder() {
        return new PT8
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
            [z_1.SMITHY_CONTEXT_KEY]: {
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
    PT8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        HB(this, "ClassBuilder")
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
        return Q = class extends TlQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this)
          }
          static {
            HB(this, "CommandRef")
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
    jT8 = "***SensitiveInformation***",
    ST8 = HB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = HB(async function(Y, J, W) {
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
    _T8 = HB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    kT8 = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) GEA.warn(ZpA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") GEA.warn(ZpA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    QEA = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) GEA.warn(ZpA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    yT8 = Math.ceil(340282346638528860000000000000000000000),
    GpA = HB((A) => {
      let Q = QEA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > yT8) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    BEA = HB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    xT8 = BEA,
    U_1 = HB((A) => N_1(A, 32), "expectInt32"),
    $_1 = HB((A) => N_1(A, 16), "expectShort"),
    w_1 = HB((A) => N_1(A, 8), "expectByte"),
    N_1 = HB((A, Q) => {
      let B = BEA(A);
      if (B !== void 0 && vT8(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    vT8 = HB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    bT8 = HB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    PlQ = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    fT8 = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return GEA.warn(ZpA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    hT8 = HB((A) => {
      if (A === null || A === void 0) return;
      let Q = PlQ(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    L_1 = HB((A) => {
      if (typeof A == "string") return QEA(C5A(A));
      return QEA(A)
    }, "strictParseDouble"),
    gT8 = L_1,
    jlQ = HB((A) => {
      if (typeof A == "string") return GpA(C5A(A));
      return GpA(A)
    }, "strictParseFloat32"),
    uT8 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    C5A = HB((A) => {
      let Q = A.match(uT8);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    M_1 = HB((A) => {
      if (typeof A == "string") return SlQ(A);
      return QEA(A)
    }, "limitedParseDouble"),
    mT8 = M_1,
    dT8 = M_1,
    cT8 = HB((A) => {
      if (typeof A == "string") return SlQ(A);
      return GpA(A)
    }, "limitedParseFloat32"),
    SlQ = HB((A) => {
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
    _lQ = HB((A) => {
      if (typeof A === "string") return BEA(C5A(A));
      return BEA(A)
    }, "strictParseLong"),
    pT8 = _lQ,
    lT8 = HB((A) => {
      if (typeof A === "string") return U_1(C5A(A));
      return U_1(A)
    }, "strictParseInt32"),
    D5A = HB((A) => {
      if (typeof A === "string") return $_1(C5A(A));
      return $_1(A)
    }, "strictParseShort"),
    klQ = HB((A) => {
      if (typeof A === "string") return w_1(C5A(A));
      return w_1(A)
    }, "strictParseByte"),
    ZpA = HB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    GEA = {
      warn: console.warn
    },
    iT8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    O_1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function ylQ(A) {
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
    return `${iT8[G]}, ${W} ${O_1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  HB(ylQ, "dateToUtcString");
  var nT8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    aT8 = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = nT8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = D5A(H5A(G)), F = A_(Z, "month", 1, 12), K = A_(I, "day", 1, 31);
      return AEA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    sT8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    rT8 = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = sT8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = D5A(H5A(G)), K = A_(Z, "month", 1, 12), D = A_(I, "day", 1, 31), H = AEA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - XP8(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    oT8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    tT8 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    eT8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    AP8 = HB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = oT8.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return AEA(D5A(H5A(I)), E_1(Z), A_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = tT8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return ZP8(AEA(BP8(I), E_1(Z), A_(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = eT8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return AEA(D5A(H5A(X)), E_1(G), A_(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    QP8 = HB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = L_1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    AEA = HB((A, Q, B, G) => {
      let Z = Q - 1;
      return YP8(A, Z, B), new Date(Date.UTC(A, Z, B, A_(G.hours, "hour", 0, 23), A_(G.minutes, "minute", 0, 59), A_(G.seconds, "seconds", 0, 60), WP8(G.fractionalMilliseconds)))
    }, "buildDate"),
    BP8 = HB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + D5A(H5A(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    GP8 = 1576800000000,
    ZP8 = HB((A) => {
      if (A.getTime() - new Date().getTime() > GP8) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    E_1 = HB((A) => {
      let Q = O_1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    IP8 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    YP8 = HB((A, Q, B) => {
      let G = IP8[Q];
      if (Q === 1 && JP8(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${O_1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    JP8 = HB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    A_ = HB((A, Q, B, G) => {
      let Z = klQ(H5A(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    WP8 = HB((A) => {
      if (A === null || A === void 0) return 0;
      return jlQ("0." + A) * 1000
    }, "parseMilliseconds"),
    XP8 = HB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    H5A = HB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    VP8 = class A extends Error {
      static {
        HB(this, "ServiceException")
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
    xlQ = HB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    vlQ = HB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = KP8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw xlQ(Y, Q)
    }, "throwDefaultError"),
    FP8 = HB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        vlQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    KP8 = HB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    DP8 = HB((A) => {
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
    MlQ = !1,
    HP8 = HB((A) => {
      if (A && !MlQ && parseInt(A.substring(1, A.indexOf("."))) < 16) MlQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    CP8 = HB((A) => {
      let Q = [];
      for (let B in z_1.AlgorithmId) {
        let G = z_1.AlgorithmId[B];
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
    EP8 = HB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    zP8 = HB((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    UP8 = HB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    blQ = HB((A) => {
      return Object.assign(CP8(A), zP8(A))
    }, "getDefaultExtensionConfiguration"),
    $P8 = blQ,
    wP8 = HB((A) => {
      return Object.assign(EP8(A), UP8(A))
    }, "resolveDefaultRuntimeConfig"),
    qP8 = HB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    flQ = HB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = flQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    NP8 = HB((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    Po = HB(function(Q) {
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
  Po.from = (A) => {
    if (A && typeof A === "object" && (A instanceof Po || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return Po(String(A));
    return Po(JSON.stringify(A))
  };
  Po.fromObject = Po.from;
  var LP8 = class {
    static {
      HB(this, "NoOpLogger")
    }
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };

  function R_1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, RP8(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      hlQ(G, null, I, Y)
    }
    return G
  }
  HB(R_1, "map");
  var MP8 = HB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    OP8 = HB((A, Q) => {
      let B = {};
      for (let G in Q) hlQ(B, A, Q, G);
      return B
    }, "take"),
    RP8 = HB((A, Q, B) => {
      return R_1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    hlQ = HB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = TP8, W = PP8, X = G] = Y;
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
    TP8 = HB((A) => A != null, "nonNullish"),
    PP8 = HB((A) => A, "pass");

  function glQ(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  HB(glQ, "quoteHeader");
  var jP8 = HB((A) => {
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
    SP8 = HB((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    q_1 = HB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(q_1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = q_1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function ulQ(A, Q, B) {
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
  HB(ulQ, "splitEvery");
  var _P8 = HB((A) => {
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
// @from(Start 4362532, End 4363019)
plQ = z((dlQ) => {
  Object.defineProperty(dlQ, "__esModule", {
    value: !0
  });
  dlQ.fromBase64 = void 0;
  var kP8 = hI(),
    yP8 = /^[A-Za-z0-9+/]*={0,2}$/,
    xP8 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!yP8.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, kP8.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  dlQ.fromBase64 = xP8
})
// @from(Start 4363025, End 4363604)
nlQ = z((llQ) => {
  Object.defineProperty(llQ, "__esModule", {
    value: !0
  });
  llQ.toBase64 = void 0;
  var vP8 = hI(),
    bP8 = O2(),
    fP8 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, bP8.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, vP8.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  llQ.toBase64 = fP8
})
// @from(Start 4363610, End 4364306)
rlQ = z((_P7, YpA) => {
  var {
    defineProperty: alQ,
    getOwnPropertyDescriptor: hP8,
    getOwnPropertyNames: gP8
  } = Object, uP8 = Object.prototype.hasOwnProperty, T_1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of gP8(Q))
        if (!uP8.call(A, Z) && Z !== B) alQ(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = hP8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, slQ = (A, Q, B) => (T_1(A, Q, "default"), B && T_1(B, Q, "default")), mP8 = (A) => T_1(alQ({}, "__esModule", {
    value: !0
  }), A), P_1 = {};
  YpA.exports = mP8(P_1);
  slQ(P_1, plQ(), YpA.exports);
  slQ(P_1, nlQ(), YpA.exports)
})
// @from(Start 4364312, End 4369009)
DiQ = z((FiQ) => {
  Object.defineProperty(FiQ, "__esModule", {
    value: !0
  });
  FiQ.ruleSet = void 0;
  var JiQ = "required",
    mL = "fn",
    dL = "argv",
    U5A = "ref",
    olQ = !0,
    tlQ = "isSet",
    IEA = "booleanEquals",
    E5A = "error",
    z5A = "endpoint",
    zb = "tree",
    j_1 = "PartitionResult",
    S_1 = "getAttr",
    elQ = {
      [JiQ]: !1,
      type: "String"
    },
    AiQ = {
      [JiQ]: !0,
      default: !1,
      type: "Boolean"
    },
    QiQ = {
      [U5A]: "Endpoint"
    },
    WiQ = {
      [mL]: IEA,
      [dL]: [{
        [U5A]: "UseFIPS"
      }, !0]
    },
    XiQ = {
      [mL]: IEA,
      [dL]: [{
        [U5A]: "UseDualStack"
      }, !0]
    },
    uL = {},
    BiQ = {
      [mL]: S_1,
      [dL]: [{
        [U5A]: j_1
      }, "supportsFIPS"]
    },
    ViQ = {
      [U5A]: j_1
    },
    GiQ = {
      [mL]: IEA,
      [dL]: [!0, {
        [mL]: S_1,
        [dL]: [ViQ, "supportsDualStack"]
      }]
    },
    ZiQ = [WiQ],
    IiQ = [XiQ],
    YiQ = [{
      [U5A]: "Region"
    }],
    dP8 = {
      version: "1.0",
      parameters: {
        Region: elQ,
        UseDualStack: AiQ,
        UseFIPS: AiQ,
        Endpoint: elQ
      },
      rules: [{
        conditions: [{
          [mL]: tlQ,
          [dL]: [QiQ]
        }],
        rules: [{
          conditions: ZiQ,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: E5A
        }, {
          conditions: IiQ,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: E5A
        }, {
          endpoint: {
            url: QiQ,
            properties: uL,
            headers: uL
          },
          type: z5A
        }],
        type: zb
      }, {
        conditions: [{
          [mL]: tlQ,
          [dL]: YiQ
        }],
        rules: [{
          conditions: [{
            [mL]: "aws.partition",
            [dL]: YiQ,
            assign: j_1
          }],
          rules: [{
            conditions: [WiQ, XiQ],
            rules: [{
              conditions: [{
                [mL]: IEA,
                [dL]: [olQ, BiQ]
              }, GiQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: uL,
                  headers: uL
                },
                type: z5A
              }],
              type: zb
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: E5A
            }],
            type: zb
          }, {
            conditions: ZiQ,
            rules: [{
              conditions: [{
                [mL]: IEA,
                [dL]: [BiQ, olQ]
              }],
              rules: [{
                conditions: [{
                  [mL]: "stringEquals",
                  [dL]: [{
                    [mL]: S_1,
                    [dL]: [ViQ, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: uL,
                  headers: uL
                },
                type: z5A
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: uL,
                  headers: uL
                },
                type: z5A
              }],
              type: zb
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: E5A
            }],
            type: zb
          }, {
            conditions: IiQ,
            rules: [{
              conditions: [GiQ],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: uL,
                  headers: uL
                },
                type: z5A
              }],
              type: zb
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: E5A
            }],
            type: zb
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: uL,
              headers: uL
            },
            type: z5A
          }],
          type: zb
        }],
        type: zb
      }, {
        error: "Invalid Configuration: Missing Region",
        type: E5A
      }]
    };
  FiQ.ruleSet = dP8
})
// @from(Start 4369015, End 4369579)
EiQ = z((HiQ) => {
  Object.defineProperty(HiQ, "__esModule", {
    value: !0
  });
  HiQ.defaultEndpointResolver = void 0;
  var cP8 = I5A(),
    __1 = FI(),
    pP8 = DiQ(),
    lP8 = new __1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    iP8 = (A, Q = {}) => {
      return lP8.get(A, () => (0, __1.resolveEndpoint)(pP8.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  HiQ.defaultEndpointResolver = iP8;
  __1.customEndpointFunctions.aws = cP8.awsEndpointFunctions
})
// @from(Start 4369585, End 4370996)
qiQ = z(($iQ) => {
  Object.defineProperty($iQ, "__esModule", {
    value: !0
  });
  $iQ.getRuntimeConfig = void 0;
  var nP8 = jF(),
    aP8 = iB(),
    sP8 = ZEA(),
    rP8 = NJ(),
    ziQ = rlQ(),
    UiQ = O2(),
    oP8 = F_1(),
    tP8 = EiQ(),
    eP8 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? ziQ.fromBase64,
        base64Encoder: A?.base64Encoder ?? ziQ.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? tP8.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? oP8.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new nP8.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new aP8.NoAuthSigner
        }],
        logger: A?.logger ?? new sP8.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? rP8.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? UiQ.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? UiQ.toUtf8
      }
    };
  $iQ.getRuntimeConfig = eP8
})
// @from(Start 4371002, End 4373164)
TiQ = z((OiQ) => {
  Object.defineProperty(OiQ, "__esModule", {
    value: !0
  });
  OiQ.getRuntimeConfig = void 0;
  var Aj8 = YlQ(),
    Qj8 = Aj8.__importDefault(JlQ()),
    Bj8 = jF(),
    NiQ = eCA(),
    JpA = f8(),
    Gj8 = RX(),
    LiQ = D6(),
    $5A = uI(),
    MiQ = IZ(),
    Zj8 = TX(),
    Ij8 = KW(),
    Yj8 = qiQ(),
    Jj8 = ZEA(),
    Wj8 = PX(),
    Xj8 = ZEA(),
    Vj8 = (A) => {
      (0, Xj8.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, Wj8.resolveDefaultsModeConfig)(A),
        B = () => Q().then(Jj8.loadConfigsForDefaultMode),
        G = (0, Yj8.getRuntimeConfig)(A);
      (0, Bj8.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        bodyLengthChecker: A?.bodyLengthChecker ?? Zj8.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, NiQ.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: Qj8.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, $5A.loadConfig)(LiQ.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, $5A.loadConfig)(JpA.NODE_REGION_CONFIG_OPTIONS, {
          ...JpA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: MiQ.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, $5A.loadConfig)({
          ...LiQ.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || Ij8.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? Gj8.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? MiQ.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, $5A.loadConfig)(JpA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, $5A.loadConfig)(JpA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, $5A.loadConfig)(NiQ.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  OiQ.getRuntimeConfig = Vj8
})
// @from(Start 4373170, End 4375773)
YEA = z((bP7, yiQ) => {
  var {
    defineProperty: WpA,
    getOwnPropertyDescriptor: Fj8,
    getOwnPropertyNames: Kj8
  } = Object, Dj8 = Object.prototype.hasOwnProperty, Q_ = (A, Q) => WpA(A, "name", {
    value: Q,
    configurable: !0
  }), Hj8 = (A, Q) => {
    for (var B in Q) WpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Cj8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Kj8(Q))
        if (!Dj8.call(A, Z) && Z !== B) WpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Fj8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Ej8 = (A) => Cj8(WpA({}, "__esModule", {
    value: !0
  }), A), jiQ = {};
  Hj8(jiQ, {
    NODE_REGION_CONFIG_FILE_OPTIONS: () => wj8,
    NODE_REGION_CONFIG_OPTIONS: () => $j8,
    REGION_ENV_NAME: () => SiQ,
    REGION_INI_NAME: () => _iQ,
    getAwsRegionExtensionConfiguration: () => zj8,
    resolveAwsRegionExtensionConfiguration: () => Uj8,
    resolveRegionConfig: () => qj8
  });
  yiQ.exports = Ej8(jiQ);
  var zj8 = Q_((A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    }, "getAwsRegionExtensionConfiguration"),
    Uj8 = Q_((A) => {
      return {
        region: A.region()
      }
    }, "resolveAwsRegionExtensionConfiguration"),
    SiQ = "AWS_REGION",
    _iQ = "region",
    $j8 = {
      environmentVariableSelector: Q_((A) => A[SiQ], "environmentVariableSelector"),
      configFileSelector: Q_((A) => A[_iQ], "configFileSelector"),
      default: Q_(() => {
        throw Error("Region is missing")
      }, "default")
    },
    wj8 = {
      preferredFile: "credentials"
    },
    kiQ = Q_((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    PiQ = Q_((A) => kiQ(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    qj8 = Q_((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: Q_(async () => {
          if (typeof Q === "string") return PiQ(Q);
          let G = await Q();
          return PiQ(G)
        }, "region"),
        useFipsEndpoint: Q_(async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (kiQ(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }, "useFipsEndpoint")
      })
    }, "resolveRegionConfig")
})
// @from(Start 4375779, End 4380286)
giQ = z((fP7, hiQ) => {
  var {
    defineProperty: XpA,
    getOwnPropertyDescriptor: Nj8,
    getOwnPropertyNames: Lj8
  } = Object, Mj8 = Object.prototype.hasOwnProperty, Zc = (A, Q) => XpA(A, "name", {
    value: Q,
    configurable: !0
  }), Oj8 = (A, Q) => {
    for (var B in Q) XpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Rj8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of Lj8(Q))
        if (!Mj8.call(A, Z) && Z !== B) XpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Nj8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Tj8 = (A) => Rj8(XpA({}, "__esModule", {
    value: !0
  }), A), xiQ = {};
  Oj8(xiQ, {
    Field: () => Sj8,
    Fields: () => _j8,
    HttpRequest: () => kj8,
    HttpResponse: () => yj8,
    IHttpRequest: () => viQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => Pj8,
    isValidHostname: () => fiQ,
    resolveHttpHandlerRuntimeConfig: () => jj8
  });
  hiQ.exports = Tj8(xiQ);
  var Pj8 = Zc((A) => {
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
    jj8 = Zc((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    viQ = H_1(),
    Sj8 = class {
      static {
        Zc(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = viQ.FieldPosition.HEADER,
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
    _j8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Zc(this, "Fields")
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
    kj8 = class A {
      static {
        Zc(this, "HttpRequest")
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
        if (B.query) B.query = biQ(B.query);
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

  function biQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Zc(biQ, "cloneQuery");
  var yj8 = class {
    static {
      Zc(this, "HttpResponse")
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

  function fiQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Zc(fiQ, "isValidHostname")
})
// @from(Start 4380292, End 4396842)
DnQ = z((mP7, KnQ) => {
  var {
    defineProperty: VpA,
    getOwnPropertyDescriptor: xj8,
    getOwnPropertyNames: vj8
  } = Object, bj8 = Object.prototype.hasOwnProperty, R5 = (A, Q) => VpA(A, "name", {
    value: Q,
    configurable: !0
  }), fj8 = (A, Q) => {
    for (var B in Q) VpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, hj8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of vj8(Q))
        if (!bj8.call(A, Z) && Z !== B) VpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = xj8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, gj8 = (A) => hj8(VpA({}, "__esModule", {
    value: !0
  }), A), iiQ = {};
  fj8(iiQ, {
    GetRoleCredentialsCommand: () => XnQ,
    GetRoleCredentialsRequestFilterSensitiveLog: () => oiQ,
    GetRoleCredentialsResponseFilterSensitiveLog: () => eiQ,
    InvalidRequestException: () => niQ,
    ListAccountRolesCommand: () => k_1,
    ListAccountRolesRequestFilterSensitiveLog: () => AnQ,
    ListAccountsCommand: () => y_1,
    ListAccountsRequestFilterSensitiveLog: () => QnQ,
    LogoutCommand: () => VnQ,
    LogoutRequestFilterSensitiveLog: () => BnQ,
    ResourceNotFoundException: () => aiQ,
    RoleCredentialsFilterSensitiveLog: () => tiQ,
    SSO: () => FnQ,
    SSOClient: () => KpA,
    SSOServiceException: () => w5A,
    TooManyRequestsException: () => siQ,
    UnauthorizedException: () => riQ,
    __Client: () => E2.Client,
    paginateListAccountRoles: () => FS8,
    paginateListAccounts: () => KS8
  });
  KnQ.exports = gj8(iiQ);
  var uiQ = cCA(),
    uj8 = pCA(),
    mj8 = lCA(),
    miQ = F5A(),
    dj8 = f8(),
    Ub = iB(),
    cj8 = LX(),
    WEA = q5(),
    diQ = D6(),
    ciQ = F_1(),
    pj8 = R5((A) => {
      return Object.assign(A, {
        useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
        useFipsEndpoint: A.useFipsEndpoint ?? !1,
        defaultSigningName: "awsssoportal"
      })
    }, "resolveClientEndpointParameters"),
    FpA = {
      UseFIPS: {
        type: "builtInParams",
        name: "useFipsEndpoint"
      },
      Endpoint: {
        type: "builtInParams",
        name: "endpoint"
      },
      Region: {
        type: "builtInParams",
        name: "region"
      },
      UseDualStack: {
        type: "builtInParams",
        name: "useDualstackEndpoint"
      }
    },
    lj8 = TiQ(),
    piQ = YEA(),
    liQ = giQ(),
    E2 = ZEA(),
    ij8 = R5((A) => {
      let {
        httpAuthSchemes: Q,
        httpAuthSchemeProvider: B,
        credentials: G
      } = A;
      return {
        setHttpAuthScheme(Z) {
          let I = Q.findIndex((Y) => Y.schemeId === Z.schemeId);
          if (I === -1) Q.push(Z);
          else Q.splice(I, 1, Z)
        },
        httpAuthSchemes() {
          return Q
        },
        setHttpAuthSchemeProvider(Z) {
          B = Z
        },
        httpAuthSchemeProvider() {
          return B
        },
        setCredentials(Z) {
          G = Z
        },
        credentials() {
          return G
        }
      }
    }, "getHttpAuthExtensionConfiguration"),
    nj8 = R5((A) => {
      return {
        httpAuthSchemes: A.httpAuthSchemes(),
        httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
        credentials: A.credentials()
      }
    }, "resolveHttpAuthRuntimeConfig"),
    aj8 = R5((A, Q) => {
      let B = Object.assign((0, piQ.getAwsRegionExtensionConfiguration)(A), (0, E2.getDefaultExtensionConfiguration)(A), (0, liQ.getHttpHandlerExtensionConfiguration)(A), ij8(A));
      return Q.forEach((G) => G.configure(B)), Object.assign(A, (0, piQ.resolveAwsRegionExtensionConfiguration)(B), (0, E2.resolveDefaultRuntimeConfig)(B), (0, liQ.resolveHttpHandlerRuntimeConfig)(B), nj8(B))
    }, "resolveRuntimeExtensions"),
    KpA = class extends E2.Client {
      static {
        R5(this, "SSOClient")
      }
      config;
      constructor(...[A]) {
        let Q = (0, lj8.getRuntimeConfig)(A || {});
        super(Q);
        this.initConfig = Q;
        let B = pj8(Q),
          G = (0, miQ.resolveUserAgentConfig)(B),
          Z = (0, diQ.resolveRetryConfig)(G),
          I = (0, dj8.resolveRegionConfig)(Z),
          Y = (0, uiQ.resolveHostHeaderConfig)(I),
          J = (0, WEA.resolveEndpointConfig)(Y),
          W = (0, ciQ.resolveHttpAuthSchemeConfig)(J),
          X = aj8(W, A?.extensions || []);
        this.config = X, this.middlewareStack.use((0, miQ.getUserAgentPlugin)(this.config)), this.middlewareStack.use((0, diQ.getRetryPlugin)(this.config)), this.middlewareStack.use((0, cj8.getContentLengthPlugin)(this.config)), this.middlewareStack.use((0, uiQ.getHostHeaderPlugin)(this.config)), this.middlewareStack.use((0, uj8.getLoggerPlugin)(this.config)), this.middlewareStack.use((0, mj8.getRecursionDetectionPlugin)(this.config)), this.middlewareStack.use((0, Ub.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
          httpAuthSchemeParametersProvider: ciQ.defaultSSOHttpAuthSchemeParametersProvider,
          identityProviderConfigProvider: R5(async (V) => new Ub.DefaultIdentityProviderConfig({
            "aws.auth#sigv4": V.credentials
          }), "identityProviderConfigProvider")
        })), this.middlewareStack.use((0, Ub.getHttpSigningPlugin)(this.config))
      }
      destroy() {
        super.destroy()
      }
    },
    DpA = GZ(),
    w5A = class A extends E2.ServiceException {
      static {
        R5(this, "SSOServiceException")
      }
      constructor(Q) {
        super(Q);
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    niQ = class A extends w5A {
      static {
        R5(this, "InvalidRequestException")
      }
      name = "InvalidRequestException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "InvalidRequestException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    aiQ = class A extends w5A {
      static {
        R5(this, "ResourceNotFoundException")
      }
      name = "ResourceNotFoundException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "ResourceNotFoundException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    siQ = class A extends w5A {
      static {
        R5(this, "TooManyRequestsException")
      }
      name = "TooManyRequestsException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "TooManyRequestsException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    riQ = class A extends w5A {
      static {
        R5(this, "UnauthorizedException")
      }
      name = "UnauthorizedException";
      $fault = "client";
      constructor(Q) {
        super({
          name: "UnauthorizedException",
          $fault: "client",
          ...Q
        });
        Object.setPrototypeOf(this, A.prototype)
      }
    },
    oiQ = R5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: E2.SENSITIVE_STRING
      }
    }), "GetRoleCredentialsRequestFilterSensitiveLog"),
    tiQ = R5((A) => ({
      ...A,
      ...A.secretAccessKey && {
        secretAccessKey: E2.SENSITIVE_STRING
      },
      ...A.sessionToken && {
        sessionToken: E2.SENSITIVE_STRING
      }
    }), "RoleCredentialsFilterSensitiveLog"),
    eiQ = R5((A) => ({
      ...A,
      ...A.roleCredentials && {
        roleCredentials: tiQ(A.roleCredentials)
      }
    }), "GetRoleCredentialsResponseFilterSensitiveLog"),
    AnQ = R5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: E2.SENSITIVE_STRING
      }
    }), "ListAccountRolesRequestFilterSensitiveLog"),
    QnQ = R5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: E2.SENSITIVE_STRING
      }
    }), "ListAccountsRequestFilterSensitiveLog"),
    BnQ = R5((A) => ({
      ...A,
      ...A.accessToken && {
        accessToken: E2.SENSITIVE_STRING
      }
    }), "LogoutRequestFilterSensitiveLog"),
    JEA = jF(),
    sj8 = R5(async (A, Q) => {
      let B = (0, Ub.requestBuilder)(A, Q),
        G = (0, E2.map)({}, E2.isSerializableHeaderValue, {
          [EpA]: A[CpA]
        });
      B.bp("/federation/credentials");
      let Z = (0, E2.map)({
          [XS8]: [, (0, E2.expectNonNull)(A[WS8], "roleName")],
          [ZnQ]: [, (0, E2.expectNonNull)(A[GnQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_GetRoleCredentialsCommand"),
    rj8 = R5(async (A, Q) => {
      let B = (0, Ub.requestBuilder)(A, Q),
        G = (0, E2.map)({}, E2.isSerializableHeaderValue, {
          [EpA]: A[CpA]
        });
      B.bp("/assignment/roles");
      let Z = (0, E2.map)({
          [WnQ]: [, A[JnQ]],
          [YnQ]: [() => A.maxResults !== void 0, () => A[InQ].toString()],
          [ZnQ]: [, (0, E2.expectNonNull)(A[GnQ], "accountId")]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountRolesCommand"),
    oj8 = R5(async (A, Q) => {
      let B = (0, Ub.requestBuilder)(A, Q),
        G = (0, E2.map)({}, E2.isSerializableHeaderValue, {
          [EpA]: A[CpA]
        });
      B.bp("/assignment/accounts");
      let Z = (0, E2.map)({
          [WnQ]: [, A[JnQ]],
          [YnQ]: [() => A.maxResults !== void 0, () => A[InQ].toString()]
        }),
        I;
      return B.m("GET").h(G).q(Z).b(I), B.build()
    }, "se_ListAccountsCommand"),
    tj8 = R5(async (A, Q) => {
      let B = (0, Ub.requestBuilder)(A, Q),
        G = (0, E2.map)({}, E2.isSerializableHeaderValue, {
          [EpA]: A[CpA]
        });
      B.bp("/logout");
      let Z;
      return B.m("POST").h(G).b(Z), B.build()
    }, "se_LogoutCommand"),
    ej8 = R5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return HpA(A, Q);
      let B = (0, E2.map)({
          $metadata: Ic(A)
        }),
        G = (0, E2.expectNonNull)((0, E2.expectObject)(await (0, JEA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, E2.take)(G, {
          roleCredentials: E2._json
        });
      return Object.assign(B, Z), B
    }, "de_GetRoleCredentialsCommand"),
    AS8 = R5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return HpA(A, Q);
      let B = (0, E2.map)({
          $metadata: Ic(A)
        }),
        G = (0, E2.expectNonNull)((0, E2.expectObject)(await (0, JEA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, E2.take)(G, {
          nextToken: E2.expectString,
          roleList: E2._json
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountRolesCommand"),
    QS8 = R5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return HpA(A, Q);
      let B = (0, E2.map)({
          $metadata: Ic(A)
        }),
        G = (0, E2.expectNonNull)((0, E2.expectObject)(await (0, JEA.parseJsonBody)(A.body, Q)), "body"),
        Z = (0, E2.take)(G, {
          accountList: E2._json,
          nextToken: E2.expectString
        });
      return Object.assign(B, Z), B
    }, "de_ListAccountsCommand"),
    BS8 = R5(async (A, Q) => {
      if (A.statusCode !== 200 && A.statusCode >= 300) return HpA(A, Q);
      let B = (0, E2.map)({
        $metadata: Ic(A)
      });
      return await (0, E2.collectBody)(A.body, Q), B
    }, "de_LogoutCommand"),
    HpA = R5(async (A, Q) => {
      let B = {
          ...A,
          body: await (0, JEA.parseJsonErrorBody)(A.body, Q)
        },
        G = (0, JEA.loadRestJsonErrorCode)(A, B.body);
      switch (G) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
          throw await ZS8(B, Q);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
          throw await IS8(B, Q);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
          throw await YS8(B, Q);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
          throw await JS8(B, Q);
        default:
          let Z = B.body;
          return GS8({
            output: A,
            parsedBody: Z,
            errorCode: G
          })
      }
    }, "de_CommandError"),
    GS8 = (0, E2.withBaseException)(w5A),
    ZS8 = R5(async (A, Q) => {
      let B = (0, E2.map)({}),
        G = A.body,
        Z = (0, E2.take)(G, {
          message: E2.expectString
        });
      Object.assign(B, Z);
      let I = new niQ({
        $metadata: Ic(A),
        ...B
      });
      return (0, E2.decorateServiceException)(I, A.body)
    }, "de_InvalidRequestExceptionRes"),
    IS8 = R5(async (A, Q) => {
      let B = (0, E2.map)({}),
        G = A.body,
        Z = (0, E2.take)(G, {
          message: E2.expectString
        });
      Object.assign(B, Z);
      let I = new aiQ({
        $metadata: Ic(A),
        ...B
      });
      return (0, E2.decorateServiceException)(I, A.body)
    }, "de_ResourceNotFoundExceptionRes"),
    YS8 = R5(async (A, Q) => {
      let B = (0, E2.map)({}),
        G = A.body,
        Z = (0, E2.take)(G, {
          message: E2.expectString
        });
      Object.assign(B, Z);
      let I = new siQ({
        $metadata: Ic(A),
        ...B
      });
      return (0, E2.decorateServiceException)(I, A.body)
    }, "de_TooManyRequestsExceptionRes"),
    JS8 = R5(async (A, Q) => {
      let B = (0, E2.map)({}),
        G = A.body,
        Z = (0, E2.take)(G, {
          message: E2.expectString
        });
      Object.assign(B, Z);
      let I = new riQ({
        $metadata: Ic(A),
        ...B
      });
      return (0, E2.decorateServiceException)(I, A.body)
    }, "de_UnauthorizedExceptionRes"),
    Ic = R5((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    GnQ = "accountId",
    CpA = "accessToken",
    ZnQ = "account_id",
    InQ = "maxResults",
    YnQ = "max_result",
    JnQ = "nextToken",
    WnQ = "next_token",
    WS8 = "roleName",
    XS8 = "role_name",
    EpA = "x-amz-sso_bearer_token",
    XnQ = class extends E2.Command.classBuilder().ep(FpA).m(function(A, Q, B, G) {
      return [(0, DpA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, WEA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").f(oiQ, eiQ).ser(sj8).de(ej8).build() {
      static {
        R5(this, "GetRoleCredentialsCommand")
      }
    },
    k_1 = class extends E2.Command.classBuilder().ep(FpA).m(function(A, Q, B, G) {
      return [(0, DpA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, WEA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").f(AnQ, void 0).ser(rj8).de(AS8).build() {
      static {
        R5(this, "ListAccountRolesCommand")
      }
    },
    y_1 = class extends E2.Command.classBuilder().ep(FpA).m(function(A, Q, B, G) {
      return [(0, DpA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, WEA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").f(QnQ, void 0).ser(oj8).de(QS8).build() {
      static {
        R5(this, "ListAccountsCommand")
      }
    },
    VnQ = class extends E2.Command.classBuilder().ep(FpA).m(function(A, Q, B, G) {
      return [(0, DpA.getSerdePlugin)(B, this.serialize, this.deserialize), (0, WEA.getEndpointPlugin)(B, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").f(BnQ, void 0).ser(tj8).de(BS8).build() {
      static {
        R5(this, "LogoutCommand")
      }
    },
    VS8 = {
      GetRoleCredentialsCommand: XnQ,
      ListAccountRolesCommand: k_1,
      ListAccountsCommand: y_1,
      LogoutCommand: VnQ
    },
    FnQ = class extends KpA {
      static {
        R5(this, "SSO")
      }
    };
  (0, E2.createAggregatedClient)(VS8, FnQ);
  var FS8 = (0, Ub.createPaginator)(KpA, k_1, "nextToken", "nextToken", "maxResults"),
    KS8 = (0, Ub.createPaginator)(KpA, y_1, "nextToken", "nextToken", "maxResults")
})
// @from(Start 4396848, End 4399631)
x_1 = z((aP7, NnQ) => {
  var {
    defineProperty: zpA,
    getOwnPropertyDescriptor: DS8,
    getOwnPropertyNames: HS8
  } = Object, CS8 = Object.prototype.hasOwnProperty, UpA = (A, Q) => zpA(A, "name", {
    value: Q,
    configurable: !0
  }), ES8 = (A, Q) => {
    for (var B in Q) zpA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zS8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HS8(Q))
        if (!CS8.call(A, Z) && Z !== B) zpA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DS8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, US8 = (A) => zS8(zpA({}, "__esModule", {
    value: !0
  }), A), HnQ = {};
  ES8(HnQ, {
    AlgorithmId: () => UnQ,
    EndpointURLScheme: () => znQ,
    FieldPosition: () => $nQ,
    HttpApiKeyAuthLocation: () => EnQ,
    HttpAuthLocation: () => CnQ,
    IniSectionType: () => wnQ,
    RequestHandlerProtocol: () => qnQ,
    SMITHY_CONTEXT_KEY: () => LS8,
    getDefaultClientConfiguration: () => qS8,
    resolveDefaultRuntimeConfig: () => NS8
  });
  NnQ.exports = US8(HnQ);
  var CnQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(CnQ || {}),
    EnQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(EnQ || {}),
    znQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(znQ || {}),
    UnQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(UnQ || {}),
    $S8 = UpA((A) => {
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
    wS8 = UpA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    qS8 = UpA((A) => {
      return $S8(A)
    }, "getDefaultClientConfiguration"),
    NS8 = UpA((A) => {
      return wS8(A)
    }, "resolveDefaultRuntimeConfig"),
    $nQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })($nQ || {}),
    LS8 = "__smithy_context",
    wnQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(wnQ || {}),
    qnQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(qnQ || {})
})