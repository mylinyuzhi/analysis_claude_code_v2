
// @from(Start 4210543, End 4215050)
DdQ = z((pT7, KdQ) => {
  var {
    defineProperty: OcA,
    getOwnPropertyDescriptor: wL8,
    getOwnPropertyNames: qL8
  } = Object, NL8 = Object.prototype.hasOwnProperty, Qc = (A, Q) => OcA(A, "name", {
    value: Q,
    configurable: !0
  }), LL8 = (A, Q) => {
    for (var B in Q) OcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ML8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qL8(Q))
        if (!NL8.call(A, Z) && Z !== B) OcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, OL8 = (A) => ML8(OcA({}, "__esModule", {
    value: !0
  }), A), WdQ = {};
  LL8(WdQ, {
    Field: () => PL8,
    Fields: () => jL8,
    HttpRequest: () => SL8,
    HttpResponse: () => _L8,
    IHttpRequest: () => XdQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => RL8,
    isValidHostname: () => FdQ,
    resolveHttpHandlerRuntimeConfig: () => TL8
  });
  KdQ.exports = OL8(WdQ);
  var RL8 = Qc((A) => {
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
    TL8 = Qc((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    XdQ = JdQ(),
    PL8 = class {
      static {
        Qc(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = XdQ.FieldPosition.HEADER,
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
    jL8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Qc(this, "Fields")
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
    SL8 = class A {
      static {
        Qc(this, "HttpRequest")
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
        if (B.query) B.query = VdQ(B.query);
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

  function VdQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Qc(VdQ, "cloneQuery");
  var _L8 = class {
    static {
      Qc(this, "HttpResponse")
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

  function FdQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Qc(FdQ, "isValidHostname")
})
// @from(Start 4215056, End 4232312)
ddQ = z((aT7, PcA) => {
  var HdQ, CdQ, EdQ, zdQ, UdQ, $dQ, wdQ, qdQ, NdQ, LdQ, MdQ, OdQ, RdQ, RcA, xS1, TdQ, PdQ, jdQ, Y5A, SdQ, _dQ, kdQ, ydQ, xdQ, vdQ, bdQ, fdQ, hdQ, TcA, gdQ, udQ, mdQ;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof PcA === "object" && typeof aT7 === "object") A(B(Q, B(aT7)));
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
    HdQ = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, CdQ = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, EdQ = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, zdQ = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, UdQ = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, $dQ = function(I, Y, J, W, X, V) {
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
    }, wdQ = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, qdQ = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, NdQ = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, LdQ = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, MdQ = function(I, Y, J, W) {
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
    }, OdQ = function(I, Y) {
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
    }, RdQ = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) TcA(Y, I, J)
    }, TcA = Object.create ? function(I, Y, J, W) {
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
    }, RcA = function(I) {
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
    }, xS1 = function(I, Y) {
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
    }, TdQ = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(xS1(arguments[Y]));
      return I
    }, PdQ = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, jdQ = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, Y5A = function(I) {
      return this instanceof Y5A ? (this.v = I, this) : new Y5A(I)
    }, SdQ = function(I, Y, J) {
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
        q.value instanceof Y5A ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, _dQ = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: Y5A(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, kdQ = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof RcA === "function" ? RcA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, ydQ = function(I, Y) {
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
    xdQ = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") TcA(Y, I, J[W])
      }
      return B(Y, I), Y
    }, vdQ = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, bdQ = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, fdQ = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, hdQ = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, gdQ = function(I, Y, J) {
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
    udQ = function(I) {
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
    }, mdQ = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", HdQ), A("__assign", CdQ), A("__rest", EdQ), A("__decorate", zdQ), A("__param", UdQ), A("__esDecorate", $dQ), A("__runInitializers", wdQ), A("__propKey", qdQ), A("__setFunctionName", NdQ), A("__metadata", LdQ), A("__awaiter", MdQ), A("__generator", OdQ), A("__exportStar", RdQ), A("__createBinding", TcA), A("__values", RcA), A("__read", xS1), A("__spread", TdQ), A("__spreadArrays", PdQ), A("__spreadArray", jdQ), A("__await", Y5A), A("__asyncGenerator", SdQ), A("__asyncDelegator", _dQ), A("__asyncValues", kdQ), A("__makeTemplateObject", ydQ), A("__importStar", xdQ), A("__importDefault", vdQ), A("__classPrivateFieldGet", bdQ), A("__classPrivateFieldSet", fdQ), A("__classPrivateFieldIn", hdQ), A("__addDisposableResource", gdQ), A("__disposeResources", udQ), A("__rewriteRelativeImportExtension", mdQ)
  })
})
// @from(Start 4232318, End 4235101)
vS1 = z((sT7, odQ) => {
  var {
    defineProperty: jcA,
    getOwnPropertyDescriptor: kL8,
    getOwnPropertyNames: yL8
  } = Object, xL8 = Object.prototype.hasOwnProperty, ScA = (A, Q) => jcA(A, "name", {
    value: Q,
    configurable: !0
  }), vL8 = (A, Q) => {
    for (var B in Q) jcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bL8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of yL8(Q))
        if (!xL8.call(A, Z) && Z !== B) jcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = kL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, fL8 = (A) => bL8(jcA({}, "__esModule", {
    value: !0
  }), A), cdQ = {};
  vL8(cdQ, {
    AlgorithmId: () => ndQ,
    EndpointURLScheme: () => idQ,
    FieldPosition: () => adQ,
    HttpApiKeyAuthLocation: () => ldQ,
    HttpAuthLocation: () => pdQ,
    IniSectionType: () => sdQ,
    RequestHandlerProtocol: () => rdQ,
    SMITHY_CONTEXT_KEY: () => dL8,
    getDefaultClientConfiguration: () => uL8,
    resolveDefaultRuntimeConfig: () => mL8
  });
  odQ.exports = fL8(cdQ);
  var pdQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(pdQ || {}),
    ldQ = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(ldQ || {}),
    idQ = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(idQ || {}),
    ndQ = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(ndQ || {}),
    hL8 = ScA((A) => {
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
    gL8 = ScA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    uL8 = ScA((A) => {
      return hL8(A)
    }, "getDefaultClientConfiguration"),
    mL8 = ScA((A) => {
      return gL8(A)
    }, "resolveDefaultRuntimeConfig"),
    adQ = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(adQ || {}),
    dL8 = "__smithy_context",
    sdQ = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(sdQ || {}),
    rdQ = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(rdQ || {})
})
// @from(Start 4235107, End 4239614)
iCA = z((rT7, BcQ) => {
  var {
    defineProperty: _cA,
    getOwnPropertyDescriptor: cL8,
    getOwnPropertyNames: pL8
  } = Object, lL8 = Object.prototype.hasOwnProperty, Bc = (A, Q) => _cA(A, "name", {
    value: Q,
    configurable: !0
  }), iL8 = (A, Q) => {
    for (var B in Q) _cA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, nL8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of pL8(Q))
        if (!lL8.call(A, Z) && Z !== B) _cA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = cL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, aL8 = (A) => nL8(_cA({}, "__esModule", {
    value: !0
  }), A), tdQ = {};
  iL8(tdQ, {
    Field: () => oL8,
    Fields: () => tL8,
    HttpRequest: () => eL8,
    HttpResponse: () => AM8,
    IHttpRequest: () => edQ.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => sL8,
    isValidHostname: () => QcQ,
    resolveHttpHandlerRuntimeConfig: () => rL8
  });
  BcQ.exports = aL8(tdQ);
  var sL8 = Bc((A) => {
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
    rL8 = Bc((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    edQ = vS1(),
    oL8 = class {
      static {
        Bc(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = edQ.FieldPosition.HEADER,
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
    tL8 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Bc(this, "Fields")
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
    eL8 = class A {
      static {
        Bc(this, "HttpRequest")
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
        if (B.query) B.query = AcQ(B.query);
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

  function AcQ(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Bc(AcQ, "cloneQuery");
  var AM8 = class {
    static {
      Bc(this, "HttpResponse")
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

  function QcQ(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Bc(QcQ, "isValidHostname")
})
// @from(Start 4239620, End 4240573)
IcQ = z((AP7, ZcQ) => {
  var {
    defineProperty: kcA,
    getOwnPropertyDescriptor: QM8,
    getOwnPropertyNames: BM8
  } = Object, GM8 = Object.prototype.hasOwnProperty, ZM8 = (A, Q) => kcA(A, "name", {
    value: Q,
    configurable: !0
  }), IM8 = (A, Q) => {
    for (var B in Q) kcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, YM8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of BM8(Q))
        if (!GM8.call(A, Z) && Z !== B) kcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = QM8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, JM8 = (A) => YM8(kcA({}, "__esModule", {
    value: !0
  }), A), GcQ = {};
  IM8(GcQ, {
    isArrayBuffer: () => WM8
  });
  ZcQ.exports = JM8(GcQ);
  var WM8 = ZM8((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 4240579, End 4241632)
XcQ = z((QP7, WcQ) => {
  var {
    defineProperty: ycA,
    getOwnPropertyDescriptor: XM8,
    getOwnPropertyNames: VM8
  } = Object, FM8 = Object.prototype.hasOwnProperty, bS1 = (A, Q) => ycA(A, "name", {
    value: Q,
    configurable: !0
  }), KM8 = (A, Q) => {
    for (var B in Q) ycA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, DM8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of VM8(Q))
        if (!FM8.call(A, Z) && Z !== B) ycA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = XM8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, HM8 = (A) => DM8(ycA({}, "__esModule", {
    value: !0
  }), A), YcQ = {};
  KM8(YcQ, {
    escapeUri: () => JcQ,
    escapeUriPath: () => EM8
  });
  WcQ.exports = HM8(YcQ);
  var JcQ = bS1((A) => encodeURIComponent(A).replace(/[!'()*]/g, CM8), "escapeUri"),
    CM8 = bS1((A) => `%${A.charCodeAt(0).toString(16).toUpperCase()}`, "hexEncode"),
    EM8 = bS1((A) => A.split("/").map(JcQ).join("/"), "escapeUriPath")
})
// @from(Start 4241638, End 4258552)
fcQ = z((BP7, bcQ) => {
  var {
    defineProperty: ucA,
    getOwnPropertyDescriptor: zM8,
    getOwnPropertyNames: UM8
  } = Object, $M8 = Object.prototype.hasOwnProperty, DD = (A, Q) => ucA(A, "name", {
    value: Q,
    configurable: !0
  }), wM8 = (A, Q) => {
    for (var B in Q) ucA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, qM8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of UM8(Q))
        if (!$M8.call(A, Z) && Z !== B) ucA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = zM8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, NM8 = (A) => qM8(ucA({}, "__esModule", {
    value: !0
  }), A), HcQ = {};
  wM8(HcQ, {
    ALGORITHM_IDENTIFIER: () => xcA,
    ALGORITHM_IDENTIFIER_V4A: () => RM8,
    ALGORITHM_QUERY_PARAM: () => CcQ,
    ALWAYS_UNSIGNABLE_HEADERS: () => LcQ,
    AMZ_DATE_HEADER: () => pS1,
    AMZ_DATE_QUERY_PARAM: () => uS1,
    AUTH_HEADER: () => cS1,
    CREDENTIAL_QUERY_PARAM: () => EcQ,
    DATE_HEADER: () => $cQ,
    EVENT_ALGORITHM_IDENTIFIER: () => RcQ,
    EXPIRES_QUERY_PARAM: () => UcQ,
    GENERATED_HEADERS: () => wcQ,
    HOST_HEADER: () => MM8,
    KEY_TYPE_IDENTIFIER: () => lS1,
    MAX_CACHE_SIZE: () => PcQ,
    MAX_PRESIGNED_TTL: () => jcQ,
    PROXY_HEADER_PATTERN: () => McQ,
    REGION_SET_PARAM: () => LM8,
    SEC_HEADER_PATTERN: () => OcQ,
    SHA256_HEADER: () => gcA,
    SIGNATURE_HEADER: () => qcQ,
    SIGNATURE_QUERY_PARAM: () => mS1,
    SIGNED_HEADERS_QUERY_PARAM: () => zcQ,
    SignatureV4: () => fM8,
    SignatureV4Base: () => vcQ,
    TOKEN_HEADER: () => NcQ,
    TOKEN_QUERY_PARAM: () => dS1,
    UNSIGNABLE_PATTERNS: () => OM8,
    UNSIGNED_PAYLOAD: () => TcQ,
    clearCredentialCache: () => PM8,
    createScope: () => bcA,
    getCanonicalHeaders: () => fS1,
    getCanonicalQuery: () => xcQ,
    getPayloadHash: () => fcA,
    getSigningKey: () => ScQ,
    hasHeader: () => _cQ,
    moveHeadersToQuery: () => ycQ,
    prepareRequest: () => gS1,
    signatureV4aContainer: () => hM8
  });
  bcQ.exports = NM8(HcQ);
  var VcQ = O2(),
    CcQ = "X-Amz-Algorithm",
    EcQ = "X-Amz-Credential",
    uS1 = "X-Amz-Date",
    zcQ = "X-Amz-SignedHeaders",
    UcQ = "X-Amz-Expires",
    mS1 = "X-Amz-Signature",
    dS1 = "X-Amz-Security-Token",
    LM8 = "X-Amz-Region-Set",
    cS1 = "authorization",
    pS1 = uS1.toLowerCase(),
    $cQ = "date",
    wcQ = [cS1, pS1, $cQ],
    qcQ = mS1.toLowerCase(),
    gcA = "x-amz-content-sha256",
    NcQ = dS1.toLowerCase(),
    MM8 = "host",
    LcQ = {
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
    McQ = /^proxy-/,
    OcQ = /^sec-/,
    OM8 = [/^proxy-/i, /^sec-/i],
    xcA = "AWS4-HMAC-SHA256",
    RM8 = "AWS4-ECDSA-P256-SHA256",
    RcQ = "AWS4-HMAC-SHA256-PAYLOAD",
    TcQ = "UNSIGNED-PAYLOAD",
    PcQ = 50,
    lS1 = "aws4_request",
    jcQ = 604800,
    Gc = Jd(),
    TM8 = O2(),
    J5A = {},
    vcA = [],
    bcA = DD((A, Q, B) => `${A}/${Q}/${B}/${lS1}`, "createScope"),
    ScQ = DD(async (A, Q, B, G, Z) => {
      let I = await FcQ(A, Q.secretAccessKey, Q.accessKeyId),
        Y = `${B}:${G}:${Z}:${(0,Gc.toHex)(I)}:${Q.sessionToken}`;
      if (Y in J5A) return J5A[Y];
      vcA.push(Y);
      while (vcA.length > PcQ) delete J5A[vcA.shift()];
      let J = `AWS4${Q.secretAccessKey}`;
      for (let W of [B, G, Z, lS1]) J = await FcQ(A, J, W);
      return J5A[Y] = J
    }, "getSigningKey"),
    PM8 = DD(() => {
      vcA.length = 0, Object.keys(J5A).forEach((A) => {
        delete J5A[A]
      })
    }, "clearCredentialCache"),
    FcQ = DD((A, Q, B) => {
      let G = new A(Q);
      return G.update((0, TM8.toUint8Array)(B)), G.digest()
    }, "hmac"),
    fS1 = DD(({
      headers: A
    }, Q, B) => {
      let G = {};
      for (let Z of Object.keys(A).sort()) {
        if (A[Z] == null) continue;
        let I = Z.toLowerCase();
        if (I in LcQ || Q?.has(I) || McQ.test(I) || OcQ.test(I)) {
          if (!B || B && !B.has(I)) continue
        }
        G[I] = A[Z].trim().replace(/\s+/g, " ")
      }
      return G
    }, "getCanonicalHeaders"),
    jM8 = IcQ(),
    SM8 = O2(),
    fcA = DD(async ({
      headers: A,
      body: Q
    }, B) => {
      for (let G of Object.keys(A))
        if (G.toLowerCase() === gcA) return A[G];
      if (Q == null) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      else if (typeof Q === "string" || ArrayBuffer.isView(Q) || (0, jM8.isArrayBuffer)(Q)) {
        let G = new B;
        return G.update((0, SM8.toUint8Array)(Q)), (0, Gc.toHex)(await G.digest())
      }
      return TcQ
    }, "getPayloadHash"),
    KcQ = O2(),
    _M8 = class {
      static {
        DD(this, "HeaderFormatter")
      }
      format(A) {
        let Q = [];
        for (let Z of Object.keys(A)) {
          let I = (0, KcQ.fromUtf8)(Z);
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
            let Y = (0, KcQ.fromUtf8)(A.value),
              J = new DataView(new ArrayBuffer(3 + Y.byteLength));
            J.setUint8(0, 7), J.setUint16(1, Y.byteLength, !1);
            let W = new Uint8Array(J.buffer);
            return W.set(Y, 3), W;
          case "timestamp":
            let X = new Uint8Array(9);
            return X[0] = 8, X.set(yM8.fromNumber(A.value.valueOf()).bytes, 1), X;
          case "uuid":
            if (!kM8.test(A.value)) throw Error(`Invalid UUID received: ${A.value}`);
            let V = new Uint8Array(17);
            return V[0] = 9, V.set((0, Gc.fromHex)(A.value.replace(/\-/g, "")), 1), V
        }
      }
    },
    kM8 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
    yM8 = class A {
      constructor(Q) {
        if (this.bytes = Q, Q.byteLength !== 8) throw Error("Int64 buffers must be exactly 8 bytes")
      }
      static {
        DD(this, "Int64")
      }
      static fromNumber(Q) {
        if (Q > 9223372036854776000 || Q < -9223372036854776000) throw Error(`${Q} is too large (or, if negative, too small) to represent as an Int64`);
        let B = new Uint8Array(8);
        for (let G = 7, Z = Math.abs(Math.round(Q)); G > -1 && Z > 0; G--, Z /= 256) B[G] = Z;
        if (Q < 0) hS1(B);
        return new A(B)
      }
      valueOf() {
        let Q = this.bytes.slice(0),
          B = Q[0] & 128;
        if (B) hS1(Q);
        return parseInt((0, Gc.toHex)(Q), 16) * (B ? -1 : 1)
      }
      toString() {
        return String(this.valueOf())
      }
    };

  function hS1(A) {
    for (let Q = 0; Q < 8; Q++) A[Q] ^= 255;
    for (let Q = 7; Q > -1; Q--)
      if (A[Q]++, A[Q] !== 0) break
  }
  DD(hS1, "negate");
  var _cQ = DD((A, Q) => {
      A = A.toLowerCase();
      for (let B of Object.keys(Q))
        if (A === B.toLowerCase()) return !0;
      return !1
    }, "hasHeader"),
    kcQ = iCA(),
    ycQ = DD((A, Q = {}) => {
      let {
        headers: B,
        query: G = {}
      } = kcQ.HttpRequest.clone(A);
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
    gS1 = DD((A) => {
      A = kcQ.HttpRequest.clone(A);
      for (let Q of Object.keys(A.headers))
        if (wcQ.indexOf(Q.toLowerCase()) > -1) delete A.headers[Q];
      return A
    }, "prepareRequest"),
    DcQ = w7(),
    xM8 = O2(),
    hcA = XcQ(),
    xcQ = DD(({
      query: A = {}
    }) => {
      let Q = [],
        B = {};
      for (let G of Object.keys(A)) {
        if (G.toLowerCase() === qcQ) continue;
        let Z = (0, hcA.escapeUri)(G);
        Q.push(Z);
        let I = A[G];
        if (typeof I === "string") B[Z] = `${Z}=${(0,hcA.escapeUri)(I)}`;
        else if (Array.isArray(I)) B[Z] = I.slice(0).reduce((Y, J) => Y.concat([`${Z}=${(0,hcA.escapeUri)(J)}`]), []).sort().join("&")
      }
      return Q.sort().map((G) => B[G]).filter((G) => G).join("&")
    }, "getCanonicalQuery"),
    vM8 = DD((A) => bM8(A).toISOString().replace(/\.\d{3}Z$/, "Z"), "iso8601"),
    bM8 = DD((A) => {
      if (typeof A === "number") return new Date(A * 1000);
      if (typeof A === "string") {
        if (Number(A)) return new Date(Number(A) * 1000);
        return new Date(A)
      }
      return A
    }, "toDate"),
    vcQ = class {
      static {
        DD(this, "SignatureV4Base")
      }
      constructor({
        applyChecksum: A,
        credentials: Q,
        region: B,
        service: G,
        sha256: Z,
        uriEscapePath: I = !0
      }) {
        this.service = G, this.sha256 = Z, this.uriEscapePath = I, this.applyChecksum = typeof A === "boolean" ? A : !0, this.regionProvider = (0, DcQ.normalizeProvider)(B), this.credentialProvider = (0, DcQ.normalizeProvider)(Q)
      }
      createCanonicalRequest(A, Q, B) {
        let G = Object.keys(Q).sort();
        return `${A.method}
${this.getCanonicalPath(A)}
${xcQ(A)}
${G.map((Z)=>`${Z}:${Q[Z]}`).join(`
`)}

${G.join(";")}
${B}`
      }
      async createStringToSign(A, Q, B, G) {
        let Z = new this.sha256;
        Z.update((0, xM8.toUint8Array)(B));
        let I = await Z.digest();
        return `${G}
${A}
${Q}
${(0,Gc.toHex)(I)}`
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
          return (0, hcA.escapeUri)(B).replace(/%2F/g, "/")
        }
        return A
      }
      validateResolvedCredentials(A) {
        if (typeof A !== "object" || typeof A.accessKeyId !== "string" || typeof A.secretAccessKey !== "string") throw Error("Resolved credential object is not valid")
      }
      formatDate(A) {
        let Q = vM8(A).replace(/[\-:]/g, "");
        return {
          longDate: Q,
          shortDate: Q.slice(0, 8)
        }
      }
      getCanonicalHeaderList(A) {
        return Object.keys(A).sort().join(";")
      }
    },
    fM8 = class extends vcQ {
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
        this.headerFormatter = new _M8
      }
      static {
        DD(this, "SignatureV4")
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
        if (G > jcQ) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        let H = bcA(D, F, X ?? this.service),
          C = ycQ(gS1(A), {
            unhoistableHeaders: I,
            hoistableHeaders: J
          });
        if (V.sessionToken) C.query[dS1] = V.sessionToken;
        C.query[CcQ] = xcA, C.query[EcQ] = `${V.accessKeyId}/${H}`, C.query[uS1] = K, C.query[UcQ] = G.toString(10);
        let E = fS1(C, Z, Y);
        return C.query[zcQ] = this.getCanonicalHeaderList(E), C.query[mS1] = await this.getSignature(K, H, this.getSigningKey(V, F, D, X), this.createCanonicalRequest(C, E, await fcA(A, this.sha256))), C
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
          X = bcA(J, Y, I ?? this.service),
          V = await fcA({
            headers: {},
            body: Q
          }, this.sha256),
          F = new this.sha256;
        F.update(A);
        let K = (0, Gc.toHex)(await F.digest()),
          D = [RcQ, W, X, G, K, V].join(`
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
        return J.update((0, VcQ.toUint8Array)(A)), (0, Gc.toHex)(await J.digest())
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
          W = gS1(A),
          {
            longDate: X,
            shortDate: V
          } = this.formatDate(Q),
          F = bcA(V, J, I ?? this.service);
        if (W.headers[pS1] = X, Y.sessionToken) W.headers[NcQ] = Y.sessionToken;
        let K = await fcA(W, this.sha256);
        if (!_cQ(gcA, W.headers) && this.applyChecksum) W.headers[gcA] = K;
        let D = fS1(W, G, B),
          H = await this.getSignature(X, F, this.getSigningKey(Y, J, V, I), this.createCanonicalRequest(W, D, K));
        return W.headers[cS1] = `${xcA} Credential=${Y.accessKeyId}/${F}, SignedHeaders=${this.getCanonicalHeaderList(D)}, Signature=${H}`, W
      }
      async getSignature(A, Q, B, G) {
        let Z = await this.createStringToSign(A, Q, G, xcA),
          I = new this.sha256(await B);
        return I.update((0, VcQ.toUint8Array)(Z)), (0, Gc.toHex)(await I.digest())
      }
      getSigningKey(A, Q, B, G) {
        return ScQ(this.sha256, A, B, Q, G || this.service)
      }
    },
    hM8 = {
      SignatureV4a: null
    }
})
// @from(Start 4258558, End 4267145)
ncQ = z((YP7, icQ) => {
  var {
    defineProperty: mcA,
    getOwnPropertyDescriptor: gM8,
    getOwnPropertyNames: uM8
  } = Object, mM8 = Object.prototype.hasOwnProperty, HD = (A, Q) => mcA(A, "name", {
    value: Q,
    configurable: !0
  }), dM8 = (A, Q) => {
    for (var B in Q) mcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, cM8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of uM8(Q))
        if (!mM8.call(A, Z) && Z !== B) mcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = gM8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, pM8 = (A) => cM8(mcA({}, "__esModule", {
    value: !0
  }), A), dcQ = {};
  dM8(dcQ, {
    AWSSDKSigV4Signer: () => aM8,
    AwsSdkSigV4ASigner: () => rM8,
    AwsSdkSigV4Signer: () => aS1,
    NODE_SIGV4A_CONFIG_OPTIONS: () => eM8,
    resolveAWSSDKSigV4Config: () => QO8,
    resolveAwsSdkSigV4AConfig: () => tM8,
    resolveAwsSdkSigV4Config: () => ccQ,
    validateSigningProperties: () => nS1
  });
  icQ.exports = pM8(dcQ);
  var lM8 = iCA(),
    iM8 = iCA(),
    hcQ = HD((A) => iM8.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0, "getDateHeader"),
    iS1 = HD((A) => new Date(Date.now() + A), "getSkewCorrectedDate"),
    nM8 = HD((A, Q) => Math.abs(iS1(Q).getTime() - A) >= 300000, "isClockSkewed"),
    gcQ = HD((A, Q) => {
      let B = Date.parse(A);
      if (nM8(B, Q)) return B - Date.now();
      return Q
    }, "getUpdatedSystemClockOffset"),
    nCA = HD((A, Q) => {
      if (!Q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
      return Q
    }, "throwSigningPropertyError"),
    nS1 = HD(async (A) => {
      let Q = nCA("context", A.context),
        B = nCA("config", A.config),
        G = Q.endpointV2?.properties?.authSchemes?.[0],
        I = await nCA("signer", B.signer)(G),
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
    aS1 = class {
      static {
        HD(this, "AwsSdkSigV4Signer")
      }
      async sign(A, Q, B) {
        if (!lM8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let G = await nS1(B),
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
          signingDate: iS1(Z.systemClockOffset),
          signingRegion: Y,
          signingService: J
        })
      }
      errorHandler(A) {
        return (Q) => {
          let B = Q.ServerTime ?? hcQ(Q.$response);
          if (B) {
            let G = nCA("config", A.config),
              Z = G.systemClockOffset;
            if (G.systemClockOffset = gcQ(B, G.systemClockOffset), G.systemClockOffset !== Z && Q.$metadata) Q.$metadata.clockSkewCorrected = !0
          }
          throw Q
        }
      }
      successHandler(A, Q) {
        let B = hcQ(A);
        if (B) {
          let G = nCA("config", Q.config);
          G.systemClockOffset = gcQ(B, G.systemClockOffset)
        }
      }
    },
    aM8 = aS1,
    sM8 = iCA(),
    rM8 = class extends aS1 {
      static {
        HD(this, "AwsSdkSigV4ASigner")
      }
      async sign(A, Q, B) {
        if (!sM8.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
        let {
          config: G,
          signer: Z,
          signingRegion: I,
          signingRegionSet: Y,
          signingName: J
        } = await nS1(B), X = (await G.sigv4aSigningRegionSet?.() ?? Y ?? [I]).join(",");
        return await Z.sign(A, {
          signingDate: iS1(G.systemClockOffset),
          signingRegion: X,
          signingService: J
        })
      }
    },
    oM8 = iB(),
    ucQ = j2(),
    tM8 = HD((A) => {
      return A.sigv4aSigningRegionSet = (0, oM8.normalizeProvider)(A.sigv4aSigningRegionSet), A
    }, "resolveAwsSdkSigV4AConfig"),
    eM8 = {
      environmentVariableSelector(A) {
        if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((Q) => Q.trim());
        throw new ucQ.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
          tryNextLink: !0
        })
      },
      configFileSelector(A) {
        if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((Q) => Q.trim());
        throw new ucQ.ProviderError("sigv4a_signing_region_set not set in profile.", {
          tryNextLink: !0
        })
      },
      default: void 0
    },
    AO8 = rS(),
    Ro = iB(),
    mcQ = fcQ(),
    ccQ = HD((A) => {
      let Q = A.credentials,
        B = !!A.credentials,
        G = void 0;
      Object.defineProperty(A, "credentials", {
        set(X) {
          if (X && X !== Q && X !== G) B = !0;
          Q = X;
          let V = pcQ(A, {
              credentials: Q,
              credentialDefaultProvider: A.credentialDefaultProvider
            }),
            F = lcQ(A, V);
          if (B && !F.attributed) G = HD(async (K) => F(K).then((D) => (0, AO8.setCredentialFeature)(D, "CREDENTIALS_CODE", "e")), "resolvedCredentials"), G.memoized = F.memoized, G.configBound = F.configBound, G.attributed = !0;
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
      if (A.signer) J = (0, Ro.normalizeProvider)(A.signer);
      else if (A.regionInfoProvider) J = HD(() => (0, Ro.normalizeProvider)(A.region)().then(async (X) => [await A.regionInfoProvider(X, {
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
        return new(A.signerConstructor || mcQ.SignatureV4)(D)
      }), "signer");
      else J = HD(async (X) => {
        X = Object.assign({}, {
          name: "sigv4",
          signingName: A.signingName || A.defaultSigningName,
          signingRegion: await (0, Ro.normalizeProvider)(A.region)(),
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
        return new(A.signerConstructor || mcQ.SignatureV4)(K)
      }, "signer");
      return Object.assign(A, {
        systemClockOffset: I,
        signingEscapePath: Z,
        signer: J
      })
    }, "resolveAwsSdkSigV4Config"),
    QO8 = ccQ;

  function pcQ(A, {
    credentials: Q,
    credentialDefaultProvider: B
  }) {
    let G;
    if (Q)
      if (!Q?.memoized) G = (0, Ro.memoizeIdentityProvider)(Q, Ro.isIdentityExpired, Ro.doesIdentityRequireRefresh);
      else G = Q;
    else if (B) G = (0, Ro.normalizeProvider)(B(Object.assign({}, A, {
      parentClientConfig: A
    })));
    else G = HD(async () => {
      throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
    }, "credentialsProvider");
    return G.memoized = !0, G
  }
  HD(pcQ, "normalizeCredentialProvider");

  function lcQ(A, Q) {
    if (Q.configBound) return Q;
    let B = HD(async (G) => Q({
      ...G,
      callerClientConfig: A
    }), "fn");
    return B.memoized = Q.memoized, B.configBound = !0, B
  }
  HD(lcQ, "bindCallerConfig")
})
// @from(Start 4267151, End 4295606)
lcA = z((XP7, FpQ) => {
  var {
    defineProperty: pcA,
    getOwnPropertyDescriptor: BO8,
    getOwnPropertyNames: GO8
  } = Object, ZO8 = Object.prototype.hasOwnProperty, DB = (A, Q) => pcA(A, "name", {
    value: Q,
    configurable: !0
  }), IO8 = (A, Q) => {
    for (var B in Q) pcA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, YO8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of GO8(Q))
        if (!ZO8.call(A, Z) && Z !== B) pcA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = BO8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, JO8 = (A) => YO8(pcA({}, "__esModule", {
    value: !0
  }), A), scQ = {};
  IO8(scQ, {
    Client: () => WO8,
    Command: () => ocQ,
    LazyJsonString: () => To,
    NoOpLogger: () => ZR8,
    SENSITIVE_STRING: () => VO8,
    ServiceException: () => lO8,
    _json: () => Q_1,
    collectBody: () => sS1.collectBody,
    convertMap: () => IR8,
    createAggregatedClient: () => FO8,
    dateToUtcString: () => GpQ,
    decorateServiceException: () => ZpQ,
    emitWarningIfUnsupportedVersion: () => sO8,
    expectBoolean: () => DO8,
    expectByte: () => A_1,
    expectFloat32: () => dcA,
    expectInt: () => CO8,
    expectInt32: () => tS1,
    expectLong: () => rCA,
    expectNonNull: () => zO8,
    expectNumber: () => sCA,
    expectObject: () => tcQ,
    expectShort: () => eS1,
    expectString: () => UO8,
    expectUnion: () => $O8,
    extendedEncodeURIComponent: () => sS1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => BR8,
    getDefaultClientConfiguration: () => AR8,
    getDefaultExtensionConfiguration: () => YpQ,
    getValueFromTextNode: () => JpQ,
    handleFloat: () => NO8,
    isSerializableHeaderValue: () => GR8,
    limitedParseDouble: () => Z_1,
    limitedParseFloat: () => LO8,
    limitedParseFloat32: () => MO8,
    loadConfigsForDefaultMode: () => aO8,
    logger: () => oCA,
    map: () => Y_1,
    parseBoolean: () => KO8,
    parseEpochTimestamp: () => bO8,
    parseRfc3339DateTime: () => jO8,
    parseRfc3339DateTimeWithOffset: () => _O8,
    parseRfc7231DateTime: () => vO8,
    quoteHeader: () => XpQ,
    resolveDefaultRuntimeConfig: () => QR8,
    resolvedPath: () => sS1.resolvedPath,
    serializeDateTime: () => FR8,
    serializeFloat: () => VR8,
    splitEvery: () => VpQ,
    splitHeader: () => KR8,
    strictParseByte: () => BpQ,
    strictParseDouble: () => G_1,
    strictParseFloat: () => wO8,
    strictParseFloat32: () => ecQ,
    strictParseInt: () => OO8,
    strictParseInt32: () => RO8,
    strictParseLong: () => QpQ,
    strictParseShort: () => W5A,
    take: () => YR8,
    throwDefaultError: () => IpQ,
    withBaseException: () => iO8
  });
  FpQ.exports = JO8(scQ);
  var rcQ = uR(),
    WO8 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, rcQ.constructStack)()
      }
      static {
        DB(this, "Client")
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
    sS1 = w5(),
    oS1 = vS1(),
    ocQ = class {
      constructor() {
        this.middlewareStack = (0, rcQ.constructStack)()
      }
      static {
        DB(this, "Command")
      }
      static classBuilder() {
        return new XO8
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
            [oS1.SMITHY_CONTEXT_KEY]: {
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
    XO8 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        DB(this, "ClassBuilder")
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
        return Q = class extends ocQ {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this)
          }
          static {
            DB(this, "CommandRef")
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
    VO8 = "***SensitiveInformation***",
    FO8 = DB((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = DB(async function(Y, J, W) {
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
    KO8 = DB((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    DO8 = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) oCA.warn(ccA(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") oCA.warn(ccA(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    sCA = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) oCA.warn(ccA(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    HO8 = Math.ceil(340282346638528860000000000000000000000),
    dcA = DB((A) => {
      let Q = sCA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > HO8) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    rCA = DB((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    CO8 = rCA,
    tS1 = DB((A) => B_1(A, 32), "expectInt32"),
    eS1 = DB((A) => B_1(A, 16), "expectShort"),
    A_1 = DB((A) => B_1(A, 8), "expectByte"),
    B_1 = DB((A, Q) => {
      let B = rCA(A);
      if (B !== void 0 && EO8(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    EO8 = DB((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    zO8 = DB((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    tcQ = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    UO8 = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return oCA.warn(ccA(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    $O8 = DB((A) => {
      if (A === null || A === void 0) return;
      let Q = tcQ(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    G_1 = DB((A) => {
      if (typeof A == "string") return sCA(V5A(A));
      return sCA(A)
    }, "strictParseDouble"),
    wO8 = G_1,
    ecQ = DB((A) => {
      if (typeof A == "string") return dcA(V5A(A));
      return dcA(A)
    }, "strictParseFloat32"),
    qO8 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    V5A = DB((A) => {
      let Q = A.match(qO8);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    Z_1 = DB((A) => {
      if (typeof A == "string") return ApQ(A);
      return sCA(A)
    }, "limitedParseDouble"),
    NO8 = Z_1,
    LO8 = Z_1,
    MO8 = DB((A) => {
      if (typeof A == "string") return ApQ(A);
      return dcA(A)
    }, "limitedParseFloat32"),
    ApQ = DB((A) => {
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
    QpQ = DB((A) => {
      if (typeof A === "string") return rCA(V5A(A));
      return rCA(A)
    }, "strictParseLong"),
    OO8 = QpQ,
    RO8 = DB((A) => {
      if (typeof A === "string") return tS1(V5A(A));
      return tS1(A)
    }, "strictParseInt32"),
    W5A = DB((A) => {
      if (typeof A === "string") return eS1(V5A(A));
      return eS1(A)
    }, "strictParseShort"),
    BpQ = DB((A) => {
      if (typeof A === "string") return A_1(V5A(A));
      return A_1(A)
    }, "strictParseByte"),
    ccA = DB((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    oCA = {
      warn: console.warn
    },
    TO8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    I_1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function GpQ(A) {
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
    return `${TO8[G]}, ${W} ${I_1[B]} ${Q} ${X}:${V}:${F} GMT`
  }
  DB(GpQ, "dateToUtcString");
  var PO8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    jO8 = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = PO8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X] = Q, V = W5A(X5A(G)), F = tS(Z, "month", 1, 12), K = tS(I, "day", 1, 31);
      return aCA(V, F, K, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      })
    }, "parseRfc3339DateTime"),
    SO8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    _O8 = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = SO8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, I, Y, J, W, X, V] = Q, F = W5A(X5A(G)), K = tS(Z, "month", 1, 12), D = tS(I, "day", 1, 31), H = aCA(F, K, D, {
        hours: Y,
        minutes: J,
        seconds: W,
        fractionalMilliseconds: X
      });
      if (V.toUpperCase() != "Z") H.setTime(H.getTime() - pO8(V));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    kO8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    yO8 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    xO8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    vO8 = DB((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = kO8.exec(A);
      if (Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return aCA(W5A(X5A(I)), rS1(Z), tS(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        })
      }
      if (Q = yO8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return gO8(aCA(fO8(I), rS1(Z), tS(G, "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: W,
          fractionalMilliseconds: X
        }))
      }
      if (Q = xO8.exec(A), Q) {
        let [B, G, Z, I, Y, J, W, X] = Q;
        return aCA(W5A(X5A(X)), rS1(G), tS(Z.trimLeft(), "day", 1, 31), {
          hours: I,
          minutes: Y,
          seconds: J,
          fractionalMilliseconds: W
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    bO8 = DB((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = G_1(A);
      else if (typeof A === "object" && A.tag === 1) Q = A.value;
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    aCA = DB((A, Q, B, G) => {
      let Z = Q - 1;
      return mO8(A, Z, B), new Date(Date.UTC(A, Z, B, tS(G.hours, "hour", 0, 23), tS(G.minutes, "minute", 0, 59), tS(G.seconds, "seconds", 0, 60), cO8(G.fractionalMilliseconds)))
    }, "buildDate"),
    fO8 = DB((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + W5A(X5A(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    hO8 = 1576800000000,
    gO8 = DB((A) => {
      if (A.getTime() - new Date().getTime() > hO8) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    rS1 = DB((A) => {
      let Q = I_1.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    uO8 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    mO8 = DB((A, Q, B) => {
      let G = uO8[Q];
      if (Q === 1 && dO8(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${I_1[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    dO8 = DB((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    tS = DB((A, Q, B, G) => {
      let Z = BpQ(X5A(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    cO8 = DB((A) => {
      if (A === null || A === void 0) return 0;
      return ecQ("0." + A) * 1000
    }, "parseMilliseconds"),
    pO8 = DB((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    X5A = DB((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    lO8 = class A extends Error {
      static {
        DB(this, "ServiceException")
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
    ZpQ = DB((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    IpQ = DB(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = nO8(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw ZpQ(Y, Q)
    }, "throwDefaultError"),
    iO8 = DB((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        IpQ({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    nO8 = DB((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    aO8 = DB((A) => {
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
    acQ = !1,
    sO8 = DB((A) => {
      if (A && !acQ && parseInt(A.substring(1, A.indexOf("."))) < 16) acQ = !0
    }, "emitWarningIfUnsupportedVersion"),
    rO8 = DB((A) => {
      let Q = [];
      for (let B in oS1.AlgorithmId) {
        let G = oS1.AlgorithmId[B];
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
    oO8 = DB((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    tO8 = DB((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    eO8 = DB((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    YpQ = DB((A) => {
      return Object.assign(rO8(A), tO8(A))
    }, "getDefaultExtensionConfiguration"),
    AR8 = YpQ,
    QR8 = DB((A) => {
      return Object.assign(oO8(A), eO8(A))
    }, "resolveDefaultRuntimeConfig"),
    BR8 = DB((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    JpQ = DB((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = JpQ(A[B]);
      return A
    }, "getValueFromTextNode"),
    GR8 = DB((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    To = DB(function(Q) {
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
  To.from = (A) => {
    if (A && typeof A === "object" && (A instanceof To || ("deserializeJSON" in A))) return A;
    else if (typeof A === "string" || Object.getPrototypeOf(A) === String.prototype) return To(String(A));
    return To(JSON.stringify(A))
  };
  To.fromObject = To.from;
  var ZR8 = class {
    static {
      DB(this, "NoOpLogger")
    }
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };

  function Y_1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, JR8(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      WpQ(G, null, I, Y)
    }
    return G
  }
  DB(Y_1, "map");
  var IR8 = DB((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    YR8 = DB((A, Q) => {
      let B = {};
      for (let G in Q) WpQ(B, A, Q, G);
      return B
    }, "take"),
    JR8 = DB((A, Q, B) => {
      return Y_1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    WpQ = DB((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = WR8, W = XR8, X = G] = Y;
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
    WR8 = DB((A) => A != null, "nonNullish"),
    XR8 = DB((A) => A, "pass");

  function XpQ(A) {
    if (A.includes(",") || A.includes('"')) A = `"${A.replace(/"/g,"\\\"")}"`;
    return A
  }
  DB(XpQ, "quoteHeader");
  var VR8 = DB((A) => {
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
    FR8 = DB((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    Q_1 = DB((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(Q_1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = Q_1(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function VpQ(A, Q, B) {
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
  DB(VpQ, "splitEvery");
  var KR8 = DB((A) => {
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
// @from(Start 4295612, End 4300683)
zpQ = z((CP7, EpQ) => {
  var {
    defineProperty: icA,
    getOwnPropertyDescriptor: DR8,
    getOwnPropertyNames: HR8
  } = Object, CR8 = Object.prototype.hasOwnProperty, ez = (A, Q) => icA(A, "name", {
    value: Q,
    configurable: !0
  }), ER8 = (A, Q) => {
    for (var B in Q) icA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zR8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HR8(Q))
        if (!CR8.call(A, Z) && Z !== B) icA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DR8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, UR8 = (A) => zR8(icA({}, "__esModule", {
    value: !0
  }), A), KpQ = {};
  ER8(KpQ, {
    _toBool: () => wR8,
    _toNum: () => qR8,
    _toStr: () => $R8,
    awsExpectUnion: () => LR8,
    loadRestJsonErrorCode: () => RR8,
    loadRestXmlErrorCode: () => SR8,
    parseJsonBody: () => HpQ,
    parseJsonErrorBody: () => OR8,
    parseXmlBody: () => CpQ,
    parseXmlErrorBody: () => jR8
  });
  EpQ.exports = UR8(KpQ);
  var $R8 = ez((A) => {
      if (A == null) return A;
      if (typeof A === "number" || typeof A === "bigint") {
        let Q = Error(`Received number ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      if (typeof A === "boolean") {
        let Q = Error(`Received boolean ${A} where a string was expected.`);
        return Q.name = "Warning", console.warn(Q), String(A)
      }
      return A
    }, "_toStr"),
    wR8 = ez((A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (A !== "" && Q !== "false" && Q !== "true") {
          let B = Error(`Received string "${A}" where a boolean was expected.`);
          B.name = "Warning", console.warn(B)
        }
        return A !== "" && Q !== "false"
      }
      return A
    }, "_toBool"),
    qR8 = ez((A) => {
      if (A == null) return A;
      if (typeof A === "string") {
        let Q = Number(A);
        if (Q.toString() !== A) {
          let B = Error(`Received string "${A}" where a number was expected.`);
          return B.name = "Warning", console.warn(B), A
        }
        return Q
      }
      return A
    }, "_toNum"),
    NR8 = lcA(),
    LR8 = ez((A) => {
      if (A == null) return;
      if (typeof A === "object" && "__type" in A) delete A.__type;
      return (0, NR8.expectUnion)(A)
    }, "awsExpectUnion"),
    MR8 = lcA(),
    DpQ = ez((A, Q) => (0, MR8.collectBody)(A, Q).then((B) => Q.utf8Encoder(B)), "collectBodyString"),
    HpQ = ez((A, Q) => DpQ(A, Q).then((B) => {
      if (B.length) try {
        return JSON.parse(B)
      } catch (G) {
        if (G?.name === "SyntaxError") Object.defineProperty(G, "$responseBodyText", {
          value: B
        });
        throw G
      }
      return {}
    }), "parseJsonBody"),
    OR8 = ez(async (A, Q) => {
      let B = await HpQ(A, Q);
      return B.message = B.message ?? B.Message, B
    }, "parseJsonErrorBody"),
    RR8 = ez((A, Q) => {
      let B = ez((I, Y) => Object.keys(I).find((J) => J.toLowerCase() === Y.toLowerCase()), "findKey"),
        G = ez((I) => {
          let Y = I;
          if (typeof Y === "number") Y = Y.toString();
          if (Y.indexOf(",") >= 0) Y = Y.split(",")[0];
          if (Y.indexOf(":") >= 0) Y = Y.split(":")[0];
          if (Y.indexOf("#") >= 0) Y = Y.split("#")[1];
          return Y
        }, "sanitizeErrorCode"),
        Z = B(A.headers, "x-amzn-errortype");
      if (Z !== void 0) return G(A.headers[Z]);
      if (Q.code !== void 0) return G(Q.code);
      if (Q.__type !== void 0) return G(Q.__type)
    }, "loadRestJsonErrorCode"),
    TR8 = lcA(),
    PR8 = wS(),
    CpQ = ez((A, Q) => DpQ(A, Q).then((B) => {
      if (B.length) {
        let G = new PR8.XMLParser({
          attributeNamePrefix: "",
          htmlEntities: !0,
          ignoreAttributes: !1,
          ignoreDeclaration: !0,
          parseTagValue: !1,
          trimValues: !1,
          tagValueProcessor: ez((W, X) => X.trim() === "" && X.includes(`
`) ? "" : void 0, "tagValueProcessor")
        });
        G.addEntity("#xD", "\r"), G.addEntity("#10", `
`);
        let Z;
        try {
          Z = G.parse(B, !0)
        } catch (W) {
          if (W && typeof W === "object") Object.defineProperty(W, "$responseBodyText", {
            value: B
          });
          throw W
        }
        let I = "#text",
          Y = Object.keys(Z)[0],
          J = Z[Y];
        if (J[I]) J[Y] = J[I], delete J[I];
        return (0, TR8.getValueFromTextNode)(J)
      }
      return {}
    }), "parseXmlBody"),
    jR8 = ez(async (A, Q) => {
      let B = await CpQ(A, Q);
      if (B.Error) B.Error.message = B.Error.message ?? B.Error.Message;
      return B
    }, "parseXmlErrorBody"),
    SR8 = ez((A, Q) => {
      if (Q?.Error?.Code !== void 0) return Q.Error.Code;
      if (Q?.Code !== void 0) return Q.Code;
      if (A.statusCode == 404) return "NotFound"
    }, "loadRestXmlErrorCode")
})
// @from(Start 4300689, End 4300887)
jF = z((tCA) => {
  Object.defineProperty(tCA, "__esModule", {
    value: !0
  });
  var J_1 = ddQ();
  J_1.__exportStar(rS(), tCA);
  J_1.__exportStar(ncQ(), tCA);
  J_1.__exportStar(zpQ(), tCA)
})
// @from(Start 4300893, End 4306548)
F5A = z((zP7, jpQ) => {
  var {
    defineProperty: acA,
    getOwnPropertyDescriptor: _R8,
    getOwnPropertyNames: kR8
  } = Object, yR8 = Object.prototype.hasOwnProperty, Eb = (A, Q) => acA(A, "name", {
    value: Q,
    configurable: !0
  }), xR8 = (A, Q) => {
    for (var B in Q) acA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, vR8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of kR8(Q))
        if (!yR8.call(A, Z) && Z !== B) acA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = _R8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, bR8 = (A) => vR8(acA({}, "__esModule", {
    value: !0
  }), A), qpQ = {};
  xR8(qpQ, {
    DEFAULT_UA_APP_ID: () => NpQ,
    getUserAgentMiddlewareOptions: () => PpQ,
    getUserAgentPlugin: () => pR8,
    resolveUserAgentConfig: () => MpQ,
    userAgentMiddleware: () => TpQ
  });
  jpQ.exports = bR8(qpQ);
  var fR8 = iB(),
    NpQ = void 0;

  function LpQ(A) {
    if (A === void 0) return !0;
    return typeof A === "string" && A.length <= 50
  }
  Eb(LpQ, "isValidUserAgentAppId");

  function MpQ(A) {
    let Q = (0, fR8.normalizeProvider)(A.userAgentAppId ?? NpQ),
      {
        customUserAgent: B
      } = A;
    return Object.assign(A, {
      customUserAgent: typeof B === "string" ? [
        [B]
      ] : B,
      userAgentAppId: Eb(async () => {
        let G = await Q();
        if (!LpQ(G)) {
          let Z = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console : A.logger;
          if (typeof G !== "string") Z?.warn("userAgentAppId must be a string or undefined.");
          else if (G.length > 50) Z?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.")
        }
        return G
      }, "userAgentAppId")
    })
  }
  Eb(MpQ, "resolveUserAgentConfig");
  var hR8 = I5A(),
    gR8 = DdQ(),
    eS = jF(),
    uR8 = /\d{12}\.ddb/;
  async function OpQ(A, Q, B) {
    if (B.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor")(0, eS.setFeature)(A, "PROTOCOL_RPC_V2_CBOR", "M");
    if (typeof Q.retryStrategy === "function") {
      let I = await Q.retryStrategy();
      if (typeof I.acquireInitialRetryToken === "function")
        if (I.constructor?.name?.includes("Adaptive"))(0, eS.setFeature)(A, "RETRY_MODE_ADAPTIVE", "F");
        else(0, eS.setFeature)(A, "RETRY_MODE_STANDARD", "E");
      else(0, eS.setFeature)(A, "RETRY_MODE_LEGACY", "D")
    }
    if (typeof Q.accountIdEndpointMode === "function") {
      let I = A.endpointV2;
      if (String(I?.url?.hostname).match(uR8))(0, eS.setFeature)(A, "ACCOUNT_ID_ENDPOINT", "O");
      switch (await Q.accountIdEndpointMode?.()) {
        case "disabled":
          (0, eS.setFeature)(A, "ACCOUNT_ID_MODE_DISABLED", "Q");
          break;
        case "preferred":
          (0, eS.setFeature)(A, "ACCOUNT_ID_MODE_PREFERRED", "P");
          break;
        case "required":
          (0, eS.setFeature)(A, "ACCOUNT_ID_MODE_REQUIRED", "R");
          break
      }
    }
    let Z = A.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (Z?.$source) {
      let I = Z;
      if (I.accountId)(0, eS.setFeature)(A, "RESOLVED_ACCOUNT_ID", "T");
      for (let [Y, J] of Object.entries(I.$source ?? {}))(0, eS.setFeature)(A, Y, J)
    }
  }
  Eb(OpQ, "checkFeatures");
  var UpQ = "user-agent",
    W_1 = "x-amz-user-agent",
    $pQ = " ",
    X_1 = "/",
    mR8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g,
    dR8 = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g,
    wpQ = "-",
    cR8 = 1024;

  function RpQ(A) {
    let Q = "";
    for (let B in A) {
      let G = A[B];
      if (Q.length + G.length + 1 <= cR8) {
        if (Q.length) Q += "," + G;
        else Q += G;
        continue
      }
      break
    }
    return Q
  }
  Eb(RpQ, "encodeFeatures");
  var TpQ = Eb((A) => (Q, B) => async (G) => {
      let {
        request: Z
      } = G;
      if (!gR8.HttpRequest.isInstance(Z)) return Q(G);
      let {
        headers: I
      } = Z, Y = B?.userAgent?.map(ncA) || [], J = (await A.defaultUserAgentProvider()).map(ncA);
      await OpQ(B, A, G);
      let W = B;
      J.push(`m/${RpQ(Object.assign({},B.__smithy_context?.features,W.__aws_sdk_context?.features))}`);
      let X = A?.customUserAgent?.map(ncA) || [],
        V = await A.userAgentAppId();
      if (V) J.push(ncA([`app/${V}`]));
      let F = (0, hR8.getUserAgentPrefix)(),
        K = (F ? [F] : []).concat([...J, ...Y, ...X]).join($pQ),
        D = [...J.filter((H) => H.startsWith("aws-sdk-")), ...X].join($pQ);
      if (A.runtime !== "browser") {
        if (D) I[W_1] = I[W_1] ? `${I[UpQ]} ${D}` : D;
        I[UpQ] = K
      } else I[W_1] = K;
      return Q({
        ...G,
        request: Z
      })
    }, "userAgentMiddleware"),
    ncA = Eb((A) => {
      let Q = A[0].split(X_1).map((Y) => Y.replace(mR8, wpQ)).join(X_1),
        B = A[1]?.replace(dR8, wpQ),
        G = Q.indexOf(X_1),
        Z = Q.substring(0, G),
        I = Q.substring(G + 1);
      if (Z === "api") I = I.toLowerCase();
      return [Z, I, B].filter((Y) => Y && Y.length > 0).reduce((Y, J, W) => {
        switch (W) {
          case 0:
            return J;
          case 1:
            return `${Y}/${J}`;
          default:
            return `${Y}#${J}`
        }
      }, "")
    }, "escapeUserAgent"),
    PpQ = {
      name: "getUserAgentMiddleware",
      step: "build",
      priority: "low",
      tags: ["SET_USER_AGENT", "USER_AGENT"],
      override: !0
    },
    pR8 = Eb((A) => ({
      applyToStack: Eb((Q) => {
        Q.add(TpQ(A), PpQ)
      }, "applyToStack")
    }), "getUserAgentPlugin")
})
// @from(Start 4306554, End 4308242)
F_1 = z((SpQ) => {
  Object.defineProperty(SpQ, "__esModule", {
    value: !0
  });
  SpQ.resolveHttpAuthSchemeConfig = SpQ.defaultSSOHttpAuthSchemeProvider = SpQ.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var lR8 = jF(),
    V_1 = w7(),
    iR8 = async (A, Q, B) => {
      return {
        operation: (0, V_1.getSmithyContext)(Q).operation,
        region: await (0, V_1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  SpQ.defaultSSOHttpAuthSchemeParametersProvider = iR8;

  function nR8(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "awsssoportal",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }

  function scA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var aR8 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(scA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(scA(A));
        break
      }
      case "ListAccounts": {
        Q.push(scA(A));
        break
      }
      case "Logout": {
        Q.push(scA(A));
        break
      }
      default:
        Q.push(nR8(A))
    }
    return Q
  };
  SpQ.defaultSSOHttpAuthSchemeProvider = aR8;
  var sR8 = (A) => {
    let Q = (0, lR8.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, V_1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  SpQ.resolveHttpAuthSchemeConfig = sR8
})