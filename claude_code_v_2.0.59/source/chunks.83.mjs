
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