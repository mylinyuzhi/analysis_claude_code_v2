
// @from(Start 7873126, End 7890382)
LiB = z((s5G, QA1) => {
  var slB, rlB, olB, tlB, elB, AiB, QiB, BiB, GiB, ZiB, IiB, YiB, JiB, eeA, vn1, WiB, XiB, ViB, FZA, FiB, KiB, DiB, HiB, CiB, EiB, ziB, UiB, $iB, AA1, wiB, qiB, NiB;
  (function(A) {
    var Q = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(G) {
      A(B(Q, B(G)))
    });
    else if (typeof QA1 === "object" && typeof s5G === "object") A(B(Q, B(s5G)));
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
    slB = function(I, Y) {
      if (typeof Y !== "function" && Y !== null) throw TypeError("Class extends value " + String(Y) + " is not a constructor or null");
      Q(I, Y);

      function J() {
        this.constructor = I
      }
      I.prototype = Y === null ? Object.create(Y) : (J.prototype = Y.prototype, new J)
    }, rlB = Object.assign || function(I) {
      for (var Y, J = 1, W = arguments.length; J < W; J++) {
        Y = arguments[J];
        for (var X in Y)
          if (Object.prototype.hasOwnProperty.call(Y, X)) I[X] = Y[X]
      }
      return I
    }, olB = function(I, Y) {
      var J = {};
      for (var W in I)
        if (Object.prototype.hasOwnProperty.call(I, W) && Y.indexOf(W) < 0) J[W] = I[W];
      if (I != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var X = 0, W = Object.getOwnPropertySymbols(I); X < W.length; X++)
          if (Y.indexOf(W[X]) < 0 && Object.prototype.propertyIsEnumerable.call(I, W[X])) J[W[X]] = I[W[X]]
      }
      return J
    }, tlB = function(I, Y, J, W) {
      var X = arguments.length,
        V = X < 3 ? Y : W === null ? W = Object.getOwnPropertyDescriptor(Y, J) : W,
        F;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") V = Reflect.decorate(I, Y, J, W);
      else
        for (var K = I.length - 1; K >= 0; K--)
          if (F = I[K]) V = (X < 3 ? F(V) : X > 3 ? F(Y, J, V) : F(Y, J)) || V;
      return X > 3 && V && Object.defineProperty(Y, J, V), V
    }, elB = function(I, Y) {
      return function(J, W) {
        Y(J, W, I)
      }
    }, AiB = function(I, Y, J, W, X, V) {
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
    }, QiB = function(I, Y, J) {
      var W = arguments.length > 2;
      for (var X = 0; X < Y.length; X++) J = W ? Y[X].call(I, J) : Y[X].call(I);
      return W ? J : void 0
    }, BiB = function(I) {
      return typeof I === "symbol" ? I : "".concat(I)
    }, GiB = function(I, Y, J) {
      if (typeof Y === "symbol") Y = Y.description ? "[".concat(Y.description, "]") : "";
      return Object.defineProperty(I, "name", {
        configurable: !0,
        value: J ? "".concat(J, " ", Y) : Y
      })
    }, ZiB = function(I, Y) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(I, Y)
    }, IiB = function(I, Y, J, W) {
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
    }, YiB = function(I, Y) {
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
    }, JiB = function(I, Y) {
      for (var J in I)
        if (J !== "default" && !Object.prototype.hasOwnProperty.call(Y, J)) AA1(Y, I, J)
    }, AA1 = Object.create ? function(I, Y, J, W) {
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
    }, eeA = function(I) {
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
    }, vn1 = function(I, Y) {
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
    }, WiB = function() {
      for (var I = [], Y = 0; Y < arguments.length; Y++) I = I.concat(vn1(arguments[Y]));
      return I
    }, XiB = function() {
      for (var I = 0, Y = 0, J = arguments.length; Y < J; Y++) I += arguments[Y].length;
      for (var W = Array(I), X = 0, Y = 0; Y < J; Y++)
        for (var V = arguments[Y], F = 0, K = V.length; F < K; F++, X++) W[X] = V[F];
      return W
    }, ViB = function(I, Y, J) {
      if (J || arguments.length === 2) {
        for (var W = 0, X = Y.length, V; W < X; W++)
          if (V || !(W in Y)) {
            if (!V) V = Array.prototype.slice.call(Y, 0, W);
            V[W] = Y[W]
          }
      }
      return I.concat(V || Array.prototype.slice.call(Y))
    }, FZA = function(I) {
      return this instanceof FZA ? (this.v = I, this) : new FZA(I)
    }, FiB = function(I, Y, J) {
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
        q.value instanceof FZA ? Promise.resolve(q.value.v).then(C, E) : U(V[0][2], q)
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
    }, KiB = function(I) {
      var Y, J;
      return Y = {}, W("next"), W("throw", function(X) {
        throw X
      }), W("return"), Y[Symbol.iterator] = function() {
        return this
      }, Y;

      function W(X, V) {
        Y[X] = I[X] ? function(F) {
          return (J = !J) ? {
            value: FZA(I[X](F)),
            done: !1
          } : V ? V(F) : F
        } : V
      }
    }, DiB = function(I) {
      if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
      var Y = I[Symbol.asyncIterator],
        J;
      return Y ? Y.call(I) : (I = typeof eeA === "function" ? eeA(I) : I[Symbol.iterator](), J = {}, W("next"), W("throw"), W("return"), J[Symbol.asyncIterator] = function() {
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
    }, HiB = function(I, Y) {
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
    CiB = function(I) {
      if (I && I.__esModule) return I;
      var Y = {};
      if (I != null) {
        for (var J = G(I), W = 0; W < J.length; W++)
          if (J[W] !== "default") AA1(Y, I, J[W])
      }
      return B(Y, I), Y
    }, EiB = function(I) {
      return I && I.__esModule ? I : {
        default: I
      }
    }, ziB = function(I, Y, J, W) {
      if (J === "a" && !W) throw TypeError("Private accessor was defined without a getter");
      if (typeof Y === "function" ? I !== Y || !W : !Y.has(I)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return J === "m" ? W : J === "a" ? W.call(I) : W ? W.value : Y.get(I)
    }, UiB = function(I, Y, J, W, X) {
      if (W === "m") throw TypeError("Private method is not writable");
      if (W === "a" && !X) throw TypeError("Private accessor was defined without a setter");
      if (typeof Y === "function" ? I !== Y || !X : !Y.has(I)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return W === "a" ? X.call(I, J) : X ? X.value = J : Y.set(I, J), J
    }, $iB = function(I, Y) {
      if (Y === null || typeof Y !== "object" && typeof Y !== "function") throw TypeError("Cannot use 'in' operator on non-object");
      return typeof I === "function" ? Y === I : I.has(Y)
    }, wiB = function(I, Y, J) {
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
    qiB = function(I) {
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
    }, NiB = function(I, Y) {
      if (typeof I === "string" && /^\.\.?\//.test(I)) return I.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(J, W, X, V, F) {
        return W ? Y ? ".jsx" : ".js" : X && (!V || !F) ? J : X + V + "." + F.toLowerCase() + "js"
      });
      return I
    }, A("__extends", slB), A("__assign", rlB), A("__rest", olB), A("__decorate", tlB), A("__param", elB), A("__esDecorate", AiB), A("__runInitializers", QiB), A("__propKey", BiB), A("__setFunctionName", GiB), A("__metadata", ZiB), A("__awaiter", IiB), A("__generator", YiB), A("__exportStar", JiB), A("__createBinding", AA1), A("__values", eeA), A("__read", vn1), A("__spread", WiB), A("__spreadArrays", XiB), A("__spreadArray", ViB), A("__await", FZA), A("__asyncGenerator", FiB), A("__asyncDelegator", KiB), A("__asyncValues", DiB), A("__makeTemplateObject", HiB), A("__importStar", CiB), A("__importDefault", EiB), A("__classPrivateFieldGet", ziB), A("__classPrivateFieldSet", UiB), A("__classPrivateFieldIn", $iB), A("__addDisposableResource", wiB), A("__disposeResources", qiB), A("__rewriteRelativeImportExtension", NiB)
  })
})
// @from(Start 7890388, End 7890391)
MiB
// @from(Start 7890393, End 7890396)
r5G
// @from(Start 7890398, End 7890401)
o5G
// @from(Start 7890403, End 7890406)
t5G
// @from(Start 7890408, End 7890411)
e5G
// @from(Start 7890413, End 7890416)
A3G
// @from(Start 7890418, End 7890421)
Q3G
// @from(Start 7890423, End 7890426)
B3G
// @from(Start 7890428, End 7890431)
G3G
// @from(Start 7890433, End 7890436)
Z3G
// @from(Start 7890438, End 7890441)
I3G
// @from(Start 7890443, End 7890446)
Y3G
// @from(Start 7890448, End 7890451)
J3G
// @from(Start 7890453, End 7890456)
W3G
// @from(Start 7890458, End 7890461)
X3G
// @from(Start 7890463, End 7890466)
V3G
// @from(Start 7890468, End 7890471)
F3G
// @from(Start 7890473, End 7890476)
K3G
// @from(Start 7890478, End 7890481)
D3G
// @from(Start 7890483, End 7890486)
H3G
// @from(Start 7890488, End 7890490)
Le
// @from(Start 7890492, End 7890495)
bn1
// @from(Start 7890497, End 7890500)
C3G
// @from(Start 7890502, End 7890505)
OiB
// @from(Start 7890507, End 7890510)
E3G
// @from(Start 7890512, End 7890515)
z3G
// @from(Start 7890517, End 7890520)
U3G
// @from(Start 7890522, End 7890525)
$3G
// @from(Start 7890527, End 7890530)
w3G
// @from(Start 7890532, End 7890535)
q3G
// @from(Start 7890537, End 7890540)
N3G
// @from(Start 7890542, End 7890545)
L3G
// @from(Start 7890547, End 7890550)
M3G
// @from(Start 7890556, End 7891404)
RiB = L(() => {
  MiB = BA(LiB(), 1), {
    __extends: r5G,
    __assign: o5G,
    __rest: t5G,
    __decorate: e5G,
    __param: A3G,
    __esDecorate: Q3G,
    __runInitializers: B3G,
    __propKey: G3G,
    __setFunctionName: Z3G,
    __metadata: I3G,
    __awaiter: Y3G,
    __generator: J3G,
    __exportStar: W3G,
    __createBinding: X3G,
    __values: V3G,
    __read: F3G,
    __spread: K3G,
    __spreadArrays: D3G,
    __spreadArray: H3G,
    __await: Le,
    __asyncGenerator: bn1,
    __asyncDelegator: C3G,
    __asyncValues: OiB,
    __makeTemplateObject: E3G,
    __importStar: z3G,
    __importDefault: U3G,
    __classPrivateFieldGet: $3G,
    __classPrivateFieldSet: w3G,
    __classPrivateFieldIn: q3G,
    __addDisposableResource: N3G,
    __disposeResources: L3G,
    __rewriteRelativeImportExtension: M3G
  } = MiB.default
})
// @from(Start 7891451, End 7891779)
function TiB() {
  return bn1(this, arguments, function*() {
    let Q = this.getReader();
    try {
      while (!0) {
        let {
          done: B,
          value: G
        } = yield Le(Q.read());
        if (B) return yield Le(void 0);
        yield yield Le(G)
      }
    } finally {
      Q.releaseLock()
    }
  })
}
// @from(Start 7891781, End 7891911)
function Li6(A) {
  if (!A[Symbol.asyncIterator]) A[Symbol.asyncIterator] = TiB.bind(A);
  if (!A.values) A.values = TiB.bind(A)
}
// @from(Start 7891913, End 7892014)
function PiB(A) {
  if (A instanceof ReadableStream) return Li6(A), fn1.fromWeb(A);
  else return A
}
// @from(Start 7892016, End 7892163)
function Mi6(A) {
  if (A instanceof Uint8Array) return fn1.from(Buffer.from(A));
  else if (teA(A)) return PiB(A.stream());
  else return PiB(A)
}
// @from(Start 7892164, End 7892830)
async function jiB(A) {
  return function() {
    let Q = A.map((B) => typeof B === "function" ? B() : B).map(Mi6);
    return fn1.from(function() {
      return bn1(this, arguments, function*() {
        var B, G, Z, I;
        for (let X of Q) try {
          for (var Y = !0, J = (G = void 0, OiB(X)), W; W = yield Le(J.next()), B = W.done, !B; Y = !0) I = W.value, Y = !1, yield yield Le(I)
        } catch (V) {
          G = {
            error: V
          }
        } finally {
          try {
            if (!Y && !B && (Z = J.return)) yield Le(Z.call(J))
          } finally {
            if (G) throw G.error
          }
        }
      })
    }())
  }
}
// @from(Start 7892835, End 7892861)
SiB = L(() => {
  RiB()
})
// @from(Start 7892864, End 7892923)
function Oi6() {
  return `----AzSDKFormBoundary${cwA()}`
}
// @from(Start 7892925, End 7893015)
function Ri6(A) {
  let Q = "";
  for (let [B, G] of A) Q += `${B}: ${G}\r
`;
  return Q
}
// @from(Start 7893017, End 7893161)
function Ti6(A) {
  if (A instanceof Uint8Array) return A.byteLength;
  else if (teA(A)) return A.size === -1 ? void 0 : A.size;
  else return
}
// @from(Start 7893163, End 7893297)
function Pi6(A) {
  let Q = 0;
  for (let B of A) {
    let G = Ti6(B);
    if (G === void 0) return;
    else Q += G
  }
  return Q
}
// @from(Start 7893298, End 7893600)
async function ji6(A, Q, B) {
  let G = [Yk(`--${B}`, "utf-8"), ...Q.flatMap((I) => [Yk(`\r
`, "utf-8"), Yk(Ri6(I.headers), "utf-8"), Yk(`\r
`, "utf-8"), I.body, Yk(`\r
--${B}`, "utf-8")]), Yk(`--\r
\r
`, "utf-8")],
    Z = Pi6(G);
  if (Z) A.headers.set("Content-Length", Z);
  A.body = await jiB(G)
}
// @from(Start 7893602, End 7893840)
function ki6(A) {
  if (A.length > Si6) throw Error(`Multipart boundary "${A}" exceeds maximum length of 70 characters`);
  if (Array.from(A).some((Q) => !_i6.has(Q))) throw Error(`Multipart boundary "${A}" contains invalid characters`)
}
// @from(Start 7893842, End 7894765)
function hn1() {
  return {
    name: BA1,
    async sendRequest(A, Q) {
      var B;
      if (!A.multipartBody) return Q(A);
      if (A.body) throw Error("multipartBody and regular body cannot be set at the same time");
      let G = A.multipartBody.boundary,
        Z = (B = A.headers.get("Content-Type")) !== null && B !== void 0 ? B : "multipart/mixed",
        I = Z.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
      if (!I) throw Error(`Got multipart request body, but content-type header was not multipart: ${Z}`);
      let [, Y, J] = I;
      if (J && G && J !== G) throw Error(`Multipart boundary was specified as ${J} in the header, but got ${G} in the request body`);
      if (G !== null && G !== void 0 || (G = J), G) ki6(G);
      else G = Oi6();
      return A.headers.set("Content-Type", `${Y}; boundary=${G}`), await ji6(A, A.multipartBody.parts, G), A.multipartBody = void 0, Q(A)
    }
  }
}
// @from(Start 7894770, End 7894793)
BA1 = "multipartPolicy"
// @from(Start 7894797, End 7894805)
Si6 = 70
// @from(Start 7894809, End 7894812)
_i6
// @from(Start 7894818, End 7894947)
_iB = L(() => {
  Bn1();
  SiB();
  _i6 = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?")
})
// @from(Start 7894953, End 7895033)
KZA = L(() => {
  dwA();
  VlB();
  KlB();
  Wn1();
  wlB();
  JlB();
  WlB()
})
// @from(Start 7895036, End 7895069)
function rwA() {
  return Zn1()
}
// @from(Start 7895074, End 7895100)
gn1 = L(() => {
  KZA()
})
// @from(Start 7895106, End 7895108)
Sf
// @from(Start 7895114, End 7895172)
GA1 = L(() => {
  qe();
  Sf = rp("core-rest-pipeline")
})
// @from(Start 7895178, End 7895257)
fT = L(() => {
  klB();
  wn1();
  hlB();
  qlB();
  _iB();
  alB();
  MlB()
})
// @from(Start 7895260, End 7895342)
function kiB(A = {}) {
  return Kn1(Object.assign({
    logger: Sf.info
  }, A))
}
// @from(Start 7895347, End 7895381)
yiB = L(() => {
  GA1();
  fT()
})
// @from(Start 7895384, End 7895424)
function xiB(A = {}) {
  return Dn1(A)
}
// @from(Start 7895429, End 7895454)
viB = L(() => {
  fT()
})
// @from(Start 7895526, End 7895566)
function biB() {
  return "User-Agent"
}
// @from(Start 7895567, End 7895838)
async function fiB(A) {
  if (ZA1 && ZA1.versions) {
    let Q = ZA1.versions;
    if (Q.bun) A.set("Bun", Q.bun);
    else if (Q.deno) A.set("Deno", Q.deno);
    else if (Q.node) A.set("Node", Q.node)
  }
  A.set("OS", `(${DZA.arch()}-${DZA.type()}-${DZA.release()})`)
}
// @from(Start 7895843, End 7895857)
hiB = () => {}
// @from(Start 7895863, End 7895877)
IA1 = "1.21.0"
// @from(Start 7895881, End 7895888)
giB = 3
// @from(Start 7895891, End 7896022)
function hi6(A) {
  let Q = [];
  for (let [B, G] of A) {
    let Z = G ? `${B}/${G}` : B;
    Q.push(Z)
  }
  return Q.join(" ")
}
// @from(Start 7896024, End 7896057)
function uiB() {
  return biB()
}
// @from(Start 7896058, End 7896199)
async function YA1(A) {
  let Q = new Map;
  Q.set("core-rest-pipeline", IA1), await fiB(Q);
  let B = hi6(Q);
  return A ? `${A} ${B}` : B
}
// @from(Start 7896204, End 7896230)
un1 = L(() => {
  hiB()
})
// @from(Start 7896233, End 7896435)
function diB(A = {}) {
  let Q = YA1(A.userAgentPrefix);
  return {
    name: gi6,
    async sendRequest(B, G) {
      if (!B.headers.has(miB)) B.headers.set(miB, await Q);
      return G(B)
    }
  }
}
// @from(Start 7896440, End 7896443)
miB
// @from(Start 7896445, End 7896468)
gi6 = "userAgentPolicy"
// @from(Start 7896474, End 7896515)
ciB = L(() => {
  un1();
  miB = uiB()
})
// @from(Start 7896521, End 7896574)
JA1 = L(() => {
  En1();
  In1();
  Tn1();
  lwA()
})
// @from(Start 7896580, End 7896583)
HZA
// @from(Start 7896589, End 7896719)
piB = L(() => {
  HZA = class HZA extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  }
})
// @from(Start 7896725, End 7896751)
mn1 = L(() => {
  piB()
})
// @from(Start 7896754, End 7897469)
function liB(A, Q) {
  let {
    cleanupBeforeAbort: B,
    abortSignal: G,
    abortErrorMsg: Z
  } = Q !== null && Q !== void 0 ? Q : {};
  return new Promise((I, Y) => {
    function J() {
      Y(new HZA(Z !== null && Z !== void 0 ? Z : "The operation was aborted."))
    }

    function W() {
      G === null || G === void 0 || G.removeEventListener("abort", X)
    }

    function X() {
      B === null || B === void 0 || B(), W(), J()
    }
    if (G === null || G === void 0 ? void 0 : G.aborted) return J();
    try {
      A((V) => {
        W(), I(V)
      }, (V) => {
        W(), Y(V)
      })
    } catch (V) {
      Y(V)
    }
    G === null || G === void 0 || G.addEventListener("abort", X)
  })
}
// @from(Start 7897474, End 7897500)
iiB = L(() => {
  mn1()
})
// @from(Start 7897503, End 7897802)
function dn1(A, Q) {
  let B, {
    abortSignal: G,
    abortErrorMsg: Z
  } = Q !== null && Q !== void 0 ? Q : {};
  return liB((I) => {
    B = setTimeout(I, A)
  }, {
    cleanupBeforeAbort: () => clearTimeout(B),
    abortSignal: G,
    abortErrorMsg: Z !== null && Z !== void 0 ? Z : di6
  })
}
// @from(Start 7897807, End 7897837)
di6 = "The delay was aborted."
// @from(Start 7897843, End 7897869)
niB = L(() => {
  iiB()
})
// @from(Start 7897872, End 7898138)
function CZA(A) {
  if (Ne(A)) return A.message;
  else {
    let Q;
    try {
      if (typeof A === "object" && A) Q = JSON.stringify(A);
      else Q = String(A)
    } catch (B) {
      Q = "[unable to stringify input]"
    }
    return `Unknown error ${Q}`
  }
}
// @from(Start 7898143, End 7898169)
aiB = L(() => {
  JA1()
})
// @from(Start 7898172, End 7898213)
function siB(A, Q) {
  return awA(A, Q)
}
// @from(Start 7898215, End 7898249)
function WA1(A) {
  return Ne(A)
}
// @from(Start 7898254, End 7898257)
XA1
// @from(Start 7898259, End 7898262)
owA
// @from(Start 7898268, End 7898335)
tp = L(() => {
  JA1();
  niB();
  aiB();
  XA1 = XZA, owA = XZA
})
// @from(Start 7898338, End 7898395)
function cn1(A) {
  return typeof A[riB] === "function"
}
// @from(Start 7898397, End 7898463)
function oiB(A) {
  if (cn1(A)) return A[riB]();
  else return A
}
// @from(Start 7898468, End 7898471)
riB
// @from(Start 7898477, End 7898524)
tiB = L(() => {
  riB = Symbol("rawContent")
})
// @from(Start 7898527, End 7898796)
function eiB() {
  let A = hn1();
  return {
    name: pn1,
    sendRequest: async (Q, B) => {
      if (Q.multipartBody) {
        for (let G of Q.multipartBody.parts)
          if (cn1(G.body)) G.body = oiB(G.body)
      }
      return A.sendRequest(Q, B)
    }
  }
}
// @from(Start 7898801, End 7898804)
pn1
// @from(Start 7898810, End 7898857)
AnB = L(() => {
  fT();
  tiB();
  pn1 = BA1
})
// @from(Start 7898860, End 7898893)
function QnB() {
  return Hn1()
}
// @from(Start 7898898, End 7898923)
BnB = L(() => {
  fT()
})
// @from(Start 7898926, End 7898966)
function GnB(A = {}) {
  return Nn1(A)
}
// @from(Start 7898971, End 7898996)
ZnB = L(() => {
  fT()
})
// @from(Start 7898999, End 7899032)
function InB() {
  return jn1()
}
// @from(Start 7899037, End 7899062)
YnB = L(() => {
  fT()
})
// @from(Start 7899065, End 7899106)
function JnB(A, Q) {
  return kn1(A, Q)
}
// @from(Start 7899111, End 7899136)
WnB = L(() => {
  fT()
})
// @from(Start 7899139, End 7899352)
function XnB(A = "x-ms-client-request-id") {
  return {
    name: "setClientRequestIdPolicy",
    async sendRequest(Q, B) {
      if (!Q.headers.has(A)) Q.headers.set(A, Q.requestId);
      return B(Q)
    }
  }
}
// @from(Start 7899354, End 7899389)
function VnB(A) {
  return yn1(A)
}
// @from(Start 7899394, End 7899419)
FnB = L(() => {
  fT()
})
// @from(Start 7899422, End 7899457)
function KnB(A) {
  return xn1(A)
}
// @from(Start 7899462, End 7899487)
DnB = L(() => {
  fT()
})
// @from(Start 7899490, End 7899672)
function HnB(A = {}) {
  let Q = new twA(A.parentContext);
  if (A.span) Q = Q.setValue(EZA.span, A.span);
  if (A.namespace) Q = Q.setValue(EZA.namespace, A.namespace);
  return Q
}
// @from(Start 7899673, End 7900015)
class twA {
  constructor(A) {
    this._contextMap = A instanceof twA ? new Map(A._contextMap) : new Map
  }
  setValue(A, Q) {
    let B = new twA(this);
    return B._contextMap.set(A, Q), B
  }
  getValue(A) {
    return this._contextMap.get(A)
  }
  deleteValue(A) {
    let Q = new twA(this);
    return Q._contextMap.delete(A), Q
  }
}
// @from(Start 7900020, End 7900023)
EZA
// @from(Start 7900029, End 7900170)
ln1 = L(() => {
  EZA = {
    span: Symbol.for("@azure/core-tracing span"),
    namespace: Symbol.for("@azure/core-tracing namespace")
  }
})
// @from(Start 7900176, End 7900343)
znB = z((CnB) => {
  Object.defineProperty(CnB, "__esModule", {
    value: !0
  });
  CnB.state = void 0;
  CnB.state = {
    instrumenterImplementation: void 0
  }
})
// @from(Start 7900349, End 7900352)
UnB
// @from(Start 7900354, End 7900357)
VA1
// @from(Start 7900363, End 7900419)
$nB = L(() => {
  UnB = BA(znB(), 1), VA1 = UnB.state
})
// @from(Start 7900422, End 7900608)
function ci6() {
  return {
    end: () => {},
    isRecording: () => !1,
    recordException: () => {},
    setAttribute: () => {},
    setStatus: () => {},
    addEvent: () => {}
  }
}
// @from(Start 7900610, End 7900974)
function pi6() {
  return {
    createRequestHeaders: () => {
      return {}
    },
    parseTraceparentHeader: () => {
      return
    },
    startSpan: (A, Q) => {
      return {
        span: ci6(),
        tracingContext: HnB({
          parentContext: Q.tracingContext
        })
      }
    },
    withContext(A, Q, ...B) {
      return Q(...B)
    }
  }
}
// @from(Start 7900976, End 7901113)
function ewA() {
  if (!VA1.instrumenterImplementation) VA1.instrumenterImplementation = pi6();
  return VA1.instrumenterImplementation
}
// @from(Start 7901118, End 7901153)
wnB = L(() => {
  ln1();
  $nB()
})
// @from(Start 7901156, End 7902724)
function AqA(A) {
  let {
    namespace: Q,
    packageName: B,
    packageVersion: G
  } = A;

  function Z(X, V, F) {
    var K;
    let D = ewA().startSpan(X, Object.assign(Object.assign({}, F), {
        packageName: B,
        packageVersion: G,
        tracingContext: (K = V === null || V === void 0 ? void 0 : V.tracingOptions) === null || K === void 0 ? void 0 : K.tracingContext
      })),
      H = D.tracingContext,
      C = D.span;
    if (!H.getValue(EZA.namespace)) H = H.setValue(EZA.namespace, Q);
    C.setAttribute("az.namespace", H.getValue(EZA.namespace));
    let E = Object.assign({}, V, {
      tracingOptions: Object.assign(Object.assign({}, V === null || V === void 0 ? void 0 : V.tracingOptions), {
        tracingContext: H
      })
    });
    return {
      span: C,
      updatedOptions: E
    }
  }
  async function I(X, V, F, K) {
    let {
      span: D,
      updatedOptions: H
    } = Z(X, V, K);
    try {
      let C = await Y(H.tracingOptions.tracingContext, () => Promise.resolve(F(H, D)));
      return D.setStatus({
        status: "success"
      }), C
    } catch (C) {
      throw D.setStatus({
        status: "error",
        error: C
      }), C
    } finally {
      D.end()
    }
  }

  function Y(X, V, ...F) {
    return ewA().withContext(X, V, ...F)
  }

  function J(X) {
    return ewA().parseTraceparentHeader(X)
  }

  function W(X) {
    return ewA().createRequestHeaders(X)
  }
  return {
    startSpan: Z,
    withSpan: I,
    withContext: Y,
    parseTraceparentHeader: J,
    createRequestHeaders: W
  }
}
// @from(Start 7902729, End 7902764)
qnB = L(() => {
  wnB();
  ln1()
})
// @from(Start 7902770, End 7902796)
in1 = L(() => {
  qnB()
})
// @from(Start 7902799, End 7902834)
function QqA(A) {
  return Jn1(A)
}
// @from(Start 7902839, End 7902842)
zZA
// @from(Start 7902848, End 7902886)
FA1 = L(() => {
  KZA();
  zZA = LU
})
// @from(Start 7902889, End 7903692)
function NnB(A = {}) {
  let Q = YA1(A.userAgentPrefix),
    B = new Ik({
      additionalAllowedQueryParameters: A.additionalAllowedQueryParameters
    }),
    G = ii6();
  return {
    name: li6,
    async sendRequest(Z, I) {
      var Y;
      if (!G) return I(Z);
      let J = await Q,
        W = {
          "http.url": B.sanitizeUrl(Z.url),
          "http.method": Z.method,
          "http.user_agent": J,
          requestId: Z.requestId
        };
      if (J) W["http.user_agent"] = J;
      let {
        span: X,
        tracingContext: V
      } = (Y = ni6(G, Z, W)) !== null && Y !== void 0 ? Y : {};
      if (!X || !V) return I(Z);
      try {
        let F = await G.withContext(V, I, Z);
        return si6(X, F), F
      } catch (F) {
        throw ai6(X, F), F
      }
    }
  }
}
// @from(Start 7903694, End 7903938)
function ii6() {
  try {
    return AqA({
      namespace: "",
      packageName: "@azure/core-rest-pipeline",
      packageVersion: IA1
    })
  } catch (A) {
    Sf.warning(`Error when creating the TracingClient: ${CZA(A)}`);
    return
  }
}
// @from(Start 7903940, End 7904562)
function ni6(A, Q, B) {
  try {
    let {
      span: G,
      updatedOptions: Z
    } = A.startSpan(`HTTP ${Q.method}`, {
      tracingOptions: Q.tracingOptions
    }, {
      spanKind: "client",
      spanAttributes: B
    });
    if (!G.isRecording()) {
      G.end();
      return
    }
    let I = A.createRequestHeaders(Z.tracingOptions.tracingContext);
    for (let [Y, J] of Object.entries(I)) Q.headers.set(Y, J);
    return {
      span: G,
      tracingContext: Z.tracingOptions.tracingContext
    }
  } catch (G) {
    Sf.warning(`Skipping creating a tracing span due to an error: ${CZA(G)}`);
    return
  }
}
// @from(Start 7904564, End 7904870)
function ai6(A, Q) {
  try {
    if (A.setStatus({
        status: "error",
        error: WA1(Q) ? Q : void 0
      }), QqA(Q) && Q.statusCode) A.setAttribute("http.status_code", Q.statusCode);
    A.end()
  } catch (B) {
    Sf.warning(`Skipping tracing span processing due to an error: ${CZA(B)}`)
  }
}
// @from(Start 7904872, End 7905227)
function si6(A, Q) {
  try {
    A.setAttribute("http.status_code", Q.status);
    let B = Q.headers.get("x-ms-request-id");
    if (B) A.setAttribute("serviceRequestId", B);
    if (Q.status >= 400) A.setStatus({
      status: "error"
    });
    A.end()
  } catch (B) {
    Sf.warning(`Skipping tracing span processing due to an error: ${CZA(B)}`)
  }
}
// @from(Start 7905232, End 7905253)
li6 = "tracingPolicy"
// @from(Start 7905259, End 7905329)
LnB = L(() => {
  in1();
  un1();
  GA1();
  tp();
  FA1();
  JA1()
})
// @from(Start 7905332, End 7905748)
function KA1(A) {
  if (A instanceof AbortSignal) return {
    abortSignal: A
  };
  if (A.aborted) return {
    abortSignal: AbortSignal.abort(A.reason)
  };
  let Q = new AbortController,
    B = !0;

  function G() {
    if (B) A.removeEventListener("abort", Z), B = !1
  }

  function Z() {
    Q.abort(A.reason), G()
  }
  return A.addEventListener("abort", Z), {
    abortSignal: Q.signal,
    cleanup: G
  }
}
// @from(Start 7905750, End 7906094)
function MnB() {
  return {
    name: ri6,
    sendRequest: async (A, Q) => {
      if (!A.abortSignal) return Q(A);
      let {
        abortSignal: B,
        cleanup: G
      } = KA1(A.abortSignal);
      A.abortSignal = B;
      try {
        return await Q(A)
      } finally {
        G === null || G === void 0 || G()
      }
    }
  }
}
// @from(Start 7906099, End 7906132)
ri6 = "wrapAbortSignalLikePolicy"
// @from(Start 7906138, End 7906152)
OnB = () => {}
// @from(Start 7906155, End 7907001)
function nn1(A) {
  var Q;
  let B = rwA();
  if (owA) {
    if (A.agent) B.addPolicy(VnB(A.agent));
    if (A.tlsOptions) B.addPolicy(KnB(A.tlsOptions));
    B.addPolicy(JnB(A.proxyOptions)), B.addPolicy(QnB())
  }
  if (B.addPolicy(MnB()), B.addPolicy(InB(), {
      beforePolicies: [pn1]
    }), B.addPolicy(diB(A.userAgentOptions)), B.addPolicy(XnB((Q = A.telemetryOptions) === null || Q === void 0 ? void 0 : Q.clientRequestIdHeaderName)), B.addPolicy(eiB(), {
      afterPhase: "Deserialize"
    }), B.addPolicy(GnB(A.retryOptions), {
      phase: "Retry"
    }), B.addPolicy(NnB(Object.assign(Object.assign({}, A.userAgentOptions), A.loggingOptions)), {
      afterPhase: "Retry"
    }), owA) B.addPolicy(xiB(A.redirectOptions), {
    afterPhase: "Retry"
  });
  return B.addPolicy(kiB(A.loggingOptions), {
    afterPhase: "Sign"
  }), B
}
// @from(Start 7907006, End 7907148)
RnB = L(() => {
  yiB();
  gn1();
  viB();
  ciB();
  AnB();
  BnB();
  ZnB();
  YnB();
  tp();
  WnB();
  FnB();
  DnB();
  LnB();
  OnB()
})
// @from(Start 7907151, End 7907477)
function an1() {
  let A = Vn1();
  return {
    async sendRequest(Q) {
      let {
        abortSignal: B,
        cleanup: G
      } = Q.abortSignal ? KA1(Q.abortSignal) : {};
      try {
        return Q.abortSignal = B, await A.sendRequest(Q)
      } finally {
        G === null || G === void 0 || G()
      }
    }
  }
}
// @from(Start 7907482, End 7907508)
TnB = L(() => {
  KZA()
})
// @from(Start 7907511, End 7907544)
function Me(A) {
  return Zk(A)
}
// @from(Start 7907549, End 7907575)
PnB = L(() => {
  KZA()
})
// @from(Start 7907578, End 7907612)
function hT(A) {
  return Gn1(A)
}
// @from(Start 7907617, End 7907643)
jnB = L(() => {
  KZA()
})
// @from(Start 7907646, End 7907749)
function sn1(A, Q = {
  maxRetries: giB
}) {
  return swA(A, Object.assign({
    logger: oi6
  }, Q))
}
// @from(Start 7907754, End 7907757)
oi6
// @from(Start 7907763, End 7907842)
SnB = L(() => {
  qe();
  fT();
  oi6 = rp("core-rest-pipeline retryPolicy")
})
// @from(Start 7907844, End 7908202)
async function ei6(A, Q, B) {
  async function G() {
    if (Date.now() < B) try {
      return await A()
    } catch (I) {
      return null
    } else {
      let I = await A();
      if (I === null) throw Error("Failed to refresh access token.");
      return I
    }
  }
  let Z = await G();
  while (Z === null) await dn1(Q), Z = await G();
  return Z
}
// @from(Start 7908204, End 7909463)
function _nB(A, Q) {
  let B = null,
    G = null,
    Z, I = Object.assign(Object.assign({}, ti6), Q),
    Y = {
      get isRefreshing() {
        return B !== null
      },
      get shouldRefresh() {
        var W;
        if (Y.isRefreshing) return !1;
        if ((G === null || G === void 0 ? void 0 : G.refreshAfterTimestamp) && G.refreshAfterTimestamp < Date.now()) return !0;
        return ((W = G === null || G === void 0 ? void 0 : G.expiresOnTimestamp) !== null && W !== void 0 ? W : 0) - I.refreshWindowInMs < Date.now()
      },
      get mustRefresh() {
        return G === null || G.expiresOnTimestamp - I.forcedRefreshWindowInMs < Date.now()
      }
    };

  function J(W, X) {
    var V;
    if (!Y.isRefreshing) B = ei6(() => A.getToken(W, X), I.retryIntervalInMs, (V = G === null || G === void 0 ? void 0 : G.expiresOnTimestamp) !== null && V !== void 0 ? V : Date.now()).then((K) => {
      return B = null, G = K, Z = X.tenantId, G
    }).catch((K) => {
      throw B = null, G = null, Z = void 0, K
    });
    return B
  }
  return async (W, X) => {
    let V = Boolean(X.claims),
      F = Z !== X.tenantId;
    if (V) G = null;
    if (F || V || Y.mustRefresh) return J(W, X);
    if (Y.shouldRefresh) J(W, X);
    return G
  }
}
// @from(Start 7909468, End 7909471)
ti6
// @from(Start 7909477, End 7909611)
knB = L(() => {
  tp();
  ti6 = {
    forcedRefreshWindowInMs: 1000,
    retryIntervalInMs: 3000,
    refreshWindowInMs: 120000
  }
})
// @from(Start 7909613, End 7909772)
async function DA1(A, Q) {
  try {
    return [await Q(A), void 0]
  } catch (B) {
    if (QqA(B) && B.response) return [B.response, B];
    else throw B
  }
}
// @from(Start 7909773, End 7910055)
async function An6(A) {
  let {
    scopes: Q,
    getAccessToken: B,
    request: G
  } = A, Z = {
    abortSignal: G.abortSignal,
    tracingOptions: G.tracingOptions,
    enableCae: !0
  }, I = await B(Q, Z);
  if (I) A.request.headers.set("Authorization", `Bearer ${I.token}`)
}
// @from(Start 7910057, End 7910139)
function ynB(A) {
  return A.status === 401 && A.headers.has("WWW-Authenticate")
}
// @from(Start 7910140, End 7910415)
async function xnB(A, Q) {
  var B;
  let {
    scopes: G
  } = A, Z = await A.getAccessToken(G, {
    enableCae: !0,
    claims: Q
  });
  if (!Z) return !1;
  return A.request.headers.set("Authorization", `${(B=Z.tokenType)!==null&&B!==void 0?B:"Bearer"} ${Z.token}`), !0
}
// @from(Start 7910417, End 7913040)
function BqA(A) {
  var Q, B, G;
  let {
    credential: Z,
    scopes: I,
    challengeCallbacks: Y
  } = A, J = A.logger || Sf, W = {
    authorizeRequest: (B = (Q = Y === null || Y === void 0 ? void 0 : Y.authorizeRequest) === null || Q === void 0 ? void 0 : Q.bind(Y)) !== null && B !== void 0 ? B : An6,
    authorizeRequestOnChallenge: (G = Y === null || Y === void 0 ? void 0 : Y.authorizeRequestOnChallenge) === null || G === void 0 ? void 0 : G.bind(Y)
  }, X = Z ? _nB(Z) : () => Promise.resolve(null);
  return {
    name: bnB,
    async sendRequest(V, F) {
      if (!V.url.toLowerCase().startsWith("https://")) throw Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      await W.authorizeRequest({
        scopes: Array.isArray(I) ? I : [I],
        request: V,
        getAccessToken: X,
        logger: J
      });
      let K, D, H;
      if ([K, D] = await DA1(V, F), ynB(K)) {
        let C = vnB(K.headers.get("WWW-Authenticate"));
        if (C) {
          let E;
          try {
            E = atob(C)
          } catch (U) {
            return J.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${C}`), K
          }
          if (H = await xnB({
              scopes: Array.isArray(I) ? I : [I],
              response: K,
              request: V,
              getAccessToken: X,
              logger: J
            }, E), H)[K, D] = await DA1(V, F)
        } else if (W.authorizeRequestOnChallenge) {
          if (H = await W.authorizeRequestOnChallenge({
              scopes: Array.isArray(I) ? I : [I],
              request: V,
              response: K,
              getAccessToken: X,
              logger: J
            }), H)[K, D] = await DA1(V, F);
          if (ynB(K)) {
            if (C = vnB(K.headers.get("WWW-Authenticate")), C) {
              let E;
              try {
                E = atob(C)
              } catch (U) {
                return J.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${C}`), K
              }
              if (H = await xnB({
                  scopes: Array.isArray(I) ? I : [I],
                  response: K,
                  request: V,
                  getAccessToken: X,
                  logger: J
                }, E), H)[K, D] = await DA1(V, F)
            }
          }
        }
      }
      if (D) throw D;
      else return K
    }
  }
}
// @from(Start 7913042, End 7913379)
function Qn6(A) {
  let Q = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g,
    B = /(\w+)="([^"]*)"/g,
    G = [],
    Z;
  while ((Z = Q.exec(A)) !== null) {
    let I = Z[1],
      Y = Z[2],
      J = {},
      W;
    while ((W = B.exec(Y)) !== null) J[W[1]] = W[2];
    G.push({
      scheme: I,
      params: J
    })
  }
  return G
}
// @from(Start 7913381, End 7913599)
function vnB(A) {
  var Q;
  if (!A) return;
  return (Q = Qn6(A).find((G) => G.scheme === "Bearer" && G.params.claims && G.params.error === "insufficient_claims")) === null || Q === void 0 ? void 0 : Q.params.claims
}
// @from(Start 7913604, End 7913643)
bnB = "bearerTokenAuthenticationPolicy"
// @from(Start 7913649, End 7913693)
fnB = L(() => {
  knB();
  GA1();
  FA1()
})
// @from(Start 7913699, End 7913787)
_f = L(() => {
  gn1();
  RnB();
  TnB();
  PnB();
  jnB();
  FA1();
  SnB();
  fnB()
})
// @from(Start 7913793, End 7913958)
unB = z((hnB) => {
  Object.defineProperty(hnB, "__esModule", {
    value: !0
  });
  hnB.state = void 0;
  hnB.state = {
    operationRequestMap: new WeakMap
  }
})
// @from(Start 7913964, End 7913967)
mnB
// @from(Start 7913969, End 7913972)
rn1
// @from(Start 7913978, End 7914034)
dnB = L(() => {
  mnB = BA(unB(), 1), rn1 = mnB.state
})
// @from(Start 7914037, End 7914800)
function ep(A, Q, B) {
  let {
    parameterPath: G,
    mapper: Z
  } = Q, I;
  if (typeof G === "string") G = [G];
  if (Array.isArray(G)) {
    if (G.length > 0)
      if (Z.isConstant) I = Z.defaultValue;
      else {
        let Y = cnB(A, G);
        if (!Y.propertyFound && B) Y = cnB(B, G);
        let J = !1;
        if (!Y.propertyFound) J = Z.required || G[0] === "options" && G.length === 2;
        I = J ? Z.defaultValue : Y.propertyValue
      }
  } else {
    if (Z.required) I = {};
    for (let Y in G) {
      let J = Z.type.modelProperties[Y],
        W = G[Y],
        X = ep(A, {
          parameterPath: W,
          mapper: J
        }, B);
      if (X !== void 0) {
        if (!I) I = {};
        I[Y] = X
      }
    }
  }
  return I
}
// @from(Start 7914802, End 7915052)
function cnB(A, Q) {
  let B = {
      propertyFound: !1
    },
    G = 0;
  for (; G < Q.length; ++G) {
    let Z = Q[G];
    if (A && Z in A) A = A[Z];
    else break
  }
  if (G === Q.length) B.propertyValue = A, B.propertyFound = !0;
  return B
}
// @from(Start 7915054, End 7915091)
function Bn6(A) {
  return pnB in A
}
// @from(Start 7915093, End 7915250)
function kf(A) {
  if (Bn6(A)) return kf(A[pnB]);
  let Q = rn1.operationRequestMap.get(A);
  if (!Q) Q = {}, rn1.operationRequestMap.set(A, Q);
  return Q
}
// @from(Start 7915255, End 7915258)
pnB
// @from(Start 7915264, End 7915349)
GqA = L(() => {
  dnB();
  pnB = Symbol.for("@azure/core-client original request")
})
// @from(Start 7915352, End 7916205)
function lnB(A = {}) {
  var Q, B, G, Z, I, Y, J;
  let W = (B = (Q = A.expectedContentTypes) === null || Q === void 0 ? void 0 : Q.json) !== null && B !== void 0 ? B : Gn6,
    X = (Z = (G = A.expectedContentTypes) === null || G === void 0 ? void 0 : G.xml) !== null && Z !== void 0 ? Z : Zn6,
    V = A.parseXML,
    F = A.serializerOptions,
    K = {
      xml: {
        rootName: (I = F === null || F === void 0 ? void 0 : F.xml.rootName) !== null && I !== void 0 ? I : "",
        includeRoot: (Y = F === null || F === void 0 ? void 0 : F.xml.includeRoot) !== null && Y !== void 0 ? Y : !1,
        xmlCharKey: (J = F === null || F === void 0 ? void 0 : F.xml.xmlCharKey) !== null && J !== void 0 ? J : peA
      }
    };
  return {
    name: In6,
    async sendRequest(D, H) {
      let C = await H(D);
      return Wn6(W, X, C, K, V)
    }
  }
}
// @from(Start 7916207, End 7916535)
function Yn6(A) {
  let Q, B = A.request,
    G = kf(B),
    Z = G === null || G === void 0 ? void 0 : G.operationSpec;
  if (Z)
    if (!(G === null || G === void 0 ? void 0 : G.operationResponseGetter)) Q = Z.responses[A.status];
    else Q = G === null || G === void 0 ? void 0 : G.operationResponseGetter(Z, A);
  return Q
}
// @from(Start 7916537, End 7916764)
function Jn6(A) {
  let Q = A.request,
    B = kf(Q),
    G = B === null || B === void 0 ? void 0 : B.shouldDeserialize,
    Z;
  if (G === void 0) Z = !0;
  else if (typeof G === "boolean") Z = G;
  else Z = G(A);
  return Z
}
// @from(Start 7916765, End 7917940)
async function Wn6(A, Q, B, G, Z) {
  let I = await Fn6(A, Q, B, G, Z);
  if (!Jn6(I)) return I;
  let Y = kf(I.request),
    J = Y === null || Y === void 0 ? void 0 : Y.operationSpec;
  if (!J || !J.responses) return I;
  let W = Yn6(I),
    {
      error: X,
      shouldReturnResponse: V
    } = Vn6(I, J, W, G);
  if (X) throw X;
  else if (V) return I;
  if (W) {
    if (W.bodyMapper) {
      let F = I.parsedBody;
      if (J.isXML && W.bodyMapper.type.name === jf.Sequence) F = typeof F === "object" ? F[W.bodyMapper.xmlElementName] : [];
      try {
        I.parsedBody = J.serializer.deserialize(W.bodyMapper, F, "operationRes.parsedBody", G)
      } catch (K) {
        throw new zZA(`Error ${K} occurred in deserializing the responseBody - ${I.bodyAsText}`, {
          statusCode: I.status,
          request: I.request,
          response: I
        })
      }
    } else if (J.httpMethod === "HEAD") I.parsedBody = B.status >= 200 && B.status < 300;
    if (W.headersMapper) I.parsedHeaders = J.serializer.deserialize(W.headersMapper, I.headers.toJSON(), "operationRes.parsedHeaders", {
      xml: {},
      ignoreUnknownProperties: !0
    })
  }
  return I
}
// @from(Start 7917942, End 7918061)
function Xn6(A) {
  let Q = Object.keys(A.responses);
  return Q.length === 0 || Q.length === 1 && Q[0] === "default"
}
// @from(Start 7918063, End 7919904)
function Vn6(A, Q, B, G) {
  var Z, I, Y, J, W;
  let X = 200 <= A.status && A.status < 300;
  if (Xn6(Q) ? X : !!B)
    if (B) {
      if (!B.isError) return {
        error: null,
        shouldReturnResponse: !1
      }
    } else return {
      error: null,
      shouldReturnResponse: !1
    };
  let F = B !== null && B !== void 0 ? B : Q.responses.default,
    K = ((Z = A.request.streamResponseStatusCodes) === null || Z === void 0 ? void 0 : Z.has(A.status)) ? `Unexpected status code: ${A.status}` : A.bodyAsText,
    D = new zZA(K, {
      statusCode: A.status,
      request: A.request,
      response: A
    });
  if (!F && !(((Y = (I = A.parsedBody) === null || I === void 0 ? void 0 : I.error) === null || Y === void 0 ? void 0 : Y.code) && ((W = (J = A.parsedBody) === null || J === void 0 ? void 0 : J.error) === null || W === void 0 ? void 0 : W.message))) throw D;
  let H = F === null || F === void 0 ? void 0 : F.bodyMapper,
    C = F === null || F === void 0 ? void 0 : F.headersMapper;
  try {
    if (A.parsedBody) {
      let E = A.parsedBody,
        U;
      if (H) {
        let w = E;
        if (Q.isXML && H.type.name === jf.Sequence) {
          w = [];
          let N = H.xmlElementName;
          if (typeof E === "object" && N) w = E[N]
        }
        U = Q.serializer.deserialize(H, w, "error.response.parsedBody", G)
      }
      let q = E.error || U || E;
      if (D.code = q.code, q.message) D.message = q.message;
      if (H) D.response.parsedBody = U
    }
    if (A.headers && C) D.response.parsedHeaders = Q.serializer.deserialize(C, A.headers.toJSON(), "operationRes.parsedHeaders")
  } catch (E) {
    D.message = `Error "${E.message}" occurred in deserializing the responseBody - "${A.bodyAsText}" for the default response.`
  }
  return {
    error: D,
    shouldReturnResponse: !1
  }
}
// @from(Start 7919905, End 7920809)
async function Fn6(A, Q, B, G, Z) {
  var I;
  if (!((I = B.request.streamResponseStatusCodes) === null || I === void 0 ? void 0 : I.has(B.status)) && B.bodyAsText) {
    let Y = B.bodyAsText,
      J = B.headers.get("Content-Type") || "",
      W = !J ? [] : J.split(";").map((X) => X.toLowerCase());
    try {
      if (W.length === 0 || W.some((X) => A.indexOf(X) !== -1)) return B.parsedBody = JSON.parse(Y), B;
      else if (W.some((X) => Q.indexOf(X) !== -1)) {
        if (!Z) throw Error("Parsing XML not supported.");
        let X = await Z(Y, G.xml);
        return B.parsedBody = X, B
      }
    } catch (X) {
      let V = `Error "${X}" occurred while parsing the response body - ${B.bodyAsText}.`,
        F = X.code || zZA.PARSE_ERROR;
      throw new zZA(V, {
        code: F,
        statusCode: B.status,
        request: B.request,
        response: B
      })
    }
  }
  return B
}
// @from(Start 7920814, End 7920817)
Gn6
// @from(Start 7920819, End 7920822)
Zn6
// @from(Start 7920824, End 7920853)
In6 = "deserializationPolicy"
// @from(Start 7920859, End 7920996)
inB = L(() => {
  _f();
  leA();
  GqA();
  Gn6 = ["application/json", "text/json"], Zn6 = ["application/xml", "application/atom+xml"]
})
// @from(Start 7920999, End 7921190)
function nnB(A) {
  let Q = new Set;
  for (let B in A.responses) {
    let G = A.responses[B];
    if (G.bodyMapper && G.bodyMapper.type.name === jf.Stream) Q.add(Number(B))
  }
  return Q
}
// @from(Start 7921192, End 7921388)
function Jk(A) {
  let {
    parameterPath: Q,
    mapper: B
  } = A, G;
  if (typeof Q === "string") G = Q;
  else if (Array.isArray(Q)) G = Q.join(".");
  else G = B.serializedName;
  return G
}
// @from(Start 7921393, End 7921419)
HA1 = L(() => {
  leA()
})
// @from(Start 7921422, End 7921765)
function anB(A = {}) {
  let Q = A.stringifyXML;
  return {
    name: Kn6,
    async sendRequest(B, G) {
      let Z = kf(B),
        I = Z === null || Z === void 0 ? void 0 : Z.operationSpec,
        Y = Z === null || Z === void 0 ? void 0 : Z.operationArguments;
      if (I && Y) Dn6(B, Y, I), Hn6(B, Y, I, Q);
      return G(B)
    }
  }
}
// @from(Start 7921767, End 7922425)
function Dn6(A, Q, B) {
  var G, Z;
  if (B.headerParameters)
    for (let Y of B.headerParameters) {
      let J = ep(Q, Y);
      if (J !== null && J !== void 0 || Y.mapper.required) {
        J = B.serializer.serialize(Y.mapper, J, Jk(Y));
        let W = Y.mapper.headerCollectionPrefix;
        if (W)
          for (let X of Object.keys(J)) A.headers.set(W + X, J[X]);
        else A.headers.set(Y.mapper.serializedName || Jk(Y), J)
      }
    }
  let I = (Z = (G = Q.options) === null || G === void 0 ? void 0 : G.requestOptions) === null || Z === void 0 ? void 0 : Z.customHeaders;
  if (I)
    for (let Y of Object.keys(I)) A.headers.set(Y, I[Y])
}
// @from(Start 7922427, End 7924632)
function Hn6(A, Q, B, G = function() {
  throw Error("XML serialization unsupported!")
}) {
  var Z, I, Y, J, W;
  let X = (Z = Q.options) === null || Z === void 0 ? void 0 : Z.serializerOptions,
    V = {
      xml: {
        rootName: (I = X === null || X === void 0 ? void 0 : X.xml.rootName) !== null && I !== void 0 ? I : "",
        includeRoot: (Y = X === null || X === void 0 ? void 0 : X.xml.includeRoot) !== null && Y !== void 0 ? Y : !1,
        xmlCharKey: (J = X === null || X === void 0 ? void 0 : X.xml.xmlCharKey) !== null && J !== void 0 ? J : peA
      }
    },
    F = V.xml.xmlCharKey;
  if (B.requestBody && B.requestBody.mapper) {
    A.body = ep(Q, B.requestBody);
    let K = B.requestBody.mapper,
      {
        required: D,
        serializedName: H,
        xmlName: C,
        xmlElementName: E,
        xmlNamespace: U,
        xmlNamespacePrefix: q,
        nullable: w
      } = K,
      N = K.type.name;
    try {
      if (A.body !== void 0 && A.body !== null || w && A.body === null || D) {
        let R = Jk(B.requestBody);
        A.body = B.serializer.serialize(K, A.body, R, V);
        let T = N === jf.Stream;
        if (B.isXML) {
          let y = q ? `xmlns:${q}` : "xmlns",
            v = Cn6(U, y, N, A.body, V);
          if (N === jf.Sequence) A.body = G(En6(v, E || C || H, y, U), {
            rootName: C || H,
            xmlCharKey: F
          });
          else if (!T) A.body = G(v, {
            rootName: C || H,
            xmlCharKey: F
          })
        } else if (N === jf.String && (((W = B.contentType) === null || W === void 0 ? void 0 : W.match("text/plain")) || B.mediaType === "text")) return;
        else if (!T) A.body = JSON.stringify(A.body)
      }
    } catch (R) {
      throw Error(`Error "${R.message}" occurred in serializing the payload - ${JSON.stringify(H,void 0,"  ")}.`)
    }
  } else if (B.formDataParameters && B.formDataParameters.length > 0) {
    A.formData = {};
    for (let K of B.formDataParameters) {
      let D = ep(Q, K);
      if (D !== void 0 && D !== null) {
        let H = K.mapper.serializedName || Jk(K);
        A.formData[H] = B.serializer.serialize(K.mapper, D, Jk(K), V)
      }
    }
  }
}
// @from(Start 7924634, End 7924832)
function Cn6(A, Q, B, G, Z) {
  if (A && !["Composite", "Sequence", "Dictionary"].includes(B)) {
    let I = {};
    return I[Z.xml.xmlCharKey] = G, I[ei1] = {
      [Q]: A
    }, I
  }
  return G
}
// @from(Start 7924834, End 7925003)
function En6(A, Q, B, G) {
  if (!Array.isArray(A)) A = [A];
  if (!B || !G) return {
    [Q]: A
  };
  let Z = {
    [Q]: A
  };
  return Z[ei1] = {
    [B]: G
  }, Z
}
// @from(Start 7925008, End 7925035)
Kn6 = "serializationPolicy"
// @from(Start 7925041, End 7925085)
snB = L(() => {
  GqA();
  leA();
  HA1()
})
// @from(Start 7925088, End 7925472)
function rnB(A = {}) {
  let Q = nn1(A !== null && A !== void 0 ? A : {});
  if (A.credentialOptions) Q.addPolicy(BqA({
    credential: A.credentialOptions.credential,
    scopes: A.credentialOptions.credentialScopes
  }));
  return Q.addPolicy(anB(A.serializationOptions), {
    phase: "Serialize"
  }), Q.addPolicy(lnB(A.deserializationOptions), {
    phase: "Deserialize"
  }), Q
}
// @from(Start 7925477, End 7925520)
onB = L(() => {
  inB();
  _f();
  snB()
})
// @from(Start 7925523, End 7925579)
function tnB() {
  if (!on1) on1 = an1();
  return on1
}
// @from(Start 7925584, End 7925587)
on1
// @from(Start 7925593, End 7925618)
enB = L(() => {
  _f()
})
// @from(Start 7925621, End 7925983)
function QaB(A, Q, B, G) {
  let Z = Un6(Q, B, G),
    I = !1,
    Y = AaB(A, Z);
  if (Q.path) {
    let X = AaB(Q.path, Z);
    if (Q.path === "/{nextLink}" && X.startsWith("/")) X = X.substring(1);
    if ($n6(X)) Y = X, I = !0;
    else Y = wn6(Y, X)
  }
  let {
    queryParams: J,
    sequenceParams: W
  } = qn6(Q, B, G);
  return Y = Ln6(Y, J, W, I), Y
}
// @from(Start 7925985, End 7926079)
function AaB(A, Q) {
  let B = A;
  for (let [G, Z] of Q) B = B.split(G).join(Z);
  return B
}
// @from(Start 7926081, End 7926456)
function Un6(A, Q, B) {
  var G;
  let Z = new Map;
  if ((G = A.urlParameters) === null || G === void 0 ? void 0 : G.length)
    for (let I of A.urlParameters) {
      let Y = ep(Q, I, B),
        J = Jk(I);
      if (Y = A.serializer.serialize(I.mapper, Y, J), !I.skipEncoding) Y = encodeURIComponent(Y);
      Z.set(`{${I.mapper.serializedName||J}}`, Y)
    }
  return Z
}
// @from(Start 7926458, End 7926504)
function $n6(A) {
  return A.includes("://")
}
// @from(Start 7926506, End 7926902)
function wn6(A, Q) {
  if (!Q) return A;
  let B = new URL(A),
    G = B.pathname;
  if (!G.endsWith("/")) G = `${G}/`;
  if (Q.startsWith("/")) Q = Q.substring(1);
  let Z = Q.indexOf("?");
  if (Z !== -1) {
    let I = Q.substring(0, Z),
      Y = Q.substring(Z + 1);
    if (G = G + I, Y) B.search = B.search ? `${B.search}&${Y}` : Y
  } else G = G + Q;
  return B.pathname = G, B.toString()
}
// @from(Start 7926904, End 7928137)
function qn6(A, Q, B) {
  var G;
  let Z = new Map,
    I = new Set;
  if ((G = A.queryParameters) === null || G === void 0 ? void 0 : G.length)
    for (let Y of A.queryParameters) {
      if (Y.mapper.type.name === "Sequence" && Y.mapper.serializedName) I.add(Y.mapper.serializedName);
      let J = ep(Q, Y, B);
      if (J !== void 0 && J !== null || Y.mapper.required) {
        J = A.serializer.serialize(Y.mapper, J, Jk(Y));
        let W = Y.collectionFormat ? zn6[Y.collectionFormat] : "";
        if (Array.isArray(J)) J = J.map((X) => {
          if (X === null || X === void 0) return "";
          return X
        });
        if (Y.collectionFormat === "Multi" && J.length === 0) continue;
        else if (Array.isArray(J) && (Y.collectionFormat === "SSV" || Y.collectionFormat === "TSV")) J = J.join(W);
        if (!Y.skipEncoding)
          if (Array.isArray(J)) J = J.map((X) => {
            return encodeURIComponent(X)
          });
          else J = encodeURIComponent(J);
        if (Array.isArray(J) && (Y.collectionFormat === "CSV" || Y.collectionFormat === "Pipes")) J = J.join(W);
        Z.set(Y.mapper.serializedName || Jk(Y), J)
      }
    }
  return {
    queryParams: Z,
    sequenceParams: I
  }
}
// @from(Start 7928139, End 7928439)
function Nn6(A) {
  let Q = new Map;
  if (!A || A[0] !== "?") return Q;
  A = A.slice(1);
  let B = A.split("&");
  for (let G of B) {
    let [Z, I] = G.split("=", 2), Y = Q.get(Z);
    if (Y)
      if (Array.isArray(Y)) Y.push(I);
      else Q.set(Z, [Y, I]);
    else Q.set(Z, I)
  }
  return Q
}
// @from(Start 7928441, End 7929174)
function Ln6(A, Q, B, G = !1) {
  if (Q.size === 0) return A;
  let Z = new URL(A),
    I = Nn6(Z.search);
  for (let [J, W] of Q) {
    let X = I.get(J);
    if (Array.isArray(X))
      if (Array.isArray(W)) {
        X.push(...W);
        let V = new Set(X);
        I.set(J, Array.from(V))
      } else X.push(W);
    else if (X) {
      if (Array.isArray(W)) W.unshift(X);
      else if (B.has(J)) I.set(J, [X, W]);
      if (!G) I.set(J, W)
    } else I.set(J, W)
  }
  let Y = [];
  for (let [J, W] of I)
    if (typeof W === "string") Y.push(`${J}=${W}`);
    else if (Array.isArray(W))
    for (let X of W) Y.push(`${J}=${X}`);
  else Y.push(`${J}=${W}`);
  return Z.search = Y.length ? `?${Y.join("&")}` : "", Z.toString()
}
// @from(Start 7929179, End 7929182)
zn6
// @from(Start 7929188, End 7929316)
BaB = L(() => {
  GqA();
  HA1();
  zn6 = {
    CSV: ",",
    SSV: " ",
    Multi: "Multi",
    TSV: "\t",
    Pipes: "|"
  }
})
// @from(Start 7929322, End 7929325)
GaB
// @from(Start 7929331, End 7929383)
ZaB = L(() => {
  qe();
  GaB = rp("core-client")
})
// @from(Start 7929385, End 7932021)
class CA1 {
  constructor(A = {}) {
    var Q, B;
    if (this._requestContentType = A.requestContentType, this._endpoint = (Q = A.endpoint) !== null && Q !== void 0 ? Q : A.baseUri, A.baseUri) GaB.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
    if (this._allowInsecureConnection = A.allowInsecureConnection, this._httpClient = A.httpClient || tnB(), this.pipeline = A.pipeline || Mn6(A), (B = A.additionalPolicies) === null || B === void 0 ? void 0 : B.length)
      for (let {
          policy: G,
          position: Z
        }
        of A.additionalPolicies) {
        let I = Z === "perRetry" ? "Sign" : void 0;
        this.pipeline.addPolicy(G, {
          afterPhase: I
        })
      }
  }
  async sendRequest(A) {
    return this.pipeline.sendRequest(this._httpClient, A)
  }
  async sendOperationRequest(A, Q) {
    let B = Q.baseUrl || this._endpoint;
    if (!B) throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
    let G = QaB(B, Q, A, this),
      Z = hT({
        url: G
      });
    Z.method = Q.httpMethod;
    let I = kf(Z);
    I.operationSpec = Q, I.operationArguments = A;
    let Y = Q.contentType || this._requestContentType;
    if (Y && Q.requestBody) Z.headers.set("Content-Type", Y);
    let J = A.options;
    if (J) {
      let W = J.requestOptions;
      if (W) {
        if (W.timeout) Z.timeout = W.timeout;
        if (W.onUploadProgress) Z.onUploadProgress = W.onUploadProgress;
        if (W.onDownloadProgress) Z.onDownloadProgress = W.onDownloadProgress;
        if (W.shouldDeserialize !== void 0) I.shouldDeserialize = W.shouldDeserialize;
        if (W.allowInsecureConnection) Z.allowInsecureConnection = !0
      }
      if (J.abortSignal) Z.abortSignal = J.abortSignal;
      if (J.tracingOptions) Z.tracingOptions = J.tracingOptions
    }
    if (this._allowInsecureConnection) Z.allowInsecureConnection = !0;
    if (Z.streamResponseStatusCodes === void 0) Z.streamResponseStatusCodes = nnB(Q);
    try {
      let W = await this.sendRequest(Z),
        X = An1(W, Q.responses[W.status]);
      if (J === null || J === void 0 ? void 0 : J.onResponse) J.onResponse(W, X);
      return X
    } catch (W) {
      if (typeof W === "object" && (W === null || W === void 0 ? void 0 : W.response)) {
        let X = W.response,
          V = An1(X, Q.responses[W.statusCode] || Q.responses.default);
        if (W.details = V, J === null || J === void 0 ? void 0 : J.onResponse) J.onResponse(X, V, W)
      }
      throw W
    }
  }
}
// @from(Start 7932023, End 7932246)
function Mn6(A) {
  let Q = On6(A),
    B = A.credential && Q ? {
      credentialScopes: Q,
      credential: A.credential
    } : void 0;
  return rnB(Object.assign(Object.assign({}, A), {
    credentialOptions: B
  }))
}
// @from(Start 7932248, End 7932642)
function On6(A) {
  if (A.credentialScopes) return A.credentialScopes;
  if (A.endpoint) return `${A.endpoint}/.default`;
  if (A.baseUri) return `${A.baseUri}/.default`;
  if (A.credential && !A.credentialScopes) throw Error("When using credentials, the ServiceClientOptions must contain either a endpoint or a credentialScopes. Unable to create a bearerTokenAuthenticationPolicy");
  return
}
// @from(Start 7932647, End 7932735)
IaB = L(() => {
  _f();
  onB();
  IlB();
  enB();
  GqA();
  BaB();
  HA1();
  ZaB()
})
// @from(Start 7932741, End 7932767)
YaB = L(() => {
  IaB()
})
// @from(Start 7932770, End 7932866)
function JaB(A) {
  if (A === "adfs") return "oauth2/token";
  else return "oauth2/v2.0/token"
}
// @from(Start 7932871, End 7932873)
YY
// @from(Start 7932879, End 7933024)
Yq = L(() => {
  IZA();
  in1();
  YY = AqA({
    namespace: "Microsoft.AAD",
    packageName: "@azure/identity",
    packageVersion: feA
  })
})
// @from(Start 7933027, End 7933265)
function ZqA(A) {
  let Q = "";
  if (Array.isArray(A)) {
    if (A.length !== 1) return;
    Q = A[0]
  } else if (typeof A === "string") Q = A;
  if (!Q.endsWith("/.default")) return Q;
  return Q.substr(0, Q.lastIndexOf("/.default"))
}
// @from(Start 7933267, End 7933730)
function XaB(A) {
  if (typeof A.expires_on === "number") return A.expires_on * 1000;
  if (typeof A.expires_on === "string") {
    let Q = +A.expires_on;
    if (!isNaN(Q)) return Q * 1000;
    let B = Date.parse(A.expires_on);
    if (!isNaN(B)) return B
  }
  if (typeof A.expires_in === "number") return Date.now() + A.expires_in * 1000;
  throw Error(`Failed to parse token expiration from body. expires_in="${A.expires_in}", expires_on="${A.expires_on}"`)
}
// @from(Start 7933732, End 7934132)
function VaB(A) {
  if (A.refresh_on) {
    if (typeof A.refresh_on === "number") return A.refresh_on * 1000;
    if (typeof A.refresh_on === "string") {
      let Q = +A.refresh_on;
      if (!isNaN(Q)) return Q * 1000;
      let B = Date.parse(A.refresh_on);
      if (!isNaN(B)) return B
    }
    throw Error(`Failed to parse refresh_on from body. refresh_on="${A.refresh_on}"`)
  } else return
}
// @from(Start 7934137, End 7934412)
WaB = "Specifying a `clientId` or `resourceId` is not supported by the Service Fabric managed identity environment. The managed identity configuration is determined by the Service Fabric cluster resource configuration. See https://aka.ms/servicefabricmi for more information"
// @from(Start 7934415, End 7934627)
function Rn6(A) {
  let Q = A === null || A === void 0 ? void 0 : A.authorityHost;
  if (XA1) Q = Q !== null && Q !== void 0 ? Q : process.env.AZURE_AUTHORITY_HOST;
  return Q !== null && Q !== void 0 ? Q : uwA
}
// @from(Start 7934632, End 7934655)
IqA = "noCorrelationId"
// @from(Start 7934659, End 7934662)
UZA
// @from(Start 7934668, End 7941054)
tn1 = L(() => {
  YaB();
  tp();
  _f();
  DE();
  IZA();
  Yq();
  jW();
  UZA = class UZA extends CA1 {
    constructor(A) {
      var Q, B;
      let G = `azsdk-js-identity/${feA}`,
        Z = ((Q = A === null || A === void 0 ? void 0 : A.userAgentOptions) === null || Q === void 0 ? void 0 : Q.userAgentPrefix) ? `${A.userAgentOptions.userAgentPrefix} ${G}` : `${G}`,
        I = Rn6(A);
      if (!I.startsWith("https:")) throw Error("The authorityHost address must use the 'https' protocol.");
      super(Object.assign(Object.assign({
        requestContentType: "application/json; charset=utf-8",
        retryOptions: {
          maxRetries: 3
        }
      }, A), {
        userAgentOptions: {
          userAgentPrefix: Z
        },
        baseUri: I
      }));
      if (this.allowInsecureConnection = !1, this.authorityHost = I, this.abortControllers = new Map, this.allowLoggingAccountIdentifiers = (B = A === null || A === void 0 ? void 0 : A.loggingOptions) === null || B === void 0 ? void 0 : B.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = Object.assign({}, A), A === null || A === void 0 ? void 0 : A.allowInsecureConnection) this.allowInsecureConnection = A.allowInsecureConnection
    }
    async sendTokenRequest(A) {
      RM.info(`IdentityClient: sending token request to [${A.url}]`);
      let Q = await this.sendRequest(A);
      if (Q.bodyAsText && (Q.status === 200 || Q.status === 201)) {
        let B = JSON.parse(Q.bodyAsText);
        if (!B.access_token) return null;
        this.logIdentifiers(Q);
        let G = {
          accessToken: {
            token: B.access_token,
            expiresOnTimestamp: XaB(B),
            refreshAfterTimestamp: VaB(B),
            tokenType: "Bearer"
          },
          refreshToken: B.refresh_token
        };
        return RM.info(`IdentityClient: [${A.url}] token acquired, expires on ${G.accessToken.expiresOnTimestamp}`), G
      } else {
        let B = new mwA(Q.status, Q.bodyAsText);
        throw RM.warning(`IdentityClient: authentication error. HTTP status: ${Q.status}, ${B.errorResponse.errorDescription}`), B
      }
    }
    async refreshAccessToken(A, Q, B, G, Z, I = {}) {
      if (G === void 0) return null;
      RM.info(`IdentityClient: refreshing access token with client ID: ${Q}, scopes: ${B} started`);
      let Y = {
        grant_type: "refresh_token",
        client_id: Q,
        refresh_token: G,
        scope: B
      };
      if (Z !== void 0) Y.client_secret = Z;
      let J = new URLSearchParams(Y);
      return YY.withSpan("IdentityClient.refreshAccessToken", I, async (W) => {
        try {
          let X = JaB(A),
            V = hT({
              url: `${this.authorityHost}/${A}/${X}`,
              method: "POST",
              body: J.toString(),
              abortSignal: I.abortSignal,
              headers: Me({
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
              }),
              tracingOptions: W.tracingOptions
            }),
            F = await this.sendTokenRequest(V);
          return RM.info(`IdentityClient: refreshed token for client ID: ${Q}`), F
        } catch (X) {
          if (X.name === oi1 && X.errorResponse.error === "interaction_required") return RM.info(`IdentityClient: interaction required for client ID: ${Q}`), null;
          else throw RM.warning(`IdentityClient: failed refreshing token for client ID: ${Q}: ${X}`), X
        }
      })
    }
    generateAbortSignal(A) {
      let Q = new AbortController,
        B = this.abortControllers.get(A) || [];
      B.push(Q), this.abortControllers.set(A, B);
      let G = Q.signal.onabort;
      return Q.signal.onabort = (...Z) => {
        if (this.abortControllers.set(A, void 0), G) G.apply(Q.signal, Z)
      }, Q.signal
    }
    abortRequests(A) {
      let Q = A || IqA,
        B = [...this.abortControllers.get(Q) || [], ...this.abortControllers.get(IqA) || []];
      if (!B.length) return;
      for (let G of B) G.abort();
      this.abortControllers.set(Q, void 0)
    }
    getCorrelationId(A) {
      var Q;
      let B = (Q = A === null || A === void 0 ? void 0 : A.body) === null || Q === void 0 ? void 0 : Q.split("&").map((G) => G.split("=")).find(([G]) => G === "client-request-id");
      return B && B.length ? B[1] || IqA : IqA
    }
    async sendGetRequestAsync(A, Q) {
      let B = hT({
          url: A,
          method: "GET",
          body: Q === null || Q === void 0 ? void 0 : Q.body,
          allowInsecureConnection: this.allowInsecureConnection,
          headers: Me(Q === null || Q === void 0 ? void 0 : Q.headers),
          abortSignal: this.generateAbortSignal(IqA)
        }),
        G = await this.sendRequest(B);
      return this.logIdentifiers(G), {
        body: G.bodyAsText ? JSON.parse(G.bodyAsText) : void 0,
        headers: G.headers.toJSON(),
        status: G.status
      }
    }
    async sendPostRequestAsync(A, Q) {
      let B = hT({
          url: A,
          method: "POST",
          body: Q === null || Q === void 0 ? void 0 : Q.body,
          headers: Me(Q === null || Q === void 0 ? void 0 : Q.headers),
          allowInsecureConnection: this.allowInsecureConnection,
          abortSignal: this.generateAbortSignal(this.getCorrelationId(Q))
        }),
        G = await this.sendRequest(B);
      return this.logIdentifiers(G), {
        body: G.bodyAsText ? JSON.parse(G.bodyAsText) : void 0,
        headers: G.headers.toJSON(),
        status: G.status
      }
    }
    getTokenCredentialOptions() {
      return this.tokenCredentialOptions
    }
    logIdentifiers(A) {
      if (!this.allowLoggingAccountIdentifiers || !A.bodyAsText) return;
      let Q = "No User Principal Name available";
      try {
        let G = (A.parsedBody || JSON.parse(A.bodyAsText)).access_token;
        if (!G) return;
        let Z = G.split(".")[1],
          {
            appid: I,
            upn: Y,
            tid: J,
            oid: W
          } = JSON.parse(Buffer.from(Z, "base64").toString("utf8"));
        RM.info(`[Authenticated account] Client ID: ${I}. Tenant ID: ${J}. User Principal Name: ${Y||Q}. Object ID (user): ${W}`)
      } catch (B) {
        RM.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", B.message)
      }
    }
  }
})
// @from(Start 7941060, End 7941074)
FaB = () => {}
// @from(Start 7941076, End 7943873)
class Oe {
  static serializeJSONBlob(A) {
    return JSON.stringify(A)
  }
  static serializeAccounts(A) {
    let Q = {};
    return Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        home_account_id: G.homeAccountId,
        environment: G.environment,
        realm: G.realm,
        local_account_id: G.localAccountId,
        username: G.username,
        authority_type: G.authorityType,
        name: G.name,
        client_info: G.clientInfo,
        last_modification_time: G.lastModificationTime,
        last_modification_app: G.lastModificationApp,
        tenantProfiles: G.tenantProfiles?.map((Z) => {
          return JSON.stringify(Z)
        })
      }
    }), Q
  }
  static serializeIdTokens(A) {
    let Q = {};
    return Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        home_account_id: G.homeAccountId,
        environment: G.environment,
        credential_type: G.credentialType,
        client_id: G.clientId,
        secret: G.secret,
        realm: G.realm
      }
    }), Q
  }
  static serializeAccessTokens(A) {
    let Q = {};
    return Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        home_account_id: G.homeAccountId,
        environment: G.environment,
        credential_type: G.credentialType,
        client_id: G.clientId,
        secret: G.secret,
        realm: G.realm,
        target: G.target,
        cached_at: G.cachedAt,
        expires_on: G.expiresOn,
        extended_expires_on: G.extendedExpiresOn,
        refresh_on: G.refreshOn,
        key_id: G.keyId,
        token_type: G.tokenType,
        requestedClaims: G.requestedClaims,
        requestedClaimsHash: G.requestedClaimsHash,
        userAssertionHash: G.userAssertionHash
      }
    }), Q
  }
  static serializeRefreshTokens(A) {
    let Q = {};
    return Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        home_account_id: G.homeAccountId,
        environment: G.environment,
        credential_type: G.credentialType,
        client_id: G.clientId,
        secret: G.secret,
        family_id: G.familyId,
        target: G.target,
        realm: G.realm
      }
    }), Q
  }
  static serializeAppMetadata(A) {
    let Q = {};
    return Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        client_id: G.clientId,
        environment: G.environment,
        family_id: G.familyId
      }
    }), Q
  }
  static serializeAllCache(A) {
    return {
      Account: this.serializeAccounts(A.accounts),
      IdToken: this.serializeIdTokens(A.idTokens),
      AccessToken: this.serializeAccessTokens(A.accessTokens),
      RefreshToken: this.serializeRefreshTokens(A.refreshTokens),
      AppMetadata: this.serializeAppMetadata(A.appMetadata)
    }
  }
}
// @from(Start 7943878, End 7943940)
EA1 = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 7943946, End 7943948)
L0
// @from(Start 7943950, End 7943952)
o4
// @from(Start 7943954, End 7943956)
nH
// @from(Start 7943958, End 7943961)
en1
// @from(Start 7943963, End 7943965)
uZ
// @from(Start 7943967, End 7943969)
MU
// @from(Start 7943971, End 7943973)
Re
// @from(Start 7943975, End 7943977)
Al
// @from(Start 7943979, End 7943982)
zA1
// @from(Start 7943984, End 7943987)
$ZA
// @from(Start 7943989, End 7943991)
Wk
// @from(Start 7943993, End 7943995)
OU
// @from(Start 7943997, End 7943999)
Te
// @from(Start 7944001, End 7944003)
yf
// @from(Start 7944005, End 7944007)
c7
// @from(Start 7944009, End 7944028)
YqA = "appmetadata"
// @from(Start 7944032, End 7944051)
KaB = "client_info"
// @from(Start 7944055, End 7944063)
Ql = "1"
// @from(Start 7944067, End 7944070)
wZA
// @from(Start 7944072, End 7944074)
CE
// @from(Start 7944076, End 7944078)
_V
// @from(Start 7944080, End 7944082)
A5
// @from(Start 7944084, End 7944086)
Xk
// @from(Start 7944088, End 7944091)
JqA
// @from(Start 7944093, End 7944096)
WqA
// @from(Start 7944098, End 7944100)
Pe
// @from(Start 7944102, End 7944105)
UA1
// @from(Start 7944107, End 7944109)
FZ
// @from(Start 7944111, End 7944120)
qZA = 300
// @from(Start 7944124, End 7944126)
MD
// @from(Start 7944132, End 7949403)
mZ = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */
  L0 = {
    LIBRARY_NAME: "MSAL.JS",
    SKU: "msal.js.common",
    DEFAULT_AUTHORITY: "https://login.microsoftonline.com/common/",
    DEFAULT_AUTHORITY_HOST: "login.microsoftonline.com",
    DEFAULT_COMMON_TENANT: "common",
    ADFS: "adfs",
    DSTS: "dstsv2",
    AAD_INSTANCE_DISCOVERY_ENDPT: "https://login.microsoftonline.com/common/discovery/instance?api-version=1.1&authorization_endpoint=",
    CIAM_AUTH_URL: ".ciamlogin.com",
    AAD_TENANT_DOMAIN_SUFFIX: ".onmicrosoft.com",
    RESOURCE_DELIM: "|",
    NO_ACCOUNT: "NO_ACCOUNT",
    CLAIMS: "claims",
    CONSUMER_UTID: "9188040d-6c67-4c5b-b112-36a304b66dad",
    OPENID_SCOPE: "openid",
    PROFILE_SCOPE: "profile",
    OFFLINE_ACCESS_SCOPE: "offline_access",
    EMAIL_SCOPE: "email",
    CODE_GRANT_TYPE: "authorization_code",
    RT_GRANT_TYPE: "refresh_token",
    S256_CODE_CHALLENGE_METHOD: "S256",
    URL_FORM_CONTENT_TYPE: "application/x-www-form-urlencoded;charset=utf-8",
    AUTHORIZATION_PENDING: "authorization_pending",
    NOT_DEFINED: "not_defined",
    EMPTY_STRING: "",
    NOT_APPLICABLE: "N/A",
    NOT_AVAILABLE: "Not Available",
    FORWARD_SLASH: "/",
    IMDS_ENDPOINT: "http://169.254.169.254/metadata/instance/compute/location",
    IMDS_VERSION: "2020-06-01",
    IMDS_TIMEOUT: 2000,
    AZURE_REGION_AUTO_DISCOVER_FLAG: "TryAutoDetect",
    REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX: "login.microsoft.com",
    KNOWN_PUBLIC_CLOUDS: ["login.microsoftonline.com", "login.windows.net", "login.microsoft.com", "sts.windows.net"],
    SHR_NONCE_VALIDITY: 240,
    INVALID_INSTANCE: "invalid_instance"
  }, o4 = {
    SUCCESS: 200,
    SUCCESS_RANGE_START: 200,
    SUCCESS_RANGE_END: 299,
    REDIRECT: 302,
    CLIENT_ERROR: 400,
    CLIENT_ERROR_RANGE_START: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    REQUEST_TIMEOUT: 408,
    GONE: 410,
    TOO_MANY_REQUESTS: 429,
    CLIENT_ERROR_RANGE_END: 499,
    SERVER_ERROR: 500,
    SERVER_ERROR_RANGE_START: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    SERVER_ERROR_RANGE_END: 599,
    MULTI_SIDED_ERROR: 600
  }, nH = [L0.OPENID_SCOPE, L0.PROFILE_SCOPE, L0.OFFLINE_ACCESS_SCOPE], en1 = [...nH, L0.EMAIL_SCOPE], uZ = {
    CONTENT_TYPE: "Content-Type",
    CONTENT_LENGTH: "Content-Length",
    RETRY_AFTER: "Retry-After",
    CCS_HEADER: "X-AnchorMailbox",
    WWWAuthenticate: "WWW-Authenticate",
    AuthenticationInfo: "Authentication-Info",
    X_MS_REQUEST_ID: "x-ms-request-id",
    X_MS_HTTP_VERSION: "x-ms-httpver"
  }, MU = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",
    CONSUMERS: "consumers"
  }, Re = {
    ACCESS_TOKEN: "access_token",
    XMS_CC: "xms_cc"
  }, Al = {
    LOGIN: "login",
    SELECT_ACCOUNT: "select_account",
    CONSENT: "consent",
    NONE: "none",
    CREATE: "create",
    NO_SESSION: "no_session"
  }, zA1 = {
    PLAIN: "plain",
    S256: "S256"
  }, $ZA = {
    CODE: "code",
    IDTOKEN_TOKEN: "id_token token",
    IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
  }, Wk = {
    QUERY: "query",
    FRAGMENT: "fragment",
    FORM_POST: "form_post"
  }, OU = {
    IMPLICIT_GRANT: "implicit",
    AUTHORIZATION_CODE_GRANT: "authorization_code",
    CLIENT_CREDENTIALS_GRANT: "client_credentials",
    RESOURCE_OWNER_PASSWORD_GRANT: "password",
    REFRESH_TOKEN_GRANT: "refresh_token",
    DEVICE_CODE_GRANT: "device_code",
    JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
  }, Te = {
    MSSTS_ACCOUNT_TYPE: "MSSTS",
    ADFS_ACCOUNT_TYPE: "ADFS",
    MSAV1_ACCOUNT_TYPE: "MSA",
    GENERIC_ACCOUNT_TYPE: "Generic"
  }, yf = {
    CACHE_KEY_SEPARATOR: "-",
    CLIENT_INFO_SEPARATOR: "."
  }, c7 = {
    ID_TOKEN: "IdToken",
    ACCESS_TOKEN: "AccessToken",
    ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
    REFRESH_TOKEN: "RefreshToken"
  }, wZA = {
    CACHE_KEY: "authority-metadata",
    REFRESH_TIME_SECONDS: 86400
  }, CE = {
    CONFIG: "config",
    CACHE: "cache",
    NETWORK: "network",
    HARDCODED_VALUES: "hardcoded_values"
  }, _V = {
    SCHEMA_VERSION: 5,
    MAX_LAST_HEADER_BYTES: 330,
    MAX_CACHED_ERRORS: 50,
    CACHE_KEY: "server-telemetry",
    CATEGORY_SEPARATOR: "|",
    VALUE_SEPARATOR: ",",
    OVERFLOW_TRUE: "1",
    OVERFLOW_FALSE: "0",
    UNKNOWN_ERROR: "unknown_error"
  }, A5 = {
    BEARER: "Bearer",
    POP: "pop",
    SSH: "ssh-cert"
  }, Xk = {
    DEFAULT_THROTTLE_TIME_SECONDS: 60,
    DEFAULT_MAX_THROTTLE_TIME_SECONDS: 3600,
    THROTTLING_PREFIX: "throttling",
    X_MS_LIB_CAPABILITY_VALUE: "retry-after, h429"
  }, JqA = {
    INVALID_GRANT_ERROR: "invalid_grant",
    CLIENT_MISMATCH_ERROR: "client_mismatch"
  }, WqA = {
    username: "username",
    password: "password"
  }, Pe = {
    FAILED_AUTO_DETECTION: "1",
    INTERNAL_CACHE: "2",
    ENVIRONMENT_VARIABLE: "3",
    IMDS: "4"
  }, UA1 = {
    CONFIGURED_NO_AUTO_DETECTION: "2",
    AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
    AUTO_DETECTION_REQUESTED_FAILED: "5"
  }, FZ = {
    NOT_APPLICABLE: "0",
    FORCE_REFRESH_OR_CLAIMS: "1",
    NO_CACHED_ACCESS_TOKEN: "2",
    CACHED_ACCESS_TOKEN_EXPIRED: "3",
    PROACTIVELY_REFRESHED: "4"
  }, MD = {
    BASE64: "base64",
    HEX: "hex",
    UTF8: "utf-8"
  }
})
// @from(Start 7949409, End 7949417)
NZA = {}
// @from(Start 7949498, End 7949522)
XqA = "unexpected_error"
// @from(Start 7949526, End 7949553)
VqA = "post_request_failed"
// @from(Start 7949559, End 7949625)
Aa1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7949628, End 7949700)
function Ba1(A, Q) {
  return new t4(A, Q ? `${$A1[A]} ${Q}` : $A1[A])
}
// @from(Start 7949705, End 7949708)
$A1
// @from(Start 7949710, End 7949713)
Qa1
// @from(Start 7949715, End 7949717)
t4
// @from(Start 7949723, End 7950538)
PM = L(() => {
  mZ();
  Aa1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  $A1 = {
    [XqA]: "Unexpected error in authentication.",
    [VqA]: "Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."
  }, Qa1 = {
    unexpectedError: {
      code: XqA,
      desc: $A1[XqA]
    },
    postRequestFailed: {
      code: VqA,
      desc: $A1[VqA]
    }
  };
  t4 = class t4 extends Error {
    constructor(A, Q, B) {
      let G = Q ? `${A}: ${Q}` : A;
      super(G);
      Object.setPrototypeOf(this, t4.prototype), this.errorCode = A || L0.EMPTY_STRING, this.errorMessage = Q || L0.EMPTY_STRING, this.subError = B || L0.EMPTY_STRING, this.name = "AuthError"
    }
    setCorrelationId(A) {
      this.correlationId = A
    }
  }
})
// @from(Start 7950544, End 7950551)
fG = {}
// @from(Start 7952079, End 7952112)
Bl = "client_info_decoding_error"
// @from(Start 7952116, End 7952146)
je = "client_info_empty_error"
// @from(Start 7952150, End 7952176)
Gl = "token_parsing_error"
// @from(Start 7952180, End 7952206)
Se = "null_or_empty_token"
// @from(Start 7952210, End 7952243)
EE = "endpoints_resolution_error"
// @from(Start 7952247, End 7952267)
_e = "network_error"
// @from(Start 7952271, End 7952297)
ke = "openid_config_error"
// @from(Start 7952301, End 7952329)
ye = "hash_not_deserialized"
// @from(Start 7952333, End 7952353)
gT = "invalid_state"
// @from(Start 7952357, End 7952378)
xe = "state_mismatch"
// @from(Start 7952382, End 7952404)
Zl = "state_not_found"
// @from(Start 7952408, End 7952429)
ve = "nonce_mismatch"
// @from(Start 7952433, End 7952459)
xf = "auth_time_not_found"
// @from(Start 7952463, End 7952488)
be = "max_age_transpired"
// @from(Start 7952492, End 7952524)
FqA = "multiple_matching_tokens"
// @from(Start 7952528, End 7952562)
KqA = "multiple_matching_accounts"
// @from(Start 7952566, End 7952602)
fe = "multiple_matching_appMetadata"
// @from(Start 7952606, End 7952635)
he = "request_cannot_be_made"
// @from(Start 7952639, End 7952671)
ge = "cannot_remove_empty_scope"
// @from(Start 7952675, End 7952704)
ue = "cannot_append_scopeset"
// @from(Start 7952708, End 7952735)
Il = "empty_input_scopeset"
// @from(Start 7952739, End 7952776)
DqA = "device_code_polling_cancelled"
// @from(Start 7952780, End 7952807)
HqA = "device_code_expired"
// @from(Start 7952811, End 7952844)
CqA = "device_code_unknown_error"
// @from(Start 7952848, End 7952883)
vf = "no_account_in_silent_request"
// @from(Start 7952887, End 7952914)
me = "invalid_cache_record"
// @from(Start 7952918, End 7952950)
bf = "invalid_cache_environment"
// @from(Start 7952954, End 7952978)
EqA = "no_account_found"
// @from(Start 7952982, End 7953005)
Yl = "no_crypto_object"
// @from(Start 7953009, End 7953043)
zqA = "unexpected_credential_type"
// @from(Start 7953047, End 7953072)
UqA = "invalid_assertion"
// @from(Start 7953076, End 7953109)
$qA = "invalid_client_credential"
// @from(Start 7953113, End 7953142)
ff = "token_refresh_required"
// @from(Start 7953146, End 7953174)
wqA = "user_timeout_reached"
// @from(Start 7953178, End 7953224)
de = "token_claims_cnf_required_for_signedjwt"
// @from(Start 7953228, End 7953282)
ce = "authorization_code_missing_from_server_response"
// @from(Start 7953286, End 7953317)
qqA = "binding_key_not_removed"
// @from(Start 7953321, End 7953362)
pe = "end_session_endpoint_not_supported"
// @from(Start 7953366, End 7953387)
le = "key_id_missing"
// @from(Start 7953391, End 7953422)
NqA = "no_network_connectivity"
// @from(Start 7953426, End 7953447)
LqA = "user_canceled"
// @from(Start 7953451, End 7953482)
MqA = "missing_tenant_id_error"
// @from(Start 7953486, End 7953515)
l8 = "method_not_implemented"
// @from(Start 7953519, End 7953558)
OqA = "nested_app_auth_bridge_disabled"
// @from(Start 7953564, End 7953629)
SW = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 7953632, End 7953675)
function b0(A, Q) {
  return new Jl(A, Q)
}
// @from(Start 7953680, End 7953682)
e4
// @from(Start 7953684, End 7953687)
Ga1
// @from(Start 7953689, End 7953691)
Jl
// @from(Start 7953697, End 7960621)
dX = L(() => {
  PM();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  e4 = {
    [Bl]: "The client info could not be parsed/decoded correctly",
    [je]: "The client info was empty",
    [Gl]: "Token cannot be parsed",
    [Se]: "The token is null or empty",
    [EE]: "Endpoints cannot be resolved",
    [_e]: "Network request failed",
    [ke]: "Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",
    [ye]: "The hash parameters could not be deserialized",
    [gT]: "State was not the expected format",
    [xe]: "State mismatch error",
    [Zl]: "State not found",
    [ve]: "Nonce mismatch error",
    [xf]: "Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",
    [be]: "Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",
    [FqA]: "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",
    [KqA]: "The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",
    [fe]: "The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",
    [he]: "Token request cannot be made without authorization code or refresh token.",
    [ge]: "Cannot remove null or empty scope from ScopeSet",
    [ue]: "Cannot append ScopeSet",
    [Il]: "Empty input ScopeSet cannot be processed",
    [DqA]: "Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",
    [HqA]: "Device code is expired.",
    [CqA]: "Device code stopped polling for unknown reasons.",
    [vf]: "Please pass an account object, silent flow is not supported without account information",
    [me]: "Cache record object was null or undefined.",
    [bf]: "Invalid environment when attempting to create cache entry",
    [EqA]: "No account found in cache for given key.",
    [Yl]: "No crypto object detected.",
    [zqA]: "Unexpected credential type.",
    [UqA]: "Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",
    [$qA]: "Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",
    [ff]: "Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",
    [wqA]: "User defined timeout for device code polling reached",
    [de]: "Cannot generate a POP jwt if the token_claims are not populated",
    [ce]: "Server response does not contain an authorization code to proceed",
    [qqA]: "Could not remove the credential's binding key from storage.",
    [pe]: "The provided authority does not support logout",
    [le]: "A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",
    [NqA]: "No network connectivity. Check your internet connection.",
    [LqA]: "User cancelled the flow.",
    [MqA]: "A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",
    [l8]: "This method has not been implemented",
    [OqA]: "The nested app auth bridge is disabled"
  }, Ga1 = {
    clientInfoDecodingError: {
      code: Bl,
      desc: e4[Bl]
    },
    clientInfoEmptyError: {
      code: je,
      desc: e4[je]
    },
    tokenParsingError: {
      code: Gl,
      desc: e4[Gl]
    },
    nullOrEmptyToken: {
      code: Se,
      desc: e4[Se]
    },
    endpointResolutionError: {
      code: EE,
      desc: e4[EE]
    },
    networkError: {
      code: _e,
      desc: e4[_e]
    },
    unableToGetOpenidConfigError: {
      code: ke,
      desc: e4[ke]
    },
    hashNotDeserialized: {
      code: ye,
      desc: e4[ye]
    },
    invalidStateError: {
      code: gT,
      desc: e4[gT]
    },
    stateMismatchError: {
      code: xe,
      desc: e4[xe]
    },
    stateNotFoundError: {
      code: Zl,
      desc: e4[Zl]
    },
    nonceMismatchError: {
      code: ve,
      desc: e4[ve]
    },
    authTimeNotFoundError: {
      code: xf,
      desc: e4[xf]
    },
    maxAgeTranspired: {
      code: be,
      desc: e4[be]
    },
    multipleMatchingTokens: {
      code: FqA,
      desc: e4[FqA]
    },
    multipleMatchingAccounts: {
      code: KqA,
      desc: e4[KqA]
    },
    multipleMatchingAppMetadata: {
      code: fe,
      desc: e4[fe]
    },
    tokenRequestCannotBeMade: {
      code: he,
      desc: e4[he]
    },
    removeEmptyScopeError: {
      code: ge,
      desc: e4[ge]
    },
    appendScopeSetError: {
      code: ue,
      desc: e4[ue]
    },
    emptyInputScopeSetError: {
      code: Il,
      desc: e4[Il]
    },
    DeviceCodePollingCancelled: {
      code: DqA,
      desc: e4[DqA]
    },
    DeviceCodeExpired: {
      code: HqA,
      desc: e4[HqA]
    },
    DeviceCodeUnknownError: {
      code: CqA,
      desc: e4[CqA]
    },
    NoAccountInSilentRequest: {
      code: vf,
      desc: e4[vf]
    },
    invalidCacheRecord: {
      code: me,
      desc: e4[me]
    },
    invalidCacheEnvironment: {
      code: bf,
      desc: e4[bf]
    },
    noAccountFound: {
      code: EqA,
      desc: e4[EqA]
    },
    noCryptoObj: {
      code: Yl,
      desc: e4[Yl]
    },
    unexpectedCredentialType: {
      code: zqA,
      desc: e4[zqA]
    },
    invalidAssertion: {
      code: UqA,
      desc: e4[UqA]
    },
    invalidClientCredential: {
      code: $qA,
      desc: e4[$qA]
    },
    tokenRefreshRequired: {
      code: ff,
      desc: e4[ff]
    },
    userTimeoutReached: {
      code: wqA,
      desc: e4[wqA]
    },
    tokenClaimsRequired: {
      code: de,
      desc: e4[de]
    },
    noAuthorizationCodeFromServer: {
      code: ce,
      desc: e4[ce]
    },
    bindingKeyNotRemovedError: {
      code: qqA,
      desc: e4[qqA]
    },
    logoutNotSupported: {
      code: pe,
      desc: e4[pe]
    },
    keyIdMissing: {
      code: le,
      desc: e4[le]
    },
    noNetworkConnectivity: {
      code: NqA,
      desc: e4[NqA]
    },
    userCanceledError: {
      code: LqA,
      desc: e4[LqA]
    },
    missingTenantIdError: {
      code: MqA,
      desc: e4[MqA]
    },
    nestedAppAuthBridgeDisabled: {
      code: OqA,
      desc: e4[OqA]
    }
  };
  Jl = class Jl extends t4 {
    constructor(A, Q) {
      super(A, Q ? `${e4[A]}: ${Q}` : e4[A]);
      this.name = "ClientAuthError", Object.setPrototypeOf(this, Jl.prototype)
    }
  }
})
// @from(Start 7960627, End 7960630)
LZA
// @from(Start 7960636, End 7961268)
Za1 = L(() => {
  dX();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  LZA = {
    createNewGuid: () => {
      throw b0(l8)
    },
    base64Decode: () => {
      throw b0(l8)
    },
    base64Encode: () => {
      throw b0(l8)
    },
    base64UrlEncode: () => {
      throw b0(l8)
    },
    encodeKid: () => {
      throw b0(l8)
    },
    async getPublicKeyThumbprint() {
      throw b0(l8)
    },
    async removeTokenBindingKey() {
      throw b0(l8)
    },
    async clearKeystore() {
      throw b0(l8)
    },
    async signJwt() {
      throw b0(l8)
    },
    async hashString() {
      throw b0(l8)
    }
  }
})
// @from(Start 8040421, End 8058833)
class kV {
  constructor(A, Q, B, G, Z, I, Y, J) {
    this.canonicalAuthority = A, this._canonicalAuthority.validateAsUri(), this.networkInterface = Q, this.cacheManager = B, this.authorityOptions = G, this.regionDiscoveryMetadata = {
      region_used: void 0,
      region_source: void 0,
      region_outcome: void 0
    }, this.logger = Z, this.performanceClient = Y, this.correlationId = I, this.managedIdentity = J || !1, this.regionDiscovery = new BNA(Q, this.logger, this.performanceClient, this.correlationId)
  }
  getAuthorityType(A) {
    if (A.HostNameAndPort.endsWith(L0.CIAM_AUTH_URL)) return jM.Ciam;
    let Q = A.PathSegments;
    if (Q.length) switch (Q[0].toLowerCase()) {
      case L0.ADFS:
        return jM.Adfs;
      case L0.DSTS:
        return jM.Dsts
    }
    return jM.Default
  }
  get authorityType() {
    return this.getAuthorityType(this.canonicalAuthorityUrlComponents)
  }
  get protocolMode() {
    return this.authorityOptions.protocolMode
  }
  get options() {
    return this.authorityOptions
  }
  get canonicalAuthority() {
    return this._canonicalAuthority.urlString
  }
  set canonicalAuthority(A) {
    this._canonicalAuthority = new w8(A), this._canonicalAuthority.validateAsUri(), this._canonicalAuthorityUrlComponents = null
  }
  get canonicalAuthorityUrlComponents() {
    if (!this._canonicalAuthorityUrlComponents) this._canonicalAuthorityUrlComponents = this._canonicalAuthority.getUrlComponents();
    return this._canonicalAuthorityUrlComponents
  }
  get hostnameAndPort() {
    return this.canonicalAuthorityUrlComponents.HostNameAndPort.toLowerCase()
  }
  get tenant() {
    return this.canonicalAuthorityUrlComponents.PathSegments[0]
  }
  get authorizationEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.authorization_endpoint);
    else throw b0(EE)
  }
  get tokenEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint);
    else throw b0(EE)
  }
  get deviceCodeEndpoint() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.token_endpoint.replace("/token", "/devicecode"));
    else throw b0(EE)
  }
  get endSessionEndpoint() {
    if (this.discoveryComplete()) {
      if (!this.metadata.end_session_endpoint) throw b0(pe);
      return this.replacePath(this.metadata.end_session_endpoint)
    } else throw b0(EE)
  }
  get selfSignedJwtAudience() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.issuer);
    else throw b0(EE)
  }
  get jwksUri() {
    if (this.discoveryComplete()) return this.replacePath(this.metadata.jwks_uri);
    else throw b0(EE)
  }
  canReplaceTenant(A) {
    return A.PathSegments.length === 1 && !kV.reservedTenantDomains.has(A.PathSegments[0]) && this.getAuthorityType(A) === jM.Default && this.protocolMode !== aH.OIDC
  }
  replaceTenant(A) {
    return A.replace(/{tenant}|{tenantid}/g, this.tenant)
  }
  replacePath(A) {
    let Q = A,
      G = new w8(this.metadata.canonical_authority).getUrlComponents(),
      Z = G.PathSegments;
    return this.canonicalAuthorityUrlComponents.PathSegments.forEach((Y, J) => {
      let W = Z[J];
      if (J === 0 && this.canReplaceTenant(G)) {
        let X = new w8(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];
        if (W !== X) this.logger.verbose(`Replacing tenant domain name ${W} with id ${X}`), W = X
      }
      if (Y !== W) Q = Q.replace(`/${W}/`, `/${Y}/`)
    }), this.replaceTenant(Q)
  }
  get defaultOpenIdConfigurationEndpoint() {
    let A = this.hostnameAndPort;
    if (this.canonicalAuthority.endsWith("v2.0/") || this.authorityType === jM.Adfs || this.protocolMode === aH.OIDC && !this.isAliasOfKnownMicrosoftAuthority(A)) return `${this.canonicalAuthority}.well-known/openid-configuration`;
    return `${this.canonicalAuthority}v2.0/.well-known/openid-configuration`
  }
  discoveryComplete() {
    return !!this.metadata
  }
  async resolveEndpointsAsync() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityResolveEndpointsAsync, this.correlationId);
    let A = this.getCurrentMetadataEntity(),
      Q = await _5(this.updateCloudDiscoveryMetadata.bind(this), Z0.AuthorityUpdateCloudDiscoveryMetadata, this.logger, this.performanceClient, this.correlationId)(A);
    this.canonicalAuthority = this.canonicalAuthority.replace(this.hostnameAndPort, A.preferred_network);
    let B = await _5(this.updateEndpointMetadata.bind(this), Z0.AuthorityUpdateEndpointMetadata, this.logger, this.performanceClient, this.correlationId)(A);
    this.updateCachedMetadata(A, Q, {
      source: B
    }), this.performanceClient?.addFields({
      cloudDiscoverySource: Q,
      authorityEndpointSource: B
    }, this.correlationId)
  }
  getCurrentMetadataEntity() {
    let A = this.cacheManager.getAuthorityMetadataByAlias(this.hostnameAndPort);
    if (!A) A = {
      aliases: [],
      preferred_cache: this.hostnameAndPort,
      preferred_network: this.hostnameAndPort,
      canonical_authority: this.canonicalAuthority,
      authorization_endpoint: "",
      token_endpoint: "",
      end_session_endpoint: "",
      issuer: "",
      aliasesFromNetwork: !1,
      endpointsFromNetwork: !1,
      expiresAt: uA1(),
      jwks_uri: ""
    };
    return A
  }
  updateCachedMetadata(A, Q, B) {
    if (Q !== CE.CACHE && B?.source !== CE.CACHE) A.expiresAt = uA1(), A.canonical_authority = this.canonicalAuthority;
    let G = this.cacheManager.generateAuthorityMetadataCacheKey(A.preferred_cache);
    this.cacheManager.setAuthorityMetadata(G, A), this.metadata = A
  }
  async updateEndpointMetadata(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateEndpointMetadata, this.correlationId);
    let Q = this.updateEndpointMetadataFromLocalSources(A);
    if (Q) {
      if (Q.source === CE.HARDCODED_VALUES) {
        if (this.authorityOptions.azureRegionConfiguration?.azureRegion) {
          if (Q.metadata) {
            let G = await _5(this.updateMetadataWithRegionalInformation.bind(this), Z0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(Q.metadata);
            bZA(A, G, !1), A.canonical_authority = this.canonicalAuthority
          }
        }
      }
      return Q.source
    }
    let B = await _5(this.getEndpointMetadataFromNetwork.bind(this), Z0.AuthorityGetEndpointMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) {
      if (this.authorityOptions.azureRegionConfiguration?.azureRegion) B = await _5(this.updateMetadataWithRegionalInformation.bind(this), Z0.AuthorityUpdateMetadataWithRegionalInformation, this.logger, this.performanceClient, this.correlationId)(B);
      return bZA(A, B, !0), CE.NETWORK
    } else throw b0(ke, this.defaultOpenIdConfigurationEndpoint)
  }
  updateEndpointMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get endpoint metadata from authority configuration");
    let Q = this.getEndpointMetadataFromConfig();
    if (Q) return this.logger.verbose("Found endpoint metadata in authority configuration"), bZA(A, Q, !1), {
      source: CE.CONFIG
    };
    if (this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."), this.authorityOptions.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");
    else {
      let G = this.getEndpointMetadataFromHardcodedValues();
      if (G) return bZA(A, G, !1), {
        source: CE.HARDCODED_VALUES,
        metadata: G
      };
      else this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")
    }
    let B = mA1(A);
    if (this.isAuthoritySameType(A) && A.endpointsFromNetwork && !B) return this.logger.verbose("Found endpoint metadata in the cache."), {
      source: CE.CACHE
    };
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  isAuthoritySameType(A) {
    return new w8(A.canonical_authority).getUrlComponents().PathSegments.length === this.canonicalAuthorityUrlComponents.PathSegments.length
  }
  getEndpointMetadataFromConfig() {
    if (this.authorityOptions.authorityMetadata) try {
      return JSON.parse(this.authorityOptions.authorityMetadata)
    } catch (A) {
      throw hG(ee)
    }
    return null
  }
  async getEndpointMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityGetEndpointMetadataFromNetwork, this.correlationId);
    let A = {},
      Q = this.defaultOpenIdConfigurationEndpoint;
    this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${Q}`);
    try {
      let B = await this.networkInterface.sendGetRequestAsync(Q, A);
      if (TaB(B.body)) return B.body;
      else return this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"), null
    } catch (B) {
      return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${B}`), null
    }
  }
  getEndpointMetadataFromHardcodedValues() {
    if (this.hostnameAndPort in Va1) return Va1[this.hostnameAndPort];
    return null
  }
  async updateMetadataWithRegionalInformation(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateMetadataWithRegionalInformation, this.correlationId);
    let Q = this.authorityOptions.azureRegionConfiguration?.azureRegion;
    if (Q) {
      if (Q !== L0.AZURE_REGION_AUTO_DISCOVER_FLAG) return this.regionDiscoveryMetadata.region_outcome = UA1.CONFIGURED_NO_AUTO_DETECTION, this.regionDiscoveryMetadata.region_used = Q, kV.replaceWithRegionalInformation(A, Q);
      let B = await _5(this.regionDiscovery.detectRegion.bind(this.regionDiscovery), Z0.RegionDiscoveryDetectRegion, this.logger, this.performanceClient, this.correlationId)(this.authorityOptions.azureRegionConfiguration?.environmentRegion, this.regionDiscoveryMetadata);
      if (B) return this.regionDiscoveryMetadata.region_outcome = UA1.AUTO_DETECTION_REQUESTED_SUCCESSFUL, this.regionDiscoveryMetadata.region_used = B, kV.replaceWithRegionalInformation(A, B);
      this.regionDiscoveryMetadata.region_outcome = UA1.AUTO_DETECTION_REQUESTED_FAILED
    }
    return A
  }
  async updateCloudDiscoveryMetadata(A) {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityUpdateCloudDiscoveryMetadata, this.correlationId);
    let Q = this.updateCloudDiscoveryMetadataFromLocalSources(A);
    if (Q) return Q;
    let B = await _5(this.getCloudDiscoveryMetadataFromNetwork.bind(this), Z0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.logger, this.performanceClient, this.correlationId)();
    if (B) return ZNA(A, B, !0), CE.NETWORK;
    throw hG(AAA)
  }
  updateCloudDiscoveryMetadataFromLocalSources(A) {
    this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"), this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||L0.NOT_APPLICABLE}`), this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||L0.NOT_APPLICABLE}`), this.logger.verbosePii(`Canonical Authority: ${A.canonical_authority||L0.NOT_APPLICABLE}`);
    let Q = this.getCloudDiscoveryMetadataFromConfig();
    if (Q) return this.logger.verbose("Found cloud discovery metadata in authority configuration"), ZNA(A, Q, !1), CE.CONFIG;
    if (this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."), this.options.skipAuthorityMetadataCache) this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");
    else {
      let G = waB(this.hostnameAndPort);
      if (G) return this.logger.verbose("Found cloud discovery metadata from hardcoded values."), ZNA(A, G, !1), CE.HARDCODED_VALUES;
      this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")
    }
    let B = mA1(A);
    if (this.isAuthoritySameType(A) && A.aliasesFromNetwork && !B) return this.logger.verbose("Found cloud discovery metadata in the cache."), CE.CACHE;
    else if (B) this.logger.verbose("The metadata entity is expired.");
    return null
  }
  getCloudDiscoveryMetadataFromConfig() {
    if (this.authorityType === jM.Ciam) return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."), kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    if (this.authorityOptions.cloudDiscoveryMetadata) {
      this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");
      try {
        this.logger.verbose("Attempting to parse the cloud discovery metadata.");
        let A = JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),
          Q = uqA(A.metadata, this.hostnameAndPort);
        if (this.logger.verbose("Parsed the cloud discovery metadata."), Q) return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."), Q;
        else this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")
      } catch (A) {
        throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."), hG(Xl)
      }
    }
    if (this.isInKnownAuthorities()) return this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."), kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return null
  }
  async getCloudDiscoveryMetadataFromNetwork() {
    this.performanceClient?.addQueueMeasurement(Z0.AuthorityGetCloudDiscoveryMetadataFromNetwork, this.correlationId);
    let A = `${L0.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,
      Q = {},
      B = null;
    try {
      let G = await this.networkInterface.sendGetRequestAsync(A, Q),
        Z, I;
      if (jaB(G.body)) Z = G.body, I = Z.metadata, this.logger.verbosePii(`tenant_discovery_endpoint is: ${Z.tenant_discovery_endpoint}`);
      else if (_aB(G.body)) {
        if (this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${G.status}`), Z = G.body, Z.error === L0.INVALID_INSTANCE) return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."), null;
        this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${Z.error}`), this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${Z.error_description}`), this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"), I = []
      } else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"), null;
      this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."), B = uqA(I, this.hostnameAndPort)
    } catch (G) {
      if (G instanceof t4) this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: ${G.errorCode}
Error Description: ${G.errorMessage}`);
      else {
        let Z = G;
        this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: ${Z.name}
Error Description: ${Z.message}`)
      }
      return null
    }
    if (!B) this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."), this.logger.verbose("Creating custom Authority for custom domain scenario."), B = kV.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);
    return B
  }
  isInKnownAuthorities() {
    return this.authorityOptions.knownAuthorities.filter((Q) => {
      return Q && w8.getDomainFromUrl(Q).toLowerCase() === this.hostnameAndPort
    }).length > 0
  }
  static generateAuthority(A, Q) {
    let B;
    if (Q && Q.azureCloudInstance !== hf.None) {
      let G = Q.tenant ? Q.tenant : L0.DEFAULT_COMMON_TENANT;
      B = `${Q.azureCloudInstance}/${G}/`
    }
    return B ? B : A
  }
  static createCloudDiscoveryMetadataFromHost(A) {
    return {
      preferred_network: A,
      preferred_cache: A,
      aliases: [A]
    }
  }
  getPreferredCache() {
    if (this.managedIdentity) return L0.DEFAULT_AUTHORITY_HOST;
    else if (this.discoveryComplete()) return this.metadata.preferred_cache;
    else throw b0(EE)
  }
  isAlias(A) {
    return this.metadata.aliases.indexOf(A) > -1
  }
  isAliasOfKnownMicrosoftAuthority(A) {
    return Ka1.has(A)
  }
  static isPublicCloudAuthority(A) {
    return L0.KNOWN_PUBLIC_CLOUDS.indexOf(A) >= 0
  }
  static buildRegionalAuthorityString(A, Q, B) {
    let G = new w8(A);
    G.validateAsUri();
    let Z = G.getUrlComponents(),
      I = `${Q}.${Z.HostNameAndPort}`;
    if (this.isPublicCloudAuthority(Z.HostNameAndPort)) I = `${Q}.${L0.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`;
    let Y = w8.constructAuthorityUriFromObject({
      ...G.getUrlComponents(),
      HostNameAndPort: I
    }).urlString;
    if (B) return `${Y}?${B}`;
    return Y
  }
  static replaceWithRegionalInformation(A, Q) {
    let B = {
      ...A
    };
    if (B.authorization_endpoint = kV.buildRegionalAuthorityString(B.authorization_endpoint, Q), B.token_endpoint = kV.buildRegionalAuthorityString(B.token_endpoint, Q), B.end_session_endpoint) B.end_session_endpoint = kV.buildRegionalAuthorityString(B.end_session_endpoint, Q);
    return B
  }
  static transformCIAMAuthority(A) {
    let Q = A,
      G = new w8(A).getUrlComponents();
    if (G.PathSegments.length === 0 && G.HostNameAndPort.endsWith(L0.CIAM_AUTH_URL)) {
      let Z = G.HostNameAndPort.split(".")[0];
      Q = `${Q}${Z}${L0.AAD_TENANT_DOMAIN_SUFFIX}`
    }
    return Q
  }
}
// @from(Start 8058835, End 8059066)
function vaB(A) {
  let G = new w8(A).getUrlComponents().PathSegments.slice(-1)[0]?.toLowerCase();
  switch (G) {
    case MU.COMMON:
    case MU.ORGANIZATIONS:
    case MU.CONSUMERS:
      return;
    default:
      return G
  }
}
// @from(Start 8059068, End 8059157)
function cA1(A) {
  return A.endsWith(L0.FORWARD_SLASH) ? A : `${A}${L0.FORWARD_SLASH}`
}
// @from(Start 8059159, End 8059456)
function zs1(A) {
  let Q = A.cloudDiscoveryMetadata,
    B = void 0;
  if (Q) try {
    B = JSON.parse(Q)
  } catch (G) {
    throw hG(Xl)
  }
  return {
    canonicalAuthority: A.authority ? cA1(A.authority) : void 0,
    knownAuthorities: A.knownAuthorities,
    cloudDiscoveryMetadata: B
  }
}
// @from(Start 8059461, End 8059786)
pA1 = L(() => {
  Ya1();
  PaB();
  Kl();
  dX();
  mZ();
  Da1();
  Vl();
  hqA();
  LA1();
  SaB();
  kaB();
  xaB();
  PM();
  uT();
  lf();
  dA1();
  SW();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  kV.reservedTenantDomains = new Set(["{tenant}", "{tenantid}", MU.COMMON, MU.CONSUMERS, MU.ORGANIZATIONS])
})
// @from(Start 8059792, End 8059800)
lA1 = {}
// @from(Start 8059854, End 8060200)
async function Us1(A, Q, B, G, Z, I, Y) {
  Y?.addQueueMeasurement(Z0.AuthorityFactoryCreateDiscoveredInstance, I);
  let J = kV.transformCIAMAuthority(cA1(A)),
    W = new kV(J, Q, B, G, Z, I, Y);
  try {
    return await _5(W.resolveEndpointsAsync.bind(W), Z0.AuthorityResolveEndpointsAsync, Z, Y, I)(), W
  } catch (X) {
    throw b0(EE)
  }
}
// @from(Start 8060205, End 8060310)
$s1 = L(() => {
  pA1();
  dX();
  uT();
  lf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8060316, End 8060318)
$E
// @from(Start 8060324, End 8060600)
fZA = L(() => {
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  $E = class $E extends t4 {
    constructor(A, Q, B, G, Z) {
      super(A, Q, B);
      this.name = "ServerError", this.errorNo = G, this.status = Z, Object.setPrototypeOf(this, $E.prototype)
    }
  }
})
// @from(Start 8060603, End 8061036)
function hZA(A, Q, B) {
  return {
    clientId: A,
    authority: Q.authority,
    scopes: Q.scopes,
    homeAccountIdentifier: B,
    claims: Q.claims,
    authenticationScheme: Q.authenticationScheme,
    resourceRequestMethod: Q.resourceRequestMethod,
    resourceRequestUri: Q.resourceRequestUri,
    shrClaims: Q.shrClaims,
    sshKid: Q.sshKid,
    embeddedClientId: Q.embeddedClientId || Q.tokenBodyParameters?.clientId
  }
}
// @from(Start 8061041, End 8061107)
iA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8061109, End 8062639)
class nf {
  static generateThrottlingStorageKey(A) {
    return `${Xk.THROTTLING_PREFIX}.${JSON.stringify(A)}`
  }
  static preProcess(A, Q, B) {
    let G = nf.generateThrottlingStorageKey(Q),
      Z = A.getThrottlingCache(G);
    if (Z) {
      if (Z.throttleTime < Date.now()) {
        A.removeItem(G, B);
        return
      }
      throw new $E(Z.errorCodes?.join(" ") || L0.EMPTY_STRING, Z.errorMessage, Z.subError)
    }
  }
  static postProcess(A, Q, B, G) {
    if (nf.checkResponseStatus(B) || nf.checkResponseForRetryAfter(B)) {
      let Z = {
        throttleTime: nf.calculateThrottleTime(parseInt(B.headers[uZ.RETRY_AFTER])),
        error: B.body.error,
        errorCodes: B.body.error_codes,
        errorMessage: B.body.error_description,
        subError: B.body.suberror
      };
      A.setThrottlingCache(nf.generateThrottlingStorageKey(Q), Z, G)
    }
  }
  static checkResponseStatus(A) {
    return A.status === 429 || A.status >= 500 && A.status < 600
  }
  static checkResponseForRetryAfter(A) {
    if (A.headers) return A.headers.hasOwnProperty(uZ.RETRY_AFTER) && (A.status < 200 || A.status >= 300);
    return !1
  }
  static calculateThrottleTime(A) {
    let Q = A <= 0 ? 0 : A,
      B = Date.now() / 1000;
    return Math.floor(Math.min(B + (Q || Xk.DEFAULT_THROTTLE_TIME_SECONDS), B + Xk.DEFAULT_MAX_THROTTLE_TIME_SECONDS) * 1000)
  }
  static removeThrottle(A, Q, B, G) {
    let Z = hZA(Q, B, G),
      I = this.generateThrottlingStorageKey(Z);
    A.removeItem(I, B.correlationId)
  }
}
// @from(Start 8062644, End 8062734)
baB = L(() => {
  mZ();
  fZA();
  iA1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8062740, End 8062743)
nA1
// @from(Start 8062749, End 8063083)
faB = L(() => {
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  nA1 = class nA1 extends t4 {
    constructor(A, Q, B) {
      super(A.errorCode, A.errorMessage, A.subError);
      Object.setPrototypeOf(this, nA1.prototype), this.name = "NetworkError", this.error = A, this.httpStatus = Q, this.responseHeaders = B
    }
  }
})
// @from(Start 8063085, End 8066148)
class sH {
  constructor(A, Q) {
    this.config = OaB(A), this.logger = new RU(this.config.loggerOptions, qA1, MZA), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = Q
  }
  createTokenRequestHeaders(A) {
    let Q = {};
    if (Q[uZ.CONTENT_TYPE] = L0.URL_FORM_CONTENT_TYPE, !this.config.systemOptions.preventCorsPreflight && A) switch (A.type) {
      case zE.HOME_ACCOUNT_ID:
        try {
          let B = Fk(A.credential);
          Q[uZ.CCS_HEADER] = `Oid:${B.uid}@${B.utid}`
        } catch (B) {
          this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
        }
        break;
      case zE.UPN:
        Q[uZ.CCS_HEADER] = `UPN: ${A.credential}`;
        break
    }
    return Q
  }
  async executePostToTokenEndpoint(A, Q, B, G, Z, I) {
    if (I) this.performanceClient?.addQueueMeasurement(I, Z);
    let Y = await this.sendPostRequest(G, A, {
      body: Q,
      headers: B
    }, Z);
    if (this.config.serverTelemetryManager && Y.status < 500 && Y.status !== 429) this.config.serverTelemetryManager.clearTelemetryCache();
    return Y
  }
  async sendPostRequest(A, Q, B, G) {
    nf.preProcess(this.cacheManager, A, G);
    let Z;
    try {
      Z = await _5(this.networkClient.sendPostRequestAsync.bind(this.networkClient), Z0.NetworkClientSendPostRequestAsync, this.logger, this.performanceClient, G)(Q, B);
      let I = Z.headers || {};
      this.performanceClient?.addFields({
        refreshTokenSize: Z.body.refresh_token?.length || 0,
        httpVerToken: I[uZ.X_MS_HTTP_VERSION] || "",
        requestId: I[uZ.X_MS_REQUEST_ID] || ""
      }, G)
    } catch (I) {
      if (I instanceof nA1) {
        let Y = I.responseHeaders;
        if (Y) this.performanceClient?.addFields({
          httpVerToken: Y[uZ.X_MS_HTTP_VERSION] || "",
          requestId: Y[uZ.X_MS_REQUEST_ID] || "",
          contentTypeHeader: Y[uZ.CONTENT_TYPE] || void 0,
          contentLengthHeader: Y[uZ.CONTENT_LENGTH] || void 0,
          httpStatus: I.httpStatus
        }, G);
        throw I.error
      }
      if (I instanceof t4) throw I;
      else throw b0(_e)
    }
    return nf.postProcess(this.cacheManager, A, Z, G), Z
  }
  async updateAuthority(A, Q) {
    this.performanceClient?.addQueueMeasurement(Z0.UpdateTokenEndpointAuthority, Q);
    let B = `https://${A}/${this.authority.tenant}/`,
      G = await Us1(B, this.networkClient, this.cacheManager, this.authority.options, this.logger, Q, this.performanceClient);
    this.authority = G
  }
  createTokenQueryParameters(A) {
    let Q = new Map;
    if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
    if (A.tokenQueryParameters) cf(Q, A.tokenQueryParameters);
    return XAA(Q, A.correlationId), ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
  }
}
// @from(Start 8066153, End 8066355)
INA = L(() => {
  kA1();
  wA1();
  mZ();
  NA1();
  dqA();
  PZA();
  xZA();
  QAA();
  $s1();
  uT();
  baB();
  PM();
  dX();
  faB();
  lf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8066361, End 8066369)
sA1 = {}
// @from(Start 8066629, End 8066651)
Cl = "no_tokens_found"
// @from(Start 8066655, End 8066689)
YNA = "native_account_unavailable"
// @from(Start 8066693, End 8066722)
JNA = "refresh_token_expired"
// @from(Start 8066726, End 8066748)
aA1 = "ux_not_allowed"
// @from(Start 8066752, End 8066780)
ws1 = "interaction_required"
// @from(Start 8066784, End 8066808)
qs1 = "consent_required"
// @from(Start 8066812, End 8066834)
Ns1 = "login_required"
// @from(Start 8066838, End 8066854)
El = "bad_token"
// @from(Start 8066860, End 8066926)
rA1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8066929, End 8067121)
function tA1(A, Q, B) {
  let G = !!A && haB.indexOf(A) > -1,
    Z = !!B && Ea6.indexOf(B) > -1,
    I = !!Q && haB.some((Y) => {
      return Q.indexOf(Y) > -1
    });
  return G || I || Z
}
// @from(Start 8067123, End 8067169)
function eA1(A) {
  return new Wq(A, oA1[A])
}
// @from(Start 8067174, End 8067177)
haB
// @from(Start 8067179, End 8067182)
Ea6
// @from(Start 8067184, End 8067187)
oA1
// @from(Start 8067189, End 8067192)
Ls1
// @from(Start 8067194, End 8067196)
Wq
// @from(Start 8067202, End 8068593)
WNA = L(() => {
  mZ();
  PM();
  rA1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  haB = [ws1, qs1, Ns1, El, aA1], Ea6 = ["message_only", "additional_action", "basic_action", "user_password_expired", "consent_required", "bad_token"], oA1 = {
    [Cl]: "No refresh token found in the cache. Please sign-in.",
    [YNA]: "The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",
    [JNA]: "Refresh token has expired.",
    [El]: "Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve.",
    [aA1]: "`canShowUI` flag in Edge was set to false. User interaction required on web page. Please invoke an interactive API to resolve."
  }, Ls1 = {
    noTokensFoundError: {
      code: Cl,
      desc: oA1[Cl]
    },
    native_account_unavailable: {
      code: YNA,
      desc: oA1[YNA]
    },
    bad_token: {
      code: El,
      desc: oA1[El]
    }
  };
  Wq = class Wq extends t4 {
    constructor(A, Q, B, G, Z, I, Y, J) {
      super(A, Q, B);
      Object.setPrototypeOf(this, Wq.prototype), this.timestamp = G || L0.EMPTY_STRING, this.traceId = Z || L0.EMPTY_STRING, this.correlationId = I || L0.EMPTY_STRING, this.claims = Y || L0.EMPTY_STRING, this.name = "InteractionRequiredAuthError", this.errorNo = J
    }
  }
})
// @from(Start 8068595, End 8069380)
class A11 {
  static setRequestState(A, Q, B) {
    let G = A11.generateLibraryState(A, B);
    return Q ? `${G}${L0.RESOURCE_DELIM}${Q}` : G
  }
  static generateLibraryState(A, Q) {
    if (!A) throw b0(Yl);
    let B = {
      id: A.createNewGuid()
    };
    if (Q) B.meta = Q;
    let G = JSON.stringify(B);
    return A.base64Encode(G)
  }
  static parseRequestState(A, Q) {
    if (!A) throw b0(Yl);
    if (!Q) throw b0(gT);
    try {
      let B = Q.split(L0.RESOURCE_DELIM),
        G = B[0],
        Z = B.length > 1 ? B.slice(1).join(L0.RESOURCE_DELIM) : L0.EMPTY_STRING,
        I = A.base64Decode(G),
        Y = JSON.parse(I);
      return {
        userRequestState: Z || L0.EMPTY_STRING,
        libraryState: Y
      }
    } catch (B) {
      throw b0(gT)
    }
  }
}
// @from(Start 8069385, End 8069473)
gaB = L(() => {
  mZ();
  dX();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8069475, End 8070800)
class FAA {
  constructor(A, Q) {
    this.cryptoUtils = A, this.performanceClient = Q
  }
  async generateCnf(A, Q) {
    this.performanceClient?.addQueueMeasurement(Z0.PopTokenGenerateCnf, A.correlationId);
    let B = await _5(this.generateKid.bind(this), Z0.PopTokenGenerateCnf, Q, this.performanceClient, A.correlationId)(A),
      G = this.cryptoUtils.base64UrlEncode(JSON.stringify(B));
    return {
      kid: B.kid,
      reqCnfString: G
    }
  }
  async generateKid(A) {
    return this.performanceClient?.addQueueMeasurement(Z0.PopTokenGenerateKid, A.correlationId), {
      kid: await this.cryptoUtils.getPublicKeyThumbprint(A),
      xms_ksl: za6.SW
    }
  }
  async signPopToken(A, Q, B) {
    return this.signPayload(A, Q, B)
  }
  async signPayload(A, Q, B, G) {
    let {
      resourceRequestMethod: Z,
      resourceRequestUri: I,
      shrClaims: Y,
      shrNonce: J,
      shrOptions: W
    } = B, V = (I ? new w8(I) : void 0)?.getUrlComponents();
    return this.cryptoUtils.signJwt({
      at: A,
      ts: Jq(),
      m: Z?.toUpperCase(),
      u: V?.HostNameAndPort,
      nonce: J || this.cryptoUtils.createNewGuid(),
      p: V?.AbsolutePath,
      q: V?.QueryString ? [
        [], V.QueryString
      ] : void 0,
      client_claims: Y || void 0,
      ...G
    }, Q, W, B.correlationId)
  }
}
// @from(Start 8070805, End 8070808)
za6
// @from(Start 8070814, End 8070937)
Q11 = L(() => {
  Hl();
  Kl();
  uT();
  lf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  za6 = {
    SW: "sw"
  }
})
// @from(Start 8070939, End 8071121)
class SM {
  constructor(A, Q) {
    this.cache = A, this.hasChanged = Q
  }
  get cacheHasChanged() {
    return this.hasChanged
  }
  get tokenCache() {
    return this.cache
  }
}
// @from(Start 8071126, End 8071192)
Ms1 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8071194, End 8078003)
class _J {
  constructor(A, Q, B, G, Z, I, Y) {
    this.clientId = A, this.cacheStorage = Q, this.cryptoObj = B, this.logger = G, this.serializableCache = Z, this.persistencePlugin = I, this.performanceClient = Y
  }
  validateTokenResponse(A, Q) {
    if (A.error || A.error_description || A.suberror) {
      let B = `Error(s): ${A.error_codes||L0.NOT_AVAILABLE} - Timestamp: ${A.timestamp||L0.NOT_AVAILABLE} - Description: ${A.error_description||L0.NOT_AVAILABLE} - Correlation ID: ${A.correlation_id||L0.NOT_AVAILABLE} - Trace ID: ${A.trace_id||L0.NOT_AVAILABLE}`,
        G = A.error_codes?.length ? A.error_codes[0] : void 0,
        Z = new $E(A.error, B, A.suberror, G, A.status);
      if (Q && A.status && A.status >= o4.SERVER_ERROR_RANGE_START && A.status <= o4.SERVER_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${Z}`);
        return
      } else if (Q && A.status && A.status >= o4.CLIENT_ERROR_RANGE_START && A.status <= o4.CLIENT_ERROR_RANGE_END) {
        this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${Z}`);
        return
      }
      if (tA1(A.error, A.error_description, A.suberror)) throw new Wq(A.error, A.error_description, A.suberror, A.timestamp || L0.EMPTY_STRING, A.trace_id || L0.EMPTY_STRING, A.correlation_id || L0.EMPTY_STRING, A.claims || L0.EMPTY_STRING, G);
      throw Z
    }
  }
  async handleServerTokenResponse(A, Q, B, G, Z, I, Y, J, W) {
    this.performanceClient?.addQueueMeasurement(Z0.HandleServerTokenResponse, A.correlation_id);
    let X;
    if (A.id_token) {
      if (X = mf(A.id_token || L0.EMPTY_STRING, this.cryptoObj.base64Decode), Z && Z.nonce) {
        if (X.nonce !== Z.nonce) throw b0(ve)
      }
      if (G.maxAge || G.maxAge === 0) {
        let D = X.auth_time;
        if (!D) throw b0(xf);
        gqA(D, G.maxAge)
      }
    }
    this.homeAccountIdentifier = cX.generateHomeAccountId(A.client_info || L0.EMPTY_STRING, Q.authorityType, this.logger, this.cryptoObj, X);
    let V;
    if (!!Z && !!Z.state) V = A11.parseRequestState(this.cryptoObj, Z.state);
    A.key_id = A.key_id || G.sshKid || void 0;
    let F = this.generateCacheRecord(A, Q, B, G, X, I, Z),
      K;
    try {
      if (this.persistencePlugin && this.serializableCache) this.logger.verbose("Persistence enabled, calling beforeCacheAccess"), K = new SM(this.serializableCache, !0), await this.persistencePlugin.beforeCacheAccess(K);
      if (Y && !J && F.account) {
        let D = this.cacheStorage.generateAccountKey(cX.getAccountInfo(F.account));
        if (!this.cacheStorage.getAccount(D, G.correlationId)) return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"), await _J.generateAuthenticationResult(this.cryptoObj, Q, F, !1, G, X, V, void 0, W)
      }
      await this.cacheStorage.saveCacheRecord(F, G.correlationId, Wa1(X || {}), G.storeInCache)
    } finally {
      if (this.persistencePlugin && this.serializableCache && K) this.logger.verbose("Persistence enabled, calling afterCacheAccess"), await this.persistencePlugin.afterCacheAccess(K)
    }
    return _J.generateAuthenticationResult(this.cryptoObj, Q, F, !1, G, X, V, A, W)
  }
  generateCacheRecord(A, Q, B, G, Z, I, Y) {
    let J = Q.getPreferredCache();
    if (!J) throw b0(bf);
    let W = RA1(Z),
      X, V;
    if (A.id_token && !!Z) X = Hs1(this.homeAccountIdentifier, J, A.id_token, this.clientId, W || ""), V = uaB(this.cacheStorage, Q, this.homeAccountIdentifier, this.cryptoObj.base64Decode, G.correlationId, Z, A.client_info, J, W, Y, void 0, this.logger);
    let F = null;
    if (A.access_token) {
      let H = A.scope ? SJ.fromString(A.scope) : new SJ(G.scopes || []),
        C = (typeof A.expires_in === "string" ? parseInt(A.expires_in, 10) : A.expires_in) || 0,
        E = (typeof A.ext_expires_in === "string" ? parseInt(A.ext_expires_in, 10) : A.ext_expires_in) || 0,
        U = (typeof A.refresh_in === "string" ? parseInt(A.refresh_in, 10) : A.refresh_in) || void 0,
        q = B + C,
        w = q + E,
        N = U && U > 0 ? B + U : void 0;
      F = Cs1(this.homeAccountIdentifier, J, A.access_token, this.clientId, W || Q.tenant || "", H.printScopes(), q, w, this.cryptoObj.base64Decode, N, A.token_type, I, A.key_id, G.claims, G.requestedClaimsHash)
    }
    let K = null;
    if (A.refresh_token) {
      let H;
      if (A.refresh_token_expires_in) {
        let C = typeof A.refresh_token_expires_in === "string" ? parseInt(A.refresh_token_expires_in, 10) : A.refresh_token_expires_in;
        H = B + C
      }
      K = Es1(this.homeAccountIdentifier, J, A.refresh_token, this.clientId, A.foci, I, H)
    }
    let D = null;
    if (A.foci) D = {
      clientId: this.clientId,
      environment: J,
      familyId: A.foci
    };
    return {
      account: V,
      idToken: X,
      accessToken: F,
      refreshToken: K,
      appMetadata: D
    }
  }
  static async generateAuthenticationResult(A, Q, B, G, Z, I, Y, J, W) {
    let X = L0.EMPTY_STRING,
      V = [],
      F = null,
      K, D, H = L0.EMPTY_STRING;
    if (B.accessToken) {
      if (B.accessToken.tokenType === A5.POP && !Z.popKid) {
        let q = new FAA(A),
          {
            secret: w,
            keyId: N
          } = B.accessToken;
        if (!N) throw b0(le);
        X = await q.signPopToken(w, N, Z)
      } else X = B.accessToken.secret;
      if (V = SJ.fromString(B.accessToken.target).asArray(), F = GNA(B.accessToken.expiresOn), K = GNA(B.accessToken.extendedExpiresOn), B.accessToken.refreshOn) D = GNA(B.accessToken.refreshOn)
    }
    if (B.appMetadata) H = B.appMetadata.familyId === Ql ? Ql : "";
    let C = I?.oid || I?.sub || "",
      E = I?.tid || "";
    if (J?.spa_accountid && !!B.account) B.account.nativeAccountId = J?.spa_accountid;
    let U = B.account ? MA1(cX.getAccountInfo(B.account), void 0, I, B.idToken?.secret) : null;
    return {
      authority: Q.canonicalAuthority,
      uniqueId: C,
      tenantId: E,
      scopes: V,
      account: U,
      idToken: B?.idToken?.secret || "",
      idTokenClaims: I || {},
      accessToken: X,
      fromCache: G,
      expiresOn: F,
      extExpiresOn: K,
      refreshOn: D,
      correlationId: Z.correlationId,
      requestId: W || L0.EMPTY_STRING,
      familyId: H,
      tokenType: B.accessToken?.tokenType || L0.EMPTY_STRING,
      state: Y ? Y.userRequestState : L0.EMPTY_STRING,
      cloudGraphHostName: B.account?.cloudGraphHostName || L0.EMPTY_STRING,
      msGraphHost: B.account?.msGraphHost || L0.EMPTY_STRING,
      code: J?.spa_code,
      fromNativeBroker: !1
    }
  }
}
// @from(Start 8078005, End 8078694)
function uaB(A, Q, B, G, Z, I, Y, J, W, X, V, F) {
  F?.verbose("setCachedAccount called");
  let D = A.getAccountKeys().find((q) => {
      return q.startsWith(B)
    }),
    H = null;
  if (D) H = A.getAccount(D, Z);
  let C = H || cX.createAccount({
      homeAccountId: B,
      idTokenClaims: I,
      clientInfo: Y,
      environment: J,
      cloudGraphHostName: X?.cloud_graph_host_name,
      msGraphHost: X?.msgraph_host,
      nativeAccountId: V
    }, Q, G),
    E = C.tenantProfiles || [],
    U = W || C.realm;
  if (U && !E.find((q) => {
      return q.tenantId === U
    })) {
    let q = fqA(B, C.localAccountId, U, I);
    E.push(q)
  }
  return C.tenantProfiles = E, C
}
// @from(Start 8078699, End 8078902)
XNA = L(() => {
  dX();
  fZA();
  bqA();
  TA1();
  WNA();
  gaB();
  mZ();
  Q11();
  Ms1();
  uT();
  jZA();
  Ja1();
  OA1();
  dA1();
  Hl();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8078904, End 8079034)
async function wE(A, Q, B) {
  if (typeof A === "string") return A;
  else return A({
    clientId: Q,
    tokenEndpoint: B
  })
}
// @from(Start 8079039, End 8079105)
B11 = L(() => {
  /*! @azure/msal-common v15.13.1 2025-10-29 */ })
// @from(Start 8079111, End 8079114)
G11
// @from(Start 8079120, End 8085151)
maB = L(() => {
  INA();
  xZA();
  QAA();
  mZ();
  kZA();
  kA1();
  XNA();
  Fl();
  dX();
  Kl();
  Q11();
  Hl();
  PZA();
  dqA();
  Vl();
  uT();
  lf();
  B11();
  iA1();
  SW();
  uf(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  G11 = class G11 extends sH {
    constructor(A, Q) {
      super(A, Q);
      this.includeRedirectUri = !0, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes
    }
    async acquireToken(A, Q) {
      if (this.performanceClient?.addQueueMeasurement(Z0.AuthClientAcquireToken, A.correlationId), !A.code) throw b0(he);
      let B = Jq(),
        G = await _5(this.executeTokenRequest.bind(this), Z0.AuthClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(this.authority, A),
        Z = G.headers?.[uZ.X_MS_REQUEST_ID],
        I = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin, this.performanceClient);
      return I.validateTokenResponse(G.body), _5(I.handleServerTokenResponse.bind(I), Z0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(G.body, this.authority, B, A, Q, void 0, void 0, void 0, Z)
    }
    getLogoutUri(A) {
      if (!A) throw hG(oe);
      let Q = this.createLogoutUrlQueryString(A);
      return w8.appendQueryString(this.authority.endSessionEndpoint, Q)
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.AuthClientExecuteTokenRequest, Q.correlationId);
      let B = this.createTokenQueryParameters(Q),
        G = w8.appendQueryString(A.tokenEndpoint, B),
        Z = await _5(this.createTokenRequestBody.bind(this), Z0.AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, Q.correlationId)(Q),
        I = void 0;
      if (Q.clientInfo) try {
        let W = TZA(Q.clientInfo, this.cryptoUtils.base64Decode);
        I = {
          credential: `${W.uid}${yf.CLIENT_INFO_SEPARATOR}${W.utid}`,
          type: zE.HOME_ACCOUNT_ID
        }
      } catch (W) {
        this.logger.verbose("Could not parse client info for CCS Header: " + W)
      }
      let Y = this.createTokenRequestHeaders(I || Q.ccsCredential),
        J = hZA(this.config.authOptions.clientId, Q);
      return _5(this.executePostToTokenEndpoint.bind(this), Z0.AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, Q.correlationId)(G, Z, Y, J, Q.correlationId, Z0.AuthorizationCodeClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(Z0.AuthClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (YAA(Q, A.embeddedClientId || A.tokenBodyParameters?.[Dk] || this.config.authOptions.clientId), !this.includeRedirectUri) {
        if (!A.redirectUri) throw hG(ie)
      } else JAA(Q, A.redirectUri);
      if (IAA(Q, A.scopes, !0, this.oidcDefaultScopes), Xs1(Q, A.code), pqA(Q, this.config.libraryInfo), lqA(Q, this.config.telemetry.application), QNA(Q), this.serverTelemetryManager && !_A1(this.config)) ANA(Q, this.serverTelemetryManager);
      if (A.codeVerifier) Fs1(Q, A.codeVerifier);
      if (this.config.clientCredentials.clientSecret) nqA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let G = this.config.clientCredentials.clientAssertion;
        aqA(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), sqA(Q, G.assertionType)
      }
      if (rqA(Q, OU.AUTHORIZATION_CODE_GRANT), VAA(Q), A.authenticationScheme === A5.POP) {
        let G = new FAA(this.cryptoUtils, this.performanceClient),
          Z;
        if (!A.popKid) Z = (await _5(G.generateCnf.bind(G), Z0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else Z = this.cryptoUtils.encodeKid(A.popKid);
        tqA(Q, Z)
      } else if (A.authenticationScheme === A5.SSH)
        if (A.sshJwk) eqA(Q, A.sshJwk);
        else throw hG(gf);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) WAA(Q, A.claims, this.config.authOptions.clientCapabilities);
      let B = void 0;
      if (A.clientInfo) try {
        let G = TZA(A.clientInfo, this.cryptoUtils.base64Decode);
        B = {
          credential: `${G.uid}${yf.CLIENT_INFO_SEPARATOR}${G.utid}`,
          type: zE.HOME_ACCOUNT_ID
        }
      } catch (G) {
        this.logger.verbose("Could not parse client info for CCS Header: " + G)
      } else B = A.ccsCredential;
      if (this.config.systemOptions.preventCorsPreflight && B) switch (B.type) {
        case zE.HOME_ACCOUNT_ID:
          try {
            let G = Fk(B.credential);
            df(Q, G)
          } catch (G) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + G)
          }
          break;
        case zE.UPN:
          Dl(Q, B.credential);
          break
      }
      if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cf(Q, A.tokenBodyParameters);
      if (A.enableSpaAuthorizationCode && (!A.tokenBodyParameters || !A.tokenBodyParameters[bA1])) cf(Q, {
        [bA1]: "1"
      });
      return ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
    }
    createLogoutUrlQueryString(A) {
      let Q = new Map;
      if (A.postLogoutRedirectUri) Zs1(Q, A.postLogoutRedirectUri);
      if (A.correlationId) XAA(Q, A.correlationId);
      if (A.idTokenHint) Is1(Q, A.idTokenHint);
      if (A.state) iqA(Q, A.state);
      if (A.logoutHint) Ks1(Q, A.logoutHint);
      if (A.extraQueryParameters) cf(Q, A.extraQueryParameters);
      if (this.config.authOptions.instanceAware) oqA(Q);
      return Kk(Q, this.config.authOptions.encodeExtraQueryParams, A.extraQueryParameters)
    }
  }
})
// @from(Start 8085157, End 8085166)
Ua6 = 300
// @from(Start 8085170, End 8085173)
gZA
// @from(Start 8085179, End 8092148)
daB = L(() => {
  kA1();
  INA();
  xZA();
  QAA();
  mZ();
  kZA();
  XNA();
  Q11();
  Fl();
  Vl();
  dX();
  fZA();
  Hl();
  Kl();
  dqA();
  PZA();
  WNA();
  uT();
  lf();
  B11();
  iA1();
  rA1();
  uf();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  gZA = class gZA extends sH {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireToken(A) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireToken, A.correlationId);
      let Q = Jq(),
        B = await _5(this.executeTokenRequest.bind(this), Z0.RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, A.correlationId)(A, this.authority),
        G = B.headers?.[uZ.X_MS_REQUEST_ID],
        Z = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(B.body), _5(Z.handleServerTokenResponse.bind(Z), Z0.HandleServerTokenResponse, this.logger, this.performanceClient, A.correlationId)(B.body, this.authority, Q, A, void 0, void 0, !0, A.forceCache, G)
    }
    async acquireTokenByRefreshToken(A) {
      if (!A) throw hG(re);
      if (this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireTokenByRefreshToken, A.correlationId), !A.account) throw b0(vf);
      if (this.cacheManager.isAppMetadataFOCI(A.account.environment)) try {
        return await _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !0)
      } catch (B) {
        let G = B instanceof Wq && B.errorCode === Cl,
          Z = B instanceof $E && B.errorCode === JqA.INVALID_GRANT_ERROR && B.subError === JqA.CLIENT_MISMATCH_ERROR;
        if (G || Z) return _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1);
        else throw B
      }
      return _5(this.acquireTokenWithCachedRefreshToken.bind(this), Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, A.correlationId)(A, !1)
    }
    async acquireTokenWithCachedRefreshToken(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientAcquireTokenWithCachedRefreshToken, A.correlationId);
      let B = yaB(this.cacheManager.getRefreshToken.bind(this.cacheManager), Z0.CacheManagerGetRefreshToken, this.logger, this.performanceClient, A.correlationId)(A.account, Q, A.correlationId, void 0, this.performanceClient);
      if (!B) throw eA1(Cl);
      if (B.expiresOn && vZA(B.expiresOn, A.refreshTokenExpirationOffsetSeconds || Ua6)) throw this.performanceClient?.addFields({
        rtExpiresOnMs: Number(B.expiresOn)
      }, A.correlationId), eA1(JNA);
      let G = {
        ...A,
        refreshToken: B.secret,
        authenticationScheme: A.authenticationScheme || A5.BEARER,
        ccsCredential: {
          credential: A.account.homeAccountId,
          type: zE.HOME_ACCOUNT_ID
        }
      };
      try {
        return await _5(this.acquireToken.bind(this), Z0.RefreshTokenClientAcquireToken, this.logger, this.performanceClient, A.correlationId)(G)
      } catch (Z) {
        if (Z instanceof Wq) {
          if (this.performanceClient?.addFields({
              rtExpiresOnMs: Number(B.expiresOn)
            }, A.correlationId), Z.subError === El) {
            this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");
            let I = this.cacheManager.generateCredentialKey(B);
            this.cacheManager.removeRefreshToken(I, A.correlationId)
          }
        }
        throw Z
      }
    }
    async executeTokenRequest(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientExecuteTokenRequest, A.correlationId);
      let B = this.createTokenQueryParameters(A),
        G = w8.appendQueryString(Q.tokenEndpoint, B),
        Z = await _5(this.createTokenRequestBody.bind(this), Z0.RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, A.correlationId)(A),
        I = this.createTokenRequestHeaders(A.ccsCredential),
        Y = hZA(this.config.authOptions.clientId, A);
      return _5(this.executePostToTokenEndpoint.bind(this), Z0.RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, A.correlationId)(G, Z, I, Y, A.correlationId, Z0.RefreshTokenClientExecutePostToTokenEndpoint)
    }
    async createTokenRequestBody(A) {
      this.performanceClient?.addQueueMeasurement(Z0.RefreshTokenClientCreateTokenRequestBody, A.correlationId);
      let Q = new Map;
      if (YAA(Q, A.embeddedClientId || A.tokenBodyParameters?.[Dk] || this.config.authOptions.clientId), A.redirectUri) JAA(Q, A.redirectUri);
      if (IAA(Q, A.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), rqA(Q, OU.REFRESH_TOKEN_GRANT), VAA(Q), pqA(Q, this.config.libraryInfo), lqA(Q, this.config.telemetry.application), QNA(Q), this.serverTelemetryManager && !_A1(this.config)) ANA(Q, this.serverTelemetryManager);
      if (Vs1(Q, A.refreshToken), this.config.clientCredentials.clientSecret) nqA(Q, this.config.clientCredentials.clientSecret);
      if (this.config.clientCredentials.clientAssertion) {
        let B = this.config.clientCredentials.clientAssertion;
        aqA(Q, await wE(B.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), sqA(Q, B.assertionType)
      }
      if (A.authenticationScheme === A5.POP) {
        let B = new FAA(this.cryptoUtils, this.performanceClient),
          G;
        if (!A.popKid) G = (await _5(B.generateCnf.bind(B), Z0.PopTokenGenerateCnf, this.logger, this.performanceClient, A.correlationId)(A, this.logger)).reqCnfString;
        else G = this.cryptoUtils.encodeKid(A.popKid);
        tqA(Q, G)
      } else if (A.authenticationScheme === A5.SSH)
        if (A.sshJwk) eqA(Q, A.sshJwk);
        else throw hG(gf);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) WAA(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.ccsCredential) switch (A.ccsCredential.type) {
        case zE.HOME_ACCOUNT_ID:
          try {
            let B = Fk(A.ccsCredential.credential);
            df(Q, B)
          } catch (B) {
            this.logger.verbose("Could not parse home account ID for CCS Header: " + B)
          }
          break;
        case zE.UPN:
          Dl(Q, A.ccsCredential.credential);
          break
      }
      if (A.embeddedClientId) pf(Q, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
      if (A.tokenBodyParameters) cf(Q, A.tokenBodyParameters);
      return ZAA(Q, A.correlationId, this.performanceClient), Kk(Q)
    }
  }
})
// @from(Start 8092154, End 8092157)
Z11
// @from(Start 8092163, End 8094872)
caB = L(() => {
  INA();
  Hl();
  dX();
  XNA();
  mZ();
  Fl();
  jZA();
  uT();
  lf();
  pA1();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
  Z11 = class Z11 extends sH {
    constructor(A, Q) {
      super(A, Q)
    }
    async acquireCachedToken(A) {
      this.performanceClient?.addQueueMeasurement(Z0.SilentFlowClientAcquireCachedToken, A.correlationId);
      let Q = FZ.NOT_APPLICABLE;
      if (A.forceRefresh || !this.config.cacheOptions.claimsBasedCachingEnabled && !KZ.isEmptyObj(A.claims)) throw this.setCacheOutcome(FZ.FORCE_REFRESH_OR_CLAIMS, A.correlationId), b0(ff);
      if (!A.account) throw b0(vf);
      let B = A.account.tenantId || vaB(A.authority),
        G = this.cacheManager.getTokenKeys(),
        Z = this.cacheManager.getAccessToken(A.account, A, G, B);
      if (!Z) throw this.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN, A.correlationId), b0(ff);
      else if (Ds1(Z.cachedAt) || vZA(Z.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED, A.correlationId), b0(ff);
      else if (Z.refreshOn && vZA(Z.refreshOn, 0)) Q = FZ.PROACTIVELY_REFRESHED;
      let I = A.authority || this.authority.getPreferredCache(),
        Y = {
          account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(A.account), A.correlationId),
          accessToken: Z,
          idToken: this.cacheManager.getIdToken(A.account, A.correlationId, G, B, this.performanceClient),
          refreshToken: null,
          appMetadata: this.cacheManager.readAppMetadataFromCache(I)
        };
      if (this.setCacheOutcome(Q, A.correlationId), this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return [await _5(this.generateResultFromCacheRecord.bind(this), Z0.SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, A.correlationId)(Y, A), Q]
    }
    setCacheOutcome(A, Q) {
      if (this.serverTelemetryManager?.setCacheOutcome(A), this.performanceClient?.addFields({
          cacheOutcome: A
        }, Q), A !== FZ.NOT_APPLICABLE) this.logger.info(`Token refresh is required due to cache outcome: ${A}`)
    }
    async generateResultFromCacheRecord(A, Q) {
      this.performanceClient?.addQueueMeasurement(Z0.SilentFlowClientGenerateResultFromCacheRecord, Q.correlationId);
      let B;
      if (A.idToken) B = mf(A.idToken.secret, this.config.cryptoInterface.base64Decode);
      if (Q.maxAge || Q.maxAge === 0) {
        let G = B?.auth_time;
        if (!G) throw b0(xf);
        gqA(G, Q.maxAge)
      }
      return _J.generateAuthenticationResult(this.cryptoUtils, this.authority, A, !0, Q, B)
    }
  }
})
// @from(Start 8094878, End 8094886)
VNA = {}
// @from(Start 8095070, End 8098229)
function $a6(A, Q, B, G) {
  let Z = Q.correlationId,
    I = new Map;
  YAA(I, Q.embeddedClientId || Q.extraQueryParameters?.[Dk] || A.clientId);
  let Y = [...Q.scopes || [], ...Q.extraScopesToConsent || []];
  if (IAA(I, Y, !0, A.authority.options.OIDCOptions?.defaultScopes), JAA(I, Q.redirectUri), XAA(I, Z), Gs1(I, Q.responseMode), VAA(I), Q.prompt) Js1(I, Q.prompt), G?.addFields({
    prompt: Q.prompt
  }, Z);
  if (Q.domainHint) Ys1(I, Q.domainHint), G?.addFields({
    domainHintFromRequest: !0
  }, Z);
  if (Q.prompt !== Al.SELECT_ACCOUNT) {
    if (Q.sid && Q.prompt === Al.NONE) B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"), hA1(I, Q.sid), G?.addFields({
      sidFromRequest: !0
    }, Z);
    else if (Q.account) {
      let J = La6(Q.account),
        W = Ma6(Q.account);
      if (W && Q.domainHint) B.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'), W = null;
      if (W) {
        B.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"), yZA(I, W), G?.addFields({
          loginHintFromClaim: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (J && Q.prompt === Al.NONE) {
        B.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"), hA1(I, J), G?.addFields({
          sidFromClaim: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"), yZA(I, Q.loginHint), Dl(I, Q.loginHint), G?.addFields({
        loginHintFromRequest: !0
      }, Z);
      else if (Q.account.username) {
        B.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"), yZA(I, Q.account.username), G?.addFields({
          loginHintFromUpn: !0
        }, Z);
        try {
          let X = Fk(Q.account.homeAccountId);
          df(I, X)
        } catch (X) {
          B.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")
        }
      }
    } else if (Q.loginHint) B.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"), yZA(I, Q.loginHint), Dl(I, Q.loginHint), G?.addFields({
      loginHintFromRequest: !0
    }, Z)
  } else B.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");
  if (Q.nonce) Ws1(I, Q.nonce);
  if (Q.state) iqA(I, Q.state);
  if (Q.claims || A.clientCapabilities && A.clientCapabilities.length > 0) WAA(I, Q.claims, A.clientCapabilities);
  if (Q.embeddedClientId) pf(I, A.clientId, A.redirectUri);
  if (A.instanceAware && (!Q.extraQueryParameters || !Object.keys(Q.extraQueryParameters).includes(_ZA))) oqA(I);
  return I
}
// @from(Start 8098231, End 8098340)
function wa6(A, Q, B, G) {
  let Z = Kk(Q, B, G);
  return w8.appendQueryString(A.authorizationEndpoint, Z)
}
// @from(Start 8098342, End 8098415)
function qa6(A, Q) {
  if (paB(A, Q), !A.code) throw b0(ce);
  return A
}
// @from(Start 8098417, End 8099084)
function paB(A, Q) {
  if (!A.state || !Q) throw A.state ? b0(Zl, "Cached State") : b0(Zl, "Server State");
  let B, G;
  try {
    B = decodeURIComponent(A.state)
  } catch (Z) {
    throw b0(gT, A.state)
  }
  try {
    G = decodeURIComponent(Q)
  } catch (Z) {
    throw b0(gT, A.state)
  }
  if (B !== G) throw b0(xe);
  if (A.error || A.error_description || A.suberror) {
    let Z = Na6(A);
    if (tA1(A.error, A.error_description, A.suberror)) throw new Wq(A.error || "", A.error_description, A.suberror, A.timestamp || "", A.trace_id || "", A.correlation_id || "", A.claims || "", Z);
    throw new $E(A.error || "", A.error_description, A.suberror, Z)
  }
}
// @from(Start 8099086, End 8099212)
function Na6(A) {
  let B = A.error_uri?.lastIndexOf("code=");
  return B && B >= 0 ? A.error_uri?.substring(B + 5) : void 0
}
// @from(Start 8099214, End 8099271)
function La6(A) {
  return A.idTokenClaims?.sid || null
}
// @from(Start 8099273, End 8099352)
function Ma6(A) {
  return A.loginHint || A.idTokenClaims?.login_hint || null
}
// @from(Start 8099357, End 8099507)
laB = L(() => {
  xZA();
  kZA();
  mZ();
  PZA();
  QAA();
  Kl();
  dX();
  WNA();
  fZA();
  SW(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8099510, End 8100029)
function Oa6(A) {
  let {
    skus: Q,
    libraryName: B,
    libraryVersion: G,
    extensionName: Z,
    extensionVersion: I
  } = A, Y = new Map([
    [0, [B, G]],
    [2, [Z, I]]
  ]), J = [];
  if (Q?.length) {
    if (J = Q.split(iaB), J.length < 4) return Q
  } else J = Array.from({
    length: 4
  }, () => naB);
  return Y.forEach((W, X) => {
    if (W.length === 2 && W[0]?.length && W[1]?.length) Ra6({
      skuArr: J,
      index: X,
      skuName: W[0],
      skuVersion: W[1]
    })
  }), J.join(iaB)
}
// @from(Start 8100031, End 8100185)
function Ra6(A) {
  let {
    skuArr: Q,
    index: B,
    skuName: G,
    skuVersion: Z
  } = A;
  if (B >= Q.length) return;
  Q[B] = [G, Z].join(naB)
}
// @from(Start 8100186, End 8104272)
class zl {
  constructor(A, Q) {
    this.cacheOutcome = FZ.NOT_APPLICABLE, this.cacheManager = Q, this.apiId = A.apiId, this.correlationId = A.correlationId, this.wrapperSKU = A.wrapperSKU || L0.EMPTY_STRING, this.wrapperVer = A.wrapperVer || L0.EMPTY_STRING, this.telemetryCacheKey = _V.CACHE_KEY + yf.CACHE_KEY_SEPARATOR + A.clientId
  }
  generateCurrentRequestHeaderValue() {
    let A = `${this.apiId}${_V.VALUE_SEPARATOR}${this.cacheOutcome}`,
      Q = [this.wrapperSKU, this.wrapperVer],
      B = this.getNativeBrokerErrorCode();
    if (B?.length) Q.push(`broker_error=${B}`);
    let G = Q.join(_V.VALUE_SEPARATOR),
      Z = this.getRegionDiscoveryFields(),
      I = [A, Z].join(_V.VALUE_SEPARATOR);
    return [_V.SCHEMA_VERSION, I, G].join(_V.CATEGORY_SEPARATOR)
  }
  generateLastRequestHeaderValue() {
    let A = this.getLastRequests(),
      Q = zl.maxErrorsToSend(A),
      B = A.failedRequests.slice(0, 2 * Q).join(_V.VALUE_SEPARATOR),
      G = A.errors.slice(0, Q).join(_V.VALUE_SEPARATOR),
      Z = A.errors.length,
      I = Q < Z ? _V.OVERFLOW_TRUE : _V.OVERFLOW_FALSE,
      Y = [Z, I].join(_V.VALUE_SEPARATOR);
    return [_V.SCHEMA_VERSION, A.cacheHits, B, G, Y].join(_V.CATEGORY_SEPARATOR)
  }
  cacheFailedRequest(A) {
    let Q = this.getLastRequests();
    if (Q.errors.length >= _V.MAX_CACHED_ERRORS) Q.failedRequests.shift(), Q.failedRequests.shift(), Q.errors.shift();
    if (Q.failedRequests.push(this.apiId, this.correlationId), A instanceof Error && !!A && A.toString())
      if (A instanceof t4)
        if (A.subError) Q.errors.push(A.subError);
        else if (A.errorCode) Q.errors.push(A.errorCode);
    else Q.errors.push(A.toString());
    else Q.errors.push(A.toString());
    else Q.errors.push(_V.UNKNOWN_ERROR);
    this.cacheManager.setServerTelemetry(this.telemetryCacheKey, Q, this.correlationId);
    return
  }
  incrementCacheHits() {
    let A = this.getLastRequests();
    return A.cacheHits += 1, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, A, this.correlationId), A.cacheHits
  }
  getLastRequests() {
    let A = {
      failedRequests: [],
      errors: [],
      cacheHits: 0
    };
    return this.cacheManager.getServerTelemetry(this.telemetryCacheKey) || A
  }
  clearTelemetryCache() {
    let A = this.getLastRequests(),
      Q = zl.maxErrorsToSend(A),
      B = A.errors.length;
    if (Q === B) this.cacheManager.removeItem(this.telemetryCacheKey, this.correlationId);
    else {
      let G = {
        failedRequests: A.failedRequests.slice(Q * 2),
        errors: A.errors.slice(Q),
        cacheHits: 0
      };
      this.cacheManager.setServerTelemetry(this.telemetryCacheKey, G, this.correlationId)
    }
  }
  static maxErrorsToSend(A) {
    let Q, B = 0,
      G = 0,
      Z = A.errors.length;
    for (Q = 0; Q < Z; Q++) {
      let I = A.failedRequests[2 * Q] || L0.EMPTY_STRING,
        Y = A.failedRequests[2 * Q + 1] || L0.EMPTY_STRING,
        J = A.errors[Q] || L0.EMPTY_STRING;
      if (G += I.toString().length + Y.toString().length + J.length + 3, G < _V.MAX_LAST_HEADER_BYTES) B += 1;
      else break
    }
    return B
  }
  getRegionDiscoveryFields() {
    let A = [];
    return A.push(this.regionUsed || L0.EMPTY_STRING), A.push(this.regionSource || L0.EMPTY_STRING), A.push(this.regionOutcome || L0.EMPTY_STRING), A.join(",")
  }
  updateRegionDiscoveryMetadata(A) {
    this.regionUsed = A.region_used, this.regionSource = A.region_source, this.regionOutcome = A.region_outcome
  }
  setCacheOutcome(A) {
    this.cacheOutcome = A
  }
  setNativeBrokerErrorCode(A) {
    let Q = this.getLastRequests();
    Q.nativeBrokerErrorCode = A, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, Q, this.correlationId)
  }
  getNativeBrokerErrorCode() {
    return this.getLastRequests().nativeBrokerErrorCode
  }
  clearNativeBrokerErrorCode() {
    let A = this.getLastRequests();
    delete A.nativeBrokerErrorCode, this.cacheManager.setServerTelemetry(this.telemetryCacheKey, A, this.correlationId)
  }
  static makeExtraSkuString(A) {
    return Oa6(A)
  }
}
// @from(Start 8104277, End 8104286)
iaB = ","
// @from(Start 8104290, End 8104299)
naB = "|"
// @from(Start 8104305, End 8104385)
aaB = L(() => {
  mZ();
  PM(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8104391, End 8104778)
p7 = L(() => {
  maB();
  daB();
  caB();
  INA();
  dqA();
  pA1();
  LA1();
  hqA();
  Ea1();
  TA1();
  Kl();
  Za1();
  laB();
  xZA();
  XNA();
  bqA();
  wA1();
  WNA();
  rA1();
  PM();
  Aa1();
  fZA();
  dX();
  SW();
  Vl();
  uf();
  mZ();
  Fl();
  aaB();
  jZA();
  $s1();
  dA1();
  Hl();
  QAA();
  kZA();
  Ms1();
  B11(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8104780, End 8108142)
class Ul {
  static deserializeJSONBlob(A) {
    return !A ? {} : JSON.parse(A)
  }
  static deserializeAccounts(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          realm: G.realm,
          localAccountId: G.local_account_id,
          username: G.username,
          authorityType: G.authority_type,
          name: G.name,
          clientInfo: G.client_info,
          lastModificationTime: G.last_modification_time,
          lastModificationApp: G.last_modification_app,
          tenantProfiles: G.tenantProfiles?.map((Y) => {
            return JSON.parse(Y)
          }),
          lastUpdatedAt: Date.now().toString()
        },
        I = new cX;
      BAA.toObject(I, Z), Q[B] = I
    });
    return Q
  }
  static deserializeIdTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          realm: G.realm,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeAccessTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          realm: G.realm,
          target: G.target,
          cachedAt: G.cached_at,
          expiresOn: G.expires_on,
          extendedExpiresOn: G.extended_expires_on,
          refreshOn: G.refresh_on,
          keyId: G.key_id,
          tokenType: G.token_type,
          requestedClaims: G.requestedClaims,
          requestedClaimsHash: G.requestedClaimsHash,
          userAssertionHash: G.userAssertionHash,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeRefreshTokens(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
      let G = A[B],
        Z = {
          homeAccountId: G.home_account_id,
          environment: G.environment,
          credentialType: G.credential_type,
          clientId: G.client_id,
          secret: G.secret,
          familyId: G.family_id,
          target: G.target,
          realm: G.realm,
          lastUpdatedAt: Date.now().toString()
        };
      Q[B] = Z
    });
    return Q
  }
  static deserializeAppMetadata(A) {
    let Q = {};
    if (A) Object.keys(A).map(function(B) {
      let G = A[B];
      Q[B] = {
        clientId: G.client_id,
        environment: G.environment,
        familyId: G.family_id
      }
    });
    return Q
  }
  static deserializeAllCache(A) {
    return {
      accounts: A.Account ? this.deserializeAccounts(A.Account) : {},
      idTokens: A.IdToken ? this.deserializeIdTokens(A.IdToken) : {},
      accessTokens: A.AccessToken ? this.deserializeAccessTokens(A.AccessToken) : {},
      refreshTokens: A.RefreshToken ? this.deserializeRefreshTokens(A.RefreshToken) : {},
      appMetadata: A.AppMetadata ? this.deserializeAppMetadata(A.AppMetadata) : {}
    }
  }
}
// @from(Start 8108147, End 8108215)
I11 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8108221, End 8108229)
Os1 = {}
// @from(Start 8108298, End 8108376)
saB = L(() => {
  EA1();
  I11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8108382, End 8108422)
raB = "system_assigned_managed_identity"
// @from(Start 8108426, End 8108450)
ya6 = "managed_identity"
// @from(Start 8108454, End 8108457)
Rs1
// @from(Start 8108459, End 8108461)
TU
// @from(Start 8108463, End 8108465)
pX
// @from(Start 8108467, End 8108469)
C4
// @from(Start 8108471, End 8108473)
S4
// @from(Start 8108475, End 8108477)
iY
// @from(Start 8108479, End 8108481)
zI
// @from(Start 8108483, End 8108486)
Y11
// @from(Start 8108488, End 8108507)
oaB = "REGION_NAME"
// @from(Start 8108511, End 8108536)
taB = "MSAL_FORCE_REGION"
// @from(Start 8108540, End 8108548)
eaB = 32
// @from(Start 8108552, End 8108555)
AsB
// @from(Start 8108557, End 8108560)
J11
// @from(Start 8108562, End 8108565)
Ts1
// @from(Start 8108567, End 8108569)
qE
// @from(Start 8108571, End 8108573)
af
// @from(Start 8108575, End 8108577)
_M
// @from(Start 8108579, End 8108582)
W11
// @from(Start 8108584, End 8108594)
QsB = 4096
// @from(Start 8108600, End 8111030)
UI = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Rs1 = `https://login.microsoftonline.com/${ya6}/`, TU = {
    AUTHORIZATION_HEADER_NAME: "Authorization",
    METADATA_HEADER_NAME: "Metadata",
    APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
    ML_AND_SF_SECRET_HEADER_NAME: "secret"
  }, pX = {
    API_VERSION: "api-version",
    RESOURCE: "resource",
    SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
    XMS_CC: "xms_cc"
  }, C4 = {
    AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
    DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
    IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
    IDENTITY_HEADER: "IDENTITY_HEADER",
    IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
    IMDS_ENDPOINT: "IMDS_ENDPOINT",
    MSI_ENDPOINT: "MSI_ENDPOINT",
    MSI_SECRET: "MSI_SECRET"
  }, S4 = {
    APP_SERVICE: "AppService",
    AZURE_ARC: "AzureArc",
    CLOUD_SHELL: "CloudShell",
    DEFAULT_TO_IMDS: "DefaultToImds",
    IMDS: "Imds",
    MACHINE_LEARNING: "MachineLearning",
    SERVICE_FABRIC: "ServiceFabric"
  }, iY = {
    SYSTEM_ASSIGNED: "system-assigned",
    USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
    USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
    USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
  }, zI = {
    GET: "get",
    POST: "post"
  }, Y11 = {
    SUCCESS_RANGE_START: o4.SUCCESS_RANGE_START,
    SUCCESS_RANGE_END: o4.SUCCESS_RANGE_END,
    SERVER_ERROR: o4.SERVER_ERROR
  }, AsB = {
    SHA256: "sha256"
  }, J11 = {
    CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  }, Ts1 = {
    KEY_SEPARATOR: "-"
  }, qE = {
    MSAL_SKU: "msal.js.node",
    JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    AUTHORIZATION_PENDING: "authorization_pending",
    HTTP_PROTOCOL: "http://",
    LOCALHOST: "localhost"
  }, af = {
    acquireTokenSilent: 62,
    acquireTokenByUsernamePassword: 371,
    acquireTokenByDeviceCode: 671,
    acquireTokenByClientCredential: 771,
    acquireTokenByCode: 871,
    acquireTokenByRefreshToken: 872
  }, _M = {
    RSA_256: "RS256",
    PSS_256: "PS256",
    X5T_256: "x5t#S256",
    X5T: "x5t",
    X5C: "x5c",
    AUDIENCE: "aud",
    EXPIRATION_TIME: "exp",
    ISSUER: "iss",
    SUBJECT: "sub",
    NOT_BEFORE: "nbf",
    JWT_ID: "jti"
  }, W11 = {
    INTERVAL_MS: 100,
    TIMEOUT_MS: 5000
  }
})
// @from(Start 8111032, End 8111651)
class FNA {
  static getNetworkResponse(A, Q, B) {
    return {
      headers: A,
      body: Q,
      status: B
    }
  }
  static urlToHttpOptions(A) {
    let Q = {
      protocol: A.protocol,
      hostname: A.hostname && A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname,
      hash: A.hash,
      search: A.search,
      pathname: A.pathname,
      path: `${A.pathname||""}${A.search||""}`,
      href: A.href
    };
    if (A.port !== "") Q.port = Number(A.port);
    if (A.username || A.password) Q.auth = `${decodeURIComponent(A.username)}:${decodeURIComponent(A.password)}`;
    return Q
  }
}
// @from(Start 8111656, End 8111718)
BsB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8111769, End 8112259)
class KNA {
  constructor(A, Q) {
    this.proxyUrl = A || "", this.customAgentOptions = Q || {}
  }
  async sendGetRequestAsync(A, Q, B) {
    if (this.proxyUrl) return ZsB(A, this.proxyUrl, zI.GET, Q, this.customAgentOptions, B);
    else return IsB(A, zI.GET, Q, this.customAgentOptions, B)
  }
  async sendPostRequestAsync(A, Q) {
    if (this.proxyUrl) return ZsB(A, this.proxyUrl, zI.POST, Q, this.customAgentOptions);
    else return IsB(A, zI.POST, Q, this.customAgentOptions)
  }
}
// @from(Start 8112264, End 8114503)
ZsB = (A, Q, B, G, Z, I) => {
    let Y = new URL(A),
      J = new URL(Q),
      W = G?.headers || {},
      X = {
        host: J.hostname,
        port: J.port,
        method: "CONNECT",
        path: Y.hostname,
        headers: W
      };
    if (Z && Object.keys(Z).length) X.agent = new Ps1.Agent(Z);
    let V = "";
    if (B === zI.POST) {
      let K = G?.body || "";
      V = `Content-Type: application/x-www-form-urlencoded\r
Content-Length: ${K.length}\r
\r
${K}`
    } else if (I) X.timeout = I;
    let F = `${B.toUpperCase()} ${Y.href} HTTP/1.1\r
Host: ${Y.host}\r
Connection: close\r
` + V + `\r
`;
    return new Promise((K, D) => {
      let H = Ps1.request(X);
      if (I) H.on("timeout", () => {
        H.destroy(), D(Error("Request time out"))
      });
      H.end(), H.on("connect", (C, E) => {
        let U = C?.statusCode || Y11.SERVER_ERROR;
        if (U < Y11.SUCCESS_RANGE_START || U > Y11.SUCCESS_RANGE_END) H.destroy(), E.destroy(), D(Error(`Error connecting to proxy. Http status code: ${C.statusCode}. Http status message: ${C?.statusMessage||"Unknown"}`));
        E.write(F);
        let q = [];
        E.on("data", (w) => {
          q.push(w)
        }), E.on("end", () => {
          let N = Buffer.concat([...q]).toString().split(`\r
`),
            R = parseInt(N[0].split(" ")[1]),
            T = N[0].split(" ").slice(2).join(" "),
            y = N[N.length - 1],
            v = N.slice(1, N.length - 2),
            x = new Map;
          v.forEach((l) => {
            let k = l.split(new RegExp(/:\s(.*)/s)),
              m = k[0],
              o = k[1];
            try {
              let IA = JSON.parse(o);
              if (IA && typeof IA === "object") o = IA
            } catch (IA) {}
            x.set(m, o)
          });
          let u = Object.fromEntries(x),
            e = FNA.getNetworkResponse(u, YsB(R, T, u, y), R);
          if ((R < o4.SUCCESS_RANGE_START || R > o4.SUCCESS_RANGE_END) && e.body.error !== qE.AUTHORIZATION_PENDING) H.destroy();
          K(e)
        }), E.on("error", (w) => {
          H.destroy(), E.destroy(), D(Error(w.toString()))
        })
      }), H.on("error", (C) => {
        H.destroy(), D(Error(C.toString()))
      })
    })
  }
// @from(Start 8114507, End 8115786)
IsB = (A, Q, B, G, Z) => {
    let I = Q === zI.POST,
      Y = B?.body || "",
      J = new URL(A),
      W = B?.headers || {},
      X = {
        method: Q,
        headers: W,
        ...FNA.urlToHttpOptions(J)
      };
    if (G && Object.keys(G).length) X.agent = new GsB.Agent(G);
    if (I) X.headers = {
      ...X.headers,
      "Content-Length": Y.length
    };
    else if (Z) X.timeout = Z;
    return new Promise((V, F) => {
      let K;
      if (X.protocol === "http:") K = Ps1.request(X);
      else K = GsB.request(X);
      if (I) K.write(Y);
      if (Z) K.on("timeout", () => {
        K.destroy(), F(Error("Request time out"))
      });
      K.end(), K.on("response", (D) => {
        let {
          headers: H,
          statusCode: C,
          statusMessage: E
        } = D, U = [];
        D.on("data", (q) => {
          U.push(q)
        }), D.on("end", () => {
          let q = Buffer.concat([...U]).toString(),
            w = H,
            N = FNA.getNetworkResponse(w, YsB(C, E, w, q), C);
          if ((C < o4.SUCCESS_RANGE_START || C > o4.SUCCESS_RANGE_END) && N.body.error !== qE.AUTHORIZATION_PENDING) K.destroy();
          V(N)
        })
      }), K.on("error", (D) => {
        K.destroy(), F(Error(D.toString()))
      })
    })
  }
// @from(Start 8115790, End 8116375)
YsB = (A, Q, B, G) => {
    let Z;
    try {
      Z = JSON.parse(G)
    } catch (I) {
      let Y, J;
      if (A >= o4.CLIENT_ERROR_RANGE_START && A <= o4.CLIENT_ERROR_RANGE_END) Y = "client_error", J = "A client";
      else if (A >= o4.SERVER_ERROR_RANGE_START && A <= o4.SERVER_ERROR_RANGE_END) Y = "server_error", J = "A server";
      else Y = "unknown_error", J = "An unknown";
      Z = {
        error: Y,
        error_description: `${J} error occured.
Http status code: ${A}
Http status message: ${Q||"Unknown"}
Headers: ${JSON.stringify(B)}`
      }
    }
    return Z
  }
// @from(Start 8116381, End 8116466)
JsB = L(() => {
  p7();
  UI();
  BsB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8116472, End 8116502)
X11 = "invalid_file_extension"
// @from(Start 8116506, End 8116531)
V11 = "invalid_file_path"
// @from(Start 8116535, End 8116574)
$l = "invalid_managed_identity_id_type"
// @from(Start 8116578, End 8116600)
F11 = "invalid_secret"
// @from(Start 8116604, End 8116629)
WsB = "missing_client_id"
// @from(Start 8116633, End 8116660)
XsB = "network_unavailable"
// @from(Start 8116664, End 8116694)
K11 = "platform_not_supported"
// @from(Start 8116698, End 8116732)
D11 = "unable_to_create_azure_arc"
// @from(Start 8116736, End 8116772)
H11 = "unable_to_create_cloud_shell"
// @from(Start 8116776, End 8116807)
C11 = "unable_to_create_source"
// @from(Start 8116811, End 8116845)
DNA = "unable_to_read_secret_file"
// @from(Start 8116849, End 8116895)
VsB = "user_assigned_not_available_at_runtime"
// @from(Start 8116899, End 8116938)
E11 = "www_authenticate_header_missing"
// @from(Start 8116942, End 8116992)
z11 = "www_authenticate_header_unsupported_format"
// @from(Start 8116996, End 8116999)
KAA
// @from(Start 8117005, End 8117352)
DAA = L(() => {
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  KAA = {
    [C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]: "azure_pod_identity_authority_host_url_malformed",
    [C4.IDENTITY_ENDPOINT]: "identity_endpoint_url_malformed",
    [C4.IMDS_ENDPOINT]: "imds_endpoint_url_malformed",
    [C4.MSI_ENDPOINT]: "msi_endpoint_url_malformed"
  }
})
// @from(Start 8117355, End 8117393)
function _W(A) {
  return new js1(A)
}
// @from(Start 8117398, End 8117401)
xa6
// @from(Start 8117403, End 8117406)
js1
// @from(Start 8117412, End 8119440)
uZA = L(() => {
  p7();
  DAA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  xa6 = {
    [X11]: "The file path in the WWW-Authenticate header does not contain a .key file.",
    [V11]: "The file path in the WWW-Authenticate header is not in a valid Windows or Linux Format.",
    [$l]: "More than one ManagedIdentityIdType was provided.",
    [F11]: "The secret in the file on the file path in the WWW-Authenticate header is greater than 4096 bytes.",
    [K11]: "The platform is not supported by Azure Arc. Azure Arc only supports Windows and Linux.",
    [WsB]: "A ManagedIdentityId id was not provided.",
    [KAA.AZURE_POD_IDENTITY_AUTHORITY_HOST]: `The Managed Identity's '${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST}' environment variable is malformed.`,
    [KAA.IDENTITY_ENDPOINT]: `The Managed Identity's '${C4.IDENTITY_ENDPOINT}' environment variable is malformed.`,
    [KAA.IMDS_ENDPOINT]: `The Managed Identity's '${C4.IMDS_ENDPOINT}' environment variable is malformed.`,
    [KAA.MSI_ENDPOINT]: `The Managed Identity's '${C4.MSI_ENDPOINT}' environment variable is malformed.`,
    [XsB]: "Authentication unavailable. The request to the managed identity endpoint timed out.",
    [D11]: "Azure Arc Managed Identities can only be system assigned.",
    [H11]: "Cloud Shell Managed Identities can only be system assigned.",
    [C11]: "Unable to create a Managed Identity source based on environment variables.",
    [DNA]: "Unable to read the secret file.",
    [VsB]: "Service Fabric user assigned managed identity ClientId or ResourceId is not configurable at runtime.",
    [E11]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is missing.",
    [z11]: "A 401 response was received form the Azure Arc Managed Identity, but the www-authenticate header is in an unsupported format."
  };
  js1 = class js1 extends t4 {
    constructor(A) {
      super(A, xa6[A]);
      this.name = "ManagedIdentityError", Object.setPrototypeOf(this, js1.prototype)
    }
  }
})
// @from(Start 8119442, End 8120137)
class Ss1 {
  get id() {
    return this._id
  }
  set id(A) {
    this._id = A
  }
  get idType() {
    return this._idType
  }
  set idType(A) {
    this._idType = A
  }
  constructor(A) {
    let Q = A?.userAssignedClientId,
      B = A?.userAssignedResourceId,
      G = A?.userAssignedObjectId;
    if (Q) {
      if (B || G) throw _W($l);
      this.id = Q, this.idType = iY.USER_ASSIGNED_CLIENT_ID
    } else if (B) {
      if (Q || G) throw _W($l);
      this.id = B, this.idType = iY.USER_ASSIGNED_RESOURCE_ID
    } else if (G) {
      if (Q || B) throw _W($l);
      this.id = G, this.idType = iY.USER_ASSIGNED_OBJECT_ID
    } else this.id = raB, this.idType = iY.SYSTEM_ASSIGNED
  }
}
// @from(Start 8120142, End 8120228)
FsB = L(() => {
  uZA();
  UI();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8120234, End 8120236)
lX
// @from(Start 8120238, End 8120240)
WY
// @from(Start 8120246, End 8123177)
HNA = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  lX = {
    invalidLoopbackAddressType: {
      code: "invalid_loopback_server_address_type",
      desc: "Loopback server address is not type string. This is unexpected."
    },
    unableToLoadRedirectUri: {
      code: "unable_to_load_redirectUrl",
      desc: "Loopback server callback was invoked without a url. This is unexpected."
    },
    noAuthCodeInResponse: {
      code: "no_auth_code_in_response",
      desc: "No auth code found in the server response. Please check your network trace to determine what happened."
    },
    noLoopbackServerExists: {
      code: "no_loopback_server_exists",
      desc: "No loopback server exists yet."
    },
    loopbackServerAlreadyExists: {
      code: "loopback_server_already_exists",
      desc: "Loopback server already exists. Cannot create another."
    },
    loopbackServerTimeout: {
      code: "loopback_server_timeout",
      desc: "Timed out waiting for auth code listener to be registered."
    },
    stateNotFoundError: {
      code: "state_not_found",
      desc: "State not found. Please verify that the request originated from msal."
    },
    thumbprintMissing: {
      code: "thumbprint_missing_from_client_certificate",
      desc: "Client certificate does not contain a SHA-1 or SHA-256 thumbprint."
    },
    redirectUriNotSupported: {
      code: "redirect_uri_not_supported",
      desc: "RedirectUri is not supported in this scenario. Please remove redirectUri from the request."
    }
  };
  WY = class WY extends t4 {
    constructor(A, Q) {
      super(A, Q);
      this.name = "NodeAuthError"
    }
    static createInvalidLoopbackAddressTypeError() {
      return new WY(lX.invalidLoopbackAddressType.code, `${lX.invalidLoopbackAddressType.desc}`)
    }
    static createUnableToLoadRedirectUrlError() {
      return new WY(lX.unableToLoadRedirectUri.code, `${lX.unableToLoadRedirectUri.desc}`)
    }
    static createNoAuthCodeInResponseError() {
      return new WY(lX.noAuthCodeInResponse.code, `${lX.noAuthCodeInResponse.desc}`)
    }
    static createNoLoopbackServerExistsError() {
      return new WY(lX.noLoopbackServerExists.code, `${lX.noLoopbackServerExists.desc}`)
    }
    static createLoopbackServerAlreadyExistsError() {
      return new WY(lX.loopbackServerAlreadyExists.code, `${lX.loopbackServerAlreadyExists.desc}`)
    }
    static createLoopbackServerTimeoutError() {
      return new WY(lX.loopbackServerTimeout.code, `${lX.loopbackServerTimeout.desc}`)
    }
    static createStateNotFoundError() {
      return new WY(lX.stateNotFoundError.code, lX.stateNotFoundError.desc)
    }
    static createThumbprintMissingError() {
      return new WY(lX.thumbprintMissing.code, lX.thumbprintMissing.desc)
    }
    static createRedirectUriNotSupportedError() {
      return new WY(lX.redirectUriNotSupported.code, lX.redirectUriNotSupported.desc)
    }
  }
})
// @from(Start 8123180, End 8123832)
function KsB({
  auth: A,
  broker: Q,
  cache: B,
  system: G,
  telemetry: Z
}) {
  let I = {
    ...fa6,
    networkClient: new KNA(G?.proxyUrl, G?.customAgentOptions),
    loggerOptions: G?.loggerOptions || _s1,
    disableInternalRetries: G?.disableInternalRetries || !1
  };
  if (!!A.clientCertificate && !A.clientCertificate.thumbprint && !A.clientCertificate.thumbprintSha256) throw WY.createStateNotFoundError();
  return {
    auth: {
      ...va6,
      ...A
    },
    broker: {
      ...Q
    },
    cache: {
      ...ba6,
      ...B
    },
    system: {
      ...I,
      ...G
    },
    telemetry: {
      ...ha6,
      ...Z
    }
  }
}
// @from(Start 8123834, End 8124287)
function DsB({
  clientCapabilities: A,
  managedIdentityIdParams: Q,
  system: B
}) {
  let G = new Ss1(Q),
    Z = B?.loggerOptions || _s1,
    I;
  if (B?.networkClient) I = B.networkClient;
  else I = new KNA(B?.proxyUrl, B?.customAgentOptions);
  return {
    clientCapabilities: A || [],
    managedIdentityId: G,
    system: {
      loggerOptions: Z,
      networkClient: I
    },
    disableInternalRetries: B?.disableInternalRetries || !1
  }
}
// @from(Start 8124292, End 8124295)
va6
// @from(Start 8124297, End 8124300)
ba6
// @from(Start 8124302, End 8124305)
_s1
// @from(Start 8124307, End 8124310)
fa6
// @from(Start 8124312, End 8124315)
ha6
// @from(Start 8124321, End 8125468)
ks1 = L(() => {
  p7();
  JsB();
  FsB();
  HNA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  va6 = {
    clientId: L0.EMPTY_STRING,
    authority: L0.DEFAULT_AUTHORITY,
    clientSecret: L0.EMPTY_STRING,
    clientAssertion: L0.EMPTY_STRING,
    clientCertificate: {
      thumbprint: L0.EMPTY_STRING,
      thumbprintSha256: L0.EMPTY_STRING,
      privateKey: L0.EMPTY_STRING,
      x5c: L0.EMPTY_STRING
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: L0.EMPTY_STRING,
    authorityMetadata: L0.EMPTY_STRING,
    clientCapabilities: [],
    protocolMode: aH.AAD,
    azureCloudOptions: {
      azureCloudInstance: hf.None,
      tenant: L0.EMPTY_STRING
    },
    skipAuthorityMetadataCache: !1,
    encodeExtraQueryParams: !1
  }, ba6 = {
    claimsBasedCachingEnabled: !1
  }, _s1 = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: lY.Info
  }, fa6 = {
    loggerOptions: _s1,
    networkClient: new KNA,
    proxyUrl: L0.EMPTY_STRING,
    customAgentOptions: {},
    disableInternalRetries: !1
  }, ha6 = {
    application: {
      appName: L0.EMPTY_STRING,
      appVersion: L0.EMPTY_STRING
    }
  }
})
// @from(Start 8125474, End 8125886)
ys1 = z((HsB) => {
  Object.defineProperty(HsB, "__esModule", {
    value: !0
  });
  HsB.default = ma6;
  var ga6 = ua6(UA("crypto"));

  function ua6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var $11 = new Uint8Array(256),
    U11 = $11.length;

  function ma6() {
    if (U11 > $11.length - 16) ga6.default.randomFillSync($11), U11 = 0;
    return $11.slice(U11, U11 += 16)
  }
})
// @from(Start 8125892, End 8126153)
zsB = z((CsB) => {
  Object.defineProperty(CsB, "__esModule", {
    value: !0
  });
  CsB.default = void 0;
  var ca6 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  CsB.default = ca6
})
// @from(Start 8126159, End 8126496)
CNA = z((UsB) => {
  Object.defineProperty(UsB, "__esModule", {
    value: !0
  });
  UsB.default = void 0;
  var pa6 = la6(zsB());

  function la6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function ia6(A) {
    return typeof A === "string" && pa6.default.test(A)
  }
  var na6 = ia6;
  UsB.default = na6
})
// @from(Start 8126502, End 8127268)
ENA = z((wsB) => {
  Object.defineProperty(wsB, "__esModule", {
    value: !0
  });
  wsB.default = void 0;
  var aa6 = sa6(CNA());

  function sa6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var RD = [];
  for (let A = 0; A < 256; ++A) RD.push((A + 256).toString(16).substr(1));

  function ra6(A, Q = 0) {
    let B = (RD[A[Q + 0]] + RD[A[Q + 1]] + RD[A[Q + 2]] + RD[A[Q + 3]] + "-" + RD[A[Q + 4]] + RD[A[Q + 5]] + "-" + RD[A[Q + 6]] + RD[A[Q + 7]] + "-" + RD[A[Q + 8]] + RD[A[Q + 9]] + "-" + RD[A[Q + 10]] + RD[A[Q + 11]] + RD[A[Q + 12]] + RD[A[Q + 13]] + RD[A[Q + 14]] + RD[A[Q + 15]]).toLowerCase();
    if (!(0, aa6.default)(B)) throw TypeError("Stringified UUID is invalid");
    return B
  }
  var oa6 = ra6;
  wsB.default = oa6
})
// @from(Start 8127274, End 8128806)
RsB = z((MsB) => {
  Object.defineProperty(MsB, "__esModule", {
    value: !0
  });
  MsB.default = void 0;
  var ta6 = LsB(ys1()),
    ea6 = LsB(ENA());

  function LsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var NsB, xs1, vs1 = 0,
    bs1 = 0;

  function As6(A, Q, B) {
    let G = Q && B || 0,
      Z = Q || Array(16);
    A = A || {};
    let I = A.node || NsB,
      Y = A.clockseq !== void 0 ? A.clockseq : xs1;
    if (I == null || Y == null) {
      let K = A.random || (A.rng || ta6.default)();
      if (I == null) I = NsB = [K[0] | 1, K[1], K[2], K[3], K[4], K[5]];
      if (Y == null) Y = xs1 = (K[6] << 8 | K[7]) & 16383
    }
    let J = A.msecs !== void 0 ? A.msecs : Date.now(),
      W = A.nsecs !== void 0 ? A.nsecs : bs1 + 1,
      X = J - vs1 + (W - bs1) / 1e4;
    if (X < 0 && A.clockseq === void 0) Y = Y + 1 & 16383;
    if ((X < 0 || J > vs1) && A.nsecs === void 0) W = 0;
    if (W >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    vs1 = J, bs1 = W, xs1 = Y, J += 12219292800000;
    let V = ((J & 268435455) * 1e4 + W) % 4294967296;
    Z[G++] = V >>> 24 & 255, Z[G++] = V >>> 16 & 255, Z[G++] = V >>> 8 & 255, Z[G++] = V & 255;
    let F = J / 4294967296 * 1e4 & 268435455;
    Z[G++] = F >>> 8 & 255, Z[G++] = F & 255, Z[G++] = F >>> 24 & 15 | 16, Z[G++] = F >>> 16 & 255, Z[G++] = Y >>> 8 | 128, Z[G++] = Y & 255;
    for (let K = 0; K < 6; ++K) Z[G + K] = I[K];
    return Q || (0, ea6.default)(Z)
  }
  var Qs6 = As6;
  MsB.default = Qs6
})
// @from(Start 8128812, End 8129696)
fs1 = z((TsB) => {
  Object.defineProperty(TsB, "__esModule", {
    value: !0
  });
  TsB.default = void 0;
  var Bs6 = Gs6(CNA());

  function Gs6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Zs6(A) {
    if (!(0, Bs6.default)(A)) throw TypeError("Invalid UUID");
    let Q, B = new Uint8Array(16);
    return B[0] = (Q = parseInt(A.slice(0, 8), 16)) >>> 24, B[1] = Q >>> 16 & 255, B[2] = Q >>> 8 & 255, B[3] = Q & 255, B[4] = (Q = parseInt(A.slice(9, 13), 16)) >>> 8, B[5] = Q & 255, B[6] = (Q = parseInt(A.slice(14, 18), 16)) >>> 8, B[7] = Q & 255, B[8] = (Q = parseInt(A.slice(19, 23), 16)) >>> 8, B[9] = Q & 255, B[10] = (Q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, B[11] = Q / 4294967296 & 255, B[12] = Q >>> 24 & 255, B[13] = Q >>> 16 & 255, B[14] = Q >>> 8 & 255, B[15] = Q & 255, B
  }
  var Is6 = Zs6;
  TsB.default = Is6
})
// @from(Start 8129702, End 8130911)
hs1 = z((ksB) => {
  Object.defineProperty(ksB, "__esModule", {
    value: !0
  });
  ksB.default = Xs6;
  ksB.URL = ksB.DNS = void 0;
  var Ys6 = jsB(ENA()),
    Js6 = jsB(fs1());

  function jsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Ws6(A) {
    A = unescape(encodeURIComponent(A));
    let Q = [];
    for (let B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q
  }
  var SsB = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  ksB.DNS = SsB;
  var _sB = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  ksB.URL = _sB;

  function Xs6(A, Q, B) {
    function G(Z, I, Y, J) {
      if (typeof Z === "string") Z = Ws6(Z);
      if (typeof I === "string") I = (0, Js6.default)(I);
      if (I.length !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let W = new Uint8Array(16 + Z.length);
      if (W.set(I), W.set(Z, I.length), W = B(W), W[6] = W[6] & 15 | Q, W[8] = W[8] & 63 | 128, Y) {
        J = J || 0;
        for (let X = 0; X < 16; ++X) Y[J + X] = W[X];
        return Y
      }
      return (0, Ys6.default)(W)
    }
    try {
      G.name = A
    } catch (Z) {}
    return G.DNS = SsB, G.URL = _sB, G
  }
})
// @from(Start 8130917, End 8131375)
bsB = z((xsB) => {
  Object.defineProperty(xsB, "__esModule", {
    value: !0
  });
  xsB.default = void 0;
  var Ks6 = Ds6(UA("crypto"));

  function Ds6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Hs6(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return Ks6.default.createHash("md5").update(A).digest()
  }
  var Cs6 = Hs6;
  xsB.default = Cs6
})
// @from(Start 8131381, End 8131710)
usB = z((hsB) => {
  Object.defineProperty(hsB, "__esModule", {
    value: !0
  });
  hsB.default = void 0;
  var Es6 = fsB(hs1()),
    zs6 = fsB(bsB());

  function fsB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var Us6 = (0, Es6.default)("v3", 48, zs6.default),
    $s6 = Us6;
  hsB.default = $s6
})
// @from(Start 8131716, End 8132274)
psB = z((dsB) => {
  Object.defineProperty(dsB, "__esModule", {
    value: !0
  });
  dsB.default = void 0;
  var ws6 = msB(ys1()),
    qs6 = msB(ENA());

  function msB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Ns6(A, Q, B) {
    A = A || {};
    let G = A.random || (A.rng || ws6.default)();
    if (G[6] = G[6] & 15 | 64, G[8] = G[8] & 63 | 128, Q) {
      B = B || 0;
      for (let Z = 0; Z < 16; ++Z) Q[B + Z] = G[Z];
      return Q
    }
    return (0, qs6.default)(G)
  }
  var Ls6 = Ns6;
  dsB.default = Ls6
})
// @from(Start 8132280, End 8132739)
nsB = z((lsB) => {
  Object.defineProperty(lsB, "__esModule", {
    value: !0
  });
  lsB.default = void 0;
  var Ms6 = Os6(UA("crypto"));

  function Os6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function Rs6(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return Ms6.default.createHash("sha1").update(A).digest()
  }
  var Ts6 = Rs6;
  lsB.default = Ts6
})
// @from(Start 8132745, End 8133074)
osB = z((ssB) => {
  Object.defineProperty(ssB, "__esModule", {
    value: !0
  });
  ssB.default = void 0;
  var Ps6 = asB(hs1()),
    js6 = asB(nsB());

  function asB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var Ss6 = (0, Ps6.default)("v5", 80, js6.default),
    _s6 = Ss6;
  ssB.default = _s6
})
// @from(Start 8133080, End 8133262)
ArB = z((tsB) => {
  Object.defineProperty(tsB, "__esModule", {
    value: !0
  });
  tsB.default = void 0;
  var ks6 = "00000000-0000-0000-0000-000000000000";
  tsB.default = ks6
})
// @from(Start 8133268, End 8133653)
GrB = z((QrB) => {
  Object.defineProperty(QrB, "__esModule", {
    value: !0
  });
  QrB.default = void 0;
  var ys6 = xs6(CNA());

  function xs6(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function vs6(A) {
    if (!(0, ys6.default)(A)) throw TypeError("Invalid UUID");
    return parseInt(A.substr(14, 1), 16)
  }
  var bs6 = vs6;
  QrB.default = bs6
})
// @from(Start 8133659, End 8135075)
ZrB = z((mT) => {
  Object.defineProperty(mT, "__esModule", {
    value: !0
  });
  Object.defineProperty(mT, "v1", {
    enumerable: !0,
    get: function() {
      return fs6.default
    }
  });
  Object.defineProperty(mT, "v3", {
    enumerable: !0,
    get: function() {
      return hs6.default
    }
  });
  Object.defineProperty(mT, "v4", {
    enumerable: !0,
    get: function() {
      return gs6.default
    }
  });
  Object.defineProperty(mT, "v5", {
    enumerable: !0,
    get: function() {
      return us6.default
    }
  });
  Object.defineProperty(mT, "NIL", {
    enumerable: !0,
    get: function() {
      return ms6.default
    }
  });
  Object.defineProperty(mT, "version", {
    enumerable: !0,
    get: function() {
      return ds6.default
    }
  });
  Object.defineProperty(mT, "validate", {
    enumerable: !0,
    get: function() {
      return cs6.default
    }
  });
  Object.defineProperty(mT, "stringify", {
    enumerable: !0,
    get: function() {
      return ps6.default
    }
  });
  Object.defineProperty(mT, "parse", {
    enumerable: !0,
    get: function() {
      return ls6.default
    }
  });
  var fs6 = sf(RsB()),
    hs6 = sf(usB()),
    gs6 = sf(psB()),
    us6 = sf(osB()),
    ms6 = sf(ArB()),
    ds6 = sf(GrB()),
    cs6 = sf(CNA()),
    ps6 = sf(ENA()),
    ls6 = sf(fs1());

  function sf(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
})
// @from(Start 8135081, End 8135083)
Hk
// @from(Start 8135085, End 8135088)
UFG
// @from(Start 8135090, End 8135093)
$FG
// @from(Start 8135095, End 8135098)
IrB
// @from(Start 8135100, End 8135103)
wFG
// @from(Start 8135105, End 8135108)
qFG
// @from(Start 8135110, End 8135113)
NFG
// @from(Start 8135115, End 8135118)
LFG
// @from(Start 8135120, End 8135123)
MFG
// @from(Start 8135125, End 8135128)
OFG
// @from(Start 8135134, End 8135383)
YrB = L(() => {
  Hk = BA(ZrB(), 1), UFG = Hk.default.v1, $FG = Hk.default.v3, IrB = Hk.default.v4, wFG = Hk.default.v5, qFG = Hk.default.NIL, NFG = Hk.default.version, LFG = Hk.default.validate, MFG = Hk.default.stringify, OFG = Hk.default.parse
})
// @from(Start 8135385, End 8135552)
class zNA {
  generateGuid() {
    return IrB()
  }
  isGuid(A) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(A)
  }
}
// @from(Start 8135557, End 8135626)
gs1 = L(() => {
  YrB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8135628, End 8136101)
class PU {
  static base64Encode(A, Q) {
    return Buffer.from(A, Q).toString(MD.BASE64)
  }
  static base64EncodeUrl(A, Q) {
    return PU.base64Encode(A, Q).replace(/=/g, L0.EMPTY_STRING).replace(/\+/g, "-").replace(/\//g, "_")
  }
  static base64Decode(A) {
    return Buffer.from(A, MD.BASE64).toString("utf8")
  }
  static base64DecodeUrl(A) {
    let Q = A.replace(/-/g, "+").replace(/_/g, "/");
    while (Q.length % 4) Q += "=";
    return PU.base64Decode(Q)
  }
}
// @from(Start 8136106, End 8136174)
UNA = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8136202, End 8136290)
class HAA {
  sha256(A) {
    return is6.createHash(AsB.SHA256).update(A).digest()
  }
}
// @from(Start 8136295, End 8136363)
w11 = L(() => {
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8136391, End 8137108)
class us1 {
  constructor() {
    this.hashUtils = new HAA
  }
  async generatePkceCodes() {
    let A = this.generateCodeVerifier(),
      Q = this.generateCodeChallengeFromVerifier(A);
    return {
      verifier: A,
      challenge: Q
    }
  }
  generateCodeVerifier() {
    let A = [],
      Q = 256 - 256 % J11.CV_CHARSET.length;
    while (A.length <= eaB) {
      let G = ns6.randomBytes(1)[0];
      if (G >= Q) continue;
      let Z = G % J11.CV_CHARSET.length;
      A.push(J11.CV_CHARSET[Z])
    }
    let B = A.join(L0.EMPTY_STRING);
    return PU.base64EncodeUrl(B)
  }
  generateCodeChallengeFromVerifier(A) {
    return PU.base64EncodeUrl(this.hashUtils.sha256(A).toString(MD.BASE64), MD.BASE64)
  }
}
// @from(Start 8137113, End 8137207)
JrB = L(() => {
  p7();
  UI();
  UNA();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8137209, End 8138113)
class rf {
  constructor() {
    this.pkceGenerator = new us1, this.guidGenerator = new zNA, this.hashUtils = new HAA
  }
  base64UrlEncode() {
    throw Error("Method not implemented.")
  }
  encodeKid() {
    throw Error("Method not implemented.")
  }
  createNewGuid() {
    return this.guidGenerator.generateGuid()
  }
  base64Encode(A) {
    return PU.base64Encode(A)
  }
  base64Decode(A) {
    return PU.base64Decode(A)
  }
  generatePkceCodes() {
    return this.pkceGenerator.generatePkceCodes()
  }
  getPublicKeyThumbprint() {
    throw Error("Method not implemented.")
  }
  removeTokenBindingKey() {
    throw Error("Method not implemented.")
  }
  clearKeystore() {
    throw Error("Method not implemented.")
  }
  signJwt() {
    throw Error("Method not implemented.")
  }
  async hashString(A) {
    return PU.base64EncodeUrl(this.hashUtils.sha256(A).toString(MD.BASE64), MD.BASE64)
  }
}
// @from(Start 8138118, End 8138222)
$NA = L(() => {
  p7();
  gs1();
  UNA();
  JrB();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8138228, End 8138309)
q11 = L(() => {
  mZ();
  Ua1(); /*! @azure/msal-common v15.13.1 2025-10-29 */
})
// @from(Start 8138312, End 8138683)
function WrB(A) {
  let Q = A.credentialType === c7.REFRESH_TOKEN && A.familyId || A.clientId,
    B = A.tokenType && A.tokenType.toLowerCase() !== A5.BEARER.toLowerCase() ? A.tokenType.toLowerCase() : "";
  return [A.homeAccountId, A.environment, A.credentialType, Q, A.realm || "", A.target || "", A.requestedClaimsHash || "", B].join(Ts1.KEY_SEPARATOR).toLowerCase()
}
// @from(Start 8138685, End 8138848)
function XrB(A) {
  let Q = A.homeAccountId.split(".")[1];
  return [A.homeAccountId, A.environment, Q || A.tenantId || ""].join(Ts1.KEY_SEPARATOR).toLowerCase()
}
// @from(Start 8138853, End 8138929)
VrB = L(() => {
  p7();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8138935, End 8138938)
CAA
// @from(Start 8138944, End 8144686)
N11 = L(() => {
  p7();
  I11();
  EA1();
  q11();
  VrB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  CAA = class CAA extends BAA {
    constructor(A, Q, B, G) {
      super(Q, B, A, new SZA, G);
      this.cache = {}, this.changeEmitters = [], this.logger = A
    }
    registerChangeEmitter(A) {
      this.changeEmitters.push(A)
    }
    emitChange() {
      this.changeEmitters.forEach((A) => A.call(null))
    }
    cacheToInMemoryCache(A) {
      let Q = {
        accounts: {},
        idTokens: {},
        accessTokens: {},
        refreshTokens: {},
        appMetadata: {}
      };
      for (let B in A) {
        let G = A[B];
        if (typeof G !== "object") continue;
        if (G instanceof cX) Q.accounts[B] = G;
        else if (UE.isIdTokenEntity(G)) Q.idTokens[B] = G;
        else if (UE.isAccessTokenEntity(G)) Q.accessTokens[B] = G;
        else if (UE.isRefreshTokenEntity(G)) Q.refreshTokens[B] = G;
        else if (UE.isAppMetadataEntity(B, G)) Q.appMetadata[B] = G;
        else continue
      }
      return Q
    }
    inMemoryCacheToCache(A) {
      let Q = this.getCache();
      return Q = {
        ...Q,
        ...A.accounts,
        ...A.idTokens,
        ...A.accessTokens,
        ...A.refreshTokens,
        ...A.appMetadata
      }, Q
    }
    getInMemoryCache() {
      return this.logger.trace("Getting in-memory cache"), this.cacheToInMemoryCache(this.getCache())
    }
    setInMemoryCache(A) {
      this.logger.trace("Setting in-memory cache");
      let Q = this.inMemoryCacheToCache(A);
      this.setCache(Q), this.emitChange()
    }
    getCache() {
      return this.logger.trace("Getting cache key-value store"), this.cache
    }
    setCache(A) {
      this.logger.trace("Setting cache key value store"), this.cache = A, this.emitChange()
    }
    getItem(A) {
      return this.logger.tracePii(`Item key: ${A}`), this.getCache()[A]
    }
    setItem(A, Q) {
      this.logger.tracePii(`Item key: ${A}`);
      let B = this.getCache();
      B[A] = Q, this.setCache(B)
    }
    generateCredentialKey(A) {
      return WrB(A)
    }
    generateAccountKey(A) {
      return XrB(A)
    }
    getAccountKeys() {
      let A = this.getInMemoryCache();
      return Object.keys(A.accounts)
    }
    getTokenKeys() {
      let A = this.getInMemoryCache();
      return {
        idToken: Object.keys(A.idTokens),
        accessToken: Object.keys(A.accessTokens),
        refreshToken: Object.keys(A.refreshTokens)
      }
    }
    getAccount(A) {
      return this.getItem(A) ? Object.assign(new cX, this.getItem(A)) : null
    }
    async setAccount(A) {
      let Q = this.generateAccountKey(cX.getAccountInfo(A));
      this.setItem(Q, A)
    }
    getIdTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isIdTokenEntity(Q)) return Q;
      return null
    }
    async setIdTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAccessTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isAccessTokenEntity(Q)) return Q;
      return null
    }
    async setAccessTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getRefreshTokenCredential(A) {
      let Q = this.getItem(A);
      if (UE.isRefreshTokenEntity(Q)) return Q;
      return null
    }
    async setRefreshTokenCredential(A) {
      let Q = this.generateCredentialKey(A);
      this.setItem(Q, A)
    }
    getAppMetadata(A) {
      let Q = this.getItem(A);
      if (UE.isAppMetadataEntity(A, Q)) return Q;
      return null
    }
    setAppMetadata(A) {
      let Q = UE.generateAppMetadataKey(A);
      this.setItem(Q, A)
    }
    getServerTelemetry(A) {
      let Q = this.getItem(A);
      if (Q && UE.isServerTelemetryEntity(A, Q)) return Q;
      return null
    }
    setServerTelemetry(A, Q) {
      this.setItem(A, Q)
    }
    getAuthorityMetadata(A) {
      let Q = this.getItem(A);
      if (Q && UE.isAuthorityMetadataEntity(A, Q)) return Q;
      return null
    }
    getAuthorityMetadataKeys() {
      return this.getKeys().filter((A) => {
        return this.isAuthorityMetadata(A)
      })
    }
    setAuthorityMetadata(A, Q) {
      this.setItem(A, Q)
    }
    getThrottlingCache(A) {
      let Q = this.getItem(A);
      if (Q && UE.isThrottlingEntity(A, Q)) return Q;
      return null
    }
    setThrottlingCache(A, Q) {
      this.setItem(A, Q)
    }
    removeItem(A) {
      this.logger.tracePii(`Item key: ${A}`);
      let Q = !1,
        B = this.getCache();
      if (B[A]) delete B[A], Q = !0;
      if (Q) this.setCache(B), this.emitChange();
      return Q
    }
    removeOutdatedAccount(A) {
      this.removeItem(A)
    }
    containsKey(A) {
      return this.getKeys().includes(A)
    }
    getKeys() {
      this.logger.trace("Retrieving all cache keys");
      let A = this.getCache();
      return [...Object.keys(A)]
    }
    clear() {
      this.logger.trace("Clearing cache entries created by MSAL"), this.getKeys().forEach((Q) => {
        this.removeItem(Q)
      }), this.emitChange()
    }
    static generateInMemoryCache(A) {
      return Ul.deserializeAllCache(Ul.deserializeJSONBlob(A))
    }
    static generateJsonCache(A) {
      return Oe.serializeAllCache(A)
    }
    updateCredentialCacheKey(A, Q) {
      let B = this.generateCredentialKey(Q);
      if (A !== B) {
        let G = this.getItem(A);
        if (G) return this.removeItem(A), this.setItem(B, G), this.logger.verbose(`Updated an outdated ${Q.credentialType} cache key`), B;
        else this.logger.error(`Attempted to update an outdated ${Q.credentialType} cache key but no item matching the outdated key was found in storage`)
      }
      return A
    }
  }
})
// @from(Start 8144688, End 8149474)
class qNA {
  constructor(A, Q, B) {
    if (this.cacheHasChanged = !1, this.storage = A, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), B) this.persistence = B;
    this.logger = Q
  }
  hasChanged() {
    return this.cacheHasChanged
  }
  serialize() {
    this.logger.trace("Serializing in-memory cache");
    let A = Oe.serializeAllCache(this.storage.getInMemoryCache());
    if (this.cacheSnapshot) this.logger.trace("Reading cache snapshot from disk"), A = this.mergeState(JSON.parse(this.cacheSnapshot), A);
    else this.logger.trace("No cache snapshot to merge");
    return this.cacheHasChanged = !1, JSON.stringify(A)
  }
  deserialize(A) {
    if (this.logger.trace("Deserializing JSON to in-memory cache"), this.cacheSnapshot = A, this.cacheSnapshot) {
      this.logger.trace("Reading cache snapshot from disk");
      let Q = Ul.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
      this.storage.setInMemoryCache(Q)
    } else this.logger.trace("No cache snapshot to deserialize")
  }
  getKVStore() {
    return this.storage.getCache()
  }
  getCacheSnapshot() {
    let A = CAA.generateInMemoryCache(this.cacheSnapshot);
    return this.storage.inMemoryCacheToCache(A)
  }
  async getAllAccounts(A = new rf().createNewGuid()) {
    this.logger.trace("getAllAccounts called");
    let Q;
    try {
      if (this.persistence) Q = new SM(this, !1), await this.persistence.beforeCacheAccess(Q);
      return this.storage.getAllAccounts({}, A)
    } finally {
      if (this.persistence && Q) await this.persistence.afterCacheAccess(Q)
    }
  }
  async getAccountByHomeId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.homeAccountId === A)[0] || null;
    else return null
  }
  async getAccountByLocalId(A) {
    let Q = await this.getAllAccounts();
    if (A && Q && Q.length) return Q.filter((B) => B.localAccountId === A)[0] || null;
    else return null
  }
  async removeAccount(A, Q) {
    this.logger.trace("removeAccount called");
    let B;
    try {
      if (this.persistence) B = new SM(this, !0), await this.persistence.beforeCacheAccess(B);
      this.storage.removeAccount(A, Q || new zNA().generateGuid())
    } finally {
      if (this.persistence && B) await this.persistence.afterCacheAccess(B)
    }
  }
  async overwriteCache() {
    if (!this.persistence) {
      this.logger.info("No persistence layer specified, cache cannot be overwritten");
      return
    }
    this.logger.info("Overwriting in-memory cache with persistent cache"), this.storage.clear();
    let A = new SM(this, !1);
    await this.persistence.beforeCacheAccess(A);
    let Q = this.getCacheSnapshot();
    this.storage.setCache(Q), await this.persistence.afterCacheAccess(A)
  }
  handleChangeEvent() {
    this.cacheHasChanged = !0
  }
  mergeState(A, Q) {
    this.logger.trace("Merging in-memory cache with cache snapshot");
    let B = this.mergeRemovals(A, Q);
    return this.mergeUpdates(B, Q)
  }
  mergeUpdates(A, Q) {
    return Object.keys(Q).forEach((B) => {
      let G = Q[B];
      if (!A.hasOwnProperty(B)) {
        if (G !== null) A[B] = G
      } else {
        let Z = G !== null,
          I = typeof G === "object",
          Y = !Array.isArray(G),
          J = typeof A[B] < "u" && A[B] !== null;
        if (Z && I && Y && J) this.mergeUpdates(A[B], G);
        else A[B] = G
      }
    }), A
  }
  mergeRemovals(A, Q) {
    this.logger.trace("Remove updated entries in cache");
    let B = A.Account ? this.mergeRemovalsDict(A.Account, Q.Account) : A.Account,
      G = A.AccessToken ? this.mergeRemovalsDict(A.AccessToken, Q.AccessToken) : A.AccessToken,
      Z = A.RefreshToken ? this.mergeRemovalsDict(A.RefreshToken, Q.RefreshToken) : A.RefreshToken,
      I = A.IdToken ? this.mergeRemovalsDict(A.IdToken, Q.IdToken) : A.IdToken,
      Y = A.AppMetadata ? this.mergeRemovalsDict(A.AppMetadata, Q.AppMetadata) : A.AppMetadata;
    return {
      ...A,
      Account: B,
      AccessToken: G,
      RefreshToken: Z,
      IdToken: I,
      AppMetadata: Y
    }
  }
  mergeRemovalsDict(A, Q) {
    let B = {
      ...A
    };
    return Object.keys(A).forEach((G) => {
      if (!Q || !Q.hasOwnProperty(G)) delete B[G]
    }), B
  }
  overlayDefaults(A) {
    return this.logger.trace("Overlaying input cache with the default cache"), {
      Account: {
        ...wNA.Account,
        ...A.Account
      },
      IdToken: {
        ...wNA.IdToken,
        ...A.IdToken
      },
      AccessToken: {
        ...wNA.AccessToken,
        ...A.AccessToken
      },
      RefreshToken: {
        ...wNA.RefreshToken,
        ...A.RefreshToken
      },
      AppMetadata: {
        ...wNA.AppMetadata,
        ...A.AppMetadata
      }
    }
  }
}
// @from(Start 8149479, End 8149482)
wNA
// @from(Start 8149488, End 8149712)
ms1 = L(() => {
  N11();
  p7();
  I11();
  EA1();
  $NA();
  gs1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  wNA = {
    Account: {},
    IdToken: {},
    AccessToken: {},
    RefreshToken: {},
    AppMetadata: {}
  }
})
// @from(Start 8149718, End 8150636)
ds1 = z((FKG, FrB) => {
  var L11 = Bk().Buffer,
    as6 = UA("stream"),
    ss6 = UA("util");

  function M11(A) {
    if (this.buffer = null, this.writable = !0, this.readable = !0, !A) return this.buffer = L11.alloc(0), this;
    if (typeof A.pipe === "function") return this.buffer = L11.alloc(0), A.pipe(this), this;
    if (A.length || typeof A === "object") return this.buffer = A, this.writable = !1, process.nextTick(function() {
      this.emit("end", A), this.readable = !1, this.emit("close")
    }.bind(this)), this;
    throw TypeError("Unexpected data type (" + typeof A + ")")
  }
  ss6.inherits(M11, as6);
  M11.prototype.write = function(Q) {
    this.buffer = L11.concat([this.buffer, L11.from(Q)]), this.emit("data", Q)
  };
  M11.prototype.end = function(Q) {
    if (Q) this.write(Q);
    this.emit("end", Q), this.emit("close"), this.writable = !1, this.readable = !1
  };
  FrB.exports = M11
})
// @from(Start 8150642, End 8155124)
is1 = z((KKG, wrB) => {
  var dZA = Bk().Buffer,
    kM = UA("crypto"),
    DrB = weA(),
    KrB = UA("util"),
    rs6 = `"%s" is not a valid algorithm.
  Supported algorithms are:
  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".`,
    NNA = "secret must be a string or buffer",
    mZA = "key must be a string or a buffer",
    os6 = "key must be a string, a buffer or an object",
    ps1 = typeof kM.createPublicKey === "function";
  if (ps1) mZA += " or a KeyObject", NNA += "or a KeyObject";

  function HrB(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (!ps1) throw dT(mZA);
    if (typeof A !== "object") throw dT(mZA);
    if (typeof A.type !== "string") throw dT(mZA);
    if (typeof A.asymmetricKeyType !== "string") throw dT(mZA);
    if (typeof A.export !== "function") throw dT(mZA)
  }

  function CrB(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return;
    if (typeof A === "object") return;
    throw dT(os6)
  }

  function ts6(A) {
    if (dZA.isBuffer(A)) return;
    if (typeof A === "string") return A;
    if (!ps1) throw dT(NNA);
    if (typeof A !== "object") throw dT(NNA);
    if (A.type !== "secret") throw dT(NNA);
    if (typeof A.export !== "function") throw dT(NNA)
  }

  function ls1(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function ErB(A) {
    A = A.toString();
    var Q = 4 - A.length % 4;
    if (Q !== 4)
      for (var B = 0; B < Q; ++B) A += "=";
    return A.replace(/\-/g, "+").replace(/_/g, "/")
  }

  function dT(A) {
    var Q = [].slice.call(arguments, 1),
      B = KrB.format.bind(KrB, A).apply(null, Q);
    return TypeError(B)
  }

  function es6(A) {
    return dZA.isBuffer(A) || typeof A === "string"
  }

  function LNA(A) {
    if (!es6(A)) A = JSON.stringify(A);
    return A
  }

  function zrB(A) {
    return function(B, G) {
      ts6(G), B = LNA(B);
      var Z = kM.createHmac("sha" + A, G),
        I = (Z.update(B), Z.digest("base64"));
      return ls1(I)
    }
  }
  var cs1, Ar6 = "timingSafeEqual" in kM ? function(Q, B) {
    if (Q.byteLength !== B.byteLength) return !1;
    return kM.timingSafeEqual(Q, B)
  } : function(Q, B) {
    if (!cs1) cs1 = fl1();
    return cs1(Q, B)
  };

  function Qr6(A) {
    return function(B, G, Z) {
      var I = zrB(A)(B, Z);
      return Ar6(dZA.from(G), dZA.from(I))
    }
  }

  function UrB(A) {
    return function(B, G) {
      CrB(G), B = LNA(B);
      var Z = kM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign(G, "base64"));
      return ls1(I)
    }
  }

  function $rB(A) {
    return function(B, G, Z) {
      HrB(Z), B = LNA(B), G = ErB(G);
      var I = kM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify(Z, G, "base64")
    }
  }

  function Br6(A) {
    return function(B, G) {
      CrB(G), B = LNA(B);
      var Z = kM.createSign("RSA-SHA" + A),
        I = (Z.update(B), Z.sign({
          key: G,
          padding: kM.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: kM.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
      return ls1(I)
    }
  }

  function Gr6(A) {
    return function(B, G, Z) {
      HrB(Z), B = LNA(B), G = ErB(G);
      var I = kM.createVerify("RSA-SHA" + A);
      return I.update(B), I.verify({
        key: Z,
        padding: kM.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: kM.constants.RSA_PSS_SALTLEN_DIGEST
      }, G, "base64")
    }
  }

  function Zr6(A) {
    var Q = UrB(A);
    return function() {
      var G = Q.apply(null, arguments);
      return G = DrB.derToJose(G, "ES" + A), G
    }
  }

  function Ir6(A) {
    var Q = $rB(A);
    return function(G, Z, I) {
      Z = DrB.joseToDer(Z, "ES" + A).toString("base64");
      var Y = Q(G, Z, I);
      return Y
    }
  }

  function Yr6() {
    return function() {
      return ""
    }
  }

  function Jr6() {
    return function(Q, B) {
      return B === ""
    }
  }
  wrB.exports = function(Q) {
    var B = {
        hs: zrB,
        rs: UrB,
        ps: Br6,
        es: Zr6,
        none: Yr6
      },
      G = {
        hs: Qr6,
        rs: $rB,
        ps: Gr6,
        es: Ir6,
        none: Jr6
      },
      Z = Q.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/i);
    if (!Z) throw dT(rs6, Q);
    var I = (Z[1] || Z[3]).toLowerCase(),
      Y = Z[2];
    return {
      sign: B[I](Y),
      verify: G[I](Y)
    }
  }
})
// @from(Start 8155130, End 8155364)
ns1 = z((DKG, qrB) => {
  var Wr6 = UA("buffer").Buffer;
  qrB.exports = function(Q) {
    if (typeof Q === "string") return Q;
    if (typeof Q === "number" || Wr6.isBuffer(Q)) return Q.toString();
    return JSON.stringify(Q)
  }
})
// @from(Start 8155370, End 8156975)
TrB = z((HKG, RrB) => {
  var Xr6 = Bk().Buffer,
    NrB = ds1(),
    Vr6 = is1(),
    Fr6 = UA("stream"),
    LrB = ns1(),
    as1 = UA("util");

  function MrB(A, Q) {
    return Xr6.from(A, Q).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function Kr6(A, Q, B) {
    B = B || "utf8";
    var G = MrB(LrB(A), "binary"),
      Z = MrB(LrB(Q), B);
    return as1.format("%s.%s", G, Z)
  }

  function OrB(A) {
    var {
      header: Q,
      payload: B
    } = A, G = A.secret || A.privateKey, Z = A.encoding, I = Vr6(Q.alg), Y = Kr6(Q, B, Z), J = I.sign(Y, G);
    return as1.format("%s.%s", Y, J)
  }

  function O11(A) {
    var Q = A.secret || A.privateKey || A.key,
      B = new NrB(Q);
    this.readable = !0, this.header = A.header, this.encoding = A.encoding, this.secret = this.privateKey = this.key = B, this.payload = new NrB(A.payload), this.secret.once("close", function() {
      if (!this.payload.writable && this.readable) this.sign()
    }.bind(this)), this.payload.once("close", function() {
      if (!this.secret.writable && this.readable) this.sign()
    }.bind(this))
  }
  as1.inherits(O11, Fr6);
  O11.prototype.sign = function() {
    try {
      var Q = OrB({
        header: this.header,
        payload: this.payload.buffer,
        secret: this.secret.buffer,
        encoding: this.encoding
      });
      return this.emit("done", Q), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (B) {
      this.readable = !1, this.emit("error", B), this.emit("close")
    }
  };
  O11.sign = OrB;
  RrB.exports = O11
})
// @from(Start 8156981, End 8159389)
frB = z((CKG, brB) => {
  var jrB = Bk().Buffer,
    PrB = ds1(),
    Dr6 = is1(),
    Hr6 = UA("stream"),
    SrB = ns1(),
    Cr6 = UA("util"),
    Er6 = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

  function zr6(A) {
    return Object.prototype.toString.call(A) === "[object Object]"
  }

  function Ur6(A) {
    if (zr6(A)) return A;
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }

  function _rB(A) {
    var Q = A.split(".", 1)[0];
    return Ur6(jrB.from(Q, "base64").toString("binary"))
  }

  function $r6(A) {
    return A.split(".", 2).join(".")
  }

  function krB(A) {
    return A.split(".")[2]
  }

  function wr6(A, Q) {
    Q = Q || "utf8";
    var B = A.split(".")[1];
    return jrB.from(B, "base64").toString(Q)
  }

  function yrB(A) {
    return Er6.test(A) && !!_rB(A)
  }

  function xrB(A, Q, B) {
    if (!Q) {
      var G = Error("Missing algorithm parameter for jws.verify");
      throw G.code = "MISSING_ALGORITHM", G
    }
    A = SrB(A);
    var Z = krB(A),
      I = $r6(A),
      Y = Dr6(Q);
    return Y.verify(I, Z, B)
  }

  function vrB(A, Q) {
    if (Q = Q || {}, A = SrB(A), !yrB(A)) return null;
    var B = _rB(A);
    if (!B) return null;
    var G = wr6(A);
    if (B.typ === "JWT" || Q.json) G = JSON.parse(G, Q.encoding);
    return {
      header: B,
      payload: G,
      signature: krB(A)
    }
  }

  function cZA(A) {
    A = A || {};
    var Q = A.secret || A.publicKey || A.key,
      B = new PrB(Q);
    this.readable = !0, this.algorithm = A.algorithm, this.encoding = A.encoding, this.secret = this.publicKey = this.key = B, this.signature = new PrB(A.signature), this.secret.once("close", function() {
      if (!this.signature.writable && this.readable) this.verify()
    }.bind(this)), this.signature.once("close", function() {
      if (!this.secret.writable && this.readable) this.verify()
    }.bind(this))
  }
  Cr6.inherits(cZA, Hr6);
  cZA.prototype.verify = function() {
    try {
      var Q = xrB(this.signature.buffer, this.algorithm, this.key.buffer),
        B = vrB(this.signature.buffer, this.encoding);
      return this.emit("done", Q, B), this.emit("data", Q), this.emit("end"), this.readable = !1, Q
    } catch (G) {
      this.readable = !1, this.emit("error", G), this.emit("close")
    }
  };
  cZA.decode = vrB;
  cZA.isValid = yrB;
  cZA.verify = xrB;
  brB.exports = cZA
})
// @from(Start 8159395, End 8159823)
T11 = z((Nr6) => {
  var hrB = TrB(),
    R11 = frB(),
    qr6 = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512"];
  Nr6.ALGORITHMS = qr6;
  Nr6.sign = hrB.sign;
  Nr6.verify = R11.verify;
  Nr6.decode = R11.decode;
  Nr6.isValid = R11.isValid;
  Nr6.createSign = function(Q) {
    return new hrB(Q)
  };
  Nr6.createVerify = function(Q) {
    return new R11(Q)
  }
})
// @from(Start 8159829, End 8160271)
ss1 = z((zKG, grB) => {
  var Sr6 = T11();
  grB.exports = function(A, Q) {
    Q = Q || {};
    var B = Sr6.decode(A, Q);
    if (!B) return null;
    var G = B.payload;
    if (typeof G === "string") try {
      var Z = JSON.parse(G);
      if (Z !== null && typeof Z === "object") G = Z
    } catch (I) {}
    if (Q.complete === !0) return {
      header: B.header,
      payload: G,
      signature: B.signature
    };
    return G
  }
})
// @from(Start 8160277, End 8160622)
MNA = z((UKG, urB) => {
  var P11 = function(A, Q) {
    if (Error.call(this, A), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    if (this.name = "JsonWebTokenError", this.message = A, Q) this.inner = Q
  };
  P11.prototype = Object.create(Error.prototype);
  P11.prototype.constructor = P11;
  urB.exports = P11
})
// @from(Start 8160628, End 8160879)
rs1 = z(($KG, drB) => {
  var mrB = MNA(),
    j11 = function(A, Q) {
      mrB.call(this, A), this.name = "NotBeforeError", this.date = Q
    };
  j11.prototype = Object.create(mrB.prototype);
  j11.prototype.constructor = j11;
  drB.exports = j11
})
// @from(Start 8160885, End 8161144)
os1 = z((wKG, prB) => {
  var crB = MNA(),
    S11 = function(A, Q) {
      crB.call(this, A), this.name = "TokenExpiredError", this.expiredAt = Q
    };
  S11.prototype = Object.create(crB.prototype);
  S11.prototype.constructor = S11;
  prB.exports = S11
})
// @from(Start 8161150, End 8161475)
ts1 = z((qKG, lrB) => {
  var _r6 = SK1();
  lrB.exports = function(A, Q) {
    var B = Q || Math.floor(Date.now() / 1000);
    if (typeof A === "string") {
      var G = _r6(A);
      if (typeof G > "u") return;
      return Math.floor(B + G / 1000)
    } else if (typeof A === "number") return B + A;
    else return
  }
})
// @from(Start 8161481, End 8161584)
nrB = z((NKG, irB) => {
  var kr6 = KU();
  irB.exports = kr6.satisfies(process.version, ">=15.7.0")
})
// @from(Start 8161590, End 8161693)
srB = z((LKG, arB) => {
  var yr6 = KU();
  arB.exports = yr6.satisfies(process.version, ">=16.9.0")
})
// @from(Start 8161699, End 8163131)
es1 = z((MKG, rrB) => {
  var xr6 = nrB(),
    vr6 = srB(),
    br6 = {
      ec: ["ES256", "ES384", "ES512"],
      rsa: ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    },
    fr6 = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
  rrB.exports = function(A, Q) {
    if (!A || !Q) return;
    let B = Q.asymmetricKeyType;
    if (!B) return;
    let G = br6[B];
    if (!G) throw Error(`Unknown key type "${B}".`);
    if (!G.includes(A)) throw Error(`"alg" parameter for "${B}" key type must be one of: ${G.join(", ")}.`);
    if (xr6) switch (B) {
      case "ec":
        let Z = Q.asymmetricKeyDetails.namedCurve,
          I = fr6[A];
        if (Z !== I) throw Error(`"alg" parameter "${A}" requires curve "${I}".`);
        break;
      case "rsa-pss":
        if (vr6) {
          let Y = parseInt(A.slice(-3), 10),
            {
              hashAlgorithm: J,
              mgf1HashAlgorithm: W,
              saltLength: X
            } = Q.asymmetricKeyDetails;
          if (J !== `sha${Y}` || W !== J) throw Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${A}.`);
          if (X !== void 0 && X > Y >> 3) throw Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${A}.`)
        }
        break
    }
  }
})
// @from(Start 8163137, End 8163250)
Ar1 = z((OKG, orB) => {
  var hr6 = KU();
  orB.exports = hr6.satisfies(process.version, "^6.12.0 || >=8.0.0")
})
// @from(Start 8163256, End 8168910)
AoB = z((RKG, erB) => {
  var dZ = MNA(),
    gr6 = rs1(),
    trB = os1(),
    ur6 = ss1(),
    mr6 = ts1(),
    dr6 = es1(),
    cr6 = Ar1(),
    pr6 = T11(),
    {
      KeyObject: lr6,
      createSecretKey: ir6,
      createPublicKey: nr6
    } = UA("crypto"),
    Qr1 = ["RS256", "RS384", "RS512"],
    ar6 = ["ES256", "ES384", "ES512"],
    Br1 = ["RS256", "RS384", "RS512"],
    sr6 = ["HS256", "HS384", "HS512"];
  if (cr6) Qr1.splice(Qr1.length, 0, "PS256", "PS384", "PS512"), Br1.splice(Br1.length, 0, "PS256", "PS384", "PS512");
  erB.exports = function(A, Q, B, G) {
    if (typeof B === "function" && !G) G = B, B = {};
    if (!B) B = {};
    B = Object.assign({}, B);
    let Z;
    if (G) Z = G;
    else Z = function(V, F) {
      if (V) throw V;
      return F
    };
    if (B.clockTimestamp && typeof B.clockTimestamp !== "number") return Z(new dZ("clockTimestamp must be a number"));
    if (B.nonce !== void 0 && (typeof B.nonce !== "string" || B.nonce.trim() === "")) return Z(new dZ("nonce must be a non-empty string"));
    if (B.allowInvalidAsymmetricKeyTypes !== void 0 && typeof B.allowInvalidAsymmetricKeyTypes !== "boolean") return Z(new dZ("allowInvalidAsymmetricKeyTypes must be a boolean"));
    let I = B.clockTimestamp || Math.floor(Date.now() / 1000);
    if (!A) return Z(new dZ("jwt must be provided"));
    if (typeof A !== "string") return Z(new dZ("jwt must be a string"));
    let Y = A.split(".");
    if (Y.length !== 3) return Z(new dZ("jwt malformed"));
    let J;
    try {
      J = ur6(A, {
        complete: !0
      })
    } catch (V) {
      return Z(V)
    }
    if (!J) return Z(new dZ("invalid token"));
    let W = J.header,
      X;
    if (typeof Q === "function") {
      if (!G) return Z(new dZ("verify must be called asynchronous if secret or public key is provided as a callback"));
      X = Q
    } else X = function(V, F) {
      return F(null, Q)
    };
    return X(W, function(V, F) {
      if (V) return Z(new dZ("error in secret or public key callback: " + V.message));
      let K = Y[2].trim() !== "";
      if (!K && F) return Z(new dZ("jwt signature is required"));
      if (K && !F) return Z(new dZ("secret or public key must be provided"));
      if (!K && !B.algorithms) return Z(new dZ('please specify "none" in "algorithms" to verify unsigned tokens'));
      if (F != null && !(F instanceof lr6)) try {
        F = nr6(F)
      } catch (C) {
        try {
          F = ir6(typeof F === "string" ? Buffer.from(F) : F)
        } catch (E) {
          return Z(new dZ("secretOrPublicKey is not valid key material"))
        }
      }
      if (!B.algorithms)
        if (F.type === "secret") B.algorithms = sr6;
        else if (["rsa", "rsa-pss"].includes(F.asymmetricKeyType)) B.algorithms = Br1;
      else if (F.asymmetricKeyType === "ec") B.algorithms = ar6;
      else B.algorithms = Qr1;
      if (B.algorithms.indexOf(J.header.alg) === -1) return Z(new dZ("invalid algorithm"));
      if (W.alg.startsWith("HS") && F.type !== "secret") return Z(new dZ(`secretOrPublicKey must be a symmetric key when using ${W.alg}`));
      else if (/^(?:RS|PS|ES)/.test(W.alg) && F.type !== "public") return Z(new dZ(`secretOrPublicKey must be an asymmetric key when using ${W.alg}`));
      if (!B.allowInvalidAsymmetricKeyTypes) try {
        dr6(W.alg, F)
      } catch (C) {
        return Z(C)
      }
      let D;
      try {
        D = pr6.verify(A, J.header.alg, F)
      } catch (C) {
        return Z(C)
      }
      if (!D) return Z(new dZ("invalid signature"));
      let H = J.payload;
      if (typeof H.nbf < "u" && !B.ignoreNotBefore) {
        if (typeof H.nbf !== "number") return Z(new dZ("invalid nbf value"));
        if (H.nbf > I + (B.clockTolerance || 0)) return Z(new gr6("jwt not active", new Date(H.nbf * 1000)))
      }
      if (typeof H.exp < "u" && !B.ignoreExpiration) {
        if (typeof H.exp !== "number") return Z(new dZ("invalid exp value"));
        if (I >= H.exp + (B.clockTolerance || 0)) return Z(new trB("jwt expired", new Date(H.exp * 1000)))
      }
      if (B.audience) {
        let C = Array.isArray(B.audience) ? B.audience : [B.audience];
        if (!(Array.isArray(H.aud) ? H.aud : [H.aud]).some(function(q) {
            return C.some(function(w) {
              return w instanceof RegExp ? w.test(q) : w === q
            })
          })) return Z(new dZ("jwt audience invalid. expected: " + C.join(" or ")))
      }
      if (B.issuer) {
        if (typeof B.issuer === "string" && H.iss !== B.issuer || Array.isArray(B.issuer) && B.issuer.indexOf(H.iss) === -1) return Z(new dZ("jwt issuer invalid. expected: " + B.issuer))
      }
      if (B.subject) {
        if (H.sub !== B.subject) return Z(new dZ("jwt subject invalid. expected: " + B.subject))
      }
      if (B.jwtid) {
        if (H.jti !== B.jwtid) return Z(new dZ("jwt jwtid invalid. expected: " + B.jwtid))
      }
      if (B.nonce) {
        if (H.nonce !== B.nonce) return Z(new dZ("jwt nonce invalid. expected: " + B.nonce))
      }
      if (B.maxAge) {
        if (typeof H.iat !== "number") return Z(new dZ("iat required when maxAge is specified"));
        let C = mr6(B.maxAge, H.iat);
        if (typeof C > "u") return Z(new dZ('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        if (I >= C + (B.clockTolerance || 0)) return Z(new trB("maxAge exceeded", new Date(C * 1000)))
      }
      if (B.complete === !0) {
        let C = J.signature;
        return Z(null, {
          header: W,
          payload: H,
          signature: C
        })
      }
      return Z(null, H)
    })
  }
})
// @from(Start 8168916, End 8173184)
YoB = z((TKG, IoB) => {
  var QoB = 1 / 0,
    GoB = 9007199254740991,
    rr6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    BoB = NaN,
    or6 = "[object Arguments]",
    tr6 = "[object Function]",
    er6 = "[object GeneratorFunction]",
    Ao6 = "[object String]",
    Qo6 = "[object Symbol]",
    Bo6 = /^\s+|\s+$/g,
    Go6 = /^[-+]0x[0-9a-f]+$/i,
    Zo6 = /^0b[01]+$/i,
    Io6 = /^0o[0-7]+$/i,
    Yo6 = /^(?:0|[1-9]\d*)$/,
    Jo6 = parseInt;

  function Wo6(A, Q) {
    var B = -1,
      G = A ? A.length : 0,
      Z = Array(G);
    while (++B < G) Z[B] = Q(A[B], B, A);
    return Z
  }

  function Xo6(A, Q, B, G) {
    var Z = A.length,
      I = B + (G ? 1 : -1);
    while (G ? I-- : ++I < Z)
      if (Q(A[I], I, A)) return I;
    return -1
  }

  function Vo6(A, Q, B) {
    if (Q !== Q) return Xo6(A, Fo6, B);
    var G = B - 1,
      Z = A.length;
    while (++G < Z)
      if (A[G] === Q) return G;
    return -1
  }

  function Fo6(A) {
    return A !== A
  }

  function Ko6(A, Q) {
    var B = -1,
      G = Array(A);
    while (++B < A) G[B] = Q(B);
    return G
  }

  function Do6(A, Q) {
    return Wo6(Q, function(B) {
      return A[B]
    })
  }

  function Ho6(A, Q) {
    return function(B) {
      return A(Q(B))
    }
  }
  var _11 = Object.prototype,
    Zr1 = _11.hasOwnProperty,
    k11 = _11.toString,
    Co6 = _11.propertyIsEnumerable,
    Eo6 = Ho6(Object.keys, Object),
    zo6 = Math.max;

  function Uo6(A, Q) {
    var B = ZoB(A) || Lo6(A) ? Ko6(A.length, String) : [],
      G = B.length,
      Z = !!G;
    for (var I in A)
      if ((Q || Zr1.call(A, I)) && !(Z && (I == "length" || wo6(I, G)))) B.push(I);
    return B
  }

  function $o6(A) {
    if (!qo6(A)) return Eo6(A);
    var Q = [];
    for (var B in Object(A))
      if (Zr1.call(A, B) && B != "constructor") Q.push(B);
    return Q
  }

  function wo6(A, Q) {
    return Q = Q == null ? GoB : Q, !!Q && (typeof A == "number" || Yo6.test(A)) && (A > -1 && A % 1 == 0 && A < Q)
  }

  function qo6(A) {
    var Q = A && A.constructor,
      B = typeof Q == "function" && Q.prototype || _11;
    return A === B
  }

  function No6(A, Q, B, G) {
    A = Ir1(A) ? A : yo6(A), B = B && !G ? So6(B) : 0;
    var Z = A.length;
    if (B < 0) B = zo6(Z + B, 0);
    return To6(A) ? B <= Z && A.indexOf(Q, B) > -1 : !!Z && Vo6(A, Q, B) > -1
  }

  function Lo6(A) {
    return Mo6(A) && Zr1.call(A, "callee") && (!Co6.call(A, "callee") || k11.call(A) == or6)
  }
  var ZoB = Array.isArray;

  function Ir1(A) {
    return A != null && Ro6(A.length) && !Oo6(A)
  }

  function Mo6(A) {
    return Yr1(A) && Ir1(A)
  }

  function Oo6(A) {
    var Q = Gr1(A) ? k11.call(A) : "";
    return Q == tr6 || Q == er6
  }

  function Ro6(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= GoB
  }

  function Gr1(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function Yr1(A) {
    return !!A && typeof A == "object"
  }

  function To6(A) {
    return typeof A == "string" || !ZoB(A) && Yr1(A) && k11.call(A) == Ao6
  }

  function Po6(A) {
    return typeof A == "symbol" || Yr1(A) && k11.call(A) == Qo6
  }

  function jo6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = _o6(A), A === QoB || A === -QoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * rr6
    }
    return A === A ? A : 0
  }

  function So6(A) {
    var Q = jo6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function _o6(A) {
    if (typeof A == "number") return A;
    if (Po6(A)) return BoB;
    if (Gr1(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = Gr1(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(Bo6, "");
    var B = Zo6.test(A);
    return B || Io6.test(A) ? Jo6(A.slice(2), B ? 2 : 8) : Go6.test(A) ? BoB : +A
  }

  function ko6(A) {
    return Ir1(A) ? Uo6(A) : $o6(A)
  }

  function yo6(A) {
    return A ? Do6(A, ko6(A)) : []
  }
  IoB.exports = No6
})
// @from(Start 8173190, End 8173473)
WoB = z((PKG, JoB) => {
  var xo6 = "[object Boolean]",
    vo6 = Object.prototype,
    bo6 = vo6.toString;

  function fo6(A) {
    return A === !0 || A === !1 || ho6(A) && bo6.call(A) == xo6
  }

  function ho6(A) {
    return !!A && typeof A == "object"
  }
  JoB.exports = fo6
})
// @from(Start 8173479, End 8175105)
DoB = z((jKG, KoB) => {
  var XoB = 1 / 0,
    go6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    VoB = NaN,
    uo6 = "[object Symbol]",
    mo6 = /^\s+|\s+$/g,
    do6 = /^[-+]0x[0-9a-f]+$/i,
    co6 = /^0b[01]+$/i,
    po6 = /^0o[0-7]+$/i,
    lo6 = parseInt,
    io6 = Object.prototype,
    no6 = io6.toString;

  function ao6(A) {
    return typeof A == "number" && A == to6(A)
  }

  function FoB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function so6(A) {
    return !!A && typeof A == "object"
  }

  function ro6(A) {
    return typeof A == "symbol" || so6(A) && no6.call(A) == uo6
  }

  function oo6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = eo6(A), A === XoB || A === -XoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * go6
    }
    return A === A ? A : 0
  }

  function to6(A) {
    var Q = oo6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function eo6(A) {
    if (typeof A == "number") return A;
    if (ro6(A)) return VoB;
    if (FoB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = FoB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(mo6, "");
    var B = co6.test(A);
    return B || po6.test(A) ? lo6(A.slice(2), B ? 2 : 8) : do6.test(A) ? VoB : +A
  }
  KoB.exports = ao6
})
// @from(Start 8175111, End 8175393)
CoB = z((SKG, HoB) => {
  var At6 = "[object Number]",
    Qt6 = Object.prototype,
    Bt6 = Qt6.toString;

  function Gt6(A) {
    return !!A && typeof A == "object"
  }

  function Zt6(A) {
    return typeof A == "number" || Gt6(A) && Bt6.call(A) == At6
  }
  HoB.exports = Zt6
})
// @from(Start 8175399, End 8176253)
$oB = z((_KG, UoB) => {
  var It6 = "[object Object]";

  function Yt6(A) {
    var Q = !1;
    if (A != null && typeof A.toString != "function") try {
      Q = !!(A + "")
    } catch (B) {}
    return Q
  }

  function Jt6(A, Q) {
    return function(B) {
      return A(Q(B))
    }
  }
  var Wt6 = Function.prototype,
    EoB = Object.prototype,
    zoB = Wt6.toString,
    Xt6 = EoB.hasOwnProperty,
    Vt6 = zoB.call(Object),
    Ft6 = EoB.toString,
    Kt6 = Jt6(Object.getPrototypeOf, Object);

  function Dt6(A) {
    return !!A && typeof A == "object"
  }

  function Ht6(A) {
    if (!Dt6(A) || Ft6.call(A) != It6 || Yt6(A)) return !1;
    var Q = Kt6(A);
    if (Q === null) return !0;
    var B = Xt6.call(Q, "constructor") && Q.constructor;
    return typeof B == "function" && B instanceof B && zoB.call(B) == Vt6
  }
  UoB.exports = Ht6
})
// @from(Start 8176259, End 8176577)
qoB = z((kKG, woB) => {
  var Ct6 = "[object String]",
    Et6 = Object.prototype,
    zt6 = Et6.toString,
    Ut6 = Array.isArray;

  function $t6(A) {
    return !!A && typeof A == "object"
  }

  function wt6(A) {
    return typeof A == "string" || !Ut6(A) && $t6(A) && zt6.call(A) == Ct6
  }
  woB.exports = wt6
})
// @from(Start 8176583, End 8178459)
RoB = z((yKG, OoB) => {
  var qt6 = "Expected a function",
    NoB = 1 / 0,
    Nt6 = 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
    LoB = NaN,
    Lt6 = "[object Symbol]",
    Mt6 = /^\s+|\s+$/g,
    Ot6 = /^[-+]0x[0-9a-f]+$/i,
    Rt6 = /^0b[01]+$/i,
    Tt6 = /^0o[0-7]+$/i,
    Pt6 = parseInt,
    jt6 = Object.prototype,
    St6 = jt6.toString;

  function _t6(A, Q) {
    var B;
    if (typeof Q != "function") throw TypeError(qt6);
    return A = bt6(A),
      function() {
        if (--A > 0) B = Q.apply(this, arguments);
        if (A <= 1) Q = void 0;
        return B
      }
  }

  function kt6(A) {
    return _t6(2, A)
  }

  function MoB(A) {
    var Q = typeof A;
    return !!A && (Q == "object" || Q == "function")
  }

  function yt6(A) {
    return !!A && typeof A == "object"
  }

  function xt6(A) {
    return typeof A == "symbol" || yt6(A) && St6.call(A) == Lt6
  }

  function vt6(A) {
    if (!A) return A === 0 ? A : 0;
    if (A = ft6(A), A === NoB || A === -NoB) {
      var Q = A < 0 ? -1 : 1;
      return Q * Nt6
    }
    return A === A ? A : 0
  }

  function bt6(A) {
    var Q = vt6(A),
      B = Q % 1;
    return Q === Q ? B ? Q - B : Q : 0
  }

  function ft6(A) {
    if (typeof A == "number") return A;
    if (xt6(A)) return LoB;
    if (MoB(A)) {
      var Q = typeof A.valueOf == "function" ? A.valueOf() : A;
      A = MoB(Q) ? Q + "" : Q
    }
    if (typeof A != "string") return A === 0 ? A : +A;
    A = A.replace(Mt6, "");
    var B = Rt6.test(A);
    return B || Tt6.test(A) ? Pt6(A.slice(2), B ? 2 : 8) : Ot6.test(A) ? LoB : +A
  }
  OoB.exports = kt6
})
// @from(Start 8178465, End 8185542)
voB = z((xKG, xoB) => {
  var ToB = ts1(),
    ht6 = Ar1(),
    gt6 = es1(),
    PoB = T11(),
    ut6 = YoB(),
    y11 = WoB(),
    joB = DoB(),
    Jr1 = CoB(),
    _oB = $oB(),
    wl = qoB(),
    mt6 = RoB(),
    {
      KeyObject: dt6,
      createSecretKey: ct6,
      createPrivateKey: pt6
    } = UA("crypto"),
    koB = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
  if (ht6) koB.splice(3, 0, "PS256", "PS384", "PS512");
  var lt6 = {
      expiresIn: {
        isValid: function(A) {
          return joB(A) || wl(A) && A
        },
        message: '"expiresIn" should be a number of seconds or string representing a timespan'
      },
      notBefore: {
        isValid: function(A) {
          return joB(A) || wl(A) && A
        },
        message: '"notBefore" should be a number of seconds or string representing a timespan'
      },
      audience: {
        isValid: function(A) {
          return wl(A) || Array.isArray(A)
        },
        message: '"audience" must be a string or array'
      },
      algorithm: {
        isValid: ut6.bind(null, koB),
        message: '"algorithm" must be a valid string enum value'
      },
      header: {
        isValid: _oB,
        message: '"header" must be an object'
      },
      encoding: {
        isValid: wl,
        message: '"encoding" must be a string'
      },
      issuer: {
        isValid: wl,
        message: '"issuer" must be a string'
      },
      subject: {
        isValid: wl,
        message: '"subject" must be a string'
      },
      jwtid: {
        isValid: wl,
        message: '"jwtid" must be a string'
      },
      noTimestamp: {
        isValid: y11,
        message: '"noTimestamp" must be a boolean'
      },
      keyid: {
        isValid: wl,
        message: '"keyid" must be a string'
      },
      mutatePayload: {
        isValid: y11,
        message: '"mutatePayload" must be a boolean'
      },
      allowInsecureKeySizes: {
        isValid: y11,
        message: '"allowInsecureKeySizes" must be a boolean'
      },
      allowInvalidAsymmetricKeyTypes: {
        isValid: y11,
        message: '"allowInvalidAsymmetricKeyTypes" must be a boolean'
      }
    },
    it6 = {
      iat: {
        isValid: Jr1,
        message: '"iat" should be a number of seconds'
      },
      exp: {
        isValid: Jr1,
        message: '"exp" should be a number of seconds'
      },
      nbf: {
        isValid: Jr1,
        message: '"nbf" should be a number of seconds'
      }
    };

  function yoB(A, Q, B, G) {
    if (!_oB(B)) throw Error('Expected "' + G + '" to be a plain object.');
    Object.keys(B).forEach(function(Z) {
      let I = A[Z];
      if (!I) {
        if (!Q) throw Error('"' + Z + '" is not allowed in "' + G + '"');
        return
      }
      if (!I.isValid(B[Z])) throw Error(I.message)
    })
  }

  function nt6(A) {
    return yoB(lt6, !1, A, "options")
  }

  function at6(A) {
    return yoB(it6, !0, A, "payload")
  }
  var SoB = {
      audience: "aud",
      issuer: "iss",
      subject: "sub",
      jwtid: "jti"
    },
    st6 = ["expiresIn", "notBefore", "noTimestamp", "audience", "issuer", "subject", "jwtid"];
  xoB.exports = function(A, Q, B, G) {
    if (typeof B === "function") G = B, B = {};
    else B = B || {};
    let Z = typeof A === "object" && !Buffer.isBuffer(A),
      I = Object.assign({
        alg: B.algorithm || "HS256",
        typ: Z ? "JWT" : void 0,
        kid: B.keyid
      }, B.header);

    function Y(X) {
      if (G) return G(X);
      throw X
    }
    if (!Q && B.algorithm !== "none") return Y(Error("secretOrPrivateKey must have a value"));
    if (Q != null && !(Q instanceof dt6)) try {
      Q = pt6(Q)
    } catch (X) {
      try {
        Q = ct6(typeof Q === "string" ? Buffer.from(Q) : Q)
      } catch (V) {
        return Y(Error("secretOrPrivateKey is not valid key material"))
      }
    }
    if (I.alg.startsWith("HS") && Q.type !== "secret") return Y(Error(`secretOrPrivateKey must be a symmetric key when using ${I.alg}`));
    else if (/^(?:RS|PS|ES)/.test(I.alg)) {
      if (Q.type !== "private") return Y(Error(`secretOrPrivateKey must be an asymmetric key when using ${I.alg}`));
      if (!B.allowInsecureKeySizes && !I.alg.startsWith("ES") && Q.asymmetricKeyDetails !== void 0 && Q.asymmetricKeyDetails.modulusLength < 2048) return Y(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`))
    }
    if (typeof A > "u") return Y(Error("payload is required"));
    else if (Z) {
      try {
        at6(A)
      } catch (X) {
        return Y(X)
      }
      if (!B.mutatePayload) A = Object.assign({}, A)
    } else {
      let X = st6.filter(function(V) {
        return typeof B[V] < "u"
      });
      if (X.length > 0) return Y(Error("invalid " + X.join(",") + " option for " + typeof A + " payload"))
    }
    if (typeof A.exp < "u" && typeof B.expiresIn < "u") return Y(Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
    if (typeof A.nbf < "u" && typeof B.notBefore < "u") return Y(Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
    try {
      nt6(B)
    } catch (X) {
      return Y(X)
    }
    if (!B.allowInvalidAsymmetricKeyTypes) try {
      gt6(I.alg, Q)
    } catch (X) {
      return Y(X)
    }
    let J = A.iat || Math.floor(Date.now() / 1000);
    if (B.noTimestamp) delete A.iat;
    else if (Z) A.iat = J;
    if (typeof B.notBefore < "u") {
      try {
        A.nbf = ToB(B.notBefore, J)
      } catch (X) {
        return Y(X)
      }
      if (typeof A.nbf > "u") return Y(Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    if (typeof B.expiresIn < "u" && typeof A === "object") {
      try {
        A.exp = ToB(B.expiresIn, J)
      } catch (X) {
        return Y(X)
      }
      if (typeof A.exp > "u") return Y(Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'))
    }
    Object.keys(SoB).forEach(function(X) {
      let V = SoB[X];
      if (typeof B[X] < "u") {
        if (typeof A[V] < "u") return Y(Error('Bad "options.' + X + '" option. The payload already has an "' + V + '" property.'));
        A[V] = B[X]
      }
    });
    let W = B.encoding || "utf8";
    if (typeof G === "function") G = G && mt6(G), PoB.createSign({
      header: I,
      privateKey: Q,
      payload: A,
      encoding: W
    }).once("error", G).once("done", function(X) {
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(I.alg) && X.length < 256) return G(Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`));
      G(null, X)
    });
    else {
      let X = PoB.sign({
        header: I,
        payload: A,
        secret: Q,
        encoding: W
      });
      if (!B.allowInsecureKeySizes && /^(?:RS|PS)/.test(I.alg) && X.length < 256) throw Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${I.alg}`);
      return X
    }
  }
})
// @from(Start 8185548, End 8185737)
foB = z((vKG, boB) => {
  boB.exports = {
    decode: ss1(),
    verify: AoB(),
    sign: voB(),
    JsonWebTokenError: MNA(),
    NotBeforeError: rs1(),
    TokenExpiredError: os1()
  }
})
// @from(Start 8185739, End 8187591)
class cT {
  static fromAssertion(A) {
    let Q = new cT;
    return Q.jwt = A, Q
  }
  static fromCertificate(A, Q, B) {
    let G = new cT;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !1, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  static fromCertificateWithSha256Thumbprint(A, Q, B) {
    let G = new cT;
    if (G.privateKey = Q, G.thumbprint = A, G.useSha256 = !0, B) G.publicCertificate = this.parseCertificate(B);
    return G
  }
  getJwt(A, Q, B) {
    if (this.privateKey && this.thumbprint) {
      if (this.jwt && !this.isExpired() && Q === this.issuer && B === this.jwtAudience) return this.jwt;
      return this.createJwt(A, Q, B)
    }
    if (this.jwt) return this.jwt;
    throw b0(fG.invalidAssertion)
  }
  createJwt(A, Q, B) {
    this.issuer = Q, this.jwtAudience = B;
    let G = EI.nowSeconds();
    this.expirationTime = G + 600;
    let I = {
        alg: this.useSha256 ? _M.PSS_256 : _M.RSA_256
      },
      Y = this.useSha256 ? _M.X5T_256 : _M.X5T;
    if (Object.assign(I, {
        [Y]: PU.base64EncodeUrl(this.thumbprint, MD.HEX)
      }), this.publicCertificate) Object.assign(I, {
      [_M.X5C]: this.publicCertificate
    });
    let J = {
      [_M.AUDIENCE]: this.jwtAudience,
      [_M.EXPIRATION_TIME]: this.expirationTime,
      [_M.ISSUER]: this.issuer,
      [_M.SUBJECT]: this.issuer,
      [_M.NOT_BEFORE]: G,
      [_M.JWT_ID]: A.createNewGuid()
    };
    return this.jwt = hoB.default.sign(J, this.privateKey, {
      header: I
    }), this.jwt
  }
  isExpired() {
    return this.expirationTime < EI.nowSeconds()
  }
  static parseCertificate(A) {
    let Q = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs,
      B = [],
      G;
    while ((G = Q.exec(A)) !== null) B.push(G[1].replace(/\r*\n/g, L0.EMPTY_STRING));
    return B
  }
}
// @from(Start 8187596, End 8187599)
hoB
// @from(Start 8187605, End 8187712)
x11 = L(() => {
  p7();
  UNA();
  UI();
  hoB = BA(foB(), 1); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8187718, End 8187742)
v11 = "@azure/msal-node"
// @from(Start 8187746, End 8187758)
pT = "3.8.1"
// @from(Start 8187764, End 8187826)
pZA = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8187832, End 8187835)
ONA
// @from(Start 8187841, End 8190604)
Wr1 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  ONA = class ONA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      this.logger.info("in acquireToken call in username-password client");
      let Q = EI.nowSeconds(),
        B = await this.executeTokenRequest(this.authority, A),
        G = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return G.validateTokenResponse(B.body), G.handleServerTokenResponse(B.body, this.authority, Q, A)
    }
    async executeTokenRequest(A, Q) {
      let B = this.createTokenQueryParameters(Q),
        G = w8.appendQueryString(A.tokenEndpoint, B),
        Z = await this.createTokenRequestBody(Q),
        I = this.createTokenRequestHeaders({
          credential: Q.username,
          type: zE.UPN
        }),
        Y = {
          clientId: this.config.authOptions.clientId,
          authority: A.canonicalAuthority,
          scopes: Q.scopes,
          claims: Q.claims,
          authenticationScheme: Q.authenticationScheme,
          resourceRequestMethod: Q.resourceRequestMethod,
          resourceRequestUri: Q.resourceRequestUri,
          shrClaims: Q.shrClaims,
          sshKid: Q.sshKid
        };
      return this.executePostToTokenEndpoint(G, Z, I, Y, Q.correlationId)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addUsername(Q, A.username), PB.addPassword(Q, A.password), PB.addScopes(Q, A.scopes), PB.addResponseType(Q, $ZA.IDTOKEN_TOKEN), PB.addGrantType(Q, OU.RESOURCE_OWNER_PASSWORD_GRANT), PB.addClientInfo(Q), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && A.username) PB.addCcsUpn(Q, A.username);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8190607, End 8191306)
function goB(A, Q, B, G) {
  let Z = VNA.getStandardAuthorizeRequestParameters({
    ...A.auth,
    authority: Q,
    redirectUri: B.redirectUri || ""
  }, B, G);
  if (PB.addLibraryInfo(Z, {
      sku: qE.MSAL_SKU,
      version: pT,
      cpu: process.arch || "",
      os: process.platform || ""
    }), A.auth.protocolMode !== aH.OIDC) PB.addApplicationTelemetry(Z, A.telemetry.application);
  if (PB.addResponseType(Z, $ZA.CODE), B.codeChallenge && B.codeChallengeMethod) PB.addCodeChallengeParams(Z, B.codeChallenge, B.codeChallengeMethod);
  return PB.addExtraQueryParameters(Z, B.extraQueryParameters || {}), VNA.getAuthorizeUrl(Q, Z, A.auth.encodeExtraQueryParams, B.extraQueryParameters)
}
// @from(Start 8191311, End 8191396)
uoB = L(() => {
  p7();
  UI();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8191398, End 8200096)
class EAA {
  constructor(A) {
    this.config = KsB(A), this.cryptoProvider = new rf, this.logger = new RU(this.config.system.loggerOptions, v11, pT), this.storage = new CAA(this.logger, this.config.auth.clientId, this.cryptoProvider, zs1(this.config.auth)), this.tokenCache = new qNA(this.storage, this.logger, this.config.cache.cachePlugin)
  }
  async getAuthCodeUrl(A) {
    this.logger.info("getAuthCodeUrl called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        responseMode: A.responseMode || Wk.QUERY,
        authenticationScheme: A5.BEARER,
        state: A.state || "",
        nonce: A.nonce || ""
      },
      B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions);
    return goB(this.config, B, Q, this.logger)
  }
  async acquireTokenByCode(A, Q) {
    if (this.logger.info("acquireTokenByCode called"), A.state && Q) this.logger.info("acquireTokenByCode - validating state"), this.validateState(A.state, Q.state || ""), Q = {
      ...Q,
      state: ""
    };
    let B = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: A5.BEARER
      },
      G = this.initializeServerTelemetryManager(af.acquireTokenByCode, B.correlationId);
    try {
      let Z = await this.createAuthority(B.authority, B.correlationId, void 0, A.azureCloudOptions),
        I = await this.buildOauthClientConfiguration(Z, B.correlationId, B.redirectUri, G),
        Y = new G11(I);
      return this.logger.verbose("Auth code client created", B.correlationId), await Y.acquireToken(B, Q)
    } catch (Z) {
      if (Z instanceof t4) Z.setCorrelationId(B.correlationId);
      throw G.cacheFailedRequest(Z), Z
    }
  }
  async acquireTokenByRefreshToken(A) {
    this.logger.info("acquireTokenByRefreshToken called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        authenticationScheme: A5.BEARER
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenByRefreshToken, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        I = new gZA(Z);
      return this.logger.verbose("Refresh token client created", Q.correlationId), await I.acquireToken(Q)
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireTokenSilent(A) {
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A),
        forceRefresh: A.forceRefresh || !1
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenSilent, Q.correlationId, Q.forceRefresh);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, Q.redirectUri || "", B),
        I = new Z11(Z);
      this.logger.verbose("Silent flow client created", Q.correlationId);
      try {
        return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(Q, I, Z)
      } catch (Y) {
        if (Y instanceof Jl && Y.errorCode === fG.tokenRefreshRequired) return new gZA(Z).acquireTokenByRefreshToken(Q);
        throw Y
      }
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  async acquireCachedTokenSilent(A, Q, B) {
    let [G, Z] = await Q.acquireCachedToken({
      ...A,
      scopes: A.scopes?.length ? A.scopes : [...nH]
    });
    if (Z === FZ.PROACTIVELY_REFRESHED) {
      this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
      let I = new gZA(B);
      try {
        await I.acquireTokenByRefreshToken(A)
      } catch {}
    }
    return G
  }
  async acquireTokenByUsernamePassword(A) {
    this.logger.info("acquireTokenByUsernamePassword called", A.correlationId);
    let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      },
      B = this.initializeServerTelemetryManager(af.acquireTokenByUsernamePassword, Q.correlationId);
    try {
      let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
        Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
        I = new ONA(Z);
      return this.logger.verbose("Username password client created", Q.correlationId), await I.acquireToken(Q)
    } catch (G) {
      if (G instanceof t4) G.setCorrelationId(Q.correlationId);
      throw B.cacheFailedRequest(G), G
    }
  }
  getTokenCache() {
    return this.logger.info("getTokenCache called"), this.tokenCache
  }
  validateState(A, Q) {
    if (!A) throw WY.createStateNotFoundError();
    if (A !== Q) throw b0(fG.stateMismatch)
  }
  getLogger() {
    return this.logger
  }
  setLogger(A) {
    this.logger = A
  }
  async buildOauthClientConfiguration(A, Q, B, G) {
    return this.logger.verbose("buildOauthClientConfiguration called", Q), this.logger.info(`Building oauth client configuration with the following authority: ${A.tokenEndpoint}.`, Q), G?.updateRegionDiscoveryMetadata(A.regionDiscoveryMetadata), {
      authOptions: {
        clientId: this.config.auth.clientId,
        authority: A,
        clientCapabilities: this.config.auth.clientCapabilities,
        redirectUri: B
      },
      loggerOptions: {
        logLevel: this.config.system.loggerOptions.logLevel,
        loggerCallback: this.config.system.loggerOptions.loggerCallback,
        piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
        correlationId: Q
      },
      cacheOptions: {
        claimsBasedCachingEnabled: this.config.cache.claimsBasedCachingEnabled
      },
      cryptoInterface: this.cryptoProvider,
      networkInterface: this.config.system.networkClient,
      storageInterface: this.storage,
      serverTelemetryManager: G,
      clientCredentials: {
        clientSecret: this.clientSecret,
        clientAssertion: await this.getClientAssertion(A)
      },
      libraryInfo: {
        sku: qE.MSAL_SKU,
        version: pT,
        cpu: process.arch || L0.EMPTY_STRING,
        os: process.platform || L0.EMPTY_STRING
      },
      telemetry: this.config.telemetry,
      persistencePlugin: this.config.cache.cachePlugin,
      serializableCache: this.tokenCache
    }
  }
  async getClientAssertion(A) {
    if (this.developerProvidedClientAssertion) this.clientAssertion = cT.fromAssertion(await wE(this.developerProvidedClientAssertion, this.config.auth.clientId, A.tokenEndpoint));
    return this.clientAssertion && {
      assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, A.tokenEndpoint),
      assertionType: qE.JWT_BEARER_ASSERTION_TYPE
    }
  }
  async initializeBaseRequest(A) {
    if (this.logger.verbose("initializeRequestScopes called", A.correlationId), A.authenticationScheme && A.authenticationScheme === A5.POP) this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", A.correlationId);
    if (A.authenticationScheme = A5.BEARER, this.config.cache.claimsBasedCachingEnabled && A.claims && !KZ.isEmptyObj(A.claims)) A.requestedClaimsHash = await this.cryptoProvider.hashString(A.claims);
    return {
      ...A,
      scopes: [...A && A.scopes || [], ...nH],
      correlationId: A && A.correlationId || this.cryptoProvider.createNewGuid(),
      authority: A.authority || this.config.auth.authority
    }
  }
  initializeServerTelemetryManager(A, Q, B) {
    let G = {
      clientId: this.config.auth.clientId,
      correlationId: Q,
      apiId: A,
      forceRefresh: B || !1
    };
    return new zl(G, this.storage)
  }
  async createAuthority(A, Q, B, G) {
    this.logger.verbose("createAuthority called", Q);
    let Z = kV.generateAuthority(A, G || this.config.auth.azureCloudOptions),
      I = {
        protocolMode: this.config.auth.protocolMode,
        knownAuthorities: this.config.auth.knownAuthorities,
        cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
        authorityMetadata: this.config.auth.authorityMetadata,
        azureRegionConfiguration: B,
        skipAuthorityMetadataCache: this.config.auth.skipAuthorityMetadataCache
      };
    return lA1.createDiscoveredInstance(Z, this.config.system.networkClient, this.storage, I, this.logger, Q)
  }
  clearCache() {
    this.storage.clear()
  }
}
// @from(Start 8200101, End 8200258)
b11 = L(() => {
  p7();
  ks1();
  $NA();
  N11();
  UI();
  ms1();
  x11();
  pZA();
  HNA();
  Wr1();
  uoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8200284, End 8201732)
class Xr1 {
  async listenForAuthCode(A, Q) {
    if (this.server) throw WY.createLoopbackServerAlreadyExistsError();
    return new Promise((B, G) => {
      this.server = rt6.createServer((Z, I) => {
        let Y = Z.url;
        if (!Y) {
          I.end(Q || "Error occurred loading redirectUrl"), G(WY.createUnableToLoadRedirectUrlError());
          return
        } else if (Y === L0.FORWARD_SLASH) {
          I.end(A || "Auth code was successfully acquired. You can close this window now.");
          return
        }
        let J = this.getRedirectUri(),
          W = new URL(Y, J),
          X = OD.getDeserializedResponse(W.search) || {};
        if (X.code) I.writeHead(o4.REDIRECT, {
          location: J
        }), I.end();
        if (X.error) I.end(Q || `Error occurred: ${X.error}`);
        B(X)
      }), this.server.listen(0, "127.0.0.1")
    })
  }
  getRedirectUri() {
    if (!this.server || !this.server.listening) throw WY.createNoLoopbackServerExistsError();
    let A = this.server.address();
    if (!A || typeof A === "string" || !A.port) throw this.closeServer(), WY.createInvalidLoopbackAddressTypeError();
    let Q = A && A.port;
    return `${qE.HTTP_PROTOCOL}${qE.LOCALHOST}:${Q}`
  }
  closeServer() {
    if (this.server) {
      if (this.server.close(), typeof this.server.closeAllConnections === "function") this.server.closeAllConnections();
      this.server.unref(), this.server = void 0
    }
  }
}
// @from(Start 8201737, End 8201822)
moB = L(() => {
  p7();
  HNA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8201828, End 8201831)
RNA
// @from(Start 8201837, End 8207339)
Vr1 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  RNA = class RNA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      let Q = await this.getDeviceCode(A);
      A.deviceCodeCallback(Q);
      let B = EI.nowSeconds(),
        G = await this.acquireTokenWithDeviceCode(A, Q),
        Z = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return Z.validateTokenResponse(G), Z.handleServerTokenResponse(G, this.authority, B, A)
    }
    async getDeviceCode(A) {
      let Q = this.createExtraQueryParameters(A),
        B = w8.appendQueryString(this.authority.deviceCodeEndpoint, Q),
        G = this.createQueryString(A),
        Z = this.createTokenRequestHeaders(),
        I = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        };
      return this.executePostRequestToDeviceCodeEndpoint(B, G, Z, I, A.correlationId)
    }
    createExtraQueryParameters(A) {
      let Q = new Map;
      if (A.extraQueryParameters) PB.addExtraQueryParameters(Q, A.extraQueryParameters);
      return OD.mapToQueryString(Q)
    }
    async executePostRequestToDeviceCodeEndpoint(A, Q, B, G, Z) {
      let {
        body: {
          user_code: I,
          device_code: Y,
          verification_uri: J,
          expires_in: W,
          interval: X,
          message: V
        }
      } = await this.sendPostRequest(G, A, {
        body: Q,
        headers: B
      }, Z);
      return {
        userCode: I,
        deviceCode: Y,
        verificationUri: J,
        expiresIn: W,
        interval: X,
        message: V
      }
    }
    createQueryString(A) {
      let Q = new Map;
      if (PB.addScopes(Q, A.scopes), PB.addClientId(Q, this.config.authOptions.clientId), A.extraQueryParameters) PB.addExtraQueryParameters(Q, A.extraQueryParameters);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
    continuePolling(A, Q, B) {
      if (B) throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true"), b0(fG.deviceCodePollingCancelled);
      else if (Q && Q < A && EI.nowSeconds() > Q) throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${Q}`), b0(fG.userTimeoutReached);
      else if (EI.nowSeconds() > A) {
        if (Q) this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${Q}`);
        throw this.logger.error(`Device code expired. Expiration time of device code was ${A}`), b0(fG.deviceCodeExpired)
      }
      return !0
    }
    async acquireTokenWithDeviceCode(A, Q) {
      let B = this.createTokenQueryParameters(A),
        G = w8.appendQueryString(this.authority.tokenEndpoint, B),
        Z = this.createTokenRequestBody(A, Q),
        I = this.createTokenRequestHeaders(),
        Y = A.timeout ? EI.nowSeconds() + A.timeout : void 0,
        J = EI.nowSeconds() + Q.expiresIn,
        W = Q.interval * 1000;
      while (this.continuePolling(J, Y, A.cancel)) {
        let X = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          },
          V = await this.executePostToTokenEndpoint(G, Z, I, X, A.correlationId);
        if (V.body && V.body.error)
          if (V.body.error === L0.AUTHORIZATION_PENDING) this.logger.info("Authorization pending. Continue polling."), await EI.delay(W);
          else throw this.logger.info("Unexpected error in polling from the server"), Ba1(NZA.postRequestFailed, V.body.error);
        else return this.logger.verbose("Authorization completed successfully. Polling stopped."), V.body
      }
      throw this.logger.error("Polling stopped for unknown reasons."), b0(fG.deviceCodeUnknownError)
    }
    createTokenRequestBody(A, Q) {
      let B = new Map;
      PB.addScopes(B, A.scopes), PB.addClientId(B, this.config.authOptions.clientId), PB.addGrantType(B, OU.DEVICE_CODE_GRANT), PB.addDeviceCode(B, Q.deviceCode);
      let G = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(B, G), PB.addClientInfo(B), PB.addLibraryInfo(B, this.config.libraryInfo), PB.addApplicationTelemetry(B, this.config.telemetry.application), PB.addThrottling(B), this.serverTelemetryManager) PB.addServerTelemetry(B, this.serverTelemetryManager);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(B, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(B)
    }
  }
})
// @from(Start 8207345, End 8207348)
TNA
// @from(Start 8207354, End 8213332)
doB = L(() => {
  UI();
  p7();
  b11();
  HNA();
  moB();
  Vr1();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  TNA = class TNA extends EAA {
    constructor(A) {
      super(A);
      if (this.config.broker.nativeBrokerPlugin)
        if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable) this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
        else this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.");
      this.skus = zl.makeExtraSkuString({
        libraryName: qE.MSAL_SKU,
        libraryVersion: pT
      })
    }
    async acquireTokenByDeviceCode(A) {
      this.logger.info("acquireTokenByDeviceCode called", A.correlationId);
      let Q = Object.assign(A, await this.initializeBaseRequest(A)),
        B = this.initializeServerTelemetryManager(af.acquireTokenByDeviceCode, Q.correlationId);
      try {
        let G = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          Z = await this.buildOauthClientConfiguration(G, Q.correlationId, "", B),
          I = new RNA(Z);
        return this.logger.verbose("Device code client created", Q.correlationId), await I.acquireToken(Q)
      } catch (G) {
        if (G instanceof t4) G.setCorrelationId(Q.correlationId);
        throw B.cacheFailedRequest(G), G
      }
    }
    async acquireTokenInteractive(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      this.logger.trace("acquireTokenInteractive called", Q);
      let {
        openBrowser: B,
        successTemplate: G,
        errorTemplate: Z,
        windowHandle: I,
        loopbackClient: Y,
        ...J
      } = A;
      if (this.nativeBrokerPlugin) {
        let D = {
          ...J,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || nH,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...J.extraQueryParameters,
            ...J.tokenQueryParameters,
            [GAA.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: J.account?.nativeAccountId
        };
        return this.nativeBrokerPlugin.acquireTokenInteractive(D, I)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw WY.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      let {
        verifier: W,
        challenge: X
      } = await this.cryptoProvider.generatePkceCodes(), V = Y || new Xr1, F = {}, K = null;
      try {
        let D = V.listenForAuthCode(G, Z).then((w) => {
            F = w
          }).catch((w) => {
            K = w
          }),
          H = await this.waitForRedirectUri(V),
          C = {
            ...J,
            correlationId: Q,
            scopes: A.scopes || nH,
            redirectUri: H,
            responseMode: Wk.QUERY,
            codeChallenge: X,
            codeChallengeMethod: zA1.S256
          },
          E = await this.getAuthCodeUrl(C);
        if (await B(E), await D, K) throw K;
        if (F.error) throw new $E(F.error, F.error_description, F.suberror);
        else if (!F.code) throw WY.createNoAuthCodeInResponseError();
        let U = F.client_info,
          q = {
            code: F.code,
            codeVerifier: W,
            clientInfo: U || L0.EMPTY_STRING,
            ...C
          };
        return await this.acquireTokenByCode(q)
      } finally {
        V.closeServer()
      }
    }
    async acquireTokenSilent(A) {
      let Q = A.correlationId || this.cryptoProvider.createNewGuid();
      if (this.logger.trace("acquireTokenSilent called", Q), this.nativeBrokerPlugin) {
        let B = {
          ...A,
          clientId: this.config.auth.clientId,
          scopes: A.scopes || nH,
          redirectUri: A.redirectUri || "",
          authority: A.authority || this.config.auth.authority,
          correlationId: Q,
          extraParameters: {
            ...A.tokenQueryParameters,
            [GAA.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: A.account.nativeAccountId,
          forceRefresh: A.forceRefresh || !1
        };
        return this.nativeBrokerPlugin.acquireTokenSilent(B)
      }
      if (A.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin) throw WY.createRedirectUriNotSupportedError();
        A.redirectUri = ""
      }
      return super.acquireTokenSilent(A)
    }
    async signOut(A) {
      if (this.nativeBrokerPlugin && A.account.nativeAccountId) {
        let Q = {
          clientId: this.config.auth.clientId,
          accountId: A.account.nativeAccountId,
          correlationId: A.correlationId || this.cryptoProvider.createNewGuid()
        };
        await this.nativeBrokerPlugin.signOut(Q)
      }
      await this.getTokenCache().removeAccount(A.account, A.correlationId)
    }
    async getAllAccounts() {
      if (this.nativeBrokerPlugin) {
        let A = this.cryptoProvider.createNewGuid();
        return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, A)
      }
      return this.getTokenCache().getAllAccounts()
    }
    async waitForRedirectUri(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = setInterval(() => {
            if (W11.TIMEOUT_MS / W11.INTERVAL_MS < G) {
              clearInterval(Z), B(WY.createLoopbackServerTimeoutError());
              return
            }
            try {
              let I = A.getRedirectUri();
              clearInterval(Z), Q(I);
              return
            } catch (I) {
              if (I instanceof t4 && I.errorCode === lX.noLoopbackServerExists.code) {
                G++;
                return
              }
              clearInterval(Z), B(I);
              return
            }
          }, W11.INTERVAL_MS)
      })
    }
  }
})
// @from(Start 8213338, End 8213341)
zAA
// @from(Start 8213347, End 8218818)
f11 = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  zAA = class zAA extends sH {
    constructor(A, Q) {
      super(A);
      this.appTokenProvider = Q
    }
    async acquireToken(A) {
      if (A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority);
      let [Q, B] = await this.getCachedAuthenticationResult(A, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
      if (Q) {
        if (B === FZ.PROACTIVELY_REFRESHED) {
          this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
          let G = !0;
          await this.executeTokenRequest(A, this.authority, G)
        }
        return Q
      } else return this.executeTokenRequest(A, this.authority)
    }
    async getCachedAuthenticationResult(A, Q, B, G, Z, I) {
      let Y = Q,
        J = Q,
        W = FZ.NOT_APPLICABLE,
        X;
      if (Y.serializableCache && Y.persistencePlugin) X = new SM(Y.serializableCache, !1), await Y.persistencePlugin.beforeCacheAccess(X);
      let V = this.readAccessTokenFromCache(G, J.managedIdentityId?.id || Y.authOptions.clientId, new SJ(A.scopes || []), Z, A.correlationId);
      if (Y.serializableCache && Y.persistencePlugin && X) await Y.persistencePlugin.afterCacheAccess(X);
      if (!V) return I?.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN), [null, FZ.NO_CACHED_ACCESS_TOKEN];
      if (EI.isTokenExpired(V.expiresOn, Y.systemOptions?.tokenRenewalOffsetSeconds || qZA)) return I?.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED), [null, FZ.CACHED_ACCESS_TOKEN_EXPIRED];
      if (V.refreshOn && EI.isTokenExpired(V.refreshOn.toString(), 0)) W = FZ.PROACTIVELY_REFRESHED, I?.setCacheOutcome(FZ.PROACTIVELY_REFRESHED);
      return [await _J.generateAuthenticationResult(B, G, {
        account: null,
        idToken: null,
        accessToken: V,
        refreshToken: null,
        appMetadata: null
      }, !0, A), W]
    }
    readAccessTokenFromCache(A, Q, B, G, Z) {
      let I = {
          homeAccountId: L0.EMPTY_STRING,
          environment: A.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: c7.ACCESS_TOKEN,
          clientId: Q,
          realm: A.tenant,
          target: SJ.createSearchScopes(B.asArray())
        },
        Y = G.getAccessTokensByFilter(I, Z);
      if (Y.length < 1) return null;
      else if (Y.length > 1) throw b0(fG.multipleMatchingTokens);
      return Y[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G, Z;
      if (this.appTokenProvider) {
        this.logger.info("Using appTokenProvider extensibility.");
        let J = {
          correlationId: A.correlationId,
          tenantId: this.config.authOptions.authority.tenant,
          scopes: A.scopes,
          claims: A.claims
        };
        Z = EI.nowSeconds();
        let W = await this.appTokenProvider(J);
        G = {
          access_token: W.accessToken,
          expires_in: W.expiresInSeconds,
          refresh_in: W.refreshInSeconds,
          token_type: A5.BEARER
        }
      } else {
        let J = this.createTokenQueryParameters(A),
          W = w8.appendQueryString(Q.tokenEndpoint, J),
          X = await this.createTokenRequestBody(A),
          V = this.createTokenRequestHeaders(),
          F = {
            clientId: this.config.authOptions.clientId,
            authority: A.authority,
            scopes: A.scopes,
            claims: A.claims,
            authenticationScheme: A.authenticationScheme,
            resourceRequestMethod: A.resourceRequestMethod,
            resourceRequestUri: A.resourceRequestUri,
            shrClaims: A.shrClaims,
            sshKid: A.sshKid
          };
        this.logger.info("Sending token request to endpoint: " + Q.tokenEndpoint), Z = EI.nowSeconds();
        let K = await this.executePostToTokenEndpoint(W, X, V, F, A.correlationId);
        G = K.body, G.status = K.status
      }
      let I = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return I.validateTokenResponse(G, B), await I.handleServerTokenResponse(G, this.authority, Z, A)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addScopes(Q, A.scopes, !1), PB.addGrantType(Q, OU.CLIENT_CREDENTIALS_GRANT), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = A.clientAssertion || this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (!KZ.isEmptyObj(A.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8218824, End 8218827)
PNA
// @from(Start 8218833, End 8224483)
Fr1 = L(() => {
  p7();
  UNA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  PNA = class PNA extends sH {
    constructor(A) {
      super(A)
    }
    async acquireToken(A) {
      if (this.scopeSet = new SJ(A.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(A.oboAssertion), A.skipCache || A.claims) return this.executeTokenRequest(A, this.authority, this.userAssertionHash);
      try {
        return await this.getCachedAuthenticationResult(A)
      } catch (Q) {
        return await this.executeTokenRequest(A, this.authority, this.userAssertionHash)
      }
    }
    async getCachedAuthenticationResult(A) {
      let Q = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, A);
      if (!Q) throw this.serverTelemetryManager?.setCacheOutcome(FZ.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties."), b0(fG.tokenRefreshRequired);
      else if (EI.isTokenExpired(Q.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds)) throw this.serverTelemetryManager?.setCacheOutcome(FZ.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`), b0(fG.tokenRefreshRequired);
      let B = this.readIdTokenFromCacheForOBO(Q.homeAccountId, A.correlationId),
        G, Z = null;
      if (B) {
        G = PA1.extractTokenClaims(B.secret, PU.base64Decode);
        let I = G.oid || G.sub,
          Y = {
            homeAccountId: B.homeAccountId,
            environment: B.environment,
            tenantId: B.realm,
            username: L0.EMPTY_STRING,
            localAccountId: I || L0.EMPTY_STRING
          };
        Z = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(Y), A.correlationId)
      }
      if (this.config.serverTelemetryManager) this.config.serverTelemetryManager.incrementCacheHits();
      return _J.generateAuthenticationResult(this.cryptoUtils, this.authority, {
        account: Z,
        accessToken: Q,
        idToken: B,
        refreshToken: null,
        appMetadata: null
      }, !0, A, G)
    }
    readIdTokenFromCacheForOBO(A, Q) {
      let B = {
          homeAccountId: A,
          environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
          credentialType: c7.ID_TOKEN,
          clientId: this.config.authOptions.clientId,
          realm: this.authority.tenant
        },
        G = this.cacheManager.getIdTokensByFilter(B, Q);
      if (Object.values(G).length < 1) return null;
      return Object.values(G)[0]
    }
    readAccessTokenFromCacheForOBO(A, Q) {
      let B = Q.authenticationScheme || A5.BEARER,
        Z = {
          credentialType: B && B.toLowerCase() !== A5.BEARER.toLowerCase() ? c7.ACCESS_TOKEN_WITH_AUTH_SCHEME : c7.ACCESS_TOKEN,
          clientId: A,
          target: SJ.createSearchScopes(this.scopeSet.asArray()),
          tokenType: B,
          keyId: Q.sshKid,
          requestedClaimsHash: Q.requestedClaimsHash,
          userAssertionHash: this.userAssertionHash
        },
        I = this.cacheManager.getAccessTokensByFilter(Z, Q.correlationId),
        Y = I.length;
      if (Y < 1) return null;
      else if (Y > 1) throw b0(fG.multipleMatchingTokens);
      return I[0]
    }
    async executeTokenRequest(A, Q, B) {
      let G = this.createTokenQueryParameters(A),
        Z = w8.appendQueryString(Q.tokenEndpoint, G),
        I = await this.createTokenRequestBody(A),
        Y = this.createTokenRequestHeaders(),
        J = {
          clientId: this.config.authOptions.clientId,
          authority: A.authority,
          scopes: A.scopes,
          claims: A.claims,
          authenticationScheme: A.authenticationScheme,
          resourceRequestMethod: A.resourceRequestMethod,
          resourceRequestUri: A.resourceRequestUri,
          shrClaims: A.shrClaims,
          sshKid: A.sshKid
        },
        W = EI.nowSeconds(),
        X = await this.executePostToTokenEndpoint(Z, I, Y, J, A.correlationId),
        V = new _J(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.config.serializableCache, this.config.persistencePlugin);
      return V.validateTokenResponse(X.body), await V.handleServerTokenResponse(X.body, this.authority, W, A, void 0, B)
    }
    async createTokenRequestBody(A) {
      let Q = new Map;
      if (PB.addClientId(Q, this.config.authOptions.clientId), PB.addScopes(Q, A.scopes), PB.addGrantType(Q, OU.JWT_BEARER), PB.addClientInfo(Q), PB.addLibraryInfo(Q, this.config.libraryInfo), PB.addApplicationTelemetry(Q, this.config.telemetry.application), PB.addThrottling(Q), this.serverTelemetryManager) PB.addServerTelemetry(Q, this.serverTelemetryManager);
      let B = A.correlationId || this.config.cryptoInterface.createNewGuid();
      if (PB.addCorrelationId(Q, B), PB.addRequestTokenUse(Q, GAA.ON_BEHALF_OF), PB.addOboAssertion(Q, A.oboAssertion), this.config.clientCredentials.clientSecret) PB.addClientSecret(Q, this.config.clientCredentials.clientSecret);
      let G = this.config.clientCredentials.clientAssertion;
      if (G) PB.addClientAssertion(Q, await wE(G.assertion, this.config.authOptions.clientId, A.resourceRequestUri)), PB.addClientAssertionType(Q, G.assertionType);
      if (A.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0) PB.addClaims(Q, A.claims, this.config.authOptions.clientCapabilities);
      return OD.mapToQueryString(Q)
    }
  }
})
// @from(Start 8224489, End 8224492)
jNA
// @from(Start 8224498, End 8228153)
coB = L(() => {
  b11();
  x11();
  UI();
  p7();
  f11();
  Fr1(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  jNA = class jNA extends EAA {
    constructor(A) {
      super(A);
      let Q = !!this.config.auth.clientSecret,
        B = !!this.config.auth.clientAssertion,
        G = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
      if (this.appTokenProvider) return;
      if (Q && B || B && G || Q && G) throw b0(fG.invalidClientCredential);
      if (this.config.auth.clientSecret) {
        this.clientSecret = this.config.auth.clientSecret;
        return
      }
      if (this.config.auth.clientAssertion) {
        this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
        return
      }
      if (!G) throw b0(fG.invalidClientCredential);
      else this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? cT.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : cT.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
      this.appTokenProvider = void 0
    }
    SetAppTokenProvider(A) {
      this.appTokenProvider = A
    }
    async acquireTokenByClientCredential(A) {
      this.logger.info("acquireTokenByClientCredential called", A.correlationId);
      let Q;
      if (A.clientAssertion) Q = {
        assertion: await wE(A.clientAssertion, this.config.auth.clientId),
        assertionType: qE.JWT_BEARER_ASSERTION_TYPE
      };
      let B = await this.initializeBaseRequest(A),
        G = {
          ...B,
          scopes: B.scopes.filter((F) => !nH.includes(F))
        },
        Z = {
          ...A,
          ...G,
          clientAssertion: Q
        },
        Y = new w8(Z.authority).getUrlComponents().PathSegments[0];
      if (Object.values(MU).includes(Y)) throw b0(fG.missingTenantIdError);
      let J = process.env[taB],
        W;
      if (Z.azureRegion !== "DisableMsalForceRegion")
        if (!Z.azureRegion && J) W = J;
        else W = Z.azureRegion;
      let X = {
          azureRegion: W,
          environmentRegion: process.env[oaB]
        },
        V = this.initializeServerTelemetryManager(af.acquireTokenByClientCredential, Z.correlationId, Z.skipCache);
      try {
        let F = await this.createAuthority(Z.authority, Z.correlationId, X, A.azureCloudOptions),
          K = await this.buildOauthClientConfiguration(F, Z.correlationId, "", V),
          D = new zAA(K, this.appTokenProvider);
        return this.logger.verbose("Client credential client created", Z.correlationId), await D.acquireToken(Z)
      } catch (F) {
        if (F instanceof t4) F.setCorrelationId(Z.correlationId);
        throw V.cacheFailedRequest(F), F
      }
    }
    async acquireTokenOnBehalfOf(A) {
      this.logger.info("acquireTokenOnBehalfOf called", A.correlationId);
      let Q = {
        ...A,
        ...await this.initializeBaseRequest(A)
      };
      try {
        let B = await this.createAuthority(Q.authority, Q.correlationId, void 0, A.azureCloudOptions),
          G = await this.buildOauthClientConfiguration(B, Q.correlationId, "", void 0),
          Z = new PNA(G);
        return this.logger.verbose("On behalf of client created", Q.correlationId), await Z.acquireToken(Q)
      } catch (B) {
        if (B instanceof t4) B.setCorrelationId(Q.correlationId);
        throw B
      }
    }
  }
})
// @from(Start 8228156, End 8228292)
function poB(A) {
  if (typeof A !== "string") return !1;
  let Q = new Date(A);
  return !isNaN(Q.getTime()) && Q.toISOString() === A
}
// @from(Start 8228297, End 8228359)
loB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8228361, End 8229247)
class Kr1 {
  constructor(A, Q, B) {
    this.httpClientNoRetries = A, this.retryPolicy = Q, this.logger = B
  }
  async sendNetworkRequestAsyncHelper(A, Q, B) {
    if (A === zI.GET) return this.httpClientNoRetries.sendGetRequestAsync(Q, B);
    else return this.httpClientNoRetries.sendPostRequestAsync(Q, B)
  }
  async sendNetworkRequestAsync(A, Q, B) {
    let G = await this.sendNetworkRequestAsyncHelper(A, Q, B);
    if ("isNewRequest" in this.retryPolicy) this.retryPolicy.isNewRequest = !0;
    let Z = 0;
    while (await this.retryPolicy.pauseForRetry(G.status, Z, this.logger, G.headers[uZ.RETRY_AFTER])) G = await this.sendNetworkRequestAsyncHelper(A, Q, B), Z++;
    return G
  }
  async sendGetRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(zI.GET, A, Q)
  }
  async sendPostRequestAsync(A, Q) {
    return this.sendNetworkRequestAsync(zI.POST, A, Q)
  }
}
// @from(Start 8229252, End 8229328)
ioB = L(() => {
  p7();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8229330, End 8232614)
class jU {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async getServerTokenResponseAsync(A, Q, B, G) {
    return this.getServerTokenResponse(A)
  }
  getServerTokenResponse(A) {
    let Q, B;
    if (A.body.expires_on) {
      if (poB(A.body.expires_on)) A.body.expires_on = new Date(A.body.expires_on).getTime() / 1000;
      if (B = A.body.expires_on - EI.nowSeconds(), B > 7200) Q = B / 2
    }
    return {
      status: A.status,
      access_token: A.body.access_token,
      expires_in: B,
      scope: A.body.resource,
      token_type: A.body.token_type,
      refresh_in: Q,
      correlation_id: A.body.correlation_id || A.body.correlationId,
      error: typeof A.body.error === "string" ? A.body.error : A.body.error?.code,
      error_description: A.body.message || (typeof A.body.error === "string" ? A.body.error_description : A.body.error?.message),
      error_codes: A.body.error_codes,
      timestamp: A.body.timestamp,
      trace_id: A.body.trace_id
    }
  }
  async acquireTokenWithManagedIdentity(A, Q, B, G) {
    let Z = this.createRequest(A.resource, Q);
    if (A.revokedTokenSha256Hash) this.logger.info(`[Managed Identity] The following claims are present in the request: ${A.claims}`), Z.queryParameters[pX.SHA256_TOKEN_TO_REFRESH] = A.revokedTokenSha256Hash;
    if (A.clientCapabilities?.length) {
      let K = A.clientCapabilities.toString();
      this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${K}`), Z.queryParameters[pX.XMS_CC] = K
    }
    let I = Z.headers;
    I[uZ.CONTENT_TYPE] = L0.URL_FORM_CONTENT_TYPE;
    let Y = {
      headers: I
    };
    if (Object.keys(Z.bodyParameters).length) Y.body = Z.computeParametersBodyString();
    let J = this.disableInternalRetries ? this.networkClient : new Kr1(this.networkClient, Z.retryPolicy, this.logger),
      W = EI.nowSeconds(),
      X;
    try {
      if (Z.httpMethod === zI.POST) X = await J.sendPostRequestAsync(Z.computeUri(), Y);
      else X = await J.sendGetRequestAsync(Z.computeUri(), Y)
    } catch (K) {
      if (K instanceof t4) throw K;
      else throw b0(fG.networkError)
    }
    let V = new _J(Q.id, this.nodeStorage, this.cryptoProvider, this.logger, null, null),
      F = await this.getServerTokenResponseAsync(X, J, Z, Y);
    return V.validateTokenResponse(F, G), V.handleServerTokenResponse(F, B, W, A)
  }
  getManagedIdentityUserAssignedIdQueryParameterKey(A, Q, B) {
    switch (A) {
      case iY.USER_ASSIGNED_CLIENT_ID:
        return this.logger.info(`[Managed Identity] [API version ${B?"2017+":"2019+"}] Adding user assigned client id to the request.`), B ? UAA.MANAGED_IDENTITY_CLIENT_ID_2017 : UAA.MANAGED_IDENTITY_CLIENT_ID;
      case iY.USER_ASSIGNED_RESOURCE_ID:
        return this.logger.info("[Managed Identity] Adding user assigned resource id to the request."), Q ? UAA.MANAGED_IDENTITY_RESOURCE_ID_IMDS : UAA.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
      case iY.USER_ASSIGNED_OBJECT_ID:
        return this.logger.info("[Managed Identity] Adding user assigned object id to the request."), UAA.MANAGED_IDENTITY_OBJECT_ID;
      default:
        throw _W($l)
    }
  }
}
// @from(Start 8232619, End 8232622)
UAA
// @from(Start 8232628, End 8233275)
$AA = L(() => {
  p7();
  UI();
  uZA();
  loB();
  ioB();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  UAA = {
    MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
    MANAGED_IDENTITY_CLIENT_ID: "client_id",
    MANAGED_IDENTITY_OBJECT_ID: "object_id",
    MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
    MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
  };
  jU.getValidatedEnvVariableUrlString = (A, Q, B, G) => {
    try {
      return new w8(Q).urlString
    } catch (Z) {
      throw G.info(`[Managed Identity] ${B} managed identity is unavailable because the '${A}' environment variable is malformed.`), _W(KAA[A])
    }
  }
})
// @from(Start 8233277, End 8233481)
class Dr1 {
  calculateDelay(A, Q) {
    if (!A) return Q;
    let B = Math.round(parseFloat(A) * 1000);
    if (isNaN(B)) B = new Date(A).valueOf() - new Date().valueOf();
    return Math.max(Q, B)
  }
}
// @from(Start 8233486, End 8233548)
noB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8233550, End 8234051)
class h11 {
  constructor() {
    this.linearRetryStrategy = new Dr1
  }
  static get DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS() {
    return tt6
  }
  async pauseForRetry(A, Q, B, G) {
    if (et6.includes(A) && Q < ot6) {
      let Z = this.linearRetryStrategy.calculateDelay(G, h11.DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS);
      return B.verbose(`Retrying request in ${Z}ms (retry attempt: ${Q+1})`), await new Promise((I) => {
        return setTimeout(I, Z)
      }), !0
    }
    return !1
  }
}
// @from(Start 8234056, End 8234063)
ot6 = 3
// @from(Start 8234067, End 8234077)
tt6 = 1000
// @from(Start 8234081, End 8234084)
et6
// @from(Start 8234090, End 8234294)
aoB = L(() => {
  q11();
  noB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  et6 = [o4.NOT_FOUND, o4.REQUEST_TIMEOUT, o4.TOO_MANY_REQUESTS, o4.SERVER_ERROR, o4.SERVICE_UNAVAILABLE, o4.GATEWAY_TIMEOUT]
})
// @from(Start 8234296, End 8234880)
class Xq {
  constructor(A, Q, B) {
    this.httpMethod = A, this._baseEndpoint = Q, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = B || new h11
  }
  computeUri() {
    let A = new Map;
    if (this.queryParameters) PB.addExtraQueryParameters(A, this.queryParameters);
    let Q = OD.mapToQueryString(A);
    return w8.appendQueryString(this._baseEndpoint, Q)
  }
  computeParametersBodyString() {
    let A = new Map;
    if (this.bodyParameters) PB.addExtraQueryParameters(A, this.bodyParameters);
    return OD.mapToQueryString(A)
  }
}
// @from(Start 8234885, End 8234962)
wAA = L(() => {
  p7();
  aoB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8234968, End 8234986)
Ae6 = "2019-08-01"
// @from(Start 8234990, End 8234993)
qAA
// @from(Start 8234999, End 8236429)
soB = L(() => {
  $AA();
  UI();
  wAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  qAA = class qAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I, this.identityHeader = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IDENTITY_HEADER];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [I, Y] = qAA.getEnvironmentVariables();
      if (!I || !Y) return A.info(`[Managed Identity] ${S4.APP_SERVICE} managed identity is unavailable because one or both of the '${C4.IDENTITY_HEADER}' and '${C4.IDENTITY_ENDPOINT}' environment variables are not defined.`), null;
      let J = qAA.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, I, S4.APP_SERVICE, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${S4.APP_SERVICE} managed identity. Endpoint URI: ${J}. Creating ${S4.APP_SERVICE} managed identity.`), new qAA(A, Q, B, G, Z, I, Y)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[pX.API_VERSION] = Ae6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Start 8236563, End 8236581)
Ie6 = "2019-11-01"
// @from(Start 8236585, End 8236646)
ooB = "http://127.0.0.1:40342/metadata/identity/oauth2/token"
// @from(Start 8236650, End 8236686)
toB = "N/A: himds executable exists"
// @from(Start 8236690, End 8236693)
eoB
// @from(Start 8236695, End 8236698)
Ye6
// @from(Start 8236700, End 8236702)
ql
// @from(Start 8236708, End 8240112)
AtB = L(() => {
  p7();
  wAA();
  $AA();
  uZA();
  UI();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  eoB = {
    win32: `${process.env.ProgramData}\\AzureConnectedMachineAgent\\Tokens\\`,
    linux: "/var/opt/azcmagent/tokens/"
  }, Ye6 = {
    win32: `${process.env.ProgramFiles}\\AzureConnectedMachineAgent\\himds.exe`,
    linux: "/opt/azcmagent/bin/himds"
  };
  ql = class ql extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IMDS_ENDPOINT];
      if (!A || !Q) {
        let B = Ye6[process.platform];
        try {
          Qe6(B, roB.F_OK | roB.R_OK), A = ooB, Q = toB
        } catch (G) {}
      }
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y, J] = ql.getEnvironmentVariables();
      if (!Y || !J) return A.info(`[Managed Identity] ${S4.AZURE_ARC} managed identity is unavailable through environment variables because one or both of '${C4.IDENTITY_ENDPOINT}' and '${C4.IMDS_ENDPOINT}' are not defined. ${S4.AZURE_ARC} managed identity is also unavailable through file detection.`), null;
      if (J === toB) A.info(`[Managed Identity] ${S4.AZURE_ARC} managed identity is available through file detection. Defaulting to known ${S4.AZURE_ARC} endpoint: ${ooB}. Creating ${S4.AZURE_ARC} managed identity.`);
      else {
        let W = ql.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, Y, S4.AZURE_ARC, A);
        W.endsWith("/") && W.slice(0, -1), ql.getValidatedEnvVariableUrlString(C4.IMDS_ENDPOINT, J, S4.AZURE_ARC, A), A.info(`[Managed Identity] Environment variables validation passed for ${S4.AZURE_ARC} managed identity. Endpoint URI: ${W}. Creating ${S4.AZURE_ARC} managed identity.`)
      }
      if (I.idType !== iY.SYSTEM_ASSIGNED) throw _W(D11);
      return new ql(A, Q, B, G, Z, Y)
    }
    createRequest(A) {
      let Q = new Xq(zI.GET, this.identityEndpoint.replace("localhost", "127.0.0.1"));
      return Q.headers[TU.METADATA_HEADER_NAME] = "true", Q.queryParameters[pX.API_VERSION] = Ie6, Q.queryParameters[pX.RESOURCE] = A, Q
    }
    async getServerTokenResponseAsync(A, Q, B, G) {
      let Z;
      if (A.status === o4.UNAUTHORIZED) {
        let I = A.headers["www-authenticate"];
        if (!I) throw _W(E11);
        if (!I.includes("Basic realm=")) throw _W(z11);
        let Y = I.split("Basic realm=")[1];
        if (!eoB.hasOwnProperty(process.platform)) throw _W(K11);
        let J = eoB[process.platform],
          W = Ze6.basename(Y);
        if (!W.endsWith(".key")) throw _W(X11);
        if (J + W !== Y) throw _W(V11);
        let X;
        try {
          X = await Be6(Y).size
        } catch (K) {
          throw _W(DNA)
        }
        if (X > QsB) throw _W(F11);
        let V;
        try {
          V = Ge6(Y, MD.UTF8)
        } catch (K) {
          throw _W(DNA)
        }
        let F = `Basic ${V}`;
        this.logger.info("[Managed Identity] Adding authorization header to the request."), B.headers[TU.AUTHORIZATION_HEADER_NAME] = F;
        try {
          Z = await Q.sendGetRequestAsync(B.computeUri(), G)
        } catch (K) {
          if (K instanceof t4) throw K;
          else throw b0(fG.networkError)
        }
      }
      return this.getServerTokenResponse(Z || A)
    }
  }
})
// @from(Start 8240118, End 8240121)
NAA
// @from(Start 8240127, End 8241257)
QtB = L(() => {
  wAA();
  $AA();
  UI();
  uZA();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  NAA = class NAA extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = I
    }
    static getEnvironmentVariables() {
      return [process.env[C4.MSI_ENDPOINT]]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y] = NAA.getEnvironmentVariables();
      if (!Y) return A.info(`[Managed Identity] ${S4.CLOUD_SHELL} managed identity is unavailable because the '${C4.MSI_ENDPOINT} environment variable is not defined.`), null;
      let J = NAA.getValidatedEnvVariableUrlString(C4.MSI_ENDPOINT, Y, S4.CLOUD_SHELL, A);
      if (A.info(`[Managed Identity] Environment variable validation passed for ${S4.CLOUD_SHELL} managed identity. Endpoint URI: ${J}. Creating ${S4.CLOUD_SHELL} managed identity.`), I.idType !== iY.SYSTEM_ASSIGNED) throw _W(H11);
      return new NAA(A, Q, B, G, Z, Y)
    }
    createRequest(A) {
      let Q = new Xq(zI.POST, this.msiEndpoint);
      return Q.headers[TU.METADATA_HEADER_NAME] = "true", Q.bodyParameters[pX.RESOURCE] = A, Q
    }
  }
})
// @from(Start 8241259, End 8241579)
class Hr1 {
  constructor(A, Q, B) {
    this.minExponentialBackoff = A, this.maxExponentialBackoff = Q, this.exponentialDeltaBackoff = B
  }
  calculateDelay(A) {
    if (A === 0) return this.minExponentialBackoff;
    return Math.min(Math.pow(2, A - 1) * this.exponentialDeltaBackoff, this.maxExponentialBackoff)
  }
}
// @from(Start 8241584, End 8241646)
BtB = L(() => {
  /*! @azure/msal-node v3.8.1 2025-10-29 */ })
// @from(Start 8241648, End 8242706)
class LAA {
  constructor() {
    this.exponentialRetryStrategy = new Hr1(LAA.MIN_EXPONENTIAL_BACKOFF_MS, LAA.MAX_EXPONENTIAL_BACKOFF_MS, LAA.EXPONENTIAL_DELTA_BACKOFF_MS)
  }
  static get MIN_EXPONENTIAL_BACKOFF_MS() {
    return Ve6
  }
  static get MAX_EXPONENTIAL_BACKOFF_MS() {
    return Fe6
  }
  static get EXPONENTIAL_DELTA_BACKOFF_MS() {
    return Ke6
  }
  static get HTTP_STATUS_GONE_RETRY_AFTER_MS() {
    return De6
  }
  set isNewRequest(A) {
    this._isNewRequest = A
  }
  async pauseForRetry(A, Q, B) {
    if (this._isNewRequest) this._isNewRequest = !1, this.maxRetries = A === o4.GONE ? Xe6 : We6;
    if ((Je6.includes(A) || A >= o4.SERVER_ERROR_RANGE_START && A <= o4.SERVER_ERROR_RANGE_END && Q < this.maxRetries) && Q < this.maxRetries) {
      let G = A === o4.GONE ? LAA.HTTP_STATUS_GONE_RETRY_AFTER_MS : this.exponentialRetryStrategy.calculateDelay(Q);
      return B.verbose(`Retrying request in ${G}ms (retry attempt: ${Q+1})`), await new Promise((Z) => {
        return setTimeout(Z, G)
      }), !0
    }
    return !1
  }
}
// @from(Start 8242711, End 8242714)
Je6
// @from(Start 8242716, End 8242723)
We6 = 3
// @from(Start 8242727, End 8242734)
Xe6 = 7
// @from(Start 8242738, End 8242748)
Ve6 = 1000
// @from(Start 8242752, End 8242762)
Fe6 = 4000
// @from(Start 8242766, End 8242776)
Ke6 = 2000
// @from(Start 8242780, End 8242789)
De6 = 1e4
// @from(Start 8242795, End 8242947)
GtB = L(() => {
  q11();
  BtB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Je6 = [o4.NOT_FOUND, o4.REQUEST_TIMEOUT, o4.GONE, o4.TOO_MANY_REQUESTS]
})
// @from(Start 8242953, End 8242992)
ZtB = "/metadata/identity/oauth2/token"
// @from(Start 8242996, End 8242999)
He6
// @from(Start 8243001, End 8243019)
Ce6 = "2018-02-01"
// @from(Start 8243023, End 8243026)
SNA
// @from(Start 8243032, End 8244349)
ItB = L(() => {
  wAA();
  $AA();
  UI();
  GtB(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  He6 = `http://169.254.169.254${ZtB}`;
  SNA = class SNA extends jU {
    constructor(A, Q, B, G, Z, I) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I
    }
    static tryCreate(A, Q, B, G, Z) {
      let I;
      if (process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]) A.info(`[Managed Identity] Environment variable ${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${S4.IMDS} returned endpoint: ${process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`), I = SNA.getValidatedEnvVariableUrlString(C4.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[C4.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${ZtB}`, S4.IMDS, A);
      else A.info(`[Managed Identity] Unable to find ${C4.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${S4.IMDS}, using the default endpoint.`), I = He6;
      return new SNA(A, Q, B, G, Z, I)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.METADATA_HEADER_NAME] = "true", B.queryParameters[pX.API_VERSION] = Ce6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !0)] = Q.id;
      return B.retryPolicy = new LAA, B
    }
  }
})
// @from(Start 8244355, End 8244381)
Ee6 = "2019-07-01-preview"
// @from(Start 8244385, End 8244388)
MAA
// @from(Start 8244394, End 8246248)
YtB = L(() => {
  wAA();
  $AA();
  UI(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  MAA = class MAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.identityEndpoint = I, this.identityHeader = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.IDENTITY_ENDPOINT],
        Q = process.env[C4.IDENTITY_HEADER],
        B = process.env[C4.IDENTITY_SERVER_THUMBPRINT];
      return [A, Q, B]
    }
    static tryCreate(A, Q, B, G, Z, I) {
      let [Y, J, W] = MAA.getEnvironmentVariables();
      if (!Y || !J || !W) return A.info(`[Managed Identity] ${S4.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${C4.IDENTITY_HEADER}', '${C4.IDENTITY_ENDPOINT}' or '${C4.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`), null;
      let X = MAA.getValidatedEnvVariableUrlString(C4.IDENTITY_ENDPOINT, Y, S4.SERVICE_FABRIC, A);
      if (A.info(`[Managed Identity] Environment variables validation passed for ${S4.SERVICE_FABRIC} managed identity. Endpoint URI: ${X}. Creating ${S4.SERVICE_FABRIC} managed identity.`), I.idType !== iY.SYSTEM_ASSIGNED) A.warning(`[Managed Identity] ${S4.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`);
      return new MAA(A, Q, B, G, Z, Y, J)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.identityEndpoint);
      if (B.headers[TU.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, B.queryParameters[pX.API_VERSION] = Ee6, B.queryParameters[pX.RESOURCE] = A, Q.idType !== iY.SYSTEM_ASSIGNED) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType)] = Q.id;
      return B
    }
  }
})
// @from(Start 8246254, End 8246272)
ze6 = "2017-09-01"
// @from(Start 8246276, End 8246279)
Ue6
// @from(Start 8246281, End 8246284)
OAA
// @from(Start 8246290, End 8248027)
JtB = L(() => {
  $AA();
  UI();
  wAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  Ue6 = `Only client id is supported for user-assigned managed identity in ${S4.MACHINE_LEARNING}.`;
  OAA = class OAA extends jU {
    constructor(A, Q, B, G, Z, I, Y) {
      super(A, Q, B, G, Z);
      this.msiEndpoint = I, this.secret = Y
    }
    static getEnvironmentVariables() {
      let A = process.env[C4.MSI_ENDPOINT],
        Q = process.env[C4.MSI_SECRET];
      return [A, Q]
    }
    static tryCreate(A, Q, B, G, Z) {
      let [I, Y] = OAA.getEnvironmentVariables();
      if (!I || !Y) return A.info(`[Managed Identity] ${S4.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${C4.MSI_ENDPOINT}' and '${C4.MSI_SECRET}' environment variables are not defined.`), null;
      let J = OAA.getValidatedEnvVariableUrlString(C4.MSI_ENDPOINT, I, S4.MACHINE_LEARNING, A);
      return A.info(`[Managed Identity] Environment variables validation passed for ${S4.MACHINE_LEARNING} managed identity. Endpoint URI: ${J}. Creating ${S4.MACHINE_LEARNING} managed identity.`), new OAA(A, Q, B, G, Z, I, Y)
    }
    createRequest(A, Q) {
      let B = new Xq(zI.GET, this.msiEndpoint);
      if (B.headers[TU.METADATA_HEADER_NAME] = "true", B.headers[TU.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, B.queryParameters[pX.API_VERSION] = ze6, B.queryParameters[pX.RESOURCE] = A, Q.idType === iY.SYSTEM_ASSIGNED) B.queryParameters[UAA.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[C4.DEFAULT_IDENTITY_CLIENT_ID];
      else if (Q.idType === iY.USER_ASSIGNED_CLIENT_ID) B.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(Q.idType, !1, !0)] = Q.id;
      else throw Error(Ue6);
      return B
    }
  }
})
// @from(Start 8248029, End 8249488)
class of {
  constructor(A, Q, B, G, Z) {
    this.logger = A, this.nodeStorage = Q, this.networkClient = B, this.cryptoProvider = G, this.disableInternalRetries = Z
  }
  async sendManagedIdentityTokenRequest(A, Q, B, G) {
    if (!of.identitySource) of.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, Q);
    return of.identitySource.acquireTokenWithManagedIdentity(A, Q, B, G)
  }
  allEnvironmentVariablesAreDefined(A) {
    return Object.values(A).every((Q) => {
      return Q !== void 0
    })
  }
  getManagedIdentitySource() {
    return of.sourceName = this.allEnvironmentVariablesAreDefined(MAA.getEnvironmentVariables()) ? S4.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(qAA.getEnvironmentVariables()) ? S4.APP_SERVICE : this.allEnvironmentVariablesAreDefined(OAA.getEnvironmentVariables()) ? S4.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(NAA.getEnvironmentVariables()) ? S4.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(ql.getEnvironmentVariables()) ? S4.AZURE_ARC : S4.DEFAULT_TO_IMDS, of.sourceName
  }
  selectManagedIdentitySource(A, Q, B, G, Z, I) {
    let Y = MAA.tryCreate(A, Q, B, G, Z, I) || qAA.tryCreate(A, Q, B, G, Z) || OAA.tryCreate(A, Q, B, G, Z) || NAA.tryCreate(A, Q, B, G, Z, I) || ql.tryCreate(A, Q, B, G, Z, I) || SNA.tryCreate(A, Q, B, G, Z);
    if (!Y) throw _W(C11);
    return Y
  }
}
// @from(Start 8249493, End 8249633)
WtB = L(() => {
  soB();
  AtB();
  QtB();
  ItB();
  YtB();
  uZA();
  UI();
  JtB();
  DAA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8249635, End 8252479)
class Ck {
  constructor(A) {
    this.config = DsB(A || {}), this.logger = new RU(this.config.system.loggerOptions, v11, pT);
    let Q = {
      canonicalAuthority: L0.DEFAULT_AUTHORITY
    };
    if (!Ck.nodeStorage) Ck.nodeStorage = new CAA(this.logger, this.config.managedIdentityId.id, LZA, Q);
    this.networkClient = this.config.system.networkClient, this.cryptoProvider = new rf;
    let B = {
      protocolMode: aH.AAD,
      knownAuthorities: [Rs1],
      cloudDiscoveryMetadata: "",
      authorityMetadata: ""
    };
    this.fakeAuthority = new kV(Rs1, this.networkClient, Ck.nodeStorage, B, this.logger, this.cryptoProvider.createNewGuid(), void 0, !0), this.fakeClientCredentialClient = new zAA({
      authOptions: {
        clientId: this.config.managedIdentityId.id,
        authority: this.fakeAuthority
      }
    }), this.managedIdentityClient = new of(this.logger, Ck.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new HAA
  }
  async acquireToken(A) {
    if (!A.resource) throw hG(OZA.urlEmptyError);
    let Q = {
      forceRefresh: A.forceRefresh,
      resource: A.resource.replace("/.default", ""),
      scopes: [A.resource.replace("/.default", "")],
      authority: this.fakeAuthority.canonicalAuthority,
      correlationId: this.cryptoProvider.createNewGuid(),
      claims: A.claims,
      clientCapabilities: this.config.clientCapabilities
    };
    if (Q.forceRefresh) return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority);
    let [B, G] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(Q, this.config, this.cryptoProvider, this.fakeAuthority, Ck.nodeStorage);
    if (Q.claims) {
      let Z = this.managedIdentityClient.getManagedIdentitySource();
      if (B && $e6.includes(Z)) {
        let I = this.hashUtils.sha256(B.accessToken).toString(MD.HEX);
        Q.revokedTokenSha256Hash = I
      }
      return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority)
    }
    if (B) {
      if (G === FZ.PROACTIVELY_REFRESHED) {
        this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.");
        let Z = !0;
        await this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority, Z)
      }
      return B
    } else return this.acquireTokenFromManagedIdentity(Q, this.config.managedIdentityId, this.fakeAuthority)
  }
  async acquireTokenFromManagedIdentity(A, Q, B, G) {
    return this.managedIdentityClient.sendManagedIdentityTokenRequest(A, Q, B, G)
  }
  getManagedIdentitySource() {
    return of.sourceName || this.managedIdentityClient.getManagedIdentitySource()
  }
}
// @from(Start 8252484, End 8252487)
$e6
// @from(Start 8252493, End 8252660)
XtB = L(() => {
  p7();
  ks1();
  pZA();
  $NA();
  f11();
  WtB();
  N11();
  UI();
  w11(); /*! @azure/msal-node v3.8.1 2025-10-29 */
  $e6 = [S4.SERVICE_FABRIC]
})
// @from(Start 8252662, End 8253303)
class Cr1 {
  constructor(A, Q) {
    this.client = A, this.partitionManager = Q
  }
  async beforeCacheAccess(A) {
    let Q = await this.partitionManager.getKey(),
      B = await this.client.get(Q);
    A.tokenCache.deserialize(B)
  }
  async afterCacheAccess(A) {
    if (A.cacheHasChanged) {
      let Q = A.tokenCache.getKVStore(),
        B = Object.values(Q).filter((Z) => cX.isAccountEntity(Z)),
        G;
      if (B.length > 0) {
        let Z = B[0];
        G = await this.partitionManager.extractKey(Z)
      } else G = await this.partitionManager.getKey();
      await this.client.set(G, A.tokenCache.serialize())
    }
  }
}
// @from(Start 8253308, End 8253376)
VtB = L(() => {
  p7(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8253382, End 8253389)
Vq = {}
// @from(Start 8254560, End 8254762)
g11 = L(() => {
  saB();
  doB();
  coB();
  b11();
  f11();
  Vr1();
  Fr1();
  XtB();
  Wr1();
  x11();
  ms1();
  VtB();
  UI();
  $NA();
  p7();
  pZA(); /*! @azure/msal-node v3.8.1 2025-10-29 */
})
// @from(Start 8254768, End 8254794)
FtB = L(() => {
  g11()
})
// @from(Start 8254797, End 8255157)
function lZA(A, Q, B) {
  let G = (Z) => {
    return _NA.getToken.info(Z), new Pf({
      scopes: Array.isArray(A) ? A : [A],
      getTokenOptions: B,
      message: Z
    })
  };
  if (!Q) throw G("No response");
  if (!Q.expiresOn) throw G('Response had no "expiresOn" property.');
  if (!Q.accessToken) throw G('Response had no "accessToken" property.')
}
// @from(Start 8255159, End 8255344)
function Er1(A) {
  let Q = A === null || A === void 0 ? void 0 : A.authorityHost;
  if (!Q && owA) Q = process.env.AZURE_AUTHORITY_HOST;
  return Q !== null && Q !== void 0 ? Q : uwA
}
// @from(Start 8255346, End 8255497)
function zr1(A, Q) {
  if (!Q) Q = uwA;
  if (new RegExp(`${A}/?$`).test(Q)) return Q;
  if (Q.endsWith("/")) return Q + A;
  else return `${Q}/${A}`
}
// @from(Start 8255499, End 8255578)
function KtB(A, Q, B) {
  if (A === "adfs" && Q || B) return [Q];
  return []
}
// @from(Start 8255580, End 8255867)
function m11(A) {
  switch (A) {
    case "error":
      return Vq.LogLevel.Error;
    case "info":
      return Vq.LogLevel.Info;
    case "verbose":
      return Vq.LogLevel.Verbose;
    case "warning":
      return Vq.LogLevel.Warning;
    default:
      return Vq.LogLevel.Info
  }
}
// @from(Start 8255869, End 8256942)
function RAA(A, Q, B) {
  if (Q.name === "AuthError" || Q.name === "ClientAuthError" || Q.name === "BrowserAuthError") {
    let G = Q;
    switch (G.errorCode) {
      case "endpoints_resolution_error":
        return _NA.info(d7(A, Q.message)), new p9(Q.message);
      case "device_code_polling_cancelled":
        return new HZA("The authentication has been aborted by the caller.");
      case "consent_required":
      case "interaction_required":
      case "login_required":
        _NA.info(d7(A, `Authentication returned errorCode ${G.errorCode}`));
        break;
      default:
        _NA.info(d7(A, `Failed to acquire token: ${Q.message}`));
        break
    }
  }
  if (Q.name === "ClientConfigurationError" || Q.name === "BrowserConfigurationAuthError" || Q.name === "AbortError" || Q.name === "AuthenticationError") return Q;
  if (Q.name === "NativeAuthError") return _NA.info(d7(A, `Error from the native broker: ${Q.message} with status code: ${Q.statusCode}`)), Q;
  return new Pf({
    scopes: A,
    getTokenOptions: B,
    message: Q.message
  })
}
// @from(Start 8256944, End 8257132)
function DtB(A) {
  return {
    localAccountId: A.homeAccountId,
    environment: A.authority,
    username: A.username,
    homeAccountId: A.homeAccountId,
    tenantId: A.tenantId
  }
}
// @from(Start 8257134, End 8257380)
function HtB(A, Q) {
  var B;
  return {
    authority: (B = Q.environment) !== null && B !== void 0 ? B : xpB,
    homeAccountId: Q.homeAccountId,
    tenantId: Q.tenantId || ypB,
    username: Q.username,
    clientId: A,
    version: we6
  }
}
// @from(Start 8257385, End 8257388)
_NA
// @from(Start 8257390, End 8257401)
we6 = "1.0"
// @from(Start 8257405, End 8257889)
u11 = (A, Q = XA1 ? "Node" : "Browser") => (B, G, Z) => {
    if (Z) return;
    switch (B) {
      case Vq.LogLevel.Error:
        A.info(`MSAL ${Q} V2 error: ${G}`);
        return;
      case Vq.LogLevel.Info:
        A.info(`MSAL ${Q} V2 info message: ${G}`);
        return;
      case Vq.LogLevel.Verbose:
        A.info(`MSAL ${Q} V2 verbose message: ${G}`);
        return;
      case Vq.LogLevel.Warning:
        A.info(`MSAL ${Q} V2 warning: ${G}`);
        return
    }
  }
// @from(Start 8257895, End 8257992)
Ur1 = L(() => {
  DE();
  jW();
  IZA();
  tp();
  mn1();
  FtB();
  _NA = W7("IdentityUtils")
})
// @from(Start 8257995, End 8258387)
function CtB(A) {
  return sn1([{
    name: "imdsRetryPolicy",
    retry: ({
      retryCount: Q,
      response: B
    }) => {
      if ((B === null || B === void 0 ? void 0 : B.status) !== 404) return {
        skipStrategy: !0
      };
      return siB(Q, {
        retryDelayInMs: A.startDelayInMs,
        maxRetryDelayInMs: qe6
      })
    }
  }], {
    maxRetries: A.maxRetries
  })
}
// @from(Start 8258392, End 8258403)
qe6 = 64000
// @from(Start 8258409, End 8258442)
EtB = L(() => {
  _f();
  tp()
})
// @from(Start 8258445, End 8258778)
function Me6(A) {
  var Q;
  if (!ZqA(A)) throw Error(`${tf}: Multiple scopes are not supported.`);
  let G = new URL(Le6, (Q = process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) !== null && Q !== void 0 ? Q : Ne6),
    Z = {
      Accept: "application/json"
    };
  return {
    url: `${G}`,
    method: "GET",
    headers: Me(Z)
  }
}
// @from(Start 8258783, End 8258822)
tf = "ManagedIdentityCredential - IMDS"
// @from(Start 8258826, End 8258829)
TAA
// @from(Start 8258831, End 8258861)
Ne6 = "http://169.254.169.254"
// @from(Start 8258865, End 8258904)
Le6 = "/metadata/identity/oauth2/token"
// @from(Start 8258908, End 8258911)
$r1
// @from(Start 8258917, End 8260376)
ztB = L(() => {
  _f();
  tp();
  jW();
  Yq();
  TAA = W7(tf);
  $r1 = {
    name: "imdsMsi",
    async isAvailable(A) {
      let {
        scopes: Q,
        identityClient: B,
        getTokenOptions: G
      } = A, Z = ZqA(Q);
      if (!Z) return TAA.info(`${tf}: Unavailable. Multiple scopes are not supported.`), !1;
      if (process.env.AZURE_POD_IDENTITY_AUTHORITY_HOST) return !0;
      if (!B) throw Error("Missing IdentityClient");
      let I = Me6(Z);
      return YY.withSpan("ManagedIdentityCredential-pingImdsEndpoint", G !== null && G !== void 0 ? G : {}, async (Y) => {
        var J, W;
        I.tracingOptions = Y.tracingOptions;
        let X = hT(I);
        X.timeout = ((J = Y.requestOptions) === null || J === void 0 ? void 0 : J.timeout) || 1000, X.allowInsecureConnection = !0;
        let V;
        try {
          TAA.info(`${tf}: Pinging the Azure IMDS endpoint`), V = await B.sendRequest(X)
        } catch (F) {
          if (WA1(F)) TAA.verbose(`${tf}: Caught error ${F.name}: ${F.message}`);
          return TAA.info(`${tf}: The Azure IMDS endpoint is unavailable`), !1
        }
        if (V.status === 403) {
          if ((W = V.bodyAsText) === null || W === void 0 ? void 0 : W.includes("unreachable")) return TAA.info(`${tf}: The Azure IMDS endpoint is unavailable`), TAA.info(`${tf}: ${V.bodyAsText}`), !1
        }
        return TAA.info(`${tf}: The Azure IMDS endpoint is available`), !0
      })
    }
  }
})
// @from(Start 8260379, End 8260718)
function d11(A) {
  var Q, B;
  let G = A;
  if (G === void 0 && ((B = (Q = globalThis.process) === null || Q === void 0 ? void 0 : Q.env) === null || B === void 0 ? void 0 : B.AZURE_REGIONAL_AUTHORITY_NAME) !== void 0) G = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
  if (G === wr1.AutoDiscoverRegion) return "AUTO_DISCOVER";
  return G
}
// @from(Start 8260723, End 8260726)
wr1
// @from(Start 8260732, End 8262533)
UtB = L(() => {
  (function(A) {
    A.AutoDiscoverRegion = "AutoDiscoverRegion", A.USWest = "westus", A.USWest2 = "westus2", A.USCentral = "centralus", A.USEast = "eastus", A.USEast2 = "eastus2", A.USNorthCentral = "northcentralus", A.USSouthCentral = "southcentralus", A.USWestCentral = "westcentralus", A.CanadaCentral = "canadacentral", A.CanadaEast = "canadaeast", A.BrazilSouth = "brazilsouth", A.EuropeNorth = "northeurope", A.EuropeWest = "westeurope", A.UKSouth = "uksouth", A.UKWest = "ukwest", A.FranceCentral = "francecentral", A.FranceSouth = "francesouth", A.SwitzerlandNorth = "switzerlandnorth", A.SwitzerlandWest = "switzerlandwest", A.GermanyNorth = "germanynorth", A.GermanyWestCentral = "germanywestcentral", A.NorwayWest = "norwaywest", A.NorwayEast = "norwayeast", A.AsiaEast = "eastasia", A.AsiaSouthEast = "southeastasia", A.JapanEast = "japaneast", A.JapanWest = "japanwest", A.AustraliaEast = "australiaeast", A.AustraliaSouthEast = "australiasoutheast", A.AustraliaCentral = "australiacentral", A.AustraliaCentral2 = "australiacentral2", A.IndiaCentral = "centralindia", A.IndiaSouth = "southindia", A.IndiaWest = "westindia", A.KoreaSouth = "koreasouth", A.KoreaCentral = "koreacentral", A.UAECentral = "uaecentral", A.UAENorth = "uaenorth", A.SouthAfricaNorth = "southafricanorth", A.SouthAfricaWest = "southafricawest", A.ChinaNorth = "chinanorth", A.ChinaEast = "chinaeast", A.ChinaNorth2 = "chinanorth2", A.ChinaEast2 = "chinaeast2", A.GermanyCentral = "germanycentral", A.GermanyNorthEast = "germanynortheast", A.GovernmentUSVirginia = "usgovvirginia", A.GovernmentUSIowa = "usgoviowa", A.GovernmentUSArizona = "usgovarizona", A.GovernmentUSTexas = "usgovtexas", A.GovernmentUSDodEast = "usdodeast", A.GovernmentUSDodCentral = "usdodcentral"
  })(wr1 || (wr1 = {}))
})
// @from(Start 8262563, End 8262662)
function Oe6() {
  try {
    return $tB.statSync("/.dockerenv"), !0
  } catch {
    return !1
  }
}
// @from(Start 8262664, End 8262796)
function Re6() {
  try {
    return $tB.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
  } catch {
    return !1
  }
}
// @from(Start 8262798, End 8262873)
function Nr1() {
  if (qr1 === void 0) qr1 = Oe6() || Re6();
  return qr1
}
// @from(Start 8262878, End 8262881)
qr1
// @from(Start 8262887, End 8262901)
wtB = () => {}
// @from(Start 8262931, End 8263006)
function iZA() {
  if (Lr1 === void 0) Lr1 = Pe6() || Nr1();
  return Lr1
}
// @from(Start 8263011, End 8263014)
Lr1
// @from(Start 8263016, End 8263119)
Pe6 = () => {
  try {
    return Te6.statSync("/run/.containerenv"), !0
  } catch {
    return !1
  }
}
// @from(Start 8263125, End 8263151)
Mr1 = L(() => {
  wtB()
})
// @from(Start 8263243, End 8263567)
qtB = () => {
    if (NtB.platform !== "linux") return !1;
    if (je6.release().toLowerCase().includes("microsoft")) {
      if (iZA()) return !1;
      return !0
    }
    try {
      return Se6.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !iZA() : !1
    } catch {
      return !1
    }
  }
// @from(Start 8263571, End 8263573)
Nl
// @from(Start 8263579, End 8263651)
Or1 = L(() => {
  Mr1();
  Nl = NtB.env.__IS_WSL_TEST__ ? qtB : qtB()
})
// @from(Start 8263749, End 8263752)
ke6
// @from(Start 8263754, End 8263857)
ye6 = async () => {
  return `${await ke6()}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`
}
// @from(Start 8263859, End 8264028)
Rr1 = async () => {
  if (Nl) return ye6();
  return `${LtB.env.SYSTEMROOT||LtB.env.windir||String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
}
// @from(Start 8264034, End 8264566)
OtB = L(() => {
  Or1();
  Or1();
  ke6 = (() => {
    let Q;
    return async function() {
      if (Q) return Q;
      let B = "/etc/wsl.conf",
        G = !1;
      try {
        await MtB.access(B, _e6.F_OK), G = !0
      } catch {}
      if (!G) return "/mnt/";
      let Z = await MtB.readFile(B, {
          encoding: "utf8"
        }),
        I = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(Z);
      if (!I) return "/mnt/";
      return Q = I.groups.mountPoint.trim(), Q = Q.endsWith("/") ? Q : `${Q}/`, Q
    }
  })()
})
// @from(Start 8264569, End 8264875)
function Ll(A, Q, B) {
  let G = (Z) => Object.defineProperty(A, Q, {
    value: Z,
    enumerable: !0,
    writable: !0
  });
  return Object.defineProperty(A, Q, {
    configurable: !0,
    enumerable: !0,
    get() {
      let Z = B();
      return G(Z), Z
    },
    set(Z) {
      G(Z)
    }
  }), A
}
// @from(Start 8265012, End 8265364)
async function Tr1() {
  if (ve6.platform !== "darwin") throw Error("macOS only");
  let {
    stdout: A
  } = await fe6("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  return /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(A)?.groups.id ?? "com.apple.Safari"
}
// @from(Start 8265369, End 8265372)
fe6
// @from(Start 8265378, End 8265413)
RtB = L(() => {
  fe6 = xe6(be6)
})
// @from(Start 8265574, End 8265862)
async function TtB(A, {
  humanReadableOutput: Q = !0,
  signal: B
} = {}) {
  if (he6.platform !== "darwin") throw Error("macOS only");
  let G = Q ? [] : ["-ss"],
    Z = {};
  if (B) Z.signal = B;
  let {
    stdout: I
  } = await me6("osascript", ["-e", A, G], Z);
  return I.trim()
}
// @from(Start 8265867, End 8265870)
me6
// @from(Start 8265876, End 8265911)
PtB = L(() => {
  me6 = ge6(ue6)
})
// @from(Start 8265913, End 8266177)
async function Pr1(A) {
  return TtB(`tell application "Finder" to set app_path to application file id "${A}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`)
}
// @from(Start 8266182, End 8266208)
jtB = L(() => {
  PtB()
})
// @from(Start 8266314, End 8266766)
async function Sr1(A = pe6) {
  let {
    stdout: Q
  } = await A("reg", ["QUERY", " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice", "/v", "ProgId"]), B = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(Q);
  if (!B) throw new jr1(`Cannot find Windows browser in stdout: ${JSON.stringify(Q)}`);
  let {
    id: G
  } = B.groups, Z = le6[G];
  if (!Z) throw new jr1(`Unknown browser ID: ${G}`);
  return Z
}
// @from(Start 8266771, End 8266774)
pe6
// @from(Start 8266776, End 8266779)
le6
// @from(Start 8266781, End 8266784)
jr1
// @from(Start 8266790, End 8267627)
StB = L(() => {
  pe6 = de6(ce6), le6 = {
    AppXq0fevzme2pys62n3e0fbqa7peapykr8v: {
      name: "Edge",
      id: "com.microsoft.edge.old"
    },
    MSEdgeDHTML: {
      name: "Edge",
      id: "com.microsoft.edge"
    },
    MSEdgeHTM: {
      name: "Edge",
      id: "com.microsoft.edge"
    },
    "IE.HTTP": {
      name: "Internet Explorer",
      id: "com.microsoft.ie"
    },
    FirefoxURL: {
      name: "Firefox",
      id: "org.mozilla.firefox"
    },
    ChromeHTML: {
      name: "Chrome",
      id: "com.google.chrome"
    },
    BraveHTML: {
      name: "Brave",
      id: "com.brave.Browser"
    },
    BraveBHTML: {
      name: "Brave Beta",
      id: "com.brave.Browser.beta"
    },
    BraveSSHTM: {
      name: "Brave Nightly",
      id: "com.brave.Browser.nightly"
    }
  };
  jr1 = class jr1 extends Error {}
})
// @from(Start 8267765, End 8268268)
async function kr1() {
  if (_r1.platform === "darwin") {
    let A = await Tr1();
    return {
      name: await Pr1(A),
      id: A
    }
  }
  if (_r1.platform === "linux") {
    let {
      stdout: A
    } = await ae6("xdg-mime", ["query", "default", "x-scheme-handler/http"]), Q = A.trim();
    return {
      name: se6(Q.replace(/.desktop$/, "").replace("-", " ")),
      id: Q
    }
  }
  if (_r1.platform === "win32") return Sr1();
  throw Error("Only macOS, Linux, and Windows are supported")
}
// @from(Start 8268273, End 8268276)
ae6
// @from(Start 8268278, End 8268358)
se6 = (A) => A.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (Q) => Q.toUpperCase())
// @from(Start 8268364, End 8268426)
_tB = L(() => {
  RtB();
  jtB();
  StB();
  ae6 = ie6(ne6)
})
// @from(Start 8268432, End 8268440)
gtB = {}
// @from(Start 8268822, End 8269453)
async function QA5() {
  let A = await Rr1(),
    Q = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`,
    B = btB.from(Q, "utf16le").toString("base64"),
    {
      stdout: G
    } = await AA5(A, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", B], {
      encoding: "utf8"
    }),
    Z = G.trim(),
    I = {
      ChromeHTML: "com.google.chrome",
      BraveHTML: "com.brave.Browser",
      MSEdgeHTM: "com.microsoft.edge",
      FirefoxURL: "org.mozilla.firefox"
    };
  return I[Z] ? {
    id: I[Z]
  } : {}
}
// @from(Start 8269455, End 8269624)
function vtB(A) {
  if (typeof A === "string" || Array.isArray(A)) return A;
  let {
    [ytB]: Q
  } = A;
  if (!Q) throw Error(`${ytB} is not supported`);
  return Q
}
// @from(Start 8269626, End 8269768)
function c11({
  [nZA]: A
}, {
  wsl: Q
}) {
  if (Q && Nl) return vtB(Q);
  if (!A) throw Error(`${nZA} is not supported`);
  return vtB(A)
}
// @from(Start 8269773, End 8269776)
AA5
// @from(Start 8269778, End 8269781)
xr1
// @from(Start 8269783, End 8269786)
ktB
// @from(Start 8269788, End 8269791)
nZA
// @from(Start 8269793, End 8269796)
ytB
// @from(Start 8269798, End 8269919)
xtB = async (A, Q) => {
  let B;
  for (let G of A) try {
    return await Q(G)
  } catch (Z) {
    B = Z
  }
  throw B
}
// @from(Start 8269921, End 8272744)
kNA = async (A) => {
  if (A = {
      wait: !1,
      background: !1,
      newInstance: !1,
      allowNonzeroExitCode: !1,
      ...A
    }, Array.isArray(A.app)) return xtB(A.app, (J) => kNA({
    ...A,
    app: J
  }));
  let {
    name: Q,
    arguments: B = []
  } = A.app ?? {};
  if (B = [...B], Array.isArray(Q)) return xtB(Q, (J) => kNA({
    ...A,
    app: {
      name: J,
      arguments: B
    }
  }));
  if (Q === "browser" || Q === "browserPrivate") {
    let J = {
        "com.google.chrome": "chrome",
        "google-chrome.desktop": "chrome",
        "com.brave.Browser": "brave",
        "org.mozilla.firefox": "firefox",
        "firefox.desktop": "firefox",
        "com.microsoft.msedge": "edge",
        "com.microsoft.edge": "edge",
        "com.microsoft.edgemac": "edge",
        "microsoft-edge.desktop": "edge"
      },
      W = {
        chrome: "--incognito",
        brave: "--incognito",
        firefox: "--private-window",
        edge: "--inPrivate"
      },
      X = Nl ? await QA5() : await kr1();
    if (X.id in J) {
      let V = J[X.id];
      if (Q === "browserPrivate") B.push(W[V]);
      return kNA({
        ...A,
        app: {
          name: Ml[V],
          arguments: B
        }
      })
    }
    throw Error(`${X.name} is not supported as a default browser`)
  }
  let G, Z = [],
    I = {};
  if (nZA === "darwin") {
    if (G = "open", A.wait) Z.push("--wait-apps");
    if (A.background) Z.push("--background");
    if (A.newInstance) Z.push("--new");
    if (Q) Z.push("-a", Q)
  } else if (nZA === "win32" || Nl && !iZA() && !Q) {
    if (G = await Rr1(), Z.push("-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand"), !Nl) I.windowsVerbatimArguments = !0;
    let J = ["Start"];
    if (A.wait) J.push("-Wait");
    if (Q) {
      if (J.push(`"\`"${Q}\`""`), A.target) B.push(A.target)
    } else if (A.target) J.push(`"${A.target}"`);
    if (B.length > 0) B = B.map((W) => `"\`"${W}\`""`), J.push("-ArgumentList", B.join(","));
    A.target = btB.from(J.join(" "), "utf16le").toString("base64")
  } else {
    if (Q) G = Q;
    else {
      let J = !xr1 || xr1 === "/",
        W = !1;
      try {
        await te6.access(ktB, ee6.X_OK), W = !0
      } catch {}
      G = yr1.versions.electron ?? (nZA === "android" || J || !W) ? "xdg-open" : ktB
    }
    if (B.length > 0) Z.push(...B);
    if (!A.wait) I.stdio = "ignore", I.detached = !0
  }
  if (nZA === "darwin" && B.length > 0) Z.push("--args", ...B);
  if (A.target) Z.push(A.target);
  let Y = htB.spawn(G, Z, I);
  if (A.wait) return new Promise((J, W) => {
    Y.once("error", W), Y.once("close", (X) => {
      if (!A.allowNonzeroExitCode && X > 0) {
        W(Error(`Exited with code ${X}`));
        return
      }
      J(Y)
    })
  });
  return Y.unref(), Y
}
// @from(Start 8272746, End 8272878)
BA5 = (A, Q) => {
  if (typeof A !== "string") throw TypeError("Expected a `target`");
  return kNA({
    ...Q,
    target: A
  })
}
// @from(Start 8272880, End 8273232)
GA5 = (A, Q) => {
  if (typeof A !== "string" && !Array.isArray(A)) throw TypeError("Expected a valid `name`");
  let {
    arguments: B = []
  } = Q ?? {};
  if (B !== void 0 && B !== null && !Array.isArray(B)) throw TypeError("Expected `appArguments` as Array type");
  return kNA({
    ...Q,
    app: {
      name: A,
      arguments: B
    }
  })
}
// @from(Start 8273234, End 8273236)
Ml
// @from(Start 8273238, End 8273241)
ZA5
// @from(Start 8273247, End 8274795)
utB = L(() => {
  OtB();
  _tB();
  Mr1();
  AA5 = oe6(htB.execFile), xr1 = ftB.dirname(re6(import.meta.url)), ktB = ftB.join(xr1, "xdg-open"), {
    platform: nZA,
    arch: ytB
  } = yr1;
  Ml = {};
  Ll(Ml, "chrome", () => c11({
    darwin: "google chrome",
    win32: "chrome",
    linux: ["google-chrome", "google-chrome-stable", "chromium"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
    }
  }));
  Ll(Ml, "brave", () => c11({
    darwin: "brave browser",
    win32: "brave",
    linux: ["brave-browser", "brave"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe",
      x64: ["/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe", "/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe"]
    }
  }));
  Ll(Ml, "firefox", () => c11({
    darwin: "firefox",
    win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
    linux: "firefox"
  }, {
    wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
  }));
  Ll(Ml, "edge", () => c11({
    darwin: "microsoft edge",
    win32: "msedge",
    linux: ["microsoft-edge", "microsoft-edge-dev"]
  }, {
    wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  }));
  Ll(Ml, "browser", () => "browser");
  Ll(Ml, "browserPrivate", () => "browserPrivate");
  ZA5 = BA5
})
// @from(Start 8274798, End 8275521)
function IA5(A, Q, B = {}) {
  var G, Z, I;
  let Y = ZlB((G = B.logger) !== null && G !== void 0 ? G : SU, Q, A),
    J = zr1(Y, Er1(B)),
    W = new UZA(Object.assign(Object.assign({}, B.tokenCredentialOptions), {
      authorityHost: J,
      loggingOptions: B.loggingOptions
    }));
  return {
    auth: {
      clientId: A,
      authority: J,
      knownAuthorities: KtB(Y, J, B.disableInstanceDiscovery)
    },
    system: {
      networkClient: W,
      loggerOptions: {
        loggerCallback: u11((Z = B.logger) !== null && Z !== void 0 ? Z : SU),
        logLevel: m11(deA()),
        piiLoggingEnabled: (I = B.loggingOptions) === null || I === void 0 ? void 0 : I.enableUnsafeSupportLogging
      }
    }
  }
}
// @from(Start 8275523, End 8287411)
function Ol(A, Q, B = {}) {
  var G;
  let Z = {
      msalConfig: IA5(A, Q, B),
      cachedAccount: B.authenticationRecord ? DtB(B.authenticationRecord) : null,
      pluginConfiguration: upB.generatePluginConfiguration(B),
      logger: (G = B.logger) !== null && G !== void 0 ? G : SU
    },
    I = new Map;
  async function Y(R = {}) {
    let T = R.enableCae ? "CAE" : "default",
      y = I.get(T);
    if (y) return Z.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), y;
    Z.logger.getToken.info(`Creating new PublicClientApplication with CAE ${R.enableCae?"enabled":"disabled"}.`);
    let v = R.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = R.enableCae ? ["cp1"] : void 0, y = new TNA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await v
      }
    })), I.set(T, y), y
  }
  let J = new Map;
  async function W(R = {}) {
    let T = R.enableCae ? "CAE" : "default",
      y = J.get(T);
    if (y) return Z.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), y;
    Z.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${R.enableCae?"enabled":"disabled"}.`);
    let v = R.enableCae ? Z.pluginConfiguration.cache.cachePluginCae : Z.pluginConfiguration.cache.cachePlugin;
    return Z.msalConfig.auth.clientCapabilities = R.enableCae ? ["cp1"] : void 0, y = new jNA(Object.assign(Object.assign({}, Z.msalConfig), {
      broker: {
        nativeBrokerPlugin: Z.pluginConfiguration.broker.nativeBrokerPlugin
      },
      cache: {
        cachePlugin: await v
      }
    })), J.set(T, y), y
  }
  async function X(R, T, y = {}) {
    if (Z.cachedAccount === null) throw Z.logger.getToken.info("No cached account found in local state."), new Pf({
      scopes: T
    });
    if (y.claims) Z.cachedClaims = y.claims;
    let v = {
      account: Z.cachedAccount,
      scopes: T,
      claims: Z.cachedClaims
    };
    if (Z.pluginConfiguration.broker.isEnabled) {
      if (v.tokenQueryParameters || (v.tokenQueryParameters = {}), Z.pluginConfiguration.broker.enableMsaPassthrough) v.tokenQueryParameters.msal_request_type = "consumer_passthrough"
    }
    if (y.proofOfPossessionOptions) v.shrNonce = y.proofOfPossessionOptions.nonce, v.authenticationScheme = "pop", v.resourceRequestMethod = y.proofOfPossessionOptions.resourceRequestMethod, v.resourceRequestUri = y.proofOfPossessionOptions.resourceRequestUrl;
    Z.logger.getToken.info("Attempting to acquire token silently");
    try {
      return await R.acquireTokenSilent(v)
    } catch (x) {
      throw RAA(T, x, y)
    }
  }

  function V(R) {
    if (R === null || R === void 0 ? void 0 : R.tenantId) return zr1(R.tenantId, Er1(B));
    return Z.msalConfig.auth.authority
  }
  async function F(R, T, y, v) {
    var x, p;
    let u = null;
    try {
      u = await X(R, T, y)
    } catch (e) {
      if (e.name !== "AuthenticationRequiredError") throw e;
      if (y.disableAutomaticAuthentication) throw new Pf({
        scopes: T,
        getTokenOptions: y,
        message: "Automatic authentication has been disabled. You may call the authentication() method."
      })
    }
    if (u === null) try {
      u = await v()
    } catch (e) {
      throw RAA(T, e, y)
    }
    return lZA(T, u, y), Z.cachedAccount = (x = u === null || u === void 0 ? void 0 : u.account) !== null && x !== void 0 ? x : null, Z.logger.getToken.info(mF(T)), {
      token: u.accessToken,
      expiresOnTimestamp: u.expiresOn.getTime(),
      refreshAfterTimestamp: (p = u.refreshOn) === null || p === void 0 ? void 0 : p.getTime(),
      tokenType: u.tokenType
    }
  }
  async function K(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client secret"), Z.msalConfig.auth.clientSecret = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function D(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client assertion"), Z.msalConfig.auth.clientAssertion = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims,
        clientAssertion: T
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function H(R, T, y = {}) {
    var v;
    Z.logger.getToken.info("Attempting to acquire token using client certificate"), Z.msalConfig.auth.clientCertificate = T;
    let x = await W(y);
    try {
      let p = await x.acquireTokenByClientCredential({
        scopes: R,
        authority: V(y),
        azureRegion: d11(),
        claims: y === null || y === void 0 ? void 0 : y.claims
      });
      return lZA(R, p, y), Z.logger.getToken.info(mF(R)), {
        token: p.accessToken,
        expiresOnTimestamp: p.expiresOn.getTime(),
        refreshAfterTimestamp: (v = p.refreshOn) === null || v === void 0 ? void 0 : v.getTime(),
        tokenType: p.tokenType
      }
    } catch (p) {
      throw RAA(R, p, y)
    }
  }
  async function C(R, T, y = {}) {
    Z.logger.getToken.info("Attempting to acquire token using device code");
    let v = await Y(y);
    return F(v, R, y, () => {
      var x, p;
      let u = {
          scopes: R,
          cancel: (p = (x = y === null || y === void 0 ? void 0 : y.abortSignal) === null || x === void 0 ? void 0 : x.aborted) !== null && p !== void 0 ? p : !1,
          deviceCodeCallback: T,
          authority: V(y),
          claims: y === null || y === void 0 ? void 0 : y.claims
        },
        e = v.acquireTokenByDeviceCode(u);
      if (y.abortSignal) y.abortSignal.addEventListener("abort", () => {
        u.cancel = !0
      });
      return e
    })
  }
  async function E(R, T, y, v = {}) {
    Z.logger.getToken.info("Attempting to acquire token using username and password");
    let x = await Y(v);
    return F(x, R, v, () => {
      let p = {
        scopes: R,
        username: T,
        password: y,
        authority: V(v),
        claims: v === null || v === void 0 ? void 0 : v.claims
      };
      return x.acquireTokenByUsernamePassword(p)
    })
  }

  function U() {
    if (!Z.cachedAccount) return;
    return HtB(A, Z.cachedAccount)
  }
  async function q(R, T, y, v, x = {}) {
    Z.logger.getToken.info("Attempting to acquire token using authorization code");
    let p;
    if (v) Z.msalConfig.auth.clientSecret = v, p = await W(x);
    else p = await Y(x);
    return F(p, R, x, () => {
      return p.acquireTokenByCode({
        scopes: R,
        redirectUri: T,
        code: y,
        authority: V(x),
        claims: x === null || x === void 0 ? void 0 : x.claims
      })
    })
  }
  async function w(R, T, y, v = {}) {
    var x;
    if (SU.getToken.info("Attempting to acquire token on behalf of another user"), typeof y === "string") SU.getToken.info("Using client secret for on behalf of flow"), Z.msalConfig.auth.clientSecret = y;
    else if (typeof y === "function") SU.getToken.info("Using client assertion callback for on behalf of flow"), Z.msalConfig.auth.clientAssertion = y;
    else SU.getToken.info("Using client certificate for on behalf of flow"), Z.msalConfig.auth.clientCertificate = y;
    let p = await W(v);
    try {
      let u = await p.acquireTokenOnBehalfOf({
        scopes: R,
        authority: V(v),
        claims: v.claims,
        oboAssertion: T
      });
      return lZA(R, u, v), SU.getToken.info(mF(R)), {
        token: u.accessToken,
        expiresOnTimestamp: u.expiresOn.getTime(),
        refreshAfterTimestamp: (x = u.refreshOn) === null || x === void 0 ? void 0 : x.getTime(),
        tokenType: u.tokenType
      }
    } catch (u) {
      throw RAA(R, u, v)
    }
  }
  async function N(R, T = {}) {
    SU.getToken.info("Attempting to acquire token interactively");
    let y = await Y(T);
    async function v(p) {
      var u;
      SU.verbose("Authentication will resume through the broker");
      let e = x();
      if (Z.pluginConfiguration.broker.parentWindowHandle) e.windowHandle = Buffer.from(Z.pluginConfiguration.broker.parentWindowHandle);
      else SU.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
      if (Z.pluginConfiguration.broker.enableMsaPassthrough)((u = e.tokenQueryParameters) !== null && u !== void 0 ? u : e.tokenQueryParameters = {}).msal_request_type = "consumer_passthrough";
      if (p) e.prompt = "none", SU.verbose("Attempting broker authentication using the default broker account");
      else SU.verbose("Attempting broker authentication without the default broker account");
      if (T.proofOfPossessionOptions) e.shrNonce = T.proofOfPossessionOptions.nonce, e.authenticationScheme = "pop", e.resourceRequestMethod = T.proofOfPossessionOptions.resourceRequestMethod, e.resourceRequestUri = T.proofOfPossessionOptions.resourceRequestUrl;
      try {
        return await y.acquireTokenInteractive(e)
      } catch (l) {
        if (SU.verbose(`Failed to authenticate through the broker: ${l.message}`), p) return v(!1);
        else throw l
      }
    }

    function x() {
      var p, u;
      return {
        openBrowser: async (e) => {
          await (await Promise.resolve().then(() => (utB(), gtB))).default(e, {
            wait: !0,
            newInstance: !0
          })
        },
        scopes: R,
        authority: V(T),
        claims: T === null || T === void 0 ? void 0 : T.claims,
        loginHint: T === null || T === void 0 ? void 0 : T.loginHint,
        errorTemplate: (p = T === null || T === void 0 ? void 0 : T.browserCustomizationOptions) === null || p === void 0 ? void 0 : p.errorMessage,
        successTemplate: (u = T === null || T === void 0 ? void 0 : T.browserCustomizationOptions) === null || u === void 0 ? void 0 : u.successMessage,
        prompt: (T === null || T === void 0 ? void 0 : T.loginHint) ? "login" : "select_account"
      }
    }
    return F(y, R, T, async () => {
      var p;
      let u = x();
      if (Z.pluginConfiguration.broker.isEnabled) return v((p = Z.pluginConfiguration.broker.useDefaultBrokerAccount) !== null && p !== void 0 ? p : !1);
      if (T.proofOfPossessionOptions) u.shrNonce = T.proofOfPossessionOptions.nonce, u.authenticationScheme = "pop", u.resourceRequestMethod = T.proofOfPossessionOptions.resourceRequestMethod, u.resourceRequestUri = T.proofOfPossessionOptions.resourceRequestUrl;
      return y.acquireTokenInteractive(u)
    })
  }
  return {
    getActiveAccount: U,
    getTokenByClientSecret: K,
    getTokenByClientAssertion: D,
    getTokenByClientCertificate: H,
    getTokenByDeviceCode: C,
    getTokenByUsernamePassword: E,
    getTokenByAuthorizationCode: q,
    getTokenOnBehalfOf: w,
    getTokenByInteractiveRequest: N
  }
}
// @from(Start 8287416, End 8287418)
SU
// @from(Start 8287424, End 8287543)
yNA = L(() => {
  g11();
  jW();
  mpB();
  Ur1();
  DE();
  tn1();
  UtB();
  qe();
  vT();
  SU = W7("MsalClient")
})
// @from(Start 8287545, End 8288501)
class vr1 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new p9("ClientAssertionCredential: tenantId is a required parameter.");
    if (!Q) throw new p9("ClientAssertionCredential: clientId is a required parameter.");
    if (!B) throw new p9("ClientAssertionCredential: clientAssertion is a required parameter.");
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.options = G, this.getAssertion = B, this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: mtB,
      tokenCredentialOptions: this.options
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, mtB);
      let G = Array.isArray(A) ? A : [A];
      return this.msalClient.getTokenByClientAssertion(G, this.getAssertion, B)
    })
  }
}
// @from(Start 8288506, End 8288509)
mtB
// @from(Start 8288515, End 8288614)
dtB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  Yq();
  mtB = W7("ClientAssertionCredential")
})
// @from(Start 8288670, End 8291733)
class jAA {
  constructor(A) {
    this.azureFederatedTokenFileContent = void 0, this.cacheDate = void 0;
    let Q = ceA(JA5).assigned.join(", ");
    xNA.info(`Found the following environment variables: ${Q}`);
    let B = A !== null && A !== void 0 ? A : {},
      G = B.tenantId || process.env.AZURE_TENANT_ID,
      Z = B.clientId || process.env.AZURE_CLIENT_ID;
    if (this.federatedTokenFilePath = B.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, G) qU(xNA, G);
    if (!Z) throw new p9(`${PAA}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!G) throw new p9(`${PAA}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!this.federatedTokenFilePath) throw new p9(`${PAA}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    xNA.info(`Invoking ClientAssertionCredential with tenant ID: ${G}, clientId: ${B.clientId} and federated token path: [REDACTED]`), this.client = new vr1(G, Z, this.readFileContents.bind(this), A)
  }
  async getToken(A, Q) {
    if (!this.client) {
      let B = `${PAA}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
      throw xNA.info(B), new p9(B)
    }
    return xNA.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(A, Q)
  }
  async readFileContents() {
    if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000) this.azureFederatedTokenFileContent = void 0;
    if (!this.federatedTokenFilePath) throw new p9(`${PAA}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
    if (!this.azureFederatedTokenFileContent) {
      let Q = (await YA5(this.federatedTokenFilePath, "utf8")).trim();
      if (!Q) throw new p9(`${PAA}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
      else this.azureFederatedTokenFileContent = Q, this.cacheDate = Date.now()
    }
    return this.azureFederatedTokenFileContent
  }
}
// @from(Start 8291738, End 8291772)
PAA = "WorkloadIdentityCredential"
// @from(Start 8291776, End 8291779)
JA5
// @from(Start 8291781, End 8291784)
xNA
// @from(Start 8291790, End 8291933)
br1 = L(() => {
  jW();
  dtB();
  DE();
  vT();
  JA5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_FEDERATED_TOKEN_FILE"], xNA = W7(PAA)
})
// @from(Start 8291939, End 8291989)
ctB = "ManagedIdentityCredential - Token Exchange"
// @from(Start 8291993, End 8291996)
WA5
// @from(Start 8291998, End 8292001)
fr1
// @from(Start 8292007, End 8292852)
ptB = L(() => {
  br1();
  jW();
  WA5 = W7(ctB), fr1 = {
    name: "tokenExchangeMsi",
    async isAvailable(A) {
      let Q = process.env,
        B = Boolean((A || Q.AZURE_CLIENT_ID) && Q.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
      if (!B) WA5.info(`${ctB}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
      return B
    },
    async getToken(A, Q = {}) {
      let {
        scopes: B,
        clientId: G
      } = A, Z = {};
      return new jAA(Object.assign(Object.assign({
        clientId: G,
        tenantId: process.env.AZURE_TENANT_ID,
        tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE
      }, Z), {
        disableInstanceDiscovery: !0
      })).getToken(B, Q)
    }
  }
})
// @from(Start 8292854, End 8298735)
class aZA {
  constructor(A, Q) {
    var B, G;
    this.msiRetryConfig = {
      maxRetries: 5,
      startDelayInMs: 800,
      intervalIncrement: 2
    };
    let Z;
    if (typeof A === "string") this.clientId = A, Z = Q !== null && Q !== void 0 ? Q : {};
    else this.clientId = A === null || A === void 0 ? void 0 : A.clientId, Z = A !== null && A !== void 0 ? A : {};
    this.resourceId = Z === null || Z === void 0 ? void 0 : Z.resourceId, this.objectId = Z === null || Z === void 0 ? void 0 : Z.objectId;
    let I = [{
      key: "clientId",
      value: this.clientId
    }, {
      key: "resourceId",
      value: this.resourceId
    }, {
      key: "objectId",
      value: this.objectId
    }].filter((J) => J.value);
    if (I.length > 1) throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}`);
    if (Z.allowInsecureConnection = !0, ((B = Z.retryOptions) === null || B === void 0 ? void 0 : B.maxRetries) !== void 0) this.msiRetryConfig.maxRetries = Z.retryOptions.maxRetries;
    this.identityClient = new UZA(Object.assign(Object.assign({}, Z), {
      additionalPolicies: [{
        policy: CtB(this.msiRetryConfig),
        position: "perCall"
      }]
    })), this.managedIdentityApp = new Ck({
      managedIdentityIdParams: {
        userAssignedClientId: this.clientId,
        userAssignedResourceId: this.resourceId,
        userAssignedObjectId: this.objectId
      },
      system: {
        disableInternalRetries: !0,
        networkClient: this.identityClient,
        loggerOptions: {
          logLevel: m11(deA()),
          piiLoggingEnabled: (G = Z.loggingOptions) === null || G === void 0 ? void 0 : G.enableUnsafeSupportLogging,
          loggerCallback: u11(Fq)
        }
      }
    }), this.isAvailableIdentityClient = new UZA(Object.assign(Object.assign({}, Z), {
      retryOptions: {
        maxRetries: 0
      }
    }));
    let Y = this.managedIdentityApp.getManagedIdentitySource();
    if (Y === "CloudShell") {
      if (this.clientId || this.resourceId || this.objectId) throw Fq.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new p9("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.")
    }
    if (Y === "ServiceFabric") {
      if (this.clientId || this.resourceId || this.objectId) throw Fq.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({clientId:this.clientId,resourceId:this.resourceId,objectId:this.objectId})}.`), new p9(`ManagedIdentityCredential: ${WaB}`)
    }
    if (Fq.info(`Using ${Y} managed identity.`), I.length === 1) {
      let {
        key: J,
        value: W
      } = I[0];
      Fq.info(`${Y} with ${J}: ${W}`)
    }
  }
  async getToken(A, Q = {}) {
    Fq.getToken.info("Using the MSAL provider for Managed Identity.");
    let B = ZqA(A);
    if (!B) throw new p9(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(A)}`);
    return YY.withSpan("ManagedIdentityCredential.getToken", Q, async () => {
      var G;
      try {
        let Z = await fr1.isAvailable(this.clientId),
          I = this.managedIdentityApp.getManagedIdentitySource(),
          Y = I === "DefaultToImds" || I === "Imds";
        if (Fq.getToken.info(`MSAL Identity source: ${I}`), Z) {
          Fq.getToken.info("Using the token exchange managed identity.");
          let W = await fr1.getToken({
            scopes: A,
            clientId: this.clientId,
            identityClient: this.identityClient,
            retryConfig: this.msiRetryConfig,
            resourceId: this.resourceId
          });
          if (W === null) throw new p9("Attempted to use the token exchange managed identity, but received a null response.");
          return W
        } else if (Y) {
          if (Fq.getToken.info("Using the IMDS endpoint to probe for availability."), !await $r1.isAvailable({
              scopes: A,
              clientId: this.clientId,
              getTokenOptions: Q,
              identityClient: this.isAvailableIdentityClient,
              resourceId: this.resourceId
            })) throw new p9("Attempted to use the IMDS endpoint, but it is not available.")
        }
        Fq.getToken.info("Calling into MSAL for managed identity token.");
        let J = await this.managedIdentityApp.acquireToken({
          resource: B
        });
        return this.ensureValidMsalToken(A, J, Q), Fq.getToken.info(mF(A)), {
          expiresOnTimestamp: J.expiresOn.getTime(),
          token: J.accessToken,
          refreshAfterTimestamp: (G = J.refreshOn) === null || G === void 0 ? void 0 : G.getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (Fq.getToken.error(d7(A, Z)), Z.name === "AuthenticationRequiredError") throw Z;
        if (XA5(Z)) throw new p9(`ManagedIdentityCredential: Network unreachable. Message: ${Z.message}`, {
          cause: Z
        });
        throw new p9(`ManagedIdentityCredential: Authentication failed. Message ${Z.message}`, {
          cause: Z
        })
      }
    })
  }
  ensureValidMsalToken(A, Q, B) {
    let G = (Z) => {
      return Fq.getToken.info(Z), new Pf({
        scopes: Array.isArray(A) ? A : [A],
        getTokenOptions: B,
        message: Z
      })
    };
    if (!Q) throw G("No response.");
    if (!Q.expiresOn) throw G('Response had no "expiresOn" property.');
    if (!Q.accessToken) throw G('Response had no "accessToken" property.')
  }
}
// @from(Start 8298737, End 8298995)
function XA5(A) {
  if (A.errorCode === "network_error") return !0;
  if (A.code === "ENETUNREACH" || A.code === "EHOSTUNREACH") return !0;
  if (A.statusCode === 403 || A.code === 403) {
    if (A.message.includes("unreachable")) return !0
  }
  return !1
}
// @from(Start 8299000, End 8299002)
Fq
// @from(Start 8299008, End 8299151)
ltB = L(() => {
  qe();
  g11();
  tn1();
  DE();
  Ur1();
  EtB();
  jW();
  Yq();
  ztB();
  ptB();
  Fq = W7("ManagedIdentityCredential")
})
// @from(Start 8299154, End 8299209)
function p11(A) {
  return Array.isArray(A) ? A : [A]
}
// @from(Start 8299211, End 8299397)
function sZA(A, Q) {
  if (!A.match(/^[0-9a-zA-Z-_.:/]+$/)) {
    let B = Error("Invalid scope was specified by the user or calling client");
    throw Q.getToken.info(d7(A, B)), B
  }
}
// @from(Start 8299399, End 8299456)
function l11(A) {
  return A.replace(/\/.default$/, "")
}
// @from(Start 8299461, End 8299486)
rZA = L(() => {
  jW()
})
// @from(Start 8299489, End 8299790)
function hr1(A, Q) {
  if (!Q.match(/^[0-9a-zA-Z-._ ]+$/)) {
    let B = Error("Invalid subscription provided. You can locate your subscription by following the instructions listed here: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id.");
    throw A.info(d7("", B)), B
  }
}
// @from(Start 8299795, End 8299820)
itB = L(() => {
  jW()
})
// @from(Start 8299855, End 8302859)
class gr1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(yM, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    if (A === null || A === void 0 ? void 0 : A.subscription) hr1(yM, A === null || A === void 0 ? void 0 : A.subscription), this.subscription = A === null || A === void 0 ? void 0 : A.subscription;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) qU(yM, B);
    if (this.subscription) hr1(yM, this.subscription);
    let G = typeof A === "string" ? A : A[0];
    return yM.getToken.info(`Using the scope ${G}`), YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, I, Y, J;
      try {
        sZA(G, yM);
        let W = l11(G),
          X = await ntB.getAzureCliAccessToken(W, B, this.subscription, this.timeout),
          V = (Z = X.stderr) === null || Z === void 0 ? void 0 : Z.match("(.*)az login --scope(.*)"),
          F = ((I = X.stderr) === null || I === void 0 ? void 0 : I.match("(.*)az login(.*)")) && !V;
        if (((Y = X.stderr) === null || Y === void 0 ? void 0 : Y.match("az:(.*)not found")) || ((J = X.stderr) === null || J === void 0 ? void 0 : J.startsWith("'az' is not recognized"))) {
          let D = new p9("Azure CLI could not be found. Please visit https://aka.ms/azure-cli for installation instructions and then, once installed, authenticate to your Azure account using 'az login'.");
          throw yM.getToken.info(d7(A, D)), D
        }
        if (F) {
          let D = new p9("Please run 'az login' from a command prompt to authenticate before using this credential.");
          throw yM.getToken.info(d7(A, D)), D
        }
        try {
          let D = X.stdout,
            H = this.parseRawResponse(D);
          return yM.getToken.info(mF(A)), H
        } catch (D) {
          if (X.stderr) throw new p9(X.stderr);
          throw D
        }
      } catch (W) {
        let X = W.name === "CredentialUnavailableError" ? W : new p9(W.message || "Unknown error while trying to retrieve the access token");
        throw yM.getToken.info(d7(A, X)), X
      }
    })
  }
  parseRawResponse(A) {
    let Q = JSON.parse(A),
      B = Q.accessToken,
      G = Number.parseInt(Q.expires_on, 10) * 1000;
    if (!isNaN(G)) return yM.getToken.info("expires_on is available and is valid, using it"), {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    };
    if (G = new Date(Q.expiresOn).getTime(), isNaN(G)) throw new p9(`Unexpected response from Azure CLI when getting token. Expected "expiresOn" to be a RFC3339 date string. Got: "${Q.expiresOn}"`);
    return {
      token: B,
      expiresOnTimestamp: G,
      tokenType: "Bearer"
    }
  }
}
// @from(Start 8302864, End 8302866)
yM
// @from(Start 8302868, End 8302871)
ntB
// @from(Start 8302877, End 8303962)
atB = L(() => {
  vT();
  jW();
  rZA();
  DE();
  Yq();
  itB();
  yM = W7("AzureCliCredential"), ntB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) yM.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzureCliAccessToken(A, Q, B, G) {
      let Z = [],
        I = [];
      if (Q) Z = ["--tenant", Q];
      if (B) I = ["--subscription", `"${B}"`];
      return new Promise((Y, J) => {
        try {
          VA5.execFile("az", ["account", "get-access-token", "--output", "json", "--resource", A, ...Z, ...I], {
            cwd: ntB.getSafeWorkingDir(),
            shell: !0,
            timeout: G
          }, (W, X, V) => {
            Y({
              stdout: X,
              stderr: V,
              error: W
            })
          })
        } catch (W) {
          J(W)
        }
      })
    }
  }
})
// @from(Start 8303997, End 8306466)
class ur1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(ef, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getToken(A, Q = {}) {
    let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds);
    if (B) qU(ef, B);
    let G;
    if (typeof A === "string") G = [A];
    else G = A;
    return ef.getToken.info(`Using the scopes ${A}`), YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      var Z, I, Y, J;
      try {
        G.forEach((F) => {
          sZA(F, ef)
        });
        let W = await stB.getAzdAccessToken(G, B, this.timeout),
          X = ((Z = W.stderr) === null || Z === void 0 ? void 0 : Z.match("not logged in, run `azd login` to login")) || ((I = W.stderr) === null || I === void 0 ? void 0 : I.match("not logged in, run `azd auth login` to login"));
        if (((Y = W.stderr) === null || Y === void 0 ? void 0 : Y.match("azd:(.*)not found")) || ((J = W.stderr) === null || J === void 0 ? void 0 : J.startsWith("'azd' is not recognized")) || W.error && W.error.code === "ENOENT") {
          let F = new p9("Azure Developer CLI couldn't be found. To mitigate this issue, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw ef.getToken.info(d7(A, F)), F
        }
        if (X) {
          let F = new p9("Please run 'azd auth login' from a command prompt to authenticate before using this credential. For more information, see the troubleshooting guidelines at https://aka.ms/azsdk/js/identity/azdevclicredential/troubleshoot.");
          throw ef.getToken.info(d7(A, F)), F
        }
        try {
          let F = JSON.parse(W.stdout);
          return ef.getToken.info(mF(A)), {
            token: F.token,
            expiresOnTimestamp: new Date(F.expiresOn).getTime(),
            tokenType: "Bearer"
          }
        } catch (F) {
          if (W.stderr) throw new p9(W.stderr);
          throw F
        }
      } catch (W) {
        let X = W.name === "CredentialUnavailableError" ? W : new p9(W.message || "Unknown error while trying to retrieve the access token");
        throw ef.getToken.info(d7(A, X)), X
      }
    })
  }
}
// @from(Start 8306471, End 8306473)
ef
// @from(Start 8306475, End 8306478)
stB
// @from(Start 8306484, End 8307503)
rtB = L(() => {
  jW();
  DE();
  vT();
  Yq();
  rZA();
  ef = W7("AzureDeveloperCliCredential"), stB = {
    getSafeWorkingDir() {
      if (process.platform === "win32") {
        let A = process.env.SystemRoot || process.env.SYSTEMROOT;
        if (!A) ef.getToken.warning("The SystemRoot environment variable is not set. This may cause issues when using the Azure Developer CLI credential."), A = "C:\\Windows";
        return A
      } else return "/bin"
    },
    async getAzdAccessToken(A, Q, B) {
      let G = [];
      if (Q) G = ["--tenant-id", Q];
      return new Promise((Z, I) => {
        try {
          FA5.execFile("azd", ["auth", "token", "--output", "json", ...A.reduce((Y, J) => Y.concat("--scope", J), []), ...G], {
            cwd: stB.getSafeWorkingDir(),
            timeout: B
          }, (Y, J, W) => {
            Z({
              stdout: J,
              stderr: W,
              error: Y
            })
          })
        } catch (Y) {
          I(Y)
        }
      })
    }
  }
})
// @from(Start 8307547, End 8307550)
ttB
// @from(Start 8307556, End 8307899)
etB = L(() => {
  ttB = {
    execFile(A, Q, B) {
      return new Promise((G, Z) => {
        otB.execFile(A, Q, B, (I, Y, J) => {
          if (Buffer.isBuffer(Y)) Y = Y.toString("utf8");
          if (Buffer.isBuffer(J)) J = J.toString("utf8");
          if (J || I) Z(J ? Error(J) : I);
          else G(Y)
        })
      })
    }
  }
})
// @from(Start 8307902, End 8307967)
function BeB(A) {
  if (QeB) return `${A}.exe`;
  else return A
}
// @from(Start 8307968, End 8308163)
async function AeB(A, Q) {
  let B = [];
  for (let G of A) {
    let [Z, ...I] = G, Y = await ttB.execFile(Z, I, {
      encoding: "utf8",
      timeout: Q
    });
    B.push(Y)
  }
  return B
}
// @from(Start 8308164, End 8310948)
class cr1 {
  constructor(A) {
    if (A === null || A === void 0 ? void 0 : A.tenantId) qU(Ah, A === null || A === void 0 ? void 0 : A.tenantId), this.tenantId = A === null || A === void 0 ? void 0 : A.tenantId;
    this.additionallyAllowedTenantIds = NU(A === null || A === void 0 ? void 0 : A.additionallyAllowedTenants), this.timeout = A === null || A === void 0 ? void 0 : A.processTimeoutInMs
  }
  async getAzurePowerShellAccessToken(A, Q, B) {
    for (let G of [...dr1]) {
      try {
        await AeB([
          [G, "/?"]
        ], B)
      } catch (Y) {
        dr1.shift();
        continue
      }
      let I = (await AeB([
        [G, "-NoProfile", "-NonInteractive", "-Command", `
          $tenantId = "${Q!==null&&Q!==void 0?Q:""}"
          $m = Import-Module Az.Accounts -MinimumVersion 2.2.0 -PassThru
          $useSecureString = $m.Version -ge [version]'2.17.0'

          $params = @{
            ResourceUrl = "${A}"
          }

          if ($tenantId.Length -gt 0) {
            $params["TenantId"] = $tenantId
          }

          if ($useSecureString) {
            $params["AsSecureString"] = $true
          }

          $token = Get-AzAccessToken @params

          $result = New-Object -TypeName PSObject
          $result | Add-Member -MemberType NoteProperty -Name ExpiresOn -Value $token.ExpiresOn
          if ($useSecureString) {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value (ConvertFrom-SecureString -AsPlainText $token.Token)
          } else {
            $result | Add-Member -MemberType NoteProperty -Name Token -Value $token.Token
          }

          Write-Output (ConvertTo-Json $result)
          `]
      ]))[0];
      return HA5(I)
    }
    throw Error("Unable to execute PowerShell. Ensure that it is installed in your system")
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async () => {
      let B = HE(this.tenantId, Q, this.additionallyAllowedTenantIds),
        G = typeof A === "string" ? A : A[0];
      if (B) qU(Ah, B);
      try {
        sZA(G, Ah), Ah.getToken.info(`Using the scope ${G}`);
        let Z = l11(G),
          I = await this.getAzurePowerShellAccessToken(Z, B, this.timeout);
        return Ah.getToken.info(mF(A)), {
          token: I.Token,
          expiresOnTimestamp: new Date(I.ExpiresOn).getTime(),
          tokenType: "Bearer"
        }
      } catch (Z) {
        if (DA5(Z)) {
          let Y = new p9(mr1.installed);
          throw Ah.getToken.info(d7(G, Y)), Y
        } else if (KA5(Z)) {
          let Y = new p9(mr1.login);
          throw Ah.getToken.info(d7(G, Y)), Y
        }
        let I = new p9(`${Z}. ${mr1.troubleshoot}`);
        throw Ah.getToken.info(d7(G, I)), I
      }
    })
  }
}
// @from(Start 8310949, End 8311462)
async function HA5(A) {
  let Q = /{[^{}]*}/g,
    B = A.match(Q),
    G = A;
  if (B) try {
    for (let Z of B) try {
      let I = JSON.parse(Z);
      if (I === null || I === void 0 ? void 0 : I.Token) {
        if (G = G.replace(Z, ""), G) Ah.getToken.warning(G);
        return I
      }
    } catch (I) {
      continue
    }
  } catch (Z) {
    throw Error(`Unable to parse the output of PowerShell. Received output: ${A}`)
  }
  throw Error(`No access token found in the output. Received output: ${A}`)
}
// @from(Start 8311467, End 8311469)
Ah
// @from(Start 8311471, End 8311474)
QeB
// @from(Start 8311476, End 8311479)
GeB
// @from(Start 8311481, End 8311484)
mr1
// @from(Start 8311486, End 8311538)
KA5 = (A) => A.message.match(`(.*)${GeB.login}(.*)`)
// @from(Start 8311542, End 8311585)
DA5 = (A) => A.message.match(GeB.installed)
// @from(Start 8311589, End 8311592)
dr1
// @from(Start 8311598, End 8312433)
ZeB = L(() => {
  vT();
  jW();
  rZA();
  DE();
  etB();
  Yq();
  Ah = W7("AzurePowerShellCredential"), QeB = process.platform === "win32";
  GeB = {
    login: "Run Connect-AzAccount to login",
    installed: "The specified module 'Az.Accounts' with version '2.2.0' was not loaded because no valid module file was found in any module directory"
  }, mr1 = {
    login: "Please run 'Connect-AzAccount' from PowerShell to authenticate before using this credential.",
    installed: `The 'Az.Account' module >= 2.2.0 is not installed. Install the Azure Az PowerShell module with: "Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force".`,
    troubleshoot: "To troubleshoot, visit https://aka.ms/azsdk/js/identity/powershellcredential/troubleshoot."
  }, dr1 = [BeB("pwsh")];
  if (QeB) dr1.push(BeB("powershell"))
})
// @from(Start 8312435, End 8313494)
class lr1 {
  constructor(...A) {
    this._sources = [], this._sources = A
  }
  async getToken(A, Q = {}) {
    let {
      token: B
    } = await this.getTokenInternal(A, Q);
    return B
  }
  async getTokenInternal(A, Q = {}) {
    let B = null,
      G, Z = [];
    return YY.withSpan("ChainedTokenCredential.getToken", Q, async (I) => {
      for (let Y = 0; Y < this._sources.length && B === null; Y++) try {
        B = await this._sources[Y].getToken(A, I), G = this._sources[Y]
      } catch (J) {
        if (J.name === "CredentialUnavailableError" || J.name === "AuthenticationRequiredError") Z.push(J);
        else throw pr1.getToken.info(d7(A, J)), J
      }
      if (!B && Z.length > 0) {
        let Y = new ti1(Z, "ChainedTokenCredential authentication failed.");
        throw pr1.getToken.info(d7(A, Y)), Y
      }
      if (pr1.getToken.info(`Result for ${G.constructor.name}: ${mF(A)}`), B === null) throw new p9("Failed to retrieve a valid token");
      return {
        token: B,
        successfulCredential: G
      }
    })
  }
}
// @from(Start 8313499, End 8313502)
pr1
// @from(Start 8313508, End 8313587)
IeB = L(() => {
  DE();
  jW();
  Yq();
  pr1 = W7("ChainedTokenCredential")
})
// @from(Start 8313721, End 8315910)
class ir1 {
  constructor(A, Q, B, G = {}) {
    if (!A || !Q) throw Error(`${vNA}: tenantId and clientId are required parameters.`);
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.sendCertificateChain = G.sendCertificateChain, this.certificateConfiguration = Object.assign({}, typeof B === "string" ? {
      certificatePath: B
    } : B);
    let Z = this.certificateConfiguration.certificate,
      I = this.certificateConfiguration.certificatePath;
    if (!this.certificateConfiguration || !(Z || I)) throw Error(`${vNA}: Provide either a PEM certificate in string form, or the path to that certificate in the filesystem. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    if (Z && I) throw Error(`${vNA}: To avoid unexpected behaviors, providing both the contents of a PEM certificate and the path to a PEM certificate is forbidden. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.`);
    this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: JeB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${vNA}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, JeB);
      let G = Array.isArray(A) ? A : [A],
        Z = await this.buildClientCertificate();
      return this.msalClient.getTokenByClientCertificate(G, Z, B)
    })
  }
  async buildClientCertificate() {
    var A;
    let Q = await zA5(this.certificateConfiguration, (A = this.sendCertificateChain) !== null && A !== void 0 ? A : !1),
      B;
    if (this.certificateConfiguration.certificatePassword !== void 0) B = CA5({
      key: Q.certificateContents,
      passphrase: this.certificateConfiguration.certificatePassword,
      format: "pem"
    }).export({
      format: "pem",
      type: "pkcs8"
    }).toString();
    else B = Q.certificateContents;
    return {
      thumbprint: Q.thumbprint,
      thumbprintSha256: Q.thumbprintSha256,
      privateKey: B,
      x5c: Q.x5c
    }
  }
}
// @from(Start 8315911, End 8316603)
async function zA5(A, Q) {
  let {
    certificate: B,
    certificatePath: G
  } = A, Z = B || await EA5(G, "utf8"), I = Q ? Z : void 0, Y = /(-+BEGIN CERTIFICATE-+)(\n\r?|\r\n?)([A-Za-z0-9+/\n\r]+=*)(\n\r?|\r\n?)(-+END CERTIFICATE-+)/g, J = [], W;
  do
    if (W = Y.exec(Z), W) J.push(W[3]); while (W);
  if (J.length === 0) throw Error("The file at the specified path does not contain a PEM-encoded certificate.");
  let X = YeB("sha1").update(Buffer.from(J[0], "base64")).digest("hex").toUpperCase(),
    V = YeB("sha256").update(Buffer.from(J[0], "base64")).digest("hex").toUpperCase();
  return {
    certificateContents: Z,
    thumbprintSha256: V,
    thumbprint: X,
    x5c: I
  }
}
// @from(Start 8316608, End 8316643)
vNA = "ClientCertificateCredential"
// @from(Start 8316647, End 8316650)
JeB
// @from(Start 8316656, End 8316723)
WeB = L(() => {
  yNA();
  vT();
  jW();
  Yq();
  JeB = W7(vNA)
})
// @from(Start 8316725, End 8317920)
class nr1 {
  constructor(A, Q, B, G = {}) {
    if (!A) throw new p9("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!Q) throw new p9("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!B) throw new p9("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    this.clientSecret = B, this.tenantId = A, this.additionallyAllowedTenantIds = NU(G === null || G === void 0 ? void 0 : G.additionallyAllowedTenants), this.msalClient = Ol(Q, A, Object.assign(Object.assign({}, G), {
      logger: XeB,
      tokenCredentialOptions: G
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, XeB);
      let G = p11(A);
      return this.msalClient.getTokenByClientSecret(G, this.clientSecret, B)
    })
  }
}
// @from(Start 8317925, End 8317928)
XeB
// @from(Start 8317934, End 8318039)
VeB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  rZA();
  Yq();
  XeB = W7("ClientSecretCredential")
})
// @from(Start 8318041, End 8319480)
class ar1 {
  constructor(A, Q, B, G, Z = {}) {
    if (!A) throw new p9("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!Q) throw new p9("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!B) throw new p9("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!G) throw new p9("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    this.tenantId = A, this.additionallyAllowedTenantIds = NU(Z === null || Z === void 0 ? void 0 : Z.additionallyAllowedTenants), this.username = B, this.password = G, this.msalClient = Ol(Q, this.tenantId, Object.assign(Object.assign({}, Z), {
      tokenCredentialOptions: Z !== null && Z !== void 0 ? Z : {}
    }))
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${this.constructor.name}.getToken`, Q, async (B) => {
      B.tenantId = HE(this.tenantId, B, this.additionallyAllowedTenantIds, UA5);
      let G = p11(A);
      return this.msalClient.getTokenByUsernamePassword(G, this.username, this.password, B)
    })
  }
}
// @from(Start 8319485, End 8319488)
UA5
// @from(Start 8319494, End 8319603)
FeB = L(() => {
  yNA();
  vT();
  DE();
  jW();
  rZA();
  Yq();
  UA5 = W7("UsernamePasswordCredential")
})
// @from(Start 8319606, End 8319742)
function wA5() {
  var A;
  return ((A = process.env.AZURE_ADDITIONALLY_ALLOWED_TENANTS) !== null && A !== void 0 ? A : "").split(";")
}
// @from(Start 8319744, End 8320063)
function qA5() {
  var A;
  let Q = ((A = process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN) !== null && A !== void 0 ? A : "").toLowerCase(),
    B = Q === "true" || Q === "1";
  return Qh.verbose(`AZURE_CLIENT_SEND_CERTIFICATE_CHAIN: ${process.env.AZURE_CLIENT_SEND_CERTIFICATE_CHAIN}; sendCertificateChain: ${B}`), B
}
// @from(Start 8320064, End 8322393)
class sr1 {
  constructor(A) {
    this._credential = void 0;
    let Q = ceA($A5).assigned.join(", ");
    Qh.info(`Found the following environment variables: ${Q}`);
    let B = process.env.AZURE_TENANT_ID,
      G = process.env.AZURE_CLIENT_ID,
      Z = process.env.AZURE_CLIENT_SECRET,
      I = wA5(),
      Y = qA5(),
      J = Object.assign(Object.assign({}, A), {
        additionallyAllowedTenantIds: I,
        sendCertificateChain: Y
      });
    if (B) qU(Qh, B);
    if (B && G && Z) {
      Qh.info(`Invoking ClientSecretCredential with tenant ID: ${B}, clientId: ${G} and clientSecret: [REDACTED]`), this._credential = new nr1(B, G, Z, J);
      return
    }
    let W = process.env.AZURE_CLIENT_CERTIFICATE_PATH,
      X = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
    if (B && G && W) {
      Qh.info(`Invoking ClientCertificateCredential with tenant ID: ${B}, clientId: ${G} and certificatePath: ${W}`), this._credential = new ir1(B, G, {
        certificatePath: W,
        certificatePassword: X
      }, J);
      return
    }
    let V = process.env.AZURE_USERNAME,
      F = process.env.AZURE_PASSWORD;
    if (B && G && V && F) Qh.info(`Invoking UsernamePasswordCredential with tenant ID: ${B}, clientId: ${G} and username: ${V}`), Qh.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new ar1(B, G, V, F, J)
  }
  async getToken(A, Q = {}) {
    return YY.withSpan(`${i11}.getToken`, Q, async (B) => {
      if (this._credential) try {
        let G = await this._credential.getToken(A, B);
        return Qh.getToken.info(mF(A)), G
      } catch (G) {
        let Z = new mwA(400, {
          error: `${i11} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
          error_description: G.message.toString().split("More details:").join("")
        });
        throw Qh.getToken.info(d7(A, Z)), Z
      }
      throw new p9(`${i11} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`)
    })
  }
}
// @from(Start 8322398, End 8322401)
$A5
// @from(Start 8322403, End 8322432)
i11 = "EnvironmentCredential"
// @from(Start 8322436, End 8322438)
Qh
// @from(Start 8322444, End 8322790)
KeB = L(() => {
  DE();
  jW();
  WeB();
  VeB();
  FeB();
  vT();
  Yq();
  $A5 = ["AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET", "AZURE_CLIENT_CERTIFICATE_PATH", "AZURE_CLIENT_CERTIFICATE_PASSWORD", "AZURE_USERNAME", "AZURE_PASSWORD", "AZURE_ADDITIONALLY_ALLOWED_TENANTS", "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"];
  Qh = W7(i11)
})
// @from(Start 8322793, End 8323823)
function NA5(A = {}) {
  var Q, B, G, Z;
  (Q = A.retryOptions) !== null && Q !== void 0 || (A.retryOptions = {
    maxRetries: 5,
    retryDelayInMs: 800
  });
  let I = (B = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && B !== void 0 ? B : process.env.AZURE_CLIENT_ID,
    Y = (G = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && G !== void 0 ? G : I,
    J = A === null || A === void 0 ? void 0 : A.managedIdentityResourceId,
    W = process.env.AZURE_FEDERATED_TOKEN_FILE,
    X = (Z = A === null || A === void 0 ? void 0 : A.tenantId) !== null && Z !== void 0 ? Z : process.env.AZURE_TENANT_ID;
  if (J) {
    let V = Object.assign(Object.assign({}, A), {
      resourceId: J
    });
    return new aZA(V)
  }
  if (W && Y) {
    let V = Object.assign(Object.assign({}, A), {
      tenantId: X
    });
    return new aZA(Y, V)
  }
  if (I) {
    let V = Object.assign(Object.assign({}, A), {
      clientId: I
    });
    return new aZA(V)
  }
  return new aZA(A)
}
// @from(Start 8323825, End 8324577)
function LA5(A) {
  var Q, B, G;
  let Z = (Q = A === null || A === void 0 ? void 0 : A.managedIdentityClientId) !== null && Q !== void 0 ? Q : process.env.AZURE_CLIENT_ID,
    I = (B = A === null || A === void 0 ? void 0 : A.workloadIdentityClientId) !== null && B !== void 0 ? B : Z,
    Y = process.env.AZURE_FEDERATED_TOKEN_FILE,
    J = (G = A === null || A === void 0 ? void 0 : A.tenantId) !== null && G !== void 0 ? G : process.env.AZURE_TENANT_ID;
  if (Y && I) {
    let W = Object.assign(Object.assign({}, A), {
      tenantId: J,
      clientId: I,
      tokenFilePath: Y
    });
    return new jAA(W)
  }
  if (J) {
    let W = Object.assign(Object.assign({}, A), {
      tenantId: J
    });
    return new jAA(W)
  }
  return new jAA(A)
}
// @from(Start 8324579, End 8324703)
function MA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new ur1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324705, End 8324829)
function OA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new gr1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324831, End 8324955)
function RA5(A = {}) {
  let Q = A.processTimeoutInMs;
  return new cr1(Object.assign({
    processTimeoutInMs: Q
  }, A))
}
// @from(Start 8324957, End 8325001)
function TA5(A = {}) {
  return new sr1(A)
}
// @from(Start 8325002, End 8325270)
class DeB {
  constructor(A, Q) {
    this.credentialName = A, this.credentialUnavailableErrorMessage = Q
  }
  getToken() {
    return rr1.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`), Promise.resolve(null)
  }
}
// @from(Start 8325275, End 8325278)
rr1
// @from(Start 8325280, End 8325283)
n11
// @from(Start 8325289, End 8326300)
HeB = L(() => {
  ltB();
  atB();
  rtB();
  ZeB();
  IeB();
  KeB();
  br1();
  jW();
  rr1 = W7("DefaultAzureCredential");
  n11 = class n11 extends lr1 {
    constructor(A) {
      let Q = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0,
        B = [OA5, RA5, MA5],
        G = [TA5, LA5, NA5],
        Z = [];
      if (Q) switch (Q) {
        case "dev":
          Z = B;
          break;
        case "prod":
          Z = G;
          break;
        default: {
          let Y = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev'.`;
          throw rr1.warning(Y), Error(Y)
        }
      } else Z = [...G, ...B];
      let I = Z.map((Y) => {
        try {
          return Y(A)
        } catch (J) {
          return rr1.warning(`Skipped ${Y.name} because of an error creating the credential: ${J}`), new DeB(Y.name, J.message)
        }
      });
      super(...I)
    }
  }
})
// @from(Start 8326303, End 8326926)
function or1(A, Q, B) {
  let {
    abortSignal: G,
    tracingOptions: Z
  } = B || {}, I = rwA();
  I.addPolicy(BqA({
    credential: A,
    scopes: Q
  }));
  async function Y() {
    var J;
    let X = (J = (await I.sendRequest({
      sendRequest: (V) => Promise.resolve({
        request: V,
        status: 200,
        headers: V.headers
      })
    }, hT({
      url: "https://example.com",
      abortSignal: G,
      tracingOptions: Z
    }))).headers.get("authorization")) === null || J === void 0 ? void 0 : J.split(" ")[1];
    if (!X) throw Error("Failed to get access token");
    return X
  }
  return Y
}
// @from(Start 8326931, End 8326956)
CeB = L(() => {
  _f()
})
// @from(Start 8326962, End 8327006)
EeB = L(() => {
  HeB();
  CeB();
  FaB()
})
// @from(Start 8327009, End 8327329)
function a11() {
  return {
    error: (A, ...Q) => console.error("[Anthropic SDK ERROR]", A, ...Q),
    warn: (A, ...Q) => console.error("[Anthropic SDK WARN]", A, ...Q),
    info: (A, ...Q) => console.error("[Anthropic SDK INFO]", A, ...Q),
    debug: (A, ...Q) => console.error("[Anthropic SDK DEBUG]", A, ...Q)
  }
}